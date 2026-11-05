"""Offline-Regression: python3 tools/test_directory.py."""
import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from tools import generate_directory_intros as GEN
import generate_site as GS
import site_directory as DIR
from site_i18n import COMM_LANGS, pfx2


class DirectoryPageTests(unittest.TestCase):
    def build(self, items, intros=None, google_maps_key="test-key"):
        written, pages, sitemap = {}, [], []

        def page(lang, *args, **kwargs):
            pages.append({"lang": lang, "canonical": args[2], "schema": args[5], "noindex": kwargs.get("noindex")})
            return args[3]

        context = {
            "BASE": "https://www.m365.fm", "write": written.__setitem__, "page": page,
            "api": "https://api.example.test", "TODAY": "2026-11-04",
            "header": lambda *_: "", "footer": lambda *_: "", "footer_en": lambda: "",
            "LANGS": {lang: lang for lang in COMM_LANGS}, "sitemap": sitemap, "google_maps_key": google_maps_key,
        }
        if intros is not None:
            context["intros"] = intros
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
        self.assertEqual(country["schema"][0]["@type"], "BreadcrumbList")
        self.assertEqual(country["schema"][1]["@type"], "ItemList")
        self.assertFalse(any(url.endswith("/directory/de/") for url, *_ in sitemap))
        self.assertIn(f"{pfx2('de')}directory/index.html", written)
        self.assertNotIn("services/index.html", written)

    def test_hub_with_three_items_is_indexable_and_has_itemlist_schema(self):
        items = [{"type": "expert", "name": f"Expert {i}", "url": f"https://www.m365.fm/community/u/expert-{i}/", "country": "Germany", "city": "Berlin", "topics": ["copilot-studio"]} for i in range(3)]
        _, pages, sitemap = self.build(items)
        hubs = [page for page in pages if page["canonical"].endswith("/directory/")]
        self.assertEqual(len(hubs), len(COMM_LANGS))
        self.assertEqual({page["lang"] for page in hubs if not page["noindex"]}, {"en", "de"})
        self.assertTrue(all(page["schema"][0]["@type"] == "ItemList" for page in hubs))
        self.assertEqual({url for url, *_ in sitemap if url.endswith("/directory/")},
                         {"https://www.m365.fm/directory/", "https://www.m365.fm/de/directory/"})

    def test_map_controls_are_omitted_without_a_maps_key(self):
        item = {"type": "expert", "name": "Ada", "url": "https://www.m365.fm/community/u/ada/",
                "country": "Germany", "city": "Berlin", "topics": []}
        written, _, _ = self.build([item, {**item, "name": "Bea"}, {**item, "name": "Cem"}], google_maps_key="")
        hub = written["directory/index.html"]
        self.assertIn("data-results", hub)
        self.assertNotIn("data-map-load", hub)
        self.assertNotIn('data-view="map"', hub)
        self.assertNotIn("maps.googleapis.com", hub)
        script = (ROOT / "assets" / "directory.js").read_text("utf-8")
        self.assertIn("if (!mapButton || !D.mapsKey || mapButton.disabled) return;", script)
        self.assertIn("if (mapButton) mapButton.addEventListener(\"click\", loadMap);", script)

    def test_seo_pages_need_three_or_five_entries_and_150_unique_words(self):
        def copy(label):
            return {"eligible": True, "intro": " ".join(f"{label}introword{i}" for i in range(90)),
                    "detail": " ".join(f"{label}detailword{i}" for i in range(80)),
                    "intro_de": " ".join(f"{label}einleitungwort{i}" for i in range(90)),
                    "detail_de": " ".join(f"{label}detailwort{i}" for i in range(80))}
        items = []
        for i in range(8):
            topics = ["copilot-studio"] + (["power-automate"] if i < 4 else [])
            city = "Berlin" if i < 5 else "Munich"
            items.append({"type": "expert", "name": f"Expert {i}", "url": f"https://www.m365.fm/community/u/expert-{i}/",
                          "country": "Germany", "city": city, "topics": topics})
        intros = {
            "country:de": copy("country"),
            "city:de:berlin": copy("berlin"),
            "city:de:munich": copy("munich"),
            "topic:de:copilot-studio": copy("copilot"),
            "topic:de:power-automate": copy("power"),
        }
        short = copy("short")
        parent = copy("parent")
        self.assertFalse(DIR._indexable(items[:2], "city", short["intro"], short["detail"],
                                        parent["intro"] + " " + parent["detail"]))
        written, pages, sitemap = self.build(items, intros)
        en = [page for page in pages if page["lang"] == "en"]
        statuses = {page["canonical"].removeprefix("https://www.m365.fm/"): page["noindex"] for page in en}
        self.assertFalse(statuses["directory/de/"])
        self.assertFalse(statuses["directory/de/berlin/"])
        self.assertFalse(statuses["directory/de/munich/"])
        self.assertFalse(statuses["directory/de/topic/copilot-studio/"])
        self.assertTrue(statuses["directory/de/topic/power-automate/"])
        berlin = written["directory/de/berlin/index.html"]
        self.assertIn("directory/de/munich/", berlin)
        berlin_page = next(page for page in en if page["canonical"].endswith("/directory/de/berlin/"))
        self.assertEqual([x["@type"] for x in berlin_page["schema"]], ["BreadcrumbList", "ItemList"])
        self.assertTrue(any(url.endswith("/directory/de/berlin/") for url, *_ in sitemap))
        self.assertTrue(all(page["noindex"] for page in pages if page["lang"] not in ("en", "de")))

    def test_identical_city_copy_is_noindex_and_copy_must_be_present(self):
        long_text = " ".join(f"sharedword{i}" for i in range(170))
        item = {"type": "expert", "name": "Ada", "url": "https://www.m365.fm/community/u/ada/",
                "country": "Germany", "city": "Berlin", "topics": []}
        intros = {
            "country:de": {"eligible": True, "intro": long_text, "detail": long_text,
                           "intro_de": long_text, "detail_de": long_text},
            "city:de:berlin": {"eligible": True, "intro": long_text, "detail": long_text,
                               "intro_de": long_text, "detail_de": long_text},
        }
        _, pages, sitemap = self.build([item, {**item, "name": "Bea"}, {**item, "name": "Cem"}], intros)
        city = next(page for page in pages if page["lang"] == "en" and page["canonical"].endswith("/directory/de/berlin/"))
        self.assertTrue(city["noindex"])
        self.assertFalse(any(url.endswith("/directory/de/berlin/") for url, *_ in sitemap))

    def test_intro_cache_only_regenerates_after_twenty_percent_or_top_topic_change(self):
        facts = {"entries": 10, "top_topics": ["copilot-studio"], "types": {"expert": 10}}
        generated = {"intro": "English intro", "detail": "English detail", "intro_de": "Deutscher Einstieg",
                     "detail_de": "Deutsche Details"}
        cache = {"pages": {}}
        with patch.object(GEN, "_generate", return_value=generated) as generate:
            cache, count = GEN.update_cache({"country:de": facts}, cache)
            self.assertEqual((generate.call_count, count), (1, 1))
            cache, count = GEN.update_cache({"country:de": {**facts, "entries": 11}}, cache)
            self.assertEqual((generate.call_count, count), (1, 0))
            cache, count = GEN.update_cache({"country:de": {**facts, "entries": 12}}, cache)
            self.assertEqual((generate.call_count, count), (2, 1))
            cache, count = GEN.update_cache({"country:de": {**facts, "entries": 12, "top_topics": ["purview"]}}, cache)
            self.assertEqual((generate.call_count, count), (3, 1))
        page = cache["pages"]["country:de"]
        self.assertRegex(page["facts_hash"], r"^[0-9a-f]{64}$")
        self.assertEqual(page["generated_top_topics"], ["purview"])

    def test_intro_facts_do_not_include_company_address(self):
        facts = GEN.collect_facts([{
            "type": "company", "country": "Germany", "city": "Berlin", "address": "Private Street 4",
            "name": "Example", "topics": ["copilot-studio"], "programs": ["partner"], "lang": "de",
        }])
        encoded = str(facts)
        self.assertIn("copilot-studio", encoded)
        self.assertNotIn("Private Street", encoded)
        self.assertNotIn("address", encoded)

    def test_jsonld_text_cannot_close_its_script_element(self):
        malicious = "</script><img src=x>"
        rendered = GS._jsonld_script({"name": malicious})
        payload = rendered.split(">", 1)[1].split("</script>", 1)[0]
        self.assertNotIn(malicious, payload)
        self.assertEqual(json.loads(payload)["name"], malicious)


if __name__ == "__main__":
    unittest.main()
