#!/usr/bin/env python3
"""T37 Sponsor: Belegzahlen fuer /sponsor/ pflegen (data/stats/ai_performance.json), monatlich per .github/workflows/ai-stats.yml.

Quellen
- bing_ai: Bing Webmaster Tools, AI Performance (Zitate in Microsoft Copilot und Partnern). Dafuer gibt es keine API (Stand 11/2026),
  deshalb kommen die Werte aus dem monatlichen Export von Hand: Workflow-Eingaben bing_* bzw. Umgebung BING_* bzw. Argumente --bing-*.
  citations, pages_per_day, from und to nur zusammen; weekly und retrieved sind optional.
- gsc: Google Search Console, Search Analytics (Websuche), letzte 3 volle Kalendermonate (am 1. bis 3. eines Monats gilt der Vormonat
  noch nicht als endgueltig und zaehlt nicht mit). Dienstkonto aus GSC_SERVICE_ACCOUNT_JSON (Secret), Property aus GSC_SITE
  (Repo-Variable, Standard sc-domain:m365.fm). HTTP nur mit der Standardbibliothek; fuer die JWT-Signatur (RS256) braucht es das
  Paket cryptography (installiert der Workflow).

Verhalten
- Fehlt das Secret, antwortet die API mit einem Fehler (z. B. 403: Dienstkonto nicht als Nutzer der Property eingetragen) oder liefert
  sie keine Zeilen: alte Werte bleiben stehen, status und note werden gesetzt, Exit 0 (Lauf bleibt gruen).
- Ungueltige Handeingaben oder Daten, die die Pruefung nicht bestehen (auch eine von Hand kaputt editierte Datei, auch
  topic_difficulty.json): Exit 1, es wird nichts geschrieben.
- Geschrieben wird nur bei inhaltlicher Aenderung; dann wird "updated" auf heute gesetzt. Secrets werden nie ausgegeben.
- Ausgaben als GitHub-Annotationen (::notice::/::warning::/::error::) und kurze Tabelle in GITHUB_STEP_SUMMARY.

Dateivertrag (site_sponsor.py liest diese Felder; nicht umbenennen)
data/stats/ai_performance.json
  version               1
  _doc                  Hinweistext
  updated               "YYYY-MM-DD", letzte inhaltliche Aenderung durch dieses Werkzeug (oder null)
  bing_ai               Karten "Copilot-Zitate" und "zitierte Seiten pro Tag", Wochen-Diagramm
    status              "ok" | "empty" (die Seite zeigt die Karten nur bei "ok")
    source              "Bing Webmaster Tools, AI Performance (Microsoft Copilot and partners)"
    period              {"from": "YYYY-MM-DD", "to": "YYYY-MM-DD"}  Zeitraum der Zahlen (oder null)
    retrieved           "YYYY-MM-DD"  Datum des Exports = Stand (oder null)
    entered             "manual"
    citations           int   Zitate im Zeitraum
    cited_pages_per_day int   zitierte Seiten pro Tag im Mittel (gerundet)
    weekly              [["YYYY-MM-DD", int], ...]  Datum = Wochenbeginn, aufsteigend, jede Woche beruehrt den Zeitraum
  gsc                   Karte "Google-Suche" nur bei status "ok"
    status              "ok" | "missing_secret" | "error" | "empty"
    source              "Google Search Console, Search Analytics (web search)"
    property            z. B. "sc-domain:m365.fm"
    period              {"from", "to"} letzte 3 volle Monate (oder null)
    retrieved           "YYYY-MM-DD" (oder null)
    entered             "api"
    clicks, impressions int (oder null)
    ctr                 0..1, 4 Nachkommastellen (oder null)
    position            mittlere Position, 1 Nachkommastelle (oder null)
    pages               Zahl der Seiten mit mindestens einer Impression im Zeitraum (oder null)
    pages_clicked       Zahl der Seiten mit mindestens einem Klick (oder null)
    note                Hinweis zum letzten Lauf ("" wenn alles ok), ohne Secrets
  Unbekannte Felder bleiben erhalten.
data/stats/topic_difficulty.json (nur geprueft, nicht veraendert; keine Bewertungsmethode und keine NeuronWriter-Daten vorhanden)
  version 1, example (bool; solange true zeigt die Seite "Beispiel"), updated "YYYY-MM-DD", levels {"Thema": 1..4}
  (1 easy, 2 medium, 3 hard, 4 very hard; Schluessel = Themenname wie im Prototyp oder Entitaets-ID, Gross/Klein egal)

Formate der Handeingabe
- Zahlen: 1100000, 1,100,000, 1.100.000, 1 100 000 oder 1.1M / 950K; pages_per_day auch mit Dezimalstelle (621.7 -> 622).
- Datum: YYYY-MM-DD; in weekly ausserdem TT.MM.JJJJ und M/T/JJJJ (US-Export).
- weekly einzeilig (Workflow-Feld): "2026-08-03=62300, 2026-08-10=65400" (auch ";" / Leerzeichen / ":" als Trenner).
  weekly mehrzeilig: CSV-Text des Zeitreihen-Exports (Trenner Tab, ";" oder ","; Kopfzeile optional, Spalte mit "Citations"/"Zitate"
  wird bevorzugt, sonst die erste Zahl nach dem Datum). Tageswerte werden zu Wochen ab Montag summiert, angeschnittene Wochen fallen weg.
- Fehlt weekly, bleiben die bisherigen Wochenwerte stehen, soweit sie im neuen Zeitraum liegen.

Aufruf: python tools/update_ai_stats.py [--dry-run] [--skip-gsc] [--data-dir DIR] [--bing-citations N --bing-pages-per-day N
        --bing-from YYYY-MM-DD --bing-to YYYY-MM-DD [--bing-weekly TEXT] [--bing-retrieved YYYY-MM-DD]]
Test:   python tools/test_update_ai_stats.py"""
import argparse, base64, csv, json, os, re, sys, time, urllib.error, urllib.parse, urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STATS = ROOT / "data" / "stats"
AI_FILE, DIFF_FILE = "ai_performance.json", "topic_difficulty.json"
STATUSES = ("ok", "missing_secret", "error", "empty")
BING_SOURCE = "Bing Webmaster Tools, AI Performance (Microsoft Copilot and partners)"
GSC_SOURCE = "Google Search Console, Search Analytics (web search)"
GSC_DEFAULT_SITE = "sc-domain:m365.fm"
GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
GSC_API = "https://searchconsole.googleapis.com/webmasters/v3/sites/{site}/searchAnalytics/query"
TOKEN_URIS = ("https://oauth2.googleapis.com/token", "https://accounts.google.com/o/oauth2/token")
PAGE_ROWS, PAGE_MAX_REQ = 25000, 8        # Seiten zaehlen: hoechstens 8 Abrufe = 200.000 URLs
FINAL_LAG_DAYS = 3                        # bis zum 3. gilt der Vormonat in der Search Console noch nicht als endgueltig
DUE_DAYS = 35                             # aelterer Bing-Export -> Hinweis "neuer Export faellig"
WEEKLY_TOLERANCE = 1.25                   # Summe der Wochenwerte darf citations um hoechstens 25 % uebersteigen
RETRY_WAIT = (5, 15)                      # Wartezeiten bei 429/5xx/Netzfehlern
BING_KEYS = ("status", "source", "period", "retrieved", "entered", "citations", "cited_pages_per_day", "weekly")
GSC_KEYS = ("status", "source", "property", "period", "retrieved", "entered", "clicks", "impressions", "ctr", "position", "pages",
            "pages_clicked", "note")
INPUTS = {   # Feld: (Umgebungsvariable = Workflow-Eingabe in Grossbuchstaben, Name der Workflow-Eingabe)
    "citations": ("BING_CITATIONS", "bing_citations"), "pages": ("BING_PAGES_PER_DAY", "bing_pages_per_day"),
    "from": ("BING_FROM", "bing_from"), "to": ("BING_TO", "bing_to"), "weekly": ("BING_WEEKLY", "bing_weekly"),
    "retrieved": ("BING_RETRIEVED", "bing_retrieved")}
DOC = ("Belegzahlen fuer /sponsor/ (T37). Pflege: .github/workflows/ai-stats.yml mit tools/update_ai_stats.py (Felder im Kopf des "
       "Werkzeugs). bing_ai: Bing Webmaster Tools AI Performance, keine API, Werte aus dem monatlichen Export per Workflow-Eingaben. "
       "gsc: Google Search Console per Dienstkonto. Nur Summen, keine Suchanfragen oder Einzel-URLs.")
SLEEP = time.sleep


class Invalid(ValueError):
    """Ungueltige Eingabe oder Daten: Lauf scheitert, nichts wird geschrieben."""


class ApiError(Exception):
    def __init__(self, code, msg):
        super().__init__(f"HTTP {code}: {msg}" if code else msg)
        self.code = code


class Missing(Exception):
    """Paket cryptography fehlt."""


# ---- Zahlen und Daten ----
INT_RX = re.compile(r"\d{1,3}(?:([,.'   ’])\d{3})(?:\1\d{3})*|\d+")
SUFFIX_RX = re.compile(r"(\d+(?:[.,]\d+)?)\s*([kKmM])")
DEC_RX = re.compile(r"(\d+)[.,](\d{1,2})")
DATE_RX = (r"(?:(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ]\d{1,2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?"
           r"|(\d{1,2})\.(\d{1,2})\.(\d{4})|(\d{1,2})/(\d{1,2})/(\d{4}))")
DATE_FULL, DATE_ANY = re.compile(rf"\s*{DATE_RX}\s*"), re.compile(DATE_RX)


def parse_int(s, what):
    """Ganze Zahl >= 0 aus Handeingabe: Tausendertrenner , . ' Leerzeichen; Suffix K/M (1.1M)."""
    t = str(s).strip().strip('"').strip()
    m = SUFFIX_RX.fullmatch(t)
    if m:
        return int(round(float(m.group(1).replace(",", ".")) * (1000 if m.group(2) in "kK" else 1000000)))
    if not INT_RX.fullmatch(t):
        raise Invalid(f"{what}: '{t[:40]}' ist keine ganze Zahl >= 0")
    return int(re.sub(r"\D", "", t))


def parse_avg(s, what):
    """Mittelwert >= 0, wird auf eine ganze Zahl gerundet (621.7 -> 622); 1.234 gilt als Tausendertrenner."""
    t = str(s).strip().strip('"').strip()
    m = DEC_RX.fullmatch(t)
    if m:
        v = float(f"{m.group(1)}.{m.group(2)}")
        return int(v + 0.5)
    return parse_int(t, what)


def _date_of(m):
    g = m.groups()
    try:
        if g[0]: return date(int(g[0]), int(g[1]), int(g[2]))
        if g[3]: return date(int(g[5]), int(g[4]), int(g[3]))      # TT.MM.JJJJ
        return date(int(g[8]), int(g[6]), int(g[7]))                # M/T/JJJJ (US)
    except ValueError:
        return None


def cell_date(s):
    m = DATE_FULL.fullmatch(str(s).strip().strip('"'))
    return _date_of(m) if m else None


def iso(s, what, today=None):
    t = str(s or "").strip()
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", t):
        raise Invalid(f"{what}: '{t[:20]}' ist kein Datum YYYY-MM-DD")
    try:
        d = date.fromisoformat(t)
    except ValueError:
        raise Invalid(f"{what}: '{t}' ist kein gueltiges Datum") from None
    if today and d > today:
        raise Invalid(f"{what}: {t} liegt in der Zukunft")
    return d


# ---- Wochenwerte (Handeingabe oder CSV-Export) ----
SEPS = "=,;:|\t \"'"


def _rows_single(text):
    """Einzeilig: Datum, Trenner, Zahl, Datum, Trenner, Zahl ..."""
    hits = list(DATE_ANY.finditer(text))
    if not hits:
        raise Invalid("bing_weekly: kein Datum gefunden")
    if re.search(r"\d", text[:hits[0].start()]):
        raise Invalid(f"bing_weekly: unerwarteter Text vor dem ersten Datum: '{text[:hits[0].start()][:40]}'")
    rows = []
    for i, m in enumerate(hits):
        d = _date_of(m)
        if not d:
            raise Invalid(f"bing_weekly: '{m.group(0)}' ist kein gueltiges Datum")
        chunk = text[m.end():hits[i + 1].start() if i + 1 < len(hits) else len(text)].strip(SEPS)
        if not chunk:
            raise Invalid(f"bing_weekly: kein Wert nach {m.group(0)}")
        rows.append((d, parse_int(chunk, f"bing_weekly {m.group(0)}")))
    return rows


def _delimiter(lines):
    for dl in ("\t", ";", ","):
        if all(len(r) >= 2 for r in csv.reader(lines, delimiter=dl)):
            return dl
    return None


def _rows_csv(text):
    """Mehrzeilig: CSV-Export. Kopfzeile optional; Spalte "Citations"/"Zitate" bevorzugt, sonst erste Zahl nach dem Datum."""
    lines = [ln for ln in text.splitlines() if ln.strip()]
    if len(lines) > 1000:
        raise Invalid("bing_weekly: mehr als 1000 Zeilen")
    dl = _delimiter(lines)
    table = list(csv.reader(lines, delimiter=dl)) if dl else [ln.split() for ln in lines]
    col, rows = None, []
    for no, cells in enumerate(table, 1):
        cells = [c.strip() for c in cells]
        di = next((i for i, c in enumerate(cells) if cell_date(c)), None)
        if di is None:
            if not rows and not any(INT_RX.fullmatch(c) for c in cells):         # Kopfzeile
                col = next((i for i, c in enumerate(cells) if re.search(r"citation|zitat|zitier", c, re.I)
                            and not re.search(r"share|anteil|page|seite", c, re.I)), None)
                continue
            if re.match(r"(total|summe|gesamt|sum)\b", cells[0], re.I):         # Summenzeile des Exports
                continue
            raise Invalid(f"bing_weekly Zeile {no}: kein Datum gefunden")
        if col is not None and col != di:
            if col >= len(cells):
                raise Invalid(f"bing_weekly Zeile {no}: Spalte {col + 1} fehlt")
            v = parse_int(cells[col], f"bing_weekly Zeile {no}")
        else:
            nums = [c for c in cells[di + 1:] if c]
            if not nums:
                raise Invalid(f"bing_weekly Zeile {no}: kein Wert")
            v = parse_int(nums[0], f"bing_weekly Zeile {no}")
        rows.append((cell_date(cells[di]), v))
    return rows


def parse_weekly(text):
    """Text -> [["YYYY-MM-DD", n], ...] mit Wochenbeginn; Tageswerte werden zu vollen Wochen ab Montag summiert."""
    t = (text or "").strip()
    if not t:
        return []
    rows = _rows_csv(t) if "\n" in t else _rows_single(t)
    rows.sort()
    ds = [d for d, _ in rows]
    if len(set(ds)) != len(ds):
        dup = sorted({d for d in ds if ds.count(d) > 1})[0]
        raise Invalid(f"bing_weekly: Datum {dup.isoformat()} doppelt")
    gaps = {(b - a).days for a, b in zip(ds, ds[1:])}
    if not gaps or gaps == {7}:
        out = rows
    elif gaps == {1}:
        weeks = {}
        for d, v in rows:
            weeks.setdefault(d - timedelta(days=d.weekday()), []).append(v)
        out = [(w, sum(vs)) for w, vs in sorted(weeks.items()) if len(vs) == 7]
        if not out:
            raise Invalid("bing_weekly: Tageswerte ergeben keine volle Woche (Montag bis Sonntag)")
    else:
        raise Invalid("bing_weekly: Daten muessen 7 Tage (Wochenwerte) oder 1 Tag (Tageswerte) auseinander liegen")
    if len(out) > 104:
        raise Invalid("bing_weekly: mehr als 104 Wochen")
    return [[d.isoformat(), v] for d, v in out]


# ---- Bing AI Performance (Handeingabe) ----
def in_window(day, frm, to):
    return frm - timedelta(days=6) <= day <= to


def bing_manual(vals, today, old):
    """vals: Feld -> Text (siehe INPUTS). None, wenn nichts eingegeben wurde; sonst neuer bing_ai-Block (oder Invalid)."""
    given = {k: str(v).strip() for k, v in vals.items() if v is not None and str(v).strip()}
    if not given:
        return None, []
    missing = [INPUTS[k][1] for k in ("citations", "pages", "from", "to") if k not in given]
    if missing:
        raise Invalid("Bing AI Performance: " + ", ".join(missing) + " fehlt (bing_citations, bing_pages_per_day, bing_from und "
                      "bing_to nur zusammen eingeben)")
    frm, to = iso(given["from"], "bing_from", today), iso(given["to"], "bing_to", today)
    if frm > to:
        raise Invalid(f"Bing AI Performance: bing_from {frm} liegt nach bing_to {to}")
    if (to - frm).days > 400:
        raise Invalid("Bing AI Performance: Zeitraum laenger als 400 Tage")
    if frm.year < 2020:
        raise Invalid("Bing AI Performance: bing_from vor 2020")
    got = iso(given["retrieved"], "bing_retrieved", today) if "retrieved" in given else today
    if got < to:
        raise Invalid(f"Bing AI Performance: bing_retrieved {got} liegt vor dem Ende des Zeitraums {to}")
    cit = parse_int(given["citations"], "bing_citations")
    ppd = parse_avg(given["pages"], "bing_pages_per_day")
    notes = []
    if "weekly" in given:
        weekly = parse_weekly(given["weekly"])
        bad = [d for d, _ in weekly if not in_window(date.fromisoformat(d), frm, to)]
        if bad:
            raise Invalid(f"bing_weekly: Woche {bad[0]} liegt ausserhalb des Zeitraums {frm} bis {to}")
    else:
        weekly = [list(r) for r in (old.get("weekly") or []) if isinstance(r, list) and len(r) == 2
                  and re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(r[0])) and in_window(date.fromisoformat(r[0]), frm, to)]
        notes.append(("notice", f"bing_weekly leer: {len(weekly)} bisherige Wochenwerte im neuen Zeitraum bleiben stehen"))
    total = sum(v for _, v in weekly)
    if weekly and total > cit * WEEKLY_TOLERANCE:
        raise Invalid(f"Bing AI Performance: Summe der Wochenwerte {total:,} ist mehr als 25 % groesser als bing_citations {cit:,}")
    blk = {k: v for k, v in old.items() if k not in BING_KEYS}
    out = {"status": "ok", "source": BING_SOURCE, "period": {"from": frm.isoformat(), "to": to.isoformat()},
           "retrieved": got.isoformat(), "entered": "manual", "citations": cit, "cited_pages_per_day": ppd, "weekly": weekly}
    out.update(blk)
    return out, notes


# ---- Google Search Console ----
def last_full_months(today, n=3):
    first = today.replace(day=1)
    if today.day <= FINAL_LAG_DAYS:
        first = (first - timedelta(days=1)).replace(day=1)
    to = first - timedelta(days=1)
    y, m = to.year, to.month - (n - 1)
    while m <= 0:
        m, y = m + 12, y - 1
    return date(y, m, 1), to


def b64(b):
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode()


def sign_rs256(pem, data):
    try:
        from cryptography.hazmat.primitives import hashes, serialization
        from cryptography.hazmat.primitives.asymmetric import padding
    except ImportError:
        raise Missing() from None
    key = serialization.load_pem_private_key(pem.encode(), password=None)
    return key.sign(data, padding.PKCS1v15(), hashes.SHA256())


def token_uri(sa):
    u = sa.get("token_uri")
    return u if u in TOKEN_URIS else TOKEN_URIS[0]


def jwt_assertion(sa, now):
    hdr = {"alg": "RS256", "typ": "JWT"}
    if sa.get("private_key_id"):
        hdr["kid"] = sa["private_key_id"]
    claims = {"iss": sa["client_email"], "scope": GSC_SCOPE, "aud": token_uri(sa), "iat": now, "exp": now + 3600}
    head = b64(json.dumps(hdr, separators=(",", ":")).encode()) + "." + b64(json.dumps(claims, separators=(",", ":")).encode())
    return head + "." + b64(sign_rs256(sa["private_key"], head.encode()))


def _api_msg(raw):
    try:
        j = json.loads(raw.decode("utf-8", "replace") or "{}")
    except ValueError:
        return ""
    e = j.get("error") if isinstance(j, dict) else None
    if isinstance(e, dict):
        return " ".join(str(x) for x in (e.get("status"), e.get("message")) if x)
    if isinstance(e, str):
        return e + (f" ({j.get('error_description')})" if j.get("error_description") else "")
    return ""


def http_json(url, body=None, form=None, headers=None, timeout=60):
    """POST (JSON oder Formular) -> dict. Fehler als ApiError(Code, kurze Meldung der API); 429/5xx/Netz: bis zu 2 Wiederholungen."""
    hdr = dict(headers or {})
    if form is not None:
        data = urllib.parse.urlencode(form).encode()
        hdr["Content-Type"] = "application/x-www-form-urlencoded"
    else:
        data = json.dumps(body or {}).encode()
        hdr["Content-Type"] = "application/json"
    for attempt in range(len(RETRY_WAIT) + 1):
        try:
            req = urllib.request.Request(url, data=data, headers=hdr, method="POST")
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.loads(r.read().decode("utf-8") or "{}")
        except urllib.error.HTTPError as e:
            err = ApiError(e.code, _api_msg(e.read() or b"") or e.reason or "")
            retry = e.code == 429 or e.code >= 500
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            err, retry = ApiError(0, f"Netzwerkfehler ({type(e).__name__})"), True
        except ValueError:
            err, retry = ApiError(0, "Antwort ist kein JSON"), False
        if not retry or attempt == len(RETRY_WAIT):
            raise err
        SLEEP(RETRY_WAIT[attempt])
    raise AssertionError("unreachable")


def scrub(msg, sa):
    """Meldung kuerzen und alles entfernen, was aus dem Dienstkonto-Schluessel stammen koennte."""
    s = re.sub(r"-----BEGIN[^-]*-----.*?(-----END[^-]*-----|$)", "***", str(msg), flags=re.S)
    for k in ("private_key", "private_key_id", "client_email", "client_id"):
        v = str(sa.get(k) or "") if isinstance(sa, dict) else ""
        if len(v) >= 6:
            s = s.replace(v, "***")
    return re.sub(r"\s+", " ", s).strip()[:200]


def gsc_block(old):
    b = {k: old.get(k) for k in GSC_KEYS}
    b.update({"source": b["source"] or GSC_SOURCE, "entered": "api", "note": b["note"] or ""})
    b.update({k: v for k, v in old.items() if k not in GSC_KEYS})
    return b


def fetch_gsc(env, today, old, now=None):
    """-> (gsc-Block, [(Stufe, Meldung)]). Fehler aendern nur status/note; die alten Zahlen bleiben."""
    blk = gsc_block(old)
    site = (env.get("GSC_SITE") or "").strip() or GSC_DEFAULT_SITE
    if not re.fullmatch(r"sc-domain:[a-z0-9.-]+\.[a-z]{2,}|https?://[a-z0-9.-]+(:\d+)?/(\S*)", site, re.I):
        blk.update(status="error", note="Repo-Variable GSC_SITE ist keine Property (sc-domain:beispiel.de oder https://www.beispiel.de/)")
        return blk, [("warning", "Search Console: " + blk["note"])]
    blk["property"] = site
    raw = (env.get("GSC_SERVICE_ACCOUNT_JSON") or "").strip()
    if not raw:
        blk.update(status="missing_secret", note="Secret GSC_SERVICE_ACCOUNT_JSON fehlt; Werte unveraendert")
        return blk, [("notice", "Search Console: " + blk["note"])]
    try:
        sa = json.loads(raw)
        if not (isinstance(sa, dict) and isinstance(sa.get("client_email"), str) and "PRIVATE KEY" in str(sa.get("private_key"))):
            raise ValueError
    except ValueError:
        blk.update(status="error", note="GSC_SERVICE_ACCOUNT_JSON ist kein Dienstkonto-Schluessel (JSON mit client_email und private_key)")
        return blk, [("warning", "Search Console: " + blk["note"])]
    frm, to = last_full_months(today)
    q = {"startDate": frm.isoformat(), "endDate": to.isoformat(), "type": "web", "dataState": "final"}
    url = GSC_API.format(site=urllib.parse.quote(site, safe=""))
    stage = "Anmeldung"
    try:
        try:
            jwt = jwt_assertion(sa, int(now if now is not None else time.time()))
        except Missing:
            raise
        except Exception as e:   # Schluessel nicht lesbar; Meldung ohne Inhalt
            raise ApiError(0, f"private_key nicht lesbar ({type(e).__name__})") from None
        tok = http_json(token_uri(sa), form={"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": jwt})
        auth = {"Authorization": "Bearer " + str(tok.get("access_token") or "")}
        if not tok.get("access_token"):
            raise ApiError(0, "Token-Antwort ohne access_token")
        stage = "Search Analytics"
        rows = http_json(url, body=q, headers=auth).get("rows") or []
        if not rows:
            blk.update(status="empty", note=f"keine Zeilen fuer {frm} bis {to}; Werte unveraendert")
            return blk, [("warning", "Search Console: " + blk["note"])]
        tot = rows[0]
        pages = clicked = 0
        capped = ""
        for i in range(PAGE_MAX_REQ):
            pr = http_json(url, body=dict(q, dimensions=["page"], rowLimit=PAGE_ROWS, startRow=i * PAGE_ROWS), headers=auth).get("rows") or []
            pages += len(pr)
            clicked += sum(1 for r in pr if (r.get("clicks") or 0) > 0)
            if len(pr) < PAGE_ROWS:
                break
        else:
            capped = f"Seitenzahl bei {PAGE_ROWS * PAGE_MAX_REQ} abgeschnitten"
    except Missing:
        blk.update(status="error", note="Python-Paket cryptography fehlt (pip install cryptography)")
        return blk, [("warning", "Search Console: " + blk["note"])]
    except ApiError as e:
        hint = " - Dienstkonto in der Search Console als Nutzer der Property eintragen" if e.code == 403 else ""
        blk.update(status="error", note=scrub(f"{stage}: {e}", sa) + hint + "; Werte unveraendert")
        return blk, [("warning", "Search Console: " + blk["note"])]
    clicks, impr = int(tot.get("clicks") or 0), int(tot.get("impressions") or 0)
    blk.update(status="ok", period={"from": frm.isoformat(), "to": to.isoformat()}, retrieved=today.isoformat(), clicks=clicks,
               impressions=impr, ctr=round(float(tot.get("ctr") or 0), 4), position=round(float(tot.get("position") or 0), 1),
               pages=pages, pages_clicked=clicked, note=capped)
    return blk, [("notice", f"Search Console {frm} bis {to}: {clicks:,} Klicks, {impr:,} Impressionen, {pages:,} Seiten")]


# ---- Pruefung ----
def _num(v, what, errs, null, integer=True, lo=0, hi=None):
    if v is None and null:
        return
    ok = isinstance(v, int) if integer else isinstance(v, (int, float))
    if isinstance(v, bool) or not ok or v < lo or (hi is not None and v > hi):
        errs.append(f"{what}: {v!r} ist keine Zahl im erlaubten Bereich")


def _day(v, what, errs, today, null):
    if v is None and null:
        return None
    try:
        return iso(v, what, today)
    except Invalid as e:
        errs.append(str(e))


def _period(p, what, errs, today, null):
    if p is None and null:
        return None, None
    if not isinstance(p, dict):
        errs.append(f"{what}: Objekt {{from, to}} erwartet"); return None, None
    a, b = _day(p.get("from"), what + ".from", errs, today, False), _day(p.get("to"), what + ".to", errs, today, False)
    if a and b and a > b:
        errs.append(f"{what}: from liegt nach to")
    return a, b


def validate_ai(doc, today):
    errs = []
    if not isinstance(doc, dict) or doc.get("version") != 1:
        return ["ai_performance.json: Objekt mit version 1 erwartet"]
    _day(doc.get("updated"), "updated", errs, today, True)
    for name in ("bing_ai", "gsc"):
        b = doc.get(name)
        if not isinstance(b, dict):
            errs.append(f"{name}: Objekt erwartet"); continue
        ok = b.get("status") == "ok"
        if b.get("status") not in STATUSES:
            errs.append(f"{name}.status: {b.get('status')!r} (erlaubt: {', '.join(STATUSES)})")
        if not isinstance(b.get("source"), str) or not b.get("source", "").strip():
            errs.append(f"{name}.source fehlt")
        a, z = _period(b.get("period"), f"{name}.period", errs, today, not ok)
        got = _day(b.get("retrieved"), f"{name}.retrieved", errs, today, not ok)
        if got and z and got < z:
            errs.append(f"{name}.retrieved liegt vor dem Ende des Zeitraums")
        if name == "bing_ai":
            _num(b.get("citations"), "bing_ai.citations", errs, not ok, hi=10 ** 10)
            _num(b.get("cited_pages_per_day"), "bing_ai.cited_pages_per_day", errs, not ok, integer=False, hi=10 ** 7)
            wk = b.get("weekly")
            if not isinstance(wk, list):
                errs.append("bing_ai.weekly: Liste erwartet"); continue
            prev = None
            for r in wk:
                if not (isinstance(r, list) and len(r) == 2):
                    errs.append(f"bing_ai.weekly: Eintrag {r!r} ist kein [Datum, Zahl]"); break
                d = _day(r[0], "bing_ai.weekly Datum", errs, today, False)
                _num(r[1], f"bing_ai.weekly {r[0]}", errs, False, hi=10 ** 9)
                if d and prev and d <= prev:
                    errs.append(f"bing_ai.weekly: {r[0]} nicht aufsteigend")
                if d and a and z and not in_window(d, a, z):
                    errs.append(f"bing_ai.weekly: {r[0]} liegt ausserhalb von period")
                prev = d or prev
            tot = sum(r[1] for r in wk if isinstance(r, list) and len(r) == 2 and isinstance(r[1], int))
            if wk and isinstance(b.get("citations"), int) and tot > b["citations"] * WEEKLY_TOLERANCE:
                errs.append("bing_ai.weekly: Summe mehr als 25 % ueber citations")
        else:
            for k in ("clicks", "impressions", "pages", "pages_clicked"):
                _num(b.get(k), f"gsc.{k}", errs, not ok or k.startswith("pages"))
            _num(b.get("ctr"), "gsc.ctr", errs, True, integer=False, hi=1)
            _num(b.get("position"), "gsc.position", errs, True, integer=False)
            if all(isinstance(b.get(k), int) for k in ("clicks", "impressions")) and b["clicks"] > b["impressions"]:
                errs.append("gsc.clicks groesser als gsc.impressions")
            if not isinstance(b.get("note", ""), str):
                errs.append("gsc.note: Text erwartet")
    return errs


def validate_diff(doc, today):
    errs = []
    if not isinstance(doc, dict):
        return ["topic_difficulty.json: Objekt erwartet"]
    if not isinstance(doc.get("example"), bool):
        errs.append("topic_difficulty.example: true/false erwartet")
    _day(doc.get("updated"), "topic_difficulty.updated", errs, today, False)
    lv = doc.get("levels")
    if not isinstance(lv, dict) or not lv or len(lv) > 1000:
        errs.append("topic_difficulty.levels: Objekt {Thema: 1..4} mit 1 bis 1000 Eintraegen erwartet")
        return errs
    for k, v in lv.items():
        if not (isinstance(k, str) and 0 < len(k.strip()) <= 80):
            errs.append(f"topic_difficulty.levels: Schluessel {k!r} ungueltig")
        if isinstance(v, bool) or not isinstance(v, int) or not 1 <= v <= 4:
            errs.append(f"topic_difficulty.levels[{k!r}]: {v!r} (erlaubt 1 bis 4)")
    return errs


# ---- Datei ----
def skeleton():
    return {"version": 1, "_doc": DOC, "updated": None,
            "bing_ai": {"status": "empty", "source": BING_SOURCE, "period": None, "retrieved": None, "entered": "manual",
                        "citations": None, "cited_pages_per_day": None, "weekly": []},
            "gsc": gsc_block({"status": "missing_secret", "property": GSC_DEFAULT_SITE})}


def dump(o, ind=0):
    """JSON mit Einzug 1; kleine flache Objekte und Wochenzeilen einzeilig (lesbar fuer Handpflege)."""
    j = lambda x: json.dumps(x, ensure_ascii=False)
    sp = " " * ind
    if isinstance(o, dict) and o and (len(o) > 3 or any(isinstance(v, (dict, list)) for v in o.values())):
        return "{\n" + ",\n".join(f"{sp} {j(k)}: {dump(v, ind + 1)}" for k, v in o.items()) + "\n" + sp + "}"
    if isinstance(o, list) and o and all(isinstance(x, list) for x in o):
        return "[\n" + ",\n".join(sp + " " + j(x) for x in o) + "\n" + sp + "]"
    return j(o)


def load(p):
    if not p.exists():
        return None
    try:
        return json.loads(p.read_text("utf-8"))
    except ValueError as e:
        raise Invalid(f"{p.name}: kein gueltiges JSON ({e})") from None


def emit(level, msg):
    print(f"::{level}::{msg}")


def summary(env, doc, changed, dry):
    path = env.get("GITHUB_STEP_SUMMARY")
    if not path:
        return
    b, g = doc["bing_ai"], doc["gsc"]
    per = lambda x: f"{x['period']['from']} bis {x['period']['to']}" if x.get("period") else "-"
    rows = [("Bing AI Performance", b["status"], per(b), b.get("retrieved") or "-",
             f"{b.get('citations') or 0:,} Zitate, {b.get('cited_pages_per_day') or 0:,} Seiten/Tag, {len(b.get('weekly') or [])} Wochen"),
            ("Search Console", g["status"], per(g), g.get("retrieved") or "-",
             f"{g.get('clicks') or 0:,} Klicks, {g.get('impressions') or 0:,} Impressionen {g.get('note') or ''}".strip())]
    txt = ["### Belegzahlen /sponsor/", "", "| Quelle | Status | Zeitraum | Stand | Werte |", "|---|---|---|---|---|"]
    txt += ["| " + " | ".join(str(c).replace("|", "/") for c in r) + " |" for r in rows]
    txt += ["", ("Testlauf, nichts gespeichert" if dry else "Datei aktualisiert") if changed else "Keine Aenderung", ""]
    with open(path, "a", encoding="utf-8") as f:
        f.write("\n".join(txt) + "\n")


def args_of(argv):
    ap = argparse.ArgumentParser(description="Belegzahlen fuer /sponsor/ aktualisieren (T37)")
    ap.add_argument("--dry-run", action="store_true", help="nur pruefen und anzeigen, nichts schreiben")
    ap.add_argument("--skip-gsc", action="store_true", help="Search Console nicht abfragen (Block bleibt unveraendert)")
    ap.add_argument("--data-dir", help="Ordner mit ai_performance.json und topic_difficulty.json (Standard data/stats)")
    for k, (_, name) in INPUTS.items():
        ap.add_argument("--" + name.replace("_", "-"), dest=k, help=f"wie Workflow-Eingabe {name}")
    return ap.parse_args(argv)


def main(argv=None, env=None, today=None, now=None):
    env = os.environ if env is None else env
    a = args_of(argv)
    today = today or datetime.now(timezone.utc).date()
    sd = Path(a.data_dir) if a.data_dir else STATS
    ai_p, df_p = sd / AI_FILE, sd / DIFF_FILE
    try:
        old = load(ai_p)
        if old is None:
            emit("notice", f"{AI_FILE} fehlt, wird neu angelegt"); old = skeleton()
        errs = validate_ai(old, today)
        if errs:
            raise Invalid(f"{AI_FILE} (vorhandene Datei) ungueltig: " + "; ".join(errs[:5]))
        diff = load(df_p)
        if diff is None:
            emit("warning", f"{DIFF_FILE} fehlt (die Seite nutzt dann ihre Beispielwerte)")
        else:
            errs = validate_diff(diff, today)
            if errs:
                raise Invalid(f"{DIFF_FILE} ungueltig: " + "; ".join(errs[:5]))
            if diff.get("example"):
                emit("notice", f"{DIFF_FILE}: Schwierigkeitswerte sind Beispielwerte (example: true)")
        new = json.loads(json.dumps(old))
        new["_doc"] = DOC
        vals = {k: getattr(a, k) if getattr(a, k) is not None else env.get(INPUTS[k][0], "") for k in INPUTS}
        bing, notes = bing_manual(vals, today, old.get("bing_ai") or {})
        for n in notes: emit(*n)
        if bing:
            new["bing_ai"] = bing
            emit("notice", f"Bing AI Performance {bing['period']['from']} bis {bing['period']['to']}: {bing['citations']:,} Zitate, "
                           f"{bing['cited_pages_per_day']:,} Seiten/Tag, {len(bing['weekly'])} Wochen (Stand {bing['retrieved']})")
        else:
            got = (old.get("bing_ai") or {}).get("retrieved")
            age = (today - date.fromisoformat(got)).days if got else None
            if age is None or age > DUE_DAYS:
                emit("warning", "Bing AI Performance: neuer Export faellig" + (f" (letzter Stand {got}, vor {age} Tagen)" if got else "")
                     + " - Werte ueber die Workflow-Eingaben bing_* eintragen")
        if a.skip_gsc:
            emit("notice", "Search Console uebersprungen (--skip-gsc)")
        else:
            new["gsc"], notes = fetch_gsc(env, today, old.get("gsc") or {}, now=now)
            for n in notes: emit(*n)
        errs = validate_ai(new, today)
        if errs:
            raise Invalid("Ergebnis ungueltig, nichts gespeichert: " + "; ".join(errs[:5]))
    except Invalid as e:
        emit("error", str(e))
        return 1
    strip = lambda d: {k: v for k, v in d.items() if k != "updated"}
    changed = strip(new) != strip(old) or not ai_p.exists()
    if changed:
        new["updated"] = today.isoformat()
    text = dump(new) + "\n"
    if a.dry_run:
        print(f"Testlauf ({'Aenderung' if changed else 'keine Aenderung'}), {ai_p.name} wuerde so aussehen:\n{text}", end="")
    elif changed:
        sd.mkdir(parents=True, exist_ok=True)
        ai_p.write_text(text, "utf-8")
        print(f"gespeichert: {ai_p}")
    else:
        print("unveraendert")
    summary(env, new, changed, a.dry_run)
    return 0


if __name__ == "__main__":
    sys.exit(main())
