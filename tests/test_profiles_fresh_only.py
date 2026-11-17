"""Runde 7: Faellt der frische Profil-Export aus, entstehen keine Profilseiten aus alten Daten (data/members_export.json im Repo oder data/cache).
Der Bau bricht ab (Exit 1): kein Upload, kein Deploy, und r2_site_sync/r2_og_upload markieren die vorhandenen Profilseiten nicht massenhaft als
entfernt. Nur lokal (SITE_OFFLINE=1) entsteht ein Bau ohne Profilseiten."""
import contextlib, io, json, os, sys, tempfile, unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_fetch as SF   # noqa: E402
import site_members as MEM   # noqa: E402

API = "https://api.example.test"
URL = API + "/api/profiles/export"
OLD = {"people": [{"handle": "geloescht-x", "name": "Gelöschte Person", "headline": "Senior Consultant at Contoso", "about": "Mein Profiltext",
                   "img": 3, "items": [], "channels": []}], "orgs": []}


class FetchMembers(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); t = Path(self.tmp.name)
        self.cache, self.mark = t / "members_export.json", t / "r2img" / "profiles-export.json"
        self.cache.write_text(json.dumps(OLD, ensure_ascii=False), "utf-8")   # alte eingecheckte Fassung mit Personendaten

    def tearDown(self): self.tmp.cleanup()

    def run_fetch(self, export, state, offline="0"):
        err = io.StringIO()
        with mock.patch.object(MEM, "CACHE", self.cache), mock.patch.object(MEM, "MARK", self.mark), mock.patch.object(MEM, "_fetch_export", return_value=export), \
                mock.patch.object(SF, "states", return_value={URL: state}), mock.patch("time.sleep"), mock.patch.dict(os.environ, {"SITE_OFFLINE": offline}), \
                contextlib.redirect_stderr(err):
            try:
                return MEM.fetch_members(API), err.getvalue()
            except SystemExit as e:
                return ("exit", e.code), err.getvalue()

    def test_ausfall_baut_keine_profile_aus_der_repo_kopie(self):
        res, err = self.run_fetch(None, "fehlt")
        self.assertEqual(res, ("exit", 1), "Bau abgebrochen statt Profilseiten aus der alten Fassung")
        self.assertIn("Bau abgebrochen", err)
        self.assertEqual(json.loads(self.mark.read_text("utf-8")), {"state": "fehlt", "people": 0})
        self.assertIn("geloescht-x", self.cache.read_text("utf-8"), "die alte Datei wird beim Ausfall nicht angefasst (kein Rueckgriff, kein Ueberschreiben)")

    def test_alte_fassung_aus_data_cache_zaehlt_nicht(self):
        self.assertEqual(self.run_fetch(json.loads(json.dumps(OLD)), "cache")[0], ("exit", 1))

    def test_leerer_export_mit_fehlern_zaehlt_nicht(self):
        self.assertEqual(self.run_fetch({"people": [], "orgs": [], "failed": 2}, "frisch")[0], ("exit", 1))

    def test_lokal_offline_ohne_profilseiten(self):
        res, err = self.run_fetch(None, "fehlt", offline="1")
        self.assertEqual(res, ([], []))
        self.assertIn("SITE_OFFLINE", err)

    def test_frischer_export_ueberschreibt_die_repo_kopie_ohne_personendaten(self):
        fresh = {"people": [{"handle": "anna-b", "name": "Anna B.", "headline": "Architect", "about": "Text", "img": 1, "items": [], "channels": []}], "orgs": []}
        (people, _orgs), _ = self.run_fetch(fresh, "frisch")
        self.assertEqual([p["handle"] for p in people], ["anna-b"])
        raw = self.cache.read_text("utf-8")
        for v in ("anna-b", "Anna B.", "Architect", "geloescht-x", "Gelöschte Person", "Mein Profiltext"): self.assertNotIn(v, raw)
        self.assertEqual(json.loads(raw), MEM.repo_copy(fresh))


class Check(unittest.TestCase):
    def setUp(self):
        self.saved = (dict(SF._MEM), dict(SF._STATE), dict(SF._TIME))
        self.tmp = tempfile.TemporaryDirectory()
        (Path(self.tmp.name) / "members_export.json").write_text(json.dumps(OLD), "utf-8")
        self.cache_patch = mock.patch.object(SF, "CACHE", Path(self.tmp.name) / "cache"); self.cache_patch.start()

    def tearDown(self):
        self.cache_patch.stop(); self.tmp.cleanup()
        mem, state, times = self.saved
        SF._MEM.clear(); SF._MEM.update(mem); SF._STATE.clear(); SF._STATE.update(state); SF._TIME.clear(); SF._TIME.update(times)

    def check(self, profiles_state, offline="0"):
        SF._STATE.clear(); SF._STATE.update({API + p: "frisch" for p in SF.ESSENTIAL}); SF._STATE[URL] = profiles_state
        with mock.patch.dict(os.environ, {"SITE_OFFLINE": offline}), contextlib.redirect_stderr(io.StringIO()):
            try:
                return SF.check(API)
            except SystemExit as e:
                return ("exit", e.code)

    def test_ausgefallener_profil_export_bricht_ab_auch_mit_members_export_json(self):
        self.assertEqual(self.check("fehlt"), ("exit", 1))

    def test_nur_zwischengespeicherte_profile_brechen_ab(self):
        self.assertEqual(self.check("cache"), ("exit", 1))

    def test_frisch_laeuft(self):
        self.assertIs(self.check("frisch"), True)

    def test_offline_nur_warnung(self):
        self.assertIs(self.check("cache", offline="1"), False)


if __name__ == "__main__":
    unittest.main()
