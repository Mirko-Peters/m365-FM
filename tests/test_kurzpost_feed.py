"""Kurzposts aus dem MVP-Tracker (feed_items.origin='kurzpost'): als externer Beitrag gekennzeichnet, Link mit rel="nofollow ugc", noindex ohne eigenen Text."""
import sys
import time
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import site_i18n  # noqa: E402

site_i18n.remote = lambda: {}
import site_feed as FEED  # noqa: E402

NOW = int(time.time())


def item(origin):
    return {"id": 7, "kind": "blog", "url": "https://example.com/post", "title": "My post", "summary": "Short summary.", "thumb": "", "body": "", "topics": [],
            "keypoints": [], "faq": [], "published": NOW - 60, "votes": 0, "type": "u", "handle": "anna", "name": "Anna", "origin": origin}


def build(it):
    written, noindex = {}, {}
    g = dict(BASE="https://www.m365.fm", LANGS=("en", "de"), sitemap=[], write=lambda p, html: written.__setitem__(p, html),
             page=lambda lang, title, desc, url, body, *a, **k: (noindex.__setitem__(url, k.get("noindex")), body)[1],
             header=lambda lang, x: "", footer=lambda lang: "", footer_en=lambda: "")
    FEED.build(g, [it], "https://api.example.test")
    return written, noindex, g["sitemap"]


class KurzpostTest(unittest.TestCase):
    def test_labelled_nofollow_noindex(self):
        written, noindex, sitemap = build(item("kurzpost"))
        en = written[f"{FEED.path_of(item('kurzpost'))}index.html"]
        de = written[f"de/{FEED.path_of(item('kurzpost'))}index.html"]
        self.assertIn("External post", en)
        self.assertIn("Externer Beitrag", de)
        self.assertIn('href="https://example.com/post" rel="nofollow ugc noopener"', en)
        self.assertTrue(all(noindex.values()) and noindex, "ohne eigenen Text noindex")
        self.assertEqual(sitemap, [], "noch nicht in der Sitemap")

    def test_other_items_unlabelled(self):
        written, _, _ = build(item(""))
        self.assertNotIn("External post", " ".join(written.values()))

    def test_bad_date_does_not_stop_the_build(self):
        """Review #318: ein Zeitstempel in Millisekunden liess FEED.build mit ValueError abbrechen (der ganze Seitenbau stand)."""
        ms = dict(item("kurzpost"), published=NOW * 1000)
        written, _, _ = build(ms)
        day = time.strftime("%Y-%m-%d", time.gmtime(NOW))
        self.assertIn(f"· {day}", written[f"{FEED.path_of(ms)}index.html"], "Millisekunden werden als Datum gelesen")
        self.assertEqual(FEED.iso(1767225600), "2026-01-01")
        self.assertEqual(FEED.iso(1767225600000), "2026-01-01")
        today = time.strftime("%Y-%m-%d", time.gmtime())
        for bad in (None, "", "morgen", -1, 10 ** 30, float("nan")):
            self.assertEqual(FEED.iso(bad), today, repr(bad))


if __name__ == "__main__":
    unittest.main()
