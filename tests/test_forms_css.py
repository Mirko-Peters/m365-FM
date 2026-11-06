"""Gemeinsames Formular-Design (assets/forms.css, Mirko 6.11.2026 "Design-Konsistenz"): steht im gehashten site.css-Buendel, deckt alle
Formularbereiche ab (auch Seiten ohne community.css wie die Entitaeten-Bearbeitung), uebersteht die Verkleinerung und bleibt mobil- und
barrierefreundlich (16 px gegen iOS-Zoom, 44 px Zielgroesse, sichtbarer Fokus). Lauf: python3 -m pytest -q tests/test_forms_css.py"""
import ast
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GEN = (ROOT / "generate_site.py").read_text("utf-8")
SRC = (ROOT / "assets" / "forms.css").read_text("utf-8")


def mini_css(text):
    """Die Verkleinerung aus generate_site._mini_css (aus dem Quelltext geholt, ohne den ganzen Seitenbau zu importieren)."""
    fn = next(n for n in ast.parse(GEN).body if isinstance(n, ast.FunctionDef) and n.name == "_mini_css")
    body = ast.get_source_segment(GEN, fn.body[0].value)
    expr = body.replace('(ROOT / "assets" / name).read_text(encoding="utf-8")', "text")
    return eval(expr, {"re": re, "text": text})


MIN = mini_css(SRC)


class FormsCss(unittest.TestCase):
    def test_in_site_bundle(self):
        self.assertIn('FORMS_CSS = _mini_css("forms.css")', GEN)
        line = next(l for l in GEN.splitlines() if l.strip().startswith("css = SBAR_CSS"))
        self.assertIn("FORMS_CSS", line, "forms.css muss im gehashten site.css stehen (jede Seite, keine zusaetzliche Anfrage)")

    def test_minifier_keeps_descendant_combinators(self):
        # _mini_css entfernt Leerzeichen vor ":" - "a :where(b)" wuerde zu "a:where(b)" (anderer Selektor). Darum "a *:where(b)".
        body = SRC.split("*/", 1)[1]
        self.assertFalse(re.search(r"[\w\])] :", re.sub(r"/\*.*?\*/", "", body, flags=re.S)), "Nachfahren-Selektor vor Pseudoklasse: ' *:' schreiben")
        self.assertIn(":root[data-theme=dark] *:where(input,select,textarea){color-scheme:dark}", MIN)

    def test_zero_specificity_base(self):
        # Grundregel fuer Felder per :where(): Komponentenregeln (z. B. Blog-Editor .ed-ta, Sponsor-Optionen) gewinnen weiter
        self.assertTrue(MIN.count(":where(input:not([type=checkbox]") >= 1)
        self.assertRegex(MIN, r":where\(input:not\(\[type=checkbox\][^{]*\),select,textarea\)\{[^}]*color:var\(--fg\);background-color:var\(--bg\)")

    def test_mobile_and_a11y(self):
        base = re.search(r":where\(input:not\(\[type=checkbox\][^{]*\),select,textarea\)\{([^}]*)\}", MIN).group(1)
        self.assertIn("font-size:max(16px,1em)", base, "16 px: kein Zoom auf iOS")
        self.assertIn("min-height:44px", base, "Zielgroesse 44 px")
        self.assertRegex(MIN, r"\):focus\{outline:2px solid var\(--ac\)", "sichtbarer Fokus")
        self.assertIn("[aria-invalid=true],:user-invalid", MIN, "Fehlerzustand")
        self.assertIn("html.a11y-hc{--f-bd:#fff", MIN, "Hoher Kontrast")
        self.assertIn("color-scheme:dark", MIN, "native Auswahllisten dunkel im dunklen Design")

    def test_covers_form_areas(self):
        # Formularbereiche, die die Skripte bauen (Klassen aus assets/*.js) - jeder steht in forms.css
        for sel in (".wk-form", ".ed-form", "#c-expert .ccard", "#c-events", ".wk-edit", ".adm-form", ".ec-form", ".cprof", ".cform"):
            self.assertIn(sel, SRC, sel)
        used = set()
        for f in (ROOT / "assets").glob("*.js"):
            used |= set(re.findall(r'class: "((?:wk|ed|adm|ec|sdb|rv)-form)\b', f.read_text("utf-8")))
        own = {"sdb-form": "site_sponsor.py", "rv-form": "assets/reviews.css"}   # eigene Layout-Regeln, Aussehen der Felder aus der Grundregel
        for c in used:
            self.assertTrue("." + c in SRC or c in own, c)

    def test_entity_editor_uses_shared_form(self):
        js = (ROOT / "assets" / "entity.js").read_text("utf-8")
        self.assertIn('class: "wk-form en-form"', js)
        self.assertNotIn("display:block;margin-top:.5em;font-weight:600", js, "Beschriftungen kommen aus forms.css")
        # Entitaetsseiten laden community.css nicht - die Formularregeln muessen also im site.css stehen, nicht nur in community.css
        self.assertNotIn("community_tags", (ROOT / "site_entities.py").read_text("utf-8"))

    def test_no_duplicate_field_looks(self):
        # Felder bekommen ihr Aussehen nur noch aus forms.css: keine eigenen Rahmen-/Hintergrundregeln fuer input/select/textarea in community.css
        css = (ROOT / "assets" / "community.css").read_text("utf-8")
        for rule in re.findall(r"([^{}]*\b(?:input|select|textarea)\b[^{}]*)\{([^}]*)\}", css):
            if ".ed-ta" in rule[0] or ".ed-panel" in rule[0] or ".vz-ed" in rule[0]:
                continue
            self.assertNotRegex(rule[1], r"\bborder:|background:", rule[0].strip()[:80])

    def test_counter_script(self):
        js = (ROOT / "assets" / "page.js").read_text("utf-8")
        self.assertIn('c.className="f-cnt"', js)
        self.assertIn("aria-describedby", js)
        self.assertIn(".f-cnt{", SRC)

    def test_built_pages_link_bundle_with_forms(self):
        docs = ROOT / "docs"
        page = docs / "de" / "entity" / "dotnet" / "index.html"
        if not page.exists():
            self.skipTest("kein lokaler Build (docs/)")
        m = re.search(r'href="[^"]*/(assets/site\.[0-9a-f]+\.css)"', page.read_text("utf-8"))
        self.assertTrue(m)
        self.assertIn(".f-cnt{", (docs / m.group(1)).read_text("utf-8"))


if __name__ == "__main__":
    unittest.main()
