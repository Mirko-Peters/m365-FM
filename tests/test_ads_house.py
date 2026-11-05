"""Freie Werbeplaetze: bis 22.01.2027 M365Con-Banner, danach wieder Hinweis auf die Sponsor-Seite."""
import unittest
import site_ads as A


class HouseAd(unittest.TestCase):
    def test_con_until_end(self):
        h = A._house("https://www.m365.fm", "de", "2027-01-22")
        self.assertIn("m365con.net", h)
        self.assertIn("utm_medium=house_ad", h)
        self.assertIn("Kostenlos anmelden", h)

    def test_fallback_language(self):
        self.assertIn("Register free", A._house("https://www.m365.fm", "ja", "2026-11-05"))

    def test_after_con_sponsor(self):
        h = A._house("https://www.m365.fm", "en", "2027-01-23")
        self.assertNotIn("m365con.net", h)
        self.assertIn("/sponsor/", h)

    def test_css(self):
        self.assertIn(".ad-con", A.CSS)


BASE = "https://www.m365.fm"
PAGE = ('<html><head></head><body><main><p>Intro ' + "x" * 3000 + '</p><h2>A</h2><p>a</p><h2>B</h2><p>b</p><h2>C</h2><p>c</p></main>'
        '<footer>f</footer></body></html>')


class NoAdSense(unittest.TestCase):
    """Mirko, 5.11.2026: keine Google-Anzeigen mehr."""
    def test_switched_off(self):
        self.assertFalse(A.active(BASE))
        self.assertIsNone(A.ads_txt(BASE))
        self.assertEqual(A.head(BASE, PAGE, BASE + "/show/x/"), "")

    def test_con_and_services_until_22_jan(self):
        out = A.inject(BASE, PAGE, "de", BASE + "/show/x/", today="2027-01-22")
        self.assertEqual(out.count("ad-own"), 2)
        self.assertEqual(out.count("ad-con"), 1)
        self.assertIn("m365con.net", out)
        self.assertIn('href="https://www.m365.fm/de/services/"', out)
        self.assertIn("Services ansehen", out)
        self.assertLess(out.index("ad-con"), out.index("ad-svc"))
        self.assertNotIn("adsbygoogle", out)
        self.assertNotIn("googlesyndication", out)

    def test_only_services_after_con(self):
        out = A.inject(BASE, PAGE, "en", BASE + "/show/x/", today="2027-01-23")
        self.assertEqual(out.count("ad-own"), 1)
        self.assertNotIn("m365con.net", out)
        self.assertIn('href="https://www.m365.fm/services/"', out)
        self.assertIn("View services", out)

    def test_rules_still_apply(self):
        self.assertEqual(A.inject(BASE, PAGE, "de", BASE + "/impressum/", today="2026-12-01"), PAGE)
        self.assertEqual(A.inject(BASE, PAGE, "de", BASE + "/show/x/", noindex=True, today="2026-12-01"), PAGE)


if __name__ == "__main__":
    unittest.main()
