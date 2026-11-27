# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Six Sigma & Ursachenanalyse: DMAIC mit Rechenbeispielen (55 Zeichen) |
| Meta-Description | Six Sigma und Ursachenanalyse in der Produktion: DMAIC Phase für Phase, DPMO und Cpk durchgerechnet, 5 Why, Ishikawa, Fehlerbaum, 8D. Mit Quellen. (148 Zeichen) |
| Slug | `/learn/six-sigma-ursachenanalyse/` (vollständige URL: https://www.m365.fm/learn/six-sigma-ursachenanalyse/) |
| Hauptkeyword | Six Sigma, DMAIC, Ursachenanalyse |
| Nebenkeywords | DMAIC-Zyklus, DMAIC-Phasen, Ursachenanalyse Produktion, Root Cause Analysis, Werkzeuge der Ursachenanalyse, Six-Sigma-Methode, Lean Six Sigma, Sigma-Niveau berechnen, DPMO, Fehler pro Million Möglichkeiten, 3,4 Fehler pro Million, 1,5-Sigma-Shift, Prozessfähigkeit, Cp und Cpk berechnen, Cpk-Wert, statistische Prozesslenkung (SPC), Qualitätsregelkarte, Regelkarte x-quer/R, Western-Electric-Regeln, Messsystemanalyse (MSA), Messmittelfähigkeit, Gage R&R, 5-Why-Methode, Ishikawa-Diagramm, Fischgrätendiagramm, Fehlerbaumanalyse, 8D-Report, Pareto-Diagramm, FMEA, SIPOC, DMADV, Design for Six Sigma, Six Sigma Belts, Green Belt, Black Belt, Six-Sigma-Zertifizierung, CAPA, Korrekturmaßnahmen |
| Suchintention | Informational (was Six Sigma ist, wie DMAIC funktioniert, wie man Sigma-Niveau und Cpk berechnet, welches Werkzeug der Ursachenanalyse passt) mit praktischer Nebenintention (Vorlagen, Zertifizierungsweg, Programmstart). Zielgruppe: Qualitätsingenieure, KVP- und Operational-Excellence-Verantwortliche, Werks- und Produktionsleitung, Green- und Black-Belt-Kandidaten, Studierende, IT/OT-Verantwortliche, die die Daten liefern |
| Wortzahl | **15.829 Wörter** von H1 bis Fazit inkl. Tabellen, Glossar und FAQ (`wc -w`, 26.11.2026); englische Fassung 16.433 Wörter nach derselben Zählung (96 %) |
| Sprachversion | Deutsch (`de-DE`). hreflang-Paar: `de-DE` https://www.m365.fm/learn/six-sigma-ursachenanalyse/ <-> `en-US` https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA, November 2026). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus; Hauptkeyword, Nebenkeywords und Überschriften sind danach zu prüfen.

# Six Sigma und Ursachenanalyse (Root Cause Analysis): DMAIC, Werkzeuge und Berechnungen für die Produktion

*Stand: November 2026 · Lesezeit: etwa 50 Minuten (Schnelleinstieg: Kurzantwort, Kasten "Das Wichtigste in Kürze", die DMAIC-Vorlagen und das Glossar)*

> **Kurzantwort:** Six Sigma ist eine datengestützte Methode, um Streuung und Fehler in einem Prozess zu verringern. Die ASQ beschreibt sie als Methode, die Unternehmen Werkzeuge an die Hand gibt, um die Fähigkeit ihrer Geschäftsprozesse zu verbessern, und definiert Six-Sigma-Qualität als 3,4 Fehler pro Million Möglichkeiten, unter Annahme einer Verschiebung des Mittelwerts um 1,5 Sigma [1]. Projekte folgen dem DMAIC-Zyklus (Define, Measure, Analyze, Improve, Control). Die Analyze-Phase ist eine Ursachenanalyse: Mit Werkzeugen wie 5 Why, Ishikawa-Diagramm, Pareto-Diagramm, Fehlerbaum und statistischen Tests wird belegt, warum ein Problem auftritt, bevor jemand es abstellt.

> **Das Wichtigste in Kürze**
> - Six Sigma entstand Mitte der 1980er-Jahre bei Motorola. Motorola erhielt 1988 den Malcolm Baldrige National Quality Award; das Preisträgerprofil nennt als Ziel höchstens 3,4 Fehler pro Million [2][3].
> - GE machte daraus ab 1995 ein konzernweites Programm und meldete für 1998 Einsparungen von mehr als drei Vierteln einer Milliarde Dollar über die Investition hinaus [4].
> - "3,4 Fehler pro Million" sind nicht sechs Standardabweichungen einer Normalverteilung. Ein zentrierter Six-Sigma-Prozess würde etwa 0,002 Fehler pro Million erzeugen; die Zahl 3,4 setzt voraus, dass der Mittelwert mit der Zeit um 1,5 Sigma wandert. Diese Konvention kritisieren Statistiker wie Donald Wheeler [5].
> - DMAIC verbessert einen bestehenden Prozess. Für neue Produkte oder Prozesse gilt Design for Six Sigma (zum Beispiel DMADV).
> - Die Ursachenanalyse ist der Kern der Analyze-Phase. Eine Grundursache (Root Cause) ist ein Faktor, der eine Abweichung verursacht hat und dauerhaft beseitigt werden sollte [6]. "Bedienfehler" ist fast nie eine Grundursache.
> - Prozessfähigkeit setzt Stabilität voraus. Cp und Cpk sind nur für einen beherrschten Prozess mit etwa 50 oder mehr unabhängigen Werten aussagekräftig [7].
> - Die Belts sind nicht standardisiert. Die ASQ verlangt Berufserfahrung und für den Black Belt unterschriebene Projektnachweise; die IASSC prüft Wissen ohne Projektpflicht [8][9].
> - Die meisten Programme, die scheitern, scheitern aus organisatorischen Gründen (Projektauswahl, Rückhalt durch die Führung, Control-Phase), nicht an falscher Statistik [5].

## Inhaltsverzeichnis

1. [Was ist Six Sigma? Definition einfach erklärt](#was-ist-six-sigma-definition-einfach-erklärt)
2. [Kurze Geschichte: Motorola, GE und ISO 13053](#kurze-geschichte-motorola-ge-und-iso-13053)
3. [Sigma-Niveau und DPMO berechnen: die Mathematik Schritt für Schritt](#sigma-niveau-und-dpmo-berechnen-die-mathematik-schritt-für-schritt)
4. [Die Debatte um den 1,5-Sigma-Shift](#die-debatte-um-den-15-sigma-shift)
5. [Lean, Six Sigma und Lean Six Sigma: Was ist der Unterschied?](#lean-six-sigma-und-lean-six-sigma-was-ist-der-unterschied)
6. [Der DMAIC-Zyklus Phase für Phase](#der-dmaic-zyklus-phase-für-phase)
7. [Statistische Prozesslenkung (SPC) und Regelkarten](#statistische-prozesslenkung-spc-und-regelkarten)
8. [Prozessfähigkeit: Cp, Cpk, Pp und Ppk mit Beispielen](#prozessfähigkeit-cp-cpk-pp-und-ppk-mit-beispielen)
9. [Ursachenanalyse in der Produktion](#ursachenanalyse-in-der-produktion)
10. [Werkzeuge der Ursachenanalyse: 5 Why, Ishikawa, Pareto, Fehlerbaum, 8D und mehr](#werkzeuge-der-ursachenanalyse-5-why-ishikawa-pareto-fehlerbaum-8d-und-mehr)
11. [DMAIC, 8D, A3 oder PDCA: Was wann einsetzen?](#dmaic-8d-a3-oder-pdca-was-wann-einsetzen)
12. [DMADV und Design for Six Sigma](#dmadv-und-design-for-six-sigma)
13. [Six Sigma Belts, Rollen und Zertifizierung (US-Kontext)](#six-sigma-belts-rollen-und-zertifizierung-us-kontext)
14. [Vorlagen: Projektauftrag, Datenerhebungsplan, Ursachenanalyse und Lenkungsplan](#vorlagen-projektauftrag-datenerhebungsplan-ursachenanalyse-und-lenkungsplan)
15. [Six Sigma einführen: ein 12-Monats-Fahrplan](#six-sigma-einführen-ein-12-monats-fahrplan)
16. [Kennzahlen für ein Six-Sigma- und Ursachenanalyse-Programm](#kennzahlen-für-ein-six-sigma--und-ursachenanalyse-programm)
17. [Häufige Fehler](#häufige-fehler)
18. [Kritik und Grenzen von Six Sigma](#kritik-und-grenzen-von-six-sigma)
19. [Six Sigma, Daten und KI: die digitale Seite](#six-sigma-daten-und-ki-die-digitale-seite)
20. [Glossar](#glossar)
21. [Häufige Fragen (FAQ)](#häufige-fragen-faq)
22. [Fazit und erste Schritte](#fazit-und-erste-schritte)

## Was ist Six Sigma? Definition einfach erklärt

Jeder Prozess streut. Zwei Wellen, die in derselben Stunde auf derselben Drehmaschine gefertigt werden, haben nie exakt denselben Durchmesser. Zwei Rechnungen brauchen nie exakt dieselbe Bearbeitungszeit. Solange die Streuung innerhalb dessen bleibt, was der Kunde akzeptiert, fällt sie niemandem auf. Ist die Streuung zu breit oder driftet der Prozess, entstehen Fehler: Teile außerhalb der Toleranz, Undichtigkeiten, verspätete Lieferungen, Gewährleistungsfälle.

Six Sigma ist eine Methode, um diese Streuung mit Daten zu finden und zu verringern. Sie hat drei Ebenen:

1. **Eine Kennzahl.** Das Sigma-Niveau drückt aus, wie viele Fehler ein Prozess pro Million Möglichkeiten erzeugt. Höher ist besser; "Six Sigma" steht nach den unten erklärten Konventionen für 3,4 Fehler pro Million Möglichkeiten [1].
2. **Eine Methode.** DMAIC (Define, Measure, Analyze, Improve, Control) ist der Projektfahrplan zur Verbesserung eines bestehenden Prozesses. Die ASQ beschreibt DMAIC als die Schritte, denen ein Six-Sigma-Praktiker folgen soll [1]. ISO 13053-1 beschreibt dieselben fünf Phasen als internationale Norm [10].
3. **Eine Organisation.** Ausgebildete Fachleute (Green Belts, Black Belts, Master Black Belts) leiten Projekte, die Führungskräfte (Champions) auswählen und tragen.

Der griechische Buchstabe Sigma (σ) ist das Symbol für die Standardabweichung, das übliche Maß für Streuung. Der Name bezieht sich darauf, wie viele Standardabweichungen zwischen den Prozessmittelwert und die nächstgelegene Toleranzgrenze passen. Je mehr Sigmas hineinpassen, desto kleiner ist der Anteil der Produktion, der außerhalb der Grenzen liegt.

### Wofür Six Sigma taugt und wofür nicht

Six Sigma ist am stärksten, wo ein Problem chronisch und messbar ist und die Ursachen unklar sind: eine Ausschussquote, die seit Jahren bei 3 % festhängt, ein Maß, das driftet, eine Beschichtung, die sporadisch versagt. Schwach ist die Methode, wo die Ursache beim Gang durch den Prozess offensichtlich ist (Werkzeug suchen, auf Material warten), wo sich keine Daten erheben lassen oder wo etwas Neues erfunden werden soll. Für Flussprobleme sind die Werkzeuge aus dem [Leitfaden Lean Management](https://www.m365.fm/learn/lean-management/) meist schneller.

### Nutzen, vorsichtig formuliert

Wettbewerberseiten versprechen "bis zu 50 % Kosteneinsparung" ohne Quelle. Die belegte Lage ist enger:

- **Motorola** setzte sich das Ziel von höchstens 3,4 Fehlern pro Million Produkte, "Kundendienstleistungen eingeschlossen", und gewann mit diesem Programm 1988 den Baldrige Award [2].
- **GE** meldete für 1998 Einsparungen von mehr als drei Vierteln einer Milliarde Dollar über die Investition hinaus, mit 5.000 Master Black Belts und Black Belts in Vollzeit, nachdem mehr als eine Milliarde Dollar investiert worden war [4]. Das sind vom Unternehmen gemeldete Zahlen aus einem Geschäftsbericht, keine geprüften Projektergebnisse.
- **Unabhängige Belege** zu Ergebnissen auf Unternehmensebene sind gemischt (siehe "Kritik und Grenzen"). Ob ein bestimmtes Werk profitiert, hängt mehr von der Projektauswahl und der konsequenten Umsetzung ab als von der Methode selbst.

Die ehrliche Zusammenfassung: Six Sigma senkt zuverlässig die Fehler in den Prozessen, in denen Projekte durchgeführt und abgesichert werden. Unternehmensweite Einsparzahlen sind Selbstauskünfte und sollten auch so gelesen werden.

## Kurze Geschichte: Motorola, GE und ISO 13053

| Jahr | Ereignis | Quelle |
|---|---|---|
| 1920er | Walter A. Shewhart entwickelt Regelkarten und die Idee, dass Streuung zufällige und zuordenbare Ursachen hat; Drei-Sigma-Grenzen werden zum Standard | [11][12] |
| Ende der 1970er bis Mitte der 1980er | Führungskräfte bei Motorola, darunter CEO Bob Galvin, drängen auf höhere Qualitätsziele; Ingenieure beginnen, Fehler pro Million Möglichkeiten zu messen | [3][11] |
| Mitte der 1980er | Six Sigma nimmt bei Motorola Gestalt an; das Konzept wird meist dem Ingenieur Bill Smith zugeschrieben. Die Darstellungen schwanken zwischen 1986 und 1987 | [3] |
| 1988 | Motorola erhält den Malcolm Baldrige National Quality Award; das Preisträgerprofil nennt Six Sigma und das Ziel von 3,4 pro Million | [2] |
| 1991 / 1993 | Motorola lässt "Six Sigma" in den USA als Dienstleistungsmarke (1991) und als Marke (1993) eintragen | [5] |
| 1990er | AlliedSignal unter Larry Bossidy und GE unter Jack Welch übernehmen Six Sigma | [11] |
| 1995 | GE startet sein Six-Sigma-Programm; 1998 meldet GE 5.000 Master Black Belts und Black Belts in Vollzeit | [4] |
| 2011 | ISO veröffentlicht ISO 13053-1, *Quantitative methods in process improvement: Six Sigma, Part 1: DMAIC methodology*; zuletzt 2022 überprüft und bestätigt | [10] |

Drei Punkte aus dieser Geschichte sind für die Praxis wichtig.

Erstens baut Six Sigma auf älterer statistischer Qualitätskontrolle auf. Shewharts Regelkarten, Demings Arbeiten zur Streuung und Jurans Verbesserung Projekt für Projekt gab es schon Jahrzehnte vor Motorola. Motorola fügte eine einheitliche Fehlerkennzahl für sehr unterschiedliche Prozesse hinzu, ein ehrgeiziges Ziel und eine Ausbildungsstruktur.

Zweitens wurde das Programm durch GE berühmt, nicht durch Motorola. Im GE-Geschäftsbericht 1998 heißt es, Six Sigma sei "1995 aufgekommen" und das Unternehmen habe sich "mit einer alles verschlingenden Wucht" hineingestürzt [4]. Derselbe Bericht nennt Design for Six Sigma für neue Produkte, das Gegenstück zu DMAIC auf der Entwicklungsseite (siehe Abschnitt zu DMADV).

Drittens gibt es eine internationale Norm. ISO 13053-1:2011 beschreibt die DMAIC-Phasen, empfohlene Vorgehensweisen in jeder Phase, die Steuerung von Projekten sowie Rollen, Fachwissen und Ausbildung der Beteiligten, für Fertigungs-, Dienstleistungs- und transaktionale Prozesse [10]. Wenige US-Werke nutzen sie, aber sie hilft, wenn ein Kunde oder Auditor fragt, was "ein Six-Sigma-Projekt" formal bedeutet.

Zu den Jahreszahlen: Der [Leitfaden Lean Management](https://www.m365.fm/learn/lean-management/) und dieser Artikel sagen beide "Mitte der 1980er", weil die Quellen uneins sind, ob das Programm 1986 oder 1987 begann [3]. Der Baldrige Award 1988 ist das erste feste öffentliche Datum [2].

## Sigma-Niveau und DPMO berechnen: die Mathematik Schritt für Schritt

Keine der bestplatzierten Seiten zeigt diese Rechnung im Text, deshalb hier Schritt für Schritt.

### Einheiten, Fehler und Fehlermöglichkeiten

| Begriff | Bedeutung | Beispiel (Ventilgehäuse) |
|---|---|---|
| Einheit (Unit) | das gefertigte oder bearbeitete Stück | ein Hydraulik-Ventilgehäuse |
| Fehler (Defect) | jede Nichterfüllung einer Kundenanforderung | eine Undichtigkeit bei der Prüfung, eine Bohrung außerhalb der Toleranz |
| Fehlermöglichkeit (Opportunity) | eine eigenständige, gemessene Gelegenheit für einen Fehler | 8 qualitätskritische Merkmale (CTQ), die je Gehäuse geprüft werden |
| DPU | Fehler pro Einheit = Fehler ÷ Einheiten | |
| DPO | Fehler pro Möglichkeit = Fehler ÷ (Einheiten × Möglichkeiten) | |
| DPMO | DPO × 1.000.000 | |

### Rechenbeispiel 1: von der Fehlerzahl zum Sigma-Niveau

Eine Zelle bearbeitet in einem Monat 5.000 Ventilgehäuse. Jedes Gehäuse hat 8 geprüfte Merkmale (Möglichkeiten). Die Prüfung erfasst 46 Fehler.

- DPU = 46 ÷ 5.000 = 0,0092
- DPO = 46 ÷ (5.000 × 8) = 46 ÷ 40.000 = 0,00115
- DPMO = 0,00115 × 1.000.000 = **1.150**

Um DPMO in ein Sigma-Niveau umzurechnen, wird der z-Wert der Standardnormalverteilung gesucht, dessen oberer Rand der DPO entspricht; dann wird konventionsgemäß 1,5 addiert:

- Ausbeute je Möglichkeit = 1 − 0,00115 = 0,99885
- z für 0,99885 = 3,05 (aus einer Normalverteilungstabelle oder mit `=NORM.S.INV(0,99885)` in Excel)
- Sigma-Niveau (kurzfristig, mit Shift) = 3,05 + 1,5 = **4,55**

Die Formel hinter jeder Sigma-Tabelle lautet DPMO = 1.000.000 × (1 − Φ(Sigma-Niveau − 1,5)), wobei Φ die Verteilungsfunktion der Standardnormalverteilung ist [5]. In Excel: `=NORM.S.INV(1-DPMO/1000000)+1,5`.

**Vorsicht bei den Möglichkeiten.** Die Zahl der Fehlermöglichkeiten ist eine Festlegung, und sie bestimmt das Ergebnis. Werden dieselben 46 Fehler auf 20 "Möglichkeiten" je Einheit bezogen, sinkt der DPMO auf 460 und das Sigma-Niveau steigt auf etwa 4,8, ohne dass sich irgendetwas verbessert hat. Möglichkeiten einmal je Produktfamilie festlegen, nur Merkmale zählen, die tatsächlich geprüft werden, und die Definition festschreiben. Für Vergleiche zwischen Prozessen lassen sich DPU und Erstdurchlaufquote (First Pass Yield) schwerer schönrechnen.

### Die Sigma-Umrechnungstabelle (berechnet)

Werte berechnet mit der obigen Formel (Langzeit-DPMO mit 1,5-Sigma-Shift) und zum Vergleich für einen perfekt zentrierten Prozess, bei dem beide Ränder gezählt werden:

| Sigma-Niveau | DPMO (mit 1,5σ-Shift) | Ausbeute (mit Shift) | Fehler pro Million bei zentriertem Prozess, ohne Shift |
|---|---|---|---|
| 1 | 691.462 | 30,9 % | 317.311 |
| 2 | 308.538 | 69,1 % | 45.500 |
| 3 | 66.807 | 93,3 % | 2.700 |
| 4 | 6.210 | 99,38 % | 63 |
| 4,5 | 1.350 | 99,865 % | 6,8 |
| 5 | 233 | 99,977 % | 0,57 |
| 6 | 3,4 | 99,99966 % | 0,002 |

Die letzte Spalte zeigt, warum der Shift wichtig ist: Ohne ihn würde ein Six-Sigma-Prozess etwa zwei Fehler pro Milliarde erzeugen, nicht 3,4 pro Million.

### Rechenbeispiel 2: Durchlaufausbeute (Rolled Throughput Yield)

Ein Teil durchläuft vier Prozessschritte. Die Erstdurchlaufquoten liegen bei 98 %, 95 %, 99 % und 97 %. Die Durchlaufausbeute (Rolled Throughput Yield, RTY), also die Wahrscheinlichkeit, dass eine Einheit alle Schritte ohne jede Nacharbeit durchläuft, ist das Produkt:

RTY = 0,98 × 0,95 × 0,99 × 0,97 = **0,894**, also 89,4 %

Jeder Schritt wirkt für sich genommen akzeptabel; zusammen braucht mehr als jede zehnte Einheit irgendwo Nacharbeit oder wird Ausschuss. Für eine Werksleitung ist die RTY oft nützlicher als ein Sigma-Niveau, weil sie die "versteckte Fabrik" der Nacharbeitsschleifen sichtbar macht. Definitionen der Erstdurchlaufquote und verwandter Kennzahlen stehen im [Leitfaden Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/).

### Rechenbeispiel 3: Was ein Sigma-Niveau wert ist

Das durchgehende Beispiel dieses Artikels: Ein Werk liefert 48.000 Ventilgehäuse pro Jahr aus. 2,8 % fallen bei der abschließenden Dichtheitsprüfung durch. Jeder Ausfall kostet 85 USD für Nacharbeit, Wiederholprüfung und Ausschuss (Beispielwert).

- Ausfälle pro Jahr: 48.000 × 0,028 = 1.344
- Kosten: 1.344 × 85 USD = 114.240 USD pro Jahr
- Sigma-Niveau: DPO = 0,028 je Einheit (eine Möglichkeit: dicht oder undicht) -> z = 1,91 -> **3,41 Sigma**

Senkt ein DMAIC-Projekt die Ausfallquote auf 0,6 %:

- Ausfälle: 48.000 × 0,006 = 288; Kosten: 24.480 USD
- Jährliche Einsparung: 89.760 USD (vor Projektkosten)
- Sigma-Niveau: z für 0,994 = 2,51 -> **4,01 Sigma**

Der Schritt von etwa 3,4 auf etwa 4,0 Sigma ist ein realistisches Ergebnis für ein einzelnes Projekt. Der Schritt von 4,5 auf 6 Sigma erfordert meist eine Neukonstruktion, kein Projekt.

## Die Debatte um den 1,5-Sigma-Shift

Die Definition der ASQ enthält die Formulierung "unter Berücksichtigung einer Verschiebung des Mittelwerts um 1,5 Sigma" [1]. Das ist der am häufigsten missverstandene Teil von Six Sigma.

### Was der Shift behauptet

Die Annahme lautet: Ein Prozess, der über einen kurzen Zeitraum gemessen wird, schneidet besser ab als über Monate, weil der Mittelwert zwischen Chargen, Schichten, Werkzeugwechseln und Materiallosen wandert. Die Six-Sigma-Konvention bildet diese Langzeitdrift als Verschiebung des Mittelwerts um 1,5 Standardabweichungen ab. Ein Prozess mit kurzfristig sechs Sigma zwischen Mittelwert und Grenze wird deshalb so behandelt, als hätte er langfristig 4,5 Sigma, und der einseitige Rand jenseits von 4,5 Sigma beträgt 3,4 pro Million [5].

Nach den auf Wikipedia zusammengefassten Quellen leitete Mikel Harry die Zahl aus einer Analyse der Toleranzkette in einem Stapel von Scheiben ab, die er "Benderizing" nannte; Motorola übernahm sie als Konvention [5].

### Warum Statistiker widersprechen

- **Es ist eine Konvention, kein Naturgesetz.** Reale Prozesse driften um weniger oder um viel mehr als 1,5 Sigma. Donald J. Wheeler nannte den Shift wegen seiner Willkür "goofy" (albern) [5].
- **Er vermischt zwei Fragen.** Ob ein Prozess stabil ist (Regelkarte) und ob er fähig ist (Fähigkeitsindex), sind getrennte Fragen. Ein Prozess, der tatsächlich um 1,5 Sigma wandert, ist nicht statistisch beherrscht, und eine Regelkarte sollte diese Verschiebung erkennen und korrigieren lassen, lange bevor sie Fehler erzeugt.
- **Er verzerrt das Berichtswesen.** Berechnet ein Werk ein Sigma-Niveau aus Langzeitdaten (die die Drift bereits enthalten) und addiert dann 1,5, wird der Shift doppelt gezählt und die Leistung zu gut dargestellt.

### Eine praktische Regel

Berichten, was gemessen wurde und wie:

| Situation | Was berichtet wird |
|---|---|
| Langzeit-Fehlerdaten (Produktion über Monate) | DPMO und Ausbeute; wenn ein Sigma-Niveau verlangt ist, angeben: "Sigma-Niveau inkl. 1,5-Shift (Konvention)" |
| Kurzzeit-Fähigkeitsstudie (eine Charge, eine Schicht) | Cp und Cpk, dazu der Datenzeitraum |
| Vergleich mit Kunden oder Lieferanten | DPMO oder ppm plus die Definition von Fehler und Fehlermöglichkeit |
| Interner Trend über die Zeit | dieselbe Kennzahl, dieselbe Definition, jeden Monat |

Kundenbewertungen (Scorecards) zählen zurückgewiesene Teile meist in ppm, und ppm hat gegenüber einem Sigma-Niveau einen Vorteil: Keine Konvention kann den Wert aufblähen.

## Lean, Six Sigma und Lean Six Sigma: Was ist der Unterschied?

Lean und Six Sigma werden oft als ein Paket verkauft, und in vielen US-Werken teilen sie sich inzwischen eine KVP-Abteilung. Sie beantworten trotzdem unterschiedliche Fragen. Lean konzentriert sich auf Kundennutzen und Fluss und beseitigt Verschwendung wie Warten, Suchen und Nacharbeitsschleifen; Six Sigma konzentriert sich darauf, Streuung und Fehlerquoten mit statistischer Analyse zu senken. Der [Leitfaden Lean Management](https://www.m365.fm/learn/lean-management/) vergleicht beide in einer Tabelle; die Kurzfassung aus Sicht von Six Sigma:

| Frage | Lean antwortet mit | Six Sigma antwortet mit |
|---|---|---|
| Warum dauert der Auftrag 12 Tage, wenn der Arbeitsinhalt 3 Stunden beträgt? | Wertstromanalyse, Fluss, Pull, WIP-Begrenzung | (selten das richtige Werkzeug) |
| Warum sind 2,8 % der Teile undicht? | Standardarbeit, Poka Yoke, sobald die Ursache bekannt ist | DMAIC: messen, Ursache belegen, abstellen, absichern |
| Warum driftet der Bohrungsdurchmesser über eine Schicht? | TPM, Standardarbeit | SPC, Fähigkeitsstudie, statistische Versuchsplanung (DoE) |
| Warum dauert das Rüsten 90 Minuten? | SMED | (selten das richtige Werkzeug) |
| Welche von 14 Prozesseinstellungen bestimmen die Schichtdicke? | (kein Werkzeug) | statistische Versuchsplanung, Regression |

Die ASQ beschreibt Lean Six Sigma als Verbindung beider Ansätze: Lean beseitigt Verschwendung und beschleunigt den Fluss, Six Sigma verringert Streuung [1]. In der Praxis nutzt ein Lean-Six-Sigma-Programm DMAIC als Projektstruktur und setzt darin Lean-Werkzeuge ein (Wertstromanalyse in Define, 5S und Standardarbeit in Improve und Control). Mehr Hintergrund steht auf der Entity-Seite [Lean Six Sigma](https://www.m365.fm/entity/lean-six-sigma/) und im Beitrag [Lean vs. Six Sigma: Differences and How to Combine Them](https://www.m365.fm/community/u/mirko-p/blog/lean-vs-six-sigma-differences-combine/).

**Wo Six Sigma im größeren System steht.** Weder Lean noch Six Sigma ist für sich allein ein Managementsystem. [Operational Excellence](https://www.m365.fm/learn/operational-excellence/) ist der Rahmen, der Verbesserungsmethoden mit Strategie, täglicher Führung und Kultur verbindet. Ein Six-Sigma-Programm ohne diesen Rahmen produziert meist gute Projektberichte und wenig dauerhafte Veränderung.

## Der DMAIC-Zyklus Phase für Phase

DMAIC ist ein Fahrplan in fünf Phasen zur Verbesserung eines bestehenden Prozesses, dessen Leistung sich messen lässt. ISO 13053-1 verwendet dieselben fünf Phasen [10]. Jede Phase endet mit einem Gate-Review, in dem Champion und Black Belt entscheiden, ob das Projekt weiterläuft, den Umfang ändert oder gestoppt wird.

Dieser Abschnitt begleitet ein Beispielprojekt durch alle fünf Phasen: **Ausfälle bei der Dichtheitsprüfung eines Hydraulik-Ventilgehäuses aus Aluminium**, 48.000 Stück pro Jahr, 2,8 % Ausfallquote, 114.240 USD jährliche Fehlerkosten (Zahlen aus Rechenbeispiel 3 oben).

### Überblick: Phasen, Leitfragen, Werkzeuge, Ergebnisse

| Phase | Leitfrage | Typische Werkzeuge | Ergebnis (Gate-Liefergegenstand) | Typische Dauer [unbelegt] |
|---|---|---|---|---|
| Define | Was ist das Problem, für wen, und wie groß ist es? | Projektauftrag (Project Charter), SIPOC, Stimme des Kunden, CTQ-Baum, Stakeholder-Landkarte | unterschriebener Projektauftrag mit Ausgangswert, Ziel, Umfang, Team | 2–4 Wochen |
| Measure | Wie leistungsfähig ist der Prozess heute, und können wir den Daten trauen? | Datenerhebungsplan, Messsystemanalyse (Gage R&R), Prozesslandkarte, Ausgangs-Prozessfähigkeit, Pareto | validierter Ausgangswert (DPMO, Ausbeute, Cpk), Liste vermuteter Ursachen | 3–6 Wochen |
| Analyze | Was verursacht das Problem, mit Daten belegt? | Ishikawa, 5 Why, Fehlerbaum, Hypothesentests, Regression, Multi-Vari | verifizierte Grundursachen mit Nachweis | 3–6 Wochen |
| Improve | Welche Änderung beseitigt die Ursachen, und wirkt sie? | Lösungsmatrix, FMEA, DoE, Poka Yoke, Pilot | pilotierte Lösung mit Vorher-Nachher-Daten | 4–8 Wochen |
| Control | Wie halten wir den Gewinn? | Lenkungsplan (Control Plan), SPC, Standardarbeit, Reaktionsplan, Übergabe | Prozesseigner zeichnet ab; Projekt abgeschlossen | 4–12 Wochen Beobachtung |

Die Dauern sind typische Spannen aus der Praxis, keine Norm; ein Green-Belt-Projekt in einer einzelnen Zelle kann schneller gehen, ein standortübergreifendes Black-Belt-Projekt langsamer.

### Define

**Zweck:** Problem, Kunde, Ziel und Grenzen vereinbaren, bevor irgendjemand Daten sammelt.

**Schritte:**

1. **Die Problembeschreibung mit Zahlen schreiben, nicht mit Ursachen.** Gut: "Von Januar bis Juni 2026 sind 2,8 % der Ventilgehäuse bei der abschließenden Dichtheitsprüfung durchgefallen (1.344 pro Jahr bei aktueller Menge); das kostet 114.240 USD pro Jahr für Nacharbeit und Ausschuss." Schlecht: "Der Gießereilieferant liefert poröse Teile." (Das ist eine Vermutung über die Ursache.)
2. **Die Stimme des Kunden (Voice of the Customer, VOC) erfassen** und in qualitätskritische Merkmale (Critical to Quality, CTQ) übersetzen. Der Kunde will "keine Undichtigkeiten im Feld"; das CTQ lautet "Leckrate bei 6 bar Prüfdruck unter dem spezifizierten Grenzwert".
3. **Ein SIPOC zeichnen** (Suppliers, Inputs, Process, Outputs, Customers) mit fünf bis sieben Grobschritten. Es legt den Umfang fest: Gießereilieferant -> Wareneingang -> Zerspanung -> Waschen -> Montage von Stopfen und Dichtungen -> Dichtheitsprüfung -> Versand.
4. **Ein Ziel setzen**, das konkret und terminiert ist: "Ausfälle bei der Dichtheitsprüfung bis 31. Dezember 2026 von 2,8 % auf unter 1,0 % senken."
5. **Den finanziellen Nutzen abschätzen**, zusammen mit dem Werkscontroller (siehe Hinweis zu den Finanzen unten).
6. **Das Team bilden:** Black Belt oder Green Belt als Projektleitung, Prozesseigner (Meister der Fertigung), Qualitätsingenieur, ein Werker aus der Zerspanung je Schicht, Instandhaltung und der Einkauf für die Lieferantenseite.
7. **Den Projektauftrag vom Champion unterschreiben lassen.**

Erhalten Kunden jetzt fehlerhafte Teile, zuerst eindämmen (100-%-Prüfung, Sortieren, Sperren) und DMAIC parallel starten. DMAIC hat keinen formalen Eindämmungsschritt; 8D schon (siehe unten).

**Hinweis zu den Finanzen.** Nur Einsparungen zählen, die der Controller anerkennt: Ausschussmaterial, Nacharbeit zu ihren tatsächlichen Kosten, vermiedene Überstunden, Zeit für Wiederholprüfungen, Fracht für Ersatzteile. "Freigewordene Kapazität" nicht als Geld zählen, solange die Kapazität nicht verkauft oder tatsächlich eine Schicht gestrichen wird. Eine eigene Spalte für "weiche Nutzen" (Kundenbewertung, weniger Feuerwehreinsätze) hält die harte Zahl glaubwürdig.

### Measure

**Zweck:** einen vertrauenswürdigen Ausgangswert ermitteln und den Kreis der vermuteten Ursachen eingrenzen.

**Schritte:**

1. **Den Prozess im Detail abbilden** (eine Ebene unter dem SIPOC), mit jeder Prüfung und jeder Nacharbeitsschleife.
2. **Einen Datenerhebungsplan schreiben:** was gemessen wird, wie, von wem, wie oft, mit welchem Messmittel und wie die Daten geschichtet werden (Schicht, Maschine, Lieferantenlos, Werker, Wochentag). Eine Vorlage steht im Abschnitt Vorlagen.
3. **Das Messsystem prüfen**, bevor man irgendwelchen Daten traut. Für stetige Daten eine Gage-R&R-Studie durchführen (mehrere Prüfer messen dieselben Teile wiederholt). Für Gut/Schlecht-Daten wie eine Dichtheitsprüfung eine attributive Übereinstimmungsanalyse (Attribute Agreement Analysis) durchführen: Derselbe Satz bekannter Gut- und Schlechtteile wird wiederholt und verdeckt geprüft, und die Übereinstimmung mit dem bekannten Referenzzustand wird berechnet.
4. **Ausgangsdaten lange genug erheben**, um die normalen Streuquellen abzudecken (alle Schichten, mehrere Lieferantenlose).
5. **Die Ausgangsleistung berechnen:** Fehlerquote, DPMO, Sigma-Niveau, Erstdurchlaufquote und für stetige Merkmale Cp/Cpk (siehe Abschnitt Prozessfähigkeit).
6. **Ein Pareto-Diagramm erstellen** nach Fehlerart oder Fehlerort.

**Durchgehendes Beispiel, Ergebnisse aus Measure.** Das Team zieht sechs Wochen Prüfprotokolle der Dichtheitsprüfung mit Fehlerorten und führt mit 30 Referenzteilen (20 bekannte Gutteile, 10 mit kalibrierten Lecks), jedes dreimal geprüft, eine attributive Übereinstimmungsanalyse am Dichtheitsprüfgerät durch. Ergebnis: Das Prüfgerät wies 4 der 60 Prüfungen von Gutteilen zurück, fast alle in der Nachtschicht, nachdem die Dichtung der Prüfaufnahme nicht gewechselt worden war. **Ein Befund schon aus Measure allein: Ein Teil der "Fehlerquote" ist ein Messproblem.** Die Dichtung der Prüfaufnahme bekommt ein Wechselintervall, und das Pareto der 160 echten Ausfälle in sechs Wochen sieht so aus (Beispielwerte):

| Ausfallursache (Fundort bei der Zerlegung) | Anzahl | Anteil | Kumuliert |
|---|---|---|---|
| Gussporosität im Anschlussbereich | 74 | 46,3 % | 46,3 % |
| Beschädigter Dichtsitz (Grat, Kratzer) | 38 | 23,8 % | 70,0 % |
| Gewindegrat an der Stopfenbohrung | 21 | 13,1 % | 83,1 % |
| Scheinausfall durch Prüfaufnahme (vor der Abstellung) | 14 | 8,8 % | 91,9 % |
| Sonstige | 13 | 8,1 % | 100,0 % |
| **Summe** | **160** | **100 %** | |

Zwei Ursachen machen 70 % der Ausfälle aus. Das ist nicht "80/20", und das muss es auch nicht sein. Ein Pareto soll eine Rangfolge bilden, kein Verhältnis bestätigen.

**Freigabe des Messsystems.** Das von der AIAG herausgegebene Referenzhandbuch Measurement Systems Analysis aus der Automobilindustrie ist in den USA die gängige Referenz für Annahmekriterien bei Gage R&R. Eine viel zitierte Richtlinie, die in der Minitab-Dokumentation der AIAG zugeschrieben wird: Ein Gage R&R unter 10 % ist akzeptabel, 10 % bis 30 % kann je nach Anwendung und Kosten des Messmittels oder der Reparatur akzeptabel sein, über 30 % ist nicht akzeptabel; außerdem verlangt die AIAG mindestens fünf unterscheidbare Kategorien (ndc) [32]. Vor dem Festlegen von Annahmegrenzen die aktuelle Ausgabe des AIAG-MSA-Handbuchs und die Anforderungen des Kunden prüfen.

### Analyze

**Zweck:** belegen, welche Ursachen das Problem treiben. Das ist die Phase der Ursachenanalyse; die Werkzeuge dafür werden unten in eigenen Abschnitten behandelt.

**Schritte:**

1. **Mögliche Ursachen sammeln**, mit einem Ishikawa-Diagramm für jeden großen Pareto-Balken und mit Werkern aus allen Schichten im Raum.
2. **Die plausibelsten Äste vertiefen**, mit 5 Why und bei sicherheits- oder zuverlässigkeitskritischen Ausfällen mit einem Fehlerbaum.
3. **Mögliche Ursachen in prüfbare Hypothesen übersetzen:** "Die Porositätsquote unterscheidet sich zwischen Gießereilieferant A und Lieferant B." "Die Beschädigung des Dichtsitzes entsteht an der Waschstation, nicht in der Zerspanung."
4. **Die Hypothesen mit Daten prüfen:** geschichtetes Pareto, Test auf Anteilsunterschied (Zwei-Stichproben-Anteilstest), Chi-Quadrat-Test, t-Test oder ANOVA für stetige Daten, Regression, Multi-Vari-Diagramme oder einfach eine gut geplante Beobachtung am Gemba.
5. **Die Grundursache bestätigen**, indem man sie, wo möglich, ein- und ausschaltet: Ist die Ursache echt, verschwindet der Effekt, wenn sie beseitigt wird, und er kehrt zurück, wenn sie wieder eingeführt wird.

**Durchgehendes Beispiel, Ergebnisse aus Analyze.** Porosität: Von 1.200 Gehäusen von Lieferant A fielen 31 wegen Porosität durch (2,58 %); von 1.150 Gehäusen von Lieferant B fielen 9 durch (0,78 %). Ein z-Test für zwei Anteile ergibt z = 3,37 und p ≈ 0,0007. Der Unterschied ist sehr wahrscheinlich kein Zufall. Die Gussteile von Lieferant A sind die Hauptquelle der Porosität, und ein Besuch zeigt, dass Lieferant A bei dieser Teilenummer seit einer Kostensenkungsmaßnahme vor zwei Jahren die Vakuumimprägnierung auslässt (Beispiel).

Beschädigung des Dichtsitzes: Das Team markiert 50 Teile und prüft sie nach jedem Schritt. Alle Beschädigungen entstehen im Waschkorb, in dem sich die Gehäuse berühren. Die 5-Why-Kette endet bei "Die Korbaufnahme wurde durch einen Standardkorb ersetzt, als die alte kaputtging, und niemand hat die Arbeitsanweisung aktualisiert."

**Statistik ohne Überdehnung.** Ein p-Wert sagt, wie überraschend die Daten wären, wenn es keinen Unterschied gäbe. Er sagt nicht, wie groß oder wichtig der Unterschied ist, und er beweist keine Kausalität. Ihn mit der Effektgröße (hier 1,8 Prozentpunkte) und einer physikalischen Erklärung (fehlende Imprägnierung) kombinieren. Lässt sich der Mechanismus nicht erklären, weiter untersuchen.

### Improve

**Zweck:** Lösungen entwickeln, testen und umsetzen, die die verifizierten Ursachen beseitigen.

**Schritte:**

1. **Lösungen für jede Grundursache entwickeln**, möglichst mehrere je Ursache.
2. **Lösungen auswählen** mit einer einfachen Matrix: Wirkung auf die Grundursache, Kosten, Umsetzungsdauer, Risiko.
3. **Eine FMEA für den geänderten Prozess durchführen:** Was könnte mit der neuen Lösung schiefgehen?
4. **Einstellungen optimieren**, wo mehrere Faktoren zusammenwirken, mit statistischer Versuchsplanung (Design of Experiments, DoE). Ein vollfaktorieller Versuchsplan mit zwei Stufen und drei Faktoren braucht 2³ = 8 Versuche und zeigt Haupteffekte und Wechselwirkungen; bei fünf Faktoren ist ein halber Teilfaktorplan (16 Versuche) üblich.
5. **Die Lösung pilotieren**, in begrenztem Umfang (eine Schicht, ein Los, zwei Wochen), und das Ergebnis mit demselben Messsystem messen wie den Ausgangswert.
6. **Die Verbesserung statistisch belegen.** Vorher-Nachher-Vergleich mit genug Daten: Um einen Rückgang von 2,8 % auf 0,6 % mit 95 % Konfidenz und 80 % Trennschärfe (Power) zu erkennen, braucht ein Zwei-Stichproben-Anteilstest etwa 540 Teile je Gruppe (Berechnung mit der Normalverteilungsnäherung).
7. **Den Rollout planen**, einschließlich Schulung, Dokumentation und Kundeninformation, wenn die Änderung einen vom Kunden freigegebenen Prozess betrifft (bei Automobilzulieferern kann eine PPAP-Änderungsanzeige nötig sein).

**Durchgehendes Beispiel, Ergebnisse aus Improve.** Lieferant A führt die Vakuumimprägnierung wieder ein (der Einkauf verhandelt eine Preisanpassung von 0,40 USD je Gussteil, etwa 9.600 USD pro Jahr für den Anteil von Lieferant A). Der Waschkorb bekommt eine Aufnahme mit getrennten Nestern, und die Arbeitsanweisung wird aktualisiert. Das Dichtheitsprüfgerät bekommt ein Wechselintervall für die Dichtung der Prüfaufnahme und eine tägliche Prüfung mit einem Referenzleck. Pilot: 1.100 Gehäuse, 7 Ausfälle (0,64 %).

Fehlervermeidung (Mistake-Proofing) ist die stärkste Art von Lösung, weil sie nicht von Aufmerksamkeit abhängt: ein Nest, das das Teil nur in einer Lage aufnimmt, ein Sensor, der die Linie stoppt, wenn die Referenzleckprüfung ausgelassen wird. Der [Leitfaden Poka Yoke](https://www.m365.fm/learn/lean-management/poka-yoke/) behandelt die Methoden.

### Control

**Zweck:** den Gewinn halten, nachdem das Projektteam weitergezogen ist. Die meisten gescheiterten Projekte scheitern hier.

**Schritte:**

1. **Einen Lenkungsplan (Control Plan) schreiben:** für jede kritische Eingangs- und Ausgangsgröße, was gemessen wird, wie oft, von wem, die Grenzen und der Reaktionsplan bei Grenzverletzung. Eine Vorlage steht im Abschnitt Vorlagen.
2. **Regelkarten einrichten** für die wichtigsten Ausgangs- und Eingangsgrößen (siehe SPC unten).
3. **Standardarbeit und Arbeitsanweisungen aktualisieren** und jede Schicht schulen. Der [Leitfaden Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) erklärt, wie man Anweisungen schreibt, die Werker tatsächlich nutzen.
4. **Fehlervermeidung ergänzen**, wo möglich, und sie auditieren (ein umgangenes Poka Yoke ist schlimmer als keines).
5. **Die Kennzahl auf das Shopfloor-Board und auf die Agenda der Stufenbesprechung (Tier-Meeting) setzen.** Siehe den [Leitfaden Shop Floor Management](https://www.m365.fm/learn/shop-floor-management/).
6. **An den Prozesseigner übergeben**, mit unterschriebenem Abschluss einschließlich der finalen finanziellen Bestätigung durch den Controller.
7. **Nach 3 und nach 12 Monaten überprüfen.** Rutscht das Ergebnis ab, haben Reaktionsplan oder Standard versagt; das ist ein neues Problem, das gelöst werden muss.

**Durchgehendes Beispiel, Ergebnisse aus Control.** Eine tägliche p-Karte für die Ausfallquote der Dichtheitsprüfung bei etwa 400 Prüfungen pro Tag. Mit der neuen Mittellinie p = 0,6 % lauten die Eingriffsgrenzen: OEG = 0,006 + 3 × √(0,006 × 0,994 ÷ 400) = 0,006 + 0,0116 = **1,76 %**, UEG = 0 (der berechnete Wert ist negativ). Jeder Tag über 1,76 % löst den Reaktionsplan aus: Tagesproduktion sperren, Protokoll der Referenzleckprüfung kontrollieren, Lieferantenlosnummern prüfen. Nach sechs Monaten: Mittelwert 0,58 %, jährliche Einsparung vom Controller mit etwa 80.000 USD nach der Preiserhöhung für die Gussteile bestätigt.

**Projektwirtschaftlichkeit (Beispiel).** Teamzeit etwa 300 Stunden zu einem Vollkostensatz von 55 USD = 16.500 USD, Nestaufnahme 6.000 USD, Verriegelung am Prüfgerät 3.500 USD: einmalige Kosten etwa 26.000 USD. Gegenüber 80.000 USD pro Jahr amortisiert sich das in etwa vier Monaten. Der Controller bucht die Aufnahme je nach Aktivierungsgrenze des Werks als kleines Investitionsgut oder als Aufwand; die Preiserhöhung für die Gussteile sind laufende Kosten und bereits von der Einsparung abgezogen.

## Statistische Prozesslenkung (SPC) und Regelkarten

Die statistische Prozesslenkung (Statistical Process Control, SPC) nutzt Regelkarten, um gewöhnliche Streuung von Signalen zu unterscheiden, die ein Eingreifen erfordern. Die ASQ definiert die Regelkarte als Diagramm, mit dem untersucht wird, wie sich ein Prozess über die Zeit verändert, mit einer Mittellinie sowie oberer und unterer Eingriffsgrenze, die aus historischen Daten bestimmt werden [13].

### Zufällige und besondere Ursachen

Shewharts Erkenntnis ist bis heute der Kern von SPC: Jeder Prozess hat Streuung aus **zufälligen Ursachen** (Common Causes), die im System angelegt ist, und gelegentlich Streuung aus **besonderen, zuordenbaren Ursachen** (Special Causes), weil sich etwas verändert hat: ein verschlissenes Werkzeug, ein neues Materiallos, ein neuer Werker, ein Spannungseinbruch [12]. Wer auf zufällige Streuung reagiert, als wäre sie besonders (die Maschine nach jedem Punkt nachstellen), macht den Prozess schlechter; Deming nannte das Tampering (Herumdoktern). Wer besondere Ursachen ignoriert, lässt Fehler durch. Die Regelkarte entscheidet, was was ist.

### Warum Drei-Sigma-Grenzen

Der übliche Faktor ist 3, deshalb heißen die Grenzen Drei-Sigma-Grenzen [12]. Bei einer normalverteilten Kenngröße fällt ein Punkt nur in 0,27 % der Fälle zufällig außerhalb (0,00135 je Seite) [12]. Das ist ein vernünftiger Ausgleich zwischen Fehlalarmen und übersehenen Signalen. Wichtig ist der Unterschied:

| Eingriffsgrenzen | Toleranzgrenzen |
|---|---|
| aus den Prozessdaten berechnet | vom Kunden oder von der Konstruktion festgelegt |
| beschreiben, was der Prozess tut | beschreiben, was der Prozess tun soll |
| dienen zum Erkennen besonderer Ursachen | dienen zur Annahme oder Rückweisung von Teilen |
| gehören auf die Regelkarte | gehören nicht auf eine x-quer-Karte (Mittelwerte sind keine Einzelteile) |

### Die richtige Regelkarte wählen

| Datentyp | Stichprobe | Karte | Beispiel |
|---|---|---|---|
| Stetig | n = 1 | I-MR-Karte (Einzelwerte und gleitende Spannweite) | tägliche Viskosität je Charge |
| Stetig | n = 2 bis etwa 10 | x-quer/R-Karte | Bohrungsdurchmesser, 5 Teile pro Stunde |
| Stetig | n über etwa 10 | x-quer/s-Karte | automatisierte Messung bei hoher Stückzahl |
| Attributiv: fehlerhafte Einheiten (Gut/Schlecht) | variables oder konstantes n | p-Karte (Anteil), np-Karte (Anzahl, konstantes n) | Ausfälle bei der Dichtheitsprüfung pro Tag |
| Attributiv: Fehler (Anzahl je Einheit) | konstante Fläche/Einheit | c-Karte | Lackfehler je Karosserie |
| Attributiv: Fehler | variable Fläche/Einheit | u-Karte | Fehler je Quadratfuß Blech (ca. 0,09 m²) |

### Rechenbeispiel: x-quer/R-Karte

Eine Zerspanungszelle misst eine Bohrung von 12,000 ± 0,020 mm. Jede Stunde werden 5 aufeinanderfolgende Teile gemessen (Stichprobenumfang n = 5). Nach 25 Stichproben beträgt der Gesamtmittelwert x̿ = 12,004 mm und die mittlere Spannweite R̄ = 0,010 mm. Die NIST-Konstanten für n = 5 lauten A₂ = 0,577, D₃ = 0 und D₄ = 2,115 [14].

x-quer-Karte:

- OEG = x̿ + A₂ × R̄ = 12,004 + 0,577 × 0,010 = **12,0098 mm**
- Mittellinie = **12,004 mm**
- UEG = x̿ − A₂ × R̄ = 12,004 − 0,00577 = **11,9982 mm**

R-Karte:

- OEG = D₄ × R̄ = 2,115 × 0,010 = **0,0212 mm**
- Mittellinie = **0,010 mm**
- UEG = D₃ × R̄ = **0**

Geschätzte Prozessstandardabweichung: σ̂ = R̄ ÷ d₂ = 0,010 ÷ 2,326 = **0,0043 mm** (d₂ für n = 5, abgeleitet aus A₂ = 3 ÷ (d₂√n)).

Grenzen aus einem stabilen Ausgangszeitraum berechnen und dann einfrieren. Nur nach einer bewussten Prozessänderung neu berechnen, nicht jede Woche, sonst folgen die Grenzen genau der Drift, die man erkennen will.

### Regeln zum Erkennen von Signalen

Über einen einzelnen Punkt außerhalb der Grenzen hinaus markieren die Western-Electric-Regeln (WECO) nicht zufällige Muster [15]:

| Regel | Signal |
|---|---|
| 1 | ein Punkt jenseits von ±3σ |
| 2 | 2 der letzten 3 Punkte jenseits von ±2σ auf derselben Seite |
| 3 | 4 der letzten 5 Punkte jenseits von ±1σ auf derselben Seite |
| 4 | 8 aufeinanderfolgende Punkte auf einer Seite der Mittellinie |
| Trendregeln (wie bei NIST aufgeführt) | 6 Punkte in Folge stetig steigend oder fallend; 14 Punkte in Folge abwechselnd auf und ab |

Jede zusätzliche Regel fängt mehr echte Verschiebungen und erhöht zugleich die Fehlalarmrate. Eine verbreitete praktische Wahl sind die Regeln 1, 2 und 4 für die meisten Merkmale und der volle Satz nur dort, wo eine übersehene Verschiebung teuer ist. Die gewählten Regeln in den Lenkungsplan schreiben, damit jede Schicht gleich reagiert.

### SPC auf dem Shopfloor

- **Wer trägt ein?** Idealerweise der Werker an der Maschine, weil er sofort reagieren kann. Automatisierte SPC aus Messmitteln und Maschinendaten ist in Ordnung, solange jemand mit Entscheidungsbefugnis das Signal innerhalb von Minuten sieht.
- **Was passiert bei einem Signal?** Der Reaktionsplan: anhalten oder nicht, wer gerufen wird (Andon), welche Teile gesperrt werden, was zuerst geprüft wird. Ohne Reaktionsplan wird SPC zur Tapete. Der [Leitfaden Andon](https://www.m365.fm/learn/shop-floor-management/andon/) behandelt die Eskalationsseite.
- **Gewerkschaft und Belegschaft.** Diagramme, die die Leistung eines Werkers verfolgen, können als Überwachung verstanden werden. Den Prozess darstellen, nicht die Person, den Zweck erklären und die Werker an der Auswahl der Merkmale beteiligen. In Werken mit Gewerkschaftsvertretung (US-Kontext) prüfen, ob eine neue Erfassung von Arbeitsleistungsdaten vorher mit der Gewerkschaft besprochen werden muss.

## Prozessfähigkeit: Cp, Cpk, Pp und Ppk mit Beispielen

Die Prozessfähigkeit vergleicht die natürliche Streuung eines stabilen Prozesses mit den Toleranzgrenzen. NIST betont zwei Voraussetzungen: Der Prozess muss beherrscht sein, und Cp, Cpk und Cpm setzen normalverteilte Daten voraus [7]. NIST weist außerdem darauf hin, dass Schätzungen nur mit ausreichend großer Stichprobe gültig sind, "allgemein etwa 50 unabhängige Datenwerte" [7].

### Die Formeln

Aus dem NIST/SEMATECH e-Handbook [7]:

- **Cp** = (OSG − USG) ÷ 6σ (potenzielle Fähigkeit: nur Streubreite, Lage wird ignoriert)
- **Cpu** = (OSG − μ) ÷ 3σ; **Cpl** = (μ − USG) ÷ 3σ
- **Cpk** = min(Cpu, Cpl) (tatsächliche Fähigkeit: Streubreite und Lage)

(OSG = obere Spezifikations- bzw. Toleranzgrenze, englisch USL; USG = untere Spezifikationsgrenze, englisch LSL.)

**Cp, Cpk, Pp und Ppk im Vergleich.** Cp und Cpk verwenden die Kurzzeit-Standardabweichung (innerhalb der Stichproben), typischerweise R̄/d₂ aus der Regelkarte. Pp und Ppk verwenden dieselben Formeln mit der Gesamtstandardabweichung aller Daten, die auch Verschiebungen zwischen den Stichproben enthält. Liegt Ppk deutlich unter Cpk, driftet der Prozess zwischen den Stichproben: erst nach besonderen Ursachen suchen, bevor man ihn für fähig erklärt.

### Rechenbeispiel 1 (NIST)

Das Beispiel von NIST: OSG = 20, USG = 8, s = 2, Prozessmittelwert 16 [7].

- Cp = (20 − 8) ÷ (6 × 2) = 1,0
- Cpu = (20 − 16) ÷ 6 = 0,667; Cpl = (16 − 8) ÷ 6 = 1,333
- Cpk = 0,667

Der Prozess würde in die Toleranz passen, wenn er zentriert wäre (Cp = 1,0), liegt aber zu nah an der oberen Grenze. NIST folgert, dass der Prozess nicht gut genug ist, und empfiehlt, die Streuung zu verringern und/oder zu zentrieren [7].

### Rechenbeispiel 2 (Bohrung aus der Regelkarte)

Bohrung 12,000 ± 0,020 mm, x̿ = 12,004 mm, σ̂ = 0,0043 mm (aus R̄ ÷ d₂ oben).

- Cp = 0,040 ÷ (6 × 0,0043) = **1,55**
- Cpu = (12,020 − 12,004) ÷ (3 × 0,0043) = 0,016 ÷ 0,0129 = **1,24**
- Cpl = (12,004 − 11,980) ÷ 0,0129 = **1,86**
- Cpk = **1,24**

Erwarteter Anteil außerhalb der Toleranz oberhalb der OSG: z = 0,016 ÷ 0,0043 = 3,72, Rand ≈ 99 ppm. Würde der Prozess auf 12,000 mm zentriert, stiege Cpk auf Cp = 1,55, ohne dass die Streuung überhaupt verringert wird, und der erwartete Anteil außerhalb der Toleranz fiele auf wenige ppm. **Zentrieren ist oft die billigste Verbesserung**: eine Werkzeugkorrektur, kein Investitionsprojekt.

Angenommen, die Langzeit-Standardabweichung aller Daten einschließlich der Drift zwischen den Schichten beträgt 0,0058 mm. Dann ist Pp = 0,040 ÷ 0,0348 = 1,15 und Ppk = 0,016 ÷ 0,0174 = **0,92**. Die Lücke zwischen Cpk 1,24 und Ppk 0,92 zeigt, dass sich der Prozess zwischen Stunden oder Schichten bewegt; die Regelkarte sollte zeigen, wo.

### Was ist ein "guter" Cpk-Wert?

Die NIST-Tabelle ordnet Cp-Werten Ausschussquoten für einen zentrierten Prozess zu: Cp 1,00 -> 0,27 %, 1,33 -> 64 ppm, 1,66 -> 0,6 ppm, 2,00 -> 2 Teile pro Milliarde [7]. In seinem eigenen Beispiel schreibt NIST: "Wir möchten einen Cpk von mindestens 1,0 haben" [7]. Anforderungen in der Industrie liegen oft höher:

| Typische Anforderung | Wo sie häufig verwendet wird |
|---|---|
| Cpk ≥ 1,33 | verbreitetes Minimum für Merkmale in der laufenden Serie in der Automobilindustrie und der allgemeinen Industrie |
| Ppk ≥ 1,67 | vorläufige Prozessfähigkeitsuntersuchungen für neue oder geänderte Prozesse bei der Freigabe von Automobilzulieferern (PPAP) |
| Cpk ≥ 2,0 | "Six-Sigma-Fähigkeit" kurzfristig; sicherheitskritische Merkmale oder Merkmale mit hoher Stückzahl |

[unbelegt: Die Schwellen 1,33 und 1,67 sind übliche Praxis in AIAG-Handbüchern (PPAP, SPC) und kundenspezifischen Anforderungen, die bei der Recherche online nicht zugänglich waren. Die Anforderung des Kunden prüfen, nicht eine allgemeine Tabelle.]

Nach der 1,5-Shift-Konvention hat ein Six-Sigma-Prozess kurzfristig einen Cpk von 2,0 und langfristig einen Cpk von 1,5 [5].

### Fallstricke bei der Prozessfähigkeit

1. **Instabiler Prozess:** Ein Fähigkeitsindex für einen nicht beherrschten Prozess sagt nichts voraus. Zuerst die Regelkarte.
2. **Nicht normalverteilte Daten:** Ebenheit, Rundlauf, Rundheit und andere einseitige Merkmale sind bei null begrenzt und meist schief verteilt. NIST schlägt eine Box-Cox-Transformation oder nichtparametrische Indizes vor [7].
3. **Zu wenige Datenpunkte:** 20 Teile ergeben einen Cpk mit sehr breitem Vertrauensbereich. Mindestens die etwa 50 Werte verwenden, die NIST nennt [7].
4. **Messfehler:** Verbraucht das Gage R&R 30 % der Toleranz, misst die Fähigkeitsstudie das Messmittel ebenso sehr wie den Prozess.
5. **Rundung:** Ein Messmittel mit 0,01 mm Auflösung bei einer Toleranz von ±0,020 mm liefert nur eine Handvoll unterschiedlicher Werte; die Standardabweichung wird schlecht geschätzt.

## Ursachenanalyse in der Produktion

Die ASQ nennt die Ursachenanalyse (Root Cause Analysis) "einen Sammelbegriff für eine breite Palette von Ansätzen, Werkzeugen und Techniken, mit denen Ursachen von Problemen aufgedeckt werden", und definiert eine Grundursache als "einen Faktor, der eine Abweichung verursacht hat", der durch Prozessverbesserung dauerhaft beseitigt werden sollte [6]. iSixSigma beschreibt die Grundursache als das Ausgangsproblem, das eine Ursache-Wirkungs-Kette bis zum Problem in Gang setzt [16]. Einfach gesagt ist die Ursachenanalyse (RCA) ein systematisches Vorgehen, um die zugrunde liegenden Ursachen eines Problems zu finden, statt seine Symptome zu behandeln.

Zwei Bemerkungen der ASQ verdienen es, jedem Team wiederholt zu werden. Die Ursachenanalyse "bringt für sich genommen keine Ergebnisse"; die Ergebnisse kommen aus den Korrekturmaßnahmen, zu denen sie führt. Und das Ergebnis ist in der Regel besser, wenn eine Gruppe gemeinsam nach Ursachen sucht [6].

### Ursachenanalyse durchführen: der Ablauf Schritt für Schritt

Welches Werkzeug auch immer genutzt wird, eine wirksame Ursachenanalyse folgt derselben Abfolge, ob der Auslöser Ausschuss, eine Kundenreklamation, ein Sicherheitsvorfall oder ein ungeplanter Stillstand ist. Die DMAIC-Phasen und die 8D-Disziplinen geben jeweils einen formalen Rahmen für die Ursachenanalyse; für ein alltägliches Problem passt derselbe Ablauf auf eine Seite (siehe die Vorlage Ursachenanalyse-Zusammenfassung unten).

1. **Das Problem beschreiben.** Eine klare Problembeschreibung kommt zuerst: was, wo, wann und wie viel, gemessen am Standard. Noch keine vermutete Ursache nennen; so bleibt die Untersuchung offen.
2. **Eindämmen.** Sind Kunden betroffen, sie schützen, bevor die Ursachenanalyse läuft: sortieren, sperren, 100 % prüfen.
3. **Daten sammeln.** Fakten über die Abfolge der Ereignisse, die zum Ausfall geführt haben, am Gemba, aus Aufzeichnungen und an den Teilen selbst erheben, nicht aus der Erinnerung im Besprechungsraum.
4. **Mögliche Ursachen auflisten.** Mit einem Ishikawa-Diagramm oder einer Ist/Ist-nicht-Analyse mögliche Ursachen und beitragende Faktoren sammeln, dann jede Ursachenkette mit 5 Why oder einem Fehlerbaum bis zur Systemebene verfolgen.
5. **Die Grundursache identifizieren und verifizieren**, mit Daten, einem Ein-Aus-Test oder physischen Belegen (siehe "Eine Grundursache verifizieren" unten).
6. **Korrekturmaßnahmen umsetzen**, die die Grundursache angehen, nicht nur die unmittelbare Ursache oder das Symptom.
7. **Wirksamkeit prüfen und Wiederholung verhindern.** Die Daten nach der Umsetzung prüfen, Standards, FMEA und Lenkungsplan aktualisieren und die Lösung auf ähnliche Produkte und Linien übertragen.

Teams für die Ursachenanalyse arbeiten am besten bereichsübergreifend und mit den Werkern, die den Prozess fahren. Die meisten Ursachenanalysen scheitern an den Schritten 5 bis 7: Eine Hypothese wird als Tatsache behandelt, die einzige Korrekturmaßnahme heißt "nachschulen", oder niemand prüft, ob das Problem zurückkommt. Gut gemacht ist die Ursachenanalyse einer der wichtigsten Motoren des KVP, weil jede verifizierte und beseitigte Grundursache wiederkehrende Probleme von der Liste nimmt.

### Symptom, unmittelbare Ursache, Grundursache

| Ebene | Beispiel (beschädigter Dichtsitz) | Maßnahme auf dieser Ebene |
|---|---|---|
| Symptom | Ventilgehäuse ist bei der Prüfung undicht | Eindämmung: 100-%-Prüfung, sortieren |
| Unmittelbare (physische) Ursache | Kratzer am Dichtsitz | Nacharbeit, Teil ersetzen |
| Zwischenursache | Gehäuse stoßen im Waschkorb aneinander | provisorischer Trenner |
| Grundursache (System) | Standardkorb ersetzte die spezielle Aufnahme; kein Änderungswesen für Vorrichtungen; Arbeitsanweisung nicht aktualisiert | spezielle Aufnahme, Vorrichtungen ins Änderungswesen, Standard aktualisiert |

Ein nützlicher Test: Würde die Behebung der genannten Ursache dasselbe Problem auch an den anderen Linien und Produkten verhindern? Wenn nicht, ist eine lokale Ursache gefunden, nicht die systemische. Viele Werke dokumentieren drei Ebenen je Problem: warum es aufgetreten ist, warum es nicht entdeckt wurde und warum das System es zugelassen hat (Planung und Änderungswesen). Aus der letzten Frage kommen die dauerhaften Lösungen.

### "Bedienfehler" ist keine Grundursache

Endet eine Ursachenanalyse bei "Werker hat die Arbeitsanweisung nicht befolgt" (also menschliches Versagen), die nächste Frage stellen: Warum war das möglich, und warum war es wahrscheinlich? Typische Antworten: Die Anweisung war mehrdeutig, die Schulung bestand aus einer Unterschrift auf einem Formular, die Aufnahme lässt das Teil in zwei Lagen zu, der Takt ließ keine Zeit für die Prüfung. Wer der Person die Schuld gibt, schließt den Bericht und behält die Ursache. Außerdem lernen alle daraus, Probleme zu verstecken. Eine Regel ohne Schuldzuweisung (No Blame) ist Voraussetzung für ehrliche Daten, und in Werken mit Gewerkschaftsvertretung ist sie oft auch Bedingung dafür, die Werker überhaupt in den Raum zu bekommen.

Das heißt nicht, dass niemand verantwortlich ist. Vorsätzliche Verstöße gegen Sicherheitsregeln sind eine disziplinarische Angelegenheit und werden in diesem Verfahren behandelt, getrennt von der Ursachenanalyse. Wenn bei einem Vorfall jemand verletzt wird, folgen in den USA die Aufzeichnungspflichten der OSHA und jede vorgeschriebene Untersuchung eigenen Regeln; die Ursachenanalyse soll in sie einfließen, sie aber nicht ersetzen.

### Wann eine Ursachenanalyse Pflicht ist: CAPA in regulierten Branchen

In vielen Branchen ist die Ursachenanalyse nicht freiwillig:

- **Medizinprodukte (USA):** Die Quality Management System Regulation (QMSR) der FDA, in Kraft seit 2. Februar 2026, ändert 21 CFR Part 820 und bindet ISO 13485:2016 per Verweis ein [17]. Korrektur- und Vorbeugungsmaßnahmen (Corrective and Preventive Action, CAPA) sind Teil dieses Rahmens: ISO 13485:2016 regelt Korrekturmaßnahmen in Abschnitt 8.5.2 und Vorbeugungsmaßnahmen in Abschnitt 8.5.3, beide mit dem Ziel, die Ursachen tatsächlicher oder möglicher Abweichungen zu beseitigen [33].
- **Automobilindustrie:** IATF 16949 verlangt dokumentierte Problemlösungsprozesse, und viele OEMs schreiben für Lieferantenreklamationen 8D-Formate vor [unbelegt: Abschnittsnummer anhand der Norm prüfen].
- **Luft- und Raumfahrt:** AS9100 verlangt Korrekturmaßnahmen mit Ermittlung der Grundursache; SAE AS13000 legt eine 8D-basierte Problemlösungsanforderung für Zulieferer der Luft- und Raumfahrt fest [unbelegt: Geltungsbereich von AS13000 auf sae.org bestätigen]. Der [Leitfaden Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/) behandelt den Kontext von AS9100.

In diesen Umfeldern wird die Qualität der Grundursachenaussage auditiert. "Werker nachgeschult" als einzige Korrekturmaßnahme ist eine schwache Antwort gegenüber einem Auditor oder Kunden, weil sie die Systemursache selten angeht.

## Werkzeuge der Ursachenanalyse: 5 Why, Ishikawa, Pareto, Fehlerbaum, 8D und mehr

Die folgenden Techniken reichen von einer 5-Why-Analyse in 15 Minuten bis zu einem Fehlerbaum, der Tage dauert. Die Matrix zeigt, was zu welchem Problem passt.

### Matrix zur Werkzeugauswahl

| Werkzeug | Am besten für | Benötigte Daten | Aufwand im Team | Schwäche |
|---|---|---|---|---|
| 5 Why | einfache Probleme mit einer Ursachenkette; einen Ast vertiefen | wenig | 15–60 Min. | folgt einem Pfad, hängt von den Fragenden ab; man hört leicht zu früh auf |
| Ishikawa (Fischgräte) | viele mögliche Ursachen strukturieren | wenig | Workshop von 1–2 Std. | liefert Hypothesen, keine Belege |
| Pareto-Diagramm | Probleme oder Ursachen nach Häufigkeit oder Kosten ordnen | Anzahlen oder Kosten | 1 Std. | zeigt, was häufig ist, nicht warum |
| Ist/Ist-nicht-Analyse | eingrenzen, wo und wann das Problem auftritt | Beobachtung | 1 Std. | braucht ein klar abgegrenztes Problem |
| Fehlerbaumanalyse | sicherheits- oder zuverlässigkeitskritische Ausfälle mit mehreren beitragenden Ereignissen | Ausfalllogik, optional Wahrscheinlichkeiten | Tage | Aufwand; braucht Systemkenntnis |
| FMEA | Fehlerarten vorwegnehmen, bevor sie auftreten | Ingenieurwissen | Tage | Bewertungen sind subjektiv |
| Hypothesentests, Regression, DoE | Ursachen belegen und quantifizieren | Messdaten | Stunden bis Wochen | braucht Datenqualität und statistisches Können |
| 8D | Kundenreklamationen, Lieferantenprobleme; strukturierte Teamreaktion | gemischt | Wochen | kann zum Formularausfüllen werden |
| Änderungsanalyse | "Früher ging es": finden, was sich geändert hat | Änderungsaufzeichnungen | Stunden | braucht Aufzeichnungen über Änderungen |
| Barrierenanalyse | warum die bestehenden Schutzmaßnahmen versagt haben | Prozesskenntnis | Stunden | konzentriert sich auf Abwehr, nicht auf Entstehung |

Die ASQ nennt außerdem die Ereignis- und Ursachenfaktoranalyse (Events and Causal Factor Analysis), die Management Oversight and Risk Tree Analysis (MORT) und die Problemlösung nach Kepner-Tregoe als Ansätze [6]. In der Stückgutfertigung decken die ersten acht Werkzeuge der Tabelle den größten Teil ab. Welche Methode auch immer: Das Ziel ist dasselbe, nämlich die Grundursache eines Problems mit Belegen zu bestimmen und dann danach zu handeln.

### 5 Why

Das Lean Enterprise Institute beschreibt 5 Why (auch "fünf Warum") als die Praxis, bei jedem auftretenden Problem wiederholt nach dem Warum zu fragen, um über die offensichtlichen Symptome hinaus zur Grundursache zu gelangen; es zitiert Taiichi Ohnos Beispiel einer Maschine, die stehen geblieben war (Ohno 1988, S. 17) [18].

**Beispiel (beschädigter Dichtsitz):**

1. Warum war das Gehäuse undicht? Der Dichtsitz war zerkratzt.
2. Warum war er zerkratzt? Die Gehäuse stießen im Waschkorb aneinander.
3. Warum stießen sie aneinander? Der Korb hat keine Nester; die Teile liegen lose.
4. Warum hat der Korb keine Nester? Die spezielle Aufnahme ging kaputt und wurde durch einen Standardkorb ersetzt.
5. Warum wurde ein Standardkorb akzeptiert? Vorrichtungen unterliegen keinem Änderungswesen, und niemand prüft die Arbeitsanweisung, wenn Betriebsmittel ersetzt werden.

Grundursache (System): kein Änderungswesen für Vorrichtungen. Korrekturmaßnahme: spezielle Aufnahme, und Vorrichtungen werden in das Änderungsverfahren aufgenommen.

**Regeln, damit 5 Why funktioniert:**

- Von einer präzisen Problembeschreibung ausgehen, nicht von einer vagen.
- An den Gemba gehen und die Teile ansehen; nicht aus dem Besprechungsraum antworten.
- Jede Antwort muss eine überprüfbare Tatsache sein. Vermutungen als Vermutungen kennzeichnen und verifizieren.
- Fünf ist ein Richtwert. Aufhören, wenn eine Ursache erreicht ist, an der man ansetzen kann und die eine Wiederholung verhindert; das können drei oder sieben Fragen sein.
- Verzweigen, wenn eine Antwort zwei Ursachen hat. Eine 5-Why-Analyse, die nie verzweigt, ist oft zu stark vereinfacht.
- Die Kette rückwärts prüfen: Das "deshalb" von der Grundursache bis zum Symptom muss bei jedem Schritt Sinn ergeben.

**Bekannte Grenzen.** In BMJ Quality & Safety argumentierte Alan Card, 5 Why solle im Gesundheitswesen als Werkzeug der Unfalluntersuchung aufgegeben werden: Die Methode folgt einem einzigen Ursachenpfad, besteht auf einer einzigen Grundursache und zeigt auf die entfernteste Ursache, auch wenn eine nähere Lenkungsmaßnahme (etwa eine Zwangsführung) wirksamer wäre. Er empfiehlt systemorientierte Alternativen wie Ishikawa-Diagramme und Ursachenbaum-Diagramme [19]. Ein Fertigungswerk ist weniger komplex als eine Krankenhausstation, aber die Warnung gilt für komplexe Probleme mit mehreren zusammenwirkenden Ursachen: 5 Why auf jeden verifizierten Ast eines Ishikawa-Diagramms oder Fehlerbaums anwenden, nicht als einzige Methode.

### Ishikawa-Diagramm (Fischgrätendiagramm)

Das Fischgrätendiagramm (auch Ishikawa-Diagramm oder Ursache-Wirkungs-Diagramm), benannt nach Kaoru Ishikawa, ordnet mögliche Ursachen eines Problems in Kategorien [20]. Die ASQ nennt die 6 M: Material, Maschine, Methode, Messung, Mensch und Mitwelt (Umwelt), mit Money (Geld) als optionalem siebten M [20]. Viele US-Werke sagen "People" und "Environment" statt "Manpower" und "Mother Nature"; die Kategorien sind ein Hilfsmittel, keine Vorschrift.

**Vorgehen (nach ASQ [20]):**

1. Die Problembeschreibung vereinbaren und an den Kopf des Fisches schreiben.
2. Die Hauptäste der Kategorien zeichnen.
3. Ursachen sammeln (Brainstorming), bei jeder Idee fragen "Warum passiert das?" und sie einer Kategorie zuordnen.
4. Unterursachen als kleinere Äste ergänzen.
5. Wenn die Ideen nachlassen, auf Äste mit wenigen Ideen schauen.
6. Die wahrscheinlichsten Ursachen zur Verifizierung auswählen. Bei jeder vermerken, wie sie geprüft wird (Daten, Versuch, Beobachtung).

**Beispiel (Porosität, verkürzt):**

| Kategorie | Mögliche Ursachen |
|---|---|
| Material | Schwankung der Legierungszusammensetzung; Lieferant hat die Vakuumimprägnierung ausgelassen; Schwankung von Los zu Los |
| Maschine (Gießen beim Lieferanten) | Formtemperatur; Gießdruck; verstopfte Entlüftung |
| Methode | Imprägnierschritt bei Kostensenkung entfallen; kein Annahmekriterium für Porosität in der Zeichnung |
| Messung | Scheinausfälle am Dichtheitsprüfgerät; keine Röntgenstichproben im Wareneingang |
| Mensch | neue Druckgussmannschaft beim Lieferanten (unbestätigt) |
| Mitwelt | Luftfeuchtigkeit in den Sommermonaten |

Das Ishikawa-Diagramm ordnet und beweist nichts. Sein Ergebnis ist eine Liste von Hypothesen für die Analyze-Phase. Ein häufiger Fehler ist, am Ende des Workshops über die "Grundursache" abzustimmen und die Verifizierung auszulassen.

### Pareto-Diagramm

Ein Pareto-Diagramm ist ein Balkendiagramm von Häufigkeiten oder Kosten, absteigend sortiert, meist mit einer Linie für den kumulierten Prozentsatz; die ASQ zählt es zu den sieben elementaren Qualitätswerkzeugen [21]. Eine Pareto-Analyse steht meist früh in einer Ursachenanalyse, weil sie zeigt, an welchem Problem oder welcher Ursache zuerst gearbeitet werden soll. Die zugrunde liegende Idee der "wenigen Wesentlichen" (Vital Few) stammt von Joseph Juran, der sie nach dem Ökonomen Vilfredo Pareto benannte und später schrieb, er habe "dem Prinzip irrtümlich den falschen Namen gegeben", weil Paretos Modelle die Verteilung von Vermögen betrafen [29].

**Vorgehen (nach ASQ [21]):** Kategorien wählen, Maßgröße wählen (Häufigkeit, Kosten, Zeit), Zeitraum festlegen, Daten erheben, je Kategorie summieren, Balken vom höchsten zum niedrigsten zeichnen, kleine Kategorien als "Sonstige" zusammenfassen, die kumulierte Linie auf einer zweiten Achse ergänzen.

**Tipps:**

- **Pareto nach Kosten, nicht nur nach Anzahl.** 40 Kratzer zu je 5 USD Nacharbeit rangieren hinter 6 gerissenen Gussteilen zu je 400 USD Ausschuss.
- **Pareto eines Pareto.** Den größten Balken noch einmal aufschlüsseln (Porosität nach Anschluss, nach Lieferant, nach Formnest).
- **Gleicher Zeitraum, gleiche Definitionen.** Ein Pareto, das zwei Monate mit unterschiedlichen Fehlerschlüsseln mischt, führt in die Irre.
- **80/20 nicht erzwingen.** Im durchgehenden Beispiel machen die beiden größten Ursachen 70 % aus; das ist in Ordnung.

### Ist/Ist-nicht-Analyse

Ein einfaches, zu selten genutztes Werkzeug zur Eingrenzung eines Problems, verbunden mit der Problemanalyse nach Kepner-Tregoe [6]:

| Dimension | Ist | Ist nicht (könnte aber sein) | Unterschied | Mögliche Ursache |
|---|---|---|---|---|
| Was | Porositätslecks an Anschluss P2 | Anschluss P1, P3 | P2 liegt am dicksten Wandquerschnitt | Schwindungsporosität am dicken Querschnitt |
| Wo | Gussteile von Lieferant A | Gussteile von Lieferant B | A lässt die Imprägnierung aus | fehlende Imprägnierung |
| Wann | seit März 2024 | vor März 2024 | Kostensenkungsmaßnahme bei Lieferant A | Prozessänderung |
| Wie viel | 2–3 % der Teile von A | 0,8 % der Teile von B | | |

In der Spalte "Unterschied" zeigen sich die Ursachen. Zusammen mit einer Änderungsanalyse ("Was hat sich im März 2024 geändert?") findet sie die Ursache oft schneller als ein Ishikawa-Diagramm.

### Fehlerbaumanalyse

Die Fehlerbaumanalyse (Fault Tree Analysis, FTA) arbeitet von oben nach unten, ausgehend von einem unerwünschten Ereignis, und zeigt mit logischen Gattern, welche Kombinationen von Ereignissen auf tieferer Ebene es verursachen. Sie wurde 1962 bei den Bell Laboratories von H. A. Watson für das Startkontrollsystem der Minuteman I der US Air Force entwickelt; Boeing erweiterte sie später und wandte sie auf Zivilflugzeuge an, und das Fault Tree Handbook der US Nuclear Regulatory Commission (NUREG-0492, 1981) sowie das Fault Tree Handbook with Aerospace Applications der NASA (2002) standardisierten sie. IEC 61025 ist die internationale Norm [22].

**Gatter:**

- **ODER-Gatter:** Das Ausgangsereignis tritt ein, wenn irgendein Eingang eintritt. Bei unabhängigen Eingängen: P = 1 − (1 − P₁)(1 − P₂) ≈ P₁ + P₂ bei kleinen Wahrscheinlichkeiten [22].
- **UND-Gatter:** Das Ausgangsereignis tritt nur ein, wenn alle Eingänge eintreten. Bei unabhängigen Eingängen: P = P₁ × P₂ [22].

**Rechenbeispiel (Beispielwahrscheinlichkeiten je Ventilgehäuse):** Top-Ereignis "undichtes Ventilgehäuse wird an den Kunden geliefert".

- Ereignis A: Porositätsleck bleibt unentdeckt, weil die Dichtung der Prüfaufnahme verschlissen ist: 0,004
- Ereignis B: Stopfen nicht mit Drehmoment angezogen und nicht entdeckt: 0,002
- Ereignis C: Dichtsitz beschädigt (0,01) **UND** Ereignis D: Dichtheitsprüfung wegen eines Fehlers in der Ablauflogik der Prüfung übersprungen (0,05)

Top-Ereignis = A ODER B ODER (C UND D)

- C UND D = 0,01 × 0,05 = 0,0005
- Top = 1 − (1 − 0,004)(1 − 0,002)(1 − 0,0005) = **0,0065**, etwa 6.500 je Million Gehäuse, also rund 312 Schlupffälle pro Jahr bei 48.000 Stück, wenn nichts getan würde (Beispieleingaben).

Was der Baum zeigt: A und B sind Einzelfehlerstellen (Single Points of Failure), die das Ergebnis dominieren. Eine zweite, unabhängige Prüfung (Referenzleckprüfung in jeder Schicht) bei A macht daraus ein UND-Gatter und senkt den Wert um Größenordnungen. Das ist der Wert der FTA: Sie zeigt, wo sich eine redundante Lenkungsmaßnahme lohnt.

Die FTA lohnt den Aufwand bei sicherheits- und zuverlässigkeitskritischen Problemen, Feldausfällen mit mehreren beitragenden Ursachen und Konstruktionsreviews. Für ein Ausschussproblem mit einer klaren Fehlerart ist sie überdimensioniert.

### FMEA

Die Fehlermöglichkeits- und Einflussanalyse (Failure Mode and Effects Analysis, FMEA) ist vorbeugend: Sie sucht nach dem, was ausfallen könnte, bevor es ausfällt. Im DMAIC-Zyklus erscheint sie in Improve (zur Prüfung des neuen Prozesses) und in Control (als lebendes Dokument). Jede Fehlerart erhält eine Bewertung für Bedeutung (S, Severity), Auftreten (O, Occurrence) und Entdeckung (D, Detection), meist auf Skalen von 1 bis 10.

Klassische FMEAs ordnen Risiken mit der Risikoprioritätszahl RPZ = S × O × D. Das AIAG & VDA FMEA-Handbuch (2019) ersetzte die RPZ durch eine Tabelle der Aufgabenpriorität (Action Priority, AP), die der Bedeutung mehr Gewicht gibt, weil die RPZ zum Beispiel S = 10, O = 2, D = 2 (RPZ 40) als weniger dringend einstuft als S = 4, O = 4, D = 4 (RPZ 64) [unbelegt: AIAG & VDA FMEA-Handbuch (2019) war bei der Recherche online nicht zugänglich; die AP-Logik vor Veröffentlichung am Handbuch bestätigen].

| Fehlerart | Folge | S | Ursache | O | Aktuelle Lenkungsmaßnahme | D | RPZ | Maßnahme |
|---|---|---|---|---|---|---|---|---|
| Porosität an Anschluss P2 | äußeres Leck im Feld | 8 | fehlende Imprägnierung | 6 | 100-%-Dichtheitsprüfung | 3 | 144 | Imprägnierung in den Lenkungsplan des Lieferanten; Audit im Wareneingang |
| Kratzer am Dichtsitz | Leck, Nacharbeit | 6 | lose Teile im Korb | 5 | Dichtheitsprüfung | 3 | 90 | spezielle Nestaufnahme (Poka Yoke) |
| Prüfgerät meldet fälschlich "gut" | undichtes Teil wird geliefert | 9 | verschlissene Dichtung der Prüfaufnahme | 3 | keine | 8 | 216 | Referenzleckprüfung je Schicht, Verriegelung |

Die Zeile mit dem höchsten Risiko ist die ohne aktuelle Lenkungsmaßnahme, nicht die mit den meisten Fehlern. Das ist die typische Erkenntnis einer FMEA.

### 8D-Methode (8D-Report)

Das Modell der acht Disziplinen (8D) ist ein Problemlösungsansatz, der in der Automobilindustrie verbreitet ist und auch in anderen Branchen angewandt wird [23]. Ford beschrieb es 1987 in seinem Handbuch *Team Oriented Problem Solving* (TOPS) und überarbeitete es später zu Global 8D (G8D), wobei der Schritt D0 hinzukam; die Geschichte ist umstritten, da manche Quellen frühere Praktiken des US-Militärs nennen [24].

| Disziplin | Bezeichnung bei der ASQ [23] | Bedeutung in der Praxis |
|---|---|---|
| D0 | Planen | entscheiden, ob 8D nötig ist; Sofortreaktion |
| D1 | Team bilden | bereichsübergreifendes Team mit einem Champion |
| D2 | Problem definieren und beschreiben | Ist/Ist-nicht, 5W2H, quantifiziert |
| D3 | Vorläufige Eindämmungsmaßnahmen planen und umsetzen | sortieren, 100-%-Prüfung, sperren; den Kunden sofort schützen |
| D4 | Grundursachen bestimmen, identifizieren und verifizieren | Grundursache für das Auftreten und für den Schlupf (Nichtentdeckung) |
| D5 | Dauerhafte Abstellmaßnahmen wählen und verifizieren | belegen, dass die Lösung wirkt, bevor sie vollständig umgesetzt wird |
| D6 | Korrekturmaßnahmen umsetzen und validieren | ausrollen, Eindämmung aufheben, mit Daten validieren |
| D7 | Vorbeugende Maßnahmen ergreifen | FMEA, Lenkungsplan, Standards aktualisieren; auf ähnliche Produkte übertragen |
| D8 | Das Team würdigen | Leistung des Teams anerkennen, Bericht abschließen |

**Warum 8D bei Kunden beliebt ist:** D3 (Eindämmung) kommt vor der Grundursache, sodass der Kunde innerhalb von Stunden geschützt ist, und D4 verlangt sowohl die Grundursache für das Auftreten als auch für den Schlupf (warum der Fehler nicht entdeckt wurde). Viele Kunden erwarten D3 innerhalb von 24 Stunden und einen vollständigen 8D-Report innerhalb einer festgelegten Zahl von Tagen [unbelegt: Reaktionszeiten unterscheiden sich je nach Kunde].

### Eine Grundursache verifizieren, bevor Korrekturmaßnahmen folgen

Eine Grundursache gilt als verifiziert, wenn mindestens eines davon zutrifft:

1. **Ein-Aus-Test:** Beseitigen der Ursache beseitigt den Effekt; Wiedereinführen (wo gefahrlos möglich) bringt den Effekt zurück.
2. **Statistischer Nachweis:** Geschichtete Daten zeigen den Effekt nur dort, wo die Ursache vorliegt (Lieferant A gegenüber B), mit einem plausiblen Mechanismus.
3. **Physischer Nachweis:** Zerlegung, Metallografie, Röntgen, ein Kratzer, der zum Korbdraht passt.
4. **Logikprüfung:** Die Kette von der Grundursache zum Symptom hält in beide Richtungen, und die Ursache erklärt alle beobachteten Tatsachen in der Ist/Ist-nicht-Tabelle.

Ist nichts davon verfügbar, die Ursache als "wahrscheinlich" erfassen und die Verifizierung planen. Korrekturmaßnahmen auf Basis nicht verifizierter Ursachen sind eine Hauptquelle wiederkehrender Probleme.

## DMAIC, 8D, A3 oder PDCA: Was wann einsetzen?

Alle vier sind strukturierte Problemlösungszyklen. Sie unterscheiden sich in Umfang, Tempo und darin, wer sie vorantreibt.

| Kriterium | PDCA | A3 | 8D | DMAIC |
|---|---|---|---|---|
| Herkunft | Shewhart-/Deming-Zyklus | Toyota | Ford (TOPS, 1987) [24] | Motorola, GE |
| Typischer Auslöser | jede Verbesserungsidee, alltägliche Probleme | ein abgegrenztes Problem, das einer Führungskraft oder einem Teamleiter gehört | Kundenreklamation, Lieferantenproblem, Feldausfall | chronisches, messbares Problem mit unbekannten Ursachen |
| Eindämmungsschritt | nein | manchmal (Gegenmaßnahmen) | ja, D3, früh | nicht formal |
| Statistische Tiefe | gering | gering bis mittel | mittel | hoch |
| Dauer | Tage bis Wochen | Wochen | Tage bis Wochen (oft mit Kundentermin) | Wochen bis Monate |
| Wer leitet | jeder | der Problemeigner, gecoacht von einer Führungskraft | bereichsübergreifendes Team, Qualitätsingenieur | Green oder Black Belt |
| Dokumentation | kurz | ein Blatt im Format 11 × 17 Zoll (ca. A3) | 8D-Report (Kundenformat) | Projekt-Storyboard, Gate-Reviews |

**Faustregel:**

- Ein Kunde ist jetzt betroffen -> **8D** (Eindämmung zuerst).
- Ein chronisches Problem mit unklaren Ursachen, genug Daten und einer finanziellen Wirkung, die ein Projekt rechtfertigt -> **DMAIC**.
- Ein Problem, das ein Meister oder Ingenieur selbst verantworten und mit strukturiertem Denken und einem Coach lösen kann -> **A3**. Siehe den [Leitfaden A3-Methode](https://www.m365.fm/learn/lean-management/a3-methode/).
- Kleine, schnelle Verbesserungen und tägliches Lernen -> **PDCA**. Siehe den [Leitfaden PDCA-Zyklus](https://www.m365.fm/learn/lean-management/pdca-zyklus/).

Sie lassen sich gut kombinieren. Im D4 eines 8D kann eine kurze DMAIC-Analyze-Phase laufen; in der Improve-Phase von DMAIC laufen im Pilot PDCA-Zyklen; ein Black-Belt-Projekt kann für das Führungsreview auf einem A3 zusammengefasst werden. Kleine Verbesserungen, die unterwegs gefunden werden, gehören ins [Kaizen](https://www.m365.fm/learn/lean-management/kaizen/), nicht in den Projektauftrag.

## DMADV und Design for Six Sigma

DMAIC verbessert einen bestehenden Prozess. Gibt es den Prozess oder das Produkt noch nicht oder kann der bestehende das Ziel durch Verbesserung nicht erreichen, gilt Design for Six Sigma (DFSS). Der GE-Geschäftsbericht 1998 nennt bereits neue Produkte, die mit Methoden des Design for Six Sigma entwickelt wurden [4].

Der verbreitetste DFSS-Fahrplan ist DMADV:

| Phase | Zweck | Typische Werkzeuge |
|---|---|---|
| Define | Ziele, Kunde, Umfang der neuen Konstruktion | Projektauftrag, VOC, Marktdaten |
| Measure | Kundenbedürfnisse in messbare CTQs und Zielwerte übersetzen | CTQ-Baum, Quality Function Deployment (QFD) |
| Analyze | Konstruktionskonzepte entwickeln und bewerten | Konzeptauswahl (Pugh-Matrix), Konstruktions-FMEA, Simulation |
| Design | Detailkonstruktion, Parameter und Toleranzen optimieren | DoE, Toleranzanalyse, Zuverlässigkeitsmodellierung |
| Verify | Leistung im Pilot und in der Serie bestätigen | Pilotläufe, Fähigkeitsstudien, PPAP oder Erstmusterprüfung |

Es gibt weitere Varianten (IDOV, DMADOV); die Namen sind weniger wichtig als das Prinzip: Fähigkeit in die Konstruktion einbauen, statt Qualität später hineinzuprüfen. Prozesssimulation und digitale Zwillinge sind in den Phasen Analyze und Design nützlich, siehe den [Leitfaden Digital Twin](https://www.m365.fm/learn/digital-twin/).

## Six Sigma Belts, Rollen und Zertifizierung (US-Kontext)

### Die Rollen

| Rolle | Typische Aufgaben | Zeitanteil für Six Sigma |
|---|---|---|
| Geschäftsleitung | setzt strategische Prioritäten, finanziert das Programm | gering |
| Champion (Sponsor) | wählt und trägt Projekte, räumt Hindernisse aus dem Weg, leitet die Gate-Reviews | einige Stunden je Projekt und Monat |
| Prozesseigner | verantwortet den Prozess vor, während und nach dem Projekt; zeichnet die Control-Phase ab | Teilzeit |
| Master Black Belt | coacht Black Belts, verantwortet Methode und Schulung, prüft die Statistik | Vollzeit |
| Black Belt | leitet komplexe, bereichsübergreifende Projekte; coacht Green Belts | oft Vollzeit |
| Green Belt | leitet kleinere Projekte im eigenen Bereich, neben der regulären Arbeit | Teilzeit |
| Yellow Belt | Teammitglied mit Grundkenntnissen; bringt Daten und Prozesswissen ein | gelegentlich |
| White Belt (in manchen Programmen) | Stufe der Grundsensibilisierung | gelegentlich |

Die ASQ beschreibt Black Belts als Schlüsselpersonen mit umfassender Ausbildung in fortgeschrittener Statistik und Projektmanagement [1]. Es gibt keinen einheitlichen Standard dafür, was jeder Belt wissen muss oder wie viele Schulungsstunden er braucht; die Inhalte hängen vom Arbeitgeber oder der Zertifizierungsstelle ab. Der GE-Bericht 1998 zeigt, welche Größenordnung ein großes Programm erreichen kann: 5.000 Master Black Belts und Black Belts in Vollzeit [4].

### Zertifizierung: ASQ, IASSC oder Firmenprogramm

Die beiden bekanntesten unabhängigen Zertifizierungsstellen in den USA sind ASQ und IASSC. Ihre Modelle unterscheiden sich grundlegend: Die ASQ verlangt Berufserfahrung und für den Black Belt Projektnachweise (Affidavits); die IASSC prüft nur Wissen.

| Punkt (Stand November 2026) | ASQ Green Belt (CSSGB) | ASQ Black Belt (CSSBB) | ASQ Master Black Belt (CMBB) | IASSC Black Belt (ICBB) |
|---|---|---|---|---|
| Erfahrungsvoraussetzung | 3 Jahre bezahlte Vollzeittätigkeit in einem oder mehreren Bereichen des Body of Knowledge; keine Anrechnung von Ausbildung [25] | bezahlte Vollzeitstelle; 3 Jahre in den BoK-Bereichen plus ein abgeschlossenes Projekt mit unterschriebenem Nachweis, oder zwei Projekte mit Nachweisen [8] | aktueller ASQ Black Belt; Portfolio mit mindestens 5 Jahren als BB/MBB oder 10 abgeschlossenen BB-Projekten; Green-Belt-Arbeit zählt nicht [26] | keine [9] |
| Prüfung | 110 Fragen (100 gewertet), 4 Std. 18 Min. Prüfungszeit, Open Book (gebundene Unterlagen) [25] | 165 Fragen (150 gewertet), 4 Std. 18 Min., Open Book [8] | 110 Multiple-Choice-Aufgaben plus ein praxisbasierter Teil, 5 Std. 20 Min., Prometric-Testzentren im Juli und November [26] | 150 Fragen, 240 Minuten, Closed Book mit bereitgestellten Formeln, Bestehensgrenze 70 % [9] |
| Prüfungsgebühr | 483 USD (Mitglieder sparen 100 USD) [25] | 585 USD (Mitglieder sparen 100 USD) [8] | siehe ASQ | siehe PeopleCert |
| Erneuerung | über die ASQ-Rezertifizierung | über die ASQ-Rezertifizierung | über die ASQ-Rezertifizierung | alle 3 Jahre [9] |

Die ASQ bietet außerdem einen Six Sigma Yellow Belt (CSSYB) an [27]. Gebühren und Formate ändern sich; vor der Buchung die Seiten der Anbieter prüfen.

**Welche Zertifizierung?** Für einen Arbeitgeber belegt der Projektnachweis der ASQ, dass die Person echte Projekte abgeschlossen hat. Die IASSC ist für Menschen ohne Zugang zu Projekten zugänglich, zum Beispiel Studierende oder Quereinsteiger, und belegt Wissen, nicht Anwendung. Viele große Unternehmen zertifizieren Belts intern nach ihrem eigenen Projektstandard; das ist für den Aufstieg innerhalb dieses Unternehmens oft der wichtigste Nachweis. Ein Zertifikat aus einem kurzen Onlinekurs ohne Prüfung und ohne Projekt hat bei US-Arbeitgebern wenig Gewicht.

**Lohnt sich eine Zertifizierung?** Ob ein Kurs Six Sigma Green Belt oder Lean Six Sigma Green Belt heißt, ist weniger wichtig als die Frage, ob er eine Prüfung und ein echtes Projekt enthält. Für Qualitätsingenieure, KVP-Fachleute und Führungskräfte in der Produktion ist ein Green oder Black Belt eine häufige Anforderung oder ein Pluspunkt in Stellenausschreibungen. Gehaltsangaben auf Zertifizierungsseiten stammen meist aus Selbstauskunfts-Umfragen von Schulungsanbietern; vorsichtig damit umgehen. Das stärkere Argument ist praktisch: Ein Green-Belt-Projekt mit messbarer Einsparung macht sich im Lebenslauf besser als das Zertifikat selbst.

**Finanzierung.** Arbeitgeber übernehmen Schulungen oft im Rahmen eines Entwicklungsplans. In den USA unterstützen die NIST-MEP-Zentren kleine und mittlere Hersteller mit Schulung und Coaching zur Prozessverbesserung, und die NIST-Seite zu Lean und Prozessverbesserung nennt Six Sigma unter den Methoden, bei deren Anwendung die Zentren helfen können [31]; ob ein bestimmtes Zentrum eines Bundesstaats Belt-Schulungen anbietet, sollte direkt erfragt werden [unbelegt: Angebote unterscheiden sich je nach Zentrum]. Unterstützungsangebote stehen im [Leitfaden Operational Excellence](https://www.m365.fm/learn/operational-excellence/). Die Qualifikationsplanung für diese Rollen behandelt der [Leitfaden Qualifikationsmatrix](https://www.m365.fm/learn/operational-excellence/qualifikationsmatrix/).

## Vorlagen: Projektauftrag, Datenerhebungsplan, Ursachenanalyse und Lenkungsplan

Diese Vorlagen in eine Tabellenkalkulation, Microsoft Lists oder das eigene QM-System übernehmen. Die Beispieleinträge stammen aus dem durchgehenden Ventilgehäuse-Projekt.

### Projektauftrag (Project Charter)

| Feld | Inhalt (Beispiel) |
|---|---|
| Projekttitel | Ausfälle bei der Dichtheitsprüfung der Ventilgehäusefamilie VB-200 senken |
| Champion / Prozesseigner / Projektleitung | Leitung Produktion / Meister Zerspanung / Green Belt (Qualitätsingenieur) |
| Problembeschreibung | Jan.–Juni 2026: 2,8 % der VB-200-Gehäuse bei der abschließenden Dichtheitsprüfung durchgefallen; 1.344 Ausfälle/Jahr bei 48.000 Stück; 114.240 USD/Jahr Nacharbeit und Ausschuss |
| Wirtschaftliche Begründung | Fehlerkosten, Risiko von Feldlecks, Kundenbewertung |
| CTQ und Kennzahl | Erstdurchlaufquote der Dichtheitsprüfung; Ausfallquote (%), DPMO |
| Ausgangswert | 2,8 % (28.000 DPMO, 3,4 Sigma inkl. 1,5-Shift-Konvention) |
| Ziel | unter 1,0 % bis 31.12.2026 |
| Umfang drin / draußen | drin: Wareneingang Gussteile, Zerspanung, Waschen, Montage, Dichtheitsprüfung; draußen: Neukonstruktion des Produkts, andere Familien |
| Team | Meister, Werker (3 Schichten), Instandhaltungstechniker, Qualitätstechniker, Einkäufer |
| Meilensteine | Gate Define 15. Juli; Measure 30. Aug.; Analyze 30. Sept.; Improve 15. Nov.; Übergabe Control 31. Dez. |
| Erwarteter Nutzen (hart) | ca. 70.000 USD/Jahr, vom Werkscontroller bestätigt |
| Risiken und Randbedingungen | Mitwirkung des Lieferanten; Kundeninformation bei Prozessänderungen nötig |
| Unterschriften | Champion, Prozesseigner, Controller |

### Datenerhebungsplan

| Was (Kennzahl) | Operationale Definition | Datentyp | Methode / Messmittel | Stichprobe und Häufigkeit | Schichtung nach | Wer | Wo erfasst |
|---|---|---|---|---|---|---|---|
| Ergebnis der Dichtheitsprüfung | Ausfall = Leck über Grenzwert bei 6 bar, durch Wiederholprüfung bestätigt | attributiv | Dichtheitsprüfgerät Nr. 2 | 100 % der Produktion | Schicht, Lieferantenlos, Formnest, Tag | Prüfer | MES / Prüfprotokoll |
| Fehlerort | Anschluss oder Sitz, bei Zerlegung gefunden | attributiv | Sichtprüfung + Blasentest | jedes ausgefallene Teil | wie oben | Qualitätstechniker | Zerlegeblatt |
| Bohrungsdurchmesser | nach Zeichnung, 3-Punkt-Messung | stetig | pneumatisches Messgerät, R&R geprüft | 5 Teile/Stunde | Maschine, Schicht | Werker | SPC-Software |
| Imprägnierung beim Lieferanten | ja/nein je Los | attributiv | Lieferantenzertifikat | jedes Los | Lieferant | Wareneingang | Wareneingangsprotokoll |

### 5-Why-Arbeitsblatt

| Schritt | Frage | Antwort (Tatsache) | Wie verifiziert | Verifiziert? |
|---|---|---|---|---|
| Problem | präzise Beschreibung mit Zahlen | | | |
| Warum 1 | | | | ja / nein |
| Warum 2 | | | | |
| Warum 3 | | | | |
| Warum 4 | | | | |
| Warum 5 | | | | |
| Grundursache (System) | | | | |
| Warum nicht entdeckt? | | | | |
| Korrekturmaßnahme | Verantwortlich, Termin | | | |

### Ursachenanalyse-Zusammenfassung (eine Seite)

| Abschnitt | Inhalt |
|---|---|
| Problem | was, wo, wann, wie viel, Auswirkung beim Kunden |
| Eindämmung | was zum Schutz des Kunden getan wurde, seit wann, Wirksamkeit |
| Grundursache für das Auftreten | verifizierte Ursache und Nachweis |
| Grundursache für den Schlupf | warum die Entdeckung versagt hat, Nachweis |
| Systemische Grundursache | warum das System es zugelassen hat (Planung, Änderungswesen, Schulung) |
| Korrekturmaßnahmen | Maßnahme, Verantwortlich, Termin, Status |
| Wirksamkeitsprüfung | Daten nach der Umsetzung, Zeitraum, Ergebnis |
| Vorbeugungsmaßnahmen | auf ähnliche Produkte/Linien übertragen; FMEA und Lenkungsplan aktualisiert |
| Lessons Learned | mit welchen Teams geteilt |

### Lenkungsplan (Control Plan)

| Prozessschritt | Merkmal | Spezifikation | Methode | Stichprobe / Häufigkeit | Lenkungsmethode | Reaktionsplan | Verantwortlich |
|---|---|---|---|---|---|---|---|
| Wareneingang | Imprägnierzertifikat | je Los erforderlich | Zertifikatsprüfung | jedes Los | Checkliste Wareneingang | Los zurückweisen, Einkauf informieren | Leitung Wareneingang |
| Zerspanung | Bohrungsdurchmesser | 12,000 ± 0,020 mm | pneumatisches Messgerät | 5 Teile/Stunde | x-quer/R-Karte | anhalten, Werkzeugkorrektur prüfen, seit der letzten guten Stichprobe sperren | Werker |
| Waschen | Trennung der Teile | spezielle Nestaufnahme | Sichtprüfung | jeder Korb | Poka-Yoke-Aufnahme | anhalten, wenn Standardkorb verwendet wird | Werker |
| Dichtheitsprüfung | Funktion des Prüfgeräts | Referenzleck wird erkannt | Referenzteil | zu jedem Schichtbeginn | Verriegelung blockiert Prüfung ohne Check | Instandhaltung rufen, seit letztem Check erneut prüfen | Prüfer |
| Dichtheitsprüfung | Ausfallquote | unter 1,76 % pro Tag (OEG) | Prüfprotokoll | täglich | p-Karte | Tagesproduktion sperren, Lieferantenlose prüfen | Qualitätstechniker |

### Checkliste für Gate-Reviews

| Gate | Muss erfüllt sein, bevor es weitergeht |
|---|---|
| Define | Problem in Zahlen, keine Ursache in der Problembeschreibung; Ziel und Umfang vereinbart; Projektauftrag unterschrieben; Controller hat der Methode zur Nutzenberechnung zugestimmt |
| Measure | Messsystem geprüft; Ausgangswert deckt normale Streuung ab; Pareto erstellt; Daten geschichtet |
| Analyze | jede Grundursache mit Daten oder physischen Belegen verifiziert; Mechanismus erklärt |
| Improve | Pilot mit der Messmethode des Ausgangswerts durchgeführt; statistisch und praktisch bedeutsame Verbesserung; FMEA aktualisiert; Kunde bei Bedarf informiert |
| Control | Lenkungsplan in Kraft; SPC mit Reaktionsplan; Standards und Schulung aktualisiert; Prozesseigner hat unterschrieben; finanzielles Ergebnis bestätigt |

## Six Sigma einführen: ein 12-Monats-Fahrplan

Dieser Einführungsfahrplan gilt für ein einzelnes Werk mit etwa 200 bis 1.000 Beschäftigten, das ein Programm startet. Er ist eine Abfolge aus der Praxis, keine Norm [unbelegt: Phasendauern sind typische Erfahrungswerte].

| Phase | Monate | Wichtige Aktivitäten | Abschlusskriterien |
|---|---|---|---|
| 0. Bereitschaft | 1 | Führung entscheidet über das Warum (Bezug zur Strategie), benennt einen Champion und eine Einführungsleitung; prüft die Datenverfügbarkeit; vereinbart mit dem Controlling, wie Einsparungen bestätigt werden; informiert Gewerkschaft bzw. Arbeitnehmervertretung | schriftlicher Einführungsauftrag |
| 1. Projektauswahl | 1–2 | baut eine Projektpipeline aus Fehlerkosten (Cost of Poor Quality), Kundenreklamationen, Ausschuss-Pareto und Kennzahlen auf; bewertet Projekte nach Wirkung, Datenverfügbarkeit und Umfang | 3–5 abgegrenzte Pilotprojekte mit Champions |
| 2. Erste Schulungswelle | 2–5 | schult 1–2 Black Belts (extern oder über MEP) und 6–10 Green Belts, jeweils mit laufendem Projekt; Yellow-Belt-Sensibilisierung für Teammitglieder | jeder Teilnehmende an einem beauftragten Projekt |
| 3. Erste Projekte | 3–8 | führt Projekte mit monatlichen Gate-Reviews durch; Coach unterstützt bei der Statistik | mindestens 3 Projekte durch Control, Einsparungen bestätigt |
| 4. Integration | 6–10 | verknüpft Projektergebnisse mit dem Kennzahlensystem und den Shopfloor-Boards; ergänzt einen Standard für Ursachenanalyse (8D, 5-Why-Blatt) für alltägliche Probleme; baut eine Projektdatenbank auf | Standard für Ursachenanalyse wird in Stufenbesprechungen genutzt |
| 5. Zweite Welle und Überprüfung | 9–12 | schult die zweite Welle; prüft Programmergebnisse gegen den Auftrag; entscheidet über die Ausweitung | Programmreview mit der Führung; Plan für Jahr 2 |

**Fünf Entscheidungen, die über den Erfolg bestimmen:**

1. **Projektauswahl durch das Geschäft, nicht durch die Teilnehmenden.** Projekte sollen aus strategischen Zielen und gemessenen Verlusten kommen, nicht aus dem, was der Green Belt interessant findet.
2. **Champions, die erscheinen.** Ein Gate-Review, das der Champion auslässt, ist ein Signal an alle.
3. **Controlling vom ersten Tag an dabei.** Vorab vereinbaren, wie Einsparungen gezählt werden. Aufgeblähte Einsparungen zerstören die Glaubwürdigkeit schnell.
4. **Daten vor Schulung.** Kann das Werk Ausschuss nach Ursache nicht aus seinen Systemen ziehen, zuerst das beheben, sonst verbringen die Projekte Monate mit Datenerhebung.
5. **Die Control-Phase schützen.** Abgeschlossene und gehaltene Projekte belohnen, nicht gestartete.

**Kleine und mittlere Werke.** Ein Betrieb mit 120 Beschäftigten braucht keinen Master Black Belt. Zwei ausgebildete Green Belts, ein externer Coach für Statistik (ein MEP-Zentrum oder ein Berater), ein Projekt pro Quartal und ein konsequenter 8D/5-Why-Standard für alltägliche Probleme sind ein realistisches Programm.

## Kennzahlen für ein Six-Sigma- und Ursachenanalyse-Programm

Die Prozessergebnisse und den Zustand des Programms messen. Definitionen der allgemeinen Produktionskennzahlen (FPY, Ausschussquote, OEE) stehen im [Leitfaden Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/).

### Kennzahlen auf Prozessebene

| Kennzahl | Formel | Beispiel | Hinweis |
|---|---|---|---|
| Fehlerquote / fehlerhafte Einheiten | fehlerhafte Einheiten ÷ Einheiten | 1.344 ÷ 48.000 = 2,8 % | am einfachsten und am schwersten zu schönen |
| DPMO | Fehler ÷ (Einheiten × Möglichkeiten) × 10⁶ | 46 ÷ 40.000 × 10⁶ = 1.150 | Definition der Möglichkeiten festschreiben |
| Sigma-Niveau | NORM.S.INV(1 − DPMO/10⁶) + 1,5 | 4,55 | die 1,5-Konvention angeben |
| Erstdurchlaufquote (FPY) | beim ersten Mal gute Einheiten ÷ gestartete Einheiten | 97,2 % bei der Dichtheitsprüfung | je Schritt |
| Durchlaufausbeute (RTY) | Produkt der FPY aller Schritte | 89,4 % | zeigt die versteckte Fabrik |
| Cpk / Ppk | siehe Abschnitt Prozessfähigkeit | 1,24 / 0,92 | nur für stabile Prozesse |
| Fehlerkosten (Cost of Poor Quality, COPQ) | Ausschuss + Nacharbeit + Wiederholprüfung + Gewährleistung + Eilmaßnahmen | 114.240 USD/Jahr (eine Fehlerart) | mit dem Controlling vereinbart |
| Kunden-ppm | vom Kunden zurückgewiesene Teile ÷ gelieferte × 10⁶ | | so, wie der Kunde zählt |

### Kennzahlen auf Programmebene

| Kennzahl | Definition | Zielvorstellung |
|---|---|---|
| Abgeschlossene Projekte pro Quartal | Projekte durch das Control-Gate | gleichmäßiger Fluss, keine Spitze nach der Schulung |
| Durchlaufzeit je Projekt | Unterschrift des Projektauftrags bis Abzeichnung Control | nach Belt-Stufe verfolgen |
| Bestätigte harte Einsparungen | vom Controller bestätigt, auf das Jahr hochgerechnet | mit den Programmkosten vergleichen |
| Nachhaltigkeitsquote | Anteil abgeschlossener Projekte, deren Kennzahl nach 12 Monaten hält | die ehrliche Erfolgskennzahl |
| Wiederholungsquote der Ursachenanalysen | Anteil der Probleme, die innerhalb von 12 Monaten nach "abgeschlossen" wiederkehren | sinkt, wenn die Grundursachen echt sind |
| 8D-Termintreue | 8D-Reports mit D3 und D8 innerhalb der Kundenfrist | Kundenanforderung |
| Anteil der Ursachenanalysen, die nur mit "Bedienfehler" oder "Nachschulung" enden | | sollte gegen null gehen |
| Aktive Belts | ausgebildete Belts mit laufendem Projekt | Schulung ohne Projekte ist Verschwendung |

Nachhaltigkeitsquote und Wiederholungsquote sind die beiden Zahlen, die die meisten Programme nicht verfolgen, und genau die beiden, die zeigen, ob tatsächlich Grundursachen gefunden wurden.

## Häufige Fehler

| Fehler | Was passiert | Besser |
|---|---|---|
| Lösung steht schon in der Problembeschreibung | das Team beweist, was die Führungskraft ohnehin glaubte | die Lücke in Zahlen beschreiben; Ursachen kommen in Analyze |
| Zu große Projekte ("Ausschuss im ganzen Werk senken") | das Projekt läuft ein Jahr und versandet | eine Produktfamilie, eine Fehlerart, 4–6 Monate |
| Messsystemanalyse auslassen | das Projekt optimiert Rauschen; im durchgehenden Beispiel war ein Teil der "Fehlerquote" das Prüfgerät | MSA in jeder Measure-Phase |
| Sigma-Niveau aus Langzeitdaten plus 1,5 | Leistung wird zu gut dargestellt | DPMO und die verwendete Methode berichten |
| Prozessfähigkeit für einen instabilen Prozess | Cpk sagt nichts voraus | zuerst die Regelkarte |
| Abstimmung im Ishikawa-Workshop als "Grundursache" | Korrekturmaßnahme auf eine nicht verifizierte Hypothese | mit Daten oder Ein-Aus-Test verifizieren |
| "Bedienfehler" als Grundursache | das Problem kommt zurück; die Belegschaft meldet nichts mehr | fragen, warum das System es zugelassen hat |
| Statistik als Show | komplexe Tests, die niemand versteht; der Prozesseigner traut dem Ergebnis nicht | die einfachste Analyse, die die Frage beantwortet; Grafiken vor p-Werten |
| Schwache Control-Phase | die Gewinne verblassen binnen Monaten | Lenkungsplan, Reaktionsplan, Audits, Review nach 12 Monaten |
| Aufgeblähte Einsparungen | das Controlling glaubt dem Programm nicht mehr | der Controller bestätigt jede Zahl |
| Belts ohne Projekte ausgebildet | Zertifikate, keine Ergebnisse | kein Schulungsplatz ohne beauftragtes Projekt |
| Six Sigma als eigene Abteilung | Verbesserung wird zu "deren Aufgabe" | Belts arbeiten in der Linienorganisation; Ergebnisse in den Linienkennzahlen |

## Kritik und Grenzen von Six Sigma

Six Sigma hat ernst zu nehmende Kritiker, die ihre Kritik veröffentlicht haben.

### 1. "Nichts Neues"

Joseph Juran beschrieb Six Sigma als "eine Basisversion der Qualitätsverbesserung", und Philip Crosby argumentierte, der Maßstab von 3,4 pro Million gehe nicht weit genug [5]. Ein großer Teil des Werkzeugkastens (Regelkarten, Prozessfähigkeit, DoE, Pareto, Ishikawa) ist Jahrzehnte älter als Motorola. Die faire Antwort: Der Beitrag von Six Sigma war organisatorisch (Rollen, Projektauswahl, finanzielle Bestätigung), nicht statistisch.

### 2. Der 1,5-Sigma-Shift

Der Shift ist eine Konvention mit dünner empirischer Grundlage, kritisiert von Wheeler und anderen [5]. Siehe den Abschnitt oben. Das praktische Risiko ist falsches Berichten, nicht die Methode selbst.

### 3. Gemischte finanzielle Belege

Ein Artikel in Fortune aus dem Jahr 2006 berichtete über eine Analyse von Charles Holland vom Beratungsunternehmen Qualpro (das ein konkurrierendes Verfahren verkauft), wonach 91 % von 58 großen Unternehmen mit Six-Sigma-Programmen seit deren Start hinter dem S&P 500 zurückgeblieben waren [5]. Die Quelle hat einen offensichtlichen Interessenkonflikt, und Aktienkurse haben viele Ursachen. Trotzdem ist das eine nützliche Warnung, Einsparangaben im Stil von GE nicht als Beweis für Erfolg auf Unternehmensebene zu lesen.

### 4. Scheiterquoten von Projekten

Ein Bericht im Wall Street Journal von 2010 stellte fest, dass mehr als 60 % solcher Projekte scheitern [5]. Eine systematische Literaturauswertung von 56 Arbeiten aus den Jahren 1995 bis 2013 ermittelte 34 häufige Faktoren für das Scheitern von Lean, Six Sigma und Lean Six Sigma; die wichtigsten waren mangelndes Engagement und mangelnde Beteiligung des Top-Managements, mangelnde Kommunikation, fehlende Schulung und Ausbildung sowie begrenzte Ressourcen [30]. Die Sicht aus der Praxis, passend zur Fehlertabelle oben: Programme scheitern weit häufiger an Führung, Projektauswahl und Control-Phase als an der Statistik.

### 5. Innovation und Forschung

Der Chefredakteur von Design News argumentierte 2007, Six Sigma sei für Forschungsumgebungen ungeeignet, weil der Fokus auf weniger Streuung mit dem Experimentieren kollidiere, das Entdeckungen brauchen [5]. Weniger Streuung ist das richtige Ziel für einen stabilen Produktionsprozess und das falsche für ein Entwicklungslabor.

### 6. Bürokratie und die Belt-Ökonomie

Gate-Reviews, Vorlagen und Zertifizierung können zu Papierkram werden, und ein Markt billiger Online-"Zertifikate" hat verwässert, was ein Belt bedeutet. Die Abhilfe liegt in der Gestaltung des Programms: weniger, bessere Projekte; Projektnachweise; vom Controlling bestätigte Einsparungen.

### 7. Auswirkungen auf die Belegschaft

Wird Six Sigma als Expertenprogramm betrieben, erleben die Werker es als etwas, das ihnen angetan wird: Daten über ihre Arbeit werden erhoben, Änderungen in Besprechungsräumen beschlossen. Das schadet dem Vertrauen und der Qualität der Informationen, von denen Projekte abhängen. Werker gehören ins Team, besonders in Measure und Analyze, wo sie wissen, welche Schicht was anders macht. Wo Kosteneinsparungen zu Personalabbau führen, hören die Menschen auf, Ideen beizutragen; eine erklärte Beschäftigungssicherung für Produktivitätsgewinne aus Verbesserungsarbeit ist in Lean- und Six-Sigma-Programmen eine verbreitete Antwort. In Werken mit Gewerkschaftsvertretung die Gewerkschaft früh einbinden, wenn es um die Nutzung von Daten geht. Verbesserungen bei Arbeitssicherheit und Ergonomie sind legitime Ziele von Six-Sigma-Projekten; für Letztere sind in den USA die Ergonomie-Ressourcen der OSHA ein guter Ausgangspunkt [28].

### Wann Six Sigma nicht das richtige Mittel ist

- Die Ursache ist bei einem Gemba-Walk sichtbar: mit Lean-Werkzeugen oder einem PDCA-Zyklus abstellen.
- Es gibt keine Daten und keine Möglichkeit, sie innerhalb von Wochen zu bekommen.
- Die Stückzahl ist zu klein für Statistik (wenige Einheiten pro Jahr); dann Ingenieuranalyse, FTA oder FMEA nutzen.
- Der Engpass ist die Kapazität an einer Engpassmaschine, nicht die Streuung; siehe den [Leitfaden Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant).
- Die Aufgabe ist Innovation, nicht Stabilisierung.

## Six Sigma, Daten und KI: die digitale Seite

Six Sigma wurde für eine Welt der manuellen Datenerhebung entworfen: Strichlisten, wenige Stichproben pro Schicht, ein Black Belt mit Statistiksoftware. Heute haben Werke Maschinendaten, MES-Aufzeichnungen und Prüfprotokolle mit Millionen von Zeilen. Das verändert die Methode auf nützliche und auf riskante Weise.

### Was besser wird

- **Measure wird schneller.** Sind Ausschuss, Prüfergebnisse und Prozessparameter bereits je Teil oder Charge erfasst, steht der Ausgangswert, für den früher sechs Wochen manuell gesammelt wurde, womöglich an einem Tag zur Verfügung. Voraussetzung ist ein Datenmodell, das Ergebnisse mit dem Prozesskontext (Maschine, Werkzeug, Materiallos, Schicht) und der Teilehistorie (Genealogie) verknüpft, sodass sich eine ausgefallene Seriennummer bis zu ihrem Gusslos und ihrer Bearbeitungsspindel zurückverfolgen lässt. Diese Verknüpfung ist Aufgabe eines MES; siehe den [Leitfaden MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant).
- **SPC wird kontinuierlich.** Messmittel und Sensoren können Regelkarten automatisch speisen, mit Alarmen auf das Telefon des Teamleiters. Der [Leitfaden Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/) beschreibt typische Architekturen.
- **Analyze hat mehr Kandidaten.** Werden Hunderte von Prozessparametern erfasst, können Regression und Modelle des maschinellen Lernens ordnen, welche Eingangsgrößen mit Fehlern korrelieren. Das ist ein starker Weg, Hypothesen zu erzeugen.
- **Process Mining** rekonstruiert den tatsächlichen Fluss von Aufträgen und Teilen aus den Ereignisprotokollen der Systeme; das hilft in Define und Measure bei transaktionalen Problemen und Problemen im Auftragsfluss. Siehe den [Leitfaden Process Mining in der Produktion](https://www.m365.fm/learn/digital-twin/process-mining-produktion/) (geplant).
- **Simulation und digitale Zwillinge** erlauben einem Team, Improve-Optionen virtuell zu testen, bevor ein Pilot läuft, besonders wenn die Änderung Fluss und Kapazität betrifft und nicht nur die Qualität. Siehe den [Leitfaden Digital Twin](https://www.m365.fm/learn/digital-twin/).
- **Predictive Maintenance** überträgt die Control-Logik von Teilemerkmalen auf den Anlagenzustand; siehe den [Leitfaden Predictive Maintenance und IIoT](https://www.m365.fm/learn/predictive-maintenance-iiot/) (geplant).

### Was gleich bleibt oder riskanter wird

- **Korrelation ist keine Grundursache.** Ein Modell, das eine Korrelation zwischen Kühlmitteltemperatur und Porosität findet, hat eine Hypothese erzeugt. Die Verifizierung (Ein-Aus-Test, physikalischer Mechanismus) bleibt nötig. Bei Hunderten von Variablen korrelieren einige zufällig.
- **Messsystemanalyse gilt auch für Sensoren.** Ein driftender Sensor, der eine automatische Regelkarte speist, erzeugt selbstbewussten Unsinn. Kalibrierung und MSA gehören in die Datenpipeline.
- **Die Datenqualität entscheidet.** Wird ein Fehlerschlüssel am Schichtende aus einer langen Auswahlliste gewählt, zeigt das Pareto die Gewohnheiten der Person, die tippt, nicht die Fehler.
- **Mehr Alarme sind keine bessere Lenkung.** Eine automatische Karte mit allen WECO-Regeln auf 400 Merkmalen erzeugt stündlich Fehlalarme; die Werker lernen, sie zu ignorieren. Merkmale und Regeln bewusst auswählen.
- **Generative KI** kann aus einer Problembeschreibung einen Entwurf für eine 5-Why-Analyse, einen 8D-Report oder ein Ishikawa-Diagramm erstellen. Das ist als Checkliste möglicher Ursachen nützlich. Sie kann das Teil aber nicht sehen und neigt zu plausiblen Ketten, die niemand verifiziert hat. KI-Ergebnisse als Input für das Brainstorming behandeln, nie als Grundursache.
- **OT-Security.** Wer Prüfstände und Maschinen an Cloud-Analytik anbindet, schafft Angriffsfläche. Netze segmentieren und ISA/IEC 62443 befolgen; siehe den [Leitfaden OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant).

### Microsoft 365 und Alltagswerkzeuge

Für viele Werke ist der realistische digitale Werkzeugsatz für Six Sigma bescheiden: Excel oder ein Statistikpaket (Minitab, JMP oder R/Python) für die Analyse, Power BI für Pareto- und Trend-Dashboards, Microsoft Lists oder das QM-System für die Verfolgung von 8D und CAPA, Teams-Kanäle für Projektteams. Die Excel-Funktionen `NORM.S.INV` und `NORM.S.VERT` (englisch `NORM.S.DIST`) sowie die Analyse-Funktionen (Analysis ToolPak) decken die Berechnungen in diesem Artikel ab. Ein Black Belt, der einem Meister eine Regelkarte erklären kann, ist trotzdem mehr wert als jedes Werkzeug.

## Glossar

| Begriff | Definition |
|---|---|
| 5 Why | wiederholtes Fragen nach dem Warum, um über die Symptome hinaus zur Grundursache zu gelangen [18] |
| 8D | Problemlösungsmodell mit acht Disziplinen (D0–D8), verbreitet in der Automobilindustrie [23] |
| ANOVA | Varianzanalyse; prüft, ob sich die Mittelwerte mehrerer Gruppen unterscheiden |
| Besondere (zuordenbare) Ursache | Streuquelle aus einer bestimmten Veränderung; wird von einer Regelkarte signalisiert [12] |
| Attributive Übereinstimmungsanalyse | MSA für Gut/Schlecht- oder kategoriale Urteile |
| Black Belt | Projektleitung in Vollzeit oder fast Vollzeit mit Ausbildung in fortgeschrittener Statistik [1] |
| Champion | Sponsor aus der Führung, der Projekte auswählt und Hindernisse beseitigt |
| Zufällige Ursache (Common Cause) | im System angelegte Streuung [12] |
| Regelkarte | zeitlich geordnetes Diagramm mit Mittellinie und Eingriffsgrenzen [13] |
| Lenkungsplan (Control Plan) | Dokument mit Merkmalen, Methoden, Häufigkeiten und Reaktionsplänen |
| COPQ | Fehlerkosten (Cost of Poor Quality): Ausschuss, Nacharbeit, Gewährleistung, Eilmaßnahmen |
| Cp | (OSG − USG) ÷ 6σ; potenzielle Prozessfähigkeit [7] |
| Cpk | Minimum aus (OSG − μ) ÷ 3σ und (μ − USG) ÷ 3σ; tatsächliche Prozessfähigkeit [7] |
| CTQ | Critical to Quality: ein messbares Merkmal, das für den Kunden wichtig ist |
| DFSS | Design for Six Sigma; Produkte und Prozesse von Anfang an fähig gestalten |
| DMADV | Define, Measure, Analyze, Design, Verify (DFSS-Fahrplan) |
| DMAIC | Define, Measure, Analyze, Improve, Control [1][10] |
| DoE | statistische Versuchsplanung (Design of Experiments); geplante Variation von Faktoren, um Effekte und Wechselwirkungen zu finden |
| DPMO | Fehler pro Million Möglichkeiten (Defects per Million Opportunities) |
| DPU | Fehler pro Einheit (Defects per Unit) |
| Fehlerbaumanalyse (FTA) | Logikdiagramm von oben nach unten mit den Ereigniskombinationen, die zu einem Ausfall führen [22] |
| Ishikawa-Diagramm (Fischgräte) | Ursache-Wirkungs-Diagramm, das Ursachen in Kategorien ordnet [20] |
| FMEA | Fehlermöglichkeits- und Einflussanalyse |
| FPY | Erstdurchlaufquote (First Pass Yield) |
| Gage R&R | Untersuchung von Wiederholpräzision und Vergleichspräzision eines Messsystems |
| Green Belt | Projektleitung in Teilzeit im eigenen Bereich |
| I-MR-Karte | Regelkarte für Einzelwerte und gleitende Spannweite |
| Ist/Ist-nicht | Eingrenzung eines Problems durch Gegenüberstellung, wo es auftritt und wo es auftreten könnte, aber nicht auftritt |
| Lean Six Sigma | Verbindung von Lean-Flussmethoden und der Streuungsreduzierung von Six Sigma [1] |
| USG / OSG | untere / obere Spezifikationsgrenze (englisch LSL / USL) |
| Master Black Belt | Coach und Methodenverantwortlicher für Black Belts |
| MSA | Messsystemanalyse (Measurement System Analysis) |
| p-Karte | Regelkarte für den Anteil fehlerhafter Einheiten |
| Pareto-Diagramm | nach Größe sortiertes Balkendiagramm mit kumulierter Linie [21] |
| Poka Yoke | Fehlervermeidung (Mistake-Proofing) |
| Pp / Ppk | Fähigkeitsindizes mit der Gesamt-(Langzeit-)Standardabweichung |
| Grundursache (Root Cause) | ein Faktor, der eine Abweichung verursacht hat und dauerhaft beseitigt werden sollte [6] |
| RPZ | Risikoprioritätszahl = Bedeutung × Auftreten × Entdeckung (englisch RPN) |
| RTY | Durchlaufausbeute (Rolled Throughput Yield): Produkt der Ausbeuten aller Schritte |
| Sigma-Niveau | DPMO ausgedrückt als z-Wert plus 1,5 (Konvention) [5] |
| SIPOC | Suppliers, Inputs, Process, Outputs, Customers: grobe Landkarte des Umfangs |
| SPC | statistische Prozesslenkung (Statistical Process Control) |
| VOC | Stimme des Kunden (Voice of the Customer) |
| WECO-Regeln | Western-Electric-Regeln für nicht zufällige Muster auf Regelkarten [15] |
| x-quer/R-Karte | Regelkarten für Stichprobenmittelwerte und Spannweiten [14] |
| Yellow Belt | Teammitglied mit Six-Sigma-Grundausbildung |

## Häufige Fragen (FAQ)

### Was ist Six Sigma einfach erklärt?

Six Sigma ist eine Methode, um Fehler zu verringern, indem man Streuung verringert. Ein Team misst, wie ein Prozess arbeitet, belegt mit Daten, warum er Fehler erzeugt, beseitigt die Ursachen und richtet Lenkungsmaßnahmen ein, damit das Problem nicht zurückkommt. Der Name kommt vom statistischen Ziel, sechs Standardabweichungen zwischen Prozessmittelwert und nächstgelegene Toleranzgrenze zu bringen.

### Was sind die 5 Phasen von DMAIC?

Define (Problem, Ziel, Umfang), Measure (Ausgangswert und Messsystem), Analyze (verifizierte Grundursachen), Improve (getestete Lösungen) und Control (den Gewinn mit Lenkungsplänen, SPC und Standards halten) [1][10].

### Was bedeuten 3,4 Fehler pro Million, und warum heißt das Six Sigma?

Die ASQ definiert Six-Sigma-Qualität als 3,4 Fehler pro Million Möglichkeiten unter Berücksichtigung einer Verschiebung des Mittelwerts um 1,5 Sigma [1]. Von einem Prozess mit kurzfristig sechs Standardabweichungen zwischen Mittelwert und Grenze wird angenommen, dass er mit der Zeit um 1,5 Sigma driftet; die verbleibenden 4,5 Sigma lassen einen einseitigen Rand von 3,4 pro Million. Ohne den Shift würde ein zentrierter Six-Sigma-Prozess etwa 0,002 pro Million erzeugen.

### Wie berechnet man das Sigma-Niveau?

DPMO = Fehler ÷ (Einheiten × Möglichkeiten) × 1.000.000 berechnen. Dann ist das Sigma-Niveau = NORM.S.INV(1 − DPMO ÷ 1.000.000) + 1,5. Beispiel: 46 Fehler bei 5.000 Einheiten mit je 8 Möglichkeiten ergeben DPMO = 1.150 und ein Sigma-Niveau von etwa 4,55.

### Was ist der 1,5-Sigma-Shift, und ist er gültig?

Er ist eine Konvention, die die Langzeitdrift des Prozessmittelwerts als 1,5 Standardabweichungen abbildet. Er hat eine dünne empirische Grundlage und wurde kritisiert, vor allem von Donald Wheeler [5]. Ihn nur für die Umrechnung in die konventionelle Sigma-Tabelle nutzen und immer angeben, wenn er angewandt wurde.

### Was ist der Unterschied zwischen Cp und Cpk?

Cp vergleicht die Toleranzbreite mit der Prozessstreuung und ignoriert, wo der Prozess liegt. Cpk berücksichtigt auch die Lage: Er verwendet den Abstand vom Mittelwert zur näheren Toleranzgrenze. Ist Cp hoch und Cpk niedrig, den Prozess zentrieren; sind beide niedrig, die Streuung verringern [7].

### Welcher Cpk-Wert ist gut?

Das NIST-Beispiel nennt mindestens 1,0 als minimalen Wunsch [7]. In der Industrie sind 1,33 ein verbreitetes Minimum für die laufende Serie und 1,67 für neue Prozesse bei der Freigabe von Automobilzulieferern, entscheidend sind aber die Kundenanforderungen [unbelegt: siehe Abschnitt Prozessfähigkeit].

### Was ist eine Ursachenanalyse (Root Cause Analysis)?

Die ASQ beschreibt die Ursachenanalyse als Sammelbegriff für Ansätze, Werkzeuge und Techniken, mit denen die Ursachen von Problemen aufgedeckt werden, und die Grundursache als den Faktor, der eine Abweichung verursacht hat und dauerhaft beseitigt werden sollte [6]. In der Praxis heißt das: die zugrunde liegende Ursache eines Problems finden und diese beseitigen statt des Symptoms.

### Welche Schritte hat eine Ursachenanalyse?

Das Problem in Zahlen beschreiben, es eindämmen, wenn Kunden betroffen sind, Daten sammeln, mögliche Ursachen auflisten (Ishikawa, Ist/Ist-nicht), der Ursachenkette folgen (5 Why, Fehlerbaum), die Grundursache mit Belegen verifizieren, Korrekturmaßnahmen umsetzen, dann die Wirksamkeit prüfen und eine Wiederholung bei ähnlichen Produkten und Linien verhindern. Die Quellen zählen fünf bis acht Schritte; entscheidend ist die Reihenfolge.

### Gehört die Ursachenanalyse zu Six Sigma?

Ja. Die Analyze-Phase von DMAIC ist eine Ursachenanalyse, gestützt auf Daten aus der Measure-Phase und geprüft in der Improve-Phase. Die Ursachenanalyse wird auch außerhalb von Six Sigma genutzt: in 8D-Reports (D4), in der A3-Methode und bei CAPA in regulierten Branchen.

### Wie lange dauert eine Ursachenanalyse?

Das hängt vom Problem und vom Werkzeug ab. Eine 5-Why-Analyse bei einem einfachen Problem mit einer Ursachenkette dauert 15 bis 60 Minuten, ein Ishikawa-Workshop ein bis zwei Stunden, ein Fehlerbaum Tage, ein 8D Tage bis Wochen und ein DMAIC-Projekt Wochen bis Monate. Zeit für die Verifizierung einplanen: Dieser Schritt wird am häufigsten verkürzt.

### Welche Werkzeuge der Ursachenanalyse gibt es?

5 Why, Ishikawa-Diagramm (Fischgräte), Pareto-Diagramm, Ist/Ist-nicht-Analyse, Fehlerbaumanalyse, FMEA, statistische Tests und 8D als Rahmen. Die Auswahlmatrix in diesem Artikel zeigt, was zu welchem Problem passt.

### Wann 5 Why und wann Ishikawa-Diagramm?

Ein Ishikawa-Diagramm nutzen, wenn viele Ursachen möglich sind und strukturiert werden müssen. 5 Why nutzen, um einen verifizierten Ast bis zur Systemursache zu vertiefen. Bei allem Komplexen beide kombinieren: zuerst Ishikawa, dann 5 Why auf den Ästen, die die Daten stützen.

### Was ist die 8D-Methode, und wie unterscheidet sie sich von DMAIC?

8D ist eine Teammethode mit acht Disziplinen, verbreitet in der Automobilindustrie, mit Eindämmung (D3) vor der Ursachenanalyse (D4) [23]. Sie ist die Standardreaktion auf Kundenreklamationen. DMAIC ist eine längere, statistischere Projektmethode für chronische Probleme. Viele Unternehmen nutzen 8D für Reklamationen und DMAIC für die wiederkehrenden Probleme, die die 8D-Reports aufdecken.

### Was ist der Unterschied zwischen Lean und Six Sigma?

Lean konzentriert sich darauf, Verschwendung zu verringern und den Fluss zu verbessern; Six Sigma verringert Streuung und Fehler mit Statistik. Lean Six Sigma verbindet beides [1]. Faustregel: Ist die Ursache im Arbeitsablauf sichtbar, mit Lean beginnen; ist sie in den Daten versteckt, Six Sigma nutzen.

### Erst Lean oder erst Six Sigma lernen?

Für die meisten Menschen in der Produktion zuerst Lean. Lean-Prinzipien wie Fluss, Pull, Standardarbeit und 5S sind auf dem Shopfloor sichtbar und brauchen wenig Statistik, und viele Probleme verschwinden, sobald die Verschwendung weg ist. Six Sigma ergänzt dann die statistische Analyse für die Probleme, die in den Daten versteckt bleiben. Kombinierte Lean-Six-Sigma-Kurse lehren beides; welcher Nachweis zählt, hängt davon ab, was Arbeitgeber im eigenen Fachgebiet verlangen.

### Welche Six Sigma Belts gibt es?

Die üblichen Belt-Stufen sind White, Yellow, Green, Black und Master Black Belt, dazu Champions als Sponsoren. Green Belts leiten Projekte in Teilzeit, Black Belts leiten komplexe Projekte und coachen, Master Black Belts verantworten die Methode. Die Anforderungen sind nicht standardisiert; sie hängen von der Zertifizierungsstelle oder dem Arbeitgeber ab.

### Lohnt sich eine Six-Sigma-Zertifizierung?

Für Rollen in Qualität, KVP und Produktion ist ein Green oder Black Belt häufig Anforderung oder Pluspunkt. Einen Nachweis mit Prüfung wählen, idealerweise mit Projektpflicht (die ASQ verlangt für den Black Belt Projektnachweise [8]). Abgeschlossene Projekte mit bestätigten Ergebnissen zählen mehr als das Zertifikat.

### Was kostet eine Six-Sigma-Zertifizierung?

Die ASQ nennt 483 USD für die Green-Belt-Prüfung und 585 USD für die Black-Belt-Prüfung, mit 100 USD Rabatt für Mitglieder (November 2026) [25][8]. Die Schulung kommt hinzu und schwankt stark; in den USA finanzieren oder bezuschussen Arbeitgeber und NIST-MEP-Zentren sie häufig.

### Ist Six Sigma noch aktuell?

Ja, für chronische Qualitätsprobleme mit messbarer Streuung, und die hat jedes Werk. Geändert hat sich das Umfeld: mehr automatisch erfasste Daten, engere Verzahnung mit Lean und täglicher Führung und weniger Toleranz für große Expertenbürokratien. Der statistische Kern (SPC, Prozessfähigkeit, DoE, Hypothesentests) ist so gültig wie eh und je.

### Was ist DMADV?

DMADV (Define, Measure, Analyze, Design, Verify) ist der Fahrplan des Design for Six Sigma für neue Produkte oder Prozesse; er wird genutzt, wenn ein bestehender Prozess das Ziel durch Verbesserung nicht erreichen kann oder noch nicht existiert.

## Fazit und erste Schritte

Six Sigma ist drei Dinge zugleich: eine Kennzahl (Fehler pro Million Möglichkeiten und das Sigma-Niveau), eine Methode (DMAIC) und eine Organisation (Champions und Belts). Die Kennzahl ist von den dreien die unwichtigste und die am meisten missverstandene; der 1,5-Sigma-Shift ist eine Konvention, und ehrliches Berichten nutzt DPMO, ppm und Ppk mit angegebenen Definitionen. Der Wert liegt in der Methode, und ihr Zentrum ist die Analyze-Phase: eine Ursachenanalyse, die Ursachen mit Daten belegt, bevor jemand Geld für Lösungen ausgibt.

Die Werkzeuge sind alt und bewährt. Regelkarten unterscheiden gewöhnliche Streuung von Signalen. Fähigkeitsindizes zeigen, ob ein stabiler Prozess in die Toleranz passt. 5 Why, Ishikawa, Pareto, Ist/Ist-nicht und Fehlerbaum strukturieren die Suche nach Ursachen; 8D organisiert die Reaktion auf Kundenprobleme. Keines davon funktioniert, wenn das Messsystem nicht geprüft, die Grundursache nicht verifiziert oder die Control-Phase ausgelassen wird. Und keines davon funktioniert, wenn Werker als Ursache behandelt werden statt als die Menschen, die den Prozess am besten kennen.

**Erste Schritte in den nächsten 30 Tagen**

- [ ] Das Pareto von Ausschuss und Nacharbeit der letzten sechs Monate ziehen, nach Kosten, nicht nur nach Anzahl
- [ ] Aus den drei größten Balken ein chronisches, messbares Problem wählen und eine Problembeschreibung mit Zahlen und ohne Ursache schreiben
- [ ] Mit dem Werkscontroller vereinbaren, wie Einsparungen aus diesem Problem gezählt würden
- [ ] Das Messsystem für dieses Problem prüfen (Gage R&R oder attributive Übereinstimmung)
- [ ] Den Ausgangswert berechnen: Fehlerquote, DPMO und für ein Schlüsselmerkmal Cp und Cpk, nachdem die Stabilität auf einer Regelkarte geprüft wurde
- [ ] Einen Standard für die Ursachenanalyse alltäglicher Probleme einführen: ein 5-Why-Blatt mit einer Spalte "verifiziert?" und einer Frage nach der Schlupfursache
- [ ] Die letzten zehn abgeschlossenen Korrekturmaßnahmen durchsehen: Wie viele endeten bei "Bedienfehler" oder "nachgeschult"? Die wiedergekehrten erneut öffnen
- [ ] Die ersten Green-Belt-Kandidaten festlegen und jedem vor Schulungsbeginn ein beauftragtes Projekt geben
- [ ] Prüfen, welche Schulung und welches Coaching zu Six Sigma regional angeboten werden (in den USA: das NIST-MEP-Zentrum des Bundesstaats)

---

## Weiterlesen auf m365.fm

**Vertiefende Beiträge**
- [Lean vs. Six Sigma: Differences and How to Combine Them](https://www.m365.fm/community/u/mirko-p/blog/lean-vs-six-sigma-differences-combine/) (englisch)
- [Operational Excellence vs. Lean](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-vs-lean/) (englisch)
- [What Is a Gemba Walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/) (englisch)

**Glossarbegriffe (Entities)**
[Lean Six Sigma](https://www.m365.fm/entity/lean-six-sigma/) · [Lean Management](https://www.m365.fm/entity/lean-management/) · [Poka Yoke](https://www.m365.fm/entity/poka-yoke/) · [Standardarbeit](https://www.m365.fm/entity/standard-work/) · [A3-Methode](https://www.m365.fm/entity/a3-problem-solving/) · [Gemba Walk](https://www.m365.fm/entity/gemba-walk/) · [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/)

**Pillar-Leitfäden**
- [Operational Excellence](https://www.m365.fm/learn/operational-excellence/) (Hub für diesen Artikel)
- [Lean Management](https://www.m365.fm/learn/lean-management/)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)
- [Shop Floor Management und Gemba Walks](https://www.m365.fm/learn/shop-floor-management/)
- [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)
- [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/)
- [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/)
- [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/)
- [TPM und OEE](https://www.m365.fm/learn/tpm-oee/) (geplant)
- [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant)
- [Predictive Maintenance und IIoT](https://www.m365.fm/learn/predictive-maintenance-iiot/) (geplant)
- [Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant)
- [OT-Security und ISA/IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant)

**Cluster-Leitfäden (geplant)**
- [A3-Methode](https://www.m365.fm/learn/lean-management/a3-methode/) (geplant)
- [PDCA-Zyklus](https://www.m365.fm/learn/lean-management/pdca-zyklus/) (geplant)
- [Poka Yoke](https://www.m365.fm/learn/lean-management/poka-yoke/) (geplant)
- [Kaizen](https://www.m365.fm/learn/lean-management/kaizen/) (geplant)
- [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) (geplant)
- [Andon](https://www.m365.fm/learn/shop-floor-management/andon/) (geplant)
- [Process Mining in der Produktion](https://www.m365.fm/learn/digital-twin/process-mining-produktion/) (geplant)
- [Qualifikationsmatrix und Mitarbeiterqualifizierung](https://www.m365.fm/learn/operational-excellence/qualifikationsmatrix/) (geplant)

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Lean Management, Operational Excellence, Qualitätsmethoden und die digitale Transformation der Produktion, mit dem Schwerpunkt, wie Daten, Wertstrommodelle und Simulation Werken helfen, Probleme an der Wurzel zu lösen. [Redaktion: Rolle, Kurzbiografie und Foto ergänzen.]

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Quellen

Alle Quellen am 20. November 2026 geöffnet und geprüft, sofern nicht anders angegeben. Wettbewerberseiten aus der Wettbewerbsanalyse sind keine nummerierten Quellen.

1. What Is Six Sigma? American Society for Quality (ASQ). https://asq.org/quality-resources/six-sigma
2. Malcolm Baldrige National Quality Award 1988 Recipient: Motorola Inc., award profile. National Institute of Standards and Technology (NIST). https://www.nist.gov/system/files/documents/2017/10/11/1988_Motorola_Inc.pdf
3. Bill Smith (Motorola engineer). Wikipedia (unter Berufung auf Tennant 2001 und Archive der Motorola University). https://en.wikipedia.org/wiki/Bill_Smith_(Motorola_engineer)
4. General Electric Company: 1998 Annual Report, letter to share owners. Über das digitale Repositorium der Universitat Autònoma de Barcelona. https://ddd.uab.cat/pub/infanu/46826/iaGEa1998ieng.pdf
5. Six Sigma. Wikipedia (Abschnitte zu statistischer Grundlage, 1,5-Sigma-Shift, Marke, ISO 13053 und Kritik, unter Berufung auf Tennant 2001, Harry 1988, Gygi et al. 2005, Wheeler 2004, Morris/Fortune 2006, Chakravorty/WSJ 2010, Albliwi et al. 2014, Dodge 2007). https://en.wikipedia.org/wiki/Six_Sigma
6. What is Root Cause Analysis (RCA)? ASQ. https://www.asq.org/quality-resources/root-cause-analysis
7. NIST/SEMATECH e-Handbook of Statistical Methods, section 6.1.6: What is Process Capability? NIST. https://itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm
8. Six Sigma Black Belt Certification (CSSBB). ASQ. https://www.asq.org/cert/six-sigma-black-belt
9. Lean Six Sigma: IASSC Certified Black Belt (ICBB). PeopleCert. https://www.peoplecert.org/browse-certifications/Lean-Six-Sigma/IASSC-Lean-Six-Sigma-43/peoplecert-lean-six-sigma-iassc-certified-black-belt-icbb-3119
10. ISO 13053-1:2011, Quantitative methods in process improvement: Six Sigma, Part 1: DMAIC methodology. International Organization for Standardization. https://www.iso.org/standard/52901.html
11. The History of Six Sigma. iSixSigma. https://www.isixsigma.com/history/history-six-sigma/
12. NIST/SEMATECH e-Handbook of Statistical Methods, section 6.3.1: What are Control Charts? NIST. https://itl.nist.gov/div898/handbook/pmc/section3/pmc31.htm
13. Control Chart. ASQ. https://asq.org/quality-resources/control-chart
14. NIST/SEMATECH e-Handbook of Statistical Methods, section 6.3.2.1: Shewhart X-bar and R and S Control Charts (Konstanten A₂, D₃, D₄). NIST. https://itl.nist.gov/div898/handbook/pmc/section3/pmc321.htm
15. NIST/SEMATECH e-Handbook of Statistical Methods, section 6.3.2: What are Variables Control Charts? (Western-Electric-Regeln). NIST. https://itl.nist.gov/div898/handbook/pmc/section3/pmc32.htm
16. Root Cause Analysis (Lexikoneintrag). iSixSigma. https://www.isixsigma.com/dictionary/root-cause-analysis/
17. Quality Management System Regulation (QMSR). US Food and Drug Administration. https://www.fda.gov/medical-devices/postmarket-requirements-devices/quality-management-system-regulation-qmsr
18. 5 Whys. Lean Enterprise Institute, Lean Lexicon (unter Berufung auf Ohno 1988, S. 17). https://www.lean.org/lexicon-terms/5-whys/
19. Card, A. J.: The problem with "5 whys". BMJ Quality & Safety, Bd. 26, Nr. 8, S. 671 (Band, Heft und erste Seite wie in der Artikel-URL angegeben; Erscheinungsjahr und DOI im abgerufenen Text nicht angezeigt). https://qualitysafety.bmj.com/content/26/8/671
20. Fishbone Diagram. ASQ. https://asq.org/quality-resources/fishbone
21. Pareto Chart. ASQ (nach *The Quality Toolbox*, ASQ Quality Press). https://asq.org/quality-resources/pareto
22. Fault tree analysis. Wikipedia (Geschichte: Bell Laboratories 1962, Boeing, NUREG-0492 1981, NASA 2002, IEC 61025; Gatterformeln). https://en.wikipedia.org/wiki/Fault_tree_analysis
23. Eight Disciplines (8D). ASQ. https://asq.org/quality-resources/eight-disciplines-8d
24. Eight disciplines problem solving. Wikipedia (Ford TOPS 1987, Global 8D, D0; unter Berufung auf Pruitt, Quality Progress 2019, und Ford-Unterlagen). https://en.wikipedia.org/wiki/Eight_disciplines_problem_solving
25. Six Sigma Green Belt Certification (CSSGB). ASQ. https://asq.org/cert/six-sigma-green-belt
26. Master Black Belt Certification (CMBB). ASQ. https://www.asq.org/cert/master-black-belt
27. Six Sigma certifications overview (CSSYB, CSSGB, CSSBB, CMBB). ASQ. https://www.asq.org/cert/six-sigma
28. Ergonomics. Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/ergonomics
29. Juran, J. M.: The Non-Pareto Principle (Setting the Record Straight), 1974. Juran Institute (PDF). https://www.juran.com/wp-content/uploads/2021/03/The-Non-Pareto-Principle-1974.pdf (abgerufen am 20. November 2026)
30. Albliwi, S.; Antony, J.; Lim, S. A. H.; van der Wiele, T.: Critical failure factors of Lean Six Sigma: a systematic literature review. International Journal of Quality & Reliability Management 31 (9), 2014, S. 1012–1030. DOI: 10.1108/IJQRM-09-2013-0147. https://emerald.com/insight/content/doi/10.1108/IJQRM-09-2013-0147/full/html (Abstract; abgerufen am 20. November 2026)
31. Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement (abgerufen am 20. November 2026)
32. Is my measurement system acceptable? Minitab Support (Herstellerdokumentation mit Zusammenfassung der AIAG-Richtlinien). https://support.minitab.com/en-us/minitab/help-and-how-to/quality-and-process-improvement/measurement-system-analysis/supporting-topics/gage-r-r-and-wheeler-s-emp-studies/is-my-measurement-system-acceptable/ (abgerufen am 20. November 2026)
33. Corrective actions, corrections and preventive actions (ISO 13485 clauses 8.5.2 and 8.5.3). Johner Institute blog. https://blog.johner-institute.com/quality-management-iso-13485/corrective-actions-corrections-und-preventive-actions/ (abgerufen am 20. November 2026)

# Prüfhinweise für die Redaktion

**Herstellerangaben und Selbstauskünfte**

1. Die Einsparungen und Black-Belt-Zahlen von GE [4] sind Unternehmensangaben aus einem Geschäftsbericht und im Text als solche gekennzeichnet.
2. Das Ziel von 3,4 pro Million bei Motorola stammt aus dem NIST-Preisträgerprofil [2]; Motorolas eigene Einsparzahlen (iSixSigma nennt "mehr als 16 Milliarden Dollar" [11]) wurden bewusst nicht verwendet, weil sie Selbstauskünfte und auf jener Seite unbelegt sind.
3. Zertifizierungsgebühren und -formate [8][9][25][26] sind Angaben der Anbieter, Stand 20. November 2026; sie ändern sich, vor Veröffentlichung erneut prüfen.
4. Kein Herstellerprodukt wird empfohlen. Minitab, JMP, R/Python, Excel und Power BI sind nur als Beispiele gängiger Werkzeuge genannt. iFAKT wird im Text nicht erwähnt (kein Abschnitt dieses Themas braucht ein Softwarebeispiel); die Autorenbox trägt die Offenlegung.

**[unbelegt]-Stellen und offene Punkte**

1. Phasendauern DMAIC (Überblickstabelle) und Dauern im Fahrplan: Erfahrungswerte, als [unbelegt] markiert.
2. Gage-R&R-Annahme (10 % / 30 %): über die Minitab-Dokumentation der AIAG-Richtlinien belegt [32] (sekundär, Hersteller); der Text verweist auf die aktuelle Ausgabe des AIAG-MSA-Handbuchs.
3. Schwellen Cpk 1,33 / Ppk 1,67: übliche AIAG/PPAP-Praxis, nicht an den Handbüchern geprüft; im Abschnitt Prozessfähigkeit und in der FAQ als [unbelegt] markiert.
4. AIAG & VDA FMEA-Handbuch (2019), Aufgabenpriorität: online nicht geprüft; [unbelegt].
5. Problemlösungsabschnitt IATF 16949, Korrekturmaßnahmen AS9100, SAE AS13000: alle drei [unbelegt]; die Qualitätsleitung soll die Abschnittsverweise bestätigen.
6. 8D-Reaktionszeiten (D3 innerhalb von 24 Stunden): kundenspezifisch, [unbelegt].
7. NIST-MEP-Angebote: Six Sigma unter den MEP-Methoden belegt [31]; ob ein bestimmtes Zentrum Belt-Schulungen anbietet, bleibt [unbelegt].
8. Card [19]: Jahr und DOI vor Veröffentlichung von der BMJ-Seite ergänzen.
9. Wikipedia-Quellen [3][5][22][24] möglichst durch die Primärdokumente ersetzen (NUREG-0492 und das NASA-Handbuch sind öffentlich).
10. Alle Rechenbeispiele (Ventilgehäuse, Lieferant, Kosten) sind Beispielwerte und sollten als Beispielkästen abgesetzt werden. Die Zahlen sind aus der englischen Fassung unverändert übernommen (dort am 20. November 2026 nachgerechnet); in der deutschen Fassung wurde nur das Zahlenformat umgestellt.
11. Excel-Formeln: Im deutschen Excel heißt `NORM.S.DIST` `NORM.S.VERT`; `NORM.S.INV` heißt gleich. Dezimalkomma in den Formeln (z. B. `+1,5`) entspricht dem deutschen Excel.

**Interne Links**

Alle `/en/learn/`-Links der englischen Fassung sind auf die deutschen URLs laut Slug-Map umgestellt: Operational Excellence (Hub), Lean Management, Produktionskennzahlen, Shop Floor Management, Produktionsplanung Luftfahrt, Digital Twin, Manufacturing IT Azure; neue Pillars MES/ISA-95, Predictive Maintenance/IIoT, Theory of Constraints, OT-Security, TPM/OEE (geplant); Cluster A3-Methode, PDCA-Zyklus, Poka Yoke, Kaizen, Standardarbeit, Andon, Process Mining, Qualifikationsmatrix (geplant). Links auf `/entity/` und `/community/` unverändert; die Blogbeiträge sind englisch und als solche gekennzeichnet. Alle "(geplant)"-Links nach Veröffentlichung der Zielseiten aktivieren. Abgleich mit dem deutschen Lean-Management-Pillar: dort unter "DMAIC in Kürze" auf diesen Artikel verlinken (Empfehlung aus der englischen Fassung).

**JSON-LD-Vorschlag**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "headline": "Six Sigma und Ursachenanalyse (Root Cause Analysis): DMAIC, Werkzeuge und Berechnungen für die Produktion",
      "inLanguage": "de-DE",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-26",
      "dateModified": "2026-11-26",
      "mainEntityOfPage": "https://www.m365.fm/learn/six-sigma-ursachenanalyse/",
      "about": [
        {"@type": "Thing", "name": "Six Sigma"},
        {"@type": "Thing", "name": "DMAIC"},
        {"@type": "Thing", "name": "Ursachenanalyse"}
      ],
      "mentions": [
        {"@type": "Thing", "name": "Lean Six Sigma", "sameAs": "https://www.m365.fm/entity/lean-six-sigma/"},
        {"@type": "Thing", "name": "Poka Yoke", "sameAs": "https://www.m365.fm/entity/poka-yoke/"},
        {"@type": "Thing", "name": "A3-Methode", "sameAs": "https://www.m365.fm/entity/a3-problem-solving/"},
        {"@type": "Thing", "name": "Statistische Prozesslenkung"},
        {"@type": "Thing", "name": "Prozessfähigkeitsindex"},
        {"@type": "Thing", "name": "8D-Methode"},
        {"@type": "Thing", "name": "Fehlerbaumanalyse"}
      ]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "de-DE",
      "mainEntity": [
        {"@type": "Question", "name": "Was sind die 5 Phasen von DMAIC?", "acceptedAnswer": {"@type": "Answer", "text": "Define (Problem, Ziel, Umfang), Measure (Ausgangswert und Messsystem), Analyze (verifizierte Grundursachen), Improve (getestete Lösungen) und Control (den Gewinn mit Lenkungsplänen, SPC und Standards halten)."}}
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Start", "item": "https://www.m365.fm/"},
        {"@type": "ListItem", "position": 2, "name": "Learn", "item": "https://www.m365.fm/learn/"},
        {"@type": "ListItem", "position": 3, "name": "Six Sigma und Ursachenanalyse", "item": "https://www.m365.fm/learn/six-sigma-ursachenanalyse/"}
      ]
    }
  ]
}
```

Alle 21 FAQ-Fragen in `FAQPage` aufnehmen (Antworttext ohne [n]-Verweise). Datum (`datePublished`) an den tatsächlichen Veröffentlichungstag anpassen.

**Empfohlene Grafiken** (aus der englischen Fassung, Beschriftungen auf Deutsch)

1. Normalverteilung mit Toleranzgrenzen, 6σ kurzfristig und um 1,5σ verschobener Mittelwert (beschriftet als "Konvention").
2. DMAIC-Zyklus mit Gate-Reviews und den wichtigsten Werkzeugen je Phase.
3. Pareto-Diagramm der 160 Dichtheitsausfälle (Balken plus kumulierte Linie auf zweiter Achse).
4. x-quer/R-Karte des Bohrungsbeispiels mit OEG/UEG und einem Signal nach WECO-Regel 4.
5. Ishikawa-Diagramm zur Porosität mit sechs Kategorien.
6. Fehlerbaum "undichtes Gehäuse wird geliefert" mit zwei ODER-Eingängen und einem UND-Gatter, mit Wahrscheinlichkeiten.
7. Entscheidungsbaum "PDCA, A3, 8D oder DMAIC?".

**hreflang**

`de-DE` https://www.m365.fm/learn/six-sigma-ursachenanalyse/ und `en-US` https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/ gegenseitig verknüpfen (jeweils selbstreferenzierendes Canonical plus beide hreflang-Einträge). Die englische Fassung trägt bisher den Hinweis "keine deutsche Version, kein hreflang-Paar"; dort nachziehen.

**Offenlegung**

Die Autorenbox trägt exakt "Hinweis: Der Autor arbeitet bei der iFAKT GmbH."; keine Kennzeichnung als "gesponsert", kein `rel="sponsored"`.

**Für den deutschen Markt prüfen** (Aufgabe für die Fachprüfung; im Text nicht als Fakt ergänzt)

1. Abschnitt "SPC auf dem Shopfloor" und "Kritik, 7. Auswirkungen auf die Belegschaft": Der Text spricht von Gewerkschaften (US-Kontext). In Deutschland ist bei technischer Leistungs- und Verhaltenskontrolle (automatische SPC, Maschinendaten je Werker) die Mitbestimmung des Betriebsrats nach § 87 Abs. 1 Nr. 6 BetrVG zu prüfen; ggf. Betriebsvereinbarung.
2. Abschnitt "'Bedienfehler' ist keine Grundursache": OSHA-Aufzeichnungspflichten sind US-Recht. Deutsche Entsprechung (Unfallanzeige an die Berufsgenossenschaft, DGUV-Vorschriften, ArbSchG) prüfen.
3. Abschnitt "CAPA in regulierten Branchen": FDA/QMSR ist US-Recht. Für Medizinprodukte in der EU MDR (Verordnung (EU) 2017/745) und ISO 13485 prüfen; IATF 16949 und AS9100/EN 9100 gelten international.
4. Abschnitt "Zertifizierung": ASQ und IASSC sind US-/international ausgerichtet. Ob deutsche Anbieter und Normen (z. B. DIN ISO 13053, TÜV- oder DGQ-Zertifikate) genannt werden sollen, redaktionell entscheiden; Gebühren in USD bleiben.
5. Abschnitt "Finanzierung" und Fahrplan: NIST MEP ist ein US-Programm. Deutsche Förderangebote (z. B. Mittelstand-Digital-Zentren, Landesförderung) nur nach Prüfung ergänzen.
6. Messsystemanalyse: In deutschen Werken wird häufig nach VDA Band 5 bzw. Herstellerleitfäden (z. B. Bosch Heft 10) gearbeitet; prüfen, ob ein Hinweis darauf ergänzt werden soll.
7. Abschnitt "Kritik, 7.": Ergonomie-Ressourcen der OSHA [28] sind US-Kontext; deutsche Entsprechung (z. B. DGUV, BAuA) prüfen.

**Fachliche Prüfung**

Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.
