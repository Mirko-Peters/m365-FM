"""Dauerhaft fehlende fremde Bilder (data/r2_dead.json): tools/r2_upload.py merkt sich HTTP 404/410 und versucht sie nicht erneut,
gibt alle Fehler aus; site_r2.py laesst das <img> beim Seitenbau weg (Text bleibt), JSON-LD/og:image weichen aufs Standardbild aus.
Alles offline: falsches S3 und falsches HTTP."""
import contextlib
import io
import json
import shutil
import sys
import tempfile
import unittest
import urllib.error
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tools"))
import site_r2 as R2
try:
    import r2_upload as U
except ImportError:   # Pillow fehlt
    U = None

D1 = "https://blogifyai.s3.us-east-1.amazonaws.com/svg/aaaa.png"
D2 = "https://blogifyai.s3.us-east-1.amazonaws.com/svg/bbbb.png"
OK = "https://images.pexels.com/photos/1/ok.jpg"
DEAD = {D1: {"date": "2026-11-16", "status": 404}, D2: {"date": "2026-11-16", "status": 410}}
DEF = "https://example.test/assets/og-default.png"


def drop(h):
    return R2.drop_dead(h, DEAD, DEF)


class DropDead(unittest.TestCase):
    def test_img_in_p_removed_text_kept(self):
        h = f'<p>Vorher</p><p><img alt="Generated image" src="{D1}" style="display: block;"/></p><h2>Weiter</h2>'
        self.assertEqual(drop(h), "<p>Vorher</p><h2>Weiter</h2>")

    def test_p_with_br_only_removed(self):
        self.assertEqual(drop(f'<p><img src="{D1}"/><br/><br/></p><p>x</p>'), "<p>x</p>")

    def test_p_with_text_keeps_text(self):
        self.assertEqual(drop(f'<p>Text <img src="{D1}"> mehr</p>'), "<p>Text  mehr</p>")

    def test_link_around_dead_img_removed(self):
        self.assertEqual(drop(f'<p><a href="{D1}"><img src="{D1}"></a></p><p>x</p>'), "<p>x</p>")

    def test_figure_caption_kept_as_text(self):
        h = f'<figure class="f"><img src="{D2}" alt=""><figcaption>Abb. 1: Ablauf</figcaption></figure>'
        self.assertEqual(drop(h), "<p>Abb. 1: Ablauf</p>")
        self.assertEqual(drop(f'<figure>\n<img src="{D1}">\n</figure><p>x</p>'), "<p>x</p>")

    def test_figure_caption_stays_in_own_figure(self):
        # frueher lief (.*?) der Bildunterschrift ueber </figcaption> hinaus bis in die naechste <figure>: die Figur mit dem guten Bild zerbrach
        ok_fig = f'<figure><figcaption>A</figcaption><img src="{OK}"></figure>'
        self.assertEqual(drop(ok_fig + f'<p>Text</p><figure><figcaption>B</figcaption><img src="{D1}"></figure>'), ok_fig + "<p>Text</p><p>B</p>")
        ok_fig2 = f'<figure><img src="{OK}"><figcaption>Y</figcaption></figure>'
        h = f'<figure><img src="{D1}"><figcaption>X</figcaption><p>Quelle</p></figure><p>Text</p>' + ok_fig2
        self.assertEqual(drop(h), "<figure><figcaption>X</figcaption><p>Quelle</p></figure><p>Text</p>" + ok_fig2)

    def test_figure_with_p_around_img_removed(self):
        self.assertEqual(drop(f'<figure><p><img src="{D1}"></p></figure><p>x</p>'), "<p>x</p>", "keine leere <figure>")
        self.assertEqual(drop(f'<figure>\n<p><img src="{D1}"></p>\n<figcaption>Abb.</figcaption></figure>'), "<p>Abb.</p>")

    def test_other_images_untouched(self):
        h = f'<p><img src="{OK}" alt="ok"></p><p><img src="{D1}"></p>'
        self.assertEqual(drop(h), f'<p><img src="{OK}" alt="ok"></p>')
        self.assertEqual(drop(f'<p><img src="{OK}"></p>'), f'<p><img src="{OK}"></p>')
        self.assertEqual(drop("<p></p>"), "<p></p>", "schon vorher leere Absaetze bleiben")

    def test_json_escaped_html(self):
        s = json.dumps([{"html": f'<p>a</p>\n<p><img alt="x" src="{D1}"/></p>\n<p>b</p>'}], ensure_ascii=False)
        out = json.loads(drop(s))
        self.assertNotIn("blogifyai", out[0]["html"])
        self.assertIn("<p>a</p>", out[0]["html"])
        self.assertIn("<p>b</p>", out[0]["html"])
        self.assertNotIn("<p>\n</p>", out[0]["html"])

    def test_jsonld_image_list_and_single(self):
        ld = {"@type": "BlogPosting", "image": [D1, OK, D2], "author": {"@type": "Person", "image": D1},
              "publisher": {"logo": {"@type": "ImageObject", "url": "https://x.test/l.png"}}}
        h = '<script type="application/ld+json">' + json.dumps(ld) + "</script>"
        v = json.loads(drop(h)[len('<script type="application/ld+json">'):-len("</script>")])
        self.assertEqual(v["image"], [OK])
        self.assertEqual(v["author"]["image"], DEF)
        self.assertEqual(v["publisher"]["logo"]["url"], "https://x.test/l.png")
        only = '<script type="application/ld+json">' + json.dumps({"image": [D1, {"@type": "ImageObject", "url": D2}]}) + "</script>"
        self.assertEqual(json.loads(drop(only)[35:-9])["image"], DEF, "nur tote Bilder -> Standardbild")

    def test_og_and_twitter_image(self):
        h = f'<meta property="og:image" content="{D1}"><meta name="twitter:image" content="{D1}">'
        self.assertEqual(drop(h), f'<meta property="og:image" content="{DEF}"><meta name="twitter:image" content="{DEF}">')

    def test_image_field_in_json_export(self):
        self.assertEqual(drop(json.dumps({"image": D1, "name": "n"})), json.dumps({"image": DEF, "name": "n"}))

    def test_no_dead_list_is_noop(self):
        h = f'<p><img src="{D1}"></p>'
        self.assertEqual(R2.drop_dead(h, {}, DEF), h)


class RewriteUsesDeadFile(unittest.TestCase):
    def test_rewrite_drops_dead_then_maps(self):
        with mock.patch.object(R2, "DEAD", DEAD), mock.patch.object(R2, "_DRX", R2._rx_dead(DEAD)), mock.patch.object(R2, "DEFAULT_IMG", DEF), \
                mock.patch.object(R2, "MAP", {OK: "https://img.m365.fm/i/ok.webp"}), mock.patch.object(R2, "_RX", R2.re.compile(R2.re.escape(OK))):
            out = R2.rewrite(f'<p><img src="{D1}"></p><p><img src="{OK}"></p>')
        self.assertEqual(out, '<p><img src="https://img.m365.fm/i/ok.webp"></p>')

    def test_repo_file_is_valid_and_has_blogify_entries(self):
        raw = json.loads((ROOT / "data" / "r2_dead.json").read_text("utf-8"))
        self.assertIsInstance(raw, dict)
        dead = R2.load_dead(ROOT / "data" / "r2_dead.json")
        self.assertTrue(dead, "Erstbefuellung fehlt")
        for u, v in dead.items():
            self.assertTrue(u.startswith("https://"), u)
            self.assertIn(v.get("status"), (404, 410), u)
            self.assertRegex(v.get("date", ""), r"^\d{4}-\d{2}-\d{2}$", u)
        self.assertNotIn("_kommentar", dead, "Kommentare zaehlen nicht als URL")
        self.assertIn("https://blogifyai.s3.us-east-1.amazonaws.com/svg/09a02a13-4ca8-4e00-8ff0-a7db8d52cf9e.png", dead)

    def test_legacy_blog_fix_drops_dead(self):
        src = (ROOT / "site_legacy_blog.py").read_text("utf-8")
        self.assertIn("R2.drop_dead(", src, "Blog-HTML: tote Bilder vor 'images' (JSON-LD) und Titelbild-Pruefung entfernen")


class FakeS3:
    def __init__(self):
        self.put = []

    def put_object(self, **kw):
        self.put.append(kw["Key"])


def http_error(code):
    return urllib.error.HTTPError("https://x", code, "Not Found", {}, None)


@unittest.skipIf(U is None, "Pillow fehlt")
class UploadRemembersDead(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp)
        for name, val in (("MAP", "r2_map.json"), ("DIMS", "r2_dims.json"), ("DEAD", "r2_dead.json"), ("LOCAL", "r2_local.json")):
            p = mock.patch.object(U, name, self.tmp / val)
            p.start()
            self.addCleanup(p.stop)

    def test_note_dead_only_404_410(self):
        d = {}
        self.assertTrue(U.note_dead(d, D1, http_error(404), "2026-11-17"))
        self.assertTrue(U.note_dead(d, D2, http_error(410), "2026-11-17"))
        self.assertFalse(U.note_dead(d, "u3", http_error(403)))
        self.assertFalse(U.note_dead(d, "u4", http_error(503)))
        self.assertFalse(U.note_dead(d, "u5", TimeoutError("timed out")))
        self.assertFalse(U.note_dead(d, "u6", ValueError("kein Bild (binary/octet-stream, 5 Byte)")))
        self.assertEqual(d, {D1: {"date": "2026-11-17", "status": 404}, D2: {"date": "2026-11-17", "status": 410}})

    def run_main(self, todo, get, argv):
        out = io.StringIO()
        s3 = FakeS3()

        real_copy = U.copy_one
        with mock.patch.object(U, "urls", return_value=todo), mock.patch.object(U, "s3_client", return_value=s3), \
                mock.patch.object(U, "copy_one", side_effect=lambda s, b, u, d, di: real_copy(s, b, u, d, di, get)), \
                mock.patch.dict(U.os.environ, {"R2_BUCKET": "b"}), mock.patch.object(sys, "argv", argv), contextlib.redirect_stdout(out):
            U.main()
        return out.getvalue(), s3

    def test_apply_writes_dead_and_skips_next_time(self):
        png = io.BytesIO()
        im = U.Image.new("RGB", (64, 48))
        im.putdata([(x * 7 % 256, x * 13 % 256, x * 29 % 256) for x in range(64 * 48)])   # Struktur: sonst unter 100 Byte ("kein Bild")
        im.save(png, "PNG")
        calls = []

        def get(u):
            calls.append(u)
            if u == D1:
                raise http_error(404)
            if u == D2:
                raise TimeoutError("timed out")
            return png.getvalue(), "image/png"

        out, s3 = self.run_main([D1, D2, OK], get, ["r2_upload.py", "--apply"])
        dead = json.loads(U.DEAD.read_text("utf-8"))
        self.assertEqual(list(dead), [D1], "nur 404/410 sind dauerhaft, die Zeitueberschreitung nicht")
        self.assertEqual(dead[D1]["status"], 404)
        self.assertIn(OK, json.loads(U.MAP.read_text("utf-8")))
        self.assertIn(f"FEHLER {D1}", out)
        self.assertIn(f"FEHLER {D2}", out)
        # zweiter Lauf: D1 wird nicht erneut geladen, D2 schon
        calls.clear()
        out2, _ = self.run_main([D1, D2, OK], get, ["r2_upload.py", "--apply"])
        self.assertEqual(calls, [D2])
        self.assertIn("1 dauerhaft fehlend", out2)
        self.assertEqual(list(json.loads(U.DEAD.read_text("utf-8"))), [D1])

    def test_comment_key_survives_write(self):
        U.DEAD.write_text(json.dumps({"_kommentar": "x", D1: {"date": "2026-11-16", "status": 404}}), encoding="utf-8")
        d = U.load_dead()
        U.note_dead(d, D2, http_error(410), "2026-11-17")
        U.write_dead(d)
        self.assertEqual(list(json.loads(U.DEAD.read_text("utf-8"))), ["_kommentar", D1, D2])

    def test_all_failures_printed(self):
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            U.print_failed([(f"https://x.test/{i}.png", "HTTP Error 404: Not Found") for i in range(29)])
        self.assertEqual(out.getvalue().count("FEHLER"), 29, "frueher nur 20")
        src = (ROOT / "tools" / "r2_upload.py").read_text("utf-8")
        self.assertNotIn("failed[:20]", src)

    def test_dry_run_lists_all_open(self):
        out, _ = self.run_main([f"https://images.pexels.com/p/{i}.jpg" for i in range(15)], lambda u: None, ["r2_upload.py"])
        self.assertEqual(out.count("https://images.pexels.com/p/"), 15, "Testlauf zeigt alle offenen URLs, nicht nur 10")


class Workflow(unittest.TestCase):
    def test_sichern_commits_dead_file(self):
        y = (ROOT / ".github" / "workflows" / "r2-images.yml").read_text("utf-8")
        step = y.split("name: Zuordnung sichern", 1)[1]
        self.assertIn("git add data/r2_dead.json", step)
        self.assertLess(step.index("git add data/r2_dead.json"), step.index("git commit"))


if __name__ == "__main__":
    unittest.main()
