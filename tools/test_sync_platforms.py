"""Offline-Regressions: python3 tools/test_sync_platforms.py."""
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import sync_platforms as S
import sync_show_notes as SN
with patch("site_fetch.fetch", return_value={}):
    import site_podpage as PP


class PlatformSyncTests(unittest.TestCase):
    def test_only_main_show_persists_rss_guid(self):
        xml = """<rss><channel><item>
          <title>Episode title</title><guid>spreaker-guid</guid>
          <enclosure url="https://api.spreaker.com/episode/123456/audio.mp3"/>
          <pubDate>Sat, 31 Oct 2026 18:00:00 +0000</pubDate>
        </item></channel></rss>"""
        english = SN.parse_feed(xml, include_guid=True)
        localized = SN.parse_feed(xml)
        self.assertEqual(english["123456"]["guid"], "spreaker-guid")
        self.assertNotIn("guid", localized["123456"])

    def test_apple_guid_match_precedes_title_and_date(self):
        own = {"123": {"title": "Originaler Titel", "date": "2026-01-01", "guid": "rss-guid"}}
        candidates = [
            {"title": "Originaler Titel", "date": "2026-01-01", "guid": "different-guid",
             "url": "https://podcasts.apple.com/episode?i=wrong"},
            {"title": "Abweichender Titel", "date": "2026-06-01",
             "guid": "rss-guid", "url": "https://podcasts.apple.com/episode?i=123"},
        ]
        self.assertEqual(S.match_apple(own, candidates)[0],
                         {"123": "https://podcasts.apple.com/episode?i=123"})

    def test_apple_show_requires_exact_feed_url(self):
        feed = "https://www.spreaker.com/show/7/episodes/feed"
        response = {"results": [
            {"feedUrl": "https://wrong.example/feed", "collectionId": 1},
            {"feedUrl": feed, "collectionId": 2},
        ]}
        with patch.object(S, "show_feed_url", return_value=feed), \
             patch.object(S, "get_text", return_value="<rss><channel><title>Show</title></channel></rss>"), \
             patch.object(S, "get", return_value=response):
            self.assertEqual(S.apple_show_id("en", {}), "2")

    def test_legacy_keys_migrate_and_manual_link_wins(self):
        links = {"123:en": {
                     "spotify": "https://open.spotify.com/episode/old",
                     "deezer": "https://www.deezer.com/episode/old",
                     "youtube": "https://youtube.com/watch?v=old",
                     "youtube_music": "https://music.youtube.com/podcast/old",
                 },
                 "123": {"apple": "https://podcasts.apple.com/auto"}}
        aliases = {"123:en": "123"}
        S.migrate_links(links, aliases)
        manual = S.normalize_manual({"123:en": {"apple": "https://podcasts.apple.com/manual"}}, aliases)
        links.setdefault("123", {}).update(manual["123"])
        self.assertEqual(links["123"], {"apple": "https://podcasts.apple.com/manual"})
        rendered = PP.platform_episode_links(links, "123", "123:en")
        self.assertEqual(rendered, {
            "apple": "https://podcasts.apple.com/manual",
            "spotify": "https://open.spotify.com/episode/old",
            "deezer": "https://www.deezer.com/episode/old",
            "youtube": "https://youtube.com/watch?v=old",
            "youtube_music": "https://music.youtube.com/podcast/old",
        })

    def test_legacy_localized_keys_remain_unchanged(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "episodes").mkdir()
            (root / "data").mkdir()
            (root / "episodes" / "video.json").write_text(json.dumps({"de": {"title": "Titel"}}), encoding="utf-8")
            (root / "data" / "published.json").write_text(json.dumps({
                "video:de": {"episode_id": 456, "at": "2026-01-01T00:00:00+00:00"}
            }), encoding="utf-8")
            with patch.object(S, "ROOT", root), patch.object(S, "DATA", root / "data"):
                own, aliases = S.own_episodes("de")
            self.assertEqual(list(own), ["video:de"])
            self.assertEqual(aliases, {})

    def test_apple_search_cadence(self):
        state = {"first_missing": "2026-10-01", "last_search": "2026-10-31"}
        self.assertFalse(S.should_search_apple(state, "2026-11-01")[1])
        self.assertTrue(S.should_search_apple(state, "2026-11-07")[1])

    def test_main_migrates_keys_and_preserves_manual_override(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            data = root / "data"
            (data / "show_notes").mkdir(parents=True)
            (root / "episodes").mkdir()
            (data / "show_notes" / "en.json").write_text(json.dumps({
                "episodes": {"123": {"id": "123", "title": "Titel", "published": "2026-01-01",
                                     "guid": "rss-guid", "duration": 120}}
            }), encoding="utf-8")
            (data / "platforms.json").write_text(json.dumps({"en": {"apple_id": "55", "spotify_id": ""}}), encoding="utf-8")
            (data / "episode_links.json").write_text(json.dumps({
                "123:en": {"deezer": "https://www.deezer.com/episode/old"}
            }), encoding="utf-8")
            (data / "episode_links_manual.json").write_text(json.dumps({
                "123:en": {"apple": "https://podcasts.apple.com/manual"}
            }), encoding="utf-8")
            connectors = {
                "apple": lambda *_: [{"title": "Titel", "date": "2026-01-01",
                                      "guid": "rss-guid", "url": "https://podcasts.apple.com/auto"}],
                "spotify": lambda *_: [],
            }
            with patch.object(S, "ROOT", root), patch.object(S, "DATA", data), \
                 patch.object(S, "CONNECTORS", connectors), patch.object(S, "podpage_candidates", return_value={}), \
                 patch.object(S, "spotify_token", return_value=None), patch.object(S, "apple_search", return_value=[]):
                S.main()

            links = json.loads((data / "episode_links.json").read_text(encoding="utf-8"))
            report = json.loads((data / "episode_links_report.json").read_text(encoding="utf-8"))
            self.assertEqual(links["123"]["apple"], "https://podcasts.apple.com/manual")
            self.assertEqual(links["123:en"]["deezer"], "https://www.deezer.com/episode/old")
            self.assertEqual(report["shows"]["en"]["apple"]["linked"], 1)


if __name__ == "__main__":
    unittest.main()
