#!/usr/bin/env python3
"""Prüft die gebaute Seite (docs/): kaputte interne Links, Sprachtreue der Verlinkung in Artikeln, verwaiste Folgenseiten, Artikel ohne interne Links.
Aufruf: python check_links.py [--all] [--out DATEI]   (Exit-Code 1 bei kaputten Links)
  --all        alle kaputten Links ausgeben (sonst nur die ersten 15)
  --out DATEI  alle kaputten Links als TSV schreiben (Ursache, Seite, Link), z. B. reports/broken_links.tsv
Am Ende steht immer die Zusammenfassung nach Ursache (Zielmuster), damit sich Altfaelle gruppiert beheben lassen."""
import re, sys
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).parent
DOCS = ROOT / "docs"
dom = (ROOT / "domain.txt").read_text().strip() if (ROOT / "domain.txt").exists() else ""
HOSTS = {dom} if dom else set()


SOFT = []   # Links, die der Worker nur auf eine Uebersicht leitet
R2OUT = ROOT / "r2out"   # uebersetzte Seiten liegen im R2-Bucket (Paket 20), der Site-Worker liefert sie unter derselben Adresse aus
_RD = DOCS / "show" / "redirects.json"
REDIR = __import__("json").loads(_RD.read_text("utf-8")) if _RD.exists() else {}   # alte Podpage-Adressen -> Ziel (301 im Site-Worker)
_LEP = re.compile(r"^/(de|es|fr|it|pt|nl|pl|id|ru|uk|ar|he|ja|ko)/show/episodes/([a-z0-9-]+)/?$")


def _exists(path):
    """Gibt es die Adresse so, wie der Site-Worker sie ausliefert? GitHub Pages, R2, Weiterleitungstabelle oder englisches Original."""
    for base in (DOCS, R2OUT):
        q = base / path.lstrip("/")
        if (q / "index.html").exists() if (path.endswith("/") or q.is_dir()) else q.exists(): return True
    p0 = path.rstrip("/") or "/"
    to = REDIR.get(p0) or REDIR.get(p0.lower())
    if to and to.rstrip("/") != p0: return _exists(to)
    m = _LEP.match(path)
    if m: return (DOCS / "show" / "episodes" / m.group(2) / "index.html").exists()
    m = re.match(r"^/m365-fm-podcast/([a-z0-9-]+)/?$", path)   # Regeln des Site-Workers (sitewrk/index.js legacyTarget)
    if m: return (DOCS / "show" / "episodes" / m.group(1) / "index.html").exists()
    if re.match(r"^/categories(/|$)", path): return True
    if re.match(r"^/(blog|videos|p)/", path): SOFT.append(path); return True   # 301 auf /show/: erreichbar, aber nur die Uebersicht
    return False


LANGS = {"de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"}


def _pattern(path):
    """Adresse ohne Sprachpraefix, Slugs durch * ersetzt: /pt/community/u/x/blog/y/ -> /community/u/*/blog/*/"""
    segs = [x for x in path.strip("/").split("/") if x]
    if segs and segs[0] in LANGS: segs = segs[1:]
    keep = {"community", "u", "c", "blog", "events", "show", "episodes", "guests", "entity", "glossary", "learn", "updates", "tag", "shows", "sponsor", "about", "search"}
    return "/" + "/".join(x if x in keep or i == 0 and len(segs) > 1 else "*" for i, x in enumerate(segs)) + ("/" if segs and "." not in segs[-1] else "")


def cause(src, href):
    """Ursache eines kaputten Links (fuer die Gruppierung): Art der fehlenden Datei bzw. Zielmuster."""
    u = urlparse(href); path = unquote(u.path or src)
    segs = [x for x in path.strip("/").split("/") if x]
    lang = segs[0] if segs and segs[0] in LANGS else ""
    rest = segs[1:] if lang else segs
    if path.endswith(".ics"):
        return "event.ics fehlt" + (" (Sprachfassung)" if lang else "")
    if len(rest) == 1 and "." not in rest[0]:
        return "einstufige Seite fehlt (alte Podpage-/Themenseite)" + (" in Sprachfassung" if lang else "")
    if rest and "." in rest[-1]:
        return "Datei fehlt: *." + rest[-1].rsplit(".", 1)[-1]
    return "Ziel fehlt: " + _pattern(path) + (" (Sprachfassung)" if lang else "")


def target(href, cur):
    u = urlparse(href)
    if u.scheme in ("http", "https"):
        if u.netloc not in HOSTS:
            return None
        path = u.path
    elif u.scheme or href.startswith(("#", "mailto:", "tel:", "javascript:")):
        return None
    else:
        path = u.path or cur
    path = unquote(path)
    p = DOCS / path.lstrip("/")
    return p / "index.html" if (path.endswith("/") or p.is_dir()) else p


pages = list(DOCS.rglob("index.html"))
broken, inbound, ep_links, wrong_lang = [], {}, {}, []
for p in pages:
    rel = "/" + str(p.relative_to(DOCS).parent).replace("\\", "/") + "/"
    html = p.read_text(encoding="utf-8")
    lang = rel.strip("/").split("/")[0]
    for m in re.finditer(r'<a [^>]*href="([^"]+)"', html):
        t = target(m.group(1), rel)
        if t is None:
            continue
        if not t.exists():
            u = urlparse(m.group(1)); pth = unquote(u.path or rel) if u.scheme in ("http", "https", "") else ""
            if pth and _exists(pth): continue   # per R2 oder 301 erreichbar
            broken.append((rel, m.group(1)))
        else:
            inbound[t] = inbound.get(t, 0) + 1
    for m in re.finditer(r'class="ilink" href="([^"]+)"', html):  # automatische Artikel-Links
        ep_links[rel] = ep_links.get(rel, 0) + 1
        if urlparse(m.group(1)).path.strip("/").split("/")[0] != lang:
            wrong_lang.append((rel, m.group(1)))

eps = [p for p in pages if len(p.relative_to(DOCS).parts) == 3 and p.relative_to(DOCS).parts[1] not in ("c", "tag")]
orph = [str(p.parent.relative_to(DOCS)) for p in eps if inbound.get(p, 0) < 2]
art = [str(p.parent.relative_to(DOCS)) for p in eps if "class=article" in p.read_text(encoding="utf-8")]
no_ilink = [a for a in art if ep_links.get("/" + a + "/", 0) == 0]
print(f"{len(pages)} Seiten geprüft | kaputte interne Links: {len(broken)} | Links in Artikeln in falscher Sprache: {len(wrong_lang)}")
print(f"Links, die nur per 301 auf eine Übersicht führen (/blog/…, /videos/… ohne Treffer): {len(SOFT)}")
print(f"Folgenseiten: {len(eps)} | mit <2 eingehenden Links: {len(orph)} | Artikel: {len(art)} | Artikel ohne automatische interne Links: {len(no_ilink)}")
ARGS = sys.argv[1:]
OUTF = ARGS[ARGS.index("--out") + 1] if "--out" in ARGS and ARGS.index("--out") + 1 < len(ARGS) else ""
rows = [(cause(r, h), r, h) for r, h in broken]
if OUTF:
    Path(OUTF).parent.mkdir(parents=True, exist_ok=True)
    Path(OUTF).write_text("ursache\tseite\tlink\n" + "".join(f"{c}\t{r}\t{h}\n" for c, r, h in sorted(rows)), encoding="utf-8")
    print(f"alle {len(rows)} kaputten Links -> {OUTF}")
for c, r, h in (sorted(rows) if "--all" in ARGS else rows[:15]):
    print("  KAPUTT", (r, h), "|", c)
if rows:   # Zusammenfassung nach Ursache: Anzahl, verschiedene Ziele, Quellseiten-Muster, haeufigste Ziele
    by = defaultdict(list)
    for c, r, h in rows: by[c].append((r, h))
    print(f"Kaputte Links nach Ursache ({len(by)} Gruppen):")
    for c, lst in sorted(by.items(), key=lambda x: -len(x[1])):
        tg = Counter(urlparse(h).path or h for _, h in lst); src = Counter(_pattern(r) for r, _ in lst)
        print(f"  {len(lst):5d}  {c}  | {len(tg)} Ziele | Quellen: " + ", ".join(f"{k} ({v})" for k, v in src.most_common(4)))
        for t, n in tg.most_common(8 if "--all" not in ARGS else 40):
            print(f"         {n:4d} x {t}  (z. B. auf {next(r for r, h in lst if (urlparse(h).path or h) == t)})")
for w in wrong_lang[:10]:
    print("  FALSCHE SPRACHE", w)
sys.exit(1 if broken or wrong_lang else 0)
