"""Shownotes SEO: Eingaben, Pruefung, Hash-Ueberspringen, Budget, Seitendarstellung. Keine API-Aufrufe."""
import io, json, os, shutil, subprocess, sys, tempfile, unittest, urllib.error
from pathlib import Path
from unittest import mock

import rewrite_shownotes as R
import site_shownotes_seo as S
import site_podpage as P
import site_notes as SNT
import show_notes as SN

ROOT = Path(__file__).resolve().parent.parent

EP = {"slug": "power-bi-gateways", "rule": "thin", "title": "Power BI Gateways: Keeping Refreshes Reliable", "notes": "Gateways move data from on-premises sources into Power BI. Sign up at https://example.com now!",
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
        sel, est = R.select_within_budget(items, 0, one * 10.5)
        self.assertEqual(len(sel), 10); self.assertAlmostEqual(est, one * 10)
        self.assertEqual(len(R.select_within_budget(items, 0, 100, limit=3)[0]), 3)
        self.assertEqual(R.select_within_budget(items, 29.99999, 30), ([], 0))

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
        src = S.html_for_translation(notes)
        self.assertIn("<h3>Why do Power BI refreshes fail?</h3>", src); self.assertEqual(P.san(src).count("<li>"), len(notes["key_points"]) + 1)
        self.assertNotIn("<a ", src); self.assertNotIn("entity/power-bi", src)   # Themen-Zeile setzt der Seitenbau, sie ist nicht Teil der Uebersetzungsquelle (316-3)


# ---------------- 316-1: Denken je Modell abschalten (Anthropic-Modellreferenz), max_tokens und Kostenobergrenze passen dazu ----------------
class RequestShape(unittest.TestCase):
    def params(self, model):
        with mock.patch.object(R, "MODEL", model): return R.request_for(EP, "n1")["params"]

    def test_sonnet_5_5_turns_thinking_off_with_between_tools(self):
        p = self.params("claude-sonnet-5-5")
        self.assertEqual(p["thinking"], {"type": "between_tools"})   # {"type": "disabled"} beantwortet Sonnet 5.5 mit HTTP 400
        self.assertEqual(p["max_tokens"], R.OUT_TOKENS); self.assertEqual(p["model"], "claude-sonnet-5-5")
        for k in ("fallbacks", "temperature", "output_config"): self.assertNotIn(k, p)   # fallbacks lehnt die Batch-API ab; effort bleibt beim Standard (high)

    def test_haiku_sends_disabled(self):
        p = self.params("claude-haiku-5-5")
        self.assertEqual(p["thinking"], {"type": "disabled"}); self.assertEqual(p["max_tokens"], R.OUT_TOKENS)

    def test_other_models_omit_the_field_and_get_room_for_thinking(self):
        for m in ("claude-sonnet-5", "claude-opus-5-5"):
            p = self.params(m)
            self.assertNotIn("thinking", p, m); self.assertEqual(p["max_tokens"], R.OUT_TOKENS + R.THINK_TOKENS, m)

    def test_cost_upper_bound_follows_max_tokens(self):
        import generate_articles as GA
        with mock.patch.object(R, "MODEL", "claude-sonnet-5-5"): a = R.estimate_usd(EP)
        with mock.patch.object(R, "MODEL", "claude-sonnet-5"): b = R.estimate_usd(EP)
        self.assertAlmostEqual(b - a, R.THINK_TOKENS * GA.price_of("claude-sonnet-5")["out"] / 1e6 * 0.5, places=7)
        user, _ = R.build_input(EP); realistic = GA.cost_usd(len(R.SYSTEM + user) / 4, 900, 0, 0, "claude-sonnet-5-5") * 0.5
        self.assertGreater(a, realistic)   # Obergrenze, nicht Erwartungswert: der Monatsdeckel haelt auch, wenn jede Anfrage gelingt

    def test_hard_cap_cannot_be_raised(self):
        self.assertEqual(R.HARD_CAP_USD, 30.0); self.assertLessEqual(R.BUDGET_USD, 30.0)
        import importlib
        with mock.patch.dict(os.environ, {"SHOWNOTES_BUDGET_USD": "500"}):
            try: importlib.reload(R); self.assertEqual(R.BUDGET_USD, 30.0)
            finally: os.environ.pop("SHOWNOTES_BUDGET_USD", None); importlib.reload(R)

    def test_reservation_counts_against_the_cap_until_collected(self):
        sd = {}; R.reserve(sd, 12.5, "2026-11"); self.assertEqual(R.spent_usd(sd, "2026-11"), 12.5)
        R.reserve(sd, -12.5, "2026-11"); R.add_spend(sd, 3.0, 1, 1, 1, "2026-11")
        self.assertEqual(R.spent_usd(sd, "2026-11"), 3.0); self.assertNotIn("reserved", sd["shownotes"]["2026-11"])


# ---------------- 316-8: Ausfaelle der API sind keine inhaltlichen Fehlversuche ----------------
def _line(cid, result):
    return json.dumps({"custom_id": cid, "result": result})


ERRORED = {"type": "errored", "error": {"type": "error", "error": {"type": "invalid_request_error", "message": "thinking.type.disabled is not supported for this model"}}}


class ApiFailures(unittest.TestCase):
    def test_errored_expired_canceled_leave_tries_alone_and_keep_the_reason(self):
        h = R.source_hash(EP); tries = {EP["slug"]: {"h": h, "n": 2, "err": "x"}}; store = {}
        lines = [_line("n1", ERRORED), _line("n2", {"type": "expired"}), _line("n3", {"type": "canceled"})]
        ok, bad, tin, tout, api, dropped = R.apply_results(lines, {f"n{i}": [EP["slug"], h] for i in (1, 2, 3)}, {EP["slug"]: EP}, store, tries)
        self.assertEqual((ok, bad, dropped), (0, 0, 0)); self.assertEqual(tries[EP["slug"]]["n"], 2)
        self.assertEqual(sum(api.values()), 3); self.assertIn("errored: invalid_request_error thinking.type.disabled is not supported for this model", api)
        self.assertEqual(set(api) - {k for k in api if k.startswith("errored")}, {"expired", "canceled"})

    def test_three_failed_runs_do_not_lock_the_episode_out(self):
        h = R.source_hash(EP); tries = {}
        for _ in range(4): R.apply_results([_line("n1", ERRORED)], {"n1": [EP["slug"], h]}, {EP["slug"]: EP}, {}, tries)
        self.assertEqual(tries, {}); self.assertEqual(R.pending([EP], {}, tries), [(EP, h)])

    def test_content_failures_still_count(self):
        h = R.source_hash(EP); tries = {}
        mt = {"type": "succeeded", "message": {"stop_reason": "max_tokens", "content": [], "usage": {"input_tokens": 5, "output_tokens": 1500}}}
        rf = {"type": "succeeded", "message": {"stop_reason": "refusal", "stop_details": {"category": "cyber"}, "content": [], "usage": {"input_tokens": 5, "output_tokens": 0}}}
        self.assertEqual(R.apply_results([_line("n1", mt)], {"n1": [EP["slug"], h]}, {EP["slug"]: EP}, {}, tries)[:2], (0, 1))
        R.apply_results([_line("n1", rf)], {"n1": [EP["slug"], h]}, {EP["slug"]: EP}, {}, tries)
        self.assertEqual(tries[EP["slug"]]["n"], 2); self.assertIn("refusal cyber", tries[EP["slug"]]["err"])

    def test_result_for_episode_that_is_no_longer_thin_is_dropped_without_a_try(self):
        h = R.source_hash(EP); tries, store = {}, {}
        good = {"type": "succeeded", "message": {"stop_reason": "end_turn", "content": [{"type": "text", "text": json.dumps(GOOD)}], "usage": {"input_tokens": 5, "output_tokens": 5}}}
        r = R.apply_results([_line("n1", good)], {"n1": [EP["slug"], h]}, {EP["slug"]: {**EP, "rule": "edited"}}, store, tries)
        self.assertEqual(r[5], 1); self.assertEqual((store, tries), ({}, {}))

    def run_main(self, tmp, lines=None, post_error=None):
        D = Path(tmp) / "data"; D.mkdir(exist_ok=True)

        def api(method, path, body=None):
            if method == "POST":
                if post_error: raise post_error
                return {"id": "b1"}
            return {"processing_status": "ended", "request_counts": {}, "results_url": "https://api.anthropic.com/v1/messages/batches/b1/results"}
        with mock.patch.object(R, "ROOT", Path(tmp)), mock.patch.object(S, "DIR", Path(tmp) / "shownotes_en"), mock.patch.dict(os.environ, {"ANTHROPIC_API_KEY": "x"}), \
             mock.patch.object(R, "load_episodes", return_value=[EP]), mock.patch.object(R, "api", api), mock.patch.object(R, "anthropic_request", lambda *a, **k: "req"), \
             mock.patch.object(R, "urlopen", lambda req, timeout=0: io.BytesIO("\n".join(lines or []).encode())), mock.patch.object(R.time, "sleep", lambda s: None):
            return R.main([])

    def test_main_fails_visibly_but_saves_everything(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = io.StringIO()
            with self.assertRaises(SystemExit) as cm, mock.patch("sys.stdout", out): self.run_main(tmp, [_line("n00000", ERRORED)])
            self.assertIn("ohne Ergebnis", str(cm.exception))
            self.assertIn("invalid_request_error", out.getvalue())   # Grund im Protokoll
            self.assertEqual(R.load_tries(Path(tmp) / "shownotes_en"), {})
            m = json.loads((Path(tmp) / "data" / "spend.json").read_text())["shownotes"][R.month_key()]
            self.assertNotIn("reserved", m); self.assertEqual(m["usd"], 0); self.assertFalse((Path(tmp) / "shownotes_en" / "_batch.json").exists())

    def test_http_error_on_submit_logs_reason_and_books_nothing(self):
        with tempfile.TemporaryDirectory() as tmp:
            err = urllib.error.HTTPError("https://api.anthropic.com/v1/messages/batches", 400, "Bad Request", {}, io.BytesIO(b'{"error":{"message":"bad"}}'))
            with self.assertRaises(urllib.error.HTTPError): self.run_main(tmp, post_error=err)
            self.assertFalse((Path(tmp) / "data" / "spend.json").exists()); self.assertEqual(R.load_tries(Path(tmp) / "shownotes_en"), {})

    def test_api_prints_the_reason_of_an_http_error(self):
        import urllib.request
        err = urllib.error.HTTPError("https://api.anthropic.com/v1/messages/batches", 400, "Bad Request", {}, io.BytesIO(b'{"type":"error","error":{"type":"invalid_request_error","message":"nope"}}'))
        out = io.StringIO()
        with mock.patch.object(R, "anthropic_request", lambda *a, **k: urllib.request.Request("https://api.anthropic.com/v1/messages/batches")), \
             mock.patch.object(R, "urlopen", mock.Mock(side_effect=err)), mock.patch.dict(os.environ, {"ANTHROPIC_API_KEY": "secret-value"}), mock.patch("sys.stdout", out):
            with self.assertRaises(urllib.error.HTTPError): R.api("POST", "/v1/messages/batches", {})
        self.assertIn("API-Fehler 400", out.getvalue()); self.assertIn("nope", out.getvalue()); self.assertNotIn("secret-value", out.getvalue())


# ---------------- 316-3: Entitaeten aendern weder den Quell-Hash noch die Uebersetzungsquelle ----------------
class StableHash(unittest.TestCase):
    def test_entity_list_does_not_change_the_source_hash(self):
        h = R.source_hash(EP)
        self.assertEqual(R.source_hash({**EP, "entities": []}), h)
        self.assertEqual(R.source_hash({**EP, "entities": EP["entities"] + [{"id": "x", "name": "Xyz Product", "type": "product"}]}), h)
        self.assertNotEqual(R.source_hash({**EP, "notes": EP["notes"] + " more"}), h); self.assertNotEqual(R.source_hash({**EP, "title": "Other title"}), h)

    def test_entity_rename_does_not_change_the_translation_source(self):
        notes = {**GOOD, "entities": ["power-bi"]}; base = "https://www.m365.fm"
        a = S.topics_html(notes, {"power-bi": {"id": "power-bi", "name": "Power BI"}}, base); b = S.topics_html(notes, {"power-bi": {"id": "power-bi", "name": "Microsoft Power BI"}}, base)
        self.assertNotEqual(a, b); self.assertIn('href="https://www.m365.fm/entity/power-bi/"', a)
        src = S.html_for_translation(notes)   # haengt nicht von den Entitaeten ab
        self.assertNotIn("<a ", src); self.assertEqual(src, S.html_for_translation({**notes, "entities": []}))


# ---------------- 316-4: nur duenne Show Notes werden ersetzt (Entscheidung Mirko, 9.11.2026) ----------------
def thin_ep(n=600, slug="thin-ep", **kw):
    return {"slug": slug, "name": "Gateways in Practice", "show_notes": "<p>" + "a" * n + "</p>", "create_time": "2026-11-01T00:00:00", **kw}


class ThinRule(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.addCleanup(self.tmp.cleanup)
        for p in (mock.patch.object(S, "DIR", Path(self.tmp.name)), mock.patch.dict(S._CACHE, clear=True)): p.start(); self.addCleanup(p.stop)

    def test_threshold_1499_and_1500(self):
        self.assertTrue(S.is_thin("<p>" + "a" * 1499 + "</p>")); self.assertFalse(S.is_thin("<p>" + "a" * 1500 + "</p>"))
        self.assertEqual(S.rule(thin_ep(1499)), "thin"); self.assertEqual(S.rule(thin_ep(1500)), "long")

    def test_html_heavy_notes_count_plain_text_only(self):
        heavy = "<div class='x'>" + "".join(f'<p><a href="https://example.com/{"x" * 200}/{i}"><strong>w{i}</strong></a></p>' for i in range(30)) + "</div>"
        self.assertGreater(len(heavy), 6000); self.assertTrue(S.is_thin(heavy))
        self.assertTrue(S.is_thin("<p>" + "&amp;" * 1000 + "</p>"))   # Entity = ein Zeichen
        self.assertEqual(S.rule({"slug": "x", "name": "x", "show_notes": "<p>short</p><script>" + "x" * 5000 + "</script>"}), "thin")   # wie im Seitenbau bereinigt (site_podpage.san)
        self.assertEqual(S.rule({"slug": "x", "name": "x", "show_notes": "<p>" + "word " * 400 + "</p>"}), "long")

    def test_rule_order_full_edited_long_unknown(self):
        self.assertEqual(S.rule(thin_ep(), full=True), "full")
        self.assertEqual(S.rule(thin_ep(), {"id": "1", "markup": "short", "edited": True}, edits_known=True), "edited")
        rec = {"id": "1", "markup": "Short Spreaker notes.", "edited": False}
        self.assertEqual(S.rule(thin_ep(3000), rec, edits_known=True), "thin")   # Spreaker-Text geht vor der Podpage-Sicherung (wie im Seitenbau)
        self.assertEqual(S.rule(thin_ep(), {"id": "1", "markup": "x " * 2000, "edited": False}, edits_known=True), "long")
        self.assertEqual(S.rule(thin_ep(), rec, edits_known=False), "unknown")   # Editor-Export fehlt: nicht ersetzen, nicht bezahlen

    def test_only_thin_episodes_are_paid_for(self):
        eps = [{**EP, "slug": f"s-{r}", "rule": r} for r in ("thin", "long", "edited", "full", "unknown", "empty")]
        self.assertEqual([e["slug"] for e, _ in R.pending(eps, {}, {})], ["s-thin"])
        ov = R.overview(eps, {}, {}); self.assertEqual((ov["thin"], ov["long"], ov["edited"], ov["full"], ov["unknown"], ov["empty"], ov["open"]), (1, 1, 1, 1, 1, 1, 1))

    def test_for_page_changes_only_thin_pages_and_keeps_manual_meta(self):
        old = ("<aside>OLD-KP</aside>", "<p>OLD</p>", "<section>OLD-FAQ</section>", [{"@type": "FAQPage", "old": 1}])
        ents, base = {"power-bi": {"id": "power-bi", "name": "Power BI"}}, "https://www.m365.fm"
        slugs = ["thin-ep", "long-ep", "edited-ep", "full-ep", "manual-ep"]
        S.save_all({s: {"h_src": "h", "v": 1, "notes": {**GOOD, "entities": ["power-bi"]}, "model": "m", "ts": "t"} for s in slugs}); S._CACHE.clear()
        for e, nrec, full, want in ((thin_ep(3000, "long-ep"), None, False, "long"), (thin_ep(slug="edited-ep"), {"id": "1", "markup": "x", "edited": True}, False, "edited"),
                                    (thin_ep(slug="full-ep"), None, True, "full")):
            r = S.for_page(e, nrec, full, old, ents, base)
            self.assertEqual(r[5], want); self.assertIsNone(r[6]); self.assertEqual(r[4], "")
            for a, b in zip(r[:4], old): self.assertIs(a, b)   # Seite unveraendert: gleiche Bloecke, gleiches JSON-LD
        self.assertEqual(S.for_page({**thin_ep(3000, "long-ep"), "meta_description": "Manual."}, None, False, old, ents, base)[4], "Manual.")
        kp, html, faq, ld, desc, rule, n = S.for_page(thin_ep(), None, False, old, ents, base)
        self.assertEqual(rule, "thin"); self.assertEqual(desc, GOOD["meta"]); self.assertNotIn("OLD", kp + html + faq); self.assertEqual([x["@type"] for x in ld], ["FAQPage"])
        self.assertEqual(S.for_page(thin_ep(slug="manual-ep", meta_description="Manual."), None, False, old, ents, base)[4], "Manual.")   # von Hand gesetzte Beschreibung geht vor
        r = S.for_page(thin_ep(slug="no-rewrite-yet"), None, False, old, ents, base)
        self.assertEqual(r[5], "thin"); self.assertIsNone(r[6]); self.assertIs(r[1], old[1])

    def test_thin_page_passes_check_titles_and_check_schema(self):
        import generate_site as G
        import check_titles as CT
        S.save_all({"thin-ep": {"h_src": "h", "v": 1, "notes": {**GOOD, "entities": ["power-bi"]}, "model": "m", "ts": "t"}}); S._CACHE.clear()
        e = thin_ep(); base = "https://www.m365.fm"; root = f"{base}/show/"; url = f"{root}episodes/{e['slug']}/"
        kp, html, faq, nld, desc, rule, n = S.for_page(e, None, False, ("", "<p>old</p>", "", []), {"power-bi": {"id": "power-bi", "name": "Power BI"}}, base)
        self.assertEqual(rule, "thin"); self.assertTrue(n)
        ld = {"@context": "https://schema.org", "@type": "PodcastEpisode", "@id": url + "#episode", "name": e["name"], "url": url, "datePublished": "2026-11-01", "description": desc,
              "partOfSeries": {"@id": root + "#series", "@type": "PodcastSeries", "name": "M365.FM Podcast", "url": root}, "inLanguage": "en"}
        h = G.page("en", f"{e['name']} – M365.FM Podcast", desc[:300], url, f"<h1>{e['name']}</h1>{kp}{html}{faq}", None, [ld] + nld, xdefault=url, og_type="article")
        with tempfile.TemporaryDirectory() as tmp:
            f = Path(tmp) / "docs" / "show" / "episodes" / e["slug"] / "index.html"; f.parent.mkdir(parents=True); f.write_text(h, "utf-8")
            out = io.StringIO()
            with mock.patch.object(CT, "ROOT", Path(tmp)), mock.patch("sys.stdout", out): rc = CT.main()
            self.assertEqual(rc, 0, out.getvalue()); self.assertIn("1 Seiten geprueft: 0 Fehler", out.getvalue())
            r = subprocess.run([sys.executable, str(ROOT / "check_schema.py"), str(Path(tmp) / "docs")], capture_output=True, text=True)
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr); self.assertNotIn("FEHLER", r.stdout)


# ---------------- 316-9: Produktnamen mit Punkt und klein geschriebene Begriffe sind kein Fehler ----------------
EP9 = {**EP, "entities": EP["entities"] + [{"id": "conditional-access", "name": "Conditional Access", "type": "concept"}, {"id": "generative-ai", "name": "Generative AI", "type": "concept"},
                                            {"id": "data-governance", "name": "Data Governance", "type": "concept"}, {"id": "asp-net-core", "name": "ASP.NET Core", "type": "product"},
                                            {"id": "ediscovery-premium", "name": "eDiscovery Premium", "type": "product"}]}
ACCEPTED = ["Migrate ASP.NET Core apps and ML.NET models without a rewrite.", "VB.NET code still runs many line-of-business tools.", "The M365.FM team explains why gateways matter.",
            "Node.js and .NET services can share one gateway.", "Good data governance keeps refreshes predictable.", "Conditional access policies protect the gateway admin portal.",
            "Teams adopting generative AI need clear data rules.", "EDiscovery Premium helps legal teams with holds."]
REJECTED = [("See asp.net for details.", "URL"), ("Visit m365.fm today.", "URL"), ("Go to evil.com now.", "URL"), ("Read https://x.example/a first.", "URL"),
            ("PowerBI admins often skip monitoring.", "veraendert"), ("Most power bi admins skip monitoring.", "veraendert"), ("Use eDiscovery premium for holds.", "veraendert")]


class ValidatorNames(unittest.TestCase):
    def check(self, text):
        return R.validate(json.dumps({**GOOD, "key_points": GOOD["key_points"][:3] + [text]}), EP9)

    def test_accepted(self):
        for t in ACCEPTED:
            n, err = self.check(t); self.assertEqual(err, [], t); self.assertIn(t, n["key_points"])

    def test_rejected(self):
        for t, why in REJECTED:
            n, err = self.check(t); self.assertIsNone(n, t); self.assertTrue(any(why in e for e in err), (t, err))

    def test_title_with_dotted_name_can_be_repeated(self):
        ep = {**EP, "title": "Modern .NET: WPF, ASP.NET Core, and gRPC with an MVP", "entities": []}
        good = {**GOOD, "summary": "Modern .NET work with WPF, ASP.NET Core and gRPC: " + GOOD["summary"], "meta": "WPF, ASP.NET Core and gRPC in modern .NET apps explained for developers."}
        self.assertEqual(R.validate(json.dumps(good), ep)[1], [])


# ---------------- 316-10: Show Notes neuer Spreaker-Folgen (data/show_notes/en.json, Ebene "episodes") ----------------
class SpreakerNotes(unittest.TestCase):
    def test_new_spreaker_episode_is_rewritten_from_its_spreaker_notes(self):
        real = json.loads((ROOT / "data" / "show_notes" / "en.json").read_text("utf-8"))
        self.assertEqual(sorted(real)[:3], ["episodes", "lang", "show"])   # Datensaetze stehen unter "episodes", nicht auf oberster Ebene
        sid, rec = next((k, r) for k, r in real["episodes"].items() if R.MIN_NOTES <= len(P.plain(SN.render_html(r.get("markup") or ""))) < S.THIN_CHARS and r.get("key"))
        with tempfile.TemporaryDirectory() as tmp:
            d = Path(tmp) / "data"; (d / "show_notes").mkdir(parents=True)
            (d / "show_notes" / "en.json").write_text(json.dumps({"show": real["show"], "lang": "en", "episodes": {sid: rec}}), "utf-8")
            (d / "entities.json").write_text("[]", "utf-8")
            e = {"slug": "new-spreaker-ep", "name": rec["title"], "show_notes": "", "create_time": "2026-11-09T00:00:00", "published": True, "source": "spreaker", "id": 1}
            with mock.patch.object(SNT, "ROOT", Path(tmp)), mock.patch.dict(SNT.NOTES, clear=True), mock.patch.dict(SNT.OVER, clear=True), mock.patch.dict(SNT.EDITS, {"known": False}), \
                 mock.patch.object(SNT, "_fetch_json", lambda url, timeout=120: {"notes": {}}), mock.patch.object(R.P, "load", lambda name: [e]):
                eps = R.load_episodes(root=Path(tmp), pages=S.Pages(Path(tmp)))
        self.assertEqual(len(eps), 1); self.assertEqual(eps[0]["rule"], "thin")
        want = P.plain(SN.render_html(rec["markup"]))
        self.assertEqual(eps[0]["notes"], want); self.assertIn(want[:80], R.build_input(eps[0])[0])

    def test_without_editor_export_nothing_is_sent(self):
        with tempfile.TemporaryDirectory() as tmp:
            d = Path(tmp) / "data"; (d / "show_notes").mkdir(parents=True); (d / "entities.json").write_text("[]", "utf-8")
            (d / "show_notes" / "en.json").write_text(json.dumps({"show": "x", "lang": "en", "episodes": {"9": {"id": "9", "title": "Ep Nine", "key": "ep nine", "markup": "Short notes " * 50}}}), "utf-8")
            e = {"slug": "ep-nine", "name": "Ep Nine", "show_notes": "", "create_time": "2026-11-09T00:00:00", "published": True}
            with mock.patch.object(SNT, "ROOT", Path(tmp)), mock.patch.dict(SNT.NOTES, clear=True), mock.patch.dict(SNT.OVER, clear=True), mock.patch.dict(SNT.EDITS, {"known": True}), \
                 mock.patch.object(SNT, "_fetch_json", lambda url, timeout=120: None), mock.patch.object(R.P, "load", lambda name: [e]):
                eps = R.load_episodes(root=Path(tmp), pages=S.Pages(Path(tmp)))
        self.assertEqual(eps[0]["rule"], "unknown"); self.assertEqual(R.pending(eps, {}, {}), [])


# ---------------- 316-5: bezahlte Ergebnisse gehen nicht an einem abgelehnten Push verloren ----------------
class WorkflowPush(unittest.TestCase):
    def setUp(self):
        import yaml
        wf = yaml.safe_load((ROOT / ".github" / "workflows" / "shownotes-seo.yml").read_text("utf-8"))
        steps = wf["jobs"]["shownotes"]["steps"]
        self.save = next(s for s in steps if s.get("name", "").startswith("Speichern"))
        self.final = next(s for s in steps if s.get("name", "").startswith("Daten committen"))
        self.tmp = Path(tempfile.mkdtemp()); self.addCleanup(shutil.rmtree, self.tmp, True)
        g = lambda *a, cwd=None: subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@example.test", *a], cwd=cwd, check=True, capture_output=True, text=True)
        self.g = g
        g("init", "-q", "--bare", "-b", "main", str(self.tmp / "origin.git"))
        hook = self.tmp / "origin.git" / "hooks" / "pre-receive"; self.rejects = self.tmp / "rejects"
        hook.write_text(f'#!/bin/sh\nn=$(cat "{self.rejects}" 2>/dev/null || echo 0)\nif [ "$n" -gt 0 ]; then echo $((n-1)) > "{self.rejects}"; echo "abgelehnt" >&2; exit 1; fi\nexit 0\n'); hook.chmod(0o755)
        g("clone", "-q", str(self.tmp / "origin.git"), str(self.tmp / "seed")); seed = self.tmp / "seed"
        (seed / "data").mkdir(); (seed / "data" / "spend.json").write_text("{}"); g("add", "-A", cwd=seed); g("commit", "-q", "-m", "start", cwd=seed); g("push", "-q", "origin", "HEAD:main", cwd=seed)
        g("clone", "-q", str(self.tmp / "origin.git"), str(self.tmp / "run")); self.run_dir = self.tmp / "run"
        g("commit", "-q", "--allow-empty", "-m", "anderer Bot", cwd=seed); g("push", "-q", "origin", "HEAD:main", cwd=seed)   # main hat sich seit dem Checkout bewegt
        bin_ = self.tmp / "bin"; bin_.mkdir(); (bin_ / "sleep").write_text("#!/bin/sh\nexit 0\n"); (bin_ / "sleep").chmod(0o755)
        self.env = {**os.environ, "PATH": f"{bin_}{os.pathsep}{os.environ['PATH']}", "GITHUB_STEP_SUMMARY": str(self.tmp / "summary.md"), "GIT_TERMINAL_PROMPT": "0"}

    def step(self, s):
        return subprocess.run(["bash", "--noprofile", "--norc", "-eo", "pipefail", "-c", s["run"]], cwd=self.run_dir, env=self.env, capture_output=True, text=True)

    def origin_log(self):
        return self.g("--git-dir", str(self.tmp / "origin.git"), "log", "--format=%s", "main").stdout

    def paid_result(self):
        (self.run_dir / "data" / "shownotes_en").mkdir(parents=True, exist_ok=True); (self.run_dir / "data" / "shownotes_en" / "0.json.gz").write_bytes(b"x")
        (self.run_dir / "data" / "spend.json").write_text('{"shownotes": {"2026-11": {"usd": 3.1}}}')

    def test_rejected_push_is_retried_after_rebase(self):
        self.paid_result(); self.rejects.write_text("1")
        r = self.step(self.save)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr); self.assertIn("neu geschrieben", self.origin_log()); self.assertIn("anderer Bot", self.origin_log())
        spend = self.g("--git-dir", str(self.tmp / "origin.git"), "show", "main:data/spend.json").stdout
        self.assertIn("3.1", spend)   # das Kostenbuch liegt auf main

    def test_final_step_pushes_an_earlier_unpushed_commit_and_fails_visibly(self):
        self.paid_result(); self.rejects.write_text("99")
        r = self.step(self.save); self.assertNotEqual(r.returncode, 0)   # Zwischenstand nicht gespeichert: sichtbar rot
        r = self.step(self.final)
        self.assertNotEqual(r.returncode, 0); summary = (self.tmp / "summary.md").read_text()
        self.assertIn("Push fehlgeschlagen", summary); self.assertNotIn("Nichts Neues", summary + r.stdout)
        self.rejects.write_text("0"); r = self.step(self.final)   # naechster Versuch (z. B. erneuter Lauf) bringt den Commit auf main
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr); self.assertIn("neu geschrieben", self.origin_log())

    def test_nothing_new_is_reported_only_when_true(self):
        r = self.step(self.final)
        self.assertEqual(r.returncode, 0, r.stderr); self.assertIn("Nichts Neues zu speichern", (self.tmp / "summary.md").read_text())

    def test_limit_input_and_cap(self):
        import yaml
        wf = yaml.safe_load((ROOT / ".github" / "workflows" / "shownotes-seo.yml").read_text("utf-8"))
        on = wf.get("on", wf.get(True))
        self.assertIn("limit", on["workflow_dispatch"]["inputs"]); self.assertEqual(on["schedule"], [{"cron": "17 2 * * 1"}])
        self.assertEqual(self.final.get("if"), "always()"); self.assertEqual(self.save.get("if"), "always()")
        self.assertNotIn("secrets.", self.save["run"] + self.final["run"])


if __name__ == "__main__":
    unittest.main()
