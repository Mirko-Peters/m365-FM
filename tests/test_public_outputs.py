"""Oeffentliches Repo: Workflows und Exporte geben keine Personendaten und keine vertraulichen Kennzahlen preis
(Sicherheitspruefung K6/K33 admin-setzen.yml, K32 Search-Console-Anfragen, K14/K24 Mediadaten-PDF als Artefakt).
Lauf: python3 -m unittest tests.test_public_outputs"""
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

import yaml

ROOT = Path(__file__).resolve().parent.parent
WF = ROOT / ".github" / "workflows"
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tools"))


def steps(name):
    d = yaml.safe_load((WF / name).read_text("utf-8"))
    return [s for job in d["jobs"].values() for s in job.get("steps", [])], d


class AdminSetzen(unittest.TestCase):
    def test_no_member_list_or_names_in_log(self):
        st, d = steps("admin-setzen.yml")
        on = d.get("on", d.get(True))   # PyYAML liest "on" als True
        self.assertTrue(on["workflow_dispatch"]["inputs"]["user_id"]["required"], "ohne ID kein Lauf (frueher: Liste aller Nutzer)")
        run = "\n".join(s.get("run", "") for s in st)
        self.assertNotRegex(run, r"SELECT[^\"]*\bname\b[^\"]*FROM users", "keine Namen aus D1 abfragen")
        for line in run.splitlines():
            if re.search(r"\bprint\(|::notice::|::warning::|GITHUB_STEP_SUMMARY", line):
                self.assertNotRegex(line, r"\[\"(name|sub|email)\"\]", "keine Namen/Kennungen ausgeben: " + line.strip())


class Mediakit(unittest.TestCase):
    def test_no_plain_artifact_and_summary_without_values(self):
        st, _ = steps("mediakit.yml")
        for s in st:
            if str(s.get("uses", "")).startswith("actions/upload-artifact"):
                path = str((s.get("with") or {}).get("path", ""))
                self.assertNotIn("mediakit", path, "Mediadaten (PDF, latest.json) nie als unverschluesseltes Artefakt")
        summ = [s for s in st if "GITHUB_STEP_SUMMARY" in s.get("run", "")]
        self.assertTrue(summ)
        for s in summ:
            self.assertNotIn("{d.get(k)}", s["run"], "keine ganzen Datensaetze (Suchanfragen, Kennzahlen) in der oeffentlichen Zusammenfassung")
            self.assertNotIn("k['value']", s["run"])

    def test_latest_json_has_no_search_queries(self):
        import mediakit as MK
        gsc = {"site": "sc", "period": "a–b", "clicks": 3, "impressions": 9, "weekly": [], "queries": [["geheime suchanfrage", 1, 2]]}
        with tempfile.TemporaryDirectory() as t, \
                mock.patch.object(MK, "youtube", return_value={"views28": 1}), mock.patch.object(MK, "cloudflare", return_value={}), \
                mock.patch.object(MK, "bing", return_value={}), mock.patch.object(MK, "local", return_value={"pricing": {"x": 1}, "spreaker7": 5}), \
                mock.patch.object(MK, "gsc_site", return_value=gsc), mock.patch.object(MK, "fonts", return_value={}), \
                mock.patch.object(MK, "build_pdf", side_effect=lambda p, *a: Path(p).write_bytes(b"%PDF")), \
                mock.patch.object(MK, "rows_for", return_value=[1]), mock.patch.object(sys, "argv", ["mediakit.py", "--out", t]):
            MK.main()
            raw = (Path(t) / "latest.json").read_text("utf-8")
            d = json.loads(raw)
        self.assertNotIn("geheime suchanfrage", raw)
        self.assertNotIn("queries", d["yt_search"])
        self.assertEqual(d["yt_search"]["clicks"], 3, "Summen bleiben")
        self.assertNotIn("pricing", d["local"])


if __name__ == "__main__":
    unittest.main()
