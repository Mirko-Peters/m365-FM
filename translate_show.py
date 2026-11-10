"""Uebersetzt Titel + Zusammenfassungen der englischen Show (data/podpage) mit Claude Haiku per Message Batch (halber Preis).
Aufruf: python translate_show.py [--langs de,es,...] [--limit N] [--slugs a,b] [--stale] [--force-manual] [--wishes]. Ergebnis: data/podpage_i18n/<lang>.json
{folgen-slug: [titel, zusammenfassung]} und data/podpage_i18n/usage.json (Tokens gesamt, fuer die Kostenrechnung). Je Folge und Sprache steht der Hash der englischen Quelle in
data/podpage_i18n/src/<lang>.json. Politik (Mirko, 7.11.2026): nur EINMAL uebersetzen. Eine vorhandene Uebersetzung wird nie automatisch neu uebersetzt oder ueberschrieben; ein
geaendertes Original markiert sie nur als stale (data/podpage_i18n/stale.json {lang: {slug: [title|summary|notes_html]}}, i18n_overrides Vertrag 7). Neu uebersetzt wird nur auf
Anforderung: --stale (nur veraltete Fassungen; --langs/--slugs, ohne --slugs hoechstens STALE_MAX Anfragen je Lauf) oder --wishes (nur die Wunschliste der Redaktion).
Von Hand bearbeitete Felder (Redaktion, i18n_overrides.py: kind episode bzw. notes) sind eine reine Leseschicht ueber dem Maschinentext; eine Folge, bei der nur solche Felder
veraltet sind, sendet kein Lauf, ausser mit --force-manual. Ist der Export der Redaktion eingestellt, aber nicht abrufbar (kein 404), sendet --stale/--wishes in dieser
Sprache nichts und der Lauf endet mit Fehler (Sperre unbekannt, i18n_overrides Vertrag 5); Neues laeuft weiter. Erster Lauf: Hashes fuer vorhandene Uebersetzungen werden
ohne API aus dem aktuellen Original eingetragen."""
import json, os, sys, time, urllib.request, urllib.error
from site_text import bad as bad_text
from tm_hash import fields_hash
import i18n_overrides as OV
from pathlib import Path
import site_podpage as P
import site_shownotes_seo as SSEO
from ai_gateway import anthropic_request, check_budget, estimated_eur, report_usage, urlopen

MODEL = os.environ.get("TRANSLATE_MODEL", "claude-haiku-5-5")
OUT = Path(__file__).parent / "data" / "podpage_i18n"
NAMES = {"de": "German", "es": "Spanish", "fr": "French", "it": "Italian", "pt": "Portuguese", "nl": "Dutch", "pl": "Polish", "id": "Indonesian", "ru": "Russian", "uk": "Ukrainian",
         "ar": "Arabic", "he": "Hebrew", "ja": "Japanese", "ko": "Korean", }


# Haiku 5.5, Message Batch (50 % Rabatt, Prompts bis 100K Tokens): $ je 1 Mio. Tokens
PRICE_IN, PRICE_OUT = float(os.environ.get("PRICE_IN", "0.05")), float(os.environ.get("PRICE_OUT", "0.25"))
BUDGET = float(os.environ.get("BUDGET_USD", "70"))
STALE_MAX = int(os.environ.get("STALE_MAX", "200"))   # --stale ohne --slugs/--wishes: hoechstens so viele Anfragen je Lauf (bezahlte Neuuebersetzung bleibt begrenzt)
NOTES_MAXC = 8000   # Show Notes: so viele Zeichen des bereinigten HTML werden uebersetzt (translate_notes.py)


def text_of(msg):   # nur Bloecke vom Typ "text" (eine Antwort von Claude kann mit thinking-Bloecken beginnen)
    return "".join(c.get("text", "") for c in msg.get("content") or [] if c.get("type") == "text")


def cost(tin, tout):
    return tin * PRICE_IN / 1e6 + tout * PRICE_OUT / 1e6


def spent():
    uf = OUT / "usage.json"
    if not uf.exists(): return 0.0
    u = json.loads(uf.read_text()); return cost(u.get("input_tokens", 0), u.get("output_tokens", 0))


def guard(n, est_in, est_out, what):
    """Bricht ab, wenn der geschaetzte Worst-Case das Gesamtbudget sprengen wuerde."""
    est = n * cost(est_in, est_out); already = float(os.environ.get("RUN_SPENT", "0"))
    print(f"Budget {what}: bisher {spent():.2f} $ (Datei) + dieser Lauf {already:.2f} $ + Worst-Case {est:.2f} $ <= {BUDGET:.0f} $?")
    if spent() + already + est > BUDGET: raise SystemExit(f"Abbruch: Budget {BUDGET} $ wuerde ueberschritten")


def load_hashes(name, langs):
    """{lang: {slug: Quell-Hash}} aus data/podpage_i18n/src/<name-praefix><lang>.json (name: '' fuer Titel, 'notes_' fuer Show Notes)."""
    return {l: (json.loads((OUT / "src" / f"{name}{l}.json").read_text("utf-8")) if (OUT / "src" / f"{name}{l}.json").exists() else {}) for l in langs}


def save_hashes(name, hashes):
    (OUT / "src").mkdir(parents=True, exist_ok=True)
    for l, d in hashes.items(): (OUT / "src" / f"{name}{l}.json").write_text(json.dumps(d, ensure_ascii=False, sort_keys=True), encoding="utf-8")


def sync_hashes(have, hashes, src_hash):
    """Erster Lauf / Altbestand: vorhandene Uebersetzung ohne gespeicherten Hash -> aktuellen Quell-Hash eintragen (Annahme: Uebersetzung passt zum Original), keine API.
    src_hash: {slug: hash}. -> Anzahl neu eingetragener Hashes."""
    n = 0
    for slug, h in src_hash.items():
        if slug in have and slug not in hashes: hashes[slug] = h; n += 1
    return n


def state(slug, have, hashes, h, manual=False):
    """new = nie uebersetzt, stale = Original seit der Uebersetzung geaendert (Text bleibt), ok, manual = im Editor bearbeitet (gesperrt)."""
    if manual: return "manual"
    if slug not in have: return "new"
    return "ok" if hashes.get(slug) == h else "stale"


def wanted(st, stale_mode):
    """Automatik uebersetzt nur Neues; im Modus stale nur Veraltetes. Vorhandene Texte nie."""
    return st == ("stale" if stale_mode else "new")


def changed_fields(old, new, names):
    """Felder (Namen in der Reihenfolge der '|'-getrennten Teil-Hashes), deren Quelle sich geaendert hat; ohne alten Hash alle."""
    o, n = (old or "").split("|"), new.split("|")
    return [nm for k, nm in enumerate(names) if k >= len(o) or k >= len(n) or o[k] != n[k]] or list(names)


def update_stale(fields, found, examined, langs):
    """data/podpage_i18n/stale.json {lang: {slug: [felder]}}: fuer die geprueften Sprachen und Folgen die Eintraege dieser Felder neu setzen; alles andere
    (nicht gepruefte Sprachen eines Laufs mit --langs, andere Felder, andere Folgen) bleibt stehen."""
    f = OUT / "stale.json"; old = f.read_text("utf-8") if f.exists() else ""; cur = json.loads(old) if old else {}
    for l in langs:
        d = cur.setdefault(l, {})
        for slug in examined:
            keep = [x for x in d.get(slug, []) if x not in fields] + list(found.get(l, {}).get(slug, []))
            if keep: d[slug] = keep
            else: d.pop(slug, None)
        if not d: cur.pop(l, None)
    new = json.dumps(cur, ensure_ascii=False, indent=1, sort_keys=True)
    if new != old: OUT.mkdir(parents=True, exist_ok=True); f.write_text(new, encoding="utf-8")
    return cur


def plan(kind, lang, slug, have, hashes, h, stale_mode=False, force_manual=False):
    """Eine Folge in einer Sprache -> (senden, [Feldnamen fuer stale.json]). kind episode (h = show_hash) oder notes (h = notes_hash).
    Neu = einmal uebersetzen (nicht im Modus stale). Vorhanden = nie automatisch; im Modus stale nur, wenn sich die Quelle eines Felds OHNE Handtext geaendert hat
    (--force-manual: auch mit Handtext - der Handtext bleibt trotzdem die angezeigte Fassung, bis die Redaktion ihn zuruecksetzt).
    Liste (i18n_overrides Vertrag 7): Feld ohne Handtext = Quelle seit der Uebersetzung geaendert; Feld mit Handtext = dessen Anker passt nicht mehr zur Quelle."""
    units = OV.UNITS[kind]; st = state(slug, have, hashes, h)
    if st == "new": return not stale_mode, []
    ov = OV.get(kind, lang, slug); changed = changed_fields(hashes.get(slug), h, units) if st == "stale" else []
    cur = dict(zip(units, (x[:8] for x in h.split("|"))))
    listed = [OV.STALE_FIELD[u] for u in units if OV.outdated(ov.get(u), cur.get(u, ""), u in changed)]
    return stale_mode and any(force_manual or u not in ov for u in changed), listed


def unknown_lock(kind, langs, stale_mode, force_manual):
    """Sprachen, in denen ein Lauf mit --stale/--wishes nichts ersetzen darf: Export der Redaktion eingestellt, aber nicht abrufbar - welche Felder einen Handtext
    haben, ist unbekannt (i18n_overrides Vertrag 5). --force-manual braucht die Sperre nicht."""
    if not stale_mode or force_manual: return []
    for l in langs: OV.load(kind, l)
    return [l for l in langs if OV.failed(kind, l)]


def halt(kind, held):
    if held: raise SystemExit(f"Export der Redaktion nicht abrufbar - keine Neuuebersetzung vorhandener Fassungen ({kind}) in {', '.join(held)}. Lauf wiederholen, sobald der Export wieder "
                              "antwortet (--force-manual braucht die Sperre nicht).")


def show_source(e):
    """(Titel, Zusammenfassung <= 900 Zeichen) einer Folge - genau der Text, der uebersetzt wird."""
    summ = (P.plain(e.get("summary")) or P.plain(e.get("show_notes")))[:900]
    if len(summ) == 900: summ = summ.rsplit(" ", 1)[0] + " …"
    return e["name"], summ


def show_hash(e): return "|".join(fields_hash(x) for x in show_source(e))   # Teil-Hashes je Feld: title|summary


def notes_original(e):
    """Bereinigtes HTML der bisherigen Show Notes einer Folge (Podpage-Sicherung) - die Quelle aller Uebersetzungen, die es vor den neu geschriebenen Notes gab."""
    return P.san(e.get("show_notes"))[:NOTES_MAXC]


def notes_source(e):
    """Genau der Text, den translate_notes.py uebersetzt (und dessen Hash bzw. Anker gilt): zeigt die englische Folgenseite die neu geschriebenen Show Notes
    (site_shownotes_seo: nur bei duennen Originalen), deren schlanke HTML-Fassung, sonst das bereinigte HTML der bisherigen Show Notes."""
    return SSEO.source_for_translation(e) or notes_original(e)


def notes_hash(e): return fields_hash(notes_source(e))


def anchors(e):
    """Quell-Anker der Felder einer Folge fuer die Redaktion (i18n_overrides Vertrag 2; #319 veroeffentlicht sie neben dem Original): title/summary = kind episode, html = kind notes."""
    t, sm = show_source(e)
    return {"title": OV.anchor("episode", "title", t), "summary": OV.anchor("episode", "summary", sm), "html": OV.anchor("notes", "html", notes_source(e))}


def parse_json(txt):
    """Robust: Codezaeune entfernen, sonst Felder per Regex holen."""
    import re
    t = txt.strip()
    if t.startswith("```"): t = re.sub(r"^```[a-z]*\n?|```$", "", t).strip()
    try:
        j = json.loads(t[t.index("{"):t.rindex("}") + 1], strict=False)
        return j["title"], j["summary"]
    except Exception:
        m = re.search(r'"title"\s*:\s*"(.*?)"\s*,\s*"summary"\s*:\s*"(.*)"\s*}?\s*$', t, re.S)
        if m: return m.group(1), m.group(2)
        raise


def call(method, path, body=None, job="translate_show"):
    req = anthropic_request(path, body, job=job, lang="batch", model=MODEL, api_key=os.environ["ANTHROPIC_API_KEY"])
    req.method = method
    try:
        return json.loads(urlopen(req, timeout=300).read())
    except urllib.error.HTTPError as e:
        msg = f"API-Fehler {e.code} {method} {path}: {e.read()[:600]!r}"
        print(msg); OUT.mkdir(parents=True, exist_ok=True); (OUT / "last_error.txt").write_text(msg); raise


def main():
    a = sys.argv[1:]
    langs = (a[a.index("--langs") + 1].split(",") if "--langs" in a else list(NAMES))
    limit = int(a[a.index("--limit") + 1]) if "--limit" in a else 0
    eps = [e for e in P.load("episodes") if e.get("published") not in (False, "False") and e.get("hidden") not in (True, "True")]
    eps.sort(key=lambda e: e["create_time"], reverse=True)
    if limit: eps = eps[:limit]
    OUT.mkdir(parents=True, exist_ok=True)
    OV.use_api()   # Handtexte der Redaktion live aus dem Export (COMMUNITY_API), sonst aus data/i18n_overrides
    have = {l: (json.loads((OUT / f"{l}.json").read_text("utf-8")) if (OUT / f"{l}.json").exists() else {}) for l in langs}
    hashes = load_hashes("", langs); eh = {e["slug"]: show_hash(e) for e in eps}
    mig = sum(sync_hashes(have[l], hashes[l], eh) for l in langs)
    if mig: save_hashes("", hashes); print(f"{mig} Quell-Hashes aus dem Bestand eingetragen (ohne API)")
    force_manual = "--force-manual" in a
    slugs = set(a[a.index("--slugs") + 1].split(",")) if "--slugs" in a else set()
    wish = OV.wishes("episode") if "--wishes" in a else None; stale_mode = "--stale" in a or wish is not None   # Wunschliste der Redaktion (Vertrag 8)
    held = unknown_lock("episode", langs, stale_mode, force_manual)   # Sperre unbekannt: in diesen Sprachen wird nichts Vorhandenes gesendet

    def scan():
        """Zustand aller geprueften Folgen: was zu senden waere und was veraltet ist (stale.json wird fuer die geprueften Sprachen und Folgen neu geschrieben)."""
        send, stale = [], {}
        for l in langs:
            for e in eps:
                go, listed = plan("episode", l, e["slug"], have[l], hashes[l], eh[e["slug"]], stale_mode, force_manual)
                if listed: stale.setdefault(l, {})[e["slug"]] = listed
                if go and l not in held and not (slugs and e["slug"] not in slugs) and (wish is None or e["slug"] in wish.get(l, {})): send.append((l, e))
        update_stale(("title", "summary"), stale, [e["slug"] for e in eps], [l for l in langs if not OV.failed("episode", l)])   # Handtexte unbekannt: Liste der Sprache bleibt
        return send, stale

    def finish():
        """Nach dem Lauf: stale.json aus den neuen Hashes (neu uebersetzte Fassungen fallen heraus), erledigte Wuensche zurueck an die Redaktion."""
        open_ = {(l, e["slug"]) for l, e in scan()[0]}
        if wish is not None: OV.wishes_done("episode", [(l, s) for l in langs if l not in held for s in wish.get(l, {}) if (l, s) not in open_])

    send, stale = scan()
    if stale_mode and not slugs and wish is None and len(send) > STALE_MAX:
        print(f"--stale ohne --slugs: {len(send)} veraltete Fassungen, dieser Lauf sendet die ersten {STALE_MAX} (STALE_MAX)"); send = send[:STALE_MAX]
    shash = {}; reqs = []
    for l, e in send:
        shash[(l, e["slug"])] = eh[e["slug"]]
        _, summ = show_source(e)
        src = (f"Translate the following podcast episode into {NAMES[l]}. The text below is the SOURCE to translate (it is complete as given; a trailing '…' only marks a shortened summary).\n\n"
               f"TITLE: {e['name']}\n\nSUMMARY: {summ or '(none)'}\n\n"
               f"Reply with one JSON object only, no other text: {{\"title\": \"<translated title>\", \"summary\": \"<translated summary, or empty string if the summary is (none)>\"}}")
        reqs.append({"custom_id": f"{l}__{e['slug']}"[:64] if len(f"{l}__{e['slug']}") <= 64 else f"{l}__{e['id']}", "params": {"model": MODEL, "max_tokens": 4096, "thinking": {"type": "disabled"},
                     "system": "You are a translation engine for podcast metadata. Always translate the SOURCE given in the user message and answer with JSON only. Keep product names (Microsoft 365, Copilot, Power BI, Azure ...) untranslated. Never ask for more text.",
                     "messages": [{"role": "user", "content": src}]}})
    if stale: print(f"{sum(len(v) for v in stale.values())} Fassungen veraltet (Original geaendert) -> stale.json, werden nicht automatisch neu uebersetzt")
    if not reqs:
        finish(); print("Nichts zu uebersetzen"); halt("episode", held); return
    if not check_budget("translate_show", MODEL, estimated_eur(len(json.dumps(reqs)) // 3, len(reqs) * 1500, batch=True)):
        return
    idmap = {r["custom_id"]: r["custom_id"] for r in reqs}
    slug_by_id = {str(e["id"]): e["slug"] for e in eps}
    print(len(reqs), "Anfragen, Modell", MODEL)
    guard(len(reqs), 500, 1500, "Titel/Zusammenfassungen")
    b = call("POST", "/v1/messages/batches", {"requests": reqs})
    bid = b["id"]; print("Batch", bid)
    (OUT / "batch.json").write_text(json.dumps({"id": bid, "n": len(reqs), "model": MODEL}))
    while b["processing_status"] != "ended":
        time.sleep(120); b = call("GET", f"/v1/messages/batches/{bid}"); print(b["processing_status"], b["request_counts"], flush=True)
    tin = tout = ok = bad = 0; why = {}; samples = []
    req = anthropic_request(b["results_url"], headers={"x-api-key": os.environ["ANTHROPIC_API_KEY"]}, job="translate_show", lang="batch", model=MODEL)
    for line in urlopen(req, timeout=600).read().decode().splitlines():
        r = json.loads(line); cid = r["custom_id"]; l, key = cid.split("__", 1); key = slug_by_id.get(key, key)
        res = r["result"]
        if res["type"] != "succeeded":
            bad += 1; why[res["type"]] = why.get(res["type"], 0) + 1
            if len(samples) < 8: samples.append({"id": cid, "result": json.dumps(res)[:400]})
            continue
        u = res["message"]["usage"]; tin += u["input_tokens"]; tout += u["output_tokens"]
        if res["message"].get("stop_reason") == "max_tokens":
            bad += 1; why["max_tokens"] = why.get("max_tokens", 0) + 1; continue
        if any(bad_text(c.get("text", "")) for c in res["message"]["content"]): bad += 1; why["encoding"] = why.get("encoding", 0) + 1; continue   # T5
        try:
            t, sm = parse_json(text_of(res["message"])); have[l][key] = [t.strip(), sm.strip()]; hashes[l][key] = shash.get((l, key), ""); ok += 1
        except Exception:
            bad += 1; why["parse"] = why.get("parse", 0) + 1
            if len(samples) < 8: samples.append({"id": cid, "text": text_of(res["message"])[:400]})
    for l in langs: (OUT / f"{l}.json").write_text(json.dumps(have[l], ensure_ascii=False), encoding="utf-8")
    save_hashes("", hashes)
    finish()
    uf = OUT / "usage.json"; old = json.loads(uf.read_text()) if uf.exists() else {"input_tokens": 0, "output_tokens": 0, "runs": []}
    old["input_tokens"] += tin; old["output_tokens"] += tout; old["runs"].append({"batch": bid, "model": MODEL, "ok": ok, "failed": bad, "why": why, "input_tokens": tin, "output_tokens": tout})
    report_usage("translate_show", MODEL, tin, tout, "batch", batch=True)
    uf.write_text(json.dumps(old, indent=1))
    if samples: (OUT / "fail_samples.json").write_text(json.dumps(samples, ensure_ascii=False, indent=1))
    rep = {"stage": "titles", "requests": len(reqs), "ok": ok, "failed": bad, "why": why, "input_tokens": tin, "output_tokens": tout, "cost_usd": round(cost(tin, tout), 3), "success_rate": round(ok / max(1, ok + bad), 4)}
    (OUT / "report_titles.json").write_text(json.dumps(rep, indent=1))
    print(f"fertig: {ok} ok, {bad} fehlgeschlagen {why}, Tokens ein/aus: {tin}/{tout}, Kosten {cost(tin, tout):.3f} $")
    halt("episode", held)
    return rep


def run_all():
    rep1 = main() or {}
    if "--notes" in sys.argv:
        os.environ["RUN_SPENT"] = str(rep1.get("cost_usd", 0))
        import translate_notes
        rep2 = translate_notes.main() or {}
        tot = {"titles": rep1, "notes": rep2, "total_cost_usd": round(rep1.get("cost_usd", 0) + rep2.get("cost_usd", 0), 3),
               "total_input_tokens": rep1.get("input_tokens", 0) + rep2.get("input_tokens", 0), "total_output_tokens": rep1.get("output_tokens", 0) + rep2.get("output_tokens", 0)}
        (OUT / "report.json").write_text(json.dumps(tot, indent=1)); print(json.dumps(tot, indent=1))


if __name__ == "__main__":
    try:
        run_all()
    except Exception as ex:
        import traceback
        OUT.mkdir(parents=True, exist_ok=True)
        if not (OUT / "last_error.txt").exists() or "API-Fehler" not in (OUT / "last_error.txt").read_text():
            (OUT / "last_error.txt").write_text(traceback.format_exc()[-1500:])
        raise
