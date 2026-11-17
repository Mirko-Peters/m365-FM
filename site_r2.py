"""Bild-URLs auf den eigenen R2-Bucket (img.m365.fm) umschreiben, soweit data/r2_map.json sie kennt.

Dauerhaft fehlende fremde Bilder (data/r2_dead.json, von tools/r2_upload.py bei HTTP 404/410 eingetragen) gibt der Seitenbau nicht aus:
das <img> faellt weg (samt dadurch leerem <a>, <p> oder <figure>; eine Bildunterschrift bleibt als Text), in JSON-LD-Bildfeldern und
og:image/twitter:image steht statt dessen das Standardbild (DEFAULT_IMG). Der Text der Seite bleibt unveraendert."""
import json
import os
import re
from pathlib import Path

_D = Path(__file__).parent / "data"
_F = _D / "r2_map.json"
MAP = json.loads(_F.read_text(encoding="utf-8")) if _F.exists() else {}
_RX = re.compile("|".join(re.escape(u) for u in sorted(MAP, key=len, reverse=True))) if MAP else None


def load_dead(f=_D / "r2_dead.json"):
    """data/r2_dead.json -> {Original-URL (wie im HTML): {"date": "JJJJ-MM-TT", "status": 404}}; Schluessel mit '_' (Kommentare) zaehlen nicht."""
    try:
        d = json.loads(Path(f).read_text(encoding="utf-8")) if Path(f).exists() else {}
    except ValueError:
        return {}
    return {k: v for k, v in d.items() if isinstance(k, str) and k.startswith("http")} if isinstance(d, dict) else {}


DEAD = load_dead()


def _default_img():
    dom_f = Path(__file__).parent / "domain.txt"
    dom = dom_f.read_text().strip() if dom_f.exists() else ""
    base = (os.environ.get("SITE_BASE") or (f"https://{dom}" if dom else "https://mirko-peters.github.io/m365-dub-downloader")).rstrip("/")
    return f"{base}/assets/og-default.png"   # wie generate_site.page() fuer Seiten ohne eigenes Teilen-Bild


DEFAULT_IMG = _default_img()   # generate_site setzt es auf f"{BASE}/assets/og-default.png" seines Baus

_SENT = "\x00r2dead\x00"
_WS = r"(?:\s|\\[nrt]|&nbsp;|<br\s*/?>)*"   # Leerraum auch in JSON-maskiertem HTML (blog-import/part-N.json: \n, \")
_IMG_KEYS = ("image", "thumbnailUrl")


def _rx_dead(urls):
    if not urls:
        return None
    alt = "|".join(re.escape(u) for u in sorted(urls, key=len, reverse=True))
    return {
        "any": re.compile(alt),
        "img": re.compile(r"<img\b[^>]*?\ssrc=(\\?[\"'])(?:" + alt + r")\1[^>]*>", re.I),
        "a": re.compile(r"<a\b[^>]*>" + _WS + _SENT + _WS + r"</a>", re.I),
        "fig": re.compile(r"<figure\b[^>]*>" + _WS + r"(?:<figcaption\b[^>]*>(.*?)</figcaption>)?" + _WS + _SENT + _WS
                          + r"(?:<figcaption\b[^>]*>(.*?)</figcaption>)?" + _WS + r"</figure>", re.I | re.S),
        "p": re.compile(r"<p\b[^>]*>" + _WS + _SENT + _WS + r"</p>", re.I),
        "ld": re.compile(r'(<script type="application/ld\+json">)(.*?)(</script>)', re.S),
        "meta": re.compile(r'(<meta\s+(?:property|name)="(?:og:image|og:image:url|og:image:secure_url|twitter:image)"\s+content=")(?:' + alt + r')(")', re.I),
        "field": re.compile(r'("(?:' + "|".join(_IMG_KEYS) + r')"\s*:\s*)"(?:' + alt + r')"'),
    }


_DRX = _rx_dead(DEAD)


def _is_dead(x, dead):
    return (isinstance(x, str) and x in dead) or (isinstance(x, dict) and x.get("url") in dead)


def _ld_fix(v, dead, default):
    """JSON-LD rekursiv: tote URLs aus Bildfeldern; tote Einzel-URL bzw. dadurch leere Liste -> Standardbild."""
    if isinstance(v, list):
        return [_ld_fix(x, dead, default) for x in v]
    if not isinstance(v, dict):
        return v
    out = {}
    for k, x in v.items():
        if k in _IMG_KEYS and isinstance(x, list):
            x = [_ld_fix(i, dead, default) for i in x if not _is_dead(i, dead)] or default
        elif k in _IMG_KEYS and _is_dead(x, dead):
            x = default
        else:
            x = _ld_fix(x, dead, default)
        out[k] = x
    return out


def _cap(m):
    cap = (m.group(1) or m.group(2) or "").strip()
    return f"<p>{cap}</p>" if cap else ""


def drop_dead(html, dead=None, default=None):
    """Tote Bilder aus HTML (auch JSON-maskiertem) entfernen: <img src=tot> faellt weg, ein dadurch leeres <a>, <figure> (Bildunterschrift
    bleibt als <p>) oder <p> ebenfalls; JSON-LD-Bildfelder und og:image/twitter:image mit toter URL -> Standardbild. Sonst unveraendert."""
    rx = _DRX if dead is None else _rx_dead(dead)
    dead = DEAD if dead is None else dead
    if not rx or not html or not rx["any"].search(html):
        return html
    default = default or DEFAULT_IMG
    h = rx["img"].sub(_SENT, html)
    if _SENT in h:
        h = rx["a"].sub(_SENT, h)
        h = rx["fig"].sub(_cap, h)
        h = rx["p"].sub("", h)
        h = h.replace(_SENT, "")
    field = lambda s: rx["field"].sub(lambda f: f'{f.group(1)}"{default}"', s)

    def ld(m):
        if not rx["any"].search(m.group(2)):
            return m.group(0)
        try:
            v = json.loads(m.group(2).replace("<\\/", "</"))
        except ValueError:
            return m.group(1) + field(m.group(2)) + m.group(3)
        return m.group(1) + json.dumps(_ld_fix(v, dead, default), ensure_ascii=False).replace("</", "<\\/") + m.group(3)

    h = rx["ld"].sub(ld, h)
    h = rx["meta"].sub(lambda m: m.group(1) + default + m.group(2), h)
    return field(h)   # Bildfelder in JSON-Exporten (entities*.json usw.)


def rewrite(html):
    if not html or "http" not in html:
        return html
    if _DRX:
        html = drop_dead(html)
    return _RX.sub(lambda m: MAP[m.group(0)], html) if _RX else html


def local(path):
    """R2-URL einer lokalen Repo-Datei (Schluessel = Repo-Pfad in data/r2_map.json, gesetzt von tools/r2_upload.py aus data/r2_local.json) oder None,
    solange die Datei nicht hochgeladen ist: Seiten bauen dann ohne dieses Bild (z. B. mit CSS-Ersatz) statt mit einem kaputten Link."""
    u = MAP.get(path)
    return u if isinstance(u, str) and u.startswith("https://img.m365.fm/") else None
