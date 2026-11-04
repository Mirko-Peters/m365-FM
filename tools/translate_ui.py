#!/usr/bin/env python3
"""Übersetzt die Oberflächen-Texte der Skripte (assets/*.js, englische Quelle in data/ui_js_en.json) mit der Claude-API (Haiku, wenige Cent)
in fr, es, it, nl, pt, pl und speichert sie in data/ui_js_i18n.json. Nur Lücken werden gefüllt, vorhandene Übersetzungen bleiben.

  export ANTHROPIC_API_KEY=...
  python3 tools/translate_ui.py --dry-run          # zeigt Umfang und grobe Kosten
  python3 tools/translate_ui.py                    # übersetzt alle Lücken
  python3 tools/translate_ui.py --lang fr          # nur eine Sprache
"""
import argparse, json, os, sys, urllib.request
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from ai_gateway import anthropic_request, check_budget, estimated_eur, report_usage, urlopen

SRC, DST = "data/ui_js_en.json", "data/ui_js_i18n.json"
LANGS = {"fr": "French", "es": "Spanish", "it": "Italian", "nl": "Dutch", "pt": "Portuguese (European)", "pl": "Polish"}
SYS = ("You translate short user-interface texts (buttons, labels, hints, messages) of a Microsoft community website from English into {lang}. "
       "Keep placeholders such as {{n}}, {{s}}, {{e}}, {{f}}, {{c}}, {{u}}, HTML entities and symbols (✓, ·, –, …) exactly. "
       "Never translate names: product, feature, event, session, person and company names, abbreviations and codes (Copilot, Power Platform, M365Con, MVP, MCT, Schema.org, LinkedIn) stay unchanged. "
       "Use the informal address that is usual for community sites (e.g. tu / tú / tu / je / você / ty). Keep each text about as long as the English one. "
       "Answer only with a JSON object that maps every given key to its translation.")


def call(key, model, lang, items):
    body = {"model": model, "max_tokens": 6000, "system": SYS.format(lang=lang), "messages": [{"role": "user", "content": json.dumps(items, ensure_ascii=False)}]}
    req = anthropic_request("/v1/messages", body, job="translate_ui", lang=lang, model=model, cache_ttl=604800, api_key=key)
    with urlopen(req, timeout=180) as r:
        response = json.load(r)
    usage = response.get("usage", {})
    report_usage("translate_ui", model, usage.get("input_tokens", 0), usage.get("output_tokens", 0), lang)
    txt = response["content"][0]["text"].strip()
    if txt.startswith("```"):
        txt = txt.strip("`").split("\n", 1)[1].rsplit("```", 1)[0]
    return json.loads(txt)


ERR = "data/ui_js_error.txt"


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--dry-run", action="store_true"); ap.add_argument("--model", default="claude-haiku-5-5"); ap.add_argument("--lang")
    a = ap.parse_args()
    en = json.load(open(SRC)); out = json.load(open(DST)) if os.path.exists(DST) else {}
    langs = [a.lang] if a.lang else list(LANGS)
    todo = {lg: [(k, kk, v) for k, d in en.items() for kk, v in d.items() if isinstance(v, str) and v.strip() and kk not in out.get(lg, {}).get(k, {})] for lg in langs}
    chars = sum(len(v) for lg in langs for _, _, v in todo[lg])
    print({lg: len(todo[lg]) for lg in langs}, f"{chars} Zeichen Quelltext (ca. {chars // 3} Token ein, {chars // 3} aus; Haiku: wenige Cent)")
    if a.dry_run:
        return
    estimate = estimated_eur(chars // 3, chars // 3)
    if not check_budget("translate_ui", a.model, estimate):
        return
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        open(ERR, "w").write("ANTHROPIC_API_KEY fehlt (GitHub-Secret nicht gesetzt)\n"); sys.exit("ANTHROPIC_API_KEY fehlt")
    errs = []
    for lg in langs:
        items = todo[lg]
        for i in range(0, len(items), 40):
            chunk = items[i:i + 40]
            try:
                res = call(key, a.model, LANGS[lg], {f"{k}|{kk}": v for k, kk, v in chunk})
            except Exception as e:
                msg = f"{lg} {i}: {type(e).__name__}: {e}"
                if hasattr(e, "read"):
                    try: msg += " | " + e.read().decode()[:300]
                    except Exception: pass
                errs.append(msg); print(msg); continue
            for k, kk, v in chunk:
                t = str(res.get(f"{k}|{kk}", "")).strip()
                if t and all(p in t for p in [x for x in ("{n}", "{s}", "{e}", "{f}", "{c}", "{u}", "{t}") if x in v]):
                    out.setdefault(lg, {}).setdefault(k, {})[kk] = t
            json.dump(out, open(DST, "w"), ensure_ascii=False, indent=1)
            print(f"  {lg}: {min(i + 40, len(items))}/{len(items)}")
    if errs:
        open(ERR, "w").write("\n".join(errs) + "\n")
    elif os.path.exists(ERR):
        os.remove(ERR)


if __name__ == "__main__":
    main()
