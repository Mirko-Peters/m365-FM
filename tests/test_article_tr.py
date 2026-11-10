"""Weg B (9.11.2026): Sonnet schreibt nur Englisch, Haiku uebersetzt einmal in 14 Sprachen. Alles ohne API-Aufrufe (Batch-API und Sonnet sind nachgebaut)."""
import copy, glob, json, os, re, tempfile, unittest
from pathlib import Path
from unittest import mock

import article_tr as TR
import generate_articles as GA
import translate_blog as TB

REPO = Path(__file__).resolve().parent.parent
PARA = "<p>" + " ".join(["Microsoft 365 and Copilot help SharePoint teams to work with Power BI reports every single day."] * 3) + "</p>"
EN = {
    "html": "<h2>Why Entra matters</h2>" + PARA + "<ul><li>Use <strong>Azure</strong> policies for every tenant today</li><li>Review <em>Intune</em> rules each quarter without fail</li></ul>" + PARA,
    "model": "claude-sonnet-5-5", "src": "sonnet",
    "info": {"titel": "Core steps for admins", "typ": "schritte", "punkte": [{"kopf": "Plan first", "text": "Write down every identity source before you start."}]},
    "infos": [{"titel": "Facts about identity", "typ": "fakten", "punkte": [{"wert": "3 steps", "text": "Plan, apply and review the policy in Microsoft Teams."}]}],
    "faq": [{"q": "What is Entra used for in a company?", "a": "It manages identities and access for people and apps across the whole organisation."}],
    "quiz": [{"q": "Which tool manages devices in the cloud?", "opts": ["Intune", "Excel", "Word", "Loop"], "a": 0, "why": "Intune manages devices and apps in the cloud."}],
}
EN["h"] = TR.en_hash(EN)


def tag_seq(html): return re.findall(r"</?\w+", html)


def fake_translate(text, lang="de", n=0):
    """Stellt eine Uebersetzung nach: Sprachmarke davor, Tags und Namen bleiben."""
    return f"[{lang}] {text}"


class FakeAPI:
    """Batch-API-Attrappe: nimmt Anfragen an und beantwortet sie mit translate(unit_text, lang, nth_batch)."""
    def __init__(self, translate=fake_translate):
        self.translate, self.batches, self.reqs = translate, [], []

    def __call__(self, method, path, body=None, raw=False):
        if method == "POST":
            self.batches.append(body["requests"]); self.reqs += body["requests"]
            return {"id": f"b{len(self.batches)}"}
        if raw:
            n = int(re.sub(r"\D", "", path)); lines = []
            for r in self.batches[n - 1]:
                lang = r["custom_id"].split("_")[0]; user = r["params"]["messages"][0]["content"]
                units = re.findall(r"^\[\[(\d+)\]\] (.*)$", user, re.M)
                out = "\n".join(f"[[{i}]] {self.translate(t, lang, n)}" for i, t in units)
                lines.append(json.dumps({"custom_id": r["custom_id"], "result": {"type": "succeeded", "message": {
                    "usage": {"input_tokens": 1000, "output_tokens": 500}, "content": [{"type": "text", "text": out}], "stop_reason": "end_turn"}}}))
            return "\n".join(lines).encode()
        return {"processing_status": "ended", "request_counts": {}, "results_url": f"/res/{path.rsplit('/', 1)[1][1:]}"}


class Env(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.root = Path(self.tmp.name)
        for d in ("data/articles", "episodes", "transcripts/de"):
            (self.root / d).mkdir(parents=True)
        self.p = [mock.patch.object(m, "ROOT", self.root) for m in (TR, GA)]
        self.p += [mock.patch.object(TR, "check_budget", return_value=True), mock.patch.object(TR, "report_usage"), mock.patch("time.sleep"),
                   mock.patch.dict(os.environ, {"ANTHROPIC_API_KEY": "x"})]
        for x in self.p: x.start()

    def tearDown(self):
        for x in self.p: x.stop()
        self.tmp.cleanup()

    def spend(self, d):
        (self.root / "data" / "spend.json").write_text(json.dumps(d), "utf-8")

    def store(self, **vids):
        return {v: copy.deepcopy(d) for v, d in vids.items()}

    def run_tr(self, store, api, langs=("de", "fr"), **kw):
        saved = []
        with mock.patch.object(TR, "_api", api):
            TR.run(store, list(store), saved.append, langs=list(langs), wait_min=1, **kw)
        return saved


class EnglishPath(Env):
    def test_only_english_is_written_by_sonnet(self):
        (self.root / "data" / "videos.json").write_text(json.dumps({"vA": {"date": "2026-11-01"}, "vB": {"date": "2026-11-02"}}), "utf-8")
        (self.root / "transcripts" / "de" / "vA.vtt").write_text("WEBVTT\n\n00:00:01.000 --> 00:00:02.000\nHallo Welt " * 100, "utf-8")
        (self.root / "transcripts" / "de" / "vB.vtt").write_text("WEBVTT\n\n00:00:01.000 --> 00:00:02.000\nHallo Welt " * 100, "utf-8")
        (self.root / "data" / "articles" / "vB.json").write_text(json.dumps({"de": {"html": "<p>ALT</p>", "model": "m"}}), "utf-8")
        long_html = "<h2>T</h2>" + "<p>" + "word " * 700 + "</p>"
        langs = []
        def ask(lang, title, text):
            langs.append(lang); return long_html, {"titel": "i", "typ": "schritte", "punkte": [{"kopf": "a", "text": "b"}]}
        with mock.patch.object(GA, "ask", ask), mock.patch.object(GA, "faq_for", return_value=EN["faq"]), mock.patch.object(GA, "infos_for", return_value=EN["infos"]), \
             mock.patch.object(GA, "quiz_for", return_value=EN["quiz"]), mock.patch.object(GA, "info_for", return_value=None):
            GA.main("en")
        self.assertEqual(set(langs), {"en"})
        a = json.loads((self.root / "data" / "articles" / "vA.json").read_text("utf-8"))
        self.assertEqual(list(a), ["en"]); self.assertEqual(a["en"]["src"], "sonnet"); self.assertEqual(a["en"]["h"], TR.en_hash(a["en"]))
        b = json.loads((self.root / "data" / "articles" / "vB.json").read_text("utf-8"))
        self.assertEqual(b["de"], {"html": "<p>ALT</p>", "model": "m"})   # vorhandene Fassung unberuehrt
        self.assertIn("en", b)

    def test_sonnet_month_cap_stops_english_but_not_translation(self):
        self.spend({GA.time.strftime("%Y-%m", GA.time.gmtime()): {"usd": 999}})
        with mock.patch.object(GA, "ask", side_effect=AssertionError("kein Sonnet ueber der Grenze")):
            GA.main("en")
        api = FakeAPI()
        store = self.store(v1={"en": EN}); self.run_tr(store, api, langs=("de",))   # Sonnet-Deckel (usd 999) blockiert die Uebersetzung nicht
        self.assertIn("de", store["v1"])


class TranslatePath(Env):
    def test_tags_names_and_all_texts_translated(self):
        store = self.store(v1={"en": EN}); api = FakeAPI()
        saved = self.run_tr(store, api)
        self.assertEqual(saved.count("v1"), 2)
        for l in ("de", "fr"):
            a = store["v1"][l]
            self.assertEqual(tag_seq(a["html"]), tag_seq(EN["html"]))
            for name in ("Microsoft 365", "Copilot", "SharePoint", "Power BI", "Azure", "Intune", "Microsoft Teams"):
                self.assertEqual(a["html"].count(name) + json.dumps(a).count(name) > 0, True)
            self.assertIn("Microsoft 365", a["html"]); self.assertIn(f"[{l}] ", a["html"])
            self.assertEqual((a["src"], a["h"], a["model"]), ("haiku-tr", EN["h"], TB.MODEL))
            self.assertTrue(a["faq"][0]["q"].startswith(f"[{l}]") and a["faq"][0]["a"].startswith(f"[{l}]"))
            self.assertTrue(a["quiz"][0]["q"].startswith(f"[{l}]") and all(o.startswith(f"[{l}]") for o in a["quiz"][0]["opts"]))
            self.assertEqual(a["quiz"][0]["a"], 0); self.assertEqual(a["info"]["typ"], "schritte"); self.assertEqual(a["infos"][0]["typ"], "fakten")
            self.assertTrue(a["info"]["punkte"][0]["kopf"].startswith(f"[{l}]"))
        self.assertNotIn("stale", store["v1"]["de"])
        self.assertFalse((self.root / "data" / TR.STATE).exists())   # nichts offen -> kein Zwischenstand

    def test_existing_versions_never_overwritten(self):
        old = {"html": "<p>ORIGINAL de</p>", "model": "claude-sonnet-5-5"}
        store = self.store(v1={"en": EN, "de": old}); api = FakeAPI()
        self.run_tr(store, api)
        self.assertEqual(store["v1"]["de"], old)
        self.assertTrue(api.reqs and all(r["custom_id"].startswith("fr_") for r in api.reqs))   # de wurde nicht einmal angefragt
        self.run_tr(store, api); n = len(api.reqs)
        self.run_tr(store, api); self.assertEqual(len(api.reqs), n)   # zweiter Lauf: nichts mehr zu tun

    def test_collect_does_not_replace_a_version_added_meanwhile(self):
        store = self.store(v1={"en": EN}); api = FakeAPI(); s = TR.load_state()
        with mock.patch.object(TR, "_api", api):
            TR.submit(store, ["v1"], s, ["de"])
            store["v1"]["de"] = {"html": "<p>Editor</p>"}
            TR.collect(store, s)
        self.assertEqual(store["v1"]["de"], {"html": "<p>Editor</p>"})

    def test_no_english_no_translation(self):
        store = self.store(v1={"de": {"html": "<p>x</p>"}}); api = FakeAPI()
        self.run_tr(store, api); self.assertEqual(api.reqs, [])

    def test_stale_marking_only_marks(self):
        legacy = {"html": "<p>alt</p>"}
        store = self.store(v1={"en": EN, "de": legacy}); api = FakeAPI(); self.run_tr(store, api, langs=("fr",))
        self.assertFalse(store["v1"]["fr"].get("stale"))
        store["v1"]["en"]["html"] += "<p>Editor added a paragraph that changes the source text for the readers.</p>"
        self.assertEqual(TR.mark_stale(store), 1)
        self.assertTrue(store["v1"]["fr"]["stale"]); self.assertNotIn("stale", store["v1"]["de"])   # Altbestand ohne Quell-Hash bleibt unmarkiert
        before = copy.deepcopy(store["v1"]["fr"]); n = len(api.reqs)
        self.run_tr(store, api, langs=("fr",))
        self.assertEqual(len(api.reqs), n); self.assertEqual(store["v1"]["fr"], before)   # keine automatische Neuuebersetzung
        self.assertEqual(TR.mark_stale(store), 0)

    def test_failed_unit_is_retried_then_ok(self):
        def tr2(text, lang, n):
            return "" if text.startswith("What is Entra") and n == 1 else fake_translate(text, lang)
        store = self.store(v1={"en": EN}); api = FakeAPI(tr2); self.run_tr(store, api, langs=("de",))
        self.assertIn("de", store["v1"]); self.assertEqual(len(api.batches), 2)   # 2. Runde nur fuer die fehlende Einheit
        self.assertEqual(len(api.batches[1]), 1)

    def test_qa_rejects_broken_tags_and_stops_after_three_tries(self):
        def tr(text, lang, n): return re.sub(r"</?strong>", "", fake_translate(text, lang)) if "<strong>" in text else fake_translate(text, lang)
        store = self.store(v1={"en": EN}); api = FakeAPI(tr); self.run_tr(store, api, langs=("de",))
        self.assertNotIn("de", store["v1"]); self.assertEqual(len(api.batches), TR.MAX_TRIES)
        s = TR.load_state(); self.assertIn("de|v1", s["failed"])
        n = len(api.batches); self.run_tr(store, api, langs=("de",)); self.assertEqual(len(api.batches), n)   # gescheitert: nicht erneut senden

    def test_script_check_for_non_latin_target(self):
        store = self.store(v1={"en": EN}); api = FakeAPI()   # "[ru] ..." bleibt lateinisch -> falsche Schrift
        self.run_tr(store, api, langs=("ru",)); self.assertNotIn("ru", store["v1"])

    def test_tr_budget_stops_and_is_tracked_separately(self):
        month = TR.month()
        self.spend({month: {"usd": 5.0, "input_tokens": 1, "output_tokens": 1, "calls": 1, "articles_tr": {"usd": TR.TR_BUDGET - 1e-9, "input_tokens": 0, "output_tokens": 0, "calls": 0}}})
        store = self.store(v1={"en": EN}); api = FakeAPI(); self.run_tr(store, api)
        self.assertEqual(api.reqs, []); self.assertNotIn("de", store["v1"])
        with mock.patch.object(TR, "TR_BUDGET", 1000.0):
            self.run_tr(store, api)
        sd = json.loads((self.root / "data" / "spend.json").read_text("utf-8"))[month]
        self.assertEqual(sd["usd"], 5.0)   # Sonnet-Feld unveraendert
        self.assertGreater(sd["articles_tr"]["usd"], TR.TR_BUDGET - 1e-9); self.assertGreater(sd["articles_tr"]["calls"], 0)
        self.assertEqual(GA.month_spend_usd(json.loads((self.root / "data" / "spend.json").read_text("utf-8")), month), 5.0)

    def test_budget_room_limits_number_of_versions(self):
        self.spend({})
        store = self.store(v1={"en": EN}, v2={"en": EN}); one = TR.est_usd("de", TR.units_of(EN)[1])
        with mock.patch.object(TR, "TR_BUDGET", one * 1.5), mock.patch.object(TR, "LANGS", ["de"]):
            api = FakeAPI(); self.run_tr(store, api, langs=("de",))
        self.assertEqual(sum(1 for v in ("v1", "v2") if "de" in store[v]), 1)

    def test_daily_haiku_cap_blocks(self):
        store = self.store(v1={"en": EN}); api = FakeAPI()
        with mock.patch.object(TR, "check_budget", return_value=False):
            self.run_tr(store, api)
        self.assertEqual(api.reqs, []); self.assertFalse((self.root / "data" / TR.STATE).exists())


class PlanAndReader(unittest.TestCase):
    @unittest.skipUnless((REPO / "transcripts").is_dir() and (REPO / "episodes").is_dir(), "Teil-Checkout ohne transcripts/ oder episodes/ (sparse checkout)")
    def test_plan_numbers_on_real_data(self):
        vids = GA.vid_list(); store = GA.load_store(vids)
        r = GA.plan(store, vids)
        videos = set(json.load(open(REPO / "data" / "videos.json"))) | {Path(p).stem for p in glob.glob(str(REPO / "episodes" / "*.json"))}
        self.assertEqual(r["videos"], len(videos))
        have = {v: set(json.load(open(f))) for f in glob.glob(str(REPO / "data" / "articles" / "*.json")) for v in [Path(f).stem]}
        self.assertEqual(r["en_missing"], sum(1 for v in videos if "en" not in have.get(v, ())))
        self.assertEqual(r["lang_missing"], sum(1 for v in videos for l in TB.LANGS if l not in have.get(v, ())))
        self.assertEqual(r["lang_translatable_now"], sum(1 for v in videos if "en" in have.get(v, ()) for l in TB.LANGS if l not in have[v]))
        self.assertGreater(r["en_writable"], 0); self.assertLessEqual(r["en_writable"], r["en_missing"])
        self.assertAlmostEqual(r["sonnet_usd"], r["en_writable"] * GA.EN_USD, places=1)
        self.assertGreater(r["haiku_usd"], 0); self.assertLess(r["haiku_usd"], r["lang_missing"] * GA.EN_USD * 0.07)   # unter 7 % des alten Wegs

    def test_site_reader_renders_en_and_translated(self):
        import generate_site as GS
        f = sorted(glob.glob(str(REPO / "data" / "articles" / "*.json")))[0]
        real = json.load(open(f))
        de = real["de"]
        en = {**copy.deepcopy(de), "src": "sonnet"}   # keine echte englische Fassung vorhanden: echte Struktur als en
        for lang, art in (("en", en), ("de", de)):
            ih = GS.info_html(art["info"]); self.assertIn("<", ih); self.assertIn(GS.esc(art["info"]["titel"]), ih)
            qh = GS.quiz_html(art["quiz"], lang, "Titel", "https://www.m365.fm/x/"); self.assertTrue(qh)
            self.assertIn(GS.esc(art["quiz"][0]["q"]), qh)
            self.assertTrue(art["html"].startswith("<")); self.assertGreater(len(GS.strip_tags(art["html"]).split()), 300)
        # eine Haiku-Fassung (neue Felder src/h/stale) wird vom Leser genauso gerendert
        tr = {**copy.deepcopy(de), "src": "haiku-tr", "h": "abc", "stale": True}
        self.assertEqual(GS.info_html(tr["info"]), GS.info_html(de["info"]))
        self.assertEqual(GS.quiz_html(tr["quiz"], "de", "T", "https://www.m365.fm/x/"), GS.quiz_html(de["quiz"], "de", "T", "https://www.m365.fm/x/"))


# ---------------- 327-Nachbesserung ----------------
class FlakyAPI(FakeAPI):
    """FakeAPI mit Ausfaellen: fail_get = so viele GET-Aufrufe werfen einen Netzfehler, fail_post ebenso fuer POST, result = Typ fuer alle Ergebnisse (errored ...)."""
    def __init__(self, fail_get=0, fail_post=0, result=None, **kw):
        super().__init__(**kw); self.fail_get, self.fail_post, self.result = fail_get, fail_post, result

    def __call__(self, method, path, body=None, raw=False):
        if method == "POST" and self.fail_post:
            self.fail_post -= 1; raise TimeoutError("timed out")
        if method == "GET" and self.fail_get:
            self.fail_get -= 1; raise OSError("connection reset")
        out = super().__call__(method, path, body, raw)
        if raw and self.result:
            lines = [json.loads(x) for x in out.decode().splitlines()]
            out = "\n".join(json.dumps({"custom_id": x["custom_id"], "result": {"type": self.result, "error": {"type": "overloaded_error"}}}) for x in lines).encode()
        return out


class Thinking(Env):
    """Denken je Modell: Haiku 5.5 und Sonnet 5.5 denken ohne Feld adaptiv (Ausgabe-Token, max_tokens). Sonnet 5.5 weist "disabled" ab (HTTP 400)."""
    def test_field_per_model(self):
        from ai_gateway import thinking_off
        self.assertEqual(thinking_off("claude-haiku-5-5"), {"thinking": {"type": "disabled"}})
        self.assertEqual(thinking_off("claude-sonnet-5-5"), {"thinking": {"type": "between_tools"}})
        self.assertEqual(thinking_off("claude-opus-5-5"), {})

    def test_haiku_batch_requests_switch_thinking_off(self):
        store = self.store(v1={"en": EN}); api = FakeAPI(); self.run_tr(store, api, langs=("de",))
        self.assertTrue(api.reqs)
        for r in api.reqs:
            self.assertEqual(r["params"]["thinking"], {"type": "disabled"} if "haiku" in TR.MODEL else {"type": "between_tools"})

    def test_sonnet_request_uses_between_tools_not_disabled(self):
        bodies = []
        class R:
            def __enter__(s): return s
            def __exit__(s, *a): return False
            def read(s): return json.dumps({"content": [{"type": "text", "text": "ok"}], "usage": {"input_tokens": 1, "output_tokens": 1}}).encode()
        def fake_open(req, timeout): bodies.append(json.loads(req.data)); return R()
        with mock.patch.object(GA, "urlopen", fake_open), mock.patch.object(GA, "check_budget", return_value=True), mock.patch.object(GA, "report_usage"), \
             mock.patch.object(GA, "MODEL", "claude-sonnet-5-5"), mock.patch.object(GA, "BUDGET_USD", 1000.0):
            self.assertEqual(GA._post("x", 1500, "prefix"), "ok")
        self.assertEqual(bodies[0]["thinking"], {"type": "between_tools"}); self.assertEqual(bodies[0]["max_tokens"], 1500)


class ApiFailures(Env):
    """F1: Netz-/HTTP-Fehler beenden den Lauf nicht und verlieren keine Batch-IDs; F2: errored/expired/canceled zaehlen nie als Versuch."""
    def test_network_error_while_polling_keeps_batch_and_ends_normally(self):
        store = self.store(v1={"en": EN}); api = FlakyAPI(); s = TR.load_state()
        with mock.patch.object(TR, "_api", api):
            TR.submit(store, ["v1"], s, ["de"])
            api.fail_get = 99
            self.assertEqual(TR.collect(store, s), 1)   # kein Absturz, Batch bleibt offen
        st = json.loads((self.root / "data" / TR.STATE).read_text("utf-8"))
        self.assertEqual([b["id"] for b in st["batches"]], ["b1"])   # Batch-ID auf der Platte (wird committet)
        api.fail_get = 99; self.run_tr(store, api, langs=("de",))   # ganzer Lauf: wartet, scheitert beim Abfragen, endet ohne Ausnahme
        self.assertNotIn("de", store["v1"]); self.assertEqual(len(api.batches), 1)
        api.fail_get = 0; self.run_tr(store, api, langs=("de",))   # naechster Lauf holt das bezahlte Ergebnis ab, ohne neu zu kaufen
        self.assertIn("de", store["v1"]); self.assertEqual(len(api.batches), 1)
        sd = json.loads((self.root / "data" / "spend.json").read_text("utf-8"))
        self.assertGreater(sd[TR.month()]["articles_tr"]["calls"], 0)

    def test_post_error_leaves_versions_open(self):
        store = self.store(v1={"en": EN}); api = FlakyAPI(fail_post=1)
        self.run_tr(store, api, langs=("de",))
        s = TR.load_state(); self.assertEqual(s["batches"], []); self.assertEqual(s["failed"], {}); self.assertNotIn("de|v1", s["partial"])
        self.run_tr(store, api, langs=("de",)); self.assertIn("de", store["v1"])

    def test_rejected_post_fails_visibly_without_losing_state(self):
        import io, urllib.error
        store = self.store(v1={"en": EN}); s = TR.load_state()
        def bad(method, path, body=None, raw=False): raise urllib.error.HTTPError("u", 400, "bad", {}, io.BytesIO(b"invalid"))
        with mock.patch.object(TR, "_api", bad), self.assertRaises(urllib.error.HTTPError):
            TR.submit(store, ["v1"], s, ["de"])
        self.assertEqual(s["partial"], {}); self.assertEqual(s["failed"], {})

    def test_errored_results_do_not_count_as_tries(self):
        store = self.store(v1={"en": EN}); api = FlakyAPI(result="errored"); stats = {}
        with mock.patch.object(TR, "_api", api):
            TR.run(store, ["v1"], lambda v: None, langs=["de"], wait_min=1, stats=stats)
        self.assertEqual(len(api.batches), 1)   # keine sofortige zweite Runde gegen eine gestoerte API
        s = TR.load_state(); self.assertEqual(s["failed"], {}); self.assertEqual(s["partial"]["de|v1"]["tries"], 0)
        self.assertEqual(stats["api"], stats["results"])
        for typ in ("expired", "canceled", "errored"):   # auch viele Laeufe mit Ausfaellen sperren die Fassung nie
            api.result = typ; self.run_tr(store, api, langs=("de",))
        s = TR.load_state(); self.assertEqual(s["failed"], {}); self.assertEqual(s["partial"]["de|v1"]["tries"], 0)
        api.result = None; self.run_tr(store, api, langs=("de",)); self.assertIn("de", store["v1"])

    def test_partial_api_failure_does_not_count_a_try(self):
        """Ein Teil der Anfragen einer Fassung scheitert bei der API, der andere gelingt: kein Versuch; der Rest kommt in der naechsten Runde."""
        store = self.store(v1={"en": EN}); api = FakeAPI(); s = TR.load_state()
        with mock.patch.object(TB, "CHUNK", 200):
            with mock.patch.object(TR, "_api", api):
                TR.submit(store, ["v1"], s, ["de"])
                self.assertGreater(len(api.batches[0]), 1)
                orig = FakeAPI.__call__
                def half(self_, method, path, body=None, raw=False):
                    out = orig(self_, method, path, body, raw)
                    if raw:
                        ls = [json.loads(x) for x in out.decode().splitlines()]; ls[0]["result"] = {"type": "errored", "error": {"type": "api_error"}}
                        out = "\n".join(map(json.dumps, ls)).encode()
                    return out
                with mock.patch.object(FakeAPI, "__call__", half):
                    TR.collect(store, s)
        self.assertNotIn("de", store["v1"]); self.assertEqual(s["partial"]["de|v1"]["tries"], 0); self.assertEqual(s["failed"], {})

    def test_main_fails_visibly_when_most_requests_have_no_api_result(self):
        (self.root / "data" / "articles" / "v1.json").write_text(json.dumps({"en": EN}), "utf-8")
        (self.root / "data" / "videos.json").write_text(json.dumps({"v1": {}}), "utf-8")
        api = FlakyAPI(result="expired")
        with mock.patch.object(TR, "_api", api), mock.patch.object(TR, "LANGS", ["de"]), mock.patch.dict(os.environ, {"WAIT_MIN": "1"}):
            with self.assertRaises(SystemExit) as cm:
                GA.main("translate")
        self.assertIn("ohne Ergebnis der API", str(cm.exception.code))
        self.assertTrue((self.root / "data" / TR.STATE).exists())   # Zwischenstand liegt vor dem Fehler auf der Platte (Workflow speichert mit if: always())


class GapFill(Env):
    """F3: Teile, die Sonnet erst nach der Uebersetzung ergaenzt (FAQ, Quiz, Infografiken), werden einmal nachuebersetzt; vorhandener Text bleibt."""
    def en_without(self, *keys):
        en = {k: copy.deepcopy(v) for k, v in EN.items() if k not in keys}; en["h"] = TR.en_hash(en); return en

    def test_missing_quiz_is_translated_later_without_rebuying_text(self):
        store = self.store(v1={"en": self.en_without("quiz", "faq")}); api = FakeAPI(); self.run_tr(store, api, langs=("de",))
        de = copy.deepcopy(store["v1"]["de"]); self.assertNotIn("quiz", de); n = len(api.reqs)
        store["v1"]["en"]["quiz"] = copy.deepcopy(EN["quiz"]); store["v1"]["en"]["faq"] = copy.deepcopy(EN["faq"])   # Sonnet ergaenzt am naechsten Tag (fill)
        self.assertEqual(TR.mark_stale(store), 0)   # nur fehlende Teile: nicht veraltet
        self.run_tr(store, api, langs=("de",))
        new = api.reqs[n:]; self.assertEqual(len(new), 1)
        sent = new[0]["params"]["messages"][0]["content"]
        self.assertIn("Which tool manages devices", sent); self.assertIn("What is Entra used for", sent); self.assertNotIn("Why Entra matters", sent)   # nur die neuen Teile
        a = store["v1"]["de"]
        self.assertTrue(a["quiz"][0]["q"].startswith("[de]")); self.assertEqual(a["quiz"][0]["a"], 0); self.assertTrue(a["faq"][0]["a"].startswith("[de]"))
        self.assertEqual(a["html"], de["html"]); self.assertEqual(a["info"], de["info"])   # vorhandener Text unveraendert
        self.assertEqual(a["h"], TR.en_hash(store["v1"]["en"])); self.assertNotIn("stale", a)
        self.assertEqual(TR.mark_stale(store), 0)
        self.run_tr(store, api, langs=("de",)); self.assertEqual(len(api.reqs), n + 1)   # danach nichts mehr

    def test_gap_on_stale_version_adds_parts_but_stays_stale(self):
        store = self.store(v1={"en": self.en_without("quiz")}); api = FakeAPI(); self.run_tr(store, api, langs=("de",))
        old_h = store["v1"]["de"]["h"]
        store["v1"]["en"]["html"] += "<p>Editor added a paragraph that changes the source text for the readers.</p>"; store["v1"]["en"]["quiz"] = copy.deepcopy(EN["quiz"])
        self.assertEqual(TR.mark_stale(store), 1)
        self.run_tr(store, api, langs=("de",))
        a = store["v1"]["de"]; self.assertTrue(a["quiz"][0]["q"].startswith("[de]")); self.assertEqual(a["h"], old_h)
        TR.mark_stale(store); self.assertTrue(a.get("stale")); self.assertEqual(TR.stale_list(store), {"v1": ["de"]})
        self.assertNotIn("Editor added", a["html"])   # veraltetes HTML wird nicht automatisch neu uebersetzt

    def test_legacy_versions_get_no_gap_fill(self):
        legacy = {"html": "<p>alt</p>", "model": "claude-sonnet-5-5"}
        store = self.store(v1={"en": EN, "de": legacy}); api = FakeAPI(); self.run_tr(store, api, langs=("de",))
        self.assertEqual(api.reqs, []); self.assertEqual(store["v1"]["de"], legacy)


class SpendMerge(unittest.TestCase):
    """F4: das Kostenbuch data/spend.json wird je Schluessel zusammengefuehrt; ein Rebase mit -X theirs verliert keine Schluessel anderer Jobs."""
    def setUp(self):
        import importlib.util
        sp = importlib.util.spec_from_file_location("spend_merge", REPO / "tools" / "spend_merge.py"); self.M = importlib.util.module_from_spec(sp); sp.loader.exec_module(self.M)

    def test_merge_rules(self):
        m = self.M.merge
        o = {"2026-12": {"input_tokens": 10, "usd": 3.0, "models": {"s": 1}}, "shownotes": {"2026-12": {"usd": 1.0, "reserved": 5.0}}}
        a = {"2026-12": {"input_tokens": 10, "usd": 3.0, "models": {"s": 1}, "articles_tr": {"usd": 4.2, "calls": 2}}, "shownotes": {"2026-12": {"usd": 1.0, "reserved": 5.0}}}
        b = {"2026-12": {"input_tokens": 30, "usd": 3.5, "models": {"s": 3}}, "shownotes": {"2026-12": {"usd": 2.5}}}
        self.assertEqual(m(o, a, b), {"2026-12": {"input_tokens": 30, "usd": 3.5, "models": {"s": 3}, "articles_tr": {"usd": 4.2, "calls": 2}}, "shownotes": {"2026-12": {"usd": 2.5}}})
        self.assertEqual(m(o, b, a), m(o, a, b))   # Seiten vertauscht (Rebase): gleiches Ergebnis
        # beide Seiten zaehlen am selben Feld: Zuwaechse addieren
        self.assertEqual(m({"x": {"usd": 1.0, "calls": 1}}, {"x": {"usd": 1.5, "calls": 2}}, {"x": {"usd": 3.0, "calls": 4}}), {"x": {"usd": 3.5, "calls": 5}})
        # vorgemerkt (reserved) auf einer Seite aufgeloest und entfernt, auf der anderen erhoeht
        self.assertEqual(m({"r": 5.0}, {}, {"r": 8.0}), {"r": 3.0})
        self.assertEqual(m(self.M.MISSING, {"n": {"usd": 1.0}}, {"m": {"usd": 2.0}}), {"n": {"usd": 1.0}, "m": {"usd": 2.0}})

    def git(self, *a, cwd):
        import subprocess
        return subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@example.test", *a], cwd=cwd, check=True, capture_output=True, text=True)

    def test_rebase_with_theirs_keeps_both_jobs_keys(self):
        import shutil
        if not shutil.which("git"): self.skipTest("git fehlt")
        with tempfile.TemporaryDirectory() as tmp:
            r = Path(tmp); g = lambda *a: self.git(*a, cwd=r)
            g("init", "-q", "-b", "main"); (r / "data").mkdir()
            (r / "data" / "spend.json").write_text(json.dumps({"2026-12": {"input_tokens": 10, "usd": 3.0}}, indent=1)); g("add", "-A"); g("commit", "-qm", "base")
            g("checkout", "-qb", "other"); d = json.loads((r / "data" / "spend.json").read_text()); d["shownotes"] = {"2026-12": {"usd": 12.5}}
            (r / "data" / "spend.json").write_text(json.dumps(d, indent=1)); g("commit", "-qam", "shownotes")
            g("checkout", "-q", "main"); d = json.loads((r / "data" / "spend.json").read_text()); d["2026-12"]["articles_tr"] = {"usd": 4.2}
            (r / "data" / "spend.json").write_text(json.dumps(d, indent=1)); g("commit", "-qam", "articles"); g("branch", "save")
            g("rebase", "-q", "-X", "theirs", "other")
            self.assertNotIn("shownotes", json.loads((r / "data" / "spend.json").read_text()))   # ohne Treiber: Schluessel des anderen Jobs still weg (der Befund)
            g("reset", "-q", "--hard", "save")
            (r / ".git" / "info").mkdir(exist_ok=True)
            with open(r / ".git" / "info" / "attributes", "a") as f: f.write("data/spend.json merge=spendjson\n")
            g("config", "merge.spendjson.driver", f"python3 {REPO / 'tools' / 'spend_merge.py'} %O %A %B")
            g("rebase", "-q", "-X", "theirs", "other")
            d = json.loads((r / "data" / "spend.json").read_text())
            self.assertEqual(d["shownotes"], {"2026-12": {"usd": 12.5}}); self.assertEqual(d["2026-12"]["articles_tr"], {"usd": 4.2})


class WorkflowSave(unittest.TestCase):
    """F1/F4 im Workflow: Speichern laeuft immer (if: always()), wiederholt den Push nach Rebase, meldet ehrlich und fuehrt data/spend.json je Schluessel zusammen."""
    def setUp(self):
        import shutil, subprocess, yaml
        if not shutil.which("git"): self.skipTest("git fehlt")
        self.wf = yaml.safe_load((REPO / ".github" / "workflows" / "articles.yml").read_text("utf-8")); steps = self.wf["jobs"]["articles"]["steps"]
        self.setup = next(s for s in steps if s.get("name", "").startswith("Kostenbuch"))
        self.save = next(s for s in steps if s.get("name", "").startswith("Speichern"))
        self.art = next(s for s in steps if s.get("uses", "").startswith("actions/upload-artifact"))
        self.cover = next(s for s in steps if s.get("name", "").startswith("Cover"))
        self.tmp = Path(tempfile.mkdtemp()); self.addCleanup(shutil.rmtree, self.tmp, True)
        g = lambda *a, cwd=None: subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@example.test", *a], cwd=cwd, check=True, capture_output=True, text=True)
        self.g = g
        g("init", "-q", "--bare", "-b", "main", str(self.tmp / "origin.git"))
        hook = self.tmp / "origin.git" / "hooks" / "pre-receive"; self.rejects = self.tmp / "rejects"
        hook.write_text(f'#!/bin/sh\nn=$(cat "{self.rejects}" 2>/dev/null || echo 0)\nif [ "$n" -gt 0 ]; then echo $((n-1)) > "{self.rejects}"; echo "abgelehnt" >&2; exit 1; fi\nexit 0\n'); hook.chmod(0o755)
        g("clone", "-q", str(self.tmp / "origin.git"), str(self.tmp / "seed")); seed = self.seed = self.tmp / "seed"
        for d in ("data/articles", "tools"): (seed / d).mkdir(parents=True)
        (seed / "tools" / "spend_merge.py").write_bytes((REPO / "tools" / "spend_merge.py").read_bytes())
        (seed / "data" / "spend.json").write_text(json.dumps({"2026-12": {"input_tokens": 10, "usd": 3.0}}, indent=1))
        g("add", "-A", cwd=seed); g("commit", "-q", "-m", "start", cwd=seed); g("push", "-q", "origin", "HEAD:main", cwd=seed)
        g("clone", "-q", str(self.tmp / "origin.git"), str(self.tmp / "run")); self.run_dir = self.tmp / "run"
        d = json.loads((seed / "data" / "spend.json").read_text()); d["shownotes"] = {"2026-12": {"usd": 12.5, "calls": 3}}   # shownotes-seo.yml schreibt waehrenddessen
        (seed / "data" / "spend.json").write_text(json.dumps(d, indent=1)); g("commit", "-q", "-am", "Shownotes SEO", cwd=seed); g("push", "-q", "origin", "HEAD:main", cwd=seed)
        bin_ = self.tmp / "bin"; bin_.mkdir(); (bin_ / "sleep").write_text("#!/bin/sh\nexit 0\n"); (bin_ / "sleep").chmod(0o755)
        (self.tmp / "rt").mkdir()
        self.env = {**os.environ, "PATH": f"{bin_}{os.pathsep}{os.environ['PATH']}", "GITHUB_STEP_SUMMARY": str(self.tmp / "summary.md"), "GIT_TERMINAL_PROMPT": "0", "RUNNER_TEMP": str(self.tmp / "rt")}

    def step(self, s):
        import subprocess
        return subprocess.run(["bash", "--noprofile", "--norc", "-eo", "pipefail", "-c", s["run"]], cwd=self.run_dir, env=self.env, capture_output=True, text=True)

    def paid(self):
        (self.run_dir / "data" / "articles").mkdir(parents=True, exist_ok=True); (self.run_dir / "data" / "articles" / "v1.json").write_text('{"de": {"html": "<p>x</p>"}}')
        (self.run_dir / "data" / "articles_tr_state.json").write_text('{"batches": [{"id": "msgbatch_1"}]}')
        d = json.loads((self.run_dir / "data" / "spend.json").read_text()); d["2026-12"]["articles_tr"] = {"usd": 4.2, "calls": 2}
        (self.run_dir / "data" / "spend.json").write_text(json.dumps(d, indent=1))

    def origin(self, path):
        return self.g("--git-dir", str(self.tmp / "origin.git"), "show", f"main:{path}").stdout

    def test_conditions(self):
        self.assertEqual(self.save.get("if"), "always()"); self.assertIn("failure()", self.art.get("if", "")); self.assertNotIn("always()", self.cover.get("if", ""))   # Cover nur nach Erfolg
        self.assertIn("data/articles_tr_state.json", self.art["with"]["path"]); self.assertIn("data/spend.json", self.art["with"]["path"])
        self.assertNotIn("secrets.", self.save["run"] + self.setup["run"])
        names = [s.get("name", s.get("uses", "")) for s in self.wf["jobs"]["articles"]["steps"]]
        self.assertLess(names.index(self.setup["name"]), names.index(self.save["name"]))

    def test_rejected_push_is_retried_and_spend_keys_of_both_jobs_survive(self):
        self.paid(); self.rejects.write_text("1")
        self.assertEqual(self.step(self.setup).returncode, 0)
        r = self.step(self.save); self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        sd = json.loads(self.origin("data/spend.json"))
        self.assertEqual(sd["shownotes"], {"2026-12": {"usd": 12.5, "calls": 3}}); self.assertEqual(sd["2026-12"]["articles_tr"], {"usd": 4.2, "calls": 2})
        self.assertIn("msgbatch_1", self.origin("data/articles_tr_state.json")); self.assertIn("gespeichert", (self.tmp / "summary.md").read_text())

    def test_final_failure_is_visible(self):
        self.paid(); self.rejects.write_text("99"); self.step(self.setup)
        r = self.step(self.save); self.assertNotEqual(r.returncode, 0)
        self.assertIn("Push fehlgeschlagen", (self.tmp / "summary.md").read_text())

    def test_nothing_new(self):
        self.step(self.setup); r = self.step(self.save)
        self.assertEqual(r.returncode, 0, r.stderr); self.assertIn("nichts Neues", (self.tmp / "summary.md").read_text())

    def test_shownotes_workflow_uses_the_same_merge(self):
        import yaml
        steps = yaml.safe_load((REPO / ".github" / "workflows" / "shownotes-seo.yml").read_text("utf-8"))["jobs"]["shownotes"]["steps"]
        setup = next(s for s in steps if s.get("name", "").startswith("Kostenbuch")); names = [s.get("name", s.get("uses", "")) for s in steps]
        self.assertEqual(setup["run"].replace("articles_tr", "shownotes"), self.setup["run"].replace("articles_tr", "shownotes"))
        self.assertLess(names.index(setup["name"]), min(i for i, n in enumerate(names) if n.startswith(("Speichern", "Daten committen"))))


if __name__ == "__main__":
    unittest.main()
