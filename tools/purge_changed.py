"""Nach dem Deploy: Vergleich der Seiten-Hashes mit dem letzten Lauf -> nur geaenderte Adressen im Cloudflare-Cache leeren (30 je Aufruf) und bei IndexNow melden.
Bei mehr als MAX_URLS Adressen (z. B. neues Stylesheet in jeder Seite) wird einmal alles geleert. Aufruf: python tools/purge_changed.py alt.json neu.json [r2-changed.json ...]
Umgebung: CLOUDFLARE_API_TOKEN, CF_ZONE_ID (optional, sonst Zonensuche), BASE (https://www.m365.fm), INDEXNOW_KEY, R2_KEYS, R2_PENDING

Kanten-Cache ueber Deploys erhalten (17.11.2026): Die Hashes sind Purge-Hashes (tools/page_hashes.py, ohne die Liste "neueste Folgen" der Seitenleiste):
kommt nur eine neue Folge dazu, bleiben alle anderen Seiten im Cache. Der Site-Worker haelt Seiten und Dateien aus R2 (R2_PRIMARY=1) unter einem
Schluessel ohne Bau-Kennung (/__r2f<adresse>, sitewrk/index.js r2CacheKey), sie ueberleben also einen Deploy - und muessen deshalb bei jeder Aenderung
geleert werden, und zwar erst, wenn der Bucket vollstaendig neu ist (nach dem Spiegel): bis dahin kann ein Isolat mit einer alten Kennung (bis 30 s
gemerkt, nach Leerlauf auch laenger) noch alte Objekte lesen und neu cachen. Und vor der neuen Kennung, sonst kaeme kurz der alte Stand aus dem Cache.
Darum zwei Schritte:
 1. (dieser Aufruf, direkt nach deploy-pages) GitHub-Pages-Adressen (<adresse>) und der alte R2-Rueckfall (/__r2c<adresse>) wie bisher; die Adressen fuer
    /__r2f kommen in die Liste R2_PENDING (JSON {"all": bool, "urls": [...], "hashes": Pruefsumme des Seiten-Stands}), zusammen mit noch offenen aus
    frueheren Laeufen. Passt die Pruefsumme nicht zum alten Stand dieses Laufs (ein Deploy dazwischen hat die Liste nicht fortgeschrieben), gilt "alles".
 2. python tools/purge_changed.py --r2 <R2_PENDING> [neu.json] (nach dem R2-Spiegel, vor "Bau-Kennung im Bucket setzen"): leert /__r2f<adresse> fuer die
    Liste und leert sie erst nach vollstaendigem Erfolg. Scheitert er, bleibt die Liste fuer den naechsten Lauf, Ende 1 (der Deploy-Job setzt dann die
    Bau-Kennung nicht -> GitHub Pages).
Scheitert ein Stapel auch nach Wiederholungen, wird einmal alles geleert (lieber kalt als veraltet)."""
import hashlib, json, os, re, sys, time, urllib.error, urllib.parse, urllib.request

# Cloudflare-API: hoechstens 1200 Aufrufe je 5 Minuten und Nutzer. 15.000 Adressen = 500 Aufrufe zu 30 (Grenze der Einzeldatei-Purges ausser Enterprise);
# beide Schritte eines Deploys zusammen bleiben darunter, auch wenn sie in dieselben 5 Minuten fallen. Darueber ist ein Komplett-Purge schneller.
# Vorher 3000: Lauf #709 (17.11.) leerte mit 3261 Adressen alles - auch Bilder, Schriften und CSS.
MAX_URLS = 15000
BATCH = 30
R2F = "/__r2f"   # Kanten-Cache des R2-Ursprungs im Site-Worker (Pfad-Schluessel, sitewrk/index.js)
IMG = re.compile(r"\.(png|jpe?g|gif|webp|avif|svg|ico)$", re.I)   # Bilder kommen nie aus R2 zuerst
base = os.environ.get("BASE", "https://www.m365.fm").rstrip("/")
q = lambda u: urllib.parse.quote(u, safe="/%:@!$&'()*+,;=-._~")   # Adressen wie im Browser (Prozent-Kodierung), sonst trifft der Purge Unicode-Pfade nicht


def cf(path, body=None):
    """Aufruf der Cloudflare-API; 429/5xx und Netzfehler bis zu dreimal wiederholt. Rueckgabe immer ein dict (success False bei Fehler), nie eine Ausnahme."""
    data = json.dumps(body).encode() if body is not None else None
    for i in range(4):
        req = urllib.request.Request("https://api.cloudflare.com/client/v4" + path, data, {"Authorization": "Bearer " + os.environ["CLOUDFLARE_API_TOKEN"], "Content-Type": "application/json"},
                                     method="POST" if data is not None else "GET")
        try:
            with urllib.request.urlopen(req, timeout=60) as r: return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and i < 3:
                try: wait = min(60, int(e.headers.get("retry-after") or 0))
                except (TypeError, ValueError, AttributeError): wait = 0
                time.sleep(wait or 5 * (i + 1)); continue
            try: return json.load(e)
            except Exception: return {"success": False, "errors": [{"message": f"HTTP {e.code}"}]}
        except Exception as e:   # Zeitueberschreitung, Verbindungsabbruch
            if i < 3: time.sleep(5 * (i + 1)); continue
            return {"success": False, "errors": [{"message": type(e).__name__}]}
    return {"success": False, "errors": [{"message": "zu viele Versuche"}]}


def zone_id():
    if os.environ.get("CF_ZONE_ID"): return os.environ["CF_ZONE_ID"]
    res = cf("/zones?name=m365.fm").get("result") or []
    return res[0]["id"] if res else ""


def everything(zone, why):
    d = cf(f"/zones/{zone}/purge_cache", {"purge_everything": True}); print("Cache komplett geleert:", d.get("success"), f"({why})")
    return bool(d.get("success"))


def purge(zone, urls, label):
    """Adressen in Stapeln zu BATCH leeren. True nur, wenn alles geleert ist - einzeln oder (zu viele, Stapel gescheitert) mit einem Komplett-Purge."""
    if not urls: print(f"{label}: nichts zu leeren"); return True
    if len(urls) > MAX_URLS: return everything(zone, f"{label}: {len(urls)} Adressen > {MAX_URLS}")
    ok = bad = 0
    for i in range(0, len(urls), BATCH):
        part = urls[i:i + BATCH]; d = cf(f"/zones/{zone}/purge_cache", {"files": part})
        if d.get("success"): ok += len(part)
        else: bad += len(part); print("Purge-Fehler:", [e.get("message") for e in d.get("errors") or []][:2])
    print(f"{label}: Cache geleert fuer {ok} Adressen")
    if bad: return everything(zone, f"{label}: {bad} Adressen nicht geleert")
    return True


def rj(path):
    with open(path, encoding="utf-8") as f: return json.load(f)


def digest(path):
    try:
        with open(path, "rb") as f: return hashlib.sha1(f.read()).hexdigest()[:16]
    except OSError: return ""


def load_pending(p, missing_all=False):
    """Offene /__r2f-Adressen (all, urls, hashes). hashes: Pruefsumme der Seiten-Hashes, gegen die die Liste zuletzt fortgeschrieben wurde.
    Unlesbar -> alles (nichts geht verloren); fehlt die Datei: missing_all."""
    if not p or not os.path.exists(p): return missing_all, set(), None
    try:
        with open(p, encoding="utf-8") as f: d = json.load(f)
        return bool(d.get("all")), {u for u in d.get("urls") or [] if isinstance(u, str) and u.startswith("/")}, d.get("hashes") or ""
    except Exception as e:
        print("Liste der offenen R2-Adressen unlesbar:", type(e).__name__, "- beim naechsten R2-Purge wird alles geleert"); return True, set(), ""


def save_pending(p, all_, urls, hashes):
    tmp = p + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f: json.dump({"all": bool(all_), "urls": [] if all_ else sorted(urls), "hashes": hashes}, f)
    os.replace(tmp, p)


def main_r2(p, new_f=""):
    """Schritt 2: nach dem R2-Spiegel, vor der Bau-Kennung die R2-Schluessel (/__r2f<adresse>) der offenen Adressen leeren. 0 = geleert (Liste leer), 1 = Liste bleibt.
    new_f: Seiten-Hashes dieses Deploys - wurde die Liste nicht gegen genau diesen Stand fortgeschrieben (Schritt 1 abgebrochen), wird alles geleert."""
    all_, urls, hashes = load_pending(p, missing_all=True)   # fehlt die Liste, ist unbekannt, was sich geaendert hat
    if new_f and not all_ and hashes != digest(new_f):
        print("R2-Ursprung: Liste passt nicht zu den Seiten-Hashes dieses Deploys (Schritt 1 abgebrochen?) - alles leeren"); all_ = True
    print(f"R2-Ursprung: {'alles' if all_ else len(urls)} offene Adressen")
    if not os.environ.get("CLOUDFLARE_API_TOKEN"): print("::error::Kein Cloudflare-Token - R2-Kanten-Cache nicht geleert"); return 1
    zone = zone_id()
    if not zone: print("::error::Zone-ID nicht gefunden - R2-Kanten-Cache nicht geleert"); return 1
    ok = everything(zone, "R2-Ursprung: Liste unbekannt") if all_ else purge(zone, [base + R2F + q(u) for u in sorted(urls)], "R2-Ursprung")
    if not ok: print("::error::R2-Kanten-Cache nicht vollstaendig geleert - die Adressen bleiben fuer den naechsten Lauf vorgemerkt"); return 1
    save_pending(p, False, (), digest(new_f) if new_f else hashes or ""); return 0


def main(argv):
    old_f, new_f = argv[0], argv[1]
    old = rj(old_f) if os.path.exists(old_f) else {}
    new = rj(new_f)
    # Seiten nur im R2-Bucket (r2out/) zaehlen seit 11.11.2026 mit (tools/page_hashes.py, Merker /__r2out__). Im ersten Lauf damit gelten die schon vorher
    # nur dort liegenden Seiten (Blog- und Show-Sprachfassungen, Entitaeten ...; alle Seiten aus R2_KEYS = r2-keys.json, ohne Liste alle neuen) als bekannt:
    # kein einmaliger Schwall "neu" an IndexNow und kein Komplett-Purge (einmalig auch nicht fuer die in diesem Lauf neuen r2out-Seiten; neue in docs/ wie bisher).
    # Aus docs/ umgezogene Seiten stehen schon im alten Stand (gleicher Hash = unveraendert, sonst geaendert) und gelten nie als entfallen.
    try: r2keys = {"/" + (k[6:-10] if k.endswith("index.html") else k[6:]) for k in rj(os.environ["R2_KEYS"])}
    except Exception: r2keys = None
    had_r2, has_r2 = old.pop("/__r2out__", None), new.pop("/__r2out__", None); seed = []
    if old and has_r2 and not had_r2:
        seed = [u for u in new if u not in old and (r2keys is None or u in r2keys)]
        for u in seed: old[u] = new[u]
        print(f"erster Lauf mit r2out/: {len(seed)} Seiten als bekannt uebernommen")
    changed = sorted(u for u, h in new.items() if old.get(u) != h)
    gone = sorted(u for u in old if u not in new)
    # T41: optional ab dem 3. Argument - Listen der neu/geaendert nach R2 geladenen Adressen (tools/r2_pages_upload.py fuer r2out/). Seiten darin entscheidet
    # der Purge-Hash (eine nur in der Seitenleiste geaenderte Seite wird zwar neu geladen, aber nicht geleert); nicht gehashte Dateien (Transkripte, Feeds,
    # Suchindex ...) kommen in die R2-Liste. Bilder nie (kommen nie aus R2 zuerst).
    r2 = set()
    for f in argv[2:]:
        if not os.path.exists(f): continue
        try: r2 |= {u for u in rj(f) if isinstance(u, str) and u.startswith("/") and not IMG.search(u)}
        except Exception as e: print("R2-Liste nicht lesbar:", f, type(e).__name__)
    if r2: print(f"{len(r2)} R2-Seiten neu geladen")
    print(f"{len(new)} Dateien, {len(changed)} neu oder geaendert, {len(gone)} weggefallen" + ("" if old else " (kein Vorlauf: erster Vergleich)"))
    # Alter R2-Rueckfall (nach dem 404 von GitHub Pages, /__r2c<adresse>/): nur Seiten, die nur im Bucket liegen (R2_KEYS, sonst die Upload-Liste), und entfallene
    r2only = r2keys if r2keys is not None else r2
    gone_s = set(gone)
    r2c = [u for u in changed + gone if u.endswith("/") and (u in r2only or u in gone_s)]
    extra = sorted(u for u in r2 if u not in new)
    pend = os.environ.get("R2_PENDING", "")
    if pend:   # vor jedem Purge sichern: bricht dieser Schritt ab, gehen die Adressen trotzdem in Schritt 2 (bzw. den naechsten Lauf)
        p_all, p_urls, p_h = load_pending(pend)
        # Die Liste muss lueckenlos fortgeschrieben sein: zuletzt gegen genau den alten Stand dieses Laufs. Sonst lag ein Deploy dazwischen, der sie nicht
        # fortgeschrieben hat (z. B. ein Lauf mit aelterem Workflow) - dessen Aenderungen fehlen, also alles leeren. Ohne Datei: erster Lauf, /__r2f noch leer.
        if p_h is not None and p_h != digest(old_f):
            print("R2-Ursprung: Liste nicht gegen den alten Stand fortgeschrieben - nach dem R2-Spiegel wird alles geleert"); p_all = True
        p_all = p_all or not old
        p_urls |= set(changed) | gone_s | set(extra)
        save_pending(pend, p_all, p_urls, digest(new_f))
        print(f"R2-Ursprung: {'alles' if p_all else len(p_urls)} Adressen fuer den Purge nach dem R2-Spiegel vorgemerkt" + (f" (davon {len(extra)} nicht gehashte R2-Dateien)" if extra else ""))
    tok = os.environ.get("CLOUDFLARE_API_TOKEN")
    if tok:
        zone = zone_id()
        if not zone:
            print("::warning::Zone-ID nicht gefunden - kein Purge")
        elif not old:
            everything(zone, "kein Vorlauf")
        else:
            purge(zone, [base + q(u) for u in changed + gone] + [base + "/__r2c" + q(u) for u in r2c], "GitHub Pages und R2-Rueckfall")
    else:
        print("Kein Cloudflare-Token - kein Purge")

    # IndexNow: nur neue, entfallene und inhaltlich geaenderte Seiten (Titel, Beschreibung, robots, canonical und Hauptinhalt - ohne Sidebar/Kopf-/Fussleiste/Werbung/
    # Zeitangaben, tools/content_hash.py). Der Datei-Hash oben bleibt fuer den Purge.
    # Inhalts-Hashes: Umgebung OLD_CONTENT/NEW_CONTENT (Dateien). Erster Lauf ohne alte Inhalts-Hashes: nur sichern, nichts melden.
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from content_hash import indexnow_batches, indexnow_select
    key = os.environ.get("INDEXNOW_KEY", "")
    _j = lambda p: rj(p) if p and os.path.exists(p) else {}
    old_c, new_c = _j(os.environ.get("OLD_CONTENT")), _j(os.environ.get("NEW_CONTENT"))
    for u in seed:
        if u in new_c and old_c: old_c.setdefault(u, new_c[u])
    sel, st = indexnow_select(old, new, old_c, new_c)
    print(f"IndexNow: neu {st['new']}, entfallen {st['removed']}, Inhalt geaendert {st['content']}, nur Boilerplate uebersprungen {st['boilerplate']}" + (" (erster Lauf: Inhalts-Hashes gesichert, keine Meldung)" if st["seed"] else ""))
    pages = [base + q(u) for u in sel]
    if key and pages:
        host = base.split("//")[1]
        # IndexNow begrenzt den einzelnen Aufruf (10.000 Adressen), nicht die Zahl der Aufrufe: alles melden, nichts abschneiden - der neue Stand ersetzt nach diesem
        # Schritt den alten, eine ausgelassene Adresse wuerde nie nachgemeldet. Jeder Aufruf fuer sich: scheitert einer, gehen die uebrigen trotzdem raus.
        for part in indexnow_batches(pages):
            body = json.dumps({"host": host, "key": key, "keyLocation": f"{base}/{key}.txt", "urlList": part}).encode()
            try:
                with urllib.request.urlopen(urllib.request.Request("https://api.indexnow.org/indexnow", body, {"Content-Type": "application/json; charset=utf-8", "User-Agent": "m365fm-site-build/1.0 (+https://www.m365.fm/)"}), timeout=60) as r: print("IndexNow:", r.status, len(part), "Seiten gemeldet")
            except Exception as e: print("IndexNow-Fehler:", str(e)[:120], f"({len(part)} Seiten nicht gemeldet)")
    else:
        print("IndexNow: nichts zu melden")
    return 0


if __name__ == "__main__":
    a = sys.argv[1:]
    if a[:1] == ["--r2"] and len(a) in (2, 3): sys.exit(main_r2(*a[1:]))
    if len(a) < 2 or a[0].startswith("--"): print(__doc__); sys.exit(2)
    main(a)
