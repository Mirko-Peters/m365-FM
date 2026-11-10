"""Teilen-Bilder nach R2: generate_og.py legt sie unter r2img/og/ ab (nicht mehr in docs/), tools/r2_og_upload.py gleicht direkt mit dem
Bucket ab (ETag = MD5) und laedt nur fehlende/geaenderte Bilder mit image/png und 1 Tag Cache; geloescht werden nur persoenliche Karten
entfernter Profile (Einladungs- und Profilkarte, PR #320). Auf main (OG_REQUIRED=1) haelt jeder Fehler den Deploy auf, damit og:image nie ins Leere zeigt."""
import contextlib, hashlib, importlib, io, json, os, sys, tempfile, types, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tests"))
from test_r2_pages_upload import FakeS3   # noqa: E402

CREDS = {"R2_ACCOUNT_ID": "a", "R2_BUCKET": "b", "R2_ACCESS_KEY_ID": "k", "R2_SECRET_ACCESS_KEY": "s"}


class EtagS3(FakeS3):
    """Wie R2: Liste mit ETag (MD5 einfacher PUTs) und gemerktem Cache-Control."""
    def put_object(self, Bucket, Key, Body, ContentType, CacheControl, Metadata=None):
        super().put_object(Bucket, Key, Body, ContentType, CacheControl, Metadata)
        self.obj[Key]["cc"] = CacheControl
    def list_objects_v2(self, Bucket, Prefix, MaxKeys, ContinuationToken=None):
        r = super().list_objects_v2(Bucket, Prefix, MaxKeys, ContinuationToken)
        for o in r["Contents"]: o["ETag"] = '"' + hashlib.md5(self.obj[o["Key"]]["body"]).hexdigest() + '"'
        return r
    fail_delete = False
    def delete_object(self, Bucket, Key):
        if self.fail_delete: raise RuntimeError("AccessDenied " + Key)
        self.obj.pop(Key, None); self.log.append(("delete", Key))


def run_upload(src, s3, creds=True, required=False, env=None):
    fake = types.ModuleType("boto3"); fake.client = lambda *a, **k: s3
    old_mod, old_env = sys.modules.get("boto3"), dict(os.environ)
    sys.modules["boto3"] = fake
    for k in [*CREDS, "OG_REQUIRED", "OG_PRUNE_FORCE"]: os.environ.pop(k, None)
    os.environ.update({**(CREDS if creds else {}), **({"OG_REQUIRED": "1"} if required else {}), **(env or {})})
    sys.path.insert(0, str(ROOT / "tools"))
    try:
        for m in ("r2_common", "r2_og_upload"): sys.modules.pop(m, None)
        return importlib.import_module("r2_og_upload").main(src)
    finally:
        sys.path.remove(str(ROOT / "tools"))
        if old_mod is None: sys.modules.pop("boto3", None)
        else: sys.modules["boto3"] = old_mod
        os.environ.clear(); os.environ.update(old_env)


class OgUploadTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); t = Path(self.tmp.name)
        self.src, self.s3 = t / "r2img", EtagS3()
        for rel, body in {"og/index.png": b"A", "og/entity/teams.png": b"B", "og/de/show/x.png": b"C"}.items():
            p = self.src / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(body)
    def tearDown(self): self.tmp.cleanup()

    def test_schluessel_typ_cache_und_nur_aenderungen(self):
        self.assertEqual(run_upload(self.src, self.s3), 0)
        self.assertEqual(sorted(self.s3.obj), ["og/de/show/x.png", "og/entity/teams.png", "og/index.png"])
        o = self.s3.obj["og/entity/teams.png"]
        self.assertEqual((o["ct"], o["cc"], o["body"]), ("image/png", "public, max-age=86400", b"B"))
        self.s3.log.clear()
        (self.src / "og/index.png").write_bytes(b"A2")
        self.assertEqual(run_upload(self.src, self.s3), 0)
        self.assertEqual(self.s3.log, [("put", "og/index.png")])   # nur das geaenderte Bild

    def test_abgleich_mit_dem_bucket_statt_cache(self):
        run_upload(self.src, self.s3)
        del self.s3.obj["og/entity/teams.png"]; self.s3.log.clear()   # im Bucket verloren: wird neu geladen
        self.assertEqual(run_upload(self.src, self.s3), 0)
        self.assertEqual(self.s3.log, [("put", "og/entity/teams.png")])

    def test_nichts_geloescht(self):
        run_upload(self.src, self.s3)
        (self.src / "og/de/show/x.png").unlink()
        self.assertEqual(run_upload(self.src, self.s3), 0)
        self.assertIn("og/de/show/x.png", self.s3.obj)   # Bild einer entfernten Seite bleibt im Bucket

    def test_fehler_haelt_deploy_auf_und_rest_folgt(self):
        self.s3.fail_put = {"og/entity/teams.png"}
        self.assertEqual(run_upload(self.src, self.s3, required=True), 1)
        self.assertEqual(run_upload(self.src, self.s3, required=False), 0)   # ausserhalb von main nur ein Hinweis
        self.s3.fail_put = set(); self.s3.log.clear()
        self.assertEqual(run_upload(self.src, self.s3, required=True), 0)
        self.assertEqual(self.s3.log, [("put", "og/entity/teams.png")])

    def test_ohne_zugangsdaten_oder_bilder(self):
        self.assertEqual(run_upload(self.src, self.s3, creds=False), 0); self.assertEqual(self.s3.obj, {})
        self.assertEqual(run_upload(self.src, self.s3, creds=False, required=True), 1)
        self.assertEqual(run_upload(self.src / "fehlt", self.s3, required=True), 1)


class PersonalCardsTest(unittest.TestCase):
    """320-4, Entscheidung (b): die Einladungskarte (Foto + Name) und die Karte der Profilseite (Name) verschwinden mit dem naechsten Bau aus dem
    Bucket, wenn das Konto geloescht oder das Profil nicht mehr oeffentlich ist - alle anderen Bilder bleiben wie bisher."""
    CARDS = {"og/index.png": b"A", "og/entity/teams.png": b"B", "og/einladung/max-m.png": b"M", "og/einladung/anna-b.png": b"N",
             "og/community/u/max-m.png": b"P", "og/de/community/u/max-m.png": b"Q", "og/community/u/anna-b.png": b"R", "og/community/u/max-m/blog/post.png": b"S"}

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.src, self.s3 = Path(self.tmp.name) / "r2img", EtagS3()
        for rel, body in self.CARDS.items():
            p = self.src / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(body)
        self.assertEqual(run_upload(self.src, self.s3), 0); self.assertEqual(sorted(self.s3.obj), sorted(self.CARDS)); self.s3.log.clear()
    def tearDown(self): self.tmp.cleanup()

    def run_quiet(self, **kw):
        out = io.StringIO()
        with contextlib.redirect_stdout(out): rc = run_upload(self.src, self.s3, **kw)
        return rc, out.getvalue()

    def test_karten_eines_entfernten_profils_werden_geloescht(self):
        for rel in ("og/einladung/max-m.png", "og/community/u/max-m.png", "og/de/community/u/max-m.png", "og/community/u/max-m/blog/post.png", "og/entity/teams.png"):
            (self.src / rel).unlink()   # max-m ist nicht mehr oeffentlich; eine Entitaetsseite und ein Blogbeitrag sind ebenfalls weg
        rc, out = self.run_quiet(required=True)
        self.assertEqual(rc, 0)
        self.assertEqual(sorted(self.s3.log), [("delete", "og/community/u/max-m.png"), ("delete", "og/de/community/u/max-m.png"), ("delete", "og/einladung/max-m.png")])
        self.assertEqual(sorted(self.s3.obj), ["og/community/u/anna-b.png", "og/community/u/max-m/blog/post.png", "og/einladung/anna-b.png", "og/entity/teams.png", "og/index.png"])
        self.assertNotIn("max-m", out)   # das Kuerzel eines entfernten Profils steht nie im (oeffentlichen) Bau-Protokoll

    def test_ohne_karten_im_bau_wird_nichts_geloescht(self):
        for rel in list(self.CARDS):
            if "einladung" in rel or "community/u" in rel: (self.src / rel).unlink()   # Profil-Export ausgefallen: keine Profile im Bau
        rc, out = self.run_quiet(required=True)
        self.assertEqual(rc, 0); self.assertEqual(self.s3.log, []); self.assertEqual(sorted(self.s3.obj), sorted(self.CARDS))
        self.assertIn("::warning::", out); self.assertIn("nichts geloescht", out)
        rc, out = self.run_quiet(required=True, env={"OG_PRUNE_FORCE": "1"})   # wirklich kein oeffentliches Profil mehr: bewusst freigegeben
        self.assertEqual(rc, 0); self.assertEqual(sorted(self.s3.obj), ["og/community/u/max-m/blog/post.png", "og/entity/teams.png", "og/index.png"])

    def test_sicherung_gegen_massenloeschung(self):
        for i in range(12): self.s3.obj[f"og/einladung/alt-{i}.png"] = {"body": b"X", "ct": "image/png", "meta": {}}   # 12 alte Karten, der Bau hat nur 2
        rc, out = self.run_quiet()
        self.assertEqual(rc, 0); self.assertEqual(self.s3.log, []); self.assertIn("OG_PRUNE_FORCE=1", out)
        rc, out = self.run_quiet(env={"OG_PRUNE_FORCE": "1"})
        self.assertEqual(len([x for x in self.s3.log if x[0] == "delete"]), 12)
        self.assertEqual(sorted(k for k in self.s3.obj if k.startswith("og/einladung/")), ["og/einladung/anna-b.png", "og/einladung/max-m.png"])

    def test_loeschfehler_haelt_den_deploy_nicht_auf_und_wird_wiederholt(self):
        (self.src / "og/einladung/max-m.png").unlink(); self.s3.fail_delete = True
        rc, out = self.run_quiet(required=True)
        self.assertEqual(rc, 0); self.assertIn("og/einladung/max-m.png", self.s3.obj); self.assertIn("::warning::", out); self.assertNotIn("max-m", out)
        self.s3.fail_delete = False
        rc, out = self.run_quiet(required=True)
        self.assertEqual(self.s3.log, [("delete", "og/einladung/max-m.png")])


class EmptyExportTest(unittest.TestCase):
    """F07 (Folge-PR zu #320): ist der Profil-Export frisch abgerufen und leer (letztes oeffentliches Profil entfernt), gehen auch die letzten
    persoenlichen Karten ohne OG_PRUNE_FORCE; ist er ausgefallen (Zwischenspeicher, fehlt) oder fehlen nur die Karten im Bau, greift die Sicherung weiter."""
    KEEP = {"og/index.png": b"A", "og/community/u/max-m/blog/post.png": b"S"}
    CARDS = {"og/einladung/max-m.png": b"M", "og/community/u/max-m.png": b"P", "og/de/community/u/max-m.png": b"Q"}

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.src, self.s3 = Path(self.tmp.name) / "r2img", EtagS3()
        for rel, body in {**self.KEEP, **self.CARDS}.items():
            p = self.src / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(body)
        self.assertEqual(run_upload(self.src, self.s3), 0)
        for rel in self.CARDS: (self.src / rel).unlink()   # der Bau erzeugt keine persoenliche Karte mehr
        self.s3.log.clear()
    def tearDown(self): self.tmp.cleanup()

    def run_with(self, mark):
        if mark is not None: (self.src / "profiles-export.json").write_text(mark if isinstance(mark, str) else json.dumps(mark), "utf-8")
        out = io.StringIO()
        with contextlib.redirect_stdout(out): rc = run_upload(self.src, self.s3, required=True)
        return rc, out.getvalue()

    def test_frisch_und_leer_loescht_die_letzten_karten(self):
        rc, out = self.run_with({"state": "frisch", "people": 0})
        self.assertEqual(rc, 0); self.assertEqual(sorted(self.s3.obj), sorted(self.KEEP))
        self.assertEqual(sorted(x[1] for x in self.s3.log if x[0] == "delete"), sorted(self.CARDS))
        self.assertNotIn("max-m", out); self.assertNotIn("::warning::", out)
        self.assertNotIn("profiles-export.json", self.s3.obj, "der Merker wird nicht hochgeladen")

    def test_frisch_und_leer_auch_ueber_der_mengen_sicherung(self):
        for i in range(12): self.s3.obj[f"og/einladung/alt-{i}.png"] = {"body": b"X", "ct": "image/png", "meta": {}}
        self.assertEqual(self.run_with({"state": "frisch", "people": 0})[0], 0)
        self.assertEqual(sorted(self.s3.obj), sorted(self.KEEP))

    def test_ausgefallener_export_loescht_nichts(self):
        for mark in (None, {"state": "cache", "people": 0}, {"state": "fehlt", "people": 0}, {"state": "frisch", "people": 3}, {"state": "frisch"}, "kaputt"):
            rc, out = self.run_with(mark)
            self.assertEqual(rc, 0); self.assertEqual(self.s3.log, [], mark); self.assertIn("nichts geloescht", out)
            (self.src / "profiles-export.json").unlink(missing_ok=True)


class MembersExportMarkTest(unittest.TestCase):
    """site_members.fetch_members: ein frisch abgerufener, leerer Export ersetzt die gespeicherte Fassung (keine Seiten und Karten entfernter Profile)
    und setzt den Merker fuer den Upload; ein Ausfall nutzt die gespeicherte Fassung und markiert "cache"."""
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); t = Path(self.tmp.name)
        sys.path.insert(0, str(ROOT))
        try: import site_members as MEM; import site_fetch as SF
        finally: sys.path.remove(str(ROOT))
        self.MEM, self.SF, self.cache, self.mark = MEM, SF, t / "members_export.json", t / "r2img" / "profiles-export.json"
        self.cache.write_text(json.dumps({"people": [{"handle": "max-m", "name": "Max", "items": []}], "orgs": []}), "utf-8")
    def tearDown(self): self.tmp.cleanup()

    def fetch(self, export, state):
        from unittest import mock
        url = "https://api.example.test/api/profiles/export"
        with mock.patch.object(self.MEM, "CACHE", self.cache), mock.patch.object(self.MEM, "MARK", self.mark), mock.patch.object(self.MEM, "_fetch_export", return_value=export), \
                mock.patch.object(self.SF, "states", return_value={url: state}), mock.patch("time.sleep"), contextlib.redirect_stderr(io.StringIO()):
            people, _ = self.MEM.fetch_members("https://api.example.test")
        return [p["handle"] for p in people], json.loads(self.mark.read_text("utf-8"))

    def test_frisch_leer(self):
        self.assertEqual(self.fetch({"people": [], "orgs": []}, "frisch"), ([], {"state": "frisch", "people": 0}))
        self.assertEqual(json.loads(self.cache.read_text("utf-8"))["people"], [], "die gespeicherte Fassung folgt dem Export")

    def test_leer_mit_fehlern_oder_aus_zwischenspeicher_gilt_als_ausfall(self):
        self.assertEqual(self.fetch({"people": [], "orgs": [], "failed": 3}, "frisch"), (["max-m"], {"state": "cache", "people": 1}))
        self.assertEqual(self.fetch({"people": [], "orgs": []}, "cache"), (["max-m"], {"state": "cache", "people": 1}))
        self.assertEqual(self.fetch(None, "fehlt"), (["max-m"], {"state": "cache", "people": 1}))

    def test_frisch_mit_profilen(self):
        self.assertEqual(self.fetch({"people": [{"handle": "anna-b", "name": "Anna", "items": []}], "orgs": []}, "frisch"), (["anna-b"], {"state": "frisch", "people": 1}))


class GenerateOgTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); t = self.t = Path(self.tmp.name)
        self.docs = t / "docs"; (self.docs / "assets").mkdir(parents=True)
        (self.docs / "assets" / "og-default.png").write_bytes(b"DEFAULT")
        self.items = [{"path": "og/entity/teams.png", "title": "Teams", "lang": "en", "seed": "x", "cover": None},
                      {"path": "og/entity/viva.png", "title": "Viva", "lang": "en", "seed": "y", "cover": None}]
        (self.docs / "og-manifest.json").write_text(json.dumps(self.items))
        sys.modules.pop("generate_og", None); sys.path.insert(0, str(ROOT))
        try: self.G = importlib.import_module("generate_og")
        finally: sys.path.remove(str(ROOT))
        self.G.DOCS, self.G.OUT, self.G.__file__ = self.docs, t / "r2img", str(t / "generate_og.py")   # Cache (.ogcache) im Testordner
    def tearDown(self): self.tmp.cleanup()

    def test_bilder_landen_in_r2img_nicht_in_docs(self):
        cache = self.t / ".ogcache"; cache.mkdir()
        for it in self.items:
            key = hashlib.sha1(json.dumps([it, self.G.CARD_VERSION], sort_keys=True, ensure_ascii=False).encode()).hexdigest()
            (cache / (key + ".png")).write_bytes(b"CACHED")   # Treffer im Cache: kein Browser noetig
        self.G.main()
        self.assertEqual((self.t / "r2img" / "og/entity/teams.png").read_bytes(), b"CACHED")
        self.assertFalse((self.docs / "og").exists())

    def test_fallback_only_ohne_browser(self):
        self.G.main(fallback_only=True)
        for it in self.items: self.assertEqual((self.t / "r2img" / it["path"]).read_bytes(), b"DEFAULT")


if __name__ == "__main__":
    unittest.main()
