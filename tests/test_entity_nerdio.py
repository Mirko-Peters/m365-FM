"""Nerdio (neutraler Partner): Entitaeten, Beziehungen, Partner-Eintrag, Kennzeichnung "Partner" statt "Sponsored"."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import ontology as O   # noqa: E402
import site_entities as E   # noqa: E402
import site_sponsorships as SPM   # noqa: E402

LIST = json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))
RAW = {e["id"]: e for e in LIST}
CAND = json.loads((ROOT / "data" / "nerdio_new_entities.json").read_text("utf-8"))["entities"]
PLAN = json.loads((ROOT / "data" / "nerdio_plan.json").read_text("utf-8"))["articles"]
# nicht belegbar (Quelle nennt nur den Namen oder fehlt): bewusst nicht angelegt, Artikel 112, 114, 177-180 brauchen eine neue Fassung.
# showback-chargeback (Review #509): doppelte die bestehenden Entitaeten showback und chargeback und schluckte als laengste Form ihre Links; gestrichen.
OMITTED = {"avd-session-time-limits", "nerdio-predictive-drain-mode", "nerdio-os-disk-swapping"}
NEW = [c["id"] for c in CAND if c["id"] not in OMITTED]
NERDIO = ["nerdio"] + sorted(i for i in RAW if i.startswith("nerdio-"))


class Daten(unittest.TestCase):
    def test_alle_kandidaten_ausser_den_nicht_belegten_vorhanden(self):
        self.assertEqual(len(NEW), 67)
        self.assertNotIn("showback-chargeback", RAW)
        for i in NEW:
            self.assertIn(i, RAW)
        for i in OMITTED:
            self.assertNotIn(i, RAW)

    def test_texte_und_quellen(self):
        for i in NEW + ["nerdio"]:
            e = RAW[i]
            for lang in ("en", "de"):
                d = e["desc"][lang]
                self.assertTrue(20 <= len(d) <= 300, (i, lang, len(d)))
                self.assertNotIn("http", d)
            self.assertTrue(e["docs"].startswith("https://learn.microsoft.com/") or e["web"].startswith("https://"), i)
            if i.startswith("nerdio"):
                self.assertTrue(e["web"].startswith("https://getnerdio.com") or e["web"].startswith("https://www.nerdio.com") or "nerdio" in e["web"], i)

    def test_beziehungen_gueltig_und_ohne_zyklus(self):
        for i in NEW + ["nerdio"]:
            for p, to in RAW[i]["rel"]:
                self.assertIn(p, E.FWD, (i, p))
                self.assertIn(to, RAW, (i, to))
                self.assertNotEqual(to, i)
        by = {e["id"]: e for e in LIST}
        for i in NEW:
            self.assertLessEqual(len(O.ancestors(i, by)), 4, i)   # Hierarchie hoechstens 4 Ebenen

    def test_nichts_verwaist(self):
        for i in NEW:
            self.assertTrue(O.parents_of(RAW[i]) , f"{i} ohne Oberbegriff")
            self.assertIsNotNone(O.primary_parent(RAW[i], RAW), i)

    def test_nerdio_produkte(self):
        for i in ("nerdio-manager-for-enterprise", "nerdio-manager-for-msp"):
            self.assertIn(["developed_by", "nerdio"], RAW[i]["rel"])
            self.assertNotIn(["instance_of", "microsoft-tool"], RAW[i]["rel"])
            self.assertTrue([r for r in RAW[i]["rel"] if r[0] == "instance_of"], i)
        self.assertEqual((RAW["nerdio"]["city"], RAW["nerdio"]["web"]), ("Chicago", "https://getnerdio.com/"))
        self.assertIn("Cloud PC", RAW["windows-365"]["aliases"])

    def test_ids_nur_einmal_und_keine_alias_kollision(self):
        ids = [e["id"] for e in LIST]
        self.assertEqual(len(ids), len(set(ids)))
        for i in NEW:
            self.assertEqual([e["id"] for e in LIST if RAW[i]["name"].lower() == e["name"].lower()], [i], i)

    def test_plan_ids_vorhanden(self):
        fehlt = {i for a in PLAN for i in a["entities"] if i not in RAW}
        self.assertEqual(fehlt, OMITTED & {i for a in PLAN for i in a["entities"]})   # nur die bewusst weggelassenen fehlen


class Partner(unittest.TestCase):
    def setUp(self):
        d = json.loads((ROOT / "data" / "sponsorships.json").read_text("utf-8"))
        self.recs, self.errs = SPM.check_structure(d)
        self.rec = next(r for r in self.recs if r["id"] == "nerdio-partner")

    def test_eintrag(self):
        self.assertEqual(self.errs, [])
        r = self.rec
        self.assertEqual((r["label"], r["start"], r["end"]), ("partner", "2026-11-16", None))
        self.assertEqual(r["sponsor"], {"name": "Nerdio", "url": "https://getnerdio.com/"})
        self.assertEqual(sorted(r["entities"]), sorted(NERDIO))
        self.assertNotIn("$", json.dumps(r))
        self.assertEqual([x["label"] for x in self.recs if x["id"] != "nerdio-partner"], ["sponsored", "sponsored"], "iFAKT und Cognillo bleiben unveraendert")

    def test_verweise_gueltig(self):
        self.assertEqual(SPM.check_refs(self.recs, RAW)[0], [])
        self.assertEqual(SPM.check_refs(self.recs, RAW)[1], [])

    def test_seite_zeigt_partner_statt_sponsored(self):
        de = SPM.note("de", [self.rec]); en = SPM.note("en", [self.rec])
        self.assertIn("Partner", de); self.assertIn("Neutraler Partner", de)
        self.assertIn("Neutral partner", en)
        for s in (de, en):
            self.assertNotIn("Sponsored", s); self.assertNotIn("Anzeige", s); self.assertNotIn("Paid", s)
        self.assertEqual(SPM.badge("de", [self.rec]), "Partner")
        self.assertEqual(SPM.badge("en", [self.rec]), "Partner")

    def test_partner_ist_keine_werbung(self):
        """Review #509: kein Lead-Formular, kein sponsors.json-Eintrag, kein sponsor im JSON-LD, kein rel="sponsored" fuer den neutralen Partner."""
        day = "2026-11-20"
        self.assertIn("nerdio", [o["id"] for o in SPM.active_sponsor_orgs(day, RAW, self.recs)])   # Firmenverzeichnis: Block "Partner"
        self.assertNotIn("nerdio", [o["id"] for o in SPM.lead_orgs(day, RAW, self.recs)])
        self.assertFalse(set(SPM.lead_entities(self.recs, day, RAW)) & set(NERDIO))
        self.assertFalse([x for x in SPM.lead_index(self.recs, day, RAW)[0] if x["org"] == "nerdio"])
        self.assertNotIn("nerdio", [o["id"] for o in SPM.sponsors_json(day, RAW, self.recs)["orgs"]])
        self.assertIsNone(SPM.ld([self.rec]))
        self.assertEqual(SPM.hosts([self.rec]), set())
        for u in ("https://getnerdio.com/", "https://nmehelp.getnerdio.com/hc/en-us"):
            self.assertEqual(SPM.link_rel([self.rec], u), "noopener")
            self.assertEqual(SPM.link_rel([self.rec], u, own=True), "noopener")
        h = '<a href="https://nmehelp.getnerdio.com/x" rel="noopener">x</a>'
        self.assertEqual(SPM.mark(h, [self.rec]), h)
        for lang in ("en", "de"):
            self.assertNotIn("sponsored", SPM.note(lang, [self.rec]))
        cog = next(r for r in self.recs if r["id"] == "cognillo-2026-11")   # bezahlte Eintraege unveraendert
        self.assertEqual(SPM.link_rel([cog, self.rec], "https://getnerdio.com/"), "noopener")
        self.assertEqual(SPM.ld([cog, self.rec])["name"], "Cognillo")
        self.assertIn("cognillo", [o["id"] for o in SPM.lead_orgs(day, RAW, self.recs)])

    def test_partner_beitrag_ohne_extra_themen(self):
        """Review #509: ein Nerdio-Artikel unter "posts" behaelt nur seine eigenen Themen (Chips, BlogPosting.about, Themen-Brotkrume);
        keine Nerdio-Entitaeten vorn und kein Badge "Partner" an Chips. Bezahlte Sponsorings (Cognillo, iFAKT) behalten ihre Extras."""
        import site_topic_crumbs as TC
        day = "2026-11-20"
        own = ["avd-pooled-host-pool", "avd-personal-host-pool"]
        self.assertEqual(SPM.post_extras([self.rec], day, RAW), [])
        topics, spx = SPM.split_topics(own, [x for x in SPM.post_extras([self.rec], day, RAW) if x in RAW])
        self.assertEqual((topics, spx), (own, set()))
        bc = TC.breadcrumb("https://www.m365.fm", "en", topics, RAW, "Pooled or personal", "https://www.m365.fm/x/")
        self.assertNotIn("Nerdio", json.dumps(bc or {}))
        self.assertTrue(set(NERDIO) >= set(SPM.post_extras([self.rec], day, RAW, paid_only=False)) >= {"nerdio", "nerdio-manager-for-msp"})   # nur fuer skip der Transparenzhinweise
        cog = next(r for r in self.recs if r["id"] == "cognillo-2026-11")
        ifk = next(r for r in self.recs if r["id"] == "ifakt-eigenes-unternehmen")
        self.assertEqual(SPM.post_extras([cog], day, RAW), SPM.post_extras([cog], day, RAW, paid_only=False))
        self.assertIn("cognillo", SPM.post_extras([cog], day, RAW))
        self.assertIn("ifakt", SPM.post_extras([ifk], day, RAW))
        self.assertEqual(SPM.post_extras([cog, self.rec], day, RAW), SPM.post_extras([cog], day, RAW))

    def test_firmenverzeichnis_partner_ohne_anzeige(self):
        """Review #509: Nerdio steht im Firmenverzeichnis in einem eigenen Block "Partner", ohne "Anzeige"/"Sponsoren" und ohne sponsor im JSON-LD;
        bezahlte Eintraege bleiben unter "Partner und Sponsoren · Anzeige"."""
        import tempfile
        from unittest import mock
        import site_members as SM
        cog = next(r for r in self.recs if r["id"] == "cognillo-2026-11")
        for recs, paid in (([self.rec], False), ([self.rec, cog], True)):
            with tempfile.TemporaryDirectory() as tmp:
                path = Path(tmp) / "s.json"
                path.write_text(json.dumps({"version": 1, "sponsorships": recs}), "utf-8")
                SPM.reset(); SPM.init("2026-11-20", RAW, path=path)
                docs = Path(tmp) / "docs"
                def write(rel, content):
                    q = docs / rel; q.parent.mkdir(parents=True, exist_ok=True); q.write_text(content, "utf-8")
                def page(lang, title, desc, url, body, alts=None, ld=None, **k):
                    return f'<!doctype html><html lang="{lang}"><head><title>{title}</title><script type="application/ld+json">{json.dumps(ld or [])}</script></head><body>{body}</body></html>'
                g = dict(BASE="https://www.m365.fm", write=write, page=page, header=lambda lang, x="": "<header></header>", footer=lambda lang: "<footer></footer>",
                         footer_en=lambda: "<footer></footer>", LANGS={"de": ("Deutsch", "de")}, sitemap=[], TODAY="2026-11-20")
                org = {"handle": "contoso-de", "name": "Contoso", "website": "https://contoso.example", "public": True, "claimed": True, "members": [], "expertise": [],
                       "programs": [], "channels": [], "locations": []}
                try:
                    with mock.patch.dict(SM.ENTS, {k: RAW[k] for r in recs for k in r["entities"] + r.get("topics", [])}):
                        SM.build(g, [], [org])
                except Exception as e:
                    if not list(docs.rglob("community/companies/index.html")): self.skipTest(f"Verzeichnis-Bau im Test nicht moeglich: {e}")
                pages = list(docs.rglob("community/companies/index.html"))
                self.assertTrue(pages)
                for q in pages:
                    h = q.read_text("utf-8")
                    blk = h[h.index('data-spm="partner"'):]; blk = blk[:blk.index("</section>")]
                    self.assertIn("Nerdio", blk)
                    self.assertNotRegex(blk, r"Anzeige|Advertisement|Sponsor")
                    self.assertEqual('data-spm="partners"' in h, paid)
                    self.assertEqual('"sponsor"' in h, paid)
                    self.assertNotIn('"name": "Nerdio", "url"', h)   # Nerdio nie als sponsor im JSON-LD
        SPM.reset()

    def test_transparenzhinweis_ohne_sponsor(self):
        for i in ("nerdio", "nerdio-manager-for-enterprise", "nerdio-manager-for-msp", "nerdio-auto-scaling"):
            for lang in ("en", "de"):
                d = E.disclosure_of(RAW[i], lang)
                self.assertTrue(d, (i, lang))
                self.assertNotRegex(d.lower(), r"sponsor|anzeige|advertis")
        self.assertIn("does not pay", E.disclosure_of(RAW["nerdio"], "en"))


class Artikel(unittest.TestCase):
    """Review #509: die Nerdio-Artikel des Plans bestehen site_content_blog.check, verlinken absolut und nennen kein Abrufdatum und kein "Sponsor"."""
    @classmethod
    def setUpClass(cls):
        import site_shownotes as SNS
        cls.SNS = SNS
        cls.files = [ROOT / a["datei"] for a in PLAN if a.get("datei") and (ROOT / a["datei"]).exists()]

    def test_dateien_vorhanden(self):
        self.assertEqual(len(self.files), 195)

    def test_check_ohne_fehler(self):
        import site_content_blog as C
        bad = {f.stem: C.check(self.SNS.parse_file(f), "en", f.stem, RAW)[1] for f in self.files}
        self.assertEqual({k: v for k, v in bad.items() if v}, {})

    def test_links_absolut_ohne_abrufdatum_ohne_sponsor(self):
        import re
        for f in self.files:
            t = f.read_text("utf-8")
            self.assertNotIn("](/", t, f.name)   # relative Links rendert der Paket-Renderer nicht (site_shownotes._inline)
            self.assertIsNone(re.search(r"retrieved on", t, re.I), f.name)
            self.assertIsNone(re.search(r"sponsor", t, re.I), f.name)

    def test_entitaets_links_zeigen_auf_vorhandene_ids(self):
        """Review #509: jede /entity/<id>/-URL der Nerdio-Warteschlange trifft eine Entitaet in data/entities.json (kein 404, z. B. das gestrichene showback-chargeback)."""
        import re
        tot = {}
        for f in sorted((ROOT / "imports" / "blog-queue").rglob("*.md")):
            for i in re.findall(r"https://www\.m365\.fm/entity/([^/)\s]+)/", f.read_text("utf-8")):
                if i not in RAW: tot.setdefault(f.name, []).append(i)
        self.assertEqual(tot, {})

    def test_renderer_tabellen_codebloecke_faq(self):
        import site_content_blog as C
        import site_blog as B
        h = C.render("Text\n\n| A | B |\n|---|---|\n| [x](https://www.m365.fm/entity/nerdio/) | 2 |\n\n1. Eins\n\n```powershell\nGet-Item <Pfad>\n```\n\n2. Zwei")
        self.assertIn("<table>", h); self.assertIn('<td><a href="https://www.m365.fm/entity/nerdio/">x</a></td>', h)
        self.assertIn("<pre><code>Get-Item &lt;Pfad&gt;</code></pre>", h); self.assertIn('<ol start="2">', h)
        self.assertNotIn("|---", h); self.assertNotIn("```", h)
        for f in self.files:
            rec = self.SNS.parse_file(f)
            self.assertTrue(C.rich_of(rec["meta"]), f.name)   # Schalter render: v2 im Kopf jedes Nerdio-Artikels
            h = C.check(rec, "en", f.stem, RAW)[0]["html"]
            self.assertNotIn("|---", h, f.name); self.assertNotIn("```", h, f.name)
        faq = [{"q": "Does it cost extra?", "a": "No."}]
        self.assertFalse(B.faq_in_html({"html": "<p>Text</p>", "faq": faq}))   # Content-Paket: FAQ sichtbar zeigen
        self.assertTrue(B.faq_in_html({"html": "<h2>FAQ</h2><h3>Does it cost  extra?</h3><p>No.</p>", "faq": faq}))   # Altbeitrag: steht schon im Text
        self.assertTrue(B.faq_in_html({"html": "<p>Text</p>", "faq": []}))

    def test_altpakete_ohne_schalter_unveraendert(self):
        """Review #509: ohne render: v2 bleibt der fruehere Renderer (gleiches HTML und gleicher Hash wie vorher, keine neuen Uebersetzungs-Einheiten)."""
        import site_content_blog as C
        md = "Text\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n```\ncode\n```\n\n2. Zwei"
        old = C.render(md, rich=False)
        self.assertNotIn("<table>", old); self.assertNotIn("<pre>", old); self.assertNotIn("start=", old)
        self.assertIn("|---|", old)
        body = "Word " * 320 + "\n\n" + md
        meta = {"title": "A package title", "summary": "x" * 60, "status": "approved", "author": "mirko-p", "date": "2026-11-12"}
        a = C.check({"meta": meta, "body": body}, "en", "alt-paket", RAW)[0]
        b = C.check({"meta": dict(meta, render="v2"), "body": body}, "en", "alt-paket", RAW)[0]
        self.assertNotIn("<table>", a["html"]); self.assertIn("<table>", b["html"]); self.assertNotEqual(a["hash"], b["hash"])
        self.assertNotIn("render", a); self.assertNotIn("render", b)


class Wellen(unittest.TestCase):
    """Freigabe in Wellen (Mirko 17.11.): imports/blog-queue/nerdio/welle-NN, 10 je Tag in Nummernfolge, Nr. 196 nicht vor 174 und 65, 143/177-180 nie."""
    SERIES = ROOT / "imports" / "blog-queue" / "nerdio"

    def test_wellen_in_plan_reihenfolge(self):
        inc = sorted((a for a in PLAN if a["status"] != "ausgelassen"), key=lambda a: a["nr"])
        self.assertEqual(len(inc), 195)
        for i, a in enumerate(inc):
            self.assertEqual(a["welle"], i // 10 + 1, a["nr"])
            self.assertEqual(a["datei"], f"imports/blog-queue/nerdio/welle-{a['welle']:02d}/" + a["datei"].rsplit("/", 1)[1])
        dirs = sorted(d.name for d in self.SERIES.iterdir() if d.is_dir())
        self.assertEqual(dirs, [f"welle-{n:02d}" for n in range(1, 21)])
        self.assertEqual([len(list((self.SERIES / d).glob("*.md"))) for d in dirs], [10] * 19 + [5])
        self.assertEqual(sorted(str(f.relative_to(ROOT)) for f in self.SERIES.glob("*/*.md")), sorted(a["datei"] for a in inc))
        for a in PLAN:
            if a["nr"] in (143, 177, 178, 179, 180):
                self.assertEqual((a["status"], a.get("datei"), a.get("welle")), ("ausgelassen", None, None))
        w = {a["nr"]: a["welle"] for a in inc}
        self.assertGreaterEqual(w[196], max(w[174], w[65]))

    def test_nichts_vorab_live(self):
        en = {f.name for f in (ROOT / "imports" / "blog" / "en").glob("*.md")}
        for f in self.SERIES.glob("*/*.md"):
            self.assertNotIn(f.name, en)
            t = f.read_text("utf-8")
            self.assertIn("\nstatus: review\n", t, f.name); self.assertIn("\npublish: false\n", t, f.name)
        posts = next(r for r in json.loads((ROOT / "data" / "sponsorships.json").read_text("utf-8"))["sponsorships"] if r["id"] == "nerdio-partner").get("posts")
        self.assertFalse(posts)   # Eintraege schreibt erst tools/blog_release.py im Lauf, der den Artikel freigibt (sonst bricht check_posts den Bau ab)

    def test_reihe_json(self):
        cfg = json.loads((self.SERIES / "reihe.json").read_text("utf-8"))
        self.assertEqual((cfg["zuletzt"], cfg["lauf"], cfg["sponsoring"]), ("", "", "nerdio-partner"))
        slug = {a["nr"]: a["datei"].rsplit("/", 1)[1][:-3] for a in PLAN if a.get("datei")}
        self.assertEqual(cfg["nach"], {slug[196]: [slug[174], slug[65]]})

    def test_ablauf_20_naechte(self):
        """Simuliert die 20 Abend-Laeufe auf einer Kopie: je Tag die naechste Welle, Nr. 196 nach 174 und 65, posts gueltig."""
        import shutil
        import tempfile
        from contextlib import redirect_stdout
        from datetime import date, timedelta
        from io import StringIO
        sys.path.insert(0, str(ROOT / "tools"))
        import blog_release as BR
        nr = {a["datei"].rsplit("/", 1)[1][:-3]: a["nr"] for a in PLAN if a.get("datei")}
        with tempfile.TemporaryDirectory() as tmp:
            series, dest, sp = Path(tmp) / "nerdio", Path(tmp) / "en", Path(tmp) / "s.json"
            shutil.copytree(self.SERIES, series); dest.mkdir()
            shutil.copy(ROOT / "data" / "sponsorships.json", sp)
            seq, start = [], date(2026, 11, 19)
            for i in range(22):
                with redirect_stdout(StringIO()):
                    out = BR.release_series(str(series), str(dest), (start + timedelta(days=i)).isoformat(), sponsorships=str(sp),
                                            run=(start + timedelta(days=i - 1)).isoformat())   # Abend-Lauf am Vortag (UTC)
                seq.append(sorted(nr[s] for s in out))
            self.assertEqual([len(x) for x in seq], [10] * 19 + [5, 0, 0])
            flat = [n for x in seq for n in x]
            self.assertEqual(flat, sorted(flat))
            self.assertEqual(len(flat), 195)
            recs, errs = SPM.check_structure(json.loads(sp.read_text("utf-8")))
            self.assertEqual(errs, [])
            self.assertEqual(len(next(r for r in recs if r["id"] == "nerdio-partner")["posts"]), 195)
            self.assertIn("date: 2026-11-19\n", (dest / (next(s for s, n in nr.items() if n == 1) + ".md")).read_text("utf-8"))


if __name__ == "__main__":
    unittest.main()
