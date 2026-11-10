"""Tests fuer den verkleinerten Seitenbau (SITE_LANGS) - Live (ohne Variable) bleibt unveraendert."""
import os
import sys
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import site_i18n  # noqa: E402


def with_env(value):
    env = {k: v for k, v in os.environ.items() if k != "SITE_LANGS"}
    if value is not None:
        env["SITE_LANGS"] = value
    return mock.patch.dict(os.environ, env, clear=True)


class SiteLangs(unittest.TestCase):
    def test_ohne_variable_alle_sprachen(self):
        for v in (None, "", "  ", "alle", "ALLE"):
            with with_env(v):
                self.assertIsNone(site_i18n.site_langs(), repr(v))
                self.assertEqual(site_i18n.only(site_i18n.ALL_COMM_LANGS), site_i18n.ALL_COMM_LANGS)

    def test_live_liste_unveraendert(self):
        self.assertEqual(len(site_i18n.ALL_COMM_LANGS), 15)
        self.assertEqual(site_i18n.ALL_COMM_LANGS[:2], ("en", "de"))

    def test_de_en(self):
        with with_env("de,en"):
            self.assertEqual(site_i18n.site_langs(), {"de", "en"})
            self.assertEqual(site_i18n.only(site_i18n.ALL_COMM_LANGS), ("en", "de"))

    def test_en_und_de_sind_immer_dabei(self):
        with with_env("fr"):
            self.assertEqual(site_i18n.site_langs(), {"fr", "en", "de"})
            self.assertEqual(site_i18n.only(site_i18n.ALL_COMM_LANGS), ("en", "de", "fr"))

    def test_reihenfolge_und_typ_bleiben(self):
        with with_env(" ja , ko ,"):
            r = site_i18n.only(site_i18n.ALL_COMM_LANGS)
            self.assertIsInstance(r, tuple)
            self.assertEqual(r, ("en", "de", "ja", "ko"))
            self.assertEqual(site_i18n.only(["ko", "xx", "en"]), ["ko", "en"])

    def test_pfx_bleibt(self):
        self.assertEqual(site_i18n.pfx("en"), "")
        self.assertEqual(site_i18n.pfx("de"), "/de")


if __name__ == "__main__":
    unittest.main()
