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
            blogs=[
                {"slug": "governance-model", "title": "Microsoft 365 Governance Operating Model",
                 "handle": "mirko-p", "lang": "en"},
                {"slug": "gouvernance-modele", "title": "Modèle de gouvernance Microsoft 365",
                 "handle": "auteur", "lang": "fr"},
            ],
            entities=[{"id": "dataverse", "name": "Microsoft Dataverse"}],
            renames={"old-episode": "teams-security"},
            known_routes=[
                "/show/episodes/teams-security/",
                "/show/episodes/platform-governance/",
                "/show/episodes/i-audited-500-m365-tenants-heres-the-maturity-formula/",
                "/show/episodes/ambiguous-one/",
                "/show/episodes/ambiguous-two/",
                "/show/episodes/power-apps-testing/",
                "/community/u/mirko-p/blog/governance-model/",
                "/fr/community/u/auteur/blog/gouvernance-modele/",
                "/entity/dataverse/",
                "/feed.xml",
            ],
        )

    def test_redirect_first_and_slash_variants(self):
        self.assertEqual(LF.resolve("/legacy-page/?x=1#top", self.index), "/show/about/?x=1#top")
        self.assertEqual(LF.resolve("/LEGACY-PAGE", self.index), "/show/about/")

    def test_episode_blog_entity_and_worker_fallbacks(self):
        self.assertEqual(LF.resolve("/TEAMS-SECURITY", self.index), "/show/episodes/teams-security/")
        self.assertEqual(LF.resolve("/blog/governance-model/", self.index), "/community/u/mirko-p/blog/governance-model/")
        self.assertEqual(LF.resolve("/entity/dataverse", self.index), "/entity/dataverse/")
        self.assertEqual(LF.resolve("/categories/x", self.index), "/show/episodes/")
        self.assertEqual(LF.resolve("/categories/platform-governance", self.index,
                                    "Power Platform Governance for Teams at Scale"), "/show/episodes/")
        self.assertEqual(LF.resolve("/m365-fm-podcast/teams-security", self.index),
                         "/show/episodes/teams-security/")
        self.assertEqual(LF.resolve("/m365-fm-podcast/old-episode/", self.index),
                         "/show/episodes/teams-security/")
        self.assertEqual(LF.resolve("/blog/teams-security", self.index),
                         "/show/episodes/teams-security/")
        self.assertEqual(LF.resolve("/blog/gouvernance-modele/", self.index, lang="fr"),
                         "/fr/community/u/auteur/blog/gouvernance-modele/")
        self.assertEqual(LF.resolve("/videos/not-a-slug", self.index), "/show/")

    def test_slug_rename_scope(self):
        self.assertEqual(LF.resolve("/show/episodes/OLD-EPISODE", self.index), "/show/episodes/teams-security/")
        self.assertEqual(LF.resolve("/old-episode", self.index), "/show/episodes/teams-security/")
        self.assertIsNone(LF.resolve("/community/u/mirko-peters/", self.index))

    def test_title_matching_uses_slug_before_link_text_and_language(self):
        self.assertEqual(
            LF.resolve("/power-platform-governance-for-teams-at-scale", self.index, "Unrelated Microsoft Teams"),
            "/show/episodes/platform-governance/",
        )
        self.assertIsNone(LF.resolve("/unknown-slug", self.index, "Microsoft Teams Security Governance"))
        self.assertIsNone(LF.resolve("/microsoft-teams-security-governance", self.index))
        self.assertEqual(
            LF.resolve("/modele-gouvernance-microsoft-365", self.index,
                       "Microsoft 365 Governance Operating Model", "fr"),
            "/fr/community/u/auteur/blog/gouvernance-modele/",
        )
        self.assertIsNone(LF.resolve("/modele-gouvernance-microsoft-365", self.index,
                                    "Modèle de gouvernance Microsoft 365", "de"))
        self.assertEqual(
            LF.resolve("/typo-in-link", self.index, "The Hidden Risks of Skipping Power Apps Testing"),
            "/show/episodes/power-apps-testing/",
        )

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

    def test_only_content_is_rewritten_and_inner_html_is_preserved(self):
        source = (
            '<footer><a href="https://www.m365.fm/">Home</a></footer>'
            '<section class="pp-notes"><a href="/unknown-path"><strong>Keep</strong><br><img src="/x"></a>'
            '<a href="https://www.m365.fm/Teams-Security">Security</a></section>'
        )
        result, resolved, unresolved = LF.rewrite_html(source, "/show/episodes/source/", self.index)
        self.assertEqual(
            result,
            '<footer><a href="https://www.m365.fm/">Home</a></footer>'
            '<section class="pp-notes"><strong>Keep</strong><br><img src="/x">'
            '<a href="/show/episodes/teams-security/">Security</a></section>',
        )
        self.assertIn('<footer><a href="https://www.m365.fm/">Home</a></footer>', result)
        self.assertIn("<strong>Keep</strong><br><img src=\"/x\">", result)
        self.assertIn('href="/show/episodes/teams-security/"', result)
        self.assertEqual(unresolved, [("/unknown-path", 1)])
        self.assertEqual(resolved[0][2], "episode")

    def test_unicode_anchor_text_and_boolean_attributes(self):
        source = (
            '<head>before\u2028after\n</head>'
            '<section class="pp-notes"><div class><a href="/unknown-path">'
            '<strong>Straße İ</strong></a></div></section>'
        )
        result, _, unresolved = LF.rewrite_html(source, "/show/episodes/source/", self.index)
        self.assertEqual(
            result,
            '<head>before\u2028after\n</head>'
            '<section class="pp-notes"><div class><strong>Straße İ</strong></div></section>',
        )
        self.assertNotIn("</a>", result)
        self.assertEqual(unresolved, [("/unknown-path", 1)])

    def test_routes_and_worker_mappability_are_preserved(self):
        source = (
            '<section class="pp-notes"><a href="/feed.xml">Feed</a>'
            '<a href="https://www.m365.fm/show/episodes/teams-security/">Episode</a>'
            '<a href="/show/unmapped/">Unmapped show</a></section>'
        )
        result, _, unresolved = LF.rewrite_html(source, "/show/episodes/source/", self.index)
        self.assertIn('href="/feed.xml"', result)
        self.assertIn('href="https://www.m365.fm/show/episodes/teams-security/"', result)
        self.assertNotIn('href="/show/unmapped/"', result)
        self.assertIn("Unmapped show", result)
        self.assertEqual(unresolved, [("/show/unmapped/", 1)])

    def test_aliases_only_for_unique_safe_methods(self):
        index = LF.build_index(known_routes=["/taken/"], redirects={"/redirected": "/show/"})
        resolved = [
            ("/episode-old/", "/show/episodes/one/", "episode", 1),
            ("/blog-old", "/community/u/a/blog/one/", "blog", 1),
            ("/title-old", "/show/episodes/two/", "title", 1),
            ("/conflict", "/show/episodes/one/", "episode", 1),
            ("/conflict", "/show/episodes/two/", "entity", 1),
            ("/taken", "/show/episodes/three/", "episode", 1),
            ("/redirected", "/show/episodes/four/", "episode", 1),
            ("/unresolved", "/show/episodes/five/", "episode", 1),
        ]
        aliases = LF.build_aliases(resolved, [("/unresolved/", 2)], index)
        self.assertEqual(aliases, {
            "/episode-old": ("/show/episodes/one/", "episode"),
            "/blog-old": ("/community/u/a/blog/one/", "blog"),
        })


if __name__ == "__main__":
    unittest.main()
