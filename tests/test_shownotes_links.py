"""Interne Links in den Show Notes der Folgenseiten (site_shownotes, Audit Linktexte SEO-6): keine utm_*-Parameter bei m365.fm/www.m365.fm,
kein Link der Seite auf sich selbst ("Episode page" wird Text). Externe Kampagnen-Links und die Spreaker-Fassung bleiben unveraendert."""
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_shownotes as SNS   # noqa: E402

B = "https://www.m365.fm"
OWN = f"{B}/show/episodes/meine-folge/"
Q = "?utm_source=podcast&utm_medium=shownotes&utm_campaign=meine-folge"
ENTS = {"excel": {"id": "excel", "name": "Microsoft Excel", "desc": {"en": "Spreadsheet app from Microsoft, part of Microsoft 365.", "de": ""}}}
MD = f"""Hook about [Excel]({B}/entity/excel/{Q}) and more.

## Explore more on M365.FM

- [Episode page]({OWN}{Q}): the full episode with chapters
- [Other episode]({B}/show/episodes/andere-folge/{Q}#kapitel)
- [Event](https://m365con.net/?utm_source=m365fm&utm_medium=web)
- [Mixed]({B}/entity/excel/?ref=x&utm_source=podcast&a=1)
"""


def render(md=MD, own=OWN):
    return SNS.render({"meta": {}, "body": md, "path": "0.md"}, "en", ENTS, B, own=own)[0]


class Links(unittest.TestCase):
    def test_keine_utm_bei_internen_links(self):
        h = render()
        self.assertEqual(re.findall(r'href="https://(?:www\.)?m365\.fm/[^"]*utm_', h), [])
        self.assertEqual([u for u in re.findall(r'href="([^"]+)"', h) if "m365.fm/" in u and "utm_" in u], [])   # auch kein "amp;utm_"

    def test_entitaetslink_behaelt_hover(self):
        h = render()
        self.assertIn(f'<a class="gl" href="{B}/entity/excel/" data-gt="Microsoft Excel"', h)

    def test_andere_parameter_und_anker_bleiben(self):
        h = render()
        self.assertIn(f'href="{B}/entity/excel/?ref=x&amp;a=1"', h)
        self.assertIn(f'href="{B}/show/episodes/andere-folge/#kapitel">Other episode</a>', h)

    def test_selbstverweis_wird_text(self):
        h = render()
        self.assertNotIn(f'href="{OWN}', h)
        self.assertIn("<li>Episode page: the full episode with chapters</li>", h)

    def test_ohne_eigene_adresse_bleibt_der_link(self):
        h = render(own=None)
        self.assertIn(f'<a href="{OWN}">Episode page</a>', h)

    def test_externe_kampagnen_links_unveraendert(self):
        h = render()
        self.assertIn('href="https://m365con.net/?utm_source=m365fm&amp;utm_medium=web"', h)

    def test_clean_url(self):
        self.assertEqual(SNS.clean_url(f"https://m365.fm/entity/x/{Q}"), "https://m365.fm/entity/x/")
        self.assertEqual(SNS.clean_url("https://www.spreaker.com/x?utm_source=a"), "https://www.spreaker.com/x?utm_source=a")
        self.assertEqual(SNS.clean_url(f"{B}/entity/x/"), f"{B}/entity/x/")

    def test_spreaker_fassung_unberuehrt(self):
        """Die Spreaker-Fassung (shownotes/spreaker/*.html) entsteht nicht ueber site_shownotes und behaelt ihre Parameter."""
        src = (ROOT / "tools" / "set_spreaker_links.py").read_text("utf-8")
        self.assertNotIn("site_shownotes", src)


class Quellen(unittest.TestCase):
    def test_echte_vollfassungen_ohne_utm_und_selbstverweis(self):
        """Alle Vollfassungen in shownotes/site: gerendert ohne utm in internen Links und ohne Link auf die eigene Folgenseite."""
        n = 0
        for f in sorted((ROOT / "shownotes" / "site").glob("*.md"))[:120]:
            rec = SNS.parse_file(f)
            m = re.search(r"\[Episode page\]\((https://www\.m365\.fm/show/episodes/[^)?]+)", rec["body"])
            own = m.group(1) if m else None
            h = SNS.render(rec, "en", ENTS, B, own=own)[0]
            self.assertEqual(re.findall(r'href="https://(?:www\.)?m365\.fm/[^"]*utm_', h), [], f.name)
            if own:
                self.assertNotIn(f'href="{own}"', h, f.name); n += 1
        self.assertGreater(n, 10)


if __name__ == "__main__":
    unittest.main()
