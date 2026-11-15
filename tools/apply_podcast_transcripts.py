#!/usr/bin/env python3
"""Transkripte der Podcastfolgen bei Spreaker eintragen (transcript_url), mit der Adresse auf der eigenen Domain (Issue #266).

Ablage: transcripts/podcast/<spreaker_episode_id>.vtt (bevorzugt) oder .txt (VoiceStudio-Kette).
Der Seitenbau legt jedes Transkript neben die Folgenseite (https://www.m365.fm/show/episodes/<slug>/transcript.txt|.vtt, Sprachfassungen
unter /<lang>/...) und schreibt die Zuordnung Spreaker-ID -> Dateien nach https://www.m365.fm/show/transcripts.json (site_transcripts.py).

Fuer jede Datei unter transcripts/podcast/ (mit --all zusaetzlich fuer jede Folge aus transcripts.json, deren transcript_url leer ist oder
noch auf raw.githubusercontent.com zeigt, z. B. die Dub-Folgen):
- Die m365.fm-Adresse wird nur gesetzt, wenn sie live antwortet (HEAD 200). Ist sie schon gesetzt, passiert nichts.
- Antwortet sie (noch) nicht: an der Folge wird nichts geaendert. Einzige Ausnahme: eine Folge aus transcripts/podcast/ ganz ohne
  transcript_url (neuer Entwurf, Seite noch nicht gebaut) bekommt wie bisher die raw-URL; ein spaeterer Lauf stellt sie um.
Es wird nichts veroeffentlicht und sonst nichts an der Episode geaendert. Protokoll: transcripts/podcast/APPLIED.txt (episode_id;adresse;Zeitpunkt).
Zugang wie apply_shownotes.py: SPREAKER_TOKEN, sonst OAuth-Verbindung (spreaker_auth.py). Der Token wird nie ausgegeben.
"""
import argparse
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

DIR = ROOT / "transcripts" / "podcast"
RAW_REPO = "https://raw.githubusercontent.com/Mirko-Peters/m365-dub-downloader/"
RAW = RAW_REPO + "main/transcripts/podcast/"
TYPES = {".vtt": "text/vtt", ".txt": "text/plain"}
LOG = DIR / "APPLIED.txt"
_dom = (ROOT / "domain.txt").read_text().strip() if (ROOT / "domain.txt").exists() else "www.m365.fm"
SITE = "https://" + (_dom or "www.m365.fm")
INDEX = SITE + "/show/transcripts.json"


def files():
    out = {}
    for f in sorted(DIR.glob("*")):
        if f.suffix in TYPES and f.stem.isdigit():
            # .vtt hat Vorrang vor .txt
            if f.stem not in out or f.suffix == ".vtt":
                out[f.stem] = f
    return out


def check(f: Path) -> str:
    t = f.read_text(encoding="utf-8", errors="replace").strip()
    if len(t) < 200:
        return "zu kurz"
    if f.suffix == ".vtt" and not t.startswith("WEBVTT"):
        return "kein WEBVTT-Kopf"
    return ""


def load_index(get):
    """transcripts.json von der Website -> {spreaker_id: {"txt", "vtt", ...}}; {} bei Fehler (dann wird nichts umgestellt)."""
    try:
        r = get(INDEX, timeout=30)
        if r.status_code != 200:
            print(f"::warning::{INDEX}: HTTP {r.status_code} - keine Umstellung auf m365.fm in diesem Lauf"); return {}
        return {str(k): v for k, v in (r.json().get("by_spreaker_id") or {}).items()}
    except Exception as e:
        print(f"::warning::{INDEX} nicht lesbar ({type(e).__name__}) - keine Umstellung auf m365.fm in diesem Lauf"); return {}


def target(entry, prefer=".vtt"):
    """Eintrag aus transcripts.json -> (url, transcript_type) oder (None, None). VTT bevorzugt (Zeitmarken), wenn vorhanden."""
    if not entry: return None, None
    if prefer == ".vtt" and entry.get("vtt"): return entry["vtt"], TYPES[".vtt"]
    if entry.get("txt"): return entry["txt"], TYPES[".txt"]
    if entry.get("vtt"): return entry["vtt"], TYPES[".vtt"]
    return None, None


def is_live(head, url):
    """HEAD 200 (ohne Weiterleitung) = Datei ist auf der Website erreichbar."""
    try:
        return head(url, timeout=20, allow_redirects=False).status_code == 200
    except Exception:
        return False


def decide(cur, new_url, live, raw_url=None):
    """Was mit transcript_url passiert: ('set', url) oder ('skip', grund).
    cur = aktuelle transcript_url; new_url = Adresse auf m365.fm (oder None); live = HEAD 200; raw_url = Rueckfall fuer eigene Dateien."""
    cur = cur or ""
    if new_url and cur == new_url: return "skip", "schon gesetzt"
    if new_url and live: return "set", new_url
    if not cur and raw_url: return "set", raw_url   # neuer Entwurf ohne Transkript: bisheriger Weg, bis die Seite gebaut ist
    return "skip", ("m365.fm-Adresse nicht erreichbar" if new_url else "nicht im Transkript-Index") + " - unveraendert"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--check", action="store_true", help="nur Dateien pruefen, ohne API")
    ap.add_argument("--all", action="store_true", help="einmalig: auch alle Folgen aus transcripts.json umstellen, deren transcript_url leer ist oder auf raw.githubusercontent.com zeigt")
    a = ap.parse_args()

    fs = files()
    print(f"{len(fs)} Transkript-Dateien unter transcripts/podcast/")
    bad = {k: check(f) for k, f in fs.items() if check(f)}
    for k, why in bad.items():
        print(f"::warning::{fs[k].name}: {why} - wird uebersprungen")
    if a.check:
        return 1 if bad else 0

    from apply_shownotes import Spreaker  # noqa: E402  (gleicher Zugang, gleiche Wiederholungslogik)
    import requests
    web = requests.Session()
    # www.m365.fm liegt hinter Cloudflare: ohne eigene Kennung antwortet es Python-Clients mit 403 (dann bliebe alles auf der raw-URL)
    web.headers["User-Agent"] = "m365fm-actions/1.0 (+https://www.m365.fm)"
    idx = load_index(web.get)
    print(f"Transkript-Index: {len(idx)} Folgen mit Spreaker-ID")
    sp = Spreaker()
    if not sp.login():
        return 1
    todo = [(eid, f) for eid, f in fs.items() if eid not in bad]
    if a.all:
        todo += [(eid, None) for eid in sorted(idx) if eid not in fs]
    done, log, kept = 0, [], 0
    for eid, f in todo:
        new_url, ttype = target(idx.get(eid), f.suffix if f else ".vtt")
        try:
            ep = sp.req("GET", f"/episodes/{eid}").get("episode", {})
        except Exception as e:
            print(f"::warning::{eid}: Episode nicht lesbar ({e})")
            continue
        cur = ep.get("transcript_url") or ""
        if f is None and cur and not (cur.startswith(RAW_REPO) or cur.startswith(SITE + "/")):
            continue   # --all: fremde Transkripte (z. B. von Spreaker selbst) bleiben unberuehrt; eigene m365.fm-Adressen werden nachgezogen (z. B. nach Slug-Aenderung)
        live = bool(new_url) and cur != new_url and is_live(web.head, new_url)
        act, val = decide(cur, new_url, live, (RAW + f.name) if f else None)
        if act == "skip":
            if val != "schon gesetzt": kept += 1; print(f"{eid}: {val}")
            continue
        typ = ttype if val == new_url else TYPES[f.suffix]
        print(f"{eid} '{(ep.get('title') or '')[:60]}': transcript_url -> {val}" + (" (Dry-Run)" if a.dry_run else ""))
        if a.dry_run:
            continue
        try:
            sp.req("POST", f"/episodes/{eid}", data={"transcript_url": val, "transcript_type": typ})
            done += 1
            log.append(f"{eid};{val};{time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime())}")
        except Exception as e:
            print(f"::warning::{eid}: Setzen fehlgeschlagen ({e})")
    if log:
        with LOG.open("a", encoding="utf-8") as h:
            h.write("\n".join(log) + "\n")
    print(f"Gesetzt: {done}, unveraendert gelassen: {kept}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
