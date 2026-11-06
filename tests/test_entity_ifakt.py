"""iFAKT-Entitaet (Firma, Polaris, Module) und oeffentliche Stadt bei Profilen: Daten, Schema.org-Knoten, Transparenzhinweis, Folgen-Verknuepfung."""
import json
import sys
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_learn as SL   # noqa: E402
import site_entities as E   # noqa: E402
import site_extract as SX   # noqa: E402

BASE = "https://www.m365.fm"
RAW = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
IFAKT_IDS = ["ifakt", "polaris", "polaris-vsm", "polaris-bsm", "polaris-designer", "polaris-simulator", "polaris-optimizer", "polaris-operator", "polaris-analyzer", "industry-4-0", "swimlane-diagram"]


class Daten(unittest.TestCase):
    def test_neue_entitaeten_vollstaendig(self):
        for i in IFAKT_IDS:
            e = RAW[i]
            for lang in ("en", "de"):   # Kurzbeschreibung ist Pflicht (Hover-Text), Formular-Grenze 300 Zeichen
                self.assertTrue(20 <= len(e["desc"][lang]) <= 300, (i, lang))
                self.assertNotIn("http", e["desc"][lang])
            for p, to in e["rel"]:
                self.assertIn(p, E.FWD, (i, p))
                self.assertIn(to, RAW, (i, to))
            self.assertFalse(e.get("logo"), "Logo nur ueber R2 (logo_src + r2-images.yml), kein Hotlink")
        for i in IFAKT_IDS[2:9]:
            self.assertIn(["part_of", "polaris"], RAW[i]["rel"])
            self.assertIn(["developed_by", "ifakt"], RAW[i]["rel"])
        for lang in ("en", "de"):
            self.assertLessEqual(len(RAW["ifakt"]["long"][lang]), 3000)
            self.assertIn("Mirko Peters", RAW["ifakt"]["disclosure"][lang])

    def test_mirko_stadt(self):
        m = RAW["mirko-peters"]
        self.assertEqual((m["city"], m["country"], m["company"]), ("Stuttgart", "Germany", "iFAKT GmbH"))


class Schema(unittest.TestCase):
    def test_firma_mit_adresse_gruendung_produkten_und_personen(self):
        n = E.ent_ld(BASE, E.ENTS["ifakt"], "en", set(), {})
        self.assertEqual(n["address"], {"@type": "PostalAddress", "streetAddress": "Curiestr. 2", "postalCode": "70563", "addressLocality": "Stuttgart", "addressCountry": "Germany"})
        self.assertEqual(n["foundingDate"], "2001")
        self.assertIn({"@id": f"{BASE}/entity/polaris/#entity"}, n["brand"])
        self.assertEqual(n["employee"], [{"@id": f"{BASE}/entity/jorg-drees/#entity"}, {"@id": f"{BASE}/entity/mirko-peters/#entity"}, {"@id": f"{BASE}/entity/philip-schubert/#entity"}])

    def test_person_stadt_ohne_strasse_und_arbeitgeber_zusaetzlich(self):
        p = dict(E.ENTS["mirko-peters"], street="Geheim 1", zip="70000")
        with mock.patch.object(E, "PERSON_LD", lambda: {"@type": "Person", "worksFor": {"@id": f"{BASE}/#org"}}):
            n = E.ent_ld(BASE, p, "de", set(), {})
        self.assertEqual(n["address"], {"@type": "PostalAddress", "addressLocality": "Stuttgart", "addressCountry": "Germany"})
        self.assertEqual(n["worksFor"], [{"@id": f"{BASE}/#org"}, {"@id": f"{BASE}/entity/ifakt/#entity"}])
        self.assertEqual(E.location_text(p), "Stuttgart, Germany")

    def test_transparenzhinweis_gilt_fuer_produkte_und_module(self):
        self.assertIn("Transparenzhinweis", E.disclosure_of(E.ENTS["polaris-vsm"], "de"))
        self.assertIn("Disclosure", E.disclosure_of(E.ENTS["polaris"], "fr"))
        self.assertEqual(E.disclosure_of(E.ENTS["digital-twin"], "en"), "")


class Overlay(unittest.TestCase):
    def test_d1_fassung_ohne_stadt_behaelt_repo_felder(self):
        item = {"id": "mirko-peters", "data": {"name": "Mirko Peters", "type": "person", "desc": {"en": "x" * 30, "de": ""}}, "created": 1}
        with mock.patch.object(SL, "_fetch_json", return_value={"items": [item]}):
            ents = SL.load_entities("https://api.example.test")
        self.assertEqual(ents["mirko-peters"]["city"], "Stuttgart")
        self.assertEqual(ents["mirko-peters"]["company"], "iFAKT GmbH")
        self.assertEqual(ents["mirko-peters"]["desc"]["en"], "x" * 30, "Rest kommt weiter aus D1")


class Folgen(unittest.TestCase):
    def test_extraktionen_verweisen_auf_ifakt(self):
        sids = [f.stem for f in (ROOT / "shownotes" / "entities").glob("*.json") if any(x["slug"] == "ifakt" for x in json.loads(f.read_text("utf-8"))["entities"])]
        self.assertEqual(len(sids), 7)
        ok = SX.qa_ok()
        self.assertEqual(sorted(s for s, _ in SX.BY_ENTITY.get("ifakt", [])), sorted(s for s in sids if s in ok), "nur QA-gepruefte Folgen wirken auf die Seite")


class Logos(unittest.TestCase):
    def test_logo_src_geht_in_den_r2_lauf(self):
        sys.path.insert(0, str(ROOT / "tools"))
        import r2_upload as R
        fake = [{"id": "x", "logo_src": "https://example.com/logo.svg"}, {"id": "y", "logo_src": "http://insecure.example/logo.png"}]
        with mock.patch.object(Path, "read_text", return_value=json.dumps(fake)), mock.patch.object(Path, "exists", return_value=True):
            self.assertEqual(R.entity_logos(), {"https://example.com/logo.svg"})


class Profil(unittest.TestCase):
    def test_oeffentliche_stadt_im_personen_schema(self):
        import site_members as M
        n = M.person_ld(BASE, {"handle": "ada", "name": "Ada", "country": "Germany", "contact": {"city": "Stuttgart"}}, {})
        self.assertEqual(n["address"], {"@type": "PostalAddress", "addressLocality": "Stuttgart", "addressCountry": "Germany"})
        n = M.person_ld(BASE, {"handle": "bea", "name": "Bea", "country": "Germany"}, {})
        self.assertEqual(n["address"], {"@type": "PostalAddress", "addressCountry": "Germany"}, "ohne Freigabe keine Stadt")


if __name__ == "__main__":
    unittest.main()
