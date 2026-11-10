"""Uebersetzt Show Notes englischer Folgen (Haiku, Message Batch): die der meistgehoerten Folgen (Ranking: Spreaker-Statistik, Plays/Downloads seit 2025,
Ersatz: featured + neueste; NOTES_TOP, 0 = keine) und die NEU GESCHRIEBENEN Show Notes (rewrite_shownotes.py) aller Folgen, bei denen die englische Seite sie zeigt
(site_shownotes_seo.rule: nur duenne Originale) - fuer diese gilt die Top-Grenze nicht. Ergebnis: data/podpage_i18n/notes_<lang>.json {folgen-slug: html}.
Kosten in usage.json (Schluessel notes_*). Aufruf: python translate_notes.py [--langs de,fr] [--slugs a,b] [--stale] [--force-manual] [--wishes].
Je Folge und Sprache steht der Hash der englischen Quelle (translate_show.notes_hash = tm_hash.fields_hash, kein anderer) in data/podpage_i18n/src/notes_<lang>.json
(pro Feld, nicht pro Absatz: eine Anfrage uebersetzt das ganze HTML).
Politik wie translate_show.py: nur einmal uebersetzen; ein geaendertes Original wird nur in stale.json gemeldet (Feld notes_html) und erst mit --stale bzw. --wishes neu
uebersetzt; Show Notes mit Handtext der Redaktion (i18n_overrides: kind notes, unit html) sendet kein Lauf, ausser mit --force-manual; ist der Export der Redaktion nicht
abrufbar (Sperre unbekannt), sendet --stale/--wishes in dieser Sprache nichts und der Lauf endet mit Fehler. Das gilt auch fuer neu geschriebene Notes: hat eine
Folge schon eine Uebersetzung ihrer alten (duennen) Show Notes, wird sie NICHT ueberschrieben, sondern wie jede andere Aenderung in stale.json gemeldet.
Altbestand bekommt beim ersten Lauf den Hash der BISHERIGEN Show Notes ohne API. Geprueft werden die Top-Folgen, die Folgen mit Neufassung und alle Folgen, die schon
eine Fassung haben (neu angelegt wird nur fuer die ersten beiden Gruppen).
Budget: ein Lauf sendet hoechstens Anfragen fuer NOTES_RUN_EUR (Standard 5 EUR, Schaetzung) und nie mehr, als das Haiku-Tagesbudget des Workers noch hergibt; der
Rest bleibt offen und kommt mit dem naechsten Lauf (ganze Folgen zuerst), nichts wird endgueltig uebersprungen."""
import json, os, sys, time, urllib.request
from site_text import bad as bad_text
from datetime import date
from pathlib import Path
import requests
import site_podpage as P
import site_shownotes_seo as SSEO
from tm_hash import fields_hash
from translate_show import call, NAMES, OUT, MODEL, cost, guard, text_of, load_hashes, save_hashes, sync_hashes, update_stale, plan, notes_source, notes_original, notes_hash, NOTES_MAXC, STALE_MAX, unknown_lock, halt
import i18n_overrides as OV
from ai_gateway import anthropic_request, check_budget, estimated_eur, remaining_eur, report_usage, urlopen

TOP = int(os.environ.get("NOTES_TOP", "150")); MAXC = NOTES_MAXC
RUN_EUR = float(os.environ.get("NOTES_RUN_EUR") or 5)   # hoechstens so viel (geschaetzt) je Lauf; das Haiku-Tagesbudget des Workers (AI_DAILY_EUR_HAIKU) kann kleiner sein
OUT_RW, OUT_OLD = 2500, 9000   # geschaetzte Ausgabe-Token je Anfrage: neu geschriebene Notes sind kurz (ueblich unter 1.500), bisherige Show Notes bis 8.000 Zeichen HTML
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


def request_for(l, e, rw):
    """Eine Batch-Anfrage: Folge e in Sprache l. rw = die Quelle ist die Neufassung (kurz, ohne Links - die Themen-Zeile setzt der Seitenbau).
    Denken aus nur bei Haiku ("disabled" ist dort erlaubt; andere Modelle weisen es teils mit HTTP 400 ab - wie generate_covers.py und tools/translate_*.py)."""
    sysm = (f"Translate this podcast show-notes HTML into {NAMES[l]}. Keep the HTML tags and structure (p, ul, li, h2, h3, strong). Keep product names (Microsoft 365, Copilot, Power BI, Azure ...) and time stamps like 12:30 untranslated. Reply with the translated HTML only."
            if rw else f"Translate this podcast show-notes HTML into {NAMES[l]}. Keep the HTML tags and structure (p, ul, li, h2, h3, strong, em, a href). Keep product names (Microsoft 365, Copilot, Power BI, Azure ...) and URLs untranslated. Reply with the translated HTML only.")
    return {"custom_id": f"{l}__{e['id']}", "params": {"model": MODEL, "max_tokens": 6000 if rw else 16000, **({"thinking": {"type": "disabled"}} if "haiku" in MODEL else {}), "system": sysm, "messages": [{"role": "user", "content": notes_source(e)}]}}


def est_eur(req, rw):
    return estimated_eur(len(json.dumps(req)) // 3, OUT_RW if rw else OUT_OLD, batch=True)


def fit(items, cap):
    """items [(anfrage, geschaetzte EUR)] der Reihe nach, solange die Summe unter cap bleibt. -> (anzahl, summe). Nie ein Teil einer Anfrage; die uebrigen bleiben offen."""
    n = 0; total = 0.0
    for _, c in items:
        if total + c > cap: break
        n += 1; total += c
    return n, total


def main():
    arg = sys.argv; langs = [l for l in arg[arg.index("--langs") + 1].split(",") if l in NAMES] if "--langs" in arg else list(NAMES)
    slugs = set(arg[arg.index("--slugs") + 1].split(",")) if "--slugs" in arg else set()
    allep = [e for e in P.load("episodes") if e.get("published") not in (False, "False") and e.get("hidden") not in (True, "True")]
    eps = [e for e in allep if len(P.plain(e.get("show_notes"))) > 200]
    wait_rw = {e["slug"] for e in allep if SSEO.undecided(e)}   # Neufassung vorhanden, aber Editor-Export nicht abrufbar: in diesem Lauf weder senden noch als veraltet melden
    rw = {e["slug"] for e in allep if e["slug"] not in wait_rw and SSEO.source_for_translation(e)}   # englische Seite zeigt die Neufassung: alle Sprachen, die Top-Grenze gilt nicht
    top = [e for e in (ranking(eps)[:TOP] if TOP else []) if e["slug"] not in wait_rw]; tslugs = {e["slug"] for e in top}; tops = tslugs | rw
    OUT.mkdir(parents=True, exist_ok=True)
    OV.use_api()   # Handtexte der Redaktion live aus dem Export (COMMUNITY_API), sonst aus data/i18n_overrides
    have = {l: (json.loads((OUT / f"notes_{l}.json").read_text("utf-8")) if (OUT / f"notes_{l}.json").exists() else {}) for l in langs}
    known = top + [e for e in allep if e["slug"] in rw and e["slug"] not in tslugs]
    known += [e for e in allep if e["slug"] not in tops and e["slug"] not in wait_rw and any(e["slug"] in have[l] for l in langs)]   # auch Folgen ausserhalb der beiden Gruppen mit vorhandener Fassung pruefen
    order = {e["slug"]: k for k, e in enumerate(known)}
    hashes = load_hashes("notes_", langs); eh = {e["slug"]: notes_hash(e) for e in known}
    oh = {e["slug"]: fields_hash(notes_original(e)) for e in known}   # Altbestand wurde aus den bisherigen Show Notes uebersetzt, nie aus einer Neufassung
    mig = sum(sync_hashes(have[l], hashes[l], oh) for l in langs)
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
                if e["slug"] not in tops and e["slug"] not in have[l]: continue   # ausserhalb der Top-Liste und der Neufassungen wird nichts neu angelegt
                if go and l not in held and not (slugs and e["slug"] not in slugs) and (wish is None or e["slug"] in wish.get(l, {})): send.append((l, e))
        update_stale(("notes_html",), stale, [e["slug"] for e in known], [l for l in langs if not OV.failed("notes", l)])   # Handtexte unbekannt: Liste der Sprache bleibt
        return send, stale

    def finish():
        """Nach dem Lauf: stale.json aus den neuen Hashes, erledigte Wuensche zurueck an die Redaktion."""
        open_ = {(l, e["slug"]) for l, e in scan()[0]}
        if wish is not None: OV.wishes_done("notes", [(l, s) for l in langs if l not in held for s in wish.get(l, {}) if (l, s) not in open_])

    send, stale = scan()
    if rw or wait_rw: print(f"{len(rw)} Folgen mit neu geschriebenen Show Notes auf der englischen Seite" + (f"; {len(wait_rw)} weitere ausgelassen (Export der Editor-Fassungen nicht abrufbar)" if wait_rw else ""))
    if stale_mode and not slugs and wish is None and len(send) > STALE_MAX:
        print(f"--stale ohne --slugs: {len(send)} veraltete Show Notes, dieser Lauf sendet die ersten {STALE_MAX} (STALE_MAX)"); send = send[:STALE_MAX]
    items = []
    for l, e in send:
        r = request_for(l, e, e["slug"] in rw); items.append((r, est_eur(r, e["slug"] in rw), l, e))
    if stale: print(f"{sum(len(v) for v in stale.values())} Show Notes veraltet (Original geaendert) -> stale.json, nicht automatisch neu uebersetzt")
    if not items: finish(); print("Nichts zu tun"); halt("notes", held); return
    left = remaining_eur("translate_notes", MODEL); cap = RUN_EUR if left is None else min(RUN_EUR, left); total = sum(x[1] for x in items)
    if total > cap:   # zu viel fuer einen Lauf: ganze Folgen zuerst (alle Sprachen einer Folge), der Rest bleibt offen und kommt mit dem naechsten Lauf
        items.sort(key=lambda x: order[x[3]["slug"]]); n, part = fit([(x[0], x[1]) for x in items], cap)
        print(f"{len(items)} Anfragen offen (geschaetzt {total:.2f} EUR); dieser Lauf sendet {n} (geschaetzt {part:.2f} EUR, Grenze {cap:.2f} EUR = NOTES_RUN_EUR"
              + ("" if left is None else f" bzw. Rest des Haiku-Tagesbudgets {left:.2f} EUR") + f"), {len(items) - n} bleiben fuer den naechsten Lauf")
        items = items[:n]; total = part
        if not items: finish(); print("::warning::Haiku-Tagesbudget reicht heute fuer keine Anfrage - nichts gesendet, der naechste Lauf holt alles nach."); halt("notes", held); return
    reqs = [x[0] for x in items]; key = {x[0]["custom_id"]: x[3]["slug"] for x in items}; nh = {x[0]["custom_id"]: eh[x[3]["slug"]] for x in items}
    nrw = sum(1 for x in items if x[3]["slug"] in rw)
    print(len(reqs), "Anfragen:", nrw, "neu geschriebene Show Notes,", len(reqs) - nrw, "bisherige Show Notes der", len(top), "meistgehoerten Folgen")
    if nrw: guard(nrw, 1500, OUT_RW, "Show Notes (neu geschrieben)")
    if len(reqs) > nrw: guard(len(reqs) - nrw, 3500, OUT_OLD, "Show Notes")
    if not check_budget("translate_notes", MODEL, total):
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
        if res["message"].get("stop_reason") == "refusal" or not P.plain(text_of(res["message"])): bad += 1; why["leer"] = why.get("leer", 0) + 1; continue   # Ablehnung oder leere Antwort: nichts speichern, die Folge bleibt offen
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
