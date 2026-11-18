"""Kostenlose Bilder und eine Checkliste fuer Entitaetsseiten, zur Bauzeit erzeugt (kein KI-Dienst, keine Bilddateien):
- hero_svg: Titelbild (Name, Typ, Farbe nach Typ)
- relation_svg: Beziehungskarte (reine Grafik; die Links stehen in den Beziehungslisten der Seite)
- timeline_svg: Folgen-Zeitleiste (reine Grafik; Links in der Folgenliste), wenn mindestens zwei Folgen mit Datum vorhanden sind
Alle Inhalte stammen aus vorhandenen Daten, es wird nichts dazuerfunden."""
import hashlib
from html import escape as esc

HUE = {"product": 210, "platform": 265, "concept": 150, "org": 30, "person": 330, "cert": 45, "event": 0, "media": 185, "category": 100, "industry": 20, "job": 290}
ICON = {"product": "◆", "platform": "▣", "concept": "✦", "org": "▲", "person": "●", "cert": "★", "event": "◉", "media": "▶", "category": "■", "industry": "⚙", "job": "☻"}


def _clip(s, n):
    s = (s or "").strip()
    return s if len(s) <= n else s[: n - 1].rstrip() + "…"


def _lines(s, n=26, k=2):
    words, out, cur = (s or "").split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 > n and cur:
            out.append(cur); cur = w
        else:
            cur = (cur + " " + w).strip()
    out.append(cur)
    out = [x for x in out if x][:k]
    if len(" ".join(words)) > sum(len(x) for x in out) + len(out):
        out[-1] = _clip(out[-1], n - 1) + "…"
    return out


def hero_svg(e, type_label, alt):
    h = HUE.get(e["type"], 210); h2 = (h + 40 + int(hashlib.md5(e["id"].encode()).hexdigest()[:2], 16) % 40) % 360
    ls = _lines(e["name"], 24, 2)
    txt = "".join(f'<text x="64" y="{150 + i * 64}" font-size="54" font-weight="700" fill="#fff">{esc(l)}</text>' for i, l in enumerate(ls))
    return (f'<figure class="en-fig"><svg role="img" aria-label="{esc(alt)}" viewBox="0 0 1200 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">'
            f'<defs><linearGradient id="g{e["id"][:8]}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl({h},55%,32%)"/><stop offset="1" stop-color="hsl({h2},60%,18%)"/></linearGradient></defs>'
            f'<rect width="1200" height="320" fill="url(#g{e["id"][:8]})"/><circle cx="1040" cy="150" r="120" fill="#fff" fill-opacity=".08"/><circle cx="1110" cy="250" r="70" fill="#fff" fill-opacity=".06"/>'
            f'<text x="64" y="76" font-size="26" fill="#fff" fill-opacity=".85" letter-spacing="3">{ICON.get(e["type"], "◆")} {esc(type_label.upper())}</text>{txt}'
            f'<text x="64" y="296" font-size="22" fill="#fff" fill-opacity=".7">M365.FM</text></svg><figcaption class="mut">{esc(alt)}</figcaption></figure>')


def _wrap(s, n):
    """Ganzer Text in Zeilen zu hoechstens n Zeichen, ohne Kuerzung; ein einzelnes Wort ueber n Zeichen wird hart geteilt."""
    out, cur = [], ""
    for w in (s or "").split():
        while len(w) > n:
            if cur: out.append(cur); cur = ""
            out.append(w[:n]); w = w[n:]
        if cur and len(cur) + 1 + len(w) > n:
            out.append(cur); cur = w
        else:
            cur = (cur + " " + w).strip()
    if cur: out.append(cur)
    return out or [""]


def _node_text(x, y, name, n, fs, lab="", weight="", fill="CanvasText"):
    """Name (voll, umbrochen) und darunter die Beziehung als eigene Zeile; -> (svg, halbe Hoehe des Textblocks)."""
    ls = _wrap(name, n); lh = fs + 3; lab_h = 16 if lab else 0
    top = y - (len(ls) * lh + lab_h) / 2 + fs * .8
    t = "".join(f'<text x="{x:.0f}" y="{top + i * lh:.0f}" text-anchor="middle" font-size="{fs}"{weight} fill="{fill}">{esc(l)}</text>' for i, l in enumerate(ls))
    if lab:
        t += f'<text x="{x:.0f}" y="{top + len(ls) * lh + 2:.0f}" text-anchor="middle" font-size="11" fill="{fill}" fill-opacity=".65">{esc(lab)}</text>'
    return t, (len(ls) * lh + lab_h) / 2


def relation_svg(e, items, alt):
    """items: [(label, url, name)] bis 8 Stueck rund um die Entitaet. Reine Grafik (Audit Linktexte, Gegenpruefung E6/A11Y-2):
    dieselben Ziele stehen mit vollem Namen unter ihrer Beziehung in den Beziehungslisten der Seite (rb/relx aus denselben groups).
    Deshalb keine Links im Bild - vorher ergaben Name + Beziehung verdrehte, gekuerzte Linknamen ("Microsoft Developed by") und
    Tab-Stopps ohne zugaenglichen Namen in role=img. Das Bild ist aria-hidden, die figcaption beschreibt es; Namen werden voll umbrochen."""
    items = items[:8]
    if len(items) < 2:
        return ""
    import math
    h = HUE.get(e["type"], 210); cx, cy, R = 600, 220, 150
    parts = [f'<svg aria-hidden="true" focusable="false" viewBox="0 0 1200 440" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">']
    pos = []
    for i, it in enumerate(items):
        a = -math.pi / 2 + 2 * math.pi * i / len(items)
        pos.append((cx + 380 * math.cos(a), cy + R * 1.05 * math.sin(a)))
    for x, y in pos:
        parts.append(f'<line x1="{cx}" y1="{cy}" x2="{x:.0f}" y2="{y:.0f}" stroke="currentColor" stroke-opacity=".3" stroke-width="2"/>')
    ct, chh = _node_text(cx, cy, e["name"], 20, 18, weight=' font-weight="700"', fill="#fff")
    parts.append(f'<ellipse cx="{cx}" cy="{cy}" rx="125" ry="{max(46, chh + 12):.0f}" fill="hsl({h},55%,32%)"/>{ct}')
    for (x, y), (lab, url, name) in zip(pos, items):
        long_ = len(_wrap(name, 22)) > 3
        t, hh = _node_text(x, y, name, 26 if long_ else 22, 13 if long_ else 15, lab=lab)
        parts.append(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="112" ry="{max(36, hh + 10):.0f}" fill="Canvas" stroke="hsl({h},55%,45%)" stroke-width="2"/>{t}')
    parts.append("</svg>")
    return f'<figure class="en-fig">{"".join(parts)}<figcaption class="mut">{esc(alt)}</figcaption></figure>'


def _day(d):
    """'YYYY-MM-DD' (oder 'YYYY-MM') -> Jahre als Kommazahl, tagesgenau."""
    y, m = int(d[:4]), int(d[5:7])
    dd = int(d[8:10]) if len(d) >= 10 and d[8:10].isdigit() else 1
    return y + (m - 1) / 12 + (dd - 1) / 365


def timeline_svg(eps, alt):
    """eps: [(datum 'YYYY-MM-DD', titel, url)] -> Zeitleiste. Reine Grafik ohne Links (Gegenpruefung A11Y-2): jede Folge steht mit Titel
    und Link in der Liste "Folgen zu ..." direkt davor. Position tagesgenau; Folgen naeher als ein Kreis (22 Einheiten) werden zu einem
    Punkt mit Anzahl zusammengefasst, statt sich zu verdecken. aria-hidden, die figcaption beschreibt das Bild."""
    pts = sorted((d, t, u) for d, t, u in eps if d and len(d) >= 7)
    if len(pts) < 2:
        return ""
    y0, y1 = _day(pts[0][0]), _day(pts[-1][0])
    span = max(y1 - y0, 0.08)
    cl = []   # [x, anzahl]
    for d, t, u in pts:
        x = 40 + 1120 * (_day(d) - y0) / span
        if cl and x - cl[-1][0] < 28:   # Kreis r=11, Sammelpunkt r=14: so beruehren sich zwei Punkte nicht
            cl[-1][1] += 1
        else:
            cl.append([x, 1])
    out = [f'<svg aria-hidden="true" focusable="false" viewBox="0 0 1200 150" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif"><line x1="40" y1="75" x2="1160" y2="75" stroke="currentColor" stroke-opacity=".35" stroke-width="3"/>']
    for x, n in cl:
        out.append(f'<circle cx="{x:.0f}" cy="75" r="{11 if n == 1 else 14}" fill="hsl(210,60%,45%)"/>' + (f'<text x="{x:.0f}" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">{n}</text>' if n > 1 else ""))
    out.append(f'<text x="40" y="125" font-size="16" fill="CanvasText">{esc(pts[0][0][:7])}</text><text x="1160" y="125" font-size="16" text-anchor="end" fill="CanvasText">{esc(pts[-1][0][:7])}</text></svg>')
    return f'<figure class="en-fig">{"".join(out)}<figcaption class="mut">{esc(alt)}</figcaption></figure>'


CSS = ".en-fig{margin:1.2em 0}.en-fig svg{width:100%;height:auto;display:block;border-radius:.5em}.en-fig figcaption{font-size:.85em;margin-top:.3em}"
