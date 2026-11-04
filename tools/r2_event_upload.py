"""Liest bzw. aktualisiert den geschuetzten Community-Event-Snapshot in R2."""
import hashlib
import os
import sys
from pathlib import Path

from r2_common import client, upload

KEY = "meta/ext_events.json"
OUTPUT = Path(os.environ.get("EVENTS_OUTPUT", "/tmp/m365-fm-ext-events.json"))


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "upload"
    s3, bucket = client()
    if not s3:
        return 1
    if mode == "download":
        try:
            response = s3.get_object(Bucket=bucket, Key=KEY)
        except Exception as exc:
            code = str(((getattr(exc, "response", None) or {}).get("Error") or {}).get("Code", ""))
            if code in ("NoSuchKey", "404", "NotFound"):
                return 0
            raise
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT.write_bytes(response["Body"].read())
        return 0
    if mode != "upload" or not OUTPUT.is_file():
        return 1
    digest = hashlib.sha256(OUTPUT.read_bytes()).hexdigest()
    _, failed = upload(s3, bucket, [(KEY, OUTPUT, digest)], strict=True,
                       cache_control="private, no-store")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
