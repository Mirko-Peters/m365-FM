#!/usr/bin/env python3
"""Rechnet die Zuordnung Blogbeitrag -> Folge (site_listen.match_post) fuer alle Beitraege im Repo neu und schreibt data/listen_matches.json
({"version", "catalog": Fingerabdruck des Folgenbestands, "posts": {slug: {"h": Hash, "m": [{"episode", "score", "via"}]}}}).

Das ist ein Zwischenspeicher: der Seitenbau nutzt einen Eintrag nur, wenn Beitrag (Titel, Kurztext, Themen), Folgenbestand und Verfahrens-Version passen,
und rechnet sonst selbst (ohne die Datei zu aendern). Beitraege nur aus der Community-Datenbank stehen nicht darin (kein Zugriff ohne Netz).

Aufruf:  python tools/listen_match.py [--stats] [--no-write]
  --stats     Verteilung 0/1/2 Folgen und Beispiele ausgeben
  --no-write  Datei nicht schreiben (nur Statistik)
"""
import collections
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

BASE = "https://www.m365.fm"


def posts():
    """Englische Beitraege des Repos: fruehere Podpage-Beitraege (Themen aus dem Zwischenspeicher data/cache/blog_topics.json, wie im Seitenbau) und Content-Pakete."""
    import site_content_blog as CBL
    import site_learn as SL
    import site_podpage as P
    import site_sidebar as SBR
    import site_topics as TOP
    ix = SBR.Index()
    for p in P.load("blog_posts"):
        if not (p.get("title") and p.get("html")):
            continue
        topics = TOP.score_topics(ix, p["title"], P.plain(P.san(p["html"])), key=p["slug"])
        yield {"slug": p["slug"], "title": p["title"], "summary": (p.get("desc") or "")[:400], "topics": topics}
    items, _ = CBL.collect(SL.ENTS)
    for it in items:
        if it["lang"] == "en":
            yield {"slug": it["slug"], "title": it["title"], "summary": it["summary"], "topics": it["topics"]}


def main():
    import site_learn as SL
    import site_listen as L
    cat = L.build_catalog(BASE)
    cache = {"version": L.VERSION, "catalog": cat.fingerprint, "posts": {}}
    dist, via, samples = collections.Counter(), collections.Counter(), []
    for p in posts():
        names = [SL.ENTS[t]["name"] for t in p["topics"] if t in SL.ENTS]
        m = L.match_post(cat, p["topics"], p["title"], p["summary"], "", names)[:L.MAX_CARDS]
        cache["posts"][p["slug"]] = {"h": L.post_hash(p["slug"], p["title"], p["summary"], p["topics"]), "m": m}
        dist[len(m)] += 1
        for x in m:
            via[x["via"]] += 1
        if m and len(samples) < 12:
            samples.append((p["title"], cat.eps[m[0]["episode"]]["title"], m[0]["via"], m[0]["score"]))
    n = sum(dist.values())
    print(f"{n} Beitraege, Katalog {len(cat.eps)} Folgen: keine Karte {dist[0]} ({dist[0] * 100 // max(n, 1)} %), 1 Folge {dist[1]}, 2 Folgen {dist[2]}; Stufe 1 (Entitaeten) {via['ent']}, Stufe 2 (Text) {via['txt']}")
    if "--stats" in sys.argv:
        for t, e, v, s in samples:
            print(f"  {v} {s}: {t[:60]}  ->  {e[:60]}")
    if "--no-write" not in sys.argv:
        L.save_cache(cache)
        print("geschrieben:", L.CACHE_F.relative_to(ROOT))


if __name__ == "__main__":
    main()
