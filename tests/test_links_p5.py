"""Linktexte Paket 5: Restluecken aus der Messung von Paket 4 (result.measure.misses).
1. Uebersetzte Hauptshow-Folgen: Kontext-Links auch im uebersetzten Teaser, about sichtbar (Themen-Chips mit Einleitungssatz).
2. Werbeplatz (site_ads._place_intro) nie zwischen Einleitungssatz p.lc und seiner Liste.
3. Keine Auto-Links in zitierten Titeln, Folgentiteln nach "episode"/"Folge" und Namenszusaetzen wie "[MVP]".
4. Englischer Begriff im fremdsprachigen Satz: Wortlaut bleibt, lang="en" am Link, Name in der Seitensprache im title.
5. Seitenleiste: Ueberschrift mit Beziehung statt "Themen & Personen auf dieser Seite".
6. Community-Videos nutzen denselben Kontext-Link-Weg (site_entmatch.link_html)."""
import json
import re
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_ads as A   # noqa: E402
import site_entmatch as EM   # noqa: E402
import site_learn as LRN   # noqa: E402
import site_linkctx as LC   # noqa: E402
import site_sidebar as SBR   # noqa: E402

BASE = "https://www.m365.fm"
U = lambda i: f"/entity/{i}/"
LANGS = ("en", "de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")


def linked(h):
    return re.findall(r'<a href="/entity/([a-z0-9-]+)/"', h)


class Werbeplatz(unittest.TestCase):
    """misses 2: Dub-Folgen ja/ko/he ohne <p class=sub>: der erste Absatz nach H1 war der Einleitungssatz "Themen dieser Folge:"."""
    def place(self, inner):
        return A.inject(BASE, f'<main class="wrap">{inner}</main><footer>f</footer>', "ja", BASE + "/ja/some-episode/", today="2026-12-01")

    def test_nicht_zwischen_satz_und_chips(self):
        lc = LC.intro("ja", "ep.topics")
        out = self.place(f'<h1>T</h1>{lc}<div class="chips"><a class="chip" href="/ja/c/ai/">AI</a></div><p>Text <a href="/entity/copilot/">Copilot</a></p><h2>Mehr</h2><p>x</p>')
        i = out.index('data-ad-slot="mid"')
        self.assertLess(out.index('<div class="chips">'), i, "Platz erst nach der Liste")
        self.assertIn(lc + '<div class="chips">', out, "Satz und Liste bleiben beieinander")

    def test_vor_dem_satz_wenn_danach_kein_platz(self):
        lc = LC.intro("de", "ep.guests")
        out = A.inject(BASE, f'<main class="wrap"><h1>T</h1>{lc}<ul><li><a href="/entity/copilot/">Copilot</a></li></ul></main><footer>f</footer>', "de",
                       BASE + "/show/episodes/x/", today="2026-12-01")
        if 'data-ad-slot="mid"' in out:
            self.assertLess(out.index('data-ad-slot="mid"'), out.index(lc))
            self.assertIn(lc + "<ul>", out)

    def test_erster_absatz_bleibt_wie_bisher(self):
        out = self.place('<h1>T</h1><p>Erster Absatz <a href="/entity/copilot/">Copilot</a></p><p>Zweiter</p>')
        self.assertLess(out.index("Erster Absatz"), out.index('data-ad-slot="mid"'))
        self.assertLess(out.index('data-ad-slot="mid"'), out.index("Zweiter"))


class Titel(unittest.TestCase):
    """misses 3 und Stichprobe (sample30.json): Link mitten in einem fremden Titel."""
    @classmethod
    def setUpClass(cls):
        cls.m = EM.shared(LRN.ENTS)

    def lk(self, h, lang="en", ctx=()):
        return self.m.link_html(h, U, lang, ctx)[0]

    def test_folgentitel_in_anfuehrungszeichen(self):
        h = self.lk('<p>Listen to the episode "Azure MCP Server - Simply Explained" for Azure MCP Server basics.</p>')
        self.assertNotIn('"<a', h)
        self.assertIn('for <a href="/entity/azure-mcp-server/"', h, "naechste Nennung ausserhalb des Titels wird verlinkt")

    def test_person_mit_mvp_im_titel(self):
        h = self.lk('<p>"Power Apps Code Apps with Carike Botha [MVP]" discusses the evolution from low-code to pro-code.</p>')
        self.assertNotIn("carike-botha", linked(h))
        self.assertNotIn("power-apps", linked(h))

    def test_titelreihe_ohne_anfuehrungszeichen_mit_mvp(self):
        h = self.lk("<p>From Data to Intelligent Agents: Building Trusted Enterprise AI with Microsoft Foundry with Shubhangi Goyal [MVP] How Microsoft Graph Connects Data</p>")
        self.assertNotIn("shubhangi-goyal", linked(h))

    def test_titel_nach_episode(self):
        h = self.lk("<p>In the episode Power Apps Code Apps with Carike Botha [MVP], Mirko explains Dataverse.</p>")
        self.assertEqual(["dataverse"], linked(h))
        h = self.lk("<p>In this episode Carike Botha explains Dataverse.</p>")   # "this episode" leitet keinen Titel ein
        self.assertIn("carike-botha", linked(h))

    def test_deutsche_und_typografische_zeichen(self):
        h = self.lk('<p>Kanten zu modellgesteuerten Apps. „Canvas App UI vs Generative Pages: Which Should You Use?" nennt Unterschiede.</p>', "de")
        self.assertNotIn("canvas-app", linked(h))
        h = self.lk("<p>Die Folge &quot;Power Apps Code Apps with Carike Botha [MVP]&quot; zeigt Dataverse.</p>", "de")
        self.assertEqual(["dataverse"], linked(h))

    def test_zitat_nur_mit_dem_begriff_bleibt_link(self):
        h = self.lk("<p>This creates what she calls a “single source of truth” experience.</p>")
        self.assertIn("single-source-of-truth", linked(h))
        h = self.lk("<p>aplica el principio de «privilegio mínimo» en SharePoint.</p>", "es")
        self.assertIn("least-privilege", linked(h))
        h = self.lk("<p>Wir nennen es &quot;Power Apps&quot;.</p>", "de")
        self.assertIn("power-apps", linked(h))

    def test_namenszusatz_selbst_ohne_link(self):
        self.assertEqual([], EM._quote_zones("ohne Zeichen"))
        z = EM._NAMED_SUFFIX.search("with Jane Example [Microsoft MVP] today")
        self.assertEqual("[Microsoft MVP]", z.group(1))
        h = self.lk("<p>Our guest Jane Example [Microsoft MVP] talks about Microsoft MVP benefits.</p>")
        self.assertNotIn("[<a", h)
        self.assertIn('about <a href="/entity/microsoft-mvp/"', h, "erste Nennung ausserhalb des Zusatzes")

    def test_zitierter_prompt_ist_kein_titel(self):
        # Vollbau Paket 5: 2.802 Links in zitierten Prompts und Saetzen ("Create a checklist in Planner.") behalten ihren Link
        h = self.lk("<p>Prompt: “Sync deliverable dates across project plans in Teams, Outlook, and Planner.”</p>")
        self.assertIn("microsoft-planner", linked(h))
        self.assertTrue(EM._title_like("Azure Policy - Simply Explained"))
        self.assertFalse(EM._title_like("Create a checklist in Planner."))
        self.assertFalse(EM._title_like("このデータのインポートを自動化する Python コード"))

    def test_zoll_zeichen_oeffnet_kein_zitat(self):
        h = self.lk('<p>A 27" display shows Power BI reports and "Teams" calls.</p>')
        self.assertIn("power-bi", linked(h))


class EnglischerBegriff(unittest.TestCase):
    """misses 4: Conditional Access / Connector / SharePoint governance im deutschen Satz."""
    @classmethod
    def setUpClass(cls):
        cls.m = EM.shared(LRN.ENTS)

    def test_wortlaut_bleibt_lang_en_title_deutsch(self):
        h = self.m.link_html("<p>Mit Conditional Access und Microsoft Intune schützen Sie Geräte.</p>", U, "de")[0]
        self.assertIn('<a href="/entity/conditional-access/" class="en-al" title="Bedingter Zugriff" lang="en">Conditional Access</a>', h)
        self.assertIn('<a href="/entity/intune/" class="en-al">Microsoft Intune</a>', h, "Produktname ohne lang")

    def test_deutscher_name_ohne_lang(self):
        h = self.m.link_html("<p>Bedingter Zugriff schützt Anmeldungen in Microsoft Entra ID.</p>", U, "de")[0]
        a = re.search(r'<a href="/entity/conditional-access/"[^>]*>', h)
        self.assertIsNotNone(a)
        self.assertNotIn('lang="en"', a.group(0))
        self.assertNotIn("title=", a.group(0))

    def test_englische_seite_und_rtl(self):
        h = self.m.link_html("<p>Conditional Access protects sign-ins.</p>", U, "en")[0]
        self.assertNotIn('lang="en"', h)
        h = self.m.link_html("<p>يستخدم Conditional Access مع Microsoft Intune</p>", U, "ar")[0]
        self.assertIn('<bdi lang="en">Conditional Access</bdi>', h)
        self.assertIn("<bdi>Microsoft Intune</bdi>", h)

    def test_abkuerzung_ohne_lang(self):
        self.assertFalse(self.m._english_word("VPN", "vpn", "de"))
        self.assertFalse(self.m._english_word("RBAC", "rbac", "de"))


class Wortgrenze(unittest.TestCase):
    """Gegenpruefung Paket 5, Befund 1: laengere Form scheitert nur an der rechten Wortgrenze (deutsches Kompositum, ja/ko-Partikel ohne
    Leerzeichen); der Link fiel auf den kuerzeren Anfang einer anderen Entitaet zurueck ("Microsoft" statt Microsoft 365)."""
    @classmethod
    def setUpClass(cls):
        cls.m = EM.shared(LRN.ENTS)

    def lk(self, h, lang):
        return self.m.link_html(h, U, lang)[0]

    def test_kompositum_de(self):
        h = self.lk("<p>Richten Sie Ihre Microsoft 365-Umgebung ein und bauen Sie einen Copilot Studio-Agent.</p>", "de")
        self.assertIn('<a href="/entity/microsoft-365/" class="en-al">Microsoft 365</a>-Umgebung', h)
        self.assertIn('<a href="/entity/copilot-studio/" class="en-al">Copilot Studio</a>-Agent', h)
        self.assertNotIn("/entity/microsoft/", h)
        self.assertNotIn("/entity/copilot/", h)

    def test_ergaenzungsstrich_und_plural(self):
        h = self.lk("<p>Für Microsoft 365- und Power-Platform-Admins.</p>", "de")
        self.assertNotIn("/entity/microsoft/", h)
        h = self.lk("<p>Several Microsoft MVPs joined.</p>", "en")
        self.assertNotIn("/entity/microsoft/", h)

    def test_partikel_ja_ko(self):
        h = self.lk("<p>Microsoft 365エコシステムとCopilot Studioの使い方。Microsoft MVPで有名。</p>", "ja")
        self.assertIn('<a href="/entity/microsoft-365/" class="en-al">Microsoft 365</a>エコシステム', h)
        self.assertIn('<a href="/entity/copilot-studio/" class="en-al">Copilot Studio</a>の', h)
        self.assertIn('<a href="/entity/microsoft-mvp/" class="en-al">Microsoft MVP</a>で', h)
        self.assertNotIn("/entity/microsoft/", h)
        h = self.lk("<p>Microsoft 365와 Teams를 사용합니다.</p>", "ko")
        self.assertIn('<a href="/entity/microsoft-365/" class="en-al">Microsoft 365</a>와', h)
        self.assertNotIn("/entity/microsoft/", h)

    def test_wortteil_bleibt_wie_bisher(self):
        self.assertEqual([], [x for x in self.m.raw("Microsoftware", "de")])
        h = self.lk("<p>Microsoft 365 ist da.</p>", "de")
        self.assertIn("/entity/microsoft-365/", h)


class EnglischNurAmEnglischenNamen(unittest.TestCase):
    """Gegenpruefung Paket 5, Befunde 2 und 4: deutsche Aliase ohne Sprachbindung bekamen lang="en"."""
    @classmethod
    def setUpClass(cls):
        cls.m = EM.shared(LRN.ENTS)

    def test_deutsche_aliase_ohne_lang(self):
        h = self.m.link_html("<p>Für die Anmeldung empfiehlt sich die Zwei-Faktor-Authentifizierung, die KI-Verordnung gilt auch in der Fertigung.</p>", U, "de")[0]
        self.assertIn("/entity/mfa/", h)
        self.assertNotIn('lang="en"', h)
        for t, i in (("Zwei-Faktor-Authentifizierung", "mfa"), ("KI-Verordnung", "eu-ai-act"), ("Fertigung", "manufacturing")):
            self.assertFalse(self.m._english_word(t, i, "de"), t)

    def test_englischer_name_behaelt_lang(self):
        self.assertTrue(self.m._english_word("Conditional Access", "conditional-access", "de"))
        self.assertTrue(self.m._english_word("Multi-factor authentication", "mfa", "de"), "Name ohne Klammerzusatz, mit Bindestrich")
        self.assertTrue(self.m._english_word("Manufacturing", "manufacturing", "de"))


class FolgentitelNurEindeutig(unittest.TestCase):
    """Gegenpruefung Paket 5, Befund 5: gewoehnliche Saetze nach "episode"/"Folge" galten als Titel und verloren alle Links."""
    @classmethod
    def setUpClass(cls):
        cls.m = EM.shared(LRN.ENTS)

    def lk(self, h, lang="en"):
        return linked(self.m.link_html(h, U, lang)[0])

    def test_saetze_behalten_links(self):
        self.assertEqual(["microsoft-mvp", "andre-baltieri", "power-automate"],
                         self.lk("<p>Listen to the full episode with Microsoft MVP Andre Baltieri on Power Automate.</p>"))
        self.assertIn("andre-baltieri", self.lk("<p>In the episode Microsoft MVP Andre Baltieri explains Dataverse.</p>"))
        self.assertIn("andre-baltieri", self.lk("<p>In episode 12 with Microsoft MVP Andre Baltieri we talk about Dataverse.</p>"))
        self.assertIn("teams-premium", self.lk("<p>In der Folge Microsoft Teams Premium und Copilot zeigt der Gast, wie es geht.</p>", "de"))

    def test_titel_bleiben_titel(self):
        self.assertTrue(EM._episode_title_zones("In the episode Power Apps Code Apps with Carike Botha [MVP], Mirko explains Dataverse."))
        self.assertTrue(EM._episode_title_zones("Episode: Power Apps Code Apps With Carike Botha explains", "en"), "ausdruecklich markiert")
        self.assertTrue(EM._episode_title_zones("Welcome to another episode of Microsoft Knowledge Nuggets here on M365FM.", "en"))
        self.assertTrue(EM._episode_title_zones("Dalam episode Microsoft Knowledge Nuggets ini, Mirko Peters menjelaskan", "id"))


class Seitenleiste(unittest.TestCase):
    def test_vorlagen_in_allen_sprachen(self):
        d = json.loads(LC.FILE.read_text("utf-8"))
        for k in ("side.named", "side.page"):
            self.assertIn(k, d["keys"])
            for l in LANGS:
                self.assertTrue(d[l].get(k), (l, k))
                self.assertEqual("{s}" in d[l][k], k == "side.named", (l, k))

    def test_treffer_im_text_auf_dieser_seite_erwaehnt(self):
        class Ix:
            all = {"copilot": {"id": "copilot", "name": "Copilot", "type": "product"}}
            def match(self, text, k, lang="en", ctx=()):
                return [self.all["copilot"]] if "Copilot" in text else []
        h = SBR.render(Ix(), BASE, "de", "Text mit Copilot", [], None, None)
        self.assertIn("<h2>Auf dieser Seite erwähnt</h2>", h)
        self.assertNotIn("Themen &amp; Personen auf dieser Seite", h)
        h = SBR.render(Ix(), BASE, "en", "Text with Copilot", [], None, None)
        self.assertIn("<h2>Mentioned on this page</h2>", h)
        h = SBR.render(Ix(), BASE, "de", "Text mit Copilot", [], None, None, topics_h=LC.plain("de", "side.named", s="Power BI"))
        self.assertIn("<h2>In der Beschreibung von Power BI genannt</h2>", h)

    def test_entitaetsseite_ohne_beziehungen_nutzt_side_named(self):
        src = (ROOT / "site_entities.py").read_text("utf-8")
        self.assertIn('"side.named"', src)


class Quelltext(unittest.TestCase):
    def test_sprachfassung_hauptshow_teaser_und_themen(self):
        src = (ROOT / "site_podpage.py").read_text("utf-8")
        self.assertIn("ls_html, _ = EMX.link_html(esc(ls), _lurl, l, _ectx, used=_lused)", src)
        self.assertIn('LC.intro(l, "ep.topics")', src)
        self.assertIn("<strong>{ls_html}</strong>", src)


class CommunityVideo(unittest.TestCase):
    """misses 7 / Punkt 6: Community-Videos laufen ueber site_entmatch.link_html (Kontext-Links, mentions, Titel-Regel)."""
    def test_video_beschreibung_kontext_links(self):
        import site_video
        pages, schemas = {}, {}
        def page(lang, title, desc, url, body, alts=None, ld=None, **kw):
            schemas[url] = ld
            return body
        g = dict(BASE=BASE, write=lambda p, b: pages.update({p: b}), page=page, header=lambda *a: "", footer=lambda *a: "", footer_en=lambda: "",
                 LANGS={"en": (), "de": ()}, sitemap=[], TODAY="2026-11-05")
        v = dict(handle="host", lang="en", slug="vtest", title="Ein Video", published=1700000000, name="Host", id=1, video_id="vid12345678",
                 description='We build reports in Power BI. See the episode "Azure MCP Server - Simply Explained" and our Dataverse notes.')
        with patch.object(site_video, "COMM_LANGS", ("en",)):
            site_video.build(g, [v], [{"handle": "host"}], "")
        body = pages["community/video/vtest/index.html"]
        self.assertIn('class="en-al">Power BI</a>', body)
        self.assertIn('class="en-al">Dataverse</a>', body)
        self.assertNotIn("/entity/azure-mcp-server/", body)
        ld = schemas[f"{BASE}/community/video/vtest/"][0]
        self.assertTrue(any("/entity/power-bi/" in (m.get("@id") or "") for m in ld.get("mentions", [])))


if __name__ == "__main__":
    unittest.main()
