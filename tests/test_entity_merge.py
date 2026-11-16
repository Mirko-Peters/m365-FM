"""Zusammengefuehrte Entitaets-Dubletten (data/guest_merge.json "entities", Entscheidung Mirko 16.11.2026: die vier Paare aus
data/ontology_baseline.json). Die alte Kennung hat keine Seite und keinen Sitemap-Eintrag, /entity/<alt>/ leitet in allen Sprachen per 301
auf das Ziel, die D1-Fassung der alten Kennung wird beim Seitenbau uebersprungen und bekommt ueber /entities-src.json replaced_by,
und im Repo zeigt kein Verweis mehr auf die alte Kennung."""
import glob
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_learn as SLN   # noqa: E402
import site_links as SL   # noqa: E402
import site_podpage as PP   # noqa: E402
import site_sitemaps as SM   # noqa: E402
import ontology as ONT   # noqa: E402

D = ROOT / "data"
LG = ("de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")
MERGES = SLN.entity_merges()
EXPECTED = {"iot-hub-device-provisioning-service": "azure-iot-hub-device-provisioning-service", "oauth": "oauth-2-0",
            "overall-equipment-effectiveness": "oee", "jean-sebastien-duchene": "jean-sebastien-duche"}


def repo_ids():
    out = {}
    for f in ("entities.json", "guest_entities.json", "speaker_entities.json"):
        for e in json.loads((D / f).read_text("utf-8")):
            out.setdefault(e["id"], e)
    return out


class Daten(unittest.TestCase):
    def test_die_vier_paare(self):
        for old, new in EXPECTED.items():
            self.assertEqual(MERGES.get(old), new, old)

    def test_alte_kennung_weg_ziel_da(self):
        ids = repo_ids()
        for old, new in MERGES.items():
            self.assertNotIn(old, ids, f"{old} ist zusammengefuehrt und darf keinen eigenen Eintrag mehr haben")
            self.assertIn(new, ids, f"Ziel {new} fehlt")
            self.assertNotIn(new, MERGES, f"Ziel {new} ist selbst zusammengefuehrt (Kette)")

    def test_nichts_verloren(self):
        raw = json.loads((D / "guest_merge.json").read_text("utf-8"))["entities"]
        ids = repo_ids()
        for old, v in raw.items():
            self.assertEqual(v["was"]["id"], old)   # vollstaendige Altfassung bleibt erhalten
            self.assertTrue(v.get("why"))
            keep = ids[v["to"]]
            if v["was"].get("type") != "person":   # Basis-Entitaeten: Name als Alias oder gleicher Name, Belegfolgen uebernommen
                names = {keep["name"].lower(), *(a.lower() for a in keep.get("aliases") or [])}
                self.assertIn(v["was"]["name"].lower(), names)
                eps = set((keep.get("source") or {}).get("episodes") or [])
                self.assertTrue(set((v["was"].get("source") or {}).get("episodes") or []) <= eps, old)
                for k in ("wikidata", "wikipedia", "docs", "web"):
                    if v["was"].get(k):
                        self.assertTrue(keep.get(k), f"{v['to']}: {k} fehlt")
        self.assertEqual(ids["oee"]["wikipedia"], "https://en.wikipedia.org/wiki/Overall_equipment_effectiveness")

    def test_speaker_zeigt_auf_den_gast(self):
        sp = {s["name"]: s for s in json.loads((D / "speakers.json").read_text("utf-8"))["speakers"]}
        self.assertEqual(sp["Jean-Sébastien DUCHÊNE"]["id"], "jean-sebastien-duche")
        self.assertEqual(json.loads((D / "speaker_manual.json").read_text("utf-8"))["links"]["jean-sébastien duchêne"]["entity"], "jean-sebastien-duche")

    def test_vorschlaege_kommen_nicht_zurueck(self):
        for old, new in MERGES.items():
            f = ROOT / "imports" / "entities" / f"{old}.json"
            if f.exists():
                d = json.loads(f.read_text("utf-8"))
                self.assertEqual(d.get("merged_into"), new)
                self.assertNotEqual(str(d.get("status")).lower(), "approved")   # tools/import_entities.py nimmt nur approved

    def test_keine_verweise_mehr(self):
        rx = re.compile(r'(?<![a-z0-9-])(' + "|".join(map(re.escape, MERGES)) + r')(?![a-z0-9-])')
        bad = []
        for e in repo_ids().values():
            bad += [(e["id"], r) for r in e.get("rel") or [] if r[1] in MERGES]
            if e.get("replaced_by") in MERGES:
                bad.append((e["id"], "replaced_by"))
        for q in json.loads((D / "quotes.json").read_text("utf-8")):
            bad += [(q["id"], a) for a in q.get("about") or [] if a in MERGES]
        for f in glob.glob(str(ROOT / "shownotes" / "entities" / "*.json")):
            d = json.loads(Path(f).read_text("utf-8"))
            bad += [(f, x["slug"]) for k in ("entities", "new_entities") for x in d.get(k) or [] if x.get("slug") in MERGES]
            bad += [(f, a) for q in d.get("quotes") or [] for a in q.get("entities") or [] if a in MERGES]
        for pat in ("shownotes/site/*.md", "imports/blog/*/*.md", "imports/blog-queue/*/*.md"):
            for f in glob.glob(str(ROOT / pat)):
                s = Path(f).read_text("utf-8")
                for m in re.finditer(r"^\s*(?:entities|topics):\s*\[([^\]]*)\]", s, re.M):
                    bad += [(f, x) for x in rx.findall(m.group(1))]
                bad += [(f, x) for x in re.findall(r"/entity/(" + "|".join(map(re.escape, MERGES)) + r")/", s)]
        for sp in json.loads((D / "speakers.json").read_text("utf-8"))["speakers"]:
            if sp["id"] in MERGES:
                bad.append(("speakers.json", sp["id"]))
        sp_ = json.loads((D / "sponsorships.json").read_text("utf-8"))
        bad += [("sponsorships.json", x) for x in rx.findall(json.dumps(sp_))]
        self.assertEqual(bad, [])

    def test_ontologie_ohne_diese_dubletten(self):
        import tools.ontology_check as OC
        m = ONT.audit(OC.load_all())
        flat = {i for d in m["duplicate_names"] for i in d}
        self.assertFalse(flat & (set(MERGES) | set(MERGES.values())), m["duplicate_names"])
        base = json.loads((D / "ontology_baseline.json").read_text("utf-8"))
        self.assertFalse({i for d in base["duplicate_names"] for i in d} & set(MERGES), "erledigte Paare gehoeren nicht mehr in den Stand")
        self.assertEqual(ONT.problems(m, base), [])


class Weiterleitung(unittest.TestCase):
    TABLE = PP.redirect_table(*PP.table_inputs(), LG=LG, docs=Path(tempfile.mkdtemp()))[0]

    def test_alle_sprachen_auf_das_ziel(self):
        for old, new in MERGES.items():
            for pre in [""] + [f"/{l}" for l in LG]:
                self.assertEqual(self.TABLE.get(f"{pre}/entity/{old}"), f"{pre}/entity/{new}/", f"{pre}/entity/{old}")
                for p in (f"{pre}/entity/{old}", f"{pre}/entity/{old}/"):   # Nachbau des Site-Workers: ein Schritt, Regel vor der Seite
                    self.assertEqual(SL.rule_target(p, self.TABLE), f"{pre}/entity/{new}/", p)
                self.assertEqual(SL.rule_target(f"{pre}/entity/{new}/", self.TABLE), "", f"Ziel {pre}/entity/{new}/ leitet weiter")

    def test_sitemap_ohne_alte_kennung(self):
        B = "https://www.m365.fm"
        sm = [(f"{B}{pre}/entity/{i}/", "2026-11-16", None) for i in list(MERGES) + list(MERGES.values()) for pre in ["", "/de", "/ja"]]
        keep, gone = SM.drop_redirected(sm, self.TABLE)
        self.assertEqual(sorted(gone), sorted(f"{B}{pre}/entity/{i}/" for i in MERGES for pre in ["", "/de", "/ja"]))
        self.assertEqual(sorted(x[0] for x in keep), sorted(f"{B}{pre}/entity/{i}/" for i in MERGES.values() for pre in ["", "/de", "/ja"]))


class D1Fassung(unittest.TestCase):
    def test_alte_kennung_wird_nicht_gebaut_und_im_abgleich_ersetzt(self):
        items = [{"id": old, "data": {"name": "Alt " + old, "type": "concept"}} for old in MERGES] + \
                [{"id": new, "data": {"name": "Neu " + new, "type": "concept"}} for new in MERGES.values()]
        orig = SLN._fetch_json
        try:
            SLN._fetch_json = lambda url, timeout=120: {"items": items}
            ents = SLN.load_entities("https://api.example.test")
            src = dict(SLN.SRC_ENTS)
        finally:
            SLN._fetch_json = orig
        for old, new in MERGES.items():
            self.assertNotIn(old, ents, f"D1-Fassung von {old} darf keine Seite bekommen")
            self.assertIn(new, ents)
            self.assertEqual(src[old], {"id": old, "outdated": True, "replaced_by": new})   # Worker syncEntitiesFromSite: replaced_by wie im Formular
            self.assertNotIn("replaced_by", src[new])


if __name__ == "__main__":
    unittest.main()
