#!/usr/bin/env python3
import sys
from pathlib import Path
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import site_linkfix as LF


class LinkfixTest(unittest.TestCase):
    def setUp(self):
        self.index = LF.build_index(
            redirects={"/legacy-page": "/show/about/"},
            episodes=[
                {"slug": "teams-security", "title": "Teams Security Hardening Best Practices"},
                {"slug": "platform-governance", "title": "Power Platform Governance for Teams at Scale"},
                {"slug": "power-apps-testing", "title": "The Hidden Risks of Skipping Power Apps Testing"},
                {"slug": "i-audited-500-m365-tenants-heres-the-maturity-formula",
                 "title": "Microsoft 365 Maturity Model Based on 500 Tenant Audits"},
                {"slug": "ambiguous-one", "title": "Microsoft Teams Security Governance"},
                {"slug": "ambiguous-two", "title": "Microsoft Teams Security Governance"},
            ],
            blogs=[{"slug": "governance-model", "title": "Microsoft 365 Governance Operating Model"}],
            entities=[{"id": "dataverse", "name": "Microsoft Dataverse"}],
            renames={"old-episode": "teams-security"},
            known_routes=["/show/episodes/teams-security/", "/community/u/mirko-p/blog/governance-model/", "/feed.xml"],
        )

    def test_redirect_first_and_slash_variants(self):
        self.assertEqual(LF.resolve("/legacy-page/?x=1#top", self.index), "/show/about/?x=1#top")
        self.assertEqual(LF.resolve("/LEGACY-PAGE", self.index), "/show/about/")

    def test_direct_episode_blog_and_entity_routes(self):
        self.assertEqual(LF.resolve("/TEAMS-SECURITY", self.index), "/show/episodes/teams-security/")
        self.assertEqual(LF.resolve("/blog/governance-model/", self.index), "/community/u/mirko-p/blog/governance-model/")
        self.assertEqual(LF.resolve("/dataverse", self.index), "/entity/dataverse/")

    def test_slug_rename(self):
        self.assertEqual(LF.resolve("/show/episodes/OLD-EPISODE", self.index), "/show/episodes/teams-security/")

    def test_title_match_requires_clear_unique_result(self):
        self.assertEqual(
            LF.resolve("/power-platform-governance-for-teams-at-scale", self.index),
            "/show/episodes/platform-governance/",
        )
        self.assertEqual(
            LF.resolve("/microsoft-365-maturity-model-based-on-500-tenant-audits/", self.index,
                       "Microsoft 365 Maturity Model Based on 500 Tenant Audits"),
            "/show/episodes/i-audited-500-m365-tenants-heres-the-maturity-formula/",
        )
        self.assertIsNone(LF.resolve("/microsoft-teams-security-governance", self.index))
        self.assertIsNone(LF.resolve("/microsoft-teams-security", self.index))

    def test_host_query_fragment_and_case(self):
        self.assertEqual(
            LF.resolve("https://WWW.M365.FM/Teams-Security?ref=notes#tips", self.index),
            "/show/episodes/teams-security/?ref=notes#tips",
        )
        self.assertEqual(
            LF.resolve("https://m365.fm/legacy-page/?q=x#y", self.index),
            "/show/about/?q=x#y",
        )
        self.assertIsNone(LF.resolve("https://notm365.fm/teams-security/", self.index))

    def test_rewrite_links_and_unlink_unknown_targets(self):
        source = (
            '<p><a href="https://www.m365.fm/Teams-Security">Security</a> '
            '<a href="/unknown-path"><strong>Unmapped link</strong></a> '
            '<a href="/feed.xml">Feed</a> '
            '<a href="https://example.com/out">External</a></p>'
        )
        result, resolved, unresolved = LF.rewrite_html(source, "/show/episodes/source/", self.index)
        self.assertIn('href="/show/episodes/teams-security/"', result)
        self.assertIn("Unmapped link", result)
        self.assertNotIn("<a href=\"/unknown-path\"", result)
        self.assertIn('<a href="/feed.xml">Feed</a>', result)
        self.assertIn('href="https://example.com/out"', result)
        self.assertEqual(resolved[0]["method"], "episode")
        self.assertEqual(unresolved[0]["text"], "Unmapped link")


if __name__ == "__main__":
    unittest.main()
