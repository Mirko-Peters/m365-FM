#!/usr/bin/env python3
"""Oberbegriff und Art (kind) fuer Begriffe ohne Oberbegriff per Haiku vorschlagen lassen (ontology.py apply_suggestions).

  python tools/ontology_ai.py plan             Anzahl, Kosten (Schaetzung), nichts wird gesendet
  python tools/ontology_ai.py run [--limit N]  Vorschlaege holen -> data/ontology_suggestions.json; sichere (confidence high, formal geprueft) kommen in data/entities.json

Nur von Hand (Workflow ontology-ai.yml), mit Haiku-Tagesbudget (ai_gateway.check_budget, Job "ontology_ai"). Nichts wird geloescht; Eintraege mit Oberbegriff bleiben unberuehrt;
unsichere Vorschlaege bleiben nur in der Vorschlagsdatei (status "review") fuer Mirko/den Dev-Chef.
Ein Begriff kommt nie automatisch unter eine Kategorie (type category, z. B. ai-assistant): solche Vorschlaege bleiben immer "review"
(Kategorien sind fuer Produkte ueber instance_of; ein Begriff ist keine Art von Software-Kategorie).
Ein fehlgeschlagener Aufruf (Netz, kaputte Antwort) wird gezaehlt und uebersprungen; die anderen laufen weiter."""
import json, os, sys, time
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
            "messages": [{"role": "user", "content": json.dumps([{"id": e["id"], "name": e["name"], "desc": ((e.get("desc") or {}).get("en") or "")[:200]} for e in batch], ensure_ascii=False)}]}
    req = anthropic_request("/v1/messages", body, job=JOB, model=MODEL, api_key=os.environ["ANTHROPIC_API_KEY"])
    with urlopen(req, timeout=180) as r:
        d = json.loads(r.read().decode())
    tin, tout, cr, cw = usage_tokens(d.get("usage"))
    report_usage(JOB, MODEL, tin, tout, "run", cache_read=cr, cache_write=cw)
    txt = "".join(b.get("text", "") for b in d.get("content", []) if b.get("type") == "text")
    return txt, (tin, tout)


def parse_answer(txt):
    """Erstes vollstaendiges JSON-Array im Antworttext (Text davor/danach, ```json-Zaun oder ein zweites Array stoeren nicht).
    Wirft ValueError, wenn keins lesbar ist; der Aufruf zaehlt dann als Fehler."""
    dec = json.JSONDecoder()
    i = txt.find("[")
    while i >= 0:
        try:
            val, _ = dec.raw_decode(txt, i)
            if isinstance(val, list):
                return val
        except ValueError:
            pass
        i = txt.find("[", i + 1)
    raise ValueError("keine JSON-Liste in der Antwort")


def to_category(s, by):
    """True, wenn der Vorschlag einen Begriff unter eine Kategorie (type category) haengen wuerde."""
    p = by.get(s.get("broader") or "")
    return bool(p) and p.get("type") == "category"


def collect(items, ctext, ask_fn=None, pause=1.0):
    """Alle Bloecke abfragen (ask_fn(batch, ctext) -> (Antworttext, (Eingabe-, Ausgabe-Token))). Rueckgabe (Vorschlaege, Fehlerzahl, (Eingabe-, Ausgabe-Token tatsaechlich laut usage))."""
    ask_fn = ask_fn or ask
    got, errors, tin, tout = [], 0, 0, 0
    for i in range(0, len(items), PER_CALL):
        batch = items[i:i + PER_CALL]
        try:
            txt, (a, b) = ask_fn(batch, ctext)
            tin += a; tout += b   # bezahlt, auch wenn die Antwort danach unlesbar ist
            res = parse_answer(txt)
        except Exception as ex:   # bezahlte Ergebnisse frueherer Aufrufe bleiben erhalten; der naechste Block laeuft weiter
            errors += 1
            print(f"::warning::Aufruf {i // PER_CALL + 1} fehlgeschlagen: {type(ex).__name__}")
            continue
        ids = {e["id"] for e in batch}
        got += [dict(x, status="review") for x in res if isinstance(x, dict) and x.get("id") in ids]
        if pause:
            time.sleep(pause)
    return got, errors, (tin, tout)


def apply_safe(ents, got):
    """Sichere Vorschlaege eintragen (ontology.apply_suggestions), aber nie Begriff -> Kategorie; Status in got setzen.
    Rueckgabe: (eingetragen [(id, parent)], nur zur Ansicht wegen Kategorie [id])."""
    by = {e["id"]: e for e in ents}
    cat = {s["id"] for s in got if to_category(s, by)}
    feed = [dict(s, broader=None) if s["id"] in cat else s for s in got]   # Art (kind) darf trotzdem gesetzt werden
    done, _skipped = ONT.apply_suggestions(ents, feed)
    applied = {i for i, _ in done}
    for s in got:
        s["status"] = "angewendet" if s["id"] in applied else "review"
    return done, sorted(cat)


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
    got, errors, (rin, rout) = collect(items, ctext)
    done, cat = apply_safe(ents, got)
    SUG.write_text(json.dumps(sorted([*old.values(), *got], key=lambda s: s["id"]), ensure_ascii=False, indent=1) + "\n", "utf-8")
    ENT.write_text(json.dumps(ents, ensure_ascii=False, indent=1), "utf-8")   # ohne Umbruch am Ende (Dateiformat-Test)
    print(f"Vorschlaege {len(got)}; eingetragen {len(done)}; zur Ansicht {len(got) - len(done)} (davon Kategorie als Oberbegriff {len(cat)})")
    print(f"Tatsaechlich verbraucht: {rin} Eingabe-/{rout} Ausgabe-Token = ca. {estimated_eur(rin, rout):.2f} EUR (Schaetzung war {tin}/{tout})")
    print(f"Fehlgeschlagene Aufrufe: {errors} von {calls}")
    if errors:
        print(f"::warning::{errors} von {calls} Aufrufen fehlgeschlagen; die Begriffe daraus werden beim naechsten Lauf erneut gefragt")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
