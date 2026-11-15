"""GitHub-Aktivitaet (Commits, PRs, Stars) erscheint auf keiner oeffentlichen Seite: keine Inhaltsseite /community/feed/<id>-<slug>/,
kein Sitemap-Eintrag, keine Karte auf der Startseite, kein Eintrag auf Profil-/Firmenseiten, nicht im SEO-Bericht (site_feed.PRIVATE_KINDS)."""
import json
import sys
import time
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_feed as FEED   # noqa: E402
import site_members as MEM   # noqa: E402

BASE = "https://www.m365.fm"
NOW = int(time.time())
BODY = "Eigener Text. " * 30   # >= 300 Zeichen: indexierbar, kommt in die Sitemap


def item(i, kind, url, title):
    return {"id": i, "kind": kind, "url": url, "title": title, "summary": "", "thumb": "", "body": BODY, "topics": [], "keypoints": [], "faq": [],
            "published": NOW - 3600, "votes": 0, "type": "u", "handle": "mirko-p", "name": "Mirko Peters"}


GH = item(100, "github", "https://github.com/Mirko-Peters/repo/commit/abc", "Mirko-Peters pushed to main")
GH_UPPER = item(102, "GitHub", "https://github.com/Mirko-Peters/repo/pull/7", "Mirko-Peters opened a pull request")
YT = item(101, "youtube", "https://www.youtube.com/watch?v=aaaaaaaaaaa", "Copilot explained")


def ctx():
    written, sitemap = {}, []
    g = dict(BASE=BASE, LANGS=("en", "de"), sitemap=sitemap, write=lambda p, html: written.__setitem__(p, html),
             page=lambda lang, title, desc, url, body, *a, **k: f"<title>{title}</title>{body}",
             header=lambda lang, x: "", footer=lambda lang: "", footer_en=lambda: "")
    return g, written, sitemap


class PolicyTest(unittest.TestCase):
    def test_policy(self):
        self.assertEqual(FEED.PRIVATE_KINDS, frozenset({"github"}))
        self.assertFalse(FEED.is_public(GH)); self.assertFalse(FEED.is_public(GH_UPPER))
        self.assertTrue(FEED.is_public(YT)); self.assertTrue(FEED.is_public({}))
        self.assertEqual([x["id"] for x in FEED.public_items([GH, YT, GH_UPPER])], [101])
        self.assertEqual(FEED.public_items(None), [])

    def test_matches_worker_constant(self):
        src = (ROOT / "worker" / "src" / "feedpolicy.js").read_text("utf-8")
        self.assertIn('PRIVATE_FEED_KINDS = Object.freeze(["github"])', src, "Python und Worker muessen dieselben Arten ausblenden")


class FeedPagesTest(unittest.TestCase):
    def test_no_page_and_no_sitemap_entry_for_github(self):
        g, written, sitemap = ctx()
        FEED.build(g, [GH, YT, GH_UPPER], "https://api.example.test")
        self.assertIn(f"{FEED.path_of(YT)}index.html", written)
        self.assertIn(f"de/{FEED.path_of(YT)}index.html", written)
        for it in (GH, GH_UPPER):
            self.assertFalse([p for p in written if f"/feed/{it['id']}-" in p], it["id"])
        self.assertEqual([u for u, *_ in sitemap], [FEED.link(BASE, "en", YT)])
        joined = " ".join(written.values()) + " ".join(u for u, *_ in sitemap)
        self.assertNotIn("github.com", joined)
        self.assertNotIn("pushed to main", joined)


class HomeHubTest(unittest.TestCase):
    def test_hub_has_no_github_cards(self):
        import site_home as HOME
        g, _w, _s = ctx()
        fake = {"cv": [], "posts": [], "eps": [], "events": [], "lib": [], "feed": [GH, YT, GH_UPPER]}
        with mock.patch.dict(HOME._C, fake, clear=True):
            out = HOME.hub(g, "en", BASE, "https://api.example.test", [], lambda x: "", root=True)
        self.assertIn("Copilot explained", out)
        self.assertNotIn("pushed to main", out); self.assertNotIn("opened a pull request", out)
        self.assertNotIn(FEED.path_of(GH), out)


class MembersTest(unittest.TestCase):
    def export(self):
        return {"people": [{"handle": "mirko-p", "name": "Mirko", "items": [dict(GH), dict(YT)], "channels": [{"kind": "github", "url": "https://github.com/Mirko-Peters"}]}],
                "orgs": [{"handle": "m365-show", "name": "M365 Show", "items": [dict(GH_UPPER)], "channels": []}]}

    def test_strip_private_items_keeps_channels(self):
        j = MEM.strip_private_items(self.export())
        self.assertEqual([i["id"] for i in j["people"][0]["items"]], [101])
        self.assertEqual(j["orgs"][0]["items"], [])
        self.assertEqual(j["people"][0]["channels"][0]["kind"], "github", "GitHub bleibt als Profil-Link")

    def test_fetch_members_filters_live_export_and_cache(self):
        import tempfile
        with tempfile.TemporaryDirectory() as d:
            cache = Path(d) / "members_export.json"; mark = mock.patch.object(MEM, "MARK", Path(d) / "profiles-export.json"); mark.start(); self.addCleanup(mark.stop)
            with mock.patch.object(MEM, "CACHE", cache), mock.patch.object(MEM, "_fetch_export", return_value=self.export()):
                people, orgs = MEM.fetch_members("https://api.example.test")
            self.assertEqual([i["id"] for i in people[0]["items"]], [101]); self.assertEqual(orgs[0]["items"], [])
            self.assertNotIn("github.com/Mirko-Peters/repo", cache.read_text("utf-8"), "gespeicherte Fassung ohne GitHub-Inhalte")
            cache.write_text(json.dumps(self.export()), "utf-8")   # alter Zwischenspeicher mit GitHub-Inhalten
            with mock.patch.object(MEM, "CACHE", cache), mock.patch.object(MEM, "_fetch_export", return_value=None), mock.patch("time.sleep"):
                people, orgs = MEM.fetch_members("https://api.example.test")
            self.assertEqual([i["id"] for i in people[0]["items"]], [101]); self.assertEqual(orgs[0]["items"], [])


class SeoReportTest(unittest.TestCase):
    def test_seo_report_skips_github_items(self):
        import site_seo as SEOR
        g, _w, _s = ctx(); seen = {}
        with mock.patch.object(SEOR, "run", side_effect=lambda extras: seen.update(extras) or None):
            SEOR.build(g, [], [], [], [], [GH, YT, GH_UPPER], None, {})
        self.assertEqual([(x["kind"], x["id"]) for x in seen["items"]], [("feed", 101)])


if __name__ == "__main__":
    unittest.main()
