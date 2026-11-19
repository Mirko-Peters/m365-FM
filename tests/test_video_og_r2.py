"""YouTube-Vorschaubilder im eigenen Bucket: og_video (Discover >= 1200 px) und die Quellenliste von tools/r2_upload.py.
Lauf: python3 -m unittest tests/test_video_og_r2.py"""
import importlib.util
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_r2 as R2  # noqa: E402
_spec = importlib.util.spec_from_file_location("r2_upload", ROOT / "tools" / "r2_upload.py")
try:
    UP = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(UP)
except ImportError:   # Pillow fehlt lokal
    UP = None

U = "https://i.ytimg.com/vi/abc123XYZ_-/maxresdefault.jpg"
B = "https://img.m365.fm/yt/abc123.webp"


class T(unittest.TestCase):
    def test_og_video(self):
        self.assertEqual(R2.og_video("abc123XYZ_-", mp={U: B}, dims={B: [1280, 720]}), (B, 1280, 720))
        self.assertIsNone(R2.og_video("abc123XYZ_-", mp={}, dims={}))                         # nicht kopiert
        self.assertIsNone(R2.og_video("abc123XYZ_-", mp={U: B}, dims={}))                     # Masse unbekannt
        self.assertIsNone(R2.og_video("abc123XYZ_-", mp={U: B}, dims={B: [640, 360]}))        # zu schmal fuer Discover
        self.assertIsNone(R2.og_video("abc123XYZ_-", mp={U: U}, dims={U: [1280, 720]}))       # nur kopierte (img.m365.fm) zaehlen

    def test_quellenliste(self):
        if UP is None: self.skipTest("Pillow fehlt")
        urls = UP.youtube_thumbs()
        self.assertTrue(urls); self.assertTrue(all(u.startswith("https://i.ytimg.com/vi/") and u.endswith("default.jpg") for u in urls))
        self.assertEqual(len(urls) % 3, 0)


if __name__ == "__main__":
    unittest.main()
