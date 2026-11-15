"""Entscheidungen des Workflows live-schalten.yml (tools/live_schalten.py): Pruefstand von staging und Auswahl der Live-Workflows.
Lauf: python3 -m unittest tests.test_live_schalten"""
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import live_schalten as LS  # noqa: E402

SHA = "a" * 40


def lauf(**kw):
    r = dict(id=1, head_sha=SHA, head_branch="staging", event="push", status="completed", conclusion="success",
             created_at="2026-11-10T10:00:00Z", html_url="https://github.com/x/actions/runs/1", check_suite_id=77)
    r.update(kw)
    return r


def check(**kw):
    c = dict(name="staging-geprueft", status="completed", conclusion="success", app={"slug": "github-actions"}, check_suite={"id": 77})
    c.update(kw)
    return c


class Gate(unittest.TestCase):
    def test_gruen(self):
        ok, msg = LS.gate([lauf()], [check()], SHA)
        self.assertTrue(ok, msg)

    def test_kein_lauf_fuer_diesen_stand(self):
        ok, msg = LS.gate([lauf(head_sha="b" * 40)], [check()], SHA)
        self.assertFalse(ok)
        self.assertIn("keinen Lauf", msg)

    def test_pull_request_lauf_oder_anderer_zweig_zaehlt_nicht(self):
        self.assertFalse(LS.gate([lauf(event="pull_request")], [check()], SHA)[0])
        self.assertFalse(LS.gate([lauf(head_branch="feature")], [check()], SHA)[0])

    def test_laeuft_noch(self):
        ok, msg = LS.gate([lauf(status="in_progress", conclusion=None)], [], SHA)
        self.assertFalse(ok)
        self.assertIn("laufen noch", msg)

    def test_rot(self):
        ok, msg = LS.gate([lauf(conclusion="failure")], [check(conclusion="failure")], SHA)
        self.assertFalse(ok)
        self.assertIn("NICHT gruen", msg)

    def test_neuester_lauf_entscheidet(self):
        alt_gruen = lauf(id=1, created_at="2026-11-10T09:00:00Z")
        neu_rot = lauf(id=2, created_at="2026-11-10T10:00:00Z", conclusion="failure")
        self.assertFalse(LS.gate([alt_gruen, neu_rot], [check()], SHA)[0])
        neu_gruen = lauf(id=3, created_at="2026-11-10T11:00:00Z")
        self.assertTrue(LS.gate([neu_rot, neu_gruen], [check()], SHA)[0])

    def test_statuscheck_fehlt_oder_kommt_von_fremder_app(self):
        self.assertFalse(LS.gate([lauf()], [], SHA)[0])
        fremd = check(app={"slug": "irgendeine-app"})
        ok, msg = LS.gate([lauf()], [fremd], SHA)
        self.assertFalse(ok)
        self.assertIn("fehlt", msg)

    def test_statuscheck_aus_anderem_lauf_zaehlt_nicht(self):
        ok, _ = LS.gate([lauf()], [check(check_suite={"id": 999})], SHA)
        self.assertFalse(ok)

    def test_statuscheck_rot(self):
        self.assertFalse(LS.gate([lauf()], [check(conclusion="failure")], SHA)[0])

    def test_cli(self):
        with tempfile.TemporaryDirectory() as t:
            r, c = Path(t, "r.json"), Path(t, "c.json")
            r.write_text(json.dumps({"workflow_runs": [lauf()]}), "utf-8")
            c.write_text(json.dumps({"check_runs": [check()]}), "utf-8")
            self.assertEqual(LS.main(["gate", "--sha", SHA, "--runs", str(r), "--checks", str(c)]), 0)
            c.write_text(json.dumps({"check_runs": []}), "utf-8")
            self.assertEqual(LS.main(["gate", "--sha", SHA, "--runs", str(r), "--checks", str(c)]), 1)


class Glob(unittest.TestCase):
    def test_muster(self):
        self.assertTrue(LS.glob_to_re("worker/**").match("worker/src/index.js"))
        self.assertFalse(LS.glob_to_re("worker/**").match("workerx/a.js"))
        self.assertTrue(LS.glob_to_re("check_*.py").match("check_titles.py"))
        self.assertFalse(LS.glob_to_re("check_*.py").match("tools/check_titles.py"))
        self.assertTrue(LS.glob_to_re("**/x.js").match("x.js"))
        self.assertTrue(LS.glob_to_re("**/x.js").match("a/b/x.js"))
        self.assertTrue(LS.glob_to_re("site_*.py").match("site_blog.py"))
        self.assertFalse(LS.glob_to_re("site_*.py").match("site_blog.pyc"))

    def test_ausschluss(self):
        self.assertTrue(LS.trifft(["a/**", "!a/x.md"], ["a/y.md"]))
        self.assertFalse(LS.trifft(["a/**", "!a/x.md"], ["a/x.md"]))


class Plan(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.wf = {n: (ROOT / ".github" / "workflows" / n).read_text("utf-8") for n in LS.LIVE_WORKFLOWS}

    def test_echte_workflows_werden_gelesen(self):
        for n in LS.LIVE_WORKFLOWS:
            branches, paths = LS.push_paths(self.wf[n])
            self.assertIn("main", branches, n)
            self.assertTrue(paths, n)

    def test_nur_daten_startet_nichts(self):
        self.assertEqual(LS.plan(["data/entities.json", "episodes/abc.json", "STAGING.md"], self.wf), [])

    def test_worker_aenderung(self):
        self.assertEqual(LS.plan(["worker/src/events.js"], self.wf), ["worker.yml"])
        self.assertEqual(LS.plan(["worker/migrations/0047_x.sql"], self.wf), ["worker.yml"])

    def test_sitewrk_aenderung(self):
        self.assertEqual(LS.plan(["sitewrk/index.js"], self.wf), ["sitewrk.yml"])

    def test_seitenbau_aenderung(self):
        self.assertEqual(LS.plan(["site_events.py"], self.wf), ["site.yml"])
        self.assertEqual(LS.plan(["check_titles.py"], self.wf), ["site.yml"])
        self.assertEqual(LS.plan(["assets/app.js"], self.wf), ["site.yml"])

    def test_mehrere(self):
        self.assertEqual(LS.plan(["worker/src/a.js", "generate_site.py", "sitewrk/index.js"], self.wf), ["worker.yml", "sitewrk.yml", "site.yml"])


if __name__ == "__main__":
    unittest.main()
