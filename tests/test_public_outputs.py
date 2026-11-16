"""Oeffentliches Repo: data/members_export.json enthaelt keine Kontakt- oder Adressdaten (Sicherheitspruefung K23).
Lauf: python3 -m unittest tests.test_public_outputs"""
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))


class MembersExport(unittest.TestCase):
    """K23: data/members_export.json liegt im oeffentlichen Repo (Historie bleibt) - nie Kontakt- oder Adressdaten hineinschreiben."""

    def test_checked_in_file_has_no_contact_data(self):
        d = json.loads((ROOT / "data" / "members_export.json").read_text("utf-8"))
        for p in d.get("people") or []:
            self.assertFalse(p.get("contact"), p.get("handle"))
            self.assertNotIn("private", p)

    def test_fetch_members_writes_cache_without_contact_but_pages_keep_it(self):
        import site_members as MEM
        exp = {"people": [{"handle": "anna", "name": "Anna", "items": [], "channels": [],
                           "contact": {"email": "anna@example.test", "street": "Hauptstr. 1", "zip": "12345", "city": "Musterstadt"}}], "orgs": []}
        with tempfile.TemporaryDirectory() as d:
            cache = Path(d) / "members_export.json"
            with mock.patch.object(MEM, "MARK", Path(d) / "mark.json"), mock.patch.object(MEM, "CACHE", cache), \
                    mock.patch.object(MEM, "_fetch_export", return_value=json.loads(json.dumps(exp))):
                people, _orgs = MEM.fetch_members("https://api.example.test")
            raw = cache.read_text("utf-8")
        self.assertEqual(people[0]["contact"]["city"], "Musterstadt", "Seiten dieses Baus zeigen, was das Mitglied freigegeben hat")
        for v in ("anna@example.test", "Hauptstr. 1", "12345", "Musterstadt"): self.assertNotIn(v, raw)


if __name__ == "__main__":
    unittest.main()
