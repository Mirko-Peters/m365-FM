#!/usr/bin/env python3
"""Prueft die gebauten Sitemaps (docs/sitemap.xml und die darin genannten Dateien): wohlgeformtes XML, jede Datei <= 50.000 URLs und
<= 50 MB, loc absolut auf der eigenen Domain, lastmod als Datum, keine doppelten URLs ueber alle Dateien, hreflang-Alternates mit
x-default genau bei englischer Fassung (T42), Index verweist nur auf vorhandene Dateien. Exit 1 bei Fehlern (blockierend im Seitenbau).
Seit 16.11.2026 liegen die Sitemaps der Sprachen ausser en/de nur im R2-Bucket (r2out/, site_size.r2_only; der Site-Worker liefert sie unter
derselben Adresse aus): gesucht wird in docs/, dann in r2out/ (Hinweis, wenn eine Datei nicht dort liegt, wohin site_size.r2_only sie legt).
Aufruf: python check_sitemaps.py [docs] [r2out]"""
import re, sys
import xml.etree.ElementTree as ET
from pathlib import Path

import site_size

ROOT = Path(__file__).parent
DOCS = ROOT / "docs"
R2OUT = None   # None: r2out/ neben DOCS
BASE = "https://" + ((ROOT / "domain.txt").read_text().strip() if (ROOT / "domain.txt").exists() else "www.m365.fm")
NS = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9", "x": "http://www.w3.org/1999/xhtml"}
DATE = re.compile(r"^\d{4}-\d{2}-\d{2}(T[0-9:+\-Z.]+)?$")


def locate(name, docs, r2):
    """Datei der Sitemap name: docs/ (GitHub Pages) oder r2out/ (R2-Bucket; der Site-Worker liefert sie nach dem 404 unter derselben Adresse).
    -> (Pfad oder None, Hinweis). Hinweis, wenn die Datei nicht dort liegt, wohin site_size.r2_only sie legt (ausgeliefert wird sie trotzdem)."""
    l = site_size.sitemap_lang(name)
    in_r2 = bool(l) and l not in site_size.PAGES_LANGS
    for f in (docs / name, r2 / name):
        if f.is_file():
            return f, ("" if (f.parent == r2) == in_r2 else f"{name} liegt in {'r2out/' if f.parent == r2 else 'docs/'}, erwartet in {'r2out/' if in_r2 else 'docs/'} (site_size.r2_only)")
    return None, ""


def main(argv=()):
    global DOCS
    if len(argv) > 1: DOCS = Path(argv[1])
    r2 = Path(argv[2]) if len(argv) > 2 else (R2OUT or DOCS.parent / "r2out")
    errs, seen, total, n_r2 = [], {}, 0, 0
    idx = DOCS / "sitemap.xml"
    if not idx.exists():
        print("docs/sitemap.xml fehlt"); return 1
    try:
        root = ET.parse(idx).getroot()
    except ET.ParseError as e:
        print("sitemap.xml nicht wohlgeformt:", e); return 1
    files = [el.text.strip() for el in root.findall("s:sitemap/s:loc", NS)]
    if not files: errs.append("Index ohne Einträge")
    for loc in files:
        if not loc.startswith(BASE + "/"): errs.append(f"Index: fremde URL {loc}")
        f, hint = locate(loc[len(BASE) + 1:], DOCS, r2)
        if f is None: errs.append(f"Index verweist auf fehlende Datei {loc.rsplit('/', 1)[-1]} (weder docs/ noch r2out/)"); continue
        if f.parent == r2 and not site_size.sitemap_lang(f.name):   # der Site-Worker liefert aus r2out/ nur sitemap-<l>-<typ>[-<n>].xml (SITEMAP_R2)
            errs.append(f"{f.name} liegt nur in r2out/, der Site-Worker liefert diesen Namen nicht aus (404)"); continue
        if hint: print("::warning::Sitemap " + hint)
        n_r2 += f.parent == r2
        if f.stat().st_size > 50 * 1024 * 1024: errs.append(f"{f.name}: größer als 50 MB")
        try:
            r = ET.parse(f).getroot()
        except ET.ParseError as e:
            errs.append(f"{f.name}: nicht wohlgeformt ({e})"); continue
        urls = r.findall("s:url", NS)
        if len(urls) > 50000: errs.append(f"{f.name}: {len(urls)} URLs (> 50.000)")
        total += len(urls)
        for u in urls:
            loc_el, lm = u.find("s:loc", NS), u.find("s:lastmod", NS)
            l = (loc_el.text or "").strip() if loc_el is not None else ""
            if not l.startswith(BASE + "/") and l != BASE + "/": errs.append(f"{f.name}: loc nicht absolut/eigene Domain: {l[:80]}")
            if lm is None or not DATE.match((lm.text or "").strip()): errs.append(f"{f.name}: lastmod fehlt/ungültig bei {l[:80]}")
            if l in seen: errs.append(f"doppelt: {l[:80]} in {seen[l]} und {f.name}")
            seen[l] = f.name
            alts = u.findall("x:link", NS)
            if alts:   # T42: x-default genau dann, wenn es eine englische Fassung gibt, und dann gleich dieser
                _en = [a.get("href") for a in alts if a.get("hreflang") == "en"]; _xd = [a.get("href") for a in alts if a.get("hreflang") == "x-default"]
                if _en and _xd != _en[:1]: errs.append(f"{f.name}: x-default fehlt oder ist nicht die englische Fassung bei {l[:80]}")
                if not _en and _xd: errs.append(f"{f.name}: x-default ohne englische Fassung bei {l[:80]}")
    for e in errs[:40]: print("FEHLER", e)
    print(f"{len(files)} Sitemap-Dateien ({n_r2} davon in r2out/), {total} URLs, {len(errs)} Fehler")
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
