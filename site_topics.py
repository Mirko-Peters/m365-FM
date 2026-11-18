"""Themen-Zuordnung, Verlinkung und Verwandtschaft fuer Beitraege (Paket 8).
- score_topics: Entitaeten eines Textes mit Gewicht (Titel 4, Anfang 2, Rest 1; allgemeine Begriffe wie "Microsoft 365" nur, wenn sie im Titel stehen oder nichts Spezifischeres da ist).
- autolink_html: erste Nennung jeder Entitaet im HTML auf ihre Seite verlinken (site_entmatch, ohne Obergrenze, nie Ueberschriften oder bestehende Links).
- related: verwandte Beitraege ueber gemeinsame Themen (Hauptthema zaehlt doppelt), dann nach Datum.
Ergebnisse der Zuordnung werden je Beitrag in data/cache/blog_topics.json gehalten (Hash von Titel und Textanfang)."""
import hashlib, html as _h, json, re
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).parent
CACHE = ROOT / "data" / "cache" / "blog_topics.json"
GENERIC = {"microsoft-365", "microsoft", "compliance", "automation", "governance", "security", "ai", "artificial-intelligence", "cloud", "data", "microsoft-tool", "copilot", "prompt", "agent", "ai-agent"}
_C = {}


def _load():
    global _C
    if not _C and CACHE.exists():
        try: _C = json.loads(CACHE.read_text("utf-8"))
        except Exception: _C = {}
    return _C


def save():
    try:
        CACHE.parent.mkdir(parents=True, exist_ok=True); CACHE.write_text(json.dumps(_C, ensure_ascii=False), encoding="utf-8")
    except Exception:
        pass


_FP = {}


def _fp(ix):
    """Kurzer Fingerabdruck des Entitaeten-Index (IDs und Namen), damit der Themen-Cache nach neuen Entitaeten nicht veraltet."""
    k = id(ix)
    if k not in _FP:
        _FP[k] = hashlib.sha1(("entmatch-1|" + "|".join(sorted(ix.names))).encode("utf-8")).hexdigest()[:10]   # entmatch-1: Erkennung ueber site_entmatch
    return _FP[k]


def score_topics(ix, title, text, k=10, key=None):
    """-> [eid, ...] nach Gewicht; key: Cache-Schluessel (z. B. Slug). Erkennung ueber den gemeinsamen Namensindex (site_entmatch ueber ix.m):
    Titel und Text als ein Kontext, damit mehrdeutige Kurznamen nur mit Stuetze der uebrigen Themen zaehlen."""
    h = hashlib.sha1((title + "\n" + text[:12000] + "\n" + _fp(ix)).encode("utf-8")).hexdigest()[:12]   # Fingerabdruck der Entitaeten: neue Entitaeten werten den Cache neu aus
    if key:
        c = _load().get(key)
        if c and c.get("h") == h: return list(c["t"])
    m = getattr(ix, "m", None)
    if m is None or not m.rx:
        return []
    body = text[:12000]
    plain = title + "\n" + body
    T0 = len(title) + 1
    sc, in_title = {}, set()
    for s, e, t, i in m.resolve(plain):
        if i not in ix.by: continue
        if s < T0: w = 4; in_title.add(i)
        else:
            p = s - T0; w = 2 if p < 600 else 1 if p < 3000 else 0.5   # ganzer Artikel: spaeter Genanntes zaehlt ab zwei Nennungen
        sc[i] = sc.get(i, 0) + w
    for i in list(sc):
        if i in GENERIC and i not in in_title: sc[i] *= 0.35   # allgemeine Begriffe nur mit Titeltreffer voll werten
    order = sorted(sc, key=lambda i: (-sc[i], i in GENERIC, i))
    top = [i for i in order if sc[i] >= 1][:k] or order[:min(k, 2)]
    spec = [i for i in top if i not in GENERIC and ix.by[i]["type"] not in ("category",)]
    if spec and top and top[0] in GENERIC: top = [spec[0]] + [i for i in top if i != spec[0]]   # Hauptthema moeglichst spezifisch
    if key:
        _load()[key] = {"h": h, "t": top}
    return top


def autolink_html(html, ents, url_of, max_links=None, exclude=(), lang="en", ctx=(), used=None, attrs=None):
    """Kontext-Links im HTML eines Beitrags (site_entmatch.Matcher.link_html): erste Nennung je Entitaet ohne Obergrenze, nie in Ueberschriften,
    Links, Code oder Bildunterschriften, keine Selbstverweise (exclude), Linktext wie im Satz. max_links bleibt nur fuer alte Aufrufer (None = alle).
    ctx: Themen der Seite (Kontext fuer mehrdeutige Kurznamen); used: auf der Seite schon verlinkte ids. -> (html, [(text, url, id)])"""
    import site_entmatch as EM
    m = EM.shared(ents)
    h, links = m.link_html(html, url_of, lang=lang, ctx=set(ctx or ()) | set(exclude or ()), exclude=exclude, used=used, attrs=attrs)
    if max_links is not None and len(links) > max_links:   # nur fuer Werkzeuge, die die alte Obergrenze nachstellen
        h, links = m.link_html(html, url_of, lang=lang, ctx=set(ctx or ()) | set(exclude or ()), exclude=set(exclude or ()) | {i for _, i in links[max_links:]}, used=None, attrs=attrs)
    return h, [(t, url_of(i), i) for t, i in links]


def common_topic(p, rel):
    """Thema des Beitrags, das ALLE verwandten Beitraege (related) tragen, in der Reihenfolge der Themen des Beitrags (Hauptthema zuerst); sonst None.
    Fuer den Einleitungssatz "Weitere Artikel zu {Thema}" (site_linkctx post.more)."""
    if not rel:
        return None
    return next((t for t in (p.get("topics") or []) if all(t in (q.get("topics") or []) for q in rel)), None)


def related(posts, p, k=6):
    """Verwandte Beitraege nach Themen-Ueberschneidung (Hauptthema doppelt), dann nach Datum; gleiche Sprache."""
    t = p.get("topics") or []
    if not t: return []
    w = {x: (2 if n == 0 else 1) for n, x in enumerate(t)}
    out = []
    for q in posts:
        if q is p or q.get("slug") == p.get("slug") and q.get("handle") == p.get("handle"): continue
        if q.get("lang") != p.get("lang"): continue
        s = sum(w.get(x, 0) * (2 if n == 0 else 1) for n, x in enumerate(q.get("topics") or []))
        if s: out.append((s, q.get("published") or 0, q))
    out.sort(key=lambda x: (-x[0], -x[1]))
    return [q for _, _, q in out[:k]]
