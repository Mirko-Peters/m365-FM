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


if __name__ == "__main__":
    unittest.main()
