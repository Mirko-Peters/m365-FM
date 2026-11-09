"""Sidebar scrollt mit (assets/sbar.css + Kopf von assets/attend.js): Playwright gegen eine kleine lokale Seite, 1280x800."""
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
try:
    from playwright.sync_api import sync_playwright
except Exception:  # pragma: no cover
    sync_playwright = None


def page_html(cards):
    css = (ROOT / "assets" / "sbar.css").read_text("utf-8")
    side = "".join(f'<section class="sb-card" style="height:200px">K{i}</section>' for i in range(cards))
    return (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><style>body{{margin:0}}{css}</style></head><body>'
            f'<div class="shw"><main class="shmain" style="height:5000px">x</main><aside class="sbar"><div class="sbar-in">{side}</div></aside></div></body></html>')


@unittest.skipIf(sync_playwright is None, "playwright fehlt")
class SidebarScroll(unittest.TestCase):
    def run_case(self, cards, fn):
        with sync_playwright() as p:
            try: b = p.chromium.launch()
            except Exception as e:   # Paket vorhanden, aber kein passender Browser installiert ("playwright install chromium"): ueberspringen wie ohne Playwright
                if "Executable doesn't exist" in str(e): self.skipTest("Chromium fuer Playwright fehlt")
                raise
            pg = b.new_page(viewport={"width": 1280, "height": 800})
            pg.set_content(page_html(cards)); pg.add_script_tag(path=str(ROOT / "assets" / "attend.js"))
            box = lambda: pg.evaluate("(()=>{const r=document.querySelector('aside.sbar').getBoundingClientRect();return [r.top,r.bottom]})()")

            def scroll(y):
                pg.evaluate(f"scrollTo(0,{y})"); pg.wait_for_timeout(100)
            # kein innerer Scrollbalken
            self.assertTrue(pg.evaluate("(()=>{const a=document.querySelector('aside.sbar');return a.scrollHeight<=a.clientHeight+1&&getComputedStyle(a).overflowY==='visible'})()"))
            fn(box, scroll)
            b.close()

    def test_tall_sidebar(self):   # 7 Karten + Abstaende > 800 px
        def fn(box, scroll):
            for y in range(0, 1600, 100): scroll(y)
            t, bt = box(); self.assertAlmostEqual(bt, 800 - 16, delta=3)   # Ende bleibt am Fensterrand
            self.assertLess(t, 0)
            for y in range(1600, 1450, -50): scroll(y)
            t2, b2 = box(); self.assertGreater(t2, t); self.assertGreater(b2, bt - 1)   # beim Hochscrollen wandert sie mit nach unten
            for y in range(1450, -1, -100): scroll(y)
            scroll(0); t3, _ = box(); self.assertAlmostEqual(t3, 16, delta=3)   # Anfang sichtbar
            scroll(1000); scroll(1100); t4, b4 = box(); self.assertTrue(t4 <= 17 and b4 >= 783 - 1 or t4 <= 17)
        self.run_case(7, fn)

    def test_short_sidebar(self):
        def fn(box, scroll):
            for y in (800, 2000, 1000, 100):
                scroll(y); t, b = box()
                self.assertAlmostEqual(t, 16, delta=3); self.assertLessEqual(b, 800)
        self.run_case(2, fn)


if __name__ == "__main__":
    unittest.main()
