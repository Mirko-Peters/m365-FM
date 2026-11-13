"""SEO-Titel und Meta-Descriptions der Podcast-Seiten (site_meta_podcast.py), ohne Seitenbau: die Bildner laufen mit den echten Daten des Repos
(episodes/*.json = Dub-Folgen in 14 Sprachen, data/podpage = englische Hauptshow, data/podpage_i18n = lokalisierte Fassungen, data/live.json,
shows_seo.json, Themen aus site_taxonomy) und pruefen Laenge, Marke, Duplikate und Schablonen."""
import glob
import gzip
import json
import re
import sys
import unittest
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_meta_podcast as M   # noqa: E402
import site_taxonomy as TAX   # noqa: E402
import site_topweek as TOPW   # noqa: E402
from site_i18n import COMM_LANGS   # noqa: E402

DUB_LANGS = [l for l in COMM_LANGS if l != "en"]
BRAND = re.compile(r"M365[ .]?FM", re.I)
DUB_RX = re.compile("|".join(re.escape(x) for x in M.DUB_LABELS))


def dub_items():
    out = {l: [] for l in DUB_LANGS}
    for f in sorted(glob.glob(str(ROOT / "episodes" / "*.json"))):
        d = json.load(open(f, encoding="utf-8"))
        for l in DUB_LANGS:
            if d.get(l): out[l].append(d[l])
    return out


def en_episodes():
    return json.loads(gzip.open(ROOT / "data" / "podpage" / "episodes.json.gz", "rt", encoding="utf-8").read())


def intro(e):
    ps = re.findall(r"<p>(.*?)</p>", e["desc"], re.S)
    return ps[0] if ps else ""


def check_title(tc, t, bare_ok=True):
    tc.assertTrue(t.strip(), "Titel leer")
    tc.assertLessEqual(len(BRAND.findall(t)), 1, f"Marke doppelt: {t}")
    tc.assertLessEqual(M.wlen(t), 70, f"Titel zu lang: {t}")
    if BRAND.search(t) and not t.startswith("M365.FM") and not t.endswith("Podcast"):
        tc.assertTrue(t.endswith(M.BRAND) or t.endswith("M365 FM") or "M365.FM Network" in t, f"Marke nicht hinten: {t}")
    tc.assertFalse(DUB_RX.search(t), f"Dub-Kennzeichen im Titel: {t}")
    tc.assertFalse(t.rstrip().endswith(":"), t)


def check_desc(tc, d, lo=60, hi=160):
    tc.assertTrue(d.strip(), "Description leer")
    tc.assertLessEqual(M.wlen(d), hi, f"Description zu lang: {d}")
    tc.assertGreaterEqual(M.wlen(d), lo, f"Description zu kurz: {d}")
    tc.assertFalse(re.search(r"<[a-z/]", d), d)
    tc.assertNotRegex(d, r"https?://")


class UnitTest(unittest.TestCase):
    def test_wlen_counts_cjk_double(self):
        self.assertEqual(M.wlen("abc"), 3)
        self.assertEqual(M.wlen("日本語"), 6)

    def test_clean_title_drops_dub_label(self):
        self.assertEqual(M.clean_title("Python als Klebstoff in Power Automate? (KI-Synchronfassung)"), "Python als Klebstoff in Power Automate?")
        self.assertEqual(M.clean_title("Azure Local - Simply Explained"), "Azure Local: Simply Explained")
        self.assertEqual(M.clean_title("Azure Backup: "), "Azure Backup")
        self.assertEqual(M.clean_title("From Demo to Production- Building Agents"), "From Demo to Production: Building Agents")

    def test_title_topic_first_then_format_then_brand(self):
        t = M.episode_title("de", "Azure DNS einfach erklärt: Öffentliche und private Zonen, Auflösung und Hybrid-DNS (KI-Synchronfassung)")
        self.assertTrue(t.startswith("Azure DNS einfach erklärt") and "…" not in t and "Synchron" not in t and M.wlen(t) <= 70, t)
        self.assertEqual(M.episode_title("de", "Azure DNS einfach erklärt: Öffentliche und private Zonen, Auflösung und Hybrid-DNS-Architektur im Detail", uniq=None)[:25], "Azure DNS einfach erklärt")
        t = M.episode_title("de", "Prädiktives Lead-Scoring in Dynamics 365: Wie die KI Kaufabsicht erkennt und Leads priorisiert (KI-Synchronfassung)")
        self.assertEqual(t, "Prädiktives Lead-Scoring in Dynamics 365 | M365.FM Podcast")
        t = M.episode_title("en", "7 Levels of Azure Administration")
        self.assertEqual(t, "7 Levels of Azure Administration – Podcast Episode | M365.FM")
        t = M.episode_title("en", "How to Use Copilot in Power BI for Predictive Analytics")
        self.assertTrue(t.startswith("How to Use Copilot in Power BI for Predictive Analytics") and t.count("M365.FM") <= 1 and M.wlen(t) <= 70, t)

    def test_title_keeps_existing_brand(self):
        t = M.episode_title("en", "M365.FM Live: What changed in Teams")
        self.assertEqual(len(BRAND.findall(t)), 1)

    def test_title_unique_per_language(self):
        u = M.Uniq()
        a = M.episode_title("de", "Teams Governance: Kanäle und Berechtigungen", uniq=u)
        b = M.episode_title("de", "Teams Governance: Gäste und Lebenszyklus", uniq=u)
        c = M.episode_title("fr", "Teams Governance: Kanäle und Berechtigungen", uniq=u)
        self.assertNotEqual(a, b)
        self.assertTrue(c)

    def test_desc_sentence_boundaries_and_answer_first(self):
        hook = "Chat in Teams, Deadlines in Outlook, Notizen in OneNote und fünf Versionen derselben Datei im Umlauf."
        ans = "Diese Folge zeigt, wie Microsoft Loop Workspaces Notizen, Aufgaben und Dateien an einem Ort zusammenführen."
        d = M.episode_desc("de", f"{hook} {ans}", prefer_answer=True)
        self.assertTrue(d.endswith("zusammenführen.") and not d.endswith("…"), d)
        self.assertTrue(d.startswith("Chat in Teams") or d.startswith("Diese Folge"), d)
        d2 = M.episode_desc("de", "Kurzer Satz. " + "Lang " * 60 + "Ende.")
        self.assertLessEqual(M.wlen(d2), 155)

    def test_desc_boilerplate_and_emoji_removed(self):
        d = M.episode_desc("en", "In this episode of the m365.fm podcast, we look at Copilot adoption 😵‍💫 in large tenants and what to measure first.")
        self.assertFalse(d.lower().startswith("in this episode"))
        self.assertNotIn("😵", d)
        self.assertTrue(d[0].isupper())

    def test_desc_tail_only_when_page_has_it(self):
        short = "Warum konvertieren manche Leads?"
        self.assertNotIn("Transkript", M.episode_desc("de", short))
        self.assertNotIn("Transkript", M.episode_desc("de", short, has_video=True))
        self.assertIn("Video und Transkript", M.episode_desc("de", short, has_video=True, has_transcript=True))

    def test_templated_fields_are_detected(self):
        self.assertTrue(M.templated_title("computer-using agents CUA future of SaaS Explained:"))
        self.assertTrue(M.templated_title("Dynamics 365 Virtual Entities Explained | M365 FM"))
        self.assertTrue(M.templated_title("simplify Microsoft 365 architecture and governance"))
        self.assertFalse(M.templated_title("Serverless Computing Explained: Azure Functions & M365"))
        self.assertFalse(M.templated_title("GitHub Actions - Simply Explained"))
        self.assertTrue(M.templated_desc("Learn X in plain English: practical use cases, architecture, governance, security."))
        t, d = M.en_episode_meta("Azure Bicep at Scale: Modular Infrastructure as Code", "Azure Bicep at scale best practices Explained | M365 FM",
                                 "Learn Azure Bicep at scale best practices in plain English: practical use cases, architecture, governance, security, and key implementation decisions.",
                                 "Azure Bicep is far more than a cleaner replacement for ARM templates. It is an architectural approach to managing cloud infrastructure at enterprise scale.", "")
        self.assertTrue(t.startswith("Azure Bicep at Scale"), t)
        self.assertNotIn("plain English", d)

    def test_fallback_to_english_for_unknown_language(self):
        self.assertTrue(M.episode_title("xx", "Teams Governance Basics for Admins").endswith("M365.FM"))
        t, d = M.home_meta("xx", 15)
        self.assertEqual((t, d), M.home_meta("en", 15))


class DubEpisodeTest(unittest.TestCase):
    def test_all_languages(self):
        items = dub_items(); cut = total = 0
        for l, eps in items.items():
            self.assertGreaterEqual(len(eps), 100, l)
            u = M.Uniq(); titles = []; descs = []
            for e in eps:
                t = M.episode_title(l, e["title"], uniq=u)
                d = M.episode_desc(l, intro(e), prefer_answer=True, has_video=True, has_transcript=bool(e.get("tr")))
                check_title(self, t); check_desc(self, d, lo=60, hi=155)
                titles.append(t); descs.append(d)
            self.assertEqual(len(titles), len(set(titles)), f"doppelte Titel ({l})")
            self.assertLessEqual(len(descs) - len(set(descs)), 1, f"doppelte Descriptions ({l})")
            self.assertLessEqual(sum("…" in t for t in titles) / len(titles), 0.08, f"zu viele Titel mit Auslassungszeichen ({l})")
            self.assertGreaterEqual(sum(120 <= M.wlen(d) <= 155 for d in descs) / len(descs), 0.8, f"zu wenige Descriptions mit 120-155 Zeichen ({l})")
            self.assertLessEqual(sum(d.endswith("…") for d in descs) / len(descs), 0.25, f"zu viele abgeschnittene Descriptions ({l})")
            cut += sum(d.endswith("…") for d in descs); total += len(descs)
        self.assertLessEqual(cut / total, 0.12, "Descriptions mit Auslassungszeichen insgesamt")

    def test_examples_from_data(self):
        de = dub_items()["de"]
        self.assertGreaterEqual(len([e for e in de if "einfach erklärt" in e["title"]]), 10)
        for e in [x for x in de if "einfach erklärt" in x["title"]][:12]:
            t = M.episode_title("de", e["title"])
            self.assertIn("einfach erklärt", t)


class EnglishEpisodeTest(unittest.TestCase):
    def test_all_episodes(self):
        eps = en_episodes()
        self.assertGreaterEqual(len(eps), 1000)
        u = M.Uniq(); titles = []; descs = []
        for e in eps:
            sn = re.sub(r"<[^>]+>", " ", e.get("show_notes") or "")
            t, d = M.en_episode_meta(e["name"], e.get("meta_title"), e.get("meta_description"), e.get("summary"), sn, uniq=u)
            check_title(self, t); check_desc(self, d, lo=40, hi=160)
            self.assertFalse(M.templated_desc(d) and any(x for x in (e.get("summary"),) if x), d)
            titles.append(t); descs.append(d)
        self.assertEqual(len(titles), len(set(titles)), "doppelte Titel")
        self.assertLessEqual(len(descs) - len(set(descs)), 5)
        self.assertLessEqual(sum(M.templated_desc(d) for d in descs), 5)
        self.assertLessEqual(sum(bool(re.search(r"Explained\s*\|\s*M365 FM", t)) for t in titles), 0, "Schablonentitel")
        self.assertEqual(sum("M365 FM" in t for t in titles), 0, "Marke einheitlich als M365.FM")
        self.assertLessEqual(sum("…" in t for t in titles) / len(titles), 0.02)
        self.assertGreaterEqual(sum(120 <= M.wlen(d) <= 160 for d in descs) / len(descs), 0.8)


class LocalizedEpisodeTest(unittest.TestCase):
    def test_all_languages(self):
        for l in DUB_LANGS:
            p = json.load(open(ROOT / "data" / "podpage_i18n" / f"{l}.json", encoding="utf-8"))
            rows = [v for v in p.values() if v and v[0]]
            self.assertGreaterEqual(len(rows), 100, l)
            u = M.Uniq(); ts = []; n_empty = 0
            for v in rows:
                t = M.episode_title(l, v[0], uniq=u); d = M.episode_desc(l, v[1] or "")
                if M.junk(v[0]) or M.junk(v[1]): continue   # Platzhalter der Uebersetzung: der Bau faellt auf den englischen Titel zurueck
                check_title(self, t)
                if d: check_desc(self, d, lo=20, hi=155)
                else: n_empty += 1
                ts.append(t)
            self.assertEqual(len(ts), len(set(ts)), f"doppelte Titel ({l})")
            self.assertLessEqual(n_empty, 3, l)
            self.assertLessEqual(sum("…" in t for t in ts) / len(ts), 0.06, l)


class HubTest(unittest.TestCase):
    def test_language_homes(self):
        titles = []
        for l in DUB_LANGS + ["en"]:
            t, d = M.home_meta(l, 15)
            check_title(self, t); check_desc(self, d, lo=120, hi=155)
            self.assertTrue(t.startswith("M365.FM"), t)
            titles.append(t)
        self.assertEqual(len(titles), len(set(titles)))
        # die Zahl der Sprachen kommt aus dem Bau, nicht aus der Vorlage
        self.assertIn("15", M.home_meta("de", 15)[1])
        self.assertIn("14", M.home_meta("de", 14)[1])

    def test_podcast_hubs(self):
        seo = json.load(open(ROOT / "shows_seo.json", encoding="utf-8"))
        ts = []
        for l in DUB_LANGS:
            t, d = M.podcast_hub_meta(l, seo[l]["title"], 181)
            check_title(self, t); check_desc(self, d, lo=120, hi=155)
            self.assertIn("181", d)
            ts.append(t)
        self.assertEqual(len(ts), len(set(ts)))

    def test_episode_lists_of_language_versions(self):
        ts = set()
        for l in DUB_LANGS:
            t, d = M.episode_list_meta(l, 150, "Deutsch")
            check_title(self, t); check_desc(self, d, lo=120, hi=155)
            ts.add(t)
        self.assertEqual(len(ts), len(DUB_LANGS))

    def test_category_pages(self):
        eps = dub_items()
        n = 0
        for l in DUB_LANGS:
            titles = [e["title"] for e in eps[l][:6]]
            seen = set()
            for c in TAX.ORDER:
                label = TAX.cat_name(c, l)
                t, d = M.category_meta(l, label, 25, titles)
                check_title(self, t); check_desc(self, d, lo=70, hi=155)
                self.assertTrue(t.startswith(label), t)
                self.assertNotIn(t, seen); seen.add(t); n += 1
        self.assertEqual(n, len(DUB_LANGS) * len(TAX.ORDER))

    def test_top_pages(self):
        eps = dub_items()
        a, b = TOPW._d("2026-11-02"), TOPW._d("2026-11-08")
        for l in DUB_LANGS + ["en"]:
            heading = TOPW.HEAD[l].format(n=10, r=TOPW.fmt_range(l, a, b))
            titles = [e["title"] for e in (eps.get(l) or eps["de"])[:3]]
            t, d = M.top_meta(l, "Top", heading, titles)
            check_title(self, t); check_desc(self, d, lo=70, hi=155)
            t2, d2 = M.top_meta(l, "Top", None, titles)   # ohne Zeitraum (vorlaeufige Fassung)
            check_title(self, t2)


class EnglishShowPagesTest(unittest.TestCase):
    def test_guest_pages(self):
        guests = json.load(open(ROOT / "data" / "podpage" / "guests.json", encoding="utf-8"))
        self.assertGreaterEqual(len(guests), 100)
        ts = []
        for g in guests:
            t, d = M.guest_meta(g["name"], g.get("title") or "", g.get("bio") or "", 2)
            check_title(self, t); check_desc(self, d, lo=40, hi=155)
            self.assertIn(g["name"].split(" [")[0][:20], t)
            ts.append(t)
        self.assertLessEqual(len(ts) - len(set(ts)), 2)
        t, d = M.guest_meta("Jane Doe", "", "", 0)
        self.assertNotIn("0 podcast", d)

    def test_static_pages(self):
        hosts = [h["name"] for h in json.load(open(ROOT / "data" / "podpage" / "hosts.json", encoding="utf-8"))]
        pages = [M.episodes_list_meta(1119), M.guests_list_meta(174), M.hosts_meta(hosts), M.sponsors_meta(), M.reviews_meta(), M.listen_meta(),
                 M.show_home_meta("M365 FM Podcast", "The M365 FM Podcast is your daily destination for everything happening across the Microsoft cloud. We cover Teams, SharePoint and more.")]
        self.assertEqual(len({t for t, _ in pages}), len(pages))
        for t, d in pages:
            check_title(self, t); check_desc(self, d, lo=60, hi=160)
        self.assertIn("1119", M.episodes_list_meta(1119)[1])


class OtherPagesTest(unittest.TestCase):
    def test_live_streams(self):
        streams = json.load(open(ROOT / "data" / "live.json", encoding="utf-8"))["streams"]
        self.assertGreaterEqual(len(streams), 50)
        u = M.Uniq()
        for s in streams[:80]:
            t, d = M.live_stream_meta("en", s["title"], s.get("description") or "")
            check_title(self, t); check_desc(self, d, lo=10, hi=155)
        for l in ("en", "de"):
            t, d = M.live_hub_meta(l, "The M365 Show is a running live stream show: conversations and demos with Microsoft community experts, every week on YouTube.")
            check_title(self, t); check_desc(self, d, lo=60, hi=155)

    def test_network_and_community(self):
        t, d = M.network_hub_meta(12, 340); check_title(self, t); check_desc(self, d)
        t, d = M.network_show_meta("en", "The Cloud Pod", "Jane Roe", "Weekly news on Azure, Microsoft 365 and Power Platform for admins. Short, practical and without hype.", 40)
        check_title(self, t); check_desc(self, d, lo=40)
        t, d = M.network_episode_meta("en", "Entra Conditional Access", "The Cloud Pod", "How to design Conditional Access policies that stay readable. We walk through baseline policies, exclusions and break-glass accounts.")
        check_title(self, t); check_desc(self, d)
        self.assertIn("The Cloud Pod", t)
        for kind in ("podcast", "video"):
            t, d = M.community_item_meta("de", kind, "Copilot im Mittelstand", "Max Muster", "Wie ein 200-Personen-Betrieb Copilot einführt. Mit Lizenzfragen und Datenschutz.")
            check_title(self, t); check_desc(self, d, lo=40)
            t, d = M.community_item_meta("en", kind, "Test", "Max Muster", "")
            self.assertIn("Max Muster", d)


if __name__ == "__main__":
    unittest.main()
