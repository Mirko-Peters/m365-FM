"""Override-Schicht fuer Sprachfassungen: im Editor von Hand bearbeitete Texte gewinnen immer gegen den Maschinentext und werden von keinem Automatik-Lauf ueberschrieben.
Datei: data/i18n_overrides/<kind>/<lang>.json  {item: {unit_id|feld: text}}   kind: blog (Einheiten T, D, Q1, A1, 1, 2 ...; item = Schluessel in data/blog_i18n),
show (item = Folgen-Slug; Felder title, summary), notes (Felder html). Optional zusaetzlich aus dem Community-API-Export (Umgebung I18N_OVERRIDES_API, Pfad /api/i18n-overrides?kind=&lang=),
gleiches Format; ohne Endpunkt oder bei Fehler nur die Datei."""
import json, os, urllib.parse, urllib.request
from pathlib import Path

DIR = Path(__file__).parent / "data" / "i18n_overrides"
_CACHE = {}


def clear_cache(): _CACHE.clear()


def load_file(kind, lang):
    f = DIR / kind / f"{lang}.json"
    try: return json.loads(f.read_text("utf-8")) if f.exists() else {}
    except Exception: return {}


def load_api(kind, lang, base=None):
    base = base or os.environ.get("I18N_OVERRIDES_API", "")
    if not base: return {}
    try:
        u = f"{base.rstrip('/')}/api/i18n-overrides?" + urllib.parse.urlencode({"kind": kind, "lang": lang})
        with urllib.request.urlopen(urllib.request.Request(u, headers={"user-agent": "m365-dub-build"}), timeout=20) as r:
            d = json.loads(r.read().decode("utf-8"))
        d = d.get("items", d) if isinstance(d, dict) else {}
        return {k: v for k, v in d.items() if isinstance(v, dict)}
    except Exception:
        return {}


def load(kind, lang):
    k = (kind, lang)
    if k not in _CACHE:
        d = {it: dict(v) for it, v in load_file(kind, lang).items() if isinstance(v, dict)}
        for it, v in load_api(kind, lang).items(): d.setdefault(it, {}).update(v)
        _CACHE[k] = {it: {u: t for u, t in v.items() if isinstance(t, str) and t.strip()} for it, v in d.items()}
    return _CACHE[k]


def get(kind, lang, item):
    return load(kind, lang).get(item, {})


def apply_show(lang, data):
    """{slug: [titel, zusammenfassung]} mit Overrides (title/summary) - gibt eine neue Struktur zurueck."""
    ov = load("show", lang)
    if not ov: return data
    out = dict(data)
    for slug, f in ov.items():
        cur = list(out.get(slug) or ["", ""]) + ["", ""]
        out[slug] = [f.get("title", cur[0]), f.get("summary", cur[1])]
    return out


def apply_notes(lang, data):
    """{slug: html} mit Overrides (Feld html)."""
    ov = load("notes", lang)
    if not ov: return data
    out = dict(data)
    for slug, f in ov.items():
        if f.get("html"): out[slug] = f["html"]
    return out
