"""Spiegel der veroeffentlichten Website (docs/ = Inhalt des GitHub-Pages-Artefakts) im R2-Bucket: Grundlage fuer R2 als Ursprung
(sitewrk/index.js, R2_PRIMARY=1). Laeuft im Deploy-Job NACH deploy-pages (nur main, Umgebung github-pages): R2 ist nie neuer als GitHub Pages.

Ablauf (Aufruf: python tools/r2_site_sync.py <docs>):
 1. Liste aller Schluessel unter pages/ direkt aus dem Bucket (unabhaengig von Caches) und Entfernt-Liste meta/gone.json.
 2. Hochladen: neu, geaendert (MD5-Manifest R2_MANIFEST), im Bucket fehlend oder als entfernt markiert. Erst Dateien, dann Seiten,
    Fehlschlaege werden wiederholt. Metadaten src=docs: der alte R2-Rueckfall nach einem 404 liefert diese Spiegel-Objekte nie aus.
 3. Entfernt markieren - nichts wird geloescht: Schluessel im Bucket, die weder in docs/ noch in r2out/ (R2_KEEP_KEYS, Liste aus dem Bau)
    vorkommen, bekommen Metadaten gone=1, der Inhalt bleibt. So verhaelt sich R2 wie GitHub Pages nach einem Deploy (Umbenennungen,
    geloeschte Entitaeten). Sicherung: mehr Markierungen als Dateien im Bau -> Abbruch (ausser R2_TOMBSTONE_FORCE=1).
 4. Ende 0 nur ohne jeden Fehler. Die Bau-Kennung setzt danach ein eigener Aufruf (--marker <docs>), nach dem Purge.
    Der Site-Worker nutzt R2 nur, wenn pages/r2-build.txt mit /r2-build.txt auf GitHub Pages uebereinstimmt: bei jedem Fehler liefert
    automatisch GitHub Pages, nie ein veralteter Stand aus R2.
Umgebung: R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY (GitHub-Secrets); R2_MANIFEST, R2_KEEP_KEYS, R2_CHANGED_OUT, R2_TOMBSTONE_FORCE."""
import hashlib, json, os, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from r2_common import GONE_KEY, IMG, client, ctype, read_gone, upload, url_of   # noqa: E402

MARKER = "r2-build.txt"
META = {"src": "docs"}


def fail(msg):
    print("::error::R2-Spiegel: " + msg + " - R2 bleibt aus, GitHub Pages liefert weiter"); return 1


def list_keys(s3, bucket):
    keys, tok = set(), None
    while True:
        kw = {"Bucket": bucket, "Prefix": "pages/", "MaxKeys": 1000}
        if tok: kw["ContinuationToken"] = tok
        r = s3.list_objects_v2(**kw)
        keys |= {o["Key"] for o in r.get("Contents", [])}
        if not r.get("IsTruncated"): return keys
        tok = r["NextContinuationToken"]


def marker(src):
    s3, bucket = client()
    if not s3: return fail("Zugangsdaten fehlen")
    f = src / MARKER
    if not f.exists(): return fail(f"{MARKER} fehlt im Artefakt")
    s3.put_object(Bucket=bucket, Key="pages/" + MARKER, Body=f.read_bytes(), ContentType="text/plain; charset=utf-8", CacheControl="no-store", Metadata=META)
    print("Bau-Kennung gesetzt:", f.read_text("utf-8").strip()); return 0


def main(src):
    if not src.exists() or not any(src.iterdir()): return fail(f"{src} fehlt oder ist leer")
    s3, bucket = client()
    if not s3: return fail("Zugangsdaten fehlen")
    kf = os.environ.get("R2_KEEP_KEYS", "")
    try: keep = set(json.loads(Path(kf).read_text("utf-8")))
    except Exception: return fail(f"Liste der r2out-Schluessel fehlt oder ist unlesbar ({kf or 'R2_KEEP_KEYS leer'})")
    if not keep: return fail("Liste der r2out-Schluessel ist leer - ohne sie koennten Sprachfassungen als entfernt markiert werden")
    MAN = Path(os.environ.get("R2_MANIFEST", "r2_docs.json"))
    try: man = json.loads(MAN.read_text("utf-8")) if MAN.exists() else {}
    except Exception: man = {}
    files = {"pages/" + f.relative_to(src).as_posix(): f for f in src.rglob("*") if f.is_file() and f.relative_to(src).as_posix() != MARKER}
    man = {k: v for k, v in man.items() if k in files}   # nur aktuelle Schluessel (wandert eine Datei zwischen docs/ und r2out/, wird sie neu geladen)
    in_bucket = list_keys(s3, bucket)
    gone = read_gone(s3, bucket)
    todo = []
    for key, f in files.items():
        h = hashlib.md5(f.read_bytes()).hexdigest()
        if man.get(key) != h or key not in in_bucket or key in gone: todo.append((key, f, h))
    print(f"{len(files)} Dateien im Bau, {len(in_bucket)} Schluessel im Bucket, {len(todo)} zu laden, {len(gone)} als entfernt markiert")
    def save_man():
        MAN.parent.mkdir(parents=True, exist_ok=True); tmp = MAN.with_suffix(".tmp")
        tmp.write_text(json.dumps(man, sort_keys=True), encoding="utf-8"); tmp.replace(MAN)
    n = [0]
    def on_ok(item):
        man[item[0]] = item[2]; n[0] += 1
        if n[0] % 5000 == 0: save_man()
    try:
        ok, failed = upload(s3, bucket, todo, meta=META, retries=2, on_ok=on_ok, strict=True)
    finally:
        save_man()
    loaded = {k for k, _f, _h in ok}
    changed = {url_of(k) for k in loaded if not IMG.search(k)}
    out = Path(os.environ.get("R2_CHANGED_OUT", "r2-changed-docs.json"))
    def write_changed(): out.write_text(json.dumps(sorted(changed)), encoding="utf-8")
    write_changed()
    print(f"hochgeladen: {len(ok)}, Fehler: {len(failed)}")
    if failed: return fail(f"{len(failed)} Dateien nicht geladen (z. B. {failed[0][0]})")
    # Entfernt markieren: nur eigene Spiegel-Objekte (Metadaten src=docs); Altbestand aus r2out/ bleibt wie bisher unberuehrt
    cand = sorted(k for k in in_bucket if k not in files and k not in keep and k not in gone and k != "pages/" + MARKER)
    def head(k):
        try: return k, (s3.head_object(Bucket=bucket, Key=k).get("Metadata") or {}), None
        except Exception as e: return k, None, str(e)[:120]
    def mark(k):
        try:
            s3.copy_object(Bucket=bucket, Key=k, CopySource={"Bucket": bucket, "Key": k}, MetadataDirective="REPLACE", ContentType=ctype(k), CacheControl="public, max-age=600", Metadata={**META, "gone": "1"})
            return k, None
        except Exception as e: return k, str(e)[:120]
    own, foreign, bad = [], 0, []
    with ThreadPoolExecutor(16) as ex:
        for k, md, e in ex.map(head, cand):
            if e: bad.append(k)
            elif md.get("src") == "docs": own.append(k)
            else: foreign += 1
    if bad: return fail(f"{len(bad)} Schluessel nicht pruefbar (z. B. {bad[0]})")
    # Teilen-Bilder (pages/og/) zaehlen nicht mit: sie sind am 4.11.2026 bewusst aus docs/ in den Bucket unter og/ umgezogen (img.m365.fm/og/,
    # tools/r2_og_upload.py) - ihr einmaliges Markieren ist kein Zeichen fuer ein falsches Verzeichnis
    n_guard = sum(1 for k in own if not k.startswith("pages/og/"))
    if n_guard > len(files) and os.environ.get("R2_TOMBSTONE_FORCE") != "1":
        return fail(f"{n_guard} Dateien waeren als entfernt zu markieren, mehr als der Bau enthaelt ({len(files)}) - vermutlich falsches Verzeichnis. "
                    "Bei Absicht einmal mit R2_TOMBSTONE_FORCE=1 laufen lassen")
    marked = []
    with ThreadPoolExecutor(16) as ex:
        for k, e in ex.map(mark, own):
            if e:
                bad.append(k)
                if len(bad) <= 5: print("Markieren fehlgeschlagen", k, e)
            else: marked.append(k)
    # Liste aktualisieren: neu markiert dazu; was der Bau wieder erzeugt (eben neu geladen, Markierung weg) raus; r2out-Schluessel nur raus,
    # wenn das Objekt nicht mehr markiert ist (der r2out-Upload im Bau-Job laedt sie neu, siehe tools/r2_pages_upload.py)
    still = set()
    for k in sorted(gone & keep):
        try:
            if (s3.head_object(Bucket=bucket, Key=k).get("Metadata") or {}).get("gone") == "1": still.add(k)
        except Exception: still.add(k)
    new_gone = (gone - loaded - keep) | still | set(marked)
    s3.put_object(Bucket=bucket, Key=GONE_KEY, Body=json.dumps(sorted(new_gone)).encode("utf-8"), ContentType="application/json; charset=utf-8", CacheControl="no-store")
    changed |= {url_of(k) for k in marked if not IMG.search(k)}; write_changed()
    print(f"als entfernt markiert (Inhalt bleibt im Bucket): {len(marked)}, Liste: {len(new_gone)}, nicht vom Spiegel angelegt (unberuehrt): {foreign}")
    if bad: return fail(f"{len(bad)} Dateien nicht als entfernt markiert")
    return 0


if __name__ == "__main__":
    a = sys.argv[1:]
    if a[:1] == ["--marker"] and len(a) == 2: sys.exit(marker(Path(a[1])))
    if len(a) == 1: sys.exit(main(Path(a[0])))
    print(__doc__); sys.exit(2)
