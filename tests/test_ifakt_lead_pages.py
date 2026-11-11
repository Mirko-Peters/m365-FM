"""Lead-Formular eines Sponsors (lead_topics) auf Blogbeitraegen, Folgen und Sprachseiten mit passendem Thema."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_ads as ADS   # noqa: E402
import site_sponsorships as S   # noqa: E402

BASE = "https://www.m365.fm"
ENTS = {"acme": {"type": "org", "name": "Acme"}, "acme-app": {"type": "product", "name": "Acme App", "rel": [["developed_by", "acme"]]},
        "gemba-walk": {"type": "concept", "name": "Gemba walk"}, "sharepoint": {"type": "product", "name": "SharePoint"}}
REC = {"id": "acme-1", "sponsor": {"name": "Acme", "url": "https://acme.example/"}, "label": "sponsored", "start": "2026-11-06", "end": None, "entities": ["acme"],
       "lead_topics": ["gemba-walk", "gibt-es-nicht"], "manager": {"handle": "mirko-p", "entity": "mirko-peters"}}
PAGE = '<html><body><main><h1>T</h1><p>Text <a href="{b}/entity/{t}/">x</a></p></main><footer></footer></body></html>'


def page(t):
    return PAGE.format(b=BASE, t=t)


class LeadPages(unittest.TestCase):
    def setUp(self):
        S.reset()
        st = S._index([REC], "2026-11-11", {}, {})
        st["lead"], self.unknown = S.lead_index([REC], "2026-11-11", ENTS)

    def tearDown(self):
        S.reset()

    def test_index(self):
        lead = S._state()["lead"]
        self.assertEqual([x["org"] for x in lead], ["acme"])
        self.assertEqual(lead[0]["topics"], {"gemba-walk", "acme", "acme-app"})
        self.assertEqual(self.unknown, {"gibt-es-nicht"})
        self.assertIsNone(S.lead_for_page(["sharepoint"]))
        self.assertEqual(S.lead_for_page(["sharepoint", "acme-app"])["name"], "Acme")

    def test_entity_pages_of_products(self):
        le = S.lead_entities([REC], "2026-11-11", ENTS)
        self.assertEqual(set(le), {"acme", "acme-app"})
        self.assertEqual(le["acme-app"], {"org": "acme", "name": "Acme"})
        self.assertEqual(S.lead_entities([REC], "2026-11-05", ENTS), {})
        S._state()["lead_ent"] = le
        self.assertEqual(S.lead_org_of("acme-app")["org"], "acme")
        self.assertIsNone(S.lead_org_of("sharepoint"))

    def test_entity_page_uses_it(self):
        src = (ROOT / "site_entities.py").read_text("utf-8")
        self.assertIn("SPM.lead_org_of(e[\"id\"])", src)
        self.assertIn("ADS.sponsor_lead(BASE, lang, _lo[\"org\"], _lo[\"name\"])", src)

    def test_not_running_or_without_field(self):
        self.assertEqual(S.lead_index([{**REC, "start": "2030-01-01"}], "2026-11-11", ENTS)[0], [])
        self.assertEqual(S.lead_index([{k: v for k, v in REC.items() if k != "lead_topics"}], "2026-11-11", ENTS)[0], [])
        self.assertEqual(S.lead_index([{**REC, "end": "2026-11-10"}], "2026-11-11", ENTS)[0], [])

    def test_structure(self):
        ok, errs = S.check_structure({"version": 1, "sponsorships": [REC]})
        self.assertEqual(errs, [])
        for bad in ("gemba-walk", ["Ungueltig!"], ["a-b", "a-b"], [3]):
            _, errs = S.check_structure({"version": 1, "sponsorships": [{**REC, "lead_topics": bad}]})
            self.assertTrue(any("lead_topics" in e for e in errs), bad)

    def test_blog_and_episode_get_the_box(self):
        for path, pt in (("/community/u/mirko-p/blog/gemba-walk-guide/", "blog"), ("/show/episodes/some-episode/", "episode"), ("/de/community/u/mirko-p/blog/gemba-walk-guide/", "blog")):
            out = ADS._inject_lead(BASE, page("gemba-walk"), "en", BASE + path)
            self.assertIn('data-sponsor-lead="acme"', out, path)
            self.assertIn(f'data-pt="{pt}"', out, path)
            self.assertLess(out.index("data-sponsor-lead"), out.index("</main>"))
            self.assertEqual(out.count("data-sponsor-lead="), 1)
            self.assertEqual(out.count("window.M365AD="), 1)

    def test_no_box_elsewhere(self):
        blog = BASE + "/community/u/mirko-p/blog/x/"
        self.assertEqual(ADS._inject_lead(BASE, page("sharepoint"), "en", blog), page("sharepoint"))   # anderes Thema
        self.assertEqual(ADS._inject_lead(BASE, page("gemba-walk"), "en", BASE + "/entity/gemba-walk/"), page("gemba-walk"))   # Entitaetsseite: eigener Kasten
        self.assertEqual(ADS._inject_lead(BASE, page("gemba-walk"), "en", blog, noindex=True), page("gemba-walk"))
        once = ADS._inject_lead(BASE, page("gemba-walk"), "en", blog)
        self.assertEqual(ADS._inject_lead(BASE, once, "en", blog), once)   # nie doppelt

    def test_script_not_duplicated(self):
        body = page("gemba-walk").replace("</body>", "<script>window.M365AD={}</script></body>")
        out = ADS._inject_lead(BASE, body, "en", BASE + "/community/u/mirko-p/blog/x/")
        self.assertEqual(out.count("window.M365AD="), 1)
        self.assertIn("data-sponsor-lead=", out)

    def test_inject_is_wired(self):
        src = (ROOT / "site_ads.py").read_text("utf-8")
        self.assertIn("return _inject_lead(base, _inject(base, body, lang, canonical, noindex, today), lang, canonical, noindex)", src)


class IfaktData(unittest.TestCase):
    def test_ifakt_record(self):
        recs, errs = S.check_structure(json.loads((ROOT / "data" / "sponsorships.json").read_text("utf-8")))
        self.assertEqual(errs, [])
        r = next(x for x in recs if x["entities"] == ["ifakt"])
        lt = set(r["lead_topics"])
        for t in ("gemba-walk", "lean-management", "operational-excellence", "shop-floor-management", "value-stream-mapping", "aerospace"):
            self.assertIn(t, lt)
        for t in ("enterprise-resource-planning", "key-performance-indicator", "sharepoint"):
            self.assertNotIn(t, lt)   # zu breit: wuerde das Formular auf vielen M365-Folgen zeigen


if __name__ == "__main__":
    unittest.main()
