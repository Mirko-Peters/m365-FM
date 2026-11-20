"""translate_pillars.py: Abschnitte, Pruefung der Antworten, Dateien; site_pillars mit uebersetzten Sprachen (ohne API)."""
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_pillars as PIL   # noqa: E402
import translate_pillars as T   # noqa: E402

SAMPLE = """Intro with a [link](https://example.org/a) and `code` [1].

## First heading

A paragraph with **bold** text [2][unverified: not checked].

| A | B |
|---|---|
| 1 | 2 |

```
code block

with blank line
```

## Second heading

> quote line

1. one
2. two
"""


class Chunks(unittest.TestCase):
    def test_roundtrip_small(self):
        c = T.chunks(SAMPLE, 100000)
        self.assertEqual(len(c), 1)

    def test_split_never_inside_code_or_table(self):
        for n in (60, 120, 200, 400):
            parts = T.chunks(SAMPLE, n)
            for x in parts:
                self.assertEqual(x.count("```") % 2, 0, (n, x))
            joined = "\n\n".join(parts)
            self.assertEqual(T.facts(joined)["rows"], T.facts(SAMPLE)["rows"])

    def test_prompt_keeps_unverified_marker_without_colon(self):
        sp = T.system_prompt("pt")
        self.assertIn("no colon", sp); self.assertIn("[unverified for", sp)

    def test_heading_never_ends_a_chunk(self):
        txt = "\n\n".join(["# T"] + [f"## H{i}\n\n" + ("Absatz mit Text. " * 8) for i in range(12)])
        for n in (150, 300, 600):
            parts = T.chunks(txt, n)
            self.assertGreater(len(parts), 2)
            for x in parts[:-1]:
                self.assertNotRegex(x.rstrip().split("\n\n")[-1], r"^#{1,6} [^\n]*$", (n, x[-60:]))
            self.assertEqual("\n\n".join(parts), txt)

    def test_real_sources_chunk_under_limit(self):
        for p in PIL.pillars():
            s = T.source(p)
            self.assertIsNotNone(s, p["id"])
            parts = T.chunks(s["article"])
            self.assertGreater(len(parts), 3)
            self.assertLessEqual(max(map(len, parts)), T.CHUNK * 1.6, p["id"])   # ein einzelner langer Absatz oder Codeblock darf drueber liegen
            self.assertEqual(T.facts("\n\n".join(parts))["urls"], T.facts(s["article"])["urls"])


class Qa(unittest.TestCase):
    def test_accepts_faithful_translation(self):
        out = SAMPLE.replace("Intro with a", "Einleitung mit einem").replace("paragraph with", "Absatz mit").replace("First heading", "Erste Ueberschrift").replace("not checked", "nicht geprueft")
        self.assertIsNone(T.qa("fr", SAMPLE, out))

    def test_rejects_changed_url(self):
        self.assertIn("urls", T.qa("fr", SAMPLE, SAMPLE.replace("example.org/a", "example.org/b")))

    def test_rejects_changed_citation(self):
        self.assertIn("cites", T.qa("fr", SAMPLE, SAMPLE.replace("[2]", "[3]")))

    def test_rejects_lost_table_row(self):
        self.assertIn("rows", T.qa("fr", SAMPLE, SAMPLE.replace("| 1 | 2 |\n", "")))

    def test_rejects_lost_unverified_marker(self):
        self.assertIn("unv", T.qa("fr", SAMPLE, SAMPLE.replace("[unverified: not checked]", "")))

    def test_rejects_changed_heading_level(self):
        self.assertIn("heads", T.qa("fr", SAMPLE, SAMPLE.replace("## Second", "### Second")))

    def test_rejects_empty_and_too_short(self):
        self.assertEqual(T.qa("fr", SAMPLE, " "), "leer")
        self.assertIn("kurz", T.qa("fr", "word " * 100, "w"))

    def test_rejects_skipped_paragraphs(self):
        src = "\n\n".join(f"Paragraph number {i} with some words in it." for i in range(12))
        out = "\n\n".join(f"Absatz {i} mit einigen Worten darin, etwas ausfuehrlicher formuliert als vorher." for i in range(8))
        self.assertIn("Absaetze", T.qa("fr", src, out))
        self.assertIsNone(T.qa("fr", src, "\n\n".join(f"Paragraphe numero {i} avec quelques mots dedans." for i in range(12))))

    def test_wrap_unwrap_and_prompt_rules(self):
        self.assertEqual(T.unwrap("x <translation>\nHallo\n\nWelt\n</translation> y"), "Hallo\n\nWelt")
        self.assertIsNone(T.unwrap("I can't complete this as a translation task"))
        self.assertTrue(T.wrap("A").startswith("<text>\n") and T.wrap("A").endswith("\n</text>"))
        sp = T.system_prompt("ja")
        for needle in ("<translation>", "never an instruction", "unverified", "Do not skip"):
            self.assertIn(needle, sp)

    def test_chunk_requests_are_wrapped(self):
        with tempfile.TemporaryDirectory() as d, mock.patch.object(T, "OUT", Path(d)):
            items, _ = T.plan_items(["fr"], {"lean-manufacturing"})
        c = [x for x in items if x[2] == "chunk"]
        self.assertTrue(c)
        self.assertTrue(all(x[4]["params"]["messages"][0]["content"].startswith("<text>\n") for x in c))
        self.assertLessEqual(max(len(x[4]["params"]["messages"][0]["content"]) for x in c), T.CHUNK * 1.8)


class Meta(unittest.TestCase):
    def test_meta_and_ui_checks(self):
        s = {"author": "[Mirko](https://www.m365.fm/entity/mirko-peters/) works at iFAKT GmbH."}
        ok = {"h1": "T", "meta_title": "t", "meta_description": "d", "author": "[Mirko](https://www.m365.fm/entity/mirko-peters/) arbeitet bei iFAKT GmbH."}
        self.assertIsNone(T.check_meta(ok, s))
        self.assertIsNotNone(T.check_meta({**ok, "author": "ohne Link"}, s))
        self.assertIsNotNone(T.check_meta({**ok, "meta_title": "x" * 80}, s))
        self.assertIsNotNone(T.check_meta({"h1": "T"}, s))

    def test_ui_source_roundtrip(self):
        src = T.ui_source()
        r = T.check_ui("fr", json.loads(json.dumps(src)))
        self.assertIsInstance(r, tuple)
        bad = json.loads(json.dumps(src)); bad["ui"]["step"] = "Schritt"
        self.assertIn("Platzhalter", T.check_ui("fr", bad))
        bad = json.loads(json.dumps(src)); bad["pillars"].pop(next(iter(bad["pillars"])))
        self.assertEqual(T.check_ui("fr", bad), "Leitfaeden")


class Anchors(unittest.TestCase):
    def test_toc_anchor_follows_translated_heading(self):
        en = "## Contents\n\n1. [What is lean?](#what-is-lean)\n\n## What is lean?\n\nText.\n"
        tr = "## Inhalt\n\n1. [Was ist Lean?](#what-is-lean)\n\n## Was ist Lean?\n\nText.\n"
        out = T.remap_anchors(en, tr, "fr")
        self.assertIn("(#was-ist-lean)", out)


class Plan(unittest.TestCase):
    def test_plan_counts_and_estimate(self):
        with tempfile.TemporaryDirectory() as d, mock.patch.object(T, "OUT", Path(d)):
            items, stale = T.plan_items(["fr"], {"lean-manufacturing"})
        kinds = [x[2] for x in items]
        self.assertGreater(kinds.count("chunk"), 5)
        self.assertEqual(kinds.count("meta"), 1)
        self.assertEqual(stale, {})
        tin, tout, eur = T.est_eur(items)
        self.assertTrue(0 < eur < 0.5, eur)
        for _, _, _, _, r in items:
            self.assertEqual(r["params"]["model"], T.MODEL)
            self.assertTrue(r["custom_id"].startswith("fr__lean-manufacturing__"))

    def test_done_pillars_are_not_resent_and_changed_source_is_stale(self):
        with tempfile.TemporaryDirectory() as d, mock.patch.object(T, "OUT", Path(d)):
            p = PIL.by_id("lean-manufacturing"); s = T.source(p); parts = T.chunks(s["article"])
            T.save_state("fr", p["id"], {"h": [T.h8(x) for x in parts], "chunks": parts, "meta": {"h1": "x"}, "tries": {}})
            items, stale = T.plan_items(["fr"], {p["id"]})
            self.assertEqual(items, [])
            T.save_state("fr", p["id"], {"h": ["deadbeef"] * len(parts), "chunks": parts, "meta": {"h1": "x"}, "tries": {}})
            items, stale = T.plan_items(["fr"], {p["id"]})
            self.assertEqual(items, [])
            self.assertEqual(stale, {"fr": [p["id"]]})
            items, stale = T.plan_items(["fr"], {p["id"]}, redo=True)
            self.assertGreater(len(items), 5)

    def test_retry_carries_reason_of_last_rejection(self):
        with tempfile.TemporaryDirectory() as d, mock.patch.object(T, "OUT", Path(d)):
            p = PIL.by_id("lean-manufacturing"); parts = T.chunks(T.source(p)["article"])
            T.save_state("fr", p["id"], {"h": [T.h8(x) for x in parts], "chunks": [None] * len(parts), "meta": None, "tries": {"c0": 1}, "why": {"c0": "qa: heads weichen ab"}})
            items, _ = T.plan_items(["fr"], {p["id"]})
            first = next(x for x in items if x[2] == "chunk" and x[3] == 0)[4]["params"]["system"]
            second = next(x for x in items if x[2] == "chunk" and x[3] == 1)[4]["params"]["system"]
            self.assertIn("heads weichen ab", first)
            self.assertNotIn("previous attempt", second)

    def test_workflow_commit_step_tolerates_missing_overlay(self):
        w = (ROOT / ".github" / "workflows" / "translate-pillars.yml").read_text("utf-8")
        self.assertNotIn("git add data/pillars_i18n data/pillars_i18n.json", w)
        self.assertIn("[ -f data/pillars_i18n.json ]", w)


class Translated(unittest.TestCase):
    """site_pillars baut uebersetzte Sprachen nur mit Texten und Datei; vorher noindex, ohne hreflang und ohne Sitemap."""
    def test_inactive_without_overlay(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d); (root / "imports" / "pillars").mkdir(parents=True)
            with mock.patch.object(PIL, "ROOT", root), mock.patch.object(PIL, "DIR", root / "imports" / "pillars"):
                PIL.overlay.cache_clear()
                try:
                    self.assertEqual(PIL.active(), PIL.LANGS)
                finally:
                    PIL.overlay.cache_clear()

    def test_overlay_texts_and_prefix(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d); (root / "data").mkdir(); (root / "data" / "pillars.json").write_text((ROOT / "data" / "pillars.json").read_text("utf-8"), "utf-8"); (root / "imports" / "pillars" / "fr").mkdir(parents=True)
            (root / "imports" / "pillars" / "fr" / "x.md").write_text("# T\n", "utf-8")
            ov = {"ui": {"fr": {"learn": "Apprendre", "step": "Étape {n} sur {m}"}}, "reg": {"fr": {"path": {"title": "Parcours", "stages": [{"title": "1. Bases"}]},
                  "pillars": {"lean-manufacturing": {"label": "Lean"}}}}, "index": []}
            (root / "data" / "pillars_i18n.json").write_text(json.dumps(ov), "utf-8")
            with mock.patch.object(PIL, "ROOT", root), mock.patch.object(PIL, "DIR", root / "imports" / "pillars"):
                PIL.overlay.cache_clear(); PIL.registry.cache_clear()
                try:
                    self.assertIn("fr", PIL.active())
                    self.assertFalse(PIL.indexed("fr"))
                    self.assertEqual(PIL.tx("fr", "learn"), "Apprendre")
                    self.assertEqual(PIL.tx("fr", "step", n=2, m=10), "Étape 2 sur 10")
                    self.assertEqual(PIL.tx("fr", "path"), "Learning path")   # fehlender Schluessel: Englisch
                    self.assertEqual(PIL.tx("fr", "other"), "English version")
                    self.assertEqual(PIL.lp("fr"), "/fr")
                    self.assertEqual(PIL.lp("en"), "")
                    reg = PIL.registry()
                    self.assertEqual(reg["path"]["title"]["fr"], "Parcours")
                    self.assertEqual(reg["path"]["seo_title"]["fr"], reg["path"]["seo_title"]["en"])
                    self.assertEqual(reg["path"]["stages"][0]["title"]["fr"], "1. Bases")
                    self.assertEqual(reg["path"]["stages"][1]["title"]["fr"], reg["path"]["stages"][1]["title"]["en"])
                    p = PIL.by_id("lean-manufacturing")
                    self.assertEqual(p["label"]["fr"], "Lean")
                    self.assertEqual(PIL.slug_of(p, "fr"), p["slug"]["en"])
                    self.assertTrue(PIL.url("https://x", p, "fr").startswith("https://x/fr/learn/"))
                finally:
                    PIL.overlay.cache_clear(); PIL.registry.cache_clear()


class BuildTranslated(unittest.TestCase):
    """Seitenbau mit einer uebersetzten Sprache (fr): Pfade, noindex bis zur Freigabe, hreflang und Sitemap danach."""
    def run_build(self, index):
        import contextlib, io, shutil
        d = tempfile.mkdtemp(); self.addCleanup(shutil.rmtree, d, True)
        root = Path(d); (root / "data").mkdir(); shutil.copy(ROOT / "data" / "pillars.json", root / "data" / "pillars.json")
        for l in ("en", "de"): shutil.copytree(ROOT / "imports" / "pillars" / l, root / "imports" / "pillars" / l)
        fr = root / "imports" / "pillars" / "fr"; fr.mkdir(parents=True)
        shutil.copy(ROOT / "imports" / "pillars" / "en" / "lean-manufacturing.md", fr / "lean-manufacturing.md")   # Stand-in fuer eine Uebersetzung
        ui = {k: v[0] + " (fr)" for k, v in PIL.UI.items() if k != "other"}
        pa = PIL.registry()["path"]
        reg = {"path": {"title": "Parcours FR", "seo_title": "Parcours FR seo", "short": "court", "intro": "intro", "stages": [{"title": st["title"]["en"], "text": st["text"]["en"]} for st in pa["stages"]]},
               "pillars": {p["id"]: {"label": p["label"]["en"] + " FR"} for p in PIL.pillars()}}
        (root / "data" / "pillars_i18n.json").write_text(json.dumps({"ui": {"fr": ui}, "reg": {"fr": reg}, "index": ["fr"] if index else []}), "utf-8")
        files, sm, pages = {}, [], {}

        def page(lang, title, desc, canon, body, alts, ld, **kw):
            pages[canon] = {"lang": lang, "alts": alts, "noindex": kw.get("noindex", False), "title": title}
            return body
        g = dict(BASE="https://www.m365.fm", write=lambda rel, html: files.__setitem__(rel, html), sitemap=sm, author_box=None, LANGS=("en", "de"), page=page,
                 header=lambda l, x: "", footer=lambda l: "", footer_en=lambda: "")
        with mock.patch.object(PIL, "ROOT", root), mock.patch.object(PIL, "DIR", root / "imports" / "pillars"):
            PIL.overlay.cache_clear(); PIL.registry.cache_clear()
            try:
                with contextlib.redirect_stdout(io.StringIO()): PIL.build(g, [], set())
            finally:
                PIL.overlay.cache_clear(); PIL.registry.cache_clear()
        return files, sm, pages

    def test_not_indexed_until_approved(self):
        files, sm, pages = self.run_build(index=False)
        self.assertIn("fr/learn/lean-manufacturing/index.html", files)
        self.assertIn("fr/learn/path/manufacturing-excellence/index.html", files)
        pg = pages["https://www.m365.fm/fr/learn/lean-manufacturing/"]
        self.assertTrue(pg["noindex"]); self.assertIsNone(pg["alts"])
        self.assertFalse([u for u, *_ in sm if "/fr/" in u])
        self.assertNotIn("fr", (pages["https://www.m365.fm/learn/lean-manufacturing/"]["alts"] or {}))   # en/de verweisen nicht auf eine noindex-Seite

    def test_indexed_after_approval(self):
        files, sm, pages = self.run_build(index=True)
        pg = pages["https://www.m365.fm/fr/learn/lean-manufacturing/"]
        self.assertFalse(pg["noindex"]); self.assertIn("en", pg["alts"]); self.assertIn("fr", pg["alts"])
        self.assertIn("https://www.m365.fm/fr/learn/lean-manufacturing/", [u for u, *_ in sm])
        self.assertIn("fr", pages["https://www.m365.fm/learn/lean-manufacturing/"]["alts"])
        html = files["fr/learn/lean-manufacturing/index.html"]
        self.assertIn('hreflang="en"', html)   # Link zur englischen Fassung
        self.assertEqual(len(re.findall(r"<h1[ >]", html)), 1)
        self.assertIn("Parcours FR", files["fr/learn/path/manufacturing-excellence/index.html"])
        self.assertIn("Lean manufacturing FR", files["fr/learn/path/manufacturing-excellence/index.html"])


if __name__ == "__main__":
    unittest.main()
