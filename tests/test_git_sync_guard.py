"""tools/git_sync_check.py: kein halbes Ergebnis von `git pull --rebase --autostash` nach main (Bau 773, Commit 4749aa83).

Nachbau in einem temporaeren git-Repo mit den echten Schritten aus .github/workflows/site.yml: Event-Stand auschecken, waehrenddessen
aendert ein anderer Bau data/members_export.json auf main, die Arbeitskopie ist schmutzig (members_export.json, speaker_*.json).
"Feste Aehnliche Folgen sichern" macht pull --rebase --autostash -X theirs: das Zurueckspielen des Autostash kollidiert, pull endet
trotzdem mit 0. Ohne Pruefung committet "Money-Keywords und Profil-Export sichern" danach die Marker-Datei samt den gestagten
Fremddateien und pusht sie; mit Pruefung bricht der Schritt ab und main bleibt heil.
"""
import os
import re
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WF = ROOT / ".github" / "workflows"
GUARD = " && python3 tools/git_sync_check.py"
PULL = "git pull --rebase --autostash"


def _steps():
    import yaml
    wf = yaml.safe_load((WF / "site.yml").read_text("utf-8"))
    steps = [s for job in wf["jobs"].values() for s in job.get("steps", [])]
    side = next(s["run"] for s in steps if s.get("name", "").startswith("Feste Aehnliche Folgen sichern"))
    money = next(s["run"] for s in steps if s.get("name", "").startswith("Money-Keywords und Profil-Export sichern"))
    return side, money


class Repo:
    """Bare-Remote + Arbeitskopie wie im Bau: Event-Stand ausgecheckt, main ist inzwischen weiter."""

    def __init__(self, conflict=True):
        self.tmp = Path(tempfile.mkdtemp(prefix="gitsync-"))
        bin_ = self.tmp / "bin"; bin_.mkdir()
        (bin_ / "sleep").write_text("#!/bin/sh\nexit 0\n"); (bin_ / "sleep").chmod(0o755)  # Wiederholungen ohne Wartezeit
        (self.tmp / "gitconfig").write_text("")
        self.env = {**os.environ, "HOME": str(self.tmp), "GIT_CONFIG_GLOBAL": str(self.tmp / "gitconfig"), "GIT_CONFIG_NOSYSTEM": "1",
                    "PATH": f"{bin_}{os.pathsep}{os.environ.get('PATH', '')}", "GIT_AUTHOR_NAME": "t", "GIT_AUTHOR_EMAIL": "t@t",
                    "GIT_COMMITTER_NAME": "t", "GIT_COMMITTER_EMAIL": "t@t"}
        self.env.pop("GIT_DIR", None); self.env.pop("GIT_WORK_TREE", None); self.env.pop("GIT_INDEX_FILE", None)
        self.origin = self.tmp / "origin.git"; self.wc = self.tmp / "wc"
        self.git("init", "-q", "--bare", "-b", "main", str(self.origin), cwd=self.tmp)
        self.git("init", "-q", "-b", "main", str(self.wc), cwd=self.tmp)
        self.write({"data/members_export.json": '{"people": [], "v": "0e55"}', "data/speaker_entities.json": '[1, 2, 3]',
                    "data/speakers.json": '{"id": "karthikeyan-vk"}', "data/sidebar_related.json": "{}",
                    "data/money_keywords.json": "{}"})
        (self.wc / "tools").mkdir()
        shutil.copy(ROOT / "tools" / "git_sync_check.py", self.wc / "tools" / "git_sync_check.py")
        self.git("add", "-A"); self.git("commit", "-q", "-m", "Event-Stand (0e55ba07)")
        self.git("remote", "add", "origin", str(self.origin)); self.git("push", "-q", "origin", "main")
        self.base = self.git("rev-parse", "HEAD")
        # ein anderer Bau schiebt waehrend dieses Baus (914a7b7a); dieser Bau kennt den Commit nicht
        other = self.tmp / "other"
        self.git("worktree", "add", "-q", "--detach", str(other), "HEAD")
        (other / "data" / "members_export.json").write_text('{"people": [], "v": "914a"}')
        self.git("commit", "-q", "-am", "anderer Bau (914a7b7a)", cwd=other)
        self.git("push", "-q", "origin", "HEAD:main", cwd=other)
        self.main_before = self.git("rev-parse", "HEAD", cwd=other)
        self.git("worktree", "remove", "--force", str(other))
        self.git("update-ref", "refs/remotes/origin/main", self.base)
        # Arbeitskopie dieses Baus: generate_site/build_speakers haben geschrieben
        dirty = {"data/speaker_entities.json": "[1]", "data/speakers.json": '{"id": "karthikeyan"}',
                 "data/sidebar_related.json": '{"neu": 1}'}
        if conflict:
            dirty["data/members_export.json"] = '{"people": [], "v": "bau773"}'
        self.write(dirty)

    def write(self, files):
        for rel, text in files.items():
            p = self.wc / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(text)

    def git(self, *args, cwd=None):
        return subprocess.run(["git", *args], cwd=cwd or self.wc, env=self.env, check=True, capture_output=True,
                              text=True).stdout.strip()

    def run_step(self, script):
        return subprocess.run(["bash", "-e", "-c", script], cwd=self.wc, env=self.env, capture_output=True, text=True, timeout=120)

    def origin_show(self, rev_path):
        return self.git("--git-dir", str(self.origin), "show", rev_path, cwd=self.tmp)

    def origin_files(self, rev="main"):
        return set(self.git("--git-dir", str(self.origin), "show", "--format=", "--name-only", rev, cwd=self.tmp).split())

    def close(self):
        shutil.rmtree(self.tmp, ignore_errors=True)


@unittest.skipUnless(shutil.which("git") and shutil.which("bash"), "git/bash fehlt")
class AutostashNachbau(unittest.TestCase):
    def setUp(self):
        self.side, self.money = _steps()

    def repo(self, **kw):
        r = Repo(**kw); self.addCleanup(r.close); return r

    def test_mechanismus_pull_endet_mit_0_und_laesst_halbe_arbeitskopie(self):
        r = self.repo()
        r.git("add", "data/sidebar_related.json"); r.git("commit", "-q", "-m", "sidebar")
        p = subprocess.run(["git", "pull", "--rebase", "--autostash", "-q", "-X", "theirs", "origin", "main"], cwd=r.wc, env=r.env,
                           capture_output=True, text=True)
        self.assertEqual(p.returncode, 0, p.stderr)  # Kern des Fehlers: Erfolg gemeldet
        self.assertIn("<<<<<<< Updated upstream", (r.wc / "data/members_export.json").read_text())
        self.assertEqual(r.git("ls-files", "-u").count("data/members_export.json"), 3)
        self.assertEqual(set(r.git("diff", "--cached", "--name-only").split()),
                         {"data/members_export.json", "data/speaker_entities.json", "data/speakers.json"})  # Fremddateien gestaged
        self.assertIn("autostash", r.git("stash", "list"))  # Stash bleibt
        g = subprocess.run(["python3", "tools/git_sync_check.py"], cwd=r.wc, env=r.env, capture_output=True, text=True)
        self.assertEqual(g.returncode, 1)
        self.assertIn("::error::git_sync_check: nicht aufgeloeste Pfade", g.stdout)
        self.assertIn("Autostash", g.stdout)

    def test_ohne_pruefung_landen_marker_und_fremddateien_auf_main(self):
        r = self.repo()
        side, money = self.side.replace(GUARD, ""), self.money.replace(GUARD, "")
        self.assertNotIn("git_sync_check", side + money)
        self.assertEqual(r.run_step(side).returncode, 0)
        p = r.run_step(money)
        self.assertEqual(p.returncode, 0, p.stdout + p.stderr)
        self.assertIn("<<<<<<< Updated upstream", r.origin_show("main:data/members_export.json"))
        self.assertTrue({"data/members_export.json", "data/speaker_entities.json", "data/speakers.json"} <= r.origin_files())

    def test_mit_pruefung_bricht_ab_und_main_bleibt_heil(self):
        r = self.repo()
        self.assertIn(GUARD, self.side); self.assertIn(GUARD, self.money)
        s = r.run_step(self.side)
        self.assertNotEqual(s.returncode, 0)
        self.assertIn("::error::git_sync_check", s.stdout)
        m = r.run_step(self.money)
        self.assertNotEqual(m.returncode, 0)
        self.assertIn("::error::git_sync_check: Konfliktmarker in data/members_export.json", m.stdout)
        self.assertEqual(r.git("--git-dir", str(r.origin), "rev-parse", "main", cwd=r.tmp), r.main_before)  # nichts gepusht
        self.assertNotIn("<<<<<<<", r.origin_show("main:data/members_export.json"))
        self.assertEqual(r.origin_show("main:data/speaker_entities.json"), "[1, 2, 3]")

    def test_normalfall_unveraendert(self):
        r = self.repo(conflict=False)
        s = r.run_step(self.side)
        self.assertEqual(s.returncode, 0, s.stdout + s.stderr)
        self.assertNotIn("git_sync_check", s.stdout + s.stderr)
        self.assertEqual(r.origin_files(), {"data/sidebar_related.json"})  # nur die eigene Datei
        self.assertEqual(r.git("stash", "list"), "")
        self.assertEqual(set(r.git("diff", "--name-only").split()), {"data/speaker_entities.json", "data/speakers.json"})  # zurueck, nicht gestaged
        self.assertEqual(r.git("diff", "--cached", "--name-only"), "")
        self.assertEqual(r.run_step(self.money).returncode, 0)  # members_export.json unveraendert: nichts zu sichern
        self.assertEqual(r.git("--git-dir", str(r.origin), "log", "-1", "--format=%s", "main", cwd=r.tmp), "Feste Aehnliche Folgen der Seitenleiste ergaenzt")

    def test_ungueltiges_json_wird_nicht_gepusht(self):
        r = self.repo(conflict=False)
        r.write({"data/money_keywords.json": '{"a": 1,}'})
        p = r.run_step(self.money)
        self.assertNotEqual(p.returncode, 0)
        self.assertIn("::error::git_sync_check: kein gueltiges JSON in data/money_keywords.json", p.stdout)
        self.assertEqual(r.git("--git-dir", str(r.origin), "rev-parse", "main", cwd=r.tmp), r.main_before)


class WorkflowsRufenPruefungAuf(unittest.TestCase):
    """Regressionsschutz: jeder `git pull --rebase --autostash` in .github/workflows/*.yml ist direkt mit der Pruefung verkettet."""

    def test_jeder_autostash_pull_ruft_pruefung(self):
        import yaml
        rx = re.compile(re.escape(PULL) + r"(?: [^;&|)\n]*?)?\s*" + re.escape(GUARD.strip()) + r"(?=\s*(?:;|&&|\|\||\)|$))", re.M)
        total = 0
        for p in sorted(WF.glob("*.yml")):
            wf = yaml.safe_load(p.read_text("utf-8"))  # laedt jede Workflow-Datei
            runs = [s.get("run", "") for job in (wf.get("jobs") or {}).values() for s in job.get("steps", [])]
            for run in runs:
                n = run.count(PULL)
                total += n
                self.assertEqual(len(rx.findall(run)), n, f"{p.name}: git pull --rebase --autostash ohne '{GUARD.strip()}':\n{run}")
            self.assertEqual(p.read_text("utf-8").count(PULL), sum(r.count(PULL) for r in runs), f"{p.name}: pull ausserhalb von run:")
        self.assertGreaterEqual(total, 32)

    def test_pruefung_ist_python_ohne_abhaengigkeiten(self):
        src = (ROOT / "tools" / "git_sync_check.py").read_text("utf-8")
        imports = set(re.findall(r"^(?:from|import) (\w+)", src, re.M))
        self.assertLessEqual(imports, {"__future__", "json", "re", "subprocess", "sys"})


if __name__ == "__main__":
    unittest.main()
