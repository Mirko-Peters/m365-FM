"""Offline-Regression: python3 tools/test_directory.py."""
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import site_directory as DIR
from site_i18n import COMM_LANGS, pfx2


class DirectoryPageTests(unittest.TestCase):
    def build(self, items):
        written, pages, sitemap = {}, [], []

        def page(lang, *args, **kwargs):
            pages.append({"lang": lang, "canonical": args[2], "schema": args[5], "noindex": kwargs.get("noindex")})
            return args[3]

        context = {
            "BASE": "https://www.m365.fm", "write": written.__setitem__, "page": page,
            "api": "https://api.example.test", "TODAY": "2026-11-04",
            "header": lambda *_: "", "footer": lambda *_: "", "footer_en": lambda: "",
            "LANGS": {lang: lang for lang in COMM_LANGS}, "sitemap": sitemap,
        }
        with patch.object(DIR, "fetch_directory", return_value=items):
            DIR.build(context)
        return written, pages, sitemap

    def test_hub_and_seo_pages_are_noindex_below_three_items(self):
        item = {"type": "expert", "name": "Ada", "url": "https://www.m365.fm/community/u/ada/", "country": "Germany", "city": "Berlin", "topics": ["copilot-studio"]}
        written, pages, sitemap = self.build([item, {**item, "name": "Bea"}])
        hubs = [page for page in pages if page["canonical"].endswith("/directory/")]
        self.assertEqual(len(hubs), len(COMM_LANGS))
        self.assertTrue(all(page["noindex"] for page in hubs))
        self.assertIn("data-map-load", written["directory/index.html"])
        self.assertNotIn("maps.googleapis.com", written["directory/index.html"])
        country = next(page for page in pages if page["canonical"].endswith("/directory/de/"))
        self.assertTrue(country["noindex"])
        self.assertEqual(country["schema"][0]["@type"], "ItemList")
        self.assertFalse(any(url.endswith("/directory/de/") for url, *_ in sitemap))
        self.assertIn(f"{pfx2('de')}directory/index.html", written)

    def test_hub_with_three_items_is_indexable_and_has_itemlist_schema(self):
        items = [{"type": "expert", "name": f"Expert {i}", "url": f"https://www.m365.fm/community/u/expert-{i}/", "country": "Germany", "city": "Berlin", "topics": ["copilot-studio"]} for i in range(3)]
        _, pages, sitemap = self.build(items)
        hubs = [page for page in pages if page["canonical"].endswith("/directory/")]
        self.assertEqual(len(hubs), len(COMM_LANGS))
        self.assertTrue(all(not page["noindex"] for page in hubs))
        self.assertTrue(all(page["schema"][0]["@type"] == "ItemList" for page in hubs))
        self.assertTrue(any(url.endswith("/directory/") for url, *_ in sitemap))


if __name__ == "__main__":
    unittest.main()
