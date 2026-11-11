#!/usr/bin/env python3
"""Git-Merge-Treiber fuer das Kostenbuch data/spend.json (Monatsgrenzen der KI-Jobs). Mehrere Workflows schreiben es (articles.yml: Sonnet-Felder und
"articles_tr", shownotes-seo.yml: "shownotes"); ein `git pull --rebase -X theirs` wuerde bei benachbarten Aenderungen still die Schluessel des anderen Jobs
verwerfen und dessen Monatsgrenze zu niedrig rechnen. Dieser Treiber fuehrt dreiseitig je Schluessel zusammen: Zahlen sind Zaehler (Basis + beide Zuwaechse),
Objekte rekursiv, sonst gewinnt die geaenderte Seite. Damit ist die Reihenfolge der Seiten egal (Rebase vertauscht ours/theirs).
Einrichtung im Workflow (nur lokal im Runner, nichts im Repo): data/spend.json merge=spendjson in .git/info/attributes und
git config merge.spendjson.driver "python3 <Kopie dieses Skripts> %O %A %B". Aufruf: spend_merge.py BASIS AKTUELL ANDERE -> schreibt AKTUELL, Exit 1 bei kaputtem JSON."""
import json, sys

MISSING = object()


def _num(x): return isinstance(x, (int, float)) and not isinstance(x, bool)


def merge(o, a, b):
    """Dreiseitig: o Basis, a und b die beiden Seiten (MISSING = Schluessel fehlt). Rueckgabe MISSING = Schluessel entfaellt."""
    if a == b: return a
    if a == o: return b
    if b == o: return a
    vals = [v for v in (o, a, b) if v is not MISSING]
    if all(_num(v) for v in vals):   # Zaehler: was beide Seiten seit der Basis dazugezaehlt haben, addiert (fehlend = 0)
        z = lambda v: 0 if v is MISSING else v
        r = z(a) + z(b) - z(o)
        return round(r, 4) if isinstance(r, float) else r
    if all(isinstance(v, dict) for v in vals):
        d = lambda v: {} if v is MISSING else v
        out = {}
        for k in list(d(a)) + [k for k in d(b) if k not in d(a)] + [k for k in d(o) if k not in d(a) and k not in d(b)]:
            r = merge(d(o).get(k, MISSING), d(a).get(k, MISSING), d(b).get(k, MISSING))
            if r is not MISSING: out[k] = r
        return out
    return a if a is not MISSING else b   # beide Seiten haben denselben Nicht-Zaehler verschieden geaendert: aktuelle Seite


def _load(p):
    with open(p, encoding="utf-8") as f:
        t = f.read()
    return json.loads(t) if t.strip() else {}


def main(argv):
    o, a, b = argv[1:4]
    try:
        r = merge(_load(o), _load(a), _load(b))
    except (ValueError, OSError) as e:
        print(f"spend_merge: {e} - Konflikt bleibt stehen", file=sys.stderr); return 1
    with open(a, "w", encoding="utf-8") as f:
        json.dump(r, f, indent=1)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
