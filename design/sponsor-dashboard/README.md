# Sponsor-Dashboard – Entwurf

Design-Canvas „M365.FM Sponsor-Dashboard – Entwurf“ (https://claude.ai/artifact/RmYzS6mnLav51vky4w91dS). Stand: 4.11.2026. Ticket #173 (Draft-PR #177).

| Datei | Inhalt |
|---|---|
| Main.dc.html | Übersicht: Zeitraum, 8 Kennzahlen mit Quelle und Art (gemessen/geschätzt/manuell), Reichweite pro Woche, Platzierungen, CSV/PDF |
| Placement.dc.html | Eine Platzierung im Detail, Reiter Podcast / Video / Website / Suche & KI |
| Report.dc.html | Monatsbericht als PDF (A4) |
| Data-Sources.dc.html | Admin: Datenquellen mit Status und manuelle Eingabe (Bing AI, LinkedIn-Newsletter) |

Alle Zahlen im Entwurf sind Beispieldaten („Demo · sample data“). Kennzahlen und Datenquellen: siehe Kommentar in #173.

## Stand 10.11.2026 (Umsetzung in assets/sponsor-dashboard.js)
Zusätzlich zum Entwurf zeigt die Übersicht je Firma: echte und gefilterte Klicks mit Quote (die Trennung ist eine Schätzung) und Herkunft nach Land, Leads (nur mit gebuchtem Lead-Formular),
Aufrufe je Entität (Firma, Produkte, Themen) und je Beitrag (Plan `data/sponsor_posts_<name>.json`, falls vorhanden), Suchbegriffe mit Position (Google Search Console), Bing-Zahlen je Seite und KI-Zitate
(Bing AI nur manuell, website-weite Zahlen aus `data/stats/ai_performance.json` getrennt markiert). Jede Zahl trägt Quelle und Art; fehlt eine Quelle, steht „Noch nicht angebunden“.
