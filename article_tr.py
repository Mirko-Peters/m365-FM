#!/usr/bin/env python3
"""Haiku-Uebersetzung der englischen Video-Artikel (data/articles/<VIDEO>.json) in die 14 Zielsprachen (Mirko, 9.11.2026, "Weg B").
Sonnet schreibt nur die englische Fassung (generate_articles.py); hier uebersetzt Haiku sie EINMAL im Message Batch (50 % Rabatt).
Wiederverwendet aus translate_blog.py: Segmentierung (HTML-Struktur bleibt), System-Prompt/Sprachprofile, QA (Tags, Links, Schrift, Namen/KEEP),
Marker-Parser, Preise. Vorhandene Sprachfassungen werden nie angefasst. Ausgaben werden getrennt als "articles_tr" in data/spend.json gezaehlt.
Zwischenstand (laufende Batches, Teilsegmente, Versuche): data/articles_tr_state.json."""
import copy, hashlib, json, os, re, time, urllib.error
from datetime import datetime, timezone
from pathlib import Path

import translate_blog as TB
from ai_gateway import anthropic_request, check_budget, report_usage, urlopen

ROOT = Path(__file__).parent
STATE = "articles_tr_state.json"
LANGS = TB.LANGS
MODEL = TB.MODEL
TR_BUDGET = float(os.environ.get("ARTICLE_TR_BUDGET_USD") or 60)   # Haiku-Uebersetzungen je Kalendermonat (UTC), getrennt vom Sonnet-Deckel ARTICLE_BUDGET_USD
TR_LIMIT = int(os.environ.get("ARTICLE_TR_LIMIT") or 0)            # Sprachfassungen je Lauf (0 = nur das Budget begrenzt)
MAX_TRIES = TB.MAX_TRIES
SKIP_KEYS = {"typ", "art"}                                          # Typkennungen der Infografiken bleiben
ART_KEYS = ("info", "infos", "faq", "quiz")


# ---------- Quelle: Hash, Einheiten, Zusammensetzen ----------
def en_hash(a):
    """Hash der englischen Quelle (HTML + Infografiken + FAQ + Quiz)."""
    return hashlib.sha1(json.dumps({k: a.get(k) for k in ("html",) + ART_KEYS}, ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:16]


def _leaves(o, path=()):
    if isinstance(o, str):
        if re.search(r"[^\W\d_]", o):
            yield path, o
    elif isinstance(o, dict):
        for k, v in o.items():
            if k not in SKIP_KEYS:
                yield from _leaves(v, path + (k,))
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from _leaves(v, path + (i,))


def units_of(a):
    """(Vorlage, Einheiten [(id, text)], Pfade {id: Pfad in info/infos/faq/quiz}). IDs sind fortlaufende Zahlen (passend zu TB.parse)."""
    tpl, segs = TB.segment(a["html"])
    units = [(str(i), s) for i, s in enumerate(segs, 1)]
    paths = {}
    for k in ART_KEYS:
        for p, t in _leaves(a.get(k), (k,)):
            i = str(len(units) + 1)
            units.append((i, t.strip())); paths[i] = p
    return tpl, units, paths


def _set(o, path, val):
    for k in path[:-1]:
        o = o[k]
    o[path[-1]] = val


def build(a, seg):
    """Uebersetzte Fassung aus dem englischen Artikel a und {id: Text}: Tags der Vorlage bleiben, nur Texte werden ersetzt."""
    from generate_articles import clean
    tpl, units, paths = units_of(a)
    out = {k: copy.deepcopy(a[k]) for k in ART_KEYS if a.get(k)}
    for i, p in paths.items():
        _set(out, p, seg[i])
    out["html"] = clean(re.sub("\x00(\\d+)\x00", lambda m: seg.get(m.group(1), ""), tpl))
    return out


# ---------- Zustand ----------
def load_state():
    f = ROOT / "data" / STATE
    s = json.loads(f.read_text("utf-8")) if f.exists() else {}
    s.setdefault("batches", []); s.setdefault("partial", {}); s.setdefault("failed", {})
    return s


def save_state(s):
    f = ROOT / "data" / STATE
    if not (s["batches"] or s["partial"] or s["failed"]):
        f.unlink(missing_ok=True); return
    f.write_text(json.dumps(s, ensure_ascii=False, indent=1), encoding="utf-8")


def pk(lang, vid): return f"{lang}|{vid}"


def month(): return time.strftime("%Y-%m", time.gmtime())


def spend_load():
    f = ROOT / "data" / "spend.json"
    try:
        return json.loads(f.read_text("utf-8")) if f.exists() else {}
    except Exception:
        return {}


def spent_month(sd=None):
    return float(((sd if sd is not None else spend_load()).get(month()) or {}).get("articles_tr", {}).get("usd", 0))


def add_spend(tin, tout, calls):
    """Haiku-Uebersetzungskosten (Batch-Preis) getrennt von den Sonnet-Feldern unter dem Monatsschluessel in data/spend.json."""
    sd = spend_load(); m = sd.setdefault(month(), {"input_tokens": 0, "output_tokens": 0, "calls": 0})
    t = m.setdefault("articles_tr", {"usd": 0.0, "input_tokens": 0, "output_tokens": 0, "calls": 0})
    t["input_tokens"] += tin; t["output_tokens"] += tout; t["calls"] += calls
    t["usd"] = round(t["usd"] + TB.cost(tin, tout), 4)
    (ROOT / "data" / "spend.json").write_text(json.dumps(sd, indent=1), encoding="utf-8")
    return t["usd"]


def pending_cost(s): return sum(b.get("est_usd", 0) for b in s["batches"])


# ---------- Auswahl und Schaetzung ----------
def todo(store, vids, langs=LANGS):
    """[(vid, lang)]: Video hat eine englische Fassung, die Sprache fehlt noch (vorhandene bleiben unberuehrt)."""
    return [(v, l) for v in vids for l in langs if (store.get(v) or {}).get("en", {}).get("html") and l not in store[v]]


def est_usd(lang, units):
    return TB.cost(*TB.est(lang, units))


def mark_stale(store):
    """Uebersetzungen (src haiku-tr), deren Quell-Hash nicht mehr zur englischen Fassung passt, werden nur markiert (stale), nie neu uebersetzt."""
    n = 0
    for v, d in store.items():
        en = d.get("en")
        if not en:
            continue
        h = en_hash(en)
        for l, a in d.items():
            if l != "en" and a.get("src") == "haiku-tr":
                stale = a.get("h") != h
                if stale != bool(a.get("stale")):
                    n += 1
                    if stale: a["stale"] = True
                    else: a.pop("stale", None)
    return n


# ---------- API ----------
def _api(method, path, body=None, raw=False):
    req = anthropic_request(path, body, job="generate_articles", lang="batch", model=MODEL, api_key=os.environ["ANTHROPIC_API_KEY"])
    req.method = method
    try:
        r = urlopen(req, timeout=900).read()
        return r if raw else json.loads(r)
    except urllib.error.HTTPError as e:
        print(f"API-Fehler {e.code} {method} {path}: {e.read()[:300]!r}"); raise


def submit(store, vids, s, langs=LANGS, limit=0):
    """Offene Uebersetzungen als Batch absenden, solange das Haiku-Budget (TR_BUDGET) reicht. Gibt die Anzahl Anfragen zurueck."""
    busy = {(b2["lang"], b2["vid"]) for b in s["batches"] for b2 in b["items"]}
    room = TR_BUDGET - spent_month() - pending_cost(s)
    reqs, items, money, n = [], [], 0.0, 0
    for v, l in todo(store, vids, langs):
        if (l, v) in busy or s["failed"].get(pk(l, v)): continue
        en = store[v]["en"]; tpl, units, _ = units_of(en); h = en_hash(en)
        rec = s["partial"].get(pk(l, v))
        if not rec or rec["h"] != h: rec = {"h": h, "seg": {}, "tries": 0}
        if rec["tries"] >= MAX_TRIES:
            s["failed"][pk(l, v)] = "qa"; s["partial"].pop(pk(l, v), None); continue
        if limit and n >= limit: break
        cs = TB.chunks(units, rec["seg"])
        c_usd = est_usd(l, [u for c in cs for u in c])
        if money + c_usd > room:
            print(f"Budget articles_tr erreicht ({TR_BUDGET:.2f} $; diesen Monat {spent_month():.2f} $, offen {pending_cost(s):.2f} $) - Rest bleibt offen"); break
        money += c_usd; n += 1; s["partial"][pk(l, v)] = rec
        for ci, c in enumerate(cs):
            reqs.append({"custom_id": f"{l}_{TB.key(v)}_{ci}", "params": {"model": MODEL, "max_tokens": TB.MAX_TOK,
                         "system": [{"type": "text", "text": TB.system_prompt(l), "cache_control": {"type": "ephemeral"}}],
                         "messages": [{"role": "user", "content": TB.user_prompt(l, c)}]}})
        items.append({"lang": l, "vid": v, "h": h})
    if not reqs:
        print("Nichts abzusenden."); return 0
    if not check_budget("generate_articles", MODEL, money / max(0.000001, float(os.environ.get("USD_PER_EUR", "1.08")))):
        for it in items:
            if not s["partial"][pk(it["lang"], it["vid"])]["seg"]: s["partial"].pop(pk(it["lang"], it["vid"]), None)
        return 0
    for i in range(0, len(reqs), TB.PER_BATCH):
        part = reqs[i:i + TB.PER_BATCH]
        ids = {r["custom_id"].rsplit("_", 1)[0] for r in part}
        its = [it for it in items if f"{it['lang']}_{TB.key(it['vid'])}" in ids]
        b = _api("POST", "/v1/messages/batches", {"requests": part})
        s["batches"].append({"id": b["id"], "n": len(part), "model": MODEL, "created": datetime.now(timezone.utc).isoformat()[:19],
                             "est_usd": round(money * len(part) / len(reqs), 3), "items": its})
        save_state(s); print("Batch", b["id"], len(part), "Anfragen, geschaetzt", round(money * len(part) / len(reqs), 2), "$")
    return len(reqs)


def ingest(store, s, lang, vid, h, got):
    """Segmente einer Antwort pruefen (TB.qa) und in den Zwischenstand legen; Rueckgabe (ok, schlecht, Gruende)."""
    en = store[vid]["en"]; tpl, units, _ = units_of(en); src = dict(units)
    rec = s["partial"].get(pk(lang, vid))
    if not rec or rec["h"] != h: rec = s["partial"][pk(lang, vid)] = {"h": h, "seg": {}, "tries": 0}
    ok = bad = 0; why = {}
    for i, t in got.items():
        if i not in src: continue
        good, reason, _w = TB.qa(lang, src[i], t)
        if good: rec["seg"][i] = t; ok += 1
        else: bad += 1; why[reason] = why.get(reason, 0) + 1
    return ok, bad, why


def finish(store, s, lang, vid):
    """Vollstaendige Uebersetzung speichern (nie eine vorhandene Fassung ersetzen), sonst Versuch zaehlen."""
    rec = s["partial"].get(pk(lang, vid))
    if not rec: return False
    en = store[vid].get("en"); tpl, units, _ = units_of(en)
    if rec["h"] == en_hash(en) and all(i in rec["seg"] for i, _t in units):
        if lang not in store[vid]:
            res = build(en, rec["seg"]); res.update({"model": MODEL, "src": "haiku-tr", "h": rec["h"], "ts": datetime.now(timezone.utc).strftime("%Y-%m-%d")})
            store[vid][lang] = res
        s["partial"].pop(pk(lang, vid), None); return True
    rec["tries"] += 1
    if rec["tries"] >= MAX_TRIES:
        s["failed"][pk(lang, vid)] = "qa"; s["partial"].pop(pk(lang, vid), None)
    return False


def collect(store, s, save=None):
    """Fertige Batches abholen. save(vid) schreibt data/articles/<vid>.json. Rueckgabe: Anzahl noch laufender Batches."""
    left = []
    for b in s["batches"]:
        st = _api("GET", f"/v1/messages/batches/{b['id']}")
        if st["processing_status"] != "ended":
            print(b["id"], st["processing_status"], st["request_counts"]); left.append(b); continue
        info = {(it["lang"], TB.key(it["vid"])): it for it in b["items"]}
        tin = tout = ok = bad = 0; why = {}; seen = set(); calls = 0
        for line in _api("GET", st["results_url"], raw=True).decode().splitlines():
            r = json.loads(line); lang, k, _ = r["custom_id"].split("_"); it = info.get((lang, k))
            if not it: continue
            res = r["result"]
            if res["type"] != "succeeded": bad += 1; why[res["type"]] = why.get(res["type"], 0) + 1; seen.add((lang, it["vid"])); continue
            msg = res["message"]; u = msg["usage"]; calls += 1
            tin += u["input_tokens"] + u.get("cache_read_input_tokens", 0) + u.get("cache_creation_input_tokens", 0); tout += u["output_tokens"]
            text = "".join(c.get("text", "") for c in msg["content"] if c.get("type") == "text")
            seen.add((lang, it["vid"]))
            if TB.bad_text(text): bad += 1; why["encoding"] = why.get("encoding", 0) + 1; continue
            got = TB.parse(text)
            if msg.get("stop_reason") == "max_tokens" and got: got.pop(list(got)[-1])
            if it["vid"] not in store or not store[it["vid"]].get("en"): continue
            o, bd, w = ingest(store, s, lang, it["vid"], it["h"], got); ok += o; bad += bd
            for kk, vv in w.items(): why[kk] = why.get(kk, 0) + vv
        done = 0
        for lang, vid in sorted(seen):
            if vid in store and store[vid].get("en") and finish(store, s, lang, vid):
                done += 1
                if save: save(vid)
        usd = add_spend(tin, tout, calls)
        report_usage("generate_articles", b["model"], tin, tout, "batch", batch=True)
        print(f"{b['id']}: {done} Sprachfassungen fertig, {ok} Segmente ok, {bad} fehlgeschlagen {why}, Haiku-Kosten Monat {usd:.2f} $")
    s["batches"] = left
    save_state(s)
    return len(left)


def run(store, vids, save, langs=LANGS, wait_min=None):
    """collect -> submit -> warten -> collect, bis alles fertig ist oder MAX_TRIES Runden verbraucht sind."""
    s = load_state(); wait = (wait_min if wait_min is not None else int(os.environ.get("WAIT_MIN", "200"))) * 60; t0 = time.time()
    collect(store, s, save)
    for _round in range(MAX_TRIES):
        if not submit(store, vids, s, langs, TR_LIMIT): break
        while s["batches"] and time.time() - t0 < wait:
            time.sleep(120)
            if collect(store, s, save) == 0: break
        if s["batches"]: break
    save_state(s)
    return s
