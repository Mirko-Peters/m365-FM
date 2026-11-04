#!/usr/bin/env python3
"""Holt Daten direkt von Spreaker (ohne PC): data/top.json (Top-Folgen der letzten 7 Tage je Sprach-Show) und
ergaenzt data/published.json (Video+Sprache -> Spreaker-Episode, per Titelabgleich). Braucht SPREAKER_TOKEN (GitHub-Secret)."""
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


def _save_top(root, required, top, downloads, start, end):
    if not required or not required.issubset(top) or not required.issubset(downloads):
        return False
    data = {"from": str(start), "week_end": str(end), "updated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "spreaker": {"from": str(start), "to": str(end), "downloads": downloads, "complete": True}, "langs": top}
    with open(Path(root) / "data" / "top.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    return True


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
    shows = {l: s for l, s in (cfg.get("show_map") or {}).items() if s and l in SITE_LANGS}
    end = date.today(); start = end - timedelta(days=7)
    top, titles, downloads = {}, {}, {}
    for lang, sid in shows.items():
        try:
            tot = paged(f"/shows/{sid}/episodes/statistics/plays/totals?from={start}&to={end}&limit=20")
            rows, total_downloads = episode_stats(tot)
            if total_downloads is not None:
                downloads[lang] = total_downloads
            top[lang] = rows[:30]
        except Exception as e:
            print("Statistik", lang, str(e)[:150])
        try:
            titles[lang] = {norm_title(e.get("title")): e for e in paged(f"/shows/{sid}/episodes?limit=100") if e.get("published_at")}
        except Exception as e:
            print("Episodenliste", lang, str(e)[:150])
    required = set(shows)
    if _save_top(ROOT, required, top, downloads, start, end):
        print("top.json:", {l: len(r) for l, r in top.items()})
    else:
        print("top.json: unvollständiger Sprachabruf – letzter vollständiger Stand bleibt erhalten")
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
