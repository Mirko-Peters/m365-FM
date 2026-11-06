"""Belegte Fakten fuer Entitaeten (site_facts): Zeilen, Abschnitte, Logo-Kachel, Schema.org; ohne Felder keine Ausgabe."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_learn as SL   # noqa: E402,F401
import site_entities as E   # noqa: E402
import site_facts as FX   # noqa: E402

BASE = "https://www.m365.fm"
RAW = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
I18N = json.loads((ROOT / "data" / "py_i18n.json").read_text("utf-8"))
LANGS = "fr es it nl pt pl id ru uk ar he ja ko".split()
ROOTU = "/entity/"


def plain(**kw):
    return {"id": "x", "type": "org", "name": "X", "desc": {"en": "d"}, **kw}


class Daten(unittest.TestCase):
    def test_ifakt_felder(self):
        i = RAW["ifakt"]
        self.assertEqual(i["register"]["number"], "HRB 22661")
        self.assertEqual(i["founders"], ["jorg-drees", "lars-schubert"])
        self.assertEqual(i["ceo"], ["jorg-drees"])
        self.assertEqual(len(i["customers"]), 3 + 11)
        self.assertEqual(sum(1 for c in i["customers"] if c.get("case_study_url")), 3)
        self.assertEqual(i["industries"], ["aerospace", "manufacturing", "mechanical-engineering", "automotive", "energy"])
        self.assertEqual(i["logo_bg"], "dark")
        self.assertFalse(i.get("logo"), "kein Hotlink: Logo nur ueber R2")
        for k in ("customers", "partners", "certifications"):
            for x in i[k]:
                self.assertTrue(x.get("source"), (k, x))
        for pid in i["founders"] + i["ceo"]:
            self.assertEqual(RAW[pid]["type"], "person")

    def test_modultexte(self):
        for m in ("vsm", "bsm", "designer", "simulator", "optimizer", "operator", "analyzer"):
            for lang in ("en", "de"):
                n = len(RAW["polaris-" + m]["long"][lang].split())
                self.assertTrue(100 <= n <= 160, (m, lang, n))
        self.assertIn("Marketplace", RAW["polaris-vsm"]["long"]["en"])
        self.assertNotIn("Marketplace", RAW["polaris-designer"]["long"]["en"])

    def test_uebersetzungen_alle_sprachen(self):
        for k in ("Legal form", "Commercial register", "Employees", "Reference customers", "Partners", "Certifications", "since {d}", "Logo of {n}", "Source: company website"):
            self.assertEqual(sorted(I18N[k]), sorted(LANGS), k)


class Zeilen(unittest.TestCase):
    def test_org_zeilen(self):
        r = dict(FX.rows("de", RAW["ifakt"], ROOTU, E.ENTS))
        self.assertEqual(r["Rechtsform"], "GmbH")
        self.assertIn("HRB 22661, Amtsgericht Stuttgart", r["Handelsregister"])
        self.assertIn("ca. 25", r["Mitarbeitende"]); self.assertIn("2026-11", r["Mitarbeitende"])
        self.assertIn('href="/entity/jorg-drees/"', r["Gründer"]); self.assertIn('href="/entity/lars-schubert/"', r["Gründer"])
        self.assertIn("jorg-drees", r["Geschäftsführung"])
        self.assertIn("about 25", dict(FX.rows("en", RAW["ifakt"], ROOTU, E.ENTS))["Employees"])

    def test_produkt_zeilen(self):
        r = dict(FX.rows("en", RAW["polaris"], ROOTU, E.ENTS))
        self.assertEqual(r["Deployment"], "SaaS, 100% browser-based")
        self.assertEqual(r["Integrations"], "ERP, Excel, Shopfloor data")
        self.assertIn("ifakt.de/en", r["Free trial"])

    def test_person_position_mit_und_ohne_start(self):
        r = dict(FX.rows("de", RAW["philip-schubert"], ROOTU, E.ENTS))
        self.assertIn("Head of Business Development and Operations", r["Position"]); self.assertIn("iFAKT GmbH", r["Position"]); self.assertIn("seit 2025-05", r["Position"])
        self.assertNotIn("seit", dict(FX.rows("de", RAW["jorg-drees"], ROOTU, E.ENTS))["Position"])
        self.assertIn("since 2026-11", dict(FX.rows("en", RAW["mirko-peters"], ROOTU, E.ENTS))["Position"])

    def test_ohne_felder_keine_ausgabe(self):
        for t in ("org", "product", "person"):
            e = plain(type=t)
            self.assertEqual(FX.rows("en", e, ROOTU, E.ENTS), [])
            self.assertEqual(FX.sections("en", e, ROOTU, E.ENTS), "")
            self.assertEqual(FX.logo_html("en", e), "")
            self.assertEqual(FX.ld_extra(BASE, e, E.ENTS), {})


class Abschnitte(unittest.TestCase):
    def setUp(self):
        self.h = FX.sections("de", RAW["ifakt"], ROOTU, E.ENTS)

    def test_referenzkunden(self):
        h = self.h
        self.assertIn("<h2>Referenzkunden</h2>", h)
        self.assertIn('href="https://www.ifakt.de/references/Silhouette_Customer_Success_Story.pdf"', h)
        self.assertIn('<a href="/entity/automotive/">', h)
        self.assertIn("Magna, Vitesco, ZF, Junghans", h)
        self.assertIn("Quelle: Website des Unternehmens", h)

    def test_partner_zertifizierungen(self):
        h = self.h
        self.assertIn("<h2>Partner</h2>", h); self.assertIn("<h3>Beratungspartner</h3>", h); self.assertIn("Sopra Steria", h)
        self.assertIn("<h3>Forschungspartner</h3>", h)
        self.assertIn("<h2>Zertifizierungen</h2>", h); self.assertIn("TÜV SÜD", h)

    def test_englisch_und_fremdsprache(self):
        self.assertIn("<h2>Reference customers</h2>", FX.sections("en", RAW["ifakt"], ROOTU, E.ENTS))
        self.assertIn("<h2>Clients de référence</h2>", FX.sections("fr", RAW["ifakt"], ROOTU, E.ENTS))


class Logo(unittest.TestCase):
    def test_dunkle_kachel_nur_mit_r2_logo(self):
        e = dict(RAW["ifakt"])
        self.assertEqual(FX.logo_html("de", e), "")
        e["logo"] = "https://img.m365.fm/x/ifakt-logo-white.webp"
        h = FX.logo_html("de", e)
        self.assertIn("en-logo-dark", h); self.assertIn("background:#0b1f3a", h); self.assertIn('alt="Logo von iFAKT GmbH"', h)
        e["logo_bg"] = ""
        self.assertNotIn("#0b1f3a", FX.logo_html("de", e))


class Schema(unittest.TestCase):
    def test_org(self):
        n = E.ent_ld(BASE, E.ENTS["ifakt"], "en", set(), {})
        self.assertEqual(n["legalName"], "iFAKT GmbH")
        self.assertEqual(n["identifier"]["value"], "HRB 22661, Amtsgericht Stuttgart")
        self.assertEqual(n["numberOfEmployees"]["@type"], "QuantitativeValue"); self.assertEqual(n["numberOfEmployees"]["value"], 25)
        self.assertEqual(n["founder"], [{"@id": f"{BASE}/entity/jorg-drees/#entity"}, {"@id": f"{BASE}/entity/lars-schubert/#entity"}])
        self.assertIn({"@type": "Certification", "name": "ISO 9001", "issuedBy": {"@type": "Organization", "name": "TÜV SÜD"}}, n["hasCertification"])
        cs = [x for x in n["subjectOf"] if x.get("about")]
        self.assertEqual(len(cs), 3); self.assertEqual(cs[0]["@type"], "CreativeWork"); self.assertEqual(cs[0]["about"], {"@type": "Organization", "name": "Silhouette"})
        self.assertEqual([x["name"] for x in n["knowsAbout"]] if isinstance(n["knowsAbout"][0], dict) and "name" in n["knowsAbout"][0] else len(n["knowsAbout"]), 5)

    def test_logo_nur_mit_r2(self):
        e = dict(E.ENTS["ifakt"]); self.assertNotIn("logo", E.ent_ld(BASE, e, "en", set(), {}))
        e["logo"] = "https://img.m365.fm/a.webp"; self.assertEqual(E.ent_ld(BASE, e, "en", set(), {})["logo"], "https://img.m365.fm/a.webp")

    def test_produkt(self):
        n = E.ent_ld(BASE, E.ENTS["polaris"], "en", set(), {})
        self.assertEqual(n["operatingSystem"], "Web browser")
        self.assertNotIn("datePublished", n)
        e = dict(E.ENTS["polaris"], release_year="2019", version="3.1")
        n = E.ent_ld(BASE, e, "en", set(), {})
        self.assertEqual((n["datePublished"], n["softwareVersion"]), ("2019", "3.1"))
        self.assertEqual(E.ent_ld(BASE, dict(E.ENTS["polaris"], deployment="Desktop"), "en", set(), {})["operatingSystem"], "Web")

    def test_person(self):
        n = E.ent_ld(BASE, E.ENTS["philip-schubert"], "en", set(), {})
        self.assertEqual(n["hasOccupation"], [{"@type": "Occupation", "name": "Head of Business Development and Operations"}])
        self.assertIn({"@id": f"{BASE}/entity/ifakt/#entity"}, n["worksFor"] if isinstance(n["worksFor"], list) else [n["worksFor"]])

    def test_ohne_felder_nichts(self):
        n = E.ent_ld(BASE, E.ENTS["lars-schubert"], "en", set(), {})
        for k in ("hasOccupation", "legalName", "numberOfEmployees", "hasCertification"):
            self.assertNotIn(k, n)


if __name__ == "__main__":
    unittest.main()
