import re, sys, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import site_invite as SI


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

    def test_no_external_scripts(self):
        _, doc, _ = self.build()
        self.assertEqual(re.findall(r"<script[^>]+src=", doc), [])
        self.assertNotIn("https://platform", doc)


if __name__ == "__main__":
    unittest.main()
