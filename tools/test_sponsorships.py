"""T37 Sponsor, Offline-Regression: python3 tools/test_sponsorships.py
Prueft site_sponsorships (Format, Pruefungen, Kennzeichnung, JSON-LD, rel) und die Regel in check_schema.py mit Testdaten aus temporaeren Dateien."""
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_sponsorships as SPM
from site_i18n import COMM_LANGS

ENTS = {"acme-backup": {"type": "product"}, "entra-id": {"type": "product"}, "purview": {"type": "product"}, "jane-doe": {"type": "person"}}
EPISODES = {"backup-done-right", "entra-deep-dive"}
DUBS = {("de", "backup-richtig-gemacht"): "VID1", ("fr", "sauvegarde-bien-faite"): "VID1", ("de", "nur-dub"): "VID2"}
ORIG = {"VID1": "backup-done-right"}
POSTS = [{"handle": "mirko-p", "slug": "acme-pr", "lang": "en"}, {"handle": "mirko-p", "slug": "acme-pr", "lang": "de"}]


def rec(**kw):
    r = {"id": "acme-2026", "sponsor": {"name": "Acme & Co", "url": "https://www.acme.example/"}, "label": "sponsored", "start": "2026-11-01", "end": "2027-04-30"}
    r.update(kw)
    return r


class SponsorshipTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        SPM.reset()

    def tearDown(self):
        SPM.reset()
        self.tmp.cleanup()

    def write(self, recs, **top):
        p = Path(self.tmp.name) / "sponsorships.json"
        p.write_text(json.dumps({"version": 1, "sponsorships": recs, **top}), "utf-8")
        return p

    def init(self, recs, today="2026-11-03", **top):
        return SPM.init(today, ENTS, episodes=EPISODES, dubs=DUBS, orig=ORIG, path=self.write(recs, **top))

    def errors(self, recs, today="2026-11-03"):
        with self.assertRaises(SPM.SponsorshipError) as cm:
            self.init(recs, today)
        return str(cm.exception)

    # --- Datei im Repo und Uebersetzungen ---
    def test_repo_file_is_valid(self):   # seit #308 mit iFAKT (unbefristet)
        d = json.loads((ROOT / "data" / "sponsorships.json").read_text("utf-8"))
        recs, errs = SPM.check_structure(d)
        self.assertEqual(errs, [])
        for r in recs:
            self.assertTrue(r.get("end") is None or SPM._day(r["end"]), r["id"])

    def test_labels_hand_written_for_all_languages(self):
        self.assertEqual(SPM.check_i18n(), [])
        d = json.loads((ROOT / "data" / "py_i18n.json").read_text("utf-8"))
        for en in ("Sponsored", "Advertisement", "Paid partnership with {sponsor}", "Paid content on behalf of {sponsor}"):
            self.assertEqual(set(d[en]), set(COMM_LANGS[2:]), en)
            for lg in COMM_LANGS[2:]:
                self.assertNotEqual(d[en][lg].strip(), en, (en, lg))
        self.assertEqual(SPM.TEXT["sponsored"][1], "Anzeige")
        self.assertEqual(SPM.TEXT["advertisement"][1], "Anzeige")

    # --- Pruefungen ---
    def test_structure_errors(self):
        msg = self.errors([rec(id="Bad Id"), rec(id="x1", label="promo"), rec(id="x2", start="2026-13-01"), rec(id="x3", start="2027-01-02", end="2027-01-01"),
                           rec(id="x4", sponsor={"name": "", "url": "http://acme.example/"}), rec(id="x5", sponsor={"name": "M", "url": "https://www.m365.fm/"}),
                           rec(id="x6", price=1500), rec(id="x6", entities="acme-backup"), rec(id="x7", end="2027/01/01"), rec(id="x8", topics=["entra-id", "entra-id"])])
        for part in ('"id" fehlt oder ungueltig', '"x1": "label"', '"x2": "start"', '"x3": "end" liegt vor "start"', '"x4": "sponsor.name"', '"x4": "sponsor.url" muss',
                     '"x5": "sponsor.url" darf nicht auf m365.fm', 'unbekanntes Feld "price"', '"x6": id doppelt', '"entities" muss eine Liste', '"x7": "end" muss ein Datum', '"topics" enthaelt Doppelte'):
            self.assertIn(part, msg)

    def test_open_ended_sponsorship(self):   # "end": null = unbefristet, kein Fehler, immer aktiv ab "start"
        st = self.init([rec(id="u1", end=None, entities=["acme-backup"])], today="2030-01-01")   # kein Fehler, nach Jahren noch aktiv
        self.assertIn("acme-backup", st["ent"])
        self.assertTrue(SPM._active({"start": "2026-11-06", "end": None}, "2030-01-01"))
        self.assertFalse(SPM._active({"start": "2026-11-06", "end": None}, "2026-11-05"))

    def test_sponsor_url_on_shared_platform_is_rejected(self):   # sonst bekaemen eigene LinkedIn-/YouTube-Links der Seite rel="sponsored"
        msg = self.errors([rec(id="s1", sponsor={"name": "Acme", "url": "https://www.linkedin.com/company/acme/"}),
                           rec(id="s2", sponsor={"name": "Acme", "url": "https://de.linkedin.com/company/acme/"}),
                           rec(id="s3", sponsor={"name": "Acme", "url": "https://acme.github.io/"})])
        for part in ('"s1": "sponsor.url" muss die eigene Website', '"s2": "sponsor.url" muss die eigene Website', '"s3": "sponsor.url" muss die eigene Website'):
            self.assertIn(part, msg)
        self.init([rec(id="ok1", sponsor={"name": "Acme", "url": "https://www.acme.example/"})])   # eigene Domain bleibt erlaubt

    def test_unknown_references_fail_the_build(self):
        msg = self.errors([rec(entities=["nope"], topics=["missing"], episodes=["no-such-episode", "de/no-such-dub", "x/y/z"], posts=["/blog/foo/"])])
        for part in ('Entitaet "nope" unbekannt', 'Thema "missing" ist keine Entitaet', 'Folge "no-such-episode" gibt es', 'Dub-Folge "de/no-such-dub" gibt es nicht',
                     'Folge "x/y/z" hat keine gueltige Form', 'Beitrag "/blog/foo/" hat keine gueltige Form'):
            self.assertIn(part, msg)
        self.assertIn('Thema "jane-doe" hat den Typ person', self.errors([rec(topics=["jane-doe"])]))

    def test_offline_downgrades_only_unknown_references(self):
        with patch.dict(os.environ, {"SITE_OFFLINE": "1"}):
            self.init([rec(entities=["nope"])])
            self.assertIn("label", self.errors([rec(entities=["nope"], label="x")]))

    def test_unknown_post_fails(self):
        self.init([rec(posts=["/community/u/mirko-p/blog/acme-pr/", "/de/community/u/mirko-p/blog/gone/"])])
        with self.assertRaises(SPM.SponsorshipError) as cm:
            SPM.check_posts(POSTS)
        self.assertIn('Beitrag "/de/community/u/mirko-p/blog/gone/" gibt es nicht', str(cm.exception))

    def test_no_topic_limit(self):   # Mirko, 6.11.2026: kein eigenes Themen-Sponsoring mehr, also keine Obergrenze je Thema
        self.assertFalse(hasattr(SPM, "TOPIC_MAX"))
        four = [rec(id=f"t{i}", topics=["entra-id"], start="2026-11-01", end="2027-01-31") for i in range(4)]
        self.init(four)   # vier gleichzeitig: kein Fehler mehr
        self.assertEqual(len(SPM.entity("entra-id")), 4)   # alle bleiben gekennzeichnet

    # --- Index und Laufzeit ---
    def test_entity_banner_only_while_running_content_label_permanent(self):
        r = rec(entities=["acme-backup"], topics=["entra-id"], episodes=["backup-done-right"], posts=["/community/u/mirko-p/blog/acme-pr/"], start="2026-11-01", end="2026-11-30")
        for today, running in (("2026-10-31", False), ("2026-11-01", True), ("2026-11-30", True), ("2026-12-01", True), ("2027-05-31", True), ("2027-06-01", False)):   # Karenzzeit: end + 182 Tage
            SPM.reset(); self.init([r], today=today)
            self.assertEqual(bool(SPM.entity("acme-backup")), running, today)
            self.assertEqual(bool(SPM.entity("entra-id")), running, today)
            self.assertEqual(SPM.entity_own("acme-backup"), running)
            self.assertFalse(SPM.entity_own("entra-id"))   # Themen-Sponsoring: nicht die Entitaet des Sponsors
            self.assertTrue(SPM.episode(slug="backup-done-right"), today)   # Folgen und Beitraege: dauerhaft
            self.assertTrue(SPM.post("mirko-p", "acme-pr"), today)

    def test_episode_references_cover_all_language_versions(self):
        self.init([rec(id="a1", episodes=["/show/episodes/backup-done-right/"]), rec(id="a2", episodes=["de/nur-dub"]), rec(id="a3", episodes=["fr/sauvegarde-bien-faite"])])
        self.assertEqual([r["id"] for r in SPM.episode(slug="backup-done-right")], ["a1", "a3"])
        self.assertEqual([r["id"] for r in SPM.episode(vid="VID1")], ["a1", "a3"])   # beide Dub-Fassungen desselben Videos
        self.assertEqual([r["id"] for r in SPM.episode(vid="VID2")], ["a2"])
        self.assertEqual(SPM.episode(slug="entra-deep-dive"), [])
        self.assertEqual(SPM.post_ref("https://www.m365.fm/de/community/u/mirko-p/blog/acme-pr/"), ("mirko-p", "acme-pr"))

    # --- Bausteine fuer die Seiten ---
    def test_note_badge_ld(self):
        self.init([rec(id="a1", entities=["acme-backup"]), rec(id="a2", label="advertisement", sponsor={"name": "Beta", "url": "https://beta.example/"}, entities=["acme-backup"])])
        rs = SPM.entity("acme-backup")
        en, de = SPM.note("en", rs), SPM.note("de", rs)
        self.assertIn('data-spm="sponsored advertisement"', en)
        self.assertIn('role="note"', en)
        self.assertIn('<strong>Sponsored</strong> · Paid partnership with <a href="https://www.acme.example/" rel="sponsored noopener"><bdi>Acme &amp; Co</bdi></a>', en)
        self.assertIn('<strong>Advertisement</strong> · Paid content on behalf of <a href="https://beta.example/" rel="sponsored noopener"><bdi>Beta</bdi></a>', en)
        self.assertIn("<strong>Anzeige</strong> · Bezahlte Partnerschaft mit", de)
        self.assertIn("<strong>Anzeige</strong> · Bezahlter Inhalt im Auftrag von", de)
        for lg in COMM_LANGS:
            h = SPM.note(lg, rs)
            self.assertNotIn("{sponsor}", h)
            self.assertIn("<bdi>Beta</bdi>", h)
        self.assertEqual(SPM.badge("de", rs), "Anzeige")
        self.assertEqual(SPM.badge("en", rs), "Advertisement")
        self.assertEqual(SPM.badge("en", rs[:1]), "Sponsored")
        self.assertEqual(SPM.ld(rs[:1]), {"@type": "Organization", "name": "Acme & Co", "url": "https://www.acme.example/"})
        self.assertEqual(len(SPM.ld(rs)), 2)
        self.assertEqual((SPM.note("en", []), SPM.badge("en", []), SPM.ld([])), ("", "", None))

    def test_links_to_the_sponsor_get_rel_sponsored(self):
        self.init([rec(entities=["acme-backup"])])
        rs = SPM.entity("acme-backup")
        h = '<a href="https://docs.acme.example/x">d</a> <a href="https://acme.example/" rel="noopener">w</a> <a href="https://other.example/">o</a> <a href="/entity/x/">i</a>'
        out = SPM.mark(h, rs)
        self.assertIn('<a href="https://docs.acme.example/x" rel="sponsored noopener">', out)
        self.assertIn('<a href="https://acme.example/" rel="noopener sponsored">', out)
        self.assertIn('<a href="https://other.example/">', out)
        self.assertEqual(SPM.mark(h, []), h)
        self.assertEqual(SPM.link_rel(rs, "https://learn.microsoft.com/x"), "noopener")
        self.assertEqual(SPM.link_rel(rs, "https://learn.microsoft.com/x", own=True), "sponsored noopener")
        self.assertEqual(SPM.link_rel(rs, "https://www.acme.example/p"), "sponsored noopener")
        self.assertEqual(SPM.link_rel([], "https://acme.example/", own=True), "noopener")

    def test_active_go_code_rewrites_sponsor_links_only(self):
        self.init([rec(go="acme-2026", entities=["acme-backup"])])
        rs = SPM.entity("acme-backup")
        SPM.set_go_codes(["acme-2026"])
        self.assertIn('href="https://api-dub.m365.fm/go/acme-2026?s=entity"', SPM.note("en", rs, "entity"))
        html = SPM.mark('<a href="https://www.acme.example/">Acme</a>', rs, "episode")
        self.assertIn('href="https://api-dub.m365.fm/go/acme-2026?s=episode"', html)
        self.assertIn('rel="sponsored noopener"', html)
        deep = SPM.mark('<a href="https://www.acme.example/whitepaper.pdf?download=1#section">PDF</a>', rs, "episode")
        self.assertIn('href="https://www.acme.example/whitepaper.pdf?download=1#section"', deep)
        self.assertIn('rel="sponsored noopener"', deep)
        SPM.set_go_codes([], offline=False)
        self.assertIn('href="https://www.acme.example/"', SPM.note("en", rs))
        SPM.set_go_codes(["acme-2026"], offline=True)
        self.assertIn('href="https://www.acme.example/"', SPM.note("en", rs))
        self.assertIn('"go" muss ein aktiver Linkcode', self.errors([rec(go="BAD")]))


class CheckSchemaRuleTests(unittest.TestCase):
    """check_schema.py: Kennzeichnung <-> JSON-LD sponsor (beide Richtungen), Lage unter der H1, rel=sponsored."""

    def run_check(self, pages):
        with tempfile.TemporaryDirectory() as d:
            for name, html in pages.items():
                (Path(d) / name).write_text(html, "utf-8")
            r = subprocess.run([sys.executable, str(ROOT / "check_schema.py"), d], capture_output=True, text=True)
            return r.returncode, r.stdout

    @staticmethod
    def page(body, *ld):
        blocks = "".join(f'<script type="application/ld+json">{json.dumps(x)}</script>' for x in ld)
        return f"<!doctype html><html><head>{blocks}</head><body>{body}</body></html>"

    SP = {"@type": "Organization", "name": "Acme", "url": "https://acme.example/"}
    NOTE = '<p class="spm-note" role="note" data-spm="sponsored"><strong>Sponsored</strong> · Paid partnership with <a href="https://acme.example/" rel="sponsored noopener">Acme</a></p>'

    def web(self, **kw):
        return {"@context": "https://schema.org", "@type": "WebPage", "url": "https://www.m365.fm/entity/x/", "name": "X", **kw}

    def test_consistent_page_passes(self):
        code, out = self.run_check({"ok.html": self.page(f"<h1>X</h1>{self.NOTE}<h2>More</h2>", self.web(sponsor=self.SP)),
                                    "event.html": self.page("<h1>E</h1>", {"@type": "Event", "name": "E", "startDate": "2026-12-01", "location": {"@type": "Place", "name": "Online"}, "sponsor": [self.SP]})})
        self.assertEqual(code, 0, out)
        self.assertNotIn("sponsor", out.lower().replace("sponsor_check", ""))

    def test_both_directions_and_position(self):
        code, out = self.run_check({"a.html": self.page(f"<h1>X</h1>{self.NOTE}", self.web()),
                                    "b.html": self.page("<h1>X</h1>", self.web(sponsor=self.SP)),
                                    "c.html": self.page(f"<h1>X</h1><h2>Y</h2>{self.NOTE}", self.web(sponsor=self.SP)),
                                    "d.html": self.page(f"<h1>X</h1>{self.NOTE}<a href=\"https://www.acme.example/p\">p</a>", {"@type": "PodcastEpisode", "name": "E", "url": "https://www.m365.fm/show/episodes/e/", "datePublished": "2026-11-01", "partOfSeries": {"@type": "PodcastSeries", "name": "S", "url": "https://www.m365.fm/show/"}, "sponsor": self.SP})})
        self.assertEqual(code, 1, out)
        self.assertIn("FEHLER 1 x Kennzeichnung (Sponsored/Anzeige) ohne sponsor im JSON-LD z.B. /a.html", out)
        self.assertIn("FEHLER 1 x sponsor im JSON-LD ohne sichtbare Kennzeichnung (site_sponsorships.note) z.B. /b.html", out)
        self.assertIn("FEHLER 1 x Kennzeichnung (Sponsored/Anzeige) nicht direkt unter der H1 z.B. /c.html", out)
        self.assertIn("HINWEIS 1 x Link zum Sponsor ohne rel=sponsored z.B. /d.html", out)


if __name__ == "__main__":
    unittest.main()
