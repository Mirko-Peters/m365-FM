#!/usr/bin/env python3
"""Prueft das erzeugte HTML (docs/, dazu r2out/ nur mit Hinweisen) auf Mojibake (Ticket T5): "ÔÇ" (CP850) und "â€" (CP1252) sind Fehler (Exit 1); das Ersatzzeichen U+FFFD
und "Ã"-Folgen werden gezaehlt und mit den haeufigsten Dateien gemeldet (Hinweis, meist aus KI-Uebersetzungen; Liste fuer die Neuuebersetzung)."""
import re, sys
from collections import Counter
from pathlib import Path

DOCS = Path(__file__).parent / "docs"
HARD = re.compile("ÔÇ|â€")
SOFT = re.compile("�|Ã[\u0080-ÿ]")
EXTERNAL = re.compile(r"^([a-z]{2}/)?community/feed/")


def main():
    hard, soft, r2, n = Counter(), Counter(), Counter(), 0
    # r2out/ (Seiten nur im R2-Bucket, seit 11.11.2026 alle Sprachseiten ausser en/de) wird mitgeprueft, Treffer dort nur als Hinweis:
    # die schon vorher dort liegenden KI-Sprachfassungen waren nie Teil der blockierenden Pruefung
    for base, pre in ((DOCS, ""), (DOCS.parent / "r2out", "r2out/")):
        if not base.is_dir(): continue
        for p in base.rglob("*.html"):
            n += 1; rel = pre + str(p.relative_to(base))
            try:
                h = p.read_text("utf-8")
            except UnicodeDecodeError:
                (r2 if pre else hard)[rel] += 1; continue
            a, b = len(HARD.findall(h)), len(SOFT.findall(h))
            if a and (pre or EXTERNAL.search(rel)): (r2 if pre else soft)[rel] += a; a = 0   # Fremd-Feeds (Kreatoren-Feeds): Text stammt nicht von uns, Reparatur in site_fetch; nur Hinweis
            if a: hard[rel] += a
            if b: soft[rel] += b
    print(f"{n} Seiten geprueft: {sum(hard.values())} Mojibake-Treffer in {len(hard)} Dateien, {sum(soft.values())} U+FFFD/Ã-Treffer in {len(soft)} Dateien"
          + (f", {sum(r2.values())} Mojibake-Treffer in r2out/ ({len(r2)} Dateien, Hinweis)" if r2 else ""))
    for f, c in hard.most_common(20): print("FEHLER", c, "x", f)
    for f, c in r2.most_common(15): print("HINWEIS Mojibake", c, "x", f)
    for f, c in soft.most_common(15): print("HINWEIS", c, "x", f)
    return 1 if hard else 0


if __name__ == "__main__":
    sys.exit(main())
