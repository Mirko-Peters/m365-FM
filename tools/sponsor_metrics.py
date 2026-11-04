#!/usr/bin/env python3
"""Fetch placement-scoped sponsor metrics and send verified daily rows to the community API."""
import datetime as dt
import json
import os
import re
import sys
import time
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
    if not value or not text_day(day):
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
        path = str(value).strip().split("?", 1)[0].split("#", 1)[0]
        if path.startswith("/"):
            paths.add(path)
    for value in record.get("episodes", []):
        path = str(value).strip()
        if path.startswith("https://www.m365.fm/"):
            path = "/" + path.split("https://www.m365.fm/", 1)[1]
        elif not path.startswith("/"):
            path = f"/show/episodes/{path}/" if "/" not in path else f"/{path.strip('/')}/"
        if path.startswith("/") and not path.startswith("//"):
            paths.add(path)
    try:
        refs = json.loads(placement.get("refs") or "{}")
    except (ValueError, TypeError):
        refs = {}
    for value in refs.get("page_paths", []) if isinstance(refs, dict) else []:
        path = str(value)
        if path.startswith("/") and not path.startswith("//") and not re.search(r"[?#]", path):
            paths.add(path)
    langs = [x.strip() for x in str(placement.get("langs") or "").split(",") if x.strip() in LANGS]
    if not langs:
        langs = list(LANGS)
    expanded = set(paths)
    for path in paths:
        for lang in langs:
            expanded.add(path if lang == "en" else f"/{lang}{path}")
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


def episode_ids(placement):
    refs = slug_rows(placement["id"])
    wanted = set(map(str, refs.get("episodes", [])))
    if not wanted:
        return []
    try:
        mapping = json.loads((ROOT / "data" / "episode_slugs.json").read_text("utf-8"))
    except (OSError, ValueError):
        return []
    return sorted({str(sid) for sid, slug in mapping.items() if slug in wanted and str(sid).isdigit()})


def spreaker(placements, day, out, statuses):
    token = os.environ.get("SPREAKER_TOKEN", "").strip()
    ids = {p["id"]: episode_ids(p) for p in placements}
    if not token:
        statuses["Spreaker"] = "Secret fehlt; keine Werte geschrieben"
        return
    headers = {"Authorization": f"******"}
    attempted = False
    for placement, episode_list in ((p, ids[p["id"]]) for p in placements):
        for episode_id in episode_list:
            attempted = True
            query = urllib.parse.urlencode({"from": day, "to": day, "limit": 100})
            status, data, _ = json_request(f"https://api.spreaker.com/v2/episodes/{episode_id}/statistics/plays/totals?{query}", headers=headers)
            if status != 200:
                continue
            payload = data.get("response") or {}
            items = payload.get("items") or [payload]
            plays = sum(number(value) or 0 for item in items if isinstance(item, dict)
                        for key, value in item.items() if "play" in key.lower() and key != "episode_id")
            metric = row(placement["id"], day, "podcast_plays", plays, f"episode:{episode_id}", "spreaker")
            if metric:
                out.append(metric)
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
    headers = {"Authorization": f"******"}
    for placement in placements:
        ids = videos[placement["id"]]
        if not ids:
            continue
        query = urllib.parse.urlencode({
            "ids": "channel==MINE", "startDate": day, "endDate": day, "dimensions": "day,video",
            "filters": "video==" + ",".join(ids),
            "metrics": "views,estimatedMinutesWatched,averageViewPercentage",
        })
        status, data, _ = json_request("https://youtubeanalytics.googleapis.com/v2/reports?" + query, headers=headers)
        if status != 200:
            continue
        for result in data.get("rows") or []:
            if len(result) < 5:
                continue
            metric_day, video_id, views, minutes, retention = result[:5]
            for name, value in (("video_views", views), ("video_watch_minutes", minutes), ("video_retention", retention)):
                metric = row(placement["id"], metric_day, name, value, f"video:{video_id}", "youtube")
                if metric:
                    out.append(metric)
    statuses["YouTube Analytics"] = "Abruf abgeschlossen"


def cloudflare(placements, day, out, statuses):
    token = os.environ.get("CLOUDFLARE_API_TOKEN", "").strip()
    zone = os.environ.get("CF_ZONE_ID", "").strip()
    if not token:
        statuses["Cloudflare"] = "Secret fehlt; keine Werte geschrieben"
        return
    headers = {"Authorization": f"******", "Content-Type": "application/json"}
    if not zone:
        status, data, _ = json_request("https://api.cloudflare.com/client/v4/zones?name=m365.fm", headers=headers)
        zone = ((data.get("result") or [{}])[0] or {}).get("id", "") if status == 200 else ""
    if not zone:
        statuses["Cloudflare"] = "Zone nicht verfügbar; keine Werte geschrieben"
        return
    query = """query($z:String!,$d:Date!,$p:String!){viewer{zones(filter:{zoneTag:$z}){httpRequestsAdaptiveGroups(limit:100,filter:{date_geq:$d,date_leq:$d,clientRequestPath:$p}){dimensions{date clientRequestPath}count}}}}"""
    for placement in placements:
        for path in page_paths(slug_rows(placement["id"]), placement):
            payload = json.dumps({"query": query, "variables": {"z": zone, "d": day, "p": path}}).encode()
            status, data, _ = json_request("https://api.cloudflare.com/client/v4/graphql", payload, headers)
            if status != 200 or data.get("errors"):
                continue
            zones = (((data.get("data") or {}).get("viewer") or {}).get("zones") or [])
            groups = zones[0].get("httpRequestsAdaptiveGroups") or [] if zones else []
            for group in groups:
                dims = group.get("dimensions") or {}
                metric = row(placement["id"], dims.get("date") or day, "page_views", group.get("count"), path, "cloudflare")
                if metric:
                    out.append(metric)
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
        for placement in placements:
            record = slug_rows(placement["id"])
            urls = ["https://www.m365.fm" + path for path in page_paths(record, placement)]
            for page in urls:
                query = {"startDate": day, "endDate": day, "dimensions": ["date"],
                         "dimensionFilterGroups": [{"filters": [{"dimension": "page", "operator": "equals", "expression": page}]}]}
                for result in helper.http_json(url, body=query, headers=headers).get("rows") or []:
                    date_value = (result.get("keys") or [day])[0]
                    for metric_name, value in (("gsc_impressions", result.get("impressions")), ("gsc_clicks", result.get("clicks"))):
                        metric = row(placement["id"], date_value, metric_name, value, page, "gsc")
                        if metric:
                            out.append(metric)
    except Exception as error:
        statuses["Google Search Console"] = f"Abruf fehlgeschlagen ({type(error).__name__}); keine Werte geschrieben"
        return
    statuses["Google Search Console"] = "Abruf abgeschlossen"


def bing(placements, day, out, statuses):
    key = os.environ.get("BING_WEBMASTER_API_KEY", "").strip()
    if not key:
        statuses["Bing Webmaster API"] = "Secret fehlt; keine Werte geschrieben"
        return
    attempted = False
    for placement in placements:
        for path in page_paths(slug_rows(placement["id"]), placement):
            page = urllib.parse.urljoin("https://www.m365.fm", path)
            query = urllib.parse.urlencode({"siteUrl": "https://www.m365.fm/", "pageUrl": page, "apikey": key})
            status, data, _ = json_request("https://ssl.bing.com/webmaster/api.svc/json/GetPageStats?" + query)
            if status != 200:
                continue
            attempted = True
            for item in (data.get("d") or []):
                raw_date = str(item.get("Date") or "")
                match = re.search(r"\d{9,}", raw_date)
                try:
                    date_value = dt.datetime.fromtimestamp(int(match.group()) / 1000, dt.timezone.utc).date().isoformat() if match else text_day(raw_date)
                except (ValueError, OSError):
                    continue
                for metric_name, value in (("bing_impressions", item.get("Impressions")), ("bing_clicks", item.get("Clicks"))):
                    metric = row(placement["id"], date_value, metric_name, value, page, "bing_webmaster")
                    if metric:
                        out.append(metric)
    statuses["Bing Webmaster API"] = "Abruf abgeschlossen" if attempted else "Abruf ohne Ergebnis"


def press_ranger(placements, day, out, statuses):
    token = os.environ.get("PRESSRANGER_MCP_TOKEN", "").strip()
    if not token:
        statuses["Press Ranger"] = "Secret fehlt; keine Werte geschrieben"
        return
    endpoint = "https://pressranger.com/mcp"
    headers = {"Authorization": f"******", "Content-Type": "application/json", "Accept": "application/json, text/event-stream"}
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
    for placement in placements:
        refs = placement.get("refs") or {}
        if isinstance(refs, str):
            try: refs = json.loads(refs)
            except ValueError: refs = {}
        release = refs.get("press_release") if isinstance(refs, dict) else None
        if not isinstance(release, str) or not release.startswith("https://"):
            continue
        for tool in candidates:
            schema = tool.get("inputSchema") or {}
            properties = schema.get("properties") or {}
            values = {"url": release, "link": release, "press_release": release, "pressRelease": release,
                      "release_url": release, "startDate": day, "endDate": day, "start_date": day,
                      "end_date": day, "date": day, "period": day}
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
                continue
            for key, metric_name in (("views", "press_views"), ("ai_visibility", "ai_visibility")):
                metric = row(placement["id"], day, metric_name, metrics.get(key), release, "press_ranger",
                             "estimated" if metric_name == "ai_visibility" else "measured")
                if metric:
                    out.append(metric)
    statuses["Press Ranger"] = "Abruf abgeschlossen; nur erkannte Messwerte übernommen"


def main():
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
    day = (dt.datetime.now(dt.timezone.utc).date() - dt.timedelta(days=1)).isoformat()
    metrics, statuses = [], {}
    for source in (spreaker, youtube, cloudflare, gsc, bing, press_ranger):
        try:
            source(placements, day, metrics, statuses)
        except Exception as error:
            statuses[source.__name__] = f"Abruf fehlgeschlagen ({type(error).__name__}); keine Werte geschrieben"
    # The internal API validates every placement, source, metric, value and date before UPSERT.
    count = 0
    for offset in range(0, len(metrics), 500):
        batch = metrics[offset:offset + 500]
        status, _, _ = json_request(f"{API}/api/internal/sponsor-metrics",
            json.dumps({"metrics": batch}).encode(), headers)
        if status != 200:
            print(f"Metrik-Batch abgewiesen (HTTP {status}); Lauf wird als fehlgeschlagen markiert")
            report(statuses)
            return 1
        count += len(batch)
    statuses["D1"] = f"{count} Tageswerte gespeichert" if count else "keine neuen Messwerte"
    report(statuses)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
