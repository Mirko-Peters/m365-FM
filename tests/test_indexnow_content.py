import contextlib, html as _html, io, json, os, random, re, runpy, subprocess, sys, tempfile, unittest, warnings
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import content_hash as CH
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



# Vergleichsfassung: Kopf-Felder und Hauptinhalt mit den naheliegenden Regex-Einzeilern. Sie legt fest, was herauskommen muss (auch bei kaputtem HTML), ist dort aber
# quadratisch langsam - tools/content_hash.py liest dasselbe in einem Durchgang.
def ref_head(html):
    m = re.search(r"</head\s*>|<body\b", html, re.I) or re.search(r"<main\b|<article\b", html, re.I)
    h = re.sub(r"<!--.*?-->|<(script|style)\b.*?</\1\s*>", "", html[:m.start()] if m else "", flags=re.S | re.I)
    t = re.search(r"<title\b[^>]*>(.*?)</title\s*>", h, re.S | re.I)
    f = {"title": _html.unescape(t.group(1)) if t else ""}
    for tag, rest in re.findall(r"""<(meta|link)\b((?:"[^"]*"|'[^']*'|[^>"'])*)>""", h, re.I):
        a = {k.lower(): _html.unescape(v1 or v2 or v3) for k, v1, v2, v3 in re.findall(r"""([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>]+))""", rest)}
        if tag.lower() == "meta" and a.get("name", "").lower() in ("description", "robots"): f.setdefault(a["name"].lower(), a.get("content", ""))
        elif tag.lower() == "link" and "canonical" in a.get("rel", "").lower().split(): f.setdefault("canonical", a.get("href", ""))
    return " | ".join(re.sub(r"\s+", " ", f.get(k, "")).strip() for k in ("title", "description", "robots", "canonical"))


def ref_extract(html):
    html = re.sub(r"<!--.*?-->", "", html, flags=re.S)
    for tag in ("main", "article", "body"):
        m = re.search(rf"<{tag}\b[^>]*>(.*)</{tag}>", html, re.S | re.I)
        if m: html = m.group(1); break
    p = CH._P(); p.feed(html)
    return "".join(p.cur)


BROKEN = [   # kaputtes HTML, von Hand: Anfaenge ohne Ende, Anfuehrungszeichen ohne Partner, Tags ohne ">"
    '<head><meta name="x" content="offen\n<meta name="robots" content="noindex"><link rel="canonical" href="/a/"></head>',
    '<head><meta name="x" content="a\n<meta name="y" content="b\n<meta name="robots" content="noindex"></head>',
    "<head><meta name='x' content=\"a'\n<meta name=\"robots\" content='noindex'><meta name=description content=D></head>",
    '<head><meta a="\'" b=\'<meta name="robots" content="noindex">\'<meta name="description" content="D"></head>',
    '<head><meta name="robots" content="noindex"<meta name="description" content="D"></head>',
    '<head><meta name="robots" content="a>b"><meta name="description" content=\'c>d\'><link rel=canonical href=/x/></head>',
    '<head><meta <meta <link "<meta name="robots" content="noindex">" \'<link rel="canonical" href="/a/">\'></head>',
    '<head><title>A<title>B</title><title>C</title></head>', '<head><title <title>B</title></head>', '<head><title>A</head><body><main>x</main></body>', '<head><title a="b>c">d</TITLE ></head>',
    '<head><!-- offen <title>A</title><meta name="robots" content="noindex"></head>', '<head><!-- a --><title>A</title><!-- offen <!-- b --><meta name="robots" content="noindex"></head>',
    '<head><script>x<title>A</title><meta name="robots" content="noindex"></head>', '<head><script>a</script><style>offen<title>A</title><script>b</SCRIPT ><meta name="robots" content="noindex"></head>',
    '<head><style>a</style><script>offen <style>b</style><!-- c --><title>A</title></head>', '<head><!-- <script> --><title>A</title></script><meta name=robots content=noindex></head>',
    '<head><meta namenamename name="robots" content = "noindex" /><meta name=description content=a=b></head>', '<head><meta name="robots"content="noindex"x=y z = \'1\'></head>',
    '<main>A <main>B</main> C', '<main>A</main> B </main> C', '<main <main>A</main>', '<main>A <article>B</article> C</body>', '<article>A <main>B', '<body>A <!-- offen <main>B</main> C</body>',
    '<body><main>A <!-- b --> C <!-- offen </main> D</body>', '<p>ohne Wurzel <!-- a --> <a href="/x/?v=1">L</a>', '</main><main>A', '<MAIN class="a>b">C</Main>', '<main>A</main',
]
FRAG = ["<meta ", "<meta", "<link ", "<LINK ", "<metadata ", '"', '"', "'", "'", ">", ">", "<", " ", "\n", "=", "/", "name", "content", "rel", "href", "description", "robots", "canonical", "noindex", "Text",
        "&amp;", "<title>", "<title ", "</title>", "</TITLE\n>", "<!--", "-->", "<script>", "<script ", "</script>", "</SCRIPT >", "<style>", "</style>", "</head>", "<body>", "<main>", "<main ", "</main>", "</MAIN>",
        "<article>", "</article>", "</body>", "<p>", "</p>", "<a href=", "/assets/x.png?v=1", "<aside>", "</aside>", 'name="description"', 'name="robots"', 'content="', "content='", 'rel="canonical"', 'href="/a/"']


def broken_forms(n, a="a" * 50):
    """n kaputte Anfaenge je Form: (Name, Funktion, Seite). Ausser bei den offenen Anfuehrungszeichen (dort kaeme sonst ein Tag-Ende, und alles waere ein einziges Tag)
    steht dahinter ein echtes robots-Tag."""
    d = lambda head, body="<main>x</main>", tail='<meta name="robots" content="noindex">': "<html><head>" + head + tail + "</head><body>" + body + "</body></html>"
    return [("Anfuehrungszeichen offen", CH._head, d(('<meta name="x" content="' + a + "\n") * n, tail="")), ("einfache Anfuehrungszeichen offen", CH._head, d(("<link rel='canonical' href='" + a) * n, tail="")),
            ("Tag ohne Ende", CH._head, d("<meta x y z " * n + '"')), ("Kommentar offen", CH._head, d(("<!-- " + a) * n)), ("Skript offen", CH._head, d(("<script>" + a) * n)),
            ("Style offen", CH._head, d(("<style>" + a) * n)), ("Titel offen", CH._head, d(("<title>" + a) * n)), ("Titel ohne Ende", CH._head, d(("<title " + a) * n).replace(">", "") + "</head>"),
            ("langer Attributname", CH._head, d("<meta " + "a" * (10 * n) + ">")), ("Kommentar offen im Rumpf", CH._extract, d("", "<main>" + ("<!-- " + a) * n + "</main>")),
            ("main offen", CH._extract, d("", ("<main>" + a) * n)), ("main ohne Ende", CH._extract, "<html><body>" + ("<main " + a) * n)]


def zeitprobe(n):
    """Laeuft in einem eigenen Prozess (test_broken_html_is_read_in_one_pass): je Form eine Zeile [Name, Sekunden, Zeichen, Ergebnis-Anfang]."""
    import time
    for name, f, page in broken_forms(n):
        t = time.perf_counter(); r = f(page); print(json.dumps([name, round(time.perf_counter() - t, 3), len(page), r[:40]]), flush=True)


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

    # ---- Kaputtes HTML: gleiches Ergebnis wie die Regex-Einzeiler, aber in einem Durchgang
    def test_broken_html_same_result_as_reference(self):
        r = random.Random(312); cases = list(BROKEN) + [x * 30 for x in BROKEN[:8]] + [page for n in (1, 2, 40, 41) for _, _, page in broken_forms(n, "a b")]
        for i in range(4000):
            x = "".join(r.choice(FRAG) for _ in range(r.randint(1, 60)))
            cases.append(x if i % 3 else "<html><head>" + x.replace("</head>", "").replace("<body>", "") + "</head><body><main>" + "".join(r.choice(FRAG) for _ in range(r.randint(0, 12))) + "</main></body></html>")
        fields = 0
        for x in cases + [FULL, PAGE]:
            a = ref_head(x); fields += a != " |  |  | "
            if a != CH._head(x) or ref_extract(x) != CH._extract(x):   # subTest nur im Fehlerfall: 4.000 Unterfaelle waeren sonst nur Ballast
                with self.subTest(x[:300]): self.assertEqual(CH._head(x), a); self.assertEqual(CH._extract(x), ref_extract(x))
        self.assertGreater(fields, 300)   # die Zufallsfaelle treffen wirklich Kopf-Felder
        self.assertEqual(CH._head(BROKEN[0]), " |  | noindex | /a/"); self.assertEqual(CH._head(BROKEN[5]), " | c>d | a>b | /x/"); self.assertEqual(CH._head(BROKEN[7]), "A<title>B |  |  | ")

    def test_broken_html_is_read_in_one_pass(self):
        # 20.000 kaputte Anfaenge je Form (ueber 1 MB Kopf): die Regex-Einzeiler brauchen dafuer Minuten bis Stunden, ein Durchgang Millisekunden. Eigener Prozess mit
        # Zeitgrenze, damit ein Rueckfall den Testlauf nicht aufhaengt.
        code = "import sys; sys.path.insert(0, sys.argv[1]); import test_indexnow_content as T; T.zeitprobe(20000)"
        try: p = subprocess.run([sys.executable, "-B", "-c", code, str(ROOT / "tests")], capture_output=True, text=True, timeout=120)
        except subprocess.TimeoutExpired as e: self.fail("kaputtes HTML nach 120 s nicht gelesen; fertig waren: " + str(e.stdout))
        self.assertEqual(p.returncode, 0, p.stderr[-500:])
        rows = [json.loads(l) for l in p.stdout.splitlines()]
        self.assertEqual(len(rows), 12)
        for name, secs, size, res in rows:
            with self.subTest(name): self.assertGreater(size, 100000); self.assertLess(secs, 5, f"{name}: {secs} s fuer {size} Zeichen")
        res = {name: r for name, _, _, r in rows}
        for name in ("Tag ohne Ende", "Kommentar offen", "Skript offen", "Style offen", "Titel offen", "langer Attributname"):   # der kaputte Teil bleibt stehen, das echte Tag dahinter zaehlt
            with self.subTest(name): self.assertEqual(res[name], " |  | noindex | ")

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


def run_purge(old, new, oc, nc, fail=(), r2keys=None):
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
        if r2keys is not None: Path(d, "k.json").write_text(json.dumps(r2keys), "utf-8"); env["R2_KEYS"] = str(Path(d, "k.json"))
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

    def test_r2out_pages_first_run_and_after(self):
        """11.11.2026: Sprachseiten ausser en/de liegen nur in r2out/. page_hashes.py nimmt sie mit (Merker /__r2out__): aus docs/ umgezogene Seiten gelten nicht
        als entfallen, schon vorher nur in R2 liegende nicht als neu (kein Schwall), echte neue und geaenderte Seiten dort gehen danach an IndexNow."""
        with tempfile.TemporaryDirectory() as d:
            d = Path(d)
            def build(name, docs, r2out):
                for base, pages in (("docs", docs), ("r2out", r2out)):
                    for u, body in (pages or {}).items(): p = d / name / base / u / "index.html"; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(f"<html><head><title>{body}</title></head><body><main><p>{body}</p></main></body></html>", "utf-8")
                args = [str(d / name / "docs"), str(d / (name + "-p.json")), str(d / (name + "-c.json"))] + ([str(d / name / "r2out")] if r2out is not None else [])
                subprocess.run([sys.executable, str(ROOT / "tools" / "page_hashes.py"), *args], check=True, capture_output=True)
                return [json.loads((d / (name + x)).read_text()) for x in ("-p.json", "-c.json")]
            a = build("a", {"en/x": "x", "ru/tag/облако": "t", "fr/old": "o"}, None)   # vor dem Umzug: alles in docs/, r2out nicht gehasht
            b = build("b", {"en/x": "x", "en/neu": "e"}, {"ru/tag/облако": "t", "fr/old": "o2", "fr/community/u/m/blog/p": "bp", "ja/neu": "n"})
            self.assertEqual(b[0]["/__r2out__"], "1"); self.assertIn("/ru/tag/облако/", b[1])
            keys = ["pages/ru/tag/облако/index.html", "pages/fr/old/index.html", "pages/fr/community/u/m/blog/p/index.html", "pages/ja/neu/index.html", "pages/search/x.json"]
            posts, out = run_purge(a[0], b[0], a[1], b[1], r2keys=keys)
            self.assertEqual(posts, [["https://www.m365.fm/fr/old/", "https://www.m365.fm/en/neu/"]], "umgezogen != entfallen, r2out-Bestand != neu, neue Seite in docs/ weiter gemeldet")
            self.assertIn("erster Lauf mit r2out/: 2 Seiten", out); self.assertIn("neu 1, entfallen 0", out)
            c = build("c", {"en/x": "x", "en/neu": "e"}, {"ru/tag/облако": "t2", "fr/old": "o2", "fr/community/u/m/blog/p": "bp", "ja/neu": "n", "ko/neu2": "k"})
            posts, out = run_purge(b[0], c[0], b[1], c[1])
            self.assertEqual(posts, [["https://www.m365.fm/ru/tag/%D0%BE%D0%B1%D0%BB%D0%B0%D0%BA%D0%BE/", "https://www.m365.fm/ko/neu2/"]])
            self.assertNotIn("erster Lauf mit r2out/", out); self.assertNotIn("__r2out__", out)

    def test_first_run_reports_nothing(self):
        old, new, oc, nc = self.state(3)
        posts, out = run_purge(old, new, {}, nc)
        self.assertEqual(posts, []); self.assertIn("erster Lauf", out)


if __name__ == "__main__":
    unittest.main()
