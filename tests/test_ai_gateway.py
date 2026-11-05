import json
import contextlib
import io
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
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                req = ai_gateway.anthropic_request(
                    "/v1/messages", {"model": "claude-haiku-5-5"}, job="fallback",
                    model="claude-haiku-5-5",
                )
            self.assertEqual(req.full_url, "https://api.anthropic.com/v1/messages")
            self.assertIsNone(req.get_header("Cf-aig-metadata"))
            self.assertIn("CF_AIG_TOKEN fehlt", output.getvalue())

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
        self.assertEqual(req.get_header("Cf-aig-authorization"), "Bearer test-token")
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

    def test_missing_or_wrong_cron_key_warns_and_report_never_raises(self):
        out = io.StringIO()
        with patch.dict("os.environ", {"COMMUNITY_API": "https://api.example"}, clear=True), contextlib.redirect_stdout(out):
            self.assertFalse(ai_gateway.check_budget("translate_ui", "claude-haiku-5-5", 0.1))
            ai_gateway.report_usage("translate_ui", "claude-haiku-5-5", 12, 4, "fr")   # darf nicht werfen
        self.assertIn("::warning::", out.getvalue())
        self.assertIn("CRON_KEY fehlt", out.getvalue())

        def forbidden(req, timeout):
            raise ai_gateway.urllib.error.HTTPError(req.full_url, 403, "Forbidden", {}, None)

        out = io.StringIO()
        with patch.dict("os.environ", {"COMMUNITY_API": "https://api.example", "CRON_KEY": "x"}, clear=True), \
                patch.object(ai_gateway, "urlopen", forbidden), contextlib.redirect_stdout(out):
            self.assertFalse(ai_gateway.check_budget("translate_ui", "claude-haiku-5-5"))
            ai_gateway.report_usage("translate_ui", "claude-haiku-5-5", 12, 4, "fr")
        self.assertIn("verschieden", out.getvalue())
        self.assertNotIn("RuntimeError", out.getvalue())

    def test_budget_exhausted_and_batch(self):
        sent = []

        def fake_open(req, timeout):
            sent.append(json.loads(req.data))
            return Reply({"allowed": False, "remaining_eur": 0.2} if sent[-1]["action"] == "check" else {"ok": True})

        out = io.StringIO()
        with patch.dict("os.environ", {"COMMUNITY_API": "https://api.example", "CRON_KEY": "x"}, clear=True), \
                patch.object(ai_gateway, "urlopen", fake_open), contextlib.redirect_stdout(out):
            self.assertFalse(ai_gateway.check_budget("translate_show", "claude-haiku-5-5", 1.0))
            ai_gateway.report_usage("translate_show", "claude-haiku-5-5", 10, 20, "batch", batch=True)
        self.assertIn("::warning::Haiku-Tagesbudget", out.getvalue())
        self.assertTrue(sent[-1]["batch"])
        self.assertAlmostEqual(ai_gateway.estimated_eur(1_000_000, 0, batch=True) * 2, ai_gateway.estimated_eur(1_000_000, 0))
        self.assertTrue(ai_gateway.check_budget("generate_articles", "claude-sonnet-5-5"))   # nur Haiku hat ein Tagesbudget


if __name__ == "__main__":
    unittest.main()
