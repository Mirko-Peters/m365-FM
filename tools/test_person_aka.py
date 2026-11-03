"""Offline-Regressionsprüfungen für freigegebene Personen-AKA."""
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_fetch
site_fetch.fetch = lambda *args, **kwargs: {}
import site_entities as E


BASE = "https://www.m365.fm"
PERSON = {"id": "test-person", "type": "person", "name": "Test Person", "aliases": ["Public Handle"],
          "desc": {"en": "A test person."}, "rel": []}
ENTRY = {"name": "Artist Name", "kind": "artist", "source": "https://example.com/profile", "added": "2026-11-03"}


class PersonAkaTests(unittest.TestCase):
    def load(self, entry, entities=None):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "person_aka.json"
            path.write_text(json.dumps({"version": 1, "aka": {"test-person": entry}}), encoding="utf-8")
            return E.load_person_aka(entities or [PERSON], path)

    def test_validation(self):
        with tempfile.TemporaryDirectory() as tmp:
            empty = Path(tmp) / "person_aka.json"
            empty.write_text("", encoding="utf-8")
            self.assertEqual(E.load_person_aka([PERSON], empty), {})
        with self.assertRaisesRegex(ValueError, "Unbekannte"):
            self.load([ENTRY], [dict(PERSON, id="other")])
        with self.assertRaisesRegex(ValueError, "nur für Personen"):
            self.load([ENTRY], [dict(PERSON, type="concept")])
        for name in ("A", "person@example.com", "Artist person@example.com", "+1 555 123 4567", "x" * 81):
            with self.subTest(name=name), self.assertRaisesRegex(ValueError, "Unsicherer"):
                self.load([dict(ENTRY, name=name)])
        with self.assertRaisesRegex(ValueError, "Doppelter"):
            self.load([dict(ENTRY, name="public handle")])
        with self.assertRaisesRegex(ValueError, "Doppelter"):
            self.load([ENTRY, dict(ENTRY, name="ARTIST NAME")])
        with self.assertRaisesRegex(ValueError, "HTTPS"):
            self.load([dict(ENTRY, source="http://example.com")])
        with self.assertRaisesRegex(ValueError, "AKA-Art"):
            self.load([dict(ENTRY, kind="nickname")])
        with self.assertRaisesRegex(ValueError, "AKA-Datum"):
            self.load([dict(ENTRY, added="2026-02-30")])
        self.assertEqual(self.load([dict(ENTRY, source="")])["test-person"][0]["source"], "")
        self.assertEqual(E.load_person_aka([PERSON], Path("/not/a/person_aka.json")), {})

    def test_aliases_and_aka_are_merged_once(self):
        aka = {"test-person": [ENTRY, dict(ENTRY, name="Public Handle")]}
        self.assertEqual(E.person_names(PERSON, aka), ["Public Handle", "Artist Name"])
        self.assertEqual(E.person_names(PERSON, {}), ["Public Handle"])

    def test_aka_html_escapes_name_and_links_source(self):
        entry = dict(ENTRY, name='<b>&"')
        label, html = E.aka_fact(PERSON, "en", {"test-person": [entry]})
        self.assertEqual(label, "Also known as")
        self.assertIn("&lt;b&gt;&amp;&quot;", html)
        self.assertIn('href="https://example.com/profile" rel="nofollow noopener"', html)
        self.assertNotIn("<b>", html)

    def test_mirko_jsonld_and_person_without_aka(self):
        mirko = next(e for e in E.ENTS.values() if e["id"] == E.MUSICGROUP_ID)
        aka = {"mirko-peters": [{"name": E.MUSICGROUP_NAME, "kind": "artist",
                                  "source": ENTRY["source"], "added": ENTRY["added"]}]}
        with patch.object(E, "PERSON_LD", lambda: {
            "@type": "Person", "@id": E.eid_of(BASE, "mirko-peters"),
            "alternateName": ["Mirko Peters MVP", "Mirko Peters M365.FM"],
        }):
            node = E.ent_ld(BASE, mirko, "en", person_aka=aka)
        self.assertEqual(node["alternateName"], ["Mirko Peters MVP", "Mirko Peters M365.FM", E.MUSICGROUP_NAME])
        self.assertEqual(node["memberOf"], {"@id": f"{BASE}/entity/mirko-peters/#musicgroup"})
        group = E.musicgroup_ld(BASE)
        self.assertEqual(group, {
            "@type": "MusicGroup", "@id": f"{BASE}/entity/mirko-peters/#musicgroup",
            "name": E.MUSICGROUP_NAME,
            "founder": {"@id": E.eid_of(BASE, "mirko-peters")},
            "member": [{"@id": E.eid_of(BASE, "mirko-peters")}],
        })
        without_aka = E.ent_ld(BASE, PERSON, "en", person_aka={})
        self.assertEqual(without_aka["alternateName"], ["Public Handle"])
        self.assertNotIn("memberOf", without_aka)


if __name__ == "__main__":
    unittest.main()
