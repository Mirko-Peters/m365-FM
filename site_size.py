"""Groessenpruefung des GitHub-Pages-Builds."""
from pathlib import Path


def sizes(out=Path(__file__).parent / "docs", warning=900_000_000, limit=980_000_000):
    """Groesse von docs/ je Verzeichnis; vor dem Pages-Limit warnen und abbrechen."""
    dirs, files = {}, []
    for f in out.rglob("*"):
        if not f.is_file(): continue
        n = f.stat().st_size; rel = f.relative_to(out).as_posix()
        top = rel.split("/", 1)[0]
        dirs[top] = dirs.get(top, 0) + n
        files.append((n, rel))
    tot = sum(dirs.values())
    print("docs/ gesamt: %.0f MB" % (tot / 1e6) + " - " + ", ".join(f"{name}: {size / 1e6:.0f} MB" for name, size in sorted(dirs.items(), key=lambda x: x[1], reverse=True)[:12]))
    if tot >= warning:
        marker = "::error::" if tot >= limit else "::warning::"
        print(f"{marker} docs/ umfasst {tot / 1e6:.0f} MB (Warnung ab 900 MB, Abbruch ab 980 MB)")
        print("Groesste Verzeichnisse: " + ", ".join(f"{name}: {size / 1e6:.0f} MB" for name, size in sorted(dirs.items(), key=lambda x: x[1], reverse=True)[:10]))
        print("Groesste Dateien: " + ", ".join(f"{name} ({size / 1e6:.1f} MB)" for size, name in sorted(files, reverse=True)[:10]))
    if tot >= limit:
        raise SystemExit(f"Abbruch: docs/ darf hoechstens 980 MB umfassen (aktuell {tot / 1e6:.0f} MB)")
