"""Purge des Zonen-Caches (tools/purge_changed.py, Ladezeit 27.11.2026): zone_url bildet genau die URL, die der Site-Worker abruft (gemeinsame Faelle
sitewrk/test/zone_cases.json); main_r2 und main_r2_upload leeren sie zusaetzlich zu /__r2f, aber nur, wenn der Zonen-Cache live an ist
(R2_ZONE_CACHE in sitewrk/wrangler.toml bzw. R2_ZONE_PURGE). MAX_URLS gilt fuer die gemeinsame Liste."""
import importlib.util, io, json, os, tempfile, unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://www.m365.fm"


def load():
    spec = importlib.util.spec_from_file_location("purge_changed_z", ROOT / "tools" / "purge_changed.py"); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


class FakeCF:
    def __init__(self): self.files, self.everything = [], 0
    def __call__(self, req, timeout=None):
        body = json.loads(req.data)
        if body.get("purge_everything"): self.everything += 1
        else: self.files += body["files"]
        return io.BytesIO(json.dumps({"success": True, "errors": []}).encode())


class ZoneUrlTest(unittest.TestCase):
    def test_shared_cases_with_worker(self):
        cases = json.loads((ROOT / "sitewrk" / "test" / "zone_cases.json").read_text("utf-8"))["cases"]
        self.assertGreaterEqual(len(cases), 10)
        m = load()
        for c in cases:
            self.assertEqual(m.zone_url(c["path"]), c["url"], c["path"])
        self.assertTrue(any("%25" in c["url"] for c in cases), "ein Fall mit % im Pfad")
        self.assertTrue(any("%D0" in c["url"] for c in cases), "ein Fall mit Unicode")

    def test_zone_on_from_wrangler_and_env(self):
        m = load()
        with tempfile.TemporaryDirectory() as d:
            w = Path(d) / "wrangler.toml"
            w.write_text('name = "x"\n[vars]\nR2_ZONE_CACHE = "1"\n[env.staging.vars]\nR2_ZONE_CACHE = "0"\n')
            with mock.patch.dict(os.environ, {}, clear=True): self.assertTrue(m.zone_on(str(w)))
            w.write_text('name = "x"\n[vars]\nR2_ZONE_CACHE = "0"\n[env.staging.vars]\nR2_ZONE_CACHE = "1"\n')
            with mock.patch.dict(os.environ, {}, clear=True): self.assertFalse(m.zone_on(str(w)), "nur der Live-Teil zaehlt")
            with mock.patch.dict(os.environ, {"R2_ZONE_PURGE": "1"}, clear=True): self.assertTrue(m.zone_on(str(w)))
            with mock.patch.dict(os.environ, {}, clear=True): self.assertFalse(m.zone_on(str(Path(d) / "fehlt.toml")))
        with mock.patch.dict(os.environ, {}, clear=True):
            self.assertFalse(m.zone_on(), "sitewrk/wrangler.toml: live R2_ZONE_CACHE = \"0\" (erst nach dem Staging-Nachweis und --remark-gone auf \"1\")")


class ZonePurgeTest(unittest.TestCase):
    def run_r2(self, urls, zone):
        m = load(); cf = FakeCF()
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "pend.json"; p.write_text(json.dumps({"all": False, "urls": urls, "hashes": "h"}))
            env = {"CLOUDFLARE_API_TOKEN": "t", "CF_ZONE_ID": "Z", "BASE": BASE, "R2_ZONE_PURGE": zone}
            with mock.patch.dict(os.environ, env, clear=True), mock.patch("urllib.request.urlopen", cf), mock.patch("time.sleep"):
                self.assertEqual(m.main_r2(str(p)), 0)
        return m, cf

    def test_step2_purges_zone_only_when_on(self):
        _m, cf = self.run_r2(["/fr/y/", "/ru/tag/облако/", "/x.json"], "1")
        self.assertEqual(sorted(cf.files), sorted([BASE + "/__r2f/fr/y/", BASE + "/__r2f/ru/tag/%D0%BE%D0%B1%D0%BB%D0%B0%D0%BA%D0%BE/", BASE + "/__r2f/x.json",
                                                   "https://img.m365.fm/pages/fr/y/index.html", "https://img.m365.fm/pages/ru/tag/%D0%BE%D0%B1%D0%BB%D0%B0%D0%BA%D0%BE/index.html",
                                                   "https://img.m365.fm/pages/x.json"]))
        _m, cf = self.run_r2(["/fr/y/"], "0")
        self.assertEqual(cf.files, [BASE + "/__r2f/fr/y/"], "Schalter aus: nur /__r2f")

    def test_max_urls_counts_both_lists(self):
        m = load(); m.MAX_URLS = 10; cf = FakeCF()
        with mock.patch.dict(os.environ, {"CLOUDFLARE_API_TOKEN": "t", "R2_ZONE_PURGE": "1", "BASE": BASE}, clear=True), mock.patch("urllib.request.urlopen", cf), mock.patch("time.sleep"):
            self.assertTrue(m.purge("Z", m.r2_urls([f"/p{i}/" for i in range(6)]), "t"))
        self.assertEqual(cf.everything, 1, "6 Adressen = 12 URLs > 10: einmal alles")

    def test_upload_step_purges_zone(self):
        m = load(); cf = FakeCF()
        with tempfile.TemporaryDirectory() as d:
            f = Path(d) / "ch.json"; f.write_text(json.dumps(["/fr/y/", "/fr/bild.png"]))
            with mock.patch.dict(os.environ, {"CLOUDFLARE_API_TOKEN": "t", "CF_ZONE_ID": "Z", "BASE": BASE, "R2_ZONE_PURGE": "1"}, clear=True), mock.patch("urllib.request.urlopen", cf), mock.patch("time.sleep"):
                self.assertEqual(m.main_r2_upload(str(f)), 0)
        self.assertEqual(sorted(cf.files), sorted([BASE + "/__r2f/fr/y/", "https://img.m365.fm/pages/fr/y/index.html"]), "Bilder nie")


if __name__ == "__main__":
    unittest.main()
