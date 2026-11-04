"""T37 Sponsor: Kennzeichnung bezahlter Inhalte (FTC Endorsement Guides, EU-UGP-Richtlinie Anhang I Nr. 11, § 5a Abs. 4 UWG, § 6 DDG)
aus data/sponsorships.json. Laden, pruefen (ungueltige Eintraege brechen den Seitenbau ab) und die Bausteine fuer die Seiten:
sichtbare Kennzeichnung direkt unter der H1, Badge fuer Listen, JSON-LD "sponsor" (Organization), rel="sponsored" fuer Links zum Sponsor.

Format von data/sponsorships.json (das Repo ist oeffentlich: nur, was ohnehin auf den Seiten steht, KEINE Preise, Pakete oder Vertragsbedingungen;
unbekannte Felder sind deshalb ein Fehler):

  {
    "version": 1,
    "sponsorships": [
      {
        "id": "acme-2026-12",                      eindeutig, Kleinbuchstaben, Ziffern, Bindestrich
        "sponsor": {"name": "Acme", "url": "https://acme.example/"},
                                                   Name so, wie er in der Kennzeichnung stehen soll; Website des Sponsors (https, nicht m365.fm)
        "label": "sponsored",                      "sponsored": bezahlte Partnerschaft - EN "Sponsored · Paid partnership with Acme", DE "Anzeige · Bezahlte Partnerschaft mit Acme"
                                                   "advertisement": vom Sponsor beauftragter Inhalt (PR-Artikel) - EN "Advertisement · Paid content on behalf of Acme",
                                                   DE "Anzeige · Bezahlter Inhalt im Auftrag von Acme"
        "start": "2026-12-01", "end": "2027-05-31",
                                                   Laufzeit, ISO-Datum, beide Tage eingeschlossen
        "entities": ["acme-backup"],               optional: Entitaeten des Sponsors (ids aus data/entities.json bzw. der Entitaetsdatenbank).
                                                   Nur waehrend der Laufzeit: Kennzeichnung auf der Entitaetsseite, Badge in der Entitaetsliste,
                                                   WebPage.sponsor, Link "Offizielle Website" mit rel="sponsored noopener"
        "topics": ["entra-id"],                    optional: Themen-Sponsoring (Entitaets-ids vom Typ product, platform, concept, category, cert).
                                                   Wie "entities", aber rel="sponsored" nur fuer Links auf die Website des Sponsors (die offizielle Website
                                                   eines Microsoft-Produkts ist kein bezahlter Link). Hoechstens 3 Themen-Sponsorings je Thema gleichzeitig
        "episodes": ["<slug>", "de/<slug>"],       optional: Folgen. "<slug>" = englische Show (/show/episodes/<slug>/), "<sprache>/<slug>" = Dub-Folge (/de/<slug>/);
                                                   auch volle Pfade wie "/show/episodes/<slug>/". Gilt fuer alle Sprachfassungen der Folge (englische Seite,
                                                   lokalisierte Show-Seiten, Dub-Folgen desselben Videos) und DAUERHAFT, auch nach dem Ende der Laufzeit
        "posts": ["/community/u/mirko-p/blog/<slug>/"],
        "go": "acme-2026-12"                        optionaler aktiver Linkcode aus dem Sponsor-Dashboard
                                                   optional: Blogbeitraege (Pfad, mit oder ohne Sprachpraefix); gilt fuer alle Sprachfassungen, dauerhaft
      }
    ]
  }

Felder, die mit "_" beginnen, sind nur auf oberster Ebene erlaubt (Hinweise, z. B. "_doc").
Pruefungen beim Bau: Aufbau und Felder, Datumsangaben (start <= end), unbekannte Entitaeten, Themen, Folgen und Beitraege,
hoechstens TOPIC_MAX gleichzeitig laufende Themen-Sponsorings je Thema (an jedem Tag, auch in der Zukunft), Uebersetzungen der Kennzeichnung
fuer alle 15 Sprachen in data/py_i18n.json. Mit SITE_OFFLINE=1 (lokaler Bau ohne Community-API) werden unbekannte Verweise nur gemeldet.
Zum Testen: Umgebungsvariable M365_SPONSORSHIPS = Pfad einer anderen Datei (nie echte Daten aus Tests committen)."""
import json, os, re
from datetime import date
from html import escape
from pathlib import Path
from site_i18n import COMM_LANGS, T

FILE = Path(__file__).parent / "data" / "sponsorships.json"
I18N = Path(__file__).parent / "data" / "py_i18n.json"
ENV = "M365_SPONSORSHIPS"
LABELS = ("sponsored", "advertisement")
TOPIC_MAX = 3   # "max. 3 sponsors per topic" (Sponsor-Seite); der Bau prueft es hier
TOPIC_TYPES = ("product", "platform", "concept", "category", "cert")
REC_KEYS = ("id", "sponsor", "label", "start", "end", "entities", "topics", "episodes", "posts", "go")
REF_KEYS = ("entities", "topics", "episodes", "posts")
# Kennzeichnung je Art: (Badge en, Badge de, Zusatz en, Zusatz de). Die 13 weiteren Sprachen sind von Hand in data/py_i18n.json gepflegt
# (Schluessel = englischer Text); T() zieht sie dort den maschinellen Uebersetzungen vor. Deutsch immer "Anzeige".
TEXT = {"sponsored": ("Sponsored", "Anzeige", "Paid partnership with {sponsor}", "Bezahlte Partnerschaft mit {sponsor}"),
        "advertisement": ("Advertisement", "Anzeige", "Paid content on behalf of {sponsor}", "Bezahlter Inhalt im Auftrag von {sponsor}")}
NOTE_STYLE = ("border:1px solid var(--bd);border-inline-start:4px solid var(--ac,#0a5);background:var(--card);"
              "padding:.45em .9em;border-radius:.4em;margin:.5em 0 .8em;font-size:.95em")
_ID = re.compile(r"^[a-z0-9][a-z0-9-]{1,63}$")
_DAY = re.compile(r"^\d{4}-\d{2}-\d{2}$")
_POST = re.compile(r"^community/u/([^/]+)/blog/([^/]+)$")
_SLUG = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._~-]*$")


class SponsorshipError(ValueError):
    """data/sponsorships.json ist ungueltig; die Meldung nennt jeden Fehler."""


def _empty():
    return {"recs": [], "ent": {}, "own": set(), "ep": {}, "vid": {}, "post": {}, "post_refs": {}, "today": ""}


_S = None   # Zustand nach init(); ohne init() wird die Datei beim ersten Zugriff nur mit Aufbau-Pruefung geladen
_GO_CODES = set()
_GO_OFFLINE = False
_GO_WARNED = set()


def read(path=None):
    """Liest die Datei (Pfad, sonst M365_SPONSORSHIPS, sonst data/sponsorships.json). Fehlt die Standarddatei, gibt es keine Sponsorings."""
    p = Path(path) if path else (Path(os.environ[ENV]) if os.environ.get(ENV) else FILE)
    if not p.exists():
        if path or os.environ.get(ENV):
            raise SponsorshipError(f"{p}: Datei fehlt")
        return {"version": 1, "sponsorships": []}
    try:
        return json.loads(p.read_text("utf-8"))
    except Exception as ex:
        raise SponsorshipError(f"{p}: kein gueltiges JSON ({ex})")


def _day(v):
    if not isinstance(v, str) or not _DAY.match(v): return None
    try: return date.fromisoformat(v)
    except ValueError: return None


def _host(u):
    m = re.match(r"^https?://([^/:?#]+)", str(u or "").strip(), re.I)
    return m.group(1).lower().removeprefix("www.") if m else ""


def check_structure(d):
    """Aufbau, Felder, Datumsangaben. Gibt (Datensaetze, Fehler) zurueck."""
    errs = []
    if not isinstance(d, dict): return [], ["oberste Ebene ist kein Objekt"]
    if d.get("version") != 1: errs.append('"version" muss 1 sein')
    for k in d:
        if k not in ("version", "sponsorships") and not k.startswith("_"): errs.append(f'unbekanntes Feld "{k}" auf oberster Ebene')
    recs = d.get("sponsorships")
    if not isinstance(recs, list): return [], errs + ['"sponsorships" muss eine Liste sein']
    ids = set()
    for i, r in enumerate(recs):
        w = f"Eintrag {i + 1}"
        if not isinstance(r, dict): errs.append(f"{w}: kein Objekt"); continue
        rid = r.get("id")
        if not isinstance(rid, str) or not _ID.match(rid): errs.append(f'{w}: "id" fehlt oder ungueltig (a-z, 0-9, -)')
        else:
            w = f'"{rid}"'
            if rid in ids: errs.append(f"{w}: id doppelt")
            ids.add(rid)
        for k in r:
            if k not in REC_KEYS: errs.append(f'{w}: unbekanntes Feld "{k}" (nur oeffentliche Angaben zur Kennzeichnung, keine Preise oder Vertragsdaten)')
        sp = r.get("sponsor")
        if not isinstance(sp, dict): errs.append(f'{w}: "sponsor" fehlt ({{"name", "url"}})')
        else:
            for k in sp:
                if k not in ("name", "url"): errs.append(f'{w}: unbekanntes Feld "sponsor.{k}"')
            n = sp.get("name")
            if not isinstance(n, str) or not n.strip() or len(n) > 80 or n != n.strip(): errs.append(f'{w}: "sponsor.name" fehlt oder ungueltig (1-80 Zeichen)')
            u = sp.get("url")
            if not isinstance(u, str) or not u.startswith("https://") or not _host(u) or "." not in _host(u) or re.search(r"\s", u):
                errs.append(f'{w}: "sponsor.url" muss eine https-Adresse sein')
            elif _host(u) == "m365.fm" or _host(u).endswith(".m365.fm"):
                errs.append(f'{w}: "sponsor.url" darf nicht auf m365.fm zeigen')
            elif _is_sponsor_host(_host(u), SHARED_HOSTS):
                errs.append(f'{w}: "sponsor.url" muss die eigene Website des Sponsors sein, keine Seite auf {_host(u)} (sonst bekaemen auch eigene und fremde Links dort rel="sponsored")')
        if r.get("label") not in LABELS: errs.append(f'{w}: "label" muss "sponsored" oder "advertisement" sein')
        if "go" in r and (not isinstance(r["go"], str) or not re.fullmatch(r"[a-z0-9-]{3,40}", r["go"])):
            errs.append(f'{w}: "go" muss ein aktiver Linkcode aus a-z, 0-9 und Bindestrich sein')
        s, e = _day(r.get("start")), _day(r.get("end"))
        if not s: errs.append(f'{w}: "start" fehlt oder ist kein Datum (JJJJ-MM-TT)')
        if not e: errs.append(f'{w}: "end" fehlt oder ist kein Datum (JJJJ-MM-TT)')
        if s and e and e < s: errs.append(f'{w}: "end" liegt vor "start"')
        for k in REF_KEYS:
            if k not in r: continue
            v = r[k]
            if not isinstance(v, list) or not all(isinstance(x, str) and x.strip() for x in v): errs.append(f'{w}: "{k}" muss eine Liste von Texten sein'); continue
            if len(set(v)) != len(v): errs.append(f'{w}: "{k}" enthaelt Doppelte')
    return (recs if isinstance(recs, list) else []), errs


def episode_ref(x):
    """Folgen-Verweis -> ("show", slug) oder ("dub", sprache, slug); None, wenn die Form nicht passt."""
    p = re.sub(r"^https?://(www\.)?m365\.fm", "", x.strip()).strip("/")
    seg = p.split("/")
    if len(seg) == 1 and _SLUG.match(seg[0]): return ("show", seg[0])
    if len(seg) == 3 and seg[:2] == ["show", "episodes"] and _SLUG.match(seg[2]): return ("show", seg[2])
    if len(seg) == 4 and seg[0] in COMM_LANGS and seg[1:3] == ["show", "episodes"] and _SLUG.match(seg[3]): return ("show", seg[3])   # lokalisierte Show-Seite
    if len(seg) == 2 and seg[0] in COMM_LANGS and seg[0] != "en" and _SLUG.match(seg[1]): return ("dub", seg[0], seg[1])
    return None


def post_ref(x):
    """Beitrags-Pfad (mit oder ohne Sprachpraefix, auch volle URL) -> (handle, slug); None, wenn die Form nicht passt."""
    p = re.sub(r"^https?://(www\.)?m365\.fm", "", x.strip()).strip("/")
    seg = p.split("/", 1)
    if seg[0] in COMM_LANGS and len(seg) == 2: p = seg[1]
    m = _POST.match(p)
    return (m.group(1), m.group(2)) if m else None


def check_topic_limit(recs):
    """Hoechstens TOPIC_MAX Themen-Sponsorings je Thema, die sich zeitlich ueberschneiden (an jedem Tag, auch in der Zukunft;
    die groesste Ueberschneidung liegt immer an einem Starttag)."""
    errs, by = [], {}
    for r in recs:
        s, e = _day(r.get("start")), _day(r.get("end"))
        if not (s and e): continue
        for t in r.get("topics") or []:
            by.setdefault(t, []).append((s, e, str(r.get("id"))))
    for t, lst in sorted(by.items()):
        worst, day0 = [], None
        for a in lst:
            hit = [b for b in lst if b[0] <= a[0] <= b[1]]
            if len(hit) > len(worst): worst, day0 = hit, a[0]
        if len(worst) > TOPIC_MAX:
            errs.append(f'Thema "{t}": {len(worst)} Themen-Sponsorings gleichzeitig am {day0.isoformat()} (hoechstens {TOPIC_MAX}): ' + ", ".join(sorted(b[2] for b in worst)))
    return errs


def check_i18n():
    """Kennzeichnung muss in allen 15 Sprachen von Hand gepflegt sein (keine maschinelle Uebersetzung fuer Rechtstexte)."""
    try: d = json.loads(I18N.read_text("utf-8"))
    except Exception as ex: return [f"data/py_i18n.json nicht lesbar ({ex})"]
    errs = []
    for b_en, _, x_en, _ in TEXT.values():
        for k in (b_en, x_en):
            miss = [l for l in COMM_LANGS[2:] if not str((d.get(k) or {}).get(l) or "").strip()]
            if miss: errs.append(f'data/py_i18n.json: "{k}" fehlt fuer {", ".join(miss)}')
            elif "{" in k and any("{sponsor}" not in d[k][l] for l in COMM_LANGS[2:]): errs.append(f'data/py_i18n.json: "{k}" ohne Platzhalter {{sponsor}}')
    return errs


def _fail(errs, what="data/sponsorships.json ungueltig"):
    if errs:
        raise SponsorshipError(what + ":\n - " + "\n - ".join(errs))


def _offline():
    return os.environ.get("SITE_OFFLINE") == "1"


def check_refs(recs, ents, episodes=(), dubs=None):
    """Verweise auf Entitaeten, Themen und Folgen. Gibt (Fehler, Verweisfehler) zurueck; Verweisfehler sind mit SITE_OFFLINE=1 nur Warnungen."""
    errs, ref, main, dubs = [], [], set(episodes), dubs or {}
    for r in recs:
        w = f'"{r["id"]}"'
        for x in r.get("entities") or []:
            if x not in ents: ref.append(f'{w}: Entitaet "{x}" unbekannt')
        for x in r.get("topics") or []:
            if x not in ents: ref.append(f'{w}: Thema "{x}" ist keine Entitaet')
            elif ents[x].get("type") not in TOPIC_TYPES: errs.append(f'{w}: Thema "{x}" hat den Typ {ents[x].get("type")} (erlaubt: {", ".join(TOPIC_TYPES)})')
        for x in r.get("episodes") or []:
            k = episode_ref(x)
            if not k: errs.append(f'{w}: Folge "{x}" hat keine gueltige Form ("<slug>" oder "<sprache>/<slug>")')
            elif k[0] == "show" and k[1] not in main: ref.append(f'{w}: Folge "{x}" gibt es in der englischen Show nicht')
            elif k[0] == "dub" and (k[1], k[2]) not in dubs: ref.append(f'{w}: Dub-Folge "{x}" gibt es nicht')
        for x in r.get("posts") or []:
            if not post_ref(x): errs.append(f'{w}: Beitrag "{x}" hat keine gueltige Form ("/community/u/<handle>/blog/<slug>/")')
    return errs, ref


def init(today, ents, episodes=(), dubs=None, orig=None, path=None):
    """Einmal je Bau (generate_site.build, vor den Folgenseiten). today: ISO-Datum des Baus. ents: {id: Entitaet}.
    episodes: Slugs der englischen Show. dubs: {(sprache, slug): video_id} der Dub-Folgen. orig: {video_id: Slug der englischen Folge}.
    Prueft alles ausser den Blogbeitraegen (check_posts, sobald sie geladen sind) und bricht bei Fehlern mit SponsorshipError ab."""
    recs, errs = check_structure(read(path))
    _fail(errs + check_i18n())
    errs, ref = check_refs(recs, ents, episodes, dubs)
    if ref and _offline():
        print("WARNUNG (SITE_OFFLINE=1) Sponsorings:\n - " + "\n - ".join(ref)); ref = []
    _fail(check_topic_limit(recs) + errs + ref)
    st = _index(recs, today, dubs or {}, orig or {})
    print(f"Sponsorings: {len(recs)} Eintraege, {sum(1 for r in recs if _active(r, st['today']))} laufend; gekennzeichnet: {len(st['ent'])} Entitaetsseiten, "
          f"{len(st['ep'])} Folgen der Show, {len(st['vid'])} Videos (Dub-Folgen), {len(st['post'])} Beitraege")
    return st


def _active(r, today):
    t = _day(today)
    return bool(t and _day(r["start"]) <= t <= _day(r["end"]))


def _index(recs, today, dubs, orig):
    global _S
    st = _empty(); st["recs"] = recs; st["today"] = str(today)[:10]
    by_main = {}
    for v, s in orig.items(): by_main.setdefault(s, []).append(v)
    def add(d, k, r):
        if r not in d.setdefault(k, []): d[k].append(r)
    for r in sorted(recs, key=lambda r: (r["start"], r["id"])):
        if _active(r, st["today"]):   # Banner auf Entitaetsseiten nur waehrend der Laufzeit
            for x in list(r.get("entities") or []) + list(r.get("topics") or []): add(st["ent"], x, r)
            st["own"].update(r.get("entities") or [])
        for x in r.get("episodes") or []:   # Folgen und Beitraege behalten die Kennzeichnung dauerhaft
            k = episode_ref(x)
            if not k: continue
            if k[0] == "show": slugs, vids = [k[1]], by_main.get(k[1], [])
            else:
                v = dubs.get((k[1], k[2])); vids = [v] if v else []; slugs = [orig[v]] if v in orig else []
            for s in slugs: add(st["ep"], s, r)
            for v in vids: add(st["vid"], v, r)
        for x in r.get("posts") or []:
            k = post_ref(x)
            if not k: continue
            st["post_refs"].setdefault(k, []).append((r["id"], x)); add(st["post"], k, r)
    _S = st
    return st


def check_posts(posts):
    """Nach dem Laden der Blogbeitraege (Community-Export + fruehere Beitraege): jeder Verweis muss einen Beitrag treffen."""
    st = _state()
    have = {(p.get("handle"), p.get("slug")) for p in posts}
    ref = [f'"{rid}": Beitrag "{x}" gibt es nicht' for k, lst in st["post_refs"].items() if k not in have for rid, x in lst]
    if ref and _offline():
        print("WARNUNG (SITE_OFFLINE=1) Sponsorings:\n - " + "\n - ".join(ref)); return
    _fail(ref)


def _state():
    if _S is None:   # ohne init() (einzelnes Modul, Tests): Aufbau und Themen-Grenze pruefen, Verweise nicht
        recs, errs = check_structure(read())
        _fail(errs + check_topic_limit(recs))
        _index(recs, date.today().isoformat(), {}, {})
    return _S


def reset():
    """Nur fuer Tests: Zustand verwerfen."""
    global _S, _GO_CODES, _GO_OFFLINE, _GO_WARNED
    _S = None
    _GO_CODES = set()
    _GO_OFFLINE = False
    _GO_WARNED = set()


def set_go_codes(codes, offline=False):
    """Aktive Redirect-Codes fuer den Seitenbau setzen; offline bleiben alle Links direkt."""
    global _GO_CODES, _GO_OFFLINE, _GO_WARNED
    _GO_CODES = {x for x in codes if isinstance(x, str) and re.fullmatch(r"[a-z0-9-]{3,40}", x)}
    _GO_OFFLINE = bool(offline)
    _GO_WARNED = set()


# --- Abfragen fuer die Seiten (leere Liste = keine Kennzeichnung, die Seite bleibt Byte fuer Byte wie ohne Sponsorings) ---

def entity(eid):
    """Laufende Sponsorings (Entitaet des Sponsors oder Themen-Sponsoring) dieser Entitaet."""
    return list(_state()["ent"].get(eid, []))


def entity_own(eid):
    """True, wenn die Entitaet einem laufenden Sponsor selbst gehoert ("entities"): ihr Link "Offizielle Website" ist ein bezahlter Link."""
    return eid in _state()["own"]


def episode(slug=None, vid=None):
    """Sponsorings einer Folge: englische Show ueber den Slug, Dub-Folge ueber die Video-ID (dauerhaft)."""
    st, out = _state(), []
    for r in (st["ep"].get(slug, []) if slug else []) + (st["vid"].get(vid, []) if vid else []):
        if r not in out: out.append(r)
    return out


def post(handle, slug):
    """Sponsorings eines Blogbeitrags (alle Sprachfassungen, dauerhaft)."""
    return list(_state()["post"].get((handle, slug), []))


def _labels(recs):
    return [l for l in LABELS if any(r["label"] == l for r in recs)]


def badge(lang, recs):
    """Kurzes Badge fuer Listen: "Sponsored" / "Advertisement", deutsch "Anzeige"; '' ohne Sponsoring."""
    if not recs: return ""
    b_en, b_de = TEXT["advertisement" if "advertisement" in _labels(recs) else "sponsored"][:2]
    return T(lang, b_en, b_de)


def _sponsors(recs):
    out = []
    for r in recs:
        sp = (r["sponsor"]["name"], r["sponsor"]["url"])
        if sp not in out: out.append(sp)
    return out


def link_url(recs, url, surface="sponsor-page"):
    """Sponsor-Website bei aktivem Linkcode ueber den datensparsamen Zaehler leiten."""
    for rec in recs or []:
        if _host(rec.get("sponsor", {}).get("url")) != _host(url):
            continue
        code = rec.get("go")
        if not code or _GO_OFFLINE:
            return url
        if code in _GO_CODES:
            return f"https://api-dub.m365.fm/go/{code}?s={surface}"
        if code not in _GO_WARNED:
            print(f"WARNUNG: Sponsor-Linkcode {code} ist nicht aktiv; Direktlink bleibt bestehen")
            _GO_WARNED.add(code)
    return url


def note(lang, recs, surface="sponsor-page"):
    """Sichtbare Kennzeichnung direkt unter der H1 (role=note, data-spm fuer check_schema.py); '' ohne Sponsoring.
    Der Name des Sponsors verlinkt seine Website mit rel="sponsored noopener"."""
    if not recs: return ""
    lines = []
    for l in _labels(recs):
        b_en, b_de, x_en, x_de = TEXT[l]
        names = ", ".join(f'<a href="{escape(link_url(recs, u, surface))}" rel="sponsored noopener"><bdi>{escape(n)}</bdi></a>' for n, u in _sponsors([r for r in recs if r["label"] == l]))
        lines.append(f'<strong>{escape(T(lang, b_en, b_de))}</strong> · ' + escape(T(lang, x_en, x_de)).replace("{sponsor}", names))
    return f'<p class="spm-note" role="note" data-spm="{" ".join(_labels(recs))}" style="{NOTE_STYLE}">' + "<br>".join(lines) + "</p>"


def ld(recs):
    """Wert fuer "sponsor" am WebPage-, PodcastEpisode- oder BlogPosting-Knoten: Organization (eine) oder Liste; None ohne Sponsoring."""
    o = [{"@type": "Organization", "name": n, "url": u} for n, u in _sponsors(recs)]
    return (o[0] if len(o) == 1 else o) if o else None


# Gemeinsam genutzte Plattformen: ein Sponsor-Profil dort ist nicht "die Website des Sponsors". mark()/link_rel() vergleichen nur den Host,
# sonst bekaemen z. B. alle LinkedIn- oder YouTube-Links der Seite (Footer, Autor, Gaeste) rel="sponsored".
SHARED_HOSTS = {"linkedin.com", "youtube.com", "youtu.be", "github.com", "github.io", "facebook.com", "x.com", "twitter.com", "instagram.com", "threads.net",
                "medium.com", "tiktok.com", "substack.com", "wordpress.com", "blogspot.com", "notion.site", "linktr.ee", "spotify.com", "podcasts.apple.com",
                "sessionize.com", "meetup.com", "eventbrite.com", "xing.com", "bsky.app", "mastodon.social", "reddit.com", "wikipedia.org", "wikidata.org"}


def hosts(recs):
    return {_host(u) for _, u in _sponsors(recs)} - {""}


def _is_sponsor_host(h, hs):
    return any(h == x or h.endswith("." + x) for x in hs)


def link_rel(recs, url, own=False):
    """rel fuer einen externen Link auf einer gekennzeichneten Seite: "sponsored noopener", wenn es ein bezahlter Link ist
    (Website einer Entitaet des Sponsors oder Adresse des Sponsors), sonst wie bisher "noopener"."""
    if recs and (own or _is_sponsor_host(_host(url), hosts(recs))): return "sponsored noopener"
    return "noopener"


def mark(html_, recs, surface="sponsor-page"):
    """Ergaenzt rel="sponsored" an allen Links auf die Website des Sponsors (Google: bezahlte Links kennzeichnen); ohne Sponsoring unveraendert."""
    hs = hosts(recs)
    if not hs or not html_: return html_
    def fix(m):
        tag = m.group(0)
        mh = re.search(r'href="([^"]+)"', tag)
        if not mh or not _is_sponsor_host(_host(mh.group(1).replace("&amp;", "&")), hs): return tag
        mr = re.search(r'rel="([^"]*)"', tag)
        rewritten = link_url(recs, mh.group(1).replace("&amp;", "&"), surface)
        if rewritten != mh.group(1).replace("&amp;", "&"):
            tag = tag.replace(mh.group(0), f'href="{escape(rewritten, quote=True)}"', 1)
        if mr:
            if "sponsored" in mr.group(1).split(): return tag
            return tag.replace(mr.group(0), f'rel="{(mr.group(1) + " sponsored").strip()}"', 1)
        return tag[:-1] + ' rel="sponsored noopener">'
    return re.sub(r"<a\s[^>]*>", fix, html_)
