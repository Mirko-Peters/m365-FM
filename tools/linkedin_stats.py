#!/usr/bin/env python3
"""LinkedIn-Follower der Unternehmensseite M365 Show ueber die Pages Data Portability API (nur lesen) in die Mediadaten.

Schreibt die Zahl der Seiten-Follower in data/stats/m365con_linkedin.json (page.page_followers) - dieselbe Datei, aus der
tools/mediakit_con.py (M365Con-Sponsordeck) die LinkedIn-Zahlen liest. Alle uebrigen Felder (30-Tage-Werte, Livestreams) bleiben unveraendert.
Gespeichert wird nur die Summe - nie ein Follower-URN, nie ein Name (die API liefert je Follow eine Kante; sie wird nur gezaehlt).

Modi (python tools/linkedin_stats.py MODE):
  probe   EINE Anfrage (5 Eintraege), gibt nur die Form der Antwort aus: Statuscode, Feldnamen, paging.total, Kantentypen. Speichert nichts.
          Dient dazu, die Annahmen unten gegen die echte Antwort zu pruefen, bevor gezaehlt wird.
  fetch   zaehlt die Kanten MEMBER_FOLLOWS_ORGANIZATIONAL_PAGE seitenweise (1000 je Anfrage); die API erlaubt 1 Anfrage je 60 Sekunden,
          bei ~100.000 Followern dauert ein Lauf also gut 1,5 Stunden. Mit LINKEDIN_TRUST_TOTAL=1 wird stattdessen paging.total der ersten
          Antwort uebernommen (erst setzen, wenn probe gezeigt hat, dass total die Gesamtzahl ist). --dry-run: nichts speichern.

Umgebung: LINKEDIN_ACCESS_TOKEN (Token eines Seiten-Admins mit r_dma_admin_pages_content; nur als GitHub-Secret, wird nie ausgegeben).
          Optional zur Erneuerung: LINKEDIN_REFRESH_TOKEN + LINKEDIN_CLIENT_ID + LINKEDIN_CLIENT_SECRET - sind alle drei gesetzt, holt jeder Lauf damit
          zuerst einen frischen Access-Token (Access-Token 60 Tage, Refresh-Token 365 Tage ab erstem Login, danach einmal neu anmelden); schlaegt das fehl,
          wird der gespeicherte LINKEDIN_ACCESS_TOKEN versucht.
          LINKEDIN_PAGE_ID (Zahl der Seite, steht in der Admin-URL linkedin.com/company/<ZAHL>/admin/), LINKEDIN_VERSION (optional, JJJJMM, Standard 202611).
Unterlagen: Followee-Finder https://learn.microsoft.com/en-us/linkedin/dma/pages-data-portability/pages-follows/organizational-page-follow
Schutz: Eine Zahl unter der Haelfte des bisherigen Wertes (oder 0) wird nicht gespeichert (z. B. wenn die API wegen fehlender Mitglieder-Freigabe
weniger Kanten liefert) - ausser mit --force. Daten koennen bis zu 48 Stunden alt sein (Angabe der Doku).
"""
import argparse, datetime as dt, json, os, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILE = ROOT / "data" / "stats" / "m365con_linkedin.json"
API = "https://api.linkedin.com/rest/dmaOrganizationalPageFollows"
EDGE = "MEMBER_FOLLOWS_ORGANIZATIONAL_PAGE"
PAGE_SIZE = 1000            # laut Doku Obergrenze von maxPaginationCount
WAIT = 61                   # Doku: 1 Anfrage je 60 Sekunden
MAX_PAGES = 400             # Sicherung (400.000 Follower)


def _headers(token):
    return {"Authorization": "Bearer " + token, "Linkedin-Version": os.environ.get("LINKEDIN_VERSION", "202611").strip() or "202611",
            "X-Restli-Protocol-Version": "2.0.0", "Accept": "application/json"}


def http_get(url, headers, timeout=60):
    """(Statuscode, JSON-Objekt). Gibt weder Token noch Antwortinhalt aus."""
    rq = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(rq, timeout=timeout) as r:
            return r.status, json.loads(r.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as e:
        try: return e.code, json.loads(e.read().decode("utf-8") or "{}")
        except Exception:   # noqa: BLE001
            return e.code, {}
    except Exception as e:   # noqa: BLE001
        print("Abruf fehlgeschlagen:", type(e).__name__)
        return 0, {}


def http_post_form(url, fields, timeout=60):
    """(Statuscode, JSON-Objekt) fuer einen Formular-POST. Gibt nichts aus."""
    rq = urllib.request.Request(url, data=urllib.parse.urlencode(fields).encode(), headers={"Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json"})
    try:
        with urllib.request.urlopen(rq, timeout=timeout) as r:
            return r.status, json.loads(r.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as e:
        try: return e.code, json.loads(e.read().decode("utf-8") or "{}")
        except Exception:   # noqa: BLE001
            return e.code, {}
    except Exception as e:   # noqa: BLE001
        print("Token-Erneuerung fehlgeschlagen:", type(e).__name__)
        return 0, {}


def get_token(env=None, post=http_post_form):
    """Access-Token: per Refresh-Token erneuert (wenn Refresh-Token, Client-ID und -Secret gesetzt sind), sonst der gespeicherte. '' wenn keiner da.
    Ein erneuertes Refresh-Token wird nicht weiterverwendet: laut Doku laeuft das urspruengliche 365 Tage ab dem ersten Login und bleibt gueltig."""
    env = os.environ if env is None else env
    rt, cid, sec = (str(env.get(k, "")).strip() for k in ("LINKEDIN_REFRESH_TOKEN", "LINKEDIN_CLIENT_ID", "LINKEDIN_CLIENT_SECRET"))
    if rt and cid and sec:
        st, b = post("https://www.linkedin.com/oauth/v2/accessToken", {"grant_type": "refresh_token", "refresh_token": rt, "client_id": cid, "client_secret": sec})
        tok = str(b.get("access_token") or "").strip() if isinstance(b, dict) else ""
        if st == 200 and tok:
            print("Access-Token per Refresh-Token erneuert.")
            return tok
        print("Erneuerung per Refresh-Token fehlgeschlagen:", _err(st, b), "- versuche gespeicherten Access-Token")
    return str(env.get("LINKEDIN_ACCESS_TOKEN", "")).strip()


def url_for(page_id, count, cursor=None):
    q = {"q": "followee", "followee": f"urn:li:organizationalPage:{page_id}", "edgeType": EDGE, "maxPaginationCount": count}
    if cursor: q["paginationCursor"] = cursor
    return API + "?" + urllib.parse.urlencode(q, quote_via=urllib.parse.quote)


def _err(st, body):
    """Kurze Fehlerzeile: nur Statuscode und LinkedIns eigene Code-/Meldungsfelder (kein Token, keine Personendaten)."""
    hint = {401: "Token fehlt, ist abgelaufen oder ungueltig", 403: "Token ohne Recht r_dma_admin_pages_content oder Nutzer ohne Seitenrolle (Administrator/Content-Admin/Analyst)",
            404: "Seiten-ID passt nicht", 426: "LINKEDIN_VERSION nicht mehr unterstuetzt", 429: "zu viele Anfragen (1 je 60 s)"}.get(st, "")
    msg = str(body.get("message") or body.get("code") or "")[:160] if isinstance(body, dict) else ""
    return f"HTTP {st}" + (f" - {hint}" if hint else "") + (f" - {msg}" if msg else "")


def probe(token, page_id, get=http_get):
    """Eine Anfrage, nur Form der Antwort. Gibt dict mit den Befunden zurueck (fuer Tests) und druckt sie."""
    st, b = get(url_for(page_id, 5), _headers(token))
    out = {"status": st}
    if st != 200:
        print("probe:", _err(st, b)); return out
    els = b.get("elements") if isinstance(b.get("elements"), list) else []
    pg = b.get("paging") if isinstance(b.get("paging"), dict) else {}
    out.update(top_keys=sorted(b.keys()), elements=len(els), paging_keys=sorted(pg.keys()), total=pg.get("total"),
               has_cursor=bool((b.get("metadata") or {}).get("nextPaginationCursor")),
               element_keys=sorted({k for e in els if isinstance(e, dict) for k in e}),
               edge_types=sorted({str(e.get("edgeType")) for e in els if isinstance(e, dict)}))
    print("probe: HTTP 200")
    for k in ("top_keys", "elements", "paging_keys", "total", "has_cursor", "element_keys", "edge_types"):
        print(f"  {k}: {out[k]}")
    return out


def count_followers(token, page_id, get=http_get, sleep=time.sleep, trust_total=False):
    """Zaehlt die Follow-Kanten. Gibt (Anzahl, Seiten, Quelle) zurueck oder wirft RuntimeError."""
    n, pages, cursor, hdr = 0, 0, None, _headers(token)
    while True:
        st, b = get(url_for(page_id, PAGE_SIZE, cursor), hdr)
        if st == 429:
            sleep(WAIT); st, b = get(url_for(page_id, PAGE_SIZE, cursor), hdr)
        if st != 200:
            raise RuntimeError(_err(st, b))
        els = [e for e in (b.get("elements") or []) if isinstance(e, dict) and e.get("edgeType", EDGE) == EDGE]
        n += len(els); pages += 1
        total = (b.get("paging") or {}).get("total")
        if trust_total and pages == 1 and isinstance(total, int) and not isinstance(total, bool) and total >= len(els):
            return total, 1, "paging.total"
        cursor = (b.get("metadata") or {}).get("nextPaginationCursor")
        if not cursor or not els: return n, pages, "count"
        if pages >= MAX_PAGES: raise RuntimeError(f"abgebrochen nach {MAX_PAGES} Seiten - Zahl waere unvollstaendig")
        print(f"  Seite {pages}: {n} bisher", flush=True)
        sleep(WAIT)


def save(count, today=None, path=FILE, force=False):
    """Traegt count als page.page_followers ein. Gibt True zurueck, wenn gespeichert wurde."""
    today = today or dt.date.today().isoformat()
    path = Path(path)
    try: d = json.loads(path.read_text("utf-8"))
    except Exception:   # noqa: BLE001
        d = {"version": 1, "status": "empty", "entered": "api", "page": {}, "streams": []}
    page = d.setdefault("page", {})
    old = page.get("page_followers")
    if not force and isinstance(old, int) and old > 0 and count < old // 2:
        print(f"Nicht gespeichert: {count} liegt unter der Haelfte des bisherigen Werts {old} (mit --force trotzdem)."); return False
    if count <= 0 and not force:
        print("Nicht gespeichert: Zahl ist 0."); return False
    page["page_followers"] = count
    page["followers_retrieved"] = today
    page["followers_source"] = "LinkedIn Pages Data Portability API (Follow-Kanten gezaehlt)"
    page.setdefault("name", "M365 Show")
    if d.get("status") != "ok": d["status"] = "ok"
    if not d.get("retrieved"): d["retrieved"] = today
    path.write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", "utf-8")
    print(f"gespeichert: page_followers={count} (vorher {old}), Stand {today}")
    return True


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("mode", choices=["probe", "fetch"])
    ap.add_argument("--dry-run", action="store_true"); ap.add_argument("--force", action="store_true")
    a = ap.parse_args(argv)
    token = get_token(); page_id = os.environ.get("LINKEDIN_PAGE_ID", "").strip()
    if not token or not page_id.isdigit():
        print("Kein Token (LINKEDIN_ACCESS_TOKEN oder Refresh-Token mit Client-ID/-Secret) oder LINKEDIN_PAGE_ID fehlt (Seiten-ID nur Ziffern). Nichts getan."); return 2
    if a.mode == "probe":
        return 0 if probe(token, page_id).get("status") == 200 else 1
    try:
        n, pages, src = count_followers(token, page_id, trust_total=os.environ.get("LINKEDIN_TRUST_TOTAL", "") == "1")
    except RuntimeError as e:
        print("fetch:", e); return 1
    print(f"Follower: {n} ({pages} Anfrage(n), Quelle {src})")
    if a.dry_run: return 0
    return 0 if save(n, force=a.force) else 1


if __name__ == "__main__":
    sys.exit(main())
