"""Cloudflare Web Analytics (RUM) fuer Mediadaten und Sponsor-Metriken: Abfrage mit Attrappen (kein Netz), Kuerzen auf den Start
von Web Analytics (29.10.2026), Fallback auf die ungefilterte Zonen-Statistik mit Warnung und ehrliche Beschriftung DE/EN.
Lauf: python3 -m pytest -q tests/test_cf_rum.py"""
import datetime as dt
import io
import json
import os
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tools"))
from tools import cf_rum  # noqa: E402
import tools.sponsor_metrics as SM  # noqa: E402
import mediakit as MK  # noqa: E402

ENV = {"CLOUDFLARE_API_TOKEN": "test-token-not-real", "R2_ACCOUNT_ID": "acc123", "CF_ZONE_ID": "zone1"}
SITES = {"success": True, "result_info": {"page": 1, "total_pages": 1}, "result": [
    {"site_tag": "other-tag", "ruleset": {"zone_name": "example.com"}, "rules": [{"host": "example.com"}]},
    {"site_tag": "tag-apex", "ruleset": {"zone_name": "m365.fm"}, "rules": []},
    {"site_tag": "tag-www", "ruleset": {"zone_name": "m365.fm"}, "rules": [{"host": "www.m365.fm"}]},
]}
RUM_DATA = {"data": {"viewer": {"accounts": [{
    "total": [{"count": 1234, "sum": {"visits": 456}}],
    "daily": [{"count": 100, "sum": {"visits": 40}, "dimensions": {"date": "2026-10-29"}},
              {"count": 1134, "sum": {"visits": 416}, "dimensions": {"date": "2026-11-04"}}],
    "countries": [{"count": 617, "dimensions": {"countryName": "US"}}, {"count": 300, "dimensions": {"countryName": "DE"}}],
}]}}, "errors": None}
ZONE_DATA = {"data": {"viewer": {"zones": [{"httpRequests1dGroups": [
    {"dimensions": {"date": "2026-11-03"}, "sum": {"pageViews": 9000, "countryMap": [{"clientCountryName": "US", "requests": 30}, {"clientCountryName": "SG", "requests": 70}]}},
]}]}}, "errors": None}
DENIED = {"data": None, "errors": [{"message": "not authorized for that account"}]}


class FakeCF:
    """Antwortet wie die Cloudflare-API; merkt sich Aufrufe (ohne Header-Ausgabe)."""
    def __init__(self, rum=RUM_DATA, sites=SITES, sites_status=200, path_counts=None):
        self.rum, self.sites, self.sites_status, self.path_counts, self.calls = rum, sites, sites_status, path_counts or {}, []

    def __call__(self, url, data=None, headers=None, timeout=60):
        body = json.loads(data.decode()) if data else None
        self.calls.append((url, body))
        assert headers["authorization"] == "Bearer test-token-not-real"
        if url.startswith(cf_rum.API + "/accounts/acc123/rum/site_info/list"): return self.sites_status, self.sites
        if url == cf_rum.API + "/graphql" and "rumPageloadEventsAdaptiveGroups" in body["query"]:
            if self.rum is DENIED: return 200, DENIED
            if "requestPath" in body["query"]:
                n = self.path_counts.get(body["variables"]["p"])
                day = body["variables"]["s"][:10]
                return 200, {"data": {"viewer": {"accounts": [{"rumPageloadEventsAdaptiveGroups": [] if n is None else [{"count": n, "dimensions": {"date": day}}]}]}}}
            return 200, self.rum
        return 404, {}


def zone_http(url, data=None, headers=None, timeout=60):
    """mediakit.http fuer den Zonen-Fallback."""
    if "/graphql" in url and b"httpRequests1dGroups" in (data or b""): return 200, ZONE_DATA
    return 404, {}


def run_quiet(fn, *a, **kw):
    buf = io.StringIO()
    with redirect_stdout(buf): res = fn(*a, **kw)
    return res, buf.getvalue()


class RumTests(unittest.TestCase):
    def setUp(self):
        SM.rum_connection.cache_clear()

    def test_site_tag_discovery_prefers_www_and_variable_wins(self):
        fake = FakeCF()
        with patch.dict(os.environ, ENV, clear=False), patch.object(cf_rum, "_http", fake):
            os.environ.pop("CF_RUM_SITE_TAG", None); os.environ.pop("CF_ACCOUNT_ID", None); os.environ.pop("CLOUDFLARE_ACCOUNT_ID", None)
            self.assertEqual(cf_rum.Rum.connect().site_tag, "tag-www")
            with patch.dict(os.environ, {"CF_RUM_SITE_TAG": "configured"}):
                n = len(fake.calls)
                self.assertEqual(cf_rum.Rum.connect().site_tag, "configured")
                self.assertEqual(len(fake.calls), n, "mit Variable keine Site-Suche")
        with patch.dict(os.environ, ENV), patch.object(cf_rum, "_http", FakeCF(sites_status=403, sites={"success": False, "errors": [{"message": "Authentication error"}]})):
            os.environ.pop("CF_RUM_SITE_TAG", None)
            with self.assertRaises(cf_rum.RumError) as e: cf_rum.Rum.connect()
            self.assertIn("CF_RUM_SITE_TAG", str(e.exception)); self.assertNotIn("test-token", str(e.exception))

    def test_clamp_and_labels(self):
        self.assertEqual(cf_rum.clamp(dt.date(2026, 10, 6), dt.date(2026, 11, 4)), (dt.date(2026, 10, 29), dt.date(2026, 11, 4), True))
        self.assertEqual(cf_rum.clamp(dt.date(2026, 11, 6), dt.date(2026, 12, 5)), (dt.date(2026, 11, 6), dt.date(2026, 12, 5), False))
        self.assertEqual(cf_rum.clamp(dt.date(2026, 10, 1), dt.date(2026, 10, 20))[0], None)
        self.assertEqual(cf_rum.period_label("de", dt.date(2026, 10, 29), dt.date(2026, 11, 4), True), "seit 29.10.2026 (7 Tage)")
        self.assertEqual(cf_rum.period_label("en", dt.date(2026, 10, 29), dt.date(2026, 11, 4), True), "since 29 Oct 2026 (7 days)")
        self.assertEqual(cf_rum.period_label("en", dt.date(2026, 11, 6), dt.date(2026, 12, 5), False), "last 30 days")

    def mediakit_cloudflare(self, today, fake):
        with patch.dict(os.environ, ENV), patch.object(cf_rum, "_http", fake), patch.object(MK, "http", zone_http), patch.object(MK, "TODAY", today):
            os.environ.pop("CF_RUM_SITE_TAG", None)
            return run_quiet(MK.cloudflare)

    def test_mediakit_rum_success_is_clamped_and_labelled(self):
        fake = FakeCF()
        c, log = self.mediakit_cloudflare(dt.date(2026, 11, 5), fake)
        self.assertEqual(c["source"], "rum")
        self.assertEqual((c["pageviews30"], c["visits30"]), (1234, 456))
        self.assertEqual(c["period30"], "2026-10-29–2026-11-04"); self.assertTrue(c["clamped"])
        self.assertEqual(c["daily"], [["2026-10-29", 100]] + [[f"2026-{d}", 0] for d in ("10-30", "10-31", "11-01", "11-02", "11-03")] + [["2026-11-04", 1134]],
                         "jeder Tag ab Start, fehlende Tage als gemessene 0")
        self.assertEqual(c["countries"], [["US", 50.0], ["DE", 24.3]])
        q = [b for u, b in fake.calls if b][-1]
        self.assertEqual((q["variables"]["s"], q["variables"]["u"], q["variables"]["t"], q["variables"]["a"]),
                         ("2026-10-29T00:00:00Z", "2026-11-05T00:00:00Z", "tag-www", "acc123"), "Zeitraum ab Start, bis gestern inklusive")
        self.assertNotIn("test-token", log)
        D = {"cloudflare": c}
        de = {r[0]: r for r in MK.rows_for("de", D)}; en = {r[0]: r for r in MK.rows_for("en", D)}
        self.assertEqual(de["Website-Seitenaufrufe"][1:], ("1.234", "Cloudflare Web Analytics (echte Seitenaufrufe im Browser, weitgehend ohne Bots)", "seit 29.10.2026 (7 Tage)"))
        self.assertEqual(de["Website-Besuche"][1], "456")
        self.assertEqual(en["Website page views"][2:], ("Cloudflare Web Analytics (real browser page loads, bots largely excluded)", "since 29 Oct 2026 (7 days)"))
        self.assertNotIn("letzte 30 Tage", de["Website-Seitenaufrufe"], "nie 30 Tage behaupten, wenn es weniger sind")

    def test_mediakit_rum_full_window_after_start(self):
        c, _ = self.mediakit_cloudflare(dt.date(2026, 12, 15), FakeCF())
        self.assertFalse(c["clamped"]); self.assertEqual(c["period30"], "2026-11-15–2026-12-14")
        self.assertEqual(MK.rows_for("de", {"cloudflare": c})[0][3], "letzte 30 Tage")

    def test_mediakit_fallback_to_zone_with_warning_and_unfiltered_label(self):
        with patch.dict(os.environ, {"GITHUB_ACTIONS": "true"}):
            c, log = self.mediakit_cloudflare(dt.date(2026, 11, 5), FakeCF(rum=DENIED))
        self.assertEqual(c["source"], "zone"); self.assertEqual(c["pageviews30"], 9000)
        self.assertIn("::warning title=Cloudflare Web Analytics::", log); self.assertIn("Account Analytics: Read", log)
        self.assertNotIn("test-token", log)
        row = MK.rows_for("de", {"cloudflare": c})[0]
        self.assertEqual(row[2], "Cloudflare-Randstatistik (ungefiltert, inkl. Bots)"); self.assertEqual(row[3], "letzte 30 Tage")
        self.assertIn("unfiltered", MK.rows_for("en", {"cloudflare": c})[0][2])
        self.assertEqual(len(MK.rows_for("de", {"cloudflare": c})), 1, "Fallback ohne Besuche (unique IPs waeren bot-verzerrt)")

    def test_mediakit_without_account_id_falls_back(self):
        env = {k: v for k, v in ENV.items() if k != "R2_ACCOUNT_ID"}
        with patch.dict(os.environ, env), patch.object(cf_rum, "_http", FakeCF()), patch.object(MK, "http", zone_http):
            for k in ("R2_ACCOUNT_ID", "CF_ACCOUNT_ID", "CLOUDFLARE_ACCOUNT_ID"): os.environ.pop(k, None)
            c, log = run_quiet(MK.cloudflare)
        self.assertEqual(c["source"], "zone"); self.assertIn("Konto-ID fehlt", log)

    def test_pdf_builds_with_rum_and_zone(self):
        F = {k: ("Helvetica-Bold" if "Bold" in k or "Semi" in k else "Helvetica") for k in MK.FONT_URLS}
        for today, fake in ((dt.date(2026, 11, 5), FakeCF()), (dt.date(2026, 11, 5), FakeCF(rum=DENIED))):
            c, _ = self.mediakit_cloudflare(today, fake)
            with tempfile.TemporaryDirectory() as tmp:
                for lang in ("en", "de"):
                    p = Path(tmp) / f"mk-{lang}.pdf"
                    run_quiet(MK.build_pdf, p, lang, {"generated": "2026-11-05", "cloudflare": c, "local": {}}, F)
                    self.assertGreater(p.stat().st_size, 1000)

    # ---------- Sponsor-Metriken ----------
    def sponsor_rows(self, day, fake):
        placements = [{"id": "p1", "langs": "en", "refs": '{"page_paths":["/entity/a/","/entity/b/"]}'}]
        out, st = [], {}
        zone = {"data": {"viewer": {"zones": [{"httpRequestsAdaptiveGroups": [{"dimensions": {"date": day}, "count": 77}]}]}}}
        with patch.dict(os.environ, ENV), patch.object(cf_rum, "_http", fake), patch.object(SM, "slug_rows", return_value={}), \
             patch.object(SM, "json_request", return_value=(200, zone, {})):
            os.environ.pop("CF_RUM_SITE_TAG", None)
            _, log = run_quiet(SM.cloudflare, placements, day, out, st)
        return out, st, log

    def test_sponsor_metrics_rum_rows_include_measured_zero(self):
        out, st, _ = self.sponsor_rows("2026-11-03", FakeCF(path_counts={"/entity/a/": 12}))
        self.assertEqual(sorted((r["dim"], r["value"], r["source"]) for r in out), [("/entity/a/", 12, "cloudflare_rum"), ("/entity/b/", 0, "cloudflare_rum")])
        self.assertIn("Web Analytics", st["Cloudflare"])

    def test_sponsor_metrics_fallback_to_zone_when_rum_denied(self):
        out, st, log = self.sponsor_rows("2026-11-03", FakeCF(rum=DENIED))
        self.assertEqual({r["source"] for r in out}, {"cloudflare"}); self.assertEqual({r["value"] for r in out}, {77})
        self.assertIn("ungefiltert", st["Cloudflare"]); self.assertIn("Fallback", log); self.assertNotIn("test-token", log)

    def test_sponsor_metrics_days_before_start_use_zone(self):
        fake = FakeCF(path_counts={"/entity/a/": 5})
        out, st, _ = self.sponsor_rows("2026-10-27", fake)
        self.assertEqual({r["source"] for r in out}, {"cloudflare"})
        self.assertFalse(any(b and "requestPath" in b["query"] for _, b in fake.calls), "kein RUM-Abruf vor dem Start")


if __name__ == "__main__":
    unittest.main()
