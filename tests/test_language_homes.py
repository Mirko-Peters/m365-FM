"""Startseite je Sprache (Wunsch Mirko 6.11.2026): /<sprache>/ ist die Startseite von "/" in der eigenen Sprache, die fruehere Podcast-Startseite
der Sprache steht unter /<sprache>/podcast/. Prueft die Texte (data/home_i18n.json), den Rueckfall auf englische Inhalte (site_home.pick) und -
wenn ein Bau in docs/ liegt (SITE_OFFLINE=1 python3 generate_site.py) - die gebauten Seiten: canonical, hreflang (alle Sprachen + x-default = /),
<html lang>, JSON-LD WebSite/CollectionPage mit inLanguage, keine doppelten Titel, Podcast-Seite mit PodcastSeries."""
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from site_i18n import COMM_LANGS   # noqa: E402

HT = json.loads((ROOT / "data" / "home_i18n.json").read_text("utf-8"))
BASE = "https://www.m365.fm"
DOCS = ROOT / "docs"
LANGS = [l for l in COMM_LANGS if l != "en"]
BUILT = [l for l in LANGS if (DOCS / l / "index.html").exists()]


class TextsTest(unittest.TestCase):
    def test_every_language_has_every_text(self):
        keys = set(HT["en"])
        for l in COMM_LANGS:
            self.assertIn(l, HT, l)
            self.assertEqual(set(HT[l]), keys, l)
            for k, v in HT[l].items():
                self.assertTrue(v.strip(), (l, k))
                self.assertEqual("{n}" in v, "{n}" in HT["en"][k], (l, k, "Platzhalter {n}"))
                v.format(n=14)

    def test_titles_unique_and_short(self):
        titles = [HT[l]["title"] for l in COMM_LANGS]
        self.assertEqual(len(set(titles)), len(titles), "doppelte Titel")
        for l in COMM_LANGS:
            self.assertLessEqual(len(HT[l]["title"]), 70, l)   # seo_title: bis 70 Zeichen ungekuerzt
            self.assertIn("M365.FM", HT[l]["title"], l)
        descs = [HT[l]["desc"] for l in COMM_LANGS]
        self.assertEqual(len(set(descs)), len(descs))

    def test_translated_not_english(self):
        for l in LANGS:
            same = [k for k in ("h1b", "lede", "join", "sec_latest", "cta_p", "podcast_in") if HT[l][k] == HT["en"][k]]
            self.assertEqual(same, [], l)


class FallbackTest(unittest.TestCase):
    def test_pick_own_language_first_then_labelled_english(self):
        import site_home as H
        items = [{"lang": "en", "t": 1}, {"lang": "de", "t": 2}, {"t": 3}, {"lang": "fr", "t": 4}]
        self.assertEqual(H.pick(items, "de"), ([{"lang": "de", "t": 2}], False))
        self.assertEqual(H.pick(items, "ja"), ([{"lang": "en", "t": 1}, {"t": 3}], True))
        self.assertEqual(H.pick(items, "ja", n=1), ([{"lang": "en", "t": 1}], True))
        self.assertEqual(H.pick(items, "en"), ([{"lang": "en", "t": 1}, {"t": 3}], False))
        self.assertEqual(H.pick(items, "de", root=True)[0], items)
        h = H._fb('<div class="hub-card" data-k="blog"><a href="/x/"><div class="kicker">Blog</div><h3>T</h3></a></div>', "ja", "Blog")
        self.assertIn('class="hub-card" lang="en"', h)
        self.assertIn("Blog · 英語</div>", h)
        self.assertIn('<a hreflang="en" href="/x/"', h)


def _read(rel):
    return (DOCS / rel).read_text("utf-8")


def _ld(h):
    out = []
    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
        x = json.loads(b)
        out += x if isinstance(x, list) else [x]
    return out


def _title(h):
    return re.search(r"<title>(.*?)</title>", h, re.S).group(1)


@unittest.skipUnless(BUILT, "kein Bau in docs/ (SITE_OFFLINE=1 SITE_BASE=https://www.m365.fm python3 generate_site.py)")
class BuiltHomesTest(unittest.TestCase):
    def test_language_homes(self):
        titles = {"/": _title(_read("index.html"))}
        for l in BUILT:
            h = _read(f"{l}/index.html"); u = f"{BASE}/{l}/"
            self.assertIn(f'<link rel="canonical" href="{u}">', h, l)
            self.assertRegex(h, rf'<html lang="{l}" dir="(ltr|rtl)">')
            if l in ("ar", "he"): self.assertIn('dir="rtl"', h[:200])
            alts = dict(re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">', h))
            self.assertEqual(alts.get("x-default"), f"{BASE}/", l)
            self.assertEqual(alts.get("en"), f"{BASE}/", l)
            for x in BUILT: self.assertEqual(alts.get(x), f"{BASE}/{x}/", (l, x))
            ld = _ld(h)
            types = {d.get("@type"): d for d in ld}
            self.assertEqual(types["WebSite"]["inLanguage"], l)
            self.assertEqual(types["WebSite"]["url"], u)
            self.assertEqual(types["CollectionPage"]["inLanguage"], l)
            self.assertEqual(types["CollectionPage"]["url"], u)
            self.assertNotIn("PodcastSeries", types, "die Serie steht auf /<sprache>/podcast/")
            self.assertIn(f'href="{BASE}/{l}/podcast/"', h)
            self.assertIn('id="podcast"', h)
            self.assertIn(f"<em>{HT[l]['h1b']}</em>".replace("'", "&#x27;"), h)
            titles[f"/{l}/"] = _title(h)
        self.assertEqual(len(set(titles.values())), len(titles), titles)

    def test_root_cluster(self):
        h = _read("index.html")
        alts = dict(re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">', h))
        self.assertEqual(alts.get("x-default"), f"{BASE}/")
        for x in BUILT: self.assertEqual(alts.get(x), f"{BASE}/{x}/")
        self.assertIn('<html lang="en"', h)

    def test_podcast_pages_keep_the_old_landing(self):
        seo = json.loads((ROOT / "shows_seo.json").read_text("utf-8"))
        titles = set()
        for l in BUILT:
            h = _read(f"{l}/podcast/index.html"); u = f"{BASE}/{l}/podcast/"
            self.assertIn(f'<link rel="canonical" href="{u}">', h)
            ser = [d for d in _ld(h) if d.get("@type") == "PodcastSeries"]
            self.assertEqual(len(ser), 1, l)
            self.assertEqual(ser[0]["@id"], f"{u}#series")
            self.assertEqual(ser[0]["inLanguage"], l)
            if seo.get(l, {}).get("title"): self.assertIn(seo[l]["title"].replace("&", "&amp;")[:30], h)
            self.assertIn("spreaker.com/show/", h)
            titles.add(_title(h))
            alts = dict(re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">', h))
            for x in BUILT: self.assertEqual(alts.get(x), f"{BASE}/{x}/podcast/")
        self.assertEqual(len(titles), len(BUILT))

    def test_sitemap_lists_homes_and_podcast_pages(self):
        xml = "".join(p.read_text("utf-8") for p in DOCS.glob("sitemap*.xml"))
        for l in BUILT:
            self.assertIn(f"<loc>{BASE}/{l}/</loc>", xml)
            self.assertIn(f"<loc>{BASE}/{l}/podcast/</loc>", xml)


if __name__ == "__main__":
    unittest.main()
