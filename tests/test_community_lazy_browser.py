"""Community-Seite im echten Browser (Playwright/Chromium): assets/community-lazy.js mit echtem IntersectionObserver und echtem assets/profile.js.

Die Node-Tests (tests/community_lazy.test.mjs) nutzen eine DOM-Attrappe. Hier wird geprueft, was nur ein Browser zeigt:
- ein leerer Platz (Hoehe 0), der von hidden auf sichtbar wechselt, meldet sich beim IntersectionObserver - auch ohne Reiter-Klick und
  ohne hashchange (Reiter direkt per .hidden umgeschaltet, also ohne den Rueckfall im Lader);
- Direktaufruf eines Reiters (#c-library) laedt nur dessen Gruppe; Startreiter Konto laedt keine Reiter-Gruppe;
- #c-events-import (Link ?claim= von site_events.py) oeffnet den Reiter Events und laedt events-import.js;
- Druck: Kopf, Fuss und Reiterleiste sind auf jedem Reiter ausgeblendet, nicht erst nach dem Reiter MVP;
- Aufruf ohne Fragment: profile.js setzt kein #c-page, Chrome springt nicht ans Seitenende, der Fuss bleibt unter dem ersten Bild
  und der spaeter eingefuegte Anmeldekasten verschiebt nichts (Lighthouse mobil: CLS 0.273 und spaetes LCP durch diesen Sprung);
- /entities.json (~560 KB) holen profile.js und guests.js nur fuer Angemeldete (Folgepunkt aus #508): abgemeldet keine Anfrage,
  auch nicht auf den Reitern Profil, Firmen und Gaeste; angemeldet weiter vorhanden.
Die Bereichs-Skripte selbst sind Attrappen (melden nur ihr Laden), die API antwortet "nicht angemeldet" (ausser im Test "angemeldet")."""
import json
import os
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_community_page as CPG  # noqa: E402

try:
    from playwright.sync_api import sync_playwright
except Exception:  # pragma: no cover
    sync_playwright = None

BASE, API = "https://site.test", "https://api.test"
REAL = {"community-lazy.js", "profile.js", "entity-match.js", "mvp-tracker.css"}


def page_html():
    body, head = CPG.build("de", "Profil", base=BASE, api=API, cv=lambda n: "1", header="<header>KOPF</header>", footer="<footer>FUSS</footer>",
                          community_tags="")
    return f'<!doctype html><html lang="de"><head><meta charset="utf-8">{head}</head><body style="margin:0">{body}</body></html>'


@unittest.skipIf(sync_playwright is None, "playwright fehlt")
class CommunityLazyBrowser(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        try:   # PW_CHROMIUM: anderer Chromium-Pfad, wenn die Playwright-Version nicht zum installierten Browser passt
            cls.browser = cls.pw.chromium.launch(**({"executable_path": os.environ["PW_CHROMIUM"]} if os.environ.get("PW_CHROMIUM") else {}))
        except Exception as e:   # Paket vorhanden, aber kein passender Browser installiert: ueberspringen wie ohne Playwright
            cls.pw.stop()
            if "Executable doesn't exist" in str(e):
                raise unittest.SkipTest("Chromium fuer Playwright fehlt")
            raise

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def open(self, hash_="", init_script=None, viewport=None, real=(), api=None):
        """real: weitere echte Skripte statt Attrappen; api(pfad) -> (status, json) oder None fuer 401 "nicht angemeldet"."""
        pg = self.browser.new_page(viewport=viewport or {"width": 412, "height": 823})
        pg.ents = []   # Anfragen an /entities.json
        pg.on("request", lambda q: pg.ents.append(q.url) if "/entities.json" in q.url else None)
        if init_script:
            pg.add_init_script(init_script)
        html = page_html()

        def route(r):
            u = r.request.url
            if u.startswith(BASE + "/community/"):
                return r.fulfill(status=200, content_type="text/html", body=html)
            if u.startswith(BASE + "/assets/"):
                n = u.split("/assets/", 1)[1].split("?", 1)[0]
                if n in REAL or n in real:
                    ct = "text/css" if n.endswith(".css") else "application/javascript"
                    return r.fulfill(status=200, content_type=ct, body=(ROOT / "assets" / n).read_text("utf-8"))
                return r.fulfill(status=200, content_type="application/javascript", body=f"(window.__L=window.__L||[]).push({json.dumps(n)});")
            if u.startswith(API):
                got = api(u[len(API):].split("?", 1)[0]) if api else None
                st, js = got or (401, {"error": "login"})
                return r.fulfill(status=st, content_type="application/json", body=json.dumps(js))
            if u.startswith(BASE + "/entities.json"):
                return r.fulfill(status=200, content_type="application/json", body='{"entities":[]}')
            return r.fulfill(status=404, body="")
        pg.route("**/*", route)
        pg.goto(BASE + "/community/" + hash_)
        pg.wait_for_load_state("load")
        pg.wait_for_timeout(300)
        return pg

    @staticmethod
    def loaded(pg):
        return pg.evaluate("window.__L||[]")

    def tab_scripts(self, ids):
        return [n for g in CPG.GROUPS if set(g[0]) & set(ids) for n in g[1]]

    def test_start_tab_loads_no_tab_group(self):
        pg = self.open()
        self.assertEqual(pg.evaluate("location.hash"), "")   # kein #c-page beim Laden (sonst Sprung zum Fragment, siehe unten)
        tab_js = {n for g in CPG.GROUPS if g[3] == "view" for n in g[1]}
        idle_js = {n for g in CPG.GROUPS if g[3] != "view" for n in g[1]}
        pg.wait_for_timeout(500)
        got = set(self.loaded(pg))
        self.assertFalse(got & (tab_js - idle_js), got)
        pg.close()

    def test_start_without_fragment_no_jump_no_shift(self):
        cls_js = ("window.__CLS=0;new PerformanceObserver(function(l){l.getEntries().forEach(function(e){window.__CLS+=e.value;});})"
                  ".observe({type:'layout-shift',buffered:true});")
        for vp in ({"width": 412, "height": 823}, {"width": 1350, "height": 940}):   # Lighthouse mobil und desktop
            with self.subTest(viewport=vp):
                pg = self.open(init_script=cls_js, viewport=vp)
                self.assertEqual(pg.evaluate("location.hash"), "")
                self.assertEqual(pg.evaluate("scrollY"), 0)
                # reservierte Hoehe (min-height:100vh) haelt den Fuss unter dem ersten Bild, solange #c-page noch leer ist
                self.assertGreaterEqual(pg.evaluate("document.querySelector('footer').getBoundingClientRect().top"), vp["height"])
                # wie community.js nach /api/me: Anmeldekasten in #c-page einfuegen (laesst main wachsen)
                pg.evaluate("var s=document.createElement('section');s.style.height='1200px';document.getElementById('c-page').appendChild(s)")
                pg.wait_for_timeout(300)
                self.assertEqual(pg.evaluate("scrollY"), 0)
                self.assertLess(pg.evaluate("window.__CLS"), 0.01)
                pg.close()

    def test_deep_link_loads_only_that_tab(self):
        pg = self.open("#c-library")
        got = self.loaded(pg)
        self.assertIn("library.js", got)
        for n in ("podcast.js", "guests.js", "mvp-tracker.js", "events-import.js", "blog.js"):
            self.assertNotIn(n, got)
        self.assertEqual(got.count("events.js"), 1)
        pg.close()

    def test_empty_place_reports_intersecting_without_click_or_hashchange(self):
        # Reiter direkt per .hidden umschalten (wie ein kuenftiges Skript ohne .ctab-Klick und ohne hashchange): nur der Observer bleibt
        pg = self.open()
        self.assertEqual(pg.evaluate("document.getElementById('c-podcast').getBoundingClientRect().height"), 0)
        self.assertNotIn("podcast.js", self.loaded(pg))
        pg.evaluate("document.getElementById('c-page').hidden=true; document.getElementById('c-podcast').hidden=false")
        pg.wait_for_function("(window.__L||[]).indexOf('podcast.js')>-1", timeout=3000)
        self.assertEqual(self.loaded(pg)[-5:], self.tab_scripts(["c-podcast"]))
        pg.close()

    def test_tab_click_loads_group(self):
        pg = self.open()
        pg.click(".ctab[data-t='c-guests']")
        pg.wait_for_function("(window.__L||[]).indexOf('guests.js')>-1", timeout=3000)
        pg.close()

    def test_claim_link_opens_events_tab(self):
        pg = self.open("?claim=ev-1#c-events-import")   # Link wie in site_events.py (CLAIMJS, ohne Anmeldung)
        self.assertEqual(pg.evaluate("location.search + location.hash"), "?claim=ev-1#c-events")   # ?claim= bleibt fuer events-import.js
        self.assertFalse(pg.evaluate("document.getElementById('c-events-import').hidden"))
        pg.wait_for_function("(window.__L||[]).indexOf('events-import.js')>-1", timeout=3000)
        pg.close()

    def test_fragment_without_tab_stays_in_address(self):
        # z. B. /community/#c-msg aus expert-connect.js: beim Laden nicht auf #c-page umschreiben (sonst Sprung zu #c-page und Verschiebung)
        pg = self.open("#c-msg")
        self.assertEqual(pg.evaluate("location.hash"), "#c-msg")
        self.assertFalse(pg.evaluate("document.getElementById('c-page').hidden"))
        pg.close()

    def test_logged_out_no_entities_json(self):
        # Reiter Konto (Start), Profil, Firmen und Gaeste (echtes guests.js; events.js liefert window.M365U): keine Anfrage an /entities.json
        pg = self.open(real={"events.js", "guests.js"})
        for t in ("c-expert", "c-orgs", "c-guests"):
            pg.click(f".ctab[data-t='{t}']")
        pg.wait_for_function("document.querySelector('#c-guests h3')", timeout=3000)   # guests.js lief und hat /api/me abgewartet (Hinweis Anmeldung)
        pg.wait_for_timeout(500)
        self.assertEqual(pg.ents, [])
        pg.close()

    def test_logged_in_loads_entities_json(self):
        def api(path):
            return {"/api/profile/me": (200, {"profile": {}, "suggest": "anna"}), "/api/org/mine": (200, {"orgs": []}),
                    "/api/me": (200, {"user": {"id": "u1", "name": "Anna"}})}.get(path)
        pg = self.open(real={"events.js", "guests.js"}, api=api)
        # profile.js: gleich nach /api/profile/me, ohne Reiterwechsel (Profil- und Firmenbereich werden beim Laden gebaut)
        pg.wait_for_function("document.querySelector('#c-expert section.ccard h2')", timeout=3000)
        self.assertEqual([u.split("?", 1)[0] for u in pg.ents], [BASE + "/entities.json"])
        pg.click(".ctab[data-t='c-guests']")   # guests.js: Themennamen fuer Angemeldete
        pg.wait_for_function("document.querySelector('#c-guests h2')", timeout=3000)
        pg.wait_for_timeout(500)
        self.assertEqual(len(pg.ents), 2, pg.ents)
        pg.close()

    def test_print_hides_header_footer_tabs_on_every_tab(self):
        pg = self.open("#c-library")
        self.assertNotIn("mvp-tracker.js", self.loaded(pg))
        pg.emulate_media(media="print")
        for sel in ("header", "footer", ".ctabs"):
            self.assertEqual(pg.evaluate(f"getComputedStyle(document.querySelector('{sel}')).display"), "none", sel)
        pg.emulate_media(media="screen")
        self.assertNotEqual(pg.evaluate("getComputedStyle(document.querySelector('header')).display"), "none")
        pg.close()


if __name__ == "__main__":
    unittest.main()
