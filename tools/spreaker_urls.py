#!/usr/bin/env python3
"""Spreaker-Folgen <-> kanonische m365.fm-Adresse (alle Shows, alle Sprachen).

Seit der Umstellung der Adressen (Sprachstartseiten /<sprache>/, Podcast /<sprache>/podcast/, englische Folgen /show/episodes/<slug>/,
Sprachfolgen /<sprache>/<slug>/) steht bei Spreaker oft noch die alte Adresse: im Feld "Website" (API: episode_link, im RSS <link>) und in
Links der Beschreibung (description_html). Dieses Werkzeug gleicht beides mit der Seite ab.

Modi
  plan    Probelauf, schreibt nichts: je Show Zahl der Folgen mit abweichender Adresse plus 10 Beispiele alt -> neu.
  apply   Aendert bei Spreaker nur m365.fm-Adressen: episode_link auf die kanonische Adresse und m365.fm-Links in description_html
          (eigene Folgenseite -> kanonisch, sonstige alte Adresse -> Endziel der Weiterleitungstabelle in einem Schritt).
          Nie Titel, Status, Sichtbarkeit, Veroeffentlichung, Audio; nur veroeffentlichte Folgen. Mit Pause je Aufruf, wiederaufnehmbar
          (Protokoll data/spreaker_urls.tsv; ein zweiter Lauf fasst Erledigtes nicht noch einmal an), --limit begrenzt die Aenderungen je Lauf.
  export  Schreibt die Zuordnung Folge <-> Adresse als JSON (Quelle des Workers, Tabelle episode_urls).

Quelle der kanonischen Adresse: spreaker-urls.json des Seitenbaus (generate_site.py -> site_episode_urls.episode_url, dieselbe Funktion wie
die Seiten selbst); alte Adressen werden mit site_links.Resolver und show/redirects.json (derselben Tabelle wie der Site-Worker) in einem
Schritt aufgeloest. Folgen ohne Seite (noch nicht gebaut) werden uebersprungen und aufgelistet. Zustand je Folge fuer den Admin-Bereich:
data/spreaker_urls_state.json (ok / differs / missing / skipped / error).
Aufruf: python tools/spreaker_urls.py plan|apply|export [--limit N] [--ids 1,2] [--show 7393187] [--map PFAD|URL] [--redirects PFAD|URL]"""
import argparse, json, re, sys, time, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(Path(__file__).resolve().parent))
import site_links as SL

LOG = ROOT / "data" / "spreaker_urls.tsv"
STATE = ROOT / "data" / "spreaker_urls_state.json"
MAP_URL = "https://www.m365.fm/spreaker-urls.json"
RED_URL = "https://www.m365.fm/show/redirects.json"
UA = {"User-Agent": "m365-site-bot (spreaker urls)"}
URL_RE = re.compile(r"https?://(?:www\.|dub\.)?m365\.fm(?:[/?#][^\s\"'<>)\]]*)?", re.I)
TRAIL = ".,;:!?"


# ---------------------------------------------------------------- Quellen
def load_json(src):
    if re.match(r"https?://", src):
        with urllib.request.urlopen(urllib.request.Request(src, headers=UA), timeout=90) as r:
            return json.loads(r.read().decode("utf-8"))
    return json.loads(Path(src).read_text("utf-8"))


def load_mapping(src):
    """{episode_id(str): {show_id, lang, slug, url}} aus spreaker-urls.json."""
    d = load_json(src)
    return {str(x["spreaker_episode_id"]): x for x in d.get("items", [])}


def make_resolver(src):
    table = load_json(src) if src else {}
    return SL.Resolver(table if isinstance(table, dict) else {}, SL.Site())


# ---------------------------------------------------------------- Umschreiben (rein, ohne Netz)
def resolve_url(url, res):
    """Alte Adresse -> Endziel in einem Schritt (Weiterleitungstabelle); unveraendert, wenn nichts weiterleitet."""
    new, st, _ = SL.fix_href(url, res)
    return new or url


def final_url(url, res):
    """Endgueltige Adresse nach der Weiterleitungstabelle, immer als absolute https-Adresse (Anker/Query bleiben)."""
    u = resolve_url(url, res)
    if u.startswith("/"):
        u = "https://" + SL.WWW + u
    return u


def _split(url):
    m = re.match(r"^(https?://[^/?#]+)([^?#]*)(.*)$", url)
    return m.group(1), m.group(2), m.group(3)


def is_own_page(url, slug, res):
    """Verweist die Adresse auf die Seite dieser Folge (letztes Pfadstueck = Slug), direkt oder nach der Weiterleitung?"""
    for u in (url, final_url(url, res)):
        parts = [x for x in _split(u)[1].split("/") if x]
        if parts and parts[-1] == slug:
            return True
    return False


def target_for(url, canonical, slug, res):
    """Neue Adresse fuer eine m365.fm-Adresse in der Beschreibung: eigene Folgenseite -> kanonisch (Query/Anker bleiben), sonst
    nur die Weiterleitung aufloesen. Gleich zurueck, wenn nichts zu aendern ist."""
    if is_own_page(url, slug, res):
        return canonical.rstrip("/") + "/" + (_split(url)[2] if _split(url)[2] else "")
    return final_url(url, res) if resolve_url(url, res) != url else url


def rewrite_text(text, canonical, slug, res):
    """Ersetzt nur m365.fm-Adressen (in href und im Fliesstext); alles andere bleibt Byte fuer Byte. -> (neuer Text, [(alt, neu)])."""
    changes = []
    def sub(m):
        raw = m.group(0)
        core = raw.rstrip(TRAIL); tail = raw[len(core):]
        new = target_for(core, canonical, slug, res)
        if new != core:
            changes.append((core, new))
        return new + tail
    return URL_RE.sub(sub, text or ""), changes


def plan_episode(ep, page, res):
    """Was bei dieser Folge zu aendern ist: {fields: {feld: neuer Wert}, changes: [(alt, neu)], old_link} ."""
    url, slug = page["url"], page["slug"]
    fields, changes = {}, []
    old = (ep.get("episode_link") or "").strip()
    if old != url:
        fields["episode_link"] = url
        changes.append((old or "(leer)", url))
    html = ep.get("description_html") or ""
    if html:
        new, ch = rewrite_text(html, url, slug, res)
        if ch:
            fields["description_html"] = new; changes += ch
    else:   # nur Text vorhanden: description (Klartext) umschreiben
        desc = ep.get("description") or ""
        new, ch = rewrite_text(desc, url, slug, res)
        if ch:
            fields["description"] = new; changes += ch
    return {"fields": fields, "changes": changes, "old_link": old}


# ---------------------------------------------------------------- Protokoll und Zustand
def now():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def read_log(path=None):
    out = {}
    p = path or LOG
    if p.exists():
        for line in p.read_text("utf-8").splitlines():
            f = line.split("\t")
            if len(f) >= 5 and f[1].isdigit():
                out[f[1]] = {"status": f[2], "new": f[5] if len(f) > 5 else ""}
    return out


def log(eid, status, fields, old, new, note="", path=None, quiet=False):
    p = path or LOG
    p.parent.mkdir(parents=True, exist_ok=True)
    with p.open("a", encoding="utf-8") as f:
        f.write("\t".join([now(), str(eid), status, ",".join(fields), (old or "").replace("\t", " ")[:300], (new or "").replace("\t", " ")[:300], note.replace("\t", " ")[:200]]) + "\n")
    if not quiet:
        print(f"{eid}\t{status}\t{','.join(fields)}\t{old or '-'} -> {new or '-'}\t{note}", flush=True)


def published(ep):
    """Nur veroeffentlichte Folgen (wie tools/set_spreaker_links.py): Datum erreicht, oeffentlich, nicht versteckt."""
    try:
        when = datetime.strptime((ep.get("published_at") or "")[:19], "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
    except ValueError:
        return False
    if when > datetime.now(timezone.utc):
        return False
    return str(ep.get("visibility", "PUBLIC")).upper() in ("PUBLIC", "") and ep.get("hidden") not in (True, "true", 1)


# ---------------------------------------------------------------- Spreaker lesen/schreiben
def episodes_of_show(sp, show_id):
    return sp.paged(f"/shows/{show_id}/episodes?limit=100")


def full_episode(sp, item):
    """Listeneintraege enthalten je nach Spreaker-Antwort nicht alle Felder: dann die Einzelabfrage."""
    if "episode_link" in item and ("description_html" in item or "description" in item) and "published_at" in item:
        return item
    return sp.req("GET", f"/episodes/{item['episode_id']}")["episode"]


def scan(sp, pages, show_ids, only_ids=None, pause=0.0):
    """Je Show alle Folgen lesen. Erzeugt (show_id, ep, page|None) fuer jede Folge."""
    for sid in show_ids:
        for item in episodes_of_show(sp, sid):
            eid = str(item["episode_id"])
            if only_ids and eid not in only_ids:
                continue
            page = pages.get(eid)
            if not page:
                yield sid, item, None; continue
            yield sid, full_episode(sp, item), page
            if pause: time.sleep(pause)


def classify(sid, ep, page, res):
    eid = str(ep["episode_id"])
    if page is None:
        return {"id": eid, "show": sid, "status": "missing", "plan": None}
    if not published(ep):
        return {"id": eid, "show": sid, "status": "skipped", "plan": None, "link": ep.get("episode_link") or ""}
    pl = plan_episode(ep, page, res)
    return {"id": eid, "show": sid, "status": "differs" if pl["fields"] else "ok", "plan": pl, "link": pl["old_link"], "title": ep.get("title", "")}


def save_state(rows, run, path=None):
    p = path or STATE
    old = {}
    if p.exists():
        try: old = json.loads(p.read_text("utf-8")).get("episodes", {})
        except ValueError: old = {}
    for r in rows:
        old[r["id"]] = {"s": r["status"], "u": r.get("link", ""), "h": r["show"], "c": run["at"]}
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps({"version": 1, "run": run, "episodes": old}, ensure_ascii=False, separators=(",", ":")), "utf-8")


# ---------------------------------------------------------------- Modi
def run_plan(sp, pages, res, show_ids, only_ids=None, examples=10, out=print):
    rows = list(classify(s, e, p, res) for s, e, p in scan(sp, pages, show_ids, only_ids))
    by = {}
    for r in rows: by.setdefault(r["show"], []).append(r)
    for sid in show_ids:
        rs = by.get(sid, [])
        cnt = {k: sum(1 for r in rs if r["status"] == k) for k in ("ok", "differs", "missing", "skipped")}
        out(f"Show {sid}: {len(rs)} Folgen, {cnt['differs']} mit abweichender Adresse, {cnt['ok']} in Ordnung, {cnt['missing']} ohne Seite, {cnt['skipped']} nicht veroeffentlicht")
        for r in [x for x in rs if x["status"] == "differs"][:examples]:
            for old, new in r["plan"]["changes"][:2]:
                out(f"   {r['id']}  {old}  ->  {new}")
        miss = [r["id"] for r in rs if r["status"] == "missing"]
        if miss: out("   ohne Seite (uebersprungen): " + ", ".join(miss[:30]) + (" ..." if len(miss) > 30 else ""))
    return rows


def run_apply(sp, pages, res, show_ids, only_ids=None, limit=300, pause=0.4, log_path=None, out=print):
    rows, n = [], 0
    for sid, ep, page in scan(sp, pages, show_ids, only_ids):
        r = classify(sid, ep, page, res)
        if r["status"] == "differs":
            if n >= limit:
                rows.append(r); continue
            eid, pl = r["id"], r["plan"]
            try:
                sp.req("POST", f"/episodes/{eid}", data=pl["fields"])
                after = sp.req("GET", f"/episodes/{eid}")["episode"]
            except PermissionError as e:
                out(f"::error::{e}"); log(eid, "error", pl["fields"], pl["old_link"], page["url"], str(e), log_path); raise
            except Exception as e:
                log(eid, "error", pl["fields"], pl["old_link"], page["url"], str(e)[:160], log_path)
                r["status"] = "error"; rows.append(r); continue
            good = not plan_episode(after, page, res)["fields"]   # nach dem Schreiben darf nichts mehr abweichen
            r["status"] = "ok" if good else "error"; r["link"] = after.get("episode_link") or ""
            log(eid, "ok" if good else "mismatch", pl["fields"], pl["old_link"], page["url"], "" if good else "Spreaker hat den Wert nicht uebernommen", log_path)
            n += 1; time.sleep(pause)
        rows.append(r)
    return rows, n


def export_mapping(pages, res, path):
    items = []
    for eid, p in sorted(pages.items(), key=lambda kv: int(kv[0])):
        url = final_url(p["url"], res)
        items.append({"spreaker_episode_id": eid, "show_id": p["show_id"], "lang": p["lang"], "slug": p["slug"], "url": url})
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    Path(path).write_text(json.dumps({"version": 1, "generated": now()[:10], "items": items}, ensure_ascii=False, indent=1), "utf-8")
    return len(items)


def main(argv=None, sp=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("mode", choices=("plan", "apply", "export"))
    ap.add_argument("--limit", type=int, default=300, help="apply: hoechstens so viele Folgen aendern")
    ap.add_argument("--ids", default=""); ap.add_argument("--show", default="")
    ap.add_argument("--map", default=MAP_URL); ap.add_argument("--redirects", default=RED_URL)
    ap.add_argument("--out", default=str(ROOT / "data" / "episode_urls.json")); ap.add_argument("--pause", type=float, default=0.4)
    ap.add_argument("--no-state", action="store_true")
    a = ap.parse_args(argv)
    pages = load_mapping(a.map)
    if len(pages) < 100 and not a.ids:
        print(f"::error::Zuordnung zu klein ({len(pages)}) - Abbruch"); return 1
    res = make_resolver(a.redirects)
    if a.mode == "export":
        print(f"{export_mapping(pages, res, a.out)} Folgen nach {a.out}"); return 0
    only = {x for x in re.findall(r"\d+", a.ids)}
    show_ids = sorted({int(p["show_id"]) for p in pages.values()})
    if a.show: show_ids = [s for s in show_ids if str(s) in re.findall(r"\d+", a.show)]
    if sp is None:
        import apply_shownotes as A
        sp = A.Spreaker()
        if not sp.login(): return 1
    run = {"at": now(), "mode": a.mode, "limit": a.limit}
    if a.mode == "plan":
        rows = run_plan(sp, pages, res, show_ids, only)
        n = 0
    else:
        rows, n = run_apply(sp, pages, res, show_ids, only, a.limit, a.pause)
        print(f"{n} Folgen geaendert" + (f", {sum(1 for r in rows if r['status'] == 'differs')} warten auf den naechsten Lauf (Limit {a.limit})" if any(r["status"] == "differs" for r in rows) else ""))
    run.update(changed=n, checked=len(rows), **{k: sum(1 for r in rows if r["status"] == k) for k in ("ok", "differs", "missing", "skipped", "error")})
    if not a.no_state: save_state(rows, run)
    return 1 if run["error"] and a.mode == "apply" else 0


if __name__ == "__main__":
    sys.exit(main())
