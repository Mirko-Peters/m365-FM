#!/usr/bin/env python3
"""Uebersetzt fehlende Texte (Kurzbeschreibung, Langbeschreibung) der Entitaeten zwischen Englisch und Deutsch mit der Claude-API (Haiku, wenige Cent).
Nur Luecken werden gefuellt, vorhandene Texte bleiben unberuehrt. Produktnamen, Aliase und Fachbegriffe werden nicht uebersetzt.

  export ANTHROPIC_API_KEY=...
  python3 tools/translate_missing.py --dry-run     # zeigt nur, was fehlt, und eine grobe Kostenschaetzung
  python3 tools/translate_missing.py               # uebersetzt und schreibt data/entities.json
Optional: --model claude-haiku-5-5 (Standard), --limit 20 (nur die ersten N)
"""
import argparse, json, os, sys, urllib.request
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from ai_gateway import anthropic_request, check_budget, estimated_eur, report_usage, urlopen

P = "data/entities.json"
SYS = ("You translate short encyclopedia texts about Microsoft products and IT concepts between English and German. "
       "Never translate names: product and feature names, session and event titles, person and company names, abbreviations and codes (e.g. Copilot Studio, Power Fx, D365FO, MS-900, M365Con) stay exactly as written. "
       "Keep the same length, tone and paragraph structure (blank lines between paragraphs). No links, no quotes, no commentary. "
       "Answer with a JSON object that maps each given key to its translation, and nothing else.")


def call(key, model, items):
    body = {"model": model, "max_tokens": 4000, "system": SYS,
            "messages": [{"role": "user", "content": json.dumps(items, ensure_ascii=False)}]}
    req = anthropic_request("/v1/messages", body, job="translate_missing", lang="en-de", model=model, cache_ttl=604800, api_key=key)
    with urlopen(req, timeout=120) as r:
        response = json.load(r)
    usage = response.get("usage", {})
    report_usage("translate_missing", model, usage.get("input_tokens", 0), usage.get("output_tokens", 0), "en-de")
    txt = response["content"][0]["text"].strip()
    if txt.startswith("```"):
        txt = txt.strip("`").split("\n", 1)[1].rsplit("```", 1)[0]
    return json.loads(txt)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--dry-run", action="store_true"); ap.add_argument("--model", default="claude-haiku-5-5"); ap.add_argument("--limit", type=int, default=0)
    a = ap.parse_args()
    D = json.load(open(P, encoding="utf-8")); todo = []   # (entity, feld, quellsprache, zielsprache, text)
    for e in D:
        for field in ("desc", "long"):
            v = e.get(field) or {}
            for src, dst in (("en", "de"), ("de", "en")):
                if v.get(src, "").strip() and not v.get(dst, "").strip():
                    todo.append((e, field, src, dst, v[src]))
    if a.limit:
        todo = todo[:a.limit]
    chars = sum(len(t[4]) for t in todo)
    print(f"{len(todo)} fehlende Texte, {chars} Zeichen (ca. {chars // 3} Token Eingabe + gleich viel Ausgabe)")
    if a.dry_run or not todo:
        return
    estimate = estimated_eur(chars // 3, chars // 3)
    if not check_budget("translate_missing", a.model, estimate):
        return
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        sys.exit("ANTHROPIC_API_KEY fehlt")
    for i in range(0, len(todo), 12):   # 12 Texte pro Anfrage
        chunk = todo[i:i + 12]
        res = call(key, a.model, {f"{e['id']}|{f}|{s}>{d}": f"[{s}->{d}] {txt}" for e, f, s, d, txt in chunk})
        for e, f, s, d, txt in chunk:
            out = str(res.get(f"{e['id']}|{f}|{s}>{d}", "")).replace(f"[{s}->{d}] ", "").strip()
            if out and (f != "desc" or 20 <= len(out) <= 300):
                e.setdefault(f, {})[d] = out
        json.dump(D, open(P, "w", encoding="utf-8"), ensure_ascii=False, indent=1)   # nach jedem Block speichern
        print(f"  {min(i + 12, len(todo))}/{len(todo)}")


main()
