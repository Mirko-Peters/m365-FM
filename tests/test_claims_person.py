"""Claims -> Personen-Entitaet: eine uebernommene Firma ist nie die Person des Profils (BlogPosting.author, sameAs, Team)."""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_members as MEM   # noqa: E402
import site_blog as SB   # noqa: E402

BASE = "https://www.m365.fm"
ENTS = {"ifakt": {"type": "org"}, "jane-doe": {"type": "person"}, "copilot": {"type": "product"}}


class Claims(unittest.TestCase):
    def setUp(self):
        self._old = dict(MEM.CLAIMED); MEM.CLAIMED.clear()

    def tearDown(self):
        MEM.CLAIMED.clear(); MEM.CLAIMED.update(self._old)

    def test_firma_ist_keine_person(self):
        MEM.load_claims([{"handle": "mirko-p", "eid": "ifakt"}, {"handle": "x", "eid": "copilot"}], ENTS)
        self.assertEqual(MEM.person_entity("mirko-p"), "mirko-peters")   # Rueckfall AUTHOR_ENT, nicht die Firma
        self.assertIsNone(MEM.person_entity("x"))
        node = SB._author_node(BASE, {"handle": "mirko-p", "name": "Mirko Peters"}, f"{BASE}/community/u/mirko-p/")
        self.assertEqual(node["@id"], f"{BASE}/entity/mirko-peters/#entity")

    def test_person_claim_gilt(self):
        MEM.load_claims([{"handle": "jane", "eid": "jane-doe"}, {"handle": "jane", "eid": "ifakt"}, {"eid": "jane-doe"}], ENTS)
        self.assertEqual(MEM.person_entity("jane"), "jane-doe")
        self.assertIsNone(MEM.person_entity("unknown"))

    def test_unbekannte_entitaet(self):
        MEM.load_claims([{"handle": "y", "eid": "gibt-es-nicht"}], ENTS)
        self.assertIsNone(MEM.person_entity("y"))


if __name__ == "__main__":
    unittest.main()
