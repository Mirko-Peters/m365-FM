"""Ergaenzt Bildmasse aus data/r2_dims.json in Inhalts-HTML."""
import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path

import site_r2 as R2

D = Path(__file__).parent / "data" / "r2_dims.json"
try:
    DIMS = json.loads(D.read_text("utf-8"))
except (OSError, ValueError):
    DIMS = {}

_NUM = re.compile(r"^\d+$")


def _positive(value):
    return isinstance(value, int) and not isinstance(value, bool) and value > 0


def _dimensions(url):
    if not url:
        return None
    r2_url = html.unescape(R2.rewrite(html.escape(url, quote=True)))
    size = DIMS.get(r2_url)
    if isinstance(size, (list, tuple)) and len(size) == 2 and all(_positive(x) for x in size):
        return size
    return None


def _set_attr(tag, name, value):
    pattern = re.compile(rf"(?i)(\s){re.escape(name)}(?:\s*=\s*(?:\"[^\"]*\"|'[^']*'|[^\s/>]+))?")
    replacement = f' {name}="{html.escape(str(value), quote=True)}"'
    if pattern.search(tag):
        return pattern.sub(replacement, tag, count=1)
    return re.sub(r"\s*/?>$", lambda m: replacement + m.group(0), tag)


class _Images(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.edits = []
        self.has_dimensions = False
        self.needs_responsive_css = False
        self.lines = [0]
        self.lines.extend(i + 1 for i, c in enumerate(source) if c == "\n")

    def _offset(self):
        line, col = self.getpos()
        return self.lines[line - 1] + col

    def _tag(self, attrs):
        tag = self.get_starttag_text()
        values = dict(attrs)
        src = values.get("src")
        if not src:
            return tag
        dims = _dimensions(src)
        width, height = values.get("width"), values.get("height")
        width_ok = isinstance(width, str) and bool(_NUM.fullmatch(width))
        height_ok = isinstance(height, str) and bool(_NUM.fullmatch(height))
        if width_ok and height_ok:
            self.has_dimensions = True
            self.needs_responsive_css |= "max-width" not in values.get("style", "").lower()
        if dims:
            natural_w, natural_h = dims
            if not width_ok:
                width = str(round(int(height) * natural_w / natural_h)) if height_ok else str(natural_w)
                tag = _set_attr(tag, "width", width)
                width_ok = True
            if not height_ok:
                height = str(round(int(width) * natural_h / natural_w)) if width_ok else str(natural_h)
                tag = _set_attr(tag, "height", height)
                height_ok = True
            self.has_dimensions = True
            self.needs_responsive_css |= "max-width" not in values.get("style", "").lower()
        return tag

    def handle_starttag(self, tag, attrs):
        if tag.lower() == "img":
            start = self._offset()
            old = self.get_starttag_text()
            new = self._tag(attrs)
            if new != old:
                self.edits.append((start, start + len(old), new))

    def handle_startendtag(self, tag, attrs):
        if tag.lower() == "img":
            self.handle_starttag(tag, attrs)


def enhance(source):
    parser = _Images(source)
    parser.feed(source)
    for start, end, replacement in reversed(parser.edits):
        source = source[:start] + replacement + source[end:]
    return source



def eager_first(source, window=1500):
    """Erstes Inhaltsbild nicht lazy laden, wenn es oben im Text steht (sonst ist es oft das LCP-Element und startet erst nach dem Layout).
    window: das Bild muss in den ersten so vielen Zeichen des HTML beginnen; weiter unten bleibt loading="lazy"."""
    m = re.search(r"<img\b[^>]*>", source or "", flags=re.I)
    if not m or m.start() > window or not re.search(r'\sloading\s*=\s*["\']?lazy', m.group(0), flags=re.I):
        return source
    tag = re.sub(r'\sloading\s*=\s*["\']?lazy["\']?', "", m.group(0), count=1, flags=re.I)
    if "fetchpriority" not in tag.lower():
        tag = re.sub(r"\s*/?>$", lambda x: ' fetchpriority="high"' + x.group(0), tag)
    return source[:m.start()] + tag + source[m.end():]


def has_dimensions(source):
    parser = _Images(source)
    parser.feed(source)
    return parser.has_dimensions


def needs_responsive_css(source):
    parser = _Images(source)
    parser.feed(source)
    return parser.needs_responsive_css


CSS = '<style>.pp-notes img[width][height],.wk-body img[width][height]{max-width:100%;height:auto}</style>'
