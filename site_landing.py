"""Mehrsprachige Service-Landingpages: Hub /services/, 7 x /for/<zielgruppe>/, 6 x /i-want-to/<ziel>/ in allen 15 Sprachpfaden.

Texte: site_landing_copy.py (en, de). Weitere Sprachen ueber site_i18n.T (Worker uebersetzt die englischen Texte aus ui_js_en.json).
Solange eine Sprache die Texte noch nicht uebersetzt hat (_ready), wird ihre Fassung noindex geschrieben, nicht in die Sitemap und nicht
in die hreflang-Gruppe aufgenommen - keine englischen Doppelinhalte unter /fr/, /ja/ usw. Sobald die Uebersetzungen da sind, wechselt
die Sprache beim naechsten Bau automatisch auf index.

Bilder: generate_service_images.py zeichnet je Seite ein WebP (Hero 1600x900 + 800x450 je Variante en/de/x, Vorschau 480x270 + 960x540)
nach r2img/services/<IMG_VER>/...; tools/r2_og_upload.py laedt sie im Bau-Job VOR dem Deploy in den R2-Bucket (nur main, blockierend),
ausgeliefert ueber https://img.m365.fm/services/... (CLAUDE.md: Bilder nur ueber img.m365.fm)."""
import html
import json
import os
import re
from pathlib import Path

import site_landing_copy as C

ROOT = Path(__file__).parent
LANGS_ALL = ("en", "de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")
IMG_BASE = os.environ.get("SERVICES_IMG_BASE", "https://img.m365.fm/services")
IMG_VER = "v1"   # bei Aenderungen an generate_service_images.py erhoehen: neue Adressen statt veralteter Bilder im Cache
HERO, HERO_S, THUMB, THUMB_2X = (1600, 900), (800, 450), (480, 270), (960, 540)
READY_MIN = 0.9   # Anteil uebersetzter Saetze, ab dem eine weitere Sprache indexiert wird

HUB = {"path": "services/"}
PAGES = [dict(path=p, **C.PAGES[p]) for p in C.ORDER_AUDIENCES + C.ORDER_GOALS]
BY_PATH = {p["path"]: p for p in PAGES}


def _text(lang, text):
    from site_i18n import T
    return T(lang, text[0], text[1])


def _t(lang, text):
    return html.escape(_text(lang, text), quote=True)


def _u(lang, key):
    return _t(lang, C.UI[key])


def footer_label(lang):
    return _t(lang, ("Services", "Services"))


def _url(base, lang, path):
    return f"{base}/{lang + '/' if lang != 'en' else ''}{path}"


def hub_url(base, lang):
    return _url(base, lang, HUB["path"])


def slug(path):
    return path.strip("/").replace("/", "-") or "services"


def variant(lang):
    """Bildvariante: en/de mit Titel im Bild, alle anderen Sprachen ohne Text (x)."""
    return lang if lang in ("en", "de") else "x"


def hero_src(path, lang, size=HERO):
    return f"{IMG_BASE}/{IMG_VER}/{slug(path)}/hero-{variant(lang)}-{size[0]}.webp"


def og_src(path, lang):
    """Teilen-Bild 1200x630 als PNG (og:image; nicht jede Plattform liest WebP)."""
    return f"{IMG_BASE}/{IMG_VER}/{slug(path)}/og-{variant(lang)}.png"


def thumb_src(path, size=THUMB):
    return f"{IMG_BASE}/{IMG_VER}/{slug(path)}/thumb-{size[0]}.webp"


def image_jobs():
    """Alle Bilder fuer generate_service_images.py: (slug, motif, (en, de) Kurzname)."""
    return [(slug(HUB["path"]), C.HUB["motif"], C.HUB["short"])] + [(slug(p["path"]), p["motif"], p["short"]) for p in PAGES]


_ENT = {"mvp": "microsoft-mvp", "m365con": "m365con", "copilot": "copilot", "m365": "microsoft-365", "mirko": "mirko-peters"}


def _link(base, lang, key):
    """Adresse eines Link-Schluessels (site_landing_copy.LINKS) in der Sprache; Seiten, die es nur auf en/de gibt, fallen auf Englisch zurueck."""
    p = "" if lang == "en" else f"/{lang}"
    ed = "/de" if lang == "de" else ""
    if key in BY_PATH or key == HUB["path"]:
        return _url(base, lang, key)
    if key == "sponsor":
        return f"{base}{p}/sponsor/"
    if key == "community":
        return f"{base}{p}/community/"
    if key == "directory":
        return f"{base}{p}/directory/"
    sub = {"members": "members", "companies": "companies", "events": "events", "guests": "guests", "cpodcast": "podcast",
           "blog": "blog", "videos": "video", "library": "library"}
    if key in sub:
        return f"{base}{p}/community/{sub[key]}/"
    if key == "entities":
        return f"{base}{p}/entity/"
    if key in _ENT:
        return f"{base}{p}/entity/{_ENT[key]}/"
    if key == "podcast":
        return f"{base}/show/" if lang == "en" else f"{base}/{lang}/podcast/"
    if key == "episodes":
        return f"{base}/show/episodes/" if lang == "en" else f"{base}/{lang}/podcast/"
    if key == "updates":
        return f"{base}{ed}/updates/"
    if key == "press":
        return f"{base}{ed}/press/"
    if key == "mcp":
        return f"{base}{ed}/community/mcp/"
    if key == "live":
        return f"{base}{ed}/live/"
    if key == "languages":
        return f"{base}/#languages"
    raise KeyError(key)


def _a(base, lang, key):
    return html.escape(_link(base, lang, key), quote=True)


# ---------------------------------------------------------------- Uebersetzungsstand

def _strings(o, out):
    """Alle (en, de)-Paare der Texte einsammeln (fuer den Uebersetzungsstand)."""
    if isinstance(o, tuple) and len(o) == 2 and all(isinstance(x, str) for x in o):
        out.append(o)
    elif isinstance(o, dict):
        for k, v in o.items():
            if k not in ("motif", "related", "links", "status", "feature", "stats"):
                _strings(v, out)
    elif isinstance(o, (list, tuple)):
        for v in o:
            _strings(v, out)
    return out


def _ready(lang):
    """True, wenn die Sprache genug Saetze der Landingpages uebersetzt hat (en/de immer)."""
    if lang in ("en", "de"):
        return True
    pairs = [p for p in _strings([C.HUB, C.PAGES, C.UI, C.STATUS, C.LINKS], []) if len(p[0]) >= 40]
    if not pairs:
        return True
    done = sum(1 for en, de in pairs if _text(lang, (en, de)) != en)
    return done / len(pairs) >= READY_MIN


# ---------------------------------------------------------------- Bausteine

def _number(lang, value):
    separator = "." if lang in ("de", "es", "it", "pt", "nl", "id") else " " if lang in ("fr", "pl", "ru", "uk") else ","
    return f"{value:,}".replace(",", separator)


def _status(lang, status, feature, features):
    """(css-Klasse, Beschriftung) des Status; Funktionen hinter einem ausgeschalteten Schalter sind 'bald verfuegbar'."""
    if feature and not features.get(feature, False):
        status = "soon"
    return status, _t(lang, C.STATUS[status])


def _img(src, srcset, sizes, size, alt, hero=False):
    w, h = size
    load = 'fetchpriority="high" decoding="async"' if hero else 'loading="lazy" decoding="async"'
    return (f'<img src="{html.escape(src, quote=True)}" srcset="{html.escape(srcset, quote=True)}" sizes="{sizes}" '
            f'width="{w}" height="{h}" alt="{alt}" {load}>')


def _hero_img(path, lang, alt):
    srcset = f"{hero_src(path, lang, HERO_S)} {HERO_S[0]}w, {hero_src(path, lang)} {HERO[0]}w"
    return (f'<figure class="lp-hero-i">{_img(hero_src(path, lang), srcset, "(min-width: 900px) 500px, calc(100vw - 32px)", HERO, alt, hero=True)}</figure>')


def _card(base, lang, spec, features):
    """Service-Karte fuer Hub und 'Verwandte Angebote': Bild, was es ist, fuer wen, drei Vorteile, Link."""
    what, who, bens = spec["card"]
    href = html.escape(_url(base, lang, spec["path"]), quote=True)
    srcset = f"{thumb_src(spec['path'])} {THUMB[0]}w, {thumb_src(spec['path'], THUMB_2X)} {THUMB_2X[0]}w"
    img = _img(thumb_src(spec["path"]), srcset, "(min-width: 1040px) 320px, (min-width: 600px) 45vw, calc(100vw - 32px)", THUMB, _t(lang, spec["alt"]))
    ben = "".join(f"<li>{_t(lang, b)}</li>" for b in bens)
    return (f'<article class="lp-card"><div class="lp-card-i">{img}</div><div class="lp-card-b">'
            f'<h3><a href="{href}">{_t(lang, spec["h1"])}</a></h3><p>{_t(lang, what)}</p>'
            f'<p class="lp-for"><b>{_u(lang, "for")}:</b> {_t(lang, who)}</p><ul class="lp-ben">{ben}</ul>'
            f'<span class="lp-go" aria-hidden="true">{_u(lang, "more")} →</span></div></article>')


def _stats(g, lang):
    """Kennzahlen mit Quelle: Wert, Bezeichnung und Quelle je eigene Zeile. Nur Werte mit Datenquelle, nichts geschaetzt."""
    from site_sponsor import load_stats
    stats = g.get("stats")
    if stats is None:
        stats = load_stats()
    rows = []
    downloads = g.get("spreaker_downloads")
    download_available = isinstance(downloads, (int, float)) and not isinstance(downloads, bool)
    if downloads is None:
        top = ROOT / "data" / "top.json"
        try:
            data = json.loads(top.read_text("utf-8"))
            sp = data.get("spreaker") or {}
            values = sp.get("downloads") or {}
            download_available = sp.get("complete") is True and all(
                isinstance(values.get(l), (int, float)) and not isinstance(values.get(l), bool) for l in LANGS_ALL)
            downloads = sum(values[l] for l in LANGS_ALL) if download_available else None
            period = f'{sp.get("from", "")} – {sp.get("to", "")}'.strip(" –")
        except (OSError, ValueError, TypeError):
            downloads, period = None, ""
    else:
        period = g.get("spreaker_period", "")

    def row(value, label, source):
        return f'<div class="lp-stat"><b>{value}</b><span>{_t(lang, label)}</span><small>{source}</small></div>'

    if download_available and downloads >= 0:
        rows.append(row(_number(lang, downloads), ("Spreaker downloads", "Spreaker-Downloads"),
                        _t(lang, ("Source: Spreaker, site language editions", "Quelle: Spreaker, Sprachfassungen der Website")) + (" · " + html.escape(period, quote=True) if period else "")))
    episodes = g.get("n_main")
    if isinstance(episodes, int) and episodes > 0:
        rows.append(row(_number(lang, episodes), ("Published episodes", "Veröffentlichte Folgen"), _t(lang, ("Source: M365.FM episode archive", "Quelle: M365.FM-Folgenarchiv"))))
    languages = g.get("n_langs")
    if isinstance(languages, int) and languages > 0:
        rows.append(row(str(languages), ("Dubbed language editions", "Dub-Ausgaben"), _t(lang, ("Source: M365.FM episode archive", "Quelle: M365.FM-Folgenarchiv"))))
    bing = stats.get("bing") or {}
    if bing.get("ok"):
        per = bing.get("period") or {}
        rows.append(row(_number(lang, bing["citations"]), ("AI citations", "KI-Zitate"),
                        _t(lang, ("Source: Bing Webmaster Tools", "Quelle: Bing Webmaster Tools")) + f' · {html.escape(per.get("from", ""), quote=True)} – {html.escape(per.get("to", ""), quote=True)}'))
    gsc = stats.get("gsc") or {}
    if gsc.get("ok"):
        rows.append(row(_number(lang, gsc["clicks"]), ("Google Search clicks", "Google-Suchklicks"), _t(lang, ("Source: Google Search Console", "Quelle: Google Search Console"))))
    if not rows:
        return ""
    return (f'<div class="lp-stats" style="--n:{min(len(rows), 5)}" data-n="{len(rows)}" aria-label="{_u(lang, "figures_aria")}">{"".join(rows)}</div>'
            f'<p class="lp-note">{_u(lang, "figures_note")}</p>')


def _faq(lang, items, features):
    out = []
    for item in items:
        q, a = item[0], item[1]
        if len(item) > 2 and item[2] and not features.get(item[2], False):
            a = item[3] if len(item) > 3 else C.UI["soon_text"]
        out.append((q, a))
    return out


def _crumbs_ld(url, items):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "@id": url + "#breadcrumb",
            "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(items)]}


def _image_ld(url, src, lang, alt):
    return {"@context": "https://schema.org", "@type": "ImageObject", "@id": url + "#image", "url": src, "contentUrl": src,
            "width": HERO[0], "height": HERO[1], "caption": alt, "inLanguage": lang}


CF = '"Barlow Condensed","Barlow Condensed FB0","Barlow Condensed FB1","Barlow Condensed FB2","Arial Narrow",sans-serif'
CSS = ("""
.lp .crumbs{margin:22px 0 0}.lp .crumbs a+a:before{content:"/";margin:0 .6em;color:var(--mut)}
.lp-hero{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:44px;align-items:center;padding:34px 0 6px}.lp .crumbs+.lp-hero{padding-top:14px}
.lp-hero h1{font-size:clamp(2.1rem,4.4vw,3.3rem);line-height:1.02;margin:.25em 0 .35em}
.lp-hero .lede{color:var(--mut);font-size:1.14rem;line-height:1.55;max-width:34em;margin:0 0 1.1em}
.lp-hero .kicker{font-size:.8rem;margin:0 0 4px}
.lp-hero-i{position:relative;margin:0;border:1px solid var(--bd);background:#17191c;aspect-ratio:16/9}
.lp-hero-i:before,.lp-hero-i:after{content:"+";position:absolute;top:-11px;font:300 19px/1 Barlow,sans-serif;color:var(--mut);background:var(--bg);padding:0 1px}
.lp-hero-i:before{left:-7px}.lp-hero-i:after{right:-7px}
.lp-hero-i img,.lp-card-i img{display:block;width:100%;height:auto;aspect-ratio:16/9}
.lp-toc{display:flex;flex-wrap:wrap;gap:6px 22px;margin:40px 0 0;padding:13px 0;border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);font:600 .82rem/1.4 CF_;letter-spacing:.12em;text-transform:uppercase}
.lp-toc b{color:var(--fg);font-weight:600}.lp-toc a{color:var(--mut);text-decoration:none}.lp-toc a:hover{color:var(--ac)}
.lp .sec{margin:68px 0 0;scroll-margin-top:70px}.lp h2{margin:0 0 .55em}.lp .sec>.kicker{font-size:.8rem;margin:0 0 6px}
.lp-prose{max-width:46em}.lp-prose p{margin:0 0 1em;font-size:1.06rem;line-height:1.7}
.lp-offers{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.lp-offer{display:flex;flex-direction:column;gap:9px;padding:22px 22px 22px;border:1px solid var(--bd);background:var(--card)}
.lp-offer.soon{border-style:dashed;background:transparent}
.lp-offer h3,.lp-ex h3,.lp-steps h3{margin:0;font:600 1.35rem/1.15 CF_}
.lp-offer p{margin:0;color:var(--mut);font-size:.98rem;line-height:1.6}
.lp-badge{align-self:flex-start;display:inline-block;padding:4px 8px;border:1px solid var(--ac);color:var(--ac);font:600 .74rem/1.2 CF_;letter-spacing:.12em;text-transform:uppercase}
.lp-badge.free,.lp-badge.adfunded{background:var(--ac);color:var(--onac)}.lp-badge.soon{border-style:dashed;border-color:var(--mut);color:var(--mut)}
.lp-steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));counter-reset:s;border-top:2px solid var(--fg)}
.lp-steps li{counter-increment:s;padding:20px 20px 6px;border-inline-end:1px solid var(--bd)}.lp-steps li:first-child{padding-inline-start:0}.lp-steps li:last-child{border:0}
.lp-steps li:before{content:counter(s,decimal-leading-zero);display:block;margin-bottom:12px;font:600 2.3rem/1 CF_;color:var(--ac)}
.lp-steps h3{font-size:1.2rem;margin-bottom:.4em}.lp-steps p{margin:0;color:var(--mut);font-size:.95rem;line-height:1.55}
.lp-who{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:36px;align-items:start}.lp-who p{margin:0;font-size:1.06rem;color:var(--mut)}
.lp-checks{list-style:none;margin:0;padding:0;border-top:1px solid var(--bd)}
.lp-checks li{position:relative;padding:12px 0;padding-inline-start:34px;border-bottom:1px solid var(--bd)}
.lp-checks li:before{content:"\\2713";position:absolute;inset-inline-start:0;top:14px;width:21px;height:21px;line-height:21px;text-align:center;background:var(--ac);color:var(--onac);font-weight:700;font-size:.78rem}
.lp-ex{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}
.lp-ex>div{padding:4px 0;padding-inline-start:20px;border-inline-start:3px solid var(--ac)}.lp-ex h3{font-size:1.25rem;margin-bottom:.35em}.lp-ex p{margin:0;color:var(--mut);line-height:1.6}
.lp-note{margin:14px 0 0;color:var(--mut);font-size:.84rem}
.lp-links{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));column-gap:28px;border-top:1px solid var(--bd)}
.lp-links a{display:flex;justify-content:space-between;gap:10px;padding:13px 0;border-bottom:1px solid var(--bd);text-decoration:none;font:600 1.08rem/1.3 CF_}
.lp-links a:after{content:"\\2192";color:var(--ac)}.lp-links a:hover{color:var(--ac)}
[dir=rtl] .lp-links a:after,[dir=rtl] .lp-go{transform:scaleX(-1)}
.lp-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.lp-card{position:relative;display:flex;flex-direction:column;border:1px solid var(--bd);background:var(--card);transition:border-color .2s}
.lp-card-i{background:#17191c;border-bottom:1px solid var(--bd)}
.lp-card-b{flex:1;display:flex;flex-direction:column;gap:10px;padding:18px 20px 20px}
.lp-card h3{margin:0;font:600 1.3rem/1.15 CF_}.lp-card h3 a{color:inherit;text-decoration:none}.lp-card h3 a:after{content:"";position:absolute;inset:0}
.lp-card p{margin:0;color:var(--mut);font-size:.95rem;line-height:1.55}.lp-card .lp-for{font-size:.88rem}
.lp-for b{color:var(--fg);font:600 .78rem CF_;letter-spacing:.12em;text-transform:uppercase}
.lp-ben{list-style:none;margin:0;padding:0;display:grid;gap:5px;font-size:.92rem}
.lp-ben li{position:relative;padding-inline-start:18px}.lp-ben li:before{content:"";position:absolute;inset-inline-start:0;top:.62em;width:8px;height:8px;background:var(--ac)}
.lp-go{margin-top:auto;padding-top:8px;font:600 .82rem CF_;letter-spacing:.12em;text-transform:uppercase;color:var(--ac)}
.lp-card:hover,.lp-card:focus-within{border-color:var(--ac)}.lp-card:hover h3,.lp-card:focus-within h3{color:var(--ac)}.lp-card:focus-within{outline:3px solid var(--ac);outline-offset:2px}
.lp-card h3 a:focus-visible{outline:0}
.lp-table{width:100%;border-collapse:collapse;border-top:2px solid var(--fg)}
.lp-table th,.lp-table td{text-align:start;vertical-align:top;padding:15px 14px;border-bottom:1px solid var(--bd)}
.lp-table th:first-child,.lp-table td:first-child{padding-inline-start:0}
.lp-table thead th{font:600 .74rem CF_;letter-spacing:.14em;text-transform:uppercase;color:var(--mut);padding-top:12px;padding-bottom:12px}
.lp-table tbody th{width:30%;font-weight:400;line-height:1.25}.lp-table tbody th a{font:600 1.18rem/1.2 CF_;text-decoration:none}.lp-table tbody th a:hover{color:var(--ac)}
.lp-table td{color:var(--mut);font-size:.96rem;line-height:1.5}.lp-table td:last-child{width:24%}
.lp-stats{display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));border-top:2px solid var(--fg);border-bottom:1px solid var(--bd)}
.lp-stat{display:flex;flex-direction:column;gap:7px;padding:22px 20px 20px;border-inline-end:1px solid var(--bd)}.lp-stat:first-child{padding-inline-start:0}.lp-stat:last-child{border-inline-end:0}
.lp-stat b{font:600 clamp(2rem,3.6vw,2.8rem)/1 CF_;color:var(--ac)}
.lp-stat span{font:600 .82rem/1.3 CF_;letter-spacing:.13em;text-transform:uppercase;color:var(--fg)}
.lp-stat small{font-size:.8rem;line-height:1.45;color:var(--mut)}
.lp-intro{max-width:48em}.lp-intro p{margin:0 0 1em;font-size:1.06rem;line-height:1.7}
.lp .faq details{scroll-margin-top:70px}
@media(max-width:900px){.lp-cards{grid-template-columns:repeat(2,minmax(0,1fr))}.lp-steps{grid-template-columns:repeat(2,minmax(0,1fr))}
 .lp-steps li{padding-inline-start:0;border-inline-end:0;border-bottom:1px solid var(--bd);padding-bottom:18px}.lp-steps li:nth-child(odd){padding-inline-end:22px}
 .lp-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.lp-stat{padding-inline-start:0;border-inline-end:0;border-bottom:1px solid var(--bd)}.lp-stat:last-child{border-bottom:0}
 .lp-stats[data-n="3"] .lp-stat:last-child,.lp-stats[data-n="5"] .lp-stat:last-child,.lp-stats[data-n="1"] .lp-stat{grid-column:1/-1}}
@media(max-width:860px){.lp-hero{grid-template-columns:1fr;gap:26px;padding-top:22px}.lp-who{grid-template-columns:1fr;gap:18px}}
@media(max-width:640px){.lp-offers,.lp-ex,.lp-cards,.lp-steps{grid-template-columns:1fr}.lp-steps li:nth-child(odd){padding-inline-end:0}
 .lp .sec{margin-top:52px}.lp-toc{gap:4px 16px}
 .lp-table thead{display:none}.lp-table,.lp-table tbody{display:block}
 .lp-table tr{display:grid;grid-template-columns:1fr auto;gap:6px 12px;padding:14px 0;border-bottom:1px solid var(--bd)}
 .lp-table th,.lp-table td{display:block;width:auto!important;padding:0!important;border:0}.lp-table td:nth-child(2){grid-column:1/-1;grid-row:2}
 .lp-table td:last-child{grid-column:2;grid-row:1}}
""").replace("CF_", CF)
CSS_TAG = "<style>" + re.sub(r"\s*\n\s*", "", CSS) + "</style>"


# ---------------------------------------------------------------- Seiten

def _hub(g, lang, features):
    base, today = g["BASE"], g["TODAY"]
    H = C.HUB
    url = hub_url(base, lang)
    h1_text, lead_text, alt_text = _text(lang, H["h1"]), _text(lang, H["lead"]), _text(lang, H["alt"])
    intro_h, intro_ps = H["intro"]
    audiences = "".join(_card(base, lang, BY_PATH[p], features) for p in C.ORDER_AUDIENCES)
    goals = "".join(_card(base, lang, BY_PATH[p], features) for p in C.ORDER_GOALS)
    dh, dw, dfor, dbens = H["directory_card"]
    directory_card = (f'<article class="lp-card"><div class="lp-card-b"><h3><a href="{_a(base, lang, "directory")}">{_t(lang, dh)}</a></h3>'
                      f'<p>{_t(lang, dw)}</p><p class="lp-for"><b>{_u(lang, "for")}:</b> {_t(lang, dfor)}</p>'
                      f'<ul class="lp-ben">{"".join(f"<li>{_t(lang, item)}</li>" for item in dbens)}</ul>'
                      f'<span class="lp-go">{_t(lang, C.STATUS["free"])}</span></div></article>')
    rows = ""
    for name, what, status, feature, key in H["glance"]:
        cls, label = _status(lang, status, feature, features)
        rows += (f'<tr><th scope="row"><a href="{_a(base, lang, key)}">{_t(lang, name)}</a></th><td>{_t(lang, what)}</td>'
                 f'<td><span class="lp-badge {cls}">{label}</span></td></tr>')
    faq_items = _faq(lang, H["faq"], features)
    faq = "".join(f"<details><summary>{_t(lang, q)}</summary><p>{_t(lang, a)}</p></details>" for q, a in faq_items)
    stats = _stats(g, lang)
    body = (f'{g["header"](lang, "")}<main class="wrap lp">'
            f'<div class="lp-hero"><div><div class="kicker">{_u(lang, "kicker")}</div><h1>{html.escape(h1_text, quote=True)}</h1>'
            f'<p class="lede">{html.escape(lead_text, quote=True)}</p>'
            f'<div class="btns"><a class="btn" href="#audiences">{_u(lang, "by_audience")}</a><a class="btn" href="#goals">{_u(lang, "by_goal")}</a></div></div>'
            f'{_hero_img(HUB["path"], lang, html.escape(alt_text, quote=True))}</div>'
            f'<section class="sec" id="about"><h2>{_t(lang, intro_h)}</h2><div class="lp-intro">{"".join(f"<p>{_t(lang, p)}</p>" for p in intro_ps)}</div></section>'
            f'<section class="sec" id="audiences"><div class="kicker">{_u(lang, "by_audience_k")}</div><h2>{_u(lang, "by_audience")}</h2><div class="lp-cards">{audiences}</div></section>'
            f'<section class="sec" id="goals"><div class="kicker">{_u(lang, "by_goal_k")}</div><h2>{_u(lang, "by_goal")}</h2><div class="lp-cards">{goals}</div></section>'
            f'<section class="sec" id="directory"><div class="kicker">{_t(lang, C.LINKS["directory"])}</div><div class="lp-cards">{directory_card}</div></section>'
            f'<section class="sec" id="overview"><div class="kicker">{_u(lang, "glance_k")}</div><h2>{_u(lang, "glance")}</h2>'
            f'<table class="lp-table"><thead><tr><th scope="col">{_u(lang, "col_service")}</th><th scope="col">{_u(lang, "col_what")}</th><th scope="col">{_u(lang, "col_status")}</th></tr></thead><tbody>{rows}</tbody></table></section>'
            + (f'<section class="sec" id="figures"><h2>{_u(lang, "figures")}</h2>{stats}</section>' if stats else "")
            + f'<section class="sec faq" id="faq"><h2>{_u(lang, "faq")}</h2>{faq}</section></main>{g["footer"](lang)}')
    home = f"{base}/" if lang == "en" else f"{base}/{lang}/"
    hero = hero_src(HUB["path"], lang)
    ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "@id": url + "#page", "url": url, "name": h1_text,
           "description": _text(lang, H["meta"]), "inLanguage": lang, "dateModified": today, "isPartOf": {"@id": f"{base}/#website"},
           "publisher": {"@id": f"{base}/#org"}, "primaryImageOfPage": {"@id": url + "#image"}, "breadcrumb": {"@id": url + "#breadcrumb"},
           "mainEntity": {"@type": "ItemList", "numberOfItems": len(PAGES), "itemListElement": [
               {"@type": "ListItem", "position": i + 1, "name": _text(lang, p["h1"]), "url": _url(base, lang, p["path"])} for i, p in enumerate(PAGES)]}},
          _image_ld(url, hero, lang, alt_text),
          _crumbs_ld(url, [(_text(lang, C.UI["crumb_home"]), home), (h1_text, url)]),
          {"@context": "https://schema.org", "@type": "FAQPage", "@id": url + "#faq", "inLanguage": lang,
           "mainEntity": [{"@type": "Question", "name": _text(lang, q), "acceptedAnswer": {"@type": "Answer", "text": _text(lang, a)}} for q, a in faq_items]}]
    return body, ld, _text(lang, H["seo"]), _text(lang, H["meta"]), hero


def _sub(g, lang, spec, features):
    base, today = g["BASE"], g["TODAY"]
    path = spec["path"]
    url = _url(base, lang, path)
    hub = hub_url(base, lang)
    h1_text, lead_text, alt_text = _text(lang, spec["h1"]), _text(lang, spec["lead"]), _text(lang, spec["alt"])
    cta_text, cta_key = spec["cta"]
    cta, cta_url = _t(lang, cta_text), _a(base, lang, cta_key)
    need_h, need_ps = spec["need"]
    offers_h, offers = spec["offers"]
    steps_h, steps = spec["steps"]
    who_h, who_p, who_items = spec["who"]
    ex_h, examples = spec["examples"]
    stats = _stats(g, lang) if spec.get("stats") else ""
    faq_items = _faq(lang, spec["faq"], features)
    directory_note = (f'<p class="dir-note">{_t(lang, spec["directory_note"])}'
                      f'<a href="{_a(base, lang, "directory")}">{_t(lang, C.LINKS["directory"])}</a>.</p>') if spec.get("directory_note") else ""

    offer_html = ""
    for o in offers:
        cls, label = _status(lang, o["status"], o.get("feature"), features)
        text = o["p"] if cls != "soon" else (o.get("off") or C.UI["soon_text"])
        offer_html += f'<article class="lp-offer{" soon" if cls == "soon" else ""}"><span class="lp-badge {cls}">{label}</span><h3>{_t(lang, o["h"])}</h3><p>{_t(lang, text)}</p></article>'
    toc = [("need", need_h), ("offer", offers_h), ("how", steps_h), ("who", who_h), ("examples", ex_h)] + ([("figures", C.UI["figures"])] if stats else []) + [("faq", C.UI["faq"])]
    body = (f'{g["header"](lang, "")}<main class="wrap lp">'
            f'<nav class="crumbs" aria-label="{_t(lang, ("Breadcrumb", "Brotkrumennavigation"))}"><a href="{html.escape(f"{base}/" if lang == "en" else f"{base}/{lang}/", quote=True)}">{_u(lang, "crumb_home")}</a><a href="{html.escape(hub, quote=True)}">{_u(lang, "crumb")}</a></nav>'
            f'<div class="lp-hero"><div><div class="kicker">{_u(lang, "kicker")}</div><h1>{html.escape(h1_text, quote=True)}</h1><p class="lede">{html.escape(lead_text, quote=True)}</p>{directory_note}'
            f'<div class="btns"><a class="btn main" href="{cta_url}">{cta}</a><a class="btn" href="{html.escape(hub, quote=True)}">{_u(lang, "all")}</a></div></div>'
            f'{_hero_img(path, lang, html.escape(alt_text, quote=True))}</div>'
            f'<nav class="lp-toc" aria-label="{_u(lang, "toc")}"><b>{_u(lang, "toc")}:</b>{"".join(f"<a href=\"#{i}\">{_t(lang, h)}</a>" for i, h in toc)}</nav>'
            f'<section class="sec" id="need"><h2>{_t(lang, need_h)}</h2><div class="lp-prose">{"".join(f"<p>{_t(lang, p)}</p>" for p in need_ps)}</div></section>'
            f'<section class="sec" id="offer"><h2>{_t(lang, offers_h)}</h2><div class="lp-offers">{offer_html}</div></section>'
            f'<section class="sec" id="how"><h2>{_t(lang, steps_h)}</h2><ol class="lp-steps">{"".join(f"<li><h3>{_t(lang, h)}</h3><p>{_t(lang, p)}</p></li>" for h, p in steps)}</ol></section>'
            f'<section class="sec" id="who"><h2>{_t(lang, who_h)}</h2><div class="lp-who"><p>{_t(lang, who_p)}</p><ul class="lp-checks">{"".join(f"<li>{_t(lang, i)}</li>" for i in who_items)}</ul></div></section>'
            f'<section class="sec" id="examples"><h2>{_t(lang, ex_h)}</h2><div class="lp-ex">{"".join(f"<div><h3>{_t(lang, h)}</h3><p>{_t(lang, p)}</p></div>" for h, p in examples)}</div>'
            f'<p class="lp-note">{_u(lang, "examples_note")}</p></section>'
            + (f'<section class="sec" id="figures"><h2>{_u(lang, "figures")}</h2>{stats}</section>' if stats else "")
            + f'<section class="sec faq" id="faq"><h2>{_u(lang, "faq")}</h2>{"".join(f"<details><summary>{_t(lang, q)}</summary><p>{_t(lang, a)}</p></details>" for q, a in faq_items)}</section>'
            f'<section class="sec" id="links"><h2>{_u(lang, "links")}</h2><ul class="lp-links">{"".join(f"<li><a href=\"{_a(base, lang, k)}\">{_t(lang, C.LINKS[k])}</a></li>" for k in spec["links"])}</ul></section>'
            f'<section class="sec" id="related"><h2>{_u(lang, "related")}</h2><div class="lp-cards">{"".join(_card(base, lang, BY_PATH[p], features) for p in spec["related"])}</div></section></main>'
            f'<section class="band"><div class="wrap"><h2>{_u(lang, "cta_band")}</h2><p>{html.escape(lead_text, quote=True)}</p><div class="btns"><a class="btn main" href="{cta_url}">{cta}</a></div></div></section>'
            f'{g["footer"](lang)}')
    home = f"{base}/" if lang == "en" else f"{base}/{lang}/"
    hero = hero_src(path, lang)
    meta = _text(lang, spec["meta"])
    who_label = "; ".join(_text(lang, i) for i in who_items)
    ld = [{"@context": "https://schema.org", "@type": "WebPage", "@id": url + "#page", "url": url, "name": h1_text, "description": meta,
           "inLanguage": lang, "dateModified": today, "isPartOf": {"@id": f"{base}/#website"}, "publisher": {"@id": f"{base}/#org"},
           "primaryImageOfPage": {"@id": url + "#image"}, "breadcrumb": {"@id": url + "#breadcrumb"}, "about": {"@id": url + "#service"}},
          {"@context": "https://schema.org", "@type": "Service", "@id": url + "#service", "name": h1_text, "description": lead_text, "url": url,
           "serviceType": _text(lang, spec["short"]), "provider": {"@id": f"{base}/#org"}, "areaServed": "Worldwide", "image": hero,
           "audience": {"@type": "Audience", "audienceType": who_label}, "inLanguage": lang},
          _image_ld(url, hero, lang, alt_text),
          _crumbs_ld(url, [(_text(lang, C.UI["crumb_home"]), home), (_text(lang, C.HUB["h1"]), hub), (h1_text, url)]),
          {"@context": "https://schema.org", "@type": "FAQPage", "@id": url + "#faq", "inLanguage": lang,
           "mainEntity": [{"@type": "Question", "name": _text(lang, q), "acceptedAnswer": {"@type": "Answer", "text": _text(lang, a)}} for q, a in faq_items]}]
    return body, ld, _text(lang, spec["seo"]), meta, hero


def build(g):
    """Schreibt Hub und Zielseiten in allen 15 Sprachpfaden und meldet sie (soweit indexierbar) fuer hreflang und Sitemap an."""
    base, today = g["BASE"], g["TODAY"]
    langs = ["en"] + [lang for lang in LANGS_ALL[1:] if lang in g["LANGS"]]
    feature_file = ROOT / "data" / "landing_features.json"
    try:
        features = g["features"] if "features" in g else json.loads(feature_file.read_text("utf-8"))
    except (OSError, ValueError):
        features = {}
    ready = {lang: _ready(lang) for lang in langs}
    idx = [lang for lang in langs if ready[lang]]
    for lang in langs:
        prefix = "" if lang == "en" else f"{lang}/"
        writer = g["write"] if lang in ("en", "de") else g["write_r2"]
        for path in [HUB["path"]] + [p["path"] for p in PAGES]:
            alt = {l: _url(base, l, path) for l in idx}
            url = _url(base, lang, path)
            if path == HUB["path"]:
                body, ld, title, desc, hero = _hub(g, lang, features)
            else:
                body, ld, title, desc, hero = _sub(g, lang, BY_PATH[path], features)
            kw = dict(xdefault=alt.get("en"), og_type="website", share=False, extra_head=CSS_TAG, og_image=(og_src(path, lang), 1200, 630))
            if not ready[lang]:
                kw["noindex"] = True
            writer(prefix + path + "index.html", g["page"](lang, title, desc, url, body, alt if ready[lang] else None, ld, **kw))
            if ready[lang]:
                g["sitemap"].append((url, today, alt))
