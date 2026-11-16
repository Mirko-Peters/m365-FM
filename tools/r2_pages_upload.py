"""Seiten aus r2out/ (Seitenbau: Sprachfassungen, Suchindex, Exporte und Register, Sitemaps der Sprachen ausser en/de - liegen nur im Bucket, nicht in GitHub Pages) in den R2-Bucket laden:
Schluessel pages/<pfad>, Content-Type nach Endung, nur geaenderte Dateien (MD5-Manifest in data/cache), erst Dateien, dann Seiten.
Es wird nichts geloescht. Schluessel, die tools/r2_site_sync.py als entfernt markiert hat (meta/gone.json) und die der Bau wieder erzeugt,
werden neu geladen (sonst bliebe die Markierung bei unveraendertem Inhalt stehen).
Zugang ueber R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY (GitHub-Secrets). Aufruf: python tools/r2_pages_upload.py [r2out]
Umgebung optional: R2_CHANGED_OUT (Adressen fuer den Purge), R2_KEYS_OUT (alle Schluessel aus r2out/ fuer den Spiegel im Deploy-Job)."""
import hashlib, json, os, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from r2_common import IMG, client, read_gone, upload, url_of   # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "r2out"
MAN = ROOT / "data" / "cache" / "r2_pages.json"
SITEMAP = re.compile(r"^pages/sitemap-[a-z]{2}-[a-z][a-z0-9-]*\.xml$")   # wie site_size.SITEMAP_RX und SITEMAP_R2 im Site-Worker
# Aus docs/ umgezogene Datenexporte (seit 16.11.2026, wie site_size.EXPORT_RX und R2_EXPORT im Site-Worker): gleiche Behandlung wie die Sitemaps
EXPORT = re.compile(r"^pages/(?:og-manifest|seo-report|episodes-register(?:-[0-9]{1,3})?|translations-register(?:-[a-z]{2})?)\.json$")
moved = lambda k: bool(SITEMAP.match(k) or EXPORT.match(k))   # nur in r2out/, ausgeliefert nur ohne src=docs (Site-Worker), fehlen blockiert den Deploy
# Blog-Import und Blog-Uebersetzungen liegen schon seit 04.11.2026 nur in r2out/ (R2_EXPORT im Site-Worker, ebenfalls ohne src=docs): im Bucket mitpruefen,
# damit auch ein (unwahrscheinliches) src=docs-Objekt dort sicher ersetzt wird; fehlen blockiert den Deploy wie bisher nicht (Worker-Import holt sie spaeter).
BLOG = re.compile(r"^pages/(?:blog-import/[^/]+\.json|translations-blog\.json)$")
checked = lambda k: moved(k) or bool(BLOG.match(k))


def main():
    if not SRC.exists():
        print(f"{SRC} fehlt - nichts zu laden"); return 0
    files = [f for f in SRC.rglob("*") if f.is_file()]
    keys = {"pages/" + f.relative_to(SRC).as_posix(): f for f in files}
    if os.environ.get("R2_KEYS_OUT"):   # unabhaengig vom Upload: der Spiegel im Deploy-Job markiert diese Schluessel nie als entfernt
        Path(os.environ["R2_KEYS_OUT"]).write_text(json.dumps(sorted(keys)), encoding="utf-8")
    s3, bucket = client()
    if not s3:
        print("R2-Upload uebersprungen (Seiten bleiben nur erreichbar, wenn sie schon im Bucket liegen)"); return 0
    try: man = json.loads(MAN.read_text("utf-8")) if MAN.exists() else {}
    except Exception: man = {}
    man = {k: v for k, v in man.items() if k in keys}   # nur aktuelle Schluessel: kommt ein Schluessel spaeter zurueck (z. B. aus docs/), wird er neu geladen
    try: gone = read_gone(s3, bucket)
    except Exception as e: print("Entfernt-Liste nicht lesbar:", type(e).__name__); gone = set()
    served = {k for k in man if k not in gone}   # liegt schon (nicht als entfernt markiert) im Bucket: scheitert der Upload, bleibt die alte Fassung erreichbar
    todo = []
    for key, f in keys.items():
        h = hashlib.md5(f.read_bytes()).hexdigest()
        if man.get(key) != h or key in gone: todo.append((key, f, h))
    # Sitemaps, umgezogene Datenexporte und Blog-Import (checked, wenige Schluessel) im Bucket nachsehen, auch wenn das Manifest sie als geladen fuehrt: der Spiegel des
    # vorigen Laufs (tools/r2_site_sync.py im Deploy-Job, Metadaten src=docs) kann sie nach diesem Upload noch mit seiner docs/-Fassung ueberschreiben,
    # solange er parallel laeuft (beim Umzug lagen sie zuletzt in docs/). Ein src=docs-Objekt liefert der Site-Worker nicht aus (404), und ohne
    # Inhaltsaenderung luede es kein spaeterer Lauf neu. Fehlt das Objekt ganz, ebenso neu laden.
    queued = {t[0] for t in todo}
    for key, f in keys.items():
        if key in queued or not checked(key): continue
        try: md = s3.head_object(Bucket=bucket, Key=key).get("Metadata") or {}
        except Exception as e:
            code = str(((getattr(e, "response", None) or {}).get("Error") or {}).get("Code", ""))
            if code in ("NoSuchKey", "404", "NotFound") or "NoSuchKey" in type(e).__name__ or "NotFound" in type(e).__name__: md = {"missing": "1"}
            else: print("Sitemap/Export im Bucket nicht pruefbar:", key, type(e).__name__); continue
        if md.get("src") == "docs" or md.get("missing") == "1":
            print("Sitemap/Export neu laden:", key, "(nur Spiegel aus docs/)" if md.get("src") == "docs" else "(fehlt im Bucket)")
            man.pop(key, None); served.discard(key)   # gilt als nicht ausgeliefert: scheitert der Upload, Ende 1 wie bei einer fehlenden Sitemap oder einem fehlenden Export (Blog-Import: nur Hinweis)
            todo.append((key, f, hashlib.md5(f.read_bytes()).hexdigest()))
    print(f"{len(files)} Dateien, {len(todo)} neu, geaendert oder wieder erzeugt")
    def save_man():   # atomar schreiben: ein abgebrochener Lauf hinterlaesst nie eine halbe Liste
        MAN.parent.mkdir(parents=True, exist_ok=True); tmp = MAN.with_suffix(".tmp")
        tmp.write_text(json.dumps(man, sort_keys=True), encoding="utf-8"); tmp.replace(MAN)
    n = [0]
    def on_ok(item):
        man[item[0]] = item[2]; n[0] += 1
        if n[0] % 2000 == 0: save_man()   # Zwischenstand: auch bei Abbruch mitten im Upload bleibt das Hochgeladene vermerkt
    try:
        ok, failed = upload(s3, bucket, todo, on_ok=on_ok)
    finally:
        save_man()
    # T41: geaenderte Seiten und Dateien fuer den Purge nach dem Deploy (der Site-Worker haelt R2-Antworten 4 h im Kanten-Cache unter /__r2c<adresse>)
    changed = sorted({url_of(k) for k, _f, _h in ok if not IMG.search(k)})
    Path(os.environ.get("R2_CHANGED_OUT", "r2-changed.json")).write_text(json.dumps(changed), encoding="utf-8")
    print(f"fuer den Purge vorgemerkt: {len(changed)} Adressen")
    print(f"hochgeladen: {len(ok)}, Fehler: {len(failed)}, im Manifest: {len(man)}")
    if failed: print(f"::warning::R2-Upload r2out: {len(failed)} Fehler - diese Dateien werden beim naechsten Lauf erneut geladen")
    # Seiten in r2out/ gibt es nur im Bucket (seit 11.11.2026 alle Sprachseiten ausser en/de). Fehlt eine davon dort noch ganz, antwortete sie nach dem
    # Deploy mit 404 (z. B. die aus docs/ umgezogenen Seiten beim ersten Lauf) -> Ende 1, der Seitenbau veroeffentlicht nicht; der naechste Lauf laedt nur den Rest.
    # Ebenso die Sitemaps der Sprachen ausser en/de (seit 16.11.2026 nur in r2out/): der Index sitemap.xml in GitHub Pages verweist auf sie; und die aus
    # docs/ umgezogenen Datenexporte (EXPORT: Register fuer den Community-Worker, og-manifest.json, seo-report.json), die es nach dem Deploy sonst nirgends gaebe.
    lost = sorted(k for k, _f, _h in failed if (k.endswith(".html") or moved(k)) and k not in served)
    if lost:
        print(f"::error::R2-Upload r2out: {len(lost)} Seiten, Sitemaps oder Datenexporte fehlen im Bucket (z. B. {', '.join(lost[:3])}) - kein Deploy, sonst antworten sie mit 404"); return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
