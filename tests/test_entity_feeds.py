import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
with patch("site_fetch.fetch", return_value={}):
    import site_entity_feeds as F


class EntityFeedTests(unittest.TestCase):
    def test_blog_topic_and_other_source_assignment(self):
        posts = [
            {"slug": "one", "topics": ["alpha"], "published": 2},
            {"slug": "two", "topics": ["beta", "alpha"], "published": 1},
        ]
        self.assertEqual([p["slug"] for p in F.index_posts(posts)["alpha"]], ["one", "two"])

        indexed = F.index_sources(
            [{"slug": "v", "topics": ["alpha"]}],
            [{"id": "u", "eids": ["alpha"]}],
            [{"handle": "e", "topics": ["beta"], "sessions": [{"topics": ["alpha"]}]}],
        )
        self.assertEqual(indexed["videos"]["alpha"][0]["slug"], "v")
        self.assertEqual(indexed["updates"]["alpha"][0]["id"], "u")
        self.assertEqual(indexed["events"]["alpha"][0]["handle"], "e")
        self.assertNotIn("beta", indexed["videos"])

    def test_language_limit_tracking_and_valid_rss(self):
        videos = [{"slug": str(i), "lang": "en", "published": 1, "topics": ["alpha"], "title": f"Video {i}"} for i in range(55)]
        indexed = F.index_sources(videos, [], [])
        items = F.items_for_entity("alpha", "en", [], [], indexed, "https://example.test")
        self.assertEqual(len(items), 50)
        self.assertEqual(F.items_for_entity("alpha", "de", [], [], indexed, "https://example.test"), [])

        entity = {"id": "alpha", "name": 'A & "B"', "desc": {"en": "<b>Useful & safe</b>"}}
        xml = F.rss(entity, "en", "https://example.test/entity/alpha/feed.xml", items)
        root = ET.fromstring(xml)
        self.assertEqual(root.findtext("./channel/title"), 'A & "B" – M365.FM')
        self.assertEqual(len(root.findall("./channel/item")), 50)
        first = root.find("./channel/item")
        self.assertIn("utm_source=rss", first.findtext("link"))
        self.assertIn("utm_medium=entity", first.findtext("link"))
        self.assertEqual(first.findtext("category"), "video")

    def test_build_writes_localized_feeds_index_and_sitemap(self):
        entity = {"id": "alpha", "name": "Alpha", "desc": {"en": "English", "de": "Deutsch"}}
        episodes = {
            "en": [{"lang": "en", "sid": "123", "slug": "one", "date": "2026-11-01", "url": "https://example.test/one",
                    "e": {"title": "Episode"}, "sum": "Summary"}],
            "de": [{"lang": "de", "sid": "124", "slug": "zwei", "date": "2026-11-02", "url": "https://example.test/zwei",
                    "e": {"title": "Folge"}, "sum": "Zusammenfassung"}],
        }
        posts = {
            "alpha": [
                {"lang": "en", "handle": "author", "slug": "post-en", "title": "Article", "published": 100},
                {"lang": "de", "handle": "author", "slug": "post-de", "title": "Artikel", "published": 101},
            ]
        }
        videos = [{"lang": "en", "slug": "video-en", "title": "Video", "published": 200, "topics": ["alpha"]}]
        updates = [{"id": "update", "title": "Update", "modified": "2026-11-03", "eids": ["alpha"]}]
        events = [{"lang": "de", "handle": "event-de", "title": "Event", "start": "2026-11-04",
                   "topics": ["alpha"]}]
        output, sitemap = {}, []
        ctx = {
            "BASE": "https://example.test",
            "write": lambda path, content: output.__setitem__(path, content),
            "page": lambda *args, **kwargs: args[4],
            "header": lambda lang, switch: "<header></header>",
            "footer": lambda lang: "<footer></footer>",
            "LANGS": ("en", "de"),
            "sitemap": sitemap,
            "TODAY": "2026-11-04",
        }
        with patch.object(F, "ENTS", {"alpha": entity}):
            feeds = F.build(
                ctx, lambda e, lang: episodes[lang], posts, videos, updates, events,
                {"123": {"url": "https://api.spreaker.com/download/episode/123/audio.mp3", "length": 123}},
            )
        self.assertIn("entity/alpha/feed.xml", output)
        self.assertIn("de/entity/alpha/feed.xml", output)
        self.assertIn("entity/feeds.opml", output)
        self.assertIn("entity/feeds/index.html", output)
        self.assertIn("de/entity/feeds/index.html", output)
        self.assertEqual(feeds["alpha"]["de"], "https://example.test/de/entity/alpha/feed.xml")
        en = ET.fromstring(output["entity/alpha/feed.xml"])
        de = ET.fromstring(output["de/entity/alpha/feed.xml"])
        self.assertEqual(en.findtext("./channel/link"), "https://example.test/entity/alpha/")
        self.assertEqual({item.findtext("category") for item in en.findall("./channel/item")}, {"episode", "article", "video", "update"})
        self.assertEqual({item.findtext("category") for item in de.findall("./channel/item")}, {"episode", "article", "event"})
        self.assertEqual(len(en.findall("./channel/item/enclosure")), 1)
        self.assertTrue(any(url.endswith("/entity/alpha/feed.xml") for url, _, _ in sitemap))
        self.assertIn("https://example.test/entity/feeds.opml", [url for url, _, _ in sitemap])

    def test_episode_enclosure_only_for_allowed_spreaker_audio(self):
        safe = "https://api.spreaker.com/download/episode/123/audio.mp3"
        relay = "https://dts.podtrac.com/redirect.mp3/hopr.fm/api.spreaker.com/download/episode/123/audio.mp3"
        self.assertTrue(F.allowed_audio(safe))
        self.assertTrue(F.allowed_audio(relay))
        self.assertFalse(F.allowed_audio("https://attacker.example/audio.mp3"))
        self.assertFalse(F.allowed_audio("http://api.spreaker.com/download/episode/123/audio.mp3"))

        entity = {"id": "alpha", "name": "Alpha", "desc": {"en": ""}}
        items = [{"kind": "episode", "title": "One", "url": "https://example.test/one", "date": "2026-11-01",
                  "audio": "https://attacker.example/audio.mp3"}]
        xml = F.rss(entity, "en", "https://example.test/feed.xml", items)
        self.assertNotIn("<enclosure", xml)
        items[0]["audio"] = safe
        self.assertNotIn("<enclosure", F.rss(entity, "en", "https://example.test/feed.xml", items), "unknown byte size")
        items[0]["audio_length"] = 123
        self.assertIn('length="123"', F.rss(entity, "en", "https://example.test/feed.xml", items))

    def test_opml_contains_both_feed_languages(self):
        root = ET.fromstring(F.opml("https://example.test"))
        links = [node.get("xmlUrl") for node in root.findall(".//outline[@type='rss']")]
        self.assertTrue(any(url.startswith("https://example.test/entity/") for url in links))
        self.assertTrue(any(url.startswith("https://example.test/de/entity/") for url in links))


if __name__ == "__main__":
    unittest.main()
