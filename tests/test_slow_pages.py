"""Langsame Seiten (tools/slow_pages.py): Web-Vitals-Abfrage mit Attrappe (kein Netz) - Rangfolge, Grenzwerte, Mindestmessungen,
Pfad-Normalisierung, CRP_PATHS-Zeile, leere Daten, Introspektion und Kuerzung auf den Start von Web Analytics.
Lauf: python3 -m unittest tests/test_slow_pages.py"""
import datetime as dt
import json
import os
import sys
import unittest
from unittest.mock import patch

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
from tools import cf_rum, slow_pages as SP  # noqa: E402

TODAY = dt.date(2026, 11, 17)   # Dienstag


def g(path, device, count, lcp_ms, inp_ms=100, cls=0.01, fcp_ms=900, si=1):
    """Gruppe wie von Cloudflare: count hochgerechnet (Beacons x sampleInterval), Zeiten in Mikrosekunden."""
    return {"count": count, "avg": {"sampleInterval": si}, "dimensions": {"requestPath": path, "deviceType": device},
            "quantiles": {"largestContentfulPaintP75": lcp_ms * 1000, "interactionToNextPaintP75": inp_ms * 1000,
                          "cumulativeLayoutShiftP75": cls, "firstContentfulPaintP75": fcp_ms * 1000}}


GROUPS = [
    g("/", "mobile", 400, 2100),                                   # gut
    g("/show/episodes/a/", "mobile", 120, 5200),                   # schlecht (LCP)
    g("/de/show/episodes/a/", "mobile", 60, 4600),                 # schlecht (LCP), gleiche Seite auf Deutsch
    g("/entity/copilot/", "desktop", 80, 3100),                    # verbesserungswuerdig (LCP)
    g("/community/", "mobile", 50, 2000, inp_ms=650),              # schlecht (INP), LCP gut
    g("/blog/x/", "mobile", 30, 3000, cls=0.3),                    # schlecht (CLS)
    g("/rare/", "mobile", 5, 9000),                                # zu wenige Messungen
    g("/show/episodes/b/index.html", "mobile", 15, 4200),          # + Query-Variante -> zusammen 30 Messungen
    g("/show/episodes/b/?utm=x", "mobile", 15, 4400),
    g("/pl/", "tablet", 25, -1, inp_ms=-1, cls=-1),                # nichts gemessen
    g("/sampled/", "mobile", 100, 9000, si=10),                    # hochgerechnet 100, aber nur 10 echte Beacons
    g("/admin/x/", "desktop", 400, 9000),                          # nicht oeffentlich -> ausgelassen
]

QUANT_FIELDS = ["largestContentfulPaintP75", "interactionToNextPaintP75", "cumulativeLayoutShiftP75", "firstContentfulPaintP75",
                "timeToFirstByteP75", "firstInputDelayP75"]


def _t(name, fields):
    return {"data": {"__type": {"fields": [{"name": f, "type": {"name": None, "kind": "LIST", "ofType": {"name": t, "kind": "OBJECT"}}}
                                           for f, t in fields.items()]}}}


TYPES = {"Query": {"viewer": "viewer"}, "viewer": {"accounts": "account"}, "account": {SP.DATASET: "grp", "rumPageloadEventsAdaptiveGroups": "x"},
         "grp": {"count": "uint64", "quantiles": "q", "dimensions": "d", "avg": "a"}, "a": {"sampleInterval": "float64"}, "q": {f: "float64" for f in QUANT_FIELDS},
         "d": {"requestPath": "string", "deviceType": "string", "date": "Date"}}


class FakeCF:
    def __init__(self, groups=GROUPS, introspect=True, types=TYPES, errors=None):
        self.groups, self.introspect, self.types, self.errors, self.queries = groups, introspect, types, errors, []

    def __call__(self, url, data=None, headers=None, timeout=60):
        assert url == cf_rum.API + "/graphql"
        body = json.loads(data.decode())
        q = body["query"]
        if "__schema" in q:
            return (200, {"data": {"__schema": {"queryType": {"name": "Query"}}}}) if self.introspect else (200, {"errors": [{"message": "introspection disabled"}]})
        if "__type" in q:
            name = body["variables"]["n"]
            return 200, _t(name, self.types.get(name, {}))
        self.queries.append(body)
        if self.errors: return 200, {"data": None, "errors": [{"message": self.errors}]}
        return 200, {"data": {"viewer": {"accounts": [{SP.DATASET: self.groups}]}}, "errors": None}


def run(fake, **kw):
    rum = cf_rum.Rum("test-token-not-real", "acc123", "tag")
    with patch.object(cf_rum, "_http", fake):
        return SP.run(today=kw.pop("today", TODAY), rum=rum, **kw)


class SlowPagesTests(unittest.TestCase):
    def test_path_normalisation(self):
        self.assertEqual(SP.norm_path("/show/x/index.html"), "/show/x/")
        self.assertEqual(SP.norm_path("/show/x/?a=1#b"), "/show/x/")
        self.assertEqual(SP.norm_path("https://www.m365.fm//de//x/"), "/de/x/")
        self.assertEqual(SP.norm_path(""), "/")
        self.assertEqual(SP.norm_path("index.html"), "/")
        self.assertEqual(SP.strip_lang("/de/show/x/"), ("/show/x/", "de"))
        self.assertEqual(SP.strip_lang("/de"), ("/", "de"))
        self.assertEqual(SP.strip_lang("/design/"), ("/design/", "en"), "nur echte Sprachpraefixe")
        self.assertEqual(SP.page_type("/pl/show/episodes/a/"), "/show/episodes/*")
        self.assertEqual(SP.page_type("/de/"), "/ (Startseite)")
        self.assertEqual(SP.page_type("/de/entity/"), "/entity/")
        self.assertEqual(SP.page_type("/entity/smed/"), "/entity/*")
        self.assertEqual(SP.page_type("/community/u/mirko-p/blog/x/"), "/community/u/*")

    def test_thresholds(self):
        self.assertEqual([SP.rate("lcp", v) for v in (2500, 2501, 4000, 4001)], [0, 1, 1, 2])
        self.assertEqual([SP.rate("inp", v) for v in (200, 201, 500, 501)], [0, 1, 1, 2])
        self.assertEqual([SP.rate("cls", v) for v in (0.1, 0.11, 0.25, 0.26)], [0, 1, 1, 2])
        self.assertIsNone(SP.rate("lcp", None))
        self.assertIsNone(SP._val(-1, "us"))
        self.assertEqual(SP._val(2_500_000, "us"), 2500.0)

    def test_ranking_min_samples_and_crp_line(self):
        fake = FakeCF()
        out = run(fake)
        lines = out.splitlines()
        self.assertEqual(lines[-1], "CRP_PATHS: /show/episodes/a/ /de/show/episodes/a/ /show/episodes/b/")
        rank = [l for l in lines if l.startswith("| ") and l[2].isdigit()]
        first = rank[:6]
        # schlecht vor verbesserungswuerdig vor gut; innerhalb gleicher Bewertung hoeheres LCP zuerst
        self.assertIn("`/show/episodes/a/` | mobile | 120 | 120 | 5,20 s", first[0])
        self.assertIn("`/de/show/episodes/a/`", first[1])
        self.assertIn("`/show/episodes/b/` | mobile | 30 | 30 | 4,30 s", first[2], "index.html und Query zusammengelegt, LCP gewichtet")
        self.assertIn("schlecht (CLS)", first[3]); self.assertIn("schlecht (INP)", first[4])
        self.assertIn("verbesserungswürdig (LCP)", first[5])
        self.assertNotIn("/rare/", out, "unter Mindestmessungen")
        self.assertNotIn("/sampled/", out, "Mindestmessungen gelten fuer echte Beacons, nicht fuer hochgerechnete Aufrufe")
        self.assertNotIn("admin", out)
        self.assertIn("`/pl/` | tablet | 25 | 25 | – | – | – |", out, "nicht gemessen -> Strich")
        self.assertIn("avg{sampleInterval}", fake.queries[0]["query"])
        self.assertIn("timeToFirstByteP75", out); self.assertIn("TTFB p75", out); self.assertIn("bestätigt", out)
        q = fake.queries[0]
        self.assertIn("rumWebVitalsEventsAdaptiveGroups", q["query"]); self.assertIn("requestPath deviceType", q["query"])
        self.assertEqual((q["variables"]["s"], q["variables"]["u"]), ("2026-11-10T00:00:00Z", "2026-11-17T00:00:00Z"), "7 abgeschlossene Tage")
        self.assertIn("Sprachen", out); self.assertIn("de en", out, "Sprachen nur in der Anzeige zusammengefasst")
        self.assertIn("/show/episodes/*", out)
        self.assertNotIn("test-token", out)

    def test_top_and_min_samples_options_mobile_first(self):
        out = run(FakeCF(), top=10, min_samples=60)
        paths = out.splitlines()[-1].split(" ", 1)[1].split()
        self.assertEqual(paths, ["/show/episodes/a/", "/de/show/episodes/a/", "/entity/copilot/"], "mobil zuerst, dann Desktop; nur > gut")
        self.assertNotIn("/community/` | mobile", out)

    def test_crp_paths_worst_first_then_mobile(self):
        rows = sorted([SP.finish({"path": p, "device": d, "count": 50, "samples": 50, "lcp": l}) for p, d, l in
                       (("/m-ni/", "mobile", 3500), ("/d-poor/", "desktop", 6000), ("/m-poor/", "mobile", 4500), ("/d-ni/", "desktop", 3900),
                        ("/good/", "mobile", 1000))], key=SP.rank_key)
        self.assertEqual(SP.crp_paths(rows, 3), ["/m-poor/", "/d-poor/", "/m-ni/"])
        self.assertEqual(SP.crp_paths(rows, 10), ["/m-poor/", "/d-poor/", "/m-ni/", "/d-ni/"], "gute Seiten nie")

    def test_empty_and_all_good(self):
        out = run(FakeCF(groups=[]))
        self.assertIn("Keine Web-Vitals-Messungen", out); self.assertEqual(out.splitlines()[-1], "CRP_PATHS:")
        out = run(FakeCF(groups=[g("/", "mobile", 100, 1200)]))
        self.assertIn("kein Labortest nötig", out); self.assertEqual(out.splitlines()[-1], "CRP_PATHS: ")

    def test_rum_start_cutoff(self):
        out = run(FakeCF(), today=dt.date(2026, 11, 2), days=7)
        self.assertIn("gekürzt auf den Start von Web Analytics am 2026-10-29", out)
        self.assertIn("2026-10-29 bis 2026-11-01 (4 Tage", out)
        fake = FakeCF()
        out = run(fake, today=dt.date(2026, 10, 20))
        self.assertIn("vor dem Start", out); self.assertEqual(fake.queries, [], "keine Abfrage vor RUM_START")

    def test_without_introspection_uses_verified_fields_and_fid_fallback(self):
        fake = FakeCF(introspect=False)
        out = run(fake)
        self.assertIn("Introspektion nicht möglich", out)
        self.assertNotIn("timeToFirstByteP75", fake.queries[0]["query"], "TTFB nur nach Bestaetigung im Schema")
        self.assertIn("avg{sampleInterval}", fake.queries[0]["query"], "oeffentlich belegt")
        types = dict(TYPES, q={f: "float64" for f in QUANT_FIELDS if f != "interactionToNextPaintP75"}, d={"requestPath": "string"})
        fake = FakeCF(types=types, groups=[{"count": 50, "dimensions": {"requestPath": "/x/"},
                                            "quantiles": {"largestContentfulPaintP75": 4_500_000, "firstInputDelayP75": 50_000}}])
        out = run(fake)
        self.assertIn("firstInputDelayP75", fake.queries[0]["query"]); self.assertIn("FID p75", out)
        self.assertNotIn("deviceType", fake.queries[0]["query"]); self.assertIn("ohne Geräte-Aufteilung", out)
        self.assertIn("avg{sampleInterval}", fake.queries[0]["query"])
        nosi = FakeCF(types=dict(TYPES, grp={"count": "uint64", "quantiles": "q", "dimensions": "d"}))
        out2 = run(nosi)
        self.assertNotIn("avg{", nosi.queries[0]["query"]); self.assertIn("sampleInterval fehlt", out2)
        self.assertEqual(out.splitlines()[-1], "CRP_PATHS: /x/")

    def test_errors(self):
        with self.assertRaises(cf_rum.RumError):
            run(FakeCF(types=dict(TYPES, account={"other": "x"})))
        with self.assertRaises(cf_rum.RumError) as e:
            run(FakeCF(errors="unknown field deviceType"))
        self.assertIn("unknown field deviceType", str(e.exception))
        env = {"CF_ANALYTICS_TOKEN": "", "CLOUDFLARE_API_TOKEN": "", "CF_ACCOUNT_ID": "", "CLOUDFLARE_ACCOUNT_ID": "", "R2_ACCOUNT_ID": ""}
        with patch.dict(os.environ, env), patch("sys.stdout") as so:
            self.assertEqual(SP.main([]), 1)
        printed = "".join(str(c.args[0]) for c in so.write.call_args_list if c.args)
        self.assertIn("CRP_PATHS:", printed)


if __name__ == "__main__":
    unittest.main()
