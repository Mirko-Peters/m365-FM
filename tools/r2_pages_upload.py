"""Seiten aus r2out/ (Seitenbau: Sprachfassungen, Suchindex, Exporte - liegen nur im Bucket, nicht in GitHub Pages) in den R2-Bucket laden:
Schluessel pages/<pfad>, Content-Type nach Endung, nur geaenderte Dateien (MD5-Manifest in data/cache), erst Dateien, dann Seiten.
Es wird nichts geloescht. Schluessel, die tools/r2_site_sync.py als entfernt markiert hat (meta/gone.json) und die der Bau wieder erzeugt,
werden neu geladen (sonst bliebe die Markierung bei unveraendertem Inhalt stehen).
Zugang ueber R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY (GitHub-Secrets). Aufruf: python tools/r2_pages_upload.py [r2out]
Umgebung optional: R2_CHANGED_OUT (Adressen fuer den Purge), R2_KEYS_OUT (alle Schluessel aus r2out/ fuer den Spiegel im Deploy-Job)."""
import hashlib, json, os, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from r2_common import IMG, client, read_gone, upload, url_of   # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "r2out"
MAN = ROOT / "data" / "cache" / "r2_pages.json"


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
    todo = []
    for key, f in keys.items():
        h = hashlib.md5(f.read_bytes()).hexdigest()
        if man.get(key) != h or key in gone: todo.append((key, f, h))
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
    return 0


if __name__ == "__main__":
    sys.exit(main())
