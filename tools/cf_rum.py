#!/usr/bin/env python3
"""Cloudflare Web Analytics (RUM) fuer www.m365.fm: echte Seitenaufrufe im Browser (JS-Beacon), Bots weitgehend ausgeschlossen.

Ersetzt fuer Sponsor-Zahlen die ungefilterte Zonen-Statistik (httpRequests*), die jede HTML-Antwort zaehlt - auch Bots.
GraphQL auf Kontoebene: viewer.accounts(filter:{accountTag}).rumPageloadEventsAdaptiveGroups, gefiltert auf den siteTag der Website;
count = Seitenaufrufe, sum.visits = Besuche (Seitenaufruf mit fremdem/leerem Referer).

Umgebung (nie ausgegeben):
  CF_ANALYTICS_TOKEN     bevorzugt: eigener Lese-Token (Vorlage "Read analytics and logs": Account Analytics Read, Zone Analytics Read,
                         Logs Read); sonst CLOUDFLARE_API_TOKEN. Die Site-Suche braucht zusaetzlich "Account Settings: Read" -
                         fehlt das (wie in der Vorlage), muss CF_RUM_SITE_TAG gesetzt sein.
  CF_ACCOUNT_ID          optional; sonst CLOUDFLARE_ACCOUNT_ID oder R2_ACCOUNT_ID (gleiches Cloudflare-Konto)
  CF_RUM_SITE_TAG        optional; sonst Suche ueber GET /accounts/{id}/rum/site_info/list nach www.m365.fm bzw. m365.fm

Web Analytics ist fuer m365.fm erst seit RUM_START aktiv: Zeitraeume davor werden abgeschnitten und so beschriftet, nie hochgerechnet.
"""
import datetime as dt
import json
import os
import urllib.error
import urllib.request

API = "https://api.cloudflare.com/client/v4"
RUM_START = dt.date(2026, 10, 29)   # Web Analytics fuer m365.fm aktiv seit (Angabe des Inhabers)
HOSTS = ("www.m365.fm", "m365.fm")


def token():
    """Analytics-Token: CF_ANALYTICS_TOKEN (nur Lesen) vor CLOUDFLARE_API_TOKEN (Deploy-Token). Wird nie ausgegeben."""
    return next((v for v in (os.environ.get(k, "").strip() for k in ("CF_ANALYTICS_TOKEN", "CLOUDFLARE_API_TOKEN")) if v), "")


class RumError(RuntimeError):
    """RUM nicht verfuegbar (fehlendes Recht, kein siteTag, API-Fehler). Die Nachricht enthaelt nie Geheimnisse."""


def _http(url, data=None, headers=None, timeout=60):
    """(status, json) - Fehler werden nicht ausgegeben, damit nie Header/Token im Log landen. Tests ersetzen diese Funktion."""
    rq = urllib.request.Request(url, data=data, headers=headers or {}, method="POST" if data is not None else "GET")
    try:
        with urllib.request.urlopen(rq, timeout=timeout) as r:
            return r.status, json.loads(r.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as e:
        try: return e.code, json.loads(e.read().decode("utf-8") or "{}")
        except Exception: return e.code, {}
    except Exception:
        return 0, {}


def warn(msg):
    """Warnung im Workflow-Log (GitHub-Annotation), kein Fehlschlag."""
    print(f"::warning title=Cloudflare Web Analytics::{msg}" if os.environ.get("GITHUB_ACTIONS") else f"WARNUNG Cloudflare Web Analytics: {msg}", flush=True)


def _errors(d):
    errs = d.get("errors") or []
    return "; ".join(str((e or {}).get("message", e))[:160] for e in errs[:3]) if isinstance(errs, list) else str(errs)[:160]


def clamp(since, until):
    """Zeitraum auf RUM_START kuerzen -> (since, until, clamped). since > until: kein Zeitraum (None)."""
    clamped = since < RUM_START
    since = max(since, RUM_START)
    return (since, until, clamped) if since <= until else (None, None, True)


def period_label(lang, since, until, clamped, full_days=30):
    """Ehrliche Beschriftung: 'letzte 30 Tage' oder 'seit 29.10.2026 (8 Tage)' / 'since 29 Oct 2026 (8 days)'."""
    if not clamped:
        return "letzte 30 Tage" if lang == "de" else f"last {full_days} days"
    n = (until - since).days + 1
    if lang == "de":
        return f"seit {RUM_START:%d.%m.%Y} ({n} {'Tag' if n == 1 else 'Tage'})"
    return f"since {RUM_START.day} {RUM_START:%b %Y} ({n} {'day' if n == 1 else 'days'})"


class Rum:
    """Zugang zu Web Analytics. Rum.connect() wirft RumError, wenn Token, Konto oder siteTag fehlen."""

    def __init__(self, token, account, site_tag):
        self.account, self.site_tag = account, site_tag
        self._h = {"authorization": "Bearer " + token, "content-type": "application/json"}

    @classmethod
    def connect(cls):
        tok = token()
        account = next((v for v in (os.environ.get(k, "").strip() for k in ("CF_ACCOUNT_ID", "CLOUDFLARE_ACCOUNT_ID", "R2_ACCOUNT_ID")) if v), "")
        if not tok: raise RumError("Secret CF_ANALYTICS_TOKEN (oder CLOUDFLARE_API_TOKEN) fehlt")
        if not account: raise RumError("Konto-ID fehlt (Secret CF_ACCOUNT_ID, CLOUDFLARE_ACCOUNT_ID oder R2_ACCOUNT_ID)")
        tag = os.environ.get("CF_RUM_SITE_TAG", "").strip()
        rum = cls(tok, account, tag)
        if not tag: rum.site_tag = rum.discover_site_tag()
        return rum

    def discover_site_tag(self):
        """siteTag der Web-Analytics-Site fuer www.m365.fm/m365.fm (bevorzugt www). Braucht 'Account Settings: Read'."""
        found = {}
        for page in range(1, 6):
            st, d = _http(f"{API}/accounts/{self.account}/rum/site_info/list?per_page=50&page={page}", headers=self._h)
            if st != 200 or not d.get("success", True):
                raise RumError(f"Site-Liste nicht abrufbar (HTTP {st}{': ' + _errors(d) if _errors(d) else ''}) - "
                               "Variable CF_RUM_SITE_TAG setzen (der Analytics-Token hat meist kein 'Account Settings: Read')")
            sites = d.get("result") or []
            for s in sites:
                hosts = {str(s.get("zone_name") or "").lower(), str((s.get("ruleset") or {}).get("zone_name") or "").lower(),
                         str(s.get("host") or "").lower()}
                hosts |= {str((r or {}).get("host") or "").lower() for r in (s.get("rules") or [])}
                for h in HOSTS:
                    if h in hosts and s.get("site_tag"): found.setdefault(h, s["site_tag"])
            info = d.get("result_info") or {}
            if not sites or page >= int(info.get("total_pages") or 1): break
        for h in HOSTS:
            if h in found: return found[h]
        raise RumError("keine Web-Analytics-Site fuer www.m365.fm/m365.fm gefunden - Variable CF_RUM_SITE_TAG setzen")

    def query(self, q, since, until, **extra):
        """GraphQL mit $a (Konto), $t (siteTag), $s/$u (datetime, until inklusive -> < until+1 Tag). Liefert das accounts[0]-Objekt."""
        var = {"a": self.account, "t": self.site_tag, "s": f"{since}T00:00:00Z", "u": f"{until + dt.timedelta(days=1)}T00:00:00Z", **extra}
        st, d = _http(f"{API}/graphql", json.dumps({"query": q, "variables": var}).encode(), self._h)
        if st != 200 or d.get("errors") or not isinstance(d.get("data"), dict):
            raise RumError(f"GraphQL fehlgeschlagen (HTTP {st}{': ' + _errors(d) if _errors(d) else ''}) - "
                           "Token-Recht 'Account Analytics: Read' fuer das Konto pruefen")
        acc = ((d["data"].get("viewer") or {}).get("accounts") or [None])[0]
        if not isinstance(acc, dict): raise RumError("GraphQL ohne Kontodaten (Konto-ID oder Token-Konto pruefen)")
        return acc


FILTER = "filter:{siteTag:$t,datetime_geq:$s,datetime_lt:$u}"
SUMMARY_Q = ("query($a:String!,$t:String!,$s:Time!,$u:Time!){viewer{accounts(filter:{accountTag:$a}){"
             f"total:rumPageloadEventsAdaptiveGroups(limit:1,{FILTER}){{count sum{{visits}}}}"
             f"daily:rumPageloadEventsAdaptiveGroups(limit:100,orderBy:[date_ASC],{FILTER}){{count sum{{visits}} dimensions{{date}}}}"
             f"countries:rumPageloadEventsAdaptiveGroups(limit:10,orderBy:[count_DESC],{FILTER}){{count dimensions{{countryName}}}}"
             "}}}")
PATH_Q = ("query($a:String!,$t:String!,$s:Time!,$u:Time!,$p:String!){viewer{accounts(filter:{accountTag:$a}){"
          "rumPageloadEventsAdaptiveGroups(limit:100,filter:{siteTag:$t,datetime_geq:$s,datetime_lt:$u,requestPath:$p}){count dimensions{date}}"
          "}}}")


def summary(rum, since, until):
    """Seitenaufrufe, Besuche, Tagesverlauf und Top-Laender fuer [since, until] (Datumsangaben, UTC), auf RUM_START gekuerzt.
    Ergebnis: {pageviews, visits, since, until, clamped, daily:[[date, pv, visits]], countries:[[code, share%]]}."""
    since, until, clamped = clamp(since, until)
    if since is None: raise RumError(f"Zeitraum liegt vor dem Start von Web Analytics ({RUM_START})")
    acc = rum.query(SUMMARY_Q, since, until)
    tot = (acc.get("total") or [{}])[0] if acc.get("total") else {}
    pv = int(tot.get("count") or 0); visits = int((tot.get("sum") or {}).get("visits") or 0)
    daily = [[(r.get("dimensions") or {}).get("date", ""), int(r.get("count") or 0), int((r.get("sum") or {}).get("visits") or 0)]
             for r in acc.get("daily") or []]
    got = {r[0]: r for r in daily if r[0]}
    # Tage ohne Zeile hatten keine gemessenen Browser-Aufrufe (Web Analytics ist aktiv) -> 0, damit der Verlauf keine Luecken verschleiert
    daily = [got.get(str(d), [str(d), 0, 0]) for d in (since + dt.timedelta(days=i) for i in range((until - since).days + 1))]
    countries = [[(r.get("dimensions") or {}).get("countryName") or "?", round(int(r.get("count") or 0) * 100 / pv, 1)]
                 for r in acc.get("countries") or []] if pv else []
    return {"pageviews": pv, "visits": visits, "since": str(since), "until": str(until), "clamped": clamped, "daily": daily, "countries": countries}


def path_views(rum, day, path):
    """Seitenaufrufe einer URL-Pfads an einem Tag -> [(date, count)]; Tage vor RUM_START -> [] ohne Abfrage."""
    d = dt.date.fromisoformat(day)
    if d < RUM_START: return []
    acc = rum.query(PATH_Q, d, d, p=path)
    return [((g.get("dimensions") or {}).get("date") or day, int(g.get("count") or 0)) for g in acc.get("rumPageloadEventsAdaptiveGroups") or []]
