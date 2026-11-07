"""Hash nur des Hauptinhalts einer HTML-Seite (fuer IndexNow): <main>, sonst <article>, sonst <body>.
Ohne Sidebar, Kopf, Fuss, Navigation, Werbeplaetze (.ad, .ad-house, adsbygoogle), Skripte, <time>, relative Zeitangaben ("vor 3 Stunden", "updated 2 days ago"),
ISO-Zeitstempel und Cache-Buster/Nonce in Adressen. Gleicher Hauptinhalt -> gleicher Hash, egal was Sidebar/Fuss/Zaehler tun."""
import hashlib, re
from html.parser import HTMLParser

SKIP = {"aside", "header", "footer", "nav", "script", "style", "noscript", "template", "time", "iframe", "svg", "form", "ins"}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
AD = re.compile(r"(^|[\s_-])(ad|ads|adsbygoogle|ad-house|ad-slot|advert\w*|sbar|sidebar|sb-card)($|[\s_-])", re.I)
BUST = re.compile(r"[?&](?:v|ver|nonce|cb|cachebust|cache|_|t|ts|rnd|r)=[^&\"'\s#<>]*", re.I)
REL = re.compile(r"\b(?:updated|aktualisiert|zuletzt aktualisiert)\b[^.<\n]{0,40}?\b(?:ago|vor [^.<\n]{0,25})|\b(?:vor\s+)?\d+\s*(?:s|sec|seconds?|sekunden?|min|minutes?|minuten?|h|hours?|stunden?|days?|tagen?|weeks?|wochen?|months?|monaten?)\s*(?:ago)?\b(?=\s*(?:ago|$|[.,;)]))|\b(?:vor\s+\d+\s+\w+|\d+\s+\w+\s+ago|yesterday|today|gestern|heute|just now|gerade eben)\b", re.I)
ISO = re.compile(r"\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?")


class _P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.roots = {"main": [], "article": [], "body": []}; self.stack = []; self.skip = 0; self.out = {}; self.cur = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in VOID:
            if not self.skip and tag in ("img", "source"): self.cur.append(" " + BUST.sub("", a.get("src") or ""))
            return
        skip = self.skip or tag in SKIP or bool(AD.search((a.get("class") or "") + " " + (a.get("id") or ""))) or "data-ad-slot" in a or "data-ad-client" in a
        self.stack.append((tag, skip))
        if skip: self.skip += 1; return
        if tag == "a": self.cur.append(" <" + BUST.sub("", a.get("href") or "") + ">")

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                while len(self.stack) > i:
                    _, sk = self.stack.pop()
                    if sk: self.skip -= 1
                return

    def handle_data(self, d):
        if not self.skip: self.cur.append(d)


def _extract(html):
    """Text des ersten <main>, sonst <article>, sonst <body>/alles - ohne Boilerplate."""
    html = re.sub(r"<!--.*?-->", "", html, flags=re.S)
    for tag in ("main", "article", "body"):
        m = re.search(rf"<{tag}\b[^>]*>(.*)</{tag}>", html, re.S | re.I)
        if m: html = m.group(1); break
    p = _P(); p.feed(html)
    return "".join(p.cur)


def content_text(html):
    t = _extract(html)
    t = BUST.sub("", t); t = ISO.sub("", t); t = REL.sub("", t)
    return re.sub(r"\s+", " ", t).strip()


def content_hash(html):
    return hashlib.sha1(content_text(html).encode("utf-8")).hexdigest()[:16]


MAX_INDEXNOW = 10000   # Obergrenze je Aufruf bei IndexNow


def indexnow_select(old, new, old_c, new_c, cap=MAX_INDEXNOW):
    """Welche Adressen an IndexNow gehen. old/new: Seiten-Hashes (Adresse -> Hash), old_c/new_c: Inhalts-Hashes (nur HTML-Seiten).
    Neu: nur im neuen Stand. Entfallen: nur im alten. Geaendert: Inhalts-Hash weicht ab. Nur Boilerplate: Datei geaendert, Inhalt gleich -> nicht melden.
    Ohne alten Seiten- oder Inhalts-Stand (erster Lauf): nichts melden, nur die Hashes werden gesichert. Rueckgabe (Liste, Zaehler)."""
    pg = lambda u: u.endswith("/") and not u.startswith("/assets/")
    st = {"new": 0, "removed": 0, "content": 0, "boilerplate": 0, "seed": False, "capped": 0}
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
    out = new_u + gone + ch
    st["capped"] = max(0, len(out) - cap)
    return out[:cap], st
