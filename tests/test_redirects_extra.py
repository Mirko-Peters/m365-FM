"""Zusatz-Weiterleitungen (data/redirects_extra.json): jedes Ziel ist eine Seite, die der Bau erzeugt, kein Ziel leitet selbst weiter,
keine Schleifen, und die alten Adressen loesen ueber den Nachbau des Site-Workers (site_links.py) in einem Schritt auf ihr Ziel auf."""
import gzip
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_links as SL   # noqa: E402
import site_podpage as PP   # noqa: E402

D = ROOT / "data"
RAW = json.loads((D / "redirects_extra.json").read_text("utf-8"))
EXTRA = PP.extra_redirects()
# Seiten ausserhalb der Datenlisten, die jeder Bau schreibt (Blog-Uebersicht, Community, Events, Personenseite, Entitaeten-Index)
FIXED = {"/community/u/mirko-p/blog/", "/community/", "/community/events/", "/about/mirko-peters/", "/entity/"}


def built_targets():
    eps = {e["slug"] for e in PP.load("episodes") if e.get("published") not in (False, "False") and e.get("hidden") not in (True, "True")}
    ents = {e["id"] for f in ("entities.json", "guest_entities.json") if (D / f).exists() for e in json.loads((D / f).read_text("utf-8"))}
    blog = {p["slug"] for p in json.loads(gzip.open(D / "podpage" / "blog_posts.json.gz", "rt", encoding="utf-8").read()) if p.get("title") and p.get("html")}
    skip = {"episodes", "blog", "reviews", "podroll", "courses", "store", "videos", "guests", "people", "sponsors", "contact", "join", "leave_review", "rate",
            "guest_intake", "newsletter", "follow", "voicemail", "community-events", "legal", "hosts"}   # wie SKIPP in site_podpage.build
    pages = {p["slug"] for p in json.loads((D / "podpage" / "pages.json").read_text("utf-8")) if p["slug"] not in skip and p.get("page_content") not in (None, "", "None")}
    return eps, ents, blog, pages


class RedirectsExtraTest(unittest.TestCase):
    def test_file_format(self):
        self.assertIn("_doc", RAW)
        self.assertGreaterEqual(len(EXTRA), 120)
        for old, x in RAW["redirects"].items():
            self.assertRegex(old, r"^/[a-z0-9-]+$", old)   # alte flache Adresse ohne "/" am Ende (so fragt der Worker die Tabelle ab)
            self.assertTrue(x.get("to", "").startswith("/") and x["to"].endswith("/"), old)
            self.assertTrue(x.get("why"), old)

    def test_every_target_is_built(self):
        eps, ents, blog, pages = built_targets()
        merged = {f"/entity/{k}" for k in (json.loads((D / "guest_merge.json").read_text("utf-8")).get("merge") or {})} if (D / "guest_merge.json").exists() else set()
        for old, to in EXTRA.items():
            m = re.fullmatch(r"/show/episodes/([a-z0-9-]+)/", to)
            if m: self.assertIn(m.group(1), eps, f"{old} -> {to}: Folge fehlt"); continue
            m = re.fullmatch(r"/entity/([a-z0-9-]+)/", to)
            if m:
                self.assertIn(m.group(1), ents, f"{old} -> {to}: Entitaet fehlt")
                self.assertNotIn(to.rstrip("/"), merged, f"{old} -> {to}: Entitaet ist zusammengefuehrt (Weiterleitung)")
                continue
            m = re.fullmatch(r"/community/u/mirko-p/blog/([a-z0-9-]+)/", to)
            if m: self.assertIn(m.group(1), blog, f"{old} -> {to}: Beitrag fehlt"); continue
            m = re.fullmatch(r"/show/([a-z0-9-]+)/", to)
            if m: self.assertIn(m.group(1), pages, f"{old} -> {to}: Show-Seite fehlt"); continue
            self.assertIn(to, FIXED, f"{old} -> {to}: unbekanntes Ziel")

    def test_no_target_redirects_and_no_loops(self):
        res = SL.Resolver(EXTRA, SL.Site())   # nur die Zusatztabelle + feste Worker-Regeln
        for old, to in EXTRA.items():
            self.assertNotIn(to.rstrip("/"), EXTRA, f"{to} ist selbst eine alte Adresse")
            self.assertIsNone(res.hop(SL.WWW, to), f"{to} leitet weiter")
            for href in (old, old + "/", "https://www.m365.fm" + old + "/", "https://m365.fm" + old):
                st, h, p = res.resolve(*SL.split_internal(href)[1:3])
                self.assertEqual((st in ("redirect", "soft"), h, p), (True, SL.WWW, to), href)

    def test_existing_entries_win(self):
        # site_podpage.build: rd.setdefault - ein bereits vorhandener Eintrag (Folge, Seite, Beitrag) wird nicht ueberschrieben
        rd = {"/feedback": "/show/feedback/"}
        for old, new in EXTRA.items(): rd.setdefault(old, new)
        self.assertEqual(rd["/feedback"], "/show/feedback/")


if __name__ == "__main__":
    unittest.main()
