---
name: retro
description: Kurzer Rückblick auf eine Arbeitssession mit Vorschlägen, wie Arbeitsweise, Werkzeuge oder Skills in diesem Repo besser werden. Nutzen am Ende eines größeren Arbeitsblocks, nach einem Fehler mit Folgen (roter Deploy, falsche Daten, verlorene Zeit), oder wenn Mirko „Rückblick“ / „retro“ sagt.
---

# Rückblick

Ziel: Aus einer Session eine oder zwei dauerhafte Verbesserungen machen, nicht eine lange Liste.

## Vorgehen
1. **Was lief gut** (höchstens drei Punkte, mit Beleg).
2. **Was kostete Zeit oder ging schief** – je Punkt: was passiert ist, belegte Ursache (Skill `fehlersuche`), wie viel es gekostet hat (Zeit, KI-Kosten, Mirkos Aufwand).
3. **Vorschläge**, je Punkt genau einer, und zwar der kleinste, der das Wiederauftreten verhindert:
   - Test oder Prüfung in der CI,
   - Wächter in einem Workflow,
   - Ergänzung eines Skills unter `.claude/skills/`,
   - Werkzeug unter `tools/`,
   - Regel in CLAUDE.md (nur wenn Mirko sie freigibt).
4. **Mirko fragen**, welche Vorschläge umgesetzt werden sollen. Nichts an CLAUDE.md oder Workflows ändern ohne seine Freigabe.

## Form
Deutsch, kurz, als Abschnitt „Rückblick <Datum>“ im Logbuch und als knappe Nachricht an Mirko mit nummerierten Vorschlägen zum Ankreuzen („1 ja, 2 nein …“).

## Beispiele aus diesem Repo
- Platte lief durch alte Worktrees voll → Vorschlag: nach jedem Merge die Worktrees des Branches entfernen (Schritt in Skill `nachweis`).
- KI-Lauf übernahm 20 % falsche Kanten → Vorschlag: Stichprobe vor jeder automatischen Übernahme, Kategorie-Regel in `tools/ontology_ai.py`.
- Spreaker-Code lief ab → Vorschlag: Tausch dort, wo der Code ankommt, nicht im Workflow.
