"""Sammelt öffentliche Fakten zu Microsoft-Community-Events."""
import hashlib
import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qsl, urlparse

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "ext_events.json"
STATE = ROOT / "data" / "ext_events_state.json"
UA = "M365FM-event-scraper/1.0 (+https://www.m365.fm/contact/)"
MCP_URL = "https://mcp.communitydays.org"
PNP_URL = "https://pnp.github.io/ical/calendar.json"
DEVELOPERS_URLS = ("https://developers.events/all-events.json", "https://developers.events/all-cfps.json")
GLOBALAI_URL = "https://globalai.community/events/"
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
FETCH_INTERVAL = 6 * 60 * 60
EMAIL = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)


def get(url, accept="application/json"):
    request = urllib.request.Request(url, headers={"user-agent": UA, "accept": accept})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def mcp_payload(response):
    raw = response.read().decode("utf-8")
    if "text/event-stream" in response.headers.get("content-type", ""):
        rows = [line[6:] for line in raw.splitlines() if line.startswith("data: ")]
        if not rows:
            raise ValueError("MCP-Antwort enthaelt keine Daten")
        return json.loads(rows[-1])
    return json.loads(raw)


def mcp_request(method, params=None, session=None, request_id=1):
    body = json.dumps({"jsonrpc": "2.0", "id": request_id, "method": method, "params": params or {}}).encode()
    headers = {"content-type": "application/json", "accept": "application/json, text/event-stream", "user-agent": UA}
    if session:
        headers["Mcp-Session-Id"] = session
        headers["MCP-Protocol-Version"] = "2025-03-26"
    request = urllib.request.Request(MCP_URL, data=body, headers=headers)
    with urllib.request.urlopen(request, timeout=45) as response:
        return mcp_payload(response), response.headers.get("Mcp-Session-Id", session)


def community_tools():
    initialized, session = mcp_request("initialize", {
        "protocolVersion": "2025-03-26", "capabilities": {}, "clientInfo": {"name": "m365fm-events", "version": "1.0"},
    })
    if initialized.get("error"):
        raise ValueError("MCP initialize fehlgeschlagen")
    notification = urllib.request.Request(MCP_URL, data=b'{"jsonrpc":"2.0","method":"notifications/initialized"}',
        headers={"content-type": "application/json", "accept": "application/json, text/event-stream", "user-agent": UA,
                 "Mcp-Session-Id": session or ""})
    try:
        urllib.request.urlopen(notification, timeout=30).close()
    except Exception:
        pass
    tools, cursor = [], None
    for index in range(20):
        params = {"cursor": cursor} if cursor else {}
        result, _ = mcp_request("tools/list", params, session=session, request_id=index + 2)
        data = result.get("result", {})
        tools.extend(data.get("tools", []))
        cursor = data.get("nextCursor")
        if not cursor:
            break
    return tools, session


def _safe_args(tool, query="Microsoft"):
    schema = tool.get("inputSchema") or {}
    props, required = schema.get("properties") or {}, set(schema.get("required") or [])
    args = {}
    for key, prop in props.items():
        if key not in required:
            continue
        kind = prop.get("type")
        if prop.get("enum"):
            args[key] = prop["enum"][0]
        elif kind == "string" and re.search(r"query|search|term|topic", key, re.I):
            args[key] = query
        elif kind == "integer" and re.search(r"limit|page|offset|size", key, re.I):
            args[key] = 100 if re.search(r"limit|size", key, re.I) else 1 if "page" in key.lower() else 0
        elif kind == "boolean":
            args[key] = False
        else:
            return None
    for key, prop in props.items():
        if key in args or key in required:
            continue
        if prop.get("type") == "integer" and re.search(r"limit|size|page|offset", key, re.I):
            args[key] = 100 if re.search(r"limit|size", key, re.I) else 1 if "page" in key.lower() else 0
    return args


def _mcp_result_value(result):
    result = result.get("result", {})
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


def community_events():
    tools, session = community_tools()
    names = [str(x.get("name", "")) for x in tools]
    print("Community Days MCP tools/list: " + ", ".join(names), file=sys.stderr)
    selected = [x for x in tools if re.search(r"event|session", (x.get("name", "") + " " + x.get("description", "")), re.I)
                and not re.search(r"create|update|delete|submit|write|admin|register", x.get("name", ""), re.I)]
    out = []
    for index, tool in enumerate(selected[:10], 3):
        schema = tool.get("inputSchema") or {}
        props = schema.get("properties") or {}
        page_key = next((key for key in props if re.search(r"^page$", key, re.I)), None)
        offset_key = next((key for key in props if re.search(r"^offset$", key, re.I)), None)
        limit_key = next((key for key in props if re.search(r"limit|page.?size|per.?page", key, re.I)), None)
        pages = 20 if page_key or offset_key else 1
        for page in range(pages):
            args = _safe_args(tool)
            if args is None:
                break
            if page_key:
                args[page_key] = page + 1
            if offset_key:
                args[offset_key] = page * 100
            result, _ = mcp_request("tools/call", {"name": tool["name"], "arguments": args}, session, index + page * 10)
            value = _mcp_result_value(result)
            found = _event_objects(value, "community_days", tool["name"])
            out.extend(found)
            batch_size = args.get(limit_key, 100) if limit_key else 100
            if not (page_key or offset_key) or (limit_key and len(found) < batch_size) or not found:
                break
    return out


def _event_objects(value, source, namespace):
    found = []
    if isinstance(value, list):
        for item in value:
            found.extend(_event_objects(item, source, namespace))
    elif isinstance(value, dict):
        title = _first(value, "title", "name", "eventName", "event_title", "sessionTitle", "session_title", "subject")
        start = _first(value, "start", "startDate", "start_date", "date", "startTime", "start_time", "beginsAt")
        if title and start:
            found.append(_normalize(value, source, namespace))
        else:
            for child in value.values():
                if isinstance(child, (dict, list)):
                    found.extend(_event_objects(child, source, namespace))
    return found


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
    if re.fullmatch(r"\d{8}T\d{6}", text):
        return f"{text[:4]}-{text[4:6]}-{text[6:8]}T{text[9:11]}:{text[11:13]}Z"
    try:
        return datetime.fromisoformat(text).isoformat(timespec="minutes").replace("+00:00", "Z")
    except ValueError:
        return text[:10] if re.match(r"\d{4}-\d{2}-\d{2}", text) else ""


def _links(value):
    candidates = value if isinstance(value, list) else [value]
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


def _published_sessionize_urls(value):
    found = set()
    if isinstance(value, dict):
        for child in value.values():
            found.update(_published_sessionize_urls(child))
    elif isinstance(value, list):
        for child in value:
            found.update(_published_sessionize_urls(child))
    elif isinstance(value, str):
        for match in re.findall(r"https://(?:www\.)?sessionize\.com/api/v2/[A-Za-z0-9]+/view/All/?", value):
            found.add(match.replace("www.sessionize.com", "sessionize.com").rstrip("/"))
        for slug in re.findall(r"https://(?:www\.)?sessionize\.com/([A-Za-z0-9-]+)/?", value):
            if slug.lower() != "api":
                found.add(f"https://sessionize.com/{slug}/")
    return sorted(found)


def _normalize(raw, source, source_id):
    url = _first(raw, "url", "website", "eventUrl", "link", "joinUrl")
    if isinstance(url, dict):
        url = url.get("url") or url.get("href") or ""
    event_url = (_links(url) or [""])[0]
    organizer = _first(raw, "organizer", "organizerName", "host")
    if isinstance(organizer, dict):
        organizer = organizer.get("name", "")
    location = _first(raw, "location", "venue", "city")
    if isinstance(location, dict):
        location = location.get("name", "")
    sessions = []
    for item in _first(raw, "sessions", "eventSessions", "event_sessions", "talks") or []:
        if not isinstance(item, dict):
            continue
        title = _first(item, "title", "name", "sessionTitle", "session_title")
        if title:
            sessions.append({"title": str(title)[:180], "start": _date(_first(item, "start", "startDate", "start_date", "startTime", "start_time")),
                             "end": _date(_first(item, "end", "endDate", "end_date", "endTime", "end_time")),
                             "room": str(_first(item, "room", "venue", "location"))[:100],
                                               "speakers": _speakers(item.get("speakers") or item.get("presenters"))})
    title = EMAIL.sub("", str(_first(raw, "title", "name", "eventName", "event_title", "sessionTitle", "session_title", "subject", "summary"))).strip()
    if not sessions and _first(raw, "sessionTitle", "session_title"):
        sessions = [{"title": title[:180], "start": _date(_first(raw, "start", "startDate", "start_date", "startTime", "start_time")),
                     "end": _date(_first(raw, "end", "endDate", "end_date", "endTime", "end_time")), "room": "", "speakers": _speakers(raw.get("speakers"))}]
    speakers = _speakers(raw.get("speakers") or raw.get("presenters"))
    if not sessions and title:
        sessions = []
    source_id = str(_first(raw, "id", "eventId", "event_id", "slug") or f"{source_id}:{urlparse(event_url).path}:{title}:{_first(raw, 'start', 'startDate', 'start_date', 'date')}")
    if "@" in source_id:
        source_id = f"{source}:{title}:{_first(raw, 'start', 'startDate', 'start_date', 'date')}"
    mode = _first(raw, "mode", "online", "eventAttendanceMode")
    mode = "online" if mode is True or str(mode).lower() in ("online", "virtual", "onlineeventattendancemode") else "hybrid" if str(mode).lower() == "hybrid" else "onsite"
    sources = [{"source": source, "ext_id": source_id[:200], "url": event_url}]
    if source in ("community_days", "developers_events"):
        for endpoint in _published_sessionize_urls(raw):
            path = urlparse(endpoint).path.strip("/").split("/")
            source_id_part = path[2] if path[:2] == ["api", "v2"] else path[0]
            sources.append({"source": "sessionize", "ext_id": source_id_part, "url": endpoint})
    return {"sources": sources,
            "title": title[:180], "start": _date(_first(raw, "start", "startDate", "start_date", "date", "startTime", "start_time", "beginsAt")),
            "end": _date(_first(raw, "end", "endDate", "end_date", "endTime", "end_time", "endsAt")), "mode": mode,
            "location": str(location)[:160],
            "country": str(_first(raw, "country", "countryCode"))[:80],
            "url": event_url,
            "organizer_name": EMAIL.sub("", str(organizer))[:120],
            "topics": microsoft_topics(raw), "cfs_close": _date(_first(raw, "cfs_close", "cfpDeadline", "cfp_deadline", "submissionDeadline", "submission_deadline")),
            "sessions": sessions, "speakers": speakers}


def microsoft_topics(item):
    text = " ".join(str(item.get(k, "")) for k in ("title", "slug", "categories", "description", "summary", "organizer_name")).lower()
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


def _pnp():
    data = json.loads(get(PNP_URL))
    retrieved = _date(data.get("lastRetrieved", ""))
    try:
        age = (datetime.now(timezone.utc).date() - datetime.fromisoformat(retrieved).date()).days
    except ValueError:
        return []
    if age > 30:
        print(f"PnP-Kalender ist {age} Tage alt; keine veralteten Termine importiert.", file=sys.stderr)
        return []
    out = []
    for event in data.get("events", []):
        title = str(event.get("summary", "")).strip()
        if not re.search(r"\bcall\b", title, re.I):
            continue
        occurrences = [x for x in event.get("nextOccurrences", []) if x.get("date")]
        if not occurrences:
            occurrences = [{"date": event.get("startTime", ""), "status": "scheduled"}]
        for occurrence in occurrences:
            start = occurrence.get("date", "")
            if not start:
                continue
            item = _normalize({**event, "title": title, "start": start, "url": event.get("joinUrl", ""),
                               "id": f'{event.get("uid", "pnp")}:{start}'}, "pnp", "calendar")
            item["mode"] = "online"
            item["location"] = "Online"
            out.append(item)
    return out


def _developers_events():
    out = []
    for url in DEVELOPERS_URLS:
        data = json.loads(get(url))
        out.extend(_event_objects(data, "developers_events", url.rsplit("/", 1)[-1]))
    return out


def _sessionize_urls(items):
    urls = set()
    for item in items:
        for source in item.get("sources", []):
            if source.get("source") in ("community_days", "developers_events", "sessionize"):
                for url in (source.get("url", ""), item.get("url", "")):
                    if re.fullmatch(r"https://sessionize\.com/api/v2/[A-Za-z0-9]+/view/All/?", url):
                        urls.add(url.rstrip("/"))
                    elif urlparse(url).hostname in ("sessionize.com", "www.sessionize.com") and re.fullmatch(r"/[A-Za-z0-9-]+/?", urlparse(url).path):
                        urls.add("https://sessionize.com" + urlparse(url).path.rstrip("/") + "/")
    return sorted(urls)


class SessionizeFacts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.data = {"sessions": []}
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta":
            key = (attrs.get("property") or attrs.get("name") or "").lower()
            value = attrs.get("content", "")
            fields = {
                "og:title": "title", "event:start_time": "start", "event:end_time": "end",
                "event:location": "location", "event:cfp_deadline": "cfs_close", "cfpdeadline": "cfs_close",
            }
            if key in fields and value:
                self.data[fields[key]] = value
        if tag == "time" and attrs.get("datetime") and not self.data.get("start"):
            self.data["start"] = attrs["datetime"]


def _session_objects(value):
    found = []
    if isinstance(value, list):
        for item in value:
            found.extend(_session_objects(item))
    elif isinstance(value, dict):
        title = _first(value, "title", "name", "sessionTitle", "session_title")
        has_session_fields = any(key.lower() in ("startsat", "start", "startdate", "starttime", "speakers", "presenters")
                                 for key in value)
        has_nested_sessions = any(key.lower() in ("sessions", "talks", "eventsessions") for key in value)
        if title and has_session_fields and not has_nested_sessions:
            found.append({"title": str(title)[:180],
                          "start": _date(_first(value, "start", "startDate", "startTime", "startsAt")),
                          "end": _date(_first(value, "end", "endDate", "endTime", "endsAt")),
                          "room": str(_first(value, "room", "venue", "location"))[:100],
                          "speakers": _speakers(value.get("speakers") or value.get("presenters"))})
        else:
            for child in value.values():
                if isinstance(child, (dict, list)):
                    found.extend(_session_objects(child))
    return found


def _sessionize(urls):
    out = {}
    for url in urls:
        state = json.loads(STATE.read_text("utf-8")) if STATE.exists() else {}
        key = hashlib.sha256(url.encode()).hexdigest()
        fetched = state.get("sessionize_fetched", {}).get(key, "")
        now = datetime.now(timezone.utc)
        try:
            if fetched and (now - datetime.fromisoformat(fetched.replace("Z", "+00:00"))).total_seconds() < FETCH_INTERVAL:
                continue
        except ValueError:
            pass
        if "/api/v2/" in url:
            out[url] = {"sessions": _session_objects(json.loads(get(url)))}
        else:
            path = urlparse(url).path.strip("/")
            parser = SessionizeFacts()
            parser.feed(get(url, "text/html").decode("utf-8", "replace"))
            out[url] = parser.data
        state.setdefault("sessionize_fetched", {})[key] = now.isoformat(timespec="seconds")
        STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", "utf-8")
    return out


def _attach_sessionize(items, facts):
    for item in items:
        for source in item.get("sources", []):
            extra = facts.get(source.get("url", "")) if source.get("source") == "sessionize" else None
            if not extra:
                continue
            sessions = {json.dumps(session, sort_keys=True): session for session in item.get("sessions", [])}
            sessions.update({json.dumps(session, sort_keys=True): session for session in extra.get("sessions", [])})
            item["sessions"] = list(sessions.values())
            for field in ("start", "end", "location", "cfs_close"):
                if not item.get(field):
                    item[field] = extra.get(field, "")
    return items


class EventLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        link = attrs.get("href", "")
        if tag == "a" and link.lower().endswith(".ics") and link.startswith("https://"):
            self.urls.append(link)


def _ics_events(page_url):
    parser = EventLinks()
    parser.feed(get(page_url, "text/html").decode("utf-8", "replace"))
    out = []
    for url in dict.fromkeys(parser.urls):
        raw = get(url, "text/calendar").decode("utf-8", "replace")
        for block in raw.replace("\r\n ", "").split("BEGIN:VEVENT")[1:]:
            fields = dict(re.findall(r"^(SUMMARY|DTSTART[^:]*|DTEND[^:]*|URL):([^\r\n]+)", block, re.M))
            if fields.get("SUMMARY") and fields.get("DTSTART"):
                out.append(_normalize({"title": fields["SUMMARY"], "start": fields["DTSTART"][:10],
                                       "end": fields.get("DTEND", "")[:10], "url": fields.get("URL", url)}, "global_ai", url))
    return out


def _globalai():
    if os.environ.get("EVENTS_GLOBALAI") != "1":
        return []
    state = json.loads(STATE.read_text("utf-8")) if STATE.exists() else {}
    previous = state.get("globalai_fetched", "")
    if previous:
        try:
            when = datetime.fromisoformat(previous.replace("Z", "+00:00"))
            if (datetime.now(timezone.utc) - when).total_seconds() < 86400:
                return []
        except ValueError:
            pass
    items = _ics_events(GLOBALAI_URL)
    state["globalai_fetched"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", "utf-8")
    return items


def _norm_name(value):
    return " ".join(re.sub(r"[^a-z0-9]+", " ", str(value or "").lower()).split())


def _host(item):
    urls = [item.get("url", "")] + [x.get("url", "") for x in item.get("sources", [])]
    return next((urlparse(u).hostname.lower().removeprefix("www.") for u in urls if u.startswith("https://")), "")


def _date_day(item):
    return (item.get("start") or "")[:10]


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
            if _norm_name(a.get("title")) == _norm_name(b.get("title")) and days <= 1 and _host(a) == _host(b):
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
        fp_text = "|".join((_norm_name(first["title"]), min(_date_day(x) for x in group if _date_day(x)) if any(_date_day(x) for x in group) else "", host))
        first["fp"] = hashlib.sha256(fp_text.encode()).hexdigest()[:32]
        first["hash"] = hashlib.sha256(json.dumps(first, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
        merged.append(first)
    return sorted(merged, key=lambda x: (x.get("start", ""), x.get("title", "").lower()))


def retain_previous(previous, current):
    by_fp = {item["fp"]: dict(item) for item in current}
    for old in previous:
        fp = old.get("fp")
        if not fp:
            continue
        if fp not in by_fp:
            by_fp[fp] = old
            continue
        item = by_fp[fp]
        for field in ("sources", "speakers"):
            item[field] = list({json.dumps(x, sort_keys=True): x for x in old.get(field, []) + item.get(field, [])}.values())
        sessions = {}
        for session in old.get("sessions", []) + item.get("sessions", []):
            key = (session.get("title", ""), session.get("start", ""), session.get("room", ""))
            if key not in sessions:
                sessions[key] = dict(session)
                sessions[key]["speakers"] = list(session.get("speakers", []))
            else:
                speakers = sessions[key]["speakers"] + session.get("speakers", [])
                sessions[key]["speakers"] = list({json.dumps(x, sort_keys=True): x for x in speakers}.values())
        item["sessions"] = list(sessions.values())
        item["topics"] = sorted(set(old.get("topics", []) + item.get("topics", [])))
        for field in ("end", "location", "country", "url", "organizer_name", "cfs_close"):
            if not item.get(field):
                item[field] = old.get(field, "")
        digest = dict(item)
        digest.pop("hash", None)
        item["hash"] = hashlib.sha256(json.dumps(digest, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
    return sorted(by_fp.values(), key=lambda x: (x.get("start", ""), x.get("title", "").lower()))


def scrape(policy_approved=False):
    if not policy_approved:
        raise RuntimeError("Erst nach Erkundung und Freigabe EVENTS_POLICY_APPROVED=1 setzen")
    candidates = []
    if os.environ.get("EVENTS_COMMUNITYDAYS") == "1":
        candidates.extend(community_events())
    if os.environ.get("EVENTS_PNP") == "1":
        candidates.extend(_pnp())
    if os.environ.get("EVENTS_DEVELOPERS_EVENTS") == "1":
        candidates.extend(_developers_events())
    if os.environ.get("EVENTS_SESSIONIZE") == "1":
        _attach_sessionize(candidates, _sessionize(_sessionize_urls(candidates)))
    candidates.extend(_globalai())
    for item in candidates:
        prefiltered = any(x["source"] == "community_days" for x in item.get("sources", []))
        if _relevance(item, prefiltered):
            yield item


def main():
    try:
        items = merge_duplicates(list(scrape(os.environ.get("EVENTS_POLICY_APPROVED") == "1")))
        previous = json.loads(OUT.read_text("utf-8")).get("items", []) if OUT.exists() else []
        items = retain_previous(previous, items)
    except Exception as exc:
        print(f"Event-Scraper: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 1
    OUT.parent.mkdir(parents=True, exist_ok=True)
    data = {"updated": datetime.now(timezone.utc).isoformat(timespec="seconds"), "items": items}
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", "utf-8")
    print(f"{len(items)} Microsoft-relevante Events gespeichert.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
