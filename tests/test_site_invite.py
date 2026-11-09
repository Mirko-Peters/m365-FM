import html, json, re, shutil, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_invite as SI
import check_titles as CT   # dieselben Muster wie der blockierende Schritt im Seitenbau

BASE = "https://" + ((ROOT / "domain.txt").read_text().strip() if (ROOT / "domain.txt").exists() else "www.m365.fm")   # wie check_sitemaps.py


class InvitePage(unittest.TestCase):
    P = {"handle": "max-m", "name": 'Max "<b>M</b>" & Co', "headline": "Cloud <Architect>", "lang": "de"}

    def build(self, p=None, avatar=""):
        return SI.invite_html("https://www.m365.fm", p or self.P, "https://img.m365.fm/og", avatar)

    def test_og_meta_escaped_and_image(self):
        path, doc, item = self.build()
        self.assertEqual(path, "einladung/max-m/index.html")
        self.assertIn('property="og:image" content="https://img.m365.fm/og/einladung/max-m.png"', doc)
        self.assertIn('name="twitter:card" content="summary_large_image"', doc)
        self.assertIn("lädt dich zu M365.FM ein", doc)
        self.assertNotIn("<b>M</b>", doc); self.assertNotIn("<Architect>", doc)
        self.assertIn("&lt;Architect&gt;", doc); self.assertIn("&quot;", doc)
        self.assertIn("Cloud", re.search(r'og:description" content="([^"]*)"', doc).group(1))
        self.assertEqual(item["path"], "og/einladung/max-m.png")
        self.assertNotIn("<b>M</b>", item["cover"])

    def test_language_follows_profile(self):
        _, en, _ = self.build({**self.P, "lang": "en"})
        self.assertIn("invites you to M365.FM", en); self.assertIn('<html lang="en">', en)

    def test_noindex_canonical_and_crawler_vs_browser(self):
        _, doc, _ = self.build()
        self.assertIn('name="robots" content="noindex,follow"', doc)
        self.assertIn('rel="canonical" href="https://www.m365.fm/community/"', doc)
        head = doc.split("</head>")[0]
        self.assertNotIn("http-equiv", head.lower())   # kein Meta-Refresh: Crawler bleiben auf der Seite mit den OG-Tags
        script = re.search(r"<script>(.*?)</script>", doc, re.S).group(1)   # Browser: Ref merken, dann weiter zu /community/
        self.assertIn('localStorage.setItem("m365_ref"', script); self.assertIn("location.replace", script)

    @unittest.skipUnless(shutil.which("node"), "node fehlt")
    def test_inline_script_keeps_first_click_of_same_inviter(self):
        """320-2: derselbe Einlader bleibt mit dem ersten Zeitpunkt gemerkt (ein erneuter Aufruf darf ihn nicht hinter die Kontoanlage schieben);
        ein anderer Einlader, ein abgelaufener oder ein kaputter Eintrag wird ersetzt."""
        _, doc, _ = self.build()
        script = re.search(r"<script>(.*?)</script>", doc, re.S).group(1)
        js = """const vm = require("node:vm"), script = process.argv[1], out = [];
const run = (stored, now) => { const mem = stored == null ? {} : { m365_ref: stored }; let to = "";
  vm.runInNewContext(script, { localStorage: { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = v; } }, location: { replace: (u) => { to = u; } }, Date: { now: () => now * 1000 }, JSON, Math });
  return [JSON.parse(mem.m365_ref), to]; };
const T = 1794000000, D = 86400;
out.push(run(null, T));
out.push(run(JSON.stringify({ r: "max-m", t: T - 60, k: "beleg" }), T));
out.push(run(JSON.stringify({ r: "anna-b", t: T - 60 }), T));
out.push(run(JSON.stringify({ r: "max-m", t: T - 31 * D }), T));
out.push(run("{kaputt", T));
out.push(run(JSON.stringify({ r: "max-m", t: T + 3 * D }), T));
console.log(JSON.stringify(out));"""
        r = subprocess.run(["node", "-e", js, script], capture_output=True, text=True, timeout=60)
        self.assertEqual(r.returncode, 0, r.stderr)
        T = 1794000000; neu = {"r": "max-m", "t": T}
        first, same, other, expired, broken, future = json.loads(r.stdout)
        self.assertEqual(first, [neu, "https://www.m365.fm/community/?ref=max-m"])
        self.assertEqual(same[0], {"r": "max-m", "t": T - 60, "k": "beleg"}, "erster Klick und Klick-Beleg bleiben")
        self.assertEqual(other[0], neu); self.assertEqual(expired[0], neu); self.assertEqual(broken[0], neu); self.assertEqual(future[0], neu)
        for x in (same, other, expired, broken, future):
            self.assertEqual(x[1], "https://www.m365.fm/community/?ref=max-m")

    def test_no_external_scripts(self):
        _, doc, _ = self.build()
        self.assertEqual(re.findall(r"<script[^>]+src=", doc), [])
        self.assertNotIn("https://platform", doc)


def rules(doc):
    """Die Fehlerregeln von check_titles.py auf eine Seite angewandt: Liste der Verstoesse."""
    m = CT.TITLE.search(doc); t = html.unescape(m.group(1)).strip() if m else ""
    d = CT.DESC.search(doc); dd = html.unescape(d.group(1)) if d else ""
    bad = []
    if not t: bad.append("Titel fehlt")
    if len(CT.BRAND.findall(t)) > 1: bad.append(f"Marke doppelt: {t}")
    if len(t) > 85: bad.append(f"Titel {len(t)} Zeichen")
    if not dd.strip(): bad.append("Beschreibung fehlt")
    if len(dd) > 165: bad.append(f"Beschreibung {len(dd)} Zeichen")
    return bad


def sample():
    """Realistische Stichprobe: die Profile des letzten Exports (data/members_export.json) plus Grenzfaelle fuer Namen, Kurzvorstellung und Kuerzel."""
    f = ROOT / "data" / "members_export.json"
    people = [dict(p) for p in (json.loads(f.read_text("utf-8")).get("people", []) if f.exists() else [])]
    long_head = "Microsoft MVP | Power Automate & Copilot Studio for SMBs in Switzerland | Founder of KMUpower and many more things to say"
    people += [
        {"handle": "max-m", "name": "Max M.", "headline": "", "lang": "de", "public": True},
        {"handle": "a" * 39, "name": "Dr. Maximiliane-Sophie von Hohenzollern-S.", "headline": long_head, "lang": "de", "img": 7, "public": True},   # 40 Zeichen: laengster Anzeigename (cleanName)
        {"handle": "long-en", "name": "Bartholomew Montgomery-Featherstonehaugh", "headline": long_head, "lang": "en", "public": True},
        {"handle": "brand-1", "name": "M365.FM Team", "headline": "Wir sind M365 FM", "lang": "de", "public": True},
        {"handle": "brand-2", "name": "M365 FM @ m365.fm", "headline": "", "lang": "en", "public": True},
        {"handle": "quotes", "name": 'Zoë "Z" <b>O\'Neil</b> & Söhne', "headline": "Cloud <Architect> – Größe & Maß", "lang": "de", "public": True},
        {"handle": "too-long", "name": "N" * 200, "headline": "H" * 400, "lang": "en", "public": True},   # aeltere gespeicherte Exporte: nichts ist garantiert
        {"handle": "no-name", "lang": "en", "public": True},
    ]
    return people


class BuildChecks(unittest.TestCase):
    def test_title_once_branded_and_lengths_for_de_and_en(self):
        """320-1: Marke genau einmal im <title>, Titel <= 85, meta description <= 165 Zeichen - fuer jede Stichprobe in beiden Sprachen."""
        for p in sample():
            for lang in ("de", "en"):
                _, doc, item = SI.invite_html(BASE, {**p, "lang": lang}, "https://img.m365.fm/og")
                self.assertEqual(rules(doc), [], (p["handle"], lang))
                self.assertNotIn("| M365.FM", CT.TITLE.search(doc).group(1))
                self.assertEqual(html.unescape(CT.TITLE.search(doc).group(1)), item["title"])
        _, doc, _ = SI.invite_html(BASE, {"handle": "max-m", "name": "Max M.", "headline": "Cloud Architect", "lang": "de"}, "https://img.m365.fm/og")
        self.assertEqual(html.unescape(CT.TITLE.search(doc).group(1)), "Max M. lädt dich zu M365.FM ein")
        self.assertTrue(html.unescape(CT.DESC.search(doc).group(1)).endswith("Cloud Architect"), "kurze Kurzvorstellung bleibt in der Beschreibung")

    def test_build_only_public_profiles_with_valid_handle(self):
        """Entscheidung (b): Seite und Karte nur fuer oeffentliche Profile; ohne Eintrag im Export entsteht nichts."""
        out, og = {}, []
        g = dict(BASE=BASE, OG_BASE="https://img.m365.fm/og", OGLIST=og, write=lambda rel, doc: out.__setitem__(rel, doc), api="https://api.test")
        n = SI.build(g, [{"handle": "max-m", "name": "Max", "img": 5, "public": True}, {"handle": "privat", "name": "P", "public": False}, {"handle": "privat-0", "name": "P0", "public": 0},
                         {"handle": "Gross", "name": "G", "public": True}, {"handle": "", "name": "leer", "public": True}, {"name": "ohne", "public": True}])
        self.assertEqual(n, 1)
        self.assertEqual(sorted(out), ["einladung/max-m/index.html"])
        self.assertEqual([x["path"] for x in og], ["og/einladung/max-m.png"])
        self.assertIn('src="https://api.test/api/img/u/max-m.jpg?v=5"', og[0]["cover"])

    def test_real_check_scripts_pass_on_built_invite_pages(self):
        """Entscheidung (a): die echten, im Seitenbau blockierenden Pruefskripte laufen ueber einen Bau mit Einladungsseiten ohne Fehler
        (check_titles.py brach vorher mit "Marke doppelt im Titel" und "Beschreibung ueber 165 Zeichen" ab - kein Deploy)."""
        with tempfile.TemporaryDirectory() as tmp:
            docs = Path(tmp) / "docs"; og = []
            def write(rel, content):
                f = docs / rel; f.parent.mkdir(parents=True, exist_ok=True); f.write_text(content, "utf-8")
            page = lambda title, path: (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title><meta name="description" content="{title}">'
                                        f'<link rel="canonical" href="{BASE}{path}"></head><body><h1>{title}</h1><a href="{BASE}/community/">Community</a></body></html>')
            write("index.html", page("M365.FM", "/")); write("community/index.html", page("Community | M365.FM", "/community/"))
            write("sitemap.xml", f'<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>{BASE}/sitemap-en.xml</loc></sitemap></sitemapindex>')
            write("sitemap-en.xml", '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
                  + "".join(f"<url><loc>{BASE}{u}</loc><lastmod>2026-11-09</lastmod></url>" for u in ("/", "/community/")) + "</urlset>")
            people = sample()
            n = SI.build(dict(BASE=BASE, OG_BASE="https://img.m365.fm/og", OGLIST=og, write=write, api="https://api-dub.m365.fm"), people)
            self.assertEqual(n, len(people)); self.assertEqual(len(list(docs.glob("einladung/*/index.html"))), n)
            self.assertNotIn("/einladung/", (docs / "sitemap-en.xml").read_text("utf-8"))   # noindex-Seiten stehen in keiner Sitemap

            def check(script, patch=""):
                # Skripte mit Verzeichnis-Argument direkt; die anderen kennen nur docs/ neben sich: Modul laden, Zielordner setzen, main() ausfuehren
                cmd = ([sys.executable, "-B", "-c", f"import sys, pathlib; sys.path.insert(0, {str(ROOT)!r}); import {script} as c; {patch}; sys.exit(c.main())", str(docs)] if patch
                       else [sys.executable, "-B", str(ROOT / f"{script}.py"), str(docs), str(Path(tmp) / "r2out")])
                r = subprocess.run(cmd, capture_output=True, text=True, cwd=ROOT, timeout=300)
                self.assertEqual(r.returncode, 0, f"{script}: {r.stdout}{r.stderr}")
                return r.stdout
            out = check("check_titles", "c.ROOT = pathlib.Path(sys.argv[1]).parent")
            self.assertIn(f"{n + 2} Seiten geprueft: 0 Fehler", out)
            self.assertNotIn("FEHLER", check("check_schema"))
            self.assertIn("0 Fehler", check("check_sitemaps", "c.DOCS = pathlib.Path(sys.argv[1])"))
            self.assertIn(f"{n + 2} Seiten geprueft: 0 Mojibake", check("check_encoding", "c.DOCS = pathlib.Path(sys.argv[1])"))
            self.assertIn("OK: kein interner Link", check("check_redirect_links"))


if __name__ == "__main__":
    unittest.main()
