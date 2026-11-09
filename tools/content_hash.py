"""Inhalts-Hash einer HTML-Seite (fuer IndexNow): die Kopf-Felder, die Suchmaschinen zeigen oder auswerten (<title>, meta description, meta robots,
link canonical), plus der Hauptinhalt: <main>, sonst <article>, sonst <body>.
Ohne Sidebar, Kopf- und Fussleiste, Navigation, Werbeplaetze (ganze Klassen-Tokens wie ad, ad-house, adsbygoogle), Skripte, <time>, relative Zeitangaben
("vor 3 Stunden", "updated 2 days ago"), ISO-Zeitstempel und Cache-Buster eigener Datei-Adressen (/assets/bild.png?v=3).
Gleiche Kopf-Felder und gleicher Hauptinhalt -> gleicher Hash, egal was Sidebar/Fuss/Zaehler/Stylesheet-Version tun.
Achtung: der Hash ist gespeicherter Stand (content-hashes.json im Deploy-Cache). Jede Aenderung an dieser Definition meldet beim naechsten Lauf einmal alle Seiten."""
import hashlib, html as _html, re
from html.parser import HTMLParser

SKIP = {"aside", "header", "footer", "nav", "script", "style", "noscript", "template", "time", "iframe", "svg", "form", "ins"}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
# Werbe- und Sidebar-Behaelter (site_ads.py, site_sidebar.py): nur ganze Klassen-/id-Tokens. Kein Vergleich auf den Anfang "ad-": ad-price, ad-prices, ad-note, ad-soon
# (Preistabelle der Werbe-Landingpage, site_landing.py) sind Hauptinhalt.
AD_TOK = {"ad", "ads", "ad-own", "ad-house", "ad-slot", "ad-box", "adsbygoogle", "sbar", "sidebar", "sb-card"}
BUST = re.compile(r"[?&](?:v|ver|nonce|cb|cachebust|cache|_|t|ts|rnd|r)=[^&\"'\s#<>]*", re.I)
OWN = re.compile(r"(?:https?:)?//(?:[a-z0-9-]+\.)*m365\.fm(?::\d+)?(?=[/?#]|$)", re.I)   # eigene Hosts: www., img., api-dub. ...
FILE = re.compile(r"\.(?:css|m?js|json|png|jpe?g|gif|webp|avif|svg|ico|woff2?|mp3|mp4|webm|pdf)$", re.I)
# Nur echte relative Zeitangaben: "vor 3 Stunden", "2 days ago", "just now", "updated today". Blosse Dauern ("30 days", "120 minutes", "3 Stunden") sind Inhalt.
_U = r"(?:s|secs?|seconds?|sek|sekunden?|min|mins|minutes?|minuten?|h|hrs?|hours?|std|stunden?|days?|tag(?:e|en)?|weeks?|wochen?|months?|monat(?:e|en)?|years?|jahr(?:e|en)?)"
REL = re.compile(rf"\bvor\s+\d+\s*{_U}\b|\b\d+\s*{_U}\s+ago\b|\b(?:just now|gerade eben)\b|(?:(?<=updated )|(?<=aktualisiert ))(?:today|yesterday|heute|gestern)\b", re.I)
ISO = re.compile(r"\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?")
# (?<!...): nur am Anfang eines Namens ansetzen. Ein Treffer mitten im Namen ist ohnehin unmoeglich (danach kaeme ein Namenszeichen statt "="); ohne die Sperre
# probiert die Suche bei einem langen Namen ohne "=" aber jede Stelle einzeln durch (quadratisch).
_ATTR = re.compile(r"""(?<![^\s"'<>/=])([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>]+))""")
_OPEN = re.compile(r"<!--|<(script)\b|<(style)\b", re.I); _COMM = re.compile("<!--")
_CLOSE = (re.compile("-->"), re.compile(r"</script\s*>", re.I), re.compile(r"</style\s*>", re.I))
_ROOT = [(re.compile(rf"<{t}\b", re.I), re.compile(rf"</{t}>", re.I)) for t in ("main", "article", "body")]
_TITLE = re.compile(r"<title\b", re.I); _TEND = re.compile(r"</title\s*>", re.I)
_TAG = re.compile(r"<(meta|link)\b", re.I)
_TOK = re.compile(r"""[^>"'<]+|<|"[^"]*"|'[^']*'""")   # ein Schritt im Tag: Text bis zum naechsten Sonderzeichen, ein "<" oder ein ganzer Wert in Anfuehrungszeichen


def _bust(u):
    """Cache-Buster (?v=..., &t=...) nur aus eigenen Datei-Adressen nehmen: /assets/... und Dateien (Bilder, Skripte, PDF) auf m365.fm und seinen Subdomains.
    Seiten-Links und fremde Adressen (youtube.com/watch?v=...) bleiben unveraendert - dort ist der Parameter Inhalt."""
    u = u.strip(); m = OWN.match(u)
    if not m and re.match(r"[a-z][a-z0-9+.-]*:|//", u, re.I): return u   # fremder Host oder anderes Schema (mailto:, data:)
    path = re.split(r"[?#]", u[m.end():] if m else u, maxsplit=1)[0]
    return BUST.sub("", u) if path.startswith("/assets/") or FILE.search(path) else u


class _P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.roots = {"main": [], "article": [], "body": []}; self.stack = []; self.skip = 0; self.out = {}; self.cur = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in VOID:
            if not self.skip and tag in ("img", "source"): self.cur.append(" " + _bust(a.get("src") or ""))
            return
        skip = self.skip or tag in SKIP or any(t in AD_TOK for t in ((a.get("class") or "") + " " + (a.get("id") or "")).lower().split()) or "data-ad-slot" in a or "data-ad-client" in a
        self.stack.append((tag, skip))
        if skip: self.skip += 1; return
        if tag == "a": self.cur.append(" <" + _bust(a.get("href") or "") + ">")

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                while len(self.stack) > i:
                    _, sk = self.stack.pop()
                    if sk: self.skip -= 1
                return

    def handle_data(self, d):
        if not self.skip: self.cur.append(d)


# Die Lesefunktionen unten laufen auch bei kaputtem HTML in einem Durchgang (Zeit waechst mit der Seitenlaenge, nicht mit ihrem Quadrat). Die naheliegenden
# Einzeiler (re.sub(r"<!--.*?-->", ...), re.search(r"<main\b[^>]*>(.*)</main>", ...), re.findall(r"<(meta|link)\b(...)>", ...)) liefern dasselbe, setzen aber an jedem
# Anfang ohne Ende neu an und lesen jedes Mal bis zum Textende: ein Kopf mit 20.000 nie geschlossenen Anfuehrungszeichen brauchte damit Minuten.
def _strip(h, tags=False):
    """Kommentare entfernen, mit tags auch <script>/<style> samt Inhalt. Ein Anfang ohne Ende bleibt stehen; fehlt einem Anfang das Ende, fehlt es auch jedem
    spaeteren derselben Art - die Art wird dann nicht weiter gesucht."""
    out, pos, dead = [], 0, set()
    for m in (_OPEN if tags else _COMM).finditer(h):
        k = m.lastindex or 0
        if m.start() < pos or k in dead: continue   # liegt in einem schon entfernten Stueck / Art ohne Ende
        c = _CLOSE[k].search(h, m.end())
        if not c: dead.add(k); continue
        out.append(h[pos:m.start()]); pos = c.end()
    out.append(h[pos:]); return "".join(out)


def _extract(html):
    """Text des ersten <main>, sonst <article>, sonst <body>/alles - ohne Boilerplate. Vom Ende des ersten Anfangs-Tags bis zum letzten Ende-Tag; nur das erste
    Anfangs-Tag zaehlt (folgt ihm kein Ende-Tag, dann auch keinem spaeteren)."""
    html = _strip(html)
    for start, end in _ROOT:
        m = start.search(html); g = html.find(">", m.end()) if m else -1; last = None
        if g >= 0:
            for last in end.finditer(html, g + 1): pass
        if last: html = html[g + 1:last.start()]; break
    p = _P(); p.feed(html)
    return "".join(p.cur)


def _tags(h):
    """Alle <meta ...>/<link ...> in h als (Tag, Attribut-Text). Ein ">" in einem Attributwert in Anfuehrungszeichen beendet das Tag nicht; ein Tag, dessen
    Anfuehrungszeichen nie schliesst, zaehlt nicht. dead merkt sich die Stellen, von denen aus kein Tag-Ende mehr kommt: ein spaeterer Tag-Anfang, der auf eine
    solche Stelle laeuft, bricht dort ab, statt wieder bis zum Ende zu lesen."""
    dead, pos = None, 0
    while True:
        m = _TAG.search(h, pos)
        if not m: return
        i, seen = m.start(), []
        while not (dead and dead[i]):
            t = _TOK.match(h, i)
            if not t: break
            seen.append(i); i = t.end()
        if h[i:i + 1] == ">": yield m.group(1), h[m.end():i]; pos = i + 1; continue
        if dead is None: dead = bytearray(len(h) + 1)
        for j in seen: dead[j] = 1
        dead[i] = 1; pos = m.end()


def _head(html):
    """Kopf-Felder "Titel | Beschreibung | robots | canonical" (jeweils das erste) aus dem Teil vor </head> bzw. <body>, ohne Kommentare, Skripte und Styles.
    Sie stehen im Suchergebnis oder steuern die Indexierung: aendert sich nur eines davon (meta_title/meta_description aus Podpage, noindex -> index,
    neue Titel-Vorlage), ist das fuer IndexNow eine inhaltliche Aenderung. Alles andere im Kopf (Stylesheet-Hash, og:*, hreflang, JSON-LD) zaehlt nicht."""
    m = re.search(r"</head\s*>|<body\b", html, re.I) or re.search(r"<main\b|<article\b", html, re.I)
    h = _strip(html[:m.start()] if m else "", True)
    t = _TITLE.search(h); g = h.find(">", t.end()) if t else -1; e = _TEND.search(h, g + 1) if g >= 0 else None   # nur das erste <title> zaehlt (wie beim Hauptinhalt)
    f = {"title": _html.unescape(h[g + 1:e.start()]) if e else ""}
    for tag, rest in _tags(h):
        a = {k.lower(): _html.unescape(v1 or v2 or v3) for k, v1, v2, v3 in _ATTR.findall(rest)}
        if tag.lower() == "meta" and a.get("name", "").lower() in ("description", "robots"): f.setdefault(a["name"].lower(), a.get("content", ""))
        elif tag.lower() == "link" and "canonical" in a.get("rel", "").lower().split(): f.setdefault("canonical", a.get("href", ""))
    return " | ".join(re.sub(r"\s+", " ", f.get(k, "")).strip() for k in ("title", "description", "robots", "canonical"))


def content_text(html):
    t = re.sub(r"\s+", " ", _extract(html))
    t = ISO.sub("", t); t = REL.sub("", t)
    return _head(html) + " || " + re.sub(r"\s+", " ", t).strip()


def content_hash(html):
    return hashlib.sha1(content_text(html).encode("utf-8")).hexdigest()[:16]


MAX_INDEXNOW = 10000   # Obergrenze je Aufruf (POST) bei IndexNow - nicht je Lauf: groessere Listen gehen in mehreren Aufrufen raus (indexnow_batches)


def indexnow_select(old, new, old_c, new_c):
    """Welche Adressen an IndexNow gehen. old/new: Seiten-Hashes (Adresse -> Hash), old_c/new_c: Inhalts-Hashes (nur HTML-Seiten).
    Neu: nur im neuen Stand. Entfallen: nur im alten. Geaendert: Inhalts-Hash weicht ab. Nur Boilerplate: Datei geaendert, Inhalt gleich -> nicht melden.
    Ohne alten Seiten- oder Inhalts-Stand (erster Lauf): nichts melden, nur die Hashes werden gesichert. Rueckgabe (Liste, Zaehler).
    Die Liste ist vollstaendig - nichts wird abgeschnitten: der neue Stand ersetzt danach den alten, Ausgelassenes kaeme nie wieder. Reihenfolge: inhaltlich
    geaendert, neu, entfallen (noch erreichbare Seiten vor denen, die es nicht mehr gibt). Das Aufteilen auf Aufrufe macht indexnow_batches."""
    pg = lambda u: u.endswith("/") and not u.startswith("/assets/")
    st = {"new": 0, "removed": 0, "content": 0, "boilerplate": 0, "seed": False}
    if not old or not old_c:
        st["seed"] = True; return [], st
    new_u = sorted(u for u in new_c if pg(u) and u not in old_c and u not in old)
    gone = sorted(u for u in old if pg(u) and u not in new)
    ch, bp = [], 0
    for u in sorted(new_c):
        if not pg(u) or u not in old_c: continue
        if old_c[u] != new_c[u]: ch.append(u)
        elif old.get(u) != new.get(u): bp += 1
    st.update(new=len(new_u), removed=len(gone), content=len(ch), boilerplate=bp)
    return ch + new_u + gone, st


def indexnow_batches(urls, size=MAX_INDEXNOW):
    """Teilt die Liste in Aufrufe zu hoechstens size Adressen; hintereinander ergeben sie wieder die ganze Liste."""
    return [urls[i:i + size] for i in range(0, len(urls), size)]
