"""video_seo.py + tools/video_seo_gen.py: Transkript-Aufbereitung, Pruefregeln, Freigabeschalter, Seitenbau-Bausteine, Batch-Ergebnisse mit Attrappen (kein Netz, kein Geld).
Lauf: python3 -m unittest tests/test_video_seo.py"""
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tools"))
import video_seo as VS  # noqa: E402
import video_seo as _vs  # noqa: E402,F811
import importlib.util  # noqa: E402
_spec = importlib.util.spec_from_file_location("tool_video_seo", ROOT / "tools" / "video_seo_gen.py"); TOOL = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(TOOL)

VTT = "WEBVTT\n\n" + "\n\n".join(f"00:{i // 60:02d}:{i % 60:02d}.000 --> 00:{i // 60:02d}:{i % 60:02d}.900\nSatz Nummer {i} ueber Copilot und Power Automate im Alltag, damit der Text lang genug wird." for i in range(0, 300, 7))
EN = {"s": "x", "v": VS.PROMPT_V, "t": "Copilot Studio Grounding: Stop Hallucinations", "d": "Learn how grounding keeps your Copilot Studio bot on facts, which sources to connect and how to test answers before you publish it.",
      "u": "This video explains how grounding works in Copilot Studio and why bots invent answers without it. " * 3, "c": [[0, "Why bots hallucinate"], [40, "Connect grounding sources"], [120, "Test the answers"]], "h": ["Summary", "Chapters"]}


def good_answer():
    return {"title": "Copilot Studio Grounding: Stop Hallucinations", "meta": EN["d"], "summary": EN["u"], "chapters": [[0, "Why bots hallucinate"], [42, "Connect grounding sources"], [119, "Test the answers"], [210, "Publish with confidence"]]}


class T(unittest.TestCase):
    def setUp(self): VS.reset()

    def test_vtt_blocks_and_marks(self):
        cues = VS.vtt_cues(VTT); self.assertEqual(cues[0][0], 0); self.assertEqual(cues[1][0], 7)
        src, marks = VS.source_text(VTT)
        self.assertTrue(src.startswith("[0] ")); self.assertIn(0, marks); self.assertTrue(all(f"[{m}]" in src for m in marks))
        self.assertEqual(VS.vtt_cues("WEBVTT\n\n00:01:02.000 --> 00:01:03.000\n<v A>Hallo <b>Welt</b>\n")[0], (62, "Hallo Welt"))

    def test_chapters_snap_and_reject(self):
        marks = {0, 40, 80, 120, 160, 200}
        c = VS.clean_chapters([[0, "Intro and goal"], [42, "Second part here"], [119, "Third part here"]], marks, None, 3, 14)
        self.assertEqual([x[0] for x in c], [0, 40, 120])                                   # auf Zeitmarken gerastet
        self.assertIsNone(VS.clean_chapters([[0, "Intro and goal"], [500, "Far away mark"], [600, "Third here now"]], marks))   # keine Zeitmarke in der Naehe
        self.assertIsNone(VS.clean_chapters([[0, "Intro and goal"], [80, "Second part here"], [40, "Out of order"]], marks))
        self.assertIsNone(VS.clean_chapters([[0, "Intro <b>x</b>"], [40, "Second part here"], [80, "Third part here"]], marks))
        self.assertIsNone(VS.clean_chapters([[60, "Starts too late"], [80, "Second part here"], [120, "Third part here"]], marks))

    def test_make_entry_en_rules(self):
        marks = {0, 40, 120, 200}
        self.assertEqual(VS.make_entry_en(good_answer(), marks, "s1")["c"][1][0], 40)
        for key, bad in (("title", "Short"), ("meta", "Too short."), ("summary", "x" * 50), ("title", "<b>Hack</b> Copilot Studio Grounding stop"), ("meta", "See https://evil.example " + "x" * 110)):
            a = good_answer(); a[key] = bad
            self.assertIsNone(VS.make_entry_en(a, marks, "s1"), key)
        self.assertIsNone(VS.make_entry_en("kein dict", marks, "s"))

    def test_make_entry_en_nachsichtig_bei_einzelnen_kapiteln(self):
        marks = {0, 40, 120, 200, 280}
        a = good_answer(); a["chapters"] = [[5, "Why bots hallucinate"], [42, "Connect grounding sources"], [44, "Same mark twice"], [118, "<b>bad</b> name"], [30, "Out of order"], [205, "Test the answers"], [281, "Publish with confidence"]]
        e = VS.make_entry_en(a, marks, "s1")
        self.assertEqual([x[0] for x in e["c"]], [0, 40, 200, 280])       # Duplikat, kaputter Name und Rueckwaerts-Sekunden uebersprungen, erstes bei 0
        a["chapters"] = [[0, "One chapter only"], [40, "Second chapter here"]]
        self.assertIsNone(VS.make_entry_en(a, marks, "s1"))              # zu wenige bleiben abgelehnt
        a["chapters"] = [[i * 40, f"Chapter number {i}"] for i in range(7)]
        self.assertEqual(len(VS.make_entry_en(a, set(range(0, 281, 40)), "s1")["c"]), 7)
        many = {i * 40 for i in range(20)}; a["chapters"] = [[i * 40, f"Chapter number {i}"] for i in range(20)]
        c = VS.make_entry_en(a, many, "s1")["c"]; self.assertEqual(len(c), 12); self.assertEqual((c[0][0], c[-1][0]), (0, 760))   # gleichmaessig ausgeduennt
        self.assertEqual(VS.reject_reason(dict(good_answer(), title="Hi"), marks), "title zu kurz")
        self.assertEqual(VS.reject_reason(dict(good_answer(), chapters=[]), marks), "Kapitel unbrauchbar")
        self.assertEqual(VS.reject_reason(None, marks), "keine JSON-Antwort")

    def test_make_entry_tr(self):
        a = {"title": "Copilot Studio Grounding: Halluzinationen stoppen", "meta": "So haelt Grounding Ihren Copilot-Studio-Bot bei den Fakten: welche Quellen Sie verbinden und wie Sie Antworten vor der Veroeffentlichung testen.",
             "summary": "Dieses Video erklaert, wie Grounding in Copilot Studio funktioniert und warum Bots ohne es Antworten erfinden. " * 3, "chapters": ["Warum Bots halluzinieren", "Quellen verbinden", "Antworten testen"],
             "labels": {"summary": "Zusammenfassung", "chapters": "Kapitel"}}
        e = VS.make_entry_tr(a, EN, "de"); self.assertEqual(e["c"], [[0, "Warum Bots halluzinieren"], [40, "Quellen verbinden"], [120, "Antworten testen"]]); self.assertEqual(e["s"], VS.entry_sig(EN))   # Sekunden vom englischen Eintrag
        b = dict(a, chapters=["nur eins"]); self.assertIsNone(VS.make_entry_tr(b, EN, "de"))
        self.assertIsNone(VS.make_entry_tr(a, EN, "ja"))                                    # deutscher Text in "ja": falsche Schrift
        c = dict(a, labels={"summary": "", "chapters": "Kapitel"}); self.assertIsNone(VS.make_entry_tr(c, EN, "de"))

    def test_live_switch_and_fallbacks(self):
        with tempfile.TemporaryDirectory() as t:
            D = Path(t); (D / "video_seo").mkdir()
            import gzip
            with gzip.open(D / "video_seo" / "en.json.gz", "wt") as f: json.dump({"vid1": EN}, f)
            old = VS.D; VS.D = D
            try:
                VS.reset(); self.assertIsNone(VS.get("en", "vid1")); self.assertEqual(VS.title("en", "vid1", "alt"), "alt"); self.assertEqual(VS.section("en", "vid1"), ""); self.assertEqual(VS.clips("en", "vid1"), [])   # ohne Freigabe: wie vorher
                (D / "video_seo_live.json").write_text(json.dumps({"langs": ["en"]})); VS.reset()
                self.assertEqual(VS.title("en", "vid1", "alt"), EN["t"]); self.assertEqual(VS.meta("en", "vid1", "alt"), EN["d"]); self.assertIsNone(VS.get("de", "vid1"))
                h = VS.section("en", "vid1"); self.assertIn("t=40s", h); self.assertIn("<time>2:00</time>", h); self.assertIn("<h2>Summary</h2>", h)
                cl = VS.clips("en", "vid1"); self.assertEqual((cl[0]["startOffset"], cl[0]["endOffset"], "endOffset" in cl[-1]), (0, 40, False))
                VS.reset(); (D / "video_seo_live.json").write_text("{kaputt"); VS.reset(); self.assertEqual(VS.title("en", "vid1", "alt"), "alt")   # kaputte Freigabe = aus
            finally: VS.D = old; VS.reset()

    def test_html_is_escaped(self):
        e = dict(EN, c=[[0, "A & B <i>"[:0] + "A and B here"], [40, "Second part here"], [90, "Third part here"]], u=("Tom & Jerry explain Copilot. " * 8))
        with tempfile.TemporaryDirectory() as t:
            D = Path(t); (D / "video_seo").mkdir(); import gzip
            with gzip.open(D / "video_seo" / "en.json.gz", "wt") as f: json.dump({"v": e}, f)
            (D / "video_seo_live.json").write_text(json.dumps({"langs": ["en"]})); old = VS.D; VS.D = D; VS.reset()
            try: self.assertIn("Tom &amp; Jerry", VS.section("en", "v"))
            finally: VS.D = old; VS.reset()

    def test_tool_write_and_translate_roundtrip(self):
        with tempfile.TemporaryDirectory() as t:
            r = Path(t); (r / "transcripts" / "de").mkdir(parents=True); (r / "episodes").mkdir(); (r / "data").mkdir()
            (r / "transcripts" / "de" / "vid1.vtt").write_text(VTT); (r / "data" / "videos.json").write_text(json.dumps({"vid1": {"date": "2026-10-01"}, "vid2": {"date": "2026-10-02"}}))
            (r / "data" / "en_titles.json").write_text(json.dumps({"vid1": "Copilot Studio Grounding"}))
            (r / "episodes" / "vid1.json").write_text(json.dumps({"de": {"title": "x"}, "ja": {"title": "y"}, "xx": {}}))
            self.assertEqual([v for v, _ in TOOL.todo_write(r)], ["vid1"])                  # vid2 hat kein Transkript
            p = TOOL.plan("all", r); self.assertEqual(p["write"]["n"], 1); self.assertGreater(p["write"]["tokens_in"], 0); self.assertEqual(p["translate"]["n"], 0)
            src = TOOL.source("vid1", r); s = VS.src_sig(src[1], src[3])
            line = json.dumps({"custom_id": "c00000", "result": {"type": "succeeded", "message": {"usage": {"input_tokens": 9000, "output_tokens": 800}, "content": [{"type": "text", "text": "```json\n" + json.dumps(good_answer()) + "\n```"}]}}})
            b = {"id": "b1", "stage": "write", "model": TOOL.WRITE_MODEL, "map": {"c00000": f"write:vid1:{s}"}}; st = TOOL.load_state(r)
            self.assertEqual(TOOL.apply_results([line], b, st, r), (1, 0)); self.assertGreater(st["spent_eur"], 0)
            en = TOOL.jload(TOOL.idx_path("en", r), {}); self.assertTrue(VS.valid_entry(en["vid1"])); self.assertEqual(TOOL.todo_write(r), [])   # fertig
            tr = TOOL.todo_translate(r); self.assertEqual(sorted((v, l) for v, l, _ in tr), [("vid1", "de"), ("vid1", "ja")])   # nur Sprachen mit Videoseite
            # geaenderte Quelle: Ergebnis wird verworfen
            (r / "transcripts" / "de" / "vid1.vtt").write_text(VTT + "\n\n00:09:00.000 --> 00:09:01.000\n" + "Neuer Absatz mit viel Text. " * 5)
            self.assertEqual(TOOL.apply_results([line], b, TOOL.load_state(r), r), (0, 0))
            # abgelehnte Antwort zaehlt als Versuch, nach MAX_TRIES wird nicht mehr gefragt
            bad = json.dumps({"custom_id": "c00000", "result": {"type": "succeeded", "message": {"usage": {}, "content": [{"type": "text", "text": "{}"}]}}})
            (r / "transcripts" / "de" / "vid1.vtt").write_text(VTT); st2 = TOOL.load_state(r); idx = TOOL.idx_path("en", r); idx.unlink()
            for _ in range(TOOL.MAX_TRIES): self.assertEqual(TOOL.apply_results([bad], b, st2, r), (0, 1))
            TOOL.save_state(st2, r); self.assertEqual(TOOL.todo_write(r), [])

    def test_submit_stops_over_cap(self):
        with tempfile.TemporaryDirectory() as t:
            r = Path(t); (r / "transcripts" / "de").mkdir(parents=True); (r / "data").mkdir()
            (r / "transcripts" / "de" / "vid1.vtt").write_text(VTT); (r / "data" / "videos.json").write_text(json.dumps({"vid1": {}}))
            old = TOOL.MAX_EUR; TOOL.MAX_EUR = 0.0
            try: self.assertEqual(TOOL.submit("write", r), 0)                                  # Grenze 0: nichts wird gesendet (kein API-Aufruf)
            finally: TOOL.MAX_EUR = old


if __name__ == "__main__":
    unittest.main()
