import os
import json
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
            {"sources": [{"source": "pnp", "ext_id": "b", "url": "https://example.org/another"}],
             "title": "M365 Community Day", "start": "2027-03-11", "url": "https://example.org/another",
             "sessions": [{"title": "Azure", "speakers": []}], "speakers": [], "topics": ["azure"]},
        ]
        merged = scraper.merge_duplicates(events)
        self.assertEqual(len(merged), 1)
        self.assertEqual({source["source"] for source in merged[0]["sources"]}, {"community_days", "pnp"})
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

    def test_global_ai_is_disabled_by_default(self):
        with patch.dict(os.environ, {}, clear=True):
            self.assertEqual(list(scraper.scrape(policy_approved=True)), [])

    def test_pnp_requires_fresh_calendar_and_only_imports_calls(self):
        stale = {"lastRetrieved": "2024-04-24T10:53:58Z", "events": []}
        with patch.object(scraper, "get", return_value=json.dumps(stale).encode()):
            self.assertEqual(scraper._pnp(), [])
        fresh = {"lastRetrieved": "2026-11-04T10:53:58Z", "events": [
            {"uid": "call-1", "summary": "Microsoft 365 Community Call", "joinUrl": "https://example.org/call",
             "startTime": "2026-11-12T10:00:00Z", "nextOccurrences": [{"date": "2026-11-12T10:00:00Z"}]},
            {"uid": "conf-1", "summary": "Microsoft Community Conference", "startTime": "2026-11-12T10:00:00Z"},
        ]}
        with patch.object(scraper, "get", return_value=json.dumps(fresh).encode()):
            events = scraper._pnp()
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["mode"], "online")
        self.assertEqual(events[0]["sources"][0]["ext_id"], "call-1:2026-11-12T10:00:00Z")

    def test_sessionize_uses_only_explicitly_published_endpoints(self):
        endpoint = "https://sessionize.com/api/v2/Published42/view/All"
        slug = "https://sessionize.com/community-event/"
        published = scraper._normalize({"title": "Microsoft Teams Event", "start": "2027-01-01",
                                         "url": "https://communitydays.org/event", "links": [endpoint, slug]},
                                        "community_days", "event-1")
        guessed = scraper._normalize({"title": "Microsoft Teams Event", "start": "2027-01-01",
                                      "url": "https://communitydays.org/event"}, "pnp", "event-1")
        self.assertIn(endpoint, scraper._sessionize_urls([published]))
        self.assertIn(slug, scraper._sessionize_urls([published]))
        self.assertEqual(scraper._sessionize_urls([guessed]), [])
        api_url = "https://sessionize.com/api/v2/Published42/view/All"
        session = scraper._session_objects([{"id": 3, "title": "Copilot in Teams", "startsAt": "2027-02-01T10:00:00Z",
                                              "endsAt": "2027-02-01T10:45:00Z", "room": "Main",
                                              "speakers": [{"name": "Alex", "links": [{"url": "https://example.org/alex"}]}],
                                              "description": "Not retained"}])
        target = dict(published, sessions=[])
        scraper._attach_sessionize([target], {api_url: {"sessions": session}})
        self.assertEqual(target["sessions"][0]["title"], "Copilot in Teams")
        self.assertEqual(target["sessions"][0]["speakers"][0]["n"], "Alex")
        self.assertNotIn("description", target["sessions"][0])
        self.assertEqual(scraper.MCP_URL, "https://mcp.communitydays.org")

    def test_description_filters_without_being_retained_and_old_events_are_preserved(self):
        item = scraper._normalize({"title": "Community Meetup", "description": "Microsoft Teams automation",
                                   "start": "2027-03-10", "url": "https://example.org/event"},
                                  "pnp", "calendar")
        self.assertIn("teams", item["topics"])
        self.assertNotIn("description", item)
        item["fp"] = "a" * 32
        item["hash"] = "b" * 64
        previous = [{**item, "sessions": [{"title": "Old session", "start": "", "end": "", "room": "", "speakers": []}]}]
        kept = scraper.retain_previous(previous, [])
        self.assertEqual(kept[0]["sessions"][0]["title"], "Old session")
        self.assertEqual(scraper.retain_previous(kept, [item])[0]["sessions"][0]["title"], "Old session")

    def test_public_speaker_links_only_and_ics_dates(self):
        speakers = scraper._speakers([{"name": "Alex", "email": "alex@example.com",
                                       "links": ["https://example.org/alex", "mailto:alex@example.com",
                                                 "https://example.org/alex?email=alex%40example.org"]}])
        self.assertEqual(speakers, [{"n": "Alex", "links": ["https://example.org/alex"]}])
        self.assertEqual(scraper._speakers([{"name": "alex@example.com"}]), [])
        item = scraper._normalize({"title": "Event", "start": "2027-03-10",
                                   "url": "https://example.org/event?email=alex%40example.org",
                                   "organizer": "events@example.com"}, "pnp", "test")
        self.assertEqual(item["url"], "")
        self.assertEqual(item["sources"][0]["url"], "")
        self.assertEqual(item["organizer_name"], "")
        self.assertEqual(scraper._date("20271104T134107"), "2027-11-04T13:41Z")
        self.assertEqual(scraper._date("20271104"), "2027-11-04")


if __name__ == "__main__":
    unittest.main()
