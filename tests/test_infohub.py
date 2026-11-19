"""Infografiken-Seite (site_infohub.py): fuellt sich aus den Seiten, die ihre Bilder ausgeben; ohne Freigabe keine Seite; Einbettungscode mit Namensnennung.
Lauf: python3 -m unittest tests/test_infohub.py"""
import gzip
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_infographics as IG  # noqa: E402
import site_infohub as IH  # noqa: E402
import site_imglicense as ILC  # noqa: E402

ENT = lambda a: [["bigfact", "aaaaaaaa", a], ["flow", "bbbbbbbb", "Flow of steps."], ["compare", "cccccccc", "A versus B."]]


class T(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); d = Path(self.tmp.name)
        (d / "infographics").mkdir()
        idx = {f"post-{i:02d}": {"en": ENT(f'Header <{i}> & "x"'), "de": ENT(f"Kopfbild {i}"), "s": "h"} for i in range(30)}
        with gzip.open(d / "infographics" / "blog.json.gz", "wt", encoding="utf-8") as f: json.dump(idx, f)
        with gzip.open(d / "infographics" / "entity.json.gz", "wt", encoding="utf-8") as f: json.dump({"azure": {"en": ENT("Azure"), "s": "h"}}, f)
        (d / "infographics_live.json").write_text(json.dumps({"langs": ["en", "de"], "kinds": ["blog", "entity"]}))
        self.old = IG.D; IG.D = d; IG.reset()

    def tearDown(self):
        IG.D = self.old; IG.reset(); self.tmp.cleanup()

    def reg(self):
        for i in range(30):
            IG.image_ld("https://x.test", "blog", f"post-{i:02d}", "en", f"https://x.test/b/{i}/", title=f"Post {i:02d} <b>", date=f"2026-11-{(i % 28) + 1:02d}")
            IG.image_ld("https://x.test", "blog", f"post-{i:02d}", "de", f"https://x.test/de/b/{i}/", title=f"Beitrag {i:02d}", date=f"2026-11-{(i % 28) + 1:02d}")
        IG.image_ld("https://x.test", "entity", "azure", "en", "https://x.test/entity/azure/", title="Azure")
        IG.image_ld("https://x.test", "blog", "post-00", "en", "https://x.test/b/0/")   # ohne Titel: nicht im Verzeichnis (anderer Aufruf)

    def test_nothing_without_release_or_registration(self):
        out = {}
        g = dict(BASE="https://x.test", write=lambda p, h: out.__setitem__(p, h), page=None, sitemap=[], TODAY="2026-11-19")
        self.assertEqual(IH.build(g), 0); self.assertEqual(out, {}); self.assertEqual(g["sitemap"], [])
        (Path(IG.D) / "infographics_live.json").write_text("{}"); IG.reset(); self.reg()
        self.assertEqual(IH.items("en"), {})   # nicht freigegeben -> get() liefert nichts -> nichts gemeldet

    def test_items_cap_order_and_kinds(self):
        self.reg()
        it = IH.items("en")
        self.assertEqual(set(it), {"blog", "entity"}); self.assertEqual(len(it["blog"]), IH.CAP)
        dates = [v["date"] for v in it["blog"]]; self.assertEqual(dates, sorted(dates, reverse=True))
        self.assertNotIn("episode", it)   # Art nicht freigegeben

    def test_build_pages_embed_and_escaping(self):
        self.reg()
        out, sm = {}, []
        page = lambda lg, title, meta, u, body, alts, ld, **kw: json.dumps({"lg": lg, "t": title, "u": u, "body": body, "alts": alts, "ld": ld, "kw": kw}, ensure_ascii=False)
        g = dict(BASE="https://x.test", write=lambda p, h: out.__setitem__(p, h), page=page, header=lambda lg, x: "<hdr>", footer=lambda lg: "<ftr>", sitemap=sm, TODAY="2026-11-19")
        self.assertEqual(IH.build(g), 2)
        self.assertEqual(set(out), {"infographics/index.html", "de/infografiken/index.html"})
        en = json.loads(out["infographics/index.html"]); de = json.loads(out["de/infografiken/index.html"])
        self.assertEqual(en["u"], "https://x.test/infographics/"); self.assertEqual(de["u"], "https://x.test/de/infografiken/")
        self.assertEqual(en["alts"], {"en": en["u"], "de": de["u"]})
        self.assertIn("CC BY 4.0", en["body"]); self.assertIn("<textarea", en["body"])
        self.assertNotIn("<b>", en["body"].replace("&lt;b&gt;", ""))   # Titel mit HTML wird maskiert
        self.assertIn("https://creativecommons.org/licenses/by/4.0/", en["body"]); self.assertIn("deed.de", de["body"])
        self.assertIn("https://x.test/image-license/", en["body"]); self.assertIn("https://x.test/de/bildlizenz/", de["body"])
        self.assertEqual(en["ld"][0]["@type"], "CollectionPage"); self.assertEqual(len(en["ld"][0]["mainEntity"]["itemListElement"]), IH.CAP + 1)
        self.assertTrue(en["kw"]["og_image"][0].endswith(".jpg"))
        self.assertEqual([x[0] for x in sm], [en["u"], de["u"]])

    def test_only_one_language_no_hreflang(self):
        IG.image_ld("https://x.test", "entity", "azure", "en", "https://x.test/entity/azure/", title="Azure")
        sm, out = [], {}
        page = lambda lg, title, meta, u, body, alts, ld, **kw: json.dumps({"alts": alts, "switch": kw.get("switch")})
        IH.build(dict(BASE="https://x.test", write=lambda p, h: out.__setitem__(p, h), page=page, header=lambda *a: "", footer=lambda *a: "", sitemap=sm, TODAY="t"))
        self.assertEqual(set(out), {"infographics/index.html"}); self.assertEqual(json.loads(out["infographics/index.html"]), {"alts": None, "switch": None})

    def test_license_page_links_hub_only_when_it_exists(self):
        self.assertNotIn("/infographics/", ILC.body("en", "https://x.test"))
        self.reg()
        self.assertIn("https://x.test/infographics/", ILC.body("en", "https://x.test")); self.assertIn("https://x.test/de/infografiken/", ILC.body("de", "https://x.test"))


if __name__ == "__main__":
    unittest.main()
