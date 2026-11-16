"""Groessenpruefung des GitHub-Pages-Builds."""
import json
import re
import time
from pathlib import Path

R2_EXT = (".html", ".json", ".jsonld", ".xml")   # T32: Bild-URLs auch in Exporten (entities*.json, Register, Sitemaps) auf img.m365.fm
PAGES_LANGS = ("en", "de")   # Sprachen, deren Seiten in GitHub Pages bleiben


def r2_only(rel, langs):
    """Liegt die Datei nur im R2-Bucket (r2out/) statt in GitHub Pages (docs/)? Der Site-Worker liefert sie unter derselben Adresse aus
    (nach dem 404 von GitHub Pages bzw. mit R2 als Ursprung), indexierbar, mit denselben Sicherheits- und Cache-Headern (SEC, HTML_CC).
    Seit 11.11.2026 (Bau 642: docs/ 993 MB, Grenze 980 MB) gilt das fuer ALLE Seiten (index.html) der Sprachen ausser en/de: Dub-Folgen,
    Tag-/Kategorie-/Lernseiten, Verzeichnis, Events, Profile, Blog- und Folgenlisten usw. (~350 MB; Blog- und Show-Sprachfassungen,
    Entitaeten und Landingpages lagen schon dort). In GitHub Pages bleiben die Startseite der Sprache (<l>/index.html, Ziel der Sprachwahl
    auf "/", ohne Umweg ueber den R2-Rueckfall) und Dateien neben den Seiten (feed.xml, event.ics, llms.txt, sw.js): der Rueckfall liefert nur HTML.
    Seit 16.11.2026 auch die Sitemaps dieser Sprachen im Wurzelverzeichnis (sitemap-<l>-<typ>[-<n>].xml, site_sitemaps.write_all; allein die
    Blog-Sitemaps ~6 MB je Sprache wegen der hreflang-Alternates): der Site-Worker liefert sie nach dem 404 als application/xml (SITEMAP_R2 in
    sitewrk/index.js). Der Index sitemap.xml und die Sitemaps von en/de bleiben in GitHub Pages.
    Ebenfalls seit 16.11.2026 die grossen Datenexporte im Wurzelverzeichnis (EXPORT_RX, ~75 MB): Register fuer die Datenbank
    (episodes-register[-<n>].json ~21 MB, translations-register[-<l>].json ~35 MB; der Community-Worker holt sie mit siteFetch, das nach dem 404
    von GitHub Pages im Bucket nachsieht), og-manifest.json (~12,5 MB, Eingabe von generate_og.py) und seo-report.json (~7 MB). Der Site-Worker
    liefert sie nach dem 404 unter derselben Adresse aus (R2_EXPORT). In GitHub Pages bleiben Exporte, die Browser auf Seiten laden
    (entities.json) oder die der Community-Worker ohne R2-Rueckfall abruft (episodes.json, entities*.json, quotes.json, topics.json ...)."""
    if rel == "translations-blog.json" or rel.startswith("blog-import/") or EXPORT_RX.match(rel): return True
    l = sitemap_lang(rel)
    if l: return l in langs and l not in PAGES_LANGS
    p = rel.split("/")
    return len(p) > 2 and p[0] in langs and p[0] not in PAGES_LANGS and p[-1] == "index.html"


SITEMAP_RX = re.compile(r"^sitemap-([a-z]{2})-[a-z][a-z0-9-]*\.xml$")   # Name aus site_sitemaps.write_all; gleiche Regel wie SITEMAP_R2 im Site-Worker


# Grosse Datenexporte nur in r2out/ (site_register.build, generate_site.py, site_seo.py); gleiche Regel wie R2_EXPORT im Site-Worker,
# EXPORT in tools/r2_pages_upload.py und tools/page_hashes.py
EXPORT_RX = re.compile(r"^(?:og-manifest|seo-report|episodes-register(?:-[0-9]{1,3})?|translations-register(?:-[a-z]{2})?)\.json$")


def sitemap_lang(rel):
    """Sprache einer Sitemap-Datei im Wurzelverzeichnis (sitemap-<l>-<typ>[-<n>].xml) oder "" (keine solche Datei, auch nicht der Index sitemap.xml)."""
    m = SITEMAP_RX.match(rel)
    return m.group(1) if m else ""


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


def report(out, tot, dirs, files):
    """docs/build-size.json: Groesse von docs/ je Verzeichnis (eine und zwei Ebenen) - abrufbar unter /build-size.json, weil das Bauprotokoll
    von aussen nicht immer lesbar ist. Nur Zahlen und Pfade, keine Inhalte."""
    sub = {}
    for n, rel in files:
        parts = rel.split("/")
        if len(parts) > 2: sub["/".join(parts[:2])] = sub.get("/".join(parts[:2]), 0) + n
    top = lambda d, k: {name: round(size / 1e6, 1) for name, size in sorted(d.items(), key=lambda x: x[1], reverse=True)[:k]}
    try:
        (out / "build-size.json").write_text(json.dumps({"generated": time.strftime("%Y-%m-%dT%H:%MZ", time.gmtime()), "total_mb": round(tot / 1e6, 1),
                                                         "files": len(files), "dirs_mb": top(dirs, 25), "subdirs_mb": top(sub, 40)}, indent=1), encoding="utf-8")
    except OSError:
        pass


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
    report(out, tot, dirs, files)
    print("docs/ gesamt: %.0f MB" % (tot / 1e6) + " - " + ", ".join(f"{name}: {size / 1e6:.0f} MB" for name, size in sorted(dirs.items(), key=lambda x: x[1], reverse=True)[:12]))
    if tot >= warning:
        marker = "::error::" if tot >= limit else "::warning::"
        print(f"{marker} docs/ umfasst {tot / 1e6:.0f} MB (Warnung ab 900 MB, Abbruch ab 980 MB)")
        print("Groesste Verzeichnisse: " + ", ".join(f"{name}: {size / 1e6:.0f} MB" for name, size in sorted(dirs.items(), key=lambda x: x[1], reverse=True)[:10]))
        print("Groesste Dateien: " + ", ".join(f"{name} ({size / 1e6:.1f} MB)" for size, name in sorted(files, reverse=True)[:10]))
    if tot >= limit:
        raise SystemExit(f"Abbruch: docs/ darf hoechstens 980 MB umfassen (aktuell {tot / 1e6:.0f} MB)")
