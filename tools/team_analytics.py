#!/usr/bin/env python3
"""Tagesdaten fuer das KI-Team aus den APIs statt aus Chrome-Exporten (Mirko, 5.11.2026):
Google Search Console (Dienstkonto), YouTube Analytics + Data API (OAuth des Kanals m365 Show), Bing Webmaster API.

Ausgabe in einen Ordner (Standard reports/analytics/), je Quelle eine JSON-Datei plus summary.md:
  gsc.json      28 Tage: Summen und Vorperiode, Tagesreihe 90 Tage, Top-Suchanfragen, Top-Seiten, Laender, Geraete,
                Quick-Wins (Position 4–20 mit vielen Impressionen) und CTR-Luecken (Position <= 5, CTR unter Erwartung)
  youtube.json  28 Tage: Kanal-Summen und Vorperiode, Tagesreihe, Top-Videos (mit Titel), Traffic-Quellen, Laender, Suchbegriffe auf YouTube
  bing.json     Bing Webmaster: Klicks/Impressionen 28 Tage, Wochenreihe, Top-Suchanfragen, Top-Seiten
Fehlt ein Zugang, steht in der Datei {"status": "..."} und die anderen Quellen laufen weiter.
Umgebung: GSC_SERVICE_ACCOUNT_JSON, GSC_SITE (Standard sc-domain:m365.fm), YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN, BING_WEBMASTER_API_KEY.
Die Werte sind Arbeitsdaten fuer die Routinen (Workflow team-analytics.yml legt sie als Artefakt "team-analytics" ab), keine Seiteninhalte."""
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
TODAY = dt.date.today()
END = TODAY - dt.timedelta(days=3)   # GSC und YouTube liefern die letzten 2–3 Tage unvollstaendig
START = END - dt.timedelta(days=27)
PREV_END, PREV_START = START - dt.timedelta(days=1), START - dt.timedelta(days=28)
UA = {"User-Agent": "m365fm-team-analytics/1.0 (+https://www.m365.fm/)"}


def get_json(url, headers=None, timeout=60):
    req = urllib.request.Request(url, headers={**UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8") or "{}")


def post_form(url, form):
    req = urllib.request.Request(url, data=urllib.parse.urlencode(form).encode(), headers={**UA, "Content-Type": "application/x-www-form-urlencoded"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8") or "{}")


def err(e):
    if isinstance(e, urllib.error.HTTPError):
        try:   # Google-APIs nennen den Grund im JSON-Body (error.message); nur der Text, nie Header oder Token
            msg = (json.loads(e.read().decode("utf-8", "replace") or "{}").get("error") or {}).get("message") or ""
        except Exception:   # noqa: BLE001
            msg = ""
        return f"HTTP {e.code}" + (f": {msg[:160]}" if msg else "")
    return type(e).__name__


# ---------------------------------------------------------------- Google Search Console

def gsc(site=None):
    raw = os.environ.get("GSC_SERVICE_ACCOUNT_JSON", "").strip()
    if not raw:
        return {"status": "Secret GSC_SERVICE_ACCOUNT_JSON fehlt"}
    from tools import update_ai_stats as H
    try:
        sa = json.loads(raw)
        token = H.http_json(H.token_uri(sa), form={"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
                                                  "assertion": H.jwt_assertion(sa, int(time.time()))}).get("access_token")
        site = site or os.environ.get("GSC_SITE", "") or "sc-domain:m365.fm"
        url = H.GSC_API.format(site=urllib.parse.quote(site, safe=""))
        hd = {"Authorization": "Bearer " + token}

        def q(start, end, dims, limit=1000, **extra):
            body = {"startDate": start.isoformat(), "endDate": end.isoformat(), "dimensions": dims, "rowLimit": limit, **extra}
            return H.http_json(url, body=body, headers=hd).get("rows") or []

        def tot(rows):
            c = sum(r.get("clicks", 0) for r in rows); i = sum(r.get("impressions", 0) for r in rows)
            return {"clicks": int(c), "impressions": int(i), "ctr": round(c / i * 100, 2) if i else 0}

        cur, prev = q(START, END, ["date"]), q(PREV_START, PREV_END, ["date"])
        series = q(END - dt.timedelta(days=89), END, ["date"])
        row = lambda r, k: {k: r["keys"][0], "clicks": int(r.get("clicks", 0)), "impressions": int(r.get("impressions", 0)),
                            "ctr": round(r.get("ctr", 0) * 100, 2), "position": round(r.get("position", 0), 1)}
        queries = [row(r, "query") for r in q(START, END, ["query"], 1000)]
        try:   # YouTube-Creator-Properties kennen evtl. keine Seiten-Dimension
            pages = [row(r, "page") for r in q(START, END, ["page"], 500)]
        except Exception:   # noqa: BLE001
            pages = []
        quick = sorted([x for x in queries if 4 <= x["position"] <= 20 and x["impressions"] >= 100], key=lambda x: -x["impressions"])[:50]
        expect = {1: 25, 2: 15, 3: 10, 4: 7, 5: 5}
        ctr_gap = sorted([x for x in queries if x["position"] <= 5 and x["impressions"] >= 300 and x["ctr"] < expect.get(max(1, round(x["position"])), 5) / 2],
                         key=lambda x: -x["impressions"])[:30]
        return {"status": "ok", "site": site, "period": {"from": START.isoformat(), "to": END.isoformat()},
                "totals": tot(cur), "previous": {**tot(prev), "from": PREV_START.isoformat(), "to": PREV_END.isoformat()},
                "daily": [[r["keys"][0], int(r.get("clicks", 0)), int(r.get("impressions", 0))] for r in series],
                "queries": queries[:300], "pages": pages[:200],
                "countries": [row(r, "country") for r in q(START, END, ["country"], 30)],
                "devices": [row(r, "device") for r in q(START, END, ["device"], 5)],
                "quick_wins": quick, "ctr_gaps": ctr_gap}
    except Exception as e:   # noqa: BLE001 – eine Quelle darf die anderen nicht stoppen
        return {"status": f"Abruf fehlgeschlagen ({err(e)})"}


# ---------------------------------------------------------------- YouTube

def youtube():
    cid, sec, rt = (os.environ.get(k, "").strip() for k in ("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN"))
    if not (cid and sec and rt):
        return {"status": "YouTube-Zugang fehlt (YT_CLIENT_ID/YT_CLIENT_SECRET/data/yt_auth.enc)"}
    try:
        tok = post_form("https://oauth2.googleapis.com/token", {"grant_type": "refresh_token", "refresh_token": rt, "client_id": cid, "client_secret": sec})["access_token"]
        hd = {"Authorization": "Bearer " + tok}

        def rep(start, end, metrics, dims="", sort="", limit=0, filters=""):
            p = {"ids": "channel==MINE", "startDate": start.isoformat(), "endDate": end.isoformat(), "metrics": metrics}
            if dims: p["dimensions"] = dims
            if sort: p["sort"] = sort
            if limit: p["maxResults"] = limit
            if filters: p["filters"] = filters
            d = get_json("https://youtubeanalytics.googleapis.com/v2/reports?" + urllib.parse.urlencode(p), hd)
            cols = [c["name"] for c in d.get("columnHeaders") or []]
            return [dict(zip(cols, r)) for r in d.get("rows") or []]

        errors = {}

        def part(name, fn, empty):   # jede Teilabfrage fuer sich: ein Fehler kostet nur diesen Teil, nicht alle YouTube-Daten
            try:
                return fn()
            except Exception as e:   # noqa: BLE001
                errors[name] = err(e)
                print(f"youtube {name}: {errors[name]}")
                return empty

        m = "views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,likes,comments,shares"
        cur = part("totals", lambda: (rep(START, END, m) or [{}])[0], {})
        prev = part("previous", lambda: (rep(PREV_START, PREV_END, m) or [{}])[0], {})
        top = part("top_videos", lambda: rep(START, END, "views,estimatedMinutesWatched,averageViewPercentage,subscribersGained", "video", "-views", 50), [])
        ids = [r["video"] for r in top]

        def titles():
            out = {}
            for i in range(0, len(ids), 50):
                d = get_json("https://www.googleapis.com/youtube/v3/videos?" + urllib.parse.urlencode({"part": "snippet", "id": ",".join(ids[i:i + 50])}), hd)
                out.update({v["id"]: v["snippet"]["title"] for v in d.get("items") or []})
            return out
        names = part("titles", titles, {}) if ids else {}
        for r in top:
            r["title"] = names.get(r["video"], ""); r["url"] = "https://youtu.be/" + r["video"]
        data = {"period": {"from": START.isoformat(), "to": END.isoformat()}, "totals": cur,
                "previous": {**prev, "from": PREV_START.isoformat(), "to": PREV_END.isoformat()},
                "daily": part("daily", lambda: rep(END - dt.timedelta(days=89), END, "views,estimatedMinutesWatched,subscribersGained", "day", "day"), []),
                "top_videos": top,
                "traffic_sources": part("traffic_sources", lambda: rep(START, END, "views,estimatedMinutesWatched", "insightTrafficSourceType", "-views"), []),
                "countries": part("countries", lambda: rep(START, END, "views,estimatedMinutesWatched", "country", "-views"), []),
                # Traffic-Quellen-Details: YouTube erlaubt hoechstens 25 Zeilen
                "youtube_search_terms": part("youtube_search_terms", lambda: rep(START, END, "views", "insightTrafficSourceDetail", "-views", 25, "insightTrafficSourceType==YT_SEARCH"), [])}
        if errors:
            data["errors"] = errors
        status = "ok" if cur else f"Abruf fehlgeschlagen ({errors.get('totals', 'keine Daten')})"
        return {"status": status, **data}
    except Exception as e:   # noqa: BLE001   (Token-Abruf)
        return {"status": f"Abruf fehlgeschlagen ({err(e)})"}


# ---------------------------------------------------------------- Bing

def bing(site_url="https://m365.fm/"):
    key = os.environ.get("BING_WEBMASTER_API_KEY", "").strip()
    if not key:
        return {"status": "Secret BING_WEBMASTER_API_KEY fehlt"}
    base = "https://ssl.bing.com/webmaster/api.svc/json/"
    day = lambda s: (lambda m: dt.datetime.fromtimestamp(int(m.group()) / 1000, dt.timezone.utc).date() if m else None)(re.search(r"\d{9,}", str(s)))
    try:
        q = lambda m: get_json(base + m + "?" + urllib.parse.urlencode({"siteUrl": site_url, "apikey": key})).get("d") or []
        rows = sorted((day(r.get("Date")), int(r.get("Clicks") or 0), int(r.get("Impressions") or 0)) for r in q("GetRankAndTrafficStats") if day(r.get("Date")))
        since = TODAY - dt.timedelta(days=28)
        wk = {}
        for d, c, i in rows:
            if d >= TODAY - dt.timedelta(days=7 * 13):
                k = (d - dt.timedelta(days=d.weekday())).isoformat(); a = wk.setdefault(k, [0, 0]); a[0] += c; a[1] += i

        def agg(method, key_name):
            a = {}
            for r in q(method):
                d = day(r.get("Date"))
                if d and d >= since:
                    x = a.setdefault(r.get(key_name, ""), [0, 0, 0.0, 0]); x[0] += int(r.get("Clicks") or 0); x[1] += int(r.get("Impressions") or 0)
                    x[2] += float(r.get("AvgImpressionPosition") or 0); x[3] += 1
            return [{key_name.lower(): k, "clicks": v[0], "impressions": v[1], "position": round(v[2] / v[3], 1) if v[3] else None}
                    for k, v in sorted(a.items(), key=lambda kv: -kv[1][1]) if k]

        return {"status": "ok", "site": site_url, "period": {"from": since.isoformat(), "to": TODAY.isoformat()},
                "totals": {"clicks": sum(r[1] for r in rows if r[0] >= since), "impressions": sum(r[2] for r in rows if r[0] >= since)},
                "weekly": [[k, v[0], v[1]] for k, v in sorted(wk.items())],
                "queries": agg("GetQueryStats", "Query")[:300], "pages": agg("GetPageStats", "Query")[:200],
                "note": "AI Performance (Copilot-Zitate) hat keine API: data/stats/ai_performance.json (monatlich per Workflow ai-stats.yml)."}
    except Exception as e:   # noqa: BLE001
        return {"status": f"Abruf fehlgeschlagen ({err(e)})"}


# Weitere Properties (m365con.net, YouTube-Kanal in der Search Console). Je Property ein eigener Abruf;
# ein Fehler bei einer Property stoppt die anderen nicht. Liste per Variable GSC_EXTRA_SITES (Komma-getrennt) aenderbar.
EXTRA_GSC = {
    "m365con": ["sc-domain:m365con.net", "https://m365con.net/"],
    "youtube_search": ["sc-creator-profile:youtube.com/channel/ido4tn3khkldhp3733e9ja"],
}
EXTRA_BING = {"m365con": "https://m365con.net/"}


def gsc_extra():
    env = [x.strip() for x in os.environ.get("GSC_EXTRA_SITES", "").split(",") if x.strip()]
    targets = {f"site{i}": [x] for i, x in enumerate(env, 1)} if env else EXTRA_GSC
    out = {}
    for name, candidates in targets.items():
        res = {}
        for cand in candidates:   # erste Variante, die antwortet, gewinnt (Domain- oder URL-Praefix-Property)
            res = gsc(cand)
            if res.get("status") == "ok":
                break
        out[name] = res
    return out


def pct(a, b):
    return f"{(a - b) / b * 100:+.0f} %" if b else "–"


def summary(g, y, b):
    out = [f"# Team-Analytics {TODAY.isoformat()}", "", f"Zeitraum {START.isoformat()} bis {END.isoformat()} (28 Tage) gegen die 28 Tage davor.", ""]
    if g.get("status") == "ok":
        t, p = g["totals"], g["previous"]
        out += ["## Google Search Console", f"- Klicks {t['clicks']:,} ({pct(t['clicks'], p['clicks'])}), Impressionen {t['impressions']:,} ({pct(t['impressions'], p['impressions'])}), CTR {t['ctr']} %",
                "- Quick-Wins (Position 4–20): " + "; ".join(f"{x['query']} ({x['impressions']:,} Impr., Pos. {x['position']})" for x in g["quick_wins"][:10]),
                "- CTR-Lücken (Top 5, CTR zu niedrig): " + "; ".join(f"{x['query']} ({x['ctr']} %)" for x in g["ctr_gaps"][:10]), ""]
    else:
        out += ["## Google Search Console", f"- {g.get('status')}", ""]
    if y.get("status") == "ok":
        t, p = y["totals"], y["previous"]
        out += ["## YouTube (m365 Show)", f"- Aufrufe {int(t.get('views', 0)):,} ({pct(t.get('views', 0), p.get('views', 0))}), Wiedergabezeit {int(t.get('estimatedMinutesWatched', 0)):,} Min., Abos +{int(t.get('subscribersGained', 0))}/−{int(t.get('subscribersLost', 0))}",
                "- Top-Videos: " + "; ".join(f"{v['title'][:60]} ({int(v['views']):,})" for v in y["top_videos"][:5]), ""]
    else:
        out += ["## YouTube", f"- {y.get('status')}", ""]
    if b.get("status") == "ok":
        out += ["## Bing", f"- Klicks {b['totals']['clicks']:,}, Impressionen {b['totals']['impressions']:,} (28 Tage)",
                "- Top-Suchanfragen: " + "; ".join(f"{x['query']} ({x['impressions']:,})" for x in b["queries"][:10]), ""]
    else:
        out += ["## Bing", f"- {b.get('status')}", ""]
    return "\n".join(out) + "\n"


def summary_extra(gx, bx):
    out = []
    for name, d in gx.items():
        if d.get("status") == "ok":
            t, p = d["totals"], d["previous"]
            out += [f"## Google Search Console – {name} ({d.get('site')})",
                    f"- Klicks {t['clicks']:,} ({pct(t['clicks'], p['clicks'])}), Impressionen {t['impressions']:,} ({pct(t['impressions'], p['impressions'])}), CTR {t['ctr']} %",
                    "- Top-Suchanfragen: " + "; ".join(f"{x['query']} ({x['impressions']:,})" for x in d["queries"][:10]), ""]
        else:
            out += [f"## Google Search Console – {name}", f"- {d.get('status')}", ""]
    for name, d in bx.items():
        if d.get("status") == "ok":
            out += [f"## Bing – {name}", f"- Klicks {d['totals']['clicks']:,}, Impressionen {d['totals']['impressions']:,} (28 Tage)", ""]
        else:
            out += [f"## Bing – {name}", f"- {d.get('status')}", ""]
    return "\n".join(out) + ("\n" if out else "")


def main():
    out = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "reports" / "analytics")
    out.mkdir(parents=True, exist_ok=True)
    g, y, b = gsc(), youtube(), bing()
    meta = {"generated": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")}
    for name, data in (("gsc", g), ("youtube", y), ("bing", b)):
        (out / f"{name}.json").write_text(json.dumps({**meta, **data}, ensure_ascii=False, indent=1), "utf-8")
        print(name, data.get("status"))
    gx = gsc_extra()
    bx = {name: bing(url) for name, url in EXTRA_BING.items()}
    for name, data in gx.items():
        (out / f"gsc_{name}.json").write_text(json.dumps({**meta, **data}, ensure_ascii=False, indent=1), "utf-8")
        print("gsc_" + name, data.get("status"))
    for name, data in bx.items():
        (out / f"bing_{name}.json").write_text(json.dumps({**meta, **data}, ensure_ascii=False, indent=1), "utf-8")
        print("bing_" + name, data.get("status"))
    (out / "summary.md").write_text(summary(g, y, b) + "\n" + summary_extra(gx, bx), "utf-8")


if __name__ == "__main__":
    main()
