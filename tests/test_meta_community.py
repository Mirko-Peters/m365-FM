"""Suchintent-Titel und Descriptions der Community-Seiten und Startseiten (site_meta_community.py, data/home_i18n.json): Laenge, Marke, Duplikate."""
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_meta_community as M   # noqa: E402

BRAND = re.compile(r"M365[ .]?FM", re.I)
PEOPLE = json.loads((ROOT / "data" / "members_export.json").read_text("utf-8"))
ENTS = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}


def name_of(eid):
    e = ENTS.get(eid) or {}
    return e.get("name") if e.get("type") not in (None, "person", "org", "job", "event", "media") else ""


def ok_title(t):
    # page() haengt ' | M365.FM' an, wenn die Marke fehlt: Gesamtlaenge <= 70 (Bing-Grenze), Marke hoechstens einmal
    total = len(t) if BRAND.search(t) else len(t) + 10
    return total <= 70 and len(BRAND.findall(t)) <= 1


class Texte(unittest.TestCase):
    def check(self, title, desc):
        self.assertTrue(title.strip())
        self.assertTrue(ok_title(title), title)
        self.assertTrue(70 <= len(desc) <= 160, (len(desc), desc))
        self.assertNotIn("..", desc.replace("…", ""))
        self.assertFalse(desc.endswith(" "))

    def test_profile_und_firmen(self):
        seen = set()
        for lang in M.LANGS:
            for p in PEOPLE["people"]:
                t, d = M.profile_meta(lang, p, "Members", name_of)
                self.check(t, d)
                self.assertNotIn("[", t)
                self.assertNotIn((lang, t), seen, t)
                seen.add((lang, t))
            for o in PEOPLE["orgs"]:
                t, d = M.company_meta(lang, o, name_of)
                self.check(t, d)
                self.assertNotIn((lang, t), seen, t)
                seen.add((lang, t))

    def test_keine_erfundenen_programme(self):
        p = {"name": "Test T.", "headline": "", "programs": [{"p": "mvp", "year": 0, "url": "", "verified": False}], "expertise": []}
        t, d = M.profile_meta("en", p, "Members")
        self.assertNotIn("MVP", d)   # Programm ohne Jahr, Link und Verifizierung wird nicht behauptet

    def test_andere_sprachen_unveraendert(self):
        self.assertIsNone(M.profile_meta("fr", PEOPLE["people"][0], "M"))
        self.assertIsNone(M.hub_meta("members", "ja"))
        self.assertIsNone(M.event_meta("es", {"title": "X", "start": "2027-01-01"}))

    def test_events(self):
        ev = {"title": "M365Con 2027", "start": "2027-03-12T09:00:00Z", "mode": "online",
              "summary": "The free online convention for the Microsoft 365 community with sessions on Copilot, Teams, SharePoint and Power Platform from MVPs around the world, live and on demand."}
        for lang in M.LANGS:
            for sessions in (True, False):
                t, d = M.event_meta(lang, ev, sessions)
                self.check(t, d)
                self.assertIn("2027", d)
        t, d = M.event_meta("en", {"title": "Conf", "start": "2027-04-27", "mode": "onsite", "location": "Orlando", "country": "US"}, False)
        self.assertIn("Orlando", d)
        self.check(t, d)

    def test_hubs(self):
        titles = set()
        for kind in M.HUBS:
            for lang in M.LANGS:
                t, d = M.hub_meta(kind, lang)
                self.check(t, d)
                self.assertNotIn((lang, t), titles)
                titles.add((lang, t))

    def test_startseiten_alle_sprachen(self):
        home = json.loads((ROOT / "data" / "home_i18n.json").read_text("utf-8"))
        titles = set()
        for lang, x in home.items():
            if lang == "_":
                continue
            t, d = x["title"], x["desc"].format(n=14)
            self.assertTrue(ok_title(t) and len(t) <= 62, (lang, t))
            self.assertLessEqual(len(d), 155, (lang, d))
            self.assertIn("Microsoft 365", t)
            self.assertNotIn(t, titles)
            titles.add(t)
        self.assertEqual(len(titles), 15)


if __name__ == "__main__":
    unittest.main()
