"""K41/C: Das Such-Manifest traegt den Datenstand der Exporte ("fetched", site_fetch.data_time = Abruf am Anfang des Baus), nicht nur das
Ende des Baus ("build"). Der Worker (search.js searchBlockActive) hebt Suchsperren nach Kontoloeschung, Adresswechsel oder Freigabe eines
Personen-Merkers nur mit fetched nach der Sperre auf; ohne fetched bleibt gesperrt."""
import datetime as dt, json, os, sys, tempfile, time, unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_fetch as SF   # noqa: E402
import site_search as SS   # noqa: E402

API = "https://api.example"


def iso_ts(s):
    return dt.datetime.strptime(s, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=dt.timezone.utc).timestamp()


class FetchedTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.saved = (dict(SF._MEM), dict(SF._STATE), dict(SF._TIME), SF.CACHE)
        SF._MEM.clear(); SF._STATE.clear(); SF._TIME.clear(); SF.CACHE = Path(self.tmp.name)

    def tearDown(self):
        mem, state, times, cache = self.saved
        SF._MEM.clear(); SF._MEM.update(mem); SF._STATE.clear(); SF._STATE.update(state); SF._TIME.clear(); SF._TIME.update(times); SF.CACHE = cache
        self.tmp.cleanup()

    def fetch_all(self, fail=()):
        def http(url, timeout, tries):
            return (None, "down") if any(url.endswith(p) for p in fail) else ({"items": []}, None)
        with patch.object(SF, "_http", side_effect=http):
            for p in SF.ESSENTIAL: SF.fetch(API + p)

    def test_fetched_ist_der_abruf_am_anfang_nicht_das_ende_des_baus(self):
        before = time.time()
        with patch.object(SF.time, "time", return_value=before - 3600):   # Exporte vor einer Stunde geholt, Bau endet jetzt
            self.fetch_all()
        m = SS.manifest([], 1)
        self.assertIn("fetched", m)
        self.assertLessEqual(iso_ts(m["fetched"]), before - 3600)
        self.assertGreater(iso_ts(m["build"]), iso_ts(m["fetched"]) + 3000, "build (Ende) liegt nach fetched (Abruf)")

    def test_ohne_pflicht_export_kein_fetched(self):
        self.fetch_all(fail=("/api/profiles/export",))   # ausgefallen, kein Cache (nur data/members_export.json als Rueckfall)
        self.assertIsNone(SF.data_time())
        self.assertNotIn("fetched", SS.manifest([], 1), "ohne fetched bleibt der Worker gesperrt")

    def test_ohne_abruf_kein_fetched(self):
        self.assertNotIn("fetched", SS.manifest([], 1))

    def test_zwischengespeicherte_fassung_zaehlt_mit_ihrem_alter(self):
        self.fetch_all()   # schreibt den Cache
        f = SF.CACHE / SF._name(API + "/api/entity/export")
        old = time.time() - 7200; os.utime(f, (old, old))
        SF._MEM.clear(); SF._STATE.clear(); SF._TIME.clear()
        self.fetch_all(fail=("/api/entity/export",))
        self.assertEqual(SF.states()[API + "/api/entity/export"], "cache")
        self.assertLessEqual(SF.data_time(), old - SF.CACHE_MARGIN)
        self.assertLessEqual(iso_ts(SS.manifest([], 1)["fetched"]), old - SF.CACHE_MARGIN)


if __name__ == "__main__":
    unittest.main()
