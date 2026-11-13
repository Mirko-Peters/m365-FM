"""Index-Regel "ab 2500 Zeichen eigener Text" fuer alle Seitentypen ausser Entitaeten (Mirko, 13.11.2026, site_index_rule.py).
Prueft die gemeinsame Hilfsfunktion (Zaehlung, Grenze 2500, Rueckfall) und je Seitentyp, dass ein langer eigener Text die Seite auf index hebt
(Seite, Sitemap, Verzeichnis), ein kurzer Text nichts aendert und bereits indexierbare Seiten indexierbar bleiben."""
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import site_index_rule as IR  # noqa: E402
import site_blog as BLG  # noqa: E402
import site_content_blog as CBL  # noqa: E402
import site_directory as DIR  # noqa: E402
import site_legacy_blog as LBL  # noqa: E402
import site_library as LIB  # noqa: E402
import site_members as MEM  # noqa: E402
import site_podpage as PP  # noqa: E402

BASE = "https://example.test"
TODAY = "2026-11-13"


def words(n_chars, w="wort"):
    """Text mit genau n_chars Zeichen (Woerter mit Leerzeichen)."""
    s = (w + " ") * (n_chars // (len(w) + 1) + 1)
    return s[:n_chars].rstrip() + "x" * (n_chars - len(s[:n_chars].rstrip()))


class PlainLenTests(unittest.TestCase):
    def test_min_chars_is_2500_and_boundary_counts(self):
        self.assertEqual(IR.MIN_CHARS, 2500)
        self.assertEqual(IR.plain_len(words(2500)), 2500)
        self.assertTrue(IR.long_enough(words(2500)))   # "ab 2500": genau 2500 reichen
        self.assertFalse(IR.long_enough(words(2499)))

    def test_html_is_stripped_and_entities_resolved(self):
        self.assertEqual(IR.plain_text("<p>Fish &amp; <b>chips</b></p><p>second</p>"), "Fish & chips second")
        self.assertEqual(IR.plain_len("<p>a</p><p>b</p>"), 3)   # Absatzgrenzen sind Leerraum, kein Text-Verlust
        self.assertEqual(IR.plain_text("a<br>b"), "a b")
        self.assertEqual(IR.plain_text(None), "")
        self.assertEqual(IR.plain_text(""), "")
        self.assertEqual(IR.plain_text("   "), "")

    def test_plain_text_without_tags_is_kept(self):
        self.assertEqual(IR.plain_text("if a < b and b > c  then\n ok"), "if a < b and b > c then ok")

    def test_markup_overhead_does_not_count(self):
        html = '<div class="x" data-long="' + "y" * 3000 + '"><p>kurz</p></div>'
        self.assertEqual(IR.plain_text(html), "kurz")
        self.assertFalse(IR.long_enough(html))

    def test_menus_footer_scripts_styles_forms_comments_do_not_count(self):
        chrome = ("<nav>" + words(1500) + "</nav><footer>" + words(1500) + "</footer><script>" + words(1500) + "</script><style>" + words(1500) + "</style>"
                  "<aside>" + words(1500) + "</aside><form><label>" + words(1500) + "</label></form><!-- " + words(1500) + " --><header>" + words(1500) + "</header>")
        self.assertEqual(IR.plain_text(chrome + "<p>Haupttext</p>"), "Haupttext")
        self.assertEqual(IR.plain_text("<header><nav>" + words(900) + "</nav></header><p>Text</p>"), "Text")   # verschachtelt

    def test_link_lists_do_not_count_but_text_with_a_link_does(self):
        links = "<ul>" + "".join(f'<li><a href="/x/{i}/">Verwandter Artikel Nummer {i} mit langem Titel</a></li>' for i in range(100)) + "</ul>"
        self.assertEqual(IR.plain_len(links), 0)
        self.assertEqual(IR.plain_len('<ul><li><a href="/a/">Titel</a> <span>' + words(300) + "</span></li></ul>") > 300, True)   # Beschreibung neben dem Link ist Text
        self.assertEqual(IR.plain_text('<p>Lies <a href="/a/">das Handbuch</a> zuerst, es erklaert alles genau.</p>'), "Lies das Handbuch zuerst, es erklaert alles genau.")
        self.assertFalse(IR.long_enough(links + "<p>kurz</p>"))
        self.assertTrue(IR.long_enough(links + "<p>" + words(2500) + "</p>"))

    def test_total_len_sums_parts_and_ignores_empty(self):
        self.assertEqual(IR.total_len(words(1000), None, "", "<p>" + words(1500) + "</p>"), 2500)
        self.assertTrue(IR.long_enough(words(1000), None, words(1500)))
        self.assertFalse(IR.long_enough(None, ""))

    def test_own_long_rejects_fallback(self):
        own = words(2600)
        self.assertTrue(IR.own_long(own))
        self.assertTrue(IR.own_long(own, shown=f"<p>{own}</p>"))
        self.assertFalse(IR.own_long(own, shown=words(2600, "english")))   # Seite zeigt den Rueckfall, nicht den eigenen Text
        self.assertFalse(IR.own_long("", shown=words(2600)))   # kein eigener Text
        self.assertFalse(IR.own_long(words(100)))

    def test_index_or_long_only_lifts(self):
        self.assertTrue(IR.index_or_long(True, words(10)))   # schon indexierbar bleibt es
        self.assertTrue(IR.index_or_long(True))
        self.assertFalse(IR.index_or_long(False, words(2499)))
        self.assertTrue(IR.index_or_long(False, words(2500)))
        self.assertTrue(IR.index_or_long(False, words(2000), words(500)))


# ---------------------------------------------------------------- Blog-Sprachfassungen (site_legacy_blog, site_content_blog)

class TranslationIndexTests(unittest.TestCase):
    def legacy(self, html, desc="Kurz", index=("de",)):
        src = {"slug": "s", "title": "T", "html": "<p>en</p>", "faq": [], "iso": "2026-01-01", "published": 1, "updated": 1, "topics": [], "faq_": []}
        p = {"slug": "s", "handle": "mirko-p", "title": "T", "summary": "", "html": "<p>en</p>", "topics": [], "faq": [], "published": 1, "updated": 1, "src": src, "hero": ""}
        with patch.object(LBL, "tr_config", return_value=(["de", "fr"], list(index))), patch("translate_blog.load_lang", return_value={}), \
             patch("translate_blog.assemble", return_value=("Titel", desc, html, [])), patch("site_i18n_overrides.note_blog", lambda *a, **k: None):
            return {x["lang"]: x for x in LBL.translations(BASE, {"s": p}, lambda h: h)}

    def test_long_translation_in_unreleased_language_is_indexable(self):
        out = self.legacy("<p>" + words(2600) + "</p>")
        self.assertTrue(out["de"]["tr_index"])   # Sprache freigegeben
        self.assertTrue(out["fr"]["tr_index"])   # Sprache nicht freigegeben, aber Text ab 2500 Zeichen

    def test_short_translation_keeps_the_released_list(self):
        out = self.legacy("<p>" + words(400) + "</p>")
        self.assertTrue(out["de"]["tr_index"])   # freigegebene Sprache bleibt auf index, auch kurz (bereits indexierte Seiten aendern sich nicht)
        self.assertFalse(out["fr"]["tr_index"])

    def test_boundary_counts_summary_plus_body(self):
        self.assertFalse(self.legacy("<p>" + words(2400) + "</p>", desc=words(99))["fr"]["tr_index"])
        self.assertTrue(self.legacy("<p>" + words(2400) + "</p>", desc=words(100))["fr"]["tr_index"])

    def test_link_list_and_menu_text_in_translation_does_not_lift(self):
        junk = "<nav>" + words(3000) + "</nav><ul>" + "".join(f'<li><a href="/e/{i}/">Eintrag {i} mit einem recht langen Linktext</a></li>' for i in range(120)) + "</ul>"
        self.assertFalse(self.legacy(junk + "<p>kurz</p>")["fr"]["tr_index"])

    def test_content_package_translations_use_the_same_rule(self):
        orig = {"id": 77, "handle": "mirko-p", "name": "Mirko", "slug": "pkg", "lang": "en", "title": "Titel", "summary": "x", "body": "", "html": "<p>en</p>", "topics": [],
                "published": 1, "created": 1, "updated": 1, "votes": 0, "coauthors": [], "faq": []}
        src = {"slug": "content/pkg", "cp_slug": "pkg", "author": "mirko-p", "title": "Titel", "desc": "d", "html": "<p>en</p>", "faq": [], "iso": "2026-01-01T00:00:00+00:00"}

        def run(html):
            with patch.object(LBL, "tr_config", return_value=(["de", "fr"], ["de"])), patch.object(CBL, "tr_sources", return_value=[src]), patch.object(LBL.P, "load", return_value=[]), \
                 patch("translate_blog.load_lang", return_value={}), patch("translate_blog.assemble", return_value=("Titel", "d", html, [])), patch("site_i18n_overrides.note_blog", lambda *a, **k: None):
                return {x["lang"]: x for x in CBL.translations(BASE, [orig], {})}
        out = run("<p>" + words(2600) + "</p>")
        self.assertTrue(out["de"]["tr_index"] and out["fr"]["tr_index"])
        out = run("<p>" + words(300) + "</p>")
        self.assertTrue(out["de"]["tr_index"]); self.assertFalse(out["fr"]["tr_index"])


# ---------------------------------------------------------------- Blogseiten (site_blog.build)

def blog_post(slug, lang="de", body="", html=None, votes=0, **kw):
    p = {"id": abs(hash((slug, lang))) % 10 ** 6, "handle": "anna", "name": "Anna", "slug": slug, "lang": lang, "title": f"Titel {slug}", "summary": "", "body": body,
         "topics": [], "published": 1793836800, "created": 1793836800, "updated": 1793836800, "votes": votes, "coauthors": [], "faq": [], **kw}
    if html is not None:
        p["html"] = html
    return p


def build_blog(posts):
    files, r2, pages, sitemap = {}, {}, {}, []

    def page(lang, title, desc, canonical, body, alternates=None, jsonld=None, xdefault=None, noindex=False, **kw):
        pages[canonical] = {"noindex": noindex, "alt": alternates}
        return body
    g = {"BASE": BASE, "write": files.__setitem__, "write_r2": r2.__setitem__, "page": page, "header": lambda lang, s: "", "footer": lambda lang: "", "footer_en": lambda: "",
         "LANGS": {}, "sitemap": sitemap, "TODAY": TODAY}
    BLG.build(g, posts, [{"handle": "anna", "name": "Anna"}], "https://api.example.test")
    return pages, sitemap


def u(slug, lang="de", handle="anna"):
    return f"{BASE}{'' if lang == 'en' else '/' + lang}/community/u/{handle}/blog/{slug}/"


class BlogPageTests(unittest.TestCase):
    def test_every_original_post_is_indexed_regardless_of_votes_or_length(self):
        long_body, short_body = "\n\n".join(words(500) for _ in range(6)), words(40)
        for lang in ("en", "de", "fr", "ja"):
            pages, sitemap = build_blog([blog_post("lang", lang, body=long_body), blog_post("kurz", lang, body=short_body, votes=0), blog_post("alt", lang, html="<p>kurz</p>", legacy=True)])
            for sl in ("lang", "kurz", "alt"):
                self.assertFalse(pages[u(sl, lang)]["noindex"], (lang, sl))
                self.assertIn(u(sl, lang), [x[0] for x in sitemap])

    def test_directory_is_indexable_with_any_original_post(self):
        pages, sitemap = build_blog([blog_post("kurz", "fr", body=words(40))])
        self.assertFalse(pages[f"{BASE}/fr/community/blog/"]["noindex"])
        self.assertFalse(pages[f"{BASE}/fr/community/u/anna/blog/"]["noindex"])
        self.assertIn(f"{BASE}/fr/community/blog/", [x[0] for x in sitemap])

    def test_top_block_lists_most_upvoted_and_has_period_tabs(self):
        posts = [blog_post("a", "de", body=words(40), votes=3, published=100), blog_post("b", "de", body=words(40), votes=7, published=50), blog_post("c", "de", body=words(40), votes=0)]
        html = BLG.top_block("de", posts, f"{BASE}/de/community/", "https://api.example.test")
        self.assertLess(html.index("Titel b"), html.index("Titel a"))   # mehr Stimmen zuerst
        self.assertNotIn("Titel c", html)                              # ohne Stimmen nicht in der Liste
        for k in ("day", "week", "month", "year", "evergreen"):
            self.assertIn(f'data-p="{k}"', html)
        self.assertIn('data-lang="de"', html)
        # reine Uebersetzungssprache: Stimmen des Originals zaehlen, kein Sprachfilter an der API
        tr = [blog_post("t", "fr", html="<p>x</p>", votes=4, tr_of="en", tr_index=True, legacy=True)]
        h2 = BLG.top_block("fr", tr, f"{BASE}/fr/community/", "https://api.example.test")
        self.assertIn("Titel t", h2); self.assertIn('data-lang=""', h2)

    def test_translation_noindex_follows_tr_index_only(self):
        pages, _ = build_blog([blog_post("t1", "fr", html="<p>kurz</p>", tr_of="en", tr_index=False, legacy=True), blog_post("t2", "fr", html="<p>kurz</p>", tr_of="en", tr_index=True, legacy=True)])
        self.assertTrue(pages[u("t1", "fr")]["noindex"])
        self.assertFalse(pages[u("t2", "fr")]["noindex"])

    def test_hreflang_between_original_and_long_translation(self):
        orig = blog_post("o", "en", html="<p>english original</p>", legacy=True)
        fr = blog_post("o", "fr", html="<p>" + words(2600) + "</p>", tr_of="en", tr_index=True, legacy=True)
        pages, sitemap = build_blog([orig, fr])
        self.assertEqual(pages[u("o", "en")]["alt"], {"en": u("o", "en"), "fr": u("o", "fr")})
        self.assertEqual(pages[u("o", "fr")]["alt"], {"en": u("o", "en"), "fr": u("o", "fr")})
        self.assertEqual([x[0] for x in sitemap].count(u("o", "fr")), 1)   # nichts doppelt in der Sitemap


# ---------------------------------------------------------------- Bibliothek

class LibraryTests(unittest.TestCase):
    def item(self, kind="prompt", body="", votes=0, lang="de", summary=""):
        return {"id": 5, "handle": "anna", "slug": "p", "lang": lang, "kind": kind, "title": "Titel", "summary": summary, "body": body, "votes": votes, "version": 1,
                "published": 1793836800, "updated": 1793836800, "topics": [], "link": ""}

    def test_is_indexable(self):
        self.assertTrue(LIB.is_indexable(self.item(votes=10, body="kurz")))
        self.assertFalse(LIB.is_indexable(self.item(votes=9, body=words(2499))))
        self.assertTrue(LIB.is_indexable(self.item(votes=0, body=words(2500))))
        self.assertTrue(LIB.is_indexable(self.item(kind="instructions", votes=0, body=words(1500), summary=words(1000))))   # Beschreibung + Text zusammen

    def test_code_kinds_do_not_count_their_code(self):
        for kind in ("kql", "dax", "powershell", "flow", "plugin"):
            self.assertFalse(LIB.is_indexable(self.item(kind=kind, body=words(5000))), kind)
        self.assertTrue(LIB.is_indexable(self.item(kind="kql", body="x", summary=words(2500))))
        self.assertTrue(LIB.is_indexable(self.item(kind="kql", body="x", votes=10)))

    def test_pages_sitemap_and_directory(self):
        files, pages, sitemap = {}, {}, []

        def page(lang, title, desc, canonical, body, alternates=None, jsonld=None, xdefault=None, noindex=False, **kw):
            pages[canonical] = noindex
            return body
        g = {"BASE": BASE, "write": files.__setitem__, "page": page, "header": lambda lang, s: "", "footer": lambda lang: "", "footer_en": lambda: "", "LANGS": {}, "sitemap": sitemap, "TODAY": TODAY}
        a = {**self.item(body=words(2600), lang="fr"), "slug": "lang"}
        b = {**self.item(body=words(100), lang="fr"), "slug": "kurz", "id": 6}
        LIB.build(g, [a, b], [{"handle": "anna", "name": "Anna"}], "https://api.example.test")
        base = f"{BASE}/fr/community/library/"
        self.assertFalse(pages[f"{base}anna-lang/"])
        self.assertTrue(pages[f"{base}anna-kurz/"])
        self.assertFalse(pages[base])   # Verzeichnis: mindestens ein indexierbarer Eintrag
        urls = [x[0] for x in sitemap]
        self.assertIn(f"{base}anna-lang/", urls); self.assertNotIn(f"{base}anna-kurz/", urls); self.assertEqual(urls.count(base), 1)


# ---------------------------------------------------------------- Profile

class MemberProfileTests(unittest.TestCase):
    def build(self, people):
        written, noidx, sitemap = {}, {}, []

        def page(lang, title, desc, url, body, extra=None, jsonld=None, **kw):
            noidx[url] = kw.get("noindex", False)
            return body
        g = {"BASE": "https://www.m365.fm", "write": lambda p, c: written.update({p: c}), "page": page, "header": lambda *_: "", "footer": lambda *_: "", "footer_en": lambda: "",
             "sitemap": sitemap, "TODAY": TODAY, "LANGS": MEM.COMM_LANGS}
        MEM.build(g, people, [])
        return noidx, sitemap

    def test_translated_about_over_2500_chars_indexes_that_language_only(self):
        p = {"handle": "anna", "name": "Anna", "public": True, "about": words(300), "i18n": {"fr": {"about": words(2600)}, "es": {"about": words(300)}}}
        noidx, sitemap = self.build([p])
        self.assertFalse(noidx["https://www.m365.fm/fr/community/u/anna/"])
        self.assertTrue(noidx["https://www.m365.fm/es/community/u/anna/"])   # kurzer uebersetzter Text
        self.assertTrue(noidx["https://www.m365.fm/de/community/u/anna/"])   # keine Uebersetzung: Rueckfall zaehlt nicht
        self.assertFalse(noidx["https://www.m365.fm/community/u/anna/"])   # Englisch bleibt wie bisher index
        urls = [x[0] for x in sitemap]
        self.assertIn("https://www.m365.fm/fr/community/u/anna/", urls)
        self.assertNotIn("https://www.m365.fm/es/community/u/anna/", urls)

    def test_long_original_about_does_not_lift_other_languages(self):
        p = {"handle": "anna", "name": "Anna", "public": True, "about": words(3000)}
        noidx, _ = self.build([p])
        self.assertTrue(noidx["https://www.m365.fm/fr/community/u/anna/"])   # Seite zeigt den Originaltext (Rueckfall), kein eigener Text der Sprache


# ---------------------------------------------------------------- Verzeichnis, englische Folgen

class DirectoryTests(unittest.TestCase):
    ITEMS = [{"type": "expert"}]

    def test_long_own_text_indexes_a_place_page_with_few_entries(self):
        long_text = " ".join(f"unique{i} filler words about the region" for i in range(80))   # > 2500 Zeichen
        self.assertGreaterEqual(len(long_text), 2500)
        self.assertTrue(DIR._indexable(self.ITEMS, "city", long_text, "", "completely different parent text"))
        self.assertFalse(DIR._indexable(self.ITEMS, "city", "short intro", "", "parent"))   # weiterhin zu wenig Eintraege/Woerter

    def test_duplicate_of_parent_text_stays_noindex(self):
        long_text = " ".join(f"unique{i} filler words about the region" for i in range(80))
        self.assertFalse(DIR._indexable(self.ITEMS, "city", long_text, "", long_text))

    def test_hub_rule_unchanged(self):
        self.assertFalse(DIR._indexable(self.ITEMS))
        self.assertTrue(DIR._indexable([{}] * 3))


class EnglishEpisodeTests(unittest.TestCase):
    def ep(self, **kw):
        return {"name": "Folge", "slug": "folge", "source": "spreaker", "show_notes": "", **kw}

    def test_new_spreaker_episode_without_notes_is_noindex_until_text_is_long(self):
        self.assertTrue(PP.episode_noindex(self.ep(), None, False, False, ("Teaser", "", "", "", "")))   # T28 unveraendert
        self.assertTrue(PP.episode_noindex(self.ep(), None, False, False, ("Teaser", "", "", "", words(2400))))
        self.assertFalse(PP.episode_noindex(self.ep(), None, False, False, ("Teaser", "", "", "", words(2500))))   # Transkript im HTML ab 2500 Zeichen

    def test_other_episodes_are_never_noindex(self):
        for kw, args in ((dict(show_notes="<p>Notes</p>"), (None, False, False)), (dict(), (None, True, False)), (dict(), (None, False, True)),
                         (dict(), ({"markup": "<p>x</p>"}, False, False)), (dict(source=None), (None, False, False))):
            self.assertFalse(PP.episode_noindex(self.ep(**kw), *args, ("", "", "", "", "")), kw)


if __name__ == "__main__":
    unittest.main()
