"""Ontologie (ontology.py): Oberbegriff-Regeln, Hierarchie ohne Zyklen, Pruefung faengt neue Fehler. Laeuft ohne Netz."""
import copy
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import ontology as O   # noqa: E402


def ent(i, name, t="concept", rel=None, **kw):
    return {"id": i, "type": t, "name": name, "aliases": kw.pop("aliases", []), "desc": {"en": "x" * 30, "de": ""}, "web": "", "wikidata": "", "wikipedia": "", "docs": "", "rel": rel or [], **kw}


SET = [
    ent("azure", "Microsoft Azure", "platform", aliases=["Azure"]),
    ent("entra-id", "Microsoft Entra ID", "product"),
    ent("azure-policy", "Azure Policy", "product"),
    ent("admin-consent", "Admin consent (Microsoft Entra ID)"),
    ent("policy-initiative", "Azure Policy initiative"),
    ent("azure-resource-group", "Azure resource group"),
    ent("zero-trust", "Zero Trust"),
    ent("word", "Word", "product"),
    ent("word-count", "Word count"),
    ent("mfa", "Multifactor authentication (MFA)"),
]


class Regeln(unittest.TestCase):
    def setUp(self):
        self.ents = copy.deepcopy(SET)
        self.by = {e["id"]: e for e in self.ents}

    def test_klammer_regel(self):
        added = {a[0]: a for a in O.apply_rules(self.ents)}
        self.assertEqual(added["admin-consent"][1:], ("broader", "entra-id", "klammer"))

    def test_praefix_regel_mit_laengstem_produkt(self):
        added = {a[0]: a for a in O.apply_rules(self.ents)}
        self.assertEqual(added["policy-initiative"][1:3], ("broader", "azure-policy"))   # nicht "azure": das laengere Produkt gewinnt
        self.assertEqual(added["azure-resource-group"][1:3], ("broader", "azure"))        # Ein-Wort-Praefix nur bei Plattformen

    def test_produkt_bekommt_part_of(self):
        self.ents.append(ent("azure-monitor", "Azure Monitor", "product"))
        added = {a[0]: a for a in O.apply_rules(self.ents)}
        self.assertEqual(added["azure-monitor"][1:3], ("part_of", "azure"))

    def test_zu_allgemeine_namen_sind_keine_oberbegriffe(self):
        added = {a[0] for a in O.apply_rules(self.ents)}
        self.assertNotIn("word-count", added)   # "Word" ist mehrdeutig
        self.assertNotIn("zero-trust", added)
        self.assertNotIn("mfa", added)          # Klammer "MFA" ist keine Produktangabe

    def test_vorhandene_eltern_bleiben(self):
        self.by["admin-consent"]["rel"] = [["part_of", "azure"]]
        added = {a[0] for a in O.apply_rules(self.ents)}
        self.assertNotIn("admin-consent", added)

    def test_idempotent(self):
        O.apply_rules(self.ents)
        self.assertEqual(O.apply_rules(self.ents), [])

    def test_derive_im_speicher_fuer_dict(self):
        n = O.derive(self.by)
        self.assertGreaterEqual(n, 3)
        self.assertIn(["broader", "entra-id"], self.by["admin-consent"]["rel"])

    def test_kein_zyklus_durch_regel(self):
        self.by["azure"]["rel"] = [["part_of", "azure-policy"]]   # Azure hinge schon unter Azure Policy
        added = {a[0] for a in O.apply_rules(self.ents)}
        self.assertNotIn("azure-policy", added)
        self.assertEqual(O.find_cycles({e["id"]: e for e in self.ents}), [])


class Pruefung(unittest.TestCase):
    def test_zyklus_und_tote_verweise_sind_harte_fehler(self):
        ents = [ent("a", "A", rel=[["broader", "b"]]), ent("b", "B", rel=[["broader", "a"], ["related_to", "weg"]])]
        m = O.audit(ents)
        self.assertEqual(m["cycles"], ["a", "b"])
        self.assertEqual(m["dangling"], [["b", "related_to", "weg"]])
        self.assertEqual(len(O.problems(m)), 2)

    def test_neue_dublette_faellt_auf_bekannte_nicht(self):
        ents = [ent("oee", "OEE"), ent("overall-oee", "OEE"), ent("x", "X")]
        m = O.audit(ents)
        self.assertEqual(m["duplicate_names"], [["oee", "overall-oee"]])
        self.assertTrue(O.problems(m))
        self.assertEqual(O.problems(m, {"duplicate_names": [["oee", "overall-oee"]]}), [])

    def test_hauptelternteil_und_brotkrumen(self):
        by = {e["id"]: e for e in [ent("cat", "Tool", "category"), ent("microsoft-tool", "Microsoft tool", "category"),
                                   ent("plat", "Plat", "platform", rel=[["instance_of", "cat"]]),
                                   ent("prod", "Prod", "product", rel=[["instance_of", "microsoft-tool"], ["instance_of", "cat"], ["part_of", "plat"]])]}
        self.assertEqual(O.primary_parent(by["prod"], by), "plat")
        self.assertEqual(O.ancestors("prod", by), ["plat", "cat"])
        by["prod"]["rel"] = [["instance_of", "microsoft-tool"], ["instance_of", "cat"]]
        self.assertEqual(O.primary_parent(by["prod"], by), "cat")   # die Sammelkategorie microsoft-tool ist nie Hauptelternteil

    def test_wirkliche_daten_ohne_harte_fehler(self):
        ents = json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))
        base_p = ROOT / "data" / "ontology_baseline.json"
        base = json.loads(base_p.read_text("utf-8")) if base_p.exists() else {}
        m = O.audit(ents)
        self.assertEqual(O.problems(m, base), [], "data/entities.json: Zyklus, Verweis ins Leere oder neue Dublette/Alias-Kollision - siehe reports/ontology.md (python tools/ontology_check.py)")

    def test_regeln_sind_in_den_repo_daten_schon_angewendet(self):
        """tools/ontology_check.py --apply laeuft im Import; hier bleibt hoechstens eine Handvoll sicherer Regeltreffer offen."""
        ents = json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))
        open_ = O.apply_rules(ents)
        self.assertLess(len(open_), 25, f"{len(open_)} Regeltreffer noch nicht eingetragen: python tools/ontology_check.py --apply")


if __name__ == "__main__":
    unittest.main()
