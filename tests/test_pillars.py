"""Pillar-Kompendien und Lernpfad (site_pillars.py, data/pillars.json, imports/pillars)."""
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_pillars as S

BASE = "https://www.m365.fm"
ALL = [(lang, p) for lang in S.LANGS for p in S.pillars() if S.has(p, lang)]   # Leitfäden in jeder vorhandenen Fassung (neue nur Englisch)
FILES = [(lang, p, S.pillar_file(p, lang)) for lang, p in ALL] + [("en", c, S.cluster_file(c)) for c in S.clusters()]   # plus Vertiefungen (nur Englisch)
NEW = [p for p in S.pillars() if not p["slug"].get("de")]


def ctx(**kw):
    return S.Ctx(BASE, kw.get("ents", set()), kw.get("en", set()), kw.get("de", set()))


class Registry(unittest.TestCase):
    def test_files_exist_and_slugs_unique(self):
        for lang in S.LANGS:
            ps = [p for p in S.pillars() if lang == "en" or p["slug"].get(lang)]   # ohne slug.de gibt es nur die englische Fassung
            slugs = [S.slug_of(p, lang) for p in ps]
            self.assertEqual(len(slugs), len(set(slugs)), lang)
            for s in slugs: self.assertTrue((ROOT / "imports" / "pillars" / lang / f"{s}.md").exists(), f"{lang}/{s}.md fehlt")
        self.assertEqual(len(NEW), 10)
        for p in NEW: self.assertFalse(S.has(p, "de")); self.assertTrue(S.has(p, "en")); self.assertEqual(p.get("date"), "2026-11-26", p["id"])

    def test_clusters_have_parent_file_and_unique_slugs(self):
        cs = S.clusters()
        self.assertEqual(len(cs), len(S.registry()["clusters"]), "jede Vertiefung hat einen vorhandenen Eltern-Leitfaden")
        self.assertEqual(len(cs), 15)
        ids = [c["id"] for c in cs] + [p["id"] for p in S.pillars()]
        self.assertEqual(len(ids), len(set(ids)), "IDs von Vertiefungen und Leitfäden eindeutig (Fragen-Quellen, custom_id)")
        for c in cs:
            self.assertTrue(S.cluster_file(c).exists(), c["id"])
            self.assertNotEqual(c["slug"]["en"], "path"); self.assertRegex(c["slug"]["en"], r"^[a-z0-9-]+$")
            self.assertEqual(set(c["slug"]), {"en"}, "Vertiefungen gibt es nur auf Englisch")
            m = re.search(r"^\| Parent pillar \| \[[^\]]+\]\(https://www\.m365\.fm/en/learn/([a-z0-9-]+)/\)", S.cluster_file(c).read_text("utf-8"), re.M)
            self.assertEqual(S.by_id(c["parent"])["slug"]["en"], m.group(1), f"{c['id']}: parent wie in der Datei")
        for p in S.pillars():
            sl = [c["slug"]["en"] for c in S.clusters_of(p["id"])]
            self.assertEqual(len(sl), len(set(sl)), p["id"])

    def test_path_covers_each_pillar_once(self):
        ids = [i for st in S.registry()["path"]["stages"] for i in st["pillars"]]
        self.assertEqual(sorted(ids), sorted(p["id"] for p in S.pillars()))
        self.assertEqual(len(S.order()), len(ids))

    def test_texts_in_both_languages(self):
        pa = S.registry()["path"]
        for k in ("title", "seo_title", "short", "intro"): self.assertTrue({"en", "de"} <= set(pa[k]), k)
        self.assertLessEqual(max(len(v) for v in pa["seo_title"].values()), 60)
        self.assertEqual([[i for i in st["pillars"]] for st in pa["stages"]][0][-3:], ["5s-visual-management", "kanban-pull-system", "smed-changeover-reduction"])
        self.assertEqual(len(pa["stages"]), 4); self.assertEqual(len(S.order()), 20)
        for k in ("seo_title", "short"):
            for lang in ("en", "de"): self.assertNotRegex(pa[k][lang], r"\b(10|ten|zehn)\b", f"{k} {lang}: Zahl der Leitfäden veraltet")
        for p in S.pillars(): self.assertTrue({"en", "de"} <= set(p["label"]))


class Content(unittest.TestCase):
    def test_every_file_parses_with_seo_fields(self):
        for lang, p, f in FILES:
            d = S.parse_file(f)
            who = f"{lang}/{p['id']}"
            self.assertTrue(d["h1"] and len(d["article"].split()) > (3000 if p.get("parent") else 5000), who)   # Vertiefungen 3.000-5.000 Wörter
            t = S.meta_value(d["meta"], "meta title", "meta-title"); ds = S.meta_value(d["meta"], "meta description", "meta-description")
            self.assertTrue(30 <= len(t) <= 60, f"{who} Title {len(t)}")
            self.assertTrue(80 <= len(ds) <= 160, f"{who} Description {len(ds)}")
            self.assertTrue(d["sources"] and d["author"], who)

    def test_no_internal_notes_in_published_parts(self):
        rx = re.compile(r"\[(?:Editor|Redaktion)|review log|Review-Protokoll|Editorial notes|Prüfhinweise|Wettbewerbsanalyse|Competitive analysis", re.I)
        for lang, p, f in FILES:
            d = S.parse_file(f)
            for part in ("article", "author", "sources"):
                m = rx.search(d[part]) if part != "sources" else rx.search(S.sources_html(d[part], lang, ctx())[0])   # Quellen: wie veröffentlicht
                self.assertIsNone(m, f"{lang}/{p['id']} {part}: {m and d[part][max(0, m.start() - 60):m.end() + 40]}")

    def test_toulouse_never_published(self):
        for lang, p, f in FILES:
            d = S.parse_file(f)
            for part in ("article", "author", "sources"): self.assertNotIn("toulouse", d[part].lower(), f"{lang}/{p['id']} {part}")

    def test_ifakt_disclosure_in_every_author_box(self):
        for lang, p, f in FILES:
            d = S.parse_file(f)
            self.assertRegex(d["author"], r"(?i)works at (\[)?iFAKT|arbeitet bei der (\[)?iFAKT|Anbieter von iFAKT|vendor of iFAKT|iFAKT GmbH", f"{lang}/{p['id']}")

    def test_render_anchors_resolve_and_markers(self):
        for lang, p, f in FILES:
            cx = ctx()
            d, body, src, heads = rendered(p, lang, f, cx)
            ids = [h[2] for h in heads]
            self.assertEqual(len(ids), len(set(ids)), f"{lang}/{p['id']} doppelte IDs")
            self.assertFalse([w for w in cx.warn if w.startswith("Sprungmarke")], f"{lang}/{p['id']}")
            self.assertNotIn("(planned)", body); self.assertNotIn("(geplant)", body)
            self.assertNotRegex(body, r"<script|<iframe")
            self.assertEqual(len(re.findall(r'<li id="src-', src)), len(set(re.findall(r'<li id="src-(\d+)"', src))))


def rendered(p, lang, f, cx):
    """Wie site_pillars._article, auch für Vertiefungen -> (d, body, quellen, heads)."""
    d = S.parse_file(f)
    src, n_src, dropped = S.sources_html(d["sources"], lang, cx) if d["sources"] else ("", set(), set())
    body, heads = S.render(d["article"], lang, cx)
    return d, S.finish(S.fix_anchors(body, heads, cx), n_src, lang, dropped), src, heads


class Links(unittest.TestCase):
    def test_pillar_links_follow_language(self):
        cx = ctx()
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/value-stream-mapping/", "en"), f"{BASE}/learn/value-stream-mapping/")
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/value-stream-mapping/", "de"), f"{BASE}/de/learn/wertstromanalyse/")
        self.assertEqual(cx.link("https://www.m365.fm/learn/wertstromanalyse/", "en"), f"{BASE}/learn/value-stream-mapping/")
        self.assertEqual(cx.link("https://www.m365.fm/learn/digital-twin/", "de"), f"{BASE}/de/learn/digital-twin/")
        # Leitfaden nur auf Englisch: auch von deutschen Seiten die englische Adresse (keine tote /de/-Adresse)
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/tpm-oee/", "de"), f"{BASE}/learn/tpm-oee/")
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/tpm-oee/#oee", "en"), f"{BASE}/learn/tpm-oee/#oee")
        # Vertiefungen: /learn/<leitfaden>/<vertiefung>/ ohne Sprachpräfix, auch über den deutschen Slug des Eltern-Leitfadens
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/lean-manufacturing/kaizen/", "en"), f"{BASE}/learn/lean-manufacturing/kaizen/")
        self.assertEqual(cx.link("https://www.m365.fm/learn/lean-management/kaizen/", "de"), f"{BASE}/learn/lean-manufacturing/kaizen/")
        self.assertIsNone(cx.link("https://www.m365.fm/en/learn/lean-manufacturing/andon/", "en"), "Vertiefung eines anderen Leitfadens")
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/", "en"), f"{BASE}/learn/")
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/path/manufacturing-excellence/", "de"), f"{BASE}/de/learn/path/manufacturing-excellence/")
        self.assertEqual([w for w in cx.warn if "Pillar" in w], ["Pillar-Adresse unbekannt: https://www.m365.fm/en/learn/lean-manufacturing/andon/"])

    def test_all_learn_links_resolve(self):
        """Jede m365.fm/(en/)learn/-Adresse in Artikel, Autorenbox und Quellen aller englischen Dateien (Leitfäden und Vertiefungen) führt auf eine gebaute Seite."""
        built = {S.url(BASE, p, "en") for p in S.pillars()} | {S.cluster_url(BASE, c) for c in S.clusters()} | {S.path_url(BASE, "en"), f"{BASE}/learn/"}
        n = 0
        for lang, p, f in FILES:
            if lang != "en": continue
            d = S.parse_file(f)
            for part in ("article", "author", "sources"):
                for u in re.findall(r"https?://(?:www\.)?m365\.fm/(?:en/)?learn/[^\s)\]>\"']*", d[part]):
                    cx = ctx(); v = cx.link(u, "en"); n += 1
                    self.assertFalse(cx.warn, f"{p['id']}: {u}")
                    self.assertIn(v.split("#")[0], built, f"{p['id']}: {u} -> {v}")
                    self.assertNotIn("/en/learn/", v)
        self.assertGreater(n, 500)

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
        # erster Treffer ein Leitfaden nur auf Englisch: deutsche Blogseite behält den Kasten mit dem bisherigen Leitfaden (deutsche Fassung)
        tpm = {"handle": "mirko-p", "slug": "total-productive-maintenance-pillars", "title": "The pillars of total productive maintenance", "topics": ["total-productive-maintenance"], "published": 3, "lang": "en"}
        S.assign(posts + [tpm])
        self.assertEqual(S.ASSIGN[("mirko-p", tpm["slug"])][0], "tpm-oee")
        self.assertIn(f"{BASE}/learn/tpm-oee/", S.article_box(tpm, "en", BASE))
        de_box = S.article_box(tpm, "de", BASE)
        self.assertIn(f"{BASE}/de/learn/produktionskennzahlen/", de_box); self.assertNotIn("/de/learn/tpm-oee/", de_box)
        self.assertIn(tpm, S.related("manufacturing-kpis", "de")); self.assertNotIn(tpm, S.related("manufacturing-kpis", "en"))
        S.assign(posts)
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
        for lang, p, f in FILES:
            d = S.parse_file(f)
            h = S._author_html(d["author"], lang, ctx(), lambda l: '<section class="author-box">BOX</section>')
            self.assertTrue(h.startswith('<section class="author-box">BOX</section>'), f"{lang}/{p['id']}")
            self.assertRegex(h, r"(?i)ifakt", f"{lang}/{p['id']} ohne iFAKT-Hinweis")
            self.assertNotRegex(h, r"(?i)\[Editor|\[Redaktion")


FORBIDDEN = re.compile(r"\((?:planned|geplant)[,;)]|Sister guides \(|check links before go-live|Links vor Livegang|activate link|aktivieren\)|NEURONwriter|Competitor pages|Wettbewerberseiten|\(competitor|\(Wettbewerber"
                       r"|\[unverified:|\[ungeprüft:|Reading time|Lesezeit:|German version:|English version:|Deutsche Fassung:|Englische Fassung:|founded in 2001 by|von Jörg Drees gegründet"
                       r"|planned (?:m365|[\w ]{0,40}(?:guide|compendium))|geplante[n]? Pillar|ist geplant|\(not yet published|(?:planned|geplant), not yet published|noch nicht veröffentlicht\)|\(in Vorbereitung|\(in preparation", re.I)


class Rendered(unittest.TestCase):
    def test_no_internal_or_planned_notes_on_pages(self):
        for lang, p, f in FILES:
            d, body, src, heads = rendered(p, lang, f, ctx())
            txt = re.sub(r"<[^>]+>", " ", body + " " + src)
            m = FORBIDDEN.search(txt)
            self.assertIsNone(m, f"{lang}/{p['id']}: {m and txt[max(0, m.start() - 60):m.end() + 60]}")
            self.assertNotRegex(body, r"`/learn/", f"{lang}/{p['id']} Adresse in Backticks")
            self.assertNotRegex(txt, r"(?i)\b(?:the|our) planned (?:pillar|cluster|guide)|\(both planned\)|\(planned (?:cluster|pillar|guide)\)|(?:SMED|reduction|IIoT|ISA-95|62443) \(guide\)|competitor page|before publication", f"{lang}/{p['id']}")

    def test_unverified_reason_in_tooltip(self):
        h = S.finish("<p>x [unverified: practitioner estimate] y [ungeprüft]</p>", 0, "en")
        self.assertEqual(h.count("pl-unv"), 2); self.assertIn("Practitioner estimate.", h); self.assertNotIn("[unverified", h)
        h = S.finish("<p>a [unverified as a statistic] b [unverified; practitioner estimate] c [unverified as to current volume; check the CISA advisories page] "
                     "d [unverified as a published benchmark; use as an internal target only] e [unverified against Shingo's own books in this session] f [unverified : statut]</p>", 0, "en")
        self.assertEqual(h.count("pl-unv"), 6); self.assertNotIn("[unverified", h)
        for x in ("As a statistic.", "Practitioner estimate.", "As to current volume.", "As a published benchmark.", "Against Shingo's own books.", "Statut."): self.assertIn(x, h)
        self.assertNotRegex(h, r"CISA advisories|internal target|this session")

    def test_sources_status_marks_removed(self):
        """Prüfvermerke der Faktenprüfung ((S), (*), (V-sister), Dateinamen, "via sibling pillar") stehen nicht in der Quellenliste; (S&OP), (UNS) bleiben."""
        md = ("Sources marked (S) were checked in this session.\n1. (*) JIPM: Award. https://a.example/x\n2. (S) Goldratt: The Race. https://b.example\n"
              "3. Lean Lexicon. https://c.example/ (S)\n4. Sugimori. https://d.example (V; volume, issue and pages as verified for the sister pillar `production-scheduling-aps.md`)\n"
              "5. Smartsheet. https://e.example (V; vendor page)\n6. ISA. https://f.example (F, re-fetched November 20, 2026)\n7. OEE. https://g.example (S: manufacturing-kpis.md)\n"
              "8. Orlicky: MRP (via sibling pillar; original not consulted)\n9. Sales and operations planning (S&OP). APICS. https://h.example\n10. Unified namespace (UNS). HiveMQ. https://i.example (V-sister)\n"
              "11. Harris. https://j.example (page numbers of the Harris original as in the parent pillar; volume confirmed)")
        h, valid, _ = S.sources_html(md, "en", ctx())
        self.assertEqual(valid, set(range(1, 12)))
        t = re.sub(r"<[^>]+>", " ", h)
        self.assertNotRegex(t, r"\.md\b|(?i:sister|sibling|parent pillar)|\((?:V|F|S|P)(?:-sister)?\)|\((?:\*|†)\)|\((?:V|F|S|P)[;,:]|re-fetched")
        for x in ("(vendor page)", "(accessed November 20, 2026)", "(S&amp;OP)", "(UNS)", "JIPM: Award", "Goldratt: The Race"): self.assertIn(x, h)

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


class FallbackLinks(unittest.TestCase):
    def test_link_to_english_page_from_other_language(self):
        cx = ctx()
        h = S.inline("[TPM](https://www.m365.fm/en/learn/tpm-oee/) und [Lean](https://www.m365.fm/learn/lean-manufacturing/)", "de", cx)
        self.assertIn('href="https://www.m365.fm/learn/tpm-oee/" hreflang="en" lang="en"', h)
        self.assertIn('href="https://www.m365.fm/de/learn/lean-management/">', h)
        self.assertNotIn("hreflang", S.inline("[TPM](https://www.m365.fm/en/learn/tpm-oee/)", "en", cx))


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
        self.assertEqual(len(self.files), 49)   # 20 en + 10 de Leitfäden, 15 Vertiefungen, 2 Pfadseiten, 2 Testseiten (Abschlusstest)
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

    def test_clusters_and_en_only_guides(self):
        meta = lambda rel: self.json.loads(self.files[rel].split("\n", 1)[0])
        sm = {u: (d, a) for u, d, a in self.sm}
        for c in S.clusters():
            rel = f"learn/{S.by_id(c['parent'])['slug']['en']}/{c['slug']['en']}/index.html"
            u = f"{BASE}/{rel[:-10]}"
            m = meta(rel)
            self.assertEqual(m["canon"], u); self.assertIsNone(m["alts"], "kein hreflang")
            self.assertEqual(sm[u], ("2026-11-26", None))
            art = next(n for n in m["ld"] if n["@type"] == "Article")
            self.assertEqual(art["url"], u); self.assertEqual(art["inLanguage"], "en")
            self.assertIn(S.url(BASE, S.by_id(c["parent"]), "en") + "#article", [x["@id"] for x in art["isPartOf"]])
            self.assertIn(f'href="{S.url(BASE, S.by_id(c["parent"]), "en")}" rel="up"', self.files[rel])
        for p in NEW:
            rel = f"learn/{p['slug']['en']}/index.html"; u = f"{BASE}/{rel[:-10]}"
            self.assertEqual(meta(rel)["canon"], u); self.assertIsNone(meta(rel)["alts"]); self.assertEqual(sm[u], ("2026-11-26", None))
            self.assertNotIn(f"de/learn/{p['slug']['en']}/index.html", self.files)
        lean = self.files["learn/lean-manufacturing/index.html"]
        box = lean[lean.index('class="pl-box pl-deep"'):]; box = box[:box.index("</section>")]
        self.assertEqual(sorted(re.findall(r'href="https://www\.m365\.fm/learn/lean-manufacturing/([a-z0-9-]+)/"', box)), ["a3-problem-solving", "kaizen", "pdca-cycle", "poka-yoke"])
        self.assertNotIn('class="pl-box pl-deep"', self.files["de/learn/lean-management/index.html"], "Kasten nur auf der englischen Seite")
        self.assertIn("Step 9 of 20", self.files["learn/tpm-oee/index.html"])
        self.assertIn("Schritt 4 von 10", self.files["de/learn/wertstromanalyse/index.html"])

    def test_no_dead_steps_and_links(self):
        built = {f"{BASE}/{rel[:-10]}" for rel in self.files}
        for rel, h in self.files.items():
            for u in re.findall(r'href="(https://www\.m365\.fm/(?:[a-z]{2}/)?learn/(?!$)[^"#]*)', h):
                if u.endswith("/learn/"): continue
                self.assertIn(u, built, f"{rel}: toter Link {u}")
            if rel.startswith("de/") and 'class="pl-step"' in h:
                step = h[h.index('class="pl-step"'):]; step = step[:step.index("</nav>")]
                self.assertNotRegex(step, r'href="https://www\.m365\.fm/learn/', f"{rel}: Vor/Zurück auf eine englische Seite")

    def test_path_page_stages_and_deep_dives(self):
        en, de = self.files["learn/path/manufacturing-excellence/index.html"], self.files["de/learn/path/manufacturing-excellence/index.html"]
        for h in (en, de):
            self.assertEqual(h.count('class="pl-stage"'), 4); self.assertEqual(h.count('class="pl-card"'), 20)
            self.assertEqual(len(set(re.findall(r'href="https://www\.m365\.fm/learn/(?!path/)[a-z0-9-]+/[a-z0-9-]+/"', h))), 15)
        self.assertEqual(de.count("(auf Englisch)"), 10); self.assertEqual(re.findall(r'pl-step-n">(\d+)', de), [str(i) for i in range(1, 11)])
        self.assertEqual(re.findall(r'pl-step-n">(\d+)', en), [str(i) for i in range(1, 21)])
        course = next(n for n in self.json.loads(en.split("\n", 1)[0])["ld"] if n["@type"] == "Course")
        self.assertEqual(len(course["hasPart"]), 35)
        self.assertIn(("https://www.m365.fm/learn/path/manufacturing-excellence/", "2026-11-26"), [(u, d) for u, d, a in self.sm])

    def test_blocking_schema_check_passes(self):
        """check_schema.py (blockiert den Seitenbau) über das JSON-LD aller gebauten Lernpfad-Seiten: Verweise auf Leitfäden/Vertiefungen sind keine Article-Knoten ohne Pflichtfelder."""
        import subprocess, tempfile
        with tempfile.TemporaryDirectory() as tmp:
            for rel, html in self.files.items():
                f = Path(tmp) / "docs" / rel; f.parent.mkdir(parents=True, exist_ok=True)
                ld = self.json.loads(html.split("\n", 1)[0])["ld"]
                f.write_text("<!doctype html><html><head>" + "".join(f'<script type="application/ld+json">{self.json.dumps(n, ensure_ascii=False)}</script>' for n in ld) + "</head><body>" + html.split("\n", 1)[1] + "</body></html>", "utf-8")
            r = subprocess.run([sys.executable, str(ROOT / "check_schema.py"), str(Path(tmp) / "docs")], capture_output=True, text=True)
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr); self.assertIn("49 Seiten mit JSON-LD", r.stdout)
        for rel in ("learn/lean-manufacturing/index.html", "learn/lean-manufacturing/kaizen/index.html"):
            art = next(n for n in self.json.loads(self.files[rel].split("\n", 1)[0])["ld"] if n.get("@type") == "Article")
            for x in (art.get("hasPart") or []) + [y for y in (art["isPartOf"] if isinstance(art["isPartOf"], list) else [art["isPartOf"]]) if y.get("@type") != "Course"]:
                self.assertNotIn("@type", x, rel); self.assertTrue(x["@id"].endswith("/#article"), rel)

    def test_pages_clean_markers_and_jargon(self):
        for rel, html in self.files.items():
            body = re.sub(r"<style>.*?</style>", "", html.split("\n", 1)[1], flags=re.S)
            txt = re.sub(r"<[^>]+>", " ", body)
            self.assertNotRegex(txt, r"\[(?:unverified|ungeprüft)", rel)
            src = re.sub(r"<[^>]+>", " ", body[body.find('id="sources"'):]) if 'id="sources"' in body else ""
            self.assertNotRegex(src, r"\.md\b|(?i:sister|sibling|parent pillar)|\((?:V|F|S|P)(?:-sister)?\)|\((?:\*|†)\)|\((?:V|F|S|P)[;,:]", rel)
            if rel.count("/") == 3 and not rel.startswith(("de/", "learn/path/")):   # Vertiefungen
                self.assertNotRegex(txt, r"(?i)cluster article|a cluster of the|parent pillar|\bthe pillar\b|\bsibling\b|pillar guide|\[pillar\b|ranking explainers|ranking page|top-ranking|\bcluster \[|\w cluster\b(?! after| in the last)", rel)
        self.assertNotRegex(self.files["learn/mes-isa-95/index.html"], r"ranking explainers|question on google\.com")

    def test_related_guides_box(self):
        lean = self.files["learn/lean-manufacturing/index.html"]
        box = lean[lean.index('class="pl-box pl-deep pl-relg"'):]; box = box[:box.index("</section>")]
        self.assertEqual(re.findall(r'href="https://www\.m365\.fm/learn/([a-z0-9-]+)/"', box), ["5s-visual-management", "kanban-pull-system", "smed-changeover-reduction", "tpm-oee"])
        for rel, ids in (("learn/production-scheduling-aps/index.html", ["sop-mrp-production-planning", "theory-of-constraints"]), ("learn/manufacturing-kpis/index.html", ["tpm-oee", "six-sigma-root-cause-analysis"])):
            h = self.files[rel]; box = h[h.index("pl-relg"):]; box = box[:box.index("</section>")]
            self.assertEqual(re.findall(r'href="https://www\.m365\.fm/learn/([a-z0-9-]+)/"', box), ids)
        self.assertNotIn("pl-relg", self.files["de/learn/lean-management/index.html"])
        for p in S.pillars():
            for q in p.get("related") or (): self.assertIsNotNone(S.by_id(q), f"{p['id']}: related {q} unbekannt")

    def test_broken_deep_dive_costs_only_itself(self):
        import contextlib, io
        from unittest import mock
        import site_infographics as _IG
        files = {}
        g = dict(BASE=BASE, write=lambda rel, html: files.__setitem__(rel, html), sitemap=[], author_box=None, LANGS=("en", "de"),
                 page=lambda lang, title, desc, canon, body, alts, ld, **kw: body, header=lambda l, x: "", footer=lambda l: "", footer_en=lambda: "")
        real = S.parse_file
        def broken(path):
            if Path(path).name == "kaizen.md": raise ValueError("kaputt")
            return real(path)
        out = io.StringIO()
        with contextlib.redirect_stdout(out), mock.patch.object(S, "active", lambda: ("en", "de")), mock.patch.object(_IG, "get", lambda *a: None), mock.patch.object(S, "parse_file", broken):
            S.build(g, [], set())
        self.assertIn("Vertiefung kaizen nicht gebaut", out.getvalue())
        self.assertNotIn("learn/lean-manufacturing/kaizen/index.html", files); self.assertIn("learn/lean-manufacturing/pdca-cycle/index.html", files)
        self.assertFalse([rel for rel, h in files.items() if "/learn/lean-manufacturing/kaizen/" in h], "kein Link auf die nicht gebaute Vertiefung")

    def test_noindex_switch(self):
        import contextlib, io, json
        from unittest import mock
        reg = json.loads(json.dumps(S.registry()))
        next(p for p in reg["pillars"] if p["id"] == "tpm-oee")["noindex"] = True
        next(c for c in reg["clusters"] if c["id"] == "kaizen")["noindex"] = True
        files, sm, kw = {}, [], {}
        g = dict(BASE=BASE, write=lambda rel, html: files.__setitem__(rel, html), sitemap=sm, author_box=None, LANGS=("en", "de"),
                 page=lambda lang, title, desc, canon, body, alts, ld, **k: kw.__setitem__(canon, k.get("noindex")) or body, header=lambda l, x: "", footer=lambda l: "", footer_en=lambda: "")
        import site_infographics as _IG
        with contextlib.redirect_stdout(io.StringIO()), mock.patch.object(S, "active", lambda: ("en", "de")), mock.patch.object(_IG, "get", lambda *a: None), mock.patch.object(S, "registry", lambda: reg):
            S.build(g, [], set())
        for u in (f"{BASE}/learn/tpm-oee/", f"{BASE}/learn/lean-manufacturing/kaizen/"):
            self.assertTrue(kw[u], u); self.assertNotIn(u, [x[0] for x in sm])
        self.assertIn("learn/tpm-oee/index.html", files, "Seite bleibt erreichbar")

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

    def test_related_other_languages_sorted_by_score(self):
        """Seiten ausser Englisch: Beiträge, deren erster Leitfaden nur Englisch ist (hier TPM), stehen nach Güte zwischen den übrigen, nicht dahinter."""
        S.assign([{"handle": "h", "slug": "takt-basics", "title": "Takt basics", "topics": [], "published": 9, "lang": "en"},
                  {"handle": "h", "slug": "autonomous-maintenance-basics", "title": "Autonomous maintenance and OEE", "topics": ["total-productive-maintenance"], "published": 1, "lang": "en"}])
        self.assertEqual(S.ASSIGN[("h", "autonomous-maintenance-basics")], ["tpm-oee"]); self.assertEqual(S.ASSIGN_DE[("h", "autonomous-maintenance-basics")], "manufacturing-kpis")
        self.assertEqual([x["slug"] for x in S.related("manufacturing-kpis", "de")], ["autonomous-maintenance-basics", "takt-basics"])
        self.assertEqual([x["slug"] for x in S.related("manufacturing-kpis", "en")], ["takt-basics"])

    def test_pins(self):
        S.assign([{"handle": "h", "slug": "modular-production-planning-software-modules", "title": "Modules", "topics": ["advanced-planning-and-scheduling", "finite-capacity-scheduling", "polaris"], "published": 1, "lang": "en"}])
        self.assertIn("ifakt-polaris", S.ASSIGN[("h", "modular-production-planning-software-modules")])


if __name__ == "__main__":
    unittest.main()
