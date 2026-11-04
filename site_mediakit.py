"""Mediadaten-Seite /media-kit/ (EN) und /de/media-kit/ (DE): Formular Name, Firma, E-Mail -> Worker /api/mediakit
schickt die aktuellen Mediadaten (PDF aus R2, erzeugt von tools/mediakit.py) als Anhang. Kennzahlen-Vorschau aus mediakit/latest.json."""
import html
import json

T = {
    "en": dict(
        title="M365.FM media kit – audience, reach and formats",
        desc="Request the current M365.FM media kit: reach of podcast, YouTube and website, audience, formats and sponsorship options – as a PDF by e-mail.",
        kicker="Media kit", h1="M365.FM media data with current figures",
        lede="Podcast, YouTube, website and community – reach, audience, languages and formats in one PDF. Generated daily from live data (YouTube Analytics, Cloudflare, Bing Webmaster Tools, Spreaker) and sent straight to your inbox.",
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
        lede="Podcast, YouTube, Website und Community – Reichweite, Zielgruppe, Sprachen und Formate in einem PDF. Täglich aus Live-Daten erzeugt (YouTube Analytics, Cloudflare, Bing Webmaster Tools, Spreaker) und direkt in dein Postfach geschickt.",
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
.mk-card label{display:grid;gap:6px;font-size:.82rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--mut)}
.mk-card input[type=text],.mk-card input[type=email]{font:inherit;font-size:1rem;letter-spacing:0;text-transform:none;color:var(--fg);background:var(--bg);border:1px solid var(--bd);padding:11px 12px;border-radius:0}
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
