"""tools/r2_pages_upload.py mit nachgebautem S3-Client: Reihenfolge, Content-Types, Manifest, Entfernt-Markierung, Purge-Liste."""
import importlib, json, os, sys, tempfile, types, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class FakeS3:
    def __init__(self):
        self.puts, self.copies, self.fail = [], [], set()
    def put_object(self, Bucket, Key, Body, ContentType, CacheControl):
        if Key in self.fail: raise RuntimeError("boom")
        self.puts.append((Key, ContentType))
    def copy_object(self, **kw):
        self.copies.append((kw["Key"], kw["Metadata"], kw["MetadataDirective"], kw["ContentType"]))


def run(src, env, s3):
    fake = types.ModuleType("boto3"); fake.client = lambda *a, **k: s3
    old_mod, old_argv, old_env = sys.modules.get("boto3"), sys.argv, dict(os.environ)
    sys.modules["boto3"] = fake; sys.argv = ["r2_pages_upload.py", str(src)]
    os.environ.update({"R2_ACCOUNT_ID": "a", "R2_BUCKET": "b", "R2_ACCESS_KEY_ID": "k", "R2_SECRET_ACCESS_KEY": "s", **env})
    try:
        sys.path.insert(0, str(ROOT / "tools")); m = importlib.import_module("r2_pages_upload"); m = importlib.reload(m)
        return m.main()
    finally:
        sys.path.remove(str(ROOT / "tools"))
        if old_mod is None: sys.modules.pop("boto3", None)
        else: sys.modules["boto3"] = old_mod
        sys.argv = old_argv; os.environ.clear(); os.environ.update(old_env)


def tree(root, files):
    for rel, body in files.items():
        p = root / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(body, encoding="utf-8")


class UploadTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); t = Path(self.tmp.name)
        self.docs, self.keep, self.man, self.changed = t / "docs", t / "r2out", t / "man.json", t / "changed.json"
        self.env = {"R2_MANIFEST": str(self.man), "R2_CHANGED_OUT": str(self.changed)}
    def tearDown(self): self.tmp.cleanup()

    def test_files_before_pages_types_and_manifest(self):
        tree(self.docs, {"index.html": "<h1>a</h1>", "de/x/index.html": "x", "assets/site.ab12cd34ef.css": "a{}", "feed.json": "{}", "cal/event.ics": "BEGIN", "og/a.png": "png"})
        s3 = FakeS3(); run(self.docs, self.env, s3)
        keys = [k for k, _ in s3.puts]
        last_file = max(i for i, k in enumerate(keys) if not k.endswith(".html")); first_page = min(i for i, k in enumerate(keys) if k.endswith(".html"))
        self.assertLess(last_file, first_page, "erst alle Dateien, dann Seiten")
        ct = dict(s3.puts)
        self.assertEqual(ct["pages/assets/site.ab12cd34ef.css"], "text/css; charset=utf-8"); self.assertEqual(ct["pages/cal/event.ics"], "text/calendar; charset=utf-8")
        self.assertEqual(ct["pages/og/a.png"], "image/png"); self.assertEqual(ct["pages/index.html"], "text/html; charset=utf-8")
        self.assertEqual(sorted(json.loads(self.changed.read_text())), sorted(["/", "/de/x/", "/assets/site.ab12cd34ef.css", "/feed.json", "/cal/event.ics", "/og/a.png"]))
        s3b = FakeS3(); run(self.docs, self.env, s3b); self.assertEqual(s3b.puts, [], "unveraendert = kein Upload")

    def test_tombstone_only_with_flag_and_keep_dir(self):
        tree(self.docs, {f"p{i}/index.html": str(i) for i in range(100)})
        tree(self.keep, {"moved.json": "{}"})
        run(self.docs, self.env, FakeS3())
        m = json.loads(self.man.read_text()); m["pages/moved.json"] = "x"; self.man.write_text(json.dumps(m))
        (self.docs / "p7" / "index.html").unlink()
        s3 = FakeS3(); run(self.docs, self.env, s3); self.assertEqual(s3.copies, [], "ohne R2_TOMBSTONE nichts markieren")
        s3 = FakeS3(); run(self.docs, {**self.env, "R2_TOMBSTONE": "1", "R2_KEEP_DIR": str(self.keep)}, s3)
        self.assertEqual([c[0] for c in s3.copies], ["pages/p7/index.html"], "nur die entfallene Seite, nicht die aus r2out/")
        self.assertEqual(s3.copies[0][1:], ({"gone": "1"}, "REPLACE", "text/html; charset=utf-8"))
        self.assertNotIn("pages/p7/index.html", json.loads(self.man.read_text())); self.assertIn("/p7/", json.loads(self.changed.read_text()))

    def test_tombstone_guard_on_incomplete_build(self):
        tree(self.docs, {f"p{i}/index.html": str(i) for i in range(100)})
        run(self.docs, self.env, FakeS3())
        for i in range(10): (self.docs / f"p{i}" / "index.html").unlink()   # 10 % weg
        s3 = FakeS3(); run(self.docs, {**self.env, "R2_TOMBSTONE": "1"}, s3)
        self.assertEqual(s3.copies, [], "mehr als 5 % auf einmal: nichts markieren")

    def test_failed_upload_stays_out_of_manifest(self):
        tree(self.docs, {"a.json": "{}", "b/index.html": "b"})
        s3 = FakeS3(); s3.fail.add("pages/a.json"); run(self.docs, self.env, s3)
        m = json.loads(self.man.read_text()); self.assertNotIn("pages/a.json", m); self.assertIn("pages/b/index.html", m)
        self.assertNotIn("/a.json", json.loads(self.changed.read_text()))


if __name__ == "__main__":
    unittest.main()
