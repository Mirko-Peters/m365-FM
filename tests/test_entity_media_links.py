"""Beziehungskarte und Zeitleiste auf Entitaetsseiten (site_media, Audit Linktexte gap 3, Gegenpruefung E6/A11Y-2): reine Grafik ohne Links.
Vorher war jeder Knoten ein Link aus gekuerztem Namen plus Beziehungswort ("Microsoft Developed by", "Analytics and BI to… Is a") in
svg role=img - Tab-Stopps ohne zugaenglichen Namen. Dieselben Ziele stehen mit vollem Namen in den Beziehungslisten bzw. der Folgenliste."""
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_media as MED   # noqa: E402

E = {"id": "power-bi", "type": "product", "name": "Power BI"}
LONG = "Microsoft Certified: Dynamics 365 Finance and Operations Apps Solution Architect Expert (MB-700)"
ITEMS = [("Developed by", "https://www.m365.fm/entity/microsoft/", "Microsoft"),
         ("Is a", "https://www.m365.fm/entity/analytics-tool/", "Analytics and BI tool"),
         ("Covers", "https://www.m365.fm/entity/mb-700/", LONG),
         ("Part of", "https://www.m365.fm/entity/power-platform/", "Power Platform"),
         ("Related to", "https://www.m365.fm/entity/x/", "Supercalifragilisticexpialidociousproduct")]


def texts(svg):
    return re.findall(r"<text[^>]*>([^<]*)</text>", svg)


class Beziehungskarte(unittest.TestCase):
    H = MED.relation_svg(E, ITEMS, "Relationship map of Power BI: linked topics")

    def test_keine_links_und_kein_fokusziel(self):
        self.assertNotIn("<a ", self.H)
        self.assertNotIn("href=", self.H)
        self.assertNotIn("tabindex", self.H)

    def test_bild_versteckt_beschreibung_in_figcaption(self):
        self.assertRegex(self.H, r'<svg aria-hidden="true" focusable="false"')
        self.assertNotIn('role="img"', self.H)
        self.assertNotIn("aria-label", self.H)
        self.assertIn('<figcaption class="mut">Relationship map of Power BI: linked topics</figcaption>', self.H)

    def test_voller_name_ohne_kuerzung(self):
        t = texts(self.H)
        self.assertNotIn("…", "".join(t))
        self.assertIn("Analytics and BI tool", t)
        joined = " ".join(t)
        for w in LONG.split():
            self.assertIn(w, joined)
        self.assertIn("Supercalifragilisticexpialidociousproduct", "".join(t))   # langes Einzelwort hart geteilt, nicht gekuerzt

    def test_beziehung_eigene_zeile_nach_dem_namen(self):
        t = texts(self.H)
        i = t.index("Microsoft")
        self.assertEqual(t[i + 1], "Developed by")   # Name oben, Beziehung darunter als Beschriftung
        self.assertNotIn("Microsoft Developed by", t)

    def test_zu_wenig_ziele_kein_bild(self):
        self.assertEqual(MED.relation_svg(E, ITEMS[:1], "x"), "")

    def test_im_bild(self):
        for y in re.findall(r'<ellipse cx="\d+" cy="(\d+)" rx="\d+" ry="(\d+)"', self.H):
            self.assertGreaterEqual(int(y[0]) - int(y[1]), 0)
            self.assertLessEqual(int(y[0]) + int(y[1]), 440)


class Zeitleiste(unittest.TestCase):
    EPS = [("2025-08-12", "Build Reusable Semantic Models", "https://www.m365.fm/show/episodes/a/"),
           ("2025-08-25", "B", "https://www.m365.fm/show/episodes/b/"),
           ("2025-11-03", "C", "https://www.m365.fm/show/episodes/c/"), ("2025-11-04", "D", "https://www.m365.fm/show/episodes/d/"),
           ("2025-11-04", "E", "https://www.m365.fm/show/episodes/e/"), ("2026-02-01", "F", "https://www.m365.fm/show/episodes/f/")]
    H = MED.timeline_svg(EPS, "Timeline of episodes about Power BI")

    def test_keine_links(self):
        self.assertNotIn("<a ", self.H)
        self.assertNotIn("href=", self.H)
        self.assertNotIn("<title>", self.H)
        self.assertRegex(self.H, r'<svg aria-hidden="true" focusable="false"')
        self.assertIn("<figcaption class=\"mut\">Timeline of episodes about Power BI</figcaption>", self.H)

    def test_nahe_folgen_als_ein_punkt_mit_anzahl(self):
        cx = [int(x) for x in re.findall(r'<circle cx="(\d+)"', self.H)]
        self.assertEqual(len(cx), 4)   # 08-12, 08-25 (tagesgenau getrennt), 11-03..11-04 (3 Folgen), 2026-02
        self.assertIn("3", texts(self.H))
        self.assertTrue(all(b - a >= 28 for a, b in zip(cx, cx[1:])), cx)

    def test_eine_folge_kein_bild(self):
        self.assertEqual(MED.timeline_svg(self.EPS[:1], "x"), "")


if __name__ == "__main__":
    unittest.main()
