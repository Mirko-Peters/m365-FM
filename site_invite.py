"""Persoenliche Einladungsseiten /einladung/<handle>/ fuer oeffentliche Profile (Open Graph + Twitter Card, noindex, canonical /community/).
Crawler (LinkedIn, Facebook, X, WhatsApp, Teams) lesen die Vorschau aus dem statischen HTML; Browser fuehren das Inline-Skript aus: Ref (handle) im
localStorage merken (30 Tage, wie assets/invite-share.js) und weiter zu /community/. Teilen-Bild: Playwright-Karte (generate_og.py) -> R2 (img.m365.fm/og/einladung/<handle>.png).
Seite und Karte gibt es nur, solange das Profil oeffentlich ist (Profil-Export des Seitenbaus): nach Kontoloeschung oder "privat" entfaellt die Seite
mit dem naechsten Bau, tools/r2_og_upload.py loescht dabei die Karte aus dem Bucket, und der Site-Worker leitet die Adresse auf /community/?ref=<handle>.
<title> und meta description halten die Regeln von check_titles.py ein (blockierend im Seitenbau): Marke genau einmal, Titel <= 85, Beschreibung <= 165 Zeichen."""
import html, json, re

HANDLE = re.compile(r"^[a-z0-9][a-z0-9-]{1,38}$")
BRAND = re.compile(r"M365[ .]?FM", re.I)   # wie check_titles.py
REF_DAYS = 30   # wie assets/invite-share.js (DAYS) und die Datenschutzerklaerung
TITLE_MAX, DESC_MAX = 85, 160   # check_titles.py: Fehler ueber 85 bzw. 165 Zeichen (160 wie meta_desc in generate_site.py)
T = {
    "de": dict(title="{n} lädt dich zu M365.FM ein", title_nb="{n} lädt dich in die Community ein", title_gen="Einladung zu M365.FM",
               desc="{n} lädt dich zu M365.FM ein, der Community rund um Microsoft 365. Kostenlos beitreten, Wissen teilen und Expertinnen und Experten finden.",
               desc_s="{n} lädt dich zu M365.FM ein, der Community rund um Microsoft 365.", go="Weiter zur Community", sub="lädt dich ein", brand="M365.FM · Community"),
    "en": dict(title="{n} invites you to M365.FM", title_nb="{n} invites you to the community", title_gen="Invitation to M365.FM",
               desc="{n} invites you to M365.FM, the community around Microsoft 365. Join for free, share knowledge and find experts.",
               desc_s="{n} invites you to M365.FM, the community around Microsoft 365.", go="Continue to the community", sub="invites you", brand="M365.FM · Community"),
}


def _cut(s, n):
    """Hoechstens n Zeichen: Schnitt an einer Wortgrenze mit Auslassungszeichen."""
    return s if len(s) <= n else s[: n - 1].rsplit(" ", 1)[0].rstrip(" ,;:|–—-") + "…"


def page_title(name, lang):
    """Titel der Seite (auch og:title und H1). Die Vorlage nennt die Marke schon, also kein Anhang " | M365.FM". Steht die Marke im Anzeigenamen
    selbst, gilt die Vorlage ohne Marke; steht sie dort mehrfach, der Titel ohne Namen (ein Anzeigename darf den Seitenbau nie aufhalten)."""
    t = T[lang]; k = "title" if not BRAND.search(name) else "title_nb" if len(BRAND.findall(name)) == 1 else "title_gen"
    return t[k].format(n=_cut(name, TITLE_MAX - len(t[k].format(n=""))))


def meta_description(name, head, lang):
    """meta description (<= 160 Zeichen): voller Text mit Kurzvorstellung, wenn er passt, sonst ohne sie, sonst die kurze Vorlage."""
    t = T[lang]; full = t["desc"].format(n=name)
    for d in ((f"{full} {head}" if head else full), full, t["desc_s"].format(n=name)):
        if len(d) <= DESC_MAX:
            return d
    return _cut(t["desc_s"].format(n=name), DESC_MAX)


def card_cover(name, headline, avatar, lang):
    """Titelbereich der Karte (1200x420): Avatar, Name, Einladungszeile. Alles escaped."""
    t = T[lang]
    img = (f'<img src="{html.escape(avatar, quote=True)}" width="260" height="260" style="position:absolute;left:64px;top:80px;border-radius:50%;object-fit:cover;border:4px solid #82a7d4">' if avatar else
           f'<div style="position:absolute;left:64px;top:80px;width:260px;height:260px;border-radius:50%;background:#2c3440;color:#82a7d4;font:700 120px/260px sans-serif;text-align:center">{html.escape((name or "?")[:1].upper())}</div>')
    return (f'{img}<div style="position:absolute;left:360px;right:64px;top:100px;color:#82a7d4;font:600 26px/1 \'Barlow Condensed\',sans-serif;letter-spacing:5px;text-transform:uppercase">{html.escape(t["brand"])}</div>'
            f'<div style="position:absolute;left:360px;right:64px;top:150px;font:700 76px/1.02 \'Barlow Condensed\',\'Noto Sans\',sans-serif;text-transform:uppercase;color:#eef0f3">{html.escape(name)}</div>'
            f'<div style="position:absolute;left:360px;right:64px;top:300px;font:600 38px/1.2 \'Barlow Condensed\',sans-serif;color:#98a0ab">{html.escape(t["sub"])}</div>')


def invite_html(base, p, og_base, avatar=""):
    """Seite fuer ein Profil p (handle, name, headline, lang). Gibt (pfad, html, og_item) zurueck."""
    h = p["handle"]; lang = "de" if str(p.get("lang") or "").startswith("de") else "en"; t = T[lang]
    name = re.sub(r"\s+", " ", str(p.get("name") or h)).strip()[:80]
    head = re.sub(r"\s+", " ", str(p.get("headline") or "")).strip()[:120]
    title = page_title(name, lang)
    desc = (t["desc"].format(n=name) + (f" {head}" if head else ""))[:300]   # og:description und Text der Seite; die meta description ist kuerzer (check_titles.py)
    canon = f"{base}/community/"; url = f"{base}/einladung/{h}/"; img = f"{og_base}/einladung/{h}.png"
    e = lambda s: html.escape(s, quote=True)
    ref = json.dumps(h)   # [a-z0-9-], daher sicher in <script>
    # Inline-Skript: derselbe Einlader bleibt mit dem ersten Zeitpunkt gemerkt (wie saveRef in assets/invite-share.js), dann weiter zur Community
    doc = f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="robots" content="noindex,follow">
<meta name="description" content="{e(meta_description(name, head, lang))}">
<link rel="canonical" href="{canon}">
<meta property="og:type" content="website"><meta property="og:site_name" content="M365.FM">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{url}"><meta property="og:image" content="{e(img)}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="{e(title)}">
<meta property="og:locale" content="{'de_DE' if lang == 'de' else 'en_US'}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(title)}"><meta name="twitter:description" content="{e(desc)}"><meta name="twitter:image" content="{e(img)}">
<style>body{{font-family:system-ui,Arial,sans-serif;max-width:34em;margin:14vh auto;padding:0 16px;line-height:1.5}}a.b{{display:inline-block;padding:.6em 1.2em;border-radius:.5em;background:#3E8BC0;color:#fff;text-decoration:none}}</style>
</head>
<body>
<h1>{e(title)}</h1>
<p>{e(desc)}</p>
<p><a class="b" href="{canon}?ref={h}">{e(t['go'])}</a></p>
<script>(function(){{var r={ref},n=Math.floor(Date.now()/1000),v=null;try{{v=JSON.parse(localStorage.getItem("m365_ref")||"null")}}catch(x){{}}try{{if(!v||v.r!==r||!(v.t>0)||n-v.t>{REF_DAYS * 86400}||v.t>n+86400)localStorage.setItem("m365_ref",JSON.stringify({{r:r,t:n}}))}}catch(x){{}}location.replace("{canon}?ref="+r)}})()</script>
</body>
</html>
"""
    item = {"path": f"og/einladung/{h}.png", "title": title, "lang": lang, "seed": url, "cover": card_cover(name, head, avatar, lang)}
    return f"einladung/{h}/index.html", doc, item


def build(g, people):
    base = g["BASE"]; n = 0
    for p in people:   # people = oeffentliche Profile aus dem Export; ein nicht (mehr) oeffentliches Profil bekommt weder Seite noch Karte
        if not p.get("handle") or not HANDLE.match(p["handle"]) or p.get("public", True) in (False, 0, "0"):
            continue
        av = f"{g.get('api', 'https://api-dub.m365.fm')}/api/img/u/{p['handle']}.jpg?v={p['img']}" if p.get("img") else ""
        path, doc, item = invite_html(base, p, g["OG_BASE"], av)
        g["write"](path, doc); g["OGLIST"].append(item); n += 1
    return n
