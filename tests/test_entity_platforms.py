"""Microsoft- und Azure-Plattformen (11.11.2026): neue Entitaeten mit Langtext und gueltigen Beziehungen."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_entities as E   # noqa: E402

LIST = json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))
RAW = {e["id"]: e for e in LIST}
NEW = [e["id"] for e in LIST if (e.get("source") or {}).get("import") == "ifakt-platform-entities"]
INSTANCE = {"microsoft-tool", "developer-tool", "identity-security-tool", "analytics-tool", "collaboration-tool",
            "low-code-tool", "cloud-platform", "ai-assistant", "business-application"}


class Plattformen(unittest.TestCase):
    def test_es_gibt_neue(self):
        self.assertGreaterEqual(len(NEW), 50)

    def test_vollstaendig(self):
        for i in NEW:
            e = RAW[i]
            self.assertIn(e["type"], ("product", "concept"), i)
            for lang in ("en", "de"):
                self.assertTrue(20 <= len(e["desc"][lang]) <= 300, (i, lang))
                self.assertTrue(400 <= len(e["long"][lang]) <= 3000, (i, lang))
                self.assertNotIn("http", e["desc"][lang] + e["long"][lang], i)
                self.assertNotIn("](", e["long"][lang], i)
            self.assertNotEqual(e["long"]["en"], e["long"]["de"], i)
            self.assertIn(["developed_by", "microsoft"], e["rel"], i)
            self.assertGreaterEqual(len(e["rel"]), 4, i)
            for p, to in e["rel"]:
                self.assertIn(p, E.FWD, (i, p))
                self.assertIn(to, RAW, (i, to))
                self.assertNotEqual(to, i)
                if p == "instance_of":
                    self.assertIn(to, INSTANCE, (i, to))
            self.assertTrue(e["source"].get("approved_by"), i)
            for u in (e.get("web"), e.get("docs")):
                if u:
                    self.assertTrue(u.startswith("https://"), (i, u))

    def test_ids_und_namen_eindeutig(self):
        ids = [e["id"] for e in LIST]
        self.assertEqual(len(ids), len(set(ids)))
        names = {}
        for e in LIST:
            names.setdefault(e["name"].lower(), []).append(e["id"])
        for i in NEW:
            self.assertEqual(names[RAW[i]["name"].lower()], [i], i)


if __name__ == "__main__":
    unittest.main()
