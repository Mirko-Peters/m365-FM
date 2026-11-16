"""tools/r2_upload.py: Bilder beim Kopieren auf hoechstens 1600 px verkleinern, '&amp;' in Zuordnungs-Schluesseln,
--shrink fuer schon kopierte zu breite R2-Bilder (neuer Schluessel -w1600, Zuordnung umstellen, Masse ergaenzen).
Alles offline: falsches S3 und falsches HTTP."""
import hashlib
import io
import json
import shutil
import sys
import tempfile
import unittest
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


def img(w, h, fmt="JPEG", mode="RGB", **kw):
    im = Image.new(mode, (w, h), (40, 120, 200) if mode == "RGB" else (40, 120, 200, 128))
    # etwas Struktur, damit die Kodierer realistische Groessen liefern
    for x in range(0, w, max(1, w // 16)):
        for y in range(h):
            im.putpixel((x, y), (255, 255, 255) if mode == "RGB" else (255, 255, 255, 255))
    buf = io.BytesIO()
    im.save(buf, fmt, **kw)
    return buf.getvalue()


def size(data):
    with Image.open(io.BytesIO(data)) as im:
        return list(im.size)


class FakeS3:
    def __init__(self):
        self.put, self.calls = [], []

    def put_object(self, **kw):
        self.put.append(kw)
        self.calls.append("put_object")

    def __getattr__(self, name):   # jede andere Methode (z. B. delete_object) waere ein Fehler
        def other(**kw):
            self.calls.append(name)
        return other


class FakeHTTP:
    def __init__(self, files):
        self.files, self.asked = files, []

    def __call__(self, url):
        self.asked.append(url)
        if url not in self.files:
            raise OSError("404")
        return self.files[url]


@unittest.skipIf(U is None, "Pillow fehlt")
class Optimize(unittest.TestCase):
    def test_big_jpeg_is_resized_and_keeps_ratio(self):
        data, ct = U.optimize(img(3200, 2000), "image/jpeg")
        self.assertEqual(size(data), [1600, 1000])
        self.assertIn(ct, ("image/webp", "image/jpeg"))

    def test_portrait_is_bounded_by_height(self):
        data, ct = U.optimize(img(3409, 4261), "image/jpeg")
        self.assertEqual(size(data), [1280, 1600])

    def test_big_png_with_alpha_keeps_alpha(self):
        data, ct = U.optimize(img(2400, 1200, "PNG", "RGBA"), "image/png")
        self.assertEqual(size(data), [1600, 800])
        with Image.open(io.BytesIO(data)) as im:
            self.assertIn("A", im.mode)

    def test_webp_only_if_smaller_after_resize(self):
        real = U._encode
        fake = lambda im, fmt: (b"W" * 10**7) if fmt == "WEBP" else real(im, fmt)   # WebP kuenstlich groesser
        with mock.patch.object(U, "_encode", side_effect=fake):
            data, ct = U.optimize(img(3000, 1500), "image/jpeg")
        self.assertEqual(ct, "image/jpeg")
        self.assertEqual(size(data), [1600, 800], "auch ohne WebP verkleinert")

    def test_small_jpeg_not_resized_and_original_kept_if_webp_bigger(self):
        src = img(800, 600)
        data, ct = U.optimize(src, "image/jpeg")
        self.assertEqual(size(data), [800, 600])
        with mock.patch.object(U, "_encode", return_value=b"W" * (len(src) + 1)):
            self.assertEqual(U.optimize(src, "image/jpeg"), (src, "image/jpeg"))

    def test_small_webp_untouched(self):
        src = img(1200, 675, "WEBP")
        self.assertEqual(U.optimize(src, "image/webp"), (src, "image/webp"))

    def test_big_webp_resized(self):
        data, ct = U.optimize(img(4000, 2000, "WEBP"), "image/webp")
        self.assertEqual((size(data), ct), ([1600, 800], "image/webp"))

    def test_gif_svg_avif_pdf_untouched(self):
        gif = img(2400, 300, "GIF", "RGB")
        svg = b'<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="4000"></svg>'
        for data, ct in ((gif, "image/gif"), (svg, "image/svg+xml"), (b"x" * 500, "image/avif"), (b"%PDF" + b"x" * 500, "application/pdf")):
            self.assertEqual(U.optimize(data, ct), (data, ct))

    def test_animated_webp_untouched(self):
        frames = [Image.new("RGB", (2000, 1000), c) for c in ((255, 0, 0), (0, 255, 0))]
        buf = io.BytesIO()
        frames[0].save(buf, "WEBP", save_all=True, append_images=frames[1:], duration=100)
        src = buf.getvalue()
        self.assertEqual(U.optimize(src, "image/webp"), (src, "image/webp"))

    def test_broken_image_untouched(self):
        self.assertEqual(U.optimize(b"kein bild" * 50, "image/jpeg"), (b"kein bild" * 50, "image/jpeg"))


@unittest.skipIf(U is None, "Pillow fehlt")
class CopyOne(unittest.TestCase):
    def test_escaped_amp_is_fetched_unescaped_but_stored_as_key(self):
        u = "https://images.pexels.com/photos/1/p.jpeg?auto=format&amp;w=1200&amp;h=675"
        real = "https://images.pexels.com/photos/1/p.jpeg?auto=format&w=1200&h=675"
        http, s3, done, dims = FakeHTTP({real: (img(3409, 4261), "image/jpeg")}), FakeS3(), {}, {}
        U.copy_one(s3, "b", u, done, dims, get=http)
        self.assertEqual(http.asked, [real])
        self.assertEqual(list(done), [u], "Schluessel bleibt wie im HTML (site_r2.rewrite ersetzt Rohtext)")
        key = s3.put[0]["Key"]
        self.assertTrue(key.startswith("i/" + hashlib.sha1(u.encode()).hexdigest()[:20] + "."), key)
        self.assertEqual(done[u], f"{P}/{key}")
        self.assertEqual(dims[done[u]], [1280, 1600])
        self.assertEqual(size(s3.put[0]["Body"]), [1280, 1600])
        self.assertIn("immutable", s3.put[0]["CacheControl"])

    def test_plain_url_unchanged(self):
        self.assertEqual(U.fetch_url("https://a.example/x.png?a=1&b=2"), "https://a.example/x.png?a=1&b=2")

    def test_gif_copied_byte_for_byte(self):
        gif = img(2400, 300, "GIF")
        u = "https://img.podpage.com/x.gif"
        s3, done, dims = FakeS3(), {}, {}
        U.copy_one(s3, "b", u, done, dims, get=FakeHTTP({u: (gif, "image/gif")}))
        self.assertEqual(s3.put[0]["Body"], gif)
        self.assertEqual(s3.put[0]["ContentType"], "image/gif")
        self.assertTrue(s3.put[0]["Key"].endswith(".gif"))
        self.assertEqual(dims[done[u]], [2400, 300])

    def test_svg_copied_byte_for_byte(self):
        svg = b'<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="10"><rect width="4000" height="10"/></svg>'
        u = "https://example.com/logo.svg"
        s3, done = FakeS3(), {}
        U.copy_one(s3, "b", u, done, {}, get=FakeHTTP({u: (svg, "image/svg+xml")}))
        self.assertEqual((s3.put[0]["Body"], s3.put[0]["ContentType"]), (svg, "image/svg+xml"))

    def test_non_image_rejected(self):
        u = "https://example.com/x.jpg"
        with self.assertRaises(ValueError):
            U.copy_one(FakeS3(), "b", u, {}, {}, get=FakeHTTP({u: (b"<html>" * 50, "text/html")}))


@unittest.skipIf(U is None, "Pillow fehlt")
class Shrink(unittest.TestCase):
    BIG, BIG2, SMALL, TALL = f"{P}/i/aaa.webp", f"{P}/i/bbb.jpg", f"{P}/i/ccc.webp", f"{P}/i/ddd.webp"

    def data(self):
        done = {
            "https://images.pexels.com/p.jpeg?a=1&amp;w=1200": self.BIG,
            "https://images.pexels.com/p.jpeg?a=1&w=1200": self.BIG,   # zwei Schluessel, dieselbe R2-URL
            "https://m.media-amazon.com/images/I/x.jpg": self.BIG2,
            "https://img.podpage.com/small.png": self.SMALL,
            "https://img.podpage.com/tall.png": self.TALL,
            "https://img.podpage.com/anim.gif": f"{P}/i/eee.gif",
            "https://img.podpage.com/done.png": f"{P}/i/fff-w1600.webp",
            "design/local.webp": f"{P}/local/banner.webp",
            "https://img.podpage.com/notr2.png": "https://example.com/elsewhere.png",
        }
        dims = {self.BIG: [3409, 4261], self.BIG2: [2000, 2000], self.SMALL: [1200, 675], self.TALL: [1080, 2115],
                f"{P}/i/eee.gif": [2400, 300], f"{P}/i/fff-w1600.webp": [1600, 900], f"{P}/local/banner.webp": [3000, 900]}
        files = {self.BIG: (img(3409, 4261, "WEBP"), "image/webp"), self.BIG2: (img(2000, 2000), "image/jpeg")}
        return done, dims, files

    def test_candidates_only_wide_foreign_raster_images(self):
        done, dims, _ = self.data()
        self.assertEqual(U.shrink_candidates(done, dims), [self.BIG, self.BIG2])
        dims.pop(self.BIG2)
        self.assertEqual(U.shrink_candidates(done, dims), [self.BIG], "ohne bekannte Masse nichts")

    def test_key_naming(self):
        self.assertEqual(U.shrunk_key(f"{P}/i/abc.webp", "image/webp"), "i/abc-w1600.webp")
        self.assertEqual(U.shrunk_key(f"{P}/i/abc.jpg", "image/webp"), "i/abc-w1600.webp")
        self.assertEqual(U.shrunk_key(f"{P}/i/abc.jpg", "image/jpeg"), "i/abc-w1600.jpg")
        self.assertEqual(U.shrunk_key(f"{P}/abc.png", "image/png"), "abc-w1600.png")

    def test_shrink_uploads_new_keys_repoints_map_and_adds_dims(self):
        done, dims, files = self.data()
        before = dict(done)
        s3, http = FakeS3(), FakeHTTP(files)
        moved, n, failed = U.shrink(s3, "b", done, dims, get=http, workers=2)
        self.assertEqual(failed, [])
        self.assertEqual(sorted(http.asked), [self.BIG, self.BIG2], "geladen wird ueber img.m365.fm")
        self.assertEqual(set(s3.calls), {"put_object"}, "nichts geloescht, nur hochgeladen")
        keys = sorted(p["Key"] for p in s3.put)
        self.assertEqual(keys[0], "i/aaa-w1600.webp")
        self.assertRegex(keys[1], r"^i/bbb-w1600\.(webp|jpg)$")
        for p in s3.put:
            self.assertIn("max-age=31536000, immutable", p["CacheControl"])
            self.assertLessEqual(max(size(p["Body"])), 1600)
        self.assertEqual(moved[self.BIG], f"{P}/i/aaa-w1600.webp")
        self.assertEqual(n, 3)
        self.assertEqual(done["https://images.pexels.com/p.jpeg?a=1&amp;w=1200"], moved[self.BIG])
        self.assertEqual(done["https://images.pexels.com/p.jpeg?a=1&w=1200"], moved[self.BIG])
        self.assertEqual(done["https://m.media-amazon.com/images/I/x.jpg"], moved[self.BIG2])
        for k in before:
            if before[k] not in (self.BIG, self.BIG2):
                self.assertEqual(done[k], before[k], k)
        self.assertEqual(dims[moved[self.BIG]], [1280, 1600])
        self.assertEqual(dims[moved[self.BIG2]], [1600, 1600])
        self.assertEqual(dims[self.BIG], [3409, 4261], "alte Masse bleiben, das alte Objekt existiert weiter")
        self.assertEqual(U.shrink_candidates(done, dims), [], "zweiter Lauf hat nichts mehr zu tun")

    def test_failed_download_keeps_old_url(self):
        done, dims, files = self.data()
        files.pop(self.BIG2)
        moved, n, failed = U.shrink(FakeS3(), "b", done, dims, get=FakeHTTP(files), workers=1)
        self.assertEqual([u for u, _ in failed], [self.BIG2])
        self.assertEqual(done["https://m.media-amazon.com/images/I/x.jpg"], self.BIG2)
        self.assertEqual(n, 2)

    def test_main_shrink_dry_run_and_apply(self):
        done, dims, files = self.data()
        d = Path(tempfile.mkdtemp())
        try:
            m, di = d / "map.json", d / "dims.json"
            m.write_text(json.dumps(done), "utf-8"); di.write_text(json.dumps(dims), "utf-8")
            s3 = FakeS3()
            with mock.patch.object(U, "MAP", m), mock.patch.object(U, "DIMS", di), \
                    mock.patch.object(U, "s3_client", side_effect=AssertionError("Testlauf darf nicht hochladen")), \
                    mock.patch("sys.stdout", io.StringIO()):
                U.main_shrink(False)
            self.assertEqual(json.loads(m.read_text("utf-8")), done)
            with mock.patch.object(U, "MAP", m), mock.patch.object(U, "DIMS", di), mock.patch.object(U, "s3_client", return_value=s3), \
                    mock.patch.object(U, "http_get", FakeHTTP(files)), mock.patch.dict("os.environ", {"R2_BUCKET": "b"}), \
                    mock.patch("sys.stdout", io.StringIO()):
                U.main_shrink(True)
            new_map, new_dims = json.loads(m.read_text("utf-8")), json.loads(di.read_text("utf-8"))
            self.assertEqual(new_map["https://images.pexels.com/p.jpeg?a=1&amp;w=1200"], f"{P}/i/aaa-w1600.webp")
            self.assertEqual(new_dims[f"{P}/i/aaa-w1600.webp"], [1280, 1600])
            self.assertEqual(len(s3.put), 2)
        finally:
            shutil.rmtree(d)

    def test_repo_data_candidates_are_wide(self):
        done, dims = U.load_data()
        for u in U.shrink_candidates(done, dims):
            self.assertGreater(dims[u][0], 1600)
            self.assertTrue(u.startswith(P + "/"))


class Workflow(unittest.TestCase):
    def test_shrink_input_wired(self):
        y = (ROOT / ".github" / "workflows" / "r2-images.yml").read_text("utf-8")
        self.assertIn("shrink:", y)
        self.assertIn("inputs.shrink == 'true' && '--shrink'", y)
        self.assertIn("inputs.apply == 'true' && '--apply'", y)
        self.assertIn("git add data/r2_map.json", y)


if __name__ == "__main__":
    unittest.main()
