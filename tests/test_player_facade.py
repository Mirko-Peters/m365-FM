"""Player erst nach Klick (site_player.py, assets/page.js): kein iframe im ersten HTML der Folgenseiten, feste Masse des Platzhalters (kein CLS),
Link ohne JavaScript, strukturierte Daten unveraendert. Dazu die Ladezeit-Regeln: sbar.css im Hash-Bundle, Bewegung auf dem Handy reduziert,
erstes Inhaltsbild nicht lazy."""
import json
import re
import sys
import tempfile
import unittest
from html.parser import HTMLParser
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_player as PL   # noqa: E402
import site_img_dims as IMG   # noqa: E402

BASE = "https://www.m365.fm"


class Tags(HTMLParser):
    def __init__(self, src):
        super().__init__(); self.tags = []; self.feed(src)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


def _g(pages, schemas):
    def page(lang, title, desc, url, body, alts=None, ld=None, **kw):
        schemas[url] = ld
        return body
    return dict(BASE=BASE, write=lambda p, b: pages.update({p: b}), page=page, header=lambda *a: "", footer=lambda *a: "", footer_en=lambda: "",
                LANGS={"en": (), "de": ()}, sitemap=[], TODAY="2026-11-05")


class Markup(unittest.TestCase):
    def test_no_iframe_no_third_party_image(self):
        for prov in ("youtube", "spreaker"):
            h = PL.player(prov, "abc123", "Eine Folge", "Jetzt anhören")
            tags = Tags(h).tags
            self.assertNotIn("iframe", h)
            self.assertFalse(any(t in ("iframe", "img", "script") for t, _ in tags))
            box = tags[0][1]
            self.assertEqual(box["data-mp"], prov)
            self.assertIn(re.match(r"https://([^/]+)/", box["data-src"]).group(1), PL.HOSTS)

    def test_fallback_link_with_label(self):
        tags = Tags(PL.player("youtube", "abc123", "Titel", "Video ansehen")).tags
        a = next(x for t, x in tags if t == "a")
        self.assertEqual(a["href"], "https://www.youtube.com/watch?v=abc123")
        self.assertEqual(a["class"], "mp-l")
        self.assertIn("Titel", a["aria-label"]); self.assertIn("Video ansehen", a["aria-label"])
        a = next(x for t, x in Tags(PL.player("spreaker", 42, "T", "L")).tags if t == "a")
        self.assertEqual(a["href"], "https://www.spreaker.com/episode/42")
        a = next(x for t, x in Tags(PL.player("spreaker", 42, "T", "L", link="https://www.spreaker.com/episode/x--42")).tags if t == "a")
        self.assertEqual(a["href"], "https://www.spreaker.com/episode/x--42")

    def test_fixed_dimensions(self):
        self.assertIn('class="mp mp-v"', PL.player("youtube", "v", "T", "L"))
        self.assertIn('class="mp mp-s"', PL.player("spreaker", 1, "T", "L"))
        self.assertIn('style="height:200px"', PL.player("spreaker", 1, "T", "L", height=200))
        css = PL.CSS.replace(" ", "")
        self.assertRegex(css, r"\.mp-v\{aspect-ratio:16/9")
        self.assertRegex(css, r"\.mp-s\{height:131px")
        self.assertIn(".mp>iframe{position:absolute;inset:0;width:100%;height:100%", css)   # das echte iframe fuellt genau den reservierten Platz

    def test_escaping(self):
        h = PL.player("youtube", 'x"&y', 'Titel "<script>&', "L")
        self.assertNotIn("<script>", h)
        box = Tags(h).tags[0][1]
        self.assertIn("x%22%26y", box["data-src"])
        self.assertEqual(box["data-title"], 'Titel "<script>&')

    def test_unknown_provider(self):
        with self.assertRaises(ValueError):
            PL.player("vimeo", 1, "T", "L")


class SourceTemplates(unittest.TestCase):
    """Die Folgenseiten (generate_site.py), Show-/Community-/Live-Seiten setzen kein iframe mehr ins HTML."""
    def test_no_iframe_literal_in_page_builders(self):
        for f in ("generate_site.py", "site_podcast.py", "site_video.py", "site_live.py", "site_podpage.py"):
            src = (ROOT / f).read_text("utf-8")
            self.assertIsNone(re.search(r"<iframe\b", src), f)

    def test_episode_template_uses_facade_and_keeps_jsonld(self):
        src = (ROOT / "generate_site.py").read_text("utf-8")
        self.assertIn('PL.player("spreaker", it["eid"]', src)
        self.assertIn('PL.player("youtube", vid', src)
        self.assertIn('"embedUrl": f"https://www.youtube-nocookie.com/embed/{vid}"', src)   # VideoObject unveraendert
        self.assertIn("PL.CSS", src)


class Builders(unittest.TestCase):
    def test_live_stream_page(self):
        import site_live
        pages, schemas = {}, {}
        data = {"channel": "UCx", "streams": [{"id": "abcDEF12345", "title": "Live-Test", "published": "2026-11-04", "live_status": "was_live", "description": "Hallo"}]}
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "live.json").write_text(json.dumps(data), "utf-8")
            with patch.object(site_live, "D", Path(tmp)):
                site_live.build(_g(pages, schemas))
        ep = next(b for p, b in pages.items() if p.startswith("live/abcdef12345"))
        self.assertNotIn("<iframe", ep)
        self.assertIn('data-mp="youtube"', ep)
        ld = next(v for u, v in schemas.items() if "/live/abcdef12345" in u)[0]
        self.assertEqual(ld["embedUrl"], "https://www.youtube-nocookie.com/embed/abcDEF12345")
        self.assertIn('id="live-load"', pages["live/index.html"])   # Live-Player der Uebersicht bleibt wie bisher (schon nach Klick)

    def test_community_podcast_and_video(self):
        import site_podcast, site_video
        ep = dict(handle="host", lang="en", slug="test", title='Eine "Folge"', published=1700000000, name="Host", id=1, spreaker_id=123,
                  video_id="vid12345678", ep_url="https://www.spreaker.com/episode/123")
        for mod, prov, kind in ((site_podcast, "spreaker", "podcast"), (site_video, "youtube", "video")):
            pages, schemas = {}, {}
            with patch.object(mod, "COMM_LANGS", ("en",)):
                mod.build(_g(pages, schemas), [ep], [{"handle": "host"}], "")
            body = pages[f"community/{kind}/test/index.html"]
            self.assertNotIn("<iframe", body)
            self.assertIn(f'data-mp="{prov}"', body)
            ld = schemas[f"{BASE}/community/{kind}/test/"][0]
            if prov == "youtube":
                self.assertEqual(ld["embedUrl"], "https://www.youtube.com/embed/vid12345678")
            else:
                self.assertEqual(ld["associatedMedia"]["contentUrl"], ep["ep_url"])
                self.assertIn('style="height:200px"', body)


class LoadRules(unittest.TestCase):
    def test_page_js_upgrades_facade(self):
        js = (ROOT / "assets" / "page.js").read_text("utf-8")
        self.assertIn('.mp[data-src]', js)
        self.assertIn('createElement("button")', js)
        for h in PL.HOSTS:
            self.assertIn(h, js)

    def test_sbar_css_in_bundle_not_separate(self):
        src = (ROOT / "generate_site.py").read_text("utf-8")
        self.assertIsNone(re.search(r'<link rel="stylesheet" href="\{BASE\}/assets/sbar\.css">', src))
        self.assertIsNone(re.search(r'<link rel="stylesheet" href="\{BASE\}/assets/sbar\.css">', (ROOT / "site_podpage.py").read_text("utf-8")))
        self.assertIn('SBAR_CSS = _mini_css("sbar.css")', src)
        self.assertIn("data-sbar", src)
        self.assertIn("data-sbar", (ROOT / "assets" / "attend.js").read_text("utf-8"))   # Popup laedt sbar.css nicht doppelt

    def test_community_css_not_blocking_on_episode_pages(self):
        src = (ROOT / "generate_site.py").read_text("utf-8")
        self.assertIn("{community_tags(l, vid, css_async=True)}", src)
        self.assertIn('<link rel="preload" as="style" href="{BASE}/assets/community.css" onload=', src)

    def test_entity_qa_script_loads_early(self):
        src = (ROOT / "site_entities.py").read_text("utf-8")
        self.assertIn('rootMargin:"2500px 0px"', src)   # Q&A-Bereich fuellt sich, bevor er sichtbar ist (kein Verschieben beim Scrollen)
        self.assertNotIn('rootMargin:"600px"', src)

    def test_reduced_motion(self):
        fx = (ROOT / "assets" / "fx.js").read_text("utf-8")
        self.assertIn("max-width:700px", fx.replace(" ", ""))
        sbar = (ROOT / "assets" / "sbar.css").read_text("utf-8")
        m = re.search(r"@media\s*\(max-width:62rem\),\(pointer:coarse\)\{([^@]*)\}", sbar.replace(" ", ""))
        self.assertTrue(m and "animation:none" in m.group(1))
        a11y = (ROOT / "assets" / "a11y.css").read_text("utf-8").replace(" ", "")
        self.assertIn("@media(prefers-reduced-motion:reduce)", a11y)

    def test_eager_first_image(self):
        h = '<p>x</p><img src="https://img.m365.fm/a.webp" alt="" loading="lazy"><p>y</p><img src="https://img.m365.fm/b.webp" alt="" loading="lazy">'
        out = IMG.eager_first(h)
        first, second = re.findall(r"<img[^>]*>", out)
        self.assertNotIn("lazy", first); self.assertIn('fetchpriority="high"', first)
        self.assertIn('loading="lazy"', second)
        far = "<p>" + "x" * 5000 + "</p>" + '<img src="https://img.m365.fm/a.webp" loading="lazy">'
        self.assertEqual(IMG.eager_first(far), far)   # weit unten bleibt lazy


class NoClarity(unittest.TestCase):
    """Microsoft Clarity ist entfernt (5.11.2026): kein Skript, kein Cookie-Hinweis (#cc), keine Datenschutz-Passage."""
    @classmethod
    def setUpClass(cls):
        import site_fetch
        with patch.object(site_fetch, "fetch", return_value=None):
            import generate_site
        cls.G = generate_site

    def test_page_has_no_banner_and_no_clarity(self):
        G = self.G
        with patch.object(G, "css_link", return_value=""), patch.object(G, "SW_REG", []), patch.object(G, "OGLIST", []):
            for lang in ("en", "de", "ja"):
                h = G.page(lang, "Titel", "Beschreibung", BASE + "/x/", "<main><h1>T</h1></main><footer></footer>")
                self.assertNotIn("clarity", h.lower())
                self.assertNotIn('id="cc"', h)
        self.assertFalse(hasattr(G, "consent_html") or hasattr(G, "CLARITY_ID"))

    def test_assets_and_legal_without_clarity(self):
        for f in ("assets/page.js", "site_legal.py", "sitewrk/index.js"):
            src = (ROOT / f).read_text("utf-8").lower()
            self.assertNotIn("clarity.ms", src, f)
            self.assertNotIn("getelementbyid('cc')", src, f)
        legal = (ROOT / "site_legal.py").read_text("utf-8")
        self.assertNotIn("<h2>Microsoft Clarity", legal)
        self.assertFalse((ROOT / "sitewrk" / "consent.js").exists())
        self.assertNotIn("CONSENT_COUNTRIES", (ROOT / "sitewrk" / "wrangler.toml").read_text("utf-8"))


if __name__ == "__main__":
    unittest.main()
