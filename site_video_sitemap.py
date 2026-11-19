"""Video-Sitemaps: sitemap-<sprache>-video[-<n>].xml (Google-Videoerweiterung, Namespace video:), getrennt von den normalen Sitemaps.

Eingabe: die Sitemap-Liste des Seitenbaus (url, lastmod, alternates) und die gebauten Seiten (docs/, r2out/). Jede indexierbare Seite, deren JSON-LD ein
VideoObject mit embedUrl, Titel, Beschreibung und Vorschaubild enthaelt (Folgenseiten mit Video, Creator-Videos), bekommt einen Eintrag mit
video:thumbnail_loc, video:title (hoechstens 100 Zeichen), video:description (hoechstens 2048), video:player_loc (embedUrl, https), video:publication_date,
video:duration (Sekunden, wenn das JSON-LD eine ISO-8601-Dauer hat) und video:family_friendly. content_loc gibt es nicht: contentUrl ist die YouTube-Seite,
keine Mediendatei (Google verlangt dort die Datei selbst). Vorschaubild: das Seitenbild (og:image), wenn es auf img.m365.fm liegt (Projektregel: Bilder aus
dem eigenen R2-Bucket), sonst das thumbnailUrl des VideoObject. Jede Seite steht nur mit ihrer eigenen URL darin (loc wie in der normalen Sitemap).
Gruppiert wird je Sprache (classify wie bei den normalen Sitemaps); Namen passen zur Regel sitemap-<l>-<name>.xml (site_size.SITEMAP_RX), daher liegen
die Dateien der Sprachen ausser en/de automatisch im R2-Bucket. Eine Datei bleibt unter 20.000 URLs und etwa 40 MB.
Notschalter: Umgebungsvariable VIDEO_SITEMAP=0 (dann entstehen keine Video-Sitemaps und der Index bleibt wie vorher)."""
import json, os, re
from html import escape, unescape
from urllib.parse import urljoin, urlsplit

import site_sitemaps as SMAP

NS_VIDEO = "http://www.google.com/schemas/sitemap-video/1.1"
MAX_URLS = 20000
MAX_BYTES = 40 * 1024 * 1024
MAX_TITLE, MAX_DESC = 100, 2048
IMG_HOST = "img.m365.fm"

_LD = re.compile(r'<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', re.S | re.I)
_OG = re.compile(r'<meta\b[^>]*?property=["\']og:image["\'][^>]*?content=["\']([^"\']+)["\']|<meta\b[^>]*?content=["\']([^"\']+)["\'][^>]*?property=["\']og:image["\']', re.I | re.S)
_DUR = re.compile(r"^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$")
_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}(T[0-9:+\-Z.]+)?$")


def enabled():
    return os.environ.get("VIDEO_SITEMAP", "1") != "0"


def _nodes(data):
    """Alle Knoten eines JSON-LD-Blocks (Liste, Einzelknoten, @graph)."""
    if isinstance(data, list):
        for x in data: yield from _nodes(x)
    elif isinstance(data, dict):
        yield data
        if isinstance(data.get("@graph"), list):
            for x in data["@graph"]: yield from _nodes(x)


def _is_video(n):
    t = n.get("@type")
    return t == "VideoObject" or (isinstance(t, list) and "VideoObject" in t)


def _first(v):
    if isinstance(v, list): v = v[0] if v else ""
    if isinstance(v, dict): v = v.get("url") or ""
    return (v or "").strip() if isinstance(v, str) else ""


def _text(s, limit):
    s = re.sub(r"\s+", " ", unescape(s or "")).strip()
    if len(s) <= limit: return s
    cut = s[:limit - 1].rsplit(" ", 1)[0] or s[:limit - 1]
    return cut.rstrip(" ,;:-") + "…"


def seconds(d):
    """ISO-8601-Dauer (PT1H2M3S) -> ganze Sekunden (1..28800) oder None."""
    m = _DUR.match((d or "").strip()) if isinstance(d, str) else None
    if not m or not any(m.groups()): return None
    day, h, mi, s = m.groups()
    t = int(day or 0) * 86400 + int(h or 0) * 3600 + int(mi or 0) * 60 + int(float(s or 0))
    return t if 1 <= t <= 28800 else None


def extract(page_url, html):
    """Daten des ersten brauchbaren VideoObject einer Seite -> dict (title, desc, thumb, player, date, dur, family) oder None."""
    og = ""
    mo = _OG.search(html or "")
    if mo: og = urljoin(page_url, unescape(mo.group(1) or mo.group(2) or "").strip())
    for blk in _LD.finditer(html or ""):
        try: data = json.loads(blk.group(1))
        except ValueError: continue
        for n in _nodes(data):
            if not _is_video(n): continue
            title, desc = _text(n.get("name"), MAX_TITLE), _text(n.get("description"), MAX_DESC)
            player = _first(n.get("embedUrl"))
            tu = _first(n.get("thumbnailUrl"))
            thumb = og if urlsplit(og).netloc == IMG_HOST else (urljoin(page_url, tu) if tu else "")   # ohne Vorschaubild kein Eintrag (nie die Seitenadresse einsetzen)
            date = str(n.get("uploadDate") or "").strip()
            if not (title and desc and player.startswith("https://") and thumb.startswith("https://") and _DATE.match(date)): continue
            return dict(title=title, desc=desc, thumb=thumb, player=player, date=date, dur=seconds(n.get("duration")), family=n.get("isFamilyFriendly") is True)
    return None


def collect(sitemap, roots, base, langs):
    """-> {sprache: [(url, lastmod, video-dict)]} fuer alle Sitemap-URLs mit brauchbarem VideoObject."""
    groups, seen = {}, set()
    for u, lm, _alts in sitemap:
        if u in seen or not u.startswith(base): continue
        seen.add(u)
        rel = urlsplit(u).path.lstrip("/")
        if rel.endswith(".html"): continue
        f = next((r / rel / "index.html" for r in roots if (r / rel / "index.html").is_file()), None)
        if not f: continue
        try: v = extract(u, f.read_text("utf-8", errors="replace"))
        except Exception: v = None
        if not v: continue
        lang, _typ = SMAP.classify(urlsplit(u).path, langs)
        groups.setdefault(lang, []).append((u, (lm or "")[:10], v))
    return groups


def _entry(u, lm, v):
    x = [f"<url><loc>{escape(u, quote=False)}</loc>" + (f"<lastmod>{lm}</lastmod>" if lm else ""), "<video:video>",
         f"<video:thumbnail_loc>{escape(v['thumb'], quote=False)}</video:thumbnail_loc>",
         f"<video:title>{escape(v['title'], quote=False)}</video:title>",
         f"<video:description>{escape(v['desc'], quote=False)}</video:description>",
         f"<video:player_loc>{escape(v['player'], quote=False)}</video:player_loc>"]
    if v["dur"]: x.append(f"<video:duration>{v['dur']}</video:duration>")
    x.append(f"<video:publication_date>{v['date']}</video:publication_date>")
    if v["family"]: x.append("<video:family_friendly>yes</video:family_friendly>")
    x.append("</video:video></url>")
    return "".join(x)


def _wrap(entries):
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="' + NS_VIDEO + '">\n'
            + "\n".join(entries) + "\n</urlset>")


def build(sitemap, roots, base, langs, write, today):
    """Schreibt die Video-Sitemaps (write(name, text)) -> [(dateiname, lastmod, anzahl_urls)] fuer den Index; [] bei Notschalter."""
    if not enabled(): return []
    sitemap = list(sitemap)   # wird zweimal gelesen (collect, effective_lastmods)
    groups = collect(sitemap, roots, base, langs)
    eff = SMAP.effective_lastmods(sitemap, langs, today)   # dasselbe lastmod wie in den normalen Sitemaps
    groups = {l: [(u, eff.get(u) or lm, v) for u, lm, v in g] for l, g in groups.items()}
    files = []
    for lang in sorted(groups, key=lambda l: (l != "en", l)):
        ents = sorted(groups[lang], key=lambda e: (e[1], e[0]), reverse=True)
        parts, cur, size = [], [], 0
        for u, lm, v in ents:
            x = _entry(u, lm or today, v)
            bx = len(x.encode("utf-8")) + 1
            if cur and (len(cur) >= MAX_URLS or size + bx > MAX_BYTES):
                parts.append(cur); cur, size = [], 0
            cur.append((u, lm or today, x)); size += bx
        if cur: parts.append(cur)
        for n, part in enumerate(parts):
            name = f"sitemap-{lang}-video{'' if n == 0 else '-' + str(n + 1)}.xml"
            write(name, _wrap([p[2] for p in part]))
            files.append((name, max(p[1] for p in part), len(part)))
    return files
