"""tools/linkedin_stats.py: Zaehlen der Follow-Kanten mit Attrappen (kein Netz), Schutzregeln beim Speichern, keine Personendaten in Ausgabe/Datei.
Lauf: python3 -m unittest tests/test_linkedin_stats.py"""
import contextlib
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import linkedin_stats as L  # noqa: E402

EDGE = L.EDGE


def page(n, cursor=None, total=None, edge=EDGE):
    b = {"elements": [{"follower": f"urn:li:person:SECRET{i}", "followee": "urn:li:organizationalPage:1", "edgeType": edge, "lastModifiedAt": 1} for i in range(n)],
         "paging": {"start": 0, "count": n, "links": []}, "metadata": {}}
    if total is not None: b["paging"]["total"] = total
    if cursor: b["metadata"]["nextPaginationCursor"] = cursor
    return b


class Fake:
    def __init__(self, *resp): self.resp, self.urls, self.hdr = list(resp), [], []
    def __call__(self, url, headers):
        self.urls.append(url); self.hdr.append(headers)
        return self.resp.pop(0)


class T(unittest.TestCase):
    def test_count_pages_and_cursor(self):
        g = Fake((200, page(1000, "c1")), (200, page(1000, "c2")), (200, page(37)))
        waits = []
        with contextlib.redirect_stdout(io.StringIO()):
            n, pages, src = L.count_followers("TOK", "123", get=g, sleep=waits.append)
        self.assertEqual((n, pages, src), (2037, 3, "count"))
        self.assertEqual(waits, [L.WAIT, L.WAIT])   # 60-s-Grenze eingehalten
        self.assertIn("paginationCursor=c1", g.urls[1]); self.assertNotIn("paginationCursor", g.urls[0])
        self.assertIn("followee=urn%3Ali%3AorganizationalPage%3A123", g.urls[0])
        self.assertEqual(g.hdr[0]["Authorization"], "Bearer TOK"); self.assertEqual(g.hdr[0]["X-Restli-Protocol-Version"], "2.0.0")

    def test_other_edge_types_not_counted(self):
        g = Fake((200, page(5, edge="ORGANIZATIONAL_PAGE_FOLLOWS_ORGANIZATIONAL_PAGE")))
        n, _, _ = L.count_followers("T", "1", get=g, sleep=lambda s: None)
        self.assertEqual(n, 0)

    def test_trust_total_only_when_asked(self):
        n, pages, src = L.count_followers("T", "1", get=Fake((200, page(1000, "c", total=102022))), sleep=lambda s: None, trust_total=True)
        self.assertEqual((n, pages, src), (102022, 1, "paging.total"))
        with contextlib.redirect_stdout(io.StringIO()):
            n2, _, src2 = L.count_followers("T", "1", get=Fake((200, page(7, total=99999))), sleep=lambda s: None)
        self.assertEqual((n2, src2), (7, "count"))   # ohne Freigabe zaehlt nur, was wirklich geliefert wurde

    def test_error_and_rate_limit(self):
        with self.assertRaises(RuntimeError) as c:
            L.count_followers("SECRETTOKEN", "1", get=Fake((401, {"message": "expired"})), sleep=lambda s: None)
        self.assertIn("401", str(c.exception)); self.assertNotIn("SECRETTOKEN", str(c.exception))
        waits = []
        n, _, _ = L.count_followers("T", "1", get=Fake((429, {}), (200, page(3))), sleep=waits.append)
        self.assertEqual((n, waits), (3, [L.WAIT]))

    def test_probe_prints_shape_not_people(self):
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            out = L.probe("T", "1", get=Fake((200, page(5, "c", total=102022))))
        s = buf.getvalue()
        self.assertEqual((out["elements"], out["total"], out["has_cursor"]), (5, 102022, True))
        self.assertNotIn("SECRET", s); self.assertNotIn("urn:li:person", s)

    def test_save_merges_and_guards(self):
        with tempfile.TemporaryDirectory() as t:
            p = Path(t) / "li.json"
            p.write_text(json.dumps({"version": 1, "status": "ok", "retrieved": "2026-11-05", "page": {"page_followers": 102022, "impressions_30d": 88060}, "streams": []}))
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertFalse(L.save(10, path=p, today="2026-11-20"))      # unter der Haelfte -> nicht speichern
                self.assertFalse(L.save(0, path=p, today="2026-11-20"))
                self.assertTrue(L.save(103500, path=p, today="2026-11-20"))
            d = json.loads(p.read_text())
            self.assertEqual(d["page"]["page_followers"], 103500); self.assertEqual(d["page"]["impressions_30d"], 88060)
            self.assertEqual((d["retrieved"], d["page"]["followers_retrieved"]), ("2026-11-05", "2026-11-20"))
            self.assertNotIn("urn:li", p.read_text())

    def test_save_creates_missing_file_and_con_loader_reads_it(self):
        import mediakit_con as C
        with tempfile.TemporaryDirectory() as t:
            p = Path(t) / "li.json"
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertTrue(L.save(5000, path=p, today="2026-11-20"))
            self.assertEqual(C.linkedin(p).get("page"), {"page_followers": 5000})

    def test_main_needs_env(self):
        import os
        for k in ("LINKEDIN_ACCESS_TOKEN", "LINKEDIN_PAGE_ID"): os.environ.pop(k, None)
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(L.main(["probe"]), 2)


if __name__ == "__main__":
    unittest.main()
