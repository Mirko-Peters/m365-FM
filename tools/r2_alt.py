#!/usr/bin/env python3
"""Alt-Texte fuer die Inhaltsbilder im R2-Bucket per Claude Haiku (Message Batches API, halber Preis), Ergebnis in data/r2_alt.json.gz.

  python tools/r2_alt.py plan [--limit N]                      zaehlen und Kosten schaetzen (EUR), nichts wird gesendet
  python tools/r2_alt.py run [--limit N] [--source url|base64]   Batch senden (nur mit Haiku-Tagesbudget), Status in data/r2_alt_state.json
  python tools/r2_alt.py collect [--wait SEK]                  offenen Batch abwarten und einsammeln -> data/r2_alt.json.gz

Nur von Hand ueber .github/workflows/r2-alt.yml (plan / run). Bilder: alle <img> der frueheren Podpage-Blogbeitraege (data/podpage/blog_posts.json.gz)
und der Show Notes (data/podpage/episodes.json.gz), deren Adresse der Seitenbau auf img.m365.fm umschreibt (data/r2_map.json); Bilder auf fremden Hosts
listet plan auf (erst mit r2-images.yml kopieren). Je Bild eine Anfrage: Bild (URL auf img.m365.fm oder Base64 aus dem Bucket-Spiegel) + Kontext
(Seitentitel, Ueberschrift darueber, Text davor/danach, vorhandener Alt-Text) -> JSON {kind, decorative, alt: {alle 15 Seitensprachen}, chart_points}.
Fertige Bilder werden nie ein zweites Mal bezahlt (Schluessel = endgueltige R2-URL, auch nach einem --shrink-Umzug, site_img_alt.build_index);
inhaltlich unbrauchbare Antworten zaehlen als Versuch (hoechstens MAX_TRIES), Ausfaelle der API nicht. Einsatz beim Seitenbau: site_img_alt.apply."""
import argparse, base64, gzip, json, os, sys, time, urllib.error, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_img_alt as ALT  # noqa: E402
from ai_gateway import USER_AGENT, anthropic_request, check_budget, estimated_eur, report_usage, thinking_off, urlopen  # noqa: E402

D = ROOT / "data"
OUT = D / "r2_alt.json.gz"
STATE = D / "r2_alt_state.json"
DIMS = D / "r2_dims.json"
MODEL = os.environ.get("R2_ALT_MODEL", "claude-haiku-5-5")   # wie tools/ontology_ai.py; Preise aus ai_gateway.estimated_eur (HAIKU_USD_PER_MTOK_IN/OUT)
JOB = "r2_alt"
VERSION = 1
MAX_TRIES = 2
MAX_TOKENS = 2500   # 15 Sprachen (ja/ko/ar/he brauchen mehr Token) + chart_points; Denken ist aus (thinking_off)
OUT_TOKENS_EST = 900   # geschaetzte Ausgabe je Bild
IMG_TOKENS_DEFAULT = 1100   # ohne Masse in r2_dims.json
VISION = (".webp", ".png", ".jpg", ".jpeg", ".gif")   # SVG/AVIF/PDF kann das Modell nicht lesen
B64_BATCH_BYTES = 150_000_000   # Base64-Batches bleiben unter der Groessengrenze der Batch API (256 MB)
B64_MAX_IMAGE = 5_000_000   # Grenze der API je Bild
KINDS = ["chart", "diagram", "screenshot", "photo", "product", "illustration", "logo", "decorative"]
LANG_NAMES = {"en": "English", "de": "German", "fr": "French", "es": "Spanish", "it": "Italian", "nl": "Dutch", "pt": "Portuguese (Brazil)", "pl": "Polish",
              "id": "Indonesian", "ru": "Russian", "uk": "Ukrainian", "ar": "Arabic", "he": "Hebrew", "ja": "Japanese", "ko": "Korean"}
SCHEMA = {
    "type": "object", "additionalProperties": False, "required": ["kind", "decorative", "alt", "chart_points"],
    "properties": {
        "kind": {"type": "string", "enum": KINDS},
        "decorative": {"type": "boolean"},
        "alt": {"type": "object", "additionalProperties": False, "required": list(ALT.LANGS), "properties": {l: {"type": "string"} for l in ALT.LANGS}},
        "chart_points": {"type": "array", "items": {"type": "string"}},
    },
}
SYSTEM = (
    "You write alt text (WCAG 2.2) for images in articles of M365.FM, a podcast and knowledge site about Microsoft 365, Azure, Power Platform and AI. "
    "You get one image and its context: page title, the heading above the image, text before and after it, and the current alt text (often just a copy of the heading). "
    "Return JSON only, matching the schema.\n"
    "Rules:\n"
    "- alt: what the image shows or says, as one short phrase or sentence, max 125 characters; for charts and diagrams up to 250 characters with the chart type and its key message. "
    "Use only what is visible in the image; numbers only if they are readable in the image. Never invent product names, brands, people or numbers.\n"
    "- Do not start with 'Image of', 'Picture of', 'Bild von' or similar, and do not repeat the heading word for word; the heading is read right before the image.\n"
    "- Product photos: name the product from the heading or context if the image matches it.\n"
    "- Write every language natively (not a word-for-word translation): " + ", ".join(f"{k} = {v}" for k, v in LANG_NAMES.items()) + ". "
    "Keep product names (Microsoft Teams, SharePoint, Power BI, Copilot ...) in their official form.\n"
    "- decorative: true only for pure patterns, ornaments or stock mood images without information; then every alt is an empty string.\n"
    "- kind: chart, diagram, screenshot, photo, product, illustration, logo or decorative.\n"
    "- chart_points: for charts and diagrams up to 4 key statements in English (only visible facts), otherwise an empty list."
)


# ------------------------------------------------------------------ Daten
def jload(p, default):
    try:
        return json.loads(gzip.open(p, "rt", encoding="utf-8").read() if str(p).endswith(".gz") else Path(p).read_text("utf-8"))
    except (OSError, ValueError):
        return default


def save_out(data, path=None):
    """Deterministisch (sortiert, gzip ohne Zeitstempel), damit ein Lauf ohne neue Ergebnisse keinen Diff erzeugt."""
    path = path or OUT
    raw = json.dumps(dict(sorted(data.items())), ensure_ascii=False, separators=(",", ":"), sort_keys=True).encode("utf-8")
    with open(path, "wb") as f, gzip.GzipFile(fileobj=f, mode="wb", mtime=0, filename="") as g:
        g.write(raw)


def save_state(st, path=None):
    path = path or STATE
    Path(path).write_text(json.dumps(st, ensure_ascii=False, indent=1, sort_keys=True) + "\n", "utf-8")


def sources(root=None):
    """(Seitentitel, HTML) der englischen Quellen: fruehere Blogbeitraege, Show Notes der veroeffentlichten Folgen."""
    root = root or ROOT; out = []
    for p in jload(root / "data" / "podpage" / "blog_posts.json.gz", []):
        if p.get("title") and p.get("html"):
            out.append(("blog", p.get("slug") or "", p["title"], p["html"]))
    for e in jload(root / "data" / "podpage" / "episodes.json.gz", []):
        if e.get("show_notes") and e.get("published") not in (False, "False") and e.get("hidden") not in (True, "True"):
            out.append(("notes", e.get("slug") or "", e.get("name") or "", e["show_notes"]))
    return out


def collect_images(srcs):
    """-> (Bilder je R2-URL mit erstem Kontext, fremde Bilder {URL: Zahl}). Je URL: erster Fundort als Kontext, alle Original-URLs und Alt-Texte."""
    items, foreign = {}, {}
    for kind, slug, title, html in srcs:
        for im in ALT.scan(html):
            src = (im["src"] or "").strip()
            if not src.startswith("http"):
                continue
            u = ALT.r2_url(src)
            if not u.startswith(ALT.PUBLIC):
                foreign[src] = foreign.get(src, 0) + 1
                continue
            it = items.get(u)
            if not it:
                it = items[u] = {"url": u, "src": [], "orig_alts": [], "uses": 0, "where": f"{kind}:{slug}",
                                 "ctx": {"page_title": title, "heading": im["heading"], "alt": im["alt"] or "", "before": im["before"], "after": im["after"]}}
            it["uses"] += 1
            if src not in it["src"]: it["src"].append(src)
            a = (im["alt"] or "").strip()
            if a and a not in it["orig_alts"]: it["orig_alts"].append(a)
    return items, foreign


def vision_ok(url):
    return url.split("?")[0].lower().endswith(VISION)


def pending(items, done_idx, tries):
    """Bilder ohne Ergebnis, lesbar fuer das Modell, nicht nach MAX_TRIES Fehlversuchen gesperrt (Reihenfolge: haeufig genutzte zuerst)."""
    out = [it for u, it in items.items() if u not in done_idx and vision_ok(u) and (tries.get(u) or {}).get("n", 0) < MAX_TRIES]
    return sorted(out, key=lambda it: (-it["uses"], it["url"]))


def image_tokens(url, dims):
    """Bild-Token wie die API sie zaehlt: Breite*Hoehe/750 nach Verkleinern auf hoechstens 1568 px Kante bzw. ~1,15 MP."""
    wh = dims.get(url)
    if not (isinstance(wh, (list, tuple)) and len(wh) == 2 and all(isinstance(x, int) and x > 0 for x in wh)):
        return IMG_TOKENS_DEFAULT
    w, h = wh
    s = min(1.0, 1568 / max(w, h), (1_150_000 / (w * h)) ** 0.5)
    return max(50, int(w * s * h * s / 750))


def user_text(it):
    c = it["ctx"]
    return json.dumps({"page_title": c["page_title"], "heading_above": c["heading"], "current_alt": c["alt"], "text_before": c["before"], "text_after": c["after"]}, ensure_ascii=False)


def estimate(sel, dims):
    """(Eingabe-, Ausgabe-Token) geschaetzt."""
    sys_t = len(SYSTEM) // 3 + 120   # System + Schema
    tin = sum(image_tokens(it["url"], dims) + sys_t + len(user_text(it)) // 3 + 30 for it in sel)
    return tin, OUT_TOKENS_EST * len(sel)


# ------------------------------------------------------------------ Anfragen
def fetch_b64(url, timeout=60):
    """Bild von img.m365.fm laden -> (media_type, Base64) fuer den Fall, dass Anthropics Abruf der URL scheitert."""
    req = urllib.request.Request(url, headers={"user-agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read(B64_MAX_IMAGE + 1); ct = (r.headers.get("content-type") or "").split(";")[0].strip().lower()
    if len(data) > B64_MAX_IMAGE:
        raise ValueError("Bild groesser als 5 MB")
    if ct not in ("image/webp", "image/png", "image/jpeg", "image/gif"):
        ext = url.split("?")[0].rsplit(".", 1)[-1].lower()
        ct = {"webp": "image/webp", "png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "gif": "image/gif"}.get(ext, "")
        if not ct:
            raise ValueError("unbekannter Bildtyp")
    return ct, base64.b64encode(data).decode("ascii")


def request_for(it, cid, image=None):
    """Eine Batch-Anfrage. image: None = Bild als URL (img.m365.fm), sonst (media_type, base64)."""
    src = {"type": "url", "url": it["url"]} if image is None else {"type": "base64", "media_type": image[0], "data": image[1]}
    return {"custom_id": cid, "params": {"model": MODEL, "max_tokens": MAX_TOKENS, **thinking_off(MODEL), "system": SYSTEM,
            "output_config": {"format": {"type": "json_schema", "schema": SCHEMA}},
            "messages": [{"role": "user", "content": [{"type": "image", "source": src}, {"type": "text", "text": user_text(it)}]}]}}


def api(method, path, body=None):
    req = anthropic_request(path, body, job=JOB, lang="batch", model=MODEL, api_key=os.environ["ANTHROPIC_API_KEY"])
    req.method = method
    try:
        return json.loads(urlopen(req, timeout=300).read())
    except urllib.error.HTTPError as e:   # Antworttext der API ins Protokoll (enthaelt keinen Schluessel)
        try: detail = e.read().decode("utf-8", "replace")[:600]
        except Exception: detail = ""
        print(f"API-Fehler {e.code} {method} {path.split('?')[0][-60:]}: {detail}", flush=True); raise


def results(url):
    rq = anthropic_request(url, headers={"x-api-key": os.environ["ANTHROPIC_API_KEY"]}, job=JOB, lang="batch", model=MODEL)
    return urlopen(rq, timeout=900).read().decode().splitlines()


# ------------------------------------------------------------------ Antworten
def clip(s, n):
    s = " ".join(str(s or "").replace("<", "").replace(">", "").split())
    if len(s) <= n:
        return s
    cut = s[:n].rsplit(" ", 1)[0]
    return (cut or s[:n]).rstrip(" ,;:-") + "…"


def validate(txt):
    """Antworttext -> (Eintrag ohne Metadaten, None) oder (None, Grund)."""
    try:
        obj = json.loads(txt)
    except ValueError:
        return None, "kein JSON"
    if not isinstance(obj, dict) or not isinstance(obj.get("alt"), dict):
        return None, "falsche Form"
    kind = obj.get("kind") if obj.get("kind") in KINDS else "illustration"
    deco = bool(obj.get("decorative")) or kind == "decorative"
    n = 250 if kind in ("chart", "diagram") else 160
    alt = {l: clip(obj["alt"].get(l), n) for l in ALT.LANGS}
    if deco:
        alt = {l: "" for l in ALT.LANGS}
    else:
        miss = [l for l in ALT.LANGS if not alt[l]]
        if miss:
            return None, "Sprachen fehlen: " + ",".join(miss[:5])
        if ALT.is_weak(alt["en"]):
            return None, "Platzhalter als Alt-Text"
    pts = [clip(p, 200) for p in (obj.get("chart_points") or []) if isinstance(p, str) and p.strip()][:4]
    return {"kind": kind, "decorative": deco, "alt": alt, "chart_points": pts if kind in ("chart", "diagram") else []}, None


def _api_reason(res):
    e = res.get("error") or {}
    while isinstance(e.get("error"), dict): e = e["error"]
    return (res.get("type", "?") + (f": {e.get('type', '')} {e.get('message', '')}".rstrip() if e else ""))[:200]


def apply_results(lines, mapping, items, out, tries, now=None):
    """Batch-Ergebnisse (JSONL) auswerten. Gueltige -> out[url]; inhaltliche Fehler (kein JSON, max_tokens, Ablehnung) -> tries;
    API-Ausfaelle (errored/expired/canceled) aendern tries nicht. -> (ok, bad, tin, tout, cache_read, cache_write, {grund: anzahl})"""
    ok = bad = tin = tout = cr = cw = 0; fail = {}
    now = now or time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    for line in lines:
        if not line.strip():
            continue
        r = json.loads(line); url = mapping.get(r.get("custom_id"))
        if not url:
            continue
        res = r.get("result") or {}
        if res.get("type") != "succeeded":
            k = _api_reason(res); fail[k] = fail.get(k, 0) + 1; continue
        msg = res["message"]; u = msg.get("usage") or {}
        cr += int(u.get("cache_read_input_tokens") or 0); cw += int(u.get("cache_creation_input_tokens") or 0)
        tin += int(u.get("input_tokens") or 0) + int(u.get("cache_read_input_tokens") or 0) + int(u.get("cache_creation_input_tokens") or 0); tout += int(u.get("output_tokens") or 0)
        if msg.get("stop_reason") == "max_tokens": entry, why = None, "max_tokens"
        elif msg.get("stop_reason") == "refusal": entry, why = None, "Ablehnung " + str((msg.get("stop_details") or {}).get("category") or "")
        else: entry, why = validate("".join(c.get("text", "") for c in msg.get("content") or [] if c.get("type") == "text"))
        if entry:
            it = items.get(url) or {}
            out[url] = {**entry, "src": sorted(it.get("src") or []), "orig_alts": it.get("orig_alts") or [], "model": msg.get("model") or MODEL, "ts": now, "v": VERSION}
            tries.pop(url, None); ok += 1
        else:
            t = tries.get(url) or {}
            tries[url] = {"n": t.get("n", 0) + 1, "err": why[:200]}; bad += 1
    return ok, bad, tin, tout, cr, cw, fail


# ------------------------------------------------------------------ Ablauf
def overview(root=None):
    root = root or ROOT
    data = jload(OUT, {})
    st = jload(STATE, {}) or {}
    idx = ALT.build_index(data)
    items, foreign = collect_images(sources(root))
    return data, st, idx, items, foreign


def select(todo, limit, source, fetch=fetch_b64):
    """Auswahl fuer einen Batch. Bei source=base64 werden die Bilder geladen; zu grosse/nicht ladbare bleiben fuer einen URL-Lauf offen."""
    todo = todo[:limit] if limit else todo
    if source != "base64":
        return [(it, None) for it in todo], []
    sel, skipped, size = [], [], 0
    for it in todo:
        try:
            img = fetch(it["url"])
        except Exception as ex:
            skipped.append((it["url"], f"{type(ex).__name__}: {str(ex)[:80]}")); continue
        if size + len(img[1]) > B64_BATCH_BYTES:
            break
        size += len(img[1]); sel.append((it, img))
    return sel, skipped


def plan_text(items, foreign, idx, st, dims):
    tries = st.get("tries") or {}
    todo = pending(items, idx, tries)
    done = sum(1 for u in items if u in idx)
    novis = sum(1 for u in items if not vision_ok(u))
    locked = sum(1 for u in items if u not in idx and (tries.get(u) or {}).get("n", 0) >= MAX_TRIES)
    tin, tout = estimate(todo, dims)
    lines = [f"Inhaltsbilder auf img.m365.fm: {len(items)} (Vorkommen {sum(it['uses'] for it in items.values())}); fertig {done}; offen {len(todo)}; "
             f"gesperrt nach {MAX_TRIES} Fehlversuchen {locked}; nicht lesbar (SVG/AVIF) {novis}",
             f"Schaetzung fuer {len(todo)} Bilder ({MODEL}, alle {len(ALT.LANGS)} Sprachen): {tin} Eingabe-/{tout} Ausgabe-Token = "
             f"ca. {estimated_eur(tin, tout, batch=True):.2f} EUR mit Batch API (ohne Batch {estimated_eur(tin, tout):.2f} EUR)"]
    if st.get("batch"):
        lines.append(f"Offener Batch {st['batch'].get('id')} mit {len(st['batch'].get('map') or {})} Bildern (Schaetzung {st['batch'].get('est_eur', 0):.2f} EUR): wird vor jedem neuen Lauf eingesammelt")
    if foreign:
        lines.append(f"Bilder auf fremden Hosts (noch nicht in data/r2_map.json, zuerst mit r2-images.yml kopieren): {len(foreign)}")
        lines += [f"  {n}x {u}" for u, n in sorted(foreign.items(), key=lambda kv: (-kv[1], kv[0]))]
    return "\n".join(lines), todo


def collect(st, items, data, wait_s, api_fn=None, results_fn=None, sleep=time.sleep):
    """Offenen Batch abwarten und einsammeln. -> True, wenn eingesammelt (st['batch'] dann geleert)."""
    api_fn = api_fn or api; results_fn = results_fn or results
    b = st.get("batch")
    if not b:
        print("Kein offener Batch"); return False
    deadline = time.time() + wait_s
    while True:
        info = api_fn("GET", f"/v1/messages/batches/{b['id']}")
        print(info.get("processing_status"), info.get("request_counts"), flush=True)
        if info.get("processing_status") == "ended":
            break
        if time.time() >= deadline:
            print("Batch laeuft noch; wird beim naechsten Lauf (collect/run) eingesammelt"); return False
        sleep(60)
    tries = st.setdefault("tries", {})
    ok, bad, tin, tout, cr, cw, fail = apply_results(results_fn(info["results_url"]), b["map"], items, data, tries)
    report_usage(JOB, MODEL, tin, tout, "batch", batch=True, cache_read=cr, cache_write=cw)   # bezahlt: immer melden
    save_out(data); st["batch"] = None
    st.setdefault("runs", []).append({"id": b["id"], "ok": ok, "bad": bad, "api_fail": sum(fail.values()), "tin": tin, "tout": tout,
                                      "eur": round(estimated_eur(tin, tout, batch=True), 4), "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())})
    save_state(st)
    nfail = sum(fail.values())
    print(f"fertig: {ok} ok, {bad} inhaltlich fehlgeschlagen (zaehlt als Versuch), {nfail} ohne Ergebnis der API (zaehlt nicht); "
          f"Token ein/aus {tin}/{tout} = ca. {estimated_eur(tin, tout, batch=True):.2f} EUR (Batch-Preis, Schaetzung war {b.get('est_eur', 0):.2f} EUR)")
    for k, n in sorted(fail.items(), key=lambda kv: -kv[1])[:8]:
        print(f"  ohne Ergebnis {n} x {k}")
    if nfail * 2 > len(b["map"]):
        print("::warning::Mehr als die Haelfte ohne Ergebnis der API - bei Fehlern beim Bildabruf den Lauf mit source=base64 wiederholen")
    return True


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("mode", choices=["plan", "run", "collect"], nargs="?", default="plan")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--source", choices=["url", "base64"], default="url")
    ap.add_argument("--wait", type=int, default=int(os.environ.get("R2_ALT_WAIT_S") or 0), help="Sekunden auf das Ende des Batches warten (collect)")
    a = ap.parse_args(argv)
    data, st, idx, items, foreign = overview()
    dims = jload(DIMS, {})
    txt, todo = plan_text(items, foreign, idx, st, dims)
    print(txt)
    if a.mode == "plan":
        return 0
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("::warning::Kein ANTHROPIC_API_KEY - nichts gesendet"); return 0
    if a.mode == "collect" or st.get("batch"):
        if not collect(st, items, data, a.wait):
            return 0
        idx = ALT.build_index(data); todo = pending(items, idx, st.get("tries") or {})
        if a.mode == "collect":
            return 0
    if not todo:
        print("Nichts offen"); return 0
    sel, skipped = select(todo, a.limit, a.source)
    for u, why in skipped[:20]:
        print(f"  nicht geladen ({why}): {u}")
    if not sel:
        print("Keine Bilder fuer diesen Lauf"); return 0
    tin, tout = estimate([it for it, _ in sel], dims)
    eur = estimated_eur(tin, tout, batch=True)
    print(f"Dieser Lauf: {len(sel)} Bilder, Quelle {a.source}, geschaetzt {tin}/{tout} Token = ca. {eur:.2f} EUR (Batch)")
    if not check_budget(JOB, MODEL, eur):
        return 0
    mapping = {f"a{i:05d}": it["url"] for i, (it, _) in enumerate(sel)}
    b = api("POST", "/v1/messages/batches", {"requests": [request_for(it, cid, img) for cid, (it, img) in zip(mapping, sel)]})
    st["batch"] = {"id": b["id"], "map": mapping, "est_eur": round(eur, 4), "source": a.source, "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
    save_state(st)   # vor dem Warten sichern: der Workflow committet den Stand, ein spaeterer Lauf sammelt ein
    print("Batch", b["id"], "gesendet")
    return 0


if __name__ == "__main__":
    sys.exit(main())
