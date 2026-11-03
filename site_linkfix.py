"""Tote interne Links in uebernommenen Inhalten (fruehere Podpage-Blogbeitraege, auch die schon in der Datenbank liegenden Fassungen)
auf die naechstgelegene vorhandene Seite umbiegen: data/link_fixes.json bildet alte Adressen (ohne Domain, ohne Sprachpraefix) auf
ein Ziel ab, meist eine Entitaets-, Folgen- oder Beitragsseite. Es wird nur das href umgeschrieben, Linktext und Inhalt bleiben.

Ziele unter /entity/<id>/ greifen nur, wenn es die Entitaet im Bau gibt (sonst bleibt der Link unveraendert und check_links meldet ihn).
Neue Eintraege: Ausgabe von `python check_links.py --out reports/broken_links.tsv` (Ursache "einstufige Seite fehlt ...")."""
import json
import re
from pathlib import Path

from site_i18n import pfx

_F = Path(__file__).parent / "data" / "link_fixes.json"
_HOST = re.compile(r"^https?://(?:www\.)?m365\.fm(?=/|$)", re.I)
_LANG = re.compile(r"^/(de|es|fr|it|pt|nl|pl|id|ru|uk|ar|he|ja|ko)(?=/)")
_HREF = re.compile(r'href="([^"]+)"')
STATS = {"rewritten": 0, "skipped": 0}


def _key(path):
    return (path.split("#", 1)[0].split("?", 1)[0].rstrip("/") or "/").lower()


def _load():
    try:
        raw = json.loads(_F.read_text("utf-8")) if _F.exists() else {}
    except Exception as e:
        print("data/link_fixes.json nicht lesbar:", str(e)[:120]); raw = {}
    return {_key(k): v for k, v in (raw.get("map") or {}).items()}


MAP = _load()


def target_for(href, ents=None):
    """Neues Ziel (Pfad ohne Domain, englische Fassung) fuer einen toten Link oder None."""
    path = _HOST.sub("", href)
    if not path.startswith("/") or path.startswith("//"):
        return None
    to = MAP.get(_key(_LANG.sub("", path)))
    if not to:
        return None
    m = re.match(r"^/entity/([^/]+)/", to)
    if m and ents is not None and m.group(1) not in ents:
        STATS["skipped"] += 1; return None
    return to


def rewrite(html, BASE, lang="en", ents=None):
    """Alle hrefs in html, die in data/link_fixes.json stehen, auf das Ziel umschreiben. Entitaeten gibt es auf Deutsch unter /de/entity/."""
    if not MAP or not html or "href=" not in html:
        return html

    def rep(m):
        to = target_for(m.group(1), ents)
        if not to:
            return m.group(0)
        STATS["rewritten"] += 1
        return f'href="{BASE}{pfx(lang) if lang == "de" and to.startswith("/entity/") else ""}{to}"'
    return _HREF.sub(rep, html)


def check():
    """Selbstpruefung der Tabelle (ohne Bau): Ziele vorhanden (Entitaet in data/*entities.json, veroeffentlichte Folge, bekannte Uebersicht),
    kein Schluessel ist eine echte Adresse (Folge, frueherer Beitrag, Podpage-Seite), sonst wuerde ein gueltiger Link umgebogen. -> Liste der Fehler"""
    import site_podpage as P
    D = Path(__file__).parent / "data"
    ents = set()
    for f in ("entities.json", "guest_entities.json", "speaker_entities.json"):
        if (D / f).exists(): ents |= {e["id"] for e in json.loads((D / f).read_text("utf-8"))}
    eps = {e["slug"] for e in P.load("episodes") if e.get("published") not in (False, "False") and e.get("hidden") not in (True, "True")}
    real = eps | {p["slug"] for p in P.load("blog_posts")} | {p["slug"] for p in P.load("pages")}
    hubs = {"/entity/", "/community/", "/community/events/", "/community/u/mirko-p/blog/", "/about/mirko-peters/"}
    err = []
    for k, to in MAP.items():
        if k.strip("/") in real: err.append(f"{k}: ist eine vorhandene Seite")
        m = re.match(r"^/(entity|show/episodes)/([^/]+)/$", to)
        if m and m.group(1) == "entity" and m.group(2) not in ents: err.append(f"{k} -> {to}: Entitaet fehlt")
        elif m and m.group(1) == "show/episodes" and m.group(2) not in eps: err.append(f"{k} -> {to}: Folge fehlt")
        elif not m and to not in hubs: err.append(f"{k} -> {to}: unbekanntes Ziel")
    return err


if __name__ == "__main__":
    import sys
    e = check()
    print(f"data/link_fixes.json: {len(MAP)} Eintraege, {len(e)} Fehler")
    for x in e: print("  ", x)
    sys.exit(1 if e else 0)
