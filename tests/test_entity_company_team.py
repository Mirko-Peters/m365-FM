"""Mitarbeitende einer Community-Firma (/community/c/<handle>/, D1) auf der verknuepften Firmen-Entitaet (/entity/<eid>/): Personen-Liste, Dedup, JSON-LD."""
import sys
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_entities as E   # noqa: E402

BASE = "https://www.m365.fm"
FAKE = {
    "acme": {"id": "acme", "type": "org", "name": "Acme GmbH", "aliases": ["Acme"], "desc": {"en": "Acme is a test company.", "de": "Acme ist eine Testfirma."}, "rel": []},
    "other-co": {"id": "other-co", "type": "org", "name": "Other Co", "desc": {"en": "x", "de": "x"}, "rel": []},
    "jane-entity": {"id": "jane-entity", "type": "person", "name": "Jane Doe", "company": "Acme", "desc": {"en": "x", "de": "x"}, "rel": []},
    "max-claimed": {"id": "max-claimed", "type": "person", "name": "Max Mustermann", "desc": {"en": "x", "de": "x"}, "rel": []},
    "some-product": {"id": "some-product", "type": "product", "name": "Widget", "desc": {"en": "x", "de": "x"}, "rel": []},
}
PEOPLE = [
    {"handle": "jane", "name": "jane  doe", "job": "Geschäftsführerin"},   # gleicher Name wie die Entitaet jane-entity -> einmal, Entitaet bevorzugt
    {"handle": "max", "name": "Max M.", "job": "Entwickler"},   # Claim auf max-claimed -> Entitaetslink
    {"handle": "lisa", "name": "Lisa <Test>", "job": ""},   # nur Community-Profil
    {"handle": "tom", "name": "Tom Hidden", "job": "CFO"},   # oeffentliches Profil, zeigt die Firma aber nicht (fehlt in members)
]
ORGS = [
    {"handle": "acme-community", "name": "Acme GmbH", "eid": "acme", "eid_ok": True,
     "members": [{"handle": "jane", "name": "Jane Doe", "role": "owner"}, {"handle": "max", "name": "Max M.", "role": "member"},
                 {"handle": "lisa", "name": "Lisa", "role": "member"}, {"handle": "ghost", "name": "Privat", "role": "member"}]},   # ghost: kein oeffentliches Profil
    {"handle": "other-community", "name": "Other", "eid": "other-co", "eid_ok": False, "members": [{"handle": "lisa", "name": "Lisa"}]},   # unbestaetigt -> wirkt nicht
    {"handle": "prod", "name": "Prod", "eid": "some-product", "eid_ok": True, "members": [{"handle": "lisa", "name": "Lisa"}]},   # keine Firmen-Entitaet
]


class Team(unittest.TestCase):
    def setUp(self):
        self.p = [mock.patch.dict(E.ENTS, FAKE, clear=True), mock.patch.dict(E.TEAMS, {}, clear=True), mock.patch.dict(E.TEAM_ORG, {}, clear=True)]
        for x in self.p:
            x.start()
        E.set_teams(ORGS, PEOPLE, {"max": "max-claimed", "lisa": "some-product"})

    def tearDown(self):
        for x in self.p:
            x.stop()

    def test_nur_bestaetigte_firmen_entitaeten_und_oeffentliche_mitglieder(self):
        self.assertEqual(set(E.TEAMS), {"acme"})
        self.assertEqual(E.TEAM_ORG, {"acme": "acme-community"})
        self.assertEqual([m["handle"] for m in E.TEAMS["acme"]], ["jane", "max", "lisa"], "ghost (nicht oeffentlich) und tom (Firma verborgen) fehlen")
        lisa = next(m for m in E.TEAMS["acme"] if m["handle"] == "lisa")
        self.assertEqual(lisa["eid"], "", "Claim auf eine Nicht-Person zaehlt nicht als Personen-Entitaet")

    def test_dedup_entitaet_bevorzugt(self):
        rows = E.team_of("acme")
        self.assertEqual(rows, [
            {"eid": "jane-entity", "handle": "jane", "name": "Jane Doe", "job": "Geschäftsführerin"},
            {"eid": "", "handle": "lisa", "name": "Lisa <Test>", "job": ""},
            {"eid": "max-claimed", "handle": "max", "name": "Max Mustermann", "job": "Entwickler"},
        ])
        self.assertEqual(E.team_of("other-co"), [])

    def test_json_ld_employee(self):
        n = E.ent_ld(BASE, E.ENTS["acme"], "en", set(), {})
        self.assertEqual(n["employee"], [{"@id": f"{BASE}/entity/jane-entity/#entity"}, {"@id": f"{BASE}/community/u/lisa/#person"}, {"@id": f"{BASE}/entity/max-claimed/#entity"}])
        import site_members as M
        self.assertEqual(n["employee"][1]["@id"], f"{M.purl(BASE, 'en', 'u', 'lisa')}#person", "gleiche @id wie der Personen-Knoten der Profilseite")
        self.assertNotIn("employee", E.ent_ld(BASE, E.ENTS["other-co"], "en", set(), {}))

    def test_bestehende_employee_refs_bleiben_ohne_community(self):
        E.set_teams([], [], {})
        n = E.ent_ld(BASE, E.ENTS["acme"], "en", set(), {})
        self.assertEqual(n["employee"], [{"@id": f"{BASE}/entity/jane-entity/#entity"}])

    def test_html_personen(self):
        root = f"{BASE}/de/entity/"
        h = E.team_html(BASE, "de", "acme", root, "https://api.example.test")
        self.assertIn("<h3>Personen</h3>", h)
        self.assertIn(f'<a href="{root}jane-entity/">Jane Doe</a> <span class="mut">· Person · Geschäftsführerin</span> · <a href="{BASE}/de/community/u/jane/">Profil</a>', h)
        self.assertIn(f'<a href="{BASE}/de/community/u/lisa/">Lisa &lt;Test&gt;</a> <span class="mut">· Community-Mitglied</span>', h)
        self.assertNotIn("Lisa <Test>", h, "Namen werden escaped")
        self.assertEqual(h.count("<li "), 3)
        self.assertIn('data-org="acme-community"', h)
        self.assertIn('"https://api.example.test"+"/api/org/"', h, "neue Kolleg:innen werden aus der Firmen-API nachgeladen")
        en = E.team_html(BASE, "en", "acme", f"{BASE}/entity/", "https://api.example.test")
        self.assertIn("<h3>People</h3>", en)
        self.assertIn(f'href="{BASE}/community/u/lisa/"', en)

    def test_html_leer_ohne_personen(self):
        self.assertEqual(E.team_html(BASE, "en", "other-co", f"{BASE}/entity/", "https://api.example.test"), "")
        E.set_teams([{"handle": "solo", "eid": "other-co", "eid_ok": True, "members": []}], [], {})
        h = E.team_html(BASE, "en", "other-co", f"{BASE}/entity/", "https://api.example.test")
        self.assertIn('<div id="en-teamw" hidden>', h, "verknuepfte Firma ohne oeffentliche Mitglieder: Gruppe versteckt, Skript kann nachladen")


if __name__ == "__main__":
    unittest.main()
