"""Seite 2 ff. aller paginierten Listen steht auf noindex,follow (Mirko, 18.11.2026): Blog-Verzeichnisse und Hub-/page/N/-Seiten.
Seite 1 bleibt unveraendert (index, Sitemap); Folgenlisten (site_podpage) waren schon so."""
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))

from test_index_rule import BASE, blog_post, build_blog, words  # noqa: E402


class BlogDirectoryPagination(unittest.TestCase):
    def test_pages_two_and_up_are_noindex_and_not_in_sitemap(self):
        files = {}
        pages, sitemap = build_blog([blog_post(f"p{i:03d}", "de", body=words(40), published=1793836800 - i) for i in range(250)], files)
        first, p2, p3 = (f"{BASE}/de/community/blog/", f"{BASE}/de/community/blog/page/2/", f"{BASE}/de/community/blog/page/3/")
        self.assertFalse(pages[first]["noindex"])
        self.assertTrue(pages[p2]["noindex"])
        self.assertTrue(pages[p3]["noindex"])
        urls = [s[0] for s in sitemap]
        self.assertIn(first, urls)
        self.assertNotIn(p2, urls)
        self.assertNotIn(p3, urls)

    def test_author_directory_follows_the_same_rule(self):
        pages, sitemap = build_blog([blog_post(f"q{i:03d}", "de", body=words(40), published=1793836800 - i) for i in range(150)])
        first, p2 = f"{BASE}/de/community/u/anna/blog/", f"{BASE}/de/community/u/anna/blog/page/2/"
        self.assertFalse(pages[first]["noindex"])
        self.assertTrue(pages[p2]["noindex"])
        self.assertNotIn(p2, [s[0] for s in sitemap])


class HubPagination(unittest.TestCase):
    def test_hub_page_n_is_written_with_noindex(self):
        src = (ROOT / "generate_site.py").read_text("utf-8")
        i = src.index('write(f"{_pre}page/{_n}/index.html"')
        call = src[i:i + 600]
        self.assertRegex(call, r"noindex=True")
        self.assertIn("_purl(_n)", call)   # weiter kanonisch auf sich selbst (tools/check_pager.py)


if __name__ == "__main__":
    unittest.main()
