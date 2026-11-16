#!/usr/bin/env python3
"""Langsame Seiten fuer echte Nutzer finden (Cloudflare Web Analytics, Web Vitals) - Vorstufe fuer den Lighthouse-Labortest.

Woechentliche Routine (Dienstag): Dieses Werkzeug zeigt, welche Seiten bei echten Besuchern langsam sind (p75 je Pfad und Geraet);
nur diese wenigen Pfade gehen danach in den CRP-Check (.github/workflows/crp-check.yml, Eingabe "paths").

Datenquelle: GraphQL auf Kontoebene, viewer.accounts(filter:{accountTag}).rumWebVitalsEventsAdaptiveGroups, gefiltert auf den siteTag
(Zugang, Token, Konto und siteTag aus tools/cf_rum.py). Felder:
  dimensions { requestPath deviceType }, count (hochgerechnet), avg { sampleInterval } (Messungen = count / sampleInterval), quantiles { largestContentfulPaintP75 interactionToNextPaintP75
  cumulativeLayoutShiftP75 firstContentfulPaintP75 } - Zeiten in MIKROSEKUNDEN, negativ = nicht gemessen; CLS ohne Einheit.
Die Feldnamen werden vor der Abfrage per GraphQL-Introspektion geprueft (INP faellt auf firstInputDelayP75 zurueck, TTFB nur, wenn
timeToFirstByteP75 im Schema steht); ist die Introspektion gesperrt, gelten die oeffentlich belegten Felder oben (Hinweis in der Ausgabe).

Bewertung nach Google (p75): LCP gut <= 2500 ms, schlecht > 4000 ms; INP gut <= 200 ms, schlecht > 500 ms; CLS gut <= 0,1, schlecht > 0,25.
Rangfolge: schlechteste Bewertung (ueber LCP/INP/CLS) zuerst, darin hoeheres p75-LCP zuerst.

Ausgabe (stdout): Markdown-Tabellen (Seiten, gleiche Seite ueber alle Sprachen, Seitentypen), letzte Zeile "CRP_PATHS: <Pfade>"
(Top N, nur ueber "gut", bei gleicher Bewertung mobil zuerst). Hat keine einzelne Seite genug Messungen (bei 10-%-Stichprobe der
Normalfall), kommen die Pfade aus den langsamen Seitentypen: je Typ die meistgemessene Seite. /admin und /cdn-cgi bleiben aussen vor,
Pfade mit Leerzeichen oder * ? [ ] kommen nie in CRP_PATHS (crp-check.yml zerlegt "paths" unquotiert). Erreicht die Abfrage --limit
Gruppen, warnt der Bericht (seltene Pfade abgeschnitten).
Lauf: python tools/slow_pages.py [--days 7] [--top 3] [--min-samples 20]
"""
import argparse
import datetime as dt
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools import cf_rum  # noqa: E402

DATASET = "rumWebVitalsEventsAdaptiveGroups"
# Kennzahl -> (Kandidaten im Schema in Reihenfolge, Einheit). Erste vorhandene gewinnt.
METRICS = (
    ("lcp", ("largestContentfulPaintP75",), "us"),
    ("inp", ("interactionToNextPaintP75", "firstInputDelayP75"), "us"),
    ("cls", ("cumulativeLayoutShiftP75",), "score"),
    ("fcp", ("firstContentfulPaintP75",), "us"),
    ("ttfb", ("timeToFirstByteP75",), "us"),
)
# Ohne Introspektion: nur Felder, die in oeffentlichen Beispielabfragen gegen diesen Datensatz belegt sind
VERIFIED = {"largestContentfulPaintP75", "interactionToNextPaintP75", "cumulativeLayoutShiftP75", "firstContentfulPaintP75"}
THRESHOLDS = {"lcp": (2500, 4000), "inp": (200, 500), "cls": (0.1, 0.25)}   # (gut <=, schlecht >), Google Core Web Vitals
RATING = {0: "gut", 1: "verbesserungswürdig", 2: "schlecht"}
# Sprachpraefixe der Website (Englisch ohne Praefix), wie entity_fill_data.LANGS14
LANGS = ("de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")
LANG_RE = re.compile(r"^/(%s)(?=/|$)" % "|".join(LANGS))
DEVICE_ORDER = {"mobile": 0, "tablet": 1, "desktop": 2}
EXCLUDE_RE = re.compile(r"^/(admin|cdn-cgi)(/|$)")   # nicht oeffentlich / Cloudflare-intern: kein Ziel fuer den Labortest
# crp-check.yml zerlegt die Eingabe "paths" unquotiert ("for p in $PATHS_IN"): Leerzeichen trennen, * ? [ ] wuerden als Glob erweitert
UNSAFE_RE = re.compile(r"[\s*?\[\]]")


# ---------- Schema ----------

TYPE_Q = "query($n:String!){__type(name:$n){fields{name type{name kind ofType{name kind ofType{name kind ofType{name kind}}}}}}}"


def _named(t):
    while isinstance(t, dict) and not t.get("name"): t = t.get("ofType")
    return (t or {}).get("name")


def _fields(rum, name):
    st, d = rum.graphql(TYPE_Q, {"n": name})
    t = ((d or {}).get("data") or {}).get("__type") if st == 200 else None
    if not isinstance(t, dict): raise cf_rum.RumError(f"Introspektion fuer {name} nicht moeglich (HTTP {st})")
    return {f["name"]: _named(f.get("type")) for f in t.get("fields") or []}


def schema(rum):
    """{'quantiles': set, 'dimensions': set, 'avg': set} des Web-Vitals-Datensatzes per Introspektion; None, wenn Introspektion nicht geht.
    Wirft RumError, wenn der Datensatz im Schema fehlt."""
    try:
        st, d = rum.graphql("{__schema{queryType{name}}}")
        root = ((((d or {}).get("data") or {}).get("__schema") or {}).get("queryType") or {}).get("name") if st == 200 else None
        if not root: return None
        viewer = _fields(rum, root).get("viewer")
        account = _fields(rum, viewer).get("accounts") if viewer else None
        grp = _fields(rum, account).get(DATASET) if account else None
        if account and not grp: raise LookupError
        if not grp: return None
        g = _fields(rum, grp)
        return {k: set(_fields(rum, g[k])) if g.get(k) else set() for k in ("quantiles", "dimensions", "avg")}
    except LookupError:
        raise cf_rum.RumError(f"Datensatz {DATASET} fehlt im GraphQL-Schema des Kontos")
    except cf_rum.RumError:
        return None


def pick_fields(sch):
    """-> ({kennzahl: feldname}, device_dimension: bool, sampling: bool, bestaetigt: bool)."""
    avail = sch["quantiles"] if sch else VERIFIED
    fields = {}
    for key, cands, _ in METRICS:
        f = next((c for c in cands if c in avail), None)
        if f: fields[key] = f
    if "lcp" not in fields: raise cf_rum.RumError("largestContentfulPaintP75 fehlt in den Quantilen des Web-Vitals-Datensatzes")
    device = ("deviceType" in sch["dimensions"]) if sch else True
    sampling = ("sampleInterval" in sch.get("avg", set())) if sch else True
    return fields, device, sampling, sch is not None


def build_query(fields, device, limit, sampling=True):
    dims = "requestPath deviceType" if device else "requestPath"
    return ("query($a:String!,$t:String!,$s:Time!,$u:Time!){viewer{accounts(filter:{accountTag:$a}){"
            f"{DATASET}(limit:{int(limit)},orderBy:[count_DESC],filter:{{siteTag:$t,datetime_geq:$s,datetime_lt:$u}})"
            f"{{count {'avg{sampleInterval} ' if sampling else ''}dimensions{{{dims}}} quantiles{{{' '.join(fields.values())}}}}}"
            "}}}")


# ---------- Auswertung ----------

def norm_path(p):
    """Pfad ohne Host, Query und Fragment; /index.html -> /; doppelte Schraegstriche zusammengefasst."""
    p = re.sub(r"^https?://[^/]+", "", str(p or "").strip())
    p = re.split(r"[?#]", p, maxsplit=1)[0] or "/"
    if not p.startswith("/"): p = "/" + p
    p = re.sub(r"/{2,}", "/", p)
    p = re.sub(r"/index\.html?$", "/", p)
    return p


def strip_lang(p):
    """('/show/x/', 'de') fuer '/de/show/x/'; Englisch -> 'en'."""
    m = LANG_RE.match(p)
    return ((p[m.end():] or "/"), m.group(1)) if m else (p, "en")


def _val(v, unit):
    """Mikrosekunden -> ms; negativ/leer = nicht gemessen (None)."""
    try: v = float(v)
    except (TypeError, ValueError): return None
    if v < 0: return None
    return v / 1000.0 if unit == "us" else v


def rate(key, v):
    if v is None or key not in THRESHOLDS: return None
    good, poor = THRESHOLDS[key]
    return 0 if v <= good else (2 if v > poor else 1)


def _merge(rows, keyf):
    """Zeilen mit gleichem Schluessel zusammenlegen: Messungen addiert, p75 nach hochgerechneten Aufrufen gewichtet gemittelt (Naeherung)."""
    out = {}
    for r in rows:
        k = keyf(r)
        m = out.setdefault(k, {"path": r["path"], "device": r["device"], "count": 0, "samples": 0, "langs": set(), "_w": {}, "_n": {}})
        m["count"] += r["count"]; m["samples"] += r["samples"]; m["langs"] |= r.get("langs") or set()
        for key, *_ in METRICS:
            if r.get(key) is not None:
                m["_w"][key] = m["_w"].get(key, 0.0) + r[key] * r["count"]; m["_n"][key] = m["_n"].get(key, 0) + r["count"]
    for m in out.values():
        for key, *_ in METRICS: m[key] = (m["_w"][key] / m["_n"][key]) if m["_n"].get(key) else None
        del m["_w"], m["_n"]
        finish(m)
    return list(out.values())


def finish(r):
    rs = {k: rate(k, r.get(k)) for k in THRESHOLDS}
    worst = max((v for v in rs.values() if v is not None), default=None)
    r["severity"] = worst if worst is not None else -1
    r["rating"] = "-" if worst is None else RATING[worst] + (f" ({', '.join(k.upper() for k, v in rs.items() if v == worst)})" if worst else "")
    return r


def rank_key(r):
    return (-r["severity"], -(r.get("lcp") or 0), -r["samples"], DEVICE_ORDER.get(r["device"], 9), r["path"])


def parse(acc, fields):
    """GraphQL-Gruppen -> normalisierte, zusammengelegte Zeilen je (Pfad, Geraet)."""
    units = {k: u for k, _, u in METRICS}
    raw = []
    for g in acc.get(DATASET) or []:
        dims, q = g.get("dimensions") or {}, g.get("quantiles") or {}
        path = norm_path(dims.get("requestPath"))
        if EXCLUDE_RE.match(strip_lang(path)[0]): continue
        count = int(g.get("count") or 0)
        try: si = max(1.0, float((g.get("avg") or {}).get("sampleInterval") or 1))
        except (TypeError, ValueError): si = 1.0
        # count ist bei Adaptive-Datensaetzen hochgerechnet (count = Beacons x sampleInterval); Mindestmessungen gelten fuer echte Beacons
        r = {"path": path, "device": str(dims.get("deviceType") or "alle").lower(), "count": count,
             "samples": max(1, round(count / si)) if count else 0, "langs": {strip_lang(path)[1]}}
        for key, f in fields.items(): r[key] = _val(q.get(f), units[key])
        if r["count"] > 0: raw.append(r)
    return _merge(raw, lambda r: (r["path"], r["device"]))


def page_type(path):
    """Seitentyp ohne Sprachpraefix: '/' -> Startseite; '/entity/' bleibt; '/entity/x/' -> '/entity/*';
    ab drei Segmenten die ersten zwei: '/show/episodes/x/' -> '/show/episodes/*', '/community/u/a/blog/b/' -> '/community/u/*'."""
    p, _ = strip_lang(path)
    seg = [s for s in p.split("/") if s]
    if not seg: return "/ (Startseite)"
    if len(seg) == 1: return f"/{seg[0]}/"
    return "/" + "/".join(seg[:1 if len(seg) == 2 else 2]) + "/*"


def _worst_first(rows):
    """Nur Zeilen ueber 'gut'; schlechteste Bewertung zuerst, bei gleicher Bewertung mobil zuerst, sonst Rang (stabil)."""
    return sorted((r for r in rows if r["severity"] >= 1), key=lambda r: (-r["severity"], r["device"] != "mobile"))


def crp_paths(ranked, top, types=(), rows=()):
    """Top-N-Pfade fuer den Labortest -> [(pfad, grund)], jeder Pfad einmal.
    1. einzelne Seiten mit genug Messungen ueber 'gut' (ranked);
    2. reicht das nicht (wenig Verkehr je Seite), je langsamem Seitentyp die meistgemessene Seite dieses Typs und Geraets.
    Pfade mit Leerzeichen oder Glob-Zeichen (UNSAFE_RE) bleiben aussen vor - sie wuerden die Eingabe "paths" von crp-check.yml zerlegen."""
    out = []
    for r in _worst_first(ranked):
        if len(out) >= top: break
        if r["path"] not in (p for p, _ in out) and not UNSAFE_RE.search(r["path"]):
            out.append((r["path"], f"Seite: {r['rating']}, {r['device']}"))
    for t in _worst_first(types):
        if len(out) >= top: break
        cands = sorted((r for r in rows if page_type(r["path"]) == t["path"] and r["device"] == t["device"]
                        and r["path"] not in (p for p, _ in out) and not UNSAFE_RE.search(r["path"])),
                       key=lambda r: (-r["samples"], -(r.get("lcp") or 0), r["path"]))
        if cands: out.append((cands[0]["path"], f"Seitentyp {t['path']}: {t['rating']}, {t['device']} "
                                                f"(meistgemessene Seite, {cands[0]['samples']} von {t['samples']} Messungen des Typs)"))
    return out


# ---------- Ausgabe ----------

def _ms(v):
    if v is None: return "–"
    return f"{v / 1000:.2f} s".replace(".", ",") if v >= 1000 else f"{v:.0f} ms"


def _cls(v):
    return "–" if v is None else f"{v:.3f}".replace(".", ",")


def _table(rows, fields, first_col="Seite", extra=None):
    cols = [("lcp", "LCP p75", _ms), ("inp", "INP p75" if fields.get("inp", "").startswith("interaction") else "FID p75", _ms),
            ("cls", "CLS p75", _cls), ("fcp", "FCP p75", _ms), ("ttfb", "TTFB p75", _ms)]
    cols = [c for c in cols if c[0] in fields]
    head = ["#", first_col, "Gerät", "Messungen", "Aufrufe (hochger.)"] + [c[1] for c in cols] + ([extra[0]] if extra else []) + ["Bewertung"]
    lines = ["| " + " | ".join(head) + " |", "|" + "---|" * len(head)]
    for i, r in enumerate(rows, 1):
        cells = [str(i), f"`{r['path']}`", r["device"], str(r["samples"]), str(r["count"])] + [f(r.get(k)) for k, _, f in cols]
        if extra: cells.append(extra[1](r))
        cells.append(r["rating"])
        lines.append("| " + " | ".join(cells) + " |")
    return lines


def report(rows, fields, device, confirmed, since, until, clamped, min_samples, top, max_rows=25, sampling=True, truncated=0):
    out = ["## Langsame Seiten bei echten Nutzern (Cloudflare Web Analytics)", ""]
    n = (until - since).days + 1
    out.append(f"Zeitraum: {since} bis {until} ({n} {'Tag' if n == 1 else 'Tage'}, UTC)"
               + (f" – gekürzt auf den Start von Web Analytics am {cf_rum.RUM_START}" if clamped else "")
               + f" · mindestens {min_samples} Messungen (echte Beacons) je Seite und Gerät"
               + ("" if device else " · ohne Geräte-Aufteilung (Dimension deviceType fehlt im Schema)"))
    out.append("Grenzwerte (Google, p75): LCP gut ≤ 2,5 s, schlecht > 4 s · INP gut ≤ 200 ms, schlecht > 500 ms · CLS gut ≤ 0,1, schlecht > 0,25")
    out.append(f"Felder: {', '.join(fields.values())} "
               + ("(per Schema-Introspektion bestätigt)" if confirmed else "(Introspektion nicht möglich – öffentlich belegte Feldnamen)"))
    if not sampling: out.append("Hinweis: avg.sampleInterval fehlt im Schema – Messungen = hochgerechnete Aufrufe (Stichprobe nicht herausrechenbar).")
    if truncated:
        out.append(f"**Achtung: Abfragegrenze erreicht ({truncated} Gruppen).** Die seltensten Pfade fehlen, Seitentypen und Sprachsummen "
                   "sind dadurch verzerrt – `--limit` erhöhen oder `--days` senken.")
    out.append("")
    total, beacons = sum(r["count"] for r in rows), sum(r["samples"] for r in rows)
    kept = sorted((r for r in rows if r["samples"] >= min_samples), key=rank_key)
    if not rows:
        out += ["**Keine Web-Vitals-Messungen im Zeitraum.** (Datensatz leer – Web Analytics aktiv? Beacon auf den Seiten?)", "", "CRP_PATHS:"]
        return "\n".join(out)
    out.append(f"{beacons} Messungen (hochgerechnet {total} Aufrufe) auf {len({r['path'] for r in rows})} Pfaden; "
               f"{len(kept)} Zeilen (Pfad × Gerät) mit genug Messungen, {sum(1 for r in rows if r['samples'] < min_samples)} ausgelassen. "
               "p75 einer Seite ist erst ab einigen Dutzend Messungen belastbar.")
    out.append("")
    if kept:
        out += [f"### Rangliste (Top {min(max_rows, len(kept))} von {len(kept)})", ""] + _table(kept[:max_rows], fields) + [""]
    else:
        out += [f"Keine Seite erreicht {min_samples} Messungen – `--min-samples` senken oder `--days` erhöhen.", ""]
    # Nur Anzeige: gleiche Seite ueber alle Sprachen zusammengefasst
    merged = _merge([dict(r, path=strip_lang(r["path"])[0]) for r in rows], lambda r: (r["path"], r["device"]))
    merged = sorted((m for m in merged if m["samples"] >= min_samples and len(m["langs"]) > 1), key=rank_key)
    if merged:
        out += ["### Gleiche Seite, alle Sprachen zusammen (nur Anzeige, p75 gewichtet genähert)", ""]
        out += _table(merged[:10], fields, "Seite ohne Sprachpräfix", ("Sprachen", lambda r: " ".join(sorted(r["langs"])))) + [""]
    types = sorted((m for m in _merge([dict(r, path=page_type(r["path"])) for r in rows], lambda r: (r["path"], r["device"]))
                    if m["samples"] >= min_samples), key=rank_key)
    if types:
        out += ["### Seitentypen (alle Sprachen, p75 gewichtet genähert)", ""] + _table(types[:15], fields, "Seitentyp") + [""]
    picks = crp_paths(kept, top, types, rows)
    if picks:
        out += [f"### Für den CRP-Check (crp-check.yml, Eingabe „paths“): {len(picks)} Pfad(e)", "",
                "Schlechteste Bewertung zuerst, bei gleicher Bewertung mobil zuerst; erst einzelne Seiten mit genug Messungen, "
                "dann je langsamem Seitentyp die meistgemessene Seite.", ""]
        out += [f"- `{p}` – {why}" for p, why in picks]
    else:
        out.append("Keine Seite und kein Seitentyp mit genug Messungen liegt über „gut“ – diese Woche ist kein Labortest nötig.")
    out += ["", "CRP_PATHS: " + " ".join(p for p, _ in picks)]
    return "\n".join(out)


def run(days=7, top=3, min_samples=20, limit=5000, today=None, rum=None):
    """limit = max. Gruppen (Pfad x Geraet, orderBy count_DESC); wird es erreicht, warnt der Bericht (seltene Pfade abgeschnitten)."""
    today = today or dt.datetime.now(dt.timezone.utc).date()
    until = today - dt.timedelta(days=1)                      # nur abgeschlossene Tage
    since, until, clamped = cf_rum.clamp(until - dt.timedelta(days=max(1, days) - 1), until)
    if since is None:
        return (f"## Langsame Seiten\n\nZeitraum liegt vollständig vor dem Start von Web Analytics ({cf_rum.RUM_START}) – keine Daten.\n\nCRP_PATHS:")
    rum = rum or cf_rum.Rum.connect()
    fields, device, sampling, confirmed = pick_fields(schema(rum))
    acc = rum.query(build_query(fields, device, limit, sampling), since, until)
    n = len(acc.get(DATASET) or [])
    if n >= limit: cf_rum.warn(f"Abfragegrenze erreicht: {n} Gruppen (limit {limit}) - seltene Pfade fehlen, Seitentypen verzerrt")
    return report(parse(acc, fields), fields, device, confirmed, since, until, clamped, min_samples, top, sampling=sampling,
                  truncated=n if n >= limit else 0)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--days", type=int, default=7)
    ap.add_argument("--top", type=int, default=3)
    ap.add_argument("--min-samples", type=int, default=20)
    ap.add_argument("--limit", type=int, default=5000, help="max. Gruppen (Pfad × Gerät) aus der API")
    a = ap.parse_args(argv)
    try:
        print(run(a.days, a.top, a.min_samples, a.limit), flush=True)
    except cf_rum.RumError as e:
        cf_rum.warn(str(e))
        print(f"## Langsame Seiten\n\n**Abfrage fehlgeschlagen:** {e}\n\nCRP_PATHS:", flush=True)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
