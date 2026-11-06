"""Weiterleitungen in einem Schritt (Wunsch Mirko 6.11.2026): die echte Tabelle show/redirects.json aus dem Datenstand
(site_podpage.redirect_table) enthaelt keine Ketten, und jede alte Adresse kommt ueber den Site-Worker (sitewrk/test/hops.test.mjs, echter
Worker-Code) und ueber seinen Python-Nachbau (site_links.py) in hoechstens einem Schritt an einem Ziel an, das selbst nicht weiterleitet."""
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_links as SL   # noqa: E402
import site_podpage as PP   # noqa: E402

LG = ("de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")
TABLE, CLASH, CHAINS, DROPPED = PP.redirect_table(*PP.table_inputs(), LG=LG, docs=Path(tempfile.mkdtemp()))


class AssumeBuilt(SL.Site):
    """Jede Adresse mit "/" am Ende, die nicht selbst eine alte Adresse ist, gibt es (wie der Ursprung in hops.test.mjs)."""
    def where(self, path):
        if path.endswith("/") and (path.rstrip("/") or "/") not in TABLE:
            return "docs"
        return None


class TableTest(unittest.TestCase):
    def test_table_has_no_chains(self):
        self.assertGreater(len(TABLE), 1000)
        for old, to in TABLE.items():
            path = to.split("?", 1)[0]
            self.assertFalse(SL.rule_target(path, TABLE), f"{old} -> {to} leitet weiter")
            self.assertNotIn(path.rstrip("/") or "/", TABLE, f"{old} -> {to}: Ziel ist selbst eine alte Adresse")
            self.assertTrue(path.endswith("/") or SL._EXT.search(path), f"{old} -> {to}: ohne '/' leitet GitHub Pages noch einmal um")

    def test_collapse(self):
        t, ch, dr = SL.collapse({"/a": "/b", "/b": "/c/", "/x": "/y/", "/y": "/x/", "/self": "/self/", "/v": "/m365-fm-podcast/foo", "/en-x": "/en/show/"})
        self.assertEqual(t["/a"], "/c/")
        self.assertEqual(t["/b"], "/c/")
        self.assertEqual(t["/v"], "/show/episodes/foo/")
        self.assertEqual(t["/en-x"], "/show/")
        self.assertEqual(sorted(dr), ["/self", "/x", "/y"])
        self.assertEqual(ch["/a"], ("/b", "/c/"))


class PythonMirrorTest(unittest.TestCase):
    def test_every_source_one_hop(self):
        res = SL.Resolver(TABLE, AssumeBuilt())
        bad = []
        for old in TABLE:
            for host, path in ((SL.WWW, old), (SL.WWW, old + "/"), ("m365.fm", old), ("dub.m365.fm", old + "/")):
                nxt = res.hop(host, path)
                if not nxt or res.hop(*nxt) is not None:
                    bad.append((host, path, nxt))
        self.assertEqual(bad[:20], [], f"{len(bad)} Adressen brauchen mehr als einen Schritt")


@unittest.skipUnless(shutil.which("node"), "node fehlt")
class WorkerTest(unittest.TestCase):
    def test_worker_every_source_one_hop(self):
        d = Path(tempfile.mkdtemp())
        (d / "table.json").write_text(json.dumps(TABLE), "utf-8")
        r = subprocess.run(["node", "--test", "test/hops.test.mjs"], cwd=ROOT / "sitewrk", capture_output=True, text=True, timeout=600,
                           env={**os.environ, "HOPS_TABLE": str(d / "table.json"), "HOPS_REPORT": str(d / "report.json")})
        rep = json.loads((d / "report.json").read_text("utf-8")) if (d / "report.json").exists() else {}
        self.assertEqual(r.returncode, 0, (rep.get("bad") or [])[:10] or r.stdout[-3000:])
        self.assertGreater(rep.get("checked", 0), 4 * 1000)


if __name__ == "__main__":
    unittest.main()
