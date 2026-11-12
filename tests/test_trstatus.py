"""Uebersetzungsstatus fuer die Verwaltung (site_trstatus.py): Blog-Artikel, Entitaeten in allen Sprachen, Video-Artikel. Ohne Netz, mit eigenem Wurzelordner;
dazu eine Pruefung gegen die echten Repo-Daten (Zahlen passen zu data/blog_i18n/status.json)."""
import gzip, json, tempfile, unittest
from pathlib import Path

import site_trstatus as S

REPO = Path(__file__).resolve().parent.parent


def wj(p, data):
    p.parent.mkdir(parents=True, exist_ok=True); p.write_text(json.dumps(data), encoding="utf-8")


class Fake(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.root = Path(self.tmp.name)
        self.old = (S.ROOT, S.blog_sources); S.ROOT = self.root; S.blog_sources = lambda: []   # die echten Blogquellen (translate_blog.posts) liegen nicht im Wurzelordner

    def tearDown(self):
        S.ROOT, S.blog_sources = self.old; self.tmp.cleanup()

    def blog(self, lang, recs, bucket="00"):
        p = self.root / "data" / "blog_i18n" / lang / f"{bucket}.json.gz"; p.parent.mkdir(parents=True, exist_ok=True)
        with gzip.open(p, "wt", encoding="utf-8") as f: json.dump(recs, f)

    def test_blog_rows_slug_title_langs_only(self):
        self.blog("de", {"a": {"ok": True}, "b": {"ok": False}, "content/c": {"ok": True}})
        self.blog("fr", {"a": {"ok": True}, "b": {"seg": {}}})
        rows = S.blog_rows([{"slug": "a", "title": "A" * 300}, {"slug": "b", "title": "B"}, {"slug": "content/c", "title": "C"}, {"slug": "d", "title": "D"}])
        self.assertEqual([r["id"] for r in rows], ["a", "b", "content/c", "d"])
        self.assertTrue(all(r["k"] == "lblog" and r["lang"] == "en" and set(r) == {"k", "id", "t", "lang", "langs"} for r in rows))
        self.assertEqual(len(rows[0]["t"]), S.TITLE_MAX)
        self.assertEqual([r["langs"] for r in rows], [["de", "fr"], [], ["de"], []])   # nur Eintraege mit ok-Flag; Reihenfolge wie LANGS

    def test_entity_rows_all_languages(self):
        wj(self.root / "data" / "entity_fill" / "i18n" / "fr.json", {"teams": {"desc": "Texte", "h": "x"}, "leer": {"desc": "", "long": ""}, "stale": {"desc": "alt"}, "kaputt": 5})
        wj(self.root / "data" / "entity_fill" / "i18n" / "ja.json", {"teams": {"long": "長い"}, "pers": {"desc": "x"}})
        wj(self.root / "data" / "entity_fill" / "i18n" / "de.json", {"teams": {"desc": "Deutsch aus dem Repo"}})
        wj(self.root / "data" / "entity_fill" / "stale.json", {"fr": {"stale": ["desc"]}})
        ents = [{"id": "teams", "name": "Teams", "type": "product", "desc": {"en": "x", "de": "x"}},
                {"id": "leer", "name": "Leer", "type": "concept", "desc": {"en": "x", "de": "y"}},   # deutsche Datei-Fassung (anders als Englisch): Deutsch da
                {"id": "stale", "name": "Stale", "type": "concept", "desc": {"en": "x"}},
                {"id": "nurde", "name": "Nur Deutsch", "type": "concept", "desc": {"de": "z"}},
                {"id": "pers", "name": "Person", "type": "person", "desc": {"en": "x"}}]
        rows = {r["id"]: r for r in S.entity_rows(ents)}
        self.assertNotIn("pers", rows, "Personen bleiben draussen")
        self.assertEqual(rows["teams"]["langs"], ["de", "fr", "ja"])   # de nur wegen data/entity_fill/i18n/de.json (Datei hat en = de), dazu fr und ja
        self.assertEqual(rows["leer"]["langs"], ["de"])
        self.assertEqual(rows["stale"]["langs"], [], "als veraltet gemeldet: nicht gezeigt, zaehlt nicht")
        self.assertEqual((rows["nurde"]["lang"], rows["nurde"]["langs"]), ("de", []))

    def test_article_rows(self):
        wj(self.root / "data" / "articles" / "V1.json", {"en": {"html": "<p>x</p>"}, "de": {"html": "<p>d</p>"}, "ja": {"html": ""}, "hi": {"html": "<p>h</p>"}})
        wj(self.root / "data" / "articles" / "V2.json", {"de": {"html": "<p>d</p>"}, "fr": {"html": "<p>f</p>"}})   # Altbestand ohne Englisch
        wj(self.root / "data" / "articles" / "V3.json", {"hi": {"html": "<p>h</p>"}})                                # nur Sprachen ausserhalb der 14: keine Zeile
        wj(self.root / "data" / "articles" / "V4.json", [])
        (self.root / "data" / "articles" / "V5.json").write_text("{kaputt", encoding="utf-8")
        wj(self.root / "data" / "en_titles.json", {"V1": "  Ein   Titel "})
        wj(self.root / "episodes" / "V2.json", {"de": {"title": "Titel aus Folge"}})
        wj(self.root / "data" / "articles_tr_state.json", {"failed": {"ja|V1": "qa", "ko|V1": "qa", "de|V1": "qa", "ko|V2": "api_invalid", "xx|V2": "qa"}, "batches": [], "partial": {}})
        rows = {r["id"]: r for r in S.article_rows()}
        self.assertEqual(sorted(rows), ["V1", "V2"])
        self.assertEqual((rows["V1"]["k"], rows["V1"]["t"], rows["V1"]["lang"], rows["V1"]["langs"]), ("article", "Ein Titel", "en", ["de"]))
        self.assertEqual(rows["V1"]["fl"], ["ja", "ko"], "gesperrt = failed ohne fertige Fassung")
        self.assertEqual((rows["V2"]["t"], rows["V2"]["langs"], rows["V2"]["fl"]), ("Titel aus Folge", ["de", "fr"], ["ko"]))

    def test_build_writes_compact_file(self):
        self.blog("de", {"a": {"ok": True}})
        wj(self.root / "data" / "articles" / "V1.json", {"en": {"html": "<p>x</p>"}})
        out = {}
        rows = S.build(lambda n, c: out.__setitem__(n, c), "2026-11-10", [{"id": "e", "name": "E", "type": "concept", "desc": {"en": "x"}}], [], [{"slug": "ep", "title": "Folge"}])
        j = json.loads(out["translation-status.json"])
        self.assertEqual(j["langs"], S.LANGS)
        self.assertEqual(sorted({r["k"] for r in j["rows"]}), ["article", "entity", "notes"])   # kein Blog: Quellen leer, keine fruehere Liste uebergeben
        self.assertEqual(len(rows), len(j["rows"]))
        self.assertNotIn(" ", out["translation-status.json"].replace("Folge", ""), "kompakte Schreibweise")

    def test_legacy_posts_only_as_fallback(self):
        # translate_blog.posts() ist hier nicht lesbar (leerer Wurzelordner, andere Quelle): sonst gilt die uebergebene Liste
        out = {}; S.build(lambda n, c: out.__setitem__(n, c), "d", [], [{"slug": "x", "title": "X"}], [])
        self.assertEqual([r["id"] for r in json.loads(out["translation-status.json"])["rows"]], ["x"])


class RealData(unittest.TestCase):
    def test_blog_numbers_match_status_json(self):
        st = json.loads((REPO / "data" / "blog_i18n" / "status.json").read_text("utf-8"))
        done = S.blog_done()
        for l, v in st["langs"].items():
            self.assertLessEqual(abs(len(done[l]) - v["done"]), max(5, st["posts"] // 200), f"{l}: Datei {len(done[l])} gegen status.json {v['done']}")
        slugs = {r["id"] for r in S.blog_rows([{"slug": s, "title": s} for s in set().union(*map(set, done.values()))], done)}
        self.assertLessEqual(len(slugs), st["posts"] + 5)

    def test_real_files_small(self):
        out = {}; ents = json.loads((REPO / "data" / "entities.json").read_text("utf-8"))
        S.build(lambda n, c: out.__setitem__(n, c), "t", ents, [], [])
        self.assertLess(len(out["translation-status.json"].encode("utf-8")), 1_500_000)


if __name__ == "__main__":
    unittest.main()
