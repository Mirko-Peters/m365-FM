"""Kurzbeschreibung (meta description) in allen Sprachen: ein zu langer erster Satz endet an einer Satzfuge statt mit '…' (18.11.2026: die
KI-Uebersetzungen der Entitaeten machten fr/es/it/nl/id/ar ueber 2 % '…'-Schnitte, test_meta_entities wurde rot)."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import site_meta_entities as M  # noqa: E402


class Fuge(unittest.TestCase):
    def test_franzoesisch_vor_anschlusswort(self):
        t = ("Amazon Simple Storage Service (S3) est un service de stockage d'objets d'Amazon Web Services qui stocke les données sous forme "
             "d'objets dans des compartiments avec des métadonnées et des clés uniques pour un accès fiable")
        d = M.lead_text(t)
        self.assertTrue(d.endswith(".") and not d.endswith("…"), d)
        self.assertLessEqual(len(d), M.DESC_HI)

    def test_nicht_nach_tels_oder_basado(self):
        fr = ("L'agent de rapprochement de comptes est un agent IA dans Dynamics 365 Finance qui aide à rapprocher le grand livre général "
              "des sous-registres tels que les comptes clients et fournisseurs")
        self.assertFalse(M.lead_text(fr).endswith("tels."), M.lead_text(fr))
        es = ("Azure Automation State Configuration es un servicio de gestión de configuración basado en PowerShell Desired State Configuration "
              "(DSC) que mantiene las máquinas en el estado deseado")
        self.assertFalse(M.lead_text(es).endswith("basado."), M.lead_text(es))

    def test_arabisches_komma(self):
        t = ("بروتوكول A2A (Agent2Agent) هو بروتوكول مفتوح تستضيفه مؤسسة Linux، ويتيح لوكلاء الذكاء الاصطناعي المبنية على منصات مختلفة "
             "اكتشاف بعضها البعض وتفويض المهام والتعاون بشكل آمن")
        d = M.lead_text(t)
        self.assertTrue(d.endswith("."), d)

    def test_niederlaendisch_mit_sprache(self):
        t = ("Een functie van Microsoft Defender for Office 365 Plan 2 die realistische gesimuleerde phishingberichten naar gebruikers stuurt "
             "en op basis van hun gedrag gerichte training toewijst aan medewerkers")
        d = M.lead_text(t, lang="nl")
        self.assertTrue(d.endswith(".") and not d.endswith("…"), d)

    def test_deutsch_ohne_niederlaendische_woerter(self):
        t = ("Azure Kubernetes Service ist das verwaltete Kubernetes-Angebot von Microsoft bei dem Microsoft die Steuerungsebene betreibt "
             "und Kunden die Knoten in ihrem eigenen Abonnement verwalten")
        self.assertFalse(M.lead_text(t, lang="de").endswith("Microsoft."), M.lead_text(t, lang="de"))   # "die" ist im Deutschen ein Artikel, keine Fuge

    def test_nicht_in_offener_klammer(self):
        t = ("Une méthode d'organisation du lieu de travail en cinq étapes (trier, ranger, nettoyer, standardiser, maintenir) qui garde les outils "
             "à leur place et rend les problèmes visibles pour toute l'équipe")
        self.assertNotIn("(trier, ranger", M.lead_text(t, lang="fr").rsplit("(", 1)[-1] if M.lead_text(t, lang="fr").count("(") > M.lead_text(t, lang="fr").count(")") else "")

    def test_deutsch_nicht_im_nebensatz(self):
        t = ("Chain-of-Thought-Reasoning ist eine Technik, bei der ein Sprachmodell vor der endgültigen Antwort schrittweise Zwischenschritte "
             "formuliert und so komplexe Aufgaben besser löst als mit einer direkten Antwort")
        d = M.lead_text(t, 120, "de")
        self.assertFalse(d.endswith("vor."), d)
        t2 = ("Private Verbindung aus virtuellen Netzwerken zu Azure-PaaS-Diensten und Partnerdiensten über private Endpunkte statt über das öffentliche "
              "Internet, ohne dass Datenverkehr das Netz verlässt")
        d2 = M.lead_text(t2, 118, "de")
        self.assertFalse(d2.endswith("statt."), d2)   # nie auf einem Bindewort enden

    def test_englisch_unveraendert(self):
        t = ("A Ralph loop (Ralph Wiggum technique) repeatedly re-runs an AI coding agent on the same goal until a completion criterion is met, "
             "so agents keep working through long tasks without a human restarting them each time.")
        self.assertEqual(M.lead_text(t), "A Ralph loop (Ralph Wiggum technique) repeatedly re-runs an AI coding agent on the same goal until a completion criterion is met.")


if __name__ == "__main__":
    unittest.main()
