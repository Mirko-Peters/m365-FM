"""Community-Seite (/community/): Plaetze, sofort geladene Skripte, Nachladen der Bereichs-Skripte (assets/community-lazy.js), ?v=, Preconnect, CLS.
Die Einteilung (sofort / beim Reiter / nach dem Laden) wird gegen den Quelltext der Skripte geprueft, nicht geraten."""
import hashlib
import json
import re
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_community_page as CPG  # noqa: E402

BASE, API = "https://www.m365.fm", "https://api-dub.m365.fm"
# Bis 11/2026 standen diese Skripte als defer im HTML der Community-Seite (Reihenfolge wie damals)
OLD = ["entity-match.js", "profile.js", "mvp-tracker.js", "events.js", "events-import.js", "events-entity.js", "editor.js", "seo.js", "credits.js",
       "notes.js", "blog.js", "blogdomain.js", "blogimport.js", "podcast.js", "shows.js", "video.js", "library.js", "guests.js", "feeditems.js",
       "wish.js", "mailprefs.js", "messages.js"]


def cv(*names):
    h = hashlib.sha1()
    for n in names:
        h.update((ROOT / n).read_bytes())
    return h.hexdigest()[:8]


def src(name):
    return (ROOT / "assets" / name).read_text("utf-8")


def build(lang="de"):
    return CPG.build(lang, "Profil", base=BASE, api=API, cv=cv, header="<header>H</header>", footer="<footer>F</footer>", community_tags="<!--ct-->")


def config(body):
    return json.loads(re.search(r"<script>window\.M365LZ=(\[.*?\])</script>", body).group(1))


def name_of(url):
    return url.split("/assets/", 1)[1].split("?", 1)[0]


def tabs():
    """Plaetze mit Reiter (profile.js T0) und Unterbereiche eines Reiters (SUB): profile.js blendet sie aus, solange ihr Reiter nicht offen ist."""
    p = src("profile.js")
    t0 = p[p.index("T0 = ["):p.index("var bar")]
    sub = re.search(r"var SUB = (\{[^}]*\})", p).group(1)
    return set(re.findall(r'\["(c-[a-z-]+)"', t0)), set(json.loads(sub))


class CommunityPage(unittest.TestCase):
    def test_places_in_order_and_main_reserves_the_viewport(self):
        body, _ = build()
        self.assertIn('<main class="wrap" style="max-width:48em;min-height:100vh"><h1 id="c-h1">Profil</h1>', body)
        self.assertIn("".join(f'<div id="{i}"></div>' for i in CPG.SECTIONS) + "</main>", body)
        self.assertEqual(len(CPG.SECTIONS), 19)
        self.assertLess(body.index("<footer>"), body.index("<!--ct-->"))
        self.assertIn('<script>window.M365X={api:"https://api-dub.m365.fm",base:"https://www.m365.fm",lang:"de"}</script>', body)

    def test_only_tabs_and_profile_scripts_in_html_all_with_hash(self):
        body, _ = build()
        tags = re.findall(r'<script defer src="([^"]+)"></script>', body)
        self.assertEqual([name_of(u) for u in tags], ["entity-match.js", "profile.js", "community-lazy.js"])
        for u in tags + [x for g in config(body) for x in g["js"] + g["css"]]:
            n = name_of(u)
            self.assertTrue((ROOT / "assets" / n).exists(), n)
            self.assertEqual(u, f"{BASE}/assets/{n}?v={cv('assets/' + n)}")
        # Reihenfolge: M365X vor allen Skripten, Konfiguration vor dem Lader, Lader nach profile.js (Reiter sind dann gesetzt)
        self.assertLess(body.index("window.M365X="), body.index("entity-match.js"))
        self.assertLess(body.index("profile.js"), body.index("window.M365LZ="))
        self.assertLess(body.index("window.M365LZ="), body.index("community-lazy.js"))

    def test_every_former_script_still_loads_exactly_once_per_group_order(self):
        body, _ = build()
        lazy = [name_of(u) for g in config(body) for u in g["js"]]
        self.assertEqual(sorted(set(lazy) | set(CPG.EAGER)), sorted(OLD))
        self.assertFalse(set(lazy) & set(CPG.EAGER))
        first = list(dict.fromkeys(list(CPG.EAGER) + lazy))   # Reihenfolge, in der sie hoechstens laufen koennen = wie vorher
        self.assertEqual(first, OLD)
        for g in config(body):
            self.assertEqual(len(g["js"]), len(set(g["js"])))

    def test_each_group_is_triggered_by_the_place_its_scripts_render_into(self):
        for ids, js, _css, _when in CPG.GROUPS:
            for n in js:
                if n in CPG.LIB and n != "events.js":
                    continue   # editor/seo/credits haben keinen eigenen Platz (Bausteine an M365U)
                roots = set(re.findall(r'getElementById\("(c-[a-z-]+)"\)', src(n)))
                self.assertTrue(roots, n)
                if n == "events.js":   # Abhaengigkeit fremder Gruppen: rendert immer nur in #c-events
                    self.assertEqual(roots, {"c-events"})
                    continue
                self.assertTrue(roots <= set(ids), (n, roots, ids))

    def test_m365u_dependencies_come_first(self):
        self.assertIn("window.M365U = {", src("events.js"))
        for _ids, js, _css, _when in CPG.GROUPS:
            for i, n in enumerate(js):
                s = src(n)
                if re.search(r"\bU = window\.M365U\b[^\n]*?\n?[^\n]*?if \([^)]*!U\b", s[:1500]):   # bricht ohne M365U ab
                    self.assertIn("events.js", js[:i], n)
                for lib, need in (("editor.js", "U.editor"), ("seo.js", "U.seo"), ("credits.js", "U.credits")):
                    if need in s and n != lib:
                        self.assertIn(lib, js[:i], (n, lib))
        for n in ("editor.js", "seo.js", "credits.js"):
            self.assertRegex(src(n)[:600], r"var U = window\.M365U; if \(!U\) return;")

    def test_view_groups_are_tabs_idle_groups_have_no_tab_and_need_sign_in(self):
        t0, sub = tabs()
        for ids, js, _css, when in CPG.GROUPS:
            if when == "view":
                self.assertTrue(set(ids) <= t0 | sub, ids)   # ausgeblendet, bis der Reiter offen ist
            else:
                self.assertEqual(when, "idle")
                self.assertFalse(set(ids) & (t0 | sub), ids)   # immer sichtbar ...
                s = src(js[-1])
                self.assertIn('api("/api/me")', s)   # ... zeigt aber nur angemeldet etwas
                self.assertTrue(any(p in s for p in ("var me = r.j && r.j.user; if (!me) return;", "if (me) load();", "if (!(r.j && r.j.user)) return;")), js[-1])
        # #c-page (Anmeldung/Konto, LCP) und #c-expert (profile.js) laden sofort
        lazy_ids = {i for ids, *_ in CPG.GROUPS for i in ids}
        self.assertEqual(set(CPG.SECTIONS) - lazy_ids, {"c-page", "c-expert"})

    def test_mvp_css_comes_with_the_tracker_and_preconnect_to_api(self):
        body, head = build()
        self.assertEqual(head, f'<link rel="preconnect" href="{API}">')
        self.assertNotIn("mvp-tracker.css", head)
        self.assertNotIn('rel="stylesheet"', body)
        mvp = [g for g in config(body) if g["ids"] == ["c-mvp"]][0]
        self.assertEqual([name_of(u) for u in mvp["css"]], ["mvp-tracker.css"])
        self.assertEqual([name_of(u) for u in mvp["js"]], ["mvp-tracker.js"])
        self.assertTrue(all(not g["css"] for g in config(body) if g["ids"] != ["c-mvp"]))
        # community.js fragt beim Laden /api/me (Inhalt von #c-page): Preconnect lohnt sich
        self.assertIn('if ((el = document.getElementById("c-page"))) mountPage(el);', src("community.js"))

    def test_no_script_end_tag_in_config(self):
        body, _ = build()
        cfg = re.search(r"<script>window\.M365LZ=(.*?)</script>", body).group(1)
        self.assertNotIn("</", cfg)


class CommunityPageInBuild(unittest.TestCase):
    """Die echte Seite aus generate_site.page(): Preconnect im <head>, kein mvp-tracker.css mehr dort, alle Sprachen gleich aufgebaut."""
    @classmethod
    def setUpClass(cls):
        import site_fetch
        with patch.object(site_fetch, "fetch", return_value=None):
            import generate_site
        cls.G = generate_site

    def test_page(self):
        G = self.G
        self.assertIn("CPG.build(l, esc(ct)", (ROOT / "generate_site.py").read_text("utf-8"))
        with patch.object(G, "css_link", return_value=""), patch.object(G, "SW_REG", []), patch.object(G, "OGLIST", []):
            for lang in ("en", "de", "pl"):
                b, eh = CPG.build(lang, "Profile", base=G.BASE, api=G.COMMUNITY_API, cv=G._cv, header="<header></header>", footer="<footer></footer>",
                                  community_tags=G.community_tags(lang))
                h = G.page(lang, "Profile – M365.FM", "Profile", f"{G.BASE}/community/", b, og_type="website", extra_head=G.LRN.WCSS + eh, noindex=True)
                head = h.split("</head>", 1)[0]
                self.assertIn(f'<link rel="preconnect" href="{G.COMMUNITY_API}">', head)
                self.assertNotIn("mvp-tracker.css", h.split("window.M365LZ=", 1)[0])
                self.assertIn("/assets/community-lazy.js?v=", h)
                self.assertEqual(h.count("<main"), 1)


if __name__ == "__main__":
    unittest.main()
