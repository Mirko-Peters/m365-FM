"""Blog-Pakete: Markdown-Pipe-Tabellen werden zu <div class="tbl-wrap"><table> (site_content_blog.render), sonst ein langer Absatz mit senkrechten Strichen.
Ohne Netz, ohne Datenbank. Die Teams-Tabelle liegt als Beispiel im Repo (imports/blog/en/teams-webinar-vs-town-hall-vs-meeting-which-to-use.md)."""
import re
import unittest
from pathlib import Path

import site_blog as BLG
import site_content_blog as CBL

ROOT = Path(__file__).resolve().parent.parent
TEAMS = ROOT / "imports" / "blog" / "en" / "teams-webinar-vs-town-hall-vs-meeting-which-to-use.md"


def rows(html):
    return [re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", r, re.S) for r in re.findall(r"<tr>(.*?)</tr>", html, re.S)]


class TableTest(unittest.TestCase):
    def test_teams_example(self):
        if not TEAMS.exists(): self.skipTest("Beispieldatei nicht ausgecheckt")
        body = TEAMS.read_text("utf-8").split("\n---", 2)[-1]   # Kopf (YAML) ab
        h = CBL.render(body)
        self.assertEqual(h.count("<table>"), 1)
        self.assertEqual(h.count('<div class="tbl-wrap">'), 1)
        r = rows(h)
        self.assertEqual(r[0], ["Topic", "Meeting", "Event up to 1,000 (webinar settings)", "Event for large audiences (town hall settings)"])
        self.assertEqual(len(r), 12)   # Kopf + 11 Datenzeilen
        self.assertTrue(all(len(x) == 4 for x in r))
        self.assertIn("<td>Q&amp;A, polls, reactions</td>", h)   # Zellen escaped
        self.assertNotIn("|", re.sub(r"<[^>]+>", "", h))   # kein Pipe-Rest im sichtbaren Text
        self.assertNotIn("---|", h)
        self.assertIn("<p>All three share a maximum duration of 30 hours.", h)   # Absatz danach bleibt Absatz

    def test_structure_and_scope(self):
        h = CBL.render("| A | B |\n|---|---|\n| 1 | 2 |\n")
        self.assertEqual(h, '<div class="tbl-wrap"><table><thead><tr><th scope="col">A</th><th scope="col">B</th></tr></thead>'
                            "<tbody><tr><td>1</td><td>2</td></tr></tbody></table></div>")

    def test_alignment(self):
        h = CBL.render("| L | C | R | N |\n|:---|:---:|---:|---|\n| a | b | c | d |\n")
        self.assertIn('<th scope="col" style="text-align:left">L</th>', h)
        self.assertIn('<th scope="col" style="text-align:center">C</th>', h)
        self.assertIn('<th scope="col" style="text-align:right">R</th>', h)
        self.assertIn('<th scope="col">N</th>', h)
        self.assertIn('<td style="text-align:center">b</td>', h)
        self.assertIn("<td>d</td>", h)

    def test_without_outer_pipes(self):
        h = CBL.render("A | B\n--- | ---\n1 | 2\n")
        self.assertEqual(rows(h), [["A", "B"], ["1", "2"]])

    def test_uneven_rows(self):
        h = CBL.render("| A | B | C |\n|---|---|---|\n| 1 |\n| 1 | 2 | 3 | 4 | 5 |\n| x | y | z |\n")
        r = rows(h)
        self.assertEqual(r[1], ["1", "", ""])   # zu kurz: leere Zellen
        self.assertEqual(r[2], ["1", "2", "3 | 4 | 5"])   # zu lang: Rest in der letzten Zelle, nichts verloren
        self.assertEqual(r[3], ["x", "y", "z"])
        self.assertTrue(all(len(x) == 3 for x in r))

    def test_pipe_in_code_and_escaped(self):
        h = CBL.render("| Cmd | Note |\n|---|---|\n| `Get-X | Format-List` | a \\| b |\n")
        self.assertEqual(rows(h)[1], ["<code>Get-X | Format-List</code>", "a | b"])

    def test_inline_markup_in_cells(self):
        h = CBL.render("| Name | Link |\n|---|---|\n| **Bold** and *it* | [Doc](https://example.com/a) |\n")
        self.assertIn("<td><strong>Bold</strong> and <em>it</em></td>", h)
        self.assertIn('<td><a href="https://example.com/a">Doc</a></td>', h)

    def test_no_table_unchanged(self):
        md = "Intro with a | pipe in text.\n\n## Heading\n\n- one\n- two\n\nFirst | second\n\nlast paragraph\n"
        self.assertEqual(CBL.extract_tables(md), (md, []))
        h = CBL.render(md)
        self.assertNotIn("<table", h)
        self.assertIn("<p>Intro with a | pipe in text.</p>", h)
        self.assertIn("<p>First | second</p>", h)
        self.assertEqual(h.count("<li>"), 2)
        # Kopfzeile ohne Trennzeile ist keine Tabelle
        self.assertNotIn("<table", CBL.render("| A | B |\n| 1 | 2 |\n"))
        # Trennzeile mit anderer Spaltenzahl ist keine Tabelle
        self.assertNotIn("<table", CBL.render("| A | B |\n|---|---|---|\n| 1 | 2 |\n"))

    def test_list_before_and_after(self):
        md = "Intro.\n\n- first\n- second\n| A | B |\n|---|---|\n| 1 | 2 |\n- after one\n- after two\n\nEnd.\n"
        h = CBL.render(md)
        self.assertEqual(h.count("<ul>"), 2)
        self.assertEqual(h.count("<table>"), 1)
        self.assertLess(h.index("<li>second</li>"), h.index("<table>"))
        self.assertLess(h.index("</table>"), h.index("<li>after one</li>"))
        self.assertIn("<p>End.</p>", h)
        self.assertNotIn("|", re.sub(r"<[^>]+>", "", h))

    def test_paragraph_directly_before_and_after(self):
        h = CBL.render("Text before\n| A | B |\n|---|---|\n| 1 | 2 |\nText after\n")
        self.assertLess(h.index("<p>Text before</p>"), h.index("<table>"))
        self.assertLess(h.index("</table>"), h.index("<p>Text after</p>"))

    def test_two_tables_and_blank_line_inside(self):
        md = "| A | B |\n|---|---|\n| 1 | 2 |\n\n| 3 | 4 |\n\n| C | D |\n|---|---|\n| 5 | 6 |\n"
        h = CBL.render(md)
        self.assertEqual(h.count("<table>"), 2)   # Leerzeile in der Tabelle: Zeile bleibt drin; danach neue Tabelle
        self.assertEqual(rows(h), [["A", "B"], ["1", "2"], ["3", "4"], ["C", "D"], ["5", "6"]])

    def test_heading_ends_table(self):
        h = CBL.render("| A | B |\n|---|---|\n| 1 | 2 |\n## Next | part\n\ntext\n")
        self.assertEqual(h.count("<table>"), 1)
        self.assertIn("<h2>Next | part</h2>", h)

    def test_code_fence_untouched(self):
        md = "```\n| A | B |\n|---|---|\n| 1 | 2 |\n```\n"
        self.assertEqual(CBL.extract_tables(md), (md, []))

    def test_script_in_cell_is_escaped(self):
        h = CBL.render("| A | B |\n|---|---|\n| <script>alert(1)</script> | <img src=x onerror=alert(1)> |\n")
        self.assertNotIn("<script", h)
        self.assertNotIn("<img", h)
        self.assertIn("&lt;script&gt;alert(1)&lt;/script&gt;", h)
        self.assertIn("&lt;img src=x onerror=alert(1)&gt;", h)

    def test_script_in_header_is_escaped(self):
        h = CBL.render("| <b onmouseover=x>A</b> | B |\n|---|---|\n| 1 | 2 |\n")
        self.assertNotIn("<b ", h)
        self.assertIn("&lt;b onmouseover=x&gt;A&lt;/b&gt;", h)

    def test_check_still_blocks_script_in_package(self):
        body = "x " * 320 + "\n\n| A | B |\n|---|---|\n| <script>1</script> | 2 |\n"
        rec = {"meta": {"title": "Table escape check title", "summary": "A short summary that is long enough to pass the length rule of fifty characters.",
                        "status": "approved", "author": "mirko-p", "date": "2026-11-17", "topics": []}, "body": body}
        it, err = CBL.check(rec, "en", "table-escape-check", {})
        self.assertIsNone(it)
        self.assertTrue(any("HTML-Element" in e for e in err))

    def test_package_html_has_table(self):
        body = ("Intro paragraph. " * 160) + "\n\n## Compare\n\n| A | B |\n|---|---|\n| 1 | 2 |\n"
        rec = {"meta": {"title": "Table in package title", "summary": "A short summary that is long enough to pass the length rule of fifty characters.",
                        "status": "approved", "author": "mirko-p", "date": "2026-11-17", "topics": []}, "body": body}
        it, err = CBL.check(rec, "en", "table-in-package", {})
        self.assertEqual(err, [])
        self.assertIn('<div class="tbl-wrap"><table>', it["html"])

    def test_wrap_tables_for_translations(self):
        """Die Bereinigung der Uebersetzung (site_podpage.san) verwirft <div> und style, behaelt <table>: der Wrapper kommt wieder drumherum."""
        import site_podpage as P
        src = CBL.render("| A | B |\n|---|---|\n| 1 | 2 |\n")
        san = P.san(src)
        self.assertIn("<table>", san)
        self.assertNotIn("tbl-wrap", san)
        w = CBL.wrap_tables(san)
        self.assertEqual(w.count('<div class="tbl-wrap">'), 1)
        self.assertTrue(w.startswith('<div class="tbl-wrap"><table>') and w.endswith("</table></div>"))
        self.assertEqual(CBL.wrap_tables(w), w)   # zweimal anwenden aendert nichts
        self.assertEqual(CBL.wrap_tables("<p>x</p>"), "<p>x</p>")

    def test_translation_units_keep_table_structure(self):
        """Die Uebersetzung zerlegt Zellen in eigene Segmente, die Tabellen-Tags bleiben Vorlage."""
        import translate_blog as TB
        tpl, units, _ = TB.source_of({"slug": "content/t", "title": "Table title", "desc": "", "faq": [],
                                      "html": CBL.render("| Topic | Meeting |\n|---|---|\n| Chat | Meeting chat |\n")})
        self.assertIn("<table>", tpl)
        self.assertEqual([t for i, t in units if i.isdigit()], ["Topic", "Meeting", "Chat", "Meeting chat"])

    def test_page_build_adds_css_only_for_posts_with_table(self):
        """Seitenbau (site_blog.build): Tabellen-CSS genau einmal auf Seiten mit Tabelle, sonst gar nicht."""
        BASE = "https://example.test"
        def post(i, slug, html):
            return {"id": i, "handle": "mirko-p", "name": "Mirko Peters", "slug": slug, "lang": "en", "title": f"Sample article number {i}", "summary": "x", "body": "", "html": html,
                    "topics": [], "published": 1793836800, "created": 1793836800, "updated": 1793836800, "votes": 0, "coauthors": [], "faq": []}
        posts = [post(1, "with-table", CBL.render("Intro.\n\n| A | B |\n|---|---|\n| 1 | 2 |\n")), post(2, "no-table", "<p>Plain text only</p>")]
        pages = {}
        def page(lang, title, desc, canonical, body, *a, **kw):
            pages[canonical] = body; return body
        g = {"BASE": BASE, "write": lambda *a: None, "write_r2": lambda *a: None, "page": page, "header": lambda lang, s: "", "footer": lambda lang: "", "footer_en": lambda: "",
             "LANGS": {}, "sitemap": [], "TODAY": "2026-11-17"}
        BLG.build(g, posts, [{"handle": "mirko-p", "name": "Mirko Peters"}], "https://api.example.test")
        a = pages[f"{BASE}/community/u/mirko-p/blog/with-table/"]; b = pages[f"{BASE}/community/u/mirko-p/blog/no-table/"]
        self.assertEqual(a.count(".tbl-wrap{overflow-x:auto"), 1)
        self.assertIn('<div class="tbl-wrap"><table>', a)
        self.assertNotIn("tbl-wrap", b)

    def test_css_only_with_table(self):
        self.assertIn(".tbl-wrap{overflow-x:auto", BLG.TBL_CSS)
        self.assertIn("var(--bd)", BLG.TBL_CSS)   # Farben aus den Seitenfarben (hell/dunkel), keine festen Werte
        self.assertNotRegex(BLG.TBL_CSS, r"#[0-9a-fA-F]{3,6}\b")


if __name__ == "__main__":
    unittest.main()
