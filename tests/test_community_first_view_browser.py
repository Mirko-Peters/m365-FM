"""Erste Ansicht der Community-Seite im echten Browser (Playwright/Chromium), mit der echten Seite aus generate_site.page() und den echten
Skripten community.js, profile.js, community-lazy.js, entity-match.js, invite-share.js und den Texten cm-<sprache>.js.

Geprueft wird, was der Dienstag-Check (RUM/Lighthouse, 17.11.2026) fuer /community/ gemessen hat:
- abgemeldet steht der Anmeldekasten (div.clogin, mobil das LCP-Element) schon im ersten HTML und ist ohne Skripte sichtbar, gestylt
  ueber die Regeln im <head> (community.css kommt erst nach dem Fuss);
- keine Verschiebung (CLS < 0,01) auf Handy und Desktop, auch wenn Skripte und API langsam antworten und /api/providers einen Anbieter
  nicht nennt; die Mitglieder-Karten (Aenderungsvorschlaege, Events, KI-Zugang, Punkte) gibt es abgemeldet nicht;
- vor GET /api/me (und jedem anderen GET an die API) kein CORS-Preflight (OPTIONS): x-requested-with nur bei schreibenden Anfragen;
- angemeldet wie bisher: Kasten weg, Konto sichtbar, alle Reiter, Deep Links; mit dem Hinweis im localStorage ist der Kasten von
  Anfang an ausgeblendet (kein Aufblitzen); ein veralteter Hinweis zeigt den Kasten wieder und wird geloescht."""
import json
import os
import sys
import time
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_community_page as CPG  # noqa: E402

try:
    from playwright.sync_api import sync_playwright
except Exception:  # pragma: no cover
    sync_playwright = None

REAL = {"community.js", "invite-share.js", "community.css", "profile.js", "entity-match.js", "community-lazy.js"}
CLS_JS = ("window.__CLS=0;window.__SH=[];new PerformanceObserver(function(l){l.getEntries().forEach(function(e){if(e.hadRecentInput)return;"
          "window.__CLS+=e.value;window.__SH.push([e.value,(e.sources||[]).map(function(s){var n=s.node;return n&&n.nodeType===1?n.tagName+'.'+n.className+'#'+n.id:String(n&&n.nodeName)})]);});})"
          ".observe({type:'layout-shift',buffered:true});")
USER = {"id": "u1", "name": "Anna", "badges": [], "points": 3, "comments": 1, "likes": 0, "name_opts": {"short": "Anna"}, "name_mode": "short", "created": 1700000000}
TOP = [{"id": f"m{i}", "name": f"Mitglied {i}", "points": 100 - i, "badges": []} for i in range(10)]


def load_generate_site():
    import site_fetch
    with patch.object(site_fetch, "fetch", return_value=None):
        import generate_site
    return generate_site


@unittest.skipIf(sync_playwright is None, "playwright fehlt")
class CommunityFirstView(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.G = G = load_generate_site()
        cls.BASE, cls.API = G.BASE, G.COMMUNITY_API
        cls.site_css = G.SBAR_CSS + "\n" + G.CSS + "\n" + G.FORMS_CSS + "\n" + G.A11Y_CSS + "\n" + G.ROLE.CSS
        cls.html = {}
        with patch.object(G, "css_link", return_value=f'<link rel="stylesheet" href="{G.BASE}/assets/site.css">'), patch.object(G, "SW_REG", []), \
                patch.object(G, "OGLIST", []):
            for lang in ("de", "en"):
                ct = G._CI.get(lang, G._CI["en"]).get("profile", "Profile")
                b, eh = CPG.build(lang, G.esc(ct), base=G.BASE, api=G.COMMUNITY_API, cv=G._cv, header=G.header(lang, ""), footer=G.footer(lang),
                                  community_tags=G.community_tags(lang))
                cls.html[lang] = G.page(lang, f"{ct} – M365.FM", ct, f"{G.BASE}/community/", b, og_type="website", extra_head=G.LRN.WCSS + eh, noindex=True)
        cls.pw = sync_playwright().start()
        try:   # PW_CHROMIUM: anderer Chromium-Pfad, wenn die Playwright-Version nicht zum installierten Browser passt
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

    def cm_js(self, lang):
        t = dict(self.G._CI.get("en", {}))
        t.update(self.G._CI.get(lang, {}))
        return "window.M365CT=" + json.dumps(t, ensure_ascii=False) + ";"

    def open(self, path="/community/", lang="de", user=None, providers=("google", "microsoft", "linkedin", "github"), viewport=None,
             delay_js=0, delay_api=0, no_js=False, hint=None, wait=900):
        """user: angemeldeter Nutzer oder None; hint: Wert von localStorage m365_auth vor dem Laden; delay_*: Antwortzeit in ms."""
        ctx = self.browser.new_context(viewport=viewport or {"width": 412, "height": 823}, java_script_enabled=not no_js)
        pg = ctx.new_page()
        pg.reqs = []   # (Methode, Pfad, x-requested-with) aller API-Anfragen in Reihenfolge
        pg.on("request", lambda q: pg.reqs.append((q.method, q.url[len(self.API):].split("?", 1)[0], q.headers.get("x-requested-with")))
              if q.url.startswith(self.API) else None)
        init = CLS_JS
        if hint is not None:
            init += f"try{{localStorage.setItem('m365_auth',{json.dumps(hint)})}}catch(e){{}}"
        pg.add_init_script(init)
        origin = self.BASE
        cors = {"access-control-allow-origin": origin, "access-control-allow-credentials": "true"}

        def api(p, method):
            if p == "/api/me":
                return (200, {"user": user}) if user else (200, {"user": None})
            if p == "/api/providers":
                return 200, {"providers": list(providers)}
            if p == "/api/curator":
                return 200, {"top": TOP, "last": None}
            if p == "/api/push/key":
                return 200, {"key": "BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}
            if not user:
                return 401, {"error": "login"}
            return {"/api/me/identities": (200, {"identities": [{"id": 1, "provider": "google", "created": 1700000000}]}),
                    "/api/me/merge": (200, {}), "/api/profile/me": (200, {"profile": {}, "suggest": "anna"}), "/api/org/mine": (200, {"orgs": []}),
                    "/api/me" + "": (200, {"user": user})}.get(p, (200, {}))

        pend = []   # (faellig, route, Antwort): Antworten mit Verzoegerung, abgearbeitet in der Schleife unten (Sync-API ohne Threads)

        def answer(r):
            q = r.request
            u = q.url
            if u.startswith(self.API):
                if q.method == "OPTIONS":
                    return dict(status=204, headers={**cors, "access-control-allow-headers": "content-type, x-requested-with",
                                                     "access-control-allow-methods": "GET, POST, DELETE, OPTIONS", "access-control-max-age": "86400"})
                st, js = api(u[len(self.API):].split("?", 1)[0], q.method)
                return dict(status=st, headers=cors, content_type="application/json", body=json.dumps(js))
            if u.startswith(origin + "/assets/"):
                n = u.split("/assets/", 1)[1].split("?", 1)[0]
                if n == "site.css":
                    return dict(status=200, content_type="text/css", body=self.site_css)
                if n.startswith("cm-") and n.endswith(".js"):
                    return dict(status=200, content_type="application/javascript", body=self.cm_js(n[3:-3]))
                if n in REAL:
                    return dict(status=200, content_type="text/css" if n.endswith(".css") else "application/javascript", body=(ROOT / "assets" / n).read_text("utf-8"))
                if n.endswith(".js"):
                    return dict(status=200, content_type="application/javascript", body=f"(window.__L=window.__L||[]).push({json.dumps(n)});")
                return dict(status=404, body="")
            if u.startswith(origin + "/community/") or u.startswith(origin + "/de/community/"):
                return dict(status=200, content_type="text/html", body=self.html[lang])
            return dict(status=404, body="")

        def route(r):
            u = r.request.url
            d = delay_api if u.startswith(self.API) else delay_js if "/assets/" in u and u.split("?", 1)[0].endswith(".js") else 0
            if d:
                pend.append((time.monotonic() + d / 1000, r, answer(r)))
            else:
                r.fulfill(**answer(r))
        ctx.route("**/*", route)
        pg.goto(origin + path, wait_until="commit")
        end = None
        while True:   # Antworten zur Faelligkeit senden, bis die Seite geladen ist und "wait" ms vergangen sind
            now = time.monotonic()
            for x in [x for x in pend if x[0] <= now]:
                pend.remove(x)
                try:
                    x[1].fulfill(**x[2])
                except Exception:
                    pass
            if end is None and pg.evaluate("document.readyState") == "complete" and not pend:
                end = now + wait / 1000
            if end is not None and now >= end and not pend:
                break
            pg.wait_for_timeout(10)
        pg.ctx = ctx
        return pg

    def close(self, pg):
        pg.ctx.close()

    def visible(self, pg, sel):
        return pg.evaluate(f"(function(){{var e=document.querySelector({json.dumps(sel)});if(!e)return false;var r=e.getBoundingClientRect();"
                           "return r.height>0&&getComputedStyle(e).display!=='none'&&getComputedStyle(e).visibility!=='hidden';})()")

    # ---------- abgemeldet ----------
    def test_login_box_in_first_html_visible_without_scripts(self):
        for lang in ("de", "en"):
            with self.subTest(lang=lang):
                pg = self.open(lang=lang, no_js=True, wait=200, path="/community/" if lang == "en" else "/de/community/")
                self.assertTrue(self.visible(pg, "#c-page > #c-login.clogin"))
                top = pg.evaluate("document.querySelector('#c-login').getBoundingClientRect()")
                self.assertLess(top["y"] + 60, 823)   # im ersten Bild (oben die Reiterleiste, wie bisher nach profile.js)
                # gestylt aus dem <head> (Rahmen, Innenabstand), obwohl community.css erst nach dem Fuss kommt
                self.assertEqual(pg.evaluate("getComputedStyle(document.querySelector('#c-login')).paddingTop"), "16px")
                links = pg.evaluate("[].map.call(document.querySelectorAll('#c-login a.btn'),function(a){return a.href})")
                self.assertEqual(len(links), 4)
                self.assertTrue(all(x.startswith(self.API + "/auth/login/") for x in links), links)
                txt = self.G._CI[lang]["signin_google"]
                self.assertIn(txt, pg.text_content("#c-login"))
                self.assertTrue(self.visible(pg, "#c-tabs"))   # Reiterleiste steht ebenfalls schon im HTML (profile.js fuegt sie nicht mehr ein)
                self.close(pg)

    def test_logged_out_no_layout_shift(self):
        for vp in ({"width": 412, "height": 823}, {"width": 1350, "height": 940}):   # Lighthouse mobil und desktop
            for prov in (("google", "microsoft", "linkedin", "github"), ("google", "microsoft"), ("google",)):
                with self.subTest(viewport=vp, providers=prov):
                    pg = self.open(viewport=vp, providers=prov, delay_js=250, delay_api=350, wait=1800)
                    self.assertTrue(pg.evaluate("!!document.querySelector('#c-page section.ccard .clb')"))   # Bestenliste ist da (alles geladen)
                    # Ziel < 0,01; vorher hier bis 0,014 (div.ccard, Kasten schrumpfte nach /api/providers), jetzt gar keine Verschiebung
                    self.assertLess(pg.evaluate("window.__CLS"), 0.001, pg.evaluate("window.__SH"))
                    self.assertEqual(pg.evaluate("document.querySelectorAll('#c-page .clogin').length"), 1)
                    # Mitglieder-Karten nur fuer Angemeldete (vorher leere div.ccard bzw. Token-Knopf mit 401)
                    self.assertEqual(pg.evaluate("document.querySelectorAll('#c-page > div.ccard').length"), 0)
                    self.assertNotIn("/api/ai-token", [p for _m, p, _x in pg.reqs])
                    self.assertNotIn("/api/points", [p for _m, p, _x in pg.reqs])
                    if "github" not in prov:   # nicht eingerichteter Anbieter: Knopf bleibt (gleiche Hoehe), fuehrt aber nicht auf die 503-Seite
                        self.assertEqual(pg.evaluate("document.querySelector('#c-login a[href*=\"/auth/login/github\"]')"), None)
                        self.assertEqual(pg.evaluate("document.querySelectorAll('#c-login a.btn[aria-disabled=true]:not([href])').length"), 4 - len(prov))
                        self.assertEqual(pg.evaluate("document.querySelectorAll('#c-login .btn').length"), 4)
                    self.close(pg)

    def test_no_preflight_before_api_me(self):
        pg = self.open(wait=1200)
        paths = [(m, p) for m, p, _x in pg.reqs]
        self.assertIn(("GET", "/api/me"), paths)
        self.assertEqual([x for x in paths if x[0] == "OPTIONS"], [], paths)   # kein Preflight, auch nicht fuer andere GETs
        self.assertTrue(all(x is None for m, _p, x in pg.reqs if m == "GET"), pg.reqs)
        self.close(pg)

    def test_login_links_return_to_current_address(self):
        pg = self.open(path="/de/community/?claim=ev-1#c-events-import")
        hrefs = pg.evaluate("[].map.call(document.querySelectorAll('#c-login a.btn'),function(a){return a.href})")
        from urllib.parse import quote
        self.assertTrue(all(h.endswith("?return=" + quote(self.BASE + "/de/community/?claim=ev-1", safe="")) for h in hrefs), hrefs)
        self.close(pg)

    def test_profile_view_by_id_hides_box_and_tabs(self):
        pg = self.open(path="/de/community/?u=m1", no_js=False)
        self.assertFalse(self.visible(pg, "#c-login"))
        self.assertFalse(self.visible(pg, "#c-tabs"))
        self.close(pg)

    def test_stale_hint_shows_box_and_is_cleared(self):
        pg = self.open(hint="1")
        self.assertTrue(self.visible(pg, "#c-login"))
        self.assertIsNone(pg.evaluate("localStorage.getItem('m365_auth')"))
        self.close(pg)

    # ---------- angemeldet ----------
    def test_logged_in_with_hint_box_hidden_from_the_start(self):
        pg = self.open(hint="1", no_js=False, user=USER, delay_js=600, wait=50)   # Skripte laufen noch nicht
        self.assertFalse(self.visible(pg, "#c-login"))
        pg.wait_for_function("document.querySelector('#c-page .cprof')", timeout=4000)
        self.assertEqual(pg.evaluate("document.querySelectorAll('#c-login').length"), 0)
        self.assertLess(pg.evaluate("window.__CLS"), 0.01, pg.evaluate("window.__SH"))
        self.close(pg)

    def test_logged_in_without_hint_replaces_box_and_sets_hint(self):
        pg = self.open(user=USER)
        pg.wait_for_function("document.querySelector('#c-page .cprof')", timeout=4000)
        self.assertEqual(pg.evaluate("document.querySelectorAll('#c-login').length"), 0)
        self.assertEqual(pg.evaluate("localStorage.getItem('m365_auth')"), "1")
        for k in ("/api/edits/inbox", "/api/events/mine", "/api/ai-token", "/api/points"):   # Mitglieder-Karten wie bisher
            self.assertIn(("GET", k), [(m, p) for m, p, _x in pg.reqs])
        self.assertEqual([x for x in pg.reqs if x[0] == "OPTIONS"], [])
        # schreibende Anfrage traegt weiter x-requested-with (CSRF-Pruefung im Worker, worker/src/index.js)
        pg.click("#c-page .cprof .btn.main")
        pg.wait_for_timeout(300)
        posts = [x for x in pg.reqs if x[0] == "POST" and x[1] == "/api/me"]
        self.assertEqual(posts and posts[0][2], "m365", pg.reqs)
        self.close(pg)

    def test_logged_in_tabs_and_deep_links(self):
        pg = self.open(user=USER, hint="1")
        tabs = pg.evaluate("[].map.call(document.querySelectorAll('#c-tabs .ctab'),function(b){return b.dataset.t})")
        self.assertEqual(tabs[0], "c-page")
        self.assertEqual(len(tabs), len(set(tabs)))
        self.assertEqual(pg.evaluate("document.querySelectorAll('.ctabs').length"), 1)
        for t in tabs:   # jeder Reiter zeigt genau seinen Bereich
            pg.click(f".ctab[data-t='{t}']")
            self.assertEqual(pg.evaluate(f"document.querySelector(\".ctab[data-t='{t}']\").getAttribute('aria-selected')"), "true")
            shown = pg.evaluate("[].filter.call(document.querySelectorAll('#c-tabs .ctab'),function(b){var e=document.getElementById(b.dataset.t);return e&&!e.hidden}).map(function(b){return b.dataset.t})")
            self.assertEqual(shown, [t])
        self.close(pg)
        for frag, tab in (("#c-library", "c-library"), ("#c-mvp/log", "c-mvp"), ("#c-events-import", "c-events")):
            with self.subTest(frag=frag):
                pg = self.open(path="/de/community/" + frag, user=USER, hint="1")
                self.assertFalse(pg.evaluate(f"document.getElementById('{tab}').hidden"))
                self.assertTrue(pg.evaluate("document.getElementById('c-page').hidden"))
                self.assertEqual(pg.evaluate(f"document.querySelector(\".ctab[data-t='{tab}']\").getAttribute('aria-selected')"), "true")
                self.close(pg)


if __name__ == "__main__":
    unittest.main()
