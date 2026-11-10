"""Uebersetzung (PR #315): Segment-TM nur im Speicher, Quell-Hashes je Einheit, veraltet statt Neuuebersetzung, Handtexte der Redaktion als reine Leseschicht
(i18n_overrides, Vertrag mit #319). Alle Laeufe gehen ueber eine nachgebaute Batch-API - keine Netz- und keine API-Aufrufe."""
import contextlib
import io
import json
import os
import re
import shutil
import sys
import tempfile
import unittest
import urllib.error
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

import i18n_overrides as OV
import translate_blog as TB
import translate_show as TS
from tm_hash import fields_hash, norm, unit_hash

try: import translate_notes as TN
except ImportError: TN = None   # braucht das Paket requests (Spreaker-Ranking); ohne es entfaellt nur der Durchlauf der Show Notes

ROOT = Path(__file__).resolve().parent.parent
PARAS = [f"Paragraph number {i} talks about Microsoft 365 governance in some detail for admins." for i in range(1, 9)]
OLD = "2026-06-01T00:00:00+00:00"   # aelter als NEW_DAYS: der geplante auto-Lauf waehlt so einen Beitrag nicht aus
NEW4 = "A completely new fourth paragraph about Copilot rollout plans."
EVIL = 'Handtext <svg/onload=alert(1)> Ende <img/src=x/onerror=alert(2)><script>alert(3)</script>'


def post(paras=PARAS, slug="a-post", title="A title for the post", iso=None):
    return {"slug": slug, "title": title, "desc": "Short description of the post.", "html": "".join(f"<p>{x}</p>" for x in paras),
            "iso": iso or datetime.now(timezone.utc).isoformat()}


class FakeBatch:
    """Nachbau der Message-Batch-API fuer translate_blog.api: nimmt Batches an, meldet sie sofort als fertig und 'uebersetzt' jede Einheit zu '<lang><gen>:<quelle>'."""

    def __init__(self):
        self.gen = "V1"; self.batches = {}; self.fail = set()   # fail: Einheiten-ids, deren Antwort die QA nicht besteht (leer)

    def __call__(self, method, path, body=None, raw=False):
        if method == "POST":
            bid = f"b{len(self.batches) + 1}"; self.batches[bid] = body["requests"]; return {"id": bid}
        if path.startswith("/v1/messages/batches/"):
            return {"processing_status": "ended", "request_counts": {}, "results_url": "results:" + path.rsplit("/", 1)[1]}
        out = []
        for r in self.batches[path.split(":", 1)[1]]:
            lang = r["custom_id"].split("_")[0]
            text = "\n".join(f"[[{i}]] " + ("" if i in self.fail else f"{lang}{self.gen}:{t}") for i, t in re.findall(r"^\[\[(\w+)\]\] (.*)$", r["params"]["messages"][0]["content"], re.M))
            out.append(json.dumps({"custom_id": r["custom_id"], "result": {"type": "succeeded", "message": {"usage": {"input_tokens": 100, "output_tokens": 50}, "stop_reason": "end_turn", "content": [{"type": "text", "text": text}]}}}))
        return "\n".join(out).encode()

    def sent(self, bid=None):
        """ids der gesendeten Einheiten (eines Batches oder des letzten)."""
        reqs = self.batches[bid or f"b{len(self.batches)}"] if self.batches else []
        return [i for r in reqs for i in re.findall(r"^\[\[(\w+)\]\]", r["params"]["messages"][0]["content"], re.M)]


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp()); self.addCleanup(shutil.rmtree, self.tmp, True)
        self.api = FakeBatch()
        for obj, name, val in ((TB, "OUT", self.tmp / "blog_i18n"), (TB, "WORK", self.tmp / "work"), (TB, "_SRC", {}), (TB, "BY_SLUG", {}), (TB, "BY_KEY", {}), (TB, "QUEUE", {}), (TB, "WISH", {}),
                               (TB, "LANGS", ("de", "fr")), (TB, "api", self.api), (TB, "check_budget", lambda *a, **k: True), (TB, "report_usage", lambda *a, **k: None),
                               (OV, "DIR", self.tmp / "ov"), (TS, "OUT", self.tmp / "pi18n"), (TB.time, "sleep", lambda s: None)):
            p = patch.object(obj, name, val); p.start(); self.addCleanup(p.stop)
        p = patch.dict(os.environ, {"ANTHROPIC_API_KEY": "test"}); p.start(); self.addCleanup(p.stop)
        for k in ("COMMUNITY_API", "I18N_OVERRIDES_API", "CRON_KEY"): os.environ.pop(k, None)
        OV.use_api(""); self.addCleanup(OV.use_api, "")

    def args(self, *argv):
        with patch.object(sys, "argv", ["translate_blog.py", *argv]): return TB.args()

    def run_blog(self, posts, *argv):
        """Ein ganzer Lauf wie im Workflow: python translate_blog.py <argv> (settle -> collect -> submit -> collect -> status)."""
        with patch.object(TB, "posts", lambda: list(posts)), patch.object(sys, "argv", ["translate_blog.py", *argv]): TB.main()

    def rec(self, lang="de", slug="a-post"): return TB.load_lang(lang).get(slug)

    def html(self, p, lang="de"):
        r = TB.assemble(p, self.rec(lang, p["slug"]), lang)
        return r[2] if r else None

    def stale(self): return json.loads((TB.OUT / "stale.json").read_text("utf-8"))

    def overrides(self, kind, lang, items):
        f = OV.DIR / kind / f"{lang}.json"; f.parent.mkdir(parents=True, exist_ok=True); f.write_text(json.dumps(items, ensure_ascii=False), encoding="utf-8"); OV.clear_cache()

    @contextlib.contextmanager
    def export(self, items=None, status=0, only=None):
        """Export der Redaktion wie im Workflow (COMMUNITY_API gesetzt, Vertrag 3): items {(kind, lang): {item: {unit: {t, sh}}}}; status = HTTP-Fehler, den jede
        Abfrage bekommt (only: nur diese Sprachen). Die Abfragen stehen in self.asked."""
        self.asked = []

        def get(path, timeout=20):
            self.asked.append(path); q = dict(urllib.parse.parse_qsl(path.split("?", 1)[1])) if "?" in path else {}
            if status and (not only or q.get("lang") in only): raise urllib.error.HTTPError(path, status, "Fehler", {}, None)
            if "/retranslate" in path: return {"items": []}
            return {"kind": q["kind"], "lang": q["lang"], "items": (items or {}).get((q["kind"], q["lang"]), {})}
        with patch.object(OV, "_get", get), patch.dict(os.environ, {"COMMUNITY_API": "https://api.example.test"}):
            try: OV.use_api(); yield
            finally: OV.use_api("")

    def hand(self, unit, source, text, slug="a-post", lang="de"):
        """Handtext der Redaktion fuer eine Blog-Einheit, verankert am Quelltext, den der Editor vor sich hatte (Vertrag 2)."""
        self.overrides("lblog", lang, {slug: {unit: {"t": text, "sh": OV.anchor("lblog", unit, source)}}})

    def legacy(self, p, lang="de", seg=None):
        """Datensatz wie vor #315 (ohne sh), vollstaendig uebersetzt."""
        tpl, units, h = TB.source_of(p); have = TB.load_lang(lang)
        have[p["slug"]] = {"h": h, "n": len(units), "seg": seg or {i: f"{lang}V0:{t}" for i, t in units}, "ok": True, "m": "old", "ts": "2026-01-01"}
        TB.save_lang(lang, have); return have[p["slug"]]


# ---------------- Blog: Quell-Hashes, veraltet statt Neuuebersetzung ----------------
class StaleInsteadOfRetranslation(Base):
    def test_whitespace_only_change_reuses(self):
        self.assertEqual(unit_hash("1", "a  b\n c"), unit_hash("1", " a b c "))
        self.assertNotEqual(unit_hash("1", "x"), unit_hash("T", "x")); self.assertEqual(norm("a\t b"), "a b")

    def test_first_run_translates_once_and_stores_source_hashes(self):
        p = post(); self.run_blog([p], "run", "--langs", "de")
        rec = self.rec(); tpl, units, h = TB.source_of(p)
        self.assertTrue(rec["ok"]); self.assertEqual(rec["seg"]["1"], "deV1:" + PARAS[0])
        self.assertEqual(rec["sh"], {i: unit_hash(i, t)[:8] for i, t in units})
        self.assertEqual(self.api.sent(), ["T", "D"] + [str(i) for i in range(1, 9)])
        self.run_blog([p], "run", "--langs", "de")
        self.assertEqual(len(self.api.batches), 1)   # nichts offen: kein zweiter Batch

    def test_changed_source_is_stale_and_never_sent_automatically(self):
        p = post(); self.run_blog([p], "run", "--langs", "de")
        edited = list(PARAS); edited[3] = NEW4; p2 = post(edited)
        for mode in ("auto", "run"):
            self.run_blog([p2], mode, "--langs", "de")
        self.assertEqual(len(self.api.batches), 1)   # kein API-Aufruf: eine vorhandene Uebersetzung wird nie automatisch ersetzt
        self.assertEqual(self.rec()["seg"]["4"], "deV1:" + PARAS[3])   # alter Text bleibt stehen
        self.assertIn("deV1:" + PARAS[3], self.html(p2))
        self.assertEqual(self.stale(), {"de": {"a-post": ["4"]}})

    def test_stale_mode_sends_only_changed_units_and_keeps_the_rest(self):
        p = post(); self.run_blog([p], "run", "--langs", "de")
        edited = list(PARAS); edited[3] = NEW4; edited[6] = "Another rewritten paragraph seven about Entra conditional access."
        p2 = post(edited); self.api.gen = "V2"
        self.run_blog([p2], "stale", "--langs", "de", "--slugs", "a-post")
        self.assertEqual(sorted(self.api.sent()), ["4", "7"])
        rec = self.rec()
        self.assertEqual(rec["seg"]["4"], "deV2:" + NEW4); self.assertEqual(rec["seg"]["1"], "deV1:" + PARAS[0])
        self.assertEqual(self.stale(), {})
        tpl, units, h = TB.source_of(p2)
        self.assertFalse(TB.store(rec, "1", dict(units)["1"], "x"))   # aktuelle Einheit wird nie ueberschrieben

    def test_inserted_paragraph_remaps_ids(self):
        p = post(); self.run_blog([p], "run", "--langs", "de")
        ins = PARAS[:2] + ["Brand new inserted paragraph about Purview labels for everyone."] + PARAS[2:]
        p2 = post(ins); tpl, units, h = TB.source_of(p2)
        rec, dirty = TB.resolve("de", p2, units, h, TB.load_lang("de"))
        self.assertTrue(dirty)
        self.assertEqual(TB.open_units(rec, units, h), [("3", ins[2])]); self.assertEqual(TB.stale_ids(rec, units, h), [])
        for k in range(4, 10): self.assertEqual(rec["seg"][str(k)], "deV1:" + PARAS[k - 2])   # alte Absaetze 3..8 stehen jetzt unter 4..9

    def test_qa_failed_unit_is_stored_nowhere(self):
        p = post(); self.api.fail = {"5"}; self.run_blog([p], "run", "--langs", "de")
        rec = self.rec(); have = TB.load_lang("de")
        self.assertNotIn("5", rec["seg"]); self.assertFalse(rec["ok"]); self.assertEqual(rec["tries"], 1)
        tm = TB.TM("de", have, [p])
        self.assertIsNone(tm.get(unit_hash("5", PARAS[4]))); self.assertEqual(tm.get(unit_hash("4", PARAS[3])), "deV1:" + PARAS[3])
        ok, why, _ = TB.qa("de", "This <strong>text</strong> has a tag that must survive the translation step intact.", "Dieser Text hat kein Tag mehr und ist deshalb ungueltig im Test.")
        self.assertFalse(ok); self.assertEqual(why, "html-tags")

    def test_assemble_reads_seg_like_before(self):
        p = post(); self.run_blog([p], "run", "--langs", "de")
        t, d, html, faq = TB.assemble(p, self.rec())
        self.assertTrue(t.startswith("deV1:")); self.assertIn("<p>deV1:Paragraph number 2", html)


# ---------------- 315-2 / 315-TM-1: --redo ----------------
class Redo(Base):
    def test_submit_redo_then_collect_stores_the_new_translation(self):
        p = post(); self.run_blog([p], "run", "--langs", "de")
        self.api.gen = "V2"
        with patch.object(TB, "posts", lambda: [p]):
            TB.BY_KEY[TB.key("a-post")] = p
            n = TB.submit(self.args("run", "--langs", "de", "--slugs", "a-post", "--redo"))
            self.assertGreater(n, 0); self.assertEqual(len(self.api.sent()), 10)
            self.assertTrue(json.loads((TB.OUT / "batches.json").read_text())[0]["items"][0]["redo"])
            rec = self.rec()   # der gespeicherte Datensatz wird nicht geleert: die Seite bleibt, bis die neue Fassung da ist
            self.assertTrue(rec["ok"]); self.assertEqual(rec["seg"]["1"], "deV1:" + PARAS[0])
            self.assertIsNotNone(TB.assemble(p, rec, "de"))
            TB.collect()
        rec = self.rec()
        self.assertEqual({i: t[:5] for i, t in rec["seg"].items()}, {i: "deV2:" for i in rec["seg"]})   # bezahlt UND gespeichert
        self.assertTrue(rec["ok"])
        self.assertEqual(json.loads((TB.OUT / "usage.json").read_text())["runs"][-1]["segments_ok"], 10)

    def test_redo_through_main_and_failed_units_keep_the_old_text(self):
        p = post(); self.run_blog([p], "run", "--langs", "de")
        self.api.gen = "V2"; self.api.fail = {"3"}
        self.run_blog([p], "run", "--langs", "de", "--slugs", "a-post", "--redo")
        rec = self.rec()
        self.assertEqual(rec["seg"]["2"], "deV2:" + PARAS[1])
        self.assertEqual(rec["seg"]["3"], "deV1:" + PARAS[2]); self.assertTrue(rec["ok"])   # QA-Fehler: alter Text bleibt, Seite verschwindet nicht

    def test_prepare_redo_then_apply_stores_the_agent_output(self):
        p = post(); self.run_blog([p], "run", "--langs", "de")
        with patch.object(TB, "posts", lambda: [p]):
            TB.BY_SLUG["a-post"] = p
            TB.prepare(self.args("prepare", "--langs", "de", "--slugs", "a-post", "--redo"))
            fin = TB.WORK / "de" / f"{TB.key('a-post')}.in.txt"; head, body = fin.read_text("utf-8").split("\n", 1)
            self.assertTrue(json.loads(head[2:])["redo"]); asked = TB.parse(body); self.assertEqual(len(asked), 10)
            self.assertEqual(self.rec()["seg"]["1"], "deV1:" + PARAS[0])
            fin.with_name(fin.name.replace(".in.txt", ".out.txt")).write_text("\n".join(f"[[{i}]] deAG:{t}" for i, t in asked.items() if i != "8") + "\n", encoding="utf-8")
            st = TB.apply({})
        self.assertEqual(st["de"]["segmente_ok"], 9)
        rec = self.rec()
        self.assertEqual(rec["seg"]["1"], "deAG:" + PARAS[0]); self.assertEqual(rec["seg"]["8"], "deV1:" + PARAS[7])
        self.assertEqual(list(TB.parse(fin.read_text("utf-8").split("\n", 1)[1])), ["8"])   # nicht gelieferte Einheit bleibt im Auftrag


# ---------------- 315-7 / 315-TM-2: TM nur im Speicher, Altbestand ohne Neuschreiben ----------------
class MemoryOnlyTM(Base):
    def test_tm_is_built_from_records_and_never_written(self):
        p, q = post(), post(PARAS[:3] + ["Some other closing paragraph that only the second post has, about Fabric."], slug="b-post")
        self.run_blog([p, q], "run", "--langs", "de")
        have = TB.load_lang("de"); tm = TB.TM("de", have, [p, q])
        self.assertIsNone(tm.d)   # erst beim ersten Nachschlagen gebaut
        self.assertEqual(tm.get(unit_hash("1", PARAS[0])), "deV1:" + PARAS[0]); self.assertEqual(len(tm), 11)   # T, D, 8 + 1 Absatz (gleiche Einheiten nur einmal)
        self.assertFalse((TB.OUT / "tm").exists())
        self.assertFalse(hasattr(TB, "save_tm")); self.assertFalse(hasattr(TB, "migrate"))
        self.assertIn("data/blog_i18n/tm/", (ROOT / ".gitignore").read_text("utf-8").split())

    def test_tm_skips_stale_text(self):
        p = post(); self.run_blog([p], "run", "--langs", "de")
        edited = list(PARAS); edited[3] = NEW4; p2 = post(edited); self.run_blog([p2], "auto", "--langs", "de")
        tm = TB.TM("de", TB.load_lang("de"), [p2])
        self.assertIsNone(tm.get(unit_hash("4", NEW4)))   # der alte Text gehoert nicht zum neuen Quelltext
        self.assertIsNone(tm.get(unit_hash("4", PARAS[3]))); self.assertEqual(tm.get(unit_hash("3", PARAS[2])), "deV1:" + PARAS[2])

    def test_fully_reused_article_becomes_ok_without_api(self):
        p = post(); self.run_blog([p], "run", "--langs", "de")
        q = post(PARAS[2:5], slug="b-post", title=p["title"])   # jede Einheit steht schon uebersetzt im Bestand
        self.run_blog([p, q], "run", "--langs", "de")
        self.assertEqual(len(self.api.batches), 1)
        rec = self.rec(slug="b-post"); self.assertTrue(rec["ok"]); self.assertEqual(rec["m"], "tm"); self.assertEqual(rec["seg"]["1"], "deV1:" + PARAS[2])

    def test_partly_reused_article_sends_only_unknown_units(self):
        p = post(); self.run_blog([p], "run", "--langs", "de")
        q = post(PARAS[:2] + ["One paragraph nobody has translated before, about Sentinel."], slug="b-post", title="Another title")
        self.run_blog([p, q], "run", "--langs", "de")
        self.assertEqual(self.api.sent(), ["T", "3"])

    def test_legacy_records_get_a_snapshot_instead_of_a_rewrite(self):
        p = post(iso=OLD); self.legacy(p, "de"); self.legacy(p, "fr")
        before = {f: f.read_bytes() for f in TB.OUT.glob("*/*.json.gz")}
        with patch.object(TB, "posts", lambda: [p]): self.assertEqual(TB.settle([p]), 0)
        self.assertEqual({f: f.read_bytes() for f in before}, before)   # keine Schale neu geschrieben, nur der Schnappschuss kommt dazu
        snap = sorted(f.relative_to(TB.OUT).as_posix() for f in TB.OUT.glob("srch/*.json.gz"))
        self.assertEqual(snap, [f"srch/{TB.bucket('a-post'):02x}.json.gz"])
        self.assertFalse((TB.OUT / "tm").exists())
        TB._SNAP.clear()   # naechster Lauf (neuer Prozess): Original geaendert
        edited = list(PARAS); edited[3] = NEW4; p2 = post(edited, iso=OLD)
        self.assertEqual(TB.settle([p2]), 2)
        for lang in ("de", "fr"):
            rec = self.rec(lang); tpl, units, h = TB.source_of(p2)
            self.assertEqual(rec["h"], h); self.assertTrue(rec["ok"]); self.assertEqual(rec["seg"]["4"], f"{lang}V0:" + PARAS[3])
            self.assertEqual(TB.stale_ids(rec, units, h), ["4"]); self.assertEqual(rec["m"], "old")
        self.assertEqual(len(self.api.batches), 0)

    def test_legacy_record_without_snapshot_stays_untouched(self):
        p = post(iso=OLD); old = dict(self.legacy(p, "de"))
        edited = list(PARAS); edited[3] = NEW4; p2 = post(edited, iso=OLD)
        self.assertEqual(TB.settle([p2]), 0)   # Original schon vor dem ersten Lauf geaendert: keine Zuordnung moeglich
        self.assertEqual(self.rec(), old); self.assertIsNone(TB.assemble(p2, self.rec(), "de"))
        self.run_blog([p2], "auto", "--langs", "de")   # aelter als NEW_DAYS: der Zeitplan fasst ihn nicht an
        self.assertEqual(len(self.api.batches), 0); self.assertEqual(self.rec(), old)
        st = json.loads((TB.OUT / "status.json").read_text()); self.assertEqual(st["langs"]["de"]["done"], 0)


# ---------------- 315-6: gespeicherter Stand, Status und Seite passen zusammen ----------------
class StoredStateMatchesStatus(Base):
    def test_old_post_with_changed_source_stays_visible_and_is_saved(self):
        p = post(iso=OLD); self.run_blog([p], "run", "--langs", "de")
        edited = list(PARAS); edited[1] = "Paragraph two was rewritten in the English original, about Loop."; p2 = post(edited, iso=OLD)
        self.assertIsNotNone(TB.assemble(p2, self.rec(), "de"))   # schon der Seitenbau ordnet zu (im Speicher), auch ohne Uebersetzungslauf
        self.run_blog([p2], "auto", "--langs", "de")
        tpl, units, h = TB.source_of(p2); rec = self.rec()
        self.assertEqual(rec["h"], h); self.assertTrue(rec["ok"])   # gespeichert, nicht nur gerechnet
        self.assertIn("deV1:" + PARAS[1], self.html(p2))
        st = json.loads((TB.OUT / "status.json").read_text())
        self.assertEqual((st["langs"]["de"]["done"], st["langs"]["de"]["open"]), (1, 0)); self.assertEqual(self.stale(), {"de": {"a-post": ["2"]}})
        self.assertEqual(len(self.api.batches), 1)

    def test_old_post_with_new_paragraph_gets_only_that_paragraph_translated(self):
        p = post(iso=OLD); never = post(PARAS[:2] + ["Unique text of a post nobody finished, about Planner."], slug="z-post", title="Unfinished", iso=OLD)
        self.run_blog([p], "run", "--langs", "de")
        tpl, zu, zh = TB.source_of(never); have = TB.load_lang("de")
        have["z-post"] = {"h": zh, "n": len(zu), "seg": {"T": "x"}, "sh": {"T": unit_hash("T", "Unfinished")[:8]}, "ok": False}; TB.save_lang("de", have)
        ins = PARAS[:2] + ["Brand new inserted paragraph about Purview labels for everyone."] + PARAS[2:]; p2 = post(ins, iso=OLD)
        with patch.object(TB, "posts", lambda: [p2, never]): TB.settle([p2, never])
        self.assertTrue(self.rec()["gap"]); self.assertFalse(self.rec()["ok"])
        self.run_blog([p2, never], "auto", "--langs", "de")
        self.assertEqual(self.api.sent(), ["3"])   # nur der neue Absatz des schon uebersetzten Beitrags; der nie fertige alte Beitrag bleibt dem Zeitplan fern
        rec = self.rec(); self.assertTrue(rec["ok"]); self.assertNotIn("gap", rec)
        self.assertIn("deV1:Brand new inserted paragraph", self.html(p2)); self.assertEqual(self.stale(), {})

    def test_status_counts_only_what_is_stored(self):
        p = post(iso=OLD); self.run_blog([p], "run", "--langs", "de")
        q = post(PARAS[2:5], slug="b-post", title=p["title"], iso=OLD)   # waere allein aus dem TM vollstaendig, ist aber nicht gespeichert
        self.run_blog([p, q], "auto", "--langs", "de")
        st = json.loads((TB.OUT / "status.json").read_text())
        self.assertEqual((st["langs"]["de"]["done"], st["langs"]["de"]["open"]), (1, 1)); self.assertIsNone(self.rec(slug="b-post"))

    def test_plan_does_not_touch_the_store(self):
        p = post(iso=OLD); self.run_blog([p], "run", "--langs", "de")
        edited = list(PARAS); edited[1] = "Paragraph two was rewritten in the English original, about Loop."; p2 = post(edited, iso=OLD)
        before = {f: f.read_bytes() for f in TB.OUT.glob("de/*.json.gz")}
        self.run_blog([p2], "plan")
        self.assertEqual({f: f.read_bytes() for f in before}, before)
        self.assertEqual(self.stale(), {"de": {"a-post": ["2"]}})   # aber derselbe Blick wie der Seitenbau


# ---------------- 315-TM-4: ersetzter Absatz mit TM-Treffer ----------------
class ReplaceWithTmHit(Base):
    def test_replaced_paragraph_takes_the_exact_tm_hit(self):
        a = post(PARAS[:3], iso=OLD); b = post(["Y paragraph that is only in the other post, about Viva.", "X boilerplate call to action: subscribe to the M365.FM podcast today.", PARAS[7]], slug="b-post", title="Other", iso=OLD)
        self.run_blog([a, b], "run", "--langs", "de")
        a2 = post([PARAS[0], "X boilerplate call to action: subscribe to the M365.FM podcast today.", PARAS[2]], iso=OLD)
        self.run_blog([a2, b], "auto", "--langs", "de")
        rec = self.rec(); tpl, units, h = TB.source_of(a2)
        self.assertEqual(rec["seg"]["2"], "deV1:X boilerplate call to action: subscribe to the M365.FM podcast today.")   # nicht der Text von Absatz B
        self.assertEqual(TB.stale_ids(rec, units, h), []); self.assertTrue(rec["ok"]); self.assertEqual(len(self.api.batches), 1)

    def test_replaced_paragraph_without_hit_keeps_old_text_as_stale(self):
        a = post(PARAS[:3], iso=OLD); self.run_blog([a], "run", "--langs", "de")
        a2 = post([PARAS[0], "W is a paragraph nobody has translated yet, about Defender.", PARAS[2]], iso=OLD)
        self.run_blog([a2], "auto", "--langs", "de")
        rec = self.rec(); tpl, units, h = TB.source_of(a2)
        self.assertEqual(rec["seg"]["2"], "deV1:" + PARAS[1]); self.assertEqual(TB.stale_ids(rec, units, h), ["2"])

    def test_tm_hit_never_replaces_a_paragraph_with_hand_text(self):
        x = "X boilerplate call to action: subscribe to the M365.FM podcast today."
        a = post(PARAS[:3], iso=OLD); b = post([x, PARAS[7]], slug="b-post", title="Other", iso=OLD); self.run_blog([a, b], "run", "--langs", "de,fr")
        self.hand("2", PARAS[1], "HAND zwei."); a2 = post([PARAS[0], x, PARAS[2]], iso=OLD)   # der Absatz mit Handtext wird im Original durch einen Text ersetzt, den das TM kennt
        self.run_blog([a2, b], "auto", "--langs", "de,fr")
        self.assertEqual(self.rec()["seg"]["2"], "deV1:" + PARAS[1]); self.assertIn("<p>HAND zwei.</p>", self.html(a2)); self.assertEqual(self.stale(), {"de": {"a-post": ["2"]}})
        self.assertEqual(self.rec("fr")["seg"]["2"], "frV1:" + x)   # ohne Handtext nimmt die Sprache den Treffer
        n = len(self.api.batches); self.run_blog([a2, b], "stale", "--langs", "de")
        self.assertEqual(len(self.api.batches), n); self.assertEqual(self.rec()["seg"]["2"], "deV1:" + PARAS[1])   # gesperrt, auch fuer den kostenlosen Treffer
        self.run_blog([a2, b], "stale", "--langs", "de", "--force-manual")
        self.assertEqual(len(self.api.batches), n); self.assertEqual(self.rec()["seg"]["2"], "deV1:" + x); self.assertNotIn("HAND", self.html(a2))

    def test_no_tm_replacement_while_the_hand_texts_are_unknown(self):
        x = "X boilerplate call to action: subscribe to the M365.FM podcast today."
        a = post(PARAS[:3], iso=OLD); b = post([x, PARAS[7]], slug="b-post", title="Other", iso=OLD); self.run_blog([a, b], "run", "--langs", "de")
        a2 = post([PARAS[0], x, PARAS[2]], iso=OLD)
        with self.export(status=503): self.run_blog([a2, b], "auto", "--langs", "de")
        self.assertEqual(self.rec()["seg"]["2"], "deV1:" + PARAS[1]); self.assertEqual(self.rec()["sh"]["2"], OV.anchor("lblog", "2", PARAS[1]))   # alter Text bleibt, veraltet
        with self.export({}): self.run_blog([a2, b], "auto", "--langs", "de")
        self.assertEqual(self.rec()["seg"]["2"], "deV1:" + PARAS[1]); self.assertEqual(self.stale(), {"de": {"a-post": ["2"]}})   # gelistet, sobald die Handtexte wieder bekannt sind
        with self.export({}): self.run_blog([a2, b], "stale", "--langs", "de")
        self.assertEqual(self.rec()["seg"]["2"], "deV1:" + x); self.assertEqual(len(self.api.batches), 1)

    def test_stale_mode_takes_a_later_tm_hit_for_free(self):
        a = post(PARAS[:3], iso=OLD); self.run_blog([a], "run", "--langs", "de")
        x = "X boilerplate call to action: subscribe to the M365.FM podcast today."
        a2 = post([PARAS[0], x, PARAS[2]], iso=OLD); self.run_blog([a2], "auto", "--langs", "de")   # noch kein Treffer: alter Text, veraltet
        b = post([x, PARAS[7]], slug="b-post", title="Other"); self.run_blog([a2, b], "run", "--langs", "de")   # jetzt steht X uebersetzt im Bestand
        n = len(self.api.batches); self.run_blog([a2, b], "stale", "--langs", "de")
        self.assertEqual(len(self.api.batches), n); self.assertEqual(self.rec()["seg"]["2"], "deV1:" + x); self.assertEqual(self.stale(), {})


# ---------------- 315-3 / 315-4 / 315-5: Handtexte der Redaktion (Vertrag i18n-overrides v1) ----------------
class Overrides(Base):
    def setUp(self):
        super().setUp(); self.p = post(); self.run_blog([self.p], "run", "--langs", "de")

    def test_contract_kinds_layout_and_shape(self):
        self.assertEqual(OV.KINDS, ("lblog", "episode", "notes"))   # die Namen der D1-Zeilen von #319
        self.overrides("lblog", "de", {"a-post": {"3": {"t": "Hand", "sh": "0123ABCD"}, "4": "ohne Anker", "5": {"t": "  ", "sh": "01234567"}, "6": {"t": "x", "sh": "kaputt"}}, "b": "kein Objekt"})
        self.assertEqual(OV.load("lblog", "de"), {"a-post": {"3": {"t": "Hand", "sh": "0123abcd"}}})   # ohne gueltigen Anker nie angewendet
        self.overrides("episode", "de", {"ep-1": {"title": "Kurzform", "summary": {"t": "S", "sh": "01234567"}, "html": "falsche Art"}})
        self.assertEqual(OV.load("episode", "de"), {"ep-1": {"title": {"t": "Kurzform", "sh": ""}, "summary": {"t": "S", "sh": "01234567"}}})
        self.assertEqual(OV.load("notes", "de"), {}); self.assertEqual(OV.load("lblog", "fr"), {})
        self.assertEqual(OV.anchor("lblog", "3", PARAS[2]), unit_hash("3", PARAS[2])[:8]); self.assertEqual(OV.anchor("episode", "title", "A b"), fields_hash("A  b")[:8])

    def test_export_replaces_the_file_and_404_falls_back(self):
        self.overrides("lblog", "de", {"a-post": {"3": {"t": "aus der Datei", "sh": "01234567"}}})
        calls = []
        with patch.object(OV, "_get", lambda path, timeout=20: (calls.append(path), {"kind": "lblog", "lang": "de", "items": {"a-post": {"4": {"t": "aus dem Export", "sh": "89abcdef"}}}})[1]):
            OV.use_api("https://api.example.test/")
            self.assertEqual(OV.load("lblog", "de"), {"a-post": {"4": {"t": "aus dem Export", "sh": "89abcdef"}}})   # zurueckgesetzte Einheit 3 ist weg
        self.assertEqual(calls, ["/api/i18n/overrides?kind=lblog&lang=de"])

        def gone(path, timeout=20): calls.append(path); raise urllib.error.HTTPError(path, 404, "Not Found", {}, None)
        with patch.object(OV, "_get", gone):
            OV.use_api("https://api.example.test")
            self.assertEqual(OV.load("lblog", "de"), {"a-post": {"3": {"t": "aus der Datei", "sh": "01234567"}}})
            OV.load("lblog", "fr"); self.assertEqual(len(calls), 2)   # nach dem ersten Fehlschlag fragt der Lauf nicht weiter

    def test_override_wins_is_sanitised_and_never_stored(self):
        self.hand("3", PARAS[2], EVIL)
        html = self.html(self.p)
        self.assertIn("Handtext", html); self.assertNotIn("deV1:" + PARAS[2], html); self.assertIn("deV1:" + PARAS[1], html)
        for bad in ("<svg", "onload", "onerror", "<script", "alert(3)"): self.assertNotIn(bad, html)
        self.assertNotIn("Handtext", TB.assemble(self.p, self.rec())[2]); self.assertNotIn("Handtext", TB.assemble(self.p, self.rec("de"), "fr")[2])
        for argv in (("auto",), ("run",), ("stale",), ("run", "--slugs", "a-post", "--redo")):
            self.run_blog([self.p], *argv, "--langs", "de")
        rec = self.rec()
        self.assertNotIn("Handtext", json.dumps(rec)); self.assertNotIn("manual", rec)   # reine Leseschicht: im Speicher steht nur Maschinentext
        self.assertEqual(rec["seg"]["3"][2:], "V1:" + PARAS[2])

    def test_reset_brings_the_machine_text_back(self):
        self.hand("3", PARAS[2], "Von Hand bearbeiteter Absatz drei.")
        self.run_blog([self.p], "auto", "--langs", "de"); self.assertIn("Von Hand", self.html(self.p))
        (OV.DIR / "lblog" / "de.json").unlink(); OV.clear_cache()   # #319: Zeile geloescht -> fehlt im Export -> Datei ohne sie
        self.run_blog([self.p], "auto", "--langs", "de")
        html = self.html(self.p); self.assertNotIn("Von Hand", html); self.assertIn("deV1:" + PARAS[2], html)

    def test_locked_in_every_mode_except_force_manual(self):
        self.hand("3", PARAS[2], "Von Hand bearbeiteter Absatz drei."); self.api.gen = "V2"
        self.run_blog([self.p], "run", "--langs", "de", "--slugs", "a-post", "--redo")
        self.assertNotIn("3", self.api.sent()); self.assertEqual(len(self.api.sent()), 9)
        self.assertEqual(self.rec()["seg"]["3"], "deV1:" + PARAS[2]); self.assertIn("Von Hand", self.html(self.p))
        self.api.gen = "V3"; self.run_blog([self.p], "run", "--langs", "de", "--slugs", "a-post", "--redo", "--force-manual")
        self.assertIn("3", self.api.sent()); self.assertEqual(self.rec()["seg"]["3"], "deV3:" + PARAS[2])
        self.assertIn("Von Hand", self.html(self.p))   # Quelle unveraendert: der Handtext bleibt die angezeigte Fassung

    def test_override_moves_with_its_paragraph(self):
        self.hand("3", PARAS[2], "HAND drei.")
        ins = PARAS[:1] + ["Brand new inserted paragraph about Purview labels for everyone."] + PARAS[1:]; p2 = post(ins)
        self.run_blog([p2], "auto", "--langs", "de")
        paras = re.findall(r"<p>(.*?)</p>", self.html(p2))
        self.assertEqual(paras[:5], ["deV1:" + PARAS[0], "deV1:" + ins[1], "deV1:" + PARAS[1], "HAND drei.", "deV1:" + PARAS[3]])   # genau einmal, am selben Absatz
        self.assertEqual(self.stale(), {}); self.assertEqual(self.rec()["seg"]["4"], "deV1:" + PARAS[2])
        v = TB.editor_view("de", p2, self.rec()); self.assertEqual(v["edited"], ["4"])

    def test_override_on_a_rewritten_paragraph_stays_and_is_listed(self):
        self.hand("3", PARAS[2], "HAND drei.")
        edited = list(PARAS); edited[2] = "The third paragraph was rewritten in the English original, about Intune."; p2 = post(edited)
        self.run_blog([p2], "auto", "--langs", "de")
        self.assertIn("<p>HAND drei.</p>", self.html(p2)); self.assertEqual(self.stale(), {"de": {"a-post": ["3"]}})   # "Handfassung, Original geaendert"
        n = len(self.api.batches); self.run_blog([p2], "stale", "--langs", "de")
        self.assertEqual(len(self.api.batches), n); self.assertEqual(self.stale(), {"de": {"a-post": ["3"]}})   # gesperrt
        self.api.gen = "V2"; self.run_blog([p2], "stale", "--langs", "de", "--force-manual")
        self.assertEqual(self.api.sent(), ["3"])
        self.assertIn("<p>deV2:" + edited[2] + "</p>", self.html(p2)); self.assertNotIn("HAND", self.html(p2)); self.assertEqual(self.stale(), {})
        self.hand("3", edited[2], "HAND drei, neu.")   # Redaktion speichert neu: Anker = aktueller Quelltext
        self.run_blog([p2], "auto", "--langs", "de")
        self.assertIn("<p>HAND drei, neu.</p>", self.html(p2)); self.assertEqual(self.stale(), {})

    def test_override_of_a_deleted_paragraph_is_not_applied_anywhere(self):
        self.hand("3", PARAS[2], "HAND drei.")
        p2 = post(PARAS[:2] + PARAS[3:]); self.run_blog([p2], "auto", "--langs", "de")
        html = self.html(p2); self.assertNotIn("HAND", html); self.assertIn("<p>deV1:" + PARAS[3] + "</p>", html)
        self.assertEqual(TB.editor_view("de", p2, self.rec())["edited"], [])
        self.assertTrue(any(k[:2] == ("lblog", "de") and "verwaist" in k[2] for k in OV.NOTES))

    def test_place_rules(self):
        cur = {"T": "t1", "1": "aa", "2": "bb", "3": "cc", "4": "bb"}
        ov = {"2": {"t": "zwei", "sh": "bb"}, "9": {"t": "wandert", "sh": "cc"}, "5": {"t": "weg", "sh": "zz"}, "1": {"t": "an Ort geaendert", "sh": "old"}}
        placed, lost = OV.place(ov, cur, {"1": "old", "2": "bb", "3": "cc", "4": "bb", "T": "old"})
        self.assertEqual(placed, {"2": ("zwei", "ok"), "3": ("wandert", "ok"), "1": ("an Ort geaendert", "stale")}); self.assertEqual(lost, ["5"])
        placed, lost = OV.place({"3": {"t": "a", "sh": "bb"}, "5": {"t": "b", "sh": "bb"}}, cur)
        self.assertEqual(placed, {"2": ("a", "ok"), "4": ("b", "ok")})   # gleiche Texte: jeder Handtext auf genau eine Einheit, die naechstgelegene

    def test_editor_view_publishes_the_anchor_that_comes_back(self):
        v = TB.editor_view("de", self.p, self.rec()); row = next(u for u in v["units"] if u[0] == "3")
        self.assertEqual(row, ["3", PARAS[2], "deV1:" + PARAS[2], OV.anchor("lblog", "3", PARAS[2])]); self.assertEqual((v["stale"], v["edited"]), ([], []))
        self.overrides("lblog", "de", {"a-post": {"3": {"t": "HAND", "sh": row[3]}}})   # was die Oberflaeche zurueckschickt
        v = TB.editor_view("de", self.p, self.rec()); self.assertEqual(next(u for u in v["units"] if u[0] == "3")[2], "HAND"); self.assertEqual(v["edited"], ["3"])
        self.assertIsNone(TB.editor_view("de", self.p, None))

    def test_wishes_restrict_a_stale_run_and_are_reported_done(self):
        edited = list(PARAS); edited[3] = NEW4; edited[6] = "Another rewritten paragraph seven about Entra conditional access."; p2 = post(edited)
        self.run_blog([p2], "auto", "--langs", "de"); self.assertEqual(self.stale(), {"de": {"a-post": ["4", "7"]}})
        done = []
        with patch.object(OV, "wishes", lambda kind: {"de": {"a-post": ["4"]}, "xx": {"a-post": []}} if kind == "lblog" else {}), patch.object(OV, "wishes_done", lambda kind, d: (done.append((kind, list(d))), len(d))[1]):
            self.api.gen = "V2"; self.run_blog([p2], "stale", "--wishes")
        self.assertEqual(self.api.sent(), ["4"]); self.assertEqual(self.rec()["seg"]["4"], "deV2:" + NEW4)
        self.assertEqual(done, [("lblog", [("de", "a-post")])]); self.assertEqual(self.stale(), {"de": {"a-post": ["7"]}})

    def test_wishes_api_shapes(self):
        sent = []

        class R:
            def __init__(self, body): self.body = body
            def __enter__(self): return self
            def __exit__(self, *a): return False
            def read(self): return self.body

        def urlopen(req, timeout=0):
            sent.append((req.get_method(), req.full_url, dict(req.header_items()), req.data))
            return R(json.dumps({"items": [{"kind": "lblog", "item": "a-post", "lang": "de", "units": ["4"]}, {"kind": "episode", "item": "ep-1", "lang": "fr", "units": []}]}).encode())
        with patch.object(OV.urllib.request, "urlopen", urlopen), patch.dict(os.environ, {"CRON_KEY": "geheim"}):
            OV.use_api("https://api.example.test")
            self.assertEqual(OV.wishes("lblog"), {"de": {"a-post": ["4"]}}); self.assertEqual(OV.wishes("episode"), {"fr": {"ep-1": []}})
            self.assertEqual(OV.wishes_done("lblog", [("de", "a-post")]), 1)
        method, url, headers, data = sent[-1]
        self.assertEqual((method, url), ("POST", "https://api.example.test/api/i18n/retranslate/done"))
        self.assertEqual(json.loads(data), {"items": [{"kind": "lblog", "item": "a-post", "lang": "de"}]})
        self.assertEqual({k.lower(): v for k, v in headers.items()}["x-requested-with"], "m365"); self.assertEqual({k.lower(): v for k, v in headers.items()}["x-cron-key"], "geheim")
        OV.use_api(""); self.assertEqual(OV.wishes("lblog"), {}); self.assertEqual(OV.wishes_done("lblog", [("de", "a-post")]), 0)


# ---------------- Show / Notes ----------------
def ep(name="Episode title", summary="Episode summary text.", slug="ep-1", notes="<p>" + "Notes text about Microsoft Teams. " * 12 + "</p>"):
    return {"slug": slug, "id": 7, "name": name, "summary": summary, "show_notes": notes, "create_time": "2026-05-01T00:00:00", "published": True, "hidden": False}


class ShowAndNotes(Base):
    def test_show_and_notes_overrides_applied_and_sanitised(self):
        self.overrides("episode", "de", {"ep-1": {"title": {"t": "Eigener <b>Titel</b> &amp; mehr<script>x()</script>", "sh": "01234567"}}, "ep-9": {"title": "ohne Maschinenfassung"}})
        self.overrides("notes", "de", {"ep-1": {"html": {"t": "<p onclick=\"x()\">Eigene Notes</p><svg/onload=alert(1)><script>alert(2)</script>", "sh": ""}}})
        got = OV.apply_show("de", {"ep-1": ["Maschine", "Zusammenfassung"]})
        self.assertEqual(got, {"ep-1": ["Eigener Titel & mehr x()", "Zusammenfassung"]})   # reiner Text; ep-9 hat keine Maschinenfassung
        self.assertEqual(OV.apply_notes("de", {"ep-1": "<p>x</p>"})["ep-1"], "<p>Eigene Notes</p>")
        self.assertEqual(OV.apply_show("fr", {"ep-1": ["a", "b"]}), {"ep-1": ["a", "b"]}); self.assertEqual(OV.apply_notes("de", {"ep-2": "<p>x</p>"}), {"ep-2": "<p>x</p>"})

    def test_plan_translates_new_once_and_never_existing(self):
        e = ep(); h = TS.show_hash(e); have = {"ep-1": ["Titel", "Zusammenfassung"]}; hashes = {}
        self.assertEqual(TS.sync_hashes(have, hashes, {"ep-1": h}), 1)   # Altbestand: Hash ohne API
        self.assertEqual(TS.plan("episode", "de", "ep-1", have, hashes, h), (False, [])); self.assertEqual(TS.plan("episode", "de", "ep-1", have, hashes, h, True), (False, []))
        self.assertEqual(TS.plan("episode", "de", "ep-2", have, hashes, h), (True, [])); self.assertEqual(TS.plan("episode", "de", "ep-2", have, hashes, h, True), (False, []))
        h2 = TS.show_hash(ep(summary="Episode summary text, now edited."))
        self.assertEqual(TS.plan("episode", "de", "ep-1", have, hashes, h2), (False, ["summary"]))   # Automatik fasst Vorhandenes nie an
        self.assertEqual(TS.plan("episode", "de", "ep-1", have, hashes, h2, True), (True, ["summary"]))   # nur --stale
        self.assertEqual(TS.sync_hashes(have, hashes, {"ep-1": h2}), 0)
        self.assertEqual(TS.anchors(e)["summary"], h.split("|")[1][:8]); self.assertEqual(TS.anchors(e)["html"], TS.notes_hash(e)[:8])

    def test_plan_with_hand_text(self):
        e = ep(); e2 = ep(summary="Episode summary text, now edited."); h, h2 = TS.show_hash(e), TS.show_hash(e2); have = {"ep-1": ["Titel", "Zusammenfassung"]}; hashes = {"ep-1": h}
        self.overrides("episode", "de", {"ep-1": {"summary": {"t": "Hand", "sh": TS.anchors(e)["summary"]}}})
        self.assertEqual(TS.plan("episode", "de", "ep-1", have, hashes, h, True), (False, []))
        self.assertEqual(TS.plan("episode", "de", "ep-1", have, hashes, h2, True), (False, ["summary"]))   # gesperrt, aber gemeldet: Handfassung, Original geaendert
        self.assertEqual(TS.plan("episode", "de", "ep-1", have, hashes, h2, True, True), (True, ["summary"]))   # --force-manual
        self.assertEqual(TS.plan("episode", "fr", "ep-1", have, hashes, h2, True), (True, ["summary"]))   # andere Sprache: kein Handtext
        self.overrides("episode", "de", {"ep-1": {"summary": {"t": "Hand, neu", "sh": TS.anchors(e2)["summary"]}}})
        self.assertEqual(TS.plan("episode", "de", "ep-1", have, hashes, h2, True), (False, []))   # Redaktion hat nachgezogen
        self.overrides("episode", "de", {"ep-1": {"title": "ohne Anker"}})
        self.assertEqual(TS.plan("episode", "de", "ep-1", have, hashes, h2, True), (True, ["summary"]))   # nur der Titel ist von Hand: die veraltete Zusammenfassung wird neu uebersetzt
        nh, nh2 = TS.notes_hash(e), TS.notes_hash(ep(notes="<p>" + "Other notes about Outlook. " * 12 + "</p>"))
        self.assertEqual(TS.plan("notes", "de", "ep-1", {"ep-1": "<p>x</p>"}, {"ep-1": nh}, nh2, True), (True, ["notes_html"]))
        self.overrides("notes", "de", {"ep-1": {"html": {"t": "<p>Hand</p>", "sh": nh[:8]}}})
        self.assertEqual(TS.plan("notes", "de", "ep-1", {"ep-1": "<p>x</p>"}, {"ep-1": nh}, nh2, True), (False, ["notes_html"]))

    def test_update_stale_merges_fields_and_leaves_unexamined_languages(self):
        TS.update_stale(("title", "summary"), {"de": {"ep-1": ["title"]}, "fr": {"ep-1": ["summary"]}}, ["ep-1"], ["de", "fr"])
        cur = TS.update_stale(("notes_html",), {"de": {"ep-1": ["notes_html"]}}, ["ep-1"], ["de"])
        self.assertEqual(sorted(cur["de"]["ep-1"]), ["notes_html", "title"]); self.assertEqual(cur["fr"], {"ep-1": ["summary"]})
        cur = TS.update_stale(("title", "summary"), {}, ["ep-1"], ["de"])   # Lauf mit --langs de: fr wurde nicht geprueft und bleibt stehen
        self.assertEqual(cur, {"de": {"ep-1": ["notes_html"]}, "fr": {"ep-1": ["summary"]}})
        self.assertNotIn("de", TS.update_stale(("title", "summary", "notes_html"), {}, ["ep-1"], ["de"]))

    def run_show(self, eps, *argv):
        """Ein ganzer Lauf von translate_show.py mit nachgebauter Batch-API; -> gesendete custom_ids."""
        sent = []

        def call(method, path, body=None, job="translate_show"):
            sent.extend(r["custom_id"] for r in body["requests"]); self._reqs = body["requests"]
            return {"id": "b1", "processing_status": "ended", "request_counts": {}, "results_url": "https://api.anthropic.com/v1/results"}

        def results(req, timeout=0):
            return io.BytesIO("\n".join(json.dumps({"custom_id": r["custom_id"], "result": {"type": "succeeded", "message": {"usage": {"input_tokens": 9, "output_tokens": 9}, "stop_reason": "end_turn",
                              "content": [{"type": "text", "text": json.dumps({"title": "T-" + r["custom_id"], "summary": "S-neu"})}]}}}) for r in self._reqs).encode())
        with patch.object(TS.P, "load", lambda name: list(eps)), patch.object(TS, "call", call), patch.object(TS, "urlopen", results), patch.object(TS, "check_budget", lambda *a, **k: True), \
                patch.object(TS, "report_usage", lambda *a, **k: None), patch.object(TS.time, "sleep", lambda s: None), patch.object(sys, "argv", ["translate_show.py", *argv]):
            TS.main()
        return sent

    def test_show_run_keeps_other_languages_and_cleans_up_after_stale_run(self):
        e = ep(); self.assertEqual(sorted(self.run_show([e], "--langs", "de,fr")), ["de__ep-1", "fr__ep-1"])
        f = TS.OUT / "stale.json"; self.assertEqual(json.loads(f.read_text()), {})
        e2 = ep(summary="Episode summary text, now edited.")
        self.assertEqual(self.run_show([e2], "--langs", "de,fr"), [])   # geaendert: nur gemeldet
        self.assertEqual(json.loads(f.read_text()), {"de": {"ep-1": ["summary"]}, "fr": {"ep-1": ["summary"]}})
        self.assertEqual(self.run_show([e2], "--langs", "de"), [])
        self.assertEqual(json.loads(f.read_text()), {"de": {"ep-1": ["summary"]}, "fr": {"ep-1": ["summary"]}})   # fr nicht geprueft -> bleibt
        self.assertEqual(self.run_show([e2], "--stale", "--langs", "de"), ["de__ep-1"])
        self.assertEqual(json.loads(f.read_text()), {"fr": {"ep-1": ["summary"]}})   # nach dem Lauf: erledigte Fassung faellt aus der Liste
        self.assertEqual(json.loads((TS.OUT / "de.json").read_text())["ep-1"], ["T-de__ep-1", "S-neu"])
        self.assertEqual(json.loads((TS.OUT / "src" / "de.json").read_text())["ep-1"], TS.show_hash(e2))

    def test_show_wishes_and_stale_cap(self):
        eps = [ep(slug=f"ep-{k}") for k in range(1, 5)]; self.run_show(eps, "--langs", "de")
        eps2 = [ep(slug=f"ep-{k}", summary="Edited summary.") for k in range(1, 5)]; done = []
        with patch.object(OV, "wishes", lambda kind: {"de": {"ep-2": ["summary"]}} if kind == "episode" else {}), patch.object(OV, "wishes_done", lambda kind, d: done.append((kind, list(d)))):
            self.assertEqual(self.run_show(eps2, "--wishes", "--langs", "de"), ["de__ep-2"])
        self.assertEqual(done, [("episode", [("de", "ep-2")])])
        with patch.object(TS, "STALE_MAX", 2): self.assertEqual(len(self.run_show(eps2, "--stale", "--langs", "de")), 2)   # ohne --slugs begrenzt
        self.assertEqual(len(json.loads((TS.OUT / "stale.json").read_text())["de"]), 1)

    def run_notes(self, eps, *argv):
        """Ein ganzer Lauf von translate_notes.py (Ranking = Reihenfolge der Folgen) mit nachgebauter Batch-API; -> gesendete custom_ids."""
        sent = []

        def call(method, path, body=None, job="translate_notes"):
            sent.extend(r["custom_id"] for r in body["requests"]); self._reqs = body["requests"]
            return {"id": "b1", "processing_status": "ended", "request_counts": {}, "results_url": "https://api.anthropic.com/v1/results"}

        def results(req, timeout=0):
            return io.BytesIO("\n".join(json.dumps({"custom_id": r["custom_id"], "result": {"type": "succeeded", "message": {"usage": {"input_tokens": 9, "output_tokens": 9}, "stop_reason": "end_turn",
                              "content": [{"type": "text", "text": "<p>N-" + r["custom_id"] + "</p>"}]}}}) for r in self._reqs).encode())
        with patch.object(TN.P, "load", lambda name: list(eps)), patch.object(TN, "OUT", TS.OUT), patch.object(TN, "ranking", lambda eps: list(eps)), patch.object(TN, "call", call), patch.object(TN, "urlopen", results), \
                patch.object(TN, "check_budget", lambda *a, **k: True), patch.object(TN, "report_usage", lambda *a, **k: None), patch.object(TN.time, "sleep", lambda s: None), patch.object(sys, "argv", ["translate_notes.py", *argv]):
            TN.main()
        return sent

    @unittest.skipIf(TN is None, "translate_notes braucht requests")
    def test_notes_run_keeps_other_languages_and_cleans_up_after_stale_run(self):
        e = ep(); self.assertEqual(sorted(self.run_notes([e], "--langs", "de,fr")), ["de__7", "fr__7"])
        f = TS.OUT / "stale.json"; self.assertEqual(json.loads(f.read_text()), {})
        TS.update_stale(("title", "summary"), {"fr": {"ep-1": ["title"]}}, ["ep-1"], ["fr"])   # Eintrag von translate_show in derselben Datei
        e2 = ep(notes="<p>" + "Other notes about Outlook. " * 12 + "</p>")
        self.assertEqual(self.run_notes([e2], "--langs", "de,fr"), [])   # geaendert: nur gemeldet, nie automatisch neu uebersetzt
        self.assertEqual(json.loads(f.read_text()), {"de": {"ep-1": ["notes_html"]}, "fr": {"ep-1": ["title", "notes_html"]}})
        self.assertEqual(self.run_notes([e2], "--langs", "de"), [])
        self.assertEqual(json.loads(f.read_text())["fr"], {"ep-1": ["title", "notes_html"]})   # fr nicht geprueft -> bleibt
        self.overrides("notes", "de", {"ep-1": {"html": {"t": "<p>Hand</p>", "sh": TS.anchors(e)["html"]}}})
        self.assertEqual(self.run_notes([e2], "--stale", "--langs", "de,fr"), ["fr__7"])   # de: Handtext der Redaktion sperrt
        self.assertEqual(json.loads(f.read_text()), {"de": {"ep-1": ["notes_html"]}, "fr": {"ep-1": ["title"]}})   # nach dem Lauf faellt die erledigte Fassung heraus; de = Handfassung, Original geaendert
        self.assertEqual(json.loads((TS.OUT / "notes_fr.json").read_text())["ep-1"], "<p>N-fr__7</p>")
        self.assertEqual(json.loads((TS.OUT / "src" / "notes_fr.json").read_text())["ep-1"], TS.notes_hash(e2))
        self.assertEqual(self.run_notes([e2], "--stale", "--langs", "de", "--force-manual"), ["de__7"])
        self.assertEqual(OV.apply_notes("de", json.loads((TS.OUT / "notes_de.json").read_text()))["ep-1"], "<p>Hand</p>")   # der Handtext bleibt die angezeigte Fassung


# ---------------- Sperre unbekannt: Export der Redaktion nicht abrufbar (Vertrag 5) ----------------
class ExportUnreachable(Base):
    def setUp(self):
        super().setUp(); self.p = post(); self.run_blog([self.p], "run", "--langs", "de")
        self.edited = list(PARAS); self.edited[2] = "Paragraph three was rewritten in the English original, about Intune."; self.p2 = post(self.edited)
        self.ov = {("lblog", "de"): {"a-post": {"3": {"t": "HAND drei.", "sh": OV.anchor("lblog", "3", PARAS[2])}}}}

    def pending(self): return [b["id"] for b in json.loads((TB.OUT / "batches.json").read_text("utf-8"))]

    def test_failed_state_per_kind_and_language(self):
        with self.export(self.ov, status=503, only=("fr",)):
            self.assertEqual(OV.load("lblog", "de"), self.ov[("lblog", "de")]); self.assertFalse(OV.failed("lblog", "de"))
            self.assertEqual(OV.load("lblog", "fr"), {}); self.assertTrue(OV.failed("lblog", "fr")); self.assertEqual(OV.failed("lblog"), ["fr"])
            OV.load("notes", "de"); self.assertTrue(OV.failed("notes", "de"))   # nach dem Fehlschlag fragt der Lauf nicht weiter: genauso unbekannt
            self.assertEqual(len(self.asked), 2)
        with self.export(status=404):
            self.assertEqual(OV.load("lblog", "de"), {}); self.assertEqual(OV.failed("lblog"), [])   # Endpunkt noch nicht ausgerollt: es gibt keine Handtexte
        with patch.object(OV, "_get", lambda path, timeout=20: {"error": "kaputt"}):
            OV.use_api("https://api.example.test"); OV.load("lblog", "de"); self.assertTrue(OV.failed("lblog", "de")); OV.use_api("")   # Antwort ohne items
        OV.load("lblog", "de"); self.assertEqual(OV.failed("lblog"), [])   # ohne eingestellten Export gelten die Dateien

    def test_stale_run_stops_and_the_hand_text_survives(self):
        with self.export(self.ov):
            self.run_blog([self.p2], "auto", "--langs", "de")
            self.assertIn("<p>HAND drei.</p>", self.html(self.p2)); self.assertEqual(self.stale(), {"de": {"a-post": ["3"]}})
        with self.export(status=503):
            with self.assertRaises(SystemExit) as cm: self.run_blog([self.p2], "stale", "--langs", "de")
            self.assertIn("Export der Redaktion nicht abrufbar", str(cm.exception)); self.assertIn("de", str(cm.exception))
        self.assertEqual(len(self.api.batches), 1); self.assertEqual(self.pending(), [])   # nichts gesendet, nichts bezahlt
        self.assertEqual(self.rec()["seg"]["3"], "deV1:" + PARAS[2]); self.assertEqual(self.rec()["sh"]["3"], OV.anchor("lblog", "3", PARAS[2]))
        self.assertEqual(self.stale(), {"de": {"a-post": ["3"]}})   # Status wurde trotzdem geschrieben
        with self.export(self.ov): self.assertIn("<p>HAND drei.</p>", self.html(self.p2))   # der Anker passt weiter: Handtext nicht verwaist

    def test_redo_does_not_touch_existing_text_but_new_posts_still_go_out(self):
        b = post(PARAS[4:6] + ["A never translated paragraph about Loop components."], slug="b-post", title="Second post")
        self.api.gen = "V2"
        with self.export(status=503):
            with self.assertRaises(SystemExit): self.run_blog([self.p, b], "run", "--langs", "de", "--redo")
        self.assertEqual(self.api.sent(), ["T", "D", "1", "2", "3"])   # a-post: nichts Vorhandenes; b-post ist nie uebersetzt und geht ganz hinaus (--redo: ohne TM)
        self.assertEqual(self.rec()["seg"]["1"], "deV1:" + PARAS[0]); self.assertTrue(self.rec(slug="b-post")["ok"])
        c = post(["A third post paragraph that nobody has translated so far, about Viva."], slug="c-post", title="Third post")
        with self.export(status=503): self.run_blog([self.p, b, c], "auto", "--langs", "de")   # Automatik (nur Neues) laeuft ohne Fehler weiter
        self.assertTrue(self.rec(slug="c-post")["ok"])

    def test_stale_mode_takes_no_tm_hit_while_the_lock_is_unknown(self):
        x = "X boilerplate call to action: subscribe to the M365.FM podcast today."
        a2 = post([PARAS[0], x] + PARAS[2:], iso=OLD); b = post([x, PARAS[7]], slug="b-post", title="Other")
        self.run_blog([a2, b], "run", "--langs", "de"); self.assertEqual(self.rec()["seg"]["2"], "deV1:" + PARAS[1])
        with self.export(status=503):
            with self.assertRaises(SystemExit): self.run_blog([a2, b], "stale", "--langs", "de")
        self.assertEqual(self.rec()["seg"]["2"], "deV1:" + PARAS[1])   # auch ohne API wird nichts Vorhandenes ersetzt
        with self.export({}): self.run_blog([a2, b], "stale", "--langs", "de")
        self.assertEqual(self.rec()["seg"]["2"], "deV1:" + x)

    def test_404_force_manual_and_other_languages_do_not_stop_the_run(self):
        self.run_blog([self.p], "run", "--langs", "fr"); self.api.gen = "V2"
        with self.export(status=503, only=("fr",)):
            self.run_blog([self.p2], "stale", "--langs", "de")   # fr gehoert nicht zum Lauf (nur der Status sieht es an)
            self.assertEqual(OV.failed("lblog"), ["fr"])
        self.assertEqual(self.api.sent(), ["3"]); self.assertEqual(self.rec()["seg"]["3"], "deV2:" + self.edited[2]); self.assertEqual(self.rec("fr")["seg"]["3"], "frV1:" + PARAS[2])
        e4 = list(self.edited); e4[3] = NEW4; p4 = post(e4)
        with self.export(status=404): self.run_blog([p4], "stale", "--langs", "de")   # Endpunkt noch nicht ausgerollt: keine Handtexte, keine Sperre
        self.assertEqual(self.api.sent(), ["4"])
        e5 = list(e4); e5[4] = "Paragraph five got a new wording about Teams Premium."; p5 = post(e5)
        with self.export(status=503): self.run_blog([p5], "stale", "--langs", "de", "--force-manual")   # braucht die Sperre nicht
        self.assertEqual(self.api.sent(), ["5"]); self.assertNotIn("de", self.stale())

    def test_collect_holds_batches_that_replace_text_until_the_export_is_back(self):
        b = post(["A never translated paragraph about Loop components."], slug="b-post", title="Second post")
        with self.export({}):
            self.run_blog([self.p2], "submit", "--stale", "--langs", "de")
            self.run_blog([self.p2, b], "submit", "--langs", "de")
        self.assertEqual(self.pending(), ["b2", "b3"]); self.api.gen = "V2"
        with self.export(status=503):
            self.run_blog([self.p2, b], "collect")
            self.assertEqual(self.pending(), ["b2"])   # Neuuebersetzung bleibt liegen, der neue Beitrag ist gespeichert
            self.assertEqual(self.rec()["seg"]["3"], "deV1:" + PARAS[2]); self.assertTrue(self.rec(slug="b-post")["ok"])
            slept = []
            with patch.object(TB.time, "sleep", slept.append): self.run_blog([self.p2, b], "auto", "--langs", "de")
            self.assertEqual(slept, []); self.assertEqual(self.pending(), ["b2"]); self.assertEqual(len(self.api.batches), 3)   # wartet nicht auf einen zurueckgehaltenen Batch
        with self.export({}): self.run_blog([self.p2, b], "collect")
        self.assertEqual(self.pending(), []); self.assertEqual(self.rec()["seg"]["3"], "deV2:" + self.edited[2])

    def test_collect_never_overwrites_existing_text_while_the_lock_is_unknown(self):
        tpl, units, h = TB.source_of(self.p); rec = self.rec()
        with self.export(status=503):
            man = TB.locked({}, "de", self.p, units, h, rec)
            self.assertEqual(set(man), set(rec["seg"])); self.assertFalse(TB.store(rec, "3", PARAS[2], "neu", man, True))
            self.assertEqual(TB.locked({"force_manual": True}, "de", self.p, units, h, rec), {})
        self.assertEqual(TB.locked({}, "de", self.p, units, h, rec), {})

    def test_apply_keeps_job_and_answer_while_the_lock_is_unknown(self):
        with patch.object(TB, "posts", lambda: [self.p]):
            TB.BY_SLUG["a-post"] = self.p
            TB.prepare(self.args("prepare", "--langs", "de", "--slugs", "a-post", "--redo"))
            fin = TB.WORK / "de" / f"{TB.key('a-post')}.in.txt"; fout = fin.with_name(fin.name.replace(".in.txt", ".out.txt")); job = fin.read_text("utf-8")
            fout.write_text("\n".join(f"[[{i}]] deAG:{t}" for i, t in TB.parse(job.split("\n", 1)[1]).items()) + "\n", encoding="utf-8")
        with self.export(status=503):
            with self.assertRaises(SystemExit): self.run_blog([self.p], "apply")
        self.assertTrue(fout.exists()); self.assertEqual(fin.read_text("utf-8"), job); self.assertEqual(self.rec()["seg"]["1"], "deV1:" + PARAS[0])
        with self.export({}): self.run_blog([self.p], "apply")
        self.assertFalse(fin.exists()); self.assertEqual(self.rec()["seg"]["1"], "deAG:" + PARAS[0])
        with self.export(status=503):   # prepare legt fuer vorhandene Texte keinen Auftrag an
            with self.assertRaises(SystemExit): self.run_blog([self.p], "prepare", "--langs", "de", "--slugs", "a-post", "--redo")
        self.assertFalse(fin.exists())

    def test_stale_list_of_a_language_stays_while_its_hand_texts_are_unknown(self):
        e = list(PARAS); e[3] = NEW4; p4 = post(e)
        ov = {("lblog", "de"): {"a-post": {"4": {"t": "HAND vier, schon nachgezogen.", "sh": OV.anchor("lblog", "4", NEW4)}}}}
        with self.export(ov): self.run_blog([p4], "auto", "--langs", "de")
        self.assertEqual(self.stale(), {})   # Handtext gehoert zum aktuellen Original: nicht veraltet
        with self.export(status=503): self.run_blog([p4], "auto", "--langs", "de")
        self.assertEqual(self.stale(), {})   # ohne die Handtexte saehe die Einheit veraltet aus - die Liste bleibt, wie sie war

    def test_show_stale_run_stops_new_episodes_still_go_out(self):
        s = ShowAndNotes("run_show"); s.__dict__.update(self.__dict__)   # derselbe nachgebaute Lauf wie in ShowAndNotes
        e = ep(); s.run_show([e], "--langs", "de,fr"); f = TS.OUT / "stale.json"
        e2 = ep(summary="Episode summary text, now edited."); s.run_show([e2], "--langs", "de,fr")
        before = json.loads(f.read_text()); self.assertEqual(before, {"de": {"ep-1": ["summary"]}, "fr": {"ep-1": ["summary"]}})
        with self.export(status=503):
            with self.assertRaises(SystemExit) as cm: s.run_show([e2], "--stale", "--langs", "de,fr")
            self.assertIn("de, fr", str(cm.exception))
        self.assertEqual(json.loads((TS.OUT / "de.json").read_text())["ep-1"], ["T-de__ep-1", "S-neu"]); self.assertEqual(json.loads(f.read_text()), before)
        self.assertEqual(json.loads((TS.OUT / "src" / "de.json").read_text())["ep-1"], TS.show_hash(e))   # nichts gesendet, Hash unveraendert
        with self.export(status=503): self.assertEqual(s.run_show([e2, ep(slug="ep-2")], "--langs", "de"), ["de__ep-2"])   # Neues laeuft weiter
        with self.export(status=503): self.assertEqual(s.run_show([e2], "--stale", "--langs", "de", "--force-manual"), ["de__ep-1"])
        with self.export(status=404): self.assertEqual(s.run_show([e2], "--stale", "--langs", "fr"), ["fr__ep-1"])

    def test_show_stale_list_of_a_language_stays_while_its_hand_texts_are_unknown(self):
        s = ShowAndNotes("run_show"); s.__dict__.update(self.__dict__)
        e = ep(); s.run_show([e], "--langs", "de,fr"); f = TS.OUT / "stale.json"; e2 = ep(summary="Episode summary text, now edited.")
        ov = {("episode", "de"): {"ep-1": {"summary": {"t": "Hand, schon nachgezogen", "sh": TS.anchors(e2)["summary"]}}}}
        with self.export(ov): s.run_show([e2], "--langs", "de,fr")
        self.assertEqual(json.loads(f.read_text()), {"fr": {"ep-1": ["summary"]}})   # de: Handtext gehoert zum aktuellen Original
        with self.export(status=503): self.assertEqual(s.run_show([e2], "--langs", "de,fr"), [])   # kein --stale: laeuft ohne Fehler durch
        self.assertEqual(json.loads(f.read_text()), {"fr": {"ep-1": ["summary"]}})   # ohne die Handtexte saehe de veraltet aus - die Liste bleibt

    def test_show_run_with_one_unknown_language_translates_the_others_and_ends_red(self):
        s = ShowAndNotes("run_show"); s.__dict__.update(self.__dict__)
        e = ep(); s.run_show([e], "--langs", "de,fr"); e2 = ep(summary="Episode summary text, now edited."); done = []
        with self.export(status=503, only=("fr",)), patch.object(OV, "wishes", lambda kind: {"de": {"ep-1": []}, "fr": {"ep-1": []}}), patch.object(OV, "wishes_done", lambda kind, d: done.append(list(d))):
            with self.assertRaises(SystemExit) as cm: s.run_show([e2], "--wishes", "--langs", "de,fr")
        self.assertIn(" in fr.", str(cm.exception)); self.assertEqual(done, [[("de", "ep-1")]])   # der Wunsch fuer fr bleibt offen
        self.assertEqual(json.loads((TS.OUT / "src" / "de.json").read_text())["ep-1"], TS.show_hash(e2)); self.assertEqual(json.loads((TS.OUT / "src" / "fr.json").read_text())["ep-1"], TS.show_hash(e))
        self.assertEqual(json.loads((TS.OUT / "stale.json").read_text()), {})   # de erledigt; die Liste von fr bleibt, wie sie vor dem Lauf war

    @unittest.skipIf(TN is None, "translate_notes braucht requests")
    def test_notes_stale_run_stops(self):
        s = ShowAndNotes("run_notes"); s.__dict__.update(self.__dict__)
        e = ep(); s.run_notes([e], "--langs", "de,fr"); e2 = ep(notes="<p>" + "Other notes about Outlook. " * 12 + "</p>"); f = TS.OUT / "stale.json"
        ov = {("notes", "de"): {"ep-1": {"html": {"t": "<p>Hand, schon nachgezogen</p>", "sh": TS.anchors(e2)["html"]}}}}
        with self.export(ov): s.run_notes([e2], "--langs", "de")
        self.assertEqual(json.loads(f.read_text()), {})   # Handtext gehoert zum aktuellen Original
        with self.export(status=503):
            self.assertEqual(s.run_notes([e2], "--langs", "de"), []); self.assertEqual(json.loads(f.read_text()), {})   # Liste der Sprache bleibt, kein Fehler ohne --stale
            with self.assertRaises(SystemExit): s.run_notes([e2], "--stale", "--langs", "de")
        self.assertEqual(json.loads((TS.OUT / "notes_de.json").read_text())["ep-1"], "<p>N-de__7</p>")
        with self.export(status=503, only=("fr",)):
            with self.assertRaises(SystemExit): s.run_notes([e2], "--stale", "--langs", "de,fr", "--slugs", "ep-1")   # de wird neu uebersetzt, fr ist unbekannt -> der Lauf endet rot
        hs = lambda l: json.loads((TS.OUT / "src" / f"notes_{l}.json").read_text())["ep-1"]
        self.assertEqual((hs("de"), hs("fr")), (TS.notes_hash(e2), TS.notes_hash(e)))
        with self.export({}): self.assertEqual(s.run_notes([e2], "--stale", "--langs", "de,fr"), ["fr__7"])


# ---------------- Protokoll der Handtexte, Bilder nur aus dem eigenen Bucket ----------------
class ReportAndImages(Base):
    def test_report_counts_each_hand_text_once(self):
        p = post(); self.run_blog([p], "run", "--langs", "de")
        self.overrides("lblog", "de", {"a-post": {"2": "ohne Anker", "3": {"t": "HAND drei.", "sh": OV.anchor("lblog", "3", PARAS[2])}, "5": {"t": "weg", "sh": "00000000"},
                                                  "6": {"t": "<script>x()</script>", "sh": OV.anchor("lblog", "6", PARAS[5])}}, "kein-beitrag": {"1": {"t": "x", "sh": "01234567"}, "T": {"t": "y", "sh": "01234567"}}})
        for _ in range(3): self.assertIn("HAND drei.", self.html(p))   # der Bau sieht einen Beitrag mehrfach an (Seite, Liste, Feed)
        TB.editor_view("de", p, self.rec())
        out = io.StringIO()
        with contextlib.redirect_stdout(out): got = OV.report()
        got = {k[2].split(" (")[0]: n for k, n in got.items() if k[:2] == ("lblog", "de")}
        self.assertEqual(got, {"angewendet": 1, "ohne Quell-Anker": 1, "verwaist": 1, "nach der Bereinigung leer": 1, "ohne angezeigte Fassung des Eintrags": 2})
        self.assertIn("Handtexte lblog/de: 1 ohne Quell-Anker (nicht angewendet)", out.getvalue()); self.assertIn("Handtexte lblog/de: 1 angewendet", out.getvalue())

    def test_report_for_show_and_notes(self):
        self.overrides("episode", "de", {"ep-1": {"title": "Eigener Titel", "summary": "<b></b>"}, "ep-9": {"title": "ohne Maschinenfassung"}})
        self.overrides("notes", "de", {"ep-1": {"html": "<p>Eigene Notes</p>"}, "ep-9": {"html": "<p>x</p>"}})
        for _ in range(2): OV.apply_show("de", {"ep-1": ["Maschine", "Zusammenfassung"]}); OV.apply_notes("de", {"ep-1": "<p>x</p>"})   # site_podpage und site_register lesen beide
        with contextlib.redirect_stdout(io.StringIO()): got = OV.report()
        self.assertEqual(got, {("episode", "de", "angewendet"): 1, ("episode", "de", "nach der Bereinigung leer (nicht angewendet)"): 1, ("episode", "de", "ohne Maschinenfassung der Folge (nicht angewendet)"): 1,
                               ("notes", "de", "angewendet"): 1, ("notes", "de", "ohne Maschinenfassung der Folge (nicht angewendet)"): 1})

    def test_site_build_reports_at_the_end(self):
        s = (ROOT / "generate_site.py").read_text("utf-8"); at = s.index("_OVR.report()")
        for before in ("CBL.translations(", "LBL.items(BASE)", "PP.build(_ctx)", "REG.build(write"): self.assertLess(s.index(before), at, before)   # nach allen Lesern der Handtexte

    def test_hand_text_keeps_only_images_of_the_bucket_or_of_the_post(self):
        own, src, evil = "https://img.m365.fm/blog/a.webp", "https://cdn.example.org/pic.png?a=1&b=2", "https://evil.example/x.png"
        self.assertEqual(OV.clean("lblog", "1", f'<img src="{evil}" onerror=alert(1)>'), "")
        self.assertEqual(OV.clean("lblog", "1", f'Text <img src="{evil}"> bleibt <img src="{own}" alt="A">'), f'Text  bleibt <img src="{own}" alt="A" loading="lazy">')
        self.assertEqual(OV.clean("lblog", "1", '<img src="https://img.m365.fm.evil.example/x.png">'), "")
        self.assertEqual(OV.clean("notes", "html", f'<p>ok</p><img src="{evil}">', '<p>Maschine</p>'), "<p>ok</p>")
        ref = TB.source_of(post([f'Intro with a picture <img src="{src}" alt="Chart"> and some more text about Fabric.'], slug="img-post"))[1][-1][1]
        self.assertIn("&amp;b=2", ref)
        self.assertIn("pic.png", OV.clean("lblog", "1", f'Hand <img src="{src}" alt="Diagramm">', ref)); self.assertNotIn("pic.png", OV.clean("lblog", "1", f'Hand <img src="{src}">'))
        import site_r2 as R2
        with patch.object(R2, "MAP", {"https://old.example/pod.png": own}), patch.object(R2, "_RX", re.compile(re.escape("https://old.example/pod.png"))):
            self.assertIn("old.example/pod.png", OV.clean("lblog", "1", 'x <img src="https://old.example/pod.png">'))   # der Seitenbau schreibt die Adresse auf den Bucket um
            self.assertEqual(OV.clean("lblog", "1", f'<img src="{evil}?u=https://old.example/pod.png">'), "")

    def test_images_in_shown_versions(self):
        src = "https://cdn.example.org/pic.png"; paras = [f'Intro with a picture <img src="{src}" alt="Chart"> and some more text about Fabric.', PARAS[1], PARAS[2]]
        p = post(paras, slug="img-post"); self.run_blog([p], "run", "--langs", "de")
        u = dict(TB.source_of(p)[1])
        self.overrides("lblog", "de", {"img-post": {"2": {"t": f'Bild umgehaengt <img src="{src}">', "sh": OV.anchor("lblog", "2", u["2"])},
                                                    "3": {"t": 'Fremdes Bild <img src="https://evil.example/x.png"> im Handtext', "sh": OV.anchor("lblog", "3", u["3"])}}})
        html = self.html(p)
        self.assertIn("Bild umgehaengt <img", html); self.assertIn("Fremdes Bild  im Handtext", html); self.assertNotIn("evil.example", html)
        self.overrides("notes", "de", {"ep-1": {"html": f'<p>Hand</p><img src="{src}"><img src="https://evil.example/x.png">'}})
        got = OV.apply_notes("de", {"ep-1": f'<p>Maschine</p><img src="{src}" alt="" loading="lazy">'})["ep-1"]
        self.assertIn(src, got); self.assertNotIn("evil.example", got); self.assertIn("<p>Hand</p>", got)


# ---------------- PR #316: Uebersetzung der neu geschriebenen Show Notes auf der Struktur von #315 ----------------
RWN = {"meta": "Meta text.", "summary": "Short summary of the episode about gateways.", "key_points": ["One.", "Two.", "Three.", "Four."], "chapters": [], "entities": ["power-bi"],
       "faq": [{"q": "Why?", "a": "Because."}, {"q": "How?", "a": "Like this."}]}


class _Pages:
    """Stand der englischen Seiten fuer site_shownotes_seo.source_for_translation ohne Netz: slug -> Regel (Standard: ausfuehrlich)."""
    def __init__(self, rules): self.rules = rules
    def rule(self, e): return self.rules.get(e["slug"], "long")


def tep(k, notes="<p>Short thin notes about gateways.</p>"):
    return {**ep(slug=f"ep-{k}", notes=notes), "id": 100 + k}


@unittest.skipIf(TN is None, "translate_notes braucht requests")
class RewrittenNotes(Base):
    def setUp(self):
        super().setUp()
        import site_shownotes_seo as SSEO
        self.SSEO = SSEO; self.rules = {}; self.budget = []; self.left = None
        for obj, name, val in ((SSEO, "DIR", self.tmp / "shownotes_en"), (SSEO, "_PAGES", [_Pages(self.rules)]), (TN, "TOP", 0), (TN, "remaining_eur", lambda job, model: self.left)):
            p = patch.object(obj, name, val); p.start(); self.addCleanup(p.stop)
        p = patch.dict(SSEO._CACHE, clear=True); p.start(); self.addCleanup(p.stop)

    def rewrite(self, slugs, rule="thin"):
        store = self.SSEO.load_all()
        for s in slugs: store[s] = {"h_src": "h", "v": 1, "notes": RWN, "model": "m", "ts": "t"}; self.rules[s] = rule
        self.SSEO.save_all(store); self.SSEO._CACHE.clear()

    def go(self, eps, *argv):
        """Ein Lauf von translate_notes.py wie im Workflow (NOTES_TOP=0); -> Anfragen des Batches (leer: nichts gesendet)."""
        self._reqs = []

        def call(method, path, body=None, job="translate_notes"):
            self._reqs = body["requests"]; return {"id": "b1", "processing_status": "ended", "request_counts": {}, "results_url": "https://api.anthropic.com/v1/results"}

        def results(req, timeout=0):
            return io.BytesIO("\n".join(json.dumps({"custom_id": r["custom_id"], "result": {"type": "succeeded", "message": {"usage": {"input_tokens": 9, "output_tokens": 9}, "stop_reason": "end_turn",
                              "content": [{"type": "text", "text": "<p>N-" + r["custom_id"] + "</p>"}]}}}) for r in self._reqs).encode())

        def budget(job, model, est):
            self.budget.append(est); return True
        with patch.object(TN.P, "load", lambda name: list(eps)), patch.object(TN, "OUT", TS.OUT), patch.object(TN, "ranking", lambda eps: list(eps)), patch.object(TN, "call", call), \
                patch.object(TN, "urlopen", results), patch.object(TN, "check_budget", budget), patch.object(TN, "report_usage", lambda *a, **k: None), patch.object(TN.time, "sleep", lambda s: None), \
                patch.object(sys, "argv", ["translate_notes.py", *argv]), contextlib.redirect_stdout(io.StringIO()) as out:
            TN.main()
        self.out = out.getvalue()
        return self._reqs

    def notes(self, lang): return json.loads((TS.OUT / f"notes_{lang}.json").read_text("utf-8"))
    def src(self, lang): return json.loads((TS.OUT / "src" / f"notes_{lang}.json").read_text("utf-8"))

    def test_new_rewrite_is_translated_once_in_every_language_outside_the_top_list(self):
        e = tep(1); self.rewrite([e["slug"]])
        html = self.SSEO.html_for_translation(RWN)
        self.assertEqual(TS.notes_source(e), html); self.assertEqual(TS.notes_hash(e), fields_hash(html))   # tm_hash.fields_hash, kein anderer Hash
        reqs = self.go([e], "--langs", "de,fr")
        self.assertEqual(sorted(r["custom_id"] for r in reqs), ["de__101", "fr__101"])
        p = reqs[0]["params"]; self.assertEqual(p["messages"][0]["content"], html); self.assertEqual(p["max_tokens"], 6000)
        self.assertEqual(p["thinking"], {"type": "disabled"})   # Haiku: disabled ist erlaubt
        self.assertNotIn("<a ", html); self.assertNotIn("href", p["system"])   # Themen-Zeile setzt der Seitenbau, nicht die Uebersetzung
        self.assertEqual(self.notes("de")["ep-1"], "<p>N-de__101</p>"); self.assertEqual(self.src("de")["ep-1"], fields_hash(html))
        self.assertEqual(self.go([e], "--langs", "de,fr"), [])   # nur einmal

    def test_existing_translation_of_the_old_thin_notes_is_never_overwritten(self):
        e = tep(1); (TS.OUT).mkdir(parents=True, exist_ok=True); (TS.OUT / "notes_de.json").write_text(json.dumps({"ep-1": "<p>Alte Fassung</p>"}), "utf-8")
        self.rewrite([e["slug"]])
        reqs = self.go([e], "--langs", "de,fr")
        self.assertEqual([r["custom_id"] for r in reqs], ["fr__101"])   # nur die Sprache ohne Fassung
        self.assertEqual(self.notes("de")["ep-1"], "<p>Alte Fassung</p>"); self.assertEqual(self.src("de")["ep-1"], fields_hash(TS.notes_original(e)))   # Altbestand: Hash der bisherigen Notes
        self.assertEqual(json.loads((TS.OUT / "stale.json").read_text()), {"de": {"ep-1": ["notes_html"]}})   # gemeldet wie jede andere Aenderung
        self.overrides("notes", "de", {"ep-1": {"html": {"t": "<p>Hand</p>", "sh": OV.anchor("notes", "html", TS.notes_original(e))}}})
        self.assertEqual(self.go([e], "--stale", "--langs", "de"), [])   # Handtext sperrt
        self.assertEqual([r["custom_id"] for r in self.go([e], "--stale", "--langs", "de", "--force-manual")], ["de__101"])

    def test_episode_whose_page_keeps_its_notes_translates_the_original(self):
        e = tep(1, notes="<p>" + "Long original notes. " * 100 + "</p>"); self.rewrite([e["slug"]], rule="long")
        self.assertEqual(TS.notes_source(e), TS.notes_original(e))
        self.assertEqual(self.go([e], "--langs", "de"), [])   # NOTES_TOP=0: nichts Neues, die Neufassung ist nicht auf der Seite

    def test_no_second_hash_function(self):
        for name in ("src_hash", "load_src", "save_src", "rewritten"): self.assertFalse(hasattr(TN, name), name)
        self.assertNotIn("sha256", (ROOT / "translate_notes.py").read_text("utf-8"))

    def test_runs_are_chunked_to_the_daily_budget_and_the_rest_follows(self):
        eps = [tep(k) for k in range(1, 41)]; self.rewrite([e["slug"] for e in eps])
        one = TN.est_eur(TN.request_for("de", eps[0], True), True)
        with patch.object(TN, "RUN_EUR", one * 25.5):
            first = self.go(eps, "--langs", "de,fr")
            self.assertEqual(len(first), 25); self.assertLessEqual(self.budget[-1], one * 25.5)   # nie mehr als die Grenze je Lauf
            self.assertEqual({r["custom_id"] for r in first[:24]}, {f"{l}__{100 + k}" for k in range(1, 13) for l in ("de", "fr")})   # ganze Folgen zuerst
            self.assertIn("bleiben fuer den naechsten Lauf", self.out)
            self.assertEqual(len(self.src("de")) + len(self.src("fr")), 25)   # Hash nur fuer Gesendetes
            self.left = one * 10.2; second = self.go(eps, "--langs", "de,fr")   # Rest des Haiku-Tagesbudgets ist kleiner als NOTES_RUN_EUR
            self.assertEqual(len(second), 10); self.assertFalse({r["custom_id"] for r in first} & {r["custom_id"] for r in second})
            self.left = 0.0; self.assertEqual(self.go(eps, "--langs", "de,fr"), []); self.assertIn("naechste Lauf holt alles nach", self.out)
            self.left = None; rest = self.go(eps, "--langs", "de,fr"); self.assertEqual(len(rest), 25)
            last = self.go(eps, "--langs", "de,fr"); self.assertEqual(len(last), 20)
        self.assertEqual(len(self.notes("de")) + len(self.notes("fr")), 80); self.assertEqual(self.go(eps, "--langs", "de,fr"), [])   # nichts endgueltig uebersprungen

    def test_realistic_backlog_fits_the_haiku_day(self):
        """316-2: 300 Folgen x 14 Sprachen haetten mit der alten Schaetzung (9.000 Token je Anfrage, ein Batch) 9 EUR verlangt und den Lauf fuer immer uebersprungen."""
        eps = [tep(k) for k in range(1, 301)]; self.rewrite([e["slug"] for e in eps])
        reqs = self.go(eps)
        self.assertEqual(len(reqs), 300 * len(TS.NAMES)); self.assertLessEqual(self.budget[-1], TN.RUN_EUR)   # kurze Quellen: realistisch geschaetzt passt alles in einen Lauf
        self.assertGreater(TN.estimated_eur(len(json.dumps(reqs)) // 3, len(reqs) * 9000, batch=True), 5)   # alte Schaetzung: ueber dem Tagesbudget, Lauf uebersprungen

    def test_request_thinking_only_off_for_haiku(self):
        e = tep(1); self.rewrite([e["slug"]])
        with patch.object(TN, "MODEL", "claude-sonnet-5-5"): self.assertNotIn("thinking", TN.request_for("de", e, True)["params"])
        with patch.object(TN, "MODEL", "claude-haiku-5-5"): self.assertEqual(TN.request_for("de", e, False)["params"]["thinking"], {"type": "disabled"})


# ---------------- 315-8: Workflows ----------------
class Workflows(unittest.TestCase):
    def wf(self, name): return (ROOT / ".github" / "workflows" / name).read_text("utf-8")

    def test_blog_workflow_reaches_stale_force_manual_and_wishes(self):
        s = self.wf("translate-blog.yml")
        self.assertIn("options: [plan, pilot, run, stale, collect, sample]", s)
        for flag in ("--force-manual", "--wishes", "--redo"): self.assertIn(f'ARGS="$ARGS {flag}"', s)
        self.assertIn('MODE_IN: ${{ inputs.mode || \'scheduled\' }}', s)
        sched = s[s.index('if [ "$MODE" = "scheduled" ]'):]; sched = sched[:sched.index("fi")]
        self.assertIn("MODE=auto", sched); self.assertIn("MODE=collect", sched); self.assertNotIn("stale", sched)   # der Zeitplan uebersetzt nie neu
        self.assertIn('LIMIT_IN="$STALE_LIMIT"', s)   # stale ohne Auswahl bleibt begrenzt
        self.assertNotIn("data/blog_i18n/tm", s)

    def test_show_and_notes_workflows_pass_the_flags(self):
        for name, script in (("translate-show.yml", "translate_show.py $ARGS"), ("translate-notes.yml", "translate_notes.py $ARGS")):
            s = self.wf(name)
            for flag in ("--stale", "--slugs $SLUGS_IN", "--langs $LANGS_IN", "--force-manual", "--wishes"): self.assertIn(flag, s, name)
            self.assertIn("python " + script, s); self.assertNotIn("schedule:", s)   # nur von Hand
            self.assertIn("stale: {", s); self.assertIn("default: false", s)


if __name__ == "__main__":
    unittest.main()
