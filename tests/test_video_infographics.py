"""Videoseiten (Sticky Man): Infografiken der englischen Folge. Ohne Freigabe der Art "episode" bleibt die Seite unveraendert.
Lauf: python3 -m unittest tests/test_video_infographics.py"""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_infographics as IG  # noqa: E402

SRC = (ROOT / "generate_site.py").read_text("utf-8")


class T(unittest.TestCase):
    def setUp(self): IG.reset()

    def test_ohne_freigabe_unveraendert(self):
        IG.live()   # liest die echte Freigabe; zum Test leeren
        IG._LIVE[:] = [(frozenset(), frozenset())]
        self.assertEqual(IG.hero_figure("episode", "x", "de"), "")
        self.assertEqual(IG.inject("<p>a</p><p>b</p>", "episode", "x", "de"), "<p>a</p><p>b</p>")
        self.assertEqual(IG.image_ld("https://b", "episode", "x", "de", "https://b/p/"), [])
        self.assertEqual(IG.page_kw("episode", "x", "de"), {})

    def test_videoseite_nutzt_die_bausteine(self):
        for needle in ('_igs = ORIG.get(vid)', 'IG.hero_figure("episode", _igs, l)', 'IG.inject(art_html, "episode", _igs, l)',
                       'ld + _nld + _ig_ld', 'IG.page_kw("episode", _igs, l)', '{_ig_hero or f\'<figure class="cover"'):
            self.assertIn(needle, SRC, needle)
        self.assertIn("import site_infographics as IG", SRC)


if __name__ == "__main__":
    unittest.main()
