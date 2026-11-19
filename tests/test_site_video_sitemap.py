"""Video-Sitemaps (site_video_sitemap.py): welche Seiten und Felder gelten, Dateien je Sprache, Aufteilung, Index, Notschalter, Pruefung in check_sitemaps.py."""
import contextlib, io, json, os, sys, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import check_sitemaps as CS   # noqa: E402
import site_size   # noqa: E402
import site_sitemaps as SMAP   # noqa: E402
import site_video_sitemap as SV   # noqa: E402

BASE = CS.BASE
LANGS = {"de": ("Deutsch", "de"), "fr": ("Francais", "fr")}


def page(vo=None, og="https://img.m365.fm/og/ep.webp"):
    node = {"@context": "https://schema.org", "@type": "VideoObject", "name": "Copilot Studio - Simply Explained", "description": "Was ist\nCopilot Studio & wie startet man?",
            "thumbnailUrl": ["https://i.ytimg.com/vi/abc/maxresdefault.jpg", "https://i.ytimg.com/vi/abc/hqdefault.jpg"], "uploadDate": "2026-11-05",
            "contentUrl": "https://www.youtube.com/watch?v=abc", "embedUrl": "https://www.youtube-nocookie.com/embed/abc", "isFamilyFriendly": True, "duration": "PT12M5S"}
    node.update(vo or {})
    node = {k: v for k, v in node.items() if v is not None}
    meta = f'<meta property="og:image" content="{og}">' if og else ""
    return (f'<html><head>{meta}<script type="application/ld+json">{json.dumps([{"@type": "WebPage"}, node])}</script></head><body><main>x</main></body></html>')


class Extract(unittest.TestCase):
    def test_full_entry(self):
        v = SV.extract(f"{BASE}/show/episodes/x/", page())
        self.assertEqual(v["title"], "Copilot Studio - Simply Explained")
        self.assertEqual(v["desc"], "Was ist Copilot Studio & wie startet man?")   # Umbrueche zusammengezogen
        self.assertEqual(v["thumb"], "https://img.m365.fm/og/ep.webp")   # Projektregel: eigenes Bild aus R2, wenn die Seite eines hat
        self.assertEqual(v["player"], "https://www.youtube-nocookie.com/embed/abc")
        self.assertEqual((v["date"], v["dur"], v["family"]), ("2026-11-05", 725, True))

    def test_thumbnail_falls_back_to_json_ld_when_og_is_foreign_or_missing(self):
        for og in ("https://d3wo5wojvuv7l.cloudfront.net/cover.jpg", None):
            self.assertEqual(SV.extract(BASE + "/x/", page(og=og))["thumb"], "https://i.ytimg.com/vi/abc/maxresdefault.jpg")

    def test_required_fields_missing_or_not_https_means_no_entry(self):
        for bad in ({"name": ""}, {"description": ""}, {"embedUrl": None}, {"embedUrl": "http://x.example/e"}, {"uploadDate": None}, {"uploadDate": "gestern"},
                    {"thumbnailUrl": None}):
            self.assertIsNone(SV.extract(BASE + "/x/", page(bad, og=None)), bad)

    def test_page_without_video_object(self):
        self.assertIsNone(SV.extract(BASE + "/x/", '<script type="application/ld+json">{"@type":"WebPage"}</script>'))
        self.assertIsNone(SV.extract(BASE + "/x/", "<main>kein JSON-LD</main>"))
        self.assertIsNone(SV.extract(BASE + "/x/", '<script type="application/ld+json">{kaputt</script>'))

    def test_graph_and_limits(self):
        node = {"@type": "VideoObject", "name": "T" * 300, "description": "wort " * 800, "thumbnailUrl": "https://i.ytimg.com/vi/a/hq.jpg", "uploadDate": "2026-11-05T10:00:00+01:00",
                "embedUrl": "https://www.youtube-nocookie.com/embed/a"}
        html = '<script type="application/ld+json">' + json.dumps({"@graph": [{"@type": "WebPage"}, node]}) + "</script>"
        v = SV.extract(BASE + "/x/", html)
        self.assertLessEqual(len(v["title"]), SV.MAX_TITLE); self.assertLessEqual(len(v["desc"]), SV.MAX_DESC)
        self.assertTrue(v["desc"].endswith("…"))

    def test_duration(self):
        self.assertEqual([SV.seconds(x) for x in ("PT45S", "PT1H", "PT3M", "PT1H2M3S", "PT0S", "PT9H", "P1D", "kaputt", None)], [45, 3600, 180, 3723, None, None, None, None, None])


class Build(unittest.TestCase):
    def setUp(self):
        self.t = tempfile.TemporaryDirectory(); r = Path(self.t.name)
        self.docs, self.r2 = r / "docs", r / "r2out"
        for base, p in ((self.docs, "show/episodes/e"), (self.docs, "de/show/episodes/e"), (self.r2, "fr/pour-e"), (self.docs, "plain")):
            (base / p).mkdir(parents=True)
        (self.docs / "show/episodes/e/index.html").write_text(page(), "utf-8")
        (self.docs / "de/show/episodes/e/index.html").write_text(page({"name": "Deutsch & Co <b>"}), "utf-8")
        (self.r2 / "fr/pour-e/index.html").write_text(page(), "utf-8")
        (self.docs / "plain/index.html").write_text("<main>kein Video</main>", "utf-8")
        self.sm = [(f"{BASE}/show/episodes/e/", "2026-11-10", None), (f"{BASE}/de/show/episodes/e/", "2026-11-11", None), (f"{BASE}/fr/pour-e/", "2026-11-12", None),
                   (f"{BASE}/plain/", "2026-11-12", None), (f"{BASE}/missing/", "2026-11-12", None)]
        self.out = {}
    def tearDown(self): self.t.cleanup()
    def write(self, n, c): self.out[n] = c

    def test_files_per_language_and_index(self):
        files = SV.build(self.sm, [self.docs, self.r2], BASE, LANGS, self.write, "2026-11-18")
        self.assertEqual([f[0] for f in files], ["sitemap-en-video.xml", "sitemap-de-video.xml", "sitemap-fr-video.xml"])
        self.assertEqual([f[2] for f in files], [1, 1, 1])   # Seite ohne Video und fehlende Seite fehlen
        de = self.out["sitemap-de-video.xml"]
        self.assertIn("<video:title>Deutsch &amp; Co &lt;b&gt;</video:title>", de)   # maskiert
        self.assertIn('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"', de)
        self.assertIn("<video:duration>725</video:duration>", de); self.assertIn("<video:family_friendly>yes</video:family_friendly>", de)
        self.assertNotIn("content_loc", de)
        SMAP.write_all(self.sm, self.write, BASE, LANGS, "2026-11-18", extra=files)
        idx = self.out["sitemap.xml"]
        for n in ("sitemap-en-video.xml", "sitemap-de-video.xml", "sitemap-fr-video.xml"): self.assertIn(f"<loc>{BASE}/{n}</loc>", idx)
        self.assertIn("sitemap-en-show-episodes.xml", idx)   # normale Sitemaps unveraendert im Index
        self.assertNotIn("video:", "".join(v for k, v in self.out.items() if "video" not in k))

    def test_lastmod_matches_normal_sitemap(self):
        SV.build(self.sm, [self.docs, self.r2], BASE, LANGS, self.write, "2026-11-18")
        SMAP.write_all(self.sm, self.write, BASE, LANGS, "2026-11-18")
        self.assertIn(f"<loc>{BASE}/de/show/episodes/e/</loc><lastmod>2026-11-11</lastmod>", self.out["sitemap-de-video.xml"])
        self.assertIn(f"<loc>{BASE}/de/show/episodes/e/</loc><lastmod>2026-11-11</lastmod>", self.out["sitemap-de-show-episodes.xml"])

    def test_split_by_url_count(self):
        old = SV.MAX_URLS; SV.MAX_URLS = 1
        try:
            (self.docs / "show/episodes/b").mkdir(parents=True); (self.docs / "show/episodes/b/index.html").write_text(page(), "utf-8")
            files = SV.build(self.sm + [(f"{BASE}/show/episodes/b/", "2026-11-09", None)], [self.docs, self.r2], BASE, LANGS, self.write, "2026-11-18")
        finally: SV.MAX_URLS = old
        self.assertIn("sitemap-en-video-2.xml", [f[0] for f in files])

    def test_kill_switch(self):
        os.environ["VIDEO_SITEMAP"] = "0"
        try: self.assertEqual(SV.build(self.sm, [self.docs, self.r2], BASE, LANGS, self.write, "2026-11-18"), [])
        finally: del os.environ["VIDEO_SITEMAP"]
        self.assertEqual(self.out, {})

    def test_names_fit_site_size_rule(self):   # en/de bleiben in GitHub Pages, die uebrigen Sprachen liegen im R2-Bucket (wie die Bild-Sitemaps)
        self.assertEqual(site_size.sitemap_lang("sitemap-fr-video.xml"), "fr"); self.assertEqual(site_size.sitemap_lang("sitemap-ja-video-2.xml"), "ja")

    def _check(self):
        files = SV.build(self.sm, [self.docs, self.r2], BASE, LANGS, self.write, "2026-11-18")
        SMAP.write_all(self.sm, self.write, BASE, LANGS, "2026-11-18", extra=files)
        for n, c in self.out.items():
            l = site_size.sitemap_lang(n); d = self.r2 if l and l not in site_size.PAGES_LANGS else self.docs
            d.mkdir(parents=True, exist_ok=True); (d / n).write_text(c, "utf-8")
        buf = io.StringIO(); old = CS.DOCS
        try:
            with contextlib.redirect_stdout(buf): rc = CS.main(["check_sitemaps.py", str(self.docs), str(self.r2)])
        finally: CS.DOCS = old
        return rc, buf.getvalue()

    def test_check_sitemaps_accepts(self):
        rc, out = self._check()
        self.assertEqual(rc, 0, out); self.assertIn("Video-Sitemaps: 3 Dateien, 3 Seiten", out)

    def test_check_sitemaps_rejects_broken_entries(self):
        self._check()
        f = self.docs / "sitemap-en-video.xml"; good = f.read_text("utf-8")
        for bad, msg in ((good.replace("<video:title>Copilot Studio - Simply Explained</video:title>", ""), "video:title fehlt"),
                         (good.replace("https://www.youtube-nocookie.com/embed/abc", "http://x.example/e"), "nicht https"),
                         (good.replace("<video:duration>725</video:duration>", "<video:duration>0</video:duration>"), "duration ungültig"),
                         (good.replace("2026-11-05", "gestern"), "publication_date"),
                         (good.replace("<lastmod>2026-11-10</lastmod>", ""), "lastmod")):
            f.write_text(bad, "utf-8")
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf): rc = CS.main(["check_sitemaps.py", str(self.docs), str(self.r2)])
            self.assertEqual(rc, 1, msg); self.assertIn(msg, buf.getvalue())
        f.write_text(good.replace(f"{BASE}/show/episodes/e/", f"{BASE}/nirgends/"), "utf-8")   # Seite steht in keiner normalen Sitemap
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf): rc = CS.main(["check_sitemaps.py", str(self.docs), str(self.r2)])
        self.assertEqual(rc, 1); self.assertIn("keiner normalen Sitemap", buf.getvalue())


if __name__ == "__main__":
    unittest.main()
