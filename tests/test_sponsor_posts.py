"""Plan der 62 Cognillo-Beitraege (data/sponsor_posts_cognillo.json): Aufbau, Nummern, Slugs, Entitaeten, gesponserte Nummern, Daten.
Der taegliche Lauf liest diese Datei; die Feldnamen duerfen sich nicht aendern."""
import json
import sys
import unittest
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_content_blog as CB   # noqa: E402

PLAN = json.loads((ROOT / "data" / "sponsor_posts_cognillo.json").read_text("utf-8"))
ENTS = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
SPONSORED = [48, 52, 53, 54, 55, 56, 62]
FIELDS = {"nr", "reihe", "title", "main", "others", "sponsored", "status", "slug", "date"}
OPTIONAL = {"freigegeben"}   # setzt tools/sponsor_post.py freigeben
STATUS = ("geplant", "entwurf", "live")   # schreibt tools/sponsor_post.py (schreiben -> entwurf, taeglich -> live)


class Plan(unittest.TestCase):
    def test_aufbau(self):
        self.assertEqual(len(PLAN), 62)
        for p in PLAN:
            self.assertTrue(FIELDS <= set(p) <= FIELDS | OPTIONAL, p.get("nr"))
            self.assertIn(p["reihe"], "ABCDEFGH")
            self.assertTrue(p["title"].strip() and p["title"] == p["title"].strip(), p["nr"])
            self.assertNotIn("(gesponsert)", p["title"])   # Kennzeichnung steht im Feld sponsored, nicht im Titel
            self.assertIn(p["status"], STATUS, p["nr"])
            if "freigegeben" in p: self.assertIsInstance(p["freigegeben"], bool, p["nr"])
            self.assertIsInstance(p["others"], list)
            self.assertIsInstance(p["sponsored"], bool)

    def test_nummern_und_slugs_eindeutig(self):
        self.assertEqual([p["nr"] for p in PLAN], list(range(1, 63)))
        slugs = [p["slug"] for p in PLAN]
        self.assertEqual(len(set(slugs)), 62)
        for s in slugs:
            self.assertTrue(CB.SLUG.match(s), s)   # Slug-Regel des Blog-Imports
            self.assertLessEqual(len(s), 100, s)
            self.assertFalse(s.endswith("-") or "--" in s, s)

    def test_reihen_zusammenhaengend(self):
        reihen = [p["reihe"] for p in PLAN]
        self.assertEqual(reihen, sorted(reihen))
        self.assertEqual({r: reihen.count(r) for r in "ABCDEFGH"}, {"A": 10, "B": 7, "C": 9, "D": 6, "E": 7, "F": 7, "G": 6, "H": 10})

    def test_entitaeten_existieren(self):
        for p in PLAN:
            for i in [p["main"], *p["others"]]:
                self.assertIn(i, ENTS, (p["nr"], i))
            self.assertNotIn(p["main"], p["others"], p["nr"])
            self.assertEqual(len(set(p["others"])), len(p["others"]), p["nr"])
            self.assertTrue(1 <= len(p["others"]) <= 6, p["nr"])
        for i in ("cognillo", "sharepoint-essentials-toolkit", "genta-automation", "sharepoint-permissions", "sharepoint-migration", "sharepoint-broken-links",
                  "user-offboarding", "sharepoint-governance", "sharepoint-site-owner", "sharepoint-site-lifecycle", "sharepoint-reporting"):
            self.assertTrue(any(i == p["main"] or i in p["others"] for p in PLAN), f"{i} kommt im Plan nicht vor")

    def test_gesponserte_nummern(self):
        self.assertEqual([p["nr"] for p in PLAN if p["sponsored"]], SPONSORED)

    def test_daten_fortlaufend(self):
        self.assertEqual(PLAN[0]["date"], "2026-11-15")
        self.assertEqual(PLAN[-1]["date"], "2027-01-15")
        for p in PLAN:
            self.assertEqual(p["date"], (date(2026, 11, 15) + timedelta(days=p["nr"] - 1)).isoformat(), p["nr"])   # ein Beitrag pro Tag, keine Luecke
        self.assertEqual(len({p["date"] for p in PLAN}), 62)


if __name__ == "__main__":
    unittest.main()
