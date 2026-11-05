"""Interne Links ohne Umweg (site_links.py): Nachbau der Site-Worker-Weiterleitungen, Ketten, Schleifen, Umschreiben im HTML."""
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_links as SL   # noqa: E402

FX = json.loads((ROOT / "sitewrk" / "test" / "legacy_cases.json").read_text("utf-8"))


def one_hop(res, url):
    """Wie eine Antwort des Site-Workers: Location der 301 oder None."""
    form, host, path, rest = SL.split_internal(url)
    nxt = res.hop(host, path)
    if not nxt:
        return None
    q = rest.split("#")[0]
    return f"https://{nxt[0]}{nxt[1]}{q}"


def site(files):
    """Gebaute Seite im Temp-Verzeichnis: {"docs/a/index.html": "...", "r2out/de/x/index.html": "..."}."""
    d = Path(tempfile.mkdtemp())
    for rel, txt in files.items():
        p = d / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(txt, "utf-8")
    return d


class WorkerParityTest(unittest.TestCase):
    def test_same_cases_as_worker(self):
        res = SL.Resolver(FX["map"], SL.Site())
        for url, want in FX["cases"]:
            self.assertEqual(one_hop(res, url), want, url)


class ResolverTest(unittest.TestCase):
    def setUp(self):
        self.d = site({
            "docs/show/episodes/foo/index.html": "x",
            "docs/show/episodes/new-slug/index.html": "x",
            "docs/community/u/mirko-p/blog/post-a/index.html": "x",
            "docs/show/index.html": "x",
            "docs/entity/main/index.html": "x",
            "r2out/de/show/episodes/foo/index.html": "x",
        })
        table = {
            "/blog/post-a": "/community/u/mirko-p/blog/post-a/",
            "/old-flat": "/m365-fm-podcast/foo",   # Kette: Tabelle -> Podpage-Regel -> Folge
            "/loop-a": "/loop-b/", "/loop-b": "/loop-a/",
            "/gone": "/community/u/nobody/blog/gone/",
            "/c1": "/c2/", "/c2": "/c3/", "/c3": "/c4/", "/c4": "/c5/", "/c5": "/c6/", "/c6": "/c7/", "/c7": "/show/",
            "/show/episodes/old-slug": "/show/episodes/new-slug/",
        }
        self.res = SL.Resolver(table, SL.Site(self.d / "docs", self.d / "r2out"))

    def fix(self, href):
        return SL.fix_href(href, self.res)[0]

    def test_chain_is_followed_to_the_end(self):
        self.assertEqual(self.fix("/old-flat"), "/show/episodes/foo/")
        self.assertEqual(self.fix("https://m365.fm/old-flat/"), "https://www.m365.fm/show/episodes/foo/")

    def test_loop_and_too_long_chain_stay_unchanged(self):
        self.assertIsNone(self.fix("/loop-a"))
        self.assertEqual(self.res.resolve(SL.WWW, "/loop-a")[0], "loop")
        self.assertIsNone(self.fix("/c1"))
        self.assertEqual(self.res.resolve(SL.WWW, "/c1")[0], "long")

    def test_query_and_fragment_are_kept(self):
        self.assertEqual(self.fix("https://www.m365.fm/blog/post-a?utm_source=x#teil-2"), "https://www.m365.fm/community/u/mirko-p/blog/post-a/?utm_source=x#teil-2")
        self.assertEqual(self.fix("/m365-fm-podcast/foo#t=10"), "/show/episodes/foo/#t=10")

    def test_external_anchor_and_final_links_untouched(self):
        for href in ("https://learn.microsoft.com/blog/x", "https://img.m365.fm/i/a.webp", "#top", "mailto:a@b.c", "javascript:void(0)",
                     "/show/episodes/foo/", "https://www.m365.fm/show/", "relative/blog/x"):
            self.assertIsNone(self.fix(href), href)

    def test_missing_target_is_reported_not_rewritten(self):
        self.assertIsNone(self.fix("/gone"))
        self.assertEqual(self.res.resolve(SL.WWW, "/gone")[0], "missing")
        self.assertIsNone(self.fix("/no/such/page/"))
        self.assertEqual(self.res.resolve(SL.WWW, "/no/such/page/")[0], "broken")

    def test_origin_rules(self):
        self.assertEqual(self.fix("/show/episodes/foo"), "/show/episodes/foo/")   # GitHub Pages: Verzeichnis ohne "/"
        self.assertIsNone(self.fix("/de/show/episodes/foo/"))   # liegt im R2-Bucket: 200
        self.assertEqual(self.fix("/es/show/episodes/foo/"), "/show/episodes/foo/")   # Sprachfassung fehlt: englisches Original
        self.assertEqual(self.fix("/show/episodes/old-slug/"), "/show/episodes/new-slug/")   # umbenannte Folge
        self.assertEqual(self.fix("http://www.m365.fm/show/"), "https://www.m365.fm/show/")

    def test_soft_targets(self):
        self.assertEqual(SL.fix_href("/blog/unknown-post/", self.res)[:2], ("/show/", "soft"))
        self.assertEqual(SL.fix_href("/blog/post-a", self.res)[1], "redirect")


class RenderTest(unittest.TestCase):
    def test_sample_article_and_tree(self):
        d = site({
            "docs/show/redirects.json": json.dumps({"/blog/post-a": "/community/u/mirko-p/blog/post-a/", "/teams-governance": "/show/episodes/teams-governance/"}),
            "docs/show/episodes/teams-governance/index.html": "<p>Folge</p>",
            "docs/show/index.html": "<p>Show</p>",
            "docs/community/u/mirko-p/blog/post-a/index.html": "<p>A</p>",
            "docs/community/u/mirko-p/blog/post-b/index.html": (
                '<html><head><link rel="canonical" href="https://www.m365.fm/community/u/mirko-p/blog/post-b/"></head><body><article>'
                '<p>Siehe <a href="https://www.m365.fm/blog/post-a">Beitrag A</a>, <a href="https://m365.fm/teams-governance/">die Folge</a>, '
                "<a href='/m365-fm-podcast/teams-governance#kapitel-3'>Kapitel 3</a>, <a href=\"https://www.m365.fm/blog/missing-post\">alt</a> "
                'und <a href="https://learn.microsoft.com/de-de/">Microsoft Learn</a>.</p></article></body></html>'),
        })
        res = SL.Resolver.from_build(d / "docs", d / "r2out")
        st = SL.Stats()
        changed = SL.fix_tree([d / "docs", d / "r2out"], res, st)
        h = (d / "docs/community/u/mirko-p/blog/post-b/index.html").read_text("utf-8")
        self.assertEqual(changed, 1)
        self.assertIn('href="https://www.m365.fm/community/u/mirko-p/blog/post-a/"', h)
        self.assertIn('href="https://www.m365.fm/show/episodes/teams-governance/"', h)
        self.assertIn("href='/show/episodes/teams-governance/#kapitel-3'", h)
        self.assertIn('href="https://www.m365.fm/show/"', h)   # unbekannter alter Beitrag: Uebersicht (soft)
        self.assertIn('href="https://learn.microsoft.com/de-de/"', h)
        self.assertIn('<link rel="canonical" href="https://www.m365.fm/community/u/mirko-p/blog/post-b/">', h)
        self.assertEqual(st.n["redirect"], 3)
        self.assertEqual(st.n["soft"], 1)
        self.assertEqual(st.pages, {"/community/u/mirko-p/blog/post-b/": 4})
        self.assertIn("4 umgeschrieben in 1 Seiten", st.summary())
        self.assertEqual(st.report()["by_section"], {"/community/u/*/blog/": [1, 4]})
        self.assertEqual(SL.fix_tree([d / "docs"], res), 0)   # zweiter Lauf: nichts mehr zu tun


if __name__ == "__main__":
    unittest.main()
