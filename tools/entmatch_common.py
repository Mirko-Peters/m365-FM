"""Allerweltswoerter unter den einteiligen Eigennamen-Formen (Produkte, Plattformen, Organisationen ...) fuer site_entmatch: eine Form gilt als
Allerweltswort, wenn sie im eigenen Textbestand (fruehere Blogbeitraege und Show Notes der Podpage-Sicherung) oft kleingeschrieben vorkommt
(mindestens MIN_LOWER-mal und mindestens RATIO des Vorkommens). "surface" (attack surface), "teams" (security teams), "functions", "places" ...
Ergebnis: data/entmatch_common.json {"common": [...], "stats": {form: [klein, gross]}}. Aufruf: python3 tools/entmatch_common.py"""
import gzip, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
MIN_LOWER, RATIO = 20, 0.08


def corpus():
    d = ROOT / "data" / "podpage"
    strip = lambda h: re.sub(r"<[^>]+>", " ", h or "")
    out = [strip(p.get("html")) for p in json.loads(gzip.open(d / "blog_posts.json.gz", "rt", encoding="utf-8").read())]
    eps = json.loads(gzip.open(d / "episodes.json.gz", "rt", encoding="utf-8").read())
    if isinstance(eps, dict): eps = eps.get("episodes") or list(eps.values())
    out += [strip(e.get("show_notes")) for e in eps]
    return "\n".join(out)


def main():
    import site_entmatch as EM
    ents = {e["id"]: e for f in ("entities.json", "guest_entities.json") for e in json.loads((ROOT / "data" / f).read_text("utf-8"))}
    m = EM.Matcher(ents, common=set(), cooc=({}, {}))
    words = {}
    for w in re.findall(r"(?<![\w./@#:=?&-])([A-Za-z][A-Za-z0-9+#]*)(?![\w/@-]|\.\w)", re.sub(r"https?://\S+|www\.\S+|\S+@\S+", " ", corpus())):
        words[w] = words.get(w, 0) + 1
    stats = {}
    for lo, fs in m.forms.items():
        if " " in lo or not any(f.proper for f in fs) or all(EM._distinct(f.text) for f in fs): continue
        nl = words.get(lo, 0); nu = words.get(lo[:1].upper() + lo[1:], 0) + sum(words.get(f.text, 0) for f in fs if f.text[1:] != lo[1:])
        stats[lo] = [nl, nu]
    common = sorted(k for k, (nl, nu) in stats.items() if nl >= MIN_LOWER and nl >= RATIO * (nl + nu))
    (ROOT / "data" / "entmatch_common.json").write_text(json.dumps({"rule": f"klein >= {MIN_LOWER} und >= {RATIO:.0%} aller Vorkommen", "common": common,
                                                               "stats": {k: stats[k] for k in sorted(stats)}}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(len(common), "Allerweltswoerter von", len(stats), "einteiligen Eigennamen-Formen")


if __name__ == "__main__":
    main()
