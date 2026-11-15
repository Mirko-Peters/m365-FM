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
            self.assertEqual(req.get_header("User-agent"), ai_gateway.USER_AGENT)
            raise ai_gateway.urllib.error.HTTPError(req.full_url, 403, "Forbidden", {}, io.BytesIO(b'{"error":"forbidden"}'))

        out = io.StringIO()
        with patch.dict("os.environ", {"COMMUNITY_API": "https://api.example", "CRON_KEY": "x"}, clear=True), \
                patch.object(ai_gateway, "urlopen", forbidden), contextlib.redirect_stdout(out):
            self.assertFalse(ai_gateway.check_budget("translate_ui", "claude-haiku-5-5"))
            ai_gateway.report_usage("translate_ui", "claude-haiku-5-5", 12, 4, "fr")
        self.assertIn("verschieden", out.getvalue())
        self.assertNotIn("RuntimeError", out.getvalue())

        def blocked(req, timeout):   # Cloudflare-Sperre (HTML, kein Worker-JSON) ist kein Schluesselfehler
            raise ai_gateway.urllib.error.HTTPError(req.full_url, 403, "Forbidden", {}, io.BytesIO(b"<html>error code: 1010</html>"))

        out = io.StringIO()
        with patch.dict("os.environ", {"COMMUNITY_API": "https://api.example", "CRON_KEY": "x"}, clear=True), \
                patch.object(ai_gateway, "urlopen", blocked), contextlib.redirect_stdout(out):
            self.assertFalse(ai_gateway.check_budget("translate_ui", "claude-haiku-5-5"))
        self.assertIn("Cloudflare", out.getvalue())
        self.assertNotIn("verschieden", out.getvalue())

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

    def test_gateway_passes_cache_control_through(self):
        body = {"model": "claude-sonnet-5-5", "max_tokens": 10, "messages": [{"role": "user", "content": [
            {"type": "text", "text": "Artikel: ...", "cache_control": {"type": "ephemeral"}},
            {"type": "text", "text": "Aufgabe"},
        ]}], "system": [{"type": "text", "text": "sys", "cache_control": {"type": "ephemeral", "ttl": "1h"}}]}
        for env in ({}, {"CLOUDFLARE_ACCOUNT_ID": "account", "CF_AIG_TOKEN": "test-token"}):
            with patch.dict("os.environ", env, clear=True):
                req = ai_gateway.anthropic_request("/v1/messages", body, job="t", model="claude-sonnet-5-5", api_key="test-key")
            self.assertEqual(json.loads(req.data), body)   # direkt und ueber das AI Gateway unveraendert

    def test_usage_tokens_and_cache_report(self):
        self.assertEqual(ai_gateway.usage_tokens({"input_tokens": 10, "cache_read_input_tokens": 300, "cache_creation_input_tokens": 50, "output_tokens": 7}), (360, 7, 300, 50))
        self.assertEqual(ai_gateway.usage_tokens(None), (0, 0, 0, 0))
        sent = []

        def fake_open(req, timeout):
            sent.append(json.loads(req.data))
            return Reply({"ok": True})

        with patch.dict("os.environ", {"COMMUNITY_API": "https://api.example", "CRON_KEY": "x"}, clear=True), \
                patch.object(ai_gateway, "urlopen", fake_open):
            ai_gateway.report_usage("t", "claude-haiku-5-5", 360, 7, "de", cache_read=300, cache_write=50)
        self.assertEqual(sent[0]["input_tokens"], 360)
        self.assertEqual(sent[0]["cache_read_input_tokens"], 300)
        self.assertEqual(sent[0]["cache_creation_input_tokens"], 50)


class ArticlePromptCacheTests(unittest.TestCase):
    """generate_articles: Folgeaufrufe teilen den Artikeltext als gecachten Anfang; Aufgabe und Zielsprache stehen dahinter."""

    def test_followups_share_cached_article_prefix(self):
        import generate_articles as G
        bodies = []

        def fake_open(req, timeout):
            bodies.append(json.loads(req.data))
            usage = {"input_tokens": 200, "output_tokens": 30, "cache_creation_input_tokens": 0 if len(bodies) > 1 else 4000,
                     "cache_read_input_tokens": 4000 if len(bodies) > 1 else 0}
            return Reply({"content": [{"type": "text", "text": "[]"}], "usage": usage})

        html = "<h2>Abschnitt</h2>" + "<p>" + "Copilot hilft beim Schreiben. " * 800 + "</p>"
        before = dict(G.USAGE)
        with patch.dict("os.environ", {"ANTHROPIC_API_KEY": "test-key"}, clear=True), patch.object(G, "urlopen", fake_open):
            G.info_for("fr", html); G.faq_for("ja", html); G.infos_for("fr", html, ["schritte"]); G.quiz_for("fr", html)
        self.assertEqual(len(bodies), 4)
        prefixes = []
        for b in bodies:
            self.assertNotIn("system", b)
            content = b["messages"][0]["content"]
            self.assertEqual(len(content), 2)
            self.assertEqual(content[0]["cache_control"], {"type": "ephemeral"})   # Breakpoint am Ende des stabilen Artikeltexts
            self.assertNotIn("cache_control", content[1])
            self.assertTrue(content[0]["text"].startswith("Artikel:\n"))
            self.assertIn("obigen Artikel", content[1]["text"])
            prefixes.append(content[0]["text"])
        self.assertEqual(len(set(prefixes)), 1, "alle Folgeaufrufe muessen denselben Anfang senden")
        self.assertEqual(prefixes[0], G.article_block(html))
        for b, lang in zip(bodies, ("Französisch", "Japanisch", "Französisch", "Französisch")):   # Variables (Sprache) nur hinter dem Breakpoint
            self.assertNotIn(lang, b["messages"][0]["content"][0]["text"])
            self.assertIn(lang, b["messages"][0]["content"][1]["text"])
        self.assertEqual(G.USAGE["cache_read"] - before["cache_read"], 12000)
        self.assertEqual(G.USAGE["cache_write"] - before["cache_write"], 4000)
        self.assertEqual(G.USAGE["in"] - before["in"], 4 * 200 + 4 * 4000)

    def test_single_followup_without_breakpoint(self):
        import generate_articles as G
        bodies = []

        def fake_open(req, timeout):
            bodies.append(json.loads(req.data))
            return Reply({"content": [{"type": "text", "text": "[]"}], "usage": {"input_tokens": 5, "output_tokens": 5}})

        with patch.dict("os.environ", {"ANTHROPIC_API_KEY": "test-key"}, clear=True), patch.object(G, "urlopen", fake_open):
            G.quiz_for("de", "<p>Text</p>", cache=False)
        content = bodies[0]["messages"][0]["content"]
        self.assertEqual(content[0]["text"], G.article_block("<p>Text</p>"))
        self.assertNotIn("cache_control", json.dumps(bodies[0]))   # einzelner Nachruestaufruf: kein Cache-Schreibaufschlag

    def test_article_prompt_unchanged_without_breakpoint(self):
        import generate_articles as G
        bodies = []

        def fake_open(req, timeout):
            bodies.append(json.loads(req.data))
            return Reply({"content": [{"type": "text", "text": "<p>x</p>"}], "usage": {"input_tokens": 5, "output_tokens": 5}})

        with patch.dict("os.environ", {"ANTHROPIC_API_KEY": "test-key"}, clear=True), patch.object(G, "urlopen", fake_open):
            G.ask("de", "Titel", "Transkript " * 10)
        self.assertIsInstance(bodies[0]["messages"][0]["content"], str)   # Transkript je Sprache verschieden, Regeln < 1 Wiederverwendung: kein Cache
        self.assertNotIn("cache_control", json.dumps(bodies[0]))


if __name__ == "__main__":
    unittest.main()
