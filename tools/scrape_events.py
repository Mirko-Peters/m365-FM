"""Sammelt öffentliche Fakten zu Microsoft-Community-Events."""
import hashlib
import json
import os
import re
import sys
import time
import urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import parse_qsl, urlparse

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get("EVENTS_OUTPUT", "/tmp/m365-fm-ext-events.json"))
STATE = Path(os.environ.get("EVENTS_STATE", "/tmp/m365-fm-ext-events-state.json"))
UA = "M365FM-event-scraper/1.0 (+https://www.m365.fm/contact/)"
MCP_URL = "https://mcp.communitydays.org/runtime/webhooks/mcp"
MS_TERMS = {
    "m365": "microsoft-365", "microsoft 365": "microsoft-365", "sharepoint": "sharepoint",
    "teams": "teams", "viva": "viva", "power platform": "power-platform", "power bi": "power-bi",
    "fabric": "fabric", "dynamics": "dynamics-365", "azure": "azure", "copilot": "copilot",
    "foundry": "azure-ai-foundry", "ai": "artificial-intelligence", "artificial intelligence": "artificial-intelligence",
    "ki": "artificial-intelligence", "agent": "ai-agents", "workplace ninja": "workplace-ninja",
    "experts live": "experts-live", "espc": "espc", "mvp": "mvp",
}
NEGATIVE_TERMS = ("microsoft wordle", "ai music", "artificial insemination", "copilot car")
MIN_SESSION_SHARE = 0.5
EMAIL = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)


def get(url, accept="application/json"):
    request = urllib.request.Request(url, headers={"user-agent": UA, "accept": accept})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def mcp_payload(response):
    raw = response.read().decode("utf-8")
    if "text/event-stream" in response.headers.get("content-type", ""):
        rows = [line[5:].strip() for line in raw.splitlines() if line.startswith("data:")]
        if not rows:
            raise ValueError("MCP-Antwort enthaelt keine Daten")
        return json.loads(rows[-1])
    return json.loads(raw)


def mcp_request(method, params=None, session=None, request_id=1):
    body = json.dumps({"jsonrpc": "2.0", "id": request_id, "method": method, "params": params or {}}).encode()
    headers = {"content-type": "application/json", "accept": "application/json, text/event-stream", "user-agent": UA}
    if method != "initialize":
        headers["MCP-Protocol-Version"] = "2025-03-26"
    request = urllib.request.Request(MCP_URL, data=body, headers=headers)
    with urllib.request.urlopen(request, timeout=45) as response:
        return mcp_payload(response), None


def community_tools():
    initialized, _ = mcp_request("initialize", {
        "protocolVersion": "2025-03-26", "capabilities": {}, "clientInfo": {"name": "m365fm-events", "version": "1.0"},
    })
    if initialized.get("error"):
        raise ValueError("MCP initialize fehlgeschlagen")
    notification = urllib.request.Request(MCP_URL, data=b'{"jsonrpc":"2.0","method":"notifications/initialized"}',
        headers={"content-type": "application/json", "accept": "application/json, text/event-stream", "user-agent": UA,
                 "MCP-Protocol-Version": "2025-03-26"})
    try:
        urllib.request.urlopen(notification, timeout=30).close()
    except Exception:
        pass
    tools, cursor = [], None
    for index in range(100):
        params = {"cursor": cursor} if cursor else {}
        result, _ = mcp_request("tools/list", params, request_id=index + 2)
        if result.get("error") or result.get("result", {}).get("isError"):
            raise ValueError("MCP tools/list meldete einen Fehler")
        data = result.get("result", {})
        tools.extend(data.get("tools", []))
        cursor = data.get("nextCursor")
        if not cursor:
            break
    else:
        raise ValueError("MCP tools/list ueberschritt das Seitenlimit")
    return tools, None


def _mcp_result_value(result):
    if result.get("error"):
        raise ValueError("MCP tools/call meldete einen Fehler")
    result = result.get("result", {})
    if result.get("isError"):
        raise ValueError("MCP tools/call meldete isError")
    if isinstance(result.get("structuredContent"), (dict, list)):
        return result["structuredContent"]
    values = []
    for item in result.get("content", []):
        if item.get("type") == "text":
            try:
                values.append(json.loads(item.get("text", "")))
            except (TypeError, ValueError):
                continue
    return values[0] if len(values) == 1 else values


def _tool_args(tool, values, required_overrides=None):
    schema = tool.get("inputSchema") or {}
    props, required = schema.get("properties") or {}, set(schema.get("required") or [])
    args = {}
    for key, prop in props.items():
        normalized = re.sub(r"[^a-z]", "", key.lower())
        value = next((v for pattern, v in values.items() if re.fullmatch(pattern, normalized)), None)
        if value is not None:
            if prop.get("type") != "string":
                return None
            args[key] = str(value)
        elif key in required:
            defaults = {
                "callforspeakers": "false", "callforsponsors": "false",
                "registrationopen": "false", "q": "", "country": "",
                "eventtype": "", "cost": "all",
            }
            default = (required_overrides or {}).get(key, defaults.get(normalized))
            if default is not None and prop.get("type") == "string" and (not prop.get("enum") or str(default) in prop["enum"]):
                args[key] = str(default)
            else:
                return None
    return args


def _event_windows():
    today = date.today()
    current = date(today.year - 5, 1, 1)
    last = date(today.year + 5, 12, 31)
    while current <= last:
        next_month = date(current.year + (current.month == 12), current.month % 12 + 1, 1)
        yield current, min(next_month - timedelta(days=1), last)
        current = next_month


def _records(value, collection_names=()):
    if isinstance(value, list):
        return [item for item in value if isinstance(item, dict)]
    if not isinstance(value, dict):
        return []
    for key, child in value.items():
        if key.lower() in collection_names and isinstance(child, list):
            return [item for item in child if isinstance(item, dict)]
    if _first(value, "title", "name", "sessionTitle", "session_title"):
        return [value]
    for child in value.values():
        if isinstance(child, (dict, list)):
            found = _records(child, collection_names)
            if found:
                return found
    return []


def _detail_value(tool, values, cache, cache_key, last_call):
    if cache_key in cache:
        return cache[cache_key]
    args = _tool_args(tool, values)
    if args is None:
        print(f"MCP-Tool {tool['name']} wegen nicht unterstuetzter Pflichtargumente uebersprungen", file=sys.stderr)
        return None
    elapsed = time.monotonic() - last_call[0]
    if last_call[0] and elapsed < 1:
        time.sleep(1 - elapsed)
    result, _ = mcp_request("tools/call", {"name": tool["name"], "arguments": args}, request_id=8000 + len(cache))
    last_call[0] = time.monotonic()
    cache[cache_key] = _mcp_result_value(result)
    return cache[cache_key]


def _speaker_id(speaker):
    return str(_first(speaker, "speakerId", "speaker_id", "id"))


def _merge_speaker_detail(speaker, detail):
    records = _records(detail, ("speaker", "speakers"))
    profile = records[0] if records else detail if isinstance(detail, dict) else {}
    name = _first(speaker, "name", "displayName", "speakerName", "speaker_name") or _first(profile, "name", "displayName", "speakerName")
    links = _links([
        _first(speaker, "links", "profileUrl", "profile_url", "url", "website", "linkedinUrl"),
        _first(profile, "links", "profileUrl", "profile_url", "url", "website", "linkedinUrl", "linkedin"),
    ])
    return {"name": name, "links": links}


def _enrich_event(raw, tools, cache, last_call):
    slug = str(_first(raw, "slug"))
    event_detail_tool = tools.get("get_event")
    if slug and event_detail_tool:
        detail = _detail_value(event_detail_tool, {r"slug|eventslug|eventid|id": slug}, cache, ("event", slug), last_call)
        records = _records(detail, ("event", "events"))
        if records:
            raw = {**raw, **records[0]}
    session_tool = tools.get("get_event_sessions")
    if not slug or not session_tool:
        return _normalize(raw, "community_days", "list_events")
    session_value = _detail_value(session_tool, {r"slug|eventslug|eventid|id": slug}, cache, ("sessions", slug), last_call)
    if session_value is None:
        return _normalize(raw, "community_days", "list_events")
    sessions = _records(session_value, ("sessions", "event_sessions", "items"))
    speaker_tool = tools.get("get_speaker")
    enriched_sessions = []
    for session_index, session in enumerate(sessions):
        speakers = _first(session, "speakers", "presenters")
        if not speakers and _first(session, "speakerName", "speaker_name", "speakerId", "speaker_id"):
            speakers = [{"name": _first(session, "speakerName", "speaker_name", "name"),
                         "speakerId": _first(session, "speakerId", "speaker_id")}]
        speakers = speakers if isinstance(speakers, list) else [speakers] if speakers else []
        enriched_speakers = []
        for speaker in speakers:
            if isinstance(speaker, str):
                speaker = {"name": speaker}
            if not isinstance(speaker, dict):
                continue
            speaker_id = _speaker_id(speaker)
            if speaker_id and speaker_tool:
                detail = _detail_value(speaker_tool, {r"speakerid|id": speaker_id}, cache, ("speaker", speaker_id), last_call)
                if detail is not None:
                    speaker = {**speaker, **_merge_speaker_detail(speaker, detail)}
            enriched_speakers.append(speaker)
        enriched_sessions.append({**session, "speakers": enriched_speakers,
                                  "id": _first(session, "id", "sessionId", "session_id", "slug") or str(session_index)})
    raw = {**raw, "sessions": enriched_sessions}
    return _normalize(raw, "community_days", "list_events")


def community_events():
    tools, _ = community_tools()
    names = [str(x.get("name", "")) for x in tools]
    print("Community Days MCP tools/list: " + ", ".join(names), file=sys.stderr)
    allowed = {name.strip() for name in os.environ.get("EVENTS_MCP_TOOLS_ALLOWLIST", "").split(",") if name.strip()}
    if not allowed:
        raise ValueError("Community Days MCP-Abruf gesperrt: EVENTS_MCP_TOOLS_ALLOWLIST ist leer")
    available = {x.get("name"): x for x in tools if x.get("name") in allowed}
    list_tool = available.get("list_events")
    if not list_tool:
        raise ValueError("Community Days MCP-Allowlist enthält list_events nicht")
    enrichment = {name: available.get(name) for name in ("get_event", "get_event_sessions", "get_speaker")}
    cache, last_call, raw_events = {}, [0.0], []
    props = (list_tool.get("inputSchema") or {}).get("properties") or {}
    for start, end in _event_windows():
        args = _tool_args(list_tool, {
            r"when": "range", r"from": start.isoformat(), r"to": end.isoformat(),
            r"source": "community_days", r"limit": "100",
        })
        if args is None:
            raise ValueError("list_events hat nicht unterstützte Pflichtargumente")
        result, _ = mcp_request("tools/call", {"name": "list_events", "arguments": args}, request_id=3000 + start.toordinal())
        value = _mcp_result_value(result)
        records = _records(value, ("events", "items"))
        if len(records) >= 100:
            current = start
            while current <= end:
                daily_args = _tool_args(list_tool, {
                    r"when": "range", r"from": current.isoformat(), r"to": current.isoformat(),
                    r"source": "community_days", r"limit": "100",
                })
                daily_result, _ = mcp_request("tools/call", {"name": "list_events", "arguments": daily_args},
                                              request_id=4000 + current.toordinal())
                daily = _records(_mcp_result_value(daily_result), ("events", "items"))
                if len(daily) >= 100:
                    raise ValueError(f"list_events lieferte am {current.isoformat()} mehr als 100 Events")
                raw_events.extend(daily)
                current += timedelta(days=1)
        else:
            raw_events.extend(records)
    out = [_enrich_event(raw, enrichment, cache, last_call) for raw in raw_events]
    if not out:
        raise ValueError("Community Days MCP lieferte keinen vollständigen Event-Snapshot")
    return out


def _first(data, *keys):
    for key in keys:
        for existing, value in data.items():
            if existing.lower() == key.lower() and value not in (None, ""):
                return value
    return ""


def _date(value):
    if not value:
        return ""
    text = str(value).strip().replace("Z", "+00:00")
    if re.fullmatch(r"\d{8}", text):
        return f"{text[:4]}-{text[4:6]}-{text[6:]}"
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", text):
        return text
    if re.fullmatch(r"\d{8}T\d{6}", text):
        text = f"{text[:4]}-{text[4:6]}-{text[6:8]}T{text[9:11]}:{text[11:13]}:{text[13:15]}"
    try:
        parsed = datetime.fromisoformat(text)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc).isoformat(timespec="minutes").removesuffix("+00:00")
    except ValueError:
        return text[:10] if re.match(r"\d{4}-\d{2}-\d{2}", text) else ""


def _links(value):
    candidates = []
    for candidate in value if isinstance(value, list) else [value]:
        candidates.extend(candidate if isinstance(candidate, list) else [candidate])
    out = []
    for link in candidates:
        if isinstance(link, dict):
            link = link.get("url") or link.get("href") or ""
        link = str(link).strip()
        private_query = any(re.search(r"email|address", key, re.I) for key, _ in parse_qsl(urlparse(link).query))
        if link.startswith("https://") and "@" not in urlparse(link).netloc and not EMAIL.search(link) and not private_query and not re.search(r"email|mailto:", link, re.I):
            if link not in out:
                out.append(link[:500])
    return out[:8]


def _speakers(value):
    out = []
    if isinstance(value, str):
        value = [value]
    for item in value if isinstance(value, list) else []:
        if isinstance(item, str):
            name, links = item, []
        elif isinstance(item, dict):
            name = _first(item, "name", "displayName", "speakerName", "speaker_name")
            links = _links(_first(item, "links", "profileUrl", "profile_url", "url"))
        else:
            continue
        name = re.sub(r"\s+", " ", str(name)).strip()
        if name and not EMAIL.search(name):
            speaker = {"n": name[:100], "links": links}
            if speaker not in out:
                out.append(speaker)
    return out


def _normalize(raw, source, source_id):
    url = _first(raw, "url", "website", "eventUrl", "link", "joinUrl")
    if isinstance(url, dict):
        url = url.get("url") or url.get("href") or ""
    event_url = (_links(url) or [""])[0]
    registration_url = (_links(_first(raw, "registration_url", "registrationUrl")) or [""])[0]
    organizer = _first(raw, "organizer", "organizerName", "host")
    if isinstance(organizer, dict):
        organizer = organizer.get("name", "")
    location = _first(raw, "location", "venue", "city")
    if isinstance(location, dict):
        location = location.get("name", "")
    if not location:
        location = ", ".join(str(_first(raw, key)).strip() for key in ("city", "state_province") if _first(raw, key))
    path_id = urlparse(event_url).path.strip("/")
    fallback_id = f"{source_id}:{path_id}" if path_id else f"{source_id}:{_first(raw, 'title', 'name', 'eventName')}:{_first(raw, 'start', 'startDate', 'start_date', 'date')}"
    source_id = str(_first(raw, "slug", "id", "eventId", "event_id") or fallback_id)
    if "@" in source_id:
        source_id = f"{source}:{_first(raw, 'title', 'name', 'eventName')}:{_first(raw, 'start', 'startDate', 'start_date', 'date')}"
    sessions = []
    for session_index, item in enumerate(_first(raw, "sessions", "eventSessions", "event_sessions", "talks") or []):
        if not isinstance(item, dict):
            continue
        title = _first(item, "title", "name", "sessionTitle", "session_title")
        if title:
            session_id = _first(item, "id", "sessionId", "session_id", "slug", "uid") or str(session_index)
            sessions.append({"ext_key": f"{source}:{source_id}:{session_id}"[:240], "title": str(title)[:180], "start": _date(_first(item, "start", "startDate", "start_date", "startTime", "start_time")),
                             "end": _date(_first(item, "end", "endDate", "end_date", "endTime", "end_time")),
                             "room": str(_first(item, "room", "venue", "location"))[:100],
                                               "speakers": _speakers(item.get("speakers") or item.get("presenters"))})
    title = EMAIL.sub("", str(_first(raw, "title", "name", "eventName", "event_title", "sessionTitle", "session_title", "subject", "summary"))).strip()
    if not sessions and _first(raw, "sessionTitle", "session_title"):
        sessions = [{"ext_key": f"{source}:{source_id}:0"[:240], "title": title[:180], "start": _date(_first(raw, "start", "startDate", "start_date", "startTime", "start_time")),
                     "end": _date(_first(raw, "end", "endDate", "end_date", "endTime", "end_time")), "room": "", "speakers": _speakers(raw.get("speakers"))}]
    speakers = _speakers(raw.get("speakers") or raw.get("presenters"))
    if not sessions and title:
        sessions = []
    mode = _first(raw, "mode", "online", "eventAttendanceMode")
    mode = "online" if mode is True or str(mode).lower() in ("online", "virtual", "onlineeventattendancemode") else "hybrid" if str(mode).lower() == "hybrid" else "onsite"
    status = str(_first(raw, "status", "eventStatus")).lower()
    gone = bool(raw.get("cancelled") or raw.get("isCancelled") or raw.get("canceled") or
                any(term in status for term in ("cancel", "withdraw", "removed", "deleted", "gone")))
    sources = [{"source": source, "ext_id": source_id[:200], "url": event_url}]
    cfs_link = (_links(_first(raw, "call_for_speakers_link", "cfs_url")) or [""])[0]
    sponsor_link = (_links(_first(raw, "call_for_sponsors_link", "sponsor_call_url")) or [""])[0]
    cost_tiers = raw.get("cost_tiers")
    cost_text = json.dumps(cost_tiers, ensure_ascii=False).lower() if cost_tiers is not None else ""
    free = True if re.search(r'("amount"\s*:\s*0|free)', cost_text) else False if cost_text else None
    def coordinate(key, low, high):
        try:
            value = float(raw.get(key))
            return value if low <= value <= high else None
        except (TypeError, ValueError):
            return None
    return {"sources": sources,
            "title": title[:180], "start": _date(_first(raw, "start", "startDate", "start_date", "date", "startTime", "start_time", "beginsAt")),
            "end": _date(_first(raw, "end", "endDate", "end_date", "endTime", "end_time", "endsAt")), "mode": mode,
            "location": str(location)[:160],
            "country": str(_first(raw, "country", "countryCode"))[:80],
            "url": event_url, "tickets_url": registration_url,
            "organizer_name": EMAIL.sub("", str(organizer))[:120],
            "topics": microsoft_topics(raw), "cfs_close": _date(_first(raw, "speaker_call_end_date", "cfs_close", "cfpDeadline", "cfp_deadline", "submissionDeadline", "submission_deadline")),
            "cfs_url": cfs_link, "sponsor_call_close": _date(_first(raw, "sponsor_call_end_date")),
            "sponsor_call_url": sponsor_link, "seeking_sponsor": bool(sponsor_link or _first(raw, "sponsor_call_end_date")),
            "free": free, "latitude": coordinate("latitude", -90, 90), "longitude": coordinate("longitude", -180, 180),
            "gone": gone,
            "sessions": sessions, "speakers": speakers}


def microsoft_topics(item):
    text = " ".join(str(item.get(k, "")) for k in ("title", "slug", "categories", "event_type", "tagline", "description", "summary", "organizer_name")).lower()
    if any(term in text for term in NEGATIVE_TERMS):
        return []
    candidates = {entity for term, entity in MS_TERMS.items() if re.search(r"(?<!\w)" + re.escape(term) + r"(?!\w)", text)}
    sessions = item.get("sessions") or []
    if sessions:
        session_topics = [microsoft_topics({**session, "sessions": []}) for session in sessions]
        relevant = sum(bool(topic_set) for topic_set in session_topics)
        if relevant / len(sessions) < MIN_SESSION_SHARE:
            return []
        candidates.update(topic for topic_set in session_topics for topic in topic_set)
    return sorted(candidates)


def _relevance(item, prefiltered=False):
    if prefiltered:
        return True
    topics = sorted(set(item.get("topics", []) + microsoft_topics(item)))
    return bool(topics)


def _norm_name(value):
    return " ".join(re.sub(r"[^a-z0-9]+", " ", str(value or "").lower()).split())


def _host(item):
    urls = [item.get("url", "")] + [x.get("url", "") for x in item.get("sources", [])]
    return next((urlparse(u).hostname.lower().removeprefix("www.") for u in urls if u.startswith("https://")), "")


def _date_day(item):
    return (item.get("start") or "")[:10]

def _event_order(item, today):
    day = _date_day(item)
    if item.get("gone"):
        return (2, day)
    if day >= today:
        return (0, day)
    return (1, -int(day.replace("-", "")) if re.fullmatch(r"\d{4}-\d{2}-\d{2}", day) else 0)


def merge_duplicates(items):
    parents = list(range(len(items)))
    def root(n):
        while parents[n] != n:
            parents[n] = parents[parents[n]]
            n = parents[n]
        return n
    for i, a in enumerate(items):
        for j in range(i):
            b = items[j]
            days = abs((datetime.fromisoformat(_date_day(a)) - datetime.fromisoformat(_date_day(b))).days) if _date_day(a) and _date_day(b) else 99
            ids_a = {(x.get("source"), x.get("ext_id")) for x in a.get("sources", [])}
            ids_b = {(x.get("source"), x.get("ext_id")) for x in b.get("sources", [])}
            source_conflict = any(source_a == source_b and id_a != id_b
                                  for source_a, id_a in ids_a for source_b, id_b in ids_b)
            if not source_conflict and (ids_a & ids_b or (_norm_name(a.get("title")) == _norm_name(b.get("title")) and days <= 1 and _host(a) == _host(b))):
                parents[root(i)] = root(j)
    groups = {}
    for i, item in enumerate(items):
        groups.setdefault(root(i), []).append(item)
    merged = []
    for group in groups.values():
        first = dict(group[0])
        first["sources"] = []
        first["sessions"] = []
        first["speakers"] = []
        for item in group:
            first["sources"].extend(item.get("sources", []))
            for key in ("sessions", "speakers"):
                for value in item.get(key, []):
                    if value not in first[key]:
                        first[key].append(value)
            for key in ("end", "mode", "location", "country", "url", "organizer_name", "cfs_close"):
                if not first.get(key) and item.get(key):
                    first[key] = item[key]
            first["topics"] = sorted(set(first.get("topics", []) + item.get("topics", [])))
        first["sources"] = sorted(first["sources"], key=lambda x: (x["source"], x["ext_id"]))
        host = _host(first)
        source_text = "|".join(f"{source.get('source')}:{source.get('ext_id')}" for source in first["sources"])
        fp_text = "|".join((_norm_name(first["title"]), min(_date_day(x) for x in group if _date_day(x)) if any(_date_day(x) for x in group) else "", host, source_text))
        first["fp"] = hashlib.sha256(fp_text.encode()).hexdigest()[:32]
        first["hash"] = hashlib.sha256(json.dumps(first, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
        merged.append(first)
    return sorted(merged, key=lambda x: (x.get("start", ""), x.get("title", "").lower()))


def retain_previous(previous, current, now=None):
    today = (now or datetime.now(timezone.utc)).date().isoformat()
    old_by_source = {(source.get("source"), source.get("ext_id")): old for old in previous
                     for source in old.get("sources", []) if source.get("source") and source.get("ext_id")}
    by_fp = {}
    for original in current:
        item = dict(original)
        old = next((old_by_source[(source.get("source"), source.get("ext_id"))]
                    for source in item.get("sources", [])
                    if (source.get("source"), source.get("ext_id")) in old_by_source), None)
        if old:
            item["fp"] = old.get("fp", item["fp"])
        if item.get("gone"):
            item["gone_at"] = old.get("gone_at") if old and old.get("gone_at") else (now or datetime.now(timezone.utc)).isoformat(timespec="seconds")
        else:
            item.pop("gone_at", None)
        occupied = by_fp.get(item["fp"])
        if occupied:
            current_ids = sorted((x.get("source"), x.get("ext_id")) for x in item.get("sources", []))
            occupied_ids = sorted((x.get("source"), x.get("ext_id")) for x in occupied.get("sources", []))
            if current_ids != occupied_ids:
                fp_text = item["fp"] + "|" + json.dumps(current_ids, ensure_ascii=False)
                item["fp"] = hashlib.sha256(fp_text.encode()).hexdigest()[:32]
        digest = dict(item)
        digest.pop("hash", None)
        item["hash"] = hashlib.sha256(json.dumps(digest, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
        by_fp[item["fp"]] = item
    previous_active = [item for item in previous if not item.get("gone") and _date_day(item) >= today]
    current_active = sum(1 for item in by_fp.values() if not item.get("gone") and _date_day(item) >= today)
    allow_gone = not previous_active or current_active >= len(previous_active) * 0.8
    for old in previous:
        fp = old.get("fp")
        if not fp:
            continue
        old_ids = {(source.get("source"), source.get("ext_id")) for source in old.get("sources", [])
                   if source.get("source") and source.get("ext_id")}
        item = next((candidate for candidate in by_fp.values()
                     if old_ids & {(source.get("source"), source.get("ext_id")) for source in candidate.get("sources", [])}), None)
        if item is None and fp in by_fp and old_ids:
            occupied_ids = {(source.get("source"), source.get("ext_id")) for source in by_fp[fp].get("sources", [])}
            if not old_ids & occupied_ids:
                fp = hashlib.sha256((fp + "|previous|" + json.dumps(sorted(old_ids), ensure_ascii=False)).encode()).hexdigest()[:32]
        if old.get("gone") and old.get("gone_at"):
            try:
                if (now or datetime.now(timezone.utc)).timestamp() - datetime.fromisoformat(old["gone_at"]).timestamp() > 30 * 86400:
                    continue
            except (TypeError, ValueError):
                pass
        elif old.get("gone"):
            old = {**old, "gone_at": (now or datetime.now(timezone.utc)).isoformat(timespec="seconds")}
        if item is None and fp not in by_fp:
            if old.get("gone"):
                item = dict(old)
            elif _date_day(old) < today or not allow_gone:
                item = {**old, "gone": False}
            else:
                item = {**old, "gone": True, "gone_at": (now or datetime.now(timezone.utc)).isoformat(timespec="seconds")}
            item.pop("hash", None)
            item["hash"] = hashlib.sha256(json.dumps(item, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
            by_fp[fp] = item
            continue
        if item is None:
            item = by_fp[fp]
        for field in ("end", "location", "country", "url", "organizer_name", "cfs_close"):
            if not item.get(field):
                item[field] = old.get(field, "")
        digest = dict(item)
        digest.pop("hash", None)
        item["hash"] = hashlib.sha256(json.dumps(digest, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
    cutoff = (now or datetime.now(timezone.utc)).timestamp() - 30 * 86400
    kept = []
    for item in by_fp.values():
        if item.get("gone_at"):
            try:
                if datetime.fromisoformat(item["gone_at"]).timestamp() < cutoff:
                    continue
            except (TypeError, ValueError):
                pass
        kept.append(item)
    return sorted(kept, key=lambda item: (_event_order(item, today), item.get("title", "").lower()))


def scrape(policy_approved=False):
    if not policy_approved:
        raise RuntimeError("Erst nach Erkundung und Freigabe EVENTS_POLICY_APPROVED=1 setzen")
    yield from community_events()


def main():
    try:
        items = merge_duplicates(list(scrape(os.environ.get("EVENTS_POLICY_APPROVED") == "1")))
        previous = json.loads(OUT.read_text("utf-8")).get("items", []) if OUT.exists() else []
        items = retain_previous(previous, items)
    except Exception as exc:
        print(f"Event-Scraper: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1
    OUT.parent.mkdir(parents=True, exist_ok=True)
    previous_updated = ""
    try:
        previous_updated = json.loads(OUT.read_text("utf-8")).get("updated", "")
    except (OSError, ValueError):
        pass
    updated = previous_updated if items == previous else datetime.now(timezone.utc).isoformat(timespec="seconds")
    data = {"updated": updated, "snapshot_complete": True, "items": items}
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", "utf-8")
    print(f"{len(items)} Microsoft-relevante Events gespeichert.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
