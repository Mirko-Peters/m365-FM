"""Zusammengefuehrte Entitaeten in Profilen (D1 behaelt die alte id, z. B. mirko-p expertise azure-ai-foundry): site_members.fetch_members
schreibt Expertise und Zertifikate einmal auf das Ziel (microsoft-foundry) um. Profilseite (knowsAbout, Liste), Expertenliste der Entitaet und
Autorenkasten nennen die Person dann genau einmal; die D1-id bleibt fuer das Bestaetigen (/api/endorse) unter "e0" erhalten.
Ausserdem: die Zuordnung alt -> Ziel wird nur einmal je Bau gelesen (merge_targets liest die ganze entities.json)."""
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_learn as LRN   # noqa: E402
import site_members as MEM   # noqa: E402
import generate_site as GS   # noqa: E402

BASE = "https://www.m365.fm"
MIRKO = {"handle": "mirko-p", "name": "Mirko Peters", "type": "u", "programs": [], "channels": [],
         "expertise": [{"e": "copilot", "level": 3, "verified": True}, {"e": "azure-ai-foundry", "level": 3, "verified": True, "score": 18.5},
                       {"e": "microsoft-foundry", "level": 2}],
         "certs": [{"e": "azure-ai-foundry", "verified": True}]}
ELLIOT = {"handle": "elliot-margot", "name": "Elliot M.", "type": "u", "expertise": [{"e": "microsoft-foundry", "level": 2}]}


def _fetch(people, orgs=()):
    """fetch_members mit festem Export, ohne Netz und ohne data/members_export.json zu ueberschreiben."""
    with tempfile.TemporaryDirectory() as d, mock.patch.object(MEM, "_fetch_export", lambda url: {"people": people, "orgs": list(orgs)}), \
            mock.patch.object(MEM, "CACHE", Path(d) / "m.json"), mock.patch.object(MEM, "_mark", lambda *a: None):
        return MEM.fetch_members("https://api.example")


class Aufloesen(unittest.TestCase):
    def test_alte_id_ist_nicht_mehr_entitaet(self):
        self.assertEqual(LRN.merge_targets().get("azure-ai-foundry"), "microsoft-foundry")
        ids = {e["id"] for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
        self.assertNotIn("azure-ai-foundry", ids)
        self.assertIn("microsoft-foundry", ids)

    def test_resolve_refs_einmal_je_ziel_mit_d1_id(self):
        got = LRN.resolve_refs(MIRKO["expertise"])
        self.assertEqual([x["e"] for x in got], ["copilot", "microsoft-foundry"])
        self.assertTrue(got[1]["verified"]); self.assertEqual(got[1]["level"], 3)   # der bestaetigte Eintrag gewinnt
        self.assertEqual(got[1]["e0"], "azure-ai-foundry")
        self.assertNotIn("e0", got[0])
        self.assertEqual(MIRKO["expertise"][1]["e"], "azure-ai-foundry")   # Eingabe bleibt unveraendert

    def test_fetch_members_loest_auf(self):
        people, orgs = _fetch([MIRKO, ELLIOT], [{"handle": "acme", "name": "Acme", "type": "o", "expertise": [{"e": "azure-ai-foundry", "verified": True}]}])
        m = next(p for p in people if p["handle"] == "mirko-p")
        self.assertEqual([x["e"] for x in m["expertise"]], ["copilot", "microsoft-foundry"])
        self.assertEqual([x["e"] for x in m["certs"]], ["microsoft-foundry"])
        self.assertEqual([x["e"] for x in orgs[0]["expertise"]], ["microsoft-foundry"])

    def test_knowsabout_und_expertenliste(self):
        people, orgs = _fetch([MIRKO, ELLIOT])
        ents = {i: {"id": i, "name": n, "type": "product", "aliases": [], "desc": {}, "rel": []} for i, n in (("copilot", "Microsoft 365 Copilot"), ("microsoft-foundry", "Microsoft Foundry"))}
        with mock.patch.dict(MEM.ENTS, ents):   # andere Tests tauschen ENTS aus: die beiden Ziele hier fest vorgeben
            self._check(people, orgs)

    def _check(self, people, orgs):
        m = next(p for p in people if p["handle"] == "mirko-p")
        ld = MEM.person_ld(BASE, m, {})
        ld = ld[0] if isinstance(ld, list) else ld
        node = next((n for n in ([ld] + list(ld.get("@graph", []))) if n.get("@type") == "Person"), ld)
        ka = [k["@id"] for k in node.get("knowsAbout", [])]
        self.assertEqual(sum(1 for k in ka if "/entity/microsoft-foundry/" in k), 1)
        self.assertFalse(any("azure-ai-foundry" in k for k in ka))
        ix = MEM.experts_index(people, orgs)
        self.assertEqual([a["handle"] for a in ix["microsoft-foundry"]].count("mirko-p"), 1)
        self.assertEqual(ix["microsoft-foundry"][0]["handle"], "mirko-p")   # bestaetigt vor unbestaetigt
        self.assertNotIn("azure-ai-foundry", ix)

    def test_d1_bestand_ohne_alte_id_unveraendert(self):
        p = {"handle": "x", "name": "X", "expertise": [{"e": "copilot", "level": 2}]}
        people, _ = _fetch([p])
        self.assertEqual(people[0]["expertise"], [{"e": "copilot", "level": 2}])


class EinmalLesen(unittest.TestCase):
    def setUp(self):
        self._a = dict(GS.AUTHOR); LRN._merge_map.cache_clear()

    def tearDown(self):
        GS.AUTHOR.clear(); GS.AUTHOR.update(self._a); LRN._merge_map.cache_clear()

    def test_autorenkasten_liest_zuordnung_einmal(self):
        GS.AUTHOR.clear(); GS.AUTHOR.update(MIRKO)
        real = LRN.merge_targets
        with mock.patch.object(LRN, "merge_targets", side_effect=real) as mt:
            for lang in ("en", "de", "en"):
                h = GS.author_box(lang)
                self.assertEqual(h.count('/entity/microsoft-foundry/" itemprop="knowsAbout">'), 1)
        self.assertEqual(mt.call_count, 1)


if __name__ == "__main__":
    unittest.main()
