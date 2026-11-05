"""tools/new_episodes_check.py: Erkennung neuer Folgen (Hauptshow, Dub-Fassungen) und Drosselung der Frische-Baus - ohne Netz."""
import importlib, json, sys, tempfile, unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
NE = importlib.import_module("new_episodes_check")
NOW = datetime(2026, 11, 5, 12, 0, tzinfo=timezone.utc)


def rss(*items):
    body = "".join(f"<item><title>{t}</title><guid isPermaLink=\"false\">https://api.spreaker.com/episode/{i}</guid>"
                   f"<enclosure url=\"https://dts.podtrac.com/redirect.mp3/api.spreaker.com/download/episode/{i}/x.mp3\"/>"
                   f"<pubDate>{p}</pubDate></item>" for t, i, p in items)
    return f"<?xml version=\"1.0\"?><rss><channel>{body}</channel></rss>"


def rfc(dt): return dt.strftime("%a, %d %b %Y %H:%M:%S +0000")


class NewEpisodes(unittest.TestCase):
    def test_norm_title_matches_sync_spreaker(self):
        src = (ROOT / "sync_spreaker.py").read_text("utf-8")
        self.assertIn('re.sub(r"\\W+", " ", (t or "").lower()).strip()', src)
        self.assertEqual(NE.norm_title("Copilot: Was ist neu?"), "copilot was ist neu")

    def test_main_show_new_only_past_recent_and_unknown(self):
        items = NE.feed_items(rss(("Alt bekannt", 75000001, rfc(NOW - timedelta(hours=5))),
                                  ("Neu", 75000002, rfc(NOW - timedelta(hours=1))),
                                  ("Geplant", 75000003, rfc(NOW + timedelta(hours=3))),
                                  ("Uralt", 75000004, rfc(NOW - timedelta(days=30)))))
        got = NE.new_main(items, {"75000001"}, NOW)
        self.assertEqual([x["title"] for x in got], ["Neu"])

    def test_pending_and_new_dubs(self):
        with tempfile.TemporaryDirectory() as d:
            r = Path(d); (r / "episodes").mkdir(); (r / "data").mkdir()
            (r / "episodes" / "VID1.json").write_text(json.dumps({"de-de": {"title": "Teams erklärt!"}, "hi": {"title": "x"}, "fr": {"title": "Déjà là"}}), "utf-8")
            (r / "data" / "published.json").write_text(json.dumps({"VID1:fr": {"episode_id": 1}}), "utf-8")
            pend = NE.pending_dubs(r)
            self.assertEqual(pend, {"de": {"teams erklärt": "VID1:de"}})   # hi ist keine Website-Sprache, fr hat schon eine Seite
            items = NE.feed_items(rss(("Teams erklärt!", 76000001, rfc(NOW - timedelta(minutes=30)))))
            self.assertEqual(NE.new_dubs(items, pend["de"], NOW), ["VID1:de"])
            later = NE.feed_items(rss(("Teams erklärt!", 76000001, rfc(NOW + timedelta(hours=1)))))
            self.assertEqual(NE.new_dubs(later, pend["de"], NOW), [])

    def test_decide_throttles(self):
        iso = lambda h: (NOW - timedelta(hours=h)).strftime("%Y-%m-%dT%H:%M:%SZ")
        self.assertFalse(NE.decide(0, [], NOW, 6)[0])
        self.assertTrue(NE.decide(2, [], NOW, 6)[0])
        self.assertFalse(NE.decide(2, [{"status": "in_progress", "created_at": iso(1)}], NOW, 6)[0])
        self.assertFalse(NE.decide(2, [{"status": "completed", "conclusion": "success", "created_at": iso(2)}], NOW, 6)[0])
        # abgebrochene (von der Warteschlange verdraengte) Laeufe zaehlen nicht
        self.assertTrue(NE.decide(2, [{"status": "completed", "conclusion": "cancelled", "created_at": iso(1)},
                                      {"status": "completed", "conclusion": "success", "created_at": iso(7)}], NOW, 6)[0])
        self.assertFalse(NE.decide(2, [{"status": "completed", "conclusion": "failure", "created_at": iso(3)}], NOW, 6)[0])


if __name__ == "__main__":
    unittest.main()
