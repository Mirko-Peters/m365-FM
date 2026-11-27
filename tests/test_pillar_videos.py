"""Passende Sticky-Man-Videos je Leitfaden (site_pillar_videos.py, data/pillar_videos.json): Schwelle, Stabilitaet, Anhaengen, manual/blocked, Seiten."""
import contextlib
import copy
import io
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_pillar_videos as PV

BASE = "https://www.m365.fm"
PILLARS = [{"id": "lean", "topics": ["kaizen"], "re": "lean|kaizen|wastes?"},
           {"id": "kpis", "topics": ["oee"], "re": "oee|kpis?"},
           {"id": "mfg-it", "topics": ["erp-x"], "re": "mes|iot"}]


def doc(**kw):
    d = {"max": 2, "min_score": 6, "blocked": [], "context": {"manufacturing": "manufactur\\w*|fertigung\\w*", "floor": "shop ?floors?|factory floors?",
                                                              "maintenance": "instandhaltung\\w*", "industrial": "industrial|industrielle\\w*"},
         "rules": {"mfg-it": {"en": "industrial ai|asset management", "not": "load planning", "ignore_topics": ["erp-x"]}}, "pillars": {}}
    d.update(kw)
    return d


def tx(title="", desc="", body="", tr=""):
    return {"title": [title], "desc": [desc], "body": [body], "tr": tr}


VIDS = {   # Texte der Testvideos
    "v_lean": tx("Lean manufacturing with kaizen", "How kaizen removes waste on the shop floor", "lean, wastes, kaizen"),
    "v_oee": tx("OEE explained for manufacturing", "OEE and KPIs on the factory floor", "oee, kpi"),
    "v_oee2": tx("Improve OEE in manufacturing", "OEE losses on the shop floor", "oee"),
    "v_oee3": tx("OEE dashboards for manufacturing plants", "OEE on the factory floor", "oee"),
    "v_sp": tx("Why AI cannot fix your SharePoint sprawl", "A lean information architecture", "lean governance, wastes"),   # "lean" ohne Fertigungsbezug
    "v_kpi": tx("Copilot learning center", "KPIs for adoption", "kpi, kpis"),
    "v_load": tx("Master load planning in Dynamics 365", "load planning for manufacturing logistics", "iot, mes"),
    "v_ind": tx("Copilot on the shop floor: industrial AI", "Instandhaltung und Fertigung", "industrial ai, iot, mes"),
    "v_erp": tx("ERP with Copilot", "ERP for manufacturing companies", "erp"),
}
ENT = lambda s: [e for e, w in (("kaizen", "kaizen"), ("oee", "oee"), ("erp-x", "erp")) if w in s.lower()]


def run(d, vids, today="2026-11-25"):
    return PV.update(d, PILLARS, vids, today, ENT, texts_fn=lambda v: VIDS[v], title_fn=lambda v: VIDS[v]["title"][0])


class Score(unittest.TestCase):
    def test_threshold_and_context(self):
        d = doc()
        s, why = PV.score(PILLARS[0], VIDS["v_lean"], d, ENT)
        self.assertGreaterEqual(s, 6, why)
        self.assertEqual(PV.score(PILLARS[0], VIDS["v_sp"], d, ENT)[0], 0)   # "lean" in einem M365-Video ohne Fertigungsbezug
        self.assertEqual(PV.score(PILLARS[1], VIDS["v_kpi"], d, ENT)[0], 0)  # "KPI" in einem Copilot-Video
        self.assertLess(PV.score(PILLARS[1], tx("OEE", "", "", ""), d, ENT)[0], 6)   # ohne Fertigungsbezug kein Treffer
        self.assertEqual(PV.score(PILLARS[1], tx("OEE dashboards", "for manufacturing", "oee, kpi", ""), d, ENT)[0], 0)   # ein einzelner Fertigungsbegriff reicht nicht
        self.assertGreater(PV.score(PILLARS[1], tx("OEE dashboards", "for manufacturing", "oee, kpi", "Instandhaltung Instandhaltung Instandhaltung"), d, ENT)[0], 0)   # zweiter Bezug aus dem Transkript (3 Nennungen)
        self.assertEqual(PV.score(PILLARS[1], tx("OEE dashboards", "for manufacturing", "oee, kpi", "Fertigung Fertigung Fertigung"), d, ENT)[0], 0)   # Fertigung = manufacturing: dasselbe Konzept

    def test_not_rule_and_ignored_topics(self):
        d = doc()
        self.assertEqual(PV.score(PILLARS[2], VIDS["v_load"], d, ENT), (0, ["ausgeschlossen (not)"]))
        self.assertLess(PV.score(PILLARS[2], VIDS["v_erp"], d, ENT)[0], 6)   # ERP-Thema zaehlt fuer Videos nicht (ignore_topics)
        self.assertGreaterEqual(PV.score(PILLARS[2], VIDS["v_ind"], d, ENT)[0], 6)

    def test_transcript_needs_repeated_terms(self):
        d = doc()
        one = PV.score(PILLARS[1], tx("OEE in manufacturing", "on the shop floor", "", "oee"), d, ENT)[0]
        three = PV.score(PILLARS[1], tx("OEE in manufacturing", "on the shop floor", "", "oee oee oee"), d, ENT)[0]
        self.assertEqual(three - one, 1)


class Assign(unittest.TestCase):
    def test_first_run_threshold_cap_and_unique(self):
        d = doc()
        add = run(d, list(VIDS))
        got = {pid: PV.shown(d, pid) for pid in ("lean", "kpis", "mfg-it")}
        self.assertEqual(got["lean"], ["v_lean"])
        self.assertEqual(len(got["kpis"]), 2)   # Obergrenze max=2, drei OEE-Videos passen
        self.assertEqual(got["mfg-it"], ["v_ind"])
        flat = [v for x in got.values() for v in x]
        self.assertEqual(len(flat), len(set(flat)))   # kein Video doppelt
        for v in ("v_sp", "v_kpi", "v_load", "v_erp"): self.assertNotIn(v, flat)
        self.assertEqual(len(add), 4)
        e = d["pillars"]["lean"]["videos"][0]
        self.assertEqual((e["id"], e["date"], e["title"]), ("v_lean", "2026-11-25", "Lean manufacturing with kaizen"))
        self.assertGreaterEqual(e["score"], 6)

    def test_stable_and_idempotent(self):
        d = doc(); run(d, list(VIDS))
        before = copy.deepcopy(d)
        self.assertEqual(run(d, list(reversed(list(VIDS))), "2026-12-01"), [])   # zweiter Lauf: nichts Neues, nichts umsortiert
        self.assertEqual(d, before)

    def test_new_videos_only_append(self):
        d = doc(max=3); run(d, ["v_oee2"])
        VIDS["v_new"] = tx("OEE and KPIs for manufacturing", "OEE KPIs on the shop floor", "oee, kpi, kpis")   # hoehere Punkte als v_oee2
        try:
            add = run(d, ["v_oee2", "v_new"], "2026-12-02")
            self.assertEqual(PV.shown(d, "kpis"), ["v_oee2", "v_new"])   # angehaengt, nicht vorangestellt
            self.assertEqual(add, [("kpis", "v_new", d["pillars"]["kpis"]["videos"][1]["score"])])
            self.assertEqual(d["pillars"]["kpis"]["videos"][1]["date"], "2026-12-02")
        finally:
            VIDS.pop("v_new")

    def test_full_pillar_does_not_take_more(self):
        d = doc(max=1); run(d, ["v_oee"])
        self.assertEqual(run(d, ["v_oee2", "v_oee3"]), [])
        self.assertEqual(PV.shown(d, "kpis"), ["v_oee"])

    def test_manual_and_blocked(self):
        d = doc(max=2)
        d["pillars"] = {"kpis": {"videos": [{"id": "v_kpi", "manual": True}], "blocked": ["v_oee"]}, "lean": {"videos": [], "blocked": []}}
        d["blocked"] = ["v_lean"]
        run(d, list(VIDS))
        self.assertEqual(PV.shown(d, "kpis")[0], "v_kpi")   # von Hand gesetzt: steht vorn, auch ohne Punkte
        self.assertNotIn("v_oee", PV.shown(d, "kpis"))   # je Leitfaden gesperrt
        self.assertEqual(len(PV.shown(d, "kpis")), 2)   # die Hand-Eintraege zaehlen zur Obergrenze
        self.assertNotIn("v_lean", [v for p in d["pillars"] for v in PV.shown(d, p)])   # global gesperrt
        d["pillars"]["kpis"]["blocked"].append("v_kpi")   # nachtraeglich gesperrt: nicht mehr angezeigt, Eintrag bleibt in der Datei
        self.assertNotIn("v_kpi", PV.shown(d, "kpis"))
        self.assertIn("v_kpi", [e["id"] for e in d["pillars"]["kpis"]["videos"]])

    def test_prepare_writes_only_on_change(self):
        with tempfile.TemporaryDirectory() as t:
            f = Path(t) / "pv.json"
            d = doc(); pages = {"v_oee": {"de": (f"{BASE}/de/oee/", "OEE erklärt (KI-Synchronfassung)")}, "v_sp": {"de": (f"{BASE}/de/sp/", "SharePoint")}}
            with mock.patch.object(PV, "texts", lambda v: VIDS[v]):
                ctx = PV.prepare(d, PILLARS, pages, {}, "2026-11-25", ENT, out=lambda *a: None, path=f)
                self.assertTrue(f.exists())
                self.assertEqual(json.loads(f.read_text("utf-8"))["pillars"]["kpis"]["videos"][0]["title"], "OEE erklärt")
                f.unlink()
                PV.prepare(d, PILLARS, pages, {}, "2026-11-26", ENT, out=lambda *a: None, path=f)
                self.assertFalse(f.exists())   # nichts Neues: Datei unberuehrt
            self.assertEqual(ctx["pages"], pages)


class Render(unittest.TestCase):
    R2 = {"https://i.ytimg.com/vi/v_oee/mqdefault.jpg": "https://img.m365.fm/i/aaa.webp", "https://i.ytimg.com/vi/v_oee/hqdefault.jpg": "https://img.m365.fm/i/bbb.jpg"}
    DIMS = {"https://img.m365.fm/i/aaa.webp": [320, 180]}

    def setUp(self):
        self.d = doc(); self.d["pillars"] = {"kpis": {"videos": [{"id": "v_oee", "score": 9}, {"id": "v_en"}, {"id": "v_none"}], "blocked": []}}
        self.pages = {"v_oee": {"de": (f"{BASE}/de/oee-erklaert/", "OEE erklärt (KI-Synchronfassung)"), "en": (f"{BASE}/show/episodes/oee/", "OEE explained")},
                      "v_en": {"en": (f"{BASE}/show/episodes/only-en/", "Only English")}}

    def test_card_language_fallback_and_images(self):
        h = PV.card(self.d, "kpis", "de", self.pages, self.R2, self.DIMS)
        self.assertIn("<h2>Passende Videos</h2>", h)
        self.assertIn(f'href="{BASE}/de/oee-erklaert/"', h); self.assertIn("OEE erklärt<", h); self.assertNotIn("KI-Synchronfassung", h)
        self.assertIn(f'href="{BASE}/show/episodes/only-en/" lang="en" hreflang="en"', h)   # keine deutsche Videoseite: englische, gekennzeichnet
        self.assertIn("Video · Englisch", h)
        self.assertNotIn("v_none", h)   # ohne Seite nicht angezeigt
        self.assertNotIn("ytimg.com", h)   # Bilder nur aus dem eigenen Bucket
        img = re.findall(r"<img [^>]+>", h)
        self.assertEqual(len(img), 1)   # v_en hat kein kopiertes Vorschaubild: nur die Flaeche
        for a in ('width="320"', 'height="180"', 'loading="lazy"', 'src="https://img.m365.fm/i/aaa.webp"'): self.assertIn(a, img[0])
        self.assertIn("aspect-ratio:16/9", h)   # feste Flaeche auch ohne Bild (kein Layoutsprung)
        en = PV.card(self.d, "kpis", "en", self.pages, self.R2, self.DIMS)
        self.assertIn("<h2>Related videos</h2>", en); self.assertIn(f'href="{BASE}/show/episodes/oee/"', en); self.assertNotIn('lang="en"', en)
        self.assertIn("<h2>Vidéos associées</h2>", PV.card(self.d, "kpis", "fr", self.pages, self.R2))
        self.assertEqual(PV.card(self.d, "lean", "de", self.pages, self.R2), "")   # Leitfaden ohne Video: keine Karte

    def test_youtube_fallback_without_english_page(self):
        pages = {"v_x": {"de": (f"{BASE}/de/x/", "X erklärt"), "yt": ("https://www.youtube.com/watch?v=v_x", "X  explained")}}
        d = doc(); d["pillars"] = {"kpis": {"videos": [{"id": "v_x"}], "blocked": []}}
        en = PV.card(d, "kpis", "en", pages, {})
        self.assertIn('href="https://www.youtube.com/watch?v=v_x" rel="noopener"', en); self.assertIn("<b>X explained</b>", en); self.assertIn("<small>YouTube</small>", en)
        self.assertIn(f'href="{BASE}/de/x/"', PV.card(d, "kpis", "de", pages, {}))   # eigene Sprache vor YouTube
        self.assertIn('rel="noopener" lang="en" hreflang="en"', PV.card(d, "kpis", "fr", pages, {}))
        self.assertEqual(PV.ld_refs(d, "kpis", "en", pages, lambda u: True), [])   # kein Verweis auf fremde Seiten

    def test_ld_refs_only_for_pages_with_videoobject(self):
        refs = PV.ld_refs(self.d, "kpis", "de", self.pages, lambda u: "/show/" not in u)
        self.assertEqual(refs, [{"@id": f"{BASE}/de/oee-erklaert/#video"}])

    def test_path_line(self):
        h = PV.path_line(self.d, "kpis", "de", self.pages)
        self.assertTrue(h.startswith('<p class="mut pl-vline">Passende Videos: '))
        self.assertNotIn("<img", h)


class PillarPages(unittest.TestCase):
    def test_build_shows_card_on_guide_and_path(self):
        import site_pillars as S, site_infographics as IG
        files = {}
        pid = "manufacturing-kpis"
        d = doc(); d["pillars"] = {pid: {"videos": [{"id": "v_oee", "score": 9}], "blocked": []}}
        pages = {"v_oee": {"de": (f"{BASE}/de/oee-erklaert/", "OEE erklärt"), "en": (f"{BASE}/show/episodes/oee/", "OEE explained")}}
        g = dict(BASE=BASE, write=lambda rel, html: files.__setitem__(rel, html), sitemap=[], author_box=None, LANGS=("en", "de"),
                 page=lambda lang, title, desc, canon, body, alts, ld, **kw: json.dumps({"ld": ld}, ensure_ascii=False) + "\n" + body,
                 header=lambda l, x: "", footer=lambda l: "", footer_en=lambda: "",
                 pillar_videos={"doc": d, "pages": pages, "ld": {f"{BASE}/de/oee-erklaert/"}, "r2": Render.R2, "dims": Render.DIMS})
        with contextlib.redirect_stdout(io.StringIO()), mock.patch.object(S, "active", lambda: ("en", "de")), mock.patch.object(IG, "get", lambda *a: None):
            S.build(g, [], set())
        de = files["de/learn/produktionskennzahlen/index.html"]; en = files["learn/manufacturing-kpis/index.html"]
        self.assertIn('id="videos"', de); self.assertIn(f'href="{BASE}/de/oee-erklaert/"', de)
        self.assertIn(f'href="{BASE}/show/episodes/oee/"', en)
        self.assertLess(de.index("</article>"), de.index('id="videos"'))   # nach dem Artikel
        art = [n for n in json.loads(de.split("\n", 1)[0])["ld"] if n.get("@type") == "Article"][0]
        self.assertEqual(art["video"], [{"@id": f"{BASE}/de/oee-erklaert/#video"}])
        art_en = [n for n in json.loads(en.split("\n", 1)[0])["ld"] if n.get("@type") == "Article"][0]
        self.assertNotIn("video", art_en)   # englische Folgenseite ohne VideoObject-Knoten: kein Verweis
        for h in files.values(): self.assertNotIn('"@type": "VideoObject"', h.split("\n", 1)[0])   # keine zweite Beschreibung des Videos
        self.assertNotIn('id="videos"', files["learn/lean-manufacturing/index.html"])
        self.assertIn('pl-vline', files["de/learn/path/manufacturing-excellence/index.html"])


class Concepts(unittest.TestCase):
    """Fertigungsbezug nach Konzepten (nicht nach Treffer-Strings) und Pflicht eines spezifischen Treffers - mit den echten Regeln und Leitfaeden."""
    @classmethod
    def setUpClass(cls):
        import site_pillars as S
        cls.d, cls.P = PV.load(), {p["id"]: p for p in S.order()}

    def sc(self, pid, t, ent=None):
        return PV.score(self.P[pid], t, self.d, ent)

    def test_translation_and_inflections_are_one_concept(self):
        # Copilot-Video mit einem Nebensatz "manufacturing" / "Fertigung" (Branchenbeispiel) und Beugungsformen: kein Fertigungsbezug
        t = {"title": ["How to Build a Governed Microsoft Copilot Learning Center: KPIs", "", "Copilot-Lernzentrum aufbauen: KPIs"],
             "desc": ["Adoption KPIs for Copilot. Real-world examples cover e-commerce, support, legal and manufacturing.", "Einsatzfälle von E-Commerce bis Fertigung."],
             "body": ["kpi, kpis", "", "", ""], "tr": ""}
        s, why = self.sc("manufacturing-kpis", t, lambda x: ["oee"] if "kpi" in x.lower() else [])
        self.assertEqual(s, 0, why)
        t2 = tx("Instandhaltung planen", "Instandhaltungsbedarf und Instandhaltungsleitungen", "instandhaltung")
        self.assertEqual(self.sc("manufacturing-it-azure", t2)[0], 0)   # drei Formen eines Worts = ein Konzept

    def test_mfg_only_in_body_is_not_enough(self):
        t = tx("Azure AI Search: Hybrid Search", "Vector and keyword search", "examples: e-commerce, manufacturing, shop floor search, oee")
        self.assertEqual(self.sc("manufacturing-kpis", t, lambda x: ["oee"] if "oee" in x.lower() else []), (0, ["kein Fertigungsbezug (factory-floor, manufacturing, oee, nur im Text)"]))

    def test_same_term_in_en_and_de_title_counts_once(self):
        t = {"title": ["Copilot KPIs: Measuring Adoption in Manufacturing Companies", "", "Copilot-KPIs: Einführung in Fertigungsunternehmen messen"],
             "desc": ["", ""], "body": ["kpis", "", "", ""], "tr": ""}
        self.assertEqual(self.sc("manufacturing-kpis", t)[0], 0)
        t = {"title": ["Microsoft Teams Shifts: Scheduling Frontline Workers in Manufacturing", "", "Microsoft Teams Schichten: Frontline-Mitarbeitende in der Fertigung planen"],
             "desc": ["", ""], "body": ["scheduling", "", "", ""], "tr": ""}
        self.assertEqual(self.sc("production-scheduling-aps", t)[0], 0)

    def test_generic_re_terms_alone_do_not_count(self):
        # Fertigungsbezug erfuellt (2 Konzepte im Titel), aber nur allgemeine Woerter aus "re": kein Treffer
        t = tx("Teams Shifts on the shop floor: scheduling frontline workers in manufacturing", "Scheduling shifts for manufacturing teams", "scheduling, shifts")
        s, why = self.sc("production-scheduling-aps", t)
        self.assertEqual(s, 0); self.assertTrue(why[0].startswith("nur allgemeine Begriffe"), why)
        t = tx("Copilot KPIs on the shop floor in manufacturing", "KPIs for Copilot adoption in manufacturing", "kpis")
        self.assertEqual(self.sc("manufacturing-kpis", t)[0], 0)
        # dasselbe mit einem spezifischen Begriff (rules) zaehlt
        t = tx("Overall equipment effectiveness on the shop floor in manufacturing", "OEE and KPIs in manufacturing", "kpis, oee")
        self.assertGreaterEqual(self.sc("manufacturing-kpis", t)[0], 6)

    def test_todays_hits_still_pass_without_entities(self):
        for vid, pid in (("ZY12nBEY2qc", "manufacturing-it-azure"), ("DfWvXDmheKY", "manufacturing-it-azure"), ("6d6FcLfYess", "manufacturing-it-azure"), ("ZPjhQuq0wA0", "production-scheduling-aps")):
            if not (ROOT / "episodes" / f"{vid}.json").exists(): self.skipTest("Dub-Daten fehlen")
            s, why = self.sc(pid, PV.texts(vid))
            self.assertGreaterEqual(s, self.d["min_score"], (vid, why))
        self.assertLess(self.sc("manufacturing-kpis", PV.texts("AXT4Qac8mQ8"))[0], self.d["min_score"])   # Fabric-Roadmap: kein KPI-Video


class HandEdits(unittest.TestCase):
    """Hand-Eintraege duerfen den Bau nicht stoppen und eine kaputte Datei wird nie ueberschrieben."""
    def test_missing_videos_key_and_string_entries(self):
        d = doc(); d["pillars"] = {"kpis": {"blocked": ["v_x"]}, "lean": {"videos": ["v_kpi", 7, {"note": "ohne id"}]}}
        add = run(d, list(VIDS))
        self.assertTrue(any(p == "kpis" for p, _, _ in add))
        self.assertEqual(PV.shown(d, "lean")[0], "v_kpi")   # blosse ID gilt als Eintrag
        self.assertIn("v_kpi", PV.taken(d))

    def test_invalid_pillar_entry_is_skipped_not_replaced(self):
        d = doc(); d["pillars"] = {"kpis": ["kaputt"], "lean": {"videos": "auch kaputt"}}
        msgs = []
        add = PV.update(d, PILLARS, list(VIDS), "2026-11-25", ENT, texts_fn=lambda v: VIDS[v], out=msgs.append)
        self.assertEqual(d["pillars"]["kpis"], ["kaputt"]); self.assertEqual(d["pillars"]["lean"]["videos"], "auch kaputt")
        self.assertEqual([p for p, _, _ in add], ["mfg-it"])
        self.assertEqual(len(msgs), 2)
        self.assertEqual(PV.shown(d, "kpis"), [])

    def test_broken_file_is_never_overwritten(self):
        with tempfile.TemporaryDirectory() as t:
            f = Path(t) / "pv.json"; f.write_text('{"pillars": {"kpis": {"videos": [{"id": "x", "manual": true},]}}}', "utf-8")   # Komma zu viel
            msgs = []
            d = PV.load(f, out=msgs.append)
            self.assertTrue(msgs and msgs[0].startswith("::warning::"))
            pages = {"v_oee": {"de": (f"{BASE}/de/oee/", "OEE")}}
            with mock.patch.object(PV, "texts", lambda v: VIDS[v]):
                self.assertIsNone(PV.prepare(d, PILLARS, pages, {}, "2026-11-25", ENT, out=msgs.append, path=f))
            self.assertIn('},]', f.read_text("utf-8"))   # unveraendert (Mirkos Fassung bleibt zum Korrigieren)

    def test_block_at_own_pillar_frees_video_for_others(self):
        d = doc(); d["pillars"] = {"lean": {"videos": [{"id": "v_ind", "score": 6}], "blocked": ["v_ind"]}}
        add = run(d, ["v_ind"])
        self.assertEqual(add[0][:2], ("mfg-it", "v_ind"))
        self.assertEqual(PV.shown(d, "lean"), [])
        d2 = doc(blocked=["v_ind"]); self.assertEqual(run(d2, ["v_ind"]), [])   # global gesperrt: nirgends

    def test_step_summary_lists_new_hits(self):
        with tempfile.TemporaryDirectory() as t:
            f, sm = Path(t) / "pv.json", Path(t) / "summary.md"
            pages = {"v_oee": {"de": (f"{BASE}/de/oee/", "OEE erklärt (KI-Synchronfassung)")}}
            with mock.patch.object(PV, "texts", lambda v: VIDS[v]), mock.patch.dict("os.environ", {"GITHUB_STEP_SUMMARY": str(sm)}):
                PV.prepare(doc(), PILLARS, pages, {}, "2026-11-25", ENT, out=lambda *a: None, path=f)
            self.assertIn("`kpis`: [OEE erklärt](https://www.youtube.com/watch?v=v_oee)", sm.read_text("utf-8"))


class Titles(unittest.TestCase):
    def test_clean_title_only_removes_dub_labels(self):
        self.assertEqual(PV.clean_title("Copilot Studio (Part 2) (KI-Synchronfassung)"), "Copilot Studio (Part 2)")
        self.assertEqual(PV.clean_title("Loop (Preview)"), "Loop (Preview)")
        self.assertEqual(PV.clean_title("動画 （AI吹き替え）"), "動画")
        self.assertEqual(PV.clean_title("X  (Doublage IA)"), "X")
        import site_meta_podcast as M
        self.assertLessEqual(set(M.DUB_LABELS), set(PV._DUBS))


class PagesIndex(unittest.TestCase):
    """Aufbau der Videoseiten fuer die Karte (generate_site.py ruft PV.pages_index): Englisch nur die Folge der Hauptshow mit demselben Video."""
    def test_english_show_page_only_with_same_video(self):
        dubs = [("v1", "de", f"{BASE}/de/a/", "A (KI-Synchronfassung)"), ("v2", "de", f"{BASE}/de/b/", "B"), ("v3", "de", f"{BASE}/de/c/", "C")]
        by_slug = {"a": {"url": f"{BASE}/show/episodes/a/", "e": {"title": "A podcast"}, "yt": "v1"},
                   "b": {"url": f"{BASE}/show/episodes/b/", "e": {"title": "B podcast"}, "yt": "other"},   # anderes Video
                   "c": {"url": f"{BASE}/show/episodes/c/", "e": {"title": "C podcast"}}}   # nur Audio
        pg = PV.pages_index(dubs, {"v1": "a", "v2": "b", "v3": "c"}, {"v1": "A"}, by_slug, {"v1": "A en", "v2": "B en", "v3": "C en"})
        self.assertEqual(pg["v1"]["en"], (f"{BASE}/show/episodes/a/", "A"))
        for v in ("v2", "v3"): self.assertNotIn("en", pg[v])
        self.assertEqual(pg["v2"]["yt"], ("https://www.youtube.com/watch?v=v2", "B en"))
        self.assertEqual(PV.pick("v2", "en", pg), ("https://www.youtube.com/watch?v=v2", "B en", "yt"))
        self.assertEqual(PV.pick("v2", "ar", pg)[2], "yt")   # keine Dub-Folge der Sprache, keine englische Videoseite: YouTube
        self.assertEqual(PV.pick("v1", "ar", pg)[2], "en")

    def test_generate_site_hook_is_guarded(self):
        src = (ROOT / "generate_site.py").read_text("utf-8")
        i = src.index("import site_pillar_videos as PVID")
        blk = src[src.rindex("try:", 0, i):src.index("PIL.build(_ctx", i)]
        self.assertIn("PVID.pages_index(", blk); self.assertIn("except Exception", blk)


class Workflow(unittest.TestCase):
    def test_site_yml_saves_pillar_videos_right_after_build(self):
        import yaml
        steps = yaml.safe_load((ROOT / ".github" / "workflows" / "site.yml").read_text("utf-8"))["jobs"]["build"]["steps"]
        i = next(k for k, st in enumerate(steps) if (st.get("run") or "").strip() == "python generate_site.py")
        st = next(s for s in steps[i + 1:i + 3] if "data/pillar_videos.json" in (s.get("run") or ""))   # direkt nach dem Bau (neben dem Sicherungsschritt der aehnlichen Folgen)
        self.assertIn("always()", st["if"]); self.assertIn("refs/heads/main", st["if"])
        self.assertNotIn("-X theirs", st["run"])   # Hand-Aenderungen waehrend des Baus gewinnen
        self.assertIn("git push", st["run"])


class DataFile(unittest.TestCase):
    def test_real_file_is_consistent(self):
        import site_pillars as S
        d = PV.load()
        self.assertNotIn("_error", d)
        ids = {p["id"] for p in S.pillars()}
        self.assertLessEqual(set(d["pillars"]), ids)
        self.assertLessEqual(set(d["rules"]), ids)
        self.assertGreaterEqual(len(d["context"]), 5); self.assertFalse(set(d["context"]) <= {"en", "de"}, "context: Konzepte, nicht Sprachen")
        for r in list(d["context"].values()) + [v for x in d["rules"].values() for k, v in x.items() if k in ("en", "de", "not")]:
            self.assertIsNotNone(PV._rx(r))
        flat = [e["id"] for v in d["pillars"].values() for e in v["videos"] if not e.get("manual")]   # von Hand darf ein Video zusaetzlich bei einem zweiten Leitfaden stehen
        self.assertEqual(len(flat), len(set(flat)), "Video doppelt zugeordnet")
        for pid in d["pillars"]: self.assertLessEqual(len(PV.shown(d, pid)), max(d["max"], sum(1 for e in d["pillars"][pid]["videos"] if e.get("manual"))))
        for v in d["pillars"].values():
            for e in v["videos"]:
                if not e.get("manual"): self.assertGreaterEqual(e["score"], d["min_score"]); self.assertRegex(e["date"], r"^\d{4}-\d{2}-\d{2}$")
        # Mirko 26.11.2026: Fabric-Roadmap zurueck zu den Kennzahlen (von Hand), bei Manufacturing IT gesperrt; Shop-Floor-Video zusaetzlich bei Shop Floor Management
        self.assertIn("AXT4Qac8mQ8", PV.shown(d, "manufacturing-kpis")); self.assertNotIn("AXT4Qac8mQ8", d["pillars"]["manufacturing-kpis"]["blocked"])
        self.assertNotIn("AXT4Qac8mQ8", PV.shown(d, "manufacturing-it-azure")); self.assertIn("AXT4Qac8mQ8", d["pillars"]["manufacturing-it-azure"]["blocked"])
        self.assertIn("ZY12nBEY2qc", PV.shown(d, "shop-floor-management")); self.assertIn("ZY12nBEY2qc", PV.shown(d, "manufacturing-it-azure"))


if __name__ == "__main__":
    unittest.main()
