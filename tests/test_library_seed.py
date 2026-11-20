"""Bibliothek: Start-Eintraege (data/library_seed*/), Pruefer und gebaute Datei worker/src/library_seed.json."""
import json, subprocess, sys, unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent


class LibrarySeedTests(unittest.TestCase):
    def run_tool(self, *args):
        return subprocess.run([sys.executable, *args], cwd=ROOT, capture_output=True, text=True)

    def test_main_seed_is_valid(self):
        r = self.run_tool("tools/check_library_seed.py", "--per-kind", "10")
        self.assertEqual(r.returncode, 0, r.stdout)

    def test_extra_seed_is_valid_and_unique(self):
        r = self.run_tool("tools/check_library_seed.py", "--per-kind", "0", "--dir", "data/library_seed_mfg", "--also", "data/library_seed")
        self.assertEqual(r.returncode, 0, r.stdout)

    def test_bundle_is_current(self):
        r = self.run_tool("tools/build_library_seed.py", "--check")
        self.assertEqual(r.returncode, 0, r.stdout)

    def test_review_flags_follow_the_manifest(self):
        review = json.load(open(ROOT / "data/library_seed_review.json", encoding="utf-8"))
        items = json.load(open(ROOT / "worker/src/library_seed.json", encoding="utf-8"))
        n_rev = sum(len(json.load(open(f, encoding="utf-8"))) for d, ok in review.items() if ok is True for f in (ROOT / d).glob("*.json"))
        self.assertEqual(sum(1 for i in items if i["reviewed"]), n_rev)
        self.assertEqual(len({i["title"].lower() for i in items}), len(items))


if __name__ == "__main__":
    unittest.main()
