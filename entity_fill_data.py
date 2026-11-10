"""Gemeinsamer Speicher der KI-gefuellten Entitaetstexte (fill_entities.py schreibt, site_entities.py liest).

data/entity_fill/en.json            {id: {h, desc, long, faq[{q,a}], m, ts}}     englische Fassung (Sonnet)
data/entity_fill/i18n/<lang>.json   {id: {h, sh, desc?, long?, faq?, m, ts}}     Uebersetzung (Haiku), einmalig: nie automatisch ueberschrieben
data/entity_fill/stale.json         {lang: {id: [felder]}}                       veraltete Uebersetzungen (Vertrag von #315: nur melden, neu nur mit --stale)

sh = {feld: src_hash(englischer Quelltext)} je uebersetztem Feld. Passt der Hash nicht mehr zum aktuellen englischen Text (effective_en), gilt die
Uebersetzung als veraltet: sie wird nicht mehr gezeigt (die Seite faellt auf Englisch zurueck) und steht in stale.json.
Sponsor-/Eigenfirma-Entitaeten (data/sponsorships.json, ifakt, polaris*) bekommen nie einen KI-Text, auch wenn er schon erzeugt wurde.

Rangfolge beim Lesen: redaktioneller Text in data/entities.json / D1 (immer vorn) > diese Texte. Von Menschen bearbeitete Entitaeten
(e["edited"] = D1-Fassung mit src human; seed/ai setzen es nicht) bekommen nie einen KI-Text. KI-Texte stehen zusaetzlich als KI-Entwurf in D1 (fill_entities.py push). Nur Lesen, keine Abhaengigkeit von site_*.py."""
import hashlib, json, re
from pathlib import Path

ROOT = Path(__file__).parent
FILL = ROOT / "data" / "entity_fill"
LANGS14 = ("de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")
SHORT_DESC = 80   # kuerzere englische Beschreibungen gelten als zu duenn (gleiche Grenze wie die Personen-Regel in site_entities)


def _load(p):
    try:
        v = json.loads(Path(p).read_text("utf-8"))
        return v if isinstance(v, dict) else {}
    except Exception:
        return {}


def load_en():
    return _load(FILL / "en.json")


def load_lang(lang):
    return _load(FILL / "i18n" / f"{lang}.json")


def load_gentext():
    g = {}
    for f in sorted((ROOT / "data" / "entity_texts").glob("part-*.json")):
        g.update(_load(f))
    return g


def sponsored_ids():
    ids = set()
    for x in (_load(ROOT / "data" / "sponsorships.json").get("sponsorships") or []):
        for k in ("entities", "topics"):
            ids |= set(x.get(k) or [])
    return ids


def is_sponsored(eid, extra=None):
    """Eigenfirma/Sponsor: nie ein KI-Text (id ifakt, Praefix polaris, oder in data/sponsorships.json)."""
    return eid == "ifakt" or eid.startswith("polaris") or eid in (SPONS if extra is None else extra)


EN = load_en()
I18N = {l: load_lang(l) for l in LANGS14}
GEN = load_gentext()
SPONS = sponsored_ids()


def norm(t):
    """Vergleichsform eines Texts: wie der Worker ihn speichert (entfill.js txt/longTxt: ohne <>, Leerraum zusammengezogen)."""
    return re.sub(r"\s+", " ", re.sub(r"[<>]", "", str(t or ""))).strip()


def src_hash(v):
    """Kurz-Hash eines englischen Quelltexts (str) oder einer FAQ-Liste fuer die Veraltet-Pruefung der Uebersetzungen."""
    o = [{"q": norm(x.get("q")), "a": norm(x.get("a"))} for x in v if isinstance(x, dict)] if isinstance(v, list) else norm(v)
    return hashlib.sha1(json.dumps(o, ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:8]


def _rec(eid, lang):
    if is_sponsored(eid):
        return {}
    return (EN if lang == "en" else I18N.get(lang, {})).get(eid) or {}


def effective_en(e, gen=None, fill=None):
    """Englischer Quelltext der Uebersetzungen: redaktionell > GENTEXT > KI-Text. -> {desc?, long?, faq?}"""
    gen = GEN if gen is None else gen; fill = EN if fill is None else fill
    eid = e["id"]; d = (e.get("desc") or {}).get("en") or ""; fe = fill.get(eid) or {}
    src = {}
    desc = d if len(d) >= SHORT_DESC else (fe.get("desc") or d)
    if desc: src["desc"] = desc
    long = (e.get("long") or {}).get("en") or (gen.get(eid) or {}).get("en") or fe.get("long") or ""
    if long: src["long"] = long
    if fe.get("faq"): src["faq"] = fe["faq"]
    return src


def stale_against(rec, src):
    """Felder einer Uebersetzung (rec), deren englische Quelle (src = effective_en) sich seit dem Uebersetzen geaendert hat. Ohne sh (aeltere Eintraege) gilt
    nichts als veraltet; ein Feld ohne Quelle mehr gilt als veraltet."""
    sh = rec.get("sh") if isinstance(rec.get("sh"), dict) else None
    if not sh:
        return []
    return [k for k in ("desc", "long", "faq") if rec.get(k) and k in sh and (k not in src or sh[k] != src_hash(src[k]))]


def stale_fields(e, rec, gen=None, fill=None):
    return stale_against(rec, effective_en(e, gen, fill)) if rec.get("sh") else []


def _tr(e, lang, field):
    """Uebersetzung eines Felds, nur solange ihre englische Quelle aktuell ist (sonst '' - die Seite zeigt den englischen Text)."""
    r = _rec(e["id"], lang)
    if not r.get(field) or field in stale_fields(e, r):
        return None
    return r[field]


def is_ai(e, field, lang):
    """True, wenn der Wert e[field][lang] (z. B. aus der D1-Fassung nach push) der KI-Text aus data/entity_fill ist - dann ist er kein redaktioneller Text
    und wird als KI-Text gekennzeichnet (unabhaengig von e["edited"]: ein Mensch kann ein anderes Feld bearbeitet haben)."""
    v = (e.get(field) or {}).get(lang) if isinstance(e.get(field), dict) else None
    if not v or is_sponsored(e["id"]):
        return False
    r = (EN if lang == "en" else I18N.get(lang, {})).get(e["id"]) or {}
    return bool(r.get(field)) and norm(v) == norm(r[field])


def desc(e, lang):
    """Kurzbeschreibung: Redaktion/D1 vor KI-Text; zu kurze oder fehlende englische Beschreibung ersetzt der KI-Text."""
    d = e.get("desc") or {}
    x = d.get(lang) or ""
    if not e.get("edited"):
        if lang == "en":
            f = _rec(e["id"], "en").get("desc") or ""
            if f and len(x) < SHORT_DESC:
                return f
        elif not x or x == d.get("en"):
            f = _tr(e, lang, "desc") or ""
            if f:
                return f
    return x or desc_en(e) or d.get("de") or ""


def desc_en(e):
    d = (e.get("desc") or {}).get("en") or ""
    if not e.get("edited") and len(d) < SHORT_DESC:
        return _rec(e["id"], "en").get("desc") or d
    return d


def desc_is_ai(e, lang, shown):
    """True, wenn die angezeigte Kurzbeschreibung (shown) ein KI-Text ist (englischer Entwurf oder Uebersetzung) - fuer den KI-Hinweis auf der Seite."""
    n = norm(shown)
    return bool(n) and not is_sponsored(e["id"]) and any(n == norm(_rec(e["id"], l).get("desc")) for l in {lang, "en"})


def long_text(e, lang):
    """KI-Langtext in lang ('' wenn keiner) - nur als Rueckfall, wenn es keinen redaktionellen Langtext gibt; Uebersetzungen nur mit aktueller Quelle."""
    if e.get("edited"):
        return ""
    return (_rec(e["id"], "en").get("long") if lang == "en" else _tr(e, lang, "long")) or ""


def faq(e, lang):
    """KI-FAQ (immer mit ai=True: die Seite kennzeichnet sie)."""
    if is_sponsored(e["id"]):
        return []
    own = e.get("faq") if isinstance(e.get("faq"), dict) else {}   # KI-Entwurf in der Datenbank (en/de), kommt als normales Feld der D1-Fassung
    db = [{"q": x["q"], "a": x["a"], "lang": lang, "ai": True} for x in (own.get(lang) or []) if isinstance(x, dict) and x.get("q") and x.get("a")]
    if db or e.get("edited"):   # D1-Fassung (gleicher Text wie der Audit-Stand in data/entity_fill) gewinnt, keine Doppelung
        return db
    fq = _rec(e["id"], "en").get("faq") if lang == "en" else _tr(e, lang, "faq")
    return [{"q": x["q"], "a": x["a"], "lang": lang, "ai": True} for x in (fq or []) if x.get("q") and x.get("a")]


def has_text(e, lang):
    """True, wenn es fuer lang einen KI-Text (Beschreibung oder Langtext) gibt - fuer die hreflang-Entscheidung."""
    if e.get("edited"):
        return False
    return bool(_rec(e["id"], "en").get("long") or _rec(e["id"], "en").get("desc")) if lang == "en" else bool(_tr(e, lang, "long") or _tr(e, lang, "desc"))
