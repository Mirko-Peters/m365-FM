"""Teilen-Bilder nach R2: generate_og.py legt sie unter r2img/og/ ab (nicht mehr in docs/), tools/r2_og_upload.py laedt nur neue/geaenderte
mit Content-Type image/png und 1 Tag Cache, nichts wird geloescht, Fehlschlaege bleiben fuer den naechsten Lauf offen."""
import importlib, json, os, sys, tempfile, types, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tests"))
from test_r2_pages_upload import FakeS3   # noqa: E402

CREDS = {"R2_ACCOUNT_ID": "a", "R2_BUCKET": "b", "R2_ACCESS_KEY_ID": "k", "R2_SECRET_ACCESS_KEY": "s"}


class CCFakeS3(FakeS3):
    def put_object(self, Bucket, Key, Body, ContentType, CacheControl, Metadata=None):
        super().put_object(Bucket, Key, Body, ContentType, CacheControl, Metadata)
        self.obj[Key]["cc"] = CacheControl


def run_upload(src, man, s3, creds=True):
    fake = types.ModuleType("boto3"); fake.client = lambda *a, **k: s3
    old_mod, old_env = sys.modules.get("boto3"), dict(os.environ)
    sys.modules["boto3"] = fake
    for k in CREDS: os.environ.pop(k, None)
    os.environ.update({**(CREDS if creds else {}), "R2_OG_MANIFEST": str(man)})
    sys.path.insert(0, str(ROOT / "tools"))
    try:
        for m in ("r2_common", "r2_og_upload"): sys.modules.pop(m, None)
        return importlib.import_module("r2_og_upload").main(src)
    finally:
        sys.path.remove(str(ROOT / "tools"))
        if old_mod is None: sys.modules.pop("boto3", None)
        else: sys.modules["boto3"] = old_mod
        os.environ.clear(); os.environ.update(old_env)


class OgUploadTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); t = Path(self.tmp.name)
        self.src, self.man, self.s3 = t / "r2img", t / "r2_og.json", CCFakeS3()
        for rel, body in {"og/index.png": b"A", "og/entity/teams.png": b"B", "og/de/show/x.png": b"C"}.items():
            p = self.src / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(body)
    def tearDown(self): self.tmp.cleanup()

    def test_schluessel_typ_cache_und_nur_aenderungen(self):
        self.assertEqual(run_upload(self.src, self.man, self.s3), 0)
        self.assertEqual(sorted(self.s3.obj), ["og/de/show/x.png", "og/entity/teams.png", "og/index.png"])
        o = self.s3.obj["og/entity/teams.png"]
        self.assertEqual((o["ct"], o["cc"], o["body"]), ("image/png", "public, max-age=86400", b"B"))
        self.s3.log.clear()
        (self.src / "og/index.png").write_bytes(b"A2")
        self.assertEqual(run_upload(self.src, self.man, self.s3), 0)
        self.assertEqual(self.s3.log, [("put", "og/index.png")])   # nur das geaenderte Bild

    def test_nichts_geloescht_und_manifest_gekuerzt(self):
        run_upload(self.src, self.man, self.s3)
        (self.src / "og/de/show/x.png").unlink()
        self.assertEqual(run_upload(self.src, self.man, self.s3), 0)
        self.assertIn("og/de/show/x.png", self.s3.obj)   # Bild einer entfernten Seite bleibt im Bucket
        self.assertNotIn("og/de/show/x.png", json.loads(self.man.read_text()))

    def test_fehler_bleibt_offen_fuer_den_naechsten_lauf(self):
        self.s3.fail_put = {"og/entity/teams.png"}
        self.assertEqual(run_upload(self.src, self.man, self.s3), 1)
        self.assertNotIn("og/entity/teams.png", json.loads(self.man.read_text()))
        self.s3.fail_put = set(); self.s3.log.clear()
        self.assertEqual(run_upload(self.src, self.man, self.s3), 0)
        self.assertEqual(self.s3.log, [("put", "og/entity/teams.png")])

    def test_ohne_zugangsdaten_oder_ordner_kein_abbruch(self):
        self.assertEqual(run_upload(self.src, self.man, self.s3, creds=False), 0); self.assertEqual(self.s3.obj, {})
        self.assertEqual(run_upload(self.src / "fehlt", self.man, self.s3), 0)


class GenerateOgTest(unittest.TestCase):
    def test_bilder_landen_in_r2img_nicht_in_docs(self):
        with tempfile.TemporaryDirectory() as d:
            t = Path(d); docs = t / "docs"; (docs / "assets").mkdir(parents=True)
            (docs / "assets" / "og-default.png").write_bytes(b"DEFAULT")
            (docs / "og-manifest.json").write_text(json.dumps([{"path": "og/entity/teams.png", "title": "Teams", "lang": "en", "seed": "x", "cover": None}]))
            sys.modules.pop("generate_og", None); sys.path.insert(0, str(ROOT))
            try:
                G = importlib.import_module("generate_og")
            finally:
                sys.path.remove(str(ROOT))
            G.DOCS, G.OUT, G.__file__ = docs, t / "r2img", str(t / "generate_og.py")   # Cache (.ogcache) im Testordner
            cached = t / ".ogcache"; cached.mkdir()
            key = __import__("hashlib").sha1(json.dumps([json.loads((docs / "og-manifest.json").read_text())[0], G.CARD_VERSION], sort_keys=True, ensure_ascii=False).encode()).hexdigest()
            (cached / (key + ".png")).write_bytes(b"CACHED")   # Treffer im Cache: kein Browser noetig
            G.main()
            self.assertEqual((t / "r2img" / "og/entity/teams.png").read_bytes(), b"CACHED")
            self.assertFalse((docs / "og").exists())


if __name__ == "__main__":
    unittest.main()
