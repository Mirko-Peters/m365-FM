"""Entitaetsseiten: Beschreibung (Langtext) in der Sprache der Seite > 2500 Zeichen -> index, egal welche Sprache (Mirko, 13.11.2026)."""
import sys
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_entities as SE  # noqa: E402


def text(n):
    return ("Contoso Hub erklaert Teamablage. " * (n // 33 + 1))[:n]


def ent(i, **long):
    return {"id": i, "type": "product", "name": "Contoso Hub", "aliases": [], "desc": {"en": "A hub."}, "long": long}


class LongIndex(unittest.TestCase):
    def setUp(self):
        SE._LONG_IDX.clear()
        self.addCleanup(SE._LONG_IDX.clear)
        for p in (mock.patch.object(SE, "GENTEXT", {}), mock.patch.object(SE, "EVENTS", {})):
            p.start()
            self.addCleanup(p.stop)

    def test_grenze_ab_2500(self):
        self.assertEqual(SE.long_index_langs(ent("t-a", fr=text(2499))), [])
        SE._LONG_IDX.clear()
        self.assertEqual(SE.long_index_langs(ent("t-a", fr=text(2500))), ["fr"])   # "ab 2500 Zeichen"

    def test_jede_sprache(self):
        e = ent("t-b", **{l: text(2600) for l in ("ja", "ar", "pt", "de")})
        self.assertEqual(sorted(SE.long_index_langs(e)), ["ar", "de", "ja", "pt"])

    def test_kein_rueckfall_auf_englisch(self):
        # nur der englische Text ist lang: auf fr/ja steht Englisch -> bleibt noindex, nur en zaehlt
        e = ent("t-c", en=text(3000), fr=text(300))
        self.assertEqual(SE.long_index_langs(e), ["en"])

    def test_kurzer_text_bleibt_noindex(self):
        self.assertEqual(SE.long_index_langs(ent("t-d", en=text(900), fr=text(900))), [])

    def test_ueberblick_aus_entity_texts(self):
        with mock.patch.object(SE, "GENTEXT", {"t-e": {"de": text(2700)}}):
            self.assertEqual(SE.long_index_langs(ent("t-e")), ["de"])

    def test_gezeigter_text_ist_eigener_text(self):
        # redaktioneller englischer Text hat Vorrang auf der Seite (long_for): ein langer fr-Ueberblick wird dort nicht gezeigt -> kein Index
        with mock.patch.object(SE, "GENTEXT", {"t-f": {"fr": text(2800)}}):
            self.assertEqual(SE.long_index_langs(ent("t-f", en=text(500))), [])


class IndexLangs(unittest.TestCase):
    """hreflang-Cluster = genau die indexierbaren Sprachen (kein Verweis auf ein noindex-en, kein fehlendes de)."""

    def test_wie_bisher_ohne_langtext(self):
        self.assertEqual(SE.index_langs([], True, False), ["en", "de"])
        self.assertEqual(SE.index_langs([], False, False), ["en"])
        self.assertEqual(SE.index_langs([], True, True), [])

    def test_duenn_ohne_en(self):
        # duenne Entitaet: en ist noindex und darf nicht im Cluster der indexierten fr/ja-Seiten stehen
        self.assertEqual(SE.index_langs(["fr", "ja"], True, True), ["fr", "ja"])

    def test_duenn_de_ueber_langtext(self):
        # de qualifiziert ueber den Langtext, obwohl die Entitaet duenn ist: de gehoert in den Cluster
        self.assertEqual(SE.index_langs(["de", "fr"], True, True), ["de", "fr"])

    def test_keine_dubletten(self):
        self.assertEqual(SE.index_langs(["en", "de", "pt"], True, False), ["en", "de", "pt"])
        self.assertEqual(SE.index_langs(["de"], False, False), ["en", "de"])


if __name__ == "__main__":
    unittest.main()
