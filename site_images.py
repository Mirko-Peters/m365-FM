"""Bild-Sitemaps: sitemap-<sprache>-images[-<n>].xml (Google-Bilderweiterung, Namespace image:), getrennt von den normalen Sitemaps.

Eingabe: die Sitemap-Liste des Seitenbaus (url, lastmod, alternates) und die gebauten Seiten (docs/, r2out/). Je indexierbarer Seite werden die Bilder
des Hauptinhalts (<main>, ohne Seitenleiste <aside>, Kopf und Fuss) gesammelt - Kopfbild, Infografiken, Cover, Bilder im Text; egal auf welchem Host
(img.m365.fm, CloudFront ...). Ausgelassen werden: SVG/ICO/data:, Bilder aus /assets/, dekorative (aria-hidden, role=presentation) und kleine
(Breite < 200 oder Hoehe < 120 laut Attribut, z. B. Avatare, Vorschaubilder; ausser dem Hauptbild mit fetchpriority=high und Alt-Text, etwa dem Folgencover,
das nur 160 px gross angezeigt wird), mehr als 20 je Seite. Spreaker-Cover stehen in der groessten Variante darin (site_spreaker_img.variant). Jede Seite steht nur mit ihrer eigenen URL darin
(loc wie in der normalen Sitemap); Titel/Beschreibung gibt es nicht, Google wertet sie seit 2022 nicht mehr aus (der Alt-Text steht im HTML).
Gruppiert wird je Sprache (classify wie bei den normalen Sitemaps), Namen passen zur Regel sitemap-<l>-<name>.xml (site_size.SITEMAP_RX), daher
liegen die Dateien der Sprachen ausser en/de automatisch im R2-Bucket. Eine Datei bleibt unter 20.000 URLs und etwa 40 MB (Grenze 50 MB).
Notschalter: Umgebungsvariable IMAGE_SITEMAP=0 (dann entstehen keine Bild-Sitemaps und der Index bleibt wie vorher)."""
import os, re
from html import escape, unescape
from urllib.parse import urljoin, urlsplit

import site_sitemaps as SMAP
import site_spreaker_img as SPI

NS_IMAGE = "http://www.google.com/schemas/sitemap-image/1.1"
MAX_PER_PAGE = 20
MAX_URLS = 20000
MAX_BYTES = 40 * 1024 * 1024
MIN_W, MIN_H = 200, 120

_MAIN = re.compile(r"<main\b[^>]*>(.*?)</main>", re.S | re.I)
_DROP = re.compile(r"<(aside|noscript|script|style|template)\b[^>]*>.*?</\1>", re.S | re.I)
_IMG = re.compile(r"<img\b([^>]*?)/?>", re.I | re.S)
_ATTR = re.compile(r"""([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))""")


def enabled():
    return os.environ.get("IMAGE_SITEMAP", "1") != "0"


def _attrs(s):
    return {m.group(1).lower(): unescape(m.group(2) if m.group(2) is not None else m.group(3) if m.group(3) is not None else m.group(4) or "") for m in _ATTR.finditer(s)}


def _num(v):
    try: return int(float(str(v).strip().rstrip("px")))
    except (TypeError, ValueError): return None


def extract(page_url, html, base):
    """Bilder des Hauptinhalts einer Seite -> Liste absoluter https-Adressen (Reihenfolge wie im Text, ohne Doppelte)."""
    m = _MAIN.search(html or "")
    if not m: return []
    body = _DROP.sub("", m.group(1))
    out, seen = [], set()
    for t in _IMG.finditer(body):
        a = _attrs(t.group(1))
        src = (a.get("src") or "").strip()
        if not src or src.startswith("data:"): continue
        if a.get("aria-hidden") == "true" or a.get("role") in ("presentation", "none"): continue
        w, h = _num(a.get("width")), _num(a.get("height"))
        lead = (a.get("fetchpriority") or "").lower() == "high" and bool((a.get("alt") or "").strip())   # Hauptbild (Folgencover, Kopfbild) gilt unabhaengig von der Anzeigegroesse; erste Listenkarten (alt="") nicht
        if not lead and ((w is not None and w < MIN_W) or (h is not None and h < MIN_H)): continue
        u = urljoin(page_url, src)
        if SPI.is_spreaker(u): u = SPI.variant(u, SPI.SIZES[-1])   # kleine Anzeige-Variante -> groesste vorhandene
        sp = urlsplit(u)
        if sp.scheme != "https" or not sp.netloc: continue
        low = sp.path.lower()
        if low.endswith((".svg", ".ico")) or u.startswith(base + "/assets/"): continue
        if u in seen: continue
        seen.add(u); out.append(u)
        if len(out) >= MAX_PER_PAGE: break
    return out


def collect(sitemap, roots, base, langs):
    """-> {sprache: [(url, lastmod, [bilder])]} fuer alle Sitemap-URLs mit mindestens einem Bild."""
    groups, seen = {}, set()
    for u, lm, _alts in sitemap:
        if u in seen or not u.startswith(base): continue
        seen.add(u)
        rel = urlsplit(u).path.lstrip("/")
        if rel.endswith(".html"): continue
        f = next((r / rel / "index.html" for r in roots if (r / rel / "index.html").is_file()), None)
        if not f: continue
        try: imgs = extract(u, f.read_text("utf-8", errors="replace"), base)
        except Exception: imgs = []
        if not imgs: continue
        lang, _typ = SMAP.classify(urlsplit(u).path, langs)
        groups.setdefault(lang, []).append((u, (lm or "")[:10], imgs))
    return groups


def _entry(u, lm, imgs):
    return (f"<url><loc>{escape(u, quote=False)}</loc>" + (f"<lastmod>{lm}</lastmod>" if lm else "") +
            "".join(f"<image:image><image:loc>{escape(i, quote=False)}</image:loc></image:image>" for i in imgs) + "</url>")


def _wrap(entries):
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="' + NS_IMAGE + '">\n'
            + "\n".join(entries) + "\n</urlset>")


def build(sitemap, roots, base, langs, write, today):
    """Schreibt die Bild-Sitemaps (write(name, text)) -> [(dateiname, lastmod, anzahl_urls)] fuer den Index; [] bei Notschalter."""
    if not enabled(): return []
    groups = collect(sitemap, roots, base, langs)
    eff = SMAP.effective_lastmods(sitemap, langs, today)   # dasselbe lastmod wie in den normalen Sitemaps (Hubs: juengster Inhalt)
    groups = {l: [(u, eff.get(u) or lm, imgs) for u, lm, imgs in g] for l, g in groups.items()}
    files = []
    for lang in sorted(groups, key=lambda l: (l != "en", l)):
        ents = sorted(groups[lang], key=lambda e: (e[1], e[0]), reverse=True)
        parts, cur, size = [], [], 0
        for u, lm, imgs in ents:
            x = _entry(u, lm or today, imgs)
            bx = len(x.encode("utf-8")) + 1
            if cur and (len(cur) >= MAX_URLS or size + bx > MAX_BYTES):
                parts.append(cur); cur, size = [], 0
            cur.append((u, lm or today, x)); size += bx
        if cur: parts.append(cur)
        for n, part in enumerate(parts):
            name = f"sitemap-{lang}-images{'' if n == 0 else '-' + str(n + 1)}.xml"
            write(name, _wrap([p[2] for p in part]))
            files.append((name, max(p[1] for p in part), len(part)))
    return files
