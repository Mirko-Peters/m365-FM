"""Arbeitsseiten der Redaktion (/redaktion/) und Moderation (/moderation/): noindex, nicht in der Sitemap, keine Daten im HTML (alles kommt erst mit
Sitzung ueber /api/editor/*), und die blockierenden Pruefungen des Seitenbaus (check_titles.py, check_schema.py) laufen ueber die echten Seiten gruen.
Gebaut wird mit den echten Bausteinen aus generate_site.py (page, header, footer) ueber site_roles.desk_pages."""
import contextlib, io, json, re, subprocess, sys, tempfile, unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import generate_site as G   # noqa: E402
import site_roles as ROLE   # noqa: E402
import check_titles as CT   # noqa: E402


class DeskPages(unittest.TestCase):
    def build(self, tmp):
        docs = Path(tmp) / "docs"; sitemap = []

        def write(rel, content):
            p = docs / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(content, "utf-8")
        g = dict(BASE=G.BASE, API="https://api-dub.m365.fm", langs=G.COMM_LANGS, write=write, page=G.page, header=G.header, footer=G.footer, sitemap=sitemap)
        return docs, sitemap, ROLE.desk_pages(g)

    def test_noindex_keine_sitemap_keine_daten(self):
        with tempfile.TemporaryDirectory() as tmp:
            docs, sitemap, rels = self.build(tmp)
            self.assertEqual(sitemap, [])   # die Arbeitsseiten tragen nichts in die Sitemap ein
            self.assertEqual(len(rels), 2 * len(G.COMM_LANGS))
            self.assertIn("redaktion/index.html", rels); self.assertIn("de/moderation/index.html", rels)
            for rel in rels:
                h = (docs / rel).read_text("utf-8")
                self.assertRegex(h, r'<meta name="robots" content="noindex', rel)
                self.assertNotIn('rel="alternate" hreflang', h, rel)        # noindex-Seiten tragen kein hreflang (T42)
                self.assertNotIn("<!--hl-auto-->", h, rel)
                main = re.search(r'<main[^>]*id="main"[^>]*>(.*?)</main>', h, re.S).group(1)
                cfg = json.loads(re.search(r"window\.M365ED=(\{.*?\})</script>", main).group(1))
                self.assertEqual(sorted(cfg), ["api", "base", "lang", "mode"])   # nur Einstellungen, keine Inhalte
                self.assertEqual(cfg["mode"], "moderator" if "moderation" in rel else "editor")
                self.assertIn(f'/assets/{"moderation" if "moderation" in rel else "redaktion"}.js', main)
                text = re.sub(r"<script.*?</script>|<[^>]+>", " ", main, flags=re.S)
                self.assertLess(len(text.split()), 40, rel)                 # leere Huelle: Ueberschrift, ein Satz, Platzhalter
                self.assertNotRegex(main, r"i18n-units|i18n-stale|@[a-z0-9-]+\.[a-z]{2,}", rel)

    def test_seiten_bestehen_die_blockierenden_pruefungen(self):
        with tempfile.TemporaryDirectory() as tmp:
            docs, _, rels = self.build(tmp)
            out = io.StringIO()
            with patch.object(CT, "ROOT", Path(tmp)), contextlib.redirect_stdout(out):
                rc = CT.main()                                               # echtes check_titles.py ueber <tmp>/docs
            self.assertEqual(rc, 0, out.getvalue())
            self.assertIn(f"{len(rels)} Seiten geprueft: 0 Fehler", out.getvalue())
            self.assertNotIn("doppelte Titel (", out.getvalue().split("\n", 1)[1] if "\n" in out.getvalue() else "")   # noindex-Seiten zaehlen nicht als doppelte Titel
            r = subprocess.run([sys.executable, str(ROOT / "check_schema.py"), str(docs)], capture_output=True, text=True)   # echtes check_schema.py
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr)

    def test_oberflaeche_laedt_ohne_sitzung_nichts(self):
        """redaktion.js: Reiter und veroeffentlichte Listen erst nach bestaetigter Sitzung (Antwort 200 der Pruefliste)."""
        js = (ROOT / "assets" / "redaktion.js").read_text("utf-8")
        self.assertIn("tabs.hidden = true; root.insertBefore(tabs, scopeBox)", js)
        self.assertIn('if (n !== "review" && !state.role) return;', js)
        self.assertRegex(js, r'if \(r\.s !== 200\) \{ state\.role = ""; tabs\.hidden = true;')
        self.assertNotRegex(js, r"\.innerHTML\s*=")


if __name__ == "__main__":
    unittest.main()
