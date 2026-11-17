"""Community-Bedingungen (Nutzungsrecht an Beitraegen, ENTWURF zur anwaltlichen Pruefung) und Hinweise beim Veroeffentlichen und bei der
Kontoloeschung: sie sagen genau, was der Worker tut (worker/src/privacy.js). Lauf: python3 -m unittest tests.test_community_terms"""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_legal as SL  # noqa: E402


class Terms(unittest.TestCase):
    def test_licence_clause_de_en(self):
        de, en = SL.terms_de(), SL.terms_en()
        for w in ("einfaches, zeitlich und räumlich unbeschränktes, unwiderrufliches und unentgeltliches Nutzungsrecht", "zu vervielfältigen", "zu veröffentlichen",
                  "zu übersetzen", "zu bearbeiten", "auch nach dem Löschen deines Kontos", "Urheberrecht selbst ist nach deutschem Recht nicht übertragbar",
                  "anonymisiert", "ehemaliges Mitglied", "Entwurf"):
            self.assertIn(w, de, w)
        for w in ("non-exclusive", "perpetual, irrevocable and royalty-free", "reproduce", "translate", "edit", "continues after you delete your account",
                  "copyright itself cannot be transferred", "anonymised", "former member", "draft"):
            self.assertIn(w, en, w)
        self.assertIn(SL.TERMS_VERSION, de)

    def test_pages_built_and_linked(self):
        gen = (ROOT / "generate_site.py").read_text("utf-8")
        self.assertIn('("nutzungsbedingungen", SL.terms_de, "de"', gen); self.assertIn('("terms", SL.terms_en, "en"', gen)
        self.assertIn('href="/nutzungsbedingungen/"', SL.privacy_de()); self.assertIn('href="/terms/"', SL.privacy_en())
        self.assertNotIn("samt aller Daten", SL.privacy_de(), "Beitraege bleiben anonym - die Datenschutzerklaerung darf nichts anderes sagen")
        self.assertNotIn("and all its data", SL.privacy_en())

    def test_delete_dialog_says_what_happens_in_every_language(self):
        d = json.loads((ROOT / "data" / "community_i18n.json").read_text("utf-8"))
        self.assertEqual(len(d), 15)
        for lang, words in (("de", ("Kommentare", "anonymisiert", "ohne deinen Namen", "Community-Bedingungen", "Urheberrecht bleibt bei dir")),
                            ("en", ("comments", "anonymised", "without your name", "community terms", "copyright stays with you"))):
            for w in words: self.assertIn(w, d[lang]["delete_account_d"], (lang, w))
        for lang, t in d.items():
            self.assertIn("M365.FM", t["delete_account_d"], lang)

    def test_texts_promise_only_what_the_worker_does(self):
        # Geloeschte Blogbeitraege bleiben gespeichert (blog.js deleteUserBlog: user_id=-id), oeffentlich gibt es aber keine Route ohne Profil:
        # die Texte duerfen nicht "bleiben sichtbar" versprechen, nur dass M365.FM sie anonym zeigen DARF. Privatstellen blendet Bewertungen,
        # Kommentare und Speaker-Eintraege nicht aus - die Bedingungen sagen das.
        d = json.loads((ROOT / "data" / "community_i18n.json").read_text("utf-8"))
        self.assertNotIn("visible", d["en"]["delete_account_d"]); self.assertNotIn("sichtbar", d["de"]["delete_account_d"])
        self.assertIn("may keep showing them anonymised", d["en"]["delete_account_d"]); self.assertIn("darf sie anonymisiert weiter zeigen", d["de"]["delete_account_d"])
        de, en = SL.terms_de(), SL.terms_en()
        self.assertNotIn("Deine Beiträge erscheinen nicht mehr unter deinem Namen", de); self.assertNotIn("no longer appear under your name", en)
        self.assertIn("zeigen weiter deinen Anzeigenamen", de); self.assertIn("keep showing your display name", en)

    def test_publish_hint_in_blog_editor(self):
        js = (ROOT / "assets" / "blog.js").read_text("utf-8")
        self.assertIn("Nutzungsrecht an deinem Beitrag", js); self.assertIn("non-exclusive, perpetual and irrevocable licence", js)
        self.assertIn("Q.rights", js)
        en = json.loads((ROOT / "data" / "ui_js_en.json").read_text("utf-8"))["blog.Q"]
        self.assertIn("rights", en); self.assertIn("terms", en)


if __name__ == "__main__":
    unittest.main()
