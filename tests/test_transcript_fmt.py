"""Transkripte lesbar setzen (transcript_fmt.py, tools/transcript_format.py): Text bleibt Original, Pruefung der KI-Antwort, Rueckfall, Freigabe, Batch-Ergebnisse.
Lauf: python3 -m unittest tests/test_transcript_fmt.py"""
import gzip
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tools"))
import transcript_fmt as TF  # noqa: E402
import transcript_format as TX  # noqa: E402

TEXT = " ".join(f"Sentence number {i} says something about Azure & the <cloud>." for i in range(40))
words = lambda s: re.findall(r"\S+", re.sub(r"<[^>]+>", " ", s.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")))


class T(unittest.TestCase):
    def test_sentences_cover_text_exactly(self):
        ss = TF.sentences(TEXT)
        self.assertEqual(len(ss), 40); self.assertEqual(" ".join(ss), TEXT)
        self.assertEqual(TF.sentences("Dr. Smith said so. Then 3.5 percent! Really? Yes…  Ok"), ["Dr.", "Smith said so.", "Then 3.5 percent!", "Really?", "Yes…", "Ok"])

    def test_render_keeps_every_word_and_escapes(self):
        e = {"s": TF.sig(TEXT), "b": [0, 5, 12], "h": [[0, 3, "Azure basics"], [12, 4, "<b>x</b> bad"], [20, 4, "Second part"]]}
        h = TF.render_html(TEXT, e)
        self.assertIn("<h3>Azure basics</h3>", h); self.assertIn("<h4>Second part</h4>", h); self.assertNotIn("<b>x", h)   # Ueberschrift mit Tags verworfen
        self.assertEqual(words(re.sub(r"<h[34]>.*?</h[34]>", " ", h)), words(TEXT))   # Wort fuer Wort das Original
        self.assertTrue(all(len(re.findall(r"Sentence number", p)) <= TF.MAX_PAR for p in re.findall(r"<p[^>]*>(.*?)</p>", h)))

    def test_changed_source_gives_no_html(self):
        e = {"s": TF.sig(TEXT), "b": [0], "h": []}
        self.assertIsNotNone(TF.render_html(TEXT, e)); self.assertIsNone(TF.render_html(TEXT + " More.", e)); self.assertIsNone(TF.render_html(TEXT, None))

    def test_release_switch_and_fallback_html(self):
        with tempfile.TemporaryDirectory() as t:
            d = Path(t); (d / "transcript_fmt").mkdir()
            with gzip.open(d / "transcript_fmt" / "en.json.gz", "wt") as f: json.dump({"abc": {"s": TF.sig(TEXT), "b": [0, 4], "h": []}}, f)
            old = TF.D; TF.D = d; TF.reset()
            try:
                self.assertEqual(TF.html_for("en", "abc", TEXT, "OLD"), "OLD")   # keine Freigabe: unveraendert
                (d / "transcript_fmt_live.json").write_text('{"langs": ["en"]}'); TF.reset()
                self.assertNotEqual(TF.html_for("en", "abc", TEXT, "OLD"), "OLD"); self.assertEqual(TF.html_for("en", "zzz", TEXT, "OLD"), "OLD")
                self.assertEqual(TF.html_for("de", "abc", TEXT, "OLD"), "OLD")
            finally:
                TF.D = old; TF.reset()

    def test_make_entry_validation(self):
        s = TF.sig(TEXT)
        ok = TX.make_entry(TEXT, s, {"p": [0, 5, 10, 15, 20, 25, 30, 35], "h": [[0, 3, "Intro to Azure"], [20, 4, "Costs"], [999, 3, "out of range"], [21, 7, "bad level"]]})
        self.assertEqual([h[2] for h in ok["h"]], ["Intro to Azure", "Costs"]); self.assertEqual(ok["s"], s); self.assertEqual(ok["b"][0], 0)
        self.assertIn(20, ok["b"])   # Ueberschrift steht an einem Absatzanfang
        self.assertIsNone(TX.make_entry(TEXT, s, {"p": [0, 10], "h": []}))        # lang, aber keine Ueberschrift
        self.assertIsNone(TX.make_entry(TEXT, s, "not json")); self.assertIsNone(TX.make_entry(TEXT, s, {"h": []}))
        fb = TX.fallback_entry(TEXT, s); self.assertEqual(fb["h"], []); self.assertTrue(TF.render_html(TEXT, fb))

    def test_parse_variants(self):
        self.assertEqual(TX.parse('```json\n{"p":[0],"h":[]}\n```'), {"p": [0], "h": []}); self.assertEqual(TX.parse('Sure: {"p":[0],"h":[]} done'), {"p": [0], "h": []}); self.assertIsNone(TX.parse("nothing"))

    def test_todo_apply_and_retry(self):
        with tempfile.TemporaryDirectory() as t:
            r = Path(t); (r / "data" / "en_transcripts").mkdir(parents=True); (r / "data" / "en_transcripts" / "a1.txt").write_text(TEXT)
            st = {"batches": [], "tries": {}}
            self.assertEqual([k for k, _, _ in TX.todo("en", r, st=st)], ["a1"])
            s = TF.sig(TEXT)
            b = {"id": "x", "map": {"c00000": f"en:a1:{s}"}}
            good = json.dumps({"p": [0, 5, 10, 15, 20, 25, 30, 35], "h": [[0, 3, "Intro to Azure"], [20, 3, "More Azure"]]})
            line = json.dumps({"custom_id": "c00000", "result": {"type": "succeeded", "message": {"content": [{"type": "text", "text": good}], "usage": {"input_tokens": 10, "output_tokens": 5}}}})
            self.assertEqual(TX.apply_results([line], b, st, r), (1, 0))
            self.assertEqual([k for k, _, _ in TX.todo("en", r, st=st)], [])   # fertig: nichts mehr offen
            # Quelle geaendert -> wieder offen; dreimal abgelehnt -> Rueckfall ohne Ueberschriften
            (r / "data" / "en_transcripts" / "a1.txt").write_text(TEXT + " Extra sentence here.")
            s2 = TF.sig(TEXT + " Extra sentence here."); b2 = {"id": "y", "map": {"c00000": f"en:a1:{s2}"}}
            bad = json.dumps({"custom_id": "c00000", "result": {"type": "errored"}})
            for _ in range(TX.MAX_TRIES): TX.apply_results([bad], b2, st, r)
            idx = json.loads(gzip.open(r / "data" / "transcript_fmt" / "en.json.gz", "rt").read())
            self.assertEqual(idx["a1"]["s"], s2); self.assertEqual(idx["a1"]["h"], [])
            self.assertEqual([k for k, _, _ in TX.todo("en", r, st=st)], [])

    def test_plan_estimate(self):
        with tempfile.TemporaryDirectory() as t:
            r = Path(t); (r / "data" / "en_transcripts").mkdir(parents=True)
            for i in range(3): (r / "data" / "en_transcripts" / f"t{i}.txt").write_text(TEXT)
            p = TX.plan(["en"], r); self.assertEqual(p["n"], 3); self.assertGreater(p["tokens_in"], 0)


if __name__ == "__main__":
    unittest.main()
