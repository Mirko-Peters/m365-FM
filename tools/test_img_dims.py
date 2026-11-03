"""Offline-Regression: python3 tools/test_img_dims.py."""
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_img_dims as IMG
import site_fetch
with patch.object(site_fetch, "fetch", return_value={}):
    import site_podpage as P


class ImageDimensionTests(unittest.TestCase):
    def test_known_dimensions_are_added(self):
        url = "https://img.m365.fm/i/test.webp"
        with patch.object(IMG, "DIMS", {url: [640, 360]}):
            result = P.san(f'<p>Text &amp; more</p><img src="{url}" alt="Sample">')
        self.assertIn('width="640" height="360"', result)
        self.assertIn('decoding="async"', result)
        self.assertIn("<p>Text &amp; more</p>", result)

    def test_existing_dimensions_are_preserved(self):
        url = "https://img.m365.fm/i/icon.webp"
        with patch.object(IMG, "DIMS", {url: [640, 360]}):
            result = P.san(f'<img src="{url}" width="16" height="16" alt="icon">')
        self.assertIn('width="16" height="16"', result)

    def test_unknown_dimensions_get_class_only(self):
        result = P.san('<img src="https://img.m365.fm/i/unknown.webp" alt="badge">')
        self.assertIn('class="img-no-dims"', result)
        self.assertNotIn("width=", result)
        self.assertNotIn("height=", result)
        self.assertIn('decoding="async"', result)

    def test_html_is_escaped(self):
        result = P.san('<p>Tom & Jerry</p><img src="https://img.m365.fm/i/test.webp" alt="A & B">')
        self.assertIn("<p>Tom &amp; Jerry</p>", result)
        self.assertIn('alt="A &amp; B"', result)


if __name__ == "__main__":
    unittest.main()
