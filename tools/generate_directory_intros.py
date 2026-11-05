#!/usr/bin/env python3
"""Erzeugt faktengebundene Einleitungen für Verzeichnis-Landingpages."""
import hashlib
import json
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from ai_gateway import anthropic_request, check_budget, estimated_eur, report_usage, urlopen

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "data" / "directory_intros.json"
API = os.environ.get("DIRECTORY_API", "https://api-dub.m365.fm").rstrip("/")
MODEL = os.environ.get("DIRECTORY_INTRO_MODEL", "claude-haiku-5-5")
LIMIT = max(1, min(50, int(os.environ.get("DIRECTORY_INTRO_LIMIT", "25"))))


def _slug(value):
    import unicodedata
    value = unicodedata.normalize("NFKD", str(value or "")).encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", value).strip("-"))[:70]


def _country(value):
    normalized = str(value or "").strip().lower()
    known = {"germany": "de", "deutschland": "de", "united states": "us", "usa": "us", "united kingdom": "gb", "uk": "gb", "great britain": "gb"}
    return known.get(normalized, normalized if re.fullmatch(r"[a-z]{2}", normalized) else _slug(value))


def _fetch_items():
    items = []
    for page in range(1, 21):
        url = f"{API}/api/directory?limit=100&page={page}"
        with urllib.request.urlopen(url, timeout=20) as response:
            data = json.loads(response.read().decode("utf-8"))
        batch = data.get("items") or []
        items.extend(batch)
        if not data.get("has_more") or not batch:
            break
    return items


def _page_facts(items, country):
    types = {kind: sum(item.get("type") == kind for item in items) for kind in ("expert", "company", "event")}
    topics, programs, langs = {}, {}, {}
    for item in items:
        for value in item.get("topics") or []:
            topics[value] = topics.get(value, 0) + 1
        for value in item.get("programs") or []:
            programs[value] = programs.get(value, 0) + 1
        if item.get("lang"):
            langs[item["lang"]] = langs.get(item["lang"], 0) + 1
    events = sorted((item for item in items if item.get("type") == "event"), key=lambda item: item.get("start", ""))
    return {
        "country": country,
        "entries": len(items),
        "types": types,
        "top_topics": [key for key, _ in sorted(topics.items(), key=lambda pair: (-pair[1], pair[0]))[:3]],
        "topics": dict(sorted(topics.items(), key=lambda pair: (-pair[1], pair[0]))[:8]),
        "programs": dict(sorted(programs.items(), key=lambda pair: (-pair[1], pair[0]))[:8]),
        "languages": dict(sorted(langs.items())),
        "next_event": [{"name": event.get("name", ""), "date": event.get("start", "")} for event in events[:3]],
    }


def collect_facts(items):
    groups = {}
    for item in items:
        country_name = str(item.get("country") or "").strip()
        country = _country(country_name)
        if not country:
            continue
        groups.setdefault(f"country:{country}", []).append(item)
        city = str(item.get("city") or "").strip()
        if city:
            groups.setdefault(f"city:{country}:{_slug(city)}", []).append(item)
        for topic in item.get("topics") or []:
            if re.fullmatch(r"[a-z0-9-]{2,48}", str(topic)):
                groups.setdefault(f"topic:{country}:{topic}", []).append(item)
    return {key: _page_facts(entries, (entries[0].get("country") or key.split(":")[1])) for key, entries in groups.items()}


def _words(text):
    return len(re.findall(r"[\w'-]+", str(text or "")))


def _generate(facts):
    if not os.environ.get("ANTHROPIC_API_KEY"):
        return None
    prompt = (
        "Using only the following JSON facts, write original directory-page copy in English and German. "
        "Return only JSON with keys intro, detail, intro_de, detail_de. Each intro must be 80–150 words; "
        "each detail must be at least 70 words. Mention only names, counts, topics, programs, languages, "
        "companies, and event dates present in the facts. Do not invent claims, recommendations, locations, "
        "or statistics. Avoid generic filler and do not repeat phrases across pages. "
        "The facts JSON is the complete and only source:\n" + json.dumps(facts, ensure_ascii=False, separators=(",", ":"))
    )
    estimate = estimated_eur(len(prompt) // 3, 900)
    if not check_budget("directory_intro", MODEL, estimate):
        return None
    body = {"model": MODEL, "max_tokens": 900, "messages": [{"role": "user", "content": prompt}]}
    request = anthropic_request("/v1/messages", body, job="directory_intro", lang="en,de", model=MODEL,
                                api_key=os.environ["ANTHROPIC_API_KEY"])
    try:
        with urlopen(request, timeout=120) as response:
            result = json.load(response)
    except urllib.error.HTTPError as error:
        if error.code in (401, 402, 403):
            print("::warning::Verzeichnis-Einleitung wegen fehlender API-Freigabe übersprungen.")
            return None
        raise
    usage = result.get("usage") or {}
    report_usage("directory_intro", MODEL, usage.get("input_tokens", 0), usage.get("output_tokens", 0), "en,de")
    try:
        text = "".join(part.get("text", "") for part in result.get("content", []))
        value = json.loads(re.search(r"\{.*\}", text, re.S).group(0))
    except (AttributeError, TypeError, ValueError):
        return None
    fields = ("intro", "detail", "intro_de", "detail_de")
    if any(not isinstance(value.get(key), str) for key in fields):
        return None
    if not (80 <= _words(value["intro"]) <= 150 and 80 <= _words(value["intro_de"]) <= 150
            and _words(value["intro"]) + _words(value["detail"]) >= 150
            and _words(value["intro_de"]) + _words(value["detail_de"]) >= 150):
        return None
    return {key: value[key].strip() for key in fields}


def update_cache(facts_by_page, cache):
    pages = cache.setdefault("pages", {})
    generated = 0
    for key, facts in sorted(facts_by_page.items(), key=lambda pair: (not pair[0].startswith("country:"), pair[0])):
        minimum = 5 if key.startswith("topic:") else 3
        if facts["entries"] < minimum:
            continue
        encoded = json.dumps(facts, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        digest = hashlib.sha256(encoded.encode("utf-8")).hexdigest()
        old = pages.get(key) or {}
        baseline_count = int(old.get("generated_count", 0))
        count_changed = not baseline_count or abs(facts["entries"] / baseline_count - 1) >= 0.2
        topics_changed = facts["top_topics"] != old.get("generated_top_topics", [])
        significant = not old.get("intro") or count_changed or topics_changed
        if significant and generated < LIMIT:
            copy = _generate(facts)
            if copy:
                old.update(copy)
                old.update(generated_count=facts["entries"], generated_top_topics=facts["top_topics"],
                           generated_hash=digest, eligible=True)
                generated += 1
            elif significant:
                old["eligible"] = False
        elif significant:
            old["eligible"] = False
        old.update(facts_hash=digest, entries=facts["entries"], top_topics=facts["top_topics"])
        pages[key] = old
    cache["version"] = 1
    return cache, generated


def main():
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("Verzeichnis-Einleitungen übersprungen: ANTHROPIC_API_KEY fehlt.")
        return
    try:
        facts = collect_facts(_fetch_items())
    except Exception as error:
        print(f"::warning::Verzeichnis-Fakten konnten nicht geladen werden: {type(error).__name__}")
        return
    try:
        cache = json.loads(CACHE.read_text("utf-8"))
    except (OSError, ValueError):
        cache = {"version": 1, "pages": {}}
    updated, count = update_cache(facts, cache)
    CACHE.write_text(json.dumps(updated, ensure_ascii=False, indent=2) + "\n", "utf-8")
    print(f"Verzeichnis-Einleitungen aktualisiert: {count}; Seiten mit Fakten: {len(facts)}.")


if __name__ == "__main__":
    main()
