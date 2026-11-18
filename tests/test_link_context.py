"""Beziehungskontext der Linklisten (Linktexte Paket 3, Mirko 17.11.2026): jeder Link zeigt, warum er da ist.

- data/link_context.json: alle Schluessel in allen 15 Sprachen, gleiche Platzhalter wie Englisch, keine Zahl in den Einleitungssaetzen.
- site_linkctx: Einleitungssatz ausserhalb des Links, Namen escaped, in ar/he als <bdi>, data-own-text="no".
- Entitaetsseite: Rueckfall-Satz aus gemeinsamen Folgen fuer Seiten ohne Beziehungen (dieselben ids in der Seitenleiste und in mentions, nichts in e["rel"]),
  Einleitungssaetze vor Folgen, Beziehungslisten und Zielen, volle Folgentitel ohne gleiche Texte fuer verschiedene Folgen, Sprunglinks mit Beziehung,
  eigene Liste fuer vergebene Zertifizierungen, Bauwarnung bei 0 Entitaetslinks im Inhalt.
- Folgen (Dub), Blog, Seitenleiste: gemeinsames Thema im Einleitungssatz, Ueberschrift der Themen-Karte mit Beziehung."""
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
import site_entities as ENT   # noqa: E402
import site_linkctx as LC   # noqa: E402
import site_linktext as LT   # noqa: E402
import site_relsent as RS   # noqa: E402
import site_sidebar as SBR   # noqa: E402
import site_taxonomy as TAX   # noqa: E402
import site_topics as TOP   # noqa: E402
import site_event_link as EVL   # noqa: E402
from site_i18n import COMM_LANGS   # noqa: E402
from site_learn import ENTS   # noqa: E402

BASE = "https://www.m365.fm"
TODAY = "2026-11-17"


def ent(i, t, name, rel=(), **k):
    return {"id": i, "type": t, "name": name, "desc": {"en": f"{name} is a test entry.", "de": f"{name} ist ein Testeintrag."}, "aliases": [], "rel": [list(x) for x in rel], **k}


def ents():
    es = {x["id"]: x for x in [
        ent("mirko-peters", "person", "Mirko Peters"), ent("hub", "org", "Hubco"), ent("lonely", "concept", "Accounts payable"),
        ent("invoice", "concept", "Invoice automation"), ent("d365", "product", "Dynamics 365 Finance"), ent("cat", "category", "Business application"),
        ent("graph", "product", "Microsoft Graph"), ent("guest", "person", "Jane Example")]}
    es.update({f"p{n}": ent(f"p{n}", "product", f"Hub Product {n}", [("developed_by", "hub")]) for n in range(9)})
    es.update({f"c{n}": ent(f"c{n}", "cert", f"Hub Cert {n}", [("developed_by", "hub")]) for n in range(8)})
    # Gemischte related_to-Liste (Gegenpruefung Paket 3): 3 Hin- und 5 Gegenkanten von Konzepten, 8 Personen mit related_to -> vsm
    es["vsm"] = ent("vsm", "concept", "Value stream mapping", [("related_to", f"k{n}") for n in range(3)])
    es.update({f"k{n}": ent(f"k{n}", "concept", f"Lean topic {n}", [("related_to", "vsm")] if n >= 3 else []) for n in range(8)})
    es.update({f"pp{n}": ent(f"pp{n}", "person", f"Person {n}", [("related_to", "vsm")]) for n in range(8)})
    return es


def ep(slug, title):
    return {"slug": slug, "e": {"title": title}, "url": f"{BASE}/show/episodes/{slug}/", "date": "2026-10-01", "sum": "Summary.", "lang": "en"}


EPS = {"lonely": [ep("e1", "Microsoft Graph: The Enterprise Nervous System"), ep("e2", "Invoice flows in Dynamics 365: what finance teams get wrong about approvals and automation at scale part one"),
                  ep("e3", "Invoice flows in Dynamics 365: what finance teams get wrong about approvals and automation at scale part two")],
       "guest": [ep("e1", "Microsoft Graph: The Enterprise Nervous System")]}
ABOUT = {"e1": ["lonely", "invoice", "mirko-peters", "cat", "guest"], "e2": ["lonely", "invoice", "d365"], "e3": ["lonely", "d365"]}


def build(es):
    tmp = tempfile.TemporaryDirectory(); docs = Path(tmp.name)

    def write(rel, content):
        p = docs / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(content, "utf-8")

    def page(lang, title, desc, url, body, alts=None, ld=None, side="", **k):
        lds = "".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in (ld or []))
        return f'<!doctype html><html lang="{lang}"><head><title>{title}</title>{lds}</head><body>{body}{side}</body></html>'

    def side(lang, text="", ids=None, exclude=(), home=False, topics_h=""):
        return f'<aside class="sbar" data-h="{LC.html.escape(topics_h)}" data-ids="{",".join(ids or [])}"></aside>'
    g = dict(BASE=BASE, write=write, page=page, header=lambda l, x="": "<header></header>", footer=lambda l: "<footer></footer>", footer_en=lambda: "<footer></footer>",
             LANGS={"de": ("Deutsch", "de")}, sitemap=[], TODAY=TODAY, api="https://api.test", url_of=lambda x: x.get("url", ""), anchor_title=lambda t, *a: t,
             ep_about=ABOUT, side=side, ep_sum=lambda x: x.get("sum", ""))
    out = io.StringIO()
    with mock.patch.dict(ENTS, es, clear=True), mock.patch.object(ENT, "COMM_LANGS", ["en", "de", "ar"]), mock.patch.object(ENT, "MOD_FILE", docs / "_entity_mod.json"), \
            mock.patch.object(ENT, "fetch_wiki", lambda *a: {}), mock.patch.object(ENT, "write_wk_js", lambda *a: None), mock.patch.dict(ENT.EVENTS, {}, clear=True), \
            contextlib.redirect_stdout(out):
        EVL.load([], (), (), TODAY)
        ENT.build(g, lambda lang: {}, {}, lambda e, lang="en": EPS.get(e["id"], []) if lang == "en" else [])
    return tmp, docs, out.getvalue()


def ld_of(h):
    return [json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S)]


def text(h):
    h = re.sub(r'<a href="[^"]*"[^>]*>(.*?)</a>', r"[\1]", h)
    return " ".join(re.sub(r"<[^>]+>", " ", h).split())


class Matrix(unittest.TestCase):
    def test_alle_sprachen_alle_schluessel(self):
        d = json.loads(LC.FILE.read_text("utf-8"))
        keys = d["keys"]
        self.assertEqual(sorted(l for l in d if not l.startswith("_") and l != "keys"), sorted(COMM_LANGS), "15 Sprachen wie relation_sentences.json")
        ph = lambda s: sorted(set(re.findall(r"\{(\w+)\}", s)))
        for l in COMM_LANGS:
            for k in keys:
                v = d[l].get(k)
                self.assertTrue(v and v.strip(), f"{l}: {k} fehlt")
                self.assertEqual(ph(v), ph(d["en"][k]), f"{l}: {k} Platzhalter")
                if not k.startswith(("more.", "side.")):
                    self.assertNotIn("{n}", v, f"{l}: {k} ohne Zahl (Pluralformen)")
                self.assertNotIn("<", v, f"{l}: {k} ohne HTML")
            self.assertEqual(set(k for k in d[l] if not k.startswith("_")), set(keys), f"{l}: keine fremden Schluessel")
        self.assertFalse(d["en"]["_mt"]); self.assertFalse(d["de"]["_mt"]); self.assertTrue(d["ja"]["_mt"])

    def test_intro_ausserhalb_des_links_escaped_bdi(self):
        h = LC.intro("de", "ent.eps", s="Power <BI>")
        self.assertEqual(h, '<p class="lc" data-own-text="no">Folgen, in denen Power &lt;BI&gt; besprochen wird:</p>')
        self.assertNotIn("<a", h)
        self.assertIn("<bdi>Power BI</bdi>", LC.intro("ar", "ent.eps", s="Power BI"))
        self.assertEqual(LC.plain("en", "side.entity", s="Power BI"), "Topics linked to Power BI")
        self.assertEqual(LC.intro("xx", "ep.guests"), '<p class="lc" data-own-text="no">Guests in this episode:</p>', "unbekannte Sprache: Englisch")
        self.assertEqual(LC.intro("en", "gibt.es.nicht"), "")
        self.assertEqual(LC.text("fr", "ent.eps", s="Azure"), "Épisodes où il est question d’Azure\u00a0:", "Franzoesisch: de -> d’ vor Vokal")
        self.assertEqual(LC.text("fr", "ent.eps", s="Power BI"), "Épisodes où il est question de Power BI\u00a0:")
        self.assertEqual(LC.plain("ar", "side.entity", s="A & B"), "مواضيع مرتبطة بـA & B", "Ueberschrift ohne HTML")

    def test_folgentitel_voll_und_eindeutig(self):
        self.assertEqual(LT.ep_text("Microsoft Graph: The Enterprise Nervous System (AI dub)"), "Microsoft Graph: The Enterprise Nervous System")
        long1 = "IoT Hub Message Routing vs Event Grid — why telemetry pipelines break under real load and what to do about it"
        long2 = "IoT Hub Message Routing vs Event Grid — why telemetry pipelines break under real load, the second look"
        self.assertTrue(LT.ep_text(long1).endswith("…")); self.assertLessEqual(len(LT.ep_text(long1)), 80)
        t = LT.ep_texts([(long1, "/a/"), (long2, "/b/"), (long1, "/a/")])
        self.assertEqual(t[:2], [long1, long2], "gleicher Kurztext fuer verschiedene Ziele -> voller Titel")
        self.assertEqual(LT.ep_texts([("Microsoft Graph", "/x/")], names=["microsoft graph"]), ["Microsoft Graph"])
        self.assertEqual(LT.ep_texts([("Short", "/x/")]), ["Short"])


class EntityPages(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.es = ents()
        cls.snapshot = copy.deepcopy(cls.es)
        cls.tmp, cls.docs, cls.log = build(cls.es)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def read(self, rel):
        return (self.docs / rel).read_text("utf-8")

    def test_rueckfall_satz_seitenleiste_mentions(self):
        h = self.read("entity/lonely/index.html")
        sec = re.search(r'<section class="en-rels en-cooc".*?</section>', h, re.S).group(0)
        self.assertIn("Often discussed together", sec)
        self.assertRegex(text(sec), r"Episodes about Accounts payable often also cover \[(Invoice automation|Dynamics 365 Finance)\] and \[(Invoice automation|Dynamics 365 Finance)\]\.",
                         "'often' nur mit Themen aus mindestens 2 gemeinsamen Folgen")
        self.assertNotIn("/entity/mirko-peters/", sec, "Host nie im Rueckfall-Satz"); self.assertNotIn("/entity/cat/", sec, "keine Kategorie"); self.assertNotIn("/entity/lonely/", sec)
        self.assertNotIn("/entity/guest/", sec, "Gaeste sind kein besprochenes Thema")
        ids = re.findall(r'/entity/([^/]+)/', sec)
        side = re.search(r'<aside class="sbar" data-h="([^"]*)" data-ids="([^"]*)"', h)
        self.assertEqual(side.group(1), "Often discussed with Accounts payable")
        self.assertEqual(side.group(2).split(","), ids, "dieselben ids in der Seitenleiste")
        page = next(x for x in ld_of(h) if x.get("@type") == "WebPage")
        self.assertEqual([m["@id"].split("/entity/")[1].split("/")[0] for m in page.get("mentions", [])][-len(ids):], ids, "Rueckfall-Themen in mentions")
        self.assertEqual(self.es["lonely"]["rel"], [], "nichts in e['rel'] geschrieben")
        self.assertEqual(self.es, self.snapshot, "Entitaeten unveraendert")
        hd = self.read("de/entity/lonely/index.html")
        self.assertIn("In Folgen zu Accounts payable geht es oft auch um", text(hd))
        self.assertIn('data-h="Oft zusammen mit Accounts payable besprochen"', hd)

    def test_rueckfall_eine_folge_ohne_oft(self):
        """Seite mit nur einer Folge (Person): Satz ohne 'oft', Personen-Fassung 'mit oder ueber', Ueberschriften ohne 'oft'."""
        h = self.read("entity/guest/index.html")
        sec = re.search(r'<section class="en-rels en-cooc".*?</section>', h, re.S).group(0)
        self.assertRegex(text(sec), r"^Also discussed The episode with or about Jane Example also covers \[(Accounts payable|Invoice automation)\] and \[(Accounts payable|Invoice automation)\]\.$")
        self.assertNotIn("often", sec.lower())
        self.assertIn('data-h="Also discussed with Jane Example"', h)
        hd = self.read("de/entity/guest/index.html")
        sd = re.search(r'<section class="en-rels en-cooc".*?</section>', hd, re.S).group(0)
        self.assertIn("In der Folge mit oder über Jane Example geht es auch um", text(sd)); self.assertNotIn("oft", text(sd))
        self.assertIn('data-h="Ebenfalls mit Jane Example besprochen"', hd)

    def test_related_to_personen_eigene_liste(self):
        """Gemischte related_to-Gegenrichtung: Personen in eigener Liste; Zahl und Nomen im Sprunglink = Eintraege der Zielliste."""
        for lang, rel, want in (("en", "entity/vsm/index.html", ["all 8 topics related to Value stream mapping", "all 8 people who work on Value stream mapping"]),
                                ("de", "de/entity/vsm/index.html", ["alle 8 mit Value stream mapping verwandten Themen", "alle 8 Personen, die sich mit Value stream mapping beschäftigen"])):
            h = self.read(rel)
            rels = re.search(r'<section class="en-rels".*?</section>', h, re.S).group(0)
            full = [(a, re.sub(r"<[^>]+>", "", t)) for a, t in re.findall(r'<a href="#(en-rel-\d+)">(.*?)</a>', rels)]   # Name ohne Uebersetzung steht in <span lang="en">
            self.assertEqual([t for _, t in full], want, lang)
            self.assertNotEqual(full[0][0], full[1][0], "eigene Sprungziele")
            for (a, t), kind in zip(full, ("k", "pp")):   # Themen-Liste nur Konzepte, Personen-Liste nur Personen
                m = re.search(rf'<h3 id="{a}">([^<]+)</h3><ul>(.*?)</ul>', h, re.S)
                items = re.findall(r'/entity/([^/]+)/', m.group(2))
                self.assertEqual(len(items), 8, f"{t}: Zahl = Liste")
                self.assertEqual({re.sub(r"\d+$", "", x) for x in items}, {kind}, f"{t}: Nomen passt zur Liste")
        self.assertIn("<h3 id=\"en-rel-2\">People working on this topic</h3>", self.read("entity/vsm/index.html"))

    def test_folgenliste_einleitung_und_titel(self):
        h = self.read("entity/lonely/index.html")
        self.assertIn('<p class="lc" data-own-text="no">Episodes in which Accounts payable is discussed:</p>', h)
        self.assertIn('>Microsoft Graph: The Enterprise Nervous System</a></h3>', h, "voller Titel statt nacktem Entitaetsnamen 'Microsoft Graph'")
        h3 = re.findall(r'<article class="en-ep"><h3><a href="([^"]+)">([^<]+)</a>', h)
        self.assertEqual(len(h3), 3)
        self.assertEqual(len({t for _, t in h3}), 3, "nie derselbe Linktext fuer zwei verschiedene Folgen")
        self.assertIn("Episodes with or about Jane Example:", self.read("entity/guest/index.html"), "Person -> Folgen")

    def test_sprunglinks_mit_beziehung_und_eigener_zertifikatsliste(self):
        h = self.read("entity/hub/index.html")
        rels = re.search(r'<section class="en-rels".*?</section>', h, re.S).group(0)
        self.assertNotRegex(rels, r">\d+ more</a>", "'N more' ist kein Link mehr")
        full = re.findall(r'<a href="#(en-rel-\d+)">([^<]+)</a>', rels)
        self.assertEqual([t for _, t in full], ["all 9 products and works by Hubco", "all 8 certifications issued by Hubco"])
        self.assertNotEqual(full[0][0], full[1][0], "eigene Sprungziele")
        for a, t in full:
            m = re.search(rf'<h3 id="{a}">([^<]+)</h3><ul>(.*?)</ul>', h, re.S)
            self.assertIsNotNone(m, a)
            self.assertEqual(len(re.findall("<li>", m.group(2))), int(re.search(r"\d+", t).group(0)), f"{t}: Zahl = Liste")
        self.assertIn("Certifications issued", h)
        self.assertIn('<p class="lc" data-own-text="no">All relationships of Hubco, grouped by type of relationship:</p>', h)
        self.assertIn("Vollständige Listen:", self.read("de/entity/hub/index.html"))
        self.assertIn('data-h="Topics linked to Hubco"', h)
        ha = self.read("ar/entity/hub/index.html")
        self.assertIn("<bdi>Hubco</bdi>", ha.split('class="en-full"')[1].split("</p>")[0])

    def test_keine_links_in_ueberschriften(self):
        for rel in ("entity/lonely/index.html", "entity/hub/index.html", "de/entity/hub/index.html"):
            h = self.read(rel)
            self.assertFalse(re.search(r"<h[1-6][^>]*>[^<]*<a ", h.split("<main", 1)[-1].replace('<h3><a href="https://www.m365.fm/show/episodes/', "")), rel)
            self.assertNotIn('class="lc"><a', h)

    def test_bauwarnung_null_entitaetslinks(self):
        self.assertRegex(self.log, r"WARNUNG Entitaetsseiten ohne Entitaetslink im Inhalt \(en\): \d+")
        self.assertNotRegex(self.log.split("(en):")[1].split("\n")[0], r"\blonely\b", "Seite mit Rueckfall-Satz hat Entitaetslinks")
        self.assertNotRegex(self.log.split("(en):")[1].split("\n")[0], r"\bhub\b")


class OtherPages(unittest.TestCase):
    def test_gemeinsames_thema_dub_folgen(self):
        it = {"vid": "a"}
        more = [{"vid": "b"}, {"vid": "c"}]
        raw = {"a": ["Copilot", "SharePoint"], "b": ["copilot"], "c": ["Copilot", "Teams"]}
        tags = {k: {t.lower() for t in v} for k, v in raw.items()}
        cats = {"a": {TAX.ORDER[0]}, "b": {TAX.ORDER[0]}, "c": {TAX.ORDER[0]}}
        self.assertEqual(TAX.common_topic(it, more, raw, tags, cats), ("tag", "Copilot"))
        raw["b"] = ["Viva"]; tags["b"] = {"viva"}
        self.assertEqual(TAX.common_topic(it, more, raw, tags, cats), ("cat", TAX.ORDER[0]), "kein gemeinsamer Tag: gemeinsame Kategorie")
        cats["c"] = set()
        self.assertIsNone(TAX.common_topic(it, more, raw, tags, cats))
        self.assertIsNone(TAX.common_topic(it, [], raw, tags, cats))
        self.assertEqual(LC.intro("de", "ep.more", t="Copilot"), '<p class="lc" data-own-text="no">Weitere Folgen zu Copilot:</p>')

    def test_gemeinsames_thema_blog(self):
        p = {"topics": ["power-bi", "fabric"]}
        self.assertEqual(TOP.common_topic(p, [{"topics": ["fabric", "power-bi"]}, {"topics": ["power-bi"]}]), "power-bi")
        self.assertEqual(TOP.common_topic(p, [{"topics": ["fabric"]}, {"topics": ["power-bi"]}]), None)
        self.assertIsNone(TOP.common_topic(p, []))

    def test_seitenleiste_ueberschrift(self):
        class Ix:
            all = {"copilot": {"id": "copilot", "name": "Copilot", "type": "product"}}
        h = SBR.render(Ix(), BASE, "de", "", [], None, None, ids=["copilot"], topics_h=LC.plain("de", "side.episode"))
        self.assertIn("<h2>Themen &amp; Personen dieser Folge</h2>", h)
        self.assertIn("<h2>Themen &amp; Personen auf dieser Seite</h2>", SBR.render(Ix(), BASE, "de", "", [], None, None, ids=["copilot"]), "ohne Angabe wie bisher")

    def test_community_event_bloecke_und_gaeste(self):
        """Profil/Firma: Sessions und Events mit Einleitungssatz samt Namen; Gaeste-Boerse: Einleitung je Liste (Gegenpruefung Paket 3)."""
        import site_events as EVT
        import site_guests as GST
        ev = {"handle": "ev1", "title": "Cloud Day", "start": "2026-12-01T09:00", "organizer": {"handle": "acme", "kind": "o", "name": "Acme"},
              "sessions": [{"title": "Copilot in practice", "start": "2026-12-01T10:00", "speakers": [{"h": "jane", "n": "Jane Example"}]}]}
        res = EVT.blocks(BASE, [ev], "de")
        self.assertIn('<p class="lc" data-own-text="no">Sessions, in denen Jane Example spricht:</p><ul>', res["u"]["jane"])
        self.assertIn('<p class="lc" data-own-text="no">Events, die Acme veranstaltet:</p><ul>', res["c"]["acme"])
        out = {}
        g = dict(BASE=BASE, write=lambda rel, c: out.__setitem__(rel, c), page=lambda lang, t, d, u, b, *a, **k: b, header=lambda l, x="": "", footer=lambda l: "",
                 footer_en=lambda: "", LANGS={"de": ("Deutsch", "de")}, sitemap=[], TODAY=TODAY)
        items = [{"handle": "jane", "name": "Jane Example", "title": "", "kind": "speaker", "topics": [], "formats": ["podcast"], "langs": ["en"]}]
        with mock.patch.object(GST, "COMM_LANGS", ["en", "de"]):
            GST.build(g, items, [{"handle": "jane"}])
        self.assertIn(LC.intro("en", "guests.speakers") + '<ul', out["community/guests/index.html"])
        self.assertIn(LC.intro("de", "guests.speakers") + '<ul', out["de/community/guests/index.html"])
        self.assertNotIn(LC.intro("en", "guests.hosts"), out["community/guests/index.html"], "leere Liste ohne Einleitung")

    def test_quelltexte_nutzen_die_matrix(self):
        """Jede Seitenart setzt ihren Einleitungssatz (Inventar in site_linkctx); fehlt einer, faellt der Test auf."""
        need = {"site_entities.py": ["ent.eps", "ent.arts", "ent.experts", "ent.experts_rel", "ent.relx", "ent.rellist", "ent.kp", "ent.sessions", "ent.spk_events",
                                     "ent.spk_sessions", "org.people", "ind.companies", "ind.members", "job.members", "side.entity", "side.cooc", "side.cooc_some", "event.sessions", "event.speakers"],
                "site_podpage.py": ["ep.guests", "ep.arts", "guest.eps", "side.episode"], "generate_site.py": ["ep.topics", "ep.more", "ep.more0", "cat.eps", "tag.eps", "side.episode"],
                "site_blog.py": ["post.topics", "post.more", "post.more0", "side.post"], "site_video.py": ["video.topics", "side.video"], "site_podcast.py": ["ep.topics"],
                "site_library.py": ["lib.topics"], "site_relsent.py": ["more.full"],
                "site_members.py": ["prof.expertise", "prof.certs", "prof.posts", "prof.channels", "prof.recs", "prof.contrib", "org.team", "org.expertise"],
                "site_events.py": ["event.topics", "event.session_topics", "event.sponsors", "event.media", "event.sessions", "event.my", "event.more"],
                "site_guests.py": ["guests.speakers", "guests.hosts"]}
        keys = set(json.loads(LC.FILE.read_text("utf-8"))["keys"])
        for f, ks in need.items():
            src = (ROOT / f).read_text("utf-8")
            for k in ks:
                self.assertIn(k, keys)
                self.assertIn(f'"{k}"', src, f"{f}: {k}")


if __name__ == "__main__":
    unittest.main()
