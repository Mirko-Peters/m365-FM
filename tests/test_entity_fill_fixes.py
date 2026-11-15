"""Befunde aus der Gegenpruefung von #326 (Entitaeten fuellen): nichts doppelt kaufen, Kostengrenzen und Kostenbuch, Commit-Schritt,
Sponsor/Claim, KI-Kennzeichnung nach push, veraltete Uebersetzungen (unittest, ohne API)."""
import json, os, shutil, subprocess, sys, tempfile, unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import ai_gateway
import entity_fill_data as FD
import fill_entities as F
import site_entities as SE

LONG = ("Contoso Hub is a Microsoft 365 product used to organise team documents. " * 14).strip()
GOOD = {"desc": "Contoso Hub is a Microsoft 365 service for organising shared team documents.", "long": LONG, "faq": [{"q": "What is Contoso Hub?", "a": "A document service."}]}


def ent(i, t="product", **kw):
    return {"id": i, "type": t, "name": kw.pop("name", "Contoso Hub"), "aliases": [], "desc": kw.pop("desc", {"en": "A hub.", "de": ""}), "web": "", "docs": "", "rel": [], **kw}


class Base(unittest.TestCase):
    """Eigenes data/entity_fill je Test, keine Folgen, keine Sponsoren, kein Netz."""
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp()); self.addCleanup(shutil.rmtree, self.tmp, True)
        self.eps = []
        for p in (mock.patch.object(F, "OUT", self.tmp), mock.patch.object(F, "episodes_for", lambda e, limit=6: list(self.eps)),
                  mock.patch.object(F, "sponsored_ids", lambda: set()), mock.patch.object(FD, "SPONS", set()),
                  mock.patch.dict(os.environ, {"COMMUNITY_API": "", "USD_PER_EUR": "1.0"}), mock.patch.object(F, "MODEL", "claude-sonnet-5-5"),
                  mock.patch.object(F, "TMODEL", "claude-haiku-5-5"), mock.patch.object(F, "BUDGET", 1000.0)):
            p.start(); self.addCleanup(p.stop)
        self.e = ent("hub"); self.ents = {"hub": self.e}

    def fake_api(self, results, status="ended"):
        """Batch-API: POST legt msgbatch_<n> an, GET liefert den Status, results_url die JSONL-Zeilen."""
        calls = {"n": 0, "posted": []}
        def api(method, path, body=None, raw=False, model=""):
            if method == "POST":
                calls["n"] += 1; calls["posted"].append(body); return {"id": f"msgbatch_{calls['n']}"}
            if raw: return "\n".join(json.dumps(r) for r in results).encode()
            return {"processing_status": status, "request_counts": {}, "results_url": "https://x/results"}
        return api, calls

    @staticmethod
    def ok(custom_id, out, usage=None):
        return {"custom_id": custom_id, "result": {"type": "succeeded", "message": {"content": [{"type": "text", "text": json.dumps(out)}],
                                                                                    "usage": usage or {"input_tokens": 1000, "output_tokens": 500}}}}


# ---------------- 326-1: offene Batches nicht noch einmal kaufen; neue Folge macht bezahlten Text nicht ungueltig ----------------
class NoRebuy(Base):
    def test_open_batch_blocks_second_purchase_of_write_and_translation(self):
        todo, _ = F.build_todo(self.ents, {}, {}, {l: {} for l in F.LANGS}, set(), set(), {})
        api, calls = self.fake_api([], status="in_progress"); state = {"batches": [], "tries": {}}
        with mock.patch.object(F, "api", api):
            reqs, c = F.next_writes(todo, self.ents, state, 0); self.assertEqual(len(reqs), 1)
            F.submit(reqs, c, "write", F.MODEL, state)
            self.assertEqual(state["batches"][0]["ids"], [f"w_{F.key('hub')}"])
            F.collect(self.ents, {}, state, set())   # Batch laeuft noch (wait_batches hat aufgegeben)
            todo, _ = F.build_todo(self.ents, {}, {}, {l: {} for l in F.LANGS}, set(), set(), state)
            self.assertEqual(F.next_writes(todo, self.ents, state, 0)[0], [], "derselbe Schreibauftrag wuerde ein zweites Mal bezahlt")
            fill = {"hub": dict(GOOD)}; todo, _ = F.build_todo(self.ents, {}, fill, {l: {} for l in F.LANGS}, set(), set(), state)
            with mock.patch.object(ai_gateway, "remaining_eur", lambda job, model: None):
                tr, c = F.next_translations(todo, self.ents, {}, fill, state, 0); self.assertEqual(len(tr), 14)
                F.submit(tr, c, "translate", F.TMODEL, state)
                self.assertEqual(F.next_translations(todo, self.ents, {}, fill, state, 0)[0], [], "Uebersetzungen wuerden doppelt gekauft")
        self.assertEqual(calls["n"], 2)

    def test_old_batch_without_ids_blocks_its_kind(self):
        todo, _ = F.build_todo(self.ents, {}, {}, {l: {} for l in F.LANGS}, set(), set(), {})
        state = {"batches": [{"id": "msgbatch_alt", "kind": "write", "model": F.MODEL, "est_usd": 0.1}]}
        self.assertEqual(F.next_writes(todo, self.ents, state, 0)[0], [])

    def test_new_episode_between_submit_and_collect_keeps_paid_text(self):
        f = F.facts_for(self.e, self.ents); cid = f"w_{F.key('hub')}_{F.fhash(f)[:8]}"
        self.eps = [{"title": "Contoso Hub deep dive", "date": "2026-11-10"}]   # neue Folge nach dem Absenden
        api, _ = self.fake_api([self.ok(cid, GOOD)])
        state = {"batches": [{"id": "msgbatch_1", "kind": "write", "model": F.MODEL, "est_usd": 0.1, "ids": [cid.rsplit("_", 1)[0]]}]}
        with mock.patch.object(F, "api", api): F.collect(self.ents, {}, state, set())
        self.assertEqual(F.jload(self.tmp / "en.json", {})["hub"]["desc"], GOOD["desc"])

    def test_changed_facts_count_as_try(self):
        f = F.facts_for(self.e, self.ents); cid = f"w_{F.key('hub')}_{F.fhash(f)[:8]}"
        self.ents["hub"] = ent("hub", desc={"en": "Contoso Hub was renamed and does something else now.", "de": ""})
        api, _ = self.fake_api([self.ok(cid, GOOD)]); state = {"batches": [{"id": "b", "kind": "write", "model": F.MODEL, "est_usd": 0.1}], "tries": {}}
        with mock.patch.object(F, "api", api): F.collect(self.ents, {}, state, set())
        self.assertEqual(F.jload(self.tmp / "en.json", {}), {}); self.assertEqual(state["tries"], {"w:hub": 1})


# ---------------- 326-5: Denken aus, Obergrenze, Monatsgrenze, Haiku je Lauf, Kostenbuch des Workers ----------------
class PaidGuards(Base):
    def test_requests_turn_thinking_off_and_estimate_is_an_upper_bound(self):
        todo, _ = F.build_todo(self.ents, {}, {}, {l: {} for l in F.LANGS}, set(), set(), {})
        reqs, est = F.select_writes(todo, self.ents, 1000.0, 0, {})
        p = reqs[0]["params"]
        self.assertEqual((p["thinking"], p["max_tokens"]), ({"type": "between_tools"}, F.WRITE_MAX_TOKENS))
        self.assertGreaterEqual(est, F.cost(F.MODEL, len((F.SYSTEM_WRITE + p["messages"][0]["content"]).encode()), p["max_tokens"]))
        with mock.patch.object(F, "MODEL", "claude-opus-5-5"):   # Denken laesst sich nicht abschalten: kein Feld, Zuschlag auf max_tokens
            p = F.select_writes(todo, self.ents, 1000.0, 0, {})[0][0]["params"]
            self.assertNotIn("thinking", p); self.assertEqual(p["max_tokens"], F.WRITE_MAX_TOKENS + F.THINK_TOKENS)
        fill = {"hub": dict(GOOD)}; todo, _ = F.build_todo(self.ents, {}, fill, {l: {} for l in F.LANGS}, set(), set(), {})
        tr, est = F.select_translations(todo, self.ents, {}, fill, 1000.0, 0)
        self.assertTrue(all(r["params"]["thinking"] == {"type": "disabled"} for r in tr))
        self.assertGreaterEqual(est, sum(F.cost(F.TMODEL, 0, r["params"]["max_tokens"]) for r in tr))

    def test_monthly_cap_for_writes(self):
        todo, _ = F.build_todo(self.ents, {}, {}, {l: {} for l in F.LANGS}, set(), set(), {})
        F.jsave(self.tmp / "spend.json", {"usd": 5.0, "months": {F.month_key(): {"write_usd": F.MONTH_CAP - 0.001}}})
        self.assertEqual(F.next_writes(todo, self.ents, {"batches": []}, 0)[0], [])
        F.jsave(self.tmp / "spend.json", {"usd": 5.0, "months": {"2020-01": {"write_usd": 999}}})
        self.assertEqual(len(F.next_writes(todo, self.ents, {"batches": []}, 0)[0]), 1)
        self.assertEqual(F.next_writes(todo, self.ents, {"batches": [{"kind": "write", "month": F.month_key(), "est_usd": F.MONTH_CAP, "ids": []}]}, 0)[0], [], "offene Batches zaehlen mit")
        self.assertLessEqual(F.MONTH_CAP, F.SONNET_MONTH_CAP_USD)

    def test_haiku_room_per_run_and_day_budget(self):
        with mock.patch.object(ai_gateway, "remaining_eur", lambda job, model: None):
            self.assertAlmostEqual(F.haiku_room_usd(), F.HAIKU_RUN_EUR)
        with mock.patch.object(ai_gateway, "remaining_eur", lambda job, model: 0.5):
            self.assertAlmostEqual(F.haiku_room_usd(), 0.5)
        self.assertLessEqual(F.HAIKU_RUN_CAP_EUR, 5.0)

    def test_collect_reports_usage_to_worker_and_books_own_ledger(self):
        fill = {"hub": dict(GOOD)}; F.jsave(self.tmp / "en.json", fill)
        src = F.effective_en(self.e, {}, fill); part = {"desc": src["desc"]}
        cid = f"t_fr_{F.key('hub')}_{F.hsh(part)[:6]}"
        out = {"desc": "Contoso Hub est un service Microsoft 365 pour organiser les documents partagés des équipes."}
        api, _ = self.fake_api([self.ok(cid, out, {"input_tokens": 100, "cache_read_input_tokens": 900, "cache_creation_input_tokens": 50, "output_tokens": 70})])
        seen = []
        with mock.patch.object(F, "api", api), mock.patch.object(ai_gateway, "report_usage", lambda *a, **k: seen.append((a, k))):
            F.collect(self.ents, {}, {"batches": [{"id": "b", "kind": "translate", "model": F.TMODEL, "est_usd": 0.1, "month": "2026-11"}]}, set())
        self.assertEqual(seen, [(("fill_entities", F.TMODEL, 1050, 70), {"lang": "batch", "batch": True, "cache_read": 900, "cache_write": 50})])
        led = F.jload(self.tmp / "spend.json", {})
        self.assertGreater(led["months"]["2026-11"]["translate_usd"], 0); self.assertGreater(led["usd"], 0)
        self.assertFalse((ROOT / "data" / "spend.json").read_text("utf-8").count('"entities"'), "nie in data/spend.json")


# ---------------- 326-6: Commit-Schritt verliert nichts und ueberschreibt keine fremden Kostenbuecher ----------------
class WorkflowCommit(unittest.TestCase):
    def setUp(self):
        import yaml
        wf = yaml.safe_load((ROOT / ".github" / "workflows" / "entity-fill.yml").read_text("utf-8"))
        self.steps = wf["jobs"]["fill"]["steps"]; self.commit = next(s for s in self.steps if s.get("name", "").startswith("Ergebnis committen"))
        self.tmp = Path(tempfile.mkdtemp()); self.addCleanup(shutil.rmtree, self.tmp, True)
        g = lambda *a, cwd=None: subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@example.test", *a], cwd=cwd, check=True, capture_output=True, text=True)
        self.g = g
        g("init", "-q", "--bare", "-b", "main", str(self.tmp / "origin.git"))
        hook = self.tmp / "origin.git" / "hooks" / "pre-receive"; self.rejects = self.tmp / "rejects"
        hook.write_text(f'#!/bin/sh\nn=$(cat "{self.rejects}" 2>/dev/null || echo 0)\nif [ "$n" -gt 0 ]; then echo $((n-1)) > "{self.rejects}"; echo "abgelehnt" >&2; exit 1; fi\nexit 0\n'); hook.chmod(0o755)
        g("clone", "-q", str(self.tmp / "origin.git"), str(self.tmp / "seed")); seed = self.seed = self.tmp / "seed"
        (seed / "data").mkdir(); (seed / "data" / "spend.json").write_text('{\n "2026-11": {\n  "usd": 1.0\n }\n}\n'); g("add", "-A", cwd=seed); g("commit", "-q", "-m", "start", cwd=seed); g("push", "-q", "origin", "HEAD:main", cwd=seed)
        g("clone", "-q", str(self.tmp / "origin.git"), str(self.tmp / "run")); self.run_dir = self.tmp / "run"
        (seed / "data" / "spend.json").write_text('{\n "2026-11": {\n  "usd": 9.0\n }\n}\n'); g("commit", "-q", "-am", "Artikel-Bot", cwd=seed); g("push", "-q", "origin", "HEAD:main", cwd=seed)
        bin_ = self.tmp / "bin"; bin_.mkdir(); (bin_ / "sleep").write_text("#!/bin/sh\nexit 0\n"); (bin_ / "sleep").chmod(0o755)
        self.env = {**os.environ, "PATH": f"{bin_}{os.pathsep}{os.environ['PATH']}", "GITHUB_STEP_SUMMARY": str(self.tmp / "summary.md"), "GIT_TERMINAL_PROMPT": "0"}

    def step(self):
        return subprocess.run(["bash", "--noprofile", "--norc", "-eo", "pipefail", "-c", self.commit["run"]], cwd=self.run_dir, env=self.env, capture_output=True, text=True)

    def show(self, path):
        return self.g("--git-dir", str(self.tmp / "origin.git"), "show", f"main:{path}").stdout

    def paid(self):
        d = self.run_dir / "data" / "entity_fill"; d.mkdir(parents=True, exist_ok=True)
        (d / "state.json").write_text('{"batches": [{"id": "msgbatch_9"}]}'); (d / "spend.json").write_text('{"usd": 3.5}')

    def test_retry_after_rejection_keeps_other_jobs_spend(self):
        self.paid(); self.rejects.write_text("1")
        r = self.step(); self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("msgbatch_9", self.show("data/entity_fill/state.json")); self.assertIn("9.0", self.show("data/spend.json"))

    def test_final_failure_is_red_and_saved_as_artifact(self):
        self.paid(); self.rejects.write_text("99")
        r = self.step(); self.assertNotEqual(r.returncode, 0); self.assertIn("Push fehlgeschlagen", (self.tmp / "summary.md").read_text())
        art = next(s for s in self.steps if s.get("uses", "").startswith("actions/upload-artifact"))
        self.assertEqual(art["if"], "failure()"); self.assertIn("data/entity_fill", art["with"]["path"])

    def test_no_theirs_and_nothing_outside_entity_fill(self):
        self.assertNotIn("-X theirs", self.commit["run"]); self.assertNotIn("data/spend.json", self.commit["run"])
        r = self.step(); self.assertEqual(r.returncode, 0, r.stderr); self.assertIn("Nichts Neues", (self.tmp / "summary.md").read_text())


# ---------------- 326-7: Sponsor nach dem Schreiben, selbst verwaltete Entitaeten ----------------
class SponsorAndClaim(Base):
    def test_push_and_collect_respect_current_sponsorships(self):
        F.d1_edited([{"id": "hub", "src": "seed", "h": "H"}]); sent = []
        F.push(self.ents, {}, set(), {"hub": dict(GOOD)}, {l: {} for l in F.LANGS}, post=lambda items: sent.append(items) or {"results": []}, spons={"hub"})
        self.assertEqual(sent, [])
        f = F.facts_for(self.e, self.ents); api, _ = self.fake_api([self.ok(f"w_{F.key('hub')}_{F.fhash(f)[:8]}", GOOD)])
        (self.tmp / "en.json").unlink(missing_ok=True)
        with mock.patch.object(F, "api", api): F.collect(self.ents, {}, {"batches": [{"id": "b", "kind": "write", "model": F.MODEL, "est_usd": 0}]}, set(), {"hub"})
        self.assertEqual(F.jload(self.tmp / "en.json", {}), {}, "Sponsor geworden: bezahlter Text wird nicht uebernommen")

    def test_reader_hides_ai_text_of_sponsor_and_owned_counts_as_edited(self):
        with mock.patch.object(FD, "EN", {"hub": dict(GOOD)}), mock.patch.object(FD, "SPONS", {"hub"}):
            self.assertEqual(FD.desc(self.e, "en"), "A hub."); self.assertEqual(FD.long_text(self.e, "en"), ""); self.assertEqual(FD.faq(self.e, "en"), [])
        self.assertEqual(F.d1_edited([{"id": "hub", "src": "owned"}]), {"hub"})
        import site_learn as SL
        items = [{"id": "hub", "src": "owned", "created": 5, "data": {"name": "Hub", "type": "product"}}, {"id": "seeded", "src": "seed", "created": 6, "data": {"name": "S", "type": "product"}}]
        with mock.patch.object(SL, "_fetch_json", lambda url, *a, **k: {"items": items}), mock.patch.object(SL, "merged_ids", lambda: set()):
            recs = SL.load_entities("https://api.test")
        self.assertEqual((recs["hub"].get("edited"), recs["seeded"].get("edited"), recs["seeded"].get("dbrev")), (5, None, 6))


# ---------------- 326-3: KI-Text nach push weiter gekennzeichnet, Uebersetzung statt englischem KI-Text ----------------
class AiAfterPush(Base):
    def test_pushed_ai_long_is_marked_and_translations_win(self):
        fr = {"long": "Contoso Hub est un produit.", "desc": "Contoso Hub est un service pour les documents.", "sh": {"long": FD.src_hash(LONG), "desc": FD.src_hash(GOOD["desc"])}}
        pushed = ent("hub", desc={"en": GOOD["desc"], "de": ""}, long={"en": LONG.replace(". ", ".  ")}, faq={"en": GOOD["faq"]}, dbrev=5)   # so steht er nach push in D1
        with mock.patch.object(FD, "EN", {"hub": dict(GOOD)}), mock.patch.object(FD, "I18N", {"fr": {"hub": fr}}), mock.patch.object(FD, "GEN", {}), \
             mock.patch.dict(SE.GENTEXT, clear=True), mock.patch.dict(SE.EVENTS, clear=True):
            self.assertEqual(SE.long_for(pushed, "en"), (LONG, True), "KI-Text gilt nicht als redaktionell")
            self.assertEqual(SE.long_for(pushed, "fr"), ("Contoso Hub est un produit.", True), "bezahlte Uebersetzung statt englischem KI-Text")
            self.assertTrue(FD.desc_is_ai(pushed, "en", FD.desc(pushed, "en"))); self.assertTrue(FD.desc_is_ai(pushed, "fr", FD.desc(pushed, "fr")))
            self.assertTrue(all(x["ai"] for x in FD.faq(pushed, "en")))
            human = {**pushed, "long": {"en": "Editorial text."}}
            self.assertEqual(SE.long_for(human, "fr"), ("Editorial text.", False))
            self.assertFalse(FD.desc_is_ai(ent("hub", desc={"en": "x" * 100}), "en", "x" * 100))


# ---------------- 326-10: veraltete Uebersetzungen (translate-once, stale.json) ----------------
class Stale(Base):
    def test_changed_source_hides_translation_lists_it_and_retranslates_only_on_request(self):
        fill = {"hub": dict(GOOD)}; i18n = {l: {} for l in F.LANGS}
        i18n["fr"]["hub"] = {"desc": "Contoso Hub est un service.", "sh": {"desc": FD.src_hash(GOOD["desc"])}}
        with mock.patch.object(FD, "EN", fill), mock.patch.object(FD, "I18N", {"fr": i18n["fr"]}), mock.patch.object(FD, "GEN", {}):
            self.assertEqual(FD.desc(self.e, "fr"), "Contoso Hub est un service.")
            edited_desc = "Contoso Hub is the editorial description of the document service, written by the team."
            e2 = ent("hub", desc={"en": edited_desc, "de": ""})
            self.assertEqual(FD.desc(e2, "fr"), edited_desc, "Uebersetzung des alten KI-Texts wird nicht mehr gezeigt")
            self.assertFalse(FD.has_text(e2, "fr"))
        ents = {"hub": e2}
        self.assertEqual(F.stale_report(ents, {}, fill, i18n), {"fr": {"hub": ["desc"]}})
        self.assertEqual(F.jload(self.tmp / "stale.json", {}), {"fr": {"hub": ["desc"]}})
        src = F.effective_en(e2, {}, fill)
        self.assertNotIn("desc", F.translate_need(e2, "fr", src, {}, i18n)); self.assertIn("desc", F.translate_need(e2, "fr", src, {}, i18n, restale=True))
        # bezahltes Ergebnis eines --stale-Laufs ersetzt die veraltete Fassung
        part = {"desc": src["desc"]}; cid = f"t_fr_{F.key('hub')}_{F.hsh(part)[:6]}"
        for l, v in i18n.items():
            if v: F.jsave(self.tmp / "i18n" / f"{l}.json", v)
        F.jsave(self.tmp / "en.json", fill)
        api, _ = self.fake_api([self.ok(cid, {"desc": "Contoso Hub est la description rédactionnelle du service de documents, écrite par l'équipe."})])
        with mock.patch.object(F, "api", api), mock.patch.object(ai_gateway, "report_usage", lambda *a, **k: None):
            F.collect(ents, {}, {"batches": [{"id": "b", "kind": "translate", "model": F.TMODEL, "est_usd": 0}]}, set())
        rec = F.jload(self.tmp / "i18n" / "fr.json", {})["hub"]
        self.assertIn("rédactionnelle", rec["desc"]); self.assertEqual(rec["sh"]["desc"], FD.src_hash(edited_desc))
        self.assertEqual(F.stale_report(ents, {}, fill, {"fr": {"hub": rec}}), {})


# ---------------- Zweite Gegenpruefung von #326: Restpunkte ----------------
class SecondRound(Base):
    def test_sponsor_after_push_keeps_ai_label_and_hides_ai_long(self):
        pushed = ent("hub", desc={"en": GOOD["desc"], "de": ""}, long={"en": LONG}, dbrev=5)
        for e in (pushed, {**pushed, "aif": ["desc.en", "long.en"]}):   # Wortlaut-Vergleich (aelterer Worker) und Herkunft aus dem Export
            with mock.patch.object(FD, "EN", {"hub": dict(GOOD)}), mock.patch.object(FD, "I18N", {}), mock.patch.object(FD, "SPONS", {"hub"}), \
                 mock.patch.dict(SE.GENTEXT, clear=True), mock.patch.dict(SE.EVENTS, clear=True):
                self.assertEqual(SE.long_for(e, "en"), ("", False), "Sponsor: KI-Langtext erscheint gar nicht")
                self.assertEqual(SE.long_for(e, "fr"), ("", False))
                self.assertTrue(FD.desc_is_ai(e, "en", FD.desc(e, "en")), "KI-Beschreibung bleibt gekennzeichnet")
                self.assertTrue(FD.is_ai(e, "long", "en")); self.assertEqual(FD.faq(e, "en"), [])

    def test_only_priced_models_and_family_prices(self):
        self.assertEqual((F.price("claude-sonnet-5-5"), F.price("claude-haiku-5-5")), ((2.0, 10.0), (0.10, 0.50)))
        self.assertEqual((F.price("claude-opus-5-5"), F.price("claude-fable-5-2"), F.price("claude-haiku-4-5")), ((4.0, 20.0), (8.0, 40.0), (1.0, 5.0)))
        self.assertAlmostEqual(F.cost_cap("claude-fable-5-2", 1000, 1000), 4 * F.cost_cap("claude-sonnet-5-5", 1000, 1000))
        for bad in ("claude-opus-9", "gpt-x", ""):
            with self.assertRaises(SystemExit): F.price(bad)
        with self.assertRaises(SystemExit): F.check_models("claude-fable-9", "claude-haiku-5-5")
        with self.assertRaises(SystemExit): F.check_models("claude-sonnet-5-5", "claude-sonnet-5-5")   # Uebersetzen nur mit Haiku (Tagesbudget)
        F.check_models("claude-opus-5-5", "claude-haiku-5-5")
        with mock.patch.object(sys, "argv", ["fill_entities.py", "plan", "--model", "claude-unknown-1"]), self.assertRaises(SystemExit) as cm:
            F.main()
        self.assertIn("Unbekanntes Modell", str(cm.exception))

    def test_haiku_day_budget_counts_open_translate_batches(self):
        state = {"batches": [{"kind": "translate", "est_usd": 3.5, "ids": []}, {"kind": "write", "est_usd": 20, "ids": []}]}
        with mock.patch.object(ai_gateway, "remaining_eur", lambda job, model: 5.0):
            self.assertAlmostEqual(F.haiku_room_usd(state), 1.5, msg="offener Haiku-Batch (noch nicht gemeldet) geht vom Tagesrest ab")
            self.assertAlmostEqual(F.haiku_room_usd({"batches": []}), F.HAIKU_RUN_EUR)
        with mock.patch.object(ai_gateway, "remaining_eur", lambda job, model: 2.0):
            self.assertEqual(F.haiku_room_usd(state), 0.0)
        seen = []
        api, _ = self.fake_api([])
        with mock.patch.object(F, "api", api), mock.patch.object(ai_gateway, "check_budget", lambda job, model, est: seen.append(est) or True):
            F.submit([{"custom_id": f"t_fr_{F.key('hub')}_abcdef", "params": {}}], 0.5, "translate", F.TMODEL, state)
        self.assertAlmostEqual(seen[0], 4.0, msg="Pruefung im Worker mit neuem UND offenem Batch")

    def test_truncated_ai_text_is_marked_by_provenance_and_never_pushed_truncated(self):
        de_long = ("Contoso Hub ist ein Produkt fuer die Ablage von Teamdokumenten in Microsoft 365. " * 45).strip()   # > 3000 Zeichen
        self.assertGreater(len(de_long), FD.WORKER_MAX["long"])
        cut = de_long[:3000]   # so speichert der Worker ihn (longTxt ... slice)
        de = {"long": de_long, "desc": "Contoso Hub ist ein Dienst.", "sh": {"long": FD.src_hash(LONG), "desc": FD.src_hash(GOOD["desc"])}}
        e = ent("hub", desc={"en": GOOD["desc"], "de": "Contoso Hub ist ein Dienst."}, long={"en": LONG, "de": cut}, dbrev=5)
        with mock.patch.object(FD, "EN", {"hub": dict(GOOD)}), mock.patch.object(FD, "I18N", {"de": {"hub": de}}), mock.patch.object(FD, "GEN", {}), \
             mock.patch.dict(SE.GENTEXT, clear=True), mock.patch.dict(SE.EVENTS, clear=True):
            self.assertTrue(FD.is_ai(e, "long", "de"), "gekuerzter KI-Text (aelterer Worker): Anfang des KI-Texts genuegt")
            self.assertEqual(SE.long_for(e, "de"), (de_long, True), "vollstaendige Uebersetzung mit KI-Hinweis statt des abgeschnittenen Texts")
            prov = {**e, "aif": ["desc.en", "long.en", "long.de"]}
            self.assertTrue(FD.is_ai(prov, "long", "de")); self.assertFalse(FD.is_ai(prov, "desc", "de"), "Herkunft aus dem Export gilt, nicht der Wortlaut")
            self.assertFalse(FD.is_ai({**e, "aif": []}, "long", "de"))
        item = F.payload_for("hub", {"hub": dict(GOOD)}, {"de": {"hub": de}, "fr": {"hub": {"long": de_long, "desc": "Contoso Hub est un service."}}})
        self.assertNotIn("long", item["de"]); self.assertEqual(item["de"]["desc"], "Contoso Hub ist ein Dienst."); self.assertEqual(item["tr"]["fr"], {"desc": "Contoso Hub est un service."})
        self.assertIn("long", item)
        self.assertFalse(FD.fits("desc", "x" * 301)); self.assertFalse(FD.fits("desc", "\U0001F600" * 151), "Laenge wie in JavaScript (UTF-16)")
        self.assertFalse(FD.fits("faq", [{"q": "q", "a": "a" * 601}])); self.assertTrue(FD.fits("faq", GOOD["faq"]))
        import site_learn as SL
        items = [{"id": "hub", "src": "ai", "created": 5, "aif": ["long.de"], "data": {"name": "Hub", "type": "product"}}, {"id": "old", "src": "seed", "created": 6, "data": {"name": "O", "type": "product"}}]
        with mock.patch.object(SL, "_fetch_json", lambda url, *a, **k: {"items": items}), mock.patch.object(SL, "merged_ids", lambda: set()):
            recs = SL.load_entities("https://api.test")
        self.assertEqual((recs["hub"].get("aif"), "aif" in recs["old"]), (["long.de"], False))

    def test_translations_from_autotr_are_reused_not_bought(self):
        ed = "Contoso Hub is the editorial description of the document service for Microsoft 365 teams."
        e = ent("hub", desc={"en": ed, "de": ""}); ents = {"hub": e}
        F.d1_edited([{"id": "hub", "src": "seed", "h": "H", "data": {"desc": {"en": ed, "de": ""}}}])
        i18n = {l: {} for l in F.LANGS}
        tr = {"hub": {"desc": {"fr": "Contoso Hub est la description du service.", "xx": "?", "es": " "}}, "ghost": {"desc": {"fr": "x"}}}
        self.assertEqual(F.adopt_ent_tr(ents, {}, {}, i18n, tr), {"fr"})
        rec = i18n["fr"]["hub"]; self.assertEqual(rec["desc"], "Contoso Hub est la description du service."); self.assertEqual(rec["sh"]["desc"], FD.src_hash(ed))
        src = F.effective_en(e, {}, {})
        self.assertNotIn("desc", F.translate_need(e, "fr", src, {}, i18n)); self.assertIn("desc", F.translate_need(e, "es", src, {}, i18n))
        todo, _ = F.build_todo(ents, {}, {}, i18n, set(), set(), {})
        self.assertNotIn("fr", todo[0]["translate"]); self.assertIn("es", todo[0]["translate"])
        # Quelle anders (D1-Text weicht vom englischen Quelltext ab) oder vorhandene Uebersetzung: nichts uebernehmen
        F.d1_edited([{"id": "hub", "src": "seed", "h": "H", "data": {"desc": {"en": "Older text of the hub.", "de": ""}}}])
        i18n2 = {l: {} for l in F.LANGS}; self.assertEqual(F.adopt_ent_tr(ents, {}, {}, i18n2, tr), set())
        F.d1_edited([{"id": "hub", "src": "seed", "h": "H", "data": {"desc": {"en": ed, "de": ""}}}])
        i18n3 = {l: {} for l in F.LANGS}; i18n3["fr"]["hub"] = {"desc": "Eigene Fassung", "sh": {"desc": FD.src_hash(ed)}}
        self.assertEqual(F.adopt_ent_tr(ents, {}, {}, i18n3, tr), set()); self.assertEqual(i18n3["fr"]["hub"]["desc"], "Eigene Fassung")
        self.assertEqual(F.adopt_ent_tr(ents, {}, {}, {l: {} for l in F.LANGS}, tr, edited={"hub"}), set())
        self.assertEqual(F.adopt_ent_tr(ents, {}, {}, {l: {} for l in F.LANGS}, tr, spons={"hub"}), set())


if __name__ == "__main__":
    unittest.main()
