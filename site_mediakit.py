"""Mediadaten-Seite /media-kit/ (EN) und /de/media-kit/ (DE): Formular Name, Firma, E-Mail -> Worker /api/mediakit
schickt die aktuellen Mediadaten (PDF aus R2, erzeugt von tools/mediakit.py) als Anhang. Kennzahlen-Vorschau aus mediakit/latest.json."""
import html
import json
from pathlib import Path

T = {
    "en": dict(
        title="M365.FM media kit – audience, reach and formats",
        desc="Request the current M365.FM media kit: reach of podcast, YouTube and website, audience, formats and sponsorship options – as a PDF by e-mail.",
        kicker="Media kit", h1="M365.FM media data with current figures",
        lede="Podcast, YouTube, website and community – reach, audience, languages and formats in one PDF. Updated monthly from live data (YouTube Analytics, Cloudflare, Bing Webmaster Tools, Spreaker) and sent straight to your inbox.",
        form="Get the media kit", name="Name", company="Company", email="Work e-mail",
        consent="I agree that M365.FM uses my details to send me the media kit and may contact me once about it. No newsletter.",
        send="Send me the media kit", sending="Sending …", ok="Done – the media kit is on its way to {email}. Please also check your spam folder.",
        err={"name": "Please enter your name.", "company": "Please enter your company.", "email": "Please enter a valid e-mail address.", "consent": "Please confirm the consent.",
             "rate_limit": "Too many requests – please try again tomorrow.", "default": "Sending failed. Please try again later or write to mirko.peters@m365.fm."},
        inside="What's inside", items=["Reach per channel with source and period", "Audience: who listens, watches and reads", "Channels and formats: podcast, video, articles, community, events", "Sponsorship and partnership options (always labelled)", "Contact for interviews, sponsorships and projects"],
        privacy="Privacy", privacy_t="We store name, company and e-mail to send the PDF and to answer follow-up questions. Details: ", privacy_l="privacy policy",
        also="Also interesting", sponsor="Sponsorship packages", publishers="For journalists, editors and PR", services="All services",
    ),
    "de": dict(
        title="M365.FM-Mediadaten – Zielgruppe, Reichweite und Formate",
        desc="Aktuelle M365.FM-Mediadaten anfordern: Reichweite von Podcast, YouTube und Website, Zielgruppe, Formate und Sponsoring – als PDF per E-Mail.",
        kicker="Mediadaten", h1="M365.FM-Mediadaten mit aktuellen Zahlen",
        lede="Podcast, YouTube, Website und Community – Reichweite, Zielgruppe, Sprachen und Formate in einem PDF. Monatlich aus Live-Daten aktualisiert (YouTube Analytics, Cloudflare, Bing Webmaster Tools, Spreaker) und direkt in dein Postfach geschickt.",
        form="Mediadaten anfordern", name="Name", company="Firma", email="Geschäftliche E-Mail",
        consent="Ich bin einverstanden, dass M365.FM meine Angaben nutzt, um mir die Mediadaten zu schicken, und mich einmalig dazu kontaktieren darf. Kein Newsletter.",
        send="Mediadaten zuschicken", sending="Wird gesendet …", ok="Erledigt – die Mediadaten sind unterwegs an {email}. Schau bitte auch im Spam-Ordner nach.",
        err={"name": "Bitte gib deinen Namen ein.", "company": "Bitte gib deine Firma ein.", "email": "Bitte gib eine gültige E-Mail-Adresse ein.", "consent": "Bitte bestätige die Einwilligung.",
             "rate_limit": "Zu viele Anfragen – bitte morgen erneut versuchen.", "default": "Senden fehlgeschlagen. Bitte später erneut versuchen oder an mirko.peters@m365.fm schreiben."},
        inside="Das steckt drin", items=["Reichweite je Kanal mit Quelle und Zeitraum", "Zielgruppe: wer zuhört, zuschaut und liest", "Kanäle und Formate: Podcast, Video, Artikel, Community, Events", "Sponsoring- und Partnerschaftsmöglichkeiten (immer gekennzeichnet)", "Kontakt für Interviews, Sponsorings und Projekte"],
        privacy="Datenschutz", privacy_t="Wir speichern Name, Firma und E-Mail, um das PDF zu senden und Rückfragen zu beantworten. Details: ", privacy_l="Datenschutzerklärung",
        also="Auch interessant", sponsor="Sponsoring-Pakete", publishers="Für Journalisten, Redaktionen und PR", services="Alle Services",
    ),
}

CSS = """<style>
.mk-grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:28px;align-items:start;margin:28px 0}
@media(max-width:820px){.mk-grid{grid-template-columns:1fr}}
.mk-card{background:var(--card);border:1px solid var(--bd);padding:22px;display:grid;gap:14px}
.mk-card label{display:grid;gap:6px;font-weight:600;line-height:1.35}
.mk-card input[type=text],.mk-card input[type=email]{width:100%}
.mk-card .mk-ck{display:flex;gap:10px;align-items:flex-start;text-transform:none;letter-spacing:0;font-weight:400;font-size:.92rem;color:var(--fg)}
.mk-card .mk-ck input{margin-top:4px;width:18px;height:18px;flex:none}
.mk-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.mk-msg{min-height:1.4em;font-size:.95rem}.mk-msg.ok{color:#2f6b3a}.mk-msg.err{color:#a1361f}
.mk-list{margin:0;padding-left:20px;display:grid;gap:6px}
</style>"""


def build(g):
    base, today, api = g["BASE"], g["TODAY"], g.get("api", "https://api-dub.m365.fm")
    langs = [l for l in ("en", "de") if l == "en" or l in g["LANGS"]]
    alts = {l: f"{base}/{'' if l == 'en' else l + '/'}media-kit/" for l in langs}
    for lang in langs:
        t, e = T[lang], lambda s: html.escape(s, quote=True)
        pre = "" if lang == "en" else f"/{lang}"
        url = alts[lang]
        items = "".join(f"<li>{e(i)}</li>" for i in t["items"])
        cfg = json.dumps({"api": api, "lang": lang, "ok": t["ok"], "err": t["err"], "sending": t["sending"], "send": t["send"]}, ensure_ascii=False).replace("</", "<\\/")
        body = (f'{g["header"](lang, "")}<main class="wrap">{CSS}<div class="hero"><div class="kicker">{e(t["kicker"])}</div>'
                f'<h1>{e(t["h1"])}</h1><p class="lede">{e(t["lede"])}</p></div>'
                f'<div class="mk-grid">'
                f'<form class="mk-card" id="mk-form" novalidate><h2 style="margin:0">{e(t["form"])}</h2>'
                f'<label>{e(t["name"])}<input type="text" name="name" autocomplete="name" required maxlength="80"></label>'
                f'<label>{e(t["company"])}<input type="text" name="company" autocomplete="organization" required maxlength="120"></label>'
                f'<label>{e(t["email"])}<input type="email" name="email" autocomplete="email" required maxlength="254"></label>'
                f'<div class="mk-hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>'
                f'<label class="mk-ck"><input type="checkbox" name="consent" required><span>{e(t["consent"])}</span></label>'
                f'<button class="btn main" type="submit">{e(t["send"])}</button><p class="mk-msg" role="status" aria-live="polite"></p></form>'
                f'<div class="mk-card"><h2 style="margin:0">{e(t["inside"])}</h2><ul class="mk-list">{items}</ul>'
                f'<h3 style="margin:8px 0 0">{e(t["privacy"])}</h3><p style="margin:0">{e(t["privacy_t"])}<a href="{base}/{"datenschutz" if lang == "de" else "privacy"}/">{e(t["privacy_l"])}</a></p>'
                f'<h3 style="margin:8px 0 0">{e(t["also"])}</h3><p style="margin:0"><a href="{base}{pre}/sponsor/">{e(t["sponsor"])}</a> · '
                f'<a href="{base}{pre}/for/publishers/">{e(t["publishers"])}</a> · <a href="{base}{pre}/services/">{e(t["services"])}</a></p></div>'
                f'</div></main><script>window.M365MK={cfg}</script><script defer src="{base}/assets/mediakit.js"></script>{g["footer"](lang)}')
        ld = [{"@context": "https://schema.org", "@type": "WebPage", "@id": url + "#page", "url": url, "name": t["h1"], "description": t["desc"],
               "inLanguage": lang, "dateModified": today, "isPartOf": {"@id": f"{base}/#website"}}]
        g["write"](f"{'' if lang == 'en' else lang + '/'}media-kit/index.html",
                   g["page"](lang, t["title"], t["desc"], url, body, alts, ld, xdefault=alts["en"], og_type="website", share=False))
        g["sitemap"].append((url, today, alts))


# ---------------------------------------------------------------- M365Con (#260): /m365con/sponsor/ + Einbettung fuer HeySummit
# Gleiche Formular-Logik (assets/mediakit.js) mit brand=m365con; Kennzahlen-Vorschau aus GET /api/mediakit/summary?brand=m365con
# (latest.json des Workflows). Keine Preise: Sponsoring auf Anfrage. Farben aus data/m365con_theme.json (ein Theme fuer PDF, Seite, Einbettung).
_ROOT = Path(__file__).resolve().parent
CON_MAIL = "mirko.peters@m365.fm"
TC = {
    "en": dict(
        title="M365Con sponsor & media data – reach, audience, partners",
        desc="Request the current M365Con sponsor and media data: registrations, sessions and speakers per edition, live streams and recaps, search visibility – as a PDF by e-mail. Sponsoring on request.",
        kicker="M365Con · Sponsoring", h1="Sponsor & media data of M365Con",
        lede="The Microsoft 365 Community Convention: free, online, by and for the community. Request the current figures as a PDF – updated monthly from HeySummit, YouTube Analytics, Google Search Console, Bing Webmaster Tools and LinkedIn page analytics.",
        kpis="Current figures", asof="Figures as of {date} · details, sources and periods in the PDF",
        form="Get the sponsor & media data", name="Name", company="Company", email="Work e-mail",
        consent="I agree that M365.FM / M365Con uses my details to send me the sponsor and media data and may contact me once about it. No newsletter.",
        send="Send me the PDF", sending="Sending …", ok="Done – the sponsor and media data are on their way to {email}. Please also check your spam folder.",
        err={"name": "Please enter your name.", "company": "Please enter your company.", "email": "Please enter a valid e-mail address.", "consent": "Please confirm the consent.",
             "rate_limit": "Too many requests – please try again tomorrow.", "default": "Sending failed. Please try again later or write to mirko.peters@m365.fm."},
        inside="What's inside", items=["Editions: sessions, speakers and registrations per edition", "Live streams and recaps on YouTube and LinkedIn",
                                       "Search visibility of m365con.net (Google and Bing)", "Topics, session formats and partners of past editions",
                                       "Every figure with source and period – nothing estimated"],
        req_h="Sponsoring on request", req_t="Partnerships are put together individually for each edition. Write to us – we will get back to you with options and dates.",
        req_l="Write to Mirko Peters",
        privacy="Privacy", privacy_t="We store name, company and e-mail to send the PDF and to answer follow-up questions. Details: ", privacy_l="privacy policy",
        also="Also interesting", con="M365Con on m365con.net", sponsor="M365.FM sponsorship packages (incl. live session)", mediakit="M365.FM media kit",
    ),
    "de": dict(
        title="M365Con-Sponsoring- und Mediadaten – Reichweite, Zielgruppe, Partner",
        desc="Aktuelle Sponsoring- und Mediadaten der M365Con anfordern: Anmeldungen, Sessions und Speaker je Ausgabe, Livestreams und Recaps, Sichtbarkeit in der Suche – als PDF per E-Mail. Sponsoring auf Anfrage.",
        kicker="M365Con · Sponsoring", h1="Sponsoring- und Mediadaten der M365Con",
        lede="Die Microsoft 365 Community Convention: kostenlos, online, von und für die Community. Fordere die aktuellen Zahlen als PDF an – monatlich aktualisiert aus HeySummit, YouTube Analytics, Google Search Console, Bing Webmaster Tools und der LinkedIn-Seitenanalyse.",
        kpis="Aktuelle Zahlen", asof="Stand der Zahlen {date} · Details, Quellen und Zeiträume im PDF",
        form="Sponsoring- und Mediadaten anfordern", name="Name", company="Firma", email="Geschäftliche E-Mail",
        consent="Ich bin einverstanden, dass M365.FM / M365Con meine Angaben nutzt, um mir die Sponsoring- und Mediadaten zu schicken, und mich einmalig dazu kontaktieren darf. Kein Newsletter.",
        send="PDF zuschicken", sending="Wird gesendet …", ok="Erledigt – die Sponsoring- und Mediadaten sind unterwegs an {email}. Schau bitte auch im Spam-Ordner nach.",
        err={"name": "Bitte gib deinen Namen ein.", "company": "Bitte gib deine Firma ein.", "email": "Bitte gib eine gültige E-Mail-Adresse ein.", "consent": "Bitte bestätige die Einwilligung.",
             "rate_limit": "Zu viele Anfragen – bitte morgen erneut versuchen.", "default": "Senden fehlgeschlagen. Bitte später erneut versuchen oder an mirko.peters@m365.fm schreiben."},
        inside="Das steckt drin", items=["Ausgaben: Sessions, Speaker und Anmeldungen je Ausgabe", "Livestreams und Recaps auf YouTube und LinkedIn",
                                         "Sichtbarkeit von m365con.net in der Suche (Google und Bing)", "Themen, Session-Formate und Partner bisheriger Ausgaben",
                                         "Jede Zahl mit Quelle und Zeitraum – nichts geschätzt"],
        req_h="Sponsoring auf Anfrage", req_t="Partnerschaften stellen wir für jede Ausgabe individuell zusammen. Schreib uns – wir melden uns mit Möglichkeiten und Terminen.",
        req_l="Mirko Peters schreiben",
        privacy="Datenschutz", privacy_t="Wir speichern Name, Firma und E-Mail, um das PDF zu senden und Rückfragen zu beantworten. Details: ", privacy_l="Datenschutzerklärung",
        also="Auch interessant", con="M365Con auf m365con.net", sponsor="M365.FM-Sponsoring-Pakete (inkl. Livesession)", mediakit="M365.FM-Mediadaten",
    ),
}


def con_theme():
    d = json.loads((_ROOT / "data" / "m365con_theme.json").read_text("utf-8"))
    return {k: v for k, v in d.items() if not k.startswith("_")}


def con_css(s):
    """Eigenes Farbschema (unabhaengig vom hellen/dunklen Seitenthema); s: Wurzelklasse, damit die Einbettung HeySummit nicht beeinflusst."""
    T = con_theme()
    rules = [
        f"{s}{{--mc-night:{T['night']};--mc-night2:{T['night2']};--mc-ac:{T['accent']};--mc-ac2:{T['accent2']};--mc-hot:{T['hot']};--mc-ink:{T['ink']};--mc-line:{T['line']};"
        "background:var(--mc-night);color:#fff;padding:clamp(20px,4vw,44px);border-radius:10px;font-family:Poppins,'Segoe UI',system-ui,-apple-system,sans-serif;line-height:1.55;box-sizing:border-box}",
        f"{s} *{{box-sizing:border-box}}", f"{s} a{{color:var(--mc-ac2)}}", f"{s} h1,{s} h2,{s} h3{{color:#fff;margin:0;line-height:1.15}}", f"{s} p{{margin:0}}",
        f"{s} .mc-k{{color:var(--mc-ac2);font-weight:600;letter-spacing:.12em;text-transform:uppercase;font-size:.8rem;margin:0 0 10px}}",
        f"{s} .mc-h{{font-size:clamp(1.8rem,4.2vw,3rem);margin:0 0 .35em}}", f"{s} .mc-lede{{color:#d6eef5;max-width:46em}}",
        f"{s} .mc-kpis{{margin:26px 0 0}}", f"{s} .mc-kpis h2{{font-size:1rem;color:var(--mc-ac2);text-transform:uppercase;letter-spacing:.1em}}",
        f"{s} .mk-kgrid{{list-style:none;margin:12px 0 6px;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}}",
        f"{s} .mk-kpi{{background:var(--mc-night2);border-radius:8px;padding:14px;display:grid;gap:2px}}",
        f"{s} .mk-kv{{color:var(--mc-hot);font-size:1.6rem;font-weight:700;line-height:1.1}}", f"{s} .mk-kl{{font-weight:600;font-size:.9rem}}",
        f"{s} .mk-ks,{s} .mk-asof{{color:var(--mc-ac2);font-size:.75rem}}",
        f"{s} .mc-grid{{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:22px;align-items:start;margin:28px 0 0}}",
        f"@media(max-width:820px){{{s} .mc-grid{{grid-template-columns:1fr}}}}",
        f"{s} .mc-card{{background:var(--mc-night2);border-radius:10px;padding:22px;display:grid;gap:14px;min-width:0}}",
        f"{s} .mc-card label{{display:grid;gap:6px;font-size:.78rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--mc-ac2)}}",
        f"{s} .mc-card input[type=text],{s} .mc-card input[type=email]{{font:inherit;font-size:1rem;letter-spacing:0;text-transform:none;color:var(--mc-ink);background:#fff;"
        "border:1px solid var(--mc-line);padding:11px 12px;border-radius:6px;width:100%}",
        f"{s} .mc-card .mk-ck{{display:flex;gap:10px;align-items:flex-start;text-transform:none;letter-spacing:0;font-weight:400;font-size:.9rem;color:#fff}}",
        f"{s} .mc-card .mk-ck input{{margin-top:4px;width:18px;height:18px;flex:none}}",
        f"{s} .mk-hp{{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}}",
        f"{s} .mc-btn{{font:inherit;font-weight:700;background:var(--mc-hot);color:var(--mc-night);border:0;border-radius:6px;padding:12px 18px;cursor:pointer;justify-self:start}}",
        f"{s} .mc-btn:disabled{{opacity:.6}}", f"{s} .mc-btn:focus-visible,{s} input:focus-visible,{s} a:focus-visible{{outline:3px solid var(--mc-ac2);outline-offset:2px}}",
        f"{s} .mk-msg{{min-height:1.4em;font-size:.95rem}}", f"{s} .mk-msg.ok{{color:#8ef0b0}}", f"{s} .mk-msg.err{{color:#ffb4a8}}",
        f"{s} .mc-list{{margin:0;padding-left:20px;display:grid;gap:6px}}", f"{s} .mc-req{{border-left:4px solid var(--mc-hot);padding:4px 0 4px 14px;display:grid;gap:6px}}",
        f"{s} .mc-req h3{{color:var(--mc-hot)}}", f"{s} [hidden]{{display:none!important}}",
    ]
    return "<style>" + "".join(rules) + "</style>"


def con_markup(lang, base, h="h1"):
    """Inhalt der Con-Seite (ohne Skript): Kopf, Kennzahlen-Platzhalter (#mk-kpis), Formular (#mk-form), Inhalt, Sponsoring auf Anfrage."""
    t, e = TC[lang], lambda s: html.escape(s, quote=True)
    pre = "" if lang == "en" else f"/{lang}"
    items = "".join(f"<li>{e(i)}</li>" for i in t["items"])
    mail = f'<a href="mailto:{CON_MAIL}?subject=M365Con%20Sponsoring">{e(t["req_l"])}: {CON_MAIL}</a>'
    return (f'<p class="mc-k">{e(t["kicker"])}</p><{h} class="mc-h">{e(t["h1"])}</{h}><p class="mc-lede">{e(t["lede"])}</p>'
            f'<section class="mc-kpis" id="mk-kpis" hidden aria-label="{e(t["kpis"])}"><h2>{e(t["kpis"])}</h2><ul class="mk-kgrid"></ul>'
            f'<p class="mk-asof">{e(t["asof"])}</p></section>'
            f'<div class="mc-grid">'
            f'<form class="mc-card" id="mk-form" novalidate><h2>{e(t["form"])}</h2>'
            f'<label>{e(t["name"])}<input type="text" name="name" autocomplete="name" required maxlength="80"></label>'
            f'<label>{e(t["company"])}<input type="text" name="company" autocomplete="organization" required maxlength="120"></label>'
            f'<label>{e(t["email"])}<input type="email" name="email" autocomplete="email" required maxlength="254"></label>'
            f'<div class="mk-hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>'
            f'<label class="mk-ck"><input type="checkbox" name="consent" required><span>{e(t["consent"])}</span></label>'
            f'<button class="mc-btn" type="submit">{e(t["send"])}</button><p class="mk-msg" role="status" aria-live="polite"></p></form>'
            f'<div class="mc-card"><h2>{e(t["inside"])}</h2><ul class="mc-list">{items}</ul>'
            f'<div class="mc-req"><h3>{e(t["req_h"])}</h3><p>{e(t["req_t"])}</p><p>{mail}</p></div>'
            f'<h3>{e(t["privacy"])}</h3><p>{e(t["privacy_t"])}<a href="{base}/{"datenschutz" if lang == "de" else "privacy"}/">{e(t["privacy_l"])}</a></p>'
            f'<h3>{e(t["also"])}</h3><p><a href="https://{"de." if lang == "de" else ""}m365con.net">{e(t["con"])}</a> · '
            f'<a href="{base}{pre}/sponsor/">{e(t["sponsor"])}</a> · <a href="{base}{pre}/media-kit/">{e(t["mediakit"])}</a></p></div>'
            f'</div>')


def con_cfg(lang, api, source):
    t = TC[lang]
    return json.dumps({"api": api, "lang": lang, "brand": "m365con", "kpis": True, "source": source, "ok": t["ok"], "err": t["err"],
                       "sending": t["sending"], "send": t["send"]}, ensure_ascii=False).replace("</", "<\\/")


def build_con(g):
    """/m365con/sponsor/ (EN) und /de/m365con/sponsor/ (DE) im M365Con-Look (Kopf und Fuss der Website bleiben)."""
    base, today, api = g["BASE"], g["TODAY"], g.get("api", "https://api-dub.m365.fm")
    langs = [l for l in ("en", "de") if l == "en" or l in g["LANGS"]]
    alts = {l: f"{base}/{'' if l == 'en' else l + '/'}m365con/sponsor/" for l in langs}
    for lang in langs:
        t, url = TC[lang], alts[lang]
        body = (f'{g["header"](lang, "")}<main class="wrap">{con_css(".mc")}<div class="mc">{con_markup(lang, base)}</div></main>'
                f'<script>window.M365MK={con_cfg(lang, api, "/" + ("" if lang == "en" else lang + "/") + "m365con/sponsor/")}</script>'
                f'<script defer src="{base}/assets/mediakit.js"></script>{g["footer"](lang)}')
        ld = [{"@context": "https://schema.org", "@type": "WebPage", "@id": url + "#page", "url": url, "name": t["h1"], "description": t["desc"],
               "inLanguage": lang, "dateModified": today, "isPartOf": {"@id": f"{base}/#website"}}]
        g["write"](f"{'' if lang == 'en' else lang + '/'}m365con/sponsor/index.html",
                   g["page"](lang, t["title"], t["desc"], url, body, alts, ld, xdefault=alts["en"], og_type="website", share=False))
        g["sitemap"].append((url, today, alts))


def embed_html(lang, api="https://api-dub.m365.fm", base="https://www.m365.fm"):
    """Eigenstaendiges HTML fuer einen HTML-Block im HeySummit-Pagebuilder (m365con.net / de.m365con.net): Stil nur unter .m365con-mk,
    Skript = assets/mediakit.js inline (eine Quelle), Formular an api-dub.m365.fm/api/mediakit mit brand=m365con. Keine fremden Hosts."""
    js = (_ROOT / "assets" / "mediakit.js").read_text("utf-8")
    src = "heysummit:" + ("de." if lang == "de" else "") + "m365con.net"
    return (f'<!-- M365Con: Sponsoring- und Mediadaten ({lang.upper()}). Erzeugt mit "python3 site_mediakit.py --embed" (site_mediakit.py), nicht von Hand aendern. -->\n'
            f'<div class="m365con-mk" lang="{lang}">{con_css(".m365con-mk")}{con_markup(lang, base, h="h2")}</div>\n'
            f'<script>window.M365MK={con_cfg(lang, api, src)}</script>\n<script>\n{js}</script>\n')


EMBED_DIR = _ROOT / "design" / "m365con"   # nicht docs/ (Ausgabe des Seitenbaus, in .gitignore)


def write_embeds():
    EMBED_DIR.mkdir(parents=True, exist_ok=True)
    for lang in ("en", "de"):
        (EMBED_DIR / f"sponsor-embed-{lang}.html").write_text(embed_html(lang), "utf-8")
        print("geschrieben:", EMBED_DIR / f"sponsor-embed-{lang}.html")


if __name__ == "__main__":
    import sys
    if "--embed" in sys.argv: write_embeds()
