"""Uebersicht der Uebersetzungen fuer die Verwaltung (/admin/ -> Uebersetzungen): translation-status.json mit einer Zeile je Inhalt und den vorhandenen Sprachfassungen.
Arten (k):
  lblog    alle Blogartikel, die translate_blog.py uebersetzt (data/podpage/blog_posts.json.gz plus freigegebene Content-Pakete, Schluessel content/<slug>); Stand je Sprache
           aus data/blog_i18n/<lang>/*.json.gz (ok-Flag je Slug) = die Zahlen in data/blog_i18n/status.json. Vormerken: Workflow translate-blog (queue=true).
  notes    Show Notes der Hauptshow (data/podpage_i18n/notes_<l>.json). Vormerken: Workflow translate-notes.
  entity   Kurz-/Langtext der Entitaeten (ohne Personen). Vorhanden = Deutsch aus entities.json plus alle Sprachen aus data/entity_fill/i18n/<lang>.json (fill_entities.py);
           was in der Datenbank (ent_tr) steht, ergaenzt der Worker. Vormerken: Worker (Haiku).
  article  englische Video-Artikel (data/articles/<VIDEO>.json, generate_articles.py) mit ihren Sprachfassungen (article_tr.py); fl = Sprachen, die nach MAX_TRIES gesperrt sind
           (data/articles_tr_state.json). Vormerken: nicht moeglich (der Abarbeiter kennt die Art nicht, article_tr.py laeuft als eigener Batch-Job).
Community-Inhalte (Blog, Podcast, Video) liefert der Worker direkt aus der Datenbank (Arten blog, podcast, video)."""
import glob, gzip, json, os
from pathlib import Path

ROOT = Path(__file__).parent
LANGS = ["de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"]
TITLE_MAX = 90   # Titel in der Liste gekuerzt: die Datei soll klein bleiben (Ziel unter ~1,5 MB)


def _cache():
    return ROOT / "data" / "cache" / "blog_i18n_done.json"


def blog_done():
    """Je Sprache die Slugs mit vollstaendiger Uebersetzung; die gz-Dateien werden nur neu gelesen, wenn sie sich geaendert haben."""
    CACHE = _cache()
    try:
        cache = json.loads(CACHE.read_text("utf-8")) if CACHE.exists() else {}
    except Exception:
        cache = {}
    out, changed = {}, False
    for l in LANGS:
        d = ROOT / "data" / "blog_i18n" / l
        files = sorted(d.glob("*.json.gz")) if d.exists() else []
        sig = ",".join(f"{f.name}:{int(f.stat().st_mtime)}:{f.stat().st_size}" for f in files)
        c = cache.get(l) or {}
        if c.get("sig") == sig:
            out[l] = c.get("slugs") or []; continue
        slugs = []
        for f in files:
            try:
                for slug, rec in json.loads(gzip.open(f, "rt", encoding="utf-8").read()).items():
                    if rec and rec.get("ok"): slugs.append(slug)
            except Exception:
                pass
        out[l] = sorted(set(slugs)); cache[l] = {"sig": sig, "slugs": out[l]}; changed = True
    if changed:
        try:
            CACHE.parent.mkdir(parents=True, exist_ok=True); CACHE.write_text(json.dumps(cache, ensure_ascii=False), encoding="utf-8")
        except Exception:
            pass
    return out


def blog_sources():
    """[{slug,title}] aller Blogartikel, die translate_blog.py uebersetzt (dieselbe Liste wie data/blog_i18n/status.json "posts"): Podpage-Beitraege plus Content-Pakete.
    Ohne translate_blog (oder wenn dessen Quellen fehlen): die Podpage-Datei allein."""
    try:
        import translate_blog as TB
        return [{"slug": p["slug"], "title": p["title"]} for p in TB.posts()]
    except Exception as e:
        print("Blogartikel: translate_blog.posts() nicht lesbar, nur Podpage-Datei:", str(e)[:120])
    try:
        src = ROOT / "data" / "podpage" / "blog_posts.json.gz"
        return [{"slug": p["slug"], "title": p["title"]} for p in json.loads(gzip.open(src, "rt", encoding="utf-8").read()) if p.get("title") and p.get("html")]
    except Exception:
        return []


def blog_rows(posts=None, done=None):
    """Eine Zeile je Blogartikel: nur Slug, gekuerzter Titel und die Liste der fertigen Sprachen."""
    posts = blog_sources() if posts is None else posts
    done = blog_done() if done is None else done
    by_slug = {l: set(v) for l, v in done.items()}
    return [{"k": "lblog", "id": p["slug"], "t": p["title"][:TITLE_MAX], "lang": "en", "langs": [l for l in LANGS if p["slug"] in by_slug.get(l, ())]} for p in posts]


def entity_done():
    """{Sprache: Menge der Entitaets-IDs} mit Uebersetzung im Repo (data/entity_fill/i18n/<lang>.json: Kurz- oder Langtext da). Als veraltet gemeldete (stale.json:
    englische Quelle seit dem Uebersetzen geaendert) werden auf den Seiten nicht gezeigt und zaehlen deshalb nicht."""
    base = ROOT / "data" / "entity_fill"
    try:
        stale = json.loads((base / "stale.json").read_text("utf-8")) if (base / "stale.json").exists() else {}
    except Exception:
        stale = {}
    out = {}
    for l in LANGS:
        f = base / "i18n" / f"{l}.json"
        try:
            d = json.loads(f.read_text("utf-8")) if f.exists() else {}
        except Exception:
            d = {}
        bad = stale.get(l) or {}
        out[l] = {k for k, v in d.items() if isinstance(v, dict) and (v.get("desc") or v.get("long")) and k not in bad}
    return out


def entity_rows(ents, edone=None):
    edone = entity_done() if edone is None else edone
    rows = []
    for e in ents:
        if e.get("type") in ("person",): continue
        desc = e.get("desc") or {}
        src = "en" if desc.get("en") else "de"
        has_de = bool(desc.get("de")) and desc.get("de") != desc.get("en")
        langs = [l for l in LANGS if l != src and ((l == "de" and has_de) or e["id"] in edone.get(l, ()))]
        rows.append({"k": "entity", "id": e["id"], "t": e["name"][:TITLE_MAX], "lang": src, "langs": langs})
    return rows


def article_rows():
    """Eine Zeile je Video mit Artikel (data/articles/<VIDEO>.json = {Sprache: {html, ...}}). Quelle ist immer Englisch (Sonnet schreibt nur Englisch, Haiku uebersetzt);
    Videos, deren Artikel noch aus der Zeit vor Weg B stammen (je Sprache einzeln geschrieben), zeigen ihre vorhandenen Sprachen und warten auf die englische Fassung."""
    try:
        titles = json.loads((ROOT / "data" / "en_titles.json").read_text("utf-8"))
    except Exception:
        titles = {}
    try:
        failed = json.loads((ROOT / "data" / "articles_tr_state.json").read_text("utf-8")).get("failed") or {}
    except Exception:
        failed = {}
    fl = {}
    for key in failed:   # "<lang>|<video>"
        l, _, v = str(key).partition("|")
        if l in LANGS and v: fl.setdefault(v, []).append(l)
    rows = []
    for f in sorted(glob.glob(str(ROOT / "data" / "articles" / "*.json"))):
        vid = Path(f).stem
        try:
            d = json.loads(Path(f).read_text("utf-8"))
        except Exception:
            continue
        if not isinstance(d, dict): continue
        has = lambda l: isinstance(d.get(l), dict) and bool(d[l].get("html"))
        langs = [l for l in LANGS if has(l)]
        if not langs and not has("en"): continue
        t = (titles.get(vid) or "").strip()
        if not t:
            try:
                t = str(next(iter(json.loads((ROOT / "episodes" / f"{vid}.json").read_text("utf-8")).values()))["title"])
            except Exception:
                t = vid
        row = {"k": "article", "id": vid, "t": " ".join(t.split())[:TITLE_MAX], "lang": "en", "langs": langs}
        if fl.get(vid): row["fl"] = sorted(l for l in fl[vid] if l not in langs)
        if row.get("fl") == []: row.pop("fl")
        rows.append(row)
    return rows


def build(write, TODAY, ents, legacy_posts, episodes):
    """legacy_posts: frueher [{slug,title}] der Podpage-Beitraege im Seitenbau; die Liste kommt jetzt aus translate_blog.posts() (alle uebersetzten Blogartikel) und wird nur noch
    gebraucht, wenn die nicht lesbar ist. episodes: [{slug,title}] der Hauptshow."""
    done = blog_done()
    posts = blog_sources() or list(legacy_posts)
    rows = blog_rows(posts, done)
    notes = {}
    for l in LANGS:
        f = ROOT / "data" / "podpage_i18n" / f"notes_{l}.json"
        try:
            notes[l] = set(json.loads(f.read_text("utf-8"))) if f.exists() else set()
        except Exception:
            notes[l] = set()
    for e in episodes:
        rows.append({"k": "notes", "id": e["slug"], "t": e["title"][:TITLE_MAX], "lang": "en", "langs": [l for l in LANGS if e["slug"] in notes[l]]})
    rows += entity_rows(ents)
    rows += article_rows()
    out = json.dumps({"generated": TODAY, "langs": LANGS, "rows": rows}, ensure_ascii=False, separators=(",", ":"))
    write("translation-status.json", out)
    n = {k: sum(1 for r in rows if r["k"] == k) for k in ("lblog", "notes", "entity", "article")}
    dn = {k: {l: sum(1 for r in rows if r["k"] == k and l in r["langs"]) for l in ("de", "fr", "ja")} for k in n}
    print(f"Uebersetzungsstatus: {n['lblog']} Blogartikel, {n['notes']} Show Notes, {n['entity']} Entitaeten, {n['article']} Video-Artikel; Datei {len(out.encode('utf-8')) // 1024} KB; "
          + "; ".join(f"{k} de/fr/ja {v['de']}/{v['fr']}/{v['ja']}" for k, v in dn.items()))
    return rows
