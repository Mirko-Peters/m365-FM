"""Folgen-Cover: sichtbare <img> laden kleine Spreaker-Varianten (t_square_limited_160/320/480), JSON-LD, og:image und Feeds behalten das Original."""
import json, re, unittest
from pathlib import Path

import site_spreaker_img as SPI
import site_podpage as P
import site_listen as L

ROOT = Path(__file__).resolve().parent.parent
ORIG = "https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/88f2e9a1966813ed8b210aa8fde48d17.jpg"
V = lambda n: f"https://d3wo5wojvuv7l.cloudfront.net/t_square_limited_{n}/images.spreaker.com/original/88f2e9a1966813ed8b210aa8fde48d17.jpg"
OTHER = ("https://img.m365.fm/blog/a.webp", "https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg", "https://d3t3ozftmdmh3i.cloudfront.net/cover.jpg",
         "https://d3wo5wojvuv7l.cloudfront.net/images.spreaker.com/original/x.jpg", "")


class Variant(unittest.TestCase):
    def test_rewrites_transform_segment(self):
        self.assertTrue(SPI.is_spreaker(ORIG))
        for n in (160, 320, 480, 720): self.assertEqual(SPI.variant(ORIG, n), V(n))
        self.assertEqual(SPI.variant(V(720), 160), V(160))   # jedes Segment, nicht nur _1400

    def test_unknown_size_and_other_hosts_unchanged(self):
        self.assertEqual(SPI.variant(ORIG, 200), ORIG)   # t_square_limited_200 liefert bei Spreaker 400
        for u in OTHER:
            self.assertFalse(SPI.is_spreaker(u), u)
            self.assertEqual(SPI.variant(u, 320), u)
            self.assertEqual(SPI.src_attrs(u, 160), f'src="{u}"')
            self.assertEqual(SPI.srcset_only(u, "640px"), "")

    def test_header_160(self):
        a = SPI.src_attrs(ORIG, 160)
        self.assertTrue(a.startswith(f'src="{V(320)}"'), a)
        self.assertIn(f'srcset="{V(160)} 160w, {V(320)} 320w, {V(480)} 480w" sizes="160px"', a)
        self.assertNotIn("1400", a)

    def test_list_96_and_mini_48(self):
        self.assertEqual(SPI.src_attrs(ORIG, 96), f'src="{V(160)}" srcset="{V(160)} 160w, {V(320)} 320w" sizes="96px"')
        self.assertEqual(SPI.src_attrs(ORIG, 48), f'src="{V(160)}"')

    def test_srcset_only_keeps_original_as_largest(self):
        s = SPI.srcset_only(ORIG, "(max-width: 680px) 100vw, 640px")
        self.assertEqual(s, f' srcset="{V(480)} 480w, {V(720)} 720w, {ORIG} 1400w" sizes="(max-width: 680px) 100vw, 640px"')


class Pages(unittest.TestCase):
    def test_legacy_blog_hero_src_stays_original(self):
        """Titelbild alter Blogbeitraege: srcset mit kleinen Varianten, src (= Beitragsbild fuer og/JSON-LD, "images") bleibt das Original."""
        src = (ROOT / "site_legacy_blog.py").read_text("utf-8")
        self.assertIn('<img src="{P.esc(_u)}"{SPI.srcset_only(_u, ', src)
        h = f'<img src="{ORIG}"{SPI.srcset_only(ORIG, "640px")} alt="Cover" width="640" height="360">'
        self.assertEqual(re.findall(r'<img[^>]+src="(https://[^"]+)"', h), [ORIG])   # dieselbe Regel wie site_legacy_blog ("images")

    def test_thumb_of_stays_original(self):
        """JSON-LD (PodcastEpisode.image), Register und Feeds lesen thumb_of: das Original in voller Groesse."""
        self.assertEqual(P.thumb_of({"image_path": ORIG}), ORIG)

    def test_podpage_wiring(self):
        src = (ROOT / "site_podpage.py").read_text("utf-8")
        self.assertIn("SPI.src_attrs(u, size)", src)   # img_tag: kleine Variante
        self.assertIn('fetchpriority="high" \' if eager', src)   # Folgenkopf: nicht lazy, hohe Prioritaet
        self.assertIn('**({"image": thumb_of(e, nrec)} if thumb_of(e, nrec) else {})', src)   # JSON-LD: Original
        self.assertEqual(src.count('**({"extra_head": _pc} if _pc else {})'), 1)   # Sprachfassungen: preconnect
        self.assertIn("head=_pc)", src)   # englische Folgenseite: preconnect

    def test_listen_card_small_cover(self):
        it = {"title": "T", "hook": "", "minutes": 3, "cover": ORIG, "page": "https://www.m365.fm/show/episodes/t/"}
        h = L.card_html("en", it, "1")
        self.assertIn(f'<img class="ls-cover" src="{V(160)}" srcset="{V(160)} 160w, {V(320)} 320w" sizes="96px" alt="" width="96" height="96" loading="lazy"', h)
        self.assertNotIn("1400", h)
        self.assertIn(f'src="{V(160)}" alt="" width="48" height="48"', L.card_html("en", it, "1", compact=True))

    def test_page_head_og_and_jsonld_keep_original(self):
        import generate_site as G
        url = "https://www.m365.fm/show/episodes/x/"
        body = f'<main><h1>X</h1><img {SPI.src_attrs(ORIG, 160)} alt="X" width="160" height="160" fetchpriority="high"></main><footer></footer>'
        ld = {"@context": "https://schema.org", "@type": "PodcastEpisode", "name": "X", "url": url, "image": ORIG}
        h = G.page("en", "X – M365.FM Podcast", "Beschreibung", url, body, None, [ld], xdefault=url, og_type="article", extra_head=SPI.PRECONNECT)
        head = h.split("</head>")[0]
        self.assertIn('<link rel="preconnect" href="https://d3wo5wojvuv7l.cloudfront.net">', head)
        og = re.search(r'<meta property="og:image" content="([^"]+)"', head).group(1)
        self.assertNotIn("t_square_limited", og)
        lds = [json.loads(m) for m in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S)]
        self.assertIn(ORIG, [x.get("image") for x in lds if isinstance(x, dict)])
        self.assertFalse(any("t_square_limited" in json.dumps(x) for x in lds))
        self.assertIn(f'src="{V(320)}"', h)


if __name__ == "__main__":
    unittest.main()
