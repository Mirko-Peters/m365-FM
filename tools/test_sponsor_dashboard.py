import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_sponsor as SPN


class SponsorDashboardTests(unittest.TestCase):
    def test_builds_localized_dashboard_pages_and_links_them_from_sponsor_page(self):
        written, rendered = {}, {}

        def page(lang, title, desc, canonical, body, *args, **kwargs):
            rendered[canonical] = {"lang": lang, "body": body, "alternates": args[0] if args else None, "kwargs": kwargs}
            return body

        ctx = {
            "write": lambda path, content: written.__setitem__(path, content),
            "page": page,
            "header": lambda lang, switch: "",
            "footer": lambda lang: "",
            "BASE": "https://www.m365.fm",
            "LANGS": {"de": ("Deutsch", "de", "de", "show", "de_DE")},
            "sitemap": [],
            "TODAY": "2026-11-04",
            "api": "https://api-dub.m365.fm",
            "langs": ["en", "de"],
            "day": lambda value, lang: str(value),
        }

        with patch.object(SPN, "_ssr", return_value={}):
            SPN.build(ctx)

        en = "https://www.m365.fm/sponsor/dashboard/"
        de = "https://www.m365.fm/de/sponsor/dashboard/"
        self.assertIn("sponsor/dashboard/index.html", written)
        self.assertIn("de/sponsor/dashboard/index.html", written)
        self.assertEqual(rendered[en]["alternates"], {"en": "https://www.m365.fm/sponsor/dashboard/", "de": de})
        self.assertEqual(rendered[de]["alternates"], {"en": en, "de": de})
        self.assertIn(f'href="{en}"', written["sponsor/index.html"])
        self.assertIn("Podcast/banner bookings", written["sponsor/dashboard/index.html"])
        self.assertIn("Podcast-/Banner-Buchungen", written["de/sponsor/dashboard/index.html"])
        self.assertIn("window.M365SP=", written["sponsor/dashboard/index.html"])
        self.assertIn("sponsor-dashboard.js", written["de/sponsor/dashboard/index.html"])
        self.assertIn("var(--bg)", rendered[en]["kwargs"]["extra_head"])
        self.assertTrue(any(url == en for url, _, _ in ctx["sitemap"]))


if __name__ == "__main__":
    unittest.main()
