# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Process Mining in der Produktion: MES- und ERP-Daten (52 Zeichen) |
| Meta-Description | Process Mining in der Produktion: Event Log aus MES und ERP, Rechenbeispiel, objektzentriertes Process Mining, Tools, Betriebsrat und typische Fehler. (151 Zeichen) |
| Slug | `/learn/digital-twin/process-mining-produktion/` (vollständige URL: https://www.m365.fm/learn/digital-twin/process-mining-produktion/) |
| Parent-Pillar | [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/) |
| Hauptkeyword | Process Mining in der Produktion |
| Nebenkeywords | Process Mining Fertigung, Process Mining MES, Process Mining ERP, Event Log, Ereignisprotokoll, objektzentriertes Process Mining, OCEL 2.0, XES, Conformance Checking, Prozessanalyse Produktion, Durchlaufzeitanalyse, Celonis Produktion, Power Automate Process Mining, Process Mining Betriebsrat |
| Suchintention | Informational. Gesucht wird, was Process Mining in der Produktion leistet, welche Daten aus MES und ERP nötig sind, wie ein Event Log aufgebaut ist und welche Tools und Standards es gibt. |
| Wortzahl | 4.703 Wörter (`wc -w` H1 bis Fazit; englische Fassung: 5.005) |
| Sprachversion | `de-DE`. hreflang-Paar: `de-DE` https://www.m365.fm/learn/digital-twin/process-mining-produktion/ <-> `en-US` https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus.

---

# Process Mining in der Produktion: So werden Event Logs aus MES und ERP zu Erkenntnissen über den Materialfluss

*Stand: 20. November 2026 · Teil des Leitfadens [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/)*

> **Kurzantwort:** Process Mining in der Produktion rekonstruiert, wie Fertigungsaufträge, Lose und Teile tatsächlich durch ein Werk laufen, und zwar aus den Zeitstempeln, die ERP, MES, Lagerverwaltung, Qualitäts- und Instandhaltungssysteme ohnehin erfassen. Es entdeckt den realen Prozess, prüft ihn gegen den geplanten Arbeitsplan (Conformance Checking) und ergänzt das Bild um Zeiten, Warten und Nacharbeit. Schwierig ist in der Produktion nicht der Algorithmus, sondern das Event Log (Ereignisprotokoll): festlegen, was als Fall zählt, Daten über Systeme hinweg verknüpfen und wissen, was jeder Zeitstempel bedeutet.

Dieser Fachartikel gehört zu unserem Leitfaden [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/). In dessen Begriffswelt baut Process Mining einen datengetriebenen **digitalen Schatten** des Prozesses: Es zeigt auf Basis aufgezeichneter Ereignisse, was passiert ist. Der Schwesterartikel zur [Simulation in der Produktion](https://www.m365.fm/learn/digital-twin/simulation-produktion/) testet, was bei Änderungen passieren würde. Beide wirken am besten zusammen.

Ein Großteil der veröffentlichten Process-Mining-Literatur behandelt Purchase-to-Pay oder Order-to-Cash. Die Produktion ist anders: Ein Auftrag teilt sich in mehrere Lose, mehrere Aufträge teilen sich ein Materiallos, Maschinen bearbeiten Chargen, und die Hälfte der Zeitstempel wird von Menschen nachträglich gebucht. Diese Unterschiede gehen wir an einem Rechenbeispiel durch, das sich Zeile für Zeile nachvollziehen lässt.

### Das Wichtigste in Kürze

- Process Mining hat drei Grundtypen: **Discovery** (ein Modell aus dem Log erzeugen), **Conformance Checking** (ein Modell mit dem Log vergleichen) und **Enhancement** (ein Modell um Zeiten, Ressourcen und andere Daten aus dem Log erweitern) [2].
- Das minimale Event Log besteht aus **Fall-ID, Aktivität und Zeitstempel** [2]. Im Werk kann der Fall ein Fertigungsauftrag, ein Los, eine Seriennummer oder eine Maschine sein, und jede Wahl ergibt ein anderes Bild.
- **Objektzentriertes Process Mining** betrachtet Aufträge, Lose, Maschinen und Prüflose gleichzeitig, statt eine einzige Fall-ID zu erzwingen. **OCEL 2.0** ist das aktuelle Austauschformat für solche Logs [4]; **IEEE 1849-2023 (XES)** ist der Standard für klassische Logs mit einer Fall-ID [3].
- Im Rechenbeispiel verbringen sechs Aufträge nur 12,5 % ihrer Durchlaufzeit in erfassten Aktivitäten, und Nacharbeit belegt 18 % der Belegungszeit der Engpassmaschine. Eine "Abweichung" entpuppt sich als verspätete Lagerbuchung, nicht als Prozessproblem.
- Process Mining zeigt, was passiert ist; es sagt nicht, was passiert, wenn man etwas ändert. Dafür gibt es die [Simulation](https://www.m365.fm/learn/digital-twin/simulation-produktion/), gespeist mit den Verteilungen, die das Mining liefert [5].

## Inhaltsverzeichnis

1. [Was ist Process Mining?](#1-was-ist-process-mining)
2. [Warum Produktionsdaten anders sind](#2-warum-produktionsdaten-anders-sind)
3. [Woher die Ereignisse im Werk kommen](#3-woher-die-ereignisse-im-werk-kommen)
4. [Rechenbeispiel: ein Event Log aus MES- und ERP-Daten](#4-rechenbeispiel-ein-event-log-aus-mes--und-erp-daten)
5. [Dasselbe Beispiel objektzentriert](#5-dasselbe-beispiel-objektzentriert)
6. [Anwendungsfälle in der Produktion](#6-anwendungsfälle-in-der-produktion)
7. [Process Mining, Wertstromanalyse, Simulation und MES-Dashboards](#7-process-mining-wertstromanalyse-simulation-und-mes-dashboards)
8. [Tools und Standards](#8-tools-und-standards)
9. [Einführung in sieben Schritten](#9-einführung-in-sieben-schritten)
10. [Mitarbeitende, Datenschutz und Betriebsrat](#10-mitarbeitende-datenschutz-und-betriebsrat)
11. [Typische Fehler](#11-typische-fehler)
12. [FAQ](#12-faq)
13. [Fazit](#13-fazit)

## 1. Was ist Process Mining?

Das Process Mining Manifesto der IEEE Task Force on Process Mining (2012) liefert eine kompakte Definition des Fachgebiets. Es nennt drei Typen von Process Mining [2] (Zitate hier in deutscher Übersetzung):

- **Discovery:** "Eine Discovery-Technik nimmt ein Event Log und erzeugt ein Modell, ohne A-priori-Informationen zu verwenden."
- **Conformance:** "Ein bestehendes Prozessmodell wird mit einem Event Log desselben Prozesses verglichen."
- **Enhancement:** "Die Idee ist, ein bestehendes Prozessmodell mit Informationen über den tatsächlichen Prozess zu erweitern oder zu verbessern", zum Beispiel mit Zeiten oder Ressourcen.

Das Manifest legt außerdem sechs Leitprinzipien fest. Zwei davon sind im Werk am wichtigsten: **"Log Extraction Should Be Driven by Questions"** (die Log-Extraktion soll von Fragen geleitet sein) und **"Process Mining Should Be a Continuous Process"** (Process Mining soll ein kontinuierlicher Prozess sein) [2]. Es nennt elf Herausforderungen, die erste davon "Finding, Merging, and Cleaning Event Data" (Ereignisdaten finden, zusammenführen und bereinigen) [2]. Genau dort verbringen Produktionsprojekte den größten Teil ihres Aufwands.

Wil van der Aalsts Lehrbuch *Process Mining: Data Science in Action* (2. Auflage, 2016) ist das Standardwerk zu den Algorithmen, von Process Discovery über Conformance Checking bis zu prädiktiver Analyse [1].

Im Glossar des Manifests ist ein **Event Log** eine "Sammlung von Ereignissen, die als Eingabe für Process Mining dient", ein **Fall (Case)** "die Entität, die von dem analysierten Prozess bearbeitet wird", und eine **Aktivität** "ein klar definierter Schritt im Prozess" [2]. Jedes Ereignis trägt mindestens einen Fallbezug, eine Aktivität und einen Zeitstempel; Ressource und weitere Attribute sind optional.

## 2. Warum Produktionsdaten anders sind

Finanzprozesse haben meist einen natürlichen Fall: eine Rechnung, eine Bestellung. In der Produktion gibt es das selten. Vier Eigenschaften machen Werksdaten schwieriger:

1. **Mehrere mögliche Fälle.** Ein Kundenauftrag erzeugt Fertigungsaufträge; ein Fertigungsauftrag verbraucht Materiallose und erzeugt Seriennummern; Arbeitsgänge laufen auf Maschinen; Prüfungen erzeugen Prüflose. Jedes davon ist ein gültiger Fall, und jedes ergibt eine andere Prozesslandkarte.
2. **Divergenz und Konvergenz.** Ein Rohmateriallos versorgt mehrere Fertigungsaufträge (Divergenz). Eine Baugruppe verbraucht Komponenten aus mehreren Aufträgen (Konvergenz). Wer die Daten auf eine einzige Fall-ID flach klopft, verdoppelt gemeinsame Ereignisse oder verliert sie.
3. **Chargenbildung.** Ein Härteofen oder eine Waschanlage bearbeitet Teile aus mehreren Aufträgen in einem Durchgang. In einem auftragszentrierten Log erscheint dasselbe physische Ereignis mehrfach.
4. **Bedeutung der Zeitstempel.** Eine "Rückmeldung" im ERP kann der Zeitpunkt sein, zu dem jemand den Arbeitsgang gebucht hat, nicht der Zeitpunkt, zu dem er stattfand. Ein SPS-Signal ist präzise, hat aber keinen Auftragsbezug. Das MES liegt dazwischen.

Das Manifest bewertet die Qualität von Event Logs auf fünf Stufen, von der obersten (vertrauenswürdig, vollständig, semantisch annotiert) bis zur untersten (von Hand geführte Aufzeichnungen, die nicht zur Realität passen müssen). **ERP-Tabellen** stehen auf der dritten von fünf Stufen: "automatisch erfasst und vertrauenswürdig, aber nicht unbedingt vollständig" [2]. Das beschreibt die meisten Werksdaten treffend: gut genug für den Start, nie gut genug, um ihnen blind zu vertrauen.

Die klassische Antwort auf die Punkte 1 bis 3 ist ein Fallbegriff je Fragestellung. Die neuere Antwort ist **objektzentriertes Process Mining**, bei dem sich jedes Ereignis auf mehrere Objekte unterschiedlicher Typen (Auftrag, Los, Maschine) beziehen kann. Die OCEL-2.0-Spezifikation, veröffentlicht vom OCEL-Team der RWTH Aachen, definiert Ereignisse, Objekte, Beziehungen zwischen Ereignis und Objekt sowie zwischen Objekten mit Qualifikatoren und Objektattribute, deren Werte sich über die Zeit ändern [4]. Abschnitt 5 zeigt, wie das aussieht.

## 3. Woher die Ereignisse im Werk kommen

Nach ISA-95 liegt das ERP auf Ebene 4 und das MES auf Ebene 3; unser geplanter Pillar zu [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant) erklärt die Ebenen. Für Process Mining zählt, welches System welches Ereignis mit welchem Schlüssel und welcher Zeitstempelbedeutung erfasst.

| System | Typische Ereignisse | Natürliche Fall- bzw. Objektschlüssel | Bedeutung des Zeitstempels | Fallstricke |
|---|---|---|---|---|
| ERP (Produktionsplanung) | Auftrag angelegt, freigegeben, Arbeitsgang rückgemeldet, Warenausgang, Wareneingang, Auftrag abgeschlossen | Kundenauftrag, Fertigungsauftrag, Materialbeleg | oft Buchungszeitpunkt | Sammelrückmeldungen am Schichtende; retrograde Entnahme erzeugt Ereignisse, die so nie "stattgefunden" haben |
| MES | Arbeitsgang Start/Ende, Rüsten Start/Ende, Unterbrechung mit Grundcode, Gut-/Ausschussmenge | Fertigungsauftrag, Arbeitsgang, Serien- oder Losnummer, Arbeitsplatz | nahe an der physischen Zeit, wenn an der Maschine rückgemeldet | manuelles Starten/Stoppen durch Werker; Ortszeit vs. UTC |
| LVS / Lager | Kommissionierung, Bereitstellung an der Linie, Umlagerung, Einlagerung | Transportauftrag, Ladeeinheit, Los | Scanzeitpunkt | Bereitstellung verspätet oder gesammelt gebucht |
| QMS | Prüflos angelegt, Ergebnis erfasst, Verwendungsentscheid, Abweichung | Prüflos, Abweichungsnummer | Erfassungszeitpunkt des Ergebnisses | Ergebnisse Stunden nach der Prüfung eingegeben |
| CMMS / Instandhaltung | Instandhaltungsauftrag angelegt, begonnen, abgeschlossen | Instandhaltungsauftrag, Equipment | Erfassungszeitpunkt | Reaktionszeit und Reparaturzeit vermischt |
| SPS / Historian | Zyklus Start/Ende, Alarm, Zustandswechsel | Maschine, Signal | präzise Maschinenzeit | kein Auftragsbezug ohne MES-Kontext |

Faustregel aus Projekten: mit ERP und MES für den Auftragsfluss beginnen, LVS und QMS ergänzen, wo Warten und Nacharbeit wichtig sind, und SPS-Daten nur dort nutzen, wo die Frage sekundengenaue Präzision verlangt (Streuung der Taktzeit, Kurzstillstände). Das ist eine praktische Heuristik, keine Norm.

## 4. Rechenbeispiel: ein Event Log aus MES- und ERP-Daten

Das Beispiel ist veranschaulichend: sechs Fertigungsaufträge für ein Drehfrästeil, freigegeben am 2. November 2026. Das ERP liefert Freigabe und Wareneingang, das LVS die Bereitstellung an der Linie, das MES die Arbeitsgänge auf dem Bearbeitungszentrum MC-07 und der Entgratstation DB-02, das QMS die Endprüfung. Alle Daten sind erfunden, um die Methode zu zeigen; die Zahlen unten wurden daraus berechnet.

### 4.1 Das Event Log (Auszug)

Das vollständige Log umfasst 40 Ereignisse. Zwei Aufträge sind hier dargestellt.

| Fall (Fertigungsauftrag) | Aktivität | Start | Ende | Ressource | Quelle |
|---|---|---|---|---|---|
| PO-4712 | Auftrag freigegeben | 02.11. 06:15 | 02.11. 06:15 | entfällt | ERP |
| PO-4712 | Material bereitgestellt | 02.11. 10:05 | 02.11. 10:20 | Linie 3 | LVS |
| PO-4712 | Fräsen | 02.11. 15:40 | 02.11. 17:50 | MC-07 | MES |
| PO-4712 | Entgraten | 03.11. 08:20 | 03.11. 09:00 | DB-02 | MES |
| PO-4712 | Endprüfung | 03.11. 11:10 | 03.11. 11:35 | QS | QMS |
| PO-4712 | Nacharbeit | 03.11. 13:00 | 03.11. 14:30 | MC-07 | MES |
| PO-4712 | Endprüfung | 03.11. 15:10 | 03.11. 15:30 | QS | QMS |
| PO-4712 | Wareneingang | 03.11. 15:45 | 03.11. 15:45 | entfällt | ERP |
| PO-4713 | Auftrag freigegeben | 02.11. 06:20 | 02.11. 06:20 | entfällt | ERP |
| PO-4713 | Fräsen | 02.11. 18:00 | 02.11. 20:05 | MC-07 | MES |
| PO-4713 | Material bereitgestellt | 02.11. 18:30 | 02.11. 18:40 | Linie 3 | LVS |
| PO-4713 | Entgraten | 03.11. 09:10 | 03.11. 09:45 | DB-02 | MES |
| PO-4713 | Endprüfung | 03.11. 11:40 | 03.11. 12:00 | QS | QMS |
| PO-4713 | Wareneingang | 03.11. 12:20 | 03.11. 12:20 | entfällt | ERP |

Um ein solches Log zu bauen, verknüpft man ERP-Auftragstabellen, MES-Arbeitsgangsätze, LVS-Transportaufträge und QMS-Prüflose über die Fertigungsauftragsnummer, ordnet systemspezifische Codes lesbaren Aktivitätsnamen zu und rechnet alle Zeitstempel auf eine Zeitbasis um. Der Werker steht bewusst nicht im Log (siehe Abschnitt 10).

### 4.2 Discovery: Varianten

Sortiert man die Ereignisse jedes Auftrags nach Startzeit, ergeben sich drei Varianten:

| Variante | Aufträge | Ablauf |
|---|---|---|
| V1 (geplanter Weg) | 3 | Freigegeben → Bereitgestellt → Fräsen → Entgraten → Prüfung → Wareneingang |
| V2 (Nacharbeitsschleife) | 2 | Freigegeben → Bereitgestellt → Fräsen → Entgraten → Prüfung → Nacharbeit → Prüfung → Wareneingang |
| V3 (Reihenfolgeanomalie) | 1 | Freigegeben → Fräsen → Bereitgestellt → Entgraten → Prüfung → Wareneingang |

Die Directly-Follows-Zählungen (direkte Nachfolger) zeigen dasselbe Bild: "Prüfung → Nacharbeit" und "Nacharbeit → Prüfung" kommen je zweimal vor, "Freigegeben → Fräsen" und "Fräsen → Bereitgestellt" je einmal.

### 4.3 Enhancement: Zeiten

| Kennzahl | Wert | Berechnung |
|---|---|---|
| Mittlere Durchlaufzeit (Freigabe bis Wareneingang) | 31,2 h | Mittelwert über die sechs Aufträge (Spanne 29,3 bis 33,7 h) |
| Erfasste Aktivitätszeit | 3,2 bis 5,3 h je Auftrag | Summe der Ereignisdauern |
| Anteil der Durchlaufzeit in erfassten Aktivitäten | 12,5 % insgesamt | Summe der Aktivitätszeiten ÷ Summe der Durchlaufzeiten; der Rest ist Warten oder nicht erfasst |
| Durchlaufzeit mit vs. ohne Nacharbeit | 33,6 h vs. 30,0 h | Mittelwert der V2-Aufträge vs. V1- und V3-Aufträge |
| Warten von Bereitstellung bis Fräsbeginn | 3,2 h, 5,3 h, 18,9 h, 20,9 h, 22,8 h | Aufträge 4711, 4712, 4714, 4715, 4716 (4713 ausgenommen, siehe unten) |
| Belegungszeit MC-07 | 15,7 h, davon Nacharbeit 2,8 h (18 %) | Summe der Fräs- und Nacharbeitsdauern auf MC-07 |

Drei Erkenntnisse für das Werk:

1. **MC-07 ist der Engpass, und ihm geht die Schicht aus.** Auf MC-07 läuft das Fräsen am Tag 1 von 13:05 bis 20:05 und am Tag 2 von 06:05 bis 12:45 fast lückenlos. Über Nacht läuft nichts. Die letzten drei Aufträge warten zwischen Bereitstellung und Fräsen etwa 19 bis 23 Stunden.
2. **Alle sechs Aufträge wurden innerhalb einer Stunde freigegeben,** obwohl MC-07 je Acht-Stunden-Schicht nur drei bis vier davon fräsen kann (je etwa 2,1 Stunden). Die frühe Freigabe erhöht Umlaufbestand und Wartezeit, ohne die Ausbringung zu steigern. Eine Freigaberegel, die an die Kapazität des Engpasses gekoppelt ist (Drum-Buffer-Rope oder CONWIP, siehe den geplanten Pillar [Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/)), würde die Durchlaufzeit bei gleicher Ausbringung verkürzen.
3. **Nacharbeit läuft auf dem Engpass.** 18 % der Belegungszeit von MC-07 gingen in die Nacharbeit zweier Aufträge. Jede Nacharbeitsstunde am Engpass ist eine Stunde verlorene Ausbringung für die ganze Zelle: 2,8 Stunden entsprechen in zwei Tagen der Fräszeit von etwa 1,3 Aufträgen (2,8 ÷ 2,14 h). Damit wird aus einem Qualitätsproblem ein Kapazitätsproblem.

Sechs Aufträge sind für Statistik viel zu wenig; das Beispiel zeigt die Methode. In einem echten Projekt betrachtet man mehrere Wochen an Aufträgen und Perzentile, nicht nur Mittelwerte.

### 4.4 Conformance Checking: Arbeitsplan gegen Log

Der ERP-Arbeitsplan lautet: Freigegeben → Bereitgestellt → Fräsen → Entgraten → Prüfung → Wareneingang. Gegen dieses Modell gilt:

- **3 von 6 Aufträgen (V1) passen** exakt zum Arbeitsplan.
- **2 Aufträge (V2)** weichen durch die Nacharbeitsschleife ab. Ob das als Abweichung zählt, hängt davon ab, ob der Arbeitsplan Nacharbeit als zulässige Ausnahme abbildet. Hier tut er das nicht, deshalb werden beide markiert.
- **1 Auftrag (V3)** zeigt das Fräsen *vor* der Bereitstellung. Physisch unmöglich: Das Material muss vor dem Fräsen an der Maschine sein. Vor Ort stellt sich heraus, dass der Bereitstellungsscan 30 Minuten nach Fräsbeginn gebucht wurde (Bereitstellung erfasst 18:30, Fräsbeginn 18:00). Das ist ein **Befund zur Datenqualität**, keine Prozessabweichung.

V3 enthält die wichtigste Lehre des Beispiels. Conformance Checking auf Werksdaten findet Prozessprobleme und Buchungsprobleme, und man muss sie mit Leuten auseinanderhalten, die den Shopfloor kennen. Hier passen 3 von 6 Traces vollständig (eine Fitness auf Trace-Ebene von 0,5); formale Verfahren berechnen auch feinere Maße, etwa wie viel jedes Traces ein Modell nachspielen kann, sodass ein Trace mit einem zusätzlichen Schritt trotzdem hoch bewertet wird. Das Manifest nennt die Balance zwischen Fitness, Einfachheit, Präzision und Generalisierung als zentrale Herausforderung [2].

Ein Wort zu den Begriffen: "Conformance" bedeutet im Process Mining die Übereinstimmung des Event Logs mit einem Prozessmodell. Es ist nicht die Produktkonformität im Sinne des Qualitätsmanagements. Einer Nacharbeitsschleife im Log kann im QMS eine Abweichungsmeldung mit Entscheidung entsprechen; dort analysiert man die Qualitätsseite. In einer Fallstudie von 2025 an einer vollautomatisierten Testfabrik ergab ein alignment-basiertes Conformance Checking eine Fitness von 1,0, und 64 von 70 geplanten Produkten wurden über die drei Hauptvarianten fertiggestellt [5].

### 4.5 Vom Mining zur Maßnahme und zur Simulation

Die Analyse führt zu drei möglichen Maßnahmen: Aufträge im Rhythmus des Engpasses freigeben, Nacharbeit an der Ursache reduzieren (Prüfdaten für eine Ursachenanalyse) und testen, ob sich eine dritte Schicht oder eine Verlagerung des Fräsens lohnt. Die ersten beiden kosten wenig. Die dritte ist eine Kapazitätsentscheidung mit Streuung und Störungen: ein Fall für die [Simulation](https://www.m365.fm/learn/digital-twin/simulation-produktion/). Das gewonnene Event Log liefert die Eingangsverteilungen für Bearbeitung, Warten und Nacharbeitsquoten und dient als Validierungsdatensatz für das Modell. Lee, Shin und Lee haben genau das an ihrer Testfabrik gemacht: Process Mining identifizierte den CNC-Engpass, und die Simulation zeigte, dass angepasste CNC-Einstellungen plus drei FTS das Ziel von 70 Einheiten erreichen konnten, während weitere FTS die Ausbringung nicht erhöhten [5]. Ihre Ergebnisse stammen aus einer einzigen Testumgebung, wie die Autoren selbst angeben [5].

## 5. Dasselbe Beispiel objektzentriert

Im auftragszentrierten Log oben sind Materiallos, Maschine und Prüflos nur Attribute. Angenommen, Los L-2207 Stangenmaterial wurde einmal bereitgestellt und versorgt sowohl PO-4713 als auch einen Folgeauftrag PO-4717 (nicht im Auszug). Flach nach Auftrag dargestellt, erscheint das eine physische Bereitstellungsereignis zweimal, und eine Zählung der "Bereitstellungsereignisse" überzeichnet die Lageraktivität. Ein objektzentriertes Log behält ein Ereignis und verknüpft es mit mehreren Objekten.

**Objekte (Auszug)**

| Objekt-ID | Objekttyp | Attribute |
|---|---|---|
| PO-4713 | Fertigungsauftrag | Material, Menge |
| PO-4717 | Fertigungsauftrag | Material, Menge |
| L-2207 | Materiallos | Lieferant, Schmelzennummer |
| MC-07 | Maschine | Arbeitsplatz |
| IL-9031 | Prüflos | Prüfplan |

**Ereignisse mit Ereignis-Objekt-Beziehungen (E2O) und Qualifikatoren**

| Ereignis | Aktivität | Zeit | Verknüpfte Objekte (Qualifikator) |
|---|---|---|---|
| e101 | Material bereitgestellt | 02.11. 18:30 | L-2207 (bereitgestelltes Los), PO-4713 (für Auftrag), PO-4717 (für Auftrag) |
| e102 | Fräsen | 02.11. 18:00 | PO-4713 (bearbeiteter Auftrag), L-2207 (verbrauchtes Los), MC-07 (ausgeführt auf) |
| e103 | Endprüfung | 03.11. 11:40 | PO-4713 (geprüfter Auftrag), IL-9031 (Prüflos) |

**Objekt-Objekt-Beziehung (O2O):** L-2207 "reserviert für" PO-4713 und PO-4717.

Das sind die Bausteine von OCEL 2.0: Ereignisse mit genau einem Typ, Objekte mit genau einem Typ, E2O- und O2O-Beziehungen mit Qualifikatoren sowie Objektattribute, die sich über die Zeit ändern können. Die Spezifikation bietet drei Austauschformate: SQLite, XML und JSON [4]. Aus einem solchen Log lassen sich dieselben Daten je Auftrag (Durchlaufzeit), je Los (wo Material wartet), je Maschine (Auslastung und Reihenfolge) und je Prüflos (Zeit bis zum Verwendungsentscheid) betrachten, ohne die Extraktion jedes Mal neu aufzubauen.

## 6. Anwendungsfälle in der Produktion

| Anwendungsfall | Frage | Hauptfall bzw. Objekte | Benötigte Daten |
|---|---|---|---|
| Durchlaufzeit und Warten | Wo warten Aufträge, und wie lange? | Fertigungsauftrag | ERP-Freigabe/-Wareneingang, MES-Arbeitsgänge |
| Engpass und Engpassverhalten | Welche Ressource treibt die Durchlaufzeit, und wann steht sie still? | Maschine + Auftrag | MES-Start/-Ende, Schichtkalender |
| Nacharbeits- und Ausschussschleifen | Wie oft laufen Aufträge zurück, und auf welcher Ressource? | Auftrag, Prüflos | MES, QMS |
| Konformität zum Arbeitsplan | Folgen Aufträge dem geplanten Arbeitsplan? | Auftrag | ERP-Arbeitsplan, MES-Arbeitsgänge |
| Auftragsfreigabe und Umlaufbestand | Werden Aufträge schneller freigegeben, als der Engpass sie abarbeiten kann? | Auftrag | ERP-Freigabedaten, MES |
| Materialverfügbarkeit | Warten Aufträge auf Bereitstellung oder fehlende Teile? | Auftrag + Los | LVS, ERP-Warenausgang |
| Instandhaltungsablauf | Wie lange dauert es vom Ausfall über den Reparaturbeginn bis zum Abschluss? | Instandhaltungsauftrag | CMMS, MES-Unterbrechungen |
| Technische Änderung | Wie lange dauert eine technische Änderung vom Antrag bis zum ersten gefertigten Teil? | Änderungsauftrag + Fertigungsauftrag | PLM, ERP |
| Auftrag bis Auslieferung | Wo geht Zeit zwischen Kundenauftrag und Versand verloren? | Kundenauftrag + Fertigungsauftrag | ERP-Vertrieb und Versand |

Veröffentlichte Produktionsfälle auf Herstellerseiten mischen Produktion mit Beschaffung und Stammdaten. Die Celonis-Story zum Automobilzulieferer Eissmann etwa behandelt Purchase-to-Pay, Stammdatenmanagement und Produktion über das MES und meldet "reduced throughput times by 30 percent" (um 30 % verkürzte Durchlaufzeiten) für einen Stammdatenprozess, ohne Zahl für die Produktion [7]. Solche Zahlen sind Herstelleraussagen über ein einzelnes Unternehmen.

## 7. Process Mining, Wertstromanalyse, Simulation und MES-Dashboards

| Methode | Beantwortet | Daten | Zeitperspektive | Grenzen |
|---|---|---|---|---|
| [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/) | Wie fließen Material und Information, wo ist Verschwendung? | Begehung, einige Messungen | Momentaufnahme, Mittelwerte | statisch, manuell, jeweils eine Produktfamilie |
| Process Mining | Was ist wirklich passiert, in welchen Varianten, mit welchen Zeiten? | Event Logs aus ERP, MES, LVS, QMS | historisch, alle Fälle | braucht saubere Ereignisse; kein "Was wäre, wenn" |
| [Simulation in der Produktion](https://www.m365.fm/learn/digital-twin/simulation-produktion/) | Was passiert, wenn wir etwas ändern? | Modell + Verteilungen | Zukunftsszenarien | braucht Validierung; Modellieraufwand |
| MES-Dashboards | Was passiert gerade? | MES, Maschinendaten | Echtzeit | zeigt Zustände, selten den durchgängigen Fluss |

Die Methoden ergänzen sich. Eine praktische Reihenfolge: den Wertstrom mit dem Team vor Ort aufnehmen, mit Process Mining prüfen, ob das Bild für alle Aufträge gilt (nicht nur für die beobachteten), und den Soll-Zustand mit Simulation testen, bevor man investiert. Teams, die bereits mit dynamischen Wertstrommodellen arbeiten, etwa in iFAKT Polaris, können die gewonnenen Zeiten in diese Modelle übernehmen; siehe unseren Pillar [iFAKT Polaris](https://www.m365.fm/learn/ifakt-polaris/). Jedes DES-Tool funktioniert genauso.

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

## 8. Tools und Standards

**Standards und Formate**

| Standard / Format | Was es ist | Einsatz |
|---|---|---|
| IEEE 1849-2023 (XES) | "IEEE Standard for eXtensible Event Stream (XES) for Achieving Interoperability in Event Logs and Event Streams", genehmigt am 5. Juni 2023, ersetzt IEEE 1849-2016 [3] | Austausch klassischer fallzentrierter Logs zwischen Tools |
| OCEL 2.0 | Spezifikation für objektzentrierte Event Logs mit den Formaten SQLite, XML und JSON [4] | Austausch objektzentrierter Logs |
| Process Mining Manifesto | Leitprinzipien, Herausforderungen und Reifegrade von Logs [2] | Projektmethode und Bewertung der Datenqualität |

**Tools.** Der Markt reicht von Enterprise-Plattformen bis zu Open-Source-Forschungswerkzeugen. Die Tabelle nennt Tools, die bei der Recherche zu diesem Artikel gefunden wurden, und gibt wieder, was ihre Quellen sagen; sie ist kein Ranking.

| Tool | Typ | Produktionsbezug laut Quelle |
|---|---|---|
| Celonis | kommerzielle Plattform | Branchenseite Fertigung mit Kundenzahlen; nennt ERP, CRM, MES und PLM als Quellsysteme [6] |
| QPR | kommerziell | Seite zur Fertigung zu Stillständen, Effizienz, Qualität und Compliance [8] |
| Appian | kommerziell | Blog zu Process Mining in der Fertigung mit einem Durchsatzbeispiel aus einer Fertigungslinie [9] |
| ProM | Open-Source-Forschungsframework | verlinkt im Formaspace-Artikel [10] |
| Microsoft Power Automate Process Mining | kommerziell, Teil der Power Platform | relevant für Unternehmen mit Microsoft 365 / Power Platform; Microsoft beschreibt es als die Process-Mining-Funktion in Power Automate, die Ereignisdaten aus führenden Systemen extrahiert [11]; Microsoft hat 2022 den Process-Mining-Anbieter Minit übernommen [12] |

Fragen an jeden Anbieter: Kann das Tool objektzentrierte Logs verarbeiten oder nur eine Fall-ID? Welche Konnektoren gibt es für Ihr ERP und MES, und wer pflegt die Extraktion? Wie werden Zeitstempelbedeutung und Zeitzonen behandelt? Lassen sich Ergebnisse als Verteilungen für die Simulation exportieren? Wo werden die Daten gehostet, und wie werden personenbezogene Daten geschützt?

## 9. Einführung in sieben Schritten

1. **Die Frage aufschreiben** (Durchlaufzeit, Nacharbeit, Konformität, Freigabeverhalten). Das Prinzip des Manifests "Log Extraction Should Be Driven by Questions" [2] schützt vor einem Data-Lake-Projekt ohne Zweck.
2. **Fallbegriff oder Objekte wählen.** Auftragszentriert für die Durchlaufzeit; maschinenzentriert für Reihenfolgen und Stillstandszeiten; objektzentriert, wenn Lose, Chargen oder Baugruppen eine Rolle spielen.
3. **Systeme und Schlüssel erfassen** (Abschnitt 3) und festlegen, welcher Zeitstempel als Ereigniszeit gilt.
4. **Extrahieren und verknüpfen:** ERP, MES und weitere Quellen; auf eine Zeitbasis umrechnen; Aktivitäten lesbar benennen. Aus Replikaten oder Exporten extrahieren, statt die produktive MES-Datenbank abzufragen, und Daten von der OT-Seite durch die Sicherheitszonen des Werks führen (siehe unseren Pillar zur [OT-Security](https://www.m365.fm/learn/ot-security-iec-62443/), geplant).
5. **Das Log mit Leuten vom Shopfloor bereinigen und testen:** unmögliche Reihenfolgen, doppelte Chargenereignisse, fehlende Enden, unplausible Dauern.
6. **Entdecken, Konformität prüfen, anreichern.** Mit Varianten und Directly-Follows-Zählungen beginnen, dann Wartezeiten und Ressourcensichten; Datenprobleme von Prozessproblemen trennen.
7. **Handeln und wiederholen.** Ein oder zwei Maßnahmen auswählen, den Effekt einige Wochen später mit demselben Log messen und die Extraktion weiterlaufen lassen ("Process Mining Should Be a Continuous Process" [2]).

Die Schritte 3 bis 5 kosten meist die meiste Zeit, passend zur ersten Herausforderung des Manifests: Ereignisdaten finden, zusammenführen und bereinigen [2].

## 10. Mitarbeitende, Datenschutz und Betriebsrat

MES- und ERP-Logs enthalten oft den Werker, der einen Arbeitsgang gestartet oder rückgemeldet hat. Process Mining auf solchen Daten kann sehr schnell zur individuellen Leistungsüberwachung werden. Das beschädigt das Vertrauen auf dem Shopfloor und kann rechtlich eingeschränkt sein.

- **Den Werker weglassen,** wenn die Frage ihn nicht braucht, wie im Beispiel. Die meisten Ablauffragen lassen sich je Auftrag, Maschine und Schicht beantworten.
- **Wenn Personendaten nötig sind** (zum Beispiel für Qualifikation und Personaleinsatz), pseudonymisieren und aggregieren und den Zweck schriftlich vereinbaren.
- **Die Belegschaft früh einbinden.** In gewerkschaftlich organisierten US-Werken die Gewerkschaft vor dem Rollout einbeziehen. In deutschen Werken hat der Betriebsrat Mitbestimmungsrechte bei Einführung und Anwendung technischer Einrichtungen, die dazu bestimmt sind, das Verhalten oder die Leistung der Beschäftigten zu überwachen (§ 87 Abs. 1 Nr. 6 Betriebsverfassungsgesetz, BetrVG) [13], und für personenbezogene Daten gilt in der EU die DSGVO.
- **Die Ergebnisse für den Prozess nutzen, nicht gegen Einzelne.** Taucht eine Nacharbeitsschleife auf, lautet die Frage, warum der Prozess sie zulässt, nicht, wer Schicht hatte.
- **Die Befunde zuerst den Werkern zeigen.** Sie kennen oft die Erklärung (wie den verspäteten Bereitstellungsscan im Beispiel) und werden zu Eigentümern der Lösung.

## 11. Typische Fehler

| Fehler | Wirkung | Besser |
|---|---|---|
| Ohne Frage starten | eine "Spaghetti"-Prozesslandkarte, aus der niemand etwas macht | eine Frage, ein Fallbegriff, ein Verantwortlicher |
| Los- und Chargendaten eine einzige Fall-ID aufzwingen | doppelte oder fehlende Ereignisse, falsche Zählungen | den Fall je Frage wählen oder objektzentriert arbeiten [4] |
| Buchungszeiten als physische Zeiten nehmen | Scheinabweichungen wie V3 im Beispiel | Zeitstempelbedeutung mit dem Shopfloor klären |
| Zeitzonen und Uhrenversatz vermischen | negative Dauern, falsche Reihenfolgen | zuerst auf eine Zeitbasis normalisieren |
| Nur Mittelwerte berichten | versteckt die lange Verteilungsspitze, die Kunden spüren | Perzentile und Zeiten je Variante |
| Hersteller-ROI-Zahlen als Benchmark nehmen | aufgeblähte Business Cases | die eigene Ausgangsbasis aus dem Log verwenden |
| Einzelne überwachen | Vertrauensverlust, rechtliches Risiko | aggregieren, pseudonymisieren, Zweck vereinbaren |
| Bei der Landkarte stehen bleiben | keine Verbesserung | Befunde mit Maßnahmen verknüpfen, nachmessen und Simulation für Kapazitätsentscheidungen nutzen |

## 12. FAQ

### Was ist Process Mining in der Produktion?

Die Analyse von Ereignisdaten aus ERP, MES und verwandten Systemen, um zu rekonstruieren, wie Aufträge, Lose und Teile tatsächlich durch die Produktion laufen, diesen Fluss mit dem geplanten Arbeitsplan zu vergleichen und Warten, Nacharbeit und Durchlaufzeiten zu messen [1][2].

### Wie wird Process Mining in der Fertigung eingesetzt?

Typisch sind Analysen von Durchlaufzeit und Warten, Engpassverhalten, Nacharbeitsschleifen, Konformität zum Arbeitsplan, Freigabeverhalten, Materialverfügbarkeit und Instandhaltungsabläufen (Abschnitt 6).

### Welche Daten braucht man für Process Mining?

Mindestens eine Fall-ID, einen Aktivitätsnamen und einen Zeitstempel je Ereignis [2]. In der Produktion braucht man zusätzlich Start- und Endzeiten, die Ressource (Maschine), Mengen und das Quellsystem, dazu den geplanten Arbeitsplan für das Conformance Checking.

### Kann Process Mining MES-Daten nutzen?

Ja. MES-Sätze zu Start und Ende von Arbeitsgängen sind oft die beste Quelle für Zeiten auf dem Shopfloor, weil sie nah an der Maschine erfasst werden. Sie mit ERP-Auftragsdaten für Freigabe und Wareneingang kombinieren und prüfen, wie Werker Arbeitsgänge rückmelden, bevor man den Zeiten vertraut.

### Was ist ein Event Log?

Eine "Sammlung von Ereignissen, die als Eingabe für Process Mining dient" [2]. Jedes Ereignis bezieht sich auf einen Fall (oder objektzentriert auf mehrere Objekte), eine Aktivität und einen Zeitstempel. Logs werden als XES (IEEE 1849-2023) [3] oder OCEL 2.0 [4] ausgetauscht.

### Was ist objektzentriertes Process Mining?

Ein Ansatz, bei dem sich jedes Ereignis auf mehrere Objekte unterschiedlicher Typen beziehen kann, etwa auf einen Fertigungsauftrag, ein Materiallos und eine Maschine, statt auf eine einzige Fall-ID. Er vermeidet die Verdopplung und den Verlust von Ereignissen, die entstehen, wenn Los- und Chargendaten flach geklopft werden. OCEL 2.0 definiert das Format [4].

### Was ist der Unterschied zwischen Process Mining und Wertstromanalyse?

Die Wertstromanalyse ist eine Teamübung vor Ort, die eine Momentaufnahme mit Mittelwerten liefert. Process Mining nutzt aufgezeichnete Daten aller Aufträge über einen Zeitraum. Das Mining kann prüfen, ob das Wertstromdiagramm stimmt, und das Diagramm gibt den Mining-Ergebnissen einen Lean-Rahmen (Abschnitt 7).

### Was ist der Unterschied zwischen Process Mining und Simulation?

Process Mining analysiert, was passiert ist; Simulation testet, was nach einer Änderung passieren würde. Gewonnene Event Logs sind eine gute Quelle für Eingangsverteilungen und Validierungsdaten eines Simulationsmodells [5].

### Was ist der Unterschied zwischen Process Mining und Data Mining?

Data Mining sucht allgemein nach Mustern in Daten; das Process Mining Manifesto stellt fest, dass "die meisten Data-Mining-Techniken überhaupt nicht prozesszentriert sind" [2]. Process Mining arbeitet mit Event Logs mit Fall, Aktivität und Zeitstempel je Ereignis und entdeckt, prüft oder erweitert ein Prozessmodell. Das Manifest nennt es "eine wichtige Brücke zwischen Data Mining und der Modellierung und Analyse von Geschäftsprozessen" [2].

### Was sind die Herausforderungen von Process Mining in der Produktion?

Ereignisdaten über Systeme hinweg finden, zusammenführen und bereinigen [2], den Fallbegriff wählen, mit Chargen und Losen umgehen, unklare Bedeutung von Zeitstempeln und der Schutz von Beschäftigtendaten.

### Welche Process-Mining-Tools werden in der Produktion eingesetzt?

Enterprise-Plattformen wie Celonis und QPR veröffentlichen Anwendungsfälle aus der Fertigung [6][8]; Open-Source-Tools wie ProM werden in der Forschung genutzt [10]. Auswählen nach Konnektoren zu ERP und MES, Unterstützung für objektzentrierte Logs und Datenhosting.

## 13. Fazit

Process Mining in der Produktion funktioniert, wenn man das Event Log als das eigentliche Produkt behandelt. Discovery- und Conformance-Verfahren sind etabliert, und es gibt standardisierte Formate (XES, OCEL 2.0). Über den Erfolg entscheidet die werksspezifische Arbeit: festlegen, was als Fall zählt, ERP-, MES-, Lager- und Qualitätsdaten über die richtigen Schlüssel verknüpfen und wissen, welche Zeitstempel physische Ereignisse beschreiben. Im Rechenbeispiel reichten sechs Aufträge und 40 Ereignisse, um einen Engpass zu zeigen, der nachts stillsteht, eine Freigaberegel, die den Shopfloor flutet, Nacharbeit, die 18 % der Engpasszeit frisst, und eine Buchungsverzögerung, die wie eine Prozessabweichung aussieht. Mit einer solchen Frage beginnen, die Extraktion weiterlaufen lassen und Kapazitätsentscheidungen mit den gewonnenen Daten als Eingabe an die Simulation übergeben.

## Weiterlesen auf m365.fm

**Parent-Pillar**

- [Digital Twin in der Produktion: der vollständige Leitfaden](https://www.m365.fm/learn/digital-twin/)

**Schwester-Cluster**

- [Simulation in der Produktion: So funktioniert ereignisdiskrete Simulation](https://www.m365.fm/learn/digital-twin/simulation-produktion/) (geplant)

**Verwandte Leitfäden** (Links werden nach Veröffentlichung aktiv)

- [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant)
- [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)
- [Theory of Constraints und Engpasssteuerung](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant)
- [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/)
- [iFAKT Polaris](https://www.m365.fm/learn/ifakt-polaris/)

**Entity-Seiten**

- [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/)

---

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über die Digitalisierung der Produktion mit Microsoft 365 und Azure, Wertstrommethoden, Produktionsplanung, Prozessdaten und digitale Zwillinge.

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

*[Redaktion: Rolle, Werdegang und Profilfoto vom Autor ergänzen lassen.]*

---

# Quellen

Alle Online-Quellen abgerufen am 20. November 2026 und, sofern nicht anders vermerkt, für diesen Artikel geöffnet.

1. van der Aalst, W. (2016): Process Mining: Data Science in Action. 2nd ed., Springer, Berlin/Heidelberg. https://link.springer.com/978-3-662-49850-7
2. van der Aalst, W.; Adriansyah, A.; Alves de Medeiros, A. K.; et al. (2012): Process Mining Manifesto. In: Daniel, F.; Barkaoui, K.; Dustdar, S. (Hrsg.): Business Process Management Workshops (BPM 2011). Lecture Notes in Business Information Processing 99, Springer, S. 169–194. DOI: [10.1007/978-3-642-28108-2_19](https://doi.org/10.1007/978-3-642-28108-2_19). Genutzter Volltext: https://art.torvergata.it/bitstream/2108/39458/2/chp_10.1007_978-3-642-28108-2_19%281%29.pdf
3. IEEE 1849-2023: IEEE Standard for eXtensible Event Stream (XES) for Achieving Interoperability in Event Logs and Event Streams (genehmigt am 5. Juni 2023; veröffentlicht am 8. September 2023; ersetzt IEEE 1849-2016). https://standards.ieee.org/ieee/1849/10907
4. Berti, A.; Koren, I.; Adams, J. N.; Park, G.; Knopp, B.; Graves, N.; Rafiei, M.; Liß, L.; Tacke Genannt Unterberg, L.; Zhang, Y.; Schwanen, C.; Pegoraro, M.; van der Aalst, W. M. P. (2023/2024): OCEL (Object-Centric Event Log) 2.0 Specification. Fassung vom 16. Oktober 2023; arXiv:2403.01975. https://arxiv.org/pdf/2403.01975
5. Lee, Y.; Shin, J.; Lee, W. (2025): Manufacturing process analysis framework for process mining: case study of fully automated factory applications. International Journal of Advanced Manufacturing Technology 136, S. 5641–5664. DOI: [10.1007/s00170-025-15029-5](https://doi.org/10.1007/s00170-025-15029-5)
6. Celonis: Manufacturing solutions (Branchenseite; Herstellerangaben). https://www.celonis.com/solutions/industries/manufacturing
7. Celonis: Eissmann success story (Fallstudie, gesammelt von der IEEE Task Force on Process Mining; Herstellerangaben). https://www.win.tue.nl/ieeetfpm/casestudies/celonis_eissmann_-_success_story.pdf
8. QPR Software: Process mining in manufacturing (Branchenseite; Herstellerangaben). https://www.qpr.com/industries/manufacturing
9. Appian: Process mining in manufacturing (Blog, 2021). https://appian.com/blog/2021/process-mining-in-manufacturing
10. Formaspace: How process mining helps manufacturing and assembly (Artikel; verlinkt auf ProM, XES und die IEEE Task Force). https://formaspace.com/articles/industrial/process-mining-helps-manufacturing-assembly/
11. Overview of process mining in Power Automate. Microsoft Learn. https://learn.microsoft.com/en-us/power-automate/process-mining-overview (abgerufen am 20. November 2026)
12. Mackie, K.: Microsoft Buys Process Mining Company Minit. Redmond Magazine, 31. März 2022. https://redmondmag.com/Articles/2022/03/31/Microsoft-Buys-Process-Mining-Company-Minit.aspx (abgerufen am 20. November 2026)
13. § 87 Betriebsverfassungsgesetz, Absatz 1 Nr. 6. Gesetze im Internet, Bundesministerium der Justiz. https://www.gesetze-im-internet.de/betrvg/__87.html (abgerufen am 20. November 2026)

---

# Prüfhinweise für die Redaktion

## URL, Canonical und hreflang

- Cluster-URL verschachtelt unter dem Parent-Pillar: `/learn/digital-twin/process-mining-produktion/`. Mit der Seitenstruktur abgleichen.
- hreflang-Paar `de-DE` (diese Seite) <-> `en-US` (https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/), jeweils selbstreferenzierendes Canonical. In der englischen Fassung das hreflang-Paar nachtragen.

## Rechenbeispiel

- Das Event Log (sechs Aufträge, 40 Ereignisse, 2. bis 3. November 2026) ist **zur Veranschaulichung erfunden** und so gekennzeichnet. Kennzahlen per Skript berechnet: Durchlaufzeiten 29,33/33,50/30,00/29,67/33,67/31,08 h (Mittel 31,2 h); Anteil erfasster Aktivitäten 12,5 %; V1 = 3, V2 = 2, V3 = 1; MC-07 belegt 15,67 h, Nacharbeit 2,83 h (18,1 %); Wartezeiten Bereitstellung → Fräsen 3,17/5,33/18,92/20,92/22,83 h. Empfehlung: Log als CSV (und als OCEL-2.0-JSON) zum Download anbieten.
- Los L-2207 und Prüflos IL-9031 in Abschnitt 5 sind für die objektzentrierte Darstellung ergänzt.
- Die Zitate aus dem Process Mining Manifesto [2] sind in Abschnitt 1, 2 und in der FAQ ins Deutsche übersetzt; Prinzipien und die erste Herausforderung stehen zusätzlich im englischen Original.

## Herstellerangaben und [unbelegt]-Stellen

- Celonis-Zahlen [6] und die Eissmann-Angabe "30 percent" [7] sind Herstelleraussagen; nur die Eissmann-Zahl steht im Text, gekennzeichnet. QPR-Zahlen [8] werden nicht zitiert.
- Gartner: Ein Gartner-Marktüberblick wurde in der englischen Fassung nicht verifiziert und wird nicht zitiert. Weitere Tools (SAP Signavio, UiPath, ARIS, PM4Py, Disco, Apromore) nicht geprüft und daher nicht gelistet.
- Faustregel in Abschnitt 3 ist als Heuristik gekennzeichnet. Keine offenen [unbelegt]-Stellen im Artikeltext.

## iFAKT und Offenlegung

- Eine kurze iFAKT-Erwähnung in Abschnitt 7 als eine Option neben "jedem DES-Tool"; Offenlegung "**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**" nach der Passage und in der Autorenbox; kein Sponsoring-Hinweis; keine Standorte genannt.

## Interne Links

- Parent-Pillar in den ersten 150 Wörtern und unter "Weiterlesen". Schwester-Cluster (simulation-produktion) in Einleitung, "Das Wichtigste in Kürze", Abschnitt 4.5, 7 und "Weiterlesen". Pillars im Text: digital-twin, mes-isa-95, theory-of-constraints-engpass, wertstromanalyse, ifakt-polaris, ot-security-iec-62443. "(geplant)" nur bei noch nicht veröffentlichten deutschen Zielen; bei Veröffentlichung entfernen.

## Empfohlene Grafiken

1. Diagramm: ein Fertigungsauftrag, ein Los, eine Maschine und ihre Ereignisse (auftragszentrierte vs. objektzentrierte Sicht).
2. Prozesslandkarte des Beispiels mit den drei Varianten und Directly-Follows-Zählungen.
3. Gantt-Diagramm von MC-07 über zwei Tage mit nächtlichem Stillstand und Nacharbeitsblöcken.
4. Tabellengrafik: System → Ereignis → Schlüssel → Zeitstempelbedeutung (Abschnitt 3).

## JSON-LD-Vorschlag

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Process Mining in der Produktion: So werden Event Logs aus MES und ERP zu Erkenntnissen über den Materialfluss",
      "inLanguage": "de-DE",
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-26",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "mainEntityOfPage": "https://www.m365.fm/learn/digital-twin/process-mining-produktion/",
      "isPartOf": {"@type": "WebPage", "url": "https://www.m365.fm/learn/digital-twin/"},
      "about": ["Process Mining", "Produktion", "Event Log", "objektzentriertes Process Mining"]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "de-DE",
      "mainEntity": "[alle 11 FAQ-Fragen aus Abschnitt 12 mit Antworten einfügen]"
    }
  ]
}
```

## Für den deutschen Markt prüfen

- Abschnitt 10: § 87 Abs. 1 Nr. 6 BetrVG und DSGVO stehen bereits im Original [13]. Fachprüfung, ob eine Betriebsvereinbarung als typisches Instrument genannt werden soll (nicht ohne Beleg einfügen).
- Tool-Tabelle: Für den deutschen Markt prüfen, ob SAP Signavio und ARIS (beide in Deutschland verbreitet) nach Verifikation ergänzt werden sollen.
- Kannibalisierung: Der Parent-Pillar behandelt Process Mining nicht; er sollte aus dem Abschnitt zur Datengrundlage hierher verlinken.

## Fachliche Prüfung

Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.
