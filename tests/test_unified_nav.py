"""Ein Menue und eine Sidebar fuer alle Sprachen (Mirko, 6.11.2026): Englisch wie jede andere Sprache, keine Show-Karte in der Sidebar,
jede Inhaltsseite (Folge, Entitaet, Blogbeitrag, Video, Bibliothek, Event, Profil) mit derselben Sidebar."""
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_sidebar as SBR   # noqa: E402

BASE = "https://www.m365.fm"
ITEMS = [{"u": f"{BASE}/x/{i}/", "t": f"Folge {i}"} for i in range(8)]
SHP = {"spotify_show": "https://open.spotify.com/show/x", "amazon_show": "https://music.amazon.com/podcasts/x"}


def side(ix, lang, **kw):
    pre = "" if lang == "en" else "/" + lang
    args = dict(items=ITEMS, url_of=lambda x: x["u"], title_of=lambda x: x["t"], all_url=f"{BASE}{pre}/podcast/", shp=SHP, rss="https://www.spreaker.com/show/1/episodes/feed",
                ent_prefix=pre, community_url=f"{BASE}{pre}/community/")
    args.update(kw)
    return SBR.render(ix, BASE, lang, **args)


def cards(html):
    """Reihenfolge der Karten: Klasse oder Ueberschrift ersetzt durch eine sprachneutrale Kennung."""
    out = []
    for m in re.finditer(r'<section class="sb-card([^"]*)">(.*?)</section>', html, re.S):
        cls, inner = m.group(1).strip(), m.group(2)
        out.append(cls or ("topics" if "sb-chips" in inner else "latest" if "sb-list" in inner else "listen" if "sb-links" in inner else "?"))
    return out


class SidebarTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ix = SBR.Index()
        cls.some = [i for i, e in cls.ix.by.items() if e["type"] == "product"][:3]

    def test_same_cards_in_every_language(self):
        want = ["sb-con", "sb-g", "topics", "latest", "listen", "sb-comm"]
        for lang in SBR.L10N:
            h = side(self.ix, lang, ids=self.some)
            self.assertEqual(cards(h), want, lang)
            self.assertNotIn("sb-nav", h)
            self.assertNotIn("M365.FM Show", h)

    def test_labels_exist_in_all_languages(self):
        keys = set(SBR.L10N["en"])
        for lang, t in SBR.L10N.items():
            self.assertEqual(set(t), keys, lang)

    def test_fixed_topics_exclude_page_itself_and_link_in_page_language(self):
        h = side(self.ix, "de", ids=self.some, exclude=(self.some[0],))
        self.assertNotIn(f'/de/entity/{self.some[0]}/"', h)
        self.assertIn(f'{BASE}/de/entity/{self.some[1]}/', h)
        self.assertIn(f'{BASE}/de/community/', h)
        self.assertIn(f'{BASE}/entity/{self.some[1]}/', side(self.ix, "en", ids=self.some))

    def test_text_match_when_no_fixed_topics(self):
        h = side(self.ix, "en", text="How SharePoint and Power Automate work together")
        self.assertIn("sb-chips", h)

    def test_home_keeps_its_sidebar_without_listen_card(self):
        self.assertNotIn("listen", cards(side(self.ix, "de", home=True)))

    def test_fixed_banner_dimensions(self):   # kein Layout-Sprung (CLS)
        h = side(self.ix, "en")
        self.assertIn('width="675" height="563"', h)
        self.assertIn('width="647" height="192"', h)


class HeaderSourceTest(unittest.TestCase):
    """generate_site.py laesst sich ohne Bau nicht importieren: der Kopf wird am Quelltext geprueft."""
    src = (ROOT / "generate_site.py").read_text("utf-8")

    def test_no_english_only_menu(self):
        h = self.src[self.src.index("def header(lang, switch):"):self.src.index("_AST = {}")]
        self.assertNotIn('("Show", [', h)
        self.assertNotIn("#languages", h)
        self.assertNotIn("if lang in LANGS:", h)   # ein Aufbau fuer alle Sprachen
        for k in ('"/show/episodes/"', "/learn/", "/directory/", "/community/", "/podcast/"):
            self.assertIn(k.strip('"'), h)

    def test_community_labels_for_all_languages(self):
        import ast
        m = re.search(r"^NAV_CL = (\{.*?\})\n\n", self.src, re.S | re.M)
        nav = ast.literal_eval(m.group(1))
        self.assertEqual(set(nav), set(SBR.L10N))
        self.assertTrue(all(len(v) == 5 for v in nav.values()))

    def test_show_box_removed_and_links_on_show_page(self):
        pp = (ROOT / "site_podpage.py").read_text("utf-8")
        self.assertNotIn("sb-nav", pp)
        self.assertIn("More from the show", pp)


class ContentPagesHaveSidebarTest(unittest.TestCase):
    def test_content_builders_pass_side(self):
        for f in ("site_entities.py", "site_blog.py", "site_video.py", "site_podcast.py", "site_library.py", "site_events.py", "site_members.py", "site_live.py"):
            self.assertIn('g["side"](lang', (ROOT / f).read_text("utf-8"), f)
        self.assertIn('sidebar = g["side"]', (ROOT / "site_podpage.py").read_text("utf-8"))


if __name__ == "__main__":
    unittest.main()
