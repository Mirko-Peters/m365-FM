import contextlib
import io
import tempfile
import unittest
from pathlib import Path

import site_size


class DocsSizeTest(unittest.TestCase):
    def test_warns_with_largest_files_at_warning_threshold(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "community").mkdir()
            (root / "community" / "data.json").write_bytes(b"x" * 91)
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                site_size.sizes(root, warning=90, limit=100)
            self.assertIn("::warning::", output.getvalue())
            self.assertIn("community/data.json", output.getvalue())

    def test_aborts_with_breakdown_at_limit(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "blog-import").mkdir()
            (root / "blog-import" / "part-1.json").write_bytes(b"x" * 101)
            output = io.StringIO()
            with contextlib.redirect_stdout(output), self.assertRaisesRegex(SystemExit, "Abbruch"):
                site_size.sizes(root, warning=90, limit=100)
            self.assertIn("::error::", output.getvalue())
            self.assertIn("blog-import/part-1.json", output.getvalue())


class R2PagesTest(unittest.TestCase):
    """Seiten der Sprachen ausser en/de liegen im R2-Bucket (r2out/), nicht in GitHub Pages (docs/): Grenze 980 MB (Bau 642, 11.11.2026)."""
    LANGS = ("de", "fr", "es", "ja", "ko", "ru")

    def test_language_pages_go_to_r2out_not_docs(self):
        with tempfile.TemporaryDirectory() as tmp:
            out, r2 = Path(tmp) / "docs", Path(tmp) / "r2out"
            write, write_r2, n = site_size.writers(out, r2, lambda c: c.replace("x.podpage.com", "img.m365.fm"), self.LANGS)
            to_r2 = ["fr/some-dub-episode/index.html", "ja/tag/copilot/index.html", "ko/c/security/index.html", "ru/community/events/m365con/index.html",
                     "es/directory/de/berlin/index.html", "fr/show/episodes/page/2/index.html", "fr/community/u/mirko-p/blog/index.html", "translations-blog.json", "blog-import/part-1.json"]
            to_docs = ["fr/index.html", "de/some-dub-episode/index.html", "de/tag/copilot/index.html", "show/episodes/a/index.html", "community/u/mirko-p/blog/a/index.html",
                       "entity/index.html", "fr/community/blog/feed.xml", "ru/community/events/m365con/event.ics", "fr/llms.txt", "fr/mvp/sw.js", "sitemap-fr-blog.xml", "index.html"]
            for rel in to_r2 + to_docs: write(rel, '<img src="https://x.podpage.com/a.png">')
            for rel in to_r2:
                self.assertTrue((r2 / rel).is_file(), rel); self.assertFalse((out / rel).exists(), rel)
            for rel in to_docs:
                self.assertTrue((out / rel).is_file(), rel); self.assertFalse((r2 / rel).exists(), rel)
            self.assertIn("img.m365.fm", (r2 / to_r2[0]).read_text("utf-8")); self.assertIn("img.m365.fm", (out / "fr/index.html").read_text("utf-8"))
            self.assertIn("podpage", (out / "fr/llms.txt").read_text("utf-8"), "Bild-URLs nur in HTML/JSON/XML umschreiben")
            self.assertEqual(n[0], len(to_r2))
            write_r2("entity/x/index.html", "e"); self.assertTrue((r2 / "entity/x/index.html").is_file()); self.assertEqual(n[0], len(to_r2) + 1)

    def test_rule(self):
        self.assertTrue(site_size.r2_only("pl/x/index.html", self.LANGS + ("pl",)))
        self.assertFalse(site_size.r2_only("pl/index.html", self.LANGS + ("pl",)), "Startseite der Sprache bleibt in GitHub Pages")
        self.assertFalse(site_size.r2_only("en/x/index.html", self.LANGS + ("en",)), "Englisch bleibt in GitHub Pages")
        self.assertFalse(site_size.r2_only("xx/x/index.html", self.LANGS), "nur Sprachpfade")

    def test_site_build_routes_all_languages_but_en_de(self):
        import generate_site as G
        from site_i18n import COMM_LANGS
        self.assertIn("writers(OUT, R2OUT, R2.rewrite, LANGS)", Path(G.__file__).read_text("utf-8"), "Seitenbau schreibt ueber site_size.writers")
        self.assertEqual({l for l in G.LANGS if l not in site_size.PAGES_LANGS}, set(COMM_LANGS) - {"en", "de"}, "alle 13 Sprachen ausser en/de nach r2out/")


if __name__ == "__main__":
    unittest.main()
