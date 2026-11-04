import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import site_i18n

site_i18n.remote = lambda: {}
import site_members


class PublicContributionProfileTest(unittest.TestCase):
    def test_public_contributions_render_for_rtl_and_link_schema_author(self):
        written = {}
        structured_data = {}

        def page(lang, title, desc, url, body, extra, ld, **kwargs):
            structured_data[url] = ld
            return body

        profile = {
            "handle": "anna",
            "name": "Anna",
            "public": True,
            "mvp_contributions": [{
                "id": 7,
                "title": "Public talk",
                "url": "https://example.com/talk",
                "published": 1767225600,
                "category": "Speaker/Presenter",
                "topics": ["azure"],
            }],
        }
        g = {
            "BASE": "https://www.m365.fm",
            "write": lambda path, content: written.update({path: content}),
            "page": page,
            "header": lambda *_: "",
            "footer": lambda *_: "",
            "footer_en": lambda: "",
            "sitemap": [],
            "TODAY": "2026-11-04",
            "LANGS": site_members.COMM_LANGS,
        }
        site_members.build(g, [profile], [])

        html = written["community/u/anna/index.html"]
        self.assertIn("MVP contributions", html)
        self.assertIn("Speaker/Presenter", html)
        self.assertIn("2026-01-01", html)
        self.assertIn('href="https://example.com/talk"', html)
        self.assertIn("ar/community/u/anna/index.html", written)
        self.assertIn("he/community/u/anna/index.html", written)

        graph = structured_data["https://www.m365.fm/community/u/anna/"]
        work = next(item for item in graph if item.get("@type") == "CreativeWork")
        self.assertEqual(work["author"]["@id"], "https://www.m365.fm/community/u/anna/#person")
        self.assertEqual(work["genre"], "Speaker/Presenter")


if __name__ == "__main__":
    unittest.main()
