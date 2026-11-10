import json
import re
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_sponsor as SPN
import site_legal as LEG


class SponsorDashboardTests(unittest.TestCase):
    def test_builds_localized_dashboard_pages_and_links_them_from_sponsor_page(self):
        written, rendered = {}, {}

        def page(lang, title, desc, canonical, body, *args, **kwargs):
            rendered[canonical] = {"lang": lang, "body": body, "alternates": args[0] if args else None, "kwargs": kwargs}
            return body

        ctx = {
            "write": lambda path, content: written.__setitem__(path, content),
            "page": page,
            "header": lambda lang, switch: "",
            "footer": lambda lang: "",
            "BASE": "https://www.m365.fm",
            "LANGS": {lang: (lang, lang, "rtl" if lang in ("ar", "he") else "ltr", "show", "en_US")
                      for lang in SPN.LANGS_ALL if lang != "en"},
            "sitemap": [],
            "TODAY": "2026-11-04",
            "api": "https://api-dub.m365.fm",
            "langs": list(SPN.LANGS_ALL),
            "day": lambda value, lang: str(value),
        }

        with patch.object(SPN, "_ssr", return_value={}), \
             patch.object(SPN, "T", side_effect=lambda lang, en, de: de if lang == "de" else en):
            SPN.build(ctx)

        en = "https://www.m365.fm/sponsor/dashboard/"
        de = "https://www.m365.fm/de/sponsor/dashboard/"
        ar = "https://www.m365.fm/ar/sponsor/dashboard/"
        he = "https://www.m365.fm/he/sponsor/dashboard/"
        for view in ("placement", "report", "sources"):
            self.assertIn(f"sponsor/dashboard/{view}/index.html", written)
            self.assertIn(f"de/sponsor/dashboard/{view}/index.html", written)
            self.assertIsNone(rendered[f"https://www.m365.fm/sponsor/dashboard/{view}/"]["alternates"])
            self.assertIn("<style>:root{--sdb-measured", rendered[f"https://www.m365.fm/sponsor/dashboard/{view}/"]["kwargs"]["extra_head"])
        self.assertIn("sponsor/dashboard/index.html", written)
        self.assertIn("de/sponsor/dashboard/index.html", written)
        self.assertIn("ar/sponsor/dashboard/index.html", written)
        self.assertIn("he/sponsor/dashboard/index.html", written)
        self.assertIsNone(rendered[en]["alternates"])
        self.assertIsNone(rendered[de]["alternates"])
        self.assertIn(f'href="{en}"', written["sponsor/index.html"])
        self.assertIn("A source-backed view", written["sponsor/dashboard/index.html"])
        self.assertIn("Quellenbasierte Übersicht", written["de/sponsor/dashboard/index.html"])
        self.assertIn("window.M365SP=", written["sponsor/dashboard/index.html"])
        self.assertIn("sponsor-dashboard.js", written["de/sponsor/dashboard/index.html"])
        self.assertNotIn('"campaigns"', written["sponsor/dashboard/index.html"])
        self.assertIn("What your sponsorship achieved", written["sponsor/dashboard/index.html"])
        self.assertIn("var(--bg)", rendered[en]["kwargs"]["extra_head"])
        self.assertIn("<style>:root{--sdb-measured", rendered[en]["kwargs"]["extra_head"])
        self.assertNotIn("hreflang", rendered[en]["kwargs"]["extra_head"])
        self.assertNotIn("hreflang", rendered[de]["kwargs"]["extra_head"])
        self.assertTrue(rendered[en]["kwargs"]["noindex"])
        self.assertFalse(any("/sponsor/dashboard/" in url for url, *_ in ctx["sitemap"]))
        for path in written.values():
            self.assertNotRegex(path, r"\b(?:21400|4820|12300|9150|38600|1840)\b")
        for key in ("measured", "estimated", "manual", "measured_desc", "estimated_desc", "manual_desc",
                    "as_of", "source", "ai_citations", "search_impressions"):
            self.assertTrue(SPN.dashboard_copy("en")[key])
            self.assertTrue(SPN.dashboard_copy("de")[key])

    def test_dashboard_does_not_assign_companies_by_website(self):
        frontend = (ROOT / "assets" / "sponsor-dashboard.js").read_text("utf-8")
        self.assertNotIn("publicPlacements", frontend)
        self.assertNotIn("org.website", frontend)

    def test_detail_labels_unavailable_breakdowns_without_sample_values(self):
        frontend = (ROOT / "assets" / "sponsor-dashboard.js").read_text("utf-8")
        for key in ("languages_viewed", "source_no_data"):
            self.assertIn(f'"{key}"', frontend)
            self.assertIn(key, SPN.dashboard_copy("en"))
            self.assertIn(key, SPN.dashboard_copy("de"))
        self.assertIn(".sdb-lang-bars", SPN.DASHBOARD_CSS)
        self.assertIn("body *{visibility:hidden!important}", SPN.DASHBOARD_CSS)
        self.assertIn(".sdb-report,.sdb-report *{visibility:visible!important}", SPN.DASHBOARD_CSS)
        self.assertNotIn("LinkedIn", frontend)
        self.assertNotIn("HeySummit", frontend)

    def test_every_text_key_of_the_new_sections_exists_in_german_and_english(self):
        frontend = (ROOT / "assets" / "sponsor-dashboard.js").read_text("utf-8")
        block = frontend[frontend.index("// ---- Klicks (echt/gefiltert)"):frontend.index("function renderOverview")]
        keys = set(re.findall(r'text\("([a-z_0-9]+)"\)', block))
        for heads in re.findall(r'table\(\[([^\]]*)\]', block):
            keys |= set(re.findall(r'"([a-z_0-9]+)"', heads))
        keys |= {f"kind_{k}" for k in ("company", "product", "topic", "entity", "episode", "other")}
        keys |= set(re.findall(r'"(source_leads)"', frontend))
        self.assertGreater(len(keys), 40)
        for lang in ("en", "de"):
            copy = SPN.dashboard_copy(lang)
            self.assertEqual(sorted(k for k in keys if k not in copy), [], lang)

    def test_sponsor_context_lists_entities_with_kind_and_posts_from_the_plan_without_inventing_any(self):
        with tempfile.TemporaryDirectory() as d:
            d = Path(d)
            (d / "sponsorships.json").write_text(json.dumps({"version": 1, "sponsorships": [
                {"id": "acme-2026", "sponsor": {"name": "Acme", "url": "https://acme.example/"}, "label": "sponsored", "entities": ["acme", "acme-tool"],
                 "topics": ["oversharing"], "posts": ["/community/u/mirko-p/blog/post-a/"], "manager": {"handle": "mirko-p", "entity": "mirko-peters"}},
                {"id": "other-2026", "sponsor": {"name": "Other", "url": "https://other.example/"}, "label": "sponsored", "entities": ["unknown-entity"]}]}), "utf-8")
            (d / "sponsor_posts_acme.json").write_text(json.dumps([
                {"nr": 1, "reihe": "A", "title": "Post A", "main": "oversharing", "others": [], "sponsored": True, "status": "geplant", "slug": "post-a", "date": "2026-11-15"},
                {"nr": 2, "reihe": "A", "title": "Post B", "main": "oversharing", "others": [], "sponsored": False, "status": "geplant", "slug": "post-b", "date": "2026-11-16"}]), "utf-8")
            ents = {"acme": {"type": "org", "name": "Acme"}, "acme-tool": {"type": "product", "name": "Acme Tool"}, "oversharing": {"type": "concept", "name": "Oversharing"}}
            ctx = SPN.sponsor_context({"ents": ents}, d)
        self.assertEqual(ctx["acme-2026"]["entities"], [{"id": "acme", "name": "Acme", "kind": "company"}, {"id": "acme-tool", "name": "Acme Tool", "kind": "product"},
                                                       {"id": "oversharing", "name": "Oversharing", "kind": "topic"}])
        posts = {p["title"]: p for p in ctx["acme-2026"]["posts"]}
        self.assertEqual(posts["Post A"]["status"], "published")   # steht in sponsorships.json posts
        self.assertEqual(posts["Post B"]["status"], "planned")
        self.assertEqual(posts["Post B"]["path"], "/community/u/mirko-p/blog/post-b/")
        # ohne Plan und ohne Beitraege: leer, nichts erfunden; unbekannte Entitaet behaelt ihre ID als Namen
        self.assertEqual(ctx["other-2026"], {"entities": [{"id": "unknown-entity", "name": "unknown-entity", "kind": "topic"}], "posts": []})

    def test_site_ai_rows_only_with_valid_numbers_and_marked_manual(self):
        ok = {"bing": {"ok": True, "citations": 10, "period": {"from": "2026-08-01", "to": "2026-10-31"}, "source": "Bing", "retrieved": "2026-11-04"},
              "google": {"ok": False}}
        rows = SPN.site_ai_rows(ok)
        self.assertEqual([(r["label"], r["value"], r["kind"]) for r in rows], [("Bing AI Performance: Copilot", 10, "manual")])
        self.assertEqual(SPN.site_ai_rows({"bing": {"ok": False}, "google": {}}), [])

    def test_sponsor_link_privacy_notice_is_a_section_in_both_languages(self):
        de, en = LEG.privacy_de(), LEG.privacy_en()
        self.assertIn("<h2>Sponsor-Links</h2><p>Klicks auf Sponsor-Links", de)
        self.assertIn("<h2>Sponsor links</h2><p>We count clicks on sponsor links", en)


    def _build(self, env):
        written, rendered = {}, {}

        def page(lang, title, desc, canonical, body, *args, **kwargs):
            rendered[canonical] = {"body": body, "kwargs": kwargs}
            return body

        ctx = {"write": lambda path, content: written.__setitem__(path, content), "page": page, "header": lambda lang, switch: "", "footer": lambda lang: "",
               "BASE": "https://www.m365.fm",
               "LANGS": {lang: (lang, lang, "ltr", "show", "en_US") for lang in SPN.LANGS_ALL if lang != "en"},
               "sitemap": [], "TODAY": "2026-11-04", "api": "https://api-dub.m365.fm", "langs": list(SPN.LANGS_ALL), "day": lambda value, lang: str(value)}
        with patch.dict("os.environ", env, clear=False), patch.object(SPN, "_ssr", return_value={}), \
             patch.object(SPN, "T", side_effect=lambda lang, en, de: de if lang == "de" else en):
            SPN.build(ctx)
        return written, rendered, ctx

    def test_partner_base_moves_the_dashboard_links_but_not_the_files_or_canonical(self):
        written, rendered, ctx = self._build({"PARTNER_BASE": "https://partner.m365.fm"})
        www = "https://www.m365.fm/sponsor/dashboard/"
        self.assertIn("sponsor/dashboard/index.html", written, "die Seitendatei bleibt unter dem alten Pfad (der Site-Worker schreibt um)")
        self.assertIn("de/sponsor/dashboard/report/index.html", written)
        self.assertIn(www, rendered, "Canonical bleibt die Adresse der Seitendatei")
        self.assertTrue(rendered[www]["kwargs"]["noindex"])
        cfg = json.loads(re.search(r"window\.M365SP=Object\.assign\((\{.*?\}),\{view:", written["de/sponsor/dashboard/index.html"]).group(1))
        self.assertEqual(cfg["urls"]["overview"], "https://partner.m365.fm/de/")
        self.assertEqual(cfg["urls"]["report"], "https://partner.m365.fm/de/report/")
        en = json.loads(re.search(r"window\.M365SP=Object\.assign\((\{.*?\}),\{view:", written["sponsor/dashboard/index.html"]).group(1))
        self.assertEqual(en["urls"]["sources"], "https://partner.m365.fm/sources/")
        self.assertIn('href="https://partner.m365.fm/"', written["sponsor/index.html"], "Knopf auf der Sponsor-Seite fuehrt direkt zur Subdomain")
        self.assertFalse(any("partner.m365.fm" in url for url, *_ in ctx["sitemap"]), "nicht in der Sitemap")
        self.assertFalse(any("/sponsor/dashboard/" in url for url, *_ in ctx["sitemap"]))

    def test_without_partner_base_or_with_invalid_value_nothing_changes(self):
        for value in ("", "http://partner.m365.fm", "https://partner.m365.fm/x", "partner.m365.fm", "https://evil.example/\"><script>"):
            with patch.dict("os.environ", {"PARTNER_BASE": value}):
                self.assertEqual(SPN.partner_base(), "", value)
                self.assertEqual(SPN.dashboard_url("https://www.m365.fm", "de", public=True), "https://www.m365.fm/de/sponsor/dashboard/")
        with patch.dict("os.environ", {"PARTNER_BASE": "https://partner.m365.fm/"}):
            self.assertEqual(SPN.dashboard_url("https://www.m365.fm", "en", public=True), "https://partner.m365.fm/")
            self.assertEqual(SPN.dashboard_view_url("https://www.m365.fm", "ar", "sources", public=True), "https://partner.m365.fm/ar/sources/")
            self.assertEqual(SPN.dashboard_url("https://www.m365.fm", "en"), "https://www.m365.fm/sponsor/dashboard/", "ohne public immer der Dateipfad")

if __name__ == "__main__":
    unittest.main()
