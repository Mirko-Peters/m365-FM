"""Gemeinsamer Speicher der KI-gefuellten Entitaetstexte (fill_entities.py schreibt, site_entities.py liest).

data/entity_fill/en.json            {id: {h, desc, long, faq[{q,a}], m, ts}}     englische Fassung (Sonnet)
data/entity_fill/i18n/<lang>.json   {id: {h, desc?, long?, faq?, m, ts}}         Uebersetzung (Haiku), einmalig: nie ueberschrieben

Rangfolge beim Lesen: redaktioneller Text in data/entities.json / D1 (immer vorn) > diese Texte. Von Mitgliedern bearbeitete Entitaeten
(e["edited"], D1-Fassung) bekommen nie einen KI-Text. Nur Lesen, keine Abhaengigkeit von site_*.py."""
import json
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


EN = load_en()
I18N = {l: load_lang(l) for l in LANGS14}


def _rec(eid, lang):
    return (EN if lang == "en" else I18N.get(lang, {})).get(eid) or {}


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
            f = _rec(e["id"], lang).get("desc") or ""
            if f:
                return f
    return x or desc_en(e) or d.get("de") or ""


def desc_en(e):
    d = (e.get("desc") or {}).get("en") or ""
    if not e.get("edited") and len(d) < SHORT_DESC:
        return _rec(e["id"], "en").get("desc") or d
    return d


def long_text(e, lang):
    """KI-Langtext in lang ('' wenn keiner) - nur als Rueckfall, wenn es keinen redaktionellen Langtext gibt."""
    if e.get("edited"):
        return ""
    return _rec(e["id"], lang).get("long") or ""


def faq(e, lang):
    if e.get("edited"):
        return []
    return [{"q": x["q"], "a": x["a"], "lang": lang} for x in (_rec(e["id"], lang).get("faq") or []) if x.get("q") and x.get("a")]


def has_text(e, lang):
    """True, wenn es fuer lang einen KI-Text (Beschreibung oder Langtext) gibt - fuer die hreflang-Entscheidung."""
    r = _rec(e["id"], lang)
    return not e.get("edited") and bool(r.get("long") or r.get("desc"))
