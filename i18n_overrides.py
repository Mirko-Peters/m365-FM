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
   Datei ersetzen (keine Eintraege -> Datei loeschen), nicht erreichbar -> vorhandene Datei bleibt. Uebersetzungs-Skripte rufen use_api() auf (Basis wie im
   ganzen Projekt: I18N_OVERRIDES_API, sonst COMMUNITY_API, sonst https://api-dub.m365.fm; nur use_api("") heisst ausdruecklich "nur die Dateien"): load()
   nimmt dann den Export anstelle der Datei, bei einem Fehler die Datei. Jeder Fehler (auch 404 - #319 ist ausgerollt, ein 404 heisst falsche Basis oder
   Rueckbau -, 5xx, Zeitlimit, Antwort ohne "items") macht den Sperrzustand dieser Art und Sprache unbekannt (failed()): siehe 5.
4. Anwenden (nur in diesem Modul bzw. ueber place()):
   lblog: Ein Override gilt fuer GENAU EINE Einheit des aktuellen Originals und wird ueber den Anker gesetzt, nie ueber die Nummer allein:
     a) die Einheit mit derselben id, wenn ihr aktueller Quell-Anker dem Anker des Overrides entspricht;
     b) sonst die naechstgelegene Einheit mit diesem Quell-Anker (Absatz gewandert, weil davor eingefuegt oder geloescht wurde);
     c) sonst die Einheit, deren gespeicherter Maschinentext aus dieser Quelle stammt (rec.sh == Anker: Absatz an Ort und Stelle geaendert) - der Handtext
        bleibt stehen, die Einheit gilt als veraltet;
     d) sonst gar nicht (verwaist: Absatz geloescht oder mit --force-manual neu uebersetzt); es gilt der Maschinentext, das Protokoll nennt die Zahl.
   episode/notes: Felder wandern nicht; ein Override gilt, solange es existiert und die Folge eine Maschinenfassung hat.
   Bereinigung beim Anwenden (der Datei wird nie vertraut): lblog-Absaetze wie der Maschinentext durch site_podpage.san, sobald '<' oder '&' vorkommt; notes immer
   durch site_podpage.san; episode und lblog T/D/Q/A als reiner Text (Tags entfernt, Entities aufgeloest, Leerraum normalisiert). Bleibt danach nichts uebrig, gilt der Maschinentext.
   Bilder (Projektregel: nur ueber den eigenen Bucket): ein <img> in einem Handtext bleibt nur, wenn seine Adresse mit https://img.m365.fm/ beginnt, der Seitenbau
   sie dorthin umschreibt (data/r2_map.json) oder sie schon im englischen Original bzw. im Maschinentext desselben Eintrags steht; jedes andere <img> wird
   entfernt (der uebrige Text bleibt). #319: cleanUnit im Worker lehnt solche Bilder schon beim Speichern ab (erste Linie), die Pruefung hier bleibt die zweite.
   Protokoll: report() nennt je Art und Sprache, wie viele Handtexte angewendet und wie viele NICHT angewendet wurden (ohne Quell-Anker, verwaist, Eintrag ohne
   angezeigte Fassung bzw. Folge ohne Maschinenfassung, nach der Bereinigung leer) - jede Einheit einmal; der Seitenbau ruft es am Ende auf, translate_blog im Status.
5. Sperre: Einheiten und Felder mit angewendetem Override sendet kein Modus zur Uebersetzung (auto, run, stale, --redo), ausser mit --force-manual; auch ein
   Treffer im Uebersetzungsspeicher ersetzt den Maschinentext einer solchen Blog-Einheit nicht.
   --force-manual erneuert nur den Maschinentext darunter. lblog: danach passt der Anker zu nichts mehr (4d) und die frische Maschinenfassung wird sichtbar;
   episode/notes: der Handtext bleibt, bis die Redaktion ihn zuruecksetzt oder neu speichert.
   Sperrzustand unbekannt (Export nicht abrufbar - failed(kind, lang)): kein Lauf ersetzt in dieser Sprache vorhandenen Text (jede schon uebersetzte Einheit
   gilt als gesperrt; fertige Batches und Agenten-Auftraege, die vorhandenen Text ersetzen, bleiben liegen, bis der Export wieder antwortet); ein Lauf, der
   genau das sollte (stale, --stale, --redo, --wishes), endet mit Fehler. Nie uebersetzte Einheiten und Folgen laufen weiter, ebenso --force-manual (braucht
   die Sperre nicht). Die Veraltet-Liste (7) dieser Sprache bleibt in so einem Lauf unveraendert.
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
IMG_HOST = "https://img.m365.fm/"   # Projektregel: Bilder nur ueber den eigenen R2-Bucket
_CACHE = {}
API_DEFAULT = "https://api-dub.m365.fm"   # wie COMMUNITY_API in den uebrigen Skripten (translate_blog.queue_items, site_fetch)
_API = {"base": "", "off": False, "err": ""}
_FAILED = set()   # (kind, lang): Export eingestellt, aber nicht abrufbar (auch 404) -> Sperrzustand unbekannt (Vertrag 5)
NOTES = {}   # (kind, lang, was) -> Anzahl; report() schreibt sie ins Protokoll
_NOTED = set()   # (kind, lang, was, schluessel): jede Einheit zaehlt einmal, auch wenn der Bau sie mehrfach ansieht
_ASKED = set()   # (kind, lang, item): Eintraege, nach denen ein Leser gefragt hat (der Rest hat keine angezeigte Fassung)


def clear_cache(): _CACHE.clear(); NOTES.clear(); _NOTED.clear(); _ASKED.clear()


def use_api(base=None):
    """Uebersetzungs-Skripte: Handtexte live aus dem Export der Redaktion lesen (Basis: I18N_OVERRIDES_API, sonst COMMUNITY_API, sonst API_DEFAULT - ein lokaler
    Lauf ohne Variable fragt also denselben Export wie der Workflow und liest nicht still die womoeglich fehlenden Dateien). use_api("") = nur die Dateien."""
    _API.update(base=(base if base is not None else os.environ.get("I18N_OVERRIDES_API") or os.environ.get("COMMUNITY_API") or API_DEFAULT).rstrip("/"), off=False, err=""); _FAILED.clear(); clear_cache()


def failed(kind, lang=None):
    """Sperrzustand unbekannt (Vertrag 5): der Export ist eingestellt, war fuer diese Art und Sprache aber nicht abrufbar (auch 404). Erst nach load()/get()
    aussagekraeftig. Ohne lang: die betroffenen Sprachen dieser Art, sortiert."""
    return (kind, lang) in _FAILED if lang else sorted(l for k, l in _FAILED if k == kind)


def anchor(kind, unit, source):
    """Quell-Anker einer Einheit (Vertrag 2): Anfang des tm_hash ihres englischen Quelltexts."""
    return (unit_hash(unit, source) if kind == "lblog" else fields_hash(source))[:8]


def note(kind, lang, what, n=1, key=None):
    """Zaehler fuers Protokoll; mit key (z. B. (item, unit)) zaehlt dieselbe Einheit nur einmal."""
    if key is not None:
        if (kind, lang, what, key) in _NOTED: return
        _NOTED.add((kind, lang, what, key))
    NOTES[(kind, lang, what)] = NOTES.get((kind, lang, what), 0) + n


def report():
    """Protokoll (Vertrag 4): je Art und Sprache angewendete und nicht angewendete Handtexte. Eintraege, nach denen kein Leser gefragt hat (lblog: Beitrag ohne
    angezeigte Fassung oder unbekannt), zaehlen als nicht angewendet. -> {(kind, lang, was): Anzahl}"""
    for (kind, lang), d in sorted(_CACHE.items()):
        if kind != "lblog": continue
        for item, us in d.items():
            if (kind, lang, item) not in _ASKED:
                for u in us: note(kind, lang, "ohne angezeigte Fassung des Eintrags (nicht angewendet)", key=(item, u))
    for (kind, lang, what), n in sorted(NOTES.items()): print(f"Handtexte {kind}/{lang}: {n} {what}")
    return dict(NOTES)


def _get(path, timeout=20):
    with urllib.request.urlopen(urllib.request.Request(_API["base"] + path, headers={"user-agent": UA}), timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def load_file(kind, lang):
    f = DIR / kind / f"{lang}.json"
    try: return json.loads(f.read_text("utf-8")) if f.exists() else {}
    except Exception as e:
        print(f"WARNUNG: {f} nicht lesbar ({str(e)[:80]}) - ohne Handtexte", file=sys.stderr); return {}


def load_api(kind, lang):
    """Export der Redaktion oder None (kein Endpunkt eingestellt oder nicht abrufbar). Nach dem ersten Fehlschlag fragt der Lauf nicht weiter
    (sonst 14 Sprachen x Zeitlimit). Jeder Fehlschlag, auch 404 (seit #319 gibt es den Endpunkt), merkt Art und Sprache in _FAILED (failed())."""
    if not _API["base"]: return None
    if _API["off"]:
        if _API["err"]: _FAILED.add((kind, lang))   # nicht mehr gefragt, aber genauso unbekannt
        return None
    try:
        d = _get("/api/i18n/overrides?" + urllib.parse.urlencode({"kind": kind, "lang": lang}))
        if isinstance(d, dict) and isinstance(d.get("items"), dict): return d["items"]
        raise ValueError("Antwort ohne items")
    except Exception as e:
        _API["off"] = True; _API["err"] = str(e)[:100] or type(e).__name__; _FAILED.add((kind, lang))
        print(f"WARNUNG: Export der Redaktion nicht abrufbar ({_API['err']}) - es gelten die Dateien in data/i18n_overrides; Sperrzustand unbekannt, "
              "vorhandene Texte werden in diesem Lauf nicht ersetzt", file=sys.stderr)
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
            if kind == "lblog" and not sh: note(kind, lang, "ohne Quell-Anker (nicht angewendet)", key=(str(item), str(u))); continue   # koennte nach einer Aenderung des Originals auf einem anderen Absatz landen
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
    _ASKED.add((kind, lang, item))
    return load(kind, lang).get(item, {})


PLAIN_UNIT = re.compile(r"^(?:T|D|[QA]\d+)$")   # lblog: Titel, Beschreibung und FAQ sind im Original reiner Text (translate_blog.source_of), nur Absaetze tragen Inline-HTML
_IMG = re.compile(r"<img\b[^>]*>", re.I)
_SRC = re.compile(r'\ssrc="([^"]*)"', re.I)


def img_srcs(html):
    """Bild-Adressen (wie sie im bereinigten HTML stehen) eines Textes."""
    return {m.group(1) for t in _IMG.findall(html or "") for m in [_SRC.search(t)] if m}


def clean(kind, unit, text, ref=""):
    """Bereinigung beim Anwenden (Vertrag 4): der Datei wird nie vertraut, auch wenn der Worker schon gefiltert hat. ref = bereinigtes HTML des Eintrags
    (englisches Original, Maschinentext): nur dessen Bilder und die des eigenen Buckets bleiben in einem Handtext stehen.
    Reiner Text (episode; lblog T/D/Q/A) bleibt unmaskiert wie der Maschinentext - die Seiten maskieren ihn beim Einsetzen (esc); san() wuerde '&' doppelt maskieren."""
    if kind == "episode" or (kind == "lblog" and PLAIN_UNIT.match(str(unit))): return re.sub(r"\s+", " ", _html.unescape(re.sub(r"<[^>]*>", " ", text))).strip()
    if not (kind == "notes" or "<" in text or "&" in text): return text
    import site_podpage as P
    out = P.san(text)
    if "<img" not in out.lower(): return out
    import site_r2 as R2
    known = img_srcs(ref)

    def own(tag):
        m = _SRC.search(tag); s = m.group(1) if m else ""
        return s.startswith(IMG_HOST) or R2.rewrite(s).startswith(IMG_HOST) or s in known
    return _IMG.sub(lambda m: m.group(0) if own(m.group(0)) else "", out)


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
        if not cur or not cur[0]: _unused("episode", lang, slug, f, "ohne Maschinenfassung der Folge (nicht angewendet)"); continue
        cur = list(cur) + [""]; new = {u: clean("episode", u, f[u]["t"]) if u in f else "" for u in ("title", "summary")}
        for u in f: note("episode", lang, "angewendet" if new.get(u) else "nach der Bereinigung leer (nicht angewendet)", key=(slug, u))
        out[slug] = [new["title"] or cur[0], new["summary"] or cur[1]]
    return out


def _unused(kind, lang, item, units, what):
    for u in units: note(kind, lang, what, key=(item, u))


def apply_notes(lang, data):
    """{slug: html} der Maschine mit den Show Notes der Redaktion (kind notes, unit html); bereinigt wie der Maschinentext."""
    ov = load("notes", lang)
    if not ov: return data
    out = dict(data)
    for slug, f in ov.items():
        if slug not in out: _unused("notes", lang, slug, f, "ohne Maschinenfassung der Folge (nicht angewendet)"); continue
        h = clean("notes", "html", f["html"]["t"], out[slug]) if "html" in f else ""   # Bilder: nur die der Maschinenfassung (= des Originals) und des eigenen Buckets
        if "html" in f: note("notes", lang, "angewendet" if h.strip() else "nach der Bereinigung leer (nicht angewendet)", key=(slug, "html"))
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
