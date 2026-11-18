"""Bergung bezahlter Entitaeten-Batches, deren state.json verloren ging (abgebrochener entity-fill-Lauf 44326936208 am 18.11.2026).

Schickt KEINE neuen KI-Auftraege. Liest nur die Batch-Liste und fertige Ergebnisse bei Anthropic (kostenlos, 29 Tage abrufbar) und traegt die
Batches wieder in data/entity_fill/state.json ein; danach erledigt `python fill_entities.py collect` (Pruefung wie im normalen Lauf, Kostenbuch)
und `python fill_entities.py push` (D1) den Rest.

  python tools/entity_fill_recover.py list  [--since ISO] [--until ISO]
  python tools/entity_fill_recover.py adopt --since ISO --until ISO
  python tools/entity_fill_recover.py recollect <batch-id> [<batch-id> ...]

recollect: schon eingesammelte und gebuchte Batches noch einmal einsammeln (z. B. nach geaenderten Pruefregeln). Die Batches bekommen recollect=True:
collect bucht sie nicht noch einmal (Kostenbuch, Worker-Budget); Vorhandenes bleibt (Texte werden nie ueberschrieben, translate-once).

adopt: nur Batches im Zeitfenster, deren Auftraege das Format von fill_entities haben (w_<key>_<h>, t_<lang>_<key>_<h>) und die noch nicht in
state.json stehen. Fuer Schreibauftraege mit Langtext (ab RICH_GUESS Zeichen) wird das Kennzeichen state["rich"] gesetzt, das der verlorene
Lauf beim Absenden gemerkt hatte (collect prueft sonst gegen die kurze Textgrenze und verwirft den Text).
"""
import json, os, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import fill_entities as FE  # noqa: E402

RICH_GUESS = 2400   # ueber der Obergrenze normaler Langtexte (330 Woerter), unter RICH_MIN_CHARS (2600): collect prueft die genaue Grenze selbst


def batches(since="", until=""):
    out, after = [], ""
    for _ in range(20):
        page = FE.api("GET", "/v1/messages/batches?limit=100" + (f"&after_id={after}" if after else ""))
        for b in page.get("data") or []:
            c = b.get("created_at") or ""
            if (not since or c >= since) and (not until or c <= until):
                out.append(b)
        if not page.get("has_more") or not page.get("data"):
            break
        after = page.get("last_id") or page["data"][-1]["id"]
    return sorted(out, key=lambda b: b.get("created_at") or "")


def results(b):
    if not b.get("results_url"):
        return []
    return [json.loads(x) for x in FE.api("GET", b["results_url"], raw=True).decode().splitlines() if x.strip()]


def main():
    args = sys.argv[1:]; mode = args[0] if args else "list"
    opt = lambda n, d="": args[args.index(n) + 1] if n in args else d
    since, until = opt("--since"), opt("--until")
    if not os.environ.get("ANTHROPIC_API_KEY"):
        raise SystemExit("ANTHROPIC_API_KEY fehlt")
    if mode == "recollect":
        ids = [a for a in args[1:] if a.startswith("msgbatch_")]
        bs = [FE.api("GET", f"/v1/messages/batches/{i}") for i in ids]
        for b in bs:
            print(b["id"], b.get("created_at"), b.get("processing_status"), json.dumps(b.get("request_counts") or {}))
        return adopt(bs, recollect=True)
    bs = batches(since, until)
    print(f"{len(bs)} Batches im Fenster {since or '-'} .. {until or '-'}")
    for b in bs:
        print(b["id"], b.get("created_at"), b.get("ended_at"), b.get("processing_status"), json.dumps(b.get("request_counts") or {}))
    if mode != "adopt":
        return
    if not (since and until):
        raise SystemExit("adopt braucht --since und --until")
    adopt(bs)


def adopt(bs, recollect=False):
    state = FE.jload(FE.OUT / "state.json", {"batches": [], "tries": {}})
    have = {x["id"] for x in state.get("batches", [])}
    ents = FE.load_entities(); by_key = {FE.key(i): i for i in ents}
    added = rich = 0
    for b in bs:
        if b["id"] in have:
            continue
        rs = results(b) if b.get("processing_status") == "ended" else []
        cids = [r["custom_id"] for r in rs]
        if rs and not all(c.split("_")[0] in ("w", "t") and len(c.split("_")) >= 3 for c in cids):
            print(b["id"], "nicht von fill_entities - uebersprungen"); continue
        kind = "write" if cids and cids[0].startswith("w_") else "translate"
        model = next((r["result"]["message"].get("model") for r in rs if r["result"]["type"] == "succeeded"), "") or (FE.MODEL if kind == "write" else FE.TMODEL)
        for r in rs:
            p = r["custom_id"].split("_")
            if p[0] != "w" or r["result"]["type"] != "succeeded":
                continue
            eid = by_key.get(p[-2])
            text = "".join(x.get("text", "") for x in r["result"]["message"]["content"] if x.get("type") == "text")
            out = FE.parse_json(text)
            if eid and isinstance(out, dict) and len(str(out.get("long") or "")) >= RICH_GUESS:
                state.setdefault("rich", {})[eid] = True; rich += 1
        n = sum((b.get("request_counts") or {}).values())
        state.setdefault("batches", []).append({"id": b["id"], "kind": kind, "model": model, "n": n, "est_usd": 0.0, "month": (b.get("created_at") or "")[:7] or FE.month_key(),
                                                "ids": sorted(FE.cid_key(c) for c in cids), "created": (b.get("created_at") or "")[:19], "recovered": True,
                                                **({"recollect": True} if recollect else {})})
        added += 1
    FE.jsave(FE.OUT / "state.json", state)
    print(f"uebernommen: {added} Batches, Langtext-Kennzeichen {rich}")


if __name__ == "__main__":
    main()
