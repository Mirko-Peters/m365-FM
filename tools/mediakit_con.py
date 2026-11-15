#!/usr/bin/env python3
"""Sponsoring- und Mediadaten der M365Con als PDF (EN/DE) - zweite Marke des Media-Kit-Generators (Issue #260).

Aufruf: python tools/mediakit.py --brand m365con --out out/mediakit-con --fonts .cache/fonts
        (oder direkt: python tools/mediakit_con.py --out ... --fonts ...)
Ergebnis: m365con-sponsor-deck-en.pdf, m365con-sponsor-deck-de.pdf, latest.json (nur Summen, Grundlage fuer GET /api/mediakit/summary?brand=m365con)

Quellen (nur Summen, nie Personendaten; fehlende Werte werden weggelassen, nie geschaetzt; bei jeder Zahl Zeitraum und Quelle):
  - HeySummit MCP (https://api.heysummit.com/mcp/, Secret HEYSUMMIT_API_KEY): je Event get_event (Titel, Termine, URL, Themen, Formate, Logo),
    get_event_briefing (Anzahl Talks, Speaker, Kategorien, Anmeldungen als Summe, Sponsoren) und list_sponsors (nur Name, URL und Logo der
    Partner, die auf der Event-Seite oeffentlich gezeigt werden: is_active und show_on_landing_page). Teilnehmerlisten werden nie abgerufen.
  - YouTube Analytics + Data API (Token des Kanals m365 Show, channel==MINE): Con-Videos = Titel, Beschreibung oder Playlist enthaelt
    "M365Con", "M365 Con" oder "m365con.net"; getrennt per liveStreamingDetails in Livestreams und Recaps. Findet der Lauf nichts, meldet er das.
  - Google Search Console (GSC_SERVICE_ACCOUNT_JSON; Property sc-domain:m365con.net, sonst https://m365con.net/) und Bing Webmaster
    (BING_WEBMASTER_API_KEY, siteUrl https://m365con.net/). Ohne Zugriff (403) entfaellt der Abschnitt mit einer Log-Zeile.
  - data/stats/m365con_linkedin.json: LinkedIn-Zahlen der Unternehmensseite M365 Show, von Hand eingetragen (keine API); nur bei status "ok".
  - data/press_mentions.json: Erwaehnungen der M365Con im M365.FM-Pressearchiv.
Keine Preise: das Deck endet mit "Sponsoring auf Anfrage" und Kontakt (Wunsch Mirko, 5.11.2026).
"""
import argparse, datetime as dt, io, json, os, re, sys, urllib.error, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tools"))
import mediakit as MK   # noqa: E402  (http, fmt, nm, COUNTRY, bing, yt_headers)

TODAY = MK.TODAY
HS_MCP = "https://api.heysummit.com/mcp/"
# Neueste zuerst: M365 Con 27 (11.-22.1.2027, m365con.net), M365 Con DACH (Sept. 2026, de.m365con.net), M365 Con 2026 (Jan. 2026, 2026.m365con.net)
EVENTS = (229506, 229540, 150009)
NEXT_EVENT = 229506
OWN_DOMAINS = ("m365.fm", "m365.show", "m365con.net")   # eigene Marken nicht als Partner zeigen
CON_RX = re.compile(r"m365\s?con\b|m365con\.net", re.I)
LINKEDIN_FILE = ROOT / "data" / "stats" / "m365con_linkedin.json"
MAIL = "mirko.peters@m365.fm"

# Ein Theme fuer alles (PDF, Seite /m365con/sponsor/, HeySummit-Einbettung): data/m365con_theme.json (Herleitung dort in "_doc").
THEME = {k: v for k, v in json.loads((ROOT / "data" / "m365con_theme.json").read_text("utf-8")).items() if not k.startswith("_")}
FONT_URLS = {"Poppins": "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf",
             "Poppins-SemiBold": "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-SemiBold.ttf",
             "Poppins-Bold": "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf"}
FONT_FB = {"Poppins": "Helvetica", "Poppins-SemiBold": "Helvetica-Bold", "Poppins-Bold": "Helvetica-Bold"}


def log(*a):
    print("M365Con:", *a)


# ---------------------------------------------------------------- HeySummit (MCP)
class HeySummit:
    """Kleiner MCP-Client (JSON-RPC ueber HTTP, Antwort als JSON oder SSE). Header-Varianten wie in secrets-check.yml."""
    HEADERS = ("Authorization: Bearer {k}", "Authorization: Token {k}", "X-API-Key: {k}", "Authorization: Api-Key {k}")

    def __init__(self, key, url=HS_MCP):
        self.key, self.url, self.auth, self.sid, self.n = key, url, None, None, 0

    def _post(self, payload, auth):
        hd = {"Content-Type": "application/json", "Accept": "application/json, text/event-stream", "User-Agent": "m365fm-mediakit/1.0"}
        name, val = auth.split(": ", 1)
        hd[name] = val.format(k=self.key)
        if self.sid: hd["Mcp-Session-Id"] = self.sid
        rq = urllib.request.Request(self.url, data=json.dumps(payload).encode(), headers=hd, method="POST")
        try:
            with urllib.request.urlopen(rq, timeout=60) as r:
                return r.status, r.headers, r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            return e.code, e.headers, ""
        except Exception as e:   # noqa: BLE001
            log("HeySummit nicht erreichbar:", type(e).__name__)
            return 0, {}, ""

    @staticmethod
    def parse(text):
        data = re.findall(r"^data:\s*(\{.*\})\s*$", text or "", re.M)
        try:
            return json.loads(data[-1] if data else (text or "{}"))
        except ValueError:
            return {}

    def start(self):
        init = {"jsonrpc": "2.0", "id": 0, "method": "initialize",
                "params": {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "m365fm-mediakit", "version": "1.0"}}}
        for auth in self.HEADERS:
            st, hd, _ = self._post(init, auth)
            if st == 200:
                self.auth = auth
                self.sid = (hd.get("Mcp-Session-Id") or hd.get("mcp-session-id")) if hd else None
                self._post({"jsonrpc": "2.0", "method": "notifications/initialized"}, auth)
                return True
            if st == 0: return False
        log("HeySummit: Anmeldung am MCP fehlgeschlagen (HEYSUMMIT_API_KEY pruefen, Workflow secrets-check.yml)")
        return False

    def call(self, name, args):
        self.n += 1
        st, _, body = self._post({"jsonrpc": "2.0", "id": self.n, "method": "tools/call", "params": {"name": name, "arguments": args}}, self.auth)
        if st != 200:
            log(f"HeySummit {name}: HTTP {st}"); return None
        res = self.parse(body).get("result") or {}
        if res.get("isError"):
            log(f"HeySummit {name}: Fehler des Werkzeugs"); return None
        if isinstance(res.get("structuredContent"), dict): return res["structuredContent"]
        for c in res.get("content") or []:
            if c.get("type") == "text":
                try: return json.loads(c.get("text") or "{}")
                except ValueError: return None
        return None


def _iso_day(s):
    return str(s or "")[:10] if re.match(r"\d{4}-\d{2}-\d{2}", str(s or "")) else ""


def _own(url):
    host = urllib.parse.urlparse(str(url or "")).netloc.lower()
    return any(host == d or host.endswith("." + d) for d in OWN_DOMAINS)


def heysummit(client=None):
    """Summen je Event + oeffentliche Partner. client: Objekt mit call(name, args) (Tests); sonst MCP mit HEYSUMMIT_API_KEY."""
    if client is None:
        key = os.environ.get("HEYSUMMIT_API_KEY", "").strip()
        if not key:
            log("HeySummit: Secret HEYSUMMIT_API_KEY fehlt - Abschnitt entfaellt"); return {}
        client = HeySummit(key)
        if not client.start(): return {}
    events, partners, seen = [], [], set()
    for eid in EVENTS:
        ev = (client.call("get_event", {"event_id": eid}) or {}).get("event") or {}
        br = (client.call("get_event_briefing", {"event_id": eid}) or {}).get("briefing") or {}
        if not ev and not br: log(f"HeySummit: Event {eid} ohne Daten"); continue
        cnt = br.get("counts") or {}
        e = {"id": eid, "title": ev.get("title") or (br.get("event") or {}).get("title") or "", "url": ev.get("event_url") or ev.get("url") or "",
             "first": _iso_day(ev.get("first_talk_at") or (br.get("event") or {}).get("first_talk_at")),
             "last": _iso_day(ev.get("last_talk_at") or (br.get("event") or {}).get("last_talk_at")),
             "lifecycle": (br.get("lifecycle") or {}).get("value") or "", "as_of": _iso_day(br.get("as_of")) or str(TODAY),
             "tags": [str(t)[:60] for t in (ev.get("tags") or []) if t][:16],
             "formats": [str(c.get("title"))[:60] for c in (ev.get("categories") or []) if c.get("title")][:10],
             "logo": ev.get("logo") or "", "logo_white": ev.get("logo_white") or ""}
        for k_out, k_in in (("talks", "talks"), ("speakers", "speakers"), ("registrations", "attendees"), ("sponsors", "sponsors"), ("categories", "categories")):
            v = cnt.get(k_in)
            if isinstance(v, int) and not isinstance(v, bool) and v >= 0: e[k_out] = v
        events.append(e)
        sp = (client.call("list_sponsors", {"event_id": eid, "limit": 50}) or {}).get("sponsors") or []
        for s in sp:   # nur, was auf der Event-Seite oeffentlich steht; keine Telefonnummern, Texte o. Ae.
            if not (s.get("is_active") and s.get("show_on_landing_page")) or _own(s.get("url")): continue
            name = re.sub(r"\s+", " ", str(s.get("title") or "")).strip()[:80]
            if not name or name.lower() in seen: continue
            seen.add(name.lower())
            partners.append({"name": name, "url": str(s.get("url") or "")[:200], "logo": str(s.get("logo") or s.get("logo_dark_background") or "")[:400], "event": eid})
    if not events: return {}
    log("HeySummit:", len(events), "Events,", len(partners), "oeffentliche Partner")
    return {"events": events, "partners": partners, "as_of": max(e["as_of"] for e in events)}


# ---------------------------------------------------------------- YouTube
def _chunks(xs, n):
    for i in range(0, len(xs), n): yield xs[i:i + n]


def youtube_con(H=None, get=None):
    """Con-Videos des Kanals: Livestreams und Recaps getrennt. get(url) -> (status, json) fuer Tests."""
    if get is None:
        H = H or MK.yt_headers()
        if not H:
            log("YouTube: nicht verbunden (YT_CLIENT_ID/YT_CLIENT_SECRET/YT_REFRESH_TOKEN) - Abschnitt entfaellt"); return {}
        get = lambda u: MK.http(u, headers=H)
    api, ana = "https://www.googleapis.com/youtube/v3/", "https://youtubeanalytics.googleapis.com/v2/reports?"
    st, c = get(api + "channels?part=contentDetails&mine=true")
    uploads = (((c.get("items") or [{}])[0].get("contentDetails") or {}).get("relatedPlaylists") or {}).get("uploads") if st == 200 else None
    ids = []

    def walk(pl, only_con, pages=120):
        tok = ""
        for _ in range(pages):
            st, d = get(api + "playlistItems?" + urllib.parse.urlencode({"part": "snippet,contentDetails", "maxResults": 50, "playlistId": pl, **({"pageToken": tok} if tok else {})}))
            if st != 200: break
            for it in d.get("items") or []:
                sn, vid = it.get("snippet") or {}, (it.get("contentDetails") or {}).get("videoId")
                if vid and vid not in ids and (not only_con or CON_RX.search(f'{sn.get("title", "")} {sn.get("description", "")}')): ids.append(vid)
            tok = d.get("nextPageToken")
            if not tok: break

    if uploads: walk(uploads, True)
    tok = ""
    for _ in range(20):   # Playlists mit Con-Bezug: alle Videos darin zaehlen mit
        st, d = get(api + "playlists?" + urllib.parse.urlencode({"part": "snippet", "mine": "true", "maxResults": 50, **({"pageToken": tok} if tok else {})}))
        if st != 200: break
        for p in d.get("items") or []:
            sn = p.get("snippet") or {}
            if CON_RX.search(f'{sn.get("title", "")} {sn.get("description", "")}'): walk(p["id"], False, 20)
        tok = d.get("nextPageToken")
        if not tok: break
    if not ids:
        log("YouTube: keine Con-Videos auf diesem Kanal gefunden (Titel, Beschreibung oder Playlist mit M365Con, M365 Con, m365con.net). "
            "Liegen die Livestreams auf einem anderen Kanal? Abschnitt entfaellt, nichts geschaetzt.")
        return {}
    vids = {}
    for ch in _chunks(ids, 50):
        st, d = get(api + "videos?" + urllib.parse.urlencode({"part": "snippet,liveStreamingDetails", "id": ",".join(ch)}))
        for v in (d.get("items") or []) if st == 200 else []:
            lsd = v.get("liveStreamingDetails") or {}
            vids[v["id"]] = {"title": (v.get("snippet") or {}).get("title") or v["id"], "published": _iso_day((v.get("snippet") or {}).get("publishedAt")),
                             "live": bool(lsd.get("actualStartTime"))}   # Livestream = tatsaechlich live gesendet (actualStartTime)
    end = TODAY - dt.timedelta(days=1)
    out = {}
    for g, live in (("streams", True), ("recaps", False)):
        lst = [i for i, v in vids.items() if v["live"] == live]
        if not lst: continue
        start = min((vids[i]["published"] for i in lst if vids[i]["published"]), default=str(end - dt.timedelta(days=365)))
        rep = lambda ch, **q: get(ana + urllib.parse.urlencode({"ids": "channel==MINE", "startDate": start, "endDate": str(end), "filters": "video==" + ",".join(ch), **q}))
        r = {"videos": len(lst), "period": f"{start}–{end}"}
        views = minutes = 0; ok = False; cty, per_video, lod = {}, {}, {}
        for ch in _chunks(lst, 200):
            st, a = rep(ch, metrics="views,estimatedMinutesWatched")
            if st == 200 and a.get("rows"):
                ok = True; views += int(a["rows"][0][0]); minutes += int(a["rows"][0][1])
            st, a = rep(ch, dimensions="country", metrics="views", sort="-views", maxResults=25)
            for k, v in (a.get("rows") or []) if st == 200 else []: cty[k] = cty.get(k, 0) + int(v)
            st, a = rep(ch, dimensions="video", metrics="views,estimatedMinutesWatched", sort="-views", maxResults=200)
            for k, v, m in (a.get("rows") or []) if st == 200 else []: per_video[k] = [int(v), int(m)]
            if live:
                st, a = rep(ch, dimensions="liveOrOnDemand", metrics="views")
                for k, v in (a.get("rows") or []) if st == 200 else []: lod[k] = lod.get(k, 0) + int(v)
        if not ok:
            log(f"YouTube {g}: Analytics ohne Daten - Gruppe entfaellt"); continue
        r.update(views=views, minutes=minutes)
        if cty: r["countries"] = sorted(([k, v] for k, v in cty.items()), key=lambda x: -x[1])[:6]
        if lod.get("LIVE") is not None: r["live_views"] = lod["LIVE"]
        if lod.get("ON_DEMAND") is not None: r["ondemand_views"] = lod["ON_DEMAND"]
        top = sorted(per_video.items(), key=lambda kv: -kv[1][0])[:8]
        conc = {}
        if live:   # gleichzeitige Zuschauer je Stream (Live-Bericht der Analytics API); wird er abgelehnt, entfaellt die Angabe
            for vid in [k for k, _ in sorted(per_video.items(), key=lambda kv: -kv[1][0])][:40]:
                st, a = get(ana + urllib.parse.urlencode({"ids": "channel==MINE", "startDate": start, "endDate": str(end), "filters": "video==" + vid,
                                                          "metrics": "averageConcurrentViewers,peakConcurrentViewers"}))
                if st != 200: log("YouTube: gleichzeitige Zuschauer nicht abrufbar (HTTP", st, ") - Angabe entfaellt"); break
                row = (a.get("rows") or [[None, None]])[0]
                if row and row[0] is not None and row[1] is not None: conc[vid] = [int(round(float(row[0]))), int(row[1])]
            if conc:
                r["peak_max"] = max(v[1] for v in conc.values())
                r["avg_concurrent"] = int(round(sum(v[0] for v in conc.values()) / len(conc)))
                r["streams_measured"] = len(conc)
        r["top"] = [[vids.get(k, {}).get("title", k)[:120], v[0]] + (conc.get(k, []) if live else []) for k, v in top]
        out[g] = r
    log("YouTube:", {g: {k: v for k, v in r.items() if not isinstance(v, list)} for g, r in out.items()} or "keine Analytics-Daten")
    return out


# ---------------------------------------------------------------- Google Search Console
GSC_SITES = ("sc-domain:m365con.net", "https://m365con.net/")


def gsc_con(ta=None):
    """Google Search Console fuer m365con.net ueber tools/team_analytics.gsc (gemeinsamer Abruf, #262); Domain-Property zuerst."""
    return MK.gsc_site(*GSC_SITES, ta=ta)


# ---------------------------------------------------------------- Handeintraege und Bestand
LI_PAGE_KEYS = ("page_followers", "impressions_30d", "reactions_30d", "comments_30d", "reposts_30d")
LI_STREAM_KEYS = ("views", "impressions", "reactions", "unique_viewers", "peak_viewers")
_int = lambda v: isinstance(v, int) and not isinstance(v, bool) and v >= 0


def linkedin(path=LINKEDIN_FILE):
    """data/stats/m365con_linkedin.json (von Hand, monatlich). Nur bei status "ok"; ungueltige Werte fallen weg."""
    try:
        d = json.loads(Path(path).read_text("utf-8"))
    except Exception:   # noqa: BLE001
        return {}
    if d.get("status") != "ok": return {}
    out = {"source": str(d.get("source") or "LinkedIn page analytics export, manual")[:120], "retrieved": _iso_day(d.get("retrieved"))}
    pg = d.get("page") or {}
    per = pg.get("period") or {}
    page = {k: pg[k] for k in LI_PAGE_KEYS if _int(pg.get(k))}
    if not (_iso_day(per.get("from")) and _iso_day(per.get("to"))):
        page = {k: v for k, v in page.items() if k == "page_followers"}   # 30-Tage-Werte nur mit Zeitraum
    else:
        out["page_period"] = f'{_iso_day(per["from"])}–{_iso_day(per["to"])}'
    if page: out["page"] = page
    streams = []
    for s in d.get("streams") or []:
        if not isinstance(s, dict) or not str(s.get("title") or "").strip() or not _iso_day(s.get("date")): continue
        vals = {k: s[k] for k in LI_STREAM_KEYS if _int(s.get(k))}
        if vals: streams.append({"title": str(s["title"]).strip()[:120], "date": _iso_day(s["date"]), **vals})
    if streams: out["streams"] = sorted(streams, key=lambda x: x["date"], reverse=True)
    return out if ("page" in out or "streams" in out) else {}


def press():
    try:
        m = json.loads((ROOT / "data" / "press_mentions.json").read_text("utf-8")).get("mentions") or []
    except Exception:   # noqa: BLE001
        return {}
    hits = [x for x in m if CON_RX.search(json.dumps({k: x.get(k) for k in ("title", "work", "note", "url")}, ensure_ascii=False))]
    return {"mentions": len(hits), "latest": max((_iso_day(x.get("date")) for x in hits), default="")} if hits else {}


# ---------------------------------------------------------------- Kennzahlen (sprachneutral, auch fuer latest.json)
TXT = {
    "en": dict(
        title="Sponsor & media data", tagline="The Microsoft 365 Community Convention", asof="Figures as of", page="Page",
        intro="M365Con is a free online convention by and for the Microsoft 365 community: IT admins, architects, developers, Power Platform makers and "
              "decision makers learn from MVPs and practitioners – live over several days, on demand afterwards, and as live streams and recaps on YouTube and LinkedIn.",
        next="Next edition: {title} · {dates} · online · {url}", glance="At a glance",
        k=dict(reg_total="Registrations across all editions", reg_next="Registrations for the next edition", talks="Sessions across all editions",
               speakers="Speaker slots across all editions", editions="Editions on HeySummit", yt_stream_views="YouTube live stream views",
               yt_peak="Peak concurrent live viewers (YouTube)", yt_recap_views="YouTube recap views", yt_hours="YouTube watch time (hours)",
               li_views="LinkedIn live views", li_followers="LinkedIn page followers (M365 Show)", li_imp="LinkedIn impressions",
               g_clicks="Google search clicks (m365con.net)", g_imp="Google search impressions (m365con.net)",
               b_clicks="Bing search clicks (m365con.net)", b_imp="Bing search impressions (m365con.net)", press="Press mentions"),
        s=dict(hs="HeySummit", yt="YouTube Analytics", gsc="Google Search Console", bing="Bing Webmaster Tools", li="LinkedIn page analytics (manual export)",
               press="M365.FM press archive"),
        d28="last 28 days", asof_d="as of {d}", n_ed="{n} editions, as of {d}", n_streams="{n} live streams", n_videos="{n} videos",
        ed_h="Editions and programme", ed_lead="Each edition runs as a multi-day online convention on HeySummit with keynotes, expert sessions and workshops.",
        ed_cols=("Edition", "Dates", "Sessions", "Speakers", "Registrations", "Partners"), ed_reg="Registrations per edition (HeySummit, as of {d})",
        ed_note="Registrations are counted per edition; people who registered for several editions appear once per edition.",
        topics="Topics of the next edition", formats="Session formats",
        vid_h="Live streams and recaps", vid_lead="Sessions run live and stay available on demand – on the m365 Show YouTube channel and on the M365 Show LinkedIn page.",
        streams="YouTube live streams", recaps="YouTube recaps and session videos", videos="Videos", views="Views", hours="Watch time (hours)",
        live_views="Views during the live broadcast", od_views="Views on demand", peak="Peak concurrent viewers", avgc="Avg. concurrent viewers per stream",
        top_streams="Most watched live streams", top_recaps="Most watched recaps", cty="Viewers by country (share of views)",
        col_video="Video", col_avg="Avg. live", col_peak="Peak",
        ys_h="Google search for the m365 Show YouTube channel (whole channel, not only M365Con)", ys_imp="Google search impressions", ys_clicks="Google search clicks",
        ys_src="Google Search Console (YouTube channel property)",
        li_h="LinkedIn: M365 Show company page", li_lead="Live streams and posts on the M365 Show LinkedIn page. LinkedIn offers no API for page analytics – the figures are taken from the page analytics each month.",
        li_followers="Page followers", li_imp="Impressions", li_react="Reactions", li_comm="Comments", li_rep="Reposts",
        li_streams="Live streams on LinkedIn", li_cols=("Stream", "Date", "Views", "Impressions", "Reactions"),
        web_h="Website and search: m365con.net", web_lead="Session pages, speaker profiles and articles on m365con.net – found via Google and Bing.",
        g_week="Google search per week · impressions (12 weeks)", b_week="Bing search per week · impressions (12 weeks)",
        g_q="What people search for on Google to find M365Con", b_q="What people search for on Bing to find M365Con", q="Query", clicks="Clicks", imps="Impressions",
        press_t="{n} mention(s) of M365Con in the M365.FM press archive (latest: {d}).",
        partners_h="Partners of past and current editions", partners_lead="Partners as publicly listed on the event sites (HeySummit).",
        aud_h="Audience", aud_t="People who plan, run, secure and extend Microsoft 365: IT administrators, solution architects, consultants at Microsoft partners, "
                                "developers, Power Platform makers, IT and digital-workplace decision makers and the Microsoft community (MVPs, MCTs, user groups).",
        why_h="Why partner with M365Con",
        whys=["Topic fit: your brand appears where Microsoft 365 professionals learn – in sessions on exactly the products your offer is about.",
              "Live and long-lived: sessions are streamed live and stay available on demand, on YouTube and on LinkedIn.",
              "Community instead of ads: speakers are MVPs and practitioners; partners are visible next to real-world knowledge."],
        cta_h="Sponsoring on request", cta_t="Partnerships are put together individually for each edition. Write to us – we will get back to you with options and dates.",
        contact="Mirko Peters · mirko.peters@m365.fm", rules="Sponsored content is always labelled as such.",
        note="All figures come directly from the named sources for the stated period. Values that are not available are left out, not estimated.",
        months=("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"),
    ),
    "de": dict(
        title="Sponsoring- und Mediadaten", tagline="Die Microsoft 365 Community Convention", asof="Stand der Zahlen", page="Seite",
        intro="Die M365Con ist eine kostenlose Online-Convention von und für die Microsoft-365-Community: IT-Admins, Architekten, Entwickler, Power-Platform-Maker "
              "und Entscheider lernen von MVPs und Praktikern – mehrere Tage live, danach auf Abruf und als Livestreams und Recaps auf YouTube und LinkedIn.",
        next="Nächste Ausgabe: {title} · {dates} · online · {url}", glance="Auf einen Blick",
        k=dict(reg_total="Anmeldungen über alle Ausgaben", reg_next="Anmeldungen für die nächste Ausgabe", talks="Sessions über alle Ausgaben",
               speakers="Speaker-Slots über alle Ausgaben", editions="Ausgaben auf HeySummit", yt_stream_views="Aufrufe der YouTube-Livestreams",
               yt_peak="Höchstwert gleichzeitiger Live-Zuschauer (YouTube)", yt_recap_views="Aufrufe der YouTube-Recaps", yt_hours="YouTube-Wiedergabezeit (Stunden)",
               li_views="LinkedIn-Live-Aufrufe", li_followers="Follower der LinkedIn-Seite (M365 Show)", li_imp="LinkedIn-Impressionen",
               g_clicks="Google-Suchklicks (m365con.net)", g_imp="Google-Suchimpressionen (m365con.net)",
               b_clicks="Bing-Suchklicks (m365con.net)", b_imp="Bing-Suchimpressionen (m365con.net)", press="Presse-Erwähnungen"),
        s=dict(hs="HeySummit", yt="YouTube Analytics", gsc="Google Search Console", bing="Bing Webmaster Tools", li="LinkedIn-Seitenanalyse (Export, von Hand)",
               press="M365.FM-Pressearchiv"),
        d28="letzte 28 Tage", asof_d="Stand {d}", n_ed="{n} Ausgaben, Stand {d}", n_streams="{n} Livestreams", n_videos="{n} Videos",
        ed_h="Ausgaben und Programm", ed_lead="Jede Ausgabe läuft als mehrtägige Online-Convention auf HeySummit mit Keynotes, Expert Sessions und Workshops.",
        ed_cols=("Ausgabe", "Termin", "Sessions", "Speaker", "Anmeldungen", "Partner"), ed_reg="Anmeldungen je Ausgabe (HeySummit, Stand {d})",
        ed_note="Anmeldungen werden je Ausgabe gezählt; wer sich für mehrere Ausgaben angemeldet hat, zählt je Ausgabe einmal.",
        topics="Themen der nächsten Ausgabe", formats="Session-Formate",
        vid_h="Livestreams und Recaps", vid_lead="Die Sessions laufen live und bleiben auf Abruf verfügbar – auf dem YouTube-Kanal m365 Show und auf der LinkedIn-Seite der M365 Show.",
        streams="YouTube-Livestreams", recaps="YouTube-Recaps und Session-Videos", videos="Videos", views="Aufrufe", hours="Wiedergabezeit (Stunden)",
        live_views="Aufrufe während der Live-Übertragung", od_views="Aufrufe auf Abruf", peak="Höchstwert gleichzeitiger Zuschauer", avgc="Ø gleichzeitige Zuschauer je Stream",
        top_streams="Meistgesehene Livestreams", top_recaps="Meistgesehene Recaps", cty="Zuschauer nach Land (Anteil der Aufrufe)",
        col_video="Video", col_avg="Ø live", col_peak="Spitze",
        ys_h="Google-Suche für den YouTube-Kanal m365 Show (ganzer Kanal, nicht nur M365Con)", ys_imp="Google-Suchimpressionen", ys_clicks="Google-Suchklicks",
        ys_src="Google Search Console (Property des YouTube-Kanals)",
        li_h="LinkedIn: Unternehmensseite M365 Show", li_lead="Livestreams und Beiträge auf der LinkedIn-Seite der M365 Show. LinkedIn bietet keine API für die Seitenanalyse – die Zahlen werden monatlich aus der Seitenanalyse übernommen.",
        li_followers="Follower der Seite", li_imp="Impressionen", li_react="Reaktionen", li_comm="Kommentare", li_rep="Reposts",
        li_streams="Livestreams auf LinkedIn", li_cols=("Stream", "Datum", "Aufrufe", "Impressionen", "Reaktionen"),
        web_h="Website und Suche: m365con.net", web_lead="Session-Seiten, Speaker-Profile und Artikel auf m365con.net – gefunden über Google und Bing.",
        g_week="Google-Suche pro Woche · Impressionen (12 Wochen)", b_week="Bing-Suche pro Woche · Impressionen (12 Wochen)",
        g_q="Wonach Menschen bei Google suchen, um die M365Con zu finden", b_q="Wonach Menschen bei Bing suchen, um die M365Con zu finden", q="Suchanfrage", clicks="Klicks", imps="Impressionen",
        press_t="{n} Erwähnung(en) der M365Con im M365.FM-Pressearchiv (zuletzt: {d}).",
        partners_h="Partner bisheriger und aktueller Ausgaben", partners_lead="Partner, wie sie auf den Event-Seiten (HeySummit) öffentlich aufgeführt sind.",
        aud_h="Zielgruppe", aud_t="Menschen, die Microsoft 365 planen, betreiben, absichern und erweitern: IT-Administratoren, Lösungsarchitekten, Berater bei Microsoft-Partnern, "
                                  "Entwickler, Power-Platform-Maker, Entscheider für IT und Digital Workplace sowie die Microsoft-Community (MVPs, MCTs, User Groups).",
        why_h="Warum Partner der M365Con werden",
        whys=["Themen-Passung: Ihre Marke erscheint dort, wo Microsoft-365-Fachleute lernen – in Sessions zu genau den Produkten, um die es in Ihrem Angebot geht.",
              "Live und langlebig: Sessions werden live übertragen und bleiben auf Abruf verfügbar, auf YouTube und auf LinkedIn.",
              "Community statt Werbung: Speaker sind MVPs und Praktiker; Partner stehen neben echtem Praxiswissen."],
        cta_h="Sponsoring auf Anfrage", cta_t="Partnerschaften stellen wir für jede Ausgabe individuell zusammen. Schreiben Sie uns – wir melden uns mit Möglichkeiten und Terminen.",
        contact="Mirko Peters · mirko.peters@m365.fm", rules="Gesponserte Inhalte sind immer als solche gekennzeichnet.",
        note="Alle Zahlen stammen direkt aus den genannten Quellen für den angegebenen Zeitraum. Nicht verfügbare Werte werden weggelassen, nicht geschätzt.",
        months=("Jan.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."),
    ),
}


def dates(lang, a, b):
    """'Jan 11–22, 2027' / '11.–22. Jan. 2027' aus zwei ISO-Tagen; leer, wenn unbekannt."""
    if not a: return ""
    A = dt.date.fromisoformat(a); B = dt.date.fromisoformat(b) if b else A
    m = TXT[lang]["months"]
    if lang == "de":
        if (A.year, A.month) == (B.year, B.month): return f"{A.day}.–{B.day}. {m[A.month - 1]} {A.year}" if A != B else f"{A.day}. {m[A.month - 1]} {A.year}"
        return f"{A.day}. {m[A.month - 1]} – {B.day}. {m[B.month - 1]} {B.year}"
    if (A.year, A.month) == (B.year, B.month): return f"{m[A.month - 1]} {A.day}–{B.day}, {A.year}" if A != B else f"{m[A.month - 1]} {A.day}, {A.year}"
    return f"{m[A.month - 1]} {A.day} – {m[B.month - 1]} {B.day}, {B.year}"


def kpis(D):
    """Liste der Kennzahlen [{key, value, src, period(en/de)}] - nur vorhandene Werte. Grundlage fuer Titelseite und latest.json."""
    out = []
    add = lambda key, value, src, en="", de=None: out.append({"key": key, "value": int(value), "src": src, "period": {"en": en, "de": en if de is None else de}})
    hs, yt, g, b, li, pr = (D.get(k) or {} for k in ("heysummit", "youtube", "gsc", "bing", "linkedin", "press"))
    ev = hs.get("events") or []
    if ev:
        d = hs.get("as_of", "")
        regs = [e["registrations"] for e in ev if "registrations" in e]
        if regs: add("reg_total", sum(regs), "hs", TXT["en"]["n_ed"].format(n=len(regs), d=d), TXT["de"]["n_ed"].format(n=len(regs), d=d))
        nx = next((e for e in ev if e["id"] == NEXT_EVENT and "registrations" in e), None)
        if nx: add("reg_next", nx["registrations"], "hs", f'{nx["title"]} · ' + TXT["en"]["asof_d"].format(d=nx["as_of"]), f'{nx["title"]} · ' + TXT["de"]["asof_d"].format(d=nx["as_of"]))
        for k in ("talks", "speakers"):
            vals = [e[k] for e in ev if k in e]
            if vals: add(k, sum(vals), "hs", TXT["en"]["n_ed"].format(n=len(vals), d=d), TXT["de"]["n_ed"].format(n=len(vals), d=d))
    s, r = yt.get("streams") or {}, yt.get("recaps") or {}
    if "views" in s: add("yt_stream_views", s["views"], "yt", s["period"] + " · " + TXT["en"]["n_streams"].format(n=s["videos"]), s["period"] + " · " + TXT["de"]["n_streams"].format(n=s["videos"]))
    if "peak_max" in s: add("yt_peak", s["peak_max"], "yt", s["period"])
    if "views" in r: add("yt_recap_views", r["views"], "yt", r["period"] + " · " + TXT["en"]["n_videos"].format(n=r["videos"]), r["period"] + " · " + TXT["de"]["n_videos"].format(n=r["videos"]))
    if "minutes" in s or "minutes" in r:
        add("yt_hours", round((s.get("minutes", 0) + r.get("minutes", 0)) / 60), "yt", " / ".join(x["period"] for x in (s, r) if "minutes" in x))
    lv = [x["views"] for x in li.get("streams") or [] if "views" in x]
    if lv:
        ds = sorted(x["date"] for x in li["streams"] if "views" in x)
        add("li_views", sum(lv), "li", f"{ds[0]}–{ds[-1]} · " + TXT["en"]["n_streams"].format(n=len(lv)), f"{ds[0]}–{ds[-1]} · " + TXT["de"]["n_streams"].format(n=len(lv)))
    pg = li.get("page") or {}
    if "page_followers" in pg: add("li_followers", pg["page_followers"], "li", TXT["en"]["asof_d"].format(d=li.get("retrieved") or "") if li.get("retrieved") else "",
                                   TXT["de"]["asof_d"].format(d=li.get("retrieved") or "") if li.get("retrieved") else "")
    if "impressions_30d" in pg: add("li_imp", pg["impressions_30d"], "li", li.get("page_period", ""))
    if g.get("impressions"):
        add("g_imp", g["impressions"], "gsc", g["period"]); add("g_clicks", g["clicks"], "gsc", g["period"])
    if b.get("impressions28"):
        add("b_imp", b["impressions28"], "bing", TXT["en"]["d28"], TXT["de"]["d28"]); add("b_clicks", b["clicks28"], "bing", TXT["en"]["d28"], TXT["de"]["d28"])
    if pr.get("mentions"): add("press", pr["mentions"], "press", TXT["en"]["asof_d"].format(d=str(TODAY)), TXT["de"]["asof_d"].format(d=str(TODAY)))
    return out


def public_summary(D):
    """latest.json: nur Summen und Kennzahlen (keine Logos fremder Hosts fuer Webseiten, keine Personendaten)."""
    K = kpis(D)
    for k in K: k["label"] = {l: TXT[l]["k"][k["key"]] for l in TXT}; k["source"] = {l: TXT[l]["s"][k["src"]] for l in TXT}
    hs = D.get("heysummit") or {}
    ev = [{x: e.get(x) for x in ("id", "title", "url", "first", "last", "talks", "speakers", "registrations", "sponsors") if e.get(x) is not None} for e in hs.get("events") or []]
    return {"generated": D["generated"], "brand": "m365con", "kpis": K, "events": ev, "partners": [p["name"] for p in hs.get("partners") or []],
            "sections": {k: bool(D.get(k)) for k in ("heysummit", "youtube", "gsc", "bing", "linkedin", "press", "yt_search")}}


# ---------------------------------------------------------------- PDF
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
        except Exception as e:   # noqa: BLE001
            log("Schrift fehlt:", name, type(e).__name__)
    return {k: ok.get(k, FONT_FB[k]) for k in FONT_URLS}


def fetch_image(url, limit=3 * 1024 * 1024):
    """Logo zur Bauzeit nur in den Speicher laden (nicht ablegen, nicht verlinken). None, wenn nicht ladbar."""
    if not url or not url.startswith("https://"): return None
    try:
        from PIL import Image
        rq = urllib.request.Request(url, headers={"User-Agent": "m365fm-mediakit/1.0"})
        with urllib.request.urlopen(rq, timeout=20) as r:
            data = r.read(limit + 1)
        if len(data) > limit: return None
        im = Image.open(io.BytesIO(data)); im.load()
        return im.convert("RGBA")
    except Exception:   # noqa: BLE001
        return None


def build_pdf(path, lang, D, F, images=None):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.colors import HexColor, Color
    from reportlab.pdfgen import canvas
    from reportlab.lib.utils import simpleSplit, ImageReader
    t, T = TXT[lang], {k: HexColor(v) for k, v in THEME.items()}
    images = images or {}
    R, SB, BD = F["Poppins"], F["Poppins-SemiBold"], F["Poppins-Bold"]
    fmt = lambda n: MK.fmt(lang, n)
    pct = lambda v: (f"{v:.1f} %".replace(".", ",") if lang == "de" else f"{v:.1f}%")
    hs, yt, g, b, li, pr = (D.get(k) or {} for k in ("heysummit", "youtube", "gsc", "bing", "linkedin", "press"))
    ys = D.get("yt_search") or {}
    W, H = A4; M = 46; CW = W - 2 * M
    cv = canvas.Canvas(str(path), pagesize=A4)
    cv.setTitle(f"M365Con – {t['title']}"); cv.setAuthor("M365.FM · M365Con"); cv.setSubject(t["tagline"])
    st = {"page": 0}

    def para(x, y, text, font, size, color, width=CW, lead=None):
        lead = lead or size * 1.45
        cv.setFont(font, size); cv.setFillColor(color)
        for line in simpleSplit(text, font, size, width):
            cv.drawString(x, y, line); y -= lead
        return y

    def wordmark(x, y, size, on_dark):
        cv.setFont(BD, size); cv.setFillColor(T["white"] if on_dark else T["ink"]); cv.drawString(x, y, "M365")
        cv.setFillColor(T["accent2"] if on_dark else T["accent"]); cv.drawString(x + cv.stringWidth("M365", BD, size), y, "Con")

    def logo(x, y, h, on_dark):   # Event-Logo von HeySummit (zur Bauzeit geladen), sonst Wortmarke
        im = images.get("logo_white" if on_dark else "logo")
        if im is not None:
            w = h * im.width / max(im.height, 1)
            if w > 220: w, h = 220, 220 * im.height / max(im.width, 1)
            cv.drawImage(ImageReader(im), x, y, w, h, mask="auto"); return
        wordmark(x, y + h * .2, h * .62, on_dark)

    def page(dark=False):
        if st["page"]: cv.showPage()
        st["page"] += 1
        cv.setFillColor(T["night"] if dark else T["paper"]); cv.rect(0, 0, W, H, stroke=0, fill=1)
        if not dark:
            cv.setFillColor(T["accent"]); cv.rect(0, H - 6, W, 6, stroke=0, fill=1)
            wordmark(M, H - M + 2, 15, False)
            cv.setFillColor(T["muted"]); cv.setFont(R, 8.5); cv.drawRightString(W - M, H - M + 4, f"{t['title']} · {t['asof']} {D['generated']}")
            cv.setStrokeColor(T["line"]); cv.setLineWidth(1); cv.line(M, H - M - 8, W - M, H - M - 8)
        cv.setFillColor(T["accent2"] if dark else T["muted"]); cv.setFont(R, 7.5)
        cv.drawString(M, 26, "M365Con · m365con.net · www.m365.fm"); cv.drawRightString(W - M, 26, f"{t['page']} {st['page']}")
        return H - M - 36

    def need(y, h):
        return y if y - h > 60 else page()

    def h2(y, title, lead=None):
        y = need(y, 90)
        cv.setFillColor(T["ink"]); cv.setFont(BD, 22); cv.drawString(M, y - 16, title); y -= 28
        cv.setFillColor(T["accent"]); cv.rect(M, y + 4, 36, 3, stroke=0, fill=1); y -= 8
        if lead: y = para(M, y, lead, R, 9.6, T["muted"], lead=13.5) - 2
        return y - 8

    def kicker(y, text, x=M, w=CW):
        cv.setFont(SB, 8.6); cv.setFillColor(T["accent"]); cv.drawString(x, y, text.upper())
        tw = cv.stringWidth(text.upper(), SB, 8.6)
        if tw + 8 < w: cv.setStrokeColor(T["line"]); cv.setLineWidth(.6); cv.line(x + tw + 8, y + 3, x + w, y + 3)
        return y - 16

    def tiles(y, rows, cols=3, dark=False, ch=72):   # 72 pt: Platz fuer 2 Zeilen Bezeichnung + 2 Zeilen Quelle
        gap = 10; cw = (CW - gap * (cols - 1)) / cols
        for i, (label, val, src, per) in enumerate(rows):
            cx = M + (i % cols) * (cw + gap); cy = y - (i // cols) * (ch + gap) - ch
            cv.setFillColor(T["night2"] if dark else T["white"]); cv.setStrokeColor(T["night2"] if dark else T["line"]); cv.setLineWidth(.6)
            cv.roundRect(cx, cy, cw, ch, 6, stroke=1, fill=1)
            cv.setFillColor(T["hot"] if dark else T["accent"]); cv.setFont(BD, 19); cv.drawString(cx + 10, cy + ch - 27, val)
            cv.setFillColor(T["white"] if dark else T["ink"]); cv.setFont(SB, 7.8); ly = cy + ch - 40
            for line in simpleSplit(label, SB, 7.8, cw - 20)[:2]: cv.drawString(cx + 10, ly, line); ly -= 9.5
            cv.setFillColor(T["accent2"] if dark else T["muted"]); cv.setFont(R, 6.4)
            for line in simpleSplit(f"{src}{' · ' + per if per else ''}", R, 6.4, cw - 20)[:2]: cv.drawString(cx + 10, ly, line); ly -= 8
        return y - ((len(rows) + cols - 1) // cols) * (ch + gap)

    def hbars(y, items, x=M, w=CW, valfmt=None, label_w=110, bh=10, gap=5):
        if not items: return y
        mx = max(v for _, v in items) or 1
        for lab, v in items:
            cv.setFillColor(T["ink"]); cv.setFont(R, 8.2)
            cv.drawString(x, y - bh + 2, simpleSplit(str(lab), R, 8.2, label_w - 6)[0] if lab else "")
            bw = (w - label_w - 50) * (v / mx)
            cv.setFillColor(T["accent"]); cv.roundRect(x + label_w, y - bh, max(bw, 1.5), bh, 2, stroke=0, fill=1)
            cv.setFillColor(T["muted"]); cv.setFont(SB, 7.8); cv.drawString(x + label_w + bw + 5, y - bh + 2, valfmt(v) if valfmt else fmt(v))
            y -= bh + gap
        return y - 4

    def vbars(y, items, h=90, lab_every=1, show_vals=True):
        if not items: return y
        mx = max(v for _, v in items) or 1; n = len(items); gp = 6 if n < 8 else 3
        bw = (CW - gp * (n - 1)) / n; base = y - h
        cv.setStrokeColor(T["line"]); cv.setLineWidth(.6); cv.line(M, base, M + CW, base)
        for i, (lab, v) in enumerate(items):
            bh = (h - 16) * v / mx; bx = M + i * (bw + gp)
            cv.setFillColor(T["accent"]); cv.rect(bx, base, bw, max(bh, .5), stroke=0, fill=1)
            if show_vals: cv.setFillColor(T["ink"]); cv.setFont(SB, 7.4); cv.drawCentredString(bx + bw / 2, base + bh + 3, fmt(v))
            if i % lab_every == 0:
                cv.setFillColor(T["muted"]); cv.setFont(R, 7)
                cv.drawCentredString(bx + bw / 2, base - 10, simpleSplit(str(lab), R, 7, bw + gp)[0] if lab else "")
        return base - 22

    def table(y, head, rows, cols):
        cv.setFont(SB, 7.4); cv.setFillColor(T["muted"]); cx = M
        for i, (hd, cw) in enumerate(zip(head, cols)):
            (cv.drawString(cx, y, hd.upper()) if i == 0 else cv.drawRightString(cx + cw, y, hd.upper())); cx += cw
        y -= 6; cv.setStrokeColor(T["line"]); cv.setLineWidth(.6); cv.line(M, y, M + sum(cols), y); y -= 12
        for r in rows:
            y = need(y, 20); cx = M
            for i, (val, cw) in enumerate(zip(r, cols)):
                cv.setFillColor(T["ink"]); cv.setFont(R if i == 0 else SB, 8.4)
                if i == 0: cv.drawString(cx, y, simpleSplit(str(val), R, 8.4, cw - 8)[0] if val else "")
                else: cv.drawRightString(cx + cw, y, str(val))
                cx += cw
            y -= 5; cv.setStrokeColor(T["line"]); cv.setLineWidth(.4); cv.line(M, y, M + sum(cols), y); y -= 11
        return y - 4

    def bullets(y, items, color=None, size=9.6):
        for it in items:
            y = need(y, 30)
            cv.setFillColor(T["accent"]); cv.circle(M + 3, y + 2.5, 2.6, stroke=0, fill=1)
            y = para(M + 14, y, it, R, size, color or T["ink"], CW - 14, size * 1.42) - 5
        return y

    K = kpis(D)
    tile_rows = [(t["k"][k["key"]], fmt(k["value"]), t["s"][k["src"]], k["period"][lang]) for k in K]

    # --- Seite 1: Titel (dunkel) ---
    y = page(dark=True)
    logo(M, y - 46, 48, True); y -= 92
    cv.setFillColor(T["accent2"]); cv.setFont(SB, 10); cv.drawString(M, y, t["title"].upper()); y -= 40
    cv.setFillColor(T["white"]); cv.setFont(BD, 34)
    for line in simpleSplit(t["tagline"], BD, 34, CW)[:2]: cv.drawString(M, y, line); y -= 40
    ev = hs.get("events") or []
    nx = next((e for e in ev if e["id"] == NEXT_EVENT), None)
    if nx and nx.get("first"):
        y = para(M, y - 2, t["next"].format(title=nx["title"].split(" - ")[0], dates=dates(lang, nx["first"], nx["last"]), url=(nx.get("url") or "m365con.net").replace("https://", "")),
                 SB, 11, T["hot"]) - 6
    y = para(M, y - 4, t["intro"], R, 10.2, T["white"], lead=15) - 14
    if tile_rows:
        cv.setFillColor(T["accent2"]); cv.setFont(SB, 8.6); cv.drawString(M, y, t["glance"].upper()); y -= 14
        shown = tile_rows[:12]
        y = tiles(y, shown, dark=True, ch=72) - 6
        para(M, max(y, 70), t["note"], R, 7.2, T["accent2"], lead=10)
        rest = tile_rows[12:]
    else:
        rest = []

    # --- Ausgaben und Programm ---
    if ev:
        y = page(); y = h2(y, t["ed_h"], t["ed_lead"])
        if rest: y = kicker(y, t["glance"]); y = tiles(y, rest) - 10
        rows = [(e["title"], dates(lang, e["first"], e["last"]) if e.get("first") else "", *(fmt(e[k]) if k in e else "–" for k in ("talks", "speakers", "registrations", "sponsors"))) for e in ev]
        y = table(y, t["ed_cols"], rows, [CW - 330, 120, 50, 55, 65, 40])
        regs = [(e["title"].split(" - ")[0], e["registrations"]) for e in reversed(ev) if "registrations" in e]
        if regs:
            y = need(y, 150); y = kicker(y, t["ed_reg"].format(d=hs.get("as_of", ""))); y = vbars(y, regs, h=100)
            y = para(M, y, t["ed_note"], R, 7.6, T["muted"], lead=10.5) - 8
        if nx and (nx.get("tags") or nx.get("formats")):
            for key, items in (("topics", nx.get("tags")), ("formats", nx.get("formats"))):
                if not items: continue
                y = need(y, 60); y = kicker(y, t[key]); x = M
                for tag in items:   # Chips
                    w = cv.stringWidth(tag, SB, 8.4) + 18
                    if x + w > M + CW: x = M; y -= 22
                    cv.setFillColor(T["tint"]); cv.setStrokeColor(T["line"]); cv.roundRect(x, y - 6, w, 17, 8, stroke=1, fill=1)
                    cv.setFillColor(T["ink"]); cv.setFont(SB, 8.4); cv.drawString(x + 9, y, tag); x += w + 6
                y -= 30

    # --- Livestreams und Recaps (YouTube + LinkedIn) ---
    if yt or li or ys:
        y = page(); y = h2(y, t["vid_h"], t["vid_lead"])
        for gk, head, topk in (("streams", t["streams"], t["top_streams"]), ("recaps", t["recaps"], t["top_recaps"])):
            G = yt.get(gk)
            if not G: continue
            y = need(y, 170); y = kicker(y, f"{head} · {G['period']}")
            rows = [(t["videos"], fmt(G["videos"]), t["s"]["yt"], ""), (t["views"], fmt(G["views"]), t["s"]["yt"], ""), (t["hours"], fmt(round(G["minutes"] / 60)), t["s"]["yt"], "")]
            if "live_views" in G: rows.append((t["live_views"], fmt(G["live_views"]), t["s"]["yt"], ""))
            if "ondemand_views" in G: rows.append((t["od_views"], fmt(G["ondemand_views"]), t["s"]["yt"], ""))
            if "peak_max" in G: rows.append((t["peak"], fmt(G["peak_max"]), t["s"]["yt"], t["n_streams"].format(n=G["streams_measured"]) if lang == "en" else TXT["de"]["n_streams"].format(n=G["streams_measured"])))
            if "avg_concurrent" in G: rows.append((t["avgc"], fmt(G["avg_concurrent"]), t["s"]["yt"], ""))
            y = tiles(y, rows, cols=4) - 14
            if G.get("top"):
                y = need(y, 60); y = kicker(y, topk)
                if gk == "streams" and any(len(r) > 2 for r in G["top"]):
                    y = table(y, (t["col_video"], t["views"], t["col_avg"], t["col_peak"]), [(r[0], fmt(r[1]), fmt(r[2]) if len(r) > 2 else "–", fmt(r[3]) if len(r) > 3 else "–") for r in G["top"]], [CW - 180, 60, 60, 60])
                else:
                    y = table(y, (t["col_video"], t["views"]), [(r[0], fmt(r[1])) for r in G["top"]], [CW - 80, 80])
            if G.get("countries"):
                y = need(y, 110); y = kicker(y, t["cty"])
                y = hbars(y, [(MK.nm(MK.COUNTRY, k, lang), v * 100 / (G["views"] or 1)) for k, v in G["countries"]], valfmt=pct, label_w=120) - 12
        if ys.get("impressions"):   # Search-Console-Property des Kanals (nur bei status ok)
            y = need(y, 90); y = kicker(y, t["ys_h"])
            y = tiles(y, [(t["ys_imp"], fmt(ys["impressions"]), t["ys_src"], ys["period"]), (t["ys_clicks"], fmt(ys["clicks"]), t["ys_src"], ys["period"])], cols=4) - 14
        if li:
            y = need(y, 160); y = kicker(y, t["li_h"]); y = para(M, y, t["li_lead"], R, 8.4, T["muted"], lead=11.5) - 4
            pg = li.get("page") or {}
            rows = []
            if "page_followers" in pg: rows.append((t["li_followers"], fmt(pg["page_followers"]), t["s"]["li"], t["asof_d"].format(d=li.get("retrieved")) if li.get("retrieved") else ""))
            for k, lab in (("impressions_30d", "li_imp"), ("reactions_30d", "li_react"), ("comments_30d", "li_comm"), ("reposts_30d", "li_rep")):
                if k in pg: rows.append((t[lab], fmt(pg[k]), t["s"]["li"], li.get("page_period", "")))
            if rows: y = tiles(y, rows, cols=min(4, max(2, len(rows)))) - 14
            if li.get("streams"):
                y = need(y, 60); y = kicker(y, t["li_streams"])
                y = table(y, t["li_cols"], [(s["title"], s["date"], *(fmt(s[k]) if k in s else "–" for k in ("views", "impressions", "reactions"))) for s in li["streams"][:12]],
                          [CW - 260, 70, 60, 70, 60])

    # --- Website und Suche ---
    if g or b or pr:
        y = page(); y = h2(y, t["web_h"], t["web_lead"])
        rows = []
        if g: rows += [(t["k"]["g_imp"], fmt(g["impressions"]), t["s"]["gsc"], g["period"]), (t["k"]["g_clicks"], fmt(g["clicks"]), t["s"]["gsc"], g["period"])]
        if b.get("impressions28"): rows += [(t["k"]["b_imp"], fmt(b["impressions28"]), t["s"]["bing"], t["d28"]), (t["k"]["b_clicks"], fmt(b["clicks28"]), t["s"]["bing"], t["d28"])]
        if rows: y = tiles(y, rows, cols=4) - 14
        wl = lambda w: w[5:10].replace("-", "/") if lang == "en" else w[8:10] + "." + w[5:7]
        for src, key_w, key_q in ((g, "g_week", "g_q"), (b, "b_week", "b_q")):
            if src.get("weekly"):
                y = need(y, 130); y = kicker(y, t[key_w]); y = vbars(y, [(wl(w[0]), w[2]) for w in src["weekly"]], h=80, lab_every=2, show_vals=False) - 2
            if src.get("queries"):
                y = need(y, 80); y = kicker(y, t[key_q])
                y = table(y, (t["q"], t["imps"], t["clicks"]), [(q[0], fmt(q[2]), fmt(q[1])) for q in sorted(src["queries"], key=lambda q: -q[2])[:8]], [CW - 160, 80, 80])
        if pr.get("mentions"):
            y = need(y, 40); y = para(M, y, t["press_t"].format(n=pr["mentions"], d=pr.get("latest", "")), R, 9, T["ink"]) - 4
            y = para(M, y, f'{t["s"]["press"]} · www.m365.fm/press/', R, 7.4, T["muted"]) - 6

    # --- Partner, Zielgruppe, Sponsoring auf Anfrage ---
    y = page(); y = h2(y, t["aud_h"]); y = para(M, y, t["aud_t"], R, 10, T["ink"], lead=14.5) - 12
    y = kicker(y, t["why_h"]); y = bullets(y, t["whys"]) - 6
    parts = hs.get("partners") or []
    if parts:
        y = need(y, 120); y = kicker(y, t["partners_h"]); y = para(M, y, t["partners_lead"], R, 8.4, T["muted"]) - 4
        cols, gap, bh = 4, 10, 46; bw = (CW - gap * (cols - 1)) / cols
        for i, p in enumerate(parts[:16]):
            if i % cols == 0 and i: y -= bh + gap
            if i % cols == 0: y = need(y, bh + 10)
            x = M + (i % cols) * (bw + gap)
            cv.setFillColor(T["white"]); cv.setStrokeColor(T["line"]); cv.roundRect(x, y - bh, bw, bh, 5, stroke=1, fill=1)
            im = images.get("partner:" + p["name"])
            if im is not None:
                h_ = bh - 14; w_ = h_ * im.width / max(im.height, 1)
                if w_ > bw - 14: w_, h_ = bw - 14, (bw - 14) * im.height / max(im.width, 1)
                cv.drawImage(ImageReader(im), x + (bw - w_) / 2, y - bh + (bh - h_) / 2, w_, h_, mask="auto")
            else:
                cv.setFillColor(T["ink"]); cv.setFont(SB, 8.6)
                lines = simpleSplit(p["name"], SB, 8.6, bw - 12)[:2]
                for j, line in enumerate(lines): cv.drawCentredString(x + bw / 2, y - bh / 2 + 2 - j * 10 + (len(lines) - 1) * 5, line)
            if p.get("url", "").startswith("https://"): cv.linkURL(p["url"], (x, y - bh, x + bw, y), relative=0)
        y -= bh + 18
    # CTA-Kasten mit QR-Code
    box_h = 128; y = need(y, box_h + 30)
    cv.setFillColor(T["night"]); cv.roundRect(M, y - box_h, CW, box_h, 8, stroke=0, fill=1)
    cv.setFillColor(T["hot"]); cv.setFont(BD, 22); cv.drawString(M + 18, y - 36, t["cta_h"])
    yy = para(M + 18, y - 54, t["cta_t"], R, 9.4, T["white"], CW - 150, 13)
    cv.setFillColor(T["accent2"]); cv.setFont(SB, 11); cv.drawString(M + 18, yy - 6, t["contact"])
    url = f"https://www.m365.fm/{'de/' if lang == 'de' else ''}m365con/sponsor/"
    cv.setFillColor(T["white"]); cv.setFont(R, 8.6); cv.drawString(M + 18, y - box_h + 14, url.replace("https://", ""))
    cv.linkURL("mailto:" + MAIL, (M, y - box_h, W - M - 110, y), relative=0)
    try:
        from reportlab.graphics.barcode.qr import QrCodeWidget
        from reportlab.graphics.shapes import Drawing
        from reportlab.graphics import renderPDF
        qw = QrCodeWidget(url); bx = qw.getBounds(); s = 86
        dr = Drawing(s, s, transform=[s / (bx[2] - bx[0]), 0, 0, s / (bx[3] - bx[1]), 0, 0]); dr.add(qw)
        cv.setFillColor(T["white"]); cv.rect(W - M - s - 14, y - box_h + 18, s + 4, s + 4, stroke=0, fill=1)
        renderPDF.draw(dr, cv, W - M - s - 12, y - box_h + 20)
        cv.linkURL(url, (W - M - s - 14, y - box_h + 18, W - M - 10, y - box_h + 22 + s), relative=0)
    except Exception as e:   # noqa: BLE001
        log("QR-Code ausgelassen:", type(e).__name__)
    y -= box_h + 12
    para(M, y, t["rules"] + " " + t["note"], R, 7.4, T["muted"], lead=10)
    cv.showPage(); cv.save()


def collect():
    return {"generated": str(TODAY), "heysummit": heysummit(), "youtube": youtube_con(), "gsc": gsc_con(), "bing": MK.bing("https://m365con.net/"),
            "linkedin": linkedin(), "press": press(), "yt_search": MK.gsc_site(MK.YT_GSC_SITE)}


def load_images(D):
    hs = D.get("heysummit") or {}
    nx = next((e for e in hs.get("events") or [] if e["id"] == NEXT_EVENT), None) or ((hs.get("events") or [None])[0])
    imgs = {}
    if nx:
        for k in ("logo", "logo_white"):
            im = fetch_image(nx.get(k))
            if im is not None: imgs[k] = im
    for p in (hs.get("partners") or [])[:16]:
        im = fetch_image(p.get("logo"))
        if im is not None: imgs["partner:" + p["name"]] = im
    log("Logos geladen:", len(imgs))
    return imgs


def main(out=None, fonts_dir=None, D=None):
    if out is None:
        ap = argparse.ArgumentParser(); ap.add_argument("--out", default="out/mediakit-con"); ap.add_argument("--fonts", default=".cache/fonts")
        a = ap.parse_args(); out, fonts_dir = Path(a.out), Path(a.fonts)
    out.mkdir(parents=True, exist_ok=True)
    D = D or collect()
    K = kpis(D)
    if not K:
        log("keine Kennzahlen verfuegbar - kein PDF (Upload entfaellt, das letzte Deck in R2 bleibt)"); return 0
    F, imgs = fonts(fonts_dir or Path(".cache/fonts")), load_images(D)
    for lang in ("en", "de"):
        p = out / f"m365con-sponsor-deck-{lang}.pdf"; build_pdf(p, lang, D, F, imgs)
        log("PDF:", p, p.stat().st_size // 1024, "KB,", len(K), "Kennzahlen")
    (out / "latest.json").write_text(json.dumps(public_summary(D), ensure_ascii=False, indent=1), "utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
