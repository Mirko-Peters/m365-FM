"""Woechentlicher Search-Console-Export (Issue #156, Workflow .github/workflows/gsc-export.yml): data/seo/gsc/<bis-datum>.json.

Inhalt: Google Search Console, Search Analytics (Websuche) der letzten 7 Tage bis vor 3 Tagen (juengere Tage sind noch nicht vollstaendig), je
Suchanfrage, Seite und Land: clicks, impressions, ctr, position. Eine Sprache liefert die API nicht; die Sprache steckt im Pfad der Seite (/de/...)
und das Land in "country" (ISO 3166-1 alpha-3, klein). Hoechstens GSC_ROWS Zeilen (Standard 25.000, nach Klicks sortiert wie von der API geliefert).
Format: {"version": 1, "property", "period": {"from", "to"}, "retrieved", "dimensions", "totals": {clicks, impressions, ctr, position},
         "rows": [{"query", "page", "country", "clicks", "impressions", "ctr", "position"}], "truncated"}

Anmeldung wie tools/update_ai_stats.py (gleiche Funktionen): Dienstkonto aus dem GitHub-Secret GSC_SERVICE_ACCOUNT_JSON, JWT RS256 mit cryptography,
Token-Tausch bei Google. Das Secret wird nie ausgegeben; Fehlermeldungen laufen durch scrub(). Property aus GSC_SITE (Standard sc-domain:m365.fm).
Fehlt das Secret oder antwortet die API mit 403 (Dienstkonto nicht in der Search Console eingetragen), endet der Lauf gruen mit ::notice:: und schreibt
nichts. Andere Fehler (Schluessel kaputt, Netz, 5xx nach Wiederholung) lassen den Lauf scheitern, ebenfalls ohne zu schreiben.
Aufruf: python tools/gsc_export.py [--dry-run] [--out-dir data/seo/gsc]"""
import json, os, sys, time, urllib.parse
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import update_ai_stats as U   # noqa: E402  (JWT, Token-Tausch, HTTP mit Wiederholung, scrub)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "seo" / "gsc"
DIMS = ["query", "page", "country"]
LAG_DAYS, SPAN_DAYS, PAGE_ROWS, ROWS_MAX = 3, 7, 25000, 25000   # Seite der API (hoechstens 25.000) und Obergrenze je Export (GSC_ROWS)
SETUP = ("Search Console: das Dienstkonto (client_email aus GSC_SERVICE_ACCOUNT_JSON) in der Search Console unter Einstellungen > Nutzer und Berechtigungen "
         "als Nutzer (eingeschraenkt) der Property {site} eintragen; danach den Workflow erneut starten.")


def period(today):
    to = today - timedelta(days=LAG_DAYS)
    return to - timedelta(days=SPAN_DAYS - 1), to


def parse_rows(rows, dims=DIMS):
    """API-Zeilen {keys: [...], clicks, impressions, ctr, position} -> flache Datensaetze (Zahlen gerundet, fehlende Felder 0)."""
    out = []
    for r in rows or []:
        keys = r.get("keys") or []
        if len(keys) != len(dims): continue
        rec = dict(zip(dims, (str(k) for k in keys)))
        rec.update(clicks=int(r.get("clicks") or 0), impressions=int(r.get("impressions") or 0), ctr=round(float(r.get("ctr") or 0), 4), position=round(float(r.get("position") or 0), 1))
        out.append(rec)
    return out


def totals(rows):
    c, i = sum(r["clicks"] for r in rows), sum(r["impressions"] for r in rows)
    pos = sum(r["position"] * r["impressions"] for r in rows) / i if i else 0
    return {"clicks": c, "impressions": i, "ctr": round(c / i, 4) if i else 0, "position": round(pos, 1)}


def export(env, today, now=None, http=None):
    """-> (status, doc, meldungen). status: ok | missing_secret | forbidden | error. doc nur bei ok. meldungen: [(stufe, text)] fuer ::notice::/::warning::."""
    http = http or U.http_json
    site = (env.get("GSC_SITE") or "").strip() or U.GSC_DEFAULT_SITE
    raw = (env.get("GSC_SERVICE_ACCOUNT_JSON") or "").strip()
    if not raw:
        return "missing_secret", None, [("notice", "Search Console: Secret GSC_SERVICE_ACCOUNT_JSON fehlt (Dienstkonto-Schluessel als JSON in den Repo-Secrets hinterlegen); nichts exportiert. " + SETUP.format(site=site))]
    try:
        sa = json.loads(raw)
        if not (isinstance(sa, dict) and isinstance(sa.get("client_email"), str) and "PRIVATE KEY" in str(sa.get("private_key"))): raise ValueError
    except ValueError:
        return "error", None, [("error", "Search Console: GSC_SERVICE_ACCOUNT_JSON ist kein Dienstkonto-Schluessel (JSON mit client_email und private_key)")]
    frm, to = period(today)
    url = U.GSC_API.format(site=urllib.parse.quote(site, safe=""))
    limit = max(1, int(env.get("GSC_ROWS") or ROWS_MAX))
    stage = "Anmeldung"
    try:
        try:
            jwt = U.jwt_assertion(sa, int(now if now is not None else time.time()))
        except U.Missing:
            return "error", None, [("error", "Search Console: Python-Paket cryptography fehlt (pip install cryptography)")]
        except Exception as e:
            raise U.ApiError(0, f"private_key nicht lesbar ({type(e).__name__})") from None
        tok = http(U.token_uri(sa), form={"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": jwt})
        if not tok.get("access_token"): raise U.ApiError(0, "Token-Antwort ohne access_token")
        auth = {"Authorization": "Bearer " + str(tok["access_token"])}
        stage = "Search Analytics"
        rows, start, truncated = [], 0, False
        while len(rows) < limit:
            n = min(PAGE_ROWS, limit - len(rows))
            part = http(url, body={"startDate": frm.isoformat(), "endDate": to.isoformat(), "type": "web", "dimensions": DIMS, "rowLimit": n, "startRow": start}, headers=auth).get("rows") or []
            rows += parse_rows(part); start += len(part)
            if len(part) < n: break
        else:
            truncated = True
    except U.ApiError as e:
        if e.code == 403:
            return "forbidden", None, [("notice", U.scrub(f"Search Console {stage}: {e}", sa) + " - nichts exportiert. " + SETUP.format(site=site))]
        return "error", None, [("error", U.scrub(f"Search Console {stage}: {e}", sa))]
    doc = {"version": 1, "property": site, "period": {"from": frm.isoformat(), "to": to.isoformat()}, "retrieved": today.isoformat(), "dimensions": DIMS,
           "totals": totals(rows), "rows": rows, "truncated": truncated}
    return "ok", doc, [("notice", f"Search Console {frm} bis {to}: {len(rows):,} Zeilen, {doc['totals']['clicks']:,} Klicks, {doc['totals']['impressions']:,} Impressionen" + (" (gekuerzt)" if truncated else ""))]


def main(argv=None, env=None, today=None, now=None, http=None, out_dir=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    env = os.environ if env is None else env
    out = Path(argv[argv.index("--out-dir") + 1]) if "--out-dir" in argv else (out_dir or OUT)
    status, doc, msgs = export(env, today or date.today(), now=now, http=http)
    for level, text in msgs: print(f"::{level}::{text}")
    if status in ("missing_secret", "forbidden"): return 0   # gruen, nichts geschrieben
    if status != "ok": return 1
    if "--dry-run" in argv: print(json.dumps({k: v for k, v in doc.items() if k != "rows"}, ensure_ascii=False)); return 0
    out.mkdir(parents=True, exist_ok=True)
    f = out / f"{doc['period']['to']}.json"
    f.write_text(json.dumps(doc, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print("geschrieben:", f.relative_to(ROOT) if f.is_relative_to(ROOT) else f)
    return 0


if __name__ == "__main__":
    sys.exit(main())
