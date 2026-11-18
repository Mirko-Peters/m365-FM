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
- Deutsch nach Praeposition (Gegenpruefung Paket 4): ein deutscher Name, der mit einem Adjektiv beginnt ("Bedingter Zugriff", "Maschinelles Lernen"),
  bleibt im Nominativ (Linktext = Zielname); nach "mit/von/zu/bei ..." (Dativ) bzw. bei maskulinen Namen nach "um/fuer/ueber ..." (Akkusativ) steht
  er als Apposition mit Artikel: "Eng mit dem Thema Bedingter Zugriff verwandt", "Weitere Artikel zum Thema Maschinelles Lernen", Branchen mit
  "der Branche" ("Firmen der Branche Oeffentlicher Sektor"). put() setzt das in Vorlagen ein (site_linkctx.text, site_relsent, Ueberschriften).
Reine Funktionen bis auf das einmalige Lesen der JSON-Datei."""
import html
import json
import re
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
    """Name als Text mit Sprachmerkmal (foreign = englischer Rest): site_linkctx und site_relsent setzen ihn dann in <span lang="en">.
    art: Artikel fuer die Apposition nach einer Praeposition (de, siehe de_art), {"d": Dativ, "a": Akkusativ}; leer, wenn der Name keine braucht."""
    foreign = False
    art = None

    def __new__(cls, s, foreign=False, art=None):
        o = super().__new__(cls, s)
        o.foreign = bool(foreign)
        o.art = art or None
        return o


def label(e, lang):
    """ename als Name (mit Merkmal foreign) fuer Satzvorlagen (site_linkctx.text, site_relsent). Linktext = Zielname, auch mitten im Satz
    (Kategorien gross geschrieben wie in Listen und Brotkruemel); nur der Einleitungssatz (relation_sentences "lead") nimmt seine Satzform aus relation_sentences "cat"."""
    return Name(ename(e, lang), foreign(e, lang), _arts(e) if lang == "de" else None)


# ---------------------------------------------------------------- Deutsch: Name nach Praeposition
# Praeposition direkt vor dem Platzhalter -> Fall ("d" Dativ, "a" Akkusativ). "ueber" in den Vorlagen = Thema ("Folgen ueber ..."): Akkusativ.
DE_PREP = {"mit": "d", "von": "d", "zu": "d", "bei": "d", "aus": "d", "nach": "d", "seit": "d", "gegenüber": "d",
           "über": "a", "um": "a", "für": "a", "durch": "a", "gegen": "a", "ohne": "a"}
_DE_PREP_RX = re.compile(r"(?:^|(?<=[\s(„\"'>]))(" + "|".join(sorted(DE_PREP, key=len, reverse=True)) + r")\s+$", re.I)
# Adjektiv am Anfang des Namens (stark gebeugt, Nominativ): -er maskulin, -es neutral, -e feminin oder Plural; weitere Adjektive klein davor
# ("Virtuelles privates Netzwerk"), dann ein Nomen (gross).
_DE_ADJ = re.compile(r"^[A-ZÄÖÜ][a-zäöüß]+?(er|es|e)\s+(?:[a-zäöüß]+(?:er|es|e)\s+)*[A-ZÄÖÜ]")
_DE_CONTRACT = re.compile(r"\b(von|zu|bei) dem Thema |\bzu der Branche ")


def de_adj(e):
    """Geschlecht des deutschen Namens, wenn er mit einem Adjektiv beginnt: "m", "n" oder "f" (auch Plural); sonst ''.
    Nur uebersetzte Namen (names.de); beginnt er mit den ersten zwei Woertern des englischen Namens ("Active Directory-Gesamtstruktur"), ist das ein
    englischer Eigenname, kein Adjektiv ("Adaptive Bereiche", "Generative KI" dagegen schon)."""
    if not isinstance(e, dict):
        return ""
    n = (e.get("names") or {}).get("de") if isinstance(e.get("names"), dict) else None
    m = _DE_ADJ.match(n or "")
    if not m:
        return ""
    en2 = " ".join(str(e.get("name") or "").split()[:2])
    if " " in en2 and n.startswith(en2):
        return ""
    return {"er": "m", "es": "n", "e": "f"}[m.group(1)]


def _arts(e):
    """Artikel der Apposition je Fall ({"d": ..., "a": ...}) fuer einen Namen mit Adjektiv am Anfang; sonst None.
    Dativ immer (die Endung des Adjektivs aendert sich); Akkusativ nur maskulin (feminin, neutral und Plural lauten im Akkusativ wie im Nominativ)."""
    g = de_adj(e)
    if not g:
        return None
    ind = e.get("type") == "industry"
    out = {"d": "der Branche " if ind else "dem Thema "}
    if g == "m":
        out["a"] = "die Branche " if ind else "das Thema "
    return out


def de_case(before):
    """Fall, den die Praeposition am Ende von before verlangt ("d", "a"), sonst ''. before: Vorlagentext (auch HTML) vor dem Platzhalter."""
    m = _DE_PREP_RX.search(before or "")
    return DE_PREP.get(m.group(1).lower(), "") if m else ""


def de_art(x, case):
    """Artikel der Apposition ("dem Thema ", "der Branche ", ...) vor dem Namen x (Entitaet oder Name aus label) im Fall case; '' wenn keiner noetig."""
    if not case:
        return ""
    arts = x.art if isinstance(x, Name) else (_arts(x) if isinstance(x, dict) else None)
    return (arts or {}).get(case, "")


def de_contract(s):
    """Praeposition + Artikel zusammenziehen: "von dem Thema" -> "vom Thema", "zu dem" -> "zum", "bei dem" -> "beim", "zu der Branche" -> "zur Branche"."""
    def f(m):
        t = m.group(0)
        if t.startswith("zu der"):
            return "zur Branche "
        return {"von": "vom", "zu": "zum", "bei": "beim"}[m.group(1)] + " Thema "
    return _DE_CONTRACT.sub(f, s) if s else s


def put(lang, t, key, x, val):
    """Setzt val (fertiger Text/HTML des Namens x) fuer {key} in die Vorlage t. Deutsch: nach einer Praeposition mit Apposition (de_art), dann
    zusammengezogen (de_contract). x: Entitaet oder Name aus label; ohne Merkmal (Personen, Titel) wie str.replace."""
    ph = "{" + key + "}"
    if lang != "de" or ph not in t or not (x.art if isinstance(x, Name) else _arts(x) if isinstance(x, dict) else None):
        return t.replace(ph, val)
    out, pos = [], 0
    for m in re.finditer(re.escape(ph), t):
        out += [t[pos:m.start()], de_art(x, de_case(t[:m.start()])), val]
        pos = m.end()
    out.append(t[pos:])
    return de_contract("".join(out))


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


# ---------------------------------------------------------------- Kurzer Zusatz im Linktext (Paket 6, Mirko 18.11.2026)
# In Listen, Kacheln und Chips (kein Satz um den Link) steht hinter dem Namen ein kurzer beschreibender Zusatz: "Power BI – Analyse- und BI-Werkzeug
# von Microsoft", "SAP S/4HANA – ERP-System von SAP". Im Fliesstext bleibt der Linktext der Name (der Satz erklaert die Beziehung); Brotkruemel und
# JSON-LD-name bleiben ohne Zusatz. Jeder Entitaetslink traegt ausserdem ein title mit der Kurzbeschreibung (desc in der Sprache der Seite, sonst Zusatz).
# Stufen (descriptor): 1 genaue Kategorie + Hersteller, 2 Typ + Hersteller, 3 nur Hersteller (Typ ohne passendes Nomen), 4 nur Kategorie,
# 5 "Teil von {X}" (part_of), 6 "Unterbegriff von {X}" (broader), sonst der Typname. microsoft-tool ist keine genaue Kategorie; bei Hersteller
# Microsoft entfaellt sie ganz (kein "Microsoft-Werkzeug von Microsoft"). Was die Seite selbst ist (Hersteller, Kategorie, Teil von, Oberbegriff), entfaellt
# (auf /entity/microsoft/ also nur "Analyse- und BI-Werkzeug"). Laenger als MAXDESC Zeichen: Kategorie ohne Hersteller, sonst Typname.
# Vorlagen je Sprache in data/link_context.json (desc.*), Kategorienamen aus data/entity_names.json, Typnamen desc.type.* (15 Sprachen, Repo-Datei).
MAXDESC = 60
GENERIC_CAT = "microsoft-tool"
MAKER_TYPES = ("product", "platform", "cert", "concept", "media")   # Typnomen mit Hersteller ("Produkt von SAP"); andere Typen: nur Hersteller
SEP = " – "


def _ents(ents):
    if ents is not None:
        return ents
    try:
        from site_learn import ENTS
        return ENTS
    except Exception:
        return {}


def _rel(e, p, ents, skip):
    return [t for q, t in (e.get("rel") or []) if q == p and t in ents and t not in skip]


def _cap(s):
    return s[:1].upper() + s[1:] if s else s


def _tpl(lang, key):
    import site_linkctx as LC
    return LC.raw(lang, key)


def _type_name(lang, t):
    return _tpl(lang, "desc.type." + str(t or "")) or ""


def _parts(e, lang, page_id=None, ents=None):
    """Kandidaten des Zusatzes in Reihenfolge der Stufen: [(vorlage, {platzhalter: entitaet oder text})]. Rein, ohne HTML."""
    ents = _ents(ents)
    if not isinstance(e, dict):
        return []
    skip = {e.get("id"), page_id} - {None}
    makers_all = _rel(e, "developed_by", ents, set())
    makers = [] if page_id and page_id in makers_all else [m for m in makers_all if m not in skip]
    ms = "microsoft" in makers_all
    cats = [c for c in _rel(e, "instance_of", ents, skip) if c != GENERIC_CAT and ents[c].get("type") == "category"]
    gen = [c for c in _rel(e, "instance_of", ents, skip) if c == GENERIC_CAT and not ms]   # "Microsoft-Werkzeug" nur ohne Hersteller Microsoft
    tn = _type_name(lang, e.get("type"))
    out = []
    mk = makers[:1]
    if cats and mk:
        out.append(("by", {"cat": ents[cats[0]], "maker": ents[mk[0]]}))
    if mk and e.get("type") in MAKER_TYPES and tn:
        out.append(("by", {"cat": tn, "maker": ents[mk[0]]}))
    if mk and e.get("type") not in MAKER_TYPES:
        out.append(("maker", {"maker": ents[mk[0]]}))
    for c in cats + gen:
        out.append(("", {"cat": ents[c]}))
    for x in _rel(e, "part_of", ents, skip)[:1]:
        out.append(("part", {"x": ents[x]}))
    for x in _rel(e, "broader", ents, skip)[:1]:
        out.append(("broader", {"x": ents[x]}))
    if tn:
        out.append(("", {"cat": tn}))
    return out


def _render(lang, kind, vals, as_html):
    """Ein Kandidat als Text oder HTML. Kategorie = Name der Kategorie in der Sprache der Seite (entity_names.json) bzw. Typname."""
    def nm(v):
        if isinstance(v, dict):
            return html_name(v, lang) if as_html else ename(v, lang)
        return html.escape(v, quote=True) if as_html else v
    if not kind:
        return _cap(nm(vals["cat"])) if not as_html else nm(vals["cat"])
    key = {"by": "desc.by", "maker": "desc.maker", "part": "desc.part", "broader": "desc.broader"}[kind]
    m = vals.get("maker")
    if m is not None and lang == "pt" and m.get("id") in (_tpl("pt", "desc.maker_m") or "").split(","):
        key += ".m"   # Portugiesisch: "do GitHub" statt "da Microsoft" (maskuline Marken)
    t = _tpl(lang, key)
    if not t:
        return ""
    if as_html:
        t = html.escape(t, quote=False)
    if lang == "fr":   # "de Microsoft", aber "d’iFAKT"
        for k, v in vals.items():
            s0 = (ename(v, lang) if isinstance(v, dict) else v)[:1]
            if s0 and s0 in "AEIOUYÀÂÄÉÈÊËÎÏÔÖÛÜaeiouyàâäéèêëîïôöûü":
                t = re.sub(r"(^|(?<=\s))de \{" + k + r"\}", "d’{" + k + "}", t)
    for k, v in vals.items():
        ph = "{" + k + "}"
        if ph not in t:
            continue
        val = nm(v)
        if lang == "de" and isinstance(v, dict):
            t = put(lang, t, k, label(v, lang), val)
        else:
            t = t.replace(ph, val)
    return t if as_html else _cap(t)


def descriptor(e, lang, page_id=None, ents=None, as_html=False, maxlen=MAXDESC):
    """Kurzer Zusatz zum Namen einer Entitaet in Listen, Kacheln und Chips ("Analyse- und BI-Werkzeug von Microsoft"); '' ohne passende Angabe.
    page_id: Entitaet der Seite (Hersteller, Kategorie, Teil von ... gleich der Seite entfallen). as_html: escaped, Namen wie html_name (lang="en", <bdi>).
    Laenger als maxlen Zeichen (sichtbarer Text): Kategorie ohne Hersteller, sonst Typname."""
    cands = _parts(e, lang, page_id, ents)
    if not cands:
        return ""
    first = cands[0]
    txt = _render(lang, *first, False)
    if len(txt) <= maxlen:
        return _render(lang, *first, True) if as_html else txt
    for kind, vals in cands[1:]:   # zu lang: Kategorie ohne Hersteller, sonst Typname (Stufen 4/sonst)
        if kind:
            continue
        t2 = _render(lang, kind, vals, False)
        if t2 and len(t2) <= maxlen:
            return _render(lang, kind, vals, True) if as_html else t2
    return ""


def own_desc(e, lang):
    """Kurzbeschreibung in der Sprache der Seite (redaktionell oder gepruefte Uebersetzung aus data/entity_fill), sonst ''. Kein Rueckfall auf Englisch."""
    if not isinstance(e, dict):
        return ""
    d = (e.get("desc") or {}).get(lang) if isinstance(e.get("desc"), dict) else ""
    if d:
        return str(d)
    try:
        import entity_fill_data as FD
        return (FD.desc(e, "en") if lang == "en" else (FD._tr(e, lang, "desc") or "")) or ""
    except Exception:
        return ""


def short(t, n=150):
    t = " ".join(str(t or "").split())
    if len(t) <= n:
        return t
    cut = t[:n].rsplit(" ", 1)[0].rstrip(",;:–-")
    return cut + "…"


def title_text(e, lang, page_id=None, ents=None):
    """Text fuer das title des Entitaetslinks: Kurzbeschreibung in der Sprache der Seite, sonst der Zusatz (descriptor); '' ohne beides."""
    d = short(own_desc(e, lang))
    if d:
        return d
    x = descriptor(e, lang, page_id, ents)
    return "" if x == _type_name(lang, (e or {}).get("type")) else x   # nur der Typname ("Organisation") sagt im title nichts


def title_attr(e, lang, page_id=None, ents=None, shown=""):
    """' title="..."' fuer einen Entitaetslink; leer, wenn es nichts gibt oder der Text schon sichtbar im Link steht (shown = sichtbarer Zusatz)."""
    t = title_text(e, lang, page_id, ents)
    if not t or t == shown:
        return ""
    return f' title="{html.escape(t, quote=True)}"'


def with_desc(e, lang, page_id=None, ents=None, text=None):
    """Linktext fuer Listen, Kacheln und Chips: Name und Zusatz ("Power BI<span class="ed"> – Analyse- und BI-Werkzeug von Microsoft</span>").
    Ohne Zusatz nur der Name (html_name). RTL: Name in <bdi>, der Trenner steht zwischen den isolierten Teilen."""
    n = html_name(e, lang, text)
    d = descriptor(e, lang, page_id, ents, as_html=True)
    return f'{n}<span class="ed">{html.escape(_tpl(lang, "desc.sep") or SEP, quote=False)}{d}</span>' if d else n


def list_link(href, e, lang, page_id=None, ents=None, cls="", bold=False, text=None, extra="", title=True, skip_type=False, pre=""):
    """Fertiger Listen-Link einer Entitaet: Name mit Zusatz im Linktext, title mit Kurzbeschreibung (kein title, wenn der Zusatz schon dasteht oder
    title=False, z. B. wenn die Kurzbeschreibung sichtbar darunter steht). skip_type: kein Zusatz, wenn er nur der Typname ist und die Stelle den Typ
    schon nennt (Zeile "Branche" der Faktentabelle). href wird escaped; pre = fertiges HTML vor dem Namen im Link (Punkt der Seitenleisten-Chips)."""
    shown = descriptor(e, lang, page_id, ents)
    if skip_type and shown == _type_name(lang, (e or {}).get("type")):
        shown = ""
    n = html_name(e, lang, text)
    if bold:
        n = f"<b>{n}</b>"
    d = descriptor(e, lang, page_id, ents, as_html=True) if shown else ""
    inner = f'{n}<span class="ed">{html.escape(_tpl(lang, "desc.sep") or SEP, quote=False)}{d}</span>' if d else n
    c = f' class="{cls}"' if cls else ""
    ti = title_attr(e, lang, page_id, ents, shown) if title else ""
    return f'<a{c} href="{html.escape(href, quote=True)}"{ti}{extra}>{pre}{inner}</a>'


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
