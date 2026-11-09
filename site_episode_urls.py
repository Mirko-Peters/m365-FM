"""Kanonische m365.fm-Adresse einer Folge - eine Quelle fuer Seitenbau, Spreaker-Abgleich (tools/spreaker_urls.py) und Uploader.

Englisch (Hauptshow, Spreaker-Show 6704921): <BASE>/show/episodes/<slug>/. Dub-Sprachen: <BASE>/<sprache>/<slug>/.
Der Dub-Slug entsteht aus dem Titel (ascii_slug, Mindestlaenge 15, sonst die YouTube-ID); Kollisionen je Sprache haengen die ID an
(generate_site.py). Der Seitenbau schreibt die Zuordnung Spreaker-Folge -> Adresse nach spreaker-urls.json."""
import re
import unicodedata

EN_SHOW_ID = 6704921


def ascii_slug(t, vid=None):
    s = unicodedata.normalize("NFKD", t)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"\(.*?\)|（.*?）", "", s)
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    if len(s) > 70:
        s = s[:70].rsplit("-", 1)[0]
    return s.rstrip("-") if len(s) >= 15 else ""


def episode_url(base, lang, slug):
    base = base.rstrip("/")
    return f"{base}/show/episodes/{slug}/" if lang == "en" else f"{base}/{lang}/{slug}/"


def dub_slug(title, vid):
    """Slug einer Dub-Folge wie im Seitenbau (ohne Kollisionsfall: dort haengt generate_site.py die ID an)."""
    return ascii_slug(title, vid) or vid.lower().replace("_", "-")


def dub_url(base, lang, title, vid):
    """Adresse, die der Seitenbau der Dub-Folge geben wird - fuer den Uploader (Feld episode_link beim Hochladen)."""
    return episode_url(base, lang, dub_slug(title, vid))


def build_mapping(base, en_items, dub_items, show_ids, generated=""):
    """en_items: Dicts mit sid, slug; dub_items: (lang, Dict mit eid, slug); show_ids: Sprache -> Spreaker-Show-ID.
    Rueckgabe: {version, generated, items:[{spreaker_episode_id, show_id, lang, slug, url}]}, sortiert, je Folgen-ID einmal."""
    rows = {}
    for it in en_items:
        if it.get("sid") and it.get("slug"):
            rows[str(it["sid"])] = {"spreaker_episode_id": str(it["sid"]), "show_id": EN_SHOW_ID, "lang": "en", "slug": it["slug"], "url": episode_url(base, "en", it["slug"])}
    for lang, it in dub_items:
        if it.get("eid") and it.get("slug"):
            rows.setdefault(str(it["eid"]), {"spreaker_episode_id": str(it["eid"]), "show_id": int(show_ids[lang]), "lang": lang, "slug": it["slug"], "url": episode_url(base, lang, it["slug"])})
    return {"version": 1, "generated": generated, "items": sorted(rows.values(), key=lambda r: int(r["spreaker_episode_id"]))}
