#!/usr/bin/env python3
"""Cloudflare-Verbrauch messen (nur lesend): D1-Zeilen je Tag, R2-Operationen nach actionType und Klasse, R2-Speicher, dazu die D1-Zeilen je
Cron-Aufgabe aus cron_runs (rr/rw, worker/src/d1meter.js). Ergebnis als Markdown in die Step-Summary (.github/workflows/cf-usage.yml).

Zweck: vorher/nachher fuer die D1-/R2-Kostensenkung (Standard 14 Tage, also eine Woche vor und eine nach einer Aenderung).

Quellen (nur GET bzw. GraphQL-Abfragen und ein festes SELECT, nie ein Schreibzugriff):
  GraphQL viewer.accounts(filter:{accountTag}) . d1AnalyticsAdaptiveGroups (sum rowsRead/rowsWritten/readQueries/writeQueries je date, databaseId)
                                               . r2OperationsAdaptiveGroups (sum requests je actionType, bucketName; ein Tag je Abfrage)
                                               . r2StorageAdaptiveGroups (max payloadSize/objectCount je bucketName, letzter Tag)
  REST GET /accounts/{id}/d1/database (Namen statt IDs), POST .../d1/database/{uuid}/query mit CRON_SQL (nur SELECT, fest im Code)

Umgebung (nie ausgegeben):
  CF_ANALYTICS_TOKEN    bevorzugt (Lese-Token, Vorlage "Read analytics and logs"); sonst CLOUDFLARE_API_TOKEN. Lehnt ein Token eine Abfrage ab,
                        wird das naechste versucht.
  CF_ACCOUNT_ID         sonst CLOUDFLARE_ACCOUNT_ID oder R2_ACCOUNT_ID (gleiches Konto, wie secrets-check.yml)

Fehlt ein Token, ein Recht ("Account Analytics: Read", fuer cron_runs "D1: Read") oder ist die API nicht erreichbar, steht ein Hinweis
(::notice::) im Log und im Bericht, und das Programm endet mit 0 (kein roter Lauf).
Aufruf: python tools/cf_usage.py [--days 14] [--out datei.md]   (ohne --out: $GITHUB_STEP_SUMMARY, sonst stdout)
"""
import datetime as dt
import json
import os
import re
import sys
import urllib.error
import urllib.request

API = "https://api.cloudflare.com/client/v4"
DB_NAME = "m365-dub"
PERM_HINT = "Dem Cloudflare-Token fehlt vermutlich das Recht 'Account Analytics: Read' (Secret CF_ANALYTICS_TOKEN, Vorlage 'Read analytics and logs')."

# R2-Preisklassen laut Cloudflare (Class A = schreibend/listend, Class B = lesend, Loeschen und Abbrechen kostenlos).
CLASS_A = {"ListBuckets", "PutBucket", "ListObjects", "ListObjectsV2", "PutObject", "CopyObject", "CompleteMultipartUpload", "CreateMultipartUpload",
           "LifecycleStorageTierTransition", "ListMultipartUploads", "UploadPart", "UploadPartCopy", "ListParts", "PutBucketEncryption",
           "PutBucketCors", "PutBucketLifecycleConfiguration", "PutBucketPolicy", "PutBucketWebsite", "PutBucketTagging"}
CLASS_B = {"HeadBucket", "HeadObject", "GetObject", "UsageSummary", "GetBucketEncryption", "GetBucketLocation", "GetBucketCors",
           "GetBucketLifecycleConfiguration", "GetBucketPolicy", "GetBucketWebsite", "GetBucketTagging"}
FREE = {"DeleteObject", "DeleteObjects", "DeleteBucket", "AbortMultipartUpload", "DeleteBucketCors", "DeleteBucketLifecycleConfiguration",
        "DeleteBucketEncryption", "DeleteBucketPolicy", "DeleteBucketWebsite", "DeleteBucketTagging"}

Q_D1 = ("query($a:String!,$s:Date!,$e:Date!){viewer{accounts(filter:{accountTag:$a}){d1AnalyticsAdaptiveGroups(limit:10000,"
        "filter:{date_geq:$s,date_leq:$e},orderBy:[date_ASC]){sum{readQueries writeQueries rowsRead rowsWritten}dimensions{date databaseId}}}}}")
Q_R2OPS = ("query($a:String!,$s:Time!,$e:Time!){viewer{accounts(filter:{accountTag:$a}){r2OperationsAdaptiveGroups(limit:10000,"
           "filter:{datetime_geq:$s,datetime_leq:$e}){sum{requests}dimensions{actionType bucketName}}}}}")
Q_R2STORE = ("query($a:String!,$s:Time!,$e:Time!){viewer{accounts(filter:{accountTag:$a}){r2StorageAdaptiveGroups(limit:1000,"
             "filter:{datetime_geq:$s,datetime_leq:$e}){max{payloadSize metadataSize objectCount}dimensions{bucketName}}}}}")
# D1-Zeilen je Cron-Aufgabe (track() in worker/src/index.js schreibt info = {"rr":..,"rw":..,...}, auf 300 Zeichen gekuerzt - deshalb
# json_valid-Pruefung und sonst die fuehrende Zahl nach "rr":/"rw":). Nur lesen; ?1 = Startzeit (Unix-Sekunden).
CRON_SQL = ("SELECT name, COUNT(*) AS n, "
            "SUM(CASE WHEN json_valid(info) THEN CAST(json_extract(info,'$.rr') AS INTEGER) ELSE CAST(substr(info, instr(info,'\"rr\":')+5) AS INTEGER) END) AS rr, "
            "SUM(CASE WHEN json_valid(info) THEN CAST(json_extract(info,'$.rw') AS INTEGER) ELSE CAST(substr(info, instr(info,'\"rw\":')+5) AS INTEGER) END) AS rw "
            "FROM cron_runs WHERE started >= ?1 AND ok = 1 AND info LIKE '{\"rr\":%' GROUP BY name ORDER BY rr + rw DESC LIMIT 30")


def tokens():
    """Kandidaten in fester Reihenfolge, ohne Dubletten. Werden nie ausgegeben."""
    out = []
    for k in ("CF_ANALYTICS_TOKEN", "CLOUDFLARE_API_TOKEN"):
        v = os.environ.get(k, "").strip()
        if v and v not in out: out.append(v)
    return out


def account():
    return next((v for v in (os.environ.get(k, "").strip() for k in ("CF_ACCOUNT_ID", "CLOUDFLARE_ACCOUNT_ID", "R2_ACCOUNT_ID")) if v), "")


def _http(url, tok, body=None, timeout=60):
    """(status, json). Fehlertexte werden nicht ausgegeben (kein Header im Log). Tests ersetzen diese Funktion."""
    rq = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None, method="POST" if body is not None else "GET",
                                headers={"Authorization": "Bearer " + tok, "Content-Type": "application/json", "User-Agent": "m365fm-actions/1.0"})
    try:
        with urllib.request.urlopen(rq, timeout=timeout) as r:
            return r.status, json.loads(r.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as e:
        try: return e.code, json.loads(e.read().decode("utf-8") or "{}")
        except Exception: return e.code, {}
    except Exception:
        return 0, {}


def mask(text, acc=""):
    """Konto-ID und andere 32-stellige Hex-Kennungen nie in den (oeffentlichen) Bericht."""
    s = str(text)
    if acc: s = s.replace(acc, "[Konto-ID]")
    return re.sub(r"\b[a-f0-9]{32}\b", "[ID]", s, flags=re.I)


def errtext(d):
    errs = (d or {}).get("errors") or []
    if not isinstance(errs, list): return str(errs)[:160]
    return "; ".join(str((e or {}).get("message", e))[:160] for e in errs[:3])


class CF:
    """Zugang mit Token-Rueckfall: jede Abfrage nimmt das erste Token, das sie ohne Fehler beantwortet."""

    def __init__(self, toks, acc, http=None):
        self.toks, self.acc, self.http = toks, acc, http or _http
        self.notes = []

    def note(self, msg):
        msg = mask(msg, self.acc); self.notes.append(msg)
        print(f"::notice title=Cloudflare-Verbrauch::{msg}" if os.environ.get("GITHUB_ACTIONS") else f"HINWEIS: {msg}", flush=True)

    def gql(self, query, variables, what):
        """-> data.viewer.accounts[0] oder None (mit Hinweis)."""
        last = ""
        for tok in self.toks:
            st, d = self.http(API + "/graphql", tok, {"query": query, "variables": {"a": self.acc, **variables}})
            err = errtext(d)
            accs = (((d or {}).get("data") or {}).get("viewer") or {}).get("accounts") if isinstance((d or {}).get("data"), dict) else None
            if st == 200 and not err and accs:
                return accs[0] or {}
            last = f"HTTP {st}" + (f": {err}" if err else "")
        self.note(f"{what} nicht abrufbar ({last or 'keine Antwort'}). {PERM_HINT}")
        return None

    def rest(self, method_path, body=None, what=""):
        last = ""
        for tok in self.toks:
            st, d = self.http(API + method_path, tok, body)
            if st == 200 and (d or {}).get("success", True) and not errtext(d):
                return d
            last = f"HTTP {st}" + (f": {errtext(d)}" if errtext(d) else "")
        if what: self.note(f"{what} nicht abrufbar ({last or 'keine Antwort'}).")
        return None


def classify(action):
    return "A" if action in CLASS_A else "B" if action in CLASS_B else "frei" if action in FREE else "?"


def days_window(days, today=None):
    """Volle UTC-Tage bis gestern: [erster, ..., gestern]."""
    today = today or dt.datetime.now(dt.timezone.utc).date()
    end = today - dt.timedelta(days=1)
    return [end - dt.timedelta(days=i) for i in range(days - 1, -1, -1)]


def num(n):
    return f"{int(n):,}".replace(",", ".")


def gb(n):
    return f"{(n or 0) / 1e9:.2f} GB"


def d1_names(cf):
    d = cf.rest(f"/accounts/{cf.acc}/d1/database?per_page=100", what="")
    return {x.get("uuid"): x.get("name") for x in ((d or {}).get("result") or []) if x.get("uuid")}


def d1_section(cf, days, names):
    acc = cf.gql(Q_D1, {"s": str(days[0]), "e": str(days[-1])}, "D1-Analytics (rowsRead/rowsWritten)")
    if acc is None: return ["## D1", "", "_nicht abrufbar - siehe Hinweis oben_", ""]
    per_day, per_db = {}, {}
    for g in acc.get("d1AnalyticsAdaptiveGroups") or []:
        dim, s = g.get("dimensions") or {}, g.get("sum") or {}
        day, db = dim.get("date"), names.get(dim.get("databaseId")) or ("Datenbank " + str(dim.get("databaseId") or "?")[:8])
        for tgt in (per_day.setdefault(day, {}), per_db.setdefault(db, {})):
            for k in ("rowsRead", "rowsWritten", "readQueries", "writeQueries"): tgt[k] = tgt.get(k, 0) + int(s.get(k) or 0)
    out = ["## D1 (alle Datenbanken des Kontos)", "", "| Tag | Zeilen gelesen | Zeilen geschrieben | Lese-Abfragen | Schreib-Abfragen |", "|---|---:|---:|---:|---:|"]
    for day in days:
        r = per_day.get(str(day), {})
        out.append(f"| {day} | {num(r.get('rowsRead', 0))} | {num(r.get('rowsWritten', 0))} | {num(r.get('readQueries', 0))} | {num(r.get('writeQueries', 0))} |")
    out += [""] + halves(days, lambda d: per_day.get(str(d), {}), ("rowsRead", "Zeilen gelesen"), ("rowsWritten", "Zeilen geschrieben"))
    out += ["", "| Datenbank | Zeilen gelesen | Zeilen geschrieben |", "|---|---:|---:|"]
    for db, r in sorted(per_db.items(), key=lambda kv: -kv[1].get("rowsRead", 0)):
        out.append(f"| {mask(db, cf.acc)} | {num(r.get('rowsRead', 0))} | {num(r.get('rowsWritten', 0))} |")
    return out + [""]


def halves(days, get, *fields):
    """Mittelwert je Tag: erste gegen zweite Haelfte des Zeitraums (vorher/nachher)."""
    if len(days) < 2: return []
    h = len(days) // 2; a, b = days[:h], days[h:]
    out = []
    for key, label in fields:
        ma = sum(get(d).get(key, 0) for d in a) / len(a); mb = sum(get(d).get(key, 0) for d in b) / len(b)
        ch = f"{(mb - ma) / ma * 100:+.0f} %" if ma else "-"
        out.append(f"- {label} je Tag: {a[0]}..{a[-1]} {num(ma)} -> {b[0]}..{b[-1]} {num(mb)} ({ch})")
    return out


def r2_section(cf, days):
    per_day, per_action = {}, {}
    for day in days:
        acc = cf.gql(Q_R2OPS, {"s": f"{day}T00:00:00Z", "e": f"{day}T23:59:59Z"}, "R2-Operationen")
        if acc is None: return ["## R2-Operationen", "", "_nicht abrufbar - siehe Hinweis oben_", ""]
        r = per_day.setdefault(str(day), {})
        for g in acc.get("r2OperationsAdaptiveGroups") or []:
            dim, n = g.get("dimensions") or {}, int((g.get("sum") or {}).get("requests") or 0)
            act, bucket = dim.get("actionType") or "?", dim.get("bucketName") or "?"
            c = classify(act); r[c] = r.get(c, 0) + n
            k = (bucket, act); per_action[k] = per_action.get(k, 0) + n
    out = ["## R2-Operationen (alle Buckets)", "", "| Tag | Class A | Class B | kostenlos | unbekannt |", "|---|---:|---:|---:|---:|"]
    for day in days:
        r = per_day.get(str(day), {})
        out.append(f"| {day} | {num(r.get('A', 0))} | {num(r.get('B', 0))} | {num(r.get('frei', 0))} | {num(r.get('?', 0))} |")
    out += [""] + halves(days, lambda d: per_day.get(str(d), {}), ("A", "Class A"), ("B", "Class B"))
    out += ["", "| Bucket | actionType | Klasse | Anfragen (Zeitraum) |", "|---|---|---|---:|"]
    for (bucket, act), n in sorted(per_action.items(), key=lambda kv: -kv[1])[:40]:
        out.append(f"| {mask(bucket, cf.acc)} | {act} | {classify(act)} | {num(n)} |")
    return out + [""]


def storage_section(cf, day):
    acc = cf.gql(Q_R2STORE, {"s": f"{day}T00:00:00Z", "e": f"{day}T23:59:59Z"}, "R2-Speicher")
    if acc is None: return ["## R2-Speicher", "", "_nicht abrufbar - siehe Hinweis oben_", ""]
    out = [f"## R2-Speicher ({day})", "", "| Bucket | Daten | Objekte |", "|---|---:|---:|"]
    rows = acc.get("r2StorageAdaptiveGroups") or []
    for g in sorted(rows, key=lambda g: -int((g.get("max") or {}).get("payloadSize") or 0)):
        m = g.get("max") or {}
        out.append(f"| {mask((g.get('dimensions') or {}).get('bucketName') or '?', cf.acc)} | {gb(int(m.get('payloadSize') or 0) + int(m.get('metadataSize') or 0))} | {num(m.get('objectCount') or 0)} |")
    if not rows: out.append("| - | - | - |")
    return out + [""]


def cron_section(cf, names, since_ts, label):
    uuid = next((u for u, n in names.items() if n == DB_NAME), "")
    if not uuid:
        cf.note(f"D1-Zeilen je Cron-Aufgabe: Datenbank {DB_NAME} nicht gefunden (Recht 'D1: Read' fehlt?) - Abschnitt ausgelassen.")
        return []
    d = cf.rest(f"/accounts/{cf.acc}/d1/database/{uuid}/query", {"sql": CRON_SQL, "params": [int(since_ts)]}, what="D1-Zeilen je Cron-Aufgabe (cron_runs)")
    res = (d or {}).get("result") or []
    rows = (res[0] or {}).get("results") if res and isinstance(res[0], dict) else None
    if rows is None: return []
    out = [f"## D1-Zeilen je Cron-Aufgabe ({label}, cron_runs rr/rw)", "",
           "Nur protokollierte Laeufe; uebersprungene Laeufe ohne Schreibzugriff fehlen (track(), worker/src/index.js).", "",
           "| Aufgabe | Laeufe | Zeilen gelesen | Zeilen geschrieben |", "|---|---:|---:|---:|"]
    for r in rows:
        out.append(f"| {mask(r.get('name') or '?', cf.acc)} | {num(r.get('n') or 0)} | {num(r.get('rr') or 0)} | {num(r.get('rw') or 0)} |")
    if not rows: out.append("| - | 0 | 0 | 0 |")
    return out + [""]


def report(days=14, http=None, today=None):
    """-> (markdown, notes). Wirft nie wegen Rechten oder Netz."""
    toks, acc = tokens(), account()
    head = ["# Cloudflare-Verbrauch (D1, R2)", ""]
    if not toks or not acc:
        msg = ("Kein Cloudflare-Token (CF_ANALYTICS_TOKEN oder CLOUDFLARE_API_TOKEN)" if not toks else "Keine Konto-ID (CF_ACCOUNT_ID, CLOUDFLARE_ACCOUNT_ID oder R2_ACCOUNT_ID)") + " - nichts gemessen."
        cf = CF([], acc); cf.note(msg)
        return "\n".join(head + [f"_{msg}_", ""]), cf.notes
    cf = CF(toks, acc, http)
    win = days_window(days, today)
    head += [f"Zeitraum: {win[0]} bis {win[-1]} (UTC, {len(win)} volle Tage). Vergleich: erste gegen zweite Haelfte.", ""]
    names = d1_names(cf)
    body = d1_section(cf, win, names) + r2_section(cf, win) + storage_section(cf, win[-1])
    since = dt.datetime.combine(win[-1] - dt.timedelta(days=6), dt.time(0), tzinfo=dt.timezone.utc).timestamp()
    body += cron_section(cf, names, since, f"{win[-1] - dt.timedelta(days=6)} bis heute")
    if cf.notes: head += ["> Hinweise: " + " / ".join(cf.notes), ""]
    return "\n".join(head + body), cf.notes


def main(argv=None):
    args = list(sys.argv[1:] if argv is None else argv)
    opt = lambda n, d=None: args[args.index(n) + 1] if n in args and args.index(n) + 1 < len(args) else d
    try: days = max(2, min(int(opt("--days", "14")), 31))
    except ValueError: days = 14
    md, _ = report(days)
    out = opt("--out") or os.environ.get("GITHUB_STEP_SUMMARY")
    if out:
        with open(out, "a", encoding="utf-8") as f: f.write(md + "\n")
        print(f"Bericht in {os.path.basename(out)} geschrieben ({md.count(chr(10)) + 1} Zeilen).")
    else:
        print(md)
    return 0


if __name__ == "__main__":
    sys.exit(main())
