# Lernpfad „Manufacturing Excellence“: Lücken und Vorschläge (Stand 24.11.2026)

Nur Analyse. Nichts veröffentlicht, keine Seite geändert.

## 0. Stand

- **PR #581** ist gemergt (20.11., 22.605 Zeilen, 10 Leitfäden EN/DE + Pfadseite). Ob `/learn/path/manufacturing-excellence/` live antwortet, konnte ich nicht prüfen: der Proxy dieser Sitzung sperrt www.m365.fm. Bitte einmal im Browser öffnen.
- **Übersetzung:** keine läuft. Letzter Lauf von `translate-pillars.yml` war am 20.11. (Run 20, grün). Danach: PR #594 gab es/fr/id frei, PR #595 pt.
  - Indexierbar: en, de, es, fr, id, pt.
  - Übersetzt, aber nicht freigegeben: it, ko, nl, pl, ru, uk, he.
  - Unvollständig: **ja 8/10** (fehlen `ifakt-polaris`, `manufacturing-it-azure`), **ar 9/10** (fehlt `ifakt-polaris`). Beide brauchen einen Nachlauf, bevor sie freigegeben werden können.
- Offene PRs (#596, #597) betreffen den Lernpfad nicht.

## 1. Artikel je Pillar

Gezählt mit der Logik aus `site_pillars._match` (Themen + Slug-Muster, erster Pillar ab 2 Punkten, zweiter ab 4) über `imports/blog/en` (605 Dateien) und `imports/blog-queue` (808). Ein Artikel kann in zwei Pillars zählen. Ich habe nicht geprüft, welche Blogdateien tatsächlich `publish: true` und live sind.

| Pillar | Blog | Queue | Bewertung |
|---|---|---|---|
| Lean Manufacturing | 25 | 0 | gut |
| Value Stream Mapping | 25 | 0 | gut |
| Production Scheduling / APS | 19 | 0 | gut |
| Digital Twin | 19 | 0 | gut |
| Shop Floor Management | 17 | 0 | gut (Gemba überrepräsentiert: 9 von 17) |
| Manufacturing KPIs | 16 | 0 | ok, aber dünn bei Qualität und Instandhaltung |
| Manufacturing IT / Azure | 12 | 3 | Menge ok, Thema falsch: kaum Azure/IoT, Queue = D365 Finance/Supply |
| **Aerospace** | **5** | 0 | zu wenig, 2 davon doppelt aus APS/IFAKT |
| **Operational Excellence** | **3** | 0 | zu wenig; weitere OpEx-Artikel hängen unter Lean (Treffer-Muster zieht sie dorthin) |
| **iFAKT Polaris** | **3** | 0 | bewusst klein (Herstellerthema), alle 3 gepinnt |

Die Queue (59 Tage-Ordner ab 2026-12-01) enthält fast nur M365/Azure/Copilot-Themen. Für den Lernpfad bringt sie nichts außer drei D365-Supply-Chain-Artikeln.

Auffällig: Der OpEx-Pillar (3) hat laut Registry nur das Muster `operational excellence|opex`. Die Artikel `operational-excellence-roadmap…`, `…-framework…`, `…-kpis…` landen bei Lean und nicht bei OpEx. Das ist ein Zuordnungsproblem, kein Inhaltsproblem (siehe Reihenfolge, Punkt 1).

## 2. Themenlücken je Stufe

Geprüft per Slug-Suche in Blog und Queue.

**Stufe 1 Grundlagen**
- Instandhaltung/TPM: nur `total-productive-maintenance-first-90-days`. Kein Einsteigerartikel „Was ist TPM“, nichts zu autonomer Instandhaltung.
- Andon, Jidoka, Stopp-Rufe: kein Artikel (Pillar Shopfloor erwähnt Andon im Muster, Artikel fehlt).
- Qualität: kein Artikel zu Fehlerquoten, FPY, 8D, SPC. Qualität fehlt im ganzen Pfad.
- Arbeitssicherheit/Ergonomie: nichts.
- Menschen und Veränderung: Schulung, Führungsverhalten, Widerstand: nur Randthemen in OpEx-Culture.

**Stufe 2 Sehen und messen**
- OEE: 2 Artikel (Erklärung, Software). Fehlt: OEE-Berechnung mit Beispiel je Schicht, Verlustkategorien (Six Big Losses), OEE-Fallen.
- Kennzahlen außerhalb OEE: FPY/Ausschuss gibt es (Scrap), aber nicht OTIF, Lieferantenqualität, Bestandsreichweite im Pfad-Zusammenhang.
- Datenerhebung: kein Artikel zu BDE/MDE (Betriebs- und Maschinendatenerfassung) für Einsteiger.

**Stufe 3 Planen und simulieren**
- Absatz- und Produktionsplanung (S&OP), Prognose: kein Artikel. Zwischen Wertstrom und Feinplanung fehlt die Grobplanung.
- Rüstoptimierung in der Planung (Reihenfolge nach Rüstkosten): SMED ja, Planung dazu nein.
- Wiederbeschaffung/Disposition: MRP vs APS ja, MRP-Parameter (Losgrößen, Vorlaufzeiten) nein.

**Stufe 4 Anwenden**
- Aerospace: 5 Artikel, nichts zu AS9100-Dokumentation, Erstmusterprüfung (FAI), Seriennummern-Rückverfolgung im Detail, Sonderprozesse.
- Manufacturing IT / Azure: kein Artikel zu Azure IoT Hub/Operations, OPC UA, Edge, Microsoft Fabric/Power BI für Produktionsdaten, Copilot in der Fertigung, Dynamics 365 Produktionssteuerung. Der Pillar heißt „Azure“, die Artikel sind ERP/MES-neutral. Hier liegt die größte Lücke und zugleich die engste Verbindung zu m365.fm.
- Polaris: bewusst klein halten, nur 1 Anwendungsfall mit Zahlen wäre sinnvoll (Herstellerangabe kennzeichnen).

## 3. Pillars mit zu wenigen Cluster-Artikeln

1. **Operational Excellence (3):** Ziel mindestens 10. Erst Zuordnung korrigieren, dann 3–4 neue Artikel.
2. **Aerospace (5):** Ziel 10.
3. **Manufacturing IT/Azure (12, aber thematisch leer):** 6–8 gezielte Artikel zu Azure/Microsoft.
4. **KPIs (16):** Qualität und Instandhaltung ergänzen, nicht mehr OEE.
5. **iFAKT Polaris (3):** reicht, 1 Fallstudie.

## 4. Fehlende Artikel (Titel, Suchabsicht, Hauptkeyword)

Titel englisch, weil Blog englisch führt. Suchabsicht: I = informieren, T = Anleitung, K = Kauf/Vergleich. Keyword-Volumen nicht geprüft (kein Zugriff auf `search_demand` Daten live); vorher gegen `data` Money-Keywords abgleichen.

Einsteiger
1. „What Is Total Productive Maintenance (TPM)? The Eight Pillars Explained“, I, `total productive maintenance` → Pillar KPIs/Lean
2. „Andon System Explained: How to Stop the Line Without Blame“, I, `andon system` → Shopfloor
3. „First Pass Yield (FPY): Formula, Example and How to Improve It“, I, `first pass yield` → KPIs
4. „What Is S&OP? Sales and Operations Planning for Plants“, I, `sales and operations planning` → APS
5. „What Is Jidoka? Autonomation and Built-In Quality“, I, `jidoka` → Lean
6. „Digital Shop Floor Data Collection: MDE and BDE for Beginners“, I, `machine data collection` → KPIs/IT
7. „What Is AS9100? Quality Management for Aerospace Suppliers“, I, `AS9100` → Aerospace

Vertiefung
8. „The Six Big Losses in OEE: How to Find Yours“, I/T, `six big losses` → KPIs
9. „8D Report Step by Step: Template and Example“, T, `8d report` → Lean/Qualität
10. „Azure IoT Operations for the Factory Floor: Architecture and First Use Case“, I/K, `azure iot operations manufacturing` → IT/Azure
11. „OPC UA to the Cloud: Connecting Machines to Azure and Fabric“, T, `opc ua azure` → IT/Azure
12. „Production KPIs in Power BI: Data Model for OEE and Scrap“, T, `oee power bi` → KPIs/IT
13. „Microsoft Fabric for Manufacturing: Real-Time Intelligence on Machine Data“, I, `microsoft fabric manufacturing` → IT/Azure
14. „Copilot in Manufacturing: Practical Use Cases for Planners and Supervisors“, I, `copilot manufacturing` → IT/Azure
15. „Dynamics 365 Production Control vs. an External APS: When to Use Which“, K, `dynamics 365 production control` → APS/IT
16. „First Article Inspection (FAI) in Aerospace: AS9102 Step by Step“, T, `first article inspection AS9102` → Aerospace
17. „Special Processes in Aerospace: Planning Capacity and Qualification“, I, `aerospace special processes` → Aerospace
18. „Operational Excellence Maturity Assessment: 20 Questions to Score Your Plant“, T, `operational excellence assessment` → OpEx
19. „Change Management on the Shop Floor: Why Lean Programs Stall“, I, `lean change management` → OpEx
20. „Rough-Cut Capacity Planning: Check Feasibility Before Scheduling“, T, `rough cut capacity planning` → APS

## 5. Formate

Der Pfad hat bisher nur Fließtext. Vorschläge nach Aufwand:

- **Glossar** (`/learn/glossary/`, 80–120 Begriffe, DE/EN, Link auf Pillar). Höchster SEO-Nutzen je Aufwand, wird aus den Leitfäden gezogen.
- **Rechner (statisch, JS):** OEE-Rechner, Takt-/Zykluszeit-Rechner, Wertschöpfungsgrad. Ergänzen die vorhandenen Formelartikel.
- **Checklisten/Vorlagen als Download:** 5S-Audit, Gemba-Walk-Fragen (Artikel existiert), Tier-Meeting-Agenda, A3-Vorlage, VSM-Symbole. Als PDF/XLSX oder druckbare Seite.
- **Quiz:** je Stufe 8–10 Fragen mit Auflösung, am Stufenende. Gut für Verweildauer und Wiederkehr.
- **Reifegrad-Selbsttest** (OpEx-Assessment): 20 Fragen, Ergebnis nennt die passende Stufe, verlinkt Pillars.
- Alle Bilder und Downloads nach CLAUDE.md in R2 (`img.m365.fm`), Zugangsdaten nur als Secrets.

## 6. Reihenfolge nach Wirkung

1. **Zuordnung prüfen** (klein, sofort): OpEx-Artikel von Lean zu OpEx (Regex/pins in `data/pillars.json`). Hebt OpEx von 3 auf ca. 8, ohne neuen Text.
2. **Ja/Ar vervollständigen** (je 1–2 Leitfäden), dann die sieben übersetzten Sprachen nach Prüfung freigeben. Reichweite ohne neue Inhalte.
3. **Manufacturing IT/Azure** (Artikel 10–15): größte Themenlücke, passt zur Marke, eigene Keywords.
4. **Glossar** (Format): breiter SEO-Hebel, viele interne Links.
5. **Qualität und Instandhaltung** (Artikel 1, 3, 8, 9): schließt die inhaltliche Lücke im Pfad.
6. **Aerospace** (7, 16, 17): Nischenthema, wenig Konkurrenz, Bezug zu iFAKT.
7. **OEE- und Takt-Rechner, Checklisten:** nach Glossar.
8. **S&OP, Grobplanung** (4, 20) und OpEx-Assessment (18, 19): schließen die Stufen ab.
9. **Quiz:** zuletzt, wenn der Pfad vollständig ist.

## Grenzen

- Live-Seite und Suchvolumen nicht geprüft (Proxy, keine Daten).
- Zählung nach Slug-/Titel-/Themenmuster, nicht nach tatsächlich veröffentlichten Artikeln.
- `git fetch` lief in ein Zeitlimit; Stand ist der lokale Klon (Commit `f101a8fe`, 24.11.).
