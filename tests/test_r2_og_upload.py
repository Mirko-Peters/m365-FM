"""Teilen-Bilder nach R2: generate_og.py legt sie unter r2img/og/ ab (nicht mehr in docs/), tools/r2_og_upload.py gleicht direkt mit dem
Bucket ab (ETag = MD5) und laedt nur fehlende/geaenderte Bilder mit image/png und 1 Tag Cache; nichts wird geloescht. Auf main
(OG_REQUIRED=1) haelt jeder Fehler den Deploy auf, damit og:image nie ins Leere zeigt."""
import hashlib, importlib, json, os, sys, tempfile, types, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tests"))
from test_r2_pages_upload import FakeS3   # noqa: E402

CREDS = {"R2_ACCOUNT_ID": "a", "R2_BUCKET": "b", "R2_ACCESS_KEY_ID": "k", "R2_SECRET_ACCESS_KEY": "s"}


class EtagS3(FakeS3):
    """Wie R2: Liste mit ETag (MD5 einfacher PUTs) und gemerktem Cache-Control."""
    def put_object(self, Bucket, Key, Body, ContentType, CacheControl, Metadata=None):
        super().put_object(Bucket, Key, Body, ContentType, CacheControl, Metadata)
        self.obj[Key]["cc"] = CacheControl
    def list_objects_v2(self, Bucket, Prefix, MaxKeys, ContinuationToken=None):
        r = super().list_objects_v2(Bucket, Prefix, MaxKeys, ContinuationToken)
        for o in r["Contents"]: o["ETag"] = '"' + hashlib.md5(self.obj[o["Key"]]["body"]).hexdigest() + '"'
        return r


def run_upload(src, s3, creds=True, required=False):
    fake = types.ModuleType("boto3"); fake.client = lambda *a, **k: s3
    old_mod, old_env = sys.modules.get("boto3"), dict(os.environ)
    sys.modules["boto3"] = fake
    for k in [*CREDS, "OG_REQUIRED"]: os.environ.pop(k, None)
    os.environ.update({**(CREDS if creds else {}), **({"OG_REQUIRED": "1"} if required else {})})
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
        self.src, self.s3 = t / "r2img", EtagS3()
        for rel, body in {"og/index.png": b"A", "og/entity/teams.png": b"B", "og/de/show/x.png": b"C"}.items():
            p = self.src / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(body)
    def tearDown(self): self.tmp.cleanup()

    def test_schluessel_typ_cache_und_nur_aenderungen(self):
        self.assertEqual(run_upload(self.src, self.s3), 0)
        self.assertEqual(sorted(self.s3.obj), ["og/de/show/x.png", "og/entity/teams.png", "og/index.png"])
        o = self.s3.obj["og/entity/teams.png"]
        self.assertEqual((o["ct"], o["cc"], o["body"]), ("image/png", "public, max-age=86400", b"B"))
        self.s3.log.clear()
        (self.src / "og/index.png").write_bytes(b"A2")
        self.assertEqual(run_upload(self.src, self.s3), 0)
        self.assertEqual(self.s3.log, [("put", "og/index.png")])   # nur das geaenderte Bild

    def test_abgleich_mit_dem_bucket_statt_cache(self):
        run_upload(self.src, self.s3)
        del self.s3.obj["og/entity/teams.png"]; self.s3.log.clear()   # im Bucket verloren: wird neu geladen
        self.assertEqual(run_upload(self.src, self.s3), 0)
        self.assertEqual(self.s3.log, [("put", "og/entity/teams.png")])

    def test_nichts_geloescht(self):
        run_upload(self.src, self.s3)
        (self.src / "og/de/show/x.png").unlink()
        self.assertEqual(run_upload(self.src, self.s3), 0)
        self.assertIn("og/de/show/x.png", self.s3.obj)   # Bild einer entfernten Seite bleibt im Bucket

    def test_fehler_haelt_deploy_auf_und_rest_folgt(self):
        self.s3.fail_put = {"og/entity/teams.png"}
        self.assertEqual(run_upload(self.src, self.s3, required=True), 1)
        self.assertEqual(run_upload(self.src, self.s3, required=False), 0)   # ausserhalb von main nur ein Hinweis
        self.s3.fail_put = set(); self.s3.log.clear()
        self.assertEqual(run_upload(self.src, self.s3, required=True), 0)
        self.assertEqual(self.s3.log, [("put", "og/entity/teams.png")])

    def test_ohne_zugangsdaten_oder_bilder(self):
        self.assertEqual(run_upload(self.src, self.s3, creds=False), 0); self.assertEqual(self.s3.obj, {})
        self.assertEqual(run_upload(self.src, self.s3, creds=False, required=True), 1)
        self.assertEqual(run_upload(self.src / "fehlt", self.s3, required=True), 1)


class GenerateOgTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); t = self.t = Path(self.tmp.name)
        self.docs = t / "docs"; (self.docs / "assets").mkdir(parents=True)
        (self.docs / "assets" / "og-default.png").write_bytes(b"DEFAULT")
        self.items = [{"path": "og/entity/teams.png", "title": "Teams", "lang": "en", "seed": "x", "cover": None},
                      {"path": "og/entity/viva.png", "title": "Viva", "lang": "en", "seed": "y", "cover": None}]
        (self.docs / "og-manifest.json").write_text(json.dumps(self.items))
        sys.modules.pop("generate_og", None); sys.path.insert(0, str(ROOT))
        try: self.G = importlib.import_module("generate_og")
        finally: sys.path.remove(str(ROOT))
        self.G.DOCS, self.G.OUT, self.G.__file__ = self.docs, t / "r2img", str(t / "generate_og.py")   # Cache (.ogcache) im Testordner
    def tearDown(self): self.tmp.cleanup()

    def test_bilder_landen_in_r2img_nicht_in_docs(self):
        cache = self.t / ".ogcache"; cache.mkdir()
        for it in self.items:
            key = hashlib.sha1(json.dumps([it, self.G.CARD_VERSION], sort_keys=True, ensure_ascii=False).encode()).hexdigest()
            (cache / (key + ".png")).write_bytes(b"CACHED")   # Treffer im Cache: kein Browser noetig
        self.G.main()
        self.assertEqual((self.t / "r2img" / "og/entity/teams.png").read_bytes(), b"CACHED")
        self.assertFalse((self.docs / "og").exists())

    def test_fallback_only_ohne_browser(self):
        self.G.main(fallback_only=True)
        for it in self.items: self.assertEqual((self.t / "r2img" / it["path"]).read_bytes(), b"DEFAULT")


if __name__ == "__main__":
    unittest.main()
