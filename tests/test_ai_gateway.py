import json
import unittest
from unittest.mock import patch

import ai_gateway


class Reply:
    def __init__(self, value):
        self.value = json.dumps(value).encode()

    def __enter__(self):
        return self

    def __exit__(self, *_):
        return None

    def read(self):
        return self.value


class AiGatewayTests(unittest.TestCase):
    def test_gateway_url_and_direct_fallback(self):
        with patch.dict("os.environ", {"CF_AIG_TOKEN": "test-token"}, clear=True):
            self.assertEqual(ai_gateway.gateway_base_url(), "https://api.anthropic.com")
            req = ai_gateway.anthropic_request("/v1/messages", {"model": "claude-haiku-5-5"}, job="fallback", model="claude-haiku-5-5")
            self.assertIsNone(req.get_header("Cf-aig-metadata"))
            self.assertIsNone(req.get_header("Cf-aig-authorization"))
        with patch.dict("os.environ", {"CLOUDFLARE_ACCOUNT_ID": "account", "AI_GATEWAY_ID": "m365fm"}, clear=True):
            self.assertEqual(ai_gateway.gateway_base_url(), "https://gateway.ai.cloudflare.com/v1/account/m365fm/anthropic")

    def test_request_has_gateway_headers(self):
        with patch.dict("os.environ", {
            "CLOUDFLARE_ACCOUNT_ID": "account", "CF_AIG_TOKEN": "test-token",
        }, clear=True):
            req = ai_gateway.anthropic_request(
                "/v1/messages", {"model": "claude-haiku-5-5"}, job="translate_ui",
                lang="fr", model="claude-haiku-5-5", cache_ttl=604800, api_key="test-key",
            )
        self.assertEqual(req.full_url, "https://gateway.ai.cloudflare.com/v1/account/m365fm/anthropic/v1/messages")
        self.assertEqual(req.get_header("Cf-aig-metadata"), '{"job":"translate_ui","lang":"fr","model":"claude-haiku-5-5"}')
        self.assertEqual(req.get_header("Cf-aig-authorization"), "test-token")
        self.assertEqual(req.get_header("Cf-aig-cache-ttl"), "604800")
        self.assertEqual(req.get_header("X-api-key"), "test-key")

    def test_budget_check_and_usage_report(self):
        calls = []

        def fake_open(req, timeout):
            calls.append((req, timeout))
            if len(calls) == 1:
                return Reply({"allowed": True})
            return Reply({"ok": True})

        with patch.dict("os.environ", {"COMMUNITY_API": "https://api.example", "CRON_KEY": "test"}, clear=True):
            with patch.object(ai_gateway, "urlopen", fake_open):
                self.assertTrue(ai_gateway.check_budget("translate_ui", "claude-haiku-5-5"))
                ai_gateway.report_usage("translate_ui", "claude-haiku-5-5", 12, 4, "fr")

        self.assertEqual(len(calls), 2)
        self.assertEqual(calls[0][0].get_header("X-cron-key"), "test")
        self.assertEqual(json.loads(calls[1][0].data), {
            "action": "report", "id": json.loads(calls[1][0].data)["id"], "job": "translate_ui",
            "lang": "fr", "model": "claude-haiku-5-5", "input_tokens": 12, "output_tokens": 4,
        })


if __name__ == "__main__":
    unittest.main()
