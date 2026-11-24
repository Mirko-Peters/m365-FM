"""M365Con-Karte der Seitenleiste als Text-Banner (Mirko 24.11.2026): kein Bild, kein Bild-Preload im Kopf, Text in der Sprache der Seite.
Anlass: Cloudflare Web Analytics zeigte auf dem Desktop meist das Kartenbild als LCP-Element (3,2-22 s) statt des Inhalts."""
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_ads as ADS  # noqa: E402
import site_sidebar as SBR  # noqa: E402

BASE = "https://www.m365.fm"


def card(lang):
    h = SBR.render(SBR.Index(), BASE, lang, "Copilot", [], None, None)
    return h, re.search(r'<section class="sb-card sb-con">.*?</section>', h).group(0)


class TextBanner(unittest.TestCase):
    def test_default_is_text(self):
        self.assertTrue(SBR.CON_TEXT)

    def test_no_image_and_no_preload(self):
        h, c = card("en")
        self.assertNotIn("<img", c); self.assertNotIn("<picture", c); self.assertNotIn("attending-m365con", c)
        self.assertEqual(SBR.con_preload(h), "")
        self.assertIn('class="sb-cont"', c); self.assertIn('class="sb-btn"', c)
        self.assertEqual(c.count(SBR.CON), 2)

    def test_text_in_page_language(self):
        for lang in ("en", "de", "ja", "ar"):
            _, c = card(lang)
            t1, t2 = ADS.CON_TXT[lang]
            self.assertIn(t1, c, lang); self.assertIn(t2, c, lang)

    def test_unknown_language_falls_back_to_english(self):
        self.assertIn(ADS.CON_TXT["en"][0], SBR.con_text("xx"))

    def test_google_card_is_text_in_all_languages(self):
        for lang in SBR.L10N:
            h, _ = card(lang)
            g = re.search(r'<section class="sb-card sb-g">.*?</section>', h).group(0)
            self.assertNotIn("<img", g, lang); self.assertNotIn("gsource", g, lang)
            self.assertIn(SBR.GSRC, g); self.assertIn(SBR.GADD[lang], g, lang)
        self.assertEqual(set(SBR.L10N) - set(SBR.GADD), set())

    def test_css_for_text_banner(self):
        css = (ROOT / "assets" / "sbar.css").read_text("utf-8")
        self.assertIn(".sb-cont{", css); self.assertIn(".sb-cont b{", css)


if __name__ == "__main__":
    unittest.main()
