"""Pillar-Kompendien und Lernpfad (site_pillars.py, data/pillars.json, imports/pillars)."""
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_pillars as S

BASE = "https://www.m365.fm"
ALL = [(lang, p) for lang in S.LANGS for p in S.pillars()]


def ctx(**kw):
    return S.Ctx(BASE, kw.get("ents", set()), kw.get("en", set()), kw.get("de", set()))


class Registry(unittest.TestCase):
    def test_files_exist_and_slugs_unique(self):
        for lang in S.LANGS:
            slugs = [S.slug_of(p, lang) for p in S.pillars()]
            self.assertEqual(len(slugs), len(set(slugs)), lang)
            for s in slugs: self.assertTrue((ROOT / "imports" / "pillars" / lang / f"{s}.md").exists(), f"{lang}/{s}.md fehlt")

    def test_path_covers_each_pillar_once(self):
        ids = [i for st in S.registry()["path"]["stages"] for i in st["pillars"]]
        self.assertEqual(sorted(ids), sorted(p["id"] for p in S.pillars()))
        self.assertEqual(len(S.order()), len(ids))

    def test_texts_in_both_languages(self):
        pa = S.registry()["path"]
        for k in ("title", "seo_title", "short", "intro"): self.assertEqual(set(pa[k]), {"en", "de"}, k)
        self.assertLessEqual(max(len(v) for v in pa["seo_title"].values()), 60)
        for p in S.pillars(): self.assertEqual(set(p["label"]), {"en", "de"})


class Content(unittest.TestCase):
    def test_every_file_parses_with_seo_fields(self):
        for lang, p in ALL:
            d = S.parse_file(ROOT / "imports" / "pillars" / lang / f"{S.slug_of(p, lang)}.md")
            who = f"{lang}/{p['id']}"
            self.assertTrue(d["h1"] and len(d["article"].split()) > 5000, who)
            t = S.meta_value(d["meta"], "meta title", "meta-title"); ds = S.meta_value(d["meta"], "meta description", "meta-description")
            self.assertTrue(30 <= len(t) <= 60, f"{who} Title {len(t)}")
            self.assertTrue(80 <= len(ds) <= 160, f"{who} Description {len(ds)}")
            self.assertTrue(d["sources"] and d["author"], who)

    def test_no_internal_notes_in_published_parts(self):
        rx = re.compile(r"\[(?:Editor|Redaktion)|review log|Review-Protokoll|Editorial notes|Prüfhinweise|Wettbewerbsanalyse|Competitive analysis", re.I)
        for lang, p in ALL:
            d = S.parse_file(ROOT / "imports" / "pillars" / lang / f"{S.slug_of(p, lang)}.md")
            for part in ("article", "author", "sources"): self.assertIsNone(rx.search(d[part]), f"{lang}/{p['id']} {part}")

    def test_toulouse_never_published(self):
        for lang, p in ALL:
            d = S.parse_file(ROOT / "imports" / "pillars" / lang / f"{S.slug_of(p, lang)}.md")
            for part in ("article", "author", "sources"): self.assertNotIn("toulouse", d[part].lower(), f"{lang}/{p['id']} {part}")

    def test_ifakt_disclosure_in_every_author_box(self):
        for lang, p in ALL:
            d = S.parse_file(ROOT / "imports" / "pillars" / lang / f"{S.slug_of(p, lang)}.md")
            self.assertRegex(d["author"], r"(?i)works at (\[)?iFAKT|arbeitet bei der (\[)?iFAKT|Anbieter von iFAKT|vendor of iFAKT|iFAKT GmbH", f"{lang}/{p['id']}")

    def test_render_anchors_resolve_and_markers(self):
        for lang, p in ALL:
            cx = ctx()
            d, body, src, heads = S._article(p, lang, BASE, cx)
            ids = [h[2] for h in heads]
            self.assertEqual(len(ids), len(set(ids)), f"{lang}/{p['id']} doppelte IDs")
            self.assertFalse([w for w in cx.warn if w.startswith("Sprungmarke")], f"{lang}/{p['id']}")
            self.assertNotIn("(planned)", body); self.assertNotIn("(geplant)", body)
            self.assertNotRegex(body, r"<script|<iframe")
            self.assertEqual(len(re.findall(r'<li id="src-', src)), len(set(re.findall(r'<li id="src-(\d+)"', src))))


class Links(unittest.TestCase):
    def test_pillar_links_follow_language(self):
        cx = ctx()
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/value-stream-mapping/", "en"), f"{BASE}/learn/value-stream-mapping/")
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/value-stream-mapping/", "de"), f"{BASE}/de/learn/wertstromanalyse/")
        self.assertEqual(cx.link("https://www.m365.fm/learn/wertstromanalyse/", "en"), f"{BASE}/learn/value-stream-mapping/")
        self.assertEqual(cx.link("https://www.m365.fm/learn/digital-twin/", "de"), f"{BASE}/de/learn/digital-twin/")

    def test_unknown_targets_become_text(self):
        cx = ctx(ents={"kaizen"}, en={"what-is-a-gemba-walk"}, de=set())
        self.assertIsNone(cx.link("https://www.m365.fm/entity/nope/", "en"))
        self.assertEqual(cx.link("https://www.m365.fm/entity/kaizen/", "de"), f"{BASE}/de/entity/kaizen/")
        self.assertIsNone(cx.link("https://www.m365.fm/community/u/mirko-p/blog/missing/", "en"))
        self.assertEqual(cx.link("https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/", "de"), f"{BASE}/community/u/mirko-p/blog/what-is-a-gemba-walk/")
        self.assertIsNone(cx.link("https://www.m365.fm/learn/gibt-es-nicht/", "en"))
        self.assertEqual(cx.link("https://example.org/x", "en"), "https://example.org/x")
        self.assertEqual(len(cx.warn), 3)

    def test_inline_links_and_text(self):
        cx = ctx(ents={"kaizen"})
        h = S.inline("Siehe [Kaizen](https://www.m365.fm/entity/kaizen/) und [x](https://www.m365.fm/entity/nope/) **fett**", "de", cx)
        self.assertIn(f'href="{BASE}/de/entity/kaizen/"', h); self.assertNotIn("nope", h); self.assertIn("<strong>fett</strong>", h)


class Cluster(unittest.TestCase):
    def test_assign_and_box(self):
        posts = [{"handle": "mirko-p", "slug": "what-is-a-gemba-walk", "title": "What is a gemba walk", "topics": ["gemba-walk"], "published": 5, "lang": "en"},
                 {"handle": "mirko-p", "slug": "sharepoint-permissions", "title": "SharePoint permissions", "topics": ["sharepoint"], "published": 4, "lang": "en"},
                 {"handle": "mirko-p", "slug": "what-is-a-gemba-walk", "title": "Was ist ein Gemba Walk", "topics": ["gemba-walk"], "lang": "de", "tr_of": 1}]
        S.assign(posts)
        self.assertEqual(S.ASSIGN[("mirko-p", "what-is-a-gemba-walk")][0], "shop-floor-management")
        self.assertNotIn(("mirko-p", "sharepoint-permissions"), S.ASSIGN)
        box = S.article_box(posts[0], "en", BASE)
        self.assertIn(f"{BASE}/learn/shop-floor-management/", box); self.assertIn(f"{BASE}/learn/path/manufacturing-excellence/", box)
        self.assertIn(f"{BASE}/de/learn/shop-floor-management/", S.article_box(posts[0], "de", BASE))
        self.assertEqual(S.article_box(posts[0], "fr", BASE), ""); self.assertEqual(S.article_box(posts[1], "en", BASE), "")

    def test_finish(self):
        h = S.finish("<p>Text [2] und [99] (planned) <a href='x'>l</a> [unverified]</p>", 3, "en")
        self.assertIn('href="#src-2"', h); self.assertNotIn("#src-99", h); self.assertNotIn("(planned)", h); self.assertIn("pl-unv", h)


if __name__ == "__main__":
    unittest.main()


class AuthorBox(unittest.TestCase):
    def test_site_box_plus_disclosure(self):
        for lang, p in ALL:
            d = S.parse_file(ROOT / "imports" / "pillars" / lang / f"{S.slug_of(p, lang)}.md")
            h = S._author_html(d["author"], lang, ctx(), lambda l: '<section class="author-box">BOX</section>')
            self.assertTrue(h.startswith('<section class="author-box">BOX</section>'), f"{lang}/{p['id']}")
            self.assertRegex(h, r"(?i)ifakt", f"{lang}/{p['id']} ohne iFAKT-Hinweis")
            self.assertNotRegex(h, r"(?i)\[Editor|\[Redaktion")
