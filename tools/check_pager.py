"""Prueft die Vor/Zurueck-Leiste (<nav class="pnav">) im gebauten Stand (docs/ und r2out/): Ziele vorhanden, gegenseitig
(A rel=next -> B heisst B rel=prev -> A), Abdeckung je Seitentyp. Aufruf: python tools/check_pager.py   (Exit-Code 1 bei Fehlern)"""
import re, sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIRS = [ROOT / "docs", ROOT / "r2out"]
BASE = "https://" + (ROOT / "domain.txt").read_text().strip() if (ROOT / "domain.txt").exists() else "https://www.m365.fm"
NAV = re.compile(r'<nav class="pnav"[^>]*>(.*?)</nav>', re.S)
CAN = re.compile(r'<link rel="canonical" href="([^"]+)"')
A = re.compile(r'<a class="(pv|nx)" rel="(prev|next)" href="([^"]+)">')
TYPES = [("Hauptshow-Folge", re.compile(r"^/show/episodes/[^/]+/$")), ("Show-Sprachfassung", re.compile(r"^/[a-z]{2}/show/episodes/[^/]+/$")),
         ("Blog-Artikel", re.compile(r"^(/[a-z]{2})?/community/u/[^/]+/blog/[^/]+/$")), ("Community-Podcast", re.compile(r"^(/[a-z]{2})?/community/podcast/[^/]+/$")),
         ("Community-Video", re.compile(r"^(/[a-z]{2})?/community/video/[^/]+/$")), ("Dub-Folge", re.compile(r"^/[a-z]{2}/[^/]+/$"))]
SKIP = re.compile(r"^/[a-z]{2}/(top|podcast|community|search|accessibility|updates|press|entity|glossary|c|tag|show|path|live)/$")


def kind(path):
    if SKIP.match(path): return None
    for n, rx in TYPES:
        if rx.match(path): return n
    return None


def main():
    pages, total, withnav, links, canon_ok, missing = {}, Counter(), Counter(), {}, set(), defaultdict(list)
    for d in DIRS:
        if not d.exists(): continue
        for f in d.rglob("index.html"):
            path = "/" + f.parent.relative_to(d).as_posix().strip(".") + "/"
            path = path.replace("//", "/")
            k = kind(path)
            if not k: continue
            h = f.read_text("utf-8", errors="replace")
            if 'name="robots" content="noindex' in h and k == "Dub-Folge": continue
            total[k] += 1; pages[path] = k
            c = CAN.search(h)
            if not c or c.group(1).replace(BASE, "") == path: canon_ok.add(path)   # Kopien mit fremder kanonischer Adresse: nur Ziele pruefen, nicht die Gegenseitigkeit
            m = NAV.search(h)
            if not m: missing[k].append(path)
            if m:
                withnav[k] += 1
                links[path] = {rel: href.replace(BASE, "") for _c, rel, href in A.findall(m.group(1))}
    err = []
    exists = lambda p: any((d / p.lstrip("/") / "index.html").exists() for d in DIRS)
    for p, l in links.items():
        for rel, tgt in l.items():
            if not tgt.startswith("/"): err.append(f"{p}: {rel} -> externe Adresse {tgt}"); continue
            if not exists(tgt): err.append(f"{p}: {rel} -> fehlt {tgt}"); continue
            back = links.get(tgt, {}).get("prev" if rel == "next" else "next")
            if p in canon_ok and tgt in canon_ok and back is not None and back != p and pages.get(tgt) == pages.get(p):
                err.append(f"{p}: {rel} -> {tgt}, dort zeigt {'prev' if rel == 'next' else 'next'} auf {back}")
    print("Vor/Zurueck je Seitentyp (Seiten mit Leiste / Seiten):")
    for n, _ in TYPES: print(f"  {n}: {withnav[n]} / {total[n]}")
    for n, _ in TYPES:
        if missing[n]: print(f"  ohne Leiste ({n}), Beispiele: {missing[n][:5]}")
    ends = Counter(pages[p] for p, l in links.items() if len(l) == 1)
    print("  davon nur eine Richtung (erste/letzte Seite einer Reihe):", dict(ends))
    for n, _ in TYPES:
        ex = next((p for p in links if pages[p] == n and len(links[p]) == 2), None)
        if ex: print(f"  Beispiel {n}: {ex} -> {links[ex]}")
    if err:
        print(f"FEHLER: {len(err)}"); [print("  " + e) for e in err[:40]]
        return 1
    print("ok: alle Ziele vorhanden, Richtungen gegenseitig")
    return 0


if __name__ == "__main__":
    sys.exit(main())
