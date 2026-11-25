"""Zertifikatsformular der Testseite (assets/learnquiz.js) im echten Browser (Playwright/Chromium), Worker-Antworten gemockt.

Entscheidung 24.11.2026: Das Zertifikat geht an die E-Mail-Adresse der Anmeldung. Geprueft wird:
- kein E-Mail-Eingabefeld; ohne Adresse je verknuepftem Anbieter ein Knopf "E-Mail aus Ihrer Anmeldung bei <Anbieter> übernehmen", der den Zusatzschritt
  /auth/login/<anbieter>?purpose=certmail&path=<pfad>&return=<testseite> startet; Absenden ohne Adresse zeigt den Hinweis, ohne Anfrage an den Worker;
- Rueckkehr mit ?certmail=ok: Status verschwindet aus der Adresse, Ergebnis (sessionStorage) und Formular sind wieder da, maskierte Adresse mit Quelle,
  der eingegebene Name ist noch da; das Absenden schickt keine E-Mail mit;
- Fehler wrong_account / unverified erscheinen als Hinweis im Formular."""
import json
import os
import sys
import unittest
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_pillars as S  # noqa: E402

try:
    from playwright.sync_api import sync_playwright
except Exception:  # pragma: no cover
    sync_playwright = None

PAGE = "https://www.m365.fm/de/learn/path/manufacturing-excellence/test/"
API = "https://api-dub.m365.fm"
PATH = "manufacturing-excellence"
QIDS = ["lean-manufacturing-1", "lean-manufacturing-2"]
RES = {"attempt": "att-1", "score": 2, "total": 2, "passed": True, "threshold": 2, "threshold_pct": 80, "per_pillar": {"lean-manufacturing": {"ok": 2, "n": 2}},
       "results": [{"qid": q, "pillar": "lean-manufacturing", "ok": True, "chosen": 0, "correct": 0, "why": "Weil."} for q in QIDS], "shown": "all", "attempts_left": 2}


def page_html():
    data = {"path": PATH, "lang": "de", "groups": [{"id": "lean-manufacturing", "t": "Lean", "u": "https://www.m365.fm/de/learn/lean/",
                                                    "qs": [{"id": q, "q": f"Frage {q}?", "opts": ["A", "B", "C", "D"]} for q in QIDS]}]}
    cfg = {"api": API, "lang": "de", "qlang": "de", "path": PATH, "privacy": "https://www.m365.fm/datenschutz/#lernpfad-zertifikat", "pathUrl": PAGE, "max": 3,
           "t": {k: S.tx("de", k) for k in S.JS_KEYS}}
    js = (ROOT / "assets" / "learnquiz.js").read_text("utf-8")
    return (f'<!doctype html><html lang="de"><head><meta charset="utf-8"></head><body><p id="lq-status" role="alert"></p><div id="lq-app"></div>'
            f'<script type="application/json" id="lq-data">{json.dumps(data)}</script><script>window.M365LQ={json.dumps(cfg)}</script><script>{js}</script></body></html>')


@unittest.skipIf(sync_playwright is None, "playwright fehlt")
class CertFormBrowser(unittest.TestCase):
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

    def open(self, state, ctx=None):
        """-> (page, posts) mit gemocktem Worker; state = Antwort von GET /api/learn/cert (veraenderbar)."""
        ctx = ctx or self.browser.new_context()
        posts, html = [], page_html()

        def handle(route):
            u = route.request.url
            if u.startswith(PAGE): return route.fulfill(status=200, content_type="text/html; charset=utf-8", body=html)
            if u == API + "/api/me": return route.fulfill(status=200, content_type="application/json", body=json.dumps({"user": {"id": 1, "name": "Ada"}}))
            if u.startswith(API + "/api/learn/cert?"): return route.fulfill(status=200, content_type="application/json", body=json.dumps(state))
            if u == API + "/api/learn/cert" and route.request.method == "POST":
                posts.append(json.loads(route.request.post_data or "{}"))
                return route.fulfill(status=503, content_type="application/json", body=json.dumps({"error": "cert_off", "status": "pending"}))
            if u == API + "/api/learn/quiz/start": return route.fulfill(status=200, content_type="application/json", body=json.dumps({"attempt": "att-1", "qids": QIDS, "expires": 2_000_000_000, "total": 2, "threshold": 2, "attempts_left": 2}))
            if u == API + "/api/learn/quiz/submit": return route.fulfill(status=200, content_type="application/json", body=json.dumps(RES))
            return route.fulfill(status=404, body="")
        ctx.route("**/*", handle)
        return ctx, posts

    def test_mail_step_and_return(self):
        state = {"path": PATH, "quiz_ready": True, "passed": False, "best": None, "open": None, "cert": None, "name": "Ada Lovelace", "email_masked": "", "email_src": "",
                 "providers": ["microsoft", "google"], "cert_on": False, "attempts_left": 3, "threshold_pct": 80, "max_attempts": 3}
        ctx, posts = self.open(state)
        p = ctx.new_page()
        p.goto(PAGE)
        p.get_by_role("button", name="Test starten").click()
        for q in QIDS: p.locator(f'input[name="lq-{q}"][value="0"]').check()
        p.get_by_role("button", name="Antworten abgeben").click()
        p.wait_for_selector("form.lq-cert")
        self.assertEqual(p.locator('input[type="email"], input[name="email"]').count(), 0, "kein E-Mail-Feld")
        btns = p.locator(".lq-mail a.btn")
        self.assertEqual(btns.all_inner_texts(), ["E-Mail aus Ihrer Anmeldung bei Microsoft übernehmen", "E-Mail aus Ihrer Anmeldung bei Google übernehmen"])
        href = urlparse(btns.nth(1).get_attribute("href"))
        self.assertEqual(f"{href.scheme}://{href.netloc}{href.path}", API + "/auth/login/google")
        q = parse_qs(href.query)
        self.assertEqual((q["purpose"], q["path"], q["return"]), (["certmail"], [PATH], [PAGE]))
        # Absenden ohne Adresse: Hinweis, keine Anfrage
        p.locator("#lq-name").fill("Ada Byron")
        p.locator("#lq-ok").check()
        p.get_by_role("button", name="Zertifikat anfordern").click()
        self.assertIn(S.UI["q_err_need_email"][1], p.locator(".lq-cert .lq-err").last.inner_text())
        self.assertEqual(posts, [])
        # Knopf merkt sich den Namen (der Weg zum Anbieter wird hier nicht gegangen), dann Rueckkehr mit certmail=ok
        p.evaluate("document.querySelectorAll('.lq-mail a.btn')[1].addEventListener('click', (e) => e.preventDefault())")
        btns.nth(1).click()
        state.update({"passed": True, "best": {"attempt": "att-1", "score": 2, "total": 2, "passed": True, "finished": 1}, "email_masked": "a***@example.org", "email_src": "google"})
        p.goto(PAGE + "?certmail=ok")
        p.wait_for_selector("form.lq-cert")
        self.assertEqual(p.evaluate("location.href"), PAGE, "certmail verschwindet aus der Adresse")
        self.assertEqual(p.locator("h2").first.inner_text(), S.UI["q_passed"][1], "Ergebnis aus sessionStorage wieder da")
        self.assertIn("a***@example.org (Google)", p.locator(".lq-to").inner_text())
        self.assertEqual(p.locator(".lq-cert .lq-ok").inner_text(), S.UI["q_mail_ok"][1])
        self.assertEqual(p.locator("#lq-name").input_value(), "Ada Byron", "Name bleibt")
        p.locator("#lq-ok").check()
        p.get_by_role("button", name="Zertifikat anfordern").click()
        p.wait_for_selector("text=" + S.UI["q_cert_off"][1])
        self.assertEqual(len(posts), 1)
        self.assertEqual(posts[0], {"path": PATH, "attempt": "att-1", "name": "Ada Byron", "consent": True, "lang": "de"}, "keine E-Mail im Formular")
        ctx.close()

    def test_saved_result_of_other_user_is_dropped(self):
        """Geteiltes Geraet, selber Tab: das gespeicherte Ergebnis (und der Name) von A erscheint nach dem Zusatzschritt von B nicht."""
        state = {"path": PATH, "quiz_ready": True, "passed": True, "best": {"attempt": "att-bob", "score": 2, "total": 2, "passed": True, "finished": 1}, "open": None,
                 "cert": None, "name": "Bob", "email_masked": "b***@example.org", "email_src": "google", "providers": ["google"], "cert_on": False, "attempts_left": 2}
        ctx, posts = self.open(state)
        p = ctx.new_page()
        p.goto(PAGE)
        p.wait_for_selector("form.lq-cert")
        p.evaluate("([k, v, n]) => { sessionStorage.setItem(k, v); sessionStorage.setItem(n, JSON.stringify('Ada Byron')); }",
                   ["lqres:" + PATH, json.dumps({"res": RES, "ans": {}}), "lqname:" + PATH])
        p.goto(PAGE + "?certmail=ok")
        p.wait_for_selector("form.lq-cert")
        self.assertEqual(p.locator("h2").first.inner_text(), S.tx("de", "q_passed_before").replace("{s}", "2").replace("{n}", "2"), "kein fremdes Ergebnis")
        self.assertEqual(p.locator("details.lq-rev").count(), 0, "keine fremden Antworten/Erklaerungen")
        self.assertEqual(p.locator("#lq-name").input_value(), "Bob", "kein fremder Name")
        self.assertEqual(p.evaluate(f"[sessionStorage.getItem('lqres:{PATH}'), sessionStorage.getItem('lqname:{PATH}')]"), [None, None])
        p.locator("#lq-ok").check()
        p.get_by_role("button", name="Zertifikat anfordern").click()
        p.wait_for_selector("text=" + S.UI["q_cert_off"][1])
        self.assertEqual(posts[0]["attempt"], "att-bob")
        ctx.close()

    def test_errors_from_mail_step(self):
        for code, key in (("wrong_account", "q_mail_wrong"), ("unverified", "q_mail_unverified"), ("cancel", "q_mail_cancel")):
            state = {"path": PATH, "quiz_ready": True, "passed": True, "best": {"attempt": "att-1", "score": 2, "total": 2, "passed": True, "finished": 1}, "open": None,
                     "cert": None, "name": "Ada", "email_masked": "", "email_src": "", "providers": ["linkedin"], "cert_on": True, "attempts_left": 2}
            ctx, _ = self.open(state)
            p = ctx.new_page()
            p.goto(PAGE + "?certmail=" + code)
            p.wait_for_selector("form.lq-cert")
            self.assertEqual(p.locator(".lq-cert p.lq-err[role=alert]").first.inner_text(), S.UI[key][1], code)
            self.assertEqual(p.locator(".lq-mail a.btn").all_inner_texts(), ["E-Mail aus Ihrer Anmeldung bei LinkedIn übernehmen"])
            ctx.close()


if __name__ == "__main__":
    unittest.main()
