"""M365Con-Kartenbild der Seitenleiste im echten Browser (Playwright/Chromium), mit den Fassungen aus design/sidebar/ unter img.m365.fm.

Geprueft wird, was nur ein Browser zeigt:
- Desktop (1366 px, DPR 1): genau eine Bildanfrage, die 340-px-AVIF-Datei, mit hoher Prioritaet (Preload im Kopf), und das Bild ist das LCP-Element;
- Desktop DPR 1,5 bzw. 2: 480 bzw. 675 px; Preload und <picture> waehlen dieselbe Datei (keine zweite Anfrage);
- Handy (390 px, DPR 3, Seitenleiste unter dem Inhalt): kein Preload, niedrige Prioritaet, die 675-px-AVIF-Datei, keine Anfrage an /assets/;
- Rueckfall ohne R2-Fassungen: das bisherige Bild /assets/attending-m365con.webp, kein img.m365.fm."""
import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_r2 as R2  # noqa: E402
import site_sidebar as SBR  # noqa: E402

try:
    from playwright.sync_api import sync_playwright
except Exception:  # pragma: no cover
    sync_playwright = None

BASE = "https://www.m365.fm"
CT = {"webp": "image/webp", "avif": "image/avif"}


def r2map():
    return {SBR.con_file(w, e): f"https://img.m365.fm/sidebar/attending-m365con-{w}.{e}" for w in SBR.CON_WIDTHS for e in CT
            if (ROOT / SBR.con_file(w, e)).exists()}


_IMG = None


def setUpModule():   # Bildkarte (Rueckfall, CON_TEXT=False); seit 24.11.2026 zeigt die Seitenleiste den Text-Banner (tests/test_sidebar_con_text.py)
    global _IMG
    _IMG = patch.object(SBR, "CON_TEXT", False); _IMG.start()
    import site_ads as ADS
    globals()["_RUN"] = patch.object(ADS, "con_running", lambda today=None: True); _RUN.start()   # auch nach dem Event-Ende pruefbar


def tearDownModule():
    _IMG.stop(); _RUN.stop()


def html(m):
    with patch.dict(R2.MAP, m, clear=True):
        side = SBR.render(SBR.Index(), BASE, "en", "Copilot Teams SharePoint", [], None, None)
        pre = SBR.con_preload(side)
    css = (ROOT / "assets" / "sbar.css").read_text("utf-8")
    # wie generate_site.page(): Preload im Kopf, Seitenleiste neben (Desktop) bzw. unter (Handy) dem Inhalt; Inhalt hoeher als der Bildschirm
    return (f'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">{pre}'
            f'<style>body{{margin:0;font:16px sans-serif}}.wrap{{max-width:1040px;margin:0 auto;padding:0 22px}}{css}</style></head><body>'
            f'<main class="wrap shw"><div class="shmain"><h1>Copilot</h1><p style="height:1400px">Text</p></div>{side}</main></body></html>')


@unittest.skipIf(sync_playwright is None, "playwright fehlt")
class SidebarConBrowser(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        try:
            cls.browser = cls.pw.chromium.launch(**({"executable_path": os.environ["PW_CHROMIUM"]} if os.environ.get("PW_CHROMIUM") else {}))
        except Exception as e:
            cls.pw.stop()
            if "Executable doesn't exist" in str(e):
                raise unittest.SkipTest("Chromium fuer Playwright fehlt")
            raise

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def load(self, width, height, dpr, m):
        ctx = self.browser.new_context(viewport={"width": width, "height": height}, device_scale_factor=dpr)
        pg = ctx.new_page()
        cdp = ctx.new_cdp_session(pg)
        cdp.send("Network.enable")
        reqs = []   # (url, initialPriority) der Bildanfragen
        cdp.on("Network.requestWillBeSent", lambda e: reqs.append((e["request"]["url"], e["request"].get("initialPriority")))
               if e.get("type") == "Image" or "attending-m365con" in e["request"]["url"] else None)
        doc = html(m)

        def route(r):
            u = r.request.url
            if u == BASE + "/entity/copilot/":
                return r.fulfill(status=200, content_type="text/html", body=doc)
            if u.startswith("https://img.m365.fm/sidebar/"):
                name = u.rsplit("/", 1)[1]
                return r.fulfill(status=200, content_type=CT[name.rsplit(".", 1)[1]], body=(ROOT / "design" / "sidebar" / name).read_bytes())
            if u == BASE + "/assets/attending-m365con.webp":
                return r.fulfill(status=200, content_type="image/webp", body=(ROOT / "assets" / "attending-m365con.webp").read_bytes())
            return r.fulfill(status=204, body="")

        pg.route("**/*", route)
        pg.add_init_script("window.__lcp=[];new PerformanceObserver(function(l){l.getEntries().forEach(function(e){window.__lcp.push(e.element&&e.element.tagName+'|'+(e.url||''))})}).observe({type:'largest-contentful-paint',buffered:true});")
        pg.goto(BASE + "/entity/copilot/")
        pg.wait_for_load_state("load")
        pg.wait_for_timeout(300)
        got = pg.evaluate("(()=>{const i=document.querySelector('.sb-con img');return {cur:i.currentSrc,w:i.getBoundingClientRect().width,top:i.getBoundingClientRect().top,ok:i.complete&&i.naturalWidth>0}})()")
        lcp = pg.evaluate("window.__lcp")
        ctx.close()
        return reqs, got, lcp

    def test_desktop_dpr1_small_avif_high_priority_lcp(self):
        m = r2map()
        reqs, got, lcp = self.load(1366, 768, 1, m)
        con = [r for r in reqs if "attending-m365con" in r[0]]
        self.assertEqual([u for u, _ in con], ["https://img.m365.fm/sidebar/attending-m365con-340.avif"], reqs)
        self.assertIn(con[0][1], ("High", "VeryHigh"))
        self.assertTrue(got["ok"])
        self.assertEqual(got["cur"], con[0][0])
        self.assertAlmostEqual(got["w"], 19.4 * 16, delta=1)   # sizes passt zur gerenderten Breite
        self.assertTrue(lcp and lcp[-1].startswith("IMG|https://img.m365.fm/sidebar/attending-m365con-340.avif"), lcp)

    def test_desktop_hidpi_picks_matching_file_once(self):
        m = r2map()
        for dpr, w in ((1.5, 480), (2, 675)):
            reqs, got, _ = self.load(1366, 768, dpr, m)
            con = [u for u, _ in reqs if "attending-m365con" in u]
            self.assertEqual(con, [f"https://img.m365.fm/sidebar/attending-m365con-{w}.avif"], (dpr, reqs))
            self.assertEqual(got["cur"], con[0])

    def test_mobile_no_preload_no_high_priority(self):
        m = r2map()
        reqs, got, _ = self.load(390, 844, 3, m)
        con = [r for r in reqs if "attending-m365con" in r[0]]
        self.assertEqual([u for u, _ in con], ["https://img.m365.fm/sidebar/attending-m365con-675.avif"], reqs)
        self.assertEqual(con[0][1], "Low")   # fetchpriority=low am <img>; ohne waere es "Medium" (eines der ersten Bilder)
        self.assertGreater(got["top"], 844)   # Seitenleiste unter dem Inhalt
        self.assertTrue(got["ok"])

    def test_fallback_without_r2(self):
        reqs, got, _ = self.load(1366, 768, 1, {})
        con = [u for u, _ in reqs if "attending-m365con" in u]
        self.assertEqual(con, [BASE + "/assets/attending-m365con.webp"])
        self.assertTrue(got["ok"])


if __name__ == "__main__":
    unittest.main()
