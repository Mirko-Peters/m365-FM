"""Teilen-Bilder (Open Graph, generate_og.py -> r2img/og/...) in den R2-Bucket laden: Schluessel og/<pfad>.png, ausgeliefert ueber
https://img.m365.fm/og/<pfad>.png (generate_site.py OG_BASE). Liegt im Bau-Job VOR dem GitHub-Pages-Deploy: neue Seiten gehen erst
live, wenn ihr Bild im Bucket ist. Nur neue/geaenderte Bilder (MD5-Manifest R2_OG_MANIFEST, Standard data/cache/r2_og.json).
Es wird nichts geloescht (Bilder entfernter Seiten bleiben im Bucket). Zugang nur ueber GitHub-Secrets (R2_ACCOUNT_ID, R2_BUCKET,
R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY). Aufruf: python tools/r2_og_upload.py [r2img]
Ende 1 nur, wenn Bilder trotz Wiederholung nicht hochgeladen wurden (sie werden beim naechsten Lauf erneut versucht)."""
import hashlib, json, os, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from r2_common import client, upload   # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
CC = "public, max-age=86400"   # Pfade sind fest (Titel aendert sich -> neues Bild unter derselben Adresse): 1 Tag statt immutable


def main(src):
    if not src.exists():
        print(f"{src} fehlt - keine Teilen-Bilder zu laden"); return 0
    files = {f.relative_to(src).as_posix(): f for f in src.rglob("*.png") if f.is_file()}
    s3, bucket = client()
    if not s3:
        print("Teilen-Bilder nicht hochgeladen (Zugangsdaten fehlen) - neue Seiten zeigen ihr Teilen-Bild erst nach dem naechsten Lauf"); return 0
    man_path = Path(os.environ.get("R2_OG_MANIFEST", ROOT / "data" / "cache" / "r2_og.json"))
    try: man = json.loads(man_path.read_text("utf-8")) if man_path.exists() else {}
    except Exception: man = {}
    man = {k: v for k, v in man.items() if k in files}   # nur aktuelle Bilder
    todo = []
    for key, f in files.items():
        h = hashlib.md5(f.read_bytes()).hexdigest()
        if man.get(key) != h: todo.append((key, f, h))
    print(f"{len(files)} Teilen-Bilder, {len(todo)} neu oder geaendert")
    def save():
        man_path.parent.mkdir(parents=True, exist_ok=True); tmp = man_path.with_suffix(".tmp")
        tmp.write_text(json.dumps(man, sort_keys=True), encoding="utf-8"); tmp.replace(man_path)
    n = [0]
    def on_ok(item):
        man[item[0]] = item[2]; n[0] += 1
        if n[0] % 2000 == 0: save()   # Zwischenstand: ein abgebrochener Erstlauf faengt nicht von vorn an
    try:
        ok, failed = upload(s3, bucket, todo, retries=2, on_ok=on_ok, cache_control=CC)
    finally:
        save()
    print(f"hochgeladen: {len(ok)}, Fehler: {len(failed)}, im Manifest: {len(man)}")
    if failed:
        print(f"::warning::Teilen-Bilder: {len(failed)} nicht hochgeladen (z. B. {failed[0][0]}) - naechster Lauf versucht sie erneut")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "r2img"))
