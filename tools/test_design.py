"""Offline-Regression: python3 tools/test_design.py."""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from site_design import lang_dropdown


class LanguageMenuTests(unittest.TestCase):
    def test_flag_only_on_summary(self):
        body = lang_dropdown("de", [
            ("de", "Deutsch", "/de/", "de"),
            ("en", "English", "/en/", "en"),
        ], "https://www.m365.fm")
        summary, menu = body.split("</summary>", 1)
        self.assertIn("<img", summary)
        self.assertNotIn("<img", menu)
        self.assertIn('href="/de/" hreflang="de" lang="de" aria-current=page>Deutsch</a>', menu)
        self.assertIn('href="/en/" hreflang="en" lang="en">English</a>', menu)


if __name__ == "__main__":
    unittest.main()
