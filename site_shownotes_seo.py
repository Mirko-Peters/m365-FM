"""Neu geschriebene englische Show Notes (rewrite_shownotes.py): Speicher, Regel und Darstellung, ohne Netzwerk beim Import.
Speicher: data/shownotes_en/<bucket>.json.gz {slug: {h_src, v, notes, model, ts}}, bucket = erstes Hex-Zeichen von sha1(slug) (16 Dateien).
notes: {meta, summary, key_points[], chapters[{t, title}], entities[id], faq[{q, a}]} - reiner Text, Links setzt nur dieser Code (Entitaetsseiten).
Regel (Mirko, 9.11.2026): Neu geschriebene Notes ersetzen die bisherigen NUR, wo diese duenn sind (weniger als THIN_CHARS reine Textzeichen). Jede andere
Folgenseite bleibt, wie sie ist: kein neuer Block, keine andere Beschreibung, kein anderes JSON-LD. rule() ist die EINE Stelle, die das entscheidet - fuer den
Seitenbau (site_podpage), die Auswahl der bezahlten Anfragen (rewrite_shownotes) und die Quelle der Uebersetzung (translate_show.notes_source)."""
import gzip, hashlib, html as _h, json, os, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DIR = ROOT / "data" / "shownotes_en"
_CACHE = {}
THIN_CHARS = 1500   # duenn = weniger reine Textzeichen als das (nach dem Bereinigen wie im Seitenbau: site_podpage.san + plain)
RULES = {"thin": "duenn - wird ersetzt", "long": "ausfuehrlich - bleibt", "edited": "im Show-Notes-Editor bearbeitet - bleibt", "full": "QA-gepruefte Vollfassung - bleibt",
         "unknown": "duenn, aber Export der Editor-Fassungen nicht abrufbar - bleibt, bis er wieder antwortet"}


def bucket(slug):
    return hashlib.sha1(slug.encode("utf-8")).hexdigest()[0]


def _path(b, d=None):
    return (d or DIR) / f"{b}.json.gz"


def load_bucket(b, d=None):
    p = _path(b, d)
    if not p.exists():
        return {}
    try:
        with gzip.open(p, "rt", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def load_all(d=None):
    out = {}
    for b in "0123456789abcdef":
        out.update(load_bucket(b, d))
    return out


def save_all(store, d=None):
    """Schreibt alle 16 Buckets neu (stabile Reihenfolge, damit Git-Diffs klein bleiben); leere Buckets werden entfernt."""
    d = d or DIR; d.mkdir(parents=True, exist_ok=True)
    by = {}
    for slug, rec in store.items():
        by.setdefault(bucket(slug), {})[slug] = rec
    for b in "0123456789abcdef":
        p = _path(b, d)
        if b not in by:
            p.unlink(missing_ok=True); continue
        with open(p, "wb") as raw, gzip.GzipFile(fileobj=raw, mode="wb", mtime=0) as gz:
            gz.write(json.dumps(by[b], ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8"))


def get(slug):
    """Gespeicherte Notes einer Folge oder None (Zwischenspeicher je Prozess)."""
    b = bucket(slug)
    if b not in _CACHE:
        _CACHE[b] = load_bucket(b)
    rec = _CACHE[b].get(slug)
    return rec["notes"] if rec and rec.get("notes") else None


# ------------------------------------------------------------------ Regel: nur duenne Show Notes werden ersetzt
def old_notes(e, nrec=None):
    """Bisherige Show Notes einer Folge als HTML, so wie die Folgenseite sie ohne Neufassung zeigt: Spreaker-Text bzw. Editor-Fassung (site_notes), sonst die
    Podpage-Sicherung. e = Folge aus site_podpage.load("episodes"), nrec = site_notes.get("en", title=...)."""
    import show_notes as SN
    import site_podpage as P
    return SN.render_html(nrec["markup"]) if nrec and nrec.get("markup") else P.san(e.get("show_notes"))


def is_thin(html):
    """Duenn = weniger als THIN_CHARS reine Textzeichen (Tags weg, Entities aufgeloest, Leerraum zusammengefasst)."""
    import site_podpage as P
    return len(P.plain(html)) < THIN_CHARS


def rule(e, nrec=None, full=False, edits_known=None, html=None):
    """Darf die Neufassung die bisherigen Show Notes dieser Folge ersetzen? -> Schluessel aus RULES; nur "thin" heisst ja.
    full = die Folge hat eine QA-gepruefte Vollfassung (shownotes/site). edits_known = der Export der Editor-Fassungen liegt vor (Standard: site_notes.EDITS);
    fehlt er, ist bei Folgen mit Spreaker-Datensatz unbekannt, ob sie bearbeitet sind - dann wird nichts ersetzt und nichts bezahlt.
    html = old_notes(e, nrec), falls der Aufrufer es schon berechnet hat (der Seitenbau bereinigt die Podpage-Notes ohnehin)."""
    if full: return "full"
    if (nrec or {}).get("edited"): return "edited"
    if not is_thin(old_notes(e, nrec) if html is None else html): return "long"
    if nrec and edits_known is None:
        import site_notes as SNT
        edits_known = SNT.EDITS["known"]
    return "unknown" if nrec and not edits_known else "thin"


class Pages:
    """Stand der englischen Folgenseiten fuer Skripte ausserhalb des Seitenbaus (rewrite_shownotes, translate_notes): dieselben Quellen wie site_podpage.build -
    Spreaker-Show-Notes und Editor-Fassungen (site_notes), Zuordnung zur Spreaker-Folge (data/en_episodes.json), QA-gepruefte Vollfassungen (site_shownotes)."""

    def __init__(self, root=None):
        import site_notes as SNT
        import site_shownotes as SNS
        self.root = Path(root) if root else ROOT
        if not SNT.NOTES:   # der Seitenbau hat schon geladen (generate_site: SNT.load); Skripte laden hier selbst
            SNT.load(os.environ.get("COMMUNITY_API") or "https://api-dub.m365.fm")
        f = self.root / "data" / "en_episodes.json"
        self.enx = json.loads(f.read_text("utf-8")) if f.exists() else {}
        self.by_id = {str(v["spreaker_id"]): v for v in self.enx.values() if v.get("spreaker_id")}
        import site_extract as SX
        self.full = SNS.load_all(self.root / "shownotes" / "site", SX.qa_ok(self.root / "shownotes" / "QA.txt"))   # nur von der QA freigegebene, wie im Seitenbau
        self._r = {}

    def facts(self, e):
        """-> (nrec, r, sid, full): Show-Notes-Datensatz, Eintrag aus en_episodes.json, Spreaker-ID, Vollfassung vorhanden (wie site_podpage.build)."""
        import site_notes as SNT
        import site_podpage as P
        nrec = SNT.get("en", title=e["name"])
        r = self.by_id.get(str(e["spreaker_id"])) if e.get("spreaker_id") else self.enx.get(P.norm(e["name"]))
        sid = str((nrec or {}).get("id") or (r or {}).get("spreaker_id") or "")
        return nrec, r, sid, bool(sid and sid in self.full)

    def rule(self, e):
        if e["slug"] not in self._r:
            nrec, _, _, full = self.facts(e); self._r[e["slug"]] = rule(e, nrec, full)
        return self._r[e["slug"]]


_PAGES = []


def pages():
    """Ein Pages-Objekt je Prozess (Skripte)."""
    if not _PAGES: _PAGES.append(Pages())
    return _PAGES[0]


def source_for_translation(e):
    """Quelle der Uebersetzung, wenn die englische Folgenseite die Neufassung zeigt (duenn, nicht bearbeitet, keine Vollfassung, Neufassung vorhanden): deren
    schlanke HTML-Fassung. Sonst None - dann uebersetzt translate_notes die bisherigen Show Notes."""
    n = get(e["slug"])
    return html_for_translation(n) if n and pages().rule(e) == "thin" else None


def undecided(e):
    """Neufassung vorhanden, aber unbekannt, ob die Folge inzwischen im Editor bearbeitet ist (Export nicht abrufbar): translate_notes laesst sie in dem Lauf aus."""
    return bool(get(e["slug"])) and pages().rule(e) == "unknown"


def esc(s):
    return _h.escape(str(s), quote=True)


def _links(ids, ents, base):
    out = []
    for i in ids:
        e = ents.get(i)
        if e and e.get("name"):
            out.append((e["name"], f"{base}/entity/{i}/"))
    return out


def html_for_translation(notes, labels=None):
    """Schlanke HTML-Fassung der Notes (p, h2, h3, ul, li) als Quelle der Uebersetzung (translate_notes.py); Kapitelzeiten bleiben unveraendert.
    Ohne die Themen-Zeile mit den Entitaetslinks: die setzt der Seitenbau selbst (topics_html), sonst wuerde jede Aenderung an einer Entitaet (Name, Zusammenlegung)
    den Quell-Hash aller Folgen aendern, die sie nennen, und sie als veraltet melden."""
    L = labels or {}
    o = [f"<p><strong>{esc(notes['summary'])}</strong></p>"]
    if notes.get("key_points"):
        o.append(f"<h2>{esc(L.get('kp', 'Key points'))}</h2><ul>" + "".join(f"<li>{esc(x)}</li>" for x in notes["key_points"]) + "</ul>")
    if notes.get("chapters"):
        o.append(f"<h2>{esc(L.get('ch', 'In this episode'))}</h2><ul>" + "".join(f"<li>{esc(c['t'])} {esc(c['title'])}</li>" for c in notes["chapters"]) + "</ul>")
    if notes.get("faq"):
        o.append(f"<h2>{esc(L.get('faq', 'FAQ'))}</h2>" + "".join(f"<h3>{esc(x['q'])}</h3><p>{esc(x['a'])}</p>" for x in notes["faq"]))
    return "".join(o)


def topics_html(notes, ents, base, label="Topics"):
    """Themen-Zeile: Links auf die Entitaetsseiten der Folge (nur dieser Code setzt Links). Englische Seite: in render(); Sprachfassungen: site_podpage haengt sie
    mit dem Wort der Sprache (site_taxonomy.TOPICS) an die uebersetzten Notes."""
    lk = _links((notes or {}).get("entities") or [], ents, base)
    return (f'<p class="mut">{esc(label)}: ' + ", ".join(f'<a href="{esc(u)}">{esc(n)}</a>' for n, u in lk) + "</p>") if lk else ""


def render(notes, ents, base):
    """-> (kp_html, notes_html, faq_html, jsonld_list) im Aufbau der bisherigen Bloecke (Kernpunkte-Kasten, Notes, FAQ mit FAQPage)."""
    import site_notes as SNT
    import site_shownotes as SNS
    kp, faq_html, ld = SNT.sections(notes.get("key_points"), notes.get("faq"), "en")
    o = [f'<p class="sn-hook"><strong>{esc(notes["summary"])}</strong></p>']
    if notes.get("chapters"):
        o.append('<h2>In this episode</h2><ol class="sn-list sn-ch">' + "".join(f'<li><time class="sn-t">{esc(c["t"])}</time> {esc(c["title"])}</li>' for c in notes["chapters"]) + "</ol>")
    o.append(topics_html(notes, ents, base))
    return kp, '<section class="shownotes sn">' + "".join(o) + f"</section><style>{SNS.CSS}</style>", faq_html, ld


def choose(slug, ents, base, old):
    """Seitenbau, NUR fuer Folgen mit rule() == "thin" aufrufen: old = (nkp, nnotes, nfaq, nld) der bisherigen Show Notes. Gibt es neu geschriebene Notes,
    ersetzen sie Kernpunkte, Notes und FAQ; das FAQPage-Schema kommt dann genau einmal (aus den neuen Notes, das alte entfaellt). Ohne Eintrag bleibt old
    unveraendert. -> (nkp, nnotes, nfaq, nld, benutzt)"""
    nkp, nnotes, nfaq, nld = old
    n = get(slug)
    if not n:
        return nkp, nnotes, nfaq, nld, False
    kp, html, faq, ld = render(n, ents, base)
    if faq:
        nld = [x for x in nld if x.get("@type") != "FAQPage"] + ld
    else:
        faq = nfaq   # neue Notes ohne FAQ: bisherige FAQ samt Schema bleiben
    return kp or nkp, html, faq, nld, True


def for_page(e, nrec, full, old, ents, base, html=None):
    """Seitenbau (site_podpage) fuer eine englische Folgenseite: die ganze Entscheidung an einer Stelle. old = (nkp, nnotes, nfaq, nld) wie bisher.
    -> (nkp, nnotes, nfaq, nld, beschreibung, regel, neufassung): nur bei rule() == "thin" und vorhandener Neufassung ersetzt sie die Bloecke; sonst kommt old
    unveraendert zurueck (gleiche Objekte, also gleiches HTML und JSON-LD). beschreibung = eine von Hand gesetzte meta_description der Folge, sonst die der
    Neufassung (nur wenn sie benutzt wird), sonst "" (dann nimmt der Aufrufer die bisherige Kurzbeschreibung). neufassung = die benutzten Notes oder None."""
    r = rule(e, nrec, full, html=html)
    if r != "thin":
        return (*old, e.get("meta_description") or "", r, None)
    nkp, nnotes, nfaq, nld, used = choose(e["slug"], ents, base, old)
    n = get(e["slug"]) if used else None
    return nkp, nnotes, nfaq, nld, e.get("meta_description") or (n or {}).get("meta") or "", r, n
