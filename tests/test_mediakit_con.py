"""M365Con-Sponsordeck (tools/mediakit_con.py, Issue #260): Datenquellen mit Attrappen, Regeln "nur Summen, nichts schaetzen",
LinkedIn-Handeintrag, Kennzahlen, oeffentliche Zusammenfassung und PDF-Bau. Lauf: python3 -m unittest discover -s tests -p 'test_mediakit*.py'"""
import json
import sys
import tempfile
import unittest
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tools"))
import mediakit as MK  # noqa: E402
import mediakit_con as C  # noqa: E402


class FakeHS:
    """Antworten wie das HeySummit-MCP (Form aus get_event, get_event_briefing, list_sponsors)."""
    def __init__(self):
        self.calls = []

    def call(self, name, args):
        self.calls.append(name)
        eid = args["event_id"]
        if name == "get_event":
            return {"event": {"id": eid, "title": f"Event {eid}", "event_url": f"https://e{eid}.m365con.net", "first_talk_at": "2027-01-11T07:00:00",
                              "last_talk_at": "2027-01-22T19:00:00", "tags": ["Copilot Studio", "Entra"], "categories": [{"title": "Keynote Session"}],
                              "logo": "https://cdn.example/logo.png", "logo_white": ""}}
        if name == "get_event_briefing":
            if eid == 150009: return None   # ein Event ohne Briefing: Zahlen fehlen, nichts geschaetzt
            return {"briefing": {"as_of": "2026-11-05T08:54:14", "counts": {"talks": 95, "speakers": 100, "attendees": 1729, "sponsors": 13, "categories": 3}}}
        if name == "list_sponsors":
            return {"sponsors": [
                {"title": "Power Bros", "url": "https://www.powerbros.cloud", "logo": "https://cdn.example/pb.png", "is_active": True, "show_on_landing_page": True, "phone_number": "+49 000"},
                {"title": "m365.fm | Podcast", "url": "https://www.m365.fm", "logo": "x", "is_active": True, "show_on_landing_page": True},
                {"title": "Hidden Partner", "url": "https://hidden.example", "logo": "x", "is_active": True, "show_on_landing_page": False},
                {"title": "power bros", "url": "https://www.powerbros.cloud", "logo": "", "is_active": True, "show_on_landing_page": True}]}
        return None


class FakeYT:
    """YouTube Data + Analytics API: 1 Livestream, 1 Recap, 1 fremdes Video."""
    def __call__(self, url):
        u = urllib.parse.urlparse(url); q = dict(urllib.parse.parse_qsl(u.query))
        if "channels" in u.path: return 200, {"items": [{"contentDetails": {"relatedPlaylists": {"uploads": "UU1"}}}]}
        if "playlistItems" in u.path:
            return 200, {"items": [{"snippet": {"title": "M365 Con 27 – Day 1 live", "description": ""}, "contentDetails": {"videoId": "v1"}},
                                   {"snippet": {"title": "Recap", "description": "More at m365con.net"}, "contentDetails": {"videoId": "v2"}},
                                   {"snippet": {"title": "Teams tips", "description": ""}, "contentDetails": {"videoId": "v3"}}]}
        if "playlists" in u.path: return 200, {"items": []}
        if "videos" in u.path:
            return 200, {"items": [{"id": "v1", "snippet": {"title": "M365 Con 27 – Day 1 live", "publishedAt": "2026-01-12T08:00:00Z"}, "liveStreamingDetails": {"actualStartTime": "x"}},
                                   {"id": "v2", "snippet": {"title": "Recap", "publishedAt": "2026-02-01T08:00:00Z"}}]}
        m, f, dim = q.get("metrics", ""), q.get("filters", ""), q.get("dimensions", "")
        assert "v3" not in f, "fremdes Video darf nicht mitzaehlen"
        live = f == "video==v1"
        if m == "averageConcurrentViewers,peakConcurrentViewers": return 200, {"rows": [[41.6, 120]]}
        if dim == "country": return 200, {"rows": [["DE", 300], ["US", 100]]}
        if dim == "video": return 200, {"rows": [["v1" if live else "v2", 500 if live else 200, 3000 if live else 600]]}
        if dim == "liveOrOnDemand": return 200, {"rows": [["LIVE", 350], ["ON_DEMAND", 150]]}
        return 200, {"rows": [[500 if live else 200, 3000 if live else 600]]}


class FakeTA:
    def __init__(self, ok_sites):
        self.ok, self.seen = ok_sites, []

    def gsc(self, site=None):
        self.seen.append(site)
        if site not in self.ok: return {"status": "Abruf fehlgeschlagen (HTTP 403: User does not have sufficient permission)"}
        return {"status": "ok", "site": site, "period": {"from": "2026-10-06", "to": "2026-11-02"}, "totals": {"clicks": 40, "impressions": 2000, "ctr": 2.0},
                "daily": [["2026-10-27", 5, 300], ["2026-10-28", 3, 200], ["2026-11-02", 1, 100]], "queries": [{"query": "m365con", "clicks": 30, "impressions": 900}]}


class Sources(unittest.TestCase):
    def test_heysummit_only_aggregates_and_public_partners(self):
        hs = C.heysummit(FakeHS())
        self.assertEqual([e["id"] for e in hs["events"]], list(C.EVENTS))
        e = hs["events"][0]
        self.assertEqual((e["talks"], e["speakers"], e["registrations"], e["sponsors"]), (95, 100, 1729, 13))
        self.assertNotIn("registrations", hs["events"][2], "fehlendes Briefing -> keine Zahl")
        self.assertEqual([p["name"] for p in hs["partners"]], ["Power Bros"], "nur oeffentlich, ohne eigene Marken, ohne Dubletten")
        self.assertNotIn("+49", json.dumps(hs), "keine Telefonnummern oder andere Personendaten")

    def test_youtube_splits_streams_and_recaps(self):
        yt = C.youtube_con(get=FakeYT())
        s, r = yt["streams"], yt["recaps"]
        self.assertEqual((s["videos"], s["views"], s["minutes"], s["live_views"], s["ondemand_views"]), (1, 500, 3000, 350, 150))
        self.assertEqual((s["peak_max"], s["avg_concurrent"]), (120, 42))
        self.assertEqual(s["top"][0][:2], ["M365 Con 27 – Day 1 live", 500])
        self.assertEqual((r["videos"], r["views"]), (1, 200))
        self.assertNotIn("peak_max", r)
        self.assertTrue(s["period"].startswith("2026-01-12–"))

    def test_youtube_nothing_found_is_empty(self):
        def get(url):
            if "channels" in url: return 200, {"items": [{"contentDetails": {"relatedPlaylists": {"uploads": "UU1"}}}]}
            if "playlistItems" in url: return 200, {"items": [{"snippet": {"title": "Teams", "description": ""}, "contentDetails": {"videoId": "v3"}}]}
            return 200, {"items": []}
        self.assertEqual(C.youtube_con(get=get), {})

    def test_gsc_tries_domain_then_prefix_and_omits_without_access(self):
        ta = FakeTA({"https://m365con.net/"})
        g = C.gsc_con(ta=ta)
        self.assertEqual(ta.seen, list(C.GSC_SITES))
        self.assertEqual((g["site"], g["clicks"], g["impressions"]), ("https://m365con.net/", 40, 2000))
        self.assertEqual(g["queries"], [["m365con", 30, 900]])
        self.assertEqual(sum(w[2] for w in g["weekly"]), 600)
        self.assertEqual(C.gsc_con(ta=FakeTA(set())), {}, "403 -> Abschnitt entfaellt")

    def test_gsc_site_without_site_parameter_uses_env(self):   # Stand vor #262: gsc() liest GSC_SITE
        class Old:
            def gsc(self):
                import os
                return FakeTA({"sc-domain:m365con.net"}).gsc(os.environ.get("GSC_SITE"))
        self.assertEqual(MK.gsc_site("sc-domain:m365con.net", ta=Old())["site"], "sc-domain:m365con.net")

    def test_linkedin_hand_entry(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "li.json"
            p.write_text(json.dumps({"status": "empty", "streams": [{"title": "x", "date": "2026-01-12", "views": 5}]}), "utf-8")
            self.assertEqual(C.linkedin(p), {}, "status != ok -> entfaellt")
            p.write_text(json.dumps({"status": "ok", "retrieved": "2026-11-01", "page": {"page_followers": 1200, "impressions_30d": 5000, "reactions_30d": None,
                                                                                  "period": {"from": "2026-10-02", "to": "2026-10-31"}},
                                     "streams": [{"title": "Day 1", "date": "2026-01-12", "views": 900, "impressions": 4000, "reactions": True},
                                                 {"title": "", "date": "2026-01-13", "views": 1}, {"title": "Bad", "date": "13.1.", "views": 1},
                                                 {"title": "Day 2", "date": "2026-01-13", "views": -3}]}), "utf-8")
            li = C.linkedin(p)
            self.assertEqual(li["page"], {"page_followers": 1200, "impressions_30d": 5000})
            self.assertEqual(li["page_period"], "2026-10-02–2026-10-31")
            self.assertEqual(li["streams"], [{"title": "Day 1", "date": "2026-01-12", "views": 900, "impressions": 4000}])
            p.write_text(json.dumps({"status": "ok", "page": {"page_followers": 10, "impressions_30d": 50}}), "utf-8")
            self.assertEqual(C.linkedin(p)["page"], {"page_followers": 10}, "30-Tage-Werte nur mit Zeitraum")

    def test_repo_file_is_valid_and_empty(self):
        d = json.loads(C.LINKEDIN_FILE.read_text("utf-8"))
        self.assertIn("_doc", d)
        self.assertEqual(C.linkedin(), {} if d.get("status") != "ok" else C.linkedin())


def sample():
    return {"generated": "2026-11-05", "heysummit": C.heysummit(FakeHS()), "youtube": C.youtube_con(get=FakeYT()), "gsc": C.gsc_con(ta=FakeTA({"sc-domain:m365con.net"})),
            "bing": {"clicks28": 7, "impressions28": 400, "weekly": [["2026-10-27", 3, 200]]}, "linkedin": {}, "press": {"mentions": 1, "latest": "2026-11-02"},
            "yt_search": {}}


class Deck(unittest.TestCase):
    def test_kpis_only_present_values_with_source_and_period(self):
        K = C.kpis(sample())
        keys = [k["key"] for k in K]
        self.assertEqual(keys[:4], ["reg_total", "reg_next", "talks", "speakers"])
        self.assertEqual(next(k for k in K if k["key"] == "reg_total")["value"], 1729 * 2)
        self.assertNotIn("li_views", keys)
        for k in K:
            self.assertIn(k["src"], C.TXT["en"]["s"]); self.assertIn(k["key"], C.TXT["de"]["k"]); self.assertIsInstance(k["value"], int)
        self.assertEqual(C.kpis({"generated": "x"}), [])

    def test_public_summary_has_no_logos_or_personal_data(self):
        S = C.public_summary(sample())
        js = json.dumps(S)
        self.assertEqual(S["brand"], "m365con")
        self.assertNotIn("cdn.example", js); self.assertNotIn("+49", js)
        self.assertTrue(all(set(k["label"]) == {"en", "de"} for k in S["kpis"]))

    def test_no_prices_in_deck_texts(self):
        for t in C.TXT.values():
            self.assertNotRegex(json.dumps(t, ensure_ascii=False), r"\$\s?\d|USD|\d\s?€")

    def test_pdf_builds_with_partial_data(self):
        try:
            import reportlab  # noqa: F401
        except ImportError:
            self.skipTest("reportlab fehlt")
        F = {k: v for k, v in C.FONT_FB.items()}
        with tempfile.TemporaryDirectory() as tmp:
            for D in (sample(), {"generated": "2026-11-05", "press": {"mentions": 1, "latest": "2026-11-02"}}):
                for lang in ("en", "de"):
                    p = Path(tmp) / f"d-{lang}.pdf"
                    C.build_pdf(p, lang, D, F)
                    self.assertGreater(p.stat().st_size, 3000)
                    self.assertTrue(p.read_bytes().startswith(b"%PDF"))

    def test_dates(self):
        self.assertEqual(C.dates("en", "2027-01-11", "2027-01-22"), "Jan 11–22, 2027")
        self.assertEqual(C.dates("de", "2027-01-11", "2027-01-22"), "11.–22. Jan. 2027")
        self.assertEqual(C.dates("de", "2026-09-14", "2026-10-02"), "14. Sept. – 2. Okt. 2026")


class Site(unittest.TestCase):
    def test_con_page_en_de(self):
        import re
        import site_mediakit as SM
        out, sm = {}, []
        g = {"BASE": "https://www.m365.fm", "TODAY": "2026-11-05", "api": "https://api-dub.m365.fm", "LANGS": {"de": ("Deutsch", "de", "ltr")}, "sitemap": sm,
             "header": lambda lang, x: "<header></header>", "footer": lambda lang: "<footer></footer>",
             "page": lambda lang, title, desc, url, body, alts, ld, **kw: f"<title>{title}</title>{body}", "write": lambda p, h: out.__setitem__(p, h)}
        SM.build_con(g)
        self.assertEqual(sorted(out), ["de/m365con/sponsor/index.html", "m365con/sponsor/index.html"])
        en, de = out["m365con/sponsor/index.html"], out["de/m365con/sponsor/index.html"]
        cfg = json.loads(re.search(r"window\.M365MK=(\{.*?\})</script>", en).group(1))
        self.assertEqual((cfg["brand"], cfg["kpis"], cfg["lang"], cfg["source"]), ("m365con", True, "en", "/m365con/sponsor/"))
        self.assertIn('id="mk-form"', en); self.assertIn('id="mk-kpis"', en)
        self.assertIn("Sponsoring on request", en); self.assertIn("Sponsoring auf Anfrage", de)
        self.assertIn(C.THEME["night"], en, "Farben aus dem einen Theme")
        for h in (en, de): self.assertNotRegex(h, r"\$\s?\d|USD", "keine Preise auf der Con-Seite")
        self.assertEqual(len(sm), 2)

    def test_embeds_in_sync_and_self_contained(self):
        import re
        import site_mediakit as SM
        js = (ROOT / "assets" / "mediakit.js").read_text("utf-8")
        for lang in ("en", "de"):
            f = SM.EMBED_DIR / f"sponsor-embed-{lang}.html"
            h = f.read_text("utf-8")
            self.assertEqual(h, SM.embed_html(lang), f"{f.name} veraltet: python3 site_mediakit.py --embed")
            self.assertIn(js, h, "Skript inline, eine Quelle")
            self.assertNotIn("<script src", h); self.assertNotIn("<link", h); self.assertNotIn("<img", h)
            hosts = set(re.findall(r"https://([a-z0-9.-]+)", h))
            self.assertTrue(hosts <= {"www.m365.fm", "api-dub.m365.fm", "m365con.net", "de.m365con.net"}, hosts)
            self.assertIn('"brand": "m365con"', h)
            self.assertNotRegex(re.sub(r"<script>[\s\S]*?</script>", "", h), r"(?m)^\s*(html|body)\s*\{", "Stil nur unter .m365con-mk")


if __name__ == "__main__":
    unittest.main()
