"""RSS-Feeds und OPML-Verzeichnis fuer Entitaetsseiten."""
import html
import json
import re
from datetime import date, datetime, timezone
from email.utils import formatdate
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from xml.sax.saxutils import escape, quoteattr

from site_i18n import pfx, pfx2, T
from site_learn import ENTS, esc


FEED_LANGS = ("en", "de")
MAX_ITEMS = 50
_ROOT = Path(__file__).parent


def _ts(value):
    if isinstance(value, (int, float)):
        return int(value)
    if not value:
        return 0
    try:
        parsed = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return int(parsed.timestamp())
    except (TypeError, ValueError):
        try:
            return int(datetime.combine(date.fromisoformat(str(value)[:10]), datetime.min.time(), timezone.utc).timestamp())
        except (TypeError, ValueError):
            return 0


def _date(value):
    ts = _ts(value)
    return formatdate(ts, usegmt=True) if ts else formatdate(0, usegmt=True)


def _plain(value, limit=500):
    text = html.unescape(str(value or ""))
    text = re.sub(r"<[^>]*>", " ", text)
    return re.sub(r"\s+", " ", text).strip()[:limit]


def _tracked(url):
    parts = urlsplit(str(url or ""))
    query = [(k, v) for k, v in parse_qsl(parts.query, keep_blank_values=True) if k not in ("utm_source", "utm_medium")]
    query.extend((("utm_source", "rss"), ("utm_medium", "entity")))
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def allowed_audio(url):
    """Nur direkte Spreaker-MP3s oder deren Spreaker-Ziel enthaltende Podtrac-URLs."""
    try:
        parts = urlsplit(str(url or ""))
        if parts.scheme != "https" or parts.port not in (None, 443):
            return False
        path = parts.path.lower()
        if parts.hostname == "api.spreaker.com":
            return bool(re.fullmatch(r"/download/episode/\d+/[^/]+\.mp3", path))
        return parts.hostname == "dts.podtrac.com" and bool(
            re.search(r"/api\.spreaker\.com/download/episode/\d+/[^/]+\.mp3$", path)
        )
    except ValueError:
        return False


def episode_audio():
    path = _ROOT / "data" / "en_episodes.json"
    if not path.exists():
        return {}
    try:
        data = json.loads(path.read_text("utf-8"))
    except (OSError, ValueError):
        return {}
    return {
        str(item["spreaker_id"]): {
            "url": item["audio"],
            "length": item.get("length") or item.get("size") or item.get("filesize"),
        }
        for item in data.values()
        if isinstance(item, dict) and item.get("spreaker_id") and allowed_audio(item.get("audio"))
    }


def index_posts(posts):
    """Ordnet Blogbeitraege ihren Themen zu."""
    result = {}
    for post in sorted(posts or [], key=lambda item: item.get("published") or 0, reverse=True):
        for eid in post.get("topics") or []:
            result.setdefault(eid, []).append(post)
    return result


def index_sources(videos, updates, events):
    """Ordnet Videos, Updates und Events den betroffenen Entitaeten zu."""
    result = {"videos": {}, "updates": {}, "events": {}}
    for kind, records, key in (
        ("videos", videos, "topics"),
        ("updates", updates, "eids"),
        ("events", events, "topics"),
    ):
        for record in records or []:
            ids = set(record.get(key) or [])
            if kind == "events":
                ids.update(topic for session in record.get("sessions") or [] for topic in session.get("topics") or [])
            for eid in ids:
                result[kind].setdefault(eid, []).append(record)
    return result


def items_for_entity(eid, lang, episodes, posts, indexed, base, audio_by_sid=None):
    """Erstellt die nach Sprache und Entitaet zugeordneten Feed-Eintraege."""
    items = []
    for episode in episodes or []:
        if (episode.get("lang") or "en") != lang:
            continue
        ep = episode.get("e") or {}
        sid = str(episode.get("sid") or "")
        audio_info = (audio_by_sid or {}).get(sid)
        audio = audio_info.get("url") if isinstance(audio_info, dict) else audio_info
        audio_length = audio_info.get("length") if isinstance(audio_info, dict) else episode.get("audio_length")
        try:
            audio_length = int(audio_length)
        except (TypeError, ValueError):
            audio_length = 0
        items.append({
            "kind": "episode",
            "id": sid or episode.get("slug") or episode.get("url") or "",
            "title": ep.get("title") or episode.get("title") or "Episode",
            "url": episode.get("url") or f"{base}/",
            "date": episode.get("date") or "",
            "summary": episode.get("sum") or ep.get("desc") or "",
            "audio": audio if allowed_audio(audio) else "",
            "audio_length": audio_length if audio_length > 0 else 0,
            "sort": _ts(episode.get("date")),
        })

    for post in posts or []:
        if (post.get("lang") or "en") != lang:
            continue
        url = f'{base}{pfx(post.get("lang") or "en")}/community/u/{post["handle"]}/blog/{post["slug"]}/'
        items.append({
            "kind": "article",
            "id": post.get("slug") or post.get("id") or "",
            "title": post.get("title") or "Article",
            "url": url,
            "date": post.get("published") or "",
            "summary": post.get("summary") or "",
            "sort": _ts(post.get("published")),
        })

    for video in indexed["videos"].get(eid, []):
        video_lang = video.get("lang") or "en"
        if video_lang != lang:
            continue
        items.append({
            "kind": "video",
            "id": video.get("slug") or video.get("id") or "",
            "title": video.get("title") or "Video",
            "url": f'{base}{pfx(video_lang)}/community/video/{video["slug"]}/',
            "date": video.get("published") or "",
            "summary": video.get("description") or "",
            "sort": _ts(video.get("published")),
        })

    if lang == "en":
        for update in indexed["updates"].get(eid, []):
            modified = update.get("modified") or update.get("created") or ""
            items.append({
                "kind": "update",
                "id": update.get("id") or "",
                "title": update.get("title") or "Microsoft update",
                "url": f"{base}/entity/{eid}/",
                "date": modified,
                "summary": update.get("desc") or "",
                "sort": _ts(modified),
            })

    for event in indexed["events"].get(eid, []):
        event_lang = event.get("lang") or "en"
        if event_lang != lang:
            continue
        items.append({
            "kind": "event",
            "id": event.get("handle") or "",
            "title": event.get("title") or "Event",
            "url": f'{base}{pfx(lang)}/community/events/{event["handle"]}/',
            "date": event.get("start") or "",
            "summary": event.get("summary") or event.get("about") or "",
            "sort": _ts(event.get("start")),
        })

    items.sort(key=lambda item: (item["sort"], item["title"]), reverse=True)
    return items[:MAX_ITEMS]


def rss(entity, lang, url, items, channel_url=None):
    title = f'{entity["name"]} – M365.FM'
    description = entity.get("desc", {}).get(lang) or entity.get("desc", {}).get("en") or ""
    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0"><channel>',
        f"<title>{escape(title)}</title>",
        f"<link>{escape(channel_url or url)}</link>",
        f"<description>{escape(_plain(description))}</description>",
        f"<language>{escape(lang)}</language>",
    ]
    for item in items:
        link = _tracked(item["url"])
        guid = f'{url}#item-{item["kind"]}-{item.get("id") or item.get("sort") or item["url"]}'
        out.extend((
            "<item>",
            f"<title>{escape(_plain(item['title'], 300))}</title>",
            f"<link>{escape(link)}</link>",
            f'<guid isPermaLink="false">{escape(guid)}</guid>',
            f"<pubDate>{_date(item['date'])}</pubDate>",
            f"<category>{escape(item['kind'])}</category>",
            f"<description>{escape(_plain(item.get('summary')))}</description>",
        ))
        if item.get("kind") == "episode" and allowed_audio(item.get("audio")) and item.get("audio_length", 0) > 0:
            out.append(f'<enclosure url={quoteattr(item["audio"])} length="{int(item["audio_length"])}" type="audio/mpeg"/>')
        out.append("</item>")
    out.append("</channel></rss>")
    return "".join(out)


def opml(base):
    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<opml version="2.0"><head><title>M365.FM – Entity RSS feeds</title></head><body>',
    ]
    for lang in FEED_LANGS:
        out.append(f'<outline text={quoteattr("Deutsch" if lang == "de" else "English")}>')
        for entity in sorted(ENTS.values(), key=lambda item: item["name"].casefold()):
            feed = f'{base}{pfx(lang)}/entity/{entity["id"]}/feed.xml'
            page = f'{base}{pfx(lang)}/entity/{entity["id"]}/'
            out.append(
                f'<outline type="rss" text={quoteattr(entity["name"])} title={quoteattr(entity["name"])} '
                f'xmlUrl={quoteattr(feed)} htmlUrl={quoteattr(page)}/>'
            )
        out.append("</outline>")
    out.append("</body></opml>")
    return "".join(out)


def build(g, episode_find, posts_by_topic, videos, updates, events, audio_by_sid=None):
    base, write, page = g["BASE"], g["write"], g["page"]
    sitemap, today = g["sitemap"], g["TODAY"]
    indexed = index_sources(videos, updates, events)
    feed_urls = {}
    for lang in FEED_LANGS:
        for entity in ENTS.values():
            eid = entity["id"]
            url = f"{base}{pfx(lang)}/entity/{eid}/feed.xml"
            page_url = f"{base}{pfx(lang)}/entity/{eid}/"
            items = items_for_entity(
                eid, lang, episode_find(entity, lang), posts_by_topic.get(eid, []),
                indexed, base, audio_by_sid,
            )
            write(f"{pfx2(lang)}entity/{eid}/feed.xml", rss(entity, lang, url, items, page_url))
            feed_urls.setdefault(eid, {})[lang] = url
            sitemap.append((url, today, None))

    write("entity/feeds.opml", opml(base))
    for lang in FEED_LANGS:
        prefix = pfx2(lang)
        url = f"{base}{pfx(lang)}/entity/feeds/"
        label = T(lang, "Entity RSS feeds", "RSS-Feeds der Entitäten")
        link = f"{base}/entity/feeds.opml"
        lis = "".join(
            f'<li><a href="{base}{pfx(lang)}/entity/{esc(e["id"])}/feed.xml">{esc(e["name"])}</a></li>'
            for e in sorted(ENTS.values(), key=lambda item: item["name"].casefold())
        )
        body = (
            f'{g["header"](lang, "")}<main class="wrap"><h1>{esc(label)}</h1>'
            f'<p><a class="btn main" href="{link}" type="application/xml" download>OPML herunterladen</a></p>'
            f'<ul>{lis}</ul></main>{g["footer"](lang)}'
        )
        write(f"{prefix}entity/feeds/index.html", page(lang, f"{label} – M365.FM", label, url, body, og_type="website"))
        sitemap.append((url, today, None))
    sitemap.append((f"{base}/entity/feeds.opml", today, None))
    return feed_urls
