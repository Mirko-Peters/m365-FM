"""Fruehere Blogbeitraege mit "-" am Anfang des Podpage-Slugs (site_podpage.BLOG_ALIAS): alte Beitraege und ihre Sprachfassungen verlinken
sie unter dem Slug des vollen Titels (/blog/private-vs-shared-channels-in-microsoft-teams-a-practical-decision-guide/), den es nie gab.
site_legacy_blog.fix() schreibt solche Links beim Bau direkt auf den Beitrag um, und show/redirects.json leitet die Alias-Adressen per 301 weiter.
Die echten Slugs bleiben unveraendert (bestehende Adressen)."""
import gzip
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_legacy_blog as LBL   # noqa: E402
import site_links as SL   # noqa: E402
import site_podpage as PP   # noqa: E402

FULL = "private-vs-shared-channels-in-microsoft-teams-a-practical-decision-guide"
REAL = "-a-practical-decision-guide"
AI = "-ai-stewardship-at-microsoft-sustainable-innovation-with-responsible-ai"
BASE = "https://www.m365.fm"


class AliasDataTest(unittest.TestCase):
    def test_aliases_point_to_existing_hyphen_posts(self):
        posts = json.loads(gzip.open(ROOT / "data" / "podpage" / "blog_posts.json.gz", "rt", encoding="utf-8").read())
        slugs = {p["slug"] for p in posts if p.get("title") and p.get("html")}
        al = PP.blog_aliases(slugs)
        self.assertEqual(al[FULL], REAL)
        self.assertEqual(al[AI[1:]], AI)
        for a, s in PP.BLOG_ALIAS.items():
            self.assertIn(s, slugs, f"Ziel {s} fehlt")
            self.assertNotIn(a, slugs, f"Alias {a} ist selbst ein Beitrag")
            self.assertTrue(s.startswith("-"))

    def test_alias_ignored_when_it_is_a_real_post_or_target_missing(self):
        self.assertEqual(PP.blog_aliases({REAL, FULL}), {"a-practical-decision-guide": REAL})
        self.assertEqual(PP.blog_aliases({"x"}), {})


class RedirectTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.table = PP.redirect_table(*PP.table_inputs(), LG=("de",), docs=Path(tempfile.mkdtemp()))[0]

    def test_alias_paths_redirect_to_post(self):
        for a, s in ((FULL, REAL), ("a-practical-decision-guide", REAL), (AI[1:], AI)):
            for pre in ("/blog/", "/show/blog/", "/community/u/mirko-p/blog/"):
                self.assertEqual(self.table.get(pre + a), f"/community/u/mirko-p/blog/{s}/", pre + a)

    def test_real_slugs_unchanged(self):
        self.assertEqual(self.table.get("/blog/" + REAL), f"/community/u/mirko-p/blog/{REAL}/")
        self.assertNotIn("/community/u/mirko-p/blog/" + REAL, self.table)

    def test_worker_mirror_one_hop(self):
        class Built(SL.Site):
            def where(self, path):
                return "docs" if path == f"/community/u/mirko-p/blog/{REAL}/" else None
        res = SL.Resolver(self.table, Built())
        for path in (f"/blog/{FULL}/", f"/blog/{FULL}", f"/show/blog/{FULL}/", f"/community/u/mirko-p/blog/{FULL}/", f"/community/u/mirko-peters/blog/{FULL}/"):
            self.assertEqual(res.resolve(SL.WWW, path), ("redirect", SL.WWW, f"/community/u/mirko-p/blog/{REAL}/"), path)
        self.assertEqual(res.resolve("m365.fm", f"/blog/{FULL}/"), ("redirect", SL.WWW, f"/community/u/mirko-p/blog/{REAL}/"))


class FixTest(unittest.TestCase):
    """items(): Links im Original und in den Sprachfassungen (translations mit derselben fix-Funktion) zeigen direkt auf den Beitrag."""

    def run_items(self, de_html):
        links = ("".join(f'<a href="{h}">x</a>' for h in (
            f"https://www.m365.fm/blog/{FULL}/", f"https://m365.fm/blog/{FULL}", f"/blog/{FULL}#faq", f"/show/blog/{FULL}/",
            f"https://www.m365.fm/community/u/mirko-p/blog/{FULL}/", f"https://www.m365.fm/blog/{AI[1:]}/", f"https://www.m365.fm/blog/{REAL}/",
            "https://www.m365.fm/blog/does-not-exist/", "https://m365.show/blog/" + FULL + "/")))
        posts = [{"slug": "linker", "title": "Linker", "html": f"<p>{links}</p>", "iso": "2025-01-02T00:00:00Z"},
                 {"slug": REAL, "title": "Private vs Shared Channels in Microsoft Teams: A Practical Decision Guide", "html": "<p>a</p>", "iso": "2025-01-01T00:00:00Z"},
                 {"slug": AI, "title": "AI Stewardship at Microsoft: Sustainable Innovation With Responsible AI", "html": "<p>b</p>", "iso": "2025-01-01T00:00:00Z"}]
        load = lambda name: posts if name == "blog_posts" else []
        with patch.object(LBL.P, "load", side_effect=load), patch.object(LBL.TOP, "score_topics", return_value=[]), patch.object(LBL.TOP, "save", lambda: None), \
                patch.object(LBL.SBR, "Index", lambda: None), patch.object(LBL, "tr_config", return_value=(["de"], [])), \
                patch("translate_blog.load_lang", return_value={}), patch("translate_blog.assemble", return_value=("Titel", "d", de_html, [])), \
                patch("site_i18n_overrides.note_blog", lambda *a, **k: None), patch.dict(LBL.EN_HTML), patch.dict(LBL.TITLES), patch.dict(LBL.TOPICS), \
                patch.dict(LBL._HERO_EP), patch.dict(LBL._ROWS):   # Modulzustand nach dem Test wie vorher
            return {(x["slug"], x["lang"]): x for x in LBL.items(BASE)}

    def test_original_and_translation_link_to_real_slug(self):
        de = f'<p><a href="https://www.m365.fm/blog/{FULL}/">hier</a> <a href="/blog/{AI[1:]}">da</a></p>'
        out = self.run_items(de)
        en = out[("linker", "en")]["html"]
        want = f'href="{BASE}/community/u/mirko-p/blog/{REAL}/"'
        self.assertEqual(en.count(want), 6, en)
        self.assertEqual(en.count(f'href="{BASE}/community/u/mirko-p/blog/{AI}/"'), 1)
        self.assertNotIn(f"/blog/{FULL}/\"", en.replace("https://m365.show/blog/" + FULL + "/", ""))   # nur der Fremdlink (m365.show) bleibt
        self.assertIn('href="https://www.m365.fm/blog/does-not-exist/"', en)   # unbekannte Slugs bleiben wie bisher
        self.assertIn(f'href="https://m365.show/blog/{FULL}/"', en)
        tr = out[("linker", "de")]["html"]
        self.assertIn(want, tr)
        self.assertIn(f'href="{BASE}/community/u/mirko-p/blog/{AI}/"', tr)
        self.assertNotIn(FULL, tr)


if __name__ == "__main__":
    unittest.main()
