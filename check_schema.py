#!/usr/bin/env python3
"""Prueft das JSON-LD aller gebauten Seiten (docs/): gueltiges JSON, Pflichtfelder je Typ (Google/schema.org), absolute URLs, ISO-Daten,
aufloesbare @id-Verweise, widerspruechliche @id-Definitionen.
T37 Sponsor: sichtbare Kennzeichnung (data-spm, site_sponsorships.note) und "sponsor" an WebPage/PodcastEpisode/BlogPosting/VideoObject
gehoeren zusammen (beide Richtungen); die Kennzeichnung steht direkt unter der H1 (vor dem ersten H2); Links zum Sponsor tragen rel="sponsored".
Aufruf: python check_schema.py [Verzeichnis]  (Standard: docs/; r2out/ daneben wird mit Hinweisen mitgeprueft)"""
import glob, json, re, sys
from collections import Counter, defaultdict
from pathlib import Path

DOCS = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).parent / "docs"
REQ = {
    "PodcastEpisode": ["name", "url", "datePublished", "partOfSeries"],
    "PodcastSeries": ["name", "url"],
    "VideoObject": ["name", "description", "thumbnailUrl", "uploadDate"],
    "Article": ["headline", "datePublished", "author", "image"],
    "BreadcrumbList": ["itemListElement"],
    "FAQPage": ["mainEntity"],
    "Person": ["name"], "Organization": ["name"], "CollectionPage": ["name", "url"],
    "ProfilePage": ["mainEntity"], "Event": ["name", "startDate", "location"], "WebSite": ["name", "url"],
}
iso = re.compile(r"^\d{4}(-\d{2}(-\d{2}(T[\d:.+\-Z]+)?)?)?$")   # ISO 8601 inkl. reduzierter Genauigkeit (Jahr, Jahr-Monat: Erscheinungsdaten von Produkten)
IDENT = {"@id", "@type", "@context", "name", "url"}
SPN_TYPES = {"WebPage", "CollectionPage", "PodcastEpisode", "BlogPosting", "VideoObject"}   # T37 Sponsor: Knoten mit Kennzeichnung bezahlter Inhalte (Event.sponsor = Event-Partner, keine Kennzeichnung der Seite); CollectionPage ist ein WebPage (Firmenverzeichnis mit Partner-Block, #308)
errs, warns = Counter(), Counter()
examples = {}
ids = defaultdict(set)
defs = defaultdict(set)


R2 = [False]   # gerade r2out/: Fehler dort nur als Hinweis (s. u.)


def note(kind, msg, f):
    if R2[0] and kind == "E": kind, msg = "W", "r2out: " + msg
    (errs if kind == "E" else warns)[msg] += 1
    examples.setdefault(msg, f)


def walk(o, f, top, sp=None):
    if isinstance(o, dict):
        t = o.get("@type")
        if sp is not None and o.get("sponsor") and SPN_TYPES & set(t if isinstance(t, list) else [t]):
            sp += o["sponsor"] if isinstance(o["sponsor"], list) else [o["sponsor"]]
        for tt in (t if isinstance(t, list) else [t]):
            if tt in REQ:
                for k in REQ[tt]:
                    v = o.get(k)
                    if v in (None, "", [], {}):
                        note("E" if tt != "Article" or k != "image" else "W", f"{tt}: Pflichtfeld '{k}' fehlt", f)
            if tt == "Question" and not (o.get("acceptedAnswer") or {}).get("text"):
                note("E", "Question ohne acceptedAnswer.text", f)
        for k in ("url", "item", "contentUrl", "embedUrl", "mainEntityOfPage"):
            v = o.get(k)
            if isinstance(v, str) and not v.startswith("http"):
                note("E", f"{k} nicht absolut", f)
        for k in ("datePublished", "dateModified", "uploadDate", "startDate", "endDate"):
            v = o.get(k)
            if isinstance(v, str) and not iso.match(v):
                note("E", f"{k} kein ISO-Datum: {v[:20]}", f)
        if t == "Person" and "review" in o:
            note("E", "Person mit 'review' (kein Person-Feld, Google lehnt es ab)", f)
        if t == "Event" and o.get("superEvent") and not o.get("location"):
            note("E", "Event (subEvent) ohne location", f)
        if "@id" in o:
            ids[o["@id"]].add(f)
            if set(o) - IDENT:   # nur Identitaet (name, url) = Verweis, keine Definition
                defs[o["@id"]].add(json.dumps(o, sort_keys=True))
        for v in o.values():
            walk(v, f, False, sp)
    elif isinstance(o, list):
        for v in o:
            walk(v, f, False, sp)


def _host(u):
    m = re.match(r"https?://([^/:?#\"]+)", u or "", re.I)
    return m.group(1).lower().removeprefix("www.") if m else ""


def sponsor_check(h, f, sp):
    """T37 Sponsor: Kennzeichnung <-> JSON-LD sponsor, Lage unter der H1, rel="sponsored" auf Links zum Sponsor."""
    disc = h.find('data-spm="')
    if disc >= 0 and not sp:
        note("E", "Kennzeichnung (Sponsored/Anzeige) ohne sponsor im JSON-LD", f)
    if sp and disc < 0:
        note("E", "sponsor im JSON-LD ohne sichtbare Kennzeichnung (site_sponsorships.note)", f)
    if disc < 0:
        return
    h1, h2 = h.find("<h1"), h.find("<h2")
    if h1 < 0 or disc < h1 or 0 <= h2 < disc:
        note("E", "Kennzeichnung (Sponsored/Anzeige) nicht direkt unter der H1", f)
    hs = {_host(x.get("url")) for x in sp if isinstance(x, dict)} - {""}
    for a in re.findall(r"<a\s[^>]*>", h):
        m = re.search(r'href="(https?://[^"]+)"', a)
        if m and any(_host(m.group(1)) == x or _host(m.group(1)).endswith("." + x) for x in hs) and "sponsored" not in (re.search(r'rel="([^"]*)"', a) or [None, ""])[1].split():
            note("W", "Link zum Sponsor ohne rel=sponsored", f)


n = 0
# r2out/ neben docs/ (Seiten nur im R2-Bucket, seit 11.11.2026 alle Sprachseiten ausser en/de) wird mitgeprueft, Fehler dort nur als Hinweis
# ("r2out: ..."): die schon vorher dort liegenden Sprachfassungen waren nie Teil der blockierenden Pruefung
for base in (DOCS, DOCS.parent / "r2out"):
    R2[0] = base != DOCS
    for p in sorted(glob.glob(str(base / "**" / "*.html"), recursive=True)):
        h = open(p, encoding="utf-8", errors="ignore").read()
        blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S)
        f = ("/r2out" if R2[0] else "") + p.replace(str(base), "")
        if not blocks:
            if 'data-spm="' in h:
                note("E", "Kennzeichnung (Sponsored/Anzeige) ohne sponsor im JSON-LD", f)
            continue
        n += 1
        sp = []
        for b in blocks:
            try:
                walk(json.loads(b), f, True, sp)
            except Exception as ex:
                note("E", "JSON-LD nicht parsebar: " + str(ex)[:60], f)
        sponsor_check(h, f, sp)
R2[0] = False
# @id-Verweise (nur {"@id": x}) muessen irgendwo definiert sein
refs = set()
for p in glob.glob(str(DOCS / "**" / "*.html"), recursive=True)[:2000]:
    h = open(p, encoding="utf-8", errors="ignore").read()
    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
        for m in re.findall(r'\{"@id": "([^"]+)"\}', b):
            if m.split("#")[0].startswith("http") and m not in defs and not m.endswith("#video"):
                refs.add(m)
for r in sorted(refs)[:10]:
    note("W", "@id referenziert, aber nirgends definiert: " + r.replace("https://www.m365.fm", ""), "")
for i, d in defs.items():
    if len(d) > 1 and (any(k in i for k in ("#person", "#org", "#series")) or i.endswith("/entity/mirko-peters/#entity")):   # Entitaeten duerfen je Sprache eine eigene Beschreibung tragen
        note("W", f"{i.replace('https://www.m365.fm', '')} in {len(d)} Varianten definiert", "")
print(f"{n} Seiten mit JSON-LD geprueft")
for k, v in errs.most_common():
    print("FEHLER", v, "x", k, "z.B.", examples[k])
for k, v in warns.most_common():
    print("HINWEIS", v, "x", k, "z.B.", examples[k])
sys.exit(1 if errs else 0)
