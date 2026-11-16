"""SEO-Experiment beschreibende Ankertexte: Gruppen eingefroren und gleich gross, Ankertexte sauber, Start erst ab Datum, Auswertung und Pruefung laufen."""
import contextlib
import io
import json
import sys
import tempfile
import unittest
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import seo_experiment as X   # noqa: E402
import importlib.util   # noqa: E402

_spec = importlib.util.spec_from_file_location("seo_experiment_cli", ROOT / "tools" / "seo_xp.py")
CLI = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(CLI)

ENTS = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
DATA = json.loads((ROOT / "data" / "seo_experiment.json").read_text("utf-8"))
DUP = json.loads((ROOT / "data" / "entity_duplicates.json").read_text("utf-8"))["duplicates"]


class Anker(unittest.TestCase):
    def test_descriptor_regeln(self):
        d = X.descriptor("Conditional Access", "A policy engine in Microsoft Entra that decides at sign-in whether to allow, block or require extra steps.")
        self.assertEqual(d, "a policy engine in Microsoft Entra")
        self.assertEqual(X.descriptor("Azure Functions", "Serverless compute service of Azure"), "Serverless compute service of Azure")
        self.assertIsNone(X.descriptor("X", "A pattern in which things happen"))          # endet auf Funktionswort
        self.assertIsNone(X.descriptor("X", "A highly available"))                          # endet auf Adjektiv
        self.assertIsNone(X.descriptor("X", "A fully managed service"))                     # zu allgemein
        self.assertIsNone(X.descriptor("KPI", "A KPI is a measure of progress towards a goal"))   # ganzer Satz
        self.assertIsNone(X.descriptor("X", ""))
        self.assertIsNone(X.descriptor("OAuth 2.0", "OAuth 2.0 is an open authorization standard that decides what an app can reach"))   # 4 Woerter ohne Eigennamen: zu allgemein, bleibt aussen vor

    def test_anchor_beginnt_mit_name(self):
        self.assertEqual(X.anchor({"name": "Conditional Access", "desc": {"en": "A policy engine in Microsoft Entra that decides."}}), "Conditional Access – a policy engine in Microsoft Entra")


class Gruppen(unittest.TestCase):
    def test_assign_ist_stabil_und_ausgewogen(self):
        a = X.assign(ENTS, dup=DUP)[:2]
        self.assertEqual(a, X.assign(ENTS, dup=DUP)[:2])
        self.assertEqual((len(a[0]), len(a[1])), (X.PER_GROUP, X.PER_GROUP))   # genau 100 gegen 100
        self.assertEqual(set(a[0]) & set(a[1]), set())

    def test_eingefrorene_datei(self):
        sem, ctl = set(DATA["sem"]), set(DATA["ctl"])
        self.assertEqual(sem & ctl, set())
        self.assertEqual((len(sem), len(ctl)), (100, 100))
        self.assertEqual(set(DATA["anchors"]), sem)
        for i in sem | ctl:
            self.assertIn(i, ENTS); self.assertIn(ENTS[i]["type"], X.TYPES); self.assertNotIn(i, DUP); self.assertNotIn(i, DUP.values())
        for i, t in DATA["anchors"].items():
            self.assertTrue(t.startswith(ENTS[i]["name"] + " – "), i); self.assertLessEqual(len(t), len(ENTS[i]["name"]) + X.MAX_LEN + 3)
        for t in ("concept", "product"):   # beide Gruppen aehnlich zusammengesetzt
            a = sum(ENTS[i]["type"] == t for i in sem); b = sum(ENTS[i]["type"] == t for i in ctl)
            self.assertLessEqual(abs(a - b), 1, t)
        date.fromisoformat(DATA["start"])


class Start(unittest.TestCase):
    def test_load_erst_ab_startdatum(self):
        with tempfile.TemporaryDirectory() as t:
            p = Path(t) / "x.json"; p.write_text(json.dumps({"start": "2026-12-01", "sem": ["a"], "ctl": ["b"], "anchors": {"a": "A – eine Sache hier"}}), "utf-8")
            self.assertIsNone(X.load("2026-11-30", p))
            x = X.load("2026-12-01", p)
            self.assertEqual(X.variant(x, "a"), "sem"); self.assertEqual(X.variant(x, "b"), "ctl"); self.assertIsNone(X.variant(x, "c"))
            self.assertEqual(X.link_text(x, "a", "A"), ("A – eine Sache hier", "sem"))
            self.assertEqual(X.link_text(x, "b", "B"), ("B", "ctl"))
            self.assertEqual(X.link_text(x, "c", "C"), ("C", ""))
            self.assertEqual(X.link_text(None, "a", "A"), ("A", ""))   # ohne laufendes Experiment bleibt alles beim Alten
            p.write_text(json.dumps({"start": "2026-12-01", "stop": "2026-12-10", "sem": ["a"], "ctl": [], "anchors": {}}), "utf-8")
            self.assertIsNone(X.load("2026-12-11", p))
        self.assertIsNone(X.load("2026-12-01", ROOT / "gibt-es-nicht.json"))


class Werkzeug(unittest.TestCase):
    def test_report_auf_kuenstlichen_daten(self):
        sem, ctl = DATA["sem"][:40], DATA["ctl"][:40]
        def week(path, f0, f1, mult_sem):
            rows = []
            for k, i in enumerate(sem + ctl):
                m = mult_sem if i in sem else 1.0
                rows.append({"query": f"q{k}", "page": f"https://www.m365.fm/entity/{i}/", "country": "usa", "clicks": 1 * m, "impressions": (20 + k) * m, "ctr": 0.05, "position": 12.0})
                rows.append({"query": f"q{k}b", "page": f"https://www.m365.fm/de/entity/{i}/", "country": "deu", "clicks": 9, "impressions": 99, "ctr": 0.1, "position": 3.0})   # deutsche Seiten zaehlen nicht
            Path(path).write_text(json.dumps({"period": {"from": f0, "to": f1}, "rows": rows}), "utf-8")
        with tempfile.TemporaryDirectory() as t:
            b, a = Path(t) / "b.json", Path(t) / "a.json"
            week(b, "2026-11-01", "2026-11-28", 1.0); week(a, "2026-12-01", "2026-12-28", 1.5)
            out = io.StringIO()
            with contextlib.redirect_stdout(out):
                CLI.main(["report", "--before", str(b), "--after", str(a)])
            txt = out.getvalue()
        self.assertIn("Vorher 28 Tage, nachher 28 Tage", txt)
        self.assertIn("Impressionen/Tag", txt); self.assertIn("Intervall ohne 0", txt)   # kuenstlicher Effekt wird erkannt

    def test_check_prueft_gebauten_ordner(self):
        s, c = DATA["sem"][0], DATA["ctl"][0]
        with tempfile.TemporaryDirectory() as t:
            d = Path(t) / "entity" / "x"; d.mkdir(parents=True)
            good = f'<a href="https://x/entity/{s}/" data-xv="sem">{DATA["anchors"][s]}</a><a href="https://x/entity/{c}/" data-xv="ctl">{ENTS[c]["name"]}</a>'
            (d / "index.html").write_text(good, "utf-8")
            with contextlib.redirect_stdout(io.StringIO()):
                CLI.cmd_check(type("A", (), {"dir": t})) if False else None
            with self.assertRaises(SystemExit) as r, contextlib.redirect_stdout(io.StringIO()):
                CLI.main(["check", t])
            self.assertEqual(r.exception.code, 0)
            (d / "index.html").write_text(good.replace(DATA["anchors"][s], ENTS[s]["name"]), "utf-8")   # sem-Link ohne Beschreibung = Fehler
            with self.assertRaises(SystemExit) as r, contextlib.redirect_stdout(io.StringIO()):
                CLI.main(["check", t])
            self.assertEqual(r.exception.code, 1)

    def test_seitenbau_haengt_am_experiment(self):
        src = (ROOT / "site_entities.py").read_text("utf-8")
        self.assertIn("SXP.load(TODAY)", src); self.assertGreaterEqual(src.count("_xl("), 3)
        self.assertNotIn("_xl(", src[src.index("<nav aria-label=\"breadcrumb\">"):src.index("<nav aria-label=\"breadcrumb\">") + 600])   # Brotkruemel bleiben fuer beide Gruppen gleich


if __name__ == "__main__":
    unittest.main()
