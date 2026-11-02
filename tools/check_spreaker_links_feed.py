"""T36 Nachkontrolle: Steht das gesetzte Website-Feld (episode_link) auch im oeffentlichen RSS als <link> der Folge?
Liest data/spreaker_links.tsv (letzter Eintrag je Folge mit Status ok) und die RSS-Feeds der Hauptshow und der 14 Sprach-Shows.
Bericht: reports/spreaker-links-feed.md/.json (nur Folgen-IDs, Adressen und Zahlen). Nur lesen, aendert nichts bei Spreaker."""
import json, re, sys, time, urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOG = ROOT / "data" / "spreaker_links.tsv"
OUT = ROOT / "reports" / "spreaker-links-feed"
MAIN_SHOW = 6704921


def get(u):
    for a in range(4):
        try:
            return urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "m365-site-bot"}), timeout=90).read().decode("utf-8", "replace")
        except Exception:
            if a == 3: raise
            time.sleep(4 * (a + 1))


def shows():
    """Show-IDs der Sprach-Shows aus LANGS in generate_site.py lesen (ohne den Seitenbau zu importieren)."""
    src = (ROOT / "generate_site.py").read_text("utf-8")
    ids = [int(x) for x in re.findall(r'"[a-z]{2}": \("[^"]+", "[a-z-]+", "(?:ltr|rtl)", (\d{6,}),', src)]
    return [MAIN_SHOW] + [i for i in dict.fromkeys(ids) if i != MAIN_SHOW]


def main():
    want = {}
    if LOG.exists():
        for line in LOG.read_text("utf-8").splitlines():
            f = line.split("\t")
            if len(f) >= 5 and f[1].isdigit(): want[f[1]] = (f[2], f[4])   # letzter Eintrag zaehlt
    want = {k: v[1] for k, v in want.items() if v[0] == "ok" and v[1]}
    feed, errs = {}, []
    for sid in shows():
        u = f"https://www.spreaker.com/show/{sid}/episodes/feed"
        try: root = ET.fromstring(get(u))
        except Exception as e: errs.append(f"{sid}: {type(e).__name__}"); continue
        for it in root.iter("item"):
            ids = re.findall(r"/episode/(\d+)|episode[_/-]?(\d{6,})", (it.findtext("guid") or "") + " " + " ".join(x.get("url", "") for x in it.iter("enclosure")))
            ids = {a or b for a, b in ids}
            for i in ids: feed[i] = (it.findtext("link") or "").strip()
    rows, n = [], {"ok": 0, "anders": 0, "nicht_im_feed": 0}
    for eid, url in sorted(want.items()):
        got = feed.get(eid)
        st = "nicht_im_feed" if got is None else ("ok" if got.rstrip("/") == url.rstrip("/") else "anders")
        n[st] += 1
        if st != "ok": rows.append({"id": eid, "soll": url, "feed": got, "status": st})
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.with_suffix(".json").write_text(json.dumps({"gesetzt": len(want), **n, "feed_fehler": errs, "abweichungen": rows[:500]}, ensure_ascii=False, indent=1), "utf-8")
    md = [f"# Spreaker-Website-Feld im RSS ({time.strftime('%Y-%m-%d %H:%M UTC', time.gmtime())})", "",
          f"Gesetzt laut Protokoll: {len(want)} · im Feed gleich: {n['ok']} · im Feed anders: {n['anders']} · nicht im Feed: {n['nicht_im_feed']}", ""]
    if errs: md += ["Feeds nicht lesbar: " + ", ".join(errs), ""]
    md += [f"- {r['id']}: {r['status']} · soll {r['soll']} · Feed {r['feed']}" for r in rows[:100]]
    (OUT.with_suffix(".md")).write_text("\n".join(md) + "\n", "utf-8")
    print("\n".join(md[:4]))
    return 1 if n["anders"] else 0


if __name__ == "__main__":
    sys.exit(main())
