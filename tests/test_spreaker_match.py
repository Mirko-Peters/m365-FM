"""site_podpage.spreaker_match: Podpage-Seite -> Spreaker-ID (RSS, Show Notes, Index der Spreaker-API, Zeit, Slug) und der Schutz in
site_episode_urls.build_mapping gegen eine ID auf zwei Seiten. Faelle aus der Untersuchung der 140 "missing"-Folgen (A, B, C, D, F)."""
import json, sys, tempfile, unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
with patch("site_fetch.fetch", return_value={}):
    import site_podpage as P   # noqa: E402
import site_episode_urls as SEU   # noqa: E402

BASE = "https://www.m365.fm"


def rss(*eps):
    """data/en_episodes.json wie fetch_en_episodes.py: Schluessel norm(Titel), bei gleichem Titel mit angehaengter ID."""
    out = {}
    for sid, title, pub in eps:
        k = P.norm(title); k = k if k not in out else f"{k} {sid}"
        out[k] = {"title": title, "spreaker_id": sid, "pub": pub}
    return out


class Base(unittest.TestCase):
    def setUp(self):
        t = tempfile.TemporaryDirectory(); self.addCleanup(t.cleanup); self.d = Path(t.name)
        (self.d / "show_notes").mkdir()

    def data(self, en=None, notes=None, index=None):
        (self.d / "en_episodes.json").write_text(json.dumps(en or {}), "utf-8")
        (self.d / "show_notes" / "en.json").write_text(json.dumps({"episodes": {r["id"]: dict(r, key=P.norm(r["title"])) for r in (notes or [])}}), "utf-8")
        if index is not None:
            (self.d / "spreaker_index.json").write_text(json.dumps({"version": 1, "show_id": 6704921, "episodes": index}), "utf-8")

    def match(self, e, nrec=None):
        with patch.object(P, "D", self.d), patch.object(P, "_SIDS", {}):
            return P.spreaker_match(e, nrec)


OLD = {"name": "Azure DevOps Pipelines for Power Platform Deployments", "slug": "azure-devops-pipelines-for-power-platform-deployments", "published": "2025-08-06T17:49:00-07:00"}
NEW = ("75991847", "FinOps for Manufacturing IT", "Fri, 30 Oct 2026 06:25:02 +0000")


class IndexA(Base):
    """A: alte Folgen ausserhalb des RSS-Fensters - nur der Index der Spreaker-API kennt sie."""
    def test_missing_index_unchanged(self):
        self.data(rss(NEW))
        self.assertEqual(self.match(OLD), ("", 9))   # ohne data/spreaker_index.json wie bisher keine ID
        self.assertEqual(self.match({"name": NEW[1], "slug": "finops-for-manufacturing-it", "published": "2026-10-29T23:25:02-07:00"}), ("75991847", 1))

    def test_index_title_and_time(self):
        self.data(rss(NEW), index={"67289366": {"t": OLD["name"], "p": "2025-08-07 00:49:00"}, "67289445": {"t": "Enterprise architecture (Spreaker-Titel)", "p": "2025-08-08 15:00:00"}})
        self.assertEqual(self.match(OLD), ("67289366", 1))
        renamed = {"name": "Enterprise Architecture for Power Platform Management", "slug": "enterprise-architecture-for-power-platform-management", "published": "2025-08-08T08:00:00-07:00"}
        self.assertEqual(self.match(renamed), ("67289445", 2))   # Podpage-Zeit == Spreaker-Zeit
        self.assertEqual(self.match(dict(renamed, published="2025-08-08T09:00:00-07:00")), ("", 9))   # eine Stunde daneben, Slug passt nicht

    def test_index_never_overrides_rss(self):
        """Der Index kommt erst nach den bisherigen Quellen: eine eindeutige RSS-Zuordnung bleibt, auch wenn der Index zur selben Zeit eine
        andere Folge kennt."""
        self.data(rss(("72000001", "Alpha Episode Title", "Mon, 01 Jun 2026 10:01:00 +0000")), index={"72000001": {"t": "Alpha Episode Title", "p": "2026-06-01 10:01:00"},
                                                                                                    "72000002": {"t": "Ganz anders", "p": "2026-06-01 10:00:00"}})
        self.assertEqual(self.match({"name": "Umbenannt bei Podpage", "slug": "umbenannt-bei-podpage", "published": "2026-06-01T10:00:00+00:00"}), ("72000001", 3))   # nicht die sekundengleiche aus dem Index


    def test_malformed_index_like_missing(self):
        """Falsche Form der Datei (gueltiges JSON): der Seitenbau bricht nicht ab, die Zuordnung ist wie ohne Index."""
        for raw in ("[1]", '"abc"', "null", "5", '{"episodes": [1, 2]}', '{"episodes": "x"}', '{"episodes": {"67289366": {"t": 5, "p": 7}}}',
                    '{"episodes": {"67289366": ["x"], "x": {"t": "y"}}}', "{kaputt"):
            self.data(rss(NEW)); (self.d / "spreaker_index.json").write_text(raw, "utf-8")
            self.assertEqual(self.match(OLD), ("", 9), raw)
            self.assertEqual(self.match({"name": NEW[1], "slug": "finops-for-manufacturing-it", "published": "2026-10-29T23:25:02-07:00"}), ("75991847", 1), raw)

class TieC(Base):
    """C: zwei Folgen im 2-min-Fenster, Podpage hat beide umbenannt."""
    def test_exact_second_wins(self):
        self.data(rss(("67670592", "Why Disabling Power Platform Backfires: Shadow IT", "Mon, 08 Sep 2025 04:27:00 +0000"),
                      ("67670602", "Purview vs. Rogue AI: How to Keep Copilot", "Mon, 08 Sep 2025 04:25:00 +0000")))
        self.assertEqual(self.match({"name": "Purview vs Rogue AI: Who's Really in Control", "slug": "purview-vs-rogue-ai-whos-really-in-control", "published": "2025-09-08T04:25:00+00:00"}), ("67670602", 2))
        self.assertEqual(self.match({"name": "Govern Power Platform Environments", "slug": "why-disabling-power-platform-backfires-every-time", "published": "2025-09-08T04:27:00+00:00"}), ("67670592", 2))

    def test_slug_breaks_tie(self):
        self.data(rss(("72652352", "The Terminal is No Longer for Commands: Building the Agentic Developer Stack", "Wed, 24 Jun 2026 14:00:02 +0000"),
                      ("72665639", "Building Enterprise AI Agents with Copilot Studio, Power Platform & AI Governance with Sailaja Mantripragada [MVP/MCT]", "Wed, 24 Jun 2026 14:00:02 +0000")))
        pub = "2026-06-24T14:00:02+00:00"
        self.assertEqual(self.match({"name": "The Agentic Developer Stack", "slug": "the-terminal-is-no-longer-for-commands-building-the-agentic-developer-stack", "published": pub}), ("72652352", 4))
        self.assertEqual(self.match({"name": "Enterprise AI Agents with Sailaja", "slug": "building-enterprise-ai-agents-with-copilot-studio-power-platform-ai-governance-with-sailaja-mantr", "published": pub}), ("72665639", 4))   # von Podpage mitten im Wort gekuerzt
        self.assertEqual(self.match({"name": "Etwas anderes", "slug": "etwas-ganz-anderes-ohne-bezug", "published": pub}), ("", 9))   # keine eindeutige Loesung: keine ID

    def test_slug_tie_needs_unique(self):
        self.data(rss(("1", "Copilot Agents Explained Part One", "Wed, 24 Jun 2026 14:00:02 +0000"), ("2", "Copilot Agents Explained Part Two", "Wed, 24 Jun 2026 14:00:02 +0000")))
        self.assertEqual(self.match({"name": "X", "slug": "copilot-agents-explained", "published": "2026-06-24T14:00:02+00:00"}), ("", 9))


class SlugD(Base):
    """D: umbenannt und Zeit mehr als 2 min verschoben - nur der Slug (eindeutig, hoechstens 2 Tage)."""
    def test_slug_prefix_within_two_days(self):
        self.data(rss(("68192406", "Stop using Power Automate like this: when to move your workflows to Azure Logic Apps", "Sat, 18 Oct 2025 10:55:55 +0000")))
        page = {"name": "Stop Using Power Automate Like This", "slug": "stop-using-power-automate-like-this", "published": "2025-10-18T21:55:00-07:00"}   # +18 h
        self.assertEqual(self.match(page), ("68192406", 5))
        self.assertEqual(self.match(dict(page, published="2025-10-25T21:55:00-07:00")), ("", 9))   # eine Woche daneben: nicht zuordnen
        self.assertEqual(self.match(dict(page, slug="stop-using")), ("", 9))   # zu kurzer Slug zaehlt nicht


class DuplicateB(Base):
    """B: zwei Spreaker-Folgen mit gleichem Titel (Neu-Upload) - der Titel allein entscheidet nicht mehr."""
    def setUp(self):
        super().setUp()
        en = rss(("73025082", "Azure Virtual Desktop - Simply Explained", "Fri, 17 Jul 2026 18:00:02 +0000"), ("75941556", "Azure Virtual Desktop - Simply Explained", "Sat, 31 Oct 2026 08:00:03 +0000"))
        self.data(en, notes=[{"id": "75941556", "title": "Azure Virtual Desktop - Simply Explained"}])
        self.nrec = {"id": "75941556"}   # SNT.get(title=...) liefert den Datensatz des Neu-Uploads

    def test_time_decides(self):
        page = {"name": "Azure Virtual Desktop - Simply Explained", "slug": "azure-virtual-desktop-simply-explained", "published": "2026-07-17T11:00:00-07:00"}
        self.assertEqual(self.match(page, self.nrec), ("73025082", 3))
        self.assertEqual(self.match(dict(page, slug="azure-virtual-desktop-simply-explained-2", published="2026-10-31T08:00:03+00:00"), self.nrec), ("75941556", 2))
        self.assertEqual(self.match(dict(page, published=None), self.nrec), ("75941556", 6))   # ohne Zeit: alte Regel, aber mit schwacher Guete
        self.assertEqual(self.match({"name": "X", "slug": "x-2", "spreaker_id": "75941556"}), ("75941556", 0))

    def test_unique_title_still_first(self):
        self.data(rss(("1", "Unique Title Here", "Fri, 17 Jul 2026 18:00:02 +0000"), ("2", "Other", "Fri, 17 Jul 2026 18:00:02 +0000")))
        self.assertEqual(self.match({"name": "Unique Title Here", "slug": "y", "published": "2026-07-17T18:00:02+00:00"}), ("1", 1))


class Mapping(unittest.TestCase):
    def test_guard_keeps_better_match(self):
        msgs = []
        items = [{"sid": "75941556", "slug": "azure-virtual-desktop-simply-explained-2", "sid_q": 0}, {"sid": "75941556", "slug": "azure-virtual-desktop-simply-explained", "sid_q": 6},
                 {"sid": "75526001", "slug": "iot-hub-message-routing", "sid_q": 6}, {"sid": "75526001", "slug": "iot-hub-message-routing-vs-event-grid", "sid_q": 3}]
        m = SEU.build_mapping(BASE, items, [], {}, out=msgs.append)
        self.assertEqual({r["spreaker_episode_id"]: r["slug"] for r in m["items"]}, {"75941556": "azure-virtual-desktop-simply-explained-2", "75526001": "iot-hub-message-routing-vs-event-grid"})
        self.assertEqual(len(msgs), 2); self.assertTrue(all("zwei Seiten" in x for x in msgs))

    def test_guard_tie_keeps_first_and_same_slug_silent(self):
        msgs = []
        m = SEU.build_mapping(BASE, [{"sid": 1, "slug": "a"}, {"sid": 1, "slug": "b"}, {"sid": 2, "slug": "c"}, {"sid": 2, "slug": "c"}], [], {}, out=msgs.append)
        self.assertEqual([r["slug"] for r in m["items"]], ["a", "c"]); self.assertEqual(len(msgs), 1)

    def test_dub_rows_unchanged(self):
        """F: doppelte Dub-Uploads (10-28 und 10-29) - die Dub-Zuordnung bleibt wie bisher (je eid ihre Seite, erste gewinnt, keine Meldung)."""
        msgs = []
        dub = [("de", {"eid": "76059395", "slug": "azure-ai-foundry-threads-so-wird-ihre-ki-unternehmenstauglich-und"}), ("de", {"eid": "76059395", "slug": "anders"}), ("ja", {"eid": "76059402", "slug": "azure-ai-foundry-ai"})]
        m = SEU.build_mapping(BASE, [{"sid": "76059395", "slug": "en-seite", "sid_q": 1}], dub, {"de": 7393187, "ja": 7393260}, out=msgs.append)
        rows = {r["spreaker_episode_id"]: (r["lang"], r["url"]) for r in m["items"]}
        self.assertEqual(rows["76059402"], ("ja", f"{BASE}/ja/azure-ai-foundry-ai/")); self.assertEqual(rows["76059395"][0], "en")
        self.assertEqual(msgs, [])



class IndexBySid(unittest.TestCase):
    """episode_index: eine Spreaker-ID gehoert genau einer Seite - by_sid, sid der Seiten, YouTube-Video und spreaker-urls.json folgen
    derselben Regel wie build_mapping (kleineres sid_q, bei Gleichstand die erste = neuere Seite)."""
    def index(self, matches):
        eps = [{"name": f"Folge {s}", "slug": s, "create_time": t, "show_notes": "", "published": True} for s, t in
               (("neu-q5", "2026-10-03T10:00:00"), ("mitte-q1", "2026-10-02T10:00:00"), ("alt-q5", "2026-10-01T10:00:00"), ("allein", "2026-09-01T10:00:00"))]
        msgs = []
        with patch.object(P, "_IDX", {}), patch.object(P, "load", lambda n: eps if n == "episodes" else []), patch.object(P.SNT, "get", lambda *a, **k: None), \
                patch.object(P, "spreaker_match", lambda e, nrec=None: matches[e["slug"]]), patch.object(P.SX, "yt_of", lambda sid: {"100": "AAAAAAAAAAA", "200": "BBBBBBBBBBB"}.get(str(sid), "")), \
                patch("builtins.print", lambda *a, **k: msgs.append(" ".join(map(str, a)))):
            return P.episode_index(BASE), msgs

    def test_collision_one_owner(self):
        idx, msgs = self.index({"neu-q5": ("100", 5), "mitte-q1": ("100", 1), "alt-q5": ("100", 5), "allein": ("200", 3)})
        it = idx["by_slug"]
        self.assertIs(idx["by_sid"]["100"], it["mitte-q1"]); self.assertIs(idx["by_sid"]["200"], it["allein"])   # nicht die letzte (aelteste) Seite
        self.assertEqual([(it[s]["sid"], it[s]["sid_q"]) for s in ("neu-q5", "mitte-q1", "alt-q5", "allein")], [("", 9), ("100", 1), ("", 9), ("200", 3)])
        self.assertEqual([it[s].get("yt") for s in ("neu-q5", "mitte-q1", "alt-q5")], [None, "AAAAAAAAAAA", None])   # kein fremdes Video auf der Verliererseite
        self.assertEqual(len(msgs), 2); self.assertTrue(all("zwei Seiten" in x and "behalte mitte-q1" in x for x in msgs))
        m = SEU.build_mapping(BASE, idx["items"], [], {}, out=msgs.append)
        self.assertEqual({r["spreaker_episode_id"]: r["slug"] for r in m["items"]}, {"100": "mitte-q1", "200": "allein"}); self.assertEqual(len(msgs), 2)   # schon geloest

    def test_tie_keeps_newer_page(self):
        idx, msgs = self.index({"neu-q5": ("100", 5), "mitte-q1": ("", 9), "alt-q5": ("100", 5), "allein": ("", 9)})
        self.assertEqual((idx["by_slug"]["neu-q5"]["sid"], idx["by_slug"]["alt-q5"]["sid"]), ("100", ""))
        self.assertEqual(list(idx["by_sid"]), ["100"]); self.assertEqual(len(msgs), 1)

    def test_no_collision_unchanged(self):
        idx, msgs = self.index({"neu-q5": ("100", 5), "mitte-q1": ("300", 1), "alt-q5": ("", 9), "allein": ("200", 3)})
        self.assertEqual({k: v["slug"] for k, v in idx["by_sid"].items()}, {"100": "neu-q5", "300": "mitte-q1", "200": "allein"}); self.assertEqual(msgs, [])

if __name__ == "__main__":
    unittest.main()
