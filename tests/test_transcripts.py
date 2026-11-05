"""Transkripte als Dateien je Folge (#266): VTT -> TXT, Pfade, Index, Gleichlauf mit dem Site-Worker, Umstellung bei Spreaker."""
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tools"))
import site_transcripts as TRS   # noqa: E402
import apply_podcast_transcripts as APT   # noqa: E402

BASE = "https://www.m365.fm"
LONG = "Dies ist ein Satz, der lang genug ist, damit das Transkript die Mindestlaenge erreicht. "


def vtt(*cues):
    return "WEBVTT\n\n" + "\n\n".join(f"{a} --> {b}\n{t}" for a, b, t in cues) + "\n"


class VttToTxt(unittest.TestCase):
    def test_header_cues_timestamps_and_tags_removed(self):
        src = ("﻿WEBVTT\r\nKind: captions\r\nLanguage: de\r\n\r\nNOTE erzeugt von Whisper\r\nzweite Zeile\r\n\r\nSTYLE\r\n::cue { color: red }\r\n\r\n"
               "1\r\n00:00:00.000 --> 00:00:02.000 align:start\r\n<v Mirko>Hallo &amp; willkommen</v>\r\n\r\n"
               "cue-2\r\n00:00:02.100 --> 00:00:04.000\r\n<c.yellow>zur Folge</c> <00:00:03.000>heute.\r\n")
        self.assertEqual(TRS.vtt_to_txt(src), "Hallo & willkommen zur Folge heute.\n")

    def test_paragraph_after_pause_and_dedup(self):
        src = vtt(("00:00:00.000", "00:00:01.000", "Erster Satz."), ("00:00:01.000", "00:00:02.000", "Erster Satz."),
                  ("00:00:02.200", "00:00:03.000", "Zweiter Satz."), ("00:00:06.000", "00:00:07.000", "Nach der Pause."))
        self.assertEqual(TRS.vtt_to_txt(src), "Erster Satz. Zweiter Satz.\n\nNach der Pause.\n")

    def test_long_paragraph_breaks_at_sentence_end(self):
        cues = [(f"00:00:{i:02d}.000", f"00:00:{i:02d}.500", f"Satz Nummer {i} mit etwas Text darin.") for i in range(40)]
        out = TRS.vtt_to_txt(vtt(*cues), max_par=200)
        pars = out.strip().split("\n\n")
        self.assertGreater(len(pars), 3)
        self.assertTrue(all(p.endswith(".") and len(p) < 260 for p in pars))

    def test_hours_and_comma_timestamps(self):
        src = vtt(("01:00:00,000", "01:00:01,000", "Eins."), ("01:00:05,000", "01:00:06,000", "Zwei."))
        self.assertEqual(TRS.vtt_to_txt(src), "Eins.\n\nZwei.\n")

    def test_cjk_joined_without_space(self):
        src = vtt(("00:00:00.000", "00:00:01.000", "こんにちは、"), ("00:00:01.000", "00:00:02.000", "世界。"), ("00:00:02.000", "00:00:03.000", "Copilot です。"))
        self.assertEqual(TRS.vtt_to_txt(src), "こんにちは、世界。Copilot です。\n")

    def test_empty_and_not_vtt(self):
        self.assertEqual(TRS.vtt_to_txt(""), "")
        self.assertEqual(TRS.vtt_to_txt("WEBVTT\n\n"), "")
        self.assertIsNone(TRS.clean_vtt("nur Text ohne Kopf"))
        self.assertIsNone(TRS.clean_vtt("WEBVTT\n\nkeine Cues"))
        self.assertEqual(TRS.clean_vtt("﻿WEBVTT\r\n\r\n00:00:00.000 --> 00:00:01.000\r\nA\r\n"), "WEBVTT\n\n00:00:00.000 --> 00:00:01.000\nA\n")

    def test_real_repo_vtt(self):
        files = sorted((ROOT / "transcripts" / "de").glob("*.vtt"))[:3]
        if not files: self.skipTest("keine Dub-Transkripte im Repo")
        for f in files:
            src = f.read_text("utf-8"); out = TRS.vtt_to_txt(src)
            self.assertNotIn("-->", out); self.assertNotIn("WEBVTT", out)
            self.assertGreater(len(out), 200, f.name)
            first_cue = next(b for b in src.split("\n\n") if "-->" in b).split("\n", 1)[1].split("\n")[0].strip()
            self.assertTrue(out.startswith(first_cue[:30]), f.name)


class Paths(unittest.TestCase):
    def test_rel_files_and_worker_rule(self):
        for rel in ("show/episodes/copilot-agents-explained/", "de/copilot-agenten-erklaert-ki-synchronfassung/", "ja/show/episodes/copilot-agents-explained/", "/pl/show/episodes/x-1/"):
            t, v = TRS.rel_files(rel)
            self.assertTrue(t.endswith("/transcript.txt") and v.endswith("/transcript.vtt") and not t.startswith("/"))
            self.assertRegex("/" + t, TRS.PATH_RX); self.assertRegex("/" + v, TRS.PATH_RX)
        for p in ("/show/transcripts.txt", "/llms.txt", "/show/episodes/transcript.txt", "/de/show/episodes/x/transcript.json", "/show/episodes/x/index.html", "/show/episodes/X/transcript.txt"):
            self.assertIsNone(TRS.PATH_RX.match(p), p)

    def test_same_rule_as_site_worker(self):
        js = (ROOT / "sitewrk" / "index.js").read_text("utf-8")
        m = re.search(r"export const TRANSCRIPT = /(.+)/;", js)
        self.assertIsNotNone(m, "TRANSCRIPT im Site-Worker")
        self.assertEqual(m.group(1).replace("\\/", "/"), TRS.PATH_RX.pattern)


class RegistryTests(unittest.TestCase):
    def setUp(self):
        self.out = {}; self.reg = TRS.Registry()
        self.w = lambda rel, c: self.out.__setitem__(rel, c)

    def test_vtt_gives_both_files(self):
        src = vtt(*[(f"00:00:{i:02d}.000", f"00:00:{i:02d}.900", f"{i}. {LONG}") for i in range(4)])
        u = self.reg.publish(self.w, BASE, "de/meine-folge-ki-synchronfassung/", vtt=src, title="Meine Folge", lang="de", page=BASE + "/de/meine-folge-ki-synchronfassung/", sid=123)
        self.assertEqual(u, {"txt": BASE + "/de/meine-folge-ki-synchronfassung/transcript.txt", "vtt": BASE + "/de/meine-folge-ki-synchronfassung/transcript.vtt"})
        self.assertEqual(self.out["de/meine-folge-ki-synchronfassung/transcript.vtt"], src.strip() + "\n")   # Inhalt unveraendert (nur Rand-Leerraum)
        self.assertTrue(self.out["de/meine-folge-ki-synchronfassung/transcript.txt"].startswith("0. " + LONG.strip()))
        self.assertNotIn("-->", self.out["de/meine-folge-ki-synchronfassung/transcript.txt"])
        self.assertEqual(self.reg.count, {"txt": 1, "vtt": 1})

    def test_txt_only_never_fabricates_vtt(self):
        u = self.reg.publish(self.w, BASE, "show/episodes/ep/", txt=LONG * 3, title="Ep", page=BASE + "/show/episodes/ep/")
        self.assertIsNone(u["vtt"]); self.assertEqual(list(self.out), ["show/episodes/ep/transcript.txt"])

    def test_explicit_txt_wins_over_vtt(self):
        src = vtt(*[(f"00:00:{i:02d}.000", f"00:00:{i:02d}.900", "anders " * 40) for i in range(2)])
        self.reg.publish(self.w, BASE, "show/episodes/ep/", txt=LONG * 3, vtt=src)
        self.assertEqual(self.out["show/episodes/ep/transcript.txt"], (LONG * 3).strip() + "\n")

    def test_too_short_or_invalid_writes_nothing(self):
        self.assertEqual(self.reg.publish(self.w, BASE, "show/episodes/a/", txt="kurz"), {})
        self.assertEqual(self.reg.publish(self.w, BASE, "show/episodes/b/", vtt="kein WEBVTT " * 50), {})
        self.assertEqual(self.reg.publish(self.w, BASE, "show/episodes/c/"), {})
        self.assertEqual(self.out, {}); self.assertEqual(self.reg.entries, [])

    def test_index_files(self):
        self.reg.publish(self.w, BASE, "show/episodes/b/", txt=LONG * 3, title="Beta  Folge", page="pb", sid="77")
        self.reg.publish(self.w, BASE, "de/a/", vtt=vtt(("00:00:00.000", "00:00:01.000", LONG * 3)), title="Alpha", lang="de", page="pa", sid=88)
        self.reg.publish(self.w, BASE, "de/show/episodes/b/", txt=LONG * 3, index=False)   # Kopie fuer die Sprachfassung: nicht im Index
        txt = self.reg.index_txt(BASE).splitlines()
        rows = [x for x in txt if x.startswith("[")]
        self.assertEqual(rows, [f"[en] Beta Folge — {BASE}/show/episodes/b/transcript.txt", f"[de] Alpha — {BASE}/de/a/transcript.txt"])
        j = json.loads(self.reg.index_json("2026-11-05"))
        self.assertEqual(j["count"], 2)
        self.assertEqual(j["by_spreaker_id"]["88"], {"txt": f"{BASE}/de/a/transcript.txt", "vtt": f"{BASE}/de/a/transcript.vtt", "lang": "de", "page": "pa"})
        self.assertIsNone(j["by_spreaker_id"]["77"]["vtt"])

    def test_links_html(self):
        self.assertEqual(TRS.links_html({}), "")
        h = TRS.links_html({"txt": "https://x/a/transcript.txt", "vtt": "https://x/a/transcript.vtt"})
        self.assertIn(">Transcript (TXT)</a>", h); self.assertIn('href="https://x/a/transcript.vtt" type="text/vtt"', h); self.assertIn(">VTT</a>", h)
        self.assertNotIn("VTT</a>", TRS.links_html({"txt": "https://x/a/transcript.txt", "vtt": None}, "Lire la transcription"))

    def test_source_files(self):
        with tempfile.TemporaryDirectory() as d:
            d = Path(d); (d / "podcast").mkdir(); (d / "de").mkdir()
            (d / "podcast" / "123.vtt").write_text("WEBVTT\n", "utf-8"); (d / "de" / "abc.vtt").write_text("WEBVTT\n\nx", "utf-8")
            with patch.object(TRS, "PODCAST_DIR", d / "podcast"), patch.object(TRS, "TR_DIR", d):
                self.assertEqual(TRS.podcast_files("123"), (None, "WEBVTT\n"))
                self.assertEqual(TRS.podcast_files(None), (None, None)); self.assertEqual(TRS.podcast_files("../x"), (None, None))
                self.assertEqual(TRS.dub_vtt("de", "abc"), "WEBVTT\n\nx"); self.assertIsNone(TRS.dub_vtt("fr", "abc"))


class R:
    def __init__(self, code, body=None): self.status_code, self._b = code, body
    def json(self): return self._b


class SpreakerSwitch(unittest.TestCase):
    NEW = BASE + "/show/episodes/x/transcript.vtt"
    RAWU = APT.RAW + "1.vtt"

    def test_decide(self):
        self.assertEqual(APT.decide(self.NEW, self.NEW, True), ("skip", "schon gesetzt"))
        self.assertEqual(APT.decide(self.RAWU, self.NEW, True, self.RAWU), ("set", self.NEW))
        self.assertEqual(APT.decide("", self.NEW, True, self.RAWU), ("set", self.NEW))
        act, why = APT.decide(self.RAWU, self.NEW, False, self.RAWU)   # nicht live: bestehende Folge unveraendert
        self.assertEqual(act, "skip"); self.assertIn("nicht erreichbar", why)
        self.assertEqual(APT.decide("", self.NEW, False, self.RAWU), ("set", self.RAWU))   # neuer Entwurf ohne Transkript: raw-URL wie bisher
        self.assertEqual(APT.decide("", None, False, None)[0], "skip")   # --all ohne eigene Datei und ohne Index: nichts
        self.assertEqual(APT.decide("https://spreaker/x.srt", None, False, self.RAWU)[0], "skip")

    def test_target_prefers_vtt(self):
        e = {"txt": "t", "vtt": "v"}
        self.assertEqual(APT.target(e), ("v", "text/vtt")); self.assertEqual(APT.target(e, ".txt"), ("t", "text/plain"))
        self.assertEqual(APT.target({"txt": "t", "vtt": None}), ("t", "text/plain")); self.assertEqual(APT.target(None), (None, None))

    def test_index_and_head(self):
        self.assertEqual(APT.INDEX, "https://www.m365.fm/show/transcripts.json")
        idx = APT.load_index(lambda u, timeout: R(200, {"by_spreaker_id": {"5": {"txt": "a"}}}))
        self.assertEqual(idx, {"5": {"txt": "a"}})
        self.assertEqual(APT.load_index(lambda u, timeout: R(404)), {})
        def boom(u, timeout): raise OSError("offline")
        self.assertEqual(APT.load_index(boom), {})
        self.assertTrue(APT.is_live(lambda u, timeout, allow_redirects: R(200), self.NEW))
        self.assertFalse(APT.is_live(lambda u, timeout, allow_redirects: R(301), self.NEW))
        self.assertFalse(APT.is_live(lambda u, timeout, allow_redirects: R(404), self.NEW))
        self.assertFalse(APT.is_live(lambda *a, **k: (_ for _ in ()).throw(OSError()), self.NEW))


if __name__ == "__main__":
    unittest.main()
