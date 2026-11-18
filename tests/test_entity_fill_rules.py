"""Pruefregeln von fill_entities nach der Auswertung vom 18.11.2026 (reports: tools/entity_fill_rejects.py): falsche Treffer fuer Superlative, Links
und geschuetzte Namen kosteten bezahlte Ergebnisse; echte Werbesprache, echte Links und Eigennamen bleiben verboten bzw. geschuetzt."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import fill_entities as FE  # noqa: E402


class Superlative(unittest.TestCase):
    def test_fachsprache_erlaubt(self):
        for t in ("following best practices for development", "Power Platform Governance Best Practices", "fits their responsibilities best",
                  "print-perfect PDFs", "wait for perfect conditions", "leading to errors", "Leading AI Transformation with Areti Iles"):
            self.assertIsNone(FE.SUPERLATIVES.search(t), t)

    def test_werbesprache_verboten(self):
        for t in ("the best tool for the job", "industry-leading security", "a leading provider of identity", "best-in-class", "the perfect solution",
                  "cutting-edge AI", "world-class support", "unmatched performance", "state-of-the-art models", "market leading"):
            self.assertIsNotNone(FE.SUPERLATIVES.search(t), t)


class Links(unittest.TestCase):
    def test_fachbegriffe_sind_keine_links(self):
        for t in ("ASP.NET Core", "VB.NET code", "ADO.NET", "@odata.nextLink and @odata.deltaLink", "the default contoso.onmicrosoft.com domain",
                  "WebSocket traffic to the office.com domain", "the cloud.microsoft domain", ".NET 8", "Node.js"):
            self.assertIsNone(FE.URL_RX.search(t), t)

    def test_links_bleiben_verboten(self):
        for t in ("see example.com for details", "https://learn.microsoft.com/x", "www.contoso.com", "write to info@contoso.com", "learn.microsoft.com/en-us/x"):
            self.assertIsNotNone(FE.URL_RX.search(t), t)


class Namen(unittest.TestCase):
    def test_eigennamen_geschuetzt(self):
        for n in ("Copilot Studio", "Microsoft 365", "MS-700", "PL-300", "Microsoft Graph", "Quick Access Toolbar"):
            self.assertTrue(FE.proper_name(n), n)

    def test_beschreibende_namen_uebersetzbar(self):
        for n in ("Azure portal", "Private channels", "Generative pages", "Fabric data agents", "GitHub Copilot coding agent", "Dataverse MCP server"):
            self.assertFalse(FE.proper_name(n), n)

    def test_uebersetzung_mit_uebersetztem_beschreibenden_namen(self):
        src = {"desc": "The Azure portal is Microsoft's web-based console for creating and managing Azure resources."}
        out = {"desc": "Das Azure-Portal ist die webbasierte Konsole von Microsoft zum Erstellen und Verwalten von Azure-Ressourcen."}
        rec, err = FE.validate_translation("de", src, out, FE.KEEP + ["Azure portal"])
        self.assertIsNone(err); self.assertEqual(rec["desc"], out["desc"])

    def test_eigenname_darf_nicht_uebersetzt_werden(self):
        src = {"desc": "Copilot Studio is a low-code tool for building agents in Microsoft 365 and Teams."}
        out = {"desc": "Copilot-Studio ist ein Low-Code-Werkzeug zum Erstellen von Agenten in Microsoft 365 und Teams."}
        self.assertEqual(FE.validate_translation("de", src, out, FE.KEEP + ["Copilot Studio"])[1], "name_changed")


if __name__ == "__main__":
    unittest.main()
