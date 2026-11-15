#!/usr/bin/env python3
"""Zeichnet die Illustrationen der Service-Landingpages (site_landing.py) mit Pillow - abstrakte, geometrische Motive in den Farben der
Seite (#17191c, #3b6391, #82a7d4, #5d6470, #f3f3f2), Titel in Barlow Condensed (assets/fonts, woff2 liest FreeType direkt).
Keine Fotos, keine Personen, keine Logos oder Marken.

Je Seite (Ordner r2img/services/<IMG_VER>/<slug>/, Schluessel im Bucket = Pfad unter r2img/):
  hero-<v>-1600.webp, hero-<v>-800.webp   Hero der Unterseite, v = en | de (mit Kurztitel) | x (ohne Text, alle weiteren Sprachen)
  thumb-480.webp, thumb-960.webp          Vorschau fuer die Karten auf /services/ (ohne Text)
  og-<v>.png                              Teilen-Bild 1200x630 (PNG, weil nicht jede Plattform WebP fuer og:image liest)
tools/r2_og_upload.py laedt r2img/ im Bau-Job VOR dem Deploy in den Bucket (nur main, blockierend; Zugang nur ueber GitHub-Secrets),
ausgeliefert ueber https://img.m365.fm/services/... . Ausgabe ist deterministisch: unveraenderte Bilder werden nicht neu hochgeladen.
Aufruf: python generate_service_images.py [ausgabeordner]   (Standard: r2img, wie generate_og.py OG_OUT)"""
import math
import os
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

import site_landing as L

ROOT = Path(__file__).parent
FONTS = ROOT / "assets" / "fonts"
INK, INK2, AC, AC2, MUT, MID, LT = "#17191c", "#23272d", "#3b6391", "#82a7d4", "#5d6470", "#98a0ab", "#f3f3f2"
SS = 2   # Supersampling (Pillow zeichnet ohne Kantenglaettung)


def _rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def _mix(a, b, t):
    a, b = _rgb(a), _rgb(b)
    return tuple(round(x + (y - x) * t) for x, y in zip(a, b))


def _font(weight, px):
    f = FONTS / f"barlow-condensed-latin-{weight}-normal.woff2"
    try:
        return ImageFont.truetype(str(f), px)
    except OSError:
        return ImageFont.load_default(px)


# ---------------------------------------------------------------- Formen

def _arc(d, cx, cy, r, a0, a1, col, w):
    d.arc([cx - r, cy - r, cx + r, cy + r], a0, a1, fill=col, width=round(w))


def _ring(d, cx, cy, r, col, w):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=col, width=round(w))


def _disc(d, cx, cy, r, col):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)


def _rect(d, x0, y0, x1, y1, fill=None, outline=None, w=0, r=0):
    if r:
        d.rounded_rectangle([x0, y0, x1, y1], radius=round(r), fill=fill, outline=outline, width=round(w))
    else:
        d.rectangle([x0, y0, x1, y1], fill=fill, outline=outline, width=round(w))


def _arrowhead(d, x, y, ang, size, col):
    """Dreieck mit Spitze in (x, y), zeigt in Richtung ang (Bogenmass)."""
    a1, a2 = ang + math.pi * 0.82, ang - math.pi * 0.82
    d.polygon([(x, y), (x + size * math.cos(a1), y + size * math.sin(a1)), (x + size * math.cos(a2), y + size * math.sin(a2))], fill=col)


def _check(d, cx, cy, s, col, w):
    d.line([(cx - s * 0.45, cy), (cx - s * 0.1, cy + s * 0.35), (cx + s * 0.5, cy - s * 0.35)], fill=col, width=round(w), joint="curve")


def _magnifier(d, cx, cy, r, col, w):
    _ring(d, cx, cy, r, col, w)
    a = math.radians(45)
    d.line([(cx + r * math.cos(a), cy + r * math.sin(a)), (cx + r * 1.75 * math.cos(a), cy + r * 1.75 * math.sin(a))], fill=col, width=round(w * 1.6))


# ---------------------------------------------------------------- Motive (Mitte cx, cy, Radius R, Linienbreite w)

def m_hub(d, cx, cy, R, w):
    c, g = R * 0.5, R * 0.12
    fills = [AC, None, AC2, None, AC, None, MUT, AC2, AC]
    for i in range(9):
        x = cx + (i % 3 - 1) * (c + g) - c / 2
        y = cy + (i // 3 - 1) * (c + g) - c / 2
        if fills[i]:
            _rect(d, x, y, x + c, y + c, fill=fills[i])
        else:
            _rect(d, x, y, x + c, y + c, outline=LT, w=w)


def m_broadcast(d, cx, cy, R, w):
    mw, mh = R * 0.34, R * 0.6
    _rect(d, cx - mw / 2, cy - mh * 0.75, cx + mw / 2, cy + mh * 0.25, fill=AC2, r=mw / 2)
    for k in range(3):
        y = cy - mh * 0.45 + k * mh * 0.17
        d.line([(cx - mw * 0.3, y), (cx + mw * 0.3, y)], fill=INK, width=round(w * 0.6))
    _arc(d, cx, cy - mh * 0.12, mw * 0.85, 10, 170, LT, w)
    d.line([(cx, cy + mh * 0.48), (cx, cy + mh * 0.85)], fill=LT, width=round(w))
    d.line([(cx - mw * 0.7, cy + mh * 0.85), (cx + mw * 0.7, cy + mh * 0.85)], fill=LT, width=round(w))
    for i, (r, col) in enumerate(((R * 0.62, AC2), (R * 0.84, AC), (R * 1.06, MUT))):
        _arc(d, cx, cy - mh * 0.25, r, -38, 38, col, w * (1.2 - i * 0.15))
        _arc(d, cx, cy - mh * 0.25, r, 142, 218, col, w * (1.2 - i * 0.15))


def m_profile(d, cx, cy, R, w):
    cw, ch = R * 1.55, R * 1.0
    x0, y0 = cx - cw / 2, cy - ch / 2 - R * 0.12
    _rect(d, x0, y0, x0 + cw, y0 + ch, fill=INK2, outline=MUT, w=w * 0.6)
    _disc(d, x0 + ch * 0.38, y0 + ch * 0.4, ch * 0.2, AC)
    _rect(d, x0 + ch * 0.27, y0 + ch * 0.66, x0 + ch * 0.49, y0 + ch * 0.8, fill=AC, r=ch * 0.05)
    for k, (ln, col) in enumerate(((0.78, LT), (0.6, MID), (0.7, MID), (0.45, MUT))):
        y = y0 + ch * (0.24 + k * 0.17)
        _rect(d, x0 + ch * 0.72, y, x0 + ch * 0.72 + (cw - ch * 0.92) * ln, y + ch * 0.07, fill=col)
    bx, by, br = x0 + cw - R * 0.02, y0 + R * 0.02, R * 0.2
    _disc(d, bx, by, br, AC2)
    _check(d, bx, by, br, INK, w * 0.9)
    tags = (-0.55, 0.0, 0.55)
    for t in tags:
        tx, ty = cx + t * R * 1.05, cy + R * 0.82
        d.line([(tx, y0 + ch), (tx, ty - R * 0.1)], fill=MUT, width=round(w * 0.5))
        _rect(d, tx - R * 0.24, ty - R * 0.1, tx + R * 0.24, ty + R * 0.1, outline=AC2, w=w * 0.6, r=R * 0.1)


def m_mic(d, cx, cy, R, w):
    mw, mh = R * 0.46, R * 0.9
    x0, y0 = cx - mw / 2 - R * 0.35, cy - mh * 0.62
    _rect(d, x0, y0, x0 + mw, y0 + mh, fill=AC2, r=mw / 2)
    for k in range(4):
        y = y0 + mh * (0.22 + k * 0.14)
        d.line([(x0 + mw * 0.22, y), (x0 + mw * 0.78, y)], fill=INK, width=round(w * 0.6))
    mx = x0 + mw / 2
    _arc(d, mx, y0 + mh * 0.62, mw * 0.8, 0, 180, LT, w)
    d.line([(mx, y0 + mh * 0.62 + mw * 0.8), (mx, cy + R * 0.8)], fill=LT, width=round(w))
    d.line([(mx - mw * 0.75, cy + R * 0.8), (mx + mw * 0.75, cy + R * 0.8)], fill=LT, width=round(w))
    hs = (0.35, 0.7, 1.0, 0.55, 0.85, 0.4, 0.62)
    for i, h in enumerate(hs):
        bx = cx + R * 0.25 + i * R * 0.15
        col = AC if i % 2 else AC2
        _rect(d, bx, cy - R * 0.5 * h, bx + R * 0.08, cy + R * 0.5 * h, fill=col, r=R * 0.04)


def m_press(d, cx, cy, R, w):
    pw, ph = R * 0.95, R * 1.25
    for k, (dx, dy, fill) in enumerate(((-0.42, -0.1, INK2), (-0.12, 0.06, "#2b3036"))):
        x0, y0 = cx + dx * R - pw / 2, cy + dy * R - ph / 2
        _rect(d, x0, y0, x0 + pw, y0 + ph, fill=fill, outline=MUT if k == 0 else MID, w=w * 0.6)
        if k == 1:
            _rect(d, x0 + pw * 0.12, y0 + ph * 0.1, x0 + pw * 0.88, y0 + ph * 0.3, fill=AC)
            for j in range(5):
                y = y0 + ph * (0.4 + j * 0.1)
                _rect(d, x0 + pw * 0.12, y, x0 + pw * (0.88 if j % 3 else 0.6), y + ph * 0.035, fill=MID if j else LT)
    _disc(d, cx + R * 0.52, cy + R * 0.18, R * 0.3, _mix(INK, AC, 0.35))
    _magnifier(d, cx + R * 0.52, cy + R * 0.18, R * 0.3, LT, w * 1.1)


def m_calendar(d, cx, cy, R, w):
    cw, ch = R * 1.6, R * 1.3
    x0, y0 = cx - cw / 2, cy - ch / 2
    _rect(d, x0, y0, x0 + cw, y0 + ch, fill=INK2, outline=MUT, w=w * 0.6)
    _rect(d, x0, y0, x0 + cw, y0 + ch * 0.2, fill=AC)
    for k in (0.25, 0.75):
        _rect(d, x0 + cw * k - R * 0.04, y0 - R * 0.1, x0 + cw * k + R * 0.04, y0 + R * 0.08, fill=LT, r=R * 0.03)
    cols, rows = 6, 4
    gx, gy = cw * 0.84 / cols, ch * 0.66 / rows
    hi = {(1, 0): AC2, (3, 1): AC, (4, 1): AC, (2, 2): AC2, (5, 3): AC2}
    for r_ in range(rows):
        for c_ in range(cols):
            x = x0 + cw * 0.08 + c_ * gx
            y = y0 + ch * 0.28 + r_ * gy
            col = hi.get((c_, r_))
            if col:
                _rect(d, x + gx * 0.12, y + gy * 0.14, x + gx * 0.88, y + gy * 0.86, fill=col)
            else:
                _rect(d, x + gx * 0.12, y + gy * 0.14, x + gx * 0.88, y + gy * 0.86, outline=MUT, w=w * 0.4)


def m_headphones(d, cx, cy, R, w):
    _arc(d, cx, cy + R * 0.05, R * 0.82, 180, 360, LT, w * 1.6)
    for s in (-1, 1):
        x = cx + s * R * 0.82
        _rect(d, x - R * 0.16, cy - R * 0.05, x + R * 0.16, cy + R * 0.62, fill=AC2, r=R * 0.1)
        _rect(d, x - s * R * 0.2 - R * 0.05, cy + R * 0.05, x - s * R * 0.2 + R * 0.05, cy + R * 0.52, fill=AC, r=R * 0.03)
    _arc(d, cx, cy + R * 0.3, R * 0.3, 210, 500, AC2, w)
    a = math.radians(500 - 360)
    _arrowhead(d, cx + R * 0.3 * math.cos(a), cy + R * 0.3 + R * 0.3 * math.sin(a), a + math.pi / 2, R * 0.13, AC2)
    _disc(d, cx, cy + R * 0.3, R * 0.06, LT)


def m_target(d, cx, cy, R, w):
    for r, col, ww in ((R * 1.0, MUT, 0.8), (R * 0.74, AC, 1.4), (R * 0.48, AC2, 1.4)):
        _ring(d, cx, cy, r, col, w * ww)
    _disc(d, cx, cy, R * 0.2, LT)
    _disc(d, cx, cy, R * 0.08, AC)
    a = math.radians(-40)
    sx, sy = cx + R * 1.25 * math.cos(a), cy + R * 1.25 * math.sin(a)
    ex, ey = cx + R * 0.12 * math.cos(a), cy + R * 0.12 * math.sin(a)
    d.line([(sx, sy), (ex, ey)], fill=LT, width=round(w * 1.1))
    _arrowhead(d, ex, ey, a + math.pi, R * 0.16, LT)
    for k in (0, 1):
        px, py = sx - k * R * 0.1 * math.cos(a), sy - k * R * 0.1 * math.sin(a)
        for s in (-1, 1):
            b = a + s * math.radians(35)
            d.line([(px, py), (px + R * 0.16 * math.cos(b), py + R * 0.16 * math.sin(b))], fill=AC2, width=round(w * 0.8))


def m_chart(d, cx, cy, R, w):
    base = cy + R * 0.7
    hs = (0.35, 0.55, 0.72, 0.95, 1.25)
    bw = R * 0.26
    for i, h in enumerate(hs):
        x = cx - R * 0.95 + i * R * 0.42
        _rect(d, x, base - R * h, x + bw, base, fill=_mix(AC, AC2, i / 4))
    d.line([(cx - R * 1.1, base), (cx + R * 1.1, base)], fill=LT, width=round(w))
    tx = cx - R * 0.95 + 4 * R * 0.42 + bw / 2
    _disc(d, tx, base - R * 1.25 - R * 0.32, R * 0.22, LT)
    _check(d, tx, base - R * 1.25 - R * 0.32, R * 0.22, AC, w * 0.9)
    pts = [(cx - R * 0.95 + i * R * 0.42 + bw / 2, base - R * h - R * 0.12) for i, h in enumerate(hs[:4])]
    d.line(pts, fill=MID, width=round(w * 0.5))


def m_network(d, cx, cy, R, w):
    nodes = [(-0.9, -0.5), (-0.35, -0.95), (0.35, -0.6), (0.95, -0.15), (-0.75, 0.55), (0.0, 0.1), (0.6, 0.75), (-0.1, 0.95)]
    pts = [(cx + x * R, cy + y * R) for x, y in nodes]
    edges = [(0, 1), (1, 2), (2, 3), (0, 5), (1, 5), (2, 5), (3, 6), (5, 6), (4, 5), (4, 7), (5, 7), (6, 7), (0, 4)]
    for a, b in edges:
        d.line([pts[a], pts[b]], fill=MUT, width=round(w * 0.5))
    for i, (x, y) in enumerate(pts):
        if i == 2:
            continue
        _disc(d, x, y, R * 0.1, INK2)
        _ring(d, x, y, R * 0.1, AC2 if i % 2 else MID, w * 0.6)
    hx, hy = pts[2]
    _disc(d, hx, hy, R * 0.17, AC)
    _magnifier(d, hx, hy, R * 0.32, LT, w)


def m_growth(d, cx, cy, R, w):
    base = cy + R * 0.55
    n = 9
    for i in range(n):
        h = 0.18 + 0.9 * (i / (n - 1)) ** 1.3 + (0.08 if i % 2 else 0)
        x = cx - R * 1.05 + i * R * 0.24
        _rect(d, x, base - R * h, x + R * 0.13, base + R * h * 0.35, fill=_mix(MUT, AC2, i / (n - 1)), r=R * 0.06)
    sx, sy, ex, ey = cx - R * 0.9, cy - R * 0.2, cx + R * 0.95, cy - R * 1.0
    d.line([(sx, sy), (ex, ey)], fill=LT, width=round(w * 1.1))
    _arrowhead(d, ex, ey, math.atan2(ey - sy, ex - sx), R * 0.2, LT)


def m_agenda(d, cx, cy, R, w):
    lx = cx - R * 0.9
    d.line([(lx, cy - R * 1.0), (lx, cy + R * 1.0)], fill=LT, width=round(w))
    rows = ((-0.8, 1.2, AC), (-0.32, 0.8, AC2), (0.16, 1.45, INK2), (0.64, 1.0, AC))
    for y, ln, col in rows:
        yy = cy + y * R
        _disc(d, lx, yy, R * 0.08, AC2 if col != INK2 else LT)
        _rect(d, lx + R * 0.22, yy - R * 0.15, lx + R * 0.22 + R * ln, yy + R * 0.15, fill=col if col != INK2 else None,
              outline=MID if col == INK2 else None, w=w * 0.6)
        if col != INK2:
            _rect(d, lx + R * 0.32, yy - R * 0.03, lx + R * 0.32 + R * ln * 0.5, yy + R * 0.03, fill=INK)


def m_refresh(d, cx, cy, R, w):
    r = R * 0.85
    _arc(d, cx, cy, r, 200, 340, AC2, w * 1.4)
    _arc(d, cx, cy, r, 20, 160, AC, w * 1.4)
    for end, col in ((340, AC2), (160, AC)):
        a = math.radians(end)
        _arrowhead(d, cx + r * math.cos(a), cy + r * math.sin(a), a + math.pi / 2, R * 0.2, col)
    d.line([(cx - R * 0.5, cy), (cx + R * 0.5, cy)], fill=LT, width=round(w * 0.8))
    for k, x in enumerate((-0.5, -0.17, 0.17, 0.5)):
        _disc(d, cx + x * R, cy, R * (0.09 if k == 3 else 0.06), LT if k == 3 else MID)


def m_company(d, cx, cy, R, w):
    """Firmengebaeude mit Fensterraster, daneben ein Standort-Marker; unten Themen-Marken (Verzeichnis: Firmen und Standorte)."""
    bw, bh = R * 0.95, R * 1.25
    x0, y0 = cx - R * 0.78, cy - bh * 0.55
    _rect(d, x0, y0, x0 + bw, y0 + bh, fill=INK2, outline=MUT, w=w * 0.6)
    cols, rows = 3, 4
    gx, gy = bw / (cols * 2 + 1), bh * 0.7 / (rows * 2 + 1)
    for r in range(rows):
        for c in range(cols):
            wx, wy = x0 + gx * (1 + 2 * c), y0 + bh * 0.08 + gy * (1 + 2 * r)
            _rect(d, wx, wy, wx + gx, wy + gy, fill=AC2 if (r + c) % 3 == 0 else MID)
    _rect(d, x0 + bw * 0.38, y0 + bh * 0.8, x0 + bw * 0.62, y0 + bh, fill=AC)
    px, py, pr = cx + R * 0.62, cy - R * 0.28, R * 0.3
    d.polygon([(px - pr * 0.82, py + pr * 0.45), (px + pr * 0.82, py + pr * 0.45), (px, py + pr * 1.75)], fill=AC)
    _disc(d, px, py, pr, AC)
    _disc(d, px, py, pr * 0.42, INK)
    base = y0 + bh
    d.line([(x0 - R * 0.12, base), (cx + R * 1.0, base)], fill=LT, width=round(w))
    for t in (-0.45, 0.15, 0.75):
        tx, ty = cx + t * R, base + R * 0.3
        d.line([(tx, base), (tx, ty - R * 0.09)], fill=MUT, width=round(w * 0.5))
        _rect(d, tx - R * 0.2, ty - R * 0.09, tx + R * 0.2, ty + R * 0.09, outline=AC2, w=w * 0.6, r=R * 0.09)


def m_adslots(d, cx, cy, R, w):
    """Webseite mit drei Werbeplaetzen (oben, Mitte im Text, unten) und einem Zeiger (#281 Werbeplaetze)."""
    x0, y0, x1, y1 = cx - R * 1.05, cy - R * 0.95, cx + R * 1.05, cy + R * 0.95
    _rect(d, x0, y0, x1, y1, fill=INK2, outline=MUT, w=w * 0.6, r=R * 0.06)
    _rect(d, x0, y0, x1, y0 + R * 0.16, fill=MID)
    _rect(d, x0 + R * 0.12, y0 + R * 0.26, x1 - R * 0.12, y0 + R * 0.5, fill=AC)
    for i in range(3):
        yy = y0 + R * (0.66 + i * 0.16)
        _rect(d, x0 + R * 0.12, yy, cx + R * 0.05, yy + R * 0.06, fill=MUT)
    _rect(d, cx + R * 0.2, y0 + R * 0.62, x1 - R * 0.12, y0 + R * 1.18, fill=AC2)
    for i in range(2):
        yy = y0 + R * (1.24 + i * 0.14)
        _rect(d, x0 + R * 0.12, yy, x1 - R * 0.12, yy + R * 0.06, fill=MUT)
    _rect(d, x0 + R * 0.12, y1 - R * 0.36, x1 - R * 0.12, y1 - R * 0.14, fill=AC)
    px, py = cx + R * 0.55, cy + R * 0.25
    d.polygon([(px, py), (px + R * 0.12, py + R * 0.42), (px + R * 0.2, py + R * 0.26), (px + R * 0.36, py + R * 0.24)], fill=LT)


MOTIFS = {"adslots": m_adslots, "hub": m_hub, "broadcast": m_broadcast, "profile": m_profile, "mic": m_mic, "press": m_press, "calendar": m_calendar,
          "headphones": m_headphones, "target": m_target, "chart": m_chart, "network": m_network, "growth": m_growth,
          "agenda": m_agenda, "refresh": m_refresh, "company": m_company}


# ---------------------------------------------------------------- Komposition

def _wrap(d, text, font, maxw):
    words, lines, cur = text.split(), [], ""
    for wd in words:
        t = (cur + " " + wd).strip()
        if d.textlength(t, font=font) <= maxw or not cur:
            cur = t
        else:
            lines.append(cur); cur = wd
    if cur:
        lines.append(cur)
    return lines


def _spaced(d, x, y, text, font, col, spacing):
    for ch in text:
        d.text((x, y), ch, font=font, fill=col)
        x += d.textlength(ch, font=font) + spacing
    return x


def render(motif, title, W, H):
    """Ein Bild W x H. title=None: ohne Text (Motiv mittig)."""
    w2, h2 = W * SS, H * SS
    img = Image.new("RGB", (w2, h2), _rgb(INK))
    d = ImageDraw.Draw(img)
    step = round(h2 / 18)
    grid = _mix(INK, LT, 0.055)
    for x in range(0, w2, step):
        d.line([(x, 0), (x, h2)], fill=grid, width=SS)
    for y in range(0, h2, step):
        d.line([(0, y), (w2, y)], fill=grid, width=SS)
    pad = round(h2 * 0.075)
    plus = _font(500, round(h2 * 0.045))
    for px, py in ((pad, pad), (w2 - pad, pad), (pad, h2 - pad), (w2 - pad, h2 - pad)):
        d.text((px, py), "+", font=plus, fill=_mix(INK, LT, 0.35), anchor="mm")
    if title:
        R = min(w2 * 0.17, h2 * 0.27)
        cx, cy = w2 * 0.735, h2 * 0.5
    else:
        R = h2 * 0.27
        cx, cy = w2 * 0.5, h2 * 0.5
    if motif not in MOTIFS:   # ein fehlendes Motiv darf den Seitenbau nicht abbrechen (5.11.: "company" fehlte, kein Deploy)
        print(f"::warning::Motiv '{motif}' fehlt in generate_service_images.MOTIFS - Ersatz 'hub'")
        motif = "hub"
    MOTIFS[motif](d, cx, cy, R, max(2 * SS, R * 0.045))
    brand = _font(700, round(h2 * 0.045))
    bx, by = pad + round(h2 * 0.02), h2 - pad - round(h2 * 0.07)
    x = _spaced(d, bx, by, "M365", brand, _rgb(LT), round(h2 * 0.003))
    x = _spaced(d, x, by, ".", brand, _rgb(AC2), 0)
    _spaced(d, x, by, "FM", brand, _rgb(LT), round(h2 * 0.003))
    if title:
        kick = _font(600, round(h2 * 0.034))
        maxw = w2 * 0.47
        size = round(h2 * 0.15)
        while True:
            f = _font(700, size)
            lines = _wrap(d, title.upper(), f, maxw)
            if (len(lines) <= 2 and all(d.textlength(l, font=f) <= maxw for l in lines)) or size < h2 * 0.07:
                break
            size = round(size * 0.92)
        gap, bar = round(h2 * 0.05), max(SS * 3, round(h2 * 0.009))
        block = round(h2 * 0.034) + gap + len(lines) * round(size * 1.02) + round(h2 * 0.035) + bar
        y = round((h2 - block) / 2)
        _spaced(d, bx, y, "M365.FM · SERVICES", kick, _rgb(AC2), round(h2 * 0.008))
        y += round(h2 * 0.034) + gap - round(size * 0.08)
        for line in lines:
            d.text((bx, y), line, font=f, fill=_rgb(LT))
            y += round(size * 1.02)
        y += round(h2 * 0.035)
        _rect(d, bx, y, bx + w2 * 0.07, y + bar, fill=AC)
    return img.resize((W, H), Image.LANCZOS)


def _save(img, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.suffix == ".webp":
        img.save(path, "WEBP", quality=86, method=6)
    else:
        img.save(path, "PNG", optimize=True)


def main(out_root):
    out = out_root / "services" / L.IMG_VER
    n = 0
    for slug, motif, short in L.image_jobs():
        base = out / slug
        for v, title in (("en", short[0]), ("de", short[1]), ("x", None)):
            hero = render(motif, title, *L.HERO)
            _save(hero, base / f"hero-{v}-{L.HERO[0]}.webp")
            _save(hero.resize(L.HERO_S, Image.LANCZOS), base / f"hero-{v}-{L.HERO_S[0]}.webp")
            _save(render(motif, title, 1200, 630), base / f"og-{v}.png")
            n += 3
            if v == "x":
                _save(hero.resize(L.THUMB_2X, Image.LANCZOS), base / f"thumb-{L.THUMB_2X[0]}.webp")
                _save(hero.resize(L.THUMB, Image.LANCZOS), base / f"thumb-{L.THUMB[0]}.webp")
                n += 2
    print(n, "Service-Bilder unter", out)
    return 0


if __name__ == "__main__":
    sys.exit(main(ROOT / (sys.argv[1] if len(sys.argv) > 1 else os.environ.get("OG_OUT", "r2img"))))
