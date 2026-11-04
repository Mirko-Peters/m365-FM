import unittest
from unittest.mock import patch

from tools import scrape_events as scraper


class EventScraperTests(unittest.TestCase):
    def test_merge_fingerprint_and_source_union(self):
        events = [
            {"sources": [{"source": "community_days", "ext_id": "a", "url": "https://example.org/event"}],
             "title": "M365 Community Day", "start": "2027-03-10", "url": "https://example.org/event",
             "sessions": [{"title": "Copilot", "speakers": [{"n": "Alex", "links": ["https://example.org/alex"]}]}],
             "speakers": [], "topics": ["copilot"]},
            {"sources": [{"source": "community_days", "ext_id": "b", "url": "https://example.org/another"}],
             "title": "M365 Community Day", "start": "2027-03-11", "url": "https://example.org/another",
             "sessions": [{"title": "Azure", "speakers": []}], "speakers": [], "topics": ["azure"]},
        ]
        merged = scraper.merge_duplicates(events)
        self.assertEqual(len(merged), 1)
        self.assertEqual({source["source"] for source in merged[0]["sources"]}, {"community_days"})
        self.assertEqual({topic for topic in merged[0]["topics"]}, {"azure", "copilot"})
        self.assertEqual(len(merged[0]["fp"]), 32)
        self.assertEqual(len(merged[0]["hash"]), 64)

    def test_relevance_requires_minimum_share_of_sessions(self):
        event = {"title": "Community event", "sessions": [
            {"title": "Microsoft Teams automation"}, {"title": "Gardening"},
        ]}
        self.assertTrue(scraper._relevance(event))
        event["sessions"].append({"title": "Cooking"})
        self.assertFalse(scraper._relevance(event))
        self.assertFalse(scraper._relevance({"title": "AI music festival"}))

    def test_community_days_is_the_only_scraping_source(self):
        event = {"sources": [{"source": "community_days", "ext_id": "event-1"}], "title": "M365 Day"}
        with patch.object(scraper, "community_events", return_value=[event]):
            self.assertEqual(list(scraper.scrape(policy_approved=True)), [event])
        with self.assertRaises(RuntimeError):
            list(scraper.scrape())
        self.assertFalse(hasattr(scraper, "_pnp"))
        self.assertFalse(hasattr(scraper, "_sessionize"))

    def test_description_filters_without_being_retained_and_old_events_are_preserved(self):
        item = scraper._normalize({"title": "Community Meetup", "description": "Microsoft Teams automation",
                                   "start": "2027-03-10", "url": "https://example.org/event"},
                                  "community_days", "calendar")
        self.assertIn("teams", item["topics"])
        self.assertNotIn("description", item)
        item["fp"] = "a" * 32
        item["hash"] = "b" * 64
        previous = [{**item, "sessions": [{"title": "Old session", "start": "", "end": "", "room": "", "speakers": []}]}]
        kept = scraper.retain_previous(previous, [])
        self.assertEqual(kept[0]["sessions"][0]["title"], "Old session")
        restored = scraper.retain_previous(kept, [item])[0]
        self.assertFalse(restored["gone"])
        self.assertEqual(restored["sessions"], [])

    def test_public_speaker_links_only_and_ics_dates(self):
        speakers = scraper._speakers([{"name": "Alex", "email": "alex@example.com",
                                       "links": ["https://example.org/alex", "mailto:alex@example.com",
                                                 "https://example.org/alex?email=alex%40example.org"]}])
        self.assertEqual(speakers, [{"n": "Alex", "links": ["https://example.org/alex"]}])
        self.assertEqual(scraper._speakers([{"name": "alex@example.com"}]), [])
        item = scraper._normalize({"title": "Event", "start": "2027-03-10",
                                   "url": "https://example.org/event?email=alex%40example.org",
                                   "organizer": "events@example.com"}, "community_days", "test")
        self.assertEqual(item["url"], "")
        self.assertEqual(item["sources"][0]["url"], "")
        self.assertEqual(item["organizer_name"], "")
        self.assertEqual(scraper._date("20271104T134107"), "2027-11-04T13:41Z")
        self.assertEqual(scraper._date("20271104"), "2027-11-04")

    def test_missing_and_cancelled_events_are_retained_as_gone(self):
        item = scraper._normalize({"title": "M365 Day", "start": "2027-03-10", "id": "event-1"}, "community_days", "events")
        item["fp"] = "a" * 32
        item["hash"] = "b" * 64
        missing = scraper.retain_previous([item], [])
        self.assertTrue(missing[0]["gone"])
        cancelled = scraper._normalize({"title": "M365 Day", "start": "2027-03-10", "status": "cancelled"},
                                       "community_days", "events")
        self.assertTrue(cancelled["gone"])
        restored = scraper.retain_previous(missing, [{**item, "gone": False}])
        self.assertFalse(restored[0]["gone"])


if __name__ == "__main__":
    unittest.main()
