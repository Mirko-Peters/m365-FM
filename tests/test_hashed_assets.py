"""Skripte und Stylesheet mit Inhalts-Hash im Namen (site_assets.py, Ladezeit 27.11.2026, Punkt 3) und was der Site-Worker fuer den Preload-Header
braucht (Punkt 4): Name = Hash der geschriebenen Bytes, gleiche Regel wie HASHED in sitewrk/index.js, Dateien in docs/ UND r2out/, Seiten verweisen nur auf
gehashte Namen, ungehashte Dateien bleiben, alte gehashte Namen werden vom R2-Spiegel nie als entfernt markiert, Stylesheet mit data-sbar steht im Kopf
vor dem JSON-LD."""
import hashlib, json, re, shutil, sys, tempfile, unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tools")); sys.path.insert(0, str(ROOT / "tests"))
import site_assets as SA   # noqa: E402

PAGE_JS = ("page.js", "a11y.js", "attend.js", "fx.js")


def load_generate_site():
    import site_fetch
    with patch.object(site_fetch, "fetch", return_value=None):
        import generate_site
    return generate_site


class Naming(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp()); self.addCleanup(shutil.rmtree, self.tmp)
        self.old = (list(SA._DIRS), dict(SA._DONE)); self.addCleanup(self.restore)

    def restore(self):
        SA._DIRS[:] = self.old[0]; SA._DONE.clear(); SA._DONE.update(self.old[1])

    def test_regex_equals_worker(self):
        src = (ROOT / "sitewrk" / "index.js").read_text("utf-8")
        m = re.search(r"export const HASHED = /(.+)/i;", src); self.assertTrue(m, "HASHED in sitewrk/index.js")
        self.assertEqual(m.group(1).replace("\\/", "/"), SA.HASHED_RX.pattern, "gleiche Regel wie der Site-Worker")
        km = __import__("r2_common").HASHED_KEY
        self.assertEqual(km.pattern, "^pages" + SA.HASHED_RX.pattern[1:], "Spiegel-Regel = Worker-Regel mit pages/")

    def test_name_is_hash_of_bytes_and_matches_worker(self):
        d = "window.x=1;".encode()
        n = SA.hashed_name("wk-de.js", d)
        self.assertEqual(n, "wk-de." + hashlib.sha1(d).hexdigest()[:10] + ".js")
        self.assertTrue(SA.HASHED_RX.match("/assets/" + n))
        self.assertNotEqual(n, SA.hashed_name("wk-de.js", d + b" "), "neuer Inhalt -> neuer Name")
        for bad in ("../x.js", "a/b.js", "x.min.js", "x.txt", "X.js"):
            with self.assertRaises(ValueError, msg=bad): SA.hashed_name(bad, d)

    def test_no_plain_asset_name_is_immutable(self):
        """Kein ungehashter Name unter assets/ darf auf HASHED passen - sonst lieferte der Worker ihn ein Jahr unveraenderlich aus."""
        for f in (ROOT / "assets").rglob("*"):
            if f.is_file():
                self.assertFalse(SA.HASHED_RX.match("/assets/" + f.relative_to(ROOT / "assets").as_posix()), f.name)

    def test_put_writes_all_dirs_and_path_falls_back(self):
        SA.setup([])
        self.assertEqual(SA.path("page.js"), "/assets/page.js", "ohne Ziel: ungehashter Name (nichts geschrieben)")
        docs, r2 = self.tmp / "docs", self.tmp / "r2out"
        SA.setup([docs, r2])
        p = SA.path("page.js"); data = (ROOT / "assets" / "page.js").read_bytes()
        self.assertEqual(p, "/assets/" + SA.hashed_name("page.js", data))
        for d in (docs, r2): self.assertEqual((d / p.lstrip("/")).read_bytes(), data, d.name)
        self.assertEqual(SA.path("wk-xx.js"), "/assets/wk-xx.js", "erzeugte Datei ohne put: ungehashter Name (kein Verweis auf eine fehlende Datei)")
        q = SA.put("wk-xx.js", "window.M365WT={};")
        self.assertEqual(SA.path("wk-xx.js"), q); self.assertTrue((r2 / q.lstrip("/")).exists())
        self.assertEqual(SA.path("fehlt-nicht-da.js"), "/assets/fehlt-nicht-da.js")


class BuildOutput(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.G = load_generate_site()

    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp()); self.addCleanup(shutil.rmtree, self.tmp)
        self.old = (list(SA._DIRS), dict(SA._DONE)); self.addCleanup(self.restore)
        SA.setup([self.tmp / "docs", self.tmp / "r2out"])

    def restore(self):
        SA._DIRS[:] = self.old[0]; SA._DONE.clear(); SA._DONE.update(self.old[1])

    def render(self, body='<main><h1>T</h1><div class="viz"></div></main><footer></footer>'):
        G = self.G
        with patch.object(G, "SW_REG", []), patch.object(G, "OGLIST", []):
            return G.page("en", "Titel", "Beschreibung", G.BASE + "/x/", body)

    def test_page_references_only_hashed_scripts_and_css(self):
        h = self.render()
        srcs = re.findall(r'<script[^>]*\bsrc="([^"]+)"', h) + re.findall(r'<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"', h)
        own = [u for u in srcs if "/assets/" in u]
        self.assertTrue(own)
        for name in PAGE_JS + ("viz.js",):
            stem = name[:-3]
            hits = [u for u in own if re.search(rf"/assets/{re.escape(stem)}\.[0-9a-f]{{10}}\.js$", u)]
            self.assertEqual(len(hits), 1, f"{name} gehasht eingebunden: {own}")
            self.assertNotIn(f"/assets/{name}\"", h, f"kein ungehashter Verweis auf {name}")
        css = re.search(r'<link rel="stylesheet" href="([^"]+/assets/site\.[0-9a-f]{10}\.css)" data-sbar>', h); self.assertTrue(css, "Stylesheet mit Hash und data-sbar")
        for u in own:
            if re.search(r"/assets/[^/]+\.[0-9a-f]{10}\.(?:js|css)$", u):
                rel = u.split("/assets/", 1)[1]
                for d in ("docs", "r2out"): self.assertTrue((self.tmp / d / "assets" / rel).is_file(), f"{rel} in {d}/")
                self.assertTrue(SA.HASHED_RX.match("/assets/" + rel))
        js = (self.tmp / "docs" / "assets" / re.search(r"/assets/(page\.[0-9a-f]{10}\.js)", h).group(1)).read_bytes()
        self.assertEqual(js, (ROOT / "assets" / "page.js").read_bytes(), "Inhalt unveraendert")

    def test_css_bundle_also_in_r2out(self):
        u = re.search(r'href="[^"]+(/assets/site\.[0-9a-f]{10}\.css)"', self.G.css_link()).group(1)
        a, b = (self.tmp / "docs" / u.lstrip("/")).read_bytes(), (self.tmp / "r2out" / u.lstrip("/")).read_bytes()
        self.assertEqual(a, b); self.assertEqual(u, "/assets/site." + hashlib.sha1(a).hexdigest()[:10] + ".css", "Name = Hash des Inhalts (wie vor dem 27.11.)")

    def test_preload_sources_before_jsonld(self):
        """Site-Worker (withPreload) liest den Kopf bis </head>, hoechstens 64 KiB; reicht der Kopf weiter (grosses JSON-LD), zaehlt das Gelesene.
        Das klappt, weil Stylesheet (data-sbar) und LCP-Bild-Preload vor dem JSON-LD stehen und frueh im Dokument."""
        G = self.G
        with patch.object(G, "SW_REG", []), patch.object(G, "OGLIST", []):
            h = G.page("en", "Titel", "Beschreibung", G.BASE + "/x/", "<main><h1>T</h1></main><footer></footer>", jsonld=[{"@context": "https://schema.org", "@type": "Thing", "name": "y" * 100000}])
        head = h.split("</head>", 1)[0]
        i_css = head.find("data-sbar>"); i_ld = head.find("application/ld+json")
        self.assertGreater(i_css, 0); self.assertGreater(i_ld, i_css, "Stylesheet vor dem JSON-LD")
        self.assertLess(len(head[:i_css].encode("utf-8")), 32768, "Stylesheet in den ersten 32 KiB")
        self.assertNotIn("<body", head)
        self.assertGreater(len(head.encode("utf-8")), 65536, "Kopf hier laenger als die Lesegrenze des Workers")

    def test_wiki_scripts_hashed(self):
        import site_learn as L
        out = {}
        L.write_wk_js(lambda rel, c: out.__setitem__(rel, c), "de", {"a": ["A", "https://www.m365.fm/de/entity/a/"]})
        self.assertIn("assets/wk-de.js", out, "ungehashte Datei bleibt (alte Seiten)")
        b = L.wiki_block("de", "a", "https://api", "https://www.m365.fm", None)
        m = re.search(r'src="https://www\.m365\.fm/assets/(wk-de\.[0-9a-f]{10}\.js)"', b); self.assertTrue(m, b[-300:])
        self.assertEqual((self.tmp / "r2out" / "assets" / m.group(1)).read_text("utf-8"), out["assets/wk-de.js"])
        self.assertRegex(b, r'src="https://www\.m365\.fm/assets/wiki\.[0-9a-f]{10}\.js"')
        self.assertNotIn("/assets/wk-de.js\"", b)

    def test_entity_script_hashed(self):
        src = (ROOT / "site_entities.py").read_text("utf-8")
        self.assertNotIn("/assets/entity.js", src.replace("assets/entity.js (", ""), "entity.js nur ueber SA.path")
        self.assertEqual(src.count('SA.path("entity.js")'), 2)


class MirrorKeepsHashed(unittest.TestCase):
    """r2_site_sync markiert alte gehashte Dateien nie als entfernt: eine gecachte Seite mit dem alten Namen bekommt ihr Skript weiter aus R2."""
    def test_hashed_key_never_candidate(self):
        import test_r2_pages_upload as T
        t = T.SyncTest("test_tombstone_own_objects_only_and_revive"); t.setUp()
        try:
            T.tree(t.docs, {f"p{i}/index.html": str(i) for i in range(10)})
            T.tree(t.docs, {"assets/page.0123abcd45.js": "alt()", "assets/page.js": "neu()", "assets/x.txt": "t"})
            t.keys.write_text(json.dumps(["pages/pl/x/index.html"]))
            self.assertEqual(t.sync(), 0)
            for f in ("assets/page.0123abcd45.js", "assets/x.txt"): (t.docs / f).unlink()
            T.tree(t.docs, {"assets/page.fedcba9876.js": "neu()"})
            self.assertEqual(t.sync(), 0)
            self.assertFalse(t.s3.gone("pages/assets/page.0123abcd45.js"), "alter gehashter Name bleibt auslieferbar")
            self.assertTrue(t.s3.gone("pages/assets/x.txt"), "andere entfernte Dateien wie bisher markiert")
            self.assertNotIn("pages/assets/page.0123abcd45.js", json.loads(t.s3.obj["meta/gone.json"]["body"]))
        finally:
            t.tearDown() if hasattr(t, "tearDown") else None


if __name__ == "__main__":
    unittest.main()
