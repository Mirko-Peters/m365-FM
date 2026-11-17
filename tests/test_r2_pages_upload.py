"""tools/r2_pages_upload.py (r2out/) und tools/r2_site_sync.py (Spiegel der Website) mit nachgebautem R2-Bucket:
Reihenfolge, Content-Types, Manifest, Entfernt-Markierung (nur eigene Objekte, nichts geloescht), Wiederaufnahme, Fehler -> keine Bau-Kennung."""
import importlib, io, json, os, sys, tempfile, types, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class NoSuchKey(Exception):
    pass


class FakeS3:
    """Bucket im Speicher: Objekte mit Inhalt, Content-Type und Metadaten; Listen seitenweise wie S3."""
    def __init__(self):
        self.obj, self.log, self.fail_put, self.fail_once = {}, [], set(), set()
    def put_object(self, Bucket, Key, Body, ContentType, CacheControl, Metadata=None):
        if Key in self.fail_put: raise RuntimeError("boom")
        if Key in self.fail_once: self.fail_once.discard(Key); raise RuntimeError("SlowDown")
        self.obj[Key] = {"body": Body, "ct": ContentType, "meta": dict(Metadata or {})}; self.log.append(("put", Key))
    def copy_object(self, Bucket, Key, CopySource, MetadataDirective, ContentType, CacheControl, Metadata):
        assert CopySource == {"Bucket": Bucket, "Key": Key} and MetadataDirective == "REPLACE"
        self.obj[Key] = {**self.obj[Key], "ct": ContentType, "meta": dict(Metadata)}; self.log.append(("copy", Key))
    def head_object(self, Bucket, Key):
        if Key not in self.obj: raise NoSuchKey(Key)
        return {"Metadata": self.obj[Key]["meta"]}
    def get_object(self, Bucket, Key):
        if Key not in self.obj: raise NoSuchKey(Key)
        return {"Body": io.BytesIO(self.obj[Key]["body"])}
    def list_objects_v2(self, Bucket, Prefix, MaxKeys, ContinuationToken=None):
        ks = sorted(k for k in self.obj if k.startswith(Prefix)); i = int(ContinuationToken or 0); page = ks[i:i + 2]   # kleine Seiten: Blaettern wird mitgetestet
        r = {"Contents": [{"Key": k} for k in page], "IsTruncated": i + 2 < len(ks)}
        if r["IsTruncated"]: r["NextContinuationToken"] = str(i + 2)
        return r
    def gone(self, k): return self.obj[k]["meta"].get("gone") == "1"


def run(mod, argv, env, s3):
    fake = types.ModuleType("boto3"); fake.client = lambda *a, **k: s3
    old_mod, old_argv, old_env = sys.modules.get("boto3"), sys.argv, dict(os.environ)
    sys.modules["boto3"] = fake; sys.argv = [mod + ".py", *map(str, argv)]
    os.environ.update({"R2_ACCOUNT_ID": "a", "R2_BUCKET": "b", "R2_ACCESS_KEY_ID": "k", "R2_SECRET_ACCESS_KEY": "s", **env})
    sys.path.insert(0, str(ROOT / "tools"))
    try:
        for m in ("r2_common", mod): sys.modules.pop(m, None)
        m = importlib.import_module(mod)
        if mod == "r2_site_sync":
            return m.marker(Path(argv[1])) if argv[0] == "--marker" else m.main(Path(argv[0]))
        return m.main()
    finally:
        sys.path.remove(str(ROOT / "tools"))
        if old_mod is None: sys.modules.pop("boto3", None)
        else: sys.modules["boto3"] = old_mod
        sys.argv = old_argv; os.environ.clear(); os.environ.update(old_env)


def tree(root, files):
    for rel, body in files.items():
        p = root / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(body, encoding="utf-8")


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); t = Path(self.tmp.name)
        self.docs, self.r2out, self.keys, self.man = t / "docs", t / "r2out", t / "r2-keys.json", t / "r2_docs.json"
        self.changed = t / "changed.json"
        self.s3 = FakeS3()
        self.denv = {"R2_MANIFEST": str(self.man), "R2_KEEP_KEYS": str(self.keys), "R2_CHANGED_OUT": str(self.changed)}
    def tearDown(self): self.tmp.cleanup()
    def r2out_run(self):
        tree(self.r2out, {"pl/x/index.html": "pl", "search/manifest.json": "{}"}) if not self.r2out.exists() else None
        os.makedirs(ROOT / "data" / "cache", exist_ok=True)
        return run("r2_pages_upload", [self.r2out], {"R2_KEYS_OUT": str(self.keys), "R2_CHANGED_OUT": str(self.changed)}, self.s3)
    def sync(self, **env): return run("r2_site_sync", [self.docs], {**self.denv, **env}, self.s3)


class SyncTest(Base):
    def test_files_before_pages_types_meta_and_marker_last(self):
        tree(self.docs, {"index.html": "<h1>a</h1>", "de/x/index.html": "x", "assets/site.ab12cd34ef.css": "a{}", "feed.json": "{}", "cal/event.ics": "B", "og/a.png": "p", "r2-build.txt": "7.1\n"})
        self.keys.write_text(json.dumps(["pages/pl/x/index.html"]))
        self.assertEqual(self.sync(), 0)
        puts = [k for op, k in self.s3.log if op == "put" and k.startswith("pages/")]
        self.assertLess(max(i for i, k in enumerate(puts) if not k.endswith(".html")), min(i for i, k in enumerate(puts) if k.endswith(".html")), "erst Dateien, dann Seiten")
        self.assertNotIn("pages/r2-build.txt", self.s3.obj, "Kennung nicht im normalen Lauf")
        o = self.s3.obj
        self.assertEqual(o["pages/assets/site.ab12cd34ef.css"]["ct"], "text/css; charset=utf-8"); self.assertEqual(o["pages/cal/event.ics"]["ct"], "text/calendar; charset=utf-8")
        self.assertEqual(o["pages/index.html"]["meta"], {"src": "docs"})
        ch = json.loads(self.changed.read_text()); self.assertIn("/", ch); self.assertIn("/feed.json", ch); self.assertNotIn("/og/a.png", ch, "Bilder nie unter /__r2c")
        self.assertEqual(run("r2_site_sync", ["--marker", self.docs], self.denv, self.s3), 0)
        self.assertEqual(o["pages/r2-build.txt"]["body"], b"7.1\n")
        self.s3.log.clear(); self.assertEqual(self.sync(), 0); self.assertEqual([x for x in self.s3.log if x[0] == "put" and x[1].startswith("pages/")], [], "unveraendert: nichts neu")

    def test_tombstone_own_objects_only_and_revive(self):
        tree(self.docs, {f"p{i}/index.html": str(i) for i in range(10)})
        self.s3.obj["pages/pl/x/index.html"] = {"body": b"pl", "ct": "text/html", "meta": {}}           # r2out (in der Liste)
        self.s3.obj["pages/old-r2out/index.html"] = {"body": b"o", "ct": "text/html", "meta": {}}      # Altbestand r2out (nicht in der Liste): Seite, die kein Bau mehr erzeugt
        self.s3.obj["pages/old-r2out/data.bin"] = {"body": b"d", "ct": "application/octet-stream", "meta": {}}   # fremd: keine Seite
        self.keys.write_text(json.dumps(["pages/pl/x/index.html"]))
        self.assertEqual(self.sync(), 0)
        (self.docs / "p3" / "index.html").unlink()
        self.assertEqual(self.sync(), 0)
        self.assertTrue(self.s3.gone("pages/p3/index.html")); self.assertEqual(self.s3.obj["pages/p3/index.html"]["body"], b"3", "Inhalt bleibt")
        self.assertFalse(self.s3.gone("pages/old-r2out/data.bin"), "fremde Objekte unberuehrt"); self.assertFalse(self.s3.gone("pages/pl/x/index.html"))
        self.assertTrue(self.s3.gone("pages/old-r2out/index.html"), "Seite ohne Metadaten, die der Bau nicht mehr erzeugt: entfernt (K25/K41)")
        self.assertIn("pages/p3/index.html", json.loads(self.s3.obj["meta/gone.json"]["body"])); self.assertIn("/p3/", json.loads(self.changed.read_text()))
        tree(self.docs, {"p3/index.html": "3"})   # gleiche Seite, gleicher Inhalt kommt zurueck
        self.assertEqual(self.sync(), 0)
        self.assertFalse(self.s3.gone("pages/p3/index.html"), "wieder erzeugt -> neu geladen, Markierung weg")
        self.assertNotIn("pages/p3/index.html", json.loads(self.s3.obj["meta/gone.json"]["body"]))

    def test_removed_r2out_language_pages_are_marked(self):
        # K25: Profil privat/geloescht -> Sprachseiten (nur r2out/, ohne Metadaten) fehlen im Bau und muessen wie docs-Seiten als entfernt gelten
        tree(self.docs, {f"p{i}/index.html": str(i) for i in range(10)})
        for k in ("pages/fr/community/u/alice/index.html", "pages/ja/community/u/alice/index.html", "pages/pl/x/index.html"):
            self.s3.obj[k] = {"body": b"alt", "ct": "text/html", "meta": {}}
        self.s3.obj["pages/foo.bin"] = {"body": b"f", "ct": "application/octet-stream", "meta": {}}   # fremd, kein r2out-Muster
        self.keys.write_text(json.dumps(["pages/fr/community/u/alice/index.html", "pages/ja/community/u/alice/index.html", "pages/pl/x/index.html"]))
        self.assertEqual(self.sync(), 0)
        self.assertFalse(self.s3.gone("pages/fr/community/u/alice/index.html"), "im Bau: bleibt")
        self.keys.write_text(json.dumps(["pages/pl/x/index.html"]))   # naechster Bau: Profil alice nicht mehr oeffentlich
        self.assertEqual(self.sync(), 0)
        for k in ("pages/fr/community/u/alice/index.html", "pages/ja/community/u/alice/index.html"):
            self.assertTrue(self.s3.gone(k), k); self.assertEqual(self.s3.obj[k]["body"], b"alt", "Inhalt bleibt im Bucket")
            self.assertIn(k, json.loads(self.s3.obj["meta/gone.json"]["body"]))
        ch = json.loads(self.changed.read_text()); self.assertIn("/fr/community/u/alice/", ch); self.assertIn("/ja/community/u/alice/", ch)
        self.assertFalse(self.s3.gone("pages/foo.bin"), "fremde Objekte unberuehrt"); self.assertFalse(self.s3.gone("pages/pl/x/index.html"))
        self.keys.write_text(json.dumps(["pages/pl/x/index.html", "pages/fr/community/u/alice/index.html"]))   # Profil wieder oeffentlich
        self.assertEqual(self.sync(), 0)
        self.assertIn("pages/fr/community/u/alice/index.html", json.loads(self.s3.obj["meta/gone.json"]["body"]), "bleibt markiert, bis der r2out-Upload es neu laedt")

    def test_removed_r2out_en_de_pages_are_marked(self):
        # K25/K41: Entitaetsseiten aller Sprachen (auch en/de) und Blog-Sprachfassungen liegen ohne Sprachpraefix bzw. mit de/ in r2out/;
        # fehlen sie im Bau (Profil privat/geloescht), gelten sie als entfernt - sonst bliebe /entity/<handle>/ mit Name und Kurzzeile erreichbar
        tree(self.docs, {f"p{i}/index.html": str(i) for i in range(10)})
        ks = ("pages/entity/alice/index.html", "pages/de/entity/alice/index.html", "pages/community/u/alice/blog/x/index.html", "pages/entity/alice/feed.xml")
        for k in ks + ("pages/entity/m365/index.html",):
            self.s3.obj[k] = {"body": b"alt", "ct": "text/html", "meta": {}}
        self.s3.obj["pages/foo.bin"] = {"body": b"f", "ct": "application/octet-stream", "meta": {}}   # fremd, kein Seiten-Muster
        self.keys.write_text(json.dumps(list(ks) + ["pages/entity/m365/index.html"]))
        self.assertEqual(self.sync(), 0)
        self.keys.write_text(json.dumps(["pages/entity/m365/index.html"]))   # naechster Bau: Profil alice weg
        self.assertEqual(self.sync(), 0)
        for k in ks: self.assertTrue(self.s3.gone(k), k)
        self.assertFalse(self.s3.gone("pages/entity/m365/index.html"), "noch im Bau: bleibt")
        self.assertFalse(self.s3.gone("pages/foo.bin"), "fremde Objekte unberuehrt")

    def test_lost_manifest_still_marks_from_bucket_listing(self):
        tree(self.docs, {f"p{i}/index.html": str(i) for i in range(10)})
        self.keys.write_text(json.dumps(["pages/pl/x/index.html"]))
        self.assertEqual(self.sync(), 0)
        self.man.unlink(); (self.docs / "p5" / "index.html").unlink()   # Cache verloren
        self.assertEqual(self.sync(), 0); self.assertTrue(self.s3.gone("pages/p5/index.html"))

    def test_guard_ignores_og_move_to_img_bucket(self):
        # 4.11.2026: Teilen-Bilder ziehen aus docs/og/ nach R2 og/ (img.m365.fm) - viele Markierungen auf einmal, kein Abbruch
        tree(self.docs, {**{f"p{i}/index.html": str(i) for i in range(3)}, **{f"og/e{i}.png": "p" for i in range(9)}})
        self.keys.write_text(json.dumps(["pages/pl/x/index.html"]))
        self.assertEqual(self.sync(), 0)
        import shutil; shutil.rmtree(self.docs / "og")
        self.assertEqual(self.sync(), 0)
        self.assertTrue(self.s3.gone("pages/og/e0.png")); self.assertEqual(self.s3.obj["pages/og/e0.png"]["body"], b"p", "Inhalt bleibt")
        # die Sicherung fuer alle anderen Dateien prueft test_guard_wrong_dir_and_force weiter

    def test_guard_wrong_dir_and_force(self):
        tree(self.docs, {f"p{i}/index.html": str(i) for i in range(10)})
        self.keys.write_text(json.dumps(["pages/pl/x/index.html"]))
        self.assertEqual(self.sync(), 0)
        for i in range(8): (self.docs / f"p{i}" / "index.html").unlink()   # 8 weg, 2 bleiben: mehr Markierungen als Dateien
        self.assertEqual(self.sync(), 1); self.assertFalse(self.s3.gone("pages/p0/index.html"))
        self.assertEqual(self.sync(R2_TOMBSTONE_FORCE="1"), 0); self.assertTrue(self.s3.gone("pages/p0/index.html"))
        (self.docs / "p8" / "index.html").unlink()
        self.assertEqual(self.sync(), 0, "danach wieder normal (nichts haengt)"); self.assertTrue(self.s3.gone("pages/p8/index.html"))

    def test_errors_fail_without_marking(self):
        tree(self.docs, {"a.json": "{}", "b/index.html": "b", "c/index.html": "c"})
        self.keys.write_text(json.dumps(["pages/pl/x/index.html"]))
        self.assertEqual(self.sync(), 0)
        (self.docs / "c" / "index.html").unlink(); tree(self.docs, {"a.json": '{"v":2}', "b/index.html": "b2"})
        self.s3.fail_put.add("pages/a.json")
        self.assertEqual(self.sync(), 1, "Fehler -> Ende 1, keine Bau-Kennung")
        self.assertEqual(self.s3.obj["pages/b/index.html"]["body"], b"b", "Seiten erst, wenn alle Dateien da sind")
        self.assertFalse(self.s3.gone("pages/c/index.html"), "bei Fehlern nichts markieren")
        self.s3.fail_put.clear(); self.s3.fail_once.add("pages/a.json")
        self.assertEqual(self.sync(), 0, "einmaliger Fehler wird wiederholt"); self.assertTrue(self.s3.gone("pages/c/index.html"))

    def test_requires_r2out_keys(self):
        tree(self.docs, {"a/index.html": "a"})
        self.assertEqual(self.sync(), 1, "ohne Liste der r2out-Schluessel kein Lauf")
        self.keys.write_text("[]"); self.assertEqual(self.sync(), 1, "leere Liste ebenso")
        self.assertEqual(run("r2_site_sync", ["--marker", self.docs], self.denv, self.s3), 1, "Kennung fehlt im Artefakt")


class R2outTest(Base):
    def test_r2out_writes_keys_types_and_revives_gone(self):
        mpath = ROOT / "data" / "cache" / "r2_pages.json"; backup = mpath.read_bytes() if mpath.exists() else None
        try:
            if mpath.exists(): mpath.unlink()
            tree(self.r2out, {"pl/x/index.html": "pl", "search/manifest.json": "{}", "blog-import/index.json": "{}"})
            self.assertEqual(self.r2out_run(), 0)
            self.assertEqual(sorted(json.loads(self.keys.read_text())), ["pages/blog-import/index.json", "pages/pl/x/index.html", "pages/search/manifest.json"])
            self.assertEqual(self.s3.obj["pages/search/manifest.json"]["ct"], "application/json; charset=utf-8")
            self.s3.obj["pages/pl/x/index.html"]["meta"] = {"gone": "1"}
            self.s3.obj["meta/gone.json"] = {"body": json.dumps(["pages/pl/x/index.html"]).encode(), "ct": "", "meta": {}}
            self.s3.log.clear(); self.assertEqual(self.r2out_run(), 0)
            self.assertEqual([k for op, k in self.s3.log if op == "put"], ["pages/pl/x/index.html"], "nur die markierte Seite neu, sonst nichts")
            self.assertFalse(self.s3.gone("pages/pl/x/index.html"))
        finally:
            if backup is not None: mpath.write_bytes(backup)
            elif mpath.exists(): mpath.unlink()


class R2outOrderTest(Base):
    def _with_clean_manifest(self, fn):
        mpath = ROOT / "data" / "cache" / "r2_pages.json"; backup = mpath.read_bytes() if mpath.exists() else None
        try:
            if mpath.exists(): mpath.unlink()
            fn()
        finally:
            if backup is not None: mpath.write_bytes(backup)
            elif mpath.exists(): mpath.unlink()

    def test_failed_export_does_not_block_pages_and_returning_key_is_reloaded(self):
        def body():
            tree(self.r2out, {"pl/x/index.html": "pl", "search/part-1.json": "{}", "fr/y/index.html": "fr"})
            self.s3.fail_put.add("pages/search/part-1.json")
            self.assertEqual(self.r2out_run(), 0)
            self.assertIn("pages/pl/x/index.html", self.s3.obj, "Seiten trotz fehlgeschlagener Export-Datei geladen")
            self.s3.fail_put.clear()
            (self.r2out / "fr" / "y" / "index.html").unlink(); self.assertEqual(self.r2out_run(), 0)   # faellt einmal weg
            tree(self.r2out, {"fr/y/index.html": "fr"}); self.s3.log.clear(); self.assertEqual(self.r2out_run(), 0)
            self.assertIn(("put", "pages/fr/y/index.html"), self.s3.log, "zurueckgekehrter Schluessel wird neu geladen (Manifest gekuerzt)")
        self._with_clean_manifest(body)

    def test_missing_page_blocks_deploy_existing_page_does_not(self):
        """11.11.2026: Sprachseiten ausser en/de gibt es nur im Bucket. Fehlt eine Seite dort nach dem Upload noch ganz -> Ende 1 (kein Deploy, sonst 404);
        scheitert nur die neue Fassung einer schon geladenen Seite, bleibt die alte erreichbar -> Warnung, Ende 0."""
        def body():
            tree(self.r2out, {"pl/x/index.html": "pl", "ru/tag/облако/index.html": "ru"})
            self.s3.fail_put.add("pages/ru/tag/облако/index.html")
            self.assertEqual(self.r2out_run(), 1, "neue Seite fehlt im Bucket")
            self.s3.fail_put.clear(); self.assertEqual(self.r2out_run(), 0); self.assertIn("pages/ru/tag/облако/index.html", self.s3.obj)
            tree(self.r2out, {"ru/tag/облако/index.html": "ru2"}); self.s3.fail_put.add("pages/ru/tag/облако/index.html")
            self.assertEqual(self.r2out_run(), 0, "alte Fassung liegt noch im Bucket")
        self._with_clean_manifest(body)

    def test_sitemap_upload_type_and_missing_sitemap_blocks_deploy(self):
        """16.11.2026: Sitemaps der Sprachen ausser en/de liegen nur in r2out/. Sie gehen mit application/xml in den Bucket (nicht gefiltert, im Purge);
        fehlt eine davon nach dem Upload ganz -> Ende 1 (der Index in GitHub Pages verweist darauf, sonst 404). Andere .xml-Dateien blockieren nicht."""
        def body():
            tree(self.r2out, {"pl/x/index.html": "pl", "sitemap-fr-blog.xml": "<urlset/>", "sitemap-ja-show-episodes-2.xml": "<urlset/>", "fr/feed.xml": "<rss/>"})
            self.s3.fail_put.add("pages/sitemap-fr-blog.xml")
            self.assertEqual(self.r2out_run(), 1, "neue Sitemap fehlt im Bucket")
            self.assertEqual(self.s3.obj["pages/sitemap-ja-show-episodes-2.xml"]["ct"], "application/xml; charset=utf-8")
            self.assertEqual(self.s3.obj["pages/sitemap-ja-show-episodes-2.xml"]["meta"], {}, "kein src=docs: der Site-Worker liefert sie aus")
            self.assertIn("pages/sitemap-fr-blog.xml", json.loads(self.keys.read_text()), "Schluessel fuer den Spiegel (nie als entfernt markiert)")
            self.s3.fail_put.clear(); self.assertEqual(self.r2out_run(), 0)
            self.assertIn("/sitemap-fr-blog.xml", json.loads(self.changed.read_text()), "fuer den Purge vorgemerkt")
            tree(self.r2out, {"sitemap-fr-blog.xml": "<urlset>2</urlset>"}); self.s3.fail_put.add("pages/sitemap-fr-blog.xml")
            self.assertEqual(self.r2out_run(), 0, "alte Fassung liegt noch im Bucket")
            self.s3.fail_put = {"pages/fr/neu/feed.xml"}; tree(self.r2out, {"fr/neu/feed.xml": "<rss/>"})
            self.assertEqual(self.r2out_run(), 0, "andere .xml (kein sitemap-<l>-<typ>.xml) blockiert nicht")
        self._with_clean_manifest(body)

    def test_moved_sitemap_overrides_docs_mirror_and_is_never_marked_gone(self):
        """Umzug: pages/sitemap-fr-blog.xml lag als Spiegel aus docs/ (src=docs) im Bucket. Der r2out-Upload ersetzt ihn ohne src (sonst lieferte der Site-Worker
        ihn nicht aus), der Spiegel nach dem Deploy markiert ihn nicht als entfernt (Schluessel aus r2out/)."""
        def body():
            self.s3.obj["pages/sitemap-fr-blog.xml"] = {"body": b"alt", "ct": "application/xml; charset=utf-8", "meta": {"src": "docs"}}
            tree(self.r2out, {"pl/x/index.html": "pl", "sitemap-fr-blog.xml": "<urlset/>"})
            self.assertEqual(self.r2out_run(), 0)
            self.assertEqual(self.s3.obj["pages/sitemap-fr-blog.xml"], {"body": b"<urlset/>", "ct": "application/xml; charset=utf-8", "meta": {}})
            tree(self.docs, {"index.html": "i", "sitemap.xml": "<sitemapindex/>", "sitemap-de-blog.xml": "<urlset/>"})
            self.assertEqual(self.sync(), 0)
            self.assertFalse(self.s3.gone("pages/sitemap-fr-blog.xml")); self.assertEqual(self.s3.obj["pages/sitemap-fr-blog.xml"]["meta"], {})
            self.assertEqual(self.s3.obj["pages/sitemap-de-blog.xml"]["meta"], {"src": "docs"})
        self._with_clean_manifest(body)

    def test_sitemap_overwritten_by_previous_mirror_is_reloaded(self):
        """Wettlauf: der Spiegel des vorigen Laufs (r2_site_sync, src=docs) ueberschreibt die eben aus r2out/ geladene Sitemap. Der naechste Upload
        sieht das per head_object und laedt sie neu, obwohl das Manifest den Inhalt schon fuehrt; ebenso, wenn sie im Bucket fehlt. Andere Schluessel
        werden nicht nachgesehen, unveraenderte Sitemaps ohne src=docs nicht neu geladen. Scheitert das Neuladen -> Ende 1 (nicht ausgeliefert)."""
        def body():
            tree(self.r2out, {"pl/x/index.html": "pl", "sitemap-fr-blog.xml": "<urlset/>", "sitemap-es-blog.xml": "<urlset/>", "sitemap-it-blog.xml": "<urlset/>"})
            self.assertEqual(self.r2out_run(), 0)
            heads = []; orig = self.s3.head_object
            self.s3.head_object = lambda Bucket, Key: (heads.append(Key), orig(Bucket, Key))[1]
            self.s3.obj["pages/sitemap-fr-blog.xml"] = {"body": b"docs-fassung", "ct": "application/xml; charset=utf-8", "meta": {"src": "docs"}}
            self.s3.obj["pages/pl/x/index.html"]["meta"] = {"src": "docs"}   # Seiten: kein head_object (zu viele), bleibt wie bisher
            del self.s3.obj["pages/sitemap-it-blog.xml"]
            self.s3.log.clear(); self.assertEqual(self.r2out_run(), 0)
            self.assertEqual(sorted(k for op, k in self.s3.log if op == "put"), ["pages/sitemap-fr-blog.xml", "pages/sitemap-it-blog.xml"])
            self.assertEqual(self.s3.obj["pages/sitemap-fr-blog.xml"], {"body": b"<urlset/>", "ct": "application/xml; charset=utf-8", "meta": {}})
            self.assertEqual(sorted(heads), ["pages/sitemap-es-blog.xml", "pages/sitemap-fr-blog.xml", "pages/sitemap-it-blog.xml"], "nur Sitemaps")
            self.assertIn("/sitemap-fr-blog.xml", json.loads(self.changed.read_text()), "fuer den Purge vorgemerkt")
            self.s3.log.clear(); self.assertEqual(self.r2out_run(), 0); self.assertEqual([x for x in self.s3.log if x[0] == "put"], [], "danach nichts mehr")
            self.s3.obj["pages/sitemap-fr-blog.xml"]["meta"] = {"src": "docs"}; self.s3.fail_put.add("pages/sitemap-fr-blog.xml")
            self.assertEqual(self.r2out_run(), 1, "Spiegel-Objekt und Neuladen gescheitert: nicht ausgeliefert -> kein Deploy")
            self.s3.fail_put.clear(); self.assertEqual(self.r2out_run(), 0); self.assertEqual(self.s3.obj["pages/sitemap-fr-blog.xml"]["meta"], {})
            self.s3.head_object = lambda Bucket, Key: (_ for _ in ()).throw(RuntimeError("timeout"))
            self.s3.log.clear(); self.assertEqual(self.r2out_run(), 0, "head_object scheitert: nur Hinweis"); self.assertEqual([x for x in self.s3.log if x[0] == "put"], [])
        self._with_clean_manifest(body)

    def test_moved_export_missing_blocks_deploy_other_json_does_not(self):
        """16.11.2026: Register, og-manifest.json und seo-report.json liegen nur in r2out/ (site_size.EXPORT_RX). Sie gehen mit application/json in den Bucket
        (ohne src, fuer den Purge vorgemerkt); fehlt einer nach dem Upload ganz -> Ende 1 (kein Deploy). Andere .json (Suchindex, Blog-Import) blockieren nicht."""
        def body():
            tree(self.r2out, {"pl/x/index.html": "pl", "episodes-register-3.json": "{}", "og-manifest.json": "[]", "translations-register-ja.json": "{}"})
            self.s3.fail_put.add("pages/episodes-register-3.json")
            self.assertEqual(self.r2out_run(), 1, "neuer Export fehlt im Bucket")
            self.assertEqual(self.s3.obj["pages/og-manifest.json"]["ct"], "application/json; charset=utf-8")
            self.assertEqual(self.s3.obj["pages/translations-register-ja.json"]["meta"], {}, "kein src=docs: der Site-Worker liefert ihn aus")
            self.assertIn("pages/episodes-register-3.json", json.loads(self.keys.read_text()), "Schluessel fuer den Spiegel (nie als entfernt markiert)")
            self.s3.fail_put.clear(); self.assertEqual(self.r2out_run(), 0)
            self.assertIn("/episodes-register-3.json", json.loads(self.changed.read_text()), "fuer den Purge vorgemerkt")
            tree(self.r2out, {"episodes-register-3.json": '{"v":2}'}); self.s3.fail_put.add("pages/episodes-register-3.json")
            self.assertEqual(self.r2out_run(), 0, "alte Fassung liegt noch im Bucket")
            self.s3.fail_put = {"pages/search/part-9.json", "pages/blog-import/part-9.json"}; tree(self.r2out, {"search/part-9.json": "{}", "blog-import/part-9.json": "{}"})
            self.assertEqual(self.r2out_run(), 0, "andere .json blockieren nicht")
        self._with_clean_manifest(body)

    def test_moved_export_overrides_docs_mirror_and_is_reloaded_after_race(self):
        """Umzug: pages/seo-report.json lag als Spiegel aus docs/ (src=docs) im Bucket. Der r2out-Upload ersetzt ihn ohne src, der Spiegel nach dem Deploy
        markiert ihn nicht als entfernt. Ueberschreibt ein spaeter Spiegel des vorigen Laufs ihn wieder (src=docs), laedt der naechste Upload ihn neu;
        scheitert das -> Ende 1 (nicht ausgeliefert)."""
        def body():
            self.s3.obj["pages/seo-report.json"] = {"body": b"alt", "ct": "application/json; charset=utf-8", "meta": {"src": "docs"}}
            tree(self.r2out, {"pl/x/index.html": "pl", "seo-report.json": "{}", "episodes-register.json": "{}"})
            self.assertEqual(self.r2out_run(), 0)
            self.assertEqual(self.s3.obj["pages/seo-report.json"], {"body": b"{}", "ct": "application/json; charset=utf-8", "meta": {}})
            tree(self.docs, {"index.html": "i", "episodes.json": "{}"})
            self.assertEqual(self.sync(), 0)
            self.assertFalse(self.s3.gone("pages/seo-report.json")); self.assertEqual(self.s3.obj["pages/seo-report.json"]["meta"], {})
            self.assertEqual(self.s3.obj["pages/episodes.json"]["meta"], {"src": "docs"}, "episodes.json bleibt in docs/")
            self.s3.obj["pages/seo-report.json"] = {"body": b"docs-fassung", "ct": "application/json; charset=utf-8", "meta": {"src": "docs"}}
            del self.s3.obj["pages/episodes-register.json"]
            self.s3.log.clear(); self.assertEqual(self.r2out_run(), 0)
            self.assertEqual(sorted(k for op, k in self.s3.log if op == "put"), ["pages/episodes-register.json", "pages/seo-report.json"])
            self.assertEqual(self.s3.obj["pages/seo-report.json"]["meta"], {})
            self.s3.obj["pages/seo-report.json"]["meta"] = {"src": "docs"}; self.s3.fail_put.add("pages/seo-report.json")
            self.assertEqual(self.r2out_run(), 1, "Spiegel-Objekt und Neuladen gescheitert: nicht ausgeliefert -> kein Deploy")
        self._with_clean_manifest(body)

    def test_blog_import_docs_mirror_is_reloaded_but_never_blocks(self):
        """blog-import/*.json und translations-blog.json (seit 04.11.2026 nur in r2out/) liefert der Site-Worker wie die Exporte nicht als src=docs-Objekt aus:
        der Upload prueft sie im Bucket mit und ersetzt einen Spiegel oder ein fehlendes Objekt; scheitert das, blockiert es den Deploy wie bisher nicht."""
        def body():
            tree(self.r2out, {"pl/x/index.html": "pl", "blog-import/index.json": '{"total":1}', "blog-import/part-1.json": "[]", "translations-blog.json": "{}", "search/part-1.json": "{}"})
            self.assertEqual(self.r2out_run(), 0)
            self.s3.obj["pages/blog-import/part-1.json"]["meta"] = {"src": "docs"}; del self.s3.obj["pages/translations-blog.json"]
            heads = []; orig = self.s3.head_object
            def head(Bucket, Key): heads.append(Key); return orig(Bucket=Bucket, Key=Key)
            self.s3.head_object = head
            self.s3.log.clear(); self.assertEqual(self.r2out_run(), 0)
            self.assertEqual(sorted(heads), ["pages/blog-import/index.json", "pages/blog-import/part-1.json", "pages/translations-blog.json"], "Suchindex und Seiten nicht")
            self.assertEqual(sorted(k for op, k in self.s3.log if op == "put"), ["pages/blog-import/part-1.json", "pages/translations-blog.json"])
            self.assertEqual(self.s3.obj["pages/blog-import/part-1.json"]["meta"], {})
            self.s3.obj["pages/blog-import/part-1.json"]["meta"] = {"src": "docs"}; self.s3.fail_put.add("pages/blog-import/part-1.json")
            self.assertEqual(self.r2out_run(), 0, "Blog-Import blockiert den Deploy nicht")
            self.s3.fail_put.clear(); self.assertEqual(self.r2out_run(), 0); self.assertEqual(self.s3.obj["pages/blog-import/part-1.json"]["meta"], {}, "naechster Lauf heilt")
        self._with_clean_manifest(body)


if __name__ == "__main__":
    unittest.main()
