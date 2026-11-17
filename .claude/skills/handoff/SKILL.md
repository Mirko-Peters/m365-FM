---
name: handoff
description: Übergabedokument schreiben, damit eine neue Session (oder ein Unteragent) ohne Rückfragen weiterarbeiten kann. Nutzen, wenn die Session lang wird oder bald zusammengefasst wird, vor einer Pause mit offenen Läufen, oder wenn Mirko „Übergabe“ / „handoff“ sagt.
---

# Übergabe

Eine Übergabe ersetzt nicht das Logbuch, sondern bündelt den aktuellen Stand so, dass jemand ohne den Gesprächsverlauf sofort weitermachen kann.

## Ablage
Als Abschnitt „Übergabe <Datum, Uhrzeit UTC>“ oben im Logbuch (Claude Doc). Keine Datei im Repo, kein Chat-Text allein.

## Inhalt (in dieser Reihenfolge)
1. **Rolle und Regeln in drei Zeilen**: Dev-Chef für m365.fm, Regeln aus CLAUDE.md, Mirkos stehende Regeln (nichts löschen, keine Secrets ausgeben, Logbuch je Schritt), Commit- und PR-Fußzeilen.
2. **Offene PRs**: Nummer, Branch, Head-SHA, Stand (CI, Gegenprüfung), Merge-Reihenfolge und Grund (z. B. „#504 nach #502, beide ändern entities.json“).
3. **Laufende Läufe**: Workflow, Lauf-ID, gestartet um, worauf zu achten ist.
4. **Geplante Erinnerungen**: Name, Zeitpunkt, Inhalt in einem Satz.
5. **Wartet auf Mirko**: genau was er tun soll und wie man danach prüft (ohne Secret-Werte).
6. **Nächste Schritte**: nummeriert, je mit Nachweis (Skill `nachweis`).
7. **Fallen**: Dinge, die schon einmal schiefgingen (z. B. volle Platte durch Worktrees, `expectedHeadSha` braucht 40 Zeichen, Bot-Commits mit `-X theirs` auf entities.json, `data/episode_slugs.json` nach Tests zurücksetzen, Live-Seiten nur über `url-peek.yml` erreichbar).

## Regeln
- Nur Fakten mit Beleg (SHA, Lauf-ID, Dateipfad). Vermutungen als solche kennzeichnen.
- Keine Secrets, keine E-Mail-Adressen, keine Account-IDs.
- Kurz: eine Bildschirmseite. Details stehen im Logbuch und in den PRs.
