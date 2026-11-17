"""Hardware-Sponsoring: /hardware/ (Bewerbung, Angebote, Regeln) und /hardware/how-we-test/ (Bewertungsbogen), je Englisch und Deutsch.
Hersteller bieten Geraete fuer einen unabhaengigen Test an: Test und Veroeffentlichung sind kostenlos; Gewinnspiel (Preise ab 1.000 USD vom Hersteller,
Organisation kostenlos), Video (1.000 USD), Podcast-Folge (500 USD) und beides (1.250 USD) sind gekennzeichnete Zusatzleistungen.
Formular -> Worker /api/hardware (worker/src/hardware.js, D1 hardware_requests, Admin-Reiter Hardware-Anfragen). Fusszeilen-Links: footer_links().
Gewinnspiel: laeuft komplett ueber das Promo-Tool von Mirko; Teilnehmerdaten gehen nur an den Sponsor, wenn die Person aktiv zustimmt (DSGVO)."""
import html
import json

PRICES = {"video": 1000, "podcast": 500, "both": 1250, "giveaway_min": 1000}
TEST_DAYS = 3        # mindestens so viele Tage im Alltag testen
PUBLISH_WEEKS = 2    # Veroeffentlichung spaetestens so viele Wochen nach Eingang des Geraets
FACT_DAYS = 3        # Werktage fuer die Faktenpruefung durch den Hersteller (nur Fakten, nie Wertung)
CRITERIA = (("setup", 20), ("core", 30), ("manage", 20), ("security", 15), ("daily", 10), ("value", 5))   # Gewichte in Prozent, Summe 100
CATEGORIES = ("headset", "speaker", "mic", "camera", "rooms", "board", "pc", "thin", "tablet", "peripheral", "dock", "monitor", "printer", "network", "storage", "wearable", "xr", "key", "other")

T = {
    "en": dict(
        title="Hardware Sponsorship & Product Reviews for Microsoft 365 | M365.FM",
        desc="Send your Microsoft 365-ready hardware for an independent review on M365.FM. Optional: a giveaway with full tracking and participant data, plus a sponsored video and podcast episode.",
        kicker="Hardware sponsorship", h1="Put your hardware in front of Microsoft 365 professionals",
        lede="Send us devices that work with Microsoft Teams, Copilot and Microsoft 365. We test them honestly and publish the review for free. If you want more reach, we turn the test into a giveaway that brings you real leads.",
        reach="Current reach figures with source and period are in our", reach_l="media kit",
        apply="Send us your product", how_we="How we test",
        ways_h="Five ways to work with us",
        ways=[("Independent review", "Free", "You send the device, we test it with a fixed scorecard and publish the review with a product page and a company page."),
              ("Giveaway", "Free to organise", "You provide prizes worth at least 1,000 USD. We run the whole campaign for you."),
              ("Sponsored video", "1,000 USD", "A video about your product, clearly labeled as sponsored."),
              ("Sponsored podcast episode", "500 USD", "A dedicated episode, clearly labeled as sponsored."),
              ("Video and podcast episode", "1,250 USD", "Both formats together.")],
        steps_h="How it works",
        steps=[("Apply.", "Tell us the product and confirm that you will ship it."),
               ("We confirm.", "You get a clear yes or no with a delivery date."),
               ("We test.", "The device goes through the same scorecard as every other product, for at least 3 days of real use."),
               ("We publish.", "The review goes live within 2 weeks of delivery.")],
        give_h="The giveaway, step by step",
        give=["The whole giveaway runs through our promotion tool. Every action is tracked.",
              "People enter by sharing our LinkedIn post, following the M365 Show page and visiting your sponsor page through a tracked link.",
              "You receive the participant data of everyone who agreed to share it with you.",
              "We handle the rules, the draw and the winner announcement. You ship the prizes.",
              "You see the results in a report: entries, clicks, new followers and leads."],
        rules_h="Our rules",
        rules=["The review is not for sale. You cannot buy a score or influence the verdict. A bad result is published too.",
               "Paid content (video, podcast, giveaway) is labeled Sponsored. Devices supplied by the manufacturer are labeled “Test device provided by the manufacturer”.",
               "We promise an honest test. We do not promise a good review."],
        what_h="What we test",
        what="Teams headsets, speakers and microphones, webcams, Teams Rooms devices and interactive displays, Copilot+ PCs, laptops, thin clients, tablets, docking stations, monitors, mice and keyboards, printers, network devices, storage, wearables, VR and AR headsets, security keys and other devices that work with Microsoft 365.",
        faq_h="Questions",
        faq=[("Do we pay for the review?", "No. The independent review is free."),
             ("Can we see the review before it goes live?", "You can check the facts (specifications, price, features) before publication. We send them to you and you have 3 business days to correct errors. Scores and verdict are not shared in advance and cannot be changed."),
             ("Do we get the device back?", "No. Test devices stay with us. We label every such review “Test device provided by the manufacturer”."),
             ("How fast is the review online?", "Within 2 weeks of delivery."),
             ("What happens with the participant data of a giveaway?", "Only people who explicitly agree to share their data with the sponsor are passed on, in line with data protection law.")],
        form_h="Apply with your product", name="Name", company="Company", email="Work e-mail", product="Product name", product_url="Link to the product page (https://…)",
        category="Category", cats=dict(headset="Headset or speakerphone", speaker="Speaker or soundbar", mic="Microphone", camera="Webcam or camera", rooms="Teams Rooms device", board="Interactive display or whiteboard", pc="PC or laptop (e.g. Copilot+ PC)", thin="Thin client or mini PC", tablet="Tablet or phone", peripheral="Mouse or keyboard", dock="Docking station", monitor="Monitor", printer="Printer or scanner", network="Router, Wi-Fi or network device", storage="Storage or backup device", wearable="Wearable or smartwatch", xr="VR or AR headset", key="Security key", other="Other"),
        quantity="Number of devices", ship_by="Ready to ship by (date)", offers="I am also interested in (optional)", offs=dict(giveaway="Giveaway", video="Sponsored video", podcast="Sponsored podcast episode"),
        message="Anything we should know? (certifications, firmware, test conditions)",
        ships="If M365.FM accepts, we will ship the device free of charge. The device stays with M365.FM. I understand this does not buy a score or a positive verdict.",
        consent="I agree that M365.FM uses my details to answer this application and may contact me about it. No newsletter.",
        send="Send application", sending="Sending …", ok="Thank you – your application is in. We will get back to you at {email}. Please also check your spam folder.",
        err={"name": "Please enter your name.", "company": "Please enter your company.", "email": "Please enter a valid e-mail address.", "product": "Please enter the product name.",
             "product_url": "Please enter a link starting with https://.", "ships": "Please confirm that you will ship the device.", "consent": "Please confirm the consent.",
             "rate_limit": "Too many requests – please try again tomorrow.", "default": "Sending failed. Please try again later or write to mirko.peters@m365.fm."},
        privacy="Privacy", privacy_t="We store your details to answer the application. Details: ", privacy_l="privacy policy",
        also="Also interesting", sponsor="Sponsorship packages", mediakit="Media kit",
        crumb="Hardware",
        # Bewertungsbogen
        t_title="How We Test Microsoft 365 Hardware: Our Scorecard | M365.FM",
        t_desc="How M365.FM tests Microsoft 365 hardware: fixed scorecard with weighted criteria, real-use testing, independence rules and labels for sponsored content and test devices.",
        t_kicker="Hardware sponsorship", t_h1="How we test Microsoft 365 hardware",
        t_lede="Every device is rated with the same scorecard, whether the manufacturer sent it for free or sponsors a video. Here is what we look at.",
        t_score_h="The scorecard", t_score_p="Each criterion is rated from 1 to 5. The overall score is the weighted average.",
        crit=dict(setup=("Setup and Microsoft 365 compatibility", "How fast does the device work with Teams, Entra ID and Windows? Does it need extra software?"),
                  core=("Core quality", "The main job of the device, tested with real use: sound and microphone for headsets, image in low light for cameras, speed and battery for laptops."),
                  manage=("IT manageability", "Management in Intune and the Teams admin center, firmware updates, rollout effort."),
                  security=("Security and privacy", "Update policy, hardware protection, privacy switches and settings."),
                  daily=("Everyday use", "Comfort, build quality, ease of use over several days."),
                  value=("Value", "Price compared with devices of the same class.")),
        weight="Weight",
        how_h="How we test", how=["We use each device for at least 3 days in real Teams meetings and day-to-day work.", "We write down what we measured and what we only observed.", "Problems are reported as they are, with the firmware or software version we used."],
        contains_h="What every review contains", contains="Scorecard and verdict, pros and cons, test setup, a product page and a company page on M365.FM, and the label that tells you where the device came from.",
        indep_h="Independence",
        indep=["A review cannot be bought. Manufacturers get no say in scores or verdict.", "Manufacturers may correct facts before publication.",
               "Paid content (video, podcast, giveaway) is labeled Sponsored. Test devices are labeled “Test device provided by the manufacturer”.",
               "If a manufacturer updates a product or fixes a problem, we update the review and note the change."],
        t_cta="Send us your product", back="Hardware sponsorship",
    ),
    "de": dict(
        title="Hardware-Sponsoring & Produkttests für Microsoft 365 | M365.FM",
        desc="Schick deine Microsoft-365-taugliche Hardware zum unabhängigen Test an M365.FM. Optional: Gewinnspiel mit vollem Tracking und Teilnehmerdaten, dazu gesponsertes Video und Podcast-Folge.",
        kicker="Hardware-Sponsoring", h1="Bring deine Hardware vor Microsoft-365-Profis",
        lede="Schick uns Geräte, die mit Microsoft Teams, Copilot und Microsoft 365 funktionieren. Wir testen sie ehrlich und veröffentlichen den Test kostenlos. Wenn du mehr Reichweite willst, machen wir aus dem Test ein Gewinnspiel, das dir echte Leads bringt.",
        reach="Aktuelle Reichweite mit Quelle und Zeitraum steht in unseren", reach_l="Mediadaten",
        apply="Produkt einreichen", how_we="So testen wir",
        ways_h="Fünf Wege, mit uns zu arbeiten",
        ways=[("Unabhängiger Test", "Kostenlos", "Du schickst das Gerät, wir testen es mit einem festen Bewertungsbogen und veröffentlichen den Test mit Produkt- und Firmenseite."),
              ("Gewinnspiel", "Organisation kostenlos", "Du stellst Preise im Wert von mindestens 1.000 USD. Wir führen die ganze Aktion für dich durch."),
              ("Gesponsertes Video", "1.000 USD", "Ein Video über dein Produkt, klar als gesponsert gekennzeichnet."),
              ("Gesponserte Podcast-Folge", "500 USD", "Eine eigene Folge, klar als gesponsert gekennzeichnet."),
              ("Video und Podcast-Folge", "1.250 USD", "Beide Formate zusammen.")],
        steps_h="So läuft es ab",
        steps=[("Bewerben.", "Nenne uns das Produkt und bestätige, dass du es verschickst."),
               ("Wir bestätigen.", "Du bekommst eine klare Zu- oder Absage mit Liefertermin."),
               ("Wir testen.", "Das Gerät durchläuft denselben Bewertungsbogen wie jedes andere Produkt, mindestens 3 Tage im echten Einsatz."),
               ("Wir veröffentlichen.", "Der Test geht innerhalb von 2 Wochen nach Lieferung online.")],
        give_h="Das Gewinnspiel Schritt für Schritt",
        give=["Das ganze Gewinnspiel läuft über unser Promotion-Tool. Jede Aktion wird getrackt.",
              "Teilnehmen kann man, indem man unseren LinkedIn-Beitrag teilt, der M365-Show-Seite folgt und deine Sponsorseite über einen getrackten Link besucht.",
              "Du bekommst die Teilnehmerdaten aller, die der Weitergabe an dich zugestimmt haben.",
              "Wir kümmern uns um Teilnahmebedingungen, Ziehung und Gewinnerbenachrichtigung. Du versendest die Preise.",
              "Die Ergebnisse siehst du in einem Bericht: Teilnahmen, Klicks, neue Follower und Leads."],
        rules_h="Unsere Regeln",
        rules=["Der Test ist nicht käuflich. Du kannst weder eine Wertung kaufen noch das Urteil beeinflussen. Auch ein schlechtes Ergebnis wird veröffentlicht.",
               "Bezahlte Inhalte (Video, Podcast, Gewinnspiel) sind als Anzeige gekennzeichnet. Vom Hersteller gestellte Geräte tragen den Hinweis „Testgerät vom Hersteller bereitgestellt“.",
               "Wir versprechen einen ehrlichen Test. Wir versprechen keinen guten Test."],
        what_h="Was wir testen",
        what="Teams-Headsets, Lautsprecher und Mikrofone, Webcams, Teams-Rooms-Geräte und interaktive Displays, Copilot+ PCs, Laptops, Thin Clients, Tablets, Dockingstationen, Monitore, Mäuse und Tastaturen, Drucker, Netzwerkgeräte, Speicher, Wearables, VR- und AR-Brillen, Security-Keys und andere Geräte, die mit Microsoft 365 funktionieren.",
        faq_h="Fragen",
        faq=[("Bezahlen wir für den Test?", "Nein. Der unabhängige Test ist kostenlos."),
             ("Können wir den Test vor der Veröffentlichung sehen?", "Du kannst vor der Veröffentlichung die Fakten prüfen (technische Daten, Preis, Funktionen). Wir schicken sie dir, du hast 3 Werktage, um Fehler zu korrigieren. Bewertung und Urteil bekommst du nicht vorab und kannst sie nicht ändern."),
             ("Bekommen wir das Gerät zurück?", "Nein. Testgeräte bleiben bei uns. Jeder solche Test trägt den Hinweis „Testgerät vom Hersteller bereitgestellt“."),
             ("Wie schnell ist der Test online?", "Innerhalb von 2 Wochen nach Lieferung."),
             ("Was passiert mit den Teilnehmerdaten eines Gewinnspiels?", "Nur Personen, die der Weitergabe an den Sponsor ausdrücklich zustimmen, werden weitergegeben, im Einklang mit dem Datenschutzrecht.")],
        form_h="Mit deinem Produkt bewerben", name="Name", company="Firma", email="Geschäftliche E-Mail", product="Produktname", product_url="Link zur Produktseite (https://…)",
        category="Kategorie", cats=dict(headset="Headset oder Freisprecheinrichtung", speaker="Lautsprecher oder Soundbar", mic="Mikrofon", camera="Webcam oder Kamera", rooms="Teams-Rooms-Gerät", board="Interaktives Display oder Whiteboard", pc="PC oder Laptop (z. B. Copilot+ PC)", thin="Thin Client oder Mini-PC", tablet="Tablet oder Smartphone", peripheral="Maus oder Tastatur", dock="Dockingstation", monitor="Monitor", printer="Drucker oder Scanner", network="Router, WLAN oder Netzwerkgerät", storage="Speicher oder Backup-Gerät", wearable="Wearable oder Smartwatch", xr="VR- oder AR-Brille", key="Security-Key", other="Sonstiges"),
        quantity="Anzahl Geräte", ship_by="Versandbereit bis (Datum)", offers="Ich interessiere mich auch für (optional)", offs=dict(giveaway="Gewinnspiel", video="Gesponsertes Video", podcast="Gesponserte Podcast-Folge"),
        message="Was sollten wir wissen? (Zertifizierungen, Firmware, Testbedingungen)",
        ships="Wenn M365.FM annimmt, verschicken wir das Gerät kostenlos. Das Gerät bleibt bei M365.FM. Mir ist klar, dass das weder eine Wertung noch ein positives Urteil kauft.",
        consent="Ich bin einverstanden, dass M365.FM meine Angaben nutzt, um diese Bewerbung zu beantworten, und mich dazu kontaktieren darf. Kein Newsletter.",
        send="Bewerbung abschicken", sending="Wird gesendet …", ok="Danke – deine Bewerbung ist eingegangen. Wir melden uns unter {email}. Schau bitte auch im Spam-Ordner nach.",
        err={"name": "Bitte gib deinen Namen ein.", "company": "Bitte gib deine Firma ein.", "email": "Bitte gib eine gültige E-Mail-Adresse ein.", "product": "Bitte gib den Produktnamen ein.",
             "product_url": "Bitte gib einen Link an, der mit https:// beginnt.", "ships": "Bitte bestätige, dass du das Gerät verschickst.", "consent": "Bitte bestätige die Einwilligung.",
             "rate_limit": "Zu viele Anfragen – bitte morgen erneut versuchen.", "default": "Senden fehlgeschlagen. Bitte später erneut versuchen oder an mirko.peters@m365.fm schreiben."},
        privacy="Datenschutz", privacy_t="Wir speichern deine Angaben, um die Bewerbung zu beantworten. Details: ", privacy_l="Datenschutzerklärung",
        also="Auch interessant", sponsor="Sponsoring-Pakete", mediakit="Mediadaten",
        crumb="Hardware",
        t_title="So testen wir Microsoft-365-Hardware: unser Bewertungsbogen | M365.FM",
        t_desc="So testet M365.FM Microsoft-365-Hardware: fester Bewertungsbogen mit gewichteten Kriterien, Test im echten Einsatz, Unabhängigkeitsregeln und Kennzeichnung von gesponserten Inhalten und Testgeräten.",
        t_kicker="Hardware-Sponsoring", t_h1="So testen wir Microsoft-365-Hardware",
        t_lede="Jedes Gerät wird mit demselben Bewertungsbogen bewertet, egal ob der Hersteller es kostenlos geschickt hat oder ein Video sponsert. Hier steht, worauf wir achten.",
        t_score_h="Der Bewertungsbogen", t_score_p="Jedes Kriterium wird von 1 bis 5 bewertet. Die Gesamtnote ist der gewichtete Durchschnitt.",
        crit=dict(setup=("Einrichtung und Microsoft-365-Kompatibilität", "Wie schnell funktioniert das Gerät mit Teams, Entra ID und Windows? Braucht es zusätzliche Software?"),
                  core=("Kernqualität", "Die Hauptaufgabe des Geräts, getestet im echten Einsatz: Klang und Mikrofon bei Headsets, Bild bei wenig Licht bei Kameras, Tempo und Akku bei Laptops."),
                  manage=("Verwaltbarkeit für die IT", "Verwaltung in Intune und im Teams Admin Center, Firmware-Updates, Aufwand beim Ausrollen."),
                  security=("Sicherheit und Datenschutz", "Update-Politik, Hardware-Schutz, Datenschutzschalter und Einstellungen."),
                  daily=("Alltagstauglichkeit", "Komfort, Verarbeitung, Bedienbarkeit über mehrere Tage."),
                  value=("Preis-Leistung", "Preis im Vergleich zu Geräten derselben Klasse.")),
        weight="Gewicht",
        how_h="So testen wir", how=["Wir nutzen jedes Gerät mindestens 3 Tage in echten Teams-Meetings und im Arbeitsalltag.", "Wir halten fest, was wir gemessen und was wir nur beobachtet haben.", "Probleme nennen wir, wie sie sind, mit der verwendeten Firmware- oder Softwareversion."],
        contains_h="Was jeder Test enthält", contains="Bewertungsbogen und Urteil, Vor- und Nachteile, Testaufbau, eine Produkt- und eine Firmenseite auf M365.FM und den Hinweis, woher das Gerät stammt.",
        indep_h="Unabhängigkeit",
        indep=["Ein Test ist nicht käuflich. Hersteller haben keinen Einfluss auf Wertung oder Urteil.", "Hersteller dürfen vor der Veröffentlichung Fakten korrigieren.",
               "Bezahlte Inhalte (Video, Podcast, Gewinnspiel) sind als Anzeige gekennzeichnet. Testgeräte tragen den Hinweis „Testgerät vom Hersteller bereitgestellt“.",
               "Wenn ein Hersteller ein Produkt aktualisiert oder ein Problem behebt, aktualisieren wir den Test und vermerken die Änderung."],
        t_cta="Produkt einreichen", back="Hardware-Sponsoring",
    ),
}

FOOT = {"en": ("Hardware reviews", "How we test"), "de": ("Hardware-Tests", "So testen wir")}

CSS = """<style>
.hw-ways{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin:18px 0 6px;padding:0;list-style:none}
.hw-way{background:var(--card);border:1px solid var(--bd);padding:18px;display:grid;gap:6px;align-content:start}
.hw-way b{font-size:1.05rem}.hw-way .hw-pr{font-weight:700;color:var(--ac)}.hw-way p{margin:0}
.hw-sec{margin:34px 0}.hw-sec h2{margin:0 0 10px}.hw-list{margin:0;padding-left:20px;display:grid;gap:6px}
.hw-steps{margin:0;padding:0;list-style:none;display:grid;gap:10px;counter-reset:s}
.hw-steps li{counter-increment:s;background:var(--card);border:1px solid var(--bd);padding:14px 16px}
.hw-steps li:before{content:counter(s);font-weight:700;color:var(--ac);margin-right:10px}
.hw-card{background:var(--card);border:1px solid var(--bd);padding:22px;display:grid;gap:14px;max-width:760px}
.hw-card label{display:grid;gap:6px;font-weight:600;line-height:1.35}
.hw-card input[type=text],.hw-card input[type=email],.hw-card input[type=url],.hw-card input[type=number],.hw-card select,.hw-card textarea{width:100%}
.hw-card .hw-ck{display:flex;gap:10px;align-items:flex-start;font-weight:400;font-size:.92rem}
.hw-card .hw-ck input{margin-top:4px;width:18px;height:18px;flex:none}
.hw-card fieldset{border:0;padding:0;margin:0;display:grid;gap:6px}.hw-card legend{font-weight:600;padding:0;margin-bottom:6px}
.hw-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.hw-msg{min-height:1.4em;font-size:.95rem}.hw-msg.ok{color:#2f6b3a}.hw-msg.err{color:#a1361f}
.hw-tbl{width:100%;border-collapse:collapse;margin:12px 0}.hw-tbl th,.hw-tbl td{border-bottom:1px solid var(--bd);padding:10px 8px;text-align:left;vertical-align:top}
.hw-tbl td:last-child,.hw-tbl th:last-child{text-align:right;white-space:nowrap}
</style>"""


def url(base, lang, how=False):
    return f"{base}/{'' if lang == 'en' else lang + '/'}hardware/" + ("how-we-test/" if how else "")


def footer_links(base, lang):
    """Zwei Fusszeilen-Links (Hardware-Seite, Bewertungsbogen); andere Sprachen als Deutsch zeigen die englische Seite."""
    lg = "de" if lang == "de" else "en"
    a, b = FOOT[lg]
    return f'<a href="{url(base, lg)}">{html.escape(a)}</a><a href="{url(base, lg, True)}">{html.escape(b)}</a>'


def _fmt(n, lang):
    return f"{n:,}".replace(",", ".") if lang == "de" else f"{n:,}"


def build(g):
    base, today, api = g["BASE"], g["TODAY"], g.get("api", "https://api-dub.m365.fm")
    langs = [l for l in ("en", "de") if l == "en" or l in g["LANGS"]]
    e = lambda s: html.escape(s, quote=True)
    for lang in langs:
        t, pre = T[lang], "" if lang == "en" else f"/{lang}"
        u_main, u_how = url(base, lang), url(base, lang, True)
        alts_main = {l: url(base, l) for l in langs}
        alts_how = {l: url(base, l, True) for l in langs}
        ways = "".join(f'<li class="hw-way"><b>{e(n)}</b><span class="hw-pr">{e(p)}</span><p>{e(d)}</p></li>' for n, p, d in t["ways"])
        steps = "".join(f"<li><b>{e(a)}</b> {e(b)}</li>" for a, b in t["steps"])
        lst = lambda items: "".join(f"<li>{e(i)}</li>" for i in items)
        faq = "".join(f"<details><summary><b>{e(q)}</b></summary><p>{e(a)}</p></details>" for q, a in t["faq"])
        cats = "".join(f'<option value="{c}">{e(t["cats"][c])}</option>' for c in CATEGORIES)
        offs = "".join(f'<label class="hw-ck"><input type="checkbox" name="offers" value="{k}"><span>{e(v)}</span></label>' for k, v in t["offs"].items())
        cfg = json.dumps({"api": api, "lang": lang, "ok": t["ok"], "err": t["err"], "sending": t["sending"], "send": t["send"]}, ensure_ascii=False).replace("</", "<\\/")
        form = (f'<form class="hw-card" id="hw-form" novalidate><h2 style="margin:0">{e(t["form_h"])}</h2>'
                f'<label>{e(t["name"])}<input type="text" name="name" autocomplete="name" required maxlength="80"></label>'
                f'<label>{e(t["company"])}<input type="text" name="company" autocomplete="organization" required maxlength="120"></label>'
                f'<label>{e(t["email"])}<input type="email" name="email" autocomplete="email" required maxlength="254"></label>'
                f'<label>{e(t["product"])}<input type="text" name="product" required maxlength="140"></label>'
                f'<label>{e(t["product_url"])}<input type="url" name="product_url" required maxlength="300" placeholder="https://"></label>'
                f'<label>{e(t["category"])}<select name="category">{cats}</select></label>'
                f'<label>{e(t["quantity"])}<input type="number" name="quantity" min="1" max="50" value="1"></label>'
                f'<label>{e(t["ship_by"])}<input type="text" name="ship_by" maxlength="40" placeholder="2026-12-15"></label>'
                f'<fieldset><legend>{e(t["offers"])}</legend>{offs}</fieldset>'
                f'<label>{e(t["message"])}<textarea name="message" rows="4" maxlength="1000"></textarea></label>'
                f'<div class="hw-hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>'
                f'<label class="hw-ck"><input type="checkbox" name="ships" required><span>{e(t["ships"])}</span></label>'
                f'<label class="hw-ck"><input type="checkbox" name="consent" required><span>{e(t["consent"])}</span></label>'
                f'<button class="btn main" type="submit">{e(t["send"])}</button><p class="hw-msg" role="status" aria-live="polite"></p>'
                f'<p style="margin:0;font-size:.9rem"><b>{e(t["privacy"])}:</b> {e(t["privacy_t"])}<a href="{base}/{"datenschutz" if lang == "de" else "privacy"}/">{e(t["privacy_l"])}</a></p></form>')
        body = (f'{g["header"](lang, "")}<main class="wrap">{CSS}<div class="hero"><div class="kicker">{e(t["kicker"])}</div><h1>{e(t["h1"])}</h1><p class="lede">{e(t["lede"])}</p>'
                f'<p>{e(t["reach"])} <a href="{base}{pre}/media-kit/">{e(t["reach_l"])}</a>.</p>'
                f'<p><a class="btn main" href="#apply">{e(t["apply"])}</a> <a class="btn" href="{u_how}">{e(t["how_we"])}</a></p></div>'
                f'<section class="hw-sec"><h2>{e(t["ways_h"])}</h2><ul class="hw-ways">{ways}</ul></section>'
                f'<section class="hw-sec"><h2>{e(t["steps_h"])}</h2><ol class="hw-steps">{steps}</ol></section>'
                f'<section class="hw-sec"><h2>{e(t["give_h"])}</h2><ul class="hw-list">{lst(t["give"])}</ul></section>'
                f'<section class="hw-sec"><h2>{e(t["rules_h"])}</h2><ul class="hw-list">{lst(t["rules"])}</ul><p><a href="{u_how}">{e(t["how_we"])} →</a></p></section>'
                f'<section class="hw-sec"><h2>{e(t["what_h"])}</h2><p>{e(t["what"])}</p></section>'
                f'<section class="hw-sec"><h2>{e(t["faq_h"])}</h2>{faq}</section>'
                f'<section class="hw-sec" id="apply">{form}</section>'
                f'<p><b>{e(t["also"])}:</b> <a href="{base}{pre}/sponsor/">{e(t["sponsor"])}</a> · <a href="{base}{pre}/media-kit/">{e(t["mediakit"])}</a></p>'
                f'</main><script>window.M365HW={cfg}</script><script defer src="{base}/assets/hardware.js"></script>{g["footer"](lang)}')
        ld = [{"@context": "https://schema.org", "@type": "WebPage", "@id": u_main + "#page", "url": u_main, "name": t["h1"], "description": t["desc"], "inLanguage": lang, "dateModified": today,
               "isPartOf": {"@id": f"{base}/#website"}},
              {"@context": "https://schema.org", "@type": "FAQPage", "@id": u_main + "#faq", "inLanguage": lang,
               "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in t["faq"]]}]
        g["write"](f"{'' if lang == 'en' else lang + '/'}hardware/index.html",
                   g["page"](lang, t["title"], t["desc"], u_main, body, alts_main, ld, xdefault=alts_main["en"], og_type="website", share=False))
        g["sitemap"].append((u_main, today, alts_main))

        rows = "".join(f'<tr><td><b>{e(t["crit"][k][0])}</b><br>{e(t["crit"][k][1])}</td><td>{w}%</td></tr>' for k, w in CRITERIA)
        body2 = (f'{g["header"](lang, "")}<main class="wrap">{CSS}<div class="hero"><div class="kicker">{e(t["t_kicker"])}</div><h1>{e(t["t_h1"])}</h1><p class="lede">{e(t["t_lede"])}</p></div>'
                 f'<section class="hw-sec"><h2>{e(t["t_score_h"])}</h2><p>{e(t["t_score_p"])}</p>'
                 f'<table class="hw-tbl"><thead><tr><th>{e(t["t_score_h"])}</th><th>{e(t["weight"])}</th></tr></thead><tbody>{rows}</tbody></table></section>'
                 f'<section class="hw-sec"><h2>{e(t["how_h"])}</h2><ul class="hw-list">{lst(t["how"])}</ul></section>'
                 f'<section class="hw-sec"><h2>{e(t["contains_h"])}</h2><p>{e(t["contains"])}</p></section>'
                 f'<section class="hw-sec"><h2>{e(t["indep_h"])}</h2><ul class="hw-list">{lst(t["indep"])}</ul></section>'
                 f'<p><a class="btn main" href="{u_main}#apply">{e(t["t_cta"])}</a> <a class="btn" href="{u_main}">{e(t["back"])}</a></p></main>{g["footer"](lang)}')
        ld2 = [{"@context": "https://schema.org", "@type": "WebPage", "@id": u_how + "#page", "url": u_how, "name": t["t_h1"], "description": t["t_desc"], "inLanguage": lang, "dateModified": today,
                "isPartOf": {"@id": f"{base}/#website"}}]
        g["write"](f"{'' if lang == 'en' else lang + '/'}hardware/how-we-test/index.html",
                   g["page"](lang, t["t_title"], t["t_desc"], u_how, body2, alts_how, ld2, xdefault=alts_how["en"], og_type="website", share=False))
        g["sitemap"].append((u_how, today, alts_how))
