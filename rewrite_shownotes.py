#!/usr/bin/env python3
"""Schreibt die englischen Show Notes aller Folgen einmal neu (SEO-freundlich, Claude Sonnet, Message Batches API = halber Preis) und danach woechentlich
nur fuer neue oder geaenderte Folgen. Ergebnis: data/shownotes_en/<bucket>.json.gz (site_shownotes_seo.py), Kosten in data/spend.json unter "shownotes".
Eingabe je Folge: Titel, bisherige Notes, Transkript-Auszug (ca. 5.000 Token: Anfang/Mitte/Ende), passende Entitaeten; Ausgabe: JSON.
Aufruf: python rewrite_shownotes.py [--limit N] [--collect-only] [--no-wait]. Umgebung: ANTHROPIC_API_KEY, SHOWNOTES_MODEL, SHOWNOTES_BUDGET_USD (Standard 30),
SHOWNOTES_LIMIT, SHOWNOTES_WAIT_S (Standard 18000). Fehlversuche werden in data/shownotes_en/_tries.json gezaehlt (3 je Eingabe-Hash)."""
import argparse, hashlib, json, os, re, sys, time, time as _t
from pathlib import Path

import site_podpage as P
import site_shownotes_seo as S
from ai_gateway import anthropic_request, urlopen
from generate_articles import cost_usd

ROOT = Path(__file__).resolve().parent
MODEL = os.environ.get("SHOWNOTES_MODEL") or "claude-sonnet-5-5"
BUDGET_USD = float(os.environ.get("SHOWNOTES_BUDGET_USD") or 30)
VERSION = 1                  # bei Aenderung des Prompts erhoehen: dann werden alle Folgen neu geschrieben
MAX_TRIES = 3
TR_TOKENS = 5000             # Obergrenze des Transkript-Auszugs
CHARS_PER_TOKEN = 4
NOTES_CHARS = 6000
OUT_TOKENS = 1500            # max_tokens je Anfrage und Schaetzwert der Ausgabe
MAX_ENTS = 15
KEEP = ["Microsoft 365", "Microsoft Copilot", "Copilot Studio", "Power BI", "Power Apps", "Power Automate", "Power Platform", "Power Pages", "SharePoint", "OneDrive", "Microsoft Teams",
        "Microsoft Fabric", "Entra ID", "Microsoft Entra", "Microsoft Intune", "Microsoft Defender", "Microsoft Purview", "Dataverse", "Azure", "Exchange Online", "GitHub Copilot",
        "Azure OpenAI", "Windows 365", "Azure Virtual Desktop", "Viva Engage", "OneNote", "Outlook", "Excel", "PowerShell", "Dynamics 365", "Nerdio", "SAP"]   # Produktnamen, die nie veraendert werden

SYSTEM = """You write SEO-friendly show notes for one episode of the M365.FM podcast about Microsoft 365, Azure and related technology. Rewrite from the inputs you are given.
House rules:
- Plain, factual English. No hype, no marketing words, no exclamation marks.
- Use only what the inputs support. Never invent facts, numbers, quotes, names, dates or promises. If a passage looks garbled (speech recognition error), stay neutral or leave it out.
- Product names are never altered or abbreviated differently: write Microsoft 365, Copilot, Power BI, SharePoint, Entra ID etc. exactly as given in the inputs.
- No URLs, no domain names, no HTML or Markdown. Plain text only; links are added later by code.
- Do not refer to "the transcript", "the podcast", "the host" or "the episode"; write as a standalone summary of the topic. No mention of AI.
Output ONLY one JSON object, no code fence, with these fields:
{"meta": "one sentence, at most 160 characters, search-result description with the main keyword near the start",
 "summary": "2-3 sentences (200-600 characters) intro for readers: the problem, who it helps, what they learn",
 "key_points": ["4 to 7 concrete takeaways, each one sentence, max 220 characters"],
 "chapters": [{"t": "mm:ss exactly as shown in a [mm:ss] marker of the excerpt", "title": "max 80 characters"}],
 "entities": ["ids from the given entity list that are actually discussed, not just mentioned in passing"],
 "faq": [{"q": "question a searcher would ask, max 140 characters", "a": "answer grounded in the excerpt, 1-3 sentences, max 450 characters"}]}
"chapters": only if the excerpt contains [mm:ss] markers (3 to 8 chapters in ascending order); otherwise use an empty list. "faq": 2 or 3 items."""

URL_RX = re.compile(r"https?://|\bwww\.|\b[a-z0-9-]+\.(?:com|org|net|io|fm|ai|dev|de|co|ly|gl)\b|<[a-z/][^>]*>", re.I)
TS_LINE = re.compile(r"^\s*\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?\s+\S", re.M)


# ------------------------------------------------------------------ Eingaben
def _mmss(sec):
    sec = int(sec); h, r = divmod(sec, 3600); m, s = divmod(r, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def timed_text(raw):
    """Transkript mit Zeitmarken -> Text mit [mm:ss]-Zeilen (rund alle 45 s); ohne Zeitmarken None (dann keine Kapitel)."""
    if not raw:
        return None
    if "-->" in raw:   # VTT
        out, last = [], -999
        for blk in re.split(r"\n\s*\n", raw):
            m = re.search(r"(?:(\d+):)?(\d{1,2}):(\d{2})[.,]\d{1,3}\s*-->", blk)
            if not m:
                continue
            t = int(m.group(1) or 0) * 3600 + int(m.group(2)) * 60 + int(m.group(3))
            txt = " ".join(l.strip() for l in blk.splitlines() if "-->" not in l and l.strip() and not l.strip().isdigit() and l.strip() != "WEBVTT")
            if not txt:
                continue
            if t - last >= 45 or not out:
                out.append(f"[{_mmss(t)}] {txt}"); last = t
            else:
                out[-1] += " " + txt
        return "\n".join(out) if len(out) >= 3 else None
    return raw if len(TS_LINE.findall(raw)) >= 5 else None


def excerpt(text, cap_tokens=TR_TOKENS):
    """Hoechstens cap_tokens (ca. 4 Zeichen je Token): ist das Transkript laenger, je ein Drittel aus Anfang, Mitte und Ende."""
    text = (text or "").strip()
    cap = cap_tokens * CHARS_PER_TOKEN
    if len(text) <= cap:
        return text
    n = cap // 3; mid = len(text) // 2
    return text[:n].rstrip() + "\n[...]\n" + text[mid - n // 2: mid + n // 2].strip() + "\n[...]\n" + text[-n:].lstrip()


_ENT_IX = {}


def _entity_index(ents):
    key = id(ents)
    if key not in _ENT_IX:
        ix = {}
        for e in ents:
            if e.get("type") == "category" or not e.get("name"):
                continue
            for nm in [e["name"]] + list(e.get("aliases") or []):
                if len(nm) >= 3 and len(nm.split()) <= 4:
                    ix.setdefault(nm.lower(), []).append((nm, e))
        _ENT_IX[key] = ix
    return _ENT_IX[key]


def candidates(title, notes, transcript, ents, extracted=()):
    """Passende Entitaeten (id, name) fuer die Folge: zuerst die QA-gepruefte Extraktion (shownotes/entities), dann Namenstreffer (Titel zaehlt 5x, Transkript je Treffer 1x,
    Einzelwoerter nur in genau dieser Schreibweise). Mindestens 2 Treffer oder Titel; hoechstens MAX_ENTS."""
    ix = _entity_index(ents); score = {}; byid = {}
    for src, w in ((title, 5), (notes, 1), (transcript, 1)):
        toks = re.findall(r"[A-Za-z0-9][A-Za-z0-9+#'-]*", src or "")
        for i in range(len(toks)):
            for n in (1, 2, 3, 4):
                if i + n > len(toks):
                    break
                ph = " ".join(toks[i:i + n])
                for nm, e in ix.get(ph.lower(), ()):
                    if n == 1 and ph != nm:
                        continue
                    score[e["id"]] = score.get(e["id"], 0) + w; byid[e["id"]] = e
    res = [(sc, i) for i, sc in score.items() if sc >= 2]
    res.sort(key=lambda x: (-x[0], x[1]))
    out = [dict(x) for x in extracted]
    seen = {x["id"] for x in out}
    for _, i in res:
        if i not in seen and len(out) < MAX_ENTS:
            out.append({"id": i, "name": byid[i]["name"]}); seen.add(i)
    return out[:MAX_ENTS]


def build_input(ep):
    """ep: {slug, title, notes, transcript, entities} -> (user_text, timed_flag). Das Transkript wird auf TR_TOKENS gekuerzt."""
    tt = timed_text(ep.get("transcript_raw") or "")
    tx = excerpt(tt if tt else ep.get("transcript") or "")
    parts = [f"Title: {ep['title']}", "Existing show notes (may be thin or promotional):\n" + (ep.get("notes") or "")[:NOTES_CHARS],
             "Entity list (id: name):\n" + "\n".join(f"{x['id']}: {x['name']}" for x in ep.get("entities") or []) if ep.get("entities") else "Entity list: (none)",
             ("Transcript excerpt (with [mm:ss] markers):\n" if tt else "Transcript excerpt (no timestamps, so no chapters):\n") + tx]
    return "\n\n".join(parts), bool(tt)


def source_hash(ep):
    user, _ = build_input(ep)
    return hashlib.sha256(json.dumps([VERSION, SYSTEM, user], ensure_ascii=False).encode("utf-8")).hexdigest()[:16]


# ------------------------------------------------------------------ Pruefung
def _strings(n):
    yield n.get("meta", ""); yield n.get("summary", "")
    yield from n.get("key_points", [])
    for c in n.get("chapters", []): yield c["title"]
    for x in n.get("faq", []): yield x["q"]; yield x["a"]


def validate(obj, ep, timed=None):
    """-> (notes | None, fehler[]). Streng: ungueltiges JSON, URLs/HTML, Laengen, veraenderte Produktnamen. Unbekannte Entitaets-ids und Kapitel ohne Zeitmarken werden verworfen."""
    err = []
    if isinstance(obj, str):
        t = obj.strip()
        t = re.sub(r"^```[a-z]*\s*|\s*```$", "", t)
        try:
            obj = json.loads(t[t.index("{"): t.rindex("}") + 1])
        except Exception:
            return None, ["kein gueltiges JSON"]
    if not isinstance(obj, dict):
        return None, ["kein JSON-Objekt"]
    s = lambda k: obj.get(k).strip() if isinstance(obj.get(k), str) else ""
    n = {"meta": s("meta"), "summary": s("summary")}
    if not n["meta"] or len(n["meta"]) > 160: err.append(f"meta Laenge {len(n['meta'])}")
    if not (120 <= len(n["summary"]) <= 700): err.append(f"summary Laenge {len(n['summary'])}")
    kp = obj.get("key_points")
    kp = [x.strip() for x in kp if isinstance(x, str) and x.strip()] if isinstance(kp, list) else []
    if not 4 <= len(kp) <= 7 or any(len(x) > 260 for x in kp): err.append("key_points: 4-7 Punkte, je hoechstens 260 Zeichen")
    n["key_points"] = kp
    faq = obj.get("faq"); fl = []
    for x in faq if isinstance(faq, list) else []:
        if isinstance(x, dict) and isinstance(x.get("q"), str) and isinstance(x.get("a"), str) and x["q"].strip() and x["a"].strip():
            fl.append({"q": x["q"].strip(), "a": x["a"].strip()})
    if not 2 <= len(fl) <= 3 or any(len(x["q"]) > 160 or len(x["a"]) > 520 for x in fl): err.append("faq: 2-3 Fragen, Laengen")
    n["faq"] = fl
    ch = []
    markers = set(re.findall(r"\[(\d{1,2}:\d{2}(?::\d{2})?)\]", build_input(ep)[0])) if timed is None else timed
    if markers:   # Kapitel nur mit Zeitmarken im Auszug
        for c in obj.get("chapters") if isinstance(obj.get("chapters"), list) else []:
            if isinstance(c, dict) and isinstance(c.get("t"), str) and isinstance(c.get("title"), str) and c["t"] in markers and c["title"].strip():
                ch.append({"t": c["t"], "title": c["title"].strip()[:90]})
        secs = lambda t: sum(int(p) * 60 ** i for i, p in enumerate(reversed(t.split(":"))))
        ch = sorted({c["t"]: c for c in ch}.values(), key=lambda c: secs(c["t"]))
        if len(ch) < 3: ch = []
    if ch: n["chapters"] = ch[:8]
    ids = {x["id"] for x in ep.get("entities") or []}
    n["entities"] = [i for i in dict.fromkeys(obj.get("entities") if isinstance(obj.get("entities"), list) else []) if isinstance(i, str) and i in ids]
    text = "\n".join(_strings({**n, "chapters": n.get("chapters", [])}))
    if URL_RX.search(text): err.append("URL, Domain oder HTML im Text")
    if re.search(r"\b(transcript|podcast|the host|this episode|as an ai)\b", text, re.I): err.append("Meta-Verweis")
    err += keep_errors(text, ep)
    return (None if err else n), err


def _proper(nm):
    """Eigenname (Produkt): jedes Wort beginnt gross oder der Name hat einen Binnenversal (SharePoint); allgemeine Begriffe wie "data gateway" nicht."""
    return bool(re.search(r"[a-z][A-Z]", nm)) or all(w[:1].isupper() or w[:1].isdigit() for w in nm.split())


def _keep_names(ep):
    names = set(KEEP)
    for x in ep.get("entities") or []:
        if _proper(x["name"]):
            names.add(x["name"])
    return [n for n in names if len(n) >= 3]


def keep_errors(text, ep):
    """Produktnamen (KEEP + Entitaetsnamen): kommt der Name des Titels im Text vor, muss er mindestens einmal woertlich stehen; abweichende Schreibweisen
    (Leerzeichen/Bindestrich, falsche Gross-/Kleinschreibung bei Namen mit Leerzeichen oder Binnenversal) sind Fehler."""
    err = []; title = ep.get("title") or ""
    for nm in _keep_names(ep):
        multi = " " in nm or bool(re.search(r"[a-z][A-Z]", nm))
        if multi:
            for m in re.finditer(re.escape(nm), text, re.I):
                if m.group(0) != nm:
                    err.append(f"Name veraendert: {m.group(0)!r} statt {nm!r}"); break
            if " " in nm:
                for alt in (nm.replace(" ", ""), nm.replace(" ", "-")):
                    if re.search(r"(?<![\w-])" + re.escape(alt) + r"(?![\w-])", text, re.I):
                        err.append(f"Name veraendert: {alt!r} statt {nm!r}"); break
    for nm in _keep_names(ep):
        if re.search(r"(?<![\w-])" + re.escape(nm) + r"(?![\w-])", title) and nm not in text and len(nm) >= 4:
            if nm in ("Excel", "Outlook", "Azure", "SAP"):
                continue
            err.append(f"Name fehlt: {nm!r} (steht im Titel)")
    return err


# ------------------------------------------------------------------ Speicher, Auswahl, Kosten
def tries_path(d=None): return (d or S.DIR) / "_tries.json"


def load_tries(d=None):
    try: return json.loads(tries_path(d).read_text("utf-8"))
    except Exception: return {}


def pending(eps, store, tries):
    """Folgen, die geschrieben werden muessen: kein Eintrag, Quelle oder Prompt-Version geaendert; weniger als MAX_TRIES Fehlversuche fuer diesen Hash."""
    out = []
    for ep in eps:
        h = source_hash(ep); rec = store.get(ep["slug"])
        if rec and rec.get("h_src") == h and rec.get("v") == VERSION and rec.get("notes"):
            continue
        t = tries.get(ep["slug"]) or {}
        if t.get("h") == h and t.get("n", 0) >= MAX_TRIES:
            continue
        out.append((ep, h))
    return out


def estimate_usd(ep):
    user, _ = build_input(ep)
    tin = (len(SYSTEM) + len(user)) / 3.6
    return cost_usd(tin, OUT_TOKENS * 0.6, 0, 0, MODEL) * 0.5   # Batch: halber Preis


def month_key(): return _t.strftime("%Y-%m", _t.gmtime())


def spent_usd(sd, month=None):
    return float((((sd or {}).get("shownotes") or {}).get(month or month_key()) or {}).get("usd", 0))


def select_within_budget(items, spent, budget, limit=0):
    """Nimmt Folgen der Reihe nach, bis die geschaetzten Kosten die Monatsgrenze erreichen (oder limit)."""
    out, total = [], spent
    for ep, h in items:
        c = estimate_usd(ep)
        if total + c > budget or (limit and len(out) >= limit):
            break
        out.append((ep, h)); total += c
    return out


def add_spend(sd, usd, tin, tout, calls, month=None):
    m = sd.setdefault("shownotes", {}).setdefault(month or month_key(), {"usd": 0, "input_tokens": 0, "output_tokens": 0, "calls": 0})
    m["usd"] = round(m["usd"] + usd, 4); m["input_tokens"] += tin; m["output_tokens"] += tout; m["calls"] += calls
    m.setdefault("models", {})[MODEL] = m.get("models", {}).get(MODEL, 0) + calls
    return sd


# ------------------------------------------------------------------ Episoden einlesen
def load_episodes(root=ROOT):
    D = root / "data"
    eps = [e for e in P.load("episodes") if e.get("published") not in (False, "False") and e.get("hidden") not in (True, "True")]
    eps.sort(key=lambda e: e["create_time"], reverse=True)
    enx = json.loads((D / "en_episodes.json").read_text("utf-8")) if (D / "en_episodes.json").exists() else {}
    by_id = {str(v["spreaker_id"]): v for v in enx.values() if v.get("spreaker_id")}
    ents = [x for x in json.loads((D / "entities.json").read_text("utf-8"))]
    out = []
    for e in eps:
        r = by_id.get(str(e.get("spreaker_id"))) if e.get("spreaker_id") else enx.get(P.norm(e["name"]))
        sid = str((r or {}).get("spreaker_id") or "")
        raw = ""
        if sid and (root / "transcripts" / "podcast" / f"{sid}.vtt").exists():
            raw = (root / "transcripts" / "podcast" / f"{sid}.vtt").read_text("utf-8")
        elif r and r.get("transcript") and (D / "en_transcripts" / f"{r['transcript']}.txt").exists():
            raw = (D / "en_transcripts" / f"{r['transcript']}.txt").read_text("utf-8")
        notes = P.plain(e.get("show_notes"))
        if not notes:
            try: notes = P.plain(json.loads((D / "show_notes" / "en.json").read_text("utf-8")).get(sid, {}).get("markup", ""))
            except Exception: notes = ""
        plain_tx = re.sub(r"\[?\d{1,2}:\d{2}(?::\d{2})?\]?\s*", "", raw) if timed_text(raw) else raw
        extracted = []
        xf = root / "shownotes" / "entities" / f"{sid}.json"
        if sid and xf.exists():
            try: extracted = [{"id": x["slug"], "name": x["name"]} for x in json.loads(xf.read_text("utf-8")).get("entities", []) if x.get("score", 0) >= 40][:MAX_ENTS]
            except Exception: extracted = []
        if not raw and not notes:
            continue
        out.append({"slug": e["slug"], "title": e["name"], "notes": notes, "transcript": plain_tx, "transcript_raw": raw,
                    "entities": candidates(e["name"], notes, plain_tx, ents, extracted)})
    return out


# ------------------------------------------------------------------ Batch
def api(method, path, body=None):
    req = anthropic_request(path, body, job="rewrite_shownotes", lang="batch", model=MODEL, api_key=os.environ["ANTHROPIC_API_KEY"])
    req.method = method
    return json.loads(urlopen(req, timeout=300).read())


def request_for(ep, cid):
    user, _ = build_input(ep)
    return {"custom_id": cid, "params": {"model": MODEL, "max_tokens": OUT_TOKENS, "thinking": {"type": "disabled"},
            "system": [{"type": "text", "text": SYSTEM, "cache_control": {"type": "ephemeral"}}], "messages": [{"role": "user", "content": user}]}}


def text_of(msg):
    return "".join(c.get("text", "") for c in msg.get("content") or [] if c.get("type") == "text")


def apply_results(lines, mapping, eps_by_slug, store, tries, now=None):
    """Wertet Batch-Ergebnisse (JSONL-Zeilen) aus: gueltige Notes -> store, Fehler -> tries. -> (ok, failed, tin, tout)."""
    ok = bad = tin = tout = 0; now = now or _t.strftime("%Y-%m-%dT%H:%M:%SZ", _t.gmtime())
    for line in lines:
        r = json.loads(line); slug, h = mapping.get(r["custom_id"], (None, None))
        if not slug:
            continue
        res = r["result"]; why = None; notes = None
        if res["type"] == "succeeded":
            u = res["message"]["usage"]; tin += u.get("input_tokens", 0) + u.get("cache_read_input_tokens", 0) + u.get("cache_creation_input_tokens", 0); tout += u.get("output_tokens", 0)
            if res["message"].get("stop_reason") == "max_tokens": why = ["max_tokens"]
            else: notes, why = validate(text_of(res["message"]), eps_by_slug[slug])
        else:
            why = [res["type"]]
        if notes:
            store[slug] = {"h_src": h, "v": VERSION, "notes": notes, "model": MODEL, "ts": now}; tries.pop(slug, None); ok += 1
        else:
            t = tries.get(slug) or {}
            tries[slug] = {"h": h, "n": (t.get("n", 0) + 1) if t.get("h") == h else 1, "err": "; ".join(why)[:200]}; bad += 1
    return ok, bad, tin, tout


def main(argv=None):
    ap = argparse.ArgumentParser(); ap.add_argument("--limit", type=int, default=int(os.environ.get("SHOWNOTES_LIMIT") or 0))
    ap.add_argument("--collect-only", action="store_true"); ap.add_argument("--no-wait", action="store_true"); a = ap.parse_args(argv)
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("Kein ANTHROPIC_API_KEY - uebersprungen"); return
    sp = ROOT / "data" / "spend.json"
    sd = json.loads(sp.read_text("utf-8")) if sp.exists() else {}
    store = S.load_all(); tries = load_tries(); eps = load_episodes(); by = {e["slug"]: e for e in eps}
    state = S.DIR / "_batch.json"; S.DIR.mkdir(parents=True, exist_ok=True)
    wait = float(os.environ.get("SHOWNOTES_WAIT_S") or 18000)
    if state.exists():   # Batch eines frueheren Laufs (Zeitlimit): zuerst einsammeln
        st = json.loads(state.read_text("utf-8"))
    else:
        if a.collect_only:
            print("Kein offener Batch"); return
        spent = spent_usd(sd)
        if spent >= BUDGET_USD:
            print(f"Monatsgrenze erreicht: {spent:.2f} von {BUDGET_USD:.2f} USD in {month_key()} - nichts geschrieben"); return
        todo = pending(eps, store, tries)
        sel = select_within_budget(todo, spent, BUDGET_USD, a.limit)
        print(f"{len(eps)} Folgen, {len(todo)} offen, {len(sel)} im Budget ({spent:.2f} von {BUDGET_USD:.2f} USD verbraucht)")
        if not sel:
            return
        mapping = {f"n{i:05d}": [ep["slug"], h] for i, (ep, h) in enumerate(sel)}
        b = api("POST", "/v1/messages/batches", {"requests": [request_for(ep, cid) for cid, (ep, _) in zip(mapping, sel)]})
        st = {"id": b["id"], "map": mapping}; state.write_text(json.dumps(st), "utf-8"); print("Batch", b["id"])
    deadline = time.time() + wait
    while True:
        b = api("GET", f"/v1/messages/batches/{st['id']}"); print(b["processing_status"], b.get("request_counts"), flush=True)
        if b["processing_status"] == "ended": break
        if a.no_wait or time.time() > deadline:
            print("Batch laeuft noch; wird im naechsten Lauf eingesammelt"); return
        time.sleep(120)
    rq = anthropic_request(b["results_url"], headers={"x-api-key": os.environ["ANTHROPIC_API_KEY"]}, job="rewrite_shownotes", lang="batch", model=MODEL)
    lines = urlopen(rq, timeout=900).read().decode().splitlines()
    ok, bad, tin, tout = apply_results(lines, st["map"], by, store, tries)
    S.save_all(store); tries_path().write_text(json.dumps(tries, sort_keys=True, indent=0), "utf-8")
    usd = cost_usd(tin, tout, 0, 0, MODEL) * 0.5
    add_spend(sd, usd, tin, tout, ok + bad); sp.write_text(json.dumps(sd, indent=1), "utf-8")
    state.unlink(missing_ok=True)
    print(f"fertig: {ok} ok, {bad} fehlgeschlagen, Tokens ein/aus {tin}/{tout}, Kosten {usd:.2f} USD (Batch-Preis)")


if __name__ == "__main__":
    main()
