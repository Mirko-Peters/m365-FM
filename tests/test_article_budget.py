"""Artikel-Generator: Monatsgrenze und Kosten je Modell (Mirko, 6.11.2026)."""
import json, os, tempfile, unittest
from pathlib import Path
from unittest import mock

import generate_articles as GA


class ArticleBudgetTests(unittest.TestCase):
    def test_budget_defined_and_sonnet_default(self):
        self.assertIsInstance(GA.BUDGET_USD, float)
        self.assertIn("sonnet", GA.MODEL)

    def test_cost_per_model(self):
        s = GA.cost_usd(1_000_000, 1_000_000, 0, 0, "claude-sonnet-5-5")
        h = GA.cost_usd(1_000_000, 1_000_000, 0, 0, "claude-haiku-5-5")
        self.assertAlmostEqual(s, 12.0)
        self.assertAlmostEqual(h, 0.6)

    def test_month_without_usd_counts_as_sonnet(self):
        sd = {"2026-11": {"input_tokens": 1_000_000, "output_tokens": 1_000_000, "calls": 1}}
        self.assertAlmostEqual(GA.month_spend_usd(sd, "2026-11"), 12.0)
        self.assertEqual(GA.month_spend_usd({"2026-11": {"usd": 3.5}}, "2026-11"), 3.5)

    def test_main_stops_when_budget_reached(self):
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "data").mkdir()
            month = GA.time.strftime("%Y-%m", GA.time.gmtime())
            (Path(tmp) / "data" / "spend.json").write_text(json.dumps({month: {"usd": 999}}), "utf-8")
            with mock.patch.object(GA, "ROOT", Path(tmp)), mock.patch.dict(os.environ, {"ANTHROPIC_API_KEY": "x"}), \
                 mock.patch.object(GA, "popularity", side_effect=AssertionError("darf nicht laufen")):
                GA.main()   # kehrt vor jeder Arbeit zurueck
            self.assertFalse((Path(tmp) / "data" / "articles").exists())


if __name__ == "__main__":
    unittest.main()
