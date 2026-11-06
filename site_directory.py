"""Mehrsprachiges Verzeichnis für öffentliche Experten, Firmen und kommende Events."""
import json
import re
import unicodedata
from pathlib import Path
from site_i18n import COMM_LANGS, pfx, pfx2, overlay
from site_learn import esc, LCSS, ENTS

ROOT = Path(__file__).parent

S = {
    "en": dict(title="Microsoft 365 directory", intro="Find experts, companies and upcoming events in the Microsoft community.", search="Search", type="Type", expert="Expert", company="Company", event="Event", topic="Topic", program="Program", lang="Language", country="Country", city="City", mode="Format", all="All", online="Online", onsite="On site", list="List", map="Map", map_notice="The map loads only after you choose to send data to Google.", map_load="Load map — data will be sent to Google", map_missing="The map is unavailable; the directory list remains available.", loading="Loading…", none="No matching entries.", more="Load more", result="entries", online_badge="Online", open="Open profile or event", experts_in="Microsoft 365 experts in {place}", city_in="Microsoft 365 experts in {city}, {country}", topic_in="{topic} experts in {country}", popular_topics="Popular topics", upcoming_events="Upcoming events", companies_in="Companies in {place}", nearby="Nearby cities", crumbs="Breadcrumb", directory="Directory", home="Home", faq="Directory facts", count_question="How many experts, companies and events are listed?", count_answer="{experts} experts, {companies} companies, and {events} upcoming events are listed.", topics_question="Which topics appear most often?", topics_answer="The most frequently listed topics are: {topics}."),
    "de": dict(title="Microsoft-365-Verzeichnis", intro="Finde Expert:innen, Firmen und kommende Events der Microsoft-Community.", search="Suche", type="Typ", expert="Experte", company="Firma", event="Event", topic="Thema", program="Programm", lang="Sprache", country="Land", city="Stadt", mode="Format", all="Alle", online="Online", onsite="Vor Ort", list="Liste", map="Karte", map_notice="Die Karte wird erst geladen, wenn du der Datenübertragung an Google zustimmst.", map_load="Karte laden – dabei werden Daten an Google übertragen", map_missing="Die Karte ist nicht verfügbar; die Verzeichnisliste bleibt nutzbar.", loading="Lädt …", none="Keine passenden Einträge.", more="Weitere laden", result="Einträge", online_badge="Online", open="Profil oder Event öffnen", experts_in="Microsoft-365-Expert:innen in {place}", city_in="Microsoft-365-Expert:innen in {city}, {country}", topic_in="Expert:innen für {topic} in {country}", popular_topics="Beliebte Themen", upcoming_events="Kommende Events", companies_in="Firmen in {place}", nearby="Nachbarstädte", crumbs="Brotkrumennavigation", directory="Verzeichnis", home="Startseite", faq="Verzeichnis in Zahlen", count_question="Wie viele Experten, Firmen und Events sind aufgeführt?", count_answer="Aufgeführt sind {experts} Experten, {companies} Firmen und {events} kommende Events.", topics_question="Welche Themen sind am häufigsten vertreten?", topics_answer="Am häufigsten aufgeführt sind: {topics}."),
}
overlay("directory.S", S)


def _slug(value):
    value = unicodedata.normalize("NFKD", str(value or "")).encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", value).strip("-"))[:70]


def _country_slug(value):
    key = str(value or "").strip().lower()
    codes = {"germany": "de", "deutschland": "de", "united states": "us", "usa": "us", "united kingdom": "gb", "uk": "gb", "great britain": "gb"}
    return codes.get(key, key if re.fullmatch(r"[a-z]{2}", key) else _slug(value))


def fetch_directory(api):
    """Liest nur öffentliche, paginierte Verzeichniseinträge für Seiteninhalt und SEO-Landingpages."""
    import site_fetch as SF
    # Bis has_more endet: der Worker begrenzt je Tabelle (5000), Firmen zählen je Standort, die Summe kann darüber liegen.
    items, page, last = [], 1, 1000   # Sicherheitsgrenze, danach aus total
    while page <= last:
        data = SF.fetch(f"{api}/api/directory?limit=100&page={page}") or {}
        batch = data.get("items") or []
        items.extend(batch)
        if not data.get("has_more") or not batch:
            break
        if data.get("total"):
            last = min(last, -(-int(data["total"]) // 100))
        page += 1
    return items


def _schema_item(BASE, item):
    common = {"name": item["name"], "url": item["url"]}
    if item["type"] == "expert":
        schema = {"@type": "Person", **common}
        if item.get("headline"):
            schema["jobTitle"] = item["headline"]
        if item.get("city") or item.get("country"):
            schema["address"] = {"@type": "PostalAddress", **({"addressLocality": item["city"]} if item.get("city") else {}), **({"addressCountry": item["country"]} if item.get("country") else {})}
        return schema
    if item["type"] == "event":
        schema = {"@type": "Event", **common, "startDate": item.get("start", "")}
        schema["location"] = {"@type": "VirtualLocation", "url": item["url"]} if item.get("online") else {
            "@type": "Place", "name": item.get("address") or item.get("city") or item.get("country") or item["name"],
            "address": {"@type": "PostalAddress", **({"streetAddress": item["address"]} if item.get("address") else {}), **({"addressLocality": item["city"]} if item.get("city") else {}), **({"addressCountry": item["country"]} if item.get("country") else {})},
        }
        return schema
    schema = {"@type": "LocalBusiness" if item.get("address") or item.get("city") else "Organization", **common}
    if item.get("address") or item.get("city") or item.get("country"):
        schema["address"] = {"@type": "PostalAddress", **({"streetAddress": item["address"]} if item.get("address") else {}), **({"addressLocality": item["city"]} if item.get("city") else {}), **({"addressCountry": item["country"]} if item.get("country") else {})}
    return schema


def _list(items, lang, s):
    rows = []
    for item in items:
        details = item.get("headline") or item.get("city") or item.get("country") or ""
        badge = f' <span class="dir-badge">{esc(s["online_badge"])}</span>' if item.get("online") else ""
        rows.append(f'<li class="dir-item"><a href="{esc(item["url"])}"><strong>{esc(item["name"])}</strong></a>{badge}<p>{esc(details)}</p></li>')
    empty = f'<li>{esc(s["none"])}</li>'
    return f'<ul class="dir-items">{"".join(rows) or empty}</ul>'


def _read_intros(g):
    if "intros" in g:
        return g["intros"]
    try:
        return json.loads((ROOT / "data" / "directory_intros.json").read_text("utf-8")).get("pages", {})
    except (OSError, ValueError, TypeError):
        return {}


# Japanisch/Chinesisch ohne Leerzeichen: jedes Han-/Kana-Zeichen zählt als Wort (sonst wäre ein ganzer Absatz ein Wort).
# Koreanisch trennt Wörter mit Leerzeichen und wird wie andere Sprachen gezählt.
_CJK = "\u3040-\u30ff\u31f0-\u31ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f"
_WORD = re.compile(rf"[{_CJK}]|(?:(?![{_CJK}])[\w'-])+")


def _words(value):
    return _WORD.findall(re.sub(r"<[^>]*>", " ", str(value or "")).lower())


def _shingles(value):
    words = _words(value)
    if len(words) < 3:
        return set(words)
    return {tuple(words[i:i + 3]) for i in range(len(words) - 2)}


def _similarity(left, right):
    a, b = _shingles(left), _shingles(right)
    return len(a & b) / len(a | b) if a and b else 0


def _indexable(items, kind="hub", intro="", detail="", parent=""):
    minimum = 5 if kind == "topic" else 3
    own_text = f"{intro} {detail}".strip()
    return (len(items) >= minimum if kind != "hub" else len(items) >= minimum) and \
        (kind == "hub" or (bool(parent) and len(_words(own_text)) >= 150 and _similarity(own_text, parent) < 0.5))


def _localized(lang, english, german):
    from site_i18n import T
    return T(lang, english, german)


def _facts_sections(entries, place, lang, s):
    topics = {}
    events = []
    companies = []
    for item in entries:
        for topic in item.get("topics") or []:
            topics[topic] = topics.get(topic, 0) + 1
        if item.get("type") == "event":
            events.append(item)
        if item.get("type") == "company":
            companies.append(item)
    tn = lambda t: (ENTS.get(t) or {}).get("name") or t   # Entitaetsname statt Kennung
    topic_html = "".join(f'<li>{esc(tn(name))} <span class="mut">({count})</span></li>' for name, count in sorted(topics.items(), key=lambda row: (-row[1], row[0]))[:5])
    event_html = "".join(f'<li><a href="{esc(item["url"])}">{esc(item["name"])}</a> <time>{esc(item.get("start", ""))}</time></li>' for item in sorted(events, key=lambda x: x.get("start", ""))[:5])
    company_html = "".join(f'<li><a href="{esc(item["url"])}">{esc(item["name"])}</a></li>' for item in companies[:5])
    out = []
    if topic_html:
        out.append(f'<section><h2>{esc(s["popular_topics"])}</h2><ul>{topic_html}</ul></section>')
    if event_html:
        out.append(f'<section><h2>{esc(s["upcoming_events"])}</h2><ul>{event_html}</ul></section>')
    if company_html:
        out.append(f'<section><h2>{esc(s["companies_in"].format(place=place))}</h2><ul>{company_html}</ul></section>')
    experts = sum(item.get("type") == "expert" for item in entries)
    faq = (f'<section class="dir-faq"><h2>{esc(s["faq"])}</h2><details><summary>{esc(s["count_question"])}</summary>'
           f'<p>{esc(s["count_answer"].format(experts=experts, companies=len(companies), events=len(events)))}</p></details>')
    if topics:
        top = sorted(topics.items(), key=lambda row: (-row[1], row[0]))[:3]
        topic_names = ", ".join(f"{tn(name)} ({count})" for name, count in top)
        faq += f'<details><summary>{esc(s["topics_question"])}</summary><p>{esc(s["topics_answer"].format(topics=topic_names))}</p></details>'
    out.append(faq + "</section>")
    return "".join(out)


DIR_CSS = "<style>.dir-wrap nav ol{display:flex;flex-wrap:wrap;gap:.3em .6em;list-style:none;padding:0;margin:1em 0;font-size:.9rem}.dir-wrap nav li+li::before{content:'›';margin-inline-end:.6em;color:var(--mut)}.dir-items{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(16em,1fr));gap:.8em}.dir-item{border:1px solid var(--bd);background:var(--card);padding:.8em 1em}.dir-item p{margin:.3em 0 0;color:var(--mut)}</style>"


def _facets(items):
    """Filterwerte über alle Einträge (wie facets in /api/directory), nicht nur die eingebetteten ersten 30."""
    out = {}
    for key in ("country", "city", "topic", "program", "lang"):
        seen = {}
        for item in items:
            values = (item.get("topics") or []) if key == "topic" else (item.get("programs") or []) if key == "program" else [item.get(key)]
            for raw in values:
                value = str(raw or "").strip()
                if value and value.lower() not in seen:
                    seen[value.lower()] = value
        out[key] = sorted(seen.values())
    return out


def _breadcrumb(crumbs):
    items = [{"@type": "ListItem", "position": i + 1, "name": label, "item": url} for i, (label, url) in enumerate(crumbs)]
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items}


def build(g):
    BASE, write, page = g["BASE"], g["write"], g["page"]
    api = g.get("api", "https://api-dub.m365.fm")
    maps_key = str(g.get("google_maps_key") or "").strip()
    items = fetch_directory(api)
    intros = _read_intros(g)
    today = g["TODAY"]
    facets = _facets(items)
    hub_alternates = {
        lang: f"{BASE}{pfx(lang)}/directory/" for lang in COMM_LANGS
        if _indexable(items) and (lang in ("en", "de") or S[lang]["intro"] != S["en"]["intro"])
    }
    for lang in COMM_LANGS:
        s = S[lang]
        canonical = f"{BASE}{pfx(lang)}/directory/"
        config = json.dumps({"api": api, "base": BASE, "lang": lang, "items": items[:30], "facets": facets, "labels": s, "mapsKey": maps_key}, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
        filters = "".join(f'<label>{esc(s[key])}<select data-filter="{name}"><option value="">{esc(s["all"])}</option></select></label>' for key, name in [("type", "type"), ("topic", "topic"), ("program", "program"), ("lang", "lang"), ("country", "country"), ("city", "city"), ("mode", "mode")])
        filters = f'<label>{esc(s["search"])}<input type="search" data-filter="q" maxlength="100"></label>' + filters
        placeholder = f'<div class="dir-map-placeholder" role="img" aria-label="{esc(s["map_notice"])}"><svg viewBox="0 0 640 360" aria-hidden="true"><rect width="640" height="360" fill="var(--card)"/><path d="M0 70h640M0 150h640M0 245h640M95 0v360M245 0v360M430 0v360M560 0v360" stroke="var(--bd)" stroke-width="8"/><path d="M0 205h640M355 0v360" stroke="var(--ac)" stroke-width="5" opacity=".4"/></svg></div>'
        map_view = f' <button class="btn" type="button" data-view="map" aria-pressed="false">{esc(s["map"])}</button>' if maps_key else ""
        map_panel = (f'<section class="dir-map-panel"><h2>{esc(s["map"])}</h2><p class="mut">{esc(s["map_notice"])}</p>{placeholder}<div class="dir-map" data-map hidden></div>'
                     f'<button class="btn main" type="button" data-map-load>{esc(s["map_load"])}</button><p class="mut" data-map-status role="status"></p></section>') if maps_key else ""
        map_aria = f'{esc(s["list"])} / {esc(s["map"])}' if maps_key else esc(s["list"])
        hub_schema = [{"@context": "https://schema.org", "@type": "ItemList", "name": s["title"], "url": canonical, "numberOfItems": len(items),
                       "itemListElement": [{"@type": "ListItem", "position": i + 1, "item": _schema_item(BASE, item)} for i, item in enumerate(items)]}]
        body = (f'{g["header"](lang, "")}<main class="wrap dir-wrap" style="padding-top:2em"><h1>{esc(s["title"])}</h1><p class="mut">{esc(s["intro"])}</p>'
                f'<form class="dir-filters" aria-label="{esc(s["search"])}">{filters}</form><div class="dir-view" role="group" aria-label="{map_aria}"><button class="btn" type="button" data-view="list" aria-pressed="true">{esc(s["list"])}</button>{map_view}</div><div class="dir-layout" data-view="list" data-map-available="{str(bool(maps_key)).lower()}"><section class="dir-list"><h2>{esc(s["list"])}</h2><p class="mut" data-count></p><div data-results>{_list(items[:30], lang, s)}</div><button class="btn" type="button" data-more hidden>{esc(s["more"])}</button></section>{map_panel}</div></main>'
                f'<style>.dir-filters{{display:grid;grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:.6em;margin:1.2em 0}}.dir-filters label{{display:grid;gap:6px;font-weight:600}}.dir-filters input,.dir-filters select{{width:100%;min-width:0}}.dir-layout{{display:grid;grid-template-columns:minmax(0,1fr) minmax(20em,1fr);gap:1.2em}}.dir-layout[data-map-available=false]{{grid-template-columns:1fr}}.dir-list,.dir-map-panel{{min-width:0}}.dir-items{{list-style:none;padding:0}}.dir-item{{padding:.8em 0;border-bottom:1px solid var(--bd)}}.dir-item p{{margin:.2em 0;color:var(--mut)}}.dir-badge{{display:inline-block;border:1px solid var(--ac);padding:.05em .5em;font:600 .8em "Barlow Condensed",sans-serif;letter-spacing:.08em;text-transform:uppercase}}.dir-map-placeholder,.dir-map{{height:26em;border:1px solid var(--bd);overflow:hidden}}.dir-map-placeholder svg{{width:100%;height:100%}}.dir-map{{background:var(--card)}}.dir-wrap nav ol{{display:flex;flex-wrap:wrap;gap:.5em;list-style:none;padding:0;color:var(--mut)}}.dir-wrap nav li+li:before{{content:"/";margin-inline-end:.5em}}.dir-wrap section{{margin:2em 0}}@media(max-width:48em){{.dir-layout{{grid-template-columns:1fr}}.dir-layout[data-view=map] .dir-list{{display:none}}.dir-layout[data-view=list] .dir-map-panel{{display:none}}.dir-map-placeholder,.dir-map{{height:20em}}}}</style>'
                f'<script>window.M365D={config}</script><script defer src="{BASE}/assets/directory.js"></script>'
                f'{g["footer"](lang) if lang in g["LANGS"] else g["footer_en"]()}')
        hub_indexable = lang in hub_alternates
        alternates = hub_alternates if hub_indexable else None
        write(f"{pfx2(lang)}directory/index.html", page(lang, s["title"], s["intro"], canonical, body, alternates, hub_schema, xdefault=alternates.get("en") if alternates else None, og_type="website", extra_head=LCSS + DIR_CSS, noindex=not hub_indexable))
        if hub_indexable:
            g["sitemap"].append((canonical, today, None))

    groups, city_names = {}, {}
    for item in items:
        country = item.get("country") or ""
        code = _country_slug(country)
        if not code:
            continue
        groups.setdefault(("country", code, ""), []).append(item)
        city = str(item.get("city") or "").strip()
        city_slug = _slug(city)
        if city_slug:   # Gruppe je Slug (Berlin/berlin = eine Seite); leerer Slug (z. B. 東京) würde sonst die Länderseite überschreiben
            groups.setdefault(("city", code, city_slug), []).append(item)
            names = city_names.setdefault((code, city_slug), {})
            names[city] = names.get(city, 0) + 1
        for topic in item.get("topics") or []:
            if re.fullmatch(r"[a-z0-9-]{2,48}", str(topic)):
                groups.setdefault(("topic", code, topic), []).append(item)

    def label_of(kind, country, slug):
        if kind == "city":   # häufigste Schreibweise
            return min(city_names[(country, slug)].items(), key=lambda pair: (-pair[1], pair[0]))[0]
        if kind == "topic":   # Entitätsname statt Kennung; die Kennung bleibt im Pfad
            return (ENTS.get(slug) or {}).get("name") or slug
        return ""

    country_groups = {key[1]: value for key, value in groups.items() if key[0] == "country"}
    cities_by_country = {}
    for kind, country, slug in groups:
        if kind == "city":
            cities_by_country.setdefault(country, []).append((slug, label_of(kind, country, slug)))
    for (kind, country, slug), entries in groups.items():
        label = label_of(kind, country, slug)
        if kind == "country":
            rel = f"directory/{country}/"
            intro_key = f"country:{country}"
        elif kind == "city":
            rel = f"directory/{country}/{slug}/"
            intro_key = f"city:{country}:{slug}"
        else:
            rel = f"directory/{country}/topic/{slug}/"
            intro_key = f"topic:{country}:{slug}"
        copy = intros.get(intro_key) or {}
        if not copy.get("eligible"):
            copy = {}
        parent_copy = intros.get(f"country:{country}", {})
        if not parent_copy.get("eligible"):
            parent_copy = {}
        localized = {}
        for lang in COMM_LANGS:
            s = S[lang]
            place = entries[0].get("country") or country
            title = s["experts_in"].format(place=place) if kind == "country" else s["city_in"].format(city=label, country=place) if kind == "city" else s["topic_in"].format(topic=label, country=place)
            canonical = f"{BASE}{pfx(lang)}/{rel}"
            intro_en, detail_en = copy.get("intro", ""), copy.get("detail", "")
            intro_de, detail_de = copy.get("intro_de", ""), copy.get("detail_de", "")
            intro = _localized(lang, intro_en, intro_de) if intro_en and intro_de else (intro_en if lang == "en" else "")
            detail = _localized(lang, detail_en, detail_de) if detail_en and detail_de else (detail_en if lang == "en" else "")
            parent_intro = _localized(lang, parent_copy.get("intro", ""), parent_copy.get("intro_de", "")) if parent_copy.get("intro") and parent_copy.get("intro_de") else parent_copy.get("intro", "")
            parent_detail = _localized(lang, parent_copy.get("detail", ""), parent_copy.get("detail_de", "")) if parent_copy.get("detail") and parent_copy.get("detail_de") else parent_copy.get("detail", "")
            parent = (parent_intro + " " + parent_detail) if kind != "country" else s["intro"]
            translated = lang in ("en", "de") or (intro != intro_en and detail != detail_en)
            localized[lang] = {"s": s, "place": place, "title": title, "canonical": canonical, "intro": intro,
                               "detail": detail, "parent": parent,
                               "indexable": _indexable(entries, kind, intro, detail, parent) and translated}
        page_alternates = {l: localized[l]["canonical"] for l in COMM_LANGS if localized[l]["indexable"]}
        for lang in COMM_LANGS:
            data = localized[lang]
            s, place, title, canonical = data["s"], data["place"], data["title"], data["canonical"]
            intro, detail = data["intro"], data["detail"]
            crumb_rows = [(s["directory"], f"{BASE}{pfx(lang)}/directory/")]
            if kind == "country":
                crumb_rows.append((title, canonical))
            else:
                country_items = country_groups.get(country) or entries
                country_title = s["experts_in"].format(place=country_items[0].get("country") or country)
                crumb_rows.append((country_title, f"{BASE}{pfx(lang)}/directory/{country}/"))
                crumb_rows.append((title, canonical))
            breadcrumb = _breadcrumb(crumb_rows)
            structured = [breadcrumb, {"@context": "https://schema.org", "@type": "ItemList", "name": title, "url": canonical, "numberOfItems": len(entries),
                           "itemListElement": [{"@type": "ListItem", "position": i + 1, "item": _schema_item(BASE, item)} for i, item in enumerate(entries)]}]
            crumbs_html = "".join(f'<li><a href="{esc(url)}">{esc(name)}</a></li>' for name, url in crumb_rows)
            neighbors = ""
            if kind == "city":
                links = [(name, f"{BASE}{pfx(lang)}/directory/{country}/{other}/") for other, name in sorted(cities_by_country.get(country, [])) if other != slug]
                if links:
                    neighbors = f'<section><h2>{esc(s["nearby"])}</h2><ul>{"".join(f"<li><a href=\"{esc(url)}\">{esc(name)}</a></li>" for name, url in links)}</ul></section>'
            sections = _facts_sections(entries, place, lang, s)
            body = (f'{g["header"](lang, "")}<main class="wrap dir-wrap"><nav aria-label="{esc(s["crumbs"])}"><ol>{crumbs_html}</ol></nav>'
                    f'<h1>{esc(title)}</h1>{f"<p>{esc(intro)}</p>" if intro else ""}{f"<p>{esc(detail)}</p>" if detail else ""}'
                    f'{sections}{neighbors}<section><h2>{esc(s["directory"])}: {len(entries)} {esc(s["result"])}</h2>{_list(entries, lang, s)}</section></main>{g["footer"](lang) if lang in g["LANGS"] else g["footer_en"]()}')
            own_indexable = data["indexable"]
            alts = page_alternates if own_indexable else None
            write(f"{pfx2(lang)}{rel}index.html", page(lang, title, intro or title, canonical, body, alts, structured, xdefault=alts.get("en") if alts else None, og_type="website", extra_head=LCSS + DIR_CSS, noindex=not own_indexable))
            if own_indexable:
                g["sitemap"].append((canonical, today, None))
