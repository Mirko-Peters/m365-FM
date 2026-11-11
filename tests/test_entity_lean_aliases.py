"""Lean-Entitaeten aus #365: keine Alltagswoerter als Aliase ('Lean', 'DOWNTIME'), die M365-Folgen fremde Seitenleisten-Chips geben,
und keine falschen 'Auch bekannt als'-Namen ('Six Sigma' ist eine eigene Methode, 'Lean vs Six Sigma' eine Suchphrase)."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_sidebar as SB   # noqa: E402

RAW = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
LEAN = {"lean-management", "eight-wastes", "lean-six-sigma", "operational-excellence", "kanban", "takt-time", "smed", "heijunka", "standard-work"}


class Aliase(unittest.TestCase):
    def test_keine_alltagswoerter(self):
        self.assertNotIn("Lean", RAW["lean-management"]["aliases"])
        self.assertNotIn("DOWNTIME", RAW["eight-wastes"]["aliases"])
        self.assertIn("Lean manufacturing", RAW["lean-management"]["aliases"])   # spezifische Formen bleiben

    def test_six_sigma_ist_kein_anderer_name(self):
        al = {a.lower() for a in RAW["lean-six-sigma"]["aliases"]}
        self.assertNotIn("six sigma", al)
        self.assertNotIn("lean vs six sigma", al)

    def test_m365_texte_ohne_lean_chips(self):
        ix = SB.Index()
        for t in ("The End of AI Bloat: keep enterprise agents lean and focused on one task in Microsoft 365 Copilot.",
                  "Azure Disk Storage - Simply Explained. No downtime, no disk swaps: resize managed disks while the VM keeps running."):
            self.assertFalse({e["id"] for e in ix.match(t, 12)} & LEAN, t)

    def test_fertigungstext_trifft_weiter(self):
        self.assertIn("lean-management", {e["id"] for e in SB.Index().match("How lean manufacturing and lean management change the shop floor.", 12)})


class Dateiformat(unittest.TestCase):
    def test_wie_json_dumps(self):   # ohne Zeilenumbruch am Ende; ein Cherry-Pick aus einer Basis mit Umbruch haengt ihn sonst still an
        raw = (ROOT / "data" / "entities.json").read_text("utf-8")
        self.assertTrue(raw == json.dumps(json.loads(raw), ensure_ascii=False, indent=1), "data/entities.json nicht im Format json.dumps(..., ensure_ascii=False, indent=1) ohne Umbruch am Ende")


if __name__ == "__main__":
    unittest.main()
