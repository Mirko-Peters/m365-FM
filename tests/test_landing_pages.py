import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import site_i18n
import site_landing
import site_sitemaps
from sync_spreaker import _save_top, _show_maps, _show_stats, episode_stats


class LandingPageTests(unittest.TestCase):
    def setUp(self):
        self.files = {}
        self.r2_files = {}
        self.pages = []
        self.sitemap = []

    def build(self, features=None):
        if features is None:
            features = {"contribution_tracker": False, "expert_requests": False, "directory": True, "directory_paid": False}
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
            "features": features,
        })

    def tr_de(self):
        return patch.object(site_i18n, "T", side_effect=lambda lang, en, de: de if lang == "de" else en)

    def tr_all(self):
        """Simuliert vollstaendige Uebersetzungen aller weiteren Sprachen."""
        return patch.object(site_i18n, "T", side_effect=lambda lang, en, de: de if lang == "de" else en if lang == "en" else f"[{lang}] {en}")

    def test_no_follow_section_on_hub(self):
        with self.tr_de():
            self.build()
        for path in ("services/index.html", "de/services/index.html"):
            self.assertNotIn('id="follow"', self.files[path]); self.assertNotIn("m365con.net", self.files[path])

    def test_all_pages_have_localized_routes_and_hreflang_clusters(self):
        with self.tr_all():
            self.build()
        self.assertEqual(len(site_landing.PAGES), 13)
        self.assertEqual(len(self.files), 28)
        self.assertEqual(len(self.r2_files), 14 * (len(site_landing.LANGS_ALL) - 2))
        self.assertEqual(len(self.sitemap), len(self.files) + len(self.r2_files))
        self.assertEqual(len(self.pages), len(self.sitemap))
        for path in ("services/index.html", "de/services/index.html", "for/sponsors/index.html"):
            self.assertIn(path, self.files)
        self.assertIn("ar/i-want-to/grow-my-podcast/index.html", self.r2_files)
        for lang, _, alternates, xdefault, kwargs in self.pages:
            self.assertEqual(set(alternates), set(site_landing.LANGS_ALL))
            self.assertEqual(xdefault, alternates["en"])
            self.assertFalse(kwargs.get("noindex"))
            url, w, h = kwargs["og_image"]
            self.assertTrue(url.startswith("https://img.m365.fm/services/") and url.endswith(".png"))
            self.assertEqual((w, h), (1200, 630))

    def test_untranslated_languages_are_noindex_and_outside_the_cluster(self):
        with self.tr_de():
            self.build()
        self.assertEqual(len(self.sitemap), 28)
        for lang, canonical, alternates, xdefault, kwargs in self.pages:
            if lang in ("en", "de"):
                self.assertEqual(set(alternates), {"en", "de"})
                self.assertFalse(kwargs.get("noindex"))
            else:
                self.assertIsNone(alternates)
                self.assertTrue(kwargs["noindex"])
        self.assertIn("ja/for/experts/index.html", self.r2_files)

    def test_subpages_have_long_structured_copy(self):
        with self.tr_de():
            self.build()
        import re
        for spec in site_landing.PAGES:
            for prefix in ("", "de/"):
                page = self.files[prefix + spec["path"] + "index.html"]
                main = page.split('<main class="wrap lp">', 1)[1].split("</main>", 1)[0]
                words = len(re.sub(r"<[^>]+>", " ", main).split())
                self.assertGreaterEqual(words, 600, spec["path"] + prefix)
                for anchor in ('id="need"', 'id="offer"', 'id="how"', 'id="who"', 'id="examples"', 'id="faq"', 'id="links"', 'id="related"'):
                    self.assertIn(anchor, page)
                self.assertGreaterEqual(page.count("<details>"), 5)
                self.assertEqual(page.count("<h1"), 1)

    def test_images_have_dimensions_alt_and_loading_hints(self):
        with self.tr_de():
            self.build()
        import re
        hub = self.files["services/index.html"]
        thumbs = re.findall(r'<img [^>]*loading="lazy"[^>]*>', hub)
        self.assertEqual(len(thumbs), 13)
        for tag in thumbs:
            self.assertIn('width="480" height="270"', tag)
            self.assertRegex(tag, r'alt="[^"]{20,}"')
            self.assertIn("https://img.m365.fm/services/v1/", tag)
        sub = self.files["de/for/sponsors/index.html"]
        hero = re.search(r'<img [^>]*fetchpriority="high"[^>]*>', sub).group(0)
        self.assertIn('width="1600" height="900"', hero)
        self.assertIn("/for-sponsors/hero-de-1600.webp", hero)
        self.assertNotIn('loading="lazy"', hero)
        fr = self.r2_files["fr/for/sponsors/index.html"]
        self.assertIn("/for-sponsors/hero-x-1600.webp", fr)

    def test_schema_service_faq_breadcrumb_and_image(self):
        with self.tr_de():
            self.build()
        import re
        page = self.files["for/publishers/index.html"]
        ld = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', page, re.S).group(1))
        types = {n["@type"]: n for n in ld}
        self.assertEqual(set(types), {"WebPage", "Service", "ImageObject", "BreadcrumbList", "FAQPage"})
        self.assertEqual(types["WebPage"]["primaryImageOfPage"], {"@id": types["ImageObject"]["@id"]})
        self.assertEqual((types["ImageObject"]["width"], types["ImageObject"]["height"]), (1600, 900))
        self.assertGreaterEqual(len(types["FAQPage"]["mainEntity"]), 5)
        self.assertEqual([i["position"] for i in types["BreadcrumbList"]["itemListElement"]], [1, 2, 3])
        hub = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', self.files["services/index.html"], re.S).group(1))
        self.assertIn("CollectionPage", {n["@type"] for n in hub})

    def test_decisions_and_source_figures_are_rendered(self):
        with self.tr_de():
            self.build()
        publishers = self.files["for/publishers/index.html"]
        self.assertIn("Coming soon", publishers)
        self.assertIn("request tool for publishers is in preparation", publishers)
        self.assertNotIn("no-spam rule", publishers)
        self.assertNotIn("contact details are shared after they accept", publishers)
        hub = self.files["services/index.html"]
        self.assertIn("Coming soon", hub)
        self.assertNotIn("This feature is in preparation.", hub)
        for paid in ("for/sponsors/index.html", "i-want-to/reach-microsoft-365-buyers/index.html"):
            self.assertIn('lp-badge paid', self.files[paid])
        podcast = self.files["i-want-to/grow-my-podcast/index.html"]
        self.assertIn("Pages for imported shows carry advertising", podcast)
        self.assertIn("Your existing feed and hosting remain unchanged", podcast)
        buyers = self.files["i-want-to/reach-microsoft-365-buyers/index.html"]
        self.assertIn("1,234", buyers)
        self.assertIn("1,100,000", buyers)
        self.assertNotIn("Google Search clicks", buyers)
        self.assertIn("Bald verfügbar", self.files["de/for/experts/index.html"])
        self.assertNotIn("MVP Contribution Tracker ist kostenlos", self.files["de/i-want-to/prove-my-community-impact/index.html"])
        self.assertNotIn("$", buyers)

    def test_stats_put_value_label_and_source_on_separate_elements(self):
        with self.tr_de():
            self.build()
        import re
        hub = self.files["services/index.html"]
        stats = re.findall(r'<div class="lp-stat"><b>([^<]+)</b><span>([^<]+)</span><small>([^<]+)</small></div>', hub)
        self.assertEqual(len(stats), 4)
        self.assertTrue(all(s[2].strip() for s in stats))

    def test_feature_flags_enable_current_copy_when_available(self):
        flags = {"contribution_tracker": True, "expert_requests": True, "directory": True, "directory_paid": False}
        with self.tr_de():
            self.build(flags)
        self.assertIn("Collects the contributions M365.FM already records", self.files["for/experts/index.html"])
        self.assertIn("no-spam rule", self.files["for/publishers/index.html"])
        self.assertIn("contact details are shared after they accept", self.files["for/publishers/index.html"])
        self.assertNotIn("ad-free", self.files["for/it-teams/index.html"].lower().replace("no paid ad-free version", ""))
        self.assertNotIn("Coming soon", self.files["services/index.html"])

    def test_explicit_empty_features_do_not_load_file_defaults(self):
        with tempfile.TemporaryDirectory() as tmp:
            data = Path(tmp) / "data"
            data.mkdir()
            (data / "landing_features.json").write_text(json.dumps({
                "contribution_tracker": True, "expert_requests": True,
            }), "utf-8")
            with patch.object(site_landing, "ROOT", Path(tmp)), self.tr_de():
                self.build({})
        self.assertIn("Coming soon", self.files["services/index.html"])
        self.assertIn("in preparation", self.files["for/experts/index.html"])

    def test_landing_routes_and_anchor_ctas(self):
        with self.tr_de():
            self.build()
        for path in ("services/", "for/experts/", "i-want-to/find-an-expert/"):
            lang, typ = site_sitemaps.classify(f"/de/{path}", site_landing.LANGS_ALL)
            self.assertEqual((lang, typ), ("de", "pages"))
        it_page = self.files["de/for/it-teams/index.html"]
        self.assertIn('href="https://example.test/#languages"', it_page)
        self.assertNotIn('href="https://example.test/de/#languages"', it_page)
        self.assertIn('href="https://example.test/de/podcast/"', self.files["de/i-want-to/stay-current-on-microsoft-365/index.html"])
        self.assertIn('href="https://example.test/show/"', self.files["i-want-to/stay-current-on-microsoft-365/index.html"])
        hub = self.files["services/index.html"]
        self.assertIn('id="audiences"', hub)
        self.assertNotIn('class="btn main"', hub)
        self.assertNotIn('id="main"', hub)
        self.assertNotIn('id="main"', self.files["for/experts/index.html"])

    def test_directory_service_and_company_page_are_free_and_linked(self):
        with self.tr_de():
            self.build()
        hub = self.files["services/index.html"]
        self.assertIn('href="https://example.test/directory/"', hub)
        self.assertIn("Microsoft 365 directory", hub)
        self.assertIn("Free", hub)
        company = self.files["for/companies/index.html"]
        self.assertIn("Optional locations", company)
        self.assertNotIn("Coming soon", company)
        self.assertNotIn("pricing", company.lower())
        self.assertNotIn("paid", company.lower())
        for path in ("for/experts/", "for/organizers/", "for/it-teams/",
                     "i-want-to/find-an-expert/", "i-want-to/run-a-community-event/"):
            self.assertIn('href="https://example.test/directory/"', self.files[path + "index.html"])

    def test_copy_limits_titles_and_descriptions(self):
        from site_landing_copy import HUB, PAGES
        seen = set()
        for spec in [HUB] + list(PAGES.values()):
            for i in (0, 1):
                self.assertLessEqual(len(spec["seo"][i]), 75, spec["seo"][i])
                self.assertLessEqual(len(spec["meta"][i]), 160, spec["meta"][i])
                self.assertNotIn((i, spec["seo"][i]), seen)
                seen.add((i, spec["seo"][i]))

    def test_localized_number_format_and_episode_source(self):
        with self.tr_de():
            self.build()
        rendered = self.files["de/i-want-to/reach-microsoft-365-buyers/index.html"]
        self.assertIn("1.234", rendered)
        self.assertIn("1.100.000", rendered)
        self.assertIn("Quelle: M365.FM-Folgenarchiv", rendered)

    def test_spreaker_download_totals_only_exist_when_source_has_downloads(self):
        rows, total = episode_stats([
            {"episode_id": 1, "plays": 12, "downloads": 7},
            {"episode": {"episode_id": 2}, "plays": 8, "downloads": 3},
            {"episode_id": 3, "plays": 9},
        ])
        self.assertEqual(total, 10)
        self.assertEqual([row["episode_id"] for row in rows], [1, 3, 2])
        self.assertIsNone(episode_stats([{"episode_id": 1, "plays": 12}])[1])
        self.assertEqual(_show_stats([]), ([], 0))

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

    def test_spreaker_updates_language_lists_and_keeps_previous_complete_totals(self):
        with tempfile.TemporaryDirectory() as tmp:
            data = Path(tmp) / "data" / "top.json"
            data.parent.mkdir()
            previous = {"from": "old-start", "to": "old-end", "downloads": {"en": 22, "de": 11}, "complete": True}
            data.write_text(json.dumps({"spreaker": previous, "langs": {"en": [1]}}), "utf-8")
            required = {"en", "de", "ru", "ja"}
            self.assertFalse(_save_top(Path(tmp), required, {"en": [], "de": [2], "ru": []},
                                       {"en": 2, "de": 3, "ru": 0}, "start", "end"))
            updated = json.loads(data.read_text("utf-8"))
            self.assertEqual(updated["langs"], {"en": [], "de": [2], "ru": []})
            self.assertEqual(updated["spreaker"], previous)
            self.assertTrue(_save_top(Path(tmp), required, {"en": [], "de": [2], "ru": [], "ja": []},
                                      {"en": 2, "de": 3, "ru": 0, "ja": 0}, "start", "end"))
            updated = json.loads(data.read_text("utf-8"))
            self.assertEqual(updated["spreaker"]["downloads"]["ru"], 0)

    def test_non_site_shows_remain_in_sync(self):
        shows, required = _show_maps({"en": 1, "hi": 2, "ml": 3})
        self.assertEqual(set(shows), {"en", "hi", "ml"})
        self.assertEqual(required, {"en"})


if __name__ == "__main__":
    unittest.main()
