import sys
import datetime as dt
import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import tools.sponsor_metrics as metrics


class SponsorMetricTests(unittest.TestCase):
    def test_metric_rows_keep_real_zeroes_and_reject_invalid_values(self):
        self.assertEqual(metrics.row("placement", "2026-11-03", "page_views", 0, "/page/", "cloudflare")["value"], 0)
        self.assertIsNone(metrics.row("placement", "2026-11-03", "page_views", -1, "/page/", "cloudflare"))
        self.assertIsNone(metrics.row("placement", "not-a-day", "page_views", 3, "/page/", "cloudflare"))

    def test_video_references_are_validated_and_deduplicated(self):
        placement = {"refs": '{"video_ids":["abcde12345","abcde12345","https://example.test/","x"]}'}
        self.assertEqual(metrics.video_ids(placement), ["abcde12345"])

    def test_page_paths_are_restricted_to_site_paths_and_expanded_by_language(self):
        record = {"entities": ["mirko-peters", "../outside"], "posts": ["/community/story/?utm_source=x", "https://evil.test/"]}
        placement = {"langs": "en,de"}
        paths = metrics.page_paths(record, placement)
        self.assertIn("/entity/mirko-peters/", paths)
        self.assertIn("/de/entity/mirko-peters/", paths)
        self.assertIn("/community/story/", paths)
        self.assertNotIn("/de/../outside/", paths)
        self.assertFalse(any("evil.test" in path for path in paths))

    def test_dub_episode_paths_and_spreaker_ids_use_published_language_episode(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / "data").mkdir()
            (root / "episodes").mkdir()
            (root / "data" / "sponsorships.json").write_text(json.dumps({"sponsorships": [
                {"id": "p1", "episodes": ["de/hello-world-this-is-a-test"]}
            ]}), encoding="utf-8")
            (root / "data" / "published.json").write_text(
                json.dumps({"video123456:de": {"episode_id": 12345678}}), encoding="utf-8")
            (root / "episodes" / "video123456.json").write_text(
                json.dumps({"de": {"title": "Hello World This Is A Test"}}), encoding="utf-8")
            metrics.dub_episode_ids.cache_clear()
            with patch.object(metrics, "ROOT", root):
                placement = {"id": "p1", "langs": "de"}
                record = {"episodes": ["de/hello-world-this-is-a-test"]}
                self.assertEqual(metrics.page_paths(record, placement), ["/de/hello-world-this-is-a-test/"])
                self.assertEqual(metrics.episode_ids(placement), ["12345678"])
            metrics.dub_episode_ids.cache_clear()

    def test_main_retries_four_days_and_posts_batches_of_at_most_500(self):
        calls, posted = [], []

        def placements(url, data=None, headers=None, timeout=40):
            if url.endswith("/api/internal/sponsor-placements"):
                return 200, {"placements": [{"id": "p1"}]}, {}
            posted.append(json.loads(data)["metrics"])
            return 200, {}, {}

        def many_rows(_placements, day, out, statuses):
            calls.append(day)
            out.extend({"placement_id": "p1", "day": day, "metric": "podcast_plays", "value": 1,
                        "dim": "", "source": "spreaker", "kind": "measured"} for _ in range(501))
            statuses["Spreaker"] = "Abruf abgeschlossen"

        def noop(name):
            return lambda _placements, _day, _out, statuses: statuses.__setitem__(name, "Abruf abgeschlossen")

        with patch.dict(os.environ, {"CRON_KEY": "test-key"}), \
             patch.object(metrics, "json_request", side_effect=placements), \
             patch.object(metrics, "spreaker", side_effect=many_rows), \
             patch.object(metrics, "youtube", side_effect=noop("YouTube Analytics")), \
             patch.object(metrics, "cloudflare", side_effect=noop("Cloudflare")), \
             patch.object(metrics, "gsc", side_effect=noop("Google Search Console")), \
             patch.object(metrics, "bing", side_effect=noop("Bing Webmaster API")), \
             patch.object(metrics, "press_ranger", side_effect=noop("Press Ranger")):
            self.assertEqual(metrics.main(dt.date(2026, 11, 5)), 0)
        self.assertEqual(set(calls), {"2026-11-04", "2026-11-03", "2026-11-02", "2026-11-01"})
        self.assertEqual(len(posted), 5)
        self.assertTrue(all(0 < len(batch) <= 500 for batch in posted))


if __name__ == "__main__":
    unittest.main()
