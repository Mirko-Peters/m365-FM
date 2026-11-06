"""Neue Folgen fuer den Seitenbau erkennen - damit neue Episodenseiten am selben Tag entstehen, ohne dass jeder Daten-Commit
einen Seitenbau ausloest (site.yml baut sonst nur naechtlich und bei Code-Pushes).

Laeuft in .github/workflows/spreaker-feed-check.yml (alle 2 h nach "Shownotes nach Spreaker schreiben"). Nur oeffentliche RSS-Feeds,
kein Spreaker-Zugang. Als neu gilt eine Folge, die der naechste Seitenbau als Seite anlegen wuerde, die die Website aber noch nicht hat:
  - Hauptshow (Spreaker 6704921): Folge im RSS (pubDate vergangen, hoechstens MAX_AGE_D Tage alt), deren Spreaker-ID nicht in
    data/en_episodes.json steht (fetch_en_episodes.py traegt sie beim naechsten nicht-Push-Bau ein, site_podpage.py baut die Seite).
  - Sprach-Shows: Dub-Fassung aus episodes/<video>.json ohne Folgen-ID in data/published.json, deren Titel im RSS der Sprach-Show
    schon veroeffentlicht ist - derselbe Titelabgleich wie sync_spreaker.py, der sie im Bau nach data/published.json uebernimmt.
Gestartet wird nur, wenn kein Seitenbau laeuft oder wartet und der letzte (nicht abgebrochene) Seitenbau mindestens
SITE_FRESH_GAP_H Stunden (Repo-Variable, Standard 6) zurueckliegt - so bleibt es bei wenigen Frische-Baus am Tag, auch wenn
stuendlich Folgen erscheinen.

Ausgabe: dispatch=1|0 und reason=... in $GITHUB_OUTPUT, Zusammenfassung in $GITHUB_STEP_SUMMARY. Den Start selbst macht der Workflow
(gh workflow run site.yml -f mode=fresh). Aufruf: python tools/new_episodes_check.py [--no-github]"""
import argparse, json, os, re, sys, time, urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FEED = "https://www.spreaker.com/show/{sid}/episodes/feed"
MAIN_SHOW = 6704921
SITE_LANGS = ("de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")   # wie LANGS in generate_site.py
BASE_LANG = {"de-de": "de", "es-us": "es", "es-es": "es", "fr-fr": "fr", "pt-br": "pt", "nl-nl": "nl"}   # wie sync_spreaker.py
MAX_AGE_D = 3
BUSY = {"queued", "in_progress", "waiting", "requested", "pending"}
UA = {"User-Agent": "m365-site-bot (new episodes)"}


def norm_title(t):   # wie sync_spreaker.norm_title (tests/test_new_episodes_check.py prueft die Gleichheit)
    return re.sub(r"\W+", " ", (t or "").lower()).strip()


def spreaker_id(audio, guid):   # wie fetch_en_episodes.py
    m = re.search(r"episodes?/[^/]*?(\d{6,})", audio or "") or re.search(r"(\d{6,})", guid or "")
    return m.group(1) if m else ""


def get(url, tries=3):
    for a in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90).read().decode("utf-8", "replace")
        except Exception:
            if a + 1 == tries: raise
            time.sleep(4 * (a + 1))


def feed_items(xml):
    """RSS -> [{title, guid, audio, pub (datetime UTC oder None)}]"""
    out = []
    for it in ET.fromstring(xml).iter("item"):
        enc = it.find("enclosure")
        try: pub = parsedate_to_datetime((it.findtext("pubDate") or "").strip()).astimezone(timezone.utc)
        except (TypeError, ValueError, IndexError): pub = None
        out.append({"title": (it.findtext("title") or "").strip(), "guid": (it.findtext("guid") or "").strip(),
                    "audio": enc.get("url") if enc is not None else "", "pub": pub})
    return out


def published_now(item, now, max_age_d=MAX_AGE_D):
    return item["pub"] is not None and now - timedelta(days=max_age_d) <= item["pub"] <= now


def pending_dubs(root=ROOT):
    """Dub-Fassungen, die der Bau anlegen wuerde, sobald Spreaker sie veroeffentlicht: {sprache: {norm. Titel: "video:sprache"}}"""
    pp = root / "data" / "published.json"
    pub = json.loads(pp.read_text("utf-8")) if pp.exists() else {}
    out = {}
    for p in sorted((root / "episodes").glob("*.json")):
        for l, e in json.loads(p.read_text("utf-8")).items():
            lang = BASE_LANG.get(l, l)
            key = f"{p.stem}:{lang}"
            if lang in SITE_LANGS and not (pub.get(key) or {}).get("episode_id") and e.get("title"):
                out.setdefault(lang, {})[norm_title(e["title"])] = key
    return out


def known_main_ids(root=ROOT):
    f = root / "data" / "en_episodes.json"
    d = json.loads(f.read_text("utf-8")) if f.exists() else {}
    return {str(v.get("spreaker_id") or spreaker_id(v.get("audio"), v.get("guid"))) for v in d.values()} - {""}


def new_main(items, known, now):
    return [x for x in items if published_now(x, now) and spreaker_id(x["audio"], x["guid"]) and spreaker_id(x["audio"], x["guid"]) not in known]


def new_dubs(items, pending, now):
    """Feed einer Sprach-Show + offene Titel dieser Sprache -> Schluessel "video:sprache", die beim naechsten Bau eine Seite bekommen"""
    hits = []
    for x in items:
        k = pending.get(norm_title(x["title"]))
        if k and x["pub"] is not None and x["pub"] <= now and k not in hits: hits.append(k)
    return hits


def decide(new_count, runs, now, gap_h):
    """runs: Laeufe von site.yml (GitHub-API, neueste zuerst) -> (starten?, Grund)"""
    if not new_count:
        return False, "keine neuen Folgen"
    if any(r.get("status") in BUSY for r in runs):
        return False, "ein Seitenbau laeuft oder wartet bereits"
    done = [r for r in runs if r.get("conclusion") not in ("cancelled", "skipped")]
    if done:
        last = datetime.fromisoformat(done[0]["created_at"].replace("Z", "+00:00"))
        age = (now - last).total_seconds() / 3600
        if age < gap_h:
            return False, f"letzter Seitenbau vor {age:.1f} h (Abstand mindestens {gap_h:g} h) - der naechste Lauf prueft erneut"
    return True, f"{new_count} neue Folge(n) ohne Seite"


def site_runs():
    repo, tok = os.environ.get("GITHUB_REPOSITORY"), os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if not repo or not tok:
        return None
    req = urllib.request.Request(f"https://api.github.com/repos/{repo}/actions/workflows/site.yml/runs?per_page=30",
                                 headers={**UA, "Authorization": f"Bearer {tok}", "Accept": "application/vnd.github+json"})
    return json.loads(urllib.request.urlopen(req, timeout=60).read().decode("utf-8")).get("workflow_runs", [])


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--no-github", action="store_true", help="nur erkennen, keine Laeufe abfragen")
    a = ap.parse_args()
    now = datetime.now(timezone.utc)
    cfg = json.loads((ROOT / "config.json").read_text("utf-8")).get("show_map") or {}
    found, lines = [], []
    try:
        nm = new_main(feed_items(get(FEED.format(sid=cfg.get("en") or MAIN_SHOW))), known_main_ids(), now)
        found += [f"en:{spreaker_id(x['audio'], x['guid'])}" for x in nm]
        lines += [f"- Hauptshow: {x['title'][:90]}" for x in nm]
    except Exception as e:
        print(f"::warning::RSS der Hauptshow nicht lesbar: {type(e).__name__}")
    for lang, titles in pending_dubs().items():
        if not cfg.get(lang): continue
        try:
            hits = new_dubs(feed_items(get(FEED.format(sid=cfg[lang]))), titles, now)
        except Exception as e:
            print(f"::warning::RSS {lang} nicht lesbar: {type(e).__name__}"); continue
        found += hits; lines += [f"- {k}" for k in hits]
    runs = [] if a.no_github else site_runs()
    if runs is None:
        go, why = False, "kein GITHUB_TOKEN/GITHUB_REPOSITORY - nur Erkennung"
    else:
        gap = float(os.environ.get("SITE_FRESH_GAP_H") or 6)
        go, why = decide(len(found), runs, now, gap)
    print(f"Neue Folgen ohne Seite: {len(found)}" + "".join("\n" + x for x in lines[:40]))
    print(("Seitenbau starten: " if go else "Kein Seitenbau: ") + why)
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as f: f.write(f"dispatch={1 if go else 0}\nreason={why}\n")
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as f:
            f.write(f"### Neue Folgen fuer die Website\n\n{len(found)} neue Folge(n) ohne Seite. {'Seitenbau (mode=fresh) gestartet' if go else 'Kein Seitenbau'}: {why}\n\n" + "\n".join(lines[:40]) + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
