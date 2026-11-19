"""Infografiken auf den Seiten (Kopfbild, 2-3 Infografiken im Text, og:image), erzeugt von tools/infographics.py.

Daten: data/infographics/<art>.json.gz  {slug: {"s": Quellhash, "<lang>": [[vorlage, hash, alt], ...]}} - Eintrag 0 ist das Kopfbild (1200x630), die uebrigen die Infografiken.
Freigabe: data/infographics_live.json  {"langs": ["en", ...], "kinds": ["entity", "blog", "episode"]}. Fehlt die Datei oder ist sie leer, tut jede Funktion hier nichts
und liefert den Eingabewert unveraendert zurueck - der Seitenbau ist dann Byte fuer Byte wie ohne dieses Modul. Notschalter: Datei leeren (oder Sprache/Art entfernen).
Das neue Kopfbild ersetzt das bisherige (erzeugtes SVG bzw. Folgen-Cover am Textanfang) und wird das Teilen-Bild (og:image, 1200x630, grosse Karte bei LinkedIn); die alten
Dateien bleiben im Bucket. Alle Bilder liegen auf img.m365.fm/ig/<art>/<slug>/<sprache>-<nr>-<hash>.webp (unveraenderlich, daher nie ein Cache-Leeren noetig)."""
import gzip, json, re
from html import escape
from pathlib import Path

D = Path(__file__).resolve().parent / "data"
PUBLIC = "https://img.m365.fm"
SIZES = {"flow": (1920, 1080), "compare": (1200, 1040), "ladder": (1200, 1800), "bigfact": (1200, 630), "hub": (1200, 1200)}   # wie tools/infographics/templates.mjs
_IDX, _LIVE = {}, []


def _jload(p, default):
    try:
        p = Path(p)
        return json.loads(gzip.open(p, "rt", encoding="utf-8").read() if p.suffix == ".gz" else p.read_text("utf-8"))
    except (OSError, ValueError):
        return default


def live():
    """-> (Sprachen, Arten) als Mengen; leer = nichts freigegeben."""
    if not _LIVE:
        d = _jload(D / "infographics_live.json", {})
        d = d if isinstance(d, dict) else {}
        _LIVE.append((frozenset(x for x in d.get("langs") or [] if isinstance(x, str)), frozenset(x for x in d.get("kinds") or [] if isinstance(x, str))))
    return _LIVE[0]


def reset():   # Tests
    _IDX.clear(); _LIVE.clear()


def _index(kind):
    if kind not in _IDX:
        _IDX[kind] = _jload(D / "infographics" / f"{kind}.json.gz", {}) or {}
    return _IDX[kind]


def get(kind, slug, lang):
    """-> [{u, w, h, a, t}, ...] (Kopfbild zuerst) oder None (nicht freigegeben/keine Bilder/unvollstaendig)."""
    langs, kinds = live()
    if lang not in langs or kind not in kinds: return None
    ent = (_index(kind).get(slug) or {}).get(lang)
    if not isinstance(ent, list) or len(ent) < 3 or ent[0][0] != "bigfact": return None   # Kopfbild und mindestens zwei Infografiken, sonst gar nichts
    out = []
    for i, (t, h, a) in enumerate(ent):
        if t not in SIZES: return None
        w, hh = SIZES[t]
        out.append({"u": f"{PUBLIC}/ig/{kind}/{slug}/{lang}-{i}-{h}.webp", "w": w, "h": hh, "a": a, "t": t})
    return out


LICENSE = "https://creativecommons.org/licenses/by/4.0/"   # CC BY 4.0: Nutzung mit Namensnennung (Mirko, 19.11.2026)


def image_ld(base, kind, slug, lang, page_url):
    """ImageObject-Knoten fuer Kopfbild und Infografiken dieser Seite (Google Bilder: Urheber, Credit, Copyright, Lizenz -> Abzeichen "Lizenzierbar"); [] ohne Freigabe.
    Nur fuer eigene Bilder; Google verlangt contentUrl und mindestens eines von creator/creditText/copyrightNotice/license."""
    g = get(kind, slug, lang)
    return [{"@context": "https://schema.org", "@type": "ImageObject", "@id": f"{page_url}#ig{i}", "contentUrl": im["u"], "url": im["u"], "width": im["w"], "height": im["h"],
             "caption": im["a"], "inLanguage": lang, "creator": {"@type": "Organization", "@id": f"{base}/#org", "name": "M365.FM", "url": f"{base}/"},
             "creditText": "M365.FM", "copyrightNotice": "© M365.FM", "license": LICENSE,
             "acquireLicensePage": f"{base}/{'de/bildlizenz' if lang == 'de' else 'image-license'}/"} for i, im in enumerate(g or [])]


def _fig(im, hero=False):
    attrs = 'fetchpriority="high" decoding="async"' if hero else 'loading="lazy" decoding="async"'
    return (f'<figure class="ig-fig ig-{im["t"]}" style="margin:1.2em 0"><img src="{escape(im["u"], quote=True)}" alt="{escape(im["a"], quote=True)}" width="{im["w"]}" height="{im["h"]}" {attrs} '
            f'style="display:block;width:100%;max-width:{min(im["w"], 1200)}px;height:auto;border-radius:14px;margin:0 auto"></figure>')


def hero_figure(kind, slug, lang):
    """Kopfbild als <figure> oder ''."""
    g = get(kind, slug, lang)
    return _fig(g[0], True) if g else ""


def og(kind, slug, lang):
    """(url, breite, hoehe) fuer page(og_image=...) oder None."""
    g = get(kind, slug, lang)
    return (g[0]["u"][:-5] + ".jpg", g[0]["w"], g[0]["h"]) if g else None   # Teilen-Bild als JPEG (LinkedIn/Facebook), Seitenbild bleibt WebP


def page_kw(kind, slug, lang):
    """Zusatzargumente fuer generate_site.page: Teilen-Bild = Kopfbild (1200x630) samt Teilen-Schaltflaechen; {} ohne Freigabe."""
    o = og(kind, slug, lang)
    return {"og_image": o, "og_share": True} if o else {}


_HERO_AT_START = re.compile(r"^\s*<figure\b[^>]*>.*?</figure>", re.S | re.I)
_BLOCK = re.compile(r"<(/?)(ul|ol|table|figure|blockquote|details|pre|dl)\b[^>]*>|</p>", re.I)


def replace_hero(html):
    """Altes Titelbild am Textanfang (erzeugtes SVG der Reihe en-fig oder Folgen-Cover 640x360 aus site_legacy_blog.hero_html) entfernen; sonst unveraendert."""
    m = _HERO_AT_START.match(html or "")
    if m and ('class="en-fig"' in m.group(0) or ('<figure style="margin:1em 0"><img ' in m.group(0) and 'width="640" height="360" fetchpriority="high"' in m.group(0) and "aspect-ratio:16/9" in m.group(0))):
        return html[m.end():]
    return html


def safe_breaks(html):
    """Stellen (Zeichenpositionen) nach einem </p> ausserhalb von Listen, Tabellen, Bildern, Zitaten usw."""
    depth, out = 0, []
    for m in _BLOCK.finditer(html):
        if m.group(0).lower() == "</p>":
            if depth == 0: out.append(m.end())
        elif m.group(1): depth = max(0, depth - 1)
        else: depth += 1
    return out


def inject(html, kind, slug, lang):
    """Infografiken (ohne Kopfbild) gleichmaessig im Text verteilen; zu wenige Absaetze: am Ende. Ohne Freigabe: html unveraendert."""
    g = get(kind, slug, lang)
    if not g: return html
    figs = [_fig(x) for x in g[1:]]
    pts = safe_breaks(html or "")
    n = len(figs)
    if len(pts) < n + 2:
        return (html or "") + "".join(figs)
    pos = [pts[min(len(pts) - 1, round(len(pts) * (i + 1) / (n + 1)) - 1)] for i in range(n)]
    out, last = [], 0
    for p, f in zip(pos, figs):
        out.append(html[last:p]); out.append(f); last = p
    out.append(html[last:])
    return "".join(out)


def apply_post(html, slug, lang, kind="blog"):
    """Blogbeitrag: altes Titelbild ersetzen, Kopfbild voranstellen, Infografiken verteilen -> (html, page_kw). Ohne Freigabe: (html, {})."""
    if not get(kind, slug, lang): return html, {}
    return hero_figure(kind, slug, lang) + inject(replace_hero(html), kind, slug, lang), page_kw(kind, slug, lang)
