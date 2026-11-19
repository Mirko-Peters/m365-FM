"""Liste "Das erfahren Sie" der Dub-Folgenseiten: .points li ist ein 2-Spalten-Grid (Nummer | Text). Steht der Text mit Kontext-Links direkt im <li>, wird jeder Link
und jedes Textstueck eine eigene Zelle und die Zeile zerfaellt. Der Seitenbau legt deshalb eine <span>-Huelle um den Text, bevor die Links gesetzt werden.
Lauf: python3 -m unittest tests/test_points_list.py"""
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_entmatch as EM  # noqa: E402


class T(unittest.TestCase):
    def test_links_stay_inside_one_cell(self):
        es = {"office-scripts": {"id": "office-scripts", "type": "product", "name": "Office Scripts", "names": {}, "rel": []},
              "power-automate": {"id": "power-automate", "type": "product", "name": "Power Automate", "names": {}, "rel": []}}
        m = EM.Matcher(es, common=set(), cooc=({}, {}))
        html, links = m.link_html("<li><span>Warum Power Automate kein Python ausfuehrt und Office Scripts der native Weg sind</span></li>", lambda i: f"/entity/{i}/", lang="en")
        self.assertEqual({i for _, i in links}, {"office-scripts", "power-automate"})
        li = re.fullmatch(r"<li>(.*)</li>", html, re.S).group(1)
        self.assertTrue(li.startswith("<span>") and li.endswith("</span>"), li)       # genau ein Kind im <li>
        self.assertEqual(li.count("<span>"), 1)

    def test_build_wraps_bullets(self):
        src = (ROOT / "generate_site.py").read_text("utf-8")
        self.assertIn('f"<li><span>{x}</span></li>" for x in bullets', src)


if __name__ == "__main__":
    unittest.main()
