#!/usr/bin/env python3
"""Fetch placement-scoped sponsor metrics and send verified daily rows to the community API."""
import datetime as dt
import functools
import json
import os
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
API = os.environ.get("SPONSOR_API", "https://api-dub.m365.fm").rstrip("/")
LANGS = ("en", "de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")


def json_request(url, data=None, headers=None, timeout=40):
    request = urllib.request.Request(url, data=data, headers=headers or {}, method="POST" if data is not None else "GET")
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return response.status, json.loads(response.read().decode("utf-8") or "{}"), response.headers
    except urllib.error.HTTPError as error:
        return error.code, {}, error.headers


def text_day(value):
    try:
        return dt.date.fromisoformat(str(value)[:10]).isoformat()
    except ValueError:
        return ""


def number(value):
    try:
        result = float(value)
        return result if result >= 0 and result < 1_000_000_000_000 else None
    except (TypeError, ValueError):
        return None


def row(placement, day, metric, value, dim, source, kind="measured"):
    value = number(value)
    if value is None or not text_day(day):
        return None
    return {"placement_id": placement, "day": text_day(day), "metric": metric, "value": value,
            "dim": str(dim or "")[:200], "source": source, "kind": kind}


def report(statuses):
    lines = ["### Sponsor-Metriken"]
    lines.extend(f"- {source}: {state}" for source, state in sorted(statuses.items()))
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as output:
            output.write("\n".join(lines) + "\n")
    print("\n".join(lines))


def slug_rows(placement_id):
    try:
        records = json.loads((ROOT / "data" / "sponsorships.json").read_text("utf-8")).get("sponsorships", [])
        return next((record for record in records if record.get("id") == placement_id), {})
    except (OSError, ValueError, TypeError):
        return {}


def page_paths(record, placement):
    paths = set()
    for kind in ("entities", "topics"):
        paths.update(f"/entity/{key}/" for key in record.get(kind, []) if re.fullmatch(r"[a-z0-9-]{1,100}", str(key)))
    for value in record.get("posts", []):
        path = urllib.parse.urlsplit(str(value).strip()).path
        if path.startswith("/") and not path.startswith("//") and not re.search(r"(^|/)\.\.?(/|$)|[\\\x00-\x1f]", path):
            paths.add(path)
    for value in record.get("episodes", []):
        value = re.sub(r"^https?://(?:www\.)?m365\.fm", "", str(value).strip()).strip("/")
        parts = value.split("/")
        if len(parts) == 1 and re.fullmatch(r"[a-z0-9-]{1,120}", parts[0]):
            path = f"/show/episodes/{parts[0]}/"
        elif len(parts) == 4 and parts[0] in LANGS and parts[1:3] == ["show", "episodes"]:
            path = f"/{parts[0]}/show/episodes/{parts[3]}/"
        elif len(parts) == 3 and parts[:2] == ["show", "episodes"]:
            path = f"/show/episodes/{parts[2]}/"
        elif len(parts) == 2 and parts[0] in LANGS and parts[0] != "en":
            path = f"/{parts[0]}/{parts[1]}/"
        else:
            path = ""
        if path.startswith("/") and not path.startswith("//"):
            paths.add(path)
    try:
        refs = json.loads(placement.get("refs") or "{}")
    except (ValueError, TypeError):
        refs = {}
    extra_paths = refs.get("page_paths", []) if isinstance(refs, dict) else []
    if not isinstance(extra_paths, list):
        extra_paths = []
    for value in extra_paths:
        path = str(value)
        if path.startswith("/") and not path.startswith("//") and not re.search(r"[?#]|(^|/)\.\.?(/|$)|[\\\x00-\x1f]", path):
            paths.add(path)
    langs = [x.strip() for x in str(placement.get("langs") or "").split(",") if x.strip() in LANGS]
    if not langs:
        langs = ["en"]
    expanded = set(paths)
    for path in paths:
        prefix = path.strip("/").split("/", 1)[0]
        if prefix in LANGS:
            continue
        for lang in langs:
            expanded.add(path if lang == "en" or path.startswith(f"/{lang}/") else f"/{lang}{path}")
    return sorted(expanded)


def video_ids(placement):
    try:
        refs = json.loads(placement.get("refs") or "{}")
    except (ValueError, TypeError):
        return []
    values = refs.get("video_ids", []) if isinstance(refs, dict) else []
    if isinstance(values, str):
        values = values.split(",")
    return sorted({str(value).strip() for value in values if re.fullmatch(r"[A-Za-z0-9_-]{5,24}", str(value).strip())})


def duration_seconds(value):
    match = re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?", str(value or ""))
    if not match:
        return None
    hours, minutes, seconds = match.groups()
    return int(hours or 0) * 3600 + int(minutes or 0) * 60 + float(seconds or 0)


def episode_ids(placement):
    refs = slug_rows(placement["id"])
    wanted = set()
    dub_refs = set()
    for value in refs.get("episodes", []):
        clean = re.sub(r"^https?://(?:www\.)?m365\.fm", "", str(value).strip()).strip("/")
        parts = clean.split("/")
        if len(parts) == 1:
            wanted.add(parts[0])
        elif len(parts) == 3 and parts[:2] == ["show", "episodes"]:
            wanted.add(parts[2])
        elif len(parts) == 4 and parts[0] in LANGS and parts[1:3] == ["show", "episodes"]:
            wanted.add(parts[3])
        elif len(parts) == 2 and parts[0] in LANGS and parts[0] != "en":
            dub_refs.add((parts[0], parts[1]))
    ids = set()
    try:
        mapping = json.loads((ROOT / "data" / "episode_slugs.json").read_text("utf-8"))
    except (OSError, ValueError):
        mapping = {}
    ids.update(str(sid) for sid, slug in mapping.items() if slug in wanted and str(sid).isdigit())
    dub_map = dub_episode_ids()
    ids.update(dub_map[ref] for ref in dub_refs if ref in dub_map)
    if dub_refs - dub_map.keys():
        missing = ", ".join(f"{lang}/{slug}" for lang, slug in sorted(dub_refs - dub_map.keys()))
        print(f"Dub-Folgen nicht zugeordnet ({placement['id']}): {missing}")
    return sorted(ids)


@functools.lru_cache(maxsize=1)
def dub_episode_ids():
    try:
        published = json.loads((ROOT / "data" / "published.json").read_text("utf-8"))
    except (OSError, ValueError):
        return {}
    result, seen = {}, set()
    for path in sorted((ROOT / "episodes").glob("*.json")):
        try:
            episodes = json.loads(path.read_text("utf-8"))
        except (OSError, ValueError):
            continue
        vid = path.stem
        for lang, episode in episodes.items():
            if lang not in LANGS or not isinstance(episode, dict) or not episode.get("title"):
                continue
            slug = unicodedata.normalize("NFKD", str(episode["title"]))
            slug = "".join(char for char in slug if not unicodedata.combining(char))
            slug = re.sub(r"\(.*?\)|（.*?）", "", slug)
            slug = re.sub(r"[^A-Za-z0-9]+", "-", slug).strip("-").lower()
            if len(slug) > 70:
                slug = slug[:70].rsplit("-", 1)[0]
            slug = slug.rstrip("-") if len(slug) >= 15 else vid.lower().replace("_", "-")
            key = (lang, slug)
            if key in seen:
                slug = f"{slug}-{vid.lower()[:6]}"
            seen.add(key)
            item = published.get(f"{vid}:{lang}") or {}
            episode_id = str(item.get("episode_id") or "")
            if episode_id.isdigit():
                result[(lang, slug)] = episode_id
    return result


def spreaker(placements, day, out, statuses):
    token = os.environ.get("SPREAKER_TOKEN", "").strip()
    if not token:
        statuses["Spreaker"] = "Secret fehlt; keine Werte geschrieben"
        return
    headers = {"Authorization": "Bearer " + token}
    try:
        show_map = json.loads((ROOT / "config.json").read_text("utf-8")).get("show_map") or {}
    except (OSError, ValueError):
        show_map = {}
    wanted = {p["id"]: set(episode_ids(p)) for p in placements}
    by_show = {}
    for placement in placements:
        try:
            langs = [lang.strip() for lang in placement.get("langs", "").split(",") if lang.strip()]
        except AttributeError:
            langs = []
        if not langs:
            langs = list(show_map)
        for lang in langs:
            show_id = show_map.get(lang)
            if show_id and wanted[placement["id"]]:
                by_show.setdefault(str(show_id), set()).update(wanted[placement["id"]])
    attempted, failed, source_rows = False, False, []
    for show_id, wanted_ids in by_show.items():
        query = urllib.parse.urlencode({"from": day, "to": day, "limit": 100})
        url = f"https://api.spreaker.com/v2/shows/{show_id}/episodes/statistics/plays/totals?{query}"
        for _ in range(20):
            attempted = True
            status, data, _ = json_request(url, headers=headers)
            if status != 200:
                failed = True
                break
            response = data.get("response") or {}
            for item in response.get("items") or []:
                episode_id = str(item.get("episode_id") or (item.get("episode") or {}).get("episode_id") or "")
                if episode_id not in wanted_ids:
                    continue
                plays = sum(number(value) or 0 for key, value in item.items()
                            if "play" in key.lower() and key != "episode_id")
                for placement in placements:
                    if episode_id in wanted[placement["id"]]:
                        metric = row(placement["id"], day, "podcast_plays", plays,
                                     f"episode:{episode_id}", "spreaker")
                        if metric:
                            source_rows.append(metric)
            next_url = response.get("next_url")
            if not isinstance(next_url, str) or not next_url.startswith("https://api.spreaker.com/v2/"):
                break
            url = next_url
    if failed:
        statuses["Spreaker"] = "Abruf fehlgeschlagen; keine Werte geschrieben"
    else:
        out.extend(source_rows)
        statuses["Spreaker"] = "Abruf abgeschlossen" if attempted else "Keine verknüpften Episoden"


def youtube(placements, day, out, statuses):
    client_id, secret, refresh = (os.environ.get(key, "").strip() for key in ("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN"))
    videos = {p["id"]: video_ids(p) for p in placements}
    if not (client_id and secret and refresh):
        statuses["YouTube Analytics"] = "Zugang fehlt; keine Werte geschrieben"
        return
    status, token, _ = json_request("https://oauth2.googleapis.com/token",
        urllib.parse.urlencode({"grant_type": "refresh_token", "refresh_token": refresh, "client_id": client_id, "client_secret": secret}).encode(),
        {"Content-Type": "application/x-www-form-urlencoded"})
    access = token.get("access_token") if status == 200 else None
    if not access:
        statuses["YouTube Analytics"] = f"Tokenabruf fehlgeschlagen (HTTP {status}); keine Werte geschrieben"
        return
    headers = {"Authorization": "Bearer " + access}
    source_rows, failed = [], False
    for placement in placements:
        ids = videos[placement["id"]]
        if not ids:
            continue
        details_status, details, _ = json_request(
            "https://www.googleapis.com/youtube/v3/videos?" + urllib.parse.urlencode({"part": "contentDetails", "id": ",".join(ids)}),
            headers=headers)
        if details_status != 200:
            failed = True
            continue
        durations = {item.get("id"): duration_seconds((item.get("contentDetails") or {}).get("duration"))
                     for item in details.get("items") or []}
        query = urllib.parse.urlencode({
            "ids": "channel==MINE", "startDate": day, "endDate": day, "dimensions": "day,video",
            "filters": "video==" + ",".join(ids),
            "metrics": "views,estimatedMinutesWatched",
        })
        status, data, _ = json_request("https://youtubeanalytics.googleapis.com/v2/reports?" + query, headers=headers)
        if status != 200:
            failed = True
            continue
        for result in data.get("rows") or []:
            if len(result) < 4:
                continue
            metric_day, video_id, views, minutes = result[:4]
            for name, value in (("video_views", views), ("video_watch_minutes", minutes)):
                metric = row(placement["id"], metric_day, name, value, f"video:{video_id}", "youtube")
                if metric:
                    source_rows.append(metric)
        try:
            refs = json.loads(placement.get("refs") or "{}")
            mention = number(refs.get("mention_sec")) if isinstance(refs, dict) else None
        except (ValueError, TypeError):
            mention = None
        if mention is None:
            continue
        for video_id in ids:
            duration = durations.get(video_id)
            if not duration or mention > duration:
                continue
            retention_query = urllib.parse.urlencode({
                "ids": "channel==MINE", "startDate": day, "endDate": day, "dimensions": "elapsedVideoTimeRatio",
                "filters": f"video=={video_id}", "metrics": "audienceWatchRatio",
            })
            status, data, _ = json_request("https://youtubeanalytics.googleapis.com/v2/reports?" + retention_query, headers=headers)
            if status != 200:
                failed = True
                continue
            points = []
            for result in data.get("rows") or []:
                if len(result) >= 2:
                    ratio, audience = number(result[0]), number(result[1])
                    if ratio is not None and audience is not None:
                        points.append((abs(ratio - mention / duration), audience))
            if points:
                retention = min(points, key=lambda point: point[0])[1] * 100
                metric = row(placement["id"], day, "video_retention", retention, f"video:{video_id}", "youtube")
                if metric:
                    source_rows.append(metric)
    if failed:
        statuses["YouTube Analytics"] = "Abruf fehlgeschlagen; keine Werte geschrieben"
    else:
        out.extend(source_rows)
        statuses["YouTube Analytics"] = "Abruf abgeschlossen"


def cloudflare(placements, day, out, statuses):
    token = os.environ.get("CLOUDFLARE_API_TOKEN", "").strip()
    zone = os.environ.get("CF_ZONE_ID", "").strip()
    if not token:
        statuses["Cloudflare"] = "Secret fehlt; keine Werte geschrieben"
        return
    headers = {"Authorization": "Bearer " + token, "Content-Type": "application/json"}
    if not zone:
        status, data, _ = json_request("https://api.cloudflare.com/client/v4/zones?name=m365.fm", headers=headers)
        zone = ((data.get("result") or [{}])[0] or {}).get("id", "") if status == 200 else ""
    if not zone:
        statuses["Cloudflare"] = "Zone nicht verfügbar; keine Werte geschrieben"
        return
    query = """query($z:String!,$d:Date!,$p:String!){viewer{zones(filter:{zoneTag:$z}){httpRequestsAdaptiveGroups(limit:100,filter:{date_geq:$d,date_leq:$d,clientRequestPath:$p}){dimensions{date clientRequestPath}count}}}}"""
    source_rows, failed = [], False
    for placement in placements:
        for path in page_paths(slug_rows(placement["id"]), placement):
            payload = json.dumps({"query": query, "variables": {"z": zone, "d": day, "p": path}}).encode()
            status, data, _ = json_request("https://api.cloudflare.com/client/v4/graphql", payload, headers)
            if status != 200 or data.get("errors"):
                failed = True
                continue
            zones = (((data.get("data") or {}).get("viewer") or {}).get("zones") or [])
            groups = zones[0].get("httpRequestsAdaptiveGroups") or [] if zones else []
            for group in groups:
                dims = group.get("dimensions") or {}
                metric = row(placement["id"], dims.get("date") or day, "page_views", group.get("count"), path, "cloudflare")
                if metric:
                    source_rows.append(metric)
    if failed:
        statuses["Cloudflare"] = "Abruf fehlgeschlagen; keine Werte geschrieben"
    else:
        out.extend(source_rows)
        statuses["Cloudflare"] = "Abruf abgeschlossen"


def gsc(placements, day, out, statuses):
    raw = os.environ.get("GSC_SERVICE_ACCOUNT_JSON", "").strip()
    if not raw:
        statuses["Google Search Console"] = "Secret fehlt; keine Werte geschrieben"
        return
    try:
        from tools import update_ai_stats as helper
        service = json.loads(raw)
        token = helper.http_json(helper.token_uri(service), form={
            "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
            "assertion": helper.jwt_assertion(service, int(time.time())),
        }).get("access_token")
        if not token:
            raise RuntimeError("kein Zugriffstoken")
        site = os.environ.get("GSC_SITE", "sc-domain:m365.fm")
        url = helper.GSC_API.format(site=urllib.parse.quote(site, safe=""))
        headers = {"Authorization": "Bearer " + token}
        source_rows = []
        for placement in placements:
            record = slug_rows(placement["id"])
            urls = ["https://www.m365.fm" + path for path in page_paths(record, placement)]
            for page in urls:
                query = {"startDate": day, "endDate": day, "dimensions": ["date"],
                         "dimensionFilterGroups": [{"filters": [{"dimension": "page", "operator": "equals", "expression": page}]}]}
                for result in helper.http_json(url, body=query, headers=headers).get("rows") or []:
                    date_value = (result.get("keys") or [day])[0]
                    if text_day(date_value) != day:
                        continue
                    for metric_name, value in (("gsc_impressions", result.get("impressions")), ("gsc_clicks", result.get("clicks"))):
                        metric = row(placement["id"], date_value, metric_name, value, page, "gsc")
                        if metric:
                            source_rows.append(metric)
        out.extend(source_rows)
    except Exception as error:
        statuses["Google Search Console"] = f"Abruf fehlgeschlagen ({type(error).__name__}); keine Werte geschrieben"
        return
    statuses["Google Search Console"] = "Abruf abgeschlossen"


def bing(placements, day, out, statuses):
    key = os.environ.get("BING_WEBMASTER_API_KEY", "").strip()
    if not key:
        statuses["Bing Webmaster API"] = "Secret fehlt; keine Werte geschrieben"
        return
    attempted, failed, source_rows = False, False, []
    for placement in placements:
        for path in page_paths(slug_rows(placement["id"]), placement):
            page = urllib.parse.urljoin("https://www.m365.fm", path)
            query = urllib.parse.urlencode({"siteUrl": "https://www.m365.fm/", "pageUrl": page, "apikey": key})
            status, data, _ = json_request("https://ssl.bing.com/webmaster/api.svc/json/GetPageStats?" + query)
            if status != 200:
                failed = True
                continue
            attempted = True
            for item in (data.get("d") or []):
                raw_date = str(item.get("Date") or "")
                match = re.search(r"\d{9,}", raw_date)
                try:
                    date_value = dt.datetime.fromtimestamp(int(match.group()) / 1000, dt.timezone.utc).date().isoformat() if match else text_day(raw_date)
                except (ValueError, OSError):
                    continue
                if date_value != day:
                    continue
                for metric_name, value in (("bing_impressions", item.get("Impressions")), ("bing_clicks", item.get("Clicks"))):
                    metric = row(placement["id"], date_value, metric_name, value, page, "bing_webmaster")
                    if metric:
                        source_rows.append(metric)
    if failed:
        statuses["Bing Webmaster API"] = "Abruf fehlgeschlagen; keine Werte geschrieben"
    else:
        out.extend(source_rows)
        statuses["Bing Webmaster API"] = "Abruf abgeschlossen" if attempted else "Abruf ohne Ergebnis"


def press_ranger(placements, day, out, statuses):
    token = os.environ.get("PRESSRANGER_MCP_TOKEN", "").strip()
    if not token:
        statuses["Press Ranger"] = "Secret fehlt; keine Werte geschrieben"
        return
    endpoint = "https://pressranger.com/mcp"
    headers = {"Authorization": "Bearer " + token, "Content-Type": "application/json", "Accept": "application/json, text/event-stream"}
    session = ""

    def call(payload):
        nonlocal session
        request = urllib.request.Request(endpoint, data=json.dumps(payload).encode(), headers=headers)
        if session:
            request.add_header("Mcp-Session-Id", session)
        with urllib.request.urlopen(request, timeout=40) as response:
            session = response.headers.get("Mcp-Session-Id", session)
            content = response.read().decode("utf-8")
        events = re.findall(r"^data:\s*(\{.*\})\s*$", content, re.M)
        return json.loads(events[-1] if events else content)

    try:
        call({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {
            "protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "m365fm-sponsor-metrics", "version": "1.0"}}})
        call({"jsonrpc": "2.0", "method": "notifications/initialized"})
        tools = call({"jsonrpc": "2.0", "id": 2, "method": "tools/list"}).get("result", {}).get("tools", [])
    except Exception as error:
        statuses["Press Ranger"] = f"Toolliste nicht verfügbar ({type(error).__name__}); keine Werte geschrieben"
        return
    # Tool names, schemas and result fields are discovered at run time; unknown schemas are never guessed.
    candidates = [tool for tool in tools if any(word in (tool.get("name", "") + " " + tool.get("description", "")).lower()
                 for word in ("press release", "distribution report", "ai visibility"))]
    week_start = dt.date.fromisoformat(day) - dt.timedelta(days=6)
    source_rows, failed = [], False
    for placement in placements:
        refs = placement.get("refs") or {}
        if isinstance(refs, str):
            try: refs = json.loads(refs)
            except ValueError: refs = {}
        release = refs.get("press_release") if isinstance(refs, dict) else None
        if not isinstance(release, str) or not release.startswith("https://"):
            continue
        for tool in candidates:
            description = (tool.get("name", "") + " " + tool.get("description", "")).lower()
            is_ai_visibility = "ai visibility" in description
            if is_ai_visibility and dt.date.fromisoformat(day).weekday() != 0:
                continue
            schema = tool.get("inputSchema") or {}
            properties = schema.get("properties") or {}
            values = {"url": release, "link": release, "press_release": release, "pressRelease": release,
                      "release_url": release, "company": placement.get("org_name", ""),
                      "startDate": week_start.isoformat() if is_ai_visibility else day,
                      "endDate": day, "start_date": week_start.isoformat() if is_ai_visibility else day,
                      "end_date": day, "date": day, "period": "week" if is_ai_visibility else day}
            arguments = {key: values[key] for key in properties if key in values}
            if set(schema.get("required", [])) - arguments.keys():
                continue
            try:
                result = call({"jsonrpc": "2.0", "id": 3, "method": "tools/call",
                               "params": {"name": tool.get("name"), "arguments": arguments}})
                content = result.get("result", {}).get("content", [])
                payload = "\n".join(item.get("text", "") for item in content if isinstance(item, dict))
                try: metrics = json.loads(payload)
                except ValueError: continue
            except Exception:
                failed = True
                continue
            if not isinstance(metrics, dict):
                continue
            for key, metric_name in (("ai_visibility", "ai_visibility"),) if is_ai_visibility else (("views", "press_views"),):
                metric = row(placement["id"], day, metric_name, metrics.get(key), release, "press_ranger",
                             "estimated" if metric_name == "ai_visibility" else "measured")
                if metric:
                    source_rows.append(metric)
    if failed:
        statuses["Press Ranger"] = "Abruf fehlgeschlagen; keine Werte geschrieben"
    else:
        out.extend(source_rows)
        statuses["Press Ranger"] = "Abruf abgeschlossen; nur erkannte Messwerte übernommen"


def main(today=None):
    cron_key = os.environ.get("CRON_KEY", "").strip()
    if not cron_key:
        print("CRON_KEY fehlt; keine Werte geschrieben")
        return 2
    headers = {"x-cron-key": cron_key, "Content-Type": "application/json"}
    status, data, _ = json_request(f"{API}/api/internal/sponsor-placements", headers=headers)
    if status != 200:
        print(f"Platzierungen konnten nicht geladen werden (HTTP {status})")
        return 1
    placements = data.get("placements") or []
    today = today or dt.datetime.now(dt.timezone.utc).date()
    if isinstance(today, dt.datetime):
        today = today.date()
    days = [(today - dt.timedelta(days=offset)).isoformat() for offset in range(1, 5)]
    metrics, day_statuses = [], {}
    sources = ((spreaker, "Spreaker"), (youtube, "YouTube Analytics"), (cloudflare, "Cloudflare"),
               (gsc, "Google Search Console"), (bing, "Bing Webmaster API"), (press_ranger, "Press Ranger"))
    for source, name in sources:
        for day in days:
            source_metrics, source_status = [], {}
            try:
                source(placements, day, source_metrics, source_status)
            except Exception as error:
                source_status[name] = f"Abruf fehlgeschlagen ({type(error).__name__}); keine Werte geschrieben"
            metrics.extend(source_metrics)
            state = source_status.get(name, "Abruf fehlgeschlagen; keine Werte geschrieben")
            day_statuses.setdefault(name, []).append(f"{day}: {state}")
    statuses = {name: " | ".join(states) for name, states in day_statuses.items()}
    # The internal API validates every placement, source, metric, value and date before UPSERT.
    count = 0
    for offset in range(0, len(metrics), 500):
        batch = metrics[offset:offset + 500]
        status, _, _ = json_request(f"{API}/api/internal/sponsor-metrics",
            json.dumps({"metrics": batch}).encode(), headers)
        if status != 200:
            statuses["D1"] = f"Batch {offset // 500 + 1} abgewiesen (HTTP {status}); weitere Batches nicht gesendet"
            report(statuses)
            return 1
        count += len(batch)
    statuses["D1"] = f"{count} Tageswerte gespeichert" if count else "keine neuen Messwerte"
    report(statuses)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
