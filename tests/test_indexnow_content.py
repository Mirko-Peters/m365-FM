import json, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from content_hash import content_hash, indexnow_select

PAGE = ('<html><body><header>Nav 12 Folgen</header><main><h1>Titel</h1><article><p>Text eins <a href="/a/?v=1">Link</a></p></article>'
        '<div class="ad"><ins class="adsbygoogle">x</ins></div></main><aside class="sbar"><ol><li>Folge A</li></ol></aside>'
        '<footer>aktualisiert vor 3 Stunden</footer></body></html>')


class IndexNow(unittest.TestCase):
    def test_sidebar_only_same_hash(self):
        b = PAGE.replace("Folge A", "Folge B neu").replace("vor 3 Stunden", "vor 5 Stunden").replace("12 Folgen", "13 Folgen").replace("?v=1", "?v=2").replace(">x<", ">y<")
        self.assertEqual(content_hash(PAGE), content_hash(b))

    def test_article_change_differs(self):
        self.assertNotEqual(content_hash(PAGE), content_hash(PAGE.replace("Text eins", "Text zwei")))

    def test_select(self):
        old = {"/a/": "1", "/b/": "1", "/c/": "1", "/gone/": "1", "/assets/x.js": "1"}
        new = {"/a/": "2", "/b/": "2", "/c/": "1", "/neu/": "1", "/assets/x.js": "2"}
        oc = {"/a/": "h", "/b/": "h", "/c/": "h", "/gone/": "h"}
        nc = {"/a/": "h", "/b/": "h2", "/c/": "h", "/neu/": "n"}
        sel, st = indexnow_select(old, new, oc, nc)
        self.assertEqual(sel, ["/neu/", "/gone/", "/b/"])
        self.assertEqual((st["new"], st["removed"], st["content"], st["boilerplate"]), (1, 1, 1, 1))

    def test_first_run_seeds(self):
        sel, st = indexnow_select({"/a/": "1"}, {"/a/": "2"}, {}, {"/a/": "h"})
        self.assertEqual(sel, []); self.assertTrue(st["seed"])

    def test_cap(self):
        nc = {f"/p{i}/": "x" for i in range(5)}
        sel, st = indexnow_select({"/z/": "1"}, {u: "1" for u in nc}, {"/z/": "h"}, nc, cap=3)
        self.assertEqual(len(sel), 3); self.assertEqual(st["capped"], 3)

    def test_page_hashes_cli(self):
        with tempfile.TemporaryDirectory() as d:
            d = Path(d); (d / "docs" / "x").mkdir(parents=True); (d / "docs" / "x" / "index.html").write_text(PAGE, "utf-8")
            subprocess.run([sys.executable, str(ROOT / "tools" / "page_hashes.py"), str(d / "docs"), str(d / "p.json"), str(d / "c.json")], check=True, capture_output=True)
            self.assertEqual(json.loads((d / "c.json").read_text()), {"/x/": content_hash(PAGE)})


if __name__ == "__main__":
    unittest.main()
