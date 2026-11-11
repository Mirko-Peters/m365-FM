import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_sponsor as SPN
import site_legal as LEG


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

        with patch.object(SPN, "_ssr", return_value={}), \
             patch.object(SPN, "T", side_effect=lambda lang, en, de: de if lang == "de" else en):
            SPN.build(ctx)

        en = "https://www.m365.fm/sponsor/dashboard/"
        de = "https://www.m365.fm/de/sponsor/dashboard/"
        ar = "https://www.m365.fm/ar/sponsor/dashboard/"
        he = "https://www.m365.fm/he/sponsor/dashboard/"
        for view in ("placement", "report", "sources"):
            self.assertIn(f"sponsor/dashboard/{view}/index.html", written)
            self.assertIn(f"de/sponsor/dashboard/{view}/index.html", written)
            self.assertIsNone(rendered[f"https://www.m365.fm/sponsor/dashboard/{view}/"]["alternates"])
            self.assertIn("<style>:root{--sdb-measured", rendered[f"https://www.m365.fm/sponsor/dashboard/{view}/"]["kwargs"]["extra_head"])
        self.assertIn("sponsor/dashboard/index.html", written)
        self.assertIn("de/sponsor/dashboard/index.html", written)
        self.assertIn("ar/sponsor/dashboard/index.html", written)
        self.assertIn("he/sponsor/dashboard/index.html", written)
        self.assertIsNone(rendered[en]["alternates"])
        self.assertIsNone(rendered[de]["alternates"])
        self.assertIn(f'href="{en}"', written["sponsor/index.html"])
        self.assertIn("A source-backed view", written["sponsor/dashboard/index.html"])
        self.assertIn("Quellenbasierte Übersicht", written["de/sponsor/dashboard/index.html"])
        self.assertIn("window.M365SP=", written["sponsor/dashboard/index.html"])
        self.assertIn("sponsor-dashboard.js", written["de/sponsor/dashboard/index.html"])
        self.assertNotIn('"campaigns"', written["sponsor/dashboard/index.html"])
        self.assertIn("What your sponsorship achieved", written["sponsor/dashboard/index.html"])
        self.assertIn("var(--bg)", rendered[en]["kwargs"]["extra_head"])
        self.assertIn("<style>:root{--sdb-measured", rendered[en]["kwargs"]["extra_head"])
        self.assertNotIn("hreflang", rendered[en]["kwargs"]["extra_head"])
        self.assertNotIn("hreflang", rendered[de]["kwargs"]["extra_head"])
        self.assertTrue(rendered[en]["kwargs"]["noindex"])
        self.assertFalse(any("/sponsor/dashboard/" in url for url, *_ in ctx["sitemap"]))
        for path in written.values():
            self.assertNotRegex(path, r"\b(?:21400|4820|12300|9150|38600|1840)\b")
        for key in ("measured", "estimated", "manual", "measured_desc", "estimated_desc", "manual_desc",
                    "as_of", "source", "ai_citations", "search_impressions"):
            self.assertTrue(SPN.dashboard_copy("en")[key])
            self.assertTrue(SPN.dashboard_copy("de")[key])

    def test_status_texts_for_term_grace_and_after_in_all_languages(self):
        frontend = (ROOT / "assets" / "sponsor-dashboard.js").read_text("utf-8")
        de, en = SPN.dashboard_copy("de"), SPN.dashboard_copy("en")
        self.assertEqual((de["running"], de["grace_until"], de["ended_visible"]), ("Läuft", "Karenzzeit bis", "Beendet – Zahlen weiter sichtbar"))
        self.assertEqual((en["running"], en["grace_until"], en["ended_visible"]), ("Running", "Grace period until", "Ended – figures stay visible"))
        for lang in SPN.LANGS_ALL:
            copy = SPN.dashboard_copy(lang)
            for key in ("running", "grace_until", "ended_visible"):
                self.assertIn(f'"{key}"', frontend)
                self.assertTrue(copy[key])
                if lang not in ("en", "de"):
                    self.assertNotEqual(copy[key], en[key], f"{lang}/{key} fehlt in data/py_i18n.json")

    def test_dashboard_does_not_assign_companies_by_website(self):
        frontend = (ROOT / "assets" / "sponsor-dashboard.js").read_text("utf-8")
        self.assertNotIn("publicPlacements", frontend)
        self.assertNotIn("org.website", frontend)

    def test_detail_labels_unavailable_breakdowns_without_sample_values(self):
        frontend = (ROOT / "assets" / "sponsor-dashboard.js").read_text("utf-8")
        for key in ("languages_viewed", "source_no_data"):
            self.assertIn(f'"{key}"', frontend)
            self.assertIn(key, SPN.dashboard_copy("en"))
            self.assertIn(key, SPN.dashboard_copy("de"))
        self.assertIn(".sdb-lang-bars", SPN.DASHBOARD_CSS)
        self.assertIn("body *{visibility:hidden!important}", SPN.DASHBOARD_CSS)
        self.assertIn(".sdb-report,.sdb-report *{visibility:visible!important}", SPN.DASHBOARD_CSS)
        self.assertNotIn("LinkedIn", frontend)
        self.assertNotIn("HeySummit", frontend)

    def test_sponsor_link_privacy_notice_is_a_section_in_both_languages(self):
        de, en = LEG.privacy_de(), LEG.privacy_en()
        self.assertIn("<h2>Sponsor-Links</h2><p>Klicks auf Sponsor-Links", de)
        self.assertIn("<h2>Sponsor links</h2><p>We count clicks on sponsor links", en)


if __name__ == "__main__":
    unittest.main()
