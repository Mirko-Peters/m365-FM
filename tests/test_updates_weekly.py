"""/updates/ zeigt nur die Wochenzusammenfassungen "M365.FM milestones" (Mirko, 6.11.2026): keine Tagesliste mit Folgen, Artikeln, Videos,
Bibliothekseintraegen, Microsoft-Updates oder GitHub-Meldungen. Dazu: Format der Freitagsaufgabe (imports/blog/en/m365fm-milestones-<JJJJ>-w<KW>.md),
Thema M365.FM, Leerzustand, ItemList-JSON-LD, Sprachfassungen und die Beitragsseite der Zusammenfassung (keine angehaengten Inhaltslisten)."""
import json
import re
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

import site_blog as BLG
import site_content_blog as CBL
import site_milestones as MST

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://example.test"
TODAY = "2026-11-06"


def ts(d):
    return int(datetime.strptime(d, "%Y-%m-%d").replace(tzinfo=timezone.utc).timestamp())


def post(slug, lang="en", title=None, summary="", topics=None, published="2026-11-06", **kw):
    return {"id": abs(hash((slug, lang))) % 10 ** 6, "handle": "mirko-p", "name": "Mirko Peters", "slug": slug, "lang": lang, "title": title or slug,
            "summary": summary, "body": "", "html": f"<p>{slug} text</p>", "topics": topics or [], "published": ts(published), "votes": 0, "legacy": True, **kw}


W44 = post("m365fm-milestones-2026-w44", title="M365.FM milestones – week 44, 2026", summary="New profile pages and a faster home page.", topics=["m365fm"], published="2026-10-30")
W45 = post("m365fm-milestones-2026-w45", title="M365.FM milestones – week 45, 2026", summary="Sponsor page, Expert Connect and fixes.", topics=["m365fm"], published="2026-11-06")
W45_DE = post("m365fm-milestones-2026-w45", lang="de", title="M365.FM-Meilensteine – KW 45, 2026", summary="Sponsorenseite, Expert Connect und Fehlerbehebungen.",
              topics=["m365fm"], tr_of="en", tr_index=True, ai_tr=True, content_tr=True)
W45_FR = post("m365fm-milestones-2026-w45", lang="fr", title="Jalons M365.FM – semaine 45, 2026", summary="Page sponsor.", topics=["m365fm"], tr_of="en", tr_index=False)
ARTICLE = post("nerdio-autoscale-explained", title="Nerdio autoscale explained", summary="An article.", topics=["m365fm", "nerdio"], published="2026-11-05")
ARTICLE_DE = post("copilot-lizenzen", lang="de", title="Copilot-Lizenzen planen", summary="Ein Artikel.", topics=["m365fm"], published="2026-11-05")
OTHER_AUTHOR = {**post("m365fm-milestones-2026-w43", title="Fake milestones by someone else"), "handle": "someone"}


def run(posts):
    files, pages, sitemap = {}, {}, []

    def page(lang, title, desc, canonical, body, alternates=None, jsonld=None, xdefault=None, noindex=False, **kw):
        pages[canonical] = {"lang": lang, "title": title, "desc": desc, "body": body, "ld": jsonld, "noindex": noindex, "alt": alternates}
        return body
    g = {"BASE": BASE, "write": files.__setitem__, "page": page, "header": lambda lang, s: "", "footer": lambda lang: "", "sitemap": sitemap, "TODAY": TODAY}
    res = MST.build(g, posts)
    return res, files, pages, sitemap


def hrefs(html):
    return re.findall(r'href="([^"]+)"', html)


class WeekTests(unittest.TestCase):
    def test_week_of(self):
        self.assertEqual(MST.week_of("m365fm-milestones-2026-w45"), (2026, 45))
        self.assertEqual(MST.week_of("m365fm-milestones-2026-w5"), (2026, 5))
        self.assertIsNone(MST.week_of("m365fm-milestones-2026-w54"))   # keine ISO-Woche
        self.assertIsNone(MST.week_of("nerdio-autoscale-explained"))
        self.assertIsNone(MST.week_of(None))
        self.assertEqual(MST.week_range(2026, 45), (datetime(2026, 11, 2).date(), datetime(2026, 11, 8).date()))
        self.assertFalse(MST.is_milestone(OTHER_AUTHOR))


class UpdatesPageTests(unittest.TestCase):
    def test_only_milestones_newest_first_no_content_or_github(self):
        res, files, pages, sitemap = run([ARTICLE, W44, W45, ARTICLE_DE, OTHER_AUTHOR])
        self.assertEqual(res, {"en": 2, "de": 2})
        self.assertEqual(set(files), {"updates/index.html", "de/updates/index.html"})
        en = pages[f"{BASE}/updates/"]
        b = en["body"]
        self.assertLess(b.index("week 45"), b.index("week 44"))
        allowed = {MST.url_of(BASE, W45), MST.url_of(BASE, W44), f"{BASE}/community/#c-wish"}
        self.assertEqual(set(hrefs(b)), allowed)   # keine Folgen-, Artikel-, Video-, Bibliotheks-, Entitaets- oder Feed-Links
        for bad in ("nerdio-autoscale", "Fake milestones", "github", "/entity/", "/community/podcast/", "/community/video/", "/community/library/", "/show/episodes/",
                    "news-day", "en-upd", "hub-card", "Microsoft updates", "new since yesterday"):
            self.assertNotIn(bad, b)
        self.assertIn("Week 45 · 2026", b)
        self.assertIn('<time datetime="2026-11-02">2026-11-02</time>', b)
        self.assertIn("Sponsor page, Expert Connect and fixes.", b)
        self.assertIn("Roadmap &amp; wishlist", b)
        self.assertEqual(en["title"], "Updates – what's new on M365.FM each week – M365.FM")
        self.assertFalse(en["noindex"])
        self.assertIn((f"{BASE}/updates/", "2026-11-06", None), sitemap)

    def test_german_page_prefers_translation_and_falls_back_to_english(self):
        _, _, pages, _ = run([W44, W45, W45_DE])
        de = pages[f"{BASE}/de/updates/"]
        b = de["body"]
        self.assertEqual(de["title"], "Updates – was jede Woche neu ist – M365.FM")
        self.assertIn(f'href="{BASE}/de/community/u/mirko-p/blog/m365fm-milestones-2026-w45/"', b)   # Sprachfassung
        self.assertIn(f'href="{BASE}/community/u/mirko-p/blog/m365fm-milestones-2026-w44/" hreflang="en" lang="en"', b)   # noch nicht uebersetzt: Original
        self.assertIn("auf Englisch", b)
        self.assertIn("KW 45 · 2026", b)
        self.assertIn('<time datetime="2026-11-02">02.11.2026</time>', b)
        self.assertIn(f'href="{BASE}/de/community/#c-wish"', b)
        self.assertIn("Roadmap &amp; Wunschliste", b)
        self.assertNotIn("Copilot-Lizenzen", b)

    def test_itemlist_jsonld(self):
        _, _, pages, _ = run([W44, W45])
        ld = pages[f"{BASE}/updates/"]["ld"][0]
        self.assertEqual(ld["@type"], "CollectionPage")
        self.assertEqual(ld["inLanguage"], "en")
        self.assertEqual(ld["dateModified"], "2026-11-06")
        il = ld["mainEntity"]
        self.assertEqual(il["@type"], "ItemList")
        self.assertEqual(il["numberOfItems"], 2)
        self.assertEqual([x["url"] for x in il["itemListElement"]], [MST.url_of(BASE, W45), MST.url_of(BASE, W44)])
        self.assertEqual([x["position"] for x in il["itemListElement"]], [1, 2])
        json.dumps(ld)   # serialisierbar

    def test_empty_state(self):
        res, files, pages, sitemap = run([ARTICLE, ARTICLE_DE])
        self.assertEqual(res, {"en": 0, "de": 0})
        en, de = pages[f"{BASE}/updates/"], pages[f"{BASE}/de/updates/"]
        self.assertIn("The first weekly summary will be published on Friday.", en["body"])
        self.assertIn("Die erste Wochenzusammenfassung erscheint am Freitag.", de["body"])
        for p in (en, de):
            self.assertNotIn("<ol", p["body"])
            self.assertNotIn("mainEntity", p["ld"][0])
            self.assertEqual(p["ld"][0]["dateModified"], TODAY)
            self.assertEqual(set(hrefs(p["body"])), {f"{BASE}{'/de' if p['lang'] == 'de' else ''}/community/#c-wish"})

    def test_further_languages_only_with_translations(self):
        res, files, pages, sitemap = run([W45, W45_DE, W45_FR])
        self.assertEqual(set(res), {"en", "de", "fr"})
        fr = pages[f"{BASE}/fr/updates/"]
        self.assertTrue(fr["noindex"])   # fr-Fassung noch nicht freigegeben (tr_index)
        self.assertNotIn(f"{BASE}/fr/updates/", [u for u, *_ in sitemap])
        self.assertIn(f"{BASE}/fr/community/u/mirko-p/blog/m365fm-milestones-2026-w45/", fr["body"])
        res, *_ = run([W45, {**W45_FR, "tr_index": True}])
        self.assertIn("fr", res)
        _, _, pages, sitemap = run([W45, {**W45_FR, "tr_index": True}])
        self.assertFalse(pages[f"{BASE}/fr/updates/"]["noindex"])
        self.assertIsNone(pages[f"{BASE}/fr/updates/"]["alt"])   # hreflang setzt finish_hreflang fuer gleiche Pfade


class FridayTaskFormatTests(unittest.TestCase):
    """Die Freitagsaufgabe schreibt imports/blog/en/m365fm-milestones-<JJJJ>-w<KW>.md im Format der Content-Pakete (nur als Testdatei, kein echter Beitrag)."""
    PKG = """---
title: "M365.FM milestones – week 45, 2026"
summary: "What changed on M365.FM this week: a sponsor page with a package configurator, Expert Connect for publishers and a faster home page."
status: approved
publish: true
author: mirko-p
date: 2026-11-06
---

This week brought a few visible changes to the website.

## New

- A sponsor page with a package configurator.
- Expert Connect for publishers who need a quote from a Microsoft expert.

## Improved

- The home page loads faster on phones.

## Fixed

- Broken links on some language pages.

Ideas for next week? Add them to the [roadmap and wishlist](https://www.m365.fm/community/#c-wish).
"""

    def collect(self, name, text):
        d = Path(tempfile.mkdtemp()) / "blog"
        (d / "en").mkdir(parents=True)
        (d / "en" / name).write_text(text, "utf-8")
        with patch.object(CBL, "DIR", d):
            return CBL.collect({"m365fm": {}, "sap": {}})

    def test_short_milestones_package_is_accepted_and_tagged(self):
        items, rep = self.collect("m365fm-milestones-2026-w45.md", self.PKG)
        self.assertEqual(rep["errors"], [])
        self.assertEqual(len(items), 1)
        it = items[0]
        self.assertEqual((it["slug"], it["lang"], it["author"], it["publish"]), ("m365fm-milestones-2026-w45", "en", "mirko-p", True))
        self.assertEqual(it["topics"], ["m365fm"])   # Thema M365.FM einheitlich, auch ohne Angabe im Kopf
        self.assertEqual(MST.week_of(it["slug"]), (2026, 45))

    def test_other_short_packages_still_need_300_words(self):
        items, rep = self.collect("short-article.md", self.PKG)
        self.assertEqual(items, [])
        self.assertIn("mindestens 300", rep["errors"][0]["errors"][0])

    def test_repo_milestones_files_are_valid(self):
        """Echte Dateien der Freitagsaufgabe (falls schon vorhanden) muessen das Slug-Muster treffen und die Pruefung bestehen."""
        for f in sorted((ROOT / "imports" / "blog" / "en").glob("m365fm-milestones-*.md")):
            self.assertIsNotNone(MST.week_of(f.stem), f.name)


class MilestonePostPageTests(unittest.TestCase):
    def test_post_page_has_no_content_lists(self):
        files, pages = {}, {}

        def page(lang, title, desc, canonical, body, *a, **kw):
            pages[canonical] = body
            return body
        g = {"BASE": BASE, "write": files.__setitem__, "write_r2": files.__setitem__, "page": page, "header": lambda lang, s: "", "footer": lambda lang: "",
             "footer_en": lambda: "", "LANGS": {}, "sitemap": [], "TODAY": TODAY}
        BLG.build(g, [ARTICLE, W44, W45], [{"handle": "mirko-p", "name": "Mirko Peters"}], "https://api.example.test")
        b = pages[MST.url_of(BASE, W45)]
        self.assertIn("More weekly summaries", b)
        self.assertIn(MST.url_of(BASE, W44), b)
        self.assertIn(f"{BASE}/updates/", b)
        self.assertNotIn("Related articles", b)
        self.assertNotIn("nerdio-autoscale-explained", b)   # weder als verwandter Artikel noch im Vor/Zurueck
        a = pages[MST.url_of(BASE, ARTICLE)]
        self.assertNotIn("m365fm-milestones", a)   # normale Artikel blaettern nicht in die Zusammenfassungen


class OldDailyListRemovedTests(unittest.TestCase):
    def test_sources(self):
        gs = (ROOT / "generate_site.py").read_text("utf-8")
        self.assertNotIn("page_block(", gs)
        self.assertNotIn("HUB.news(", gs)
        self.assertNotIn("new since yesterday", gs)
        self.assertIn("MST.build(_ctx, _posts)", gs)
        import site_home, site_updates
        self.assertFalse(hasattr(site_home, "news"))
        self.assertFalse(hasattr(site_updates, "page_block"))
        self.assertTrue(hasattr(site_updates, "block"))   # Entitaetsseiten: neuestes Microsoft-Update bleibt


if __name__ == "__main__":
    unittest.main()
