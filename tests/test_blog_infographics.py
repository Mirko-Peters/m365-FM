"""Infografiken auf Blogseiten: auch fuer fruehere Podpage-Beitraege, die inzwischen aus der Datenbank kommen (ohne "legacy").
Live-Pruefung 19.11.2026: 10-essential-power-platform-governance-tips-everyone-needs-to-know stand im Index und war freigegeben, die Seite zeigte aber
weder Kopfbild noch Infografiken (Seite aus D1, apply_post lief nur bei legacy)."""
import gzip, json, tempfile, unittest
from pathlib import Path

import site_blog as BLG
import site_infographics as IG

BASE = "https://www.example.test"
IGU = "https://img.m365.fm/ig/blog/eins/en-"


def post(slug, handle="mirko-p", **kw):
    return {"id": abs(hash((slug, handle))) % 10 ** 6, "handle": handle, "name": handle.title(), "slug": slug, "lang": "en", "title": f"Titel {slug}",
            "summary": f"Kurz {slug}", "body": "", "html": "".join(f"<p>Absatz {i} " + "Text " * 30 + "</p>" for i in range(8)), "topics": [],
            "published": 1793836800, "created": 1793836800, "updated": 1793836800, "votes": 0, "coauthors": [], "faq": [], **kw}


class D1Beitraege(unittest.TestCase):
    def setUp(self):
        IG.reset()
        self.t = tempfile.TemporaryDirectory(); d = Path(self.t.name); (d / "infographics").mkdir()
        ent = {"eins": {"s": "x", "en": [["bigfact", "aaaaaaaa", "Kopf"], ["flow", "bbbbbbbb", "Ablauf"], ["hub", "cccccccc", "Hub"]]}}
        with gzip.open(d / "infographics" / "blog.json.gz", "wt") as f: json.dump(ent, f)
        (d / "infographics_live.json").write_text(json.dumps({"langs": ["en"], "kinds": ["blog"]}))
        self.old = IG.D; IG.D = d; IG.reset()

    def tearDown(self):
        IG.D = self.old; IG.reset(); self.t.cleanup()

    def build(self, posts, people):
        files, pages = {}, {}

        def page(lang, title, desc, canonical, body, alternates=None, jsonld=None, xdefault=None, noindex=False, **kw):
            pages[canonical] = {"body": body, "ld": jsonld or [], "kw": kw}
            return body
        g = {"BASE": BASE, "write": files.__setitem__, "write_r2": files.__setitem__, "page": page, "header": lambda lang, s: "", "footer": lambda lang: "",
             "footer_en": lambda: "", "LANGS": {}, "sitemap": [], "TODAY": "2026-11-19"}
        BLG.build(g, posts, people, "https://api.example.test")
        return pages

    def test_datenbank_fassung_bekommt_infografiken(self):
        pages = self.build([post("eins")], [{"handle": "mirko-p", "name": "Mirko Peters"}])
        pg = pages[f"{BASE}/community/u/mirko-p/blog/eins/"]
        self.assertIn(IGU + "0-aaaaaaaa.webp", pg["body"]); self.assertIn(IGU + "1-bbbbbbbb.webp", pg["body"])
        self.assertEqual(pg["kw"].get("og_image"), (IGU + "0-aaaaaaaa.jpg", 1200, 630))
        self.assertTrue(any(x.get("@type") == "ImageObject" and str(x.get("contentUrl", "")).startswith(IGU) for x in pg["ld"]))

    def test_fremder_beitrag_mit_gleichem_slug_bleibt_unveraendert(self):
        pages = self.build([post("eins", handle="anna")], [{"handle": "anna", "name": "Anna"}])
        pg = pages[f"{BASE}/community/u/anna/blog/eins/"]
        self.assertNotIn("img.m365.fm/ig/", pg["body"]); self.assertNotIn("og_image", pg["kw"])


if __name__ == "__main__":
    unittest.main()
