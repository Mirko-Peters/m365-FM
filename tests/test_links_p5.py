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
        self.assertTrue(EM._episode_title_zones("Episode: Power Apps Code Apps With Carike Botha explains"), "ausdruecklich markiert")


class GemischteNamenJaKo(unittest.TestCase):
    """Gegenpruefung Runde 1, Befund 1: gemischte Namen (lateinisch + Schriftzeichen) mit Partikel fielen ganz weg, auch die kuerzere lateinische
    Form an derselben Stelle ("상속된 SharePoint 권한으로": vorher sharepoint, dann kein Link)."""
    @classmethod
    def setUpClass(cls):
        cls.m = EM.shared(LRN.ENTS)

    def lk(self, h, lang):
        return re.findall(r'<a href="/entity/([a-z0-9-]+)/"[^>]*>([^<]*)</a>', self.m.link_html(f"<p>{h}</p>", U, lang)[0])

    def test_gemischter_name_mit_partikel(self):
        for lang, h, want in (("ko", "상속된 SharePoint 권한으로 접근합니다.", ("sharepoint-permissions", "SharePoint 권한")),
                              ("ko", "Azure 랜딩 존을 설계합니다.", ("azure-landing-zone", "Azure 랜딩 존")),
                              ("ko", "SharePoint 허브 사이트를 만듭니다.", ("sharepoint-hub-sites", "SharePoint 허브 사이트")),
                              ("ja", "Azure ランディング ゾーンを設計します。", ("azure-landing-zone", "Azure ランディング ゾーン")),
                              ("ko", "Microsoft 365의 사용자 지정 도메인을 설정합니다.", ("custom-domain", "Microsoft 365의 사용자 지정 도메인"))):
            self.assertEqual([want], self.lk(h, lang), h)

    def test_sonst_kuerzere_lateinische_form(self):
        self.assertEqual([("azure", "Azure")], self.lk("Azure ランディング ゾーン構成を説明します。", "ja"), "kein Partikel: Wortteil, zurueck auf Azure")
        self.assertEqual([("sharepoint", "SharePoint")], self.lk("SharePoint 권한상속 문제", "ko"))

    def test_namen_in_schriftzeichen_bleiben_ganze_woerter(self):
        self.assertFalse(EM._cjk_ok("条件付きアクセスを使う", 0, 8, "ja"))
        self.assertTrue(EM._cjk_ok("「条件付きアクセス」", 1, 9, "ja"))
        self.assertTrue(EM._cjk_ok("Teams를", 0, 5, "ko"), "lateinisches Ende: Wortgrenze nur gegen lateinische Zeichen")
        self.assertFalse(EM._cjk_ok("SharePoint 권한상속", 0, 13, "ko"))


class LangEnAliase(unittest.TestCase):
    """Gegenpruefung Runde 1, Befund 2: lang="en" fiel an englischen Aliasen weg (OAuth, IoT, SaaS, Landing Zone, …)."""
    @classmethod
    def setUpClass(cls):
        cls.m = EM.shared(LRN.ENTS)

    def test_englische_aliase_und_abkuerzungen(self):
        for t, i in (("OAuth", "oauth-2-0"), ("IoT", "internet-of-things"), ("SaaS", "software-as-a-service"),
                     ("CoE", "power-platform-center-of-excellence"), ("IaC", "infrastructure-as-code"), ("ViDA", "vat-in-the-digital-age"),
                     ("QoS", "mqtt-quality-of-service"), ("Data Analysis Expressions", "dax"), ("Copilot Skills", "agent-skill"),
                     ("Landing Zone", "azure-landing-zone"), ("Change Notifications", "change-notifications"), ("Lean Manufacturing", "lean-management"),
                     ("lifecycle workflows", "identity-lifecycle"), ("dataset", "semantic-model"), ("robotic process automation (RPA)", "rpa")):
            self.assertTrue(self.m._english_word(t, i, "de"), t)

    def test_deutsche_aliase_bleiben_ohne_lang(self):
        for t, i in (("IT-Leiter", "it-manager"), ("Finanzwesen", "financial-services"), ("Zwei-Faktor-Authentifizierung", "mfa"),
                     ("KI-Verordnung", "eu-ai-act"), ("Fertigung", "manufacturing"), ("Infrastruktur als Code", "infrastructure-as-code"),
                     ("Werksleiter", "plant-manager")):   # "Corresponds to the German Werksleiter" in der englischen Beschreibung zaehlt nicht
            self.assertFalse(self.m._english_word(t, i, "de"), t)

    def test_im_satz(self):
        h = self.m.link_html("<p>Die Anmeldung läuft über OAuth, der IT-Leiter plant die Landing Zone für Azure.</p>", U, "de")[0]
        # Ob OAuth/Landing Zone ueberhaupt verlinkt werden, haengt an den Daten (im CI kommt die D1-Fassung dazu, die Aliase anders fuehren kann);
        # geprueft wird hier nur die Regel: WENN verlinkt, dann mit lang="en"
        for word in ("OAuth", "Landing Zone"):
            if re.search(r">%s</a>" % re.escape(word), h):
                self.assertIn('lang="en">%s</a>' % word, h)
        self.assertTrue(re.search(r">(OAuth|Landing Zone)</a>", h) or not self.m.ids("OAuth Landing Zone", "de"), h)
        self.assertRegex(h, r'<a href="/entity/it-manager/"(?![^>]*lang=)[^>]*>IT-Leiter</a>')


class FolgentitelMuster(unittest.TestCase):
    """Gegenpruefung Runde 1, Befund 3: Titel ohne Anfuehrungszeichen nur bei eindeutigem Muster ("Episode:", Zusatz "[MVP]"), in allen Sprachen
    gleich; Komma, "episode of" und "Episode Highlights:" machen keinen Titel."""
    @classmethod
    def setUpClass(cls):
        cls.m = EM.shared(LRN.ENTS)

    def lk(self, h, lang="en"):
        return linked(self.m.link_html(f"<p>{h}</p>", U, lang)[0])

    def test_prosa_behaelt_links(self):
        self.assertEqual(["microsoft-mvp", "andre-baltieri", "power-platform", "dataverse"],
                         self.lk("In the episode Microsoft MVP Andre Baltieri, a Power Platform expert, explains Dataverse."))
        self.assertIn("teams-premium", self.lk("In der Folge Microsoft Teams Premium, Copilot Studio und Power BI geht es um Lizenzen.", "de"))
        self.assertIn("power-bi", self.lk("Episode Highlights: Power BI, Copilot Studio and Dataverse."))
        self.assertIn("teams-premium", self.lk("In an episode of Microsoft Teams Premium training we covered Power BI."))

    def test_alle_sprachen_wie_de_en(self):
        for lang, h in (("fr", "Dans l'épisode Microsoft MVP Andre Baltieri explique Dataverse."),
                        ("es", "En el episodio Microsoft MVP Andre Baltieri explica Dataverse."),
                        ("it", "Nell'episodio Microsoft MVP Andre Baltieri spiega Dataverse."),
                        ("nl", "In de aflevering Microsoft MVP Andre Baltieri legt Dataverse uit."),
                        ("pl", "W odcinku Microsoft MVP Andre Baltieri omawia Dataverse."),
                        ("pt", "No episódio Microsoft MVP Andre Baltieri explica Dataverse."),
                        ("id", "Dalam episode Microsoft MVP Andre Baltieri menjelaskan Dataverse.")):
            self.assertIn("andre-baltieri", self.lk(h, lang), lang)
        self.assertFalse(EM._episode_title_zones("Dalam episode Microsoft Knowledge Nuggets ini, Mirko Peters menjelaskan"))
        self.assertFalse(EM._episode_title_zones("Welcome to another episode of Microsoft Knowledge Nuggets here on M365FM."))
        self.assertFalse(EM._episode_title_zones("Die Folge: Wenn Copilot eingeführt wird, legt es sensible Daten offen."), "Folge = Konsequenz")
        self.assertFalse(EM._episode_title_zones("O Que Vai Aprender Neste Episódio: Porque Qualquer Pessoa Pode Enviar E-mails"), "in dieser Folge: Liste")

    def test_markierte_titel(self):
        self.assertEqual(["dataverse"], self.lk("Episode: Power Apps Code Apps With Carike Botha. Later Dataverse."))
        self.assertEqual(["dataverse"], self.lk("From the episode: Power BI, Copilot Studio and Fabric Explained<br>Dataverse here."))
        self.assertEqual(["dataverse"], self.lk("Folge – Microsoft Teams Premium Erklärt. Danach Dataverse.", "de"))
        self.assertEqual(["dataverse"], self.lk("Épisode 12 : Power Apps Code Apps With Carike Botha. Puis Dataverse.", "fr"))
        self.assertEqual(["dataverse"], self.lk("In the episode Power Apps Code Apps with Carike Botha [MVP], Mirko explains Dataverse."))


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


class FolgentitelAufzaehlung(unittest.TestCase):
    """'in the episode:' / 'In der Folge:' leitet eine Aufzaehlung ein, keinen Titel (Gegenpruefung Runde 2); 'From the episode:' bleibt Titel."""

    @classmethod
    def setUpClass(cls):
        import site_entmatch as EM
        cls.m = EM.shared()

    def ids(self, t, lang="en"):
        return [x[1] for x in self.m.link_html("<p>" + t + "</p>", lambda i: "/entity/%s/" % i, lang)[1]]

    def test_aufzaehlung_behaelt_links(self):
        self.assertIn("power-bi", self.ids("Topics covered in the episode: Power BI, Microsoft Fabric and Copilot Studio."))
        self.assertIn("power-bi", self.ids("In der Folge: Power BI, Microsoft Fabric und Copilot Studio.", "de"))

    def test_titel_bleibt_ohne_link(self):
        self.assertEqual(self.ids("From the episode: Power Apps Code Apps with Carike Botha"), [])
        self.assertEqual(self.ids("Related episode: Power BI Premium Costs Explained."), [])
