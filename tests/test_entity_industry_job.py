"""Branche (industry) und Job/Rolle (job) als Entitaeten: Seed-Daten, Schema.org-Knoten (DefinedTerm/Occupation), Firmen-Branchen, Mitglieder- und Firmenlisten auf den Entitaetsseiten."""
import json
import sys
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_entities as E   # noqa: E402
import site_members as M   # noqa: E402

BASE = "https://www.m365.fm"
RAW = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
INDUSTRIES = ["aerospace", "manufacturing", "automotive", "mechanical-engineering", "it-services", "consulting", "public-sector", "healthcare", "financial-services", "retail", "education", "energy", "logistics"]
JOBS = ["microsoft-365-administrator", "sharepoint-architect", "power-platform-developer", "copilot-ai-consultant", "it-manager", "cio", "marketing-manager", "managing-director", "solution-architect", "security-engineer", "teams-administrator", "data-analyst"]


class Daten(unittest.TestCase):
    def test_startmenge_vollstaendig(self):
        for i, t in [(i, "industry") for i in INDUSTRIES] + [(i, "job") for i in JOBS]:
            e = RAW[i]
            self.assertEqual(e["type"], t, i)
            for lang in ("en", "de"):
                self.assertTrue(20 <= len(e["desc"][lang]) <= 300, (i, lang))
                self.assertNotIn("http", e["desc"][lang])
            self.assertEqual(e["web"], "", "keine bezahlten Links")
            self.assertIn(t, E.TL)

    def test_ifakt_und_industrie_4_0(self):
        self.assertEqual(RAW["ifakt"]["industries"], ["aerospace", "manufacturing", "mechanical-engineering"], "Luftfahrt zuerst")
        self.assertIn(["related_to", "manufacturing"], RAW["industry-4-0"]["rel"])
        for i in RAW["ifakt"]["industries"]:
            self.assertEqual(RAW[i]["type"], "industry")

    def test_keine_doppelten_normalisierten_namen_je_typ(self):
        import re
        seen = {}
        for e in RAW.values():
            if e["type"] in ("industry", "job"):
                for n in [e["name"]] + e["aliases"]:
                    k = (e["type"], re.sub(r"[^a-z0-9]", "", n.lower()))
                    self.assertIn(seen.setdefault(k, e["id"]), (e["id"],), n)


FAKE = {
    "manufacturing": {"id": "manufacturing", "type": "industry", "name": "Manufacturing", "aliases": [], "desc": {"en": "Making goods.", "de": "Güter herstellen."}, "rel": []},
    "aerospace": {"id": "aerospace", "type": "industry", "name": "Aerospace", "aliases": [], "desc": {"en": "Aircraft.", "de": "Flugzeuge."}, "rel": []},
    "marketing-manager": {"id": "marketing-manager", "type": "job", "name": "Marketing manager", "aliases": [], "desc": {"en": "Plans marketing.", "de": "Plant Marketing."}, "rel": []},
    "acme": {"id": "acme", "type": "org", "name": "Acme GmbH", "aliases": [], "desc": {"en": "Acme.", "de": "Acme."}, "rel": [], "industries": ["aerospace", "manufacturing", "not-an-industry"]},
    "some-product": {"id": "some-product", "type": "product", "name": "Widget", "aliases": [], "desc": {"en": "x", "de": "x"}, "rel": []},
}
PEOPLE = [{"handle": "mirko", "name": "Mirko", "job": "Marketing Manager", "job_eid": "marketing-manager", "industries": ["manufacturing"]},
          {"handle": "ada", "name": "Ada", "job": "", "industries": ["manufacturing", "some-product"]}]
ORGS = [{"handle": "acme-community", "name": "Acme GmbH", "eid": "acme", "eid_ok": True, "industries": ["manufacturing"]},
        {"handle": "solo", "name": "Solo Co", "eid": "", "eid_ok": False, "industries": ["manufacturing"]}]


class Seiten(unittest.TestCase):
    def setUp(self):
        self.p = [mock.patch.dict(E.ENTS, FAKE, clear=True), mock.patch.dict(E.KIND_MEMBERS, {}, clear=True), mock.patch.dict(E.KIND_ORGS, {}, clear=True),
                  mock.patch.dict(M.ENTS, FAKE, clear=True)]
        for x in self.p:
            x.start()
        E.set_kinds(ORGS, PEOPLE)

    def tearDown(self):
        for x in self.p:
            x.stop()

    def node(self, i):
        return E.ent_ld(BASE, FAKE[i], "en", set(), {})

    def test_json_ld_industry_ist_definedterm_im_set_industries(self):
        n = self.node("manufacturing")
        self.assertEqual(n["@type"], "DefinedTerm")
        self.assertEqual(n["inDefinedTermSet"], {"@type": "DefinedTermSet", "@id": f"{BASE}/entity/#industries", "name": "Industries"})
        self.assertEqual(n["termCode"], "manufacturing")
        self.assertEqual(n["@id"], f"{BASE}/entity/manufacturing/#entity")

    def test_json_ld_job_ist_occupation(self):
        n = self.node("marketing-manager")
        self.assertEqual(n["@type"], "Occupation")
        self.assertEqual(n["name"], "Marketing manager")
        self.assertNotIn("inDefinedTermSet", n)

    def test_json_ld_firma_verweist_auf_branchen_in_reihenfolge(self):
        n = self.node("acme")
        self.assertEqual(n["@type"], "Organization")
        self.assertEqual(n["knowsAbout"], [{"@id": f"{BASE}/entity/aerospace/#entity"}, {"@id": f"{BASE}/entity/manufacturing/#entity"}], "unbekannte/falsche Typen entfallen")

    def test_kind_html_industry_firmen_und_mitglieder_ohne_dubletten(self):
        h = E.kind_html(BASE, "en", FAKE["manufacturing"], f"{BASE}/entity/")
        self.assertIn(f'href="{BASE}/entity/acme/"', h)
        self.assertEqual(h.count("Acme GmbH"), 1, "bestaetigt verknuepfte Community-Firma erscheint nicht zusaetzlich")
        self.assertIn(f'href="{BASE}/community/c/solo/"', h)
        self.assertIn(f'href="{BASE}/community/u/mirko/"', h)
        self.assertIn(f'href="{BASE}/community/u/ada/"', h)
        self.assertNotIn("some-product", E.KIND_MEMBERS)
        de = E.kind_html(BASE, "de", FAKE["manufacturing"], f"{BASE}/de/entity/")
        self.assertIn("<h3>Firmen</h3>", de); self.assertIn("<h3>Mitglieder</h3>", de)

    def test_kind_html_job_nur_mitglieder_und_leer_ohne_treffer(self):
        h = E.kind_html(BASE, "en", FAKE["marketing-manager"], f"{BASE}/entity/")
        self.assertIn("community/u/mirko/", h); self.assertNotIn("Companies", h)
        self.assertIn("entity/acme/", E.kind_html(BASE, "en", FAKE["aerospace"], f"{BASE}/entity/"), "Firmen-Entitaet mit Branche aerospace")
        FAKE_R = {"id": "retail", "type": "industry", "name": "Retail", "aliases": [], "desc": {"en": "x", "de": "x"}, "rel": []}
        with mock.patch.dict(E.ENTS, {"retail": FAKE_R}):
            self.assertEqual(E.kind_html(BASE, "en", FAKE_R, f"{BASE}/entity/"), "", "ohne Verknuepfung kein Abschnitt")

    def test_typnamen_in_allen_sprachen(self):
        self.assertEqual((E.tlab("en", "industry"), E.tlab("de", "industry")), ("Industry", "Branche"))
        self.assertEqual(E.tlab("de", "job"), "Job / Rolle")
        for lg in E.COMM_LANGS:
            self.assertTrue(E.tlab(lg, "industry") and E.tlab(lg, "job"))
        self.assertEqual(E.tlab("fr", "industry"), "Secteur")

    def test_profil_json_ld_hasoccupation_und_knowsabout(self):
        p = {"handle": "mirko", "name": "Mirko", "job": "Marketing Manager", "job_eid": "marketing-manager", "industries": ["manufacturing", "marketing-manager"], "expertise": []}
        n = M.person_ld(BASE, p, {})
        self.assertEqual(n["hasOccupation"], {"@id": f"{BASE}/entity/marketing-manager/#entity"})
        self.assertEqual(n["jobTitle"], "Marketing Manager")
        self.assertEqual(n["knowsAbout"], [{"@id": f"{BASE}/entity/manufacturing/#entity"}], "nur Entitaeten vom Typ industry")
        o = M.org_ld(BASE, {"handle": "x", "name": "X", "industries": ["aerospace"], "expertise": []}, {})
        self.assertEqual(o["knowsAbout"], [{"@id": f"{BASE}/entity/aerospace/#entity"}])


class Erwaehnungen(unittest.TestCase):
    import site_mentions as MEN
    M = [{"title": "VSM fuer Tablet", "publisher": "PRESSEBOX", "date": "2020-05-01", "url": "https://example.org/a", "kind": "press_release"},
         {"title": "Digitale Wertstromanalyse", "outlet": "Fachmagazin", "date": "2022-06-01", "url": "https://example.org/b"}]

    def test_abschnitt_zeilen_label_und_rel(self):
        h = self.MEN.section_html("de", "polaris-vsm", self.M)
        self.assertIn("<h3 id=\"mentions\">Erwähnungen</h3>", h)
        self.assertIn('<a href="https://example.org/a" rel="noopener">VSM fuer Tablet</a> <span class="mut">· PRESSEBOX · 2020</span> <small class="mut en-pr">[Pressemitteilung]</small>', h)
        self.assertEqual(h.count("[Pressemitteilung]"), 1)
        self.assertNotIn("nofollow", h)
        self.assertIn("In the press / mentions", self.MEN.section_html("en", "ifakt", self.M))
        self.assertIn("Press release", self.MEN.section_html("en", "ifakt", self.M))
        self.assertIn("Communiqué de presse", self.MEN.section_html("fr", "ifakt", self.M))

    def test_ohne_erwaehnung_oder_fremde_entitaet_kein_abschnitt(self):
        self.assertEqual(self.MEN.section_html("en", "polaris-bsm", []), "")
        self.assertEqual(self.MEN.section_html("en", "microsoft", self.M), "")
        self.assertEqual(self.MEN.section_html("en", "polaris-analyzer"), "", "keine geprueften Eintraege in data/press_mentions.json")


if __name__ == "__main__":
    unittest.main()
