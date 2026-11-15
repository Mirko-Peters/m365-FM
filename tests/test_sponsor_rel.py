"""rel="sponsored" fuer Links auf die Website eines LAUFENDEN Sponsors in jedem Blogbeitrag (auch ohne Eintrag unter "posts"), z. B. die Cognillo-Reihe.
Echter site_blog.build() mit einem Beitrag samt Sprachfassung; ohne laufendes Sponsoring bleibt die Seite unveraendert."""
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_blog as BLG   # noqa: E402
import site_sponsorships as SPM   # noqa: E402

BASE = "https://example.test"
SLUG = "toolkit-post"
COG = {"id": "cognillo-test", "sponsor": {"name": "Cognillo", "url": "https://www.cognillo.com/"}, "label": "sponsored", "start": "2026-11-15", "end": "2027-01-31", "entities": ["cognillo"]}
HTML = ('<p>Read the <a href="https://www.cognillo.com/toolkit">toolkit page</a>, the <a href="https://blog.cognillo.com/x" rel="noopener">blog</a>, '
        '<a href="https://learn.microsoft.com/sharepoint/">Microsoft Learn</a> and <a href="https://cognillo.com.evil.example/">lookalike</a>.</p>')
LD = {}   # JSON-LD je Seite aus dem letzten build()


def post(lang="en", **extra):
    return {"id": 77, "handle": "mirko-p", "name": "Mirko Peters", "slug": SLUG, "lang": lang, "title": "A sample article about the toolkit", "summary": "x", "body": "", "html": HTML,
            "topics": [], "published": 1793836800, "created": 1793836800, "updated": 1793836800, "votes": 3, "coauthors": [], "faq": [], **extra}


def build(posts, today, recs):
    SPM.reset()
    parsed, errs = SPM.check_structure({"version": 1, "sponsorships": recs})
    assert not errs, errs
    SPM._index(parsed, today, {}, {})
    pages = {}; LD.clear()

    def page(lang, title, desc, canonical, body, *a, **k):
        pages[canonical] = body; LD[canonical] = a[1] if len(a) > 1 else None
        return body
    g = {"BASE": BASE, "write": lambda *_: None, "write_r2": lambda *_: None, "page": page, "header": lambda lang, s: "", "footer": lambda lang: "", "footer_en": lambda: "",
         "LANGS": {}, "sitemap": [], "TODAY": today}
    BLG.build(g, posts, [{"handle": "mirko-p", "name": "Mirko Peters"}], "https://api.example.test")
    return {u: b for u, b in pages.items() if f"/blog/{SLUG}/" in u}   # nur die Beitragsseiten (nicht die Verzeichnisse)


class RunningSponsorLinks(unittest.TestCase):
    def tearDown(self):
        SPM.reset()

    def test_running_includes_open_ended_and_excludes_expired_or_future(self):
        recs = [COG, {**COG, "id": "open", "end": None}, {**COG, "id": "old", "start": "2026-01-01", "end": "2026-02-01"}, {**COG, "id": "later", "start": "2027-06-01", "end": None}]
        parsed, errs = SPM.check_structure({"version": 1, "sponsorships": recs}); self.assertEqual(errs, [])
        SPM._index(parsed, "2026-11-20", {}, {})
        self.assertEqual([r["id"] for r in SPM.running()], ["cognillo-test", "open"])
        self.assertEqual([r["id"] for r in SPM.running("2027-06-02")], ["cognillo-test", "open", "later"])   # Karenzzeit: end 31.01.2027 + 182 Tage = 01.08.2027
        self.assertEqual([r["id"] for r in SPM.running("2027-08-01")], ["cognillo-test", "open", "later"])
        self.assertEqual([r["id"] for r in SPM.running("2027-08-02")], ["open", "later"])
        self.assertEqual([r["id"] for r in SPM.running("2026-01-15")], ["old"])
        self.assertEqual([r["id"] for r in SPM.running("2026-08-02")], ["old"])   # 01.02.2026 + 182 Tage
        self.assertEqual([r["id"] for r in SPM.running("2026-08-03")], [])

    def test_links_to_running_sponsor_host_get_rel_sponsored_in_original_and_translation(self):
        de = post("de", tr_of="en", ai_tr=True, legacy=True, content_tr=True, tr_index=False)
        pages = build([post(), de], "2026-11-20", [COG])   # der Beitrag steht NICHT unter "posts"
        self.assertEqual(len(pages), 2)
        for url, body in pages.items():
            tag = lambda href: re.search(r'<a [^>]*href="%s"[^>]*>' % re.escape(href), body).group(0)
            self.assertIn('rel="sponsored noopener"', tag("https://www.cognillo.com/toolkit"), url)
            self.assertIn("sponsored", tag("https://blog.cognillo.com/x")); self.assertEqual(tag("https://blog.cognillo.com/x").count("rel="), 1)   # vorhandenes rel wird ergaenzt
            self.assertNotIn("sponsored", tag("https://learn.microsoft.com/sharepoint/"))   # Microsoft Learn ist kein bezahlter Link
            self.assertNotIn("sponsored", tag("https://cognillo.com.evil.example/"))   # nur der echte Host, keine Namensaehnlichkeit
            self.assertNotIn("spm-note", body)   # ohne Eintrag unter "posts" keine Kennzeichnung unter der Ueberschrift, nur die Link-Kennzeichnung

    def test_no_running_sponsorship_leaves_page_unchanged(self):
        expired = {**COG, "start": "2026-01-01", "end": "2026-02-01"}
        with_none = build([post()], "2026-11-20", [])
        with_expired = build([post()], "2026-11-20", [expired])
        self.assertEqual(with_none, with_expired)
        for body in with_none.values(): self.assertNotIn("sponsored", body)

    def test_post_listed_under_posts_keeps_label_and_marks_links_once(self):
        listed = {**COG, "posts": [f"/community/u/mirko-p/blog/{SLUG}/"]}
        body = next(iter(build([post()], "2026-11-20", [listed]).values()))
        self.assertIn("spm-note", body)
        self.assertEqual(len(re.findall(r'href="https://www\.cognillo\.com/toolkit"[^>]*rel="sponsored noopener"', body)), 1)
        self.assertNotRegex(body, r'rel="sponsored noopener sponsored')

    def test_sponsored_post_published_after_term_end_keeps_disclosure_through_posts_entry(self):
        """Ein gesponserter Beitrag, der nach dem Ende der Laufzeit (hier 10.12.2026) live geht: Der taegliche Lauf (tools/sponsor_post.py) traegt ihn unter "posts" ein;
        damit bleiben Kennzeichnung, BlogPosting.sponsor und rel="sponsored" dauerhaft, auch nach der Karenzzeit (182 Tage, bis 10.06.2027)."""
        ended = {**COG, "start": "2026-11-10", "end": "2026-12-10"}
        de = post("de", tr_of="en", ai_tr=True, legacy=True, content_tr=True, tr_index=False)
        grace = build([post(), de], "2027-01-05", [ended])
        for body in grace.values():   # ohne Eintrag, in der Karenzzeit: rel="sponsored" an Sponsor-Links bleibt, aber keine Kennzeichnung unter der H1
            self.assertRegex(body, r'<a [^>]*href="https://www\.cognillo\.com/toolkit"[^>]*rel="sponsored noopener"'); self.assertNotIn("spm-note", body)
        for body in build([post(), de], "2027-06-10", [ended]).values(): self.assertIn('rel="sponsored noopener"', body)   # letzter Tag der Karenzzeit
        without = build([post(), de], "2027-06-11", [ended])
        for body in without.values(): self.assertNotIn("sponsored", body)   # ohne Eintrag: nach der Karenzzeit keine Kennzeichnung (deshalb der Eintrag)
        pages = build([post(), de], "2027-06-11", [{**ended, "posts": [f"/community/u/mirko-p/blog/{SLUG}/"]}])
        self.assertEqual(len(pages), 2)
        for url, body in pages.items():
            self.assertIn("spm-note", body, url)   # Kennzeichnung unter der H1 (Original und Sprachfassung)
            self.assertIn("Cognillo", body)
            self.assertRegex(body, r'<a [^>]*href="https://www\.cognillo\.com/toolkit"[^>]*rel="sponsored noopener"')
            self.assertNotIn("sponsored", re.search(r'<a [^>]*href="https://learn\.microsoft\.com/sharepoint/"[^>]*>', body).group(0))
            self.assertEqual(LD[url][0]["sponsor"]["name"], "Cognillo")   # BlogPosting.sponsor
        self.assertIn("Anzeige", next(b for u, b in pages.items() if "/de/" in u))


if __name__ == "__main__":
    unittest.main()
