"""Die frueheren Podpage-Blogbeitraege (data/podpage/blog_posts.json.gz) als Community-Beitraege von mirko-p.
Sie werden von site_blog.build wie echte Community-Beitraege ausgegeben (URL /community/u/mirko-p/blog/<slug>/, Autorenzeile, Verzeichnisse, RSS),
bleiben aber statisch (HTML mit Tabellen und Bildern bleibt vollstaendig erhalten; kein Datenbank-Eintrag, kein Laengenlimit des Wiki-Markups)."""
import ast, json, re, zlib
from datetime import datetime, timezone

import site_index_rule as IR   # Index-Regel "ab 2500 Zeichen eigener Text" (13.11.2026)
import site_media as MED
import site_podpage as P
import site_r2 as R2
import site_spreaker_img as SPI   # Titelbild: kleinere Spreaker-Varianten per srcset (src bleibt das Original, es ist das Beitragsbild)
import site_sidebar as SBR
import site_topics as TOP

HANDLE, NAME = "mirko-p", "Mirko Peters"   # echtes Community-Profil von Mirko
TOPICS = {}   # Slug -> Themen der frueheren Beitraege (auch fuer die schon in der Datenbank liegenden Fassungen, deren Themen beim Import eingefroren wurden)


def _ts(s):
    try:
        return int(datetime.fromisoformat((s or "").replace("Z", "+00:00")).astimezone(timezone.utc).timestamp())
    except Exception:
        return 0


def _faq(raw):
    if isinstance(raw, str):
        try: raw = ast.literal_eval(raw)
        except Exception: return []
    out = []
    for q in raw or []:
        a = ((q.get("acceptedAnswer") or {}).get("text") or "").strip(); n = (q.get("name") or "").strip()
        if n and a: out.append({"q": n, "a": a})
    return out


def url_of(BASE, slug):
    return f"{BASE}/community/u/{HANDLE}/blog/{slug}/"


def tr_config():
    """data/blog_tr.json: build = Sprachen, die als Seiten entstehen; index = davon freigegebene (index + Sitemap + hreflang)."""
    import json
    from pathlib import Path
    f = Path(__file__).parent / "data" / "blog_tr.json"
    try:
        c = json.loads(f.read_text("utf-8")) if f.exists() else {}
    except Exception:
        c = {}
    from site_i18n import only
    build = only([l for l in (c.get("build") or []) if l != "en"])   # SITE_LANGS: verkleinerter Bau
    return build, [l for l in (c.get("index") or []) if l in build]


_EPT = {}   # Sprache -> {Folgen-Slug: [Titel, Zusammenfassung]}
_HERO_EP = {}   # Beitrags-Slug -> Folge, deren Cover das Titelbild ist (items())


def ep_title(lang, ep):
    """Folgentitel in der Sprache lang (data/podpage_i18n/<lang>.json mit den Handtexten der Redaktion, wie die Folgenseiten), sonst der englische Titel."""
    if not ep:
        return ""
    if lang != "en" and lang not in _EPT:
        from pathlib import Path
        f = Path(__file__).parent / "data" / "podpage_i18n" / f"{lang}.json"
        try:
            import i18n_overrides as _OV
            _EPT[lang] = _OV.apply_show(lang, json.loads(f.read_text("utf-8"))) if f.exists() else {}
        except Exception:
            _EPT[lang] = {}
    t = ((_EPT.get(lang) or {}).get(ep.get("slug")) or [""])[0] if lang != "en" else ""
    return t or ep.get("name") or ""


def hero_html(lang, slug, title, ep):
    """Titelbild eines frueheren Beitrags ohne eigenes Bild: Cover der verlinkten Folge (Alt "Cover: {Folgentitel}" in der Seitensprache), sonst das
    erzeugte SVG mit dem Beitragstitel (aria-label "Titelbild: {Titel}" in der Seitensprache). title ist der Beitragstitel in dieser Sprache."""
    from site_i18n import T
    _u = (ep or {}).get("image_path") or ""
    if _u.startswith("https://") and "None" not in _u and ep:
        alt = T(lang, "Cover: {t}", "Cover: {t}").replace("{t}", ep_title(lang, ep))
        return (f'<figure style="margin:1em 0"><img src="{P.esc(_u)}"{SPI.srcset_only(_u, "(max-width: 680px) 100vw, 640px")} alt="{P.esc(alt)}" width="640" height="360" fetchpriority="high" decoding="async" style="width:100%;max-width:640px;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:8px"></figure>')
    return MED.hero_svg({"id": "blog-" + slug, "name": title, "type": "media"}, "Blog", T(lang, "Cover image: {t}", "Titelbild: {t}").replace("{t}", title))   # hero_svg bringt sein eigenes <figure> mit


def translations(BASE, posts_by_slug, fixhtml):
    """Sprachfassungen der frueheren Beitraege aus data/blog_i18n (translate_blog.assemble: nur vollstaendige, zum Original passende Fassungen).
    Jede Fassung ist ein Beitrag in der Zielsprache mit tr_of='en' und derselben URL-Struktur unter /<lang>/."""
    build, index = tr_config()
    if not build:
        return []
    import translate_blog as TB
    out = []
    for lang in build:
        import site_i18n_overrides as OVR
        data = TB.load_lang(lang); n = 0   # Handtexte der Redaktion legt nur TB.assemble(..., lang) darueber (i18n_overrides); OVR liefert der Redaktion nur zu
        for slug, p in posts_by_slug.items():
            OVR.note_blog(lang, slug, p["src"], data.get(slug))
            r = TB.assemble(p["src"], data.get(slug), lang)
            if not r: continue
            title, desc, html, faq = r
            html = fixhtml(html)
            if not re.search(r"<img\b", html) and p.get("hero"): html = hero_html(lang, slug, title, _HERO_EP.get(slug)) + html   # Alt-Texte: Titelbild mit Alt-Text und Titel in der Sprache der Fassung (nicht das englische)
            out.append({**{k: v for k, v in p.items() if k not in ("src", "hero")}, "lang": lang, "title": title, "summary": (desc or "")[:400], "html": html, "faq": [{"q": q["name"], "a": q["acceptedAnswer"]["text"]} for q in faq if q.get("name")],
                        "images": re.findall(r'<img[^>]+src="(https://[^"]+)"', html), "tr_of": "en", "ai_tr": True, "tr_index": IR.index_or_long(lang in index, desc, html)}); n += 1   # 13.11.2026: auch eine nicht freigegebene Sprache steht auf index, wenn der uebersetzte Text >= 2500 Zeichen hat (assemble liefert nur vollstaendige Fassungen, kein Englisch-Rueckfall)
        print(f"Blog-Uebersetzungen {lang}: {n} Beitraege{' (index)' if lang in index else ' (noindex, ausser Fassungen ab 2500 Zeichen)'}")
    return out


_ROWS = {}   # BASE -> Zeilen fuer publish(): die englischen Originale, als Kopie gesichert, bevor Aufrufer die Beitraege veraendern


def _rows(its):
    rows = [{"slug": p["slug"], "title": p["title"], "summary": p["summary"], "html": p["html"], "topics": p["topics"], "faq": p["faq"], "published": p["published"], "updated": p["updated"]} for p in its if not p.get("tr_of")]   # nur die englischen Originale (Sprachfassungen liegen im R2-Bucket, nicht im Import)
    return json.loads(json.dumps(rows, ensure_ascii=False))


def items(BASE):
    posts = [p for p in P.load("blog_posts") if p.get("title") and p.get("html")]
    eslug = {e["slug"] for e in P.load("episodes") if e.get("published") not in (False, "False") and e.get("hidden") not in (True, "True")}
    eps_by_slug = {e["slug"]: e for e in P.load("episodes") if e["slug"] in eslug}
    bslug = {p["slug"] for p in posts}
    ix = SBR.Index()

    def fix(h):
        def rep(m):
            path = re.sub(r"^https?://(www\.)?m365\.fm", "", m.group(1))
            if not path.startswith("/") or path.startswith("//"): return m.group(0)
            seg = path.strip("/").split("#")[0]; seg = P.RENAMES.get(seg, seg)   # T12: alte Podpage-Adresse einer umbenannten Folge
            if seg in eslug: return f'href="{BASE}/show/episodes/{seg}/"'
            if seg.startswith("blog/") and seg[5:] in bslug: return f'href="{url_of(BASE, seg[5:])}"'
            if seg == "blog": return f'href="{BASE}/community/u/{HANDLE}/blog/"'
            return m.group(0)
        return R2.drop_dead(re.sub(r'href="([^"]+)"', rep, h))   # dauerhaft fehlende Bilder (data/r2_dead.json) gar nicht erst ausgeben: kein kaputtes <img>, nicht in "images" (JSON-LD), Titelbild greift

    out = []
    for p in sorted(posts, key=lambda x: x.get("iso") or "", reverse=True):
        html = fix(P.san(p["html"]))
        text = P.plain(html); _hero = ""
        _ep = None
        if not re.search(r"<img\b", html):   # Titelbild wie frueher: Bild der verlinkten Folge, sonst erzeugtes Bild
            _ep = next((eps_by_slug[m] for m in re.findall(r'/show/episodes/([^/"]+)/', html) if m in eps_by_slug), None)
            _hero = hero_html("en", p["slug"], p["title"], _ep)
            html = _hero + html
        topics = TOP.score_topics(ix, p["title"], text, key=p["slug"]); TOPICS[p["slug"]] = topics   # gewichtete Zuordnung (site_topics), gecacht je Beitrag
        pub = _ts(p.get("iso")); upd = _ts(p.get("modified")) or pub
        out.append({"id": 900_000_000 + zlib.crc32(p["slug"].encode()) % 90_000_000, "handle": HANDLE, "name": NAME, "slug": p["slug"], "title": p["title"], "summary": (p.get("desc") or "")[:400],
                    "body": "", "html": html, "lang": "en", "topics": topics, "keypoints": [], "faq": _faq(p.get("faq")), "published": pub, "created": pub, "updated": upd, "votes": 0,
                    "coauthors": [], "legacy": True, "images": re.findall(r'<img[^>]+src="(https://[^"]+)"', html), "src": p, "hero": _hero})
        _HERO_EP[p["slug"]] = _ep   # Folge des Titelbilds: die Sprachfassungen setzen Alt-Text und Folgentitel in ihrer Sprache
    TOP.save()
    by_slug = {x["slug"]: x for x in out}
    out += translations(BASE, by_slug, fix)
    for x in out: x.pop("src", None); x.pop("hero", None)
    _ROWS[BASE] = _rows(out)
    return out


PER = 100


def publish(write, BASE):
    """Dateien fuer den Worker (worker/src/legacyblog.js): SITE/blog-import/index.json und part-N.json. Nur solange data/blog_import.json "enabled": true ist."""
    import json
    from pathlib import Path
    cfg = Path(__file__).parent / "data" / "blog_import.json"
    if not cfg.exists() or not json.loads(cfg.read_text("utf-8")).get("enabled"):
        return 0
    rows = _ROWS.pop(BASE, None)   # Stand aus items() dieses Baus (vorher lief items() hier ein zweites Mal komplett, mit allen Sprachfassungen)
    if rows is None:
        items(BASE); rows = _ROWS.pop(BASE)
    for i in range(0, len(rows), PER):
        write(f"blog-import/part-{i // PER + 1}.json", R2.rewrite(json.dumps(rows[i:i + PER], ensure_ascii=False, separators=(",", ":"))))
    write("blog-import/index.json", json.dumps({"total": len(rows), "per": PER}))
    return len(rows)
