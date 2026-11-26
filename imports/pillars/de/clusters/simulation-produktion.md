# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Simulation Produktion: Materialflusssimulation mit DES (54 Zeichen) |
| Meta-Description | Simulation in der Produktion erklärt: wie ereignisdiskrete Simulation funktioniert, wann sie sich lohnt, Rechenbeispiel, Validierung und Tools. (145 Zeichen) |
| Slug | `/learn/digital-twin/simulation-produktion/` (vollständige URL: https://www.m365.fm/learn/digital-twin/simulation-produktion/) |
| Parent-Pillar | [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/) |
| Hauptkeyword | Simulation Produktion |
| Nebenkeywords | Materialflusssimulation, ereignisdiskrete Simulation, Fabriksimulation, Produktionssimulation, Simulationsmodell, Ablaufsimulation, Verifikation und Validierung Simulation, Einschwingphase, Simulationsläufe, Konfidenzintervall, Simulationssoftware Produktion, Plant Simulation, AnyLogic, Simio, FlexSim, Arena, SimPy, JaamSim, VDI 3633, Wertstromsimulation, dynamische Wertstromanalyse |
| Suchintention | Informational mit kommerziellem Anteil. Gesucht wird, was Simulation in der Produktion und ereignisdiskrete Simulation (DES) sind, wie ein Modell funktioniert, wie belastbar die Ergebnisse sind und welche Tools es gibt. |
| Wortzahl | 4.978 Wörter (`wc -w` H1 bis Fazit; englische Fassung: 5.203) |
| Sprachversion | `de-DE`. hreflang-Paar: `de-DE` https://www.m365.fm/learn/digital-twin/simulation-produktion/ <-> `en-US` https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus.

---

# Simulation in der Produktion: So funktioniert ereignisdiskrete Simulation, mit Rechenbeispiel

*Stand: 20. November 2026 · Teil des Leitfadens [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/)*

> **Kurzantwort:** Simulation in der Produktion heißt, ein ausführbares Computermodell eines Produktionssystems zu nutzen, um Entscheidungen zu testen, bevor sie auf dem Shopfloor umgesetzt werden. Die meisten Fragen im Werk (Ausbringung, Durchlaufzeit, Umlaufbestand, Puffergrößen, Personalbedarf, Engpässe) beantwortet die **ereignisdiskrete Simulation (Discrete Event Simulation, DES)**. Sie springt von Ereignis zu Ereignis (ein Auftrag kommt an, ein Arbeitsgang endet, eine Maschine fällt aus) und bildet Zufall ab. Ein DES-Modell ist nur dann nützlich, wenn es verifiziert und validiert ist und mit so vielen Simulationsläufen gerechnet wird, dass sich Konfidenzintervalle für die Ergebnisse angeben lassen.

Dieser Fachartikel gehört zu unserem Leitfaden [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/), der Simulation zwischen digitalem Modell, digitalem Schatten und digitalem Zwilling einordnet. Hier geht es um eine einzige Frage: Wie baut man ein Simulationsmodell, dem man genug vertraut, um damit einen Investitionsantrag, einen Personalplan oder ein neues Pufferlayout freizugeben?

Im Folgenden steht, wie eine DES-Engine durch die Zeit läuft, welche Daten sie braucht, wie man prüft, ob das Modell stimmt, und wie viele Läufe nötig sind, bevor ein Unterschied zwischen zwei Szenarien echt ist. Alles wird an einem kleinen Modell gezeigt, dessen Zahlen sich nachrechnen lassen.

### Das Wichtigste in Kürze

- **Ereignisdiskrete Simulation** ist die Standardmethode für Fragen aus Produktion und Logistik: Aufträge, Maschinen, Puffer, Menschen und Störungen als Ereignisse über die Zeit, mit zufälliger Streuung [1][2][5].
- Kapazitätstabellen rechnen mit Mittelwerten und übersehen Warteschlangen durch Streuung, Blockieren und Störungen. Im Beispiel sagt die Tabelle bei 93 % effektiver Auslastung "passt"; die Simulation zeigt fast drei Stunden Durchlaufzeit für 21 Minuten Bearbeitung.
- **Verifikation** fragt: "Haben wir das Modell richtig gebaut?" **Validierung** fragt: "Haben wir das richtige Modell gebaut?" Beides ist nötig, und es sind zwei verschiedene Schritte [3].
- Berichtet werden **Mittelwerte mit Konfidenzintervallen** aus mehreren **Simulationsläufen (Replikationen)**, und die **Einschwingphase (Warm-up)**, in der sich das Modell füllt, wird abgeschnitten [1][2]. Ohne Einschwingphase wird die Durchlaufzeit im Beispiel um rund 44 % unterschätzt.
- Im Beispiel verkürzt die halbierte Reparaturzeit am Engpass die Durchlaufzeit um rund 59 Minuten; ein dreimal so großer Puffer bringt eine Verkürzung, die sich nicht von null unterscheiden lässt.

## Inhaltsverzeichnis

1. [Was ist Simulation in der Produktion?](#1-was-ist-simulation-in-der-produktion)
2. [Wie funktioniert ereignisdiskrete Simulation?](#2-wie-funktioniert-ereignisdiskrete-simulation)
3. [Wann sich Fabriksimulation lohnt und wann eine Tabelle reicht](#3-wann-sich-fabriksimulation-lohnt-und-wann-eine-tabelle-reicht)
4. [Rechenbeispiel: ein DES-Modell mit zwei Stationen](#4-rechenbeispiel-ein-des-modell-mit-zwei-stationen)
5. [Verifikation und Validierung Schritt für Schritt](#5-verifikation-und-validierung-schritt-für-schritt)
6. [Eingangsdaten: woher sie kommen und wie man sie modelliert](#6-eingangsdaten-woher-sie-kommen-und-wie-man-sie-modelliert)
7. [Simulationssoftware für die Produktion im Vergleich](#7-simulationssoftware-für-die-produktion-im-vergleich)
8. [Simulation, Wertstrom, Process Mining und Digital Twin](#8-simulation-wertstrom-process-mining-und-digital-twin)
9. [Typische Fehler](#9-typische-fehler)
10. [FAQ](#10-faq)
11. [Fazit](#11-fazit)

## 1. Was ist Simulation in der Produktion?

Simulation in der Produktion, auch Fabriksimulation, Produktionssimulation oder Materialflusssimulation genannt, bildet einen Fertigungsprozess mit Software im Rechner ab und spielt ihn durch, bevor jemand den realen Prozess verändert.

Die Richtlinie VDI 3633 Blatt 1, eine seit Langem etablierte Methodenreferenz für die Simulation von Produktions- und Logistiksystemen, definiert Simulation als das Nachbilden eines Systems mit seinen dynamischen Prozessen in einem experimentierbaren Modell, um zu Erkenntnissen zu gelangen, die auf die Wirklichkeit übertragbar sind [5]. Die US-Standardlehrbücher, Laws *Simulation Modeling and Analysis* (6. Auflage, 2024) [1] sowie *Discrete-Event System Simulation* von Banks, Carson, Nelson und Nicol [2], behandeln dasselbe Feld mit starkem statistischem Schwerpunkt.

In der Produktion steht "Simulation" für mehrere Dinge, die man auseinanderhalten sollte:

| Art | Was modelliert wird | Typische Frage | Zeitbehandlung |
|---|---|---|---|
| Ereignisdiskrete Simulation (DES) | Aufträge, Teile, Maschinen, Puffer, Werker, Störungen | Schafft die Linie 5 Teile pro Stunde, und welche Durchlaufzeit und welcher Umlaufbestand ergeben sich? | springt von Ereignis zu Ereignis |
| Agentenbasierte Simulation | autonome Agenten mit Regeln (AMR, Menschen) | Wie verhalten sich 12 mobile Roboter in gemeinsam genutzten Gängen? | ereignis- oder zeitschrittgesteuert |
| System Dynamics | Bestände, Flüsse, Rückkopplungsschleifen | Wie wirkt ein Kapazitätsausbau über fünf Jahre mit der Nachfrage zusammen? | kontinuierlich, aggregiert |
| 3D-Bewegungs- und Robotersimulation | Kinematik, Reichweite, Kollisionen | Erreicht der Roboter jeden Schweißpunkt innerhalb der Taktzeit? | feine Zeitschritte |
| Prozess- bzw. Physiksimulation | Wärme, Spannung, Strömung in Bauteil oder Werkzeug | Füllt sich die Gussform vollständig? | numerische Löser |

Dieser Artikel behandelt DES, die Art, die bei fast jeder Frage auf Werksebene gemeint ist. Der übergeordnete Leitfaden vergleicht alle Ansätze ([Abschnitt 6](https://www.m365.fm/learn/digital-twin/)).

Die Methode hat eine lange Forschungsgeschichte: Das Archiv der Winter Simulation Conference enthält Volltexte zurück bis 1968 [4], darunter viele zur Erkennung der Einschwingphase, zur Ergebnisanalyse und zur Validierung.

## 2. Wie funktioniert ereignisdiskrete Simulation?

Ein DES-Modell beschreibt das System als Menge von **Entitäten** (Teile, Aufträge), **Ressourcen** (Maschinen, Werker, Stapler), **Warteschlangen und Puffern** sowie **Ereignissen**, die den Systemzustand ändern. Zwischen zwei Ereignissen ändert sich nichts, deshalb muss die Engine nicht jede Sekunde berechnen. Sie führt eine nach Zeit sortierte **Ereignisliste**, nimmt das nächste Ereignis, aktualisiert den Zustand und plant neue Ereignisse ein [1][2].

Für eine einzelne Maschine:

1. **08:00 Uhr, Ankunft.** Die Maschine ist frei, also beginnt die Bearbeitung. Die Engine zieht eine Bearbeitungszeit (etwa 9,4 Minuten) und plant ein Ende-Ereignis für 08:09,4 ein.
2. **08:03 Uhr, Ankunft.** Die Maschine ist belegt; das Teil wartet (Warteschlangenlänge 1).
3. **08:09,4 Uhr, Ende.** Das erste Teil verlässt die Maschine; das wartende Teil beginnt und bekommt sein eigenes Ende-Ereignis.
4. **08:47 Uhr, Störung.** Die Restbearbeitungszeit wird gespeichert, und ein Reparaturereignis mit zufälliger Reparaturdauer wird eingeplant.

Drei Zutaten machen das nützlich:

- **Zufall.** Zwischenankunftszeiten, Bearbeitungs-, Ausfall- und Reparaturzeiten stammen aus Wahrscheinlichkeitsverteilungen. Dadurch entstehen Warteschlangen, auch wenn die mittlere Auslastung unter 100 % liegt.
- **Wechselwirkung.** Eine Maschine kann **hungern** (kein Material am Eingang) oder **blockiert** sein (Ausgangspuffer voll). Gemeinsam genutzte Ressourcen, etwa ein Einrichter für vier Maschinen, erzeugen Abhängigkeiten, die Mittelwerte nicht abbilden können.
- **Statistik.** Die Engine erfasst zeitgewichtete Größen (Umlaufbestand, Auslastung) und Werte je Teil (Durchlaufzeit). Jeder Lauf verwendet andere Zufallszahlen, deshalb schwanken die Ergebnisse.

## 3. Wann sich Fabriksimulation lohnt und wann eine Tabelle reicht

Eine Kapazitätstabelle teilt Bedarf mal Bearbeitungszeit durch die verfügbare Zeit; unter 100 % wirkt der Plan machbar. Die Warteschlangentheorie zeigt, warum das in die Irre führt: Die Wartezeit wächst nichtlinear mit der Auslastung. Die Kingman-Näherung macht das sichtbar [6]: In der Tabelle des übergeordneten Leitfadens steigt die mittlere Wartezeit vor einer 10-Minuten-Station von etwa 23 Minuten bei 70 % Auslastung auf etwa 190 Minuten bei 95 % ([Leitfaden, Abschnitt 6](https://www.m365.fm/learn/digital-twin/)). **Littles Gesetz** (Umlaufbestand = Durchsatz × Durchlaufzeit) [7] sagt, welche Durchlaufzeit zu einem bestimmten Umlaufbestand gehört, aber nicht, welchen Umlaufbestand ein bestimmtes Maß an Streuung erzeugt.

Simulation lohnt sich, wenn mindestens einer dieser Punkte zutrifft:

- die Auslastung einer Schlüsselressource liegt über etwa 80 % (eine Faustregel aus der Warteschlangenkurve, keine Norm) und die Streuung ist spürbar (Störungen, Variantenmix, Rüstvorgänge)
- Stationen beeinflussen sich über begrenzte Puffer, gemeinsame Werker, Krane, FTS oder Losbildungsregeln
- Steuerungsregeln sollen verglichen werden (Losgrößen, Reihenfolgen, Kanban-Regelkreise, CONWIP-Grenzen)
- die Entscheidung ist so teuer, dass eine falsche Antwort mehr kostet als die Studie

Typische Einsätze im Werk sind Was-wäre-wenn-Fragen, die gestellt werden, bevor Geld ausgegeben wird:

- Engpässe erkennen und testen, wie sich die Ausbringung am Engpass steigern lässt
- Varianten von Fabriklayout und Materialfluss vergleichen, einschließlich Förderstrecken und FTS-Routen
- Ressourcenzuordnung: Personal je Schicht, Einrichter, Anzahl der Arbeitsplätze
- eine Automatisierungs- oder Anlageninvestition vor der Bestellung prüfen
- sehen, wie ein neuer Produktmix oder eine Nachfrageänderung Taktzeiten, Durchlaufzeit und Umlaufbestand beeinflusst

Der Nutzen liegt nicht in der Animation. Er liegt in einem datenbasierten Vergleich von Optionen statt Bauchgefühl, mit ausgewiesener Unsicherheit für jedes Ergebnis.

Auf Simulation verzichten sollte man, wenn eine geschlossene Formel die Frage beantwortet, wenn sich kritische Eingangsdaten nicht erheben lassen oder wenn niemand die Entscheidung aufgeschrieben hat, die das Modell unterstützen soll (dann wird daraus ein Animationsprojekt).

## 4. Rechenbeispiel: ein DES-Modell mit zwei Stationen

Das Modell ist bewusst klein, damit sich jede Zahl prüfen lässt. Wir haben es als Python-Skript mit eigener Ereignisliste gebaut (etwa 150 Zeilen); jedes DES-Tool aus Abschnitt 7 kann es nachbilden. Alle Parameter sind veranschaulichende Annahmen, keine Messwerte aus einem Werk.

### 4.1 Das System und die Frage

Eine Bearbeitungszelle versorgt eine Montagestation:

| Element | Annahme |
|---|---|
| Auftragsfreigaben | im Mittel ein Teil alle 12 Minuten (5 Teile pro Stunde), zufällig (exponentialverteilte Zwischenankunftszeiten) |
| Station A (mechanische Bearbeitung) | mittlere Bearbeitungszeit 10,0 min, lognormal, Variationskoeffizient 0,5 |
| Puffer zwischen A und B | 5 Teile; ist er voll, ist A blockiert |
| Station B (Montage) | mittlere Bearbeitungszeit 10,5 min, lognormal, Variationskoeffizient 0,5 (der Engpass der Zelle) |
| Störungen an B | mittlere Zeit zwischen Ausfällen (MTBF) 480 min, mittlere Reparaturzeit (MTTR) 30 min (beide exponentialverteilt) |
| Betrieb | durchgehend (24/7), um das Beispiel kurz zu halten; ein reales Modell ergänzt einen Schichtkalender |

**Die Frage der Werksleitung:** Die Durchlaufzeit ist zu lang. Sollen wir (a) den Puffer von 5 auf 15 vergrößern, (b) die mittlere Reparaturzeit an B mit einem Ersatzteilset und einem zweiten geschulten Instandhalter von 30 auf 15 Minuten senken oder (c) die Bearbeitungszeit an B mit einer geänderten Vorrichtung auf 9,5 Minuten verkürzen?

### 4.2 Was die Tabelle sagt

Belastung von B = 5 Teile/h × 10,5 min = 52,5 min Arbeit pro Stunde = 87,5 % belegt. Verfügbarkeit von B = MTBF / (MTBF + MTTR) = 480 / 510 = 94,1 %. Effektive Auslastung = 87,5 % / 94,1 % = 93 %. Station A liegt bei 5 × 10 / 60 = 83 %. Alles liegt unter 100 %, also sagt die Tabelle, die Zelle "passt", und über die Durchlaufzeit kann sie nichts sagen.

### 4.3 Versuchsplan

- **Laufzeit:** 30 simulierte Tage je Lauf.
- **Einschwingphase:** 5 Tage werden verworfen, bevor die Statistik beginnt (das Modell startet leer).
- **Replikationen:** 20 unabhängige Läufe mit unterschiedlichen Startwerten (Seeds) für die Zufallszahlen. Dieselben Seeds werden in jedem Szenario wiederverwendet (Common Random Numbers), sodass der Vergleich gepaart ist.
- **Ergebnisgrößen:** Durchsatz (Teile pro Stunde), mittlere Durchlaufzeit (Freigabe bis Fertigstellung an B), mittlerer Umlaufbestand, Belegungsanteil von B.

### 4.4 Ergebnisse für den Ausgangsfall

| Ergebnisgröße (Ausgangsfall, 20 Läufe) | Mittelwert | 95-%-Konfidenzintervall |
|---|---|---|
| Durchsatz | 4,98 Teile/h | ±0,04 |
| Mittlere Durchlaufzeit | 166,5 min | ±20,1 |
| Mittlerer Umlaufbestand | 13,8 Teile | ±1,8 |
| Belegungsanteil von B (Bearbeitung, ohne Stillstand) | 87 % | ±1 |

Das Konfidenzintervall berechnet sich als Mittelwert ± t × s / √n, mit n = 20 Läufen, t = 2,093 (Student-t-Verteilung, 19 Freiheitsgrade, 95 %) und s als Standardabweichung über die Läufe. Für die Durchlaufzeit ist s = 42,95 min, die halbe Intervallbreite also 2,093 × 42,95 / √20 = 20,1 min.

Der Durchsatz entspricht dem Bedarf, eine Durchsatzkennzahl zeigt also kein Problem. Das Problem erscheint erst in Durchlaufzeit und Umlaufbestand: Aus 20,5 Minuten Bearbeitung werden fast drei Stunden Durchlaufzeit. Der Belegungsanteil von B stimmt mit der Handrechnung überein (87,5 %), eine der Verifikationsprüfungen in Abschnitt 5.

### 4.5 Szenariovergleich

| Szenario | Mittlere Durchlaufzeit | Differenz zum Ausgangsfall (gepaart, 95-%-KI) | Mittlerer Umlaufbestand | Signifikant? |
|---|---|---|---|---|
| Ausgangsfall (Puffer 5, MTTR 30, B = 10,5 min) | 166,5 min | entfällt | 13,8 | entfällt |
| (a) Puffer 15 | 145,5 min | −21,1 ± 21,2 min | 12,2 | bei 95 % nicht von null unterscheidbar |
| (b) MTTR 15 min | 107,5 min | −59,1 ± 20,4 min | 9,0 | ja |
| (c) B = 9,5 min | 92,9 min | −73,6 ± 17,3 min | 7,7 | ja |

So liest man die Tabelle:

- **Der Puffer packt die Ursache nicht an.** Station A ist nicht der Engpass, deshalb lagert ein größerer Puffer zwischen A und B die Warteschlange vor allem an einen anderen Ort um. Mit 20 Läufen ist seine Wirkung nicht von null unterscheidbar; mehr Läufe könnten einen kleinen Effekt zeigen, aber keinen in der Größenordnung von (b) oder (c).
- **Die Reparaturzeit zählt mehr, als die Verfügbarkeitszahl vermuten lässt.** Option (b) hebt die Verfügbarkeit nur von 94,1 % auf 97,0 %, beseitigt aber etwa ein Drittel der Durchlaufzeit, weil lange Reparaturen lange Warteschlangen hinter dem Engpass erzeugen.
- **Option (c) ist der stärkste Hebel,** kann aber mehr kosten (Vorrichtungskonstruktion, Prozessvalidierung, eventuell eine Erstmusterprüfung). Das Controlling kann jetzt die Kosten von (b) und (c) gegen einen bekannten Effekt abwägen.

**Das Ergebnis in Geld übersetzt.** Der Durchsatz ändert sich in keinem Szenario, es gibt also keinen Umsatzeffekt, es sei denn, kürzere Durchlaufzeiten gewinnen Aufträge. Der direkte Effekt ist gebundenes Umlaufvermögen: Nach Littles Gesetz bedeutet eine kürzere Durchlaufzeit bei gleichem Durchsatz einen geringeren Umlaufbestand. Option (b) senkt den mittleren Umlaufbestand um 13,8 − 9,0 = 4,8 Teile. Bei einem angenommenen (veranschaulichenden) Bestandswert von 500 USD je Teil werden einmalig etwa 2.400 USD Working Capital frei, dazu jedes Jahr die Kapitalbindungskosten darauf. Für eine solche Zelle sind meist Liefertreue und Fläche die stärkeren Argumente; auch sie quantifiziert das Modell (Umlaufbestand und sein 90. Perzentil).

Das ist dieselbe Logik, die die [Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant) lehrt: den Engpass verbessern, nicht den Nicht-Engpass. Die Simulation liefert die Größe des Effekts und seine Unsicherheit dazu.

### 4.6 Wie viele Simulationsläufe braucht man?

Mit 20 Läufen beträgt die halbe Intervallbreite der Durchlaufzeit etwa 20 Minuten. Braucht die Entscheidung ±10 Minuten, lautet die übliche Näherung n ≈ n₀ × (h₀ / h)² = 20 × (20,1 / 10)² ≈ 81 Läufe [1]. Gepaarte Vergleiche mit Common Random Numbers kommen meist mit weniger Läufen aus als unabhängige, weil sich der gemeinsame Zufall in der Differenz herauskürzt.

### 4.7 Was die Einschwingphase ändert

Rechnet man nur zwei simulierte Tage ab leerem Start ohne Einschwingphase, ergibt der Ausgangsfall etwa 94 Minuten mittlere Durchlaufzeit statt 166,5. Das ist eine Unterschätzung um rund 44 %, weil eine leere Linie keine Warteschlangen hat. Law [1] und Banks et al. [2] beschreiben Verfahren zur Wahl der Einschwinglänge, etwa gleitende Mittelwerte der Ergebnisgröße über die Zeit aufzutragen und dort abzuschneiden, wo die Kurve abflacht.

## 5. Verifikation und Validierung Schritt für Schritt

Sargents Aufsatz im Journal of Simulation unterscheidet **konzeptionelle Modellvalidität**, **Verifikation des Rechnermodells**, **operationale Validität** und **Datenvalidität** und empfiehlt, jede davon zu dokumentieren [3]. Einfach gesagt:

- **Verifikation:** Der Code bzw. das Tool-Modell tut, was das konzeptionelle Modell sagt.
- **Validierung:** Das konzeptionelle Modell bildet mit seinen Daten das reale System für die anstehende Entscheidung genau genug ab.

"Genau genug für die Entscheidung" ist wichtig. Ein Modell für eine Pufferentscheidung muss nicht die Ausbringung jeder Schicht auf das Teil genau wiedergeben; es muss die Szenarien richtig reihen und die Effektgröße in einer Spanne schätzen, die die Entscheidung nicht kippen würde.

### 5.1 Verifikationsprüfungen am Beispiel

| Prüfung | Vorgehen | Ergebnis im Beispiel |
|---|---|---|
| Analytischer Vergleichswert | Lognormale durch exponentialverteilte Zeiten ersetzen, Störungen und Puffergrenze entfernen. Zwei Stationen in Reihe mit Poisson-Ankünften bilden dann ein einfaches Jackson-Netz: Jede Station verhält sich wie eine unabhängige M/M/1-Warteschlange, für die exakte Formeln existieren. | Erwartete Durchlaufzeit: 50 min Warten + 10 min an A, 121 min Warten + 11 min an B = 192 min; erwarteter Umlaufbestand = 5/h × 3,2 h = 16 Teile. Simulation (20 Läufe): 179 ± 16 min und 14,9 ± 1,4 Teile. Beide Intervalle enthalten die exakten Werte. |
| Littles Gesetz | Umlaufbestand mit Durchsatz × Durchlaufzeit vergleichen [7] | 4,98/h × 179,4 min / 60 = 14,89 gegenüber gemessenem Umlaufbestand 14,93: stimmig |
| Handrechnung der Auslastung | Belegungsanteil von B sollte Ankunftsrate × mittlerer Bearbeitungszeit entsprechen | 87,5 % erwartet, 87 % simuliert |
| Extrembedingungen | Keine Ankünfte → keine Ausbringung; MTTR → 0 → Ergebnisse nähern sich dem Fall ohne Störung; Puffer → unendlich → A nie blockiert | alles wie erwartet |
| Trace | Die ersten 20 Ereignisse von Hand durchgehen, einschließlich einer Störung während der Bearbeitung | Restbearbeitungszeit nach der Reparatur korrekt fortgesetzt |

Im M/M/1-Test läuft B mit 91,7 % Auslastung, deshalb sind die Schwankung von Lauf zu Lauf und das Intervall groß; für eine engere Prüfung einen Vergleichswert bei geringerer Last ergänzen.

### 5.2 Validierungsprüfungen

Die Validierung vergleicht das Modell mit dem realen System. Für eine bestehende Linie sind MES- und ERP-Daten die nützlichsten Quellen (siehe Abschnitt 6). Das folgende Beispiel ist veranschaulichend:

| Validierungsschritt | Beispiel |
|---|---|
| Augenscheinvalidität (Face Validity) | Die Modellanimation mit dem Zellenverantwortlichen und zwei Werkern durchgehen. Sie weisen darauf hin, dass B in der Realität zu Schichtbeginn nie hungert, weil ein Materialbereitsteller Teile vorab bereitstellt. Das Modell bekommt eine Vorbereitstellungsregel. |
| Vergleich mit Vergangenheitsdaten | MES-Daten aus sechs vergleichbaren Wochen zeigen eine mittlere Durchlaufzeit von 172 Minuten und einen mittleren Umlaufbestand von 14 Teilen (veranschaulichende Werte). Der Ausgangsfall des Modells ergibt 166,5 ± 20,1 min und 13,8 ± 1,8 Teile. Beide beobachteten Werte liegen in den Intervallen: kein Hinweis auf eine Abweichung. |
| Verteilungsprüfung | Die simulierte Verteilung der Durchlaufzeit (nicht nur den Mittelwert) mit der MES-Verteilung vergleichen, zum Beispiel das 90. Perzentil. |
| Sensitivität | Unsichere Eingangsgrößen variieren (MTTR ±20 %, Variationskoeffizient der Bearbeitungszeit 0,3 bis 0,7) und prüfen, ob sich die Reihenfolge der Szenarien ändert. Hier tut sie das nicht: (c) > (b) > (a) in allen getesteten Varianten. |
| Freigabe und Versionierung | Annahmen, Datenquellen und Validierungsergebnisse auf einer Seite dokumentieren, die die Entscheider unterschreiben. Modell und Eingangsdaten wie ein gelenktes Dokument versionieren, damit sich ein späterer Neulauf auf den freigegebenen Stand zurückführen lässt. |

Ein Modell, das die Vergangenheit trifft, ist nicht automatisch richtig für eine andere Zukunft (neue Produkte, neues Schichtmodell). Deshalb angeben, welche Bedingungen die Validierung abdeckt. Das NIST arbeitet im Umfeld von ISO 23247 an einem Rahmen für Verifikation, Validierung und Unsicherheitsquantifizierung (VVUQ) für digitale Zwillinge in der Produktion [8]. Das zeigt, dass das Thema für vernetzte Modelle noch lange nicht abgeschlossen ist.

## 6. Eingangsdaten: woher sie kommen und wie man sie modelliert

Das Modell ist nur so gut wie seine Eingangsdaten. Typische Quellen in einem Werk (das Original beschreibt ein US-Werk):

| Eingangsgröße | Hauptquelle | Typisches Problem | Was tun |
|---|---|---|---|
| Arbeitspläne und Vorgabezeiten | ERP-Arbeitsplan / Arbeitsplatzdaten | Vorgaben sind Jahre alt oder mit Puffer versehen | mit MES-Istwerten der letzten 3 bis 6 Monate vergleichen |
| Tatsächliche Bearbeitungszeiten | MES-Start/Ende je Arbeitsgang, Maschinensignale (MTConnect, OPC UA) | Buchungsverzug, Werker melden gesammelt zurück | unplausible Werte filtern, mit Zeitaufnahmen abgleichen |
| Rüstzeiten | MES-Rüstrückmeldungen, SMED-Aufzeichnungen | nicht getrennt gebucht | Stichproben vor Ort |
| Störungen (MTBF, MTTR) | Instandhaltungsaufträge im CMMS, MES-Stillstandscodes | Kurzstillstände nicht erfasst, Reparaturzeit enthält das Warten auf die Instandhaltung | Reaktionszeit und Reparaturzeit trennen; sie brauchen unterschiedliche Verbesserungsmaßnahmen |
| Auftragsfreigaben und Produktmix | ERP-Fertigungsaufträge, Bedarfsplan | der künftige Mix weicht von der Vergangenheit ab | Szenarien modellieren, nicht eine einzige Prognose |
| Schichtkalender und Personal | Zeiterfassung, Schichtplan | Überstunden und Abwesenheiten fehlen | tatsächliche Anwesenheit einbeziehen |
| Zeitstempel über Systeme hinweg | MES, SPS-Historians, ERP | Uhren nicht synchronisiert, Zeitzonen, Ortszeit vs. UTC | vor der Berechnung von Dauern auf eine Zeitbasis normalisieren |

Zu den **Verteilungen**: Ab einigen Dutzend Beobachtungen eine Verteilung anpassen (lognormal, Gamma und Weibull sind für Bearbeitungs- und Reparaturzeiten üblich) und die Anpassung testen [1]. Bei sehr wenigen Beobachtungen ist eine Dreiecksverteilung mit Minimum, wahrscheinlichstem Wert und Maximum von den Leuten, die den Prozess fahren, ein vertretbarer Start, markiert für eine spätere Datenerhebung. Wer nur den Mittelwert (eine Konstante) verwendet, entfernt genau die Streuung, die Warteschlangen erzeugt.

Zeitstempel auf Werkerebene sind personenbezogene Daten. Für die Simulation braucht man sie selten je Person: nach Arbeitsgang und Schicht aggregieren, den Zweck mit der Belegschaft abstimmen (in gewerkschaftlich organisierten Werken auch mit der Gewerkschaft) und in deutschen Werken damit rechnen, dass der Betriebsrat mitredet: Nach § 87 Abs. 1 Nr. 6 Betriebsverfassungsgesetz (BetrVG) bestimmt er bei Einführung und Anwendung technischer Einrichtungen mit, die dazu bestimmt sind, das Verhalten oder die Leistung der Beschäftigten zu überwachen [20].

Wo die Daten in einer geschichteten Systemlandschaft liegen (ERP auf Ebene 4, MES auf Ebene 3 nach ISA-95), erklärt unser geplanter Pillar zu [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant). Sind die Zeitstempel aus MES und ERP unsauber, helfen die Techniken des [Process Mining in der Produktion](https://www.m365.fm/learn/digital-twin/process-mining-produktion/), reale Abläufe und Zeiten zu rekonstruieren, bevor man ein Modell parametriert.

## 7. Simulationssoftware für die Produktion im Vergleich

Die Tabelle zeigt verbreitete Tools und was ihre Hersteller über sie sagen. Sie ist kein Ranking. Preise werden nicht einheitlich veröffentlicht und fehlen deshalb.

| Tool | Hersteller / Lizenz | Ansatz laut Hersteller | Hinweise |
|---|---|---|---|
| Plant Simulation (Tecnomatix) | Siemens, kommerziell | ereignisdiskrete Simulation und Durchsatzoptimierung, objektorientierte 3D-Umgebung [12] | Siemens führt außerdem eine "Plant Simulation X VSM Library" zur Simulation von Wertstromdiagrammen [12] |
| Simio | Simio LLC, kommerziell | ereignisdiskrete Simulation, dazu Angebote für APS und "Process Digital Twin" [14] | verbindet Simulation mit Feinplanung |
| AnyLogic | AnyLogic Company, kommerziell | ereignisdiskrete, agentenbasierte und System-Dynamics-Modellierung sowie deren Kombination (Multimethod) [15] | geeignet für hybride Modelle, etwa AMR-Flotten in einer DES-Linie |
| FlexSim | Autodesk (verbindliche Übernahmevereinbarung angekündigt am 24. Oktober 2023) [16] | ereignisdiskrete Simulation von Fabriken und Logistikzentren [16] | heute als Autodesk FlexSim vermarktet |
| Arena | Rockwell Automation, kommerziell | "uses the discrete event method for most simulation efforts", Modellierung mit Flussdiagrammen [13] | kostenlose Testversion und Hochschulprogramm angeboten [13] |
| SimPy | Open Source, MIT-Lizenz | "process-based discrete-event simulation framework based on standard Python" [10] | codebasiert, keine Oberfläche; gut für Analysten, die schon Python nutzen |
| JaamSim | Open Source, Apache License 2.0 | Java-basierte Umgebung für ereignisdiskrete Simulation mit Drag-and-drop und 3D-Grafik [11] | kostenloses Tool mit Oberfläche |
| iFAKT Polaris Simulator | iFAKT GmbH, kommerziell | die Herstellerseite beschreibt Simulation auf einem Produkt-Prozess-Ressourcen-Modell, "station, line, and hall models", Szenarien zu Kapazität, Personal und Puffern; die Simulationsart wird nicht angegeben [17] | siehe Hinweis unten |
| Tabellenkalkulation | beliebig | statische Rechnung | gut für eine erste Abschätzung; keine Warteschlangen, kein Blockieren, keine Streuung |

So wählt man aus: (1) zuerst Entscheidung, Ergebnisgrößen und Detaillierungsgrad aufschreiben; (2) prüfen, ob das Tool ERP-/MES-Auszüge einliest oder ob jemand Arbeitspläne abtippt; (3) prüfen, ob Replikationen, Einschwingphase und Konfidenzintervalle eingebaut unterstützt werden; (4) festlegen, wer das Modell pflegt, denn eine einmalige Investitionsstudie und ein monatliches Planungsmodell haben unterschiedliche Anforderungen; (5) mit eigenen Daten pilotieren, bevor man eine mehrjährige Lizenz unterschreibt.

**Ein Beispiel aus dem Wertstrom.** Manche Teams starten die Simulation lieber von einem Modell, das sie schon kennen, etwa einem Wertstromdiagramm oder einem aus ERP-Daten abgeleiteten Produkt-Prozess-Ressourcen-Modell, statt ein separates 3D-Layoutmodell aufzubauen. Die Idee geht auf Arbeiten zur dynamischen Wertstromsimulation zurück, die 2014 in der ZWF (Zeitschrift für wirtschaftlichen Fabrikbetrieb) erschienen sind [18]. Ein Produkt, das darauf aufbaut, ist iFAKT Polaris: Laut Hersteller rechnet dessen Simulator Netzpläne aus dem Polaris Designer über konfigurierbare Stations-, Linien- und Hallenmodelle durch und weist Auslastung, Engpässe sowie Über- oder Unterauslastung über die Zeit aus [17]. Die Herstellerseite sagt nicht, ob die Engine ereignisdiskret arbeitet oder wie Zufall modelliert wird. Deshalb in einer Demo nach Replikationen und Verteilungen fragen, wie bei jedem Tool in dieser Tabelle. Die VSM Library von Siemens [12] ist ein alternativer Weg zur selben Idee innerhalb eines klassischen DES-Tools. Mehr zu den Polaris-Modulen, mit Belegen und Grenzen, steht in unserem Pillar [iFAKT Polaris](https://www.m365.fm/learn/ifakt-polaris/).

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

## 8. Simulation, Wertstrom, Process Mining und Digital Twin

Simulation steht selten allein. Vier Nachbarn sind wichtig:

- **[Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)** liefert ein statisches Bild mit Mittelwerten. Die Simulation prüft, ob der Soll-Wertstrom hält, wenn Streuung, Produktmix und Störungen dazukommen.
- **[Process Mining](https://www.m365.fm/learn/digital-twin/process-mining-produktion/)** rekonstruiert den tatsächlichen Ablauf und die Zeiten aus Ereignisprotokollen von MES und ERP. Es ist eine starke Quelle für Modelleingangsdaten und für die Validierung. Eine Studie von 2025 an einer vollautomatisierten Testfabrik hat beides kombiniert: Process Mining identifizierte eine CNC-Maschine als Hauptengpass, und die Simulation zeigte anschließend, dass angepasste CNC-Einstellungen plus drei FTS die Zielausbringung von 70 Einheiten erreichen konnten, während weitere FTS nichts mehr brachten [19]. Die Autoren weisen darauf hin, dass die Ergebnisse aus einer einzigen Testumgebung stammen.
- **[Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/)** nutzt ähnliche Modelle für einen kürzeren Horizont: die Reihenfolge von morgen statt des Layouts für das nächste Jahr.
- **Der Digital Twin** verbindet das Modell mit Live-Daten. Ein DES-Modell, das regelmäßig mit aktuellen MES-Daten gespeist wird, rückt vom "digitalen Modell" in Richtung "digitaler Schatten"; ob man das braucht, hängt davon ab, wie oft die Entscheidung wiederkehrt.

Die Kennzahldefinitionen des Modells an die auf dem Shopfloor angleichen; siehe [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/).

## 9. Typische Fehler

| Fehler | Warum er schadet | Besser |
|---|---|---|
| Mit dem Tool oder dem 3D-Layout anfangen | wochenlange Modellierdetails, die die Entscheidung nicht beeinflussen | zuerst Entscheidung, Ergebnisgrößen und Umfang auf einer Seite festhalten |
| Mittelwerte als Eingangsdaten | entfernt die Streuung, die Warteschlangen erzeugt; Ergebnisse sehen aus wie die Tabelle | Verteilungen anpassen oder zumindest Dreiecksschätzungen verwenden |
| Ein Lauf pro Szenario | ein einzelner Lauf ist ein Zufallsergebnis, kein Resultat | zum Start 10 bis 30 Läufe, mehr, wenn sich die Intervalle überlappen |
| Keine Einschwingphase | Verzerrung durch leeren Start (44 % im Beispiel) | Ergebnisgröße über die Zeit auftragen, den Einschwingvorgang verwerfen |
| Nur den Durchsatz berichten | in nachfragebegrenzten Systemen versteckt der Durchsatz das Problem | Durchlaufzeit, Umlaufbestand und Verteilungen berichten |
| Verifikation auslassen | Programmierfehler sehen aus wie Erkenntnisse | analytische Vergleichswerte, Littles Gesetz, Traces |
| "Validiert", weil die Animation richtig aussieht | Augenscheinvalidität ist nur ein Test | mit MES-Historie vergleichen und dokumentieren [3] |
| Menschen wie Maschinen modellieren | ignoriert Pausen, Qualifikationen, Lernen, Ermüdung | Qualifikationen und Pausenregeln modellieren; Werker in die Augenscheinvalidierung einbeziehen |
| Das Modell stirbt nach der Studie | die nächste Entscheidung beginnt bei null | einen Verantwortlichen benennen und eine Datenstrecke pflegen, wenn Entscheidungen wiederkehren |

Werker und Zellenverantwortliche kennen die echten Regeln (wer Material vorab bereitstellt, welche Maschine nach einer Störung Vorrang hat). Sie in die Augenscheinvalidierung einzubeziehen, ist ein günstiger Genauigkeitsgewinn und erleichtert die Akzeptanz auf dem Shopfloor.

## 10. FAQ

### Was ist Simulation in der Produktion, einfach erklärt?

Ein Computermodell eines Produktionssystems, das man in der Zeit vorwärts laufen lässt, um Entscheidungen (neuer Produktmix, größerer Puffer, zusätzlicher Werker) zu testen, bevor man den realen Shopfloor verändert.

### Was ist ereignisdiskrete Simulation in der Produktion?

Die ereignisdiskrete Simulation bildet eine Fabrik als Folge von Ereignissen ab (Ankünfte, Starts, Enden, Ausfälle, Reparaturen), die den Systemzustand zu bestimmten Zeitpunkten ändern. Zwischen den Ereignissen ändert sich nichts, deshalb springt die Engine von einem Ereignis zum nächsten. Zufällige Streuung ist eingebaut, wodurch Warteschlangen, Blockieren und Engpässe sichtbar werden [1][2].

### Was ist der Unterschied zwischen Fabriksimulation und Digital Twin?

DES ist eine Methode; ein Digital Twin ist ein Modell, das über Daten mit dem realen System verbunden ist, idealerweise automatisch in beide Richtungen. Ein manuell gespeistes DES-Modell ist ein digitales Modell; automatisch mit aktuellen Daten versorgt, wird es Teil eines digitalen Schattens oder Zwillings ([Leitfaden](https://www.m365.fm/learn/digital-twin/)).

### Was ist der Unterschied zwischen ereignisdiskreter und agentenbasierter Simulation?

DES konzentriert sich auf den Fluss von Entitäten durch Prozesse und Ressourcen. Agentenbasierte Simulation konzentriert sich auf autonome Akteure mit eigenen Regeln, etwa mobile Roboter, die sich Gänge teilen. Viele Fabrikmodelle kombinieren beides, zum Beispiel eine DES-Fertigungslinie mit agentenbasierten AMR.

### Wie genau sind ereignisdiskrete Simulationsmodelle?

Eine feste Genauigkeitszahl gibt es nicht. Die Genauigkeit hängt von Eingangsdaten und Validierung ab. Ein validiertes Modell sollte historische Durchlaufzeit, Umlaufbestand und Durchsatz innerhalb seiner Konfidenzintervalle wiedergeben und Entscheidungsoptionen richtig reihen. Herstelleraussagen wie "innerhalb von 5 bis 10 %" sind nur aussagekräftig, wenn die Validierungsmethode genannt wird [3].

### Welche Daten braucht man für ein Simulationsmodell?

Arbeitspläne und Bearbeitungszeiten, Rüstzeiten, Störungs- und Reparaturdaten, Auftragsfreigaben und Produktmix, Puffergrößen, Schichtkalender und Personal, dazu Transportzeiten, wenn der Materialtransport eine Rolle spielt. Das meiste steckt in ERP, MES und CMMS (Abschnitt 6).

### Kann man Produktionssimulation in Excel machen?

Einfache Monte-Carlo-Rechnungen gehen in einer Tabellenkalkulation, aber sie verwaltet keine Ereignisliste, keine Warteschlangen, kein Blockieren und keine gemeinsam genutzten Ressourcen. Für alles jenseits einer einzelnen Station ist ein DES-Tool oder eine DES-Bibliothek (auch kostenlose wie SimPy oder JaamSim) schneller und weniger fehleranfällig [10][11].

### Wie viele Simulationsläufe (Replikationen) braucht man?

Mit 10 bis 30 beginnen und die Konfidenzintervalle ansehen. Überlappen sich die Intervalle der verglichenen Szenarien oder sind sie für die Entscheidung zu breit, Läufe ergänzen: Um die Intervallbreite zu halbieren, braucht man etwa viermal so viele Läufe [1].

### Was ist die Einschwingphase in der Simulation?

Der Anfangszeitraum, in dem sich ein leer startendes Modell mit Arbeit füllt. Statistiken aus diesem Zeitraum sind verzerrt, meist hin zu zu kurzen Durchlaufzeiten, deshalb verwirft man ihn, bevor Ergebnisse erfasst werden [1][2].

### Kann man Python für Simulation nutzen?

Ja. SimPy ist ein kostenloses, prozessbasiertes Framework für ereignisdiskrete Simulation auf Basis von Standard-Python [10], und das Rechenbeispiel in Abschnitt 4 wurde selbst als Python-Skript mit eigener Ereignisliste gebaut. Code gibt volle Kontrolle und einfache Versionierung; ein Tool mit Oberfläche lässt sich Leuten, die keinen Code lesen, schneller zeigen.

### Welche Simulationssoftware für die Produktion ist die beste?

Das eine beste Tool gibt es nicht. Plant Simulation, Simio, AnyLogic, FlexSim und Arena unterscheiden sich in Ansatz, 3D-Schwerpunkt und Planungsfunktionen; SimPy und JaamSim sind kostenlos. Auswählen nach Entscheidung, Datenweg, Statistikfunktionen und Modellverantwortung (Abschnitt 7).

### Lohnt sich Simulation für einen kleinen Betrieb?

Oft ja, wenn die Entscheidung teuer ist (eine Maschine, eine Erweiterung, eine zweite Schicht) und eine Schlüsselressource hoch ausgelastet ist. Kostenlose Tools senken die Einstiegskosten, und in den USA unterstützen die NIST-MEP-Zentren kleine und mittlere Hersteller (siehe Leitfaden).

## 11. Fazit

Simulation in der Produktion hat ihren Platz dort, wo Mittelwerte in die Irre führen: hohe Auslastung, Streuung, Störungen und Stationen, die sich gegenseitig beeinflussen. Ereignisdiskrete Simulation ist dort die Standardmethode, und ihr Wert hängt weniger vom Tool ab als von Disziplin: die Entscheidung aufschreiben, echte Verteilungen aus MES-, ERP- und Instandhaltungsdaten nutzen, das Modell gegen Vergleichswerte verifizieren, gegen die Vergangenheit validieren, die Einschwingphase verwerfen, genug Läufe rechnen und Szenarien mit Konfidenzintervallen vergleichen. Im kleinen Beispiel dieses Artikels sagte die Tabelle "passt", ein größerer Puffer wirkte plausibel, und das Modell zeigte, dass Reparaturzeit und Bearbeitungszeit am Engpass die Hebel sind, die zählen, jeweils mit Größe und Unsicherheit.

## Weiterlesen auf m365.fm

**Parent-Pillar**

- [Digital Twin in der Produktion: der vollständige Leitfaden](https://www.m365.fm/learn/digital-twin/)

**Schwester-Cluster**

- [Process Mining in der Produktion](https://www.m365.fm/learn/digital-twin/process-mining-produktion/) (geplant)

**Verwandte Leitfäden** (Links werden nach Veröffentlichung aktiv)

- [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)
- [Theory of Constraints und Engpasssteuerung](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant)
- [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/)
- [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)
- [iFAKT Polaris](https://www.m365.fm/learn/ifakt-polaris/)

**Entity-Seiten**

- [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/)

---

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über die Digitalisierung der Produktion mit Microsoft 365 und Azure, Wertstrommethoden, Produktionsplanung, Simulation und digitale Zwillinge.

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

*[Redaktion: Rolle, Werdegang und Profilfoto vom Autor ergänzen lassen.]*

---

# Quellen

Alle Online-Quellen abgerufen am 20. November 2026. Die Quellen [5], [6], [7], [8] und [18] werden auch im Parent-Pillar zitiert und wurden dort geprüft; die übrigen wurden für diesen Artikel geöffnet und geprüft.

1. Law, A. M. (2024): Simulation Modeling and Analysis. 6th ed., McGraw-Hill, ISBN 978-1-264-26824-5 (erschienen am 23. Januar 2024; behandelt Input-Modellierung, Verifikation und Validierung von Modellen sowie statistische Planung und Auswertung von Simulationsexperimenten). https://www.mheducation.com/highered/mhp/product/simulation-modeling-analysis-sixth-edition.html
2. Banks, J.; Carson, J. S.; Nelson, B. L.; Nicol, D. M. (2010): Discrete-Event System Simulation. 5th ed., Pearson (erschienen am 26. Juni 2009, © 2010), ISBN 978-0-13-606212-7. https://pearson.com/en-us/subject-catalog/p/discrete-event-system-simulation/P200000003161/9780136062127
3. Sargent, R. G. (2013): Verification and validation of simulation models. Journal of Simulation 7(1), S. 12–24. DOI: [10.1057/jos.2012.20](https://doi.org/10.1057/jos.2012.20)
4. Winter Simulation Conference: WSC Archive (Programme mit Volltexten, WSC 1968 bis WSC 2025). https://informs-sim.org
5. VDI 3633 Blatt 1:2014-12 Simulation von Logistik-, Materialfluss- und Produktionssystemen: Grundlagen (englischer Titel: Simulation of systems in materials handling, logistics and production: Fundamentals). https://vdi.de/richtlinien/details/vdi-3633-blatt-1-simulation-of-systems-in-materials-handling-logistics-and-production-fundamentals
6. Kingman, J. F. C. (1961): The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57(4), S. 902 ff. DOI: [10.1017/S0305004100036094](https://doi.org/10.1017/S0305004100036094)
7. Little, J. D. C. (1961): A Proof for the Queuing Formula: L = λW. Operations Research 9(3), S. 383–387. DOI: [10.1287/opre.9.3.383](https://doi.org/10.1287/opre.9.3.383)
8. NIST: Digital Twins for Advanced Manufacturing (Projektseite; Beiträge zu ISO 23247, vorgeschlagener VVUQ-Rahmen). https://nist.gov/programs-projects/digital-twins-advanced-manufacturing
9. Wikipedia: Simulation in manufacturing systems (genutzt für die Wettbewerbsanalyse und als Verweis auf Robinson, S. (2014): Simulation: The Practice of Model Development and Use, Palgrave Macmillan). https://en.wikipedia.org/wiki/Simulation_in_manufacturing_systems
10. SimPy-Dokumentation ("SimPy is a process-based discrete-event simulation framework based on standard Python"; MIT-Lizenz; Version 4.1). https://simpy.readthedocs.io/en/latest/
11. JaamSim (GitHub-Repository; Java-basierte Umgebung für ereignisdiskrete Simulation, Apache License 2.0). https://github.com/jaamsim/jaamsim
12. Siemens: Plant Simulation software (Tecnomatix; Plant-Simulation-X-Editionen und VSM Library). https://www.siemens.com/en-us/products/tecnomatix/plant-simulation-software/
13. Rockwell Automation: Arena Simulation Software. https://www.rockwellautomation.com/en-mde/products/software/arena-simulation.html
14. Simio: Simio Sync practical applications (Produktnavigation: Discrete Event Simulation Software, APS, Process Digital Twin). https://simio.com/resources/events/2022-Simio-Sync-Practical-Applications/index.html
15. AnyLogic Help: Modeling approaches (discrete event, system dynamics, agent based, multimethod modeling). https://anylogic.help/anylogic/ui/multimethod.html
16. CIMdata: Autodesk Signs Definitive Agreement to Acquire FlexSim (24. Oktober 2023). https://www.cimdata.com/en/industry-summary-articles/item/23014-autodesk-signs-definitive-agreement-to-acquire-flexsim
17. iFAKT GmbH: Polaris Simulator (Modulseite; Herstellerangaben). https://www.ifakt.de/en/solutions/simulator
18. Türck, S.; Weimer, A.; Schubert, L.; Drees, J. (2014): Dynamische Simulation von Wertströmen. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 109(11), S. 839–842. DOI: [10.3139/104.111242](https://doi.org/10.3139/104.111242)
19. Lee, Y.; Shin, J.; Lee, W. (2025): Manufacturing process analysis framework for process mining: case study of fully automated factory applications. International Journal of Advanced Manufacturing Technology 136, S. 5641–5664. DOI: [10.1007/s00170-025-15029-5](https://doi.org/10.1007/s00170-025-15029-5)
20. § 87 Betriebsverfassungsgesetz, Absatz 1 Nr. 6. Gesetze im Internet, Bundesministerium der Justiz. https://www.gesetze-im-internet.de/betrvg/__87.html (abgerufen am 20. November 2026)

---

# Prüfhinweise für die Redaktion

## URL, Canonical und hreflang

- Cluster-URL verschachtelt unter dem Parent-Pillar: `/learn/digital-twin/simulation-produktion/`. Vor Veröffentlichung mit der Seitenstruktur abgleichen.
- hreflang-Paar `de-DE` (diese Seite) <-> `en-US` (https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/), jeweils mit selbstreferenzierendem Canonical. Die englische Fassung trägt bisher "kein hreflang-Paar"; dort nachziehen.

## Rechenbeispiel

- Alle Parameter (12 min Zwischenankunftszeit, 10,0 / 10,5 min Bearbeitung, Variationskoeffizient 0,5, MTBF 480, MTTR 30, Puffer 5) und die MES-Validierungswerte (172 min, 14 Teile) sind **veranschaulichende Annahmen** und im Text so gekennzeichnet.
- Die Ergebnisse stammen aus einem eigens geschriebenen Python-Skript (eigene Ereignisliste, 20 Läufe, Seeds 1000–1019, Common Random Numbers, 5 Tage Einschwingphase, 30 Tage Laufzeit). Die M/M/1-Vergleichswerte (192 min, 16 Teile) sind exakte Warteschlangenergebnisse. Empfehlung: Skript als Download anbieten.

## Herstellerangaben und [unbelegt]-Stellen

- Tool-Beschreibungen in Abschnitt 7 sind Selbstbeschreibungen der Hersteller [10]–[17]. iFAKT Polaris Simulator nur nach Herstellerseite [17]; der Text nennt, was die Seite nicht dokumentiert (Simulationsart, Zufall).
- Robinson (2014) nur über die Literaturliste der Wikipedia [9] zitiert, das Buch selbst wurde nicht geöffnet.
- "80 % Auslastung" und "10 bis 30 Läufe" sind Faustregeln und im Text so bezeichnet.
- Keine offenen [unbelegt]-Stellen im Artikeltext.

## iFAKT und Offenlegung

- Eine iFAKT-Passage (Abschnitt 7) als ein Beispiel neben herstellerneutralen Alternativen. Offenlegung "**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**" nach der Passage und in der Autorenbox. Kein Sponsoring-Hinweis, iFAKT zahlt nicht für die Veröffentlichung. Sitz, falls benötigt: Curiestraße 2, 70563 Stuttgart.

## Interne Links

- Parent-Pillar in den ersten 150 Wörtern und unter "Weiterlesen". Schwester-Cluster Process Mining in Abschnitt 6 und 8 sowie unter "Weiterlesen". Verlinkte Pillars: digital-twin, theory-of-constraints-engpass, mes-isa-95, wertstromanalyse, produktionsplanung-aps, produktionskennzahlen, ifakt-polaris. "(geplant)" steht nur bei den noch nicht veröffentlichten deutschen Zielen (neue Pillars, neue Cluster); bei Veröffentlichung entfernen.

## Empfohlene Grafiken

1. Ereignisliste: vier Ereignisse auf einer Zeitachse mit Zustandsänderungen (Abschnitt 2).
2. Durchlaufzeit über Auslastung (Kingman) mit markierter "passt"-Zone der Tabelle.
3. Balkendiagramm mit Konfidenzintervall-Fehlerbalken für die vier Szenarien (Abschnitt 4.5).
4. Einschwingphase: gleitender Mittelwert der Durchlaufzeit über simulierte Tage mit Schnittlinie (Abschnitt 4.7).
5. V&V-Ablauf: konzeptionelles Modell → Verifikation → Validierung → Experimente (nach Sargent [3]).

## JSON-LD-Vorschlag

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Simulation in der Produktion: So funktioniert ereignisdiskrete Simulation, mit Rechenbeispiel",
      "inLanguage": "de-DE",
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-26",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "mainEntityOfPage": "https://www.m365.fm/learn/digital-twin/simulation-produktion/",
      "isPartOf": {"@type": "WebPage", "url": "https://www.m365.fm/learn/digital-twin/"},
      "about": ["Simulation Produktion", "Materialflusssimulation", "ereignisdiskrete Simulation"]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "de-DE",
      "mainEntity": "[alle 12 FAQ-Fragen aus Abschnitt 10 mit Antworten einfügen]"
    }
  ]
}
```

## Für den deutschen Markt prüfen

- Abschnitt 6: Mitbestimmung des Betriebsrats nach § 87 Abs. 1 Nr. 6 BetrVG steht bereits im Original [20]; Fachprüfung, ob zusätzlich der Datenschutz (DSGVO, Beschäftigtendaten) erwähnt werden soll.
- FAQ "kleiner Betrieb": verweist auf US-Förderung (NIST MEP). Prüfen, ob ein Hinweis auf deutsche Angebote (z. B. Mittelstand-Digital-Zentren) ergänzt werden soll; nicht ohne Beleg einfügen.
- VDI 3633: deutschen Originaltitel der Richtlinie gegen die VDI-Seite prüfen.
- Kannibalisierung: Der Parent-Pillar behandelt Simulationsarten und Kingman im Überblick; dieser Cluster zielt auf "Simulation Produktion" / "Materialflusssimulation" als Methoden-Vertiefung.

## Fachliche Prüfung

Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.
