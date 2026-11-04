import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import site_i18n
import site_landing
import site_sitemaps
from sync_spreaker import _save_top, episode_stats


class LandingPageTests(unittest.TestCase):
    def setUp(self):
        self.files = {}
        self.r2_files = {}
        self.pages = []
        self.sitemap = []

    def build(self, features=None):
        def page(lang, title, desc, canonical, body, alternates=None, jsonld=None, xdefault=None, **kwargs):
            self.pages.append((lang, canonical, alternates, xdefault, kwargs))
            return (f'<html lang="{lang}"><head><title>{title}</title><meta name="description" content="{desc}"></head>'
                    f'<body>{body}<script type="application/ld+json">{json.dumps(jsonld, ensure_ascii=False)}</script></body></html>')

        langs = {lang: (lang, lang, "rtl" if lang in ("ar", "he") else "ltr", 1, lang)
                 for lang in site_landing.LANGS_ALL[1:]}
        site_landing.build({
            "BASE": "https://example.test", "TODAY": "2026-11-04", "LANGS": langs,
            "sitemap": self.sitemap, "write": self.files.__setitem__, "write_r2": self.r2_files.__setitem__, "page": page,
            "header": lambda lang, switch: "", "footer": lambda lang: "<footer></footer>",
            "n_main": 42, "n_langs": 14, "spreaker_downloads": 1234, "spreaker_period": "2026-10-28–2026-11-04",
            "stats": {"bing": {"ok": True, "citations": 1100000, "period": {"from": "2026-08-01", "to": "2026-10-30"}},
                      "gsc": {"ok": False}},
            **({"features": features} if features is not None else {}),
        })

    def test_all_pages_have_localized_routes_and_hreflang_clusters(self):
        with patch.object(site_i18n, "T", side_effect=lambda lang, en, de: de if lang == "de" else en):
            self.build()
        self.assertEqual(len(site_landing.PAGES), 12)
        self.assertEqual(len(self.files), 26)
        self.assertEqual(len(self.r2_files), 13 * (len(site_landing.LANGS_ALL) - 2))
        self.assertEqual(len(self.sitemap), len(self.files) + len(self.r2_files))
        self.assertEqual(len(self.pages), len(self.sitemap))
        self.assertIn("services/index.html", self.files)
        self.assertIn("de/services/index.html", self.files)
        self.assertIn("for/sponsors/index.html", self.files)
        self.assertIn("ar/i-want-to/grow-my-podcast/index.html", self.r2_files)
        for lang, _, alternates, xdefault, kwargs in self.pages:
            self.assertEqual(set(alternates), set(site_landing.LANGS_ALL))
            self.assertEqual(xdefault, alternates["en"])
            if lang not in ("en", "de"):
                self.assertEqual(kwargs["og_of"], alternates["en"])

    def test_decisions_and_source_figures_are_rendered(self):
        with patch.object(site_i18n, "T", side_effect=lambda lang, en, de: de if lang == "de" else en):
            self.build()
        publishers = self.files["for/publishers/index.html"]
        self.assertIn("Coming soon", publishers)
        self.assertIn("in preparation", publishers)
        self.assertNotIn("Free for publishers and experts", publishers)
        self.assertNotIn("no-spam rule", publishers)
        podcast = self.files["i-want-to/grow-my-podcast/index.html"]
        self.assertIn("No price is stated for the current offer", podcast)
        self.assertIn("funded by advertising", podcast)
        self.assertIn("1,234", self.files["i-want-to/reach-microsoft-365-buyers/index.html"])
        self.assertIn("1,100,000", self.files["i-want-to/reach-microsoft-365-buyers/index.html"])
        self.assertNotIn("Google Search clicks", self.files["i-want-to/reach-microsoft-365-buyers/index.html"])
        self.assertIn("Bald verfügbar", self.files["de/for/experts/index.html"])
        self.assertNotIn("MVP Contribution Tracker sind kostenlos", self.files["de/for/experts/index.html"])

    def test_feature_flags_enable_current_copy_when_available(self):
        flags = {"contribution_tracker": True, "expert_requests": True, "adfree_membership": True}
        with patch.object(site_i18n, "T", side_effect=lambda lang, en, de: de if lang == "de" else en):
            self.build(flags)
        self.assertIn("Collect contributions by date and type", self.files["for/experts/index.html"])
        self.assertIn("no-spam rule", self.files["for/publishers/index.html"])
        self.assertIn("offer is free", self.files["for/publishers/index.html"])
        self.assertIn("The listener membership is free", self.files["for/it-teams/index.html"])
        self.assertNotIn("Coming soon", self.files["services/index.html"])

    def test_landing_routes_and_anchor_ctas(self):
        with patch.object(site_i18n, "T", side_effect=lambda lang, en, de: de if lang == "de" else en):
            self.build()
        for path in ("services/", "for/experts/", "i-want-to/find-an-expert/"):
            lang, typ = site_sitemaps.classify(f"/de/{path}", site_landing.LANGS_ALL)
            self.assertEqual((lang, typ), ("de", "pages"))
        it_page = self.files["de/for/it-teams/index.html"]
        self.assertIn('href="https://example.test/#languages"', it_page)
        self.assertNotIn('href="https://example.test/de/#languages"', it_page)
        hub = self.files["services/index.html"]
        self.assertIn('id="audiences"', hub)
        self.assertNotIn('class="btn main"', hub)
        self.assertNotIn('id="main"', hub)
        self.assertNotIn('id="main"', self.files["for/experts/index.html"])

    def test_localized_number_format_and_episode_source(self):
        with patch.object(site_i18n, "T", side_effect=lambda lang, en, de: de if lang == "de" else en):
            self.build()
        rendered = self.files["de/i-want-to/reach-microsoft-365-buyers/index.html"]
        self.assertIn("1.234", rendered)
        self.assertIn("1.100.000", rendered)
        self.assertIn("Quelle: M365.FM-Folgenarchiv", rendered)
        self.assertNotIn("Quelle: Spreaker", rendered)

    def test_spreaker_download_totals_only_exist_when_source_has_downloads(self):
        rows, total = episode_stats([
            {"episode_id": 1, "plays": 12, "downloads": 7},
            {"episode": {"episode_id": 2}, "plays": 8, "downloads": 3},
            {"episode_id": 3, "plays": 9},
        ])
        self.assertEqual(total, 10)
        self.assertEqual([row["episode_id"] for row in rows], [1, 3, 2])
        self.assertIsNone(episode_stats([{"episode_id": 1, "plays": 12}])[1])

    def test_download_display_uses_only_site_languages(self):
        with tempfile.TemporaryDirectory() as tmp:
            data = Path(tmp) / "data" / "top.json"
            data.parent.mkdir()
            data.write_text(json.dumps({"spreaker": {"from": "2026-11-01", "to": "2026-11-04",
                                                     "downloads": {**{lang: 1 for lang in site_landing.LANGS_ALL},
                                                                   "hi": 900}, "complete": True}}), "utf-8")
            with patch.object(site_landing, "ROOT", Path(tmp)), \
                 patch.object(site_i18n, "T", side_effect=lambda lang, en, de: en):
                rendered = site_landing._stats({"stats": {"bing": {}, "gsc": {}}}, "en")
        self.assertIn("<b>15</b>", rendered)
        self.assertNotIn("900", rendered)

    def test_incomplete_spreaker_downloads_are_not_displayed(self):
        with tempfile.TemporaryDirectory() as tmp:
            data = Path(tmp) / "data" / "top.json"
            data.parent.mkdir()
            data.write_text(json.dumps({"spreaker": {"downloads": {"en": 10, "de": 2}}}), "utf-8")
            with patch.object(site_landing, "ROOT", Path(tmp)), \
                 patch.object(site_i18n, "T", side_effect=lambda lang, en, de: en):
                rendered = site_landing._stats({"stats": {"bing": {}, "gsc": {}}}, "en")
        self.assertNotIn("Spreaker downloads", rendered)

    def test_spreaker_saves_only_complete_language_sets(self):
        with tempfile.TemporaryDirectory() as tmp:
            data = Path(tmp) / "data" / "top.json"
            data.parent.mkdir()
            data.write_text('{"previous":"complete"}', "utf-8")
            required = {"en", "de"}
            self.assertFalse(_save_top(Path(tmp), required, {"en": []}, {"en": 2}, "start", "end"))
            self.assertEqual(data.read_text("utf-8"), '{"previous":"complete"}')
            self.assertTrue(_save_top(Path(tmp), required, {"en": [], "de": []},
                                      {"en": 2, "de": 3}, "start", "end"))
            self.assertTrue(json.loads(data.read_text("utf-8"))["spreaker"]["complete"])


if __name__ == "__main__":
    unittest.main()
