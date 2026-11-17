"""Alt-Texte der Inhaltsbilder (alte Podpage-Blogbeitraege, Show Notes) beim Seitenbau verbessern.

Quelle: data/r2_alt.json.gz (tools/r2_alt.py, Claude Haiku ueber den manuellen Workflow r2-alt.yml), Schluessel = endgueltige R2-URL (https://img.m365.fm/...):
  {"kind": "chart|diagram|screenshot|photo|product|illustration|logo|decorative", "decorative": bool, "alt": {sprache: text}, "chart_points": [...],
   "src": [Original-URLs aus dem Quell-HTML], "orig_alts": [vorhandene englische Alt-Texte], "model": ..., "ts": ...}
Handtexte der Redaktion in data/r2_alt_manual.json ({url: {"alt": {sprache: text}, "decorative": bool}}) haben immer Vorrang.

Ersetzt wird nur ein schwacher Alt-Text: fehlt/leer, Platzhalter ("Generated image", "Product Image", ...), Dateiname, gleich der Ueberschrift direkt
darueber oder gleich dem Seitentitel. Auf Seiten in einer anderen Sprache als Englisch zusaetzlich der unveraenderte englische Alt-Text der Quelle (orig_alts),
denn die Uebersetzungen uebernehmen ihn wortgleich. Ein guter vorhandener Alt-Text bleibt. Text in der Seitensprache, sonst Englisch; dekorativ -> alt="".

URL-Wechsel (tools/r2_upload.py --shrink legt -w1600-Schluessel an und stellt data/r2_map.json um): ein Eintrag gilt auch unter der URL, auf die
r2_map.json seine Original-URLs (src) heute zeigt, und unter seinem -w1600-Nachfolger, sobald r2_map.json diesen kennt.
Reine Funktionen; ohne Daten aendert apply() nichts."""
import gzip
import html as _h
import json
import re
from html.parser import HTMLParser
from pathlib import Path

import site_r2 as R2

D = Path(__file__).parent / "data"
ALT_FILE = D / "r2_alt.json.gz"
MANUAL_FILE = D / "r2_alt_manual.json"
LANGS = ("en", "de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")
PUBLIC = "https://img.m365.fm/"
# Platzhalter, die nichts ueber das Bild sagen (Bestandsaufnahme: "Sentiment Analysis Chart" 46, "Generated image" 27, "Product Image" 16)
WEAK = {"", "image", "img", "images", "picture", "photo", "foto", "bild", "grafik", "graphic", "graphics", "illustration", "screenshot", "logo", "icon",
        "generated image", "ai generated image", "ai-generated image", "product image", "product", "sentiment analysis chart", "chart", "diagram", "diagramm",
        "alt", "alt text", "alt-text", "untitled", "placeholder", "thumbnail", "featured image", "header image", "hero image", "blog image", "cover"}
_FILE = re.compile(r"^[\w\-. ]+\.(?:jpe?g|jfif|png|gif|webp|avif|svg|bmp|tiff?)$", re.I)
_HEAD = {"h1", "h2", "h3", "h4", "h5", "h6"}
_BLOCK = {"p", "li", "td", "th", "blockquote", "figcaption", "dd", "dt", "div", "section", "article", "ul", "ol", "table", "tr", "br"}


def norm(s):
    return re.sub(r"\s+", " ", _h.unescape(s or "")).strip().casefold().rstrip(" .:!?")


def r2_url(url):
    """Endgueltige Bild-URL nach dem Umschreiben des Seitenbaus (site_r2), unescaped - wie site_img_dims._dimensions."""
    if not url:
        return ""
    return _h.unescape(R2.rewrite(_h.escape(url, quote=True)))


def is_weak(alt, heading="", title="", src=""):
    """True, wenn der Alt-Text das Bild nicht beschreibt (fehlt, Platzhalter, Dateiname, Ueberschrift darueber, Seitentitel)."""
    if alt is None:
        return True
    a = norm(alt)
    if a in WEAK or _FILE.match(a):
        return True
    if src:
        name = src.split("?")[0].rstrip("/").rsplit("/", 1)[-1]
        if name and (a == name.casefold() or a == name.rsplit(".", 1)[0].casefold()):
            return True
    return bool(a) and (a == norm(heading) or a == norm(title))


def _shrunk(url):
    """https://img.m365.fm/i/abc.webp -> https://img.m365.fm/i/abc-w1600.webp (Namensregel von tools/r2_upload.shrunk_key, Endung webp)."""
    head, _, name = url.rpartition("/")
    stem = name.rsplit(".", 1)[0] if "." in name else name
    return "" if stem.endswith("-w1600") else f"{head}/{stem}-w1600.webp"


def build_index(data, manual=None, r2map=None):
    """{R2-URL: Eintrag} inkl. der heutigen Adressen nach einem URL-Wechsel. manual ueberschreibt Felder (alt je Sprache, decorative)."""
    r2map = R2.MAP if r2map is None else r2map
    targets = {v for v in r2map.values() if isinstance(v, str)}
    idx = {}
    for key, e in (data or {}).items():
        if not isinstance(e, dict) or not isinstance(e.get("alt"), dict):
            continue
        idx.setdefault(key, e)
        for s in e.get("src") or []:
            idx.setdefault(s, e)   # Original-URL im Quell-HTML (vor dem Umschreiben durch site_r2)
            new = r2map.get(s) or r2map.get(_h.escape(s, quote=True))
            if isinstance(new, str) and new.startswith(PUBLIC):
                idx.setdefault(new, e)
        nx = _shrunk(key)
        if nx and nx in targets:
            idx.setdefault(nx, e)
    for key, m in (manual or {}).items():
        if not isinstance(m, dict):
            continue
        base = dict(idx.get(key) or {"alt": {}, "decorative": False})
        alt = dict(base.get("alt") or {})
        alt.update({k: v for k, v in (m.get("alt") or {}).items() if isinstance(v, str)})
        base.update({"alt": alt, "manual": True})
        if "decorative" in m:
            base["decorative"] = bool(m["decorative"])
        idx[key] = base
    return idx


_IDX = None


def index():
    global _IDX
    if _IDX is None:
        data, manual = {}, {}
        try:
            if ALT_FILE.exists():
                data = json.loads(gzip.open(ALT_FILE, "rt", encoding="utf-8").read())
        except (OSError, ValueError):
            data = {}
        try:
            if MANUAL_FILE.exists():
                manual = json.loads(MANUAL_FILE.read_text("utf-8"))
        except (OSError, ValueError):
            manual = {}
        _IDX = build_index(data, manual)
    return _IDX


def choose(entry, lang, cur, heading="", title="", src=""):
    """Neuer Alt-Text oder None (bleibt). cur None = kein alt-Attribut."""
    if not entry:
        return None
    weak = is_weak(cur, heading, title, src)
    if not weak and lang != "en":
        weak = norm(cur) in {norm(x) for x in (entry.get("orig_alts") or [])} or norm(cur) == norm((entry.get("alt") or {}).get("en"))
    if not weak:
        return None
    if entry.get("decorative"):
        new = ""
    else:
        alt = entry.get("alt") or {}
        new = (alt.get(lang) or alt.get("en") or "").strip()
        if not new:
            return None
    return None if cur is not None and new == cur else new


class _Scan(HTMLParser):
    """Bilder mit Kontext: Ueberschrift darueber, Text davor/danach (je ~300 Zeichen), Lage im Quelltext fuer Ersetzungen."""

    def __init__(self, source, ctx=300):
        super().__init__(convert_charrefs=True)
        self.ctx = ctx
        self.imgs = []
        self.heading = ""
        self._hbuf = None
        self._before = ""
        self._open = []   # Bilder, deren Text danach noch gesammelt wird
        self.lines = [0] + [i + 1 for i, c in enumerate(source) if c == "\n"]

    def _offset(self):
        line, col = self.getpos()
        return self.lines[line - 1] + col

    def handle_starttag(self, tag, attrs):
        t = tag.lower()
        if t in _HEAD:
            self._hbuf = []
            for im in self._open: im["after"] = im["after"].strip()   # Text danach endet am naechsten Abschnitt
            self._open = []
        elif t == "img":
            a = dict(attrs)
            start = self._offset(); text = self.get_starttag_text()
            self.imgs.append({"src": a.get("src") or "", "alt": a.get("alt"), "heading": self.heading, "before": self._before[-self.ctx:].strip(), "after": "",
                              "start": start, "end": start + len(text), "tag": text})
            self._open.append(self.imgs[-1])
        elif t in _BLOCK:
            self._text(" ")

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        t = tag.lower()
        if t in _HEAD and self._hbuf is not None:
            self.heading = re.sub(r"\s+", " ", "".join(self._hbuf)).strip(); self._hbuf = None
            self._before = ""   # neuer Abschnitt: Text davor gehoert nicht mehr zum Bild
        elif t in _BLOCK:
            self._text(" ")

    def handle_data(self, d):
        if self._hbuf is not None:
            self._hbuf.append(d)
        self._text(d)

    def _text(self, d):
        self._before = (self._before + d)[-2000:]
        keep = []
        for im in self._open:
            im["after"] += d
            if len(im["after"]) < self.ctx:
                keep.append(im)
            else:
                im["after"] = re.sub(r"\s+", " ", im["after"]).strip()[:self.ctx]
        self._open = keep


def scan(source, ctx=300):
    p = _Scan(source or "", ctx)
    p.feed(source or "")
    p.close()
    for im in p.imgs:
        im["before"] = re.sub(r"\s+", " ", im["before"]).strip()
        im["after"] = re.sub(r"\s+", " ", im["after"]).strip()[:ctx]
    return p.imgs


def set_alt(tag, value):
    """alt-Attribut im <img>-Tag setzen bzw. ersetzen (nur das Attribut alt, nicht data-alt o. ae.)."""
    v = f' alt="{_h.escape(value, quote=True)}"'
    rx = re.compile(r"""(?i)\salt(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>/]+))?(?=[\s/>])""")
    if rx.search(tag):
        return rx.sub(lambda m: v, tag, count=1)
    return re.sub(r"\s*/?>$", lambda m: v + m.group(0), tag, count=1)


def apply(source, lang="en", title="", idx=None):
    """Schwache Alt-Texte der Bilder mit Eintrag in data/r2_alt.json.gz ersetzen (Seitensprache lang, Seitentitel title). Idempotent."""
    if not source or "<img" not in source.lower():
        return source
    idx = index() if idx is None else idx
    if not idx:
        return source
    edits = []
    for im in scan(source, ctx=0):
        e = idx.get(im["src"]) or idx.get(r2_url(im["src"]))
        new = choose(e, lang, im["alt"], im["heading"], title, im["src"])
        if new is not None:
            edits.append((im["start"], im["end"], set_alt(im["tag"], new)))
    for start, end, rep in reversed(edits):
        source = source[:start] + rep + source[end:]
    return source
