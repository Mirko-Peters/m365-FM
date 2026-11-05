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


if __name__ == "__main__":
    unittest.main()
