#!/usr/bin/env python3
"""Oberbegriff und Art (kind) fuer Begriffe ohne Oberbegriff per Haiku vorschlagen lassen (ontology.py apply_suggestions).

  python tools/ontology_ai.py plan             Anzahl, Kosten (Schaetzung), nichts wird gesendet
  python tools/ontology_ai.py run [--limit N]  Vorschlaege holen -> data/ontology_suggestions.json; sichere (confidence high, formal geprueft) kommen in data/entities.json

Nur von Hand (Workflow ontology-ai.yml), mit Haiku-Tagesbudget (ai_gateway.check_budget, Job "ontology_ai"). Nichts wird geloescht; Eintraege mit Oberbegriff bleiben unberuehrt;
unsichere Vorschlaege bleiben nur in der Vorschlagsdatei (status "review") fuer Mirko/den Dev-Chef."""
import json, os, re, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import ontology as ONT  # noqa: E402
from ai_gateway import anthropic_request, check_budget, estimated_eur, report_usage, thinking_off, urlopen, usage_tokens  # noqa: E402

ENT = ROOT / "data" / "entities.json"
SUG = ROOT / "data" / "ontology_suggestions.json"
MODEL = os.environ.get("ONTOLOGY_MODEL", "claude-haiku-5-5")
JOB = "ontology_ai"
PER_CALL = 40
SYSTEM = (
    "You organise the concept hierarchy of a Microsoft ecosystem glossary. For every given concept choose (1) 'broader': the id of the single best parent from the candidate list "
    "(a product, platform or broader concept the concept belongs to or is a more specific case of), or null if no candidate fits well; (2) 'kind': one of "
    + ", ".join(ONT.KINDS) + "; (3) 'confidence': 'high' only if a Microsoft/IT expert would agree at once, else 'low'. "
    "Never invent ids; never use the concept's own id. Answer with a JSON array only: [{\"id\":...,\"broader\":...,\"kind\":...,\"confidence\":...}]."
)


def todo(ents):
    return [e for e in ents if e.get("type") == "concept" and not ONT.parents_of(e) and not e.get("outdated") and not e.get("replaced_by")]


def cand_text(ents):
    return "\n".join(f"{e['id']}|{e['name']}" for e in ONT.candidates(ents))


def ask(batch, ctext):
    body = {"model": MODEL, "max_tokens": 4000, **thinking_off(MODEL), "system": SYSTEM + "\n\nCandidate parents (id|name):\n" + ctext,
            "messages": [{"role": "user", "content": json.dumps([{"id": e["id"], "name": e["name"], "desc": (e["desc"].get("en") or "")[:200]} for e in batch], ensure_ascii=False)}]}
    req = anthropic_request("/v1/messages", body, job=JOB, model=MODEL, api_key=os.environ["ANTHROPIC_API_KEY"])
    with urlopen(req, timeout=180) as r:
        d = json.loads(r.read().decode())
    tin, tout, cr, cw = usage_tokens(d.get("usage"))
    report_usage(JOB, MODEL, tin, tout, "run", cache_read=cr, cache_write=cw)
    txt = "".join(b.get("text", "") for b in d.get("content", []) if b.get("type") == "text")
    m = re.search(r"\[.*\]", txt, re.S)
    return json.loads(m.group(0)) if m else []


def main(argv):
    mode = argv[0] if argv else "plan"
    limit = int(argv[argv.index("--limit") + 1]) if "--limit" in argv else 0
    ents = json.loads(ENT.read_text("utf-8"))
    items = todo(ents)
    old = {s["id"]: s for s in (json.loads(SUG.read_text("utf-8")) if SUG.exists() else [])}
    items = [e for e in items if e["id"] not in old]   # schon gefragt: nie ein zweites Mal bezahlen
    if limit:
        items = items[:limit]
    ctext = cand_text(ents)
    calls = -(-len(items) // PER_CALL)
    tin = calls * (len(ctext) // 3 + 400) + len(items) * 120
    tout = len(items) * 45
    eur = estimated_eur(tin, tout)
    print(f"Begriffe ohne Oberbegriff, noch nicht gefragt: {len(items)}; Aufrufe {calls}; geschaetzt {tin} Eingabe-/{tout} Ausgabe-Token = ca. {eur:.2f} EUR ({MODEL})")
    if mode != "run" or not items:
        return 0
    if not check_budget(JOB, MODEL, eur):
        return 0
    got = []
    for i in range(0, len(items), PER_CALL):
        batch = items[i:i + PER_CALL]
        try:
            res = ask(batch, ctext)
        except Exception as ex:   # bezahlte Ergebnisse frueherer Aufrufe bleiben erhalten
            print(f"::warning::Aufruf {i // PER_CALL + 1} fehlgeschlagen: {type(ex).__name__}"); break
        ids = {e["id"] for e in batch}
        got += [dict(x, status="review") for x in res if isinstance(x, dict) and x.get("id") in ids]
        time.sleep(1)
    done, skipped = ONT.apply_suggestions(ents, got)
    applied = {i for i, _ in done}
    for s in got:
        s["status"] = "angewendet" if s["id"] in applied else "review"
    SUG.write_text(json.dumps(sorted([*old.values(), *got], key=lambda s: s["id"]), ensure_ascii=False, indent=1) + "\n", "utf-8")
    ENT.write_text(json.dumps(ents, ensure_ascii=False, indent=1), "utf-8")   # ohne Umbruch am Ende (Dateiformat-Test)
    print(f"Vorschlaege {len(got)}; eingetragen {len(done)}; zur Ansicht {len(got) - len(done)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
