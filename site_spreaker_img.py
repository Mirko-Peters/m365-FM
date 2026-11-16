"""Kleinere Spreaker-Folgenbilder fuer die Seiten (Ladezeit, LCP).

Spreaker liefert Folgenbilder ueber CloudFront mit einem Transformations-Segment im Pfad, z. B.
https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/<hash>.jpg (1400x1400, ~320 KB).
Geprueft per url-peek (16.11.2026): t_square_limited_160 / _320 / _480 / _720 liefern 200 image/jpg (9,6 / 30 / 59 / 115 KB);
t_square_limited_200, t_square_160 und t_square_320 liefern 400.

Nur das sichtbare <img> bekommt die kleine Variante (src + srcset). JSON-LD, og:image, Feeds und Downloads behalten die
Originaladresse. Andere Adressen (img.m365.fm, YouTube, ...) bleiben unveraendert (CLAUDE.md: Spreaker-Folgenbilder sind die Ausnahme
von der R2-Regel und bleiben vorerst bei Spreaker)."""
import html
import re

HOST = "https://d3wo5wojvuv7l.cloudfront.net"
SIZES = (160, 320, 480, 720)   # vorhandene Varianten t_square_limited_<n>
PRECONNECT = f'<link rel="preconnect" href="{HOST}">'
_RX = re.compile(r"^" + re.escape(HOST) + r"/t_[A-Za-z0-9_]+/(images\.spreaker\.com/.+)$")


def is_spreaker(u):
    """Spreaker-Folgenbild auf CloudFront (mit Transformations-Segment)?"""
    return bool(_RX.match(u or ""))


def variant(u, px):
    """Adresse der Variante t_square_limited_<px> (px aus SIZES); jede andere Adresse unveraendert."""
    m = _RX.match(u or "")
    if not m or px not in SIZES:
        return u
    return f"{HOST}/t_square_limited_{px}/{m.group(1)}"


def src_attrs(u, css):
    """src/srcset/sizes fuer ein quadratisches Bild mit css Pixeln Kantenlaenge (fertige Attribut-Zeichenkette, beginnt mit src=).
    Spreaker: src ~2x css (320 fuer 160, 160 fuer 96/48), srcset mit Breiten, sizes=<css>px. Andere Adressen: nur src (unveraendert)."""
    if not is_spreaker(u):
        return f'src="{html.escape(u or "", quote=True)}"'
    first = lambda w: next((n for n in SIZES if n >= w), SIZES[-1])   # kleinste Variante mit mindestens w Pixeln
    src = first(2 * css) if css > 96 else first(css)   # kleine Kacheln: 160 als Ersatz-src, srcset holt 320 fuer 2x
    use = [n for n in SIZES if first(css) <= n <= first(3 * css)]
    cands = ", ".join(f"{html.escape(variant(u, n), quote=True)} {n}w" for n in use)
    ss = f' srcset="{cands}" sizes="{css}px"' if len(use) > 1 else ""
    return f'src="{html.escape(variant(u, src), quote=True)}"{ss}'


def srcset_only(u, sizes, widths=(480, 720)):
    """Nur srcset/sizes (fuer Bilder, deren src die Originaladresse behalten muss, z. B. weil sie als Beitragsbild ausgelesen wird).
    Mit Breiten-Angaben nimmt der Browser nur Kandidaten aus srcset; das Original kommt als groesster Kandidat dazu. Leer, wenn nicht Spreaker."""
    if not is_spreaker(u):
        return ""
    big = re.search(r"/t_[A-Za-z0-9_]*?_(\d{3,4})/", u)   # Kantenlaenge des Originals aus dem Segment (t_rss_itunes_square_1400 -> 1400)
    ss = ", ".join([f"{html.escape(variant(u, n), quote=True)} {n}w" for n in widths if n in SIZES]
                   + ([f"{html.escape(u, quote=True)} {big.group(1)}w"] if big and int(big.group(1)) > max(widths) else []))
    return f' srcset="{ss}" sizes="{sizes}"'
