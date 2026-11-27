# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Predictive Maintenance und IIoT: Verfahren, ROI, Fahrplan (57 Zeichen) |
| Meta-Description | Vorausschauende Wartung mit IIoT: P-F-Kurve, Schwingung, Öl, Thermografie, Architektur bis zum CMMS, ML und Restlebensdauer, ROI und Kennzahlen. (144 Zeichen) |
| Slug | `/learn/predictive-maintenance-iiot/` (vollständige URL: https://www.m365.fm/learn/predictive-maintenance-iiot/) |
| Hauptkeyword | Predictive Maintenance; vorausschauende Wartung; IIoT (Industrial Internet of Things) |
| Nebenkeywords | was ist Predictive Maintenance, vorausschauende Instandhaltung, Predictive Maintenance vs. präventive Wartung, zustandsorientierte Instandhaltung, Condition Monitoring, Zustandsüberwachung, Schwingungsanalyse, Schwingungsüberwachung, Thermografie, Ölanalyse, Ultraschallprüfung, Motorstromanalyse, P-F-Kurve, P-F-Intervall, RCM zuverlässigkeitsorientierte Instandhaltung, IIoT Predictive Maintenance, IIoT-Architektur, OPC UA, MQTT, Sparkplug, Unified Namespace, Edge Computing, Predictive Maintenance Machine Learning, Anomalieerkennung, Restlebensdauer (RUL), Weibull-Analyse, Predictive Maintenance ROI, Predictive Maintenance Pilotprojekt, Instandhaltungskennzahlen, MTBF, MTTR, Wartungsplantreue, ISO 17359, ISO 13374, ISO 20816, Predictive Maintenance Cybersecurity |
| Suchintention | Informational (Definition, Verfahren, Funktionsweise) mit starkem kommerziellem Anteil (ROI, Einführung, selbst entwickeln oder kaufen). Zielgruppe: Leitung Instandhaltung und Zuverlässigkeit, Werksleitung, Produktionsleitung, Zuverlässigkeitsingenieure, OT/IT-Ingenieure und Controlling, die ein Predictive-Maintenance-Programm bewerten |
| Wortzahl | Tatsächlich H1 bis Fazit einschl. Tabellen, Glossar und FAQ (`wc -w`): **15.110 Wörter** (englische Fassung: 15.871 Wörter, Anteil 95 %) |
| Sprachversion | Deutsch (`de-DE`). hreflang-Paar: `de-DE` https://www.m365.fm/learn/predictive-maintenance-iiot/ <-> `en-US` https://www.m365.fm/en/learn/predictive-maintenance-iiot/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf die Suchergebnisse von google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus. Überschriften, FAQ-Fragen und Nebenkeywords dieser Fassung sind nach deutschem Suchverhalten formuliert, aber noch nicht gegen die deutschen Top-Ergebnisse geprüft.

# Predictive Maintenance und IIoT: Verfahren, Architektur, ROI und der Einstieg

*Stand: November 2026 · Lesezeit: etwa 50 Minuten (Schnelleinstieg: Kurzantwort, Kasten "Das Wichtigste in Kürze", das ROI-Rechenbeispiel und das Glossar)*

> **Kurzantwort:** Predictive Maintenance (PdM, vorausschauende Wartung oder vorausschauende Instandhaltung) bedeutet, eine Maschine dann instand zu setzen, wenn Messdaten zeigen, dass sich ein Ausfall anbahnt, nicht nach festem Kalender und nicht erst, wenn sie kaputt ist. Dazu werden Zustandssignale wie Schwingung, Temperatur, Ölqualität, Ultraschall und Motorstrom überwacht, mit einer Referenz verglichen, und aus dem Trend wird früh genug ein Instandhaltungsauftrag, um die Reparatur zu planen. Das Industrial Internet of Things (IIoT) ist die Infrastruktur, die das in der Breite bezahlbar macht: Sensoren, Edge-Gateways, Standardprotokolle wie OPC UA und MQTT und Analytics, die an das Instandhaltungssystem angebunden sind [1][2][3].

> **Das Wichtigste in Kürze**
> - Predictive Maintenance lohnt sich nur dort, wo ein Ausfall eine messbare Vorwarnzeit hat (ein P-F-Intervall), die länger ist als das Inspektionsintervall plus die Zeit, die man braucht, um die Reparatur zu planen und auszuführen.
> - Der O&M-Leitfaden des US-Energieministeriums (DOE) schätzt 8 % bis 12 % Einsparung von vorausschauender gegenüber präventiver Wartung und nennt Umfragedurchschnitte wie 25 % bis 30 % geringere Instandhaltungskosten und 35 % bis 45 % weniger Stillstand; der Leitfaden nennt die zugrunde liegenden Umfragen nicht, daher sind die Zahlen eine Orientierung, keine Prognose [2].
> - Eine Auswertung des NIST von 2020 ergab, dass US-Werke im obersten Viertel beim Anteil reaktiver Instandhaltung etwa 3,3-mal so viel Stillstand meldeten wie die im untersten Viertel; das NIST selbst bezeichnet viele dieser Unterschiede aber als statistisch nicht signifikant [4].
> - Die fünf wichtigsten Verfahren sind Schwingungsanalyse, Infrarot-Thermografie, Öl- und Verschleißpartikelanalyse, Luft- und Körperschall-Ultraschall sowie Motorstrom- bzw. elektrische Signaturanalyse, dazu Leistungstrends aus bereits vorhandenen Prozessdaten; die meisten Programme brauchen zwei oder drei davon, nicht alle.
> - Ein IIoT-Stack für die Instandhaltung hat fünf Schichten: Sensoren, Edge, Konnektivität, Datenplattform und den Instandhaltungsablauf (CMMS oder EAM). Die meisten Piloten scheitern an der letzten Schicht, nicht am Sensor.
> - Machine Learning ist ein Werkzeug für die Skalierung, kein Startpunkt. Schwellenwerte und Trendregeln auf guten Daten erkennen viele sich anbahnende Ausfälle; Modelle für die Restlebensdauer (Remaining Useful Life, RUL) brauchen eine gelabelte Ausfallhistorie, die die meisten Werke noch nicht haben.
> - Im Rechenbeispiel amortisiert sich ein Pilot mit 12 Anlagen in etwa sechs Monaten, wenn 60 % der Ausfälle erkannt werden, und innerhalb von drei Jahren gar nicht, wenn nur 20 % erkannt werden. Erkennungsrate und Stillstandskosten entscheiden über den Business Case.
> - Jeder vernetzte Sensor und jede Cloud-Verbindung ist auch ein Angriffsweg ins Werksnetz; Sicherheit muss ab dem ersten Gateway mitgeplant werden (ISA/IEC 62443, NIST SP 800-82 Rev. 3).

## Inhaltsverzeichnis

1. [Was ist Predictive Maintenance?](#was-ist-predictive-maintenance)
2. [Was ist IIoT und wie ermöglicht es Predictive Maintenance?](#was-ist-iiot-und-wie-ermöglicht-es-predictive-maintenance)
3. [Instandhaltungsstrategien im Vergleich: reaktiv, präventiv, zustandsorientiert, vorausschauend, präskriptiv](#instandhaltungsstrategien-im-vergleich-reaktiv-präventiv-zustandsorientiert-vorausschauend-präskriptiv)
4. [Wie Maschinen ausfallen: P-F-Kurve und die sechs Ausfallmuster](#wie-maschinen-ausfallen-p-f-kurve-und-die-sechs-ausfallmuster)
5. [Verfahren der Zustandsüberwachung](#verfahren-der-zustandsüberwachung)
6. [IIoT-Architektur für Predictive Maintenance](#iiot-architektur-für-predictive-maintenance)
7. [Datenanforderungen: was vor jedem Modell da sein muss](#datenanforderungen-was-vor-jedem-modell-da-sein-muss)
8. [Machine Learning für Predictive Maintenance: Anomalieerkennung und Restlebensdauer](#machine-learning-für-predictive-maintenance-anomalieerkennung-und-restlebensdauer)
9. [Nutzen und die Belege dafür](#nutzen-und-die-belege-dafür)
10. [ROI von Predictive Maintenance: ein Rechenbeispiel](#roi-von-predictive-maintenance-ein-rechenbeispiel)
11. [Pilotanlagen auswählen](#pilotanlagen-auswählen)
12. [Fahrplan: vom Piloten zum Programm](#fahrplan-vom-piloten-zum-programm)
13. [Instandhaltungskennzahlen: MTBF, MTTR, Wartungsplantreue und PdM-Kennzahlen](#instandhaltungskennzahlen-mtbf-mttr-wartungsplantreue-und-pdm-kennzahlen)
14. [Mitarbeiter, Qualifikation und Arbeitssicherheit](#mitarbeiter-qualifikation-und-arbeitssicherheit)
15. [Typische Fehler](#typische-fehler)
16. [Grenzen: wann sich Predictive Maintenance nicht lohnt](#grenzen-wann-sich-predictive-maintenance-nicht-lohnt)
17. [Sicherheitshinweis: IIoT und OT-Security](#sicherheitshinweis-iiot-und-ot-security)
18. [Einordnung: TPM, MES, Digital Twin und Cloud](#einordnung-tpm-mes-digital-twin-und-cloud)
19. [Glossar](#glossar)
20. [FAQ: Predictive Maintenance und IIoT](#faq-predictive-maintenance-und-iiot)
21. [Fazit und erste Schritte](#fazit-und-erste-schritte)

## Was ist Predictive Maintenance?

Predictive Maintenance ist eine Instandhaltungsstrategie, bei der der Zeitpunkt einer Maßnahme vom gemessenen Zustand der Anlage und einer Prognose abhängt, wie sich dieser Zustand entwickeln wird. Statt ein Lager alle 8.000 Stunden zu tauschen oder zu warten, bis es festläuft, wird das Lager gemessen: Der Schaden erscheint im Schwingungsspektrum, man verfolgt, wie er wächst, und plant den Tausch für den nächsten geplanten Stillstand ein.

ISO 17359, die allgemeine Leitlinie für Zustandsüberwachung und Diagnostik von Maschinen, beschreibt die Schritte eines solchen Programms für alle Maschinenarten: festlegen, was überwacht wird, Messverfahren auswählen, Alarmkriterien setzen, Ergebnisse diagnostizieren und danach handeln [1]. Das Federal Energy Management Program (FEMP) des US-Energieministeriums beschreibt Predictive Maintenance in seinem Leitfaden *Operations & Maintenance Best Practices* als Messungen, die den Beginn einer Verschlechterung erkennen, sodass die verursachenden Belastungen beseitigt oder beherrscht werden können, bevor sich die Anlage deutlich verschlechtert [2]. Beide Quellen stimmen in der Kernidee überein: messen, mit einer Referenz vergleichen, vor dem Funktionsausfall handeln.

### Predictive Maintenance vs. zustandsorientierte Instandhaltung

Die beiden Begriffe werden oft gleichbedeutend verwendet, und in vielen Werken beschreiben sie dieselbe Arbeit. Eine für die Planung nützliche Unterscheidung:

- **Zustandsorientierte Instandhaltung (Condition-based Maintenance, CBM)** löst eine Maßnahme aus, wenn ein Messwert eine Grenze überschreitet. "Gesamtschwingung über Voralarm: innerhalb von sieben Tagen prüfen."
- **Predictive Maintenance (PdM)** ergänzt eine Prognose. "Bei der aktuellen Anstiegsrate erreicht das Lager in etwa fünf Wochen die Hauptalarmgrenze: im Stillstand in drei Wochen tauschen."

In der Praxis ist PdM gleich CBM plus Trendverfolgung plus Prognose. Die ISO behandelt den Prognoseteil separat in ihrer Leitlinie zur Prognostik, ISO 13381-1, die beschreibt, wie man die Restlebensdauer aus Trends und Modellen schätzt [5]. Die Ausgabe 2015 wurde im Dezember 2021 zurückgezogen; eine dritte Ausgabe (ISO/DIS 13381-1) befindet sich im Stadium des Draft International Standard und wird sie ersetzen [31]. Der Schwesterleitfaden zu [Azure in der Fertigung](https://www.m365.fm/learn/manufacturing-it-azure/) verwendet dieselbe Unterscheidung in seiner Tabelle der Anwendungsfälle, sodass beide Artikel konsistent bleiben.

### Was Predictive Maintenance nicht ist

- **Nur ein Sensorkauf.** Ein Sensor ohne abgestimmte Alarmgrenze, ohne Verantwortlichen und ohne Verbindung zum Auftragssystem erzeugt Grafiken, die niemand liest.
- **Ein Ersatz für die Grundpflege.** Reinigen, Schmieren, Nachziehen und Inspizieren durch die Werker, die Säule der autonomen Instandhaltung im [Total Productive Maintenance](https://www.m365.fm/learn/tpm-oee/) (geplant), beseitigt viele Ausfallursachen, die kein Sensor vorhersagen muss.
- **Zwangsläufig KI.** Ein großer Teil des Nutzens entsteht aus einfachen Trends auf gut gewählten Signalen. Machine Learning wird nützlich, wenn die Zahl der Anlagen und Signale über das hinauswächst, was Analysten beobachten können.

## Was ist IIoT und wie ermöglicht es Predictive Maintenance?

Das Industrial Internet of Things (IIoT) ist das Netz aus Sensoren, Steuerungen, Gateways und Software, das Daten von Industrieanlagen erfasst und für Analytics und Geschäftssysteme verfügbar macht. Für die Instandhaltung hat das IIoT zwei wirtschaftliche Größen verändert.

**Erstens sind die Kosten je Messstelle gesunken.** Klassische Zustandsüberwachung bedeutete entweder einen Analysten, der einmal im Monat mit einem tragbaren Datensammler eine Messroute abläuft, oder fest verdrahtete Schutzsysteme an wenigen großen Turbinen und Verdichtern. Batteriebetriebene Funksensoren, die Schwingung und Temperatur messen und mehrmals täglich melden, machen eine kontinuierliche Überwachung heute auch an mittelgroßen Motoren, Pumpen, Ventilatoren und Getrieben möglich, die vorher monatlich oder gar nicht geprüft wurden.

**Zweitens lassen sich die Daten verknüpfen.** Standardprotokolle sorgen dafür, dass ein Sensorwert, ein SPS-Datenpunkt wie Motordrehzahl oder Produktcode und ein Auftrag im Instandhaltungssystem in einem Datenmodell zusammenkommen. OPC UA liefert ein Informationsmodell und einen sicheren Transport für Maschinendaten [6]; MQTT, ein OASIS-Standard, ist ein schlankes Publish/Subscribe-Protokoll, das häufig genutzt wird, um diese Daten vom Edge zu einem Broker oder in die Cloud zu bringen [7]. Ohne diesen Kontext sieht ein Analysewerkzeug eine Spitze in der Schwingung; mit ihm sieht es, dass die Spitze nur bei Produkt B unter voller Drehzahl auftritt, was ein Prozessthema ist und kein schadhaftes Lager.

IIoT macht die Physik nicht einfacher. Ein Sensor, der einmal pro Minute abtastet, kann keine Lagerschadensfrequenz bei 106 Hz sehen; ein Temperaturfühler am Motorgehäuse erkennt eine schadhafte Wicklung erst lange nach der Stromsignatur. Die richtige Messung für die jeweilige Ausfallart zu wählen, bleibt Aufgabe des Ingenieurs, und die nächsten Abschnitte zeigen, wie.

## Instandhaltungsstrategien im Vergleich: reaktiv, präventiv, zustandsorientiert, vorausschauend, präskriptiv

Die meisten Werke betreiben eine Mischung von Strategien, und das ist richtig so. Die Frage lautet nicht "welche Strategie ist die beste", sondern "welche Strategie passt zu welcher Ausfallart an welcher Anlage". Der DOE-Leitfaden beziffert die Mischung einer durchschnittlichen Einrichtung auf mehr als 55 % reaktiv, 31 % präventiv, 12 % vorausschauend und 2 % Sonstiges und folgert daraus, dass sich die meisten Einrichtungen noch weit stärker auf Betrieb bis zum Ausfall verlassen, als sie beabsichtigen [2]. Diese Aufteilung ist etwa 25 Jahre alt und ihre Umfragebasis wird nicht genannt; sie taugt als Bild des Ausgangspunkts, nicht als Benchmark.

| Strategie | Auslöser | Typisch benötigte Daten | Passt, wenn | Hauptrisiko |
|---|---|---|---|---|
| Reaktiv (Betrieb bis zum Ausfall, Run-to-failure) | Ausfall | Keine | Der Ausfall ist billig, ungefährlich und stoppt nicht den Engpass (Leuchtmittel, kleine redundante Pumpen) | Ungeplanter Stillstand, Folgeschäden, Sicherheitsvorfälle |
| Präventiv (zeit- oder nutzungsabhängig) | Kalender, Betriebsstunden, Zyklen | Stunden, Zählerstände | Der Verschleiß ist altersbedingt und vorhersehbar (Filter, Riemen, Schmierung, manche Dichtungen) | Überinstandhaltung und Ausfälle, die durch eingreifende Arbeiten entstehen |
| Zustandsorientiert | Messwert überschreitet eine Grenze | Zustandssignal, Alarmgrenzen | Ein messbares Symptom geht dem Ausfall voraus | Schlecht gesetzte Grenzen: zu viele Fehlalarme oder späte Erkennung |
| Vorausschauend (Predictive) | Prognose, wann der Zustand eine Grenze erreicht | Zustandstrend, Betriebskontext, idealerweise Ausfallhistorie | Der Ausfall ist teuer, die Vorwarnzeit lang genug, und eine geplante Reparatur ist viel günstiger als eine ungeplante | Investition ohne funktionierenden Reaktionsprozess |
| Präskriptiv | Empfohlene Maßnahme mit Optionen und Folgen | Alles oben Genannte plus Wissen über Ursachen und Maßnahmen | Reife Programme mit großer, codierter Historie | Blackbox-Empfehlungen, denen Techniker nicht vertrauen |
| Zuverlässigkeitsorientierte Instandhaltung (Reliability-centered Maintenance, RCM) | Strukturierte Analyse, die je Ausfallart eine der obigen Strategien auswählt | Funktion, Ausfallarten, Folgen | Sicherheits- oder verfügbarkeitskritische Systeme; auch als Methode zum Aufbau jedes Programms | Analyseaufwand; Papierübungen ohne Umsetzung |

### Vorausschauende vs. präventive Wartung auf einen Blick

| Frage | Präventive Wartung | Vorausschauende Wartung |
|---|---|---|
| Wann wird gearbeitet? | In festen Intervallen von Zeit, Stunden oder Zyklen | Wenn der gemessene Zustand einen sich anbahnenden Fehler zeigt |
| Was wird gebraucht? | Ein Plan und eine Aufgabenliste | Messungen, Alarmgrenzen, Analyse und ein Reaktionsprozess |
| Stärke | Einfach zu planen, funktioniert bei altersbedingtem Verschleiß | Nutzt den größten Teil der Lebensdauer eines Bauteils, findet Fehler, die Intervalle übersehen |
| Schwäche | Tauscht gute Teile, übersieht zufällige Ausfälle, kann durch eingreifende Arbeiten Fehler verursachen | Investition in Sensoren, Qualifikation und Daten; nutzlos, wo Ausfälle keine Vorwarnung geben |
| Typisches Beispiel | Filterwechsel alle 3 Monate | Lagertausch, wenn die Außenring-Schadensfrequenz zu steigen beginnt |

### Was der DOE-Leitfaden zu Einsparungen sagt

Der O&M-Leitfaden des DOE (Release 2.0, 2002, erstellt vom Pacific Northwest National Laboratory; Release 3.0 folgte im August 2010) liefert die am häufigsten kopierten Zahlen auf diesem Gebiet [2][3][8]:

- Präventive Wartung kann gegenüber einem rein reaktiven Programm "im Durchschnitt bis zu 12 % bis 18 %" einsparen ("as much as 12% to 18% on the average").
- Ein funktionierendes Predictive-Maintenance-Programm "kann eine Einsparung von 8 % bis 12 %" gegenüber rein präventiver Wartung bringen ("can provide a savings of 8% to 12%"), und manche Organisationen "könnten leicht Einsparpotenziale von über 30 % bis 40 % erkennen" ("could easily recognize savings opportunities exceeding 30% to 40%").
- Für Branchendurchschnitte werden "unabhängige Umfragen" ("independent surveys") zitiert: Return on Investment vom 10-Fachen, 25 % bis 30 % geringere Instandhaltungskosten, 70 % bis 75 % weniger Ausfälle, 35 % bis 45 % weniger Stillstand und 20 % bis 25 % mehr Produktion.

Zu diesen Zahlen gehören zwei Vorbehalte. Der Leitfaden nennt die Umfragen nicht, und seine Liste der Vorteile vorausschauender Wartung enthält einen Formulierungsfehler ("savings over predictive maintenance program", obwohl im Text präventive Wartung gemeint ist) [2]. Wenn heute auf einer Anbieterseite "25 % bis 30 %", "70 % bis 75 %" und "35 % bis 45 %" stehen, gehen sie sehr oft auf genau diese eine Liste ohne Quelle zurück. Es sind plausible Größenordnungen für ein gut geführtes Programm, kein Beleg für das eigene Werk.

### Strategie je Ausfallart wählen

Eine einfache Entscheidungsfolge, angelehnt an die RCM-Logik, funktioniert für die meisten Anlagen:

1. **Hat die Ausfallart Folgen für Sicherheit oder Umwelt?** Wenn ja, braucht es eine Maßnahme, die das Risiko auf ein akzeptables Maß senkt, oder eine Konstruktionsänderung. Betrieb bis zum Ausfall kommt nicht in Frage.
2. **Gibt es vor dem Funktionsausfall eine erkennbare Vorwarnung (einen potenziellen Ausfall, P)?** Wenn ja und die Vorwarnzeit lang und gleichmäßig genug ist, ist zustandsorientierte oder vorausschauende Instandhaltung die erste Wahl.
3. **Wenn nicht: Ist der Ausfall altersbedingt?** Steigt die Ausfallwahrscheinlichkeit deutlich mit Alter oder Nutzung, kann ein zeit- oder nutzungsabhängiger Tausch funktionieren.
4. **Trifft beides nicht zu: Sind die Folgen akzeptabel?** Dann bewusst bis zum Ausfall betreiben, mit Ersatzteilen und einem schnellen Reparaturablauf. Andernfalls konstruktiv ändern oder Redundanz schaffen.

RCM als formale Methode stammt aus der zivilen Luftfahrt der USA. F. Stanley Nowlan und Howard F. Heap von United Airlines schrieben 1978 den Bericht *Reliability-Centered Maintenance* für das US-Verteidigungsministerium [9]; SAE JA1011 (1998) legte später Mindestkriterien fest, die ein Prozess erfüllen muss, um als RCM zu gelten [10]. Leser aus der Luftfahrt erkennen dieselbe Logik in der Entwicklung von Instandhaltungsprogrammen; zur Planungsseite siehe den Leitfaden [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/).

## Wie Maschinen ausfallen: P-F-Kurve und die sechs Ausfallmuster

### Die P-F-Kurve

Die P-F-Kurve zeigt den Zustand einer Anlage über die Zeit. Irgendwann beginnt ein Schaden. Etwas später wird er mit einem bestimmten Verfahren erkennbar: Das ist der **Punkt des potenziellen Ausfalls (P)**. Der Zustand verschlechtert sich weiter, bis die Anlage ihre Funktion nicht mehr erfüllen kann: der **Punkt des Funktionsausfalls (F)**. Die Zeit zwischen P und F ist das **P-F-Intervall**.

Drei Eigenschaften der P-F-Kurve bestimmen jede Entscheidung in der vorausschauenden Instandhaltung:

1. **Jedes Verfahren hat seinen eigenen P-Punkt.** Schwingungsanalyse oder Ultraschall erkennen einen Wälzlagerschaden typischerweise lange bevor das Lager heiß wird; eine Wärmebildkamera sieht ihn später; ein Techniker hört und fühlt ihn zuletzt. Je früher der P-Punkt, desto länger die Vorwarnung und desto mehr Planungsspielraum.
2. **Das P-F-Intervall schwankt.** Dieselbe Ausfallart kann sich an einem gering belasteten Ventilator über Monate und an einem hoch belasteten, schlecht geschmierten Getriebe über Tage entwickeln. Mit einer vorsichtigen Schätzung planen, nicht mit dem Durchschnitt.
3. **Die nutzbare Vorwarnung ist kürzer als das P-F-Intervall.** Es geht die Zeit zwischen zwei Inspektionen verloren und die Zeit, die man braucht, um Teile zu bestellen, die Arbeit zu planen und auszuführen.

### Rechenbeispiel: Reicht eine monatliche Schwingungsroute?

Ein Werk überwacht das Lager eines Ventilatormotors mit 75 kW (100 hp) mit einem tragbaren Schwingungsdatensammler. Die Erfahrung an ähnlichen Ventilatoren spricht für ein P-F-Intervall von etwa 8 Wochen für Außenringschäden, die über Schwingung erkannt werden (eine Annahme für dieses Beispiel; eigene Belege sammeln).

- Inspektionsintervall: monatliche Route, etwa 4,3 Wochen.
- Ungünstigster Fall: Der Schaden wird am Tag nach einer Messung erkennbar. Er wird bei der nächsten Route gefunden, 4,3 Wochen später.
- Verbleibende Vorwarnung: 8,0 − 4,3 = **3,7 Wochen** (das "Netto-P-F-Intervall").
- Benötigte Zeit zum Handeln: 2 Wochen Lieferzeit für einen Lagersatz und 1 Woche, um die Arbeit in einen geplanten Stillstand einzutakten = 3 Wochen.
- Reserve: 3,7 − 3,0 = **0,7 Wochen**. Die Route funktioniert, aber knapp.

Bei einer Quartalsroute (13 Wochen) könnte sich der Schaden zwischen zwei Messungen von P bis F entwickeln. Die Überwachung sähe auf dem Papier beschäftigt aus und würde den Ausfall nur durch Glück erkennen. Eine verbreitete Faustregel der Zuverlässigkeitstechnik lautet, höchstens im halben P-F-Intervall zu inspizieren, hier also alle 4 Wochen oder öfter [unbelegt als formale Norm; es ist eine Konvention aus der Praxis]. Ein Funksensor, der mehrmals täglich meldet, beseitigt den Verlust durch das Inspektionsintervall fast vollständig. Das ist das wichtigste betriebliche Argument für eine kontinuierliche IIoT-Überwachung an Anlagen mit kurzen oder unsicheren P-F-Intervallen.

> **Formel: Netto-P-F-Intervall = P-F-Intervall − Inspektionsintervall.** Die Maßnahme ist nur dann technisch machbar, wenn das Netto-P-F-Intervall länger ist als die Zeit, die man zum Planen und Ausführen der Reparatur braucht.

### Die sechs Ausfallmuster

Die Studie von Nowlan und Heap wertete Ausfalldaten von Bauteilen ziviler Verkehrsflugzeuge aus und stellte fest, dass die meisten Komponenten nicht das "Badewannen"- oder Verschleißverhalten zeigten, das zeitbasierte Überholungen voraussetzen. Die RCM-Literatur fasst die Ergebnisse als sechs Muster zwischen Alter und Zuverlässigkeit zusammen, vom Verschleiß (Ausfallwahrscheinlichkeit steigt mit dem Alter) über zufällige Ausfälle (konstante Wahrscheinlichkeit) bis zu Frühausfällen (hohe Wahrscheinlichkeit direkt nach Einbau oder Überholung) [10].

| Muster | Verlauf | Bedeutung für die Strategie |
|---|---|---|
| A: Badewanne | Frühausfälle, dann konstant, dann Verschleiß | Zeitbasierter Tausch kann spät im Lebenszyklus helfen, aber Vorsicht vor verursachten Frühausfällen |
| B: Verschleiß | Konstant oder langsam steigend, dann eine klare Verschleißzone | Klassischer Fall für zeit- oder nutzungsabhängigen Tausch |
| C: allmähliche Alterung | Langsam steigende Wahrscheinlichkeit, kein klares Verschleißalter | Zustandsüberwachung besser als feste Intervalle |
| D: niedrig im Neuzustand, dann konstant | Schneller Anstieg auf ein konstantes Niveau | Zustandsüberwachung; zeitbasierter Tausch bringt wenig |
| E: zufällig | Konstante Wahrscheinlichkeit über die Lebensdauer | Zeitbasierter Tausch hilft nicht; Zustandsüberwachung oder Betrieb bis zum Ausfall |
| F: Frühausfälle, dann konstant | Hoch nach Einbau oder Überholung, dann konstant | Unnötige eingreifende Instandhaltung vermeiden; auf Einbauqualität achten |

Die Anteile der Muster in den Originaldaten (oft mit 4 %, 2 %, 5 %, 7 %, 14 % und 68 % für A bis F zitiert) werden in RCM-Schulungsunterlagen vielfach wiederholt. Eine Fachveröffentlichung zur Zuverlässigkeit, die Exhibit 2.13 des Berichts zitiert, nennt 4 % für A, 6 % für A und B zusammen und 5 % für C, wobei D, E und F den Großteil ausmachen [32]; das passt zu den 89 % aus dem Bericht selbst [9]. Die Aufteilung zwischen D, E und F (7 %, 14 %, 68 %) ist weiterhin [unbelegt gegenüber dem Originalbericht von 1978]. Der Bericht selbst (datiert auf den 29. Dezember 1978, erstellt von United Airlines für das Office of the Assistant Secretary of Defense) fasst das Ergebnis in seiner Diskussion der Ausfallmuster zusammen: In den ausgewerteten Daten "können 89 % der Komponenten nicht von einer Begrenzung des Betriebsalters profitieren" ("cannot benefit from a limit on operating age") [9]. Der allgemeinere Punkt ist in der Zuverlässigkeitsliteratur gut belegt: Bei komplexen Anlagen sind die meisten Ausfallarten nicht stark altersabhängig, sodass Überholungen in festen Intervallen sie nicht verhindern und neue Ausfälle verursachen können. Das ist die theoretische Grundlage der Zustandsüberwachung und zugleich eine Warnung: Ist eine Ausfallart zufällig und gibt keine Vorwarnung, verhindert sie weder präventive noch vorausschauende Instandhaltung.

## Verfahren der Zustandsüberwachung

Der O&M-Leitfaden des DOE (Release 3.0) widmet den Technologien der vorausschauenden Instandhaltung ein ganzes Kapitel und behandelt Thermografie, Schmierstoff- und Verschleißpartikelanalyse, Ultraschallanalyse, Schwingungsanalyse, Motoranalyse und Leistungstrends [3]. Dieselben sechs Verfahrensfamilien tauchen mit unterschiedlicher Gewichtung in jedem ernsthaften Condition-Monitoring-Programm auf. Die Tabelle ordnet sie den Ausfallarten zu, die sie am besten finden.

| Verfahren | Was es misst | Findet am besten | Typische Anlagen | Online (IIoT) oder Messroute |
|---|---|---|---|---|
| Schwingungsanalyse | Beschleunigung, Geschwindigkeit, Weg; Spektren und Zeitsignale | Unwucht, Fluchtungsfehler, Lose, Wälzlagerschäden, Probleme im Zahneingriff | Motoren, Pumpen, Ventilatoren, Getriebe, Verdichter, Spindeln | Beides; Funksensoren verbreitet für Trend und Alarm, Routen oder feste Systeme für die detaillierte Diagnose |
| Infrarot-Thermografie | Verteilung der Oberflächentemperatur | Lose oder korrodierte elektrische Verbindungen, überlastete Stromkreise, Schäden an Isolierung und Feuerfestauskleidung, zugesetzte Wärmetauscher, überhitzte Lager (spät) | Schaltanlagen, Motorsteuerzentralen (MCC), Schaltschränke, Motoren, Kondensatableiter, Öfen | Meist Messroute mit Kamera; feste Wärmebildkameras oder Punktsensoren für kritische Stellen |
| Öl- und Verschleißpartikelanalyse | Viskosität, Verunreinigung, Wasser, Oxidation, Verschleißmetalle, Partikelzahlen | Schmierstoffalterung, Verunreinigung, innerer Verschleiß von Getrieben, Hydraulik, Motoren | Getriebe, Hydrauliksysteme, Verdichter, Turbinen, Dieselmotoren | Meist Probe ins Labor; für kritische Systeme gibt es Inline-Sensoren für Partikel und Feuchte |
| Ultraschall (Luft- und Körperschall) | Hochfrequenter Schall oberhalb des menschlichen Hörbereichs | Druckluft- und Gasleckagen, defekte Kondensatableiter, frühe Schmierprobleme an Lagern, Lichtbögen, Kriechströme und Korona | Druckluftsysteme, Dampfsysteme, langsam drehende Lager, elektrische Betriebsmittel | Meist Messroute; Online-Sensoren für Schmierungsüberwachung und kritische Lager |
| Motorstrom- und elektrische Signaturanalyse (MCSA/ESA) | Strom- und Spannungsspektren der Motorversorgung | Gebrochene Läuferstäbe, Exzentrizität, manche Ständer- und Versorgungsprobleme; auch einige Fehler der angetriebenen Maschine | Asynchronmotoren, besonders schwer zugängliche (Tauchpumpen, Motoren hinter Schutzeinrichtungen) | Beides; gemessen in der Motorsteuerzentrale, was Arbeiten an der Maschine vermeidet |
| Leistungs- und Prozesstrends | Durchfluss, Druck, Leistung, Wirkungsgrad, Temperaturdifferenzen | Verschmutzung (Fouling), innere Leckage, Laufradverschleiß, Wirkungsgradverlust | Pumpen, Verdichter, Wärmetauscher, Kältemaschinen | Online aus SPS- und SCADA-Daten, oft bereits vorhanden |

### Schwingungsanalyse

Die Schwingungsanalyse ist das Rückgrat der meisten Programme für rotierende Maschinen, weil sie die meisten häufigen mechanischen Ausfallarten abdeckt. Es lohnt sich, drei Analysestufen zu unterscheiden:

1. **Trend des Gesamtpegels.** Eine einzelne Zahl, meist der Effektivwert der Schwinggeschwindigkeit in einem Frequenzband, wird über die Zeit verfolgt und mit Alarmgrenzen verglichen. ISO 20816-1 legt allgemeine Bedingungen und Verfahren für die Messung und Bewertung von Schwingungen an nicht rotierenden Teilen vollständiger Maschinen und an rotierenden Wellen fest, mit Bewertungskriterien, die sowohl auf der Schwingungsgröße als auch auf ihrer Änderung über die Zeit beruhen [11]. ISO 20816-3:2022 enthält die Kriterien für Industriemaschinen über 15 kW (etwa 20 hp) mit Drehzahlen zwischen 120 und 30.000 min⁻¹, etwa Motoren mit elastischen Kupplungen, Ventilatoren, Pumpen und Verdichter [12]. ISO 20816-3:2022 hat ISO 10816-3:2009 überarbeitet, die auf iso.org als zurückgezogen geführt wird [13]. Viele Werksverfahren nennen noch ISO 10816; prüfen, ob die eigenen Alarmgrenzen auf die aktuellen Dokumente verweisen.
2. **Spektralanalyse.** Eine schnelle Fourier-Transformation (FFT) zerlegt das Signal in Frequenzen. Unwucht zeigt sich bei 1× Drehfrequenz, Fluchtungsfehler oft bei 1× und 2×, Lagerschäden bei charakteristischen Frequenzen, die von der Lagergeometrie abhängen.
3. **Zeitsignal- und Hüllkurvenanalyse.** Frühe Lager- und Zahnradschäden erzeugen kurze Stöße, die im Spektrum verschmieren. Hüllkurvenverfahren (Demodulation) machen diese sich wiederholenden Stöße sichtbar, und erst sie erlauben es, Lagerprobleme früh auf der P-F-Kurve zu erkennen.

**Rechenbeispiel: Lagerschadensfrequenzen.** Die charakteristischen Frequenzen folgen aus der Kinematik des Lagers (Zahl der Wälzkörper n, Wälzkörperdurchmesser d, Teilkreisdurchmesser D, Druckwinkel φ, Wellenfrequenz f_r); es sind die üblichen kinematischen Formeln aus Unterlagen der Lagerhersteller und aus Schulungsliteratur zur Schwingungsanalyse (Formeln wie im Glossar eines Anbieters für Zustandsüberwachung veröffentlicht [35]; die Applikationsschrift von SKF verwendet für BPFO dieselben Variablen [36]; für das eigene Lager die Schadensfrequenzen des Lieferanten verwenden):

- Überrollfrequenz Außenring: BPFO = (n ÷ 2) × f_r × (1 − (d ÷ D) × cos φ)
- Überrollfrequenz Innenring: BPFI = (n ÷ 2) × f_r × (1 + (d ÷ D) × cos φ)
- Käfigfrequenz: FTF = (f_r ÷ 2) × (1 − (d ÷ D) × cos φ)

Für einen Motor mit 1.780 min⁻¹ (f_r = 29,67 Hz) mit einem Rillenkugellager mit n = 9 Kugeln, d = 7,94 mm, D = 39,04 mm und φ = 0° (beispielhafte Geometrie; für das eigene Lager die Herstellerdaten verwenden):

- d ÷ D = 0,2034
- BPFO = 4,5 × 29,67 × 0,7966 = **106,3 Hz** (3,58 × Drehfrequenz)
- BPFI = 4,5 × 29,67 × 1,2034 = **160,7 Hz** (5,42 × Drehfrequenz)
- FTF = 14,83 × 0,7966 = **11,8 Hz**

Daraus folgen zwei praktische Konsequenzen. Ein Sensor, der nur alle paar Stunden einen Gesamtwert meldet, kann nicht sagen, welche dieser Frequenzen steigt; für eine Diagnose braucht es mindestens periodische Spektren oder Hüllkurvenwerte. Und um 160 Hz mit ihren Harmonischen zu sehen, muss die Abtastrate deutlich über dem Doppelten der höchsten interessierenden Frequenz liegen (Nyquist-Kriterium). Ein Funksensor, der mit einigen hundert Hertz abtastet, ist also ein Trendgerät, kein Diagnosegerät.

### Infrarot-Thermografie

Die Thermografie zeigt mit einer Infrarotkamera Temperaturunterschiede. Sie ist schnell, berührungslos und deckt Anlagen ab, die die Schwingungsanalyse nicht erfasst, vor allem die elektrische Energieverteilung. Ein klassischer Befund ist ein Hotspot an einer Phase eines Schalteranschlusses im Vergleich zu den beiden anderen Phasen bei ähnlicher Last.

In den USA prägt NFPA 70B, *Standard for Electrical Equipment Maintenance*, die elektrischen Instandhaltungsprogramme; die National Fire Protection Association hat sie mit der Ausgabe 2023 von einer empfohlenen Praxis zu einer Norm gemacht [14]. Einrichtungen, die sie übernehmen oder deren Versicherer sie verlangen, planen thermografische Begehungen unter Spannung stehender Anlagen als Teil des elektrischen Instandhaltungsprogramms. Die Thermografie unter Spannung stehender Anlagen fällt außerdem unter die Regeln der elektrischen Sicherheit für Arbeiten in der Nähe aktiver Teile (in den USA typischerweise NFPA 70E, deren Annäherungsgrenzen für elektrischen Schlag, Lichtbogengrenze und PSA-Regeln ein Schulungsanbieter für Thermografie auf Infrarotbegehungen unter Spannung anwendet [33]). Das Vorgehen bei der Begehung (Abdeckungen öffnen, Infrarotfenster, Annäherungsgrenzen, PSA) ist deshalb eine Sicherheitsentscheidung, nicht nur eine technische.

Grenzen: Die Thermografie sieht Oberflächen, braucht Last auf der Anlage, um Probleme zu zeigen, und ist empfindlich gegenüber Emissionsgrad, Reflexionen und Wind. Der Vergleich von Gleichem mit Gleichem (Phase mit Phase, Motor mit baugleichem Motor) ist verlässlicher als absolute Temperaturen.

### Öl- und Verschleißpartikelanalyse

Bei Getrieben, Hydrauliksystemen, Verdichtern und Motoren trägt der Schmierstoff Informationen sowohl über seinen eigenen Zustand als auch über den inneren Verschleiß der Maschine. Ein typischer Laborbericht umfasst Viskosität, Wassergehalt, Säurezahl oder Oxidation, Elementanalyse der Verschleißmetalle (Eisen, Kupfer, Chrom und andere) und Verunreinigungen (Silizium aus Schmutz) sowie Partikelzahlen. Die Partikelreinheit wird üblicherweise als ISO-4406-Code angegeben, drei Zahlen, die für die Partikelzahl je Milliliter oberhalb von drei Größenschwellen stehen (4 µm(c), 6 µm(c) und 14 µm(c) für automatische Partikelzähler in der aktuellen vierten Ausgabe ISO 4406:2021 [34]).

Was die Ölanalyse in der Praxis funktionieren lässt:

- **Gleichbleibende Probenahme.** Gleiche Stelle, gleiches Verfahren, Maschine in Betrieb und warm, saubere Probenahmeventile. Eine schlechte Probe liefert eine überzeugend falsche Antwort.
- **Trends, keine Einzelwerte.** Eisen mit 40 ppm sagt allein wenig; eine Verdopplung des Eisengehalts zwischen zwei Proben bei ähnlichen Betriebsstunden sagt viel.
- **Auf Verunreinigung reagieren.** Viele schmierstoffbedingte Ausfälle beginnen mit Schmutz und Wasser. Die Ölanalyse zahlt sich doppelt aus, wenn sie zu besserer Filtration, Belüftungsfiltern und Lagerung führt; das ist proaktive Instandhaltung, keine Vorhersage.

Für kritische Systeme gibt es Inline-Ölsensoren (Partikelzähler, Feuchte-, Dielektrizitätssensoren), aber für die meisten Werke ist ein Laborprogramm mit einer Probe alle ein bis drei Monate an den kritischen Getrieben und Hydraulikaggregaten die kostengünstige Grundlage.

### Ultraschall

Ultraschallgeräte wandeln hochfrequenten Schall (oberhalb des menschlichen Hörbereichs) in ein hörbares Signal und einen Dezibelwert um. Ihre stärksten Anwendungen sind:

- **Erkennung von Druckluft- und Gasleckagen,** was ebenso ein Energie- wie ein Instandhaltungsprogramm ist; der O&M-Leitfaden des DOE nennt Energieverluste durch Dampf-, Wasser- und Luftleckagen unter den typischen Folgen schlechter Betriebsführung und Instandhaltung [2].
- **Prüfung von Kondensatableitern.**
- **Schmierung von Lagern:** Nachschmieren, bis der Ultraschallwert sinkt, statt einer festen Zahl von Hüben, vermeidet sowohl Unter- als auch Überschmierung.
- **Langsam drehende Lager,** bei denen die Schwingungsanalyse wegen der geringen Stoßenergie an Grenzen stößt.
- **Elektrische Inspektion** auf Lichtbögen, Kriechströme und Korona, oft durch geschlossene Schaltschränke.

Ultraschall ist günstig im Einstieg, leicht zu schulen und oft das erste Verfahren, das ein kleines Werk nach der Thermografie ergänzt.

### Motorstrom- und elektrische Signaturanalyse (MCSA/ESA)

Die MCSA misst den Strom, den ein Asynchronmotor aufnimmt, meist in der Motorsteuerzentrale, und analysiert sein Spektrum. Gebrochene Läuferstäbe zum Beispiel werden üblicherweise als Seitenbänder um die Netzfrequenz im Abstand der doppelten Schlupffrequenz beschrieben, also bei (1 ± 2s) × f_s für Schlupf s und Netzfrequenz f_s [37]. Weil die Messung in der MCC erfolgt, eignet sie sich für Motoren, die schwer oder nur unter Gefahr zugänglich sind: Tauchpumpen, Motoren auf hohen Bühnen, Anlagen hinter Schutzeinrichtungen. Die elektrische Signaturanalyse ergänzt die Spannung und kann Probleme der Netzqualität und manche Probleme der angetriebenen Last aufdecken. Die Motorstromsignaturanalyse wird in allgemeinen Nachschlagewerken neben Schwingung, Ultraschall, Infrarot und Ölanalyse zu den etablierten Verfahren der vorausschauenden Instandhaltung gezählt [15].

Die MCSA ergänzt die Schwingungsanalyse, sie ersetzt sie nicht. Ein Lagerschaden, der in einem Hüllkurvenspektrum offensichtlich ist, kann im Strom unsichtbar sein, und ein Läuferproblem, das im Strom klar ist, kann in der Schwingung mehrdeutig sein.

### Leistungs- und Prozesstrends

Die günstigsten Zustandsdaten liegen oft schon in der SPS oder im SCADA-System: Motorstrom, Förderdruck, Durchfluss, Differenzdruck über einem Filter, Temperaturanstieg über einem Wärmetauscher. Eine Kreiselpumpe, deren Strom steigt, während der Durchfluss sinkt, sagt etwas über Verschleiß, Rezirkulation oder die Anlagenkennlinie. Ein Filter mit stetig steigendem Differenzdruck kann zum richtigen Zeitpunkt statt jeden Monat gewechselt werden. Die IIoT-Anbindung macht diese Daten für die Instandhaltung nutzbar, indem sie sie in dasselbe Modell holt wie die eigens installierten Zustandssensoren.

### Online-Sensoren oder Messroute?

| Kriterium | Online (fest installiert, IIoT) | Messroute (tragbarer Datensammler, Kamera, Probenahme) |
|---|---|---|
| Kostenstruktur | Kosten je Messstelle (Sensor, Gateway, Abo) | Kosten je Routenstunde (Zeit des Analysten) |
| Inspektionsintervall | Minuten bis Stunden | Wochen bis Monate |
| Am besten für | Kritische Anlagen, kurze oder unsichere P-F-Intervalle, schwer zugängliche oder gefährliche Orte | Große Zahl weniger kritischer Anlagen, Verfahren, die eine Fachkraft brauchen (Thermografie, detaillierte Diagnose) |
| Datenqualität | Jedes Mal gleiche Stelle, gleiche Befestigung | Hängt von der Disziplin des Messenden ab (Ort, Befestigung, Betriebszustand) |
| Schwäche | Flotte aus Sensoren und Batterien zu verwalten, begrenzte Bandbreite für Rohdaten | Übersieht sich schnell entwickelnde Fehler zwischen den Routen |

Die meisten Werke landen bei beidem: Online-Sensoren an den obersten 10 % bis 20 % der Anlagen nach Kritikalität, Routen für den Rest.

### Mit welchen Verfahren beginnen

| Werksprofil | Sinnvolle erste Verfahren | Warum |
|---|---|---|
| Diskreter Fertiger mit vielen Motoren, Pumpen, Ventilatoren, Förderern | Schwingung (Funk an kritischen Anlagen, Route für den Rest), Thermografie für die Elektrik | Deckt die häufigsten mechanischen und elektrischen Ausfallarten ab |
| Prozessanlage mit Getrieben, Hydraulik, Verdichtern | Ölanalyse, Schwingung, Leistungstrends | Innerer Verschleiß und Schmierung treiben die Ausfälle |
| Werk mit großen Druckluft- oder Dampfsystemen | Ultraschall, Thermografie | Energieeinsparungen finanzieren das Programm |
| Viele unzugängliche Motoren oder Tauchmotoren | MCSA plus Schwingung, wo erreichbar | Die Messung in der MCC vermeidet Zugangsprobleme |

### Beispiele für Predictive Maintenance nach Anlagentyp

| Anlage | Vorherrschende Ausfallart | Vorbote | Verfahren | Typische Maßnahme |
|---|---|---|---|---|
| Motorlager eines Ventilators oder einer Pumpe | Wälzermüdung, Schmierungsversagen | Steigender Hüllkurvenwert, Schadensfrequenzen (BPFO, BPFI) | Schwingung, Ultraschall | Nachschmieren oder Lager beim nächsten geplanten Stillstand tauschen |
| Getriebe | Zahnverschleiß, Verunreinigung | Steigendes Eisen und Silizium im Öl, Seitenbänder um die Zahneingriffsfrequenz | Ölanalyse, Schwingung | Öl und Belüftungsfilter wechseln, Inspektion der Verzahnung planen |
| Anschluss in der Schaltanlage | Lose oder korrodierte Verbindung | Hotspot an einer Phase im Vergleich zu den anderen | Thermografie | Verbindung während einer Abschaltung nachziehen oder ersetzen |
| Druckluftsystem | Leckagen | Ultraschallsignatur an Verschraubungen und Schläuchen | Ultraschall | Leckagen in einer geplanten Begehung markieren und beheben |
| Tauchpumpenmotor | Läufer- oder Ständerschäden | Veränderungen im Stromspektrum | MCSA | Ziehen und instand setzen, bevor die Wicklung ausfällt |
| Wärmetauscher | Verschmutzung (Fouling) | Sinkende Temperaturdifferenz bei konstantem Durchfluss | Leistungstrends | Reinigung einplanen |

## IIoT-Architektur für Predictive Maintenance

ISO 13374 legt allgemeine Leitlinien dafür fest, wie Informationen aus Zustandsüberwachung und Diagnose verarbeitet, übermittelt und dargestellt werden, damit Software verschiedener Anbieter zusammenarbeiten kann [16]. Die Norm definiert sechs Funktionsblöcke eines Zustandsüberwachungssystems, und die Spezifikation MIMOSA OSA-CBM setzt sie mit Datenstrukturen und Schnittstellen um [17]. Die Blöcke werden meist als Datenerfassung, Datenaufbereitung (zum Beispiel Filterung und Merkmalsextraktion), Zustandserkennung, Bewertung des Gesundheitszustands, Prognose und Erstellung von Handlungsempfehlungen bezeichnet. Diese Kette lässt sich gut auf einen modernen IIoT-Stack abbilden, den wir hier in fünf Schichten beschreiben.

| Schicht | Was passiert | Typische Komponenten | Designfragen |
|---|---|---|---|
| 1. Sensorik | Physikalisches Signal wird zum digitalen Wert | Beschleunigungsaufnehmer, Temperaturfühler, Stromwandler, Ultraschallsensoren, Ölsensoren; vorhandene SPS-Datenpunkte | Welche Ausfallart, welches Signal, welche Abtastrate, welche Befestigung? |
| 2. Edge | Erfassen, zwischenspeichern, Merkmale berechnen, erste Regeln anwenden | Funk-Gateways, Industrie-PCs, Edge-Laufzeitumgebungen, SPS | Was bleibt lokal, was wird gesendet, was passiert bei Ausfall der Verbindung nach oben? |
| 3. Konnektivität | Daten mit Kontext und Sicherheit transportieren | OPC UA, MQTT (oft mit Sparkplug B), Modbus TCP oder herstellereigene Protokolle an der Maschine, Funk (proprietär, WLAN, Mobilfunk, LoRaWAN) | Welches Protokoll je Abschnitt, wem gehört der Broker, wie werden Geräte authentifiziert? |
| 4. Datenplattform | Zeitreihen speichern, mit Kontext verknüpfen, Analytics und Modelle ausführen | Historian, Zeitreihendatenbank, Data Lake, Cloud-Dienste für IoT und Analytics | Ein Datenmodell über alle Werke? Aufbewahrung? Wer darf abfragen? |
| 5. Maßnahme | Aus einem Befund geplante Arbeit und Rückmeldung machen | CMMS oder EAM, MES, mobile Apps, Dashboards, Benachrichtigungswerkzeuge | Wer bekommt den Alarm, wie wird daraus ein Auftrag, wie fließt das Ergebnis zurück? |

### Schicht 1: Sensorik

**Kabelgebunden oder Funk.** Fest verdrahtete Beschleunigungsaufnehmer an einem Überwachungssystem bleiben die Wahl für den Maschinenschutz (Abschaltungen) an großen Turbomaschinen und für hochfrequente Diagnosedaten. Batteriebetriebene Funksensoren passen zum großen Mittelfeld der Anlagen: Motoren, Pumpen, Ventilatoren und Getriebe, bei denen Trenddaten mehrmals täglich genügen und eine Verkabelung mehr kosten würde als der Sensor. Die Batterielebensdauer hängt stark vom Meldeintervall ab und davon, wie oft der Sensor Rohsignale statt zusammenfassender Werte sendet; beim Anbieter die Batterielebensdauer für die tatsächlich geplante Konfiguration erfragen.

**Die Befestigung ist entscheidend.** Die Messwerte von Beschleunigungsaufnehmern hängen davon ab, wie der Sensor befestigt ist. Eine Stiftschraube liefert den besten Frequenzgang; eine Klebebefestigung kommt für viele Anwendungen nahe heran; Magnete sind für Routen bequem, begrenzen aber den nutzbaren Frequenzbereich. Am Lagergehäuse montieren, nach Möglichkeit in der Lastzone, und den genauen Ort und die Ausrichtung dokumentieren, damit spätere Messwerte vergleichbar sind.

**Vorhandenes nutzen.** Frequenzumrichter kennen Motorstrom, Drehzahl und Drehmoment; SPS kennen Zustände, Rezepte und Zähler; viele neuere Maschinen stellen Zustandsdaten über OPC UA bereit. Wer diese zuerst abgreift, hat oft schon ein brauchbares Bild, bevor der erste neue Sensor montiert ist.

### Schicht 2: Edge

Die Edge-Schicht gibt es, weil rohe Zustandsdaten umfangreich sind und das Netz nicht immer verfügbar ist. Eine kurze Rechnung zeigt, warum.

**Rechenbeispiel: Datenvolumen.** Ein Schwingungskanal, der mit 25,6 kHz und 16 Bit Auflösung abgetastet wird, erzeugt 25.600 × 2 Byte = 51,2 kB pro Sekunde.

- Kontinuierlich gestreamt: 51,2 kB × 86.400 s = **4,4 GB pro Tag und Kanal**. Bei 200 Kanälen etwa **885 GB pro Tag**.
- Ein Ausschnitt von einer Sekunde pro Stunde: 51,2 kB × 24 = **1,2 MB pro Tag und Kanal**.
- Zehn Merkmale (Effektivwert, Spitzenwert, Crestfaktor, Kurtosis, Bandenergien) alle zehn Minuten als 4-Byte-Werte: 10 × 4 Byte × 144 = **5,8 kB pro Tag und Kanal**, vor Protokoll-Overhead.

Ein kontinuierliches Streaming der Rohdaten in die Cloud ist selten gerechtfertigt. Ein verbreitetes Muster: Merkmale am Edge laufend berechnen, Merkmale und Alarme nach oben senden, kurze Rohsignale speichern, wenn eine Regel anschlägt oder nach Zeitplan, und die Möglichkeit behalten, für eine Diagnose bei Bedarf mehr Rohdaten abzurufen.

Weitere Edge-Funktionen: Zwischenspeicherung bei Netzausfällen (Store and Forward), Zeitsynchronisation (den Quellzeitstempel jedes Werts und einen Zeitserver im Werk verwenden statt der Ankunftszeit in der Cloud), Protokollumsetzung von älteren Feldbussen auf OPC UA oder MQTT und einfache Regeln, die ohne Cloud funktionieren müssen, etwa ein lokaler Alarm.

### Schicht 3: Konnektivität und Protokolle

**OPC UA** ist eine plattformunabhängige, serviceorientierte Architektur, die 2008 veröffentlicht wurde und die Funktionen der älteren OPC-Classic-Spezifikationen in einem erweiterbaren Rahmen vereint. Ihre Informationsmodellierung macht aus Rohwerten strukturierte, typisierte Objekte, und ihr Sicherheitsmodell umfasst Verschlüsselung, Nachrichtensignatur und Authentifizierung über X.509-Zertifikate [6]. OPC UA definiert neben dem klassischen Client-Server-Modus auch einen Publish-Subscribe-Modus (PubSub) [6]. Für die Instandhaltung zählt das Informationsmodell ebenso wie der Transport: Eine Pumpe, die mit Typenschilddaten, Sensoren und Zuständen modelliert ist, lässt sich weit leichter analysieren als 40 lose Datenpunkte.

**MQTT** ist ein OASIS-Standard für Nachrichtenübertragung im Internet der Dinge, von seinen Betreuern als äußerst schlanker Publish/Subscribe-Transport beschrieben [7]. Geräte veröffentlichen auf Topics eines Brokers; Anwendungen abonnieren sie. Das Protokoll ist effizient in eingeschränkten Netzen und entkoppelt Erzeuger von Abnehmern. Reines MQTT legt nicht fest, was eine Nutzlast bedeutet. Die Eclipse-Sparkplug-Spezifikation (Version 3.0) ergänzt MQTT um industrielle Konventionen, darunter ein Zustandsmanagement über "Birth"- und "Death"-Zertifikate, die den Abonnenten mitteilen, ob die Daten eines Geräts noch gültig sind [18].

**Unified Namespace (UNS).** Viele IIoT-Projekte ordnen MQTT-Topics in einer Hierarchie im Stil von ISA-95 (Unternehmen, Standort, Bereich, Linie, Zelle, Anlage), sodass jedes System Daten in einer Struktur veröffentlicht und findet. ISA-95, auch als IEC 62264 veröffentlicht, definiert die Ebenen vom physischen Prozess (Ebene 0) und Erfassen und Steuern (Ebenen 1 und 2) über das Manufacturing Operations Management (Ebene 3) bis zur Geschäftsplanung (Ebene 4) [19]. Der UNS ist ein Architekturmuster, kein Standard; sein Wert hängt von der Governance der Namen und Datenmodelle ab. Der Leitfaden zu [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant) behandelt die Ebenen und die MOM-Funktionen einschließlich des Instandhaltungsmanagements ausführlicher.

| Abschnitt | Übliche Wahl | Warum |
|---|---|---|
| Sensor zum Gateway | Funkprotokoll des Herstellers, IO-Link, kabelgebunden analog oder digital | Optimiert für Batterielebensdauer und Sensortyp |
| Maschinensteuerung zum Edge | OPC UA Client-Server, Modbus TCP, native SPS-Treiber | Zugriff auf Datenpunkte, Zustände und Kontext |
| Edge zum Broker oder zur Plattform | MQTT (mit Sparkplug B oder einem definierten JSON-Schema), OPC UA PubSub | Schlank, ausgehende Verbindung, entkoppelte Abnehmer |
| Plattform zum CMMS/EAM | REST-API, Integrationsplattform, Herstellerkonnektor | Aufträge, Anlagenstammdaten, Fehlercodes |

### Schicht 4: Datenplattform

Ob die Plattform ein Historian im Werk, ein Cloud-Dienst oder beides ist: Drei Eigenschaften entscheiden, ob sie die Instandhaltung unterstützt:

1. **Anlagenzentriertes Datenmodell.** Jede Zeitreihe gehört zu einer Anlage mit einer stabilen Kennung, die der Anlagennummer im CMMS entspricht. Ohne diese Zuordnung lässt sich ein Schwingungstrend nicht mit der Auftragshistorie verknüpfen.
2. **Kontext neben dem Zustand.** Maschinenzustand (läuft, wartet, rüstet, steht), Drehzahl, Last, Produkt und Rezept werden mit denselben Zeitstempeln gespeichert. Die meisten Fehlalarme in der PdM kommen von Betriebsänderungen, von denen das Modell nichts wusste.
3. **Aufbewahrung passend zu den Ausfallzyklen.** Tritt die interessierende Ausfallart alle 18 Monate auf, wirft das Löschen der Rohhistorie nach 90 Tagen genau die Trainingsdaten weg, die man später braucht. Merkmale lange aufbewahren, Rohdaten gezielt.

Für eine Microsoft-basierte Plattform (Azure IoT Operations, Microsoft Fabric, Azure Machine Learning) ordnet der Leitfaden zu [Azure in der Fertigung](https://www.m365.fm/learn/manufacturing-it-azure/) jeder Schicht die aktuellen Dienste und ihren Status zu. Die Architektur in diesem Artikel ist bewusst herstellerneutral: Dieselben Schichten gelten für AWS, Siemens, PTC, Rockwell, Open-Source-Stacks oder einen Historian mit Analytics-Erweiterung.

### Schicht 5: Maßnahme und CMMS

Hier bleiben die meisten Predictive-Maintenance-Programme stecken. Ein Modell kann einen sich anbahnenden Fehler erkennen, aber der Nutzen entsteht erst, wenn jemand die richtige Reparatur zur richtigen Zeit plant und ausführt.

Ein minimaler geschlossener Regelkreis sieht so aus:

1. **Alarm mit Kontext:** Anlage, Messwert und Trend, vermutete Ausfallart, empfohlene Prüfung, Dringlichkeit (zum Beispiel "innerhalb von 7 Tagen").
2. **Bewertung durch einen Menschen:** Ein Zuverlässigkeitsingenieur oder geschulter Techniker bestätigt oder verwirft den Alarm. Verworfene Alarme werden codiert (Fehlalarm, Prozessänderung, Sensorfehler) und zurückgemeldet.
3. **Auftrag im CMMS:** mit der richtigen Priorität und Ausfallart angelegt, idealerweise automatisch aus dem bestätigten Alarm.
4. **Arbeitsvorbereitung und Terminierung:** Teile, Personal, Freigaben, Sperren (Lockout) und ein Platz in einem geplanten Stillstand.
5. **Ausführung und Rückmeldung des Befunds:** was der Techniker vorgefunden hat (Foto, Fehlercode, Zustand des ausgebauten Teils).
6. **Den Kreis schließen:** Der Befund labelt das Ereignis für künftige Analysen und bestätigt oder korrigiert die Alarmgrenze.

Die Schritte 2 und 6 machen aus einem Überwachungssystem ein lernendes System. Es sind auch die Schritte, die am häufigsten ausgelassen werden.

## Datenanforderungen: was vor jedem Modell da sein muss

Der Schwesterleitfaden zu [Azure in der Fertigung](https://www.m365.fm/learn/manufacturing-it-azure/) sagt es deutlich: Viele Predictive-Maintenance-Piloten scheitern, weil das Modell vor den Daten kommt. Hier ist die Checkliste, die wir verwenden; zu jedem Punkt gibt es einen Test, der sich an einem Tag durchführen lässt.

| Anforderung | Warum sie wichtig ist | Schnelltest |
|---|---|---|
| Sauberes Anlagenverzeichnis | Sensordaten müssen der Anlage im CMMS zugeordnet werden | 20 kritische Anlagen auswählen: Hat jede eine eindeutige Kennung, die im CMMS, im Historian und auf dem Typenschild-Etikett verwendet wird? |
| Ausfallhistorie mit Ausfallarten | Überwachte Modelle und die Validierung von Schwellenwerten brauchen Beispiele | Wie viele Aufträge der letzten 3 Jahre haben für die 10 wichtigsten Anlagen einen brauchbaren Fehlercode und eine Freitextbeschreibung, die sagt, was kaputt war? |
| Synchronisierte Zeitstempel | Ereignisse in verschiedenen Systemen müssen zusammenpassen | Einen bekannten Stopp im SPS-Protokoll, im MES und im CMMS vergleichen: Liegen sie innerhalb einer Minute? |
| Betriebskontext | Trennt Prozessänderungen von Verschlechterung | Lässt sich allein aus den Daten für jede Minute sagen, ob die Maschine lief, mit welcher Drehzahl und mit welchem Produkt? |
| Ausreichende Abtastung | Das Signal muss die Signatur des Ausfalls enthalten | Deckt die Abtastrate die berechneten Schadensfrequenzen ab? Passt das Meldeintervall zum P-F-Intervall? |
| Sensorzustand und Kalibrierung | Ein driftender, loser oder toter Sensor sieht aus wie ein Maschinenproblem oder verdeckt eines | Gibt es eine Prüfung auf eingefrorene, außerhalb des Bereichs liegende oder verrauschte Signale, eine Dokumentation von Befestigung und Kalibrierung und eine Regel, was nach einem Sensortausch passiert? |
| Referenzzeitraum | Legt fest, was "normal" ist | Liegen 2 bis 4 Wochen Daten in allen normalen Betriebszuständen vor (eine Spanne aus mehreren Praxisleitfäden in den aktuellen Suchergebnissen; an den eigenen Produktmix anpassen)? |
| Definierte Reaktion | Ohne Maßnahme ist eine Vorhersage eine Randnotiz | Gibt es für jeden Alarmtyp einen benannten Verantwortlichen und eine Reaktionszeit? |

### Fehlercodes: der versteckte Engpass

Die meisten Fehlerfelder im CMMS sind entweder leer, mit "Sonstiges" oder "repariert" gefüllt oder so fein gegliedert, dass keine zwei Techniker sie gleich verwenden. ISO 14224:2016 liefert eine gemeinsame Grundlage für die Erfassung von Zuverlässigkeits- und Instandhaltungsdaten in der Erdöl-, Petrochemie- und Erdgasindustrie, mit einheitlicher Terminologie und standardisierten Ausfallarten [20]. Ihre Struktur ist auch außerhalb dieser Branchen eine nützliche Vorlage. Sie muss nicht vollständig übernommen werden. Ein praktischer Ausgangspunkt:

- **Ausfallart:** was die Anlage nicht geleistet hat (startet nicht, hohe Schwingung, Leckage, Überhitzung, zu geringe Leistung).
- **Ausfallmechanismus:** der physikalische Vorgang (Ermüdung, Verschleiß, Korrosion, Überhitzung, Verunreinigung, Lose).
- **Bauteil:** welches Teil ausgefallen ist (antriebsseitiges Lager, Gleitringdichtung, Kupplung, Wicklung).
- **Ursachenkategorie:** Schmierung, Montage, Bedienung, Konstruktion, Material, unbekannt.

Jede Liste so kurz halten, dass sie auf einen Tablet-Bildschirm passt, das Feld bei Störungsaufträgen zur Pflicht machen und in der wöchentlichen Instandhaltungsbesprechung eine Stichprobe der Codes durchgehen. Gute Codes sind die Trainingsdaten der künftigen Modelle und die Grundlage jedes Pareto-Diagramms in der [Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant).

### Wie viele Ausfalldaten sind genug?

Es gibt keine allgemeingültige Zahl. Zwei praktische Beobachtungen helfen, die Erwartungen einzuordnen:

- **Seltene Ausfälle sind die Regel.** Eine gut gewartete kritische Pumpe fällt vielleicht alle paar Jahre einmal aus. Zehn baugleiche Pumpen über fünf Jahre liefern womöglich nur eine Handvoll Ausfälle einer Ausfallart. Das ist zu wenig, um für diese eine Flotte einen verlässlichen überwachten Klassifikator zu trainieren.
- **Bündeln hilft.** Ähnliche Anlagen über Linien und Werke hinweg, Flottendaten des Maschinenherstellers und veröffentlichte Benchmark-Datensätze (zum Beispiel die Simulationsdaten der NASA zur Degradation von Turbofan-Triebwerken, C-MAPSS) können die Methodenentwicklung unterstützen, aber ein anderswo trainiertes Modell muss an den eigenen Maschinen und Betriebsbedingungen validiert werden [21].

Wenn Ausfallbeispiele knapp sind, mit Methoden beginnen, die keine brauchen: physikalisch begründete Grenzen aus Normen, Erfahrungsregeln und Anomalieerkennung, die "normal" lernt statt "Ausfall".

## Machine Learning für Predictive Maintenance: Anomalieerkennung und Restlebensdauer

Machine Learning (ML) beantwortet in der vorausschauenden Instandhaltung vier verschiedene Fragen. Wer sie vermischt, erlebt häufig enttäuschende Piloten.

| Frage | Methodenfamilie | Braucht Ausfall-Labels? | Ergebnis |
|---|---|---|---|
| Verhält sich diese Anlage anders als normal? | Anomalieerkennung (statistische Grenzen, PCA und Hotelling-T², Isolation Forest, One-Class-Modelle, Autoencoder) | Nein, nur Daten aus dem Normalbetrieb | Anomaliewert, Alarm |
| Was ist defekt? | Diagnose (Klassifikation) | Ja, Beispiele je Fehlertyp, oder Expertenregeln | Fehlerklasse, zum Beispiel "Außenringschaden" |
| Fällt sie in den nächsten N Tagen aus? | Ausfallvorhersage (binäre Klassifikation) | Ja, Ausfälle mit Zeitstempel | Ausfallwahrscheinlichkeit in einem Zeitfenster |
| Wie lange noch bis zu einer Grenze? | Prognose, Restlebensdauer (RUL) | Ja, Degradationsverläufe, oder ein physikalisches Modell | Verbleibende Zeit oder Zyklen, idealerweise mit Unsicherheitsbereich |

Einen Überblick über die in der Forschung eingesetzten ML-Methoden gibt die systematische Literaturübersicht zu ML-Methoden in der vorausschauenden Instandhaltung von Carvalho und Kollegen (2019) [22]. Eine Übersicht des NIST zu Diagnose- und Prognosefähigkeiten in der Fertigung beschreibt Prognostics and Health Management als junges Feld, in dem viele frühere Arbeiten explorativ oder eng gefasst waren, und kommt zu dem Schluss, dass solche Systeme von offenen Architekturen, Kosten-Nutzen-Analysen, Verifikation und Validierung der Methoden und Industriestandards profitieren [23].

### Schritt 1: Regeln und Statistik

Vor jedem Modell regelbasierte Alarme auf die Signale setzen, denen man vertraut:

- **Absolute Grenzen** aus Normen oder vom Maschinenhersteller (zum Beispiel Schwingungszonen nach ISO 20816 für die Maschinenklasse).
- **Relative Grenzen** gegenüber der eigenen Referenz der Anlage. Üblich ist ein Alarm, wenn ein Wert den Referenzmittelwert um ein Vielfaches seiner Standardabweichung übersteigt oder sich gegenüber der Referenz verdoppelt, jeweils je Betriebszustand festgelegt.
- **Regeln zur Änderungsrate:** Ein langsamer, stetiger Anstieg sagt oft mehr als ein einzelner hoher Wert.

Diese Regeln sind transparent, günstig und für Techniker leicht nachvollziehbar. Sobald Bewertung und Befundrückmeldung eingeführt sind, erzeugen sie außerdem die ersten gelabelten Ereignisse.

### Schritt 2: Anomalieerkennung

Die Anomalieerkennung lernt, wie "normal" über mehrere Signale gleichzeitig aussieht, und markiert Kombinationen, die nicht passen. Sie ist der natürliche nächste Schritt, weil sie keine Ausfallbeispiele braucht. Ihre Schwächen sind ebenso klar:

- **Sie erkennt Veränderung, nicht Ausfall.** Ein neues Produkt, eine neue Einstellung durch den Bediener oder ein verrutschter Sensor lösen alle Alarme aus.
- **"Normal" muss sauber sein.** Enthält der Trainingszeitraum bereits einen sich entwickelnden Fehler, lernt das Modell den Fehler als normal.
- **Sie braucht Kontext.** Getrennt je Betriebszustand trainieren oder Drehzahl, Last und Produkt als Eingangsgrößen aufnehmen.

### Schritt 3: Ausfallvorhersage und Restlebensdauer

Mit genügend gelabelten Ausfällen lassen sich Modelle trainieren, die die Ausfallwahrscheinlichkeit in einem Zeitfenster schätzen (zum Beispiel "fällt diese Pumpe in den nächsten 14 Tagen aus?") oder die Restlebensdauer. RUL-Methoden fallen in drei Gruppen:

1. **Physikalische Modelle** beschreiben das Schadenswachstum (zum Beispiel Risswachstum, Verschleißraten). Sie extrapolieren gut, brauchen aber Ingenieuraufwand je Ausfallart.
2. **Datengetriebene Modelle** lernen die Degradation aus der Historie: Regression auf Gesundheitsindikatoren, Überlebenszeitmodelle, Weibull-Analyse der Ausfallzeiten, rekurrente neuronale Netze wie LSTMs. Sie brauchen viele Verläufe bis zum Ausfall. Deshalb sind öffentliche Benchmarks wie der simulierte Turbofan-Datensatz der NASA (C-MAPSS) in der Forschung so beliebt: Jedes Triebwerk im Trainingsdatensatz läuft vom Normalbetrieb über einen wachsenden Fehler bis zum Ausfall [21].
3. **Hybride Modelle** verbinden ein physikalisches Verständnis der Degradation mit datengetriebener Kalibrierung.

Eine RUL-Schätzung ohne Unsicherheitsbereich ist für die Planung nicht brauchbar. "42 Tage" verleitet zu falscher Sicherheit; "zwischen 20 und 60 Tagen mit 80 % Wahrscheinlichkeit" sagt dem Arbeitsvorbereiter, den Auftrag in den nächsten geplanten Stillstand innerhalb von drei Wochen zu legen.

### Weibull-Analyse: eine statistische Grundlage für alle

Die Weibull-Verteilung ist das Standardwerkzeug zur Beschreibung von Ausfallzeiten. Ihr Formparameter β zeigt, welches Ausfallverhalten vorliegt: Bei β < 1 sinkt die Ausfallrate über die Zeit (Frühausfälle), bei β = 1 ist sie konstant (zufällige Ausfälle; die Weibull-Verteilung wird zum Exponentialmodell), und bei β > 1 steigt sie (Verschleiß) [24]. Das schließt direkt an die Ausfallmuster an: Zeigen Lagerausfälle an einer Pumpenflotte β ≈ 1, senkt ein festes Tauschintervall sie nicht, und Zustandsüberwachung ist das bessere Werkzeug.

Die Zuverlässigkeitsfunktion lautet R(t) = exp(−(t ÷ η)^β), wobei η die charakteristische Lebensdauer ist: die Zeit, bis zu der etwa 63,2 % der Einheiten ausgefallen sind, weil F(η) = 1 − e^(−1). Das NIST/SEMATECH e-Handbook of Statistical Methods schreibt dieselbe Funktion mit γ für die Form und α für die charakteristische Lebensdauer [24].

**Rechenbeispiel.** Für eine Flotte von Getriebelagern ergibt eine Weibull-Anpassung β = 2,0 und η = 30.000 Betriebsstunden (beispielhafte Werte).

- Wahrscheinlichkeit, 10.000 h zu überstehen: R = exp(−(10.000 ÷ 30.000)²) = exp(−0,111) = **0,895**, also fallen etwa 10,5 % vor 10.000 h aus.
- Wahrscheinlichkeit, 20.000 h zu überstehen: R = exp(−(0,667)²) = exp(−0,444) = **0,641**, also fallen etwa 36 % vor 20.000 h aus.

Bei β = 2 nehmen die Ausfälle mit dem Alter zu, ein zeitbasierter Tausch könnte also funktionieren. Ein Tausch bei 10.000 h bedeutet aber, etwa 90 % der Lager wegzuwerfen, die länger gelaufen wären. Mit Zustandsüberwachung laufen die meisten länger, und die 10 % werden früh erkannt. Das ist das typische wirtschaftliche Argument für PdM bei Verschleißausfällen mit erkennbarem P-F-Intervall.

### Ein Modell so bewerten, wie es ein Werksleiter tun würde

Genauigkeit (Accuracy) ist die falsche Kennzahl. Ausfälle sind selten, deshalb kann ein Modell, das immer "kein Ausfall" sagt, zu 99 % genau und trotzdem nutzlos sein. Besser sind diese Kennzahlen:

- **Recall (Erkennungsrate):** Anteil der tatsächlichen Ausfälle, die früh genug zum Handeln markiert wurden.
- **Precision (Trefferquote):** Anteil der Alarme, die sich als echte Probleme herausstellten.
- **Vorlaufzeit:** wie viele Tage vor dem Ausfall der Alarm kam; mit der Zeit vergleichen, die man zum Handeln braucht.
- **Kostengewichtetes Ergebnis:** Wert der erkannten Ausfälle minus Kosten der Fehlalarme und der übersehenen Ausfälle.

**Rechenbeispiel: Precision, Recall und Kosten.** Ein Modell überwacht 50 Pumpen über 12 Monate. Sechs echte Ausfälle treten auf. Das Modell löst 14 Alarme aus. Fünf davon gehen echten Ausfällen mit mindestens 7 Tagen Vorwarnung voraus; neun sind Fehlalarme.

- Recall = 5 ÷ 6 = **83 %**
- Precision = 5 ÷ 14 = **36 %**

Eine Precision von 36 % klingt schwach. Angenommen aber, ein ungeplanter Pumpenausfall kostet 40.000 USD (Stillstand, Folgeschäden, Eilbeschaffung von Teilen), eine geplante Reparatur 6.000 USD und die Prüfung eines Fehlalarms (zwei Stunden eines Technikers plus eine kurze Schwingungsmessung) 300 USD (alles Annahmen für dieses Beispiel).

- Wert der erkannten Ausfälle: 5 × (40.000 USD − 6.000 USD) = **170.000 USD**
- Kosten der Fehlalarme: 9 × 300 USD = **2.700 USD**
- Kosten des übersehenen Ausfalls: Er wäre ohnehin passiert und ist daher keine zusätzliche Kostenposition des Modells, bleibt aber ein Verlust von 40.000 USD.

Wenn Prüfungen billig und Ausfälle teuer sind, ist eine niedrigere Alarmschwelle (mehr Alarme, geringere Precision, höherer Recall) wirtschaftlich richtig. Wenn jeder Alarm bedeutet, eine Linie anzuhalten, zählt die Precision weit mehr. Schwellen gemeinsam mit Controlling und Produktion festlegen, nicht vom Data Scientist allein.

### Modelldrift und Pflege der Modelle

Maschinen, Produkte und Sensoren ändern sich. Ein Modell, das letztes Jahr funktioniert hat, kann sich verschlechtern, ohne dass es jemand merkt. Mindestpraktiken:

- Jeden Alarm und sein Bewertungsergebnis protokollieren; Precision und Recall monatlich verfolgen.
- Nach größeren Änderungen (Überholung, neue Produktfamilie, Sensortausch) neu trainieren oder neu kalibrieren.
- Eine einfache Rückfallregel parallel laufen lassen, damit ein defektes Modell nicht "keine Überwachung" bedeutet.
- Modelle und Alarmgrenzen wie jedes andere gelenkte Dokument versionieren; Qualitätsteams mit AS9100- oder IATF-16949-Systemen werden das erwarten.

### Generative KI und Copiloten

Assistenten auf Basis großer Sprachmodelle werden zunehmend für die Instandhaltung angeboten: Auftragshistorien zusammenfassen, wahrscheinliche Ursachen vorschlagen, Arbeitsanweisungen entwerfen, Fragen zu Handbüchern beantworten. Sie können bei Dokumentation und Suche Zeit sparen. Sie ersetzen keine Signalanalyse, und ihre Vorschläge müssen gegen die Anlagendokumentation und die eigenen Verfahren geprüft werden, besonders bei sicherheitsrelevanten Arbeiten wie dem Freischalten und Sichern (Lockout/Tagout). KI-generierte Reparaturhinweise wie den Rat eines neuen Kollegen behandeln: nützlich, aber vor dem Handeln geprüft.

## Nutzen und die Belege dafür

Der Nutzen der vorausschauenden Instandhaltung ist real, aber die dafür genannten Zahlen schwanken stark und werden oft ohne Quelle weitergereicht. Dieser Abschnitt trennt, was unabhängige US-Quellen zeigen, von dem, was Anbieter und Beratungen behaupten.

### Was US-Behördenquellen zeigen

**Auswertung einer NIST-Umfrage (2020).** Douglas Thomas und Brian Weiss vom NIST werteten eine Umfrage unter US-Fertigungsbetrieben aus und schätzten, dass die Ausgaben für die Instandhaltung von Maschinen 2016 in den erfassten Industriezweigen (NAICS 321 bis 339, ohne 324 und 325) bei 57,3 Mrd. USD lagen und die Verluste durch vermeidbare Instandhaltungsprobleme 119,1 Mrd. USD erreichten, überwiegend durch entgangene Umsätze [4]. Im Vergleich der Betriebe:

- Werke im obersten Viertel beim Anteil reaktiver Instandhaltung meldeten etwa **3,3-mal so viel Stillstand** (13,0 % vs. 4,0 % der geplanten Produktionszeit), etwa **16-mal so viele Fehler** (3,3 % vs. 0,2 %) und etwa **4,9-mal so große Bestandszunahmen** durch Instandhaltungsprobleme wie die im untersten Viertel [4].
- Unter den Betrieben mit weniger als 50 % reaktiver Instandhaltung meldeten diejenigen in der oberen Hälfte bei vorausschauender Instandhaltung **15 % weniger Stillstand, eine um 87 % geringere Fehlerquote und 66 % weniger Bestandszunahme** [4].
- Das NIST weist darauf hin, dass viele dieser Unterschiede **statistisch nicht signifikant** sind und als anekdotische Belege zu behandeln sind [4].

Dieser Vorbehalt wird selten wiederholt, wenn Anbieter "87 % weniger Fehler" zitieren. Die NIST-Ergebnisse zeigen einen starken Zusammenhang zwischen der Reife der Instandhaltung und der Leistung des Werks, kein Versprechen dessen, was Sensoren bewirken.

**O&M-Leitfaden des DOE.** Die Zahlen des DOE-Leitfadens (8 % bis 12 % Einsparung von vorausschauender gegenüber präventiver Wartung; Umfragedurchschnitte von 25 % bis 30 % geringeren Instandhaltungskosten, 70 % bis 75 % weniger Ausfällen, 35 % bis 45 % weniger Stillstand, 20 % bis 25 % mehr Produktion, ROI vom 10-Fachen) wurden oben besprochen; sie stammen aus nicht genannten Umfragen [2].

### Was Anbieter und Beratungen behaupten

Viele hoch rankende Seiten nennen Spannen wie "18 % bis 31 % geringere Instandhaltungskosten", "ROI von 10:1" oder "500 % bis 1.000 % ROI". In unserer Durchsicht der Suchergebnisse vom November 2026 waren diese Zahlen entweder ohne Quelle, auf eigene Kundendaten des Anbieters ohne Methodenangabe gestützt oder gingen auf die DOE-Liste zurück. Die Perspektive von Deloitte zur vorausschauenden Instandhaltung von 2022 etwa stellt Nutzenspannen als "interne Deloitte-Analyse aus der Arbeit mit Kunden" dar ("internal Deloitte analysis derived from work with clients") [25]. Solche Zahlen können ehrlich sein, sind aber aus erfolgreichen Projekten ausgewählt und beschreiben die Kunden einer Beratung, nicht das durchschnittliche Werk. Sie als Anbieter- oder Beratungsaussagen kennzeichnen und den Business Case aus eigenen Daten aufbauen.

### Der Nutzen, der in der Praxis trägt

| Nutzen | Wirkmechanismus | So wird er im eigenen Werk gemessen |
|---|---|---|
| Weniger ungeplante Stopps | Sich anbahnende Ausfälle werden in geplanten Zeitfenstern repariert | Ungeplante Stillstandsstunden an überwachten Anlagen, vorher vs. nachher |
| Geringere Reparaturkosten je Ereignis | Geplante Reparaturen vermeiden Folgeschäden, Überstunden und Eilfracht | Durchschnittliche Kosten von Störungs- vs. geplanten Aufträgen für dieselbe Ausfallart |
| Weniger unnötige präventive Arbeit | Zeitbasierte Aufgaben an zustandsüberwachten Anlagen lassen sich verlängern oder streichen | Wartungsstunden je Anlage, gestrichene oder verlängerte Wartungsaufgaben |
| Bessere Ersatzteilplanung | Die Vorlaufzeit ist vorher bekannt | Eilbestellungen, Bestand an kritischen Ersatzteilen |
| Arbeitssicherheit | Weniger katastrophale Ausfälle und weniger Noteinsätze unter Zeitdruck | Unfälle und Beinaheunfälle im Zusammenhang mit Anlagenausfällen, Notfallaufträge |
| Energie | Leckagen, Fluchtungsfehler, Verschmutzung und schlechte Schmierung verschwenden Energie | Ergebnisse der Druckluft-Leckagesuche, kWh je Einheit an überwachten Systemen |
| Qualität | Verschlissene Spindeln, Lager und Werkzeuge beeinträchtigen die Produktqualität, bevor sie ausfallen | Ausschuss und Nacharbeit im Zusammenhang mit dem Anlagenzustand |

## ROI von Predictive Maintenance: ein Rechenbeispiel

Der ROI der vorausschauenden Instandhaltung entscheidet sich an vier Zahlen: wie viele relevante Ausfälle es gibt, was jeder kostet, welcher Anteil sich früh genug erkennen lässt und was der Betrieb des Programms kostet. Hier ein vollständiges Beispiel. Alle Werte sind Annahmen zur Veranschaulichung und durch eigene zu ersetzen.

### Die Ausgangslage

Ein Verpackungswerk betreibt eine Engpasslinie. Zwölf kritische rotierende Anlagen auf dieser Linie (Motoren, Getriebe, Ventilatoren, Vakuumpumpen) kommen für eine kontinuierliche Überwachung in Frage.

| Ausgangswert | Wert |
|---|---|
| Ungeplante Ausfälle pro Jahr an den 12 Anlagen (aus dem CMMS, Durchschnitt der letzten 3 Jahre) | 9 |
| Durchschnittlicher Stillstand des Engpasses je ungeplantem Ausfall | 6 Stunden |
| Entgangener Deckungsbeitrag je Engpassstunde (Controlling) | 4.500 USD |
| Durchschnittliche Kosten einer ungeplanten Reparatur (Teile, Eilfracht, Überstunden, Folgeschäden) | 12.000 USD |
| Durchschnittliche Kosten derselben Reparatur, wenn geplant | 5.000 USD |
| Stillstand, wenn die Reparatur in einen geplanten Stopp gelegt wird | 1,5 Stunden |

**Warum Deckungsbeitrag und nicht Umsatz:** Eine am Engpass verlorene Stunde kostet den Deckungsbeitrag der nicht produzierten Einheiten, sofern sie sich nicht mit Überstunden nachholen lassen. Lassen sie sich nachholen, sind die Kosten der Überstundenzuschlag, nicht der Deckungsbeitrag. Das vor der ersten Präsentation mit dem Werkscontroller abstimmen; es ist die Zahl, die am ehesten angezweifelt wird.

### Die Kosten des Programms

| Kostenposition | Art | Wert |
|---|---|---|
| 24 Funksensoren für Schwingung und Temperatur zu 800 USD (zwei je Anlage) | Einmalig | 19.200 USD |
| 3 Gateways zu 2.500 USD | Einmalig | 7.500 USD |
| Installation und Inbetriebnahme, 120 Stunden zu 120 USD | Einmalig | 14.400 USD |
| CMMS-Integration (Alarm zum Auftrag, Rückmeldung) | Einmalig | 10.000 USD |
| Schulung für Techniker und den Zuverlässigkeitsingenieur | Einmalig | 6.000 USD |
| **Summe einmalig** | | **57.100 USD** |
| Software-Abo, 24 Sensoren zu 25 USD pro Monat | Jährlich | 7.200 USD |
| Analystenzeit, 0,15 VZÄ zu 110.000 USD Vollkosten | Jährlich | 16.500 USD |
| Batterien und Ersatzsensoren | Jährlich | 1.500 USD |
| Prüfung von Fehlalarmen, 20 pro Jahr zu 300 USD | Jährlich | 6.000 USD |
| Anteil IT-Hosting und Sicherheitsbetrieb | Jährlich | 3.000 USD |
| **Summe jährlich** | | **34.200 USD** |

Preise für Sensoren und Abos schwanken stark nach Anbieter, Datenvolumen und Vertrag; die Zahlen oben sind Platzhalter, keine Marktpreise.

### Der Nutzen bei 60 % Erkennungsrate

Angenommen, das Programm erkennt 60 % der Ausfälle früh genug, um die Reparatur zu planen.

- Erkannte Ausfälle: 9 × 0,6 = **5,4 pro Jahr**
- Vermiedener Stillstand: 5,4 × (6 − 1,5) h × 4.500 USD = **109.350 USD**
- Vermiedene Reparaturkosten: 5,4 × (12.000 USD − 5.000 USD) = **37.800 USD**
- Verlängerte oder gestrichene präventive Aufgaben an überwachten Anlagen: **8.000 USD**
- **Jährlicher Bruttonutzen: 155.150 USD**
- **Jährlicher Nettonutzen:** 155.150 USD − 34.200 USD = **120.950 USD**
- **Einfache Amortisation:** 57.100 USD ÷ 120.950 USD = 0,47 Jahre, etwa **5,7 Monate**
- **Kapitalwert über drei Jahre bei 10 %:** 120.950 USD × 2,487 (Rentenbarwertfaktor) − 57.100 USD = **243.685 USD** (Annahmen: Nutzen und laufende Kosten konstant und am Jahresende, kein Restwert der Sensoren, vor Steuern, kein Hochlauf; ein realistisches erstes Jahr mit Hochlauf senkt das Ergebnis)

### Sensitivität: wann der Business Case kippt

| Szenario | Erkennungsrate | Deckungsbeitrag je Stunde | Jährlicher Nettonutzen | Amortisation | Kapitalwert über 3 Jahre bei 10 % |
|---|---|---|---|---|---|
| Basisfall | 60 % | 4.500 USD | 120.950 USD | 5,7 Monate | 243.685 USD |
| Geringere Erkennung | 30 % | 4.500 USD | 47.375 USD | 14,5 Monate | 60.715 USD |
| Geringere Erkennung, geringerer Deckungsbeitrag | 30 % | 2.000 USD | 17.000 USD | 40 Monate | −14.824 USD |
| Break-even-Erkennung | etwa 20 % | 4.500 USD | 22.850 USD | 30 Monate | etwa 0 USD |
| Schwache Erkennung | 10 % | 4.500 USD | −1.675 USD | nie | −61.265 USD |

Drei Lehren aus der Tabelle:

1. **Die Erkennungsrate ist die entscheidende Größe.** Sie hängt davon ab, Ausfallarten mit Vorwarnung zu wählen, von der Wahl der Sensoren und der Abtastung und von einem Reaktionsprozess, der rechtzeitig handelt. Die Technik allein legt sie nicht fest.
2. **Der Engpass bestimmt den Wert des Stillstands.** Dasselbe Programm an einer Linie ohne Engpass mit freier Kapazität wäre womöglich nur einen Bruchteil davon wert, weil verlorene Stunden nachgeholt werden können. Der Leitfaden zur [Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant) erklärt, warum eine am Engpass verlorene Stunde eine Stunde für das ganze Werk ist.
3. **Betriebskosten zählen mehr als der Sensorpreis.** Analystenzeit und Abos fallen jedes Jahr an. Ein Programm, das Sensoren hinzufügt, ohne Menschen für die Bewertung der Alarme hinzuzufügen, driftet meist in ignorierte Dashboards ab.

### Capex, Opex und die Sicht des Controllings

- **Investition oder Aufwand.** Sensoren und Gateways können je nach Aktivierungsgrenze und Richtlinie aktiviert oder als Aufwand gebucht werden; Software-Abos sind meist Betriebsaufwand. Ein Programm, das als "ohne Capex" verkauft wird, kann über fünf Jahre trotzdem höhere Gesamtkosten haben. Die Gesamtbetriebskosten über die erwartete Lebensdauer vergleichen, nicht nur die Budgetzeile des ersten Jahres.
- **Vermiedene Kosten sind keine gebuchten Kosten.** Das Controlling sieht "109.350 USD vermiedener Stillstand" nicht in der Gewinn- und Verlustrechnung. Es sieht mehr Ausbringung am Engpass, weniger Überstunden und weniger Eilfracht. Vorab vereinbaren, welche Konten sich bewegen sollen, und sie verfolgen.
- **Ersatzteile.** Bessere Vorwarnung kann einen geringeren Bestand an manchen kritischen Ersatzteilen rechtfertigen, aber Vorsicht: Vorausschauende Instandhaltung verringert die Überraschung, nicht die Lieferzeit. Sicherheitsersatzteile für Teile mit langer Lieferzeit behalten, deren Ausfall wenig Vorwarnung gibt.
- **Zuerst die Basis.** Ohne 6 bis 12 Monate gemessene Basis (Ausfälle, Stillstand, Reparaturkosten) kann das Nachher-Bild nichts beweisen. Mit dem Messen beginnen, bevor die Sensoren geliefert werden.

## Pilotanlagen auswählen

Ein guter Pilot ist klein genug, um ihn zu steuern, wichtig genug, um zu zählen, und hat Ausfallarten, die vorausschauende Instandhaltung tatsächlich erkennen kann. Vier Tests filtern die Kandidaten:

1. **Folgen:** Stoppt ein Ausfall den Engpass, entsteht ein Sicherheits- oder Umweltrisiko oder ein teurer Folgeschaden?
2. **Häufigkeit:** Ist die Anlagenklasse in den letzten Jahren oft genug ausgefallen, um innerhalb von 12 Monaten Ergebnisse zu sehen? (Das Bündeln ähnlicher Anlagen hilft.)
3. **Erkennbarkeit:** Hat die vorherrschende Ausfallart einen bekannten Vorboten, den das gewählte Verfahren misst, mit einem P-F-Intervall, das länger ist als die eigene Reaktionszeit?
4. **Umsetzbarkeit:** Lässt sich die Reparatur planen? Sind Teile verfügbar, gibt es einen geplanten Stillstand, gibt es eine Person, der der Alarm gehört?

### Rechenbeispiel zur Kritikalitätsbewertung

Jeden Kandidaten von 1 bis 5 nach Folgen (C), Ausfallwahrscheinlichkeit (L) und Erkennbarkeit mit dem geplanten Verfahren (D) bewerten und dann multiplizieren. Bewertet werden nur Anlagen, die den Test der Umsetzbarkeit bestehen.

| Anlage | Folgen C | Wahrscheinlichkeit L | Erkennbarkeit D | Punktzahl C × L × D | Entscheidung |
|---|---|---|---|---|---|
| Hauptgetriebe des Extruders | 5 | 3 | 5 (Öl und Schwingung) | 75 | Pilot |
| Vakuumpumpe am Engpass | 5 | 4 | 4 (Schwingung, Temperatur) | 80 | Pilot |
| Ventilator des Kühlturms | 3 | 3 | 5 (Schwingung) | 45 | Pilot, wenn das Budget reicht |
| Antriebsmotoren der Förderer (20 baugleiche) | 2 | 4 | 4 (Schwingung, MCSA) | 32 | Überwachung per Messroute |
| Hydraulikaggregat der Presse | 4 | 2 | 3 (Öl, Drucktrend) | 24 | Ölanalyseprogramm |
| Verpackungsroboter | 4 | 2 | 2 (Ausfälle meist elektronisch, wenig Vorwarnung) | 16 | Ersatzteile und schnelle Reparatur, keine PdM |

Das Roboterbeispiel ist wichtig. Er ist kritisch, aber seine vorherrschenden Ausfälle geben wenig messbare Vorwarnung, deshalb ist vorausschauende Instandhaltung das falsche Werkzeug. Eine gute Pilotliste sagt auch zu manchen kritischen Anlagen "nein".

### Ein Pilotumfang, der funktioniert

- **10 bis 30 Anlagen** eines oder zweier Typen, auf einer Linie oder in einem Bereich, mit einem Verantwortlichen.
- **Ein oder zwei Verfahren,** die zu den Ausfallarten passen (oft Schwingung plus Temperatur oder Schwingung plus Öl).
- **Eine feste Dauer** von 6 bis 12 Monaten, mit einer vor dem Start gemessenen Basis.
- **Ausdrückliche Erfolgskriterien,** abgestimmt mit Produktion und Controlling: zum Beispiel "mindestens drei bestätigte Früherkennungen mit geplanten Reparaturen, Fehlalarmquote unter einem je Anlage und Quartal und dokumentierte Bewertung jedes Alarms".

## Fahrplan: vom Piloten zum Programm

Der folgende Fahrplan geht von einem mittelgroßen Werk aus (hier: ein Standort, einige hundert Beschäftigte, ein CMMS vorhanden), das überwiegend präventiv und reaktiv arbeitet. Die Dauern sind typische Spannen, keine Zusagen.

| Phase | Dauer | Hauptaktivitäten | Schwelle zur nächsten Phase |
|---|---|---|---|
| 0. Grundlagen | 1 bis 3 Monate | Anlagenverzeichnis der kritischen Anlagen bereinigen, Kritikalitätsrangfolge, Fehlercodeliste, Basiskennzahlen (ungeplanter Stillstand, MTBF, MTTR, Wartungsplantreue, reaktiver Anteil), Prozess vom Alarm zum Auftrag festlegen | Basis gemessen, Pilotanlagen ausgewählt, Verantwortlicher benannt |
| 1. Pilot | 6 bis 12 Monate | Sensoren installieren oder Routen starten, Kontextdaten anbinden, regelbasierte Alarme setzen, jeden Alarm bewerten, Befunde dokumentieren | Erfolgskriterien erfüllt oder klare Erkenntnisse, warum nicht; Controlling stimmt der Nutzenbewertung zu |
| 2. Standardisieren | 3 bis 6 Monate | Standardarbeit für die Alarmreaktion schreiben, Techniker schulen, Alarme automatisch ins CMMS integrieren, Wartungsaufgaben an überwachten Anlagen anpassen | Der Prozess funktioniert, ohne dass das Projektteam zuschaut |
| 3. Skalieren | 12 bis 24 Monate | Auf weitere Anlagenklassen und Linien ausweiten, Verfahren ergänzen (Öl, Ultraschall, MCSA), ein Zuverlässigkeitsteam aufbauen oder einen Dienstleister beauftragen, Anomalieerkennung ergänzen, wo Regeln an Grenzen stoßen | Abdeckungsziele erreicht, Fehlalarmquote stabil, Kennzahlentrend positiv |
| 4. Optimieren | Laufend | Ausfallvorhersage und Restlebensdauer für Anlagentypen mit genügend Historie, Verknüpfung mit der Produktionsplanung, Flottenvergleich über Werke | Modelle gegen Befunde validiert, Routine für das Nachtrainieren etabliert |

### Phase 0 im Detail: die Arbeit, die niemand machen will

- **Anlagenhierarchie:** Standort, Bereich, Linie, Anlage, Bauteil, mit denselben Kennungen in CMMS, Historian und IIoT-Plattform. Ist ein Unified Namespace geplant, ist die Hierarchie sein Rückgrat.
- **Kritikalitätsrangfolge:** eine einseitige Methode, abgestimmt zwischen Produktion, Instandhaltung, Arbeitssicherheit und Umweltschutz (EHS) und Qualität. Zuerst die obersten 10 % bis 20 % der Anlagen einstufen.
- **Fehlercodes:** kurze Listen für Ausfallart, Mechanismus, Bauteil und Ursache (siehe Abschnitt zu den Daten).
- **Basis:** die Aufträge und Stillstandsereignisse der letzten 12 bis 36 Monate für die Pilotkandidaten ziehen. Sind die Daten schlecht, vor dem Start mindestens einige Monate nach vorn messen.
- **Reaktionsprozess:** wer Alarme erhält, bis wann sie bewertet werden, wie ein bestätigter Alarm zu einem terminierten Auftrag wird. Das als [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) (geplant) für das Instandhaltungsteam beschreiben und in der täglichen Instandhaltungsrunde durchgehen.

### Selbst bauen, kaufen oder als Dienstleistung

| Option | Passt, wenn | Worauf achten |
|---|---|---|
| Anbieterplattform mit Sensoren und Analytics (Abo) | Schneller Start, wenig eigene Datenkompetenz, gängige rotierende Anlagen | Dateneigentum und Export, Herstellerbindung, Preise je Sensor bei großer Stückzahl |
| Dienstleistung Zustandsüberwachung (Analysten eines Anbieters) | Wenige eigene Analysten, schneller Bedarf an zertifizierter Diagnose | Reaktionszeiten, Qualität der Berichte, Wissen bleibt beim Dienstleister |
| Eigene Plattform auf vorhandenem IT/OT-Stack (Historian, Cloud, Open Source) | Starkes Datenteam, viele Werke, Bedarf an einem Datenmodell | Lange Aufbauzeit, Bindung von Fachkräften, Pflege der Edge-Flotte |
| Fernüberwachung des Maschinenherstellers | Neue Maschinen mit Konnektivität des Herstellers (OEM) | Datenzugriff für eigene Analytics, Cybersecurity-Bedingungen im Vertrag |

Die meisten Werke kombinieren Optionen: Sensoren und Analytics eines Anbieters für den Piloten, einen OEM-Service für einige komplexe Maschinen und die eigene Datenplattform als Integrationsschicht, sobald mehrere Werke beteiligt sind.

## Instandhaltungskennzahlen: MTBF, MTTR, Wartungsplantreue und PdM-Kennzahlen

Das Programm an seiner Wirkung auf Betrieb und Instandhaltungsarbeit messen, nicht an der Modellgenauigkeit. Die Society for Maintenance & Reliability Professionals (SMRP), eine von Praktikern gegründete gemeinnützige Fachgesellschaft mit Sitz in den USA, veröffentlicht Best Practices, Kennzahlen und Leitlinien für Instandhaltung und Zuverlässigkeit; wer sie im Unternehmen nutzt, sollte die eigenen Definitionen an den Wortlaut der SMRP anpassen [26]. Der Leitfaden zu [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/) behandelt MTBF, MTTR und Verfügbarkeit neben der OEE; die Definitionen hier sind damit konsistent gehalten.

### Zentrale Zuverlässigkeitskennzahlen

> **MTBF (mittlere Betriebszeit zwischen Ausfällen, Mean Time Between Failures) = Betriebszeit ÷ Zahl der Ausfälle**
> **MTTR (mittlere Reparaturzeit, Mean Time To Repair) = gesamte Reparaturzeit ÷ Zahl der Reparaturen**
> **Inhärente Verfügbarkeit = MTBF ÷ (MTBF + MTTR)**

**Rechenbeispiel.** Die 12 Pilotanlagen liefen im Basisjahr zusammen 96.000 Betriebsstunden mit 9 Ausfällen und 72 Stunden gesamter Reparaturzeit.

- MTBF = 96.000 ÷ 9 = **10.667 Stunden**
- MTTR = 72 ÷ 9 = **8,0 Stunden**
- Inhärente Verfügbarkeit = 10.667 ÷ (10.667 + 8,0) = **99,93 %** je Anlage

Im ersten Pilotjahr treten bei gleicher Betriebszeit 4 Funktionsausfälle auf, und 5 sich anbahnende Fehler werden erkannt und als geplante Arbeit behoben.

- MTBF (Funktionsausfälle) = 96.000 ÷ 4 = **24.000 Stunden**

Klar festlegen, was als Ausfall zählt. Würden durch PdM ausgelöste geplante Reparaturen als Ausfälle gezählt, sähe die MTBF unverändert aus, obwohl der Stillstand stark gesunken ist. Beides berichten: Funktionsausfälle und durch PdM erkannte Eingriffe.

### Kennzahlen des Instandhaltungsprozesses

| Kennzahl | Formel | Warum sie für PdM zählt |
|---|---|---|
| Wartungsplantreue (PM Compliance) | Im geplanten Zeitfenster erledigte Wartungsaufträge ÷ fällige Wartungsaufträge im Zeitraum | Ein PdM-Programm auf einem kaputten Wartungsprogramm scheitert; zuerst die Grundpflege in den Griff bekommen |
| Anteil geplanter Instandhaltung | Stunden geplanter Instandhaltung ÷ gesamte Instandhaltungsstunden | Sollte steigen, wenn PdM Störungen in geplante Arbeit verwandelt |
| Anteil reaktiver Arbeit (Notfallarbeit) | Stunden Notfallarbeit ÷ gesamte Instandhaltungsstunden | Direkte Verbindung zum NIST-Befund zu Werken mit hohem reaktivem Anteil [4] |
| Termintreue (Schedule Compliance) | Wie geplant erledigte terminierte Arbeitsstunden ÷ terminierte Stunden | Zeigt, ob durch PdM ausgelöste geplante Aufträge tatsächlich erledigt werden |
| Instandhaltungskosten je Einheit oder als Anteil am Wiederbeschaffungswert | Gesamte Instandhaltungskosten ÷ Ausbringung oder ÷ geschätzter Wiederbeschaffungswert der Anlagen | Verhindert, dass "Einsparungen" beim Stillstand durch höhere Servicekosten aufgezehrt werden |
| Ungeplanter Stillstand an überwachten Anlagen | Stunden ungeplanter Stopps, verursacht durch überwachte Anlagen | Die zentrale Ergebniskennzahl |

**Rechenbeispiel: Wartungsplantreue.** Im März waren an der Linie 240 Wartungsaufträge fällig. 204 wurden im vereinbarten Zeitfenster erledigt (zum Beispiel Fälligkeitsdatum plus/minus 10 % des Intervalls oder eine feste Zahl von Tagen; das Fenster einmal festlegen und beibehalten). Wartungsplantreue = 204 ÷ 240 = **85 %**. Viele Instandhaltungsleiter peilen 90 % oder mehr an, bevor sie vorausschauende Ebenen ergänzen [unbelegt als veröffentlichter Benchmark; nur als internes Ziel verwenden].

### PdM-spezifische Kennzahlen

| Kennzahl | Formel | Zielrichtung |
|---|---|---|
| Abdeckung | Kritische Anlagen unter Zustandsüberwachung ÷ kritische Anlagen | Steigend, bis zum geplanten Umfang |
| Vorlaufzeit der Erkennung | Tage zwischen erstem Alarm und Funktionsausfall (oder geplanter Reparatur) | Länger als die Zeit, die man zum Planen braucht |
| Alarm-Precision | Bestätigte Alarme ÷ alle Alarme | Steigend, ohne Recall zu verlieren |
| Erkennungsrate (Recall) | Ausfälle mit rechtzeitigem Alarm ÷ alle Ausfälle der überwachten Ausfallarten | Steigend |
| Reaktionszeit auf Alarme | Zeit vom Alarm bis zur Bewertungsentscheidung | Innerhalb der vereinbarten Grenze (zum Beispiel 1 Schicht bei hoher Priorität) |
| Durch PdM erzeugte Arbeit | Aufträge aus Zustandsbefunden ÷ alle Störungsaufträge | Steigend |
| Quote der Befundrückmeldung | PdM-Aufträge mit dokumentiertem Befund ÷ PdM-Aufträge | Nahe 100 % |

Drei bis fünf davon gehören auf das tägliche oder wöchentliche Board des Instandhaltungsteams. Wie solche Boards funktionieren, zeigt das [Shopfloor Management](https://www.m365.fm/learn/shop-floor-management/).

## Mitarbeiter, Qualifikation und Arbeitssicherheit

### Rollen

| Rolle | Verantwortung in einem PdM-Programm |
|---|---|
| Leitung Instandhaltung | Verantwortet das Programm, den Reaktionsprozess und die Kennzahlen |
| Zuverlässigkeitsingenieur | Kritikalität, Ausfallarten, Wahl der Verfahren, Alarmgrenzen, Ursachenanalyse wiederkehrender Ausfälle |
| Analyst Zustandsüberwachung (intern oder Dienstleister) | Datensichtung, Diagnose, Empfehlungen |
| Arbeitsvorbereiter und Terminplaner | Macht aus bestätigten Befunden terminierte Arbeit mit Teilen und Freigaben |
| Techniker | Sensoren installieren und prüfen, Reparaturen ausführen, Befund dokumentieren |
| Bediener (Werker) | Ungewöhnliche Geräusche, Wärme, Gerüche und Leckagen melden; Grundpflege (autonome Instandhaltung) |
| OT/IT-Ingenieur | Konnektivität, Datenplattform, Sicherheit, Integration mit dem CMMS |
| Data Scientist (spätere Phasen) | Modelle für Anomalieerkennung und Prognose, Validierung, Driftüberwachung |

### Qualifikation und Zertifizierung

Für die Schwingungsanalyse gibt es mit ISO 18436-2 einen internationalen Rahmen für die Personalzertifizierung. In den USA zertifiziert das Vibration Institute Schwingungsanalysten in vier Kategorien (I bis IV) mit einem Wissenskatalog nach ISO 18436-2; sein Programm wurde im März 2010 vom American National Standards Institute akkreditiert und ist heute von ANAB nach ISO/IEC 17024 akkreditiert [27]. Vergleichbare Programme gibt es für andere Verfahren wie Thermografie, Ölanalyse und Ultraschall. Eine Zertifizierung ersetzt nicht die Erfahrung an den eigenen Maschinen, gibt aber eine gemeinsame Sprache und eine Möglichkeit, Dienstleister zu prüfen. Für ein kleines Werk ist ein zertifizierter Analyst plus geschulte Techniker, die gute Daten erfassen und auf Befunde reagieren können, ein realistisches erstes Team.

### Die Sicht von Werkern und Technikern

Vorausschauende Instandhaltung verändert die tägliche Arbeit. Techniker verbringen weniger Zeit mit Notfallreparaturen und mehr mit geplanter Arbeit und Datenprüfungen; manche erfahrene Techniker befürchten, dass Sensoren ihr Urteil ersetzen. In der Praxis ist es gerade ihr Wissen darüber, wie eine Maschine klingt, riecht und sich verhält, das Alarme glaubwürdig macht. Sie von Anfang an in die Sensorplatzierung, die Alarmbewertung und die Fehlercodierung einbeziehen. Wo eine Gewerkschaft oder Arbeitnehmervertretung die Instandhaltungsbelegschaft vertritt, vorab besprechen, wofür Alarmdaten verwendet werden: für die Arbeitsplanung oder auch zur Bewertung einzelner Personen. Programme, die Zustandsdaten nutzen, um Menschen Schuld zuzuweisen, verlieren die ehrliche Rückmeldung, auf die sie angewiesen sind.

Die Bediener bleiben eine wichtige Frühwarnung. Der Schritt der autonomen Instandhaltung im [TPM](https://www.m365.fm/learn/tpm-oee/) (geplant) schult sie darin, bei täglichen Prüfungen Auffälligkeiten zu erkennen; ihre Beobachtungen sind oft die früheste verfügbare Warnung für Ausfallarten, die kein installierter Sensor abdeckt.

### Arbeitssicherheit bei Installation und Reparatur

Einen Sensor an einer laufenden Maschine montieren, einen Schaltschrank für einen Stromwandler öffnen oder eine Ölprobe aus einem Drucksystem entnehmen sind gefährliche Tätigkeiten. In den USA fallen Wartungs- und Instandsetzungsarbeiten, bei denen Beschäftigte einem unerwarteten Einschalten oder Anlaufen von Maschinen ausgesetzt sein könnten, unter die Lockout/Tagout-Norm der OSHA, 29 CFR 1910.147 [28]. Je Tätigkeit entscheiden, ob sie bei laufender Maschine sicher ausgeführt werden kann (mit Schutzeinrichtungen und Verfahren) oder ob die Energie getrennt und gesichert werden muss, und das in die Arbeitsanweisungen für die Installation schreiben. Funksensoren, Stromüberwachung in der MCC und Datenerfassung aus der Ferne können verringern, wie oft sich Menschen laufenden Anlagen nähern müssen; das ist ein Sicherheitsnutzen, der in den Business Case gehört.

## Typische Fehler

1. **Mit der Technik beginnen.** Sensoren kaufen, bevor Ausfallarten, Verantwortliche und Reaktionsprozess festgelegt sind. Das Ergebnis ist ein Dashboard, das niemand nutzt.
2. **Anlagen überwachen, die es nicht brauchen.** Kritische Ausfallarten ohne Vorwarnung oder billige redundante Anlagen. Die vier Pilottests anwenden.
3. **Keine Basis.** Ohne gemessenen Stillstand, Ausfälle und Kosten vor dem Start kann das Programm seinen Wert nicht belegen, und die nächste Budgetrunde wird zur Glaubensfrage.
4. **Betriebskontext ignorieren.** Alarme bei jedem Produkt- oder Drehzahlwechsel zerstören das Vertrauen innerhalb weniger Wochen.
5. **Alarmmüdigkeit.** Zu viele Alarme mit geringem Wert an zu viele Personen. Mit wenigen, verlässlichen Alarmen und einem klaren Verantwortlichen für die Bewertung beginnen.
6. **Keine Rückkopplung.** Befunde werden nicht dokumentiert, deshalb werden Grenzen und Modelle nie besser.
7. **Die Grundpflege auslassen.** Probleme mit Schmierung, Ausrichtung, Auswuchten und Sauberkeit werden immer wieder erkannt. Die Ursachen beheben (proaktive Instandhaltung), statt jedes Quartal denselben Ausfall vorherzusagen.
8. **PdM als IT-Projekt behandeln.** IT und OT bauen die Datenstrecke; Instandhaltung und Produktion verantworten das Ergebnis. Die Leitung Instandhaltung in die Verantwortung nehmen.
9. **Ewiger Pilot ("Pilot Purgatory").** Ein Pilot, der technisch gelingt, aber nie einen Skalierungsplan, ein Budget oder einen Standard bekommt. Die Skalierungsentscheidung und ihre Kriterien vor dem Pilotstart festlegen.
10. **Sicherheit als Nachgedanke.** Gateways mit Standardpasswörtern und direkter Internetverbindung im Werksnetz. Siehe den Abschnitt zur Sicherheit.
11. **Zu viel von ML versprechen.** Vorhersagen der Restlebensdauer im ersten Jahr für Anlagen mit drei dokumentierten Ausfällen versprechen.
12. **Vermiedene Kosten zählen, die das Controlling nicht anerkennt.** Die Nutzenbewertung vor dem Piloten mit dem Controller abstimmen.

## Grenzen: wann sich Predictive Maintenance nicht lohnt

Vorausschauende Instandhaltung ist das richtige Werkzeug für eine bestimmte Gruppe von Ausfallarten, nicht für jede Anlage. Sie lohnt sich nicht oder kaum, wenn:

- **der Ausfall keine Vorwarnung gibt.** Viele elektronische Ausfälle, manche Ermüdungsbrüche und Ausfälle durch plötzliche Überlast haben P-F-Intervalle von Sekunden oder gar keine. Hier helfen Redundanz, Ersatzteile und Konstruktionsänderungen; Vorhersage hilft nicht.
- **das P-F-Intervall kürzer ist als die Reaktionszeit.** Dauert die Beschaffung eines Getriebes drei Wochen, entwickelt sich der Schaden aber in fünf Tagen von erkennbar bis zum Ausfall, lässt sich die Maschine nur früher stoppen, die Reparatur aber nicht planen. Das hat trotzdem Wert (Folgeschäden vermeiden), aber die Wirtschaftlichkeit ist eine andere.
- **Ausfälle billig und unkritisch sind.** Betrieb bis zum Ausfall mit Ersatzteilen im Regal ist günstiger.
- **die Anlage zu unregelmäßig oder in zu vielen Zuständen läuft,** um eine stabile Referenz zu bilden, und keine Kontextdaten verfügbar sind.
- **die Organisation nicht handeln kann.** Ohne Arbeitsvorbereitung, Terminierung und Ersatzteilmanagement werden Frühwarnungen zu späten Reparaturen.
- **die Daten für die versprochene Methode zu dünn sind.** Überwachte Ausfallvorhersage braucht viele Beispiele der Ausfallart; bei seltenen Ereignissen sind Physik und Expertenregeln datengetriebenen Modellen überlegen.

Auch die Belege haben Grenzen. Kontrollierte Studien, die ähnliche Werke mit und ohne vorausschauende Instandhaltung vergleichen, sind selten; die meisten veröffentlichten Ergebnisse sind Fallstudien, Anbieterberichte oder Umfragen mit Selbstauskünften. Die NIST-Auswertung ist einer der wenigen unabhängigen US-Datensätze, und selbst sie berichtet Zusammenhänge, viele davon statistisch nicht signifikant [4].

## Sicherheitshinweis: IIoT und OT-Security

Jedes IIoT-Sensorgateway, jedes Edge-Gerät und jede Cloud-Verbindung ist ein neuer Weg ins Netz der Betriebstechnik (Operational Technology, OT). Predictive-Maintenance-Projekte schaffen solche Wege oft schnell, aus dem Instandhaltungsbudget, manchmal von einem Anbieter mit Fernzugriff installiert. Genau vor dieser Art von Änderung warnen OT-Security-Rahmenwerke.

NIST SP 800-82 Rev. 3, *Guide to Operational Technology (OT) Security* (September 2023), beschreibt typische OT-Systemtopologien, häufige Bedrohungen und Schwachstellen sowie empfohlene Schutzmaßnahmen und berücksichtigt dabei die Anforderungen der OT an Leistung, Zuverlässigkeit und Sicherheit [29]. Die Normenreihe ISA/IEC 62443 legt Anforderungen und Prozesse für die Absicherung industrieller Automatisierungs- und Steuerungssysteme über ihren gesamten Lebenszyklus fest, auf Basis geteilter Verantwortung von Betreibern, Herstellern von Automatisierungsprodukten, Integratoren und Dienstleistern [30].

Mindestregeln für ein Predictive-Maintenance-Projekt:

- **Segmentieren.** IIoT-Gateways und Edge-Geräte in eine definierte Zone legen, nicht ins flache Steuerungsnetz. Daten sollten das OT-Netz über einen kontrollierten Conduit (zum Beispiel eine DMZ oder einen Broker) verlassen, wo möglich nur über ausgehende Verbindungen.
- **Standardmäßig nur lesend.** Zustandsüberwachung muss Daten lesen, selten in Steuerungen schreiben. OPC-UA- und SPS-Zugriffe nur lesend konfigurieren, sofern kein dokumentierter Anwendungsfall mehr erfordert.
- **Geräte authentifizieren und Verkehr verschlüsseln.** OPC-UA-Sicherheitsmodi mit Zertifikaten und MQTT über TLS mit Zugangsdaten je Gerät verwenden; Standardpasswörter ändern.
- **Fernzugriff von Anbietern kontrollieren.** Keine dauerhaften VPNs oder Fernwartungswerkzeuge eines Sensoranbieters im Werksnetz ohne Prüfung, Protokollierung und zeitliche Begrenzung.
- **IIoT in Anlageninventar und Patchprozess aufnehmen.** Gateways und Sensoren haben Firmware, die Updates braucht.
- **Verträge prüfen.** Wem die Daten gehören, wo sie gespeichert werden, wie Schwachstellen gemeldet und behoben werden und was mit Daten und Geräten bei Vertragsende passiert.

Eine vollständige Behandlung von Zonen, Conduits, Security Levels und dem Betrieb eines OT-Security-Programms bietet der geplante Leitfaden [OT-Security und ISA/IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant).

## Einordnung: TPM, MES, Digital Twin und Cloud

Vorausschauende Instandhaltung ist ein Teil eines größeren Systems aus Instandhaltung und Betrieb. Vier Verbindungen sind am wichtigsten.

- **TPM und OEE.** Total Productive Maintenance liefert den organisatorischen Rahmen: autonome Instandhaltung durch die Bediener, geplante Instandhaltung durch das Instandhaltungsteam, gezielte Verbesserung bei chronischen Verlusten. PdM stärkt die Säule der geplanten Instandhaltung; die Verfügbarkeitsverluste in der OEE zeigen, wo sie sich lohnt. Siehe [TPM und OEE](https://www.m365.fm/learn/tpm-oee/) (geplant) und die [Entity-Seite zu TPM](https://www.m365.fm/entity/total-productive-maintenance/). Die übergeordneten Prinzipien stehen im Leitfaden [Lean Management](https://www.m365.fm/learn/lean-management/).
- **MES und ISA-95.** Maschinenzustände, Stillstandsgründe und Produktionskontext liegen meist im MES. Die Verknüpfung von Zustandsdaten mit MES-Zuständen und Aufträgen beseitigt viele Fehlalarme und erlaubt es, Reparaturen um die Produktion herum zu planen. Siehe [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant).
- **Produktionsplanung.** Ein vorhergesagter Ausfall ist eine Kapazitätsbeschränkung mit Datum. Werden geplante Instandhaltungsfenster in den Produktionsplan eingespeist, lassen sich Konflikte zwischen Instandhaltung und Produktion vermeiden. Siehe [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/).
- **Digital Twin.** Zustandsüberwachung und Prognose arbeiten auf Anlagenebene; ein digitaler Zwilling der Produktion kann einen vorhergesagten Ausfall als Szenario übernehmen und zeigen, welche Aufträge betroffen sind und wann ein Instandhaltungsfenster am wenigsten schadet. Der Leitfaden zum [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/) behandelt beide als getrennte Disziplinen, die voneinander profitieren, und dieser Artikel folgt derselben Linie.
- **Cloud-Plattformen.** Für einen Microsoft-basierten Stack ordnet der Leitfaden zu [Azure in der Fertigung](https://www.m365.fm/learn/manufacturing-it-azure/) die IIoT-Schichten den aktuellen Diensten zu; die m365.fm-Episode [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/) (englisch) geht tiefer auf die Datenbereitschaft ein.

Vorausschauende Instandhaltung gehört auch in das Verbesserungssystem des Werks (KVP). Wiederkehrende Befunde (derselbe Fluchtungsfehler, dieselbe Verunreinigung) sind Signale für die [Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant), und die Leistung der Instandhaltung ist eine der Säulen der [Operational Excellence](https://www.m365.fm/learn/operational-excellence/).

## Glossar

| Begriff | Bedeutung |
|---|---|
| Alarm-Precision / Recall | Anteil der Alarme, die echt waren / Anteil der echten Ausfälle, die rechtzeitig gemeldet wurden |
| Anomalieerkennung | Methoden, die das Normalverhalten lernen und Abweichungen markieren, ohne Ausfallbeispiele zu brauchen |
| Befund (As-found Condition) | Was der Techniker beim Öffnen oder Ausbauen eines Bauteils tatsächlich vorfindet; die Grundwahrheit für Alarme |
| BPFO / BPFI / FTF / BSF | Charakteristische Lagerschadensfrequenzen: Überrollfrequenz Außenring, Innenring, Käfigfrequenz, Wälzkörperdrehfrequenz |
| CBM (zustandsorientierte Instandhaltung) | Instandhaltung, die ausgelöst wird, wenn ein gemessener Zustand eine Grenze überschreitet |
| CMMS / EAM | Computergestütztes Instandhaltungsmanagementsystem / Enterprise Asset Management; dort liegen Aufträge, Anlagen und Historie |
| Edge Computing | Verarbeitung von Daten nahe an der Maschine (Gateway, Industrie-PC), bevor sie weitergeschickt werden |
| ESA / MCSA | Elektrische Signaturanalyse / Motorstromsignaturanalyse; Diagnose aus Strom und Spannung der Motorversorgung |
| FFT | Schnelle Fourier-Transformation; wandelt ein Zeitsignal in sein Frequenzspektrum um |
| Funktionsausfall (F) | Der Punkt, an dem eine Anlage ihre geforderte Funktion nicht mehr erfüllen kann |
| Hüllkurvenanalyse (Envelope Analysis) | Schwingungsverfahren, das hochfrequente Stöße demoduliert, um frühe Lager- und Zahnradschäden sichtbar zu machen |
| IIoT | Industrial Internet of Things: vernetzte Sensoren, Geräte und Software in der Industrie |
| ISO 13374 | ISO-Reihe zu Datenverarbeitung, Kommunikation und Darstellung für Zustandsüberwachung und Diagnose |
| ISO 17359 | Allgemeine Leitlinien für den Aufbau eines Zustandsüberwachungsprogramms |
| ISO 20816 | Messung und Bewertung von Maschinenschwingungen (Nachfolgereihe von ISO 10816) |
| Kritikalitätsrangfolge | Strukturierte Bewertung von Anlagen nach Folgen und Wahrscheinlichkeit eines Ausfalls |
| MQTT | Schlankes Publish/Subscribe-Nachrichtenprotokoll, ein OASIS-Standard |
| MTBF / MTTR | Mittlere Betriebszeit zwischen Ausfällen / mittlere Reparaturzeit |
| Netto-P-F-Intervall | P-F-Intervall minus Inspektionsintervall: die Vorwarnung, auf die man sich tatsächlich verlassen kann |
| OPC UA | Plattformunabhängige, serviceorientierte Architektur für sicheren industriellen Datenaustausch mit Informationsmodellierung |
| P-F-Kurve / P-F-Intervall | Verlauf des Zustands über die Zeit vom erkennbaren potenziellen Ausfall (P) bis zum Funktionsausfall (F); die Zeit dazwischen |
| PdM (Predictive Maintenance) | Instandhaltung, deren Zeitpunkt sich nach dem gemessenen Zustand plus einer Prognose seiner Entwicklung richtet |
| Präskriptive Instandhaltung | Instandhaltung, bei der das System auch die Maßnahme und ihren Zeitpunkt empfiehlt |
| RCM (zuverlässigkeitsorientierte Instandhaltung) | Strukturierte Methode, um je Ausfallart anhand ihrer Folgen die richtige Instandhaltungsmaßnahme auszuwählen |
| RUL (Restlebensdauer, Remaining Useful Life) | Geschätzte Zeit oder Zyklenzahl, bis eine Anlage eine definierte Ausfallgrenze erreicht |
| Sparkplug | Eclipse-Spezifikation, die MQTT um industrielle Konventionen einschließlich Gerätezustandsmanagement ergänzt |
| Unified Namespace (UNS) | Architekturmuster, bei dem Systeme Daten in einer gemeinsamen, hierarchischen Topic-Struktur veröffentlichen und nutzen |
| Wartungsplantreue (PM Compliance) | Anteil der fälligen präventiven Wartungsaufträge, die im vereinbarten Zeitfenster erledigt wurden |
| Weibull-Verteilung | Statistische Verteilung für Ausfallzeiten; ihr Formparameter zeigt Frühausfall-, Zufalls- oder Verschleißverhalten |

## FAQ: Predictive Maintenance und IIoT

### Was ist Predictive Maintenance einfach erklärt?

Predictive Maintenance bedeutet, eine Maschine instand zu setzen, wenn Messungen zeigen, dass sie auszufallen beginnt, bevor sie tatsächlich kaputtgeht. Sensoren oder regelmäßige Inspektionen verfolgen Signale wie Schwingung, Temperatur und Ölzustand; zeigt der Trend ein sich entwickelndes Problem, wird die Reparatur in den nächsten passenden Stillstand gelegt.

### Wie funktioniert vorausschauende Wartung?

In fünf Schritten. Sensoren oder Routenmessungen erfassen ein Signal, das sich verändert, während sich ein Ausfall entwickelt, etwa Schwingung, Temperatur, Ölzustand oder Motorstrom. Ein Edge-Gerät oder die Datenplattform vergleicht es mit einer Referenz und Alarmgrenzen, ergänzt den Produktionskontext und verfolgt den Trend. Überschreitet ein Trend eine Grenze, diagnostiziert ein Analyst oder ein Modell die wahrscheinliche Ausfallart und schätzt, wie viel Zeit bleibt. Der Befund wird zu einem geplanten Auftrag im CMMS, terminiert in den nächsten passenden Stillstand. Das Ergebnis der Befundaufnahme fließt zurück, um Grenzen und Modelle zu verbessern (Abschnitte 5 und 6).

### Was ist der Unterschied zwischen vorausschauender und präventiver Wartung?

Präventive Wartung wird nach Zeit oder Nutzung geplant (alle 3 Monate, alle 5.000 Stunden), unabhängig davon, ob das Teil es braucht. Vorausschauende Wartung wird nach dem gemessenen Zustand des Teils geplant. Präventive Wartung ist einfacher und passt zu altersbedingtem Verschleiß; vorausschauende Wartung passt zu Ausfallarten, die eine messbare Vorwarnung geben und teuer sind, wenn sie ungeplant eintreten.

### Was ist der Unterschied zwischen vorausschauender und zustandsorientierter Instandhaltung?

Zustandsorientierte Instandhaltung löst eine Maßnahme aus, wenn ein Messwert eine Grenze überschreitet, zum Beispiel "Gesamtschwingung über Voralarm: innerhalb von sieben Tagen prüfen". Vorausschauende Instandhaltung ergänzt eine Prognose, wie schnell sich der Zustand verschlechtert, sodass die Reparatur für einen bestimmten Stillstand geplant werden kann. Viele Werke verwenden beide Begriffe gleichbedeutend; in der Praxis ist vorausschauende Instandhaltung zustandsorientierte Instandhaltung plus Trendverfolgung plus Prognose (Abschnitt 1).

### Welche vier Arten der Instandhaltung gibt es?

Die häufigste Einteilung ist reaktiv (Betrieb bis zum Ausfall), präventiv (zeit- oder nutzungsabhängig), vorausschauend oder zustandsorientiert (nach gemessenem Zustand) und präskriptiv (das System empfiehlt auch die Maßnahme). Zuverlässigkeitsorientierte Instandhaltung (RCM) ist keine fünfte Art, sondern eine Methode, um je Ausfallart zwischen ihnen zu wählen.

### Was ist IIoT und wie hängt es mit Predictive Maintenance zusammen?

Das Industrial Internet of Things ist das Netz aus vernetzten Sensoren, Maschinen, Gateways und Software im industriellen Betrieb. Es macht vorausschauende Instandhaltung in der Breite bezahlbar, indem es die Kosten je Messstelle senkt, Daten über Standardprotokolle wie OPC UA und MQTT transportiert und Zustandsdaten mit Produktionskontext und Instandhaltungssystemen verknüpft.

### Welche Beispiele für Predictive Maintenance gibt es?

Typische Beispiele: Schwingungssensoren, die einen sich entwickelnden Lagerschaden an einem Ventilatormotor Wochen vor dem Ausfall erkennen; Thermografiebegehungen, die eine lose Verbindung in einem Schaltschrank finden; Ölanalysen, die steigendes Eisen und Silizium in einem Getriebe zeigen und auf Verschleiß durch Verunreinigung hindeuten; Ultraschall, der Druckluftleckagen und unterschmierte Lager findet; Motorstromanalysen, die gebrochene Läuferstäbe an einer Tauchpumpe erkennen.

### Welche Verfahren werden in der vorausschauenden Instandhaltung eingesetzt?

Die wichtigsten Verfahren sind Schwingungsanalyse, Infrarot-Thermografie, Öl- und Verschleißpartikelanalyse, Ultraschall, Motorstrom- und elektrische Signaturanalyse sowie Leistungstrends aus Prozessdaten. Der O&M-Best-Practices-Leitfaden des DOE behandelt dieselben Verfahrensfamilien [3].

### Was ist die P-F-Kurve?

Die P-F-Kurve zeigt, wie der Zustand einer Anlage vom Punkt, an dem ein sich entwickelnder Ausfall erstmals erkennbar wird (P, potenzieller Ausfall), bis zu dem Punkt abnimmt, an dem sie ihre Funktion nicht mehr erfüllen kann (F, Funktionsausfall). Die Zeit dazwischen ist das P-F-Intervall. Inspektionen müssen häufiger stattfinden als das P-F-Intervall, und die verbleibende Vorwarnung muss lang genug sein, um die Reparatur zu planen.

### Wie viel spart Predictive Maintenance?

Das hängt von den eigenen Ausfällen, ihren Kosten und davon ab, wie viele man erkennt. Der DOE-Leitfaden nennt 8 % bis 12 % Einsparung von vorausschauender gegenüber präventiver Wartung und Umfragedurchschnitte von 25 % bis 30 % geringeren Instandhaltungskosten, nennt die Umfragen aber nicht [2]. Eine NIST-Auswertung ergab, dass Werke mit mehr vorausschauender Instandhaltung weniger Stillstand und weniger Fehler meldeten, warnt aber, dass viele Unterschiede statistisch nicht signifikant waren [4]. Den eigenen Business Case mit einer ROI-Rechnung wie in diesem Leitfaden aufbauen.

### Welchen ROI hat Predictive Maintenance?

Im Rechenbeispiel dieses Leitfadens amortisiert sich ein Pilot mit 12 Anlagen, der einmalig 57.100 USD und jährlich 34.200 USD kostet, in etwa sechs Monaten, wenn er an einer Engpasslinie 60 % der Ausfälle erkennt, und erreicht den Break-even über drei Jahre bei etwa 20 % Erkennungsrate. Anbieterangaben von 10:1 ROI oder mehr beschreiben ausgewählte Erfolge, nicht den Durchschnitt.

### Wie startet man ein Predictive-Maintenance-Programm?

Mit einer Kritikalitätsrangfolge und einer Basis aus Ausfällen und Stillstand beginnen, 10 bis 30 Anlagen mit Ausfallarten auswählen, die eine Vorwarnung geben, ein oder zwei passende Verfahren wählen, festlegen, wer auf Alarme reagiert und wie Alarme zu Aufträgen werden, und einen Piloten über 6 bis 12 Monate mit Erfolgskriterien fahren, die mit Produktion und Controlling abgestimmt sind.

### Was sind die Herausforderungen von Predictive Maintenance?

Die schwierigen Teile sind selten die Sensoren. Häufige Probleme sind fehlende Fehlercodes und Instandhaltungshistorie, keine Basis, um Einsparungen zu belegen, Alarme, die den Betriebskontext ignorieren und Alarmmüdigkeit verursachen, kein Verantwortlicher, der auf Alarme reagiert, Piloten, die nie einen Skalierungsplan bekommen, Gateways ohne Sicherheitskonzept und Machine Learning, das für Anlagen mit nur einer Handvoll dokumentierter Ausfälle versprochen wird. Manche Ausfallarten geben außerdem zu wenig Vorwarnung, um sie überhaupt vorherzusagen (Abschnitte 15 und 16).

### Braucht man Machine Learning für Predictive Maintenance?

Nicht am Anfang. Regelbasierte Grenzen und Trends auf gut gewählten Signalen erkennen viele sich entwickelnde Ausfälle. Anomalieerkennung hilft, wenn es zu viele Signale gibt, um sie manuell zu beobachten. Modelle für Ausfallvorhersage und Restlebensdauer brauchen eine gelabelte Ausfallhistorie, die die meisten Werke erst aufbauen müssen.

### Welche Daten braucht man für Predictive Maintenance?

Ein sauberes, systemübergreifend zugeordnetes Anlagenverzeichnis, Zustandssignale mit einer zur Ausfallart passenden Abtastrate, synchronisierte Zeitstempel, Prüfungen des Sensorzustands, Betriebskontext (Zustand, Drehzahl, Last, Produkt), einen Referenzzeitraum im Normalbetrieb und eine Ausfallhistorie mit brauchbaren Fehlercodes. Der letzte Punkt ist oft der Engpass.

### Was ist die Restlebensdauer (Remaining Useful Life, RUL)?

Die RUL ist die geschätzte Zeit oder Zyklenzahl, bis eine Anlage eine definierte Ausfallgrenze erreicht. Sie lässt sich aus physikalischen Schadensmodellen, aus datengetriebenen Modellen, die auf Degradationsverläufen trainiert sind, oder aus einer Kombination schätzen. Eine brauchbare RUL-Schätzung enthält einen Unsicherheitsbereich.

### Welche Sensoren werden für Predictive Maintenance eingesetzt?

Beschleunigungsaufnehmer für Schwingung, Temperatursensoren und Wärmebildkameras, Ultraschallsensoren, Stromwandler für den Motorstrom, Sensoren für Ölqualität und Partikel sowie Prozesssensoren wie Druck und Durchfluss. Viele Signale sind in Frequenzumrichtern und SPS bereits vorhanden.

### Ist OPC UA oder MQTT besser für IIoT?

Sie lösen verschiedene Probleme und werden oft kombiniert. OPC UA bietet umfangreiche Informationsmodelle und Sicherheit für den Zugriff auf Maschinendaten, typischerweise an der Maschine und am Edge. MQTT ist ein schlanker Publish/Subscribe-Transport, der sich eignet, um Daten von vielen Edge-Geräten zu einem Broker oder in die Cloud zu bringen. Viele Architekturen lesen über OPC UA an der Maschine und veröffentlichen über MQTT nach oben.

### Funktioniert Predictive Maintenance auch an älteren Maschinen?

Ja. Das Nachrüsten von Funksensoren für Schwingung und Temperatur, Stromwandler in der MCC oder Routenmessungen funktionieren an Maschinen jeden Alters. Die Grenzen sind der Zugang für die Montage, eine sichere Installation und die Verfügbarkeit von Kontextdaten aus älteren Steuerungen.

### Ist Predictive Maintenance ein Cybersecurity-Risiko?

Es kann eines sein. Jedes Gateway, jedes Sensornetz und jede Cloud-Verbindung schafft einen weiteren Weg ins Werksnetz. IIoT-Geräte segmentieren, Zugriffe nur lesend halten, Verbindungen authentifizieren und verschlüsseln, den Fernzugriff von Anbietern kontrollieren und NIST SP 800-82 Rev. 3 sowie ISA/IEC 62443 folgen [29][30].

### Was ist der Unterschied zwischen Predictive Maintenance und einem Digital Twin?

Predictive Maintenance überwacht und prognostiziert den Zustand einzelner Anlagen. Ein Digital Twin ist eine breitere virtuelle Abbildung einer Anlage, eines Prozesses oder eines Werks. Ein Produktionszwilling kann vorhergesagte Ausfälle als Szenarien nutzen, aber die meisten Anwendungen der vorausschauenden Instandhaltung brauchen keinen Zwilling.

## Fazit und erste Schritte

Predictive Maintenance ist eine einfache Idee mit anspruchsvoller Umsetzung: das richtige Signal an der richtigen Anlage messen, die Veränderung früh genug bemerken und daraus eine geplante Reparatur machen. Das IIoT hat die Messung billiger und die Daten leichter verknüpfbar gemacht. Es hat weder die Physik des Ausfalls geändert noch den Bedarf an guten Ausfalldaten noch die Tatsache, dass Nutzen erst entsteht, wenn ein Mensch die Arbeit plant und ausführt.

Die Belege stützen eher die Richtung als die Schlagzeilenzahlen. Der DOE-Leitfaden und die NIST-Auswertung verbinden beide eine reife Instandhaltung mit weniger Stillstand und geringeren Kosten, aber keine der beiden Quellen liefert eine Zahl, die sich ohne eigene Basis ins Budget schreiben ließe. Das ROI-Rechenbeispiel zeigt, was über den Business Case entscheidet: die Erkennungsrate, der Wert einer Engpassstunde und die laufenden Programmkosten.

Mit weniger Anlagen beginnen als gedacht, messen, bevor installiert wird, und genauso viel in den Prozess vom Alarm zum Auftrag investieren wie in Sensoren und Modelle.

**Die ersten Schritte in den nächsten 30 Tagen**

- [ ] Die Störungsaufträge und Stillstandsereignisse der letzten 24 bis 36 Monate für die Engpasslinie ziehen und ein Pareto der Ausfälle nach Anlage und Ausfallart erstellen
- [ ] Die wichtigsten Anlagen mit der Bewertungstabelle aus diesem Leitfaden nach Folgen, Wahrscheinlichkeit und Erkennbarkeit einstufen
- [ ] Für die obersten fünf die vorherrschende Ausfallart, ihren wahrscheinlichen Vorboten, das Verfahren, das ihn erkennt, und das geschätzte P-F-Intervall aufschreiben
- [ ] Die aktuelle MTBF, MTTR, Wartungsplantreue und den Anteil reaktiver Arbeit als Basis berechnen
- [ ] Mit dem Werkscontroller abstimmen, wie Stillstand und vermiedene Reparaturkosten bewertet werden
- [ ] Den Prozess der Alarmreaktion entwerfen: wer bewertet, in welcher Zeit, wie werden Alarme zu CMMS-Aufträgen, wie werden Befunde dokumentiert
- [ ] Bei OT/IT klären, wie Sensor-Gateways nach den eigenen Sicherheitsregeln ans Netz angebunden würden, bevor Angebote eingeholt werden
- [ ] Zwei erfahrene Techniker in die Wahl der Sensorpositionen und der Alarmprioritäten einbeziehen

---

## Weiterlesen auf m365.fm

**Episoden und Beiträge (englisch)**
- [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/) (Episode)
- [Device Twin vs Azure Digital Twins: Choosing the Right Layer for Industrial IoT](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/)
- [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/) (Episode)

**Glossarbegriffe (Entities)**
[Total productive maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Digital twin](https://www.m365.fm/entity/digital-twin/) · [Industry 4.0](https://www.m365.fm/entity/industry-4-0/) · [Theory of constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Shop floor management](https://www.m365.fm/entity/shop-floor-management/)

**Schwesterleitfäden**
- [TPM und OEE](https://www.m365.fm/learn/tpm-oee/) (geplant)
- [Azure in der Fertigung (Manufacturing IT mit Azure)](https://www.m365.fm/learn/manufacturing-it-azure/)
- [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/)
- [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant)
- [OT-Security und ISA/IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)
- [Theory of Constraints und Engpasssteuerung](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant)
- [Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant)
- [Lean Management](https://www.m365.fm/learn/lean-management/)
- [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/)
- [Shopfloor Management und Gemba Walks](https://www.m365.fm/learn/shop-floor-management/)
- [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) (geplanter Cluster)
- [Operational Excellence](https://www.m365.fm/learn/operational-excellence/)
- [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/)

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Fertigungsbetrieb, Instandhaltung und die digitale Transformation der Produktion, mit dem Schwerpunkt, wie Werke Shopfloor-Daten, Analytics und die Microsoft-Cloud in der Praxis verbinden. [Redaktion: Rolle, Kurzbiografie und Foto ergänzen.]

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Quellen

Alle Quellen abgerufen am 20. November 2026 und an diesem Tag geöffnet und geprüft. Wettbewerbsseiten aus der Wettbewerbsanalyse sind nur aufgeführt, wenn sie im Text zitiert werden.

1. ISO 17359:2018, Condition monitoring and diagnostics of machines: General guidelines (Ausgabe 3, Januar 2018; überprüft und bestätigt 2023). International Organization for Standardization. https://www.iso.org/standard/71194.html
2. Sullivan, G. P.; Pugh, R.; Melendez, A. P.; Hunt, W. D.: Operations & Maintenance Best Practices: A Guide to Achieving Operational Efficiency, Release 2.0 (Dezember 2002), PNNL-13890, Kapitel 5 (S. 5.1 bis 5.4) und Kapitel 2 (S. 2.1). Pacific Northwest National Laboratory für das US Department of Energy, Federal Energy Management Program. https://www.pnnl.gov/main/publications/external/technical_reports/PNNL-13890.pdf
3. Sullivan, G. P. et al.: Operations & Maintenance Best Practices: A Guide to Achieving Operational Efficiency, Release 3.0 (August 2010), Kapitel 6 "Predictive Maintenance Technologies" (Inhaltsverzeichnis). US Department of Energy, Federal Energy Management Program. https://www.energy.gov/sites/default/files/2020/04/f74/omguide_complete_w-eo-disclaimer.pdf (Einstiegsseite: https://www.energy.gov/eere/femp/articles/operations-and-maintenance-best-practices-guide-achieving-operational-efficiency)
4. Thomas, D. S.; Weiss, B. A.: Economics of Manufacturing Machinery Maintenance: A Survey and Analysis of U.S. Costs and Benefits. NIST Advanced Manufacturing Series 100-34 (Juni 2020), S. 1 und Tabellen 7.2 und 7.3. National Institute of Standards and Technology. https://doi.org/10.6028/NIST.AMS.100-34
5. ISO 13381-1:2015, Condition monitoring and diagnostics of machines: Prognostics, Part 1: General guidelines (Ausgabe 2; als zurückgezogen geführt, Dezember 2021). International Organization for Standardization. https://www.iso.org/standard/51436.html
6. OPC Unified Architecture (OPC UA): Überblick. OPC Foundation. https://opcfoundation.org/about/opc-technologies/opc-ua/
7. MQTT: The Standard for IoT Messaging. mqtt.org. https://mqtt.org/
8. Operations & Maintenance Best Practices: A Guide to Achieving Operational Efficiency, Release 3.0, Bericht PNNL-19634, OSTI ID 1220381. US DOE Office of Scientific and Technical Information. https://www.osti.gov/biblio/1220381
9. Nowlan, F. S.; Heap, H. F.: Reliability-Centered Maintenance (29. Dezember 1978), Bericht AD-A066579, United Airlines für das Office of the Assistant Secretary of Defense (Manpower, Reserve Affairs and Logistics), Exhibit 2.13. Defense Technical Information Center. https://apps.dtic.mil/sti/pdfs/ADA066579.pdf
10. Reliability-centered maintenance (Geschichte, Nowlan und Heap 1978, SAE JA1011 1998, Moubray 1997). Wikipedia. https://en.wikipedia.org/wiki/Reliability-centered_maintenance
11. ISO 20816-1:2016, Mechanical vibration: Measurement and evaluation of machine vibration, Part 1: General guidelines (Ausgabe 1; bestätigt 2021). International Organization for Standardization. https://www.iso.org/standard/63180.html
12. ISO 20816-3:2022, Mechanical vibration: Measurement and evaluation of machine vibration, Part 3: Industrial machinery with a power rating above 15 kW and operating speeds between 120 r/min and 30 000 r/min (Ausgabe 1, Oktober 2022). International Organization for Standardization. https://www.iso.org/standard/78311.html
13. ISO 10816-3:2009 (zurückgezogen; überarbeitet durch ISO 20816-3:2022). International Organization for Standardization. https://www.iso.org/standard/50528.html
14. NFPA 70B (Standard for Electrical Equipment Maintenance; mit der Ausgabe 2023 von einer empfohlenen Praxis zu einer Norm geändert). Wikipedia. https://en.wikipedia.org/wiki/NFPA_70B
15. Predictive maintenance (Verfahren einschließlich Schwingung, Ultraschall, Infrarot, Ölanalyse, Motorstromsignaturanalyse). Wikipedia. https://en.wikipedia.org/wiki/Predictive_maintenance
16. ISO 13374-1:2003, Condition monitoring and diagnostics of machines: Data processing, communication and presentation, Part 1: General guidelines (überprüft und bestätigt 2025). International Organization for Standardization. https://www.iso.org/standard/21832.html
17. MIMOSA OSA-CBM (Open System Architecture for Condition-Based Maintenance). MIMOSA. https://www.mimosa.org/mimosa-osa-cbm/
18. Eclipse Sparkplug (Spezifikation Version 3.0). Eclipse Foundation. https://sparkplug.eclipse.org/
19. ISA-95 Standard: Enterprise-Control System Integration (auch ANSI/ISA-95, IEC 62264). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
20. ISO 14224:2016, Petroleum, petrochemical and natural gas industries: Collection and exchange of reliability and maintenance data for equipment (Ausgabe 3; bestätigt 2022). International Organization for Standardization. https://www.iso.org/standard/64076.html
21. CMAPSS Jet Engine Simulated Data (Referenz: Saxena, A.; Goebel, K.; Simon, D.; Eklund, N.: Damage Propagation Modeling for Aircraft Engine Run-to-Failure Simulation, PHM08, Denver, CO, Oktober 2008). NASA Open Data Portal. https://data.nasa.gov/dataset/cmapss-jet-engine-simulated-data
22. Carvalho, T. P.; Soares, F. A. A. M. N.; Vita, R.; Francisco, R. da P.; Basto, J. P.; Alcalá, S. G. S.: A systematic literature review of machine learning methods applied to predictive maintenance. Computers & Industrial Engineering, Bd. 137 (2019), 106024. https://doi.org/10.1016/j.cie.2019.106024
23. Vogl, G. W.; Weiss, B. A.; Helu, M. M.: A review of diagnostic and prognostic capabilities and best practices for manufacturing. Journal of Intelligent Manufacturing (online veröffentlicht am 9. Juni 2016). National Institute of Standards and Technology. https://doi.org/10.1007/s10845-016-1228-8 (Eintrag: https://www.nist.gov/publications/review-diagnostic-and-prognostic-capabilities-and-best-practices-manufacturing)
24. NIST/SEMATECH e-Handbook of Statistical Methods, Abschnitt 8.1.6.2: Weibull. National Institute of Standards and Technology. https://www.itl.nist.gov/div898/handbook/apr/section1/apr162.htm
25. Predictive Maintenance: Deloitte's Perspective (2022). Deloitte. https://www.deloitte.com/content/dam/Deloitte/us/Documents/process-and-operations/us-predictive-maintenance.pdf
26. Society for Maintenance & Reliability Professionals (SMRP): Startseite (Best Practices, Metrics & Guidelines; Zertifizierung SMRPCO). SMRP. https://smrp.org/
27. Certification (Schwingungsanalysten Kategorien I bis IV; Wissenskatalog nach ISO 18436-2; ANSI-Akkreditierung März 2010, heute ANAB nach ISO/IEC 17024). Vibration Institute. https://www.vi-institute.org/certification/
28. 29 CFR 1910.147, The control of hazardous energy (lockout/tagout), Absatz (a)(1)(i). Occupational Safety and Health Administration, US Department of Labor. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147
29. Stouffer, K. et al.: Guide to Operational Technology (OT) Security. NIST Special Publication 800-82 Rev. 3 (September 2023). National Institute of Standards and Technology. https://doi.org/10.6028/NIST.SP.800-82r3 (https://csrc.nist.gov/pubs/sp/800/82/r3/final)
30. ISA/IEC 62443 Series of Standards. International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
31. ISO/DIS 13381-1, Condition monitoring and diagnostics of machines: Prognostics, Part 1: General guidelines (Ausgabe 3, Stadium 40.20 DIS-Abstimmung; wird ISO 13381-1:2015 ersetzen). International Organization for Standardization. https://inen.isolutions.iso.org/standard/88029.html (abgerufen am 20. November 2026)
32. The Six Failure Patterns: Nowlan and Heap Explained. Reliable (reliamag.com), 1. September 2026, geändert am 13. Oktober 2026 (Sekundärquelle; zitiert Exhibit 2.13 von AD-A066579). https://reliamag.com/topics/guides/six-failure-patterns-nowlan-heap (abgerufen am 20. November 2026)
33. Nelson, C.: Determining Shock and Arc Flash Boundaries When Performing Thermography on Energized Electrical Equipment. JM Test Systems, 3. Februar 2023, geändert am 10. September 2025 (Sekundärquelle zu NFPA 70E). https://jmtest.com/keeping-your-distance-determining-shock-and-arc-flash-boundaries-when-performing-thermography-on-energized-electrical-equipment/ (abgerufen am 20. November 2026)
34. ISO 4406:2021, Hydraulic fluid power: Fluids: Method for coding the level of contamination by solid particles (vierte Ausgabe, ersetzt ISO 4406:2017), Musterseiten. iTeh Standards. https://standards.iteh.ai/catalog/standards/iso/69d30c38-931a-4124-8779-f91ae1bda063/iso-4406-2021 (abgerufen am 20. November 2026)
35. Bearing Fault Frequencies: BPFO, BPFI, BSF, and FTF (Glossar; Herstellerquelle). Tractian. https://tractian.com/en/glossary/bearing-fault-frequencies (abgerufen am 20. November 2026)
36. Jones, B.: Vibrations help find faulty components. SKF Evolution, 15. September 1999. https://evolution.skf.com/us/vibrations-help-find-faulty-components-3/ (abgerufen am 20. November 2026)
37. Hajnayeb, S.; Hoseintabar Marzebali, M.; Abolghasemi, V.; Faiz, J.: Broken Rotor Bar Fault Detection of Induction Machine Based on Rectified Orthogonal Axes of Stator Current. Akzeptiertes Manuskript (IEEE Transactions on Instrumentation and Measurement laut Dateiname im Repository; Jahr und DOI nicht angegeben), Repository der University of Essex. https://repository.essex.ac.uk/39130/1/Accepted-TIM.pdf (abgerufen am 20. November 2026)

# Prüfhinweise für die Redaktion

**Herstellerangaben und Beratungsaussagen (im Text gekennzeichnet)**

- Nutzenspannen von Wettbewerbsseiten ("18 % bis 31 % geringere Instandhaltungskosten", "ROI von 10:1", "500 % bis 1.000 % ROI", "87,3 % weniger Fehler") werden nicht als Fakten wiederholt; der Text nennt ihre wahrscheinliche Herkunft (DOE-Umfrageliste, NIST-Auswertung) oder kennzeichnet sie als Anbieter- oder Beratungsaussagen.
- Die Deloitte-Spannen von 2022 werden nur zitiert, um ihre Grundlage zu zeigen; keine Deloitte-Prozentzahl im Artikel.
- Alle Kostenzahlen im ROI-Beispiel (Sensor 800 USD, Gateway 2.500 USD, 25 USD je Sensor und Monat, 4.500 USD Deckungsbeitrag je Stunde, Reparaturkosten) sind als Annahmen gekennzeichnet, keine Marktpreise. Tractian [35] ist eine Herstellerquelle.

**[unbelegt]-Stellen und offene Prüfpunkte**

1. Aufteilung der Ausfallmuster D, E und F (7 %, 14 %, 68 %): A, A+B und C über Sekundärquelle [32] bestätigt; D bis F im DTIC-Scan prüfen oder Moubray (RCM II) zitieren.
2. "Höchstens im halben P-F-Intervall inspizieren": Konvention aus der Praxis, keine Norm gefunden.
3. Zielwert 90 % Wartungsplantreue: als internes Ziel markiert, kein veröffentlichter Benchmark.
4. OPC UA als IEC 62541: aus dem Text entfernt; bei Bedarf mit Quelle ergänzen.
5. Wortlaut der Prozentzahlen in DOE Release 3.0 (zitiert wird Release 2.0, Kapitel 5; vor Veröffentlichung abgleichen).
6. Praxiswerte als Annahmen (Sensorpreise, Batterielebensdauer, P-F-Intervall von 8 Wochen im Ventilatorbeispiel) sind beispielhaft, nicht belegt.
7. ISO 20816 als "Nachfolgereihe von ISO 10816" (Glossar): iso.org bestätigt nur, dass 20816-3:2022 die 10816-3:2009 überarbeitet [13].

**Quellenhinweise.** ISO 13381-1:2015 ist zurückgezogen; Nachfolgeausgabe ISO/DIS 13381-1 im DIS-Stadium [31], nach Erscheinen aktualisieren. Wikipedia wird für RCM-Geschichte und NFPA 70B zitiert; vor Veröffentlichung ggf. durch Primärdokumente ersetzen (DTIC AD-A066579, SAE JA1011, NFPA). Die peer-reviewten Übersichten [22][23] stützen nur allgemeine Aussagen.

**Interne Links.** Alle `/en/learn/`-Links sind auf die deutschen URLs der Slug-Map umgestellt. Bestehende deutsche Pillars (manufacturing-it-azure, digital-twin, produktionskennzahlen, produktionsplanung-aps, shop-floor-management, lean-management, operational-excellence, produktionsplanung-luftfahrt) sind ohne "(geplant)" verlinkt; neue Pillars tpm-oee, mes-isa-95, ot-security-iec-62443, theory-of-constraints-engpass, six-sigma-ursachenanalyse und der Cluster shop-floor-management/standardarbeit tragen "(geplant)" und sind nach Veröffentlichung zu aktivieren. Episoden-, Community- und Entity-Links sind unverändert (englischsprachige Inhalte, im Text als "englisch" markiert).

**Abgrenzung zu Schwesterseiten.** manufacturing-it-azure besitzt "Predictive Maintenance Azure" und die Zuordnung der Microsoft-Dienste; dieser Pillar besitzt die herstellerneutralen Keywords (Predictive Maintenance, vorausschauende Wartung, Verfahren, P-F-Kurve, ROI). tpm-oee besitzt TPM, autonome Instandhaltung, die sechs großen Verluste und die OEE-Berechnung. produktionskennzahlen besitzt MTBF/MTTR-Definitionen (hier konsistent). ot-security-iec-62443 besitzt Zonen, Conduits und Security Levels. Empfehlung: im Azure-Pillar einen Link mit dem Ankertext "Predictive Maintenance" auf diese Seite setzen.

**iFAKT-Offenlegung.** Im Artikel wird kein iFAKT-Produkt erwähnt, weil das Thema keinen echten Bezug zu Wertstrom-Software bietet. Die Autorenbox enthält "Hinweis: Der Autor arbeitet bei der iFAKT GmbH."; keine Kennzeichnung als Sponsoring, iFAKT bezahlt die Veröffentlichung nicht.

**Empfohlene Grafiken**

1. P-F-Kurve mit P- und F-Punkten für Schwingung, Ultraschall, Öl, Thermografie und hörbares Geräusch, Netto-P-F-Intervall markiert.
2. Fünf-Schichten-Architektur vom Sensor bis zum CMMS mit Protokollen je Abschnitt.
3. Skizze eines Lagerspektrums mit BPFO und Harmonischen bei 106,3 Hz und 212,7 Hz (beispielhaft).
4. ROI-Sensitivität: Kapitalwert über drei Jahre vs. Erkennungsrate (10 % bis 60 %) für 2.000 USD und 4.500 USD Deckungsbeitrag je Stunde.
5. Regelkreis: Alarm, Bewertung, Auftrag, Planung, Ausführung, Befundrückmeldung.
6. Kritikalitätsmatrix (Folgen × Wahrscheinlichkeit) mit den sechs Beispielanlagen.

**JSON-LD-Vorschlag**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Predictive Maintenance und IIoT: Verfahren, Architektur, ROI und der Einstieg",
      "description": "Vorausschauende Wartung mit IIoT: P-F-Kurve, Schwingung, Öl, Thermografie, Architektur bis zum CMMS, ML und Restlebensdauer, ROI und Kennzahlen.",
      "inLanguage": "de-DE",
      "datePublished": "2026-11-26",
      "dateModified": "2026-11-26",
      "mainEntityOfPage": "https://www.m365.fm/learn/predictive-maintenance-iiot/",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "about": [
        {"@type": "Thing", "name": "Predictive Maintenance"},
        {"@type": "Thing", "name": "Industrial Internet of Things"},
        {"@type": "Thing", "name": "Zustandsüberwachung"}
      ]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "de-DE",
      "mainEntity": [
        {"@type": "Question", "name": "Was ist Predictive Maintenance einfach erklärt?", "acceptedAnswer": {"@type": "Answer", "text": "Predictive Maintenance bedeutet, eine Maschine instand zu setzen, wenn Messungen zeigen, dass sie auszufallen beginnt, bevor sie tatsächlich kaputtgeht. Sensoren oder regelmäßige Inspektionen verfolgen Signale wie Schwingung, Temperatur und Ölzustand; zeigt der Trend ein sich entwickelndes Problem, wird die Reparatur in den nächsten passenden Stillstand gelegt."}},
        {"@type": "Question", "name": "Was ist der Unterschied zwischen vorausschauender und präventiver Wartung?", "acceptedAnswer": {"@type": "Answer", "text": "Präventive Wartung wird nach Zeit oder Nutzung geplant, unabhängig davon, ob das Teil es braucht. Vorausschauende Wartung wird nach dem gemessenen Zustand des Teils geplant. Präventive Wartung passt zu altersbedingtem Verschleiß; vorausschauende Wartung passt zu Ausfallarten, die eine messbare Vorwarnung geben und ungeplant teuer sind."}},
        {"@type": "Question", "name": "Was ist die P-F-Kurve?", "acceptedAnswer": {"@type": "Answer", "text": "Die P-F-Kurve zeigt, wie der Zustand einer Anlage vom Punkt, an dem ein sich entwickelnder Ausfall erstmals erkennbar wird (P, potenzieller Ausfall), bis zum Funktionsausfall (F) abnimmt. Die Zeit dazwischen ist das P-F-Intervall."}},
        {"@type": "Question", "name": "Was ist IIoT und wie hängt es mit Predictive Maintenance zusammen?", "acceptedAnswer": {"@type": "Answer", "text": "Das Industrial Internet of Things ist das Netz aus vernetzten Sensoren, Maschinen, Gateways und Software im industriellen Betrieb. Es macht vorausschauende Instandhaltung in der Breite bezahlbar, indem es die Kosten je Messstelle senkt, Daten über OPC UA und MQTT transportiert und Zustandsdaten mit Produktionskontext und Instandhaltungssystemen verknüpft."}},
        {"@type": "Question", "name": "Braucht man Machine Learning für Predictive Maintenance?", "acceptedAnswer": {"@type": "Answer", "text": "Nicht am Anfang. Regelbasierte Grenzen und Trends auf gut gewählten Signalen erkennen viele sich entwickelnde Ausfälle. Anomalieerkennung hilft bei sehr vielen Signalen. Modelle für Ausfallvorhersage und Restlebensdauer brauchen eine gelabelte Ausfallhistorie."}},
        {"@type": "Question", "name": "Wie funktioniert vorausschauende Wartung?", "acceptedAnswer": {"@type": "Answer", "text": "In fünf Schritten: Signal erfassen, mit Referenz und Alarmgrenzen vergleichen und Kontext ergänzen, Ausfallart diagnostizieren und Restzeit schätzen, geplanten Auftrag im CMMS anlegen, Befund zurückmelden, um Grenzen und Modelle zu verbessern."}},
        {"@type": "Question", "name": "Was sind die Herausforderungen von Predictive Maintenance?", "acceptedAnswer": {"@type": "Answer", "text": "Die schwierigen Teile sind selten die Sensoren: fehlende Fehlercodes und Historie, keine Basis, Alarme ohne Betriebskontext, kein Verantwortlicher für Alarme, Piloten ohne Skalierungsplan, Gateways ohne Sicherheitskonzept und überzogene ML-Versprechen."}}
      ]
    }
  ]
}
```

**hreflang.** Canonical selbstreferenzierend auf `https://www.m365.fm/learn/predictive-maintenance-iiot/`. hreflang-Paar: `de-DE` https://www.m365.fm/learn/predictive-maintenance-iiot/ und `en-US` https://www.m365.fm/en/learn/predictive-maintenance-iiot/; in der englischen Fassung das Paar nachtragen (dort bisher "kein hreflang"). Breadcrumb-Vorschlag: Start > Learn > Predictive Maintenance und IIoT.

**Für den deutschen Markt prüfen (Aufgabe für die Fachprüfung)**

- Arbeitssicherheit bei Installation und Reparatur: Der Text nennt nur OSHA 29 CFR 1910.147 (Lockout/Tagout) und NFPA 70E/70B. Prüfen, ob die deutschen Gegenstücke ergänzt werden sollen (Betriebssicherheitsverordnung/BetrSichV, DGUV Vorschrift 3 und DGUV-Regeln für Arbeiten an elektrischen Anlagen, DIN VDE 0105-100, ArbSchG mit Gefährdungsbeurteilung).
- Abschnitt "Die Sicht von Werkern und Technikern": Der Text spricht allgemein von Gewerkschaft oder Arbeitnehmervertretung. Prüfen, ob ein Hinweis auf die Mitbestimmung des Betriebsrats bei technischen Überwachungseinrichtungen (§ 87 Abs. 1 Nr. 6 BetrVG) und auf Beschäftigtendatenschutz (DSGVO) aufgenommen werden soll.
- OT-Security: prüfen, ob NIS2 bzw. die deutsche Umsetzung neben NIST SP 800-82 und ISA/IEC 62443 genannt werden soll.
- Qualifikation: Der Text nennt das US-Programm des Vibration Institute; prüfen, ob deutsche Zertifizierungswege nach ISO 18436-2 (z. B. über DGZfP oder andere Stellen) ergänzt werden sollen.
- Kennzahlen: SMRP ist eine US-Fachgesellschaft; prüfen, ob ein Verweis auf DIN EN 15341 (Instandhaltungskennzahlen) bzw. DIN 31051 (Grundlagen der Instandhaltung) sinnvoll ist.
- Einheiten: Drehzahlen sind als min⁻¹ angegeben (Original rpm bzw. r/min); hp-Angaben stehen wie im Original in Klammern.

Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.
