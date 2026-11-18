#!/usr/bin/env python3
"""Gibt Blog-Artikel aus der Warteschlange frei (imports/blog-queue/<JJJJ-MM-TT>/<slug>.md und Reihen imports/blog-queue/<reihe>/welle-NN/<slug>.md).

Tagesordner: Alle Artikel werden nach imports/blog/en/ verschoben (Ordnerdatum nur als Reihenfolge, aelteste
zuerst), dabei bekommen die Dateien status: approved, publish: true und das Freigabedatum (morgen nach Berliner Zeit,
also der Tag, an dem sie mit dem Seitenbau live gehen). Wird ein Stichtag angegeben, werden nur Ordner bis dahin
freigegeben. Je Lauf hoechstens LIMIT Artikel,
damit Seitenbau und Uebersetzung nachts nicht ueberlaufen. Vorhandene Slugs werden nie ueberschrieben.

Reihen (Ordner mit reihe.json, z. B. imports/blog-queue/nerdio/): je Artikeldatum genau EINE Welle (der Ordner welle-NN mit der
kleinsten Nummer), unabhaengig vom LIMIT der Tagesordner und ohne KI. Damit gehen ab dem ersten Abend-Lauf nach dem Merge jeden Tag
die Artikel einer Welle live, in der Reihenfolge der Wellen. reihe.json:
  {"zuletzt": "JJJJ-MM-TT",                 Artikeldatum der letzten freigegebenen Welle (schreibt dieses Skript; ein zweiter Lauf fuer
                                            dasselbe Datum gibt keine weitere Welle frei)
   "sponsoring": "<id>",                    optional: Eintrag in data/sponsorships.json; jeder freigegebene Artikel kommt unter dessen
                                            "posts" (Kennzeichnung auf der Beitragsseite, im selben Commit wie publish: true)
   "nach": {"<slug>": ["<slug>", ...]}}     optional: ein Artikel geht erst, wenn diese schon in imports/blog/en/ liegen oder in derselben
                                            Welle freigegeben werden; sonst rueckt er in die naechste Welle
Ein Artikel, dessen Slug in imports/blog/en/ schon existiert, wird nicht ueberschrieben, sondern nach <reihe>/_blockiert/ gelegt (Meldung im Log).

Aufruf: python3 tools/blog_release.py [STICHTAG JJJJ-MM-TT] [LIMIT] [ARTIKELDATUM JJJJ-MM-TT]
Ohne Stichtag: alles freigeben, Datum der Artikel = morgen nach Berliner Zeit (der Lauf liegt abends, vor dem Seitenbau um 01:07 UTC).
"""
import datetime, json, os, re, shutil, sys
from zoneinfo import ZoneInfo

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUEUE = os.path.join(ROOT, "imports", "blog-queue")
DEST = os.path.join(ROOT, "imports", "blog", "en")
SPONSORSHIPS = os.path.join(ROOT, "data", "sponsorships.json")
WAVE = re.compile(r"welle-(\d+)")


def set_head(text, key, value):
    head, sep, body = text.partition("\n---\n")
    if not text.startswith("---\n") or not sep:
        raise ValueError("kein YAML-Kopf")
    pat = re.compile(r"^%s:.*$" % key, re.M)
    line = "%s: %s" % (key, value)
    head = pat.sub(line, head, count=1) if pat.search(head) else head + "\n" + line
    return head + sep + body


def get_head(text, key):
    m = re.search(r"^%s:\s*(.*?)\s*$" % key, text.partition("\n---\n")[0], re.M)
    return m.group(1).strip("\"'") if m else ""


def release_file(src, dst, day):
    text = open(src, encoding="utf-8").read()
    for k, v in (("status", "approved"), ("publish", "true"), ("date", day)):
        text = set_head(text, k, v)
    open(dst, "w", encoding="utf-8").write(text)
    os.remove(src)
    return text


def _md(folder):
    return sorted(n for n in os.listdir(folder) if n.endswith(".md")) if os.path.isdir(folder) else []


def waves(series):
    """Wellen-Ordner einer Reihe mit Artikeln, nach Nummer sortiert: [(nummer, pfad)]."""
    out = []
    for d in os.listdir(series):
        m = WAVE.fullmatch(d)
        if m and _md(os.path.join(series, d)):
            out.append((int(m.group(1)), os.path.join(series, d)))
    return sorted(out)


def add_posts(path, rid, refs):
    """Traegt Beitragspfade unter "posts" des Sponsorings rid ein (Format der Datei bleibt: indent 1, UTF-8)."""
    if not refs:
        return
    d = json.load(open(path, encoding="utf-8"))
    rec = next((r for r in d.get("sponsorships") or [] if r.get("id") == rid), None)
    if rec is None:
        raise SystemExit("Sponsoring %r fehlt in %s" % (rid, path))
    posts = rec.setdefault("posts", [])
    posts += [x for x in refs if x not in posts]
    open(path, "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False, indent=1) + "\n")


def release_series(series, dest, day, sponsorships=SPONSORSHIPS):
    """Gibt die naechste Welle einer Reihe frei (hoechstens eine je Artikeldatum). Rueckgabe: Liste der freigegebenen Slugs."""
    cfg_path = os.path.join(series, "reihe.json")
    cfg = json.load(open(cfg_path, encoding="utf-8"))
    name = os.path.basename(series)
    if str(cfg.get("zuletzt") or "") >= day:
        print("Reihe %s: Welle fuer %s schon freigegeben (zuletzt %s)" % (name, day, cfg.get("zuletzt"))); return []
    ws = waves(series)
    if not ws:
        print("Reihe %s: keine Welle mehr in der Warteschlange" % name); return []
    nr, folder = ws[0]
    names = _md(folder)
    batch = {n[:-3] for n in names}
    moved, refs = [], []
    for n in names:
        slug, src = n[:-3], os.path.join(folder, n)
        if os.path.exists(os.path.join(dest, n)):
            blk = os.path.join(series, "_blockiert"); os.makedirs(blk, exist_ok=True)
            shutil.move(src, os.path.join(blk, n))
            print("::error::Reihe %s: Slug %s existiert schon in imports/blog/en, nach _blockiert/ gelegt" % (name, slug)); continue
        missing = [p for p in (cfg.get("nach") or {}).get(slug, []) if p not in batch and not os.path.exists(os.path.join(dest, p + ".md"))]
        if missing:
            nxt = os.path.join(series, "welle-%02d" % (nr + 1)); os.makedirs(nxt, exist_ok=True)
            shutil.move(src, os.path.join(nxt, n))
            print("Reihe %s: %s wartet auf %s, rueckt in welle-%02d" % (name, slug, ", ".join(missing), nr + 1)); continue
        text = release_file(src, os.path.join(dest, n), day)
        moved.append(slug)
        refs.append("/community/u/%s/blog/%s/" % ((get_head(text, "author") or "mirko-p").lower(), slug))
        print("freigegeben: %s (Reihe %s, welle-%02d, Datum %s)" % (n, name, nr, day))
    if not _md(folder):
        shutil.rmtree(folder, ignore_errors=True)
    if cfg.get("sponsoring"):
        add_posts(sponsorships, cfg["sponsoring"], refs)
    cfg["zuletzt"] = day
    open(cfg_path, "w", encoding="utf-8").write(json.dumps(cfg, ensure_ascii=False, indent=1) + "\n")
    print("Reihe %s: welle-%02d, %d Artikel freigegeben (Datum %s)" % (name, nr, len(moved), day))
    return moved


def release_days(queue, dest, day, cutoff, limit):
    target = cutoff or "9999-12-31"
    days = sorted(d for d in os.listdir(queue) if re.fullmatch(r"\d{4}-\d{2}-\d{2}", d) and d <= target)
    moved = 0
    for d in days:
        folder = os.path.join(queue, d)
        for name in _md(folder):
            if moved >= limit:
                print("Limit %d erreicht, Rest folgt im naechsten Lauf" % limit); return moved
            src, dst = os.path.join(folder, name), os.path.join(dest, name)
            if os.path.exists(dst):
                print("UEBERSPRUNGEN (Slug existiert): " + name); continue
            release_file(src, dst, day)
            moved += 1
            print("freigegeben: %s (Ordner %s, Datum %s)" % (name, d, day))
        if not _md(folder):
            shutil.rmtree(folder, ignore_errors=True)
    return moved


def main():
    tomorrow = (datetime.datetime.now(ZoneInfo("Europe/Berlin")).date() + datetime.timedelta(days=1)).isoformat()
    cutoff = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] else ""
    limit = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2] else 15
    if len(sys.argv) > 3 and sys.argv[3]:
        tomorrow = sys.argv[3]  # Datum der Artikel von Hand setzen (z. B. heute fuer einen Start-Lauf)
    if not os.path.isdir(QUEUE):
        print("keine Warteschlange"); return
    os.makedirs(DEST, exist_ok=True)
    for d in sorted(os.listdir(QUEUE)):
        if os.path.isfile(os.path.join(QUEUE, d, "reihe.json")):
            release_series(os.path.join(QUEUE, d), DEST, tomorrow)
    moved = release_days(QUEUE, DEST, tomorrow, cutoff, limit)
    print("%d Artikel aus Tagesordnern freigegeben (Stichtag %s, Datum %s)" % (moved, cutoff or "keiner", tomorrow))


if __name__ == "__main__":
    main()
