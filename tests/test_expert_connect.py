"""Expert Connect (site_expert_connect): Seiten EN/DE, noindex, Themenliste ohne Personen, Skript und Konfiguration."""
import json
import unittest

import site_expert_connect as ECN


class ExpertConnectPageTests(unittest.TestCase):
    def build(self):
        out = {}
        g = dict(write=lambda p, c: out.__setitem__(p, c), header=lambda lang, x: "<header></header>", footer=lambda lang: "<footer></footer>",
                 page=lambda lang, title, desc, url, body, alts, ld, **kw: json.dumps({"title": title, "url": url, "noindex": kw.get("noindex"), "body": body}),
                 BASE="https://www.m365.fm", api="https://api-dub.m365.fm")
        ents = {"copilot": {"id": "copilot", "type": "product", "name": "Copilot"}, "mirko-peters": {"id": "mirko-peters", "type": "person", "name": "Mirko Peters"},
                "governance": {"id": "governance", "type": "concept", "name": "Governance"}}
        ECN.build(g, ents, [["en", "English"], ["de", "Deutsch"]])
        return out

    def test_pages_and_topics(self):
        out = self.build()
        self.assertIn("community/expert-connect/index.html", out)
        self.assertIn("de/community/expert-connect/index.html", out)
        topics = json.loads(out["community/expert-connect/topics.json"])
        self.assertEqual([t[0] for t in topics], ["copilot", "governance"])   # keine Personen
        for p in ("community/expert-connect/index.html", "de/community/expert-connect/index.html"):
            page = json.loads(out[p])
            self.assertTrue(page["noindex"])
            self.assertIn("expert-connect.js", page["body"])
            self.assertIn('data-tab="mod" hidden', page["body"])   # Moderation nur fuer Admins sichtbar
            self.assertIn("window.M365EC=", page["body"])

    def test_copy_complete(self):
        self.assertEqual(set(ECN.T["en"]), set(ECN.T["de"]))


if __name__ == "__main__":
    unittest.main()
