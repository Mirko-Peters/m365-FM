"""Kurzlink-Basis GO_BASE (c.m365.fm): site_ads.go_link, Sponsor-Links (site_sponsorships) und Hausanzeigen (site_ads._track).
Ohne GO_BASE bleibt die alte Form https://api-dub.m365.fm/go/<code> (offline-Bau, Tests, Notfall); beide gelten im Worker."""
import os
import sys
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_ads as ADS            # noqa: E402
import site_sponsorships as SPM   # noqa: E402


def env(**kw):
    return mock.patch.dict(os.environ, {k: v for k, v in kw.items()}, clear=False)


class GoLink(unittest.TestCase):
    def test_default_ist_alte_adresse(self):
        with mock.patch.dict(os.environ, {}, clear=False):
            os.environ.pop("GO_BASE", None)
            self.assertEqual(ADS.go_link("acme-2026", "s=entity"), "https://api-dub.m365.fm/go/acme-2026?s=entity")
            self.assertEqual(ADS.go_link("h-m365con"), "https://api-dub.m365.fm/go/h-m365con")

    def test_mit_go_base_kurzform(self):
        with env(GO_BASE="https://c.m365.fm"):
            self.assertEqual(ADS.go_link("acme-2026", "s=entity"), "https://c.m365.fm/acme-2026?s=entity")
        with env(GO_BASE="https://c.m365.fm/"):
            self.assertEqual(ADS.go_link("h-services", "s=mid&pt=blog"), "https://c.m365.fm/h-services?s=mid&pt=blog")

    def test_ungueltige_basis_faellt_zurueck(self):
        for bad in ["", "  ", "http://c.m365.fm", "c.m365.fm", "https://", "https://c.m365.fm/go", "javascript:alert(1)", "https://c.m365.fm?x=1", "https://u@c.m365.fm"]:
            with env(GO_BASE=bad):
                self.assertEqual(ADS.go_link("abc", "s=x"), "https://api-dub.m365.fm/go/abc?s=x", bad)

    def test_sponsor_link_nutzt_basis(self):
        rec = {"sponsor": {"name": "Acme", "url": "https://www.acme.example/"}, "go": "acme-2026"}
        SPM.reset()
        SPM.set_go_codes(["acme-2026"])
        try:
            with env(GO_BASE="https://c.m365.fm"):
                self.assertEqual(SPM.link_url([rec], "https://www.acme.example/", "entity"), "https://c.m365.fm/acme-2026?s=entity")
            with mock.patch.dict(os.environ, {}, clear=False):
                os.environ.pop("GO_BASE", None)
                self.assertEqual(SPM.link_url([rec], "https://www.acme.example/", "entity"), "https://api-dub.m365.fm/go/acme-2026?s=entity")
            # nicht aktiver Code oder offline: weiter der Direktlink
            SPM.set_go_codes(["acme-2026"], offline=True)
            with env(GO_BASE="https://c.m365.fm"):
                self.assertEqual(SPM.link_url([rec], "https://www.acme.example/", "entity"), "https://www.acme.example/")
        finally:
            SPM.reset()

    def test_hausanzeige_nutzt_basis(self):
        with env(GO_BASE="https://c.m365.fm"):
            out = ADS._track('<a href="https://m365con.net/" rel="noopener">M365Con</a>', "m365con", "mid", "episode", "de", "teams-phone", "folge-1")
        self.assertIn('href="https://c.m365.fm/h-m365con?s=mid&amp;pt=episode&amp;l=de&amp;e=teams-phone&amp;p=folge-1"', out)
        self.assertNotIn("api-dub", out)


if __name__ == "__main__":
    unittest.main()
