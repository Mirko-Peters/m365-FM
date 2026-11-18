"""Infografiken: Pruefung der Bildtexte, Seitenanbindung (ohne Freigabe Byte fuer Byte unveraendert), Rendern/Index mit Attrappen, Batch-Auswertung."""
import copy, gzip, json, sys, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tools"))
import infographics as IGT
import site_infographics as IG

HEADER = {"template": "bigfact", "alt": "Four goals of data governance", "tags": ["Purview"], "kicker": "Podcast · Microsoft Purview", "title": "Unified Catalog: data you can rely on",
          "hero": {"value": "3", "label": "goals of data governance"}, "chips": [{"t": "Findable", "n": "People can locate it"}, {"t": "Accurate", "n": "Content is correct"}, {"t": "Trusted", "n": "People believe it"}]}
FLOW = {"template": "flow", "alt": "Four steps from event to analytics", "tags": ["Kafka"], "kicker": "Entity · Data streaming", "title": "Apache Kafka", "sub": "A stream of events that is kept.", "hero": {"value": "3", "label": "steps", "sub": "from event to analytics"},
        "hi": 1, "steps": [{"t": "Publish", "n": "Producers write events."}, {"t": "Keep", "n": "The stream is stored."}, {"t": "Read", "n": "Consumers read on their own."}], "note": "One stream, many readers."}
HUB = {"template": "hub", "alt": "Application Insights telemetry kinds", "tags": [], "kicker": "Entity · Azure Monitor", "title": "Application Insights", "core": {"value": "3", "label": "kinds of telemetry"},
       "nodes": [{"t": "Requests", "n": "How many arrive."}, {"t": "Responses", "n": "How fast the app answers."}, {"t": "Exceptions", "n": "What fails."}]}
SET = {"header": HEADER, "figs": [FLOW, HUB]}


def de_set():
    s = copy.deepcopy(SET)
    s["header"]["kicker"] = "Podcast · Microsoft Purview"; s["header"]["title"] = "Unified Catalog: Daten, auf die man sich verlassen kann"; s["header"]["hero"]["label"] = "Ziele der Datenverwaltung"
    s["header"]["alt"] = "Vier Ziele der Datenverwaltung"; s["figs"][0]["title"] = "Apache Kafka"; s["figs"][0]["sub"] = "Ein Strom von Ereignissen, der erhalten bleibt."
    return s


class SpecChecks(unittest.TestCase):
    def test_valid_set(self):
        self.assertIsNone(IGT.check_set(SET))
        self.assertIsNone(IGT.check_set(de_set(), "de", SET))

    def test_rejects_bad_sets(self):
        s = copy.deepcopy(SET); s["figs"] = [FLOW]; self.assertIn("Anzahl", IGT.check_set(s))
        s = copy.deepcopy(SET); s["figs"] = [FLOW, FLOW]; self.assertEqual(IGT.check_set(s), "Vorlagen")
        s = copy.deepcopy(SET); s["header"]["title"] = "x" * 80; self.assertIn("Bild 0", IGT.check_set(s))
        s = copy.deepcopy(SET); s["figs"][0]["steps"] = s["figs"][0]["steps"][:2]; self.assertIn("Anzahl", IGT.check_set(s))
        s = copy.deepcopy(SET); s["figs"][0]["hi"] = 7; self.assertIn("hi", IGT.check_set(s))
        s = copy.deepcopy(SET); s["header"]["title"] = "A <b>x</b>"; self.assertIn("Sonderzeichen", IGT.check_set(s))

    def test_translation_must_keep_structure_and_numbers(self):
        d = de_set(); d["header"]["hero"]["value"] = "5"; self.assertEqual(IGT.check_set(d, "de", SET), "Zahl weicht ab")
        d = de_set(); d["figs"][0]["hero"]["value"] = "4"; self.assertIn("passt nicht", IGT.check_set(d, "de", SET))
        d = de_set(); d["header"]["chips"] = d["header"]["chips"] + [{"t": "x", "n": "y"}]; self.assertEqual(IGT.check_set(d, "de", SET), "Anzahl weicht ab")
        d = de_set(); d["figs"] = d["figs"][::-1]; self.assertEqual(IGT.check_set(d, "de", SET), "Vorlagen weichen vom Englischen ab")

    def test_script_per_language(self):
        ru = copy.deepcopy(SET); self.assertIn("Schrift", IGT.check_set(ru, "ru") or "")   # englischer Text als Russisch: abgelehnt
        d = de_set(); self.assertIn("fremde Schrift", IGT.check_spec({**d["header"], "title": "Каталог данных"}, "de") or "")

    def test_length_factor_for_translations(self):
        d = de_set(); d["header"]["title"] = "x" * 60   # 48 x 1,4 = 67
        self.assertIsNone(IGT.check_spec(d["header"], "de")); self.assertIn("Laenge", IGT.check_spec({**d["header"], "title": "x" * 70}, "de"))

    def test_numbers_must_match_content(self):
        s = copy.deepcopy(SET); s["figs"][0]["hero"]["value"] = "4"; self.assertEqual(IGT.check_set(s), "flow: Zahl passt nicht zu den Schritten")
        s = copy.deepcopy(SET); s["figs"][1]["core"]["value"] = "5"; self.assertEqual(IGT.check_set(s), "hub: Zahl passt nicht zu den Teilen")
        s = copy.deepcopy(SET); s["header"]["hero"]["value"] = "12"   # weder Zahl der Punkte noch im Text
        self.assertIn("Kopfbild", IGT.check_set(s, "en", None, "Text ohne diese Zahl, aber mit 7 und 120") or "")
        self.assertIsNone(IGT.check_set(s, "en", None, "Text mit 12 Punkten"))
        s["header"]["hero"]["value"] = "1"; self.assertIn("Kopfbild", IGT.check_set(s, "en", None, "Text mit 12 Punkten") or "")   # 1 steht nur in 12: nicht als Zahl

    def test_no_addresses_in_texts(self):
        s = copy.deepcopy(SET); s["figs"][0]["note"] = "Mehr auf www.example.com"; self.assertIn("Adresse", IGT.check_set(s))
        s = copy.deepcopy(SET); s["figs"][0]["note"] = "Write to a@b.c"; self.assertIn("Adresse", IGT.check_set(s))

    def test_schema_has_all_templates(self):
        names = [o["properties"]["template"]["enum"][0] for o in IGT.SET_SCHEMA["properties"]["figs"]["items"]["anyOf"]]
        self.assertEqual(names, list(IGT.FIG_TEMPLATES))
        self.assertEqual(set(IGT.SIZES), set(IG.SIZES))


class Sources(unittest.TestCase):
    def test_plain_and_hash(self):
        self.assertEqual(IGT.plain("<p>A &amp; B</p><script>x</script><p>C</p>"), "A & B\nC")
        a = {"title": "T", "text": "x"}; self.assertEqual(IGT.src_hash(a), IGT.src_hash(dict(a))); self.assertNotEqual(IGT.src_hash(a), IGT.src_hash({"title": "T", "text": "y"}))


def fixture_root(tmp):
    d = Path(tmp) / "data"; (d / "podpage").mkdir(parents=True)
    posts = [{"slug": "p1", "title": "Post 1", "html": "<p>" + "Text über Copilot und SharePoint. " * 30 + "</p>"}, {"slug": "kurz", "title": "Kurz", "html": "<p>zu kurz</p>"}]
    with gzip.open(d / "podpage" / "blog_posts.json.gz", "wt", encoding="utf-8") as f: json.dump(posts, f)
    return Path(tmp)


class Pipeline(unittest.TestCase):
    def test_slug_filter_and_store_paths(self):
        with tempfile.TemporaryDirectory() as t:
            r = fixture_root(t)
            posts = [{"slug": "../x", "title": "Boese", "html": "<p>" + "Text. " * 100 + "</p>"}, {"slug": "gut-1", "title": "Gut", "html": "<p>" + "Text. " * 100 + "</p>"}]
            with gzip.open(r / "data" / "podpage" / "blog_posts.json.gz", "wt", encoding="utf-8") as f: json.dump(posts, f)
            self.assertEqual([i["slug"] for i in IGT.items("blog", r)], ["gut-1"])
            with self.assertRaises(ValueError): IGT.DirStore(t).put("../aussen.json", {})

    def test_collect_runs_over_all_kinds_and_keeps_results(self):
        with tempfile.TemporaryDirectory() as t, tempfile.TemporaryDirectory() as s:
            root = fixture_root(t); store = IGT.DirStore(s)
            st = {"batches": [{"id": "b1", "stage": "specs", "lang": "en", "map": {"s0": "blog:p1"}, "est_eur": 0.1}], "tries": {}, "runs": []}
            good = {"custom_id": "s0", "result": {"type": "succeeded", "message": {"content": [{"type": "text", "text": json.dumps(SET)}], "usage": {"input_tokens": 100, "output_tokens": 50}}}}
            IGT.cmd_collect(0, store, st, ["entity"], root, api_fn=lambda m, p, b=None: {"processing_status": "ended", "results_url": "u"}, results_fn=lambda u: [json.dumps(good)])   # anderer Lauf (entity), Blog-Batch wird trotzdem verarbeitet
            self.assertEqual(store.get("ig/_specs/blog/p1.json")["en"], SET)

    def test_errored_requests_count_as_try(self):
        st = {"tries": {}}
        b = {"map": {"s0": "blog:p1"}}
        IGT.apply_results([json.dumps({"custom_id": "s0", "result": {"type": "errored"}})], b, None, st, {})
        self.assertEqual(st["tries"], {"blog:p1": 1})

    def test_render_failures_are_counted_and_skipped(self):
        with tempfile.TemporaryDirectory() as t, tempfile.TemporaryDirectory() as s:
            root = fixture_root(t); store = IGT.DirStore(s)
            store.put(IGT.spec_key(IGT.items("blog", root)[0]), {"v": 1, "en": SET})
            def bad(jobs, wd):
                for j in jobs: Path(j["out"] + ".png").write_bytes(b"x")
                return [{"out": j["out"], "ok": False, "issues": ["ueberlauf:t"]} for j in jobs]
            for _ in range(3): IGT.cmd_render(["blog"], ["en"], 0, store, root, render_fn=bad, webp_fn=lambda b: b, jpeg_fn=lambda b: b)
            self.assertEqual(IGT.load_state(root)["rfail"], {"blog:p1#en": 2})   # nach MAX_TRIES Versuchen nicht mehr gerendert

    def test_header_also_uploaded_as_jpeg(self):
        with tempfile.TemporaryDirectory() as t, tempfile.TemporaryDirectory() as s:
            root = fixture_root(t); store = IGT.DirStore(s)
            store.put(IGT.spec_key(IGT.items("blog", root)[0]), {"v": 1, "en": SET})
            def ok(jobs, wd):
                for j in jobs: Path(j["out"] + ".png").write_bytes(b"P")
                return [{"out": j["out"], "ok": True, "issues": []} for j in jobs]
            IGT.cmd_render(["blog"], ["en"], 0, store, root, render_fn=ok, webp_fn=lambda b: b"W", jpeg_fn=lambda b: b"J")
            h = IGT.load_index("blog", root)["p1"]["en"][0][1]
            self.assertEqual((Path(s) / f"ig/blog/p1/en-0-{h}.jpg").read_bytes(), b"J"); self.assertEqual((Path(s) / f"ig/blog/p1/en-0-{h}.webp").read_bytes(), b"W")

    def test_items_skip_short_posts(self):
        with tempfile.TemporaryDirectory() as t:
            its = IGT.items("blog", fixture_root(t))
            self.assertEqual([i["key"] for i in its], ["blog:p1"])

    def test_render_writes_index_and_images_only_for_clean_sets(self):
        with tempfile.TemporaryDirectory() as t, tempfile.TemporaryDirectory() as s:
            root = fixture_root(t); store = IGT.DirStore(s)
            it = IGT.items("blog", root)[0]
            store.put(IGT.spec_key(it), {"v": 1, "en": SET, "de": de_set()})
            def fake_render(jobs, wd):
                out = []
                for j in jobs:
                    Path(j["out"] + ".png").write_bytes(b"PNG" + j["out"].encode())
                    out.append({"out": j["out"], "ok": True, "issues": [], "w": 1, "h": 1})
                return out
            made, bad = IGT.cmd_render(["blog"], ["en", "de"], 0, store, root, render_fn=fake_render, webp_fn=lambda b: b"WEBP" + b, jpeg_fn=lambda b: b"JPG")
            self.assertEqual((made, bad), (2, 0))
            idx = IGT.load_index("blog", root)
            self.assertEqual([x[0] for x in idx["p1"]["en"]], ["bigfact", "flow", "hub"])
            self.assertEqual(idx["p1"]["en"][0][2], "Four goals of data governance")
            h = idx["p1"]["en"][1][1]
            self.assertTrue((Path(s) / IGT.img_key("blog", "p1", "en", 1, h)).exists())
            # zweiter Lauf: nichts mehr zu tun, Index unveraendert (deterministisch)
            before = IGT.index_path("blog", root).read_bytes()
            self.assertEqual(IGT.cmd_render(["blog"], ["en", "de"], 0, store, root, render_fn=fake_render, webp_fn=lambda b: b"WEBP" + b, jpeg_fn=lambda b: b"JPG"), (0, 0))
            self.assertEqual(IGT.index_path("blog", root).read_bytes(), before)

    def test_layout_failure_uploads_nothing(self):
        with tempfile.TemporaryDirectory() as t, tempfile.TemporaryDirectory() as s:
            root = fixture_root(t); store = IGT.DirStore(s)
            store.put(IGT.spec_key(IGT.items("blog", root)[0]), {"v": 1, "en": SET})
            def bad_render(jobs, wd):
                for j in jobs: Path(j["out"] + ".png").write_bytes(b"x")
                return [{"out": j["out"], "ok": j["out"].endswith("-0") or not j["out"].endswith("-1"), "issues": ["ueberlauf:t"]} for j in jobs]
            made, bad = IGT.cmd_render(["blog"], ["en"], 0, store, root, render_fn=bad_render, webp_fn=lambda b: b, jpeg_fn=lambda b: b)
            self.assertEqual((made, bad), (0, 1))
            self.assertEqual(IGT.load_index("blog", root), {})
            self.assertEqual(list((Path(s) / "ig").rglob("*.webp")), [])

    def test_collect_validates_and_stores(self):
        with tempfile.TemporaryDirectory() as t, tempfile.TemporaryDirectory() as s:
            root = fixture_root(t); store = IGT.DirStore(s)
            st = {"batches": [{"id": "b1", "stage": "specs", "lang": "en", "map": {"s0": "blog:p1", "s1": "blog:p1#de"}, "est_eur": 0.1}], "tries": {}, "runs": []}
            good = {"custom_id": "s0", "result": {"type": "succeeded", "message": {"content": [{"type": "text", "text": json.dumps(SET)}], "usage": {"input_tokens": 100, "output_tokens": 50}}}}
            bad = {"custom_id": "s1", "result": {"type": "succeeded", "message": {"content": [{"type": "text", "text": "kein json"}], "usage": {"input_tokens": 10, "output_tokens": 5}}}}
            IGT.cmd_collect(0, store, st, ["blog"], root, api_fn=lambda m, p, b=None: {"processing_status": "ended", "results_url": "u"}, results_fn=lambda u: [json.dumps(good), json.dumps(bad)])
            doc = store.get("ig/_specs/blog/p1.json")
            self.assertEqual(doc["en"], SET); self.assertNotIn("de", doc)
            self.assertEqual(st["tries"], {"blog:p1#de": 1}); self.assertEqual(st["batches"], [])


class Site(unittest.TestCase):
    def setUp(self):
        IG.reset()
        self.t = tempfile.TemporaryDirectory(); d = Path(self.t.name)
        (d / "infographics").mkdir()
        ent = {"p1": {"s": "x", "en": [["bigfact", "aaaaaaaa", "Header"], ["flow", "bbbbbbbb", "Flow"], ["hub", "cccccccc", "Hub"]], "de": [["bigfact", "dddddddd", "Kopf"], ["flow", "eeeeeeee", "Ablauf"]]}}
        with gzip.open(d / "infographics" / "blog.json.gz", "wt") as f: json.dump(ent, f)
        self.old = IG.D; IG.D = d
        self.html = "<p>eins</p><p>zwei</p><ul><li>a</li></ul><p>drei</p><figure><p>bild</p></figure><p>vier</p><p>fuenf</p><p>sechs</p>"

    def tearDown(self):
        IG.D = self.old; IG.reset(); self.t.cleanup()

    def live(self, langs=("en",), kinds=("blog",)):
        (IG.D / "infographics_live.json").write_text(json.dumps({"langs": list(langs), "kinds": list(kinds)})); IG.reset()

    def test_live_file_with_wrong_shape_does_not_break(self):
        (IG.D / "infographics_live.json").write_text("[]"); IG.reset(); self.assertEqual(IG.page_kw("blog", "p1", "en"), {})

    def test_without_release_everything_is_unchanged(self):
        self.assertEqual(IG.inject(self.html, "blog", "p1", "en"), self.html)
        self.assertEqual(IG.hero_figure("blog", "p1", "en"), ""); self.assertIsNone(IG.og("blog", "p1", "en")); self.assertEqual(IG.page_kw("blog", "p1", "en"), {})
        self.assertEqual(IG.apply_post(self.html, "p1", "en"), (self.html, {}))

    def test_release_is_per_language_and_kind(self):
        self.live(("en",), ("entity",)); self.assertEqual(IG.page_kw("blog", "p1", "en"), {})
        self.live(("de",), ("blog",)); self.assertEqual(IG.page_kw("blog", "p1", "en"), {})
        self.assertEqual(IG.page_kw("blog", "p1", "de"), {})   # de ist unvollstaendig (nur Kopfbild + 1): gar nichts

    def test_inject_distributes_outside_lists_and_figures(self):
        self.live()
        out = IG.inject(self.html, "blog", "p1", "en")
        self.assertEqual(out.count("<figure class=\"ig-fig"), 2)
        self.assertNotIn("</li><figure", out); self.assertNotIn("<figure><p>bild</p><figure", out)
        self.assertIn("/ig/blog/p1/en-1-bbbbbbbb.webp", out); self.assertIn("/ig/blog/p1/en-2-cccccccc.webp", out)
        self.assertNotIn("en-0-", out)   # das Kopfbild steht nie im Text
        self.assertEqual(IG.inject("<p>kurz</p>", "blog", "p1", "en").count("<figure"), 2)   # wenig Text: Bilder am Ende

    def test_post_gets_hero_og_and_loses_old_hero(self):
        self.live()
        old = '<figure class="en-fig"><svg></svg></figure>' + self.html
        out, kw = IG.apply_post(old, "p1", "en")
        self.assertTrue(out.startswith('<figure class="ig-fig ig-bigfact"'))
        self.assertNotIn("en-fig", out); self.assertIn('fetchpriority="high"', out)
        self.assertEqual(kw["og_image"], ("https://img.m365.fm/ig/blog/p1/en-0-aaaaaaaa.jpg", 1200, 630)); self.assertTrue(kw["og_share"])
        cover = '<figure style="margin:1em 0"><img src="x" alt="a" width="640" height="360" fetchpriority="high" decoding="async" style="width:100%;max-width:640px;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:8px"></figure><p>a</p>'
        self.assertNotIn("640", IG.replace_hero(cover))
        own = '<figure style="margin:1em 0"><img src="x" width="640" height="360"></figure><p>a</p>'   # eigenes Bild des Autors bleibt
        self.assertEqual(IG.replace_hero(own), own); self.assertEqual(IG.replace_hero('<p>x</p><figure class="en-fig"></figure>'), '<p>x</p><figure class="en-fig"></figure>')


if __name__ == "__main__":
    unittest.main()
