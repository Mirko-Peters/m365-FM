"""Interne Links ohne Umweg (Bing/Google melden sonst Weiterleitungsketten).

Viele Artikel (fruehere Podpage-Beitraege, Show Notes, Datenbank-Beitraege, Entitaets- und Update-Texte) verlinken noch alte Adressen
(/m365-fm-podcast/<slug>, /blog/<slug>, /<slug>, /people/..., /guests/intake, m365.fm ohne www ...), die nur ueber eine 301 des
Site-Workers (sitewrk/index.js) ans Ziel kommen. Dieses Modul bildet die Weiterleitungen des Site-Workers in Python nach und
schreibt am Ende des Seitenbaus jedes interne href, das weiterleiten wuerde, direkt auf die endgueltige Adresse um.

Eine Datenquelle: die Weiterleitungstabelle show/redirects.json (site_podpage.build), die auch der Site-Worker liest. Die festen
Regeln aus legacyTarget() (Regex) sind hier portiert; sitewrk/test/legacy.test.mjs und tests/test_site_links.py pruefen beide Seiten
gegen dieselbe Fallliste (sitewrk/test/legacy_cases.json). Aendert sich legacyTarget(), muss diese Datei mitgezogen werden.

Umgeschrieben wird nur, was tatsaechlich weiterleitet; das Ziel muss im Bau existieren (docs/ oder r2out/). Externe Links, Anker,
mailto: usw. bleiben unberuehrt, Query und Fragment bleiben erhalten. Ketten werden bis MAX_HOPS verfolgt, Schleifen erkannt."""
import json
import re
from pathlib import Path
from urllib.parse import unquote

WWW = "www.m365.fm"
OLD_HOSTS = {"m365.fm", "dub.m365.fm"}   # der Site-Worker leitet beide in einem Schritt auf www.m365.fm (MIGRATED=1)
HOSTS = {WWW} | OLD_HOSTS
MAX_HOPS = 5
EP_LANGS = "de|es|fr|it|pt|nl|pl|id|ru|uk|ar|he|ja|ko"   # sitewrk/index.js: Sprachfassungen der Folgen, die auf das englische Original zurueckfallen

_EXT = re.compile(r"\.[a-z0-9]{2,5}$", re.I)
_NOMAP = re.compile(r"^/(assets|og|covers|fonts|\.well-known)(/|$)", re.I)
_SHOW = re.compile(r"^/shows?(/|$)")
_PODCAST = re.compile(r"/m365-fm-podcast/([a-z0-9-]+)")
_EPISODE = re.compile(r"(/[a-z]{2})?/show/episodes/[a-z0-9-]+")
_EPISODE_SL = re.compile(r"(/[a-z]{2})?/show/episodes/[a-z0-9-]+/?")
_LANG_EP = re.compile(r"/(" + EP_LANGS + r")/show/episodes/([a-z0-9-]+)/?")
_MIRKO = re.compile(r"(/[a-z]{2})?/community/u/mirko-peters(/.*)?", re.S)
_GONE_LANG = re.compile(r"^/(pa|hi|ml|ta|te)(/|$)")
# Regeln, die nur auf eine Uebersicht fuehren (kein gleichwertiges Ziel): werden umgeschrieben, aber im Bericht als "soft" gefuehrt
SOFT_TARGETS = {"/", "/show/", "/show/episodes/", "/show/hosts/"}


def mappable(p):
    """sitewrk/index.js MAPPABLE: nur Pfade, die alte Podpage-Adressen sein koennen (keine Dateien, keine Assets, unter /show nur /show/blog...)."""
    return (p != "/" and not _EXT.search(p) and not _NOMAP.match(p)
            and (not _SHOW.match(p) or p == "/show/blog" or p.startswith("/show/blog/")))


def legacy_target(p0, table):
    """sitewrk/index.js legacyTarget(): p0 ist der Pfad ohne abschliessenden Schraegstrich. Gibt das Ziel oder "" zurueck."""
    if not mappable(p0):
        return ""
    to = table.get(p0) or table.get(p0.lower())
    if to:
        return to
    m = _PODCAST.fullmatch(p0)   # T8: Podpage-Folgenadressen unter dem Shownamen
    if m:
        return "/show/episodes/" + m.group(1) + "/"
    if re.match(r"^/categories(/|$)", p0):
        return "/show/episodes/"
    if re.fullmatch(r"/people/mirko-peters/?", p0):
        return "/about/mirko-peters/"
    if re.match(r"^/people(/|$)", p0):
        return "/show/hosts/"
    if re.fullmatch(r"/guests/intake/?", p0):
        return "/community/guests/"
    return "/show/" if re.match(r"^/(blog|videos|p)/", p0) else ""


class Site:
    """Was der Ursprung ausliefert: GitHub Pages (docs/) und der R2-Bucket (r2out/). Ohne Verzeichnisse (None) gilt: nichts existiert."""

    def __init__(self, docs=None, r2=None):
        self.docs, self.r2 = (Path(docs) if docs else None), (Path(r2) if r2 else None)
        self._c = {}

    def _f(self, base, rel):
        return base is not None and (base / rel).is_file()

    def where(self, path):
        """'docs', 'r2', 'slash' (GitHub Pages leitet /a -> /a/ um) oder None (404)."""
        if path in self._c:
            return self._c[path]
        rel = unquote(path).lstrip("/")
        r = None
        if path.endswith("/") or not rel:
            if self._f(self.docs, rel + "index.html"): r = "docs"
            elif self._f(self.r2, rel + "index.html"): r = "r2"
        else:
            if self._f(self.docs, rel) or self._f(self.docs, rel + ".html"): r = "docs"
            elif self._f(self.docs, rel + "/index.html"): r = "slash"
            elif self._f(self.r2, rel) or (not _EXT.search(path) and self._f(self.r2, rel + "/index.html")): r = "r2"   # r2Page haengt "/" an
        self._c[path] = r
        return r


class Resolver:
    def __init__(self, table, site=None):
        self.table = table or {}
        self.site = site or Site()
        self._cache = {}

    @classmethod
    def from_build(cls, docs, r2=None):
        f = Path(docs) / "show" / "redirects.json"
        table = json.loads(f.read_text("utf-8")) if f.exists() else {}
        return cls(table, Site(docs, r2))

    def hop(self, host, path):
        """Eine Antwort des Site-Workers (MIGRATED=1) fuer https://<host><path>: (host, pfad) des 301-Ziels oder None (keine Weiterleitung).
        Reihenfolge wie in sitewrk/index.js fetch()."""
        p0 = path.rstrip("/") or "/"
        to = legacy_target(p0, self.table)
        if host in OLD_HOSTS:   # T8: alter Host und alte Adresse in einem Schritt
            if not to and _EPISODE.fullmatch(p0):
                to = self.table.get(p0) or ""
            return WWW, (to or path)
        if to:
            return host, to
        m = _MIRKO.fullmatch(path)   # alter Name des Blog-Profils
        if m:
            return host, (m.group(1) or "") + "/community/u/mirko-p" + (m.group(2) or "/")
        if _GONE_LANG.match(path):   # Sprachen, die es nicht mehr gibt
            return host, "/"
        w = self.site.where(path)
        if w == "slash":   # GitHub Pages: Verzeichnis ohne abschliessenden Schraegstrich
            return host, path + "/"
        if w == "docs":
            return None
        if _EPISODE_SL.fullmatch(path):   # T12: umbenannte Folge (404 bei GitHub Pages, vor dem R2-Rueckfall)
            to = self.table.get(path.rstrip("/"))
            if to:
                return host, to
        if w == "r2":
            return None
        m = _LANG_EP.fullmatch(path)   # Sprachfassung (noch) nicht da: englisches Original
        if m:
            return host, "/show/episodes/" + m.group(2) + "/"
        return None

    def resolve(self, host, path):
        """Kette verfolgen. Rueckgabe (status, host, pfad):
        'ok' (keine Weiterleitung), 'redirect' (Ziel liefert 200), 'soft' (Ziel ist nur eine Uebersicht), 'missing' (Ziel fehlt im Bau),
        'loop' (Schleife), 'long' (mehr als MAX_HOPS), 'broken' (keine Weiterleitung, Adresse fehlt im Bau)."""
        key = (host, path)
        if key in self._cache:
            return self._cache[key]
        seen, h, p, hops = {key}, host, path, 0
        while True:
            nxt = self.hop(h, p)
            if not nxt:
                break
            hops += 1
            if nxt in seen:
                self._cache[key] = r = ("loop", host, path)
                return r
            if hops > MAX_HOPS:
                self._cache[key] = r = ("long", host, path)
                return r
            seen.add(nxt)
            h, p = nxt
        soft = p in SOFT_TARGETS and path.strip("/").count("/") >= 1   # z. B. /blog/<unbekannt> -> /show/: ein bestimmter Inhalt landet auf einer Uebersicht
        exists = self.site.where(p) in ("docs", "r2") if (self.site.docs or self.site.r2) else True
        if not hops:
            r = ("ok" if exists else "broken", host, path)
        elif not exists:
            r = ("missing", host, path)
        else:
            r = ("soft" if soft else "redirect", h, p)
        self._cache[key] = r
        return r


_HREF = re.compile(r"""(\shref\s*=\s*)(["'])([^"'<>]*)\2""", re.I)
_ABS = re.compile(r"^(?:(https?):)?//([^/?#:]+)(?::\d+)?([^?#]*)(.*)$", re.I | re.S)


def split_internal(href):
    """(form, host, pfad, rest) fuer interne Links, sonst None. form: 'abs' (https://...), 'proto' (//host/...), 'root' (/pfad)."""
    if not href or href[0] == "#":
        return None
    if href[0] == "/" and not href.startswith("//"):
        i = min([x for x in (href.find("?"), href.find("#")) if x >= 0] or [len(href)])
        return "root", WWW, href[:i], href[i:]
    m = _ABS.match(href)
    if not m:
        return None
    host = m.group(2).lower()
    if host not in HOSTS:
        return None
    return ("abs" if m.group(1) else "proto"), host, (m.group(3) or "/"), m.group(4)


def fix_href(href, res):
    """(neues href oder None, status, ziel)."""
    s = split_internal(href)
    if not s:
        return None, "external", None
    form, host, path, rest = s
    scheme_fix = form == "abs" and href[:5].lower() == "http:"
    st, h, p = res.resolve(host, path)
    if st in ("redirect", "soft"):
        new = p + rest if (form == "root" and h == WWW) else f"https://{h}{p}{rest}"
        return new, st, f"https://{h}{p}"
    if st == "ok" and scheme_fix:   # http:// auf die eigene Seite: Cloudflare leitet auf https um
        return f"https://{host}{path}{rest}", "redirect", f"https://{host}{path}"
    return None, st, f"https://{h}{p}"


def rewrite_html(html, res, stats=None, page=""):
    """Alle href-Attribute einer Seite pruefen; nur weiterleitende interne Links werden ersetzt. stats sammelt Zahlen und Fundstellen."""
    if "href" not in html:
        return html
    def rep(m):
        new, st, tgt = fix_href(m.group(3), res)
        if stats is not None and st not in ("external", "ok"):
            stats.add(page, m.group(3), st, tgt)
        return f"{m.group(1)}{m.group(2)}{new}{m.group(2)}" if new is not None else m.group(0)
    return _HREF.sub(rep, html)


def section(page):
    """Bereich einer Seite fuer den Bericht, z. B. /show/episodes/, /<lang>/community/u/*/blog/, /entity/."""
    segs = [x for x in page.split("/") if x]
    pre = ""
    if segs and re.fullmatch(r"[a-z]{2}", segs[0]):
        pre, segs = "/<lang>", segs[1:]
    if not segs or segs[-1].endswith(".html") and len(segs) == 1:
        return pre + "/"
    if segs[0] == "show" and len(segs) > 1 and segs[1] in ("episodes", "guests"):
        return f"{pre}/show/{segs[1]}/"
    if segs[0] == "community" and len(segs) > 3 and segs[1] == "u" and segs[3] == "blog":
        return f"{pre}/community/u/*/blog/"
    return f"{pre}/{segs[0]}/"


class Stats:
    def __init__(self):
        self.n = {"redirect": 0, "soft": 0, "missing": 0, "loop": 0, "long": 0, "broken": 0}
        self.pages = {}    # Seite -> Anzahl umgeschriebener Links
        self.examples = {}   # status -> {alt: ziel}
        self.unfixed = {}   # status -> {href: [seiten]}

    def add(self, page, href, st, tgt):
        self.n[st] = self.n.get(st, 0) + 1
        if st in ("redirect", "soft"):
            self.pages[page] = self.pages.get(page, 0) + 1
            ex = self.examples.setdefault(st, {})
            if len(ex) < 200: ex.setdefault(href, tgt)
        else:
            u = self.unfixed.setdefault(st, {})
            if href in u:
                if len(u[href]) < 5: u[href].append(page)
            elif len(u) < 500:
                u[href] = [page]

    def summary(self):
        return (f"Interne Links ohne Umweg: {self.n['redirect'] + self.n['soft']} umgeschrieben in {len(self.pages)} Seiten "
                f"({self.n['soft']} davon nur auf eine Uebersicht) | Ziel fehlt im Bau: {self.n['missing']} | Schleife/zu lange Kette: {self.n['loop'] + self.n['long']} "
                f"| kaputt (404, keine Weiterleitung): {self.n['broken']}")

    def report(self):
        top = sorted(self.pages.items(), key=lambda x: -x[1])
        sec = {}
        for p, n in self.pages.items():   # Bereich der Seite (Sprachpfad zusammengefasst): wo stecken die alten Links?
            a = sec.setdefault(section(p), [0, 0]); a[0] += 1; a[1] += n
        return {"counts": self.n, "pages_fixed": len(self.pages), "by_section": dict(sorted(sec.items(), key=lambda x: -x[1][1])),
                "top_pages": top[:300], "examples": self.examples, "unfixed": self.unfixed}


def fix_tree(roots, res, stats=None, rel_of=None):
    """Alle HTML-Dateien unter roots umschreiben (nur geaenderte Dateien werden neu geschrieben). Gibt die Zahl geaenderter Dateien zurueck."""
    stats = stats if stats is not None else Stats()
    changed = 0
    for root in roots:
        root = Path(root)
        if not root.is_dir():
            continue
        for f in root.rglob("*.html"):
            try:
                h = f.read_text("utf-8")
            except (OSError, UnicodeDecodeError):
                continue
            page = "/" + str(f.relative_to(root)).replace("\\", "/")
            page = page[:-len("index.html")] if page.endswith("/index.html") else page
            n = rewrite_html(h, res, stats, page)
            if n != h:
                f.write_text(n, "utf-8")
                changed += 1
    return changed
