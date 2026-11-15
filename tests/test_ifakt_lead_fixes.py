"""Nachbesserungen zum iFAKT-Lead-Formular und zur Transparenz (Befunde F1, F2, F3, A1/ART-DISC-1):
Kasten in der Textspalte statt als eigenes Grid-Element, lead_topics aus jedem aktiven Sponsoring der Firma, kein Formular auf Sprach-Uebersichten,
und der iFAKT-Transparenzhinweis auf jedem Blogbeitrag, der iFAKT oder ein Polaris-Modul nennt (alle Sprachen)."""
import json
import re
import sys
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_ads as ADS   # noqa: E402
import site_blog as BLG   # noqa: E402
import site_entities as SENT   # noqa: E402
import site_sponsorships as S   # noqa: E402

ENTS = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}   # eigene Kopie: andere Tests patchen site_learn.ENTS

BASE = "https://www.m365.fm"
LENTS = {"acme": {"type": "org", "name": "Acme"}, "gemba-walk": {"type": "concept", "name": "Gemba walk"}, "sharepoint": {"type": "product", "name": "SharePoint"}}
REC = {"id": "acme-1", "sponsor": {"name": "Acme", "url": "https://acme.example/"}, "label": "sponsored", "start": "2026-11-06", "end": None, "entities": ["acme"],
       "lead_topics": ["gemba-walk"], "manager": {"handle": "mirko-p", "entity": "mirko-peters"}}
TEXT = f'<h1>T</h1><p>Text <a href="{BASE}/entity/gemba-walk/">x</a></p>'
SIDE = '<aside class="sbar" aria-label="Sidebar"><p>Seitenleiste</p></aside>'
SHW = f'<html><body><main class="wrap shw"><div class="shmain">{TEXT}<div class="inner">y</div></div>{SIDE}</main><footer></footer></body></html>'   # Aufbau wie page(side=...)
PLAIN = f'<html><body><main class="wrap">{TEXT}</main><footer></footer></body></html>'


class LeadBox(unittest.TestCase):
    def setUp(self):
        S.reset()
        st = S._index([REC], "2026-11-11", {}, {})
        st["lead"], _ = S.lead_index([REC], "2026-11-11", LENTS)

    def tearDown(self):
        S.reset()

    def test_in_der_textspalte_bei_sidebar(self):
        out = ADS._inject_lead(BASE, SHW, "en", BASE + "/community/u/mirko-p/blog/gemba-walk-guide/")
        i = out.index("data-sponsor-lead=")
        main = out[out.index('<div class="shmain">'):out.index('<aside class="sbar"')]
        self.assertIn("data-sponsor-lead=", main)
        self.assertGreater(i, out.index('<div class="inner">'))   # nach dem Text
        tail = out[out.index("</section>", i):out.index('<aside class="sbar"')]
        self.assertTrue(re.fullmatch(r"</section>(?:<script\b.*?</script>)*</div>", tail, re.S), tail)   # danach nur noch Skripte und das </div> von .shmain
        self.assertEqual(out.count("data-sponsor-lead="), 1)

    def test_ohne_sidebar_vor_main_ende(self):
        out = ADS._inject_lead(BASE, PLAIN, "en", BASE + "/show/episodes/some-episode/")
        self.assertIn("data-sponsor-lead=", out)
        self.assertLess(out.index("data-sponsor-lead="), out.index("</main>"))
        self.assertGreater(out.index("data-sponsor-lead="), out.index("</p>"))

    def test_keine_sprach_uebersichten(self):
        for p in ("/de/entity/", "/de/", "/de/podcast/", "/de/topics/", "/de/glossary/", "/de/datenschutz/", "/de/sponsors/", "/de/learn/gemba/", "/fr/entity/", "/de/tag/lean/"):
            self.assertEqual(ADS._inject_lead(BASE, PLAIN, "de", BASE + p), PLAIN, p)
        for p in ("/entity/", "/", "/show/"):   # Englisch: dort gab es nie ein Formular
            self.assertEqual(ADS._inject_lead(BASE, PLAIN, "en", BASE + p), PLAIN, p)
        for p in ("/de/eine-folge-ueber-gemba-walks/", "/fr/show/episodes/gemba-walk-basics/"):   # Sprachfassungen der Folgen behalten es
            self.assertIn("data-sponsor-lead=", ADS._inject_lead(BASE, SHW, "de", BASE + p), p)


class LeadIndex(unittest.TestCase):
    def test_verlaengerung_in_der_karenzzeit(self):
        old = {**REC, "id": "acme-old", "start": "2026-05-01", "end": "2026-10-31", "lead_topics": []}
        old.pop("lead_topics")
        new = {**REC, "id": "acme-new", "start": "2026-11-01", "end": None}
        recs, errs = S.check_structure({"version": 1, "sponsorships": [old, new]})
        self.assertEqual(errs, [])
        lead, _ = S.lead_index(recs, "2026-11-12", LENTS)
        self.assertEqual([x["org"] for x in lead], ["acme"])
        self.assertIn("gemba-walk", lead[0]["topics"])

    def test_themen_aller_aktiven_vertraege(self):
        a = {**REC, "id": "a", "start": "2026-05-01", "end": "2026-12-31", "lead_topics": ["sharepoint"]}   # beide laufen am Stichtag, auch ohne Karenzregel (#374)
        b = {**REC, "id": "b", "start": "2026-11-01", "lead_topics": ["gemba-walk", "gibt-es-nicht"]}
        lead, unknown = S.lead_index([a, b], "2026-11-12", LENTS)
        self.assertEqual(len(lead), 1)
        self.assertTrue({"sharepoint", "gemba-walk"} <= lead[0]["topics"])
        self.assertEqual(unknown, {"gibt-es-nicht"})


SLUG = "value-stream-sample"


def post(html, lang="en", **extra):
    return {"id": 91, "handle": "mirko-p", "name": "Mirko Peters", "slug": SLUG, "lang": lang, "title": "A sample article about value streams", "summary": "x", "body": "", "html": html,
            "topics": [], "published": 1793836800, "created": 1793836800, "updated": 1793836800, "votes": 3, "coauthors": [], "faq": [], **extra}


def build(posts):
    S.reset(); S._index([], "2026-11-12", {}, {})
    pages = {}

    def page(lang, title, desc, canonical, body, *a, **k):
        pages[canonical] = body
        return body
    g = {"BASE": BASE, "write": lambda *_: None, "write_r2": lambda *_: None, "page": page, "header": lambda lang, s: "", "footer": lambda lang: "", "footer_en": lambda: "",
         "LANGS": {}, "sitemap": [], "TODAY": "2026-11-12"}
    BLG.build(g, posts, [{"handle": "mirko-p", "name": "Mirko Peters"}], "https://api.example.test")
    S.reset()
    return {u: b for u, b in pages.items() if f"/blog/{SLUG}/" in u}


class Transparenz(unittest.TestCase):
    def setUp(self):
        need = {k: ENTS[k] for k in ("ifakt", "polaris", "polaris-vsm", "sharepoint")}
        self.p = [mock.patch.dict(BLG.ENTS, need), mock.patch.dict(SENT.ENTS, need)]
        for x in self.p: x.start()

    def tearDown(self):
        for x in self.p: x.stop()

    def test_daten(self):
        self.assertTrue(ENTS["ifakt"]["disclosure"]["en"])
        self.assertIn(["developed_by", "ifakt"], ENTS["polaris-vsm"]["rel"])

    def test_polaris_link_in_allen_sprachen(self):
        h = f'<p>Value stream mapping with <a href="{BASE}/entity/polaris-vsm/">Polaris VSM</a> shows the waiting times.</p>'
        pages = build([post(h), post(h, "de", tr_of="en", legacy=True, content_tr=True), post(h, "fr", tr_of="en", legacy=True, content_tr=True)])
        self.assertEqual(len(pages), 3)
        for u, b in pages.items():
            lang = "de" if "/de/" in u else ("fr" if "/fr/" in u else "en")
            want = ENTS["ifakt"]["disclosure"].get(lang) or ENTS["ifakt"]["disclosure"]["en"]
            note = re.search(r'<p class="en-disc" role="note"[^>]*>(.*?)</p>', b)
            self.assertTrue(note, u)
            self.assertEqual(BLG.esc(want), note.group(1), u)
            self.assertLess(b.index("en-disc"), b.index("shows the waiting times"), u)   # oben unter der Ueberschrift
            self.assertGreater(b.index("en-disc"), b.index("<h1>"), u)
            self.assertEqual(b.count('class="en-disc"'), 1, u)

    def test_thema_ifakt(self):
        b = next(iter(build([post("<p>A neutral text about planning.</p>", topics=["ifakt"])]).values()))
        self.assertIn('class="en-disc"', b)

    def test_ohne_ifakt_kein_hinweis(self):
        b = next(iter(build([post(f'<p>Plan the rollout with <a href="{BASE}/entity/sharepoint/">SharePoint</a> sites.</p>')]).values()))
        self.assertNotIn('class="en-disc"', b)
        self.assertEqual(BLG.disclosures({"topics": ["sharepoint"]}, "", "en"), [])
        self.assertEqual(BLG.disclosures({"topics": ["polaris-vsm"]}, "", "en", skip=["polaris-vsm"]), [])   # Sponsor-Entitaeten kennzeichnet schon SPM.note


if __name__ == "__main__":
    unittest.main()
