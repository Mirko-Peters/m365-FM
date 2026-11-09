"""Uebersetzt die Show Notes der meistgehoerten englischen Folgen (Haiku, Message Batch). Ranking: Spreaker-Statistik (Plays/Downloads seit 2025),
Ersatz: featured + neueste. Ergebnis: data/podpage_i18n/notes_<lang>.json {folgen-slug: html}. Kosten in usage.json (Schluessel notes_*).
Aufruf: python translate_notes.py [--langs de,fr] [--slugs a,b] [--stale] [--force-manual] [--wishes].
Je Folge und Sprache steht der Hash der englischen Show Notes in data/podpage_i18n/src/notes_<lang>.json (pro Feld, nicht pro Absatz: eine Anfrage uebersetzt das ganze HTML).
Politik wie translate_show.py: nur einmal uebersetzen; ein geaendertes Original wird nur in stale.json gemeldet (Feld notes_html) und erst mit --stale bzw. --wishes neu
uebersetzt; Show Notes mit Handtext der Redaktion (i18n_overrides: kind notes, unit html) sendet kein Lauf, ausser mit --force-manual; ist der Export der Redaktion nicht
abrufbar (Sperre unbekannt), sendet --stale/--wishes in dieser Sprache nichts und der Lauf endet mit Fehler. Altbestand bekommt beim ersten Lauf den
aktuellen Hash ohne API. Geprueft werden die Top-Folgen und alle Folgen, die schon eine Fassung haben (neu uebersetzt werden nur die Top-Folgen)."""
import json, os, sys, time, urllib.request
from site_text import bad as bad_text
from datetime import date
from pathlib import Path
import requests
import site_podpage as P
import site_shownotes_seo as SSEO
from translate_show import call, NAMES, OUT, MODEL, cost, guard, text_of, load_hashes, save_hashes, sync_hashes, update_stale, plan, notes_source, notes_hash, NOTES_MAXC, STALE_MAX, unknown_lock, halt
import i18n_overrides as OV
from ai_gateway import anthropic_request, check_budget, estimated_eur, report_usage, urlopen

TOP = int(os.environ.get("NOTES_TOP", "150")); MAXC = NOTES_MAXC
S = requests.Session(); API = "https://api.spreaker.com/v2"


def spreaker_get(url):
    r = S.get(url if url.startswith("http") else API + url, timeout=60); r.raise_for_status(); return r.json().get("response", {})


def paged(path):
    items, url = [], path
    while url:
        resp = spreaker_get(url); items += resp.get("items", []); url = resp.get("next_url")
    return items


def ranking(eps):
    """-> Liste Podpage-Folgen, meistgehoert zuerst"""
    tok = os.environ.get("SPREAKER_TOKEN", "").strip()
    if not tok and os.environ.get("SPREAKER_CLIENT_SECRET"):
        try:
            import spreaker_auth; d = spreaker_auth.load(); tok = d["access_token"] if d else ""
        except Exception: tok = ""
    by = {P.norm(e["name"]): e for e in eps}
    if tok:
        S.headers["Authorization"] = f"Bearer {tok}"
        try:
            titles = {str(x["episode_id"]): x.get("title") for x in paged("/shows/6704921/episodes?limit=100")}
            tot = paged(f"/shows/6704921/episodes/statistics/plays/totals?from=2025-01-01&to={date.today()}&limit=100")
            rows = []
            for it in tot:
                eid = str(it.get("episode_id") or (it.get("episode") or {}).get("episode_id") or "")
                nums = [v for k, v in it.items() if isinstance(v, (int, float)) and not isinstance(v, bool) and k not in ("episode_id", "show_id")]
                rows.append((max(nums, default=0), eid))
            rows.sort(reverse=True); out = []
            for sc, eid in rows:
                e = by.get(P.norm(titles.get(eid) or ""))
                if e and e not in out: out.append(e)
            if len(out) >= 20:
                print("Ranking aus Spreaker-Statistik:", len(out)); return out
        except Exception as ex:
            print("Statistik nicht verfuegbar:", str(ex)[:150])
    print("Ersatz-Ranking: featured + neueste")
    fe = [e for e in eps if e.get("featured") in (True, "True")]
    return fe + [e for e in sorted(eps, key=lambda e: e["create_time"], reverse=True) if e not in fe]


def src_hash(html):
    """Quell-Hash je Folge (Feld = ganzes HTML). Mit PR #315 (tm_hash.fields_hash) derselbe Hash wie dort, sonst sha256; Datei wie dort: data/podpage_i18n/src/notes_<lang>.json {slug: hash}."""
    try:
        from tm_hash import fields_hash
        return fields_hash(html)
    except Exception:
        import hashlib
        return hashlib.sha256(html.encode("utf-8")).hexdigest()[:16]


def load_src(langs):
    out = {}
    for l in langs:
        f = OUT / "src" / f"notes_{l}.json"
        try: out[l] = json.loads(f.read_text("utf-8"))
        except Exception: out[l] = {}
    return out


def save_src(h):
    (OUT / "src").mkdir(parents=True, exist_ok=True)
    for l, d in h.items(): (OUT / "src" / f"notes_{l}.json").write_text(json.dumps(d, ensure_ascii=False, sort_keys=True), encoding="utf-8")


def rewritten(eps):
    """Folgen mit neu geschriebenen englischen Notes (rewrite_shownotes.py) -> {slug: (episode-id, html, hash)}; Quelle der Uebersetzung ist deren schlanke HTML-Fassung."""
    out = {}
    for e in eps:
        n = SSEO.get(e["slug"])
        if n:
            h = SSEO.html_for_translation(n, P.ENTS, "https://www.m365.fm"); out[e["slug"]] = (e["id"], h, src_hash(h))
    return out


def main():
    arg = sys.argv; langs = [l for l in arg[arg.index("--langs") + 1].split(",") if l in NAMES] if "--langs" in arg else list(NAMES)
    slugs = set(arg[arg.index("--slugs") + 1].split(",")) if "--slugs" in arg else set()
    eps = [e for e in P.load("episodes") if e.get("published") not in (False, "False") and e.get("hidden") not in (True, "True") and len(P.plain(e.get("show_notes"))) > 200]
    top = ranking(eps)[:TOP]; tops = {e["slug"] for e in top}
    OUT.mkdir(parents=True, exist_ok=True)
    OV.use_api()   # Handtexte der Redaktion live aus dem Export (COMMUNITY_API), sonst aus data/i18n_overrides
    have = {l: (json.loads((OUT / f"notes_{l}.json").read_text("utf-8")) if (OUT / f"notes_{l}.json").exists() else {}) for l in langs}
    known = top + [e for e in eps if e["slug"] not in tops and any(e["slug"] in have[l] for l in langs)]   # auch Folgen ausserhalb der Top-Liste mit vorhandener Fassung pruefen
    hashes = load_hashes("notes_", langs); eh = {e["slug"]: notes_hash(e) for e in known}
    mig = sum(sync_hashes(have[l], hashes[l], eh) for l in langs)
    if mig: save_hashes("notes_", hashes); print(f"{mig} Quell-Hashes aus dem Bestand eingetragen (ohne API)")
    force_manual = "--force-manual" in arg
    wish = OV.wishes("notes") if "--wishes" in arg else None; stale_mode = "--stale" in arg or wish is not None   # Wunschliste der Redaktion (i18n_overrides Vertrag 8)
    held = unknown_lock("notes", langs, stale_mode, force_manual)   # Sperre unbekannt: in diesen Sprachen wird nichts Vorhandenes gesendet

    def scan():
        """Zustand aller geprueften Folgen: was zu senden waere und was veraltet ist (stale.json: Feld notes_html, nur gepruefte Sprachen und Folgen)."""
        send, stale = [], {}
        for l in langs:
            for e in known:
                go, listed = plan("notes", l, e["slug"], have[l], hashes[l], eh[e["slug"]], stale_mode, force_manual)
                if listed: stale.setdefault(l, {})[e["slug"]] = listed
                if e["slug"] not in tops and e["slug"] not in have[l]: continue   # ausserhalb der Top-Liste wird nichts neu angelegt
                if go and l not in held and not (slugs and e["slug"] not in slugs) and (wish is None or e["slug"] in wish.get(l, {})): send.append((l, e))
        update_stale(("notes_html",), stale, [e["slug"] for e in known], [l for l in langs if not OV.failed("notes", l)])   # Handtexte unbekannt: Liste der Sprache bleibt
        return send, stale

    def finish():
        """Nach dem Lauf: stale.json aus den neuen Hashes, erledigte Wuensche zurueck an die Redaktion."""
        open_ = {(l, e["slug"]) for l, e in scan()[0]}
        if wish is not None: OV.wishes_done("notes", [(l, s) for l in langs if l not in held for s in wish.get(l, {}) if (l, s) not in open_])

    send, stale = scan()
    if stale_mode and not slugs and wish is None and len(send) > STALE_MAX:
        print(f"--stale ohne --slugs: {len(send)} veraltete Show Notes, dieser Lauf sendet die ersten {STALE_MAX} (STALE_MAX)"); send = send[:STALE_MAX]
    reqs, key, nh = [], {}, {}
    for l, e in send:
        cid = f"{l}__{e['id']}"; key[cid] = e["slug"]; nh[cid] = eh[e["slug"]]
        reqs.append({"custom_id": cid, "params": {"model": MODEL, "max_tokens": 16000, "thinking": {"type": "disabled"},
            "system": f"Translate this podcast show-notes HTML into {NAMES[l]}. Keep the HTML tags and structure (p, ul, li, h2, h3, strong, em, a href). Keep product names (Microsoft 365, Copilot, Power BI, Azure ...) and URLs untranslated. Reply with the translated HTML only.",
            "messages": [{"role": "user", "content": notes_source(e)}]}})
    if stale: print(f"{sum(len(v) for v in stale.values())} Show Notes veraltet (Original geaendert) -> stale.json, nicht automatisch neu uebersetzt")
    if not reqs: finish(); print("Nichts zu tun"); halt("notes", held); return
    print(len(reqs), "Anfragen fuer", len(top), "Folgen")
    guard(len(reqs), 3500, 9000, "Show Notes")
    if not check_budget("translate_notes", MODEL, estimated_eur(len(json.dumps(reqs)) // 3, len(reqs) * 9000, batch=True)):
        return
    b = call("POST", "/v1/messages/batches", {"requests": reqs}, job="translate_notes"); bid = b["id"]; print("Batch", bid)
    while b["processing_status"] != "ended":
        time.sleep(120); b = call("GET", f"/v1/messages/batches/{bid}", job="translate_notes"); print(b["processing_status"], b["request_counts"], flush=True)
    tin = tout = ok = bad = 0; why = {}
    rq = anthropic_request(b["results_url"], headers={"x-api-key": os.environ["ANTHROPIC_API_KEY"]}, job="translate_notes", lang="batch", model=MODEL)
    for line in urlopen(rq, timeout=900).read().decode().splitlines():
        r = json.loads(line); res = r["result"]; l = r["custom_id"].split("__")[0]
        if res["type"] != "succeeded": bad += 1; why[res["type"]] = why.get(res["type"], 0) + 1; continue
        u = res["message"]["usage"]; tin += u["input_tokens"]; tout += u["output_tokens"]
        if res["message"].get("stop_reason") == "max_tokens": bad += 1; why["max_tokens"] = why.get("max_tokens", 0) + 1; continue
        if bad_text(text_of(res["message"])): bad += 1; why["encoding"] = why.get("encoding", 0) + 1; continue   # T5
        have[l][key[r["custom_id"]]] = P.san(text_of(res["message"])); hashes[l][key[r["custom_id"]]] = nh[r["custom_id"]]; ok += 1
    for l in langs: (OUT / f"notes_{l}.json").write_text(json.dumps(have[l], ensure_ascii=False), encoding="utf-8")
    save_hashes("notes_", hashes); finish()
    uf = OUT / "usage.json"; old = json.loads(uf.read_text()) if uf.exists() else {"input_tokens": 0, "output_tokens": 0, "runs": []}
    old["input_tokens"] += tin; old["output_tokens"] += tout; old["runs"].append({"kind": "notes", "batch": bid, "model": MODEL, "ok": ok, "failed": bad, "input_tokens": tin, "output_tokens": tout}); uf.write_text(json.dumps(old, indent=1))
    report_usage("translate_notes", MODEL, tin, tout, "batch", batch=True)
    rep = {"stage": "notes", "requests": len(reqs), "ok": ok, "failed": bad, "why": why, "input_tokens": tin, "output_tokens": tout, "cost_usd": round(cost(tin, tout), 3), "success_rate": round(ok / max(1, ok + bad), 4)}
    (OUT / "report_notes.json").write_text(json.dumps(rep, indent=1))
    print(f"fertig: {ok} ok, {bad} fehlgeschlagen {why}, Tokens ein/aus: {tin}/{tout}, Kosten {cost(tin, tout):.3f} $")
    halt("notes", held)
    return rep


if __name__ == "__main__":
    main()
