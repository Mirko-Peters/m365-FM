"""tools/spreaker_urls.py: Zuordnung, Weiterleitungen in einem Schritt, Umschreiben nur von m365.fm-Links, Probelauf/Apply, Wiederaufnahme."""
import json, sys, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tools"))
import site_links as SL            # noqa: E402
import site_episode_urls as SEU    # noqa: E402
import spreaker_urls as U          # noqa: E402

BASE = "https://www.m365.fm"
TABLE = {"/m365-fm-podcast/copilot-agents-explained": "/show/episodes/copilot-agents-explained/",
         "/de/show/episodes/copilot-agenten": "/de/copilot-agenten-einfach-erklaert/",
         "/blog/old-post": "/show/blog/new-post/", "/show/blog/new-post": "/show/blog/final-post/"}
PAGES = {"1": {"show_id": 6704921, "lang": "en", "slug": "copilot-agents-explained", "url": f"{BASE}/show/episodes/copilot-agents-explained/"},
         "2": {"show_id": 7393187, "lang": "de", "slug": "copilot-agenten-einfach-erklaert", "url": f"{BASE}/de/copilot-agenten-einfach-erklaert/"},
         "3": {"show_id": 7393243, "lang": "pt", "slug": "pare-de-criar-aplicativos", "url": f"{BASE}/pt/pare-de-criar-aplicativos/"}}


def res(): return SL.Resolver(dict(TABLE), SL.Site())


class Fake:
    def __init__(self, eps):
        self.eps, self.posts = eps, []
    def paged(self, path):
        sid = int(path.split("/")[2])
        return [{"episode_id": e["episode_id"]} for e in self.eps.values() if e["show"] == sid]
    def req(self, method, path, **kw):
        eid = path.rsplit("/", 1)[1]
        if method == "GET": return {"episode": {k: v for k, v in self.eps[eid].items() if k != "show"}}
        self.posts.append((eid, kw["data"])); self.eps[eid].update(kw["data"]); return {"episode": {}}


def ep(i, show, link, html, vis="PUBLIC", title="T"):
    return {"episode_id": i, "show": show, "episode_link": link, "description_html": html, "published_at": "2025-01-01 10:00:00", "visibility": vis, "title": title}


class Mapping(unittest.TestCase):
    def test_urls(self):
        self.assertEqual(SEU.episode_url(BASE, "en", "x-y"), f"{BASE}/show/episodes/x-y/")
        self.assertEqual(SEU.episode_url(BASE, "de", "x-y"), f"{BASE}/de/x-y/")
        self.assertEqual(SEU.dub_url(BASE, "pt", "Pare de criar aplicativos (Teste)", "AbC_123"), f"{BASE}/pt/pare-de-criar-aplicativos/")
        self.assertEqual(SEU.dub_url(BASE, "ja", "短い", "AbC_123"), f"{BASE}/ja/abc-123/")

    def test_build_mapping(self):
        m = SEU.build_mapping(BASE, [{"sid": 1, "slug": "a-b"}], [("de", {"eid": 2, "slug": "c"})], {"de": 7393187}, "2026-11-09")
        self.assertEqual([(r["spreaker_episode_id"], r["show_id"], r["url"]) for r in m["items"]], [("1", 6704921, f"{BASE}/show/episodes/a-b/"), ("2", 7393187, f"{BASE}/de/c/")])


class Resolve(unittest.TestCase):
    def test_one_hop_chain(self):
        self.assertEqual(U.final_url("https://m365.fm/blog/old-post/", res()), f"{BASE}/show/blog/final-post/")
        self.assertEqual(U.final_url("https://dub.m365.fm/m365-fm-podcast/copilot-agents-explained", res()), f"{BASE}/show/episodes/copilot-agents-explained/")

    def test_export_has_no_redirect(self):
        d = tempfile.mkdtemp(); out = Path(d) / "m.json"
        pages = {"9": {"show_id": 1, "lang": "en", "slug": "s", "url": f"{BASE}/m365-fm-podcast/copilot-agents-explained"}}
        U.export_mapping(pages, res(), out)
        self.assertEqual(json.loads(out.read_text())["items"][0]["url"], f"{BASE}/show/episodes/copilot-agents-explained/")


class Rewrite(unittest.TestCase):
    def test_only_m365_links(self):
        html = ('<b>Hör rein</b> <a href="https://www.m365.fm/m365-fm-podcast/copilot-agents-explained?utm_source=x">Folge</a> '
                '<a href="https://example.com/m365-fm-podcast/copilot-agents-explained">fremd</a> Text https://m365.fm/blog/old-post/. <ul><li>A &amp; B</li></ul>')
        new, ch = U.rewrite_text(html, PAGES["1"]["url"], "copilot-agents-explained", res())
        self.assertIn(f'href="{BASE}/show/episodes/copilot-agents-explained/?utm_source=x"', new)
        self.assertIn('href="https://example.com/m365-fm-podcast/copilot-agents-explained"', new)
        self.assertIn(f"Text {BASE}/show/blog/final-post/. <ul><li>A &amp; B</li></ul>", new)
        self.assertEqual(len(ch), 2)
        self.assertEqual(new.replace(BASE + "/show/episodes/copilot-agents-explained/?utm_source=x", "").count("m365.fm"), 1)

    def test_unchanged_is_identical(self):
        h = f'<a href="{BASE}/de/copilot-agenten-einfach-erklaert/">x</a> <i>keine Links</i>'
        self.assertEqual(U.rewrite_text(h, PAGES["2"]["url"], PAGES["2"]["slug"], res()), (h, []))

    def test_language_old_address_to_canonical(self):
        new, _ = U.rewrite_text(f'<a href="{BASE}/de/show/episodes/copilot-agenten">x</a>', PAGES["2"]["url"], PAGES["2"]["slug"], res())
        self.assertIn(f'"{BASE}/de/copilot-agenten-einfach-erklaert/"', new)


def world():
    return {"1": ep("1", 6704921, "https://www.m365.fm/m365-fm-podcast/copilot-agents-explained", '<a href="https://www.m365.fm/m365-fm-podcast/copilot-agents-explained">Seite</a>', title="Keep"),
            "2": ep("2", 7393187, "https://www.m365.fm/de/show/episodes/copilot-agenten", "Text"),
            "3": ep("3", 7393243, PAGES["3"]["url"], "ok"),
            "4": ep("4", 7393243, "https://www.m365.fm/", "x"),                       # keine Seite
            "5": ep("5", 7393187, "", "x", vis="PRIVATE")}                              # Entwurf/privat


class Modes(unittest.TestCase):
    def pages(self): return dict(PAGES, **{"5": {"show_id": 7393187, "lang": "de", "slug": "z", "url": f"{BASE}/de/z/"}})

    def test_plan_dry(self):
        sp, lines = Fake(world()), []
        rows = U.run_plan(sp, self.pages(), res(), [6704921, 7393187, 7393243], out=lines.append)
        st = {r["id"]: r["status"] for r in rows}
        self.assertEqual(st, {"1": "differs", "2": "differs", "3": "ok", "4": "missing", "5": "skipped"})
        self.assertEqual(sp.posts, [])
        self.assertTrue(any("ohne Seite" in l and "4" in l for l in lines))

    def test_apply_only_urls_resumable(self):
        d = Path(tempfile.mkdtemp()); lg = d / "l.tsv"
        sp = Fake(world())
        rows, n = U.run_apply(sp, self.pages(), res(), [6704921, 7393187, 7393243], limit=1, pause=0, log_path=lg, out=lambda *_: 0)
        self.assertEqual(n, 1); self.assertEqual(len(sp.posts), 1)
        rows, n = U.run_apply(sp, self.pages(), res(), [6704921, 7393187, 7393243], limit=10, pause=0, log_path=lg, out=lambda *_: 0)
        self.assertEqual(n, 1)                      # nur die zweite; die erste wird nicht noch einmal geschrieben
        rows, n = U.run_apply(sp, self.pages(), res(), [6704921, 7393187, 7393243], limit=10, pause=0, log_path=lg, out=lambda *_: 0)
        self.assertEqual(n, 0); self.assertEqual(len(sp.posts), 2)
        for _, data in sp.posts: self.assertLessEqual(set(data), {"episode_link", "description_html", "description"})
        self.assertEqual(sp.eps["1"]["title"], "Keep"); self.assertEqual(sp.eps["5"]["episode_link"], "")
        self.assertEqual(sp.eps["1"]["episode_link"], PAGES["1"]["url"])
        self.assertIn(PAGES["1"]["url"], sp.eps["1"]["description_html"])
        self.assertEqual(len(U.read_log(lg)), 2)

    def test_state(self):
        d = Path(tempfile.mkdtemp()); rows = U.run_plan(Fake(world()), self.pages(), res(), [6704921], out=lambda *_: 0)
        U.save_state(rows, {"at": "t"}, d / "s.json")
        self.assertEqual(json.loads((d / "s.json").read_text())["episodes"]["1"]["s"], "differs")


if __name__ == "__main__":
    unittest.main()
