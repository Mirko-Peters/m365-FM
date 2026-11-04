#!/usr/bin/env python3
"""Mediadaten (Media Kit) von M365.FM als PDF erzeugen - EN und DE - aus Live-Daten.

Quellen (jeweils nur, wenn verfuegbar; fehlende Werte werden weggelassen, nie geschaetzt):
  - YouTube Analytics + Data API (Kanal m365 Show): Aufrufe, Wiedergabezeit, neue Abos (28 Tage), Abonnenten gesamt
  - Cloudflare GraphQL (Zone m365.fm): Besucher pro Tag und Seitenaufrufe (30 Tage, Rand-Statistik, ungefiltert)
  - Bing Webmaster API: Klicks und Impressionen der Bing-Suche (28 Tage)
  - data/top.json: Spreaker-Downloads der Sprachfassungen (7 Tage)
  - data/stats/ai_performance.json: KI-Zitate (Bing AI Performance, Export)
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
    out = {}
    end, start = TODAY, TODAY - dt.timedelta(days=28)
    st, a = http("https://youtubeanalytics.googleapis.com/v2/reports?" + urllib.parse.urlencode({"ids": "channel==MINE", "startDate": str(start), "endDate": str(end), "metrics": "views,estimatedMinutesWatched,subscribersGained"}), headers=H)
    if st == 200 and a.get("rows"):
        v, m, s = a["rows"][0][:3]
        out.update(views28=int(v), minutes28=int(m), subs_gained28=int(s), period28=f"{start}–{end}")
    st, c = http("https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true", headers=H)
    if st == 200 and c.get("items"):
        s = c["items"][0].get("statistics") or {}
        if not s.get("hiddenSubscriberCount") and s.get("subscriberCount"): out["subscribers"] = int(s["subscriberCount"])
        if s.get("videoCount"): out["videos"] = int(s["videoCount"])
        if s.get("viewCount"): out["views_total"] = int(s["viewCount"])
    print("YouTube:", {k: v for k, v in out.items() if k != "period28"})
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
    q = """query($z:String!,$s:Date!,$u:Date!){viewer{zones(filter:{zoneTag:$z}){httpRequests1dGroups(limit:31,filter:{date_geq:$s,date_leq:$u}){sum{pageViews} uniq{uniques}}}}}"""
    st, d = http("https://api.cloudflare.com/client/v4/graphql", json.dumps({"query": q, "variables": {"z": zone, "s": str(since), "u": str(until)}}).encode(), H)
    rows = (((d.get("data") or {}).get("viewer") or {}).get("zones") or [{}])[0].get("httpRequests1dGroups") or [] if st == 200 and not d.get("errors") else []
    if not rows: print("Cloudflare: keine Daten", st, (d.get("errors") or "")); return {}
    pv = sum((r.get("sum") or {}).get("pageViews") or 0 for r in rows)
    uq = sum((r.get("uniq") or {}).get("uniques") or 0 for r in rows)
    out = {"pageviews30": int(pv), "visitors_day": int(round(uq / len(rows))), "period30": f"{since}–{until}"}
    print("Cloudflare:", out)
    return out


def bing():
    key = os.environ.get("BING_WEBMASTER_API_KEY", "").strip()
    if not key: return {}
    st, d = http("https://ssl.bing.com/webmaster/api.svc/json/GetRankAndTrafficStats?" + urllib.parse.urlencode({"siteUrl": "https://m365.fm/", "apikey": key}))
    rows = d.get("d") or [] if st == 200 else []
    since = TODAY - dt.timedelta(days=28)
    clicks = imps = 0; n = 0
    for r in rows:
        m = re.search(r"\d+", str(r.get("Date", "")))
        if not m: continue
        day = dt.datetime.utcfromtimestamp(int(m.group()) / 1000).date()
        if day >= since:
            clicks += int(r.get("Clicks") or 0); imps += int(r.get("Impressions") or 0); n += 1
    out = {"clicks28": clicks, "impressions28": imps} if n else {}
    print("Bing:", out or ("keine Daten", st))
    return out


def local():
    out = {}
    try:
        sp = json.loads((ROOT / "data" / "top.json").read_text("utf-8")).get("spreaker") or {}
        vals = sp.get("downloads") or {}
        if sp.get("complete") is True and vals:
            out["spreaker7"] = int(sum(v for v in vals.values() if isinstance(v, (int, float))))
            out["spreaker_period"] = f'{sp.get("from", "")}–{sp.get("to", "")}'
    except Exception: pass
    try:
        a = json.loads((ROOT / "data" / "stats" / "ai_performance.json").read_text("utf-8")).get("bing_ai") or {}
        if a.get("status") == "ok" and isinstance(a.get("citations"), (int, float)):
            out["ai_citations"] = int(a["citations"]); out["ai_period"] = f'{(a.get("period") or {}).get("from", "")}–{(a.get("period") or {}).get("to", "")}'
    except Exception: pass
    try:
        from site_landing import LANGS_ALL
        out["site_languages"] = len(LANGS_ALL)
    except Exception: pass
    return out


# ---------- PDF ----------
FONT_URLS = {"Barlow": "https://github.com/google/fonts/raw/main/ofl/barlow/Barlow-Regular.ttf",
             "Barlow-SemiBold": "https://github.com/google/fonts/raw/main/ofl/barlow/Barlow-SemiBold.ttf",
             "Barlow-Bold": "https://github.com/google/fonts/raw/main/ofl/barlow/Barlow-Bold.ttf",
             "BarlowCondensed-SemiBold": "https://github.com/google/fonts/raw/main/ofl/barlowcondensed/BarlowCondensed-SemiBold.ttf"}


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


TXT = {
    "en": dict(
        title="Media kit", sub="Microsoft 365 podcast, video and knowledge platform", asof="Figures as of",
        intro="M365.FM explains Microsoft 365, Copilot, Azure, Power Platform and security for IT professionals, architects and decision makers – as a podcast, as animated explainer videos on YouTube, as articles and as a community with expert profiles, events and a wiki, in {n} languages.",
        reach="Reach", src="Source", period="Period",
        k=dict(yt_views="YouTube views", yt_minutes="YouTube watch time (minutes)", yt_subs_new="New YouTube subscribers", yt_subs="YouTube subscribers",
               visitors="Website visitors per day (avg.)", pv="Website page views", sp="Podcast downloads (language editions)", ai="AI citations (Copilot and partners)",
               b_clicks="Bing search clicks", b_imp="Bing search impressions", langs="Site languages"),
        s=dict(yt="YouTube Analytics", cf="Cloudflare (edge statistics, before bot filtering)", sp="Spreaker", ai="Bing Webmaster Tools, AI Performance", bing="Bing Webmaster Tools", site="M365.FM"),
        d28="last 28 days", d30="last 30 days", d7="7 days", total="total",
        audience="Audience", audience_t="People who plan, run, secure and adopt Microsoft 365: IT administrators, solution architects, consultants at Microsoft partners, IT and digital-workplace decision makers, trainers and the Microsoft community (MVPs, MCTs, user groups).",
        channels="Channels and formats",
        ch=["Podcast M365.FM – weekly episodes plus daily “Simply Explained” episodes; language editions of the show",
            "YouTube channel m365 Show – animated explainer videos, Shorts and certification courses",
            "www.m365.fm – episode pages, articles, topic pages (entities), wiki, events, expert directory",
            "Community – member and expert profiles, Expert Connect for journalists and PR (in preparation), M365Con online conference",
            "LinkedIn – M365 Show company page and newsletter"],
        sponsor="Sponsorship and partnership", sponsor_t="Topic sponsorships, mentions in episodes and videos, partner pages and event partnerships. Sponsored content is always labelled; links to sponsors carry rel=\"sponsored\". Current packages and prices: www.m365.fm/sponsor/",
        contact="Contact", contact_t="Mirko Peters · mirko.peters@m365.fm · www.m365.fm",
        note="All figures come directly from the named sources for the stated period. Values that are not available are left out, not estimated.",
    ),
    "de": dict(
        title="Mediadaten", sub="Microsoft-365-Podcast, Video- und Wissensplattform", asof="Stand der Zahlen",
        intro="M365.FM erklärt Microsoft 365, Copilot, Azure, Power Platform und Security für IT-Fachleute, Architekten und Entscheider – als Podcast, als animierte Erklärvideos auf YouTube, als Artikel und als Community mit Expertenprofilen, Events und Wiki, in {n} Sprachen.",
        reach="Reichweite", src="Quelle", period="Zeitraum",
        k=dict(yt_views="YouTube-Aufrufe", yt_minutes="YouTube-Wiedergabezeit (Minuten)", yt_subs_new="Neue YouTube-Abonnenten", yt_subs="YouTube-Abonnenten",
               visitors="Website-Besucher pro Tag (Ø)", pv="Website-Seitenaufrufe", sp="Podcast-Downloads (Sprachfassungen)", ai="KI-Zitate (Copilot und Partner)",
               b_clicks="Bing-Suchklicks", b_imp="Bing-Suchimpressionen", langs="Sprachen der Website"),
        s=dict(yt="YouTube Analytics", cf="Cloudflare (Rand-Statistik, vor Bot-Filterung)", sp="Spreaker", ai="Bing Webmaster Tools, AI Performance", bing="Bing Webmaster Tools", site="M365.FM"),
        d28="letzte 28 Tage", d30="letzte 30 Tage", d7="7 Tage", total="gesamt",
        audience="Zielgruppe", audience_t="Menschen, die Microsoft 365 planen, betreiben, absichern und einführen: IT-Administratoren, Lösungsarchitekten, Berater bei Microsoft-Partnern, Entscheider für IT und Digital Workplace, Trainer sowie die Microsoft-Community (MVPs, MCTs, User Groups).",
        channels="Kanäle und Formate",
        ch=["Podcast M365.FM – Wochenfolgen und tägliche „Simply Explained“-Folgen; Sprachfassungen der Show",
            "YouTube-Kanal m365 Show – animierte Erklärvideos, Shorts und Zertifizierungskurse",
            "www.m365.fm – Folgenseiten, Artikel, Themenseiten (Entitäten), Wiki, Events, Expertenverzeichnis",
            "Community – Mitglieder- und Expertenprofile, Expert Connect für Journalisten und PR (in Vorbereitung), Online-Konferenz M365Con",
            "LinkedIn – Unternehmensseite M365 Show und Newsletter"],
        sponsor="Sponsoring und Partnerschaft", sponsor_t="Themen-Sponsorings, Erwähnungen in Folgen und Videos, Partnerseiten und Event-Partnerschaften. Gesponserte Inhalte sind immer gekennzeichnet; Links zu Sponsoren tragen rel=\"sponsored\". Aktuelle Pakete und Preise: www.m365.fm/sponsor/",
        contact="Kontakt", contact_t="Mirko Peters · mirko.peters@m365.fm · www.m365.fm",
        note="Alle Zahlen stammen direkt aus den genannten Quellen für den angegebenen Zeitraum. Nicht verfügbare Werte werden weggelassen, nicht geschätzt.",
    ),
}


def fmt(lang, n):
    s = f"{int(n):,}"
    return s.replace(",", ".") if lang == "de" else s


def rows_for(lang, D):
    t = TXT[lang]; k, s = t["k"], t["s"]; R = []
    y, c, b, l = D.get("youtube", {}), D.get("cloudflare", {}), D.get("bing", {}), D.get("local", {})
    if "views28" in y:
        R += [(k["yt_views"], fmt(lang, y["views28"]), s["yt"], t["d28"]), (k["yt_minutes"], fmt(lang, y["minutes28"]), s["yt"], t["d28"]),
              (k["yt_subs_new"], fmt(lang, y["subs_gained28"]), s["yt"], t["d28"])]
    if "subscribers" in y: R.append((k["yt_subs"], fmt(lang, y["subscribers"]), s["yt"], t["total"]))
    if "visitors_day" in c:
        # Besucher (unique IPs) der Rand-Statistik schwanken stark durch Bots - nur Seitenaufrufe, klar als ungefiltert gekennzeichnet
        R += [(k["pv"], fmt(lang, c["pageviews30"]), s["cf"], t["d30"])]
    if "spreaker7" in l: R.append((k["sp"], fmt(lang, l["spreaker7"]), s["sp"], l.get("spreaker_period") or t["d7"]))
    if "ai_citations" in l: R.append((k["ai"], fmt(lang, l["ai_citations"]), s["ai"], l.get("ai_period", "")))
    if b.get("impressions28"):
        R += [(k["b_imp"], fmt(lang, b["impressions28"]), s["bing"], t["d28"]), (k["b_clicks"], fmt(lang, b["clicks28"]), s["bing"], t["d28"])]
    if "site_languages" in l: R.append((k["langs"], str(l["site_languages"]), s["site"], ""))
    return R


def build_pdf(path, lang, D, F):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.colors import HexColor
    from reportlab.pdfgen import canvas
    from reportlab.lib.utils import simpleSplit
    t = TXT[lang]
    W, H = A4; M = 48
    INK, MUT, AC, BD, BG = HexColor("#17191c"), HexColor("#5d6470"), HexColor("#3b6391"), HexColor("#d9dbde"), HexColor("#f3f3f2")
    cv = canvas.Canvas(str(path), pagesize=A4)
    cv.setTitle(f"M365.FM {t['title']}"); cv.setAuthor("M365.FM"); cv.setSubject(t["sub"])

    def para(x, y, text, font, size, color=INK, width=W - 2 * M, lead=None):
        lead = lead or size * 1.4
        cv.setFont(font, size); cv.setFillColor(color)
        for line in simpleSplit(text, font, size, width):
            cv.drawString(x, y, line); y -= lead
        return y

    def header(y):
        cv.setFillColor(INK); cv.setFont(F["Barlow-Bold"], 16); cv.drawString(M, y, "M365")
        w = cv.stringWidth("M365", F["Barlow-Bold"], 16); cv.setFillColor(AC); cv.drawString(M + w, y, ".FM")
        cv.setFillColor(MUT); cv.setFont(F["Barlow"], 9); cv.drawRightString(W - M, y, f"{t['asof']} {D['generated']}")
        cv.setStrokeColor(INK); cv.setLineWidth(1.5); cv.line(M, y - 10, W - M, y - 10)
        return y - 40

    def kicker(y, text):
        cv.setFont(F["BarlowCondensed-SemiBold"], 11); cv.setFillColor(AC)
        cv.drawString(M, y, text.upper()); w = cv.stringWidth(text.upper(), F["BarlowCondensed-SemiBold"], 11)
        cv.setStrokeColor(BD); cv.setLineWidth(.6); cv.line(M + w + 10, y + 3, W - M, y + 3)
        return y - 20

    # Seite 1
    cv.setFillColor(BG); cv.rect(0, 0, W, H, stroke=0, fill=1)
    y = header(H - M)
    cv.setFillColor(INK); cv.setFont(F["BarlowCondensed-SemiBold"], 44); cv.drawString(M, y - 20, t["title"]); y -= 52
    y = para(M, y, t["sub"], F["Barlow-SemiBold"], 15, MUT) - 8
    y = para(M, y, t["intro"].format(n=D.get("local", {}).get("site_languages", 15)), F["Barlow"], 11.5, INK, lead=16.5) - 14
    y = kicker(y, t["reach"])
    rows = rows_for(lang, D)
    # Kennzahlen als Kacheln (3 Spalten)
    cols, gap = 3, 10; cw = (W - 2 * M - gap * (cols - 1)) / cols; ch = 74
    for i, (label, val, src, per) in enumerate(rows):
        cx = M + (i % cols) * (cw + gap); cy = y - (i // cols) * (ch + gap) - ch
        cv.setFillColor(HexColor("#ffffff")); cv.setStrokeColor(BD); cv.setLineWidth(.6); cv.rect(cx, cy, cw, ch, stroke=1, fill=1)
        cv.setFillColor(AC); cv.setFont(F["BarlowCondensed-SemiBold"], 24); cv.drawString(cx + 10, cy + ch - 30, val)
        cv.setFillColor(INK); cv.setFont(F["Barlow-SemiBold"], 8.6)
        ly = cy + ch - 44
        for line in simpleSplit(label, F["Barlow-SemiBold"], 8.6, cw - 20)[:2]: cv.drawString(cx + 10, ly, line); ly -= 10.5
        cv.setFillColor(MUT); cv.setFont(F["Barlow"], 7.2)
        for line in simpleSplit(f"{src}{' · ' + per if per else ''}", F["Barlow"], 7.2, cw - 20)[:2]: cv.drawString(cx + 10, ly, line); ly -= 9
    nrow = (len(rows) + cols - 1) // cols
    y = y - nrow * (ch + gap) - 10
    y = para(M, y, t["note"], F["Barlow"], 8, MUT, lead=11)
    cv.showPage()

    # Seite 2
    cv.setFillColor(BG); cv.rect(0, 0, W, H, stroke=0, fill=1)
    y = header(H - M)
    y = kicker(y, t["audience"]); y = para(M, y, t["audience_t"], F["Barlow"], 11.5, lead=16.5) - 16
    y = kicker(y, t["channels"])
    for c in t["ch"]:
        cv.setFillColor(AC); cv.rect(M, y - 1, 5, 5, stroke=0, fill=1)
        y = para(M + 14, y - 2, c, F["Barlow"], 11, width=W - 2 * M - 14, lead=15.5) - 6
    y -= 10
    y = kicker(y, t["sponsor"]); y = para(M, y, t["sponsor_t"], F["Barlow"], 11.5, lead=16.5) - 16
    y = kicker(y, t["contact"]); y = para(M, y, t["contact_t"], F["Barlow-SemiBold"], 12.5)
    cv.setFillColor(MUT); cv.setFont(F["Barlow"], 8); cv.drawString(M, M - 10, "© M365.FM · www.m365.fm")
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
    (out / "latest.json").write_text(json.dumps(D, ensure_ascii=False, indent=1), "utf-8")
    if not rows_for("en", D): sys.exit("Keine Kennzahlen verfuegbar - PDF nicht veroeffentlichen")


if __name__ == "__main__":
    main()
