"""Override-Schicht fuer Sprachfassungen: Vertrag zwischen PR #315 (Leser: Seitenbau und Uebersetzungs-Skripte) und PR #319 (Redaktion: D1 + Export).

Grundsatz: Eine Sprachfassung wird einmal maschinell uebersetzt, danach bearbeitet die Redaktion einzelne Einheiten von Hand. Die Handtexte liegen NUR in D1
(i18n_override, #319) und in den daraus exportierten Dateien. Dieses Modul ist die EINZIGE Stelle, die sie anwendet: im Seitenbau (translate_blog.assemble,
apply_show, apply_notes) und in den Uebersetzungs-Skripten (Sperre, Veraltet-Liste). Nichts aus einem Override wird je nach data/blog_i18n oder
data/podpage_i18n geschrieben (reine Leseschicht ueber dem Maschinentext).

VERTRAG i18n-overrides v1
1. Arten (kind), Eintraege (item) und Einheiten (unit) - die Namen der D1-Zeilen und der API von #319:
   lblog    Blog-Sprachfassungen. item = Schluessel in data/blog_i18n (Slug des frueheren Beitrags, content/<slug> fuer Content-Pakete).
            unit = Einheiten-id aus translate_blog.source_of: T (Titel), D (Beschreibung), Q1/A1 ... (FAQ), 1..n (Absaetze).
   episode  Folgen der englischen Show. item = Folgen-Slug. unit = title | summary.
   notes    Show Notes der Folgen. item = Folgen-Slug. unit = html.
2. Dateien: data/i18n_overrides/<kind>/<lang>.json (UTF-8), eine Datei je Art und Sprache; der Inhalt ist der VOLLSTAENDIGE Stand dieser Art und Sprache:
     {"<item>": {"<unit>": {"t": "<Handtext>", "sh": "<Quell-Anker>"}}}
   t  = Text der Redaktion (lblog: Inline-HTML einer Einheit, notes: HTML, episode: reiner Text).
   sh = Quell-Anker, 8 Hex-Zeichen: Anfang des tm_hash des englischen Quelltexts, den der Editor beim Speichern vor sich hatte = anchor(kind, unit, quelltext)
        (lblog: tm_hash.unit_hash(unit, text)[:8]; episode/notes: tm_hash.fields_hash(text)[:8]). Der Worker rechnet nicht selbst: der Seitenbau veroeffentlicht
        den Anker je Einheit (translate_blog.editor_view, translate_show.anchors), die Oberflaeche schickt ihn beim Speichern mit, D1 speichert ihn
        (Spalte src_hash), der Export gibt ihn als "sh" aus.
   lblog: sh ist Pflicht; eine Einheit ohne gueltigen Anker wird nicht angewendet (das Protokoll nennt die Zahl). episode/notes: sh empfohlen; ohne Anker
   gilt der Text, die Veraltet-Erkennung faellt auf den Maschinentext zurueck. Die Kurzform "<unit>": "<text>" bedeutet: ohne Anker.
3. Export (Worker, #319): GET {COMMUNITY_API}/api/i18n/overrides?kind=<kind>&lang=<lang> -> {"kind": ..., "lang": ..., "items": <Dateiinhalt wie in 2.>},
   nur veroeffentlichte Eintraege. Seitenbau: site_i18n_overrides.sync() (#319) holt den Export und schreibt die Dateien, sonst nichts: Export erreichbar ->
   Datei ersetzen (keine Eintraege -> Datei loeschen), nicht erreichbar -> vorhandene Datei bleibt. Uebersetzungs-Skripte rufen use_api() auf: load() nimmt
   dann den Export anstelle der Datei, bei 404 oder Fehler die Datei.
4. Anwenden (nur in diesem Modul bzw. ueber place()):
   lblog: Ein Override gilt fuer GENAU EINE Einheit des aktuellen Originals und wird ueber den Anker gesetzt, nie ueber die Nummer allein:
     a) die Einheit mit derselben id, wenn ihr aktueller Quell-Anker dem Anker des Overrides entspricht;
     b) sonst die naechstgelegene Einheit mit diesem Quell-Anker (Absatz gewandert, weil davor eingefuegt oder geloescht wurde);
     c) sonst die Einheit, deren gespeicherter Maschinentext aus dieser Quelle stammt (rec.sh == Anker: Absatz an Ort und Stelle geaendert) - der Handtext
        bleibt stehen, die Einheit gilt als veraltet;
     d) sonst gar nicht (verwaist: Absatz geloescht oder mit --force-manual neu uebersetzt); es gilt der Maschinentext, das Protokoll nennt die Zahl.
   episode/notes: Felder wandern nicht; ein Override gilt, solange es existiert und die Folge eine Maschinenfassung hat.
   Bereinigung beim Anwenden (der Datei wird nie vertraut): lblog wie der Maschinentext durch site_podpage.san, sobald '<' oder '&' vorkommt; notes immer
   durch site_podpage.san; episode als reiner Text (Tags entfernt, Entities aufgeloest, Leerraum normalisiert). Bleibt danach nichts uebrig, gilt der Maschinentext.
5. Sperre: Einheiten und Felder mit angewendetem Override sendet kein Modus zur Uebersetzung (auto, run, stale, --redo), ausser mit --force-manual.
   --force-manual erneuert nur den Maschinentext darunter. lblog: danach passt der Anker zu nichts mehr (4d) und die frische Maschinenfassung wird sichtbar;
   episode/notes: der Handtext bleibt, bis die Redaktion ihn zuruecksetzt oder neu speichert.
6. Zuruecksetzen: Zeile in D1 loeschen (#319 revertUnit auf die Ursprungsfassung) -> die Einheit fehlt im Export -> die Datei enthaelt sie nicht mehr -> ab
   dem naechsten Bau bzw. Lauf gilt wieder der Maschinentext und die Sperre entfaellt. Es gibt keinen weiteren Speicherort, der nachzuziehen waere.
7. Veraltet-Listen (schreiben nur die Uebersetzungs-Skripte, #319 liest sie):
   data/blog_i18n/stale.json     {"<lang>": {"<item>": ["<unit>", ...]}}  Einheiten-ids des AKTUELLEN Originals, deren angezeigter Text (Maschine oder Hand)
                                 zu einem aelteren englischen Quelltext gehoert; nur fuer angezeigte (vollstaendige) Fassungen.
   data/podpage_i18n/stale.json  {"<lang>": {"<slug>": ["title" | "summary" | "notes_html", ...]}}  title/summary = kind episode (gleichnamige unit),
                                 notes_html = kind notes, unit html.
   Eine Einheit mit Override steht genau dann in der Liste, wenn ihr Anker nicht zum aktuellen Quelltext passt ("Handfassung, Original geaendert").
8. Wunschliste "neu uebersetzen" (#319, optional): GET /api/i18n/retranslate -> {"items": [{"kind", "item", "lang", "units": [...]}]}. Ein Lauf mit
   --stale --wishes arbeitet nur diese Eintraege ab (units leer = alle veralteten Einheiten des Eintrags) und meldet erledigte mit
   POST /api/i18n/retranslate/done {"items": [{"kind", "item", "lang"}]} zurueck (Kopfzeilen x-cron-key und x-requested-with: m365).
"""
import html as _html, json, os, re, sys, urllib.error, urllib.parse, urllib.request
from pathlib import Path
from tm_hash import unit_hash, fields_hash

DIR = Path(__file__).parent / "data" / "i18n_overrides"
KINDS = ("lblog", "episode", "notes")
UNITS = {"episode": ("title", "summary"), "notes": ("html",)}   # lblog: Einheiten-ids des Beitrags
STALE_FIELD = {"title": "title", "summary": "summary", "html": "notes_html"}   # unit -> Feldname in data/podpage_i18n/stale.json
UA = "m365-dub-build"
_CACHE = {}
_API = {"base": "", "off": False}
NOTES = {}   # (kind, lang, was) -> Anzahl; report() schreibt sie ins Protokoll


def clear_cache(): _CACHE.clear(); NOTES.clear()


def use_api(base=None):
    """Uebersetzungs-Skripte: Handtexte live aus dem Export der Redaktion lesen (Basis: I18N_OVERRIDES_API, sonst COMMUNITY_API). Ohne Basis bleibt es bei den Dateien."""
    _API["base"] = (base if base is not None else os.environ.get("I18N_OVERRIDES_API") or os.environ.get("COMMUNITY_API") or "").rstrip("/"); _API["off"] = False; clear_cache()


def anchor(kind, unit, source):
    """Quell-Anker einer Einheit (Vertrag 2): Anfang des tm_hash ihres englischen Quelltexts."""
    return (unit_hash(unit, source) if kind == "lblog" else fields_hash(source))[:8]


def note(kind, lang, what, n=1): NOTES[(kind, lang, what)] = NOTES.get((kind, lang, what), 0) + n


def report():
    for (kind, lang, what), n in sorted(NOTES.items()): print(f"Handtexte {kind}/{lang}: {n} {what}")


def _get(path, timeout=20):
    with urllib.request.urlopen(urllib.request.Request(_API["base"] + path, headers={"user-agent": UA}), timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def load_file(kind, lang):
    f = DIR / kind / f"{lang}.json"
    try: return json.loads(f.read_text("utf-8")) if f.exists() else {}
    except Exception as e:
        print(f"WARNUNG: {f} nicht lesbar ({str(e)[:80]}) - ohne Handtexte", file=sys.stderr); return {}


def load_api(kind, lang):
    """Export der Redaktion oder None (kein Endpunkt eingestellt, noch nicht ausgerollt, nicht erreichbar). Nach dem ersten Fehlschlag fragt der Lauf nicht weiter
    (sonst 14 Sprachen x Zeitlimit); 404 = Endpunkt gibt es noch nicht, ohne Meldung."""
    if not _API["base"] or _API["off"]: return None
    try:
        d = _get("/api/i18n/overrides?" + urllib.parse.urlencode({"kind": kind, "lang": lang}))
        return d["items"] if isinstance(d, dict) and isinstance(d.get("items"), dict) else None
    except Exception as e:
        _API["off"] = True
        if not (isinstance(e, urllib.error.HTTPError) and e.code == 404):
            print(f"WARNUNG: Export der Redaktion nicht abrufbar ({str(e)[:100]}) - es gelten die Dateien in data/i18n_overrides", file=sys.stderr)
        return None


def _norm(kind, lang, raw):
    """Datei-/Exportinhalt -> {item: {unit: {"t": text, "sh": anker | ""}}}; alles andere faellt weg (Vertrag 2)."""
    out = {}
    for item, us in (raw.items() if isinstance(raw, dict) else ()):
        for u, v in (us.items() if isinstance(us, dict) else ()):
            t, sh = (v.get("t"), v.get("sh")) if isinstance(v, dict) else (v, None)
            if not isinstance(t, str) or not t.strip(): continue
            sh = sh.strip().lower() if isinstance(sh, str) and re.fullmatch(r"[0-9a-fA-F]{8}", sh.strip()) else ""
            if kind in UNITS and u not in UNITS[kind]: continue
            if kind == "lblog" and not sh: note(kind, lang, "ohne Quell-Anker (nicht angewendet)"); continue   # koennte nach einer Aenderung des Originals auf einem anderen Absatz landen
            out.setdefault(str(item), {})[str(u)] = {"t": t, "sh": sh}
    return out


def load(kind, lang):
    k = (kind, lang)
    if k not in _CACHE:
        raw = load_api(kind, lang)   # der Export ist der vollstaendige Stand: er ersetzt die Datei (sonst bliebe ein zurueckgesetzter Text stehen)
        _CACHE[k] = _norm(kind, lang, load_file(kind, lang) if raw is None else raw)
    return _CACHE[k]


def get(kind, lang, item):
    """{unit: {"t", "sh"}} der Redaktion fuer einen Eintrag."""
    return load(kind, lang).get(item, {})


def clean(kind, unit, text):
    """Bereinigung beim Anwenden (Vertrag 4): der Datei wird nie vertraut, auch wenn der Worker schon gefiltert hat."""
    if kind == "episode": return re.sub(r"\s+", " ", _html.unescape(re.sub(r"<[^>]*>", " ", text))).strip()
    import site_podpage as P
    return P.san(text) if kind == "notes" or "<" in text or "&" in text else text


def _num(u): return int(re.sub(r"\D", "", str(u)) or 0)


def place(ov, cur, prev=None):
    """lblog (Vertrag 4a-d): Handtexte eines Eintrags den Einheiten des aktuellen Originals zuordnen. ov {unit: {t, sh}}, cur {unit: aktueller Quell-Anker},
    prev {unit: Anker der Quelle, aus der der gespeicherte Maschinentext stammt}. -> ({unit: (text, "ok" | "stale")}, [verwaiste Override-ids])"""
    out, rest, lost = {}, [], []
    for u in sorted(ov, key=_num):
        if cur.get(u) == ov[u]["sh"]: out[u] = (ov[u]["t"], "ok")
        else: rest.append(u)
    for u in rest:
        for src, st in ((cur, "ok"), (prev or {}, "stale")):
            c = [x for x, h in src.items() if h == ov[u]["sh"] and x in cur and x not in out]
            if c: out[min(c, key=lambda x: (abs(_num(x) - _num(u)), _num(x)))] = (ov[u]["t"], st); break
        else: lost.append(u)
    return out, lost


def outdated(o, cur, machine_stale=False):
    """Gehoert der angezeigte Text einer Einheit zu einem aelteren Quelltext (Vertrag 7)? Ohne Override entscheidet der Maschinentext, mit Override der Anker
    (ohne Anker ersatzweise der Maschinentext). o = Override der Einheit oder None, cur = aktueller Quell-Anker."""
    if not o: return machine_stale
    return o["sh"] != cur if o["sh"] else machine_stale


def apply_show(lang, data):
    """{slug: [titel, zusammenfassung]} der Maschine mit den Feldern der Redaktion (kind episode); neue Struktur, nur Folgen mit Maschinenfassung."""
    ov = load("episode", lang)
    if not ov: return data
    out = dict(data)
    for slug, f in ov.items():
        cur = out.get(slug)
        if not cur or not cur[0]: continue
        cur = list(cur) + [""]
        out[slug] = [("title" in f and clean("episode", "title", f["title"]["t"])) or cur[0], ("summary" in f and clean("episode", "summary", f["summary"]["t"])) or cur[1]]
    return out


def apply_notes(lang, data):
    """{slug: html} der Maschine mit den Show Notes der Redaktion (kind notes, unit html); bereinigt wie der Maschinentext."""
    ov = load("notes", lang)
    if not ov: return data
    out = dict(data)
    for slug, f in ov.items():
        h = clean("notes", "html", f["html"]["t"]) if slug in out and "html" in f else ""
        if h.strip(): out[slug] = h
    return out


# ---------- Wunschliste "neu uebersetzen" (Vertrag 8) ----------
def wishes(kind):
    """{lang: {item: [units]}} der offenen Wuensche dieser Art; leer ohne Endpunkt oder bei Fehler."""
    if not _API["base"]: return {}
    try: items = _get("/api/i18n/retranslate").get("items", [])
    except Exception as e:
        if not (isinstance(e, urllib.error.HTTPError) and e.code == 404): print("Wunschliste der Redaktion nicht abrufbar:", str(e)[:100])
        return {}
    out = {}
    for it in items if isinstance(items, list) else []:
        if isinstance(it, dict) and it.get("kind") == kind and it.get("lang") and it.get("item"):
            out.setdefault(str(it["lang"]), {})[str(it["item"])] = [str(u) for u in (it.get("units") if isinstance(it.get("units"), list) else [])]
    return out


def wishes_done(kind, done):
    """Erledigte Wuensche [(lang, item)] zurueckmelden; nur mit CRON_KEY (der Worker prueft x-cron-key). -> Anzahl gemeldeter Eintraege."""
    key = os.environ.get("CRON_KEY", ""); done = sorted(set(done)); n = 0
    if not done or not _API["base"] or not key: return 0
    for k in range(0, len(done), 400):
        body = json.dumps({"items": [{"kind": kind, "item": it, "lang": l} for l, it in done[k:k + 400]]}).encode()
        req = urllib.request.Request(_API["base"] + "/api/i18n/retranslate/done", data=body, method="POST",
                                     headers={"content-type": "application/json", "x-cron-key": key, "x-requested-with": "m365", "user-agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=30) as r: r.read()
            n += len(done[k:k + 400])
        except Exception as e:
            print("Wunschliste: Rueckmeldung fehlgeschlagen:", str(e)[:100]); break
    return n
