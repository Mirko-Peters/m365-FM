"""Hardware-Sponsoring (site_hardware.py): Seiten /hardware/ und /hardware/how-we-test/ in EN und DE, Preise und Zusagen aus der Vorgabe von Mirko
(16.11.2026), Formularfelder passend zum Worker, Fusszeilen-Link, Label "device". Laeuft ohne Netz."""
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_hardware as H   # noqa: E402
import site_sponsorships as SPM   # noqa: E402

BASE = "https://www.m365.fm"


def build(langs=("de",)):
    out, sitemap = {}, []
    g = dict(write=lambda path, text: out.__setitem__(path, text),
             page=lambda lang, title, desc, url, body, alts, ld, **kw: json.dumps({"lang": lang, "title": title, "desc": desc, "url": url, "alts": alts, "ld": ld}) + "\n" + body,
             header=lambda lang, x: "<header></header>", footer=lambda lang: "<footer></footer>", BASE=BASE, LANGS=list(langs), sitemap=sitemap, TODAY="2026-11-16", api="https://api-dub.m365.fm")
    H.build(g)
    return out, sitemap


class Seiten(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.out, cls.sitemap = build()

    def test_vier_seiten_und_sitemap(self):
        self.assertEqual(sorted(self.out), ["de/hardware/how-we-test/index.html", "de/hardware/index.html", "hardware/how-we-test/index.html", "hardware/index.html"])
        urls = [u for u, _, _ in self.sitemap]
        for u in (f"{BASE}/hardware/", f"{BASE}/hardware/how-we-test/", f"{BASE}/de/hardware/", f"{BASE}/de/hardware/how-we-test/"):
            self.assertIn(u, urls)

    def test_schluessel_en_und_de_gleich(self):
        self.assertEqual(set(H.T["en"]), set(H.T["de"]))
        self.assertEqual(set(H.T["en"]["err"]), set(H.T["de"]["err"]))
        self.assertEqual(set(H.T["en"]["cats"]), set(H.T["de"]["cats"]))
        self.assertEqual(len(H.T["en"]["ways"]), len(H.T["de"]["ways"]))
        self.assertEqual(len(H.T["en"]["faq"]), len(H.T["de"]["faq"]))
        self.assertEqual(set(H.T["en"]["crit"]), {k for k, _ in H.CRITERIA})

    def test_kategorien_in_seite_worker_und_admin_gleich(self):
        import re
        w = (ROOT / "worker" / "src" / "hardware.js").read_text("utf-8")
        wk = re.search(r"HW_CATEGORIES = \[(.*?)\]", w).group(1).replace('"', "").replace(" ", "").split(",")
        a = (ROOT / "assets" / "admin.js").read_text("utf-8")
        ak = re.findall(r"(\w+): \"", re.search(r"var HW_CAT = \{(.*?)\};", a).group(1))
        self.assertEqual(list(H.CATEGORIES), wk)
        self.assertEqual(list(H.CATEGORIES), ak)
        self.assertEqual(set(H.T["en"]["cats"]), set(H.CATEGORIES))
        self.assertEqual(H.CATEGORIES[-1], "other", "Sonstiges steht zuletzt")

    def test_preise_und_zusagen_wie_vorgegeben(self):
        en = self.out["hardware/index.html"]
        for s in ("1,000 USD", "500 USD", "1,250 USD", "Free to organise", "within 2 weeks", "3 business days", "Test devices stay with us"):
            self.assertIn(s, en)
        de = self.out["de/hardware/index.html"]
        for s in ("1.000 USD", "500 USD", "1.250 USD", "Organisation kostenlos", "innerhalb von 2 Wochen", "3 Werktage", "Testgeräte bleiben bei uns"):
            self.assertIn(s, de)
        self.assertEqual((H.PRICES["video"], H.PRICES["podcast"], H.PRICES["both"], H.TEST_DAYS, H.PUBLISH_WEEKS, H.FACT_DAYS), (1000, 500, 1250, 3, 2, 3))

    def test_kein_platzhalter_und_keine_erfundenen_zahlen(self):
        for path, text in self.out.items():
            self.assertNotRegex(text, r"\[X|\[link\]|TODO", path)

    def test_formularfelder_passen_zum_worker(self):
        src = (ROOT / "worker" / "src" / "hardware.js").read_text("utf-8")
        for p in ("de/hardware/index.html", "hardware/index.html"):
            html = self.out[p]
            for f in ("name", "company", "email", "product", "product_url", "category", "quantity", "ship_by", "offers", "message", "website", "ships", "consent"):
                self.assertIn(f'name="{f}"', html, (p, f))
            for c in H.CATEGORIES:
                self.assertIn(f'value="{c}"', html)
                self.assertIn(f'"{c}"', src)
        js = (ROOT / "assets" / "hardware.js").read_text("utf-8")
        for k in ("product_url", "ships", "consent", "offers", "/api/hardware"):
            self.assertIn(k, js)

    def test_gewichte_ergeben_100_und_stehen_auf_der_seite(self):
        self.assertEqual(sum(w for _, w in H.CRITERIA), 100)
        page = self.out["hardware/how-we-test/index.html"]
        for _, w in H.CRITERIA:
            self.assertIn(f"{w}%", page)
        self.assertIn("at least 3 days", page)

    def test_verlinkung_der_seiten_untereinander(self):
        self.assertIn(f"{BASE}/hardware/how-we-test/", self.out["hardware/index.html"])
        self.assertIn(f"{BASE}/hardware/#apply", self.out["hardware/how-we-test/index.html"])
        self.assertIn(f"{BASE}/de/hardware/how-we-test/", self.out["de/hardware/index.html"])
        self.assertIn(f"{BASE}/media-kit/", self.out["hardware/index.html"])

    def test_faq_json_ld(self):
        head = json.loads(self.out["hardware/index.html"].split("\n", 1)[0])
        faq = [x for x in head["ld"] if x["@type"] == "FAQPage"][0]
        self.assertEqual(len(faq["mainEntity"]), len(H.T["en"]["faq"]))

    def test_keine_gekaufte_wertung_versprochen(self):
        for lang in ("en", "de"):
            t = H.T[lang]
            blob = " ".join(t["rules"] + t["indep"])
            self.assertTrue(re.search(r"not for sale|nicht käuflich", blob))
            self.assertTrue(re.search(r"honest test|ehrlichen Test", blob))


class Fusszeile(unittest.TestCase):
    def test_links_in_allen_sprachen(self):
        for lang, to in (("en", "/hardware/"), ("de", "/de/hardware/"), ("fr", "/hardware/")):
            h = H.footer_links(BASE, lang)
            self.assertIn(f'href="{BASE}{to}"', h)
            self.assertIn(f'href="{BASE}{to}how-we-test/"', h)

    def test_generate_site_haengt_die_links_in_die_fusszeile_und_baut_die_seiten(self):
        src = (ROOT / "generate_site.py").read_text("utf-8")
        self.assertIn("HWR.footer_links(BASE, lang)", src)
        self.assertIn("HWR.build(dict(", src)


class Label(unittest.TestCase):
    def test_device_label_texte_und_uebersetzungen(self):
        self.assertIn("device", SPM.LABELS)
        self.assertEqual(SPM.TEXT["device"][2:], ("Test device provided by the manufacturer: {sponsor}", "Testgerät vom Hersteller bereitgestellt: {sponsor}"))
        d = json.loads((ROOT / "data" / "py_i18n.json").read_text("utf-8"))
        for k in ("Test device", "Test device provided by the manufacturer: {sponsor}"):
            self.assertEqual(len(d[k]), 13, k)
        for v in d["Test device provided by the manufacturer: {sponsor}"].values():
            self.assertIn("{sponsor}", v)

    def test_bezahlte_kennzeichnung_geht_vor_testgeraet(self):
        recs = [{"label": "device", "sponsor": {"name": "A", "url": "https://a.example/"}}, {"label": "sponsored", "sponsor": {"name": "A", "url": "https://a.example/"}}]
        self.assertEqual(SPM.badge("en", recs), "Sponsored")
        self.assertEqual(SPM.badge("en", recs[:1]), "Test device")


class Admin(unittest.TestCase):
    def test_admin_reiter_und_status(self):
        js = (ROOT / "assets" / "admin.js").read_text("utf-8")
        self.assertIn('["hw", "Hardware-Anfragen"]', js)
        self.assertIn('api(HWU)', js)
        self.assertNotIn("innerHTML", js[js.index("function hardwareLeads"):js.index("function sponsorRequests")])
        for st in ("open", "committed", "received", "published", "declined"):
            self.assertIn(f'["{st}"', js)


if __name__ == "__main__":
    unittest.main()
