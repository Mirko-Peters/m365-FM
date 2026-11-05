#!/usr/bin/env python3
"""Subscribr-Skripte nach und nach anlegen (Mirko, 5.11.2026: "alle paar Tage ein paar neue Skripte, nicht alle sofort").

Warteschlange: data/subscribr_queue.json
  {"_doc": ..., "floor": 700, "defaults": {...}, "channels": {"63800": {"name": "SAP Community", "per_run": 4}, ...},
   "items": [{"channel": 63800, "title": "...", "topic": "...", "status": "pending|created|failed", "script_id": null, "created": ""}]}

Je Lauf und Kanal werden höchstens `per_run` offene Einträge angelegt (POST /api/v1/channels/{id}/scripts) und die Skript-
Erstellung gestartet (POST /api/v1/scripts/{id}/agent/generate, research auto). Vorher und nach jedem Skript wird der Credit-Stand
geprüft (GET /api/v1/team/credits); fällt er unter `floor` (Mirkos Reserve 600 + Puffer), endet der Lauf. Der Kanal "Rencore"
wird nie angefasst. Zugang nur über das GitHub-Secret SUBSCRIBR_API_TOKEN (Bearer), nie im Code oder Log.
Aufruf: python tools/subscribr_queue.py [--dry-run]
"""
import argparse, json, os, sys, time, urllib.error, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QUEUE = ROOT / "data" / "subscribr_queue.json"
API = os.environ.get("SUBSCRIBR_API", "https://subscribr.ai/api/v1")
BLOCKED = {63579}   # Rencore: Reserve für die Sponsor-Folge, nie anfassen
PAUSE = 35          # Subscribr drosselt das Anlegen (429 bei schnellerer Folge)


def call(method, path, token, body=None, tries=4):
    data = json.dumps(body).encode() if body is not None else None
    for i in range(tries):
        rq = urllib.request.Request(API + path, data=data, method=method,
                                    headers={"Authorization": "Bearer " + token, "Accept": "application/json", "Content-Type": "application/json", "User-Agent": "m365fm-subscribr-queue/1.0 (+https://www.m365.fm)"})
        try:
            with urllib.request.urlopen(rq, timeout=60) as r:
                return r.status, json.loads(r.read().decode() or "{}")
        except urllib.error.HTTPError as e:
            if e.code == 429 and i < tries - 1:
                time.sleep(60 * (i + 1)); continue
            raw = e.read().decode(errors="replace")
            try: return e.code, json.loads(raw or "{}")
            except Exception: return e.code, {"_raw": raw[:160], "_ctype": e.headers.get("content-type", ""), "_server": e.headers.get("server", "")}
        except Exception as e:   # noqa: BLE001
            if i < tries - 1: time.sleep(15); continue
            print("Abruf fehlgeschlagen:", path.split("?")[0], type(e).__name__); return 0, {}
    return 0, {}


def credits(token):
    st, j = call("GET", "/team/credits", token)
    try: return int(float((j.get("credits") or {}).get("credits_remaining")))
    except (TypeError, ValueError): return None


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--check", action="store_true", help="nur Zugang prüfen (Credits lesen, Skriptliste lesen), nichts anlegen")
    a = ap.parse_args()
    if a.check:
        token = os.environ.get("SUBSCRIBR_API_TOKEN", "").strip()
        if not token:
            print("::error::Secret SUBSCRIBR_API_TOKEN fehlt"); return 1
        st, j = call("GET", "/team/credits", token)
        print("Credits-Abfrage:", st, "Stand:", (j.get("credits") or {}).get("credits_remaining"))
        if st != 200:
            print("Antwort:", {k: v for k, v in j.items() if k in ("message", "error", "_ctype", "_server")}, (j.get("_raw") or "")[:120].replace("\n", " "))
        st2, _ = call("GET", "/channels/63800/scripts?per_page=1", token)
        print("Skripte lesen (scripts:read):", st2)
        ok = st == 200 and st2 == 200
        print("Zugang OK" if ok else "::error::Zugang fehlerhaft (401 = Token ungültig, 403 = Recht fehlt)")
        return 0 if ok else 1
    q = json.loads(QUEUE.read_text("utf-8"))
    floor = int(q.get("floor", 700)); d = q.get("defaults", {})
    plan = {}
    for it in q["items"]:
        ch = int(it["channel"])
        if it.get("status") != "pending" or ch in BLOCKED: continue
        lim = int((q.get("channels", {}).get(str(ch)) or {}).get("per_run", 3))
        if len(plan.setdefault(ch, [])) < lim: plan[ch].append(it)
    todo = [x for v in plan.values() for x in v]
    print(f"Offen gesamt: {sum(1 for x in q['items'] if x.get('status') == 'pending')}, diesen Lauf: {len(todo)}")
    if a.dry_run:
        for x in todo: print(" -", x["channel"], x["title"])
        return
    token = os.environ.get("SUBSCRIBR_API_TOKEN", "").strip()
    if not token:
        print("::warning::Secret SUBSCRIBR_API_TOKEN fehlt – nichts angelegt"); return
    c = credits(token); print("Credits vorher:", c)
    if c is None or c < floor:
        print(f"Credits unter der Grenze {floor} oder unbekannt – nichts angelegt"); return
    # Nachlauf: früher gestartete Läufe prüfen; abgebrochene neu starten (Subscribr erstattet die Credits, ein Neustart kostet
    # wieder 6) – höchstens 2 Neustarts je Skript; fertige als "done" markieren. Abfragen mit Pause (Subscribr: ~20/min).
    for it in q["items"]:
        if it.get("status") != "created" or not it.get("script_id") or not it.get("run_id"): continue
        st, j = call("GET", f"/scripts/{it['script_id']}/agent/runs/{it['run_id']}", token); time.sleep(3)
        state = (j.get("data") or {}).get("status", "")
        if state.startswith("completed"):
            it["status"] = "done"
        elif state == "failed" and int(it.get("restarts", 0)) < 2:
            g, gj = call("POST", f"/scripts/{it['script_id']}/agent/generate", token, {"research": "auto", "visual_cues": "off"}); time.sleep(5)
            if g in (200, 202):
                it["run_id"] = gj.get("run_id"); it["restarts"] = int(it.get("restarts", 0)) + 1
                print(f"neu gestartet {it['script_id']}: {it['title']}")
        elif state == "failed":
            it["status"] = "failed"; it["error"] = "Lauf dreimal abgebrochen"
    QUEUE.write_text(json.dumps(q, ensure_ascii=False, indent=1) + "\n", "utf-8")
    made = 0
    for it in todo:
        st, j = call("POST", f"/channels/{int(it['channel'])}/scripts", token, {
            "title": it["title"], "topic": it["topic"] + d.get("topic_suffix", ""), "angle": it.get("angle") or d.get("angle", ""),
            "length": int(it.get("length") or d.get("length", 3200)), "language": it.get("language") or d.get("language", "English")})
        sid = (j.get("data") or {}).get("script_id")
        if st != 201 or not sid:
            it["status"] = "failed"; it["error"] = f"create {st}"; print("Fehler beim Anlegen:", it["title"], st); continue
        time.sleep(5)
        g, gj = call("POST", f"/scripts/{sid}/agent/generate", token, {"research": "auto", "visual_cues": "off"})
        it.update(status="created" if g in (200, 202) else "failed", script_id=sid, run_id=gj.get("run_id"), created=datetime.now(timezone.utc).strftime("%Y-%m-%d"))
        if g not in (200, 202): it["error"] = f"generate {g}"
        made += 1; print(f"angelegt {sid} ({g}): {it['title']}")
        QUEUE.write_text(json.dumps(q, ensure_ascii=False, indent=1) + "\n", "utf-8")   # Zwischenstand sichern
        c = credits(token)
        if c is not None and c < floor:
            print(f"Credits {c} unter {floor} – Lauf beendet"); break
        time.sleep(PAUSE)
    QUEUE.write_text(json.dumps(q, ensure_ascii=False, indent=1) + "\n", "utf-8")
    print(f"Angelegt: {made}, Credits nachher: {credits(token)}")


if __name__ == "__main__":
    sys.exit(main())
