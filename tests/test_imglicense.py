"""Bildlizenz-Seite (CC BY 4.0): beide Sprachen, indexierbar, Umschalter, Sitemap, Ziel von acquireLicensePage (unittest)."""
import sys, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_imglicense as ILC
import site_infographics as IG


class Page(unittest.TestCase):
    def build(self):
        out, sm = {}, []
        def page(lang, title, desc, canonical, body, alternates=None, jsonld=None, xdefault=None, og_type="article", **kw):
            return f"<title>{title}</title>|{lang}|{canonical}|{kw.get('noindex', False)}|{kw.get('switch')}|{kw.get('share', True)}|{body}"
        ILC.build({"BASE": "https://www.m365.fm", "write": lambda p, h: out.__setitem__(p, h), "page": page, "sitemap": sm, "TODAY": "2026-11-19",
                   "header": lambda l, x: "<header></header>", "footer": lambda l: "<footer></footer>"})
        return out, sm

    def test_both_languages_written_indexable_without_share_buttons(self):
        out, sm = self.build()
        self.assertEqual(sorted(out), ["de/bildlizenz/index.html", "image-license/index.html"])
        for h in out.values(): self.assertIn("|False|", h); self.assertIn("creativecommons.org/licenses/by/4.0/", h); self.assertIn('rel="license', h)
        self.assertIn("|de|https://www.m365.fm/de/bildlizenz/|", out["de/bildlizenz/index.html"]); self.assertIn("|en|https://www.m365.fm/image-license/|", out["image-license/index.html"])
        self.assertEqual([u for u, _, _ in sm], ["https://www.m365.fm/image-license/", "https://www.m365.fm/de/bildlizenz/"])

    def test_page_names_covered_and_excluded_images(self):
        out, _ = self.build(); en = out["image-license/index.html"]
        self.assertIn("img.m365.fm/ig/", en); self.assertIn("Logos and product names", en); self.assertIn("mirko.peters@m365.fm", en)

    def test_image_nodes_point_to_this_page(self):
        import json, gzip, tempfile
        with tempfile.TemporaryDirectory() as t:
            d = Path(t); (d / "infographics").mkdir()
            ent = {"p1": {"s": "x", "en": [["bigfact", "aaaaaaaa", "H"], ["flow", "bbbbbbbb", "F"], ["hub", "cccccccc", "U"]], "de": [["bigfact", "dddddddd", "K"], ["flow", "eeeeeeee", "A"], ["hub", "ffffffff", "N"]]}}
            with gzip.open(d / "infographics" / "blog.json.gz", "wt") as f: json.dump(ent, f)
            (d / "infographics_live.json").write_text(json.dumps({"langs": ["en", "de"], "kinds": ["blog"]}))
            old = IG.D; IG.D = d; IG.reset()
            try:
                self.assertEqual({n["acquireLicensePage"] for n in IG.image_ld("https://www.m365.fm", "blog", "p1", "en", "u")}, {ILC.url("https://www.m365.fm", "en")})
                self.assertEqual({n["acquireLicensePage"] for n in IG.image_ld("https://www.m365.fm", "blog", "p1", "de", "u")}, {ILC.url("https://www.m365.fm", "de")})
            finally: IG.D = old; IG.reset()


if __name__ == "__main__":
    unittest.main()
