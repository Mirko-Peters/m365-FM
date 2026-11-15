"""Einladungslink und Datenschutz (#320): was die Datenschutzerklaerung zusagt, haelt der Code ein."""
import re, sys, unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_invite as SI


class PrivacyText(unittest.TestCase):
    def test_privacy_text_matches_what_is_stored_and_for_how_long(self):
        """320-8, Entscheidung (b): die Datenschutzerklaerung nennt, was der Einladungslink speichert (Kuerzel, Zeitpunkt, Beleg des Servers; beim
        Zurechnen ein Hash der IP-Adresse), und die Fristen stimmen mit dem Code ueberein (30 Tage im Browser, hoechstens zwei Tage der Hash)."""
        legal = (ROOT / "site_legal.py").read_text("utf-8")
        de = re.search(r"<h2>Einladungslink</h2><p>(.*?)</p>", legal).group(1); en = re.search(r"<h2>Invite link</h2><p>(.*?)</p>", legal).group(1)
        for txt, words in ((de, ("m365_ref", "höchstens 30 Tage", "signierten Beleg", "beim nächsten Seitenaufruf gelöscht", "höchstens zwei Tage", "Hashwert Ihrer IP-Adresse", "merken wir die Zurechnung bei Ihrem Konto vor", "ohne IP-Adresse und ohne Hashwert", "mit Ihrem Konto wird auch diese Vormerkung gelöscht")),
                           (en, ("m365_ref", "30 days at most", "signed receipt", "deleted the next time you open a page", "two days at most", "hash of your IP address", "we note the credit with your account", "without IP address and without hash", "this note is deleted together with your account"))):
            for w in words:
                self.assertIn(w, txt)
        self.assertEqual(SI.REF_DAYS, 30)
        self.assertRegex((ROOT / "assets" / "invite-share.js").read_text("utf-8"), r"\bDAYS = 30\b")
        self.assertIn(f">{30 * 86400})localStorage.removeItem('m365_ref')", (ROOT / "assets" / "page.js").read_text("utf-8"))   # auf jeder Seite, auch ohne Community-Skript
        worker = (ROOT / "worker" / "src" / "inviter.js").read_text("utf-8")
        self.assertIn("export const REF_DAYS = 30;", worker)
        self.assertIn("DELETE FROM ratelimit WHERE k>='invref:' AND k<'invref;' AND win<?", worker)   # Tageslauf: Zaehler mit dem Hash der IP-Adresse
        # Vormerkung ueber der Tagesgrenze: die Tabelle hat keine Spalte fuer IP-Adresse oder Hash, der Hash steht nur im Zaehler (invref:ip:...), und
        # die Kontoloeschung entfernt die Vormerkung auf beiden Seiten
        cols = re.search(r"CREATE TABLE IF NOT EXISTS invite_pending \((.*?)\)\"", worker).group(1)
        self.assertEqual([c.split()[0] for c in cols.split(", ")], ["invitee_user_id", "inviter_user_id", "ref", "since", "held", "created"])
        self.assertEqual(len(re.findall(r"\$\{ip\}", worker)), 1); self.assertIn("`invref:ip:${o.inviter}:${ip}`", worker)
        self.assertIn("DELETE FROM invite_pending WHERE inviter_user_id=? OR invitee_user_id=?", worker)


if __name__ == "__main__":
    unittest.main()
