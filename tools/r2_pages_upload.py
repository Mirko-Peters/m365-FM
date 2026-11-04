"""Seiten aus r2out/ oder der ganzen Website docs/ (Seitenbau) in den R2-Bucket laden: Schluessel pages/<pfad>, Content-Type nach Endung,
nur geaenderte Dateien (MD5-Manifest in data/cache). Erst Dateien (CSS, JS, JSON ...), dann Seiten: eine neue Seite zeigt nie auf ein noch fehlendes Stylesheet.
Es wird nichts geloescht. Mit R2_TOMBSTONE=1 (docs/, R2 als Ursprung) werden Dateien, die der Seitenbau nicht mehr erzeugt, nur als entfernt markiert
(Metadaten gone=1, Inhalt bleibt im Bucket); der Site-Worker liefert sie dann nicht mehr aus - wie GitHub Pages nach einem Deploy.
Zugang ueber R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY (GitHub-Secrets).
Aufruf: python tools/r2_pages_upload.py [r2out|docs]; Umgebung optional: R2_MANIFEST, R2_CHANGED_OUT, R2_TOMBSTONE=1, R2_KEEP_DIR (deren Dateien nie markieren)"""
import hashlib, json, mimetypes, os, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "r2out"
MAN = Path(os.environ.get("R2_MANIFEST") or ROOT / "data" / "cache" / "r2_pages.json")
CT = {".html": "text/html; charset=utf-8", ".json": "application/json; charset=utf-8", ".jsonld": "application/ld+json; charset=utf-8", ".xml": "application/xml; charset=utf-8",
      ".txt": "text/plain; charset=utf-8", ".md": "text/markdown; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
      ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon", ".avif": "image/avif",
      ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".ics": "text/calendar; charset=utf-8", ".vtt": "text/vtt; charset=utf-8", ".webmanifest": "application/manifest+json",
      ".xsl": "application/xslt+xml", ".pdf": "application/pdf", ".csv": "text/csv; charset=utf-8"}
TOMB_MAX_SHARE, TOMB_MAX = 0.05, 2000   # mehr Entfernungen auf einmal = vermutlich ein unvollstaendiger Bau: dann nichts markieren, nur warnen


def ctype(key):
    ext = os.path.splitext(key)[1].lower()
    return CT.get(ext) or mimetypes.guess_type(key)[0] or "application/octet-stream"


def url_of(key):   # Schluessel -> Adresse (wie tools/page_hashes.py): pages/a/index.html -> /a/, pages/x.json -> /x.json
    rel = key[len("pages/"):]
    return "/" + (rel[:-len("index.html")] if rel.endswith("index.html") else rel)


def main():
    if not SRC.exists():
        print(f"{SRC} fehlt - nichts zu laden"); return 0
    for k in ("R2_ACCOUNT_ID", "R2_BUCKET", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"):
        if not os.environ.get(k):
            print(f"{k} fehlt - R2-Upload uebersprungen (Seiten bleiben nur erreichbar, wenn sie schon im Bucket liegen)"); return 0
    import boto3
    s3 = boto3.client("s3", endpoint_url=f"https://{os.environ['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com", aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"], aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"], region_name="auto")
    bucket = os.environ["R2_BUCKET"]
    try: man = json.loads(MAN.read_text("utf-8")) if MAN.exists() else {}
    except Exception: man = {}
    files = [f for f in SRC.rglob("*") if f.is_file()]
    todo, keys = [], set()
    for f in files:
        key = "pages/" + f.relative_to(SRC).as_posix(); keys.add(key); h = hashlib.md5(f.read_bytes()).hexdigest()
        if man.get(key) != h: todo.append((key, f, h))
    todo.sort(key=lambda x: (x[0].endswith(".html"), x[0]))   # erst Dateien, dann Seiten
    print(f"{len(files)} Dateien, {len(todo)} neu oder geaendert")
    ok = err = 0
    def save_man():   # atomar schreiben: ein abgebrochener Lauf hinterlaesst nie eine halbe Liste
        MAN.parent.mkdir(parents=True, exist_ok=True); tmp = MAN.with_suffix(".tmp")
        tmp.write_text(json.dumps(man, sort_keys=True), encoding="utf-8"); tmp.replace(MAN)
    def put(item):
        key, f, h = item
        try: s3.put_object(Bucket=bucket, Key=key, Body=f.read_bytes(), ContentType=ctype(key), CacheControl="public, max-age=600"); return key, h, None
        except Exception as e: return key, h, str(e)[:120]
    try:
        with ThreadPoolExecutor(16) as ex:
            for phase in ([t for t in todo if not t[0].endswith(".html")], [t for t in todo if t[0].endswith(".html")]):   # Phase 1 komplett vor Phase 2
                for key, h, e in ex.map(put, phase):
                    if e:
                        err += 1
                        if err <= 5: print("Fehler", key, e)
                    else:
                        ok += 1; man[key] = h
                        if ok % 2000 == 0: save_man()   # Zwischenstand: auch bei Abbruch mitten im Upload bleibt das Hochgeladene vermerkt
    finally:
        save_man()
    # Entfernt markieren (nur mit R2_TOMBSTONE=1): im Manifest, aber nicht mehr im Bau und nicht im zweiten Verzeichnis (R2_KEEP_DIR, z. B. r2out/)
    gone = []
    if os.environ.get("R2_TOMBSTONE") == "1":
        keep = set()
        kd = os.environ.get("R2_KEEP_DIR")
        if kd and Path(kd).exists():
            keep = {"pages/" + x.relative_to(Path(kd)).as_posix() for x in Path(kd).rglob("*") if x.is_file()}
        cand = sorted(k for k in man if k not in keys and k not in keep)
        if cand and (len(cand) > TOMB_MAX or len(cand) > TOMB_MAX_SHARE * max(len(man), 1)):
            print(f"::warning::{len(cand)} Dateien waeren als entfernt zu markieren (mehr als {TOMB_MAX} bzw. {TOMB_MAX_SHARE:.0%}) - vermutlich unvollstaendiger Bau, nichts markiert. Beispiele: {cand[:5]}")
        else:
            for k in cand:
                try:
                    s3.copy_object(Bucket=bucket, Key=k, CopySource={"Bucket": bucket, "Key": k}, MetadataDirective="REPLACE", ContentType=ctype(k), CacheControl="public, max-age=600", Metadata={"gone": "1"})
                    man.pop(k, None); gone.append(k)
                except Exception as e:
                    print("Markieren fehlgeschlagen", k, str(e)[:120])
            save_man()
            print(f"als entfernt markiert (Inhalt bleibt im Bucket): {len(gone)}")
    # T41: geaenderte Seiten und Dateien fuer den Purge nach dem Deploy (der Site-Worker haelt R2-Antworten 4 h im Kanten-Cache unter /__r2c<adresse>)
    changed = sorted({url_of(k) for k, _f, _h in todo if man.get(k) == _h} | {url_of(k) for k in gone})
    Path(os.environ.get("R2_CHANGED_OUT", "r2-changed.json")).write_text(json.dumps(changed), encoding="utf-8")
    print(f"fuer den Purge vorgemerkt: {len(changed)} Seiten")
    print(f"hochgeladen: {ok}, Fehler: {err}, im Manifest: {len(man)}")
    if err: print(f"::warning::R2-Upload {SRC.name}: {err} Fehler - diese Dateien werden beim naechsten Lauf erneut geladen")
    return 0


if __name__ == "__main__":
    sys.exit(main())
