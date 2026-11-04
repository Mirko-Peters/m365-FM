"""Offline-Regression: python3 tools/test_player.py."""
import sys
import unittest
import json
from html.parser import HTMLParser
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from site_player import player


class Tags(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.tags = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


class PlayerTests(unittest.TestCase):
    def test_no_external_content_before_activation(self):
        for provider in ("youtube", "spreaker"):
            tags = Tags(player(provider, "123", "Eine Folge")).tags
            self.assertFalse(any(t in ("iframe", "img") for t, _ in tags))
            button = next(a for t, a in tags if t == "button")
            self.assertEqual(button["type"], "button")
            self.assertIn("Eine Folge", button["aria-label"])
            self.assertIn("hidden", button)
            self.assertTrue(any(t == "svg" and a.get("aria-hidden") == "true" for t, a in tags))
            self.assertTrue(any(t == "a" and a["href"].startswith("https://www.") for t, a in tags))

    def test_reserved_sizes(self):
        self.assertIn('style="height:131px"', player("spreaker", 123, "Titel"))
        self.assertIn('style="height:200px"', player("spreaker", 123, "Titel", height=200))
        self.assertIn('media-player-video', player("youtube", "123", "Titel"))

    def test_escaped_title_and_identifier(self):
        tags = Tags(player("youtube", 'id"&x', 'Titel "<script>&')).tags
        button = next(a for t, a in tags if t == "button")
        self.assertIn('Titel "<script>&', button["aria-label"])
        self.assertIn("id%22%26x", button["data-player-src"])
        self.assertFalse(any(t == "script" for t, _ in tags))

    def test_unknown_provider_is_rejected(self):
        with self.assertRaises(ValueError):
            player("other", "123", "Titel")

    def test_live_channel_link_and_embed(self):
        tags = Tags(player("youtube", "channel-id", "Live", live=True)).tags
        button = next(a for t, a in tags if t == "button")
        self.assertIn("/embed/live_stream?channel=channel-id&rel=0", button["data-player-src"])
        self.assertTrue(any(t == "a" and a["href"] == "https://www.youtube.com/channel/channel-id/live" for t, a in tags))

    def test_live_show_players_and_structured_data(self):
        import site_fetch
        with patch.object(site_fetch, "fetch", return_value=None):
            import site_live
        pages, schemas = {}, {}

        def page(lang, title, desc, url, body, alts=None, ld=None, **kwargs):
            schemas[url] = ld
            return body

        g = dict(BASE="https://www.m365.fm", write=lambda path, body: pages.update({path: body}),
                 page=page, header=lambda *a: "", footer=lambda *a: "", footer_en=lambda: "",
                 LANGS={"en": ()}, sitemap=[], TODAY="2026-11-04")
        data = {"channel": "channel-id", "streams": [{"id": "test", "title": "Live-Test", "published": "2026-11-04"}]}
        with TemporaryDirectory() as tmp:
            (Path(tmp) / "live.json").write_text(json.dumps(data), encoding="utf-8")
            with patch.object(site_live, "D", Path(tmp)):
                site_live.build(g)
        episode = next(body for path, body in pages.items() if path.startswith("live/test-"))
        self.assertNotIn("<iframe", episode)
        self.assertIn('data-player-provider="youtube"', episode)
        self.assertNotIn("background-image", pages["live/index.html"])
        ld = next(ld for url, ld in schemas.items() if "/live/test-" in url)[0]
        self.assertEqual(ld["embedUrl"], "https://www.youtube-nocookie.com/embed/test")
        self.assertEqual(ld["@type"], "VideoObject")

    def test_community_players_and_structured_data(self):
        import site_fetch
        with patch.object(site_fetch, "fetch", return_value=None):
            import site_podcast
            import site_video
        episode = dict(handle="host", lang="en", slug="test", title='Eine "Folge"',
                       published=1700000000, name="Host", id=1, spreaker_id=123,
                       video_id="test-video", ep_url="https://www.spreaker.com/episode/123")
        for module, provider in ((site_podcast, "spreaker"), (site_video, "youtube")):
            pages = {}
            schemas = {}

            def page(lang, title, desc, url, body, alts=None, ld=None, **kwargs):
                schemas[url] = ld
                return body

            g = dict(BASE="https://www.m365.fm", write=lambda path, body: pages.update({path: body}),
                     page=page, header=lambda *a: "", footer=lambda *a: "",
                     footer_en=lambda: "", LANGS={"en": ()}, sitemap=[], TODAY="2026-11-04")
            with patch.object(module, "COMM_LANGS", ("en",)):
                module.build(g, [episode], [{"handle": "host"}], "")
            kind = "podcast" if provider == "spreaker" else "video"
            body = pages[f"community/{kind}/test/index.html"]
            self.assertNotIn("<iframe", body)
            self.assertIn(f'data-player-provider="{provider}"', body)
            ld = schemas[f"https://www.m365.fm/community/{kind}/test/"][0]
            self.assertEqual(ld["name"], episode["title"])
            if provider == "youtube":
                self.assertEqual(ld["embedUrl"], "https://www.youtube.com/embed/test-video")
                self.assertEqual(ld["@type"], "VideoObject")
            else:
                self.assertEqual(ld["@type"], "PodcastEpisode")
                self.assertEqual(ld["associatedMedia"], {
                    "@type": "AudioObject", "contentUrl": episode["ep_url"]})


if __name__ == "__main__":
    unittest.main()
