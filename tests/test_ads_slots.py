"""#281 Buchbare Werbeplaetze: Slot-Komponente mit fester Groesse, Hausanzeigen als Rueckfall, Kennzeichnung in allen Sprachen,
Seitentyp/Themen fuer die Auslieferung, nur auf geeigneten Seiten."""
import json
import re
import unittest
from unittest.mock import patch

import site_ads as A

BASE = "https://www.m365.fm"
BODY = ('<header>h</header><main class="wrap"><p>Intro ' + "x" * 3000 + '</p><h2>A</h2><p><a href="https://www.m365.fm/entity/teams-phone/">Teams Phone</a></p>'
        '<h2>B</h2><p>b <a href="/de/entity/copilot/">Copilot</a></p><h2>C</h2><p>c</p></main><footer>f</footer>')
LANGS = ("en", "de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")


class Slots(unittest.TestCase):
    def out(self, lang="de", path="/show/episodes/folge-1/", today="2026-12-01", body=BODY):
        return A.inject(BASE, body, lang, BASE + path, today=today)

    def test_three_slots_in_order_with_fixed_box_and_label(self):
        out = self.out()
        slots = re.findall(r'<aside class="ad ad-own ad-slot ad-(\w+)" data-ad-slot="(\w+)" data-pt="(\w+)" data-topics="([^"]*)" data-house="(\w+)" data-slug="([^"]*)" aria-label="Anzeige">', out)
        self.assertEqual([s[1] for s in slots], ["top", "mid", "bottom"])
        self.assertTrue(all(s[2] == "episode" for s in slots))
        self.assertEqual(slots[0][3], "teams-phone,copilot")
        self.assertLess(out.index('data-ad-slot="top"'), out.index("<main"))      # oben: unter dem Header, vor dem Inhalt
        self.assertLess(out.index("Intro"), out.index('data-ad-slot="mid"'))       # frueh im Text: nach dem ersten Absatz ...
        self.assertLess(out.index('data-ad-slot="mid"'), out.index("<h2>A"))       # ... noch vor der ersten Zwischenueberschrift
        self.assertLess(out.index('data-ad-slot="bottom"'), out.index("<footer>"))
        self.assertEqual(out.count('<div class="ad-box">'), 3)
        self.assertIn(".ad-box{position:relative;margin:0 auto;height:100px", A.CSS)   # feste Hoehe: kein Layoutsprung
        self.assertIn("@media(min-width:768px){.ad-box{height:90px}}", A.CSS)
        self.assertIn(".ad-mid .ad-box,.ad-mid2 .ad-box{height:250px", A.CSS)

    def test_house_ads_stay_as_fallback(self):
        out = self.out(today="2027-01-22")
        top = out[out.index('data-ad-slot="top"'):out.index("<main")]
        self.assertIn("go/h-sponsor?s=top", top)   # Buchung aus: oben Werbung fuer die Sponsoring-Seite
        self.assertNotIn("for/advertisers", out)
        with patch.object(A, "slot_cfg", return_value={**A.slot_cfg(), "booking": True}):
            on = self.out(today="2027-01-22")
            top = on[on.index('data-ad-slot="top"'):on.index("<main")]
            self.assertIn("go/h-advertise?s=top", top)
            self.assertIn("Werbeplätze ansehen", top)
        mid = out[out.index('data-ad-slot="mid"'):out.index("<h2>A")]
        self.assertIn("M365Con 2027", mid)
        self.assertIn('href="https://api-dub.m365.fm/go/h-m365con?s=mid&amp;pt=episode&amp;l=de&amp;e=teams-phone&amp;p=folge-1" rel="nofollow noopener"', mid)
        bottom = out[out.index('data-ad-slot="bottom"'):out.index("<footer>")]
        self.assertIn('href="https://api-dub.m365.fm/go/h-services?s=bottom&amp;pt=episode&amp;l=de&amp;e=teams-phone&amp;p=folge-1"', bottom)
        self.assertIn("Services ansehen", bottom)
        after = self.out(today="2027-01-23")
        self.assertNotIn("M365Con", after)
        self.assertIn("go/h-sponsor?s=mid", after)

    def test_script_config_once_and_cookieless(self):
        out = self.out()
        self.assertEqual(out.count("window.M365AD="), 1)
        cfg = json.loads(re.search(r"window\.M365AD=(\{.*?\})</script>", out).group(1))
        self.assertEqual(cfg["api"], "https://api-dub.m365.fm")
        self.assertEqual(cfg["t"]["label"], "Anzeige")
        self.assertRegex(out, r'<script defer src="https://www\.m365\.fm/assets/ads\.js\?v=[0-9a-f]{10}"></script>')
        js = open("assets/ads.js", encoding="utf-8").read()
        self.assertIn('credentials: "omit"', js)
        self.assertIn('rel: "sponsored noopener"', js)
        self.assertNotIn("innerHTML", js)
        self.assertIn('"&house=" + encodeURIComponent(slotEl.getAttribute("data-house")', js)   # Hausanzeigen werden mitgezaehlt
        self.assertNotIn("document.cookie", js)
        self.assertNotIn("localStorage", js)

    def test_labels_in_all_languages(self):
        for lang in LANGS:
            t = A.texts(lang, "slot")
            for key in ("label", "sponsored", "consent", "contact", "adv_h", "adv_cta"):
                self.assertTrue(t[key].strip(), (lang, key))
            self.assertIn("{org}", t["consent"], lang)
            b = A.texts(lang, "book")
            self.assertTrue(b["submit"].strip(), lang)
            if lang not in ("en",):
                self.assertNotEqual(t["label"], "Advertisement", lang)
        out = self.out(lang="ar", path="/ar/folge-1/")
        self.assertIn('aria-label="إعلان"', out)
        self.assertIn('data-pt="lang"', out)

    def test_page_types_and_topics(self):
        self.assertEqual(A.page_type(BASE, BASE + "/show/episodes/x/"), "episode")
        self.assertEqual(A.page_type(BASE, BASE + "/fr/une-folge/"), "lang")
        self.assertEqual(A.page_type(BASE, BASE + "/entity/copilot/"), "entity")
        self.assertEqual(A.page_type(BASE, BASE + "/de/entity/copilot/"), "entity")
        self.assertEqual(A.page_type(BASE, BASE + "/de/community/blog/x/"), "blog")
        self.assertEqual(A.page_type(BASE, BASE + "/de/services/"), "other")
        self.assertEqual(A.page_topics(BASE, BASE + "/entity/purview/", BODY)[:2], ["purview", "teams-phone"])

    def test_eligibility_all_content_types_incl_blog(self):
        """Mirko, 5.11.2026: alle Inhaltsseiten inkl. Blog, aber nur mit Entitaet und genug Text; werbefreie Seiten nie."""
        text = "<p>" + "Lorem ipsum dolor sit amet. " * 120 + "</p>"
        ent = '<p><a href="https://www.m365.fm/entity/sharepoint/">SharePoint</a></p>'
        page = lambda inner: f'<main class="wrap">{inner}<h2>A</h2><p>a</p><h2>B</h2><p>b</p><h2>C</h2><p>c</p></main><footer>f</footer>'
        blog = "/community/u/mirko/blog/sharepoint-tipps/"
        self.assertTrue(A.slot_eligible(BASE, page(text + ent), BASE + blog))
        self.assertTrue(A.slot_eligible(BASE, page(text + ent), BASE + "/de" + blog))
        self.assertEqual(A.page_type(BASE, BASE + blog), "blog")
        self.assertFalse(A.slot_eligible(BASE, page(text), BASE + blog), "Blog ohne Entitaet")
        self.assertTrue(A.slot_eligible(BASE, page("<p>kurz</p>" + ent), BASE + blog), "kurzer Blog mit Entitaet: ja, aber weniger Plaetze")
        short = A.inject(BASE, page("<p>kurz</p>" + ent), "en", BASE + blog, today="2026-12-01")
        self.assertEqual(re.findall(r'data-ad-slot="(\w+)"', short), ["mid", "bottom"])
        long_ = A.inject(BASE, page(text + ent), "en", BASE + blog, today="2026-12-01")
        self.assertEqual(re.findall(r'data-ad-slot="(\w+)"', long_), ["top", "mid", "bottom"])
        self.assertTrue(A.slot_eligible(BASE, page("<p>kurz</p>"), BASE + "/entity/copilot/"), "Entitaetsseite selbst")
        self.assertIn('data-pt="blog"', A.inject(BASE, page(text + ent), "en", BASE + blog, today="2026-12-01"))
        for ok in ("/show/episodes/folge/", "/fr/une-folge/", "/entity/copilot/"):
            self.assertTrue(A.slot_eligible(BASE, page(text + ent), BASE + ok), ok)
        for bad in ("/impressum/", "/datenschutz/", "/privacy/", "/community/", "/community/u/mirko/", "/community/u/mirko/blog/",
                    "/de/community/members/", "/admin/", "/callback/", "/live/", "/404.html", "/sponsor/", "/de/services/",
                    "/for/advertisers/", "/i-want-to/find-an-expert/", "/media-kit/", "/"):
            self.assertFalse(A.slot_eligible(BASE, page(text + ent), BASE + bad), bad)
        self.assertFalse(A.slot_eligible(BASE, page(text + ent), BASE + "/show/episodes/x/", noindex=True))
        with patch.object(A, "slot_cfg", return_value={**A.slot_cfg(), "min_chars": 100000}):   # Schwelle konfigurierbar: nur noch kurze Variante
            self.assertEqual(re.findall(r'data-ad-slot="(\w+)"', A.inject(BASE, page(text + ent), "en", BASE + blog, today="2026-12-01")), ["mid", "bottom"])
        with patch.object(A, "slot_cfg", return_value={**A.slot_cfg(), "skip_paths": ["/show/"]}):   # Liste konfigurierbar
            self.assertFalse(A.slot_eligible(BASE, page(text + ent), BASE + "/show/episodes/x/"))
            self.assertTrue(A.slot_eligible(BASE, page(text + ent), BASE + "/impressum/"))

    def test_early_slot_position_rules(self):
        """Frueher Platz: hinter H1/Lede, nach dem ersten Absatz oder vor der ersten H2, nie in Liste/Tabelle/Code."""
        ent = '<a href="/entity/teams-phone/">Teams Phone</a>'
        def place(inner):
            out = A.inject(BASE, f'<main class="wrap">{inner}</main><footer>f</footer>', "de", BASE + "/show/episodes/x/", today="2026-12-01")
            return out
        out = place(f'<h1>Titel</h1><p class="lede">Lede</p><p>Erster Absatz {ent}</p><p>Zweiter</p>')
        self.assertLess(out.index("Erster Absatz"), out.index('data-ad-slot="mid"'))
        self.assertLess(out.index('data-ad-slot="mid"'), out.index("Zweiter"))
        out = place(f'<h1>Titel</h1><p class="lede">Lede {ent}</p><h2>Eins</h2><p>Text</p>')
        self.assertLess(out.index("Lede"), out.index('data-ad-slot="mid"'))
        self.assertLess(out.index('data-ad-slot="mid"'), out.index("<h2>Eins"))
        out = place(f'<h1>T</h1><ul><li><p>in der Liste {ent}</p></li></ul><table><tr><td><p>Zelle</p></td></tr></table><pre><code><p>x</p></code></pre><p>Danach</p>')
        i = out.index('data-ad-slot="mid"')
        self.assertLess(out.index("</pre>"), i)
        self.assertLess(out.index("Danach</p>"), i)   # erst nach dem ersten Absatz ausserhalb von Liste, Tabelle und Code

    def test_mid2_only_on_long_pages_with_distance(self):
        para = "<p>" + "Text " * 240 + "</p>"
        ent = '<p><a href="/entity/copilot/">Copilot</a></p>'
        far = f'<main class="wrap"><p>Intro</p>{ent}<h2>A</h2>{para}<h2>B</h2>{para}<h2>C</h2>{para}</main><footer>f</footer>'
        near = f'<main class="wrap"><p>Intro</p>{ent}<h2>A</h2><p>a</p><h2>B</h2><p>b</p><h2>C</h2>{para * 4}</main><footer>f</footer>'
        with patch.object(A, "slot_cfg", return_value={**A.slot_cfg(), "slots": {"top": True, "mid": True, "mid2": True, "bottom": True}}):
            out = A.inject(BASE, far, "en", BASE + "/show/episodes/x/", today="2026-12-01")
            self.assertEqual(re.findall(r'data-ad-slot="(\w+)"', out), ["top", "mid", "mid2", "bottom"])
            self.assertIn('data-ad-slot="mid2" data-pt="episode" data-topics="copilot" data-house="services" data-slug="x" data-ad-house="1"', out)
            out = A.inject(BASE, near, "en", BASE + "/show/episodes/x/", today="2026-12-01")
            self.assertNotIn('data-ad-slot="mid2"', out, "zu nah am fruehen Platz")
        self.assertNotIn('data-ad-slot="mid2"', A.inject(BASE, far, "en", BASE + "/show/episodes/x/", today="2026-12-01"), "Standard: aus")

    def test_rules_and_switches(self):
        self.assertEqual(A.inject(BASE, BODY, "de", BASE + "/impressum/", today="2026-12-01"), BODY)
        self.assertEqual(A.inject(BASE, BODY, "de", BASE + "/show/x/", noindex=True, today="2026-12-01"), BODY)
        short = '<main class="wrap"><p>kurz</p></main><footer>f</footer>'
        self.assertEqual(A.inject(BASE, short, "de", BASE + "/show/x/", today="2026-12-01"), short)
        with patch.object(A, "slot_cfg", return_value={"enabled": True, "slots": {"top": False, "mid": True, "bottom": True}}):
            out = self.out()
            self.assertNotIn('data-ad-slot="top"', out)
            self.assertIn('data-ad-slot="mid"', out)
        with patch.object(A, "slot_cfg", return_value={"enabled": False}):
            out = self.out(today="2027-01-22")
            self.assertNotIn("data-ad-slot", out)
            self.assertNotIn("M365AD", out)
            self.assertIn("ad-con", out)


if __name__ == "__main__":
    unittest.main()


class BookingSwitch(unittest.TestCase):
    """Schalter "booking" (data/ad_slots.json, Standard aus): nur eigene Werbung, keine Verweise auf die Buchung, keine PayPal-Rechnung auf /sponsor/."""
    def build_mediakit(self):
        import site_mediakit as SM
        out = {}
        g = {"BASE": BASE, "TODAY": "2026-11-05", "api": "https://api-dub.m365.fm", "LANGS": {"de": ("Deutsch", "de", "ltr")}, "sitemap": [],
             "header": lambda lang, x: "<header></header>", "footer": lambda lang: "<footer></footer>",
             "page": lambda lang, title, desc, url, body, alts, ld, **kw: body, "write": lambda p, h: out.__setitem__(p, h)}
        SM.build(g)
        return out

    def test_default_off(self):
        import site_sponsor as SPN
        self.assertFalse(A.booking_on())
        self.assertEqual(SPN.advertise_button(BASE, "de"), "")
        self.assertEqual(SPN.invoice_html(lambda k, **kw: k), "")   # nur das Anfrageformular
        for page in self.build_mediakit().values():
            self.assertNotIn("for/advertisers", page)

    def test_on(self):
        import site_sponsor as SPN
        with patch.object(A, "slot_cfg", return_value={**A.slot_cfg(), "booking": True}):
            self.assertIn('href="https://www.m365.fm/de/for/advertisers/"', SPN.advertise_button(BASE, "de"))
            inv = SPN.invoice_html(lambda k, **kw: k)
            self.assertIn('<details class="spn-inv" id="spn-inv" hidden>', inv)
            self.assertIn('id="spn-inv-con" hidden', inv)
            self.assertIn("/de/for/advertisers/", self.build_mediakit()["de/media-kit/index.html"])


class SponsorBannerOption(unittest.TestCase):
    """Mirko, 6.11.2026: kein eigenes Themen-Sponsoring mehr; "Banner-Werbung" im Konfigurator klappt Rechner und Buchung der Werbeplaetze auf
    (dieselbe Komponente assets/ads-book.js und dieselbe API wie /for/advertisers/), ohne Platzgrenze je Thema."""
    def item(self, lang="de"):
        import html as H, json as J, re as RE
        import site_sponsor as SPN
        t = lambda k, **kw: SPN.tx(lang, k, **kw)
        out = SPN.ads_item({"BASE": BASE}, lang, t)
        cfg = J.loads(H.unescape(RE.search(r'id="spn-adb" data-cfg="([^"]+)"', out).group(1)))
        return out, cfg

    def test_off_calculator_only(self):
        out, cfg = self.item()
        self.assertIn('<input type="checkbox" id="spn-ads" aria-describedby="spn-ads-d" aria-controls="spn-adsbox">', out)
        self.assertIn('<div class="spn-adsbox" id="spn-adsbox" hidden>', out)
        self.assertEqual(cfg["products"], ["banner_top", "banner_mid", "banner_bottom"])
        self.assertEqual(cfg["product"], "banner_mid")   # frueher Platz im Text nach der Einleitung
        self.assertIs(cfg["booking"], False)
        self.assertEqual(cfg["page"], "https://www.m365.fm/de/sponsor/")
        self.assertEqual(cfg["anchor"], "#spn-ads")
        self.assertIn("topics_mine", cfg["t"])
        self.assertIn("15–40 €", out)   # TKP-Spanne aus data/ad_pricing.json
        self.assertNotIn("höchstens", out.lower())

    def test_on_booking(self):
        with patch.object(A, "slot_cfg", return_value={**A.slot_cfg(), "booking": True}):
            out, cfg = self.item("en")
        self.assertIs(cfg["booking"], True)
        self.assertIn("€15–40", out)

    def test_no_topic_sponsorship_left(self):
        import site_sponsor as SPN, site_sponsorships as SPM
        for lang in LANGS:
            for k in ("topic_h", "topic_hint", "row_topic", "tip_vis_topic"):
                self.assertNotIn(k, SPN.I18N[lang], (lang, k))
            for k in ("ads_h", "ads_hint", "ads_on", "ads_off", "row_ads", "tip_vis_ads"):
                self.assertIn(k, SPN.I18N[lang], (lang, k))
            for k in ("topics_mine", "topics_none"):
                self.assertTrue(A.texts(lang, "book").get(k), (lang, k))
        self.assertNotIn("topic", SPN.PRICING["prices"])
        self.assertFalse(hasattr(SPM, "TOPIC_MAX"))
        from pathlib import Path
        js = (Path(A.__file__).parent / "assets" / "ads-book.js").read_text("utf-8")
        self.assertIn("window.AdBook = { mount: mount }", js)
        self.assertIn('document.getElementById("adbook")', js)   # /for/advertisers/ startet weiter selbst


class HouseAdsAllLanguages(unittest.TestCase):
    """Mirko, 5.11.2026: Hausanzeigen (M365Con, Services, Werben/Sponsoring) in allen 15 Sprachen der Website."""
    def test_every_language_has_all_house_strings(self):
        import site_sponsor as SPN
        for lang in LANGS:
            self.assertIn(lang, A.CON_TXT, lang)
            h, sub = A.CON_TXT[lang]
            self.assertIn("M365Con 2027", h)
            self.assertIn("2027", sub)
            self.assertEqual(len(sub.split(" · ")), 3, lang)   # Datum · Sessions · Aufruf (CTA)
            self.assertTrue(A.SVC_CTA[lang].strip() and all(x.strip() for x in A.SVC_TXT[lang]), lang)
            t = A.texts(lang, "slot")
            for k in ("adv_h", "adv_p", "adv_cta", "label"):
                self.assertTrue(t[k], (lang, k))
            for k in ("footer_link", "h1", "open_req"):
                self.assertIn(k, SPN.I18N[lang], (lang, k))
            house = A._house(BASE, lang, "2026-12-01") + A._svc(BASE, lang) + A._adv_house(BASE, lang)
            if lang != "en":
                self.assertNotIn("Register free", house, lang)
                self.assertNotIn("View services", house, lang)

    def test_rtl_safe_css(self):
        css = A.SLOT_CSS
        for prop in ("margin-left", "margin-right", "padding-left", "padding-right", "text-align:left", "text-align:right", ";left:", ";right:"):
            self.assertNotIn(prop, css)
