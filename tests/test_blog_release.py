"""tools/blog_release.py: Tagesordner wie bisher, Reihen (reihe.json) geben je Artikeldatum genau eine Welle frei, ohne KI."""
import json
import os
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import blog_release as BR   # noqa: E402

DOC = '---\ntitle: "{t}"\nsummary: "x"\nstatus: review\npublish: false\nauthor: mirko-p\ndate: 2026-11-18\ntopics: [nerdio]\n---\n\nText\n'


class Reihe(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); t = Path(self.tmp.name)
        self.queue, self.dest, self.spons = t / "q", t / "en", t / "s.json"
        self.series = self.queue / "nerdio"
        self.dest.mkdir(parents=True)
        for w, slugs in ((1, ["a", "b"]), (2, ["c", "dep"]), (3, ["e"])):
            for s in slugs:
                p = self.series / f"welle-{w:02d}" / f"{s}.md"; p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text(DOC.format(t=s), "utf-8")
        (self.queue / "2026-11-21").mkdir()
        for s in ("x", "y"):
            (self.queue / "2026-11-21" / f"{s}.md").write_text(DOC.format(t=s), "utf-8")
        self.cfg({"zuletzt": "", "sponsoring": "nerdio-partner", "nach": {"dep": ["a", "e"]}})
        self.spons.write_text(json.dumps({"version": 1, "sponsorships": [{"id": "nerdio-partner", "label": "partner"}, {"id": "andere", "label": "sponsored"}]},
                                         indent=1) + "\n", "utf-8")

    def tearDown(self):
        self.tmp.cleanup()

    def cfg(self, d=None):
        p = self.series / "reihe.json"
        if d is None: return json.loads(p.read_text("utf-8"))
        p.write_text(json.dumps(d), "utf-8")

    def run_series(self, day):
        with redirect_stdout(StringIO()):
            return BR.release_series(str(self.series), str(self.dest), day, sponsorships=str(self.spons))

    def test_eine_welle_je_datum_in_reihenfolge(self):
        self.assertEqual(self.run_series("2026-11-19"), ["a", "b"])
        self.assertFalse((self.series / "welle-01").exists())
        self.assertEqual(self.run_series("2026-11-19"), [])   # zweiter Lauf fuer dasselbe Datum: keine weitere Welle
        self.assertEqual(self.cfg()["zuletzt"], "2026-11-19")
        t = (self.dest / "a.md").read_text("utf-8")
        self.assertIn("status: approved\npublish: true\n", t); self.assertIn("date: 2026-11-19\n", t)

    def test_abhaengigkeit_rueckt_in_naechste_welle(self):
        self.run_series("2026-11-19")
        self.assertEqual(self.run_series("2026-11-20"), ["c"])   # dep braucht e, das erst in Welle 3 liegt
        self.assertTrue((self.series / "welle-03" / "dep.md").exists())
        self.assertEqual(sorted(self.run_series("2026-11-21")), ["dep", "e"])   # gemeinsam mit e: erlaubt
        self.assertEqual(self.run_series("2026-11-22"), [])

    def test_partner_posts_im_selben_lauf(self):
        self.run_series("2026-11-19")
        d = json.loads(self.spons.read_text("utf-8"))
        self.assertEqual(d["sponsorships"][0]["posts"], ["/community/u/mirko-p/blog/a/", "/community/u/mirko-p/blog/b/"])
        self.assertNotIn("posts", d["sponsorships"][1])
        self.run_series("2026-11-20")
        self.assertEqual(len(json.loads(self.spons.read_text("utf-8"))["sponsorships"][0]["posts"]), 3)

    def test_vorhandener_slug_wird_nicht_ueberschrieben(self):
        (self.dest / "a.md").write_text("alt", "utf-8")
        self.assertEqual(self.run_series("2026-11-19"), ["b"])
        self.assertEqual((self.dest / "a.md").read_text("utf-8"), "alt")
        self.assertTrue((self.series / "_blockiert" / "a.md").exists())
        self.assertNotIn("/community/u/mirko-p/blog/a/", json.loads(self.spons.read_text("utf-8"))["sponsorships"][0]["posts"])

    def test_tagesordner_unabhaengig_vom_limit_der_reihe(self):
        with redirect_stdout(StringIO()):
            n = BR.release_days(str(self.queue), str(self.dest), "2026-11-19", "", 1)
        self.assertEqual(n, 1)
        self.assertTrue((self.dest / "x.md").exists()); self.assertTrue((self.queue / "2026-11-21" / "y.md").exists())
        self.assertTrue((self.series / "welle-01" / "a.md").exists())   # Reihe nicht von release_days angefasst
        self.assertEqual(self.run_series("2026-11-19"), ["a", "b"])

    def test_main_gibt_reihe_und_tagesordner_frei(self):
        old = (BR.QUEUE, BR.DEST, BR.SPONSORSHIPS, sys.argv)
        BR.QUEUE, BR.DEST = str(self.queue), str(self.dest)
        BR.release_series.__defaults__ = (str(self.spons),)
        try:
            sys.argv = ["blog_release.py", "", "", "2026-11-19"]
            with redirect_stdout(StringIO()):
                BR.main()
        finally:
            BR.QUEUE, BR.DEST, BR.SPONSORSHIPS, sys.argv = old
            BR.release_series.__defaults__ = (BR.SPONSORSHIPS,)
        self.assertEqual(sorted(os.listdir(self.dest)), ["a.md", "b.md", "x.md", "y.md"])


if __name__ == "__main__":
    unittest.main()
