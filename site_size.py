"""Groessenpruefung des GitHub-Pages-Builds."""
from pathlib import Path

R2_EXT = (".html", ".json", ".jsonld", ".xml")   # T32: Bild-URLs auch in Exporten (entities*.json, Register, Sitemaps) auf img.m365.fm
PAGES_LANGS = ("en", "de")   # Sprachen, deren Seiten in GitHub Pages bleiben


def r2_only(rel, langs):
    """Liegt die Datei nur im R2-Bucket (r2out/) statt in GitHub Pages (docs/)? Der Site-Worker liefert sie unter derselben Adresse aus
    (nach dem 404 von GitHub Pages bzw. mit R2 als Ursprung), indexierbar, mit denselben Sicherheits- und Cache-Headern (SEC, HTML_CC).
    Seit 11.11.2026 (Bau 642: docs/ 993 MB, Grenze 980 MB) gilt das fuer ALLE Seiten (index.html) der Sprachen ausser en/de: Dub-Folgen,
    Tag-/Kategorie-/Lernseiten, Verzeichnis, Events, Profile, Blog- und Folgenlisten usw. (~350 MB; Blog- und Show-Sprachfassungen,
    Entitaeten und Landingpages lagen schon dort). In GitHub Pages bleiben die Startseite der Sprache (<l>/index.html, Ziel der Sprachwahl
    auf "/", ohne Umweg ueber den R2-Rueckfall) und Dateien neben den Seiten (feed.xml, event.ics, llms.txt, sw.js): der Rueckfall liefert nur HTML."""
    if rel == "translations-blog.json" or rel.startswith("blog-import/"): return True
    p = rel.split("/")
    return len(p) > 2 and p[0] in langs and p[0] not in PAGES_LANGS and p[-1] == "index.html"


def writers(out, r2out, rewrite, langs):
    """(write, write_r2, n): write legt nach docs/ (out) oder - wenn r2_only - nach r2out/, write_r2 immer nach r2out/; n = [Dateien, Bytes] in r2out/.
    rewrite (site_r2.rewrite) setzt Bild-URLs auf img.m365.fm, nur fuer R2_EXT."""
    n = [0, 0]
    def put(base, rel, content):
        p = base / rel; p.parent.mkdir(parents=True, exist_ok=True)
        c = rewrite(content) if rel.endswith(R2_EXT) else content
        p.write_text(c, encoding="utf-8"); return c
    def write_r2(rel, content):
        c = put(r2out, rel, content); n[0] += 1; n[1] += len(c.encode("utf-8"))
    def write(rel, content):
        if r2_only(rel, langs): write_r2(rel, content)
        else: put(out, rel, content)
    return write, write_r2, n


def sizes(out=Path(__file__).parent / "docs", warning=900_000_000, limit=980_000_000):
    """Groesse von docs/ je Verzeichnis; vor dem Pages-Limit warnen und abbrechen."""
    dirs, files = {}, []
    for f in out.rglob("*"):
        if not f.is_file(): continue
        n = f.stat().st_size; rel = f.relative_to(out).as_posix()
        top = rel.split("/", 1)[0]
        dirs[top] = dirs.get(top, 0) + n
        files.append((n, rel))
    tot = sum(dirs.values())
    print("docs/ gesamt: %.0f MB" % (tot / 1e6) + " - " + ", ".join(f"{name}: {size / 1e6:.0f} MB" for name, size in sorted(dirs.items(), key=lambda x: x[1], reverse=True)[:12]))
    if tot >= warning:
        marker = "::error::" if tot >= limit else "::warning::"
        print(f"{marker} docs/ umfasst {tot / 1e6:.0f} MB (Warnung ab 900 MB, Abbruch ab 980 MB)")
        print("Groesste Verzeichnisse: " + ", ".join(f"{name}: {size / 1e6:.0f} MB" for name, size in sorted(dirs.items(), key=lambda x: x[1], reverse=True)[:10]))
        print("Groesste Dateien: " + ", ".join(f"{name} ({size / 1e6:.1f} MB)" for size, name in sorted(files, reverse=True)[:10]))
    if tot >= limit:
        raise SystemExit(f"Abbruch: docs/ darf hoechstens 980 MB umfassen (aktuell {tot / 1e6:.0f} MB)")
