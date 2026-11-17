"""Autorenkasten (generate_site.author_box): Expertise und Zertifikate aus dem Profil (D1) mit zusammengefuehrten alten Entitaets-ids
(data/guest_merge.json "entities", z. B. azure-ai-foundry -> microsoft-foundry) zeigen auf das Ziel und stehen je Ziel nur einmal da."""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import generate_site as GS   # noqa: E402


class Autorenkasten(unittest.TestCase):
    def setUp(self):
        self._a = dict(GS.AUTHOR)

    def tearDown(self):
        GS.AUTHOR.clear(); GS.AUTHOR.update(self._a)

    def test_alte_id_wird_ziel_und_einmal(self):
        xs = [{"e": "azure-ai-foundry", "level": 3, "verified": True}, {"e": "microsoft-foundry", "level": 2}, {"e": "azure", "level": 3}]
        got = GS._merged_refs(xs)
        self.assertEqual([x["e"] for x in got], ["microsoft-foundry", "azure"])
        self.assertTrue(got[0]["verified"])   # der bestaetigte Eintrag gewinnt

    def test_kasten_ohne_alte_id(self):
        GS.AUTHOR.clear()
        GS.AUTHOR.update({"handle": "mirko-p", "name": "Mirko Peters", "about": "MVP.", "programs": [], "channels": [], "certs": [],
                          "expertise": [{"e": "azure-ai-foundry", "level": 3, "verified": True}, {"e": "microsoft-foundry", "level": 3, "verified": True}]})
        h = GS.author_box("en")
        self.assertNotIn("/entity/azure-ai-foundry/", h)
        self.assertEqual(h.count('/entity/microsoft-foundry/" itemprop="knowsAbout">Microsoft Foundry</a>'), 1)


if __name__ == "__main__":
    unittest.main()
