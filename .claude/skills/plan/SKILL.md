---
name: plan
description: Plan mit genauen Dateipfaden vor größeren Änderungen in diesem Repo. Nutzen, wenn eine Aufgabe mehr als zwei Dateien oder mehr als einen Bereich (Seitenbau, Worker, Site-Worker, Workflows, Daten) berührt, Kosten verursacht (KI-Läufe) oder Live-Verhalten ändert. Nicht für Einzeiler oder reine Prüfaufgaben.
---

# Plan vor dem Bauen

Ein Plan ist kurz und konkret. Er wird nicht zur Freigabe vorgelegt, wenn Mirko die Aufgabe schon freigegeben hat – er dient dazu, dass Bau, Gegenprüfung und Logbuch dasselbe Ziel haben.

## Inhalt
1. **Ziel in einem Satz** und woran man merkt, dass es erreicht ist (siehe Skill `nachweis`).
2. **Ist-Stand mit Belegen**: welche Dateien und Funktionen heute beteiligt sind (`datei.py:zeile`), was gemessen wurde.
3. **Schritte**, je Schritt:
   - genaue Dateien (neu / geändert),
   - was sich ändert,
   - Test, der es prüft (vorhandene Testdatei oder neue unter `tests/`, `worker/test/`, `sitewrk/test/`).
4. **Wirkung nach dem Merge**: welche Workflows danach laufen müssen (z. B. `worker.yml` für Worker-Secrets, `site.yml` für Seiten, Worker-Sync für D1) und wie lange das dauert (Seitenbau etwa 2 h).
5. **Risiken und Rückweg**: Notschalter (z. B. Variable zurück auf "0"), was passiert, wenn ein Schritt fehlschlägt.
6. **Kosten**, falls KI beteiligt: Schätzung in EUR vor dem Lauf, Tagesbudget, erst `plan`, dann `run`.

## Projektregeln, die jeder Plan einhält
- Bilder nur über R2 (`img.m365.fm`), siehe CLAUDE.md.
- Nichts löschen; Ersetztes bleibt nachvollziehbar (z. B. 301 statt Seite entfernen, alter Datensatz unter `was`).
- Secrets nur als GitHub-Secrets, nie in Code, Log oder Chat; nie nach Werten fragen.
- GitHub Pages bleibt unter 980 MB (`build-size.json`); große Seitengruppen gehören nach R2.
- Commits deutsch, ohne Modellnamen; Branch `claude/<thema>`; kein Force-Push.
- Logbuch-Eintrag je Schritt: erledigt / blockiert / nächster Schritt.

## Danach
Bauen in einem eigenen Worktree, dann unabhängige Gegenprüfung mit verschiedenen Blickwinkeln (Korrektheit, Sicherheit, Live-Wirkung), Befunde beheben oder begründet ablehnen, PR, Merge erst bei grüner CI.
