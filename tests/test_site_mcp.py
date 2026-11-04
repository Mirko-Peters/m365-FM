import unittest

import site_mcp


class McpPageTest(unittest.TestCase):
    def test_agent_instructions_in_both_languages_keep_existing_endpoint(self):
        written = {}
        sitemap = []
        site_mcp.build({
            "BASE": "https://www.m365.fm",
            "write": written.__setitem__,
            "page": lambda lang, title, description, url, body, *args, **kwargs: body,
            "header": lambda *args: "",
            "footer": lambda *args: "",
            "footer_en": lambda: "",
            "LANGS": ("en", "de"),
            "sitemap": sitemap,
            "TODAY": "2026-11-04",
        })
        for prefix in ("", "de/"):
            body = written[f"{prefix}community/mcp/index.html"]
            for value in (site_mcp.MCP_URL, site_mcp.AGENT_URL, "context_get",
                          "context_set", "context_clear", "plan_show",
                          "save_event_session", "ChatGPT", "Claude", "Copilot",
                          "30", "M365_MCP_TOKEN", "${input:m365Token}"):
                self.assertIn(value, body)
            self.assertIn("id=\"agent\"", body)
            self.assertNotIn("<script", body)
        self.assertEqual(len(sitemap), 2)
        self.assertIn("m365-fm-skill/SKILL.md", written)


if __name__ == "__main__":
    unittest.main()
