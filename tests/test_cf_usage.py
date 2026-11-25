"""Cloudflare-Verbrauch (tools/cf_usage.py, cf-usage.yml): Abfragen mit Attrappen (kein Netz), Klassenzuordnung R2, Token-Rueckfall,
fehlendes Recht -> Hinweis und Exit 0, nie Konto-ID oder Token im Bericht, cron_runs-SQL gegen SQLite, Workflow nur lesend.
Lauf: python3 -m unittest tests.test_cf_usage"""
import datetime as dt
import io
import os
import sqlite3
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import cf_usage as CU  # noqa: E402

ACC = "0123456789abcdef0123456789abcdef"
ENV = {"CF_ANALYTICS_TOKEN": "read-token-not-real", "CLOUDFLARE_API_TOKEN": "deploy-token-not-real", "CF_ACCOUNT_ID": ACC, "GITHUB_ACTIONS": ""}
TODAY = dt.date(2026, 11, 25)
DENIED = {"data": None, "errors": [{"message": f"not authorized for account {ACC}"}]}


def gql_ok(query, variables):
    if "d1AnalyticsAdaptiveGroups" in query:
        return {"data": {"viewer": {"accounts": [{"d1AnalyticsAdaptiveGroups": [
            {"sum": {"rowsRead": 1000, "rowsWritten": 50, "readQueries": 10, "writeQueries": 2}, "dimensions": {"date": "2026-11-11", "databaseId": "uuid-live"}},
            {"sum": {"rowsRead": 200, "rowsWritten": 5, "readQueries": 4, "writeQueries": 1}, "dimensions": {"date": "2026-11-24", "databaseId": "uuid-live"}},
            {"sum": {"rowsRead": 7, "rowsWritten": 1, "readQueries": 1, "writeQueries": 1}, "dimensions": {"date": "2026-11-24", "databaseId": "uuid-staging"}},
        ]}]}}, "errors": None}
    if "r2OperationsAdaptiveGroups" in query:
        return {"data": {"viewer": {"accounts": [{"r2OperationsAdaptiveGroups": [
            {"sum": {"requests": 3}, "dimensions": {"actionType": "PutObject", "bucketName": "m365-fm"}},
            {"sum": {"requests": 10}, "dimensions": {"actionType": "GetObject", "bucketName": "m365-fm"}},
            {"sum": {"requests": 2}, "dimensions": {"actionType": "DeleteObject", "bucketName": "m365-fm"}},
            {"sum": {"requests": 1}, "dimensions": {"actionType": "Neu", "bucketName": "m365-fm"}},
        ]}]}}, "errors": None}
    if "r2StorageAdaptiveGroups" in query:
        return {"data": {"viewer": {"accounts": [{"r2StorageAdaptiveGroups": [
            {"max": {"payloadSize": 2_500_000_000, "metadataSize": 0, "objectCount": 146745}, "dimensions": {"bucketName": "m365-fm"}}]}]}}, "errors": None}
    raise AssertionError(query)


class Fake:
    """Antwortet wie die Cloudflare-API. deny: Tokens, die GraphQL ablehnen. Merkt sich (Pfad, Token, Body)."""

    def __init__(self, deny=(), d1_rest=True):
        self.deny, self.d1_rest, self.calls = set(deny), d1_rest, []

    def __call__(self, url, tok, body=None, timeout=60):
        path = url.replace(CU.API, ""); self.calls.append((path, tok, body))
        if path == "/graphql":
            if tok in self.deny: return 200, DENIED
            return 200, gql_ok(body["query"], body["variables"])
        if not self.d1_rest: return 403, {"success": False, "errors": [{"message": "Authentication error"}]}
        if path.startswith(f"/accounts/{ACC}/d1/database?"):
            return 200, {"success": True, "result": [{"uuid": "uuid-live", "name": "m365-dub"}, {"uuid": "uuid-staging", "name": "m365-dub-staging"}]}
        if path == f"/accounts/{ACC}/d1/database/uuid-live/query":
            assert body["sql"].lstrip().upper().startswith("SELECT"), body
            return 200, {"success": True, "result": [{"results": [{"name": "importEpisodes", "n": 336, "rr": 12000, "rw": 0}]}]}
        return 404, {"success": False, "errors": [{"message": "nicht gefunden"}]}


class Classes(unittest.TestCase):
    def test_r2_classes(self):
        self.assertEqual([CU.classify(a) for a in ("PutObject", "ListObjects", "GetObject", "HeadObject", "DeleteObject", "Unbekannt")],
                         ["A", "A", "B", "B", "frei", "?"])
        self.assertFalse(CU.CLASS_A & CU.CLASS_B or CU.CLASS_A & CU.FREE or CU.CLASS_B & CU.FREE)

    def test_window_full_days_until_yesterday(self):
        w = CU.days_window(14, TODAY)
        self.assertEqual((len(w), w[0], w[-1]), (14, dt.date(2026, 11, 11), dt.date(2026, 11, 24)))


class Report(unittest.TestCase):
    def run_report(self, fake, env=ENV):
        with patch.dict(os.environ, env, clear=False), redirect_stdout(io.StringIO()) as out:
            md, notes = CU.report(14, http=fake, today=TODAY)
        return md, notes, out.getvalue()

    def test_full_report(self):
        fake = Fake(); md, notes, _ = self.run_report(fake)
        self.assertEqual(notes, [])
        self.assertIn("| 2026-11-11 | 1.000 | 50 | 10 | 2 |", md)
        self.assertIn("| 2026-11-24 | 207 | 6 | 5 | 2 |", md)   # Summe ueber beide Datenbanken
        self.assertIn("| m365-dub | 1.200 | 55 |", md)   # Namen statt IDs
        self.assertIn("| 2026-11-20 | 3 | 10 | 2 | 1 |", md)   # Class A, B, kostenlos, unbekannt je Tag
        self.assertIn("| m365-fm | GetObject | B | 140 |", md)
        self.assertIn("2.50 GB", md); self.assertIn("146.745", md)
        self.assertIn("| importEpisodes | 336 | 12.000 | 0 |", md)
        self.assertIn("Zeilen gelesen je Tag", md)
        r2 = [c for c in fake.calls if c[0] == "/graphql" and "r2OperationsAdaptiveGroups" in c[2]["query"]]
        self.assertEqual(len(r2), 14)   # ein Tag je Abfrage
        self.assertTrue(all(c[1] == ENV["CF_ANALYTICS_TOKEN"] for c in fake.calls if c[0] == "/graphql"))   # Lese-Token zuerst

    def test_token_fallback(self):
        md, notes, _ = self.run_report(Fake(deny={ENV["CF_ANALYTICS_TOKEN"]}))
        self.assertEqual(notes, []); self.assertIn("| 2026-11-11 | 1.000 |", md)

    def test_missing_permission_is_notice_not_failure(self):
        fake = Fake(deny={ENV["CF_ANALYTICS_TOKEN"], ENV["CLOUDFLARE_API_TOKEN"]}, d1_rest=False)
        md, notes, out = self.run_report(fake, {**ENV, "GITHUB_ACTIONS": "true"})
        self.assertTrue(any("Account Analytics: Read" in n for n in notes))
        self.assertIn("::notice title=Cloudflare-Verbrauch::", out)
        self.assertIn("nicht abrufbar", md)
        self.assertEqual(len([c for c in fake.calls if "r2OperationsAdaptiveGroups" in str(c[2])]), 2)   # nach dem ersten abgelehnten Tag Schluss
        for secret in (ACC, ENV["CF_ANALYTICS_TOKEN"], ENV["CLOUDFLARE_API_TOKEN"]):
            self.assertNotIn(secret, md); self.assertNotIn(secret, out)

    def test_no_token_exit_zero(self):
        env = {**ENV, "CF_ANALYTICS_TOKEN": "", "CLOUDFLARE_API_TOKEN": ""}
        with tempfile.TemporaryDirectory() as d, patch.dict(os.environ, env, clear=False), redirect_stdout(io.StringIO()):
            out = Path(d) / "summary.md"
            self.assertEqual(CU.main(["--days", "14", "--out", str(out)]), 0)
            self.assertIn("nichts gemessen", out.read_text("utf-8"))

    def test_main_writes_summary_with_network_errors(self):
        with tempfile.TemporaryDirectory() as d, patch.dict(os.environ, {**ENV, "GITHUB_STEP_SUMMARY": str(Path(d) / "s.md")}, clear=False), \
                patch.object(CU, "_http", lambda *a, **k: (0, {})), redirect_stdout(io.StringIO()):
            self.assertEqual(CU.main(["--days", "3"]), 0)
            self.assertIn("nicht abrufbar", (Path(d) / "s.md").read_text("utf-8"))

    def test_mask(self):
        self.assertEqual(CU.mask(f"x {ACC} y {'f' * 32}", ACC), "x [Konto-ID] y [ID]")


class CronSql(unittest.TestCase):
    def test_sql_on_cron_runs_with_truncated_info(self):
        db = sqlite3.connect(":memory:")
        db.executescript((ROOT / "worker" / "migrations" / "0002_ops.sql").read_text("utf-8"))
        full = '{"rr":100,"rw":4,"changed":1}'
        cut = ('{"rr":50,"rw":2,"r":"' + "x" * 400)[:300]   # track() kuerzt info auf 300 Zeichen: kein gueltiges JSON mehr
        for name, started, ok, info in (("a", 1000, 1, full), ("a", 1001, 1, cut), ("b", 1002, 1, '{"rr":7,"rw":0}'), ("b", 1003, 0, "Fehler"),
                                        ("c", 10, 1, '{"rr":999,"rw":999}'), ("d", 1004, 1, "alt ohne rr")):
            db.execute("INSERT INTO cron_runs(name,started,finished,ok,info) VALUES(?,?,?,?,?)", (name, started, started, ok, info))
        rows = db.execute(CU.CRON_SQL, (500,)).fetchall()
        db.close()
        self.assertEqual(rows, [("a", 2, 150, 6), ("b", 1, 7, 0)])

    def test_sql_is_read_only(self):
        self.assertTrue(CU.CRON_SQL.startswith("SELECT "))
        for w in ("INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "CREATE", "REPLACE INTO", ";"):
            self.assertNotIn(w, CU.CRON_SQL.upper().replace("REPLACE(", ""))


class Workflow(unittest.TestCase):
    def test_workflow_read_only_weekly_manual(self):
        import yaml
        wf = yaml.safe_load((ROOT / ".github" / "workflows" / "cf-usage.yml").read_text("utf-8"))
        on = wf.get("on") or wf.get(True)
        self.assertIn("workflow_dispatch", on); self.assertRegex(on["schedule"][0]["cron"], r"^\d+ \d+ \* \* [0-6]$")
        self.assertEqual(wf["permissions"], {"contents": "read"})
        y = (ROOT / ".github" / "workflows" / "cf-usage.yml").read_text("utf-8")
        for need in ("secrets.CF_ANALYTICS_TOKEN", "secrets.CLOUDFLARE_API_TOKEN", "secrets.CF_ACCOUNT_ID || secrets.CLOUDFLARE_ACCOUNT_ID || secrets.R2_ACCOUNT_ID",
                     "tools/cf_usage.py"):
            self.assertIn(need, y)
        self.assertNotIn("continue-on-error", y)   # Exit 0 kommt aus dem Programm, Programmfehler bleiben sichtbar
        self.assertNotIn("${{ inputs.days }}\n", y.split("run:")[-1])   # Eingabe nur ueber env, nie direkt im Skript


if __name__ == "__main__":
    unittest.main()
