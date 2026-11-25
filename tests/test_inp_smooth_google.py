"""Weniger Arbeit bei der ersten Eingabe (INP, Mirko 24.11.2026, TECH-AUDIT "Lenis smooth-scroll"):
- assets/smooth.js (Lenis) wird nicht mehr beim ersten Klick/Tastendruck/Mausrad nachgeladen; Anker springen weich per CSS (a11y.css),
  aus bei "Bewegung reduzieren" (System oder Menue-Schalter a11y-nomo). Die Datei bleibt fuer gecachte alte Seiten liegen.
- Die Google-Karte der Seitenleiste (.sb-g, assets/sbar.css) hat auf keinem Bildschirm mehr Endlos-Animationen: Rahmen steht, Glanz einmal."""
import re
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
BASE = "https://www.m365.fm"
CSS = lambda name: (ROOT / "assets" / name).read_text("utf-8")


def rules(css, sel):
    """Deklarationen aller Regeln, deren Selektorliste genau `sel` enthaelt (ohne Kommentare, auch in @media)."""
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    out = []
    for m in re.finditer(r"([^{}]+)\{([^{}]*)\}", css):
        if sel in [s.strip() for s in m.group(1).split(",")]:
            out.append(m.group(2))
    return out


class NoLenis(unittest.TestCase):
    def test_loader_removed(self):
        src = (ROOT / "generate_site.py").read_text("utf-8")
        self.assertNotIn("smooth.js", src)
        self.assertNotIn("Lenis", src)
        self.assertTrue((ROOT / "assets" / "smooth.js").exists())   # Datei bleibt (gecachte alte Seiten)

    def test_page_has_no_smooth_loader(self):
        import site_fetch
        with patch.object(site_fetch, "fetch", return_value=None):
            import generate_site as G
        with patch.object(G, "css_link", return_value=""), patch.object(G, "SW_REG", []), patch.object(G, "OGLIST", []):
            for lang in ("en", "de", "ar"):
                h = G.page(lang, "Titel", "Beschreibung", BASE + "/x/", "<main><h1>T</h1></main><footer></footer>")
                self.assertNotIn("smooth.js", h, lang)
                self.assertNotIn("pointerdown", h, lang)

    def test_no_script_depends_on_lenis(self):
        for f in sorted((ROOT / "assets").glob("*.js")):
            if f.name == "smooth.js":
                continue
            src = f.read_text("utf-8")
            self.assertNotIn("lenis", src.lower(), f.name)

    def test_css_smooth_anchor_scroll(self):
        a11y = CSS("a11y.css").replace(" ", "")
        self.assertIn("@media(prefers-reduced-motion:no-preference){html:not(.a11y-nomo){scroll-behavior:smooth}}", a11y)
        self.assertIn("html.a11y-nomo*,html.a11y-nomo*:before,html.a11y-nomo*:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}", a11y)
        src = (ROOT / "generate_site.py").read_text("utf-8")
        self.assertIn('A11Y_CSS = _mini_css("a11y.css")', src)   # steckt im gehashten site.css jeder Seite


class GoogleCardStill(unittest.TestCase):
    def test_no_endless_animation(self):
        css = re.sub(r"/\*.*?\*/", "", CSS("sbar.css"), flags=re.S)   # Kommentare nennen die alten Namen
        self.assertNotIn("infinite", css)
        for k in ("gspin", "gfloat", "gglow", "--gang", "@property"):
            self.assertNotIn(k, css, k)

    def test_frame_and_glow_static(self):
        css = CSS("sbar.css")
        before = rules(css, ".sb-g::before")
        self.assertTrue(any("conic-gradient(" in r for r in before))   # Farbrahmen bleibt sichtbar
        for sel in (".sb-g::before", ".sb-g::after", ".sb-g a.gb"):
            for r in rules(css, sel):
                self.assertNotIn("animation:", r.replace(" ", ""), sel)

    def test_shine_runs_once(self):
        css = CSS("sbar.css")
        anim = [re.search(r"animation:([^;}]*)", r.replace(" ", "")) for r in rules(css, ".sb-g a.gb::after")]
        anim = [m.group(1) for m in anim if m]
        self.assertIn("none", anim)   # Bewegung reduzieren
        run = [a for a in anim if a.startswith("gshine")]
        self.assertEqual(len(run), 1)
        self.assertNotIn("infinite", run[0])
        self.assertIn("@keyframes gshine", css)


if __name__ == "__main__":
    unittest.main()
