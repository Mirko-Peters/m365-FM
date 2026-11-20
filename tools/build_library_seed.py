"""Baut worker/src/library_seed.json aus den Start-Ordnern der Bibliothek (data/library_seed*/ <art>.json); das Kennzeichen "reviewed" kommt je Ordner aus
data/library_seed_review.json. Aufruf: python tools/build_library_seed.py [--check]  (--check: nichts schreiben, Exit 1 wenn die Datei nicht aktuell ist)."""
import argparse, json, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
KINDS = ["prompt", "instructions", "agent", "skill", "plugin", "manifest", "copilotstudio", "flow", "powerapp", "kql", "dax", "excel", "graph", "powershell", "adaptivecard", "other"]
OUT = ROOT / "worker/src/library_seed.json"


def build():
    review = json.load(open(ROOT / "data/library_seed_review.json", encoding="utf-8"))
    items = []
    for d, ok in review.items():
        if d.startswith("_"): continue
        for k in KINDS:
            f = ROOT / d / f"{k}.json"
            if not f.exists(): continue
            for it in json.load(open(f, encoding="utf-8")):
                items.append({"kind": it["kind"], "title": it["title"], "summary": it["summary"], "lang": it.get("lang", "en"), "body": it["body"],
                              "link": it.get("link", ""), "topics": it["topics"], "reviewed": bool(ok)})
    return json.dumps(items, ensure_ascii=False, separators=(",", ":")) + "\n"


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--check", action="store_true"); a = ap.parse_args()
    new = build()
    if a.check:
        if not OUT.exists() or OUT.read_text(encoding="utf-8") != new: print("worker/src/library_seed.json ist nicht aktuell: python tools/build_library_seed.py"); sys.exit(1)
        print("library_seed.json aktuell"); return
    OUT.write_text(new, encoding="utf-8"); print(f"{len(json.loads(new))} Eintraege nach {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
