"""Gemeinsames fuer tools/r2_pages_upload.py (r2out/, Bau-Job) und tools/r2_site_sync.py (Spiegel der Website, Deploy-Job).
Schluessel im Bucket: pages/<pfad> wie die Adresse (pages/a/index.html -> /a/). Zugang nur ueber GitHub-Secrets (R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)."""
import json, mimetypes, os, re
from concurrent.futures import ThreadPoolExecutor

CT = {".html": "text/html; charset=utf-8", ".json": "application/json; charset=utf-8", ".jsonld": "application/ld+json; charset=utf-8", ".xml": "application/xml; charset=utf-8",
      ".txt": "text/plain; charset=utf-8", ".md": "text/markdown; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
      ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon", ".avif": "image/avif",
      ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".ics": "text/calendar; charset=utf-8", ".vtt": "text/vtt; charset=utf-8", ".webmanifest": "application/manifest+json",
      ".xsl": "application/xslt+xml", ".pdf": "application/pdf", ".csv": "text/csv; charset=utf-8"}
IMG = re.compile(r"\.(png|jpe?g|gif|webp|avif|svg|ico)$", re.I)   # wie im Site-Worker: Bilder kommen nie aus R2 zuerst, also auch nie unter /__r2c
GONE_KEY = "meta/gone.json"   # Liste der als entfernt markierten Schluessel (nur r2_site_sync.py schreibt sie)


def ctype(key):
    ext = os.path.splitext(key)[1].lower()
    return CT.get(ext) or mimetypes.guess_type(key)[0] or "application/octet-stream"


def url_of(key):   # Schluessel -> Adresse (wie tools/page_hashes.py)
    rel = key[len("pages/"):]
    return "/" + (rel[:-len("index.html")] if rel.endswith("index.html") else rel)


def client():
    """S3-Client fuer R2 oder None (fehlende Zugangsdaten werden mit Namen gemeldet, nie mit Wert)."""
    miss = [k for k in ("R2_ACCOUNT_ID", "R2_BUCKET", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY") if not os.environ.get(k)]
    if miss:
        print("Zugangsdaten fehlen: " + ", ".join(miss)); return None, None
    import boto3
    s3 = boto3.client("s3", endpoint_url=f"https://{os.environ['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com", aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
                      aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"], region_name="auto")
    return s3, os.environ["R2_BUCKET"]


def read_gone(s3, bucket):
    try:
        return set(json.loads(s3.get_object(Bucket=bucket, Key=GONE_KEY)["Body"].read().decode("utf-8")))
    except Exception as e:   # noch keine Liste: leer; jeder andere Fehler bricht ab (sonst wuerden Markierungen vergessen)
        code = str(((getattr(e, "response", None) or {}).get("Error") or {}).get("Code", ""))
        if code in ("NoSuchKey", "404", "NotFound") or "NoSuchKey" in type(e).__name__: return set()
        raise


def upload(s3, bucket, todo, meta=None, retries=1, on_ok=None):
    """todo: [(key, path, hash)] -> (ok_keys, failed_keys). Erst Dateien, dann Seiten (eine neue Seite zeigt nie auf ein noch fehlendes Stylesheet);
    Fehlschlaege werden `retries`-mal wiederholt. Phase 2 entfaellt, wenn in Phase 1 etwas endgueltig fehlschlug."""
    def put(item):
        key, f, h = item
        try:
            kw = {"Metadata": meta} if meta else {}
            s3.put_object(Bucket=bucket, Key=key, Body=f.read_bytes(), ContentType=ctype(key), CacheControl="public, max-age=600", **kw); return item, None
        except Exception as e: return item, str(e)[:120]
    ok, failed, shown = [], [], [0]
    with ThreadPoolExecutor(16) as ex:
        for phase in ([t for t in todo if not t[0].endswith(".html")], [t for t in todo if t[0].endswith(".html")]):
            if failed: break   # Seiten erst, wenn alle Dateien da sind
            rest = phase
            for _ in range(retries + 1):
                bad = []
                for item, e in ex.map(put, rest):
                    if e:
                        bad.append(item)
                        if shown[0] < 5: shown[0] += 1; print("Fehler", item[0], e)
                    else:
                        ok.append(item)
                        if on_ok: on_ok(item)
                rest = bad
                if not rest: break
            failed += rest
    return ok, failed
