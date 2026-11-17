"""Runde 8: Exporte mit Personenbezug aus data/cache (Ausfall beim Seitenbau) werden gegen den FRISCHEN Profil-Export gefiltert (site_fetch.scrub).
Sie stammen vom letzten Bau, also womoeglich von vor einer Kontoloeschung, dem Privatstellen oder einem Adresswechsel; die Adresse kann
inzwischen einem anderen Mitglied gehoeren. Massstab: Adresse oeffentlich im frischen Export UND Konto-Schluessel ak (worker privacy.js acctKeys)
gleich; aeltere Fassungen ohne ak: Name gleich. Event-Speaker ohne passendes Profil erscheinen als "Former member" ohne Link."""
import contextlib, io, json, sys, tempfile, threading, time, unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_fetch as SF   # noqa: E402

API = "https://api.example.test"
# Frischer Profil-Export: Alice hat ihr Konto geloescht, Carol traegt jetzt die Adresse "alice"; Bob ist unveraendert
FRESH = {"/api/profiles/export": {"people": [{"handle": "alice", "name": "Carol Newowner", "ak": "c" * 16},
                                             {"handle": "bob", "name": "Bob Builder", "ak": "b" * 16}], "orgs": []},
         "/api/blog/export": {"items": []}, "/api/qa/export": {"items": []}}
A_OLD = "a" * 16   # Schluessel von Alices altem Konto
CACHE = {
    "/api/entity/export": {"items": [
        {"id": "alice", "data": {"name": "Alice Geloescht", "type": "person", "desc": {"en": "Alice Geloescht is a member: Kurzzeile"}}, "src": "owned", "pe": True, "ak": A_OLD},
        {"id": "bob", "data": {"name": "Bob Builder", "type": "person"}, "src": "owned", "pe": True, "ak": "b" * 16},
        {"id": "dora", "data": {"name": "Dora Privat", "type": "person"}, "src": "owned"},   # alte Fassung ohne pe: selbst verwaltet + person, kein Profil
        {"id": "guest-x", "data": {"name": "Podcast Guest", "type": "person"}, "src": "owned", "pe": False},   # beanspruchte Gast-Entitaet, nicht aus einem Profil
        {"id": "copilot", "data": {"name": "Copilot", "type": "product"}, "src": "seed", "pe": False}]},
    "/api/feed/export": {"items": [
        {"id": 1, "title": "Alices Video", "type": "u", "handle": "alice", "name": "Alice Geloescht", "ak": A_OLD},
        {"id": 2, "title": "Bobs Video", "type": "u", "handle": "bob", "name": "Bob Builder", "ak": "b" * 16},
        {"id": 3, "title": "Alter Eintrag ohne ak", "type": "u", "handle": "alice", "name": "Alice Geloescht"},
        {"id": 4, "title": "Bob alt ohne ak", "type": "u", "handle": "bob", "name": "Bob  builder"},
        {"id": 5, "title": "Firmenbeitrag", "type": "o", "handle": "contoso", "name": "Contoso"}]},
    "/api/show/export": {"items": [{"slug": "alice-pod", "handle": "alice", "name": "Alice Geloescht", "ak": A_OLD, "eps": []},
                                   {"slug": "bob-pod", "handle": "bob", "name": "Bob Builder", "ak": "b" * 16, "eps": []}]},
    "/api/guests/export": {"items": [{"id": 1, "handle": "alice", "name": "Alice Geloescht"}, {"id": 2, "handle": "bob", "name": "Bob Builder", "ak": "b" * 16}]},
    "/api/library/export": {"items": [{"id": 1, "handle": "alice", "name": "Alice Geloescht", "ak": A_OLD}, {"id": 2, "handle": "bob", "name": "Bob Builder", "ak": "b" * 16}]},
    "/api/video/export": {"items": [{"id": 1, "handle": "dora", "name": "Dora Privat"}]},
    "/api/podcast/export": {"items": [{"id": 1, "handle": "bob", "name": "Bob Builder", "ak": "b" * 16,
                                       "guests": [{"handle": "alice", "name": "Alice Geloescht"}, {"handle": "bob", "name": "Bob Builder"}]}]},
    "/api/events/export": {"events": [{"handle": "devday", "organizer": {"kind": "u", "handle": "alice", "name": "Alice Geloescht", "ak": A_OLD}, "sessions": [{"id": 20, "speakers": [
        {"h": "alice", "n": "Alice Realname", "e": "alice", "ak": A_OLD},
        {"h": "bob", "n": "Dr. Bob Builder", "ak": "b" * 16},   # anderer Anzeigename, gleiches Konto: bleibt
        {"n": "Name Only", "e": "name-only"},
        {"h": "dora", "n": "Dora Privat"}]}]},
        {"handle": "bobs", "organizer": {"kind": "u", "handle": "bob", "name": "Bob Builder", "ak": "b" * 16}, "sessions": []}]},
}


class Base(unittest.TestCase):
    fresh = FRESH

    def setUp(self):
        self.saved = (dict(SF._MEM), dict(SF._STATE), dict(SF._TIME))
        SF._MEM.clear(); SF._STATE.clear(); SF._TIME.clear()
        self.tmp = tempfile.TemporaryDirectory(); self.cache = Path(self.tmp.name)
        for p, j in CACHE.items():
            (self.cache / SF._name(API + p)).write_text(json.dumps(j), "utf-8")
        self.calls = []

        def http(url, timeout, tries):
            p = "/" + url.split("://", 1)[1].split("/", 1)[1]
            self.calls.append(p)
            return (json.loads(json.dumps(self.fresh[p])), None) if p in self.fresh else (None, "TimeoutError: simuliert")
        self.patches = [mock.patch.object(SF, "CACHE", self.cache), mock.patch.object(SF, "_http", http)]
        for p in self.patches: p.start()
        self.err = io.StringIO(); self.redirect = contextlib.redirect_stderr(self.err); self.redirect.__enter__()

    def tearDown(self):
        self.redirect.__exit__(None, None, None)
        for p in self.patches: p.stop()
        self.tmp.cleanup()
        mem, state, times = self.saved
        SF._MEM.clear(); SF._MEM.update(mem); SF._STATE.clear(); SF._STATE.update(state); SF._TIME.clear(); SF._TIME.update(times)

    def get(self, p):
        return SF.fetch(API + p)


class ScrubCache(Base):
    def test_check_laesst_den_bau_zu_aber_ohne_alte_personendaten(self):
        SF.prefetch(API)
        self.assertTrue(SF.check(API))
        self.assertEqual(SF.states()[API + "/api/entity/export"], "cache")
        dump = json.dumps({p: self.get(p) for p in CACHE}, ensure_ascii=False)
        for v in ("Alice Geloescht", "Alice Realname", "Dora Privat", A_OLD):
            self.assertNotIn(v, dump)

    def test_personen_entitaeten_nur_mit_frischem_oeffentlichem_profil_und_passendem_konto(self):
        self.get("/api/profiles/export")
        ids = [i["id"] for i in self.get("/api/entity/export")["items"]]
        self.assertEqual(ids, ["bob", "guest-x", "copilot"], "alice: anderes Konto traegt die Adresse; dora: kein oeffentliches Profil (alte Fassung ohne pe)")

    def test_feed_nach_adresse_und_konto(self):
        self.get("/api/profiles/export")
        self.assertEqual([i["id"] for i in self.get("/api/feed/export")["items"]], [2, 4, 5], "ohne ak entscheidet der Name; Firmen bleiben")

    def test_shows_gaeste_bibliothek_video_podcast(self):
        self.get("/api/profiles/export")
        for p in ("/api/show/export", "/api/guests/export", "/api/library/export"):
            self.assertEqual([i["handle"] for i in self.get(p)["items"]], ["bob"], p)
        self.assertEqual(self.get("/api/video/export")["items"], [])
        pod = self.get("/api/podcast/export")["items"]
        self.assertEqual([g["handle"] for g in pod[0]["guests"]], ["bob"], "Gast-Credits nur passender Profile")

    def test_event_speaker_ohne_passendes_profil_anonym(self):
        self.get("/api/profiles/export")
        evs = self.get("/api/events/export")["events"]
        self.assertEqual(evs[0]["sessions"][0]["speakers"], [{"n": "Former member"}, {"h": "bob", "n": "Dr. Bob Builder", "ak": "b" * 16},
                                                             {"n": "Name Only", "e": "name-only"}, {"n": "Former member"}])
        self.assertEqual(evs[0]["organizer"]["handle"], ""); self.assertEqual(evs[0]["organizer"]["name"], "Former member")
        self.assertEqual(evs[1]["organizer"]["handle"], "bob")

    def test_reihenfolge_egal_profile_werden_nachgeholt(self):
        ids = [i["id"] for i in self.get("/api/entity/export")["items"]]   # zuerst der Cache-Export, dann erst die Profile
        self.assertEqual(ids, ["bob", "guest-x", "copilot"])
        self.assertEqual(self.calls.count("/api/profiles/export"), 1)

    def test_cache_datei_bleibt_unveraendert(self):
        self.get("/api/feed/export")
        self.assertIn("Alice Geloescht", (self.cache / SF._name(API + "/api/feed/export")).read_text("utf-8"))


class OhneFrischeProfile(Base):
    fresh = {k: v for k, v in FRESH.items() if k != "/api/profiles/export"}

    def test_alles_mit_personenbezug_faellt_weg(self):
        self.assertEqual([i["id"] for i in self.get("/api/entity/export")["items"]], ["guest-x", "copilot"])
        self.assertEqual([i["id"] for i in self.get("/api/feed/export")["items"]], [5])
        self.assertEqual(self.get("/api/show/export")["items"], [])


class FrischBleibtUnveraendert(Base):
    fresh = {**FRESH, "/api/feed/export": CACHE["/api/feed/export"]}

    def test_frischer_export_wird_nicht_gefiltert(self):
        self.get("/api/profiles/export")
        self.assertEqual(len(self.get("/api/feed/export")["items"]), 5)


class Gleichzeitig(Base):
    def test_zweiter_aufruf_wartet_statt_doppelt_abzurufen(self):
        gate = threading.Event()
        orig = SF._http

        def slow(url, timeout, tries):
            gate.wait(2); return orig(url, timeout, tries)
        with mock.patch.object(SF, "_http", slow):
            out = []
            ts = [threading.Thread(target=lambda: out.append(self.get("/api/profiles/export"))) for _ in range(3)]
            for t in ts: t.start()
            time.sleep(0.1); gate.set()
            for t in ts: t.join(5)
        self.assertEqual(self.calls.count("/api/profiles/export"), 1)
        self.assertEqual(len(out), 3); self.assertTrue(all(o is out[0] for o in out))
        self.assertEqual(SF.states()[API + "/api/profiles/export"], "frisch")


if __name__ == "__main__":
    unittest.main()
