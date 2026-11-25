"""tools/r2_upload.py --recopy-escaped (Ladezeit 27.11.2026, Punkt 5): maskiert kopierte Bilder ('&amp;' im Schluessel), deren Masse nicht zur
verlangten Groesse passen (Pexels 4665930: 1280x1600 statt 1200x675), mit der echten Adresse neu laden und unter einem NEUEN Schluessel ablegen.
Nichts wird ueberschrieben oder geloescht; nur der betroffene Eintrag in data/r2_map.json wird umgestellt. Alles offline (falsches S3, falsches HTTP)."""
import hashlib, io, json, shutil, sys, tempfile, unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
try:
    from PIL import Image
    import r2_upload as U
except ImportError:   # Pillow fehlt
    U = None

P = "https://img.m365.fm"
K = ("https://images.pexels.com/photos/4665930/pexels-photo-4665930.jpeg?auto=format%2Ccompress&amp;fm=webp&amp;fit=crop&amp;crop=faces%2Cedges"
     "&amp;w=1200&amp;h=675&amp;q=60&amp;cs=tinysrgb")
OLD = P + "/i/5254f600109b589b2c2d-w1600.webp"


def webp(w, h):
    im = Image.new("RGB", (w, h), (40, 120, 200))
    buf = io.BytesIO(); im.save(buf, "WEBP", quality=60); return buf.getvalue()


class NotFound(Exception):
    response = {"Error": {"Code": "404"}}


class FakeS3:
    def __init__(self, keys=()):
        self.keys, self.put, self.calls = set(keys), [], []
    def head_object(self, Bucket, Key):
        self.calls.append(("head", Key))
        if Key not in self.keys: raise NotFound()
        return {"ContentLength": 1634000}
    def put_object(self, **kw):
        self.calls.append(("put", kw["Key"])); self.put.append(kw); self.keys.add(kw["Key"])
    def __getattr__(self, name):   # jede andere Methode (delete_object, copy_object ...) waere ein Fehler
        def other(**kw): self.calls.append((name, kw.get("Key")))
        return other


@unittest.skipIf(U is None, "Pillow fehlt")
class Recopy(unittest.TestCase):
    def test_real_map_has_exactly_the_pexels_entry(self):
        done, dims = json.loads((ROOT / "data" / "r2_map.json").read_text("utf-8")), json.loads((ROOT / "data" / "r2_dims.json").read_text("utf-8"))
        c = U.recopy_candidates(done, dims)
        self.assertLessEqual(len(c), 1, c)
        if c:   # vor dem Workflow-Lauf; danach zeigt der Eintrag auf -r1200x675 und ist kein Kandidat mehr
            self.assertEqual(c, [K]); self.assertEqual(done[K], OLD)
        else:
            self.assertRegex(done[K], r"^https://img\.m365\.fm/i/5254f600109b589b2c2d-r\d+x\d+\.webp$")
            w, h = dims[done[K]]; self.assertLessEqual(w, 1200 * U.RECOPY_TOL); self.assertLess(abs(w / h - 1200 / 675), 0.2)
            self.assertIn(OLD, dims, "alte Masse bleiben (Objekt bleibt)")

    def test_requested_size_uses_unescaped_url(self):
        self.assertEqual(U.requested_size(K), (1200, 675))
        self.assertIsNone(U.requested_size("https://x/a.jpg?w=10"))
        self.assertIsNone(U.requested_size("https://x/a.jpg"))

    def test_candidates_only_escaped_and_off(self):
        done = {K: OLD, "https://images.pexels.com/a.jpeg?w=1200&h=675": P + "/i/a.webp",   # nicht maskiert: bleibt
                "https://images.pexels.com/b.jpeg?x=1&amp;w=1200&amp;h=675": P + "/i/b.webp",   # maskiert, passt schon
                "design/x.webp": P + "/x.webp"}
        dims = {OLD: [1280, 1600], P + "/i/a.webp": [3000, 4000], P + "/i/b.webp": [1200, 675]}
        self.assertEqual(U.recopy_candidates(done, dims), [K])

    def test_recopy_new_key_never_overwrites_and_repoints_only_entry(self):
        good = webp(1200, 675); seen = []
        def get(u): seen.append(u); return good, "image/webp"
        done = {K: OLD, "andere": OLD}; dims = {OLD: [1280, 1600]}
        s3 = FakeS3({"i/5254f600109b589b2c2d-w1600.webp"})
        moved, failed = U.recopy(s3, "b", done, dims, get=get)
        self.assertEqual(failed, [])
        self.assertEqual(seen, [U.fetch_url(K)]); self.assertNotIn("&amp;", seen[0])
        key = "i/" + hashlib.sha1(K.encode()).hexdigest()[:20] + "-r1200x675.webp"
        self.assertEqual(key, "i/5254f600109b589b2c2d-r1200x675.webp")
        self.assertEqual(s3.calls, [("head", key), ("put", key)], "erst pruefen, dann nur der neue Schluessel; nichts geloescht")
        self.assertEqual(s3.put[0]["ContentType"], "image/webp"); self.assertEqual(s3.put[0]["CacheControl"], "public, max-age=31536000, immutable")
        self.assertEqual(done[K], P + "/" + key); self.assertEqual(done["andere"], OLD, "nur der betroffene Eintrag")
        self.assertEqual(dims[P + "/" + key], [1200, 675]); self.assertEqual(dims[OLD], [1280, 1600], "alte Masse bleiben")
        self.assertEqual(moved[0][:4], (K, OLD, P + "/" + key, [1200, 675]))

    def test_existing_key_aborts_without_put(self):
        s3 = FakeS3({"i/5254f600109b589b2c2d-r1200x675.webp"})
        done = {K: OLD}; dims = {OLD: [1280, 1600]}
        moved, failed = U.recopy(s3, "b", done, dims, get=lambda u: (webp(1200, 675), "image/webp"))
        self.assertEqual(moved, []); self.assertEqual(len(failed), 1); self.assertIn("existiert schon", failed[0][1])
        self.assertEqual([c for c in s3.calls if c[0] != "head"], []); self.assertEqual(done[K], OLD)

    def test_still_wrong_size_or_head_error_keeps_old(self):
        done = {K: OLD}; dims = {OLD: [1280, 1600]}
        s3 = FakeS3()
        moved, failed = U.recopy(s3, "b", done, dims, get=lambda u: (webp(1280, 1600), "image/webp"))
        self.assertEqual((moved, done[K], s3.put), ([], OLD, [])); self.assertIn("daneben", failed[0][1])
        class Boom(FakeS3):
            def head_object(self, Bucket, Key): raise RuntimeError("AccessDenied")
        b = Boom()
        moved, failed = U.recopy(b, "b", done, dims, get=lambda u: (webp(1200, 675), "image/webp"))
        self.assertEqual((moved, b.put), ([], [])); self.assertIn("AccessDenied", failed[0][1], "unklarer Fehler beim Pruefen: kein Upload")

    def test_main_dry_run_and_apply_write_only_new_key(self):
        tmp = Path(tempfile.mkdtemp()); self.addCleanup(shutil.rmtree, tmp)
        m, d = tmp / "map.json", tmp / "dims.json"
        m.write_text(json.dumps({K: OLD, "https://x/y.png": P + "/i/y.webp"})); d.write_text(json.dumps({OLD: [1280, 1600]}))
        s3 = FakeS3({"i/5254f600109b589b2c2d-w1600.webp"})
        with mock.patch.object(U, "MAP", m), mock.patch.object(U, "DIMS", d), mock.patch.object(U, "s3_client", lambda: s3), \
                mock.patch.object(U, "http_get", lambda u, ua=None: (webp(1200, 675), "image/webp")), mock.patch.dict("os.environ", {"R2_BUCKET": "b"}):
            self.assertEqual(U.main_recopy(False), 0); self.assertEqual(s3.calls, []); self.assertEqual(json.loads(m.read_text())[K], OLD)
            self.assertEqual(U.main_recopy(True), 0)
        self.assertEqual([c for c in s3.calls if c[0] == "put"], [("put", "i/5254f600109b589b2c2d-r1200x675.webp")])
        self.assertEqual(json.loads(m.read_text())[K], P + "/i/5254f600109b589b2c2d-r1200x675.webp")
        self.assertEqual(json.loads(d.read_text())[P + "/i/5254f600109b589b2c2d-r1200x675.webp"], [1200, 675])


class RealMap(unittest.TestCase):
    """Der Blogbeitrag (Community-Export) traegt schon die alte R2-Adresse statt der Pexels-Adresse (Seitenbau-Pruefung 25.11.2026:
    /community/u/mirko-p/blog/stop-the-industrialization-.../ verwies weiter auf das 1,63-MB-Original). Der Eintrag R2-alt -> R2-neu in
    data/r2_map.json stellt auch diese Verweise um; Masse kommen dann aus r2_dims (1200x675)."""
    NEW = P + "/i/5254f600109b589b2c2d-r1200x675.webp"

    def test_old_r2_url_rewritten_with_new_dims(self):
        if str(ROOT) not in sys.path: sys.path.insert(0, str(ROOT))
        import site_r2 as R2, site_img_dims as DM
        self.assertEqual(R2.rewrite(f'<img src="{P}/i/5254f600109b589b2c2d.webp">'), f'<img src="{self.NEW}">')
        self.assertEqual(R2.rewrite(f'<img src="{self.NEW}">'), f'<img src="{self.NEW}">', "neue Adresse bleibt (kein zweites Umschreiben)")
        self.assertEqual(R2.rewrite(K), self.NEW)
        self.assertEqual(list(DM._dimensions(P + "/i/5254f600109b589b2c2d.webp")), [1200, 675])


class Workflow(unittest.TestCase):
    def test_r2_images_pushes_to_dispatch_branch(self):
        y = (ROOT / ".github" / "workflows" / "r2-images.yml").read_text("utf-8")
        self.assertIn("--recopy-escaped", y)
        self.assertNotIn("HEAD:main", y, "nie fest nach main: auf einem Branch gestartet bleibt die Zuordnung auf dem Branch")
        self.assertIn("github.ref_name", y)


if __name__ == "__main__":
    unittest.main()
