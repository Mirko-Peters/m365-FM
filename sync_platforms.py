#!/usr/bin/env python3
"""Ordnet die Folgen jeder Show den Folgen auf anderen Plattformen zu und schreibt die Links nach data/episode_links.json (Schluessel: Spreaker-Episoden-ID).
Plattformen: Apple Podcasts (iTunes-API, ohne Zugang), Deezer (oeffentliche API), Spotify (SPOTIFY_CLIENT_ID/SECRET oder per scrape_spotify.py gesammelt),
YouTube (yt-dlp, Wiedergabelisten aus platforms.json "youtube_sources"), dazu die Links der Podpage-Sicherung (englische Show).
Zugeordnet wird per Titel (auch gekuerzt/leicht abweichend) und Datum (platform_match.py); unsichere Faelle bleiben offen und stehen in data/episode_links_report.json.
Eigene Korrekturen in data/episode_links_manual.json {"<folge>:<sprache>": {"apple": "https://..."}} gehen immer vor.

data/platforms.json:  {"de": {"apple_id": "1234567890", "spotify_id": "4abc...", "deezer_show": "https://www.deezer.com/show/123", "youtube_sources": ["https://www.youtube.com/playlist?list=..."]}, "en": {...}}
Weitere Plattformen: einen Konnektor (Funktion, die Kandidaten {title,url,date} liefert) in CONNECTORS eintragen.
"""
import base64, gzip, json, os, re, sys, time, urllib.parse, urllib.request
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path

import platform_match as PM

ROOT = Path(__file__).parent
DATA = ROOT / "data"
COUNTRY = {"en": "us", "de": "de", "es": "es", "fr": "fr", "it": "it", "pt": "br", "nl": "nl", "pl": "pl", "id": "id", "ru": "ru",
           "uk": "ua", "ar": "ae", "he": "il", "hi": "in", "ja": "jp", "ko": "kr", "ml": "in", "pa": "in", "ta": "in", "te": "in"}
BASE_LANG = {"de-de": "de", "es-us": "es", "es-es": "es", "fr-fr": "fr", "pt-br": "pt", "nl-nl": "nl"}
SEARCH_CAP = 40
SEARCH_BACKLOG_CAP = 200


def jload(p, default):
    try:
        return json.loads(Path(p).read_text("utf-8"))
    except Exception:
        return default


def get(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {"User-Agent": "m365-site-sync"})
    return json.load(urllib.request.urlopen(req, timeout=60))


def get_text(url):
    req = urllib.request.Request(url, headers={"User-Agent": "m365-site-sync"})
    return urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")


def strip(t):
    return re.sub(r"<[^>]+>", "", t or "").strip()


def duration_seconds(value):
    if isinstance(value, str) and ":" in value:
        try:
            parts = [int(float(x)) for x in value.split(":")]
            return sum(part * 60 ** i for i, part in enumerate(reversed(parts)))
        except ValueError:
            return None
    try:
        return int(value) if value else None
    except (TypeError, ValueError):
        return None


# ---------- eigene Folgen je Show ----------
def own_episodes(lang):
    """{Spreaker-ID: Folge}, plus Zuordnung der bisherigen video_id:lang-Schluessel."""
    out = {}
    aliases = {}
    notes = jload(DATA / "show_notes" / f"{lang}.json", {}).get("episodes") or {}
    for sid, e in notes.items():
        sid = str(e.get("id") or sid)
        out[sid] = {"title": strip(e.get("title")), "date": e.get("published", ""),
                    "guid": e.get("guid", ""), "duration": e.get("duration")}
        aliases[f"{sid}:{lang}"] = sid
    if lang == "en":
        for ep_id, e in jload(DATA / "en_episodes.json", {}).items():
            sid = str(e.get("spreaker_id") or ep_id)
            if sid in out:
                out[sid].update({"guid": e.get("guid") or out[sid].get("guid"),
                                 "duration": duration_seconds(e.get("duration")) or out[sid].get("duration")})
            else:
                out[sid] = {"title": strip(e.get("title")), "date": (e.get("pub") or "")[:10],
                            "guid": e.get("guid", ""), "duration": duration_seconds(e.get("duration"))}
            aliases[f"{sid}:en"] = sid
        return out, aliases
    pub = jload(DATA / "published.json", {})
    for p in (ROOT / "episodes").glob("*.json"):
        for l, e in jload(p, {}).items():
            if BASE_LANG.get(l, l) == lang:
                old_key = f"{p.stem}:{l}"
                published = pub.get(old_key) or pub.get(f"{p.stem}:{lang}") or {}
                sid = str(published.get("episode_id") or e.get("spreaker_id") or "")
                if not sid:
                    continue
                aliases[old_key] = sid
                aliases[f"{p.stem}:{lang}"] = sid
                if sid not in out:
                    out[sid] = {"title": strip(e.get("title")), "date": (published.get("at") or "")[:10],
                                "guid": "", "duration": None}
    return out, aliases


# ---------- Konnektoren: je Plattform eine Liste von Kandidaten ----------
def show_feed_url(lang):
    show_id = (jload(ROOT / "config.json", {}).get("show_map") or {}).get(lang)
    return f"https://www.spreaker.com/show/{show_id}/episodes/feed" if show_id else ""


def apple_show_id(lang, ids):
    """Findet eine Apple-Show nur bei exakter Uebereinstimmung des Spreaker-Feeds."""
    feed_url = show_feed_url(lang)
    if not feed_url:
        return ""
    try:
        channel = ET.fromstring(get_text(feed_url)).find("./channel")
        title = (channel.findtext("title") or "").strip() if channel is not None else ""
        if not title:
            return ""
        q = urllib.parse.urlencode({"term": title, "entity": "podcast", "limit": 50,
                                    "country": COUNTRY.get(lang, "us")})
        results = get(f"https://itunes.apple.com/search?{q}").get("results", [])
        for item in results:
            if (item.get("feedUrl") or "").rstrip("/") == feed_url.rstrip("/") and item.get("collectionId"):
                return str(item["collectionId"])
    except Exception as e:
        print(f"Apple-Show {lang}: {str(e)[:100]}")
    return ""


def apple_candidates(lang, ids, ctx):
    if not ids.get("apple_id"):
        ids["apple_id"] = apple_show_id(lang, ids)
        if not ids["apple_id"]:
            print(f"Apple {lang}: keine Show mit passender Spreaker-Feed-URL gefunden")
            return []
    r = get(f"https://itunes.apple.com/lookup?id={ids['apple_id']}&entity=podcastEpisode&limit=200&country={COUNTRY.get(lang, 'us')}")
    return [{"title": x.get("trackName"), "url": x["trackViewUrl"].split("&uo=")[0],
             "date": (x.get("releaseDate") or "")[:10], "guid": x.get("episodeGuid")}
            for x in r.get("results", []) if x.get("trackViewUrl") and x.get("wrapperType") == "podcastEpisode"]


def apple_search(lang, ids, openkeys, own, budget=SEARCH_CAP):
    """Aeltere Folgen stehen nicht in der 200er-Liste: gezielt per Titel suchen (Antworten gefiltert auf die eigene Show)."""
    out = []
    for k in openkeys[:budget]:
        q = urllib.parse.quote(PM.normalize(own[k]["title"])[:80])
        try:
            r = get(f"https://itunes.apple.com/search?term={q}&media=podcast&entity=podcastEpisode&limit=8&country={COUNTRY.get(lang, 'us')}")
        except Exception:
            continue
        for x in r.get("results", []):
            if str(x.get("collectionId")) == str(ids["apple_id"]) and x.get("trackViewUrl"):
                out.append({"title": x.get("trackName"), "url": x["trackViewUrl"].split("&uo=")[0],
                            "date": (x.get("releaseDate") or "")[:10], "guid": x.get("episodeGuid")})
        time.sleep(3.2)   # iTunes-Limit ca. 20 Anfragen/Minute
    return out


def deezer_candidates(lang, ids, ctx):
    m = re.search(r"/show/(\d+)", ids.get("deezer_show", ""))
    if not m:
        return []
    out, url = [], f"https://api.deezer.com/podcast/{m.group(1)}/episodes?limit=100"
    while url:
        r = get(url)
        out += [{"title": x.get("title"), "url": f"https://www.deezer.com/episode/{x['id']}", "date": (x.get("release_date") or "")[:10]} for x in r.get("data", [])]
        url = r.get("next")
    return out


def spotify_candidates(lang, ids, ctx):
    tok = ctx.get("spotify_token")
    if not tok or not ids.get("spotify_id"):
        return []
    out, url = [], f"https://api.spotify.com/v1/shows/{ids['spotify_id']}/episodes?limit=50&market=US"
    while url:
        r = get(url, {"Authorization": f"Bearer {tok}"})
        out += [{"title": x.get("name"), "url": (x.get("external_urls") or {}).get("spotify"),
                 "date": x.get("release_date", ""), "duration": (x.get("duration_ms") or 0) / 1000}
                for x in r.get("items", []) if x and (x.get("external_urls") or {}).get("spotify")]
        url = r.get("next")
    return out


def youtube_rss(pid):
    """Die neuesten 15 Videos einer Wiedergabeliste ueber den RSS-Feed (ohne Anmeldung, schnell)."""
    import xml.etree.ElementTree as ET
    ns = {"a": "http://www.w3.org/2005/Atom", "y": "http://www.youtube.com/xml/schemas/2015"}
    raw = urllib.request.urlopen(urllib.request.Request(f"https://www.youtube.com/feeds/videos.xml?playlist_id={pid}", headers={"User-Agent": "Mozilla/5.0"}), timeout=20).read()
    return [{"title": e.findtext("a:title", "", ns), "url": f"https://www.youtube.com/watch?v={e.findtext('y:videoId', '', ns)}", "date": (e.findtext("a:published", "", ns) or "")[:10]}
            for e in ET.fromstring(raw).findall("a:entry", ns)]


def youtube_candidates(lang, ids, ctx):
    srcs = ids.get("youtube_sources") or []
    if not srcs:
        return []
    out = []
    for u in srcs:   # RSS: die neuesten 15, klappt auch wenn yt-dlp blockiert wird
        m = re.search(r"list=([\w-]+)", u)
        if not m:
            continue
        if len(m.group(1)) < 24:
            print(f"YouTube {lang}: Playlist-ID '{m.group(1)}' sieht abgeschnitten aus (echte IDs haben meist 34 Zeichen)")
        try:
            out += youtube_rss(m.group(1))
        except Exception as e:
            print(f"YouTube-RSS {lang} {m.group(1)}: {str(e)[:100]}")
    try:
        import yt_dlp
    except ImportError:
        print("YouTube: yt-dlp nicht installiert, nur RSS (pip install yt-dlp)"); return out
    with yt_dlp.YoutubeDL({"quiet": True, "extract_flat": True, "skip_download": True, "ignoreerrors": True, "playlistend": 1200, "socket_timeout": 20, "retries": 1, "extractor_retries": 1}) as y:
        for u in srcs:
            info = y.extract_info(u, download=False) or {}
            for e in info.get("entries") or []:
                if e and e.get("id") and e.get("title"):
                    d = e.get("upload_date") or ""
                    out.append({"title": e["title"], "url": f"https://www.youtube.com/watch?v={e['id']}", "date": f"{d[:4]}-{d[4:6]}-{d[6:8]}" if len(d) == 8 else ""})
    print(f"YouTube {lang}: {len(out)} Kandidaten")
    return out


def youtube_music_candidates(lang, ids, ctx):
    """YouTube Music: Die Folgen-IDs sind NICHT die Video-IDs, also nicht ableitbar. Wir finden den Podcast ueber eine bekannte Folge (Podpage-Sicherung), eine
    eingetragene ID (platforms.json "youtube_music_id") oder die Suche nach dem Show-Namen und lesen alle Folgen (inoffizielle Bibliothek ytmusicapi, ohne Anmeldung)."""
    try:
        from ytmusicapi import YTMusic
    except ImportError:
        print("YouTube Music uebersprungen: ytmusicapi nicht installiert (pip install ytmusicapi)"); return []
    yt = YTMusic()
    cands = [ids.get("youtube_music_id")] if ids.get("youtube_music_id") else []
    for vid in (ctx.get("ytm_seeds") or [])[:4]:
        if cands:
            break
        try:
            ep = yt.get_episode(vid) or {}
            cands += [x for x in (ep.get("playlistId"), (ep.get("podcast") or {}).get("id"), (ep.get("podcast") or {}).get("playlistId")) if x]
        except Exception as e:
            print("YouTube Music Folge", vid, str(e)[:80])
    if not cands and ids.get("youtube_music_name"):
        for r in yt.search(ids["youtube_music_name"], filter="podcasts", limit=5):
            if r.get("browseId"):
                cands.append(r["browseId"]); break
    for pid in cands:
        pid = re.sub(r"^MPSP", "", pid)
        try:
            pod = yt.get_podcast(pid, limit=None)
        except Exception as e:
            print("YouTube Music Podcast", pid, str(e)[:80]); continue
        ids["youtube_music_id"] = pid
        ids["youtube_music_show"] = f"https://music.youtube.com/playlist?list={pid}"
        out = []
        for e in pod.get("episodes") or []:
            if e.get("videoId") and e.get("title"):
                out.append({"title": e["title"], "url": f"https://music.youtube.com/podcast/{e['videoId']}", "date": ""})
        return out
    return []


def podpage_candidates(lang, ids, ctx):
    """Links der Podpage-Sicherung (englische Show): Apple, Spotify, YouTube Music je Folge."""
    if lang != "en":
        return {}
    f = DATA / "podpage" / "episodes.json.gz"
    if not f.exists():
        return {}
    eps = json.load(gzip.open(f, "rt", encoding="utf-8"))
    res = {"apple": [], "spotify": [], "youtube_music": []}
    for e in eps:
        d = ""   # create_time der Podpage-Sicherung ist der Importzeitpunkt, nicht das Veroeffentlichungsdatum: nur der Titel zaehlt
        for plat, field in (("apple", "episode_apple_url_path"), ("spotify", "episode_spotify_url_path"), ("youtube_music", "episode_youtube_music_url_path")):
            u = e.get(field)
            if u and u not in ("None", "False"):
                res[plat].append({"title": e.get("name"), "url": u.split("&uo=")[0], "date": d})
    return res


CONNECTORS = {"apple": apple_candidates, "deezer": deezer_candidates, "spotify": spotify_candidates, "youtube": youtube_candidates, "youtube_music": youtube_music_candidates}


def match_apple(own, cands):
    """Nimmt GUID-Treffer zuerst; Titel/Datum dienen nur als Rueckfall."""
    by_guid = {}
    for i, c in enumerate(cands):
        if c.get("guid") and c.get("url"):
            by_guid.setdefault(str(c["guid"]).strip(), []).append(i)
    hit, used, ambiguous = {}, set(), set()
    for key, episode in own.items():
        guid = str(episode.get("guid") or "").strip()
        matches = by_guid.get(guid, []) if guid else []
        urls = {cands[i]["url"] for i in matches}
        if len(urls) == 1:
            hit[key] = next(iter(urls))
            used.update(matches)
        elif len(urls) > 1:
            ambiguous.add(key)
            used.update(matches)
    remaining = {k: v for k, v in own.items() if k not in hit and k not in ambiguous}
    candidates = [c for i, c in enumerate(cands) if i not in used]
    h2, open_, amb2 = PM.match(remaining, candidates)
    hit.update(h2)
    return hit, open_, sorted(ambiguous | set(amb2))


def migrate_links(out, aliases):
    """Kopiert alte video_id:lang-Eintraege auf die kanonische Spreaker-ID."""
    for old_key, episode_id in aliases.items():
        if old_key in out and isinstance(out[old_key], dict):
            migrated = dict(out[old_key])
            migrated.update(out.get(episode_id) or {})
            out[episode_id] = migrated


def normalize_manual(manual, aliases):
    return {aliases.get(key, key): {p: u for p, u in links.items() if u}
            for key, links in manual.items() if isinstance(links, dict)}


def retry_for(state, episode_id, platform):
    entry = state.get(episode_id) or {}
    if "apple" in entry or "spotify" in entry:
        return entry.get(platform) or {}
    return entry if platform == "apple" else {}


def should_search_apple(state, today):
    first = state.get("first_missing") or today
    last = state.get("last_search") or ""
    try:
        age = (date.fromisoformat(today) - date.fromisoformat(first)).days
        since = (date.fromisoformat(today) - date.fromisoformat(last)).days if last else 999
    except ValueError:
        age, since = 0, 999
    return (first, not last or (age < 14 and since >= 1) or (age >= 14 and since >= 7))


def spotify_token():
    cid, sec = os.environ.get("SPOTIFY_CLIENT_ID"), os.environ.get("SPOTIFY_CLIENT_SECRET")
    if not (cid and sec):
        return None
    req = urllib.request.Request("https://accounts.spotify.com/api/token", b"grant_type=client_credentials", {"Authorization": "Basic " + base64.b64encode(f"{cid}:{sec}".encode()).decode()})
    return json.load(urllib.request.urlopen(req, timeout=60))["access_token"]


def main():
    plat = jload(DATA / "platforms.json", {})
    out = jload(DATA / "episode_links.json", {})
    previous = jload(DATA / "episode_links_report.json", {})
    previous_shows = previous.get("shows") or {}
    previous_retry = previous.get("retry_state") or {}
    all_own, aliases = {}, {}
    for lang in plat:
        own, old_keys = own_episodes(lang)
        if own:
            all_own[lang] = own
            aliases.update(old_keys)
    migrate_links(out, aliases)
    for key, url in jload(DATA / "spotify_links.json", {}).items():
        episode_id = aliases.get(key, key)
        out.setdefault(episode_id, {}).setdefault("spotify", url)

    manual = normalize_manual(jload(DATA / "episode_links_manual.json", {}), aliases)
    for lang, own in all_own.items():
        for episode_id in own:
            out.setdefault(episode_id, {})

    ctx = {}
    try:
        ctx["spotify_token"] = spotify_token()
    except Exception as e:
        print("Spotify-Token:", e)
    if not ctx.get("spotify_token"):
        print("Spotify-API nicht verfuegbar (Secrets fehlen oder Token-Fehler); verwende vorhandene Scraper-Links.")

    prior_open = sum(len((show.get("apple") or {}).get("open_episodes") or
                         (show.get("apple") or {}).get("open") or [])
                     for show in previous_shows.values() if isinstance(show, dict))
    search_budget = SEARCH_BACKLOG_CAP if prior_open > SEARCH_CAP else SEARCH_CAP
    today = time.strftime("%Y-%m-%d")
    remaining_budget = search_budget
    search_attempted = set()
    report = {}
    for lang, ids in plat.items():
        own = all_own.get(lang, {})
        if not own:
            continue
        rep = report.setdefault(lang, {})
        connector_report = {}
        cands = {}
        pp = podpage_candidates(lang, ids, ctx) or {}
        ctx["ytm_seeds"] = [c["url"].rstrip("/").split("/")[-1] for c in pp.get("youtube_music", [])][::-1]   # juengste zuerst
        for name, fn in CONNECTORS.items():
            t0 = time.time()
            if name == "spotify":
                due = [episode_id for episode_id in own
                       if "spotify" not in out.get(episode_id, {})
                       and "spotify" not in manual.get(episode_id, {})
                       and should_search_apple(retry_for(previous_retry, episode_id, "spotify"), today)[1]]
                if not ctx.get("spotify_token") or not ids.get("spotify_id") or not due:
                    cands[name] = []
                    if ctx.get("spotify_token") and ids.get("spotify_id") and not due:
                        print(f"Spotify {lang}: keine offene Folge mit faelliger Suche")
                    continue
            try:
                cands[name] = fn(lang, ids, ctx)
                if name == "spotify":
                    search_attempted.update((episode_id, name) for episode_id in due)
            except Exception as e:
                print(name, lang, str(e)[:120])
            print(f"{lang} {name}: {time.time() - t0:.0f} s, {len(cands.get(name, []))} Kandidaten")
        for name, lst in pp.items():
            cands.setdefault(name, []).extend(lst)
        for name, lst in cands.items():
            matcher = match_apple if name == "apple" else PM.match
            hit, open_, amb = matcher(own, lst)
            if name == "apple" and ids.get("apple_id") and remaining_budget:
                due = []
                for episode_id in own:
                    if name in out.get(episode_id, {}) or episode_id in hit or name in manual.get(episode_id, {}):
                        continue
                    prior = retry_for(previous_retry, episode_id, name)
                    first, is_due = should_search_apple(prior, today)
                    if is_due:
                        due.append(episode_id)
                selected = due[:remaining_budget]
                extra = apple_search(lang, ids, selected, own, budget=len(selected))
                remaining_budget -= len(selected)
                search_attempted.update((episode_id, name) for episode_id in selected)
                if selected:
                    print(f"Apple {lang}: {len(selected)} gezielte Suchen (Budget uebrig: {remaining_budget})")
                if extra:
                    lst.extend(extra)
                    hit, open_, amb = matcher(own, lst)
            for k, u in hit.items():
                if name not in manual.get(k, {}):
                    out.setdefault(k, {})[name] = u
            connector_report[name] = {"candidates": len(lst), "matched_now": len(hit),
                                      "ambiguous": [own[k]["title"] for k in amb[:20]]}
            rep[name] = connector_report[name]

    for episode_id, links in manual.items():
        out.setdefault(episode_id, {}).update(links)

    retry_state = {}
    for lang, own in all_own.items():
        rep = report.setdefault(lang, {})
        for name in CONNECTORS:
            previous_platform = previous_shows.get(lang, {}).get(name, {})
            linked = sum(1 for episode_id in own if name in out.get(episode_id, {}))
            missing = [episode_id for episode_id in own if name not in out.get(episode_id, {})]
            ambiguous = rep.get(name, {}).get("ambiguous", [])
            current = rep.get(name) or {}
            candidates = current.get("candidates", 0)
            matched_now = current.get("matched_now", 0)
            ambiguous = current.get("ambiguous", [])
            connector = report.get(lang, {}).get(name)
            if connector:
                candidates = connector["candidates"]
                matched_now = connector["matched_now"]
                ambiguous = connector["ambiguous"]
            rep[name] = {"candidates": candidates, "matched_now": matched_now,
                         "linked": linked, "of": len(own),
                         "open": [own[k]["title"] for k in missing[:40]],
                         "open_episodes": [{"id": k, "title": own[k]["title"]} for k in missing],
                         "ambiguous": ambiguous}
            old_linked = previous_platform.get("linked")
            if old_linked is not None and old_linked != linked:
                print(f"Plattformabdeckung geaendert: {lang} {name} {old_linked}/{previous_platform.get('of', '?')} -> {linked}/{len(own)}")
            print(f"{lang} {name}: {candidates} Kandidaten, {matched_now} neu, {linked}/{len(own)} verlinkt")
        for episode_id in own:
            state = {}
            for name in ("apple", "spotify"):
                if name in out.get(episode_id, {}):
                    continue
                prior = retry_for(previous_retry, episode_id, name)
                first, _ = should_search_apple(prior, today)
                platform_state = {"first_missing": first}
                if prior.get("last_search"):
                    platform_state["last_search"] = prior["last_search"]
                if (episode_id, name) in search_attempted:
                    platform_state["last_search"] = today
                state[name] = platform_state
            if state:
                retry_state[episode_id] = state

    # Show-Links ergaenzen
    for l, ids in plat.items():
        if ids.get("apple_id"): ids["apple_show"] = f"https://podcasts.apple.com/podcast/id{ids['apple_id']}"
        if ids.get("spotify_id"): ids["spotify_show"] = f"https://open.spotify.com/show/{ids['spotify_id']}"
    (DATA / "platforms.json").write_text(json.dumps(plat, indent=1), encoding="utf-8")
    (DATA / "episode_links.json").write_text(json.dumps(out, indent=1, sort_keys=True), encoding="utf-8")
    (DATA / "episode_links_report.json").write_text(
        json.dumps({"generated": today, "shows": report, "retry_state": retry_state},
                   ensure_ascii=False, indent=1), encoding="utf-8")
    print(len(out), "Folgen mit Plattform-Links")


if __name__ == "__main__":
    main()
