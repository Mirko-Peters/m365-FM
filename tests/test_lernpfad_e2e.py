"""Lernpfad-Abschlusstest: die drei Teile passen zusammen (Fragen-Werkzeug, Seiten, Worker).
- Die Testseiten mit der echten data/pillar_quiz.json betten alle Fragen-IDs ein, aber nie Lösungen oder Erklärungen.
- data/pillar_quiz_keys.enc ist kein Klartext.
- Konstanten (3 je Leitfaden, 80 %, 3 Versuche) und das Fragen-ID-Format sind in site_pillars.py und worker/src/learnquiz.js gleich.
- Der Push-Body von tools/pillar_quiz.py besteht die Prüfung des Workers (qid beginnt mit "<pillar>-", answer 0-3).
- Certopus-IDs in data/pillars.json (Doku) = CERTOPUS_PATHS in worker/wrangler.toml; Kursname im Worker-Rückfall = CERTOPUS_PATHS = Titel des Lernpfads (en/de).
Den Ablauf Start -> Abgabe -> Zertifikat gegen den echten Worker prüft worker/test/learnquiz_e2e.test.mjs."""
import base64
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
                self.assertEqual(set(g), {"id", "t", "u", "qs"})   # Feld src (Vertiefung) erreicht die Seite nicht
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
        gr = S.quiz_groups(QUIZ, "en", lambda p: "")
        n, need = S.quiz_numbers(gr)
        k = S.per_group(len(gr))
        self.assertEqual((n, need), (k * len(gr), -(-k * len(gr) * 80 // 100)))
        if len(gr) == 10: self.assertEqual((n, need), (30, 24), "vor dem Fragenlauf der neuen Leitfäden: Test wie bisher")


class Consistency(unittest.TestCase):
    def test_public_file_has_no_answers(self):
        for pid, v in QUIZ["pillars"].items():
            self.assertEqual([q["id"] for q in v["en"]], [q["id"] for q in v["de"]], pid)
            for lang in ("en", "de"):
                for q in v[lang]: self.assertEqual(set(q) - {"src"}, {"id", "q", "opts"}, q["id"])
            self.assertEqual([q.get("src") for q in v["en"]], [q.get("src") for q in v["de"]], pid)
            subs = {c["id"] for c in S.clusters_of(pid)}
            for q in v["en"]:
                if q.get("src"): self.assertIn(q["src"], subs, f"{q['id']}: src ist keine Vertiefung von {pid}")
        for h in QUIZ.get("hold") or []:
            self.assertTrue(S.by_id(h) or any(c["id"] == h for c in S.clusters()), f"hold: {h} unbekannt")

    def test_ids_complete_unique_and_never_reused(self):
        """Echtdaten: jeder Leitfaden des Pfads hat mindestens PQ.MIN Fragen (en und de), IDs sind pfadweit eindeutig, keine aktive ID steht
        unter retired, und neue IDs liegen ueber der hoechsten stillgelegten (der Worker blendet nur hoehere Nummern als die bekannten aus)."""
        num = lambda pid, qid: int(re.fullmatch(re.escape(pid) + r"-(\d+)", qid).group(1))
        order = [p["id"] for p in S.order()]
        have = list(QUIZ["pillars"])
        self.assertEqual(have, [p for p in order if p in have], "Reihenfolge wie site_pillars.order(); Leitfäden ohne Fragen (vor dem Lauf) fehlen")
        missing = [p for p in order if p not in have]
        self.assertTrue(set(missing) <= set(QUIZ.get("hold") or []), f"Leitfäden ohne Fragen müssen auf der Freigabeliste stehen: {missing}")
        retired, seen = QUIZ.get("retired") or {}, []
        for pid in have:
            v = QUIZ["pillars"][pid]
            for lang in ("en", "de"): self.assertGreaterEqual(len([q for q in v[lang] if not q.get("src")]), PQ.MIN, f"{pid} {lang}")   # eigene Fragen ohne Vertiefungen
            ids = [q["id"] for q in v["en"]]
            self.assertTrue(all(num(pid, q) > 0 for q in ids), pid)   # Form <pillar>-<n>
            old = set(retired.get(pid) or [])
            self.assertFalse(set(ids) & old, f"{pid}: aktive ID unter retired")
            if old: self.assertGreater(min(num(pid, q) for q in ids), max(num(pid, q) for q in old), f"{pid}: ID unter der hoechsten stillgelegten (wiederverwendet?)")
            seen += ids + sorted(old)
        self.assertEqual(len(seen), len(set(seen)), "IDs pfadweit eindeutig")
        self.assertFalse(set(retired) - set(order), "retired nur fuer Leitfaeden des Pfads")
        self.assertEqual(len(order), 20)

    def test_keys_file_is_encrypted(self):
        blob = (ROOT / "data" / "pillar_quiz_keys.enc").read_bytes().strip()
        self.assertTrue(blob.startswith(b"gAAAAA"), "kein Fernet-Token")
        self.assertRegex(blob, rb"^[A-Za-z0-9_=-]+$", "nur Base64url, kein Klartext")
        # Klartext-Marken in Anfuehrungszeichen bzw. lang genug: kurze Woerter wie qid stehen zufaellig im Base64 (ca. 15 % je 40 KB)
        for bad in (b'"answer"', b"why_en", b'"qid"', b"lean-manufacturing"): self.assertNotIn(bad, blob)
        self.assertNotIn(b'"qid"', base64.urlsafe_b64decode(blob + b"=" * (-len(blob) % 4)))

    def test_constants_match_worker(self):
        self.assertEqual(S.PER_PILLAR, js_const("PER_PILLAR"))
        for k in ("QUIZ_TARGET", "PER_MIN", "PER_MAX"): self.assertEqual(getattr(S, k), js_const(k), k)
        self.assertIn("Math.min(PER_MAX, Math.max(PER_MIN, Math.ceil(QUIZ_TARGET / Math.max(1, n))))", WORKER_JS, "gleiche Formel wie site_pillars.per_group")
        self.assertIn("pick(l, k)", WORKER_JS)
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
            self.assertEqual(S.registry()["path"]["title"][lang], cp["course"][lang], f"Kursname = Titel des Lernpfads ({lang})")
        self.assertEqual(WRANGLER["vars"]["CERTOPUS_ON"], "1")
        self.assertEqual(S.registry()["path"]["id"], PID)

    def test_certopus_doc_names_tools(self):
        md = (ROOT / "CERTOPUS.md").read_text("utf-8")
        for s in ("tools/certopus_ids.py", "certopus-ids.yml", "CERTOPUS_PATHS", "CERTOPUS_ON", "CERTOPUS_API_KEY", "tools/pillar_quiz.py push", "/api/internal/learn-quiz"):
            self.assertIn(s, md)


if __name__ == "__main__":
    unittest.main()
