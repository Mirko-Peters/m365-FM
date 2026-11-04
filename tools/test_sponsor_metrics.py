import sys
import unittest
from pathlib import Path

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


if __name__ == "__main__":
    unittest.main()
