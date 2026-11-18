"""Gegenpruefung Paket 2 (Namensindex, Kontext-Links): Faelle aus den Befunden.
Titel-Schreibung mehrteiliger Produktnamen, "Microsoft "/"D365 " vor dem Produktnamen, Konzept-Aliase mit anderem Begriff, mehrdeutiges Kopfwort
"Copilot", Sammelknoten stuetzen keine Allerweltswoerter, kurze Abkuerzungen nur mit Kontext, Vorlagen-Bausteine ohne Links, Zusatz-Kurznamen nicht
als Verb oder Befehl, Kontext auf Entitaetsseiten, Stream-Beschreibungen und Sprachfassungen mit mentions."""
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_learn as LRN   # noqa: E402
import site_entmatch as EM   # noqa: E402
import site_topics as TOP   # noqa: E402

U = lambda i: f"/entity/{i}/"


def links(h):
    return re.findall(r'<a href="/entity/([a-z0-9-]+)/" class="[^"]*"[^>]*>([^<]+)</a>', h)


def ent(i, name, t="product", aliases=(), rel=()):
    return {"id": i, "name": name, "type": t, "aliases": list(aliases), "rel": [{"type": a, "to": b} for a, b in rel]}


class Befunde(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.m = EM.shared(LRN.ENTS)

    def ids(self, t, lang="en", ctx=()):
        return [(x[2], x[3]) for x in self.m.resolve(t, lang, ctx)]

    def test_titel_schreibung_mehrteiliger_produktnamen(self):
        # microsoft-teams-rooms-windows-vs-android: "<a ... title="Teams administrator">Teams Admin</a> Center"
        if "teams-admin-center" not in LRN.ENTS: self.skipTest("keine Entitaet teams-admin-center")
        self.assertIn(("Teams Admin Center", "teams-admin-center"), self.ids("Open the Teams Admin Center to set policies for Microsoft Teams."))
        self.assertNotIn("teams-administrator", self.m.ids("Open the Teams Admin Center to set policies for Microsoft Teams."))
        self.assertTrue(EM._title_of("Teams admin center", "Teams Admin Center"))
        self.assertFalse(EM._title_of("Power BI", "Power bi"))   # nur gross statt klein, nicht umgekehrt

    def test_marke_vor_dem_produktnamen(self):
        for t, i in (("Microsoft Dynamics 365 Sales helps sellers.", "dynamics-365-sales"),
                     ("Microsoft Dynamics 365 Customer Insights acts on customer data.", "dynamics-365-customer-insights"),
                     ("Microsoft Azure Virtual Desktop hosts desktops.", "azure-virtual-desktop"),
                     ("Microsoft Azure Machine Learning trains models.", "azure-machine-learning"),
                     ("D365 Finance runs the ledger.", "d365-finance-operations")):
            if i not in LRN.ENTS: continue
            got = self.ids(t)
            self.assertEqual(got[0][1], i, (t, got))
            self.assertNotIn(got[0][1], ("dynamics-365", "azure"))
        self.assertEqual(self.ids("Microsoft Dynamics 365 is a platform.")[0][1], "dynamics-365")

    def test_konzept_alias_anderer_begriff(self):
        # power-platform-governance-assessment-guide: "change management" -> Copilot adoption; DE "Datenschutz" -> GDPR; "CRM" -> Dynamics 365 Sales
        self.assertNotIn("copilot-adoption", self.m.ids("Power Platform governance needs change management and a CoE.", ctx=["power-platform", "governance", "copilot"]))
        self.assertNotIn("gdpr", self.m.ids("Es geht um Kostenaspekte, Datenschutz und die Leistung.", "de", ctx=["gdpr"]))
        self.assertNotIn("dynamics-365-sales", self.m.ids("customer relationship management (CRM) records", ctx=["dynamics-365"]))
        self.assertIn("gdpr", self.m.ids("Die DSGVO gilt fuer alle Daten in SharePoint.", "de"))

    def test_alias_ohne_gemeinsames_wort_nur_wenn_die_seite_davon_handelt(self):
        ents = {e["id"]: e for e in (ent("adopt", "Copilot adoption", "concept", aliases=["Change management"], rel=[("related_to", "m365c")]),
                                     ent("m365c", "Microsoft 365 Copilot", "product"))}
        m = EM.Matcher(ents, common=set())
        t = "Change management is required to ensure adoption of Microsoft 365 Copilot."
        self.assertNotIn("adopt", m.ids(t))            # Nachbarstuetze (Copilot) reicht nicht
        self.assertIn("adopt", m.ids(t, ctx=["adopt"]))   # Seite handelt von der Entitaet selbst

    def test_copilot_als_kopfwort_entscheidet_der_kontext(self):
        # copilot-context-handling-explained: "... GitHub Copilot gathers ... how [Copilot] juggles" -> Microsoft 365 Copilot
        t = "Learn how GitHub Copilot gathers context. You'll see how Copilot juggles files."
        self.assertNotIn("copilot", self.m.ids(t))
        h, al = TOP.autolink_html(f"<p>{t}</p>", LRN.ENTS, U)
        self.assertEqual([x for x in links(h) if x[1] == "Copilot"], [])
        self.assertIn("copilot", self.m.ids("Copilot drafts the reply in Outlook for every user in Microsoft 365."))   # ohne laengere Copilot-Entitaet bleibt es Microsoft 365 Copilot

    def test_sammelknoten_stuetzt_kein_allerweltswort(self):
        for t, i in (("Microsoft publishes guidance. If you are using an Access key you must rotate it.", "access"),
                     ("Microsoft says the Forms you fill in at the bank are slow.", "microsoft-forms"),
                     ("Microsoft research shows that the Stream of requests grows.", "microsoft-stream")):
            self.assertNotIn(i, self.m.ids(t), t)
        self.assertIn("teams", self.m.ids("Files in SharePoint show up in Teams for every project."))

    def test_kurze_abkuerzung_nur_mit_kontext(self):
        for t, i in (("Certified Records Manager (CRM) in SharePoint.", "dynamics-365-sales"), ("Azure IAM policies control access in Azure.", "aws-iam"),
                     ("Use the Marketplace MVP to scale on Azure.", "microsoft-mvp"), ("The CEO of the company uses Microsoft Teams.", "managing-director")):
            self.assertNotIn(i, self.m.ids(t), t)
        ents = {e["id"]: e for e in (ent("aws-iam", "AWS Identity and Access Management (IAM)", rel=[("part_of", "aws")]), ent("aws", "Amazon Web Services", "platform", aliases=["AWS"]))}
        m = EM.Matcher(ents, common=set())
        self.assertNotIn("aws-iam", m.ids("Grant IAM roles to every user."))
        self.assertIn("aws-iam", m.ids("Grant IAM roles in Amazon Web Services."))

    def test_vorlagen_kasten_ohne_links(self):
        html = ('<p>Microsoft Places helps hybrid teams book desks.</p><div class="listen-to-box"><h2>Listen</h2><p>This episode shows why it matters for '
                'Microsoft 365, Azure, Power Platform, security, AI, and modern work.</p><ul><li><div>Power BI</div></li></ul></div><p>Power Apps too.</p>')
        used = EM.Used()
        h, al = self.m.link_html(html, U, "en", used=used)
        box = h[h.index('<div class="listen-to-box">'):h.rindex("</div><p>") + 6]
        self.assertNotIn("<a ", box)
        self.assertIn(box, html)   # Kasten unveraendert
        self.assertNotIn("azure", used); self.assertNotIn("power-platform", used); self.assertNotIn("power-bi", used)
        self.assertIn("power-apps", used)

    def test_zusatz_kurzname_nicht_als_verb_oder_befehl(self):
        self.assertNotIn("sales-lead", self.m.ids("These are trends that lead to burnout in Dynamics 365 Sales teams."))
        self.assertNotIn("power-automate-trigger", self.m.ids("Trigger scaling actions in Azure when load grows."))
        self.assertIn("power-automate-trigger", self.m.ids("Trigger flows start in Power Automate. Trigger conditions filter them."))
        self.assertNotIn("container", self.m.ids("Create a storage container in Azure Blob Storage."))
        self.assertIn("container", self.m.ids("A container packages the app.", ctx=["container"]))

    def test_kontext_einer_sammelknoten_seite(self):
        hub = next(iter(sorted(self.m.hubs - {i for i, e in self.m.live.items() if e.get("type") == "category"})), None)
        if not hub: self.skipTest("kein Sammelknoten")
        self.assertEqual(self.m.page_ctx(hub, ["sharepoint", "dynamics-365-sales"]), {hub})
        self.assertEqual(self.m.page_ctx("dynamics-365-sales", ["microsoft", "sales-lead"]) - self.m.hubs, {"dynamics-365-sales", "sales-lead"})


class Seiten(unittest.TestCase):
    def test_stream_beschreibung_mit_kontext_links_und_mentions(self):
        import site_live
        BASE = "https://www.m365.fm"
        pages, schemas = {}, {}
        def page(lang, title, desc, url, body, alts=None, ld=None, **kw):
            schemas[url] = ld; return body
        g = dict(BASE=BASE, write=lambda p, b: pages.update({p: b}), page=page, header=lambda *a: "", footer=lambda *a: "", footer_en=lambda: "",
                 LANGS={"en": (), "de": ()}, sitemap=[], TODAY="2026-11-05")
        tpl = "Simply Explained by M365.FM breaks down Microsoft 365, Azure and modern IT topics."
        streams = [{"id": f"vid{n:08d}", "title": f"Stream {n}", "published": "2026-11-04", "live_status": "was_live", "description": f"Thema {n}\n{tpl}"} for n in range(5)]
        streams.append({"id": "abcDEF12345", "title": "SharePoint Premium deep dive", "published": "2026-11-04", "live_status": "was_live",
                        "description": f"We show Power Automate flows with SharePoint lists.\n{tpl}"})
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "live.json").write_text(json.dumps({"channel": "UCx", "streams": streams}), "utf-8")
            with patch.object(site_live, "D", Path(tmp)):
                site_live.build(g)
        ep = next(b for p, b in pages.items() if p.startswith("live/abcdef12345"))
        self.assertIn('/entity/power-automate/"', ep)
        self.assertNotIn('/entity/azure/"', ep)   # Vorlagenzeile in vielen Beschreibungen
        ld = next(v for u, v in schemas.items() if "/live/abcdef12345" in u)[0]
        self.assertIn({"@id": f"{BASE}/entity/power-automate/#entity", "url": f"{BASE}/entity/power-automate/"}, ld.get("mentions", []))

    def test_quelltext_ziele_und_mentions(self):
        blog = (ROOT / "site_blog.py").read_text("utf-8")
        self.assertIn("_eu = EM.url_in(BASE, lang)", blog)
        self.assertIn("_lu = lambda i: _eu(i) if i in ENTS else None", blog)
        pp = (ROOT / "site_podpage.py").read_text("utf-8")
        self.assertIn('lald["mentions"] = _lment', pp)
        self.assertIn('lald["about"] = ld["about"]', pp)
        ents = (ROOT / "site_entities.py").read_text("utf-8")
        self.assertIn("faqbox, _ = _EMX.link_html(faqbox", ents)
        self.assertLess(ents.index("longbox, _ = _EMX.link_html(longbox"), ents.index("longbox += _gen if longbox else"))


if __name__ == "__main__":
    unittest.main()
