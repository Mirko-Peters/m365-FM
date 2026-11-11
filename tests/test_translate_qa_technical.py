"""QA der Blog-Uebersetzung: Code, Links und reine Namen-Zeilen duerfen unveraendert bleiben, Fliesstext nicht."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import translate_blog as TB  # noqa: E402


class TechnicalUnits(unittest.TestCase):
    def ok(self, lang, src, out):
        return TB.qa(lang, src, out)[0]

    def reason(self, lang, src, out):
        return TB.qa(lang, src, out)[1]

    def test_namenzeilen_bleiben_unveraendert(self):
        for src in ("PnP PowerShell, Graph API, SharePoint Online Management Shell",
                    "Microsoft Certified: Azure Administrator Associate",
                    "Microsoft Defender for Cloud, Secure Score, Purview Audit",
                    "AustraliaEast, AustraliaSoutheast, CentralIndia, EastAsia, JapanEast, KoreaCentral"):
            self.assertTrue(self.ok("de", src, src), src)
            self.assertTrue(self.ok("ru", src, src), src)

    def test_code_und_links_bleiben_unveraendert(self):
        code = "<code>SigninLogs<br> | where TimeGenerated &gt;= ago(24h)<br> | extend ATIssue = parse_json(x)</code>"
        link = '<a href="https://www.m365.fm/canvas-apps-vs-model-driven-apps-simply-explained" rel="noopener">https://www.m365.fm/canvas-apps-vs-model-driven-apps-simply-explained</a>'
        for src in (code, link):
            self.assertTrue(self.ok("es", src, src))
            self.assertTrue(self.ok("ja", src, src))

    def test_fliesstext_unveraendert_faellt_weiter_durch(self):
        src = "We will discuss how Copilot reads your files and what it can do today"
        self.assertEqual(self.reason("de", src, src), "unuebersetzt")
        self.assertEqual(self.reason("ru", src, src), "falsche-schrift")
        head = "Take the Next Step on Your ESG Journey"
        self.assertEqual(self.reason("ru", head, head), "falsche-schrift")
        self.assertEqual(self.reason("de", "Take Care of Your Data and Stay Secure Today", "Take Care of Your Data and Stay Secure Today"), "unuebersetzt")

    def test_namen_in_uebersetzter_ueberschrift_zaehlen_nicht_als_lateinisch(self):
        self.assertTrue(self.ok("ja", "Google Cloud Identity and Google Workspace Explained", "Google Cloud Identity と Google Workspace の違い"))
        self.assertTrue(self.ok("he", "Data Factory and Dataflows in Fabric", "Data Factory ו-Dataflows ב-Fabric"))
        self.assertTrue(self.ok("ko", "Nationwide Building Society (UK)", "Nationwide Building Society (영국)"))
        self.assertTrue(self.ok("ru", "Opportunities and SalesOrders for Sales (revenue)", "Opportunities и SalesOrders для Sales (выручка)"))

    def test_englischer_text_in_fremder_schrift_faellt_durch(self):
        src = "Under the settings page you can select the policy that applies to your tenant."
        self.assertEqual(self.reason("ru", src, "Under the settings page you can select the policy that applies to your tenant."), "falsche-schrift")
        self.assertEqual(self.reason("ar", src, "Please open the settings page and choose the policy for your tenant now."), "falsche-schrift")

    def test_html_und_link_pruefung_bleiben_streng(self):
        self.assertEqual(self.reason("de", "<strong>Wichtig</strong> text here", "Wichtig text here"), "html-tags")
        self.assertEqual(self.reason("de", '<a href="https://a.example/x">x</a> end', '<a href="https://a.example/y">x</a> Ende'), "links")


if __name__ == "__main__":
    unittest.main()
