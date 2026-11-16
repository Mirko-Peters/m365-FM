"""Grosse Datenexporte liegen seit 16.11.2026 nur in r2out/ (R2-Bucket, site_size.r2_only/EXPORT_RX, ~75 MB weniger in GitHub Pages): Register fuer die
Datenbank (episodes-register[-<n>].json, translations-register[-<l>].json), og-manifest.json, seo-report.json. Die Namensregel stimmt an allen Stellen ueberein
(site_size, Site-Worker R2_EXPORT, r2out-Upload, Seiten-Hashes), Exporte fuer Browser und Community-Worker ohne R2-Rueckfall bleiben in docs/, die Schreiber
nutzen die Namen der Regel, generate_og.py liest die Liste aus r2out/ und tools/page_hashes.py zaehlt die Exporte aus r2out/ mit."""
import importlib, json, re, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_size   # noqa: E402

LANGS = ("de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")
MOVED = ["og-manifest.json", "seo-report.json", "episodes-register.json", "episodes-register-1.json", "episodes-register-5.json", "episodes-register-12.json",
         "translations-register.json", "translations-register-ja.json", "translations-register-uk.json"]
KEPT = ["episodes.json", "entities.json", "entities-src.json", "entities.jsonld", "agent.json", "openapi.json", "articles.json", "topics.json", "quotes.json", "speakers.json",
        "sponsors.json", "top.json", "spreaker-urls.json", "spreaker-pages.json", "translation-status.json", "i18n-stale.json", "llms-full.txt", "llms.txt", "robots.txt",
        "show/transcripts.json", "show/redirects.json", ".well-known/agent.json", "fr/og-manifest.json", "og-manifest.jsonl", "episodes-register-x.json",
        "episodes-register-1234.json", "translations-register-jpn.json", "translations-register-JA.json", "seo-report.json.gz", "episodes-register.json.bak"]


def js_export_rx():
    m = re.search(r"export const R2_EXPORT = /\^\\/(.+?)\$/;", (ROOT / "sitewrk" / "index.js").read_text("utf-8"))
    assert m, "R2_EXPORT im Site-Worker"
    return re.compile("^" + m.group(1).replace("\\/", "/") + "$")


class RuleTest(unittest.TestCase):
    def test_r2_only_moves_exports_keeps_the_rest(self):
        for rel in MOVED: self.assertTrue(site_size.r2_only(rel, LANGS), rel)
        for rel in KEPT: self.assertFalse(site_size.r2_only(rel, LANGS), rel)
        self.assertTrue(site_size.r2_only("og-manifest.json", ()), "unabhaengig von den Sprachen")

    def test_writers_route_exports_to_r2out(self):
        with tempfile.TemporaryDirectory() as tmp:
            out, r2 = Path(tmp) / "docs", Path(tmp) / "r2out"
            write, _w2, n = site_size.writers(out, r2, lambda c: c.replace("x.podpage.com", "img.m365.fm"), LANGS)
            for rel in MOVED + ["episodes.json", "entities.json"]: write(rel, '{"image":"https://x.podpage.com/a.png"}')
            for rel in MOVED:
                self.assertTrue((r2 / rel).is_file(), rel); self.assertFalse((out / rel).exists(), rel)
                self.assertIn("img.m365.fm", (r2 / rel).read_text("utf-8"), "Bild-URLs auch in r2out/ umgeschrieben")
            for rel in ("episodes.json", "entities.json"): self.assertTrue((out / rel).is_file(), rel); self.assertFalse((r2 / rel).exists(), rel)
            self.assertEqual(n[0], len(MOVED))

    def test_same_rule_everywhere(self):
        """site_size.EXPORT_RX, Site-Worker (R2_EXPORT ohne Blog-Import), r2out-Upload (EXPORT, blockierend) und Seiten-Hashes (EXPORT) - sonst 404 oder
        verlorene Purges nach dem Umzug. Der Site-Worker liefert zusaetzlich blog-import/ und translations-blog.json (lagen schon vorher nur in r2out/)."""
        up = re.search(r'EXPORT = re\.compile\(r"\^pages/(.+?)\$"\)', (ROOT / "tools" / "r2_pages_upload.py").read_text("utf-8")); self.assertTrue(up)
        ph = re.search(r'EXPORT = re\.compile\(r"\^(.+?)\$"\)', (ROOT / "tools" / "page_hashes.py").read_text("utf-8")); self.assertTrue(ph)
        worker = js_export_rx()
        for rx in (site_size.EXPORT_RX, re.compile("^" + up.group(1) + "$"), re.compile("^" + ph.group(1) + "$")):
            for n in MOVED: self.assertTrue(rx.match(n), (rx.pattern, n))
            for n in KEPT + ["translations-blog.json", "blog-import/part-1.json"]: self.assertFalse(rx.match(n), (rx.pattern, n))
        for n in MOVED + ["translations-blog.json", "blog-import/part-1.json", "blog-import/index.json"]:
            self.assertTrue(worker.match(n), n); self.assertTrue(site_size.r2_only(n, LANGS), n)
        for n in KEPT: self.assertFalse(worker.match(n), n)

    def test_writers_use_names_of_the_rule(self):
        """Die Schreiber (site_register.build, generate_site.py, site_seo.py) nutzen genau diese Namen; jede Sprache und Teilnummer faellt unter die Regel."""
        import site_register
        src = (ROOT / "site_register.py").read_text("utf-8")
        self.assertIn('write(f"episodes-register-{n // PART + 1}.json"', src); self.assertIn('write("episodes-register.json"', src)
        self.assertIn('write(f"translations-register-{l}.json"', src); self.assertIn('write("translations-register.json"', src)
        self.assertIn('write("og-manifest.json"', (ROOT / "generate_site.py").read_text("utf-8")); self.assertIn('write("seo-report.json"', (ROOT / "site_seo.py").read_text("utf-8"))
        for l in site_register.LANGS: self.assertTrue(site_size.r2_only(f"translations-register-{l}.json", ()), l)
        for n in range(1, 40): self.assertTrue(site_size.r2_only(f"episodes-register-{n}.json", ()), n)

    def test_worker_noindex_unchanged(self):
        """noindex wie bisher: alle umgezogenen Exporte sind .json ohne Ausnahme (nur agent.json, episodes.json, openapi.json und /.well-known/ sind indexierbar)."""
        js = (ROOT / "sitewrk" / "index.js").read_text("utf-8")
        self.assertIn('!/^\\/(?:agent|episodes|openapi)\\.json$/i.test(p)', js)


class DeployGuardTest(unittest.TestCase):
    def test_deploy_waits_for_worker_with_both_markers(self):
        """Der Deploy-Job veroeffentlicht docs/ ohne die Exporte erst, wenn der Site-Worker auf /sitemap.xml x-m365-sitemaps UND x-m365-exports setzt
        (eine Worker-Fassung nur mit den Sitemaps aus #487 reicht nicht); der Merker kommt aus finishHeaders."""
        import yaml
        steps = yaml.safe_load((ROOT / ".github" / "workflows" / "site.yml").read_text("utf-8"))["jobs"]["deploy"]["steps"]
        i = next(n for n, x in enumerate(steps) if "x-m365-exports" in (x.get("run") or ""))
        self.assertLess(i, next(n for n, x in enumerate(steps) if x.get("id") == "deployment"))
        run = steps[i]["run"]
        self.assertIn("grep -qi '^x-m365-sitemaps: *r2$'", run); self.assertIn("grep -qi '^x-m365-exports: *r2$'", run); self.assertIn("/sitemap.xml?worker-check=", run)
        js = (ROOT / "sitewrk" / "index.js").read_text("utf-8")
        self.assertIn('if (p === "/sitemap.xml" || R2_EXPORT.test(p)) h.set("x-m365-exports", "r2");', js)


class GenerateOgManifestTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); t = self.t = Path(self.tmp.name)
        self.docs, self.r2 = t / "docs", t / "r2out"; (self.docs / "assets").mkdir(parents=True); self.r2.mkdir()
        (self.docs / "assets" / "og-default.png").write_bytes(b"DEFAULT")
        sys.modules.pop("generate_og", None)
        self.G = importlib.import_module("generate_og")
        self.G.DOCS, self.G.OUT, self.G.__file__ = self.docs, t / "r2img", str(t / "generate_og.py")
    def tearDown(self): self.tmp.cleanup()

    def test_reads_manifest_from_r2out_then_docs(self):
        items = [{"path": "og/entity/teams.png", "title": "Teams", "lang": "en", "seed": "x", "cover": None}]
        (self.r2 / "og-manifest.json").write_text(json.dumps(items))
        self.assertEqual(self.G.manifest(), self.r2 / "og-manifest.json")
        self.G.main(fallback_only=True)
        self.assertEqual((self.t / "r2img" / "og/entity/teams.png").read_bytes(), b"DEFAULT")
        (self.docs / "og-manifest.json").write_text("[]")
        self.assertEqual(self.G.manifest(), self.r2 / "og-manifest.json", "r2out/ gilt (dort legt site_size.r2_only sie ab)")
        (self.r2 / "og-manifest.json").unlink()
        self.assertEqual(self.G.manifest(), self.docs / "og-manifest.json", "aeltere Baue: docs/")
        (self.docs / "og-manifest.json").unlink()
        self.assertIsNone(self.G.manifest()); self.G.main(fallback_only=True)   # ohne Liste: nichts zu tun, kein Fehler


class PageHashesExportsTest(unittest.TestCase):
    def test_r2out_exports_hashed_under_their_address(self):
        with tempfile.TemporaryDirectory() as d:
            d = Path(d)
            for rel, body in {"docs/index.html": "<html><body><main>i</main></body></html>", "docs/episodes.json": "{}",
                              "r2out/og-manifest.json": "[]", "r2out/episodes-register-3.json": "{}", "r2out/translations-register-ja.json": "{}",
                              "r2out/translations-blog.json": "{}", "r2out/search/manifest.json": "{}"}.items():
                p = d / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(body, "utf-8")
            subprocess.run([sys.executable, str(ROOT / "tools" / "page_hashes.py"), str(d / "docs"), str(d / "p.json"), str(d / "c.json"), str(d / "r2out")], check=True, capture_output=True)
            h = json.loads((d / "p.json").read_text())
            self.assertEqual(sorted(h), ["/", "/__r2out__", "/episodes-register-3.json", "/episodes.json", "/og-manifest.json", "/translations-register-ja.json"])


if __name__ == "__main__":
    unittest.main()
