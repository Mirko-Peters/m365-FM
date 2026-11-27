import json
import tempfile
import unittest
from pathlib import Path

import site_learn as LRN


class StripRemovedAliases(unittest.TestCase):
    """Fehl-Aliase, die im Repo entfernt wurden, duerfen ueber die D1-Fassung nicht zurueckkommen (CI #539: gdpr 'Datenschutz')."""

    def test_d1_alias_wird_entfernt(self):
        base = {"gdpr": {"id": "gdpr", "aliases": ["DSGVO", "Datenschutz"]},
                "exchange-online": {"id": "exchange-online", "aliases": ["EXO", "outlook"]},
                "andere": {"id": "andere", "aliases": ["Datenschutz"]}}
        with tempfile.TemporaryDirectory() as d:
            f = Path(d) / "a.json"
            f.write_text(json.dumps({"_info": "x", "gdpr": ["Datenschutz"], "exchange-online": ["Outlook"]}), "utf-8")
            n = LRN.strip_removed_aliases(base, f)
        self.assertEqual(n, 2)
        self.assertEqual(base["gdpr"]["aliases"], ["DSGVO"])
        self.assertEqual(base["exchange-online"]["aliases"], ["EXO"])   # ohne Gross-/Kleinschreibung
        self.assertEqual(base["andere"]["aliases"], ["Datenschutz"])    # nur die genannte Entitaet

    def test_geladene_entitaeten_ohne_fehl_aliase(self):
        rm = json.loads((Path(LRN.__file__).parent / "data" / "alias_removed.json").read_text("utf-8"))
        for i, bad in rm.items():
            if i.startswith("_") or i not in LRN.ENTS:
                continue
            have = {a.lower() for a in LRN.ENTS[i].get("aliases") or []}
            for a in bad:
                self.assertNotIn(a.lower(), have, (i, a))


if __name__ == "__main__":
    unittest.main()
