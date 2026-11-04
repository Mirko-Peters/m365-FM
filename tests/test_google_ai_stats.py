"""Google AI (Search Console, Bericht "Generative AI") auf /sponsor/, /services/ und in den Mediadaten: nur bei status "ok", nie geschaetzt."""
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

import site_i18n
import site_landing
import site_sponsor
import mediakit

GAI_OK = {"status": "ok", "source": "Google Search Console, Generative AI performance (AI Overviews and AI Mode)",
          "period": {"from": "2026-08-01", "to": "2026-10-31"}, "retrieved": "2026-11-04", "entered": "manual",
          "impressions": 1250000, "pages": 420, "weekly": []}
GAI_EMPTY = {"status": "empty", "source": GAI_OK["source"], "period": None, "retrieved": None, "entered": "manual",
             "impressions": None, "pages": None, "weekly": []}
BING_OK = {"status": "ok", "source": "Bing Webmaster Tools, AI Performance (Microsoft Copilot and partners)",
           "period": {"from": "2026-08-01", "to": "2026-10-30"}, "retrieved": "2026-11-01", "entered": "manual",
           "citations": 1100000, "cited_pages_per_day": 622, "weekly": []}


def ai_doc(gai):
    d = {"version": 1, "updated": "2026-11-04", "bing_ai": BING_OK, "gsc": {"status": "missing_secret", "source": "x"}}
    if gai is not None:
        d["google_ai"] = gai
    return d


class Base(unittest.TestCase):
    def with_file(self, doc):
        """data/stats/ai_performance.json fuer site_sponsor und mediakit durch doc ersetzen."""
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        st = Path(tmp.name) / "data" / "stats"
        st.mkdir(parents=True)
        (st / "ai_performance.json").write_text(json.dumps(doc), "utf-8")
        for p in (patch.object(site_sponsor, "D", Path(tmp.name) / "data"), patch.object(mediakit, "ROOT", Path(tmp.name))):
            p.start(); self.addCleanup(p.stop)


class Sponsor(Base):
    def render(self, lang="en"):
        stats = site_sponsor.load_stats()
        g = {"BASE": "https://example.test", "TODAY": "2026-11-04", "day": lambda d, l: d, "ents": {"x": {"id": "x", "name": "X"}}}
        quick, _, _ = site_sponsor.topics_for(g, lang, stats)
        return stats, site_sponsor.body_html(g, lang, stats, quick, {}, 42, 14, False)

    def test_card_when_ok(self):
        self.with_file(ai_doc(GAI_OK))
        stats, html = self.render()
        self.assertTrue(stats["google"]["ok"])
        self.assertIn("<b dir=\"auto\">1,250,000</b><span>impressions of m365.fm in Google AI Overviews and AI Mode</span>"
                      "<small>2026-08-01 – 2026-10-31</small>", html)
        self.assertIn("Source: Google Search Console, Generative AI performance (AI Overviews and AI Mode), 2026-08-01 – 2026-10-31. "
                      "Retrieved 2026-11-04.", html)
        self.assertLess(html.index("Copilot citations"), html.index("Google AI Overviews"))   # neben den Bing-KI-Karten
        _, de = self.render("de")
        self.assertIn("Impressionen von m365.fm in Google AI Overviews und im KI-Modus", de)
        self.assertIn("Quelle: Google Search Console, Generative AI performance", de)
        _, ja = self.render("ja")   # ohne Uebersetzung: Rueckfall je Schluessel auf en, Quellenzeile in der Sprache
        self.assertIn("impressions of m365.fm in Google AI Overviews and AI Mode", ja)
        self.assertIn("出典：Google Search Console, Generative AI performance", ja)

    def test_no_card_when_empty_or_missing(self):
        for gai in (GAI_EMPTY, None, dict(GAI_OK, status="empty"), dict(GAI_OK, impressions=None)):
            self.with_file(ai_doc(gai))
            stats, html = self.render()
            self.assertFalse(stats["google"]["ok"], gai)
            self.assertNotIn("Google AI Overviews", html)
            self.assertNotIn("Generative AI", html)
            self.assertIn("Copilot citations", html)   # Bing unveraendert

    def test_i18n_keys(self):
        for lang, d in site_sponsor.I18N.items():
            self.assertEqual(d.get("src_gai"), d.get("src_gsc"), lang)
        self.assertIn("card_gai", site_sponsor.EN)
        self.assertIn("card_gai", site_sponsor.I18N["de"])


class Landing(unittest.TestCase):
    def stats(self, gai):
        return {"bing": {"ok": False}, "gsc": {"ok": False}, "google": gai}

    def render(self, gai, lang="en"):
        with patch.object(site_i18n, "T", side_effect=lambda l, en, de: de if l == "de" else en):
            return site_landing._stats({"stats": self.stats(gai), "spreaker_downloads": -1}, lang)

    def test_row_when_ok(self):
        out = self.render(dict(GAI_OK, ok=True))
        self.assertIn('<div class="lp-stat"><b>1,250,000</b><span>Google AI Overview impressions</span>'
                      '<small>Source: Google Search Console, Generative AI · 2026-08-01 – 2026-10-31</small></div>', out)
        de = self.render(dict(GAI_OK, ok=True), "de")
        self.assertIn("<b>1.250.000</b><span>Impressionen in Google AI Overviews</span><small>Quelle: Google Search Console, Generative AI", de)

    def test_no_row_unless_ok(self):
        for gai in ({}, dict(GAI_OK, ok=False), None):
            self.assertEqual(self.render(gai), "")


class MediaKit(Base):
    def test_local_and_rows_when_ok(self):
        self.with_file(ai_doc(GAI_OK))
        loc = mediakit.local()
        self.assertEqual((loc["gai_impressions"], loc["gai_pages"], loc["gai_period"]), (1250000, 420, "2026-08-01–2026-10-31"))
        D = {"local": loc}
        self.assertIn(("Google AI impressions", "1,250,000", "Google Search Console, Generative AI", "2026-08-01–2026-10-31"),
                      mediakit.rows_for("en", D))
        self.assertIn(("Google-KI-Impressionen", "1.250.000", "Google Search Console, Generative AI", "2026-08-01–2026-10-31"),
                      mediakit.rows_for("de", D))

    def test_nothing_unless_ok(self):
        for gai in (GAI_EMPTY, None, dict(GAI_OK, status="empty"), dict(GAI_OK, period=None)):
            self.with_file(ai_doc(gai))
            loc = mediakit.local()
            self.assertNotIn("gai_impressions", loc, gai)
            self.assertFalse([r for r in mediakit.rows_for("en", {"local": loc}) if "Google AI" in r[0]])
            self.assertIn("ai_citations", loc)   # Bing unveraendert


if __name__ == "__main__":
    unittest.main()
