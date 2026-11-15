"""Event <-> Event-Entitaet im Seitenbau (site_event_link.py, site_entities.py, site_events.py): die Seite einer Event-Entitaet zeigt die Termine ihrer bestaetigt zugeordneten Events
mit Sessions und Speakern, die Event-Seite zeigt auf die Reihe (Link, superEvent), das Schema.org passt (check_schema), Unbestaetigtes und Nicht-Event-Entitaeten erscheinen nie."""
import copy
import json
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_entities as ENT   # noqa: E402
import site_event_link as EVL   # noqa: E402
import site_events as EV   # noqa: E402
from site_learn import ENTS   # noqa: E402

BASE = "https://www.m365.fm"
TODAY = "2026-11-10"
NEED = ("microsoft-ignite", "m365con", "mirko-peters", "copilot")
try:   # die echten Eintraege aus dem Repo (andere Tests koennen ENTS im selben Lauf veraendern)
    FILE_ENTS = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8")) if e.get("id") in NEED}
except Exception:
    FILE_ENTS = {}


def ev(handle, title, start, **k):
    base = {"handle": handle, "title": title, "summary": "", "about": "", "start": start, "end": "", "tz": "", "mode": "onsite", "location": "San Francisco", "country": "US", "url": "", "tickets_url": "", "free": True,
            "lang": "en", "topics": [], "seeking_sponsor": False, "public": True, "partners": [], "organizer": {"kind": "u", "handle": "", "name": "Orga"}, "unclaimed": False, "source": "", "retired": False, "entity": "", "sessions": []}
    base.update(k)
    return base


def sess(i, title, speakers, start="2026-11-17T09:00"):
    return {"id": i, "title": title, "abstract": "", "start": start, "end": "", "room": "", "track": "", "level": "", "lang": "en", "topics": [], "speakers": speakers, "speakers_open": 0, "recording_url": ""}


EVENTS = [
    ev("ignite-2026", "Microsoft Ignite 2026", "2026-11-17", end="2026-11-20", mode="hybrid", url="https://ignite.example/", entity="microsoft-ignite",
       sessions=[sess(1, "Keynote <b>Zero</b>", [{"h": "", "n": "Mirko Peters", "e": "mirko-peters"}, {"h": "jane", "n": "Jane <Doe>"}, {"h": "", "n": "Max Frei"}]),
                 sess(2, "Copilot deep dive", [{"h": "", "n": "Max Frei"}], "2026-11-18T10:00")]),
    ev("ignite-2025", "Microsoft Ignite 2025", "2025-11-18", end="2025-11-21", entity="microsoft-ignite", retired=True),
    ev("ignite-vorschlag", "Microsoft Ignite Berlin Watch Party", "2026-12-02", entity=""),   # nur Vorschlag/ohne Bestaetigung: der Export liefert entity ''
    ev("falsche-art", "Copilot Day", "2026-12-03", entity="copilot"),   # Produkt ist keine Event-Entitaet
    ev("unbekannt", "Irgendwas", "2026-12-04", entity="gibt-es-nicht"),
    ev("versteckt", "Microsoft Ignite Geheim", "2026-12-05", entity="microsoft-ignite", public=False),
    ev("m365con-2027", "M365Con 2027", "2027-01-11T08:00", end="2027-01-22", mode="online", topics=["m365con"], entity="", sessions=[sess(3, "Opening", [{"h": "mirko", "n": "Mirko Peters", "e": "mirko-peters"}], "2027-01-11T08:00")]),
]


def build_all(events, ents, link=True):
    tmp = tempfile.TemporaryDirectory(); docs = Path(tmp.name)

    def write(rel, content):
        p = docs / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(content, "utf-8")

    def page(lang, title, desc, url, body, alts=None, ld=None, **k):
        lds = "".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in (ld or []))
        return f'<!doctype html><html lang="{lang}"><head><title>{title}</title><meta name="description" content="{desc[:150]}">{lds}</head><body>{body}</body></html>'
    g = dict(BASE=BASE, write=write, page=page, header=lambda l, x="": "<header></header>", footer=lambda l: "<footer></footer>", footer_en=lambda: "<footer></footer>",
             LANGS={"de": ("Deutsch", "de")}, sitemap=[], TODAY=TODAY, api="https://api.test", url_of=lambda x: "", anchor_title=lambda t, *a: t)
    with mock.patch.dict(ENTS, ents, clear=True), mock.patch.object(ENT, "COMM_LANGS", ["en", "de"]), mock.patch.object(EV, "COMM_LANGS", ["en", "de"]), \
            mock.patch.object(ENT, "MOD_FILE", docs / "_entity_mod.json"), mock.patch.object(ENT, "fetch_wiki", lambda *a: {}), mock.patch.object(ENT, "write_wk_js", lambda *a: None), mock.patch.dict(ENT.EVENTS, {}, clear=True), mock.patch.dict(ENT.CLAIMS, {"mirko-peters": "mirko"}):
        for e in events:   # wie generate_site.py: Events unter Handle und Themen
            ENT.EVENTS[e["handle"]] = e
            for t in e.get("topics", []):
                ENT.EVENTS.setdefault(t, e)
        EVL.load(events if link else [], {"jane", "mirko"}, set(), TODAY)
        ENT.build(g, lambda lang: {}, {}, lambda e, lang="en": [])
        EV.build(g, events, [{"handle": "jane"}, {"handle": "mirko"}], [])
        EVL.load([], (), (), TODAY)
    return tmp, docs


def ld_of(html):
    return [json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)]


@unittest.skipUnless(all(k in FILE_ENTS for k in NEED), "Entitaeten fehlen in data/entities.json")
class EventEntitySite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ents = {k: copy.deepcopy(v) for k, v in FILE_ENTS.items() if k in NEED}
        cls.tmp, cls.docs = build_all(copy.deepcopy(EVENTS), cls.ents)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def read(self, rel):
        return (self.docs / rel).read_text("utf-8")

    def test_load_nur_bestaetigte_oeffentliche_event_entitaeten(self):
        with mock.patch.dict(ENTS, self.ents, clear=True):
            EVL.load(EVENTS, set(), set(), TODAY)
            self.assertEqual({k: [e["handle"] for e in v] for k, v in EVL.BY_ENTITY.items()}, {"microsoft-ignite": ["ignite-2025", "ignite-2026"]}, "Produkt, unbekannte ID, nicht oeffentlich, ohne Bestaetigung: nie")
            self.assertEqual(EVL.series_of(EVENTS[0]), "microsoft-ignite"); self.assertEqual(EVL.series_of(EVENTS[3]), ""); self.assertEqual(EVL.series_of(EVENTS[5]), "")
            self.assertTrue(EVL.is_series("microsoft-ignite")); self.assertFalse(EVL.is_series("m365con"), "M365Con hat ein eigenes Datum: selbst ein Event"); self.assertFalse(EVL.is_series("copilot"))
            EVL.load([], (), (), TODAY)

    def test_entitaetsseite_termine_sessions_speaker(self):
        h = self.read("entity/microsoft-ignite/index.html")
        self.assertIn("<h2>Dates</h2>", h); self.assertIn("<h3>Upcoming</h3>", h); self.assertIn("<h3>Past</h3>", h)
        self.assertLess(h.index("Microsoft Ignite 2026</b>"), h.index("Microsoft Ignite 2025</b>"), "kommende vor vergangenen")
        self.assertIn('href="https://www.m365.fm/community/events/ignite-2026/"', h); self.assertIn("17 Nov 2026 – 20 Nov 2026 · San Francisco, US · Hybrid", h)
        self.assertIn("Microsoft Ignite 2026: Sessions (2)", h); self.assertIn("Microsoft Ignite 2026: Speakers (3)", h)
        self.assertIn('<a href="https://www.m365.fm/entity/mirko-peters/">Mirko Peters</a>', h, "Speaker mit Personen-Entitaet: Link auf die Entitaet")
        self.assertIn('<a href="https://www.m365.fm/community/u/jane/">Jane &lt;Doe&gt;</a>', h, "nur Profil: Link auf das Profil, Name escaped")
        self.assertIn("Max Frei", h); self.assertNotIn('>Max Frei</a>', h, "ohne Entitaet und Profil nur Text")
        self.assertIn("Keynote &lt;b&gt;Zero&lt;/b&gt;", h); self.assertNotIn("<b>Zero</b>", re.sub(r"<script.*?</script>", "", h, flags=re.S), "sichtbarer Text escaped (JSON-LD escaped die echte page())")
        for nein in ("ignite-vorschlag", "falsche-art", "versteckt", "Geheim", "Berlin Watch Party"):
            self.assertNotIn(nein, h)
        self.assertNotIn("Go to the event", h)
        d = self.read("de/entity/microsoft-ignite/index.html"); self.assertIn("<h2>Termine</h2>", d); self.assertIn("<h3>Kommende</h3>", d)

    def test_schema_org_reihe_und_event(self):
        node = next(x["mainEntity"] for x in ld_of(self.read("entity/microsoft-ignite/index.html")) if x.get("@type") == "WebPage")
        self.assertEqual(node["@type"], "EventSeries"); subs = {s["name"]: s for s in node["subEvent"]}
        self.assertEqual(set(subs), {"Microsoft Ignite 2025", "Microsoft Ignite 2026"})
        s26 = subs["Microsoft Ignite 2026"]
        for k in ("@id", "name", "url", "startDate", "location", "eventAttendanceMode", "eventStatus"): self.assertIn(k, s26)
        self.assertEqual(s26["superEvent"], {"@id": f"{BASE}/entity/microsoft-ignite/#entity"}); self.assertEqual(len(s26["subEvent"]), 2)
        perf = s26["subEvent"][0]["performer"]
        self.assertEqual(perf, [{"@id": f"{BASE}/entity/mirko-peters/#entity"}, {"@id": f"{BASE}/community/u/jane/#person"}, {"@type": "Person", "name": "Max Frei"}], "Entitaet, Profil, Name")
        self.assertNotIn("subEvent", subs["Microsoft Ignite 2025"], "ohne Sessions kein subEvent")
        # Event-Seite: dasselbe Event, superEvent auf die Reihe, Link in den Fakten
        eh = self.read("community/events/ignite-2026/index.html"); evn = ld_of(eh)[0]
        self.assertEqual(evn["superEvent"], {"@id": f"{BASE}/entity/microsoft-ignite/#entity"}); self.assertEqual(len(evn["subEvent"]), 2)
        self.assertIn('<th scope="row">Event series</th><td><a href="https://www.m365.fm/entity/microsoft-ignite/">Microsoft Ignite</a></td>', eh)
        # Entitaet mit eigenem Datum (M365Con): bleibt ein Event, kein subEvent/superEvent-Zirkel
        m = next(x["mainEntity"] for x in ld_of(self.read("entity/m365con/index.html")) if x.get("@type") == "WebPage")
        self.assertEqual(m["@type"], "Event"); self.assertNotIn("subEvent", m)
        ent_graph = json.loads(self.read("entities.jsonld"))["@graph"]; self.assertEqual(len(next(x for x in ent_graph if x["@id"].endswith("/microsoft-ignite/#entity"))["subEvent"]), 2)

    def test_event_ohne_bestaetigte_reihe_bleibt_unveraendert(self):
        for h in ("ignite-vorschlag", "falsche-art", "unbekannt", "versteckt"):
            p = self.docs / "community" / "events" / h / "index.html"
            if p.exists():
                t = p.read_text("utf-8"); self.assertNotIn("superEvent", t, h); self.assertNotIn("Event series", t, h)
        lst = self.read("community/events/index.html")
        self.assertIn('<a class="ev-tag" href="https://www.m365.fm/entity/microsoft-ignite/">Microsoft Ignite</a>', lst)
        self.assertEqual(lst.count('class="ev-tag"'), 2, "nur die beiden Ignite-Termine tragen die Reihe")

    def test_alter_block_bleibt_ohne_zuordnung_und_doppelt_nichts(self):
        # M365Con ist ueber die Themen des Events (alt) verknuepft: ohne bestaetigte Zuordnung wie bisher
        h = self.read("entity/m365con/index.html"); self.assertIn("Go to the event", h); self.assertNotIn("<h2>Dates</h2>", h)
        # mit bestaetigter Zuordnung: der neue Block, der alte entfaellt fuer dasselbe Event (keine doppelte Session-Liste)
        evs = copy.deepcopy(EVENTS); evs[-1]["entity"] = "m365con"
        tmp, docs = build_all(evs, self.ents)
        try:
            h2 = (docs / "entity/m365con/index.html").read_text("utf-8")
            self.assertIn("<h2>Dates</h2>", h2); self.assertNotIn("Go to the event", h2); self.assertEqual(h2.count("M365Con 2027: Sessions"), 1)
        finally:
            tmp.cleanup()

    def test_ohne_link_kein_zusatz(self):
        tmp, docs = build_all(copy.deepcopy(EVENTS), self.ents, link=False)
        try:
            h = (docs / "entity/microsoft-ignite/index.html").read_text("utf-8"); self.assertNotIn("<h2>Dates</h2>", h)
            node = next(x["mainEntity"] for x in ld_of(h) if x.get("@type") == "WebPage"); self.assertNotIn("subEvent", node)
            self.assertNotIn("superEvent", (docs / "community/events/ignite-2026/index.html").read_text("utf-8").split("subEvent")[0])
        finally:
            tmp.cleanup()

    def test_check_schema_ohne_fehler(self):
        r = subprocess.run([sys.executable, str(ROOT / "check_schema.py"), str(self.docs)], capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertNotIn("FEHLER", r.stdout)

    def test_check_titles_ohne_fehler(self):
        import check_titles as CT
        work = tempfile.TemporaryDirectory()
        try:
            import shutil
            shutil.copytree(self.docs, Path(work.name) / "docs")
            with mock.patch.object(CT, "ROOT", Path(work.name)):
                self.assertEqual(CT.main(), 0)
        finally:
            work.cleanup()


if __name__ == "__main__":
    unittest.main()
