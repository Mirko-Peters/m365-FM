"""Hash je ausgelieferter Datei (docs/): Grundlage, um nach dem Deploy nur geaenderte Adressen im Cloudflare-Cache zu leeren und bei IndexNow zu melden.
Aufruf: python tools/page_hashes.py docs page-hashes.json [content-hashes.json [r2out]]
Dritte Datei: Inhalts-Hash je HTML-Seite (Titel, Beschreibung, robots, canonical und Hauptinhalt, tools/content_hash.py), Grundlage fuer IndexNow.
Viertes Argument (r2out/): auch die Seiten (index.html), die nur im R2-Bucket liegen (seit 11.11.2026 alle Sprachseiten ausser en/de, site_size.r2_only).
Sonst gaelten sie nach dem Umzug als entfallen, und neue oder geaenderte Seiten dort kaemen nie zu IndexNow. Dateien in r2out/ leert der Purge ueber
r2-changed.json. Merker R2_MARK: tools/purge_changed.py erkennt daran den ersten Lauf mit r2out/.
Aus r2out/ zaehlen ausser den Seiten auch die Sitemaps der Sprachen ausser en/de (seit 16.11.2026 dort, site_size.r2_only): sonst gaelten sie nach
dem Umzug aus docs/ als entfallen, und eine geaenderte Sitemap bliebe unter ihrer Adresse im Kanten-Cache (IndexNow betrifft nur Seiten).
Ebenso die seit 16.11.2026 aus docs/ umgezogenen Datenexporte (EXPORT, site_size.EXPORT_RX: Register, og-manifest.json, seo-report.json)."""
import hashlib, json, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from content_hash import content_hash

R2_MARK = "/__r2out__"
SITEMAP = re.compile(r"^sitemap-[a-z]{2}-[a-z][a-z0-9-]*\.xml$")   # Sitemaps der Sprachen ausser en/de in r2out/ (site_size.SITEMAP_RX): Purge unter ihrer Adresse
EXPORT = re.compile(r"^(?:og-manifest|seo-report|episodes-register(?:-[0-9]{1,3})?|translations-register(?:-[a-z]{2})?)\.json$")   # umgezogene Datenexporte (site_size.EXPORT_RX)
h, c = {}, {}


def scan(src, pages_only=False):
    for f in src.rglob("*"):
        if not f.is_file() or f.suffix not in (".html", ".xml", ".json", ".txt", ".jsonld", ".md", ".css", ".js"): continue
        rel = f.relative_to(src).as_posix()
        if pages_only and f.name != "index.html" and not SITEMAP.match(rel) and not EXPORT.match(rel): continue
        url = "/" + (rel[:-len("index.html")] if rel.endswith("index.html") else rel)
        if pages_only and url in h: continue   # docs/ gilt (GitHub Pages liefert zuerst)
        b = f.read_bytes(); h[url] = hashlib.sha1(b).hexdigest()[:16]
        if f.suffix == ".html" and url.endswith("/"): c[url] = content_hash(b.decode("utf-8", "replace"))


if __name__ == "__main__":
    out = Path(sys.argv[2]); scan(Path(sys.argv[1]))
    if len(sys.argv) > 4 and Path(sys.argv[4]).is_dir(): n = len(h); scan(Path(sys.argv[4]), True); h[R2_MARK] = "1"; print(len(h) - n - 1, "Seiten aus", sys.argv[4])
    out.write_text(json.dumps(h, sort_keys=True), encoding="utf-8")
    print(len(h), "Dateien gehasht")
    if len(sys.argv) > 3:
        Path(sys.argv[3]).write_text(json.dumps(c, sort_keys=True), encoding="utf-8"); print(len(c), "Inhalts-Hashes")
