"""iFAKT-SEO-Test (11.11.2026): fuenfzehn neue Lean-/OpEx-Themen-Entitaeten (mit Langtext) und dreizehn Rollen-Entitaeten, mit gueltigen Zielen."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_entities as E   # noqa: E402

RAW = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
NEW = ["gemba-walk", "lean-management", "operational-excellence", "shop-floor-management", "takt-time", "kanban", "5s", "smed", "heijunka", "a3-problem-solving",
       "standard-work", "visual-management", "eight-wastes", "lean-six-sigma", "tier-meeting"]
JOBS = ["plant-manager", "production-manager", "lean-manager", "operational-excellence-manager", "continuous-improvement-manager", "value-stream-manager",
        "alliance-manager", "channel-manager", "cloud-solution-architect", "customer-success-manager", "technical-account-manager", "sales-engineer", "licensing-specialist"]
MODULES = ["polaris-vsm", "polaris-bsm", "polaris-designer", "polaris-simulator", "polaris-optimizer", "polaris-operator", "polaris-analyzer"]


class Themen(unittest.TestCase):
    def test_vollstaendig_und_mit_ifakt_verknuepft(self):
        for i in NEW:
            e = RAW[i]
            self.assertEqual(e["type"], "concept", i)
            for lang in ("en", "de"):
                self.assertTrue(20 <= len(e["desc"][lang]) <= 300, (i, lang))
                self.assertNotIn("http", e["desc"][lang])
            self.assertIn(["related_to", "ifakt"], e["rel"], i)
            self.assertGreaterEqual(len(e["rel"]), 3, i)
            for p, to in e["rel"]:
                self.assertIn(p, E.FWD, (i, p))
                self.assertIn(to, RAW, (i, to))
            self.assertTrue(e["source"].get("approved_by"), i)
            self.assertTrue(e["wikipedia"] == "" or e["wikipedia"].startswith("https://en.wikipedia.org/wiki/"), i)

    def test_ids_eindeutig(self):
        ids = [e["id"] for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))]
        self.assertEqual(len(ids), len(set(ids)))

    def test_jede_entitaet_zeigt_auf_ein_polaris_modul_oder_ein_thema(self):
        for i in NEW:
            targets = [to for _, to in RAW[i]["rel"]]
            self.assertTrue(any(t in MODULES or t in NEW or t in ("lean-management", "continuous-improvement", "kaizen", "value-stream-mapping", "finite-capacity-scheduling") for t in targets), i)

    def test_langtexte_der_themen(self):
        for i in NEW:
            L = RAW[i]["long"]
            for lang in ("en", "de"):
                self.assertTrue(400 <= len(L[lang]) <= 3000, (i, lang, len(L[lang])))
                self.assertNotIn("http", L[lang]); self.assertNotIn("](", L[lang]); self.assertNotIn("**", L[lang])
            self.assertNotEqual(L["en"], L["de"], i)


class Rollen(unittest.TestCase):
    def test_rollen_vollstaendig(self):
        for i in JOBS:
            e = RAW[i]
            self.assertEqual(e["type"], "job", i)
            self.assertTrue(e["aliases"], i)
            for lang in ("en", "de"):
                self.assertTrue(20 <= len(e["desc"][lang]) <= 300, (i, lang))
                self.assertTrue(400 <= len(e["long"][lang]) <= 3000, (i, lang))
                self.assertNotIn("http", e["desc"][lang] + e["long"][lang])
            self.assertGreaterEqual(len(e["rel"]), 2, i)
            for p, to in e["rel"]:
                self.assertIn(p, E.FWD, (i, p))
                self.assertIn(to, RAW, (i, to))
            self.assertTrue(e["source"].get("approved_by"), i)

    def test_rollen_ids_und_namen_eindeutig(self):
        names = [RAW[i]["name"].lower() for i in JOBS]
        self.assertEqual(len(names), len(set(names)))


if __name__ == "__main__":
    unittest.main()
