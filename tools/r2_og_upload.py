"""Teilen-Bilder (Open Graph, generate_og.py -> r2img/og/...) in den R2-Bucket laden: Schluessel og/<pfad>.png, ausgeliefert ueber
https://img.m365.fm/og/<pfad>.png (generate_site.py OG_BASE). Laeuft im Bau-Job VOR dem GitHub-Pages-Deploy (nur main): neue Seiten gehen
erst live, wenn ihr Bild im Bucket ist - mit OG_REQUIRED=1 bricht jeder Fehler den Bau ab (kein Deploy, der naechste Lauf versucht es erneut).
Abgleich direkt mit dem Bucket (Liste mit ETag = MD5 einfacher PUTs): geladen wird, was fehlt oder sich geaendert hat - unabhaengig von Caches.
Bilder entfernter Seiten bleiben im Bucket - mit einer Ausnahme (Datenschutz, PR #320): persoenliche Karten (PERSONAL: Einladungskarte
og/einladung/<kuerzel>.png mit Foto und Name, Karte der Profilseite og/[<sprache>/]community/u/<kuerzel>.png mit Name) werden geloescht, sobald
der Bau sie nicht mehr erzeugt, also nach Kontoloeschung oder wenn das Profil nicht mehr oeffentlich ist. Sicherungen: nichts, wenn der Bau gar keine
Karte der Art enthaelt (Profil-Export ausgefallen) oder mehr zu loeschen waere als 10 bzw. als der Bau enthaelt - beides nur bewusst mit der
Repo-Variable OG_PRUNE_FORCE=1 (site.yml). Kuerzel stehen nie im Log.
Zugang nur ueber GitHub-Secrets (R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY). Aufruf: python tools/r2_og_upload.py [r2img]
Seit dem Service-Umbau (4.11.2026) auch die Illustrationen der Service-Landingpages (generate_service_images.py -> r2img/services/...,
WebP + PNG), Schluessel services/<IMG_VER>/<seite>/..., ausgeliefert ueber https://img.m365.fm/services/... (site_landing.py)."""
import hashlib, os, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from r2_common import client, upload   # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
CC = "public, max-age=86400"   # Pfade sind fest (Titel aendert sich -> neues Bild unter derselben Adresse): 1 Tag statt immutable
PREFIXES = ("og/", "services/")
EXT = (".png", ".webp")
# Persoenliche Karten: Schluessel im Bucket, die es nur geben darf, solange der Bau sie erzeugt (site_invite.py, Profilseite in site_members.py)
PERSONAL = {"Einladungskarten": re.compile(r"^og/einladung/[^/]+\.png$"), "Profilkarten": re.compile(r"^og/(?:[a-z]{2}/)?community/u/[^/]+\.png$")}


def problem(msg):
    """Mit OG_REQUIRED=1 (main) ein Fehler, der den Deploy aufhaelt; sonst nur ein Hinweis."""
    if os.environ.get("OG_REQUIRED") == "1":
        print("::error::Teilen-Bilder: " + msg + " - kein Deploy, damit og:image nie ins Leere zeigt"); return 1
    print("Teilen-Bilder: " + msg); return 0


def bucket_etags(s3, bucket):
    out = {}
    for prefix in PREFIXES:
        tok = None
        while True:
            kw = {"Bucket": bucket, "Prefix": prefix, "MaxKeys": 1000}
            if tok: kw["ContinuationToken"] = tok
            r = s3.list_objects_v2(**kw)
            for o in r.get("Contents", []): out[o["Key"]] = str(o.get("ETag", "")).strip('"')
            if not r.get("IsTruncated"): break
            tok = r["NextContinuationToken"]
    return out


def prune(s3, bucket, files, have):
    """Persoenliche Karten loeschen, die der Bau nicht mehr erzeugt (files = Schluessel dieses Baus, have = Schluessel im Bucket).
    Gibt die Zahl der geloeschten Karten zurueck. Ein Fehler haelt den Deploy nicht auf (die Seite soll verschwinden); der naechste Lauf versucht es erneut."""
    n = 0
    for name, rx in PERSONAL.items():
        cur = sum(1 for k in files if rx.match(k)); old = sorted(k for k in have if rx.match(k) and k not in files)
        if not old: continue
        if os.environ.get("OG_PRUNE_FORCE") != "1":   # Sicherungen; bewusst uebergehen: Repo-Variable OG_PRUNE_FORCE=1 fuer einen Lauf (site.yml)
            if not cur:
                print(f"::warning::Teilen-Bilder: {len(old)} {name} im Bucket, aber keine im Bau (Profil-Export ausgefallen?) - nichts geloescht (bewusst: OG_PRUNE_FORCE=1)"); continue
            if len(old) > max(10, cur):
                print(f"::warning::Teilen-Bilder: {len(old)} {name} waeren zu loeschen, der Bau enthaelt nur {cur} - nichts geloescht (bewusst: OG_PRUNE_FORCE=1)"); continue
        bad = 0
        for k in old:
            try: s3.delete_object(Bucket=bucket, Key=k); n += 1
            except Exception as e:
                bad += 1
                if bad == 1: print("Fehler beim Loeschen:", type(e).__name__)   # ohne Schluessel und Meldung: das Kuerzel gehoert nicht ins Log
        print(f"{name}: {len(old) - bad} entfernter Profile geloescht" + (f", {bad} nicht" if bad else ""))
        if bad: print(f"::warning::Teilen-Bilder: {bad} {name} entfernter Profile nicht geloescht - der naechste Lauf versucht es erneut")
    return n


def main(src):
    files = {f.relative_to(src).as_posix(): f for f in src.rglob("*") if f.is_file() and f.suffix.lower() in EXT
             and f.relative_to(src).as_posix().startswith(PREFIXES)} if src.exists() else {}
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
    prune(s3, bucket, files, have)
    if failed: return problem(f"{len(failed)} nicht hochgeladen (z. B. {failed[0][0]}); der naechste Lauf laedt nur den Rest")
    return 0


if __name__ == "__main__":
    sys.exit(main(Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "r2img"))
