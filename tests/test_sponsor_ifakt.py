"""Unbefristete Sponsorings (end null), iFAKT als Sponsor-Firma: aktive Sponsor-Firmen, sponsors.json, Lead-Formular auf der Firmenseite, Firmenverzeichnis."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_sponsorships as S   # noqa: E402
import site_ads as ADS   # noqa: E402

ENTS = {"acme": {"type": "org", "name": "Acme"}, "acme-app": {"type": "product", "rel": [["developed_by", "acme"]]}}
REC = {"id": "acme-1", "sponsor": {"name": "Acme", "url": "https://acme.example/"}, "label": "sponsored", "start": "2026-11-06", "end": None, "entities": ["acme"],
       "manager": {"handle": "mirko-p", "entity": "mirko-peters"}}


class OpenEnded(unittest.TestCase):
    def test_structure(self):
        recs, errs = S.check_structure({"version": 1, "sponsorships": [REC, {k: v for k, v in REC.items() if k not in ("end", "manager")} | {"id": "acme-2"}]})
        self.assertEqual(errs, [])
        _, errs = S.check_structure({"version": 1, "sponsorships": [{**REC, "end": "kein-datum"}]})
        self.assertTrue(errs)

    def test_active_forever(self):
        self.assertFalse(S._active(REC, "2026-11-05"))
        for d in ("2026-11-06", "2030-01-01", "2099-12-31"): self.assertTrue(S._active(REC, d), d)
        self.assertTrue(S._in_grace(REC, "2099-12-31"))
        self.assertEqual(S.sponsor_extra_entities("acme", "2099-12-31", ENTS, [REC]), ["acme", "acme-app"])
        self.assertEqual(S.sponsor_extra_entities("acme", "2026-11-05", ENTS, [REC]), [])

    def test_sponsors_json(self):
        self.assertEqual(S.sponsors_json("2027-06-01", ENTS, [REC]), {"orgs": [{"id": "acme", "name": "Acme", "manager": "mirko-p"}]})
        self.assertEqual(S.sponsors_json("2026-01-01", ENTS, [REC]), {"orgs": []})
        self.assertEqual(S.sponsors_json("2027-07-02", ENTS, [{**REC, "end": "2027-01-01"}])["orgs"][0]["id"], "acme")   # befristet, in der Karenzzeit (end + 182): bleibt
        self.assertEqual(S.sponsors_json("2027-07-03", ENTS, [{**REC, "end": "2027-01-01"}]), {"orgs": []})   # befristet und Karenzzeit vorbei: kein Lead-Formular


class Ifakt(unittest.TestCase):
    def test_data(self):
        d = json.loads((ROOT / "data" / "sponsorships.json").read_text("utf-8"))
        recs, errs = S.check_structure(d)
        self.assertEqual(errs, [])
        r = next(x for x in recs if x["entities"] == ["ifakt"])
        self.assertIsNone(r["end"]); self.assertEqual(r["start"], "2026-11-06"); self.assertEqual(r["label"], "sponsored")
        self.assertEqual(r["manager"], {"handle": "mirko-p", "entity": "mirko-peters"})
        self.assertIn("Marketing Manager bei iFAKT", r["note"])
        ents = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
        self.assertEqual(S.check_refs(recs, ents)[0], [])
        ex = S.sponsor_extra_entities("ifakt", "2030-01-01", ents, recs)
        self.assertEqual(ex[0], "ifakt"); self.assertIn("polaris", ex)
        self.assertEqual(S.badge("de", [r]), "Anzeige")

    def test_lead_block(self):
        h = ADS.sponsor_lead("https://www.m365.fm", "de", "ifakt", "iFAKT GmbH")
        self.assertIn('data-sponsor-lead="ifakt"', h); self.assertIn("Anzeige", h); self.assertIn("Kontakt zu iFAKT GmbH", h)
        self.assertIn("/assets/ads.js", h)

    def test_directory_block_and_entity_page_wired(self):
        src = (ROOT / "site_members.py").read_text("utf-8")
        self.assertIn('if kind == "companies": partners = partner_block(lang, lst)', src)
        self.assertIn('T(lang, "Advertisement", "Anzeige")', src)
        self.assertIn("{_lead}", (ROOT / "site_entities.py").read_text("utf-8"))
        self.assertIn("sponsors.json", (ROOT / "generate_site.py").read_text("utf-8"))


if __name__ == "__main__": unittest.main()
