#!/usr/bin/env python3
"""Mediadaten (Media Kit) von M365.FM als mehrseitiges PDF erzeugen - EN und DE - aus Live-Daten.

Quellen (jeweils nur, wenn verfuegbar; fehlende Werte werden weggelassen, nie geschaetzt):
  - YouTube Analytics + Data API (Kanal m365 Show): Aufrufe, Wiedergabezeit, Abos, Verlauf 6 Monate, Top-Videos,
    Laender, Alter/Geschlecht, Geraete, Traffic-Quellen
  - Cloudflare GraphQL (Zone m365.fm): Seitenaufrufe 30 Tage (Rand-Statistik, ungefiltert), Verlauf, Laender
  - Bing Webmaster API: Klicks/Impressionen der Bing-Suche (28 Tage, Verlauf), Top-Suchanfragen
  - data/top.json: Spreaker-Downloads je Sprachfassung (7 Tage)
  - data/stats/ai_performance.json: KI-Zitate (Bing AI Performance, Export)
  - data/sponsor_pricing.json + data/sponsor_i18n.json: Sponsoring-Pakete und Listenpreise wie auf /sponsor/
Aufruf: python tools/mediakit.py --out out/mediakit   (Umgebung: YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN,
        CLOUDFLARE_API_TOKEN, CF_ZONE_ID optional, BING_WEBMASTER_API_KEY)
Ergebnis: m365fm-media-kit-en.pdf, m365fm-media-kit-de.pdf, latest.json
"""
import argparse, datetime as dt, json, os, re, sys, urllib.request, urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
TODAY = dt.date.today()


def http(url, data=None, headers=None, timeout=60):
    rq = urllib.request.Request(url, data=data, headers=headers or {})
    try:
        with urllib.request.urlopen(rq, timeout=timeout) as r:
            return r.status, json.loads(r.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as e:
        try: return e.code, json.loads(e.read().decode("utf-8") or "{}")
        except Exception: return e.code, {}
    except Exception as e:
        print("Abruf fehlgeschlagen:", url.split("?")[0], type(e).__name__)
        return 0, {}


# ---------- Quellen ----------
def youtube():
    cid, sec, rt = (os.environ.get(k, "").strip() for k in ("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN"))
    if not (cid and sec and rt): return {}
    st, tok = http("https://oauth2.googleapis.com/token", urllib.parse.urlencode({"grant_type": "refresh_token", "refresh_token": rt, "client_id": cid, "client_secret": sec}).encode())
    if st != 200: print("YouTube: Token", st); return {}
    H = {"authorization": "Bearer " + tok["access_token"]}
    end, start = TODAY, TODAY - dt.timedelta(days=28)

    def rep(**q):
        q.setdefault("ids", "channel==MINE"); q.setdefault("startDate", str(start)); q.setdefault("endDate", str(end))
        st, a = http("https://youtubeanalytics.googleapis.com/v2/reports?" + urllib.parse.urlencode(q), headers=H)
        return a.get("rows") or [] if st == 200 else []

    out = {}
    r = rep(metrics="views,estimatedMinutesWatched,subscribersGained,averageViewDuration,likes,shares")
    if r:
        v, m, s, avd, lk, sh = (r[0] + [0] * 6)[:6]
        out.update(views28=int(v), minutes28=int(m), subs_gained28=int(s), avg_view_sec=int(avd), likes28=int(lk), shares28=int(sh), period28=f"{start}–{end}")
    st, c = http("https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true", headers=H)
    if st == 200 and c.get("items"):
        s = c["items"][0].get("statistics") or {}
        if not s.get("hiddenSubscriberCount") and s.get("subscriberCount"): out["subscribers"] = int(s["subscriberCount"])
        if s.get("videoCount"): out["videos"] = int(s["videoCount"])
    m0 = (TODAY.replace(day=1) - dt.timedelta(days=150)).replace(day=1)
    last_full = TODAY.replace(day=1) - dt.timedelta(days=1)
    mon = rep(dimensions="month", metrics="views,estimatedMinutesWatched", startDate=str(m0), endDate=str(last_full), sort="month")
    if mon: out["monthly"] = [[x[0], int(x[1]), int(x[2])] for x in mon]
    top = rep(dimensions="video", metrics="views", sort="-views", maxResults=8)
    if top:
        ids = ",".join(x[0] for x in top)
        st, vd = http("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + ids, headers=H)
        titles = {i["id"]: i["snippet"]["title"] for i in (vd.get("items") or [])} if st == 200 else {}
        out["top_videos"] = [[titles.get(x[0], x[0]), int(x[1])] for x in top]
    cty = rep(dimensions="country", metrics="views", sort="-views", maxResults=10)
    if cty: out["countries"] = [[x[0], int(x[1])] for x in cty]
    ag = rep(dimensions="ageGroup,gender", metrics="viewerPercentage", sort="gender,ageGroup")
    if ag:
        age, gen = {}, {}
        for a, g, p in ag: age[a] = age.get(a, 0) + float(p); gen[g] = gen.get(g, 0) + float(p)
        out["age"] = sorted([[k.replace("age", "").replace("-", "–"), round(v, 1)] for k, v in age.items()])
        out["gender"] = sorted([[k, round(v, 1)] for k, v in gen.items()], key=lambda x: -x[1])
    dev = rep(dimensions="deviceType", metrics="views", sort="-views")
    if dev: out["devices"] = [[x[0], int(x[1])] for x in dev]
    src = rep(dimensions="insightTrafficSourceType", metrics="views", sort="-views", maxResults=6)
    if src: out["traffic"] = [[x[0], int(x[1])] for x in src]
    print("YouTube:", {k: (v if not isinstance(v, list) else f"{len(v)} Zeilen") for k, v in out.items()})
    return out


def cloudflare():
    tok = os.environ.get("CLOUDFLARE_API_TOKEN", "").strip()
    if not tok: return {}
    H = {"authorization": "Bearer " + tok, "content-type": "application/json"}
    zone = os.environ.get("CF_ZONE_ID", "").strip()
    if not zone:
        st, d = http("https://api.cloudflare.com/client/v4/zones?name=m365.fm", headers=H)
        zone = ((d.get("result") or [{}])[0] or {}).get("id", "") if st == 200 else ""
    if not zone: print("Cloudflare: Zone nicht gefunden"); return {}
    until = TODAY - dt.timedelta(days=1); since = until - dt.timedelta(days=29)
    q = """query($z:String!,$s:Date!,$u:Date!){viewer{zones(filter:{zoneTag:$z}){httpRequests1dGroups(limit:31,orderBy:[date_ASC],filter:{date_geq:$s,date_leq:$u}){dimensions{date} sum{pageViews countryMap{clientCountryName requests}}}}}}"""
    st, d = http("https://api.cloudflare.com/client/v4/graphql", json.dumps({"query": q, "variables": {"z": zone, "s": str(since), "u": str(until)}}).encode(), H)
    rows = (((d.get("data") or {}).get("viewer") or {}).get("zones") or [{}])[0].get("httpRequests1dGroups") or [] if st == 200 and not d.get("errors") else []
    if not rows: print("Cloudflare: keine Daten", st, (d.get("errors") or "")); return {}
    pv = sum((r.get("sum") or {}).get("pageViews") or 0 for r in rows)
    cty = {}
    for r in rows:
        for c in (r.get("sum") or {}).get("countryMap") or []:
            cty[c["clientCountryName"]] = cty.get(c["clientCountryName"], 0) + int(c.get("requests") or 0)
    tot = sum(cty.values()) or 1
    out = {"pageviews30": int(pv), "period30": f"{since}–{until}",
           "daily": [[r["dimensions"]["date"], int((r.get("sum") or {}).get("pageViews") or 0)] for r in rows],
           "countries": [[k, round(v * 100 / tot, 1)] for k, v in sorted(cty.items(), key=lambda kv: -kv[1])[:10]]}
    print("Cloudflare:", out["pageviews30"], "Seitenaufrufe,", len(out["countries"]), "Laender")
    return out


def bing():
    key = os.environ.get("BING_WEBMASTER_API_KEY", "").strip()
    if not key: return {}
    base = "https://ssl.bing.com/webmaster/api.svc/json/"
    q = lambda m: http(base + m + "?" + urllib.parse.urlencode({"siteUrl": "https://m365.fm/", "apikey": key}))
    day = lambda s: (lambda m: dt.datetime.fromtimestamp(int(m.group()) / 1000, dt.timezone.utc).date() if m else None)(re.search(r"\d{9,}", str(s)))
    out = {}
    st, d = q("GetRankAndTrafficStats")
    rows = [(day(r.get("Date")), int(r.get("Clicks") or 0), int(r.get("Impressions") or 0)) for r in (d.get("d") or [])] if st == 200 else []
    rows = sorted(r for r in rows if r[0])
    since = TODAY - dt.timedelta(days=28)
    recent = [r for r in rows if r[0] >= since]
    if recent:
        out.update(clicks28=sum(r[1] for r in recent), impressions28=sum(r[2] for r in recent))
        wk = {}
        for dd, c, i in rows:
            if dd >= TODAY - dt.timedelta(days=7 * 12):
                k = (dd - dt.timedelta(days=dd.weekday())).isoformat(); a = wk.setdefault(k, [0, 0]); a[0] += c; a[1] += i
        out["weekly"] = [[k, v[0], v[1]] for k, v in sorted(wk.items())]
    st, d = q("GetQueryStats")
    if st == 200 and d.get("d"):
        agg = {}
        for r in d["d"]:
            dd = day(r.get("Date"))
            if dd and dd >= TODAY - dt.timedelta(days=35):
                a = agg.setdefault(r.get("Query", ""), [0, 0]); a[0] += int(r.get("Clicks") or 0); a[1] += int(r.get("Impressions") or 0)
        out["queries"] = [[k, v[0], v[1]] for k, v in sorted(agg.items(), key=lambda kv: -kv[1][1]) if k][:12]
    print("Bing:", {k: (v if not isinstance(v, list) else f"{len(v)} Zeilen") for k, v in out.items()} or ("keine Daten", st))
    return out


def local():
    out = {}
    try:
        sp = json.loads((ROOT / "data" / "top.json").read_text("utf-8")).get("spreaker") or {}
        vals = sp.get("downloads") or {}
        if sp.get("complete") is True and vals:
            out["spreaker7"] = int(sum(v for v in vals.values() if isinstance(v, (int, float))))
            out["spreaker_period"] = f'{sp.get("from", "")}–{sp.get("to", "")}'
            out["spreaker_langs"] = sorted([[k, int(v)] for k, v in vals.items() if isinstance(v, (int, float))], key=lambda x: -x[1])
    except Exception: pass
    try:
        a = json.loads((ROOT / "data" / "stats" / "ai_performance.json").read_text("utf-8")).get("bing_ai") or {}
        if a.get("status") == "ok" and isinstance(a.get("citations"), (int, float)):
            out["ai_citations"] = int(a["citations"]); out["ai_period"] = f'{(a.get("period") or {}).get("from", "")}–{(a.get("period") or {}).get("to", "")}'
            if isinstance(a.get("cited_pages_per_day"), (int, float)): out["ai_pages_day"] = int(a["cited_pages_per_day"])
    except Exception: pass
    try:
        g = json.loads((ROOT / "data" / "stats" / "ai_performance.json").read_text("utf-8")).get("gsc") or {}
        if g.get("status") == "ok" and isinstance(g.get("clicks"), (int, float)):
            out["gsc"] = {k: g.get(k) for k in ("clicks", "impressions", "pages")}; out["gsc_period"] = f'{(g.get("period") or {}).get("from", "")}–{(g.get("period") or {}).get("to", "")}'
    except Exception: pass
    try:
        from site_landing import LANGS_ALL
        out["site_languages"] = len(LANGS_ALL)
    except Exception: pass
    try:
        out["pricing"] = json.loads((ROOT / "data" / "sponsor_pricing.json").read_text("utf-8"))
        out["sponsor_i18n"] = json.loads((ROOT / "data" / "sponsor_i18n.json").read_text("utf-8"))
    except Exception: pass
    return out


# ---------- Texte ----------
FONT_URLS = {"Barlow": "https://github.com/google/fonts/raw/main/ofl/barlow/Barlow-Regular.ttf",
             "Barlow-SemiBold": "https://github.com/google/fonts/raw/main/ofl/barlow/Barlow-SemiBold.ttf",
             "Barlow-Bold": "https://github.com/google/fonts/raw/main/ofl/barlow/Barlow-Bold.ttf",
             "BarlowCondensed-SemiBold": "https://github.com/google/fonts/raw/main/ofl/barlowcondensed/BarlowCondensed-SemiBold.ttf"}

LANG_NAMES = {"en": ("English", "Englisch"), "de": ("German", "Deutsch"), "es": ("Spanish", "Spanisch"), "fr": ("French", "Französisch"), "it": ("Italian", "Italienisch"),
              "pt": ("Portuguese", "Portugiesisch"), "nl": ("Dutch", "Niederländisch"), "pl": ("Polish", "Polnisch"), "id": ("Indonesian", "Indonesisch"),
              "ru": ("Russian", "Russisch"), "uk": ("Ukrainian", "Ukrainisch"), "ar": ("Arabic", "Arabisch"), "he": ("Hebrew", "Hebräisch"),
              "ja": ("Japanese", "Japanisch"), "ko": ("Korean", "Koreanisch"), "hi": ("Hindi", "Hindi"), "tr": ("Turkish", "Türkisch"), "zh": ("Chinese", "Chinesisch")}
COUNTRY = {"US": ("United States", "USA"), "DE": ("Germany", "Deutschland"), "IN": ("India", "Indien"), "GB": ("United Kingdom", "Großbritannien"),
           "CA": ("Canada", "Kanada"), "AU": ("Australia", "Australien"), "NL": ("Netherlands", "Niederlande"), "FR": ("France", "Frankreich"),
           "AT": ("Austria", "Österreich"), "CH": ("Switzerland", "Schweiz"), "ES": ("Spain", "Spanien"), "IT": ("Italy", "Italien"),
           "BR": ("Brazil", "Brasilien"), "PL": ("Poland", "Polen"), "SE": ("Sweden", "Schweden"), "PH": ("Philippines", "Philippinen"),
           "PK": ("Pakistan", "Pakistan"), "NG": ("Nigeria", "Nigeria"), "ZA": ("South Africa", "Südafrika"), "SG": ("Singapore", "Singapur"),
           "IE": ("Ireland", "Irland"), "BE": ("Belgium", "Belgien"), "MX": ("Mexico", "Mexiko"), "JP": ("Japan", "Japan"), "ID": ("Indonesia", "Indonesien"),
           "EG": ("Egypt", "Ägypten"), "AE": ("United Arab Emirates", "VAE"), "SA": ("Saudi Arabia", "Saudi-Arabien"), "TR": ("Turkey", "Türkei"),
           "CN": ("China", "China"), "RU": ("Russia", "Russland"), "UA": ("Ukraine", "Ukraine"), "VN": ("Vietnam", "Vietnam"), "BD": ("Bangladesh", "Bangladesch"),
           "KR": ("South Korea", "Südkorea"), "DK": ("Denmark", "Dänemark"), "NO": ("Norway", "Norwegen"), "FI": ("Finland", "Finnland"), "PT": ("Portugal", "Portugal"),
           "NZ": ("New Zealand", "Neuseeland"), "IL": ("Israel", "Israel"), "MY": ("Malaysia", "Malaysia"), "KE": ("Kenya", "Kenia"), "CZ": ("Czechia", "Tschechien")}
DEV = {"DESKTOP": ("Desktop", "Desktop"), "MOBILE": ("Mobile", "Mobil"), "TABLET": ("Tablet", "Tablet"), "TV": ("TV", "TV"), "GAME_CONSOLE": ("Console", "Konsole")}
SRC = {"YT_SEARCH": ("YouTube search", "YouTube-Suche"), "RELATED_VIDEO": ("Suggested videos", "Vorgeschlagene Videos"), "SUBSCRIBER": ("Subscribers / feed", "Abonnenten / Feed"),
       "EXT_URL": ("External websites", "Externe Websites"), "PLAYLIST": ("Playlists", "Playlists"), "YT_CHANNEL": ("Channel pages", "Kanalseiten"),
       "NO_LINK_OTHER": ("Direct / unknown", "Direkt / unbekannt"), "SHORTS": ("Shorts feed", "Shorts-Feed"), "YT_OTHER_PAGE": ("Other YouTube pages", "Andere YouTube-Seiten"),
       "NOTIFICATION": ("Notifications", "Benachrichtigungen"), "END_SCREEN": ("End screens", "Abspanne"), "ANNOTATION": ("Cards", "Karten"), "HASHTAGS": ("Hashtags", "Hashtags")}
GEN = {"male": ("Male", "Männlich"), "female": ("Female", "Weiblich"), "user_specified": ("Other", "Divers")}

TXT = {
    "en": dict(
        title="Media kit", sub="Microsoft 365 podcast, video and knowledge platform", asof="Figures as of", page="Page",
        intro="M365.FM explains Microsoft 365, Copilot, Azure, Power Platform and security for IT professionals, architects and decision makers – as a podcast, as animated explainer videos on YouTube, as articles and as a community with expert profiles, events and a wiki, in {n} languages.",
        reach="At a glance",
        k=dict(yt_views="YouTube views", yt_minutes="YouTube watch time (minutes)", yt_subs_new="New YouTube subscribers", yt_subs="YouTube subscribers",
               pv="Website page views", sp="Podcast downloads (all language editions)", ai="AI citations (Copilot and partners)",
               b_clicks="Bing search clicks", b_imp="Bing search impressions", langs="Site languages", videos="Published videos",
               g_clicks="Google search clicks", g_imp="Google search impressions"),
        s=dict(yt="YouTube Analytics", cf="Cloudflare (edge statistics, before bot filtering)", sp="Spreaker", ai="Bing Webmaster Tools, AI Performance", bing="Bing Webmaster Tools", site="M365.FM", gsc="Google Search Console"),
        d28="last 28 days", d30="last 30 days", d7="7 days", total="total",
        yt_h="YouTube: m365 Show", yt_lead="Animated explainer videos, Shorts and certification courses on Microsoft 365, Copilot, Azure and security.",
        yt_month="Views per month", yt_top="Most watched videos (last 28 days)", yt_cty="Viewers by country (share of views, 28 days)", yt_age="Age groups (share of viewers)",
        yt_gen="Gender (share of viewers)", yt_dev="Devices (share of views)", yt_src="How viewers find the videos", yt_eng="Engagement (28 days)",
        avd="Average view duration", likes="Likes", shares="Shares",
        web_h="Website and search: www.m365.fm", web_lead="Episode pages, articles, topic pages, wiki and expert directory – indexed by Google and Bing and cited by AI assistants.",
        web_daily="Page views per day (30 days)", web_cty="Requests by country (share, 30 days, unfiltered)", b_week="Bing search per week (12 weeks)", b_q="What people search for on Bing to find M365.FM",
        q="Query", clicks="Clicks", imps="Impressions", ai_h="AI assistants", ai_t="Microsoft Copilot and partner AI services cited M365.FM pages {n} times between {p} – on average {d} different pages per day.",
        pod_h="Podcast: M365.FM", pod_lead="Weekly episodes, daily “Simply Explained” episodes and language editions of the show on Spreaker, Apple Podcasts, Spotify and YouTube.",
        pod_lang="Downloads per language edition ({p})", pod_note="Spreaker downloads of the M365.FM shows per language, same period.",
        audience="Audience", audience_t="People who plan, run, secure and adopt Microsoft 365: IT administrators, solution architects, consultants at Microsoft partners, IT and digital-workplace decision makers, trainers and the Microsoft community (MVPs, MCTs, user groups).",
        channels="Channels and formats",
        ch=["Podcast M365.FM – weekly episodes plus daily “Simply Explained” episodes; language editions of the show",
            "YouTube channel m365 Show – animated explainer videos, Shorts and certification courses",
            "www.m365.fm – episode pages, articles, topic pages (entities), wiki, events, expert directory",
            "Community – member and expert profiles, Expert Connect for journalists and PR (in preparation), M365Con online conference",
            "LinkedIn – M365 Show company page and newsletter"],
        why="Why sponsors choose M365.FM",
        whys=["Topic fit: your brand appears exactly where Microsoft 365 professionals look for answers – by topic, not by broad audience.",
              "Long-lived content: episodes, videos and topic pages stay findable in search and AI assistants long after the campaign.",
              "International: language editions and a website in {n} languages instead of a single market.",
              "Measurable: sponsor dashboard with downloads, tracked clicks, video views, leads and AI citations of your entities."],
        sp_h="Become a sponsor", sp_lead="Packages from the current price list on www.m365.fm/sponsor/ (list prices in USD, plus VAT where applicable). Configure your package there and send a request in two minutes.",
        sp_pkg="Package", sp_price="List price", sp_disc="Runtime discount on base and video package: {d}. At most {n} sponsors per topic.",
        sp_rules="Sponsored content is always labelled; links to sponsors carry rel=\"sponsored\". No bought links, editorial independence of the episodes.",
        cta="Configure your sponsorship", cta_url="www.m365.fm/sponsor/",
        contact="Contact", contact_t="Mirko Peters · mirko.peters@m365.fm · www.m365.fm",
        note="All figures come directly from the named sources for the stated period. Values that are not available are left out, not estimated.",
        units={"topic_month": "per topic and month", "each": "each", "month": "per month", "once": "one-time", "issue_month": "per issue"},
    ),
    "de": dict(
        title="Mediadaten", sub="Microsoft-365-Podcast, Video- und Wissensplattform", asof="Stand der Zahlen", page="Seite",
        intro="M365.FM erklärt Microsoft 365, Copilot, Azure, Power Platform und Security für IT-Fachleute, Architekten und Entscheider – als Podcast, als animierte Erklärvideos auf YouTube, als Artikel und als Community mit Expertenprofilen, Events und Wiki, in {n} Sprachen.",
        reach="Auf einen Blick",
        k=dict(yt_views="YouTube-Aufrufe", yt_minutes="YouTube-Wiedergabezeit (Minuten)", yt_subs_new="Neue YouTube-Abonnenten", yt_subs="YouTube-Abonnenten",
               pv="Website-Seitenaufrufe", sp="Podcast-Downloads (alle Sprachfassungen)", ai="KI-Zitate (Copilot und Partner)",
               b_clicks="Bing-Suchklicks", b_imp="Bing-Suchimpressionen", langs="Sprachen der Website", videos="Veröffentlichte Videos",
               g_clicks="Google-Suchklicks", g_imp="Google-Suchimpressionen"),
        s=dict(yt="YouTube Analytics", cf="Cloudflare (Rand-Statistik, vor Bot-Filterung)", sp="Spreaker", ai="Bing Webmaster Tools, AI Performance", bing="Bing Webmaster Tools", site="M365.FM", gsc="Google Search Console"),
        d28="letzte 28 Tage", d30="letzte 30 Tage", d7="7 Tage", total="gesamt",
        yt_h="YouTube: m365 Show", yt_lead="Animierte Erklärvideos, Shorts und Zertifizierungskurse zu Microsoft 365, Copilot, Azure und Security.",
        yt_month="Aufrufe pro Monat", yt_top="Meistgesehene Videos (letzte 28 Tage)", yt_cty="Zuschauer nach Land (Anteil der Aufrufe, 28 Tage)", yt_age="Altersgruppen (Anteil der Zuschauer)",
        yt_gen="Geschlecht (Anteil der Zuschauer)", yt_dev="Geräte (Anteil der Aufrufe)", yt_src="Wie Zuschauer die Videos finden", yt_eng="Interaktion (28 Tage)",
        avd="Durchschnittliche Wiedergabedauer", likes="Likes", shares="Geteilt",
        web_h="Website und Suche: www.m365.fm", web_lead="Folgenseiten, Artikel, Themenseiten, Wiki und Expertenverzeichnis – von Google und Bing indexiert und von KI-Assistenten zitiert.",
        web_daily="Seitenaufrufe pro Tag (30 Tage)", web_cty="Anfragen nach Land (Anteil, 30 Tage, ungefiltert)", b_week="Bing-Suche pro Woche (12 Wochen)", b_q="Wonach Menschen bei Bing suchen, um M365.FM zu finden",
        q="Suchanfrage", clicks="Klicks", imps="Impressionen", ai_h="KI-Assistenten", ai_t="Microsoft Copilot und KI-Dienste von Partnern haben M365.FM-Seiten zwischen {p} {n}-mal zitiert – im Schnitt {d} verschiedene Seiten pro Tag.",
        pod_h="Podcast: M365.FM", pod_lead="Wochenfolgen, tägliche „Simply Explained“-Folgen und Sprachfassungen der Show auf Spreaker, Apple Podcasts, Spotify und YouTube.",
        pod_lang="Downloads je Sprachfassung ({p})", pod_note="Spreaker-Downloads der M365.FM-Shows je Sprache, gleicher Zeitraum.",
        audience="Zielgruppe", audience_t="Menschen, die Microsoft 365 planen, betreiben, absichern und einführen: IT-Administratoren, Lösungsarchitekten, Berater bei Microsoft-Partnern, Entscheider für IT und Digital Workplace, Trainer sowie die Microsoft-Community (MVPs, MCTs, User Groups).",
        channels="Kanäle und Formate",
        ch=["Podcast M365.FM – Wochenfolgen und tägliche „Simply Explained“-Folgen; Sprachfassungen der Show",
            "YouTube-Kanal m365 Show – animierte Erklärvideos, Shorts und Zertifizierungskurse",
            "www.m365.fm – Folgenseiten, Artikel, Themenseiten (Entitäten), Wiki, Events, Expertenverzeichnis",
            "Community – Mitglieder- und Expertenprofile, Expert Connect für Journalisten und PR (in Vorbereitung), Online-Konferenz M365Con",
            "LinkedIn – Unternehmensseite M365 Show und Newsletter"],
        why="Warum Sponsoren M365.FM wählen",
        whys=["Themen-Passung: Ihre Marke erscheint genau dort, wo Microsoft-365-Fachleute nach Antworten suchen – nach Thema, nicht nach breiter Masse.",
              "Langlebige Inhalte: Folgen, Videos und Themenseiten bleiben in Suche und KI-Assistenten auffindbar, lange nach der Kampagne.",
              "International: Sprachfassungen und eine Website in {n} Sprachen statt nur eines Marktes.",
              "Messbar: Sponsor-Dashboard mit Downloads, getrackten Klicks, Videoaufrufen, Leads und KI-Zitaten Ihrer Entitäten."],
        sp_h="Sponsor werden", sp_lead="Pakete aus der aktuellen Preisliste auf www.m365.fm/sponsor/ (Listenpreise in USD, ggf. zzgl. USt.). Dort stellen Sie Ihr Paket zusammen und schicken die Anfrage in zwei Minuten ab.",
        sp_pkg="Paket", sp_price="Listenpreis", sp_disc="Laufzeitrabatt auf Basis- und Videopaket: {d}. Höchstens {n} Sponsoren pro Thema.",
        sp_rules="Gesponserte Inhalte sind immer gekennzeichnet; Links zu Sponsoren tragen rel=\"sponsored\". Keine gekauften Links, redaktionelle Unabhängigkeit der Folgen.",
        cta="Sponsoring zusammenstellen", cta_url="www.m365.fm/de/sponsor/",
        contact="Kontakt", contact_t="Mirko Peters · mirko.peters@m365.fm · www.m365.fm",
        note="Alle Zahlen stammen direkt aus den genannten Quellen für den angegebenen Zeitraum. Nicht verfügbare Werte werden weggelassen, nicht geschätzt.",
        units={"topic_month": "pro Thema und Monat", "each": "je Stück", "month": "pro Monat", "once": "einmalig", "issue_month": "pro Ausgabe"},
    ),
}


def fmt(lang, n):
    s = f"{int(round(n)):,}"
    return s.replace(",", ".") if lang == "de" else s


def nm(table, key, lang):
    v = table.get(key)
    return v[0 if lang == "en" else 1] if v else key


def rows_for(lang, D):
    t = TXT[lang]; k, s = t["k"], t["s"]; R = []
    y, c, b, l = D.get("youtube", {}), D.get("cloudflare", {}), D.get("bing", {}), D.get("local", {})
    if "views28" in y:
        R += [(k["yt_views"], fmt(lang, y["views28"]), s["yt"], t["d28"]), (k["yt_minutes"], fmt(lang, y["minutes28"]), s["yt"], t["d28"]),
              (k["yt_subs_new"], fmt(lang, y["subs_gained28"]), s["yt"], t["d28"])]
    if "subscribers" in y: R.append((k["yt_subs"], fmt(lang, y["subscribers"]), s["yt"], t["total"]))
    if "videos" in y: R.append((k["videos"], fmt(lang, y["videos"]), s["yt"], t["total"]))
    if "pageviews30" in c:   # Besucher (unique IPs) schwanken durch Bots stark - nur Seitenaufrufe, als ungefiltert gekennzeichnet
        R.append((k["pv"], fmt(lang, c["pageviews30"]), s["cf"], t["d30"]))
    if "spreaker7" in l: R.append((k["sp"], fmt(lang, l["spreaker7"]), s["sp"], l.get("spreaker_period") or t["d7"]))
    if "ai_citations" in l: R.append((k["ai"], fmt(lang, l["ai_citations"]), s["ai"], l.get("ai_period", "")))
    if l.get("gsc"):
        R += [(k["g_imp"], fmt(lang, l["gsc"]["impressions"]), s["gsc"], l.get("gsc_period", "")), (k["g_clicks"], fmt(lang, l["gsc"]["clicks"]), s["gsc"], l.get("gsc_period", ""))]
    if b.get("impressions28"):
        R += [(k["b_imp"], fmt(lang, b["impressions28"]), s["bing"], t["d28"]), (k["b_clicks"], fmt(lang, b["clicks28"]), s["bing"], t["d28"])]
    if "site_languages" in l: R.append((k["langs"], str(l["site_languages"]), s["site"], ""))
    return R


# ---------- PDF ----------
def fonts(cache):
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    cache.mkdir(parents=True, exist_ok=True)
    ok = {}
    for name, url in FONT_URLS.items():
        f = cache / (name + ".ttf")
        try:
            if not f.exists(): urllib.request.urlretrieve(url, f)
            pdfmetrics.registerFont(TTFont(name, str(f))); ok[name] = name
        except Exception as e:
            print("Schrift fehlt:", name, type(e).__name__)
    fb = {"Barlow": "Helvetica", "Barlow-SemiBold": "Helvetica-Bold", "Barlow-Bold": "Helvetica-Bold", "BarlowCondensed-SemiBold": "Helvetica-Bold"}
    return {k: ok.get(k, fb[k]) for k in FONT_URLS}


def build_pdf(path, lang, D, F):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.colors import HexColor
    from reportlab.pdfgen import canvas
    from reportlab.lib.utils import simpleSplit
    t = TXT[lang]
    y_, c_, b_, l_ = D.get("youtube", {}), D.get("cloudflare", {}), D.get("bing", {}), D.get("local", {})
    nl = l_.get("site_languages", 15)
    W, H = A4; M = 48; CW = W - 2 * M
    INK, MUT, AC, AC2, BD, BG, WH = (HexColor(x) for x in ("#17191c", "#5d6470", "#3b6391", "#9fb6d3", "#d9dbde", "#f3f3f2", "#ffffff"))
    cv = canvas.Canvas(str(path), pagesize=A4)
    cv.setTitle(f"M365.FM {t['title']}"); cv.setAuthor("M365.FM"); cv.setSubject(t["sub"])
    state = {"page": 0}

    def para(x, y, text, font, size, color=INK, width=CW, lead=None):
        lead = lead or size * 1.4
        cv.setFont(font, size); cv.setFillColor(color)
        for line in simpleSplit(text, font, size, width):
            cv.drawString(x, y, line); y -= lead
        return y

    def new_page():
        if state["page"]: cv.showPage()
        state["page"] += 1
        cv.setFillColor(BG); cv.rect(0, 0, W, H, stroke=0, fill=1)
        y = H - M
        cv.setFillColor(INK); cv.setFont(F["Barlow-Bold"], 16); cv.drawString(M, y, "M365")
        w = cv.stringWidth("M365", F["Barlow-Bold"], 16); cv.setFillColor(AC); cv.drawString(M + w, y, ".FM")
        cv.setFillColor(MUT); cv.setFont(F["Barlow"], 9); cv.drawRightString(W - M, y, f"{t['title']} · {t['asof']} {D['generated']}")
        cv.setStrokeColor(INK); cv.setLineWidth(1.5); cv.line(M, y - 10, W - M, y - 10)
        cv.setFillColor(MUT); cv.setFont(F["Barlow"], 8); cv.drawString(M, M - 18, "© M365.FM · www.m365.fm"); cv.drawRightString(W - M, M - 18, f"{t['page']} {state['page']}")
        return y - 40

    def h2(y, title, lead=None):
        cv.setFillColor(INK); cv.setFont(F["BarlowCondensed-SemiBold"], 28); cv.drawString(M, y - 18, title); y -= 30
        if lead: y = para(M, y, lead, F["Barlow"], 10.5, MUT, lead=14.5) - 4
        return y - 8

    def kicker(y, text, x=M, w=CW):
        cv.setFont(F["BarlowCondensed-SemiBold"], 11); cv.setFillColor(AC)
        cv.drawString(x, y, text.upper()); tw = cv.stringWidth(text.upper(), F["BarlowCondensed-SemiBold"], 11)
        cv.setStrokeColor(BD); cv.setLineWidth(.6); cv.line(x + tw + 8, y + 3, x + w, y + 3)
        return y - 18

    def hbars(y, items, x=M, w=CW, valfmt=None, bar_h=11, gap=6, label_w=None):
        """items: [(label, value)] horizontale Balken, Wert rechts"""
        if not items: return y
        mx = max(v for _, v in items) or 1
        label_w = label_w or min(w * .42, 170)
        for lab, v in items:
            cv.setFillColor(INK); cv.setFont(F["Barlow"], 8.6)
            lab = simpleSplit(str(lab), F["Barlow"], 8.6, label_w - 6)[0] if lab else ""
            cv.drawString(x, y - bar_h + 2.5, lab)
            bw = (w - label_w - 52) * (v / mx)
            cv.setFillColor(AC); cv.rect(x + label_w, y - bar_h, max(bw, 1), bar_h, stroke=0, fill=1)
            cv.setFillColor(MUT); cv.setFont(F["Barlow-SemiBold"], 8.2)
            cv.drawString(x + label_w + bw + 5, y - bar_h + 2.5, valfmt(v) if valfmt else fmt(lang, v))
            y -= bar_h + gap
        return y - 4

    def vbars(y, items, x=M, w=CW, h=110, lab_every=1, valfmt=None, show_vals=True):
        """items: [(label, value)] Saeulen"""
        if not items: return y
        mx = max(v for _, v in items) or 1; n = len(items); g = 4 if n < 20 else 2
        bw = (w - g * (n - 1)) / n; base = y - h
        cv.setStrokeColor(BD); cv.setLineWidth(.6); cv.line(x, base, x + w, base)
        for i, (lab, v) in enumerate(items):
            bh = (h - 16) * v / mx; bx = x + i * (bw + g)
            cv.setFillColor(AC); cv.rect(bx, base, bw, max(bh, .5), stroke=0, fill=1)
            if show_vals and n <= 14:
                cv.setFillColor(INK); cv.setFont(F["Barlow-SemiBold"], 7.6); cv.drawCentredString(bx + bw / 2, base + bh + 3, valfmt(v) if valfmt else fmt(lang, v))
            if i % lab_every == 0:
                cv.setFillColor(MUT); cv.setFont(F["Barlow"], 7.4); cv.drawCentredString(bx + bw / 2, base - 10, str(lab))
        return base - 22

    def table(y, head, rows, cols, x=M):
        cv.setFont(F["Barlow-SemiBold"], 8); cv.setFillColor(MUT)
        cx = x
        for hd, cw in zip(head, cols):
            (cv.drawRightString(cx + cw, y, hd.upper()) if hd != head[0] else cv.drawString(cx, y, hd.upper())); cx += cw
        y -= 6; cv.setStrokeColor(BD); cv.line(x, y, x + sum(cols), y); y -= 12
        for r in rows:
            cx = x
            for i, (val, cw) in enumerate(zip(r, cols)):
                cv.setFillColor(INK); cv.setFont(F["Barlow"] if i == 0 else F["Barlow-SemiBold"], 8.8)
                if i == 0: cv.drawString(cx, y, simpleSplit(str(val), F["Barlow"], 8.8, cw - 8)[0] if val else "")
                else: cv.drawRightString(cx + cw, y, str(val))
                cx += cw
            y -= 5; cv.setStrokeColor(BD); cv.setLineWidth(.4); cv.line(x, y, x + sum(cols), y); y -= 11
        return y - 4

    pct = lambda v: (f"{v:.1f} %".replace(".", ",") if lang == "de" else f"{v:.1f}%")

    # --- Seite 1: Ueberblick ---
    y = new_page()
    cv.setFillColor(INK); cv.setFont(F["BarlowCondensed-SemiBold"], 46); cv.drawString(M, y - 22, t["title"]); y -= 54
    y = para(M, y, t["sub"], F["Barlow-SemiBold"], 15, MUT) - 8
    y = para(M, y, t["intro"].format(n=nl), F["Barlow"], 11.5, INK, lead=16.5) - 14
    y = kicker(y, t["reach"])
    rows = rows_for(lang, D)
    cols, gap = 3, 10; cw = (CW - gap * (cols - 1)) / cols; ch = 72
    for i, (label, val, src, per) in enumerate(rows):
        cx = M + (i % cols) * (cw + gap); cy = y - (i // cols) * (ch + gap) - ch
        cv.setFillColor(WH); cv.setStrokeColor(BD); cv.setLineWidth(.6); cv.rect(cx, cy, cw, ch, stroke=1, fill=1)
        cv.setFillColor(AC); cv.setFont(F["BarlowCondensed-SemiBold"], 24); cv.drawString(cx + 10, cy + ch - 30, val)
        cv.setFillColor(INK); cv.setFont(F["Barlow-SemiBold"], 8.6); ly = cy + ch - 44
        for line in simpleSplit(label, F["Barlow-SemiBold"], 8.6, cw - 20)[:2]: cv.drawString(cx + 10, ly, line); ly -= 10.5
        cv.setFillColor(MUT); cv.setFont(F["Barlow"], 7.2)
        for line in simpleSplit(f"{src}{' · ' + per if per else ''}", F["Barlow"], 7.2, cw - 20)[:2]: cv.drawString(cx + 10, ly, line); ly -= 9
    y = y - ((len(rows) + cols - 1) // cols) * (ch + gap) - 10
    para(M, y, t["note"], F["Barlow"], 8, MUT, lead=11)

    # --- Seite 2: YouTube ---
    if y_:
        y = new_page(); y = h2(y, t["yt_h"], t["yt_lead"])
        if y_.get("monthly"):
            y = kicker(y, t["yt_month"])
            mon = [(m[0][5:7] + "/" + m[0][2:4], m[1]) for m in y_["monthly"]]
            y = vbars(y, mon, h=120) - 4
        half = (CW - 24) / 2
        if y_.get("top_videos"):
            y = kicker(y, t["yt_top"])
            y = hbars(y, [(v[0], v[1]) for v in y_["top_videos"]], label_w=CW * .62) - 4
        ys = y
        if y_.get("countries"):
            tv = sum(v for _, v in y_["countries"]) or 1
            tot28 = y_.get("views28") or tv
            yl = kicker(ys, t["yt_cty"], M, half)
            yl = hbars(yl, [(nm(COUNTRY, k, lang), v * 100 / tot28) for k, v in y_["countries"][:8]], M, half, pct, label_w=90) - 8
        else: yl = ys
        yr = ys
        if y_.get("traffic"):
            tv = sum(v for _, v in y_["traffic"]) or 1
            yr = kicker(ys, t["yt_src"], M + half + 24, half)
            yr = hbars(yr, [(nm(SRC, k, lang), v * 100 / tv) for k, v in y_["traffic"]], M + half + 24, half, pct, label_w=105) - 8
        y = min(yl, yr)
        if y < 260: y = new_page(); y = h2(y, t["yt_h"])
        ys = y
        yl = yr = ys
        if y_.get("age"):
            yl = kicker(ys, t["yt_age"], M, half); yl = hbars(yl, [(a, p) for a, p in y_["age"]], M, half, pct, label_w=60)
        if y_.get("gender") or y_.get("devices"):
            yr = ys
            if y_.get("gender"):
                yr = kicker(yr, t["yt_gen"], M + half + 24, half); yr = hbars(yr, [(nm(GEN, g, lang), p) for g, p in y_["gender"]], M + half + 24, half, pct, label_w=70) - 8
            if y_.get("devices"):
                tv = sum(v for _, v in y_["devices"]) or 1
                yr = kicker(yr, t["yt_dev"], M + half + 24, half); yr = hbars(yr, [(nm(DEV, d, lang), v * 100 / tv) for d, v in y_["devices"]], M + half + 24, half, pct, label_w=70)
        y = min(yl, yr) - 6
        if "avg_view_sec" in y_:
            y = kicker(y, t["yt_eng"])
            s = y_["avg_view_sec"]
            items = [(t["avd"], f"{s // 60}:{s % 60:02d} min"), (t["likes"], fmt(lang, y_.get("likes28", 0))), (t["shares"], fmt(lang, y_.get("shares28", 0)))]
            bw = (CW - 20) / 3
            for i, (lab, val) in enumerate(items):
                bx = M + i * (bw + 10)
                cv.setFillColor(WH); cv.setStrokeColor(BD); cv.rect(bx, y - 46, bw, 46, stroke=1, fill=1)
                cv.setFillColor(AC); cv.setFont(F["BarlowCondensed-SemiBold"], 20); cv.drawString(bx + 10, y - 24, val)
                cv.setFillColor(INK); cv.setFont(F["Barlow-SemiBold"], 8.4); cv.drawString(bx + 10, y - 38, lab)
            y -= 60

    # --- Seite: Website, Suche, KI ---
    if c_ or b_ or l_.get("ai_citations"):
        y = new_page(); y = h2(y, t["web_h"], t["web_lead"])
        if c_.get("daily"):
            y = kicker(y, t["web_daily"])
            y = vbars(y, [(d[8:10] + "." + d[5:7] if lang == "de" else d[5:7] + "/" + d[8:10], v) for d, v in c_["daily"]], h=95, lab_every=5, show_vals=False) - 4
        if b_.get("weekly"):
            y = kicker(y, t["b_week"] + f" · {t['imps']}")
            y = vbars(y, [(w[0][5:10].replace("-", "/") if lang == "en" else w[0][8:10] + "." + w[0][5:7], w[2]) for w in b_["weekly"]], h=90, lab_every=2, show_vals=False) - 4
        if b_.get("queries"):
            y = kicker(y, t["b_q"])
            y = table(y, [t["q"], t["imps"], t["clicks"]], [(q[0], fmt(lang, q[2]), fmt(lang, q[1])) for q in b_["queries"][:10]], [CW - 160, 80, 80])
        if y < 230: y = new_page(); y = h2(y, t["web_h"])
        half = (CW - 24) / 2; ys = y; yl = yr = ys
        if c_.get("countries"):
            yl = kicker(ys, t["web_cty"], M, half); yl = hbars(yl, [(k, v) for k, v in c_["countries"][:8]], M, half, pct, label_w=90)
        if l_.get("ai_citations"):
            yr = kicker(ys, t["ai_h"], M + half + 24, half)
            cv.setFillColor(AC); cv.setFont(F["BarlowCondensed-SemiBold"], 30); cv.drawString(M + half + 24, yr - 24, fmt(lang, l_["ai_citations"])); yr -= 36
            yr = para(M + half + 24, yr, t["ai_t"].format(n=fmt(lang, l_["ai_citations"]), p=l_.get("ai_period", ""), d=fmt(lang, l_.get("ai_pages_day", 0))), F["Barlow"], 9.5, INK, half, 13)
        y = min(yl, yr)

    # --- Seite: Podcast + Zielgruppe + Kanaele ---
    y = new_page(); y = h2(y, t["pod_h"], t["pod_lead"])
    if l_.get("spreaker_langs"):
        y = kicker(y, t["pod_lang"].format(p=l_.get("spreaker_period", "")))
        y = hbars(y, [(nm(LANG_NAMES, k, lang), v) for k, v in l_["spreaker_langs"]], label_w=110, bar_h=10, gap=5)
        y = para(M, y, t["pod_note"], F["Barlow"], 8, MUT) - 10
    y = kicker(y, t["audience"]); y = para(M, y, t["audience_t"], F["Barlow"], 10.5, lead=15) - 12
    y = kicker(y, t["channels"])
    for c in t["ch"]:
        cv.setFillColor(AC); cv.rect(M, y - 1, 5, 5, stroke=0, fill=1)
        y = para(M + 14, y - 2, c, F["Barlow"], 10.2, width=CW - 14, lead=14) - 5

    # --- Seite: Sponsor werden ---
    y = new_page(); y = h2(y, t["sp_h"], t["sp_lead"])
    y = kicker(y, t["why"])
    for w_ in t["whys"]:
        cv.setFillColor(AC); cv.rect(M, y - 1, 5, 5, stroke=0, fill=1)
        y = para(M + 14, y - 2, w_.format(n=nl), F["Barlow"], 10.2, width=CW - 14, lead=14) - 5
    y -= 8
    P = l_.get("pricing") or {}; I = (l_.get("sponsor_i18n") or {}).get(lang) or (l_.get("sponsor_i18n") or {}).get("en") or {}
    if P.get("prices") and I:
        y = kicker(y, t["sp_pkg"] + " · " + t["sp_price"])
        order = [("base", "base_h", "base_b1"), ("video", "video_h", "video_b"), ("topic", "topic_h", "topic_hint"), ("lang", "lang_h", "lang_hint"),
                 ("pr", "pr_h", "pr_b"), ("auth", "auth_h", None), ("expert", "expert_h", "expert_hint"), ("li", "li_h", "li_hint"), ("dash", "dash_h", "dash_hint")]
        fillv = {"episodes": P.get("episodes_per_topic", ""), "n": P.get("topic_sponsors_max", "") if True else "", "code": 'rel="sponsored"'}
        for key, hk, bk in order:
            if key not in P["prices"] or hk not in I: continue
            name = I[hk].replace("{n}", str(nl) if key == "lang" else str(P.get("topic_sponsors_max", "")))
            desc = (I.get(bk) or "") if bk else ""
            for a, b in fillv.items(): desc = desc.replace("{" + a + "}", str(b))
            unit = t["units"].get(P.get("units", {}).get(key, ""), "")
            price = ("$" + fmt("en", P["prices"][key])) + (f" · {unit}" if unit else "")
            cv.setFillColor(INK); cv.setFont(F["Barlow-SemiBold"], 10); cv.drawString(M, y, name)
            cv.setFillColor(AC); cv.setFont(F["Barlow-SemiBold"], 10); cv.drawRightString(W - M, y, price)
            y -= 12
            if desc: y = para(M, y, desc, F["Barlow"], 8.6, MUT, CW - 150, 11)
            cv.setStrokeColor(BD); cv.setLineWidth(.4); cv.line(M, y + 2, W - M, y + 2); y -= 10
        disc = P.get("discount") or {}
        dtxt = ", ".join(f"{k} {'Monate' if lang == 'de' else 'months'} −{int(v * 100)} %" for k, v in disc.items() if v)
        y = para(M, y, t["sp_disc"].format(d=dtxt, n=P.get("topic_sponsors_max", "")), F["Barlow"], 8.6, MUT) - 2
    y = para(M, y, t["sp_rules"], F["Barlow"], 8.6, MUT) - 14
    # CTA-Kasten mit QR-Code
    box_h = 104
    cv.setFillColor(INK); cv.rect(M, y - box_h, CW, box_h, stroke=0, fill=1)
    cv.setFillColor(WH); cv.setFont(F["BarlowCondensed-SemiBold"], 26); cv.drawString(M + 18, y - 38, t["cta"] + " →")
    cv.setFont(F["Barlow-SemiBold"], 13); cv.setFillColor(AC2); cv.drawString(M + 18, y - 60, t["cta_url"])
    cv.setFont(F["Barlow"], 10); cv.setFillColor(WH); cv.drawString(M + 18, y - 82, t["contact_t"])
    url = "https://" + t["cta_url"]
    cv.linkURL(url, (M, y - box_h, W - M, y), relative=0)
    try:
        from reportlab.graphics.barcode.qr import QrCodeWidget
        from reportlab.graphics.shapes import Drawing
        from reportlab.graphics import renderPDF
        qw = QrCodeWidget(url); bx = qw.getBounds(); s = 84
        dr = Drawing(s, s, transform=[s / (bx[2] - bx[0]), 0, 0, s / (bx[3] - bx[1]), 0, 0]); dr.add(qw)
        cv.setFillColor(WH); cv.rect(W - M - s - 12, y - box_h + 10, s + 4, s + 4, stroke=0, fill=1)
        renderPDF.draw(dr, cv, W - M - s - 10, y - box_h + 12)
    except Exception as e:
        print("QR-Code ausgelassen:", type(e).__name__)
    cv.showPage(); cv.save()


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--out", default="out/mediakit"); ap.add_argument("--fonts", default=".cache/fonts")
    a = ap.parse_args()
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    D = {"generated": str(TODAY), "youtube": youtube(), "cloudflare": cloudflare(), "bing": bing(), "local": local()}
    F = fonts(Path(a.fonts))
    for lang in ("en", "de"):
        p = out / f"m365fm-media-kit-{lang}.pdf"; build_pdf(p, lang, D, F)
        print("PDF:", p, p.stat().st_size // 1024, "KB,", len(rows_for(lang, D)), "Kennzahlen")
    pub = {k: v for k, v in D.items() if k != "local"}
    pub["local"] = {k: v for k, v in D["local"].items() if k not in ("pricing", "sponsor_i18n")}
    (out / "latest.json").write_text(json.dumps(pub, ensure_ascii=False, indent=1), "utf-8")
    if not rows_for("en", D): sys.exit("Keine Kennzahlen verfuegbar - PDF nicht veroeffentlichen")


if __name__ == "__main__":
    main()
