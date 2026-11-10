"""tools/spreaker_urls.py: Zuordnung, Weiterleitungen in einem Schritt, Umschreiben nur von m365.fm-Links, Probelauf/Apply, Wiederaufnahme."""
import json, os, re, sys, tempfile, unittest
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
    def __init__(self, eps, fail=None, fail_show=None):
        self.eps, self.posts, self.fail, self.fail_show = eps, [], fail or {}, fail_show
    def paged(self, path):
        sid = int(path.split("/")[2])
        if sid == self.fail_show: raise RuntimeError("Spreaker GET liste: 503")
        return [{"episode_id": e["episode_id"]} for e in self.eps.values() if e["show"] == sid]
    def req(self, method, path, **kw):
        eid = path.rsplit("/", 1)[1]
        if method == "GET" and eid in self.fail: raise self.fail[eid]
        if method == "GET": return {"episode": {k: v for k, v in self.eps[eid].items() if k != "show"}}
        self.posts.append((eid, kw["data"])); self.eps[eid].update(kw["data"]); return {"episode": {}}


OK200 = lambda u: 200   # noqa: E731  Zielseite antwortet (kein Netz im Test)


def page_html(vid):
    """Kopf einer Dub-Folgenseite wie generate_site._jsonld_script (JSON-LD des VideoObject)."""
    return '<script type="application/ld+json">' + json.dumps({"@type": "VideoObject", "contentUrl": f"https://www.youtube.com/watch?v={vid}"}, ensure_ascii=False) + "</script>"


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

    def test_guest_entity_with_episode_slug_stays(self):
        """F2: Folgen-Slug = Name des Gastes - /entity/<slug>/ ist der Gast, nicht die Folge, und bleibt Byte fuer Byte."""
        can = f"{BASE}/show/episodes/adrian-espes/"
        q = "?utm_source=podcast&amp;utm_medium=shownotes&amp;utm_campaign=adrian-espes"
        h = (f'<a href="{BASE}/entity/adrian-espes/{q}">Adrian</a> <a href="{BASE}/de/entity/adrian-espes/">de</a> '
             f'<a href="{BASE}/community/u/adrian-espes">Profil</a> <a href="{can}{q}">Folge</a>')
        self.assertEqual(U.rewrite_text(h, can, "adrian-espes", res()), (h, []))
        new, ch = U.rewrite_text(f'<a href="https://m365.fm/m365-fm-podcast/adrian-espes{q}">alt</a>', can, "adrian-espes", res())
        self.assertEqual(ch, [(f"https://m365.fm/m365-fm-podcast/adrian-espes{q}", f"{can}{q}")])

    def test_dub_own_paths_only_in_its_language(self):
        """Sprachfolge: /<sprache>/<slug> und /<sprache>/show/episodes/<slug> sind eigene Pfade; die englische Folge gleichen Slugs nicht."""
        can, slug = f"{BASE}/de/copilot-agenten-einfach-erklaert/", "copilot-agenten-einfach-erklaert"
        self.assertTrue(U.is_own_page(f"{BASE}/de/show/episodes/{slug}", can, slug, res()))
        self.assertTrue(U.is_own_page(f"https://dub.m365.fm/de/{slug}", can, slug, res()))
        self.assertFalse(U.is_own_page(f"{BASE}/show/episodes/{slug}/", can, slug, res()))
        self.assertFalse(U.is_own_page(f"{BASE}/fr/{slug}/", can, slug, res()))
        self.assertFalse(U.is_own_page(f"{BASE}/entity/{slug}/", can, slug, res()))

    @unittest.skipUnless((ROOT / "shownotes" / "spreaker" / "74753075.html").exists() or os.environ.get("SHOWNOTES_DIR"), "shownotes/ nicht ausgecheckt")
    def test_real_shownotes_keep_guest_links(self):
        """F2 mit echten Show Notes: die 12 Folgen, deren Slug der Gastname ist, verlieren keinen Gast-/Entitaetslink."""
        d = Path(os.environ.get("SHOWNOTES_DIR") or ROOT / "shownotes") / "spreaker"
        ids = "73192525 73819585 74084199 74138955 74640221 74711575 74728795 74753075 74870393 75327523 75328001 75473689".split()
        r0 = SL.Resolver({}, SL.Site())
        for eid in ids:
            f = d / f"{eid}.html"
            if not f.exists(): continue
            h = f.read_text("utf-8"); slug = re.search(r"utm_campaign=([a-z0-9-]+)", h).group(1)
            self.assertIn(f"/entity/{slug}/", h)
            _, ch = U.rewrite_text(h, f"{BASE}/show/episodes/{slug}/", slug, r0)
            self.assertEqual([c for c in ch if "/show/episodes/" not in c[0]], [], eid)

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
        kw = dict(pause=0, log_path=lg, out=lambda *_: 0, check=OK200, backup_dir=d / "bk")
        rows, n = U.run_apply(sp, self.pages(), res(), [6704921, 7393187, 7393243], limit=1, **kw)
        self.assertEqual(n, 1); self.assertEqual(len(sp.posts), 1)
        rows, n = U.run_apply(sp, self.pages(), res(), [6704921, 7393187, 7393243], limit=10, **kw)
        self.assertEqual(n, 1)                      # nur die zweite; die erste wird nicht noch einmal geschrieben
        rows, n = U.run_apply(sp, self.pages(), res(), [6704921, 7393187, 7393243], limit=10, **kw)
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
        e = json.loads((d / "s.json").read_text())["episodes"]["1"]   # Titel und abweichende Felder fuer die Listen im Admin-Reiter
        self.assertEqual(e["t"], "Keep"); self.assertTrue(e["f"]); self.assertLessEqual(set(e["f"]), {"episode_link", "description_html"})


class Safety(unittest.TestCase):
    """F2/F3/F5/F6: Sicherung vor dem Schreiben, Zeitplan nur mit Freigabe und nur Feld Website, Lesefehler je Folge, Ziel muss 200 liefern."""
    shows = [6704921, 7393187, 7393243]
    def pages(self): return dict(PAGES, **{"5": {"show_id": 7393187, "lang": "de", "slug": "z", "url": f"{BASE}/de/z/"}})

    def test_backup_before_post(self):
        d = Path(tempfile.mkdtemp()); sp = Fake(world()); orig = dict(sp.eps["1"])
        U.run_apply(sp, self.pages(), res(), self.shows, pause=0, log_path=d / "l.tsv", out=lambda *_: 0, check=OK200, backup_dir=d / "bk")
        b = json.loads((d / "bk" / "urls-1.json").read_text())
        self.assertEqual(b["versions"][0]["description_html"], orig["description_html"])
        self.assertEqual(b["versions"][0]["episode_link"], orig["episode_link"])
        self.assertTrue((d / "bk" / "urls-2.json").exists()); self.assertFalse((d / "bk" / "urls-3.json").exists())
        U.backup(dict(orig, episode_id="1"), ["episode_link"], d / "bk")   # dieselbe Fassung nicht doppelt
        self.assertEqual(len(json.loads((d / "bk" / "urls-1.json").read_text())["versions"]), 1)

    def test_backup_failure_blocks_post(self):
        d = Path(tempfile.mkdtemp()); (d / "bk").write_text("keine Mappe"); sp = Fake(world())
        rows, n = U.run_apply(sp, self.pages(), res(), self.shows, pause=0, log_path=d / "l.tsv", out=lambda *_: 0, check=OK200, backup_dir=d / "bk")
        self.assertEqual(sp.posts, []); self.assertEqual(n, 0)

    def test_auto_needs_approval_file(self):
        d = Path(tempfile.mkdtemp())
        self.assertEqual(U.effective_mode("auto", d / "APPROVED"), ("plan", False))
        (d / "APPROVED").write_text("")
        self.assertEqual(U.effective_mode("auto", d / "APPROVED"), ("apply", True))
        self.assertEqual(U.effective_mode("apply", d / "nein"), ("apply", False))

    def test_main_auto_without_approval_writes_nothing(self):
        d = Path(tempfile.mkdtemp()); m = d / "map.json"
        m.write_text(json.dumps({"items": [dict(v, spreaker_episode_id=k) for k, v in self.pages().items()]}))
        sp = Fake(world()); old = U.APPROVED; U.APPROVED = d / "SPREAKER_URLS_APPROVED"
        try:
            self.assertEqual(U.main(["auto", "--ids", "1,2,3", "--map", str(m), "--redirects", "", "--no-state", "--read-pause", "0"], sp=sp), 0)
        finally:
            U.APPROVED = old
        self.assertEqual(sp.posts, [])

    def test_link_only_leaves_description(self):
        d = Path(tempfile.mkdtemp()); w = world()
        w["3"]["description_html"] = '<a href="https://www.m365.fm/blog/old-post/">x</a>'   # nur die Beschreibung weicht ab
        sp = Fake(w)
        rows, n = U.run_apply(sp, self.pages(), res(), self.shows, pause=0, log_path=d / "l.tsv", out=lambda *_: 0, check=OK200, backup_dir=d / "bk", link_only=True)
        self.assertEqual(sorted(e for e, _ in sp.posts), ["1", "2"])
        for _, data in sp.posts: self.assertEqual(set(data), {"episode_link"})
        st = {r["id"]: r["status"] for r in rows}
        self.assertEqual(st["3"], "differs"); self.assertEqual(st["1"], "differs")   # Beschreibung von 1 wartet auf einen Lauf von Hand
        self.assertEqual(sp.eps["1"]["episode_link"], PAGES["1"]["url"]); self.assertNotIn(PAGES["1"]["url"], sp.eps["1"]["description_html"])

    def test_target_not_200_no_write(self):
        d = Path(tempfile.mkdtemp()); sp = Fake(world())
        rows, n = U.run_apply(sp, self.pages(), res(), self.shows, pause=0, log_path=d / "l.tsv", out=lambda *_: 0, check=lambda u: 404, backup_dir=d / "bk")
        self.assertEqual((sp.posts, n), ([], 0)); self.assertEqual(U.read_log(d / "l.tsv")["1"]["status"], "target_not_200")

    def test_read_error_does_not_stop_run(self):
        d = Path(tempfile.mkdtemp()); sp = Fake(world(), fail={"1": RuntimeError("Spreaker GET /episodes/1: 404")}, fail_show=7393243)
        rows, n = U.run_apply(sp, self.pages(), res(), self.shows, pause=0, log_path=d / "l.tsv", out=lambda *_: 0, check=OK200, backup_dir=d / "bk")
        st = {r["id"]: r["status"] for r in rows}
        self.assertEqual(st["1"], "error"); self.assertEqual(st["2"], "ok"); self.assertEqual(n, 1)
        rows = U.run_plan(Fake(world(), fail={"2": RuntimeError("503")}), self.pages(), res(), self.shows, out=lambda *_: 0)
        self.assertEqual({r["id"]: r["status"] for r in rows}["2"], "error")

    def test_state_saved_after_401(self):
        d = Path(tempfile.mkdtemp()); m = d / "map.json"
        m.write_text(json.dumps({"items": [dict(v, spreaker_episode_id=k) for k, v in self.pages().items()]}))
        sp = Fake(world(), fail={"2": PermissionError("Spreaker 401")}); old = U.STATE; U.STATE = d / "s.json"
        try:
            with self.assertRaises(PermissionError):
                U.main(["plan", "--ids", "1,2,3", "--map", str(m), "--redirects", "", "--read-pause", "0"], sp=sp)
        finally:
            U.STATE = old
        st = json.loads((d / "s.json").read_text())
        self.assertEqual(st["episodes"]["1"]["s"], "differs"); self.assertTrue(st["run"]["aborted"])

    def test_upload_link_only_when_page_answers(self):
        """F6: der Uploader setzt die Folgenseite nur, wenn sie schon 200 liefert und zu diesem Video gehoert, sonst die Show-Seite."""
        own = page_html("AbC_123")
        self.assertEqual(SEU.upload_link(BASE, "pt", "Pare de criar aplicativos", "AbC_123", "https://www.m365.fm", lambda u: (404, "")), "https://www.m365.fm")
        self.assertEqual(SEU.upload_link(BASE, "pt", "Pare de criar aplicativos", "AbC_123", "https://www.m365.fm", lambda u: (-1, "")), "https://www.m365.fm")
        self.assertEqual(SEU.upload_link(BASE, "pt", "Pare de criar aplicativos", "AbC_123", "https://www.m365.fm", lambda u: (200, own)), f"{BASE}/pt/pare-de-criar-aplicativos/")
        src = (ROOT / "yt_dub_to_spreaker.py").read_text("utf-8")
        self.assertIn("upload_link(", src); self.assertNotIn("return dub_url(", src)

    def test_upload_link_slug_collision_other_episode(self):
        """Gleicher Titel-Slug wie eine schon gebaute Folge: die Seite ohne ID-Anhang antwortet 200, gehoert aber dem anderen Video
        (generate_site.py haengt der neuen Folge '-<vid6>' an) - dann nicht deren Adresse setzen, sondern die Show-Seite."""
        other = page_html("Zzz999xyz00")
        self.assertEqual(SEU.upload_link(BASE, "pt", "Pare de criar aplicativos", "AbC_123", "https://www.m365.fm", lambda u: (200, other)), "https://www.m365.fm")
        self.assertEqual(SEU.upload_link(BASE, "pt", "Pare de criar aplicativos", "AbC_123", "https://www.m365.fm", lambda u: (200, page_html("AbC_1234"))), "https://www.m365.fm")   # nur Anfang gleich
        self.assertEqual(SEU.upload_link(BASE, "pt", "Pare de criar aplicativos", "AbC_123", "https://www.m365.fm", lambda u: (200, "<html></html>")), "https://www.m365.fm")
        src = (ROOT / "generate_site.py").read_text("utf-8")   # Vertrag: jede Dub-Folgenseite nennt ihr Video im JSON-LD (VideoObject.contentUrl)
        self.assertIn('"contentUrl": f"https://www.youtube.com/watch?v={vid}"', src)
        self.assertIn("json.dumps(value, ensure_ascii=False)", src)

    def test_show_list_error_counts_in_run(self):
        """Folgenliste einer Show nicht lesbar: zaehlt als Fehler (run.show_errors), apply endet mit 1, der Probelauf nennt die Show."""
        d = Path(tempfile.mkdtemp()); sp = Fake(world(), fail_show=7393243); bad = {}
        U.run_apply(sp, self.pages(), res(), self.shows, pause=0, log_path=d / "l.tsv", out=lambda *_: 0, check=OK200, backup_dir=d / "bk", show_errors=bad)
        self.assertEqual(list(bad), ["7393243"])
        lines, bad = [], {}
        U.run_plan(Fake(world(), fail_show=7393243), self.pages(), res(), self.shows, out=lines.append, show_errors=bad)
        self.assertTrue(any("7393243" in l and "nicht lesbar" in l for l in lines)); self.assertEqual(list(bad), ["7393243"])
        m = d / "map.json"; m.write_text(json.dumps({"items": [dict(v, spreaker_episode_id=k) for k, v in self.pages().items()]}))
        old = (U.STATE, U.LOG, U.BACKUP); U.STATE, U.LOG, U.BACKUP = d / "s.json", d / "run.tsv", d / "bk2"
        try:
            for mode, want in (("plan", 0), ("apply", 1)):
                sp = Fake(world(), fail_show=7393243)
                self.assertEqual(U.main([mode, "--map", str(m), "--redirects", "", "--read-pause", "0", "--pause", "0", "--ids", "3"], sp=sp), want, mode)   # nur Folge 3 (Show mit Fehler): kein Schreiben, kein Netz
                self.assertEqual(json.loads((d / "s.json").read_text())["run"]["show_errors"], ["7393243"])
        finally:
            U.STATE, U.LOG, U.BACKUP = old


class ScheduledAndIndex(unittest.TestCase):
    """E2: geplante/private Folgen ohne Seite sind skipped, nicht missing; A: jeder Lauf schreibt den Index der Hauptshow (data/spreaker_index.json)."""
    def w(self):
        w = world()
        w["6"] = dict(ep("6", 6704921, "", "x", title="Geplant"), published_at="2099-01-01 10:00:00")   # geplant, keine Seite
        w["7"] = ep("7", 6704921, "", "x", vis="PRIVATE", title="Privat")                                 # privat, keine Seite
        w["8"] = ep("8", 6704921, "", "x", title="Alte Folge")                                            # veroeffentlicht, keine Seite
        return w

    def test_classify_order(self):
        rows = U.run_plan(Fake(self.w()), PAGES, res(), [6704921], out=lambda *_: 0)
        self.assertEqual({r["id"]: r["status"] for r in rows}, {"1": "differs", "6": "skipped", "7": "skipped", "8": "missing"})
        self.assertEqual(U.classify(6704921, {"episode_id": "9"}, None, res())["status"], "missing")   # Veroeffentlichung unbekannt: wie bisher
        self.assertEqual(U.classify(6704921, {"episode_id": "9", "published_at": "2099-01-01 10:00:00"}, None, res())["status"], "skipped")

    def test_list_item_complete_needs_no_get(self):
        class ListFull(Fake):
            def paged(self, path):
                return [{k: v for k, v in e.items() if k != "show"} for e in self.eps.values() if e["show"] == int(path.split("/")[2])]
            def req(self, method, path, **kw):
                if method == "GET" and path.rsplit("/", 1)[1] in ("6", "7", "8"): raise AssertionError("Einzelabfrage unnoetig")
                return super().req(method, path, **kw)
        rows = U.run_plan(ListFull(self.w()), PAGES, res(), [6704921], out=lambda *_: 0)
        self.assertEqual({r["id"]: r["status"] for r in rows}["6"], "skipped")

    def test_get_error_stays_missing(self):
        rows = U.run_plan(Fake(self.w(), fail={"6": RuntimeError("503")}), PAGES, res(), [6704921], out=lambda *_: 0)
        self.assertEqual({r["id"]: r["status"] for r in rows}["6"], "missing")

    def test_main_writes_index(self):
        d = Path(tempfile.mkdtemp()); m = d / "map.json"
        m.write_text(json.dumps({"items": [dict(v, spreaker_episode_id=k) for k, v in PAGES.items()]}))
        old = U.STATE; U.STATE = d / "s.json"
        try:
            U.main(["plan", "--ids", "1,6,7,8", "--map", str(m), "--redirects", "", "--read-pause", "0"], sp=Fake(self.w()))
            ix = json.loads((d / "spreaker_index.json").read_text())
            self.assertEqual(ix["show_id"], 6704921)
            self.assertEqual(sorted(ix["episodes"], key=int), ["1", "6", "7", "8"])   # nur Hauptshow; Fake-Liste ohne Felder: Titel/Zeit aus den Einzelabfragen
            self.assertEqual(ix["episodes"]["8"], {"t": "Alte Folge", "p": "2025-01-01 10:00:00"})
            mt = (d / "spreaker_index.json").stat().st_mtime_ns
            U.main(["plan", "--ids", "3", "--map", str(m), "--redirects", "", "--read-pause", "0"], sp=Fake(self.w()))
            self.assertEqual((d / "spreaker_index.json").stat().st_mtime_ns, mt)   # unveraendert (--ids: alle IDs der Liste, Felder aus dem alten Index): nicht neu schreiben
            U.main(["plan", "--map", str(m), "--redirects", "", "--read-pause", "0", "--ids", "3", "--no-state"], sp=Fake(world()))
            self.assertEqual(len(json.loads((d / "spreaker_index.json").read_text())["episodes"]), 4)   # --no-state: kein Index
            self.assertFalse(U.save_index({"1": {"t": "x"}}, d / "spreaker_index.json", out=lambda *_: 0))   # deutlich kleiner: nicht schreiben
            U.main(["plan", "--ids", "3", "--map", str(m), "--redirects", "", "--read-pause", "0"], sp=Fake(self.w(), fail_show=6704921))
            self.assertEqual(len(json.loads((d / "spreaker_index.json").read_text())["episodes"]), 4)   # Liste nicht lesbar: alter Index bleibt
            (d / "spreaker_index.json").unlink()
            self.assertEqual(U.main(["export", "--ids", "1", "--map", str(m), "--redirects", "", "--out", str(d / "e.json")], sp=Fake(self.w())), 0)
            self.assertEqual(len(json.loads((d / "spreaker_index.json").read_text())["episodes"]), 4)   # export frischt den Index auf
        finally:
            U.STATE = old

    def test_site_reads_index(self):
        """Vertrag Werkzeug -> Seitenbau: das Format von save_index liest site_podpage.spreaker_match."""
        from unittest.mock import patch
        with patch("site_fetch.fetch", return_value={}):
            import site_podpage as P
        d = Path(tempfile.mkdtemp()); (d / "show_notes").mkdir()
        U.save_index({"67289366": {"t": "Azure DevOps Pipelines for Power Platform Deployments", "p": "2025-08-07 00:49:00"}}, d / "spreaker_index.json")
        with patch.object(P, "D", d), patch.object(P, "_SIDS", {}):
            self.assertEqual(P.spreaker_id({"name": "Pipelines (umbenannt)", "slug": "azure-devops-pipelines", "published": "2025-08-06T17:49:00-07:00"}), "67289366")


if __name__ == "__main__":
    unittest.main()
