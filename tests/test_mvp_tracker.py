"""MVP-Tracker (#231): oeffentliche Profilansicht, Texte in allen Sprachen, App "M365.FM Contributor" (Manifest, Service Worker)."""
import json
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import site_i18n

site_i18n.remote = lambda: {}
import site_contributor
import site_members

CI = json.loads((ROOT / "data" / "community_i18n.json").read_text("utf-8"))
JS = (ROOT / "assets" / "mvp-tracker.js").read_text("utf-8")
LANGS = site_i18n.COMM_LANGS


def fake_g(written, ld):
    def page(lang, title, desc, url, body, extra=None, jsonld=None, **kw):
        ld[url] = jsonld
        return f"<head>{kw.get('extra_head', '')}</head>{body}"
    return {"BASE": "https://www.m365.fm", "write": lambda p, c: written.update({p: c}), "page": page, "header": lambda *_: "", "footer": lambda *_: "",
            "footer_en": lambda: "", "sitemap": [], "TODAY": "2026-11-05", "LANGS": site_members.COMM_LANGS}


class PublicProfileTest(unittest.TestCase):
    def test_only_exported_public_contributions_with_schema_author(self):
        written, ld = {}, {}
        profile = {"handle": "anna", "name": "Anna", "public": True, "mvp_contributions": [
            {"id": 7, "title": "Public talk", "url": "https://example.com/talk", "published": 1767225600, "category": "Speaker/Presenter", "topics": ["azure"]},
            {"id": 8, "title": "Old <b>link</b>", "url": "javascript:alert(1)", "published": 1767225600, "category": "", "topics": []},
        ]}
        site_members.build(fake_g(written, ld), [profile], [])
        html = written["community/u/anna/index.html"]
        self.assertIn("Community contributions", html)
        self.assertIn('href="https://example.com/talk" rel="nofollow ugc noopener"', html)
        self.assertIn('<time datetime="2026-01-01">', html)
        self.assertNotIn("javascript:", html, "nur https-Links")
        self.assertIn("Old &lt;b&gt;link&lt;/b&gt;", html)
        self.assertIn("Other", html, "ohne Kategorie")
        self.assertIn("Community-Beiträge", written["de/community/u/anna/index.html"])
        for rtl in ("ar", "he"):
            self.assertIn(f"{rtl}/community/u/anna/index.html", written)
        works = [x for x in ld["https://www.m365.fm/community/u/anna/"] if x.get("@type") == "CreativeWork"]
        self.assertEqual(len(works), 2)
        self.assertEqual(works[0]["author"]["@id"], "https://www.m365.fm/community/u/anna/#person")
        self.assertEqual(works[0]["genre"], "Speaker/Presenter")
        self.assertNotIn("url", works[1])

    def test_bad_date_does_not_stop_the_build(self):
        """Review #318: ein Beitrag oder Feed-Eintrag mit Millisekunden-Zeitstempel brach den Bau der Profilseiten ab."""
        written, ld = {}, {}
        profile = {"handle": "anna", "name": "Anna", "public": True,
                   "mvp_contributions": [{"id": 7, "title": "Talk", "url": "https://example.com/talk", "published": 1767225600000, "category": "", "topics": []}],
                   "items": [{"id": 3, "title": "Post", "url": "https://example.com/post", "published": 1767225600000, "kind": "blog", "votes": 0}]}
        site_members.build(fake_g(written, ld), [profile], [])
        html = written["community/u/anna/index.html"]
        self.assertIn('<time datetime="2026-01-01">', html)
        self.assertIn("Blog · 2026-01-01", html)
        works = [x for x in ld["https://www.m365.fm/community/u/anna/"] if x.get("@type") == "CreativeWork"]
        self.assertEqual(works[0]["datePublished"], "2026-01-01")

    def test_own_blog_channel_only_with_blog_page(self):
        """Review #318: der erste Kurzpost legt den Kanal /community/u/<handle>/blog/ an; ohne Blogbeitraege gibt es diese Seite nicht (toter Link, totes sameAs)."""
        chans = [{"kind": "blog", "url": "https://www.m365.fm/community/u/anna/blog/", "feed": ""}, {"kind": "youtube", "url": "https://www.youtube.com/@anna", "feed": ""}]
        only = [{"kind": "blog", "url": "https://www.m365.fm/community/u/ben/blog/", "feed": ""}]
        people = [{"handle": "anna", "name": "Anna", "public": True, "channels": chans}, {"handle": "ben", "name": "Ben", "public": True, "channels": only}]
        person = lambda ld, h: [x for x in ld[f"https://www.m365.fm/community/u/{h}/"] if x.get("@type") == "ProfilePage"][0]["mainEntity"]
        old = dict(site_members.BLOGS)
        try:
            site_members.BLOGS.clear()
            written, ld = {}, {}
            site_members.build(fake_g(written, ld), people, [])
            for lang in ("", "de/"):
                html = written[f"{lang}community/u/anna/index.html"]
                self.assertNotIn("/community/u/anna/blog/", html, "kein Link auf eine Seite, die nicht gebaut wird")
                self.assertIn("https://www.youtube.com/@anna", html, "andere Kanaele bleiben")
            self.assertEqual(person(ld, "anna")["sameAs"], ["https://www.youtube.com/@anna"])
            self.assertNotIn("Channels and links", written["community/u/ben/index.html"], "keine leere Kanal-Ueberschrift")
            self.assertNotIn("sameAs", person(ld, "ben"))
            # mit englischen Blogbeitraegen gibt es die Seite: der Kanal erscheint wie bisher; nur deutsche Beitraege reichen dafuer nicht
            site_members.BLOGS.update({"anna": {"en", "de"}, "ben": {"de"}})
            written, ld = {}, {}
            site_members.build(fake_g(written, ld), people, [])
            self.assertIn('href="https://www.m365.fm/community/u/anna/blog/" rel="me nofollow ugc noopener"', written["community/u/anna/index.html"])
            self.assertIn("https://www.m365.fm/community/u/anna/blog/", person(ld, "anna")["sameAs"])
            self.assertNotIn('href="https://www.m365.fm/community/u/ben/blog/" rel="me', written["community/u/ben/index.html"])
        finally:
            site_members.BLOGS.clear()
            site_members.BLOGS.update(old)

    def test_no_section_without_public_contributions(self):
        written, ld = {}, {}
        site_members.build(fake_g(written, ld), [{"handle": "ben", "name": "Ben", "public": True}], [])
        self.assertNotIn('id="contributions"', written["community/u/ben/index.html"])
        self.assertFalse([x for x in ld["https://www.m365.fm/community/u/ben/"] if x.get("@type") == "CreativeWork"])

    def test_profile_headings_in_all_languages(self):
        for lang in LANGS:
            self.assertTrue(site_members.S[lang]["mvp_contrib"], lang)
        self.assertEqual(site_members.S["ar"]["mvp_contrib"], "مساهمات في المجتمع")


class TrackerStringsTest(unittest.TestCase):
    def test_every_ui_key_exists_in_all_15_languages(self):
        used = set(re.findall(r'\bt\("([a-z_]+)"', JS)) - {"text", "url", "date", "number", "checkbox", "radio", "k_", "nav_", "s_k_"}
        used |= {"nav_" + v for v in re.search(r"VIEWS = \[([^\]]+)\]", JS).group(1).replace('"', "").replace(" ", "").split(",")}
        used |= {"k_" + k for k in re.search(r"var KINDS = \[([^\]]+)\]", JS).group(1).replace('"', "").replace(" ", "").split(",")}
        used |= {"s_k_" + k for k in re.search(r"var SKINDS = \[([^\]]+)\]", JS).group(1).replace('"', "").replace(" ", "").split(",")}
        used -= {"nav_inbox"}   # "Neu gefunden": Text kommt aus assets/mvp-sources.js (M365L, englische Quelle in data/ui_js_en.json)
        en = {k[4:] for k in CI["en"] if k.startswith("mvp_")}
        self.assertFalse(used - en, f"fehlende Texte: {sorted(used - en)}")
        self.assertEqual(set(CI), set(LANGS))
        for lang in LANGS:
            keys = {k[4:] for k in CI[lang] if k.startswith("mvp_")}
            self.assertEqual(keys, en, lang)
            for k in en:
                for ph in re.findall(r"\{\w\}", CI["en"]["mvp_" + k]):
                    self.assertIn(ph, CI[lang]["mvp_" + k], f"{lang}.{k}")
        self.assertNotEqual(CI["ar"]["mvp_nav_log"], CI["en"]["mvp_nav_log"])
        self.assertNotEqual(CI["he"]["mvp_d_entered"], CI["en"]["mvp_d_entered"])

    def test_ui_uses_text_nodes_and_logical_css(self):
        self.assertNotIn("innerHTML", JS)
        css = (ROOT / "assets" / "mvp-tracker.css").read_text("utf-8")
        for physical in ("margin-left", "margin-right", "padding-left", "padding-right", "text-align:left", "text-align:right", "border-left", "border-right"):
            self.assertNotIn(physical, css, physical)
        self.assertIn('"x-requested-with": "m365"', JS, "CSRF-Kopfzeile wie im Rest der Seite")
        self.assertIn('credentials: "include"', JS)


class ContributorAppTest(unittest.TestCase):
    def build(self):
        written = {}
        g = {"BASE": "https://www.m365.fm", "write": lambda p, c: written.update({p: c}), "header": lambda *_: "", "footer": lambda *_: "",
             "page": lambda lang, title, desc, url, body, **kw: f"<html lang='{lang}'><head>{kw.get('extra_head', '')}</head><body>{body}</body></html>",
             "community_tags": lambda lang: f'<script src="/assets/cm-{lang}.js"></script>', "COMMUNITY_API": "https://api-dub.m365.fm", "CI": CI, "langs": list(LANGS)}
        urls = site_contributor.build(g)
        return written, urls

    def test_manifest_valid_and_scoped_per_language(self):
        written, urls = self.build()
        self.assertEqual(len(urls), 15)
        for lang in LANGS:
            scope = "/community/contributor/" if lang == "en" else f"/{lang}/community/contributor/"
            m = json.loads(written[scope.lstrip("/") + "manifest.webmanifest"])
            for key in ("name", "short_name", "start_url", "scope", "display", "icons", "theme_color", "background_color", "id"):
                self.assertTrue(m.get(key), f"{lang}: {key}")
            self.assertEqual(m["name"], "M365.FM Contributor")
            self.assertEqual(m["scope"], scope)
            self.assertTrue(m["start_url"].startswith(scope), "start_url liegt im scope")
            self.assertIn(m["display"], ("standalone", "minimal-ui", "fullscreen"))
            self.assertTrue(any(i["sizes"] == "192x192" and i["type"] == "image/png" for i in m["icons"]))
            for icon in m["icons"]:
                self.assertTrue((ROOT / icon["src"].lstrip("/")).exists(), icon["src"])
            self.assertEqual(m["dir"], "rtl" if lang in ("ar", "he") else "ltr")
            self.assertEqual(m["theme_color"], "#3b6391")
            page = written[scope.lstrip("/") + "index.html"]
            self.assertIn(f'<link rel="manifest" href="https://www.m365.fm{scope}manifest.webmanifest">', page)
            self.assertIn('id="mvp-app"', page)
            self.assertIn("offline.html", written[scope.lstrip("/") + "sw.js"])
            self.assertIn(f'lang="{lang}"', written[scope.lstrip("/") + "offline.html"])

    def test_manifest_only_on_app_pages(self):
        src = (ROOT / "generate_site.py").read_text("utf-8")
        self.assertNotIn('rel="manifest"', src, "kein seitenweites Manifest aus diesem PR (#204 plant eines)")
        self.assertIn('<div id="c-mvp"></div>', src)

    def test_service_worker_never_caches_api(self):
        written, _ = self.build()
        sw = written["de/community/contributor/sw.js"]
        self.assertIn('url.pathname.indexOf("/api/") !== -1', sw)
        self.assertIn("url.origin !== self.location.origin", sw)
        self.assertNotIn("push", sw.split("\n", 1)[1].lower().replace("kein web-push", ""), "Web-Push bleibt bei /sw.js")
        node = shutil.which("node")
        if not node:
            self.skipTest("node fehlt")
        # Service Worker in Node ausfuehren: /api/ und fremde Hosts duerfen nie beantwortet (und damit nie gecacht) werden
        harness = r"""
const fs = require("fs"); const code = fs.readFileSync(process.argv[2], "utf8");
const listeners = {}, puts = [];
const self = { location: new URL("https://www.m365.fm/de/community/contributor/sw.js"), addEventListener: (t, f) => (listeners[t] = f), skipWaiting() {}, clients: { claim() {} } };
const caches = { open: async () => ({ put: (k) => puts.push(String(k)), add: async () => {} }), match: async () => undefined, keys: async () => [] };
global.fetch = async () => ({ ok: true, clone() { return this; } });
new Function("self", "caches", "fetch", code)(self, caches, global.fetch);
const out = [];
for (const [u, mode] of [["https://api-dub.m365.fm/api/contributions/mine", "cors"], ["https://www.m365.fm/api/contributions/mine", "cors"],
  ["https://www.m365.fm/de/community/contributor/api/x", "cors"], ["https://www.m365.fm/assets/mvp-tracker.js", "no-cors"], ["https://www.m365.fm/de/community/contributor/", "navigate"]]) {
  let responded = false;
  listeners.fetch({ request: { url: u, method: "GET", mode }, respondWith: () => { responded = true; } });
  out.push([u, responded]);
}
let post = false; listeners.fetch({ request: { url: "https://www.m365.fm/assets/mvp-tracker.js", method: "POST", mode: "cors" }, respondWith: () => { post = true; } });
out.push(["POST", post]);
setTimeout(() => console.log(JSON.stringify({ out, puts })), 20);
"""
        with tempfile.TemporaryDirectory() as d:
            tmp, swf = Path(d) / "harness.cjs", Path(d) / "sw.js"
            tmp.write_text(harness, "utf-8"); swf.write_text(sw, "utf-8")
            res = json.loads(subprocess.run([node, str(tmp), str(swf)], capture_output=True, text=True, timeout=30, check=True).stdout)
        got = dict((u, r) for u, r in res["out"])
        self.assertFalse(got["https://api-dub.m365.fm/api/contributions/mine"], "Community-API nie aus dem Service Worker")
        self.assertFalse(got["https://www.m365.fm/api/contributions/mine"])
        self.assertFalse(got["https://www.m365.fm/de/community/contributor/api/x"])
        self.assertFalse(got["POST"])
        self.assertTrue(got["https://www.m365.fm/assets/mvp-tracker.js"], "App-Huelle aus dem Cache")
        self.assertTrue(got["https://www.m365.fm/de/community/contributor/"], "Offline-Seite fuer die App")
        self.assertFalse([p for p in res["puts"] if "/api/" in p])


if __name__ == "__main__":
    unittest.main()
