"""Content-Pakete: Kernpunkte im Kopf erscheinen als Liste nach dem ersten Absatz (und damit in allen Sprachfassungen)."""
import unittest

import site_content_blog as CBL

WORDS = " ".join(f"word{i}" for i in range(320))
KP = ["Plan the walk around one question, not a tour.", "Ask open questions and write down what you see.", "Follow up on every action within a week."]


def rec(keypoints):
    return {"meta": {"title": "Gemba walk guide for plant managers", "summary": "A gemba walk guide for plant managers that explains purpose, routine and follow-up in plain words.",
                     "status": "approved", "publish": True, "author": "mirko-p", "date": "2026-11-11", "topics": ["sap"], "keypoints": keypoints},
            "body": f"First paragraph about the gemba walk.\n\nSecond paragraph.\n\n## Section\n\n{WORDS}\n"}


class KeypointsTest(unittest.TestCase):
    def test_list_after_first_paragraph(self):
        it, err = CBL.check(rec(KP), "en", "gemba-walk-guide", {"sap"})
        self.assertEqual(err, [])
        h = it["html"]
        self.assertLess(h.index("<p>First paragraph"), h.index("<h2>Key points</h2>"))
        self.assertLess(h.index("<h2>Key points</h2>"), h.index("<p>Second paragraph"))
        self.assertEqual(h.count("<li>"), 3)

    def test_without_keypoints_unchanged(self):
        it, err = CBL.check(rec([]), "en", "gemba-walk-guide", {"sap"})
        self.assertEqual(err, [])
        self.assertNotIn("Key points", it["html"])

    def test_heading_in_package_language(self):
        """Nicht-englische Pakete (imports/blog/<sprache>/) bekommen die Ueberschrift ihrer Sprache, Englisch bleibt 'Key points'."""
        for lang, h2 in (("de", "Kernpunkte"), ("fr", "Points clés"), ("ja", "要点"), ("en", "Key points")):
            it, err = CBL.check(rec(KP), lang, "gemba-walk-guide", {"sap"})
            self.assertEqual(err, [])
            self.assertIn(f"<h2>{h2}</h2>", it["html"], lang)
        for lang in sorted(CBL.LANGS - {"en"}):
            self.assertNotIn("<h2>Key points</h2>", CBL.check(rec(KP), lang, "gemba-walk-guide", {"sap"})[0]["html"], lang)

    def test_limits(self):
        for bad in (KP[:2], KP + ["Another useful point here."] * 6, ["too short", KP[1], KP[2]]):
            it, err = CBL.check(rec(bad), "en", "gemba-walk-guide", {"sap"})
            self.assertIsNone(it)
            self.assertTrue(any("Kernpunkte" in e for e in err))


if __name__ == "__main__":
    unittest.main()
