"""Englische Blog-Uebersicht je Autor: ohne englischen Beitrag gab /community/u/<handle>/blog/ 404, obwohl der Blog-Kanal im Profil
(worker/src/blog.js syncFeed) und die Brotkrumen dorthin zeigten (Marcel Lehmann, 18.11.2026: nur deutsche Beitraege)."""
import unittest

import site_blog as BLG

BASE = "https://www.example.test"
NOTE = "No posts in English yet"


def post(slug, lang="de", handle="anna", **kw):
    return {"id": abs(hash((slug, lang, handle))) % 10 ** 6, "handle": handle, "name": handle.title(), "slug": slug, "lang": lang, "title": f"Titel {slug}",
            "summary": f"Kurz {slug}", "body": "Text " * 80, "topics": [], "published": 1793836800, "created": 1793836800, "updated": 1793836800, "votes": 0,
            "coauthors": [], "faq": [], **kw}


def build(posts, people=None):
    files, pages, sitemap = {}, {}, []

    def page(lang, title, desc, canonical, body, alternates=None, jsonld=None, xdefault=None, noindex=False, **kw):
        pages[canonical] = {"noindex": noindex, "ld": jsonld or [], "body": body}
        return body
    g = {"BASE": BASE, "write": files.__setitem__, "write_r2": files.__setitem__, "page": page, "header": lambda lang, s: "", "footer": lambda lang: "",
         "footer_en": lambda: "", "LANGS": {}, "sitemap": sitemap, "TODAY": "2026-11-18"}
    BLG.build(g, posts, people or [{"handle": "anna", "name": "Anna"}], "https://api.example.test")
    return files, pages, sitemap


class EnglischeUebersicht(unittest.TestCase):
    def test_nur_deutsch_ergibt_englische_uebersicht_mit_links_auf_de(self):
        files, pages, sitemap = build([post("eins"), post("zwei")])
        self.assertIn("community/u/anna/blog/index.html", files)
        h = files["community/u/anna/blog/index.html"]
        self.assertIn(NOTE, h)
        self.assertIn(f'href="{BASE}/de/community/u/anna/blog/eins/" hreflang="de" lang="de"', h)
        self.assertIn(f'href="{BASE}/de/community/u/anna/blog/zwei/"', h)
        ru = f"{BASE}/community/u/anna/blog/"
        self.assertTrue(pages[ru]["noindex"])
        self.assertNotIn(ru, [s[0] for s in sitemap])
        self.assertIn("de/community/u/anna/blog/index.html", files)   # die deutsche Uebersicht bleibt wie bisher

    def test_mit_englischem_beitrag_kein_rueckfall(self):
        files, _, _ = build([post("eins"), post("two", lang="en")])
        self.assertNotIn(NOTE, files["community/u/anna/blog/index.html"])

    def test_englische_ki_fassung_zaehlt_als_englisch(self):
        files, _, _ = build([post("eins"), post("eins", lang="en", ai_tr=True, src_lang="de")])
        self.assertNotIn(NOTE, files["community/u/anna/blog/index.html"])

    def test_co_autorin_ohne_englischen_beitrag(self):
        people = [{"handle": "anna", "name": "Anna"}, {"handle": "ben", "name": "Ben"}]
        files, _, _ = build([post("eins", coauthors=[{"handle": "ben", "name": "Ben"}]), post("two", lang="en")], people)
        self.assertNotIn(NOTE, files["community/u/anna/blog/index.html"])
        self.assertIn(NOTE, files["community/u/ben/blog/index.html"])
        self.assertIn(f"{BASE}/de/community/u/anna/blog/eins/", files["community/u/ben/blog/index.html"])

    def test_brotkrumen_blog_in_der_sprache_des_beitrags(self):
        _, pages, _ = build([post("eins")])
        ld = pages[f"{BASE}/de/community/u/anna/blog/eins/"]["ld"]
        crumbs = [x for x in ld if x.get("@type") == "BreadcrumbList" and any(i.get("name") == "Blog" for i in x["itemListElement"])][0]
        blog = [i for i in crumbs["itemListElement"] if i["name"] == "Blog"][0]
        self.assertEqual(f"{BASE}/de/community/u/anna/blog/", blog["item"])


if __name__ == "__main__":
    unittest.main()
