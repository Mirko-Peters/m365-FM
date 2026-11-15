#!/usr/bin/env python3
"""Gibt Blog-Artikel aus der Warteschlange frei (imports/blog-queue/<JJJJ-MM-TT>/<slug>.md).

Alle Artikel der Warteschlange werden nach imports/blog/en/ verschoben (Ordnerdatum nur als Reihenfolge, aelteste
zuerst), dabei bekommen die Dateien status: approved, publish: true und das Freigabedatum (morgen nach Berliner Zeit,
also der Tag, an dem sie mit dem Seitenbau live gehen). Wird ein Stichtag angegeben, werden nur Ordner bis dahin
freigegeben. Je Lauf hoechstens LIMIT Artikel,
damit Seitenbau und Uebersetzung nachts nicht ueberlaufen. Vorhandene Slugs werden nie ueberschrieben.

Aufruf: python3 tools/blog_release.py [STICHTAG JJJJ-MM-TT] [LIMIT] [ARTIKELDATUM JJJJ-MM-TT]
Ohne Stichtag: alles freigeben, Datum der Artikel = morgen nach Berliner Zeit (der Lauf liegt abends, vor dem Seitenbau um 01:07 UTC).
"""
import datetime, os, re, shutil, sys
from zoneinfo import ZoneInfo

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUEUE = os.path.join(ROOT, "imports", "blog-queue")
DEST = os.path.join(ROOT, "imports", "blog", "en")


def set_head(text, key, value):
    head, sep, body = text.partition("\n---\n")
    if not text.startswith("---\n") or not sep:
        raise ValueError("kein YAML-Kopf")
    pat = re.compile(r"^%s:.*$" % key, re.M)
    line = "%s: %s" % (key, value)
    head = pat.sub(line, head, count=1) if pat.search(head) else head + "\n" + line
    return head + sep + body


def main():
    tomorrow = (datetime.datetime.now(ZoneInfo("Europe/Berlin")).date() + datetime.timedelta(days=1)).isoformat()
    cutoff = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] else ""
    target = cutoff or "9999-12-31"
    limit = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2] else 15
    if len(sys.argv) > 3 and sys.argv[3]:
        tomorrow = sys.argv[3]  # Datum der Artikel von Hand setzen (z. B. heute fuer einen Start-Lauf)
    if not os.path.isdir(QUEUE):
        print("keine Warteschlange"); return
    os.makedirs(DEST, exist_ok=True)
    days = sorted(d for d in os.listdir(QUEUE) if re.fullmatch(r"\d{4}-\d{2}-\d{2}", d) and d <= target)
    moved = 0
    for d in days:
        folder = os.path.join(QUEUE, d)
        for name in sorted(os.listdir(folder)):
            if not name.endswith(".md"):
                continue
            if moved >= limit:
                print("Limit %d erreicht, Rest folgt im naechsten Lauf" % limit); return
            src, dst = os.path.join(folder, name), os.path.join(DEST, name)
            if os.path.exists(dst):
                print("UEBERSPRUNGEN (Slug existiert): " + name); continue
            text = open(src, encoding="utf-8").read()
            for k, v in (("status", "approved"), ("publish", "true"), ("date", tomorrow)):
                text = set_head(text, k, v)
            open(dst, "w", encoding="utf-8").write(text)
            os.remove(src)
            moved += 1
            print("freigegeben: %s (Ordner %s, Datum %s)" % (name, d, tomorrow))
        if not [n for n in os.listdir(folder) if n.endswith(".md")]:
            shutil.rmtree(folder, ignore_errors=True)
    print("%d Artikel freigegeben (Stichtag %s, Datum %s)" % (moved, cutoff or "keiner", tomorrow))


if __name__ == "__main__":
    main()
