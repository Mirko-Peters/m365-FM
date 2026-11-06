"""Updates-Seite /updates/ (und /<sprache>/updates/): nur die Wochenzusammenfassungen "M365.FM milestones" (Mirko, 6.11.2026).
Die Seite zeigt ausschliesslich, was sich an der Website selbst geaendert hat (Funktionen, Design, Fehlerbehebungen) - keine neuen Folgen,
Artikel, Videos, Bibliothekseintraege, Microsoft-Updates oder GitHub-Meldungen (die fruehere Tagesliste site_home.news / site_updates.page_block
ist entfernt). Quelle: die Blogbeitraege von mirko-p mit dem Slug m365fm-milestones-<JJJJ>-w<KW>; die geplante Freitagsaufgabe legt sie als
Content-Paket imports/blog/en/<slug>.md an (site_content_blog), der Worker stellt sie live, das Uebersetzer-Team uebersetzt sie
(site_content_blog.translations). Gelistet werden nur Beitraege, die live sind (Blog-Export bzw. Sprachfassungen zu live stehenden Originalen)."""
import re
from datetime import date, datetime, timezone

from site_i18n import COMM_LANGS, pfx, pfx2, T
from site_learn import esc

AUTHOR = "mirko-p"
TOPIC = "m365fm"   # Entitaet M365.FM: jede Wochenzusammenfassung traegt dieses Thema (einheitlich auffindbar, Entitaetsseite)
SLUG = re.compile(r"^m365fm-milestones-(\d{4})-w(\d{1,2})$")
MIN_WORDS = 40     # kurze Wochen ("No visible changes this week") muessen trotzdem erscheinen; sonstige Content-Pakete: 300


def week_of(slug):
    """'m365fm-milestones-2026-w45' -> (2026, 45); sonst None (auch bei ungueltiger ISO-Woche)."""
    m = SLUG.match(slug or "")
    if not m:
        return None
    y, w = int(m.group(1)), int(m.group(2))
    try:
        date.fromisocalendar(y, w, 1)
    except ValueError:
        return None
    return y, w


def is_milestone(p):
    return p.get("handle", AUTHOR) == AUTHOR and week_of(p.get("slug")) is not None


def week_range(y, w):
    """ISO-Kalenderwoche -> (Montag, Sonntag)."""
    return date.fromisocalendar(y, w, 1), date.fromisocalendar(y, w, 7)


def url_of(base, p):
    return f"{base}{pfx(p.get('lang') or 'en')}/community/u/{p['handle']}/blog/{p['slug']}/"


def page_url(base, lang):
    return f"{base}/{pfx2(lang)}updates/"


def entries(posts, lang):
    """Wochenzusammenfassungen fuer eine Sprache, neueste Woche zuerst: [(jahr, woche, beitrag)].
    Fassung in der Sprache der Seite, sonst das englische Original (Sprachfassungen entstehen erst nach der Uebersetzung)."""
    own, orig = {}, {}
    for p in posts:
        if not is_milestone(p):
            continue
        k, pl = week_of(p["slug"]), p.get("lang") or "en"
        if pl == "en" and not p.get("tr_of"):
            orig[k] = p
        if pl == lang:
            own[k] = p
    return [(k[0], k[1], own.get(k) or orig[k]) for k in sorted(set(own) | set(orig), reverse=True)]


def page_langs(posts):
    """en und de immer (Footer-Link), weitere Community-Sprachen, sobald es dort mindestens eine Wochenzusammenfassung gibt."""
    have = {p.get("lang") for p in posts if is_milestone(p)}
    return [l for l in COMM_LANGS if l in ("en", "de") or l in have]


def _indexable(posts, lang):
    if lang in ("en", "de"):
        return True
    return any(is_milestone(p) and p.get("lang") == lang and (p.get("tr_index") if p.get("tr_of") else True) for p in posts)


def _fmt(d, lang):
    return d.strftime("%d.%m.%Y") if lang == "de" else d.isoformat()


def _pub(p):
    return datetime.fromtimestamp(p.get("published") or 0, timezone.utc).date()


def title(lang):
    return T(lang, "Updates – what's new on M365.FM each week", "Updates – was jede Woche neu ist")


def desc(lang):
    return T(lang, "Every Friday a short summary of what changed on the M365.FM website: new features, design changes and fixes.",
             "Jeden Freitag eine kurze Zusammenfassung, was sich auf der Website M365.FM geändert hat: neue Funktionen, Design-Änderungen und Fehlerbehebungen.")


CSS = ("<style>.ms-list{list-style:none;padding:0;margin:1.4rem 0}.ms-it{border:1px solid var(--bd,#1412101f);border-left:4px solid var(--acc,#3b6391);border-radius:12px;"
       "padding:.9rem 1.1rem;margin:0 0 1rem}.ms-it h2{margin:.25rem 0 .45rem;font-size:1.15rem;line-height:1.3}.ms-it h2 a{text-decoration:none}"
       ".ms-kw{margin:0;font-size:.85rem;color:var(--mut,#6b645c);display:flex;flex-wrap:wrap;gap:.2rem .6rem}.ms-it p{margin:.35rem 0}"
       ".ms-empty{border:1px dashed var(--bd,#1412101f);border-radius:12px;padding:1rem 1.1rem;margin:1.4rem 0}</style>")


def body(lang, base, items):
    """HTML im <main> der Updates-Seite (ohne Kopf/Fuss)."""
    wish = f'{base}{pfx(lang)}/community/#c-wish'
    head = (f'<h1>{esc(title(lang))}</h1><p class="mut">{esc(desc(lang))} '
            f'{esc(T(lang, "New episodes, articles and videos are not listed here.", "Neue Folgen, Artikel und Videos stehen nicht hier."))}</p>'
            f'<p><a class="btn main" href="{wish}">{esc(T(lang, "Roadmap & wishlist", "Roadmap & Wunschliste"))}</a></p>')
    if not items:
        return CSS + head + f'<p class="ms-empty">{esc(T(lang, "The first weekly summary will be published on Friday.", "Die erste Wochenzusammenfassung erscheint am Freitag."))}</p>'
    li = []
    for y, w, p in items:
        mo, su = week_range(y, w)
        u = url_of(base, p)
        other = (p.get("lang") or "en") != lang
        hl = ' hreflang="en" lang="en"' if other else ""
        kw = T(lang, "Week", "KW")
        li.append(f'<li class="ms-it" id="w{y}-{w:02d}"><article><p class="ms-kw"><span>{esc(kw)} {w} · {y}</span>'
                  f'<span><time datetime="{mo.isoformat()}">{_fmt(mo, lang)}</time> – <time datetime="{su.isoformat()}">{_fmt(su, lang)}</time></span></p>'
                  f'<h2><a href="{u}"{hl}>{esc(p["title"])}</a></h2>'
                  + (f'<p>{esc(p["summary"])}</p>' if p.get("summary") else "")
                  + f'<p><a href="{u}"{hl}>{esc(T(lang, "Read the full summary", "Ganze Zusammenfassung lesen"))}</a>'
                  + (f' <span class="mut">({esc(T(lang, "in English", "auf Englisch"))})</span>' if other else "") + '</p></article></li>')
    return CSS + head + f'<ol class="ms-list">{"".join(li)}</ol>'


def jsonld(lang, base, items, today):
    u = page_url(base, lang)
    ld = {"@context": "https://schema.org", "@type": "CollectionPage", "@id": u + "#page", "name": title(lang), "description": desc(lang), "url": u, "inLanguage": lang,
          "dateModified": (_pub(items[0][2]).isoformat() if items else today), "isPartOf": {"@id": f"{base}/#website"}, "publisher": {"@id": f"{base}/#org"}}
    if items:
        ld["mainEntity"] = {"@type": "ItemList", "itemListOrder": "https://schema.org/ItemListOrderDescending", "numberOfItems": len(items),
                            "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": url_of(base, p), "name": p["title"]} for i, (_, _, p) in enumerate(items)]}
    return [ld]


def build(g, posts):
    """Schreibt /updates/ und die Sprachfassungen. g: BASE, write, page, header, footer, sitemap, TODAY. Rueckgabe: {sprache: anzahl}."""
    BASE, write, page, header, footer, sitemap, TODAY = g["BASE"], g["write"], g["page"], g["header"], g["footer"], g["sitemap"], g["TODAY"]
    out = {}
    for lang in page_langs(posts):
        items = entries(posts, lang)
        u = page_url(BASE, lang)
        noidx = not _indexable(posts, lang)
        b = f'{header(lang, "")}<main class="wrap" style="max-width:48em">{body(lang, BASE, items)}</main>{footer(lang)}'
        write(f"{pfx2(lang)}updates/index.html", page(lang, f"{title(lang)} – M365.FM", desc(lang), u, b, None, jsonld(lang, BASE, items, TODAY), og_type="website", noindex=noidx))
        if not noidx:
            sitemap.append((u, jsonld(lang, BASE, items, TODAY)[0]["dateModified"], None))   # hreflang zwischen den Sprachfassungen: finish_hreflang (gleicher Pfad)
        out[lang] = len(items)
    return out


def more_box(lang, base, posts, p, k=6):
    """Unter einer Wochenzusammenfassung: weitere Wochenzusammenfassungen und der Weg zur Updates-Seite (statt 'Verwandte Artikel' -
    unter den Meilensteinen stehen keine Inhaltslisten wie Folgen, Artikel oder Videos)."""
    oth = [x for x in entries(posts, lang) if x[2] is not p and x[2].get("slug") != p.get("slug")][:k]
    li = "".join(f'<li><a href="{url_of(base, q)}"><b>{esc(q["title"])}</b></a> <span class="mut">· {esc(T(lang, "Week", "KW"))} {w} · {y}</span></li>' for y, w, q in oth)
    return (f'<section class="bl-rel"><h2>{esc(T(lang, "More weekly summaries", "Weitere Wochenzusammenfassungen"))}</h2>'
            + (f'<ul class="bl-list">{li}</ul>' if li else "")
            + f'<p><a href="{page_url(base, lang)}">{esc(T(lang, "All weekly summaries on the updates page", "Alle Wochenzusammenfassungen auf der Updates-Seite"))}</a></p></section>')
