"""Namen in der Sprache der Seite (Audit Linktexte gap 5, Paket 4: SEO-3, E4, A11Y-6, A11Y-7).

- data/entity_names.json: gueltige ids, keine Eigennamen, nur Seitensprachen; Kategorien und Branchen in allen 14 Sprachen, de-Kategorien = relation_sentences de.cat.
- site_ename: ename mit Rueckfall auf name, englischer Rest (Begriff ohne Uebersetzung) mit lang="en", RTL in <bdi>, alternateName mit @language.
- Entitaetsseiten de/ja/ar: dieselbe Entitaet heisst auf einer Seite ueberall gleich (Satz, Liste, Kurz erklaert, Brotkruemel, H1, <title>,
  BreadcrumbList, Seitenleiste); JSON-LD name bleibt englisch, die Uebersetzung steht als alternateName mit @language.
- Weitere Stellen: Kontext-Links (title), Seitenleisten-Chips (Text und title), Titel (site_meta_entities), Suchindex (alternateName mit @value)."""
import contextlib
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
import site_ename as EN   # noqa: E402
import site_entities as ENT   # noqa: E402
import site_event_link as EVL   # noqa: E402
import site_linkctx as LC   # noqa: E402
import site_meta_entities as MM   # noqa: E402
import site_relsent as RS   # noqa: E402
import site_sidebar as SBR   # noqa: E402
from site_learn import ENTS   # noqa: E402

BASE = "https://www.m365.fm"
TODAY = "2026-11-17"
LANGS14 = ("de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")


def ent(i, t, name, rel=(), **k):
    return {"id": i, "type": t, "name": name, "desc": {"en": f"{name} is a test entry.", "de": f"{name} ist ein Testeintrag."}, "aliases": [], "rel": [list(x) for x in rel], **k}


def ents():
    es = {x["id"]: x for x in [
        ent("mirko-peters", "person", "Mirko Peters"), ent("microsoft", "org", "Microsoft"),
        ent("analytics-tool", "category", "Analytics and BI tool"),
        ent("power-bi", "product", "Power BI", [("instance_of", "analytics-tool"), ("developed_by", "microsoft"), ("related_to", "star-schema"), ("related_to", "vibe")]),
        ent("star-schema", "concept", "Star schema"),
        ent("vibe", "concept", "Performance analyzer (Power BI)"),   # Begriff ohne Uebersetzung, Name endet auf ")" (A11Y-7)
        ent("tableau", "product", "Tableau", [("instance_of", "analytics-tool")])]}
    return EN.apply(es)


def build(es, langs=("en", "de", "ja", "ar")):
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
             LANGS={"de": ("Deutsch", "de")}, sitemap=[], TODAY=TODAY, api="https://api.test", url_of=lambda x: x.get("url", ""), anchor_title=lambda t, *a: t,
             ep_about={}, side=side, ep_sum=lambda x: x.get("sum", ""))
    with mock.patch.dict(ENTS, es, clear=True), mock.patch.object(ENT, "COMM_LANGS", list(langs)), mock.patch.object(ENT, "MOD_FILE", docs / "_entity_mod.json"), \
            mock.patch.object(ENT, "fetch_wiki", lambda *a: {}), mock.patch.object(ENT, "write_wk_js", lambda *a: None), mock.patch.dict(ENT.EVENTS, {}, clear=True), \
            mock.patch.object(SBR, "con_img", lambda *a: ""), contextlib.redirect_stdout(io.StringIO()):
        EVL.load([], (), (), TODAY)
        ENT.build(g, lambda lang: {}, {}, lambda e, lang="en": [])
    return tmp, docs


def ld_of(h):
    return [json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S)]


def a_texts(h, href_part):
    """Linktexte (HTML) aller <a>, deren href href_part enthaelt."""
    return [t for u, t in re.findall(r'<a [^>]*?href="([^"]*)"[^>]*>(.*?)</a>', h, re.S) if href_part in u]


class Data(unittest.TestCase):
    def test_datei_gueltig(self):
        raw = json.loads(EN.FILE.read_text("utf-8"))
        base = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
        for i, v in raw.items():
            if i.startswith("_"):
                continue
            self.assertIn(i, base, f"{i}: unbekannte Entitaet")
            self.assertNotIn(base[i]["type"], EN.PROPER, f"{i}: Eigenname wird nicht uebersetzt")
            self.assertTrue(set(v) <= set(LANGS14), f"{i}: nur Seitensprachen ausser en")
            for l, n in v.items():
                self.assertTrue(n.strip() and n == n.strip() and "<" not in n, f"{i}/{l}: sauberer Text")
                self.assertNotEqual(n.casefold(), base[i]["name"].casefold(), f"{i}/{l}: gleicher Name wie Englisch ist keine Uebersetzung")
        cats = [i for i, e in base.items() if e["type"] == "category"]
        inds = [i for i, e in base.items() if e["type"] == "industry"]
        self.assertTrue(cats and inds)
        for i in cats + inds:
            self.assertEqual(set(raw.get(i) or {}), set(LANGS14), f"{i}: alle 14 Sprachen")
        cat_de = json.loads(RS.FILE.read_text("utf-8"))["de"]["cat"]
        for i in cats:
            self.assertEqual(raw[i]["de"], cat_de[i][1], f"{i}: deutscher Name = Einleitungssatz (gross geschrieben)")
            self.assertTrue(raw[i]["de"][:1].isupper())

    def test_geladene_entitaeten_haben_names(self):
        self.assertEqual(EN.ename(ENTS["analytics-tool"], "de"), "Analyse- und BI-Werkzeug")
        self.assertEqual(EN.ename(ENTS["analytics-tool"], "ja"), "分析・BI ツール")
        self.assertEqual(EN.ename(ENTS["star-schema"], "de"), "Sternschema")
        self.assertEqual(EN.ename(ENTS["power-bi"], "de"), "Power BI", "Produktname bleibt")


class Helper(unittest.TestCase):
    def test_ename_rueckfall_und_eigennamen(self):
        es = EN.apply({"c": {"id": "c", "type": "concept", "name": "Star schema"}, "p": {"id": "p", "type": "product", "name": "Power BI"}},
                      {"c": {"de": "Sternschema"}, "p": {"de": "Kraft BI"}})
        self.assertEqual(EN.ename(es["c"], "de"), "Sternschema")
        self.assertEqual(EN.ename(es["c"], "en"), "Star schema")
        self.assertEqual(EN.ename(es["c"], "fr"), "Star schema", "Rueckfall auf name")
        self.assertNotIn("names", es["p"], "Eigennamen bekommen keine Uebersetzung")
        self.assertFalse(EN.foreign(es["c"], "de")); self.assertTrue(EN.foreign(es["c"], "fr")); self.assertFalse(EN.foreign(es["c"], "en"))
        self.assertFalse(EN.foreign(es["p"], "fr"), "Eigenname ist kein englischer Rest")
        self.assertEqual(EN.ename(None, "de"), "")

    def test_feld_am_datensatz_gewinnt(self):
        es = EN.apply({"c": {"id": "c", "type": "concept", "name": "X", "names": {"de": "Eigen"}}}, {"c": {"de": "Datei", "fr": "Fichier"}})
        self.assertEqual(es["c"]["names"], {"de": "Eigen", "fr": "Fichier"})

    def test_html_name_lang_und_bdi(self):
        c = {"type": "concept", "name": "Performance analyzer (Power BI)"}
        p = {"type": "product", "name": "Power BI"}
        self.assertEqual(EN.html_name(c, "de"), '<span lang="en">Performance analyzer (Power BI)</span>')
        self.assertEqual(EN.html_name(c, "en"), "Performance analyzer (Power BI)")
        self.assertEqual(EN.html_name(c, "ar"), '<bdi lang="en">Performance analyzer (Power BI)</bdi>')
        self.assertEqual(EN.html_name(p, "he"), "<bdi>Power BI</bdi>")
        self.assertEqual(EN.html_name(p, "ja"), "Power BI")
        self.assertEqual(EN.html_name({"type": "concept", "name": "A <b>"}, "en"), "A &lt;b&gt;")

    def test_label_in_satzvorlagen(self):
        c = {"type": "concept", "name": "Star schema"}
        self.assertIn('<span lang="en">Star schema</span>', LC.intro("de", "ent.eps", s=EN.label(c, "de")))
        self.assertIn('<bdi lang="en">Star schema</bdi>', LC.intro("ar", "ent.eps", s=EN.label(c, "ar")))
        self.assertIn("<bdi>Power BI</bdi>", LC.intro("ar", "ent.eps", s="Power BI"), "einfacher Text wie bisher")

    def test_ld_alt(self):
        e = {"name": "Star schema", "names": {"ja": "スター スキーマ", "de": "Sternschema"}}
        self.assertEqual(EN.ld_alt(e, ["Sternschema"]), ["Sternschema", {"@value": "Sternschema", "@language": "de"}, {"@value": "スター スキーマ", "@language": "ja"}])
        self.assertEqual(EN.ld_alt({"name": "X"}, []), [])
        self.assertEqual(EN.ld_text({"@value": "Y", "@language": "de"}), "Y")


class EntityPages(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp, cls.docs = build(ents())

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def read(self, rel):
        return (self.docs / rel).read_text("utf-8")

    def test_de_kategorie_ueberall_deutsch(self):
        h = self.read("de/entity/power-bi/index.html")
        body = h.split("<body>", 1)[1]
        texts = [re.sub(r"<[^>]+>", "", t) for t in a_texts(body, "/de/entity/analytics-tool/")]
        self.assertGreaterEqual(len(texts), 4, "Satz, Brotkruemel, Liste, Kurz erklaert (Seitenleiste nimmt keine Kategorien)")
        self.assertEqual(set(texts), {"Analyse- und BI-Werkzeug"}, "eine Entitaet, ein Name auf der Seite")
        self.assertNotIn(">Analytics and BI tool<", body, "kein englischer Name als Text eines Elements (die Testbeschreibung darf ihn nennen)")
        nav = re.search(r'<nav aria-label="breadcrumb">(.*?)</nav>', h, re.S).group(1)
        self.assertIn(">Analyse- und BI-Werkzeug</a>", nav)
        ld = ld_of(h)[0]
        self.assertEqual([x["name"] for x in ld["breadcrumb"]["itemListElement"]][1:], ["Analyse- und BI-Werkzeug", "Power BI"])
        self.assertEqual(ld["mainEntity"]["name"], "Power BI")
        self.assertEqual(ld["mainEntity"]["category"], ["Analyse- und BI-Werkzeug"])
        self.assertEqual(ld["mainEntity"]["applicationCategory"], "Analyse- und BI-Werkzeug")

    def test_de_kategorieseite_h1_titel_ld(self):
        h = self.read("de/entity/analytics-tool/index.html")
        self.assertIn("<h1>Analyse- und BI-Werkzeug</h1>", h)
        self.assertRegex(re.search(r"<title>(.*?)</title>", h).group(1), r"^Analyse- und BI-Werkzeug")
        ld = ld_of(h)[0]
        self.assertEqual(ld["name"], "Analyse- und BI-Werkzeug", "WebPage in der Sprache der Seite")
        node = ld["mainEntity"]
        self.assertEqual(node["name"], "Analytics and BI tool", "Knoten mit sprachneutraler @id: name englisch")
        self.assertIn({"@value": "Analyse- und BI-Werkzeug", "@language": "de"}, node["alternateName"])
        self.assertIn({"@value": "分析・BI ツール", "@language": "ja"}, node["alternateName"])
        self.assertEqual(ld["breadcrumb"]["itemListElement"][-1]["name"], "Analyse- und BI-Werkzeug")
        self.assertIn(">Power BI</a>", h, "Beispiele: Produktnamen bleiben")
        en = self.read("entity/analytics-tool/index.html")
        self.assertIn("<h1>Analytics and BI tool</h1>", en)

    def test_de_begriffe_uebersetzt_oder_lang_en(self):
        h = self.read("de/entity/power-bi/index.html").split("<body>", 1)[1]
        self.assertEqual({re.sub(r"<[^>]+>", "", t) for t in a_texts(h, "/de/entity/star-schema/")}, {"Sternschema"})
        vibe = a_texts(h, "/de/entity/vibe/")
        self.assertTrue(vibe)
        self.assertTrue(all('<span lang="en">Performance analyzer (Power BI)</span>' in t for t in vibe), vibe)
        self.assertTrue(all("lang=" not in t for t in a_texts(h, "/de/entity/microsoft/")), "Eigenname ohne lang")

    def test_ja_namen_und_lang_en(self):
        h = self.read("ja/entity/power-bi/index.html").split("<body>", 1)[1]
        self.assertEqual({re.sub(r"<[^>]+>", "", t) for t in a_texts(h, "/ja/entity/analytics-tool/")}, {"分析・BI ツール"})
        rel = re.search(r'<section class="en-rels".*?</section>', h, re.S).group(0)
        self.assertIn(">分析・BI ツール</a>のカテゴリーに属します", rel)
        self.assertIn(">スター スキーマ</a>", h)
        self.assertTrue(all('<span lang="en">' in t for t in a_texts(h, "/ja/entity/vibe/")))
        self.assertNotIn(">Analytics and BI tool<", h)
        ja_cat = self.read("ja/entity/analytics-tool/index.html")
        self.assertIn("<h1>分析・BI ツール</h1>", ja_cat)
        root = ENT.S["ja"]["entities"]
        nav = re.search(r'<nav aria-label="breadcrumb">(.*?)</nav>', h, re.S).group(1)
        if root == ENT.S["en"]["entities"]:   # Oberflaechentext ohne Uebersetzung: englischer Rest mit lang="en"
            self.assertIn(f'<span lang="en">{root}</span></a>', nav)
        else:
            self.assertNotIn('lang="en"', nav.split("›")[0])

    def test_ar_bdi_in_allen_bloecken(self):
        h = self.read("ar/entity/power-bi/index.html").split("<body>", 1)[1]
        for part, want in (("/ar/entity/vibe/", '<bdi lang="en">Performance analyzer (Power BI)</bdi>'), ("/ar/entity/microsoft/", "<bdi>Microsoft</bdi>"),
                           ("/ar/entity/analytics-tool/", "<bdi>أداة تحليلات وذكاء أعمال</bdi>")):
            ts = a_texts(h, part)
            self.assertGreaterEqual(len(ts), 2, part)
            self.assertTrue(all(want in t for t in ts), (part, ts))
        self.assertIn("<h1><bdi>Power BI</bdi></h1>", h)

    def test_seitenleiste_name_und_typ_in_seitensprache(self):
        h = self.read("de/entity/power-bi/index.html")
        chips = re.findall(r'<a class="sb-chip t-(\w+)" href="[^"]*/entity/([\w-]+)/" title="([^"]*)"><i></i>(.*?)</a>', h)
        by = {i: (t, ti, x) for t, i, ti, x in chips}
        self.assertEqual(by["star-schema"], ("concept", "Konzept", "Sternschema"))
        self.assertEqual(by["vibe"][2], '<span lang="en">Performance analyzer (Power BI)</span>')
        self.assertEqual(by["microsoft"][1], "Organisation")


class OtherPlaces(unittest.TestCase):
    def test_titel_und_beschreibung(self):
        e = {"id": "analytics-tool", "type": "category", "name": "Analytics and BI tool", "names": {"de": "Analyse- und BI-Werkzeug", "ja": "分析・BI ツール"}}
        self.assertTrue(MM.entity_title("de", e).startswith("Analyse- und BI-Werkzeug"))
        self.assertTrue(MM.entity_title("en", e).startswith("Analytics and BI tool"))
        self.assertIn("分析・BI ツール", MM.entity_title("ja", e))

    def test_kontextlink_title_in_seitensprache(self):
        import site_entmatch as EM
        es = {"star-schema": {"id": "star-schema", "type": "concept", "name": "Star schema", "names": {"de": "Sternschema"}, "rel": []}}
        m = EM.Matcher(es, common=set(), cooc=({}, {}))
        h, links = m.link_html("<p>Ein Star schema ordnet Fakten.</p>", lambda i: f"/de/entity/{i}/", lang="de")
        self.assertEqual(links, [("Star schema", "star-schema")])
        self.assertIn('title="Sternschema"', h)
        h2, _ = m.link_html("<p>A Star schema keeps facts.</p>", lambda i: f"/entity/{i}/", lang="en")
        self.assertNotIn("title=", h2)
        h3, _ = m.link_html("<p>A Star schema keeps facts.</p>", lambda i: f"/ar/entity/{i}/", lang="ar")
        self.assertIn('class="en-al"><bdi lang="en">Star schema</bdi></a>', h3, "RTL: lateinischer Linktext in <bdi>, englischer Begriff mit lang (Paket 5)")
        self.assertIn('title="Sternschema" lang="en">Star schema</a>', h, "Wortlaut des Satzes bleibt, englisches Wort mit lang (Paket 5)")

    def test_suchindex_liest_alternatename_mit_sprache(self):
        import site_search as SS
        node = {"@context": "https://schema.org", "@type": "WebPage", "@id": "https://www.m365.fm/de/entity/x/#page", "url": "https://www.m365.fm/de/entity/x/", "name": "X",
                "mainEntity": {"@type": "DefinedTerm", "@id": "https://www.m365.fm/de/entity/x/#entity", "name": "Star schema",
                               "alternateName": ["Dimensional modelling", {"@value": "Sternschema", "@language": "de"}]}}
        html_ = (f'<html lang="de"><head><title>X | M365.FM</title><link rel="canonical" href="https://www.m365.fm/de/entity/x/">'
                 f'<script type="application/ld+json">{json.dumps(node)}</script></head><body></body></html>')
        doc = SS.extract("https://www.m365.fm/de/entity/x/", html_, "de", "entity")
        self.assertTrue(doc)
        self.assertIn("Sternschema", doc["keywords"])
        self.assertNotIn("@value", doc["keywords"])


ADJ_RX = r"\b(?:mit|von|zu|bei|aus|nach|seit)\s+(?:<[^>]+>)*(?:Bedingter Zugriff|Maschinelles Lernen|Öffentlicher Sektor|Erweiterte Suche)"


class DeutschNachPraeposition(unittest.TestCase):
    """Gegenpruefung Paket 4: deutsche Namen mit Adjektiv am Anfang ("Bedingter Zugriff") stehen nach einer Praeposition als Apposition mit Artikel,
    der Linktext bleibt der Zielname im Nominativ."""

    def es(self):
        return EN.apply({x["id"]: x for x in [
            ent("conditional-access", "concept", "Conditional Access", [("related_to", "machine-learning"), ("related_to", "star-schema")]),
            ent("machine-learning", "concept", "Machine learning"), ent("star-schema", "concept", "Star schema"),
            ent("digital-twin", "concept", "Digital twin", [("broader", "conditional-access")]),
            ent("public-sector", "industry", "Public sector"),
            ent("jane-doe", "person", "Jane Doe", [("related_to", "machine-learning"), ("related_to", "conditional-access"), ("related_to", "star-schema")])]})

    def test_de_adj_aus_den_daten(self):
        es = {i: {"id": i, "type": "concept", "name": n} for i, n in (("conditional-access", "Conditional Access"), ("machine-learning", "Machine learning"),
              ("star-schema", "Star schema"), ("adaptive-scopes", "Adaptive scopes"), ("active-directory-forest", "Active Directory forest"))}
        EN.apply(es)
        self.assertEqual({i: EN.de_adj(e) for i, e in es.items()},
                         {"conditional-access": "m", "machine-learning": "n", "star-schema": "", "adaptive-scopes": "f", "active-directory-forest": ""})

    def test_put_dativ_akkusativ_zusammengezogen(self):
        es = self.es()
        ca, ml, ps = es["conditional-access"], es["machine-learning"], es["public-sector"]
        self.assertEqual(EN.put("de", "Eng mit {s} verwandt", "s", ca, "X"), "Eng mit dem Thema X verwandt")
        self.assertEqual(EN.put("de", "Alle Beziehungen von {s}:", "s", ca, "X"), "Alle Beziehungen vom Thema X:")
        self.assertEqual(EN.put("de", "Weitere Artikel zu {t}:", "t", ml, "X"), "Weitere Artikel zum Thema X:")
        self.assertEqual(EN.put("de", "geht es um {x}", "x", ca, "X"), "geht es um das Thema X", "maskulin: Akkusativ anders als Nominativ")
        self.assertEqual(EN.put("de", "geht es um {x}", "x", ml, "X"), "geht es um X", "neutral: Akkusativ = Nominativ")
        self.assertEqual(EN.put("de", "Firmen zu {s}", "s", ps, "X"), "Firmen zur Branche X")
        self.assertEqual(EN.put("de", "{s} ist ein Konzept", "s", ca, "X"), "X ist ein Konzept", "Nominativ ohne Praeposition")
        self.assertEqual(EN.put("de", "Folgen mit {s}", "s", es["star-schema"], "X"), "Folgen mit X", "Nomen am Anfang: keine Apposition")
        self.assertEqual(EN.put("en", "Related to {s}", "s", ca, "X"), "Related to X")

    def test_linkctx_alle_de_vorlagen(self):
        es = self.es()
        bad = []
        for key, tpl in (LC.data().get("de") or {}).items():
            if not isinstance(tpl, str) or not re.search(r"\{[st]\}", tpl):
                continue
            for i in ("conditional-access", "machine-learning", "public-sector"):
                h = LC.text("de", key, s=EN.label(es[i], "de"), t=EN.label(es[i], "de"), n=3)
                if re.search(ADJ_RX, h):
                    bad.append((key, h))
        self.assertEqual(bad, [])
        self.assertEqual(LC.text("de", "ent.rellist", s=EN.label(es["conditional-access"], "de")), "Alle Beziehungen vom Thema Bedingter Zugriff, nach Art der Beziehung geordnet:")
        self.assertEqual(LC.text("de", "post.more", t=EN.label(es["machine-learning"], "de")), "Weitere Artikel zum Thema Maschinelles Lernen:")

    def test_beziehungssaetze_conditional_access(self):
        es = self.es()
        href = lambda i: f"/de/entity/{i}/"
        rel = lambda i: ([(p, t) for p, t in es[i]["rel"]], [(p, x["id"]) for x in es.values() for p, t in x["rel"] if t == i])
        h = RS.build("de", es["conditional-access"], *rel("conditional-access"), es, href)
        txt = re.sub(r"<[^>]+>", "", h)
        self.assertIn("Eng mit dem Thema Bedingter Zugriff verwandt sind", txt)
        self.assertIn("Ein Unterbegriff vom Thema Bedingter Zugriff ist Digitaler Zwilling", txt)
        self.assertNotRegex(h, ADJ_RX)
        p = RS.build("de", es["jane-doe"], *rel("jane-doe"), es, href)
        self.assertIn('beschäftigt sich mit dem Thema <a href="/de/entity/machine-learning/">Maschinelles Lernen</a>', p, "Linktext = Zielname")
        self.assertIn('dem Thema <a href="/de/entity/conditional-access/">Bedingter Zugriff</a>', p)
        self.assertIn('<a href="/de/entity/star-schema/">Sternschema</a>', p)
        self.assertNotIn("dem Thema <a href=\"/de/entity/star-schema/", p)
        self.assertNotRegex(p, ADJ_RX)
        en = RS.build("en", es["conditional-access"], *rel("conditional-access"), es, lambda i: f"/entity/{i}/")
        self.assertNotIn("Thema", en)

    def test_rueckfallsatz_cooc(self):
        es = self.es()
        h = RS.cooc("de", es["conditional-access"], ["digital-twin", "machine-learning"], es, lambda i: f"/de/entity/{i}/")
        txt = re.sub(r"<[^>]+>", "", h)
        self.assertIn("In Folgen zum Thema Bedingter Zugriff geht es oft auch um das Thema Digitaler Zwilling und Maschinelles Lernen.", txt)


class KontextLinksInSeitensprache(unittest.TestCase):
    """Gegenpruefung Paket 4: der Name in der Sprache der Seite wird im Fliesstext erkannt (erste Nennung), nur auf Seiten dieser Sprache."""

    def m(self):
        import site_entmatch as EM
        es = EN.apply({x["id"]: x for x in [
            ent("star-schema", "concept", "Star schema", aliases=["Sternschema"]), ent("conditional-access", "concept", "Conditional Access"),
            ent("advanced-hunting", "concept", "Advanced hunting", [("related_to", "defender")]), ent("defender", "product", "Microsoft Defender"),
            ent("education", "industry", "Education")]})
        for e in es.values():
            e.pop("desc", None)
        return EM.Matcher(es, common=set(), cooc=({}, {}))

    def test_de_name_verlinkt_nur_auf_de(self):
        m = self.m()
        h, links = m.link_html("<p>Ein Sternschema ordnet Fakten. Bedingter Zugriff schützt. Noch ein Sternschema.</p>", lambda i: f"/de/entity/{i}/", lang="de")
        self.assertEqual(links, [("Sternschema", "star-schema"), ("Bedingter Zugriff", "conditional-access")])
        self.assertNotIn("title=", h, "Linktext = Name in der Sprache der Seite")
        _, en = m.link_html("<p>Ein Sternschema ordnet Fakten. Bedingter Zugriff schützt.</p>", lambda i: f"/entity/{i}/", lang="en")
        self.assertEqual(en, [], "englische Seite: deutsche Namen gelten nicht (Sternschema ist dort nur Kurzname ohne Kontext)")
        self.assertEqual(m.ids_tags("bedingter zugriff, sternschema"), {}, "Schlagwoerter: nur sprachneutrale Formen")

    def test_ja_name(self):
        _, links = self.m().link_html("<p>条件付きアクセス と スター スキーマ</p>", lambda i: f"/ja/entity/{i}/", lang="ja")
        self.assertEqual(links, [("条件付きアクセス", "conditional-access"), ("スター スキーマ", "star-schema")])

    def test_regeln_wie_beim_namen(self):
        m = self.m()
        u = lambda i: f"/de/entity/{i}/"
        self.assertEqual(m.link_html("<p>Die erweiterte Suche in Word findet Dateien.</p>", u, lang="de")[1], [], "klein geschrieben: nur mit Kontext")
        self.assertEqual(m.link_html("<p>Mit Erweiterte Suche jagen Analysten.</p>", u, lang="de")[1], [("Erweiterte Suche", "advanced-hunting")])
        self.assertEqual(m.link_html("<p>Die erweiterte Suche in Microsoft Defender.</p>", u, lang="de")[1],
                         [("erweiterte Suche", "advanced-hunting"), ("Microsoft Defender", "defender")], "Kontext stuetzt")
        self.assertEqual(m.link_html("<p>Projekte im Bildungswesen.</p>", u, lang="de")[1], [], "Branche als Einzelwort nur mit Hinweis")
        self.assertEqual(m.link_html("<p>Firmen der Branche Bildungswesen.</p>", u, lang="de")[1], [("Bildungswesen", "education")])


class ExportOhneNames(unittest.TestCase):
    """Gegenpruefung Paket 4: names gehen nicht ueber /entities.json nach D1, und eine D1-Fassung mit alten names gewinnt nicht."""

    def test_export_ohne_names(self):
        recs = [{"id": "a", "name": "A", "type": "concept", "names": {"de": "Ä"}}]
        self.assertEqual(ENT.export_recs(recs), [{"id": "a", "name": "A", "type": "concept"}])
        self.assertIn("names", recs[0], "Eintrag selbst unveraendert")

    def test_d1_names_werden_ueberschrieben(self):
        import site_learn as SL
        item = {"id": "conditional-access", "created": 1, "src": "seed",
                "data": {"name": "Conditional Access", "type": "concept", "desc": {"en": "x", "de": ""}, "names": {"de": "Alter Name", "fr": "Vieux"}}}
        with mock.patch.object(SL, "_fetch_json", return_value={"items": [item]}):
            es = SL.load_entities("https://api.example.test")
        want = EN.load()["conditional-access"]
        self.assertEqual(es["conditional-access"]["names"], want)
        self.assertEqual(es["conditional-access"]["names"]["de"], "Bedingter Zugriff")


if __name__ == "__main__":
    unittest.main()
