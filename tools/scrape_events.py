"""Sammelt öffentliche Fakten zu Microsoft-Community-Events."""
import hashlib
import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qsl, urlparse

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get("EVENTS_OUTPUT", "/tmp/m365-fm-ext-events.json"))
STATE = Path(os.environ.get("EVENTS_STATE", "/tmp/m365-fm-ext-events-state.json"))
UA = "M365FM-event-scraper/1.0 (+https://www.m365.fm/contact/)"
MCP_URL = "https://mcp.communitydays.org"
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
    for index in range(100):
        params = {"cursor": cursor} if cursor else {}
        result, _ = mcp_request("tools/list", params, session=session, request_id=index + 2)
        if result.get("error") or result.get("result", {}).get("isError"):
            raise ValueError("MCP tools/list meldete einen Fehler")
        data = result.get("result", {})
        tools.extend(data.get("tools", []))
        cursor = data.get("nextCursor")
        if not cursor:
            break
    else:
        raise ValueError("MCP tools/list ueberschritt das Seitenlimit")
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


def _pagination_info(value):
    if isinstance(value, dict):
        cursor = value.get("nextCursor")
        total = value.get("total")
        if cursor is not None or total is not None:
            return cursor, total
        for child in value.values():
            cursor, total = _pagination_info(child)
            if cursor is not None or total is not None:
                return cursor, total
    elif isinstance(value, list):
        for child in value:
            cursor, total = _pagination_info(child)
            if cursor is not None or total is not None:
                return cursor, total
    return None, None


def community_events():
    tools, session = community_tools()
    names = [str(x.get("name", "")) for x in tools]
    print("Community Days MCP tools/list: " + ", ".join(names), file=sys.stderr)
    allowed = {name.strip() for name in os.environ.get("EVENTS_MCP_TOOLS_ALLOWLIST", "").split(",") if name.strip()}
    if not allowed:
        raise ValueError("Community Days MCP-Abruf gesperrt: EVENTS_MCP_TOOLS_ALLOWLIST ist leer")
    selected = [x for x in tools if x.get("name") in allowed and re.search(r"event", x.get("name", ""), re.I)
                and not re.search(r"session|create|update|delete|submit|write|admin|register", x.get("name", ""), re.I)]
    if not selected:
        raise ValueError("Community Days MCP meldet kein geeignetes Read-only-Event-Tool")
    out = []
    for index, tool in enumerate(selected, 3):
        schema = tool.get("inputSchema") or {}
        props = schema.get("properties") or {}
        page_key = next((key for key in props if re.search(r"^page$", key, re.I)), None)
        offset_key = next((key for key in props if re.search(r"^offset$", key, re.I)), None)
        cursor_key = next((key for key in props if re.search(r"^cursor$", key, re.I)), None)
        limit_key = next((key for key in props if re.search(r"limit|page.?size|per.?page", key, re.I)), None)
        cursor, page, offset, loaded, total = None, 1, 0, 0, None
        for page_index in range(100):
            args = _safe_args(tool)
            if args is None:
                print(f"MCP-Tool {tool['name']} wegen nicht unterstuetzter Pflichtargumente uebersprungen", file=sys.stderr)
                break
            if page_key:
                args[page_key] = page
            if offset_key:
                args[offset_key] = offset
            if cursor_key and cursor:
                args[cursor_key] = cursor
            result, _ = mcp_request("tools/call", {"name": tool["name"], "arguments": args}, session, index * 100 + page_index)
            value = _mcp_result_value(result)
            found = _event_objects(value, "community_days", tool["name"])
            out.extend(found)
            loaded += len(found)
            batch_size = args.get(limit_key, 100) if limit_key else 100
            response = result.get("result", {})
            next_cursor, total_value = _pagination_info(response)
            if next_cursor is None and total_value is None:
                next_cursor, total_value = _pagination_info(value)
            if total_value is not None:
                total = int(total_value)
            if not found:
                if total is not None and loaded < total:
                    raise ValueError(f"MCP-Tool {tool['name']} lieferte weniger Events als total angibt")
                break
            if total is not None and loaded >= total:
                break
            if cursor_key:
                if not next_cursor:
                    if total is not None and loaded < total:
                        raise ValueError(f"MCP-Tool {tool['name']} hat vor total keinen nextCursor geliefert")
                    break
                cursor = next_cursor
            elif page_key:
                page += 1
            elif offset_key:
                offset += batch_size
            else:
                if total is not None and loaded < total:
                    raise ValueError(f"MCP-Tool {tool['name']} ist paginiert, bietet aber keinen Seitenparameter")
                break
        else:
            raise ValueError(f"MCP-Tool {tool['name']} ueberschritt das Seitenlimit")
    if not out:
        raise ValueError("Community Days MCP lieferte keinen vollständigen Event-Snapshot")
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
    path_id = urlparse(event_url).path.strip("/")
    fallback_id = f"{source_id}:{path_id}" if path_id else f"{source_id}:{_first(raw, 'title', 'name', 'eventName')}:{_first(raw, 'start', 'startDate', 'start_date', 'date')}"
    source_id = str(_first(raw, "id", "eventId", "event_id", "slug") or fallback_id)
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
    return {"sources": sources,
            "title": title[:180], "start": _date(_first(raw, "start", "startDate", "start_date", "date", "startTime", "start_time", "beginsAt")),
            "end": _date(_first(raw, "end", "endDate", "end_date", "endTime", "end_time", "endsAt")), "mode": mode,
            "location": str(location)[:160],
            "country": str(_first(raw, "country", "countryCode"))[:80],
            "url": event_url,
            "organizer_name": EMAIL.sub("", str(organizer))[:120],
            "topics": microsoft_topics(raw), "cfs_close": _date(_first(raw, "cfs_close", "cfpDeadline", "cfp_deadline", "submissionDeadline", "submission_deadline")),
            "gone": gone,
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
        if old.get("gone") and old.get("gone_at"):
            try:
                if (now or datetime.now(timezone.utc)).timestamp() - datetime.fromisoformat(old["gone_at"]).timestamp() > 30 * 86400:
                    continue
            except (TypeError, ValueError):
                pass
        elif old.get("gone"):
            old = {**old, "gone_at": (now or datetime.now(timezone.utc)).isoformat(timespec="seconds")}
        if fp not in by_fp:
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
