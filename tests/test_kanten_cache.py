"""Kanten-Cache ueber Deploys erhalten (17.11.2026): Purge-Hash ueber die ganze Seite ausser DTSTAMP (tools/page_hashes.py; die Liste "neueste Folgen"
gibt es seit 25.11.2026 nicht mehr, die festen "Aehnlichen Folgen" zaehlen mit), gezielter Purge statt
purge_everything (tools/purge_changed.py, MAX_URLS), R2-Schluessel ohne Bau-Kennung (/__r2f<pfad>, sitewrk/index.js) mit Purge nach dem Spiegel, vor der Bau-Kennung.
Kern: keine veralteten Seiten - jede echte Aenderung (Titel, Hauptinhalt, Asset-Adressen, uebrige Seitenleiste) wird geleert, auch ueber gescheiterte Laeufe hinweg."""
import importlib.util, io, json, os, subprocess, sys, tempfile, unittest, urllib.error
from pathlib import Path
from unittest import mock

import yaml

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_sidebar as SBR   # noqa: E402

BASE = "https://www.m365.fm"


class _Ix:   # Wissensgraph-Stub fuer site_sidebar.render: keine Themen-Chips
    all = {}
    def match(self, text, k=8): return []


def page(title="T", body="Text", css="aaaaaaaaaa", related=("Folge A", "Folge B"), chips=False, foot="Fuss", latest=("Folge A", "Folge B")):
    """Seite wie generate_site.page mit der echten Seitenleiste (site_sidebar.render). related: feste Aehnliche Folgen der Seite (site_related);
    latest: neueste Folgen, wie sie frueher uebergeben wurden (render nimmt sie nur noch aus Kompatibilitaet an, ohne Wirkung)."""
    items = [{"t": t, "u": f"/show/episodes/{i}/"} for i, t in enumerate(latest)]
    side = SBR.render(_Ix(), BASE, "en", "", items, lambda x: x["u"], lambda x: x["t"], BASE + "/show/episodes/", related=[(f"/show/episodes/r{i}/", t) for i, t in enumerate(related)])
    if chips: side = side.replace('<div class="sbar-in">', '<div class="sbar-in"><section class="sb-card"><h2>Themen</h2><ul class="sb-chips"><li>X</li></ul></section>')
    return (f'<!doctype html><html><head><title>{title}</title><link rel="stylesheet" href="{BASE}/assets/site.{css}.css"></head><body><header>Nav</header>'
            f'<main class="wrap shw"><div class="shmain"><h1>{title}</h1><p>{body}</p></div>{side}</main><footer>{foot}</footer></body></html>')


def ics(stamp="20261117T010000Z", summary="Event"):
    return f"BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:e@dub.m365.fm\r\nDTSTAMP:{stamp}\r\nSUMMARY:{summary}\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n"


def hashes(d, docs, r2out=None):
    """tools/page_hashes.py wie im Bau-Job ueber ein Verzeichnis-Abbild; Rueckgabe: Pfad der Hash-Datei."""
    d = Path(d)
    for base, files in (("docs", docs), ("r2out", r2out or {})):
        for rel, body in files.items():
            p = d / base / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(body if isinstance(body, bytes) else body.encode("utf-8"))
    args = [str(d / "docs"), str(d / "p.json"), str(d / "c.json")] + ([str(d / "r2out")] if r2out is not None else [])
    subprocess.run([sys.executable, str(ROOT / "tools" / "page_hashes.py"), *args], check=True, capture_output=True)
    return d / "p.json"


class PurgeHashTest(unittest.TestCase):
    """Nur DTSTAMP faellt heraus - alles, was den Inhalt oder die Darstellung betrifft (auch die Seitenleiste), aendert den Hash."""
    def h(self, files):
        with tempfile.TemporaryDirectory() as d: return json.loads(hashes(d, files).read_text())

    def test_new_episode_keeps_bytes_sidebar_counts(self):
        a = self.h({"x/index.html": page()})["/x/"]
        self.assertEqual(self.h({"x/index.html": page(latest=("Folge NEU", "Folge A"))})["/x/"], a, "neue Folge: die Seite bleibt byte-gleich (keine Neueste-Folgen-Liste mehr)")
        for kw in ({"title": "T2"}, {"body": "Text neu"}, {"css": "bbbbbbbbbb"}, {"chips": True}, {"foot": "Fuss neu"}, {"related": ("Folge A",)}):
            self.assertNotEqual(self.h({"x/index.html": page(**kw)})["/x/"], a, kw)

    def test_no_latest_rule_left(self):
        side = SBR.render(_Ix(), BASE, "de", "", [{"u": "/a/", "t": "A"}], lambda x: x["u"], lambda x: x["t"], BASE + "/de/podcast/")
        self.assertNotIn("sb-list", side, "ohne related keine Folgen-Karte, auch wenn noch items uebergeben werden")
        self.assertNotIn("LATEST", (ROOT / "tools" / "page_hashes.py").read_text("utf-8"), "Sonderregel entfaellt: die Seitenleiste zaehlt ganz")

    def test_ics_dtstamp_ignored_other_fields_not(self):
        a = self.h({"e/event.ics": ics()})["/e/event.ics"]
        self.assertEqual(self.h({"e/event.ics": ics(stamp="20261118T020000Z")})["/e/event.ics"], a)
        self.assertNotEqual(self.h({"e/event.ics": ics(summary="Event neu")})["/e/event.ics"], a)

    def test_all_docs_files_but_images(self):
        h = self.h({"index.html": page(), "assets/fonts/b.woff2": b"\x00\x01", "m.pdf": b"%PDF", "e/event.ics": ics(), "assets/a.webp": b"RIFF", "og/x.png": b"P", "f.svg": "<svg/>"})
        self.assertEqual(sorted(h), ["/", "/assets/fonts/b.woff2", "/e/event.ics", "/m.pdf"])


class FakeCF:
    """Cloudflare-API im Speicher: purge_cache mit files bzw. purge_everything; Fehler und 429 einstellbar."""
    def __init__(self, fail_files=False, fail_all=False, n429=0):
        self.files, self.everything, self.fail_files, self.fail_all, self.n429, self.batches = [], 0, fail_files, fail_all, n429, []

    def __call__(self, req, timeout=None):
        if req.full_url.startswith("https://api.indexnow.org/"): raise AssertionError("IndexNow ohne Schluessel")
        assert req.full_url == "https://api.cloudflare.com/client/v4/zones/Z/purge_cache", req.full_url
        body = json.loads(req.data)
        if self.n429:
            self.n429 -= 1; raise urllib.error.HTTPError(req.full_url, 429, "Too Many Requests", {"retry-after": "1"}, io.BytesIO(b"{}"))
        if body.get("purge_everything"): self.everything += 1; ok = not self.fail_all
        else: self.batches.append(len(body["files"])); ok = not self.fail_files; self.files += body["files"] if ok else []
        return io.BytesIO(json.dumps({"success": ok, "errors": [] if ok else [{"message": "boom"}]}).encode())


def load():
    spec = importlib.util.spec_from_file_location("purge_changed_t", ROOT / "tools" / "purge_changed.py"); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


class PurgeFlowTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.t = Path(self.tmp.name)
        self.pend = self.t / "pagehashes" / "r2-pending.json"; self.pend.parent.mkdir()
        self.keys = self.t / "r2-keys.json"
        self.env = {"CLOUDFLARE_API_TOKEN": "t", "CF_ZONE_ID": "Z", "BASE": BASE, "R2_PENDING": str(self.pend), "R2_KEYS": str(self.keys), "PATH": os.environ.get("PATH", "")}

    def tearDown(self): self.tmp.cleanup()

    def build(self, name, docs, r2out, r2keys):
        p = hashes(self.t / name, docs, r2out); self.keys.write_text(json.dumps(r2keys)); return p

    def step1(self, old, new, cf, r2changed=()):
        ch = self.t / "r2-changed.json"; ch.write_text(json.dumps(list(r2changed)))
        m = load()
        with mock.patch.dict(os.environ, self.env, clear=True), mock.patch("urllib.request.urlopen", cf), mock.patch("time.sleep"):
            m.main([str(old), str(new), str(ch)])
        return m

    def step2(self, new, cf):
        m = load()
        with mock.patch.dict(os.environ, self.env, clear=True), mock.patch("urllib.request.urlopen", cf), mock.patch("time.sleep"):
            return m.main_r2(str(self.pend), str(new))

    def pending(self): return json.loads(self.pend.read_text())

    def two_builds(self):
        docs1 = {"index.html": page("Start"), "show/a/index.html": page("A"), "show/b/index.html": page("B"), "assets/fonts/x.woff2": b"F", "community/events/e/event.ics": ics()}
        r2_1 = {"de/x/index.html": page("X"), "fr/y/index.html": page("Y"), "ru/tag/облако/index.html": page("R")}
        keys = ["pages/de/x/index.html", "pages/fr/y/index.html", "pages/ru/tag/облако/index.html", "pages/ja/z/transcript.txt"]
        old = self.build("b1", docs1, r2_1, keys)
        new_latest = ("Folge NEU", "Folge A")   # neue Folge: frueher war die Seitenleiste ueberall anders, jetzt bleibt sie gleich (feste Aehnliche Folgen)
        docs2 = {"index.html": page("Start", latest=new_latest), "show/a/index.html": page("A", body="neu", latest=new_latest), "show/b/index.html": page("B", latest=new_latest),
                 "assets/fonts/x.woff2": b"F", "community/events/e/event.ics": ics(stamp="20261118T000000Z"), "show/c/index.html": page("C")}
        r2_2 = {"de/x/index.html": page("X", latest=new_latest), "fr/y/index.html": page("Y2", latest=new_latest), "ru/tag/облако/index.html": page("R", body="neu")}
        new = self.build("b2", docs2, r2_2, keys)
        uploaded = ["/de/x/", "/fr/y/", "/ru/tag/облако/", "/ja/z/transcript.txt"]   # r2_pages_upload laedt alles mit geaenderten Bytes, dazu ein Transkript
        return old, new, uploaded

    def test_new_episode_purges_only_real_changes_then_r2_after_marker(self):
        old, new, uploaded = self.two_builds()
        cf = FakeCF(); self.step1(old, new, cf, uploaded)
        ru = BASE + "/ru/tag/%D0%BE%D0%B1%D0%BB%D0%B0%D0%BA%D0%BE/"
        self.assertEqual(sorted(cf.files), sorted([BASE + "/show/a/", BASE + "/show/c/", BASE + "/fr/y/", ru, BASE + "/__r2c/fr/y/", BASE + "/__r2c" + ru[len(BASE):]]),
                         "nur echte Aenderungen; Startseite, /show/b/, /de/x/ (nur neue Folge, Seite byte-gleich), Schrift und .ics (nur DTSTAMP) bleiben im Cache")
        self.assertEqual(cf.everything, 0, "kein Komplett-Purge")
        pend = self.pending()
        self.assertFalse(pend["all"]); self.assertEqual(pend["urls"], sorted(["/show/a/", "/show/c/", "/fr/y/", "/ru/tag/облако/", "/ja/z/transcript.txt"]))
        cf2 = FakeCF(); self.assertEqual(self.step2(new, cf2), 0)
        self.assertEqual(sorted(cf2.files), sorted(BASE + "/__r2f" + u for u in ["/show/a/", "/show/c/", "/fr/y/", ru[len(BASE):], "/ja/z/transcript.txt"]))
        self.assertIn(BASE + "/__r2f/ru/tag/%D0%BE%D0%B1%D0%BB%D0%B0%D0%BA%D0%BE/", cf2.files, "gleiche Adresse wie der Cache-Schluessel des Site-Workers (sitewrk/test/worker.test.mjs)")
        self.assertEqual(self.pending()["urls"], [], "nach Erfolg leer")

    def test_failed_r2_purge_keeps_addresses_for_next_run(self):
        old, new, uploaded = self.two_builds()
        self.step1(old, new, FakeCF(), uploaded)
        before = self.pending()["urls"]
        self.assertEqual(self.step2(new, FakeCF(fail_files=True, fail_all=True)), 1, "Ende 1 -> Deploy-Job setzt die Bau-Kennung nicht")
        self.assertEqual(self.pending()["urls"], before, "Liste bleibt")
        # naechster Lauf (alter Stand = Hashes dieses Laufs, wie im Deploy-Job kopiert): offene Adressen bleiben drin, neue kommen dazu
        newer = self.build("b3", {"index.html": page("Start neu")}, {}, [])
        self.step1(new, newer, FakeCF(), [])
        self.assertTrue(set(before) <= set(self.pending()["urls"])); self.assertIn("/", self.pending()["urls"])
        cf = FakeCF(); self.assertEqual(self.step2(newer, cf), 0)
        self.assertTrue({BASE + "/__r2f" + load().q(u) for u in before} <= set(cf.files))

    def test_failed_batch_falls_back_to_everything(self):
        old, new, uploaded = self.two_builds()
        self.step1(old, new, FakeCF(), uploaded)
        cf = FakeCF(fail_files=True); self.assertEqual(self.step2(new, cf), 0); self.assertEqual(cf.everything, 1, "lieber kalt als veraltet")
        self.assertEqual(self.pending()["urls"], [])

    def test_retry_on_429(self):
        old, new, uploaded = self.two_builds()
        self.step1(old, new, FakeCF(), uploaded)
        cf = FakeCF(n429=2); self.assertEqual(self.step2(new, cf), 0); self.assertEqual(cf.everything, 0); self.assertEqual(len(cf.files), 5)

    def test_gap_in_chain_purges_everything(self):
        """Ein Deploy dazwischen ohne Fortschreiben der Liste (z. B. aelterer Workflow) oder ein abgebrochener Schritt 1: dann alles leeren."""
        old, new, uploaded = self.two_builds()
        self.step1(old, new, FakeCF(), uploaded); self.assertEqual(self.step2(new, FakeCF()), 0)
        newer = self.build("b3", {"index.html": page("Start neu")}, {}, [])
        newest = self.build("b4", {"index.html": page("Start neuer")}, {}, [])
        self.step1(newer, newest, FakeCF(), [])   # Lauf b2->b3 hat die Liste nicht fortgeschrieben
        self.assertTrue(self.pending()["all"])
        cf = FakeCF(); self.assertEqual(self.step2(newest, cf), 0); self.assertEqual(cf.everything, 1)
        # Schritt 1 dieses Laufs abgebrochen: Liste passt nicht zu den neuen Hashes -> alles
        nxt = self.build("b5", {"index.html": page("Start 5")}, {}, [])
        cf = FakeCF(); self.assertEqual(self.step2(nxt, cf), 0); self.assertEqual(cf.everything, 1)

    def test_missing_or_broken_list_means_everything(self):
        _, new, _ = self.two_builds()
        cf = FakeCF(); self.assertEqual(self.step2(new, cf), 0); self.assertEqual(cf.everything, 1, "Liste fehlt")
        self.pend.write_text("{kaputt"); cf = FakeCF(); self.assertEqual(self.step2(new, cf), 0); self.assertEqual(cf.everything, 1, "Liste unlesbar")

    def test_no_token_keeps_list(self):
        old, new, uploaded = self.two_builds()
        self.step1(old, new, FakeCF(), uploaded); before = self.pending()
        self.env.pop("CLOUDFLARE_API_TOKEN")
        self.assertEqual(self.step2(new, FakeCF()), 1); self.assertEqual(self.pending(), before)

    def test_max_urls_and_batches(self):
        m = load(); self.assertEqual(m.MAX_URLS, 15000); self.assertEqual(m.BATCH, 30)
        cf = FakeCF()
        with mock.patch.dict(os.environ, self.env, clear=True), mock.patch("urllib.request.urlopen", cf), mock.patch("time.sleep"):
            self.assertTrue(m.purge("Z", [f"{BASE}/p{i}/" for i in range(61)], "t")); self.assertEqual(cf.batches, [30, 30, 1]); self.assertEqual(cf.everything, 0)
            m.MAX_URLS = 60; self.assertTrue(m.purge("Z", [f"{BASE}/p{i}/" for i in range(61)], "t")); self.assertEqual(cf.everything, 1)
        # Lauf #709 (17.11.): 1697 + 1564 = 3261 Adressen loesten mit MAX_URLS 3000 einen Komplett-Purge aus - jetzt gezielt
        self.assertLess(3261 * 2, load().MAX_URLS)


class WorkflowOrderTest(unittest.TestCase):
    """site.yml: der R2-Purge laeuft nach dem vollstaendigen Spiegel und vor der Bau-Kennung, ein Fehlschlag verhindert die Kennung; sie traegt die Endung des Site-Workers."""
    def test_order_and_marker(self):
        wf = yaml.safe_load((ROOT / ".github" / "workflows" / "site.yml").read_text("utf-8"))
        build = [s.get("run", "") for s in wf["jobs"]["build"]["steps"]]
        mark = [r for r in build if "docs/r2-build.txt" in r]; self.assertEqual(len(mark), 1); self.assertIn("-pfad\"", mark[0])
        js = (ROOT / "sitewrk" / "index.js").read_text("utf-8"); self.assertIn("export const PATH_KEY = /-pfad$/;", js)
        st = wf["jobs"]["deploy"]["steps"]
        idx = {s.get("id") or s.get("name"): i for i, s in enumerate(st)}
        p1 = next(i for i, s in enumerate(st) if "tools/purge_changed.py .pagehashes" in s.get("run", ""))
        self.assertEqual(st[p1]["env"]["R2_PENDING"], ".pagehashes/r2-pending.json")
        self.assertLess(p1, idx["r2sync"]); self.assertLess(idx["r2sync"], idx["r2purge"]); self.assertLess(idx["r2purge"], idx["r2mark"])
        self.assertEqual(st[idx["r2purge"]]["if"], "steps.r2sync.outcome == 'success'"); self.assertTrue(st[idx["r2purge"]]["continue-on-error"])
        self.assertIn("--r2 .pagehashes/r2-pending.json .newhashes/page-hashes.json", st[idx["r2purge"]]["run"])
        self.assertEqual(st[idx["r2mark"]]["if"], "steps.r2sync.outcome == 'success' && steps.r2purge.outcome == 'success'", "Kennung nur nach geleertem R2-Cache")
        self.assertIn("--marker", st[idx["r2mark"]]["run"])
        save = [i for i, s in enumerate(st) if "cache/save" in s.get("uses", "") and s["with"]["path"] == ".pagehashes"]
        self.assertTrue(any(i > idx["r2purge"] for i in save), "geleerte Liste nach dem R2-Purge sichern")
        self.assertTrue(any(i < idx["r2sync"] for i in save), "offene Liste schon vor dem Spiegel sichern")


if __name__ == "__main__":
    unittest.main()
