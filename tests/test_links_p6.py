"""Linktexte Paket 6 (Mirko, 18.11.2026): kurzer beschreibender Zusatz im Linktext von Listen, Kacheln und Chips, title mit Kurzbeschreibung,
Einleitungssaetze je Gruppe und Bereich, Kurzerklaerungen und Einleitungssatz in allen 15 Sprachen, YouTube-Link mit Titel.

1. site_ename.descriptor: Stufen genaue Kategorie + Hersteller, Typ + Hersteller (ohne "Microsoft-Werkzeug von Microsoft"), nur Hersteller, nur Kategorie,
   Teil von, Unterbegriff von, Typname; Hersteller/Kategorie/Teil von gleich der Seite entfallen; hoechstens ~60 Zeichen.
2. Listen, Kacheln, Chips mit Zusatz; Fliesstext, Brotkruemel und JSON-LD-name ohne.
3. Vollstaendige Beziehungslisten: Einleitungssatz je Gruppe ("Alle 245 Produkte und Werke von Microsoft:").
4. Kurzerklaerungen in allen Sprachen, hoechstens 14.
5. Satzvorlagen ar/he/pl, Einleitungssatz in allen 15 Sprachen.
6. Einleitungssaetze der Fakten-, Medien-, Termin- und Zitatbereiche.
7. YouTube: sichtbarer Text "YouTube: {Kurztitel}", nie derselbe Text fuer zwei Folgen."""
import contextlib
import copy
import io
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tests"))
import site_ename as EN   # noqa: E402
import site_entities as ENT   # noqa: E402
import site_event_link as EVL   # noqa: E402
import site_facts as FX   # noqa: E402
import site_linkctx as LC   # noqa: E402
import site_mentions as MEN   # noqa: E402
import site_quotes as SQ   # noqa: E402
import site_relsent as RS   # noqa: E402
import site_sidebar as SBR   # noqa: E402
from site_learn import ENTS   # noqa: E402
import test_entity_names as TN   # noqa: E402

BASE = "https://www.m365.fm"
LANGS = ("en", "de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")
ent = TN.ent


def ents():
    es = {x["id"]: x for x in [
        ent("mirko-peters", "person", "Mirko Peters"), ent("microsoft", "org", "Microsoft"), ent("github", "org", "GitHub"), ent("ifakt", "org", "iFAKT GmbH"),
        ent("contoso", "org", "Contoso Very Long Manufacturing and Industrial Solutions Holding International"),
        ent("analytics-tool", "category", "Analytics and BI tool"), ent("microsoft-tool", "category", "Microsoft tool"),
        ent("power-platform", "platform", "Power Platform", [("developed_by", "microsoft"), ("instance_of", "microsoft-tool")]),
        ent("power-bi", "product", "Power BI", [("developed_by", "microsoft"), ("instance_of", "microsoft-tool"), ("instance_of", "analytics-tool"),
                                                ("part_of", "power-platform"), ("related_to", "star-schema")]),
        ent("copilot-x", "product", "Copilot X", [("developed_by", "github"), ("instance_of", "microsoft-tool")]),
        ent("polaris", "product", "Polaris", [("developed_by", "ifakt")]),
        ent("widget", "product", "Widget", [("developed_by", "contoso"), ("instance_of", "analytics-tool")]),
        ent("dataflow", "concept", "Dataflow", [("part_of", "power-bi"), ("broader", "star-schema")]),
        ent("star-schema", "concept", "Star schema", [("broader", "data-modeling")]),
        ent("data-modeling", "concept", "Data modeling"),
        ent("lonely", "concept", "Lonely term"),
        ent("public-sector", "industry", "Public sector"),
        ent("acme", "org", "Acme", industries=["public-sector"], customers=[{"name": "City of X", "industry": "public-sector"},
                                                                             {"name": "Y AG", "case_study_url": "https://y.example/case", "title": "Y case"}],
            partners=[{"name": "Z", "kind": "technology"}], certifications=[{"name": "ISO 27001", "issuer": "TÜV"}]),
        ent("con-series", "event", "Con Series", [("developed_by", "microsoft")]),
    ]}
    for n in range(5):
        es[f"p{n}"] = ent(f"p{n}", "product", f"P{n}", [("developed_by", "microsoft"), ("instance_of", "analytics-tool")])
    for x in ("lonely", "data-modeling", "public-sector", "dataflow"):
        es[x]["desc"] = {}   # ohne Kurzbeschreibung: title faellt auf den Zusatz zurueck
    return EN.apply(es)


ES = ents()
D = lambda i, lang, page=None: EN.descriptor(ES[i], lang, page, ES)


class Descriptor(unittest.TestCase):
    def test_stufe1_kategorie_und_hersteller(self):
        self.assertEqual(D("power-bi", "de"), "Analyse- und BI-Werkzeug von Microsoft")
        self.assertEqual(D("power-bi", "en"), "Analytics and BI tool by Microsoft")
        self.assertEqual(D("power-bi", "ja"), "Microsoftの分析・BI ツール")
        self.assertEqual(D("power-bi", "ar"), "أداة تحليلات وذكاء أعمال من Microsoft")
        self.assertEqual(D("power-bi", "fr"), "Outil d’analyse et de BI de Microsoft")
        self.assertEqual(D("power-bi", "ko"), "Microsoft의 분석 및 BI 도구")

    def test_hersteller_ist_die_seite(self):
        self.assertEqual(D("power-bi", "de", "microsoft"), "Analyse- und BI-Werkzeug", "auf /entity/microsoft/ nur die Kategorie")
        self.assertEqual(D("power-bi", "en", "microsoft"), "Analytics and BI tool")
        self.assertEqual(D("power-platform", "de", "microsoft"), "Plattform", "nur Microsoft-Werkzeug: auf der Microsoft-Seite der Typname")

    def test_stufe2_kein_microsoft_werkzeug_von_microsoft(self):
        self.assertEqual(D("power-platform", "de"), "Plattform von Microsoft")
        self.assertEqual(D("power-platform", "en"), "Platform by Microsoft")
        self.assertEqual(D("power-platform", "ja"), "Microsoftのプラットフォーム")
        self.assertEqual(D("power-platform", "ar"), "منصة من Microsoft")
        for l in LANGS:
            self.assertNotIn("Microsoft", D("power-platform", l).replace("Microsoft", "", 1), f"{l}: Microsoft nur einmal")
        self.assertEqual(D("polaris", "de"), "Produkt von iFAKT GmbH")
        self.assertEqual(D("polaris", "fr"), "Produit d’iFAKT GmbH", "franzoesische Elision vor Vokal")
        self.assertEqual(D("copilot-x", "pt"), "Produto do GitHub", "portugiesisch: maskuline Marke")
        self.assertEqual(D("polaris", "pt"), "Produto da iFAKT GmbH")
        self.assertEqual(D("polaris", "pl"), "Produkt firmy iFAKT GmbH")

    def test_stufe3_nur_hersteller(self):
        self.assertEqual(D("con-series", "de"), "Von Microsoft")
        self.assertEqual(D("con-series", "en"), "From Microsoft")
        self.assertEqual(D("con-series", "ja"), "Microsoftによる")

    def test_stufe4_bis_6_und_typname(self):
        self.assertEqual(D("dataflow", "de"), "Teil von Power BI")
        self.assertEqual(D("dataflow", "en"), "Part of Power BI")
        self.assertEqual(D("dataflow", "ja"), "Power BIの一部")
        self.assertEqual(D("dataflow", "ar"), "جزء من Power BI")
        self.assertEqual(D("dataflow", "de", "power-bi"), "Unterbegriff von Sternschema", "Teil von der Seite selbst entfaellt")
        self.assertEqual(D("star-schema", "de"), "Unterbegriff von Data modeling")
        self.assertEqual(D("lonely", "de"), "Konzept"); self.assertEqual(D("lonely", "en"), "Concept")
        self.assertEqual(D("lonely", "ja"), "概念"); self.assertEqual(D("lonely", "ar"), "مفهوم")
        self.assertEqual(D("p0", "de", "analytics-tool"), "Produkt von Microsoft", "Kategorie gleich der Seite: Typ und Hersteller")

    def test_laenge_hoechstens_60(self):
        self.assertEqual(D("widget", "en"), "Analytics and BI tool", "zu lang mit Hersteller: Kategorie ohne Hersteller")
        self.assertEqual(D("widget", "de"), "Analyse- und BI-Werkzeug")
        for i in ES:
            for l in LANGS:
                self.assertLessEqual(len(D(i, l)), EN.MAXDESC, (i, l))
        real = [EN.descriptor(e, l) for e in list(ENTS.values())[:800] for l in ("de", "en", "ja", "ar")]
        self.assertLessEqual(max(map(len, real)), EN.MAXDESC)

    def test_typnamen_alle_sprachen(self):
        for l in LANGS:
            for t in ENT.TL:
                self.assertTrue(LC.has(l, f"desc.type.{t}"), (l, t))


class Links(unittest.TestCase):
    def test_list_link_zusatz_title_rtl(self):
        h = EN.list_link("/de/entity/power-bi/", ES["power-bi"], "de")
        self.assertEqual(h, '<a href="/de/entity/power-bi/" title="Power BI ist ein Testeintrag.">Power BI<span class="ed"> – Analyse- und BI-Werkzeug von Microsoft</span></a>')
        h = EN.list_link("/entity/power-bi/", ES["power-bi"], "en", "microsoft")
        self.assertIn('>Power BI<span class="ed"> – Analytics and BI tool</span></a>', h)
        a = EN.list_link("/ar/entity/power-bi/", ES["power-bi"], "ar")
        self.assertIn("<bdi>Power BI</bdi><span class=\"ed\"> – <bdi>أداة تحليلات وذكاء أعمال</bdi> من <bdi>Microsoft</bdi></span>", a)
        j = EN.list_link("/ja/entity/power-bi/", ES["power-bi"], "ja")
        self.assertIn('>Power BI<span class="ed"> – Microsoftの分析・BI ツール</span></a>', j)
        self.assertNotIn("title=", j, "ja: keine Kurzbeschreibung in der Sprache, Zusatz steht schon sichtbar da")
        lone = EN.list_link("/entity/lonely/", ES["lonely"], "en")
        self.assertNotIn("title=", lone, "nur der Typname: kein title")
        self.assertEqual(EN.list_link("/de/entity/public-sector/", ES["public-sector"], "de", skip_type=True), '<a href="/de/entity/public-sector/">Öffentlicher Sektor</a>')

    def test_title_in_saetzen_ohne_zusatz(self):
        inv = {}
        for x in ES.values():
            for p, t in x["rel"]:
                inv.setdefault(t, []).append((p, x["id"]))
        h = RS.build("de", ES["dataflow"], ES["dataflow"]["rel"], inv.get("dataflow", []), ES, lambda i: f"/de/entity/{i}/")
        self.assertIn('<a href="/de/entity/power-bi/" title="Power BI ist ein Testeintrag.">Power BI</a>', h)
        self.assertNotIn('class="ed"', h, "im Fliesstext bleibt der Linktext der Name")

    def test_sidebar_chips(self):
        ix = SBR.Index(ES)
        with mock.patch.object(SBR, "con_img", lambda *a: ""):
            h = SBR.render(ix, BASE, "de", ids=["power-bi", "lonely"], exclude=("microsoft",), ent_prefix="/de")
        self.assertIn('class="sb-chip t-product" href="https://www.m365.fm/de/entity/power-bi/" title="Power BI ist ein Testeintrag."><i></i>Power BI<span class="ed"> – Analyse- und BI-Werkzeug</span></a>', h)
        self.assertIn('<i></i>Lonely term<span class="ed"> – Konzept</span></a>', h.replace('<span lang="en">Lonely term</span>', "Lonely term"))


def build(es, langs=("en", "de", "ja", "ar"), eps=None, yt=None):
    tmp = tempfile.TemporaryDirectory(); docs = Path(tmp.name)

    def write(rel, content):
        p = docs / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(content, "utf-8")

    def page(lang, title, desc, url, body, alts=None, ld=None, side="", **k):
        lds = "".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in (ld or []))
        return f'<!doctype html><html lang="{lang}"><head><title>{title}</title>{lds}</head><body>{body}{side}</body></html>'
    ix = SBR.Index(es)

    def side(lang, text="", ids=None, exclude=(), home=False, topics_h=""):
        return SBR.render(ix, BASE, lang, text, ids=ids, exclude=exclude, topics_h=topics_h, ent_prefix="" if lang == "en" else f"/{lang}")
    g = dict(BASE=BASE, write=write, page=page, header=lambda l, x="": "<header></header>", footer=lambda l: "<footer></footer>", footer_en=lambda: "<footer></footer>",
             LANGS={"de": ("Deutsch", "de")}, sitemap=[], TODAY=TN.TODAY, api="https://api.test", url_of=lambda x: x.get("url", ""), anchor_title=lambda t, *a: t,
             ep_about={}, side=side, ep_sum=lambda x: x.get("sum", ""), yt_of=yt or (lambda x: ""))
    with mock.patch.dict(ENTS, es, clear=True), mock.patch.object(ENT, "COMM_LANGS", list(langs)), mock.patch.object(ENT, "MOD_FILE", docs / "_entity_mod.json"), \
            mock.patch.object(ENT, "fetch_wiki", lambda *a: {}), mock.patch.object(ENT, "write_wk_js", lambda *a: None), mock.patch.dict(ENT.EVENTS, {}, clear=True), \
            mock.patch.object(SBR, "con_img", lambda *a: ""), contextlib.redirect_stdout(io.StringIO()):
        EVL.load([], (), (), TN.TODAY)
        ENT.build(g, lambda lang: {}, {}, lambda e, lang="en": (eps or {}).get(e["id"], []))
    return tmp, docs


def body(h):
    h = h.split("<body>", 1)[1]
    return re.sub(r"<script.*?</script>|<style.*?</style>", "", h, flags=re.S)


class Pages(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        eps = {"power-bi": [{"e": {"title": f"Power BI deep dive part {n}: modelling, refresh and the semantic layer explained"}, "url": f"{BASE}/show/episodes/pbi-{n}/",
                             "date": f"2026-0{n + 1}-01", "sum": "x", "yt": f"vid{n}"} for n in range(3)]}
        cls.tmp, cls.docs = build(copy.deepcopy(ES), eps=eps, yt=lambda x: x.get("yt", ""))

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def read(self, rel):
        return body((self.docs / rel).read_text("utf-8"))

    def test_vollstaendige_listen_einleitung_je_gruppe(self):
        for rel, want in (("de/entity/microsoft/index.html", "Alle 8 Produkte und Werke von Microsoft:"), ("entity/microsoft/index.html", "All 8 products and works by Microsoft:"),
                          ("ja/entity/microsoft/index.html", "Microsoftの製品・作品すべて（8件）："), ("ar/entity/microsoft/index.html", "جميع المنتجات والأعمال (8):")):
            h = self.read(rel)
            groups = re.findall(r'<h3 id="en-rel-\d+">[^<]*</h3>(<p class="lc"[^>]*>.*?</p>)?<ul>(.*?)</ul>', h, re.S)
            self.assertTrue(groups, rel)
            self.assertTrue(all(p for p, _ in groups), f"{rel}: jede Gruppe mit Einleitungssatz")
            self.assertIn(want, re.sub(r"<[^>]+>", "", " ".join(p for p, _ in groups)), rel)
            self.assertNotIn('<span class="mut">· ', "".join(u for _, u in groups), f"{rel}: Zusatz statt '· Typ'")
            self.assertTrue(all('class="ed"' in li for _, u in groups for li in re.findall(r"<li>.*?</li>", u)), rel)
        h = self.read("de/entity/power-bi/index.html")
        self.assertIn("Entwickler von Power BI:", h, "eine Zeile: ohne Zahl (nie 'Alle 1 ...')")
        self.assertNotRegex(h, r"Alle [12] ")
        m = self.read("de/entity/microsoft/index.html")
        self.assertIn('>P0<span class="ed"> – Analyse- und BI-Werkzeug</span></a>', m, "Hersteller = Seite: entfaellt")

    def test_kurzerklaerungen_alle_sprachen(self):
        for lang in ("en", "de", "ja", "ar"):
            h = self.read(("" if lang == "en" else lang + "/") + "entity/microsoft/index.html")
            m = re.search(r'<ul class="en-relx">(.*?)</ul>', h, re.S)
            self.assertIsNotNone(m, lang)
            items = re.findall(r"<li>.*?</li>", m.group(1), re.S)
            self.assertTrue(0 < len(items) <= 14, (lang, len(items)))
            self.assertTrue(all('class="ed"' in x for x in items), lang)
        ja = re.search(r'<ul class="en-relx">(.*?)</ul>', self.read("ja/entity/power-bi/index.html"), re.S).group(1)
        self.assertNotIn("is a test entry", ja, "keine englische Kurzbeschreibung auf der japanischen Seite")
        de = re.search(r'<ul class="en-relx">(.*?)</ul>', self.read("de/entity/power-bi/index.html"), re.S).group(1)
        self.assertIn("<br>Microsoft ist ein Testeintrag.", de)

    def test_kein_zusatz_in_brotkrumen_h1_jsonld(self):
        raw = (self.docs / "de/entity/power-bi/index.html").read_text("utf-8")
        nav = re.search(r'<nav aria-label="breadcrumb">(.*?)</nav>', raw, re.S).group(1)
        self.assertNotIn('class="ed"', nav)
        self.assertIn("<h1>Power BI</h1>", raw)
        for ld in TN.ld_of(raw):
            self.assertNotIn(" – Analyse", json.dumps(ld, ensure_ascii=False))
        rels = re.search(r'<section class="en-rels".*?</section>', raw, re.S).group(0)
        self.assertNotIn('class="ed"', rels)

    def test_uebersicht_karten(self):
        h = self.read("de/entity/index.html")
        self.assertIn('<b>Power BI</b><span class="ed"> – Analyse- und BI-Werkzeug von Microsoft</span></a>', h)
        self.assertNotIn("· Produkt", h)

    def test_branche_in_faktentabelle(self):
        h = self.read("de/entity/acme/index.html")
        self.assertRegex(h, r'<th scope="row">Branche</th><td><a href="https://www.m365.fm/de/entity/public-sector/"[^>]*>Öffentlicher Sektor</a></td>')

    def test_einleitungssaetze_fakten(self):
        for lang, want in (("de", ("Referenzkunden von Acme, nach Branche geordnet:", "Partner von Acme, nach Art der Partnerschaft geordnet:", "Technologiepartner von Acme:",
                                   "Zertifizierungen von Acme, jeweils mit der ausstellenden Stelle:", "Veröffentlichte Fallstudien mit Kunden von Acme:")),
                           ("en", ("Reference customers of Acme, grouped by industry:", "Partners of Acme, grouped by type of partnership:", "Technology partners of Acme:",
                                   "Certifications held by Acme, each with the issuing body:")),
                           ("ja", ("Acmeの導入事例企業（業界別）：", "Acmeのパートナー（パートナーシップの種類別）：")),
                           ("ar", ("عملاء مرجعيون لـ<bdi>Acme</bdi>، مصنفون حسب القطاع:",))):
            h = FX.sections(lang, ES["acme"], f"/{lang}/entity/", ES)
            for w in want:
                self.assertIn(w, h, lang)

    def test_einleitung_medien_zitate_termine(self):
        ms = [{"url": "https://press.example/a", "title": "Acme wins", "publisher": "Press", "date": "2026-01-01"}]
        with mock.patch.dict(ENTS, ES, clear=True), mock.patch.object(MEN, "section_eids", lambda eid: True):
            self.assertIn("Artikel und Veröffentlichungen in anderen Medien, in denen Acme erwähnt wird:", MEN.section_html("de", "acme", ms))
            self.assertIn("Articles and publications in other media that mention Acme:", MEN.section_html("en", "acme", ms))
            self.assertIn("<bdi>Acme</bdi>", MEN.section_html("ar", "acme", ms))
            self.assertIn("Acmeに言及している他メディアの記事・出版物：", MEN.section_html("ja", "acme", ms))
        q = [{"id": 1, "text": "Hallo", "lang": "de", "time_s": 5}]
        with mock.patch.dict(ENTS, {"mirko-peters": ent("mirko-peters", "person", "Mirko Peters")}, clear=True), mock.patch.object(SQ, "for_person", lambda pid, lang: q):
            h = SQ.block("mirko-peters", "de", lambda q: ("https://x/", "Folge"))
            self.assertRegex(h, r'<h2>Zitate</h2><p class="lc" data-own-text="no">Zitate von Mirko Peters aus den Folgen, jeweils mit der Quellfolge:</p><figure')
            self.assertIn("Quotes by Mirko Peters from the episodes, each with its source episode:", SQ.block("mirko-peters", "en", lambda q: ("https://x/", "Ep")))

    def test_youtube_text_je_folge(self):
        for rel in ("entity/power-bi/index.html", "de/entity/power-bi/index.html", "ar/entity/power-bi/index.html"):
            h = self.read(rel)
            yt = [re.sub(r"<[^>]+>", "", t) for t in re.findall(r'<a href="https://www.youtube.com/watch\?v=[^"]+"[^>]*>(.*?)</a>', h)]
            self.assertEqual(len(yt), 3, rel)
            self.assertEqual(len(set(yt)), 3, f"{rel}: nie derselbe Text")
            self.assertTrue(all(t.startswith("YouTube: Power BI deep dive part") and len(t) <= 70 for t in yt), yt)
            self.assertNotIn(">Video on YouTube<", h)
            self.assertIn('aria-label="', h)


class Templates(unittest.TestCase):
    def test_lead_und_vorlagen_alle_sprachen(self):
        d = RS.data()
        for l in LANGS:
            self.assertEqual(set(d[l]["lead"]), {"ndp", "nd", "np", "n"} | ({"more"} if l == "de" else set()), l)
            self.assertEqual(set(d[l]["cat"]), set(d["en"]["cat"]), l)
            self.assertEqual(set(d[l]["type_noun"]), set(d["en"]["type_noun"]), l)
            self.assertEqual(set(d[l]["t"]), set(d["en"]["t"]), f"{l}: alle Satzvorlagen")
        inv = {}
        for x in ES.values():
            for p, t in x["rel"]:
                inv.setdefault(t, []).append((p, x["id"]))
        txt = lambda l, i: re.sub(r"<[^>]+>", "", RS.build(l, ES[i], ES[i]["rel"], inv.get(i, []), ES, lambda x: f"/{l}/entity/{x}/"))
        self.assertIn("Power BI ist ein Analyse- und BI-Werkzeug von Microsoft und Teil von Power Platform.", txt("de", "power-bi"))
        self.assertIn("Power BI is an analytics and BI tool by Microsoft and part of Power Platform.", txt("en", "power-bi"))
        self.assertIn("Power BIはMicrosoftの分析・BI ツールで、Power Platformの一部です。", txt("ja", "power-bi"))
        self.assertIn("Power BI: أداة تحليلات وذكاء أعمال من تطوير Microsoft، وجزء من Power Platform.", txt("ar", "power-bi"))
        self.assertIn("Polaris è un prodotto di iFAKT GmbH.", txt("it", "polaris"))
        self.assertIn("Power BI to narzędzie analityczne i BI firmy Microsoft i wchodzi w skład Power Platform.", txt("pl", "power-bi"))
        for l in LANGS:
            self.assertNotRegex(txt(l, "power-bi"), r"\{\w+\}|  ", l)

    def test_gegenrichtung_ar_he(self):
        es = copy.deepcopy(ES)
        es["jane"] = ent("jane", "person", "Jane", [("related_to", "power-bi")]); es["cert"] = ent("cert", "concept", "Cert X", [("covers", "power-bi"), ("requires", "power-bi")])
        inv = {}
        for x in es.values():
            for p, t in x["rel"]:
                inv.setdefault(t, []).append((p, x["id"]))
        for l, wants in (("ar", ("أشخاص يعملون على", "مصادر تتناول", "عناصر تتطلب")), ("he", ("אנשים שעוסקים ב-", "מקורות שעוסקים ב-", "רכיבים הדורשים את"))):
            h = RS.build(l, es["power-bi"], es["power-bi"]["rel"], inv["power-bi"], es, lambda x: f"/{l}/entity/{x}/")
            for w in wants:
                self.assertIn(w, h, l)

    def test_einleitungssatz_gruppe(self):
        self.assertEqual(ENT.rel_intro("de", "i.developed_by", EN.label(ES["microsoft"], "de"), 245), '<p class="lc" data-own-text="no">Alle 245 Produkte und Werke von Microsoft:</p>')
        self.assertEqual(ENT.rel_intro("en", "i.developed_by", "Microsoft", 245), '<p class="lc" data-own-text="no">All 245 products and works by Microsoft:</p>')
        self.assertEqual(ENT.rel_intro("ja", "i.developed_by", "Microsoft", 245), '<p class="lc" data-own-text="no">Microsoftの製品・作品すべて（245件）：</p>')
        self.assertIn("<bdi>Microsoft</bdi>: جميع المنتجات والأعمال (245):", ENT.rel_intro("ar", "i.developed_by", "Microsoft", 245))
        self.assertEqual(ENT.rel_intro("de", "i.developed_by", "Microsoft", 1), '<p class="lc" data-own-text="no">Produkte und Werke von Microsoft:</p>')
        self.assertEqual(ENT.rel_intro("de", "f.covers", "PL-300", 9), '<p class="lc" data-own-text="no">Themen, die PL-300 behandelt:</p>')
        self.assertEqual(ENT.rel_intro("en", "f.similar_to", "X", 2), '<p class="lc" data-own-text="no">Entries linked to X:</p>')
        self.assertEqual(ENT.rel_intro("fr", "i.developed_by", "Microsoft", 9), '<p class="lc" data-own-text="no">Les 9 produits et œuvres de Microsoft :</p>')


if __name__ == "__main__":
    unittest.main()
