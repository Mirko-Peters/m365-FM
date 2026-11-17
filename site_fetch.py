"""Ein Lader fuer alle Exporte des Community-Workers (api-dub.m365.fm).

- Jeder Endpunkt wird je Bau genau einmal geholt (Speicher-Cache), die Hauptexporte parallel vorab (prefetch).
- Bis zu drei Versuche je Endpunkt, Zeitueberschreitung 120 s.
- Jede erfolgreiche Antwort landet in data/cache/<name>.json (gitignored; in CI per actions/cache von Lauf zu Lauf).
  Faellt der Abruf aus, kommt die letzte gespeicherte Fassung mit Warnung - statt stillschweigend leerer Seiten.
- check(): fehlen Pflicht-Exporte (Blog, Profile, Entitaeten, Q&A) frisch UND im Cache, bricht der Bau mit Exit 1 ab. Den Profil-Export
  braucht der Bau frisch: aus einer alten Fassung kaemen geloeschte oder private Profile zurueck.
  SITE_OFFLINE=1 (lokale Testbauten ohne Netz) macht daraus eine Warnung.
- scrub() (Runde 8): Kommen Exporte mit Personenbezug (Entitaeten, Feed, Shows, Events, Gaeste, Bibliothek, Podcast, Video) aus data/cache, werden
  sie gegen den frischen Profil-Export gefiltert: sie stammen vom letzten Bau, also womoeglich von vor einer Kontoloeschung, dem Privatstellen
  oder einem Adresswechsel - und die Adresse kann inzwischen einem anderen Mitglied gehoeren.
"""
import json, os, re, sys, time, threading, urllib.request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import site_text as STX

CACHE = Path(__file__).parent / "data" / "cache"
API = os.environ.get("COMMUNITY_API", "https://api-dub.m365.fm")
# Pflicht: ohne diese Exporte entstehen leere Bereiche (Blog, Mitglieder, Entitaeten, Fragen) - und kleinere Sitemaps, die Google als Loeschung liest
ESSENTIAL = ("/api/blog/export", "/api/profiles/export", "/api/entity/export", "/api/qa/export")
PROFILES = "/api/profiles/export"   # Pflicht und nur frisch: keine Profilseiten aus alten Daten (check, site_members.fetch_members)
# Vorab parallel: alles, was der Seitenbau an Exporten kennt
PREFETCH = ESSENTIAL + ("/api/entity/claims", "/api/feed/export", "/api/show/export", "/api/events/export", "/api/guests/export", "/api/library/export",
                        "/api/podcast/export", "/api/video/export", "/api/notes/export", "/api/ui-i18n")
# Aenderungen der Redaktion an Sprachfassungen (site_i18n_overrides.sync schreibt data/i18n_overrides/); Ausfall ist unkritisch: die Dateien im Repo bleiben
PREFETCH += tuple(f"/api/i18n/overrides?kind={_k}&lang={_l}" for _k in ("lblog", "episode", "notes") for _l in ("de", "fr", "es", "it", "nl", "pt", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko"))

_MEM, _STATE, _LOCK = {}, {}, threading.Lock()   # url -> json | None ; url -> "frisch" | "cache" | "fehlt"
_BUSY = {}   # url -> threading.Event, solange ein Abruf laeuft: ein zweiter Aufruf derselben URL wartet darauf statt doppelt abzurufen (scrub holt Profile nach)
CACHE_MARGIN = 600   # gespeicherte Fassung: geschrieben nach dem Abruf (bis zu 3 x 120 s + Pausen) - der Datenstand liegt bis zu so viel davor
_TIME = {}   # url -> Zeitpunkt der Daten (Unix): frisch = Beginn des Abrufs, Cache = Zeitpunkt, zu dem die gespeicherte Fassung geschrieben wurde


def _name(url):
    p = url.split("://", 1)[-1].split("/", 1)[-1]
    return re.sub(r"[^a-z0-9]+", "_", p.lower()).strip("_")[:120] + ".json"


def _http(url, timeout, tries):
    last = None
    for n in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"user-agent": "m365-dub-build"}), timeout=timeout) as r:
                return json.loads(r.read().decode("utf-8")), None
        except Exception as e:
            last = f"{type(e).__name__}: {str(e)[:120]}"
            if n + 1 < tries:
                time.sleep(3 * (n + 1))
    return None, last


def fetch(url, timeout=120, tries=3):
    """JSON eines Endpunkts: Speicher -> Netz (mit Wiederholung) -> data/cache. None nur, wenn beides fehlt."""
    while True:
        with _LOCK:
            if url in _MEM:
                return _MEM[url]
            ev = _BUSY.get(url)
            if ev is None:
                _BUSY[url] = threading.Event(); break
        ev.wait()
    try:
        return _fetch(url, timeout, tries)
    finally:
        with _LOCK:
            _BUSY.pop(url).set()


def _fetch(url, timeout, tries):
    t0 = time.time()
    j, err = _http(url, timeout, tries)
    f = CACHE / _name(url)
    stamp = None
    if j is not None:
        state, stamp = "frisch", t0
        try:
            CACHE.mkdir(parents=True, exist_ok=True); f.write_text(json.dumps(j, ensure_ascii=False), encoding="utf-8")
        except Exception:
            pass
    elif f.exists():
        try:
            j = json.loads(f.read_text("utf-8")); state = "cache"; stamp = f.stat().st_mtime - CACHE_MARGIN
            age = (time.time() - f.stat().st_mtime) / 3600
            print(f"WARNUNG: {url.split('://', 1)[-1]} nicht erreichbar ({err}) - gespeicherte Fassung von vor {age:.0f} h", file=sys.stderr)
        except Exception:
            j, state = None, "fehlt"
    else:
        state = "fehlt"
        print(f"WARNUNG: {url.split('://', 1)[-1]} nicht erreichbar ({err}) und keine gespeicherte Fassung", file=sys.stderr)
    if j is not None:
        j = STX.fix_tree(j)   # Mojibake aus Fremd-Feeds und alten Importen vor dem Seitenbau reparieren (check_encoding ist blockierend)
    if j is not None and state == "cache":
        j = scrub(url, j)
    with _LOCK:
        _MEM[url] = j; _STATE[url] = state
        if stamp is not None: _TIME[url] = stamp
    return j


# ---------------------------------------------------------------- scrub (Runde 8)
FORMER = "Former member"   # wie worker/src/privacy.js FORMER
SCRUB = ("/api/entity/export", "/api/feed/export", "/api/show/export", "/api/events/export", "/api/guests/export", "/api/library/export",
         "/api/podcast/export", "/api/video/export")


def _split(url):
    """-> (Basis-URL, Pfad ohne Abfrage) fuer https://host/api/... ; (None, None) sonst"""
    i = url.find("/api/")
    return (url[:i], url[i:].split("?", 1)[0]) if i >= 0 else (None, None)


def fresh_people(api):
    """Oeffentliche Profile aus dem FRISCHEN Profil-Export dieses Baus: {Adresse: Profil}. Ohne frischen Export leer (alles mit Personenbezug faellt
    dann weg; check() bricht den Bau ohnehin ab, ausser lokal mit SITE_OFFLINE=1)."""
    j = fetch(api + PROFILES)
    if _STATE.get(api + PROFILES) != "frisch" or not isinstance(j, dict):
        return {}
    return {p["handle"]: p for p in j.get("people") or [] if isinstance(p, dict) and p.get("handle")}


def _norm(s):
    return " ".join(str(s or "").split()).casefold()


def same_person(pb, handle, name=None, ak=None):
    """Gehoert ein Eintrag (Adresse, Name, Konto-Schluessel ak aus worker privacy.js acctKeys) noch dem Profil, das die Adresse im frischen Export
    traegt? Adresse muss oeffentlich sein; tragen beide einen Konto-Schluessel, muss er gleich sein (anderes Konto mit derselben Adresse: nein).
    Sonst (aeltere Cache-Fassung ohne ak) muss der Name passen."""
    p = pb.get(handle) if handle else None
    if not p:
        return False
    if ak and p.get("ak"):
        return ak == p["ak"]
    if name and p.get("name"):
        return _norm(name) == _norm(p["name"])
    return True


def _keep(pb, it):
    return isinstance(it, dict) and same_person(pb, it.get("handle"), it.get("name"), it.get("ak"))


def _credits(pb, it):
    """Gaeste einer Podcast-Folge oder eines Videos ({handle, name}): nur noch passende Profile."""
    if isinstance(it, dict) and isinstance(it.get("guests"), list):
        it = {**it, "guests": [g for g in it["guests"] if _keep(pb, g)]}
    return it


def _speaker(pb, x):
    """Event-Speaker {h, n, e, ak}: mit h nur, wenn das Profil frisch oeffentlich ist und Konto-Schluessel (bzw. in aelteren Fassungen ohne ak der
    Name) passt - sonst anonym wie worker anonSpeaker (kein Name, kein Profil-Link, keine Entitaet)."""
    if not isinstance(x, dict) or not x.get("h") or same_person(pb, x["h"], x.get("n"), x.get("ak")):
        return x
    return {"n": FORMER}


def scrub(url, j):
    """Export aus data/cache gegen den frischen Profil-Export filtern (siehe Kopf). Unbekannte Pfade und Formen bleiben unveraendert."""
    api, path = _split(url)
    if path not in SCRUB or not isinstance(j, dict):
        return j
    pb = fresh_people(api)
    if path == "/api/events/export":
        evs = []
        for ev in j.get("events") or []:
            if not isinstance(ev, dict):
                evs.append(ev); continue
            ev = dict(ev)
            org = ev.get("organizer")
            if isinstance(org, dict) and org.get("kind") == "u" and org.get("handle") and not same_person(pb, org["handle"], org.get("name"), org.get("ak")):
                ev["organizer"] = {"kind": "u", "handle": "", "name": FORMER}
            ev["sessions"] = [({**s, "speakers": [_speaker(pb, x) for x in s.get("speakers") or []]} if isinstance(s, dict) else s) for s in ev.get("sessions") or []]
            evs.append(ev)
        return {**j, "events": evs}
    items = j.get("items")
    if not isinstance(items, list):
        return j
    if path == "/api/entity/export":
        # Personen-Entitaeten aus Profilen (pe; aeltere Fassungen ohne pe: selbst verwaltet und Typ person) nur, wenn die Adresse frisch oeffentlich
        # ist und der Name zum Profil passt (sonst: geloescht, privat oder Adresse inzwischen bei einem anderen Mitglied)
        def personal(i):
            d = i.get("data") if isinstance(i.get("data"), dict) else {}
            return bool(i["pe"]) if "pe" in i else (i.get("src") == "owned" and d.get("type") == "person")
        out = [i for i in items if not isinstance(i, dict) or not personal(i) or same_person(pb, i.get("id"), (i.get("data") or {}).get("name"), i.get("ak"))]
    elif path == "/api/feed/export":
        out = [i for i in items if not isinstance(i, dict) or i.get("type") == "o" or _keep(pb, i)]   # Firmen-Eintraege (type o) betrifft das nicht
    else:
        out = [_credits(pb, i) for i in items if _keep(pb, i)]
    if len(out) != len(items):
        print(f"Hinweis: {path} aus data/cache - {len(items) - len(out)} Eintraege ohne passendes frisches Profil ausgelassen", file=sys.stderr)
    return {**j, "items": out}


def prefetch(api=None, langs=()):
    """Hauptexporte parallel holen (8 gleichzeitig); spaetere Aufrufe kommen aus dem Speicher."""
    api = api or API
    urls = [api + p for p in PREFETCH] + [f"{api}/api/wiki/export?lang={l}" for l in langs]
    t = time.perf_counter()
    with ThreadPoolExecutor(8) as ex:
        list(ex.map(fetch, urls))
    c = {k: sum(1 for v in _STATE.values() if v == k) for k in ("frisch", "cache", "fehlt")}
    print(f"Exporte: {c['frisch']} frisch, {c['cache']} aus Cache, {c['fehlt']} fehlen ({time.perf_counter() - t:.0f} s)")
    return c


def check(api=None):
    """Bricht ab, wenn ein Pflicht-Export weder frisch noch gespeichert vorliegt (sonst wuerde eine Seite ohne Blog/Profile/Entitaeten veroeffentlicht)."""
    api = api or API
    missing = [p for p in ESSENTIAL if _STATE.get(api + p, "fehlt") == "fehlt"]
    # Profile nur frisch (Runde 7): eine alte Fassung (data/cache oder frueher die eingecheckte data/members_export.json) brachte geloeschte,
    # privat gestellte und umbenannte Profile als statische Seiten zurueck. Abbruch statt Bau ohne Profilseiten: so laeuft kein Upload und kein
    # Deploy, und r2_site_sync/r2_og_upload markieren die vorhandenen Profilseiten nicht massenhaft als entfernt.
    if PROFILES not in missing and _STATE.get(api + PROFILES) != "frisch":
        missing.append(PROFILES + " (nur alte Fassung)")
    if not missing:
        return True
    msg = "Pflicht-Exporte fehlen (frisch und Cache): " + ", ".join(missing)
    if os.environ.get("SITE_OFFLINE") == "1":
        print("WARNUNG (SITE_OFFLINE=1): " + msg, file=sys.stderr); return False
    print("FEHLER: " + msg + " - Bau abgebrochen, damit keine leere Seite veroeffentlicht wird. Lokal: SITE_OFFLINE=1 setzen.", file=sys.stderr)
    sys.exit(1)


def states():
    return dict(_STATE)


def data_time(paths=ESSENTIAL):
    """Aeltester Datenstand der Pflicht-Exporte dieses Baus (Unix-Zeit) oder None, wenn einer fehlt (nicht geholt, ausgefallen ohne Cache). site_search.py schreibt ihn als "fetched" ins Such-Manifest: der Worker
    (search.js searchBlockActive) nimmt gesperrte Personen-Dokumente (Kontoloeschung, Adresswechsel) erst aus einem Bau wieder auf, dessen
    Exporte NACH der Sperre geholt wurden - nicht schon, weil der Bau danach endet (K41/C)."""
    with _LOCK:
        times = []
        for p in paths:
            hit = [t for u, t in _TIME.items() if u.split("://", 1)[-1].split("/", 1)[-1] == p.lstrip("/")]
            if not hit: return None
            times.append(min(hit))
    return min(times) if times else None
