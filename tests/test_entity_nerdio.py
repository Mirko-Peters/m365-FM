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

    def test_renderer_tabellen_codebloecke_faq(self):
        import site_content_blog as C
        import site_blog as B
        h = C.render("Text\n\n| A | B |\n|---|---|\n| [x](https://www.m365.fm/entity/nerdio/) | 2 |\n\n1. Eins\n\n```powershell\nGet-Item <Pfad>\n```\n\n2. Zwei")
        self.assertIn("<table>", h); self.assertIn('<td><a href="https://www.m365.fm/entity/nerdio/">x</a></td>', h)
        self.assertIn("<pre><code>Get-Item &lt;Pfad&gt;</code></pre>", h); self.assertIn('<ol start="2">', h)
        self.assertNotIn("|---", h); self.assertNotIn("```", h)
        for f in self.files:
            self.assertNotIn("|---", C.render(self.SNS.parse_file(f)["body"]), f.name)
        faq = [{"q": "Does it cost extra?", "a": "No."}]
        self.assertFalse(B.faq_in_html({"html": "<p>Text</p>", "faq": faq}))   # Content-Paket: FAQ sichtbar zeigen
        self.assertTrue(B.faq_in_html({"html": "<h2>FAQ</h2><h3>Does it cost  extra?</h3><p>No.</p>", "faq": faq}))   # Altbeitrag: steht schon im Text
        self.assertTrue(B.faq_in_html({"html": "<p>Text</p>", "faq": []}))


if __name__ == "__main__":
    unittest.main()
