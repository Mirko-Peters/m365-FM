#!/usr/bin/env python3
"""Hilfen fuer den Workflow live-schalten.yml (nur Entscheidungen, keine Netzaufrufe; die Daten liefert `gh api` im Workflow).

  gate  --sha SHA --runs runs.json --checks checks.json
        Darf der Stand SHA von `staging` nach `main`? Ja nur, wenn der NEUESTE Lauf von staging-checks fuer genau diesen Stand
        (Push auf staging oder von Hand auf staging gestartet) erfolgreich beendet ist UND der Statuscheck `staging-geprueft`
        aus diesem Lauf (App github-actions) gruen ist. Exit 0 = ja, 1 = nein (klare deutsche Meldung).
  plan  --base ALT --head NEU
        Welche der Live-Workflows (worker.yml, sitewrk.yml, site.yml) wuerde ein Push dieser Dateien auf main starten?
        Noetig, weil ein Merge mit dem GITHUB_TOKEN selbst KEINE Push-Workflows ausloest. Gibt die Dateinamen aus, einen je Zeile.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

CHECK_NAME = "staging-geprueft"
LIVE_WORKFLOWS = ("worker.yml", "sitewrk.yml", "site.yml")


def gate(runs, checks, sha):
    """runs: Liste aus .workflow_runs, checks: Liste aus .check_runs. -> (ok, meldung)"""
    kurz = sha[:7]
    kandidaten = [r for r in runs if r.get("head_sha") == sha and r.get("head_branch") == "staging" and r.get("event") in ("push", "workflow_dispatch")]
    if not kandidaten:
        return False, (f"Fuer den aktuellen Stand von staging ({kurz}) gibt es keinen Lauf von staging-checks. "
                       "Entweder haben die Pruefungen noch nicht gestartet (eine Minute warten und erneut versuchen) oder sie fehlen: "
                       "Actions > staging-checks > Run workflow mit Zweig staging starten.")
    neuester = max(kandidaten, key=lambda r: (r.get("created_at") or "", r.get("id") or 0))
    link = neuester.get("html_url", "")
    if neuester.get("status") != "completed":
        return False, f"Die Pruefungen fuer staging ({kurz}) laufen noch. Bitte warten, bis staging-geprueft gruen ist, und dann erneut schalten. {link}"
    if neuester.get("conclusion") != "success":
        return False, f"Die Pruefungen fuer staging ({kurz}) sind NICHT gruen (Ergebnis: {neuester.get('conclusion')}). Erst beheben, dann erneut schalten. {link}"
    ok_checks = [c for c in checks if c.get("name") == CHECK_NAME and (c.get("app") or {}).get("slug") == "github-actions"]
    if not ok_checks:
        return False, f"Der Statuscheck {CHECK_NAME} fehlt fuer staging ({kurz}). Bitte staging-checks erneut laufen lassen. {link}"
    mit_lauf = [c for c in ok_checks if not neuester.get("check_suite_id") or (c.get("check_suite") or {}).get("id") in (None, neuester.get("check_suite_id"))]
    if not mit_lauf:
        return False, f"Der Statuscheck {CHECK_NAME} gehoert nicht zum letzten Lauf von staging-checks ({kurz}). Bitte staging-checks erneut laufen lassen. {link}"
    if not any(c.get("status") == "completed" and c.get("conclusion") == "success" for c in mit_lauf):
        return False, f"Der Statuscheck {CHECK_NAME} fuer staging ({kurz}) ist nicht gruen. {link}"
    return True, f"Pruefungen fuer staging ({kurz}) sind gruen: {link}"


def glob_to_re(pattern):
    """GitHub-Muster (on.push.paths): `**` ueber Ordner, `*` und `?` innerhalb eines Namens."""
    out, i = "", 0
    while i < len(pattern):
        c = pattern[i]
        if pattern.startswith("**/", i):
            out += "(?:.*/)?"; i += 3
        elif pattern.startswith("**", i):
            out += ".*"; i += 2
        elif c == "*":
            out += "[^/]*"; i += 1
        elif c == "?":
            out += "[^/]"; i += 1
        else:
            out += re.escape(c); i += 1
    return re.compile("^" + out + "$")


def trifft(patterns, dateien):
    """Positive Muster treffen, mit `!` beginnende nehmen wieder heraus (wie bei GitHub)."""
    pos = [glob_to_re(p) for p in patterns if not p.startswith("!")]
    neg = [glob_to_re(p[1:]) for p in patterns if p.startswith("!")]
    return any(any(r.match(f) for r in pos) and not any(n.match(f) for n in neg) for f in dateien)


def push_paths(workflow_text):
    """Liest on.push.paths und on.push.branches aus dem Text eines Workflows. -> (branches, paths)"""
    import yaml
    doc = yaml.safe_load(workflow_text) or {}
    on = doc.get("on", doc.get(True)) or {}
    push = on.get("push") if isinstance(on, dict) else None
    if not isinstance(push, dict):
        return [], []
    return list(push.get("branches") or []), list(push.get("paths") or [])


def plan(dateien, workflows):
    """workflows: {dateiname: workflow-text}. -> Liste der Live-Workflows, die ein Push auf main mit diesen Dateien starten wuerde."""
    out = []
    for name in LIVE_WORKFLOWS:
        text = workflows.get(name)
        if text is None:
            continue
        branches, paths = push_paths(text)
        if "main" not in branches:
            continue
        if not paths or trifft(paths, dateien):
            out.append(name)
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    g = sub.add_parser("gate")
    g.add_argument("--sha", required=True)
    g.add_argument("--runs", required=True)
    g.add_argument("--checks", required=True)
    p = sub.add_parser("plan")
    p.add_argument("--base", required=True)
    p.add_argument("--head", required=True)
    p.add_argument("--workflows", default=".github/workflows")
    a = ap.parse_args(argv)
    if a.cmd == "gate":
        runs = json.loads(Path(a.runs).read_text("utf-8")).get("workflow_runs", [])
        checks = json.loads(Path(a.checks).read_text("utf-8")).get("check_runs", [])
        ok, msg = gate(runs, checks, a.sha)
        print(msg)
        return 0 if ok else 1
    diff = subprocess.run(["git", "diff", "--name-only", f"{a.base}..{a.head}"], capture_output=True, text=True, check=True).stdout.split("\n")
    dateien = [x for x in diff if x]
    wf = {n: (Path(a.workflows) / n).read_text("utf-8") for n in LIVE_WORKFLOWS if (Path(a.workflows) / n).exists()}
    for n in plan(dateien, wf):
        print(n)
    return 0


if __name__ == "__main__":
    sys.exit(main())
