import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_player as P


class SpreakerPlayerTests(unittest.TestCase):
    def test_facade_defers_player_and_escapes_content(self):
        markup = P.facade("12345", 'R&D <show>', "https://img.m365.fm/i/cover.webp", "PT1H2M3S")
        self.assertIn('data-spreaker-id="12345"', markup)
        self.assertIn('aria-label="Folge abspielen"', markup)
        self.assertIn("R&amp;D &lt;show&gt;", markup)
        self.assertIn('width="120" height="120"', markup)
        self.assertIn("1:02:03", markup)
        self.assertNotIn("<iframe", markup)
        self.assertNotIn("widget.spreaker.com", markup)

    def test_facade_never_loads_unmapped_cover_hosts(self):
        markup = P.facade("12345", "Episode", "https://images.example/cover.jpg")
        self.assertNotIn("images.example", markup)
        self.assertNotIn("<img", markup)
        self.assertNotIn("<img", P.facade("12345", "Episode", "https://img.m365.fm:invalid/cover.jpg"))

    def test_invalid_episode_id_has_no_facade(self):
        self.assertEqual(P.facade("../123", "Episode"), "")


if __name__ == "__main__":
    unittest.main()
