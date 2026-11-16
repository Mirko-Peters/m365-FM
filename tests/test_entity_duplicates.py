"""Doppelte Entitaeten (data/entity_duplicates.json): Dublette zeigt per Canonical auf den Haupteintrag, kein Kettenverweis,
beide Eintraege existieren, gleicher Name; Brotkrumen beginnen bei M365.FM (Seite und JSON-LD)."""
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
ENTS = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
DUP = json.loads((ROOT / "data" / "entity_duplicates.json").read_text("utf-8"))["duplicates"]
SRC = (ROOT / "site_entities.py").read_text("utf-8")


class Dubletten(unittest.TestCase):
    def test_beide_eintraege_existieren_mit_gleichem_namen(self):
        for d, m in DUP.items():
            self.assertIn(d, ENTS, d)
            self.assertIn(m, ENTS, m)
            self.assertEqual(ENTS[d]["name"].casefold(), ENTS[m]["name"].casefold(), (d, m))

    def test_keine_ketten_und_keine_selbstverweise(self):
        for d, m in DUP.items():
            self.assertNotEqual(d, m)
            self.assertNotIn(m, DUP, f"{d} -> {m} -> ...")

    def test_haupteintrag_hat_mindestens_so_viele_folgen(self):
        for d, m in DUP.items():
            self.assertGreaterEqual(len(ENTS[m]["source"].get("episodes", [])), len(ENTS[d]["source"].get("episodes", [])), (d, m))

    def test_seitenbau_nutzt_die_datei(self):
        self.assertIn("_dupes()", SRC)
        self.assertRegex(SRC, r"_dm = _DUPES\.get\(e\[\"id\"\]\)")
        self.assertRegex(SRC, r"self_url=u\)\)\n\s+continue")   # Canonical = Haupteintrag, keine Sitemap-Zeile


class Brotkrumen(unittest.TestCase):
    def test_start_bei_m365fm_auf_seite_und_im_json_ld(self):
        self.assertIn('<nav aria-label="breadcrumb"><a href="{BASE}{pfx(lang)}/">M365.FM</a> › <a href="{root}">', SRC)
        self.assertRegex(SRC, r'"position": 1, "name": "M365\.FM", "item": f"\{BASE\}\{pfx\(lang\)\}/"\}, \{"@type": "ListItem", "position": 2, "name": s\["entities"\]')
        self.assertIn('"position": 3 + k', SRC)
        self.assertIn('"position": 3 + len(_cr)', SRC)


if __name__ == "__main__":
    unittest.main()
