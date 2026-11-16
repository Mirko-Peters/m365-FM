"""Linktexte in den Vorlagen (Audit Linktexte F1-F6): Linktext nennt das Ziel, gleicher Text heisst gleiches Ziel, kurze Knopftexte bekommen
ein aria-label mit Ziel, Pfeile/Icons sind fuer Screenreader versteckt, alles in der Seitensprache."""
import copy
import json
import re
import sys
import tempfile
import unittest
from collections import defaultdict
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import site_linktext as LT   # noqa: E402
import site_i18n   # noqa: E402

BASE = "https://www.m365.fm"
OTHER = "fr es it nl pt pl id ru uk ar he ja ko".split()
MIRKO = [{"kind": "github", "url": "https://github.com/Mirko-Peters"}, {"kind": "website", "url": "https://m365con.net/"},
         {"kind": "linkedin", "url": "https://www.linkedin.com/in/m365showpodcast/"}, {"kind": "website", "url": "https://www.m365.fm/"},
         {"kind": "podcast", "url": "https://www.spreaker.com/show/6704921"}, {"kind": "podcast", "url": "https://www.spreaker.com/show/7393187"},
         {"kind": "youtube", "url": "https://www.youtube.com/channel/UCIdo4tN3khKldHP3733E9JA"}]


def anchors(h):
    """[(href, sichtbarer Text, aria-label)] aller Links (Text ohne Tags und ohne aria-hidden-Teile)."""
    out = []
    for m in re.finditer(r'<a\b([^>]*)>(.*?)</a>', h, re.S):
        attrs, inner = m.group(1), m.group(2)
        if 'aria-hidden="true"' in attrs:
            continue
        inner = re.sub(r'<span aria-hidden="true">.*?</span>', "", inner, flags=re.S)
        href = re.search(r'href="([^"]*)"', attrs)
        al = re.search(r'aria-label="([^"]*)"', attrs)
        out.append(((href.group(1) if href else ""), " ".join(re.sub(r"<[^>]+>", "", inner).split()), al.group(1) if al else None))
    return out


def same_text_other_target(h):
    """Linknamen (aria-label oder Text), die auf verschiedene Ziele zeigen."""
    by = defaultdict(set)
    for href, t, al in anchors(h):
        by[(al or t).casefold()].add(href)
    return {k: v for k, v in by.items() if len(v) > 1}


class ChannelLabels(unittest.TestCase):
    def test_mirko_kanaele_eindeutig_mit_namen(self):
        rows = LT.channel_links(MIRKO, "de", "Mirko Peters")
        texts = [t for _, t, _ in rows]
        self.assertEqual(texts, ["GitHub", "m365con.net", "LinkedIn", "M365.FM", "M365.FM English auf Spreaker", "M365.FM Deutsch auf Spreaker", "YouTube"])
        self.assertEqual(len(set(texts)), len(texts), "kein Text doppelt")
        for bad in ("Web", "Podcast", "Link", "Website"):
            self.assertNotIn(bad, texts, "nicht die Art des Kanals als Linktext")
        aria = {t: a for _, t, a in rows}
        self.assertEqual(aria["LinkedIn"], "Mirko Peters auf LinkedIn")
        self.assertEqual(aria["YouTube"], "Mirko Peters auf YouTube")
        self.assertIsNone(aria["m365con.net"])
        for t, a in aria.items():   # WCAG 2.5.3: sichtbarer Text steckt im zugaenglichen Namen
            if a:
                self.assertIn(t.casefold(), a.casefold())

    def test_lokalisiert(self):
        fr = {t: a for _, t, a in LT.channel_links(MIRKO, "fr", "Mirko Peters")}
        self.assertEqual(fr["LinkedIn"], "Mirko Peters sur LinkedIn")
        self.assertIn("M365.FM Deutsch sur Spreaker", fr)
        en = [t for _, t, _ in LT.channel_links(MIRKO, "en", "Mirko Peters")]
        self.assertIn("M365.FM English on Spreaker", en)

    def test_gleiches_label_bekommt_domain_oder_pfad(self):
        rows = LT.channel_links([{"kind": "youtube", "url": "https://www.youtube.com/@a"}, {"kind": "youtube", "url": "https://www.youtube.com/@b"},
                                 {"kind": "podcast", "url": "https://open.spotify.com/show/1"}, {"kind": "podcast", "url": "https://open.spotify.com/show/2"},
                                 {"kind": "website", "url": "https://example.com/"}, {"kind": "blog", "url": "https://example.com/blog/"}], "de", "Jane")
        texts = [t for _, t, _ in rows]
        self.assertEqual(len(set(texts)), len(texts), texts)
        self.assertEqual(texts[0], "YouTube (youtube.com/@a)")
        self.assertEqual(rows[0][2], "Jane auf YouTube (youtube.com/@a)")
        self.assertEqual(texts[2], "Jane auf Spotify (open.spotify.com/show/1)")
        self.assertEqual(texts[4], "example.com"); self.assertEqual(texts[5], "example.com (example.com/blog)")

    def test_eigenes_label_und_sonderfaelle(self):
        self.assertEqual(LT.channel_label({"kind": "website", "url": "https://x.example/", "label": "Mein Blog"}, "de")[0], "Mein Blog")
        self.assertEqual(LT.channel_label({"kind": "website", "url": "https://www.linkedin.com/company/acme/"}, "de")[0], "linkedin.com/company/acme")
        self.assertEqual(LT.channel_label({"kind": "mastodon", "url": "https://hachyderm.io/@jane"}, "en", "Jane"), ("Mastodon", "Jane on Mastodon"))
        self.assertEqual(LT.channel_label({"kind": "blog", "url": "https://de.wikipedia.org/wiki/X"}, "de")[0], "Wikipedia")
        self.assertEqual(LT.channel_label({"kind": "other", "url": "kaputt"}, "de")[0], "Link")

    def test_show_ids_wie_generate_site(self):
        import generate_site as G
        for l, v in G.LANGS.items():
            self.assertEqual(LT.SHOWS[str(v[3])], "M365.FM " + v[0], l)
        import site_episode_urls as EU
        self.assertEqual(LT.SHOWS[str(EU.EN_SHOW_ID)], "M365.FM English")

    def test_feed_plattform(self):
        import site_feed as SFD
        self.assertEqual(SFD.plat_of({"kind": "other", "url": "https://www.example.org/post"}), "example.org")
        self.assertEqual(SFD.plat_of({"kind": "youtube", "url": "https://www.youtube.com/watch?v=x"}), "YouTube")
        self.assertEqual(SFD.plat_of({"kind": "website", "url": "https://jane.substack.com/p/x"}), "Substack")


class AuthorBox(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import generate_site as G
        cls.G = G
        cls.prof = {"handle": "mirko-p", "name": "Mirko Peters", "about": "Bio.", "programs": [{"p": "mvp", "verified": True}], "channels": MIRKO,
                    "expertise": [], "certs": []}

    def box(self, lang):
        with mock.patch.dict(self.G.AUTHOR, self.prof, clear=True):
            return self.G.author_box(lang)

    def test_keine_gleichen_texte_fuer_verschiedene_ziele(self):
        for lang in ["de", "en"] + OTHER:
            h = self.box(lang)
            self.assertEqual(same_text_other_target(h), {}, lang)
            self.assertNotRegex(h, r'itemprop="sameAs"[^>]*>(Web|Podcast)</a>', lang)

    def test_aria_label_netzwerk_und_beschriftung_lokalisiert(self):
        self.assertIn('aria-label="Mirko Peters auf LinkedIn"', self.box("de"))
        self.assertIn('aria-label="Über den Autor"', self.box("de"))
        fr = self.box("fr")
        self.assertIn('aria-label="À propos de l&#x27;auteur"', fr)
        self.assertIn('aria-label="Mirko Peters sur LinkedIn"', fr)
        for lang in OTHER:
            self.assertNotIn('aria-label="About the author"', self.box(lang), lang)


class Footer(unittest.TestCase):
    EN = ("Updates & roadmap", "Press kit", "Media kit", "Legal notice", "Privacy", "Security")

    def test_footer_in_seitensprache(self):
        import generate_site as G
        d = json.loads((ROOT / "data" / "py_i18n.json").read_text("utf-8"))
        for lang in OTHER:
            f = G.footer(lang)
            for s in self.EN:
                self.assertIn(">" + G.esc(d[s][lang]) + "</a>", f, f"{lang}: Footer-Text {s} in der Seitensprache")
            for s in ("Updates &amp; roadmap", "Press kit", "Legal notice", ">Security<"):   # in keiner der 13 Sprachen gleich dem Englischen
                self.assertNotIn(s, f, f"{lang}: englischer Footer-Text {s}")
            self.assertIn('lang="de" hreflang="de">Impressum</a>', f, lang)
        fr = G.footer("fr")
        self.assertIn(">Mentions légales</a>", fr); self.assertIn(">Kit presse</a>", fr); self.assertIn('hreflang="en">Confidentialité</a>', fr)

    def test_footer_de_en(self):
        import generate_site as G
        de, en = G.footer("de"), G.footer("en")
        self.assertIn(">Pressekit</a>", de); self.assertIn(">Updates &amp; Roadmap</a>", de); self.assertIn(">Sicherheit</a>", de)
        self.assertIn('lang="en" hreflang="en">Legal notice</a>', de, "englischer Linktext auf deutscher Seite traegt lang")
        self.assertIn('rel="nofollow">Impressum</a>', de)
        self.assertIn(">Press kit</a>", en); self.assertIn('rel="nofollow">Legal notice</a>', en); self.assertNotIn('lang="en"', en)
        self.assertEqual(same_text_other_target(de), {})


class ShareBar(unittest.TestCase):
    def test_teilen_labels(self):
        import generate_site as G
        de = G.share_html("de", "https://www.m365.fm/de/x/", "Titel")
        self.assertIn('aria-label="Auf LinkedIn teilen"', de); self.assertIn('aria-label="Per E-Mail teilen"', de)
        self.assertNotIn('aria-label="LinkedIn"', de)
        self.assertIn('aria-label="Partager sur LinkedIn"', G.share_html("fr", "https://www.m365.fm/fr/x/", "T"))
        self.assertIn('aria-label="Share on X"', G.share_html("en", "https://www.m365.fm/x/", "T"))


class DubEpisode(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import generate_site as G
        cls.G = G
        cls.sh = {"apple_show": "https://apple/show", "spotify_show": "https://spotify/show", "amazon_show": "https://amazon/show", "deezer_show": "https://deezer/show"}

    def test_plattformknoepfe_nur_mit_folgenlink(self):
        h = self.G.ep_btns("de", {}, self.sh, "https://spk", "https://yt", "Copilot Agents erklärt")
        for p in ("Apple Podcasts", "Spotify", "Deezer", "Amazon Music"):
            self.assertNotIn(p, h, "ohne echten Folgenlink kein Plattformknopf")
        h = self.G.ep_btns("de", {"apple": "https://apple/ep", "spotify": "https://spotify/ep"}, self.sh, "https://spk", "https://yt", "Copilot Agents erklärt")
        self.assertIn('href="https://apple/ep" rel="noopener">Diese Folge bei Apple Podcasts</a>', h)
        self.assertIn(">Diese Folge bei Spotify</a>", h)
        self.assertNotIn("https://apple/show", h)

    def test_kurztexte_mit_ziel_und_vtt(self):
        h = self.G.ep_btns("de", {}, {}, "https://spk", "https://yt", "Copilot Agents erklärt", {"txt": "a.txt", "vtt": "a.vtt"})
        self.assertIn('aria-label="Jetzt anhören: Copilot Agents erklärt – Spreaker"><span aria-hidden="true">🎧</span> Jetzt anhören</a>', h)
        self.assertIn('aria-label="Video auf YouTube ansehen: Copilot Agents erklärt"', h)
        self.assertIn(">Untertitel (WebVTT)</a>", h); self.assertNotIn(">VTT</a>", h)
        self.assertIn(">Sous-titres (WebVTT)</a>", self.G.ep_btns("fr", {}, {}, "s", "y", "T", {"txt": "a.txt", "vtt": "a.vtt"}))

    def test_show_zeile_ziel_im_link(self):
        r = self.G.show_row("de", self.sh)
        self.assertIn('<a href="https://apple/show" rel="noopener">M365.FM Deutsch bei Apple Podcasts</a>', r)
        self.assertIn(">M365.FM Deutsch bei Amazon Music</a>", r)
        self.assertIn(">M365.FM Français sur Spotify</a>", self.G.show_row("fr", self.sh))
        h = self.G.ep_btns("de", {"apple": "https://apple/ep"}, self.sh, "s", "y", "T") + r
        self.assertEqual(same_text_other_target(h), {})

    def test_original_mit_titel(self):
        o = self.G.orig_link("de", "copilot-agents", "Copilot Agents explained in depth (AI)")
        self.assertIn('href="https://www.m365.fm/show/episodes/copilot-agents/" hreflang="en">Original (Englisch): <span lang="en">Copilot Agents explained in depth</span></a>', o.replace(self.G.BASE, BASE))
        self.assertIn(">Original (Englisch): <span lang=\"en\">Copilot Agents everywhere</span></a>", self.G.orig_link("de", "x", "Copilot Agents everywhere: the guide"), "Kernthema wie anchor_title")
        self.assertIn("Original (anglais)", self.G.orig_link("fr", "x", "T"))
        self.assertEqual(self.G.orig_link("de", None, "T"), "")

    def test_alle_folgen_pfeil_versteckt(self):
        b = self.G.all_eps_btn("de", 12, "btn main")
        self.assertIn('aria-label="Alle Folgen (12) – M365.FM Deutsch"', b)
        self.assertIn('Alle Folgen (12) <span aria-hidden="true">→</span></a>', b)


class EntityPages(unittest.TestCase):
    def test_ext_label(self):
        self.assertEqual(LT.ext_label("de", "Teams", "docs", "https://learn.microsoft.com/microsoftteams/"), "Teams – Microsoft Learn")
        self.assertEqual(LT.ext_label("de", "Teams", "docs", "https://docs.example.com/"), "Teams – Dokumentation")
        self.assertEqual(LT.ext_label("de", "Teams", "web", "https://teams.com"), "Teams – offizielle Website")
        self.assertEqual(LT.ext_label("de", "Teams", "wikipedia", "https://de.wikipedia.org/wiki/Teams"), "Teams – Wikipedia")
        self.assertEqual(LT.ext_label("de", "Teams", "wikidata", ""), "Wikidata-Eintrag zu Teams")
        self.assertEqual(LT.ext_label("de", "Jane", "profile", "https://www.linkedin.com/in/jane"), "Jane auf LinkedIn")
        self.assertEqual(LT.ext_label("fr", "Teams", "web", "https://teams.com"), "Teams – site officiel")
        self.assertEqual(LT.unique([("A", "https://a/1"), ("A", "https://a/2"), ("B", "https://b")]), [("A (a/1)", "https://a/1"), ("A (a/2)", "https://a/2"), ("B", "https://b")])

    def test_entitaetsseite_ohne_rohe_url(self):
        import site_entities as ENT
        from site_learn import ENTS
        raw = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
        if "copilot" not in raw:
            self.skipTest("copilot fehlt in data/entities.json")
        e = copy.deepcopy(raw["copilot"])
        e.update(web="https://www.microsoft.com/microsoft-365/copilot", docs="https://learn.microsoft.com/copilot/microsoft-365/",
                 wikipedia="https://en.wikipedia.org/wiki/Microsoft_Copilot", wikidata="Q123456", same_as=["https://www.linkedin.com/showcase/copilot/"])
        tmp = tempfile.TemporaryDirectory(); docs = Path(tmp.name)
        self.addCleanup(tmp.cleanup)

        def write(rel, content):
            p = docs / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(content, "utf-8")

        def page(lang, title, desc, url, body, alts=None, ld=None, **k):
            return f'<!doctype html><html lang="{lang}"><head><title>{title}</title></head><body>{body}</body></html>'
        ep = {"e": {"title": "Copilot Agents erklärt: alles"}, "url": f"{BASE}/de/copilot-agents/", "date": "2026-11-01"}
        g = dict(BASE=BASE, write=write, page=page, header=lambda l, x="": "<header></header>", footer=lambda l: "<footer></footer>", footer_en=lambda: "<footer></footer>",
                 LANGS={"de": ("Deutsch", "de")}, sitemap=[], TODAY="2026-11-16", api="https://api.test", url_of=lambda x: x["url"], anchor_title=lambda t, *a: t.split(":")[0],
                 ep_sum=lambda x: "Kurz.", yt_of=lambda x: "abcdefghijk")
        others = {k: copy.deepcopy(raw[k]) for k in ("mirko-peters",) if k in raw}   # Personen mit AKA-Eintraegen muessen existieren (load_person_aka)
        with mock.patch.dict(ENTS, {"copilot": e, **others}, clear=True),mock.patch.object(ENT, "COMM_LANGS", ["en", "de"]), mock.patch.object(ENT, "MOD_FILE", docs / "_m.json"), \
                mock.patch.object(ENT, "fetch_wiki", lambda *a: {}), mock.patch.object(ENT, "write_wk_js", lambda *a: None), mock.patch.dict(ENT.EVENTS, {}, clear=True):
            ENT.build(g, lambda lang: {}, {}, lambda en, lang="en": [ep])
        de = (docs / "de/entity/copilot/index.html").read_text("utf-8")
        en = (docs / "entity/copilot/index.html").read_text("utf-8")
        for h in (de, en):
            texts = [t for _, t, _ in anchors(h)]
            for t in texts:
                self.assertFalse(re.match(r"^(https?://|www\.|[a-z0-9-]+\.[a-z]{2,}/)", t), f"rohe URL als Linktext: {t}")
                self.assertNotRegex(t, r"^Q\d+$"); self.assertNotIn("feed.xml", t)
        self.assertIn(">Microsoft 365 Copilot – Microsoft Learn</a>", de)
        self.assertIn(">Microsoft 365 Copilot – offizielle Website</a>", de)
        self.assertIn(">Microsoft 365 Copilot – Wikipedia</a>", de)
        self.assertIn(">Wikidata-Eintrag zu Microsoft 365 Copilot</a>", de)
        self.assertIn(">RSS-Feed: Microsoft 365 Copilot</a>", de)
        self.assertIn(">Microsoft 365 Copilot auf LinkedIn</a>", de)
        self.assertIn('<small class="mut">learn.microsoft.com</small>', de, "Domain klein daneben")
        self.assertIn(">Microsoft 365 Copilot – official website</a>", en)
        self.assertIn(">Wikidata entry for Microsoft 365 Copilot</a>", en)
        self.assertIn('aria-label="Video auf YouTube: Copilot Agents erklärt">Video auf YouTube</a>', de)
        self.assertIn('aria-label="Video on YouTube: Copilot Agents erklärt">Video on YouTube</a>', en)

    def test_aka_quelle_mit_ziel(self):
        import site_entities as ENT
        e = {"id": "jane", "type": "person", "name": "Jane Doe", "aliases": []}
        aka = {"jane": [{"name": "J. Doe", "source": "https://www.example.com/press"}]}
        r = ENT.aka_fact(e, "de", aka)
        if not r:
            self.skipTest("aka_fact liefert ohne weitere Namen nichts")
        self.assertIn('aria-label="Quelle: „J. Doe“ (example.com)">Quelle</a>', r[1])


class Lists(unittest.TestCase):
    def test_bibliothek_link_oeffnen(self):
        import site_library as SL
        h = SL.open_link("de", {"title": "KQL-Vorlage", "link": "https://github.com/x/y"})
        self.assertIn('aria-label="Link öffnen: KQL-Vorlage – github.com, neuer Tab"', h)
        self.assertIn('Link öffnen <span aria-hidden="true">↗</span></a>', h)
        self.assertEqual(SL.open_link("de", {"title": "x", "link": "http://unsicher"}), "")

    def test_gaeste_nachricht_an_name(self):
        import site_guests as SG
        out = {}
        g = dict(BASE=BASE, write=lambda rel, c: out.__setitem__(rel, c), page=lambda lang, t, d, u, b, *a, **k: b, header=lambda l, x="": "", footer=lambda l: "",
                 footer_en=lambda: "", LANGS={"de": ("Deutsch",)}, sitemap=[], TODAY="2026-11-16")
        items = [{"handle": "jane", "name": "Jane Doe", "title": "", "kind": "speaker", "formats": ["podcast"], "langs": ["de"], "topics": []}]
        with mock.patch.object(SG, "COMM_LANGS", ["en", "de"]):
            SG.build(g, items, [{"handle": "jane"}])
        self.assertIn(">Nachricht an Jane Doe</a>", out["de/community/guests/index.html"])
        self.assertIn(">Message Jane Doe</a>", out["community/guests/index.html"])

    def test_meilensteine_zweiter_link_versteckt(self):
        import site_milestones as MS
        p = {"slug": "wochenrueckblick-kw-46-2026", "title": "Woche 46", "summary": "S", "lang": "de", "handle": "mirko-p"}
        h = MS.body("de", BASE, [(2026, 46, p)])
        self.assertRegex(h, r'<a href="[^"]+" tabindex="-1" aria-hidden="true">Ganze Zusammenfassung lesen</a>')
        self.assertEqual(same_text_other_target(h), {})

    def test_guests_js_pfeil_link_mit_label(self):
        js = (ROOT / "assets" / "guests.js").read_text("utf-8")
        i = js.find('text: "↗" })')
        self.assertGreater(i, 0, "Pfeil-Link gefunden")
        link = js[js.rfind('h("a"', 0, i):i]
        self.assertIn('"aria-label": (Q.ext', link)
        self.assertIn('ext: "Link von {n} öffnen (neuer Tab)"', js); self.assertIn('ext: "Open the link of {n} (new tab)"', js)
        self.assertIn('"aria-label": Q.contact + ": " + m.name', js, "Nachricht-Knopf je Treffer mit Empfaenger")

    def test_seitenzahlen_mit_label(self):
        import site_podpage as PP
        self.assertEqual(PP.pg_label("de", 2), ' aria-label="Seite 2 der Folgenliste"')
        self.assertEqual(PP.pg_label("en", 3), ' aria-label="Page 3 of the episode list"')
        src = (ROOT / "site_podpage.py").read_text("utf-8")
        self.assertIn('{pg_label("en", q + 1)}>{q + 1}</a>', src); self.assertIn('{pg_label(l, q + 1)}>{q + 1}</a>', src)

    def test_pfeile_versteckt_in_vorlagen(self):
        """Pfeile am Ende eines Linktexts stehen in aria-hidden (sonst liest der Screenreader "Pfeil nach rechts")."""
        for f in ("generate_site.py", "site_podpage.py", "site_topweek.py", "site_shows.py", "site_feed.py", "site_library.py", "site_live.py"):
            src = (ROOT / f).read_text("utf-8")
            bad = re.findall(r'[^>"\'] ?[→↗]</a>', src)
            self.assertEqual(bad, [], f)


class Translations(unittest.TestCase):
    KEYS = ("{name} on {platform}", "{show} on {platform}", "This episode on {platform}", "Subtitles (WebVTT)", "Original (English)", "Share on {network}",
            "Share by email", "Page {n} of the episode list", "About the author", "Expertise", "Certifications", "Updates & roadmap", "Press kit", "Media kit",
            "Support us", "Security", "Legal notice", "Privacy", "{name} – official website", "{name} – documentation", "Wikidata entry for {name}",
            "RSS feed: {name}", "Message {name}", "new tab", "Open link", "source", "Video on YouTube")

    def test_alle_sprachen_mit_platzhaltern(self):
        d = json.loads((ROOT / "data" / "py_i18n.json").read_text("utf-8"))
        for k in self.KEYS:
            self.assertIn(k, d, k)
            ph = set(re.findall(r"\{\w+\}", k))
            for lg in OTHER:
                v = d[k].get(lg)
                self.assertTrue(v, f"{k} / {lg}")
                self.assertEqual(set(re.findall(r"\{\w+\}", v)), ph, f"{k} / {lg}: Platzhalter")
                self.assertEqual(site_i18n.T(lg, k, "x"), v)


if __name__ == "__main__":
    unittest.main()
