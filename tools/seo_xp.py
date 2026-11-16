"""SEO-Experiment "beschreibende Ankertexte" (seo_experiment.py, Plan SEO_EXPERIMENT.md).

  python tools/seo_xp.py assign [--start 2026-11-30] [--force]   Gruppen und Ankertexte festlegen und in data/seo_experiment.json einfrieren
  python tools/seo_xp.py check <Bauordner>                       im gebauten Ergebnis pruefen: sem-Links beschreibend, ctl-Links nur Name
  python tools/seo_xp.py report --before A.json|csv ... --after B.json|csv ... [--days-before N --days-after N]
                                                                         Auswertung vorher/nachher je Gruppe, Differenz-der-Differenzen mit 95 %-Intervall

Eingabe fuer report: Wochen-Exporte von tools/gsc_export.py (JSON) oder CSV-Exporte "Seiten" aus der Search Console (Spalten Seite/Page, Klicks/Clicks,
Impressionen/Impressions, Position). Tage: bei JSON aus "period", bei CSV per --days-before/--days-after."""
import argparse
import csv
import json
import math
import random
import re
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import seo_experiment as X   # noqa: E402

ENT_RX = re.compile(r"^(?:https?://[^/]+)?/entity/([^/?#]+)/?$")   # nur englische Seiten (ohne Sprachpfad)


def cmd_assign(a):
    if X.FILE.exists() and not a.force:
        sys.exit(f"{X.FILE.name} gibt es schon - die Gruppen bleiben eingefroren (nur mit --force neu, das macht das Experiment ungueltig).")
    ents = {e["id"]: e for e in json.loads((ROOT / "data" / "entities.json").read_text("utf-8"))}
    dup = json.loads((ROOT / "data" / "entity_duplicates.json").read_text("utf-8")).get("duplicates", {})
    sem, ctl, deg = X.assign(ents, dup=dup)
    out = {"_doc": "SEO-Experiment beschreibende Ankertexte (SEO_EXPERIMENT.md). Eingefroren: sem = Links auf diese Seiten tragen den beschreibenden Anker (anchors), ctl = klassischer Name. "
                   "start = erster Bautag mit Aenderung (Brotkruemel und Dubletten aus anderen PRs gelten fuer beide Gruppen). stop optional. Nicht per Hand aendern.",
           "start": a.start, "created": str(date.today()), "salt": "m365fm-2026-11-16", "sem": sem, "ctl": ctl,
           "anchors": {i: X.anchor(ents[i]) for i in sem}}
    X.FILE.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", "utf-8")
    print(f"sem {len(sem)}, ctl {len(ctl)}, Start {a.start}")


def cmd_check(a):
    d = json.loads(X.FILE.read_text("utf-8"))
    sem, ctl, anchors = set(d["sem"]), set(d["ctl"]), d.get("anchors", {})
    root = Path(a.dir)
    n = {"sem": 0, "ctl": 0}; bad = []
    for f in root.glob("entity/*/index.html"):
        h = f.read_text("utf-8")
        for m in re.finditer(r'<a href="([^"]*?/entity/([^/"]+)/)" data-xv="(sem|ctl)">(.*?)</a>', h):
            _, i, v, inner = m.groups(); n[v] += 1
            text = re.sub(r"<[^>]+>", "", inner).replace("&#x27;", "'").replace("&amp;", "&")
            if (v == "sem" and (i not in sem or text != anchors.get(i, "").replace("&amp;", "&"))) or (v == "ctl" and (i not in ctl or " – " in text)):
                bad.append((f.parent.name, i, v, text[:80]))
    print(f"sem-Links {n['sem']}, ctl-Links {n['ctl']}, Fehler {len(bad)}")
    for b in bad[:20]: print("  ", b)
    sys.exit(1 if bad or not (n["sem"] and n["ctl"]) else 0)


def _num(s):
    try: return float(str(s).replace("%", "").replace(".", "").replace(",", ".")) if re.search(r",\d", str(s)) else float(str(s).replace("%", "").replace(",", ""))
    except ValueError: return 0.0


def _read(files, days):
    """-> ({entity: {clicks, imp, pos_x_imp, queries:set}}, Tage)"""
    ent, total_days = {}, 0
    for fn in files:
        p = Path(fn)
        if p.suffix == ".json":
            j = json.loads(p.read_text("utf-8")); rows = j["rows"]
            total_days += (date.fromisoformat(j["period"]["to"]) - date.fromisoformat(j["period"]["from"])).days + 1
            recs = [(r["page"], r["clicks"], r["impressions"], r["position"], r.get("query")) for r in rows]
        else:
            with p.open(encoding="utf-8-sig", newline="") as f:
                rd = csv.DictReader(f); keys = {k.casefold(): k for k in rd.fieldnames}
                pick = lambda *c: next(keys[x] for x in c if x in keys)
                kp, kc, ki, ko = pick("page", "seite", "seiten", "top pages", "häufigste seiten"), pick("clicks", "klicks"), pick("impressions", "impressionen"), pick("position", "durchschnittliche position")
                recs = [(r[kp], _num(r[kc]), _num(r[ki]), _num(r[ko]), None) for r in rd]
        for page, c, i, pos, q in recs:
            m = ENT_RX.match(page)
            if not m: continue
            e = ent.setdefault(m.group(1), {"clicks": 0.0, "imp": 0.0, "pos": 0.0, "q": set()})
            e["clicks"] += c; e["imp"] += i; e["pos"] += pos * i
            if q: e["q"].add(q)
    return ent, (days or total_days)


def _stat(ent, i, days):
    e = ent.get(i)
    if not e or not e["imp"]: return {"imp": 0.0, "clicks": 0.0, "pos": None, "q": 0}
    return {"imp": e["imp"] / days, "clicks": e["clicks"] / days, "pos": e["pos"] / e["imp"], "q": len(e["q"])}


def cmd_report(a):
    d = json.loads(X.FILE.read_text("utf-8"))
    groups = {"sem": d["sem"], "ctl": d["ctl"]}
    b, db = _read(a.before, a.days_before); n, dn = _read(a.after, a.days_after)
    if not db or not dn: sys.exit("Tage fehlen: --days-before/--days-after angeben (bei CSV).")
    res = {}
    for g, ids in groups.items():
        rows = []
        for i in ids:
            s0, s1 = _stat(b, i, db), _stat(n, i, dn)
            rows.append({"id": i, "d_log_imp": math.log1p(s1["imp"]) - math.log1p(s0["imp"]), "d_clicks": s1["clicks"] - s0["clicks"],
                         "d_pos": (s1["pos"] - s0["pos"]) if s0["pos"] and s1["pos"] else None, "d_q": s1["q"] - s0["q"], "imp0": s0["imp"], "imp1": s1["imp"]})
        res[g] = rows
    rnd = random.Random(20261116)

    def boot(metric):
        s = [r[metric] for r in res["sem"] if r[metric] is not None]; c = [r[metric] for r in res["ctl"] if r[metric] is not None]
        if len(s) < 5 or len(c) < 5: return None
        mean = lambda v: sum(v) / len(v)
        diff = mean(s) - mean(c)
        bs = sorted(mean([rnd.choice(s) for _ in s]) - mean([rnd.choice(c) for _ in c]) for _ in range(2000))
        return diff, bs[50], bs[1949], len(s), len(c)

    print(f"Vorher {db} Tage, nachher {dn} Tage; Seiten sem {len(res['sem'])}, ctl {len(res['ctl'])}")
    names = {"d_log_imp": "Impressionen/Tag (Aenderung von ln(1+x))", "d_clicks": "Klicks/Tag (Aenderung)", "d_pos": "Mittlere Position (Aenderung, negativ = besser)", "d_q": "Verschiedene Suchanfragen (nur JSON, Aenderung)"}
    for m, label in names.items():
        r = boot(m)
        if not r: print(f"- {label}: zu wenige Daten"); continue
        diff, lo, hi, ns, nc = r
        sig = "Intervall ohne 0: Hinweis auf Wirkung" if lo > 0 or hi < 0 else "Intervall schliesst 0 ein: kein Beleg"
        print(f"- {label}: sem minus ctl = {diff:+.3f} [95 %: {lo:+.3f} .. {hi:+.3f}] (n {ns}/{nc}) - {sig}")
    print("Hinweis: Eine Seite ohne Impressionen zaehlt als 0. Nur Differenz der Gruppen zaehlt; gemeinsame Einfluesse (Brotkruemel, Updates) fallen heraus.")


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sp = ap.add_subparsers(dest="cmd", required=True)
    s = sp.add_parser("assign"); s.add_argument("--start", default="2026-11-30"); s.add_argument("--force", action="store_true"); s.set_defaults(f=cmd_assign)
    s = sp.add_parser("check"); s.add_argument("dir"); s.set_defaults(f=cmd_check)
    s = sp.add_parser("report"); s.add_argument("--before", nargs="+", required=True); s.add_argument("--after", nargs="+", required=True)
    s.add_argument("--days-before", type=int, default=0); s.add_argument("--days-after", type=int, default=0); s.set_defaults(f=cmd_report)
    a = ap.parse_args(argv); a.f(a)


if __name__ == "__main__":
    main()
