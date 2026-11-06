#!/usr/bin/env python3
"""Interne Links ohne Weiterleitung (Wunsch Mirko 6.11.2026, blockierend im Seitenbau): jede Adresse der eigenen Seite in href (Links, Menues,
canonical, hreflang), JSON-LD, Sitemaps und Feeds des gebauten Stands (docs/ + r2out/) muss direkt eine Seite treffen. Grundlage ist der
Python-Nachbau des Site-Workers (site_links.py, dieselbe Fallliste wie sitewrk/test/legacy.test.mjs). generate_site.py setzt solche Links am
Ende des Baus selbst auf das Ziel (site_links.fix_tree); bleibt danach eine Weiterleitung, Schleife oder zu lange Kette uebrig, Exit 1.
Links auf Adressen, die es im Bau nicht gibt (404, Ziel fehlt), meldet check_links.py (nicht blockierend) - hier nur als Hinweis gezaehlt.
Aufruf: python check_redirect_links.py [docs] [r2out]"""
import sys
from pathlib import Path

import site_links as SL

ROOT = Path(__file__).parent


def main(argv):
    docs = Path(argv[1]) if len(argv) > 1 else ROOT / "docs"
    r2 = Path(argv[2]) if len(argv) > 2 else ROOT / "r2out"
    if not (docs / "index.html").exists():
        print(f"{docs}/index.html fehlt - kein Bau zum Pruefen"); return 1
    res = SL.Resolver.from_build(docs, r2)
    st, bad = SL.verify_tree([docs, r2], res)
    print("Interne Links (href, JSON-LD, Sitemaps, Feeds):", ", ".join(f"{k} {v}" for k, v in st.n.items()))
    for page, href, s, tgt in bad[:60]:
        print(f"FEHLER {s}: {page} -> {href} (Ziel {tgt})")
    if bad:
        print(f"{len(bad)}{'+' if len(bad) >= 200 else ''} interne Links laufen ueber eine Weiterleitung, Schleife oder zu lange Kette"); return 1
    print("OK: kein interner Link laeuft ueber eine Weiterleitung")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
