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

    def test_role_based_hero_and_navigation(self):
        out = self.build()
        cases = {
            "community/expert-connect/index.html": {
                "find": "Find experts", "request": "Post a request", "expert": "Are you an expert? See open calls",
                "group_seek": "I need an expert", "group_expert": "I am an expert",
                "title": "Expert Connect: find experts or post a request",
            },
            "de/community/expert-connect/index.html": {
                "find": "Experten finden", "request": "Anfrage ausschreiben", "expert": "Du bist Experte? Offene Aufrufe ansehen",
                "group_seek": "Ich suche Experten", "group_expert": "Ich bin Experte",
                "title": "Expert Connect: Experten finden oder Anfrage ausschreiben",
            },
        }
        for path, text in cases.items():
            page = json.loads(out[path])
            body = page["body"]
            lang = "de" if path.startswith("de/") else "en"
            self.assertEqual(page["title"], text["title"])
            self.assertEqual(ECN.T[lang]["desc"], text["title"])
            self.assertIn(f'<h1>{ECN.T[lang]["h1"]}</h1>', body)
            self.assertIn(f'href="#search">{text["find"]}</a>', body)
            self.assertIn(f'href="#request">{text["request"]}</a>', body)
            self.assertIn(f'href="#calls">{text["expert"]}</a>', body)
            self.assertIn(f'<span class="ec-group-h">{text["group_seek"]}</span>', body)
            self.assertIn(f'<span class="ec-group-h">{text["group_expert"]}</span>', body)
            for tab in ("search", "request", "requests", "expert", "calls", "mod"):
                self.assertIn(f'data-tab="{tab}"', body)
            self.assertIn('data-tab="mod" hidden', body)
        self.assertEqual(ECN.T["en"]["tab_request"], "Post a request")
        self.assertEqual(ECN.T["de"]["tab_request"], "Anfrage ausschreiben")


if __name__ == "__main__":
    unittest.main()


class HowItWorksTests(unittest.TestCase):
    """Mirko, 5.11.2026: Erklaerung, wie Expert Connect funktioniert."""
    def test_how_section(self):
        out = ExpertConnectPageTests().build()
        for path, lang in (("community/expert-connect/index.html", "en"), ("de/community/expert-connect/index.html", "de")):
            body = json.loads(out[path])["body"]
            self.assertIn('id="how"', body)
            self.assertIn(ECN.T[lang]["how_h"], body)
            self.assertEqual(body.count("<li>"), 8)
            self.assertLess(body.index('id="how"'), body.index('class="ec-tabs"'))
