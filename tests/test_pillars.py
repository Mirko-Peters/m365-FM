"""Pillar-Kompendien und Lernpfad (site_pillars.py, data/pillars.json, imports/pillars)."""
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_pillars as S
from unittest import mock

BASE = "https://www.m365.fm"
ALL = [(lang, p) for lang in S.LANGS for p in S.pillars() if S.has(p, lang)]   # Leitfäden in jeder vorhandenen Fassung
FILES = [(lang, p, S.pillar_file(p, lang)) for lang, p in ALL] + [(lang, c, S.cluster_file(c, lang)) for lang in S.LANGS for c in S.clusters() if S.has_cluster(c, lang)]   # plus Vertiefungen (en, de)
NEW = [p for p in S.pillars() if p.get("date") == "2026-11-26"]   # Kursausbau 26.11.2026 (englisch, deutsche Fassung am selben Tag nachgeliefert)


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
        for p in NEW: self.assertTrue(S.has(p, "de"), p["id"]); self.assertTrue(S.has(p, "en"), p["id"])
        self.assertEqual(len(ALL), 40, "alle 20 Leitfäden auf Englisch und Deutsch")

    def test_clusters_have_parent_file_and_unique_slugs(self):
        cs = S.clusters()
        self.assertEqual(len(cs), len(S.registry()["clusters"]), "jede Vertiefung hat einen vorhandenen Eltern-Leitfaden")
        self.assertEqual(len(cs), 15)
        ids = [c["id"] for c in cs] + [p["id"] for p in S.pillars()]
        self.assertEqual(len(ids), len(set(ids)), "IDs von Vertiefungen und Leitfäden eindeutig (Fragen-Quellen, custom_id)")
        for c in cs:
            self.assertTrue(S.cluster_file(c).exists(), c["id"])
            self.assertNotEqual(c["slug"]["en"], "path"); self.assertRegex(c["slug"]["en"], r"^[a-z0-9-]+$")
            self.assertEqual(set(c["slug"]), {"en", "de"}, "Vertiefungen auf Englisch und Deutsch"); self.assertRegex(c["slug"]["de"], r"^[a-z0-9-]+$")
            self.assertTrue(S.has_cluster(c, "de") and S.cluster_file(c, "de").exists(), c["id"]); self.assertTrue(c["label"].get("de"), c["id"])
            m = re.search(r"^\| Parent pillar \| \[[^\]]+\]\(https://www\.m365\.fm/en/learn/([a-z0-9-]+)/\)", S.cluster_file(c).read_text("utf-8"), re.M)
            self.assertEqual(S.by_id(c["parent"])["slug"]["en"], m.group(1), f"{c['id']}: parent wie in der Datei")
            de = S.cluster_file(c, "de").read_text("utf-8")   # deutsche Datei: Eltern-Leitfaden und Slug-Zeile passen zu slug.de
            m = re.search(r"^\| Parent-Pillar \| \[[^\]]+\]\(https://www\.m365\.fm/learn/([a-z0-9-]+)/\)", de, re.M)
            self.assertEqual(S.by_id(c["parent"])["slug"]["de"], m.group(1), f"{c['id']}: parent (de) wie in der Datei")
            self.assertRegex(de, r"(?m)^\| Slug \| `/learn/" + S.by_id(c["parent"])["slug"]["de"] + "/" + c["slug"]["de"] + "/`", c["id"])
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
        self.assertNotIn("nur auf Englisch", pa["intro"]["de"], "seit der deutschen Fassung gibt es alle Leitfäden und Vertiefungen auf Deutsch")

    def test_german_files_match_slugs(self):
        """Slug-Zeile jeder deutschen Datei der Kurs-Erweiterung = slug.de (Adresse /learn/<de-slug>/ in Mirkos Schema, gebaut als /de/learn/...)."""
        for p in NEW:
            self.assertRegex(S.pillar_file(p, "de").read_text("utf-8"), r"(?m)^\| Slug \| `/learn/" + p["slug"]["de"] + "/`", p["id"])


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
        # neue Leitfäden: deutsche Fassung über den englischen oder deutschen Slug (Mirkos Links /learn/<de-slug>/ ohne /de/)
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/tpm-oee/", "de"), f"{BASE}/de/learn/tpm-oee/")
        self.assertEqual(cx.link("https://www.m365.fm/learn/smed-ruestzeitreduzierung/#ablauf", "de"), f"{BASE}/de/learn/smed-ruestzeitreduzierung/#ablauf")
        self.assertEqual(cx.link("https://www.m365.fm/learn/smed-ruestzeitreduzierung/", "en"), f"{BASE}/learn/smed-changeover-reduction/")
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/tpm-oee/#oee", "en"), f"{BASE}/learn/tpm-oee/#oee")
        # Vertiefungen: auf deutschen Seiten die deutsche Fassung, auch über die englischen Slugs; auf englischen die englische, auch über die deutschen
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/lean-manufacturing/kaizen/", "en"), f"{BASE}/learn/lean-manufacturing/kaizen/")
        self.assertEqual(cx.link("https://www.m365.fm/learn/lean-management/kaizen/", "de"), f"{BASE}/de/learn/lean-management/kaizen/")
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/", "de"), f"{BASE}/de/learn/lean-management/pdca-zyklus/")
        self.assertEqual(cx.link("https://www.m365.fm/learn/lean-management/pdca-zyklus/", "en"), f"{BASE}/learn/lean-manufacturing/pdca-cycle/")
        self.assertEqual(cx.link("https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/", "fr"), f"{BASE}/learn/production-scheduling-aps/lot-sizing/", "übersetzte Sprachen: englische Vertiefung")
        self.assertIsNone(cx.link("https://www.m365.fm/en/learn/lean-manufacturing/andon/", "en"), "Vertiefung eines anderen Leitfadens")
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/", "en"), f"{BASE}/learn/")
        self.assertEqual(cx.link("https://www.m365.fm/en/learn/path/manufacturing-excellence/", "de"), f"{BASE}/de/learn/path/manufacturing-excellence/")
        self.assertEqual([w for w in cx.warn if "Pillar" in w], ["Pillar-Adresse unbekannt: https://www.m365.fm/en/learn/lean-manufacturing/andon/"])

    def test_all_learn_links_resolve(self):
        """Jede m365.fm/(en/)learn/-Adresse in Artikel, Autorenbox und Quellen aller englischen und deutschen Dateien (Leitfäden und Vertiefungen) führt auf
        eine gebaute Seite derselben Sprache (deutsche Dateien: /de/learn/...)."""
        built = {l: {S.url(BASE, p, l) for p in S.pillars() if S.has(p, l)} | {S.cluster_url(BASE, c, l) for c in S.clusters() if S.has_cluster(c, l)}
                 | {S.path_url(BASE, l), f"{BASE}{S.lp(l)}/learn/"} for l in S.LANGS}
        n = {"en": 0, "de": 0}
        for lang, p, f in FILES:
            d = S.parse_file(f)
            for part in ("article", "author", "sources"):
                for u in re.findall(r"https?://(?:www\.)?m365\.fm/(?:en/)?learn/[^\s)\]>\"'`]*", d[part]):
                    cx = ctx(); v = cx.link(u, lang); n[lang] += 1
                    self.assertFalse(cx.warn, f"{lang}/{p['id']}: {u}")
                    self.assertIn(v.split("#")[0], built[lang], f"{lang}/{p['id']}: {u} -> {v}")
                    self.assertNotIn("/en/learn/", v)
        self.assertGreater(n["en"], 500); self.assertGreater(n["de"], 700)

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
        # erster Treffer ein neuer Leitfaden: deutsche Blogseite verlinkt seine deutsche Fassung; übersetzte Sprachen (dort gibt es ihn noch nicht)
        # behalten den Kasten mit dem besten Leitfaden MIT Fassung der Sprache
        tpm = {"handle": "mirko-p", "slug": "total-productive-maintenance-pillars", "title": "The pillars of total productive maintenance", "topics": ["total-productive-maintenance"], "published": 3, "lang": "en"}
        S.assign(posts + [tpm])
        self.assertEqual(S.ASSIGN[("mirko-p", tpm["slug"])][0], "tpm-oee")
        self.assertIn(f"{BASE}/learn/tpm-oee/", S.article_box(tpm, "en", BASE))
        self.assertIn(f"{BASE}/de/learn/tpm-oee/", S.article_box(tpm, "de", BASE))
        self.assertIn(tpm, S.related("tpm-oee", "de")); self.assertNotIn(tpm, S.related("manufacturing-kpis", "de")); self.assertNotIn(tpm, S.related("manufacturing-kpis", "en"))
        fr_has = lambda p, l: S._has(p["id"], l) if l != "fr" else p.get("date") != "2026-11-26"   # fr wie heute: nur die 10 ersten Leitfäden
        with mock.patch.object(S, "active", lambda: ("en", "de", "fr")), mock.patch.object(S, "indexed", lambda l: True), mock.patch.object(S, "has", fr_has):
            S.MIXED_L.clear()
            self.assertIn(f"{BASE}/fr/learn/manufacturing-kpis/", S.article_box(tpm, "fr", BASE), "fr: Rückfall auf den besten Leitfaden mit fr-Fassung, nicht leer")
            self.assertIn(tpm, S.related("manufacturing-kpis", "fr"))
        S.MIXED_L.clear()
        S.assign(posts)
        self.assertNotIn(("mirko-p", "sharepoint-permissions"), S.ASSIGN)
        self.assertFalse(S.MIXED_L, "assign leert den Zwischenspeicher der übersetzten Sprachen")
        box = S.article_box(posts[0], "en", BASE)
        self.assertIn(f"{BASE}/learn/shop-floor-management/", box); self.assertIn(f"{BASE}/learn/path/manufacturing-excellence/", box)
        self.assertIn(f"{BASE}/de/learn/shop-floor-management/", S.article_box(posts[0], "de", BASE))
        self.assertEqual(S.article_box(posts[0], "ja", BASE), ""); self.assertEqual(S.article_box(posts[1], "en", BASE), "")

    def test_finish(self):
        h = S.finish("<p>Text [2] und [99] (planned) <a href='x'>l</a> [unverified]</p>", 3, "en")
        self.assertIn('href="#src-2"', h); self.assertNotIn("#src-99", h); self.assertNotIn("(planned)", h); self.assertIn("pl-unv", h)
        self.assertNotIn("(geplant)", S.finish("<p>Kanban (geplant) und geplante Instandhaltung</p>", 0, "de")); self.assertIn("geplante Instandhaltung", S.finish("<p>geplante Instandhaltung</p>", 0, "de"))



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
                       r"|planned (?:m365|[\w ]{0,40}(?:guide|compendium))|geplante[n]? Pillar|(?:Seite|Page|Leitfaden|Kompendium)[^.]{0,60} ist geplant\b|\(not yet published|(?:planned|geplant), not yet published|noch nicht veröffentlicht\)|\(in Vorbereitung|\(in preparation", re.I)


# Nur für die deutschen Dateien der Kurs-Erweiterung (26.11.2026): Marker, Wettbewerber-/SERP-Sätze, Redaktionsjargon, Prüfvermerke. Fachbegriffe bleiben
# ("geplante Instandhaltung", "Edge-/Kubernetes-Cluster", "Schwestermaschinen", das Buch "5 Pillars of the Visual Workplace").
FORBIDDEN_DE = re.compile(r"\[unbelegt|unbelegt\]|Wettbewerbsseite|Wettbewerberseite|rankende Seite|\bSERP\b|Parent-(?:Pillar|Leitfaden)|\bPillars?\b(?! of the Visual)(?!-)"
                          r"|Schwester(?:artikel|leitfaden|-Cluster|-Pillar|-Leitfaden)|Geschwister-Cluster|\bCluster (?:zu|zur|zum|des)\b|\[Cluster\b|Cluster-Artikel|vor Livegang|erneut abgerufen"
                          r"|V-Schwester|in dieser Sitzung|vor (?:der )?Veröffentlichung|Hinweis zur Wettbewerbsanalyse|\((?:geplant|geplanter Cluster)\)|, geplant\)"
                          r"|\bgeplante[nrs]? (?:Leitfaden|Leitfäden|Pillar|Cluster|Vertiefung)|Prüfrunde|SERP-Re-Check|Wettbewerbsanalyse")


class Rendered(unittest.TestCase):
    def test_no_internal_or_planned_notes_on_pages(self):
        for lang, p, f in FILES:
            d, body, src, heads = rendered(p, lang, f, ctx())
            txt = re.sub(r"<[^>]+>", " ", body + " " + src)
            m = FORBIDDEN.search(txt)
            self.assertIsNone(m, f"{lang}/{p['id']}: {m and txt[max(0, m.start() - 60):m.end() + 60]}")
            self.assertNotRegex(body, r"`/learn/", f"{lang}/{p['id']} Adresse in Backticks")
            self.assertNotRegex(txt, r"(?i)\b(?:the|our) planned (?:pillar|cluster|guide)|\(both planned\)|\(planned (?:cluster|pillar|guide)\)|(?:SMED|reduction|IIoT|ISA-95|62443) \(guide\)|competitor page|before publication", f"{lang}/{p['id']}")
            self.assertNotRegex(txt, r"\[(?:unverified|ungeprüft|unbelegt)|(?:unverified|ungeprüft|unbelegt)\]", f"{lang}/{p['id']}: Marker im Klartext")
            if lang == "de" and (p.get("date") == "2026-11-26" or p.get("parent")):
                txt2 = re.sub(r"<[^>]+>", " ", (S.scrub_deep(body) if p.get("parent") else body) + " " + src)
                m = FORBIDDEN_DE.search(txt2)
                self.assertIsNone(m, f"de/{p['id']}: {m and txt2[max(0, m.start() - 60):m.end() + 60]}")

    def test_german_jargon_rewritten(self):
        """_scrub_de: Redaktionssprache der deutschen Dateien wird lesbar, mit passendem Artikel; Fachbegriffe und alte Pillar-Seiten-Formulierungen bleiben."""
        L = "[TPM und OEE](https://www.m365.fm/learn/tpm-oee/)"
        for a, b in ((f"Der Pillar zu {L} zeigt", f"Der Leitfaden zu {L} zeigt"), ("Die Pillar ordnet Andon ein", "Der Leitfaden ordnet Andon ein"),
                     ("Die Regelrunden der Pillar setzen hier an", "Die Regelrunden des Leitfadens setzen hier an"), (f"siehe {L} in der Pillar.", f"siehe {L} im Leitfaden."),
                     ("Das Beispiel des Parent-Pillars nutzt", "Das Beispiel des übergeordneten Leitfadens nutzt"), (f"im [Cluster zu Lieferketten](https://www.m365.fm/learn/x/y/)", "in der [Vertiefung zu Lieferketten](https://www.m365.fm/learn/x/y/)"),
                     (f"übereinstimmen; der [Cluster zur Standardarbeit](https://www.m365.fm/learn/x/y/)", "übereinstimmen; die [Vertiefung zur Standardarbeit](https://www.m365.fm/learn/x/y/)"),
                     (f"aus dem [Cluster zur Matrix](https://www.m365.fm/learn/x/y/)", "aus der [Vertiefung zur Matrix](https://www.m365.fm/learn/x/y/)"),
                     (f"Der Schwesterartikel zur {L} hilft", f"Der verwandte Artikel zur {L} hilft"), (f"(siehe {L}, geplant)", f"(siehe {L})"),
                     (f"siehe den geplanten Pillar zu {L}.", f"siehe den Leitfaden zu {L}."), ("Wettbewerbsseiten zählen Vorteile auf.", "Viele Webseiten zählen Vorteile auf."),
                     ("MES-Preisspannen von Wettbewerbsseiten haben", "MES-Preisspannen von anderen Webseiten haben"), ("Eine gut rankende Seite schreibt", "Eine viel gelesene Seite schreibt"),
                     ("**Verwandte Pillars und Cluster (vor Livegang Links prüfen)**", "**Verwandte Leitfäden und Vertiefungen**")):
            self.assertEqual(S._scrub_de(a), b)
        self.assertEqual(S.scrub("**Schwester-Cluster (geplant)**"), "**Weitere Vertiefungen**")
        for keep in ("geplante Instandhaltung", "in der Pillar-Seite zur Wertstromanalyse", "die zwei Schwestermaschinen", "Hiranos *5 Pillars of the Visual Workplace*",
                     "Ein Kubernetes-Cluster mit Arc", "39. Wettbewerberseiten: https://a.example"):
            self.assertEqual(S._scrub_de(keep), keep)
        self.assertEqual(S.sources_html(S.scrub("1. Fraunhofer. https://a.example\n2. Wettbewerberseiten: https://b.example"), "de", ctx())[2], {2}, "Wettbewerberseiten-Quelle entfällt")

    def test_anchor_umlauts(self):
        """Inhaltsverzeichnis der deutschen Vertiefungen: #haeufige-fehler findet die Überschrift "Häufige Fehler" (ID häufige-fehler)."""
        cx = ctx(); body, heads = S.render("[Fehler](#haeufige-fehler) [Groesse](#3-losgroesse-und-ruestzeit)\n\n## Häufige Fehler\n\n## 3. Losgröße und Rüstzeit", "de", cx)
        h = S.fix_anchors(body, heads, cx)
        self.assertIn('href="#häufige-fehler"', h); self.assertIn('href="#3-losgröße-und-rüstzeit"', h); self.assertFalse(cx.warn)

    def test_unverified_reason_in_tooltip(self):
        h = S.finish("<p>x [unverified: practitioner estimate] y [ungeprüft]</p>", 0, "en")
        self.assertEqual(h.count("pl-unv"), 2); self.assertIn("Practitioner estimate.", h); self.assertNotIn("[unverified", h)
        h = S.finish("<p>a [unverified as a statistic] b [unverified; practitioner estimate] c [unverified as to current volume; check the CISA advisories page] "
                     "d [unverified as a published benchmark; use as an internal target only] e [unverified against Shingo's own books in this session] f [unverified : statut]</p>", 0, "en")
        self.assertEqual(h.count("pl-unv"), 6); self.assertNotIn("[unverified", h)
        for x in ("As a statistic.", "Practitioner estimate.", "As to current volume.", "As a published benchmark.", "Against Shingo's own books.", "Statut."): self.assertIn(x, h)
        self.assertNotRegex(h, r"CISA advisories|internal target|this session")
        # deutsche Marker der Kurs-Erweiterung: [unbelegt], Grund mit Zitat [n], nachgestellte Formen; Aufträge an die Redaktion entfallen im Tooltip
        h = S.finish("<p>a [unbelegt] b [unbelegt: Praxiswert; vor Veröffentlichung beim Kunden bestätigen] c [unbelegt: Spanne nach [1] und Praxis] d [Praxiswert, unbelegt] "
                     "e [als Statistik unbelegt] f [practitioner range, unverified] g [unbelegt; in dieser Sitzung nicht geprüft, anhand der Norm prüfen]</p>", 1, "de")
        self.assertEqual(h.count("pl-unv"), 7); self.assertNotRegex(re.sub(r' title="[^"]*"', "", h), r"\[|\]|unbelegt")
        for x in ("Praxiswert.", "Spanne nach [1] und Praxis.", "Als Statistik.", "Practitioner range."): self.assertIn(x, h)
        self.assertNotRegex(h, r"Veröffentlichung|in dieser Sitzung|anhand der Norm")
        h = S.inline("[unverified: siehe [Kennzahlen](https://www.m365.fm/learn/manufacturing-kpis/) im Leitfaden]", "en", ctx())
        self.assertTrue(h.startswith("[unverified: siehe <a href="), "Marker-Text wird nie Linktext (kein [ im Linktext)")
        self.assertEqual(S.finish(f"<p>x {h}</p>", 0, "en").count("pl-unv"), 1)

    def test_source_markers(self):
        """Marker in einer Quellenangabe: Etikett, der Grund bleibt lesbar (mit Link auf die Ersatzquelle)."""
        h, valid, _ = S.sources_html("1. Andler, Kurt: Rationalisierung. 1929 [ungeprüft: Original nicht eingesehen; Formel nach Uni Duisburg-Essen: https://www.uni-due.de/x.pdf].", "de", ctx())
        self.assertIn("pl-unv", h); self.assertNotIn("[ungeprüft", h); self.assertIn("(Original nicht eingesehen; Formel nach Uni Duisburg-Essen: <a href=\"https://www.uni-due.de/x.pdf\"", h)

    def test_sources_status_marks_removed(self):
        """Prüfvermerke der Faktenprüfung ((S), (*), (V-sister), Dateinamen, "via sibling pillar") stehen nicht in der Quellenliste; (S&OP), (UNS) bleiben."""
        de = ("1. Hirano. https://a.example (V-Schwester)\n2. Ohno. https://b.example (S; erneut abgerufen am 26.11.2026)\n3. Shingo. https://c.example (für den Schwester-Pillar Lean geprüft)\n"
              "4. Dragos. https://d.example (Wettbewerbsseite, nur für die SERP-Analyse genutzt)\n5. Gitnux. https://e.example (genutzt für die Wettbewerbsanalyse und als Verweis auf die Studie; in Prüfrunde 3 erneut geprüft)")
        h, valid, dropped = S.sources_html(S.scrub(de), "de", ctx())
        self.assertEqual((valid, dropped), ({1, 2, 3, 5}, {4}))
        t = re.sub(r"<[^>]+>", " ", h)
        self.assertNotRegex(t, r"Schwester|erneut|Wettbewerb|SERP|Prüfrunde|genutzt für|\((?:V|F|S|P)[;,:)]"); self.assertIn("(abgerufen am 26.11.2026)", t); self.assertIn("Gitnux.", t)
        self.assertIn("(Verweis auf die Studie)", S.sources_html("1. Gitnux. https://e.example (genutzt für die Wettbewerbsanalyse und als Verweis auf die Studie)", "de", ctx())[0])
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
        """Leitfaden ohne Fassung der Sprache (hier gespielt: tpm-oee ohne deutsche Datei): Link auf die englische Seite mit hreflang="en"."""
        cx = ctx()
        with mock.patch.object(S, "has", lambda p, l: S._has(p["id"], l) and not (p["id"] == "tpm-oee" and l == "de")):
            h = S.inline("[TPM](https://www.m365.fm/en/learn/tpm-oee/) und [Lean](https://www.m365.fm/learn/lean-manufacturing/)", "de", cx)
        self.assertIn('href="https://www.m365.fm/learn/tpm-oee/" hreflang="en" lang="en"', h)
        self.assertIn('href="https://www.m365.fm/de/learn/lean-management/">', h)
        self.assertNotIn("hreflang", S.inline("[TPM](https://www.m365.fm/en/learn/tpm-oee/)", "en", cx))


class Build(unittest.TestCase):
    def setUp(self):
        import json
        self.files, self.sm = {}, []
        g = dict(BASE=BASE, write=lambda rel, html: self.files.__setitem__(rel, html), sitemap=self.sm, author_box=None, LANGS=("en", "de"),
                 page=lambda lang, title, desc, canon, body, alts, ld, **kw: json.dumps({"ld": ld, "alts": alts, "canon": canon, "desc": desc}, ensure_ascii=False) + "\n" + body,
                 header=lambda l, x: "", footer=lambda l: "", footer_en=lambda: "")
        posts = [{"handle": "mirko-p", "slug": "what-is-a-gemba-walk", "title": "What is a gemba walk", "topics": ["gemba-walk"], "published": 5, "lang": "en"},
                 {"handle": "mirko-p", "slug": "what-is-a-gemba-walk", "title": "Was ist ein Gemba Walk", "topics": ["gemba-walk"], "lang": "de", "tr_of": 1}]
        import contextlib, io
        from unittest import mock
        import site_infographics as _IG
        out = io.StringIO()
        with contextlib.redirect_stdout(out), mock.patch.object(S, "active", lambda: ("en", "de")), mock.patch.object(_IG, "get", lambda *a: None):   # unabhaengig von den echten Infografik-Daten
            S.build(g, posts, {"kaizen", "digital-twin"})
        self.json, self.log = json, out.getvalue()

    def test_pages_schema_and_language_links(self):
        self.assertEqual(len(self.files), 74)   # 20 en + 20 de Leitfäden, 15 + 15 Vertiefungen, 2 Pfadseiten, 2 Testseiten (Abschlusstest)
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
        for rel, h in self.files.items():   # Redaktionsabschnitte der deutschen Dateien werden nie zum Artikel
            self.assertNotRegex(re.search(r"<h1>(.*?)</h1>", h).group(1), r"(?i)hinweis zur wettbewerb|seo-metadaten|prüfhinweise|wettbewerbsanalyse", rel)
            self.assertNotRegex(h.split("\n", 1)[1], r"Lesezeit:|SEO-Metadaten|Prüfhinweise für die Redaktion|Hinweis zur Wettbewerbsanalyse|\(\d+ Zeichen\)", rel)

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

    def test_clusters_and_new_guides(self):
        meta = lambda rel: self.json.loads(self.files[rel].split("\n", 1)[0])
        sm = {u: (d, a) for u, d, a in self.sm}
        for c in S.clusters():
            p = S.by_id(c["parent"])
            urls = {l: S.cluster_url(BASE, c, l) for l in ("en", "de")}
            self.assertEqual(urls["de"], f"{BASE}/de/learn/{p['slug']['de']}/{c['slug']['de']}/")
            for lang in ("en", "de"):
                u = urls[lang]; rel = u[len(BASE) + 1:] + "index.html"
                m = meta(rel)
                self.assertEqual(m["canon"], u); self.assertEqual(m["alts"], urls, "hreflang-Paar en<->de")
                self.assertEqual(sm[u], ("2026-11-26", urls))
                art = next(n for n in m["ld"] if n["@type"] == "Article")
                self.assertEqual(art["url"], u); self.assertEqual(art["inLanguage"], lang)
                self.assertIn(S.url(BASE, p, lang) + "#article", [x["@id"] for x in art["isPartOf"]])
                self.assertIn(S.path_url(BASE, lang) + "#course", [x["@id"] for x in art["isPartOf"]])
                self.assertIn(f'href="{S.url(BASE, p, lang)}" rel="up"', self.files[rel])
                ol = "de" if lang == "en" else "en"
                self.assertIn(f'href="{urls[ol]}" hreflang="{ol}"', self.files[rel], "Link auf die andere Sprachfassung")
            self.assertIn(f"Vertiefung · Teil von <a href=\"{S.url(BASE, p, 'de')}\">", self.files[urls["de"][len(BASE) + 1:] + "index.html"])
        for p in NEW:
            urls = {l: S.url(BASE, p, l) for l in ("en", "de")}
            for lang in ("en", "de"):
                rel = urls[lang][len(BASE) + 1:] + "index.html"
                self.assertEqual(meta(rel)["canon"], urls[lang]); self.assertEqual(meta(rel)["alts"], urls); self.assertEqual(sm[urls[lang]], ("2026-11-26", urls))
        lean = self.files["learn/lean-manufacturing/index.html"]
        box = lean[lean.index('class="pl-box pl-deep"'):]; box = box[:box.index("</section>")]
        self.assertEqual(sorted(re.findall(r'href="https://www\.m365\.fm/learn/lean-manufacturing/([a-z0-9-]+)/"', box)), ["a3-problem-solving", "kaizen", "pdca-cycle", "poka-yoke"])
        de = self.files["de/learn/lean-management/index.html"]
        box = de[de.index('class="pl-box pl-deep"'):]; box = box[:box.index("</section>")]
        self.assertIn("<h2 id=\"pl-deep-h\">Vertiefungen</h2>", box); self.assertNotIn("auf Englisch", box); self.assertNotIn('hreflang="en"', box)
        self.assertEqual(sorted(re.findall(r'href="https://www\.m365\.fm/de/learn/lean-management/([a-z0-9-]+)/"', box)), ["a3-methode", "kaizen", "pdca-zyklus", "poka-yoke"])
        art = next(n for n in self.json.loads(de.split("\n", 1)[0])["ld"] if n["@type"] == "Article")
        self.assertEqual([x["url"] for x in art["hasPart"]], [S.cluster_url(BASE, c, "de") for c in S.clusters_of("lean-manufacturing")])
        self.assertIn("Step 9 of 20", self.files["learn/tpm-oee/index.html"])
        self.assertIn("Schritt 9 von 20", self.files["de/learn/tpm-oee/index.html"])
        n = [p["id"] for p in S.order()].index("value-stream-mapping") + 1
        self.assertIn(f"Schritt {n} von 20", self.files["de/learn/wertstromanalyse/index.html"])

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
        for h, pre in ((en, ""), (de, "/de")):
            self.assertEqual(h.count('class="pl-stage"'), 4); self.assertEqual(h.count('class="pl-card"'), 20)
            self.assertEqual(len(set(re.findall(r'href="https://www\.m365\.fm' + pre + r'/learn/(?!path/)[a-z0-9-]+/[a-z0-9-]+/"', h))), 15)
            self.assertEqual(re.findall(r'pl-step-n">(\d+)', h), [str(i) for i in range(1, 21)])
            course = next(n for n in self.json.loads(h.split("\n", 1)[0])["ld"] if n["@type"] == "Course")
            self.assertEqual(len(course["hasPart"]), 35); self.assertFalse([x for x in course["hasPart"] if "inLanguage" in x], "alle Teile in der Sprache der Seite")
        self.assertEqual(de.count("auf Englisch"), 0); self.assertNotIn('hreflang="en"', de.split("\n", 1)[1], "keine Karte und keine Vertiefung mehr auf Englisch")
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
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr); self.assertIn("74 Seiten mit JSON-LD", r.stdout)
        for rel in ("learn/lean-manufacturing/index.html", "learn/lean-manufacturing/kaizen/index.html", "de/learn/lean-management/index.html", "de/learn/lean-management/kaizen/index.html"):
            art = next(n for n in self.json.loads(self.files[rel].split("\n", 1)[0])["ld"] if n.get("@type") == "Article")
            for x in (art.get("hasPart") or []) + [y for y in (art["isPartOf"] if isinstance(art["isPartOf"], list) else [art["isPartOf"]]) if y.get("@type") != "Course"]:
                self.assertNotIn("@type", x, rel); self.assertTrue(x["@id"].endswith("/#article"), rel)

    def test_pages_clean_markers_and_jargon(self):
        for rel, html in self.files.items():
            body = re.sub(r"<style>.*?</style>", "", html.split("\n", 1)[1], flags=re.S)
            txt = re.sub(r"<[^>]+>", " ", body)
            self.assertNotRegex(txt, r"\[(?:unverified|ungeprüft|unbelegt)|(?:unverified|ungeprüft|unbelegt)\]", rel)
            src = re.sub(r"<[^>]+>", " ", body[body.find('id="sources"'):]) if 'id="sources"' in body else ""
            self.assertNotRegex(src, r"\.md\b|(?i:sister|sibling|parent pillar)|\((?:V|F|S|P)(?:-sister)?\)|\((?:\*|†)\)|\((?:V|F|S|P)[;,:]", rel)
            if rel.count("/") == 3 and not rel.startswith(("de/", "learn/path/")):   # Vertiefungen
                self.assertNotRegex(txt, r"(?i)cluster article|a cluster of the|parent pillar|\bthe pillar\b|\bsibling\b|pillar guide|\[pillar\b|ranking explainers|ranking page|top-ranking|\bcluster \[|\w cluster\b(?! after| in the last)", rel)
            if rel.startswith("de/") and (rel.count("/") == 4 and "/path/" not in rel or any(rel == f"de/learn/{p['slug']['de']}/index.html" for p in NEW)):   # neue deutsche Seiten
                self.assertNotRegex(txt, FORBIDDEN_DE, rel)
                self.assertNotRegex(txt, r"(?i)cluster-artikel|\bder Leitfaden-|\bin der Leitfaden\b|der Regelrunden der Leitfaden|\bim \[Vertiefung|\bder \[Vertiefung|dem \[Vertiefung", rel)
        self.assertNotRegex(self.files["learn/mes-isa-95/index.html"], r"ranking explainers|question on google\.com")

    def test_see_hints_under_sections(self):
        # Befund Kannibalisierung: der Überblick verweist im Abschnitt selbst auf die spezialisierte Seite (data/pillars.json "see")
        self.assertNotIn("Sprungmarke für Hinweis", self.log)   # jede Sprungmarke der Registry trifft eine Überschrift (en, de)
        n = 0
        for p in S.pillars():
            for e in p.get("see") or ():
                for t in e["to"]: self.assertTrue(S.by_id(t) or any(c["id"] == t for c in S.clusters()), f"{p['id']}: see {t} unbekannt")
                self.assertTrue(set(e["at"]) <= {"en", "de"} and e["at"], p["id"]); n += 1
        self.assertGreaterEqual(n, 40)
        def sec(rel, anchor):
            h = self.files[rel]; i = h.index(f'id="{anchor}"'); j = h.find("<h2", i + 10); return h[i:j]
        cases = (("de/learn/produktionsplanung-aps/index.html", "10-sicherheitsbestand-formel-und-rechenbeispiel", "/de/learn/produktionsplanung-aps/bestandsmanagement/"),
                 ("de/learn/produktionsplanung-aps/index.html", "9-losgrößen-andler-formel-rechenbeispiel-und-kritik", "/de/learn/produktionsplanung-aps/losgroesse/"),
                 ("de/learn/produktionsplanung-aps/index.html", "7-engpasstheorie-drum-buffer-rope-und-buffer-management", "/de/learn/theory-of-constraints-engpass/"),
                 ("de/learn/produktionskennzahlen/index.html", "7-oee-gesamtanlageneffektivität-richtig-berechnen", "/de/learn/tpm-oee/"),
                 ("de/learn/lean-management/index.html", "kaizen-und-kvp", "/de/learn/lean-management/kaizen/"),
                 ("de/learn/lean-management/index.html", "5s-ordnung-als-fundament", "/de/learn/5s-methode-visuelles-management/"),
                 ("learn/production-scheduling-aps/index.html", "10-safety-stock-formula-and-worked-example", "/learn/production-scheduling-aps/manufacturing-inventory-management/"),
                 ("learn/manufacturing-kpis/index.html", "7-oee-how-to-calculate-overall-equipment-effectiveness", "/learn/tpm-oee/"))
        for rel, anchor, target in cases:
            s = sec(rel, anchor); self.assertRegex(s, r'</h[23]><p class="pl-see"><b>(?:Ausführlich|In depth):</b> <a href="' + re.escape(BASE + target) + '"', rel + "#" + anchor)
        self.assertNotIn('class="pl-see"', self.files["learn/ifakt-polaris/index.html"]); self.assertNotIn('class="pl-see"', self.files["de/learn/tpm-oee/index.html"])
        # Ziel schon im Abschnitt verlinkt: kein zweiter Hinweis; fehlende Sprungmarke: Seite unverändert, Hinweis im Log
        p = {"id": "x", "slug": {"en": "x", "de": "x"}, "see": [{"to": ["tpm-oee"], "at": {"de": "a"}}, {"to": ["tpm-oee"], "at": {"de": "fehlt"}}]}
        body = f'<h2 id="a">A</h2><p>Siehe <a href="{BASE}/de/learn/tpm-oee/">TPM</a>.</p><h2 id="b">B</h2>'
        import contextlib, io
        out = io.StringIO()
        with contextlib.redirect_stdout(out): self.assertEqual(S.see_links(body, p, "de", BASE, {}), body)
        self.assertIn("Sprungmarke für Hinweis „Ausführlich:“ fehlt: de/x#fehlt", out.getvalue())
        self.assertIn('<h2 id="b">B</h2><p class="pl-see">', S.see_links(body.replace('id="b"', 'id="b"'), {**p, "see": [{"to": ["tpm-oee"], "at": {"de": "b"}}]}, "de", BASE, {}))
        self.assertEqual(S.see_links(body, p, "fr", BASE, {}), body)   # übersetzte Sprachen: keine Sprungmarken bekannt

    def test_old_german_jargon_and_serp_lines(self):
        for rel, html in self.files.items():
            txt = re.sub(r"<[^>]+>", " ", re.sub(r"<style>.*?</style>", "", html.split("\n", 1)[1], flags=re.S))
            if rel.startswith("de/"): self.assertNotRegex(txt, r"Pillar-(?:Seite|Page)|Schwester-Kompendi|\bin der Leitfaden\b", rel)
            self.assertNotRegex(txt, r"ERP vendors and competitors|ERP-Anbietern und Wettbewerbern", rel)
            if rel != "learn/ifakt-polaris/index.html": self.assertNotRegex(txt, r"\bSERP\b", rel)   # ifakt-polaris (en): Satz bleibt bis zur Entscheidung, sonst gilt die Übersetzung als veraltet
        de = self.files["de/learn/lean-management/index.html"]
        self.assertIn(f'Eine Vertiefung ist im Leitfaden <a href="{BASE}/de/learn/produktionskennzahlen/">Produktionskennzahlen</a> zu finden.', de)
        self.assertIn(f'Die Methodik wird im Leitfaden <a href="{BASE}/de/learn/shop-floor-management/">Shopfloor Management</a> vertieft.', de)
        self.assertIn(f'gibt der Leitfaden <a href="{BASE}/de/learn/manufacturing-it-azure/">Manufacturing IT mit Azure</a>.', self.files["de/learn/digital-twin/index.html"])
        self.assertIn(f'Ausführlich behandelt der Leitfaden <a href="{BASE}/de/learn/produktionsplanung-aps/">', self.files["de/learn/produktionsplanung-luftfahrt/index.html"])
        self.assertEqual(S._scrub_old_de("Mehr in der Pillar-Seite zu Unbekanntem."), "Mehr in der Pillar-Seite zu Unbekanntem.")   # nur bekannte Leitfäden werden zum Link

    def test_cluster_without_duplicate_sibling_box(self):
        for rel in ("learn/lean-manufacturing/kaizen/index.html", "de/learn/lean-management/kaizen/index.html"):
            h = self.files[rel]
            self.assertNotIn("More deep dives in this guide", h); self.assertNotIn("Weitere Vertiefungen dieses Leitfadens", h)
            for sib in ("pdca", "a3", "poka-yoke"): self.assertIn(sib, h.split("</article>")[0], rel)   # die Liste der Datei bleibt, mit allen Geschwistern
            self.assertIn('rel="up"', h)

    def test_path_description_and_lastmod(self):
        for lang, rel in (("en", "learn/path/manufacturing-excellence/index.html"), ("de", "de/learn/path/manufacturing-excellence/index.html")):
            d = self.json.loads(self.files[rel].split("\n", 1)[0])["desc"]
            self.assertLessEqual(len(d), 155, rel); self.assertEqual(d, S.registry()["path"]["seo_desc"][lang])
        for rel in self.files:
            if "/learn/path/" not in rel: self.assertLessEqual(len(self.json.loads(self.files[rel].split("\n", 1)[0])["desc"] or ""), 160, rel)
        sm = {u: d for u, d, a in self.sm}
        self.assertEqual(sm[f"{BASE}/de/learn/produktionsplanung-aps/"], "2026-11-26")   # neue Links (Kästen, "Ausführlich:") auf Seiten vom 26.11.
        self.assertEqual(sm[f"{BASE}/learn/manufacturing-kpis/"], "2026-11-26")
        self.assertEqual(sm[f"{BASE}/de/learn/ifakt-polaris/"], "2026-11-20")   # ohne neue Links bleibt das Datum der Datei
        art = next(n for n in self.json.loads(self.files["de/learn/produktionsplanung-aps/index.html"].split("\n", 1)[0])["ld"] if n.get("@type") == "Article")
        self.assertEqual(art["dateModified"], "2026-11-20")

    def test_log_without_noise_for_untranslated_guides(self):
        import contextlib, io, json as _j
        import site_infographics as _IG
        files, out = {}, io.StringIO()
        g = dict(BASE=BASE, write=lambda rel, html: files.__setitem__(rel, html), sitemap=[], author_box=None, LANGS=("en", "de"),
                 page=lambda *a, **kw: "{}\n", header=lambda l, x: "", footer=lambda l: "", footer_en=lambda: "")
        if not any((S.DIR / "fr").glob("*.md")) or "fr" not in ((S.overlay().get("ui")) or {}): self.skipTest("keine französische Fassung")
        with contextlib.redirect_stdout(out), mock.patch.object(S, "active", lambda: ("en", "de", "fr")), mock.patch.object(_IG, "get", lambda *a: None):
            S.build(g, [], set())
        log = out.getvalue()
        new_fr = [p for p in S.pillars() if not S.has(p, "fr")]
        self.assertTrue(new_fr)
        self.assertNotIn("Datei fehlt oder leer: fr/", log)   # nur eine andere Übersetzung macht eine fehlende Datei zum Hinweis
        self.assertIn(f"noch ohne Übersetzung (translate-pillars.yml): fr {len(new_fr)}", log)
        self.assertNotIn("Datei fehlt oder leer: en/", log); self.assertNotIn("Datei fehlt oder leer: de/", log)

    def test_related_guides_box(self):
        lean = self.files["learn/lean-manufacturing/index.html"]
        box = lean[lean.index('class="pl-box pl-deep pl-relg"'):]; box = box[:box.index("</section>")]
        self.assertEqual(re.findall(r'href="https://www\.m365\.fm/learn/([a-z0-9-]+)/"', box), ["5s-visual-management", "kanban-pull-system", "smed-changeover-reduction", "tpm-oee"])
        for rel, ids in (("learn/production-scheduling-aps/index.html", ["sop-mrp-production-planning", "theory-of-constraints"]), ("learn/manufacturing-kpis/index.html", ["tpm-oee", "six-sigma-root-cause-analysis"])):
            h = self.files[rel]; box = h[h.index("pl-relg"):]; box = box[:box.index("</section>")]
            self.assertEqual(re.findall(r'href="https://www\.m365\.fm/learn/([a-z0-9-]+)/"', box), ids)
        de = self.files["de/learn/lean-management/index.html"]; box = de[de.index("pl-relg"):]; box = box[:box.index("</section>")]
        self.assertIn("Weiterführende Leitfäden", box)
        self.assertEqual(re.findall(r'href="https://www\.m365\.fm/de/learn/([a-z0-9-]+)/"', box), ["5s-methode-visuelles-management", "kanban-pull-prinzip", "smed-ruestzeitreduzierung", "tpm-oee"])
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
        self.assertIn("Vertiefung en/kaizen nicht gebaut", out.getvalue())
        self.assertNotIn("learn/lean-manufacturing/kaizen/index.html", files); self.assertIn("learn/lean-manufacturing/pdca-cycle/index.html", files)
        self.assertNotIn("de/learn/lean-management/kaizen/index.html", files, "ohne englische Fassung keine deutsche (x-default)"); self.assertIn("de/learn/lean-management/pdca-zyklus/index.html", files)
        self.assertFalse([rel for rel, h in files.items() if "/learn/lean-manufacturing/kaizen/" in h or "/learn/lean-management/kaizen/" in h], "kein Link auf die nicht gebaute Vertiefung")

    def test_broken_german_deep_dive_falls_back_to_english(self):
        import contextlib, io
        import site_infographics as _IG
        files, alts = {}, {}
        g = dict(BASE=BASE, write=lambda rel, html: files.__setitem__(rel, html), sitemap=[], author_box=None, LANGS=("en", "de"),
                 page=lambda lang, title, desc, canon, body, a, ld, **kw: alts.__setitem__(canon, a) or body, header=lambda l, x: "", footer=lambda l: "", footer_en=lambda: "")
        real = S.parse_file
        def broken(path):
            if Path(path).parent == S.DIR / "de" / "clusters" and Path(path).name == "kaizen.md": raise ValueError("kaputt")
            return real(path)
        out = io.StringIO()
        with contextlib.redirect_stdout(out), mock.patch.object(S, "active", lambda: ("en", "de")), mock.patch.object(_IG, "get", lambda *a: None), mock.patch.object(S, "parse_file", broken):
            S.build(g, [], set())
        self.assertIn("Vertiefung de/kaizen nicht gebaut", out.getvalue()); self.assertNotIn("Vertiefung en/kaizen", out.getvalue())
        self.assertNotIn("de/learn/lean-management/kaizen/index.html", files); self.assertIn("learn/lean-manufacturing/kaizen/index.html", files)
        self.assertIsNone(alts[f"{BASE}/learn/lean-manufacturing/kaizen/"], "ohne deutsche Fassung kein hreflang")
        de = files["de/learn/lean-management/index.html"]
        self.assertIn(f'href="{BASE}/learn/lean-manufacturing/kaizen/" hreflang="en" lang="en"', de, "Kasten verlinkt die englische Fassung")
        self.assertFalse([rel for rel, h in files.items() if "/de/learn/lean-management/kaizen/" in h])

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
        for u in (f"{BASE}/learn/tpm-oee/", f"{BASE}/learn/lean-manufacturing/kaizen/", f"{BASE}/de/learn/tpm-oee/", f"{BASE}/de/learn/lean-management/kaizen/"):
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
        """Seiten ausser Englisch: Beiträge, deren erster Leitfaden keine Fassung der Sprache hat (hier TPM in fr), stehen nach Güte zwischen den übrigen
        des besten Leitfadens mit Fassung, nicht dahinter. Deutsch: TPM hat eine deutsche Fassung, der Beitrag bleibt dort."""
        S.assign([{"handle": "h", "slug": "takt-basics", "title": "Takt basics", "topics": [], "published": 9, "lang": "en"},
                  {"handle": "h", "slug": "autonomous-maintenance-basics", "title": "Autonomous maintenance and OEE", "topics": ["total-productive-maintenance"], "published": 1, "lang": "en"}])
        self.assertEqual(S.ASSIGN[("h", "autonomous-maintenance-basics")], ["tpm-oee"]); self.assertEqual(S.ASSIGN_DE[("h", "autonomous-maintenance-basics")], "tpm-oee")
        self.assertEqual([x["slug"] for x in S.related("manufacturing-kpis", "de")], ["takt-basics"]); self.assertEqual([x["slug"] for x in S.related("tpm-oee", "de")], ["autonomous-maintenance-basics"])
        self.assertEqual([x["slug"] for x in S.related("manufacturing-kpis", "en")], ["takt-basics"])
        with mock.patch.object(S, "has", lambda p, l: S._has(p["id"], l) if l != "fr" else p.get("date") != "2026-11-26"):
            S.MIXED_L.clear()
            self.assertEqual([x["slug"] for x in S.related("manufacturing-kpis", "fr")], ["autonomous-maintenance-basics", "takt-basics"])
        S.MIXED_L.clear()

    def test_pins(self):
        S.assign([{"handle": "h", "slug": "modular-production-planning-software-modules", "title": "Modules", "topics": ["advanced-planning-and-scheduling", "finite-capacity-scheduling", "polaris"], "published": 1, "lang": "en"}])
        self.assertIn("ifakt-polaris", S.ASSIGN[("h", "modular-production-planning-software-modules")])


def _build_files(progress):
    import contextlib, io
    import site_infographics as _IG
    files = {}
    g = dict(BASE=BASE, write=lambda rel, html: files.__setitem__(rel, html), sitemap=[], author_box=None, LANGS=("en", "de"),
             page=lambda lang, title, desc, canon, body, alts, ld, **kw: body, header=lambda l, x: "", footer=lambda l: "", footer_en=lambda: "")
    with contextlib.redirect_stdout(io.StringIO()), mock.patch.object(S, "active", lambda: ("en", "de")), mock.patch.object(_IG, "get", lambda *a: None), mock.patch.object(S, "PROGRESS", progress):
        S.build(g, [], set())
    return files


class Progress(unittest.TestCase):
    """Lernfortschritt (Plan v2, Seiten-Teil): Marker und Kaesten auf Leitfaden, Vertiefung und Pfadseite; PROGRESS=False -> HTML wie vorher."""
    MARKERS = (' data-lpx="', "lpx-data", "lpx-on", 'class="pl-lpx"', ' data-pid="', ' data-cid="', ' data-vid="', 'class="pl-end"', 'class="pl-done"', 'class="pl-qopen"', "m365-learn")

    @classmethod
    def setUpClass(cls):
        cls.on, cls.off = _build_files(True), _build_files(False)

    def cfg(self, h):
        import json
        return json.loads(re.search(r'<script type="application/json" id="lpx-data">(.*?)</script>', h).group(1))

    def test_off_is_old_html(self):
        """Ohne Lernfortschritt keine Spur davon, und die Seiten mit Lernfortschritt unterscheiden sich nur um dessen Teile."""
        self.assertEqual(set(self.on), set(self.off))
        strip = [(re.escape(S.LPX_CSS), ""), (re.escape(S.LPX_EARLY) + r'<div class="pl-lpx".*?<div class="lpx-b"></div></div>', ""),
                 (r' data-lpx="[^"]*" data-k="[gc]" data-id="[^"]*" data-l="[a-z]+" data-min="\d+"', ""), (re.escape(S.LP_END), ""),
                 (r'<p class="pl-done"(?: lang="en")?>.*?</p><script type="application/json" id="lpx-data">.*?</script>', ""), (r'<script type="application/json" id="lpx-data">.*?</script>', ""),
                 (r' data-(?:pid|cid|vid)="[^"]*"', ""), (r'<p class="pl-qopen"></p>', "")]
        for rel, h in self.off.items():
            for m in self.MARKERS: self.assertNotIn(m, h, rel)
            x = self.on[rel]
            for rx, to in strip: x = re.sub(rx, to, x, flags=re.S)
            self.assertEqual(x, h, rel)
        reg = S.registry(); reg_off = {**reg, "path": {**reg["path"], "progress": False}}
        with mock.patch.object(S, "registry", lambda: reg_off):
            self.assertFalse(S.progress_on())
        self.assertTrue(S.progress_on())

    def test_guide_and_deep_dive(self):
        for rel, k, pid, lang, toc in (("de/learn/lean-management/index.html", "g", "lean-manufacturing", "de", "inhaltsverzeichnis"),
                                       ("learn/lean-manufacturing/index.html", "g", "lean-manufacturing", "en", "table-of-contents"),
                                       ("learn/lean-manufacturing/kaizen/index.html", "c", "kaizen", "en", None)):
            h = self.on[rel]
            m = re.search(r'<article class="pl-art" data-lpx="manufacturing-excellence" data-k="(\w)" data-id="([^"]+)" data-l="(\w+)" data-min="(\d+)">', h)
            self.assertTrue(m, rel); self.assertEqual(m.groups()[:3], (k, pid, lang)); self.assertGreaterEqual(int(m.group(4)), 1)
            art = h[m.start():h.index("</article>", m.start())]
            self.assertTrue(art.endswith(S.LP_END), "Ende-Marker ist das letzte Kind des Artikels")
            self.assertLess(art.index('<p class="pl-meta">'), art.index('class="pl-lpx"'), "Kasten nach der Meta-Zeile")
            self.assertLess(art.index('class="pl-lpx"'), art.index("<h2"), "Kasten vor dem Text")
            self.assertIn('<button type="button" class="btn main" id="lpx-save" disabled>', art, "ohne JS deaktiviert")
            self.assertEqual(h.count('id="lpx"'), 1); self.assertEqual(h.count('id="lpx-data"'), 1)
            after = h[h.index("</article>"):]
            self.assertTrue(after.startswith('</article><p class="pl-done"><a href="'), rel)
            self.assertLess(after.index("pl-done"), after.index('class="pl-step"'))
            c = self.cfg(h)
            self.assertEqual((c["path"], c["lang"], c["k"], c["id"]), ("manufacturing-excellence", lang, k, pid))
            self.assertEqual(c["min"], int(m.group(4))); self.assertEqual(c["api"], "https://api-dub.m365.fm")
            self.assertEqual(set(c["t"]), set(S.LP_JS[k]))
            self.assertTrue(set(S.LP_JS[k]) <= set(S.LP_KEYS))
            for st in ("lp_box", "lp_save", "lp_optin", "lp_privacy", "lp_overview"): self.assertNotIn(st, c["t"], "statische Texte stehen schon im HTML")
            self.assertEqual(c["privacy"], f"{BASE}/datenschutz/#lernpfad-fortschritt" if lang == "de" else f"{BASE}/privacy/#learning-progress")
            if toc: self.assertIn(toc, c["toc"])
            self.assertTrue(all(f'id="{t}"' in h for t in c["toc"]))
            self.assertIn(f'<a href="{c["privacy"]}" rel="nofollow">', art)
            self.assertIn(' data-nosnippet>', art[art.index('class="pl-lpx"'):art.index('class="lpx-h"')])
            self.assertNotIn("aria-live", art[art.index('class="pl-lpx"'):], "aria-live setzt das Skript erst nach dem ersten Bild")
            self.assertNotIn(' lang="en"', art[art.index('class="pl-lpx"'):art.index('class="lpx-h"')], "en/de: Kasten in der Seitensprache")

    def test_path_page(self):
        h = self.on["de/learn/path/manufacturing-excellence/index.html"]
        self.assertIn('<div class="pl-lpx" id="lpx" data-lpx="manufacturing-excellence" data-k="p" data-nosnippet>', h)
        self.assertLess(h.index('class="pl-meta"'), h.index('class="pl-lpx"')); self.assertLess(h.index('class="pl-lpx"'), h.index('class="pl-card"'))
        c = self.cfg(h)
        self.assertEqual(c["k"], "p"); self.assertNotIn("id", c)
        pids = re.findall(r'<div class="pl-card" data-pid="([^"]+)">', h)
        self.assertEqual([x[0] for x in c["g"]], pids); self.assertEqual(len(pids), len(S.order()))
        self.assertEqual(sorted(set(x[0] for x in c["c"])), sorted(set(re.findall(r'data-cid="([^"]+)"', h))))
        self.assertTrue(all(x[2].startswith(BASE + "/") for x in c["g"] + c["c"]))
        box = h[h.index('class="pl-box pl-quiz"'):]
        self.assertIn('<p class="pl-qopen"></p>', box[:box.index("</section>")])
        self.assertTrue(all(len(x) == 4 and x[3] in ("de", "en") for x in c["g"] + c["c"]), "Sprache der Karte (Anker nur bei gleicher Sprache)")
        self.assertEqual(set(c["t"]), set(S.LP_JS["p"]))

    def test_toc_without_links(self):
        """Inhaltsverzeichnis als Liste ohne Links (manufacturing-kpis) wird erkannt; eine gewoehnliche Liste unter einer Ueberschrift nicht."""
        for rel, toc in (("learn/manufacturing-kpis/index.html", "table-of-contents"),):
            self.assertIn(toc, self.cfg(self.on[rel])["toc"], rel)
        de = [r for r in self.on if r.startswith("de/learn/") and "kennzahlen" in r and r.count("/") == 3]
        self.assertTrue(de, "deutsche Fassung von manufacturing-kpis")
        self.assertIn("inhaltsverzeichnis", self.cfg(self.on[de[0]])["toc"], de[0])
        body = '<h2 id="a">Inhalt</h2><ol><li>Eins</li><li>Zwei</li><li>Drei</li></ol><h2 id="eins">Eins</h2><h2 id="zwei">Zwei</h2><h3 id="drei">Drei</h3>'
        self.assertEqual(S.toc_ids(body), ["a"])
        self.assertEqual(S.toc_ids('<h2 id="b">Vorteile</h2><ul><li>Schneller</li><li>Billiger</li><li>Besser</li></ul><h2 id="c">Fazit</h2>'), [], "Inhaltsliste ist kein Verzeichnis")
        self.assertEqual(S.toc_ids('<h2 id="d">Kurz</h2><ul><li>Eins</li></ul><h2 id="e">Eins</h2>'), [], "unter 3 Punkten nie")
        cites = '<h3 id="f">Fuenf Regeln</h3><ol>' + "".join(f'<li><strong>Regel {i}.</strong> Ein ganzer Satz mit Beleg <a class="pl-cite" href="#src-{i}">[{i}]</a>.</li>' for i in range(1, 6)) + '</ol>'
        self.assertEqual(S.toc_ids(cites + '<h2 id="sources">Quellen</h2>'), [], "Liste mit Quellenverweisen (#src-n) ist kein Verzeichnis")
        part = '<h2 id="toc">Inhalt</h2><p><strong>Teil A</strong></p><ol>' + "".join(f'<li><a href="#k{i}">Kapitel {i}</a></li>' for i in range(4)) + "</ol>" + "".join(f'<h2 id="k{i}">{i + 1}. Kapitel {i}</h2>' for i in range(4))
        self.assertEqual(S.toc_ids(part), ["toc"], "Zwischenzeile wie bei ifakt-polaris")
        fuzzy = '<h2 id="z">Inhalt</h2><ol><li>Zeitkennzahlen: Taktzeit, Zykluszeit</li><li>Qualitaet und Ausschuss</li><li>Wartung</li></ol><h2 id="a1">1. Zeitkennzahlen: Taktzeit und Zykluszeit</h2><h2 id="a2">2. Qualitaet, Ausschuss</h2><h2 id="a3">3. Wartung</h2>'
        self.assertEqual(S.toc_ids(fuzzy), ["z"], "Uebersetzung: Verzeichnis und Ueberschrift leicht verschieden, Nummern zaehlen nicht")

    def test_lang_en_and_hero_order(self):
        """Uebersetzte Sprachen ohne lp_*-Uebersetzung: Kasten und Endzeile mit lang="en"; Leitfaden: Kasten nach dem Kopfbild (LCP-Bild bleibt oben)."""
        with mock.patch.object(S, "overlay", lambda: {"ui": {}}):
            self.assertIn(' lang="en"', S.lp_box("fr", BASE, "g")); self.assertIn(' lang="en"', S.lp_done("fr", BASE))
            self.assertNotIn(' lang="en"', S.lp_box("de", BASE, "g")); self.assertNotIn(' lang="en"', S.lp_box("en", BASE, "g"))
        with mock.patch.object(S, "overlay", lambda: {"ui": {"fr": {"lp_box": "Votre progression"}}}):
            self.assertNotIn(' lang="en"', S.lp_box("fr", BASE, "g"))
        src = Path(S.__file__).read_text(encoding="utf-8")
        self.assertIn('{IG.hero_figure("pillar", p["id"], lang) if _ig else ""}{lbox}{body}{lend}</article>', src)

    def test_texts_en_de(self):
        for k in S.LP_KEYS:
            en, de = S.UI[k]
            self.assertTrue(en and de, k)
            self.assertEqual(re.findall(r"\{\w+\}", en), re.findall(r"\{\w+\}", de), k)
            self.assertNotRegex(de, r"\b(du|dein|deine|deinem|dich|dir)\b", "Seite siezt (wie der Abschlusstest)")
        self.assertEqual(S.tx("fr", "lp_save"), S.UI["lp_save"][0], "uebersetzte Sprachen: Englisch, bis der Uebersetzer laeuft")
        self.assertIn("{a}", S.UI["lp_off_q"][0])


if __name__ == "__main__":
    unittest.main()
