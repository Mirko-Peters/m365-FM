#!/usr/bin/env python3
"""Transkripte der neu produzierten Podcastfolgen (VoiceStudio-Kette) bei Spreaker eintragen.

Ablage: transcripts/podcast/<spreaker_episode_id>.vtt (bevorzugt) oder .txt
Oeffentlich ueber https://raw.githubusercontent.com/Mirko-Peters/m365-dub-downloader/main/transcripts/podcast/<datei>
(wie die Dub-Transkripte, siehe AUTOMATION.md).

Fuer jede Datei: Episode bei Spreaker lesen; ist transcript_url leer oder anders, wird sie gesetzt.
Funktioniert auch fuer Entwuerfe; es wird nichts veroeffentlicht und sonst nichts an der Episode geaendert.
Protokoll: transcripts/podcast/APPLIED.txt (episode_id;datei;Zeitpunkt).
Zugang wie apply_shownotes.py: SPREAKER_TOKEN, sonst OAuth-Verbindung (spreaker_auth.py). Der Token wird nie ausgegeben.
"""
import argparse
import os
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from apply_shownotes import Spreaker  # noqa: E402  (gleicher Zugang, gleiche Wiederholungslogik)

DIR = ROOT / "transcripts" / "podcast"
RAW = "https://raw.githubusercontent.com/Mirko-Peters/m365-dub-downloader/main/transcripts/podcast/"
TYPES = {".vtt": "text/vtt", ".txt": "text/plain"}
LOG = DIR / "APPLIED.txt"


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


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--check", action="store_true", help="nur Dateien pruefen, ohne API")
    a = ap.parse_args()

    fs = files()
    print(f"{len(fs)} Transkript-Dateien unter transcripts/podcast/")
    bad = {k: check(f) for k, f in fs.items() if check(f)}
    for k, why in bad.items():
        print(f"::warning::{fs[k].name}: {why} - wird uebersprungen")
    if a.check:
        return 1 if bad else 0

    sp = Spreaker()
    if not sp.login():
        return 1
    done, log = 0, []
    for eid, f in fs.items():
        if eid in bad:
            continue
        url = RAW + f.name
        try:
            ep = sp.req("GET", f"/episodes/{eid}").get("episode", {})
        except Exception as e:
            print(f"::warning::{eid}: Episode nicht lesbar ({e})")
            continue
        if ep.get("transcript_url") == url:
            continue
        print(f"{eid} '{(ep.get('title') or '')[:60]}': transcript_url -> {f.name}" + (" (Dry-Run)" if a.dry_run else ""))
        if a.dry_run:
            continue
        try:
            sp.req("POST", f"/episodes/{eid}", data={"transcript_url": url, "transcript_type": TYPES[f.suffix]})
            done += 1
            log.append(f"{eid};{f.name};{time.strftime('%Y-%m-%dT%H:%MZ', time.gmtime())}")
        except Exception as e:
            print(f"::warning::{eid}: Setzen fehlgeschlagen ({e})")
    if log:
        with LOG.open("a", encoding="utf-8") as h:
            h.write("\n".join(log) + "\n")
    print(f"Gesetzt: {done}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
