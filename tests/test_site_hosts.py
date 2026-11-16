"""Eigene Subdomains admin.m365.fm und profile.m365.fm (site_hosts.py, sitewrk/index.js): Adressen nur mit gueltigem https-Ursprung, leer = wie bisher;
Seitenbau, Arbeitsablauf, Worker-Einstellungen und Umleitungsschalter passen zusammen."""
import os
import re
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_hosts as H   # noqa: E402

BASE = "https://www.m365.fm"
BAD = ["", "http://admin.m365.fm", "https://admin.m365.fm/x", "https://u:p@admin.m365.fm", "https://admin.m365.fm:8443", "admin.m365.fm", "https://admin.m365.fm/?a=1", "https://admin.m365.fm/#x", "javascript:alert(1)", "https://"]


class Helfer(unittest.TestCase):
    def test_ohne_variable_bleibt_alles_wie_bisher(self):
        with patch.dict(os.environ, {}, clear=False):
            os.environ.pop("ADMIN_BASE", None); os.environ.pop("PROFILE_BASE", None)
            self.assertEqual(H.admin_url(BASE), f"{BASE}/admin/")
            self.assertIsNone(H.profile_url(BASE, "de")); self.assertIsNone(H.profile_url(BASE, "en"))

    def test_mit_variable(self):
        with patch.dict(os.environ, {"ADMIN_BASE": "https://admin.m365.fm/", "PROFILE_BASE": "https://profile.m365.fm"}):
            self.assertEqual(H.admin_url(BASE), "https://admin.m365.fm/")
            self.assertEqual(H.profile_url(BASE, "en"), "https://profile.m365.fm/")
            self.assertEqual(H.profile_url(BASE, "de"), "https://profile.m365.fm/de/")
            self.assertEqual(H.profile_url(BASE, "ko"), "https://profile.m365.fm/ko/")

    def test_ungueltige_werte_werden_ignoriert(self):
        for v in BAD:
            with patch.dict(os.environ, {"ADMIN_BASE": v, "PROFILE_BASE": v.replace("admin", "profile")}):
                self.assertEqual(H.admin_url(BASE), f"{BASE}/admin/", v)
                self.assertIsNone(H.profile_url(BASE, "de"), v)


class Verdrahtung(unittest.TestCase):
    def test_seitenbau_nutzt_die_helfer(self):
        src = (ROOT / "generate_site.py").read_text("utf-8")
        for s in ("import site_hosts as HOSTS", "HOSTS.admin_url(BASE)", 'HOSTS.profile_url(BASE, lang) or f"{BASE}/{lang}/community/"', 'HOSTS.profile_url(BASE, L) or f"{pre}/community/"'):
            self.assertIn(s, src)

    def test_arbeitsablauf_reicht_die_variablen_durch(self):
        y = (ROOT / ".github" / "workflows" / "site.yml").read_text("utf-8")
        self.assertIn("ADMIN_BASE: ${{ vars.ADMIN_BASE }}", y); self.assertIn("PROFILE_BASE: ${{ vars.PROFILE_BASE }}", y)

    def test_site_worker_einstellungen(self):
        t = (ROOT / "sitewrk" / "wrangler.toml").read_text("utf-8")
        for h in ("admin", "profile"):
            self.assertRegex(t, rf'pattern = "{h}\.m365\.fm", custom_domain = true, zone_name = "m365\.fm"')
            self.assertIn(f'{h.upper()}_HOST = "{h}.m365.fm"', t)
            # Umzug in zwei Schritten: erst Subdomain pruefen, dann Umleitung einschalten (nicht im selben Deploy)
            self.assertIn(f'{h.upper()}_REDIRECT = "0"', t)

    def test_api_worker_erlaubt_beide_ursprunge(self):
        t = (ROOT / "worker" / "wrangler.toml").read_text("utf-8")
        self.assertIn('ADMIN_SITE = "https://admin.m365.fm"', t); self.assertIn('PROFILE_SITE = "https://profile.m365.fm"', t)
        u = (ROOT / "worker" / "src" / "util.js").read_text("utf-8")
        self.assertRegex(u, r"export const isOwnSite = .*adminOrigin\(env\).*profileOrigin\(env\)")
        ck = re.search(r"export function cookie\(.*?\n}", u, re.S).group(0)
        self.assertNotIn("Domain=", ck)   # Sitzungs-Cookie bleibt host-only auf api-dub.m365.fm
        self.assertIn("HttpOnly", ck); self.assertIn("SameSite=Lax", ck)

    def test_robots_und_noindex_auf_den_subdomains(self):
        w = (ROOT / "sitewrk" / "index.js").read_text("utf-8")
        self.assertIn('PARTNER_NOINDEX = { "x-robots-tag": "noindex, nofollow" }', w)
        self.assertIn("Disallow: /", w)
        self.assertIn("adminToWww, wwwToAdmin", w); self.assertIn("profileToWww, wwwToProfile", w)
        g = (ROOT / "generate_site.py").read_text("utf-8")
        i = g.index('write("admin/index.html"'); self.assertIn("noindex=True", g[i:i + 1200])


if __name__ == "__main__":
    unittest.main()
