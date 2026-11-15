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
            pages.append({"lang": lang, "title": args[0], "description": args[1], "canonical": args[2], "schema": args[5], "noindex": kwargs.get("noindex")})
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

    def test_hub_embeds_filter_facets_from_all_items(self):
        items = [{"type": "expert", "name": f"Expert {i}", "url": f"https://www.m365.fm/community/u/expert-{i}/",
                  "country": "Germany" if i < 35 else "France", "city": "Berlin" if i < 35 else "Paris",
                  "topics": ["copilot-studio"] if i < 35 else ["purview"], "programs": ["mct"] if i == 39 else [], "lang": "fr" if i >= 35 else "de"}
                 for i in range(40)]
        written, _, _ = self.build(items)
        hub = written["directory/index.html"]
        config = json.loads(hub.split("window.M365D=", 1)[1].split("</script>", 1)[0])
        self.assertEqual(len(config["items"]), 30)
        self.assertEqual(config["facets"]["country"], ["France", "Germany"])
        self.assertEqual(config["facets"]["city"], ["Berlin", "Paris"])
        self.assertEqual(config["facets"]["topic"], ["copilot-studio", "purview"])
        self.assertEqual(config["facets"]["program"], ["mct"])
        self.assertEqual(config["facets"]["lang"], ["de", "fr"])

    def test_city_pages_group_by_slug_and_skip_empty_slugs(self):
        def expert(i, country, city):
            return {"type": "expert", "name": f"Expert {i}", "url": f"https://www.m365.fm/community/u/expert-{i}/",
                    "country": country, "city": city, "topics": []}
        items = [expert(i, "Germany", "Berlin") for i in range(3)] + [expert(3, "Germany", "berlin")]
        items += [expert(4 + i, "Japan", "東京") for i in range(3)]
        written, pages, sitemap = self.build(items)
        self.assertFalse([path for path in written if "//" in path])
        japan = written["directory/japan/index.html"]
        self.assertIn("<h1>Microsoft 365 experts in Japan</h1>", japan)
        self.assertNotIn("東京, Japan", japan)
        berlin = written["directory/de/berlin/index.html"]
        self.assertIn("<h1>Microsoft 365 experts in Berlin, Germany</h1>", berlin)
        self.assertIn("Directory: 4 entries", berlin)
        self.assertEqual(len([page for page in pages if page["lang"] == "en" and page["canonical"].endswith("/directory/de/berlin/")]), 1)
        facts = GEN.collect_facts(items)
        self.assertEqual(facts["city:de:berlin"]["entries"], 4)
        self.assertNotIn("city:japan:", facts)

    def test_topic_pages_use_entity_name_not_id(self):
        items = [{"type": "expert", "name": f"Expert {i}", "url": f"https://www.m365.fm/community/u/expert-{i}/",
                  "country": "Germany", "city": "Berlin", "topics": ["test-topic-x"]} for i in range(5)]
        with patch.dict(DIR.ENTS, {"test-topic-x": {"id": "test-topic-x", "name": "Test Topic X"}}):
            written, pages, _ = self.build(items)
        html = written["directory/de/topic/test-topic-x/index.html"]
        self.assertIn("<h1>Test Topic X experts in Germany</h1>", html)
        self.assertNotIn("test-topic-x experts", html)
        page = next(page for page in pages if page["lang"] == "en" and page["canonical"].endswith("/directory/de/topic/test-topic-x/"))
        self.assertEqual(page["title"], "Test Topic X experts in Germany")
        self.assertEqual(page["description"], "Test Topic X experts in Germany")
        self.assertEqual(page["schema"][0]["itemListElement"][-1]["name"], "Test Topic X experts in Germany")
        self.assertEqual(page["schema"][1]["name"], "Test Topic X experts in Germany")

    def test_cjk_text_counts_each_character_as_a_word(self):
        self.assertEqual(len(DIR._words("東京のエキスパート")), 9)
        self.assertEqual(len(DIR._words("Copilot 東京 experts")), 4)
        self.assertEqual(len(DIR._words("서울의 전문가 목록")), 3)   # Koreanisch: Wörter mit Leerzeichen
        items = [{"type": "expert", "name": f"Expert {i}", "url": "u", "country": "Japan", "city": "Tokyo", "topics": []} for i in range(3)]
        intro = "".join(chr(0x4E00 + i) for i in range(100))
        detail = "".join(chr(0x4E00 + 100 + i) for i in range(80))
        parent = "".join(chr(0x5E00 + i) for i in range(200))
        self.assertTrue(DIR._indexable(items, "city", intro, detail, parent))
        self.assertFalse(DIR._indexable(items, "city", intro[:60], detail[:60], parent))

    def test_fetch_reads_all_pages_beyond_5000_items(self):
        # Worker begrenzt je Tabelle; die Summe (hier 6000) darf nicht bei Seite 50 abgeschnitten werden
        total, requested = 6000, []

        def page_of(url):
            page = int(url.rsplit("page=", 1)[1])
            requested.append(page)
            start = (page - 1) * 100
            return {"items": [{"id": f"i{n}"} for n in range(start, min(start + 100, total))], "total": total, "has_more": start + 100 < total}

        import site_fetch
        with patch.object(site_fetch, "fetch", side_effect=page_of):
            self.assertEqual(len(DIR.fetch_directory("https://api.example.test")), total)
        self.assertEqual(requested, list(range(1, 61)))

        class Response:
            def __init__(self, url):
                self.body = json.dumps(page_of(url)).encode()
            def __enter__(self):
                return self
            def __exit__(self, *_):
                return False
            def read(self):
                return self.body

        requested.clear()
        with patch.object(GEN.urllib.request, "urlopen", side_effect=lambda request, timeout=None: Response(request.full_url)):
            self.assertEqual(len(GEN._fetch_items()), total)
        self.assertEqual(requested, list(range(1, 61)))

    def test_fetch_stops_at_total_even_if_has_more_stays_true(self):
        calls = []

        def broken(url):
            calls.append(url)
            return {"items": [{"id": len(calls)}], "total": 250, "has_more": True}

        import site_fetch
        with patch.object(site_fetch, "fetch", side_effect=broken):
            DIR.fetch_directory("https://api.example.test")
        self.assertEqual(len(calls), 3)

    def test_jsonld_text_cannot_close_its_script_element(self):
        malicious = "</script><img src=x>"
        rendered = GS._jsonld_script({"name": malicious})
        payload = rendered.split(">", 1)[1].split("</script>", 1)[0]
        self.assertNotIn(malicious, payload)
        self.assertEqual(json.loads(payload)["name"], malicious)


if __name__ == "__main__":
    unittest.main()
