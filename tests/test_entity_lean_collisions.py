"""Lean-Begriffe aus #371 duerfen M365-Woerter nicht kapern: 'TPM' bleibt Trusted Platform Module, 'JIT'/'just-in-time' in PIM- und
Azure-Texten ergeben keinen Lean-Chip und keinen Glossar-Link auf die Fertigung (Befunde ENT-1/ENT-2)."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_learn as SL   # noqa: E402
import site_sidebar as SB   # noqa: E402

RAW = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
LEAN = {i for i, e in RAW.items() if e["type"] == "concept" and ["related_to", "ifakt"] in (e.get("rel") or [])}
BASE = "https://www.m365.fm"
AZURE = "Azure Solutions Break Under Pressure: availability zones, paired regions, health probes and a load balancer keep the SLA. Microsoft Defender for Cloud adds JUST-IN-TIME SERVER ACCESS and JIT VM access for management ports."
PIM = "Entra ID Security: Privileged Identity Management with just-in-time activation, JIT admin elevation, approval workflows and access reviews."


class Kollisionen(unittest.TestCase):
    def test_lean_menge_vorhanden(self):
        self.assertTrue({"total-productive-maintenance", "just-in-time", "cycle-time", "batch-size"} <= LEAN)

    def test_seitenleiste_ohne_lean(self):
        ix = SB.Index()
        for t in (AZURE, PIM):
            self.assertFalse({e["id"] for e in ix.match(t, 12)} & LEAN, t)

    def test_tpm_bleibt_trusted_platform_module(self):
        h = SL.gloss_link("<p>Windows 365 provides the workspace, with TPM, secure boot, BitLocker and no local admin.</p>", "en", BASE)
        self.assertIn(f'href="{BASE}/entity/trusted-platform-module/"', h)
        self.assertNotIn("total-productive-maintenance", h)

    def test_jit_ohne_fertigungslink(self):
        for t in (AZURE, PIM):
            self.assertNotIn("/entity/just-in-time/", SL.gloss_link(f"<p>{t}</p>", "en", BASE), t)

    def test_namen_ohne_kurzform(self):
        for i, k in (("total-productive-maintenance", "TPM"), ("just-in-time", "JIT")):
            self.assertNotIn(f"({k})", RAW[i]["name"])
            self.assertNotIn(k, RAW[i]["aliases"])
        self.assertNotIn("Just-in-time", RAW["just-in-time"]["aliases"])
        self.assertNotIn("Drum-buffer-rope", RAW["buffer-management"]["aliases"])
        self.assertIn("Pufferbestand", RAW["safety-stock"]["aliases"])


if __name__ == "__main__":
    unittest.main()
