#!/usr/bin/env python3
"""Holt Daten direkt von Spreaker (ohne PC): data/top.json (Top-Folgen der Vorwoche je Sprach-Show, Wochen-Schnappschuss) und
ergaenzt data/published.json (Video+Sprache -> Spreaker-Episode, per Titelabgleich). Braucht SPREAKER_TOKEN (GitHub-Secret).

Wochen-Schnappschuss (Wunsch Mirko 6.11.2026: nur die Top 10 der Vorwoche, einmal je Woche):
- Zeitraum = die abgeschlossene Kalenderwoche Montag bis Sonntag (ISO-Woche, z. B. "2026-W45" = 2.-8. Nov. 2026). Gemeint ist die
  Berliner Woche; Spreaker zaehlt die Statistik aber nach UTC-Kalendertagen und nimmt nur Daten an (from/to, beide einschliesslich).
  Abgefragt werden deshalb die UTC-Tage Mo-So; das verschiebt die Grenzen um 1 h (Winterzeit) bzw. 2 h (Sommerzeit) gegenueber
  Berlin (Mo 00:00 Berlin = So 23:00/22:00 UTC) - feiner geht es mit der Spreaker-API nicht.
- Neu geholt wird erst ab Dienstag 00:00 UTC nach dem Sonntag der Woche (Spreaker-Statistik laeuft bis zu ~24 h nach), also im
  naechtlichen Bau Montag auf Dienstag (01:07 UTC = 02:07 Berlin Winterzeit, 03:07 Sommerzeit). Alle anderen Baus nutzen den
  gespeicherten Stand und fragen die Statistik nicht ab.
- Fehlt beim Abruf eine Sprache der Website (Fehler), bleibt die vorige vollstaendige Woche stehen und die naechsten Baus versuchen
  es erneut, bis alle Sprachen da sind. data/top.json wird nur bei einem vollstaendigen neuen Stand geschrieben."""
import glob, json, os, re, sys, time
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
import requests

ROOT = Path(__file__).parent
API = "https://api.spreaker.com/v2"
S = requests.Session()
BASE_LANG = {"de-de": "de", "es-us": "es", "es-es": "es", "fr-fr": "fr", "pt-br": "pt", "nl-nl": "nl"}
SITE_LANGS = ("en", "de", "es", "fr", "it", "pt", "nl", "pl", "id", "ru", "uk", "ar", "he", "ja", "ko")


def get(url, **kw):
    for a in range(5):
        r = S.get(url if url.startswith("http") else API + url, timeout=60, **kw)
        if r.status_code in (429, 500, 502, 503):
            time.sleep(int(r.headers.get("Retry-After", 0)) or 8 * (a + 1)); continue
        if r.status_code == 401:
            sys.exit("Spreaker 401: Token ungueltig/abgelaufen – neues Token als Secret SPREAKER_TOKEN eintragen.")
        r.raise_for_status()
        return r.json().get("response", {})
    raise RuntimeError("zu viele Fehlversuche " + url)


def paged(path):
    items, url = [], path
    while url:
        resp = get(url)
        items += resp.get("items", [])
        url = resp.get("next_url")
    return items


def norm_title(t):
    return re.sub(r"\W+", " ", (t or "").lower()).strip()


def episode_stats(items):
    """-> (Folgenwerte, Gesamt-Downloads); fehlende Downloadfelder bleiben None."""
    rows, total, found_downloads = [], 0, False
    for it in items:
        eid = it.get("episode_id") or (it.get("episode") or {}).get("episode_id")
        if not eid:
            continue
        nums = {k: v for k, v in it.items() if isinstance(v, (int, float)) and not isinstance(v, bool) and k not in ("episode_id", "show_id")}
        plays = sum(v for k, v in nums.items() if "play" in k.lower())
        dl = [v for k, v in nums.items() if "download" in k.lower()]
        found_downloads = found_downloads or bool(dl)
        downloads = sum(dl)
        total += downloads
        score = max(plays, downloads) if (plays or downloads) else max(nums.values(), default=0)
        rows.append({"episode_id": int(eid), "score": int(score), "plays": int(plays), "downloads": int(downloads)})
    rows.sort(key=lambda row: -row["score"])
    return rows, total if found_downloads else None


def _show_stats(items):
    rows, downloads = episode_stats(items)
    return rows, 0 if not items else downloads


def _utc(now=None):
    """'Jetzt' als UTC-Zeit (fuer Tests injizierbar; naive Zeiten gelten als UTC)."""
    now = now or datetime.now(timezone.utc)
    return now.replace(tzinfo=timezone.utc) if now.tzinfo is None else now.astimezone(timezone.utc)


def week_id(d):
    y, w, _ = d.isocalendar()
    return f"{y}-W{w:02d}"


def week_monday(wid):
    """'2026-W45' -> Montag dieser ISO-Woche (date), sonst None."""
    m = re.fullmatch(r"(\d{4})-W(\d{2})", str(wid or ""))
    try:
        return date.fromisocalendar(int(m.group(1)), int(m.group(2)), 1) if m else None
    except ValueError:
        return None


def target_week(now=None):
    """Montag der juengsten Woche, deren Statistik vollstaendig ist: Freigabe ab Dienstag 00:00 UTC nach ihrem Sonntag
    (= Montag + 8 Tage). Vorher gilt noch die Woche davor."""
    d = (_utc(now) - timedelta(days=8)).date()
    return d - timedelta(days=d.weekday())


def needs_refresh(stored_week, now=None):
    """True, wenn der gespeicherte Stand (ISO-Woche) aelter ist als die freigegebene Woche (oder fehlt, z. B. alter 7-Tage-Stand)."""
    have = week_monday(stored_week)
    return have is None or have < target_week(now)


def _load_top(root):
    try:
        data = json.loads((Path(root) / "data" / "top.json").read_text("utf-8"))
        return data if isinstance(data, dict) else {}
    except (OSError, ValueError):
        return {}


def _save_top(root, required, top, downloads, monday, now=None):
    """Schreibt den Wochen-Schnappschuss nur, wenn alle Website-Sprachen abgerufen wurden (-> True). Sonst bleibt data/top.json
    unveraendert (vorige vollstaendige Woche) und der naechste Bau versucht es erneut (-> False). Die Downloads je Sprache
    (Mediadaten, Service-Seiten) gelten fuer dieselbe Woche; fehlen dort Werte, bleibt der vorige vollstaendige Downloads-Stand."""
    if not top or not required or not required.issubset(top):
        return False
    path = Path(root) / "data" / "top.json"
    previous = _load_top(root).get("spreaker")
    start, end = monday, monday + timedelta(days=6)
    spreaker = ({"from": str(start), "to": str(end), "week": week_id(start),
                 "downloads": {lang: downloads[lang] for lang in sorted(required)}, "complete": True}
                if required.issubset(downloads) else previous)
    data = {"week": week_id(start), "from": str(start), "to": str(end), "week_end": str(end),
            "updated": _utc(now).isoformat(timespec="seconds"), "langs": top}
    if spreaker:
        data["spreaker"] = spreaker
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    return True


def refresh_top(root, shows, required, now=None, fetch=None):
    """Wochen-Schnappschuss aktualisieren, falls faellig. fetch(path) liefert die Spreaker-Eintraege (Tests: Attrappe).
    -> 'current' (gespeicherte Woche gilt noch), 'updated' (neue Woche geschrieben), 'incomplete' (vorige Woche bleibt)."""
    fetch = fetch or paged
    stored = _load_top(root)
    if not needs_refresh(stored.get("week"), now):
        return "current"
    monday = target_week(now)
    top, downloads = {}, {}
    for lang, sid in shows.items():
        try:
            tot = fetch(f"/shows/{sid}/episodes/statistics/plays/totals?from={monday}&to={monday + timedelta(days=6)}&limit=20")
            rows, total_downloads = _show_stats(tot)
            if total_downloads is not None:
                downloads[lang] = total_downloads
            top[lang] = rows[:30]
        except Exception as e:
            print("Statistik", lang, str(e)[:150])
    return "updated" if _save_top(root, required, top, downloads, monday, now) else "incomplete"


def _show_maps(show_map):
    shows = {lang: sid for lang, sid in (show_map or {}).items() if sid}
    return shows, set(shows) & set(SITE_LANGS)


def main():
    tok = os.environ.get("SPREAKER_TOKEN", "").strip()
    if tok:   # altes/ungueltiges Secret nicht blind nutzen: erst pruefen
        S.headers["Authorization"] = f"Bearer {tok}"
        if S.get(API + "/me", timeout=30).status_code == 401:
            print("SPREAKER_TOKEN (Secret) ist ungueltig – versuche OAuth-Verbindung ('Spreaker verbinden')")
            tok = ""
    if not tok and os.environ.get("SPREAKER_CLIENT_SECRET"):
        import spreaker_auth
        d = spreaker_auth.load()
        if d:
            tok = d["access_token"]
            S.headers["Authorization"] = f"Bearer {tok}"
            r = S.get(API + "/me", timeout=30)
            print("OAuth-Token geprueft:", r.status_code)
            if r.status_code == 401:   # abgelaufen -> erneuern
                tok = spreaker_auth.refresh()
        else:
            print("Keine data/spreaker_auth.enc lesbar (Client-Secret passt nicht oder Datei fehlt)")
    if not tok:
        print("Kein Spreaker-Zugang (SPREAKER_TOKEN bzw. 'Spreaker verbinden') – uebersprungen"); return
    S.headers["Authorization"] = f"Bearer {tok}"
    cfg = json.load(open(ROOT / "config.json", encoding="utf-8"))
    shows, required = _show_maps(cfg.get("show_map"))
    state = refresh_top(ROOT, shows, required)
    wk = _load_top(ROOT).get("week") or "(alter 7-Tage-Stand)"
    print({"current": f"top.json: Woche {wk} gilt noch (neue Woche ab Dienstag 00:00 UTC)",
           "updated": f"top.json: neue Woche {wk}",
           "incomplete": f"top.json: unvollständiger Sprachabruf – Woche {wk} bleibt, nächster Bau versucht es erneut"}[state])
    titles = {}
    for lang, sid in shows.items():
        try:
            titles[lang] = {norm_title(e.get("title")): e for e in paged(f"/shows/{sid}/episodes?limit=100") if e.get("published_at")}
        except Exception as e:
            print("Episodenliste", lang, str(e)[:150])
    pp = ROOT / "data" / "published.json"
    pub = json.load(open(pp, encoding="utf-8")) if pp.exists() else {}
    added = 0
    for p in glob.glob(str(ROOT / "episodes" / "*.json")):
        vid = Path(p).stem
        for l, e in json.load(open(p, encoding="utf-8")).items():
            key = f"{vid}:{BASE_LANG.get(l, l)}"
            if (pub.get(key) or {}).get("episode_id"):
                continue
            ep = (titles.get(BASE_LANG.get(l, l)) or {}).get(norm_title(e.get("title")))
            if ep:
                pub[key] = {"episode_id": ep["episode_id"], "at": ep.get("published_at") or ""}
                added += 1
    if added:
        json.dump(pub, open(pp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("published.json: +", added)


if __name__ == "__main__":
    main()
