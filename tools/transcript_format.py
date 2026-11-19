#!/usr/bin/env python3
"""Transkripte lesbar setzen (Absaetze + Zwischenueberschriften h3/h4), ohne den Text zu veraendern. Kern und Datenformat: transcript_fmt.py.

  python tools/transcript_format.py plan   [--langs en] [--limit N]               zaehlen, Kosten schaetzen (nichts wird gesendet/bezahlt)
  python tools/transcript_format.py submit [--langs en] [--limit N]               Haiku-Batch fuer neue/geaenderte Transkripte senden
  python tools/transcript_format.py collect [--wait SEK]                          fertige Batches einsammeln, pruefen, in data/transcript_fmt/<sprache>.json.gz speichern
  python tools/transcript_format.py run    [--langs en] [--limit N] [--wait SEK]  submit, dann collect (fuer den Zeitplan)

Die KI bekommt die Saetze nummeriert und liefert nur Zahlen (Absatzanfaenge) und kurze Ueberschriften; der Text selbst wird nie von ihr uebernommen
und kann daher nicht verfaelscht werden. Misslingt die Pruefung dreimal, wird der Eintrag ohne Ueberschriften mit gleichmaessigen Absaetzen gespeichert (Rueckfall).
Quellen: en = data/en_transcripts/<id>.txt (Seiten der Hauptshow). Weitere Quellen in SOURCES ergaenzen. Auf der Seite wirkt es erst mit data/transcript_fmt_live.json."""
import argparse, gzip, json, os, sys, time, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import transcript_fmt as TF  # noqa: E402
from ai_gateway import anthropic_request, check_budget, estimated_eur, remaining_eur, report_usage, thinking_off, urlopen  # noqa: E402

MODEL = os.environ.get("TRANSCRIPT_FMT_MODEL", "claude-haiku-5-5")
JOB = "transcript_format"
MAX_TRIES = 3
BATCH_MAX = 100          # grosse Anfragen (bis ~40.000 Tokens): kleine Teile
OUT_EST, OVERHEAD = 700, 500   # Token-Schaetzung je Anfrage (Ausgabe; Anweisung)
SOURCES = {"en": ("data/en_transcripts", ".txt")}

SYSTEM = """You format a podcast transcript for reading on a web page. You do NOT rewrite it. The transcript is given as numbered sentences, one per line: "<number>: <sentence>".
Return ONLY a JSON object: {"p": [..], "h": [[number, level, "heading"], ..]}
- "p": the numbers of the sentences that start a new paragraph (a paragraph is 3 to 8 sentences about one point; always include 0).
- "h": section headings. Each heading sits at the first sentence of a paragraph (that number must also be in "p"). Level 3 = main section, level 4 = sub-section inside it.
  Use 1 heading per ~25-40 sentences (at least 2 for long transcripts, none for very short ones). The first heading belongs to sentence 0.
- Heading text: 3 to 8 words, plain text, in the language of the transcript, describing what that section is about. No quotes, no markdown, no HTML, no numbering, no clickbait, nothing that is not in the text.
No explanation, no code fence."""


def src_items(lang, root=None):
    d, ext = SOURCES[lang]; base = Path(root or ROOT) / d
    for f in sorted(base.glob("*" + ext)):
        try: yield f.stem, f.read_text("utf-8")
        except OSError: continue


def idx_path(lang, root=None): return Path(root or ROOT) / "data" / "transcript_fmt" / f"{lang}.json.gz"
def state_path(root=None): return Path(root or ROOT) / "data" / "transcript_fmt_state.json"


def jload(p, default):
    return TF._jload(p, default)


def load_state(root=None): return jload(state_path(root), {"batches": [], "tries": {}})


def save_state(st, root=None):
    p = state_path(root); p.parent.mkdir(parents=True, exist_ok=True); p.write_text(json.dumps(st, ensure_ascii=False, indent=1, sort_keys=True), "utf-8")


def save_index(lang, idx, root=None):
    p = idx_path(lang, root); p.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(p, "wt", encoding="utf-8") as f: json.dump(idx, f, ensure_ascii=False, separators=(",", ":"), sort_keys=True)


def open_keys(st): return {v for b in st["batches"] for v in b["map"].values()}


def todo(lang, root=None, limit=None, st=None):
    """[(schluessel, text, pruefwert)] ohne gueltigen Eintrag und ohne offenen Batch; zu kurze Texte (< 12 Saetze) bekommen keine KI."""
    idx = jload(idx_path(lang, root), {}); st = st or load_state(root); busy = open_keys(st); out = []
    for key, text in src_items(lang, root):
        s = TF.sig(text)
        if ((idx.get(key) or {}).get("s") == s and (idx.get(key) or {}).get("v") == TF.PROMPT_V) or f"{lang}:{key}" in busy: continue
        if st["tries"].get(f"{lang}:{key}:{s}", 0) >= MAX_TRIES: continue
        out.append((key, text, s))
    return out[:limit] if limit else out


def numbered(text): return "\n".join(f"{i}: {s}" for i, s in enumerate(TF.sentences(text)))


def est_tokens(text): return int(len(text) / 3.6) + 6 * len(TF.sentences(text))   # Zeichen/3,6 + Nummern


def plan(langs, root=None, limit=None):
    rows = {l: todo(l, root, limit) for l in langs}
    tin = sum(est_tokens(t) + OVERHEAD for r in rows.values() for _, t, _ in r); n = sum(len(r) for r in rows.values())
    return {"n": n, "tokens_in": tin, "eur": round(estimated_eur(tin, n * OUT_EST, batch=True), 2), "by_lang": {l: len(r) for l, r in rows.items()}}


def _api(method, path, body=None):
    req = anthropic_request(path, body, job=JOB, lang="batch", model=MODEL, api_key=os.environ["ANTHROPIC_API_KEY"]); req.method = method
    try: return json.loads(urlopen(req, timeout=600).read())
    except urllib.error.HTTPError as e:
        try: d = e.read().decode("utf-8", "replace")[:400]
        except Exception: d = ""   # noqa: BLE001
        print(f"API-Fehler {e.code} {method} {path.split('?')[0][-50:]}: {d}", flush=True); raise


def _lines(url):
    rq = anthropic_request(url, headers={"x-api-key": os.environ["ANTHROPIC_API_KEY"]}, job=JOB, lang="batch", model=MODEL)
    return urlopen(rq, timeout=900).read().decode().splitlines()


def request(cid, text):
    return {"custom_id": cid, "params": {"model": MODEL, "max_tokens": 4500, **thinking_off(MODEL), "system": SYSTEM, "messages": [{"role": "user", "content": numbered(text)}]}}


def parse(txt):
    t = (txt or "").strip()
    if t.startswith("```"): t = t.strip("`").removeprefix("json").strip()
    a, b = t.find("{"), t.rfind("}")
    return json.loads(t[a:b + 1]) if a >= 0 and b > a else None


def make_entry(text, s, answer):
    """Antwort der KI pruefen und bereinigen -> Eintrag oder None (abgelehnt)."""
    n = len(TF.sentences(text))
    if not isinstance(answer, dict) or not isinstance(answer.get("p"), list) or not isinstance(answer.get("h", []), list): return None
    heads = TF.clean_heads(n, answer.get("h"), max_heads=max(2, n // 12))
    if n >= 40 and not heads: return None   # lange Transkripte brauchen Ueberschriften
    b = TF.repair(n, answer["p"], heads)
    if len(b) < max(1, n // (TF.MAX_PAR + 3)): return None
    return {"s": s, "v": TF.PROMPT_V, "b": b, "h": heads}


def fallback_entry(text, s):
    n = len(TF.sentences(text)); return {"s": s, "v": TF.PROMPT_V, "b": TF.repair(n, TF.plain_breaks(n), []), "h": []}


def submit(langs, root=None, limit=None, st=None):
    st = st or load_state(root); reqs, mapping = [], {}
    for l in langs:
        for key, text, s in todo(l, root, limit, st):
            cid = f"c{len(mapping):05d}"; reqs.append(request(cid, text)); mapping[cid] = f"{l}:{key}:{s}"
    if not reqs: print("submit: nichts zu tun"); return 0
    per = estimated_eur(2600 + OVERHEAD, OUT_EST, batch=True)
    for i in range(0, len(reqs), BATCH_MAX):
        part = reqs[i:i + BATCH_MAX]
        left = remaining_eur(JOB, MODEL)
        if left is not None:
            fit = int(left / max(per, 1e-9))
            if fit < len(part): print(f"Budget: Rest {left:.2f} EUR: nur {fit} von {len(part)} Anfragen"); part = part[:fit]
        if not part or not check_budget(JOB, MODEL, per * len(part)):
            print("Abbruch: kein Haiku-Budget (Rest folgt beim naechsten Lauf)"); break
        b = _api("POST", "/v1/messages/batches", {"requests": part})
        st["batches"].append({"id": b["id"], "map": {r["custom_id"]: mapping[r["custom_id"]] for r in part}, "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())})
        save_state(st, root); print(f"Batch {b['id']}: {len(part)} Anfragen")
    return len(reqs)


def apply_results(lines, b, st, root=None, texts=None):
    """Ergebnisse eines Batches uebernehmen. texts: {'lang:key': text} (Tests); sonst aus den Quellen gelesen."""
    done = bad = 0; cache = {}
    def idx_of(l):
        if l not in cache: cache[l] = jload(idx_path(l, root), {})
        return cache[l]
    srcs = texts if texts is not None else {f"{l}:{k}": t for l in {v.split(":")[0] for v in b["map"].values()} for k, t in src_items(l, root)}
    for line in lines:
        r = json.loads(line); cid = r.get("custom_id"); ref = b["map"].get(cid)
        if not ref: continue
        l, key, s = ref.split(":", 2); text = srcs.get(f"{l}:{key}")
        if text is None or TF.sig(text) != s: continue   # Quelle hat sich geaendert: nicht uebernehmen, beim naechsten Lauf neu
        res = r.get("result") or {}; entry = None
        if res.get("type") == "succeeded":
            m = res["message"]; ti, to, cr, cw = __import__("ai_gateway").usage_tokens(m.get("usage"))
            report_usage(JOB, MODEL, ti, to, lang=l, batch=True, cache_read=cr, cache_write=cw)
            try: entry = make_entry(text, s, parse("".join(c.get("text", "") for c in m.get("content", []) if c.get("type") == "text")))
            except ValueError: entry = None
        tk = f"{l}:{key}:{s}"
        if entry: idx_of(l)[key] = entry; done += 1
        else:
            st["tries"][tk] = st["tries"].get(tk, 0) + 1; bad += 1
            if st["tries"][tk] >= MAX_TRIES: idx_of(l)[key] = fallback_entry(text, s)   # Rueckfall: nur Absaetze
    for l, idx in cache.items(): save_index(l, idx, root)
    return done, bad


def collect(wait_s=0, root=None, sleep=time.sleep):
    st = load_state(root); t0 = time.time(); total = [0, 0]
    while True:
        left = []
        for b in st["batches"]:
            info = _api("GET", f"/v1/messages/batches/{b['id']}")
            if info.get("processing_status") == "ended" and info.get("results_url"):
                d, bad = apply_results(_lines(info["results_url"]), b, st, root); total[0] += d; total[1] += bad
                print(f"Batch {b['id']}: {d} ok, {bad} abgelehnt")
            else: left.append(b)
        st["batches"] = left; save_state(st, root)
        if not left or time.time() - t0 >= wait_s: break
        print(f"noch {len(left)} Batch(es) offen, warte ...", flush=True); sleep(60)
    return total


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0]); ap.add_argument("mode", choices=["plan", "submit", "collect", "run"])
    ap.add_argument("--langs", default="en"); ap.add_argument("--limit", type=int, default=None); ap.add_argument("--wait", type=int, default=0)
    a = ap.parse_args(argv); langs = [x for x in a.langs.split(",") if x in SOURCES]
    if a.mode == "plan":
        p = plan(langs, limit=a.limit); print(f"plan: {p['n']} Transkripte {p['by_lang']}, ca. {p['tokens_in']/1e6:.1f} Mio. Token Eingabe, ca. {p['eur']:.2f} EUR (Batch)"); return 0
    if not os.environ.get("ANTHROPIC_API_KEY"): print("ANTHROPIC_API_KEY fehlt"); return 2
    if a.mode in ("submit", "run"): submit(langs, limit=a.limit)
    if a.mode in ("collect", "run"): collect(a.wait)
    return 0


if __name__ == "__main__":
    sys.exit(main())
