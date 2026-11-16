"""Beziehungssaetze der Entitaetsseiten (site_relsent.py, data/relation_sentences.json): alle Beziehungen x en/de, Listen, Kuerzung "und N weitere",
Rueckfall bei fehlender Uebersetzung, keine Doppelung, Index-Regel (Schablonentext zaehlt nicht als eigener Text), Einbau in die Seite."""
import copy
import html
import json
import re
import sys
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))   # Nachbartest auch bei Aufruf als Modul
import site_relsent as RS   # noqa: E402
import site_index_rule as IR   # noqa: E402

PREDS = ("instance_of", "part_of", "broader", "developed_by", "related_to", "requires", "covers", "created_by", "organized_by", "similar_to")


def ent(i, t, name=None, rel=()):
    return {"id": i, "type": t, "name": name or i.replace("-", " ").title(), "desc": {"en": "", "de": ""}, "rel": [list(x) for x in rel]}


ENTS = {x["id"]: x for x in [
    ent("microsoft", "org", "Microsoft"), ent("contoso", "org", "Contoso"), ent("analytics-tool", "category", "Analytics and BI tool"),
    ent("microsoft-tool", "category", "Microsoft tool"), ent("odd-category", "category", "Odd category"),
    ent("power-platform", "platform", "Power Platform"), ent("fabric", "platform", "Microsoft Fabric"), ent("azure", "platform", "Azure"),
    ent("power-bi", "product", "Power BI", [("developed_by", "microsoft"), ("instance_of", "microsoft-tool"), ("instance_of", "analytics-tool"),
                                            ("part_of", "power-platform"), ("part_of", "fabric"), ("related_to", "dax")]),
    ent("dax", "concept", "DAX", [("related_to", "power-bi")]), ent("intune", "product", "Intune"),
    ent("pl-300", "cert", "PL-300", [("developed_by", "microsoft"), ("covers", "power-bi"), ("covers", "dax")]),
    ent("mirko", "person", "Mirko Peters", [("related_to", "power-bi")]),
    ent("m365fm", "media", "M365.FM", [("created_by", "mirko")]), ent("con", "event", "M365Con", [("organized_by", "mirko")]),
    ent("dev-job", "job", "Power BI developer", [("related_to", "power-bi"), ("related_to", "dax")]),
]}


def inverse(ents):
    inv = {}
    for e in ents.values():
        for p, to in e.get("rel", []):
            if to in ents:
                inv.setdefault(to, []).append((p, e["id"]))
    return inv


def render(lang, eid, ents=None, **k):
    ents = ents or ENTS
    e = ents[eid]
    return RS.build(lang, e, [tuple(x) for x in e.get("rel", []) if x[1] in ents], inverse(ents).get(eid, []), ents, lambda x: f"/entity/{x}/",
                    anchor=k.pop("anchor", lambda d, p: f"rel-{d}-{p}"), **k)


def text(h):
    """Satztext mit [Link]-Markierung, ohne Ueberschrift."""
    h = re.sub(r"<h2[^>]*>.*?</h2>", "", h)
    h = re.sub(r'<a href="[^"]*">(.*?)</a>', r"[\1]", h)
    return html.unescape(re.sub(r"<[^>]+>", " ", h)).split()


def plain(h):
    return " ".join(text(h))


class Templates(unittest.TestCase):
    def test_datei_gueltig_und_vollstaendig(self):
        d = json.loads(RS.FILE.read_text("utf-8"))
        langs = ("en", "de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")
        self.assertEqual(set(langs) - set(d), set(), "alle Seitensprachen haben einen Eintrag")
        en = d["en"]["t"]
        for p in PREDS:
            self.assertIn(f"f.{p}", en); self.assertIn(f"f.{p}", d["de"]["t"])
            if p not in RS.SYM:
                self.assertIn(f"i.{p}", en); self.assertIn(f"i.{p}", d["de"]["t"])
        self.assertEqual(set(en) - set(d["de"]["t"]), set(), "Deutsch deckt alle englischen Vorlagen ab")
        for l in langs:
            self.assertIn("_mt", d[l]); self.assertEqual(d[l]["_mt"], l not in ("en", "de"), f"{l}: maschinelle Uebersetzung gekennzeichnet")
            self.assertEqual(set(d[l]["t"]) - set(en), set(), f"{l}: keine Schluessel, die es im Englischen nicht gibt")
            for k, v in d[l]["t"].items():
                for s in ([v] if isinstance(v, str) else [v.get("one"), v.get("many")]):
                    if s:
                        self.assertIn("{x}", s, f"{l} {k}")
                        self.assertIn("{s}", s, f"{l} {k}")
                        self.assertNotIn("{{", s)

    def test_alle_praedikate_en_de_beide_richtungen(self):
        ents = {"a": ent("a", "concept", "Alpha"), "b": ent("b", "concept", "Beta"), "c": ent("c", "concept", "Gamma")}
        want = {
            "en": {"instance_of": ("Alpha belongs to the category [Beta].", "The category Beta includes [Alpha]."),
                   "part_of": ("Alpha is part of [Beta].", "Beta includes [Alpha]."),
                   "broader": ("Alpha falls under the broader topic [Beta].", "A narrower topic of Beta is [Alpha]."),
                   "developed_by": ("Alpha is developed by [Beta].", "Beta develops [Alpha]."),
                   "related_to": ("Alpha is closely related to [Beta].", "Beta is closely related to [Alpha]."),
                   "requires": ("Alpha requires [Beta].", "Beta is required by [Alpha]."),
                   "covers": ("Alpha covers [Beta].", "Beta is covered by [Alpha]."),
                   "created_by": ("Alpha was created by [Beta].", "Beta created [Alpha]."),
                   "organized_by": ("Alpha is organised by [Beta].", "Beta organises [Alpha]."),
                   "similar_to": ("Alpha is similar to [Beta].", "Beta is similar to [Alpha].")},
            "de": {"instance_of": ("Alpha gehört zur Kategorie [Beta].", "Zur Kategorie Beta gehört [Alpha]."),
                   "part_of": ("Alpha ist Teil von [Beta].", "Zu Beta gehört [Alpha]."),
                   "broader": ("Alpha gehört zum Oberbegriff [Beta].", "Ein Unterbegriff von Beta ist [Alpha]."),
                   "developed_by": ("Alpha wird von [Beta] entwickelt.", "Beta entwickelt [Alpha]."),
                   "related_to": ("Eng mit Alpha verwandt ist [Beta].", "Eng mit Beta verwandt ist [Alpha]."),
                   "requires": ("Alpha setzt [Beta] voraus.", "[Alpha] setzt Beta voraus."),
                   "covers": ("Alpha behandelt [Beta].", "[Alpha] behandelt Beta."),
                   "created_by": ("Alpha wurde von [Beta] ins Leben gerufen.", "Beta hat [Alpha] ins Leben gerufen."),
                   "organized_by": ("Alpha wird von [Beta] veranstaltet.", "Beta veranstaltet [Alpha]."),
                   "similar_to": ("Alpha ähnelt [Beta].", "Beta ähnelt [Alpha].")},
        }
        for lang, rows in want.items():
            for p, (fw, iv) in rows.items():
                es = copy.deepcopy(ents); es["a"]["rel"] = [[p, "b"]]
                self.assertEqual(plain(render(lang, "a", es)), fw, f"{lang} {p} Hinrichtung")
                self.assertEqual(plain(render(lang, "b", es)), iv, f"{lang} {p} Gegenrichtung")
                self.assertEqual(plain(render(lang, "c", es)), "", "ohne Beziehung kein Abschnitt")
                self.assertEqual(render(lang, "c", es), "")

    def test_mehrzahl(self):
        ents = {k: ent(k, "concept", k.upper()) for k in "abcd"}
        ents["a"]["rel"] = [["broader", "b"], ["broader", "c"]]
        self.assertEqual(plain(render("en", "a", ents)), "A falls under the broader topics [B] and [C].")
        self.assertEqual(plain(render("de", "a", ents)), "A gehört zu den Oberbegriffen [B] und [C].")
        ents["c"]["rel"] = [["broader", "b"]]; ents["d"]["rel"] = [["broader", "b"]]
        self.assertEqual(plain(render("en", "b", ents)), "Narrower topics of B include [A], [C] and [D].", "kein Oxford-Komma im Englischen der Seite")
        self.assertEqual(plain(render("de", "b", ents)), "Unterbegriffe von B sind [A], [C] und [D].")

    def test_einleitungssatz_power_bi(self):
        t = plain(render("en", "power-bi"))
        self.assertTrue(t.startswith("Power BI is an [analytics and BI tool] by [Microsoft] and part of [Power Platform] and [Microsoft Fabric]. Power BI is closely related to [DAX]."), t)
        self.assertNotIn("Microsoft tool", t, "Kategorie Microsoft-Werkzeug ist mit 'by Microsoft' schon gesagt")
        self.assertIn("Power BI is one of the topics of [Mirko Peters].", t)
        self.assertIn("Power BI is a typical topic for the role [Power BI developer].", t)
        self.assertIn("Power BI is an exam topic of the certification [PL-300].", t)
        d = plain(render("de", "power-bi"))
        self.assertTrue(d.startswith("Power BI ist ein [Analyse- und BI-Werkzeug] von [Microsoft] und Teil von [Power Platform] und [Microsoft Fabric]. Eng mit Power BI verwandt ist [DAX]."), d)
        self.assertIn("Mit Power BI beschäftigt sich [Mirko Peters].", d)
        self.assertIn("Wissen zu Power BI prüft die Zertifizierung [PL-300].", d)
        h = render("en", "power-bi")
        self.assertIn('an <a href="/entity/analytics-tool/">analytics and BI tool</a>', h, "Kategorie verlinkt, Artikel ausserhalb des Links")
        self.assertIn('<a href="/entity/microsoft/">Microsoft</a>', h)
        self.assertNotIn('href="/entity/power-bi/"', h, "die Seite verlinkt nicht auf sich selbst")

    def test_einleitung_ohne_kategorie_und_unbekannte_kategorie(self):
        es = copy.deepcopy(ENTS); es["power-bi"]["rel"] = [["developed_by", "microsoft"], ["instance_of", "microsoft-tool"], ["instance_of", "odd-category"]]
        self.assertEqual(plain(render("en", "power-bi", es)).split(". ")[:2], ["Power BI is a product by [Microsoft]", "Power BI belongs to the category [Odd category]"])
        self.assertTrue(plain(render("de", "power-bi", es)).startswith("Power BI ist ein Produkt von [Microsoft]. Power BI gehört zur Kategorie [Odd category]."))
        es["power-bi"]["rel"] = [["developed_by", "contoso"], ["instance_of", "microsoft-tool"]]
        self.assertTrue(plain(render("en", "power-bi", es)).startswith("Power BI is a [Microsoft tool] by [Contoso]."), "anderer Entwickler: Microsoft-Werkzeug bleibt")
        self.assertEqual(plain(render("en", "pl-300")), "PL-300 is a certification by [Microsoft]. PL-300 tests knowledge of [Power BI] and [DAX].")
        self.assertEqual(plain(render("de", "pl-300")), "PL-300 ist eine Zertifizierung von [Microsoft]. PL-300 prüft Wissen zu [Power BI] und [DAX].")
        self.assertEqual(plain(render("en", "azure")), "", "Plattform ohne Beziehungen: kein Satz ('Azure is a platform.' waere leer)")

    def test_gegenrichtung_firma(self):
        t = plain(render("en", "microsoft"))
        self.assertIn("Microsoft develops [Power BI].", t)
        self.assertIn("Microsoft issues the certification [PL-300].", t)
        self.assertIn("Microsoft vergibt die Zertifizierung [PL-300].", plain(render("de", "microsoft")))

    def test_person_medium_event_job(self):
        self.assertEqual(plain(render("en", "mirko")), "Mirko Peters works on [Power BI]. Mirko Peters created [M365.FM]. Mirko Peters organises [M365Con].")
        self.assertEqual(plain(render("de", "mirko")), "Mirko Peters beschäftigt sich mit [Power BI]. Mirko Peters hat [M365.FM] ins Leben gerufen. Mirko Peters veranstaltet [M365Con].")
        self.assertEqual(plain(render("en", "m365fm")), "M365.FM was created by [Mirko Peters].")
        self.assertEqual(plain(render("de", "con")), "M365Con wird von [Mirko Peters] veranstaltet.")
        self.assertEqual(plain(render("en", "dev-job")), "Typical topics for the role Power BI developer are [Power BI] and [DAX].")
        self.assertEqual(plain(render("de", "dev-job")), "Typische Themen für die Rolle Power BI developer sind [Power BI] und [DAX].")
        self.assertEqual(plain(render("en", "mirko", works_for="contoso")).split(". ")[0], "Mirko Peters works for [Contoso]")
        self.assertEqual(plain(render("de", "mirko", works_for="contoso")).split(". ")[0], "Mirko Peters arbeitet bei [Contoso]")

    def test_symmetrisch_einmal(self):
        t = plain(render("en", "dax"))
        self.assertEqual(t.count("[Power BI]"), 1, "DAX related_to Power BI und Power BI related_to DAX: ein Satz, ein Link")
        self.assertEqual(t.count("closely related"), 1)
        self.assertIn("DAX is an exam topic of the certification [PL-300].", t)

    def test_keine_doppelung_in_verwandt(self):
        es = copy.deepcopy(ENTS); es["power-bi"]["rel"] += [["related_to", "microsoft"], ["related_to", "fabric"]]
        t = plain(render("en", "power-bi", es))
        self.assertEqual(t.count("[Microsoft]"), 1, "schon im Einleitungssatz: nicht noch einmal als 'verwandt'")
        self.assertEqual(t.count("[Microsoft Fabric]"), 1)

    def test_kuerzung_und_sprungmarke(self):
        es = {"hub": ent("hub", "org", "Hub")}
        for n in range(10):
            es[f"p{n}"] = ent(f"p{n}", "product", f"P{n}", [("developed_by", "hub")])
        h = render("en", "hub", es)
        self.assertEqual(plain(h), "Hub develops [P0], [P1], [P2], [P3], [P4], [P5] and [4 more].")
        self.assertIn('<a href="#rel-i-developed_by">4 more</a>', h, "Sprung auf die vollstaendige Liste darunter")
        self.assertEqual(plain(render("de", "hub", es)), "Hub entwickelt [P0], [P1], [P2], [P3], [P4], [P5] und [4 weitere].")
        for k in ("p7", "p8", "p9"):
            del es[k]
        self.assertEqual(plain(render("en", "hub", es)), "Hub develops [P0], [P1], [P2], [P3], [P4], [P5] and [P6].", "bei CAP+1 alle Namen, nie 'and 1 more'")
        h = render("en", "hub", {**es, **{f"p{n}": ent(f"p{n}", "product", f"P{n}", [("developed_by", "hub")]) for n in range(7, 12)}}, anchor=None)
        self.assertIn(" and 6 more.", plain(h)); self.assertNotIn('href="#', h, "ohne Sprungziel kein toter Link")

    def test_kuerzung_dativ_deutsch(self):
        es = {"x": ent("x", "product", "X", [("developed_by", f"o{n}") for n in range(9)])}
        es.update({f"o{n}": ent(f"o{n}", "org", f"O{n}") for n in range(9)})
        self.assertEqual(plain(render("de", "x", es)), "X ist ein Produkt von [O0], [O1], [O2], [O3], [O4], [O5] und [3 weiteren].")
        es["x"]["type"] = "concept"
        self.assertEqual(plain(render("de", "x", es)), "X wird von [O0], [O1], [O2], [O3], [O4], [O5] und [3 weiteren] entwickelt.")
        self.assertEqual(plain(render("en", "x", es)), "X is developed by [O0], [O1], [O2], [O3], [O4], [O5] and [3 more].")

    def test_gegenrichtung_bekanntere_zuerst(self):
        es = {"hub": ent("hub", "org", "Hub")}
        for n in range(3):
            es[f"p{n}"] = ent(f"p{n}", "product", f"P{n}", [("developed_by", "hub")])
        self.assertEqual(plain(render("en", "hub", es, rank=lambda i: {"p2": 9, "p0": 1}.get(i, 0))), "Hub develops [P2], [P0] and [P1].")

    def test_escape(self):
        es = {"a": ent("a", "concept", "A <b>&"), "b": ent("b", "concept", 'B "x"', [("broader", "a")])}
        h = render("en", "b", es)
        self.assertIn("B &quot;x&quot; falls under", h); self.assertIn(">A &lt;b&gt;&amp;</a>", h); self.assertNotIn("<b>", h)

    def test_fehlende_uebersetzung_faellt_auf_liste_zurueck(self):
        d = copy.deepcopy(RS.data()); del d["fr"]["t"]["f.part_of"]; d["xx"] = {"t": {}}
        with mock.patch.object(RS, "_DATA", d):
            t = plain(render("fr", "power-bi"))
            self.assertNotIn("Power Platform", t, "ohne Vorlage kein Satz (die Liste darunter bleibt)")
            self.assertIn("[Microsoft] développe Power BI.", t)
            self.assertEqual(render("xx", "power-bi"), "", "Sprache ohne Vorlagen: kein Abschnitt")
            self.assertEqual(render("zz", "power-bi"), "", "unbekannte Sprache: kein Abschnitt")

    def test_andere_sprachen_grammatik(self):
        es = copy.deepcopy(ENTS); es["intune"]["rel"] = [["part_of", "azure"]]; es["dax"]["rel"] = [["similar_to", "power-bi"], ["similar_to", "intune"]]
        self.assertEqual(plain(render("fr", "intune", es)), "Intune fait partie d’[Azure]. Intune est comparable à [DAX].", "franzoesische Elision vor Vokal")
        self.assertEqual(plain(render("fr", "power-bi", es)).split(". ")[1], "Power BI fait partie de [Power Platform] et [Microsoft Fabric]")
        self.assertIn("[Power BI] e [Intune]", plain(render("es", "dax", es)), "spanisch: y -> e vor i-Laut")
        self.assertIn("[Intune] y [Power BI]", plain(render("es", "dax", {**es, "dax": {**es["dax"], "rel": [["similar_to", "intune"], ["similar_to", "power-bi"]]}})))
        self.assertIn("[Power Platform] dan [Microsoft Fabric]", plain(render("id", "power-bi")), "zwei Namen ohne Komma")
        self.assertIn("ו-<a", render("he", "power-bi").replace("<bdi>", ""), "hebraeisch: ו- vor lateinischem Namen")
        self.assertIn("<bdi>Power BI</bdi>", render("ar", "power-bi"), "RTL: Namen isoliert")
        self.assertIn("。Power BIは<a", render("ja", "power-bi"), "japanisch: Saetze ohne Leerzeichen aneinander")
        self.assertIn("Power BI은(는)", plain(render("ko", "power-bi")))
        self.assertNotIn("Microsoft tool", plain(render("fr", "power-bi")), "Doppelung Microsoft-Werkzeug/Microsoft entfaellt in allen Sprachen")
        for lang in ("fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"):
            h = render(lang, "power-bi")
            self.assertIn('<section class="en-rels" data-own-text="no"', h, lang)
            self.assertNotRegex(plain(h), r"\{\w+\}", f"{lang}: keine offenen Platzhalter")
        self.assertEqual(plain(render("pl", "m365fm")), "", "polnisch ohne sichere created_by-Vorlage: kein Satz, nur Liste")


class IndexRule(unittest.TestCase):
    def test_schablonentext_zaehlt_nicht(self):
        h = render("en", "power-bi")
        self.assertGreater(len(plain(h)), 100)
        self.assertEqual(IR.plain_len(h), 0, "data-own-text=no: zaehlt nie als eigener Text")
        self.assertEqual(IR.plain_text("<p>Eigener Text.</p>" + h + "<p>Mehr.</p>"), "Eigener Text. Mehr.")
        self.assertFalse(IR.long_enough(h * 30), "auch viele Saetze heben keine Seite in den Index")

    def test_entitaetsregel_unveraendert(self):
        import site_entities as SE
        e = {"id": "zz-test", "type": "product", "name": "ZZ", "desc": {"en": "x"}, "rel": [], "long": {"en": "a" * 2400}}
        with mock.patch.dict(SE.ENTS, {"zz-test": e}), mock.patch.dict(SE._LONG_IDX, {}, clear=True):
            self.assertEqual(SE.long_index_langs(e), [], "2400 Zeichen Langtext + Beziehungssaetze: weiterhin kein Index ueber die 2500-Regel")


class Page(unittest.TestCase):
    def test_seite_saetze_und_sprungziele(self):
        import test_event_entity_site as TE
        if not all(k in TE.FILE_ENTS for k in TE.NEED):
            self.skipTest("Entitaeten fehlen")
        ents = {k: copy.deepcopy(v) for k, v in TE.FILE_ENTS.items()}
        ents["mirko-peters"]["rel"] = [["related_to", "copilot"]]
        tmp, docs = TE.build_all([], ents, link=False)
        try:
            h = (docs / "entity/copilot/index.html").read_text("utf-8")
            self.assertIn('<section class="en-rels" data-own-text="no" aria-labelledby="en-rels-h"><h2 id="en-rels-h">Relationships</h2>', h)
            self.assertIn('is one of the topics of <a href="https://www.m365.fm/entity/mirko-peters/">Mirko Peters</a>.', h)
            self.assertRegex(h, r'<h3 id="en-rel-\d+">Related to</h3>', "vollstaendige Liste bleibt, mit Sprungziel")
            self.assertLess(h.index("en-rels"), h.index('class="en-rel"'), "Saetze oben, Liste unten")
            d = (docs / "de/entity/copilot/index.html").read_text("utf-8")
            self.assertIn("<h2 id=\"en-rels-h\">Beziehungen</h2>", d)
            self.assertRegex(d, r'Mit [^<]+ beschäftigt sich <a href="https://www.m365.fm/de/entity/mirko-peters/">Mirko Peters</a>\.')
        finally:
            tmp.cleanup()


if __name__ == "__main__":
    unittest.main()
