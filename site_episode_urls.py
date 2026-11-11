"""Kanonische m365.fm-Adresse einer Folge - eine Quelle fuer Seitenbau, Spreaker-Abgleich (tools/spreaker_urls.py) und Uploader.

Englisch (Hauptshow, Spreaker-Show 6704921): <BASE>/show/episodes/<slug>/. Dub-Sprachen: <BASE>/<sprache>/<slug>/.
Der Dub-Slug entsteht aus dem Titel (ascii_slug, Mindestlaenge 15, sonst die YouTube-ID); Kollisionen je Sprache haengen die ID an
(generate_site.py). Der Seitenbau schreibt die Zuordnung Spreaker-Folge -> Adresse nach spreaker-urls.json."""
import re
import unicodedata
import urllib.error
import urllib.request

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


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k): return None


def page_fetch(url, timeout=30, limit=2_000_000):
    """(HTTP-Status, Text) der Seite ohne Weiterleitung folgen (wie tools/set_spreaker_links.status_of); (-1, "") bei Netzfehler."""
    try:
        with urllib.request.build_opener(_NoRedirect).open(urllib.request.Request(url, headers={"User-Agent": "m365-site-bot (episode urls)"}), timeout=timeout) as r:
            return r.status, r.read(limit).decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception:
        return -1, ""


def page_status(url, timeout=30):
    """HTTP-Status der Seite ohne Weiterleitung folgen; -1 bei Netzfehler."""
    return page_fetch(url, timeout)[0]


def page_of_video(html, vid):
    """Gehoert die Folgenseite zu diesem YouTube-Video? Jede Dub-Folgenseite nennt ihr Video im JSON-LD (VideoObject.contentUrl,
    generate_site.py); das schliessende Anfuehrungszeichen verhindert, dass eine laengere ID mit gleichem Anfang passt."""
    return bool(vid) and f'youtube.com/watch?v={vid}"' in (html or "")


def upload_link(base, lang, title, vid, fallback, fetch=page_fetch):
    """Feld "Website" (episode_link) beim Hochladen einer Dub-Folge: die Folgenseite nur, wenn sie schon mit 200 antwortet (wie
    tools/set_spreaker_links.py) UND zu diesem Video gehoert, sonst der Rueckfall (Show-Seite). Bei einer Slug-Kollision haengt
    generate_site.py die Video-ID an den Slug; die Seite ohne Anhang gehoert dann einer anderen Folge und antwortet trotzdem 200 -
    deshalb die Pruefung auf die Video-ID im Seiteninhalt. Neue Folgen bekommen ihre Seite erst beim naechsten Seitenbau; die Adresse
    setzt dann der taegliche Abgleich (set_spreaker_links.py / spreaker_urls.py), nie eine Adresse, die noch 404 liefert."""
    url = dub_url(base, lang, title, vid)
    st, html = fetch(url)
    return url if st == 200 and page_of_video(html, vid) else fallback


def sid_owners(items, out=None):
    """Spreaker-ID -> die eine Seite (Dict mit sid, slug, sid_q: Guete der Zuordnung, site_podpage.spreaker_match). Zeigen zwei Seiten auf
    dieselbe ID, gilt nie stillschweigend die letzte: die sicherere Zuordnung (kleineres sid_q, etwa sekundengleiche Zeit vor mehrdeutigem
    Titel) bleibt, bei Gleichstand die erste; out meldet es. Eine Regel fuer episode_index (by_sid, sid der Seiten) und build_mapping."""
    own = {}
    for it in items:
        if not (it.get("sid") and it.get("slug")): continue
        sid = str(it["sid"]); o = own.get(sid)
        if o is None: own[sid] = it; continue
        if o["slug"] == it["slug"]: continue
        keep = it if it.get("sid_q", 9) < o.get("sid_q", 9) else o
        if out: out(f"::warning::Spreaker-Folge {sid}: zwei Seiten ({o['slug']}, {it['slug']}) - behalte {keep['slug']}")
        own[sid] = keep
    return own


def build_mapping(base, en_items, dub_items, show_ids, generated="", out=print):
    """en_items: Dicts mit sid, slug (und sid_q); dub_items: (lang, Dict mit eid, slug); show_ids: Sprache -> Spreaker-Show-ID.
    Rueckgabe: {version, generated, items:[{spreaker_episode_id, show_id, lang, slug, url}]}, sortiert, je Folgen-ID einmal. Zwei englische
    Seiten mit derselben Folgen-ID loest sid_owners (meldet es ueber out)."""
    rows = {sid: {"spreaker_episode_id": sid, "show_id": EN_SHOW_ID, "lang": "en", "slug": it["slug"], "url": episode_url(base, "en", it["slug"])}
            for sid, it in sid_owners(en_items, out).items()}
    for lang, it in dub_items:
        if it.get("eid") and it.get("slug"):
            rows.setdefault(str(it["eid"]), {"spreaker_episode_id": str(it["eid"]), "show_id": int(show_ids[lang]), "lang": lang, "slug": it["slug"], "url": episode_url(base, lang, it["slug"])})
    return {"version": 1, "generated": generated, "items": sorted(rows.values(), key=lambda r: int(r["spreaker_episode_id"]))}
