"""Cognillo (Sponsor): Firma, zwei Produkte und acht Themen als Entitaeten, Transparenzhinweis, Sponsoring-Eintrag, Lead-Formular."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_learn as SL   # noqa: E402
import site_entities as E   # noqa: E402
import site_sponsorships as SPM   # noqa: E402
import site_ads as ADS   # noqa: E402

BASE = "https://www.m365.fm"
RAW = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
FIRMA, PRODUKTE = "cognillo", ["sharepoint-essentials-toolkit", "genta-automation"]
THEMEN = ["sharepoint-permissions", "sharepoint-migration", "sharepoint-broken-links", "user-offboarding", "sharepoint-governance", "sharepoint-site-owner",
          "sharepoint-site-lifecycle", "sharepoint-reporting"]
IDS = [FIRMA, *PRODUKTE, *THEMEN]


class Daten(unittest.TestCase):
    def test_elf_entitaeten_vollstaendig(self):
        self.assertEqual(len(IDS), 11)
        for i in IDS:
            e = RAW[i]
            for lang in ("en", "de"):
                self.assertTrue(20 <= len(e["desc"][lang]) <= 300, (i, lang))   # Formular-Grenze 300 Zeichen
                self.assertNotIn("http", e["desc"][lang])
                self.assertTrue(500 <= len(e["long"][lang]) <= 3000, (i, lang))   # Worker kuerzt Langtexte auf 3000
                self.assertIn("https://", e["long"][lang], f"{i}: Quellen fehlen")   # jede Entitaet nennt ihre Quellen
            for p, to in e["rel"]:
                self.assertIn(p, E.FWD, (i, p))
                self.assertIn(to, RAW, (i, to))
            self.assertFalse(e.get("logo") or e.get("logo_src") or e.get("image"), "keine Fremdbilder ohne Erlaubnis von Cognillo")
        self.assertEqual([RAW[i]["type"] for i in IDS], ["org", "product", "product"] + ["concept"] * 8)

    def test_themen_mit_microsoft_learn_beleg(self):
        for i in THEMEN:
            self.assertTrue(RAW[i]["docs"].startswith("https://learn.microsoft.com/"), i)
            for lang in ("en", "de"):
                self.assertIn("learn.microsoft.com", RAW[i]["long"][lang], i)

    def test_produkte_haengen_an_der_firma(self):
        for i in PRODUKTE:
            self.assertIn(["developed_by", FIRMA], RAW[i]["rel"])
            self.assertTrue(RAW[i]["web"].startswith("https://www.cognillo.com/"))
        self.assertEqual(RAW[FIRMA]["web"], "https://www.cognillo.com")
        self.assertEqual((RAW[FIRMA]["city"], RAW[FIRMA]["country"]), ("Jersey City", "United States"))

    def test_keine_module_und_keine_person(self):
        for i in ("permissions-management", "copy-migration", "broken-link-manager", "analytics-and-site-auditing", "governance-user-activity", "chris-ang", "genta"):
            self.assertNotIn(i, RAW)
        self.assertFalse([e for e in RAW.values() if e.get("company") == "Cognillo" or "Chris Ang" in e.get("name", "")])
        txt = json.dumps([RAW[i] for i in IDS], ensure_ascii=False)
        self.assertNotIn("Chris Ang", txt)
        self.assertNotIn("@", txt.replace("@type", ""))   # keine E-Mail-Adressen
        self.assertNotIn("855", txt)   # keine Telefonnummer

    def test_ids_nur_einmal(self):
        ids = [e["id"] for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))]
        self.assertEqual(len(ids), len(set(ids)))


class Transparenz(unittest.TestCase):
    def test_hinweis_firma_und_vererbung_auf_produkte(self):
        self.assertIn("Cognillo sponsert M365.FM", E.disclosure_of(E.ENTS[FIRMA], "de"))
        self.assertIn("Cognillo sponsors M365.FM", E.disclosure_of(E.ENTS[FIRMA], "en"))
        for i in PRODUKTE:
            self.assertIn("Transparenzhinweis", E.disclosure_of(E.ENTS[i], "de"))
            self.assertIn("Disclosure", E.disclosure_of(E.ENTS[i], "fr"))   # Rueckfall auf Englisch


class Sponsoring(unittest.TestCase):
    def setUp(self):
        d = json.loads((ROOT / "data" / "sponsorships.json").read_text("utf-8"))
        self.recs, self.errs = SPM.check_structure(d)
        self.rec = next(r for r in self.recs if r["id"] == "cognillo-2026-11")

    def test_eintrag(self):
        self.assertEqual(self.errs, [])
        r = self.rec
        self.assertEqual((r["start"], r["end"], r["label"]), ("2026-11-10", "2027-01-16", "sponsored"))   # Mirko 11.11.2026: Laufzeit bis 16.01.2027
        self.assertEqual(r["sponsor"], {"name": "Cognillo", "url": "https://www.cognillo.com/"})
        self.assertEqual(r["entities"], [FIRMA, *PRODUKTE])
        self.assertEqual(r["topics"], ["sharepoint-permissions", "oversharing"])
        self.assertEqual(r["manager"], {"handle": "mirko-p", "entity": "mirko-peters"})
        self.assertNotIn("$", json.dumps(r))   # oeffentliches Repo: keine Preise
        self.assertEqual(self.recs[0]["id"], "ifakt-eigenes-unternehmen", "iFAKT bleibt unveraendert")

    def test_verweise_gueltig(self):
        self.assertEqual(SPM.check_refs(self.recs, RAW)[0], [])
        self.assertEqual(SPM.check_refs(self.recs, RAW)[1], [])
        self.assertIn("mirko-peters", RAW)

    def test_laufzeit_und_extras(self):
        self.assertFalse(SPM._active(self.rec, "2026-11-09"))
        for d in ("2026-11-10", "2027-01-15", "2027-01-16", "2027-07-17"): self.assertTrue(SPM._active(self.rec, d), d)   # Laufzeit + 182 Tage Karenzzeit
        self.assertFalse(SPM._active(self.rec, "2027-07-18"))
        self.assertEqual(SPM.status(self.rec, "2027-01-17"), "Karenzzeit bis 17.07.2027")
        self.assertEqual(SPM.sponsor_extra_entities(FIRMA, "2026-11-10", RAW, self.recs), [FIRMA, *PRODUKTE])
        self.assertTrue(SPM.sponsor_extra_entities(FIRMA, "2027-07-17", RAW, self.recs))   # Nachfrist 182 Tage nach "end"
        self.assertEqual(SPM.sponsor_extra_entities(FIRMA, "2027-07-18", RAW, self.recs), [])
        self.assertEqual([o["id"] for o in SPM.active_sponsor_orgs("2026-11-10", RAW, self.recs)], ["ifakt", FIRMA])
        self.assertEqual([o["id"] for o in SPM.active_sponsor_orgs("2027-07-17", RAW, self.recs)], ["ifakt", FIRMA])   # Lead-Formular bleibt in der Karenzzeit
        self.assertEqual([o["id"] for o in SPM.active_sponsor_orgs("2027-07-18", RAW, self.recs)], ["ifakt"])

    def test_lead_formular(self):
        h = ADS.sponsor_lead(BASE, "de", FIRMA, "Cognillo")
        self.assertIn('data-sponsor-lead="cognillo"', h)
        self.assertEqual(SPM.sponsors_json("2026-11-10", RAW, self.recs)["orgs"][-1], {"id": FIRMA, "name": "Cognillo", "manager": "mirko-p"})


if __name__ == "__main__":
    unittest.main()
