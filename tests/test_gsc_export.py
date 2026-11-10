"""Woechentlicher Search-Console-Export (#156, tools/gsc_export.py): JWT RS256 fuer das Dienstkonto, Abruf mit nachgebauter API (kein Netz),
Auswertung der Zeilen, gruenes Ende ohne Datei bei fehlendem Secret und bei 403, das Secret erscheint nie in der Ausgabe. Dazu der Datenschutzsatz."""
import base64
import contextlib
import io
import json
import shutil
import sys
import tempfile
import unittest
import unittest.mock
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(ROOT))

import gsc_export as G
import update_ai_stats as U
import site_legal as SL

try:
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import padding, rsa
    KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    PEM = KEY.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()).decode()
except ImportError:
    KEY = None
    PEM = "-----BEGIN PRIVATE KEY-----\nMIIfake\n-----END PRIVATE KEY-----\n"

SA = {"type": "service_account", "client_email": "gsc-export@projekt-123.iam.gserviceaccount.com", "private_key_id": "kid123456", "private_key": PEM,
      "token_uri": "https://oauth2.googleapis.com/token", "client_id": "1234567890"}
ENV = {"GSC_SERVICE_ACCOUNT_JSON": json.dumps(SA), "GSC_SITE": "sc-domain:m365.fm"}
TODAY = date(2026, 11, 10)


def b64d(s): return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))


class FakeApi:
    """Token-Tausch und searchAnalytics/query wie bei Google; status = Fehler fuer die Abfrage."""

    def __init__(self, rows, status=0, msg="", token_status=0):
        self.rows, self.status, self.msg, self.token_status, self.calls = rows, status, msg, token_status, []

    def __call__(self, url, body=None, form=None, headers=None, timeout=60):
        self.calls.append({"url": url, "body": body, "form": form, "headers": headers})
        if form is not None:
            if self.token_status: raise U.ApiError(self.token_status, "invalid_grant")
            return {"access_token": "ya29.token", "expires_in": 3600}
        if self.status: raise U.ApiError(self.status, self.msg)
        start, n = body["startRow"], body["rowLimit"]
        return {"rows": self.rows[start:start + n]}


def row(q, page, country, clicks, impr, ctr=0.1, pos=3.456):
    return {"keys": [q, page, country], "clicks": clicks, "impressions": impr, "ctr": ctr, "position": pos}


ROWS = [row("copilot studio", "https://www.m365.fm/de/entity/copilot-studio/", "deu", 12, 300, 0.04, 4.27), row("teams phone", "https://www.m365.fm/show/episodes/teams-phone/", "usa", 3, 100, 0.03, 8.91),
        {"keys": ["kaputt"], "clicks": 1}]


def run(env, api, *argv, out=None):
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        code = G.main(list(argv) + (["--out-dir", str(out)] if out else []), env=env, today=TODAY, now=1_790_000_000, http=api)
    return code, buf.getvalue()


class GscExport(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp, True)

    @unittest.skipIf(KEY is None, "cryptography fehlt")
    def test_jwt_rs256_claims_and_signature(self):
        api = FakeApi(ROWS)
        code, out = run(ENV, api, out=self.tmp)
        self.assertEqual(code, 0)
        form = api.calls[0]["form"]; self.assertEqual(api.calls[0]["url"], "https://oauth2.googleapis.com/token")
        self.assertEqual(form["grant_type"], "urn:ietf:params:oauth:grant-type:jwt-bearer")
        head, claims, sig = form["assertion"].split(".")
        self.assertEqual(json.loads(b64d(head)), {"alg": "RS256", "typ": "JWT", "kid": "kid123456"})
        self.assertEqual(json.loads(b64d(claims)), {"iss": SA["client_email"], "scope": "https://www.googleapis.com/auth/webmasters.readonly", "aud": "https://oauth2.googleapis.com/token",
                                                    "iat": 1_790_000_000, "exp": 1_790_003_600})
        KEY.public_key().verify(b64d(sig), f"{head}.{claims}".encode(), padding.PKCS1v15(), hashes.SHA256())   # wirft bei falscher Signatur
        self.assertEqual(api.calls[1]["headers"], {"Authorization": "Bearer ya29.token"})

    @unittest.skipIf(KEY is None, "cryptography fehlt")
    def test_export_writes_rows_per_query_page_country(self):
        api = FakeApi(ROWS)
        code, out = run(ENV, api, out=self.tmp)
        self.assertEqual(code, 0)
        q = api.calls[1]
        self.assertEqual(q["url"], "https://searchconsole.googleapis.com/webmasters/v3/sites/sc-domain%3Am365.fm/searchAnalytics/query")
        self.assertEqual(q["body"], {"startDate": "2026-11-01", "endDate": "2026-11-07", "type": "web", "dimensions": ["query", "page", "country"], "rowLimit": 25000, "startRow": 0})
        f = self.tmp / "2026-11-07.json"; doc = json.loads(f.read_text("utf-8"))
        self.assertEqual(doc["period"], {"from": "2026-11-01", "to": "2026-11-07"}); self.assertEqual(doc["property"], "sc-domain:m365.fm")
        self.assertEqual(doc["rows"], [{"query": "copilot studio", "page": "https://www.m365.fm/de/entity/copilot-studio/", "country": "deu", "clicks": 12, "impressions": 300, "ctr": 0.04, "position": 4.3},
                                       {"query": "teams phone", "page": "https://www.m365.fm/show/episodes/teams-phone/", "country": "usa", "clicks": 3, "impressions": 100, "ctr": 0.03, "position": 8.9}])
        self.assertEqual(doc["totals"], {"clicks": 15, "impressions": 400, "ctr": 0.0375, "position": 5.5})   # nach Impressionen gewichtet
        self.assertFalse(doc["truncated"]); self.assertIn("::notice::Search Console 2026-11-01 bis 2026-11-07: 2 Zeilen", out)
        for secret in (SA["client_email"], SA["private_key_id"], "PRIVATE KEY", SA["client_id"]): self.assertNotIn(secret, out)

    @unittest.skipIf(KEY is None, "cryptography fehlt")
    def test_paging_and_row_cap(self):
        many = [row(f"q{i}", "https://www.m365.fm/", "deu", 1, 2) for i in range(7)]
        status, doc, _ = G.export({**ENV, "GSC_ROWS": "5"}, TODAY, now=1, http=FakeApi(many))
        self.assertEqual(status, "ok"); self.assertEqual(len(doc["rows"]), 5); self.assertTrue(doc["truncated"])
        with unittest.mock.patch.object(G, "PAGE_ROWS", 3):
            api = FakeApi(many); status, doc, _ = G.export(ENV, TODAY, now=1, http=api)
        self.assertEqual([c["body"]["startRow"] for c in api.calls[1:]], [0, 3, 6]); self.assertEqual(len(doc["rows"]), 7); self.assertFalse(doc["truncated"])

    def test_missing_secret_is_green_with_notice_and_writes_nothing(self):
        api = FakeApi(ROWS)
        code, out = run({"GSC_SITE": ""}, api, out=self.tmp)
        self.assertEqual(code, 0); self.assertEqual(api.calls, []); self.assertEqual(list(self.tmp.glob("*")), [])
        self.assertIn("::notice::Search Console: Secret GSC_SERVICE_ACCOUNT_JSON fehlt", out); self.assertIn("sc-domain:m365.fm", out)

    @unittest.skipIf(KEY is None, "cryptography fehlt")
    def test_403_is_green_with_setup_hint_and_never_prints_the_secret(self):
        api = FakeApi(ROWS, status=403, msg=f"PERMISSION_DENIED User does not have sufficient permission for site. {SA['client_email']}")
        code, out = run(ENV, api, out=self.tmp)
        self.assertEqual(code, 0); self.assertEqual(list(self.tmp.glob("*")), [])
        self.assertIn("::notice::", out); self.assertIn("Nutzer (eingeschraenkt)", out)
        self.assertNotIn(SA["client_email"], out); self.assertNotIn("BEGIN", out)

    @unittest.skipIf(KEY is None, "cryptography fehlt")
    def test_other_errors_fail_without_writing(self):
        code, out = run(ENV, FakeApi(ROWS, status=500, msg="backendError"), out=self.tmp)
        self.assertEqual(code, 1); self.assertIn("::error::Search Console Search Analytics", out); self.assertEqual(list(self.tmp.glob("*")), [])
        code, out = run({**ENV, "GSC_SERVICE_ACCOUNT_JSON": "{kein json"}, FakeApi(ROWS), out=self.tmp)
        self.assertEqual(code, 1); self.assertNotIn("kein json", out)

    def test_workflow_guards_secret_and_never_commits_search_data(self):
        wf = (ROOT / ".github" / "workflows" / "gsc-export.yml").read_text("utf-8")
        self.assertIn("GSC_SERVICE_ACCOUNT_JSON: ${{ secrets.GSC_SERVICE_ACCOUNT_JSON }}", wf)
        self.assertNotRegex(wf, r"echo[^\n]*GSC_SERVICE_ACCOUNT_JSON", "Secret wird nie ausgegeben")
        self.assertIn("pip install -q requests cryptography", wf); self.assertIn("schedule:", wf)
        # oeffentliches Repo: Suchanfragen nie committen, nur verschluesselt als Artefakt (wie team-analytics.yml)
        for bad in ("git add", "git commit", "git push", "contents: write"): self.assertNotIn(bad, wf)
        self.assertIn("openssl enc -aes-256-cbc -pbkdf2 -iter 600000", wf); self.assertIn("--out-dir gscout", wf); self.assertIn("rm -rf gscout", wf)
        self.assertRegex(wf, r"path: enc/gsc-export\.tar\.gz\.enc")

    def test_privacy_policy_mentions_anonymous_search_counting(self):
        de, en = SL.privacy_de(), SL.privacy_en()
        for words in ("Suche auf der Website", "anonym als Tagessumme", "ohne IP-Adresse, ohne Konto", "12 Monate", "fehlende Inhalte und Übersetzungen"): self.assertIn(words, de)
        for words in ("Site search", "anonymously as daily totals", "without IP address, without account", "12 months", "missing content and translations"): self.assertIn(words, en)


if __name__ == "__main__":
    unittest.main()
