"""Feste "Aehnliche Folgen" statt "Neueste Folgen" in der Seitenleiste (Mirko, 25.11.2026, site_related.py):
einmal je Inhalt berechnet und in data/sidebar_related.json gespeichert, danach nur gelesen (neue Folgen aendern bestehende Seiten nicht),
hoechstens 5, nie die Seite selbst, in der Sprache der Seite; Uebersichtsseiten ohne Folgen-Karte."""
import json, os, re, sys, tempfile, unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_related as SR   # noqa: E402

BASE = "https://www.m365.fm"


def data():
    """Kleiner Bau: 7 Folgen der Hauptshow, 3 Videos mit Dub-Fassungen (eines mit englischem Original)."""
    H = {
        "a": {"t": {"sharepoint": 1}, "k": {"teams": 2}},
        "b": {"t": {"sharepoint": 1}, "k": {}},
        "c": {"t": {}, "k": {"sharepoint": 5}},
        "d": {"t": {"teams": 1}, "k": {}},
        "e": {"t": {}, "k": {"sharepoint": 1}},
        "f": {"t": {"sharepoint": 1}, "k": {"teams": 1}},
        "g": {"t": {"intune": 1}, "k": {}},
    }
    dates = {"a": "2026-01-01", "b": "2026-02-01", "c": "2026-03-01", "d": "2026-04-01", "e": "2026-05-01", "f": "2026-06-01", "g": "2026-07-01"}
    items = [{"slug": s, "date": dates[s], "url": f"{BASE}/show/episodes/{s}/", "e": {"title": s.upper()}, **({"yt": "YT_A_______"} if s == "a" else {})} for s in H]
    idx = {"items": items, "by_slug": {i["slug"]: i for i in items}, "by_sid": {"777": items[6]}}   # Extraktion: Spreaker-Folge 777 = g
    dub = lambda v, l, d, t, eid: {"vid": v, "lang": l, "date": d, "eid": eid, "slug": f"{v.lower()}-{l}", "e": {"title": t}}
    by_vid = {
        "YT_A_______": {"de": dub("YT_A_______", "de", "2026-01-02", "A de", 11), "fr": dub("YT_A_______", "fr", "2026-01-02", "A fr", 12)},
        "YT_X_______": {"de": dub("YT_X_______", "de", "2026-08-01", "SharePoint X", 21)},
        "YT_Y_______": {"fr": dub("YT_Y_______", "fr", "2026-09-01", "Teams Y", 31)},
    }
    orig = {"YT_A_______": "a"}
    hits = {"YT_X_______": {"sharepoint"}, "YT_Y_______": {"teams"}}
    dub_hits = lambda l, it: hits.get(it["vid"], set())
    ext = {"intune": ["777"], "teams": ["31"]}
    return H, idx, by_vid, orig, dub_hits, (lambda i: ext.get(i, []))


class PickTest(unittest.TestCase):
    def setUp(self):
        self.H, self.idx, self.by_vid, self.orig, self.dh, self.ef = data()
        self.P, self.yts = SR.build_picker(self.H, self.idx, self.by_vid, self.orig, self.dh, self.ef)

    def test_scores_like_find_episodes_max_five_never_self(self):
        ss, sv = SR.self_of("e:a", lambda s: self.yts.get(s, ()), lambda v: ())
        self.assertEqual(sv, {"YT_A_______"})
        ent = self.P.pick(["sharepoint"], ss, sv)
        # Titel 3 (b, f), Kernpunkte bis 3 (c: 5 Nennungen -> 3), e: 1; Gleichstand neuer zuerst (f vor b vor c)
        self.assertEqual(ent["e"], ["f", "c", "b", "e"])
        self.assertNotIn("a", ent["e"]); self.assertNotIn("YT_A_______", ent["v"])
        self.assertEqual(ent["v"], ["YT_X_______"])
        many = self.P.pick(["sharepoint", "teams", "intune"])
        self.assertLessEqual(len(many["e"]), SR.NE); self.assertEqual(len(many["e"]), 5)

    def test_first_three_entities_count_double_and_extraction_bonus(self):
        ent = self.P.pick(["x1", "x2", "x3", "teams", "intune"])
        self.assertEqual(ent["e"][0], "g", "Extraktion +5 schlaegt Titel 3")
        self.assertEqual(self.P.pick(["sharepoint", "x2", "x3", "teams"])["e"], ["a", "f", "c", "b", "d"])
        self.assertEqual(self.P.pick(["teams", "x2", "x3", "sharepoint"])["e"], ["a", "d", "f", "c", "b"], "die ersten 3 Entitaeten zaehlen doppelt")
        self.assertIn("YT_Y_______", self.P.pick(["teams"])["v"], "Dub-Video ohne Original: Titel/Tags 3 + Extraktion 5")

    def test_only_positive_and_deterministic(self):
        self.assertEqual(self.P.pick(["unbekannt"]), {"e": [], "v": []})
        self.assertEqual(self.P.pick(["sharepoint", "teams"]), self.P.pick(["sharepoint", "teams"]))

    def test_dub_video_with_original_takes_english_score(self):
        self.assertEqual(self.P.pick(["teams"])["v"], ["YT_Y_______", "YT_A_______"], "Y: Titel/Tags 3 + Extraktion 5; A: Punkte der englischen Folge a (Kernpunkte 2)")

    def test_ids_for_episode_language_neutral_else_self_then_chips(self):
        live = {"sharepoint": 1, "teams": 1}
        self.assertEqual(SR.ids_for("e:a", self.H, live, lambda: ["zzz"]), ["sharepoint", "teams"])
        self.assertEqual(SR.ids_for("e:g", self.H, live, lambda: ["teams"]), ["teams"], "keine erlaubte Entitaet -> Chips")
        self.assertEqual(SR.ids_for("ent:intune", self.H, live, lambda: ["teams", "intune"], exclude=("intune",)), ["intune", "teams"])


class LinksTest(unittest.TestCase):
    def test_language_targets_and_dub_filter(self):
        H, idx, by_vid, *_ = data()
        en = lambda s: (idx["by_slug"][s]["url"], idx["by_slug"][s]["e"]["title"]) if s in idx["by_slug"] else None
        dub = lambda v, l: (f"{BASE}/{l}/{by_vid[v][l]['slug']}/", by_vid[v][l]["e"]["title"]) if l in by_vid.get(v, {}) else None
        ent = {"e": ["b", "weg", "c"], "v": ["YT_Y_______", "YT_X_______", "YT_A_______"]}
        self.assertEqual(SR.links(ent, "en", en, dub), [(f"{BASE}/show/episodes/b/", "B"), (f"{BASE}/show/episodes/c/", "C")], "entfallene Folge faellt beim Ausgeben weg")
        self.assertEqual([t for _, t in SR.links(ent, "de", en, dub)], ["SharePoint X", "A de"])
        self.assertEqual([u for u, _ in SR.links(ent, "fr", en, dub)], [f"{BASE}/fr/yt_y_______-fr/", f"{BASE}/fr/yt_a_______-fr/"])
        self.assertEqual(SR.links(ent, "ja", en, dub), [])
        self.assertEqual(len(SR.links({"e": list("abcdefg")}, "en", en, dub)), 5)
        self.assertEqual(SR.links(None, "en", en, dub), [])


class StoreTest(unittest.TestCase):
    def test_once_computed_stays_fixed_and_new_keys_get_entries(self):
        with tempfile.TemporaryDirectory() as d:
            f = Path(d) / "sidebar_related.json"
            H, idx, by_vid, orig, dh, ef = data()
            P, _ = SR.build_picker(H, idx, by_vid, orig, dh, ef)
            st = SR.Store(f)
            first = SR.fixed(st, "ent:sharepoint", lambda: P.pick(["sharepoint"]))
            SR.fixed(st, "ent:leer", lambda: P.pick(["nichts"]))
            self.assertTrue(st.save()); b1 = f.read_bytes()
            # neuer Bau: eine neue Folge "z" nennt SharePoint im Titel und in den Kernpunkten (beste Punktzahl)
            H2 = dict(H, z={"t": {"sharepoint": 1}, "k": {"sharepoint": 3}})
            idx["items"].append({"slug": "z", "date": "2026-12-01", "url": "/z/", "e": {"title": "Z"}}); idx["by_slug"]["z"] = idx["items"][-1]
            P2, _ = SR.build_picker(H2, idx, by_vid, orig, dh, ef)
            st2 = SR.Store(f)
            calls = []
            again = SR.fixed(st2, "ent:sharepoint", lambda: calls.append(1) or P2.pick(["sharepoint"]))
            self.assertEqual(again, first); self.assertEqual(calls, [], "fester Eintrag wird nicht neu berechnet")
            self.assertFalse(st2.save()); self.assertEqual(f.read_bytes(), b1, "nichts Neues -> Datei byte-gleich, kein Bot-Commit")
            new = SR.fixed(st2, "ent:neu", lambda: P2.pick(["sharepoint"]))
            self.assertEqual(new["e"][0], "z", "neuer Inhalt bekommt beim ersten Bau seinen Eintrag mit den aktuellen Folgen")
            self.assertTrue(st2.save())
            lines = f.read_text("utf-8").splitlines()
            self.assertTrue(lines[0].startswith('{"_v":1,'))
            self.assertEqual([l.split('":', 1)[0][1:] for l in lines[1:-1]], ["ent:neu", "ent:sharepoint"], "ein Schluessel je Zeile, sortiert; leere Auswahl nicht gespeichert")
            self.assertEqual(json.loads(f.read_text("utf-8"))["items"]["ent:sharepoint"], first)

    def test_empty_selection_not_frozen_filled_once_then_fixed(self):
        """Seite ohne passende Folge (neue Entitaet, leeres Profil): keine Karte, jeder Bau rechnet neu; sobald eine Folge passt, einmal fest."""
        with tempfile.TemporaryDirectory() as d:
            f = Path(d) / "s.json"
            H, idx, by_vid, orig, dh, ef = data()
            P, _ = SR.build_picker(H, idx, by_vid, orig, dh, ef)
            st = SR.Store(f)
            self.assertEqual(SR.fixed(st, "ent:copilot", lambda: P.pick(["copilot"])), {"e": [], "v": []})
            self.assertEqual(SR.fixed(st, "ent:copilot", lambda: self.fail("im selben Bau nicht neu rechnen")), {"e": [], "v": []}, "alle Sprachen dieses Baus gleich")
            SR.fixed(st, "ent:sp", lambda: P.pick(["sharepoint"])); st.save()
            self.assertNotIn('"ent:copilot"', f.read_text("utf-8"), "leer wird nicht gespeichert")
            H2 = dict(H, z={"t": {"copilot": 1}, "k": {}}); idx["items"].append({"slug": "z", "date": "2026-12-01", "url": "/z/", "e": {"title": "Z"}}); idx["by_slug"]["z"] = idx["items"][-1]
            P2, _ = SR.build_picker(H2, idx, by_vid, orig, dh, ef)
            st2 = SR.Store(f); b_sp = json.loads(f.read_text("utf-8"))["items"]["ent:sp"]
            self.assertEqual(SR.fixed(st2, "ent:copilot", lambda: P2.pick(["copilot"]))["e"], ["z"], "neue passende Folge -> Karte erscheint")
            self.assertTrue(st2.save()); b2 = f.read_bytes()
            self.assertEqual(json.loads(b2)["items"]["ent:sp"], b_sp, "nicht-leerer Eintrag bleibt byte-gleich")
            H3 = dict(H2, y={"t": {"copilot": 1}, "k": {"copilot": 3}}); idx["items"].append({"slug": "y", "date": "2026-12-02", "url": "/y/", "e": {"title": "Y"}}); idx["by_slug"]["y"] = idx["items"][-1]
            P3, _ = SR.build_picker(H3, idx, by_vid, orig, dh, ef)
            st3 = SR.Store(f)
            self.assertEqual(SR.fixed(st3, "ent:copilot", lambda: P3.pick(["copilot"]))["e"], ["z"], "danach fest")
            self.assertFalse(st3.save()); self.assertEqual(f.read_bytes(), b2)

    def test_new_episode_without_keypoints_stays_open_for_fresh_days(self):
        it = {"slug": "n", "date": "2026-11-20", "keypoints": [], "faq": []}
        self.assertFalse(SR.episode_final(it, "2026-11-25"), "neue Folge ohne Kernpunkte: noch nicht fest")
        self.assertTrue(SR.episode_final(dict(it, keypoints=["x"]), "2026-11-25"))
        self.assertTrue(SR.episode_final(dict(it, faq=[{"q": "a", "a": "b"}]), "2026-11-25"))
        self.assertTrue(SR.episode_final(it, "2026-12-31"), f"nach {SR.FRESH_DAYS} Tagen fest, auch ohne Kernpunkte")
        self.assertTrue(SR.episode_final(None, "2026-11-25"))
        with tempfile.TemporaryDirectory() as d:
            st = SR.Store(Path(d) / "s.json")
            self.assertEqual(SR.fixed(st, "e:n", lambda: {"e": ["a"], "v": []}, final=False), {"e": ["a"], "v": []})
            self.assertFalse(st.save(), "vorlaeufig: nicht gespeichert")
            self.assertEqual(SR.fixed(st, "e:n", lambda: self.fail("nicht neu")), {"e": ["a"], "v": []}, "im selben Bau fuer alle Sprachen gleich")

    def test_no_save_without_entity_export(self):
        with tempfile.TemporaryDirectory() as d:
            f = Path(d) / "s.json"; st = SR.Store(f)
            SR.fixed(st, "ent:x", lambda: {"e": ["a"], "v": []})
            self.assertFalse(st.save(allow=False)); self.assertFalse(f.exists(), "Bau ohne Entitaeten-Export schreibt keine neuen Eintraege")
            self.assertTrue(st.save()); self.assertTrue(f.exists())
        src = (ROOT / "site_learn.py").read_text("utf-8")
        self.assertIn("ENTITY_EXPORT_OK = bool(over)", src)
        self.assertIn("_SRS.save(allow=LRN.ENTITY_EXPORT_OK is not False)", (ROOT / "generate_site.py").read_text("utf-8"))

    def test_version_bump_recomputes_and_broken_file_tolerated(self):
        with tempfile.TemporaryDirectory() as d:
            f = Path(d) / "s.json"
            f.write_text(json.dumps({"_v": SR.VERSION + 1, "items": {"ent:x": {"e": ["a"], "v": []}}}))
            self.assertIsNone(SR.Store(f).get("ent:x"))
            f.write_text("{kaputt")
            self.assertEqual(SR.Store(f).items, {})
            self.assertEqual(SR.Store(Path(d) / "fehlt.json").items, {})

    def test_entry_size_capped(self):
        st = SR.Store(Path(tempfile.gettempdir()) / "gibt-es-nicht-sr.json")
        e = st.put("k", {"e": list("abcdefgh"), "v": [f"v{i}" for i in range(40)]})
        self.assertEqual((len(e["e"]), len(e["v"])), (SR.NE, SR.NV))

    def test_dub_list_covers_every_language_with_five(self):
        """Arabisch hat nur fuer gut ein Drittel der Videos eine Fassung: "v" waechst, bis auch ar seine 5 besten hat; andere Sprachen unveraendert."""
        langs = {f"V{i:02d}": (("ar", "de", "fr") if i % 3 == 0 else ("de", "fr")) for i in range(30)}
        ranked = sorted(langs)
        v = SR._cover(ranked, lambda x: langs[x])
        de = [x for x in v if "de" in langs[x]][:5]; ar = [x for x in v if "ar" in langs[x]][:5]
        self.assertEqual(de, ranked[:5], "de: die 5 besten wie vorher")
        self.assertEqual(ar, [x for x in ranked if "ar" in langs[x]][:5], "ar: seine 5 besten")
        self.assertEqual(len(v), 8, "nur so viele wie noetig: die 5 besten (2 davon mit ar) und 3 weitere mit ar-Fassung")
        self.assertLessEqual(len(SR._cover([f"x{i}" for i in range(100)], lambda x: (x,))), SR.NV)

    def test_committed_file_small_and_valid(self):
        f = ROOT / "data" / "sidebar_related.json"
        if not f.exists():
            self.skipTest("entsteht beim ersten Seitenbau (Bot-Commit)")
        self.assertLess(f.stat().st_size, SR.MAX_BYTES)
        d = json.loads(f.read_text("utf-8"))
        self.assertEqual(d["_v"], SR.VERSION)
        self.assertTrue(all(len(v.get("e", [])) <= SR.NE and len(v.get("v", [])) <= SR.NV for v in d["items"].values()))

    def test_switch(self):
        with mock.patch.dict(os.environ, {"SIDEBAR_RELATED": "0"}): self.assertFalse(SR.enabled())
        with mock.patch.dict(os.environ, {"SIDEBAR_RELATED": ""}): self.assertTrue(SR.enabled())


class RelatedSmokeTest(unittest.TestCase):
    """Der Weg aus generate_site.build (site_related.Related) mit echten Aufrufen: Folge e:, Dub ohne Original v:, Entitaet ent:, ohne key."""
    def setUp(self):
        H, idx, by_vid, orig, dh, ef = data()
        for it in idx["items"]: it.setdefault("keypoints", ["k"]); it.setdefault("faq", [])
        self.idx, self.by_vid = idx, by_vid
        self.tmp = tempfile.TemporaryDirectory(); self.f = Path(self.tmp.name) / "s.json"
        self.loads = []
        self.R = SR.Related(SR.Store(self.f), lambda: self.loads.append(1) or (idx, H), by_vid, orig, dh, ef, {"sharepoint": 1, "teams": 1, "intune": 1},
                            lambda lg, text, ids, exclude: [i for i in ("sharepoint", "teams", "intune") if i in text.lower()],
                            lambda it: f"{BASE}/{it['lang']}/{it['slug']}/", lambda t: t[:58], "2026-11-25")

    def tearDown(self): self.tmp.cleanup()

    def test_all_kinds(self):
        en = self.R.links_for("en", "e:a", "egal")
        self.assertTrue(en and all(u.startswith(f"{BASE}/show/episodes/") for u, _ in en)); self.assertNotIn(f"{BASE}/show/episodes/a/", [u for u, _ in en], "nie die Seite selbst")
        de = self.R.links_for("de", "e:a", "egal")
        self.assertTrue(all(u.startswith(f"{BASE}/de/") for u, _ in de)); self.assertNotIn("A de", [t for _, t in de], "auch nicht die eigene Dub-Fassung")
        fr = self.R.links_for("fr", "v:YT_Y_______", "Teams")
        self.assertNotIn(f"{BASE}/fr/yt_y_______-fr/", [u for u, _ in fr])
        ent = self.R.links_for("en", "ent:intune", "Intune", exclude=("intune",))
        self.assertEqual(ent[0][0], f"{BASE}/show/episodes/g/", "Extraktion +5")
        self.assertIsNone(self.R.links_for("en", "", "SharePoint"), "Uebersichtsseite: keine Folgen-Karte")
        self.assertEqual(self.R.links_for("ar", "ent:intune", "Intune", exclude=("intune",)), [], "Sprache ohne Fassung: leer, kein Fehler")
        self.assertEqual(self.loads, [1], "Folgen-Index einmal je Bau")
        self.assertTrue(self.R.store.save())
        keys = set(json.loads(self.f.read_text("utf-8"))["items"])
        self.assertTrue({"e:a", "ent:intune"} <= keys)
        with mock.patch.dict(os.environ, {"SIDEBAR_RELATED": "0"}): self.assertIsNone(self.R.links_for("en", "e:a"))

    def test_new_episode_without_keypoints_not_frozen(self):
        self.idx["items"].append({"slug": "neu", "date": "2026-11-24", "url": f"{BASE}/show/episodes/neu/", "e": {"title": "NEU"}, "keypoints": [], "faq": []})
        self.idx["by_slug"]["neu"] = self.idx["items"][-1]
        self.R.links_for("en", "e:neu", "SharePoint")
        self.R.store.save()
        self.assertFalse(self.f.exists() and "e:neu" in json.loads(self.f.read_text("utf-8"))["items"], "erst mit Kernpunkten (oder nach 30 Tagen) fest")


class CallersTest(unittest.TestCase):
    """Inhaltsseiten geben einen sprachneutralen Inhalts-Schluessel mit, Uebersichtsseiten nicht (generate_site.py laesst sich ohne Bau nicht importieren)."""
    def src(self, f): return (ROOT / f).read_text("utf-8")

    def test_content_pages_pass_key(self):
        want = {"site_entities.py": 'key=f"ent:{e[\'id\']}"', "site_blog.py": 'key=f"blog:{p[\'handle\']}/{p[\'slug\']}"', "site_events.py": 'key=f"evt:{ev[\'handle\']}"',
                "site_library.py": 'key=f"lib:{p[\'handle\']}-{p[\'slug\']}"', "site_live.py": 'key=f"live:{s[\'slug\']}"', "site_podcast.py": 'key=f"pod:{e[\'slug\']}"',
                "site_video.py": 'key=f"vid:{v[\'slug\']}"', "site_podpage.py": 'rkey=f"e:{e[\'slug\']}"'}
        for f, k in want.items():
            self.assertIn(k, self.src(f), f)
        m = self.src("site_members.py")
        self.assertIn('key=f"u:{p[\'handle\']}"', m); self.assertIn('key=f"c:{o[\'handle\']}"', m)
        pp = self.src("site_podpage.py")
        self.assertIn('rkey=f"g:{gg[\'slug\']}"', pp); self.assertIn('rkey=f"p:{p[\'slug\']}"', pp)
        self.assertIn('key=(f"e:{ORIG[vid]}" if vid in ORIG else f"v:{vid}")', self.src("generate_site.py"), "Dub-Folge: derselbe Schluessel wie die englische Folge")

    def test_overview_pages_without_key(self):
        pp = self.src("site_podpage.py")
        for start in ('pub("episodes/" if p == 0', 'if guests: pub("guests/"', 'pub("hosts/"', 'pub("sponsors/"', 'pub("reviews/"', 'if lk: pub("listen/"', 'pub("", NAME'):
            i = pp.index(start); line = pp[i:pp.index("\n", i)]
            self.assertNotIn("rkey", line, start)
        g = self.src("generate_site.py")
        for call in ('side=side_for(l, label, body))', 'side=side_for(l, _pt, _pb))', 'side=side_for(l, label, body), switch=sw_top)'):
            self.assertIn(call, g, call)
        self.assertIn('if not key or not enabled():\n            return None', self.src("site_related.py"))
        self.assertIn("return _REL.links_for(l, key, text, ids, exclude)", g)

    def test_sidebar_without_latest_episodes(self):
        g = self.src("generate_site.py")
        body = g[g.index("    def sidebar(l, text="):g.index("    def side_for(")]
        self.assertNotIn("by_lang.get(l", body, "keine neuesten Folgen der Sprache mehr")
        self.assertNotIn("episode_index(BASE)[\"items\"]", body)
        self.assertIn("related=rel", body)
        self.assertIn("_SRS.save(allow=", g)

    def test_workflow_saves_file(self):
        import yaml
        w = self.src(".github/workflows/site.yml")
        st = yaml.safe_load(w)["jobs"]["build"]["steps"]
        gen = next(i for i, s in enumerate(st) if s.get("run") == "python generate_site.py")
        fetch, save = st[gen - 1], st[gen + 1]
        self.assertIn("git checkout origin/main -- data/sidebar_related.json", fetch["run"], "neuester Stand von main vor dem Bau (wartender Bau hinter dem naechtlichen)")
        self.assertEqual(save["if"], "always() && hashFiles('data/sidebar_related.json') != ''", "sofort nach dem Bau und auch, wenn spaeter eine Pruefung scheitert")
        self.assertIn("git add data/sidebar_related.json", save["run"]); self.assertIn("git diff --quiet origin/main -- data/sidebar_related.json", save["run"])
        up = next(i for i, s in enumerate(st) if "r2_pages_upload.py" in s.get("run", ""))
        self.assertLess(gen + 1, up, "vor dem R2-Upload")
        self.assertIn("SIDEBAR_RELATED: ${{ vars.SIDEBAR_RELATED }}", w)
        self.assertNotRegex(w, re.compile(r"^\s*paths:.*data/", re.M), "Daten-Commits loesen den Seitenbau nicht aus")


if __name__ == "__main__":
    unittest.main()
