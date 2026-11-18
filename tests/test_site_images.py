"""Bild-Sitemaps (site_images.py): welche Bilder gelten, Dateien je Sprache, Aufteilung, Index, Notschalter, Pruefung in check_sitemaps.py."""
import contextlib, io, os, sys, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import check_sitemaps as CS   # noqa: E402
import site_images as SI   # noqa: E402
import site_sitemaps as SMAP   # noqa: E402

BASE = CS.BASE
LANGS = {"de": ("Deutsch", "de"), "fr": ("Francais", "fr")}
PAGE = ('<html><body><header><img src="https://img.m365.fm/logo.png" width="400" height="300"></header><main class="wrap">'
        '<figure><img src="https://img.m365.fm/ig/blog/a/en-0-abc.webp" alt="x" width="1200" height="630" fetchpriority="high"></figure>'
        '<p>Text</p><img src="/images/local.jpg" width="800" height="400">'
        '<img src="https://d1.cloudfront.net/cover.jpg?x=1&amp;y=2" width="640" height="360">'
        '<img src="https://img.m365.fm/small.png" width="160" height="160">'
        '<img src="https://img.m365.fm/deco.png" aria-hidden="true">'
        '<img src="https://img.m365.fm/icon.svg" width="500" height="500">'
        '<img src="data:image/png;base64,AAAA"><img src="http://insecure.example/a.jpg">'
        '<img src="https://img.m365.fm/ig/blog/a/en-0-abc.webp" width="1200" height="630">'
        f'<img src="{BASE}/assets/logo.png" width="500" height="500">'
        '<aside><img src="https://img.m365.fm/side.jpg" width="900" height="900"></aside><noscript><img src="https://img.m365.fm/ns.jpg"></noscript>'
        '</main><footer><img src="https://img.m365.fm/foot.jpg" width="900" height="900"></footer></body></html>')


class Extract(unittest.TestCase):
    def test_main_content_only_and_filters(self):
        got = SI.extract(f"{BASE}/community/u/m/blog/a/", PAGE, BASE)
        self.assertEqual(got, ["https://img.m365.fm/ig/blog/a/en-0-abc.webp", f"{BASE}/images/local.jpg", "https://d1.cloudfront.net/cover.jpg?x=1&y=2"])

    def test_no_main_no_images(self):
        self.assertEqual(SI.extract(BASE + "/x/", '<img src="https://a.b/c.jpg" width="900" height="900">', BASE), [])

    def test_limit_per_page(self):
        html = "<main>" + "".join(f'<img src="https://i.m365.fm/{n}.jpg" width="900" height="500">' for n in range(50)) + "</main>"
        self.assertEqual(len(SI.extract(BASE + "/x/", html, BASE)), SI.MAX_PER_PAGE)


class Build(unittest.TestCase):
    def setUp(self):
        self.t = tempfile.TemporaryDirectory(); r = Path(self.t.name)
        self.docs, self.r2 = r / "docs", r / "r2out"
        for p in ("community/u/m/blog/a", "de/community/u/m/blog/a", "fr/show/episodes/e", "plain"):
            (self.docs / p).mkdir(parents=True)
        (self.docs / "community/u/m/blog/a/index.html").write_text(PAGE, "utf-8")
        (self.docs / "de/community/u/m/blog/a/index.html").write_text(PAGE.replace("en-0", "de-0"), "utf-8")
        (self.r2 / "fr/show/episodes/e").mkdir(parents=True)
        (self.r2 / "fr/show/episodes/e/index.html").write_text("<main><img src='https://img.m365.fm/e.webp' width='1200' height='630'></main>", "utf-8")
        (self.docs / "plain/index.html").write_text("<main><p>kein Bild</p></main>", "utf-8")
        self.sm = [(f"{BASE}/community/u/m/blog/a/", "2026-11-10", None), (f"{BASE}/de/community/u/m/blog/a/", "2026-11-11", None),
                   (f"{BASE}/fr/show/episodes/e/", "2026-11-12", None), (f"{BASE}/plain/", "2026-11-12", None), (f"{BASE}/missing/", "2026-11-12", None)]
        self.out = {}
    def tearDown(self): self.t.cleanup()
    def write(self, n, c): self.out[n] = c

    def test_files_per_language_and_index(self):
        files = SI.build(self.sm, [self.docs, self.r2], BASE, LANGS, self.write, "2026-11-18")
        self.assertEqual([f[0] for f in files], ["sitemap-en-images.xml", "sitemap-de-images.xml", "sitemap-fr-images.xml"])
        self.assertEqual([f[2] for f in files], [1, 1, 1])   # Seite ohne Bild und fehlende Seite fehlen
        self.assertIn("<image:loc>https://img.m365.fm/ig/blog/a/de-0-abc.webp</image:loc>", self.out["sitemap-de-images.xml"])
        self.assertIn("x=1&amp;y=2", self.out["sitemap-en-images.xml"])   # & maskiert
        self.assertIn('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"', self.out["sitemap-en-images.xml"])
        SMAP.write_all(self.sm, self.write, BASE, LANGS, "2026-11-18", extra=files)
        idx = self.out["sitemap.xml"]
        for n in ("sitemap-en-images.xml", "sitemap-de-images.xml", "sitemap-fr-images.xml"): self.assertIn(f"<loc>{BASE}/{n}</loc>", idx)
        self.assertIn("sitemap-en-blog.xml", idx)   # normale Sitemaps unveraendert im Index
        self.assertNotIn("image:", "".join(v for k, v in self.out.items() if "images" not in k))

    def test_split_by_url_count(self):
        old = SI.MAX_URLS; SI.MAX_URLS = 1
        try:
            (self.docs / "community/u/m/blog/b").mkdir(parents=True); (self.docs / "community/u/m/blog/b/index.html").write_text(PAGE, "utf-8")
            files = SI.build(self.sm + [(f"{BASE}/community/u/m/blog/b/", "2026-11-09", None)], [self.docs, self.r2], BASE, LANGS, self.write, "2026-11-18")
        finally: SI.MAX_URLS = old
        self.assertIn("sitemap-en-images-2.xml", [f[0] for f in files])

    def test_kill_switch(self):
        os.environ["IMAGE_SITEMAP"] = "0"
        try: self.assertEqual(SI.build(self.sm, [self.docs, self.r2], BASE, LANGS, self.write, "2026-11-18"), [])
        finally: del os.environ["IMAGE_SITEMAP"]
        self.assertEqual(self.out, {})

    def test_check_sitemaps_accepts_and_rejects(self):
        files = SI.build(self.sm, [self.docs, self.r2], BASE, LANGS, self.write, "2026-11-18")
        SMAP.write_all(self.sm, self.write, BASE, LANGS, "2026-11-18", extra=files)
        for n, c in self.out.items():   # en und de nach docs/, die uebrigen nach r2out/ (site_size.r2_only)
            import site_size
            l = site_size.sitemap_lang(n); (self.r2 if l and l not in site_size.PAGES_LANGS else self.docs).mkdir(parents=True, exist_ok=True)
            ((self.r2 if l and l not in site_size.PAGES_LANGS else self.docs) / n).write_text(c, "utf-8")
        def run():
            buf = io.StringIO(); old = CS.DOCS
            try:
                with contextlib.redirect_stdout(buf): rc = CS.main(["check_sitemaps.py", str(self.docs), str(self.r2)])
            finally: CS.DOCS = old
            return rc, buf.getvalue()
        rc, out = run(); self.assertEqual(rc, 0, out); self.assertIn("Bild-Sitemaps: 3 Dateien, 3 Seiten", out)
        f = self.docs / "sitemap-en-images.xml"; good = f.read_text("utf-8")
        f.write_text(good.replace("https://img.m365.fm/ig/blog/a/en-0-abc.webp", "http://img.m365.fm/a.webp"), "utf-8")
        rc, out = run(); self.assertEqual(rc, 1); self.assertIn("Bild nicht https", out)
        f.write_text(good.replace(f"{BASE}/community/u/m/blog/a/", f"{BASE}/nirgends/"), "utf-8")
        rc, out = run(); self.assertEqual(rc, 1); self.assertIn("keiner normalen Sitemap", out)


if __name__ == "__main__":
    unittest.main()
