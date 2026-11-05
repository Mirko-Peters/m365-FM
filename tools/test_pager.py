"""Offline-Regression fuer Vor/Zurueck, Head-Preloads, Erwaehnungen und den Pager-Checker."""
import ast
import contextlib
import io
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import site_design as SD
import site_mentions as MEN
import site_i18n
from tools import check_pager

BASE = check_pager.BASE


def load_head_functions():
    tree = ast.parse((ROOT / "generate_site.py").read_text("utf-8"))
    wanted = {"pn_head", "font_preloads"}
    body = [node for node in tree.body
            if isinstance(node, ast.FunctionDef) and node.name in wanted
            or isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id == "PRELOAD_FONTS" for t in node.targets)]
    namespace = {"re": re, "BASE": "https://example.test"}
    exec(compile(ast.Module(body=body, type_ignores=[]), "generate_site.py", "exec"), namespace)
    return namespace


HEAD = load_head_functions()


class PagerTests(unittest.TestCase):
    def test_neighbours_newest_first_and_edges(self):
        seq = ["new", "middle", "old"]
        self.assertEqual(SD.neighbours(seq, 1), ("old", "new"))
        self.assertEqual(SD.neighbours(seq, 0), ("middle", None))
        self.assertEqual(SD.neighbours(seq, 2), (None, "middle"))
        self.assertEqual(SD.neighbours(["only"], 0), (None, None))

    def test_pager_directions_escaping_and_empty(self):
        self.assertEqual(SD.pager("en"), "")
        self.assertEqual(SD.pager("en", None, None), "")
        both = SD.pager("en", ("/older/?a=1&b=2", 'A "quoted" <title>'), ("/newer/", "New"))
        self.assertIn('rel="prev" href="/older/?a=1&amp;b=2"', both)
        self.assertIn('rel="next" href="/newer/"', both)
        self.assertIn("A &quot;quoted&quot; &lt;title&gt;", both)
        self.assertEqual(SD.pager("en", ("/older/", "Old")), SD.pager("en", ("/older/", "Old"), None))
        self.assertIn('rel="prev"', SD.pager("en", ("/older/", "Old")))
        self.assertNotIn('rel="next"', SD.pager("en", ("/older/", "Old")))
        self.assertIn('rel="next"', SD.pager("en", None, ("/newer/", "New")))
        self.assertNotIn('rel="prev"', SD.pager("en", None, ("/newer/", "New")))

    def test_rtl_arrows(self):
        for lang in ("ar", "he"):
            with self.subTest(lang=lang):
                nav = SD.pager(lang, ("/older/", "Old"), ("/newer/", "New"))
                self.assertRegex(nav, r'<a class="pv" rel="prev".*?><small>→ ')
                self.assertRegex(nav, r'<a class="nx" rel="next".*?><small>.* ←</small>')

    def test_labels_for_all_languages_and_kinds(self):
        langs = set(site_i18n.COMM_LANGS)
        self.assertEqual(set(SD.PAGER_T), langs)
        self.assertEqual({kind for labels in SD.PAGER_T.values() for kind in labels},
                         {"episode", "article", "video", "page"})
        for lang in site_i18n.COMM_LANGS:
            for kind, labels in SD.PAGER_T[lang].items():
                with self.subTest(lang=lang, kind=kind):
                    nav = SD.pager(lang, ("/older/", "Old"), ("/newer/", "New"), kind)
                    for label in labels[:2]:
                        self.assertIn(label, nav)
                    self.assertIn(SD._e(labels[2]), nav)


class HeadTests(unittest.TestCase):
    def test_pn_head_from_pager_navigation(self):
        body = '<nav class="pnav"><a class="pv" rel="prev" href="/old/"><small>Previous</small></a><a class="nx" rel="next" href="/new/"><small>Next</small></a></nav>'
        self.assertEqual(HEAD["pn_head"](body),
                         '<link rel="prev" href="/old/"><link rel="next" href="/new/">')

    def test_pn_head_from_episode_pagination_and_hub_more(self):
        pagination = '<a href="/episodes/?page=1" rel=prev>1</a><a href="/episodes/?page=3" rel=next>3</a>'
        self.assertEqual(HEAD["pn_head"](pagination),
                         '<link rel="prev" href="/episodes/?page=1"><link rel="next" href="/episodes/?page=3">')
        hub = '<a id="hub-more" href="https://www.m365.fm/page/2/" rel=next>Mehr laden</a>'
        self.assertEqual(HEAD["pn_head"](hub), '<link rel="next" href="https://www.m365.fm/page/2/">')

    def test_pn_head_does_not_duplicate_existing_relation(self):
        body = '<nav class="pnav"><a class="pv" rel="prev" href="/old/"></a><a class="nx" rel="next" href="/new/"></a></nav>'
        self.assertEqual(HEAD["pn_head"](body, '<link rel="prev" href="/already/">'), "")
        self.assertEqual(HEAD["pn_head"](body, '<link rel="next" href="/already/">'), "")

    def test_font_preloads_have_desktop_mobile_pairs(self):
        links = re.findall(r'<link rel="preload"[^>]*>', HEAD["font_preloads"]())
        self.assertEqual(len(links), 6)
        by_font = {}
        for link in links:
            font = re.search(r"/([^/]+)-normal\.woff2", link).group(1)
            media = re.search(r'media="([^"]+)"', link)
            priority = re.search(r'fetchpriority="([^"]+)"', link)
            by_font.setdefault(font, []).append((media.group(1) if media else "", priority.group(1) if priority else ""))
        self.assertEqual(len(by_font), 4)
        self.assertEqual(by_font["barlow-latin-400"], [("", "")])
        self.assertEqual(by_font["barlow-condensed-latin-600"], [("", "")])
        for font in ("barlow-condensed-latin-500", "barlow-condensed-latin-700"):
            self.assertCountEqual(by_font[font], [
                ("(min-width: 701px)", ""),
                ("(max-width: 700px)", "low"),
            ])


class MentionTests(unittest.TestCase):
    def test_repo_mentions_render_list_sources_and_required_jsonld(self):
        data = json.loads((ROOT / "data" / "press_mentions.json").read_text("utf-8"))
        self.assertTrue(data["mentions"])
        for mention in data["mentions"]:
            with self.subTest(id=mention.get("id")):
                for field in ("title", "url", "date", "outlet"):
                    self.assertTrue(mention.get(field), field)
                self.assertIn(mention, MEN.for_entity("mirko-peters"))
                item = MEN.item_html(mention, "de")
                self.assertTrue(item.startswith("<li>"))
                self.assertIn(f'href="{MEN.E(mention["url"])}"', item)
                self.assertIn(MEN.E(mention["title"]), item)
                self.assertIn(f'<time datetime="{mention["date"]}">{mention["date"]}</time>', item)
                for lang, label in (("de", "Erwähnt in"), ("en", "Mentioned in")):
                    source = MEN.src_li(lang, "mirko-peters")
                    self.assertIn(f"{label}: <a", source)
                    self.assertIn(MEN.E(mention["title"]), source)
                    self.assertIn(MEN.E(mention["url"]), source)
                node = MEN.ld(mention, BASE)
                self.assertEqual(node["@type"], "CreativeWork")
                self.assertEqual(node["name"], mention["title"])
                self.assertEqual(node["url"], mention["url"])
                self.assertEqual(node["datePublished"], mention["date"])
                self.assertIn("publisher", node)
                self.assertEqual(node["publisher"]["@type"], "Organization")
                self.assertTrue(node["publisher"]["name"])


class PagerCheckerTests(unittest.TestCase):
    def tree(self, *, missing_target=False, nonreciprocal=False, wrong_hub_canonical=False, last_hub_next=False):
        tmp = tempfile.TemporaryDirectory()
        root = Path(tmp.name)

        def write(path, content):
            target = root / path.lstrip("/") / "index.html"
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content, "utf-8")

        older = f"{BASE}/show/episodes/older/"
        newer = f"{BASE}/show/episodes/newer/"

        def episode(canonical, nav):
            return f'<head><link rel="canonical" href="{BASE}{canonical}"></head>{nav}'

        old_nav = "" if nonreciprocal else f'<nav class="pnav"><a class="nx" rel="next" href="{newer}">New</a></nav>'
        missing_url = f"{BASE}/show/episodes/missing/" if missing_target else older
        write("/show/episodes/newer/", episode("/show/episodes/newer/",
              f'<nav class="pnav"><a class="pv" rel="prev" href="{missing_url}">Old</a></nav>'))
        write("/show/episodes/older/", episode("/show/episodes/older/", old_nav))

        write("", f'<head><link rel="next" href="{BASE}/page/2/"></head><a href="{BASE}/page/2/" rel=next>Mehr laden</a>')
        page2canonical = f"{BASE}/wrong/" if wrong_hub_canonical else f"{BASE}/page/2/"
        write("/page/2/", f'<head><link rel="canonical" href="{page2canonical}"><link rel="prev" href="{BASE}/"><link rel="next" href="{BASE}/page/3/"></head><nav class="pnav"></nav><div class="hub-card"></div>')
        next_rel = f'<link rel="next" href="{BASE}/page/4/">' if last_hub_next else ""
        write("/page/3/", f'<head><link rel="canonical" href="{BASE}/page/3/"><link rel="prev" href="{BASE}/page/2/">{next_rel}</head><nav class="pnav"></nav><div class="hub-card"></div>')
        return tmp, root

    def run_checker(self, root):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            code = check_pager.main([root])
        return code, output.getvalue()

    def test_valid_example_tree(self):
        tmp, root = self.tree()
        try:
            code, out = self.run_checker(root)
            self.assertEqual(code, 0, out)
            self.assertIn("ok: alle Ziele vorhanden", out)
        finally:
            tmp.cleanup()

    def test_missing_target_fails(self):
        tmp, root = self.tree(missing_target=True)
        try:
            code, out = self.run_checker(root)
            self.assertEqual(code, 1)
            self.assertIn("fehlt", out)
        finally:
            tmp.cleanup()

    def test_nonreciprocal_direction_fails_even_without_back_link(self):
        tmp, root = self.tree(nonreciprocal=True)
        try:
            code, out = self.run_checker(root)
            self.assertEqual(code, 1)
            self.assertIn("zeigt next auf None", out)
        finally:
            tmp.cleanup()

    def test_hub_with_wrong_canonical_fails(self):
        tmp, root = self.tree(wrong_hub_canonical=True)
        try:
            code, out = self.run_checker(root)
            self.assertEqual(code, 1)
            self.assertIn("canonical https://www.m365.fm/wrong/", out)
        finally:
            tmp.cleanup()

    def test_last_hub_page_with_next_fails(self):
        tmp, root = self.tree(last_hub_next=True)
        try:
            code, out = self.run_checker(root)
            self.assertEqual(code, 1)
            self.assertIn("letzte Seite mit rel=next", out)
        finally:
            tmp.cleanup()


if __name__ == "__main__":
    unittest.main()
