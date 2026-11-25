"""Feste "Aehnliche Folgen" der Seitenleiste (Mirko, 25.11.2026: "last episodes einfach nicht mehr drinnen haben, mach es so, dass passende zur
Seite aehnliche Folgen einmalig generiert werden und bei Uebersichtsseiten gar nicht zu sehen ist").

Frueher stand auf jeder Seite mit Seitenleiste die Liste "Neueste Folgen". Jede neue Folge aenderte damit die Bytes fast aller Seiten
(R2-Uploads, Kanten-Cache, tools/page_hashes.py brauchte eine Sonderregel). Jetzt bekommt jede Inhaltsseite (Folge, Entitaet, Blogbeitrag, Video,
Bibliothek, Event, Profil, Gast, Show-Seite) hoechstens 5 thematisch passende Folgen. Die Auswahl wird je Inhalt EINMAL berechnet und in
data/sidebar_related.json gespeichert (der Bot sichert die Datei in .github/workflows/site.yml); spaetere Baus lesen sie nur noch. Neue Folgen
aendern bestehende Seiten also nicht; neue Inhalte bekommen beim ersten Bau ihren Eintrag. Uebersichtsseiten (Listen, Kategorien, Tags,
Paginierung, Show-Start, Gaeste-/Hosts-/Sponsoren-Liste) rufen die Seitenleiste ohne Schluessel auf und zeigen keine Folgen-Karte.

Schluessel je Inhalt, sprachneutral (nicht je Sprachpfad): e:<podpage-slug> (englische Folge und ihre Dub-Fassungen), v:<youtube-id> (Dub-Folge
ohne englisches Original), ent:<id>, g:<gast>, p:<show-seite>, blog:<handle>/<slug>, vid:<slug>, lib:<handle>-<slug>, pod:<slug>, evt:<handle>,
u:<handle>, c:<handle>, live:<slug>.
Eintrag: {"e": [bis zu 5 Slugs der Hauptshow], "v": [YouTube-IDs mit Dub-Fassung]}. Englische Seiten zeigen "e", jede Dub-Sprache die
ersten 5 aus "v", die es in ihrer Sprache gibt. "v" ist so gewaehlt, dass jede Dub-Sprache ihre 5 besten bekommt (Arabisch hat nur fuer gut ein
Drittel der Videos eine Fassung): ein Video kommt in der Rangfolge dazu, solange eine seiner Sprachen noch keine 5 hat (hoechstens NV).
Nicht mehr vorhandene Folgen entfallen beim Ausgeben (der Eintrag bleibt).
Wann ein Eintrag fest wird (fixed): nur mit Treffer (ein leerer Eintrag wird jeden Bau neu gerechnet, bis eine passende Folge existiert, dann
aendert sich die Seite genau einmal), bei einer Folge (e:) erst mit Kernpunkten/FAQ oder nach FRESH_DAYS Tagen (die ersten Baus einer neuen Folge
kennen sonst nur ihren Titel), und nur, wenn der Bau den D1-Export der Entitaeten hatte (Store.save(allow=False) schreibt sonst nichts).
Auswahl ohne KI (vorhandene Logik wie site_podpage.find_episodes): Entitaeten der Seite (Themen-Chips), je Folge Titel 3 Punkte, Nennungen in
Kernpunkten/FAQ bis 3, QA-gepruefte Extraktion +5; die ersten 3 Entitaeten zaehlen doppelt; nur Punkte > 0; Gleichstand: neuer zuerst, dann Slug.
Nie die Seite selbst.
VERSION: nur ein bewusstes Hochzaehlen rechnet alle Eintraege neu (dann aendern sich einmalig alle Seiten mit Seitenleiste).
Notschalter: SIDEBAR_RELATED=0 (keine Folgen-Karte, Datei bleibt unveraendert)."""
import json, os
from pathlib import Path

F = Path(__file__).parent / "data" / "sidebar_related.json"
VERSION = 1
NE, NV, SHOW, NIDS = 5, 24, 5, 12   # gespeicherte EN-Folgen, hoechstens gespeicherte Dub-Videos, angezeigte Folgen, beruecksichtigte Entitaeten
FRESH_DAYS = 30   # eine Folge ohne Kernpunkte/FAQ wird so lange je Bau neu gerechnet (danach fest, auch ohne)
MAX_BYTES = 6_000_000   # Deckel der Datei (Test). Gemessen in der Bau-Probe vom 25.11.2026: 7.418 Schluessel, 3,1 MB (~420 B je Schluessel); Platz fuer gut das Doppelte
DOC = "Feste Aehnliche Folgen der Seitenleiste je Inhalt (site_related.py). Einmal berechnet, danach nur gelesen; nicht von Hand pflegen."


def enabled():
    return os.environ.get("SIDEBAR_RELATED", "1") != "0"


class Store:
    """data/sidebar_related.json: lesen, neue Eintraege merken, mit einem Schluessel je Zeile (sortiert, kleine Diffs) schreiben."""
    def __init__(self, path=F):
        self.path = Path(path); self.items = {}; self.new = 0; self.temp = set()   # temp: nur fuer diesen Bau (fixed), nie geschrieben
        try:
            d = json.loads(self.path.read_text("utf-8"))
            if isinstance(d, dict) and d.get("_v") == VERSION and isinstance(d.get("items"), dict):
                self.items = d["items"]
        except FileNotFoundError:
            pass
        except Exception as ex:   # kaputte Datei: neu berechnen (einmal alle Seiten neu), die alte bleibt bis zum Schreiben stehen
            print("sidebar_related.json nicht lesbar:", ex)

    def get(self, key):
        ent = self.items.get(key)
        if key in self.temp:
            return ent   # in diesem Bau schon gerechnet (vorlaeufig): alle Sprachen gleich
        return ent if ent and (ent.get("e") or ent.get("v")) else None   # leer (aeltere Datei): wie fehlend, wird neu gerechnet

    def put(self, key, entry):
        self.items[key] = {"e": list(entry.get("e") or [])[:NE], "v": list(entry.get("v") or [])[:NV]}; self.new += 1; self.temp.discard(key)
        return self.items[key]

    def dumps(self):
        rows = [json.dumps(k, ensure_ascii=False) + ":" + json.dumps(self.items[k], ensure_ascii=False, separators=(",", ":")) for k in sorted(self.items) if k not in self.temp]
        return '{"_v":' + str(VERSION) + ',"_doc":' + json.dumps(DOC, ensure_ascii=False) + ',"items":{\n' + ",\n".join(rows) + "\n}}\n"

    def save(self, allow=True):
        """Schreibt nur, wenn neue Eintraege dazugekommen sind (sonst bleibt die Datei byte-gleich, kein Bot-Commit). allow=False (Bau ohne
        D1-Export der Entitaeten): nichts schreiben, die Eintraege dieses Baus gelten nur fuer ihn, der naechste rechnet sie neu."""
        if not self.new:
            return False
        if not allow:
            print(f"::warning::Seitenleiste: {self.new} neue Eintraege fuer Aehnliche Folgen NICHT gespeichert (Entitaeten-Export fehlte), der naechste Bau rechnet sie neu")
            return False
        self.path.parent.mkdir(parents=True, exist_ok=True)
        tmp = self.path.with_suffix(".json.tmp"); tmp.write_text(self.dumps(), "utf-8"); tmp.replace(self.path)
        print(f"Seitenleiste: {self.new} neue Eintraege fuer Aehnliche Folgen, {len(self.items)} insgesamt ({self.path.name})")
        self.new = 0
        return True


def _top(tot, date, n):
    xs = sorted(tot)                                  # Slug/ID aufsteigend ...
    xs.sort(key=lambda x: date.get(x) or "", reverse=True)   # ... neuer zuerst (stabil) ...
    xs.sort(key=lambda x: -tot[x])                     # ... nach Punkten
    return xs[:n]


def _score(ids, rank, skip):
    tot = {}
    for r, i in enumerate(list(dict.fromkeys(ids))[:NIDS]):
        w = 2 if r < 3 else 1
        for x, s in (rank(i) or {}).items():
            if s > 0 and x not in skip:
                tot[x] = tot.get(x, 0) + w * s
    return tot


def _cover(ranked, langs_of, n=SHOW, cap=NV):
    """Videos in Rangfolge, bis jede Sprache n hat: ein Video kommt dazu, solange eine seiner Sprachen noch keine n hat. So bekommt jede Sprache
    genau ihre n besten (links() nimmt je Sprache die ersten n vorhandenen), auch Arabisch mit wenigen Fassungen."""
    cnt, out = {}, []
    for v in ranked:
        ls = langs_of(v) or ()
        if any(cnt.get(l, 0) < n for l in ls):
            out.append(v)
            for l in ls: cnt[l] = cnt.get(l, 0) + 1
            if len(out) >= cap: break
    return out


class Picker:
    """Rechnet einen Eintrag aus den Entitaeten der Seite. en_rank(eid) -> {slug: Punkte} (Hauptshow), vid_rank(eid) -> {youtube-id: Punkte}
    (Videos mit Dub-Fassung); en_date/vid_date: Datum fuer den Gleichstand; vid_langs(v): Sprachen mit Dub-Fassung (ohne: jede ein eigener Platz)."""
    def __init__(self, en_rank, vid_rank, en_date, vid_date, vid_langs=None):
        self.en_rank, self.vid_rank, self.en_date, self.vid_date = en_rank, vid_rank, en_date, vid_date
        self.vid_langs = vid_langs or (lambda v: ("*",))

    def pick(self, ids, self_slugs=(), self_vids=()):
        tv = _score(ids, self.vid_rank, set(self_vids))
        return {"e": _top(_score(ids, self.en_rank, set(self_slugs)), self.en_date, NE),
                "v": _cover(_top(tv, self.vid_date, len(tv)), self.vid_langs)}


def build_picker(H, idx, by_vid, orig, dub_hits, episodes_for):
    """Picker aus den Daten eines Baus und {Folge der Hauptshow: ihre YouTube-IDs} (fuer self_of).
    H: site_podpage.ep_hits ({slug: {"t": {eid: n}, "k": {eid: n}}}); idx: site_podpage.episode_index (items, by_sid);
    by_vid: {youtube-id: {sprache: Dub-Folge mit lang, eid, date, e}}; orig: {youtube-id: Slug der englischen Folge} (generate_site ORIG);
    dub_hits(lang, it): Entitaeten aus Titel/Tags einer Dub-Folge; episodes_for(eid): Spreaker-IDs der QA-geprueften Extraktion.
    Punkte wie site_podpage.find_episodes: Titel 3, Kernpunkte/FAQ je Nennung 1 (hoechstens 3), Extraktion +5."""
    inv = {}
    for sl, h in H.items():
        for i in (h.get("t") or {}):
            d = inv.setdefault(i, {}); d[sl] = d.get(sl, 0) + 3
        for i, n in (h.get("k") or {}).items():
            d = inv.setdefault(i, {}); d[sl] = d.get(sl, 0) + min(n, 3)
    enc, vc = {}, {}

    def en_rank(i):
        if i not in enc:
            r = dict(inv.get(i) or {})
            for sid in episodes_for(i):
                it = idx["by_sid"].get(sid)
                if it: r[it["slug"]] = r.get(it["slug"], 0) + 5
            enc[i] = r
        return enc[i]

    ref = {v: (ls.get("de") or ls[sorted(ls)[0]]) for v, ls in by_vid.items() if ls and v not in orig}   # Video ohne englisches Original: eine Fassung fuer Titel/Tags (Deutsch, sonst die erste)
    dinv = {}
    for v, it in ref.items():
        for i in dub_hits(it["lang"], it): dinv.setdefault(i, set()).add(v)
    o2v = {}
    for v, sl in orig.items():
        if v in by_vid: o2v.setdefault(sl, []).append(v)
    e2v = {str(x["eid"]): v for v, ls in by_vid.items() for x in ls.values()}   # Spreaker-ID einer Dub-Fassung -> Video (Extraktion)

    def vid_rank(i):
        if i not in vc:
            r = {}
            for sl, sc in en_rank(i).items():   # Video mit englischem Original: Punkte seiner Hauptshow-Folge (samt deren Extraktion)
                for v in o2v.get(sl, ()): r[v] = max(r.get(v, 0), sc)
            for v in dinv.get(i, ()): r[v] = r.get(v, 0) + 3
            for sid in set(episodes_for(i)):
                v = e2v.get(str(sid))
                if v and v not in orig: r[v] = r.get(v, 0) + 5
            vc[i] = r
        return vc[i]

    vd = {v: max(x["date"] for x in ls.values()) for v, ls in by_vid.items() if ls}
    yts = {}   # Folge der Hauptshow -> ihre YouTube-Videos (Dub-Zuordnung und Podpage/Extraktion)
    for v, sl in orig.items(): yts.setdefault(sl, set()).add(v)
    for it in idx["items"]:
        if it.get("yt"): yts.setdefault(it["slug"], set()).add(it["yt"])
    return Picker(en_rank, vid_rank, {it["slug"]: it["date"] for it in idx["items"]}, vd, lambda v: tuple(sorted(by_vid.get(v) or ()))), yts


def ids_for(key, H, live, chips=lambda: [], exclude=()):
    """Entitaeten, nach denen ein Inhalt seine Folgen waehlt. Folge (e:<slug>): ihre erkannten Entitaeten aus ep_hits (Titel zuerst, dann
    Kernpunkte/FAQ nach Nennungen), in allen Sprachen gleich; sonst die eigene Entitaet der Seite (exclude, z. B. Entitaetsseite) und dann
    dieselbe Liste wie die Themen-Chips (chips()). live: erlaubte Entitaeten (site_sidebar.Index.by: ohne Kategorien und Host)."""
    if key.startswith("e:") and key[2:] in H:
        h = H[key[2:]]; k = h.get("k") or {}
        out = [i for i in list(h.get("t") or {}) + sorted(k, key=lambda i: -k[i]) if i in live]
        if out:
            return list(dict.fromkeys(out))
    return list(dict.fromkeys(list(exclude or ()) + list(chips())))


def fixed(store, key, compute, final=True):
    """Der feste Eintrag eines Inhalts: vorhanden -> unveraendert zurueck, sonst compute(). Gespeichert (fest) wird nur ein Eintrag mit Treffer und
    final=True; sonst gilt er nur fuer diesen Bau (alle Sprachen gleich) und wird beim naechsten neu gerechnet."""
    ent = store.get(key)
    if ent is not None:
        return ent
    ent = compute()
    if final and (ent.get("e") or ent.get("v")):
        return store.put(key, ent)
    ent = {"e": list(ent.get("e") or [])[:NE], "v": list(ent.get("v") or [])[:NV]}
    store.items[key] = ent; store.temp.add(key)   # nur im Speicher (vorlaeufig): alle Sprachen dieses Baus gleich, nie geschrieben
    return ent


def episode_final(it, today, days=FRESH_DAYS):
    """Eintrag einer Folge der Hauptshow (episode_index-Eintrag) fest machen? Mit Kernpunkten oder FAQ, oder wenn sie aelter als days Tage ist."""
    if not it or it.get("keypoints") or it.get("faq"):
        return True
    import datetime as _dt
    try:
        return (_dt.date.fromisoformat(str(today)[:10]) - _dt.date.fromisoformat(str(it.get("date"))[:10])).days > days
    except ValueError:
        return True


def links(entry, lang, en_link, dub_link, n=SHOW):
    """[(url, titel)] fuer die Sprache der Seite: en aus "e", Dub-Sprachen die ersten n aus "v", die es in der Sprache gibt."""
    if not entry:
        return []
    xs = [en_link(s) for s in entry.get("e") or ()] if lang == "en" else [dub_link(v, lang) for v in entry.get("v") or ()]
    return [x for x in xs if x][:n]


def self_of(key, vids_of_slug=lambda s: (), slugs_of_vid=lambda v: ()):
    """(eigene Slugs, eigene YouTube-IDs) einer Folgen-Seite, damit die Seite sich nie selbst empfiehlt (auch nicht als andere Sprachfassung)."""
    if key.startswith("e:"):
        s = key[2:]
        return {s}, set(vids_of_slug(s) or ())
    if key.startswith("v:"):
        v = key[2:]
        return set(slugs_of_vid(v) or ()), {v}
    return set(), set()


class Related:
    """Die festen "Aehnlichen Folgen" eines Baus (aus generate_site.build herausgeloest, damit tests/test_sidebar_related.py den Weg mit echten
    Aufrufen prueft). load() -> (episode_index, ep_hits), erst beim ersten neuen Schluessel; by_vid/orig/dub_hits/episodes_for wie build_picker;
    live: erlaubte Entitaeten (site_sidebar.Index.by); chips(lang, text, ids, exclude) -> Entitaets-IDs der Themen-Chips; url_of(dub-folge) und
    anchor(titel) fuer die Linkziele der Dub-Sprachen; today: Datum des Baus (episode_final)."""
    def __init__(self, store, load, by_vid, orig, dub_hits, episodes_for, live, chips, url_of, anchor=lambda t: t, today=""):
        self.store, self._load, self.by_vid, self.orig, self.dub_hits, self.episodes_for = store, load, by_vid, orig, dub_hits, episodes_for
        self.live, self.chips, self.url_of, self.anchor, self.today = live, chips, url_of, anchor, today
        self._idx = self._picker = None

    def index(self):
        if self._idx is None:
            self._idx = self._load()
        return self._idx

    def picker(self):
        if self._picker is None:
            ix, H = self.index()
            self._picker = build_picker(H, ix, self.by_vid, self.orig, self.dub_hits, self.episodes_for)
        return self._picker

    def entry(self, l, key, text="", ids=None, exclude=()):
        def compute():
            P, yts = self.picker(); _ix, H = self.index()
            rid = ids_for(key, H, self.live, lambda: list(self.chips(l, text, ids, exclude)), exclude)
            ss, sv = self_of(key, lambda s: yts.get(s, ()), lambda v: {self.orig[v]} if v in self.orig else ())
            return P.pick(rid, ss, sv)
        final = True
        if key.startswith("e:") and self.store.get(key) is None:
            final = episode_final(self.index()[0]["by_slug"].get(key[2:]), self.today)
        return fixed(self.store, key, compute, final)

    def links_for(self, l, key, text="", ids=None, exclude=()):
        """[(url, titel)] in der Sprache der Seite; ohne key (Uebersichtsseiten) oder mit SIDEBAR_RELATED=0: None (keine Folgen-Karte)."""
        if not key or not enabled():
            return None
        ent = self.entry(l, key, text, ids, exclude)
        bys = self.index()[0]["by_slug"] if l == "en" else {}
        en_link = lambda s: (bys[s]["url"], bys[s]["e"]["title"]) if s in bys else None
        dub_link = lambda v, lg: (self.url_of(self.by_vid[v][lg]), self.anchor(self.by_vid[v][lg]["e"]["title"])) if lg in self.by_vid.get(v, {}) else None
        return links(ent, l, en_link, dub_link)
