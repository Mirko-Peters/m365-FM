"""Namen der Entitaeten in der Sprache der Seite (Audit Linktexte gap 5, Paket 4: SEO-3, E4, A11Y-6, A11Y-7).

- Optionales Feld names {lang: name} an der Entitaet; gepflegt in data/entity_names.json (id -> {lang: name}), beim Laden der Entitaeten
  angehaengt (site_learn.load_entities -> apply). Ein Feld names direkt am Datensatz geht der Datei vor.
- ename(e, lang): Name in der Sprache der Seite, sonst der (englische) Name. Ueberall gleich verwenden: Listen, Beziehungssaetze, Brotkruemel, H1,
  <title>, BreadcrumbList, Seitenleiste, Kontext-Links (title), Linktexte auf allen Seitenarten. JSON-LD: name am Knoten mit sprachneutraler @id
  bleibt englisch, die Uebersetzungen stehen als alternateName mit @language (ld_alt).
- Uebersetzt werden nur Kategorien (alle 15 Sprachen), Branchen und Begriffe mit etabliertem Fachbegriff der Sprache. Produkt-, Plattform-, Firmen-,
  Personen-, Zertifikats-, Event- und Mediennamen sind Eigennamen und bleiben unuebersetzt (PROPER).
- Englischer Rest (A11Y-6, WCAG 3.1.2): ein Begriff ohne Uebersetzung auf einer Nicht-EN-Seite ist englischer Text; html() setzt ihn in
  <span lang="en"> (Screenreader sprechen ihn englisch). Eigennamen brauchen das nicht.
- RTL (A11Y-7): auf ar/he steht jeder Name in <bdi> (lateinische Namen mit ")" am Ende springen sonst im RTL-Absatz), in allen Bloecken gleich.
Reine Funktionen bis auf das einmalige Lesen der JSON-Datei."""
import html
import json
from pathlib import Path

FILE = Path(__file__).parent / "data" / "entity_names.json"
LANGS = ("en", "de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")
RTL = ("ar", "he")
PROPER = frozenset({"product", "platform", "org", "person", "cert", "event", "media"})   # Eigennamen: nie uebersetzt, kein lang="en"
_DATA = None


def load(path=None):
    """data/entity_names.json -> {id: {lang: name}} (ohne _comment, leere Werte und Englisch; unbekannte Sprachen fallen weg)."""
    global _DATA
    if path is None and _DATA is not None:
        return _DATA
    try:
        raw = json.loads(Path(path or FILE).read_text("utf-8"))
    except (OSError, ValueError):
        raw = {}
    out = {}
    for i, v in (raw.items() if isinstance(raw, dict) else ()):
        if i.startswith("_") or not isinstance(v, dict):
            continue
        n = {l: str(x).strip() for l, x in v.items() if l in LANGS and l != "en" and isinstance(x, str) and x.strip()}
        if n:
            out[i] = n
    if path is None:
        _DATA = out
    return out


def apply(ents, names=None):
    """Haengt names an die Entitaeten (dict id -> Eintrag, in place). Eigennamen (PROPER) bekommen keine Uebersetzung; names am Datensatz gewinnt."""
    names = load() if names is None else names
    for i, n in names.items():
        e = ents.get(i)
        if not isinstance(e, dict) or e.get("type") in PROPER:
            continue
        own = e.get("names") if isinstance(e.get("names"), dict) else {}
        e["names"] = {**n, **{l: x for l, x in own.items() if isinstance(x, str) and x.strip()}}
    return ents


def ename(e, lang):
    """Name der Entitaet in der Sprache der Seite, sonst der Name (englisch). e: Eintrag (dict); '' ohne Eintrag."""
    if not isinstance(e, dict):
        return ""
    if lang and lang != "en":
        n = (e.get("names") or {}).get(lang) if isinstance(e.get("names"), dict) else None
        if n:
            return n
    return e.get("name") or ""


def foreign(e, lang):
    """Der angezeigte Name ist englischer Text auf einer Nicht-EN-Seite: Begriff (kein Eigenname) ohne Uebersetzung in lang."""
    if not isinstance(e, dict) or not lang or lang == "en" or e.get("type") in PROPER:
        return False
    return not ((e.get("names") or {}).get(lang) if isinstance(e.get("names"), dict) else None)


class Name(str):
    """Name als Text mit Sprachmerkmal (foreign = englischer Rest): site_linkctx und site_relsent setzen ihn dann in <span lang="en">."""
    foreign = False

    def __new__(cls, s, foreign=False):
        o = super().__new__(cls, s)
        o.foreign = bool(foreign)
        return o


def label(e, lang):
    """ename als Name (mit Merkmal foreign) fuer Satzvorlagen (site_linkctx.text, site_relsent). Linktext = Zielname, auch mitten im Satz
    (Kategorien gross geschrieben wie in Listen und Brotkruemel); nur der Einleitungssatz en/de nimmt seine Satzform aus relation_sentences "cat"."""
    return Name(ename(e, lang), foreign(e, lang))


def wrap(lang, t, foreign=False):
    """Fertiges HTML aus escaptem Text t: englischer Rest in <span lang="en">, in ar/he immer <bdi> (bei englischem Rest <bdi lang="en">)."""
    if not t:
        return t
    if lang in RTL:
        return f'<bdi lang="en">{t}</bdi>' if foreign else f"<bdi>{t}</bdi>"
    return f'<span lang="en">{t}</span>' if foreign else t


def html_name(e, lang, text=None):
    """Name als HTML fuer Linktexte und Ueberschriften: escaped, englischer Rest mit lang="en", RTL in <bdi>. text ersetzt den Namen."""
    t = ename(e, lang) if text is None else text
    return wrap(lang, html.escape(t or "", quote=True), foreign(e, lang))


def ld_alt(e, base=None):
    """alternateName-Eintraege mit @language fuer die Uebersetzungen ({"@value": ..., "@language": ...}), in fester Sprachreihenfolge.
    base: vorhandene alternateName (Liste von Texten, z. B. Aliase), bleiben vorn. Auch wenn ein Alias schon denselben Text hat, kommt die
    Fassung mit Sprache dazu (sie sagt, in welcher Sprache der Name gilt); gleich dem Namen selbst faellt sie weg."""
    out = list(base or [])
    nm = str((e or {}).get("name") or "").casefold()
    n = (e or {}).get("names") if isinstance((e or {}).get("names"), dict) else {}
    for l in LANGS:
        v = n.get(l)
        if v and l != "en" and v.casefold() != nm:
            out.append({"@value": v, "@language": l})
    return out


def ld_text(v):
    """Text eines JSON-LD-Werts: Zeichenkette oder {"@value": ...} (alternateName mit @language); sonst ''."""
    if isinstance(v, str):
        return v
    if isinstance(v, dict) and isinstance(v.get("@value"), str):
        return v["@value"]
    return ""
