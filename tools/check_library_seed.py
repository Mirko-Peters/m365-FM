"""Prueft die Start-Eintraege der Bibliothek (data/library_seed/<art>.json) gegen die Regeln des Worker-Endpunkts /api/library/save.
Aufruf: python tools/check_library_seed.py [--per-kind 10] [--min-chars 2500]. Exit 1 bei Verstoessen."""
import argparse, json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
KINDS = ["prompt", "instructions", "agent", "skill", "plugin", "manifest", "copilotstudio", "flow", "powerapp", "kql", "dax", "excel", "graph", "powershell", "adaptivecard", "other"]
BAD_HOST = re.compile(r"(^|\.)(bit\.ly|t\.co|tinyurl\.com|goo\.gl|is\.gd|ow\.ly|buff\.ly|cutt\.ly|rebrand\.ly|shorturl\.at)$", re.I)
URL = re.compile(r"https?://\S+", re.I)
SLUG = lambda t: re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", t.lower().replace("ß", "ss")))[:60]
PLACEHOLDER = re.compile(r"lorem ipsum|TODO|TBD|<your[ -]|\[insert|xxx{3,}", re.I)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--per-kind", type=int, default=10); ap.add_argument("--min-chars", type=int, default=2500); a = ap.parse_args()
    ents = {e["id"] for e in json.load(open(ROOT / "data/entities.json", encoding="utf-8"))}
    bad, titles, seen_slug = [], {}, set()
    for k in KINDS:
        f = ROOT / "data/library_seed" / f"{k}.json"
        if not f.exists(): bad.append(f"{k}: Datei fehlt"); continue
        try: items = json.load(open(f, encoding="utf-8"))
        except Exception as e: bad.append(f"{k}: kein gueltiges JSON ({e})"); continue
        if len(items) != a.per_kind: bad.append(f"{k}: {len(items)} Eintraege statt {a.per_kind}")
        for i, it in enumerate(items, 1):
            w = f"{k}#{i}"
            if it.get("kind") != k: bad.append(f"{w}: kind {it.get('kind')!r}")
            t, s, b, lang = it.get("title", ""), it.get("summary", ""), it.get("body", ""), it.get("lang", "en")
            if not (5 <= len(t) <= 140): bad.append(f"{w}: Titel Laenge {len(t)}")
            if URL.search(t) or URL.search(s) or re.search(r"[<>]", t + s): bad.append(f"{w}: URL oder <> in Titel/Zusammenfassung")
            if not (40 <= len(s) <= 300): bad.append(f"{w}: Zusammenfassung Laenge {len(s)}")
            if len(b) < a.min_chars: bad.append(f"{w}: Text nur {len(b)} Zeichen")
            if len(b) > 20000: bad.append(f"{w}: Text {len(b)} > 20000")
            if lang != "en": bad.append(f"{w}: lang {lang!r} (Start: en)")
            if PLACEHOLDER.search(b + t + s): bad.append(f"{w}: Platzhaltertext")
            tp = it.get("topics", [])
            if not (1 <= len(tp) <= 10): bad.append(f"{w}: {len(tp)} Themen (1-10)")
            for x in tp:
                if x not in ents: bad.append(f"{w}: Thema {x!r} existiert nicht")
            ln = it.get("link", "")
            if k == "plugin" and not ln: bad.append(f"{w}: Plugin braucht https-Link")
            if ln:
                m = re.match(r"https://([^/]+)", ln)
                if not m or len(ln) > 300 or BAD_HOST.search(m.group(1)): bad.append(f"{w}: Link ungueltig")
            if t.lower() in titles: bad.append(f"{w}: Titel doppelt mit {titles[t.lower()]}")
            titles[t.lower()] = w
            sl = SLUG(t)
            if sl in seen_slug: bad.append(f"{w}: Slug {sl} doppelt")
            seen_slug.add(sl)
    n = sum(len(json.load(open(ROOT / 'data/library_seed' / f'{k}.json', encoding='utf-8'))) for k in KINDS if (ROOT / 'data/library_seed' / f'{k}.json').exists())
    print(f"{n} Eintraege geprueft, {len(bad)} Verstoesse")
    for x in bad[:200]: print(" -", x)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
