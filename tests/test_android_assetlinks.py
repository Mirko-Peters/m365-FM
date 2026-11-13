"""Android-Huelle (android/mvp-tracker): Digital Asset Links nur mit gueltigem Fingerabdruck, Link-Vorbefuellung im Tracker."""
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import site_contributor

FP = ":".join(["AB"] * 32)


class AssetLinksTest(unittest.TestCase):
    def test_empty_or_invalid_gives_no_file(self):
        for cfg in (None, {}, {"sha256_cert_fingerprints": []}, {"sha256_cert_fingerprints": ["TODO", "AA:BB"]}):
            self.assertIsNone(site_contributor.assetlinks(cfg))

    def test_valid_fingerprint(self):
        out = site_contributor.assetlinks({"sha256_cert_fingerprints": [FP.lower(), FP, "kaputt"]})
        self.assertEqual(len(out), 1)
        self.assertEqual(out[0]["relation"], ["delegate_permission/common.handle_all_urls"])
        t = out[0]["target"]
        self.assertEqual((t["namespace"], t["package_name"]), ("android_app", "fm.m365.contributor"))
        self.assertEqual(t["sha256_cert_fingerprints"], [FP], "kleingeschrieben wird normalisiert, doppelte und ungueltige fallen weg")

    def test_repo_config_has_no_invented_value(self):
        cfg = json.loads((ROOT / "data" / "android_app_links.json").read_text("utf-8"))
        self.assertEqual(cfg["package"], "fm.m365.contributor")
        self.assertEqual(cfg["sha256_cert_fingerprints"], [], "Fingerabdruck erst nach dem ersten Play-Upload eintragen")

    def build(self, cfg):
        written = {}
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            (root / "data").mkdir()
            if cfg is not None:
                (root / "data" / "android_app_links.json").write_text(json.dumps(cfg), "utf-8")
            g = {"BASE": "https://www.m365.fm", "write": lambda p, c: written.update({p: c}), "header": lambda *_: "", "footer": lambda *_: "",
                 "page": lambda lang, title, desc, url, body, **kw: body, "community_tags": lambda lang: "", "COMMUNITY_API": "https://api-dub.m365.fm",
                 "CI": {"en": {}}, "langs": ["en"], "ROOT": root}
            site_contributor.build(g)
        return written

    def test_build_writes_assetlinks_only_with_fingerprint(self):
        self.assertNotIn(".well-known/assetlinks.json", self.build({"sha256_cert_fingerprints": []}))
        self.assertNotIn(".well-known/assetlinks.json", self.build(None))
        w = self.build({"sha256_cert_fingerprints": [FP]})
        self.assertEqual(json.loads(w[".well-known/assetlinks.json"])[0]["target"]["sha256_cert_fingerprints"], [FP])


class SharePrefillTest(unittest.TestCase):
    def test_tracker_reads_link_parameter_only_https(self):
        js = (ROOT / "assets" / "mvp-tracker.js").read_text("utf-8")
        self.assertIn('get("link")', js)
        self.assertIn("https:", js.split('get("link")', 1)[1][:80])
        self.assertNotIn("innerHTML", js)


if __name__ == "__main__":
    unittest.main()
