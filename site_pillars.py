"""Pillar-Kompendien und Lernpfad "Manufacturing Excellence" (Englisch und Deutsch).

Quellen: imports/pillars/<en|de>/<slug>.md (Dateien der Redaktion mit Metadaten-Tabelle, Artikel, Autorenbox, Quellen und internen Prüfhinweisen),
Registry und Pfad: data/pillars.json. Veröffentlicht werden nur Metadaten (Title, Description), Artikel, Autorenbox und Quellen. Wettbewerbsanalyse,
Prüfhinweise und Review-Protokoll bleiben in der Datei und erscheinen nie auf der Seite.

Seiten:  /learn/<slug>/ (en) und /de/learn/<slug>/ (de), Pfad /learn/path/<id>/ und /de/learn/path/<id>/.
Cluster: Blogbeiträge werden den Pillars per Entitäts-Themen und Slug-Muster zugeordnet (assign); jeder zugeordnete englische oder deutsche Beitrag zeigt
unten einen Kasten "Teil des Lernpfads" mit Link auf Pillar und Pfad (article_box). Verweise in den Dateien werden beim Bauen geprüft: unbekannte
Entitäten, Beiträge und Pillar-Adressen führen zu einer Warnung im Build-Log, der Link wird dann zu Text (nichts bricht den Bau)."""
import html as _html
import json
import re
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DIR = ROOT / "imports" / "pillars"
LANGS = ("en", "de")
UPDATED = "2026-11-20"
AUTHOR = "mirko-p"

UI = {
    "learn": ("Learn", "Lernen"), "path": ("Learning path", "Lernpfad"), "guide": ("Guide", "Leitfaden"), "step": ("Step {n} of {m}", "Schritt {n} von {m}"),
    "min": ("min read", "Min. Lesezeit"), "updated": ("Updated", "Aktualisiert"), "deeper": ("Go deeper: related articles", "Vertiefen: passende Artikel"),
    "prev": ("Previous step", "Vorheriger Schritt"), "next": ("Next step", "Nächster Schritt"), "author": ("About the author", "Über den Autor"),
    "sources": ("Sources", "Quellen"), "unv": ("unverified", "ungeprüft"), "unv_t": ("Not independently verified yet; see the sources.", "Noch nicht unabhängig belegt, siehe Quellen."),
    "start": ("Start the learning path", "Lernpfad starten"), "all": ("All guides in this path", "Alle Leitfäden in diesem Pfad"), "guides": ("Guides", "Leitfäden"),
    "paths": ("Learning paths", "Lernpfade"), "part": ("Part of the learning path", "Teil des Lernpfads"), "read": ("Read the guide", "Zum Leitfaden"),
    "overview": ("View the whole path", "Ganzen Pfad ansehen"), "articles": ("articles", "Artikel"), "toc": ("Contents", "Inhalt"),
}


def tx(lang, key, **kw):
    s = UI[key][1 if lang == "de" else 0]
    return s.format(**kw) if kw else s


def esc(s):
    return _html.escape(str(s or ""), quote=True)


@lru_cache(maxsize=1)
def registry():
    return json.loads((ROOT / "data" / "pillars.json").read_text("utf-8"))


def pillars():
    return registry()["pillars"]


def by_id(pid):
    return next((p for p in pillars() if p["id"] == pid), None)


def slug_of(p, lang):
    return p["slug"][lang]


def url(BASE, p, lang):
    return f"{BASE}{'/de' if lang == 'de' else ''}/learn/{slug_of(p, lang)}/"


def path_url(BASE, lang):
    return f"{BASE}{'/de' if lang == 'de' else ''}/learn/path/{registry()['path']['id']}/"


def order():
    """Pillars in Lernreihenfolge (Stufe für Stufe)."""
    return [by_id(i) for st in registry()["path"]["stages"] for i in st["pillars"]]


# ---------- Datei lesen ----------
H1 = re.compile(r"^# (.+)$")
SKIP_H1 = ("competitive", "wettbewerb", "editorial", "prüfhinweise", "pruefhinweise")


def _sections(text):
    """Teilt an Überschriften der Ebene 1 (ausserhalb von Codeblöcken) -> [(titel, [zeilen])]."""
    out, cur, fence = [], None, False
    for ln in text.splitlines():
        if ln.startswith("```"): fence = not fence
        m = None if fence else H1.match(ln)
        if m:
            cur = (m.group(1).strip(), []); out.append(cur)
        elif cur is not None:
            cur[1].append(ln)
    return out


def _split_h2(article):
    """Zieht Abschnitte am Ende heraus, die nur für die Redaktion oder als eigene Kästen gedacht sind: Autorenbox, Quellen, Review-Protokoll (## im Artikel)."""
    lines, keep, taken, cur, fence = article.split("\n"), [], {"author": [], "sources": []}, None, False
    for ln in lines:
        if ln.startswith("```"): fence = not fence
        m = None if fence else re.match(r"^##\s+(.*)$", ln)
        if m:
            t = re.sub(r"^\d+\.\s*", "", m.group(1)).strip().lower()
            if t.startswith(("review-protokoll", "review log", "prüfhinweise", "editorial notes")): cur = "drop"; continue
            if t.startswith(("quellen", "sources")): cur = "sources"; continue
            if t.startswith(("über den autor", "ueber den autor", "autorenbox", "author box", "about the author")): cur = "author"; continue
            cur = None
        if cur == "drop": continue
        if cur in taken: taken[cur].append(ln)
        else: keep.append(ln)
    return "\n".join(keep).strip("\n"), "\n".join(taken["author"]).strip("\n"), "\n".join(taken["sources"]).strip("\n")


_PLACEHOLDER = re.compile(r"[ \t]*\*?\[(?:Editor|Redaktion)[^\]]*\]\*?", re.I)
_INTERNAL = re.compile(r"\s*\([^()]*(?:review log|editorial notes|review-protokoll|prüfhinweise|competitive analysis|wettbewerbsanalyse)[^()]*\)", re.I)


def scrub(md):
    """Entfernt Platzhalter für die Redaktion ([Editor: ...], [Redaktion: ...]) und Klammerverweise auf interne Prüfhinweise und Review-Protokolle."""
    md = _INTERNAL.sub("", _PLACEHOLDER.sub("", md))
    # Die Leitfäden gibt es jetzt: Hinweise "geplant" in den Sätzen entfallen (die Marker "(planned)" hinter Links entfernt finish)
    for a, b in ((r"\b([Tt]he|[Ss]ee the|[Ii]n the) planned (compendium|compendiums|guide|guides)\b", r"\1 \2"), (r"\bplanned (guides|compendiums)\b", r"\1"),
                 (r"a separate guide is planned at", "a separate guide is at"), (r"A full guide is planned:", "A full guide:"),
                 (r"geplanten Pillar-(Seite|Page)", r"Pillar-\1"), (r"geplante Pillar-(Seiten|Pages)", r"Pillar-\1")):
        md = re.sub(a, b, md)
    return md


def parse_file(path):
    """-> dict(meta, h1, article, author, sources, multi) oder None, wenn die Datei fehlt. multi: der Artikel hat weitere Überschriften der Ebene 1 (Teile)."""
    path = Path(path)
    if not path.exists(): return None
    secs = _sections(path.read_text("utf-8"))
    d = {"meta": {}, "h1": "", "article": "", "author": "", "sources": "", "multi": False}
    for title, lines in secs:
        t = title.lower()
        body = "\n".join(lines).strip("\n")
        body = re.sub(r"(?:^|\n)---\s*$", "", body).strip("\n")
        if t.startswith(("seo",)):
            for ln in lines:
                c = [x.strip() for x in ln.strip().strip("|").split("|")]
                if len(c) >= 2 and not set(c[0]) <= set("-: ") and c[0].lower() not in ("field", "feld"):
                    d["meta"][c[0].lower()] = c[1].strip("`")
        elif t.startswith(SKIP_H1):
            continue
        elif t.startswith(("author", "autorenbox")):
            d["author"] = body
        elif t.startswith(("sources", "quellen")):
            d["sources"] = body
        elif not d["h1"]:
            d["h1"], d["article"] = title, body
        else:   # weiterer Teil des Artikels ("Part B ...")
            d["article"] += f"\n\n# {title}\n\n{body}"; d["multi"] = True
    a, au, so = _split_h2(d["article"])
    d["article"] = a
    d["author"], d["sources"] = d["author"], d["sources"]
    if au and not d["author"]: d["author"] = au
    if so and not d["sources"]: d["sources"] = so
    for k in ("article", "author", "sources"): d[k] = scrub(d[k])
    return d


def meta_value(meta, *keys):
    for k in keys:
        if k in meta:
            return re.sub(r"\s*\(\d+\s*(characters|zeichen)\b.*$", "", meta[k], flags=re.I).strip()
    return ""


# ---------- Markdown -> HTML ----------
def slugify(s):
    s = re.sub(r"<[^>]+>|[*_`]", "", re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", s)).strip().lower()
    return re.sub(r"\s", "-", re.sub(r"[^\w\- ]", "", s, flags=re.U))


class Ctx:
    """Prüfstand für Links: ents (Entitäts-IDs), posts (en: {slug}, de: {slug} mit Sprachfassung), pillars. warn sammelt Hinweise."""
    def __init__(self, BASE, ents, en_posts, de_posts, episodes=None):
        self.BASE, self.ents, self.en_posts, self.de_posts, self.episodes = BASE, ents, en_posts, de_posts, episodes
        self.warn = []

    def link(self, u, lang):
        """-> neue Adresse oder None (Link entfällt, Text bleibt)."""
        m = re.match(r"https?://(?:www\.)?m365\.fm(/[^#?\s]*)?(#\S*)?$", u)
        if not m: return u
        path, frag = m.group(1) or "/", m.group(2) or ""
        pre = "/de" if lang == "de" else ""
        mm = re.match(r"/(?:en/)?learn/([a-z0-9-]+)/?$", path)
        if mm:
            p = next((q for q in pillars() if mm.group(1) in (q["slug"]["en"], q["slug"]["de"])), None)
            if p: return url(self.BASE, p, lang) + frag
            self.warn.append(f"Pillar-Adresse unbekannt: {u}"); return None
        mm = re.match(r"/entity/([a-z0-9-]+)/?$", path)
        if mm:
            if mm.group(1) in self.ents: return f"{self.BASE}{pre}/entity/{mm.group(1)}/{frag}"
            self.warn.append(f"Entität unbekannt: {mm.group(1)}"); return None
        mm = re.match(r"/community/u/([a-z0-9-]+)/blog/([a-z0-9-]+)/?$", path)
        if mm:
            h, s = mm.groups()
            if lang == "de" and s in self.de_posts: return f"{self.BASE}/de/community/u/{h}/blog/{s}/{frag}"
            if s in self.en_posts: return f"{self.BASE}/community/u/{h}/blog/{s}/{frag}"
            self.warn.append(f"Beitrag nicht live: {s}"); return None
        mm = re.match(r"/show/episodes/([a-z0-9-]+)/?$", path)
        if mm and self.episodes is not None and mm.group(1) not in self.episodes:
            self.warn.append(f"Folge unbekannt: {mm.group(1)}"); return None
        return f"{self.BASE}{path}{frag}"


def inline(s, lang, cx):
    s = esc(s)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<!\*)\*(?!\*)([^*\n]+?)\*(?!\*)", r"<em>\1</em>", s)

    def a(m):
        label, u = m.group(1), _html.unescape(m.group(2))
        if u.startswith("#"): return f'<a href="{esc(u)}">{label}</a>'
        n = cx.link(u, lang) if cx else u
        if n is None: return label
        ext = not n.startswith(cx.BASE) if cx else True
        return f'<a href="{esc(n)}"' + (' rel="noopener" target="_blank"' if ext else "") + f'>{label}</a>'
    return re.sub(r"\[([^\]]+)\]\(((?:https?://|#)[^\s)]+)\)", a, s)


_TROW = re.compile(r"^\s*\|.*\|\s*$")
_TSEP = re.compile(r"^\s*\|[\s:|-]+\|\s*$")
_LI = re.compile(r"^(\s*)([-*]|\d+[.)])\s+(.*)$")


def _cells(r):
    return [c.strip() for c in r.strip().strip("|").split("|")]


def render(md, lang, cx, ids=True, demote=0):   # demote=1: "# Teil" wird h2, "##" h3 (Artikel mit mehreren Teilen)
    """Markdown der Kompendien -> HTML (Überschriften mit Sprungmarke, Absätze, Listen, Zitate, Tabellen, Codeblöcke)."""
    lines, out, seen, i = md.split("\n"), [], {}, 0
    heads = []

    def para(buf):
        return "<p>" + inline(" ".join(x.strip() for x in buf), lang, cx) + "</p>"
    while i < len(lines):
        ln = lines[i]
        if not ln.strip() or re.match(r"^\s*---+\s*$", ln): i += 1; continue
        if ln.startswith("```"):
            j, code = i + 1, []
            while j < len(lines) and not lines[j].startswith("```"): code.append(lines[j]); j += 1
            out.append(f"<pre><code>{esc(chr(10).join(code))}</code></pre>"); i = j + 1; continue
        m = re.match(r"^(#{1,4})\s+(.*)$", ln)
        if m:
            lvl = min(max(len(m.group(1)) + demote, 2), 4); raw = m.group(2).strip(); sid = slugify(raw) or "s"
            if sid in seen: seen[sid] += 1; sid = f"{sid}-{seen[sid]}"
            else: seen[sid] = 0
            heads.append((lvl, raw, sid))
            out.append(f'<h{lvl} id="{sid}">{inline(raw, lang, cx)}</h{lvl}>' if ids else f"<h{lvl}>{inline(raw, lang, cx)}</h{lvl}>"); i += 1; continue
        if _TROW.match(ln) and i + 1 < len(lines) and _TSEP.match(lines[i + 1]):
            j = i + 2
            while j < len(lines) and _TROW.match(lines[j]): j += 1
            head, body = _cells(ln), [_cells(r) for r in lines[i + 2:j]]
            th = "".join(f"<th>{inline(c, lang, cx)}</th>" for c in head)
            tb = "".join("<tr>" + "".join(f"<td>{inline(c, lang, cx)}</td>" for c in (r + [""] * len(head))[:max(len(head), len(r))]) + "</tr>" for r in body)
            out.append(f'<div class="pl-tbl"><table><thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>'); i = j; continue
        if ln.startswith(">"):
            j, buf = i, []
            while j < len(lines) and lines[j].startswith(">"): buf.append(lines[j][1:].strip()); j += 1
            ps, cur = [], []
            for b in buf:
                if b: cur.append(b)
                elif cur: ps.append(para(cur)); cur = []
            if cur: ps.append(para(cur))
            out.append("<blockquote>" + "".join(ps) + "</blockquote>"); i = j; continue
        m = _LI.match(ln)
        if m:
            kind = "ol" if m.group(2)[0].isdigit() else "ul"; items, j = [], i
            start = int(re.match(r"\d+", m.group(2)).group()) if kind == "ol" else 0
            while j < len(lines):
                mm = _LI.match(lines[j])
                if mm and (mm.group(2)[0].isdigit()) == (kind == "ol"): items.append(mm.group(3).strip()); j += 1; continue
                if lines[j].strip() and lines[j].startswith("  ") and items and not _LI.match(lines[j]): items[-1] += " " + lines[j].strip(); j += 1; continue
                break
            out.append(f"<{kind}" + (f' start="{start}"' if kind == "ol" and start > 1 else "") + ">" + "".join(f"<li>{inline(x, lang, cx)}</li>" for x in items) + f"</{kind}>"); i = j; continue
        j, buf = i, []
        while j < len(lines) and lines[j].strip() and not re.match(r"^(#{1,4}\s|```|>|\s*---+\s*$)", lines[j]) and not _LI.match(lines[j]) and not (_TROW.match(lines[j]) and j + 1 < len(lines) and _TSEP.match(lines[j + 1])):
            buf.append(lines[j]); j += 1
        out.append(para(buf)); i = j
    return "\n".join(out), heads


def fix_anchors(h, heads, cx):
    """Sprungmarken des Inhaltsverzeichnisses mit den Überschrift-IDs abgleichen (Doppelstriche und Nummern ignorieren); unbekannte: Hinweis im Build-Log."""
    ids = {x[2] for x in heads}
    flat = lambda a: re.sub(r"-+", "-", a).strip("-")
    by_flat = {}
    for x in heads: by_flat.setdefault(flat(x[2]), x[2]); by_flat.setdefault(re.sub(r"^\d+-", "", flat(x[2])), x[2])

    def fix(m):
        a = m.group(1)
        if a in ids or a.startswith("src-"): return m.group(0)
        n = by_flat.get(flat(a)) or by_flat.get(re.sub(r"^\d+-", "", flat(a)))
        if n: return f'href="#{n}"'
        cx.warn.append(f"Sprungmarke ohne Überschrift: #{a}"); return m.group(0)
    return re.sub(r'href="#([^"]+)"', fix, h)


def finish(h, n_sources, lang):
    """Nachbearbeitung: [12] -> Sprung zur Quelle, Marker [unverified]/[ungeprüft] -> kleiner Hinweis, "(planned)"/"(geplant)" entfällt."""
    h = re.sub(r"\s*\((?:planned|geplant)\)", "", h)
    unv = f'<sup class="pl-unv" title="{esc(tx(lang, "unv_t"))}">{esc(tx(lang, "unv"))}</sup>'
    h = re.sub(r"\[(?:unverified|ungeprüft|ungepruft)\]", unv, h, flags=re.I)

    def cites(seg):
        return re.sub(r"\[(\d{1,3})\]", lambda m: f'<a class="pl-cite" href="#src-{m.group(1)}">[{m.group(1)}]</a>' if 1 <= int(m.group(1)) <= n_sources else m.group(0), seg)
    return re.sub(r">([^<]+)<", lambda m: ">" + cites(m.group(1)) + "<", h)


def sources_html(md, lang, cx):
    items = []
    for ln in md.split("\n"):
        m = re.match(r"^\s*(\d{1,3})[.)]\s+(.*)$", ln)
        if m: items.append([int(m.group(1)), m.group(2)])
        elif items and ln.strip() and not ln.startswith(("#", ">")): items[-1][1] += " " + ln.strip()
    lead = [ln for ln in md.split("\n") if ln.strip() and not re.match(r"^\s*\d{1,3}[.)]\s", ln)][:1] if items else []
    lis = "".join(f'<li id="src-{n}" value="{n}">{inline(t, lang, cx)}</li>' for n, t in items)
    return (f"<p>{inline(lead[0], lang, cx)}</p>" if lead and items and md.lstrip()[:1] != "1" else "") + f'<ol class="pl-src">{lis}</ol>', len(items)


def faq_of(md):
    """FAQ-Fragen und Antworten aus dem Abschnitt "## FAQ"/"## Häufige Fragen" (### Frage, danach Absätze)."""
    out, inside, q, a = [], False, None, []
    for ln in md.split("\n"):
        m = re.match(r"^##\s+(.*)$", ln)
        if m:
            if q and a: out.append((q, " ".join(a)))
            q, a = None, []; inside = bool(re.match(r"(\d+\.\s*)?(FAQ|Häufige|Frequently)", m.group(1).strip(), re.I)); continue
        if not inside: continue
        m = re.match(r"^###\s+(.*)$", ln) or re.match(r"^\*\*(.+\?)\*\*\s*$", ln)
        if m:
            if q and a: out.append((q, " ".join(a)))
            q, a = m.group(1).strip(), []
        elif q and ln.strip(): a.append(ln.strip())
    if q and a: out.append((q, " ".join(a)))
    clean = lambda s: re.sub(r"\s+", " ", re.sub(r"\[(\d{1,3})\]|\[(?:unverified|ungeprüft)\]", "", re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", re.sub(r"[*`>]", "", s)))).strip()
    return [(clean(q), clean(a)[:1200]) for q, a in out if q and a][:12]


# ---------- Zuordnung der Blogbeiträge ----------
ASSIGN = {}   # (handle, slug) -> [pillar-ids nach Güte]
CLUSTER = {}  # pillar-id -> [post, ...] nach Güte


def _match(p, post):
    topics = set(post.get("topics") or [])
    hit = 0
    for t in p.get("topics", []):
        if t.endswith("*"): hit += sum(1 for x in topics if x.startswith(t[:-1]))
        elif t in topics: hit += 1
    rx = p.get("re")
    txt = f'{post.get("slug", "")} {post.get("title", "")}'
    return 2 * hit + (1 if rx and re.search(rx, txt, re.I) else 0)


def assign(posts):
    """Ordnet live veröffentlichte englische Originalbeiträge den Pillars zu (Themen und Slug-Muster)."""
    ASSIGN.clear(); CLUSTER.clear()
    pool = [x for x in posts if (x.get("lang") or "en") == "en" and not x.get("tr_of") and x.get("slug") and x.get("handle")]
    for p in pillars(): CLUSTER[p["id"]] = []
    for post in pool:
        sc = sorted(((_match(p, post), -i, p["id"]) for i, p in enumerate(pillars())), reverse=True)
        keep = [(s, pid) for s, _, pid in sc if s >= 1][:2]
        if keep: ASSIGN[(post["handle"], post["slug"])] = [pid for _, pid in keep]
        for s, pid in keep: CLUSTER[pid].append((s, post.get("published") or 0, post))
    for pid in CLUSTER: CLUSTER[pid] = [x[2] for x in sorted(CLUSTER[pid], key=lambda y: (-y[0], -y[1]))]
    return {pid: len(v) for pid, v in CLUSTER.items()}


def _post_url(BASE, post, lang):
    return f"{BASE}{'/de' if lang == 'de' else ''}/community/u/{post['handle']}/blog/{post['slug']}/"


def article_box(post, lang, BASE):
    """Kasten "Teil des Lernpfads" unter einem Blogbeitrag (nur en/de, nur zugeordnete Beiträge)."""
    if lang not in LANGS: return ""
    ids = ASSIGN.get((post.get("handle"), post.get("slug")))
    if not ids: return ""
    p = by_id(ids[0])
    if not p or not (ROOT / "imports" / "pillars" / lang / f'{slug_of(p, lang)}.md').exists(): return ""
    return (f'<aside class="pl-box" aria-label="{esc(tx(lang, "part"))}"><p class="mut">{esc(tx(lang, "part"))}: <a href="{path_url(BASE, lang)}">{esc(registry()["path"]["title"][lang])}</a></p>'
            f'<p><b>{esc(p["label"][lang])}</b> · <a href="{url(BASE, p, lang)}">{esc(tx(lang, "read"))}</a></p></aside>')


# ---------- Seiten ----------
CSS = """<style>
.pl-meta{color:var(--mut,#667);font-size:.92em;margin:.2em 0 1em}
.pl-art{max-width:46em}
.pl-art h2{margin-top:1.8em;scroll-margin-top:5em}.pl-art h3,.pl-art h4{scroll-margin-top:5em}
.pl-art blockquote{margin:1.2em 0;padding:.6em 1em;border-left:4px solid var(--ac,#0a6);background:rgba(120,140,150,.1);border-radius:0 .4em .4em 0}
.pl-art blockquote p{margin:.4em 0}
.pl-tbl{overflow-x:auto;margin:1em 0}.pl-tbl table{border-collapse:collapse;min-width:100%;font-size:.94em}
.pl-tbl th,.pl-tbl td{border:1px solid var(--bd,#ccd);padding:.4em .6em;text-align:left;vertical-align:top}
.pl-tbl th{background:rgba(120,140,150,.14)}
.pl-art pre{overflow-x:auto;padding:.8em;background:rgba(120,140,150,.12);border-radius:.4em}
.pl-unv{font-size:.7em;color:#b45;border:1px solid currentColor;border-radius:.6em;padding:0 .4em;margin-left:.15em;white-space:nowrap}
.pl-cite{text-decoration:none;font-size:.85em}
.pl-src li{margin:.35em 0;overflow-wrap:anywhere}
.pl-step{display:flex;gap:1em;flex-wrap:wrap;margin:2em 0}.pl-step a{flex:1 1 14em;display:block;padding:.8em 1em;border:1px solid var(--bd,#ccd);border-radius:.5em;text-decoration:none}
.pl-step small{display:block;color:var(--mut,#667)}
.pl-box{margin:1.5em 0;padding:.8em 1em;border:1px solid var(--bd,#ccd);border-left:4px solid var(--ac,#0a6);border-radius:.4em}.pl-box p{margin:.3em 0}
.pl-stage{margin:2em 0 .4em}.pl-step-n{display:inline-block;min-width:2em;height:2em;line-height:2em;text-align:center;border-radius:50%;background:var(--ac,#0a6);color:#fff;margin-right:.5em;font-weight:700}
.pl-card{border:1px solid var(--bd,#ccd);border-radius:.5em;padding:1em;margin:.8em 0}.pl-card h3{margin:.1em 0 .3em}.pl-card ul{margin:.4em 0 0;padding-left:1.2em}
</style>"""


def _author_html(md, lang, cx):
    md = re.sub(r"^\*\[(?:Editor|Redaktion)[^\n]*\]\*\s*$", "", md, flags=re.M)   # Platzhalter für die Redaktion nie veröffentlichen
    return render(md, lang, cx, ids=False)[0]


def _article(p, lang, BASE, cx):
    f = ROOT / "imports" / "pillars" / lang / f"{slug_of(p, lang)}.md"
    d = parse_file(f)
    if not d or not d["h1"] or not d["article"]: return None
    src_html, n_src = sources_html(d["sources"], lang, cx) if d["sources"] else ("", 0)
    body, heads = render(d["article"], lang, cx, demote=1 if d["multi"] else 0)
    body = fix_anchors(body, heads, cx)
    body = finish(body, n_src, lang)
    return d, body, src_html, heads


def _shell(g, lang, b, wide="56em"):
    BASE, header, footer, footer_en, LANGS_ = g["BASE"], g["header"], g["footer"], g["footer_en"], g["LANGS"]
    return f'{header(lang, "")}<main class="wrap" style="max-width:{wide}">{b}</main>{footer(lang) if lang in LANGS_ else footer_en()}'


def _crumb_ld(BASE, items):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(items)]}


def hub_card(lang, BASE):
    """Karte des Lernpfads für die Lern-Hubs /learn/ (en) und /de/learn/."""
    if lang not in LANGS or not registry().get("path"): return ""
    pa = registry()["path"]
    return f'<a class="ln-card" href="{path_url(BASE, lang)}"><b>{esc(pa["title"][lang])}</b><span>{esc(pa["short"][lang])}</span></a>'


def hub_html(lang, BASE):
    c = hub_card(lang, BASE)
    return f'<h2>{esc(tx(lang, "paths"))}</h2><div class="ln-grid">{c}</div>' if c else ""


def build(g, posts, ents, written=None):
    """Schreibt alle Pillar-Seiten und die Pfadseiten. g: Kontext wie bei site_library.build. posts: live veröffentlichte Beiträge (aller Sprachen)."""
    BASE, write, page, sitemap = g["BASE"], g["write"], g["page"], g["sitemap"]
    reg = registry(); pa = reg["path"]
    en_posts = {x["slug"] for x in posts if (x.get("lang") or "en") == "en" and not x.get("tr_of")}
    de_posts = {x["slug"] for x in posts if x.get("lang") == "de"}
    cx = Ctx(BASE, ents, en_posts, de_posts, g.get("episode_slugs"))
    counts = assign(posts)
    ordered = order(); n_pillars = len(ordered)
    made = {l: 0 for l in LANGS}
    cards = {}
    for lang in LANGS:
        for p in pillars():
            res = _article(p, lang, BASE, cx)
            if not res: print(f"Pillars: Datei fehlt oder leer: {lang}/{slug_of(p, lang)}.md"); continue
            d, body, src_html, heads = res
            u = url(BASE, p, lang)
            idx = next(i for i, q in enumerate(ordered) if q["id"] == p["id"])
            words = len(re.sub(r"<[^>]+>", " ", body).split()); mins = max(1, round(words / 220))
            title = meta_value(d["meta"], "meta title", "meta-title") or d["h1"]
            desc = meta_value(d["meta"], "meta description", "meta-description")
            alts = {l: url(BASE, p, l) for l in LANGS if (ROOT / "imports" / "pillars" / l / f"{slug_of(p, l)}.md").exists()}
            pv, nx = (ordered[idx - 1] if idx else None), (ordered[idx + 1] if idx + 1 < n_pillars else None)
            step = "".join(f'<a href="{url(BASE, q, lang)}"{" rel=" + chr(34) + rel + chr(34)}><small>{esc(tx(lang, key))}</small><b>{esc(q["label"][lang])}</b></a>' for q, key, rel in ((pv, "prev", "prev"), (nx, "next", "next")) if q)
            rel_posts = CLUSTER.get(p["id"], [])
            if lang == "de": rel_posts = [x for x in rel_posts if x["slug"] in de_posts]
            deeper = ""
            if rel_posts:
                deeper = f'<section class="pl-deeper"><h2>{esc(tx(lang, "deeper"))}</h2><ul>' + "".join(f'<li><a href="{_post_url(BASE, x, lang)}">{esc(x["title"])}</a></li>' for x in rel_posts[:12]) + "</ul></section>"
            auth = _author_html(d["author"], lang, cx) if d["author"] else ""
            crumbs = [(tx(lang, "learn"), f"{BASE}{'/de' if lang == 'de' else ''}/learn/"), (pa["title"][lang], path_url(BASE, lang)), (p["label"][lang], u)]
            nav = '<nav aria-label="breadcrumb">' + " › ".join(f'<a href="{x}">{esc(n)}</a>' for n, x in crumbs[:-1]) + f" › {esc(crumbs[-1][0])}</nav>"
            b = _shell(g, lang, f'{CSS}{nav}<article class="pl-art"><h1>{esc(d["h1"])}</h1><p class="pl-meta">{esc(tx(lang, "guide"))} · {esc(tx(lang, "step", n=idx + 1, m=n_pillars))} · '
                       f'{mins} {esc(tx(lang, "min"))} · {esc(tx(lang, "updated"))} <time datetime="{UPDATED}">{UPDATED}</time> · <a href="{path_url(BASE, lang)}">{esc(tx(lang, "overview"))}</a></p>'
                       f'{body}</article>{deeper}<nav class="pl-step" aria-label="{esc(tx(lang, "path"))}">{step}</nav>'
                       + (f'<section class="pl-author"><h2>{esc(tx(lang, "author"))}</h2>{auth}</section>' if auth else "")
                       + (f'<section class="pl-sources" id="sources"><h2>{esc(tx(lang, "sources"))}</h2>{src_html}</section>' if src_html else ""))
            author_id = f"{BASE}/community/u/{AUTHOR}/#person"
            art = {"@context": "https://schema.org", "@type": "Article", "@id": u + "#article", "headline": d["h1"][:110], "description": desc, "inLanguage": lang,
                   "url": u, "mainEntityOfPage": u, "datePublished": UPDATED, "dateModified": UPDATED, "wordCount": words,
                   "author": {"@type": "Person", "@id": author_id, "name": "Mirko Peters", "url": f"{BASE}/community/u/{AUTHOR}/"},
                   "publisher": {"@type": "Organization", "name": "M365.FM", "url": f"{BASE}/"},
                   "isPartOf": {"@type": "Course", "@id": path_url(BASE, lang) + "#course", "name": pa["title"][lang], "url": path_url(BASE, lang)}}
            ld = [art, _crumb_ld(BASE, crumbs)]
            faq = faq_of(d["article"])
            if faq: ld.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]})
            write(f"{'de/' if lang == 'de' else ''}learn/{slug_of(p, lang)}/index.html", page(lang, title, desc, u, b, alts if len(alts) > 1 else None, ld, xdefault=alts.get("en"), og_type="article"))
            sitemap.append((u, UPDATED, alts if len(alts) > 1 else None))
            made[lang] += 1
            cards[(lang, p["id"])] = (desc, mins)
    # Pfadseiten
    for lang in LANGS:
        pu = path_url(BASE, lang)
        stages = ""
        items = []
        n = 0
        for si, st in enumerate(pa["stages"]):
            blk = ""
            for pid in st["pillars"]:
                p = by_id(pid)
                if (lang, pid) not in cards: continue
                n += 1; desc, mins = cards[(lang, pid)]
                rel = CLUSTER.get(pid, [])
                if lang == "de": rel = [x for x in rel if x["slug"] in de_posts]
                lst = ("<ul>" + "".join(f'<li><a href="{_post_url(BASE, x, lang)}">{esc(x["title"])}</a></li>' for x in rel[:5]) + "</ul>") if rel else ""
                blk += (f'<div class="pl-card"><h3><span class="pl-step-n">{n}</span><a href="{url(BASE, p, lang)}">{esc(p["label"][lang])}</a></h3><p>{esc(desc)}</p>'
                        f'<p class="mut">{mins} {esc(tx(lang, "min"))}</p>{lst}</div>')
                items.append((n, p))
            if blk: stages += f'<h2 class="pl-stage">{esc(st["title"][lang])}</h2><p class="mut">{esc(st["text"][lang])}</p>{blk}'
        if not items: continue
        first = url(BASE, items[0][1], lang)
        crumbs = [(tx(lang, "learn"), f"{BASE}{'/de' if lang == 'de' else ''}/learn/"), (pa["title"][lang], pu)]
        nav = f'<nav aria-label="breadcrumb"><a href="{crumbs[0][1]}">{esc(crumbs[0][0])}</a> › {esc(crumbs[1][0])}</nav>'
        b = _shell(g, lang, f'{CSS}{nav}<h1>{esc(pa["title"][lang])}</h1><p class="pl-meta">{esc(tx(lang, "path"))} · {len(items)} {esc(tx(lang, "guides"))}</p>'
                   f'<p>{esc(pa["intro"][lang])}</p><p><a class="btn main" href="{first}">{esc(tx(lang, "start"))}</a></p>{stages}')
        alts = {l: path_url(BASE, l) for l in LANGS}
        ld = [{"@context": "https://schema.org", "@type": "Course", "@id": pu + "#course", "name": pa["title"][lang], "description": pa["short"][lang], "inLanguage": lang, "url": pu,
               "provider": {"@type": "Organization", "name": "M365.FM", "url": f"{BASE}/"}, "isAccessibleForFree": True,
               "hasPart": [{"@type": "Article", "name": q["label"][lang], "url": url(BASE, q, lang)} for _, q in items]},
              {"@context": "https://schema.org", "@type": "ItemList", "name": pa["title"][lang], "itemListElement": [{"@type": "ListItem", "position": i, "url": url(BASE, q, lang), "name": q["label"][lang]} for i, q in items]},
              _crumb_ld(BASE, crumbs)]
        write(f"{'de/' if lang == 'de' else ''}learn/path/{pa['id']}/index.html", page(lang, pa["seo_title"][lang], pa["short"][lang], pu, b, alts, ld, xdefault=alts["en"], og_type="website"))
        sitemap.append((pu, UPDATED, alts))
    if cx.warn:
        print(f"Pillars: {len(cx.warn)} Hinweise zu Links (Link entfällt, Text bleibt):")
        for w in sorted(set(cx.warn))[:40]: print("  ", w)
    print(f"Pillars: {made['en']} englische und {made['de']} deutsche Seiten, Pfad mit {len(pillars())} Leitfäden; Cluster-Artikel je Pillar:", {k: v for k, v in counts.items()})
    return made
