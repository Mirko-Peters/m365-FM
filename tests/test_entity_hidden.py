"""Ausgeblendete Entitaeten (data/entity_hidden.json, Entscheidung Mirko 17.11.2026: gokan-ozcifci, "Seite entfernen + Weiterleitung").
Die id bekommt nirgends eine Entitaet: nicht aus Basis, Gaesten, Speakern oder der D1-Fassung (site_learn.load_entities), nicht in guest_entities.json
(make_guest_entities), nicht im Gaeste-Verzeichnis; /entity/<id>/ leitet in allen Sprachen auf die Entitaetenuebersicht der Sprache; der Name bleibt in
der Folge einfacher Text. Mit leerer Liste (Rueckgaengig) ist alles wieder wie vorher (Gegenprobe)."""
import copy
import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_hidden as HID   # noqa: E402
import site_learn as SLN   # noqa: E402
import site_links as SL   # noqa: E402
import site_podpage as PP   # noqa: E402
import site_sidebar as SB   # noqa: E402

D = ROOT / "data"
ID = "gokan-ozcifci"
LG = ("de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")


def hide_file(ids):
    """Temporaere Liste statt data/entity_hidden.json (der Zwischenspeicher haengt an Pfad und Zeitstempel)."""
    f = Path(tempfile.mkdtemp()) / "entity_hidden.json"
    f.write_text(json.dumps({"_doc": "test", "ids": ids}), "utf-8")
    return mock.patch.object(HID, "FILE", f)


class Liste(unittest.TestCase):
    def test_datei(self):
        raw = json.loads((D / "entity_hidden.json").read_text("utf-8"))
        self.assertTrue(raw.get("_doc"))
        self.assertIn(ID, raw["ids"])
        self.assertEqual(len(raw["ids"]), len(set(raw["ids"])))
        for i in raw["ids"]:
            self.assertTrue(raw["why"].get(i), f"{i}: Begruendung fehlt")
        self.assertEqual(HID.ids(), frozenset(raw["ids"]))

    def test_fehlende_oder_defekte_datei_blendet_nichts_aus(self):
        with mock.patch.object(HID, "FILE", Path(tempfile.mkdtemp()) / "fehlt.json"):
            self.assertEqual(HID.ids(), frozenset())
        f = Path(tempfile.mkdtemp()) / "kaputt.json"
        f.write_text("{", "utf-8")
        with mock.patch.object(HID, "FILE", f):
            self.assertEqual(HID.ids(), frozenset())

    def test_gast_und_drop(self):
        self.assertTrue(HID.guest_hidden(ID))
        with hide_file([ID + "-guest"]):
            self.assertTrue(HID.guest_hidden(ID))   # id mit Suffix (Kollision mit Basis-Entitaet)
            self.assertFalse(HID.guest_hidden("anna"))
        self.assertEqual(HID.drop([{"id": ID}, {"id": "anna"}]), [{"id": "anna"}])


class Eintraege(unittest.TestCase):
    def test_quelldaten_haben_ihn_noch_die_leser_filtern(self):
        """Die Quelldateien bleiben unveraendert (Rueckgaengig = id aus der Liste nehmen); kein Leser darf ihn daraus uebernehmen."""
        src = [e["id"] for f in ("guest_entities.json", "speaker_entities.json") for e in json.loads((D / f).read_text("utf-8"))]
        self.assertIn(ID, src)
        with mock.patch.object(SLN, "_fetch_json", lambda *a, **k: {"items": []}):
            ents = SLN.load_entities("https://api.invalid")
        self.assertNotIn(ID, ents)
        self.assertNotIn(ID, SLN.ENTS)
        self.assertGreater(len(ents), 1000)

    def test_gegenprobe_ohne_liste_ist_er_da(self):
        with hide_file([]), mock.patch.object(SLN, "_fetch_json", lambda *a, **k: {"items": []}):
            self.assertIn(ID, SLN.load_entities("https://api.invalid"))

    def test_d1_fassung_wird_uebersprungen_und_markiert(self):
        d1 = {"items": [{"id": ID, "created": 1, "src": "human", "data": {"name": "Gokan Ozcifci", "type": "person", "desc": {"en": "x", "de": "y"}}}]}
        with mock.patch.object(SLN, "_fetch_json", lambda *a, **k: d1):
            ents = SLN.load_entities("https://api.invalid")
        self.assertNotIn(ID, ents)
        self.assertEqual(SLN.SRC_ENTS[ID], {"id": ID, "outdated": True})   # Worker-Abgleich setzt outdated in D1 (MCP, SEO, Events, Auto-Uebersetzung)

    def test_keine_beziehung_zeigt_auf_ihn(self):
        with mock.patch.object(SLN, "_fetch_json", lambda *a, **k: {"items": []}):
            ents = SLN.load_entities("https://api.invalid")
        for e in ents.values():
            self.assertNotIn(ID, [t for _, t in e.get("rel") or []], e["id"])

    def test_gast_entitaeten_werden_nicht_erzeugt(self):
        tmp = Path(tempfile.mkdtemp())
        shutil.copy(D / "entities.json", tmp / "entities.json")
        with mock.patch.object(PP, "D", tmp):
            out = PP.make_guest_entities()
            self.assertNotIn(ID, [e["id"] for e in out])
            self.assertNotIn(ID, [e["id"] for e in json.loads((tmp / "guest_entities.json").read_text("utf-8"))])
            self.assertGreater(len(out), 100)
            with hide_file([]):   # Gegenprobe
                self.assertIn(ID, [e["id"] for e in PP.make_guest_entities()])

    def test_sidebar_kennt_ihn_nicht(self):
        idx = SB.Index()
        self.assertNotIn(ID, idx.by)
        self.assertNotIn(ID, idx.all)
        self.assertNotIn(ID, [e["id"] for e in idx.match("Gokan Ozcifci talks about SharePoint AI.")])
        with hide_file([]):   # Gegenprobe: ohne Liste wird er erkannt
            self.assertIn(ID, [e["id"] for e in SB.Index().match("Gokan Ozcifci talks about SharePoint AI.")])


class Weiterleitung(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.T, cls.clash, cls.chains, cls.dropped = PP.redirect_table(*PP.table_inputs(), LG=LG, docs=Path(tempfile.mkdtemp()))

    def test_alle_sprachen_auf_die_uebersicht(self):
        self.assertEqual(self.T[f"/entity/{ID}"], "/entity/")
        for l in LG:
            self.assertEqual(self.T[f"/{l}/entity/{ID}"], f"/{l}/entity/", l)

    def test_ziel_ist_eine_seite_die_der_bau_erzeugt_und_keine_kette(self):
        for pre in [""] + [f"/{l}" for l in LG]:
            to = self.T[f"{pre}/entity/{ID}"]
            self.assertFalse(SL.rule_target(to, self.T), to)
            self.assertNotIn(to.rstrip("/"), self.T, f"{to} leitet selbst weiter")

    def test_nichts_leitet_auf_die_ausgeblendete_adresse(self):
        """Verweise anderer Tabelleneintraege auf /entity/<id>/ werden durch collapse auf das Endziel gekuerzt."""
        for old, to in self.T.items():
            if old.endswith(f"/entity/{ID}"):
                continue
            self.assertNotIn(f"/entity/{ID}", to, f"{old} -> {to}")

    def test_gastseite_leitet_auf_die_gaesteliste(self):
        self.assertEqual(self.T[f"/guests/{ID}"], "/show/guests/")
        self.assertTrue(any(g["slug"] == ID for g in PP.load("guests")))
        self.assertNotIn(ID, [g["slug"] for g in PP.table_inputs()[2]])   # Eingabe der Tabelle: nur sichtbare Gaeste

    def test_gegenprobe_ohne_liste_keine_weiterleitung(self):
        with hide_file([]):
            t = PP.redirect_table(*PP.table_inputs(), LG=LG, docs=Path(tempfile.mkdtemp()))[0]
        self.assertNotIn(f"/entity/{ID}", t)
        self.assertEqual(t[f"/guests/{ID}"], f"/show/guests/{ID}/")


class Folge(unittest.TestCase):
    """Folgenindex mit einem ausgeblendeten und einem sichtbaren Gast (erfundene Daten): der Name bleibt in eg (Gast-Liste der Folge, als Text),
    steht aber nicht in den Gast-Slugs der Folge (Register, Suche) und nicht in der Liste der sichtbaren Gaeste."""
    def idx(self):
        eps = [{"slug": "ep", "name": "SharePoint AI with Gokan Ozcifci and Anna Beispiel", "create_time": "2026-01-01T00:00:00", "published": True, "show_notes": "", "hidden": False}]
        guests = [{"slug": ID, "name": "Gokan Ozcifci"}, {"slug": "anna-beispiel", "name": "Anna Beispiel"}]
        load = lambda n: {"episodes": eps, "guests": guests}.get(n, [])
        PP._IDX.pop("https://test.invalid", None)
        with mock.patch.object(PP, "load", load), mock.patch.object(PP.SNT, "get", lambda *a, **k: None), mock.patch.object(PP, "spreaker_match", lambda *a, **k: ("", 9)):
            try:
                return PP.episode_index("https://test.invalid")
            finally:
                PP._IDX.pop("https://test.invalid", None)

    def test_name_bleibt_slug_nicht(self):
        ix = self.idx()
        self.assertEqual([g["slug"] for g in ix["eg"]["ep"]], [ID, "anna-beispiel"])   # Name wird erkannt (laengster Name zuerst)
        self.assertEqual(ix["items"][0]["guests"], ["anna-beispiel"])
        self.assertEqual([g["slug"] for g in ix["guests"]], ["anna-beispiel"])


class Podcastseiten(unittest.TestCase):
    """Echter Lauf von site_podpage.build (Podpage-Sicherung im Repo, ohne Netz und ohne Datei-Ausgabe; die Seitenvorlagen sind Attrappen) mit einer erfundenen
    Folge, die den Gast nennt: keine Gastseite, nicht in der Gaesteliste und der Sitemap, in der Folge nur als Text, Weiterleitungstabelle mit dem Eintrag."""
    @classmethod
    def setUpClass(cls):
        real = PP.load

        def load(n):
            d = real(n)
            if n == "episodes":
                e = copy.deepcopy(next(x for x in d if x.get("published") not in (False, "False")))
                e.update(slug="zz-hidden-guest-test", name="Zz Test with Gokan Ozcifci", show_notes="<p>Guest: Gokan Ozcifci and others.</p>", spreaker_id=None)
                return d + [e]
            return d
        cls.out, cls.sm = {}, []
        g = dict(BASE="https://www.m365.fm", write=lambda p, c: cls.out.__setitem__(p, c), page=lambda lang, t, d, u, body, *a, **k: body, header=lambda *a, **k: "", footer=lambda *a, **k: "",
                 footer_en=lambda *a, **k: "", sitemap=cls.sm, TODAY="2026-11-17", side=lambda *a, **k: "", LANGS={x: (x, x) for x in LG}, orig_alts={}, ep_about={}, posts_by_topic={})
        with mock.patch.object(PP, "load", load):
            PP._IDX.clear()
            try:
                PP.build(g)
            finally:
                PP._IDX.clear()

    def test_keine_gastseite_nur_weiterleitungsseite(self):
        stub = self.out[f"show/guests/{ID}/index.html"]
        self.assertIn('http-equiv="refresh" content="0;url=https://www.m365.fm/show/guests/"', stub)
        self.assertIn('name="robots" content="noindex"', stub)
        self.assertNotIn("Ozcifci", stub)
        self.assertIn("show/guests/index.html", self.out)   # die Liste selbst bleibt

    def test_nicht_in_liste_und_sitemap(self):
        self.assertNotIn(ID, self.out["show/guests/index.html"])
        self.assertFalse([u for u, _, _ in self.sm if ID in u], "Sitemap")
        self.assertEqual([k for k, v in self.out.items() if ID in v and not k.endswith("redirects.json")], [], "keine Seite verweist mehr auf die ausgeblendete id")

    def test_folge_nennt_den_namen_als_text(self):
        b = self.out["show/episodes/zz-hidden-guest-test/index.html"]
        self.assertIn("<h2>Guests</h2><ul><li>Gokan Ozcifci</li></ul>", b)
        self.assertNotIn(f"/entity/{ID}", b)
        self.assertNotIn(f"guests/{ID}", b)

    def test_weiterleitungstabelle(self):
        t = json.loads(self.out["show/redirects.json"])
        for l in LG:
            self.assertEqual(t[f"/{l}/entity/{ID}"], f"/{l}/entity/")
        self.assertEqual(t[f"/entity/{ID}"], "/entity/")


class Speaker(unittest.TestCase):
    def test_build_speakers_schreibt_ihn_nicht(self):
        """tools/build_speakers.py (Programme der M365Con) in ein Wegwerf-Verzeichnis: weder Speaker-Eintrag (data/speakers.json, vom Worker gelesen)
        noch Speaker-Entitaet; Gegenprobe ohne Liste. Die uebrigen Speaker bleiben."""
        sys.path.insert(0, str(ROOT / "tools"))
        import build_speakers as BS
        src = ("entities.json", "guest_entities.json", "speaker_manual.json", "m365con_program.json", "m365con_program_2026.json", "m365con_program_dach.json")

        def run(ids):
            tmp = Path(tempfile.mkdtemp())
            for f in src:
                if (D / f).exists():
                    shutil.copy(D / f, tmp / f)
            with hide_file(ids), mock.patch.object(BS, "D", tmp):
                BS.main()
            return ([x["id"] for x in json.loads((tmp / "speakers.json").read_text("utf-8"))["speakers"]], [e["id"] for e in json.loads((tmp / "speaker_entities.json").read_text("utf-8"))])
        sp, en = run([ID])
        self.assertNotIn(ID, sp)
        self.assertNotIn(ID, en)
        sp0, _ = run([])
        self.assertIn(ID, sp0)   # Gegenprobe (die Speaker-Entitaet entfaellt auch ohne Liste: er ist schon als Gast eine Entitaet, "existing")
        self.assertEqual(len(sp0) - 1, len(sp))


if __name__ == "__main__":
    unittest.main()
