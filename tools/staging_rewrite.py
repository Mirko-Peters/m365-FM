#!/usr/bin/env python3
"""Staging-Bau: Live-Adressen in den gebauten Dateien auf die Staging-Adressen umschreiben (nur im Staging-Workflow site-staging.yml).

Der Staging-Bau liest die oeffentlichen Exporte der Live-API (nur GET, damit die Testseite echte Inhalte hat), schreibt aber ueberall
https://api-staging.m365.fm und https://staging.m365.fm hinein: Das Skript der Seite (window.M365X.api) ruft so nie die Live-API auf, Links bleiben in Staging.
  https://api-dub.m365.fm            -> https://api-staging.m365.fm
  https://www.m365.fm, dub.m365.fm, m365.fm -> https://staging.m365.fm
img.m365.fm (Bilder aus dem Bucket, nur lesen) bleibt unveraendert. Auch die JSON-Schreibweise mit \\/ wird ersetzt.
Aufruf:  python3 tools/staging_rewrite.py docs r2out
"""
import re
import sys
from pathlib import Path

TEXT_EXT = {".html", ".htm", ".js", ".mjs", ".json", ".jsonld", ".xml", ".xsl", ".txt", ".md", ".css", ".ics", ".vtt", ".csv", ".webmanifest", ".rss", ".svg"}
API_LIVE, API_STAGING = "api-dub.m365.fm", "api-staging.m365.fm"
SITE_STAGING = "staging.m365.fm"

# (Muster, Ersatz) fuer "https://" und die JSON-Schreibweise "https:\/\/" (Ersatz als Funktion, damit Rueckwaertsstriche unveraendert bleiben)
RULES = [
    (re.compile(r"https://api-dub\.m365\.fm(?![\w-])"), lambda m: "https://" + API_STAGING),
    (re.compile(r"https://(?:www\.|dub\.)?m365\.fm(?![\w-]|\.\w)"), lambda m: "https://" + SITE_STAGING),
    (re.compile(r"https:\\/\\/api-dub\.m365\.fm(?![\w-])"), lambda m: "https:\\/\\/" + API_STAGING),
    (re.compile(r"https:\\/\\/(?:www\.|dub\.)?m365\.fm(?![\w-]|\.\w)"), lambda m: "https:\\/\\/" + SITE_STAGING),
]


def rewrite_text(text):
    """-> (neuer Text, Anzahl Ersetzungen)"""
    n = 0
    for rx, repl in RULES:
        text, k = rx.subn(repl, text)
        n += k
    return text, n


def rewrite_tree(root):
    """Schreibt alle Textdateien unter root um. -> (Dateien geaendert, Ersetzungen)"""
    files = changed = total = 0
    for f in Path(root).rglob("*"):
        if not f.is_file():
            continue
        if f.name == "CNAME":
            f.unlink()   # GitHub-Pages-Domain gehoert nur zur Live-Seite
            continue
        if f.suffix.lower() not in TEXT_EXT:
            continue
        files += 1
        try:
            t = f.read_text("utf-8")
        except UnicodeDecodeError:
            continue
        new, n = rewrite_text(t)
        if n:
            f.write_text(new, "utf-8")
            changed += 1
            total += n
    return changed, total


def leftovers(root):
    """Dateien, in denen nach dem Umschreiben noch eine Live-Adresse (ausser img.m365.fm) steht. -> Liste (Pfad, Fund)"""
    rx = re.compile(r"https:(?://|\\/\\/)(?:api-dub\.|www\.|dub\.)?m365\.fm(?![\w-]|\.\w)")
    out = []
    for f in Path(root).rglob("*"):
        if f.is_file() and f.suffix.lower() in TEXT_EXT:
            try:
                m = rx.search(f.read_text("utf-8"))
            except UnicodeDecodeError:
                continue
            if m:
                out.append((str(f), m.group(0)))
    return out


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    code = 0
    for d in sys.argv[1:]:
        if not Path(d).exists():
            print(f"{d}: nicht vorhanden, uebersprungen")
            continue
        c, t = rewrite_tree(d)
        left = leftovers(d)
        print(f"{d}: {c} Dateien umgeschrieben, {t} Ersetzungen, uebrig geblieben: {len(left)}")
        for p, m in left[:10]:
            print("  noch Live-Adresse:", p, m)
        if left:
            code = 1
    sys.exit(code)
