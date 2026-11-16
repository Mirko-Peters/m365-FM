#!/usr/bin/env python3
"""Ontologie pruefen und Oberbegriffe per Regel eintragen (ontology.py).

  python tools/ontology_check.py            Bericht -> reports/ontology.md + reports/ontology.json; Exit 1 bei harten Fehlern (Zyklen, Verweise ins Leere, NEUE Dubletten/Alias-Kollisionen)
  python tools/ontology_check.py --apply    zusaetzlich: sichere Regeln (Klammer, Namens-Praefix) tragen fehlende Oberbegriffe in data/entities.json ein (nichts wird geloescht/ueberschrieben)
  python tools/ontology_check.py --baseline schreibt den heutigen Stand (bekannte Dubletten, Anteil ohne Oberbegriff) nach data/ontology_baseline.json

Gebraucht von: import-entities.yml (nach jedem Import neuer Eintraege, --apply), site.yml (Pruefung beim Seitenbau), tests/test_ontology.py.
Die Eintraege aus der Community-Datenbank (D1), Gaeste und Speaker bekommen dieselben Regeln beim Seitenbau im Speicher (site_learn.load_entities -> ontology.derive)."""
import json, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import ontology as ONT  # noqa: E402

ENT = ROOT / "data" / "entities.json"
BASE = ROOT / "data" / "ontology_baseline.json"
OUT = ROOT / "reports"


def load_all():
    ents = json.loads(ENT.read_text("utf-8"))
    seen = {e["id"] for e in ents}
    for f in ("guest_entities.json", "speaker_entities.json"):   # gleiche Quellen wie site_learn.load_entities (D1 braucht Netz und fehlt hier bewusst)
        p = ROOT / "data" / f
        if p.exists():
            for e in json.loads(p.read_text("utf-8")):
                if e["id"] not in seen:
                    seen.add(e["id"]); ents.append(e)
    return ents


def main(argv):
    apply, set_base = "--apply" in argv, "--baseline" in argv
    ents = json.loads(ENT.read_text("utf-8"))
    added = []
    if apply:
        added = ONT.apply_rules(ents)
        if added:
            ENT.write_text(json.dumps(ents, ensure_ascii=False, indent=1), "utf-8")   # ohne Umbruch am Ende: tests/test_entity_lean_aliases.py (Dateiformat)
    allents = load_all()
    if apply:   # die gerade geaenderten Basis-Eintraege in die Gesamtliste uebernehmen
        byid = {e["id"]: e for e in ents}
        allents = [byid.get(e["id"], e) for e in allents]
    m = ONT.audit(allents)
    base = json.loads(BASE.read_text("utf-8")) if BASE.exists() else {}
    bad, warn = ONT.problems(m, base), ONT.warnings(m, base)
    OUT.mkdir(exist_ok=True)
    stamp = time.strftime("%Y-%m-%d", time.gmtime())
    (OUT / "ontology.md").write_text(ONT.render_md(m, added, stamp) + ("\n## Warnungen\n" + "\n".join("- " + w for w in warn) + "\n" if warn else "") +
                                     ("\n## FEHLER\n" + "\n".join("- " + b for b in bad) + "\n" if bad else ""), "utf-8")
    (OUT / "ontology.json").write_text(json.dumps({"generated": stamp, **m}, ensure_ascii=False, indent=1) + "\n", "utf-8")
    if set_base:
        BASE.write_text(json.dumps({"duplicate_names": m["duplicate_names"], "alias_collisions": m["alias_collisions"], "no_parent_share": m["no_parent_share"]},
                                   ensure_ascii=False, indent=1) + "\n", "utf-8")
    print(f"Ontologie: {m['live']} Eintraege, ohne Oberbegriff {m['no_parent']}/{m['no_parent_of']} ({m['no_parent_share']:.0%}), verwaist {m['orphans']}, neu zugeordnet {len(added)}")
    for w in warn:
        print("WARNUNG:", w)
    for b in bad:
        print("FEHLER:", b)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
