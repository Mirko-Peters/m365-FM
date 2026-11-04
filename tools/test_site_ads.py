"""Offline-Regressionsprüfungen für feste AdSense-Blöcke."""
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_ads as ADS


BASE = "https://www.m365.fm"
CONFIG = {
    "enabled": True,
    "publisher": "pub-1234567890",
    "domain": "www.m365.fm",
    "slots": {"top": "", "mid": "mid-slot", "end": "end-slot"},
    "min_chars": 10,
    "skip_paths": ["/community/", "/sponsor/", "/impressum/"],
}
BODY = ('<header><nav>Navigation</nav></header><main class="wrap"><article>'
        '<h1>Folgentitel</h1><p class="lede">Einleitung</p>'
        '<h2>Abschnitt eins</h2><p>Text</p><h2>Abschnitt zwei</h2><p>Text</p>'
        '<h2>Abschnitt drei</h2><p>Text</p></article></main><footer>Footer</footer>')
DUB_BODY = BODY.replace(
    '<h1>Folgentitel</h1>',
    '<h1>Folgentitel</h1><p class="sub">Untertitel</p>',
).replace(
    '<h2>Abschnitt eins</h2>',
    '<div class="panel"><iframe src="https://widget.spreaker.com/player?episode_id=123"></iframe></div><h2>Abschnitt eins</h2>',
)


class AdsTests(unittest.TestCase):
    def inject(self, path, body=BODY, noindex=False):
        with patch.object(ADS, "cfg", return_value=CONFIG):
            return ADS.inject(BASE, body, "de", BASE + path, noindex)

    def test_top_follows_h1_and_first_paragraph_and_uses_mid_fallback(self):
        result = self.inject("/show/episodes/dubfolge/")
        h1_end = result.index("</h1>")
        intro_end = result.index("</p>", h1_end)
        top = result.index('class="ad ad-top"')
        self.assertGreater(top, intro_end)
        self.assertLess(top, result.index("<h2>Abschnitt eins"))
        self.assertIn('data-ad-slot="mid-slot"', result[top:])
        self.assertIn('data-ad-format="horizontal"', result[top:])
        self.assertEqual(result.count('class="ad ad-top"'), 1)

    def test_dub_episode_url_is_recognized_without_matching_other_pages(self):
        result = self.inject("/de/dubfolge/", DUB_BODY)
        self.assertGreater(result.index('class="ad ad-top"'), result.index("</p>", result.index('class="lede"')))
        self.assertNotIn('class="ad ad-top"', self.inject("/de/article-slug/"))

    def test_custom_top_slot_and_sidebar_boundary(self):
        body = BODY.replace(
            '<main class="wrap"><article>',
            '<main class="wrap"><div class="shmain"><article>',
        ).replace(
            '</article></main>',
            '</article></div><aside class="sbar">Sidebar</aside></main>',
        )
        with patch.object(ADS, "cfg", return_value={**CONFIG, "slots": {**CONFIG["slots"], "top": "top-slot"}}):
            result = ADS.inject(BASE, body, "de", BASE + "/entity/copilot/")
        self.assertIn('data-ad-slot="top-slot"', result)
        self.assertLess(result.index('class="ad ad-top"'), result.index('class="sbar"'))
        self.assertNotIn('class="ad ad-top"', result[result.index('class="sbar"'):])

    def test_top_is_limited_to_content_detail_pages(self):
        for path in ("/", "/de/", "/page/2/", "/community/", "/sponsor/", "/impressum/"):
            with self.subTest(path=path):
                self.assertNotIn('class="ad ad-top"', self.inject(path))
        self.assertNotIn('class="ad ad-top"', self.inject("/entity/copilot/", noindex=True))

    def test_blog_article_gets_only_top_despite_community_skip_path(self):
        result = self.inject("/community/u/mirko-p/blog/an-article/")
        self.assertIn('class="ad ad-top"', result)
        self.assertNotIn('data-ad-slot="end-slot"', result)

    def test_reserved_unfilled_top_height_and_existing_blocks(self):
        self.assertIn(".ad.ad-top{box-sizing:border-box;height:8.25rem;min-height:8.25rem", ADS.CSS)
        self.assertIn(".ad.ad-top:has(ins[data-ad-status=unfilled]) .ad-house", ADS.CSS)
        result = self.inject("/show/episodes/dubfolge/")
        self.assertIn('data-ad-slot="mid-slot"', result)
        self.assertIn('data-ad-slot="end-slot"', result)
        self.assertIn('<footer>', result)
        with patch.object(ADS, "cfg", return_value=CONFIG):
            self.assertIn("adsbygoogle.js", ADS.head(BASE, result, BASE + "/show/episodes/dubfolge/"))


if __name__ == "__main__":
    unittest.main()
