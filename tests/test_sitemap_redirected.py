"""Sitemaps ohne weitergeleitete Adressen (Bau-Abbruch 6./7.11.2026: check_sitemaps meldete /entity/mirko-peters/ und
/entity/dieter-kempeneers-1/ doppelt). D1 kannte noch die alten ids zusammengefuehrter Gaeste (mirko-peters-guest,
dieter-kempeneers); der Bau schrieb ihre Seiten in die Sitemap, der Link-Umbau (site_links.fix_tree) setzte die loc auf das
Weiterleitungsziel, und das Ziel stand zweimal drin."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_sitemaps as SM   # noqa: E402

B = "https://www.m365.fm"
TABLE = {"/entity/dieter-kempeneers": "/entity/dieter-kempeneers-1/", "/entity/mirko-peters-guest": "/entity/mirko-peters/",
         "/de/entity/dieter-kempeneers": "/de/entity/dieter-kempeneers-1/", "/show/episodes/alt": "/show/episodes/neu/"}


class DropRedirected(unittest.TestCase):
    def test_redirected_entries_are_dropped(self):
        sm = [(f"{B}/entity/dieter-kempeneers/", "2026-10-31", None), (f"{B}/entity/dieter-kempeneers-1/", "2026-11-01", None),
              (f"{B}/entity/mirko-peters-guest/", "2026-10-31", None), (f"{B}/entity/mirko-peters/", "2026-11-06", None),
              (f"{B}/de/entity/dieter-kempeneers/", "2026-10-31", None), (f"{B}/", "2026-11-06", None),
              (f"{B}/show/episodes/alt/", "2026-11-01", None)]   # umbenannte Folge: Tabelle gilt erst, wenn die Seite fehlt (nicht per Regel)
        keep, gone = SM.drop_redirected(sm, TABLE)
        self.assertEqual(sorted(gone), sorted([f"{B}/entity/dieter-kempeneers/", f"{B}/entity/mirko-peters-guest/", f"{B}/de/entity/dieter-kempeneers/"]))
        self.assertEqual([x[0] for x in keep], [f"{B}/entity/dieter-kempeneers-1/", f"{B}/entity/mirko-peters/", f"{B}/", f"{B}/show/episodes/alt/"])

    def test_old_language_prefix_and_en_are_dropped(self):
        keep, gone = SM.drop_redirected([(f"{B}/en/entity/x/", "2026-11-01", None), (f"{B}/hi/", "2026-11-01", None), (f"{B}/de/", "2026-11-01", None)], {})
        self.assertEqual(sorted(gone), [f"{B}/en/entity/x/", f"{B}/hi/"])
        self.assertEqual([x[0] for x in keep], [f"{B}/de/"])

    def test_written_sitemap_has_no_duplicate_after_drop(self):
        sm = [(f"{B}/entity/mirko-peters-guest/", "2026-10-31", None), (f"{B}/entity/mirko-peters/", "2026-11-06", None)]
        keep, _ = SM.drop_redirected(sm, TABLE)
        out = {}
        SM.write_all(keep, out.__setitem__, B, {"de": ("Deutsch", "de")}, "2026-11-07")
        self.assertEqual(out["sitemap-en-entity.xml"].count("<loc>"), 1)
        self.assertNotIn("mirko-peters-guest", out["sitemap-en-entity.xml"])


class MergedIds(unittest.TestCase):
    def test_repo_merge_table(self):
        import site_learn as SLN
        ids = SLN.merged_ids()
        merge = json.loads((ROOT / "data" / "guest_merge.json").read_text("utf-8"))["merge"]
        if "dieter-kempeneers" in merge:
            self.assertIn("dieter-kempeneers", ids)
        if merge.get("mirko-peters") == "mirko-peters":   # Kollision mit der Basis-Entitaet: alte id mirko-peters-guest
            self.assertIn("mirko-peters-guest", ids)
            self.assertNotIn("mirko-peters", ids)
        self.assertFalse(ids & set(merge.values()), "ein Ziel darf nie als alte id gelten")

    def test_d1_overlay_skips_merged_ids(self):
        import site_learn as SLN
        ids = sorted(SLN.merged_ids())
        if not ids:
            self.skipTest("keine zusammengefuehrten Gaeste")
        items = [{"id": i, "data": {"name": "Alt " + i, "type": "person"}} for i in ids[:2]] + [{"id": "neu-aus-d1", "data": {"name": "Neu", "type": "person"}}]
        orig = SLN._fetch_json
        try:
            SLN._fetch_json = lambda url, timeout=120: {"items": items}
            ents = SLN.load_entities("https://api.example.test")
        finally:
            SLN._fetch_json = orig
        self.assertIn("neu-aus-d1", ents)
        for i in ids[:2]:
            self.assertNotIn(i, ents)


if __name__ == "__main__":
    unittest.main()
