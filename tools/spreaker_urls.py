#!/usr/bin/env python3
"""Spreaker-Folgen <-> kanonische m365.fm-Adresse (alle Shows, alle Sprachen).

Seit der Umstellung der Adressen (Sprachstartseiten /<sprache>/, Podcast /<sprache>/podcast/, englische Folgen /show/episodes/<slug>/,
Sprachfolgen /<sprache>/<slug>/) steht bei Spreaker oft noch die alte Adresse: im Feld "Website" (API: episode_link, im RSS <link>) und in
Links der Beschreibung (description_html). Dieses Werkzeug gleicht beides mit der Seite ab.

Modi
  plan    Probelauf, schreibt nichts: je Show Zahl der Folgen mit abweichender Adresse plus 10 Beispiele alt -> neu.
  apply   Aendert bei Spreaker nur m365.fm-Adressen: episode_link auf die kanonische Adresse und m365.fm-Links in description_html
          (eigene Folgenseite -> kanonisch, sonstige alte Adresse -> Endziel der Weiterleitungstabelle in einem Schritt). Eigene Folgenseite
          heisst: ganzer Pfad = kanonischer oder alter Pfad dieser Folge (nie nur das letzte Pfadstueck, /entity/<gast>/ bleibt).
          Nie Titel, Status, Sichtbarkeit, Veroeffentlichung, Audio; nur veroeffentlichte Folgen. Mit Pause je Aufruf, wiederaufnehmbar
          (Protokoll data/spreaker_urls.tsv; ein zweiter Lauf fasst Erledigtes nicht noch einmal an), --limit begrenzt die Aenderungen je Lauf.
          Vor jedem Schreiben: Zielseite muss mit 200 antworten, alte Werte nach shownotes/spreaker_backup/urls-<id>.json.
          --link-only: nur episode_link.
  auto    Zeitplan: ohne Freigabedatei data/SPREAKER_URLS_APPROVED wie plan; mit ihr apply --link-only (nur Feld Website).
          Die Datei legt Mirko an, nachdem er einen Probelauf geprueft hat. Beschreibungen aendert nur ein Lauf von Hand (apply).
  export  Schreibt die Zuordnung Folge <-> Adresse als JSON (Quelle des Workers, Tabelle episode_urls).

Quelle der kanonischen Adresse: spreaker-urls.json des Seitenbaus (generate_site.py -> site_episode_urls.episode_url, dieselbe Funktion wie
die Seiten selbst); alte Adressen werden mit site_links.Resolver und show/redirects.json (derselben Tabelle wie der Site-Worker) in einem
Schritt aufgeloest. Folgen ohne Seite (noch nicht gebaut) werden uebersprungen und aufgelistet. Zustand je Folge fuer den Admin-Bereich:
data/spreaker_urls_state.json (ok / differs / missing / skipped / error). Jeder Lauf, der die Folgenliste der Hauptshow liest (plan, apply, auto;
export, wenn ein Zugang da ist), schreibt dazu data/spreaker_index.json: ID, Titel und Veroeffentlichungszeit aller Folgen der Hauptshow - auch
der alten ausserhalb des RSS-Fensters. Der Seitenbau ordnet damit Podpage-Seiten ihrer Spreaker-ID zu (site_podpage.spreaker_match).
Aufruf: python tools/spreaker_urls.py plan|apply|auto|export [--link-only] [--limit N] [--ids 1,2] [--show 7393187] [--map PFAD|URL] [--redirects PFAD|URL]"""
import argparse, json, os, re, sys, time, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(Path(__file__).resolve().parent))
import site_links as SL
import site_episode_urls as SEU

LOG = ROOT / "data" / "spreaker_urls.tsv"
STATE = ROOT / "data" / "spreaker_urls_state.json"
INDEX = None   # Index der Hauptshow; Standard: data/spreaker_index.json neben STATE (Tests, die STATE umlenken, schreiben ihn so nicht ins Repo)
APPROVED = ROOT / "data" / "SPREAKER_URLS_APPROVED"   # Freigabe fuer den Zeitplan (auto -> apply nur Feld Website); legt Mirko nach einem geprueften Probelauf an
BACKUP = Path(os.environ.get("SHOWNOTES_DIR") or (ROOT / "shownotes")) / "spreaker_backup"   # alte Werte vor jedem Schreiben (wie apply_shownotes.py)
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


def _path(url):
    """Pfad ohne Host, Query, Anker und Schraegstriche am Rand, klein geschrieben: "/show/episodes/x"."""
    return "/" + "/".join(x for x in _split(url)[1].lower().split("/") if x)


def own_paths(canonical, slug):
    """Alle Pfade, unter denen diese Folge liegt oder lag: kanonischer Pfad und bekannte alte Pfade derselben Folge (englisch:
    /show/episodes/<slug>, /en/show/episodes/<slug>, /m365-fm-podcast/<slug>; Sprachfolge: /<sprache>/<slug>, /<sprache>/show/episodes/<slug>).
    Bewusst nicht das letzte Pfadstueck allein: /entity/<slug>/ eines gleichnamigen Gastes ist nicht die Folgenseite."""
    cp, slug = _path(canonical), (slug or "").lower()
    out = {cp}
    if not slug:
        return out
    m = re.match(r"^/([a-z]{2})/", cp)
    if m and not cp.startswith("/show/"):
        out |= {f"/{m.group(1)}/{slug}", f"/{m.group(1)}/show/episodes/{slug}"}
    else:
        out |= {f"/show/episodes/{slug}", f"/en/show/episodes/{slug}", f"/m365-fm-podcast/{slug}"}
    return out


def is_own_page(url, canonical, slug, res):
    """Verweist die Adresse auf die Seite dieser Folge? Nur ueber den ganzen Pfad (kanonisch oder alter Pfad dieser Folge), direkt oder
    nach der Weiterleitung - nie ueber das letzte Pfadstueck allein."""
    own = own_paths(canonical, slug)
    return any(_path(u) in own for u in (url, final_url(url, res)))


def target_for(url, canonical, slug, res):
    """Neue Adresse fuer eine m365.fm-Adresse in der Beschreibung: eigene Folgenseite -> kanonisch (Query/Anker bleiben), sonst
    nur die Weiterleitung aufloesen. Gleich zurueck, wenn nichts zu aendern ist."""
    if is_own_page(url, canonical, slug, res):
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
    """Listeneintraege enthalten je nach Spreaker-Antwort nicht alle Felder: dann die Einzelabfrage. -> (Folge, abgefragt?)"""
    if "episode_link" in item and ("description_html" in item or "description" in item) and "published_at" in item:
        return item, False
    return sp.req("GET", f"/episodes/{item['episode_id']}")["episode"], True


def index_add(index, item):
    """Nur oeffentliche Metadaten der Folge fuer den Index (data/spreaker_index.json): Titel (t) und Veroeffentlichungszeit in UTC (p)."""
    e = index.setdefault(str(item["episode_id"]), {})
    if item.get("title"): e["t"] = str(item["title"])
    if item.get("published_at"): e["p"] = str(item["published_at"])[:19]


def save_index(index, path=None, out=print):
    """Index der Hauptshow schreiben: {version, generated, show_id, episodes: {ID: {t, p}}}. Nur, wenn sich die Folgen geaendert haben (sonst
    bliebe jeder Lauf ein Commit), und nicht, wenn die neue Liste deutlich kleiner ist als die alte (unvollstaendige Antwort der API)."""
    p = path or INDEX or STATE.with_name("spreaker_index.json")
    if not index: return False
    try: old = json.loads(p.read_text("utf-8")) if p.exists() else {}
    except ValueError: old = {}
    old = old.get("episodes") if isinstance(old, dict) else None   # falsche Form: wie ohne alten Index
    old = {k: v for k, v in old.items() if isinstance(v, dict)} if isinstance(old, dict) else {}
    new = {k: {**old.get(k, {}), **index[k]} for k in sorted(index, key=int)}   # Felder, die die Liste nicht nennt, bleiben aus dem alten Index
    if new == old: return False
    if len(new) < 0.9 * len(old):
        out(f"::warning::Spreaker-Index nicht geschrieben: {len(new)} Folgen statt bisher {len(old)}"); return False
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps({"version": 1, "generated": now()[:10], "show_id": SEU.EN_SHOW_ID, "episodes": new}, ensure_ascii=False, indent=1) + "\n", "utf-8")
    return True


def scan(sp, pages, show_ids, only_ids=None, pause=0.0, out=print, index=None):
    """Je Show alle Folgen lesen. Erzeugt (show_id, ep, page|None, fehler|None) fuer jede Folge. Ein Lesefehler einer Folge (oder der Liste
    einer Show) bricht den Lauf nicht ab: die Folge kommt als Fehler zurueck, es geht mit der naechsten weiter. Nur 401 (PermissionError)
    bricht ab - dann scheitert jeder weitere Aufruf. pause: Wartezeit nach jeder Einzelabfrage (schont die Spreaker-API). index (Dict): nimmt
    alle Folgen der Hauptshow auf (vor dem Filter --ids, also immer vollstaendig). Folgen ohne Seite werden einzeln abgefragt, wenn der
    Listeneintrag die Veroeffentlichung nicht nennt, oder bei vergangenem Datum die Sichtbarkeit nicht - classify() meldet geplante/private
    Folgen dann als skipped statt missing. Nennt auch die Einzelabfrage keine Sichtbarkeit (die API liefert sie nicht immer), fragt der Lauf
    danach nur noch Folgen ohne Datum einzeln ab: sonst kostete jede Folge ohne Seite in jedem Lauf eine Abfrage ohne neue Auskunft."""
    vis = True   # liefert die Einzelabfrage die Sichtbarkeit? (bis zur ersten Antwort ohne sie)
    for sid in show_ids:
        try:
            items = episodes_of_show(sp, sid)
        except PermissionError:
            raise
        except Exception as e:
            out(f"::warning::Show {sid}: Folgenliste nicht lesbar ({str(e)[:160]})")
            yield sid, None, None, f"Liste: {str(e)[:160]}"; continue
        if index is not None and int(sid) == SEU.EN_SHOW_ID:
            for item in items: index_add(index, item)
        for item in items:
            eid = str(item["episode_id"])
            if only_ids and eid not in only_ids:
                continue
            page = pages.get(eid)
            if not page:
                if not item.get("published_at") or (vis and "visibility" not in item and published(item)):   # geplant/privat? steht nur in der Einzelabfrage
                    try:
                        item = sp.req("GET", f"/episodes/{eid}")["episode"]; vis = vis and "visibility" in item
                        if index is not None and int(sid) == SEU.EN_SHOW_ID: index_add(index, item)
                    except PermissionError:
                        raise
                    except Exception:
                        pass   # wie bisher: ohne Einzelabfrage zaehlt die Folge als ohne Seite
                    if pause: time.sleep(pause)
                yield sid, item, None, None; continue
            try:
                ep, fetched = full_episode(sp, item)
            except PermissionError:
                raise
            except Exception as e:
                yield sid, item, page, f"GET {str(e)[:160]}"; time.sleep(pause); continue
            if fetched and index is not None and int(sid) == SEU.EN_SHOW_ID: index_add(index, ep)
            yield sid, ep, page, None
            if fetched and pause: time.sleep(pause)


def classify(sid, ep, page, res, err=None):
    if ep is None:   # Folgenliste der Show nicht lesbar: keine Folge, nur Fehler im Lauf
        return None
    eid = str(ep["episode_id"])
    if err:
        return {"id": eid, "show": sid, "status": "error", "plan": None, "link": ep.get("episode_link") or "", "note": err, "title": ep.get("title", "")}
    if page is None and ("published_at" not in ep or published(ep)):   # Veroeffentlichung unbekannt (Einzelabfrage fehlgeschlagen): wie bisher missing
        return {"id": eid, "show": sid, "status": "missing", "plan": None, "title": ep.get("title", "")}
    if not published(ep):   # vor "ohne Seite": geplante oder private Folgen haben bewusst (noch) keine Seite
        return {"id": eid, "show": sid, "status": "skipped", "plan": None, "link": ep.get("episode_link") or "", "title": ep.get("title", "")}
    pl = plan_episode(ep, page, res)
    return {"id": eid, "show": sid, "status": "differs" if pl["fields"] else "ok", "plan": pl, "link": pl["old_link"], "title": ep.get("title", "")}


def save_state(rows, run, path=None):
    p = path or STATE
    old = {}
    if p.exists():
        try: old = json.loads(p.read_text("utf-8")).get("episodes", {})
        except ValueError: old = {}
    for r in rows:
        e = {"s": r["status"], "u": r.get("link", ""), "h": r["show"], "c": run["at"]}
        if r.get("title"): e["t"] = str(r["title"])[:200]   # Titel fuer die Listen im Admin-Reiter
        if r.get("plan") and r["plan"].get("fields"): e["f"] = sorted(r["plan"]["fields"])   # was abweicht: episode_link / description_html
        old[r["id"]] = e
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps({"version": 1, "run": run, "episodes": old}, ensure_ascii=False, separators=(",", ":")), "utf-8")


def backup(ep, fields, path=None):
    """Alte Werte sichern, bevor sie bei Spreaker ueberschrieben werden (nichts loeschen): shownotes/spreaker_backup/urls-<id>.json haelt jede
    Fassung (Feld Website, description_html, description), die dieses Werkzeug ueberschrieben hat; eine schon gesicherte Fassung kommt nicht
    doppelt hinein. Wiederherstellen: Werte der gewuenschten Fassung per POST /episodes/<id> zurueckschreiben."""
    d = path or BACKUP
    f = d / f"urls-{ep['episode_id']}.json"
    data = json.loads(f.read_text("utf-8")) if f.exists() else {"episode_id": str(ep["episode_id"]), "versions": []}
    ver = {k: ep.get(k) or "" for k in ("episode_link", "description_html", "description")}
    if not any({k: v.get(k, "") for k in ver} == ver for v in data["versions"]):
        data["versions"].append(dict(ver, saved=now(), title=ep.get("title") or "", fields=sorted(fields)))
        d.mkdir(parents=True, exist_ok=True)
        f.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", "utf-8")
    return f


# ---------------------------------------------------------------- Modi
def show_error(sid, ep, err, show_errors):
    """Folgenliste einer Show nicht lesbar (scan liefert ep=None): als Lauf-Fehler zaehlen (run.show_errors, Exit-Code), sonst bliebe die
    ganze Show unbemerkt auf ihrem alten Zustand."""
    if ep is None and err and show_errors is not None: show_errors[str(sid)] = err


def run_plan(sp, pages, res, show_ids, only_ids=None, examples=10, out=print, rows=None, pause=0.0, show_errors=None, index=None):
    rows = [] if rows is None else rows
    show_errors = {} if show_errors is None else show_errors
    try:
        for s, e, p, err in scan(sp, pages, show_ids, only_ids, pause, out, index):
            show_error(s, e, err, show_errors)
            r = classify(s, e, p, res, err)
            if r: rows.append(r)
    finally:   # auch nach einem Abbruch (401) die bis dahin gelesenen Folgen zusammenfassen
        by = {}
        for r in rows: by.setdefault(r["show"], []).append(r)
        for sid in show_ids:
            rs = by.get(sid, [])
            if str(sid) in show_errors: out(f"Show {sid}: Folgenliste nicht lesbar - Show nicht geprueft ({show_errors[str(sid)]})"); continue
            cnt = {k: sum(1 for r in rs if r["status"] == k) for k in ("ok", "differs", "missing", "skipped", "error")}
            out(f"Show {sid}: {len(rs)} Folgen, {cnt['differs']} mit abweichender Adresse, {cnt['ok']} in Ordnung, {cnt['missing']} ohne Seite, {cnt['skipped']} nicht veroeffentlicht"
                + (f", {cnt['error']} nicht lesbar" if cnt["error"] else ""))
            for r in [x for x in rs if x["status"] == "differs"][:examples]:
                for old, new in r["plan"]["changes"][:2]:
                    out(f"   {r['id']}  {old}  ->  {new}")
            miss = [r["id"] for r in rs if r["status"] == "missing"]
            if miss: out("   ohne Seite (uebersprungen): " + ", ".join(miss[:30]) + (" ..." if len(miss) > 30 else ""))
    return rows


def run_apply(sp, pages, res, show_ids, only_ids=None, limit=300, pause=0.4, log_path=None, out=print, link_only=False, rows=None,
              read_pause=0.0, check=SEU.page_status, backup_dir=None, show_errors=None, index=None):
    """Schreibt die Abweichungen zu Spreaker (hoechstens limit Folgen). link_only: nur das Feld Website (episode_link), die Beschreibung bleibt
    (Zeitplan; Beschreibungen nur in einem von Hand gestarteten Lauf). Vor jedem Schreiben: Zielseite muss mit 200 antworten (check), alte Werte
    werden gesichert (backup). rows sammelt die Ergebnisse laufend, damit main() den Zustand auch nach einem Abbruch speichert; show_errors (Dict
    Show-ID -> Fehler) die Shows, deren Folgenliste nicht lesbar war."""
    rows, n = ([] if rows is None else rows), 0
    for sid, ep, page, err in scan(sp, pages, show_ids, only_ids, read_pause, out, index):
        show_error(sid, ep, err, show_errors)
        r = classify(sid, ep, page, res, err)
        if r is None:
            continue
        if r["status"] == "error":
            log(r["id"], "error", [], r["link"], page["url"] if page else "", r.get("note", ""), log_path)
        if r["status"] == "differs":
            eid, pl = r["id"], r["plan"]
            fields = {k: v for k, v in pl["fields"].items() if k == "episode_link"} if link_only else pl["fields"]
            if not fields or n >= limit:   # nur die Beschreibung weicht ab (wartet auf einen Lauf von Hand) oder Limit erreicht
                rows.append(r); continue
            st = check(page["url"])
            if st != 200:   # nie auf eine Seite zeigen, die (noch) nicht antwortet (wie set_spreaker_links.py)
                log(eid, "target_not_200", list(fields), pl["old_link"], page["url"], f"Ziel antwortet {st}", log_path)
                rows.append(r); continue
            try:
                backup(ep, fields, backup_dir)
                sp.req("POST", f"/episodes/{eid}", data=fields)
                after = sp.req("GET", f"/episodes/{eid}")["episode"]
            except PermissionError as e:
                out(f"::error::{e}"); log(eid, "error", list(fields), pl["old_link"], page["url"], str(e), log_path); raise
            except Exception as e:
                log(eid, "error", list(fields), pl["old_link"], page["url"], str(e)[:160], log_path)
                r["status"] = "error"; rows.append(r); continue
            rest = plan_episode(after, page, res)["fields"]
            good = not any(k in rest for k in fields)   # nach dem Schreiben darf in den geschriebenen Feldern nichts mehr abweichen
            r["status"] = ("differs" if rest else "ok") if good else "error"; r["link"] = after.get("episode_link") or ""
            log(eid, "ok" if good else "mismatch", list(fields), pl["old_link"], page["url"], "" if good else "Spreaker hat den Wert nicht uebernommen", log_path)
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


def effective_mode(mode, approved=None):
    """auto (Zeitplan): apply nur mit Freigabedatei data/SPREAKER_URLS_APPROVED und dann nur das Feld Website, sonst Probelauf.
    -> (Modus, nur_episode_link)"""
    if mode == "auto":
        return ("apply", True) if (APPROVED if approved is None else approved).exists() else ("plan", False)
    return mode, False


def main(argv=None, sp=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("mode", choices=("plan", "apply", "auto", "export"))
    ap.add_argument("--limit", type=int, default=300, help="apply: hoechstens so viele Folgen aendern")
    ap.add_argument("--ids", default=""); ap.add_argument("--show", default="")
    ap.add_argument("--map", default=MAP_URL); ap.add_argument("--redirects", default=RED_URL)
    ap.add_argument("--out", default=str(ROOT / "data" / "episode_urls.json")); ap.add_argument("--pause", type=float, default=0.4)
    ap.add_argument("--read-pause", type=float, default=0.15, help="Wartezeit nach jeder Einzelabfrage einer Folge")
    ap.add_argument("--link-only", action="store_true", help="apply: nur das Feld Website, Beschreibungen nicht anfassen")
    ap.add_argument("--no-state", action="store_true")
    a = ap.parse_args(argv)
    mode, link_only = effective_mode(a.mode)
    link_only = link_only or a.link_only
    if a.mode == "auto":
        print("Zeitplan: " + ("apply, nur Feld Website (Freigabe data/SPREAKER_URLS_APPROVED)" if mode == "apply" else "Probelauf - keine Freigabedatei data/SPREAKER_URLS_APPROVED"))
    pages = load_mapping(a.map)
    if len(pages) < 100 and not a.ids:
        print(f"::error::Zuordnung zu klein ({len(pages)}) - Abbruch"); return 1
    res = make_resolver(a.redirects)
    if mode == "export":
        print(f"{export_mapping(pages, res, a.out)} Folgen nach {a.out}")
        if not a.no_state and (sp is not None or os.environ.get("SPREAKER_TOKEN") or os.environ.get("SPREAKER_CLIENT_SECRET")):
            try:   # Index der Hauptshow auffrischen; ohne Zugang oder bei Fehlern bleibt der Export erfolgreich
                if sp is None:
                    import apply_shownotes as A
                    sp = A.Spreaker()
                    if not sp.login(): raise RuntimeError("keine Anmeldung")
                idx = {}
                for it in episodes_of_show(sp, SEU.EN_SHOW_ID): index_add(idx, it)
                if save_index(idx): print(f"Spreaker-Index: {len(idx)} Folgen der Hauptshow")
            except Exception as e:
                print(f"::warning::Spreaker-Index nicht aufgefrischt ({str(e)[:160]})")
        return 0
    only = {x for x in re.findall(r"\d+", a.ids)}
    show_ids = sorted({int(p["show_id"]) for p in pages.values()})
    if a.show: show_ids = [s for s in show_ids if str(s) in re.findall(r"\d+", a.show)]
    if sp is None:
        import apply_shownotes as A
        sp = A.Spreaker()
        if not sp.login(): return 1
    run = {"at": now(), "mode": mode, "limit": a.limit, "link_only": link_only}
    rows, n, aborted, shows_bad, idx = [], 0, False, {}, {}
    try:
        if mode == "plan":
            run_plan(sp, pages, res, show_ids, only, rows=rows, pause=a.read_pause, show_errors=shows_bad, index=idx)
        else:
            _, n = run_apply(sp, pages, res, show_ids, only, a.limit, a.pause, link_only=link_only, rows=rows, read_pause=a.read_pause, show_errors=shows_bad, index=idx)
            wait = sum(1 for r in rows if r["status"] == "differs")
            print(f"{n} Folgen geaendert" + (f", {wait} weichen noch ab (Limit {a.limit}" + (", Beschreibungen nur in einem Lauf von Hand" if link_only else "") + ")" if wait else ""))
    except PermissionError:
        aborted = True; raise
    finally:   # Zustand auch nach einem Abbruch sichern (bis dahin gelesene Folgen)
        run.update(changed=n, checked=len(rows), aborted=aborted, show_errors=sorted(shows_bad, key=int), **{k: sum(1 for r in rows if r["status"] == k) for k in ("ok", "differs", "missing", "skipped", "error")})
        if not a.no_state:
            save_state(rows, run)
            if idx and str(SEU.EN_SHOW_ID) not in shows_bad and save_index(idx): print(f"Spreaker-Index: {len(idx)} Folgen der Hauptshow")
    if run["error"] or shows_bad:   # Zusammenfassung (Step-Summary): nicht lesbare Folgen und ganze Shows, deren Liste fehlte
        print(f"Fehler: {run['error']} Folgen nicht lesbar/geschrieben" + (f", Folgenliste nicht lesbar bei Show {', '.join(run['show_errors'])} (Show nicht geprueft)" if shows_bad else ""))
    return 1 if (run["error"] or shows_bad) and mode == "apply" else 0


if __name__ == "__main__":
    sys.exit(main())
