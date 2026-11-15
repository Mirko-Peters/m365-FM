"""SEO-Titel und Meta-Descriptions der Entitaeten, des Lernbereichs und des Verzeichnisses (site_meta_entities): Laenge, Marke, Duplikate, Satzenden.
Kein Seitenbau: die Bildner sind reine Funktionen und werden mit echten Datensaetzen aus data/ aufgerufen."""
import collections
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_meta_entities as M   # noqa: E402
import entity_fill_data as FD   # noqa: E402
import generate_site as G   # noqa: E402   (seo_title, meta_desc: so, wie page() sie anwendet)

LANGS = "en de fr es it nl pt pl id ru uk ar he ja ko".split()


def _load():
    by = {}
    for f in ("entities.json", "guest_entities.json", "speaker_entities.json"):
        for e in json.loads((ROOT / "data" / f).read_text("utf-8")):
            by.setdefault(e["id"], e)
    return list(by.values())


ENTS = _load()
FLAGS = M.name_flags(ENTS)
BRAND = re.compile(r"M365[ .]?FM", re.I)


def meta(lang, e, n_eps=0):
    t, d = M.entity_meta(lang, e, FD.desc(e, lang), n_eps=n_eps, flags=FLAGS[e["id"]], type_label=e["type"])
    return G.seo_title(t), G.meta_desc(d), t, d


class Entitaeten(unittest.TestCase):
    def test_alle_typen_mit_mindestens_zehn_datensaetzen(self):
        n = collections.Counter(e["type"] for e in ENTS)
        for typ in ("concept", "product", "cert", "org", "person", "job", "industry"):
            self.assertGreaterEqual(n[typ], 10, typ)

    def test_titel_marke_einmal_und_laenge(self):
        for lang in LANGS:
            over = nobrand = 0
            for e in ENTS:
                for ne in (0, 4):
                    title, _, bare, _ = meta(lang, e, ne)
                    self.assertLessEqual(len(BRAND.findall(title)), 1, (lang, e["id"], title))   # Marke nie doppelt; seo_title laesst sie bei sehr langen Namen (ueber 62 Zeichen) weg
                    nobrand += not BRAND.search(title)
                    self.assertTrue(e["id"] == "m365fm" or not BRAND.search(bare), (lang, e["id"], bare))   # der Bildner haengt keine Marke an: page() tut es
                    self.assertLessEqual(len(title), 70, (lang, e["id"], title))
                    over += len(title) > 60
            self.assertLess(nobrand / (2 * len(ENTS)), 0.03, (lang, nobrand))
            self.assertLess(over / (2 * len(ENTS)), 0.03, (lang, over))   # Ziel 60 Zeichen inkl. Marke: nur lange Namen (Zertifizierungen, Firmen) duerfen darueber

    def test_titel_ohne_auslassung_fuer_en_de(self):
        for lang in ("en", "de"):
            bad = [e["id"] for e in ENTS if meta(lang, e)[0].endswith("…")]
            self.assertLessEqual(len(bad), 3, bad)

    def test_description_laenge_und_satzende(self):
        for lang in LANGS:
            ell = short = 0
            for e in ENTS:
                for ne in (0, 4):
                    _, d, _, raw = meta(lang, e, ne)
                    self.assertLessEqual(len(d), 160, (lang, e["id"], d))
                    self.assertEqual(d, d.strip())
                    self.assertGreater(len(d), 25, (lang, e["id"], d))
                    ell += d.endswith("…")
                    short += len(d) < 100
            self.assertLess(ell / (2 * len(ENTS)), 0.02, (lang, ell))   # Schnitt mitten im Satz nur, wenn es keine Satzfuge gibt (z. B. ein 1000-Zeichen-Satz)
            self.assertLess(short / (2 * len(ENTS)), 0.2, (lang, short))

    def test_keine_doppelten_titel_und_descriptions(self):
        for lang in LANGS:
            t, d = collections.defaultdict(list), collections.defaultdict(list)
            for e in ENTS:
                title, desc, _, _ = meta(lang, e, 2)
                t[title].append(e["id"]); d[desc].append(e["id"])
            self.assertEqual([v for v in t.values() if len(v) > 1], [], lang)
            self.assertEqual([v for v in d.values() if len(v) > 1], [], lang)

    def test_beispiele_suchabsicht(self):
        ex = {e["id"]: e for e in ENTS}
        c = {"id": "x", "type": "concept", "name": "DLP"}
        self.assertEqual(M.entity_title("en", c, 0), "What Is DLP? Definition & Use Cases")
        self.assertEqual(M.entity_title("en", c, 3), "What Is DLP? Definition, Use Cases & Episodes")
        self.assertEqual(M.entity_title("de", c, 3), "Was ist DLP? Definition, Einsatz & Folgen")
        self.assertEqual(M.entity_title("fr", c, 0), "Qu'est-ce que DLP ? Définition & Cas d'usage")
        self.assertEqual(M.entity_title("en", {**c, "name": "Zero Trust Access"}, 3), "What Is Zero Trust Access? Definition & Episodes")   # Folgen bleiben, wenn der Name lang ist
        p = {"id": "y", "type": "person", "name": "Jane Doe"}
        self.assertEqual(M.entity_title("en", p, 2), "Who Is Jane Doe? Profile, Role & Episodes")
        self.assertEqual(M.entity_title("de", p, 0), "Wer ist Jane Doe? Profil & Rolle")
        o = {"id": "z", "type": "org", "name": "Truesec"}
        self.assertEqual(M.entity_title("en", o, 0), "Truesec: Company Profile")
        self.assertTrue(M.entity_title("en", ex["sharepoint"], 0).startswith("What Is SharePoint") if "sharepoint" in ex else True)
        # Zertifizierung mit sehr langem Namen: Pruefungsnummer statt abgeschnittenem Namen
        cert = next(e for e in ENTS if e["type"] == "cert" and len(e["name"]) > 70 and "(" in e["name"])
        self.assertLessEqual(len(M.entity_title("en", cert, 0)) + M.BRAND_LEN, 60)
        self.assertRegex(M.entity_title("en", cert, 0), r"[A-Z]{1,3}-\d{3}")

    def test_description_beginnt_mit_der_antwort_und_nennt_den_namen(self):
        e = {"id": "x", "type": "product", "name": "Azure Service Bus"}
        d = M.entity_desc("en", e, "Enterprise message broker with queues and publish-subscribe topics for decoupling applications and services.")
        self.assertTrue(d.startswith("Azure Service Bus – Enterprise message broker"), d)
        d = M.entity_desc("en", {**e, "name": "BitLocker"}, "BitLocker is the full-volume drive encryption feature built into Windows. On a dev box the disk is already encrypted.")
        self.assertTrue(d.startswith("BitLocker is the full-volume drive encryption"), d)
        self.assertTrue(M.entity_desc("en", e, "").startswith("Azure Service Bus."))
        long_one = "A technique that tries many algorithms and settings on a dataset in parallel, returns the best-performing model for a defined prediction target and documents every run so that results can be reproduced later."
        d = M.entity_desc("en", {"id": "q", "type": "concept", "name": "AutoML"}, long_one)
        self.assertLessEqual(len(d), 155)
        self.assertTrue(d.endswith("."), d)

    def test_dup_und_keep(self):
        a = {"id": "oauth", "type": "concept", "name": "OAuth 2.0"}
        b = {"id": "oauth-2-0", "type": "concept", "name": "OAuth 2.0"}
        fl = M.name_flags([a, b])
        self.assertEqual(fl["oauth"][0], 0)   # erster nach Kennung: unveraendert
        self.assertEqual(M.entity_title("en", a, 0, *fl["oauth"]), "What Is OAuth 2.0? Definition & Use Cases")
        self.assertEqual(M.entity_title("en", b, 0, *fl["oauth-2-0"]), "What Is OAuth 2.0 (2)? Definition & Use Cases")
        x = {"id": "x1", "type": "concept", "name": "Connection references (Power Platform and a very long qualifier)"}
        y = {"id": "x2", "type": "concept", "name": "Connection references (Dataverse and a very long qualifier)"}
        fl = M.name_flags([x, y])
        self.assertNotEqual(M.entity_title("en", x, 0, *fl["x1"]), M.entity_title("en", y, 0, *fl["x2"]))

    def test_fallback_unbekannte_sprache(self):
        e = {"id": "x", "type": "concept", "name": "Zero Trust"}
        self.assertEqual(M.entity_title("xx", e, 0), M.entity_title("en", e, 0))

    def test_alle_sprachen_haben_alle_bausteine(self):
        for lang in LANGS:
            self.assertEqual(set(M.TOK[lang]), set(M.TOK["en"]), lang)
            self.assertIn("{n}", M.TOK[lang]["what"], lang)
            self.assertIn("{n}", M.TOK[lang]["who"], lang)
            self.assertIn(lang, M.PATH, lang)
            self.assertIn(lang, M.LEARN, lang)
            self.assertIn("{cat}", M.PATH[lang][0]); self.assertIn("{cat}", M.PATH[lang][1]); self.assertIn("{n}", M.PATH[lang][3])


class Lernbereich(unittest.TestCase):
    def test_lernpfade_alle_sprachen(self):
        cats = ["AI Agents & Copilot Studio", "Security, Identity & Governance", "Power Platform & Dynamics 365", "Microsoft 365 Copilot", "Azure & Developer", "Data & Fabric", "Teams & Productivity"]
        seen = set()
        for lang in LANGS:
            for i, c in enumerate(cats):
                title, desc = M.path_meta(lang, c, 5 + i)
                full = G.seo_title(title)
                self.assertEqual(len(BRAND.findall(full)), 1, full)
                self.assertLessEqual(len(full), 70, full)
                self.assertLessEqual(len(G.meta_desc(desc)), 160)
                self.assertIn(c, title)
                if c == "Data & Fabric" and lang in ("en", "de"):
                    self.assertIn(str(5 + i), G.meta_desc(desc), lang)   # kurze Kategorie: Zahl der Folgen passt in die Description
                self.assertNotIn((lang, title), seen); seen.add((lang, title))
                self.assertNotIn((lang, desc), seen); seen.add((lang, desc))

    def test_lern_hub_alle_sprachen(self):
        for lang in LANGS:
            title, desc = M.learn_meta(lang)
            self.assertEqual(len(BRAND.findall(G.seo_title(title))), 1)
            self.assertLessEqual(len(G.seo_title(title)), 70, title)
            self.assertGreaterEqual(len(desc), 60 if lang in ("ja", "ko") else 90, lang)
            self.assertLessEqual(len(G.meta_desc(desc)), 160)
            self.assertFalse(G.meta_desc(desc).endswith("…"), lang)
        t, d = M.learn_en_meta()
        self.assertLessEqual(len(G.seo_title(t)), 62)
        self.assertTrue(120 <= len(d) <= 155, len(d))

    def test_glossar_entitaets_hub_trainer(self):
        for lang in ("en", "de"):
            for fn, args in ((M.glossary_meta, (1043,)), (M.entities_hub_meta, (1947,)), (M.trainer_meta, ())):
                title, desc = fn(lang, *args)
                full = G.seo_title(title)
                self.assertEqual(len(BRAND.findall(full)), 1, full)
                self.assertLessEqual(len(full), 62, full)
                self.assertTrue(110 <= len(desc) <= 155, (lang, fn.__name__, len(desc), desc))
        self.assertIn("1,000+", M.glossary_meta("en", 1043)[0])
        self.assertIn("1.000+", M.glossary_meta("de", 1043)[0])
        self.assertNotIn("+", M.glossary_meta("en", 40)[0])   # unter 100 Eintraegen keine Zahl
        self.assertIn("1,947", M.entities_hub_meta("en", 1947)[1])
        self.assertIn("1.947", M.entities_hub_meta("de", 1947)[1])
        for fn, args in ((M.glossary_meta, (1043,)), (M.entities_hub_meta, (1947,)), (M.trainer_meta, ())):
            self.assertIsNone(fn("fr", *args))   # andere Sprachen: noindex, bisheriger Text bleibt

    def test_titel_der_hubs_unterscheiden_sich(self):
        for lang in ("en", "de"):
            titles = [M.glossary_meta(lang, 1000)[0], M.entities_hub_meta(lang, 1000)[0], M.trainer_meta(lang)[0], M.learn_meta(lang)[0], M.directory_hub_meta(lang, 3, 2, 1)[0]]
            self.assertEqual(len(set(titles)), len(titles))


class Verzeichnis(unittest.TestCase):
    def test_hub_zahlen_nur_wenn_vorhanden(self):
        t, d = M.directory_hub_meta("en", 12, 4, 1)
        self.assertEqual(t, "Microsoft 365 Experts & Companies Directory")
        self.assertIn("12 experts, 4 companies and 1 event", d)
        t, d = M.directory_hub_meta("de", 12, 4, 0)
        self.assertIn("12 Expert:innen und 4 Firmen", d)
        self.assertNotIn("Event:", d.split("filterbar")[0].split(":")[1])
        self.assertTrue(110 <= len(d) <= 155, len(d))
        t, d = M.directory_hub_meta("en", 0, 0, 0)
        self.assertNotIn("0", d)
        self.assertIsNone(M.directory_hub_meta("fr", 1, 1, 1))

    def test_orte_und_themen(self):
        for lang in ("en", "de"):
            seen = set()
            for kind, label, place, ex, co, ev in (("country", "", "Germany", 7, 3, 2), ("country", "", "United States", 4, 0, 0), ("city", "Stuttgart", "Germany", 5, 2, 1),
                                                    ("city", "Birmingham", "United Kingdom", 2, 0, 0), ("city", "Birmingham", "United States", 3, 1, 0),
                                                    ("topic", "Microsoft Teams", "Germany", 6, 1, 0), ("topic", "SharePoint", "Germany", 8, 2, 0),
                                                    ("topic", "Microsoft Power Platform Center of Excellence", "United Kingdom", 5, 0, 0)):
                t = M.directory_place_title(lang, kind, label, place, ex, co)
                d = M.directory_place_desc(lang, kind, label, place, ex, co, ev)
                full = G.seo_title(t)
                self.assertLessEqual(len(BRAND.findall(full)), 1, full)
                self.assertLessEqual(len(full), 70, full)
                self.assertTrue(80 <= len(d) <= 155, (len(d), d))
                self.assertNotIn(t, seen); seen.add(t)
                self.assertNotIn(d, seen); seen.add(d)
                self.assertIn(label if kind == "topic" else place, t if kind != "city" else t + d)
        t = M.directory_place_title("en", "city", "Stuttgart", "Germany", 5, 2)
        self.assertEqual(t, "M365 Experts & Companies in Stuttgart, Germany")
        self.assertEqual(M.directory_place_title("en", "country", "", "Germany", 7, 3), "Microsoft 365 Experts & Companies in Germany")
        self.assertEqual(M.directory_place_title("en", "country", "", "Spain", 0, 2), "Microsoft 365 Companies in Spain")
        self.assertIsNone(M.directory_place_title("fr", "country", "", "France", 1, 1))
        self.assertIsNone(M.directory_place_desc("fr", "country", "", "France", 1, 1, 1))

    def test_eigener_einleitungstext_hat_vorrang(self):
        intro = "Germany has one of the most active Microsoft 365 communities in Europe, with consultants, trainers and product teams in every major city. This page lists them."
        d = M.directory_place_desc("en", "country", "", "Germany", 7, 3, 2, intro)
        self.assertTrue(d.startswith("Germany has one of the most active"), d)
        self.assertLessEqual(len(d), 155)
        self.assertEqual(M.directory_place_desc("en", "country", "", "Germany", 1, 0, 0, "kurz"), M.directory_place_desc("en", "country", "", "Germany", 1, 0, 0))


class Textbildner(unittest.TestCase):
    def test_lead_text_ganze_saetze(self):
        s = "First sentence is here. Second sentence follows right after it. Third sentence is far too long to fit into the remaining space of the snippet budget we have."
        self.assertEqual(M.lead_text(s, 70), "First sentence is here. Second sentence follows right after it.")
        self.assertEqual(M.lead_text("Kurz.", 155), "Kurz.")

    def test_lead_text_schnitt_an_satzfuge(self):
        s = "A technique that tries many algorithms and settings on a dataset in parallel and returns the best-performing model for a defined prediction target, ignoring everything else about the data"
        out = M.lead_text(s, 120)
        self.assertTrue(out.endswith("."), out)
        self.assertLessEqual(len(out), 120)
        self.assertFalse(out.endswith("and."), out)

    def test_lead_text_ohne_satzfuge_mit_auslassung(self):
        out = M.lead_text("x" * 40 + " " + "y" * 200, 100)
        self.assertTrue(out.endswith("…") and len(out) <= 100, out)

    def test_build_desc_fuellt_kurze_texte_auf(self):
        d = M.build_desc("Kurz und knapp.", "Fakten und verwandte Themen auf M365.FM.", "", 10, 155)
        self.assertEqual(d, "Kurz und knapp.")   # schon lang genug: kein Anhang
        d = M.build_desc("Kurz und knapp.", "Fakten und verwandte Themen auf M365.FM.")
        self.assertEqual(d, "Kurz und knapp. Fakten und verwandte Themen auf M365.FM.")
        d = M.build_desc("x" * 150, "Anhang der nicht mehr passt.")
        self.assertNotIn("Anhang", d)


if __name__ == "__main__":
    unittest.main()
