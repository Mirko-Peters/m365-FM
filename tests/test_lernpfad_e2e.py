"""Lernpfad-Abschlusstest: die drei Teile passen zusammen (Fragen-Werkzeug, Seiten, Worker).
- Die Testseiten mit der echten data/pillar_quiz.json betten alle Fragen-IDs ein, aber nie Lösungen oder Erklärungen.
- data/pillar_quiz_keys.enc ist kein Klartext.
- Konstanten (3 je Leitfaden, 80 %, 3 Versuche) und das Fragen-ID-Format sind in site_pillars.py und worker/src/learnquiz.js gleich.
- Der Push-Body von tools/pillar_quiz.py besteht die Prüfung des Workers (qid beginnt mit "<pillar>-", answer 0-3).
- Certopus-IDs in data/pillars.json (Doku) = CERTOPUS_PATHS in worker/wrangler.toml; Kursname im Worker-Rückfall = CERTOPUS_PATHS.
Den Ablauf Start -> Abgabe -> Zertifikat gegen den echten Worker prüft worker/test/learnquiz_e2e.test.mjs."""
import json
import re
import sys
import tomllib
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(Path(__file__).resolve().parent))
import site_pillars as S  # noqa: E402
import pillar_quiz as PQ  # noqa: E402
import test_pillar_quiz_pages as PAGES  # noqa: E402

QUIZ = json.loads((ROOT / "data" / "pillar_quiz.json").read_text("utf-8"))
WORKER_JS = (ROOT / "worker" / "src" / "learnquiz.js").read_text("utf-8")
WRANGLER = tomllib.loads((ROOT / "worker" / "wrangler.toml").read_text("utf-8"))
PID = QUIZ["path"]


def js_const(name):
    m = re.search(rf"\b{name}\s*=\s*(\d+)", WORKER_JS)
    return int(m.group(1)) if m else None


class RealQuizPages(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.files, cls.sm, cls.pages = PAGES.build(QUIZ)

    def test_all_ids_embedded_without_answers(self):
        for lang, rel in (("en", f"learn/path/{PID}/test/index.html"), ("de", f"de/learn/path/{PID}/test/index.html")):
            html = self.files[rel]
            data = PAGES.embedded(html)
            self.assertIsNotNone(data, rel)
            want = [q["id"] for p in S.order() for q in (QUIZ["pillars"].get(p["id"]) or {}).get(lang, [])]
            got = [q["id"] for g in data["groups"] for q in g["qs"]]
            self.assertEqual(got, want, f"{lang}: Fragen-IDs der Seite != data/pillar_quiz.json")
            self.assertEqual([g["id"] for g in data["groups"]], [p for p in (x["id"] for x in S.order()) if p in QUIZ["pillars"]])
            for g in data["groups"]:
                self.assertEqual(set(g), {"id", "t", "u", "qs"})
                for q in g["qs"]: self.assertEqual(set(q), {"id", "q", "opts"}); self.assertEqual(len(q["opts"]), 4)
            blob = re.search(r'<script type="application/json" id="lq-data">(.*?)</script>', html, re.S).group(1)
            for bad in ('"a":', '"why"', '"answer"', '"why_en"', '"why_de"', '"correct"'): self.assertNotIn(bad, blob)
            cfg = PAGES.config(html)
            self.assertEqual(cfg["path"], PID); self.assertEqual(cfg["qlang"], lang); self.assertEqual(cfg["max"], js_const("MAX_ATTEMPTS"))
            self.assertFalse([x for x in self.sm if f"/{PID}/test/" in repr(x)], "Testseite in der Sitemap")
            self.assertTrue(self.pages[f"{PAGES.BASE}/{'de/' if lang == 'de' else ''}learn/path/{PID}/test/"]["noindex"])

    def test_box_links_test_page(self):
        self.assertIn(f'href="{PAGES.BASE}/learn/path/{PID}/test/"', self.files[f"learn/path/{PID}/index.html"])
        self.assertIn(f'href="{PAGES.BASE}/de/learn/path/{PID}/test/"', self.files[f"de/learn/path/{PID}/index.html"])
        n, need = S.quiz_numbers(S.quiz_groups(QUIZ, "en", lambda p: ""))
        self.assertEqual((n, need), (30, 24))


class Consistency(unittest.TestCase):
    def test_public_file_has_no_answers(self):
        for pid, v in QUIZ["pillars"].items():
            self.assertEqual([q["id"] for q in v["en"]], [q["id"] for q in v["de"]], pid)
            for lang in ("en", "de"):
                for q in v[lang]: self.assertEqual(set(q), {"id", "q", "opts"}, q["id"])

    def test_keys_file_is_encrypted(self):
        blob = (ROOT / "data" / "pillar_quiz_keys.enc").read_bytes().strip()
        self.assertTrue(blob.startswith(b"gAAAAA"), "kein Fernet-Token")
        for bad in (b"answer", b"why_en", b"qid", b"lean-manufacturing"): self.assertNotIn(bad, blob)

    def test_constants_match_worker(self):
        self.assertEqual(S.PER_PILLAR, js_const("PER_PILLAR"))
        self.assertEqual(S.PASS_PCT, js_const("PASS_PCT"))
        self.assertEqual(S.MAX_TRIES, js_const("MAX_ATTEMPTS"))

    def test_push_body_passes_worker_rules(self):
        qid_rx = re.compile(re.search(r"const QID_RX = /\^(.*?)\$/;", WORKER_JS).group(1))
        path_rx = re.compile(re.search(r"const PATH_RX = /\^(.*?)\$/;", WORKER_JS).group(1))
        doc = {"path": PID, "keys": [{"qid": q["id"], "path": PID, "pillar": pid, "answer": i % 4, "why_en": "e", "why_de": "d", "ref": "r"}
                                     for pid, v in QUIZ["pillars"].items() for i, q in enumerate(v["en"])]}
        body = PQ.push(doc, post=lambda b: b)
        self.assertEqual(set(body), {"path", "keys"})
        self.assertTrue(path_rx.fullmatch(body["path"]))
        self.assertEqual(len(body["keys"]), sum(len(v["en"]) for v in QUIZ["pillars"].values()))
        for k in body["keys"]:
            self.assertEqual(set(k), {"qid", "pillar", "answer", "why_en", "why_de"})
            self.assertTrue(qid_rx.fullmatch(k["qid"]) and path_rx.fullmatch(k["pillar"]) and k["qid"].startswith(k["pillar"] + "-"), k["qid"])
            self.assertIsInstance(k["answer"], int); self.assertIn(k["answer"], range(4))
        for q in (q for v in QUIZ["pillars"].values() for q in v["en"]): self.assertIsNotNone(S._clean_q(q), q["id"])   # Seite nimmt jede Frage an

    def test_certopus_config_consistent(self):
        cp = json.loads(WRANGLER["vars"]["CERTOPUS_PATHS"])[PID]
        doc = S.registry()["path"]["certopus"]
        for k in ("org", "event", "category"): self.assertEqual(doc[k], cp[k], k)
        for lang in ("en", "de"):
            m = re.search(rf'"{re.escape(PID)}":\s*\{{\s*en:\s*"([^"]+)",\s*de:\s*"([^"]+)"', WORKER_JS)
            self.assertIsNotNone(m)
            self.assertEqual({"en": m.group(1), "de": m.group(2)}[lang], cp["course"][lang])
        self.assertEqual(WRANGLER["vars"]["CERTOPUS_ON"], "0")
        self.assertEqual(S.registry()["path"]["id"], PID)

    def test_certopus_doc_names_tools(self):
        md = (ROOT / "CERTOPUS.md").read_text("utf-8")
        for s in ("tools/certopus_ids.py", "certopus-ids.yml", "CERTOPUS_PATHS", "CERTOPUS_ON", "CERTOPUS_API_KEY", "tools/pillar_quiz.py push", "/api/internal/learn-quiz"):
            self.assertIn(s, md)


if __name__ == "__main__":
    unittest.main()
