"""Lernfortschritt und Datenschutz (Plan v2, Seiten-Teil S5): was die Datenschutzerklaerung zusagt, haelt der Code ein (Muster test_invite_privacy.py)."""
import re, sys, unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))


def _section(legal, hid):
    m = re.search(rf'<h2 id="{hid}">.*?</h2>(.*?)\n', legal, re.S)
    return m.group(1) if m else ""


class PrivacyText(unittest.TestCase):
    def setUp(self):
        self.legal = (ROOT / "site_legal.py").read_text("utf-8")
        self.js = (ROOT / "assets" / "learnprogress.js").read_text("utf-8")

    def test_sections_name_what_is_stored(self):
        de, en = _section(self.legal, "lernpfad-fortschritt"), _section(self.legal, "learning-progress")
        self.assertTrue(de and en)
        for txt, words in ((de, ("m365-learn", "m365-learn-s", "m365_auth", "Lernfortschritt speichern", "Vor dem Klick wird nichts gespeichert und nichts an uns gesendet",
                                 "§ 25 Abs. 2 Nr. 2 TDDDG", "Art. 6 Abs. 1 lit. b DSGVO", "nach 24 Monaten ohne Änderung", "Löschen Ihres Kontos", "nicht in dieses Konto übernommen",
                                 "Fortschritt zurücksetzen", "Nicht mehr speichern", "Als ungelesen markieren")),
                           (en, ("m365-learn", "m365-learn-s", "m365_auth", "Save learning progress", "Nothing is stored and nothing is sent to us before you click",
                                 "Section 25(2) no. 2 TDDDG", "Art. 6(1)(b) GDPR", "after 24 months without a change", "deleting your account", "not transferred to that account",
                                 "Reset progress", "Stop saving", "Mark as unread"))):
            for w in words: self.assertIn(w, txt)
        for k in ("m365-learn", "m365-learn-s", "m365_auth"): self.assertIn(f'"{k}"', self.js)

    def test_links_from_pages_reach_the_sections(self):
        import site_pillars as S
        self.assertTrue(S.lp_privacy("https://x", "de").endswith("/datenschutz/#lernpfad-fortschritt"))
        self.assertTrue(S.lp_privacy("https://x", "en").endswith("/privacy/#learning-progress"))
        self.assertTrue(S.lp_privacy("https://x", "fr").endswith("/privacy/#learning-progress"))
        self.assertEqual(S.UI["lp_save"][1], "Lernfortschritt speichern")   # Name des Knopfs wie im Datenschutztext
        self.assertEqual(S.UI["lp_reset"], ("Reset progress", "Fortschritt zurücksetzen")); self.assertEqual(S.UI["lp_off"], ("Stop saving", "Nicht mehr speichern"))

    def test_worker_keeps_the_promises(self):
        """24 Monate im Cron, Kontoloeschung loescht mit, Zeiten setzt der Server (Client-Zeitfelder werden ignoriert)."""
        lp = (ROOT / "worker" / "src" / "learnprogress.js").read_text("utf-8")
        quiz = (ROOT / "worker" / "src" / "learnquiz.js").read_text("utf-8")
        self.assertRegex(lp, r"24\s*\*\s*30|730|24 Monate")
        fn = quiz[quiz.index("function deleteUserLearn"):]; fn = fn[:fn.index("\n}") + 2]
        self.assertIn("learn_progress", fn)
        self.assertIn('keepT("learn_progress")', (ROOT / "worker" / "src" / "identities.js").read_text("utf-8"))

    def test_script_sends_nothing_before_opt_in(self):
        """Kein sendBeacon; der einzige fetch steckt in api(), und api() wird nur mit einem Stand nach dem Opt-in aufgerufen."""
        js = self.js
        self.assertNotIn("sendBeacon", js)
        self.assertEqual(len(re.findall(r"\bfetch\(", js)), 1)
        for fn in ("flush", "first", "get"):
            body = js[js.index(f"function {fn}("):]; body = body[:body.index("\n  }\n")]
            self.assertRegex(body, r"if \(!S \|\||if \(busy\)|if \(!S\)", fn)
        self.assertIn("if (!S || RO) return false;", js)   # save(): nur mit Stand
        early = __import__("site_pillars").LPX_EARLY
        self.assertIn('localStorage.getItem("m365-learn")', early); self.assertNotIn("setItem", early)


if __name__ == "__main__":
    unittest.main()
