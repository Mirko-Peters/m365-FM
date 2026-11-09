"""Firma <-> Entitaet als Paar (0034): unbeanspruchte Community-Firmen bekommen keine oeffentliche Seite; beanspruchte behalten /community/c/<handle>/ mit sameAs auf die Entitaetsseite."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import site_i18n

site_i18n.remote = lambda: {}
import site_learn
import site_members

BASE = "https://www.m365.fm"


def fake_g(written, ld, sitemap):
    def page(lang, title, desc, url, body, extra=None, jsonld=None, **kw):
        ld[url] = jsonld
        return f"<head>{kw.get('extra_head', '')}</head>{body}"
    return {"BASE": BASE, "write": lambda p, c: written.update({p: c}), "page": page, "header": lambda *_: "", "footer": lambda *_: "",
            "footer_en": lambda: "", "sitemap": sitemap, "TODAY": "2026-11-06", "LANGS": site_members.COMM_LANGS}


ORGS = [
    {"type": "o", "handle": "ifakt", "name": "iFAKT GmbH", "eid": "ifakt", "eid_ok": True, "claimed": True, "public": True, "tagline": "Polaris", "website": "https://www.ifakt.de"},
    {"type": "o", "handle": "fabrikam", "name": "Fabrikam", "eid": "fabrikam", "eid_ok": False, "claimed": False, "public": True, "tagline": "", "website": ""},
]


class OrgPairSeoTest(unittest.TestCase):
    def test_public_orgs_drops_unclaimed_only(self):
        self.assertEqual([o["handle"] for o in site_members.public_orgs(ORGS)], ["ifakt"])
        self.assertEqual(len(site_members.public_orgs([{"handle": "alt"}])), 1, "aeltere Exporte ohne Feld claimed bleiben")

    def test_build_writes_no_page_sitemap_or_listing_for_unclaimed(self):
        written, ld, sitemap = {}, {}, []
        had = site_learn.ENTS.get("ifakt")
        site_learn.ENTS["ifakt"] = {"name": "iFAKT GmbH", "type": "org"}
        try:
            site_members.build(fake_g(written, ld, sitemap), [], list(ORGS))
        finally:   # globale Entitaetentabelle nicht fuer andere Tests veraendern
            if had is None:
                site_learn.ENTS.pop("ifakt", None)
            else:
                site_learn.ENTS["ifakt"] = had
        self.assertIn("community/c/ifakt/index.html", written)
        self.assertNotIn("community/c/fabrikam/index.html", written)
        self.assertFalse([p for p in written if "fabrikam" in p or "fabrikam" in written[p].lower()], "unbeanspruchte Firma taucht nirgends auf")
        self.assertFalse([u for u, *_ in sitemap if "fabrikam" in u], "nicht in der Sitemap")
        graph = json.dumps(ld[f"{BASE}/community/c/ifakt/"])
        self.assertIn("/entity/ifakt/", graph, "beanspruchte Firma: sameAs auf die Entitaetsseite (Hauptseite)")


if __name__ == "__main__":
    unittest.main()
