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
            self.assertEqual(SR.fixed(st2, "ent:leer", lambda: calls.append(1) or {"e": ["z"]}), {"e": [], "v": []}, "auch leere Treffer bleiben fest")
            self.assertFalse(st2.save()); self.assertEqual(f.read_bytes(), b1, "nichts Neues -> Datei byte-gleich, kein Bot-Commit")
            new = SR.fixed(st2, "ent:neu", lambda: P2.pick(["sharepoint"]))
            self.assertEqual(new["e"][0], "z", "neuer Inhalt bekommt beim ersten Bau seinen Eintrag mit den aktuellen Folgen")
            self.assertTrue(st2.save())
            lines = f.read_text("utf-8").splitlines()
            self.assertTrue(lines[0].startswith('{"_v":1,'))
            self.assertEqual([l.split('":', 1)[0][1:] for l in lines[1:-1]], ["ent:leer", "ent:neu", "ent:sharepoint"], "ein Schluessel je Zeile, sortiert")
            self.assertEqual(json.loads(f.read_text("utf-8"))["items"]["ent:sharepoint"], first)

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
        e = st.put("k", {"e": list("abcdefgh"), "v": [f"v{i}" for i in range(20)]})
        self.assertEqual((len(e["e"]), len(e["v"])), (SR.NE, SR.NV))

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
        self.assertIn('if not key or not SRL.enabled(): return None', g)

    def test_sidebar_without_latest_episodes(self):
        g = self.src("generate_site.py")
        body = g[g.index("    def sidebar(l, text="):g.index("    def side_for(")]
        self.assertNotIn("by_lang.get(l", body, "keine neuesten Folgen der Sprache mehr")
        self.assertNotIn("episode_index(BASE)[\"items\"]", body)
        self.assertIn("related=rel", body)
        self.assertIn("_SRS.save()", g)

    def test_workflow_saves_file(self):
        w = self.src(".github/workflows/site.yml")
        step = w[w.index("- name: Money-Keywords und Profil-Export sichern"):w.index("- name: Interne Links prüfen")]
        self.assertEqual(step.count("data/sidebar_related.json"), 3, "Kommentar, git status und git add")
        self.assertIn("SIDEBAR_RELATED: ${{ vars.SIDEBAR_RELATED }}", w)
        self.assertNotRegex(w, re.compile(r"^\s*paths:.*data/", re.M), "Daten-Commits loesen den Seitenbau nicht aus")


if __name__ == "__main__":
    unittest.main()
