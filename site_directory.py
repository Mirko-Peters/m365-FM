"""Mehrsprachiges Verzeichnis für öffentliche Experten, Firmen und kommende Events."""
import json
import re
import unicodedata
from site_i18n import COMM_LANGS, pfx, pfx2, overlay
from site_learn import esc, LCSS

S = {
    "en": dict(title="Microsoft 365 directory", intro="Find experts, companies and upcoming events in the Microsoft community.", search="Search", type="Type", expert="Expert", company="Company", event="Event", topic="Topic", program="Program", lang="Language", country="Country", city="City", mode="Format", all="All", online="Online", onsite="On site", list="List", map="Map", map_notice="The map loads only after you choose to send data to Google.", map_load="Load map — data will be sent to Google", map_missing="The map is unavailable; the directory list remains available.", loading="Loading…", none="No matching entries.", more="Load more", result="entries", online_badge="Online", open="Open profile or event", experts_in="Microsoft 365 experts in {place}", city_in="Microsoft 365 experts in {city}, {country}", topic_in="{topic} experts in {country}", services="Services", services_intro="Explore M365.FM services and the community directory."),
    "de": dict(title="Microsoft-365-Verzeichnis", intro="Finde Expert:innen, Firmen und kommende Events der Microsoft-Community.", search="Suche", type="Typ", expert="Experte", company="Firma", event="Event", topic="Thema", program="Programm", lang="Sprache", country="Land", city="Stadt", mode="Format", all="Alle", online="Online", onsite="Vor Ort", list="Liste", map="Karte", map_notice="Die Karte wird erst geladen, wenn du der Datenübertragung an Google zustimmst.", map_load="Karte laden – dabei werden Daten an Google übertragen", map_missing="Die Karte ist nicht verfügbar; die Verzeichnisliste bleibt nutzbar.", loading="Lädt …", none="Keine passenden Einträge.", more="Weitere laden", result="Einträge", online_badge="Online", open="Profil oder Event öffnen", experts_in="Microsoft-365-Expert:innen in {place}", city_in="Microsoft-365-Expert:innen in {city}, {country}", topic_in="Expert:innen für {topic} in {country}", services="Services", services_intro="Entdecke die Services und das Community-Verzeichnis von M365.FM."),
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
    items, page = [], 1
    while page <= 20:
        data = SF.fetch(f"{api}/api/directory?limit=100&page={page}") or {}
        batch = data.get("items") or []
        items.extend(batch)
        if not data.get("has_more") or not batch:
            break
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


def build(g):
    BASE, write, page = g["BASE"], g["write"], g["page"]
    api = g.get("api", "https://api-dub.m365.fm")
    items = fetch_directory(api)
    today = g["TODAY"]
    for lang in COMM_LANGS:
        s = S[lang]
        canonical = f"{BASE}{pfx(lang)}/directory/"
        config = json.dumps({"api": api, "base": BASE, "lang": lang, "items": items[:30], "labels": s}, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
        filters = "".join(f'<label>{esc(s[key])}<select data-filter="{name}"><option value="">{esc(s["all"])}</option></select></label>' for key, name in [("type", "type"), ("topic", "topic"), ("program", "program"), ("lang", "lang"), ("country", "country"), ("city", "city"), ("mode", "mode")])
        filters = f'<label>{esc(s["search"])}<input type="search" data-filter="q" maxlength="100"></label>' + filters
        placeholder = f'<div class="dir-map-placeholder" role="img" aria-label="{esc(s["map_notice"])}"><svg viewBox="0 0 640 360" aria-hidden="true"><rect width="640" height="360" fill="var(--card)"/><path d="M0 70h640M0 150h640M0 245h640M95 0v360M245 0v360M430 0v360M560 0v360" stroke="var(--bd)" stroke-width="8"/><path d="M0 205h640M355 0v360" stroke="var(--ac)" stroke-width="5" opacity=".4"/></svg></div>'
        hub_schema = [{"@context": "https://schema.org", "@type": "ItemList", "name": s["title"], "url": canonical, "numberOfItems": len(items),
                       "itemListElement": [{"@type": "ListItem", "position": i + 1, "item": _schema_item(BASE, item)} for i, item in enumerate(items)]}]
        body = (f'{g["header"](lang, "")}<main class="wrap dir-wrap"><h1>{esc(s["title"])}</h1><p class="mut">{esc(s["intro"])}</p>'
                f'<form class="dir-filters" aria-label="{esc(s["search"])}">{filters}</form><div class="dir-view" role="group" aria-label="{esc(s["list"])} / {esc(s["map"])}"><button class="btn" type="button" data-view="list" aria-pressed="true">{esc(s["list"])}</button> <button class="btn" type="button" data-view="map" aria-pressed="false">{esc(s["map"])}</button></div><div class="dir-layout" data-view="list"><section class="dir-list"><h2>{esc(s["list"])}</h2><p class="mut" data-count></p><div data-results>{_list(items[:30], lang, s)}</div><button class="btn" type="button" data-more hidden>{esc(s["more"])}</button></section>'
                f'<section class="dir-map-panel"><h2>{esc(s["map"])}</h2><p class="mut">{esc(s["map_notice"])}</p>{placeholder}<div class="dir-map" data-map hidden></div>'
                f'<button class="btn main" type="button" data-map-load>{esc(s["map_load"])}</button><p class="mut" data-map-status role="status"></p></section></div></main>'
                f'<style>.dir-wrap{{max-width:76em}}.dir-filters{{display:grid;grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:.6em;margin:1.2em 0}}.dir-filters label{{display:grid;gap:.2em;font-weight:600}}.dir-filters input,.dir-filters select{{font:inherit;min-height:2.6em;padding:.35em;border:1px solid var(--bd);border-radius:.5em;background:var(--card);color:var(--fg)}}.dir-layout{{display:grid;grid-template-columns:minmax(0,1fr) minmax(20em,1fr);gap:1.2em}}.dir-list,.dir-map-panel{{min-width:0}}.dir-items{{list-style:none;padding:0}}.dir-item{{padding:.8em 0;border-bottom:1px solid var(--bd)}}.dir-item p{{margin:.2em 0;color:var(--mut)}}.dir-badge{{display:inline-block;border:1px solid var(--ac);border-radius:1em;padding:.05em .5em;font-size:.8em}}.dir-map-placeholder,.dir-map{{height:26em;border:1px solid var(--bd);border-radius:.7em;overflow:hidden}}.dir-map-placeholder svg{{width:100%;height:100%}}.dir-map{{background:var(--card)}}@media(max-width:48em){{.dir-layout{{grid-template-columns:1fr}}.dir-layout[data-view=map] .dir-list{{display:none}}.dir-layout[data-view=list] .dir-map-panel{{display:none}}.dir-map-placeholder,.dir-map{{height:20em}}}}</style>'
                f'<script>window.M365D={config}</script><script defer src="{BASE}/assets/directory.js"></script>'
                f'{g["footer"](lang) if lang in g["LANGS"] else g["footer_en"]()}')
        write(f"{pfx2(lang)}directory/index.html", page(lang, s["title"], s["intro"], canonical, body, None, hub_schema, og_type="website", extra_head=LCSS, noindex=not _indexable(items)))
        if _indexable(items):
            g["sitemap"].append((canonical, today, None))
        services_url = f"{BASE}{pfx(lang)}/services/"
        services_body = (f'{g["header"](lang, "")}<main class="wrap"><h1>{esc(s["services"])}</h1><p>{esc(s["services_intro"])}</p>'
                         f'<p><a class="btn main" href="{canonical}">{esc(s["title"])}</a></p><p><a href="{BASE}{pfx(lang)}/community/">{esc(s["services"])}</a></p></main>'
                         f'{g["footer"](lang) if lang in g["LANGS"] else g["footer_en"]()}')
        services_ld = [{"@context": "https://schema.org", "@type": "ItemList", "name": s["services"], "itemListElement": [{"@type": "ListItem", "position": 1, "url": canonical}]}]
        write(f"{pfx2(lang)}services/index.html", page(lang, s["services"], s["services_intro"], services_url, services_body, None, services_ld, og_type="website", extra_head=LCSS, noindex=lang != "en"))
        if lang == "en":
            g["sitemap"].append((services_url, today, None))

    groups = {}
    for item in items:
        country = item.get("country") or ""
        code = _country_slug(country)
        if not code:
            continue
        groups.setdefault(("country", code, "", ""), []).append(item)
        city = item.get("city") or ""
        if city:
            groups.setdefault(("city", code, _slug(city), city), []).append(item)
        for topic in item.get("topics") or []:
            if re.fullmatch(r"[a-z0-9-]{2,48}", str(topic)):
                groups.setdefault(("topic", code, topic, topic), []).append(item)
    for (kind, country, slug, label), entries in groups.items():
        if kind == "country":
            rel = f"directory/{country}/"
        elif kind == "city":
            rel = f"directory/{country}/{slug}/"
        else:
            rel = f"directory/{country}/topic/{slug}/"
        for lang in COMM_LANGS:
            s = S[lang]
            place = entries[0].get("country") or country
            title = s["experts_in"].format(place=place) if kind == "country" else s["city_in"].format(city=label, country=place) if kind == "city" else s["topic_in"].format(topic=label, country=place)
            canonical = f"{BASE}{pfx(lang)}/{rel}"
            structured = [{"@context": "https://schema.org", "@type": "ItemList", "name": title, "url": canonical, "numberOfItems": len(entries),
                           "itemListElement": [{"@type": "ListItem", "position": i + 1, "item": _schema_item(BASE, item)} for i, item in enumerate(entries)]}]
            body = f'{g["header"](lang, "")}<main class="wrap dir-wrap"><nav aria-label="breadcrumb"><a href="{BASE}{pfx(lang)}/directory/">{esc(s["title"])}</a></nav><h1>{esc(title)}</h1>{_list(entries, lang, s)}</main>{g["footer"](lang) if lang in g["LANGS"] else g["footer_en"]()}'
            write(f"{pfx2(lang)}{rel}index.html", page(lang, title, title, canonical, body, None, structured, og_type="website", extra_head=LCSS, noindex=not _indexable(entries)))
            if lang == "en" and _indexable(entries):
                g["sitemap"].append((canonical, today, None))


def _indexable(items):
    return len(items) >= 3
