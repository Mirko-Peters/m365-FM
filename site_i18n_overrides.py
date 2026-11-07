"""Sprachfassungen: Aenderungen der Redaktion (D1 i18n_override) in den Seitenbau uebernehmen und die Bearbeitungsliste fuer /redaktion/ veroeffentlichen.

Grundsatz: eine Sprachfassung wird nur einmal maschinell uebersetzt, danach bearbeiten Editoren jeden Absatz von Hand.
- sync(): holt /api/i18n/overrides?kind=&lang= (site_fetch, mit Cache-Rueckfall) und schreibt data/i18n_overrides/<kind>/<lang>.json = {item: {unit: text}}.
  Ist der Export weder frisch noch im Cache erreichbar, bleibt die vorhandene Datei unveraendert (kein Verlust von Aenderungen).
- load()/apply_*(): der Leser, den die Sprach-Lader benutzen. Blog: Absatz-IDs T, D, Qn, An, 1..n (seg einer Fassung); Folgen: title, summary; Show Notes: html.
- publish(): docs/i18n-stale.json (Veraltet-Liste) und docs/i18n-units/<kind>/<lang>.json (Original neben Fassung, nur fuer veraltete oder bearbeitete
  Eintraege; alle Absaetze aller Fassungen zu veroeffentlichen waere zu gross) - die Quelle fuer die Absatz-Ansicht im Tab "Sprachfassungen".
stale.json (Teil von PR #315): data/blog_i18n/stale.json und data/podpage_i18n/stale.json, erwartet {lang: {item: [Absatz-IDs]}}; andere Formen werden ignoriert."""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).parent
DIR = ROOT / "data" / "i18n_overrides"
KINDS = ("lblog", "episode", "notes")
LANGS = ("de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")
STALE_FILES = {"lblog": ROOT / "data" / "blog_i18n" / "stale.json", "episode": ROOT / "data" / "podpage_i18n" / "stale.json", "notes": ROOT / "data" / "podpage_i18n" / "stale.json"}
_NOTED = {}   # (kind, lang) -> {item: {"units": [[id, original, aktuell]], "stale": [ids], "edited": [ids]}}


def paths():
    return [f"/api/i18n/overrides?kind={k}&lang={l}" for k in KINDS for l in LANGS]


def _file(kind, lang):
    return DIR / kind / f"{lang}.json"


def sync(api=None):
    """Exporte in data/i18n_overrides/ schreiben; Rueckgabe: Anzahl bearbeiteter Absaetze."""
    import site_fetch as SF
    api = api or SF.API
    n = 0
    for p in paths():
        j = SF.fetch(api + p)
        k, l = re.search(r"kind=(\w+)&lang=(\w+)", p).groups()
        if not isinstance(j, dict) or not isinstance(j.get("items"), dict):
            continue   # nicht erreichbar: vorhandene Datei bleibt
        items = {i: u for i, u in j["items"].items() if isinstance(u, dict) and u}
        f = _file(k, l)
        if items:
            f.parent.mkdir(parents=True, exist_ok=True); f.write_text(json.dumps(items, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
            n += sum(len(u) for u in items.values())
        elif f.exists():
            f.unlink()   # alle Aenderungen wurden zurueckgesetzt
    if n: print(f"Sprachfassungen: {n} bearbeitete Absaetze aus der Redaktion")
    return n


def load(kind, lang):
    f = _file(kind, lang)
    try:
        j = json.loads(f.read_text("utf-8")) if f.exists() else {}
    except Exception as e:
        print(f"WARNUNG: {f} nicht lesbar ({e})", file=sys.stderr); return {}
    return j if isinstance(j, dict) else {}


def apply_blog(lang, data):
    """data = TB.load_lang(lang): Absaetze der Redaktion in die Fassungen eintragen (Kopie je Fassung, die Schalen auf der Platte bleiben unberuehrt)."""
    for item, units in load("lblog", lang).items():
        rec = data.get(item)
        if rec and rec.get("ok") and isinstance(units, dict):
            data[item] = {**rec, "seg": {**rec.get("seg", {}), **{u: t for u, t in units.items() if isinstance(t, str)}}}
    return data


def apply_podpage(TRL, NTL):
    """TRL[lang][slug] = [Titel, Zusammenfassung]; NTL[lang][slug] = Show-Notes-HTML."""
    for l in list(TRL):
        for slug, u in load("episode", l).items():
            cur = TRL[l].get(slug)
            if cur and cur[0] and isinstance(u, dict):
                TRL[l][slug] = [u.get("title", cur[0]), u.get("summary", cur[1] if len(cur) > 1 else "")]
    for l in list(NTL):
        for slug, u in load("notes", l).items():
            if slug in NTL[l] and isinstance(u, dict) and isinstance(u.get("html"), str):
                NTL[l][slug] = u["html"]


def _stale(kind):
    f = STALE_FILES[kind]
    try:
        j = json.loads(f.read_text("utf-8")) if f.exists() else {}
    except Exception:
        return {}
    return j if isinstance(j, dict) else {}


def _note(kind, lang, item, units, stale, edited):
    if stale or edited:
        _NOTED.setdefault((kind, lang), {})[item] = {"units": units, "stale": sorted(stale), "edited": sorted(edited)}


def note_blog(lang, item, src, rec):
    """Vor dem Zusammenbau aufrufen (rec = Fassung vor oder nach apply_blog): veraltet (Original geaendert) oder bearbeitet -> fuer die Redaktion vormerken."""
    if not rec or not rec.get("ok"):
        return
    import translate_blog as TB
    _, units, h = TB.source_of(src)
    ov = load("lblog", lang).get(item, {})
    st = set(map(str, ((_stale("lblog").get(lang) or {}).get(item) or []))) if isinstance(_stale("lblog").get(lang), dict) else set()
    if rec.get("h") != h and not st:
        st = {u for u, _ in units}   # Original geaendert, Absatz-Liste unbekannt: alle als veraltet melden
    seg = rec.get("seg", {})
    _note("lblog", lang, item, [[u, t, seg.get(u, "")] for u, t in units], st, set(ov))


def note_podpage(eps, TRL, NTL):
    for l in TRL:
        sv = _stale("episode").get(l) if isinstance(_stale("episode").get(l), dict) else {}
        for e in eps:
            slug, cur = e["slug"], TRL[l].get(e["slug"])
            if not cur or not cur[0]:
                continue
            ov = load("episode", l).get(slug, {})
            _note("episode", l, slug, [["title", e.get("name") or "", cur[0]], ["summary", e.get("summary") or "", cur[1] if len(cur) > 1 else ""]], set(map(str, sv.get(slug) or [])), set(ov))
    for l in NTL:
        for slug, html in NTL[l].items():
            ov = load("notes", l).get(slug, {})
            _note("notes", l, slug, [["html", "", html]], set(), set(ov))


def publish(out):
    """docs/i18n-stale.json + docs/i18n-units/<kind>/<lang>.json"""
    out = Path(out)
    items, units = [], {}
    for (k, l), d in sorted(_NOTED.items()):
        for it, v in sorted(d.items()):
            if v["stale"]:
                items.append({"kind": k, "item": it, "lang": l, "units": v["stale"]})
            units.setdefault(k, {}).setdefault(l, {})[it] = v
    (out / "i18n-stale.json").write_text(json.dumps({"items": items}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    for k, byl in units.items():
        for l, d in byl.items():
            f = out / "i18n-units" / k / f"{l}.json"; f.parent.mkdir(parents=True, exist_ok=True)
            f.write_text(json.dumps(d, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Sprachfassungen: {len(items)} veraltete Eintraege, {sum(len(d) for b in units.values() for d in b.values())} Eintraege im Bearbeitungsfenster")
