#!/usr/bin/env python3
"""Haiku-Uebersetzung der englischen Video-Artikel (data/articles/<VIDEO>.json) in die 14 Zielsprachen (Mirko, 9.11.2026, "Weg B").
Sonnet schreibt nur die englische Fassung (generate_articles.py); hier uebersetzt Haiku sie EINMAL im Message Batch (50 % Rabatt).
Wiederverwendet aus translate_blog.py: Segmentierung (HTML-Struktur bleibt), System-Prompt/Sprachprofile, QA (Tags, Links, Schrift, Namen/KEEP),
Marker-Parser, Preise. Vorhandene Sprachfassungen werden nie neu uebersetzt (Vertrag wie translate_blog.py, #315): aendert sich die englische Fassung, wird die
Uebersetzung nur als stale markiert und im Log gelistet. Fehlende Teile (FAQ, Quiz, Infografiken), die Sonnet erst spaeter ergaenzt, werden dagegen einmal
nachuebersetzt (gap) und in die vorhandene Haiku-Fassung eingefuegt - der uebrige Text bleibt. Ausgaben werden getrennt als "articles_tr" in data/spend.json gezaehlt.
Ausfaelle der API (errored/expired/canceled, Netz- und HTTP-Fehler) zaehlen nie als Versuch; nur inhaltliche Fehler (QA) und von der API abgewiesene Anfragen
(errored mit invalid_request_error) zaehlen, nach MAX_TRIES ist die Fassung gesperrt. Ein Versuch zaehlt erst, wenn alle Anfragen der Fassung abgesendet und beantwortet sind.
Ein Batch, den die API nicht mehr kennt (HTTP 404: geloescht, Ergebnisse abgelaufen, anderer Workspace), wird aus dem Zwischenstand genommen; seine Fassungen sind wieder offen.
Zwischenstand (laufende Batches, Teilsegmente, Versuche): data/articles_tr_state.json."""
import copy, hashlib, json, os, re, time, urllib.error
from datetime import datetime, timezone
from pathlib import Path

import translate_blog as TB
from ai_gateway import anthropic_request, check_budget, report_usage, thinking_off, urlopen

ROOT = Path(__file__).parent
STATE = "articles_tr_state.json"
LANGS = TB.LANGS
MODEL = TB.MODEL
TR_BUDGET = float(os.environ.get("ARTICLE_TR_BUDGET_USD") or 60)   # Haiku-Uebersetzungen je Kalendermonat (UTC), getrennt vom Sonnet-Deckel ARTICLE_BUDGET_USD
TR_LIMIT = int(os.environ.get("ARTICLE_TR_LIMIT") or 0)            # Sprachfassungen je Lauf (0 = nur das Budget begrenzt)
MAX_TRIES = TB.MAX_TRIES
SKIP_KEYS = {"typ", "art"}                                          # Typkennungen der Infografiken bleiben
ART_KEYS = ("info", "infos", "faq", "quiz")
API_ERR = (OSError, ValueError)                                     # Netz/HTTP (URLError, HTTPError, Timeout sind OSError) und kaputtes JSON der API


def transient(e):
    """Voruebergehender Ausfall (Netz, Zeitlimit, HTTP 408/409/429/5xx) - im Gegensatz zu einer abgewiesenen Anfrage (HTTP 4xx), die ein Fehler im Code ist."""
    return not isinstance(e, urllib.error.HTTPError) or e.code in (408, 409, 429) or e.code >= 500


def api_reason(res):
    """(Grund, abgewiesen) eines Ergebnisses ohne Antwort: Ergebnisart, bei "errored" mit Fehlerart und Meldung der API (wie rewrite_shownotes.py).
    abgewiesen = invalid_request_error: die Anfrage selbst ist ungueltig (z. B. zu lang) - ein erneutes Senden aendert nichts, zaehlt also als Versuch."""
    e = res.get("error") or {}
    while isinstance(e.get("error"), dict): e = e["error"]
    return (res["type"] + (f": {e.get('type', '')} {e.get('message', '')}".rstrip() if e else ""))[:200], e.get("type") == "invalid_request_error"


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


def gap_keys(en, cur):
    """Teile (info/infos/faq/quiz), die die englische Fassung inzwischen hat, der Uebersetzung aber fehlen (Sonnet hat sie erst nach der Uebersetzung ergaenzt)."""
    return [k for k in ART_KEYS if en.get(k) and not cur.get(k)]


def base_hash(en, cur):
    """Quell-Hash der englischen Fassung ohne die Teile, die der Uebersetzung fehlen = Hash zur Zeit der Uebersetzung, wenn sich sonst nichts geaendert hat."""
    g = gap_keys(en, cur)
    return en_hash({k: v for k, v in en.items() if k not in g})


def needed(en, cur=None):
    """Einheiten, die zu uebersetzen sind: ohne Fassung alle, mit Haiku-Fassung nur die der fehlenden Teile (gap)."""
    _tpl, units, paths = units_of(en)
    if cur is None: return units
    g = set(gap_keys(en, cur)); return [(i, t) for i, t in units if i in paths and paths[i][0] in g]


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
    """[(vid, lang)]: Video hat eine englische Fassung und die Sprache fehlt noch, oder der Haiku-Fassung fehlen Teile, die Englisch inzwischen hat (gap).
    Vorhandener Text wird nie neu angefragt; Sprachfassungen anderer Herkunft (Altbestand) bleiben ganz unberuehrt."""
    return [(v, l) for v in vids for l in langs if (store.get(v) or {}).get("en", {}).get("html")
            and (l not in store[v] or (store[v][l].get("src") == "haiku-tr" and gap_keys(store[v]["en"], store[v][l])))]


def est_usd(lang, units):
    return TB.cost(*TB.est(lang, units))


def mark_stale(store):
    """Uebersetzungen (src haiku-tr), deren Quell-Hash nicht mehr zur englischen Fassung passt, werden nur markiert (stale), nie neu uebersetzt.
    Nur fehlende, spaeter ergaenzte Teile (gap) machen eine Fassung nicht veraltet - die werden nachuebersetzt."""
    n = 0
    for v, d in store.items():
        en = d.get("en")
        if not en:
            continue
        for l, a in d.items():
            if l != "en" and a.get("src") == "haiku-tr":
                stale = a.get("h") != base_hash(en, a)
                if stale != bool(a.get("stale")):
                    n += 1
                    if stale: a["stale"] = True
                    else: a.pop("stale", None)
    return n


def stale_list(store):
    """{vid: [Sprachen]} der als veraltet markierten Haiku-Fassungen (fuers Protokoll; neu uebersetzt wird nicht automatisch)."""
    return {v: sorted(l for l, a in d.items() if l != "en" and a.get("stale")) for v, d in sorted(store.items()) if any(l != "en" and a.get("stale") for l, a in d.items())}


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
        en = store[v]["en"]; h = en_hash(en); cur = store[v].get(l); units = needed(en, cur)
        if not units: continue
        rec = s["partial"].get(pk(l, v))
        if not rec or rec["h"] != h or rec.get("gap") != (gap_keys(en, cur) if cur else None):
            rec = {"h": h, "seg": {}, "tries": 0, **({"gap": gap_keys(en, cur)} if cur else {})}
        if rec["tries"] >= MAX_TRIES:
            s["failed"][pk(l, v)] = "qa"; s["partial"].pop(pk(l, v), None); continue
        if limit and n >= limit: break
        cs = TB.chunks(units, rec["seg"])
        c_usd = est_usd(l, [u for c in cs for u in c])
        if money + c_usd > room:
            print(f"Budget articles_tr erreicht ({TR_BUDGET:.2f} $; diesen Monat {spent_month():.2f} $, offen {pending_cost(s):.2f} $) - Rest bleibt offen"); break
        money += c_usd; n += 1; s["partial"][pk(l, v)] = rec
        rec["sent"] = False; rec.pop("api_miss", None)   # neuer Versuch: erst wenn alle Anfragen abgesendet sind (sent), kann er zaehlen
        for ci, c in enumerate(cs):
            reqs.append({"custom_id": f"{l}_{TB.key(v)}_{ci}", "params": {"model": MODEL, "max_tokens": TB.MAX_TOK,
                         **thinking_off(MODEL), "system": [{"type": "text", "text": TB.system_prompt(l), "cache_control": {"type": "ephemeral"}}],
                         "messages": [{"role": "user", "content": TB.user_prompt(l, c)}]}})
        items.append({"lang": l, "vid": v, "h": h})
    if not reqs:
        print("Nichts abzusenden."); return 0
    if not check_budget("generate_articles", MODEL, money / max(0.000001, float(os.environ.get("USD_PER_EUR", "1.08")))):
        for it in items:
            if not s["partial"][pk(it["lang"], it["vid"])]["seg"]: s["partial"].pop(pk(it["lang"], it["vid"]), None)
        return 0
    lastpos = {r["custom_id"].rsplit("_", 1)[0]: j for j, r in enumerate(reqs)}   # letzte Anfrage je Fassung
    for i in range(0, len(reqs), TB.PER_BATCH):
        part = reqs[i:i + TB.PER_BATCH]
        ids = {r["custom_id"].rsplit("_", 1)[0] for r in part}
        its = [it for it in items if f"{it['lang']}_{TB.key(it['vid'])}" in ids]
        try:
            b = _api("POST", "/v1/messages/batches", {"requests": part})
        except API_ERR as e:   # nichts verloren: unbezahlte Fassungen bleiben offen fuer den naechsten Lauf
            print(f"::warning::Batch nicht abgesendet ({type(e).__name__}: {str(e)[:200]}) - {len(reqs) - i} Anfragen bleiben offen")
            rest = {r["custom_id"].rsplit("_", 1)[0] for r in reqs[i:]} - {r["custom_id"].rsplit("_", 1)[0] for r in reqs[:i]}   # Fassungen ganz ohne abgesendete Anfrage
            for it in [it for it in items if f"{it['lang']}_{TB.key(it['vid'])}" in rest]:
                r0 = s["partial"].get(pk(it["lang"], it["vid"]))
                if r0 and not r0["seg"] and not r0["tries"]: s["partial"].pop(pk(it["lang"], it["vid"]), None)
            save_state(s)
            if not transient(e): raise   # abgewiesene Anfrage (z. B. HTTP 400): Lauf sichtbar rot, Zwischenstand ist gespeichert
            return i
        s["batches"].append({"id": b["id"], "n": len(part), "model": MODEL, "created": datetime.now(timezone.utc).isoformat()[:19],
                             "est_usd": round(money * len(part) / len(reqs), 3), "items": its})
        for it in its:   # letzte Anfrage der Fassung ist abgesendet
            if lastpos[f"{it['lang']}_{TB.key(it['vid'])}"] < i + len(part): s["partial"][pk(it["lang"], it["vid"])]["sent"] = True
        save_state(s); print("Batch", b["id"], len(part), "Anfragen, geschaetzt", round(money * len(part) / len(reqs), 2), "$")
    return len(reqs)


def ingest(store, s, lang, vid, h, got):
    """Segmente einer Antwort pruefen (TB.qa) und in den Zwischenstand legen; Rueckgabe (ok, schlecht, Gruende)."""
    en = store[vid]["en"]; tpl, units, _ = units_of(en); src = dict(units)
    rec = s["partial"].get(pk(lang, vid)); cur = store[vid].get(lang)
    if not rec or rec["h"] != h: rec = s["partial"][pk(lang, vid)] = {"h": h, "seg": {}, "tries": 0, **({"gap": gap_keys(en, cur)} if cur else {})}
    ok = bad = 0; why = {}
    for i, t in got.items():
        if i not in src: continue
        good, reason, _w = TB.qa(lang, src[i], t)
        if good: rec["seg"][i] = t; ok += 1
        else: bad += 1; why[reason] = why.get(reason, 0) + 1
    return ok, bad, why


def finish(store, s, lang, vid, count=True, reason="qa"):
    """Vollstaendige Uebersetzung speichern (nie eine vorhandene Fassung ersetzen; gap: nur die fehlenden Teile in die Haiku-Fassung einfuegen), sonst Versuch zaehlen.
    count=False (Ausfall der API bei einem Teil der Anfragen, oder Anfragen der Fassung stehen noch aus): unvollstaendig bleibt offen, ohne Versuch.
    reason: Sperrgrund in failed nach MAX_TRIES ("qa" oder "api_invalid")."""
    rec = s["partial"].get(pk(lang, vid))
    if not rec: return False
    en = store[vid].get("en"); cur = store[vid].get(lang); gap = rec.get("gap"); today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if gap is not None and not (cur and cur.get("src") == "haiku-tr"):   # Fassung inzwischen weg oder ersetzt: nichts einfuegen, kein Versuch
        s["partial"].pop(pk(lang, vid), None); return False
    units = needed(en, cur) if gap is not None else needed(en)
    if rec["h"] == en_hash(en) and all(i in rec["seg"] for i, _t in units):
        if gap is None and cur is None:
            res = build(en, rec["seg"]); res.update({"model": MODEL, "src": "haiku-tr", "h": rec["h"], "ts": today})
            store[vid][lang] = res
        elif gap is not None:   # nur die fehlenden Teile einfuegen; das HTML und vorhandene Teile bleiben, wie sie sind
            new = build(en, {**{i: "" for i, _t in units_of(en)[1]}, **rec["seg"]}); fresh = cur.get("h") == base_hash(en, cur)
            for k in gap_keys(en, cur): cur[k] = new[k]
            cur["gap_ts"] = today
            if fresh: cur["h"] = rec["h"]; cur.pop("stale", None)   # sonst bleibt der alte Quell-Hash: das HTML ist weiter veraltet (stale)
        s["partial"].pop(pk(lang, vid), None); return True
    if not count: return False
    rec["tries"] += 1
    if rec["tries"] >= MAX_TRIES:
        s["failed"][pk(lang, vid)] = reason; s["partial"].pop(pk(lang, vid), None)
    return False


def collect(store, s, save=None, stats=None):
    """Fertige Batches abholen. save(vid) schreibt data/articles/<vid>.json. Rueckgabe: Anzahl noch laufender Batches.
    Voruebergehende Netz-/HTTP-Fehler beim Abfragen: der Batch bleibt offen (naechste Abfrage oder naechster Lauf), nichts geht verloren. HTTP 404: die API kennt
    den Batch nicht mehr - er wird verworfen (::error::, stats "lost"), seine Fassungen sind wieder offen. Andere HTTP-4xx (Schluessel ungueltig, keine Rechte):
    Zwischenstand speichern und Fehler weitergeben (Lauf rot). Ergebnisse ohne Antwort der API (errored/expired/canceled) zaehlen nicht als Versuch, ausser die API hat
    die Anfrage als ungueltig abgewiesen (invalid_request_error, stats "rejected"); stats {"results", "api", "rejected", "lost"} fuer run() und main()."""
    left = []; stats = stats if stats is not None else {}; todo_b = list(s["batches"])
    for bi, b in enumerate(todo_b):
        try:
            st = _api("GET", f"/v1/messages/batches/{b['id']}")
            lines = _api("GET", st["results_url"], raw=True).decode().splitlines() if st["processing_status"] == "ended" else None
        except API_ERR as e:
            if transient(e):
                print(f"::warning::Batch {b['id']} gerade nicht abrufbar ({type(e).__name__}: {str(e)[:200]}) - bleibt offen"); left.append(b); continue
            if e.code != 404:   # z. B. 401/403: Schluessel falsch - nicht still weiter warten
                s["batches"] = left + todo_b[bi:]; save_state(s); raise
            print(f"::error::Batch {b['id']} ({b.get('created', '?')}, {b.get('n', '?')} Anfragen) ist bei der API nicht mehr vorhanden (HTTP 404: geloescht, Ergebnisse "
                  f"abgelaufen oder anderer Workspace) - verworfen, die Fassungen werden neu angefragt")
            stats["lost"] = stats.get("lost", 0) + 1
            other = {(it["lang"], it["vid"]) for b2 in left + todo_b[bi + 1:] for it in b2["items"]}
            for it in b["items"]:
                r0 = s["partial"].get(pk(it["lang"], it["vid"]))
                if (it["lang"], it["vid"]) not in other and r0 and not r0["seg"] and not r0["tries"]: s["partial"].pop(pk(it["lang"], it["vid"]), None)
            continue
        if lines is None:
            print(b["id"], st["processing_status"], st["request_counts"]); left.append(b); continue
        info = {(it["lang"], TB.key(it["vid"])): it for it in b["items"]}
        tin = tout = ok = bad = 0; why = {}; seen = set(); apifail = set(); rejected = set(); calls = 0
        for line in lines:
            r = json.loads(line); lang, k, _ = r["custom_id"].split("_"); it = info.get((lang, k))
            if not it: continue
            res = r["result"]; stats["results"] = stats.get("results", 0) + 1
            if res["type"] != "succeeded":
                reason, inval = api_reason(res); why["api " + reason] = why.get("api " + reason, 0) + 1
                if inval:   # von der API abgewiesen (z. B. zu lang): erneutes Senden hilft nicht -> Versuch
                    rejected.add((lang, it["vid"])); stats["rejected"] = stats.get("rejected", 0) + 1
                else:   # Ausfall der API, kein Inhaltsfehler: kein Versuch (wie translate_blog.py und rewrite_shownotes.py)
                    apifail.add((lang, it["vid"])); stats["api"] = stats.get("api", 0) + 1
                continue
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
        # Ein Versuch zaehlt nur, wenn alle Anfragen der Fassung abgesendet (sent) und beantwortet sind: keine mehr in einem anderen offenen Batch (in welcher
        # Reihenfolge die Batches fertig werden, ist egal) und kein Ausfall der API in einem ihrer Batches (api_miss) - ausser die API hat eine Anfrage abgewiesen
        other = {(it["lang"], it["vid"]) for b2 in left + todo_b[bi + 1:] for it in b2["items"]}
        for lang, vid in apifail:
            if s["partial"].get(pk(lang, vid)): s["partial"][pk(lang, vid)]["api_miss"] = True
        done = 0
        for lang, vid in sorted(seen | apifail | rejected):
            rec = s["partial"].get(pk(lang, vid)) or {}
            count = rec.get("sent", True) and (lang, vid) not in other and ((lang, vid) in rejected or not rec.get("api_miss"))
            if vid in store and store[vid].get("en") and finish(store, s, lang, vid, count=count, reason="api_invalid" if (lang, vid) in rejected else "qa"):
                done += 1
                if save: save(vid)
        usd = add_spend(tin, tout, calls)
        report_usage("generate_articles", b["model"], tin, tout, "batch", batch=True)
        print(f"{b['id']}: {done} Sprachfassungen fertig, {ok} Segmente ok, {bad} fehlgeschlagen {why}, Haiku-Kosten Monat {usd:.2f} $")
    s["batches"] = left
    save_state(s)
    return len(left)


def run(store, vids, save, langs=LANGS, wait_min=None, stats=None):
    """collect -> submit -> warten -> collect, bis alles fertig ist oder MAX_TRIES Runden verbraucht sind. Ist die API in einer Runde ausgefallen
    (errored/expired/canceled, nicht abgewiesene Anfragen), sendet der Lauf nicht sofort erneut (die Fassungen bleiben offen fuer den naechsten Lauf); von der API
    abgewiesene Anfragen (invalid_request_error) zaehlen als Versuch und halten die Runden der anderen Fassungen nicht auf. stats: siehe collect()."""
    s = load_state(); wait = (wait_min if wait_min is not None else int(os.environ.get("WAIT_MIN", "200"))) * 60; t0 = time.time()
    stats = stats if stats is not None else {}
    collect(store, s, save, stats)
    for _round in range(MAX_TRIES):
        api0 = stats.get("api", 0)
        if not submit(store, vids, s, langs, TR_LIMIT): break
        while s["batches"] and time.time() - t0 < wait:
            time.sleep(120)
            if collect(store, s, save, stats) == 0: break
        if s["batches"]: break
        if stats.get("api", 0) > api0:
            print(f"::warning::{stats['api'] - api0} Anfragen ohne Ergebnis der API (zaehlen nicht als Versuch) - keine weitere Runde in diesem Lauf"); break
    save_state(s)
    return s
