"""Offline-Regressions: python3 tools/test_sync_platforms.py."""
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import platform_match as PM
import sync_platforms as S


class PlatformSyncTests(unittest.TestCase):
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
            self.assertEqual(S.apple_show_id("de", {}), "2")

    def test_legacy_keys_migrate_and_manual_link_wins(self):
        links = {"video:de": {"spotify": "https://open.spotify.com/episode/old"},
                 "123": {"apple": "https://podcasts.apple.com/auto"}}
        aliases = {"video:de": "123"}
        S.migrate_links(links, aliases)
        manual = S.normalize_manual({"video:de": {"apple": "https://podcasts.apple.com/manual"}}, aliases)
        links.setdefault("123", {}).update(manual["123"])
        self.assertEqual(links["123"], {
            "spotify": "https://open.spotify.com/episode/old",
            "apple": "https://podcasts.apple.com/manual",
        })
        self.assertIn("video:de", links)

    def test_duration_disambiguates_equal_title_matches(self):
        own = {"123": {"title": "Gleicher Titel", "date": "2026-01-01", "duration": 120}}
        candidates = [
            {"title": "Gleicher Titel", "date": "2026-01-01", "duration": 120,
             "url": "https://open.spotify.com/episode/right"},
            {"title": "Gleicher Titel", "date": "2026-01-01", "duration": 300,
             "url": "https://open.spotify.com/episode/wrong"},
        ]
        self.assertEqual(PM.match(own, candidates)[0],
                         {"123": "https://open.spotify.com/episode/right"})

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
            (data / "show_notes" / "de.json").write_text(json.dumps({
                "episodes": {"123": {"id": "123", "title": "Titel", "published": "2026-01-01",
                                     "guid": "rss-guid", "duration": 120}}
            }), encoding="utf-8")
            (root / "episodes" / "video.json").write_text(json.dumps({"de": {"title": "Titel"}}), encoding="utf-8")
            (data / "published.json").write_text(json.dumps({
                "video:de": {"episode_id": 123, "at": "2026-01-01T00:00:00+00:00"}
            }), encoding="utf-8")
            (data / "platforms.json").write_text(json.dumps({"de": {"apple_id": "55", "spotify_id": ""}}), encoding="utf-8")
            (data / "episode_links.json").write_text(json.dumps({
                "video:de": {"deezer": "https://www.deezer.com/episode/old"}
            }), encoding="utf-8")
            (data / "episode_links_manual.json").write_text(json.dumps({
                "video:de": {"apple": "https://podcasts.apple.com/manual"}
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
            self.assertEqual(links["123"]["deezer"], "https://www.deezer.com/episode/old")
            self.assertIn("video:de", links)
            self.assertEqual(report["shows"]["de"]["apple"]["linked"], 1)


if __name__ == "__main__":
    unittest.main()
