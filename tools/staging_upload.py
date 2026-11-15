#!/usr/bin/env python3
"""Staging-Bau in den EIGENEN Bucket m365-fm-staging laden (nur im Staging-Workflow site-staging.yml).

  python3 tools/staging_upload.py docs r2out

- Schluessel pages/<pfad> wie live (pages/a/index.html -> /a/), damit sitewrk/index.js (stagingFetch) sie findet. docs/ zuerst, r2out/ darueber.
- Der Bucket steht FEST im Skript (m365-fm-staging). Eine Umgebungsvariable R2_BUCKET mit einem anderen Wert bricht ab; es wird nie ein anderer Bucket beschrieben,
  auch nicht, wenn die Live-Zugangsdaten (R2_*) in der Umgebung stehen: gelesen werden nur STAGING_R2_ACCESS_KEY_ID und STAGING_R2_SECRET_ACCESS_KEY.
- Nur geaenderte Dateien werden geladen (MD5 gegen die ETag-Liste des Buckets), nicht mehr vorhandene Staging-Seiten werden geloescht (Staging ist Wegwerf-Stand).
- Zugang: R2_ACCOUNT_ID (Konto-Kennung, kein Geheimnis), STAGING_R2_ACCESS_KEY_ID, STAGING_R2_SECRET_ACCESS_KEY. Werte werden nie ausgegeben.
"""
import hashlib
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from r2_common import upload  # noqa: E402

STAGING_BUCKET = "m365-fm-staging"
LIVE_BUCKET = "m365-fm"
MIN_FILES = 20   # ein leerer oder fast leerer Bau darf den Staging-Stand nicht leerraeumen


def local_files(dirs):
    """docs/ zuerst, spaetere Ordner ueberschreiben. -> {schluessel: Pfad}"""
    out = {}
    for d in dirs:
        root = Path(d)
        if not root.exists():
            continue
        for f in root.rglob("*"):
            if f.is_file():
                out["pages/" + f.relative_to(root).as_posix()] = f
    return out


def md5(path):
    return hashlib.md5(Path(path).read_bytes()).hexdigest()


def remote_etags(s3, bucket):
    """-> {schluessel: md5} fuer alles unter pages/ (ETag einteiliger Uploads = MD5)"""
    out, tok = {}, None
    while True:
        kw = {"Bucket": bucket, "Prefix": "pages/", "MaxKeys": 1000}
        if tok:
            kw["ContinuationToken"] = tok
        r = s3.list_objects_v2(**kw)
        for o in r.get("Contents", []):
            out[o["Key"]] = o["ETag"].strip('"')
        if not r.get("IsTruncated"):
            return out
        tok = r["NextContinuationToken"]


def plan(files, remote):
    """-> (zu laden: [(key, pfad, md5)], zu loeschen: [key])"""
    todo = []
    for key, f in files.items():
        h = md5(f)
        if remote.get(key) != h:
            todo.append((key, f, h))
    stale = sorted(k for k in remote if k not in files)
    return todo, stale


def check_bucket(env=os.environ):
    b = env.get("R2_BUCKET", "")
    if b and b != STAGING_BUCKET:
        raise SystemExit(f"::error::R2_BUCKET ist {b!r}. Der Staging-Upload schreibt nur nach {STAGING_BUCKET} - Abbruch.")
    return STAGING_BUCKET


def client(env=os.environ):
    miss = [k for k in ("R2_ACCOUNT_ID", "STAGING_R2_ACCESS_KEY_ID", "STAGING_R2_SECRET_ACCESS_KEY") if not env.get(k)]
    if miss:
        raise SystemExit("::error::Zugangsdaten fehlen (Namen): " + ", ".join(miss) + " - siehe STAGING.md (Umgebung staging).")
    import boto3
    from botocore.config import Config
    return boto3.client("s3", endpoint_url=f"https://{env['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com", aws_access_key_id=env["STAGING_R2_ACCESS_KEY_ID"],
                        aws_secret_access_key=env["STAGING_R2_SECRET_ACCESS_KEY"], region_name="auto", config=Config(max_pool_connections=40, retries={"max_attempts": 5, "mode": "standard"}))


def sync(s3, bucket, files, log=print):
    if bucket != STAGING_BUCKET:
        raise SystemExit(f"Nur {STAGING_BUCKET} erlaubt, nicht {bucket!r}")
    if len(files) < MIN_FILES:
        raise SystemExit(f"::error::Nur {len(files)} Dateien im Bau (Minimum {MIN_FILES}) - Bau fehlgeschlagen? Staging-Stand bleibt unveraendert.")
    remote = remote_etags(s3, bucket)
    todo, stale = plan(files, remote)
    log(f"{len(files)} Dateien im Bau, {len(remote)} im Bucket, {len(todo)} zu laden, {len(stale)} zu loeschen")
    ok, failed = upload(s3, bucket, todo, retries=2, strict=True, cache_control="no-store")
    log(f"hochgeladen: {len(ok)}, Fehler: {len(failed)}")
    if failed:
        raise SystemExit(f"::error::{len(failed)} Dateien nicht geladen (z. B. {failed[0][0]})")
    for i in range(0, len(stale), 1000):
        s3.delete_objects(Bucket=bucket, Delete={"Objects": [{"Key": k} for k in stale[i:i + 1000]], "Quiet": True})
    return len(ok), len(stale)


if __name__ == "__main__":
    dirs = sys.argv[1:] or ["docs", "r2out"]
    bucket = check_bucket()
    files = local_files(dirs)
    s3 = client()
    n, d = sync(s3, bucket, files)
    print(f"Staging-Bucket {bucket}: {n} geladen, {d} entfernt.")
