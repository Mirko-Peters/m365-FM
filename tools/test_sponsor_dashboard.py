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
            "LANGS": {lang: (lang, lang, "rtl" if lang in ("ar", "he") else "ltr", "show", "en_US")
                      for lang in SPN.LANGS_ALL if lang != "en"},
            "sitemap": [],
            "TODAY": "2026-11-04",
            "api": "https://api-dub.m365.fm",
            "langs": list(SPN.LANGS_ALL),
            "day": lambda value, lang: str(value),
        }

        campaigns = [{"website": "https://acme.example/", "start": "2026-11-01", "end": "2027-01-31",
                      "episodes": ["episode"], "pages": ["topic"], "posts": []}]
        with patch.object(SPN, "_ssr", return_value={}), patch.object(SPN, "dashboard_campaigns", return_value=campaigns), \
             patch.object(SPN, "T", side_effect=lambda lang, en, de: de if lang == "de" else en):
            SPN.build(ctx)

        en = "https://www.m365.fm/sponsor/dashboard/"
        de = "https://www.m365.fm/de/sponsor/dashboard/"
        ar = "https://www.m365.fm/ar/sponsor/dashboard/"
        he = "https://www.m365.fm/he/sponsor/dashboard/"
        for view in ("placement", "report", "sources"):
            self.assertIn(f"sponsor/dashboard/{view}/index.html", written)
            self.assertIn(f"de/sponsor/dashboard/{view}/index.html", written)
            self.assertEqual(len(rendered[f"https://www.m365.fm/sponsor/dashboard/{view}/"]["alternates"]), len(SPN.LANGS_ALL))
        self.assertIn("sponsor/dashboard/index.html", written)
        self.assertIn("de/sponsor/dashboard/index.html", written)
        self.assertIn("ar/sponsor/dashboard/index.html", written)
        self.assertIn("he/sponsor/dashboard/index.html", written)
        self.assertEqual(len(rendered[en]["alternates"]), len(SPN.LANGS_ALL))
        self.assertEqual(rendered[en]["alternates"]["ar"], ar)
        self.assertEqual(rendered[en]["alternates"]["he"], he)
        self.assertEqual(rendered[de]["alternates"]["en"], en)
        self.assertIn(f'href="{en}"', written["sponsor/index.html"])
        self.assertIn("A source-backed view", written["sponsor/dashboard/index.html"])
        self.assertIn("Quellenbasierte Übersicht", written["de/sponsor/dashboard/index.html"])
        self.assertIn("window.M365SP=", written["sponsor/dashboard/index.html"])
        self.assertIn("sponsor-dashboard.js", written["de/sponsor/dashboard/index.html"])
        self.assertIn('"campaigns":[{"website":"https://acme.example/"', written["sponsor/dashboard/index.html"])
        self.assertIn("var(--bg)", rendered[en]["kwargs"]["extra_head"])
        self.assertTrue(any(url == en for url, _, _ in ctx["sitemap"]))
        for path in written.values():
            self.assertNotRegex(path, r"\b(?:21400|4820|12300|9150|38600|1840)\b")
        for key in ("measured", "estimated", "manual", "as_of", "source", "ai_citations", "search_impressions"):
            self.assertTrue(SPN.dashboard_copy("en")[key])
            self.assertTrue(SPN.dashboard_copy("de")[key])

    def test_only_public_sponsorship_fields_are_passed_to_dashboard(self):
        source = {"sponsorships": [{
            "sponsor": {"name": "Acme", "url": "https://acme.example/"},
            "start": "2026-11-01", "end": "2027-01-31",
            "episodes": ["episode"], "entities": ["product"], "topics": ["topic"], "posts": ["article"],
        }]}
        with patch.object(SPN, "_json", return_value=source):
            self.assertEqual(SPN.dashboard_campaigns(), [{
                "website": "https://acme.example/", "start": "2026-11-01", "end": "2027-01-31",
                "episodes": ["episode"], "pages": ["product", "topic"], "posts": ["article"],
            }])


if __name__ == "__main__":
    unittest.main()
