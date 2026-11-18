#!/usr/bin/env python3
"""Verkleinerte Fassungen des Seitenleisten-Bilds "I'm attending M365Con" (site_sidebar.py, Karte sb-con) erzeugen.

Quelle ist assets/attending-m365con.webp (675x563, ~68 KB; bleibt fuer das Popup in assets/attend.js und als Rueckfall).
Ausgabe nach design/sidebar/: je Breite (site_sidebar.CON_WIDTHS) eine WebP-Datei und eine AVIF-Datei, die AVIF-Datei aber nur,
wenn sie kleiner ist als die WebP-Datei derselben Breite (sonst wird eine alte AVIF-Datei entfernt).
Hochgeladen werden sie vom Workflow r2-images.yml (apply=true) ueber data/r2_local.json nach img.m365.fm/sidebar/...;
bis dahin baut site_sidebar.py die Karte mit dem bisherigen Bild.

Aufruf: python3 tools/sidebar_con_img.py   (Pillow mit AVIF, ab Pillow 11.3 eingebaut)
Ein geaendertes Bild braucht neue Dateinamen (die R2-Objekte werden ein Jahr unveraenderlich gecacht)."""
import io
import sys
from pathlib import Path

from PIL import Image, features

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_sidebar as SBR  # noqa: E402

SRC = ROOT / "assets" / "attending-m365con.webp"
WEBP_Q, AVIF_Q = 80, 60   # Sichtvergleich der Kleinschrift (2x vergroessert) ohne erkennbaren Unterschied zur Quelle


def encode(im, fmt):
    b = io.BytesIO()
    if fmt == "webp":
        im.save(b, "WEBP", quality=WEBP_Q, method=6)
    else:
        im.save(b, "AVIF", quality=AVIF_Q, speed=2)
    return b.getvalue()


def build(src=SRC, out_root=ROOT, avif=None):
    """Schreibt die Dateien und gibt [(Repo-Pfad, Bytes)] zurueck."""
    avif = features.check("avif") if avif is None else avif
    im = Image.open(src).convert("RGB")
    w0, h0 = im.size
    done = []
    for w in SBR.CON_WIDTHS:
        r = im if w == w0 else im.resize((w, round(h0 * w / w0)), Image.LANCZOS)
        webp = encode(r, "webp")
        p = out_root / SBR.con_file(w, "webp")
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(webp)
        done.append((SBR.con_file(w, "webp"), len(webp)))
        a = out_root / SBR.con_file(w, "avif")
        data = encode(r, "avif") if avif else b""
        if data and len(data) < len(webp):
            a.write_bytes(data)
            done.append((SBR.con_file(w, "avif"), len(data)))
        elif a.exists():
            a.unlink()
    return done


if __name__ == "__main__":
    if not features.check("avif"):
        print("Hinweis: Pillow ohne AVIF, es entstehen nur WebP-Dateien")
    print(f"Quelle {SRC.relative_to(ROOT)}: {SRC.stat().st_size} Bytes")
    for rel, n in build():
        print(f"  {rel}: {n} Bytes")
