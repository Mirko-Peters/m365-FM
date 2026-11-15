"""Nach dem Deploy: Vergleich der Seiten-Hashes mit dem letzten Lauf -> nur geaenderte Adressen im Cloudflare-Cache leeren (30 je Aufruf) und bei IndexNow melden.
Bei mehr als MAX_URLS Aenderungen (z. B. neues Stylesheet in jeder Seite) wird einmal alles geleert. Aufruf: python tools/purge_changed.py alt.json neu.json
Umgebung: CLOUDFLARE_API_TOKEN, CF_ZONE_ID (optional, sonst Zonensuche), BASE (https://www.m365.fm), INDEXNOW_KEY"""
import json, os, re, sys, time, urllib.parse, urllib.request

MAX_URLS = 3000
old_f, new_f = sys.argv[1], sys.argv[2]
base = os.environ.get("BASE", "https://www.m365.fm").rstrip("/")
old = json.load(open(old_f)) if os.path.exists(old_f) else {}
new = json.load(open(new_f))
# Seiten nur im R2-Bucket (r2out/) zaehlen seit 11.11.2026 mit (tools/page_hashes.py, Merker /__r2out__). Im ersten Lauf damit gelten die schon vorher
# nur dort liegenden Seiten (Blog- und Show-Sprachfassungen, Entitaeten ...; alle Seiten aus R2_KEYS = r2-keys.json, ohne Liste alle neuen) als bekannt:
# kein einmaliger Schwall "neu" an IndexNow und kein Komplett-Purge (einmalig auch nicht fuer die in diesem Lauf neuen r2out-Seiten; neue in docs/ wie bisher).
# Aus docs/ umgezogene Seiten stehen schon im alten Stand (gleicher Hash = unveraendert, sonst geaendert) und gelten nie als entfallen.
had_r2, has_r2 = old.pop("/__r2out__", None), new.pop("/__r2out__", None); seed = []
if old and has_r2 and not had_r2:
    try: known = {"/" + (k[6:-10] if k.endswith("index.html") else k[6:]) for k in json.load(open(os.environ["R2_KEYS"]))}
    except Exception: known = None
    seed = [u for u in new if u not in old and (known is None or u in known)]
    for u in seed: old[u] = new[u]
    print(f"erster Lauf mit r2out/: {len(seed)} Seiten als bekannt uebernommen")
changed = sorted(u for u, h in new.items() if old.get(u) != h)
gone = sorted(u for u in old if u not in new)
# T41: optional ab dem 3. Argument - Listen der neu/geaendert nach R2 geladenen Adressen (tools/r2_pages_upload.py fuer r2out/);
# der alte R2-Rueckfall des Site-Workers cacht diese Seiten unter /__r2c<adresse>. Bilder nie (kommen nie aus R2).
# Der Spiegel der Website (R2 als Ursprung) braucht keinen Purge: dort steht die Bau-Kennung im Cache-Schluessel (/__r2c/@<kennung><adresse>).
IMG = re.compile(r"\.(png|jpe?g|gif|webp|avif|svg|ico)$", re.I)
r2 = set()
for f in sys.argv[3:]:
    if not os.path.exists(f): continue
    try: r2 |= {u for u in json.load(open(f)) if isinstance(u, str) and u.startswith("/")}
    except Exception as e: print("R2-Liste nicht lesbar:", f, type(e).__name__)
r2 = sorted(u for u in r2 if not IMG.search(u))
q = lambda u: urllib.parse.quote(u, safe="/%:@!$&'()*+,;=-._~")   # Adressen wie im Browser (Prozent-Kodierung), sonst trifft der Purge Unicode-Pfade nicht
if r2: print(f"{len(r2)} R2-Seiten neu oder geaendert")
print(f"{len(new)} Dateien, {len(changed)} neu oder geaendert, {len(gone)} weggefallen" + ("" if old else " (kein Vorlauf: erster Vergleich)"))


def cf(path, body):
    req = urllib.request.Request("https://api.cloudflare.com/client/v4" + path, json.dumps(body).encode(), {"Authorization": "Bearer " + os.environ["CLOUDFLARE_API_TOKEN"], "Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=60) as r: return json.load(r)


tok = os.environ.get("CLOUDFLARE_API_TOKEN"); zone = os.environ.get("CF_ZONE_ID", "")
if tok:
    if not zone:
        with urllib.request.urlopen(urllib.request.Request("https://api.cloudflare.com/client/v4/zones?name=m365.fm", headers={"Authorization": "Bearer " + tok}), timeout=60) as r:
            res = json.load(r).get("result") or []; zone = res[0]["id"] if res else ""
    if not zone:
        print("::warning::Zone-ID nicht gefunden - kein Purge")
    elif not old or len(changed) + len(gone) + len(r2) > MAX_URLS:
        d = cf(f"/zones/{zone}/purge_cache", {"purge_everything": True}); print("Cache komplett geleert:", d.get("success"))
    else:
        urls = [base + q(u) for u in changed + gone] + [base + "/__r2c" + q(u) for u in r2]; ok = 0
        for i in range(0, len(urls), 30):
            d = cf(f"/zones/{zone}/purge_cache", {"files": urls[i:i + 30]}); ok += len(urls[i:i + 30]) if d.get("success") else 0
            if not d.get("success"): print("Purge-Fehler:", [e.get("message") for e in d.get("errors", [])][:2]); time.sleep(1)
        print(f"Cache geleert fuer {ok} Adressen")
else:
    print("Kein Cloudflare-Token - kein Purge")

# IndexNow: nur neue, entfallene und inhaltlich geaenderte Seiten (Titel, Beschreibung, robots, canonical und Hauptinhalt - ohne Sidebar/Kopf-/Fussleiste/Werbung/
# Zeitangaben, tools/content_hash.py). Der Datei-Hash oben bleibt fuer den Purge.
# Inhalts-Hashes: Umgebung OLD_CONTENT/NEW_CONTENT (Dateien). Erster Lauf ohne alte Inhalts-Hashes: nur sichern, nichts melden.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content_hash import indexnow_batches, indexnow_select
key = os.environ.get("INDEXNOW_KEY", "")
_j = lambda p: json.load(open(p)) if p and os.path.exists(p) else {}
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
