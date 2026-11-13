"""Uebersetzer-Team fuer Content-Pakete (imports/blog/en/*.md): Quelle, Schluessel, Sprachfassungen und deren Seiten (hreflang, Original-Link, KI-Hinweis)."""
import gzip
import json
import re
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch

import site_blog as BLG
import site_content_blog as CBL
import site_index_rule as IR
import site_legacy_blog as LBL
import translate_blog as TB

BASE = "https://example.test"
SLUG = "sample-post"
WORDS = " ".join(f"word{i}" for i in range(320))


def package(date, status="approved", title="Azure meets SAP: a sample article for tests", extra=""):
    return f"""---
title: "{title}"
summary: "A sample summary that is long enough for the content package check, about SAP on Microsoft Azure."
status: {status}
publish: true
author: mirko-p
date: {date}
topics: [sap]
faq:
  - q: Can any Azure virtual machine run SAP HANA?
    a: "No. Only certified VM types are supported."
---

As a Microsoft MVP I write about **SAP on Azure** and [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/).

## What SAP on Azure means

{WORDS}

![Landing zone diagram](https://img.m365.fm/blog/sap-landing-zone.webp)

- First point about Azure
- Second point about SAP
{extra}
"""


def fake_translate(lang, units):
    """Simulierte Uebersetzung: Text bekommt ein Sprachpraefix, Inline-HTML bleibt (wie es die QA verlangt)."""
    return {i: f"[{lang}] {t}" for i, t in units}


class ContentBlogI18nTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        old = (datetime.now(timezone.utc) - timedelta(days=60)).strftime("%Y-%m-%d")
        d = self.tmp / "imports" / "blog"
        (d / "en").mkdir(parents=True); (d / "de").mkdir()
        (d / "en" / f"{SLUG}.md").write_text(package(self.today), "utf-8")
        (d / "en" / "old-post.md").write_text(package(old, title="An older approved sample article"), "utf-8")
        (d / "en" / "draft-post.md").write_text(package(self.today, status="review"), "utf-8")
        (d / "de" / "deutscher-beitrag.md").write_text(package(self.today, title="Ein deutscher Beitrag als Paket"), "utf-8")
        legacy = [{"slug": SLUG, "title": "Legacy post with the same slug", "html": "<p>Legacy text for the same slug.</p>", "desc": "", "iso": "2026-01-01T00:00:00+00:00"}]
        (self.tmp / "legacy.json.gz").write_bytes(gzip.compress(json.dumps(legacy).encode()))
        self.patches = [patch.object(CBL, "DIR", d), patch.object(TB, "OUT", self.tmp / "blog_i18n"), patch.object(TB, "SRC", self.tmp / "legacy.json.gz")]
        for p in self.patches: p.start()

    def tearDown(self):
        for p in self.patches: p.stop()

    # ---------- Quelle ----------
    def test_sources_only_approved_english_packages(self):
        srcs = {s["cp_slug"]: s for s in CBL.tr_sources()}
        self.assertEqual(set(srcs), {SLUG, "old-post"})   # review und deutsche Pakete nicht
        s = srcs[SLUG]
        self.assertEqual(s["slug"], "content/" + SLUG)
        self.assertEqual(s["author"], "mirko-p")
        self.assertTrue(s["desc"].startswith("A sample summary"))
        self.assertEqual(s["faq"], [{"name": "Can any Azure virtual machine run SAP HANA?", "acceptedAnswer": {"text": "No. Only certified VM types are supported."}}])
        self.assertTrue(s["iso"].startswith(self.today))
        self.assertIn("<h2>What SAP on Azure means</h2>", s["html"])
        self.assertIn('<figure><img src="https://img.m365.fm/blog/sap-landing-zone.webp"', s["html"])
        # dasselbe HTML wie im Index fuer den Worker (site_content_blog.render)
        items, _ = CBL.collect(CBL._AnyTopic())
        self.assertEqual(next(i["html"] for i in items if i["slug"] == SLUG), s["html"])

    def test_keys_do_not_collide_with_legacy_slugs(self):
        ps = TB.posts()
        slugs = [p["slug"] for p in ps]
        self.assertIn(SLUG, slugs); self.assertIn("content/" + SLUG, slugs)
        self.assertEqual(len(slugs), len(set(slugs)))
        self.assertNotEqual(TB.key(SLUG), TB.key("content/" + SLUG))
        legacy = next(p for p in ps if p["slug"] == SLUG); content = next(p for p in ps if p["slug"] == "content/" + SLUG)
        TB.save_lang("de", {SLUG: {"h": TB.source_of(legacy)[2], "seg": {"T": "Alt"}, "ok": False}, "content/" + SLUG: {"h": TB.source_of(content)[2], "seg": {"T": "Neu"}, "ok": False}})
        have = TB.load_lang("de")
        self.assertEqual(have[SLUG]["seg"]["T"], "Alt"); self.assertEqual(have["content/" + SLUG]["seg"]["T"], "Neu")

    def test_source_units_cover_title_summary_faq_and_text(self):
        s = next(p for p in TB.content_posts() if p["cp_slug"] == SLUG)
        tpl, units, h = TB.source_of(s)
        ids = [i for i, _ in units]
        self.assertEqual(ids[:4], ["T", "D", "Q1", "A1"])
        self.assertIn("1", ids)
        self.assertEqual(dict(units)["T"], "Azure meets SAP: a sample article for tests")
        self.assertIn('<img src="https://img.m365.fm/blog/sap-landing-zone.webp"', tpl)   # Bild bleibt Vorlage, wird nicht uebersetzt
        self.assertFalse(any("img.m365.fm" in t for _, t in units))
        self.assertEqual(h, TB.source_of(s)[2])   # stabiler Hash

    def test_auto_mode_and_slug_filter_pick_content_packages(self):
        a = TB.args(); a["mode"] = "auto"
        _, ps = TB.select(a, TB.posts())
        picked = {p.get("cp_slug") or p["slug"] for p in ps}
        self.assertIn(SLUG, picked)
        self.assertNotIn("old-post", picked)   # aelter als NEW_DAYS
        a = TB.args(); a["slugs"] = ["old-post"]
        _, ps = TB.select(a, TB.posts())
        self.assertEqual([p["slug"] for p in ps], ["content/old-post"])

    def test_cost_estimate_for_14_languages(self):
        s = next(p for p in TB.content_posts() if p["cp_slug"] == SLUG)
        c = TB.post_cost(TB.source_of(s)[1])
        self.assertGreater(c, 0); self.assertLess(c, 0.05)

    # ---------- Sprachfassungen ----------
    def store(self, langs):
        s = next(p for p in TB.content_posts() if p["cp_slug"] == SLUG)
        tpl, units, h = TB.source_of(s)
        for lang in langs:
            TB.save_lang(lang, {s["slug"]: {"h": h, "n": len(units), "seg": fake_translate(lang, units), "ok": True}})

    def original(self):
        return {"id": 77, "handle": "mirko-p", "name": "Mirko Peters", "slug": SLUG, "lang": "en", "title": "Azure meets SAP: a sample article for tests", "summary": "x",
                "body": "", "html": "<p>English original</p>", "topics": [], "published": 1793836800, "created": 1793836800, "updated": 1793836800, "votes": 3, "coauthors": [], "faq": []}

    def test_translations_follow_legacy_rules(self):
        self.store(["de", "fr"])
        with patch.object(LBL, "tr_config", return_value=(["de", "fr", "es"], ["de"])), patch.object(IR, "MIN_CHARS", 10 ** 9):   # Freigabeliste allein (die Laengenregel ab 2500 Zeichen: tests/test_index_rule.py)
            out = CBL.translations(BASE, [self.original()], {"sap": {}})
        by = {p["lang"]: p for p in out}
        self.assertEqual(set(by), {"de", "fr"})   # es: noch nicht uebersetzt
        de = by["de"]
        self.assertEqual((de["slug"], de["handle"], de["id"], de["tr_of"]), (SLUG, "mirko-p", 77, "en"))
        self.assertTrue(de["ai_tr"] and de["legacy"] and de["tr_index"])
        self.assertFalse(by["fr"]["tr_index"])
        self.assertTrue(de["title"].startswith("[de] Azure meets SAP"))
        self.assertTrue(de["summary"].startswith("[de] A sample summary"))
        self.assertEqual(de["faq"][0]["q"], "[de] Can any Azure virtual machine run SAP HANA?")
        self.assertIn("[de]", de["html"]); self.assertEqual(de["images"], ["https://img.m365.fm/blog/sap-landing-zone.webp"])
        self.assertTrue(all(u.startswith("https://img.m365.fm/") for u in re.findall(r'<img[^>]+src="([^"]+)"', de["html"])))

    def test_no_translations_without_live_original_or_after_change_or_on_slug_clash(self):
        self.store(["de"])
        with patch.object(LBL, "tr_config", return_value=(["de"], ["de"])):
            self.assertEqual(CBL.translations(BASE, [], {"sap": {}}), [])   # Original noch nicht live
            with patch.object(LBL.P, "load", return_value=[{"slug": SLUG}]):
                self.assertEqual(CBL.translations(BASE, [self.original()], {"sap": {}}), [])   # Slug eines frueheren Beitrags
            f = CBL.DIR / "en" / f"{SLUG}.md"
            f.write_text(package(self.today, extra="New paragraph added later."), "utf-8")
            self.assertEqual(CBL.translations(BASE, [self.original()], {"sap": {}}), [])   # Paket geaendert -> alte Fassung nicht zeigen

    def test_no_translations_when_slug_belongs_to_another_post(self):
        """Der Worker uebernimmt das Paket nicht, wenn der Slug schon von Hand vergeben ist: keine Fassungen am fremden Original."""
        self.store(["de"])
        other = {**self.original(), "title": "My unrelated manual post about Teams licensing"}
        with patch.object(LBL, "tr_config", return_value=(["de"], ["de"])):
            self.assertEqual(CBL.translations(BASE, [other], {"sap": {}}), [])
            self.assertEqual(len(CBL.translations(BASE, [self.original()], {"sap": {}})), 1)

    # ---------- Wiederholungen ----------
    def submit_auto(self, tries):
        s = next(p for p in TB.content_posts() if p["cp_slug"] == SLUG)
        tpl, units, h = TB.source_of(s)
        TB.save_lang("de", {s["slug"]: {"h": h, "n": len(units), "seg": {}, "ok": False, "tries": tries}})
        a = TB.args(); a["mode"] = "auto"; a["langs"] = ["de"]
        calls = []
        def api(method, path, body=None, raw=False):
            calls.append(path); return {"id": f"b{len(calls)}"}
        with patch.object(TB, "api", api), patch.object(TB, "check_budget", lambda *x, **k: True), \
             patch.object(TB, "spent_month", lambda *x: 0.0), patch.object(TB, "pending_cost", lambda *x: 0.0), patch.object(TB, "BUDGET", 25.0):
            n = TB.submit(a)
        return n, calls

    def test_auto_stops_resending_after_max_tries(self):
        n, calls = self.submit_auto(TB.MAX_TRIES)
        self.assertEqual((n, calls), (0, []))   # nicht alle 3 h erneut senden
        n, calls = self.submit_auto(TB.MAX_TRIES - 1)
        self.assertGreater(n, 0); self.assertEqual(calls, ["/v1/messages/batches"])

    # ---------- Seiten ----------
    def test_rendered_pages_hreflang_original_link_and_directory(self):
        self.store(["de", "fr"])
        with patch.object(LBL, "tr_config", return_value=(["de", "fr"], ["de"])), patch.object(IR, "MIN_CHARS", 10 ** 9):   # Freigabeliste allein (die Laengenregel ab 2500 Zeichen: tests/test_index_rule.py)
            posts = [self.original()] + CBL.translations(BASE, [self.original()], {"sap": {}})
        files, r2, pages, sitemap = {}, {}, {}, []

        def page(lang, title, desc, canonical, body, alternates=None, jsonld=None, xdefault=None, noindex=False, **kw):
            pages[canonical] = {"alt": alternates, "xdefault": xdefault, "noindex": noindex, "body": body}
            return body
        g = {"BASE": BASE, "write": files.__setitem__, "write_r2": r2.__setitem__, "page": page, "header": lambda lang, s: "", "footer": lambda lang: "", "footer_en": lambda: "",
             "LANGS": {}, "sitemap": sitemap, "TODAY": self.today}
        BLG.build(g, posts, [{"handle": "mirko-p", "name": "Mirko Peters"}], "https://api.example.test")
        u_en = f"{BASE}/community/u/mirko-p/blog/{SLUG}/"
        u_de = f"{BASE}/de/community/u/mirko-p/blog/{SLUG}/"
        u_fr = f"{BASE}/fr/community/u/mirko-p/blog/{SLUG}/"
        # Sprachfassungen liegen im R2-Bucket, nicht in GitHub Pages
        self.assertIn(f"de/community/u/mirko-p/blog/{SLUG}/index.html", r2)
        self.assertIn(f"fr/community/u/mirko-p/blog/{SLUG}/index.html", r2)
        self.assertNotIn(f"de/community/u/mirko-p/blog/{SLUG}/index.html", files)
        # hreflang nur zwischen Original und indexierbaren Sprachen
        self.assertEqual(pages[u_en]["alt"], {"en": u_en, "de": u_de})
        self.assertEqual(pages[u_de]["alt"], {"en": u_en, "de": u_de})
        self.assertEqual(pages[u_de]["xdefault"], u_en)
        self.assertFalse(pages[u_de]["noindex"]); self.assertTrue(pages[u_fr]["noindex"]); self.assertIsNone(pages[u_fr]["alt"])
        # KI-Hinweis + Link aufs englische Original
        body = pages[u_de]["body"]
        self.assertIn(f'href="{u_en}" hreflang="en"', body)
        self.assertIn("Englisches Original lesen", body)
        self.assertIn("Automatisch mit KI", body)
        self.assertNotIn('class="bl-vote"', body)   # statisch wie die frueheren Sprachfassungen
        # Verzeichnis der Sprache und Sitemap
        self.assertIn(f'href="{u_de}"', files["de/community/blog/index.html"])
        self.assertIn(f'href="{u_de}"', files["de/community/u/mirko-p/blog/index.html"])
        sm = {x[0] for x in sitemap}
        self.assertIn(u_de, sm); self.assertNotIn(u_fr, sm); self.assertIn(u_en, sm)


if __name__ == "__main__":
    unittest.main()


class MonthlyBudget(unittest.TestCase):
    """Mirko, 5.11.2026: BLOG_BUDGET_USD ist ein Monatsbudget (25 $), nicht mehr die Summe seit Beginn."""
    def test_counts_only_current_month(self):
        u = {"input_tokens": 10**9, "output_tokens": 10**9,   # alte Gesamtsumme (> 90 $) zaehlt nicht
             "months": {"2026-10": {"input_tokens": 10**8, "output_tokens": 10**8}, "2026-11": {"input_tokens": 1_000_000, "output_tokens": 1_000_000}}}
        with patch.object(TB, "jload", lambda name, default: u if name == "usage.json" else default):
            self.assertAlmostEqual(TB.spent_month("2026-11"), TB.cost(1_000_000, 1_000_000))
            self.assertEqual(TB.spent_month("2026-12"), 0)
            self.assertGreater(TB.spent(), 25)

    def test_no_months_yet(self):
        with patch.object(TB, "jload", lambda name, default: {"input_tokens": 10**9, "output_tokens": 10**9} if name == "usage.json" else default):
            self.assertEqual(TB.spent_month(), 0)


class QaScript(unittest.TestCase):
    """Schrift-Pruefung: Code und Produktnamen bleiben lateinisch und duerfen ja/ko/he nicht dauerhaft durchfallen lassen."""
    def test_code_only_segment_passes(self):
        code = "<code>service_events | summarize count() by bin(TimeGenerated, 1h) | render timechart</code>"
        for lang in ("ja", "ko", "he", "ru"):
            self.assertTrue(TB.qa(lang, code, code)[0], lang)

    def test_names_do_not_count_against_dense_scripts(self):
        src = "What is Azure Center for SAP solutions?"
        self.assertTrue(TB.qa("ja", src, "Azure Center for SAP solutionsとは何ですか？")[0])
        self.assertTrue(TB.qa("ko", src, "Azure Center for SAP solutions란 무엇입니까?")[0])
        title = "Azure meets SAP: SAP on Azure Explained for Microsoft Teams"
        self.assertTrue(TB.qa("ja", title, "Azure meets SAP：Microsoft Teams向けSAP on Azure解説")[0])

    def test_untranslated_text_still_fails(self):
        src = "The landing zone separates production and test workloads in their own subscriptions."
        for lang in ("ja", "ko", "he", "ru", "ar"):
            self.assertEqual(TB.qa(lang, src, src)[:2], (False, "falsche-schrift"), lang)
