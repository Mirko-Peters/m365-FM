import unittest

import site_events
from site_i18n import COMM_LANGS


class SiteEventsTest(unittest.TestCase):
    def test_external_event_uses_source_organizer_and_hides_member_actions(self):
        ev = {
            "handle": "ext-event-1", "title": "Community Event", "summary": "", "about": "",
            "start": "2027-03-10", "end": "", "mode": "online", "location": "Online", "country": "",
            "url": "https://example.org/event", "tickets_url": "", "free": True, "lang": "en", "topics": [],
            "source": "community_days", "organizer_name": "Community Organizers",
            "cfs_close": "2027-02-01",
            "organizer": {"kind": "u", "name": "Admin Name", "handle": "admin"},
            "sessions": [{"id": 1, "title": "Microsoft Teams", "abstract": "", "start": "2027-03-10T10:00",
                          "end": "", "room": "Main", "track": "", "level": "", "lang": "en", "topics": [],
                          "speakers": [{"n": "Speaker", "links": ["https://example.org/speaker"]}], "speakers_open": 0}],
        }
        writes = {}
        page_options = {}
        def page(lang, title, desc, canonical, body, *args, **kwargs):
            page_options[canonical] = kwargs
            return body
        g = {
            "BASE": "https://www.m365.fm", "write": lambda path, body: writes.__setitem__(path, body),
            "page": page,
            "header": lambda lang, active: "", "footer": lambda lang: "", "footer_en": lambda: "",
            "LANGS": {lang: (lang,) for lang in COMM_LANGS}, "sitemap": [], "TODAY": "2026-11-04",
            "api": "https://api.example",
        }
        site_events.build(g, [ev], [], [])
        page = writes["community/events/ext-event-1/index.html"]
        self.assertIn("Community Organizers", page)
        self.assertIn("Community Days", page)
        self.assertIn("Call for speakers closes", page)
        self.assertIn("01 Feb 2027", page)
        self.assertIn('href="https://example.org/speaker"', page)
        self.assertNotIn("Admin Name", page)
        self.assertNotIn("ev-reg", page)
        self.assertNotIn("Session vorschlagen", page)
        schema = site_events.event_ld(g["BASE"], ev, {}, {})
        self.assertEqual(schema["organizer"], {"@type": "Organization", "name": "Community Organizers"})
        ev["external_status"] = "gone"
        ev["external_status_at"] = 1793779200
        g["TODAY"] = "2028-01-01"
        site_events.build(g, [ev], [], [])
        self.assertIn("Cancelled or no longer listed", writes["community/events/ext-event-1/index.html"])
        self.assertTrue(page_options["https://www.m365.fm/community/events/ext-event-1/"]["noindex"])

    def test_event_export_is_paged(self):
        seen = []
        pages = [
            {"events": [{"handle": "one"}], "has_more": True},
            {"events": [{"handle": "two"}], "has_more": False},
        ]
        original = site_events._fetch_json
        site_events._fetch_json = lambda url: (seen.append(url) or pages.pop(0))
        try:
            result = site_events.fetch_events("https://api.example")
        finally:
            site_events._fetch_json = original
        self.assertEqual([x["handle"] for x in result], ["one", "two"])
        self.assertEqual(seen, [
            "https://api.example/api/events/export",
            "https://api.example/api/events/export?limit=300&offset=1",
        ])


if __name__ == "__main__":
    unittest.main()
