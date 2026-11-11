"""Event-Import (#317) im Seitenbau: importierte Events zeigen nur https-Links (auch im JSON-LD), behaupten keinen Preis, wenn er unbekannt ist,
und bieten den Einstieg zum Uebernehmen; Datenschutzerklaerung und Bot-Seite sagen, was wirklich gelesen und gespeichert wird."""
import json
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_events as EV   # noqa: E402
import site_legal as SL   # noqa: E402

IMPORTED = {"handle": "azure-summit-seattle", "title": "Azure Summit <Seattle>", "summary": "Azure day", "about": "", "start": "2026-11-05T09:00", "end": "", "tz": "", "mode": "onsite", "location": "Seattle",
            "country": "", "url": "javascript:alert(document.domain)", "tickets_url": "http://tickets.example/x", "free": None, "lang": "", "topics": [], "seeking_sponsor": False, "public": True, "partners": [],
            "organizer": {"kind": "u", "handle": "", "name": "Seattle Azure UG"}, "unclaimed": True, "source": "communitydays", "retired": False,
            "sessions": [{"id": 7, "title": "Keynote", "abstract": "", "start": "2026-11-05T09:00", "end": "", "room": "", "track": "", "level": "", "lang": "", "topics": [], "speakers": [{"h": "", "n": "Jane Doe", "e": ""}],
                          "speakers_open": 0, "recording_url": "javascript:alert(1)"}]}
MEMBER = {**IMPORTED, "handle": "hamburg-copilot-day", "title": "Hamburg Copilot Day", "url": "https://hh.example/2026", "tickets_url": "https://hh.example/tickets", "free": True, "tz": "Europe/Berlin", "unclaimed": False, "source": "",
          "organizer": {"kind": "u", "handle": "", "name": "Orga"}, "sessions": [{**IMPORTED["sessions"][0], "recording_url": "https://video.example/rec"}]}
PAID = {**MEMBER, "handle": "paid-conf", "title": "Paid Conf", "free": False}


def build(events):
    tmp = tempfile.TemporaryDirectory(); docs = Path(tmp.name)
    def write(rel, content):
        p = docs / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(content, "utf-8")
    def page(lang, title, desc, url, body, alts=None, ld=None, **k):
        lds = "".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in (ld or []))
        return f'<!doctype html><html lang="{lang}"><head><title>{title}</title>{lds}</head><body>{body}</body></html>'
    g = dict(BASE="https://www.m365.fm", write=write, page=page, header=lambda lang, x="": "<header></header>", footer=lambda lang: "<footer></footer>", footer_en=lambda: "<footer></footer>",
             LANGS={"de": ("Deutsch", "de")}, sitemap=[], TODAY="2026-10-01", api="https://api.test")
    EV.build(g, events, [], [])
    return tmp, docs


def ld_of(html):
    return [json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)]


class EventImportSite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp, cls.docs = build([IMPORTED, MEMBER, PAID])

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def page(self, handle, lang="en"):
        return (self.docs / ("" if lang == "en" else lang) / "community" / "events" / handle / "index.html").read_text("utf-8")

    def test_nur_https_links_auch_im_jsonld(self):   # 317-02
        self.assertEqual(EV.https_url("javascript:alert(1)"), ""); self.assertEqual(EV.https_url("http://x.example/"), ""); self.assertEqual(EV.https_url(None), "")
        self.assertEqual(EV.https_url('https://x.example/"><script>'), ""); self.assertEqual(EV.https_url(" https://x.example/a "), "https://x.example/a")
        for lang in ("en", "de"):
            h = self.page("azure-summit-seattle", lang)
            self.assertNotIn("javascript:", h); self.assertNotIn("http://tickets.example", h); self.assertIn("<h1>Azure Summit &lt;Seattle&gt;</h1>", h)   # Ausgabe wird escaped (Kopf und JSON-LD escaped die echte page()-Funktion)
            self.assertNotRegex(h, r'<a class="btn( main)?" href="(?!https://www\.m365\.fm/)[^"]*" rel="nofollow')   # weder Ticket- noch Webseiten-Knopf
        ev = next(x for x in ld_of(self.page("azure-summit-seattle")) if x.get("@type") == "Event")
        self.assertNotIn("offers", ev); self.assertNotIn("recordedIn", json.dumps(ev))
        m = self.page("hamburg-copilot-day")
        self.assertIn('href="https://hh.example/tickets"', m); self.assertIn('href="https://hh.example/2026"', m); self.assertIn('href="https://video.example/rec"', m)

    def test_preis_unbekannt_wird_nicht_behauptet(self):   # 317-16
        ev = next(x for x in ld_of(self.page("azure-summit-seattle")) if x.get("@type") == "Event")
        self.assertNotIn("isAccessibleForFree", ev)
        for lang, words in (("en", ("Free", "Paid")), ("de", ("Kostenlos", "Kostenpflichtig"))):
            facts = re.search(r'<table class="mb-facts">.*?</table>', self.page("azure-summit-seattle", lang), re.S).group(0)
            for w in words:
                self.assertNotIn(f"<td>{w}</td>", facts)
        free = next(x for x in ld_of(self.page("hamburg-copilot-day")) if x.get("@type") == "Event")
        self.assertIs(free["isAccessibleForFree"], True); self.assertEqual(free["offers"]["price"], 0); self.assertIn("<td>Free</td>", self.page("hamburg-copilot-day"))
        paid = next(x for x in ld_of(self.page("paid-conf")) if x.get("@type") == "Event")
        self.assertIs(paid["isAccessibleForFree"], False); self.assertIn("<td>Kostenpflichtig</td>", self.page("paid-conf", "de"))

    def test_uebernehmen_nur_bei_importierten_events_ohne_veranstalter(self):   # 317-14
        for lang, label in (("en", "This is my event"), ("de", "Das ist mein Event")):
            h = self.page("azure-summit-seattle", lang)
            self.assertIn(f'id="ev-claim" data-e="azure-summit-seattle">{label}</button>', h)
            self.assertIn('fetch("https://api.test/api/event/"+E+"/claim",{method:"POST",credentials:"include",headers:{"x-requested-with":"m365"', h)   # CSRF-Kopf wie alle schreibenden Aufrufe
            self.assertIn("?claim=", h)   # ohne Anmeldung weiter zur Community-Seite (assets/events-import.js)
        self.assertNotIn("ev-claim", self.page("hamburg-copilot-day"))

    def test_ohne_veranstalter_keine_anmeldung_und_kein_vorschlag(self):   # Nachpruefung #317: "Register (free)" bei einem fremden, evtl. kostenpflichtigen Event
        for lang, words in (("en", ("Register (free)", "Registration", "Propose a session")), ("de", ("Anmelden (kostenlos)", "Anmeldung", "Session vorschlagen"))):
            h = self.page("azure-summit-seattle", lang)
            for w in ('id="ev-reg"', "/register", "?propose=", f"<h2>{words[1]}</h2>", words[0], words[2]):
                self.assertNotIn(w, h)
            self.assertIn('id="ev-claim"', h); self.assertIn("event.ics", h); self.assertIn("data-topic-follow", h)   # Uebernehmen, Kalender und Folgen bleiben
            m = self.page("hamburg-copilot-day", lang)   # Event mit Veranstalter: beides wie bisher
            for w in ('id="ev-reg" data-e="hamburg-copilot-day"', "?propose=hamburg-copilot-day#c-events", f"<h2>{words[1]}</h2>", words[0], words[2]):
                self.assertIn(w, m)

    def test_schema_pruefung_bleibt_gruen(self):
        r = subprocess.run([sys.executable, str(ROOT / "check_schema.py"), str(self.docs)], capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stdout[-800:] + r.stderr[-400:])


class EventImportLegal(unittest.TestCase):   # 317-10
    def test_datenschutz_nennt_quellen_daten_und_widerspruch(self):
        for text, words in ((SL.privacy_de(), ("communitydays.org", "Sessionize", "ausschließlich den Namen", "Art. 14 DSGVO", "Art. 21 DSGVO", "Kurzvorstellungen, Fotos, Slogans und Link-Listen von Speakern speichern wir nicht", "nicht erneut importiert")),
                            (SL.privacy_en(), ("communitydays.org", "Sessionize", "only the name", "Art. 14 GDPR", "Art. 21 GDPR", "We do not store speakers' bios, photos, taglines or link lists", "not imported again"))):
            for w in words:
                self.assertIn(w, text)

    def test_bot_seite_verspricht_nur_was_stimmt(self):
        b = SL.bot_page()
        self.assertNotIn("It reads only event name, dates, place, organizer and links.", b)   # stimmte fuer Sessionize nicht
        for w in ("names of the speakers", "We do not store speaker bios, photos, taglines or link lists", "only after its organizer has connected it", "This is my event", "Namen der Speaker", "Das ist mein Event", "nicht erneut importiert"):
            self.assertIn(w, b)
        # was die Seite zusagt, tut der Worker: keine Bio/Foto-Spalten, kein Kopieren in den Bucket
        mig = (ROOT / "worker" / "migrations" / "0035_event_import.sql").read_text("utf-8")
        ref = re.search(r"CREATE TABLE IF NOT EXISTS speaker_ref \((.*?)\);", mig, re.S).group(1)
        for col in ("bio", "tagline", "photo", "links"):
            self.assertNotRegex(ref, rf"(?m)^\s*{col}\w*\s+TEXT")
        src = "".join((ROOT / "worker" / "src" / f).read_text("utf-8") for f in ("sessionize.js", "eventimport.js", "eventmerge.js"))
        self.assertNotIn("PAGES.put", src)


if __name__ == "__main__":
    unittest.main()


class OhneSeiteNichtSichtbar(unittest.TestCase):
    """Wunsch Mirko (11.11.2026): was noch keine eigene Seite hat, taucht im Frontend nicht auf. Die Event-Liste laedt keine Events aus der
    Datenbank nach (vorher: Link auf die fehlende Seite = 404, z. B. ein frisch importiertes Community-Days-Event)."""
    def test_event_liste_ohne_nachladen(self):
        tmp, docs = build([MEMBER])
        try:
            for lang in ("en", "de"):
                h = (docs / ("" if lang == "en" else lang) / "community" / "events" / "index.html").read_text("utf-8")
                self.assertNotIn("/api/events/export", h); self.assertIn("hamburg-copilot-day", h)
        finally:
            tmp.cleanup()
