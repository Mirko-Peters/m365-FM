"""Pillar-Kompendien und Lernpfad (site_pillars.py, data/pillars.json, imports/pillars)."""
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_pillars as S

BASE = "https://www.m365.fm"
ALL = [(lang, p) for lang in S.LANGS for p in S.pillars()]


def ctx(**kw):
    return S.Ctx(BASE, kw.get("ents", set()), kw.get("en", set()), kw.get("de", set()))


class Registry(unittest.TestCase):
    def test_files_exist_and_slugs_unique(self):
        for lang in S.LANGS:
            slugs = [S.slug_of(p, lang) for p in S.pillars()]
            self.assertEqual(len(slugs), len(set(slugs)), lang)
            for s in slugs: self.assertTrue((ROOT / "imports" / "pillars" / lang / f"{s}.md").exists(), f"{lang}/{s}.md fehlt")

    def test_path_covers_each_pillar_once(self):
        ids = [i for st in S.registry()["path"]["stages"] for i in st["pillars"]]
        self.assertEqual(sorted(ids), sorted(p["id"] for p in S.pillars()))
        self.assertEqual(len(S.order()), len(ids))

    def test_texts_in_both_languages(self):
        pa = S.registry()["path"]
        for k in ("title", "seo_title", "short", "intro"): self.assertTrue({"en", "de"} <= set(pa[k]), k)
        self.assertLessEqual(max(len(v) for v in pa["seo_title"].values()), 60)
        for p in S.pillars(): self.assertTrue({"en", "de"} <= set(p["label"]))


class Content(unittest.TestCase):
    def test_every_file_parses_with_seo_fields(self):
        for lang, p in ALL:
            d = S.parse_file(ROOT / "imports" / "pillars" / lang / f"{S.slug_of(p, lang)}.md")
            who = f"{lang}/{p['id']}"
            self.assertTrue(d["h1"] and len(d["article"].split()) > 5000, who)
            t = S.meta_value(d["meta"], "meta title", "meta-title"); ds = S.meta_value(d["meta"], "meta description", "meta-description")
            self.assertTrue(30 <= len(t) <= 60, f"{who} Title {len(t)}")
            self.assertTrue(80 <= len(ds) <= 160, f"{who} Description {len(ds)}")
            self.assertTrue(d["sources"] and d["author"], who)

    def test_no_internal_notes_in_published_parts(self):
        rx = re.compile(r"\[(?:Editor|Redaktion)|review log|Review-Protokoll|Editorial notes|Prüfhinweise|Wettbewerbsanalyse|Competitive analysis", re.I)
        for lang, p in ALL:
            d = S.parse_file(ROOT / "imports" / "pillars" / lang / f"{S.slug_of(p, lang)}.md")
            for part in ("article", "author", "sources"): self.assertIsNone(rx.search(d[part]), f"{lang}/{p['id']} {part}")

    def test_toulouse_never_published(self):
        for lang, p in ALL:
            d = S.parse_file(ROOT / "imports" / "pillars" / lang / f"{S.slug_of(p, lang)}.md")
            for part in ("article", "author", "sources"): self.assertNotIn("toulouse", d[part].lower(), f"{lang}/{p['id']} {part}")

    def test_ifakt_disclosure_in_every_author_box(self):
        for lang, p in ALL:
            d = S.parse_file(ROOT / "imports" / "pillars" / lang / f"{S.slug_of(p, lang)}.md")
            self.assertRegex(d["author"], r"(?i)works at (\[)?iFAKT|arbeitet bei der (\[)?iFAKT|Anbieter von iFAKT|vendor of iFAKT|iFAKT GmbH", f"{lang}/{p['id']}")

    def test_render_anchors_resolve_and_markers(self):
        for lang, p in ALL:
            cx = ctx()
            d, body, src, heads = S._article(p, lang, BASE, cx)
            ids = [h[2] for h in heads]
            self.assertEqual(len(ids), len(set(ids)), f"{lang}/{p['id']} doppelte IDs")
            self.assertFalse([w for w in cx.warn if w.startswith("Sprungmarke")], f"{lang}/{p['id']}")
            self.assertNotIn("(planned)", body); self.assertNotIn("(geplant)", body)
            self.assertNotRegex(body, r"<script|<iframe")
            self.assertEqual(len(re.findall(r'<li id="src-', src)), len(set(re.findall(r'<li id="src-(\d+)"', src))))


class Links(unittest.TestCase):
    def test_pillar_links_follow_language(self):
        cx = ctx()
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/value-stream-mapping/", "en"), f"{BASE}/learn/value-stream-mapping/")
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/value-stream-mapping/", "de"), f"{BASE}/de/learn/wertstromanalyse/")
        self.assertEqual(cx.link("https://www.m365.fm/learn/wertstromanalyse/", "en"), f"{BASE}/learn/value-stream-mapping/")
        self.assertEqual(cx.link("https://www.m365.fm/learn/digital-twin/", "de"), f"{BASE}/de/learn/digital-twin/")

    def test_unknown_targets_become_text(self):
        cx = ctx(ents={"kaizen"}, en={"what-is-a-gemba-walk"}, de=set())
        self.assertIsNone(cx.link("https://www.m365.fm/entity/nope/", "en"))
        self.assertEqual(cx.link("https://www.m365.fm/entity/kaizen/", "de"), f"{BASE}/de/entity/kaizen/")
        self.assertIsNone(cx.link("https://www.m365.fm/community/u/mirko-p/blog/missing/", "en"))
        self.assertEqual(cx.link("https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/", "de"), f"{BASE}/community/u/mirko-p/blog/what-is-a-gemba-walk/")
        self.assertIsNone(cx.link("https://www.m365.fm/learn/gibt-es-nicht/", "en"))
        self.assertEqual(cx.link("https://example.org/x", "en"), "https://example.org/x")
        self.assertEqual(len(cx.warn), 3)

    def test_inline_links_and_text(self):
        cx = ctx(ents={"kaizen"})
        h = S.inline("Siehe [Kaizen](https://www.m365.fm/entity/kaizen/) und [x](https://www.m365.fm/entity/nope/) **fett**", "de", cx)
        self.assertIn(f'href="{BASE}/de/entity/kaizen/"', h); self.assertNotIn("nope", h); self.assertIn("<strong>fett</strong>", h)


class Cluster(unittest.TestCase):
    def test_assign_and_box(self):
        posts = [{"handle": "mirko-p", "slug": "what-is-a-gemba-walk", "title": "What is a gemba walk", "topics": ["gemba-walk"], "published": 5, "lang": "en"},
                 {"handle": "mirko-p", "slug": "sharepoint-permissions", "title": "SharePoint permissions", "topics": ["sharepoint"], "published": 4, "lang": "en"},
                 {"handle": "mirko-p", "slug": "what-is-a-gemba-walk", "title": "Was ist ein Gemba Walk", "topics": ["gemba-walk"], "lang": "de", "tr_of": 1}]
        S.assign(posts)
        self.assertEqual(S.ASSIGN[("mirko-p", "what-is-a-gemba-walk")][0], "shop-floor-management")
        self.assertNotIn(("mirko-p", "sharepoint-permissions"), S.ASSIGN)
        box = S.article_box(posts[0], "en", BASE)
        self.assertIn(f"{BASE}/learn/shop-floor-management/", box); self.assertIn(f"{BASE}/learn/path/manufacturing-excellence/", box)
        self.assertIn(f"{BASE}/de/learn/shop-floor-management/", S.article_box(posts[0], "de", BASE))
        self.assertEqual(S.article_box(posts[0], "ja", BASE), ""); self.assertEqual(S.article_box(posts[1], "en", BASE), "")

    def test_finish(self):
        h = S.finish("<p>Text [2] und [99] (planned) <a href='x'>l</a> [unverified]</p>", 3, "en")
        self.assertIn('href="#src-2"', h); self.assertNotIn("#src-99", h); self.assertNotIn("(planned)", h); self.assertIn("pl-unv", h)



class AuthorBox(unittest.TestCase):
    def test_site_box_plus_disclosure(self):
        for lang, p in ALL:
            d = S.parse_file(ROOT / "imports" / "pillars" / lang / f"{S.slug_of(p, lang)}.md")
            h = S._author_html(d["author"], lang, ctx(), lambda l: '<section class="author-box">BOX</section>')
            self.assertTrue(h.startswith('<section class="author-box">BOX</section>'), f"{lang}/{p['id']}")
            self.assertRegex(h, r"(?i)ifakt", f"{lang}/{p['id']} ohne iFAKT-Hinweis")
            self.assertNotRegex(h, r"(?i)\[Editor|\[Redaktion")


FORBIDDEN = re.compile(r"\((?:planned|geplant)[,;)]|Sister guides \(|check links before go-live|Links vor Livegang|activate link|aktivieren\)|NEURONwriter|Competitor pages|Wettbewerberseiten|\(competitor|\(Wettbewerber"
                       r"|\[unverified:|\[ungeprüft:|Reading time|Lesezeit:|German version:|English version:|Deutsche Fassung:|Englische Fassung:|founded in 2001 by|von Jörg Drees gegründet"
                       r"|planned (?:m365|[\w ]{0,40}(?:guide|compendium))|geplante[n]? Pillar|ist geplant|\(not yet published|, not yet published|noch nicht veröffentlicht\)|\(in Vorbereitung|\(in preparation", re.I)


class Rendered(unittest.TestCase):
    def test_no_internal_or_planned_notes_on_pages(self):
        for lang, p in ALL:
            d, body, src, heads = S._article(p, lang, BASE, ctx())
            txt = re.sub(r"<[^>]+>", " ", body + " " + src)
            m = FORBIDDEN.search(txt)
            self.assertIsNone(m, f"{lang}/{p['id']}: {m and txt[max(0, m.start() - 60):m.end() + 60]}")
            self.assertNotRegex(body, r"`/learn/", f"{lang}/{p['id']} Adresse in Backticks")

    def test_unverified_reason_in_tooltip(self):
        h = S.finish("<p>x [unverified: practitioner estimate] y [ungeprüft]</p>", 0, "en")
        self.assertEqual(h.count("pl-unv"), 2); self.assertIn("Practitioner estimate.", h); self.assertNotIn("[unverified", h)

    def test_blockquote_keeps_lists(self):
        h, _ = S.render("> **Key takeaways**\n> - eins [1]\n> - zwei\n>\n> Schluss", "en", None)
        self.assertEqual(h.count("<li>"), 2); self.assertIn("<blockquote>", h); self.assertIn("<strong>Key takeaways</strong>", h); self.assertNotIn("- eins", h)

    def test_tables_accessible(self):
        h, _ = S.render("| A | B |\n|---|---|\n| 1 | 2 |", "de", None)
        self.assertIn('<th scope="col">A</th>', h); self.assertIn('tabindex="0"', h); self.assertIn('aria-label="Tabelle"', h)

    def test_sources_drop_internal_and_keep_numbers(self):
        md = ("Alles Mögliche, intern.\n1. Fraunhofer IPA: Titel. https://example.org/a\n2. NEURONwriter: analysis \"x\" (internal analysis)\n"
              "3. Competitor pages: https://a.example · https://b.example\n4. Gitnux: Top 10 (competitor, vendor-written). https://gitnux.org/x\n5. Jodoo (Wettbewerber). https://j.example")
        h, valid, dropped = S.sources_html(md, "en", ctx())
        self.assertEqual(valid, {1, 4, 5}); self.assertEqual(dropped, {2, 3})
        self.assertNotRegex(h, r"(?i)neuron|competitor|wettbewerber|intern"); self.assertIn('id="src-4"', h); self.assertIn('<a href="https://example.org/a"', h)
        self.assertIn("(vendor-written)", h); self.assertIn("November 20, 2026", h)
        t = S.finish("<p>Text [1] [2] [4] [9]</p>", valid, "en", dropped)
        self.assertIn("#src-1", t); self.assertIn("#src-4", t); self.assertNotIn("[2]", t); self.assertIn("[9]", t)

    def test_scrub_planned_and_language_lines(self):
        md = ("*Updated: November 2026 · Reading time: about 55 minutes*\n\nText with planned maintenance and (planned time ÷ calendar time) stays; see the planned shop floor management guide.\n\n"
              "**Sister guides (planned)**\n- [A](https://www.m365.fm/en/learn/lean-manufacturing/) (planned, activate link after publication)\n\n**German version:** [x](https://www.m365.fm/learn/lean-management/) (de-DE)\n")
        o = S.scrub(md)
        self.assertNotIn("Reading time", o); self.assertNotIn("German version", o); self.assertNotIn("activate link", o)
        self.assertIn("planned maintenance", o); self.assertIn("(planned time ÷ calendar time)", o); self.assertIn("the shop floor management guide", o); self.assertIn("**Related guides**", o)
        d = S.scrub("Die [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) aus Stuttgart wurde 2001 von Jörg Drees gegründet [18].\n\nEine eigene Pillar-Page zum digitalen Zwilling ist geplant (siehe Ende).\n\n- `/learn/digital-twin/`: Digitaler Zwilling (geplant)\n")
        self.assertNotIn("Drees", d); self.assertIn("nach Unternehmensangaben 2001 gegründet", d); self.assertNotIn("ist geplant", d)
        self.assertIn("[Digitaler Zwilling (geplant)]", d.replace("[Digitaler Zwilling]", "[Digitaler Zwilling (geplant)]")) if False else self.assertIn("(https://www.m365.fm/learn/digital-twin/)", d)


class Build(unittest.TestCase):
    def setUp(self):
        import json
        self.files, self.sm = {}, []
        g = dict(BASE=BASE, write=lambda rel, html: self.files.__setitem__(rel, html), sitemap=self.sm, author_box=None, LANGS=("en", "de"),
                 page=lambda lang, title, desc, canon, body, alts, ld, **kw: json.dumps({"ld": ld, "alts": alts, "canon": canon}, ensure_ascii=False) + "\n" + body,
                 header=lambda l, x: "", footer=lambda l: "", footer_en=lambda: "")
        posts = [{"handle": "mirko-p", "slug": "what-is-a-gemba-walk", "title": "What is a gemba walk", "topics": ["gemba-walk"], "published": 5, "lang": "en"},
                 {"handle": "mirko-p", "slug": "what-is-a-gemba-walk", "title": "Was ist ein Gemba Walk", "topics": ["gemba-walk"], "lang": "de", "tr_of": 1}]
        import contextlib, io
        from unittest import mock
        import site_infographics as _IG
        with contextlib.redirect_stdout(io.StringIO()), mock.patch.object(S, "active", lambda: ("en", "de")), mock.patch.object(_IG, "get", lambda *a: None):   # unabhaengig von den echten Infografik-Daten
            S.build(g, posts, {"kaizen", "digital-twin"})
        self.json = json

    def test_pages_schema_and_language_links(self):
        self.assertEqual(len(self.files), 22)
        for rel, html in self.files.items():
            ld = self.json.loads(html.split("\n", 1)[0])["ld"]
            for n in ld:
                if n.get("@type") == "Course":
                    self.assertTrue(n["hasPart"] and all(x["@type"] == "WebPage" for x in n["hasPart"]), rel)
                    self.assertEqual(n["provider"], {"@id": f"{BASE}/#org"})
                if n.get("@type") == "Article": self.assertEqual(n["publisher"], {"@id": f"{BASE}/#org"}, rel)
        en = self.files["learn/lean-manufacturing/index.html"]; de = self.files["de/learn/lean-management/index.html"]
        self.assertIn('href="https://www.m365.fm/de/learn/lean-management/" hreflang="de"', en); self.assertIn('href="https://www.m365.fm/learn/lean-manufacturing/" hreflang="en"', de)
        h1s = [len(re.findall(r"<h1[ >]", h)) for h in self.files.values()]
        self.assertEqual(set(h1s), {1})

    def test_infographics_only_with_release(self):
        import contextlib, io, json
        from unittest import mock
        import site_infographics as IG
        self.assertNotIn("ig-fig", self.files["learn/lean-manufacturing/index.html"])   # ohne Freigabe: Seite wie vorher
        imgs = [{"u": f"https://img.m365.fm/ig/pillar/lean-manufacturing/en-{i}-abcd1234.webp", "w": 1200, "h": 630 if i == 0 else 1040, "a": f"Bild {i}", "t": "bigfact" if i == 0 else "flow"} for i in range(10)]
        seen = {}
        g = dict(BASE=BASE, write=lambda rel, html: seen.__setitem__(rel, html), sitemap=[], author_box=None, LANGS=("en", "de"),
                 page=lambda lang, title, desc, canon, body, alts, ld, **kw: json.dumps({"ld": ld, "kw": kw, "lang": lang}, ensure_ascii=False, default=str) + "\n" + body,
                 header=lambda l, x: "", footer=lambda l: "", footer_en=lambda: "")
        posts = [{"handle": "mirko-p", "slug": "what-is-a-gemba-walk", "title": "What is a gemba walk", "topics": ["gemba-walk"], "published": 5, "lang": "en"}]
        get = lambda kind, slug, lang: imgs if (kind, slug, lang) == ("pillar", "lean-manufacturing", "en") else None
        with contextlib.redirect_stdout(io.StringIO()), mock.patch.object(S, "active", lambda: ("en", "de")), mock.patch.object(IG, "get", get):
            S.build(g, posts, {"kaizen", "digital-twin"})
        head, body = seen["learn/lean-manufacturing/index.html"].split("\n", 1)
        meta = json.loads(head)
        self.assertEqual(body.count("ig-fig"), 10)   # Kopfbild + 9 Infografiken
        self.assertTrue(body.index("ig-fig") < body.index("<h2"))   # Kopfbild steht vor dem Text
        self.assertEqual(meta["kw"]["og_image"][0], imgs[0]["u"][:-5] + ".jpg")
        self.assertTrue(any(n.get("@type") == "ImageObject" for n in meta["ld"]))
        other = seen["de/learn/lean-management/index.html"]
        self.assertNotIn("ig-fig", other); self.assertNotIn("og_image", json.loads(other.split("\n", 1)[0])["kw"])   # nur die freigegebene Sprachfassung

    def test_german_pages_show_german_titles(self):
        de = self.files["de/learn/shop-floor-management/index.html"]
        self.assertIn("Was ist ein Gemba Walk", de); self.assertNotIn("What is a gemba walk", de)
        self.assertIn("What is a gemba walk", self.files["learn/shop-floor-management/index.html"])


class AssignPrecision(unittest.TestCase):
    def test_word_boundaries_and_modules(self):
        posts = [{"handle": "h", "slug": "world-maps-overview", "title": "World maps", "topics": [], "published": 1, "lang": "en"},
                 {"handle": "h", "slug": "interpreting-survey-data", "title": "Interpreting survey data", "topics": [], "published": 1, "lang": "en"},
                 {"handle": "h", "slug": "heijunka-production-leveling", "title": "Heijunka", "topics": ["polaris-optimizer", "ifakt", "polaris-simulator"], "published": 1, "lang": "en"},
                 {"handle": "h", "slug": "oee-explained", "title": "OEE explained", "topics": [], "published": 1, "lang": "en"}]
        S.assign(posts)
        self.assertNotIn(("h", "world-maps-overview"), S.ASSIGN); self.assertNotIn(("h", "interpreting-survey-data"), S.ASSIGN)
        self.assertNotIn("ifakt-polaris", S.ASSIGN.get(("h", "heijunka-production-leveling"), []))
        self.assertEqual(S.ASSIGN[("h", "oee-explained")], ["manufacturing-kpis"])

    def test_pins(self):
        S.assign([{"handle": "h", "slug": "modular-production-planning-software-modules", "title": "Modules", "topics": ["advanced-planning-and-scheduling", "finite-capacity-scheduling", "polaris"], "published": 1, "lang": "en"}])
        self.assertIn("ifakt-polaris", S.ASSIGN[("h", "modular-production-planning-software-modules")])


if __name__ == "__main__":
    unittest.main()
