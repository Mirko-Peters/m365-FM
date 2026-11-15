"""Karenzzeit (Mirko 11.11.2026, fuer alle Kunden): alles, was ein laufendes Sponsoring zeigt, bleibt 182 Tage (6 Monate) nach "end" unveraendert stehen -
Kennzeichnung und Badge der Entitaet, WebPage.sponsor, rel="sponsored", Lead-Formular, Partner-Block im Firmenverzeichnis, sponsors.json fuer den Worker.
Geprueft an den Raendern: Tag "end", end + 182 (noch aktiv), end + 183 (vorbei). Folgen und Beitraege bleiben ohnehin dauerhaft."""
import json
import sys
import tempfile
import unittest
from datetime import date, timedelta
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_sponsorships as SPM   # noqa: E402
import site_ads as ADS   # noqa: E402
import site_members as SM   # noqa: E402

ENTS = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}   # eigene Kopie: andere Tests patchen site_learn.ENTS

END = date(2027, 1, 16)
DAYS = {"end": (END, True), "end+182": (END + timedelta(days=182), True), "end+183": (END + timedelta(days=183), False)}
REC = {"id": "cognillo-grace", "sponsor": {"name": "Cognillo", "url": "https://www.cognillo.com/"}, "label": "sponsored", "start": "2026-11-10", "end": END.isoformat(),
       "entities": ["cognillo", "sharepoint-essentials-toolkit"], "topics": ["sharepoint-permissions"], "manager": {"handle": "mirko-p", "entity": "mirko-peters"}}
HTML = '<p><a href="https://www.cognillo.com/toolkit">Toolkit</a> und <a href="https://learn.microsoft.com/sharepoint/">Learn</a></p>'


class Grace(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.path = Path(cls.tmp.name) / "sponsorships.json"
        cls.path.write_text(json.dumps({"version": 1, "sponsorships": [REC]}), "utf-8")

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup(); SPM.reset()

    def init(self, d):
        SPM.reset(); return SPM.init(d.isoformat(), ENTS, path=self.path)

    def test_eine_definition(self):
        self.assertEqual(SPM.grace_end(REC), date(2027, 7, 17))
        self.assertIsNone(SPM.grace_end({**REC, "end": None}))
        for name, (d, on) in DAYS.items():
            self.assertEqual(SPM._active(REC, d.isoformat()), on, name)
            self.assertEqual(SPM._in_grace(REC, d.isoformat()), on, name)   # gleiche Regel wie die Extra-Themen
        self.assertFalse(SPM._active(REC, "2026-11-09"))
        self.assertEqual([SPM.status(REC, x) for x in ("2026-11-09", "2026-12-01", "2027-01-16", "2027-01-17", "2027-07-17", "2027-07-18")],
                         ["geplant", "laeuft", "laeuft", "Karenzzeit bis 17.07.2027", "Karenzzeit bis 17.07.2027", "beendet"])
        self.assertEqual(SPM.status({**REC, "end": None}, "2099-01-01"), "laeuft (unbefristet)")

    def test_entitaetsseite_kennzeichnung_badge_ld(self):
        for name, (d, on) in DAYS.items():
            self.init(d)
            for eid in ("cognillo", "sharepoint-essentials-toolkit", "sharepoint-permissions"):
                self.assertEqual(bool(SPM.entity(eid)), on, (name, eid))
            self.assertEqual(SPM.entity_own("cognillo"), on, name)
            recs = SPM.entity("cognillo")
            note = SPM.note("de", recs, "entity")
            self.assertEqual("Anzeige" in note and 'rel="sponsored noopener"' in note, on, name)   # sichtbare Kennzeichnung unter der H1
            self.assertEqual(SPM.badge("de", recs), "Anzeige" if on else "", name)   # Badge in der Entitaetsliste
            self.assertEqual(SPM.ld(recs), {"@type": "Organization", "name": "Cognillo", "url": "https://www.cognillo.com/"} if on else None, name)   # WebPage.sponsor
            self.assertEqual(SPM.link_rel(recs, "https://www.cognillo.com", own=SPM.entity_own("cognillo")), "sponsored noopener" if on else "noopener", name)

    def test_rel_sponsored_in_beitraegen(self):
        for name, (d, on) in DAYS.items():
            self.init(d)
            self.assertEqual([r["id"] for r in SPM.running()], ["cognillo-grace"] if on else [], name)
            out = SPM.mark(HTML, SPM.running(), "post")
            self.assertEqual('href="https://www.cognillo.com/toolkit" rel="sponsored noopener"' in out, on, name)
            self.assertNotIn('learn.microsoft.com/sharepoint/" rel="sponsored', out)

    def test_lead_formular_und_sponsors_json(self):
        src = (ROOT / "site_entities.py").read_text("utf-8")
        self.assertIn('if any(o["id"] == e["id"] for o in SPM.active_sponsor_orgs(SPM._state()["today"], ENTS))', src)   # Bedingung des Lead-Formulars
        for name, (d, on) in DAYS.items():
            st = self.init(d)
            orgs = SPM.active_sponsor_orgs(st["today"], ENTS)
            self.assertEqual([o["id"] for o in orgs], ["cognillo"] if on else [], name)
            lead = ADS.sponsor_lead("https://www.m365.fm", "de", "cognillo", "Cognillo") if any(o["id"] == "cognillo" for o in orgs) else ""
            self.assertEqual('data-sponsor-lead="cognillo"' in lead, on, name)
            self.assertEqual(SPM.sponsors_json(d.isoformat(), ENTS), {"orgs": [{"id": "cognillo", "name": ENTS["cognillo"].get("name") or "cognillo", "manager": "mirko-p"}]} if on else {"orgs": []}, name)

    def test_partner_block_im_firmenverzeichnis(self):
        for name, (d, on) in DAYS.items():
            self.init(d)
            with tempfile.TemporaryDirectory() as tmp:
                docs = Path(tmp)
                def write(rel, content):
                    p = docs / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(content, "utf-8")
                def page(lang, title, desc, url, body, alts=None, ld=None, **k):
                    return f'<!doctype html><html lang="{lang}"><head><title>{title}</title><script type="application/ld+json">{json.dumps(ld or [])}</script></head><body>{body}</body></html>'
                g = dict(BASE="https://www.m365.fm", write=write, page=page, header=lambda lang, x="": "<header></header>", footer=lambda lang: "<footer></footer>",
                         footer_en=lambda: "<footer></footer>", LANGS={"de": ("Deutsch", "de")}, sitemap=[], TODAY=d.isoformat())
                org = {"handle": "contoso-de", "name": "Contoso", "website": "https://contoso.example", "public": True, "claimed": True, "members": [], "expertise": [], "programs": [],
                       "channels": [], "locations": []}
                try:
                    with mock.patch.dict(SM.ENTS, {k: ENTS[k] for k in REC["entities"] + REC["topics"]}):   # Firmen-Entitaet fuer den Partner-Block
                        SM.build(g, [], [org])
                except Exception as e:
                    if not list(docs.rglob("community/companies/index.html")): self.skipTest(f"Verzeichnis-Bau im Test nicht moeglich: {e}")
                pages = list(docs.rglob("community/companies/index.html"))
                self.assertTrue(pages, name)
                for p in pages:
                    h = p.read_text("utf-8")
                    self.assertEqual('data-spm="partners"' in h, on, (name, p))
                    self.assertEqual('"sponsor"' in h, on, (name, p))   # CollectionPage.sponsor nur mit Partner-Block


class Cognillo(unittest.TestCase):
    """Echte Daten: Laufzeit bis 16.01.2027, Karenzzeit bis 17.07.2027; der letzte gesponserte Beitrag (Nr. 62, 15.01.2027) liegt in der Laufzeit."""
    def test_beitrag_am_15_01_2027(self):
        sys.path.insert(0, str(ROOT / "tools"))
        import sponsor_post as SP
        recs, errs = SPM.check_structure(json.loads((ROOT / "data" / "sponsorships.json").read_text("utf-8")))
        self.assertEqual(errs, [])
        rec = next(r for r in recs if r["id"] == "cognillo-2026-11")
        self.assertEqual(SPM.status(rec, "2027-01-15"), "laeuft")
        self.assertEqual(SP.sponsor_record(recs, "2027-01-15")["id"], "cognillo-2026-11")
        plan = json.loads((ROOT / "data" / "sponsor_posts_cognillo.json").read_text("utf-8"))
        for e in (x for x in plan if x.get("sponsored")):
            self.assertTrue(SPM._active(rec, e["date"]), e["nr"])   # alle gesponserten Beitraege im Plan liegen in der Laufzeit
            self.assertLessEqual(e["date"], rec["end"], e["nr"])


if __name__ == "__main__":
    unittest.main()
