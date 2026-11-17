"""Linktexte im Altbestand zaehlen, vorher/nachher (offline, ohne Seitenbau): fruehere Podpage-Blogbeitraege mit allen Sprachfassungen
(data/blog_i18n) und die alten Show Notes der englischen Folgen samt Uebersetzungen (data/podpage_i18n/notes_<lang>.json).

Rechnet dieselben Schritte wie der Bau (site_legacy_blog.items -> site_anchor.improve) und schreibt reports/anchor_texts.json.
Aufruf: python tools/anchor_report.py [--langs de,fr] [--no-write]"""
import argparse
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import site_anchor as ANC   # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--langs", default="", help="nur diese Sprachfassungen (Komma-Liste); Standard: data/blog_tr.json build")
    ap.add_argument("--no-write", action="store_true")
    a = ap.parse_args()
    import site_legacy_blog as LBL
    import site_podpage as P
    BASE = "https://www.m365.fm"
    if a.langs:
        want = [x for x in a.langs.split(",") if x]
        LBL.tr_config = lambda: (want, want)
    items = LBL.items(BASE)
    tt = LBL.titles(BASE)
    rep = {"blog": {}, "shownotes": {}}
    for x in items:
        lang = x.get("lang") or "en"
        ref = None if lang == "en" else LBL.EN_HTML.get(x["slug"])
        new = ANC.improve(x["html"], lang, tt, ref=ref, area="report")
        b, n = ANC.weak(x["html"], lang, tt, ref), ANC.weak(new, lang, tt, ref)
        assert ANC.improve(new, lang, tt, ref=ref, area="report-2") == new, ("nicht idempotent", x["slug"], lang)
        r = rep["blog"].setdefault(lang, {"pages": 0, "pages_changed": 0, "before": Counter(), "after": Counter()})
        r["pages"] += 1; r["pages_changed"] += new != x["html"]; r["before"].update(b); r["after"].update(n)
    eps = [e for e in P.load("episodes") if e.get("show_notes") and e.get("published") not in (False, "False") and e.get("hidden") not in (True, "True")]
    en = {}
    for e in eps:
        h = P.rename_links(P.san(e["show_notes"])); en[e["slug"]] = h
        new = ANC.improve(h, "en", tt, area="report")
        r = rep["shownotes"].setdefault("en", {"pages": 0, "pages_changed": 0, "before": Counter(), "after": Counter()})
        r["pages"] += 1; r["pages_changed"] += new != h; r["before"].update(ANC.weak(h, "en", tt)); r["after"].update(ANC.weak(new, "en", tt))
    for f in sorted((P.D / "podpage_i18n").glob("notes_*.json")):
        lang = f.stem[6:]
        if a.langs and lang not in a.langs.split(","):
            continue
        for slug, ln in json.loads(f.read_text("utf-8")).items():
            if slug not in en or not ln:
                continue
            h = P.san(ln); new = ANC.improve(h, lang, tt, ref=en[slug], area="report")
            r = rep["shownotes"].setdefault(lang, {"pages": 0, "pages_changed": 0, "before": Counter(), "after": Counter()})
            r["pages"] += 1; r["pages_changed"] += new != h; r["before"].update(ANC.weak(h, lang, tt, en[slug])); r["after"].update(ANC.weak(new, lang, tt, en[slug]))
    tot = {}
    for area, by in rep.items():
        t = tot.setdefault(area, {"pages": 0, "pages_changed": 0, "before": Counter(), "after": Counter()})
        for r in by.values():
            t["pages"] += r["pages"]; t["pages_changed"] += r["pages_changed"]; t["before"].update(r["before"]); t["after"].update(r["after"])
    out = {"total": tot, "by_lang": rep, "rules": dict(sorted(((f"{k[1]}", v) for k, v in ANC.STATS.items() if k[0] == "report"), key=lambda x: -x[1]))}
    js = json.loads(json.dumps(out, ensure_ascii=False))
    for area, t in tot.items():
        print(f"{area}: {t['pages']} Seiten, {t['pages_changed']} geaendert | vorher {sum(t['before'].values())} {dict(t['before'].most_common())} | nachher {sum(t['after'].values())} {dict(t['after'].most_common())}")
    for area, by in rep.items():
        for lang, r in sorted(by.items()):
            print(f"  {area} {lang}: vorher {sum(r['before'].values())}, nachher {sum(r['after'].values())}, Seiten geaendert {r['pages_changed']}/{r['pages']}")
    print("Regeln:", js["rules"])
    if not a.no_write:
        (ROOT / "reports").mkdir(exist_ok=True)
        (ROOT / "reports" / "anchor_texts.json").write_text(json.dumps(js, ensure_ascii=False, indent=1), "utf-8")


if __name__ == "__main__":
    main()
