"""Sprachfassungen: Zulieferung fuer die Redaktion (#319). Dieses Modul WENDET NICHTS AN.

Vertrag: i18n_overrides.py ("VERTRAG i18n-overrides v1"). Handtexte der Redaktion liegen in D1 (Worker, i18n_override) und im Export
GET /api/i18n/overrides?kind=&lang= -> {kind, lang, items: {item: {unit: {"t", "sh"}}}}. Angewendet werden sie ausschliesslich ueber i18n_overrides.py
(translate_blog.assemble, apply_show, apply_notes) - dort werden sie ueber den Quell-Anker gesetzt und beim Anwenden bereinigt. Hier gibt es nur:
- sync(): holt den Export (site_fetch, mit Cache-Rueckfall) und schreibt data/i18n_overrides/<kind>/<lang>.json. Export erreichbar -> Datei ersetzen
  (keine Eintraege -> Datei loeschen), nicht erreichbar -> die vorhandene Datei bleibt.
- note_blog() / note_podpage(): merken je Eintrag, was die Redaktion im Tab "Sprachfassungen" braucht - Original neben der angezeigten Fassung und je
  Einheit der Quell-Anker, den die Oberflaeche beim Speichern als "sh" mitschickt (translate_blog.editor_view, translate_show.anchors). Nur fuer veraltete,
  schon bearbeitete und von der Redaktion angeforderte Eintraege (alle Einheiten aller Fassungen zu veroeffentlichen waere zu gross): die Anforderung
  ("Zum Bearbeiten anfordern", Worker /api/editor/i18n/open) nennt der Export unter "open", sync() merkt sie fuer diesen Bau. Ohne sie gaebe es fuer eine
  korrekte, aber schlechte Maschinenfassung nie einen ersten Handtext (lblog speichert nur mit Anker).
- publish(): schreibt daraus docs/i18n-stale.json und docs/i18n-units/<kind>/<lang>.json. Muss NACH allen note_*-Aufrufen laufen (generate_site.py: nach
  PP.build), sonst fehlen Folgen und Show Notes.
Veraltet-Listen (schreiben nur die Uebersetzungs-Skripte, Vertrag Punkt 7): Blog aus translate_blog.editor_view (dieselbe Rechnung wie data/blog_i18n/stale.json,
aber zum Stand dieses Baus); Folgen und Show Notes aus data/podpage_i18n/stale.json = {lang: {slug: [title | summary | notes_html]}} - FELDNAMEN:
title/summary gehoeren zur Art episode (gleichnamige Einheit), notes_html zur Art notes (Einheit html)."""
import json, re
from pathlib import Path
import i18n_overrides as OV

ROOT = Path(__file__).parent
KINDS = OV.KINDS
LANGS = ("de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")
SHOW_STALE = ROOT / "data" / "podpage_i18n" / "stale.json"
_NOTED = {}   # (kind, lang) -> {item: {"units": [[id, original, angezeigter Text, Quell-Anker]], "stale": [ids], "edited": [ids]}}
_SHOW = {}    # Zwischenspeicher der Veraltet-Liste der Show (eine Datei fuer episode und notes)
_OPEN = {}    # (kind, lang) -> {item}: von der Redaktion angeforderte Absatz-Ansichten (Export "open", sync)
CONTENT = "content/"   # Schluesselpraefix der Content-Pakete in data/blog_i18n (= site_content_blog.TR_PREFIX; hier ohne dessen Importe)


def paths():
    return [f"/api/i18n/overrides?kind={k}&lang={l}" for k in KINDS for l in LANGS]


def _file(kind, lang):
    return OV.DIR / kind / f"{lang}.json"


def _units(us):
    """Einheiten eines Eintrags aus dem Export -> {unit: {"t", "sh"}}; alles andere faellt weg (der Leser prueft und bereinigt ohnehin noch einmal)."""
    out = {}
    for u, v in (us.items() if isinstance(us, dict) else ()):
        t, sh = (v.get("t"), v.get("sh")) if isinstance(v, dict) else (v, "")
        if isinstance(t, str) and t.strip(): out[str(u)] = {"t": t, "sh": sh if isinstance(sh, str) else ""}
    return out


def sync(api=None):
    """Exporte nach data/i18n_overrides/ schreiben (Vertrag Punkt 3); Rueckgabe: Anzahl der Handtexte. Schreibt nur Dateien - angewendet wird nichts."""
    import site_fetch as SF
    api = api or SF.API
    n = 0
    for p in paths():
        j = SF.fetch(api + p)
        k, l = re.search(r"kind=(\w+)&lang=(\w+)", p).groups()
        if not isinstance(j, dict) or not isinstance(j.get("items"), dict):
            continue   # nicht erreichbar: vorhandene Datei bleibt
        items = {str(i): us for i, us in ((i, _units(u)) for i, u in j["items"].items()) if us}
        op = j.get("open")
        _OPEN[(k, l)] = {i for i in op if isinstance(i, str) and i} if isinstance(op, list) else set()
        f = _file(k, l)
        if items:
            f.parent.mkdir(parents=True, exist_ok=True); f.write_text(json.dumps(items, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
            n += sum(len(u) for u in items.values())
        elif f.exists():
            f.unlink()   # alle Aenderungen wurden zurueckgesetzt
    OV.clear_cache()   # der Leser hat die Dateien evtl. schon gelesen
    if n: print(f"Sprachfassungen: {n} Handtexte aus der Redaktion")
    return n


def asked(kind, lang, item):
    """Absatz-Ansicht dieses Eintrags von der Redaktion angefordert (Export "open")? Sprachfassungen der Content-Pakete heissen hier content/<slug>;
    der Worker speichert die Anforderung unter diesem Schluessel (i18n_edit.js buildKey), der blanke Slug zaehlt trotzdem (aeltere oder ueber einen
    anderen Weg gestellte Anforderung) - einen frueheren Beitrag mit demselben Slug ueberspringt translations() ohnehin."""
    s = _OPEN.get((kind, lang), ())
    return item in s or (kind == "lblog" and item.startswith(CONTENT) and item[len(CONTENT):] in s)


def _note(kind, lang, item, units, stale, edited):
    if stale or edited or asked(kind, lang, item):
        _NOTED.setdefault((kind, lang), {})[item] = {"units": units, "stale": list(stale), "edited": list(edited)}


def note_blog(lang, item, src, rec):
    """Blog-Sprachfassung fuer die Redaktion vormerken: genau das, was assemble zeigt (translate_blog.editor_view - Einheiten des AKTUELLEN Originals,
    Handtexte ueber den Anker zugeordnet und bereinigt). Fassungen, die nicht erscheinen, werden nicht vorgemerkt."""
    if not rec:
        return
    import translate_blog as TB
    v = TB.editor_view(lang, src if src.get("slug") == item else {**src, "slug": item}, rec)
    if v:
        _note("lblog", lang, item, v["units"], v["stale"], v["edited"])


def _show_stale(lang):
    """{slug: [title | summary | notes_html]} dieser Sprache aus data/podpage_i18n/stale.json (Vertrag Punkt 7); andere Formen zaehlen als leer."""
    if "j" not in _SHOW:
        try:
            j = json.loads(SHOW_STALE.read_text("utf-8")) if SHOW_STALE.exists() else {}
        except Exception:
            j = {}
        _SHOW["j"] = j if isinstance(j, dict) else {}
    sv = _SHOW["j"].get(lang)
    return sv if isinstance(sv, dict) else {}


def note_podpage(eps, TRL, NTL):
    """Folgen (kind episode: title, summary) und Show Notes (kind notes: html) vormerken. TRL[lang][slug] = [Titel, Zusammenfassung] und NTL[lang][slug] = HTML
    sind die ANGEZEIGTEN Fassungen (nach i18n_overrides.apply_show/apply_notes). Original und Quell-Anker kommen aus translate_show (dieselben Texte, die
    uebersetzt werden)."""
    import translate_show as TS
    by = {e["slug"]: e for e in eps}
    src = {}   # slug -> (titel, zusammenfassung, notes-html, anker) - je Folge einmal, nicht je Sprache

    def source(slug):
        if slug not in src:
            e = by[slug]; t, sm = TS.show_source(e)
            src[slug] = (t, sm, TS.notes_source(e), TS.anchors(e))
        return src[slug]
    for l in set(TRL) | set(NTL):
        sv = _show_stale(l)
        for slug in sorted(set(TRL.get(l) or {}) | set(NTL.get(l) or {})):
            if slug not in by:
                continue
            fields = sv.get(slug) if isinstance(sv.get(slug), list) else []
            cur = (TRL.get(l) or {}).get(slug)
            ed = set(OV.get("episode", l, slug)) & {"title", "summary"}
            st = [f for f in ("title", "summary") if f in fields]
            if cur and cur[0] and (st or ed or asked("episode", l, slug)):
                t, sm, _, a = source(slug)
                _note("episode", l, slug, [["title", t, cur[0], a["title"]], ["summary", sm, cur[1] if len(cur) > 1 else "", a["summary"]]], st, sorted(ed))
            html = (NTL.get(l) or {}).get(slug)
            ned = set(OV.get("notes", l, slug)) & {"html"}
            nst = ["html"] if "notes_html" in fields else []
            if html and (nst or ned or asked("notes", l, slug)):
                _, _, nsrc, a = source(slug)
                _note("notes", l, slug, [["html", nsrc, html, a["html"]]], nst, sorted(ned))


def publish(out):
    """docs/i18n-stale.json + docs/i18n-units/<kind>/<lang>.json aus allem, was note_blog/note_podpage in diesem Bau vorgemerkt haben."""
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
