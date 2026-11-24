"""Fragen fuer den Abschlusstest des Lernpfads (tools/pillar_quiz.py), ohne Netz: Pruefregeln, oeffentliches Format ohne Loesung,
gleiche IDs in en/de, Verschluesselung der Schluessel, Push-Body, IDs wachsen nur (keine Umnummerierung), ganzer Lauf mit Attrappen.
Lauf: python3 -m unittest tests.test_pillar_quiz"""
import base64
import io
import json
import os
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tools"))
import pillar_quiz as PQ  # noqa: E402
import site_pillars as PIL  # noqa: E402

GOOD = {"q": "What does the value stream map make visible first?", "opts": ["Waiting times between steps", "Machine colours", "Employee birthdays", "Office layout"],
        "a": 0, "why": "The guide says the map shows flow and waiting times.", "ref": "What a value stream map shows"}


def cand(i, ref="A"):
    return {"q": f"Question number {i} about the guide content?", "opts": [f"opt {i} a", f"opt {i} b", f"opt {i} c", f"opt {i} d"], "a": i % 4,
            "why": f"Because of section {ref}.", "ref": ref}


class Rules(unittest.TestCase):
    def test_good_item(self):
        c, why = PQ.check_item(dict(GOOD))
        self.assertEqual(why, ""); self.assertEqual(c["a"], 0); self.assertEqual(len(c["opts"]), 4)

    def test_rejects(self):
        bad = [
            {**GOOD, "opts": GOOD["opts"][:3]},
            {**GOOD, "opts": GOOD["opts"][:3] + [" "]},
            {**GOOD, "opts": ["Same", "same", "Other", "Third"]},
            {**GOOD, "opts": GOOD["opts"][:3] + ["All of the above"]},
            {**GOOD, "a": 4}, {**GOOD, "a": -1}, {**GOOD, "a": True}, {**GOOD, "a": "1"},
            {**GOOD, "q": ""}, {**GOOD, "q": "x" * 400}, {**GOOD, "why": ""},
            {**GOOD, "opts": GOOD["opts"][:3] + ["x" * 200]}, "kein objekt",
        ]
        for b in bad:
            c, why = PQ.check_item(b)
            self.assertIsNone(c, b); self.assertTrue(why)

    def test_translation(self):
        src = PQ.check_item(dict(GOOD))[0]
        ok, _ = PQ.check_translation(src, {"q": "Was zeigt die Wertstromanalyse zuerst?", "opts": ["Wartezeiten", "Maschinenfarben", "Geburtstage", "Bueroplan"], "why": "Weil."})
        self.assertEqual(ok["opts"][0], "Wartezeiten")
        for b in ({"q": "x?", "opts": ["a", "b", "c"], "why": "w"}, {"q": "x?", "opts": ["a", "", "c", "d"], "why": "w"},
                  {"q": "x?", "opts": ["a", "a", "c", "d"], "why": "w"}, {"q": "", "opts": ["a", "b", "c", "d"], "why": "w"}, None):
            self.assertIsNone(PQ.check_translation(src, b)[0], b)

    def test_rebalance_keeps_answer_text(self):
        for i in range(8):
            c = PQ.check_item(cand(i))[0]; r = PQ.rebalance("value-stream-mapping", i, c)
            self.assertEqual(r["opts"][r["a"]], c["opts"][c["a"]]); self.assertEqual(sorted(r["opts"]), sorted(c["opts"]))
        pos = {PQ.rebalance("x", i, PQ.check_item(cand(0))[0])["a"] for i in range(4)}
        self.assertEqual(pos, {0, 1, 2, 3})

    def test_parse_json(self):
        self.assertEqual(PQ.parse_json('```json\n[{"q": 1}]\n```'), [{"q": 1}])
        self.assertEqual(PQ.parse_json('Here: {"answers": [{"n": 1, "a": 2}]} done', dict), {"answers": [{"n": 1, "a": 2}]})
        self.assertIsNone(PQ.parse_json("nope"))

    def test_select_prefers_distinct_sections(self):
        cs = [cand(1, "A"), cand(2, "A"), cand(3, "B"), cand(4, "C")]
        self.assertEqual([c["q"] for c in PQ.select(cs, 3)], [cs[0]["q"], cs[2]["q"], cs[3]["q"]])

    def test_article_text_without_urls(self):
        p = PIL.order()[0]; t = PQ.article_text(p)
        self.assertGreater(len(t), 10000); self.assertNotIn("](http", t)


class Crypto(unittest.TestCase):
    def test_hkdf_fernet_roundtrip(self):
        from cryptography.fernet import Fernet
        from cryptography.hazmat.primitives import hashes
        from cryptography.hazmat.primitives.kdf.hkdf import HKDF
        f = PQ.fernet("geheim")
        doc = {"path": "manufacturing-excellence", "keys": [{"qid": "lean-manufacturing-1", "answer": 2}]}
        blob = PQ.encrypt_keys(doc, f)
        self.assertNotIn(b"lean-manufacturing-1", blob)
        raw = HKDF(algorithm=hashes.SHA256(), length=32, salt=b"m365fm", info=b"pillar-quiz").derive(b"geheim")   # Ableitung laut Spezifikation
        self.assertEqual(json.loads(Fernet(base64.urlsafe_b64encode(raw)).decrypt(blob)), doc)
        with self.assertRaises(SystemExit): PQ.decrypt_keys(blob, PQ.fernet("anders"))
        self.assertIsNone(PQ.fernet(""))


class Output(unittest.TestCase):
    def pub(self):
        return {"pillars": {"value-stream-mapping": {"en": [{"id": "value-stream-mapping-1", "q": "Q?", "opts": list("abcd"), "a": 1, "why": "w"}],
                                                     "de": [{"id": "value-stream-mapping-1", "q": "F?", "opts": list("efgh"), "a": 1, "why": "w"}]},
                            "lean-manufacturing": {"en": [{"id": "lean-manufacturing-1", "q": "Q?", "opts": list("abcd")}],
                                                   "de": [{"id": "lean-manufacturing-1", "q": "F?", "opts": list("efgh")}]}}}

    def test_public_without_answers_and_in_path_order(self):
        out = PQ.public_doc(self.pub(), "2026-11-24")
        self.assertEqual(out["path"], "manufacturing-excellence"); self.assertEqual(out["version"], "2026-11-24")
        self.assertEqual(list(out["pillars"]), ["lean-manufacturing", "value-stream-mapping"])
        for v in out["pillars"].values():
            for l in ("en", "de"):
                for x in v[l]: self.assertEqual(set(x), {"id", "q", "opts"})
        s = json.dumps(out)
        self.assertNotIn('"a":', s); self.assertNotIn('"why":', s); self.assertNotIn('"answer":', s)

    def test_push_body(self):
        doc = {"path": "manufacturing-excellence", "keys": [{"qid": "x-1", "path": "manufacturing-excellence", "pillar": "x", "answer": 3, "why_en": "e", "why_de": "d", "ref": "R"}]}
        self.assertEqual(PQ.push_body(doc), {"path": "manufacturing-excellence", "keys": [{"qid": "x-1", "pillar": "x", "answer": 3, "why_en": "e", "why_de": "d"}]})
        seen = []
        PQ.push(doc, post=lambda b: seen.append(b) or {"ok": True})
        self.assertEqual(seen[0]["keys"][0]["answer"], 3)

    def test_next_n(self):
        self.assertEqual(PQ.next_n("lean", ["lean-1", "lean-7", "lean-manufacturing-9", "x-3"]), 8)
        self.assertEqual(PQ.next_n("lean", []), 1)


class FullRun(unittest.TestCase):
    """Ganzer Lauf mit Attrappen statt API: Dateien, IDs, Verschluesselung, Wachstum ohne Umnummerierung, keine Loesung im Log."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); d = Path(self.tmp.name)
        self.p = [patch.object(PQ, "PUBLIC", d / "pillar_quiz.json"), patch.object(PQ, "KEYS", d / "keys.enc"), patch.object(PQ, "OPEN", d / "open.json"),
                  patch.dict(os.environ, {"CRON_KEY": "k", "ANTHROPIC_API_KEY": "x", "PILLAR_QUIZ_CHECK_DIR": str(d / "check"), "COMMUNITY_API": ""}),
                  patch("ai_gateway.check_budget", lambda *a, **k: True), patch("ai_gateway.report_usage", lambda *a, **k: None)]
        for x in self.p: x.start()
        self.batches = {}

    def tearDown(self):
        for x in self.p: x.stop()
        self.tmp.cleanup()

    def fake_api(self, verify_wrong=()):
        def submit(reqs):
            bid = f"b{len(self.batches)}"; self.batches[bid] = reqs; return bid

        def results(b):
            out = []
            for r in self.batches[b["id"]]:
                cid = r["custom_id"]; kind, pid = cid.split("__", 1); u = {"input_tokens": 1000, "output_tokens": 100}
                if kind == "gen":
                    text = json.dumps([cand(i, ref=f"S{i % 5}") for i in range(PQ.CANDIDATES)])
                elif kind == "ver":
                    qs = json.loads(r["params"]["messages"][0]["content"].split("Questions:\n", 1)[1])
                    # Attrappe "kennt" die Loesung ueber den Optionstext (opt i a/b/c/d -> Index i % 4 vor dem Tausch)
                    ans = []
                    for q in qs:
                        i = int(q["q"].split()[2]); right = f"opt {i} {'abcd'[i % 4]}"; a = q["opts"].index(right)
                        ans.append({"n": q["n"], "a": (a + 1) % 4 if i in verify_wrong else a})
                    text = json.dumps({"answers": ans})
                else:
                    qs = json.loads(r["params"]["messages"][0]["content"])
                    text = json.dumps([{"n": q["n"], "q": "DE " + q["q"], "opts": ["DE " + o for o in q["opts"]], "why": "DE " + q["why"]} for q in qs])
                out.append({"custom_id": cid, "result": {"type": "succeeded", "message": {"content": [{"type": "text", "text": text}], "usage": u, "stop_reason": "end_turn"}}})
            return out
        return [patch.object(PQ, "submit", submit), patch.object(PQ, "wait", lambda bid: {"id": bid}), patch.object(PQ, "results", results),
                patch.object(PQ, "do_push", lambda strict: self.pushed.append(True))]

    def run_tool(self, args, verify_wrong=()):
        self.pushed = []
        ps = self.fake_api(verify_wrong)
        for x in ps: x.start()
        try:
            buf = io.StringIO()
            with redirect_stdout(buf): PQ.main(args)
            return buf.getvalue()
        finally:
            for x in ps: x.stop()

    def test_run_writes_public_and_encrypted_keys(self):
        log = self.run_tool(["run", "--pillars", "lean-manufacturing,value-stream-mapping"], verify_wrong={0, 3})
        pub = json.loads(PQ.PUBLIC.read_text())
        self.assertEqual(set(pub["pillars"]), {"lean-manufacturing", "value-stream-mapping"})
        for pid, v in pub["pillars"].items():
            self.assertEqual(len(v["en"]), PQ.KEEP)
            self.assertEqual([x["id"] for x in v["en"]], [x["id"] for x in v["de"]])
            self.assertEqual([x["id"] for x in v["en"]], [f"{pid}-{n}" for n in range(1, PQ.KEEP + 1)])
            self.assertTrue(all(x["opts"][0].startswith("DE ") for x in v["de"]))
            qs = " ".join(x["q"] for x in v["en"])
            self.assertNotIn("number 0 ", qs); self.assertNotIn("number 3 ", qs)   # Pruefung hat abweichende Antworten verworfen
        raw = PQ.PUBLIC.read_text(); self.assertNotIn('"a":', raw); self.assertNotIn("why", raw)
        blob = PQ.KEYS.read_bytes(); self.assertNotIn(b"lean-manufacturing-1", blob)
        keys = PQ.decrypt_keys(blob.strip(), PQ.fernet("k"))["keys"]
        self.assertEqual(len(keys), 2 * PQ.KEEP)
        en = {x["id"]: x for v in pub["pillars"].values() for x in v["en"]}
        for k in keys:
            self.assertEqual(en[k["qid"]]["opts"][k["answer"]].split()[-1], "abcd"[int(en[k["qid"]]["q"].split()[2]) % 4])
            self.assertTrue(k["why_de"].startswith("DE ")); self.assertEqual(k["path"], "manufacturing-excellence")
        self.assertFalse(PQ.OPEN.exists()); self.assertEqual(self.pushed, [True])
        chk = Path(os.environ["PILLAR_QUIZ_CHECK_DIR"])
        self.assertTrue((chk / "check.enc").exists()); self.assertFalse((chk / "check.json").exists())
        self.assertNotIn('"answer"', (chk / "review.md").read_text())
        self.assertNotIn('"answer"', log); self.assertNotIn("why_en", log)

    def test_rerun_grows_without_renumbering(self):
        self.run_tool(["run", "--pillars", "lean-manufacturing"], verify_wrong={0, 1, 2, 3, 4})   # nur 3 bestehen -> unter MIN
        pub = json.loads(PQ.PUBLIC.read_text()); first = [x["id"] for x in pub["pillars"]["lean-manufacturing"]["en"]]
        self.assertEqual(first, ["lean-manufacturing-1", "lean-manufacturing-2", "lean-manufacturing-3"])
        q1 = pub["pillars"]["lean-manufacturing"]["en"][0]["q"]
        self.run_tool(["run", "--pillars", "lean-manufacturing"])
        pub = json.loads(PQ.PUBLIC.read_text()); ids = [x["id"] for x in pub["pillars"]["lean-manufacturing"]["en"]]
        self.assertEqual(ids[:3], first); self.assertEqual(ids[3:], ["lean-manufacturing-4", "lean-manufacturing-5", "lean-manufacturing-6"])
        self.assertEqual(pub["pillars"]["lean-manufacturing"]["en"][0]["q"], q1)
        self.assertIn("do not repeat", self.batches["b2"][0]["params"]["messages"][0]["content"])   # zweiter Lauf: bestehende Fragen als "nicht wiederholen"
        keys = PQ.decrypt_keys(PQ.KEYS.read_bytes().strip(), PQ.fernet("k"))["keys"]
        self.assertEqual([k["qid"] for k in keys], ids)
        log = self.run_tool(["run", "--pillars", "lean-manufacturing"])   # mindestens MIN: nichts zu tun, kein Batch
        self.assertIn("nichts zu tun", log); self.assertEqual(len(self.batches), 4)

    def test_requests_shape(self):
        items = [it for it in PQ.plan(()) if it[0]["id"] == "manufacturing-kpis"]
        g = PQ.gen_requests(items)[0]["params"]
        self.assertEqual(g["model"], "claude-sonnet-5-5"); self.assertEqual(g["thinking"], {"type": "between_tools"})
        rs = PQ.phase2_requests(items, {"manufacturing-kpis": [PQ.check_item(cand(1))[0]]})
        ver = next(r for r in rs if r["custom_id"].startswith("ver__"))["params"]; tr = next(r for r in rs if r["custom_id"].startswith("tr__"))["params"]
        self.assertEqual(ver["model"], "claude-haiku-5-5"); self.assertNotIn('"a":', ver["messages"][0]["content"])   # Pruefer sieht die Loesung nicht
        self.assertNotIn('"a":', tr["messages"][0]["content"]); self.assertEqual(tr["thinking"], {"type": "disabled"})

    def test_run_without_cron_key_refuses_when_keys_exist(self):
        PQ.KEYS.write_bytes(b"x")
        with patch.dict(os.environ, {"CRON_KEY": ""}), self.assertRaises(SystemExit): PQ.main(["run"])

    def test_plan_budget_under_cap(self):
        g, h = PQ.report_plan(PQ.plan(())) if PQ.plan(()) else (0, 0)
        self.assertLess(PQ.eur(g + h), 2.0)


if __name__ == "__main__":
    unittest.main()
