"""CTR-Texte (data/seo_overrides.json): Form der Eintraege, bestehende Seiten, Wirkung in page()."""
import gzip
import html
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import generate_site as G   # noqa: E402

OV = json.loads((ROOT / "data" / "seo_overrides.json").read_text("utf-8"))
BLOG = "/community/u/mirko-p/blog/"


class Form(unittest.TestCase):
    def test_not_empty(self):
        self.assertGreaterEqual(len(OV), 60)

    def test_keys_are_paths(self):
        for k in OV:
            self.assertTrue(k.startswith("/") and k.endswith("/"), k)
            self.assertNotIn("//", k)

    def test_blog_keys_are_existing_posts(self):
        slugs = {p["slug"] for p in json.load(gzip.open(ROOT / "data" / "podpage" / "blog_posts.json.gz"))}
        for k in OV:
            if k.startswith(BLOG):
                self.assertIn(k[len(BLOG):-1], slugs, k)

    def test_lengths(self):
        for k, v in OV.items():
            self.assertLessEqual(len(v["title"]), 60, k)
            self.assertGreaterEqual(len(v["title"]), 20, k)
            self.assertTrue(100 <= len(v["description"]) <= 155, (k, len(v["description"])))
            self.assertTrue(v["description"].rstrip().endswith((".", "?", "!")), k)

    def test_titles_unique(self):
        t = [v["title"].lower() for v in OV.values()]
        self.assertEqual(len(t), len(set(t)))

    def test_descriptions_unique(self):
        d = [v["description"] for v in OV.values()]
        self.assertEqual(len(d), len(set(d)))

    def test_no_brand_no_year_no_ellipsis(self):
        for k, v in OV.items():
            self.assertNotRegex(v["title"], r"M365[ .]?FM", k)
            self.assertNotIn("…", v["title"] + v["description"], k)
            self.assertNotRegex(v["title"], r"20\d\d", k)

    def test_title_survives_seo_title(self):
        for k, v in OV.items():
            out = G.seo_title(v["title"])
            self.assertNotIn("…", out, k)
            self.assertLessEqual(len(out), 70, k)


class Applied(unittest.TestCase):
    def render(self, canonical, title="Originaltitel der Seite", desc="Originale Beschreibung."):
        return G.page("en", title, desc, canonical, "<main><h1>Originaltitel der Seite</h1></main><footer></footer>")

    def test_override_replaces_title_and_description(self):
        k = next(iter(OV))
        h = self.render(G.BASE + k)
        t = re.search(r"<title>(.*?)</title>", h).group(1)
        self.assertIn(html.escape(OV[k]["title"], quote=False), t)
        d = re.search(r'<meta name="description" content="(.*?)">', h).group(1)
        self.assertEqual(html.unescape(d), OV[k]["description"])
        self.assertIn(f'<meta property="og:description" content="{d}">', h)
        self.assertIn(f'<meta name="twitter:description" content="{d}">', h)

    def test_visible_title_and_og_title_unchanged(self):
        k = next(iter(OV))
        h = self.render(G.BASE + k)
        self.assertIn('<meta property="og:title" content="Originaltitel der Seite">', h)
        self.assertIn('<meta name="twitter:title" content="Originaltitel der Seite">', h)
        self.assertNotIn("Originaltitel der Seite |", re.search(r"<title>(.*?)</title>", h).group(1))

    def test_other_pages_untouched(self):
        h = self.render(G.BASE + "/nicht-in-der-liste/")
        self.assertIn("<title>Originaltitel der Seite | M365.FM</title>", h)
        self.assertIn('content="Originale Beschreibung."', h)

    def test_other_language_path_untouched(self):
        # Overrides gelten nur fuer den exakten Pfad: /de/... bleibt wie es ist
        h = G.page("de", "Deutscher Titel", "Deutsche Beschreibung.", G.BASE + "/de" + next(iter(OV)), "<main><h1>x</h1></main><footer></footer>")
        self.assertIn("<title>Deutscher Titel | M365.FM</title>", h)

    def test_foreign_host_canonical_untouched(self):
        k = next(iter(OV))
        h = G.page("en", "Fremd", "Fremd.", "https://example.org" + k, "<main><h1>x</h1></main><footer></footer>")
        self.assertIn("<title>Fremd | M365.FM</title>", h)


if __name__ == "__main__":
    unittest.main()
