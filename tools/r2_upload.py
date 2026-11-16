#!/usr/bin/env python3
"""Fremde Bilder (Blog, Gaeste) in den R2-Bucket kopieren und eine Zuordnung schreiben.

Standard ist ein Testlauf (zaehlt nur). Mit --apply wird geladen/hochgeladen und
data/r2_map.json geschrieben (Original-URL -> https://img.m365.fm/<key>).
Beim Kopieren werden JPEG/PNG/WebP auf hoechstens MAX_SIDE x MAX_SIDE Pixel verkleinert; GIF, SVG, AVIF, PDF und
animierte Bilder bleiben unveraendert. JPEG/PNG werden als WebP gespeichert, wenn das kleiner ist.

--shrink verkleinert schon kopierte Bilder, die laut data/r2_dims.json breiter als MAX_SIDE sind: Laden ueber img.m365.fm,
Ablage unter einem NEUEN Schluessel mit Endung -w<MAX_SIDE> (alte Schluessel sind ein Jahr lang unveraenderlich gecacht),
alle Eintraege in data/r2_map.json zeigen danach auf die neue URL, data/r2_dims.json bekommt die neuen Masse.
Alte Objekte bleiben im Bucket (nichts wird geloescht). Ohne --apply nur Testlauf.
Zugang ueber R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.
"""
import gzip, hashlib, html, io, json, os, re, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
MAP = ROOT / "data" / "r2_map.json"
DIMS = ROOT / "data" / "r2_dims.json"
LOCAL = ROOT / "data" / "r2_local.json"   # {"<Repo-Pfad>": "<Schluessel im Bucket>"}: eigene Bilder aus dem Repo (z. B. design/listen/listen-banner.webp)
LOCAL_TYPES = {".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml", ".avif": "image/avif"}
PUBLIC = "https://img.m365.fm"
MAX_SIDE = 1600   # groesste gespeicherte Kantenlaenge: reicht fuer die Inhaltsbreite auf hochaufloesenden Bildschirmen
SHRINK_TYPES = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}
EXT = {"image/jpeg": ".jpg", "image/png": ".png", "image/gif": ".gif", "image/webp": ".webp", "image/svg+xml": ".svg", "image/avif": ".avif",
       "application/pdf": ".pdf"}   # PDFs: Podpage-Downloads (Archiv vor der Kuendigung)
HOSTS = ("statics.mylandingpages.co", "roundups-inarticle-public.s3", "m.media-amazon.com", "img.podpage.com",
         "blogifyai.s3", "rank-ai-generated-images.s3", "images.pexels.com", "s3.us-west-1.amazonaws.com/redwood-labs",
         "neuroncdn", "media.podpage.com", "redwood-labs.s3.amazonaws.com")   # Podpage-Speicher: Gastfotos, Cover, Downloads (T32)
URL_RX = re.compile(r'https?://[^\s"\'<>)\\]+')
# T32 Podpage-Abloesung: alles, was auf Podpage-Speicher liegt, vor der Kuendigung kopieren (auch nur archivierte Dateien)
PODPAGE_SOURCES = ["data/podpage/episodes.json.gz", "data/podpage/hosts.json", "data/podpage/sponsors.json", "data/podpage/podcast.json",
                   "data/podpage/downloadable_files.json", "data/podpage/pages.json"]


def urls():
    found = set()
    for b in json.load(gzip.open(ROOT / "data/podpage/blog_posts.json.gz")):
        found |= set(re.findall(r'https?://[^\s"\'<>)]+', b.get("html") or ""))
    for g in json.load(open(ROOT / "data/podpage/guests.json", encoding="utf-8")):
        found.add(g.get("image_path") or "")
    for rel in PODPAGE_SOURCES + sorted(str(x.relative_to(ROOT)) for x in (ROOT / "data/podpage_i18n").glob("notes_*.json")):
        f = ROOT / rel
        if f.exists():
            found |= set(URL_RX.findall(gzip.open(f, "rt", encoding="utf-8").read() if f.suffix == ".gz" else f.read_text("utf-8")))
    found = {u.rstrip(".,;") for u in found}
    return sorted({u for u in found if u.startswith("http") and any(h in u for h in HOSTS)
                   and (re.search(r"\.(jpe?g|jfif|png|gif|webp|svg|avif|pdf)(\?|$)", u, re.I) or "redwood-labs" in u or "neuroncdn" in u)} | entity_logos())


def entity_logos():
    """Logos von Entitaeten (Feld logo_src in data/entities.json, z. B. Firmenlogo von der Firmenwebsite): von der Redaktion
    eingetragen, daher ohne Host-Liste; die Seite zeigt sie erst nach dem Kopieren ueber img.m365.fm (site_entities.py)."""
    f = ROOT / "data" / "entities.json"
    ents = json.loads(f.read_text("utf-8")) if f.exists() else []
    return {str(e["logo_src"]).strip() for e in ents if isinstance(e, dict) and str(e.get("logo_src") or "").startswith("https://")}


def local_files():
    """Lokale Dateien aus data/r2_local.json -> [(Repo-Pfad, Schluessel)]; nur Bildtypen, nur Dateien im Repo, Schluessel ohne '..' oder fuehrenden Schraegstrich."""
    cfg = json.loads(LOCAL.read_text("utf-8")) if LOCAL.exists() else {}
    out = []
    for rel, key in sorted(cfg.items()):
        f = (ROOT / rel).resolve()
        ok = (str(f).startswith(str(ROOT)) and f.is_file() and f.suffix.lower() in LOCAL_TYPES and key and not key.startswith("/") and ".." not in key.split("/"))
        if ok:
            out.append((rel, key))
        else:
            print(f"  UEBERSPRUNGEN (lokal): {rel} -> {key}")
    return out


def upload_local(s3, bucket, done, dims):
    """Lokale Dateien hochladen (Typ bleibt, WebP bleibt WebP), Zuordnung done[Repo-Pfad] = R2-URL und Masse eintragen. Cache ein Jahr: ein geaendertes Bild bekommt einen neuen Schluessel."""
    n = 0
    for rel, key in local_files():
        data = (ROOT / rel).read_bytes()
        s3.put_object(Bucket=bucket, Key=key, Body=data, ContentType=LOCAL_TYPES[Path(rel).suffix.lower()], CacheControl="public, max-age=31536000")
        done[rel] = f"{PUBLIC}/{key}"
        size = image_dimensions(data)
        if size:
            dims[done[rel]] = size
        n += 1
    return n


def image_dimensions(data):
    try:
        with Image.open(io.BytesIO(data)) as im:
            width, height = im.size
        return [int(width), int(height)] if width > 0 and height > 0 else None
    except Exception:
        return None


def fetch_url(u):
    """URL zum Laden. Schluessel in data/r2_map.json stehen so, wie sie im HTML vorkommen (site_r2.rewrite ersetzt Rohtext),
    also teils HTML-maskiert ('&amp;'); geladen wird die echte URL."""
    return html.unescape(u)


def _encode(im, fmt):
    buf = io.BytesIO()
    if fmt == "WEBP":
        im.save(buf, "WEBP", quality=82, method=6)
    elif fmt == "JPEG":
        im.save(buf, "JPEG", quality=85, optimize=True, progressive=True)
    else:
        im.save(buf, "PNG", optimize=True)
    return buf.getvalue()


def optimize(data, ct):
    """JPEG/PNG/WebP auf hoechstens MAX_SIDE x MAX_SIDE verkleinern (Seitenverhaeltnis bleibt) und JPEG/PNG als WebP speichern,
    wenn das kleiner ist. GIF, SVG, AVIF, PDF und animierte Bilder bleiben unveraendert. Gibt (Bytes, Inhaltstyp) zurueck."""
    if ct not in ("image/jpeg", "image/png", "image/webp"):
        return data, ct
    try:
        im = Image.open(io.BytesIO(data))
        if getattr(im, "is_animated", False):
            return data, ct
        big = im.width > MAX_SIDE or im.height > MAX_SIDE
        if ct == "image/webp" and not big:
            return data, ct   # WebP in passender Groesse: unveraendert
        im = ImageOps.exif_transpose(im)   # Drehung aus EXIF anwenden: das WebP uebernimmt die EXIF-Angabe nicht
        if big:
            im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
        im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P", "PA") else "RGB")
        webp = _encode(im, "WEBP")
        if ct == "image/webp":
            return webp, ct
        # Vergleich: WebP nur, wenn kleiner als das Original bzw. (bei verkleinerten Bildern) als das verkleinerte Bild im Originalformat
        other = (_encode(im, "PNG") if ct == "image/png" else _encode(im.convert("RGB"), "JPEG")) if big else data
        return (webp, "image/webp") if len(webp) < len(other) else (other, ct)
    except Exception:
        return data, ct


def http_get(u, ua="Mozilla/5.0 (m365.fm image copy)"):
    """-> (Bytes, Inhaltstyp); hoechstens 15 MB + 1 Byte, damit zu grosse Dateien auffallen."""
    req = urllib.request.Request(u, headers={"User-Agent": ua})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read(15_000_001), r.headers.get_content_type()


def copy_one(s3, bucket, u, done, dims, get=None):
    """Ein fremdes Bild laden (echte URL, ohne HTML-Maskierung), verkleinern/umwandeln, unter i/<sha1(Schluessel)> ablegen
    und done[u] (Schluessel wie gespeichert) sowie die Masse eintragen."""
    data, ct = (get or http_get)(fetch_url(u))
    if ct not in EXT or len(data) < 100 or len(data) > 15_000_000:
        raise ValueError(f"kein Bild ({ct}, {len(data)} Byte)")
    data, ct = optimize(data, ct)
    size = image_dimensions(data)
    key = "i/" + hashlib.sha1(u.encode()).hexdigest()[:20] + EXT[ct]
    s3.put_object(Bucket=bucket, Key=key, Body=data, ContentType=ct, CacheControl="public, max-age=31536000, immutable")
    done[u] = f"{PUBLIC}/{key}"
    if size:
        dims[done[u]] = size


def shrink_candidates(mapping, dims):
    """R2-URLs, die laut dims breiter als MAX_SIDE sind und von fremden Bildern (Schluessel http...) genutzt werden.
    Lokale Repo-Dateien bleiben aussen vor: upload_local setzt ihren Schluessel bei jedem --apply neu."""
    used, local = set(), set()
    for k, v in mapping.items():
        if isinstance(v, str) and v.startswith(PUBLIC + "/"):
            (used if k.startswith("http") else local).add(v)
    out = []
    for v in sorted(used - local):
        size = dims.get(v)
        p = Path(v)
        if size and size[0] > MAX_SIDE and p.suffix.lower() in SHRINK_TYPES and not p.stem.endswith(f"-w{MAX_SIDE}"):
            out.append(v)
    return out


def shrunk_key(url, ct):
    """https://img.m365.fm/i/abc.webp -> i/abc-w1600.webp (neuer Schluessel; der alte bleibt unveraendert im Bucket)."""
    key = url[len(PUBLIC) + 1:]
    head, _, name = key.rpartition("/")
    stem = name.rsplit(".", 1)[0] if "." in name else name
    return (head + "/" if head else "") + f"{stem}-w{MAX_SIDE}{EXT[ct]}"


def shrink_one(s3, bucket, url, get=None):
    """Vorhandenes R2-Bild laden, verkleinern und unter neuem Schluessel ablegen -> (neue URL, [Breite, Hoehe])."""
    data, ct = (get or http_get)(url)
    if ct not in SHRINK_TYPES.values():
        ct = SHRINK_TYPES[Path(url).suffix.lower()]   # Typ aus der Endung, falls der Server keinen Bildtyp meldet
    if len(data) < 100 or len(data) > 15_000_000:
        raise ValueError(f"unerwartete Groesse ({len(data)} Byte)")
    new, nct = optimize(data, ct)
    size = image_dimensions(new)
    if not size or max(size) > MAX_SIDE:
        raise ValueError(f"nicht verkleinert ({size})")
    key = shrunk_key(url, nct)
    s3.put_object(Bucket=bucket, Key=key, Body=new, ContentType=nct, CacheControl="public, max-age=31536000, immutable")
    return f"{PUBLIC}/{key}", size


def repoint(mapping, moved):
    """Alle Eintraege, die auf eine verschobene URL zeigen, auf die neue URL umstellen -> Zahl der umgestellten Eintraege."""
    n = 0
    for k, v in mapping.items():
        if v in moved:
            mapping[k] = moved[v]
            n += 1
    return n


def shrink(s3, bucket, done, dims, get=None, workers=8):
    """Zu breite R2-Bilder verkleinern, Zuordnung umstellen, neue Masse eintragen. Die alten Masse bleiben stehen,
    weil das alte Objekt weiter existiert. -> (alt->neu, Zahl umgestellter Eintraege, Fehlerliste)."""
    moved, failed = {}, []

    def one(u):
        try:
            new, size = shrink_one(s3, bucket, u, get)
            dims[new] = size
            moved[u] = new
        except Exception as e:
            failed.append((u, str(e)[:80]))

    with ThreadPoolExecutor(workers) as ex:
        list(ex.map(one, shrink_candidates(done, dims)))
    return moved, repoint(done, moved), failed


def load_data():
    done = json.load(open(MAP, encoding="utf-8")) if MAP.exists() else {}
    dims = json.load(open(DIMS, encoding="utf-8")) if DIMS.exists() else {}
    return done, dims


def write_data(done, dims):
    MAP.write_text(json.dumps(dict(sorted(done.items())), indent=0, ensure_ascii=False), encoding="utf-8")
    DIMS.write_text(json.dumps(dict(sorted(dims.items())), separators=(",", ":"), ensure_ascii=False), encoding="utf-8")


def s3_client():
    import boto3
    return boto3.client("s3", endpoint_url=f"https://{os.environ['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com",
                        aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"], aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"], region_name="auto")


def main_shrink(apply):
    done, dims = load_data()
    todo = shrink_candidates(done, dims)
    print(f"{len(todo)} R2-Bilder breiter als {MAX_SIDE} px (laut data/r2_dims.json)")
    if not apply:
        for u in sorted(todo, key=lambda x: -dims[x][0])[:15]:
            print("  ", dims[u], u)
        print("Testlauf, nichts hochgeladen. Mit --shrink --apply ausfuehren.")
        return
    moved, n, failed = shrink(s3_client(), os.environ["R2_BUCKET"], done, dims)
    write_data(done, dims)
    print(f"{len(moved)} verkleinert, {n} Zuordnungen umgestellt, {len(failed)} fehlgeschlagen (bleiben bei der alten URL)")
    for u, e in failed[:20]:
        print("  FEHLER", u[:90], e)


def fill_dimensions(mapping, dims):
    missing = [u for u in mapping.values() if u.startswith(PUBLIC + "/") and u not in dims]
    original_count = len(dims)
    failed = []

    def one(u):
        try:
            req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0 (m365.fm image dimensions)"})
            with urllib.request.urlopen(req, timeout=40) as r:
                data = r.read(15_000_001)
            if len(data) > 15_000_000:
                raise ValueError("Bild zu gross")
            size = image_dimensions(data)
            if size:
                dims[u] = size
            else:
                raise ValueError("Masse nicht lesbar")
        except Exception as e:
            failed.append((u, str(e)[:80]))

    with ThreadPoolExecutor(8) as ex:
        list(ex.map(one, missing))
    DIMS.write_text(json.dumps(dict(sorted(dims.items())), separators=(",", ":"), ensure_ascii=False), encoding="utf-8")
    print(f"{len(dims) - original_count} Masse ergaenzt, {len(failed)} fehlgeschlagen")
    for u, e in failed[:20]:
        print("  FEHLER", u[:90], e)


def main():
    apply = "--apply" in sys.argv
    if "--fill-dims" in sys.argv:
        done = json.load(open(MAP, encoding="utf-8")) if MAP.exists() else {}
        dims = json.load(open(DIMS, encoding="utf-8")) if DIMS.exists() else {}
        fill_dimensions(done, dims)
        return
    if "--shrink" in sys.argv:
        main_shrink(apply)
        return
    todo = urls()
    done, dims = load_data()
    todo = [u for u in todo if u not in done]
    print(f"{len(todo)} Bilder offen, {len(done)} schon in R2, {len(local_files())} lokale Dateien (data/r2_local.json)")
    if not apply:
        for u in todo[:10]:
            print("  ", u[:110])
        print("Testlauf, nichts hochgeladen. Mit --apply ausfuehren.")
        return
    s3 = s3_client()
    bucket = os.environ["R2_BUCKET"]
    failed = []
    print(f"{upload_local(s3, bucket, done, dims)} lokale Dateien hochgeladen")

    def one(u):
        try:
            copy_one(s3, bucket, u, done, dims)
        except Exception as e:
            failed.append((u, str(e)[:80]))

    with ThreadPoolExecutor(8) as ex:
        list(ex.map(one, todo))
    write_data(done, dims)
    print(f"{len(todo) - len(failed)} hochgeladen, {len(failed)} fehlgeschlagen (bleiben beim Original)")
    for u, e in failed[:20]:
        print("  FEHLER", u[:90], e)


if __name__ == "__main__":
    main()
