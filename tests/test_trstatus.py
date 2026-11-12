"""Uebersetzungsuebersicht: alle frueheren Beitraege und die Content-Pakete bekommen eine Zeile, auch wenn sie schon in der Datenbank stehen."""
import json
import unittest
import site_trstatus as T


class Rows(unittest.TestCase):
    def test_blog_rows_from_sources(self):
        T.blog_done = lambda: {"de": ["alt-1", "content/neu"], "fr": ["alt-1"]}
        out = {}
        T.build(lambda n, c: out.__setitem__(n, c), "2026-11-12", [], [{"slug": "alt-1", "title": "A"}, {"slug": "alt-2", "title": "B"}], [], [{"slug": "content/neu", "title": "N"}])
        rows = {r["id"]: r for r in json.loads(out["translation-status.json"])["rows"]}
        self.assertEqual(set(rows), {"alt-1", "alt-2", "content/neu"})
        self.assertEqual(rows["alt-1"]["langs"], ["de", "fr"])
        self.assertEqual(rows["alt-2"]["langs"], [])
        self.assertEqual(rows["content/neu"]["langs"], ["de"])
        self.assertTrue(all(r["k"] == "lblog" for r in rows.values()))


if __name__ == "__main__":
    unittest.main()
