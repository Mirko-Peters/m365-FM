"""K1 (Sicherheits-Audit): Der Knopf 'Profil mit LinkedIn beanspruchen' auf der Entitaetsseite ist ein Formular-POST an /auth/claim/linkedin.
Er setzt kein ?claim=linkedin in eine Rueckkehr-URL, denn Login-Knoepfe uebernehmen location.href und ein fremder Link koennte so eine Uebernahme ausloesen."""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_entities as SE   # noqa: E402

API = "https://api-dub.m365.fm"
PERSON = {"type": "person", "name": "Alex Example", "same_as": ["https://www.linkedin.com/in/alex"]}


class ClaimButton(unittest.TestCase):
    def setUp(self):
        self._c, self._o = dict(SE.CLAIMS), dict(SE.ORGPAGES)
        SE.CLAIMS.pop("alex-example", None); SE.ORGPAGES.pop("alex-example", None)
        self._b = getattr(SE, "BASE_", None); SE.BASE_ = "https://www.m365.fm"

    def tearDown(self):
        SE.CLAIMS.clear(); SE.CLAIMS.update(self._c); SE.ORGPAGES.clear(); SE.ORGPAGES.update(self._o)
        if self._b is None:
            del SE.BASE_
        else:
            SE.BASE_ = self._b

    def test_formular_post_statt_claim_parameter(self):
        out = SE.claim_html("alex-example", "de", PERSON, API)
        self.assertIn(f'<form id="en-claim-form" method="post" action="{API}/auth/claim/linkedin"', out)
        self.assertIn('name="entity" value="alex-example"', out)
        self.assertIn('name="lang" value="de"', out)
        self.assertNotIn("claim=linkedin", out)
        self.assertNotIn("claim%3Dlinkedin", out)
        self.assertNotIn("/auth/login/linkedin", out)

    def test_ohne_linkedin_kein_knopf(self):
        self.assertEqual(SE.claim_html("alex-example", "en", {"type": "person", "same_as": []}, API), "")


if __name__ == "__main__":
    unittest.main()
