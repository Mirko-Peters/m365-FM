"""Alt-Texte: Stufe 1 (Vorlagen) und Stufe 2 (data/r2_alt.json.gz, Build-Haken site_img_alt, Werkzeug tools/r2_alt.py mit nachgebauter API). Keine Netzaufrufe."""
import gzip, json, os, sys, tempfile, unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tools"))
import site_img_alt as ALT  # noqa: E402
import site_img_dims as IMG  # noqa: E402
import r2_alt as RA  # noqa: E402

U = "https://img.m365.fm/i/abc.webp"
SRC = "https://statics.mylandingpages.co/static/x/image/abc.jpg"
ALTS = {l: f"{l}: Balkendiagramm der Teams-Nutzung" for l in ALT.LANGS}
ALTS["en"] = "Bar chart of Microsoft Teams usage by month"
ENTRY = {"kind": "chart", "decorative": False, "alt": ALTS, "chart_points": [], "src": [SRC], "orig_alts": ["Teams adoption"]}
IDX = ALT.build_index({U: ENTRY}, r2map={SRC: U})


def img(alt=None, src=U):
    return f'<img src="{src}"' + ("" if alt is None else f' alt="{alt}"') + ' loading="lazy">'


class Weak(unittest.TestCase):
    def test_placeholders_filenames_heading_title(self):
        for a in (None, "", "  ", "Generated image", "Product Image", "Sentiment Analysis Chart", "image", "photo-1.jpg", "abc"):
            self.assertTrue(ALT.is_weak(a, src=SRC), a)
        self.assertTrue(ALT.is_weak("Teams adoption", heading="Teams Adoption"))
        self.assertTrue(ALT.is_weak("My Post", title="My post"))
        self.assertTrue(ALT.is_weak("Teams &amp; Groups", heading="Teams & Groups"))

    def test_descriptive_alt_is_not_weak(self):
        self.assertFalse(ALT.is_weak("Bar chart showing Copilot adoption rising to 40 percent", heading="Adoption"))


class Apply(unittest.TestCase):
    def test_heading_copy_replaced_in_page_language(self):
        h = f"<h2>Teams adoption</h2><p>{img('Teams adoption')}</p>"
        self.assertIn(f'alt="{ALTS["en"]}"', ALT.apply(h, "en", idx=IDX))
        self.assertIn(f'alt="{ALTS["de"]}"', ALT.apply("<h2>Teams-Einführung</h2>" + img("Teams adoption"), "de", idx=IDX))

    def test_good_alt_stays_on_english_but_english_copy_is_replaced_on_translation(self):
        h = img("Line chart of weekly active users in Teams")
        self.assertEqual(ALT.apply(h, "en", idx=IDX), h)
        e = dict(ENTRY, orig_alts=["Line chart of weekly active users in Teams"])
        idx = ALT.build_index({U: e}, r2map={})
        self.assertIn(f'alt="{ALTS["fr"]}"', ALT.apply(h, "fr", idx=idx))   # unveraenderter englischer Quelltext auf der franzoesischen Seite
        own = img("Graphique des utilisateurs actifs")
        self.assertEqual(ALT.apply(own, "fr", idx=idx), own)   # eigener Alt-Text in der Seitensprache bleibt

    def test_missing_alt_attribute_added_and_fallback_english(self):
        e = dict(ENTRY, alt={"en": "Diagram of the Entra ID sign-in flow"})
        out = ALT.apply(img(None), "ja", idx=ALT.build_index({U: e}, r2map={}))
        self.assertIn('alt="Diagram of the Entra ID sign-in flow"', out)
        self.assertEqual(out.count("alt="), 1)

    def test_decorative_gets_empty_alt(self):
        e = dict(ENTRY, decorative=True, kind="decorative", alt={l: "" for l in ALT.LANGS})
        self.assertIn('alt=""', ALT.apply(img("Generated image"), "en", idx=ALT.build_index({U: e}, r2map={})))

    def test_linked_image_never_gets_empty_alt(self):
        e = dict(ENTRY, decorative=True, kind="decorative", alt={l: "" for l in ALT.LANGS})
        idx = ALT.build_index({U: e}, r2map={})
        h = f'<h3>DGX Spark</h3><a href="https://amzn.to/x">{img("DGX Spark")}</a>'
        out = ALT.apply(h, "en", idx=idx)
        self.assertEqual(out, h)   # bisheriger Name des Links bleibt
        self.assertNotIn('alt=""', out)
        # Handtext fuer ein verlinktes, als dekorativ markiertes Bild wird genommen
        man = ALT.build_index({U: e}, {U: {"decorative": True, "alt": {"en": "NVIDIA DGX Spark on Amazon"}}}, r2map={})
        self.assertIn('alt="NVIDIA DGX Spark on Amazon"', ALT.apply(h, "en", idx=man))
        # nicht dekorativer Eintrag ersetzt auch im Link
        self.assertIn(ALTS["de"], ALT.apply(h, "de", idx=IDX))
        # Bild mit Linktext daneben ist nicht der Name des Links: dekorativ -> alt=""
        self.assertIn('alt=""', ALT.apply(f'<h3>DGX Spark</h3><a href="/x">{img("DGX Spark")} DGX Spark kaufen</a>', "en", idx=idx))

    def test_unknown_image_and_html_untouched_idempotent(self):
        h = f'<p>Text &amp; more</p><h3>X</h3>{img("X", src="https://img.m365.fm/i/other.webp")}<p data-alt="x">y</p>'
        self.assertEqual(ALT.apply(h, "en", idx=IDX), h)
        once = ALT.apply(f"<h2>Teams adoption</h2>{img('Teams adoption')}<p>after</p>", "de", idx=IDX)
        self.assertEqual(ALT.apply(once, "de", idx=IDX), once)
        self.assertTrue(once.endswith("<p>after</p>") and once.startswith("<h2>Teams adoption</h2>"))

    def test_source_url_resolves_via_r2_map_and_quotes_escaped(self):
        e = dict(ENTRY, alt=dict(ALTS, en='Chart "Teams" & Groups'))
        out = ALT.apply(img("Generated image", src=SRC), "en", idx=ALT.build_index({U: e}, r2map={SRC: U}))
        self.assertIn('alt="Chart &quot;Teams&quot; &amp; Groups"', out)
        self.assertIn(f'src="{SRC}"', out)   # src bleibt (site_r2 schreibt beim Schreiben um)

    def test_shrink_move_old_key_still_found(self):
        new = "https://img.m365.fm/i/abc-w1600.webp"
        idx = ALT.build_index({U: ENTRY}, r2map={SRC: new})   # --shrink hat r2_map auf die neue URL umgestellt
        self.assertIs(idx[new], ENTRY)
        idx2 = ALT.build_index({U: dict(ENTRY, src=[])}, r2map={"x": new})   # ohne src: Namensregel -w1600, wenn r2_map die URL kennt
        self.assertIn(new, idx2)
        self.assertNotIn(new, ALT.build_index({U: dict(ENTRY, src=[])}, r2map={}))

    def test_manual_overrides_win(self):
        idx = ALT.build_index({U: ENTRY}, {U: {"alt": {"de": "Handtext der Redaktion"}}}, r2map={})
        self.assertIn('alt="Handtext der Redaktion"', ALT.apply(img("Teams adoption"), "de", idx=idx))
        self.assertIn(f'alt="{ALTS["en"]}"', ALT.apply(img("Generated image"), "en", idx=idx))

    def test_enhance_without_lang_never_changes_alt(self):
        # translate_blog.source_of zerlegt site_podpage.san -> enhance ohne Sprache: Alt-Texte duerfen sich dort nicht aendern (Uebersetzungs-Hashes)
        with mock.patch.object(ALT, "_IDX", IDX):
            h = f"<h2>Teams adoption</h2><p>{img('Teams adoption')}</p>"
            self.assertIn('alt="Teams adoption"', IMG.enhance(h))
            self.assertIn(f'alt="{ALTS["en"]}"', IMG.enhance(h, lang="en"))
            self.assertIn(f'alt="{ALTS["de"]}"', IMG.alt_text(h, "de"))

    def test_no_data_no_change(self):
        h = f"<h2>A</h2>{img('A')}"
        self.assertEqual(ALT.apply(h, "en", idx={}), h)

    def test_set_alt_only_touches_alt(self):
        t = '<img data-alt="keep" src="x" alt=\'old\' altitude="1">'
        self.assertEqual(ALT.set_alt(t, "new"), '<img data-alt="keep" src="x" alt="new" altitude="1">')
        self.assertEqual(ALT.set_alt('<img src="x"/>', "n"), '<img src="x" alt="n"/>')


class Scan(unittest.TestCase):
    def test_context(self):
        h = "<h1>T</h1><p>Intro text.</p><h2>Teams <em>adoption</em></h2><p>Before the image.</p><p><img src='a.png' alt='Teams adoption'></p><p>After the image.</p><h2>Next</h2><p>Other</p>"
        im = ALT.scan(h)[0]
        self.assertEqual(im["heading"], "Teams adoption")
        self.assertIn("Before the image.", im["before"]); self.assertNotIn("Intro", im["before"])
        self.assertEqual(im["after"], "After the image.")
        self.assertIsNone(im["link"])

    def test_link_only_content(self):
        h = ("<p><a href='https://amzn.to/a'> <span><img src='a.png' alt='A'></span> </a></p>"
             "<p><a href='/b'><img src='b.png' alt='B'> Buy B</a></p>"
             "<p><a href='/c'><img src='c1.png'><img src='c2.png'></a></p>"
             "<p><a name='d'><img src='d.png'></a></p><a href='/e'><img src='e.png'>")
        self.assertEqual([im["link"] for im in ALT.scan(h)], ["https://amzn.to/a", None, None, None, None, "/e"])


def fake_msg(obj, stop="end_turn"):
    return {"type": "succeeded", "message": {"model": "claude-haiku-5-5", "stop_reason": stop, "usage": {"input_tokens": 1500, "output_tokens": 700},
                                              "content": [{"type": "text", "text": json.dumps(obj) if not isinstance(obj, str) else obj}]}}


GOOD = {"kind": "chart", "decorative": False, "alt": ALTS, "chart_points": ["Usage doubles"]}


class Tool(unittest.TestCase):
    def setUp(self):
        self.d = Path(tempfile.mkdtemp())
        (self.d / "data" / "podpage").mkdir(parents=True)
        posts = [{"slug": "p1", "title": "Teams guide", "html": f"<h2>Teams adoption</h2><p>Why it matters.</p>{img('Teams adoption', src=SRC)}<p>More.</p>"
                  + img("Generated image", src="https://blogifyai.s3.us-east-1.amazonaws.com/svg/x.png") + img("Logo", src="https://img.m365.fm/i/logo.svg")}]
        eps = [{"slug": "e1", "name": "Episode 1", "published": "2026-01-01", "show_notes": f"<p>{img('Teams adoption', src=U)}</p>"},
               {"slug": "e2", "name": "Hidden", "published": False, "show_notes": img("x", src="https://img.m365.fm/i/hidden.webp")}]
        for n, v in (("blog_posts", posts), ("episodes", eps)):
            with gzip.open(self.d / "data" / "podpage" / f"{n}.json.gz", "wt", encoding="utf-8") as f: json.dump(v, f)
        self.map = mock.patch.object(ALT.R2, "rewrite", lambda s: s.replace(SRC.replace("&", "&amp;"), U))
        self.map.start()

    def tearDown(self):
        self.map.stop()

    def test_collect_dedups_and_lists_foreign_hosts(self):
        items, foreign = RA.collect_images(RA.sources(self.d))
        self.assertEqual(set(items), {U, "https://img.m365.fm/i/logo.svg"})
        self.assertEqual(items[U]["uses"], 2); self.assertEqual(sorted(items[U]["src"]), sorted([SRC, U]))
        self.assertEqual(items[U]["ctx"]["heading"], "Teams adoption"); self.assertEqual(items[U]["ctx"]["page_title"], "Teams guide")
        self.assertEqual(list(foreign), ["https://blogifyai.s3.us-east-1.amazonaws.com/svg/x.png"])
        todo = RA.pending(items, {}, {})
        self.assertEqual([it["url"] for it in todo], [U])   # SVG kann das Modell nicht lesen

    def test_plan_counts_and_estimates_eur(self):
        items, foreign = RA.collect_images(RA.sources(self.d))
        txt, todo = RA.plan_text(items, foreign, {}, {}, {U: [1200, 675]})
        self.assertIn("offen 1", txt); self.assertIn("EUR mit Batch API", txt); self.assertIn("fremden Hosts", txt)
        tin, tout = RA.estimate(todo, {U: [1200, 675]})
        self.assertGreater(tin, 1000); self.assertEqual(tout, RA.OUT_TOKENS_EST)
        self.assertEqual(RA.image_tokens(U, {U: [1200, 675]}), 1080)
        self.assertLess(RA.image_tokens(U, {U: [4000, 3000]}), 1600)

    def test_request_shape(self):
        items, _ = RA.collect_images(RA.sources(self.d))
        r = RA.request_for(items[U], "a00000")
        p = r["params"]
        self.assertEqual(p["model"], "claude-haiku-5-5"); self.assertEqual(p["thinking"], {"type": "disabled"})
        self.assertEqual(p["output_config"]["format"]["type"], "json_schema")
        self.assertEqual(set(p["output_config"]["format"]["schema"]["properties"]["alt"]["required"]), set(ALT.LANGS))
        self.assertEqual(p["messages"][0]["content"][0]["source"], {"type": "url", "url": U})
        ctx = json.loads(p["messages"][0]["content"][1]["text"]); self.assertEqual(ctx["heading_above"], "Teams adoption")
        self.assertIs(ctx["image_is_link"], False); self.assertNotIn("link_target", ctx)
        b = RA.request_for(items[U], "a1", ("image/webp", "QUJD"))
        self.assertEqual(b["params"]["messages"][0]["content"][0]["source"]["type"], "base64")

    def test_linked_image_context_for_model(self):
        srcs = [("blog", "p", "Gear", f"<h3>DGX Spark</h3><p>{img('DGX Spark')}</p>"),
                ("blog", "q", "Gear 2", f"<h3>DGX Spark</h3><a href='https://amzn.to/x'>{img('DGX Spark')}</a>")]
        items, _ = RA.collect_images(srcs)
        ctx = json.loads(RA.user_text(items[U]))
        self.assertIs(ctx["image_is_link"], True); self.assertEqual(ctx["link_target"], "https://amzn.to/x")
        self.assertIn("image_is_link", RA.SYSTEM); self.assertIn("decorative must be false", RA.SYSTEM)

    def test_validate(self):
        e, why = RA.validate(json.dumps(GOOD)); self.assertIsNone(why); self.assertEqual(e["chart_points"], ["Usage doubles"])
        self.assertEqual(RA.validate("nope")[1], "kein JSON")
        self.assertIn("Sprachen fehlen", RA.validate(json.dumps(dict(GOOD, alt={"en": "Chart of Teams usage"})))[1])
        self.assertEqual(RA.validate(json.dumps(dict(GOOD, alt=dict(ALTS, en="Generated image"))))[1], "Platzhalter als Alt-Text")
        d, _ = RA.validate(json.dumps(dict(GOOD, kind="decorative", alt={l: "x" for l in ALT.LANGS})))
        self.assertTrue(d["decorative"]); self.assertEqual(set(d["alt"].values()), {""})
        long_, _ = RA.validate(json.dumps(dict(GOOD, kind="photo", alt=dict(ALTS, en="word " * 80))))
        self.assertLessEqual(len(long_["alt"]["en"]), 161)

    def test_apply_results_tries_and_api_failures(self):
        items = {U: {"src": [SRC], "orig_alts": ["Teams adoption"]}, "u2": {}, "u3": {}, "u4": {}}
        lines = [json.dumps({"custom_id": "a0", "result": fake_msg(GOOD)}), json.dumps({"custom_id": "a1", "result": fake_msg("garbage")}),
                 json.dumps({"custom_id": "a2", "result": {"type": "errored", "error": {"type": "error", "error": {"type": "invalid_request_error", "message": "Unable to download image"}}}}),
                 json.dumps({"custom_id": "a3", "result": fake_msg(GOOD, stop="max_tokens")})]
        out, tries = {}, {"u3": {"n": 1}}
        ok, bad, tin, tout, cr, cw, fail = RA.apply_results(lines, {"a0": U, "a1": "u2", "a2": "u3", "a3": "u4"}, items, out, tries, now="T")
        self.assertEqual((ok, bad), (1, 2)); self.assertEqual(tin, 4500); self.assertEqual(tout, 2100)
        self.assertEqual(out[U]["src"], [SRC]); self.assertEqual(out[U]["orig_alts"], ["Teams adoption"]); self.assertEqual(out[U]["v"], RA.VERSION)
        self.assertEqual(tries["u2"]["n"], 1); self.assertEqual(tries["u4"]["err"], "max_tokens")
        self.assertEqual(tries["u3"], {"n": 1})   # API-Ausfall zaehlt nicht als Versuch
        self.assertEqual(list(fail.values()), [1])

    def _paths(self):
        return mock.patch.multiple(RA, ROOT=self.d, OUT=self.d / "data" / "r2_alt.json.gz", STATE=self.d / "data" / "r2_alt_state.json", DIMS=self.d / "data" / "r2_dims.json")

    def test_run_submits_collects_and_never_repays(self):
        calls = []

        def fake_api(method, path, body=None):
            calls.append((method, path, body))
            if method == "POST":
                return {"id": "msgbatch_1"}
            return {"processing_status": "ended", "request_counts": {}, "results_url": "https://api.anthropic.com/r"}

        lines = lambda url: [json.dumps({"custom_id": "a00000", "result": fake_msg(GOOD)})]
        env = {"ANTHROPIC_API_KEY": "test-dummy", "COMMUNITY_API": ""}
        with self._paths(), mock.patch.object(RA, "api", fake_api), mock.patch.object(RA, "results", lines), mock.patch.dict(os.environ, env), \
                mock.patch.object(RA, "report_usage") as rep:
            self.assertEqual(RA.main(["run", "--limit", "5"]), 0)
            st = json.loads((self.d / "data" / "r2_alt_state.json").read_text())
            self.assertEqual(st["batch"]["id"], "msgbatch_1"); self.assertEqual(list(st["batch"]["map"].values()), [U])
            self.assertEqual(len(calls[0][2]["requests"]), 1)
            self.assertEqual(RA.main(["collect"]), 0)
            rep.assert_called_once(); self.assertTrue(rep.call_args.kwargs.get("batch"))
            data = json.loads(gzip.open(self.d / "data" / "r2_alt.json.gz", "rt", encoding="utf-8").read())
            self.assertEqual(data[U]["alt"]["de"], ALTS["de"])
            self.assertIsNone(json.loads((self.d / "data" / "r2_alt_state.json").read_text())["batch"])
            n = len(calls)
            self.assertEqual(RA.main(["run"]), 0)   # alles fertig: keine neue Anfrage
            self.assertEqual(len(calls), n)

    def test_budget_refusal_sends_nothing(self):
        with self._paths(), mock.patch.object(RA, "api") as api, mock.patch.object(RA, "check_budget", return_value=False), mock.patch.dict(os.environ, {"ANTHROPIC_API_KEY": "test-dummy"}):
            self.assertEqual(RA.main(["run"]), 0)
            api.assert_not_called()
            self.assertFalse((self.d / "data" / "r2_alt_state.json").exists())

    def test_plan_sends_nothing(self):
        with self._paths(), mock.patch.object(RA, "api") as api, mock.patch.dict(os.environ, {"ANTHROPIC_API_KEY": "test-dummy"}):
            self.assertEqual(RA.main(["plan"]), 0)
            api.assert_not_called()

    def test_base64_select_skips_unloadable(self):
        todo = [{"url": "a"}, {"url": "b"}]
        sel, skipped = RA.select(todo, 0, "base64", fetch=lambda u: ("image/webp", "QUJD") if u == "a" else (_ for _ in ()).throw(ValueError("x")))
        self.assertEqual([it["url"] for it, _ in sel], ["a"]); self.assertEqual(skipped[0][0], "b")

    def test_save_out_deterministic(self):
        p = self.d / "o.json.gz"
        RA.save_out({"b": 1, "a": 2}, p); one = p.read_bytes()
        RA.save_out({"a": 2, "b": 1}, p); self.assertEqual(one, p.read_bytes())



class Stage1(unittest.TestCase):
    def test_flags_alt_empty(self):
        import site_design as SD
        self.assertIn('alt=""', SD.flag("de", "", "Deutsch"))
        html = SD.lang_dropdown("de", [("de", "Deutsch", "/de/", "de"), ("fr", "Français", "/fr/", "fr")], "")
        self.assertNotIn('alt="Deutsch"', html); self.assertIn('aria-label="Sprache: Deutsch"', html)

    def test_cover_alt_localized(self):
        import site_podpage as P
        self.assertEqual(P.cover_alt("en", "Teams Tips"), "Cover: Teams Tips")
        self.assertEqual(P.cover_alt("de", "Teams-Tipps"), "Cover: Teams-Tipps")
        self.assertEqual(P.cover_alt("fr", "Astuces Teams"), "Couverture : Astuces Teams")
        self.assertEqual(P.cover_alt("ja", "Teams"), "カバー：Teams")

    def test_py_i18n_has_all_languages(self):
        d = json.loads((ROOT / "data" / "py_i18n.json").read_text("utf-8"))
        for k in ("Cover: {t}", "Cover image: {t}", "Logo of {n}"):
            self.assertEqual(set(d[k]), set(ALT.LANGS) - {"en", "de"}, k)
            self.assertTrue(all(("{t}" if "{t}" in k else "{n}") in v for v in d[k].values()), k)

    def test_legacy_hero_localized(self):
        import site_legacy_blog as LB
        ep = {"slug": "e1", "name": "Teams Tips", "image_path": "https://d3wo5wojvuv7l.cloudfront.net/images.spreaker.com/original/abc.jpg"}
        with mock.patch.dict(LB._EPT, {"de": {"e1": ["Teams-Tipps", ""]}}):
            self.assertIn('alt="Cover: Teams-Tipps"', LB.hero_html("de", "p", "Titel", ep))
            self.assertIn('alt="Cover: Teams Tips"', LB.hero_html("en", "p", "Title", ep))
            self.assertIn('alt="Cover: Teams Tips"', LB.hero_html("de", "p", "Titel", dict(ep, slug="e2")))   # ohne Uebersetzung: englischer Folgentitel
        svg = LB.hero_html("fr", "p", "Mon titre", None)
        self.assertIn('aria-label="Image de couverture : Mon titre"', svg); self.assertIn(">Mon titre<", svg)
        self.assertIn('aria-label="Cover image: Title"', LB.hero_html("en", "p", "Title", None))


if __name__ == "__main__":
    unittest.main()
