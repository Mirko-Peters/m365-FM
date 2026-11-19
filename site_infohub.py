"""Infografiken-Seite: /infographics/ (en) und /de/infografiken/ (de) - die Kopfbilder und Infografiken von M365.FM zum Ansehen, Teilen und Einbetten (CC BY 4.0).
Wird bei jedem Seitenbau selbst gefuellt, ohne Handpflege: Jede Seite, die ihre Bilder ausgibt (Blogbeitrag, Entitaet, Folge; nur mit Freigabe data/infographics_live.json),
meldet sich ueber site_infographics.image_ld(title=...) an. Daraus entstehen je Art die neuesten CAP Eintraege (nach Datum, sonst alphabetisch) mit Kopfbild, Link zur Seite und
fertigem Einbettungscode samt Namensnennung (Quellenangabe = Link auf die Seite: Rueckverweise). Ohne Freigabe oder ohne Bilder in der Sprache entsteht keine Seite, der Bau bleibt unveraendert.
Nur en und de; weitere Sprachen folgen mit ihrer Freigabe (Texte in TXT ergaenzen). Folgen nur auf Englisch (Sprachkopien sind oft noindex und stehen nicht im Verzeichnis)."""
from html import escape as E
import json

import site_infographics as IG
import site_imglicense as ILC

CAP = 24                                  # je Art; die Seite bleibt klein, die Bild-Sitemap kennt alle Bilder
PATH = {"en": "infographics", "de": "de/infografiken"}
KINDS = ("blog", "entity", "episode")
TXT = {
    "en": {"title": "Infographics", "meta": "Infographics and header images from M365.FM: Microsoft 365 explained at a glance. Free to share with credit under CC BY 4.0, with ready-made embed code.",
           "h1": "Infographics", "lead": "Microsoft 365 at a glance: header images and infographics from our articles, entity pages and episodes. You may use them with credit under CC BY 4.0. Each card has ready-made embed code with the credit link.",
           "blog": "From the articles", "entity": "From the entity pages", "episode": "From the episodes",
           "embed": "Embed code", "lic": "Image license (CC BY 4.0)", "copy": "Copy the code and paste it into your page; the credit line links back to the source page.",
           "credit": "Image", "page": "Open page"},
    "de": {"title": "Infografiken", "meta": "Infografiken und Kopfbilder von M365.FM: Microsoft 365 auf einen Blick. Mit Namensnennung frei nutzbar unter CC BY 4.0, mit fertigem Einbettungscode.",
           "h1": "Infografiken", "lead": "Microsoft 365 auf einen Blick: Kopfbilder und Infografiken aus unseren Artikeln, Entitätsseiten und Folgen. Du darfst sie mit Namensnennung unter CC BY 4.0 verwenden. Jede Karte hat fertigen Einbettungscode samt Quellenangabe.",
           "blog": "Aus den Artikeln", "entity": "Aus den Entitätsseiten", "episode": "Aus den Folgen",
           "embed": "Einbettungscode", "lic": "Bildlizenz (CC BY 4.0)", "copy": "Code kopieren und in deine Seite einfügen; die Quellenangabe verlinkt auf die Ursprungsseite.",
           "credit": "Bild", "page": "Seite öffnen"},
}


def url(base, lang):
    return f"{base}/{PATH['de' if lang == 'de' else 'en']}/"


def items(lang, seen=None):
    """{art: [Eintrag, ...]} fuer eine Sprache: nur Seiten mit Bildern, neueste zuerst (Datum absteigend, dann Titel), hoechstens CAP je Art. Leer, wenn nichts da ist."""
    seen = IG.seen() if seen is None else seen
    out = {}
    for kind in KINDS:
        rows = [v for (k, s, l), v in seen.items() if k == kind and l == lang and (kind != "episode" or lang == "en")]
        rows.sort(key=lambda v: v["title"].lower())
        rows.sort(key=lambda v: v["date"], reverse=True)
        if rows: out[kind] = rows[:CAP]
    return out


def embed(v, lang):
    t = TXT[lang]; im = v["imgs"][0]
    deed = ILC.LICENSE + ("deed.de" if lang == "de" else "")
    return (f'<a href="{E(v["url"], quote=True)}"><img src="{E(im["u"], quote=True)}" alt="{E(im["a"], quote=True)}" width="{im["w"]}" height="{im["h"]}" loading="lazy"></a>\n'
            f'<p>{t["credit"]}: <a href="{E(v["url"], quote=True)}">M365.FM</a>, <a href="{deed}">CC BY 4.0</a></p>')


def card(v, lang):
    t = TXT[lang]; im = v["imgs"][0]
    return (f'<article style="border:1px solid var(--fg);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px">'
            f'<a href="{E(v["url"], quote=True)}"><img src="{E(im["u"], quote=True)}" alt="{E(im["a"], quote=True)}" width="{im["w"]}" height="{im["h"]}" loading="lazy" decoding="async" '
            f'style="display:block;width:100%;height:auto;border-radius:10px"></a>'
            f'<h3 style="margin:0;font-size:1.05em"><a href="{E(v["url"], quote=True)}">{E(v["title"])}</a></h3>'
            f'<details><summary>{E(t["embed"])}</summary><p class="mut" style="margin:.4em 0">{E(t["copy"])}</p>'
            f'<textarea readonly rows="5" style="width:100%;box-sizing:border-box;font:inherit;font-size:.85em" aria-label="{E(t["embed"])}">{E(embed(v, lang))}</textarea></details></article>')


def body(lang, its, base=""):
    t = TXT[lang]
    secs = "".join(f'<section><h2>{E(t[k])}</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">{"".join(card(v, lang) for v in its[k])}</div></section>'
                   for k in KINDS if k in its)
    return (f'<h1>{E(t["h1"])}</h1><p style="font-size:1.1em">{E(t["lead"])}</p>'
            f'<p><a href="{ILC.url(base, lang)}" rel="license">{E(t["lic"])}</a></p>' + secs)


def ld(lang, u, its):
    t = TXT[lang]
    flat = [v for k in KINDS for v in its.get(k, [])]
    return [{"@context": "https://schema.org", "@type": "CollectionPage", "@id": u + "#page", "url": u, "name": t["title"], "description": t["meta"], "inLanguage": lang,
             "license": ILC.LICENSE, "mainEntity": {"@type": "ItemList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": v["url"], "name": v["title"]} for i, v in enumerate(flat)]}}]


def build(g, seen=None):
    """Schreibt die Seiten fuer jede Sprache (en, de) mit Bildern; traegt sie in die Sitemap ein. -> Zahl der Seiten."""
    BASE, write, page, sitemap, TODAY = g["BASE"], g["write"], g["page"], g["sitemap"], g["TODAY"]
    built = {lg: items(lg, seen) for lg in ("en", "de")}
    built = {lg: its for lg, its in built.items() if its}
    alts = {lg: url(BASE, lg) for lg in built}
    for lg, its in built.items():
        t = TXT[lg]; u = alts[lg]
        first = next(v for k in KINDS for v in its.get(k, []))["imgs"][0]
        write(PATH[lg] + "/index.html", page(lg, f'{t["title"]} – M365.FM', t["meta"], u,
                                          f'{g["header"](lg, "")}<main class="wrap" style="max-width:72em">{body(lg, its, BASE)}</main>{g["footer"](lg)}',
                                          alts if len(alts) > 1 else None, ld(lg, u, its), xdefault=alts.get("en", u), og_type="website", switch=alts if len(alts) > 1 else None, share=False,
                                          og_image=(first["u"][:-5] + ".jpg", first["w"], first["h"])))
        sitemap.append((u, TODAY, alts if len(alts) > 1 else None))
    return len(built)
