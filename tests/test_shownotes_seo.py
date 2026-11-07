"""Shownotes SEO: Eingaben, Pruefung, Hash-Ueberspringen, Budget, Seitendarstellung. Keine API-Aufrufe."""
import json, os, tempfile, unittest
from pathlib import Path
from unittest import mock

import rewrite_shownotes as R
import site_shownotes_seo as S
import site_podpage as P

EP = {"slug": "power-bi-gateways", "title": "Power BI Gateways: Keeping Refreshes Reliable", "notes": "Gateways move data from on-premises sources into Power BI. Sign up at https://example.com now!",
      "transcript": "word " * 40000, "transcript_raw": "", "entities": [{"id": "power-bi", "name": "Power BI"}, {"id": "data-gateway", "name": "On-premises data gateway"}]}
GOOD = {"meta": "Learn how Power BI gateways keep scheduled refreshes reliable and what to monitor to avoid failed dataset updates.",
        "summary": "Scheduled refreshes in Power BI fail when the on-premises data gateway is undersized or unmonitored. This summary is for BI admins who run datasets against local sources and want fewer failed refreshes.",
        "key_points": ["A gateway cluster avoids a single point of failure.", "Refresh failures often come from credentials that expired.", "Monitor gateway CPU and memory during refresh windows.", "Separate personal and standard mode gateways."],
        "chapters": [], "entities": ["power-bi", "unknown-id"],
        "faq": [{"q": "Why do Power BI refreshes fail?", "a": "Expired credentials and overloaded gateways are the usual causes."}, {"q": "Do I need a cluster?", "a": "A cluster removes the single point of failure."}]}


class Inputs(unittest.TestCase):
    def test_transcript_cap_first_middle_last(self):
        t = "START " + "a" * 100000 + " MIDDLE " + "b" * 100000 + " END"
        x = R.excerpt(t)
        self.assertLessEqual(len(x), R.TR_TOKENS * R.CHARS_PER_TOKEN + 20)
        self.assertTrue(x.startswith("START")); self.assertTrue(x.endswith("END")); self.assertEqual(x.count("[...]"), 2)
        self.assertEqual(R.excerpt("short text"), "short text")

    def test_prompt_assembly(self):
        user, timed = R.build_input(EP)
        self.assertFalse(timed)
        self.assertIn("Title: Power BI Gateways", user); self.assertIn("power-bi: Power BI", user); self.assertIn("no timestamps", user)
        self.assertLess(len(user), R.TR_TOKENS * R.CHARS_PER_TOKEN + R.NOTES_CHARS + 1500)
        self.assertIn("Existing show notes", user)

    def test_timestamps_only_from_vtt(self):
        vtt = "WEBVTT\n\n" + "\n\n".join(f"{i}\n00:{i // 60:02d}:{i % 60:02d}.000 --> 00:{i // 60:02d}:{i % 60:02d}.900\nline {i} text" for i in range(0, 300, 10))
        self.assertIn("[00:00]", R.timed_text(vtt))
        self.assertIsNone(R.timed_text("plain text without any marks " * 50))
        user, timed = R.build_input({**EP, "transcript_raw": vtt})
        self.assertTrue(timed); self.assertIn("[00:", user)

    def test_candidates(self):
        ents = [{"id": "power-bi", "name": "Power BI", "type": "product"}, {"id": "teams", "name": "Teams", "type": "product"}, {"id": "cat", "name": "Power BI", "type": "category"}]
        c = R.candidates("Power BI Gateways", "we use power bi and teams of admins", "", ents)
        self.assertEqual([x["id"] for x in c], ["power-bi"])   # Einzelwort nur in genauer Schreibweise, Kategorie nie


class Validation(unittest.TestCase):
    def v(self, **kw):
        return R.validate(json.dumps({**GOOD, **kw}), EP)

    def test_ok_and_unknown_entity_dropped(self):
        n, err = self.v()
        self.assertEqual(err, []); self.assertEqual(n["entities"], ["power-bi"]); self.assertNotIn("chapters", n)

    def test_bad_json(self):
        self.assertEqual(R.validate("not json at all", EP)[1], ["kein gueltiges JSON"])
        self.assertIsNone(R.validate('{"meta": ', EP)[0])
        self.assertIsNotNone(R.validate("```json\n" + json.dumps(GOOD) + "\n```", EP)[0])

    def test_url_injection(self):
        for bad in ("See https://evil.example/x for more details on gateways and their configuration options today.", "Visit www.evil.com", "Go to evil.com now", "<a href='x'>click</a>"):
            n, err = self.v(key_points=GOOD["key_points"][:3] + [bad])
            self.assertIsNone(n, bad); self.assertTrue(any("URL" in e for e in err))

    def test_keep_names(self):
        n, err = self.v(summary=GOOD["summary"].replace("Power BI", "PowerBI"))
        self.assertIsNone(n); self.assertTrue(any("veraendert" in e for e in err))
        n, err = self.v(meta=GOOD["meta"].replace("Power BI", "power bi"))
        self.assertIsNone(n)
        text = "Gateways keep refreshes steady and need monitoring so that datasets stay current for every report user."
        n, err = self.v(meta="Gateways keep refreshes reliable.", summary=text * 2, key_points=["Monitor the gateway."] * 4,
                        faq=[{"q": "Why?", "a": "Because."}, {"q": "How?", "a": "Monitor."}])
        self.assertTrue(any("Name fehlt" in e for e in err))   # Titel nennt Power BI, der Text nicht

    def test_limits(self):
        self.assertIsNone(self.v(meta="x" * 161)[0]); self.assertIsNone(self.v(key_points=["one", "two"])[0]); self.assertIsNone(self.v(faq=[])[0])

    def test_chapters_only_with_timestamps(self):
        ch = [{"t": "00:10", "title": "a"}, {"t": "05:00", "title": "b"}, {"t": "09:00", "title": "c"}]
        self.assertNotIn("chapters", self.v(chapters=ch)[0])   # Auszug ohne Zeitmarken
        ep = {**EP, "transcript_raw": "WEBVTT\n\n" + "\n\n".join(f"{i}\n00:{i // 60:02d}:{i % 60:02d}.000 --> 00:{i // 60:02d}:{i % 60:02d}.900\nline {i}" for i in range(0, 700, 30))}
        n, err = R.validate(json.dumps({**GOOD, "chapters": [{"t": "05:00", "title": "b"}, {"t": "00:00", "title": "a"}, {"t": "09:00", "title": "c"}, {"t": "99:99", "title": "x"}]}), ep)
        self.assertEqual(err, []); self.assertEqual([c["t"] for c in n["chapters"]], ["00:00", "05:00", "09:00"])


class SkipAndBudget(unittest.TestCase):
    def test_hash_skip_and_change(self):
        h = R.source_hash(EP)
        store = {EP["slug"]: {"h_src": h, "v": R.VERSION, "notes": GOOD, "model": "m", "ts": "t"}}
        self.assertEqual(R.pending([EP], store, {}), [])
        self.assertEqual(len(R.pending([{**EP, "notes": "changed notes"}], store, {})), 1)
        self.assertEqual(len(R.pending([EP], {}, {})), 1)
        self.assertEqual(len(R.pending([EP], {EP["slug"]: {**store[EP["slug"]], "v": R.VERSION - 1}}, {})), 1)

    def test_max_three_tries(self):
        h = R.source_hash(EP)
        self.assertEqual(R.pending([EP], {}, {EP["slug"]: {"h": h, "n": 2}}), [(EP, h)])
        self.assertEqual(R.pending([EP], {}, {EP["slug"]: {"h": h, "n": 3}}), [])
        self.assertEqual(len(R.pending([EP], {}, {EP["slug"]: {"h": "old", "n": 3}})), 1)   # neue Eingabe: Zaehler beginnt neu

    def test_apply_results_counts_tries_and_stores(self):
        h = R.source_hash(EP); store, tries = {}, {}
        ok_line = json.dumps({"custom_id": "n1", "result": {"type": "succeeded", "message": {"content": [{"type": "text", "text": json.dumps(GOOD)}], "usage": {"input_tokens": 3000, "output_tokens": 500}}}})
        bad_line = json.dumps({"custom_id": "n1", "result": {"type": "succeeded", "message": {"content": [{"type": "text", "text": "oops"}], "usage": {"input_tokens": 10, "output_tokens": 5}}}})
        self.assertEqual(R.apply_results([bad_line], {"n1": [EP["slug"], h]}, {EP["slug"]: EP}, store, tries)[:2], (0, 1))
        R.apply_results([bad_line], {"n1": [EP["slug"], h]}, {EP["slug"]: EP}, store, tries)
        self.assertEqual(tries[EP["slug"]]["n"], 2)
        self.assertEqual(R.apply_results([ok_line], {"n1": [EP["slug"], h]}, {EP["slug"]: EP}, store, tries)[:2], (1, 0))
        self.assertEqual(store[EP["slug"]]["h_src"], h); self.assertNotIn(EP["slug"], tries)

    def test_budget_stop(self):
        items = [({**EP, "slug": f"s{i}"}, "h") for i in range(50)]
        one = R.estimate_usd(EP); self.assertGreater(one, 0)
        sel = R.select_within_budget(items, 0, one * 10.5)
        self.assertEqual(len(sel), 10)
        self.assertEqual(R.select_within_budget(items, 0, 100, limit=3).__len__(), 3)
        self.assertEqual(R.select_within_budget(items, 29.99999, 30), [])

    def test_main_stops_at_monthly_cap_without_api(self):
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "data").mkdir()
            (Path(tmp) / "data" / "spend.json").write_text(json.dumps({R.month_key(): {"usd": 999}, "shownotes": {R.month_key(): {"usd": 31}}}), "utf-8")
            with mock.patch.object(R, "ROOT", Path(tmp)), mock.patch.object(S, "DIR", Path(tmp) / "shownotes_en"), mock.patch.dict(os.environ, {"ANTHROPIC_API_KEY": "x"}), \
                 mock.patch.object(R, "load_episodes", return_value=[EP]), mock.patch.object(R, "api", side_effect=AssertionError("API darf nicht aufgerufen werden")):
                R.main([])   # Artikel-Ausgaben (999) zaehlen nicht, die eigenen 31 USD schon

    def test_own_spend_key(self):
        sd = {"2026-11": {"usd": 10}}
        R.add_spend(sd, 1.5, 100, 50, 2, "2026-11"); R.add_spend(sd, 0.5, 1, 1, 1, "2026-11")
        self.assertEqual(sd["2026-11"]["usd"], 10); self.assertEqual(R.spent_usd(sd, "2026-11"), 2.0)

    def test_store_roundtrip(self):
        with tempfile.TemporaryDirectory() as tmp:
            d = Path(tmp)
            S.save_all({EP["slug"]: {"h_src": "h", "v": 1, "notes": GOOD, "model": "m", "ts": "t"}}, d)
            self.assertEqual(S.load_all(d)[EP["slug"]]["notes"]["meta"], GOOD["meta"]); self.assertEqual(len(list(d.glob("*.json.gz"))), 1)


class Render(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.addCleanup(self.tmp.cleanup)
        self.ep = next(e for e in P.load("episodes") if e.get("published") not in (False, "False") and len(P.plain(e.get("show_notes"))) > 200)
        self.ents = {"power-bi": {"id": "power-bi", "name": "Power BI"}}
        self.old = ("<aside class='kp'>OLD-KP</aside>", "<p>OLD-NOTES</p>", "<section class='faq'>OLD-FAQ</section>", [{"@type": "FAQPage", "old": 1}, {"@type": "BreadcrumbList"}])
        p1 = mock.patch.object(S, "DIR", Path(self.tmp.name)); p2 = mock.patch.dict(S._CACHE, clear=True); p1.start(); p2.start(); self.addCleanup(p1.stop); self.addCleanup(p2.stop)

    def test_without_rewritten_notes_old_stays(self):
        r = S.choose(self.ep["slug"], self.ents, "https://www.m365.fm", self.old)
        self.assertEqual(r, (*self.old, False))

    def test_with_rewritten_notes(self):
        notes = {**GOOD, "entities": ["power-bi"], "chapters": [{"t": "00:00", "title": "Intro"}]}
        S.save_all({self.ep["slug"]: {"h_src": "h", "v": 1, "notes": notes, "model": "m", "ts": "t"}}); S._CACHE.clear()
        kp, html, faq, ld, used = S.choose(self.ep["slug"], self.ents, "https://www.m365.fm", self.old)
        self.assertTrue(used)
        self.assertIn("Monitor gateway CPU", kp); self.assertNotIn("OLD", kp + html + faq)
        self.assertIn('href="https://www.m365.fm/entity/power-bi/"', html); self.assertIn("00:00", html); self.assertIn("Why do Power BI refreshes fail?", faq)
        self.assertEqual([x["@type"] for x in ld].count("FAQPage"), 1); self.assertIn("BreadcrumbList", [x["@type"] for x in ld])
        self.assertNotIn(1, [x.get("old") for x in ld])   # altes FAQPage-Schema ersetzt, nie doppelt
        self.assertLess(len(kp + html + faq), 6000)   # schlank
        self.assertNotIn("https://evil", html)
        src = S.html_for_translation(notes, self.ents, "https://www.m365.fm")
        self.assertIn("<h3>Why do Power BI refreshes fail?</h3>", src); self.assertEqual(P.san(src).count("<li>"), len(notes["key_points"]) + 1)


if __name__ == "__main__":
    unittest.main()
