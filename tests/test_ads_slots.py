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
        slots = re.findall(r'<aside class="ad ad-own ad-slot ad-(\w+)" data-ad-slot="(\w+)" data-pt="(\w+)" data-topics="([^"]*)" aria-label="Anzeige">', out)
        self.assertEqual([s[1] for s in slots], ["top", "mid", "bottom"])
        self.assertTrue(all(s[2] == "episode" for s in slots))
        self.assertEqual(slots[0][3], "teams-phone,copilot")
        self.assertLess(out.index('data-ad-slot="top"'), out.index("<main"))      # oben: unter dem Header, vor dem Inhalt
        self.assertLess(out.index("<h2>B"), out.index('data-ad-slot="mid"'))     # Mitte: im Text nach dem 2. Abschnitt
        self.assertLess(out.index('data-ad-slot="bottom"'), out.index("<footer>"))
        self.assertEqual(out.count('<div class="ad-box">'), 3)
        self.assertIn(".ad-box{position:relative;margin:0 auto;height:100px", A.CSS)   # feste Hoehe: kein Layoutsprung
        self.assertIn("@media(min-width:768px){.ad-box{height:90px}}", A.CSS)
        self.assertIn(".ad-mid .ad-box{height:250px", A.CSS)

    def test_house_ads_stay_as_fallback(self):
        out = self.out(today="2027-01-22")
        top = out[out.index('data-ad-slot="top"'):out.index("<main")]
        self.assertIn('href="https://www.m365.fm/de/for/advertisers/"', top)
        self.assertIn("Werbeplätze ansehen", top)
        mid = out[out.index('data-ad-slot="mid"'):out.index("<h2>C")]
        self.assertIn("m365con.net", mid)
        bottom = out[out.index('data-ad-slot="bottom"'):out.index("<footer>")]
        self.assertIn('href="https://www.m365.fm/de/services/"', bottom)
        after = self.out(today="2027-01-23")
        self.assertNotIn("m365con.net", after)
        self.assertIn('href="https://www.m365.fm/de/sponsor/"', after)

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
