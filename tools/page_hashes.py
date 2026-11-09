"""Hash je ausgelieferter Datei (docs/): Grundlage, um nach dem Deploy nur geaenderte Adressen im Cloudflare-Cache zu leeren und bei IndexNow zu melden.
Aufruf: python tools/page_hashes.py docs page-hashes.json [content-hashes.json]
Dritte Datei: Inhalts-Hash je HTML-Seite (Titel, Beschreibung, robots, canonical und Hauptinhalt, tools/content_hash.py), Grundlage fuer IndexNow."""
import hashlib, json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from content_hash import content_hash

src, out = Path(sys.argv[1]), Path(sys.argv[2])
h, c = {}, {}
for f in src.rglob("*"):
    if f.is_file() and f.suffix in (".html", ".xml", ".json", ".txt", ".jsonld", ".md", ".css", ".js"):
        rel = f.relative_to(src).as_posix()
        url = "/" + (rel[:-len("index.html")] if rel.endswith("index.html") else rel)
        b = f.read_bytes(); h[url] = hashlib.sha1(b).hexdigest()[:16]
        if f.suffix == ".html" and url.endswith("/"): c[url] = content_hash(b.decode("utf-8", "replace"))
out.write_text(json.dumps(h, sort_keys=True), encoding="utf-8")
print(len(h), "Dateien gehasht")
if len(sys.argv) > 3:
    Path(sys.argv[3]).write_text(json.dumps(c, sort_keys=True), encoding="utf-8"); print(len(c), "Inhalts-Hashes")
