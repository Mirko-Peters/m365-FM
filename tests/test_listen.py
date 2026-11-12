"""Anhoeren-Karten (site_listen.py): Zuordnung Beitrag -> Folge (gute/keine Folge, Schwellen), Platzierung (3, 2, 0 Karten), Rueckfall ohne R2-Grafik,
Aufbau der Karte (ein Haupt-Link, kein verschachteltes <a>, Plattform-Ziele als data-Attribute, keine Tracking-Parameter), "Show folgen", Entitaetsseite
(dieselbe Folge nur einmal), Sprachen (Dub-Folge oder englische Folge), Zwischenspeicher und austauschbare Aehnlichkeit."""
import json
import re
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

import site_listen as L
import site_r2 as R2

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://www.m365.fm"
PLATFORMS = {"en": {"apple_show": "https://podcasts.apple.com/podcast/id1", "spotify_show": "https://open.spotify.com/show/en"},
             "de": {"spotify_show": "https://open.spotify.com/show/de"}}


def ep(i, title, ents, text=None, **kw):
    return {"id": str(i), "slug": f"ep-{i}", "title": title, "hook": kw.get("hook", "Warum das alles ändert."), "minutes": kw.get("minutes", 12),
            "cover": kw.get("cover", "https://d3t3ozftmdmh3i.cloudfront.net/cover.jpg"), "url": f"{BASE}/show/episodes/ep-{i}/", "yt": kw.get("yt", ""),
            "ents": ents, "text": text if text is not None else " ".join([title] * 3), "apple": kw.get("apple", ""), "spotify": kw.get("spotify", "")}


def catalog(extra=()):
    """Grundstock aus 100 Fuellfolgen (je eigenes Thema), damit idf wie im echten Bestand (ca. 650 Folgen mit Extraktion) ausfaellt, plus die Testfolgen."""
    filler = [ep(1000 + k, f"Filler episode {k} about zebra{k} and giraffe{k}", {f"filler-{k}": 95.0, "mirko-peters": 40.0}) for k in range(100)]
    return L.Catalog(filler + list(extra))


PURVIEW = ep(1, "Microsoft Purview Data Loss Prevention Explained", {"purview": 100.0, "dlp": 90.0, "sensitivity-labels": 80.0}, apple="https://podcasts.apple.com/ep1", spotify="https://open.spotify.com/episode/1")
FABRIC = ep(2, "Build a Trusted Semantic Layer in Microsoft Fabric", {"fabric": 98.0, "semantic-model": 90.0}, spotify="https://open.spotify.com/episode/2")
SHOWBACK = ep(3, "Showback vs Chargeback for Cloud Costs", {}, text="Showback vs Chargeback for Cloud Costs " * 3 + "cost allocation finops chargeback showback invoices")


def paras(n, tail=""):
    return "".join(f"<p>Absatz {i} mit genug Text, damit er als Absatz zählt und nicht als Zwischenzeile durchgeht.</p>" for i in range(n)) + tail


class Match(unittest.TestCase):
    def setUp(self):
        self.cat = catalog([PURVIEW, FABRIC, SHOWBACK])

    def test_good_episode_via_entities(self):
        m = L.match_post(self.cat, ["purview", "dlp", "microsoft-365"], "Purview DLP policies explained", "How data loss prevention works in Microsoft Purview.")
        self.assertEqual([x["episode"] for x in m][:1], ["1"])
        self.assertEqual(m[0]["via"], "ent")
        self.assertGreaterEqual(m[0]["score"], L.ENT_RANK_MIN)

    def test_no_good_episode_means_nothing(self):
        m = L.match_post(self.cat, ["forklift", "warehouse"], "Forklift routing in the warehouse", "How to plan routes for forklifts.")
        self.assertEqual(m, [])

    def test_generic_entity_alone_is_not_enough(self):
        cat = catalog([ep(5, "Copilot basics", {"copilot": 100.0, "microsoft-365": 95.0})])
        self.assertEqual(L.match_post(cat, ["copilot", "microsoft-365"], "Quarterly planning meeting notes", "Agenda and minutes."), [])   # nur allgemeine Entitaeten: keine Entitaets-Folge

    def test_entity_must_be_anchored_in_top_topics(self):
        # Purview steht nur an 4. Stelle der Themen: keine Verankerung unter den ersten drei -> keine Entitaets-Folge
        m = L.match_post(self.cat, ["forklift", "warehouse", "kanban", "purview"], "Warehouse kanban", "Boards for warehouses.")
        self.assertEqual(m, [])

    def test_episode_main_entity_must_appear_in_post(self):
        # Folge FABRIC: Haupt-Entitaeten fabric und semantic-model; der Beitrag hat nur 'fabric' an 7. Stelle -> abgelehnt
        m = L.match_post(self.cat, ["a1", "a2", "a3", "a4", "a5", "a6", "fabric"], "Lakes and warehouses", "Unrelated words.")
        self.assertEqual(m, [])

    def test_text_stage_fills_gaps(self):
        m = L.match_post(self.cat, [], "Showback vs Chargeback: who pays for the cloud?", "Cost allocation with showback and chargeback invoices and finops.")
        self.assertEqual([x["episode"] for x in m], ["3"])
        self.assertEqual(m[0]["via"], "txt")

    def test_text_threshold(self):
        # nur zwei gemeinsame Woerter (cloud, cost): unter TXT_SHARED, keine Karte, auch wenn der Kosinus bei kurzem Text hoch ausfaellt
        weak = L.match_post(self.cat, [], "Cloud migration checklist", "A few words about costs.")
        self.assertEqual(weak, [])
        self.assertGreaterEqual(L.TXT_MIN, 0.3)
        self.assertGreaterEqual(L.TXT_SHARED, 3)

    def test_entity_threshold_sum(self):
        # eine weit verbreitete Entitaet (30 Folgen): Summe je Folge unter ENT_MIN -> keine Karte, auch mit voller Verankerung
        cat = catalog([ep(2000 + k, f"Widespread topic number {k} alpha{k}", {"widespread": 95.0}) for k in range(30)])
        self.assertEqual(L.match_post(cat, ["widespread", "x1", "x2"], "Quarterly forklift roster", "Shift planning."), [])
        # dieselbe Entitaet, aber selten (1 Folge): Summe ueber ENT_MIN, dazu ein gemeinsames Wort im Text -> Karte
        cat = catalog([ep(2000, "Widespread topic about forklift roster", {"widespread": 95.0, "other": 60.0})])
        self.assertEqual([x["episode"] for x in L.match_post(cat, ["widespread", "x1", "x2"], "Quarterly forklift roster for the widespread plan", "Shift planning of the forklift roster.")], ["2000"])

    def test_second_episode_needs_to_be_clearly_good_and_different(self):
        twin = dict(PURVIEW, id="9", slug="ep-9", url=f"{BASE}/show/episodes/ep-9/")   # gleicher Titel (Neu-Upload): zaehlt nicht doppelt
        cat = catalog([PURVIEW, twin, FABRIC])
        m = L.match_post(cat, ["purview", "dlp", "sensitivity-labels"], "Purview DLP and sensitivity labels", "Data loss prevention in Microsoft Purview.")
        self.assertEqual(len({x["episode"] for x in m}), len(m))
        self.assertEqual(len(m), 1)

    def test_ranking_prefers_better_episode(self):
        cat = catalog([PURVIEW, ep(4, "Purview audit logs overview", {"purview": 95.0, "audit-logs": 90.0})])
        m = L.match_post(cat, ["purview", "dlp", "sensitivity-labels"], "Purview DLP and sensitivity labels", "Data loss prevention in Microsoft Purview.")
        self.assertEqual(m[0]["episode"], "1")


class Placement(unittest.TestCase):
    def cards(self, n):
        return [("1", "<CARD1>"), ("2", "<CARD2>"), ("3", "<CARD3>")][:n] if n == 3 else [("1", "<CARD1>"), ("3", "<CARD3>")]

    def test_three_cards(self):
        out = L.place(paras(10), self.cards(3))
        self.assertEqual([out.count(c) for c in ("<CARD1>", "<CARD2>", "<CARD3>")], [1, 1, 1])
        self.assertTrue(out.endswith("<CARD3>"))
        i1, i2 = out.index("<CARD1>"), out.index("<CARD2>")
        self.assertEqual(out[:i1].count("<p>"), 2)   # nach dem zweiten Absatz
        self.assertTrue(4 <= out[:i2].count("<p>") <= 6)   # ungefaehr die Mitte

    def test_two_cards_card_one_and_three(self):
        out = L.place(paras(10), self.cards(2))
        self.assertIn("<CARD1>", out)
        self.assertNotIn("<CARD2>", out)
        self.assertTrue(out.endswith("<CARD3>"))

    def test_short_post_gets_no_middle_card(self):
        out = L.place(paras(4), self.cards(3))
        self.assertNotIn("<CARD2>", out)
        self.assertIn("<CARD1>", out)

    def test_never_inside_lists_tables_quotes(self):
        html = "<p>" + "Intro " * 20 + "</p><ul><li><p>" + "Punkt " * 20 + "</p></li></ul><blockquote><p>" + "Zitat " * 20 + "</p></blockquote><table><tr><td><p>" + "Zelle " * 20 + "</p></td></tr></table>" + paras(3)
        ends = L.paragraph_ends(html)
        self.assertEqual(len(ends), 4)   # nur der erste und die drei Absaetze am Ende
        out = L.place(html, self.cards(2))
        self.assertTrue(out.index("<CARD1>") > html.index("</table>"))

    def test_paragraph_introducing_a_list_is_skipped(self):
        html = "<p>" + "Einstieg " * 12 + "</p><p>" + "Diese Schritte brauchst du:" + " x" * 20 + ":</p><ul><li>a</li></ul>" + paras(2)
        ends = L.paragraph_ends(html)
        self.assertEqual(len(ends), 3)

    def test_no_paragraphs_still_ends_with_card_three(self):
        out = L.place("<figure><img src='x'></figure>", self.cards(2))
        self.assertTrue(out.endswith("<CARD3>"))


class Cards(unittest.TestCase):
    ITEM = {"title": "Build <One> Trusted Dataset", "hook": "Warum \"Daten\" streiten.", "minutes": 19, "cover": "https://d3t3ozftmdmh3i.cloudfront.net/c.jpg",
            "page": f"{BASE}/show/episodes/ep-2/", "apple": "https://podcasts.apple.com/ep2", "spotify": "https://open.spotify.com/episode/2"}

    def setUp(self):
        self._map = dict(R2.MAP)
        R2.MAP.pop(L.BANNER, None)

    def tearDown(self):
        R2.MAP.clear(); R2.MAP.update(self._map)

    def test_fallback_without_r2_banner(self):
        h = L.card_html("en", self.ITEM, "1")
        self.assertNotIn("<img class=\"ls-bg\"", h)
        self.assertIn("ls-nobg", h)
        self.assertNotIn("assets/", h)
        self.assertNotIn("listen-banner", h)   # kein kaputter Bildlink

    def test_banner_from_r2_when_uploaded(self):
        R2.MAP[L.BANNER] = "https://img.m365.fm/listen/listen-banner.webp"
        h = L.card_html("en", self.ITEM, "1")
        self.assertRegex(h, r'<img class="ls-bg" src="https://img\.m365\.fm/listen/listen-banner\.webp" alt="" width="\d+" height="\d+"')
        self.assertNotIn("ls-nobg", h)

    def test_one_main_link_and_separate_text_link(self):
        h = L.card_html("en", self.ITEM, "1")
        self.assertEqual(h.count("<a "), 2)
        self.assertFalse(re.search(r"<a [^>]*>(?:(?!</a>).)*<a ", h))   # kein verschachteltes <a>
        self.assertIn(f'<a class="ls-main" href="{BASE}/show/episodes/ep-2/" data-card="1">Build &lt;One&gt; Trusted Dataset</a>', h)
        self.assertIn(f'<a class="ls-all" href="{BASE}/show/episodes/ep-2/" data-card="all">All platforms &amp; player</a>', h)
        self.assertIn('data-apple="https://podcasts.apple.com/ep2"', h)
        self.assertIn('data-spotify="https://open.spotify.com/episode/2"', h)
        self.assertNotRegex(h, r"utm_|\?ref=|\?si=")   # keine Tracking-Parameter an den Zielen

    def test_cover_is_decorative_with_fixed_size(self):
        h = L.card_html("en", self.ITEM, "2")
        self.assertIn('<img class="ls-cover" src="https://d3t3ozftmdmh3i.cloudfront.net/c.jpg" alt="" width="96" height="96" loading="lazy"', h)
        self.assertNotIn("ls-cover", L.card_html("en", dict(self.ITEM, cover=""), "2"))   # ohne Cover: Karte ohne Cover

    def test_badge_hook_duration_texts(self):
        self.assertIn("You should listen to this · 19 min", L.card_html("en", self.ITEM, "1"))
        de = L.card_html("de", self.ITEM, "1")
        self.assertIn("Das solltest du dir anhören · 19 Min.", de)
        self.assertIn("Alle Plattformen &amp; Player", de)
        self.assertIn("Warum &quot;Daten&quot; streiten.", de)   # Hook als echter, maskierter Text
        self.assertNotIn("Das solltest du dir anhören", L.card_html("en", self.ITEM, "1"))
        self.assertNotIn("19 min", L.card_html("en", dict(self.ITEM, minutes=0), "1"))   # ohne Dauer keine Dauer

    def test_other_languages_have_translations(self):
        for lg in ("fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"):
            s = L.ui_text(lg)
            self.assertNotEqual(s["badge"], "You should listen to this", lg)
            self.assertIn("{n}", s["min"], lg)
        self.assertEqual(L.ui_text("xx")["badge"], "You should listen to this")   # Rueckfall Englisch

    def test_compact_card_for_entities(self):
        h = L.card_html("en", self.ITEM, "entity", compact=True)
        self.assertIn("ls-mini", h)
        self.assertEqual(h.count("<a "), 1)
        self.assertIn('data-card="entity"', h)
        self.assertNotIn("ls-all", h)
        self.assertIn('width="48" height="48"', h)

    def test_follow_both_links_equal_without_script(self):
        h = L.follow_html("en", L.show_links("en", PLATFORMS), "3", compact=True)
        self.assertEqual(h.count("<a "), 2)
        self.assertIn('data-lp="apple"', h)
        self.assertIn('data-lp="spotify"', h)
        self.assertEqual(h.count('target="_blank" rel="noopener"'), 2)
        self.assertNotIn("ls-btn", h)   # Hauptknopf setzt erst das Skript
        self.assertIn('data-card="3"', h)

    def test_follow_language_without_apple_show(self):
        h = L.follow_html("de", L.show_links("de", PLATFORMS), "episode")
        self.assertEqual(h.count("<a "), 1)
        self.assertIn("open.spotify.com/show/de", h)
        self.assertNotIn("apple", h.lower().replace("apple podcasts", ""))
        self.assertEqual(L.follow_html("en", {}, "episode"), "")

    def test_show_links_fall_back_to_english_show(self):
        self.assertEqual(L.show_links("xx", PLATFORMS), {"apple": PLATFORMS["en"]["apple_show"], "spotify": PLATFORMS["en"]["spotify_show"]})
        self.assertEqual(L.show_links("de", PLATFORMS)["apple"], "")


class Site(unittest.TestCase):
    def setUp(self):
        self.cat = catalog([PURVIEW, FABRIC, SHOWBACK, ep(5, "Purview audit logs overview", {"purview": 95.0, "audit-logs": 90.0}, yt="YT5", apple="", spotify="")])
        self.alts = {"ep-1": {"de": (f"{BASE}/de/dub-purview/", "Purview: Datenverlust verhindern")}}
        self.el = {"YT1:de": {"apple": "https://podcasts.apple.com/de-ep", "spotify": "https://open.spotify.com/episode/de1"}}
        self.cat.eps["1"]["yt"] = "YT1"
        self.site = L.Site(self.cat, BASE, PLATFORMS, self.alts, self.el, {}, {"de": {"ep-1": ["Titel", "Warum Daten abfließen. Und was du dagegen tust."]}})
        self.post = {"slug": "dlp-post", "title": "Purview DLP and sensitivity labels", "summary": "Data loss prevention in Microsoft Purview.", "topics": ["purview", "dlp", "sensitivity-labels"], "lang": "en"}
        self._map = dict(R2.MAP)

    def tearDown(self):
        R2.MAP.clear(); R2.MAP.update(self._map)

    def test_post_with_two_good_episodes_gets_three_cards(self):
        post = dict(self.post, topics=["purview", "audit-logs", "dlp"])
        cards = self.site.cards_for_post(post, "en")
        self.assertEqual([r for r, _ in cards], ["1", "2", "3"])
        out = self.site.inject(paras(10), post, "en")
        self.assertEqual(out.count('class="ls-card ls-c'), 2)
        self.assertEqual(out.count('class="ls-follow ls-f3"'), 1)
        self.assertEqual(out.count("assets/listen.js"), 1)   # Skript einmal je Seite

    def test_post_with_one_good_episode_gets_card_one_and_three(self):
        cards = self.site.cards_for_post(self.post, "en")
        self.assertEqual([r for r, _ in cards], ["1", "3"])

    def test_post_without_episode_gets_nothing(self):
        post = dict(self.post, slug="forklift", title="Forklift routing", summary="Plan routes.", topics=["forklift"])
        body = paras(10)
        self.assertEqual(self.site.inject(body, post, "en"), body)

    def test_english_episode_when_no_dub(self):
        it = self.site.item("2", "de")
        self.assertEqual(it["title"], "Build a Trusted Semantic Layer in Microsoft Fabric")
        self.assertEqual(it["page"], f"{BASE}/show/episodes/ep-2/")
        self.assertEqual(it["spotify"], "https://open.spotify.com/episode/2")
        self.assertEqual(it["apple"], PLATFORMS["en"]["apple_show"])   # Folgenlink fehlt: Link der Show

    def test_dub_episode_in_post_language(self):
        it = self.site.item("1", "de")
        self.assertEqual(it["title"], "Purview: Datenverlust verhindern")
        self.assertEqual(it["page"], f"{BASE}/de/dub-purview/")
        self.assertEqual(it["hook"], "Warum Daten abfließen. Und was du dagegen tust.")
        self.assertEqual(it["apple"], "https://podcasts.apple.com/de-ep")
        self.assertEqual(it["spotify"], "https://open.spotify.com/episode/de1")
        en = self.site.item("1", "en")
        self.assertEqual(en["title"], PURVIEW["title"])
        self.assertEqual(en["page"], PURVIEW["url"])

    def test_dub_without_links_falls_back_to_language_show(self):
        self.site.elinks = {}
        it = self.site.item("1", "de")
        self.assertEqual(it["spotify"], "https://open.spotify.com/show/de")
        self.assertEqual(it["apple"], "")   # kein Apple-Link der Sprache: Apple-Geraete bekommen Spotify (listen.js)

    def test_translation_uses_the_original_match(self):
        orig = dict(self.post)
        tr = dict(self.post, lang="de", tr_of="en", title="Völlig anderer Titel", summary="", topics=self.post["topics"])
        self.site.index_posts([orig, tr])
        self.assertEqual(self.site.post_matches(tr), self.site.post_matches(orig))

    def test_entity_page_same_episode_only_once(self):
        a = dict(self.post, slug="a")
        b = dict(self.post, slug="b", title="Purview DLP policies in practice")
        c = dict(self.post, slug="c", title="Forklift routing", summary="routes", topics=["forklift"])
        out = self.site.entity_cards([a, b, c], "en")
        self.assertEqual(list(out), [("a", "en")])   # b: dieselbe Folge, nur beim ersten Beitrag; c: keine gute Folge
        self.assertIn("ls-mini", out[("a", "en")])
        self.assertIn('data-card="entity"', out[("a", "en")])

    def test_entity_page_without_matches_has_no_cards(self):
        c = dict(self.post, slug="c", title="Forklift routing", summary="routes", topics=["forklift"])
        self.assertEqual(self.site.entity_cards([c], "en"), {})
        self.assertEqual(L.apply_entities("https://unconfigured.example", [c], "en"), {})

    def test_cache_used_only_when_matching(self):
        m = self.site.post_matches(self.post)
        cache = {"version": L.VERSION, "catalog": self.cat.fingerprint,
                 "posts": {self.post["slug"]: {"h": L.post_hash(self.post["slug"], self.post["title"], self.post["summary"], self.post["topics"]), "m": [{"episode": "2", "score": 9.0, "via": "ent"}]}}}
        s2 = L.Site(self.cat, BASE, PLATFORMS, cache=cache)
        self.assertEqual(s2.post_matches(self.post)[0]["episode"], "2")   # Eintrag passt: wird genutzt
        self.assertEqual(s2.stats, {"cached": 1, "computed": 0})
        changed = dict(self.post, summary="Anderer Kurztext")
        s2 = L.Site(self.cat, BASE, PLATFORMS, cache=cache)
        self.assertEqual(s2.post_matches(changed)[0]["episode"], m[0]["episode"])   # Text geaendert: neu gerechnet
        self.assertEqual(s2.stats, {"cached": 0, "computed": 1})
        stale = dict(cache, catalog="other")
        s3 = L.Site(self.cat, BASE, PLATFORMS, cache=stale)
        s3.post_matches(self.post)
        self.assertEqual(s3.stats["computed"], 1)   # Folgenbestand geaendert: neu gerechnet

    def test_unconfigured_site_leaves_text_unchanged(self):
        self.assertEqual(L.apply("https://unconfigured.example", "<p>x</p>", self.post, "en"), "<p>x</p>")

    def test_error_in_card_never_breaks_page(self):
        L._SITE["https://err.example"] = object()   # inject schlaegt fehl
        try:
            self.assertEqual(L.apply("https://err.example", "<p>x</p>", self.post, "en"), "<p>x</p>")
        finally:
            L._SITE.pop("https://err.example", None)


class Helpers(unittest.TestCase):
    def test_curiosity_short_first_sentence(self):
        self.assertEqual(L.curiosity("One default setting. Thousands of files. Hear how it happens. More text here that is not needed at all."),
                         "One default setting. Thousands of files. Hear how it happens.")

    def test_curiosity_long_sentence_cut_at_clause(self):
        t = "If your team keeps arguing about lakehouse vs warehouse and copying the same datasets into five places, this episode gives you a plain-English mental model for the whole thing."
        out = L.curiosity(t)
        self.assertTrue(out.endswith("five places…"))
        self.assertLessEqual(len(out), 151)

    def test_curiosity_strips_markdown_and_skips_boilerplate(self):
        out = L.curiosity("**Apps break between dev and prod.** This episode is for makers and IT pros. You will learn PAC CLI.")
        self.assertEqual(out, "Apps break between dev and prod.")
        self.assertEqual(L.curiosity(""), "")

    def test_duration_minutes(self):
        self.assertEqual(L.duration_minutes(1335), 22)
        self.assertEqual(L.duration_minutes(0, "PT1H2M3S"), 62)
        self.assertEqual(L.duration_minutes(20), 1)
        self.assertEqual(L.duration_minutes(0), 0)

    def test_tfidf_ranks_and_is_replaceable(self):
        sim = L.TfidfSimilarity().fit({"a": "azure bastion secure rdp ssh", "b": "power bi calculated columns measures", "c": "teams chat etiquette"})
        self.assertEqual(sim.query("secure azure bastion access", 1)[0][0], "a")
        self.assertEqual(sim.query("nothing in common xyz"), [])

        class Fixed(L.Similarity):   # Platzhalter fuer spaetere Embeddings: nur fit/query noetig
            def fit(self, docs):
                self.docs = docs
                return self

            def query(self, text, k=None):
                return [(i, 0.9) for i in self.docs if i == "1"]
        cat = L.Catalog([ep(1, "Anything", {}), ep(2, "Other", {})], similarity=Fixed)
        self.assertEqual([x["episode"] for x in L.match_post(cat, [], "unrelated", "")], ["1"])

    def test_cache_file_is_valid(self):
        c = L.load_cache()
        self.assertEqual(c["version"], L.VERSION)
        self.assertTrue(c["posts"])
        for slug, v in list(c["posts"].items())[:200]:
            self.assertLessEqual(len(v["m"]), L.MAX_CARDS)
            self.assertTrue(all(x["via"] in ("ent", "txt") and x["episode"] for x in v["m"]), slug)

    def test_save_and_load_cache_roundtrip(self):
        d = Path(tempfile.mkdtemp())
        try:
            f = d / "m.json"
            L.save_cache({"version": 1, "catalog": "x", "posts": {"a": {"h": "1", "m": []}}}, f)
            self.assertEqual(L.load_cache(f)["posts"]["a"]["h"], "1")
            self.assertEqual(L.load_cache(d / "missing.json")["posts"], {})
        finally:
            shutil.rmtree(d)


class R2Local(unittest.TestCase):
    """tools/r2_upload.py: lokale Dateien (data/r2_local.json) hochladen und in data/r2_map.json (Repo-Pfad -> URL) und data/r2_dims.json eintragen."""
    def upload_module(self):
        import sys
        sys.path.insert(0, str(ROOT / "tools"))
        try:
            import r2_upload
        except ImportError:   # Pillow fehlt (das Werkzeug liest damit die Bildmasse)
            self.skipTest("Pillow fehlt")
        return r2_upload

    def test_banner_listed_and_uploaded_as_webp(self):
        U = self.upload_module()

        class S3:
            def __init__(self): self.put = []
            def put_object(self, **kw): self.put.append(kw)
        self.assertIn((L.BANNER, "listen/listen-banner.webp"), U.local_files())
        s3, done, dims = S3(), {}, {}
        n = U.upload_local(s3, "bucket", done, dims)
        self.assertGreaterEqual(n, 1)
        p = [x for x in s3.put if x["Key"] == "listen/listen-banner.webp"][0]
        self.assertEqual(p["ContentType"], "image/webp")   # WebP bleibt WebP
        self.assertIn("max-age=31536000", p["CacheControl"])
        self.assertEqual(done[L.BANNER], "https://img.m365.fm/listen/listen-banner.webp")
        self.assertEqual(dims["https://img.m365.fm/listen/listen-banner.webp"], [1200, 360])
        self.assertEqual(p["Bucket"], "bucket")

    def test_unsafe_entries_are_skipped(self):
        U = self.upload_module()
        d = Path(tempfile.mkdtemp()); old = U.LOCAL
        try:
            f = d / "local.json"
            f.write_text(json.dumps({"../outside.webp": "x/y.webp", L.BANNER: "/abs/key.webp", "CLAUDE.md": "docs/readme.webp"}), "utf-8")
            U.LOCAL = f
            self.assertEqual(U.local_files(), [])   # ausserhalb des Repos, absoluter Schluessel, kein Bildtyp
        finally:
            U.LOCAL = old; shutil.rmtree(d)

    def test_local_lookup_is_none_until_uploaded(self):
        old = dict(R2.MAP)
        try:
            R2.MAP.pop(L.BANNER, None)
            self.assertIsNone(R2.local(L.BANNER))
            R2.MAP[L.BANNER] = "https://example.com/not-r2.webp"
            self.assertIsNone(R2.local(L.BANNER))   # nur img.m365.fm zaehlt
            R2.MAP[L.BANNER] = "https://img.m365.fm/listen/listen-banner.webp"
            self.assertEqual(R2.local(L.BANNER), "https://img.m365.fm/listen/listen-banner.webp")
        finally:
            R2.MAP.clear(); R2.MAP.update(old)


class Script(unittest.TestCase):
    def test_listen_js_is_wired(self):
        js = (ROOT / "assets" / "listen.js").read_text("utf-8")
        for needle in ("isApple", "data-apple", "data-spotify", "noopener", "_blank"):
            self.assertIn(needle, js)
        for forbidden in ("localStorage", "sessionStorage", "document.cookie", "fetch(", "XMLHttpRequest", "sendBeacon"):
            self.assertNotIn(forbidden, js)   # nichts speichern, nichts senden

    def test_node_unit_test(self):
        node = shutil.which("node")
        if not node:
            self.skipTest("Node fehlt")
        r = subprocess.run([node, "--test", str(ROOT / "tests" / "listen.test.mjs")], capture_output=True, text=True, timeout=120)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)


if __name__ == "__main__":
    unittest.main()
