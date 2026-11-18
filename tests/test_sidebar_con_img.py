"""Bild der M365Con-Karte in der Seitenleiste (site_sidebar.con_img/con_preload, tools/sidebar_con_img.py).

Lighthouse Desktop /entity/copilot/ (17.11.2026): LCP-Element ist dieses Bild, 675 px / 68,5 KB fuer ~310 CSS-px, loading=lazy, ohne fetchpriority
(image-delivery 63 KiB, lcp-discovery offen). Jetzt: verkleinerte Fassungen aus img.m365.fm (AVIF, sonst WebP) mit srcset/sizes, ohne lazy,
hohe Prioritaet nur auf dem Desktop ueber einen Preload mit media. Solange r2-images.yml sie nicht hochgeladen hat: das bisherige Bild."""
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_r2 as R2  # noqa: E402
import site_sidebar as SBR  # noqa: E402

OLD = ('<img src="https://www.m365.fm/assets/attending-m365con.webp" alt="I\'m attending M365Con International 2027, January 11–22, 2027, '
       'free online event" width="675" height="563" loading="lazy">')


def r2map(exts=("webp", "avif")):
    return {SBR.con_file(w, e): f"https://img.m365.fm/sidebar/attending-m365con-{w}.{e}" for w in SBR.CON_WIDTHS for e in exts}


def side(lang="en"):
    ix = SBR.Index()
    return SBR.render(ix, "https://www.m365.fm", lang, "Copilot", [], None, None)


class Markup(unittest.TestCase):
    def test_fallback_is_old_image_until_uploaded(self):
        with patch.dict(R2.MAP, {}, clear=True):
            self.assertEqual(SBR.con_img("https://www.m365.fm"), OLD)
            h = side()
            self.assertIn(OLD, h)
            self.assertNotIn("<picture", h)
            self.assertEqual(SBR.con_preload(h), "")

    def test_partial_upload_keeps_fallback(self):
        m = r2map()
        m.pop(SBR.con_file(SBR.CON_WIDTHS[0], "webp"))
        with patch.dict(R2.MAP, m, clear=True):
            self.assertEqual(SBR.con_img("https://www.m365.fm"), OLD)

    def test_picture_avif_webp(self):
        with patch.dict(R2.MAP, r2map(), clear=True):
            h = SBR.con_img("https://www.m365.fm")
            src = re.search(r'<source type="image/avif" srcset="([^"]+)" sizes="([^"]+)">', h)
            img = re.search(r"<img [^>]+>", h).group(0)
            self.assertTrue(h.startswith('<picture class="sb-conp"><source type="image/avif"'), h)
            self.assertEqual(src.group(1), ", ".join(f"https://img.m365.fm/sidebar/attending-m365con-{w}.avif {w}w" for w in SBR.CON_WIDTHS))
            self.assertEqual(src.group(2), SBR.CON_SIZES)
            self.assertIn('src="https://img.m365.fm/sidebar/attending-m365con-675.webp"', img)
            self.assertIn('srcset="' + ", ".join(f"https://img.m365.fm/sidebar/attending-m365con-{w}.webp {w}w" for w in SBR.CON_WIDTHS) + '"', img)
            self.assertIn(f'sizes="{SBR.CON_SIZES}"', img)
            self.assertIn('width="675" height="563"', img)
            self.assertNotIn("loading=", img)        # nicht lazy: auf dem Desktop LCP-Element
            self.assertIn('fetchpriority="low"', img)   # hohe Prioritaet nur ueber den Desktop-Preload (Handy: Seitenleiste unter dem Inhalt)
            self.assertNotIn("/assets/attending-m365con.webp", h)
            self.assertIn(h, side())

    def test_webp_only_without_avif(self):
        with patch.dict(R2.MAP, r2map(("webp",)), clear=True):
            h = SBR.con_img("https://www.m365.fm")
            self.assertNotIn("<source", h)
            self.assertIn("attending-m365con-340.webp 340w", h)
            pre = SBR.con_preload(h)
            self.assertNotIn("type=", pre)
            self.assertIn('imagesrcset="https://img.m365.fm/sidebar/attending-m365con-340.webp 340w', pre)

    def test_preload_matches_picture(self):
        with patch.dict(R2.MAP, r2map(), clear=True):
            h = side("de")
            pre = SBR.con_preload(h)
            src = re.search(r'<source type="image/avif" srcset="([^"]+)" sizes="([^"]+)">', h)
            self.assertTrue(pre.startswith('<link rel="preload" as="image" type="image/avif" '), pre)
            self.assertIn(f'imagesrcset="{src.group(1)}"', pre)   # gleiche Kandidaten und gleiche sizes: der Browser waehlt dieselbe Datei
            self.assertIn(f'imagesizes="{src.group(2)}"', pre)
            self.assertIn('media="(min-width: 62.01rem)"', pre)
            self.assertIn('fetchpriority="high"', pre)
            self.assertEqual(SBR.con_preload("<main>ohne Seitenleiste</main>"), "")

    def test_sizes_match_sidebar_css(self):
        css = (ROOT / "assets" / "sbar.css").read_text("utf-8")
        col = float(re.search(r"\.shw\{[^}]*grid-template-columns:minmax\(0,1fr\) ([\d.]+)rem", css).group(1))
        pad = float(re.search(r"\.sb-con\{padding:([\d.]+)rem", css).group(1))
        brk = re.search(r"@media\(max-width:([\d.]+)rem\)\{\.shw\{grid-template-columns:minmax\(0,1fr\)\}", css).group(1)
        self.assertEqual(SBR.CON_DESK, f"(min-width: {float(brk) + 0.01:g}rem)")
        self.assertTrue(SBR.CON_SIZES.startswith(f"{SBR.CON_DESK} {col - 2 * pad:g}rem, "), SBR.CON_SIZES)
        self.assertIn(".sb-conp{display:block}", css)


class Files(unittest.TestCase):
    """Die erzeugten Dateien in design/sidebar/: vorhanden, richtig gross, kleiner als die Quelle, AVIF nur wenn kleiner als WebP, alle in data/r2_local.json."""
    def test_files_smaller_and_registered(self):
        from PIL import Image
        local = json.loads((ROOT / "data" / "r2_local.json").read_text("utf-8"))
        src = ROOT / "assets" / "attending-m365con.webp"
        with Image.open(src) as im:
            sw, sh = im.size
        self.assertEqual((sw, sh), SBR.CON_WH)
        for w in SBR.CON_WIDTHS:
            webp = ROOT / SBR.con_file(w, "webp")
            self.assertTrue(webp.is_file(), webp)
            with Image.open(webp) as im:
                self.assertEqual((im.format, im.size), ("WEBP", (w, round(sh * w / sw))))
            self.assertLess(webp.stat().st_size, src.stat().st_size)
            self.assertEqual(local[SBR.con_file(w, "webp")], f"sidebar/attending-m365con-{w}.webp")
            avif = ROOT / SBR.con_file(w, "avif")
            if avif.exists():
                self.assertLess(avif.stat().st_size, webp.stat().st_size)
                self.assertEqual(local[SBR.con_file(w, "avif")], f"sidebar/attending-m365con-{w}.avif")
            else:
                self.assertNotIn(SBR.con_file(w, "avif"), local)
        self.assertLess(max(w for w in SBR.CON_WIDTHS), sw + 1)   # nie hochskaliert

    def test_registered_files_are_uploadable(self):
        sys.path.insert(0, str(ROOT / "tools"))
        import r2_upload as U
        got = dict(U.local_files())
        for rel, key in json.loads((ROOT / "data" / "r2_local.json").read_text("utf-8")).items():
            self.assertEqual(got.get(rel), key, rel)

    def test_generator_skips_avif_when_not_smaller(self):
        sys.path.insert(0, str(ROOT / "tools"))
        import sidebar_con_img as T
        with tempfile.TemporaryDirectory() as d:
            out = Path(d)
            done = T.build(out_root=out, avif=False)
            self.assertEqual([r for r, _ in done], [SBR.con_file(w, "webp") for w in SBR.CON_WIDTHS])
            stale = out / SBR.con_file(340, "avif")
            stale.write_bytes(b"x")
            T.build(out_root=out, avif=False)
            self.assertFalse(stale.exists())   # alte AVIF-Datei entfernt, wenn es keine kleinere gibt


class InPage(unittest.TestCase):
    """generate_site.page(): Preload nur im <head> von Seiten mit der Karte (Fassungen in R2), sonst nichts Neues im Kopf."""
    @classmethod
    def setUpClass(cls):
        import site_fetch
        with patch.object(site_fetch, "fetch", return_value=None):
            import generate_site
        cls.G = generate_site

    def page(self, side=""):
        G = self.G
        with patch.object(G, "css_link", return_value=""), patch.object(G, "SW_REG", []), patch.object(G, "OGLIST", []):
            return G.page("en", "Titel", "Beschreibung", G.BASE + "/entity/x/", '<main class="wrap"><h1>T</h1></main><footer></footer>', side=side)

    def test_preload_only_with_r2_card(self):
        with patch.dict(R2.MAP, r2map(), clear=True):
            h = self.page(side())
            head = h.split("</head>", 1)[0]
            self.assertEqual(head.count('rel="preload" as="image"'), 1)
            self.assertIn('media="(min-width: 62.01rem)" fetchpriority="high"', head)
            self.assertLess(head.index('as="image"'), head.index("<style>"))
            self.assertNotIn('as="image"', self.page())   # ohne Seitenleiste kein Preload
        with patch.dict(R2.MAP, {}, clear=True):
            self.assertNotIn('as="image"', self.page(side()))   # Rueckfall: bisheriges Bild, kein Preload


if __name__ == "__main__":
    unittest.main()
