"""Anhoeren-Karten ("Stoerer"): in Blogbeitraegen und auf Entitaetsseiten fuehren 1 bis 3 Karten auf eine PASSENDE Folge der Show, dazu der Knopf "Show folgen".

Ziel ist mehr Podcast-Follower: der Klick auf eine Karte geht je nach Geraet direkt in die App (Apple-Geraete -> Apple Podcasts, alle anderen -> Spotify),
das href im HTML ist aber die m365.fm-Folgenseite (ohne JavaScript, fuer Google und Crawler als interne Verlinkung). assets/listen.js setzt das App-Ziel
(Geraeteerkennung nur im Browser, nichts gespeichert, kein Tracking; an den Links steht nur data-card="1|2|3|entity|episode" zum spaeteren Zaehlen im Worker).

Aufbau
- Zuordnung Beitrag -> Folge (match_post), zwei Stufen, strenge Schwellen (lieber keine Karte als eine schlechte Folge):
  Stufe 1 Entitaeten: Themen des Beitrags x QA-geprueftes Extraktionsergebnis der Folge (site_extract), gewichtet mit der Seltenheit der Entitaet (idf).
  Stufe 2 Text (nur Luecken): Aehnlichkeit Beitrag (Titel, Kurztext, Themen) gegen Folge (Titel, Hook, Takeaways); reines Python (TfidfSimilarity).
  Die Aehnlichkeit ist austauschbar (Klasse Similarity, SIMILARITY): spaeter koennen Embeddings (Vektorsuche) sie ersetzen. Ergebnisse je Beitrag
  stehen in data/listen_matches.json (tools/listen_match.py); veraltete Eintraege (Text, Themen, Folgenbestand, Version) rechnet der Bau neu.
- Platzierung (inject): Karte 1 nach dem ersten/zweiten Absatz, Karte 2 ungefaehr in der Mitte (nur lange Beitraege, nur eine zweite gute Folge),
  Karte 3 am Ende ("Show folgen"). Eine gute Folge: Karte 1 + 3, keine: nichts. Nie mitten in Listen, Tabellen, Zitaten oder Bildern.
- Karte = Block (aside) mit EINEM Haupt-Link (::after ueber die ganze Karte) und getrenntem Textlink "Alle Plattformen & Player"; kein verschachteltes <a>.
- Bild: WebP-Banner aus dem R2-Bucket (design/listen/listen-banner.webp -> https://img.m365.fm/listen/..., site_r2.local); solange er dort nicht liegt,
  zeigt die Karte einen CSS-Verlauf schwarz/gelb statt eines kaputten Bildes. Folgen-Cover (Spreaker) bleiben bei Spreaker (CLAUDE.md).
- Sprachen: Name und Hook der Folge in der Sprache des Beitrags, wenn es die Folge dort gibt (Dub-Folge), sonst die englische Folge. Oberflaechentexte ueber site_i18n.T.
"""
import hashlib
import html as _html
import json
import math
import re
from functools import lru_cache
from pathlib import Path

from site_i18n import T

ROOT = Path(__file__).resolve().parent
CACHE_F = ROOT / "data" / "listen_matches.json"
BANNER = "design/listen/listen-banner.webp"
VERSION = 1   # erhoehen, wenn Verfahren oder Schwellen sich aendern: alle gespeicherten Zuordnungen gelten dann als veraltet

# ---------------------------------------------------------------- Schwellen (belegt durch tests/test_listen.py und die Stichprobe in SITE.md)
ENT_MIN = 2.5         # Stufe 1: Summe (Entitaetswert/100 x idf x Rangfaktor) ueber die gemeinsamen Entitaeten
ENT_ANCHOR_RANK = 3    # mindestens eine gemeinsame, nicht allgemeine Entitaet muss unter den ersten 3 Themen des Beitrags stehen ...
ENT_ANCHOR_SCORE = 70  # ... und in der Folge mit mindestens diesem Wert (0-100) vorkommen
ENT_FOCUS_RANK = 5     # Gegenprobe: eine der beiden Haupt-Entitaeten der FOLGE muss unter den ersten 5 Themen des Beitrags stehen (beide Seiten handeln vom Gleichen)
ENT_TXT_MIN = 0.16     # und der Text darf nicht voellig fremd sein (Kosinus mindestens so hoch)
ENT_RANK_MIN = 1.2     # Gesamtwert (Entitaeten + Text, 0-2) einer Entitaets-Folge; darunter nur noch ueber den Text (TXT_MIN)
SECOND_BONUS = 0.1     # Karte 2 muss um so viel ueber der jeweiligen Schwelle liegen (zweite Karte nur bei klarer zweiter Folge)
TXT_SHARED = 3         # und mindestens so viele gemeinsame Woerter (Beitrag: Titel, Kurztext, Themen; Folge: Titel, Hook, Takeaways), sonst genuegen zwei Zufallswoerter bei kurzen Texten
TXT_MIN = 0.36         # Stufe 2: Kosinus-Aehnlichkeit
MAX_CARDS = 2          # Folgen-Karten je Beitrag (Karte 1 und 2); Karte 3 ist immer die Show
MID_MIN_PARAGRAPHS = 6   # Karte 2 nur in Beitraegen mit so vielen Absaetzen
GENERIC = {"microsoft-365", "microsoft", "compliance", "automation", "governance", "security", "ai", "artificial-intelligence", "cloud", "data",
           "microsoft-tool", "copilot", "prompt", "agent", "ai-agent"}   # wie site_topics.GENERIC: zu allgemein, um allein eine Folge zu begruenden

_STOP = set("""the a an and or of to in on for with from by at as is are was were be been it its this that these those your you we our their they he she his her not no
but if then than so such can could should would will just about into over under more most very how what why when where who which do does did doing done has have had
und der die das den dem des ein eine einen einem einer eines oder mit von zu zum zur im in am an auf aus bei fuer ist sind war wird werden nicht auch wie was wer wo
es sich als nach vor ueber unter nur noch mehr sehr dass diese dieser dieses""".split())


def _plain(s):
    return re.sub(r"\s+", " ", _html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()


# ---------------------------------------------------------------- Aehnlichkeit (austauschbar)
def tokens(text):
    """Woerter in Kleinschreibung (Buchstaben/Ziffern, ab 3 Zeichen, ohne Fuellwoerter), einfache Pluralform entfernt."""
    out = []
    for w in re.findall(r"[a-z0-9äöüß][a-z0-9äöüß\-\.]*[a-z0-9äöüß]", (text or "").lower()):
        w = w.strip(".-")
        if len(w) < 3 or w in _STOP:
            continue
        if len(w) > 4 and w.endswith("s") and not w.endswith("ss"):
            w = w[:-1]
        out.append(w)
    return out


class Similarity:
    """Schnittstelle: fit({id: text}) einmal, dann query(text, k=None) -> [(id, 0..1)] absteigend (k=None: alle mit Treffer). Eine Embedding-Fassung (Vektorsuche) setzt dieselben
    zwei Methoden um und ersetzt SIMILARITY; Schwellen (TXT_MIN) muessen dann neu belegt werden (VERSION erhoehen)."""
    def fit(self, docs):
        raise NotImplementedError

    def query(self, text, k=None):
        raise NotImplementedError


class TfidfSimilarity(Similarity):
    """TF-IDF (sublineare Haeufigkeit) und Kosinus in reinem Python, mit invertiertem Index."""
    def fit(self, docs):
        n = max(1, len(docs))
        df = {}
        toks = {i: tokens(t) for i, t in docs.items()}
        for ws in toks.values():
            for w in set(ws):
                df[w] = df.get(w, 0) + 1
        self.idf = {w: math.log(1 + n / c) for w, c in df.items()}
        self.words = {i: set(ws) for i, ws in toks.items()}
        self.vec, self.post = {}, {}
        for i, ws in toks.items():
            v = self._weigh(ws)
            self.vec[i] = v
            for w, x in v.items():
                self.post.setdefault(w, []).append((i, x))
        return self

    def _weigh(self, ws):
        tf = {}
        for w in ws:
            if w in self.idf:
                tf[w] = tf.get(w, 0) + 1
        v = {w: (1 + math.log(c)) * self.idf[w] for w, c in tf.items()}
        norm = math.sqrt(sum(x * x for x in v.values())) or 1.0
        return {w: x / norm for w, x in v.items()}

    def shared(self, text, i):
        """Anzahl gemeinsamer Woerter von text und Dokument i (nur Verfahren mit Woertern; Embeddings haben das nicht und werden allein ueber die Aehnlichkeit geprueft)."""
        return len(set(tokens(text)) & self.words.get(i, set()))

    def query(self, text, k=None):
        q = self._weigh(tokens(text))
        acc = {}
        for w, x in q.items():
            for i, y in self.post.get(w, ()):
                acc[i] = acc.get(i, 0.0) + x * y
        return sorted(acc.items(), key=lambda t: (-t[1], t[0]))[:k]   # k=None: alle mit mindestens einem gemeinsamen Wort


SIMILARITY = TfidfSimilarity


# ---------------------------------------------------------------- Folgen-Katalog
def curiosity(text, limit=150):
    """Neugier-Zeile aus Hook oder Takeaway: der erste Satz (bei sehr kurzem ein zweiter), ohne Markdown, hoechstens limit Zeichen an Wortgrenze."""
    t = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text or "")
    t = _plain(re.sub(r"[*_`]+", "", t))
    if not t:
        return ""
    sents = re.split(r"(?<=[.!?…])\s+", t)
    out, n = "", 0
    for s in sents:
        if out and (n >= 3 or re.match(r"(?i)^(this episode|in this episode|you will learn|you.ll learn|dieser|in dieser|du erf)", s)):
            break
        cand = (out + " " + s).strip()
        if len(cand) > limit:
            break
        out, n = cand, n + 1
        if len(out) >= 70:
            break
    if not out:   # ein langer erster Satz: an einer Satzfuge (Komma, Doppelpunkt, Gedankenstrich) kuerzen, sonst an der Wortgrenze; "…" macht neugierig statt abgeschnitten
        cut = t[:limit]
        m = max(cut.rfind(", "), cut.rfind(": "), cut.rfind(" – "), cut.rfind(" — "), cut.rfind("; "))
        out = (cut[:m] if m >= 60 else cut.rsplit(" ", 1)[0]).rstrip(",;:-–— ") + "…"
    return out


class Catalog:
    """Folgen der Hauptshow als Datensaetze: id, slug, title, hook, minutes, cover, url, apple, spotify, yt, ents {slug: score}, text.
    Entitaeten stammen aus der QA-gepruefte Extraktion (site_extract); nur Folgen mit Titel und Text sind waehlbar."""
    def __init__(self, episodes, similarity=None):
        self.eps = {}
        for e in episodes:
            if e.get("id") and e.get("title") and e.get("text"):
                self.eps[str(e["id"])] = e
        self.by_entity = {}
        for sid, e in self.eps.items():
            e["focus"] = _focus(e.get("ents") or {})
            for slug, sc in (e.get("ents") or {}).items():
                self.by_entity.setdefault(slug, []).append((sid, float(sc)))
        n = max(1, sum(1 for e in self.eps.values() if e.get("ents")))
        self.idf = {slug: math.log(1 + n / len(v)) for slug, v in self.by_entity.items()}
        self.sim = (similarity or SIMILARITY)().fit({sid: e["text"] for sid, e in self.eps.items()})
        self.fingerprint = hashlib.sha1("|".join(f"{sid}:{len(e['text'])}:{len(e.get('ents') or {})}" for sid, e in sorted(self.eps.items())).encode()).hexdigest()[:12]


def _focus(ents):
    """Die beiden Haupt-Entitaeten einer Folge (hoechste Werte, ohne allgemeine; Gleichstand mit dem zweiten zaehlt mit)."""
    ranked = sorted(((s, slug) for slug, s in ents.items() if slug not in GENERIC), reverse=True)
    if not ranked:
        return set()
    cut = ranked[min(1, len(ranked) - 1)][0]
    return {slug for s, slug in ranked if s >= cut}


def _entity_scores(cat, topics):
    """sid -> (Summe, verankert?). Rangfaktor: Themen 1-3 voll, 4-6 halb, danach ein Viertel; allgemeine Entitaeten (GENERIC) zaehlen nicht."""
    acc, anchor = {}, set()
    for rank, t in enumerate(topics[:10]):
        if t in GENERIC or t not in cat.by_entity:
            continue
        w = 1.0 if rank < 3 else 0.5 if rank < 6 else 0.25
        for sid, sc in cat.by_entity[t]:
            acc[sid] = acc.get(sid, 0.0) + w * (sc / 100.0) * cat.idf[t]
            if rank < ENT_ANCHOR_RANK and sc >= ENT_ANCHOR_SCORE:
                anchor.add(sid)
    return acc, anchor


def match_post(cat, topics, title, summary="", text="", topic_names=(), limit=3):
    """Beitrag -> [{"episode": id, "score": float, "via": "ent"|"txt"}], beste zuerst, nur ueber den Schwellen, keine zwei Folgen mit gleichem Titel.
    Stufe 1 (ent): Entitaeten der Folge (Summe >= ENT_MIN, verankert in den ersten Themen, Haupt-Entitaet der Folge im Beitrag, Text nicht fremd).
    Stufe 2 (txt): Text-Aehnlichkeit >= TXT_MIN fuer Beitraege ohne Entitaetstreffer. Gereiht wird nach beiden Belegen zusammen (Entitaeten + Text)."""
    topics = list(topics or [])
    ent, anchor = _entity_scores(cat, topics)
    q = " ".join([title or ""] * 3 + [summary or ""] + [n for n in topic_names for _ in (0, 1)] + [(text or "")[:400]])
    txt = dict(cat.sim.query(q))
    top = {t for t in topics[:ENT_FOCUS_RANK] if t not in GENERIC}
    rank = lambda sid: min(1.0, ent.get(sid, 0.0) / 6.0) + min(1.0, txt.get(sid, 0.0) / 0.5)
    cand = {}
    for sid, sc in ent.items():
        if sc >= ENT_MIN and sid in anchor and cat.eps[sid]["focus"] & top and txt.get(sid, 0.0) >= ENT_TXT_MIN and rank(sid) >= ENT_RANK_MIN:
            cand[sid] = "ent"
    shared = getattr(cat.sim, "shared", None)
    for sid, c in txt.items():
        if c >= TXT_MIN and sid not in cand and (shared is None or shared(q, sid) >= TXT_SHARED):
            cand[sid] = "txt"
    rows = sorted(((rank(sid), sid) for sid in cand), reverse=True)
    out, seen = [], set()
    for sc, sid in rows:
        key = re.sub(r"\W+", "", cat.eps[sid]["title"].lower())
        if key in seen:
            continue
        if out and not ((cand[sid] == "ent" and sc >= ENT_RANK_MIN + SECOND_BONUS) or (cand[sid] == "txt" and txt[sid] >= TXT_MIN + SECOND_BONUS)):
            continue   # zweite und dritte Folge: strenger
        seen.add(key)
        out.append({"episode": sid, "score": round(sc, 3), "via": cand[sid]})
        if len(out) >= limit:
            break
    return out


def post_hash(slug, title, summary, topics):
    return hashlib.sha1(json.dumps([VERSION, slug, title, summary, list(topics or [])], ensure_ascii=False).encode("utf-8")).hexdigest()[:12]


def load_cache(path=CACHE_F):
    try:
        d = json.loads(Path(path).read_text("utf-8"))
        return d if isinstance(d, dict) and isinstance(d.get("posts"), dict) else {"version": VERSION, "catalog": "", "posts": {}}
    except (OSError, ValueError):
        return {"version": VERSION, "catalog": "", "posts": {}}


def save_cache(cache, path=CACHE_F):
    Path(path).write_text(json.dumps(cache, ensure_ascii=False, separators=(",", ":"), sort_keys=True), "utf-8")


# ---------------------------------------------------------------- Texte
def _t(lang, en, de):
    return T(lang, en, de)


def ui_text(lang):
    return {"badge": _t(lang, "You should listen to this", "Das solltest du dir anhören"),
            "all": _t(lang, "All platforms & player", "Alle Plattformen & Player"),
            "follow": _t(lang, "Follow the show", "Show folgen"),
            "followline": _t(lang, "New episodes on Microsoft 365, Copilot and more, free in your podcast app.", "Neue Folgen zu Microsoft 365, Copilot und mehr, kostenlos in deiner Podcast-App."),
            "min": _t(lang, "{n} min", "{n} Min.")}


# ---------------------------------------------------------------- Karten (HTML)
def _esc(s):
    return _html.escape(str(s if s is not None else ""), quote=True)


@lru_cache(maxsize=1)
def _dims():
    try:
        return json.loads((ROOT / "data" / "r2_dims.json").read_text("utf-8"))
    except (OSError, ValueError):
        return {}


def banner_url():
    """R2-URL des Banners oder None, solange der Workflow r2-images.yml ihn nicht hochgeladen hat (dann zeigen die Karten den CSS-Verlauf)."""
    import site_r2 as R2
    return R2.local(BANNER)


def _bg_img():
    u = banner_url()
    if not u:
        return ""
    w, h = (_dims().get(u) or [1200, 360])[:2]
    return f'<img class="ls-bg" style="max-width:none" src="{_esc(u)}" alt="" width="{int(w)}" height="{int(h)}" loading="lazy" decoding="async">'


def _data(apple, spotify):
    return (f' data-apple="{_esc(apple)}"' if apple else "") + (f' data-spotify="{_esc(spotify)}"' if spotify else "")


def card_html(lang, item, n, compact=False):
    """Karte fuer eine Folge. item: {title, hook, minutes, cover, page, apple, spotify}. n: "1"|"2"|"entity". Haupt-Link = Folgenseite (href), App-Ziel per Skript."""
    s = ui_text(lang)
    mins = f' · {_esc(s["min"].format(n=item["minutes"]))}' if item.get("minutes") and not compact else ""
    cover = (f'<img class="ls-cover" src="{_esc(item["cover"])}" alt="" width="{48 if compact else 96}" height="{48 if compact else 96}" loading="lazy" decoding="async">' if item.get("cover") else "")
    badge = f'<span class="ls-badge"><span aria-hidden="true">▶ </span>{_esc(s["badge"])}{mins}</span>'
    main = f'<a class="ls-main" href="{_esc(item["page"])}" data-card="{n}">{_esc(item["title"])}</a>'
    if compact:
        return f'<div class="ls-card ls-mini"{_data(item.get("apple"), item.get("spotify"))}>{cover}<div class="ls-t">{badge}{main}</div></div>'
    hook = f'<p class="ls-hook">{_esc(item["hook"])}</p>' if item.get("hook") else ""
    allp = f'<a class="ls-all" href="{_esc(item["page"])}" data-card="all">{_esc(s["all"])}</a>'
    bg = _bg_img()
    return (f'<aside class="ls-card ls-c{n}{"" if bg else " ls-nobg"}" aria-label="{_esc(s["badge"])}"{_data(item.get("apple"), item.get("spotify"))}>{bg}'
            f'<div class="ls-t">{badge}{cover}{main}{hook}{allp}</div></aside>')


def follow_html(lang, show, n="episode", compact=False):
    """"Show folgen": Hauptknopf nach Geraet (per Skript), kleiner der andere Link; ohne JavaScript beide Links gleichwertig (target=_blank, rel=noopener).
    show: {"apple": url, "spotify": url} (Links der Show). n: "3" (Ende des Beitrags) oder "episode" (Folgenseite). Fehlt jeder Link: leer. Nur das Markup (Stil und Skript: page_assets)."""
    apple, spotify = (show or {}).get("apple") or "", (show or {}).get("spotify") or ""
    if not apple and not spotify:
        return ""
    s = ui_text(lang)
    links = "".join(f'<a class="ls-fb" data-lp="{key}" data-card="{n}" href="{_esc(url)}" target="_blank" rel="noopener">{label}</a>'
                    for key, label, url in (("apple", "Apple Podcasts", apple), ("spotify", "Spotify", spotify)) if url)
    line = "" if compact else f'<span class="ls-fl">{_esc(s["followline"])}</span>'
    return f'<div class="ls-follow{" ls-f3" if n == "3" else ""}" role="group" aria-label="{_esc(s["follow"])}"><span class="ls-ft">{_esc(s["follow"])}</span>{line}<span class="ls-fa">{links}</span></div>'


def script_tag(base):
    return f'<script defer src="{base}/assets/listen.js"></script>'


def page_assets(base, cards=True):
    """Stil (und Skript) einmal je Seite: cards=True fuer Beitraege/Entitaetsseiten (Karten + Knopf), False nur fuer den Knopf auf Folgenseiten."""
    return (CSS_CARD if cards else "") + CSS_FOLLOW + script_tag(base)


# ---------------------------------------------------------------- Platzierung im Beitragstext
_BLOCK_OPEN = re.compile(r"<(/?)(p|ul|ol|table|blockquote|figure|details|pre|dl|aside|form|nav|li|h[1-6])\b[^>]*?(/?)>", re.I)
_UNSAFE = {"ul", "ol", "table", "blockquote", "figure", "details", "pre", "dl", "aside", "form", "nav", "li"}


def paragraph_ends(html):
    """Stellen (Zeichenpositionen) hinter </p>, an denen eine Karte stehen darf: Absatz mit mindestens 40 Zeichen Text, nicht in Liste, Tabelle, Zitat, Bild, Details
    oder Code, und nicht, wenn der Absatz mit ':' endet (er leitet eine folgende Liste ein)."""
    depth, start, out = 0, None, []
    for m in _BLOCK_OPEN.finditer(html or ""):
        close, tag = bool(m.group(1)), m.group(2).lower()
        if tag in _UNSAFE:
            depth = max(0, depth - 1) if close else depth + 1
        elif tag == "p" and not close and depth == 0:
            start = m.end()
        elif tag == "p" and close and depth == 0 and start is not None:
            body = _plain(html[start:m.start()])
            if len(body) >= 40 and not body.endswith(":"):
                out.append(m.end())
            start = None
    return out


def place(html, cards):
    """cards: [(rolle, html)] mit rolle "1", "2", "3". Fuegt sie in html ein: 1 hinter dem ersten/zweiten Absatz, 2 in der Mitte, 3 am Ende. -> html"""
    ends = paragraph_ends(html)
    n = len(ends)
    at = {}
    by = {r: h for r, h in cards}
    if "1" in by:
        at[ends[min(1, n - 1)] if n else len(html)] = by["1"]
    if "2" in by and n >= MID_MIN_PARAGRAPHS:
        k = n // 2
        pos = ends[k]
        if pos not in at and k >= min(1, n - 1) + 2:
            at[pos] = by["2"]
    out, last = [], 0
    for pos in sorted(at):
        out.append(html[last:pos]); out.append(at[pos]); last = pos
    out.append(html[last:])
    return "".join(out) + by.get("3", "")


# ---------------------------------------------------------------- Aufloesung je Sprache und Plattform
def show_links(lang, platforms=None):
    """Links der Show in der Sprache {"apple", "spotify"} (data/platforms.json); ohne eigene Show der Sprache (weder Apple noch Spotify) die englische. Hat die Sprache nur
    Spotify, bleibt Apple leer: das Skript schickt Apple-Geraete dann zu Spotify statt zur englischen Show."""
    pl = platforms if platforms is not None else _json("platforms.json")
    sh = pl.get(lang) or {}
    if not sh.get("apple_show") and not sh.get("spotify_show"):
        sh = pl.get("en") or {}
    return {"apple": sh.get("apple_show") or "", "spotify": sh.get("spotify_show") or ""}


class Site:
    """Alles, was zum Rendern gebraucht wird: Katalog, Links der Plattformen, Dub-Zuordnung (orig_alts), uebersetzte Teaser. Im Seitenbau einmal aus dem
    Kontext gebaut (configure); Tests setzen sie direkt zusammen."""
    def __init__(self, cat, base="https://www.m365.fm", platforms=None, orig_alts=None, episode_links=None, spotify_links=None, teasers=None, cache=None):
        self.cat, self.base = cat, base
        self.platforms = platforms or {}
        self.orig_alts = orig_alts or {}
        self.elinks, self.slinks = episode_links or {}, spotify_links or {}
        self.teasers = teasers if teasers is not None else {}   # lang -> {slug: [Titel, Teaser]} (oder Funktion lang -> dict)
        self.cache = cache if cache is not None else {"posts": {}}
        self.stats = {"cached": 0, "computed": 0}
        self._mem, self._orig = {}, {}

    def show(self, lang):
        return show_links(lang, self.platforms)

    def teaser(self, lang, slug):
        d = self.teasers(lang) if callable(self.teasers) else self.teasers.get(lang, {})
        return (d.get(slug) or [None, None])[1] or ""

    def item(self, sid, lang):
        """Folge sid in der Sprache der Seite -> Karten-Datensatz. Mit Dub-Folge in der Sprache: deren Name, Seite und Plattform-Links; sonst die englische Folge."""
        e = self.cat.eps[sid]
        it = {"title": e["title"], "hook": e.get("hook") or "", "minutes": e.get("minutes") or 0, "cover": e.get("cover") or "", "page": e["url"],
              "apple": e.get("apple") or "", "spotify": e.get("spotify") or ""}
        if lang != "en":
            alt = (self.orig_alts.get(e["slug"]) or {}).get(lang)
            if alt:
                url, title = alt
                yt = e.get("yt") or ""
                el = self.elinks.get(f"{yt}:{lang}") or {}
                sh = self.show(lang)
                hook = curiosity(self.teaser(lang, e["slug"]))
                it.update(title=title or it["title"], page=url, hook=hook, apple=el.get("apple") or sh["apple"], spotify=el.get("spotify") or self.slinks.get(f"{yt}:{lang}") or sh["spotify"])
                return it
        sh = self.show("en")   # englische Folge: fehlt der Folgenlink, der Link der Show
        it["apple"], it["spotify"] = it["apple"] or sh["apple"], it["spotify"] or sh["spotify"]
        return it

    def index_posts(self, posts):
        """Die englischen Originale merken: Sprachfassungen (tr_of) bekommen dieselbe Zuordnung wie ihr Original (Titel und Kurztext der Uebersetzung
        waeren gegen englische Folgen sinnlos), auch wenn ihre Seite vor dem Original gebaut wird (Entitaetsseiten)."""
        for p in posts:
            if not p.get("tr_of") and (p.get("lang") or "en") == "en":
                self._orig.setdefault((p.get("handle"), p["slug"]), p)   # je Autor: Slugs sind nur je Autor eindeutig

    def post_matches(self, p, ents=None):
        """Zuordnung fuer einen Beitrag: [{"episode", "score", "via"}], mit Zwischenspeicher (data/listen_matches.json) und je Bau nur einmal je Slug."""
        src = (self._orig.get((p.get("handle"), p["slug"])) if p.get("tr_of") else None) or p
        title, summary, topics = src.get("title") or "", src.get("summary") or "", list(src.get("topics") or [])
        h = post_hash(src["slug"], title, summary, topics)
        k = (src["slug"], h)
        if k not in self._mem:
            c = (self.cache.get("posts") or {}).get(src["slug"])
            if c and c.get("h") == h and self.cache.get("catalog") == self.cat.fingerprint and self.cache.get("version") == VERSION:
                self.stats["cached"] += 1
                self._mem[k] = [m for m in c["m"] if m["episode"] in self.cat.eps]
            else:
                self.stats["computed"] += 1
                self._mem[k] = match_post(self.cat, topics, title, summary, "", [ents[t]["name"] for t in topics if ents and t in ents])
        return self._mem[k]

    def cards_for_post(self, p, lang, ents=None):
        """-> [(rolle, html)]: Karte 1 und 2 (je eine Folge) und Karte 3 (Show folgen); leer, wenn keine Folge ueber den Schwellen liegt."""
        ms = self.post_matches(p, ents)[:MAX_CARDS]
        if not ms:
            return []
        cards = [(str(i + 1), card_html(lang, self.item(m["episode"], lang), str(i + 1))) for i, m in enumerate(ms)]
        cards.append(("3", follow_html(lang, self.show(lang), "3", compact=True)))
        return cards

    def inject(self, body_html, p, lang, ents=None):
        """Beitragstext mit Karten (oder unveraendert, wenn keine Folge passt). Stil und Skript einmal je Seite."""
        cards = self.cards_for_post(p, lang, ents)
        if not cards:
            return body_html
        return CSS_CARD + CSS_FOLLOW + place(body_html, cards) + script_tag(self.base)

    def entity_cards(self, posts, lang, ents=None):
        """Entitaetsseite: kompakte Karte je aufgelistetem Beitrag mit guter Folge; dieselbe Folge nur beim ersten Beitrag, danach nichts.
        -> {(handle, slug, sprache): html}"""
        seen, out = set(), {}
        for p in posts:
            ms = self.post_matches(p, ents)[:1]
            if not ms or ms[0]["episode"] in seen:
                continue
            seen.add(ms[0]["episode"])
            pl = p.get("lang") or lang
            out[(p.get("handle"), p["slug"], p.get("lang"))] = card_html(pl, self.item(ms[0]["episode"], pl), "entity", compact=True)
        return out


_SITE = {}


def get(base=None):
    """Die im Seitenbau konfigurierte Site (oder None: dann gibt es keine Karten, z. B. in anderen Werkzeugen)."""
    return _SITE.get(base) if base else (next(iter(_SITE.values()), None))


def reset():
    _SITE.clear()


def duration_minutes(seconds, iso=""):
    """Dauer in ganzen Minuten (mindestens 1; 0 = unbekannt); Sekunden aus der Extraktion, sonst ISO-Dauer der Folgenseite (PT1H2M3S)."""
    sec = int(seconds or 0)
    if not sec and iso:
        m = re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso)
        if m:
            sec = int(m.group(1) or 0) * 3600 + int(m.group(2) or 0) * 60 + int(m.group(3) or 0)
    return max(1, round(sec / 60)) if sec > 0 else 0


def build_catalog(base):
    """Katalog aus den Folgen der Hauptshow (site_podpage.episode_index), den Shownotes-Vollfassungen (Hook, Takeaways) und der QA-gepruefte Extraktion."""
    import site_extract as SX
    import site_podpage as PP
    import site_shownotes as SNS
    idx = PP.episode_index(base)
    full = SNS.load_all()
    recs = {e["slug"]: e for e in PP.load("episodes")}
    elinks = _json("episode_links.json")
    rss = {str(v.get("spreaker_id")): v for v in _json("en_episodes.json").values() if isinstance(v, dict)}   # Dauer laut RSS in Sekunden (Folgen ohne Extraktion)
    eps = []
    for it in idx["items"]:
        sid, slug = it.get("sid") or "", it["slug"]
        rec = full.get(str(sid)) if sid else None
        meta = (rec or {}).get("meta") or {}
        take = [str(x) for x in (meta.get("takeaways") or []) if isinstance(x, str)]
        hook = curiosity(meta.get("hook") or "") or (curiosity(take[0]) if take else "") or (curiosity(it["keypoints"][0]) if it.get("keypoints") else "") or curiosity(it.get("sum") or "")
        e = recs.get(slug) or {}
        r = str((rss.get(str(sid)) or {}).get("duration") or "").strip()
        sec = SX.duration_of(sid) or (int(r) if r.isdigit() else 0)
        cover = (e.get("image_path") or "")
        cover = cover if cover.startswith("https://") and "None" not in cover and "ytimg.com" not in cover else ""   # quadratisches Folgen-Cover (Spreaker); YouTube-Vorschau ist 16:9
        elk = {**(elinks.get(f"{sid}:en") or {}), **(elinks.get(str(sid)) or {})} if sid else {}
        ents = dict(((SX.BY_EPISODE.get(str(sid)) or {}).get("entities")) or []) if sid else {}
        text = " ".join([it["e"]["title"]] * 3 + [meta.get("hook") or "", it.get("sum") or ""] + take + list(it.get("keypoints") or [])).strip()
        eps.append({"id": str(sid or "s:" + slug), "slug": slug, "title": it["e"]["title"], "hook": hook, "minutes": duration_minutes(sec, it.get("duration") or ""),
                    "cover": cover, "url": it["url"], "yt": it.get("yt") or "", "ents": ents, "text": text,
                    "apple": elk.get("apple") or e.get("episode_apple_url_path") or "", "spotify": elk.get("spotify") or e.get("episode_spotify_url_path") or ""})
    return Catalog(eps)


@lru_cache(maxsize=None)
def _json(name):   # nur lesen
    try:
        return json.loads((ROOT / "data" / name).read_text("utf-8"))
    except (OSError, ValueError):
        return {}


def configure(g):
    """Im Seitenbau aufrufen (nach orig_alts und yt_of, vor Beitraegen und Entitaetsseiten): baut Katalog und Site einmal. Fehler brechen den Bau nicht ab, es gibt dann keine Karten."""
    base = g["BASE"]
    try:
        cat = build_catalog(base)
        yt = g.get("yt_of")
        if yt:   # YouTube-Video der Folge (Schluessel der Dub-Links "<video>:<sprache>")
            for e in cat.eps.values():
                e["yt"] = e.get("yt") or yt({"lang": "en", "slug": e["slug"], "yt": e.get("yt")}) or ""
        lang_cache = {}

        def teasers(lang):
            if lang not in lang_cache:
                lang_cache[lang] = _json(f"podpage_i18n/{lang}.json") if (ROOT / "data" / "podpage_i18n" / f"{lang}.json").exists() else {}
            return lang_cache[lang]
        sp = _json("spotify_links.json")
        s = Site(cat, base, _json("platforms.json"), g.get("orig_alts") or {}, _json("episode_links.json"), sp, teasers, load_cache())
        _SITE[base] = s
        print(f"Anhoeren-Karten: Katalog {len(cat.eps)} Folgen, Banner {'in R2' if banner_url() else 'noch nicht in R2 (CSS-Verlauf)'}")
        return s
    except Exception as ex:   # nie den Bau gefaehrden
        print(f"WARNUNG: Anhoeren-Karten ausgeschaltet ({ex.__class__.__name__}: {ex})")
        _SITE.pop(base, None)
        return None


def follow_for(base, lang):
    """Knopf "Show folgen" mit Stil und Skript fuer Folgenseiten der Sprache (leer ohne Show-Links). Unabhaengig vom Katalog (configure)."""
    h = follow_html(lang, show_links(lang), "episode")
    return page_assets(base, cards=False) + h if h else ""


def apply(base, body_html, p, lang, ents=None):
    """Karten in einen Beitragstext einfuegen; ohne Konfiguration (configure) oder bei einem Fehler bleibt der Text unveraendert."""
    s = get(base)
    if not s:
        return body_html
    try:
        return s.inject(body_html, p, lang, ents)
    except Exception as ex:   # eine Karte darf nie eine Seite oder den Bau kosten
        print(f"WARNUNG: Anhoeren-Karte fuer {p.get('slug')} ausgelassen ({ex.__class__.__name__}: {ex})")
        return body_html


def apply_entities(base, posts, lang, ents=None):
    """Karten fuer die Beitragsliste einer Entitaetsseite: {(handle, slug, sprache): html} (leer ohne Konfiguration oder bei Fehler)."""
    s = get(base)
    if not s:
        return {}
    try:
        return s.entity_cards(posts, lang, ents)
    except Exception as ex:
        print(f"WARNUNG: Anhoeren-Karten der Entitaetsseite ausgelassen ({ex.__class__.__name__}: {ex})")
        return {}


# ---------------------------------------------------------------- Stil und Skript
CSS_CARD = (
    "<style>.ls-card{position:relative;isolation:isolate;display:block;margin:1.6rem 0;padding:1.1rem 1.2rem 2.6rem;border-radius:12px;color:#fff;"
    "background:linear-gradient(100deg,#3a3000 0,#111 38%,#000 100%);border:1px solid #3a3a3a;font-family:inherit;line-height:1.3}"
    ".ls-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:left bottom;border-radius:inherit;z-index:-1}"
    ".ls-t{padding-inline-start:min(26%,200px)}.ls-t::after{content:\"\";display:block;clear:both}"
    ".ls-cover{float:right;width:96px;height:96px;margin:0 0 .6rem 1rem;border-radius:8px;object-fit:cover;background:#222}[dir=rtl] .ls-cover{float:left;margin:0 1rem .6rem 0}"
    ".ls-badge{display:block;width:fit-content;background:#ffe600;color:#000;font-weight:800;letter-spacing:.06em;font-size:.82rem;line-height:1.2;padding:.3em .7em;border-radius:4px;text-transform:uppercase}"
    ".ls-main{display:block;margin-top:.6rem;color:#fff;font-size:clamp(1.15rem,2.6vw,1.6rem);font-weight:800;line-height:1.15;text-decoration:none}"
    ".ls-main:hover{text-decoration:underline;text-underline-offset:.15em}.ls-main::after{content:\"\";position:absolute;inset:0;z-index:2;border-radius:inherit}"
    ".ls-main:focus-visible{outline:none}.ls-main:focus-visible::after{outline:3px solid #ffe600;outline-offset:3px}"
    ".ls-hook{margin:.55rem 0 0;color:#ffe600;font-size:1rem}.ls-all{position:relative;z-index:3;display:inline-block;margin-top:.7rem;color:#fff;font-size:.88rem;text-decoration:underline;text-underline-offset:.15em}"
    ".ls-all:focus-visible{outline:3px solid #ffe600;outline-offset:2px}.ls-nobg{padding-bottom:1.2rem;border-inline-start:6px solid #ffe600}.ls-nobg .ls-t{padding-inline-start:0}"
    ".ls-mini{display:flex;gap:.7rem;align-items:center;margin:.5rem 0 .2rem;padding:.55rem .7rem;border-radius:8px}.ls-mini .ls-t{padding-inline-start:0;min-width:0}"
    ".ls-mini .ls-cover{float:none;flex:none;width:48px;height:48px;margin:0;order:-1}.ls-mini .ls-main{font-size:1rem;margin-top:.35rem}.ls-mini .ls-badge{font-size:.72rem}"
    "@media(max-width:560px){.ls-card:not(.ls-mini){padding:0 0 1rem}.ls-card:not(.ls-mini) .ls-t{padding:1rem 1rem 0}.ls-card:not(.ls-mini) .ls-bg{position:static;display:block;height:84px;width:100%;object-position:left center;border-radius:12px 12px 0 0}"
    ".ls-card:not(.ls-mini) .ls-cover{width:72px;height:72px}.ls-card:not(.ls-mini):not(:has(.ls-bg)) .ls-t{padding-top:1rem}}"
    "@media(prefers-reduced-motion:no-preference){.ls-card{transition:box-shadow .15s}.ls-card:hover{box-shadow:0 0 0 2px #ffe600}}</style>")

CSS_FOLLOW = (
    "<style>.ls-follow{display:flex;flex-wrap:wrap;gap:.5rem 1rem;align-items:center;margin:1.2rem 0;padding:.8rem 1rem;border-radius:10px;background:#111;color:#fff;border:1px solid #3a3a3a}"
    ".ls-ft{font-weight:800;color:#ffe600}.ls-fl{flex:1 1 14rem;font-size:.95rem}.ls-fa{display:inline-flex;gap:.8rem;align-items:center;flex-wrap:wrap}"
    ".ls-fb{display:inline-block;padding:.5em 1em;border-radius:6px;border:2px solid #ffe600;color:#fff;font-weight:700;text-decoration:none}.ls-fb:hover{background:#2a2400}"
    ".ls-fb.ls-btn{background:#ffe600;color:#000}.ls-fb.ls-btn:hover{background:#fff}.ls-fb.ls-alt{border:0;padding:.2em 0;font-weight:400;font-size:.88rem;text-decoration:underline;text-underline-offset:.15em}"
    ".ls-fb:focus-visible{outline:3px solid #fff;outline-offset:2px}.ls-f3{margin:1.6rem 0;padding:.6rem .9rem}</style>")
