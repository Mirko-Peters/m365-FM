"""Staging-Werkzeuge: Adressen umschreiben (staging_rewrite), eigener Bucket (staging_upload), Trennung von Live (check_staging_isolation).
Lauf: python3 -m unittest tests.test_staging_tools"""
import hashlib
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import check_staging_isolation as ISO  # noqa: E402
import staging_rewrite as RW  # noqa: E402
import staging_upload as UP  # noqa: E402


class Rewrite(unittest.TestCase):
    def test_adressen(self):
        t = ('<a href="https://www.m365.fm/de/">x</a> <script>window.M365X={api:"https://api-dub.m365.fm",base:"https://www.m365.fm"}</script> '
             '<img src="https://img.m365.fm/i/a.png"> mail mirko@m365.fm https://dub.m365.fm/x https://m365.fm/y https://www.m365.fm.evil.example/ '
             '{"u":"https:\\/\\/www.m365.fm\\/a","api":"https:\\/\\/api-dub.m365.fm"} https://staging.m365.fm/ok')
        new, n = RW.rewrite_text(t)
        self.assertEqual(n, 7)
        self.assertIn('api:"https://api-staging.m365.fm"', new)
        self.assertIn('base:"https://staging.m365.fm"', new)
        self.assertIn("https://img.m365.fm/i/a.png", new, "Bilder bleiben im Bucket")
        self.assertIn("mirko@m365.fm", new)
        self.assertIn("https://www.m365.fm.evil.example/", new)
        self.assertIn('"https:\\/\\/staging.m365.fm\\/a"', new)
        self.assertIn('"https:\\/\\/api-staging.m365.fm"', new)
        self.assertNotIn("api-dub", new)

    def test_baum(self):
        with tempfile.TemporaryDirectory() as t:
            d = Path(t)
            (d / "a").mkdir()
            (d / "a" / "index.html").write_text('<link rel="canonical" href="https://www.m365.fm/a/">', "utf-8")
            (d / "x.json").write_text('{"api":"https://api-dub.m365.fm"}', "utf-8")
            (d / "CNAME").write_text("www.m365.fm", "utf-8")
            (d / "pic.png").write_bytes(b"\x89PNG https://www.m365.fm")
            c, n = RW.rewrite_tree(d)
            self.assertEqual((c, n), (2, 2))
            self.assertFalse((d / "CNAME").exists())
            self.assertIn(b"https://www.m365.fm", (d / "pic.png").read_bytes(), "Binaerdateien bleiben")
            self.assertEqual(RW.leftovers(d), [])
            (d / "b.html").write_text("https://dub.m365.fm.", "utf-8")   # Satzende-Punkt zaehlt nicht als Subdomain
            RW.rewrite_tree(d)
            self.assertEqual(RW.leftovers(d), [])


class FakeS3:
    def __init__(self, objects=None, page=2):
        self.objects, self.puts, self.deleted, self.page = dict(objects or {}), [], [], page

    def list_objects_v2(self, Bucket, Prefix, MaxKeys, ContinuationToken=None):
        assert Bucket == UP.STAGING_BUCKET
        keys = sorted(k for k in self.objects if k.startswith(Prefix))
        start = int(ContinuationToken or 0)
        chunk = keys[start:start + self.page]
        r = {"Contents": [{"Key": k, "ETag": '"' + self.objects[k] + '"'} for k in chunk]}
        if start + self.page < len(keys):
            r.update(IsTruncated=True, NextContinuationToken=str(start + self.page))
        return r

    def put_object(self, Bucket, Key, Body, **kw):
        assert Bucket == UP.STAGING_BUCKET, "nur der Staging-Bucket"
        self.puts.append(Key)
        self.objects[Key] = hashlib.md5(Body).hexdigest()

    def delete_objects(self, Bucket, Delete):
        assert Bucket == UP.STAGING_BUCKET
        for o in Delete["Objects"]:
            self.deleted.append(o["Key"])
            self.objects.pop(o["Key"], None)


class Upload(unittest.TestCase):
    def setUp(self):
        self.t = tempfile.TemporaryDirectory()
        self.docs, self.r2 = Path(self.t.name, "docs"), Path(self.t.name, "r2out")
        for i in range(25):
            (self.docs / f"p{i}").mkdir(parents=True)
            (self.docs / f"p{i}" / "index.html").write_text(f"<html>{i}</html>", "utf-8")
        (self.r2 / "de" / "x").mkdir(parents=True)
        (self.r2 / "de" / "x" / "index.html").write_text("<html>de</html>", "utf-8")

    def tearDown(self):
        self.t.cleanup()

    def test_schluessel_und_vorrang(self):
        (self.r2 / "p1").mkdir()
        (self.r2 / "p1" / "index.html").write_text("<html>aus r2out</html>", "utf-8")
        files = UP.local_files([self.docs, self.r2])
        self.assertIn("pages/p3/index.html", files)
        self.assertIn("pages/de/x/index.html", files)
        self.assertEqual(files["pages/p1/index.html"].read_text("utf-8"), "<html>aus r2out</html>")

    def test_sync_laedt_nur_neues_und_loescht_veraltetes(self):
        files = UP.local_files([self.docs, self.r2])
        s3 = FakeS3({"pages/p0/index.html": hashlib.md5(b"<html>0</html>").hexdigest(), "pages/alt/index.html": "abc"})
        n, d = UP.sync(s3, UP.STAGING_BUCKET, files, log=lambda *_: None)
        self.assertEqual(n, len(files) - 1, "p0 ist unveraendert")
        self.assertNotIn("pages/p0/index.html", s3.puts)
        self.assertEqual(d, 1)
        self.assertEqual(s3.deleted, ["pages/alt/index.html"])
        n2, d2 = UP.sync(s3, UP.STAGING_BUCKET, files, log=lambda *_: None)
        self.assertEqual((n2, d2), (0, 0), "zweiter Lauf: nichts zu tun")

    def test_nie_ein_anderer_bucket(self):
        files = UP.local_files([self.docs])
        with self.assertRaises(SystemExit):
            UP.sync(FakeS3(), UP.LIVE_BUCKET, files, log=lambda *_: None)
        with self.assertRaises(SystemExit):
            UP.check_bucket({"R2_BUCKET": "m365-fm"})
        self.assertEqual(UP.check_bucket({"R2_BUCKET": "m365-fm-staging"}), "m365-fm-staging")
        self.assertEqual(UP.check_bucket({}), "m365-fm-staging")

    def test_leerer_bau_raeumt_nicht_leer(self):
        s3 = FakeS3({"pages/index.html": "x"})
        with self.assertRaises(SystemExit):
            UP.sync(s3, UP.STAGING_BUCKET, {}, log=lambda *_: None)
        self.assertEqual(s3.deleted, [])

    def test_zugang_nur_staging_namen(self):
        live_only = {"R2_ACCOUNT_ID": "a", "R2_ACCESS_KEY_ID": "live", "R2_SECRET_ACCESS_KEY": "live"}
        with self.assertRaises(SystemExit) as e:
            UP.client(live_only)
        self.assertIn("STAGING_R2_ACCESS_KEY_ID", str(e.exception))
        self.assertNotIn("live", str(e.exception).replace("STAGING", ""), "keine Werte in der Meldung")


class Isolation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.worker = (ROOT / "worker" / "wrangler.toml").read_text("utf-8")
        cls.site = (ROOT / "sitewrk" / "wrangler.toml").read_text("utf-8")
        cls.wf = {n: (ROOT / ".github" / "workflows" / n).read_text("utf-8") for n in ISO.WORKFLOWS if (ROOT / ".github" / "workflows" / n).exists()}

    def test_echte_dateien_sind_sauber(self):
        self.assertEqual(ISO.run(), [])

    def last(self, text, a, b):
        i = text.rindex(a)
        return text[:i] + b + text[i + len(a):]

    def test_worker_toml_verstoesse(self):
        w = self.worker
        cases = {
            "Live-Name": self.last(w, 'name = "m365-dub-community-staging"', 'name = "m365-dub-community"'),
            "Live-Route": self.last(w, 'pattern = "api-staging.m365.fm"', 'pattern = "api-dub.m365.fm"'),
            "Live-D1": self.last(w, 'database_name = "m365-dub-staging"', 'database_name = "m365-dub"'),
            "Live-Bucket": w + '\n[[env.staging.r2_buckets]]\nbinding = "PAGES"\nbucket_name = "m365-fm"\n',
            "KI": w + '\n[env.staging.ai]\nbinding = "AI"\n',
            "Vectorize": w + '\n[[env.staging.vectorize]]\nbinding = "VEC"\nindex_name = "m365-search"\n',
            "Mail": w + '\n[[env.staging.send_email]]\nname = "EMAIL"\n',
            "Cron": w + '\n[env.staging.triggers]\ncrons = ["0 6 * * *"]\n',
            "PayPal live": self.last(w, 'PAYPAL_ENV = "sandbox"', 'PAYPAL_ENV = "live"'),
            "Buchung an": self.last(w, 'ADS_BOOKING = "0"', 'ADS_BOOKING = "1"'),
            "Live-SITE": self.last(w, 'SITE = "https://staging.m365.fm"', 'SITE = "https://www.m365.fm"'),
            "ohne ENVIRONMENT": self.last(w, 'ENVIRONMENT = "staging"', 'FOO = "bar"'),
            "Live-Host in Variable": self.last(w, 'USD_PER_EUR = "1.08"', 'USD_PER_EUR = "1.08"\nBACKUP = "https://api-dub.m365.fm/x"'),
            "AI_GATEWAY_ID": self.last(w, 'USD_PER_EUR = "1.08"', 'USD_PER_EUR = "1.08"\nAI_GATEWAY_ID = "m365fm"'),
        }
        for name, text in cases.items():
            self.assertTrue(ISO.check_worker_toml(text), name)

    def test_vererbte_felder_muessen_ausdruecklich_stehen(self):
        w = self.worker
        no_routes = w.replace('routes = [{ pattern = "api-staging.m365.fm", custom_domain = true, zone_name = "m365.fm" }]\n', "")
        self.assertTrue(any("routes" in e for e in ISO.check_worker_toml(no_routes)))
        no_dev = self.last(w, "workers_dev = false", "")
        self.assertTrue(any("workers_dev" in e for e in ISO.check_worker_toml(no_dev)))
        no_env = w[:w.index("\n# ================================================================ Testumgebung")]
        self.assertTrue(any("env.staging" in e for e in ISO.check_worker_toml(no_env)))

    def test_site_toml_verstoesse(self):
        s = self.site
        cases = {
            "Live-Bucket": self.last(s, 'bucket_name = "m365-fm-staging"', 'bucket_name = "m365-fm"'),
            "Live-Route": self.last(s, 'pattern = "staging.m365.fm"', 'pattern = "www.m365.fm/*"'),
            "Migrated": self.last(s, 'MIGRATED = "0"', 'MIGRATED = "1"'),
            "R2 primaer": self.last(s, 'R2_PRIMARY = "0"', 'R2_PRIMARY = "1"'),
            "Origin live": self.last(s, 'ORIGIN = "https://staging.m365.fm"', 'ORIGIN = "https://www.m365.fm"'),
            "Name": self.last(s, 'name = "m365-dub-site-staging"', 'name = "m365-dub-site"'),
        }
        for name, text in cases.items():
            self.assertTrue(ISO.check_site_toml(text), name)

    def test_workflows_verstoesse(self):
        for fname, text in self.wf.items():
            bad = {
                "wrangler ohne env": text + "\n      - run: npx wrangler deploy\n",
                "setup.mjs": text + "\n      - run: node setup.mjs\n",
                "Live-Secret": text + "\n      - run: echo ${{ secrets.RESEND_API_KEY }}\n",
                "Live-R2-Secret": text + "\n      - run: echo ${{ secrets.R2_ACCESS_KEY_ID }}\n",
                "Live-D1": text + "\n      - run: npx wrangler d1 execute m365-dub --env staging --command 'select 1'\n",
                "Live-Bucket": text + "\n      - run: npx wrangler r2 bucket create m365-fm\n",
                "Live-API schreibend": text + "\n      - run: curl -X POST https://api-dub.m365.fm/api/x\n",
                "main": text.replace("branches: [staging]", "branches: [staging, main]", 1),
                "pull_request": text.replace("on:\n", "on:\n  pull_request:\n    branches: [main]\n", 1),
                "ohne Umgebung": text.replace("environment: staging", "# environment weg"),
            }
            for name, t in bad.items():
                if t == text:
                    continue
                self.assertTrue(ISO.check_workflow(t, fname), f"{fname}: {name}")

    def test_live_api_nur_lesend_fuer_den_bau_erlaubt(self):
        base = self.wf.get("site-staging.yml", "")
        self.assertEqual([e for e in ISO.check_workflow(base, "site-staging.yml") if "api-dub" in e], [])
        self.assertTrue(any("api-dub" in e for e in ISO.check_workflow(base + "\n      - run: curl https://api-dub.m365.fm/api/health\n", "x")))
        self.assertFalse([e for e in ISO.check_workflow(base.replace("COMMUNITY_API:", "EXPORT_API:"), "x") if "api-dub" in e])


if __name__ == "__main__":
    unittest.main()
