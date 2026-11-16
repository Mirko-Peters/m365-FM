"""Sitemaps der Sprachen ausser en/de liegen seit 16.11.2026 nur in r2out/ (R2-Bucket, site_size.r2_only): die blockierende Pruefung
(check_sitemaps.py) liest docs/ und r2out/, alle Stellen mit der Namensregel stimmen ueberein (site_size, Site-Worker, r2out-Upload, Seiten-Hashes),
und tools/page_hashes.py nimmt die Sitemaps aus r2out/ mit (sonst gaelten sie nach dem Umzug als entfallen)."""
import contextlib, io, json, re, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import check_sitemaps as CS   # noqa: E402
import site_size   # noqa: E402

BASE = CS.BASE


def urlset(*paths, alts=None):
    a = "".join(f'<xhtml:link rel="alternate" hreflang="{k}" href="{BASE}{v}"/>' for k, v in (alts or {}).items())
    return ('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
            + "".join(f"<url><loc>{BASE}{p}</loc><lastmod>2026-11-16</lastmod>{a}</url>" for p in paths) + "</urlset>")


def index(*names):
    return ('<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
            + "".join(f"<sitemap><loc>{BASE}/{n}</loc><lastmod>2026-11-16</lastmod></sitemap>" for n in names) + "</sitemapindex>")


class CheckSitemapsTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); t = Path(self.tmp.name)
        self.docs, self.r2 = t / "docs", t / "r2out"; self.docs.mkdir(); self.r2.mkdir()
    def tearDown(self): self.tmp.cleanup()
    def put(self, base, name, body): (base / name).write_text(body, "utf-8")
    def run_check(self, *argv):
        out = io.StringIO(); old = CS.DOCS
        try:
            with contextlib.redirect_stdout(out): rc = CS.main(["check_sitemaps.py", *argv] if argv else ["check_sitemaps.py", str(self.docs), str(self.r2)])
        finally:
            CS.DOCS = old
        return rc, out.getvalue()
    def build(self):
        self.put(self.docs, "sitemap.xml", index("sitemap-en-blog.xml", "sitemap-de-blog.xml", "sitemap-fr-blog.xml", "sitemap-ja-show-episodes-2.xml"))
        self.put(self.docs, "sitemap-en-blog.xml", urlset("/community/u/m/blog/p/", alts={"en": "/community/u/m/blog/p/", "fr": "/fr/community/u/m/blog/p/", "x-default": "/community/u/m/blog/p/"}))
        self.put(self.docs, "sitemap-de-blog.xml", urlset("/de/community/u/m/blog/p/"))
        self.put(self.r2, "sitemap-fr-blog.xml", urlset("/fr/community/u/m/blog/p/", alts={"en": "/community/u/m/blog/p/", "fr": "/fr/community/u/m/blog/p/", "x-default": "/community/u/m/blog/p/"}))
        self.put(self.r2, "sitemap-ja-show-episodes-2.xml", urlset("/ja/show/episodes/a/"))

    def test_checks_sitemaps_in_docs_and_r2out(self):
        self.build()
        rc, out = self.run_check()
        self.assertEqual(rc, 0, out); self.assertIn("4 Sitemap-Dateien (2 davon in r2out/), 4 URLs, 0 Fehler", out); self.assertNotIn("::warning::", out)

    def test_default_r2out_next_to_docs(self):
        """Wie im Seitenbau ohne Argumente bzw. mit gesetztem DOCS (tests/test_site_invite.py): r2out/ neben docs/."""
        self.build()
        old = CS.DOCS; CS.DOCS = self.docs
        try:
            with contextlib.redirect_stdout(io.StringIO()) as o: rc = CS.main()
        finally:
            CS.DOCS = old
        self.assertEqual(rc, 0, o.getvalue()); self.assertIn("(2 davon in r2out/)", o.getvalue())

    def test_errors_in_r2out_sitemaps_still_block(self):
        self.build()
        self.put(self.r2, "sitemap-fr-blog.xml", urlset("/fr/a/", "/fr/a/", alts={"fr": "/fr/a/", "x-default": "/fr/a/"}).replace("2026-11-16", "gestern", 1))
        rc, out = self.run_check()
        self.assertEqual(rc, 1)
        self.assertIn("sitemap-fr-blog.xml: lastmod fehlt/ungültig", out); self.assertIn("doppelt: " + BASE + "/fr/a/", out); self.assertIn("x-default ohne englische Fassung", out)
        self.put(self.r2, "sitemap-ja-show-episodes-2.xml", "<urlset")
        rc, out = self.run_check(); self.assertEqual(rc, 1); self.assertIn("sitemap-ja-show-episodes-2.xml: nicht wohlgeformt", out)

    def test_duplicates_across_docs_and_r2out(self):
        self.build(); self.put(self.r2, "sitemap-ja-show-episodes-2.xml", urlset("/de/community/u/m/blog/p/"))
        rc, out = self.run_check(); self.assertEqual(rc, 1); self.assertIn("in sitemap-de-blog.xml und sitemap-ja-show-episodes-2.xml", out)

    def test_missing_everywhere_is_error(self):
        self.build(); (self.r2 / "sitemap-fr-blog.xml").unlink()
        rc, out = self.run_check(); self.assertEqual(rc, 1); self.assertIn("fehlende Datei sitemap-fr-blog.xml (weder docs/ noch r2out/)", out)

    def test_misplaced_is_warning_unservable_name_in_r2out_is_error(self):
        self.build()
        (self.r2 / "sitemap-fr-blog.xml").rename(self.docs / "sitemap-fr-blog.xml")   # alter Stand: noch in docs/ -> ausgeliefert, nur Hinweis
        rc, out = self.run_check(); self.assertEqual(rc, 0, out); self.assertIn("::warning::Sitemap sitemap-fr-blog.xml liegt in docs/, erwartet in r2out/", out)
        self.put(self.r2, "sitemap-extra.xml", urlset("/x/"))   # liefert der Site-Worker aus r2out/ nicht aus
        self.put(self.docs, "sitemap.xml", index("sitemap-en-blog.xml", "sitemap-de-blog.xml", "sitemap-fr-blog.xml", "sitemap-ja-show-episodes-2.xml", "sitemap-extra.xml"))
        rc, out = self.run_check(); self.assertEqual(rc, 1); self.assertIn("sitemap-extra.xml liegt nur in r2out/, der Site-Worker liefert diesen Namen nicht aus", out)


class SameRuleEverywhereTest(unittest.TestCase):
    """Eine Namensregel an vier Stellen: was site_size nach r2out/ legt, muss der Site-Worker ausliefern, der Upload als blockierend kennen und
    page_hashes mitzaehlen - sonst 404 oder verlorene Purges nach dem Umzug."""
    NAMES_YES = ["sitemap-fr-blog.xml", "sitemap-ja-show-episodes.xml", "sitemap-ko-pages-2.xml", "sitemap-en-entity.xml", "sitemap-uk-community-12.xml"]
    NAMES_NO = ["sitemap.xml", "sitemap-fr.xml", "sitemap-fra-blog.xml", "sitemap-FR-blog.xml", "sitemap-fr-blog.json", "sitemap-fr-2.xml", "x-sitemap-fr-blog.xml", "sitemap-fr-blog.xml.gz"]

    def test_regexes_agree(self):
        js = (ROOT / "sitewrk" / "index.js").read_text("utf-8")
        m = re.search(r"export const SITEMAP_R2 = /\^\\/(.+?)\$/;", js); self.assertTrue(m, "SITEMAP_R2 im Site-Worker")
        worker = re.compile("^" + m.group(1).replace("\\/", "/") + "$")
        up = re.search(r'SITEMAP = re\.compile\(r"\^pages/(.+?)\$"\)', (ROOT / "tools" / "r2_pages_upload.py").read_text("utf-8")); self.assertTrue(up)
        ph = re.search(r'SITEMAP = re\.compile\(r"\^(.+?)\$"\)', (ROOT / "tools" / "page_hashes.py").read_text("utf-8")); self.assertTrue(ph)
        for rx in (worker, re.compile("^" + up.group(1) + "$"), re.compile("^" + ph.group(1) + "$")):
            for n in self.NAMES_YES: self.assertTrue(rx.match(n) and site_size.sitemap_lang(n), (rx.pattern, n))
            for n in self.NAMES_NO: self.assertFalse(rx.match(n) or site_size.sitemap_lang(n), (rx.pattern, n))

    def test_worker_sets_no_noindex_for_sitemaps(self):
        js = (ROOT / "sitewrk" / "index.js").read_text("utf-8")
        m = re.search(r"const NOINDEX = (/.+/i);", js); self.assertTrue(m)
        self.assertNotIn("sitemap", m.group(1))


class PageHashesTest(unittest.TestCase):
    def test_r2out_sitemaps_hashed_other_files_not(self):
        with tempfile.TemporaryDirectory() as d:
            d = Path(d)
            for rel, body in {"docs/index.html": "<html><body><main>i</main></body></html>", "docs/sitemap.xml": "<sitemapindex/>", "docs/sitemap-de-blog.xml": "<urlset/>",
                              "r2out/fr/a/index.html": "<html><body><main>a</main></body></html>", "r2out/sitemap-fr-blog.xml": "<urlset/>",
                              "r2out/search/manifest.json": "{}", "r2out/fr/feed.xml": "<rss/>"}.items():
                p = d / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(body, "utf-8")
            subprocess.run([sys.executable, str(ROOT / "tools" / "page_hashes.py"), str(d / "docs"), str(d / "p.json"), str(d / "c.json"), str(d / "r2out")], check=True, capture_output=True)
            h = json.loads((d / "p.json").read_text())
            self.assertEqual(sorted(h), ["/", "/__r2out__", "/fr/a/", "/sitemap-de-blog.xml", "/sitemap-fr-blog.xml", "/sitemap.xml"])


if __name__ == "__main__":
    unittest.main()
