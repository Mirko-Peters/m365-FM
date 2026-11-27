"""Stylesheet und Skripte mit Inhalts-Hash im Namen (Ladezeit 27.11.2026): <name>.<sha1[:10]>.<endung> unter /assets/.

Warum: der Site-Worker liefert nur Namen, die auf HASHED passen (sitewrk/index.js, gleiche Regel wie HASHED_RX hier), mit
"public, max-age=31536000, immutable" aus - alles andere unter /assets/ nur 1 h. Ohne Hash im Namen holte jeder Wiederholungsbesuch nach
einer Stunde page.js, a11y.js, entity.js, wk-<sprache>.js usw. neu (40-71 KiB je Seite). Mit Hash darf der Browser sie ein Jahr behalten,
weil sich der Name mit jeder Inhaltsaenderung aendert (Hash der geschriebenen Bytes, nicht der Eingabedaten).

Wohin: in jedes Zielverzeichnis aus setup() - beim Bau docs/ UND r2out/. r2out/ geht im Build-Job vor dem GitHub-Pages-Deploy in den Bucket
(tools/r2_pages_upload.py); Seiten aus r2out/ verweisen damit nie auf ein Skript, das erst mit dem Deploy existiert. Der Site-Worker liest
gehashte Dateien nach einem 404 von GitHub Pages aus R2 (pages/assets/<name>).

Alte Namen: die ungehashte Datei bleibt (shutil.copytree von assets/ in generate_site.py), fuer alte Seiten und Drittverweise. Fruehere
gehashte Namen verschwinden zwar aus docs/, bleiben aber im Bucket und werden vom R2-Spiegel nie als entfernt markiert
(tools/r2_site_sync.py, r2_common.HASHED_KEY): eine im Browser oder Cache liegende alte Seite bekommt ihr Skript weiter (unveraenderlich).
"""
import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "assets"
# = HASHED in sitewrk/index.js (Pfad der Adresse). Ungehashte Namen duerfen nie darauf passen (sonst waeren sie ein Jahr unveraenderlich).
HASHED_RX = re.compile(r"^/assets/[a-z0-9][a-z0-9_-]*\.[0-9a-f]{8,}\.(?:css|js)$", re.I)
NAME_RX = re.compile(r"^[a-z0-9][a-z0-9_-]*\.(?:css|js)$")   # zulaessige Ausgangsnamen (eine Ebene, keine Punkte im Stamm)
HLEN = 10

_DIRS = []    # Zielverzeichnisse (je mit Unterordner assets/)
_DONE = {}    # Ausgangsname -> Pfad /assets/<gehashter Name>


def setup(dirs):
    """Zielverzeichnisse setzen (z. B. [docs, r2out]) und den Merker leeren. Ohne setup() wird nichts geschrieben, path() liefert den ungehashten Namen."""
    _DIRS[:] = [Path(d) for d in dirs]
    _DONE.clear()


def hashed_name(name, data):
    """page.js + Bytes -> page.<sha1[:10]>.js"""
    if not NAME_RX.match(name): raise ValueError(f"Asset-Name nicht erlaubt: {name}")
    stem, ext = name.rsplit(".", 1)
    return f"{stem}.{hashlib.sha1(data).hexdigest()[:HLEN]}.{ext}"


def put(name, data=None):
    """Datei unter gehashtem Namen in alle Zielverzeichnisse schreiben, Pfad /assets/<gehashter Name> zurueck. data: str/bytes (erzeugter Inhalt)
    oder None (Datei assets/<name> aus dem Repo). Ein zweiter Aufruf mit anderem Inhalt fuer denselben Namen ersetzt den Eintrag (neuer Hash)."""
    if data is None: data = (SRC / name).read_bytes()
    elif isinstance(data, str): data = data.encode("utf-8")
    p = "/assets/" + hashed_name(name, data)
    if _DONE.get(name) == p: return p
    for d in _DIRS:
        f = d / "assets" / p.rsplit("/", 1)[1]
        f.parent.mkdir(parents=True, exist_ok=True)
        if not f.exists() or f.read_bytes() != data: f.write_bytes(data)
    _DONE[name] = p
    return p


def path(name):
    """Pfad fuer <script src>/<link href>: gehasht, wenn Zielverzeichnisse gesetzt sind (Datei wird beim ersten Aufruf geschrieben); sonst /assets/<name>.
    Erzeugte Dateien (wk-<sprache>.js) muessen vorher mit put(name, inhalt) angelegt sein, sonst ungehashter Name."""
    if name in _DONE: return _DONE[name]
    if not _DIRS or not (SRC / name).is_file(): return "/assets/" + name
    return put(name)


def written():
    """Ausgangsname -> gehashter Pfad aller in diesem Bau geschriebenen Dateien (fuer Tests und das Bauprotokoll)."""
    return dict(_DONE)
