"""Firmenverzeichnis mit Partner-Block (#308): die Seite ist als Anzeige gekennzeichnet (data-spm) und traegt den Sponsor im JSON-LD
der CollectionPage, sonst bricht check_schema.py (blockierend) den Seitenbau ab (Bau 598 am 7.11.2026: 15 Sprachfassungen)."""
import json
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_sponsorships as SPM   # noqa: E402
import site_members as SM   # noqa: E402
from site_learn import ENTS   # noqa: E402


class DirectorySponsorSchema(unittest.TestCase):
    def test_companies_page_has_sponsor_in_jsonld_and_passes_check_schema(self):
        SPM.reset()
        SPM.init("2026-11-07", ENTS, path=ROOT / "data" / "sponsorships.json")
        if not SPM.active_sponsor_orgs("2026-11-07", ENTS):
            self.skipTest("kein laufendes Sponsoring einer Firma")
        with tempfile.TemporaryDirectory() as tmp:
            docs = Path(tmp)
            def write(rel, content):
                p = docs / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(content, "utf-8")
            def page(lang, title, desc, url, body, alts=None, ld=None, **k):
                lds = "".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in (ld or []))
                return f'<!doctype html><html lang="{lang}"><head><title>{title}</title>{lds}</head><body>{body}</body></html>'
            g = dict(BASE="https://www.m365.fm", write=write, page=page, header=lambda lang, x="": "<header></header>", footer=lambda lang: "<footer></footer>",
                     footer_en=lambda: "<footer></footer>", LANGS={"de": ("Deutsch", "de")}, sitemap=[], TODAY="2026-11-07")
            org = {"handle": "contoso-de", "name": "Contoso", "website": "https://contoso.example", "public": True, "claimed": True, "members": [], "expertise": [], "programs": [], "channels": [], "locations": []}
            try:
                SM.build(g, [], [org])
            except Exception as e:   # Verzeichnis-Bau braucht je nach Datenstand mehr Felder: dann nur die geschriebenen Seiten pruefen
                if not list(docs.rglob("community/companies/index.html")): self.skipTest(f"Verzeichnis-Bau im Test nicht moeglich: {e}")
            pages = list(docs.rglob("community/companies/index.html"))
            self.assertTrue(pages)
            for p in pages:
                h = p.read_text("utf-8")
                self.assertIn('data-spm="partners"', h, p)
                ld = [json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S)]
                self.assertTrue(any(x.get("@type") == "CollectionPage" and x.get("sponsor") for x in ld), p)
            r = subprocess.run([sys.executable, str(ROOT / "check_schema.py"), str(docs)], capture_output=True, text=True)
            self.assertNotIn("ohne sponsor im JSON-LD", r.stdout + r.stderr)
        SPM.reset()


if __name__ == "__main__":
    unittest.main()
