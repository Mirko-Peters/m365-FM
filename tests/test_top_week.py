"""Top 10 der Vorwoche (sync_spreaker.py -> data/top.json -> site_topweek.py / generate_site.py), offline mit Spreaker-Attrappen.
Lauf: python3 -m pytest -q tests/test_top_week.py"""
import json
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tools"))
import site_topweek as TOPW  # noqa: E402
import sync_spreaker as SS  # noqa: E402

UTC, BER = timezone.utc, ZoneInfo("Europe/Berlin")
SHOWS = {"en": 6704921, "de": 7393187, "hi": 99}
REQUIRED = {"en", "de"}


def utc(*a):
    return datetime(*a, tzinfo=UTC)


class FakeSpreaker:
    """Antworten wie /shows/{id}/episodes/statistics/plays/totals; fail = Show-IDs, die einen Fehler liefern."""
    def __init__(self, fail=()):
        self.calls, self.fail = [], set(fail)

    def __call__(self, path):
        self.calls.append(path)
        sid = int(path.split("/")[2])
        if sid in self.fail:
            raise RuntimeError("503 Spreaker")
        base = {6704921: 1000, 7393187: 2000, 99: 3000}[sid]
        return [{"episode_id": base + i, "plays": 0, "downloads": 100 - i} for i in range(15)]


class WeekTests(unittest.TestCase):
    def test_week_released_on_tuesday_utc(self):
        self.assertEqual(str(SS.target_week(utc(2026, 11, 9, 23, 59))), "2026-10-26")   # Montagnacht: noch W44
        self.assertEqual(str(SS.target_week(utc(2026, 11, 10, 0, 0))), "2026-11-02")    # Di 00:00 UTC: W45 frei
        self.assertEqual(SS.week_id(SS.target_week(utc(2026, 11, 10, 1, 7))), "2026-W45")   # naechtlicher Bau 01:07 UTC

    def test_year_boundary_iso_week_53(self):
        self.assertEqual(SS.week_id(SS.target_week(utc(2027, 1, 4, 12))), "2026-W52")
        m = SS.target_week(utc(2027, 1, 5, 1, 7))
        self.assertEqual((SS.week_id(m), str(m)), ("2026-W53", "2026-12-28"))
        self.assertEqual(SS.week_id(SS.target_week(utc(2027, 1, 12, 1, 7))), "2027-W01")
        self.assertEqual(str(SS.week_monday("2026-W53")), "2026-12-28")
        self.assertIsNone(SS.week_monday("2025-W53"))   # gibt es nicht
        self.assertIsNone(SS.week_monday(None))

    def test_dst_changes_do_not_shift_the_week(self):
        # Ende Sommerzeit So 25.10.2026: Bau Di 27.10. 01:07 UTC = 02:07 Berlin -> Woche 19.-25.10. (W43)
        self.assertEqual(SS.week_id(SS.target_week(datetime(2026, 10, 27, 2, 7, tzinfo=BER))), "2026-W43")
        # Di 00:30 Berlin (Winterzeit) = Mo 23:30 UTC -> noch nicht freigegeben
        self.assertEqual(SS.week_id(SS.target_week(datetime(2026, 10, 27, 0, 30, tzinfo=BER))), "2026-W42")
        # Beginn Sommerzeit So 28.3.2027: Bau Di 30.3. 01:07 UTC = 03:07 Berlin -> W12 (22.-28.3.)
        self.assertEqual(SS.week_id(SS.target_week(datetime(2027, 3, 30, 3, 7, tzinfo=BER))), "2027-W12")
        self.assertEqual(SS.target_week(datetime(2027, 3, 30, 3, 7, tzinfo=BER)), SS.target_week(datetime(2027, 3, 30, 1, 7)))  # naiv = UTC

    def test_refresh_rule(self):
        now = utc(2026, 11, 10, 1, 7)
        self.assertTrue(SS.needs_refresh(None, now))           # alter 7-Tage-Stand ohne Woche
        self.assertTrue(SS.needs_refresh("2026-W44", now))
        self.assertFalse(SS.needs_refresh("2026-W45", now))
        self.assertFalse(SS.needs_refresh("2026-W45", utc(2026, 11, 16, 23, 59)))   # bis Montagnacht eingefroren
        self.assertTrue(SS.needs_refresh("2026-W45", utc(2026, 11, 17, 0, 0)))


class RefreshTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.root = Path(self.tmp.name)
        (self.root / "data").mkdir()
        self.path = self.root / "data" / "top.json"

    def tearDown(self):
        self.tmp.cleanup()

    def test_legacy_rolling_file_is_replaced_by_full_previous_week(self):
        self.path.write_text(json.dumps({"from": "2026-10-30", "week_end": "2026-11-06", "langs": {"en": []}}), "utf-8")
        fake = FakeSpreaker()
        self.assertEqual(SS.refresh_top(self.root, SHOWS, REQUIRED, utc(2026, 11, 6, 8), fake), "updated")
        self.assertTrue(all("from=2026-10-26&to=2026-11-01" in c for c in fake.calls))   # Mo-So, beide einschliesslich
        d = json.loads(self.path.read_text("utf-8"))
        self.assertEqual((d["week"], d["from"], d["to"], d["week_end"]), ("2026-W44", "2026-10-26", "2026-11-01", "2026-11-01"))
        self.assertEqual(d["spreaker"]["from"], "2026-10-26"); self.assertTrue(d["spreaker"]["complete"])
        self.assertEqual(set(d["spreaker"]["downloads"]), REQUIRED)
        self.assertEqual(d["langs"]["en"][0]["episode_id"], 1000)
        self.assertEqual(d["updated"][:10], "2026-11-06")

    def test_frozen_until_next_tuesday_without_api_calls(self):
        SS.refresh_top(self.root, SHOWS, REQUIRED, utc(2026, 11, 10, 1, 7), FakeSpreaker())
        before = self.path.read_text("utf-8")
        for now in (utc(2026, 11, 10, 13), utc(2026, 11, 14, 1, 7), utc(2026, 11, 16, 23, 59)):
            fake = FakeSpreaker()
            self.assertEqual(SS.refresh_top(self.root, SHOWS, REQUIRED, now, fake), "current")
            self.assertEqual(fake.calls, [])
        self.assertEqual(self.path.read_text("utf-8"), before)   # kein Daten-Commit bei jedem Bau
        self.assertEqual(SS.refresh_top(self.root, SHOWS, REQUIRED, utc(2026, 11, 17, 1, 7), FakeSpreaker()), "updated")
        self.assertEqual(json.loads(self.path.read_text("utf-8"))["week"], "2026-W46")

    def test_incomplete_fetch_keeps_previous_week_and_retries(self):
        SS.refresh_top(self.root, SHOWS, REQUIRED, utc(2026, 11, 10, 1, 7), FakeSpreaker())
        before = self.path.read_text("utf-8")
        broken = FakeSpreaker(fail={7393187})   # deutsche Show antwortet nicht
        self.assertEqual(SS.refresh_top(self.root, SHOWS, REQUIRED, utc(2026, 11, 17, 1, 7), broken), "incomplete")
        self.assertEqual(self.path.read_text("utf-8"), before)
        retry = FakeSpreaker()
        self.assertEqual(SS.refresh_top(self.root, SHOWS, REQUIRED, utc(2026, 11, 17, 7), retry), "updated")   # naechster Bau
        self.assertTrue(retry.calls)
        self.assertEqual(json.loads(self.path.read_text("utf-8"))["week"], "2026-W46")

    def test_failing_non_site_show_does_not_block(self):
        self.assertEqual(SS.refresh_top(self.root, SHOWS, REQUIRED, utc(2026, 11, 10, 1, 7), FakeSpreaker(fail={99})), "updated")
        self.assertNotIn("hi", json.loads(self.path.read_text("utf-8"))["langs"])

    def test_missing_download_fields_keep_previous_download_totals(self):
        prev = {"from": "2026-10-26", "to": "2026-11-01", "downloads": {"en": 5, "de": 1}, "complete": True}
        self.path.write_text(json.dumps({"week": "2026-W44", "spreaker": prev, "langs": {}}), "utf-8")
        fetch = lambda path: [{"episode_id": 1, "plays": 3}]   # keine Downloadfelder
        self.assertEqual(SS.refresh_top(self.root, SHOWS, REQUIRED, utc(2026, 11, 10, 1, 7), fetch), "updated")
        d = json.loads(self.path.read_text("utf-8"))
        self.assertEqual((d["week"], d["spreaker"]), ("2026-W45", prev))


class ConsumerTests(unittest.TestCase):
    """Mediadaten, Service-Landingpages und Artikel lesen den Wochenstand weiter."""
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(); self.root = Path(self.tmp.name)
        (self.root / "data").mkdir()
        shows = {"en": 6704921, "de": 7393187}
        import site_landing
        req = set(site_landing.LANGS_ALL)
        fetch = lambda path: [{"episode_id": 1, "plays": 2, "downloads": 4}]
        SS.refresh_top(self.root, {**shows, **{l: 1 for l in req - set(shows)}}, req, utc(2026, 11, 10, 1, 7), fetch)
        self.req = req

    def tearDown(self):
        self.tmp.cleanup()

    def test_media_kit_reads_weekly_downloads_and_period(self):
        import mediakit as MK
        with patch.object(MK, "ROOT", self.root):
            out = MK.local()
        self.assertEqual(out["spreaker7"], 4 * len(self.req))
        self.assertEqual(out["spreaker_period"], "2026-11-02–2026-11-08")

    def test_landing_stats_show_weekly_downloads(self):
        import site_i18n, site_landing
        with patch.object(site_landing, "ROOT", self.root), patch.object(site_i18n, "T", side_effect=lambda lang, en, de: en):
            html = site_landing._stats({"stats": {"bing": {}, "gsc": {}}}, "en")
        self.assertIn("Spreaker downloads", html)
        self.assertIn("2026-11-02 – 2026-11-08", html)

    def test_article_popularity_reads_langs(self):
        try:
            import generate_articles as GA
        except ImportError as e:   # ai_gateway fehlt lokal
            self.skipTest(str(e))
        (self.root / "data" / "published.json").write_text(json.dumps({"vid1:de": {"episode_id": 1}}), "utf-8")
        with patch.object(GA, "ROOT", self.root):
            self.assertEqual(GA.popularity(), {"vid1": 4 * len(self.req)})


class PageTests(unittest.TestCase):
    TOP = {"week": "2026-W45", "from": "2026-11-02", "to": "2026-11-08", "updated": "2026-11-10T01:09:00+00:00",
           "langs": {"en": [{"episode_id": 100 + i, "score": 0 if i == 1 else 50 - i} for i in range(15)]}}

    def by_sid(self):
        return {str(100 + i): {"sid": str(100 + i), "url": f"https://www.m365.fm/show/episodes/ep-{i}/", "e": {"title": f"Episode {i}: Teil"}, "sum": "Kurz"}
                for i in range(15) if i != 3}   # Folge 103 hat keine Seite

    def test_range_and_heading_localized(self):
        a, b = TOPW.period(self.TOP)
        self.assertEqual(TOPW.heading("de", 10, self.TOP), "Top 10 der Woche 2.–8. Nov. 2026")
        self.assertEqual(TOPW.fmt_range("en", a, b), "Nov 2–8, 2026")
        self.assertEqual(TOPW.fmt_range("ja", a, b), "2026年11月2日～8日")
        x = TOPW.period({"from": "2026-12-28", "to": "2027-01-03"})
        self.assertEqual(TOPW.fmt_range("de", *x), "28. Dez. 2026 – 3. Jan. 2027")
        self.assertEqual(TOPW.fmt_range("en", *x), "Dec 28, 2026 – Jan 3, 2027")
        self.assertEqual(TOPW.fmt_range("ko", *x), "2026년 12월 28일~2027년 1월 3일")
        y = TOPW.period({"from": "2026-11-30", "to": "2026-12-06"})
        self.assertEqual(TOPW.fmt_range("fr", *y), "30 nov. – 6 déc. 2026")
        self.assertEqual(TOPW.period({"from": "2026-10-30", "week_end": "2026-11-06"})[1].isoformat(), "2026-11-06")   # alter Stand
        import generate_site as G
        for l in list(G.LANGS) + ["en"]:   # jede Sprache der Website hat Ueberschrift und Hinweis
            self.assertIn(l, TOPW.HEAD); self.assertIn(l, TOPW.NOTE)
            self.assertTrue(TOPW.fmt_range(l, a, b))

    def test_english_items_top10_mapped_and_played(self):
        items = TOPW.en_items(self.TOP, self.by_sid())
        self.assertEqual(len(items), 10)
        sids = [x["sid"] for x in items]
        self.assertNotIn("101", sids); self.assertNotIn("103", sids)   # 0 Wiedergaben / keine Seite
        self.assertEqual(sids[:3], ["100", "102", "104"])
        self.assertEqual(TOPW.en_items({"langs": {"en": [{"episode_id": 100, "score": 0}]}}, self.by_sid()), [])

    def test_english_page_written_with_itemlist_and_hreflang(self):
        written, calls = {}, []
        def page(lang, title, desc, canonical, body, alternates=None, jsonld=None, **kw):
            calls.append(dict(lang=lang, canonical=canonical, alternates=alternates, jsonld=jsonld, **kw)); return body
        g = dict(BASE="https://www.m365.fm", write=lambda rel, c: written.__setitem__(rel, c), page=page, header="<header></header>",
                 footer=lambda l: "<footer></footer>", short=lambda s, n: s[:n])
        alts = {"en": "https://www.m365.fm/top/", "de": "https://www.m365.fm/de/top/"}
        items = TOPW.en_items(self.TOP, self.by_sid())
        url, feed = TOPW.build_en(g, items, self.TOP, "Top episodes this week", alts)
        self.assertEqual(url, "https://www.m365.fm/top/")
        self.assertIn("top/index.html", written)
        h = written["top/index.html"]
        self.assertIn("<h1>Top 10 of the week Nov 2–8, 2026</h1>", h)
        self.assertEqual(h.count('class="row"'), 10)
        self.assertIn('href="https://www.m365.fm/show/episodes/ep-0/"', h)
        c = calls[0]
        self.assertEqual((c["lang"], c["canonical"], c["alternates"]), ("en", url, alts))
        lst = c["jsonld"][0]
        self.assertEqual(lst["dateModified"], "2026-11-10")
        els = lst["mainEntity"]["itemListElement"]
        self.assertEqual(len(els), 10)
        self.assertEqual(els[0], {"@type": "ListItem", "position": 1, "url": "https://www.m365.fm/show/episodes/ep-0/", "name": "Episode 0: Teil"})
        self.assertEqual([f["rank"] for f in feed], list(range(1, 11)))
        self.assertEqual(TOPW.build_en(g, [], self.TOP, "x", alts), (None, []))

    def test_footer_links_english_top_only_with_real_data(self):
        import generate_site as G
        with patch.object(G, "TOP_REAL", set()):
            f = G.footer("en")
            self.assertIn(f'href="{G.BASE}/show/episodes/">Recommended episodes<', f)
            self.assertNotIn(f'{G.BASE}/top/"', f)
        with patch.object(G, "TOP_REAL", {"en", "de"}):
            f = G.footer("en")
            self.assertIn(f'href="{G.BASE}/top/">Top episodes this week<', f)
            self.assertNotIn(f'{G.BASE}/show/episodes/"', f)
            self.assertIn(f'href="{G.BASE}/de/top/">Top-Folgen der Woche<', G.footer("de"))


if __name__ == "__main__":
    unittest.main()
