"""Gemeinsamer Namensindex (site_entmatch) und Kontext-Links nach Mirkos Regeln (Audit Linktexte, gap 2 / E2, E3, E7).
Faelle aus dem Bericht: 'attack surface' ist nicht Microsoft Surface, '[Teams] must distinguish' ohne M365-Kontext kein Link, 'Apply to Each Loop'
nicht Microsoft Loop, 'data governance' mitten im Satz wird verlinkt. Dazu: keine Obergrenze, erste Nennung je Seite, keine Links in Ueberschriften,
Bildunterschriften oder auf die eigene Seite, bestehende Links ohne Doppel, Linktext wie im Satz mit kanonischem Namen im title."""
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_learn as LRN   # noqa: E402
import site_entmatch as EM   # noqa: E402
import site_topics as TOP   # noqa: E402
import site_sidebar as SB   # noqa: E402

U = lambda i: f"/entity/{i}/"


def links(h):
    return re.findall(r'<a href="/entity/([a-z0-9-]+)/" class="[^"]*"[^>]*>([^<]+)</a>', h)


class Bericht(unittest.TestCase):
    """Echte Faelle aus dem Pruefbericht."""
    @classmethod
    def setUpClass(cls):
        cls.m = EM.shared(LRN.ENTS)

    def test_attack_surface_ist_kein_surface(self):
        t = "Reduce the attack surface of every tenant: Conditional Access and Defender close the gaps."
        self.assertNotIn("microsoft-surface", self.m.ids(t))
        self.assertNotIn("microsoft-surface", {e["id"] for e in SB.Index().match(t, 12)})
        h, _, = TOP.autolink_html(f"<p>{t}</p>", LRN.ENTS, U)[:2]
        self.assertNotIn("/entity/microsoft-surface/", h)

    def test_teams_als_personengruppe_ohne_kontext_kein_link(self):
        # scope-first-industrial-data-use-case: "[Teams] must distinguish between administrative efficiency ..."
        h, al = TOP.autolink_html("<p>Teams must distinguish between administrative efficiency and operational safety on the shop floor.</p>", LRN.ENTS, U)
        self.assertNotIn("/entity/teams/", h)
        # auch mit M365-Kontext bleibt der Satzanfang ohne Eigennamen-Stellung ohne Link
        h, _ = TOP.autolink_html("<p>Teams must distinguish between drafts and records in SharePoint.</p>", LRN.ENTS, U, ctx=["sharepoint", "microsoft-365"])
        self.assertNotIn("/entity/teams/", h)

    def test_teams_als_produkt_mit_kontext(self):
        h, _ = TOP.autolink_html("<p>Files in SharePoint show up in Teams for every project.</p>", LRN.ENTS, U)
        self.assertIn(("teams", "Teams"), links(h))

    def test_apply_to_each_loop_ist_kein_loop(self):
        h, _ = TOP.autolink_html("<p>The Apply to Each Loop Limit in Power Automate stops at 5,000 items.</p>", LRN.ENTS, U)
        self.assertNotIn("/entity/microsoft-loop/", h)
        self.assertIn("/entity/power-automate/", h)
        h, _ = TOP.autolink_html("<p>Share Loop components in Outlook and Teams chats.</p>", LRN.ENTS, U)
        self.assertIn("/entity/microsoft-loop/", h)

    def test_titelzeilen_ohne_eigenname(self):
        # Simulation ueber die Altbeitraege: fett gesetzte Zwischenzeilen in Titel-Schreibung waren Fehltreffer
        for t in ("Attack Surface and Real Threats:", "Close the Loop:", "Regulatory Shifts:", "Monitor, Audit, and React in Real Time:"):
            h, _ = TOP.autolink_html(f"<p><strong>{t}</strong> Intune and Teams in Microsoft 365 with React apps.</p>", LRN.ENTS, U)
            for i in ("microsoft-surface", "microsoft-loop", "teams-shifts", "react"):
                self.assertNotIn(f'/entity/{i}/" class="en-al" title="Microsoft Surface">Surface</a> and Real', h)
            self.assertFalse(re.search(r'<strong>[^<]*<a ', h), h)

    def test_konzept_kurzname_als_verb(self):
        m = EM.shared(LRN.ENTS)
        self.assertNotIn("power-automate-trigger", m.ids("A rogue copilot might trigger a lockdown in Power Automate flows."))
        self.assertIn("power-automate-trigger", m.ids("The trigger starts the flow in Power Automate."))
        self.assertNotIn("agent-harness", m.ids("How you harness it with AI agents decides the outcome."))

    def test_stichprobe_fehltreffer(self):
        # Fehltreffer aus der Stichprobe (150 Links der Altbeitraege): Verb nach Komma, Kurzform eines Fabric-Begriffs, mehrdeutige Abkuerzung
        m = EM.shared(LRN.ENTS)
        self.assertNotIn("power-automate-trigger", m.ids("These workflows can change data, trigger actions, or share information in Power Automate."))
        self.assertNotIn("fabric-task-flow", m.ids("Copilot orchestrates chat, meetings, and task flows in Microsoft Teams."))
        self.assertNotIn("permission-creep-index", m.ids("The finance team had to add third-party PCI tools for transactions."))
        self.assertIn("dlp", m.ids("Enforce DLP policies in Microsoft Purview."))

    def test_titel_reihe_nach_satzende(self):
        # Show Notes ohne Zeilenumbrueche: "... features. Attack Surface Reduction Reduces ..." (naechstes Wort gross = Titel-Reihe)
        m = EM.shared(LRN.ENTS)
        t = "Defender for Endpoint offers threat protection features. Attack Surface Reduction Reduces the attack surface of Intune devices."
        self.assertNotIn("microsoft-surface", m.ids(t))
        self.assertIn("microsoft-surface", m.ids("Intune also manages Surface devices in Microsoft 365."))

    def test_konzept_alias_anderer_begriff_nur_mit_kontext(self):
        m = EM.shared(LRN.ENTS)
        self.assertNotIn("copilot-adoption", m.ids("Change management and decision rights are key for any program."))

    def test_data_governance_mitten_im_satz(self):
        # 7-surprising-facts-about-copilot-for-power-bi: 'data governance' blieb unverlinkt (Muster mit Beachtung der Schreibung)
        h, al = TOP.autolink_html("<p>Copilot for Power BI depends on clean models and strong data governance across the tenant.</p>", LRN.ENTS, U)
        self.assertIn('<a href="/entity/data-governance/" class="en-al" title="Data governance">data governance</a>', h)

    def test_react_nur_als_eigenname(self):
        t = "Star schemas make filters and visuals react quickly for users in Power BI."
        self.assertNotIn("react", self.m.ids(t))
        self.assertNotIn("react", {e["id"] for e in SB.Index().match(t, 12)})

    def test_kurzname_mit_zusatz_nur_mit_kontext(self):
        self.assertEqual(self.m.ids("Grounding is essential for good architecture."), {})
        self.assertIn("copilot-grounding", self.m.ids("Grounding is essential for Microsoft 365 Copilot answers."))

    def test_deutsch_teams_als_personengruppe(self):
        h, _ = TOP.autolink_html("<p>Ihre Teams arbeiten in SharePoint und Microsoft Teams zusammen.</p>", LRN.ENTS, U, lang="de")
        self.assertEqual([x for x in links(h) if x[0] == "teams"], [("teams", "Microsoft Teams")])


class Regeln(unittest.TestCase):
    def test_keine_obergrenze_erste_nennung(self):
        names = ["SharePoint", "OneDrive", "Power BI", "Power Automate", "Power Apps", "Dataverse", "Microsoft Purview", "Microsoft Intune", "Microsoft Entra ID", "Azure Functions"]
        html = "<p>" + ", ".join(names) + " and again SharePoint.</p>"
        h, al = TOP.autolink_html(html, LRN.ENTS, U)
        self.assertGreaterEqual(len(al), 10)
        self.assertEqual(h.count("/entity/sharepoint/"), 1)

    def test_keine_links_in_ueberschrift_bildunterschrift_code(self):
        html = "<h2>SharePoint basics</h2><figure><img src=x alt=''><figcaption>Power BI report</figcaption></figure><p><code>Power BI</code> uses SharePoint lists.</p>"
        h, _ = TOP.autolink_html(html, LRN.ENTS, U)
        self.assertTrue(h.startswith("<h2>SharePoint basics</h2>"))
        self.assertIn("<figcaption>Power BI report</figcaption>", h)
        self.assertIn("<code>Power BI</code>", h)
        self.assertIn('<a href="/entity/sharepoint/" class="en-al">SharePoint</a> lists', h)

    def test_kein_selbstverweis(self):
        h, _ = TOP.autolink_html("<p>Power BI connects to Excel and Microsoft Fabric.</p>", LRN.ENTS, U, exclude=("power-bi",))
        self.assertNotIn("/entity/power-bi/", h)
        self.assertIn("/entity/fabric/", h)

    def test_bestehende_links_ohne_doppel(self):
        m = EM.shared(LRN.ENTS)
        html = ('<h2><a class="gl" href="https://www.m365.fm/entity/excel/">Excel</a> tips</h2><p>Use <a class="gl" href="https://www.m365.fm/entity/excel/?x=1">Excel</a> '
                'with <a class="gl" href="https://www.m365.fm/entity/excel/">Excel</a> files and SharePoint.</p>')
        used = set()
        h, al = m.link_html(html, U, "en", used=used)
        self.assertEqual(h.count("entity/excel/"), 1)
        self.assertTrue(h.startswith("<h2>Excel tips</h2>"))
        self.assertEqual({"excel", "sharepoint"}, used)
        h2, _ = m.link_html("<p>More on SharePoint and Excel.</p>", U, "en", used=used)   # zweiter Block derselben Seite
        self.assertNotIn("<a ", h2)

    def test_personen_mit_vollem_namen(self):
        p = next(e for e in LRN.ENTS.values() if e.get("type") == "person" and e["id"] != "mirko-peters" and " " in e["name"] and not e.get("outdated") and e["id"] not in LRN.merge_targets())
        h, al = TOP.autolink_html(f"<p>In the episode, {p['name']} explains the setup.</p>", LRN.ENTS, U)
        self.assertIn(f"/entity/{p['id']}/", h)
        h, _ = TOP.autolink_html("<p>Mirko Peters explains the setup.</p>", LRN.ENTS, U)
        self.assertNotIn("/entity/mirko-peters/", h)   # Host: Autorenzeile und Autorenkasten verlinken ihn schon

    def test_mentions(self):
        self.assertEqual(EM.mentions("https://x", ["a", "b", "a"], about=["b"]), [{"@id": "https://x/entity/a/#entity", "url": "https://x/entity/a/"}])

    def test_ent_names_ohne_zusatz_als_abkuerzung(self):
        e = LRN.ENTS.get("azure-routing-preference")
        if e:
            self.assertNotIn("Azure", LRN.ent_names(e))

    def test_gloss_link_ohne_obergrenze(self):
        names = ["SharePoint", "OneDrive", "Power BI", "Power Automate", "Power Apps", "Dataverse", "Microsoft Purview", "Microsoft Intune", "Microsoft Entra ID"]
        h = LRN.gloss_link("<p>" + ", ".join(names) + ".</p>", "en", "https://www.m365.fm")
        self.assertGreaterEqual(h.count('class="ilink gl"'), 9)


class Stoppliste(unittest.TestCase):
    def test_datei_regel(self):
        d = json.loads((ROOT / "data" / "entmatch_common.json").read_text("utf-8"))
        for w in ("surface", "teams", "react", "places", "shifts", "functions", "loop"):
            self.assertIn(w, d["common"])
        for w in ("microsoft", "sharepoint", "purview"):
            self.assertNotIn(w, d["common"])


if __name__ == "__main__":
    unittest.main()
