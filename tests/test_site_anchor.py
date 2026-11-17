"""Linktexte im Altbestand (site_anchor.py): allgemeine Anker -> Zieltitel, Folgenlinks, Spreaker-Unterstuetzer-URL, "Link" in Tabellen,
leere Anker, Sprachfassungen per Abgleich mit dem Original; deterministisch, idempotent, HTML bleibt intakt."""
import re
import sys
import unittest
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import site_anchor as A   # noqa: E402

B = "https://www.m365.fm"
TT = A.Titles(
    episodes={"dlp-simply-explained": {"en": "DLP – Simply Explained", "de": "DLP – einfach erklärt"},
              "new-slug": {"en": "Renamed Episode About Governance"}},
    posts={"set-up-dlp": {"en": "How to Set Up DLP in Microsoft 365: Complete Guide", "de": "DLP in Microsoft 365 einrichten: der komplette Leitfaden"}},
    renames={"old-slug": "new-slug"},
    extra={"/teams-old": "/show/episodes/dlp-simply-explained/"},
    ents={"microsoft-purview": "Microsoft Purview"},
    base=B)
POST = f"{B}/community/u/mirko-p/blog/set-up-dlp/"
EP = f"{B}/show/episodes/dlp-simply-explained/"


def a(href, text, extra=' rel="noopener"'):
    return f'<a href="{href}"{extra}>{text}</a>'


def text_of(html):
    return [A.plain(m.group(2)) for m in A._A.finditer(html)]


class Rules(unittest.TestCase):
    def fix(self, html, lang="en", ref=None):
        st = Counter()
        out = A.improve(html, lang, TT, ref=ref, stats=st)
        self.assertEqual(A.improve(out, lang, TT, ref=ref, stats=Counter()), out, "zweiter Lauf aendert nichts")
        return out, st

    def test_here_internal_post_gets_target_title(self):
        out, st = self.fix(f"<p>Details are covered {a(POST, 'here')}.</p>")
        self.assertEqual(text_of(out), ["How to Set Up DLP in Microsoft 365"])   # anchor_title: Kernthema vor dem Doppelpunkt
        self.assertEqual(st[("", "generic-post")], 1)

    def test_page_language_title(self):
        out, _ = self.fix(f"<p>Mehr dazu {a(POST, 'hier')}.</p>", "de")
        self.assertEqual(text_of(out), ["DLP in Microsoft 365 einrichten"])

    def test_listen_full_episode(self):
        out, _ = self.fix(f"<p>Be sure to {a(EP, 'Listen to the full episode')}.</p>")
        self.assertEqual(text_of(out), ["Listen to the episode: DLP – Simply Explained"])
        out, _ = self.fix(f"<p>{a(EP, 'Hören Sie sich die vollständige Folge an')}.</p>", "de")
        self.assertEqual(text_of(out), ["Folge anhören: DLP – einfach erklärt"])
        out, _ = self.fix(f"<p>Mehr dazu. <strong>{a(EP, 'Folge anhören →')}</strong></p><h3>Weiter</h3>", "de")   # Blockende nach Inline-Tag
        self.assertEqual(text_of(out), ["Folge anhören: DLP – einfach erklärt"])

    def test_listen_sentence_continues_after_link(self):
        """Geht der Satz nach dem Link weiter, bleibt der sichtbare Text (sonst "..., Folge anhören: X des Podcasts an"); aria-label beginnt mit ihm."""
        out, st = self.fix(f"<p>Um tiefer einzusteigen, {a(EP, 'hören Sie sich die vollständige Episode an')} und abonnieren Sie den Podcast.</p>", "de")
        self.assertEqual(text_of(out), ["hören Sie sich die vollständige Episode an"])
        self.assertIn('aria-label="hören Sie sich die vollständige Episode an: DLP – einfach erklärt"', out)
        self.assertEqual(st[("", "listen-episode-aria")], 1)
        h = f"<p>Mehr dazu, {a(EP, 'Listen to the full episode')} of the M365 FM Podcast.</p>"
        out, _ = self.fix(h)
        self.assertEqual(text_of(out), ["Listen to the full episode"])
        self.assertIn('aria-label="Listen to the full episode: DLP – Simply Explained"', out)
        # Satzanfang ohne "an": keine Wortlisten-Form mehr; ohne Abgleich bleibt er ganz unveraendert
        h = f"<p>Um einzusteigen, {a(EP, 'hören Sie sich die vollständige Folge')} des M365 FM Podcasts an.</p>"
        self.assertIsNone(A.classify("hören Sie sich die vollständige Folge", "de"))
        self.assertEqual(self.fix(h, "de")[0], h)
        en = f"<p>To dive deeper, {a(EP, 'Listen to the full episode')} of the M365 FM Podcast.</p>"
        out, _ = self.fix(h, "de", ref=en)   # Abgleich mit dem Original: als Folgenlink erkannt, Text bleibt
        self.assertEqual(text_of(out), ["hören Sie sich die vollständige Folge"])
        self.assertIn('aria-label="hören Sie sich die vollständige Folge: DLP – einfach erklärt"', out)

    def test_listen_japanese_te_form_and_continuation(self):
        jt = A.Titles(episodes={"dlp-simply-explained": {"en": "DLP – Simply Explained", "ja": "DLP – わかりやすく解説"}}, base=B)
        for h in (f"<p>ぜひ{a(EP, 'エピソード全編を聴いて')}ください。</p>", f"<p>ポッドキャストの{a(EP, 'エピソード全編を聴いて')}、購読してください。</p>",
                  f"<p>ポッドキャストの{a(EP, 'エピソード全編を聴く')}をご覧ください。</p>"):
            st = Counter()
            out = A.improve(h, "ja", jt, stats=st)
            self.assertEqual(A.improve(out, "ja", jt, stats=Counter()), out)
            self.assertEqual(text_of(out), text_of(h), h)
            self.assertIn(": DLP – わかりやすく解説\"", out)
        out = A.improve(f"<p>{a(EP, 'エピソードを聴く →')}</p>", "ja", jt, stats=Counter())
        self.assertEqual(text_of(out), ["エピソードを聴く: DLP – わかりやすく解説"])

    def test_old_podpage_addresses_resolve(self):
        for href in (f"{B}/old-slug/", "https://m365.fm/m365-fm-podcast/old-slug", "/show/episodes/old-slug/"):
            out, _ = self.fix(f"<p>{a(href, 'this episode')}</p>")
            self.assertEqual(text_of(out), ["Renamed Episode About Governance"], href)
        out, _ = self.fix(f"<p>{a(B + '/teams-old/', 'here')}</p>")   # data/redirects_extra.json
        self.assertEqual(text_of(out), ["DLP – Simply Explained"])
        out, _ = self.fix(f"<p>{a(B + '/blog/set-up-dlp/', 'this guide')}</p>")
        self.assertEqual(text_of(out), ["How to Set Up DLP in Microsoft 365"])
        out, _ = self.fix(f"<p>{a(B + '/entity/microsoft-purview/', 'learn more')}</p>")
        self.assertEqual(text_of(out), ["Microsoft Purview"])

    def test_placeholder_translation_title_falls_back_to_english(self):
        t = A.Titles(episodes={"x": {"en": "Dynamics 365 Virtual Entities", "ja": "..."}}, base=B)
        out = A.improve(f"<p>{a(B + '/show/episodes/x/', 'こちら')}</p>", "ja", t, stats=Counter())
        self.assertEqual(text_of(out), ["Dynamics 365 Virtual Entities"])

    def test_external_generic_gets_domain(self):
        out, st = self.fix(f"<p>{a('https://www.amazon.com/dp/B0?tag=x&amp;y=1', 'Learn more')}</p>")
        self.assertEqual(text_of(out), ["amazon.com"])
        self.assertEqual(st[("", "external-domain")], 1)

    def test_spreaker_supporter_url(self):
        u = "https://www.spreaker.com/podcast/m365-fm--6704921/support?utm_source=rss&amp;utm_medium=rss"
        h = f"<p>Become a supporter of this podcast: {a(u, 'https://www.spreaker.com/podcast/m365-fm--6704921/support', ' rel=\"noopener\" target=\"_blank\"')}.</p>"
        self.assertEqual(text_of(self.fix(h)[0]), ["Support M365.FM on Spreaker"])
        self.assertEqual(text_of(self.fix(h, "de")[0]), ["M365.FM auf Spreaker unterstützen"])
        out = self.fix(h, "ja")[0]
        self.assertIn('href="' + u + '"', out)   # Ziel unveraendert

    def test_link_in_table_row_gets_first_cell(self):
        h = ("<table><tbody><tr>\n<td>Power Platform Courses</td>\n<td>" + a("https://www.learningtree.com/courses/pp/", "Link") + "</td>\n</tr>"
             "<tr><td>Certifications</td><td>" + a("https://www.learningtree.com/cert/", "<strong>Link</strong>") + "</td></tr></tbody></table>")
        out, st = self.fix(h)
        self.assertEqual(text_of(out), ["Power Platform Courses", "Certifications"])
        self.assertIn("<strong>Certifications</strong>", out)   # Formatierung im Anker bleibt
        self.assertEqual(st[("", "table-row")], 2)

    def table(self, rows, lang="en"):
        h = "<table><tbody>" + "".join(f"<tr><td>{c1}</td><td>{c2}</td></tr>" for c1, c2 in rows) + "</tbody></table>"
        return text_of(self.fix(h, lang)[0])

    def test_table_row_only_for_link_word(self):
        """'Source'/'Learn more' in einer Tabelle: normale Regel (Domain), nicht die erste Zelle."""
        u = "https://www.sherweb.com/blog/x/"
        self.assertEqual(self.table([("Provides insights", a(u, "Source")), ("Official", a("https://learn.microsoft.com/x", "Learn more"))]),
                         ["sherweb.com", "learn.microsoft.com"])
        self.assertEqual(self.table([("Azure Monitor", a(u, "Links"))]), ["Azure Monitor"])
        self.assertEqual(self.table([("Kurse", a(u, "Link"))], "de"), ["Kurse"])
        self.assertEqual(self.table([("Cours", a(u, "lien"))], "fr"), ["Cours"])

    def test_table_row_long_first_cell(self):
        long = "Provides deep, machine learning-powered insights into cost anomalies across all subscriptions"
        self.assertEqual(self.table([(long, a("https://www.vertexcs.com/x", "Link"))]), ["vertexcs.com"])
        self.assertEqual(self.table([("Use it. It works", a("https://www.vertexcs.com/x", "Link"))]), ["vertexcs.com"])   # Satz

    def test_table_row_date_or_year_first_cell(self):
        tc = "https://techcommunity.microsoft.com/blog/"
        self.assertEqual(self.table([("Feb 25 2026", a(tc + "a", "Link")), ("Feb 25 2026", a(tc + "b", "Link"))]),
                         ["techcommunity.microsoft.com"] * 2)
        for c in ("Dalenius (1977)", "2026-02-25", "25.02.2026", "2024", "2026年3月3日"):
            self.assertEqual(self.table([(c, a(tc + "a", "Link"))]), ["techcommunity.microsoft.com"], c)
        self.assertEqual(self.table([("Windows 11", a(tc + "a", "Link"))]), ["Windows 11"])   # Produktname mit Zahl bleibt tauglich

    def test_table_row_first_cell_unique_in_table(self):
        tc = "https://techcommunity.microsoft.com/blog/"
        self.assertEqual(self.table([("Copilot", a(tc + "a", "Link")), ("Copilot", a(tc + "b", "Link")), ("Purview", a(tc + "c", "Link"))]),
                         ["techcommunity.microsoft.com", "techcommunity.microsoft.com", "Purview"])

    def test_empty_and_image_only_anchor_get_aria_label(self):
        img = '<img src="https://img.m365.fm/x.webp" alt="" loading="lazy">'
        out, st = self.fix(f"<p>{a('https://www.amazon.com/dp/B0', img)}{a(POST, '')}</p>")
        self.assertIn('aria-label="amazon.com"', out)
        self.assertIn('aria-label="How to Set Up DLP in Microsoft 365"', out)
        self.assertIn(img, out)
        self.assertEqual(st[("", "aria-label")], 2)
        named = a("https://www.amazon.com/dp/B0", '<img src="https://img.m365.fm/x.webp" alt="NVIDIA DGX Spark">')
        self.assertEqual(self.fix(named)[0], named)   # Bild mit Alt-Text: der Link hat schon einen Namen

    def test_descriptive_and_home_links_stay(self):
        h = (f"<p>{a(B + '/', 'M365 FM')} · {a(POST, 'Microsoft Purview audit')} · {a(EP, 'this Teams governance guide')} "
             f"· {a('https://learn.microsoft.com/', 'Microsoft Learn')} · {a('#top', 'here')} · {a('mailto:x@example.com', 'here')}</p>")
        self.assertEqual(self.fix(h)[0], h)

    def test_unknown_internal_target_stays(self):
        h = f"<p>{a(B + '/some-unknown-page/', 'here')}</p>"
        out, st = self.fix(h)
        self.assertEqual(out, h)
        self.assertEqual(st[("", "unresolved-internal")], 1)

    def test_home_generic(self):
        self.assertEqual(text_of(self.fix(f"<p>{a(B + '/', 'here')}</p>")[0]), ["M365.FM"])

    def test_inline_markup_and_entities(self):
        h = f'<p>See <a href="{POST}" rel="noopener"><em>this</em> <strong>guide</strong></a> &amp; more.</p>'
        out, _ = self.fix(h)
        self.assertEqual(out, f'<p>See <a href="{POST}" rel="noopener"><em>How to Set Up DLP in Microsoft 365</em> <strong></strong></a> &amp; more.</p>')
        t = A.Titles(posts={"x": {"en": "Q&A for \"Copilot\" admins <3"}}, base=B)
        out = A.improve(f"<p>{a(B + '/blog/x/', 'here')}</p>", "en", t)
        self.assertIn(">Q&amp;A for \"Copilot\" admins &lt;3</a>", out)

    def test_translation_aligned_with_original(self):
        en = f"<p>{a(EP, 'Listen to the full episode')} and {a(POST, 'here')} and {a(POST, 'here')}</p>"
        de = f"<p>Mehr in der {a(EP, 'vollständigen Episode')}, {a(POST, 'ausführlich')} und {a(POST, 'Tipps zum Organisieren von Projekten in Teams')}</p>"
        out, _ = self.fix(de, "de", ref=en)
        # Satz geht weiter bzw. Original "here" (Uebersetzung oft Verb/Adverb): Text bleibt, aria-label; langer, schon beschreibender Anker bleibt ganz
        self.assertEqual(text_of(out), ["vollständigen Episode", "ausführlich", "Tipps zum Organisieren von Projekten in Teams"])
        self.assertIn('aria-label="vollständigen Episode: DLP – einfach erklärt"', out)
        self.assertIn('aria-label="ausführlich: DLP in Microsoft 365 einrichten"', out)
        self.assertEqual(out.count("aria-label"), 2)
        en = f"<p>As described on {a(POST, 'this page')}, see {a(POST, 'here')} for details.</p>"
        de = f"<p>Wie {a(POST, 'auf dieser Seite')} beschrieben, die wir {a(POST, 'hier ausführlich erklären')}.</p>"
        out, _ = self.fix(de, "de", ref=en)   # Nominalgruppe -> Zieltitel; Verbgruppe -> Text bleibt
        self.assertEqual(text_of(out), ["DLP in Microsoft 365 einrichten", "hier ausführlich erklären"])
        self.assertIn('aria-label="hier ausführlich erklären: DLP in Microsoft 365 einrichten"', out)
        ko = f"<p>{a(POST, '여기')}</p>"
        self.assertEqual(text_of(self.fix(ko, "ko", ref=f"<p>{a(POST, 'here')}</p>")[0]), ["How to Set Up DLP in Microsoft 365"])   # ohne Sprachfassung des Ziels: Englisch

    def test_translation_not_aligned_uses_word_list(self):
        en = f"<p>{a(POST, 'here')}</p>"
        fr = f"<p>{a(EP, 'ici')} {a(POST, 'cet article')}</p>"   # andere Ankerliste -> Wortliste der Sprache
        self.assertEqual(text_of(self.fix(fr, "fr", ref=en)[0]), ["DLP – Simply Explained", "How to Set Up DLP in Microsoft 365"])

    def test_html_structure_kept(self):
        h = (f'<h2>Intro</h2><p>One {a(POST, "here")} two {a("https://x.example.org/a", "read more")}</p>'
             f'<ul><li>{a(EP, "Listen to the episode →")}</li></ul><pre>&lt;a href="/"&gt;here&lt;/a&gt;</pre>')
        out, _ = self.fix(h)
        self.assertEqual(re.findall(r"</?[a-z0-9]+", out), re.findall(r"</?[a-z0-9]+", h))
        self.assertIn('<pre>&lt;a href="/"&gt;here&lt;/a&gt;</pre>', out)

    def test_weak_counts_before_and_after(self):
        h = (f"<p>{a(POST, 'here')} {a(EP, 'Listen to the full episode')} {a(B + '/nowhere/', 'here')} "
             f"{a('https://www.spreaker.com/podcast/x--1/support', 'https://www.spreaker.com/podcast/x--1/support')}</p>")
        before = A.weak(h, "en", TT)
        self.assertEqual(sum(before.values()), 4)
        after = A.weak(A.improve(h, "en", TT, stats=Counter()), "en", TT)
        self.assertEqual(dict(after), {"unresolved-internal": 1})

    def test_deterministic(self):
        h = f"<p>{a(POST, 'here')} {a(EP, 'this guide')} {a('https://example.com/x', 'link')}</p>"
        self.assertEqual(A.improve(h, "en", TT, stats=Counter()), A.improve(h, "en", TT, stats=Counter()))

    def test_every_language_has_labels_and_lists(self):
        for l in A.LANGS:
            self.assertIn(l, A.LISTEN_LABEL); self.assertIn(l, A.SUPPORT_LABEL)
            self.assertTrue(A.GENERIC.get(l)); self.assertTrue(A.LISTEN.get(l))
            self.assertIsNone(A.classify(A.LISTEN_LABEL[l] + ": DLP", l))   # eigene Ausgabe ist nie wieder "allgemein"
            self.assertIsNone(A.classify(A.SUPPORT_LABEL[l], l))
        self.assertEqual(A.classify("Hier", "de"), "generic")
        self.assertEqual(A.classify("Listen to the episode →", "en"), "listen")
        self.assertEqual(A.classify("écoutez l’épisode complet", "fr"), "listen")


class LegacyBlogHook(unittest.TestCase):
    def test_only_legacy_posts_of_mirko(self):
        import site_legacy_blog as LBL
        LBL.EN_HTML["__t__"] = "<p>x</p>"
        LBL._TT[:] = [TT]
        try:
            h = f"<p>{a(POST, 'here')}</p>"
            self.assertEqual(text_of(LBL.better_links({"handle": "mirko-p", "slug": "__t__"}, h, "en")), ["How to Set Up DLP in Microsoft 365"])
            self.assertEqual(LBL.better_links({"handle": "someone", "slug": "__t__"}, h, "en"), h)   # andere Autoren: unveraendert
            self.assertEqual(LBL.better_links({"handle": "mirko-p", "slug": "db-post"}, h, "en"), h)   # kein frueherer Beitrag
        finally:
            LBL.EN_HTML.pop("__t__", None); LBL._TT[:] = []

    def test_source_hash_unchanged(self):
        """Die Uebersetzungs-Einheiten haengen nur an der Quelle: der Linktext-Durchlauf laeuft auf dem fertigen HTML, source_of sieht weiter "here"."""
        import translate_blog as TB
        p = {"slug": "x", "title": "T", "desc": "", "faq": [], "html": f"<p>Read {a(POST, 'here')} now.</p>"}
        h0 = TB.source_of(p)[2]
        A.improve(TB.source_of(p)[0], "en", TT, stats=Counter())
        self.assertEqual(TB.source_of(p)[2], h0)
        self.assertIn("here", "".join(t for _, t in TB.source_of(p)[1]))


if __name__ == "__main__":
    unittest.main()
