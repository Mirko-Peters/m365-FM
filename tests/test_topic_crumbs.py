"""Zweite BreadcrumbList nach dem Hauptthema (site_topic_crumbs): Regeln der Themenwahl, Kette wie die Entitaetsseiten, gerenderte Seiten
(Blogbeitrag, Video, englische Folge, Dub-Folge) mit zwei Brotkrumen-Spuren; Seiten ohne Thema bleiben unveraendert. Laeuft ohne Netz."""
import json
import re
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_topic_crumbs as TC   # noqa: E402

BASE = "https://www.m365.fm"


def ent(i, name, t="concept", rel=None, **kw):
    return {"id": i, "type": t, "name": name, "aliases": kw.pop("aliases", []), "desc": {"en": "x", "de": ""}, "rel": rel or [], **kw}


ENTS = {e["id"]: e for e in [
    ent("mirko-peters", "Mirko Peters", "person"),
    ent("jane-doe", "Jane Doe", "person"),
    ent("microsoft", "Microsoft", "org"),
    ent("m365fm", "M365.FM", "media"),
    ent("microsoft-tool", "Microsoft tool", "category"),
    ent("collaboration-tool", "Collaboration tool", "category", [["instance_of", "microsoft-tool"]]),
    ent("identity-security-tool", "Identity and security tool", "category", [["instance_of", "microsoft-tool"]]),
    ent("microsoft-365", "Microsoft 365", "platform", [["instance_of", "microsoft-tool"], ["instance_of", "collaboration-tool"]], aliases=["M365"]),
    ent("microsoft-entra", "Microsoft Entra", "platform", [["instance_of", "identity-security-tool"]]),
    ent("entra-id", "Microsoft Entra ID", "product", [["part_of", "microsoft-entra"], ["instance_of", "microsoft-tool"]], aliases=["Entra ID", "Azure AD"]),
    ent("conditional-access", "Conditional Access", "concept", [["broader", "entra-id"]]),
    ent("ca-policy", "Conditional Access policy", "concept", [["part_of", "conditional-access"]]),
    ent("teams", "Microsoft Teams", "product", [["part_of", "microsoft-365"], ["instance_of", "microsoft-tool"]], aliases=["Teams"]),
    ent("sharepoint", "SharePoint", "product", [["part_of", "microsoft-365"]]),
    ent("copilot", "Microsoft 365 Copilot", "product", aliases=["Copilot"]),
    ent("governance", "Governance"),
    ent("manufacturing", "Manufacturing", "industry"),
    ent("old-thing", "Old thing", "product", outdated=True),
    ent("skype", "Skype for Business", "product", [["part_of", "microsoft-365"]], replaced_by="teams"),
    ent("legacy-child", "Legacy child", "concept", [["part_of", "skype"]]),
    ent("event-x", "Some Conf", "event"),
]}


def _idx(*ids, langs=("en", "de")):
    """Indexierte Sprachen der Entitaetsseiten festlegen (sonst haengt der Test an den echten Texten in data/): ids stehen in langs auf index, alle anderen nur en."""
    import site_entities as SE
    return patch.object(SE, "topic_index_langs", lambda e: frozenset(langs) if e["id"] in ids else frozenset({"en"}))


def lists(ld):
    return [x for x in (ld if isinstance(ld, list) else [ld]) if isinstance(x, dict) and x.get("@type") == "BreadcrumbList"]


def names(bc):
    return [x["name"] for x in bc["itemListElement"]]


class MainTopic(unittest.TestCase):
    def test_default_is_first_in_about_order(self):
        self.assertEqual(TC.main_topic(["sharepoint", "teams"], ENTS), "sharepoint")
        self.assertEqual(TC.main_topic(["teams", "sharepoint"], ENTS), "teams")

    def test_people_orgs_media_categories_events_are_never_topics(self):
        self.assertEqual(TC.main_topic(["mirko-peters", "microsoft", "m365fm", "microsoft-tool", "event-x", "jane-doe", "sharepoint"], ENTS), "sharepoint")
        self.assertIsNone(TC.main_topic(["mirko-peters", "microsoft", "m365fm", "collaboration-tool", "event-x"], ENTS))

    def test_broad_and_roots_only_without_a_specific_topic(self):
        self.assertEqual(TC.main_topic(["microsoft-365", "governance", "conditional-access"], ENTS), "conditional-access")
        self.assertEqual(TC.main_topic(["microsoft-365", "governance"], ENTS), "governance")   # breit vor Wurzel
        self.assertEqual(TC.main_topic(["manufacturing", "microsoft-365"], ENTS), "manufacturing")   # Wurzel/Branche: erste der letzten Stufe
        self.assertEqual(TC.main_topic(["microsoft-365"], ENTS), "microsoft-365")   # letzte Wahl

    def test_copilot_counts_as_specific_product(self):
        self.assertEqual(TC.main_topic(["copilot", "sharepoint"], ENTS), "copilot")

    def test_title_prefers_named_topic(self):
        self.assertEqual(TC.main_topic(["sharepoint", "teams"], ENTS, title="Teams meeting tips"), "teams")
        # breites Thema im Titel schlaegt ein spezifisches ohne Titeltreffer, ein spezifisches im Titel gewinnt immer
        self.assertEqual(TC.main_topic(["sharepoint", "microsoft-entra"], ENTS, title="Microsoft Entra explained"), "microsoft-entra")
        self.assertEqual(TC.main_topic(["microsoft-entra", "entra-id"], ENTS, title="Microsoft Entra ID in Microsoft Entra"), "entra-id")
        # Wurzeln zaehlen nicht ueber den Titel ("Microsoft 365" steht in sehr vielen Titeln)
        self.assertEqual(TC.main_topic(["microsoft-365", "sharepoint"], ENTS, title="Microsoft 365 for beginners"), "sharepoint")

    def test_outdated_replaced_unknown_and_foreign_language(self):
        self.assertEqual(TC.main_topic(["old-thing", "skype", "nope", "teams"], ENTS), "teams")
        self.assertIsNone(TC.main_topic(["old-thing", "skype", "nope"], ENTS))
        self.assertIsNone(TC.main_topic([], ENTS))
        self.assertIsNone(TC.main_topic(None, ENTS))
        self.assertIsNone(TC.main_topic(["teams"], ENTS, lang="xx"))   # keine Entitaetsseiten in dieser Sprache

    def test_rank_puts_first_then_text_mentions(self):
        self.assertEqual(TC.rank(["sharepoint", "teams", "copilot"], ENTS, "copilot and teams and teams", first=["copilot"]), ["copilot", "teams", "sharepoint"])
        self.assertEqual(TC.rank(["sharepoint", "teams"], ENTS, ""), ["sharepoint", "teams"])
        self.assertEqual(TC.rank(["teams"], ENTS, "", first=["sharepoint"]), ["teams"])   # first nur, was auch Kandidat ist


class Chain(unittest.TestCase):
    def test_chain_like_entity_pages(self):
        import ontology as ONT
        self.assertEqual(TC.chain("ca-policy", ENTS), list(reversed(ONT.ancestors("ca-policy", ENTS)[:3])))
        self.assertEqual(TC.chain("ca-policy", ENTS), ["microsoft-entra", "entra-id", "conditional-access"])   # hoechstens 3, von oben nach unten
        self.assertEqual(TC.chain("teams", ENTS), ["collaboration-tool", "microsoft-365"])   # microsoft-tool nie
        self.assertEqual(TC.chain("legacy-child", ENTS), ["collaboration-tool", "microsoft-365"])   # ersetzter Oberbegriff (skype) faellt weg, die Kette darueber bleibt

    def test_breadcrumb_items(self):
        with _idx(*ENTS):
            bc = TC.breadcrumb(BASE, "de", ["mirko-peters", "ca-policy"], ENTS, "Folge X", f"{BASE}/de/x/")
        self.assertEqual(bc["@type"], "BreadcrumbList"); self.assertEqual(bc["@context"], "https://schema.org")
        it = bc["itemListElement"]
        self.assertEqual([x["position"] for x in it], list(range(1, len(it) + 1)))
        self.assertEqual(names(bc), ["M365.FM", "Microsoft Entra", "Microsoft Entra ID", "Conditional Access", "Conditional Access policy", "Folge X"])
        self.assertEqual([x["item"] for x in it], [f"{BASE}/", f"{BASE}/de/entity/microsoft-entra/", f"{BASE}/de/entity/entra-id/", f"{BASE}/de/entity/conditional-access/",
                                                   f"{BASE}/de/entity/ca-policy/", f"{BASE}/de/x/"])
        self.assertEqual(len({x["item"] for x in it}), len(it))
        self.assertTrue(all(x["item"].startswith("https://") for x in it))
        en = TC.breadcrumb(BASE, "en", ["sharepoint"], ENTS, "Post", f"{BASE}/p/")
        self.assertEqual([x["item"] for x in en["itemListElement"]][1:3], [f"{BASE}/entity/collaboration-tool/", f"{BASE}/entity/microsoft-365/"])

    def test_language_url_only_where_entity_page_is_indexed(self):
        """Zwischenglieder: Sprachfassung der Entitaetsseite nur, wenn sie in der Sprache auf index steht, sonst die englische Seite (x-default)."""
        with _idx("entra-id", "conditional-access"):   # nur diese beiden haben eine indexierte de-Seite
            de = [x["item"] for x in TC.breadcrumb(BASE, "de", ["ca-policy"], ENTS, "Folge X", f"{BASE}/de/x/")["itemListElement"]]
            fr = [x["item"] for x in TC.breadcrumb(BASE, "fr", ["ca-policy"], ENTS, "Episode X", f"{BASE}/fr/x/")["itemListElement"]]
        self.assertEqual(de, [f"{BASE}/", f"{BASE}/entity/microsoft-entra/", f"{BASE}/de/entity/entra-id/", f"{BASE}/de/entity/conditional-access/", f"{BASE}/entity/ca-policy/", f"{BASE}/de/x/"])
        self.assertEqual(fr, [f"{BASE}/", f"{BASE}/entity/microsoft-entra/", f"{BASE}/entity/entra-id/", f"{BASE}/entity/conditional-access/", f"{BASE}/entity/ca-policy/", f"{BASE}/fr/x/"])   # fr ohne indexierte Entitaetsseiten
        with _idx("teams", langs=("en", "fr")):   # langer eigener fr-Text: fr-Seite steht auf index
            fr = [x["item"] for x in TC.breadcrumb(BASE, "fr", ["teams"], ENTS, "Teams FR", f"{BASE}/fr/t/")["itemListElement"]]
        self.assertEqual(fr[1:4], [f"{BASE}/entity/collaboration-tool/", f"{BASE}/entity/microsoft-365/", f"{BASE}/fr/entity/teams/"])

    def test_index_rule_is_the_entity_pages_rule(self):
        import site_entities as SE
        src = (ROOT / "site_entities.py").read_text("utf-8")
        self.assertIn("_has_de = has_de(e)", src)   # Entitaetsseite und Themen-Spur nutzen dieselbe Regel
        self.assertIn("_il = index_langs(_lx, _has_de, _thin)", src)
        e_de = dict(ENTS["sharepoint"], id="zz-de", desc={"en": "Text", "de": "Deutscher Text"})
        e_dup = dict(ENTS["sharepoint"], id="zz-dup", desc={"en": "Text", "de": "Text"})
        e_fr = dict(ENTS["sharepoint"], id="zz-fr", desc={"en": "Text", "de": ""})
        with patch.object(SE, "_TOPIC_IDX", {}), patch.object(SE, "GENTEXT", {}), patch.object(SE.FD, "has_text", lambda e, l: False), \
                patch.object(SE, "long_index_langs", lambda e: ["fr"] if e["id"] == "zz-fr" else []):
            self.assertEqual(SE.topic_index_langs(e_de), {"en", "de"})
            self.assertEqual(SE.topic_index_langs(e_dup), {"en"})   # de == en: Duplikat, kein Index
            self.assertEqual(SE.topic_index_langs(e_fr), {"en", "fr"})
            self.assertEqual(TC.crumb_url(BASE, "fr", "zz-fr", {"zz-fr": e_fr}), f"{BASE}/fr/entity/zz-fr/")
            self.assertEqual(TC.crumb_url(BASE, "fr", "zz-de", {"zz-de": e_de}), f"{BASE}/entity/zz-de/")
            self.assertEqual(TC.crumb_url(BASE, "de", "zz-de", {"zz-de": e_de}), f"{BASE}/de/entity/zz-de/")
            self.assertEqual(TC.crumb_url(BASE, "de", "zz-dup", {"zz-dup": e_dup}), f"{BASE}/entity/zz-dup/")

    def test_no_topic_no_list(self):
        self.assertIsNone(TC.breadcrumb(BASE, "en", ["mirko-peters"], ENTS, "T", f"{BASE}/t/"))
        self.assertIsNone(TC.breadcrumb(BASE, "en", ["teams"], ENTS, "", f"{BASE}/t/"))

    def test_same_entity_url_helper_as_entity_pages(self):
        src = (ROOT / "site_entities.py").read_text("utf-8")
        self.assertIn("return TC.eurl(BASE, lang, i)", src)
        self.assertEqual(TC.eurl(BASE, "en", "teams"), f"{BASE}/entity/teams/")
        self.assertEqual(TC.eurl(BASE, "fr", "teams"), f"{BASE}/fr/entity/teams/")

    def test_named_in_title(self):
        with patch.object(TC, "_IX", []):
            import site_sidebar as SBR

            class Ix:
                names = {"conditional access": "conditional-access", "microsoft teams": "teams", "jane doe": "jane-doe"}
                rx = re.compile(r"(?<![\w-])(conditional access|microsoft teams|jane doe)(?![\w-])", re.I)
            with patch.object(SBR, "Index", Ix):
                self.assertEqual(TC.named_in("Microsoft Teams and Conditional Access with Jane Doe", ENTS), ["teams", "conditional-access", "jane-doe"])
                self.assertEqual(TC.named_in("", ENTS), [])


def _g(pages, schemas):
    def page(lang, title, desc, canonical, body, alternates=None, jsonld=None, *a, **kw):
        schemas[canonical] = jsonld
        return body
    return {"BASE": BASE, "write": pages.__setitem__, "write_r2": pages.__setitem__, "page": page, "header": lambda *a: "", "footer": lambda *a: "", "footer_en": lambda: "",
            "LANGS": {}, "sitemap": [], "TODAY": "2026-11-16"}


class Rendered(unittest.TestCase):
    def test_blog_post_two_breadcrumb_lists_and_untouched_without_topics(self):
        import site_blog as BLG
        posts = [dict(id=1, handle="mirko-p", slug="ca-tips", lang="en", title="Conditional Access policy tips", summary="s", body="Text", published=1700000000, votes=0, topics=["mirko-peters", "ca-policy"]),
                 dict(id=2, handle="mirko-p", slug="ca-tips", lang="de", title="Tipps", summary="s", body="Text", published=1700000000, votes=0, topics=["mirko-peters", "ca-policy"], tr_of="en"),
                 dict(id=3, handle="mirko-p", slug="no-topic", lang="en", title="Ohne Thema", summary="s", body="Text", published=1700000001, votes=0, topics=["mirko-peters"])]
        pages, schemas = {}, {}
        posts.append(dict(posts[1], id=4, lang="fr", title="Astuces"))
        with patch.object(BLG, "ENTS", ENTS), patch.object(BLG, "COMM_LANGS", ("en", "de", "fr")), _idx(*ENTS):   # alle Themen mit indexierter de-Seite, keines in fr
            BLG.build(_g(pages, schemas), posts, [{"handle": "mirko-p", "name": "Mirko Peters"}], "")
        u = f"{BASE}/community/u/mirko-p/blog/ca-tips/"
        bcs = lists(schemas[u])
        self.assertEqual(len(bcs), 2)
        self.assertEqual(names(bcs[0]), ["M365.FM", "Mirko Peters", "Blog", "Conditional Access policy tips"])   # bestehende Spur unveraendert
        self.assertEqual(names(bcs[1]), ["M365.FM", "Microsoft Entra", "Microsoft Entra ID", "Conditional Access", "Conditional Access policy", "Conditional Access policy tips"])
        self.assertEqual(bcs[1]["itemListElement"][-1]["item"], u)
        de = lists(schemas[f"{BASE}/de/community/u/mirko-p/blog/ca-tips/"])
        self.assertEqual(len(de), 2)
        self.assertEqual(de[1]["itemListElement"][1]["item"], f"{BASE}/de/entity/microsoft-entra/")   # Entitaetsseiten der Sprache
        self.assertEqual(de[1]["itemListElement"][-1]["name"], "Tipps")
        fr = lists(schemas[f"{BASE}/fr/community/u/mirko-p/blog/ca-tips/"])
        self.assertEqual([x["item"] for x in fr[1]["itemListElement"][1:-1]], [f"{BASE}/entity/{i}/" for i in ("microsoft-entra", "entra-id", "conditional-access", "ca-policy")])   # fr-Entitaetsseiten noindex: englische Seiten
        self.assertEqual(fr[1]["itemListElement"][-1]["name"], "Astuces")
        self.assertEqual(len(lists(schemas[f"{BASE}/community/u/mirko-p/blog/no-topic/"])), 1)   # ohne Thema: nur die bisherige Spur
        self.assertNotIn("Conditional Access policy</a> ›", pages["community/u/mirko-p/blog/ca-tips/index.html"])   # nichts Sichtbares

    def test_video_page(self):
        import site_video as VID
        v = dict(handle="host", lang="en", slug="v1", title="Teams video", published=1700000000, name="Host", id=1, video_id="vid12345678", topics=["teams", "microsoft"])
        w = dict(v, slug="v2", title="No topic", topics=["microsoft"])
        pages, schemas = {}, {}
        with patch.object(VID, "ENTS", ENTS), patch.object(VID, "COMM_LANGS", ("en",)):
            VID.build(_g(pages, schemas), [v, w], [{"handle": "host"}], "")
        bcs = lists(schemas[f"{BASE}/community/video/v1/"])
        self.assertEqual(len(bcs), 1)   # Videos hatten bisher keine Brotkrumen-Spur: jetzt genau die Themen-Spur
        self.assertEqual(names(bcs[0]), ["M365.FM", "Collaboration tool", "Microsoft 365", "Microsoft Teams", "Teams video"])
        self.assertEqual(lists(schemas[f"{BASE}/community/video/v2/"]), [])

    def test_episode_builders_add_second_list(self):
        """Folgenseiten: Quelltext haengt die zweite Spur an die bestehende an (Gesamtbau ist fuer einen Test zu gross; check_schema prueft den Bau)."""
        pp = (ROOT / "site_podpage.py").read_text("utf-8")
        self.assertRegex(pp, r'nld = list\(nld\) \+ \[_bc\]\n(?:.*\n){0,4}\s+_tbc = TC\.breadcrumb\(BASE, "en", .*e\["name"\], ep_url\(e\)\)\n\s+if _tbc: nld\.append\(_tbc\)')
        gs = (ROOT / "generate_site.py").read_text("utf-8")
        self.assertIn('_tbc = TC.breadcrumb(BASE, l, _xids + TC.named_in(e["title"], LRN.ENTS), LRN.ENTS, e["title"], canonical)', gs)
        self.assertIn("if _tbc: ld.insert(2, _tbc)", gs)


if __name__ == "__main__":
    unittest.main()
