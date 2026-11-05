import unittest
import json
import os
import tempfile
from io import BytesIO
from datetime import date
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
             "title": "M365 Community Day", "start": "2027-03-12", "url": "https://example.org/another",
             "sessions": [{"title": "Azure", "speakers": []}], "speakers": [], "topics": ["azure"]},
            {"sources": [{"source": "sessionize", "ext_id": "a", "url": "https://example.org/event"}],
             "title": "M365 Community Day", "start": "2027-03-10", "url": "https://example.org/event",
             "sessions": [], "speakers": [], "topics": []},
        ]
        merged = scraper.merge_duplicates(events)
        self.assertEqual(len(merged), 2)
        cross_source = next(item for item in merged if len(item["sources"]) == 2)
        self.assertEqual({source["source"] for source in cross_source["sources"]}, {"community_days", "sessionize"})
        self.assertEqual(cross_source["topics"], ["copilot"])
        self.assertEqual(len(cross_source["fp"]), 32)
        self.assertEqual(len(cross_source["hash"]), 64)

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
        self.assertEqual(scraper._date("20271104T134107"), "2027-11-04T13:41")
        self.assertEqual(scraper._date("2027-11-04T15:41:07+02:00"), "2027-11-04T13:41")
        self.assertEqual(scraper._date("20271104"), "2027-11-04")

    def test_missing_and_cancelled_events_are_retained_as_gone(self):
        item = scraper._normalize({"title": "M365 Day", "start": "2027-03-10", "id": "event-1"}, "community_days", "events")
        item["fp"] = "a" * 32
        item["hash"] = "b" * 64
        previous = [item] + [{**item, "fp": str(i) * 32, "title": f"M365 Day {i}",
                              "sources": [{"source": "community_days", "ext_id": f"event-{i}", "url": ""}]}
                             for i in range(2, 6)]
        missing = scraper.retain_previous(previous, previous[1:])
        missing_item = next(value for value in missing if value["fp"] == item["fp"])
        self.assertTrue(missing_item["gone"])
        cancelled = scraper._normalize({"title": "M365 Day", "start": "2027-03-10", "status": "cancelled"},
                                       "community_days", "events")
        self.assertTrue(cancelled["gone"])
        restored = scraper.retain_previous(missing, [{**item, "gone": False}])
        self.assertFalse(next(value for value in restored if value["fp"] == item["fp"])["gone"])

    def test_retain_previous_matches_stable_source_id_and_protects_small_snapshots(self):
        old = {"fp": "a" * 32, "title": "M365 Day", "start": "2027-03-10",
               "sources": [{"source": "community_days", "ext_id": "stable-id"}], "sessions": []}
        changed = {**old, "fp": "b" * 32, "title": "M365 Copilot Day", "start": "2027-03-11"}
        self.assertEqual(scraper.retain_previous([old], [changed])[0]["fp"], old["fp"])
        source_a = scraper._normalize({"title": "M365 Day", "start": "2027-03-10",
                                       "url": "https://communitydays.org/events/stable"}, "community_days", "events")
        source_b = scraper._normalize({"title": "Copilot Day", "start": "2027-03-11",
                                       "url": "https://communitydays.org/events/stable"}, "community_days", "events")
        self.assertEqual(source_a["sources"][0]["ext_id"], source_b["sources"][0]["ext_id"])
        previous = [{**old, "fp": str(i) * 32, "sources": [{"source": "community_days", "ext_id": f"id-{i}"}]}
                    for i in range(5)]
        current = [dict(event) for event in previous[:3]]
        result = scraper.retain_previous(previous, current)
        self.assertEqual(sum(not item.get("gone") for item in result), 5)

    def test_mcp_call_errors_abort_and_list_events_uses_date_windows(self):
        with self.assertRaises(ValueError):
            scraper._mcp_result_value({"result": {"isError": True}})
        tools = [{"name": "list_events", "inputSchema": {"properties": {"when": {"type": "string"},
                  "from": {"type": "string"}, "to": {"type": "string"}, "source": {"type": "string"},
                  "limit": {"type": "string"}}}}]
        events = [
            {"title": "M365 Day", "start": "2027-03-10", "id": "one"},
            {"title": "Azure Day", "start": "2027-03-11", "id": "two"},
        ]
        responses = [{"result": {"structuredContent": {"events": [event]}}} for event in events]
        with patch.object(scraper, "community_tools", return_value=(tools, "session")), \
             patch.dict(os.environ, {"EVENTS_MCP_TOOLS_ALLOWLIST": "list_events"}), \
             patch.object(scraper, "_event_windows", return_value=[(date(2027, 3, 1), date(2027, 3, 10)),
                                                                    (date(2027, 3, 11), date(2027, 3, 31))]), \
             patch.object(scraper, "mcp_request", side_effect=[(r, "session") for r in responses]) as request:
            result = scraper.community_events()
        self.assertEqual(len(result), 2)
        self.assertEqual(request.call_count, 2)
        self.assertEqual(request.call_args_list[0].args[1]["arguments"], {
            "when": "range", "from": "2027-03-01", "to": "2027-03-10", "source": "community_days", "limit": "100"})

    def test_mcp_uses_stateless_streamable_http_endpoint(self):
        class Response(BytesIO):
            headers = {"content-type": "text/event-stream"}
            def __enter__(self):
                return self
            def __exit__(self, *_):
                self.close()

        with patch.object(scraper.urllib.request, "urlopen", return_value=Response(b'data: {"jsonrpc":"2.0","id":1,"result":{}}\n\n')) as open_url:
            response, session = scraper.mcp_request("tools/list")
        request = open_url.call_args.args[0]
        self.assertEqual(scraper.MCP_URL, "https://mcp.communitydays.org/runtime/webhooks/mcp")
        self.assertEqual(request.full_url, scraper.MCP_URL)
        self.assertIsNone(request.get_header("Mcp-session-id"))
        self.assertIsNone(request.get_header("Authorization"))
        self.assertEqual(request.get_header("Mcp-protocol-version"), "2025-03-26")
        self.assertEqual(response["result"], {})
        self.assertIsNone(session)

    def test_list_events_splits_full_month_responses_by_day(self):
        tool = {"name": "list_events", "inputSchema": {"properties": {
            "when": {"type": "string"}, "from": {"type": "string"}, "to": {"type": "string"},
            "source": {"type": "string"}, "limit": {"type": "string"}}}}
        crowded = [{"slug": f"event-{index}", "title": f"M365 Day {index}", "start_date": "2027-03-10"}
                   for index in range(100)]
        replies = [
            {"result": {"structuredContent": crowded}},
            {"result": {"structuredContent": [crowded[0]]}},
        ]
        with patch.object(scraper, "community_tools", return_value=([tool], None)), \
             patch.dict(os.environ, {"EVENTS_MCP_TOOLS_ALLOWLIST": "list_events"}), \
             patch.object(scraper, "_event_windows", return_value=[(date(2027, 3, 10), date(2027, 3, 10))]), \
             patch.object(scraper, "mcp_request", side_effect=[(reply, None) for reply in replies]) as request:
            result = scraper.community_events()
        self.assertEqual(request.call_count, 2)
        self.assertEqual(request.call_args_list[1].args[1]["arguments"]["from"], "2027-03-10")
        self.assertEqual(request.call_args_list[1].args[1]["arguments"]["to"], "2027-03-10")
        self.assertEqual(len(result), 1)

    def test_mcp_event_tools_require_allowlist_and_never_select_session_tools(self):
        tools = [{"name": "list_events", "inputSchema": {"properties": {}}},
                 {"name": "list_sessions", "inputSchema": {"properties": {}}},
                 {"name": "event_detail", "inputSchema": {"properties": {"filter": {"type": "object"}}, "required": ["filter"]}}]
        with patch.object(scraper, "community_tools", return_value=(tools, "session")), \
             patch.dict(os.environ, {"EVENTS_MCP_TOOLS_ALLOWLIST": "list_events,list_sessions,event_detail"}):
            with patch.object(scraper, "mcp_request", return_value=({"result": {"structuredContent": [
                {"title": "M365 Day", "start": "2027-03-10", "id": "event-1"}]}}, "session")) as request, \
                 patch.object(scraper, "_event_windows", return_value=[(date(2027, 3, 1), date(2027, 3, 31))]):
                self.assertEqual(len(scraper.community_events()), 1)
            self.assertEqual(request.call_count, 1)
            self.assertEqual(request.call_args.args[1]["name"], "list_events")
        with patch.object(scraper, "community_tools", return_value=(tools, "session")), \
             patch.dict(os.environ, {"EVENTS_MCP_TOOLS_ALLOWLIST": ""}):
            with self.assertRaisesRegex(ValueError, "allowlist|ALLOWLIST"):
                scraper.community_events()

    def test_community_days_month_windows_enrich_sessions_speakers_and_metadata(self):
        names = [
            {"name": "list_events", "inputSchema": {"properties": {
                "when": {"type": "string"}, "from": {"type": "string"}, "to": {"type": "string"},
                "source": {"type": "string"}, "limit": {"type": "string"}}}},
            {"name": "get_event", "inputSchema": {"properties": {"slug": {"type": "string"}}, "required": ["slug"]}},
            {"name": "get_event_sessions", "inputSchema": {"properties": {"slug": {"type": "string"}}, "required": ["slug"]}},
            {"name": "get_speaker", "inputSchema": {"properties": {"speakerId": {"type": "string"}}, "required": ["speakerId"]}},
            {"name": "get_speaker_sessions", "inputSchema": {"properties": {"speakerId": {"type": "string"}}, "required": ["speakerId"]}},
        ]
        replies = [
            {"result": {"structuredContent": [{"id": "mcp-id", "slug": "m365-day", "title": "M365 Community Day",
                "start_date": "2027-03-10", "end_date": "2027-03-10", "event_type": "Microsoft 365",
                "city": "Berlin", "country": "Germany", "website": "https://communitydays.org/events/m365-day",
                "registration_url": "https://communitydays.org/events/m365-day/register",
                "speaker_call_end_date": "2027-02-01", "call_for_speakers_link": "https://example.org/cfs",
                "sponsor_call_end_date": "2027-02-10", "call_for_sponsors_link": "https://example.org/sponsor",
                "latitude": 52.52, "longitude": 13.405, "cost_tiers": [{"name": "Standard", "amount": 25}]}]}},
            {"result": {"structuredContent": {"slug": "m365-day", "title": "M365 Community Day"}}},
            {"result": {"structuredContent": {"sessions": [
                {"id": "session-9", "title": "Copilot in Teams", "start": "2027-03-10T10:00:00Z",
                 "speakerName": "Alex Example", "speakerId": "speaker-3"},
                {"id": "session-10", "title": "Azure and Copilot", "speakerName": "Alex Example", "speakerId": "speaker-3"},
            ]}}},
            {"result": {"structuredContent": {"name": "Alex Example", "profileUrl": "https://example.org/alex"}}},
        ]
        with patch.object(scraper, "community_tools", return_value=(names, None)), \
             patch.dict(os.environ, {"EVENTS_MCP_TOOLS_ALLOWLIST": "list_events,get_event,get_event_sessions,get_speaker"}), \
             patch.object(scraper, "_event_windows", return_value=[(date(2027, 3, 1), date(2027, 3, 31))]), \
             patch.object(scraper, "mcp_request", side_effect=[(reply, None) for reply in replies]) as request, \
             patch.object(scraper.time, "sleep"):
            result = scraper.community_events()
        self.assertEqual(len(result), 1)
        event = result[0]
        self.assertEqual(event["sources"][0]["ext_id"], "m365-day")
        self.assertEqual(event["location"], "Berlin")
        self.assertEqual(event["tickets_url"], "https://communitydays.org/events/m365-day/register")
        self.assertEqual(event["cfs_close"], "2027-02-01")
        self.assertEqual(event["cfs_url"], "https://example.org/cfs")
        self.assertEqual(event["sponsor_call_close"], "2027-02-10")
        self.assertTrue(event["seeking_sponsor"])
        self.assertEqual((event["latitude"], event["longitude"]), (52.52, 13.405))
        self.assertFalse(event["free"])
        self.assertEqual(event["sessions"][0]["start"], "2027-03-10T10:00")
        self.assertEqual(event["sessions"][0]["speakers"], [{"n": "Alex Example", "links": ["https://example.org/alex"]}])
        self.assertEqual(len(event["sessions"]), 2)
        self.assertEqual(request.call_count, 4)
        list_args = request.call_args_list[0].args[1]["arguments"]
        self.assertEqual(list_args, {"when": "range", "from": "2027-03-01", "to": "2027-03-31",
                                     "source": "community_days", "limit": "100"})
        self.assertTrue(all(isinstance(value, str) for value in list_args.values()))
        self.assertEqual(request.call_args_list[3].args[1]["arguments"], {"speakerId": "speaker-3"})

    def test_main_writes_output_with_mocked_scrape(self):
        event = {"sources": [{"source": "community_days", "ext_id": "main"}],
                 "title": "M365 Day", "start": "2027-03-10", "url": "https://example.org/event"}
        with tempfile.TemporaryDirectory() as directory:
            output = scraper.Path(directory) / "ext_events.json"
            with patch.object(scraper, "OUT", output), patch.object(scraper, "scrape", return_value=[event]), \
                 patch.dict(os.environ, {"EVENTS_POLICY_APPROVED": "1"}):
                self.assertEqual(scraper.main(), 0)
            saved = json.loads(output.read_text("utf-8"))
            self.assertTrue(saved["snapshot_complete"])
            self.assertEqual(saved["items"][0]["sources"][0]["ext_id"], "main")
            with patch.object(scraper, "OUT", output), patch.object(scraper, "scrape", return_value=[event]), \
                 patch.dict(os.environ, {"EVENTS_POLICY_APPROVED": "1"}):
                self.assertEqual(scraper.main(), 0)
            self.assertEqual(json.loads(output.read_text("utf-8"))["updated"], saved["updated"])

    def test_distinct_source_ids_keep_separate_fingerprints(self):
        shared_fp = "a" * 32
        previous = [{"fp": shared_fp, "title": "Same title", "start": "2027-03-10",
                     "sources": [{"source": "community_days", "ext_id": "one"}]},
                    {"fp": shared_fp, "title": "Same title", "start": "2027-03-10",
                     "sources": [{"source": "community_days", "ext_id": "two"}]}]
        retained = scraper.retain_previous(previous, previous)
        self.assertEqual(len({event["fp"] for event in retained}), 2)
        self.assertEqual({event["sources"][0]["ext_id"] for event in retained}, {"one", "two"})


if __name__ == "__main__":
    unittest.main()
