#!/usr/bin/env python3
"""Pruefung nach `git pull --rebase --autostash` in den Workflows, vor dem `git push`.

Warum: `git pull --rebase --autostash` endet auch dann mit 0, wenn das Zurueckspielen des Autostash kollidiert. git laesst dann
Konfliktmarker ("<<<<<<< Updated upstream" ... ">>>>>>> Stashed changes") in der Arbeitskopie, die uebrigen Stash-Dateien GESTAGED
und den Stash-Eintrag "autostash" stehen. Der naechste Sicherungsschritt (`git add <eigene Datei>` + `git commit`) committet dann die
Marker-Datei und alle fremden gestagten Dateien mit (Bau 773, Commit 4749aa83: data/members_export.json mit Markern, dazu
data/speaker_entities.json und data/speakers.json aus der Arbeitskopie).

Aufruf in den Workflows immer direkt hinter dem pull: `git pull --rebase --autostash ... && python3 tools/git_sync_check.py && git push ...`.
Exit 0 = alles heil (Normalfall, keine Ausgabe). Exit 1 = mit ::error:: abbrechen, nicht pushen, wenn
  - nicht aufgeloeste Pfade im Index stehen (git ls-files -u),
  - ein Stash-Eintrag "autostash" uebrig ist (Autostash liess sich nicht zurueckspielen; die Arbeitskopie ist halb),
  - eine Datei in den noch nicht gepushten Commits Konfliktmarker enthaelt oder (bei *.json) kein gueltiges JSON ist.
Die Arbeitskopie wird nicht veraendert. Ein Commit, der lokal bleibt, verschwindet mit dem Runner.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys

MARKER = re.compile(rb"^(<<<<<<<|>>>>>>>)(?: |$)", re.M)
MAX_COMMITS = 200  # ohne Remote-Refs nicht die ganze Historie durchsuchen


def _git(cwd, *args: str) -> str:
    return subprocess.run(["git", *args], cwd=cwd, check=True, capture_output=True).stdout.decode("utf-8", "replace")


def _blob(cwd, rev_path: str) -> bytes | None:
    r = subprocess.run(["git", "cat-file", "blob", rev_path], cwd=cwd, capture_output=True)
    return r.stdout if r.returncode == 0 else None


def unpushed_files(cwd=None) -> list[str]:
    """Dateien, die die noch nicht gepushten Commits (HEAD ohne Remote-Zweige und FETCH_HEAD des pull) aendern."""
    excl = ["--remotes"]
    if subprocess.run(["git", "rev-parse", "-q", "--verify", "FETCH_HEAD^{commit}"], cwd=cwd, capture_output=True).returncode == 0:
        excl.append("FETCH_HEAD")
    out = _git(cwd, "log", f"-n{MAX_COMMITS}", "--format=", "--name-only", "--no-renames", "-z", "HEAD", "--not", *excl)
    return sorted({p.strip("\n") for p in out.split("\0") if p.strip("\n")})


def problems(cwd=None) -> list[str]:
    errs: list[str] = []
    unmerged = sorted({ln.split("\t", 1)[1] for ln in _git(cwd, "ls-files", "-u").splitlines() if "\t" in ln})
    if unmerged:
        errs.append("nicht aufgeloeste Pfade (Konflikt beim Zurueckspielen des Autostash): " + ", ".join(unmerged))
    stashes = [ln for ln in _git(cwd, "stash", "list", "--format=%gd %gs").splitlines() if ln.split(" ", 1)[-1].strip() == "autostash"]
    if stashes:
        errs.append("Autostash liess sich nicht zurueckspielen, die Arbeitskopie ist halb (gestagte Fremddateien moeglich): "
                    + ", ".join(s.split(" ", 1)[0] for s in stashes))
    for path in unpushed_files(cwd):
        data = _blob(cwd, f"HEAD:{path}")
        if data is None or b"\0" in data:  # geloescht oder binaer (z. B. *.json.gz)
            continue
        if MARKER.search(data):
            errs.append(f"Konfliktmarker in {path}")
        elif path.endswith(".json"):
            try:
                json.loads(data)
            except ValueError as e:
                errs.append(f"kein gueltiges JSON in {path}: {e}")
    return errs


def main() -> int:
    try:
        errs = problems()
    except (subprocess.CalledProcessError, OSError) as e:
        errs = [f"Pruefung nicht moeglich: {e}"]
    for e in errs:
        print(f"::error::git_sync_check: {e}", flush=True)
    if errs:
        print("::error::git_sync_check: nicht gepusht. Lokale Commits und die Arbeitskopie bleiben nur auf diesem Runner;"
              " main ist unveraendert.", flush=True)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
