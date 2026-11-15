"""Wettbewerbsvergleich (11.11.2026): 18 fehlende Lean-/Simulationsbegriffe als Entitaeten mit Langtext und gueltigen Beziehungen."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_entities as E   # noqa: E402

LIST = json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))
RAW = {e["id"]: e for e in LIST}
NEW = ["just-in-time", "pull-system", "cycle-time", "lead-time", "setup-time", "theory-of-constraints", "micro-stops", "scrap-rate", "safety-stock",
       "poka-yoke", "total-productive-maintenance", "hoshin-kanri", "line-balancing", "spaghetti-diagram", "batch-size", "buffer-management",
       "virtual-commissioning", "automated-guided-vehicle"]


class Begriffe(unittest.TestCase):
    def test_vollstaendig(self):
        for i in NEW:
            e = RAW[i]
            self.assertEqual(e["type"], "concept", i)
            self.assertTrue(e["aliases"], i)
            for lang in ("en", "de"):
                self.assertTrue(20 <= len(e["desc"][lang]) <= 300, (i, lang))
                self.assertTrue(400 <= len(e["long"][lang]) <= 3000, (i, lang))
                self.assertNotIn("http", e["desc"][lang] + e["long"][lang])
                self.assertNotIn("](", e["long"][lang])
            self.assertNotEqual(e["long"]["en"], e["long"]["de"], i)
            self.assertIn(["related_to", "ifakt"], e["rel"], i)
            self.assertGreaterEqual(len(e["rel"]), 4, i)
            for p, to in e["rel"]:
                self.assertIn(p, E.FWD, (i, p))
                self.assertIn(to, RAW, (i, to))
                self.assertNotEqual(to, i)
            self.assertTrue(e["source"].get("approved_by"), i)

    def test_ids_und_aliase_eindeutig(self):
        ids = [e["id"] for e in LIST]
        self.assertEqual(len(ids), len(set(ids)))
        owner = {}
        for e in LIST:
            for n in [e["name"]] + list(e.get("aliases") or []):
                if e["id"] in NEW or owner.get(n.lower()) in NEW:
                    self.assertIn(owner.get(n.lower(), e["id"]), (e["id"],), (n, e["id"], owner.get(n.lower())))
                owner.setdefault(n.lower(), e["id"])


if __name__ == "__main__":
    unittest.main()
