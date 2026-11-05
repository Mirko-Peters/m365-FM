"""Offline-Tests fuer tools/update_ai_stats.py (T37 Belegzahlen): python3 tools/test_update_ai_stats.py
HTTP ist gemockt (urllib.request.urlopen); mit installiertem cryptography wird die JWT-Signatur echt erzeugt und geprueft."""
import base64
import io
import json
import shutil
import sys
import tempfile
import unittest
import urllib.error
import urllib.parse
from contextlib import redirect_stdout
from datetime import date
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import update_ai_stats as U

try:
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import padding, rsa
    KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    PEM = KEY.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()).decode()
except ImportError:   # ohne cryptography: Signatur wird ersetzt, der Rest laeuft trotzdem
    KEY, PEM = None, "-----{0} PRIVATE KEY-----\nunbenutzt\n-----{1} PRIVATE KEY-----\n".format("BEGIN", "END")   # Platzhalter, kein Schluessel

SA = {"type": "service_account", "project_id": "m365-test", "private_key_id": "kid0123456789abcdef", "private_key": PEM,
      "client_email": "stats-bot@m365-test.iam.gserviceaccount.com", "client_id": "123456789012345678901",
      "token_uri": "https://oauth2.googleapis.com/token"}
SECRET = json.dumps(SA)
NOW = 1796371200
TODAY = date(2026, 12, 4)
OK_GSC = {"status": "ok", "source": U.GSC_SOURCE, "property": "sc-domain:m365.fm", "period": {"from": "2026-06-01", "to": "2026-08-31"},
          "retrieved": "2026-09-04", "entered": "api", "clicks": 900, "impressions": 40000, "ctr": 0.0225, "position": 19.2, "pages": 800,
          "pages_clicked": 120, "note": ""}
# Feste Ausgangslage der Tests (Stand des Repos vom 1.11.2026). Nicht die echte Datei kopieren: die aendert sich mit jedem Monatslauf
# (echte Search-Console- und Bing-Werte), die Tests sollen davon nicht abhaengen. Die echte Datei prueft Files.test_repo_seed_files_valid.
SEED_WEEKS = [["2026-08-03", 62300], ["2026-08-10", 65400], ["2026-08-17", 61100], ["2026-08-24", 85800], ["2026-08-31", 89100],
              ["2026-09-07", 85800], ["2026-09-14", 96800], ["2026-09-21", 97500], ["2026-09-28", 97200], ["2026-10-05", 84800],
              ["2026-10-12", 89100], ["2026-10-19", 87200]]
SEED_AI = {"version": 1, "_doc": U.DOC, "updated": "2026-11-01",
           "bing_ai": {"status": "ok", "source": U.BING_SOURCE, "period": {"from": "2026-08-01", "to": "2026-10-30"}, "retrieved": "2026-11-01",
                       "entered": "manual", "citations": 1100000, "cited_pages_per_day": 622, "weekly": SEED_WEEKS},
           "google_ai": U.google_empty(),
           "gsc": U.gsc_block({"status": "missing_secret", "property": U.GSC_DEFAULT_SITE,
                               "note": "Secret GSC_SERVICE_ACCOUNT_JSON fehlt; Werte unveraendert"})}


def unb64(s):
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))


class Resp(io.BytesIO):
    status = 200

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


class FakeNet:
    """urlopen-Ersatz: routes = Liste von (Teil-URL, Antwort); Antwort = dict, (Code, dict) fuer HTTP-Fehler oder Funktion(body)."""

    def __init__(self, *routes):
        self.routes, self.calls = list(routes), []

    def __call__(self, req, timeout=None):
        body = req.data.decode()
        self.calls.append({"url": req.full_url, "auth": req.get_header("Authorization"), "ctype": req.get_header("Content-type"), "body": body})
        for i, (part, ans) in enumerate(self.routes):
            if part in req.full_url:
                if isinstance(ans, list):          # Folge von Antworten
                    ans = ans.pop(0) if len(ans) > 1 else ans[0]
                if callable(ans):
                    ans = ans(body)
                if isinstance(ans, tuple):
                    code, payload = ans
                    raise urllib.error.HTTPError(req.full_url, code, "err", {}, io.BytesIO(json.dumps(payload).encode()))
                return Resp(json.dumps(ans).encode())
        raise AssertionError("unerwarteter Abruf " + req.full_url)


def no_net(req, timeout=None):
    raise AssertionError("kein Netzabruf erwartet: " + req.full_url)


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.dir = Path(self.tmp.name)
        (self.dir / U.AI_FILE).write_text(U.dump(json.loads(json.dumps(SEED_AI))) + "\n", "utf-8")   # feste Ausgangslage
        shutil.copy(ROOT / "data" / "stats" / U.DIFF_FILE, self.dir / U.DIFF_FILE)
        p = patch.object(U, "SLEEP", lambda s: None)
        p.start(); self.addCleanup(p.stop)
        if KEY is None:
            p = patch.object(U, "sign_rs256", lambda pem, data: b"sig")
            p.start(); self.addCleanup(p.stop)

    def run_main(self, *argv, env=None, net=no_net, today=TODAY):
        out = io.StringIO()
        with patch("urllib.request.urlopen", net), redirect_stdout(out):
            code = U.main(["--data-dir", str(self.dir), *argv], env=env or {}, today=today, now=NOW)
        return code, out.getvalue()

    def ai(self):
        return json.loads((self.dir / U.AI_FILE).read_text("utf-8"))

    def raw(self, f=U.AI_FILE):
        return (self.dir / f).read_bytes()

    def put_gsc(self, blk):
        self.put("gsc", blk)

    def put(self, key, blk):
        d = self.ai(); d[key] = blk
        (self.dir / U.AI_FILE).write_text(U.dump(d) + "\n", "utf-8")

    def assert_no_secret(self, *texts):
        for t in texts:
            for s in ("PRIVATE KEY", SA["private_key_id"], SA["client_email"], SA["client_id"], "ya29."):
                self.assertNotIn(s, t)


class Numbers(unittest.TestCase):
    def test_ints(self):
        for s, v in [("1100000", 1100000), ("1,100,000", 1100000), ("1.100.000", 1100000), ("1 100 000", 1100000), ("1.1M", 1100000),
                     ("950K", 950000), ("1,1 M", 1100000), (" 622 ", 622), ('"62,300"', 62300), ("0", 0)]:
            self.assertEqual(U.parse_int(s, "x"), v, s)
        for s in ("-5", "abc", "1,10,000", "12.5", "", "1e6", "1,100.000"):
            with self.assertRaises(U.Invalid, msg=s):
                U.parse_int(s, "x")

    def test_avg(self):
        self.assertEqual(U.parse_avg("621.7", "x"), 622)
        self.assertEqual(U.parse_avg("621,4", "x"), 621)
        self.assertEqual(U.parse_avg("1.234", "x"), 1234)   # drei Stellen = Tausendertrenner
        self.assertEqual(U.parse_avg("622", "x"), 622)

    def test_last_full_months(self):
        self.assertEqual(U.last_full_months(date(2026, 12, 4)), (date(2026, 9, 1), date(2026, 11, 30)))
        self.assertEqual(U.last_full_months(date(2027, 1, 4)), (date(2026, 10, 1), date(2026, 12, 31)))
        self.assertEqual(U.last_full_months(date(2026, 11, 3)), (date(2026, 7, 1), date(2026, 9, 30)))   # Oktober noch nicht endgueltig
        self.assertEqual(U.last_full_months(date(2027, 2, 2)), (date(2026, 10, 1), date(2026, 12, 31)))


class WeeklyCsv(unittest.TestCase):
    def test_single_line(self):
        self.assertEqual(U.parse_weekly("2026-08-03=62300, 2026-08-10=65,400; 2026-08-17 61100"),
                         [["2026-08-03", 62300], ["2026-08-10", 65400], ["2026-08-17", 61100]])
        self.assertEqual(U.parse_weekly("2026-08-10:65400|2026-08-03:62300"), [["2026-08-03", 62300], ["2026-08-10", 65400]])   # sortiert

    def test_csv_header_picks_citations_column(self):
        txt = 'Date,Citations,Cited pages\n2026-08-03,"62,300",540\n2026-08-10,"65,400",560\n'
        self.assertEqual(U.parse_weekly(txt), [["2026-08-03", 62300], ["2026-08-10", 65400]])

    def test_csv_german_semicolon_other_order(self):
        txt = "Woche;Zitierte Seiten;Zitate\n03.08.2026;540;62.300\n10.08.2026;560;65.400\nGesamt;;127.700\n"
        self.assertEqual(U.parse_weekly(txt), [["2026-08-03", 62300], ["2026-08-10", 65400]])

    def test_csv_without_header_first_number(self):
        self.assertEqual(U.parse_weekly("2026-08-03T00:00:00Z,62300,1\n2026-08-10T00:00:00Z,65400,2"),
                         [["2026-08-03", 62300], ["2026-08-10", 65400]])

    def test_daily_rows_become_full_weeks(self):
        days = [date.fromordinal(date(2026, 8, 1).toordinal() + i) for i in range(16)]   # Sa 1.8. bis So 16.8.
        txt = "Date\tCitations\n" + "\n".join(f"{d.month}/{d.day}/{d.year}\t1,000" for d in days)
        self.assertEqual(U.parse_weekly(txt), [["2026-08-03", 7000], ["2026-08-10", 7000]])   # 1./2.8. angeschnitten -> weg

    def test_invalid(self):
        for txt in ("2026-08-03=62300, 2026-08-06=100",           # weder Woche noch Tag
                    "2026-08-03=1, 2026-08-03=2",                 # doppelt
                    "2026-08-03=viel",                            # keine Zahl
                    "62300",                                      # kein Datum
                    "2026-02-30=5",                               # ungueltiges Datum
                    "Date,Citations\n2026-08-03,1\nfoo,2\n",      # Zeile ohne Datum
                    "2026-08-01,1\n2026-08-02,1\n"):              # Tageswerte ohne volle Woche
            with self.assertRaises(U.Invalid, msg=txt):
                U.parse_weekly(txt)


class Gsc(Base):
    def gsc_net(self, pages_rows=((2, 1), (1, 0)), search=None):
        tot = {"rows": [{"keys": [], "clicks": 1234, "impressions": 56789, "ctr": 0.021730, "position": 17.43}]}
        page_answers = [{"rows": [{"keys": [f"https://www.m365.fm/p{i}-{n}/"], "clicks": 1 if i < c else 0, "impressions": 5}
                                  for i in range(n)]} for n, c in pages_rows]

        def sa(body):
            q = json.loads(body)
            return page_answers.pop(0) if q.get("dimensions") == ["page"] else tot
        return FakeNet(("oauth2.googleapis.com/token", {"access_token": "ya29.test-token", "expires_in": 3599, "token_type": "Bearer"}),
                       ("searchconsole.googleapis.com", search or sa))

    def test_gsc_ok(self):
        net = self.gsc_net()
        before = self.ai()["bing_ai"]
        with patch.object(U, "PAGE_ROWS", 2):
            code, out = self.run_main(env={"GSC_SERVICE_ACCOUNT_JSON": SECRET}, net=net)
        self.assertEqual(code, 0, out)
        d = self.ai()
        g = d["gsc"]
        self.assertEqual((g["status"], g["period"], g["retrieved"], g["clicks"], g["impressions"], g["ctr"], g["position"], g["pages"],
                          g["pages_clicked"], g["note"], g["property"], g["entered"]),
                         ("ok", {"from": "2026-09-01", "to": "2026-11-30"}, "2026-12-04", 1234, 56789, 0.0217, 17.4, 3, 1, "", "sc-domain:m365.fm", "api"))
        self.assertEqual(d["bing_ai"], before)
        self.assertEqual(d["updated"], "2026-12-04")
        tok, tot, p1, p2 = net.calls
        self.assertEqual(tok["url"], "https://oauth2.googleapis.com/token")
        form = urllib.parse.parse_qs(tok["body"])
        self.assertEqual(form["grant_type"], ["urn:ietf:params:oauth:grant-type:jwt-bearer"])
        h, c, sig = form["assertion"][0].split(".")
        self.assertEqual(json.loads(unb64(h)), {"alg": "RS256", "typ": "JWT", "kid": SA["private_key_id"]})
        self.assertEqual(json.loads(unb64(c)), {"iss": SA["client_email"], "scope": "https://www.googleapis.com/auth/webmasters.readonly",
                                                "aud": "https://oauth2.googleapis.com/token", "iat": NOW, "exp": NOW + 3600})
        if KEY is not None:   # echte RS256-Signatur
            KEY.public_key().verify(unb64(sig), f"{h}.{c}".encode(), padding.PKCS1v15(), hashes.SHA256())
        for call in (tot, p1, p2):
            self.assertEqual(call["url"], "https://searchconsole.googleapis.com/webmasters/v3/sites/sc-domain%3Am365.fm/searchAnalytics/query")
            self.assertEqual(call["auth"], "Bearer ya29.test-token")
            self.assertEqual(call["ctype"], "application/json")
        self.assertEqual(json.loads(tot["body"]), {"startDate": "2026-09-01", "endDate": "2026-11-30", "type": "web", "dataState": "final"})
        self.assertEqual([json.loads(x["body"])["startRow"] for x in (p1, p2)], [0, 2])
        self.assertEqual(json.loads(p1["body"])["dimensions"], ["page"])
        self.assert_no_secret(out, self.raw().decode())

    def test_gsc_url_prefix_property(self):
        net = self.gsc_net(pages_rows=((0, 0),))
        code, out = self.run_main(env={"GSC_SERVICE_ACCOUNT_JSON": SECRET, "GSC_SITE": "https://www.m365.fm/"}, net=net)
        self.assertEqual(code, 0, out)
        self.assertIn("/sites/https%3A%2F%2Fwww.m365.fm%2F/searchAnalytics/query", net.calls[1]["url"])
        self.assertEqual(self.ai()["gsc"]["property"], "https://www.m365.fm/")

    def test_gsc_missing_secret_keeps_values(self):
        self.put_gsc(dict(OK_GSC))
        code, out = self.run_main(env={"GSC_SERVICE_ACCOUNT_JSON": "  "})
        self.assertEqual(code, 0, out)
        g = self.ai()["gsc"]
        self.assertEqual(g["status"], "missing_secret")
        self.assertIn("GSC_SERVICE_ACCOUNT_JSON", g["note"])
        self.assertEqual({k: g[k] for k in ("clicks", "impressions", "period", "retrieved", "pages")},
                         {k: OK_GSC[k] for k in ("clicks", "impressions", "period", "retrieved", "pages")})
        self.assertIn("::notice::Search Console", out)

    def test_gsc_missing_secret_seed_unchanged(self):
        before = self.raw()
        code, out = self.run_main()
        self.assertEqual((code, self.raw()), (0, before))
        self.assertIn("unveraendert", out)

    def test_gsc_403_keeps_values_and_stays_green(self):
        self.put_gsc(dict(OK_GSC))
        err = (403, {"error": {"code": 403, "status": "PERMISSION_DENIED",
                               "message": "User does not have sufficient permission for site 'sc-domain:m365.fm'. See also: "
                                          "https://support.google.com/webmasters/answer/2451999."}})
        net = self.gsc_net(search=err)
        code, out = self.run_main(env={"GSC_SERVICE_ACCOUNT_JSON": SECRET}, net=net)
        self.assertEqual(code, 0, out)
        g = self.ai()["gsc"]
        self.assertEqual(g["status"], "error")
        self.assertIn("HTTP 403", g["note"])
        self.assertIn("PERMISSION_DENIED", g["note"])
        self.assertIn("Nutzer der Property", g["note"])
        self.assertTrue(g["note"].endswith("; Werte unveraendert"), g["note"])
        self.assertEqual((g["clicks"], g["impressions"], g["period"]), (900, 40000, OK_GSC["period"]))
        self.assertEqual(len(net.calls), 2)   # 403 wird nicht wiederholt
        self.assertIn("::warning::Search Console", out)
        self.assert_no_secret(out, self.raw().decode())

    def test_gsc_token_rejected(self):
        net = FakeNet(("oauth2.googleapis.com/token", (400, {"error": "invalid_grant", "error_description": "Invalid JWT Signature."})))
        code, out = self.run_main(env={"GSC_SERVICE_ACCOUNT_JSON": SECRET}, net=net)
        self.assertEqual(code, 0, out)
        g = self.ai()["gsc"]
        self.assertEqual(g["status"], "error")
        self.assertIn("invalid_grant", g["note"])
        self.assert_no_secret(out, self.raw().decode())

    def test_gsc_retries_5xx(self):
        net = self.gsc_net(pages_rows=((1, 1),))
        tot = net.routes[1][1]
        net.routes[1] = ("searchconsole.googleapis.com", [(503, {"error": {"status": "UNAVAILABLE"}}), tot])
        code, out = self.run_main(env={"GSC_SERVICE_ACCOUNT_JSON": SECRET}, net=net)
        self.assertEqual(code, 0, out)
        self.assertEqual(self.ai()["gsc"]["status"], "ok")

    def test_gsc_bad_secret(self):
        for raw in ("{not json", json.dumps({"client_email": "x@y"}), "[]"):
            code, out = self.run_main(env={"GSC_SERVICE_ACCOUNT_JSON": raw})
            self.assertEqual(code, 0, out)
            self.assertEqual(self.ai()["gsc"]["status"], "error")
            self.assertNotIn(raw, out)

    def test_gsc_without_cryptography(self):
        def missing(pem, data):
            raise U.Missing()
        with patch.object(U, "sign_rs256", missing):
            code, out = self.run_main(env={"GSC_SERVICE_ACCOUNT_JSON": SECRET})
        self.assertEqual(code, 0, out)
        g = self.ai()["gsc"]
        self.assertEqual(g["status"], "error")
        self.assertIn("cryptography", g["note"])

    def test_gsc_empty(self):
        self.put_gsc(dict(OK_GSC))
        net = self.gsc_net(search={"responseAggregationType": "byProperty"})
        code, out = self.run_main(env={"GSC_SERVICE_ACCOUNT_JSON": SECRET}, net=net)
        self.assertEqual(code, 0, out)
        g = self.ai()["gsc"]
        self.assertEqual((g["status"], g["clicks"]), ("empty", 900))


class BingManual(Base):
    WEEKS = "2026-09-07=90000, 2026-09-14=91000, 2026-09-21=92000, 2026-09-28=93000, 2026-10-05=94000, 2026-10-12=95000"

    def test_manual_inputs_ok(self):
        diff_before = self.raw(U.DIFF_FILE)
        env = {"BING_CITATIONS": "1.2M", "BING_PAGES_PER_DAY": "640.4", "BING_FROM": "2026-09-01", "BING_TO": "2026-11-29",
               "BING_WEEKLY": self.WEEKS, "BING_RETRIEVED": "2026-12-01"}
        code, out = self.run_main(env=env)
        self.assertEqual(code, 0, out)
        b = self.ai()["bing_ai"]
        self.assertEqual(b, {"status": "ok", "source": U.BING_SOURCE, "period": {"from": "2026-09-01", "to": "2026-11-29"},
                             "retrieved": "2026-12-01", "entered": "manual", "citations": 1200000, "cited_pages_per_day": 640,
                             "weekly": [["2026-09-07", 90000], ["2026-09-14", 91000], ["2026-09-21", 92000], ["2026-09-28", 93000],
                                        ["2026-10-05", 94000], ["2026-10-12", 95000]]})
        self.assertEqual(self.ai()["updated"], "2026-12-04")
        self.assertEqual(self.raw(U.DIFF_FILE), diff_before)
        self.assertNotIn("Bing AI Performance: neuer Export faellig", out)
        self.assertEqual(self.ai()["google_ai"], U.google_empty())   # Google bleibt unberuehrt

    def test_manual_args_without_weekly_keep_old_weeks_in_period(self):
        code, out = self.run_main("--bing-citations", "1,250,000", "--bing-pages-per-day", "650", "--bing-from", "2026-09-01",
                                  "--bing-to", "2026-11-29", "--skip-gsc")
        self.assertEqual(code, 0, out)
        b = self.ai()["bing_ai"]
        self.assertEqual(b["retrieved"], "2026-12-04")
        self.assertEqual([w[0] for w in b["weekly"]], ["2026-08-31", "2026-09-07", "2026-09-14", "2026-09-21", "2026-09-28", "2026-10-05",
                                                       "2026-10-12", "2026-10-19"])

    def test_manual_daily_csv_export(self):
        days = [date.fromordinal(date(2026, 9, 1).toordinal() + i) for i in range(30)]
        csv_txt = "Date,Citations,Cited pages\n" + "\n".join(f"{d.isoformat()},10000,600" for d in days)
        env = {"BING_CITATIONS": "300000", "BING_PAGES_PER_DAY": "600", "BING_FROM": "2026-09-01", "BING_TO": "2026-09-30", "BING_WEEKLY": csv_txt}
        code, out = self.run_main(env=env)
        self.assertEqual(code, 0, out)
        self.assertEqual(self.ai()["bing_ai"]["weekly"], [["2026-09-07", 70000], ["2026-09-14", 70000], ["2026-09-21", 70000]])

    def test_manual_inputs_invalid_fail_and_write_nothing(self):
        good = {"BING_CITATIONS": "1100000", "BING_PAGES_PER_DAY": "622", "BING_FROM": "2026-09-01", "BING_TO": "2026-11-29"}
        cases = [({"BING_CITATIONS": "1100000"}, "bing_pages_per_day"),                       # nur ein Teil eingegeben
                 (dict(good, BING_FROM="2026-12-01", BING_TO="2026-11-29"), "liegt nach"),
                 (dict(good, BING_TO="2026-12-24"), "Zukunft"),
                 (dict(good, BING_TO="2026-02-30"), "gueltiges Datum"),
                 (dict(good, BING_FROM="1.9.2026"), "YYYY-MM-DD"),
                 (dict(good, BING_CITATIONS="viele"), "bing_citations"),
                 (dict(good, BING_CITATIONS="-5"), "bing_citations"),
                 (dict(good, BING_PAGES_PER_DAY="6x"), "bing_pages_per_day"),
                 (dict(good, BING_WEEKLY="2026-07-06=100"), "ausserhalb"),
                 (dict(good, BING_CITATIONS="1100", BING_WEEKLY=self.WEEKS), "25 %"),             # Einheit vertan
                 (dict(good, BING_WEEKLY="2026-09-07=1, 2026-09-10=2"), "7 Tage"),
                 (dict(good, BING_RETRIEVED="2026-11-01"), "bing_retrieved"),
                 (dict(good, BING_FROM="2025-01-01", BING_TO="2026-11-29"), "400 Tage")]
        for env, msg in cases:
            before = self.raw()
            code, out = self.run_main(env=env)
            self.assertEqual(code, 1, (env, out))
            self.assertIn("::error::", out)
            self.assertIn(msg, out, env)
            self.assertEqual(self.raw(), before, env)

    def test_export_due_warning(self):
        code, out = self.run_main(today=date(2026, 12, 20))
        self.assertEqual(code, 0, out)
        self.assertIn("::warning::Bing AI Performance: neuer Export faellig (letzter Stand 2026-11-01", out)


class GoogleInputParse(unittest.TestCase):
    def test_pairs_lenient(self):
        self.assertEqual(U.parse_google_input("impressions=123,456; pages=420; from=2026-08-01; to=2026-10-31"),
                         {"impressions": "123,456", "pages": "420", "from": "2026-08-01", "to": "2026-10-31"})
        self.assertEqual(U.parse_google_input("Impressionen: 1.2M | Seiten: 420 | von: 2026-08-01 | bis: 2026-10-31 | Stand: 2026-11-04"),
                         {"impressions": "1.2M", "pages": "420", "from": "2026-08-01", "to": "2026-10-31", "retrieved": "2026-11-04"})
        self.assertEqual(U.parse_google_input("from=2026-08-01, to=2026-10-31, impressions=9000, weekly=2026-08-03=100, 2026-08-10=200; retrieved=2026-11-04"),
                         {"from": "2026-08-01", "to": "2026-10-31", "impressions": "9000", "weekly": "2026-08-03=100, 2026-08-10=200",
                          "retrieved": "2026-11-04"})
        self.assertEqual(U.parse_google_input("  "), {})
        self.assertEqual(U.parse_google_input("impressions=5; pages=; from=2026-08-01; to=2026-08-31"),   # leerer Wert = nicht angegeben
                         {"impressions": "5", "from": "2026-08-01", "to": "2026-08-31"})

    def test_parse_errors(self):
        for txt, msg in [("123456", "keine Angabe"), ("123; impressions=5", "vor dem ersten Schluessel"), ("clicks=5; impressions=7", "unbekannter Schluessel 'clicks'"),
                         ("impressions=5; impr=6", "doppelt")]:
            with self.assertRaises(U.Invalid, msg=txt) as cm:
                U.parse_google_input(txt)
            self.assertIn(msg, str(cm.exception), txt)


class GoogleManual(Base):
    WEEKS = "2026-08-03=90000, 2026-08-10=91000, 2026-08-17=92000"
    GOOD = "impressions=1,250,000; pages=420; from=2026-08-01; to=2026-10-31"

    def test_google_ok(self):
        before = self.ai()
        env = {"GOOGLE_AI": self.GOOD + "; retrieved=2026-11-04; weekly=" + self.WEEKS}
        code, out = self.run_main(env=env)
        self.assertEqual(code, 0, out)
        d = self.ai()
        self.assertEqual(d["google_ai"], {"status": "ok", "source": U.GOOGLE_AI_SOURCE, "period": {"from": "2026-08-01", "to": "2026-10-31"},
                                          "retrieved": "2026-11-04", "entered": "manual", "impressions": 1250000, "pages": 420,
                                          "weekly": [["2026-08-03", 90000], ["2026-08-10", 91000], ["2026-08-17", 92000]]})
        self.assertEqual((d["bing_ai"], d["gsc"]), (before["bing_ai"], before["gsc"]))   # Bing und GSC unberuehrt
        self.assertEqual(d["updated"], "2026-12-04")
        self.assertIn("::notice::Google AI 2026-08-01 bis 2026-10-31: 1,250,000 Impressionen, 420 Seiten, 3 Wochen", out)
        self.assertNotIn("Google AI (Search Console Generative AI): neuer Export faellig", out)

    def test_google_cli_minimal_without_pages_and_weekly(self):
        self.put("google_ai", dict(U.google_empty(), status="ok", period={"from": "2026-07-01", "to": "2026-09-30"}, retrieved="2026-10-02",
                                   impressions=800000, pages=380, weekly=[["2026-06-29", 5000], ["2026-07-06", 6000], ["2026-08-03", 7000]]))
        code, out = self.run_main("--google-ai", "impressions=1.1M; from=2026-08-01; to=2026-10-31", "--skip-gsc")
        self.assertEqual(code, 0, out)
        g = self.ai()["google_ai"]
        self.assertEqual((g["status"], g["impressions"], g["pages"], g["retrieved"]), ("ok", 1100000, None, "2026-12-04"))   # pages nie aus altem Zeitraum
        self.assertEqual(g["weekly"], [["2026-08-03", 7000]])   # alte Wochen nur, soweit im neuen Zeitraum
        self.assertIn("bisherige Wochenwerte", out)

    def test_google_daily_csv_prefers_impressions(self):
        days = [date.fromordinal(date(2026, 9, 1).toordinal() + i) for i in range(30)]
        csv_txt = "Date,Clicks,Impressions,CTR\n" + "\n".join(f"{d.isoformat()},5,1000,0.5%" for d in days)
        code, out = self.run_main(env={"GOOGLE_AI": "impressions=30000; from=2026-09-01; to=2026-09-30; weekly=" + csv_txt})
        self.assertEqual(code, 0, out)
        self.assertEqual(self.ai()["google_ai"]["weekly"], [["2026-09-07", 7000], ["2026-09-14", 7000], ["2026-09-21", 7000]])

    def test_google_invalid_fails_and_writes_nothing(self):
        cases = [("impressions=5000", "from, to fehlt"),                                                  # Pflichtfelder fehlen
                 ("pages=10; from=2026-08-01; to=2026-10-31", "impressions fehlt"),
                 ("impressions=5000; from=2026-05-01; to=2026-06-30", "vor 2026-05-18"),                    # vor Beginn des Berichts
                 ("impressions=5000; from=2026-05-17; to=2026-06-30", "vor 2026-05-18"),
                 ("impressions=5000; from=2026-10-31; to=2026-08-01", "liegt nach"),
                 ("impressions=5000; from=2026-08-01; to=2026-12-24", "Zukunft"),
                 ("impressions=5000; from=2026-08-01; to=2026-02-30", "gueltiges Datum"),
                 ("impressions=5000; from=1.8.2026; to=2026-10-31", "YYYY-MM-DD"),
                 ("impressions=viele; from=2026-08-01; to=2026-10-31", "google_ai impressions"),
                 ("impressions=5000; pages=6000; from=2026-08-01; to=2026-10-31", "groesser als impressions"),
                 ("impressions=5000; pages=x; from=2026-08-01; to=2026-10-31", "google_ai pages"),
                 ("impressions=5000; from=2026-08-01; to=2026-10-31; retrieved=2026-10-01", "retrieved"),
                 ("impressions=5000; from=2026-08-01; to=2026-10-31; weekly=2026-07-06=100", "ausserhalb"),
                 ("impressions=1000; from=2026-08-01; to=2026-10-31; weekly=" + self.WEEKS, "25 %"),        # Wochensumme passt nicht
                 ("impressions=5000; from=2026-08-01; to=2026-10-31; weekly=2026-08-03=1, 2026-08-06=2", "7 Tage"),
                 ("impressions=5000; clicks=10; from=2026-08-01; to=2026-10-31", "unbekannter Schluessel")]
        for txt, msg in cases:
            before = self.raw()
            code, out = self.run_main(env={"GOOGLE_AI": txt})
            self.assertEqual(code, 1, (txt, out))
            self.assertIn("::error::", out)
            self.assertIn(msg, out, txt)
            self.assertEqual(self.raw(), before, txt)

    def test_google_weekly_sum_within_tolerance_ok(self):   # 25 % Spielraum wie bei Bing (Wochen ragen ueber den Zeitraum hinaus)
        code, out = self.run_main(env={"GOOGLE_AI": "impressions=220000; from=2026-08-01; to=2026-10-31; weekly=" + self.WEEKS})
        self.assertEqual(code, 0, out)

    def test_google_due_warning(self):
        code, out = self.run_main()
        self.assertEqual(code, 0, out)
        self.assertIn("::warning::Google AI (Search Console Generative AI): neuer Export faellig - Werte ueber die Workflow-Eingabe google_ai", out)

    def test_broken_google_block_fails(self):
        for blk, msg in [(dict(U.google_empty(), status="missing_secret"), "google_ai.status"),
                         (dict(U.google_empty(), status="ok"), "google_ai.period"),
                         (dict(U.google_empty(), status="ok", period={"from": "2026-05-01", "to": "2026-06-30"}, retrieved="2026-07-01",
                               impressions=10), "vor 2026-05-18"),
                         (dict(U.google_empty(), status="ok", period={"from": "2026-08-01", "to": "2026-08-31"}, retrieved="2026-09-01",
                               impressions=10, pages=11), "pages groesser"),
                         (dict(U.google_empty(), status="ok", period={"from": "2026-08-01", "to": "2026-08-31"}, retrieved="2026-09-01",
                               impressions=10, weekly=[["2026-08-03", 100]]), "25 %")]:
            self.put("google_ai", blk)
            code, out = self.run_main()
            self.assertEqual(code, 1, (blk, out))
            self.assertIn(msg, out, blk)


class Files(Base):
    def test_repo_seed_files_valid(self):
        """Echte Dateien des Repos: nur Aufbau und Format pruefen (die Werte aendert der Monatslauf)."""
        today = date(2099, 12, 31)   # Daten duerfen nicht in der Zukunft liegen - das prueft main() mit dem echten Datum
        ai = json.loads((ROOT / "data" / "stats" / U.AI_FILE).read_text("utf-8"))
        df = json.loads((ROOT / "data" / "stats" / U.DIFF_FILE).read_text("utf-8"))
        self.assertEqual(U.validate_ai(ai, today), [])
        self.assertEqual(U.validate_diff(df, today), [])
        self.assertEqual(list(ai), ["version", "_doc", "updated", "bing_ai", "google_ai", "gsc"])
        self.assertEqual(ai["_doc"], U.DOC)
        b = ai["bing_ai"]
        self.assertEqual(b["entered"], "manual")
        self.assertTrue(all(date.fromisoformat(w[0]).weekday() == 0 for w in b["weekly"]))
        self.assertEqual((ai["google_ai"]["entered"], ai["google_ai"]["source"]), ("manual", U.GOOGLE_AI_SOURCE))
        self.assertIn(ai["google_ai"]["status"], U.GOOGLE_STATUSES)
        self.assertEqual((ROOT / "data" / "stats" / U.AI_FILE).read_text("utf-8"), U.dump(ai) + "\n")   # Format wie vom Werkzeug geschrieben

    def test_fixture_valid(self):
        self.assertEqual(U.validate_ai(SEED_AI, date(2026, 11, 3)), [])
        self.assertEqual(sum(w[1] for w in SEED_AI["bing_ai"]["weekly"]), 1002100)

    def test_old_file_without_google_ai_gets_empty_block(self):
        d = self.ai(); del d["google_ai"]
        (self.dir / U.AI_FILE).write_text(U.dump(d) + "\n", "utf-8")
        self.assertEqual(U.validate_ai(d, TODAY), [])
        code, out = self.run_main()
        self.assertEqual(code, 0, out)
        self.assertEqual(self.ai()["google_ai"], U.google_empty())
        self.assertIn("google_ai fehlt", out)

    def test_invalid_difficulty_fails(self):
        d = json.loads(self.raw(U.DIFF_FILE)); d["levels"]["Windows 365"] = 5
        (self.dir / U.DIFF_FILE).write_text(json.dumps(d), "utf-8")
        before = self.raw()
        code, out = self.run_main()
        self.assertEqual(code, 1)
        self.assertIn("topic_difficulty.json ungueltig", out)
        self.assertEqual(self.raw(), before)

    def test_broken_existing_file_fails(self):
        (self.dir / U.AI_FILE).write_text('{"version": 1, "bing_ai": {"status": "ok"', "utf-8")
        code, out = self.run_main()
        self.assertEqual(code, 1)
        self.assertIn("kein gueltiges JSON", out)
        bad = {"version": 1, "bing_ai": {"status": "ok", "source": "x", "period": {"from": "2026-08-01", "to": "2026-10-30"}, "retrieved": "2026-11-01",
                                         "citations": -1, "cited_pages_per_day": 1, "weekly": []}, "gsc": {"status": "missing_secret", "source": "y"}}
        (self.dir / U.AI_FILE).write_text(json.dumps(bad), "utf-8")
        code, out = self.run_main()
        self.assertEqual(code, 1)
        self.assertIn("bing_ai.citations", out)

    def test_missing_file_is_created(self):
        (self.dir / U.AI_FILE).unlink()
        code, out = self.run_main()
        self.assertEqual(code, 0, out)
        d = self.ai()
        self.assertEqual((d["bing_ai"]["status"], d["google_ai"]["status"], d["gsc"]["status"], d["updated"]),
                         ("empty", "empty", "missing_secret", "2026-12-04"))
        self.assertIn("neuer Export faellig", out)

    def test_dry_run_writes_nothing(self):
        before = self.raw()
        env = {"BING_CITATIONS": "1200000", "BING_PAGES_PER_DAY": "640", "BING_FROM": "2026-09-01", "BING_TO": "2026-11-29"}
        code, out = self.run_main("--dry-run", env=env)
        self.assertEqual(code, 0, out)
        self.assertEqual(self.raw(), before)
        self.assertIn('"citations": 1200000', out)

    def test_second_run_is_noop_and_summary(self):
        env = {"BING_CITATIONS": "1200000", "BING_PAGES_PER_DAY": "640", "BING_FROM": "2026-09-01", "BING_TO": "2026-11-29"}
        self.assertEqual(self.run_main(env=env)[0], 0)
        first = self.raw()
        summ = self.dir / "summary.md"
        code, out = self.run_main(env={"GITHUB_STEP_SUMMARY": str(summ)}, today=date(2026, 12, 5))   # Monatslauf ohne Eingaben
        self.assertEqual((code, self.raw()), (0, first))      # nichts Neues -> kein neues "updated", kein Commit
        self.assertIn("unveraendert", out)
        s = summ.read_text("utf-8")
        self.assertIn("| Bing AI Performance | ok | 2026-09-01 bis 2026-11-29 | 2026-12-04 |", s)
        self.assertIn("| Google AI (Generative AI) | empty | - | - |", s)
        self.assertIn("Keine Aenderung", s)


if __name__ == "__main__":
    unittest.main(verbosity=1)
