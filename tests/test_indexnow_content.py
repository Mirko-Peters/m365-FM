import contextlib, io, json, os, runpy, subprocess, sys, tempfile, unittest, warnings
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from content_hash import MAX_INDEXNOW, content_hash, content_text, indexnow_batches, indexnow_select

PAGE = ('<html><body><header>Nav 12 Folgen</header><main><h1>Titel</h1><article><p>Text eins <a href="/a/">Link</a> <img src="/assets/bild.png?v=1"></p></article>'
        '<div class="ad"><ins class="adsbygoogle">x</ins></div></main><aside class="sbar"><ol><li>Folge A</li></ol></aside>'
        '<footer>aktualisiert vor 3 Stunden</footer></body></html>')
# Kopf wie aus generate_site.page(): Titel, Beschreibung, robots, canonical - dazu Dinge, die sich mit jedem Bau aendern duerfen (Stylesheet-Hash, JSON-LD)
HEAD = ('<!doctype html>\n<html lang="en" dir="ltr">\n<head>\n<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n'
        '<title>Titel A | M365.FM</title>\n<meta name="description" content="Beschreibung A &amp; mehr">\n'
        '<meta name="author" content="Mirko Peters"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">\n'
        '<link rel="canonical" href="https://www.m365.fm/a/">\n<meta property="og:title" content="OG A"><meta property="og:url" content="https://www.m365.fm/a/">\n'
        '<link rel="stylesheet" href="https://www.m365.fm/assets/site.48153eaac3.css"><style>.x{color:red}</style>\n'
        '<script type="application/ld+json">{"@type":"WebPage","dateModified":"2026-11-09"}</script>\n</head>\n')
FULL = HEAD + PAGE[len("<html>"):]
doc = lambda inner: f"<html><head><title>T</title></head><body><main>{inner}</main></body></html>"


class IndexNow(unittest.TestCase):
    def test_sidebar_only_same_hash(self):
        b = PAGE.replace("Folge A", "Folge B neu").replace("vor 3 Stunden", "vor 5 Stunden").replace("12 Folgen", "13 Folgen").replace("?v=1", "?v=2").replace(">x<", ">y<")
        self.assertNotEqual(PAGE, b); self.assertEqual(content_hash(PAGE), content_hash(b))

    def test_article_change_differs(self):
        self.assertNotEqual(content_hash(PAGE), content_hash(PAGE.replace("Text eins", "Text zwei")))

    # ---- 312-1: Kopf-Felder gehoeren zum Inhalts-Hash
    def test_head_fields_change_hash(self):
        for name, a, b in (("title", "<title>Titel A | M365.FM</title>", "<title>Titel B | M365.FM</title>"),
                           ("description", 'content="Beschreibung A &amp; mehr"', 'content="Beschreibung B"'),
                           ("robots noindex", 'content="index,follow,max-image-preview:large,max-snippet:-1"', 'content="noindex,follow"'),
                           ("canonical", '<link rel="canonical" href="https://www.m365.fm/a/">', '<link rel="canonical" href="https://www.m365.fm/b/">')):
            with self.subTest(name):
                self.assertIn(a, FULL); self.assertNotEqual(content_hash(FULL), content_hash(FULL.replace(a, b)))

    def test_robots_index_after_noindex(self):   # Uebersetzung/Show Notes kommen nach: nur robots wechselt von noindex auf index
        ni = FULL.replace("index,follow,max-image-preview:large,max-snippet:-1", "noindex,follow")
        self.assertNotEqual(content_hash(ni), content_hash(FULL))

    def test_head_rest_is_boilerplate(self):
        b = (FULL.replace("site.48153eaac3.css", "site.0000000000.css").replace('content="OG A"', 'content="OG B"').replace("2026-11-09", "2026-11-10")
             .replace(".x{color:red}", ".x{color:blue}").replace('content="Mirko Peters"', 'content="M. Peters"'))
        self.assertNotEqual(FULL, b); self.assertEqual(content_hash(FULL), content_hash(b))

    def test_head_parsing(self):
        # Reihenfolge und Schreibweise der Attribute, Zeichen-Referenzen und Leerraum aendern den Hash nicht
        b = (FULL.replace('<meta name="description" content="Beschreibung A &amp; mehr">', "<meta content='Beschreibung A &#38; mehr' name=description>")
             .replace('<link rel="canonical" href="https://www.m365.fm/a/">', '<link href="https://www.m365.fm/a/" rel="canonical">')
             .replace("<title>Titel A | M365.FM</title>", "<title>\n Titel A  | M365.FM </title>"))
        self.assertNotEqual(FULL, b); self.assertEqual(content_hash(FULL), content_hash(b))
        t = content_text(FULL)
        for want in ("Titel A | M365.FM", "Beschreibung A & mehr", "index,follow,max-image-preview:large,max-snippet:-1", "https://www.m365.fm/a/"): self.assertIn(want, t)
        self.assertNotIn("OG A", t); self.assertNotIn("color", t); self.assertNotIn("dateModified", t)

    def test_head_attribute_with_angle_bracket(self):   # ein nicht maskiertes ">" im Attributwert schneidet weder das Feld ab noch verschluckt es die folgenden
        a = '<html><head><title>T</title><meta name="description" content="Teams > Kanaele: Teil eins"><meta name="robots" content=\'index,follow\'><link rel="canonical" href="/a/"></head><body><main>x</main></body></html>'
        self.assertTrue(content_text(a).startswith("T | Teams > Kanaele: Teil eins | index,follow | /a/ || "))
        for x, y in (("Teil eins", "Teil zwei"), ("index,follow", "noindex,follow"), ('href="/a/"', 'href="/b/"')):
            with self.subTest(x): self.assertNotEqual(content_hash(a), content_hash(a.replace(x, y)))

    def test_head_only_from_head(self):
        # <title> eines SVG und meta im Rumpf sind keine Kopf-Felder; auskommentierte auch nicht
        a = '<html><head><!-- <title>Alt</title> --><title>T</title></head><body><main><p>x</p><svg><title>Icon eins</title></svg></main><meta name="robots" content="noindex"></body></html>'
        b = a.replace("Icon eins", "Icon zwei").replace('content="noindex"', 'content="index"').replace("<title>Alt</title>", "<title>Aelter</title>")
        self.assertEqual(content_hash(a), content_hash(b))
        self.assertNotEqual(content_hash(a), content_hash(a.replace("<title>T</title>", "<title>U</title>")))

    # ---- 312-3: Auslassregeln duerfen keinen Hauptinhalt schlucken
    def test_ad_prefixed_content_counts(self):   # Preistabelle der Werbe-Landingpage (site_landing.py): ad-price, ad-prices, ad-note, ad-soon sind Inhalt
        a = doc('<h1>Advertise</h1><table class="lp-table ad-prices"><tr><td>Sidebar</td><td class="ad-price">490 EUR</td></tr></table>'
                 '<p class="lp-note" id="ad-note">Preise ab 1.1.2027</p><p class="dir-note ad-soon">Bald buchbar</p>')
        t = content_text(a)
        for want in ("490 EUR", "Preise ab 1.1.2027", "Bald buchbar"): self.assertIn(want, t)
        for x, y in (("490 EUR", "990 EUR"), ("1.1.2027", "1.7.2027"), ("Bald buchbar", "Jetzt buchbar")):
            with self.subTest(x): self.assertNotEqual(content_hash(a), content_hash(a.replace(x, y)))

    def test_real_ad_containers_skipped(self):   # alle Klassen-Kombinationen aus site_ads.py / site_sidebar.py
        for cls in ("ad", "ad ad-own", "ad ad-own ad-slot ad-top", "ad ad-own en-lead", "ad-box", "ad-house", "ad-house ad-adv", "ad-house ad-con", "ad-house ad-svc",
                    "adsbygoogle", "sb-card", "sb-card sb-g", "sb-card sb-comm", "sbar", "AD Ad-Own"):
            with self.subTest(cls):
                a = doc(f'<p>Text</p><div class="{cls}"><b>Anzeige eins</b><a href="/x/">Mehr</a></div><p>Ende</p>')
                self.assertNotIn("Anzeige", content_text(a)); self.assertEqual(content_hash(a), content_hash(a.replace("Anzeige eins", "Anzeige zwei").replace("/x/", "/y/")))
        a = doc('<p>Text</p><div data-ad-slot="top"><b>Anzeige eins</b></div><section id="sbar">Seite eins</section>')
        self.assertEqual(content_hash(a), content_hash(a.replace("eins", "zwei")))

    def test_cache_buster_only_own_files(self):
        same = ('<img src="/assets/bild.png?v=1">', '<img src="https://www.m365.fm/assets/bild.png?v=1">', '<img src="https://img.m365.fm/blog/bild.webp?v=1">',
                '<img src="https://api-dub.m365.fm/api/img/member/anna.jpg?v=1">', '<a href="/assets/liste.pdf?v=1">PDF</a>', '<img src="//img.m365.fm/x.webp?w=200&v=1">')
        for tag in same:
            with self.subTest(tag): self.assertEqual(content_hash(doc(tag)), content_hash(doc(tag.replace("v=1", "v=2"))))
        diff = ('<a href="https://www.youtube.com/watch?v=AAAAAAAAAAA">Video</a>', '<a href="https://youtu.be/x?t=1">Video</a>', '<a href="/de/trainer/?v=1">Seite</a>',
                '<a href="https://www.m365.fm/show/x/?t=1">Stelle</a>', '<img src="https://cdn.example.com/bild.png?v=1">', '<img src="https://m365.fm.example.com/bild.png?v=1">',
                '<p>Parameter ?v=1 anhaengen</p>')
        for tag in diff:
            with self.subTest(tag): self.assertNotEqual(content_hash(doc(tag)), content_hash(doc(tag.replace("AAAAAAAAAAA", "BBBBBBBBBBB").replace("=1", "=2"))))
        self.assertNotEqual(content_hash(doc('<img src="/assets/a.png?v=1">')), content_hash(doc('<img src="/assets/b.png?v=1">')))

    def test_durations_are_content(self):
        for a, b in (("valid for 30 days.", "valid for 90 days."), ("120 sessions. 10 days.", "120 sessions. 12 days."), ("Duration: 45 min.", "Duration: 60 min."),
                     ("Exam SC-300, 120 minutes.", "Exam SC-300, 90 minutes."), ("Dauer: 3 Stunden", "Dauer: 5 Stunden"), ("Live today", "Live yesterday"), ("Heute live", "Gestern live")):
            with self.subTest(a): self.assertNotEqual(content_hash(doc(f"<p>{a}</p>")), content_hash(doc(f"<p>{b}</p>")))

    def test_relative_times_ignored(self):
        for a, b in (("aktualisiert vor 3 Stunden von Mirko Peters und Team", "aktualisiert vor 13 Stunden von Mirko Peters und Team"), ("Updated 2 days ago", "Updated 3 days ago"),
                     ("updated 5 min ago", "updated 2 hours ago"), ("Stand: vor 2 Tagen.", "Stand: vor 1 Woche."), ("Updated today", "Updated yesterday"),
                     ("Aktualisiert heute", "Aktualisiert gestern"), ("posted just now", "posted 3 hours ago"), ("Stand 2026-11-09T20:27:00Z", "Stand 2026-11-10 06:00")):
            with self.subTest(a):
                self.assertEqual(content_hash(doc(f"<p>{a}</p>")), content_hash(doc(f"<p>{b}</p>")))
                self.assertNotEqual(content_hash(doc(f"<p>{a}</p>")), content_hash(doc(f"<p>{a} neu</p>")))
        self.assertEqual(content_hash(doc("<p>Stand <time datetime='2026-11-09'>9. Nov.</time></p>")), content_hash(doc("<p>Stand <time datetime='2026-11-10'>10. Nov.</time></p>")))

    # ---- Auswahl und 312-2: alles melden, in Aufrufen zu hoechstens 10.000 Adressen
    def test_select(self):
        old = {"/a/": "1", "/b/": "1", "/c/": "1", "/gone/": "1", "/assets/x.js": "1"}
        new = {"/a/": "2", "/b/": "2", "/c/": "1", "/neu/": "1", "/assets/x.js": "2"}
        oc = {"/a/": "h", "/b/": "h", "/c/": "h", "/gone/": "h"}
        nc = {"/a/": "h", "/b/": "h2", "/c/": "h", "/neu/": "n"}
        sel, st = indexnow_select(old, new, oc, nc)
        self.assertEqual(sel, ["/b/", "/neu/", "/gone/"])   # Inhalt geaendert, dann neu, dann entfallen
        self.assertEqual((st["new"], st["removed"], st["content"], st["boilerplate"]), (1, 1, 1, 1))

    def test_first_run_seeds(self):
        sel, st = indexnow_select({"/a/": "1"}, {"/a/": "2"}, {}, {"/a/": "h"})
        self.assertEqual(sel, []); self.assertTrue(st["seed"])

    def test_select_keeps_everything(self):
        n = 2 * MAX_INDEXNOW + 1
        oc = {f"/p{i}/": "h" for i in range(n)}; nc = {u: "h2" for u in oc}
        old = {**{u: "1" for u in oc}, "/weg/": "1"}; new = {**{u: "2" for u in nc}, "/neu/": "1"}; nc["/neu/"] = "n"; oc["/weg/"] = "h"
        sel, st = indexnow_select(old, new, oc, nc)
        self.assertEqual(len(sel), n + 2); self.assertEqual(len(set(sel)), n + 2); self.assertEqual(sel[-2:], ["/neu/", "/weg/"]); self.assertEqual(st["content"], n)
        self.assertNotIn("capped", st)

    def test_batches(self):
        self.assertEqual(MAX_INDEXNOW, 10000)
        urls = [f"/p{i}/" for i in range(2 * MAX_INDEXNOW + 1)]
        parts = indexnow_batches(urls)
        self.assertEqual([len(p) for p in parts], [MAX_INDEXNOW, MAX_INDEXNOW, 1]); self.assertEqual([u for p in parts for u in p], urls)
        self.assertEqual(indexnow_batches([]), []); self.assertEqual(indexnow_batches(urls[:3], 2), [urls[:2], urls[2:3]])

    def test_page_hashes_cli(self):
        with tempfile.TemporaryDirectory() as d:
            d = Path(d); (d / "docs" / "x").mkdir(parents=True); (d / "docs" / "x" / "index.html").write_text(FULL, "utf-8"); (d / "docs" / "x" / "roh.html").write_text(PAGE, "utf-8")
            subprocess.run([sys.executable, str(ROOT / "tools" / "page_hashes.py"), str(d / "docs"), str(d / "p.json"), str(d / "c.json")], check=True, capture_output=True)
            self.assertEqual(json.loads((d / "c.json").read_text()), {"/x/": content_hash(FULL)})
            self.assertEqual(sorted(json.loads((d / "p.json").read_text())), ["/x/", "/x/roh.html"])


class _Resp:
    status = 200
    def __enter__(self): return self
    def __exit__(self, *a): return False


def run_purge(old, new, oc, nc, fail=()):
    """tools/purge_changed.py wie im Deploy-Schritt, aber ohne Cloudflare-Token und mit abgefangenem Netz. Rueckgabe: (urlList je IndexNow-Aufruf, Ausgabe)."""
    posts = []

    def fake(req, timeout=None):
        if req.full_url != "https://api.indexnow.org/indexnow": raise AssertionError("unerwarteter Aufruf: " + req.full_url)
        body = json.loads(req.data); posts.append(body["urlList"])
        if (body["host"], body["key"], body["keyLocation"]) != ("www.m365.fm", "testkey", "https://www.m365.fm/testkey.txt"): raise AssertionError("falscher Kopf")
        if len(posts) in fail: raise OSError("HTTP Error 429: Too Many Requests")
        return _Resp()
    with tempfile.TemporaryDirectory() as d:
        fs = {}
        for name, val in (("old", old), ("new", new), ("oc", oc), ("nc", nc)):
            fs[name] = str(Path(d) / (name + ".json")); Path(fs[name]).write_text(json.dumps(val), "utf-8")
        env = {k: v for k, v in os.environ.items() if k not in ("CLOUDFLARE_API_TOKEN", "CF_ZONE_ID")}
        env.update(BASE="https://www.m365.fm", INDEXNOW_KEY="testkey", OLD_CONTENT=fs["oc"], NEW_CONTENT=fs["nc"])
        out = io.StringIO()
        with mock.patch.dict(os.environ, env, clear=True), mock.patch.object(sys, "argv", ["purge_changed.py", fs["old"], fs["new"]]), \
                mock.patch("urllib.request.urlopen", fake), contextlib.redirect_stdout(out), warnings.catch_warnings():
            warnings.simplefilter("ignore", ResourceWarning)   # das Skript schliesst seine JSON-Dateien nicht ausdruecklich (Einmal-Lauf)
            runpy.run_path(str(ROOT / "tools" / "purge_changed.py"), run_name="__main__")
    return posts, out.getvalue()


class PurgeChanged(unittest.TestCase):
    def state(self, n):
        """n Seiten mit geaendertem Hauptinhalt, dazu 2 neue, 2 entfallene, 1 nur mit geaenderter Sidebar."""
        oc = {f"/p{i}/": "h" for i in range(n)}; nc = {u: "h2" for u in oc}
        oc.update({"/weg1/": "h", "/weg2/": "h", "/nur-sidebar/": "h"}); nc.update({"/neu1/": "n", "/neu2/": "n", "/nur-sidebar/": "h"})
        return {u: "1" for u in oc}, {u: "2" for u in nc}, oc, nc

    def test_everything_reported_in_batches(self):
        n = 2 * MAX_INDEXNOW + 1
        old, new, oc, nc = self.state(n)
        posts, out = run_purge(old, new, oc, nc)
        self.assertEqual([len(p) for p in posts], [MAX_INDEXNOW, MAX_INDEXNOW, 5])   # je Aufruf hoechstens 10.000, zusammen alle
        urls = [u for p in posts for u in p]
        self.assertEqual(len(set(urls)), n + 4)
        self.assertEqual(set(urls), {"https://www.m365.fm" + u for u in list(nc) + ["/weg1/", "/weg2/"]} - {"https://www.m365.fm/nur-sidebar/"})
        self.assertEqual(urls[-4:], ["https://www.m365.fm/neu1/", "https://www.m365.fm/neu2/", "https://www.m365.fm/weg1/", "https://www.m365.fm/weg2/"])   # Inhalt vor neu vor entfallen
        self.assertIn(f"Inhalt geaendert {n}", out); self.assertIn("nur Boilerplate uebersprungen 1", out); self.assertNotIn("abgeschnitten", out)
        self.assertEqual(out.count("Seiten gemeldet"), 3)

    def test_failed_batch_does_not_stop_the_rest(self):
        old, new, oc, nc = self.state(2 * MAX_INDEXNOW + 1)
        posts, out = run_purge(old, new, oc, nc, fail=(2,))
        self.assertEqual([len(p) for p in posts], [MAX_INDEXNOW, MAX_INDEXNOW, 5])
        self.assertEqual(out.count("Seiten gemeldet"), 2)
        err = [l for l in out.splitlines() if l.startswith("IndexNow-Fehler")]
        self.assertEqual(len(err), 1); self.assertIn("429", err[0]); self.assertIn(f"{MAX_INDEXNOW} Seiten nicht gemeldet", err[0])

    def test_small_change_one_call(self):
        old, new, oc, nc = self.state(3)
        posts, out = run_purge(old, new, oc, nc)
        self.assertEqual(posts, [["https://www.m365.fm" + u for u in ("/p0/", "/p1/", "/p2/", "/neu1/", "/neu2/", "/weg1/", "/weg2/")]])

    def test_deploy_step_end_to_end(self):
        """Wie im Deploy: page_hashes.py ueber alten und neuen Bau, dann purge_changed.py. Gemeldet wird, was Suchmaschinen betrifft - auch reine Kopf-Aenderungen."""
        def pg(title="T", desc="D", robots="index,follow", body="Text", css="aaaaaaaaaa", side="Folge A"):
            return (f'<!doctype html><html><head><title>{title}</title><meta name="description" content="{desc}"><meta name="robots" content="{robots}">'
                    f'<link rel="stylesheet" href="https://www.m365.fm/assets/site.{css}.css"></head><body><header>Nav</header><main><h1>H</h1><p>{body}</p>'
                    f'<aside class="sbar">{side}</aside></main><footer>Stand {css}</footer></body></html>')
        old = {"p1": pg(), "p2": pg(), "p3": pg(), "p4": pg(), "de/blog/x": pg(robots="noindex,follow"), "weg": pg()}
        new = {"p1": pg(body="Text neu", css="bbbbbbbbbb"), "p2": pg(title="T neu", desc="D neu", css="bbbbbbbbbb"), "p3": pg(), "p4": pg(css="bbbbbbbbbb", side="Folge B"),
               "de/blog/x": pg(robots="index,follow", css="bbbbbbbbbb"), "neu": pg(css="bbbbbbbbbb")}
        with tempfile.TemporaryDirectory() as d:
            h = {}
            for name, pages in (("old", old), ("new", new)):
                for u, html in pages.items(): (Path(d) / name / u).mkdir(parents=True); (Path(d) / name / u / "index.html").write_text(html, "utf-8")
                subprocess.run([sys.executable, str(ROOT / "tools" / "page_hashes.py"), str(Path(d) / name), str(Path(d) / (name + "-p.json")), str(Path(d) / (name + "-c.json"))], check=True, capture_output=True)
                h[name] = [json.loads((Path(d) / (name + x)).read_text()) for x in ("-p.json", "-c.json")]
        posts, out = run_purge(h["old"][0], h["new"][0], h["old"][1], h["new"][1])
        self.assertEqual(posts, [["https://www.m365.fm" + u for u in ("/de/blog/x/", "/p1/", "/p2/", "/neu/", "/weg/")]])   # /p3/ unveraendert, /p4/ nur Stylesheet, Sidebar, Fuss
        self.assertIn("IndexNow: neu 1, entfallen 1, Inhalt geaendert 3, nur Boilerplate uebersprungen 1", out)

    def test_first_run_reports_nothing(self):
        old, new, oc, nc = self.state(3)
        posts, out = run_purge(old, new, {}, nc)
        self.assertEqual(posts, []); self.assertIn("erster Lauf", out)


if __name__ == "__main__":
    unittest.main()
