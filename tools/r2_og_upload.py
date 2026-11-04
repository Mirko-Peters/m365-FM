"""Teilen-Bilder (Open Graph, generate_og.py -> r2img/og/...) in den R2-Bucket laden: Schluessel og/<pfad>.png, ausgeliefert ueber
https://img.m365.fm/og/<pfad>.png (generate_site.py OG_BASE). Laeuft im Bau-Job VOR dem GitHub-Pages-Deploy (nur main): neue Seiten gehen
erst live, wenn ihr Bild im Bucket ist - mit OG_REQUIRED=1 bricht jeder Fehler den Bau ab (kein Deploy, der naechste Lauf versucht es erneut).
Abgleich direkt mit dem Bucket (Liste mit ETag = MD5 einfacher PUTs): geladen wird, was fehlt oder sich geaendert hat - unabhaengig von Caches.
Es wird nichts geloescht (Bilder entfernter Seiten bleiben im Bucket). Zugang nur ueber GitHub-Secrets (R2_ACCOUNT_ID, R2_BUCKET,
R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY). Aufruf: python tools/r2_og_upload.py [r2img]"""
import hashlib, os, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from r2_common import client, upload   # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
CC = "public, max-age=86400"   # Pfade sind fest (Titel aendert sich -> neues Bild unter derselben Adresse): 1 Tag statt immutable
PREFIX = "og/"


def problem(msg):
    """Mit OG_REQUIRED=1 (main) ein Fehler, der den Deploy aufhaelt; sonst nur ein Hinweis."""
    if os.environ.get("OG_REQUIRED") == "1":
        print("::error::Teilen-Bilder: " + msg + " - kein Deploy, damit og:image nie ins Leere zeigt"); return 1
    print("Teilen-Bilder: " + msg); return 0


def bucket_etags(s3, bucket):
    out, tok = {}, None
    while True:
        kw = {"Bucket": bucket, "Prefix": PREFIX, "MaxKeys": 1000}
        if tok: kw["ContinuationToken"] = tok
        r = s3.list_objects_v2(**kw)
        for o in r.get("Contents", []): out[o["Key"]] = str(o.get("ETag", "")).strip('"')
        if not r.get("IsTruncated"): return out
        tok = r["NextContinuationToken"]


def main(src):
    files = {f.relative_to(src).as_posix(): f for f in src.rglob("*.png") if f.is_file()} if src.exists() else {}
    if not files: return problem(f"keine Bilder unter {src}")
    s3, bucket = client()
    if not s3: return problem("Zugangsdaten fehlen")
    have = bucket_etags(s3, bucket)
    todo = []
    for key, f in files.items():
        h = hashlib.md5(f.read_bytes()).hexdigest()
        if have.get(key) != h: todo.append((key, f, h))
    print(f"{len(files)} Teilen-Bilder, {len(have)} im Bucket, {len(todo)} neu oder geaendert")
    ok, failed = upload(s3, bucket, todo, retries=2, cache_control=CC)
    print(f"hochgeladen: {len(ok)}, Fehler: {len(failed)}")
    if failed: return problem(f"{len(failed)} nicht hochgeladen (z. B. {failed[0][0]}); der naechste Lauf laedt nur den Rest")
    return 0


if __name__ == "__main__":
    sys.exit(main(Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "r2img"))
