---
name: fehlersuche
description: Systematische Fehlersuche in diesem Repo – erst die Ursache belegen, dann reparieren. Nutzen, sobald ein Workflow, Test, Deploy, Seitenbau, Worker oder eine Live-Seite nicht tut, was er soll (rot, Fehlermeldung, falscher Wert, Zeitüberschreitung), bevor eine Änderung gemacht wird.
---

# Fehlersuche: Ursache zuerst

Ziel: Keine Reparatur auf Verdacht. Jede Änderung muss auf eine belegte Ursache zeigen.

## 1. Fehlerbild festhalten (ohne zu deuten)
- Genaue Fehlermeldung wörtlich aus dem Log (GitHub-Job-Log mit `tail`, nicht nur den Titel des Laufs). Tokens, Codes und Schlüssel in Auszügen schwärzen, bevor sie in Chat, PR oder Logbuch landen.
- Wann zuerst aufgetreten? Letzter grüner Lauf, erster roter Lauf, Commit dazwischen (`git log <gruen>..<rot>`).
- Zeiten mitschreiben: Start des Laufs, Start des Schritts, Zeitpunkt des Fehlers. Viele Fehler hier sind Zeitfehler (Warteschlange, Ablauf eines Codes, Cache-Laufzeit, 2-Stunden-Seitenbau).
- Betroffen: nur ein Lauf oder alle? Nur eine Sprache, ein Seitentyp, ein PoP?

## 2. Hypothesen aufstellen und prüfen
- Zwei bis fünf mögliche Ursachen notieren, für jede einen Test, der sie widerlegen kann.
- Vorhandene Werkzeuge nutzen statt raten:
  - Live-Seiten sind aus der Claude-Umgebung oft nicht erreichbar: `url-peek.yml` (Eingabe `struct:<url>`) starten.
  - Ladezeit: `crp-check.yml`, Auswertung mit `tools/crp_live.mjs`.
  - Worker: `cd worker && node --test`, Site-Worker: `cd sitewrk && node --test`.
  - Python: `python3 -m pytest -q tests/<datei>`.
  - Merge-Konflikte ohne Checkout: `git merge-tree --write-tree --name-only origin/main <branch>`.
- Erst wenn eine Hypothese belegt ist (Log-Zeile, reproduzierter Test, Messwert), weiter zu 3.

## 3. Reproduzieren
- Den Fehler lokal oder in einem Test nachstellen, bevor repariert wird. Geht das nicht (z. B. externer Dienst), den Beleg aus Schritt 2 im Commit nennen.
- Neuer Test, der ohne die Reparatur rot ist, wenn das mit vertretbarem Aufwand geht.

## 4. Reparieren – klein und an der Ursache
- Nur die Ursache beheben, keine Nebenbaustellen im selben Commit.
- Nichts löschen, was nicht ersetzt wird (Projektregel). Keine Secrets in Code, Log oder Chat.
- Lokale Testläufe ändern `data/episode_slugs.json` – vor dem Commit zurücksetzen.

## 5. Nachweis
- Den Test aus Schritt 3 grün zeigen und den echten Lauf (CI, Deploy, url-peek) abwarten. Siehe Skill `nachweis`.
- Im Logbuch: Fehlerbild, belegte Ursache, Reparatur, Nachweis (erledigt / blockiert / nächster Schritt).

## Beispiel aus diesem Repo
Spreaker verbinden scheiterte zweimal mit `invalid_grant: The authorization code has expired`. Die Zeiten im Log zeigten: Code-Tausch 40 s nach dem Start, ein Lauf 70 min in der Warteschlange. Ursache: Spreaker-Codes gelten nur etwa 30 s. Reparatur war deshalb nicht „schneller einfügen“, sondern der Tausch im Worker direkt auf der Rückleitungsseite.
