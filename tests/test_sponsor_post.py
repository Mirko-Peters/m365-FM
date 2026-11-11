"""Sponsor-Reihe Cognillo (tools/sponsor_post.py): Plan, Auswahl der Modi schreiben/freigeben/taeglich, Budget, Linkfilter, LinkedIn-Texte, Front-Matter gegen
site_content_blog.check, Zweiter Durchgang. Ohne Netz und ohne echte API: die Aufrufe sind durch Attrappen ersetzt, api_call wird nie erreicht."""
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tools"))
import sponsor_post as SP   # noqa: E402
import site_content_blog as CBL   # noqa: E402
import site_shownotes as SNS   # noqa: E402

FIX = ROOT / "tests" / "fixtures"
REAL_API_CALL = SP.api_call   # vor den Patches der Tests gemerkt
ENTS = SP.load_entities(FIX / "sponsor_entities.json")
FILLER = " ".join(["alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa"] * 20)   # 200 Woerter ohne Regelverstoesse
LI_OK = "A useful first line about the topic.\n\nFull article: {URL}\n\nWhat is the first thing you would check in your tenant?\n\n#Microsoft365 #SharePoint"


def draft(main="sharepoint-permissions", others=("sharepoint", "oversharing"), extra="", li=None, faq=2, group="x"):
    """Antwort der Attrappe im Format von DRAFT_TASK."""
    links = " ".join(f"See [{o}](https://www.m365.fm/entity/{o}/)." for o in others)
    body = f"Intro about [{main}](https://www.m365.fm/entity/{main}/). {links} {extra}\n\n" + "\n\n".join(f"## Section {i}\n\n{FILLER}" for i in range(4))
    li = li or {"profile": LI_OK, "page": LI_OK, "group": LI_OK if group == "x" else group}
    f = [{"q": f"Question {i}?", "a": "A short plain answer for the test " * 5} for i in range(faq)]
    return ("===SUMMARY===\nA test summary that is long enough for the content package check, about SharePoint permissions in plain words.\n"
            f"===FAQ===\n{json.dumps(f)}\n===LINKEDIN===\n{json.dumps(li)}\n===BODY===\n{body}")


REVIEW_OK = json.dumps({"verdict": "ok", "edits": []})
COG = {"id": "cognillo-2026-11", "sponsor": {"name": "Cognillo", "url": "https://www.cognillo.com/"}, "label": "sponsored", "start": "2026-11-10", "end": "2026-12-10",
       "entities": ["cognillo", "sharepoint-essentials-toolkit"], "note": "Test"}


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        (self.tmp / "data").mkdir()
        shutil.copy(FIX / "sponsor_posts_plan.json", self.tmp / "data" / "sponsor_posts_cognillo.json")
        (self.tmp / "imports" / "blog" / "en").mkdir(parents=True)
        (self.tmp / "data" / "sponsorships.json").write_text(json.dumps({"version": 1, "sponsorships": [{"id": "anderes", "sponsor": {"name": "Acme", "url": "https://acme.example/"},
                                                                    "label": "sponsored", "start": "2026-01-01", "end": None, "entities": ["acme"]}, COG]}, indent=1) + "\n", "utf-8")
        self.env = mock.patch.dict(os.environ, {"SPONSOR_COMMIT_MSG_FILE": str(self.tmp / "msg.txt"), "SPONSOR_WRITTEN_FILE": str(self.tmp / "written.txt")}, clear=False)
        os.environ.pop("SPONSOR_POSTS_BUDGET_USD", None)
        self.patches = [self.env,
                        mock.patch.object(SP, "PLAN_FILE", self.tmp / "data" / "sponsor_posts_cognillo.json"),
                        mock.patch.object(SP, "LINKEDIN_FILE", self.tmp / "data" / "sponsor_posts_linkedin_cognillo.json"),
                        mock.patch.object(SP, "SPEND_FILE", self.tmp / "data" / "spend.json"),
                        mock.patch.object(SP, "SPONSORSHIPS_FILE", self.tmp / "data" / "sponsorships.json"),
                        mock.patch.object(SP, "ENTITIES_FILE", FIX / "sponsor_entities.json"),
                        mock.patch.object(SP, "BLOG_DIR", self.tmp / "imports" / "blog"),
                        mock.patch.object(SP, "OUT_DIR", self.tmp / "imports" / "blog" / "en"),
                        mock.patch.object(SP, "api_call", side_effect=AssertionError("kein API-Aufruf in Tests"))]
        for p in self.patches: p.start()

    def tearDown(self):
        for p in reversed(self.patches): p.stop()
        shutil.rmtree(self.tmp, ignore_errors=True)

    def plan(self):
        return {e["nr"]: e for e in json.loads(SP.PLAN_FILE.read_text("utf-8"))}

    def run_quiet(self, fn, *a, **k):
        buf = StringIO()
        with redirect_stdout(buf):
            r = fn(*a, **k)
        return r, buf.getvalue()


class PlanAndSelection(Base):
    def test_fixture_plan_is_valid_and_has_the_agreed_fields(self):
        plan = SP.load_plan()
        self.assertEqual(SP.plan_errors(plan), [])
        self.assertTrue(set(SP.PLAN_KEYS) <= set(plan[0]))

    def test_plan_errors(self):
        p = json.loads(SP.PLAN_FILE.read_text("utf-8"))
        bad = [dict(p[0], date="15.11.2026"), dict(p[1], slug="Ungueltig Slug"), dict(p[2], nr=1), dict(p[3], sponsored="ja"), {k: v for k, v in p[4].items() if k != "main"}, dict(p[5], freigegeben="ja")]
        self.assertGreaterEqual(len(SP.plan_errors(bad)), 6)
        self.assertTrue(SP.plan_errors([]))
        self.assertTrue(SP.plan_errors({"nr": 1}))

    def test_missing_plan_aborts_cleanly_with_exit_0(self):
        SP.PLAN_FILE.unlink()
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-15"])
        self.assertEqual(code, 0); self.assertIn("fehlt", out)
        code, out = self.run_quiet(SP.main, ["schreiben", "--dry-run"])
        self.assertEqual(code, 0)

    def test_broken_plan_is_an_error(self):
        SP.PLAN_FILE.write_text("{kaputt", "utf-8")
        code, out = self.run_quiet(SP.main, ["freigeben", "--nummern", "1"])
        self.assertEqual(code, 1)

    def test_parse_nummern(self):
        self.assertEqual(SP.parse_nummern("1-3,5"), [1, 2, 3, 5])
        self.assertEqual(SP.parse_nummern(" 2 ; 4 "), [2, 4])
        self.assertIsNone(SP.parse_nummern(""))
        with self.assertRaises(SP.Stop): SP.parse_nummern("1-x")
        with self.assertRaises(SP.Stop): SP.parse_nummern("5-2")
        with self.assertRaises(SP.Stop): SP.parse_nummern("1-70", [1, 2, 3])

    def test_select_write_range_status_and_existing_files(self):
        plan = SP.load_plan()
        todo, have = SP.select_write(plan)
        self.assertEqual([e["nr"] for e in todo], [1, 2, 3])   # nur "geplant"
        todo, _ = SP.select_write(plan, von=2, bis=2)
        self.assertEqual([e["nr"] for e in todo], [2])
        (SP.OUT_DIR / f"{plan[1]['slug']}.md").write_text("x", "utf-8")   # Wiederaufnahme: vorhandene Datei wird uebersprungen, nie ueberschrieben
        todo, have = SP.select_write(plan)
        self.assertEqual([e["nr"] for e in todo], [1, 3]); self.assertEqual([e["nr"] for e in have], [2])
        (SP.BLOG_DIR / "de").mkdir(); (SP.BLOG_DIR / "de" / f"{plan[0]['slug']}.md").write_text("x", "utf-8")   # gleicher Slug in anderer Sprache zaehlt als Dublette
        self.assertEqual([e["nr"] for e in SP.select_write(plan)[0]], [3])

    def test_select_publish_picks_earliest_released_draft_one_per_call(self):
        plan = json.loads(SP.PLAN_FILE.read_text("utf-8"))
        for e in plan:
            if e["nr"] in (4, 5): e["status"], e["freigegeben"] = "entwurf", True
            (SP.OUT_DIR / f"{e['slug']}.md").write_text("x", "utf-8")
        e, broken = SP.select_publish(plan, "2026-11-20")
        self.assertEqual((e["nr"], broken), (4, []))   # frueheste zuerst (verpasste Tage: je einer pro Lauf)
        plan[3]["status"] = "live"
        self.assertEqual(SP.select_publish(plan, "2026-11-20")[0]["nr"], 5)
        self.assertIsNone(SP.select_publish(plan, "2026-11-18")[0])   # date in der Zukunft
        plan[4]["status"] = "live"
        self.assertIsNone(SP.select_publish(plan, "2026-11-30")[0])   # alles veroeffentlicht oder nicht freigegeben: nichts faellig

    def test_select_publish_ignores_not_released_and_reports_missing_files(self):
        plan = SP.load_plan()   # Nr 4 freigegeben (Datei fehlt), Nr 5 nicht freigegeben
        e, broken = SP.select_publish(plan, "2026-12-31")
        self.assertIsNone(e); self.assertEqual([b["nr"] for b in broken], [4])
        (SP.OUT_DIR / f"{plan[4]['slug']}.md").write_text("x", "utf-8")   # Nr 5 hat eine Datei, ist aber nicht freigegeben
        self.assertIsNone(SP.select_publish(plan, "2026-12-31")[0])


class Freigeben(Base):
    def test_only_drafts_with_files_are_released(self):
        plan = SP.load_plan()
        for e in plan:
            if e["status"] == "entwurf": (SP.OUT_DIR / f"{e['slug']}.md").write_text("x", "utf-8")
        code, out = self.run_quiet(SP.main, ["freigeben", "--nummern", "1-6"])
        self.assertEqual(code, 0)
        p = self.plan()
        self.assertTrue(p[5].get("freigegeben")); self.assertFalse(p[1].get("freigegeben")); self.assertEqual(p[1]["status"], "geplant")
        self.assertIn("Nr 5", (self.tmp / "msg.txt").read_text("utf-8"))
        self.assertIn("schon freigegeben", out); self.assertIn("nur \"entwurf\"", out)

    def test_dry_run_changes_nothing_and_unknown_numbers_fail(self):
        for e in SP.load_plan():
            (SP.OUT_DIR / f"{e['slug']}.md").write_text("x", "utf-8")
        before = SP.PLAN_FILE.read_text("utf-8")
        self.assertEqual(self.run_quiet(SP.main, ["freigeben", "--nummern", "5", "--dry-run"])[0], 0)
        self.assertEqual(SP.PLAN_FILE.read_text("utf-8"), before)
        self.assertEqual(self.run_quiet(SP.main, ["freigeben", "--nummern", "99"])[0], 1)
        self.assertEqual(self.run_quiet(SP.main, ["freigeben"])[0], 1)


class Taeglich(Base):
    def make_draft(self, nr, release=False):
        e = self.plan()[nr]
        if release: SP.update_plan({nr: {"status": "entwurf", "freigegeben": True}})
        text = SP.package_text(e, "A test summary that is long enough for the content package check, about SharePoint in plain words.",
                               [{"q": "A question?", "a": "A short answer."}], FILLER + "\n\n## Heading\n\n" + FILLER + "\n\n## Another\n\n" + FILLER + "\n\n## Third\n\n" + FILLER,
                               [e["main"]] + [x for x in e["others"] if x in ENTS][:1])
        text = text.replace("topics: [sharepoint, ", "topics: [sharepoint, ")
        (SP.OUT_DIR / f"{e['slug']}.md").write_text(text, "utf-8")
        return text

    def test_release_sets_approved_publish_true_and_plan_live(self):
        self.make_draft(4)
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-18"])
        self.assertEqual(code, 0, out)
        f = SP.OUT_DIR / f"{self.plan()[4]['slug']}.md"
        head = f.read_text("utf-8")[:600]
        self.assertIn("status: approved", head); self.assertIn("publish: true", head); self.assertNotIn("status: review", head)
        self.assertEqual(self.plan()[4]["status"], "live")
        self.assertEqual((self.tmp / "msg.txt").read_text("utf-8").strip(), "Cognillo-Beitrag 4: Sharing links explained for site owners")
        with mock.patch.object(CBL, "DIR", SP.BLOG_DIR):   # freigegeben und fehlerfrei: jetzt im Index fuer den Worker
            items, rep = CBL.collect(ENTS)
        self.assertEqual((rep["approved"], rep["errors"]), (1, []))
        self.assertTrue(items[0]["publish"])

    def test_translator_team_picks_up_only_released_packages(self):
        """translate-blog.yml (translate_blog.posts -> site_content_blog.tr_sources) sieht nur status: approved: Entwurf = nicht, nach dem taeglichen Lauf = ja, ohne Zutun."""
        import translate_blog as TB
        self.make_draft(4)
        with mock.patch.object(CBL, "DIR", SP.BLOG_DIR), mock.patch.object(TB, "SRC", self.tmp / "keine-alten-beitraege.json.gz"):
            self.assertEqual([p["slug"] for p in TB.posts()], [])
            self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-18"])
            got = TB.posts()
        self.assertEqual([p["slug"] for p in got], ["content/" + self.plan()[4]["slug"]])
        self.assertTrue(got[0]["iso"].startswith("2026-11-18"))   # Plan-Datum = Veroeffentlichungsdatum (Fenster NEW_DAYS von translate_blog auto)

    def test_draft_is_not_collected_before_release(self):
        self.make_draft(4)
        with mock.patch.object(CBL, "DIR", SP.BLOG_DIR):
            items, rep = CBL.collect(ENTS)
        self.assertEqual((len(items), rep["review"]), (0, 1))   # status: review = liegt, wird nicht importiert

    def sponsorships(self):
        return json.loads(SP.SPONSORSHIPS_FILE.read_text("utf-8"))["sponsorships"]

    def live(self):
        return sorted(n for n, e in self.plan().items() if e["status"] == "live" and n != 6)   # Nr 6 ist im Fixture schon live

    def test_one_per_day_and_unreleased_stay_untouched(self):
        for nr in (4, 5): self.make_draft(nr)
        SP.update_plan({5: {"freigegeben": True}})
        self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-18"])
        self.assertEqual((self.plan()[4]["status"], self.plan()[5]["status"]), ("live", "entwurf"))   # Nr 5 erst am 19.
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-18"])
        self.assertEqual(code, 0); self.assertIn("nichts faellig", out)
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-19"])
        self.assertEqual(self.plan()[5]["status"], "live"); self.assertNotIn("Rueckstand", out)

    def test_skipped_day_catches_up_two_per_run_oldest_first(self):
        """Lauf am 16.11. faellt aus: am 17. sind Nr 2 und 3 faellig -> beide (aelteste zuerst), danach wieder einer pro Tag, kein dauerhafter Versatz."""
        for nr in range(1, 6): self.make_draft(nr, release=True)
        self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-15"])
        self.assertEqual(self.live(), [1])
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-17"])   # 16.11. verpasst
        self.assertEqual(code, 0, out); self.assertEqual(self.live(), [1, 2, 3]); self.assertNotIn("::warning::", out)
        self.assertTrue((self.tmp / "msg.txt").read_text("utf-8").startswith("Cognillo-Beitraege 2, 3 (Rueckstand)"))
        self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-18"])
        self.assertEqual(self.live(), [1, 2, 3, 4])   # wieder im Plan: am 18. genau Nr 4
        self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-19"])
        self.assertEqual(self.live(), [1, 2, 3, 4, 5])

    def test_longer_backlog_warns_and_shrinks(self):
        for nr in range(1, 6): self.make_draft(nr, release=True)
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-19"])   # alle 5 faellig (4 Tage verpasst)
        self.assertEqual((code, self.live()), (0, [1, 2]))
        self.assertIn("::warning::Sponsor-Reihe: Rueckstand - noch 3 freigegebene Beitraege faellig (Nr 3-5)", out)
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-19"])
        self.assertEqual(self.live(), [1, 2, 3, 4]); self.assertIn("noch 1 freigegebene", out)
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-19"])
        self.assertEqual(self.live(), [1, 2, 3, 4, 5]); self.assertNotIn("::warning::", out)

    def test_dry_run_with_backlog_changes_nothing(self):
        for nr in range(1, 4): self.make_draft(nr, release=True)
        before = (SP.PLAN_FILE.read_text("utf-8"), SP.SPONSORSHIPS_FILE.read_text("utf-8"))
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-19", "--dry-run"])
        self.assertEqual(code, 0); self.assertIn("Beitrag 1 ", out); self.assertIn("Beitrag 2 ", out); self.assertIn("noch 1 freigegebene", out)
        self.assertEqual((SP.PLAN_FILE.read_text("utf-8"), SP.SPONSORSHIPS_FILE.read_text("utf-8")), before)
        self.assertFalse((self.tmp / "msg.txt").exists())

    def test_broken_first_blocks_the_later_ones(self):
        for nr in (4, 5): self.make_draft(nr, release=True)
        f = SP.OUT_DIR / f"{self.plan()[4]['slug']}.md"
        f.write_text(f.read_text("utf-8").replace("status: review", "status: kaputt").replace("\nsummary:", "\nsumary:"), "utf-8")
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-19"])
        self.assertEqual(code, 1); self.assertIn("NICHT live", out); self.assertEqual(self.live(), [])   # Reihenfolge bleibt: Nr 5 wartet
        self.assertIn("2 faellige Beitraege warten", out)

    def test_sponsored_post_is_added_to_posts_of_the_sponsorship_once(self):
        self.make_draft(2, release=True)
        before = [r for r in self.sponsorships() if r["id"] == "cognillo-2026-11"][0]
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-16"])
        self.assertEqual(code, 0, out)
        recs = {r["id"]: r for r in self.sponsorships()}
        self.assertEqual(recs["cognillo-2026-11"]["posts"], ["/community/u/mirko-p/blog/toolkit-or-scripts-when-each-one-wins/"])
        self.assertEqual((recs["cognillo-2026-11"]["start"], recs["cognillo-2026-11"]["end"]), (before["start"], before["end"]))   # Laufzeit bleibt (Entscheidung Mirko)
        self.assertNotIn("posts", recs["anderes"])
        import site_sponsorships as SPM
        self.assertEqual(SPM.check_structure(json.loads(SP.SPONSORSHIPS_FILE.read_text("utf-8")))[1], [])
        self.assertEqual(SPM.post_ref(recs["cognillo-2026-11"]["posts"][0]), ("mirko-p", "toolkit-or-scripts-when-each-one-wins"))
        text = SP.SPONSORSHIPS_FILE.read_text("utf-8")
        self.assertEqual(SP.sponsorship_post(self.plan()[2], "mirko-p"), ("cognillo-2026-11", False))   # idempotent
        self.assertEqual(SP.SPONSORSHIPS_FILE.read_text("utf-8"), text)
        self.assertEqual(self.live(), [2])

    def test_sponsored_post_after_term_end_still_gets_posts_entry(self):
        SP.update_plan({2: {"date": "2027-01-05"}})   # wie Nr 52 im echten Plan: Laufzeit endet am 10.12.2026
        self.make_draft(2, release=True)
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2027-01-05"])
        self.assertEqual(code, 0, out)
        self.assertEqual([r.get("posts") for r in self.sponsorships() if r["id"] == "cognillo-2026-11"], [["/community/u/mirko-p/blog/toolkit-or-scripts-when-each-one-wins/"]])
        self.assertIn("cognillo-2026-11", out)

    def test_build_accepts_posts_entry_before_the_worker_imports_the_package(self):
        """Gleicher Commit: publish true + Eintrag unter "posts". Der naechste Seitenbau kennt den Beitrag noch nicht aus der Datenbank (der Worker legt ihn erst
        danach an); SPM.check_posts bekommt deshalb auch CBL.live_refs und bricht den Bau nicht ab."""
        import site_sponsorships as SPM
        self.make_draft(2, release=True)
        self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-16"])
        recs, errs = SPM.check_structure(json.loads(SP.SPONSORSHIPS_FILE.read_text("utf-8"))); self.assertEqual(errs, [])
        with mock.patch.object(CBL, "DIR", SP.BLOG_DIR), mock.patch.dict(os.environ, {"SITE_OFFLINE": "0"}):
            refs = CBL.live_refs(ENTS)
            self.assertEqual(refs, [{"handle": "mirko-p", "slug": "toolkit-or-scripts-when-each-one-wins"}])
            try:
                SPM.reset(); SPM._index(recs, "2026-11-17", {}, {})
                with self.assertRaises(SPM.SponsorshipError): SPM.check_posts([])
                SPM.check_posts([] + refs)   # kein Fehler
            finally:
                SPM.reset()

    def test_sponsor_record_prefers_running_then_latest_started(self):
        a = dict(COG); b = dict(COG, id="cognillo-2027-01", start="2027-01-01", end="2027-01-31"); c = dict(COG, id="cognillo-2027-06", start="2027-06-01", end=None)
        recs = [a, b, c, {"id": "x", "start": "2026-01-01", "entities": ["acme"]}]
        self.assertEqual(SP.sponsor_record(recs, "2026-11-20")["id"], "cognillo-2026-11")
        self.assertEqual(SP.sponsor_record(recs, "2027-01-05")["id"], "cognillo-2027-01")
        self.assertEqual(SP.sponsor_record(recs, "2027-03-01")["id"], "cognillo-2027-01")   # Luecke: zuletzt begonnenes
        self.assertEqual(SP.sponsor_record(recs, "2026-01-05")["id"], "cognillo-2027-06")   # noch keines begonnen: zuletzt angelegtes
        self.assertIsNone(SP.sponsor_record(recs[3:], "2026-11-20"))

    def test_sponsored_post_without_sponsorship_record_does_not_go_live(self):
        SP.SPONSORSHIPS_FILE.write_text(json.dumps({"version": 1, "sponsorships": []}), "utf-8")
        self.make_draft(2, release=True)
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-16"])
        self.assertEqual(code, 1); self.assertIn("NICHT live", out)
        self.assertEqual(self.plan()[2]["status"], "entwurf")
        self.assertIn("status: review", (SP.OUT_DIR / f"{self.plan()[2]['slug']}.md").read_text("utf-8"))

    def test_post_handle_from_head(self):
        self.assertEqual(SP.post_handle("---\ntitle: x\nauthor: other-handle\n---\nauthor: nein\n"), "other-handle")
        self.assertEqual(SP.post_handle("---\ntitle: x\n---\n"), "mirko-p")
        for head in ("author: 'Other-Handle'", "author: \"OTHER-HANDLE \"", "author:   Other-Handle  "):   # wie site_content_blog: YAML lesen, ohne Leerraum, klein
            self.assertEqual(SP.post_handle(f"---\ntitle: x\n{head}\n---\n"), "other-handle", head)

    def test_posts_entry_names_the_same_handle_as_the_site_build(self):
        """Autor im Kopf von Hand geaendert (einfache Anfuehrungszeichen, Grossbuchstaben): der Eintrag unter "posts" nennt denselben Handle wie CBL.live_refs,
        sonst stoppt SPM.check_posts den naechsten Seitenbau."""
        import site_sponsorships as SPM
        self.make_draft(2, release=True)
        f = SP.OUT_DIR / f"{self.plan()[2]['slug']}.md"
        f.write_text(f.read_text("utf-8").replace("author: mirko-p", "author: 'Other-Handle'"), "utf-8")
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-16"])
        self.assertEqual(code, 0, out)
        posts = [r.get("posts") for r in self.sponsorships() if r["id"] == "cognillo-2026-11"][0]
        with mock.patch.object(CBL, "DIR", SP.BLOG_DIR), mock.patch.dict(os.environ, {"SITE_OFFLINE": "0"}):
            refs = CBL.live_refs(ENTS)
        self.assertEqual(refs, [{"handle": "other-handle", "slug": "toolkit-or-scripts-when-each-one-wins"}])
        self.assertEqual([SPM.post_ref(x) for x in posts], [(r["handle"], r["slug"]) for r in refs])

    def test_failed_write_after_posts_entry_rolls_everything_back(self):
        """Scheitert nach dem Eintrag unter "posts" ein Schreibschritt (z.B. OSError beim Plan), bleibt kein verwaister Eintrag stehen: sponsorships.json, Paketdatei
        und Plan sind wie vorher, der Lauf endet mit Fehler statt mit Traceback."""
        self.make_draft(2, release=True)
        f = SP.OUT_DIR / f"{self.plan()[2]['slug']}.md"
        before = (SP.SPONSORSHIPS_FILE.read_text("utf-8"), f.read_text("utf-8"), SP.PLAN_FILE.read_text("utf-8"))
        with mock.patch.object(SP, "update_plan", side_effect=OSError("Platte voll")):
            code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-16"])
        self.assertEqual(code, 1); self.assertIn("NICHT live", out); self.assertIn("Platte voll", out); self.assertIn("unveraendert", out)
        self.assertEqual((SP.SPONSORSHIPS_FILE.read_text("utf-8"), f.read_text("utf-8"), SP.PLAN_FILE.read_text("utf-8")), before)
        self.assertFalse((self.tmp / "msg.txt").exists())

    def test_not_released_draft_untouched(self):
        self.make_draft(5)
        before = (SP.OUT_DIR / f"{self.plan()[5]['slug']}.md").read_text("utf-8")
        self.run_quiet(SP.main, ["taeglich", "--date", "2026-12-31"])
        self.assertEqual((SP.OUT_DIR / f"{self.plan()[5]['slug']}.md").read_text("utf-8"), before)
        self.assertEqual(self.plan()[5]["status"], "entwurf")

    def test_dry_run_changes_nothing(self):
        self.make_draft(4)
        before = (SP.OUT_DIR / f"{self.plan()[4]['slug']}.md").read_text("utf-8"); plan_before = SP.PLAN_FILE.read_text("utf-8")
        self.assertEqual(self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-20", "--dry-run"])[0], 0)
        self.assertEqual((SP.OUT_DIR / f"{self.plan()[4]['slug']}.md").read_text("utf-8"), before)
        self.assertEqual(SP.PLAN_FILE.read_text("utf-8"), plan_before)

    def test_broken_edit_blocks_go_live(self):
        text = self.make_draft(4)
        f = SP.OUT_DIR / f"{self.plan()[4]['slug']}.md"
        f.write_text(text.replace("summary: \"A test summary that is long enough for the content package check, about SharePoint in plain words.\"", "summary: \"zu kurz\""), "utf-8")
        code, out = self.run_quiet(SP.main, ["taeglich", "--date", "2026-11-20"])
        self.assertEqual(code, 1); self.assertIn("NICHT live", out)
        self.assertEqual(self.plan()[4]["status"], "entwurf"); self.assertIn("status: review", f.read_text("utf-8"))

    def test_set_head_flags_only_touches_head(self):
        t = "---\ntitle: \"x\"\nstatus: review\npublish: false\n---\n\nstatus: review\npublish: false\n"
        n = SP.set_head_flags(t, "approved", True)
        self.assertTrue(n.startswith("---\ntitle: \"x\"\nstatus: approved\npublish: true\n---")); self.assertTrue(n.endswith("status: review\npublish: false\n"))
        with self.assertRaises(ValueError): SP.set_head_flags("kein Kopf", "approved", True)


class WorkflowSave(unittest.TestCase):
    """save() aus .github/workflows/sponsor-posts.yml in einem echten Git-Repo (lokales origin, kein Netz): das Kostenbuch wird auch ohne LinkedIn-Datei
    gespeichert, data/sponsorships.json gehoert dazu, pull --rebase bei bewegtem main bleibt."""
    def setUp(self):
        if not shutil.which("git") or not shutil.which("bash"): self.skipTest("git/bash fehlt")
        lines = (ROOT / ".github" / "workflows" / "sponsor-posts.yml").read_text("utf-8").splitlines()
        a = lines.index("          save() {"); b = lines.index("          }", a)
        self.save = "\n".join(x[10:] for x in lines[a:b + 1])
        self.tmp = Path(tempfile.mkdtemp())
        self.git = lambda cwd, *a: subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@example.test", "-c", "init.defaultBranch=main", *a], cwd=cwd, check=True, capture_output=True, text=True).stdout
        self.git(self.tmp, "init", "-q", "--bare", "origin.git")
        seed = self.tmp / "seed"; seed.mkdir(); self.git(seed, "init", "-q")
        (seed / "data").mkdir(); (seed / "imports" / "blog" / "en").mkdir(parents=True)
        for n in ("spend.json", "sponsor_posts_cognillo.json", "sponsorships.json"): (seed / "data" / n).write_text("{}\n", "utf-8")
        (seed / "imports" / "blog" / "en" / "alt.md").write_text("x\n", "utf-8"); (seed / "anderes.txt").write_text("a\n", "utf-8")
        self.git(seed, "add", "-A"); self.git(seed, "commit", "-q", "-m", "start"); self.git(seed, "push", "-q", str(self.tmp / "origin.git"), "HEAD:main")
        self.git(self.tmp, "clone", "-q", "-b", "main", "origin.git", "work"); self.work = self.tmp / "work"
        self.git(self.work, "config", "user.name", "bot"); self.git(self.work, "config", "user.email", "bot@example.test")

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def run_save(self, msg=""):
        env = dict(os.environ, SPONSOR_COMMIT_MSG_FILE=str(self.tmp / "msg.txt"), GITHUB_STEP_SUMMARY=str(self.tmp / "summary.md"))
        (self.tmp / "msg.txt").write_text(msg, "utf-8")
        return subprocess.run(["bash", "-c", self.save + "\nsave"], cwd=self.work, env=env, capture_output=True, text=True)

    def origin_file(self, path):
        return self.git(self.tmp / "origin.git", "show", f"main:{path}")

    def test_spend_is_saved_without_linkedin_file(self):
        self.assertFalse((self.work / "data" / "sponsor_posts_linkedin_cognillo.json").exists())
        (self.work / "data" / "spend.json").write_text('{"sponsor-cognillo": {"usd": 0.4}}\n', "utf-8")
        r = self.run_save("Cognillo-Beitraege: Kostenbuch aktualisiert (kein Beitrag gespeichert)\n")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr); self.assertNotIn("nichts zu speichern", r.stdout)
        self.assertIn("0.4", self.origin_file("data/spend.json"))

    def test_sponsorships_and_post_saved_with_rebase_on_moved_main(self):
        other = self.tmp / "other"; self.git(self.tmp, "clone", "-q", "-b", "main", "origin.git", "other")
        (other / "anderes.txt").write_text("b\n", "utf-8"); self.git(other, "commit", "-q", "-am", "anderer Bot"); self.git(other, "push", "-q", "origin", "HEAD:main")
        (self.work / "data" / "sponsorships.json").write_text('{"posts": ["/community/u/mirko-p/blog/x/"]}\n', "utf-8")
        (self.work / "imports" / "blog" / "en" / "x.md").write_text("neu\n", "utf-8")
        r = self.run_save("Cognillo-Beitrag 2: Titel\n")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("mirko-p/blog/x", self.origin_file("data/sponsorships.json")); self.assertEqual(self.origin_file("imports/blog/en/x.md"), "neu\n")
        self.assertEqual(self.origin_file("anderes.txt"), "b\n")   # Commit des anderen Bots bleibt
        self.assertIn("Cognillo-Beitrag 2: Titel", self.git(self.tmp / "origin.git", "log", "-1", "--format=%s", "main"))

    def test_nothing_to_save(self):
        r = self.run_save()
        self.assertEqual(r.returncode, 0); self.assertIn("nichts zu speichern", r.stdout)


class Budget(Base):
    def test_default_and_override(self):
        self.assertEqual(SP.budget_usd(), 50.0)
        with mock.patch.dict(os.environ, {"SPONSOR_POSTS_BUDGET_USD": "12.5"}): self.assertEqual(SP.budget_usd(), 12.5)
        with mock.patch.dict(os.environ, {"SPONSOR_POSTS_BUDGET_USD": "abc"}), self.assertRaises(SP.Stop): SP.budget_usd()

    def test_booking_uses_own_key_and_leaves_monthly_books_alone(self):
        SP.SPEND_FILE.write_text(json.dumps({"2026-11": {"usd": 24.9, "calls": 5}, "shownotes": {"2026-11": {"usd": 1}}}), "utf-8")
        SP.book(1_000_000, 100_000, 0, 0)   # 2 USD + 1 USD
        d = json.loads(SP.SPEND_FILE.read_text("utf-8"))
        self.assertAlmostEqual(d["sponsor-cognillo"]["usd"], 3.0); self.assertEqual(d["sponsor-cognillo"]["calls"], 1)
        self.assertEqual(d["2026-11"], {"usd": 24.9, "calls": 5}); self.assertEqual(d["shownotes"], {"2026-11": {"usd": 1}})
        SP.book(0, 0, 1_000_000, 0)   # Cache lesen 0,20 USD je Mio.
        self.assertAlmostEqual(SP.series_spent(), 3.2)

    def test_monthly_article_limit_does_not_stop_the_series(self):
        SP.SPEND_FILE.write_text(json.dumps({"2026-11": {"usd": 999}}), "utf-8")   # Monatsgrenze des Artikel-Generators laengst erreicht
        self.assertEqual(SP.check_series_budget()[0], 0.0)

    def test_reached_budget_stops_before_any_api_call(self):
        SP.SPEND_FILE.write_text(json.dumps({"sponsor-cognillo": {"usd": 50.0}}), "utf-8")
        with self.assertRaises(SP.Stop) as c: SP.check_series_budget()
        self.assertEqual(c.exception.code, 0); self.assertIn("BUDGET", str(c.exception))
        with mock.patch.object(SP, "api_call", REAL_API_CALL), mock.patch("ai_gateway.anthropic_request", side_effect=AssertionError("API aufgerufen")), \
             mock.patch.dict(os.environ, {"ANTHROPIC_API_KEY": "x"}):
            with self.assertRaises(SP.Stop): SP.api_call("p", "t", 10)   # die echte Funktion bricht vor dem Senden ab
        code, out = self.run_quiet(SP.main, ["schreiben"])
        self.assertEqual(code, 0); self.assertIn("BUDGET", out)

    def test_exceeded_budget_with_env_override(self):
        SP.SPEND_FILE.write_text(json.dumps({"sponsor-cognillo": {"usd": 7.0}}), "utf-8")
        with mock.patch.dict(os.environ, {"SPONSOR_POSTS_BUDGET_USD": "5"}), self.assertRaises(SP.Stop): SP.check_series_budget()
        with mock.patch.dict(os.environ, {"SPONSOR_POSTS_BUDGET_USD": "8"}): SP.check_series_budget()

    def test_estimate_and_dry_run_without_api(self):
        topics, others, anchors = SP.resolve_entities(self.plan()[2], ENTS, lambda *_: None)
        est = SP.estimate(SP.build_prefix(topics, anchors, ENTS), SP.draft_prompt(self.plan()[2], topics, others, anchors))
        self.assertTrue(0 < est["review"] < est["draft"] < est["typical"] < est["cap"] < 5)
        code, out = self.run_quiet(SP.main, ["schreiben", "--dry-run"])
        self.assertEqual(code, 0)
        for s in ("Dry-Run schreiben", "3 Beitraege", "USD", "QUALITY RULES", "Prompt"): self.assertIn(s, out)
        self.assertFalse(list(SP.OUT_DIR.glob("*.md"))); self.assertFalse(SP.SPEND_FILE.exists())


class Links(unittest.TestCase):
    def test_filter_links(self):
        logs = []
        text = ("Good [internal](https://www.m365.fm/entity/sharepoint/) and [docs](https://learn.microsoft.com/sharepoint/) and [dead](https://learn.microsoft.com/gone) "
                "and [evil](https://example.com/x) and [ghost](https://www.m365.fm/entity/nope/) and [page](https://www.m365.fm/blog/) and [vendor](http://www.cognillo.com/a) "
                "and ![img](https://img.m365.fm/a.webp) and https://bare.example.org/path plus <b>tag</b>.")
        out = SP.filter_links(text, ENTS, lambda u: "gone" not in u, logs.append)
        self.assertIn("[internal](https://www.m365.fm/entity/sharepoint/)", out)
        self.assertIn("[docs](https://learn.microsoft.com/sharepoint/)", out)
        self.assertIn("[vendor](https://www.cognillo.com/a)", out)   # http wird https
        for gone in ("gone)", "example.com", "entity/nope", "/blog/", "img.m365.fm", "bare.example.org", "<b>"): self.assertNotIn(gone, out)
        for kept in ("dead", "evil", "ghost", "page", "tag"): self.assertIn(kept, out)   # Text bleibt
        self.assertTrue(any("HTTP-Pruefung" in l for l in logs) and any("nicht erlaubt" in l for l in logs))

    def test_check_called_once_per_url_and_only_for_external_allowed_hosts(self):
        calls = []
        SP.filter_links("[a](https://learn.microsoft.com/x) [b](https://learn.microsoft.com/x) [c](https://www.m365.fm/entity/sharepoint/) [d](https://evil.test/)", ENTS,
                        lambda u: calls.append(u) or True, lambda *_: None)
        self.assertEqual(calls, ["https://learn.microsoft.com/x"])

    def test_http_ok_treats_every_error_as_failure(self):
        with mock.patch("urllib.request.urlopen", side_effect=OSError("kein Netz")): self.assertFalse(SP.http_ok("https://learn.microsoft.com/x"))


class Linkedin(unittest.TestCase):
    E = {"sponsored": False}
    S = {"sponsored": True}

    def test_clean_removes_links_and_marks_sponsored(self):
        t = "Hook https://evil.test/x and [text](https://a.test/b)\\n\\nFull article: {URL}\n\nWhat do you think?\n\n#A #B"
        out = SP.clean_linkedin({"profile": t, "page": t, "group": t}, self.E, lambda *_: None)
        self.assertNotIn("evil.test", out["profile"]); self.assertNotIn("a.test", out["profile"]); self.assertIn("{URL}", out["profile"])
        out = SP.clean_linkedin({"profile": t, "page": "Sponsored by Cognillo\n" + t, "group": t}, self.S, lambda *_: None)
        self.assertEqual(out["group"], "")   # gesponserte Beitraege gehen nie in Gruppen
        for k in ("profile", "page"):
            self.assertTrue(out[k].startswith(SP.SPONSOR_LI)); self.assertEqual(out[k].count("Sponsored by Cognillo"), 1); self.assertEqual(out[k].count("#Anzeige"), 1)

    def test_problems(self):
        ok = {"profile": LI_OK, "page": LI_OK, "group": LI_OK}
        self.assertEqual(SP.linkedin_problems(ok, self.E), [])
        bad = " ".join(SP.linkedin_problems({"profile": LI_OK.replace("{URL}", ""), "page": "x" * 1400 + " {URL} #a #b?", "group": LI_OK.replace("?", ".")}, self.E))
        self.assertIn("Platzhalter {URL}", bad); self.assertIn("hoechstens 1300", bad); self.assertIn("offenen Frage", bad)
        self.assertTrue(any("Hashtags" in b for b in SP.linkedin_problems({"profile": LI_OK + " #c #d", "page": LI_OK, "group": LI_OK}, self.E)))
        sp = SP.clean_linkedin(ok, self.S, lambda *_: None)
        self.assertEqual(SP.linkedin_problems(sp, self.S), [])
        self.assertTrue(SP.linkedin_problems(dict(sp, group="noch Text"), self.S))
        self.assertTrue(SP.linkedin_problems(ok, self.S))   # Sponsor-Zeile fehlt
        self.assertTrue(SP.linkedin_problems(dict(ok, profile="Sponsored by Cognillo\n" + LI_OK), self.E))


class Review(unittest.TestCase):
    def doc(self):
        return {"summary": "A summary sentence with a bold claim inside.", "faq": [{"q": "Q one?", "a": "Answer with an invented number of 97 percent here."}],
                "li": {"profile": "Hook with a claim that is not proven at all.", "page": "", "group": ""}, "body": "Intro text. A claim that nobody can prove anywhere. Outro text."}

    def test_apply_edits_changes_only_flagged_unique_passages(self):
        d, n = SP.apply_edits(self.doc(), [{"find": "A claim that nobody can prove anywhere. ", "replace": ""},
                                           {"find": "an invented number of 97 percent here", "replace": "a short answer"},
                                           {"find": "a claim that is not proven at all", "replace": "an insight"},
                                           {"find": "does not occur in the text", "replace": "x"}, {"find": "Intro", "replace": "x"}], lambda *_: None)
        self.assertEqual(n, 3)
        self.assertEqual(d["body"], "Intro text. Outro text."); self.assertIn("a short answer", d["faq"][0]["a"]); self.assertEqual(d["li"]["profile"], "Hook with an insight.")
        self.assertTrue(d["summary"].startswith("A summary"))   # unveraendert

    def test_ambiguous_find_is_skipped(self):
        d = self.doc(); d["body"] = "Same words. Same words."
        d2, n = SP.apply_edits(d, [{"find": "Same words.", "replace": "x"}], lambda *_: None)
        self.assertEqual((n, d2["body"]), (0, "Same words. Same words."))

    def test_parse_review(self):
        self.assertEqual(SP.parse_review(REVIEW_OK), [])
        self.assertEqual(len(SP.parse_review('Hier: {"verdict": "edits", "edits": [{"find": "abcdefghij", "replace": ""}]}')), 1)
        with self.assertRaises(ValueError): SP.parse_review("kein json")
        with self.assertRaises(ValueError): SP.parse_review('{"verdict": "vielleicht"}')

    def test_parse_draft(self):
        d = SP.parse_draft(draft())
        self.assertEqual(set(d["li"]), set(SP.LI_KEYS)); self.assertEqual(len(d["faq"]), 2)
        with self.assertRaises(ValueError): SP.parse_draft("===SUMMARY===\nnur ein Teil")


class Produce(Base):
    """Entwurf -> zweiter Durchgang -> Pruefungen mit einer Attrappe fuer die API; kein Netz (Linkpruefung durch Lambda ersetzt)."""
    def call_factory(self, drafts, reviews=None):
        calls = []
        d, r = list(drafts), list(reviews or [])
        def call(prefix, task, max_tokens):
            calls.append((task, max_tokens))
            if task.startswith("You are the second reviewer"): return (r.pop(0) if r else REVIEW_OK), "end_turn"
            return d.pop(0), "end_turn"
        return call, calls

    def run_produce(self, nr, call):
        e = self.plan()[nr]
        topics, others, anchors = SP.resolve_entities(e, ENTS, lambda *_: None)
        return SP.produce(e, topics, others, anchors, ENTS, SP.build_prefix(topics, anchors, ENTS), call=call, check=lambda u: True, log=lambda *_: None), e

    def test_success_runs_draft_and_second_pass_and_passes_site_check(self):
        call, calls = self.call_factory([draft()])
        (text, li), e = self.run_produce(1, call)
        self.assertEqual([c[1] for c in calls], [SP.DRAFT_MAX_TOKENS, SP.REVIEW_MAX_TOKENS])   # genau Entwurf + Pruefung
        self.assertIn("status: review", text); self.assertIn("publish: false", text); self.assertIn("date: 2026-11-15", text); self.assertIn("author: mirko-p", text)
        self.assertIn("topics: [sharepoint-permissions, sharepoint, oversharing]", text)
        self.assertEqual(SP.check_package(e["slug"], text, ENTS), [])
        self.assertNotIn("Sponsored:", text.split("---", 2)[2])   # redaktionell: kein Hinweisabsatz
        self.assertEqual(set(li), set(SP.LI_KEYS)); self.assertIn("{URL}", li["group"])
        self.assertNotIn("![", text)

    def test_head_parses_with_yaml_and_with_the_small_reader(self):
        (text, _), e = self.run_produce(1, self.call_factory([draft()])[0])
        with tempfile.TemporaryDirectory() as t:
            f = Path(t) / "x.md"; f.write_text(text, "utf-8")
            a = SNS.parse_file(f)
            with mock.patch.dict(sys.modules, {"yaml": None}):   # ohne PyYAML (wie im Bau-Runner moeglich)
                b = SNS.parse_file(f)
        for rec in (a, b):
            self.assertEqual(CBL.check(rec, "en", e["slug"], ENTS)[1], [])
            self.assertEqual(rec["meta"]["status"], "review"); self.assertIs(rec["meta"]["publish"], False)
            self.assertEqual(len(rec["meta"]["faq"]), 2); self.assertEqual(rec["meta"]["topics"], ["sharepoint-permissions", "sharepoint", "oversharing"])

    def test_sponsored_post_gets_notice_first_and_no_group_text(self):
        d = draft(main="sharepoint-essentials-toolkit", others=("cognillo", "sharepoint"), group="")
        (text, li), e = self.run_produce(2, self.call_factory([d])[0])
        body = text.split("---", 2)[2].strip()
        self.assertTrue(body.startswith("Sponsored: Cognillo sponsors M365.FM"))
        self.assertEqual(li["group"], ""); self.assertTrue(li["profile"].startswith(SP.SPONSOR_LI) and li["page"].startswith(SP.SPONSOR_LI))
        self.assertEqual(SP.check_package(e["slug"], text, ENTS), [])

    def test_second_pass_edits_are_applied(self):
        d = draft(extra="This tool guarantee-free sentence that nobody can prove.")
        rv = json.dumps({"verdict": "edits", "edits": [{"find": "This tool guarantee-free sentence that nobody can prove.", "replace": "", "reason": "unbelegt"}]})
        (text, _), _e = self.run_produce(1, self.call_factory([d], [rv])[0])
        self.assertNotIn("nobody can prove", text)

    def test_one_retry_with_error_message_in_prompt_then_success(self):
        bad = draft(others=())   # keine weiteren Entitaeten verlinkt
        call, calls = self.call_factory([bad, draft()])
        (text, _), e = self.run_produce(1, call)
        drafts = [c for c in calls if not c[0].startswith("You are the second reviewer")]
        self.assertEqual(len(drafts), 2)
        self.assertIn("failed automatic checks", drafts[1][0]); self.assertIn("weiteren Entitaeten", drafts[1][0])
        self.assertEqual(SP.check_package(e["slug"], text, ENTS), [])

    def test_two_failures_raise_and_write_nothing(self):
        call, calls = self.call_factory([draft(others=()), draft(others=())])
        with self.assertRaises(SP.PostFailed):
            self.run_produce(1, call)
        self.assertEqual(len([c for c in calls if not c[0].startswith("You are")]), 2)   # genau EIN Wiederholungsversuch
        self.assertFalse(list(SP.OUT_DIR.glob("*.md")))

    def test_rule_violations_are_caught(self):
        cases = {"guarantee": "We guarantee 100% success.", "number": "It saves 45% of the time.", "experience": "In our experience this works.",
                 "competitor": "Our tool is better than Microsoft here.", "risky": "Then delete all old sites from the tenant.", "source": "Studies show this is common."}
        e = self.plan()[1]
        topics, others, anchors = SP.resolve_entities(e, ENTS, lambda *_: None)
        facts = SP.facts_text(topics, anchors, ENTS)
        for name, extra in cases.items():
            doc = SP.parse_draft(draft(extra=extra)); doc["li"] = SP.clean_linkedin(doc["li"], e, lambda *_: None)
            err, _ = SP.quality_problems(doc, e, topics, others, anchors, facts)
            self.assertTrue(err, name)
        doc = SP.parse_draft(draft(extra="Delete the old site only after a test and with a backup."))
        doc["li"] = SP.clean_linkedin(doc["li"], e, lambda *_: None)
        self.assertEqual(SP.quality_problems(doc, e, topics, others, anchors, facts)[0], [])   # mit Test-/Backup-Hinweis erlaubt

    def test_truncated_or_malformed_answers_count_as_failed_attempt(self):
        calls = []
        def call(prefix, task, max_tokens):
            calls.append(task)
            if task.startswith("You are"): return REVIEW_OK, "end_turn"
            return ("kein Format", "max_tokens") if len(calls) == 1 else (draft(), "end_turn")
        (text, _), e = self.run_produce(1, call)
        self.assertIn("abgeschnitten", calls[1])

    def test_unreadable_second_pass_aborts(self):
        def call(prefix, task, max_tokens): return ("Quatsch" if task.startswith("You are") else draft()), "end_turn"
        with self.assertRaises(SP.Stop): self.run_produce(1, call)


class Schreiben(Base):
    def fake_produce(self, fail=()):
        def fn(entry, topics, others, anchors, ents, prefix, log=print):
            if entry["nr"] in fail: raise SP.PostFailed(f"Beitrag {entry['nr']} faellt durch")
            return SP.package_text(entry, "A test summary that is long enough for the content package check, about SharePoint in plain words.", [{"q": "Q?", "a": "A."}],
                                   FILLER + "\n\n## A\n\n" + FILLER + "\n\n## B\n\n" + FILLER + "\n\n## C\n\n" + FILLER, [entry["main"]]), {"profile": "p", "page": "pg", "group": "g"}
        return fn

    def test_writes_review_drafts_sets_status_entwurf_and_saves_linkedin(self):
        code, out = self.run_quiet(SP.mode_schreiben, None, None, False, 10, print, self.fake_produce())
        self.assertEqual(code, 0, out)
        p = self.plan()
        self.assertEqual([p[n]["status"] for n in (1, 2, 3)], ["entwurf"] * 3)
        for n in (1, 2, 3):
            t = (SP.OUT_DIR / f"{p[n]['slug']}.md").read_text("utf-8")
            self.assertIn("status: review", t); self.assertIn("publish: false", t); self.assertIn(f"date: {p[n]['date']}", t)
        li = json.loads(SP.LINKEDIN_FILE.read_text("utf-8"))
        self.assertEqual(list(li), ["1", "2", "3"]); self.assertEqual(set(li["1"]), {"profile", "page", "group"})
        self.assertEqual((self.tmp / "written.txt").read_text("utf-8"), "3")
        self.assertIn("Nr 1, 2, 3", (self.tmp / "msg.txt").read_text("utf-8"))
        with mock.patch.object(CBL, "DIR", SP.BLOG_DIR):
            self.assertEqual(CBL.collect(ENTS)[1]["approved"], 0)   # nichts davon wird importiert

    def test_resume_skips_existing_files_and_syncs_status(self):
        self.run_quiet(SP.mode_schreiben, 1, 1, False, 10, print, self.fake_produce())
        SP.update_plan({1: {"status": "geplant"}})   # Abbruch vor dem Commit: Datei da, Status noch "geplant"
        code, out = self.run_quiet(SP.mode_schreiben, None, None, False, 10, print, self.fake_produce())
        self.assertEqual(code, 0, out); self.assertEqual(self.plan()[1]["status"], "entwurf")
        self.assertEqual((self.tmp / "written.txt").read_text("utf-8"), "2")   # nur 2 und 3 neu bezahlt

    def test_batch_limit_and_range(self):
        self.run_quiet(SP.mode_schreiben, 1, 3, False, 2, print, self.fake_produce())
        self.assertEqual([self.plan()[n]["status"] for n in (1, 2, 3)], ["entwurf", "entwurf", "geplant"])
        self.run_quiet(SP.mode_schreiben, 3, 3, False, 10, print, self.fake_produce())
        self.assertEqual(self.plan()[3]["status"], "entwurf")

    def test_failed_post_does_not_stop_others_but_ends_red(self):
        code, out = self.run_quiet(SP.mode_schreiben, None, None, False, 10, print, self.fake_produce(fail=(2,)))
        self.assertEqual(code, 1)
        p = self.plan()
        self.assertEqual([p[n]["status"] for n in (1, 2, 3)], ["entwurf", "geplant", "entwurf"])
        self.assertFalse((SP.OUT_DIR / f"{p[2]['slug']}.md").exists()); self.assertNotIn("2", json.loads(SP.LINKEDIN_FILE.read_text("utf-8")))

    def test_fatal_stop_ends_batch_but_keeps_finished_posts(self):
        def fn(entry, *a, **k):
            if entry["nr"] == 2: raise SP.Stop("API kaputt", 1)
            return self.fake_produce()(entry, *a, **k)
        code, out = self.run_quiet(SP.mode_schreiben, None, None, False, 10, print, fn)
        self.assertEqual(code, 1)
        self.assertEqual([self.plan()[n]["status"] for n in (1, 2, 3)], ["entwurf", "geplant", "geplant"])

    def test_missing_entities_abort_without_writing(self):
        with mock.patch.object(SP, "ENTITIES_FILE", FIX / "sponsor_plan_nothing.json"):
            code, out = self.run_quiet(SP.main, ["schreiben", "--dry-run"])
        self.assertEqual(code, 1)

    def test_main_entity_missing_and_unknown_others(self):
        p = self.plan()
        logs = []
        topics, others, anchors = SP.resolve_entities(p[3], ENTS, logs.append)
        self.assertEqual(others, ["oversharing"]); self.assertTrue(any("ghost-entity" in l for l in logs)); self.assertEqual(anchors, [])
        with self.assertRaises(SP.Stop): SP.resolve_entities(dict(p[3], main="gibt-es-nicht"), ENTS)
        self.assertEqual(SP.resolve_entities(p[2], ENTS)[2], ["cognillo", "sharepoint-essentials-toolkit"])   # Cognillo-Thema: Anker-Entitaeten
        reduced = {k: v for k, v in ENTS.items() if k not in SP.ANCHORS}
        with self.assertRaises(SP.Stop): SP.resolve_entities(dict(p[2], main="sharepoint", others=[]), reduced)

    def test_facts_only_from_entity_data(self):
        t = SP.facts_text(["sharepoint-essentials-toolkit", "sharepoint"], ["cognillo", "sharepoint-essentials-toolkit"], ENTS)
        self.assertIn("Fixture fact", t); self.assertIn("https://www.m365.fm/entity/cognillo/", t); self.assertIn("https://learn.microsoft.com/sharepoint/", t)
        self.assertEqual(t.count("### Cognillo"), 1)


class Workflow(unittest.TestCase):
    """Der Workflow startet nichts Kostenpflichtiges von selbst: Cron nur 'taeglich', Handlaeufe mit dry_run als Standard; verbotene Workflows bleiben unberuehrt."""
    def test_workflow_file(self):
        t = (ROOT / ".github" / "workflows" / "sponsor-posts.yml").read_text("utf-8")
        self.assertIn("workflow_dispatch", t); self.assertIn("cron:", t); self.assertIn("ANTHROPIC_API_KEY_SHOW", t)
        self.assertIn("SPONSOR_POSTS_BUDGET_USD", t); self.assertIn("'50'", t); self.assertIn("spendjson", t)
        self.assertRegex(t, r"dry_run: \{[^\n]*default: true")
        for m in ("schreiben", "freigeben", "taeglich"): self.assertIn(m, t)


if __name__ == "__main__":
    unittest.main()
