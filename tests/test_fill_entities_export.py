"""D1-Kosten der Workflows (Kostenanalyse Punkte 6 und 9): entity-fill holt den Entitaeten-Export nur einmal je Job (Datei zwischen den
Schritten), schreibt in Paketen zu 50, migration-check (Drift-Check) laeuft woechentlich, worker.yml erneuert im Zeitplan nur die Tokens.
Lauf: python3 -m unittest tests.test_fill_entities_export"""
import io
import json
import os
import sys
import tempfile
import time
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import fill_entities as F  # noqa: E402

ITEMS = [{"id": "a", "src": "seed", "h": "H-A", "data": {}}, {"id": "b", "src": "human", "h": "H-B", "data": {}}]


class FakeResp(io.BytesIO):
    def __enter__(self): return self
    def __exit__(self, *a): return False


class ExportOnce(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp()); self.calls = []
        self.old_out = F.OUT; F.OUT = self.tmp / "out"; F.OUT.mkdir()

    def tearDown(self):
        F.OUT = self.old_out
        import shutil; shutil.rmtree(self.tmp, True)

    def urlopen(self, req, timeout=None):
        self.calls.append(req.full_url)
        return FakeResp(json.dumps({"items": ITEMS}).encode())

    def edited(self, path):
        with patch.object(F.urllib.request, "urlopen", self.urlopen), redirect_stdout(io.StringIO()):
            return F.edited_ids(True, path)

    def test_second_start_reads_file_not_d1(self):
        f = self.tmp / "runner" / "entity-export.json"
        self.assertEqual(self.edited(str(f)), {"b"})   # run-Schritt: holt und legt ab
        self.assertEqual(json.loads(f.read_text("utf-8")), ITEMS)
        F.D1.clear()
        self.assertEqual(self.edited(str(f)), {"b"})   # push-Schritt: aus der Datei
        self.assertEqual(len(self.calls), 1)
        self.assertEqual(F.D1["a"]["h"], "H-A")   # D1-Hashes (base) wie beim Holen

    def test_stale_or_broken_file_refetched(self):
        f = self.tmp / "entity-export.json"
        f.write_text(json.dumps([{"id": "x", "src": "human", "h": "alt"}]), "utf-8")
        old = time.time() - F.EXPORT_MAX_AGE_S - 60; os.utime(f, (old, old))
        self.assertEqual(self.edited(str(f)), {"b"}); self.assertEqual(len(self.calls), 1)
        f.write_text("{kaputt", "utf-8")
        self.assertEqual(self.edited(str(f)), {"b"}); self.assertEqual(len(self.calls), 2)

    def test_without_path_always_fetch(self):
        self.edited(None); self.edited(None)
        self.assertEqual(len(self.calls), 2)

    def test_main_takes_env_and_flag(self):
        src = (ROOT / "fill_entities.py").read_text("utf-8")
        self.assertIn('edited_ids(strict, opt("--export-file") or os.environ.get("ENTITY_EXPORT_FILE") or None)', src)


class PushChunk(unittest.TestCase):
    def test_packages_of_50(self):
        F.d1_edited([{"id": f"e{i:03d}", "src": "seed", "h": f"H{i}"} for i in range(120)])
        ents = {f"e{i:03d}": {"id": f"e{i:03d}", "type": "product", "name": "E", "aliases": [], "desc": {"en": "", "de": ""}, "rel": []} for i in range(120)}
        fill = {k: {"desc": f"{k} is a thing for tests here."} for k in ents}
        i18n = {l: {} for l in F.LANGS}; sent = []
        post = lambda items: sent.append(len(items)) or {"results": [{"id": it["id"], "status": "ok"} for it in items]}
        old = F.OUT; F.OUT = Path(tempfile.mkdtemp())
        try:
            with redirect_stdout(io.StringIO()): F.push(ents, {}, set(), fill, i18n, post=post, spons=set())
        finally: F.OUT = old
        self.assertEqual(sent, [50, 50, 20])
        worker = (ROOT / "worker" / "src" / "entfill.js").read_text("utf-8")
        self.assertIn(f"items.slice(0, {F.PUSH_CHUNK})", worker)   # der Worker nimmt so viele je Aufruf


class Workflows(unittest.TestCase):
    def load(self, name):
        import yaml
        return yaml.safe_load((ROOT / ".github" / "workflows" / name).read_text("utf-8"))

    def test_entity_fill_passes_export_file_between_steps(self):
        steps = self.load("entity-fill.yml")["jobs"]["fill"]["steps"]
        run = next(s for s in steps if s.get("name") == "Entitaeten fuellen")
        push = next(s for s in steps if str(s.get("run", "")).startswith("python fill_entities.py push"))
        for s in (run, push):
            self.assertEqual(s["env"]["ENTITY_EXPORT_FILE"], "${{ runner.temp }}/entity-export.json")   # ausserhalb des Repos (nie committet)

    def test_migration_check_drift_weekly_live_check_daily(self):
        wf = self.load("migration-check.yml"); on = wf.get("on") or wf.get(True)
        cron = on["schedule"][0]["cron"].split()
        self.assertEqual(len(cron), 5); self.assertEqual(cron[4], "*")   # Live-Pruefung der Weiterleitungen weiter taeglich
        self.assertIn("workflow_dispatch", on)
        steps = wf["jobs"]["check"]["steps"]
        drift = next(s for s in steps if "check_entity_drift.py" in str(s.get("run", "")))
        self.assertIn('github.event_name }}" = "schedule" ] && [ "$(date -u +%u)" != "1" ]', drift["run"])   # Drift-Check (D1-Export) nur montags oder von Hand
        live = next(s for s in steps if "check_migration.py" in str(s.get("run", "")))
        self.assertNotIn("date -u", live["run"])

    def test_worker_schedule_is_token_only(self):
        wf = self.load("worker.yml")
        step = next(s for s in wf["jobs"]["deploy"]["steps"] if s.get("run") == "node setup.mjs")
        self.assertEqual(step["env"]["TOKEN_ONLY"], "${{ github.event_name == 'schedule' && '1' || '' }}")
        setup = (ROOT / "worker" / "setup.mjs").read_text("utf-8")
        self.assertIn('process.env.TOKEN_ONLY === "1"', setup)
        on = wf.get("on") or wf.get(True)
        self.assertIn("push", on); self.assertIn("workflow_dispatch", on)   # Push und Handlauf deployen wie bisher

    def test_worker_backup_steps_stay(self):
        y = (ROOT / ".github" / "workflows" / "worker.yml").read_text("utf-8")
        for need in ("D1-Sicherung verschluesseln", "openssl enc -aes-256-cbc -pbkdf2", "if-no-files-found: error", 'rm -f "$f"'):
            self.assertIn(need, y)


if __name__ == "__main__":
    unittest.main()
