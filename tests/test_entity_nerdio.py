"""Nerdio (neutraler Partner): Entitaeten, Beziehungen, Partner-Eintrag, Kennzeichnung "Partner" statt "Sponsored"."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import ontology as O   # noqa: E402
import site_entities as E   # noqa: E402
import site_sponsorships as SPM   # noqa: E402

LIST = json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))
RAW = {e["id"]: e for e in LIST}
CAND = json.loads((ROOT / "data" / "nerdio_new_entities.json").read_text("utf-8"))["entities"]
PLAN = json.loads((ROOT / "data" / "nerdio_plan.json").read_text("utf-8"))["articles"]
# nicht belegbar (Quelle nennt nur den Namen oder fehlt): bewusst nicht angelegt, Artikel 112, 114, 177-180 brauchen eine neue Fassung
OMITTED = {"avd-session-time-limits", "nerdio-predictive-drain-mode", "nerdio-os-disk-swapping"}
NEW = [c["id"] for c in CAND if c["id"] not in OMITTED]
NERDIO = ["nerdio"] + sorted(i for i in RAW if i.startswith("nerdio-"))


class Daten(unittest.TestCase):
    def test_alle_kandidaten_ausser_den_nicht_belegten_vorhanden(self):
        self.assertEqual(len(NEW), 68)
        for i in NEW:
            self.assertIn(i, RAW)
        for i in OMITTED:
            self.assertNotIn(i, RAW)

    def test_texte_und_quellen(self):
        for i in NEW + ["nerdio"]:
            e = RAW[i]
            for lang in ("en", "de"):
                d = e["desc"][lang]
                self.assertTrue(20 <= len(d) <= 300, (i, lang, len(d)))
                self.assertNotIn("http", d)
            self.assertTrue(e["docs"].startswith("https://learn.microsoft.com/") or e["web"].startswith("https://"), i)
            if i.startswith("nerdio"):
                self.assertTrue(e["web"].startswith("https://getnerdio.com") or e["web"].startswith("https://www.nerdio.com") or "nerdio" in e["web"], i)

    def test_beziehungen_gueltig_und_ohne_zyklus(self):
        for i in NEW + ["nerdio"]:
            for p, to in RAW[i]["rel"]:
                self.assertIn(p, E.FWD, (i, p))
                self.assertIn(to, RAW, (i, to))
                self.assertNotEqual(to, i)
        by = {e["id"]: e for e in LIST}
        for i in NEW:
            self.assertLessEqual(len(O.ancestors(i, by)), 4, i)   # Hierarchie hoechstens 4 Ebenen

    def test_nichts_verwaist(self):
        for i in NEW:
            self.assertTrue(O.parents_of(RAW[i]) , f"{i} ohne Oberbegriff")
            self.assertIsNotNone(O.primary_parent(RAW[i], RAW), i)

    def test_nerdio_produkte(self):
        for i in ("nerdio-manager-for-enterprise", "nerdio-manager-for-msp"):
            self.assertIn(["developed_by", "nerdio"], RAW[i]["rel"])
            self.assertNotIn(["instance_of", "microsoft-tool"], RAW[i]["rel"])
            self.assertTrue([r for r in RAW[i]["rel"] if r[0] == "instance_of"], i)
        self.assertEqual((RAW["nerdio"]["city"], RAW["nerdio"]["web"]), ("Chicago", "https://getnerdio.com/"))
        self.assertIn("Cloud PC", RAW["windows-365"]["aliases"])

    def test_ids_nur_einmal_und_keine_alias_kollision(self):
        ids = [e["id"] for e in LIST]
        self.assertEqual(len(ids), len(set(ids)))
        for i in NEW:
            self.assertEqual([e["id"] for e in LIST if RAW[i]["name"].lower() == e["name"].lower()], [i], i)

    def test_plan_ids_vorhanden(self):
        fehlt = {i for a in PLAN for i in a["entities"] if i not in RAW}
        self.assertEqual(fehlt, OMITTED & {i for a in PLAN for i in a["entities"]})   # nur die bewusst weggelassenen fehlen


class Partner(unittest.TestCase):
    def setUp(self):
        d = json.loads((ROOT / "data" / "sponsorships.json").read_text("utf-8"))
        self.recs, self.errs = SPM.check_structure(d)
        self.rec = next(r for r in self.recs if r["id"] == "nerdio-partner")

    def test_eintrag(self):
        self.assertEqual(self.errs, [])
        r = self.rec
        self.assertEqual((r["label"], r["start"], r["end"]), ("partner", "2026-11-16", None))
        self.assertEqual(r["sponsor"], {"name": "Nerdio", "url": "https://getnerdio.com/"})
        self.assertEqual(sorted(r["entities"]), sorted(NERDIO))
        self.assertNotIn("$", json.dumps(r))
        self.assertEqual([x["label"] for x in self.recs if x["id"] != "nerdio-partner"], ["sponsored", "sponsored"], "iFAKT und Cognillo bleiben unveraendert")

    def test_verweise_gueltig(self):
        self.assertEqual(SPM.check_refs(self.recs, RAW)[0], [])
        self.assertEqual(SPM.check_refs(self.recs, RAW)[1], [])

    def test_seite_zeigt_partner_statt_sponsored(self):
        de = SPM.note("de", [self.rec]); en = SPM.note("en", [self.rec])
        self.assertIn("Partner", de); self.assertIn("Neutraler Partner", de)
        self.assertIn("Neutral partner", en)
        for s in (de, en):
            self.assertNotIn("Sponsored", s); self.assertNotIn("Anzeige", s); self.assertNotIn("Paid", s)
        self.assertEqual(SPM.badge("de", [self.rec]), "Partner")
        self.assertEqual(SPM.badge("en", [self.rec]), "Partner")


if __name__ == "__main__":
    unittest.main()
