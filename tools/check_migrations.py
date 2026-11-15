#!/usr/bin/env python3
"""Pruefung der D1-Migrationen (worker/migrations) vor dem Hochschalten auf Live.

Regeln (jede Verletzung ist ein Fehler, Exit 1):
  1. Dateiname NNNN_name.sql (vierstellige Nummer, Kleinbuchstaben, Ziffern, Unterstrich).
  2. Jede Nummer kommt hoechstens einmal vor (Nummernkollision, z. B. zwei Pull Requests mit 0047).
  3. Schon veroeffentlichte Migrationen (auf dem Basiszweig, Standard origin/main) werden nie geaendert, umbenannt oder geloescht:
     D1 merkt sich nur den Namen, eine geaenderte Datei liefe in Live nie nach.
  4. Neue Migrationen haben eine hoehere Nummer als die hoechste auf dem Basiszweig (Reihenfolge).
Luecken in der Nummerierung (heute fehlt 0016) sind nur ein Hinweis.
Danach werden alle Migrationen der Reihe nach in eine leere SQLite-Datenbank im Speicher gespielt (Simulation von D1).

Aufruf:  python3 tools/check_migrations.py [--dir worker/migrations] [--base origin/main] [--no-git] [--no-apply]
"""
import argparse
import re
import sqlite3
import subprocess
import sys
from pathlib import Path

NAME = re.compile(r"^(\d{4})_[a-z0-9_]+\.sql$")


def parse(names):
    """-> ({nummer: [dateinamen]}, [ungueltige Namen])"""
    nums, bad = {}, []
    for n in sorted(names):
        m = NAME.match(n)
        if not m:
            bad.append(n)
            continue
        nums.setdefault(int(m.group(1)), []).append(n)
    return nums, bad


def check_tree(names):
    """Regeln 1 und 2 (und Hinweis auf Luecken) fuer eine Liste von Dateinamen. -> (fehler, hinweise)"""
    errors, notes = [], []
    nums, bad = parse(names)
    for n in bad:
        errors.append(f"Dateiname `{n}` passt nicht zu NNNN_name.sql (vier Ziffern, danach Kleinbuchstaben, Ziffern und Unterstriche).")
    for num, files in sorted(nums.items()):
        if len(files) > 1:
            errors.append(f"Nummernkollision {num:04d}: " + ", ".join(f"`{f}`" for f in files) + " - eine der beiden auf die naechste freie Nummer umbenennen (nach dem Merge von main).")
    if nums:
        gaps = [f"{i:04d}" for i in range(min(nums), max(nums)) if i not in nums]
        if gaps:
            notes.append("Luecken in der Nummerierung (kein Fehler): " + ", ".join(gaps))
    return errors, notes


def check_against_base(base, head, base_text=None, head_text=None):
    """Regeln 3 und 4. base/head: Listen von Dateinamen auf dem Basiszweig und im aktuellen Stand.
    base_text/head_text: Funktionen name -> Inhalt (nur fuer den Vergleich gleich benannter Dateien)."""
    errors = []
    base_set, head_set = set(base), set(head)
    for n in sorted(base_set - head_set):
        errors.append(f"Migration `{n}` ist auf dem Basiszweig schon veroeffentlicht, fehlt aber hier (geloescht oder umbenannt). Bereits angewendete Migrationen nie anfassen.")
    if base_text and head_text:
        for n in sorted(base_set & head_set):
            if base_text(n) != head_text(n):
                errors.append(f"Migration `{n}` wurde geaendert, ist aber auf dem Basiszweig schon veroeffentlicht. D1 spielt sie kein zweites Mal ein: stattdessen eine neue Migration mit der naechsten Nummer anlegen.")
    base_nums, _ = parse(base)
    top = max(base_nums) if base_nums else 0
    for n in sorted(head_set - base_set):
        m = NAME.match(n)
        if m and int(m.group(1)) <= top:
            errors.append(f"Neue Migration `{n}` hat eine Nummer, die nicht ueber der hoechsten auf dem Basiszweig liegt ({top:04d}). Reihenfolge einhalten: naechste freie Nummer ist {top + 1:04d}.")
    return errors


def apply_all(directory, names):
    """Alle Migrationen der Reihe nach in eine leere SQLite-Datenbank. -> (anzahl tabellen, fehler)"""
    db = sqlite3.connect(":memory:")
    errors = []
    for n in sorted(names):
        try:
            db.executescript((Path(directory) / n).read_text("utf-8"))
        except Exception as e:  # noqa: BLE001 - jede SQL-Ausnahme melden
            errors.append(f"Migration `{n}` laesst sich auf einer leeren Datenbank nicht einspielen: {type(e).__name__}: {str(e)[:200]}")
            break
    tables = db.execute("select count(*) from sqlite_master where type='table'").fetchone()[0]
    db.close()
    return tables, errors


def git(*args):
    return subprocess.run(["git", *args], capture_output=True, text=True, check=False)


def base_listing(base, directory):
    r = git("ls-tree", "--name-only", f"{base}:{directory}/")
    if r.returncode != 0:
        return None
    return [Path(x).name for x in r.stdout.split("\n") if x.endswith(".sql")]


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dir", default="worker/migrations")
    ap.add_argument("--base", default="origin/main", help="Basiszweig fuer den Vergleich (Standard origin/main)")
    ap.add_argument("--no-git", action="store_true", help="nur Nummern und Einspielen pruefen, kein Vergleich mit dem Basiszweig")
    ap.add_argument("--no-apply", action="store_true", help="Migrationen nicht in SQLite einspielen")
    a = ap.parse_args(argv)
    d = Path(a.dir)
    names = sorted(p.name for p in d.glob("*.sql"))
    if not names:
        print(f"FEHLER: keine Migrationen in {d}")
        return 1
    errors, notes = check_tree(names)
    if not a.no_git:
        base = base_listing(a.base, a.dir)
        if base is None:
            # kein Basiszweig vorhanden (z. B. flacher Checkout): das ist ein Fehler, sonst wuerde die Reihenfolge nie geprueft
            errors.append(f"Basiszweig `{a.base}` nicht lesbar - Checkout mit fetch-depth: 0 und `git fetch origin main` noetig.")
        else:
            def base_text(n):
                return git("show", f"{a.base}:{a.dir}/{n}").stdout

            def head_text(n):
                return (d / n).read_text("utf-8")
            errors += check_against_base(base, names, base_text, head_text)
            new = sorted(set(names) - set(base))
            notes.append(f"Neue Migrationen gegenueber {a.base}: " + (", ".join(new) if new else "keine"))
    if not a.no_apply and not errors:
        tables, e = apply_all(d, names)
        errors += e
        if not e:
            notes.append(f"Alle {len(names)} Migrationen laufen auf einer leeren SQLite-Datenbank durch ({tables} Tabellen).")
    for n in notes:
        print("Hinweis:", n)
    for e in errors:
        print("FEHLER:", e)
    print("Migrationspruefung:", "ROT" if errors else "gruen", f"({len(names)} Dateien)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
