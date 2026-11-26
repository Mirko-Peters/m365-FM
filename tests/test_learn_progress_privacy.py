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
                                 "Fortschritt zurücksetzen", "Nicht mehr speichern", "Als ungelesen markieren", "Konto-ID", "einmal je Tab und Viertelstunde",
                                 "auch ohne Konto", "eine leere Zeile mit Zeitpunkt bleibt", "gilt je Browser", "holt es nach", "lehnt unser Server die Übernahme ab",
                                 "Fortschritt vereinigt")),
                           (en, ("m365-learn", "m365-learn-s", "m365_auth", "Save learning progress", "Nothing is stored and nothing is sent to us before you click",
                                 "Section 25(2) no. 2 TDDDG", "Art. 6(1)(b) GDPR", "after 24 months without a change", "deleting your account", "not transferred to that account",
                                 "Reset progress", "Stop saving", "Mark as unread", "account ID", "once per tab and quarter of an hour", "also without an account",
                                 "an empty row with a timestamp remains", "applies per browser", "completes it once you are signed in again", "refuses to take it over",
                                 "progress is combined"))):
            for w in words: self.assertIn(w, txt)
        for k in ("m365-learn", "m365-learn-s", "m365_auth"): self.assertIn(f'"{k}"', self.js)

    def test_all_stored_fields_named(self):
        """Endpruefung B8/B9: alle gespeicherten Felder (q, ep/sy, dl, pt, lg, Fehlschlag) und Video per Karte oder Link."""
        de, en = _section(self.legal, "lernpfad-fortschritt"), _section(self.legal, "learning-progress")
        for w in ("deren Karte oder Link Sie angeklickt haben", "(Warteschlange)", "Epoche und Änderungszeitpunkt des Servers", "Konto-ID je Pfad",
                  "den Zeitpunkt der zuletzt gesendeten Lesestelle", "auch einen Fehlschlag", "ob Sie danach den Anmeldelink im Kasten angeklickt haben"):
            self.assertIn(w, de)
        for w in ("whose card or link you clicked", "(queue)", "epoch and the server's change time", "account ID per path", "the time of the last reading position sent",
                  "including a failure", "whether you then clicked the sign-in link in the box"):
            self.assertIn(w, en)
        # die Felder gibt es im Skript wirklich
        for f in ("q: []", "ep: int(o.ep), sy: int(o.sy)", "pt: (sess && sess.pt)", "lg: o.lg", "e: 1, h: hint()"):
            self.assertIn(f, self.js)

    def test_check_once_per_quarter_hour_also_after_failure(self):
        """Endpruefung B7: auch ein Fehlschlag (429, 5xx, Netz) der Anmeldepruefung wird in m365-learn-s gemerkt (Sperre 15 min, Anmeldehinweis gilt weiter)."""
        de, en = _section(self.legal, "lernpfad-fortschritt"), _section(self.legal, "learning-progress")
        self.assertIn("einmal je Tab und Viertelstunde bei unserem Server api-dub.m365.fm nach, ob Sie angemeldet sind, auch ohne Konto und auch nach einem Fehlschlag", de)
        self.assertIn("once per tab and quarter of an hour whether you are signed in, also without an account and also after a failure", en)
        fn = self.js[self.js.index("function noteSess("):]; fn = fn[:fn.index("\n  }\n")]
        self.assertIn("writeSess(sess); }", fn.split("\n")[3])
        fr = self.js[self.js.index("function fresh("):]; fr = fr[:fr.index("\n  }\n")]
        self.assertIn("if (ss.e) return !ss.s && !ss.h === !hint();", fr)
        self.assertIn("if (ss.s === 401 && hint()) return false;", fr); self.assertIn("if (ss.s === 200 && !hint()) return false;", fr)

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
        ident = (ROOT / "worker" / "src" / "identities.js").read_text("utf-8")
        self.assertIn('keepT("learn_progress")', ident); self.assertIn("mergeLearnProgress(db, S, T)", ident)   # Zusammenfuehren: Vereinigung
        self.assertIn('error: "uid"', lp)   # anderes Konto: 409, nichts uebernommen

    def test_script_sends_nothing_before_opt_in(self):
        """Kein sendBeacon; der einzige fetch steckt in api(), und api() wird nur mit einem Stand nach dem Opt-in aufgerufen."""
        js = self.js
        self.assertNotIn("sendBeacon", js)
        self.assertEqual(len(re.findall(r"\bfetch\(", js)), 1)
        for fn in ("flush", "first", "get", "delAcc", "side"):   # jeder Weg zu api() mit Stand prueft zuerst, dass es einen gibt (Opt-in)
            body = js[js.index(f"function {fn}("):]; body = body[:body.index("\n  }\n")]
            self.assertRegex(body.split("\n")[1] + body.split("\n")[2] + body.split("\n")[3], r"if \(!S \|\| RO", fn)
        body = js[js.index("function delRes("):]; body = body[:body.index("\n  }\n")]
        self.assertIn("var u = RES && RES.dl[P];", body)   # ohne Stand nur das vorgemerkte DELETE nach "Nicht mehr speichern"
        self.assertEqual(len(re.findall(r"\bapi\(", js)) - 1, 6, "api() ausser der Definition: GET, POST (flush, init, side), DELETE (delAcc, delRes)")
        self.assertIn("if (!S || RO) return false;", js)   # save(): nur mit Stand
        early = __import__("site_pillars").LPX_EARLY
        self.assertIn('localStorage.getItem("m365-learn")', early); self.assertNotIn("setItem", early)


if __name__ == "__main__":
    unittest.main()
