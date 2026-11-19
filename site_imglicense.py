"""Seite "Bildlizenz" (CC BY 4.0) fuer die eigenen Kopfbilder und Infografiken: /image-license/ (en) und /de/bildlizenz/ (de).
Ziel von acquireLicensePage in den ImageObject-Knoten (site_infographics.image_ld) und Verlinkung im Pressekit. Entscheidung Mirko, 19.11.2026: CC BY 4.0.
Gilt nur fuer eigene Bilder; Logos, Marken, Gaestefotos, Cover und fremde Bilder sind ausgenommen."""
from html import escape as E

LICENSE = "https://creativecommons.org/licenses/by/4.0/"
LEGAL = "https://creativecommons.org/licenses/by/4.0/legalcode"
PATH = {"en": "image-license", "de": "de/bildlizenz"}
TXT = {
    "en": {"title": "Image license (CC BY 4.0)", "meta": "The infographics and header images on M365.FM are free to use with attribution under CC BY 4.0. How to credit, what is covered and what is not.",
           "h1": "Image license: CC BY 4.0",
           "lead": "The infographics and header images that M365.FM creates for its articles, entity pages and episode pages are licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). You may use them, also commercially, if you give credit.",
           "may": "What you may do", "may_l": ["Share the images: copy them, put them in articles, slides, newsletters and social posts.", "Adapt them: crop, translate or recolor, as long as you say that you changed them.", "Use them commercially."],
           "how": "How to give credit", "how_p": "Name M365.FM as the creator, link to the page where the image appears (or to https://www.m365.fm/) and name the license. Example:",
           "snip": '<a href="PAGE-URL">Image: M365.FM</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>', "snip_t": "Image: M365.FM (https://www.m365.fm/), CC BY 4.0",
           "which": "Which images are covered", "which_l": ["Header images and infographics under img.m365.fm/ig/ (the images with the M365.FM figure style on blog posts, entity pages and episode pages).", "Their text is the editorial summary of the page; the facts come from the episodes and the cited sources."],
           "not": "What is not covered", "not_l": ["Logos and product names of Microsoft and other companies. They belong to their owners.", "Photos of guests and hosts, podcast cover art and any image that is not listed above.", "Images from third parties that appear on a page."],
           "more": "Other uses", "more_p": "For uses that need no credit or other terms, write to ", "mail": "mirko.peters@m365.fm",
           "deed": "License summary", "legal": "Full legal text"},
    "de": {"title": "Bildlizenz (CC BY 4.0)", "meta": "Die Infografiken und Kopfbilder von M365.FM dürfen mit Namensnennung unter CC BY 4.0 genutzt werden. So nennst du uns, was gilt und was nicht.",
           "h1": "Bildlizenz: CC BY 4.0",
           "lead": "Die Infografiken und Kopfbilder, die M365.FM für Artikel, Entitätsseiten und Folgenseiten erstellt, stehen unter der Lizenz Creative Commons Namensnennung 4.0 International (CC BY 4.0). Du darfst sie auch kommerziell nutzen, wenn du die Quelle nennst.",
           "may": "Was du darfst", "may_l": ["Die Bilder teilen: kopieren und in Artikeln, Folien, Newslettern und Social-Media-Beiträgen verwenden.", "Sie bearbeiten: zuschneiden, übersetzen oder umfärben, wenn du angibst, dass du etwas geändert hast.", "Sie kommerziell nutzen."],
           "how": "So nennst du uns", "how_p": "Nenne M365.FM als Urheber, verlinke die Seite, auf der das Bild steht (oder https://www.m365.fm/) und nenne die Lizenz. Beispiel:",
           "snip": '<a href="SEITEN-URL">Bild: M365.FM</a>, <a href="https://creativecommons.org/licenses/by/4.0/deed.de">CC BY 4.0</a>', "snip_t": "Bild: M365.FM (https://www.m365.fm/), CC BY 4.0",
           "which": "Welche Bilder gelten", "which_l": ["Kopfbilder und Infografiken unter img.m365.fm/ig/ (die Bilder im M365.FM-Stil auf Blogbeiträgen, Entitätsseiten und Folgenseiten).", "Ihr Text fasst die jeweilige Seite zusammen; die Fakten stammen aus den Folgen und den genannten Quellen."],
           "not": "Was nicht gilt", "not_l": ["Logos und Produktnamen von Microsoft und anderen Firmen. Sie gehören ihren Inhabern.", "Fotos von Gästen und Moderatoren, Podcast-Cover und jedes Bild, das oben nicht genannt ist.", "Bilder von Dritten, die auf einer Seite erscheinen."],
           "more": "Andere Nutzung", "more_p": "Für Nutzung ohne Namensnennung oder mit anderen Bedingungen schreib an ", "mail": "mirko.peters@m365.fm",
           "deed": "Lizenz im Überblick", "legal": "Vollständiger Lizenztext"},
}


def url(base, lang):
    return f"{base}/{PATH['de' if lang == 'de' else 'en']}/"


def _hub(base, lang):
    """Link zur Infografiken-Seite, wenn sie in diesem Bau entsteht (sonst nichts, damit kein toter Link entsteht)."""
    import site_infohub as IH   # erst hier: site_infohub importiert dieses Modul
    return (f'<p><a href="{IH.url(base, lang)}">{IH.TXT["de" if lang == "de" else "en"]["title"]}</a></p>' if IH.items("de" if lang == "de" else "en") else "")


def body(lang, base=""):
    t = TXT["de" if lang == "de" else "en"]
    deed = LICENSE + ("deed.de" if lang == "de" else "")
    li = lambda xs: "".join(f"<li>{E(x)}</li>" for x in xs)
    return (f'<h1>{E(t["h1"])}</h1><p style="font-size:1.1em">{E(t["lead"])}</p>'
            f'<h2>{E(t["may"])}</h2><ul>{li(t["may_l"])}</ul>'
            f'<h2>{E(t["how"])}</h2><p>{E(t["how_p"])}</p><pre style="white-space:pre-wrap;overflow:auto;padding:12px;border:1px solid var(--fg)"><code>{E(t["snip"])}</code></pre><p>{E(t["snip_t"])}</p>'
            f'<h2>{E(t["which"])}</h2><ul>{li(t["which_l"])}</ul>'
            f'<h2>{E(t["not"])}</h2><ul>{li(t["not_l"])}</ul>'
            f'<h2>{E(t["more"])}</h2><p>{E(t["more_p"])}<a href="mailto:{t["mail"]}">{t["mail"]}</a>.</p>'
            f'<p><a href="{deed}" rel="license noopener">{E(t["deed"])}</a> · <a href="{LEGAL}" rel="noopener">{E(t["legal"])}</a></p>' + _hub(base, lang))


def build(g):
    """Schreibt beide Seiten (indexierbar, mit Umschalter und hreflang) und traegt sie in die Sitemap ein."""
    BASE, write, page, sitemap, TODAY = g["BASE"], g["write"], g["page"], g["sitemap"], g["TODAY"]
    alts = {"en": url(BASE, "en"), "de": url(BASE, "de")}
    for lg in ("en", "de"):
        t = TXT[lg]; u = alts[lg]
        write(PATH[lg] + "/index.html", page(lg, f'{t["title"]} – M365.FM', t["meta"], u, f'{g["header"](lg, "")}<main class="wrap" style="max-width:46em">{body(lg, BASE)}</main>{g["footer"](lg)}',
                                          alts, [], xdefault=alts["en"], og_type="website", switch=alts, share=False))
        sitemap.append((u, TODAY, alts))
