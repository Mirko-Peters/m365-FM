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

OLD10 = [p for p in PIL.order() if p["slug"].get("de")]   # die ersten 10 Leitfaeden (Stand vor dem Kursausbau): Grundlage der Laeufe mit Attrappen
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
        sec = PQ.order_secret("k")
        for i in range(8):
            c = PQ.check_item(cand(i))[0]; r = PQ.rebalance("value-stream-mapping", i, c, sec)
            self.assertEqual(r["opts"][r["a"]], c["opts"][c["a"]]); self.assertEqual(sorted(r["opts"]), sorted(c["opts"]))
            self.assertEqual(r, PQ.rebalance("value-stream-mapping", i, c, sec), "wiederholbar (collect)")
        pos = {PQ.rebalance("x", i, PQ.check_item(cand(i))[0], sec)["a"] for i in range(40)}
        self.assertEqual(pos, {0, 1, 2, 3})

    def test_rebalance_position_is_secret(self):
        """Die Position haengt am geheimen Schluessel, nicht an (oeffentlicher Konstante + Index) % 4 wie frueher (sha1 der Leitfaden-ID)."""
        pid, cs = "lean-manufacturing", [PQ.check_item(cand(i))[0] for i in range(24)]
        a = [PQ.rebalance(pid, i, c, PQ.order_secret("key-a"))["a"] for i, c in enumerate(cs)]
        b = [PQ.rebalance(pid, i, c, PQ.order_secret("key-b"))["a"] for i, c in enumerate(cs)]
        self.assertNotEqual(a, b)
        for seq in (a, b):
            self.assertFalse(any(all(seq[i] == (c0 + i) % 4 for i in range(len(seq))) for c0 in range(4)), seq)
        with patch.dict(os.environ, {"CRON_KEY": "key-a", "ANTHROPIC_API_KEY": "x"}): self.assertEqual(PQ.order_secret(), PQ.order_secret("key-a"))
        with patch.dict(os.environ, {"CRON_KEY": "", "ANTHROPIC_API_KEY": ""}), self.assertRaises(SystemExit): PQ.order_secret()

    def test_perm4_is_permutation(self):
        sec, seen = PQ.order_secret("k"), set()
        for i in range(60):
            p = PQ.perm4(sec, f"kaizen-{i}", f"q{i}"); self.assertEqual(sorted(p), [0, 1, 2, 3]); seen.add(tuple(p))
        self.assertGreater(len(seen), 10)

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


class _RunBase(unittest.TestCase):
    """Attrappen statt API und temporaere Dateien fuer FullRun und ClusterRun."""
    LEGACY = True

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); d = Path(self.tmp.name)
        self.p = [patch.object(PQ, "PUBLIC", d / "pillar_quiz.json"), patch.object(PQ, "KEYS", d / "keys.enc"), patch.object(PQ, "OPEN", d / "open.json"),
                  patch.dict(os.environ, {"CRON_KEY": "k", "ANTHROPIC_API_KEY": "x", "PILLAR_QUIZ_CHECK_DIR": str(d / "check"), "COMMUNITY_API": "",
                                              "GITHUB_REF_NAME": ""}),
                  patch("ai_gateway.check_budget", lambda *a, **k: True), patch("ai_gateway.report_usage", lambda *a, **k: None)]
        if self.LEGACY:   # Laeufe wie vor dem Kursausbau: 10 Leitfaeden ohne Vertiefungen (die neuen prueft ClusterRun)
            self.p += [patch.object(PIL, "order", lambda: list(OLD10)), patch.object(PIL, "clusters_of", lambda pid: [])]
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

    def fake_regen(self, verify_wrong=()):
        """Attrappe fuer regen: neue, voneinander verschiedene Fragen; dazu gezielt Dubletten (Takt-Zeit in zwei Leitfaeden), eine Frage wie eine alte
        (Text) und eine mit zwei alten Optionen. self.truth: Fragetext -> richtige Option (fuer die Pruef-Attrappe)."""
        import hashlib
        old = json.loads(PQ.PUBLIC.read_text())["pillars"]
        self.truth = {}

        def submit(reqs):
            bid = f"b{len(self.batches)}"; self.batches[bid] = reqs; return bid

        def gen(pid):
            out = []
            for i in range(PQ.REGEN_CANDIDATES):
                h = hashlib.sha256(f"{pid}|{i}".encode()).hexdigest()
                q = f"Which {h[:24]} claim about {h[24:40]} holds?"; opts = [f"{h[40:48]} {x}" for x in "wxyz"]
                c = {"q": q, "opts": opts, "a": i % 4, "why": f"Section {h[:6]}.", "ref": f"S{i % 4}", "topic": f"topic {h[:8]}"}
                if pid == "lean-manufacturing" and i == 0: c["topic"] = "takt time"
                if pid == "manufacturing-kpis" and i == 0: c["topic"] = "The Takt times"
                if pid == "manufacturing-kpis" and i == 1: c["q"] = old[pid]["en"][2]["q"]
                if pid == "shop-floor-management" and i == 1: c["opts"] = old[pid]["en"][0]["opts"][:2] + opts[2:]
                self.truth[c["q"]] = c["opts"][c["a"]]; out.append(c)
            return out

        def results(b):
            out = []
            for r in self.batches[b["id"]]:
                cid = r["custom_id"]; kind, pid = cid.split("__", 1); u = {"input_tokens": 1000, "output_tokens": 100}
                if kind == "gen":
                    text = json.dumps(gen(pid))
                elif kind == "ver":
                    qs = json.loads(r["params"]["messages"][0]["content"].split("Questions:\n", 1)[1])
                    text = json.dumps({"answers": [{"n": q["n"], "a": (q["opts"].index(self.truth[q["q"]]) + (1 if q["n"] - 1 in verify_wrong else 0)) % 4} for q in qs]})
                else:
                    qs = json.loads(r["params"]["messages"][0]["content"])
                    text = json.dumps([{"n": q["n"], "q": "DE " + q["q"], "opts": ["DE " + o for o in q["opts"]], "why": "DE " + q["why"]} for q in qs])
                out.append({"custom_id": cid, "result": {"type": "succeeded", "message": {"content": [{"type": "text", "text": text}], "usage": u, "stop_reason": "end_turn"}}})
            return out
        return [patch.object(PQ, "submit", submit), patch.object(PQ, "wait", lambda bid: {"id": bid}), patch.object(PQ, "results", results),
                patch.object(PQ, "do_push", lambda strict: self.pushed.append(True))]

    def run_tool(self, args, verify_wrong=(), regen=False):
        self.pushed = []
        ps = self.fake_regen(verify_wrong) if regen else self.fake_api(verify_wrong)
        for x in ps: x.start()
        try:
            buf = io.StringIO()
            with redirect_stdout(buf): PQ.main(args)
            return buf.getvalue()
        finally:
            for x in ps: x.stop()

class FullRun(_RunBase):
    """Ganzer Lauf mit Attrappen statt API: Dateien, IDs, Verschluesselung, Wachstum ohne Umnummerierung, keine Loesung im Log."""

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
        self.assertFalse(PQ.OPEN.exists()); self.assertEqual(self.pushed, [], "nicht main: kein Push an den Live-Worker")
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

    def test_auto_push_only_on_main(self):
        with patch.dict(os.environ, {"GITHUB_REF_NAME": "main"}):
            self.run_tool(["run", "--pillars", "lean-manufacturing"])
        self.assertEqual(self.pushed, [True])
        with patch.dict(os.environ, {"GITHUB_REF_NAME": "claude/lernpfad-quiz-fragen"}), patch.object(PQ, "do_push", lambda s: self.fail("Push auf Arbeitszweig")):
            buf = io.StringIO()
            with redirect_stdout(buf): self.assertFalse(PQ.auto_push())
            self.assertIn("worker.yml", buf.getvalue())

    def test_reshuffle_once_keeps_ids_and_answers(self):
        """Altbestand (ohne Marke "order"): Optionen in en und de gleich neu ordnen, Loesung zeigt weiter auf dieselbe Option, IDs bleiben, nur einmal."""
        self.run_tool(["run", "--pillars", "lean-manufacturing,value-stream-mapping"])
        f = PQ.fernet("k"); doc = PQ.decrypt_keys(PQ.KEYS.read_bytes().strip(), f); doc.pop("order")
        PQ.KEYS.write_bytes(PQ.encrypt_keys(doc, f) + b"\n")
        before = json.loads(PQ.PUBLIC.read_text()); right = {}
        for k in doc["keys"]:
            v = before["pillars"][k["pillar"]]
            right[k["qid"]] = tuple(next(x for x in v[l] if x["id"] == k["qid"])["opts"][k["answer"]] for l in PQ.LANGS)
        buf = io.StringIO()
        with redirect_stdout(buf): self.assertEqual(PQ.main(["reshuffle"]), None)
        self.assertNotIn('"answer"', buf.getvalue())
        after = json.loads(PQ.PUBLIC.read_text()); doc2 = PQ.decrypt_keys(PQ.KEYS.read_bytes().strip(), f)
        self.assertEqual(doc2["order"], PQ.ORDER)
        self.assertEqual([k["qid"] for k in doc2["keys"]], [k["qid"] for k in doc["keys"]])
        for pid in before["pillars"]:
            for l in PQ.LANGS: self.assertEqual([x["id"] for x in after["pillars"][pid][l]], [x["id"] for x in before["pillars"][pid][l]])
        moved = 0
        for k in doc2["keys"]:
            v = after["pillars"][k["pillar"]]
            xs = [next(x for x in v[l] if x["id"] == k["qid"]) for l in PQ.LANGS]
            self.assertEqual(tuple(x["opts"][k["answer"]] for x in xs), right[k["qid"]])
            ob = next(x for x in before["pillars"][k["pillar"]]["en"] if x["id"] == k["qid"])["opts"]
            self.assertEqual(sorted(xs[0]["opts"]), sorted(ob)); moved += xs[0]["opts"] != ob
        self.assertGreater(moved, len(doc2["keys"]) // 2)
        snap = PQ.PUBLIC.read_text()
        with redirect_stdout(io.StringIO()): PQ.main(["reshuffle"])
        self.assertEqual(PQ.PUBLIC.read_text(), snap, "zweiter Aufruf: nichts zu tun")

    def test_regen_replaces_all_questions_and_retires_ids(self):
        self.run_tool(["run"])   # Altbestand: 10 Leitfaeden x 6 Fragen, IDs 1-6
        old = json.loads(PQ.PUBLIC.read_text()); f = PQ.fernet("k")
        old_qs = {x["q"] for v in old["pillars"].values() for x in v["en"]}
        n0 = len(self.batches)
        log = self.run_tool(["regen"], regen=True, verify_wrong={3})
        self.assertIn("Kosten-Schaetzung", log); self.assertIn("harte Grenze", log)
        self.assertEqual(len(self.batches), n0 + 2, "ein Erzeugungs- und ein Pruef-Batch")
        gen = self.batches[f"b{n0}"]
        self.assertEqual(len(gen), len(PIL.order()))
        u = next(r for r in gen if r["custom_id"] == "gen__manufacturing-kpis")["params"]["messages"][0]["content"]
        self.assertIn("retired", u); self.assertIn(old["pillars"]["manufacturing-kpis"]["en"][0]["q"], u)   # alte Fragen als "nicht wiederholen"
        self.assertIn("Lean manufacturing", u); self.assertIn("takt time must be tested in only one guide", u)   # Themen der anderen Leitfaeden
        pub = json.loads(PQ.PUBLIC.read_text()); raw = PQ.PUBLIC.read_text()
        self.assertEqual([p["id"] for p in PIL.order()], list(pub["pillars"]))
        for pid, v in pub["pillars"].items():
            self.assertEqual([x["id"] for x in v["en"]], [f"{pid}-{n}" for n in range(7, 7 + PQ.KEEP)], "neue IDs nach der hoechsten alten")
            self.assertEqual([x["id"] for x in v["en"]], [x["id"] for x in v["de"]])
            self.assertEqual(pub["retired"][pid], [f"{pid}-{n}" for n in range(1, 7)])
            self.assertFalse({x["q"] for x in v["en"]} & old_qs)
        self.assertNotIn('"a":', raw); self.assertNotIn("why", raw); self.assertNotIn("topic", raw)
        doc = PQ.decrypt_keys(PQ.KEYS.read_bytes().strip(), f)
        self.assertEqual(doc["regen"], PQ.REGEN); self.assertEqual(doc["order"], PQ.ORDER)
        self.assertEqual(len(doc["keys"]), 10 * PQ.KEEP)
        en = {x["id"]: x for v in pub["pillars"].values() for x in v["en"]}
        for k in doc["keys"]: self.assertEqual(en[k["qid"]]["opts"][k["answer"]], self.truth[en[k["qid"]]["q"]])
        topics = [PQ.topic_key(k["topic"]) for k in doc["keys"]]
        self.assertEqual(topics.count("takt time"), 1, "Takt-Zeit nur einmal im Pfad")
        self.assertEqual(next(k["pillar"] for k in doc["keys"] if PQ.topic_key(k["topic"]) == "takt time"), "lean-manufacturing")
        for pid, v in old["pillars"].items():   # keine neue Frage mit zwei alten Optionen
            for x in pub["pillars"][pid]["en"]:
                for o in v["en"]: self.assertLess(len(set(x["opts"]) & set(o["opts"])), 2)
        self.assertEqual(self.pushed, [], "nicht main: kein Push"); self.assertFalse(PQ.OPEN.exists())
        self.assertNotIn('"answer"', log); self.assertNotIn("why_en", log)
        # zweiter Aufruf: nichts zu tun, kein Batch; run hat ebenfalls nichts zu tun; plan --regen meldet erledigt
        snap = PQ.PUBLIC.read_text()
        log2 = self.run_tool(["regen"], regen=True)
        self.assertIn("nichts zu tun", log2); self.assertEqual(len(self.batches), n0 + 2); self.assertEqual(PQ.PUBLIC.read_text(), snap)
        self.assertIn("nichts zu tun", self.run_tool(["run"]))
        self.assertIn("erledigt", self.run_tool(["plan", "--regen"]))
        # run danach vergibt keine stillgelegte ID neu
        self.assertEqual(PQ.next_n("lean-manufacturing", PQ.used_ids(PQ.load_public(), doc, "lean-manufacturing")), 13)
        self.assertEqual(PQ.public_doc(PQ.load_public(), "x")["retired"], pub["retired"])

    def test_regen_respects_hard_cost_cap_and_needs_cron_key(self):
        self.run_tool(["run", "--pillars", "lean-manufacturing"])
        n0 = len(self.batches)
        with patch.object(PQ, "REGEN_USD", 0.01), self.assertRaises(SystemExit):
            self.run_tool(["regen"], regen=True)
        self.assertEqual(len(self.batches), n0, "ueber der Grenze: nichts gesendet")
        with patch.dict(os.environ, {"CRON_KEY": ""}), self.assertRaises(SystemExit): PQ.main(["regen"])

    def test_regen_too_few_writes_nothing(self):
        self.run_tool(["run"])
        snap, ksnap = PQ.PUBLIC.read_text(), PQ.KEYS.read_bytes()
        with self.assertRaises(SystemExit):
            self.run_tool(["regen"], regen=True, verify_wrong=set(range(PQ.REGEN_CANDIDATES - 4)))   # nur 4 bestehen die Pruefung
        self.assertEqual(PQ.PUBLIC.read_text(), snap); self.assertEqual(PQ.KEYS.read_bytes(), ksnap); self.assertFalse(PQ.OPEN.exists())

    def test_regen_plan_estimate_under_target(self):
        g, h, est = PQ.regen_estimate(PQ.regen_items(PQ.load_public()))
        self.assertLess(g + h, PQ.REGEN_USD); self.assertLess(est, PQ.REGEN_TARGET_USD)

    def test_select_path_dedup(self):
        c = lambda q, t, ref="R": {"q": q, "topic": t, "ref": ref, "opts": list("abcd")}
        passed = {"a": [c("What is takt time used for in a lean plant?", "takt time"), c("Explain muda in two words please?", "muda")],
                  "b": [c("How do you compute the takt time from demand?", "takt time calculation"), c("Which board shows hourly output?", "hour board"),
                        c("Why does lean focus on the waste muda?", "lean"), c("Which entirely unrelated thing about digital twins is right?", "digital twin")]}
        why = {}
        out = PQ.select_path(passed, ["a", "b"], 6, why, {"a": "Lean", "b": "Shop floor", "c": "Digital twin in manufacturing"})
        self.assertEqual([x["topic"] for x in out["a"]], ["takt time", "muda"])
        self.assertEqual([x["topic"] for x in out["b"]], ["hour board", "lean"], "takt time (mehrwortig enthalten) und Titel eines anderen Leitfadens fallen weg")
        self.assertEqual(why["b"]["Dublette im Pfad"], 2)
        self.assertEqual(PQ.topic_clash(c("x?", "lean"), [c("y?", "lean thinking")]), 4)
        self.assertEqual(PQ.topic_clash(c("How is takt time set?", "pacemaker"), [c("y?", "takt time")]), 3)

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


class ClusterRun(_RunBase):
    """Kursausbau 26.11.2026: 10 neue Leitfaeden und 15 Vertiefungen mit der echten Registry. Ohne Netz und ohne Schluessel; Laeufe nur mit Attrappen."""
    LEGACY = False

    # Freigabeliste vor dem Fragenlauf vom 26.11.2026 (Lauf 45751342822). Die echte Datei hat seitdem Fragen fuer alle 25 Quellen
    # und keine "hold"-Liste mehr; real_public() stellt den Stand davor her, damit die Tests weiter den Lauf selbst pruefen.
    HOLD_2611 = ["5s-visual-management", "kanban-pull-system", "smed-changeover-reduction", "tpm-oee", "six-sigma-root-cause-analysis",
                 "sop-mrp-production-planning", "theory-of-constraints", "mes-isa-95", "predictive-maintenance-iiot", "ot-cybersecurity-iec-62443",
                 "kaizen", "pdca-cycle", "a3-problem-solving", "poka-yoke", "standard-work", "andon", "paperless-manufacturing", "lot-sizing",
                 "manufacturing-inventory-management", "intralogistics", "manufacturing-simulation", "process-mining-manufacturing",
                 "sustainable-manufacturing", "supply-chain-resilience", "manufacturing-workforce-skills"]

    def real_public(self, hold=True):
        d = json.loads((ROOT / "data" / "pillar_quiz.json").read_text("utf-8"))
        held = set(self.HOLD_2611)
        for pid in list(d["pillars"]):
            if pid in held: del d["pillars"][pid]; continue
            for lang, qs in d["pillars"][pid].items():
                d["pillars"][pid][lang] = [q for q in qs if q.get("src") not in held]
        d["hold"] = list(self.HOLD_2611)
        if not hold: d.pop("hold", None)
        PQ.PUBLIC.write_text(json.dumps(d, ensure_ascii=False), "utf-8")
        return d

    def test_real_file_after_run_2611(self):
        """Ergebnis des Fragenlaufs 26.11.2026: jede der 25 Quellen hat ihre Fragen, en und de gleich, keine Freigabeliste mehr."""
        d = json.loads((ROOT / "data" / "pillar_quiz.json").read_text("utf-8"))
        self.assertFalse(d.get("hold"), "alle 25 Quellen erzeugt = freigegeben")
        for pid in self.HOLD_2611[:10]:
            self.assertEqual(len(d["pillars"][pid]["en"]), PQ.KEEP, pid)
        src = {}
        for pid, v in d["pillars"].items():
            self.assertEqual([q["id"] for q in v["en"]], [q["id"] for q in v["de"]], pid)
            for q in v["en"]:
                if q.get("src"): src[q["src"]] = src.get(q["src"], 0) + 1
        self.assertEqual(src, {c: PQ.CLUSTER_KEEP for c in self.HOLD_2611[10:]})
        PQ.PUBLIC.write_text(json.dumps(d, ensure_ascii=False), "utf-8")
        self.assertEqual(PQ.plan(()), [], "kein Bedarf mehr: ein weiterer run ohne --pillars kostet nichts")

    def test_plan_lists_guides_and_clusters_without_network(self):
        self.real_public()
        items = PQ.plan(())
        gd = [it for it in items if not PQ.is_cluster(it[0])]; cl = [it for it in items if PQ.is_cluster(it[0])]
        self.assertEqual(sorted(p["id"] for p, *_ in gd), sorted(p["id"] for p in PIL.order() if not p["slug"].get("de")))
        self.assertEqual(len(cl), 15)
        self.assertTrue(all(need == PQ.KEEP for *_, need in gd) and all(need == PQ.CLUSTER_KEEP for *_, need in cl))
        self.assertEqual({p["parent"] for p, *_ in cl}, {"lean-manufacturing", "operational-excellence", "shop-floor-management", "production-scheduling-aps", "digital-twin-manufacturing"})
        self.assertEqual(PQ.released(items, set(), PQ.held()), [], "ohne --pillars: alles zurueckgehalten")
        self.assertEqual(len(PQ.released(items, {"kaizen"}, PQ.held())), 25, "mit --pillars: die genannten (plan filtert vorher)")
        self.assertEqual([p["id"] for p, *_ in PQ.plan({"kaizen", "tpm-oee"})], ["kaizen", "tpm-oee"])
        self.assertEqual(PQ.plan({"lean-manufacturing"}), [], "ein Leitfaden nimmt seine Vertiefungen nicht automatisch mit")
        g, h = sum(PQ.req_cap_usd(r) for r in PQ.gen_requests(items)), PQ.phase2_cap_usd(items)
        self.assertLess(PQ.eur(g + h), PQ.RUN_EUR, "alle 25 Quellen passen in einen Lauf unter der Grenze")
        u = PQ.gen_requests([it for it in items if it[0]["id"] == "kaizen"])[0]["params"]["messages"][0]["content"]
        self.assertIn("Write exactly 5 questions", u); self.assertIn("same learning path", u)
        self.assertIn(json.loads(PQ.PUBLIC.read_text())["pillars"]["manufacturing-kpis"]["en"][0]["q"], u, "nicht wiederholen: Fragen des ganzen Pfads")
        log = io.StringIO()
        with redirect_stdout(log): PQ.main(["plan"])
        self.assertIn("Zurueckgehalten bis zur Freigabe", log.getvalue()); self.assertIn("Vertiefungen ohne genug Fragen", log.getvalue())

    def test_run_without_pillars_sends_nothing_for_held(self):
        self.real_public()
        log = self.run_tool(["run"])
        self.assertIn("nichts zu tun", log); self.assertEqual(self.batches, {}, "kein Batch, keine Kosten")

    def test_run_released_cluster_counts_for_parent(self):
        before = self.real_public()
        self.run_tool(["run", "--pillars", "kaizen,tpm-oee"])
        pub = json.loads(PQ.PUBLIC.read_text())
        lean_old = [x["id"] for x in before["pillars"]["lean-manufacturing"]["en"]]
        lean = pub["pillars"]["lean-manufacturing"]["en"]
        self.assertEqual([x["id"] for x in lean[:len(lean_old)]], lean_old, "bestehende Fragen bleiben")
        new = lean[len(lean_old):]
        self.assertEqual(len(new), PQ.CLUSTER_KEEP); self.assertTrue(all(x["src"] == "kaizen" for x in new))
        used = lean_old + list((before.get("retired") or {}).get("lean-manufacturing") or [])
        top = max(int(i.rsplit("-", 1)[1]) for i in used)
        self.assertEqual([x["id"] for x in new], [f"lean-manufacturing-{n}" for n in range(top + 1, top + 1 + PQ.CLUSTER_KEEP)], "IDs im Namensraum des Eltern-Leitfadens")
        self.assertEqual([x.get("src") for x in pub["pillars"]["lean-manufacturing"]["de"][len(lean_old):]], ["kaizen"] * PQ.CLUSTER_KEEP)
        self.assertEqual([x["id"] for x in pub["pillars"]["tpm-oee"]["en"]], [f"tpm-oee-{n}" for n in range(1, PQ.KEEP + 1)])
        order = [p["id"] for p in PIL.order()]
        self.assertEqual(list(pub["pillars"]), [p for p in order if p in pub["pillars"]], "Pfadreihenfolge, tpm-oee an seiner Stelle")
        self.assertNotIn("kaizen", pub["hold"]); self.assertNotIn("tpm-oee", pub["hold"]); self.assertIn("pdca-cycle", pub["hold"])
        keys = PQ.decrypt_keys(PQ.KEYS.read_bytes().strip(), PQ.fernet("k"))["keys"]
        self.assertTrue(all(k["pillar"] == "lean-manufacturing" and k["qid"].startswith("lean-manufacturing-") for k in keys if k.get("src") == "kaizen"))
        body = PQ.push_body({"path": "p", "keys": keys})
        self.assertTrue(all(set(k) == {"qid", "pillar", "answer", "why_en", "why_de"} for k in body["keys"]), "src geht nicht an den Worker")
        import site_pillars as S
        self.assertTrue(all(set(S._clean_q(x)) == {"id", "q", "opts"} for x in new), "src erreicht die Seite nicht")
        self.assertTrue({r["custom_id"] for b in self.batches.values() for r in b} >= {"gen__kaizen", "gen__tpm-oee"})



class PushLog(unittest.TestCase):
    def run_push(self, res, n=60):
        doc = {"path": "p", "keys": [{"qid": f"g-{i}", "pillar": "g", "answer": 0} for i in range(n)]}
        buf = io.StringIO()
        with patch.object(PQ, "fernet", lambda: object()), patch.object(PQ, "load_keys", lambda f: doc), patch.object(PQ, "push", lambda d: res), redirect_stdout(buf):
            self.assertTrue(PQ.do_push(True))
        return buf.getvalue()

    def test_log_shows_deactivated_total_pillars(self):
        out = self.run_push({"ok": True, "upserted": 60, "deactivated": 0, "total": 60, "pillars": 10})
        for k in ("'upserted': 60", "'deactivated': 0", "'total': 60", "'pillars': 10"): self.assertIn(k, out)
        self.assertNotIn("::warning::", out)

    def test_warns_when_questions_retired(self):
        out = self.run_push({"ok": True, "upserted": 60, "deactivated": 60, "total": 60, "pillars": 10})
        self.assertIn("::warning::Schluessel-Push: 60 Fragen stillgelegt", out)
        self.assertIn("::warning::", self.run_push({"ok": True, "upserted": 60, "deactivated": 0, "total": 66, "pillars": 10}))




class Umlauts(unittest.TestCase):
    """Fragenlauf 26.11.2026: Haiku schrieb in 7 Gruppen ae/oe/ue statt Umlauten (Prompt nannte "Ruestzeit"). Erkennung, Pruefung, retranslate."""
    ASCII = "Ein Kaizen braucht einen stabilen Standard, weil das Team sonst nicht erkennt, ob die Aenderung tatsaechlich geholfen hat und fuer wen."
    MIXED = "Sie erhoeht die Ausbringung der Anlage über eine Stunde, sie aendert aber nichts am Engpass."
    GOOD = ["Eine visuelle Steuerung zeigt zuerst den aktuellen Soll-Zustand, manuell und eventuell individuell.",
            "Die Steuerung der neuen Feuerwehr-Quelle läuft über Kennzahlen wie OEE.", "Which value is true for this issue?",
            "The influence of the queue on fuel use"]

    def test_detects_ascii_and_mixed(self):
        self.assertTrue(PQ.ascii_german(self.ASCII)); self.assertTrue(PQ.ascii_german(self.MIXED))
        self.assertTrue(PQ.ascii_german("Eine Min/Max-Linie am Regal, die die Nachfuellung steuert, und ein Etikett je Stueck"), "Ausnahmen nur als ganze Woerter")
        self.assertFalse(PQ.ascii_german("Die OEE und das Purdue-Modell, OEE-Verluste"))
        self.assertTrue(PQ.ascii_german("Das Werk wird neu geaendert, die Halle neu geoeffnet, das Team neu geuebt."), "ge- und Vokal vor ae/oe/ue")
        self.assertTrue(PQ.ascii_german("Die Bauueberwachung prüft das Gebäude."))
        self.assertTrue(PQ.ascii_german("Die Lösung wird erklaert genannt."), "Wortschatz ohne ASCII-Formen aus Slugs")
        for g in ["Der OEM liefert, der OEM prüft nicht", "Die DOE und S&OE sowie OE im Werk", "Schaeffler und Schaeffler-Werke",
                  "Beide Werte sind zueinander anzuerkennen und zuerst zu messen", "Der Suezkanal und Suez"]:
            self.assertFalse(PQ.ascii_german(g), g)
        for g in self.GOOD: self.assertFalse(PQ.ascii_german(g), g)

    def test_real_old_questions_clean(self):
        d = json.loads((ROOT / "data" / "pillar_quiz.json").read_text("utf-8"))
        old = [x for pid in ("value-stream-mapping", "manufacturing-kpis", "aerospace-production-planning", "manufacturing-it-azure", "ifakt-polaris")
               for x in d["pillars"][pid]["de"]]
        self.assertEqual([x["id"] for x in old if PQ.ascii_german(x["q"], *x["opts"])], [])

    def test_check_translation_rejects(self):
        src = {"opts": ["a", "b", "c", "d"]}
        bad = {"q": self.ASCII, "opts": ["eins", "zwei", "drei", "vier"], "why": "Weil es so im Leitfaden steht."}
        self.assertEqual(PQ.check_translation(src, bad), (None, "Umlaute als ae/oe/ue"))
        ok = {**bad, "q": "Ein Kaizen braucht einen stabilen Standard, weil das Team sonst nicht erkennt, ob die Änderung geholfen hat."}
        self.assertIsNotNone(PQ.check_translation(src, ok)[0])

    def test_prompt_asks_for_umlauts(self):
        self.assertIn("Rüstzeit", PQ.TR_SYSTEM); self.assertNotIn("Ruestzeit", PQ.TR_SYSTEM); self.assertIn("never replace them with ae, oe, ue", PQ.TR_SYSTEM)


class Retranslate(_RunBase):
    LEGACY = False

    def seed(self):
        f = PQ.fernet("k")
        pub = {"path": PQ.path_id(), "version": "2026-11-26", "pillars": {
            "tpm-oee": {"en": [{"id": "tpm-oee-1", "q": "Where does OEE's value lie?", "opts": ["A", "B", "C", "D"]},
                               {"id": "tpm-oee-2", "q": "What is TPM?", "opts": ["E", "F", "G", "H"]}],
                        "de": [{"id": "tpm-oee-1", "q": "Worin liegt der Nutzen? " + Umlauts.ASCII, "opts": ["a", "b", "c", "d"]},
                               {"id": "tpm-oee-2", "q": "Was ist TPM? Eine Methode für die Instandhaltung.", "opts": ["e", "f", "g", "h"]}]},
            "lean-manufacturing": {"en": [{"id": "lean-manufacturing-13", "q": "Why a standard?", "opts": ["I", "J", "K", "L"], "src": "kaizen"}],
                                   "de": [{"id": "lean-manufacturing-13", "q": "Warum ein Standard?", "opts": ["i", "j", "k", "l"], "src": "kaizen"}]}}}
        PQ.PUBLIC.write_text(json.dumps(pub, ensure_ascii=False), "utf-8")
        keys = {"path": PQ.path_id(), "order": PQ.ORDER, "keys": [
            {"qid": "tpm-oee-1", "pillar": "tpm-oee", "answer": 3, "why_en": "Losses.", "why_de": "Verluste."},
            {"qid": "tpm-oee-2", "pillar": "tpm-oee", "answer": 1, "why_en": "Maintenance.", "why_de": "Instandhaltung für alle."},
            {"qid": "lean-manufacturing-13", "pillar": "lean-manufacturing", "answer": 2, "why_en": "Baseline.", "why_de": Umlauts.MIXED, "src": "kaizen"}]}
        PQ.KEYS.write_bytes(PQ.encrypt_keys(keys, f) + b"\n")
        return f

    def fake(self, good=True):
        def submit(reqs):
            bid = f"b{len(self.batches)}"; self.batches[bid] = reqs; return bid

        def results(b):
            out = []
            for r in self.batches[b["id"]]:
                qs = json.loads(r["params"]["messages"][0]["content"])
                text = json.dumps([{"n": q["n"], "q": ("Übersetzt: " if good else "Uebersetzt fuer: ") + q["q"], "opts": [("Ö " if good else "Oe fuer ") + o for o in q["opts"]],
                                    "why": "Begründung: " + q["why"]} for q in qs], ensure_ascii=False)
                out.append({"custom_id": r["custom_id"], "result": {"type": "succeeded", "message": {"content": [{"type": "text", "text": text}],
                            "usage": {"input_tokens": 500, "output_tokens": 100}, "stop_reason": "end_turn"}}})
            return out
        return [patch.object(PQ, "submit", submit), patch.object(PQ, "wait", lambda bid: {"id": bid}), patch.object(PQ, "results", results)]

    def go(self, *a, good=True):
        log = io.StringIO()
        ps = self.fake(good)
        for x in ps: x.start()
        try:
            with redirect_stdout(log): n = PQ.retranslate(set(a))
        finally:
            for x in ps: x.stop()
        return n, log.getvalue()

    def test_replaces_only_ascii_questions(self):
        f = self.seed()
        n, log = self.go()
        self.assertEqual(n, 2, log)
        reqs = [r for b in self.batches.values() for r in b]
        self.assertEqual(sorted(r["custom_id"] for r in reqs), ["tr__lean-manufacturing", "tr__tpm-oee"])
        sent = json.loads(next(r for r in reqs if r["custom_id"] == "tr__tpm-oee")["params"]["messages"][0]["content"])
        self.assertEqual(sent, [{"n": 1, "q": "Where does OEE's value lie?", "opts": ["A", "B", "C", "D"], "why": "Losses."}], "Quelle = Englisch samt why_en")
        pub = json.loads(PQ.PUBLIC.read_text()); de = {x["id"]: x for v in pub["pillars"].values() for x in v["de"]}
        self.assertEqual(de["tpm-oee-1"]["q"], "Übersetzt: Where does OEE's value lie?"); self.assertEqual(de["tpm-oee-1"]["opts"], ["Ö A", "Ö B", "Ö C", "Ö D"])
        self.assertEqual(de["tpm-oee-2"]["q"], "Was ist TPM? Eine Methode für die Instandhaltung.", "saubere Fragen bleiben")
        self.assertEqual(de["lean-manufacturing-13"]["src"], "kaizen"); self.assertEqual(pub["version"], PQ.dt.date.today().isoformat())
        self.assertEqual([x["id"] for x in pub["pillars"]["tpm-oee"]["en"]], ["tpm-oee-1", "tpm-oee-2"])
        k = {x["qid"]: x for x in PQ.decrypt_keys(PQ.KEYS.read_bytes().strip(), f)["keys"]}
        self.assertEqual(k["tpm-oee-1"]["answer"], 3); self.assertEqual(k["tpm-oee-1"]["why_de"], "Begründung: Losses.")
        self.assertEqual(k["tpm-oee-2"]["why_de"], "Instandhaltung für alle.")
        self.assertEqual(k["lean-manufacturing-13"]["why_de"], "Begründung: Baseline.", "why_de mit ae/oe/ue zaehlt mit")
        self.assertIn("nicht main", log)
        self.batches.clear()
        n2, log2 = self.go()
        self.assertEqual((n2, self.batches), (0, {}), "zweiter Aufruf: nichts zu tun, keine Kosten"); self.assertIn("nichts zu tun", log2)

    def test_filter_and_bad_translation_kept(self):
        self.seed()
        n, log = self.go("kaizen", good=False)
        self.assertEqual(n, 0); self.assertIn("Nicht ersetzt", log)
        self.assertEqual([r["custom_id"] for b in self.batches.values() for r in b], ["tr__lean-manufacturing"], "--pillars kaizen: nur diese Vertiefung")
        self.assertIn("Aenderung", PQ.PUBLIC.read_text("utf-8"), "unveraendert")

    def test_partial_and_reversed_order(self):
        """Antworten in umgekehrter n-Reihenfolge; eine schlechte Uebersetzung in der Gruppe bleibt alt, die gute wird geschrieben."""
        f = self.seed()
        def results(b):
            out = []
            for r in self.batches[b["id"]]:
                qs = json.loads(r["params"]["messages"][0]["content"])
                arr = [{"n": q["n"], "q": "Übersetzt: " + q["q"], "opts": ["Ö " + o for o in q["opts"]], "why": "Begründung: " + q["why"]} for q in qs]
                if r["custom_id"] == "tr__lean-manufacturing": arr = [{**x, "opts": x["opts"][:3]} for x in arr]   # falsche Zahl Optionen
                out.append({"custom_id": r["custom_id"], "result": {"type": "succeeded", "message": {"content": [{"type": "text", "text": json.dumps(arr[::-1], ensure_ascii=False)}],
                            "usage": {"input_tokens": 10, "output_tokens": 10}, "stop_reason": "end_turn"}}})
            return out
        with patch.object(PQ, "submit", lambda reqs: self.batches.setdefault("b", reqs) and "b"), patch.object(PQ, "wait", lambda bid: {"id": bid}), \
                patch.object(PQ, "results", results), redirect_stdout(io.StringIO()) as log:
            self.assertEqual(PQ.retranslate(set()), 1)
        pub = json.loads(PQ.PUBLIC.read_text()); de = {x["id"]: x for v in pub["pillars"].values() for x in v["de"]}
        self.assertEqual(de["tpm-oee-1"]["q"], "Übersetzt: Where does OEE's value lie?")
        self.assertEqual(de["lean-manufacturing-13"]["q"], "Warum ein Standard?", "verworfene Uebersetzung: alter Text bleibt")
        k = {x["qid"]: x for x in PQ.decrypt_keys(PQ.KEYS.read_bytes().strip(), f)["keys"]}
        self.assertEqual(k["lean-manufacturing-13"]["why_de"], Umlauts.MIXED); self.assertIn("Nicht ersetzt", log.getvalue())
        self.assertNotIn("Losses", log.getvalue(), "keine Erklaerung im Log")

    def test_budget_false_sends_nothing(self):
        self.seed()
        with patch("ai_gateway.check_budget", lambda *a, **k: False), self.assertRaises(SystemExit): self.go()
        self.assertEqual(self.batches, {})

    def test_cap(self):
        self.seed()
        with patch.object(PQ, "RETR_EUR", 0.000001), self.assertRaises(SystemExit): self.go()
        self.assertEqual(self.batches, {}, "ueber der Grenze: nichts gesendet")

    def test_main_mode(self):
        self.seed()
        with patch.object(PQ, "retranslate", lambda p: self.batches.setdefault("called", p)): PQ.main(["retranslate", "--pillars", "tpm-oee"])
        self.assertEqual(self.batches["called"], {"tpm-oee"})


if __name__ == "__main__":
    unittest.main()
