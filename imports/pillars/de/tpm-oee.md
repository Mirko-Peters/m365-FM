# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Total Productive Maintenance (TPM): 8 Säulen und OEE (52 Zeichen) |
| Meta-Description | TPM einfach erklärt: die 8 Säulen, die sechs großen Verluste, OEE berechnen Schritt für Schritt, autonome Instandhaltung und weniger Stillstand. (144 Zeichen) |
| Slug | `/learn/tpm-oee/` (vollständige URL: https://www.m365.fm/learn/tpm-oee/) |
| Hauptkeyword | TPM (Total Productive Maintenance); zweites Hauptkeyword: OEE |
| Nebenkeywords | TPM Instandhaltung, was ist TPM, TPM in der Produktion, 8 Säulen TPM, TPM Säulen, sechs große Verluste, 16 Verlustarten, Gesamtanlageneffektivität, OEE berechnen, OEE Formel, OEE Beispiel, OEE Weltklasse, guter OEE-Wert, TEEP, Anlagenauslastung, autonome Instandhaltung, Jishu Hozen, 7 Schritte autonome Instandhaltung, geplante Instandhaltung, vorbeugende Instandhaltung, Kobetsu Kaizen, Qualitätsinstandhaltung, Anlaufmanagement neuer Anlagen, Office TPM, Reinigen Inspizieren Schmieren Nachziehen, Fehlerkarten (F-Tags), Ein-Punkt-Lektion (One Point Lesson), MTBF, MTTR, Anteil geplanter Instandhaltung, TPM vs. vorbeugende Instandhaltung, TPM vs. TQM, TPM Einführung, TPM Roadmap, JIPM, TPM Excellence Award, Seiichi Nakajima, Lockout/Tagout |
| Suchintention | Informational (Definition, Säulen, Verluste, Formel) mit starkem How-to-Anteil (OEE berechnen, autonome Instandhaltung starten, Einführung planen). Zielgruppe: Werks- und Instandhaltungsleitung, Zuverlässigkeits- und KVP-Ingenieure, Meister und Schichtführer, Werker und Teamleiter, Studierende des Wirtschaftsingenieurwesens und Maschinenbaus |
| Wortzahl | H1 bis Fazit inkl. Tabellen, Glossar und FAQ (`wc -w`, 26.11.2026): **13.654 Wörter** (englische Fassung: 14.123, gleiche Zählweise; 96,7 %) |
| Sprachversion | Deutsch (`de-DE`). hreflang-Paar: `de-DE` https://www.m365.fm/learn/tpm-oee/ <-> `en-US` https://www.m365.fm/en/learn/tpm-oee/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus; Nebenkeywords, Überschriften und FAQ-Fragen sollten danach gegen die deutschen Suchergebnisse abgeglichen werden.

# Total Productive Maintenance (TPM) und OEE: 8 Säulen, Verluste, OEE-Berechnung und Einführung

*Stand: November 2026 · Lesezeit: etwa 45 Minuten (Schnelleinstieg: Kurzantwort, "Das Wichtigste in Kürze", das OEE-Rechenbeispiel und die Checklisten)*

> **Kurzantwort:** Total Productive Maintenance (TPM) ist ein werksweites System, das Anlagen dauerhaft fähig hält, ihre Aufgabe zu erfüllen. Werker, Instandhaltung, Technik und Führung arbeiten dabei zusammen. Entwickelt wurde TPM in Japan aus der amerikanischen vorbeugenden Instandhaltung; Nippondenso, ein Zulieferer von Toyota, erhielt dafür 1971 als erstes Unternehmen den PM-Preis [2][3]. TPM bekämpft sechs große Verluste (Ausfälle, Rüsten und Einrichten, Kurzstillstände, verringerte Geschwindigkeit, Ausschuss und Nacharbeit, Anlaufverluste). Die Gesamtanlageneffektivität (Overall Equipment Effectiveness, OEE = Verfügbarkeit × Leistung × Qualität) misst, wie viel von der geplanten Zeit nach diesen Verlusten übrig bleibt [6][8].

> **Das Wichtigste in Kürze**
> - TPM steht auf acht Säulen, das Fundament bildet 5S. Das JIPM, die Organisation, die die TPM-Preise vergibt, behandelt vier davon (fokussierte Verbesserung, autonome Instandhaltung, geplante Instandhaltung, Qualitätsinstandhaltung) als Pflicht, weil sie direkt auf Verluste und OEE wirken [1].
> - OEE ist die Anzeigetafel von TPM, nicht sein Ziel. Der Wert liegt in der Verlustaufschlüsselung: Minuten je großem Verlust, sortiert nach Pareto.
> - Rechenbeispiel in diesem Leitfaden: Eine Spritzgießmaschine mit 87,1 % Verfügbarkeit, 88,0 % Leistung und 96,0 % Qualität läuft mit 73,6 % OEE. Nach einem Jahr TPM-Arbeit an allen sechs Verlusten erreicht sie 84,3 % und liefert 563 Gutteile mehr pro Tag.
> - Der Wert von 85 % als "Weltklasse-OEE" wird oft Nakajima zugeschrieben, ließ sich aber nicht auf eine Originalstelle zurückführen; Ljungberg fand über etwa 20 Fälle eine OEE von "nur rund 55 Prozent" [9]. Vergleichen Sie sich mit Ihrer eigenen Ausgangsbasis.
> - Autonome Instandhaltung läuft in sieben Schritten, von der Grundreinigung bis zum Selbstmanagement [26][3]. Werker reinigen, inspizieren, schmieren und ziehen nach; Reparaturen übernehmen sie nicht.
> - In den USA zieht der Lockout/Tagout-Standard der OSHA die Grenze: Normaler Produktionsbetrieb und routinemäßige kleine Wartungsarbeiten mit wirksamem Alternativschutz fallen nicht unter 29 CFR 1910.147; Reinigen hinter Schutzeinrichtungen oder das Beseitigen von Störungen im Gefahrenbereich in der Regel schon [14].
> - Eine realistische Einführung dauert Jahre, nicht Monate. Planen Sie in den ersten sechs Monaten eine Pilotlinie und vor jeder Ausweitung eine Stage-Gate-Prüfung.
> - Bevor Sie eine Maschine kaufen, berechnen Sie die TEEP: Sie zeigt, wie viel Kalenderzeit Ihre vorhandenen Anlagen noch haben.

## Inhaltsverzeichnis

1. [Was ist Total Productive Maintenance (TPM)?](#was-ist-total-productive-maintenance-tpm)
2. [Geschichte: von der US-Präventivwartung zu Nippondenso und JIPM](#geschichte-von-der-us-präventivwartung-zu-nippondenso-und-jipm)
3. [Wie TPM und OEE zusammenhängen](#wie-tpm-und-oee-zusammenhängen)
4. [Die sechs großen Verluste (und die 16 Verlustarten)](#die-sechs-großen-verluste-und-die-16-verlustarten)
5. [OEE berechnen: Rechenbeispiel mit den sechs großen Verlusten](#oee-berechnen-rechenbeispiel-mit-den-sechs-großen-verlusten)
6. [TEEP, Belegung, MTBF und MTTR](#teep-belegung-mtbf-und-mttr)
7. [Was ist ein guter OEE-Wert? Benchmarks und ihre Grenzen](#was-ist-ein-guter-oee-wert-benchmarks-und-ihre-grenzen)
8. [Das 5S-Fundament und die 8 Säulen von TPM](#das-5s-fundament-und-die-8-säulen-von-tpm)
9. [Autonome Instandhaltung (Jishu Hozen): die sieben Schritte](#autonome-instandhaltung-jishu-hozen-die-sieben-schritte)
10. [Geplante Instandhaltung: vom Feuerlöschen zum System](#geplante-instandhaltung-vom-feuerlöschen-zum-system)
11. [Fokussierte Verbesserung: zuerst den größten Verlust angehen](#fokussierte-verbesserung-zuerst-den-größten-verlust-angehen)
12. [TPM und Arbeitssicherheit: Lockout/Tagout, Ergonomie und die Stimme der Werker](#tpm-und-arbeitssicherheit-lockouttagout-ergonomie-und-die-stimme-der-werker)
13. [TPM einführen: Roadmap von 0 bis 36 Monaten](#tpm-einführen-roadmap-von-0-bis-36-monaten)
14. [TPM-Vorlagen und Checklisten](#tpm-vorlagen-und-checklisten)
15. [TPM-Kennzahlen: wie man das Programm misst](#tpm-kennzahlen-wie-man-das-programm-misst)
16. [Der Business Case: was ein OEE-Prozentpunkt wert ist](#der-business-case-was-ein-oee-prozentpunkt-wert-ist)
17. [Typische Fehler bei TPM](#typische-fehler-bei-tpm)
18. [Grenzen und Kritik an TPM und OEE](#grenzen-und-kritik-an-tpm-und-oee)
19. [TPM im digitalen Werk: Daten, CMMS, MES und Predictive Maintenance](#tpm-im-digitalen-werk-daten-cmms-mes-und-predictive-maintenance)
20. [Was Forschung und dokumentierte Fälle zeigen](#was-forschung-und-dokumentierte-fälle-zeigen)
21. [Glossar TPM und OEE](#glossar-tpm-und-oee)
22. [FAQ: Total Productive Maintenance und OEE](#faq-total-productive-maintenance-und-oee)
23. [Fazit und erste Schritte](#fazit-und-erste-schritte)

## Was ist Total Productive Maintenance (TPM)?

[Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) (TPM) ist ein Bündel von Praktiken, das jede Maschine in einem Produktionsprozess fähig hält, die geforderten Aufgaben zu erfüllen. So beschreibt es das Lean Enterprise Institute (LEI), und es schreibt die Pionierarbeit Denso aus der Toyota-Gruppe zu [6]. Das LEI liest das Wort "total" auf drei Arten [6]:

1. **Totale Beteiligung:** Werker, Instandhaltungstechniker, Linienverantwortliche, Fertigungsingenieure und Qualitätsfachleute machen alle mit.
2. **Totale Produktivität der Anlagen:** Ziel ist jeder Verlust, zusammengefasst in sechs großen Verlusten (Stillstand, Rüstzeit, Kurzstillstände, Geschwindigkeitsverluste, Ausschuss und Nacharbeit).
3. **Totaler Lebenszyklus:** Die Instandhaltungspraxis ändert sich mit der Lebensphase der Anlage, von Konstruktion und Aufstellung über den eingeschwungenen Betrieb bis zum Ersatz.

Einfach gesagt: In einem klassischen Werk bedient die Produktion die Maschine, und die Instandhaltung repariert sie, wenn sie ausfällt. In einem TPM-Werk hält der Werker die Maschine sauber, inspiziert und geschmiert und erkennt Abweichungen früh; die Instandhaltung verwendet ihre Zeit für geplante Arbeiten, Ursachen und die Fähigkeiten, die Werker nicht haben; die Technik konstruiert neue Anlagen so, dass sie leicht instand zu halten sind; und die Führung misst die Verluste und räumt Hindernisse aus dem Weg.

Als Instandhaltungsstrategie unterscheidet sich TPM von anderen Strategien vor allem darin, wer die Instandhaltungsarbeit macht. Die Anlagenpflege wird zur gemeinsamen Aufgabe von Produktion und Instandhaltung, und die Werker übernehmen Verantwortung für ihre Anlagen. Die TPM-Grundsätze dahinter sind kurz: vorbeugen statt reparieren, alle einbeziehen und das Programm an den Verlusten der Produktionsanlagen messen, nicht an der Zahl erledigter Instandhaltungsmaßnahmen.

### Was TPM nicht ist

- **Kein Programm der Instandhaltungsabteilung.** Wenn nur die Instandhaltung zum Kickoff kommt, ist es vorbeugende Instandhaltung unter neuem Namen.
- **Nicht "die Werker machen die Reparaturen".** Werker übernehmen die Routinepflege und das frühe Erkennen. Anspruchsvolle Diagnose und Reparatur bleiben bei ausgebildeten Technikern.
- **Kein Softwarekauf.** Ein CMMS oder ein OEE-System hilft, sobald Routinen existieren; es schafft sie nicht.
- **Kein Personalabbauprojekt.** Programme, die so angekündigt oder so wahrgenommen werden, verlieren das Vertrauen der Werker im ersten Monat (siehe [Abschnitt zu typischen Fehlern](#typische-fehler-bei-tpm)).

### Vorteile von Total Productive Maintenance

Die Vorteile von TPM entstehen über wenige Mechanismen. Wie groß jeder davon ist, hängt von Ihrem Ausgangspunkt ab; messen Sie ihn daher an Ihrer eigenen Basis:

- **Mehr Laufzeit:** weniger Ausfälle und ungeplante Stopps, weil Werker Leckagen, lose Schrauben und verschlissene Teile finden, bevor sie versagen.
- **Weniger Qualitätsprobleme:** Anlagen im Grundzustand erzeugen weniger Produktionsfehler und weniger Anlaufausschuss (Qualitätsinstandhaltung).
- **Längere Lebensdauer der Anlagen:** Reinigen, Inspizieren und Schmieren verlangsamen den Verschleiß. Die US-Umweltbehörde EPA nennt längere Anlagenlebensdauer, weniger Fehler sowie weniger Verschüttungen, Leckagen und Störzustände unter den Effekten gut instand gehaltener Anlagen [13].
- **Sichereres Arbeitsumfeld:** An einer sauberen Maschine mit sichtbaren Abweichungen arbeitet man leichter und sicherer, und die Säule Arbeitssicherheit, Gesundheit und Umwelt prüft jede Änderung (siehe [TPM und Arbeitssicherheit](#tpm-und-arbeitssicherheit-lockouttagout-ergonomie-und-die-stimme-der-werker)).
- **Qualifikation:** Ein-Punkt-Lektionen und die Säule Aus- und Weiterbildung schließen Wissenslücken zwischen Werkern und Instandhaltungspersonal.

Die EPA schätzt, dass TPM die Anlageneffizienz innerhalb von drei Jahren um 15 bis 25 Prozent steigern kann [13]; nehmen Sie das als Orientierung, wie der [Abschnitt zum Business Case](#der-business-case-was-ein-oee-prozentpunkt-wert-ist) erklärt.

### TPM vs. vorbeugende Instandhaltung vs. vorausschauende Instandhaltung

Diese Begriffe werden in Suchergebnissen oft vermischt. Die Tabelle trennt sie.

| Ansatz | Wer arbeitet | Auslöser | Typisches Ziel | Verhältnis zu TPM |
|---|---|---|---|---|
| Reaktive (ausfallbedingte) Instandhaltung | Instandhaltung | Ausfall | Funktion wiederherstellen | das, was TPM verringern will |
| Vorbeugende Instandhaltung (Preventive Maintenance, PM) | Instandhaltung | Kalender- oder Nutzungsintervall | bekannte Ausfallarten verhindern | Teil der Säule geplante Instandhaltung |
| Vorausschauende / zustandsorientierte Instandhaltung | Instandhaltung, Zuverlässigkeitsingenieure, zunehmend Sensorik und Analytik | gemessener Zustand (Schwingung, Temperatur, Ölanalyse, Stromaufnahme) | kurz vor dem Ausfall handeln | eine Technik innerhalb der geplanten Instandhaltung; siehe den geplanten [Leitfaden zu Predictive Maintenance und IIoT](https://www.m365.fm/learn/predictive-maintenance-iiot/) |
| Total Productive Maintenance | alle, Werker eingeschlossen | tägliche Routinen plus geplante und zustandsorientierte Arbeit | null Ausfälle, null Fehler, null anlagenbedingte Unfälle und die Verlustdaten, um dorthin zu kommen | das Managementsystem, das die Techniken zusammenhält |

TPM ist aus der vorbeugenden Instandhaltung hervorgegangen. Ein Aufsatz von 2014 in der Zeitschrift der Japanese Society for Quality Control führt das japanische TPM auf die amerikanische vorbeugende Instandhaltung zurück und beschreibt die werksweite Form als deren spätere Weiterentwicklung [7].

### TPM vs. TQM und Lean

TPM, Total Quality Management (TQM) und Lean haben japanische Wurzeln und viele gemeinsame Werkzeuge, betrachten das Werk aber aus unterschiedlichen Blickwinkeln. TQM geht vom Produkt und vom Kunden aus, Lean vom Wertfluss, TPM von der Anlage. In der Praxis treffen sie sich: Eine stabile Maschine ist Voraussetzung für Fluss und Pull im [Lean Management](https://www.m365.fm/learn/lean-management/), und eine fähige Maschine ist Voraussetzung für Qualität. McKone, Schroeder und Cua untersuchten 97 Werke in drei Ländern und stellten fest, dass sich die TPM-Umsetzung stärker durch Managementfaktoren erklären ließ, die die Werksleitung selbst steuert, nämlich Just-in-Time, TQM und Mitarbeiterbeteiligung, als durch Land oder Branche [16]. Isoliert vom übrigen Produktionssystem überlebt TPM selten.

## Geschichte: von der US-Präventivwartung zu Nippondenso und JIPM

Die Kurzfassung der Geschichte ist in allen Quellen gleich; die Jahreszahlen weichen je nach Quelle um einige Jahre ab.

| Jahr | Ereignis | Quelle |
|---|---|---|
| 1951 | Seiichi Nakajima führt nach dem Studium der amerikanischen vorbeugenden Instandhaltung in Japan die produktive Instandhaltung (Productive Maintenance) ein | [2] |
| späte 1960er | Nippondenso verwendet erstmals den Begriff "Total Productive Maintenance", mit dem Leitspruch "produktive Instandhaltung unter Beteiligung aller Mitarbeiter"; eine Darstellung datiert die Entwicklung auf 1969, eine andere beschreibt, dass Nakajima TPM zwischen 1950 und 1970 entwickelte | [3][2][5] |
| 1971 | Nippondenso erhält vom Japan Institute of Plant Maintenance (JIPM) den PM-Preis (Distinguished Plant Award), als erster Preisträger mit der TPM-Methode; viele datieren den Ursprung von TPM auf dieses Jahr | [3][2] |
| 1982 | Nakajima veröffentlicht *TPM tenkai* (JIPM, Tokio) | [4] |
| 1988, 1989 | Englische Ausgaben: *Introduction to TPM* (1988) und *TPM Development Program* (1989), beide bei Productivity Press | [4][35][36] |
| 2015 | Nakajima stirbt am 11. April im Alter von 96 Jahren | [2][4] |
| Geschäftsjahr 2024 | Das JIPM überarbeitet sein TPM-Preissystem; Kategorie A und B werden zum Award for TPM Excellence zusammengeführt | [1] |

**Seiichi Nakajima (1919 bis 2015)** gilt gemeinhin als Vater von TPM. Die Zeitschrift *Maintenance Technology* beschreibt, dass er die Arbeit bei Nippondenso im Rahmen des JIPM leitete, und schreibt ihm die Einführung der PM-Preise zu, der heutigen TPM Awards [2]. Der japanische Kaiser verlieh ihm für seine Arbeit an der Verbesserung der Fertigung durch TPM die Ehrenmedaille am blauen Band [4].

**Das JIPM und die TPM Awards** prägen bis heute, was als "echtes" TPM gilt. Nach dem System, das ab dem Geschäftsjahr 2024 gilt (die alten Regeln sind bis zum Geschäftsjahr 2026 noch zulässig), vergibt das JIPM fünf Stufen: den Award for TPM Excellence, den Award for Excellence in Consistent TPM Commitment, den Special Award for TPM Achievement, den Advanced Special Award for TPM Achievement und den Award for World-class TPM Achievement [1]. Auch Unternehmen außerhalb Japans bewerben sich; Yamaha Motor etwa listet auf seiner Unternehmensseite seine JIPM-Preisträger von 1995 bis 2016 auf [37].

**Warum die Geschichte für ein Werk außerhalb Japans zählt:** Ausgangspunkt von TPM war die amerikanische vorbeugende Instandhaltung [7][2]. Was Japan hinzufügte, war der Wechsel von einer Spezialistenfunktion zur werksweiten Beteiligung, die Verlustrechnung hinter der OEE und ein strukturierter Weg, auf dem Werker Verantwortung übernehmen.

## Wie TPM und OEE zusammenhängen

Die [Gesamtanlageneffektivität (Overall Equipment Effectiveness, OEE)](https://www.m365.fm/learn/produktionskennzahlen/) ist die Kennzahl, die Nakajima in TPM eingebaut hat, um zu zeigen, wie viel der geplanten Zeit einer Maschine Gutteile mit idealer Geschwindigkeit erzeugt [8][10]. Sie zerlegt den Abstand zur Perfektion in drei Faktoren. Eine OEE von 100 % bedeutet, dass eine Anlage, ob Einzelmaschine oder Fertigungslinie, nur Gutteile gefertigt hat, mit maximaler Geschwindigkeit und ohne Stillstandszeit [22]. Die OEE-Formel lautet:

> **OEE = Verfügbarkeit × Leistung × Qualität**

| Faktor | Formel | Erfasste Verluste |
|---|---|---|
| Verfügbarkeit | Laufzeit ÷ geplante Produktionszeit | Ausfälle, Rüsten und Einrichten |
| Leistung | (ideale Taktzeit × Gesamtmenge) ÷ Laufzeit | Kurzstillstände, verringerte Geschwindigkeit |
| Qualität | Gutmenge ÷ Gesamtmenge | Ausschuss und Nacharbeit, Anlaufverluste |

Der viel zitierte Übersichtsartikel von Muchiri und Pintelon definiert die Faktoren genauso: Verfügbarkeit als Betriebszeit im Verhältnis zur Belegungszeit, Leistung als theoretische Taktzeit mal tatsächlicher Ausbringung im Verhältnis zur Betriebszeit und Qualität als Gutausbringung im Verhältnis zur Gesamtausbringung [8]. ISO 22400-2:2014, die internationale Norm für Kennzahlen im Manufacturing Operations Management, folgt derselben Logik mit eigenen Zeitbegriffen [11][12].

Die drei Faktoren lassen sich zu einer kürzeren Formel zusammenfassen, die man sich merken sollte, weil sie zugleich als Datenprüfung dient [22]:

> **OEE = (Gutmenge × ideale Taktzeit) ÷ geplante Produktionszeit**

**Wie beides zusammenhängt:** TPM ist das Verbesserungssystem, OEE seine Anzeigetafel. Ein Werk kann OEE messen, ohne TPM zu betreiben (und viele tun das), aber dann wird die Zahl meist zur reinen Berichtsübung. Umgekehrt lässt sich TPM ohne irgendeine Form der Verlustmessung nicht richtig betreiben, weil fokussierte Verbesserung und geplante Instandhaltung wissen müssen, welcher Verlust der größte ist. Ljungberg hat das 1998 so formuliert: Wer TPM einführt, muss die Größe jeder Verlustart messen, damit die Ressourcen dorthin gehen, wo sie zählen, und viele Unternehmen betrachten nur große Ausfälle und übersehen Kurzstillstände und Geschwindigkeitsverluste [9].

**Wo dieser Leitfaden aufhört und der Kennzahlen-Leitfaden beginnt:** Dieser Artikel behandelt die TPM-Seite der OEE: Verluste, Verbesserungspraxis und Programmkennzahlen. Der Leitfaden [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/) behandelt OEE im Zusammenhang aller Werkskennzahlen, einschließlich der korrekten Verdichtung der OEE über mehrere Linien und eines getesteten Power-BI/DAX-Modells. Beide verwenden dieselben Definitionen.

## Die sechs großen Verluste (und die 16 Verlustarten)

Nakajima ordnete Anlagenverluste sechs Kategorien zu, je zwei pro OEE-Faktor [8]: Verfügbarkeitsverluste (Stillstand durch Anlagenausfälle und Rüsten), Leistungsverluste (Kurzstillstände und verringerte Geschwindigkeit) und Qualitätsverluste (Ausschuss und Anlaufausschuss). Die Bezeichnungen unterscheiden sich je nach Quelle leicht; die Tabelle verwendet die gängigen deutschen Begriffe, Nakajimas englische Bezeichnung steht in Klammern.

| # | Verlust (Nakajimas Begriff) | OEE-Faktor | Typische Beispiele | Erste Gegenmaßnahme | Zuständige TPM-Säule |
|---|---|---|---|---|---|
| 1 | Ausfälle (equipment failure) | Verfügbarkeit | Hydraulikleckage, Motorausfall, Werkzeugbruch | Grundzustand wiederherstellen, Ursachenanalyse, geplante Instandhaltung | geplante Instandhaltung, autonome Instandhaltung |
| 2 | Rüsten und Einrichten (setup and adjustment) | Verfügbarkeit | Form- oder Werkzeugwechsel, Erstteilversuch und Einstellen, Materialwechsel | [SMED](https://www.m365.fm/learn/smed-ruestzeitreduzierung/) (geplanter Leitfaden), Standardeinstellungen | fokussierte Verbesserung |
| 3 | Kurzstillstände (idling and minor stoppages) | Leistung | verklemmtes Teil, verstopfte Rutsche, ausgelöster Sensor, Werker beseitigt Störung und startet neu | Fehlerkarten, kleine Abstellmaßnahmen, Poka Yoke | autonome Instandhaltung, fokussierte Verbesserung |
| 4 | Verringerte Geschwindigkeit (reduced speed) | Leistung | Maschine läuft unter ihrer Idealrate, "weil sie so besser läuft" | den wahren Grund für die Verlangsamung finden; Stammdaten der idealen Taktzeit pflegen | fokussierte Verbesserung, Qualitätsinstandhaltung |
| 5 | Ausschuss und Nacharbeit (quality defects and rework) | Qualität | Ausschuss und Nacharbeit während der stabilen Produktion | Qualitätsinstandhaltung (Bedingungen für null Fehler) | Qualitätsinstandhaltung |
| 6 | Anlaufverluste (reduced yield during startup) | Qualität | Ausschuss nach einem Formwechsel, Warmlaufen, erste Teile einer Schicht | standardisierter Anlauf, kürzere Stabilisierung | Qualitätsinstandhaltung, Anlaufmanagement neuer Anlagen |

**Wo Kurzstillstände enden und Ausfälle beginnen,** müssen Sie selbst festlegen. Keine Norm schreibt eine verbindliche Schwelle vor. Die EPA beschreibt Stillstandsverluste als häufige Stillstände "von null bis 10 Minuten Länge" [13]; der OEE-Anbieter Vorne beschreibt Kurzstillstände als typischerweise kürzer als fünf Minuten und ohne Einsatz von Instandhaltungspersonal [21]. Wählen Sie eine Schwelle (zwei oder fünf Minuten sind übliche Werte), schreiben Sie sie in Ihr OEE-Definitionsblatt und ändern Sie sie nie stillschweigend, sonst springen Ihre Leistungs- und Verfügbarkeitstrends ohne physikalischen Grund.

**Geplante Stillstände gehören nicht zu den sechs Verlusten.** Pausen, geplante Besprechungen, geplante Instandhaltungsfenster und "keine Aufträge" werden vor der OEE-Berechnung aus der geplanten Produktionszeit herausgenommen. Das ist eine Konvention, und genau an dieser Stelle wird die Zahl in Werken am häufigsten geschönt (siehe [Grenzen](#grenzen-und-kritik-an-tpm-und-oee)).

### Die 16 Verlustarten

Die Literatur in der JIPM-Tradition geht über die Anlage hinaus. Das Kaizen Institute stellt 16 große Verlustarten in drei Gruppen dar: Verluste der Anlageneffektivität, der Arbeitseffizienz der Menschen und der Produktionsressourcen wie Material, Energie und Werkzeuge [15]. Die sechs großen Verluste sind die Teilmenge der Anlagenverluste, die die OEE misst. Die übrigen zehn betreffen Verluste rund um die Maschine, etwa Arbeitszeit, Material, Energie und Werkzeuge. Sie werden wichtig, sobald die OEE-Arbeit gereift ist, denn ein Werk kann die OEE steigern und dabei rund um die Maschine Arbeitszeit und Energie verschwenden. [unbelegt: Die einzelnen Bezeichnungen der 16 Verlustarten unterscheiden sich je nach Quelle und wurden nicht mit Nakajimas oder dem JIPM-Primärtext abgeglichen; deshalb werden sie hier nicht aufgelistet.]

## OEE berechnen: Rechenbeispiel mit den sechs großen Verlusten

Das Beispiel begleitet eine Maschine über einen Tag. Alle Zahlen sind beispielhaft, und jeder Schritt lässt sich mit den anderen gegenprüfen.

**Die Maschine:** IMM-12, eine Spritzgießmaschine mit 300 t Schließkraft (im Original "300-ton") und einem Zweifachwerkzeug. Ideale Zykluszeit 30 Sekunden pro Schuss, also 15 Sekunden (0,25 Minuten) pro Teil. Das Werk fährt drei Schichten zu je acht Stunden.

### Schritt 1: geplante Produktionszeit

| Position | Minuten |
|---|---|
| Kalenderzeit (ein Tag) | 1.440 |
| minus geplante Pausen (3 × 30 min) | −90 |
| minus geplantes Instandhaltungsfenster | −30 |
| **Geplante Produktionszeit** | **1.320** |

### Schritt 2: Verfügbarkeit

Erfasste Stillstände während der geplanten Produktionszeit:

| Ereignis | Verlustkategorie | Minuten |
|---|---|---|
| Hydraulikschlauch undicht, 2. Schicht | Ausfall | 45 |
| Heizband defekt, 3. Schicht | Ausfall | 25 |
| Formwechsel A auf B, inkl. Einstellen | Rüsten und Einrichten | 50 |
| Formwechsel B auf C, inkl. Einstellen | Rüsten und Einrichten | 50 |
| **Stillstand gesamt** | | **170** |

Laufzeit = 1.320 − 170 = 1.150 Minuten.
**Verfügbarkeit = 1.150 ÷ 1.320 = 87,1 %.**

### Schritt 3: Leistung

Bei 0,25 Minuten pro Teil könnten in 1.150 Minuten Laufzeit 1.150 ÷ 0,25 = 4.600 Teile entstehen. Der Zähler zeigt 4.048 Teile.

**Leistung = (0,25 × 4.048) ÷ 1.150 = 1.012 ÷ 1.150 = 88,0 %.**

Mit voller Geschwindigkeit hätte die Maschine für die 4.048 Teile nur 1.012 Minuten gebraucht. Die Differenz beträgt 1.150 − 1.012 = 138 Minuten. Das Maschinenprotokoll teilt sie auf: 61 Kurzstillstände summieren sich auf 84 Minuten, und ein verlangsamter Zyklus (31 bis 32 statt 30 Sekunden über mehrere Stunden nach dem zweiten Formwechsel) kostet die restlichen 54 Minuten.

### Schritt 4: Qualität

Von den 4.048 Teilen wurden 85 beim Anlauf nach den Formwechseln und beim Morgenstart verschrottet, 76 wurden im stabilen Lauf aussortiert (unvollständig gefüllte Teile und Gratbildung). Gutteile: 4.048 − 85 − 76 = 3.887.

**Qualität = 3.887 ÷ 4.048 = 96,0 %.**

Nachgearbeitete Teile zählen hier als fehlerhaft, im Einklang mit der TPM-Logik und dem Leitfaden [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/). Manche Definitionen, etwa in der Kennzahlenhierarchie von Kang et al., zählen nachgearbeitete Teile als gut [12]; entscheiden Sie das einmal und vergleichen Sie keine Werke, die unterschiedliche Regeln anwenden.

### Schritt 5: OEE

**OEE = 0,871 × 0,880 × 0,960 = 73,6 %.**

**Gegenprobe mit der Kurzformel:** 3.887 Gutteile × 0,25 Minuten = 971,75 Minuten voll produktive Zeit; 971,75 ÷ 1.320 = **73,6 %**. Weichen beide Ergebnisse voneinander ab, sind Ihre Eingangsdaten falsch (meist die ideale Taktzeit oder der Zähler).

### Schritt 6: der Verlustwasserfall

Die Gesamtzahl sagt wenig. Die Minuten je Verlust zeigen, wo man anfängt.

| Stufe | Minuten | Anteil an der geplanten Zeit |
|---|---|---|
| Geplante Produktionszeit | 1.320,0 | 100,0 % |
| − Ausfälle | 70,0 | 5,3 % |
| − Rüsten und Einrichten | 100,0 | 7,6 % |
| = Laufzeit | 1.150,0 | 87,1 % |
| − Kurzstillstände | 84,0 | 6,4 % |
| − verringerte Geschwindigkeit | 54,0 | 4,1 % |
| = Nettolaufzeit | 1.012,0 | 76,7 % |
| − Anlaufverluste (85 × 0,25) | 21,25 | 1,6 % |
| − Ausschuss und Nacharbeit (76 × 0,25) | 19,0 | 1,4 % |
| = **voll produktive Zeit** | **971,75** | **73,6 %** |

**Wie man den Wasserfall liest:** Rüsten und Einrichten (100 Minuten) ist der größte Einzelverlust, gefolgt von Kurzstillständen (84) und Ausfällen (70). Die ersten TPM-Projekte an IMM-12 sind deshalb ein SMED-Workshop zum Formwechsel und ein Pilot zur autonomen Instandhaltung gegen die Kurzstillstände, während die geplante Instandhaltung das Hydrauliksystem übernimmt. Qualitätsverluste wirken in Minuten klein (zusammen 40 Minuten), kosten aber zusätzlich Material und Granulat, was die Minuten nicht zeigen.

### Schritt 7: dieselbe Maschine nach einem Jahr TPM

Angenommen seien folgende Ergebnisse nach zwölf Monaten fokussierter Verbesserung, autonomer und geplanter Instandhaltung (beispielhafte Ziele, kein Versprechen):

| Verlust | Vorher (min) | Nachher (min) | Wichtigste Gegenmaßnahme |
|---|---|---|---|
| Ausfälle | 70 | 30 | Austauschplan für Hydraulikschläuche, Heizbandprüfung im Standard für Reinigen, Inspizieren, Schmieren, Nachziehen |
| Rüsten und Einrichten | 100 | 60 | SMED: vorgewärmte Formen, einheitliche Spannhöhen, Schnellkupplungen |
| Kurzstillstände | 84 | 50 | Fehlerkarten, neu konstruierte Rutsche, Teileanwesenheitssensor täglich gereinigt |
| Verringerte Geschwindigkeit | 54 | 40 | Kühlwasserdurchfluss wiederhergestellt, Taktzeitstandard durchgesetzt |
| Anlaufausschuss | 85 Teile | 50 Teile | Anlaufstandard mit Prozessfenster, Checkliste für den ersten Schuss |
| Ausschuss | 76 Teile | 60 Teile | Qualitätsinstandhaltungsmatrix für Werkzeugtemperatur und Nachdruck |

Laufzeit = 1.320 − 30 − 60 = 1.230 Minuten; Verfügbarkeit = 1.230 ÷ 1.320 = 93,2 %.
Nettolaufzeit = 1.230 − 50 − 40 = 1.140 Minuten; Gesamtmenge = 1.140 ÷ 0,25 = 4.560 Teile; Leistung = 1.140 ÷ 1.230 = 92,7 %.
Gutteile = 4.560 − 50 − 60 = 4.450; Qualität = 4.450 ÷ 4.560 = 97,6 %.
**OEE = 4.450 × 0,25 ÷ 1.320 = 84,3 %**, ein Plus von 10,7 Prozentpunkten, mit 563 Gutteilen mehr pro Tag von derselben Maschine in denselben Schichten.

Ob diese 563 Teile Geld wert sind, ist eine eigene Frage; die Antwort steht im [Abschnitt zum Business Case](#der-business-case-was-ein-oee-prozentpunkt-wert-ist).

### Fünf Regeln für eine ehrliche OEE-Berechnung

1. **Ein Zeitmodell für alle.** Schreiben Sie auf, was aus der geplanten Produktionszeit herausgenommen wird (Pausen, Besprechungen, geplante Instandhaltung, keine Aufträge, Versuche), und wenden Sie das auf jede Maschine an. ISO 22400-2 bietet ein Muster-Zeitmodell [11].
2. **Die ideale Taktzeit ist die Auslegungs- oder die beste nachgewiesene Rate, nicht der Vorgabewert aus der Kalkulation.** Ein großzügiger Vorgabewert bläht die Leistung auf und kann sie über 100 % treiben, was per Definition ein Datenfehler ist [22].
3. **Am richtigen Punkt zählen.** Die Gesamtmenge dort, wo die Maschine produziert; die Gutmenge nach dem Qualitätsentscheid. Teile, die später im Prozess verschrottet werden, gehören zu diesem späteren Schritt, es sei denn, die Ursache wird zurückverfolgt.
4. **Aus Summen rechnen, nie Prozentwerte mitteln.** Für eine Woche, eine Linie oder ein Werk Gutmenge × ideale Taktzeit und geplante Produktionszeit aufsummieren und dann teilen. Der Leitfaden [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/) zeigt, warum das Mitteln das Ergebnis verzerrt.
5. **Mindestens eine Woche auswerten.** Eine einzelne Schicht ist Rauschen. Zepf empfiehlt, mindestens eine Woche (10.080 Minuten) auszuwerten, bevor man Schlüsse zieht [24]; Vorne empfiehlt, mindestens zwei Wochen Daten zu sammeln, bevor man einen Schwerpunkt wählt [21].

## TEEP, Belegung, MTBF und MTTR

Die OEE beantwortet die Frage "Wie gut nutzen wir die Zeit, in der wir laufen wollten?" Zwei weitere Fragen brauchen andere Kennzahlen.

### TEEP: OEE bezogen auf die Kalenderzeit

Die Total Effective Equipment Performance (TEEP) bezieht die OEE auf die gesamte Kalenderzeit [10]:

> **TEEP = OEE × Belegung**, mit **Belegung (Loading) = geplante Produktionszeit ÷ Kalenderzeit**

**IMM-12, pro Tag:** Belegung = 1.320 ÷ 1.440 = 91,7 %; TEEP = 73,6 % × 91,7 % = **67,5 %**.

**IMM-12, pro Woche (fünf Produktionstage):** Belegung = 5 × 1.320 ÷ 10.080 = 65,5 %; TEEP = 73,6 % × 65,5 % = **48,2 %**.

**Wofür TEEP gut ist:** Kapazitäts- und Investitionsentscheidungen. Bevor Sie eine zweite Spritzgießmaschine genehmigen, zeigt die TEEP, dass IMM-12 in mehr als der Hälfte der Kalenderzeit einer Woche stillsteht oder Zeit verliert. Wochenendschichten, geplante Instandhaltung in den vorhandenen Fenstern und die oben beschriebenen OEE-Verbesserungen sind alle billiger als eine neue Maschine, sofern Nachfrage, Personal und Tarifvertrag es zulassen. Manche Webseiten geben OEE und TEEP dieselbe Formel; das ist falsch, weil sich die Zeitbasis unterscheidet.

### OOE und andere Varianten

Manche Quellen ergänzen die Operations Equipment Effectiveness (OOE), die als Basis die Betriebszeit einschließlich eines Teils der geplanten Stillstände verwendet, und die Forschungsliteratur nennt weitere Varianten für Linien und Werke (etwa Overall Line Effectiveness oder Overall Plant Effectiveness) [8]. Die Definitionen dieser Varianten unterscheiden sich je nach Autor und Anbieter. Wenn Sie eine davon verwenden, legen Sie die Zeitbasis schriftlich fest.

### MTBF und MTTR: den Ausfallverlust aufschlüsseln

Die Verfügbarkeit wirft Ausfälle und Rüstvorgänge in einen Topf. Die geplante Instandhaltung braucht die Ausfälle getrennt, nach Häufigkeit und Dauer:

> **MTBF (Mean Time Between Failures, mittlere Betriebsdauer zwischen Ausfällen) = Laufzeit ÷ Anzahl der Ausfälle**
> **MTTR (Mean Time To Repair, mittlere Reparaturdauer) = gesamte Ausfallzeit ÷ Anzahl der Ausfälle**

**IMM-12, eine Woche:** Laufzeit 5 × 1.150 = 5.750 Minuten; 14 Ausfälle mit zusammen 350 Minuten.
MTBF = 5.750 ÷ 14 = **410,7 Minuten** (etwa 6,8 Stunden).
MTTR = 350 ÷ 14 = **25,0 Minuten**.
Verfügbarkeit allein aus Ausfällen = MTBF ÷ (MTBF + MTTR) = 410,7 ÷ 435,7 = **94,3 %**. Der Rest der Lücke zur OEE-Verfügbarkeit (87,1 %) stammt vom Rüsten.

**Wie TPM die beiden Zahlen liest:** Eine kurze MTBF deutet auf Verschleiß, schlechte Grundbedingungen oder Konstruktionsschwächen hin (autonome und geplante Instandhaltung). Eine lange MTTR deutet auf Probleme bei Diagnose, Ersatzteilen, Zugänglichkeit oder Qualifikation hin (geplante Instandhaltung, Schulung, Anlaufmanagement neuer Anlagen). Die US-Fachgesellschaft Society for Maintenance & Reliability Professionals (SMRP) veröffentlicht in ihren Best Practices (7. Auflage) mehr als 70 Instandhaltungs- und Zuverlässigkeitskennzahlen mit Definitionen, Formeln, Beispielrechnungen und Best-in-Class-Zielwerten; verwenden Sie diese Definitionen, wenn Sie sich mit anderen SMRP-Mitgliedern vergleichen wollen [19]. Der Body of Knowledge der SMRP, gegliedert in fünf Säulen (Business Management, Zuverlässigkeit des Fertigungsprozesses, Anlagenzuverlässigkeit, Organisation und Führung, Arbeitsmanagement), ist eine nützliche Landkarte der Fähigkeiten, die eine Säule geplante Instandhaltung braucht [20].

## Was ist ein guter OEE-Wert? Benchmarks und ihre Grenzen

Das ist eine der meistgesuchten Fragen, und die meisten Antworten wiederholen eine einzige Zahl.

**Der Wert von 85 %.** Viele Seiten nennen eine OEE von 85 % "Weltklasse" für die diskrete Fertigung. Vorne etwa bezeichnet 85 % als Weltklasse, 60 % als "ziemlich typisch" und 40 % als "nicht ungewöhnlich" für Hersteller, die gerade anfangen [21]. Die 85 % werden regelmäßig Nakajima zugeschrieben und oft aus 90 % Verfügbarkeit, 95 % Leistung und 99,9 % Qualität gebildet (0,90 × 0,95 × 0,999 = 85,4 %). [unbelegt: Die Originalstelle in Nakajimas Büchern ließ sich nicht finden; der Leitfaden [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/) kam zum selben Ergebnis.] Der englische Wikipedia-Artikel zur OEE stellt fest, dass 85 % in vielen Fällen nicht das richtige Ziel ist, etwa wenn nicht alle Verluste erfasst werden oder wenn die Qualitätsanforderungen einer Branche höher liegen [10].

**Was die Forschung fand.** Ljungbergs Untersuchung von etwa 20 Fällen ergab eine OEE von "nur rund 55 Prozent", wobei Leistungsverluste den größten Anteil hatten, und legte nahe, dass die OEE bei Prozessen niedriger ist, die für ein Unternehmen neu sind [9]. OEE-Benchmarks von Anbietern, die aus deren eigenen Kundendaten stammen, legen ihre Methode selten offen; behandeln Sie sie als Herstellerangaben [34].

**Wie man stattdessen ein Ziel setzt:**

| Methode | Funktionsweise | Beispiel IMM-12 |
|---|---|---|
| Aus der eigenen Basis | mindestens zwei bis vier Wochen sauber messen, dann pro Jahr einen festen Anteil der Lücke als Ziel setzen | Basis 73,6 %; im ersten Jahr die Hälfte der Lücke zu 90 % schließen: Ziel ca. 82 % |
| Aus der Nachfrage | benötigte OEE = Nachfrage × ideale Taktzeit ÷ geplante Produktionszeit | 4.200 Gutteile pro Tag × 0,25 ÷ 1.320 = 79,5 % |
| Aus dem Verlust-Pareto | die Minuten als Ziel setzen, die sich bei den zwei größten Verlusten realistisch abbauen lassen | 40 Minuten Rüsten und 34 Minuten Kurzstillstände = 74 Minuten = +5,6 Prozentpunkte |
| "Best of the Best" | Vorne beschreibt ein "Best of the Best"-Ziel [21]; eine gängige Variante multipliziert die beste Verfügbarkeit, beste Leistung und beste Qualität, die die Maschine im Messzeitraum jeweils in irgendeiner Schicht erreicht hat | 93 % × 93 % × 98 % = 84,8 % |

**Drei Tatsachen, die werksübergreifende Vergleiche riskant machen:**

- Die OEE verhält sich wie ein Produkt aus Prozentwerten und bestraft ungleiche Faktoren: 20 % × 80 % = 16 %, aber 50 % × 50 % = 25 % [10].
- Werke definieren geplante Zeit, ideale Taktzeit und Qualität unterschiedlich, sodass dieselbe Maschine unter zwei Definitionen 15 Prozentpunkte Unterschied zeigen kann.
- Ein kontinuierlich laufendes Prozesswerk im 24/7-Betrieb und eine Werkstattfertigung mit hoher Variantenvielfalt und vielen Rüstvorgängen haben strukturell unterschiedliche OEE-Niveaus.

Verwenden Sie die OEE, um dieselbe Anlage über die Zeit zu vergleichen. Verwenden Sie TEEP und den Verlustwasserfall, um Anlagen für Investitionsentscheidungen zu vergleichen.

## Das 5S-Fundament und die 8 Säulen von TPM

Das übliche Bild des TPM-Modells ist ein Tempel: ein Fundament aus [5S](https://www.m365.fm/entity/5s/), die acht Säulen der Total Productive Maintenance und ein Dach mit den Zielen (null Ausfälle, null Fehler, null Unfälle). Vornes Zusammenfassung der Ziele taugt als Einzeiler: keine Ausfälle, keine Kurzstillstände oder langsamer Lauf, keine Fehler und keine Unfälle [21].

**Warum 5S zuerst kommt:** An einer Maschine, die mit Öl, Spänen und Staub bedeckt ist, sieht man weder eine Leckage noch eine lose Schraube oder einen verschlissenen Riemen. Sortieren, Systematisieren, Säubern, Standardisieren und Selbstdisziplin schaffen die Bedingungen, unter denen Abweichungen sichtbar werden. Bei TPM wird aus "Säubern" das Reinigen als Inspektion, und das ist die Brücke zu Schritt 1 der autonomen Instandhaltung. Der geplante [Leitfaden zur 5S-Methode und zum visuellen Management](https://www.m365.fm/learn/5s-methode-visuelles-management/) behandelt die Methode im Detail.

### Die acht Säulen im Überblick

Das JIPM nennt die acht Säulen in seinen Preisrichtlinien so: fokussierte Verbesserung, autonome Instandhaltung, geplante Instandhaltung, Qualitätsinstandhaltung, Anlaufmanagement (Early Equipment Management), Aus- und Weiterbildung, Effizienz der administrativen und indirekten Bereiche sowie Arbeitssicherheit, Gesundheit und Umwelt [1]. Es stellt fest, dass die ersten vier direkt auf Verlustreduzierung und OEE wirken und immer umgesetzt werden müssen; Anlaufmanagement und die administrative Säule können bei der Bewertung entfallen, wenn eine Organisation diese Funktionen nicht hat [1].

| # | Säule (japanisch) | Zweck | Typische Verantwortung | Erstes Ergebnis |
|---|---|---|---|---|
| 1 | Fokussierte Verbesserung (Kobetsu Kaizen) | bestimmte Verluste mit strukturierter Problemlösung beseitigen | bereichsübergreifendes Team unter Leitung von Technik oder KVP | Verlust-Pareto und erster [A3-Report](https://www.m365.fm/learn/lean-management/a3-methode/) (geplant) |
| 2 | Autonome Instandhaltung (Jishu Hozen) | Werker erhalten die Grundbedingungen und erkennen Abweichungen früh | Produktion, unterstützt von der Instandhaltung | Grundreinigung und Fehlerkartentafel an der Pilotmaschine |
| 3 | Geplante Instandhaltung | Instandhaltung von reaktiver zu geplanter und vorausschauender Arbeit verlagern | Instandhaltung | Kritikalitätsranking und Wartungsplan für die Pilotanlage |
| 4 | Qualitätsinstandhaltung (Hinshitsu Hozen) | die Anlagenbedingungen festlegen und halten, die null Fehler erzeugen | Qualitäts- und Prozesstechnik | Qualitätsinstandhaltungsmatrix (Bedingung, Standard, Prüfung) |
| 5 | Anlaufmanagement neuer Anlagen (Early Equipment Management) | Anlagen konstruieren und kaufen, die sich leicht bedienen, reinigen, instand halten und umrüsten lassen | Technik und Einkauf | Checkliste Instandhaltbarkeit für die nächste Beschaffung |
| 6 | Aus- und Weiterbildung | die Qualifikationslücken schließen, die die anderen Säulen aufdecken | Personal / Schulung mit Instandhaltung | Qualifikationsmatrix für Werker und Techniker |
| 7 | Arbeitssicherheit, Gesundheit und Umwelt | null anlagenbedingte Unfälle und null Umweltvorfälle | Arbeitssicherheit und Umweltschutz (EHS) | Gefährdungsprüfung aller Aufgaben der autonomen Instandhaltung |
| 8 | Office TPM (administratives TPM) | Verluste in unterstützenden Prozessen wie Ersatzteilbeschaffung, Planung und Auftragsabwicklung beseitigen | administrative Bereiche | Verlustlandkarte eines unterstützenden Prozesses |

Das Kaizen Institute verwendet dieselben acht Säulen und gibt jeder ein eigenes Stufenmodell (neun Schritte für fokussierte Verbesserung, sechs für geplante Instandhaltung, acht für Anlaufmanagement und fünf Stufen für Schulung) [15]. Die Bezeichnungen der Schritte unterscheiden sich zwischen Beratungen; die Logik nicht.

### Qualitätsinstandhaltung

Die Qualitätsinstandhaltung verknüpft Produktfehler mit Anlagenbedingungen. Das zentrale Werkzeug ist eine Matrix: Für jedes kritische Qualitätsmerkmal (bei IMM-12 etwa unvollständig gefüllte Teile) listet das Team die Anlagenbedingungen auf, die es beeinflussen (Werkzeugtemperatur, Nachdruck, Düsenzustand, Materialfeuchte), legt für jede einen Sollbereich fest, bestimmt, wer sie wie oft prüft, und dokumentiert das Ergebnis. Läuft eine Bedingung aus ihrem Bereich, korrigiert das Team sie, bevor ein Fehler entsteht. Qualitätsingenieure aus IATF-16949- oder AS9100-Umfeldern erkennen darin die Logik eines Produktionslenkungsplans (Control Plan); der Unterschied ist, dass die Matrix an der Maschine geführt wird und ihre Prüfungen in die Reinigungs-, Inspektions-, Schmier- und Nachziehroutine der Werker und in die Aufgaben der geplanten Instandhaltung eingebaut sind. So wird Qualitätssicherung vom Prüfen der Teile zum Lenken der Bedingungen, dieselbe Idee wie [Poka Yoke](https://www.m365.fm/learn/lean-management/poka-yoke/) (geplant), angewandt auf die Maschine.

### Anlaufmanagement neuer Anlagen

Die meisten Instandhaltungsprobleme werden schon in der Konstruktion angelegt. Das Anlaufmanagement (Early Equipment Management) speist die Erfahrung des Werks (welche Schrauben sich lösen, welche Filter unerreichbar sind, welche Umrüstungen zu lange dauern) in das Lastenheft neuer Anlagen und in die Abnahme ein. Praktische Werkzeuge: eine Checkliste zu Instandhaltbarkeit und Reinigbarkeit in jeder Anfrage, ein Protokoll "Instandhaltungsprävention" (Maintenance Prevention) mit den Konstruktionsschwächen, die Teams der autonomen Instandhaltung gefunden haben, und ein Abnahmelauf, in dem OEE, Rüstzeit und Reinigungszeit gemessen werden, bevor die Bestellung abgeschlossen wird.

### Aus- und Weiterbildung

Jede Säule erzeugt Qualifikationslücken. Die autonome Instandhaltung braucht Werker, die Schmierung, Verbindungselemente, Pneumatik und Hydraulik auf Inspektionsniveau verstehen; die geplante Instandhaltung braucht Techniker, die Schadensanalysen und Zustandsüberwachung beherrschen. Eine Qualifikationsmatrix mit vier Stufen (kennt die Theorie, kann es mit Hilfe, kann es allein, kann es lehren) je Person und Fähigkeit macht die Lücken sichtbar. Der geplante Leitfaden zur [Qualifikationsmatrix](https://www.m365.fm/learn/operational-excellence/qualifikationsmatrix/) behandelt Qualifikationsmatrizen und die Unterweisungsmethode Job Instruction aus Training Within Industry (TWI), die gut zu Ein-Punkt-Lektionen passt.

### Arbeitssicherheit, Gesundheit und Umwelt

Die Säule Arbeitssicherheit, Gesundheit und Umwelt (Safety, Health and Environment, SHE) stellt sicher, dass die anderen Säulen keine neuen Gefährdungen erzeugen (Werker arbeiten näher an bewegten Teilen) und dass Anlagenverbesserungen bestehende Gefährdungen verringern. Die EPA weist auf die Umweltseite von TPM hin: Gut instand gehaltene Anlagen erzeugen weniger Fehler, halten länger und haben weniger Verschüttungen, Leckagen und Störzustände [13]. Die US-spezifischen Sicherheitsregeln behandelt ein eigener Abschnitt [weiter unten](#tpm-und-arbeitssicherheit-lockouttagout-ergonomie-und-die-stimme-der-werker).

### Office TPM

Office TPM überträgt das Verlustdenken auf unterstützende Arbeit. Typische Verluste im TPM-Kontext: Ein Techniker wartet zwei Stunden auf ein Ersatzteil, weil die Bestellanforderung in einer Freigabeschleife hängt; ein geplanter Instandhaltungsauftrag fällt aus, weil der Planer den Produktionsplan nicht bekommen hat; oder eine Maschine wartet auf einen Arbeitsauftrag. Einen dieser unterstützenden Prozesse mit einer [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/) aufzunehmen, ist oft der schnellste Erfolg.

## Autonome Instandhaltung (Jishu Hozen): die sieben Schritte

Die autonome Instandhaltung ist die Säule, die TPM am deutlichsten von klassischer Instandhaltung unterscheidet. Werker übernehmen in sieben Schritten die Grundpflege ihrer Anlagen. Die Bezeichnungen folgen der JIPM-Standardabfolge, wie sie in neuerer Praktikerliteratur dargestellt wird [26]; Ginder, Robinson und Robinson beschreiben dieselben sieben Stufen als "Levels" [3].

| Schritt | Bezeichnung | Was die Werker tun | Ausstiegskriterium (Audit vor dem nächsten Schritt) |
|---|---|---|---|
| 1 | Grundreinigung und Inspektion | die Maschine gründlich reinigen, jede Abweichung finden und markieren (Leckagen, lose Teile, Beschädigungen, fehlende Beschriftungen, Verschmutzung) | alle Fehlerkarten geschrieben, die meisten erledigt oder eingeplant; Werker können erklären, was sie gefunden haben |
| 2 | Verschmutzungsquellen und schwer zugängliche Stellen beseitigen | die Ursachen von Schmutz und Leckagen beseitigen; Inspektionspunkte erreichbar machen (Abdeckungen, Sichtfenster, Führungen) | Reinigungszeit messbar verkürzt; Verschmutzungsquellen mit Gegenmaßnahmen aufgelistet |
| 3 | Vorläufige Standards für Reinigung, Schmierung und Inspektion | den ersten Standard für Reinigen, Inspizieren, Schmieren und Nachziehen schreiben: was, wie, wie oft, wie lange, womit | Standard ist in der vorgesehenen Zeit machbar; Aufgaben passen in die Schicht |
| 4 | Schulung zur Gesamtinspektion | die Teilsysteme der Maschine kennenlernen (Verbindungselemente, Schmierung, Pneumatik, Hydraulik, Elektrik, Antriebe) und inspizieren | Werker bestehen je Teilsystem eine Qualifikationsprüfung; neue Fehlerkarten entstehen aus der Inspektion, nicht nur aus der Reinigung |
| 5 | Autonome Inspektion | Werker führen ihre eigene Inspektionsroutine mit den verbesserten Standards und Checklisten durch | Inspektionscheckliste gehört den Werkern; Ausfälle durch vernachlässigte Grundbedingungen nahe null |
| 6 | Standardisierung | Standards auf das Umfeld der Maschine ausweiten: Material, Werkzeuge, Qualitätsprüfungen, Datenerfassung | Arbeitsplatzstandards dokumentiert und eingehalten; visuelle Steuerung vorhanden |
| 7 | Autonomes Management (Selbstmanagement) | Teams setzen eigene Ziele, analysieren ihre Verluste und verbessern kontinuierlich | Team führt eigenes Verlust-Pareto und eigenen Verbesserungsplan mit wenig Anleitung |

Manche Programme ergänzen einen "Schritt 0" zur Vorbereitung: Sicherheitsunterweisung, Team-Charta und eine klare Vereinbarung, welche Aufgaben Werker übernehmen und welche nicht.

### Reinigen, Inspizieren, Schmieren, Nachziehen: die tägliche Routine

Das sichtbare Ergebnis der Schritte 3 bis 5 ist eine kurze tägliche Routine aus Reinigen, Inspizieren, Schmieren und Nachziehen (englisch CILS für clean, inspect, lubricate, tighten; manche Werke sagen CILT, mit T für tighten). Eine gute CILS-Karte für IMM-12 passt auf eine Seite, dauert zu Schichtbeginn etwa 10 Minuten und hat für jeden Punkt ein Foto. Im Zeitmodell von IMM-12 laufen die drei täglichen CILS-Runden (3 × 10 Minuten) innerhalb des 30-minütigen geplanten Instandhaltungsfensters und sind damit aus der geplanten Produktionszeit herausgenommen; wenn Ihr Werk die Routine fährt, während die Maschine zur Produktion eingeplant ist, ist das ein Verfügbarkeitsverlust und muss auch so erfasst werden.

| # | Punkt | Methode | Standard | Hilfsmittel | Zeit | Häufigkeit | Wer |
|---|---|---|---|---|---|---|---|
| 1 | Hydraulikölstand | Schauglas | zwischen Min- und Max-Markierung | keines | 0,5 min | jede Schicht | Werker |
| 2 | Hydraulikschläuche an der Schließeinheit | Sichtprüfung, Prüfung mit trockenem Handschuh | keine Feuchte, kein Abrieb | Taschenlampe | 1 min | jede Schicht | Werker |
| 3 | Kühlwasserdurchfluss Werkzeug | Durchflussanzeige | grüner Bereich (markiert) | keines | 0,5 min | jede Schicht | Werker |
| 4 | Schmierung der Holme | Fettpresse, 2 Hübe | laut Schmierplan | Fettpresse (farbcodiert) | 2 min | wöchentlich | Werker |
| 5 | Teileanwesenheitssensor | Linse abwischen | sauber, LED reagiert | fusselfreies Tuch | 0,5 min | jede Schicht | Werker |
| 6 | Verriegelung der Schutztür | Funktionsprüfung mit Maschine im Einrichtbetrieb | Maschine stoppt beim Öffnen der Tür | keines | 0,5 min | jede Schicht | Werker |
| 7 | Steckverbinder der Heizbänder | Sichtprüfung (nur von außerhalb der Schutzeinrichtung) | keine Verfärbung | Taschenlampe | 1 min | wöchentlich | Werker; bei Abweichung Instandhaltung |

### Fehlerkarten (F-Tags)

In Schritt 1 und danach an jedem Tag hängen Werker an jede gefundene Abweichung eine Karte. Das sind nicht die roten Karten aus 5S, die Gegenstände zum Aussortieren aus dem Arbeitsplatz markieren; TPM-Karten markieren Mängel an der Anlage selbst. Zwei Farben sind üblich: eine für Probleme, die der Werker selbst beheben kann, eine andere für solche, die die Instandhaltung braucht. Jede Karte bekommt eine Nummer, eine kurze Beschreibung, das Datum und den Namen des Finders und wird an einer Tafel oder im CMMS erfasst. Zwei Zahlen lassen das System funktionieren: gefundene Karten pro Woche (Erkennung) und erledigte Karten pro Woche (Reaktion). Bleiben Karten wochenlang offen, schreiben die Werker keine mehr; ein Erledigungsziel wie "Werkerkarten innerhalb von 7 Tagen, Instandhaltungskarten innerhalb von 30 Tagen" hält das System glaubwürdig. [unbelegt: Die Erledigungsziele sind eine Faustregel aus der Praxis, keine Norm.]

### Ein-Punkt-Lektionen

Eine Ein-Punkt-Lektion (One Point Lesson, OPL) ist eine einseitige Anleitung zu genau einem Thema, meist mit Foto oder Skizze und weniger als 50 Wörtern Text: "So prüfen Sie den Hydraulikölstand", "So sieht ein verschlissener Keilriemen aus". OPLs werden von Technikern oder erfahrenen Werkern geschrieben, an der Maschine in fünf bis zehn Minuten vermittelt und von jedem Teilnehmer abgezeichnet. Sie sind das günstigste Schulungsformat in TPM.

### Was Werker nicht tun sollten

Die autonome Instandhaltung hat Grenzen, und diese gehören in die Team-Charta:

- keine Arbeiten hinter Schutzeinrichtungen oder in Bereichen gefährlicher Energie ohne das Lockout/Tagout-Verfahren des Werks und die erforderliche Berechtigung
- keine Elektroarbeiten über das hinaus, was befähigte Personen tun dürfen
- keine Änderungen an Schutzeinrichtungen, Verriegelungen oder Softwareparametern
- keine Reparaturen, die eine Diagnose erfordern; Werker markieren, die Instandhaltung repariert

Diese Grenzen schriftlich festzuhalten, schützt die Werker, hält die Instandhaltung im Boot ("die nehmen uns nicht die Arbeit weg") und gibt Gewerkschaft oder Arbeitnehmervertretung eine klare Grundlage für eine Vereinbarung.

## Geplante Instandhaltung: vom Feuerlöschen zum System

Die geplante Instandhaltung ist die Säule der Instandhaltungsabteilung. Ihr Ziel ist es, Arbeit von ungeplant zu geplant und, wo es sich lohnt, von zeitbasiert zu zustandsorientiert zu verlagern, damit Techniker ihre Fähigkeiten für Vorbeugung und Ursachen einsetzen.

### Eine Abfolge in sechs Schritten

Das Kaizen Institute beschreibt die geplante Instandhaltung in sechs Schritten [15]; die folgende Abfolge ist eine verbreitete praktische Variante.

1. **Anlagen bewerten und nach Kritikalität ordnen.** Jede Anlage danach bewerten, wie sich ein Ausfall auf Sicherheit, Qualität, Liefertreue und Kosten auswirkt und wie häufig sie ausfällt. Mit den A-kritischen Anlagen beginnen, typischerweise Engpassmaschinen (siehe den geplanten [Leitfaden zur Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/)).
2. **Wiederherstellen und Verschleiß rückgängig machen.** Beheben, was autonome Instandhaltung und Ausfallhistorie aufdecken; Instandhaltung an einer Maschine in schlechtem Grundzustand zu planen, ist sinnlos.
3. **Ein Informationssystem aufbauen.** Anlagenregister, Ausfallhistorie und Arbeitsaufträge in einem CMMS; Ausfallcodes, die auf Ausfallarten verweisen, nicht nur "repariert".
4. **Ein zeitbasiertes Instandhaltungssystem aufbauen.** Wartungsaufgaben mit Intervallen, Arbeitsanweisungen, Teilen und Dauer; Terminplanung abgestimmt mit der Produktionsplanung.
5. **Ein zustandsorientiertes (vorausschauendes) Instandhaltungssystem aufbauen.** Schwingungsmessung, Thermografie, Ölanalyse oder Motorstromanalyse dort, wo die Ausfallart sich ankündigt und die Anlage kritisch genug ist.
6. **Bewerten und verbessern.** MTBF, MTTR, Anteil geplanter Instandhaltung und Kosten verfolgen; Wartungsaufgaben überprüfen, die nie etwas finden, und Ausfälle, die die Wartung nicht verhindert hat.

### Instandhaltungsstrategie je Ausfallart

| Ausfallverhalten | Beispiel an IMM-12 | Beste Strategie |
|---|---|---|
| Verschleiß mit vorhersagbarer Lebensdauer | Schnecke und Zylinder, Rückstromsperre | zeit- oder nutzungsabhängiger Austausch, gemessener Verschleiß |
| kündigt sich messbar an | Lager der Hydraulikpumpe (Schwingung), Motor (Strom, Temperatur) | zustandsorientierte Überwachung |
| zufällig, ohne Vorwarnung, billig und schnell zu tauschen | Kontrollleuchte, kleine Sicherung | Betrieb bis zum Ausfall mit Ersatzteil vor Ort |
| verdeckter Ausfall (nur im Bedarfsfall sichtbar) | Sicherheitsverriegelung, Not-Halt | Funktionsprüfung in festem Intervall (auf der CILS-Karte) |
| verursacht durch schlechte Grundbedingungen | Verschmutzung im Hydrauliköl, lose Verschraubungen | Standard der autonomen Instandhaltung |

### Instandhaltungskosten: was die Daten sagen

Belastbare US-Zahlen zu Instandhaltungskosten sind rar. Ein Bericht des NIST von 2018 ergab, dass US-Hersteller laut Daten des Census Bureau 2016 etwa 50 Milliarden USD für fremdvergebene Instandhaltung und Reparatur ausgaben; eigenes Personal und Material sind darin nicht enthalten [18]. Derselbe Bericht zitiert eine schwedische Erhebung, in der Stillstandskosten 23,9 % der gesamten Fertigungskosten ausmachten und Stillstände 13,3 % der geplanten Produktionszeit beanspruchten, sowie eine Schätzung, nach der industrielle Instandhaltung 5,5 % des Unternehmensumsatzes kostet, mit einer Spanne von 0,5 % bis 25 % [18]. Das NIST selbst merkt an, dass die Literatur selten die Daten liefert, die für eine Schätzung auf US-Ebene nötig wären [18]. Gehen Sie mit jeder einzelnen Zahl zu "Stillstandskosten pro Stunde" vorsichtig um; sie hängt vollständig davon ab, ob die Maschine ein Engpass ist.

## Fokussierte Verbesserung: zuerst den größten Verlust angehen

Die fokussierte Verbesserung (Kobetsu Kaizen) ist die Problemlösungssäule von TPM. Kleine bereichsübergreifende Teams aus vier bis sechs Personen [21] nehmen sich einen bestimmten Verlust vor, meist den obersten Balken des Verlust-Paretos, und beseitigen ihn mit einer strukturierten Methode.

**Die Methode:** Die meisten Werke verwenden ein [PDCA](https://www.m365.fm/learn/lean-management/pdca-zyklus/)- (geplant) oder A3-Format und für chronische, statistisch komplexe Verluste DMAIC aus [Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant). TPM ergänzt einige verlustspezifische Werkzeuge:

| Werkzeug | Einsatz in TPM |
|---|---|
| Verlust-Pareto in Minuten | Thema wählen; Qualitätsverluste in Minuten umrechnen (Menge × ideale Taktzeit), damit alle Verluste vergleichbar sind |
| 5 Warum | sporadische Ausfälle und Kurzstillstände mit nachvollziehbarer Ursachenkette |
| P-M-Analyse (Phänomen und Mechanismus) | chronische Verluste mit mehreren zusammenwirkenden Ursachen; geht vom physikalischen Phänomen aus und listet jede Anlagenbedingung auf, die beitragen könnte [unbelegt: Herkunft der Methode in der JIPM-Literatur nicht an einer Primärquelle geprüft] |
| SMED | Verluste durch Rüsten und Einrichten |
| Fischgrät-(Ishikawa-)Diagramm | mögliche Ursachen vor der Datenerhebung strukturieren |
| Kurzstillstandsstudie | die Maschine eine ganze Schicht beobachten und jeden Stopp unter der Schwelle mit Ursache erfassen |

**Rechenbeispiel an IMM-12: Kurzstillstände.** Die Kurzstillstandsstudie zeigt 61 Stopps pro Tag. Davon sind 38 Teile, die auf der Auswerferseite der Rutsche hängen bleiben, 12 Auslösungen des Teileanwesenheitssensors wegen einer verstaubten Linse und 11 Sonstiges. Das Team stellt den Rutschenwinkel neu ein und ergänzt eine Führungsschiene (38 → 9 Stopps), nimmt die Sensorreinigung in die CILS-Karte auf (12 → 2) und lässt den Rest vorerst liegen. Ergebnis: 61 → 22 Stopps mit durchschnittlich 1,4 Minuten, der Kurzstillstandsverlust sinkt also von etwa 84 auf etwa 31 Minuten pro Tag. Das ist besser als die 50 Minuten, die oben in Schritt 7 angenommen wurden; behalten Sie die vorsichtige Zahl im Plan, bis das Ergebnis einen Monat lang hält.

**Regel für das Team:** ein Verlust, ein Team, ein festes Enddatum nach 8 bis 12 Wochen und ein Ergebnis, gemessen in Minuten im Wasserfall. Läuft ein Projekt länger, wird es geteilt.

## TPM und Arbeitssicherheit: Lockout/Tagout, Ergonomie und die Stimme der Werker

TPM bringt Werker näher an das Innere ihrer Maschinen. In den USA fällt die autonome Instandhaltung damit unmittelbar in den Anwendungsbereich der Vorschriften der OSHA (Occupational Safety and Health Administration, US-Arbeitsschutzbehörde). Ein Unfall bei einer Reinigungsaufgabe kann ein TPM-Programm stoppen, und das zu Recht.

### Wo 29 CFR 1910.147 gilt (US-Kontext)

Der OSHA-Standard zur Beherrschung gefährlicher Energie (Lockout/Tagout) "gilt für die Wartung und Instandhaltung von Maschinen und Anlagen" [14]. Drei Punkte sind für TPM wichtig:

1. **Der normale Produktionsbetrieb ist nicht erfasst.** Wartung während des normalen Produktionsbetriebs ist nur in bestimmten Fällen erfasst, etwa wenn ein Beschäftigter eine Schutzeinrichtung entfernen oder einen Körperteil in die Wirkstelle bringen muss [14].
2. **Die Ausnahme für kleine Wartungsarbeiten.** Kleinere Werkzeugwechsel und Einstellungen sowie andere kleine Wartungsarbeiten sind ausgenommen, wenn sie "routinemäßig, wiederkehrend und fester Bestandteil der Nutzung der Anlage für die Produktion" sind, vorausgesetzt, die Arbeit wird mit alternativen Maßnahmen ausgeführt, die wirksamen Schutz bieten [14].
3. **Verfahren, Unterweisung und Überprüfungen.** Verfahren zur Energiekontrolle müssen erarbeitet, dokumentiert und angewendet werden; berechtigte Beschäftigte müssen darin geschult sein, gefährliche Energiequellen zu erkennen, betroffene Beschäftigte über Zweck und Anwendung des Verfahrens unterwiesen werden, und die Verfahren sind mindestens jährlich zu überprüfen [14].

**Was das für die Aufgaben der Reinigungs- und Inspektionsroutine bedeutet:** Ordnen Sie jede Aufgabe der autonomen Instandhaltung vor dem Start von Schritt 1 einer von drei Gruppen zu.

| Gruppe | Beispiele | Absicherung |
|---|---|---|
| A: außerhalb des Gefahrenbereichs, Maschine läuft oder ist normal gestoppt | Schauglasprüfungen, Sichtprüfung der Schläuche von außerhalb der Schutzeinrichtung, Ablesen von Anzeigen, Abwischen einer Sensorlinse außerhalb der Schutzeinrichtung | normaler Produktionsbetrieb; Gefährdungsbeurteilung der Tätigkeit (Job Safety Analysis) |
| B: kleine Wartungsarbeiten, die routinemäßig, wiederkehrend und fester Bestandteil der Produktion sind | ein Teil mit einem Werkzeug aus einer zugänglichen Rutsche entfernen, eine Führung während der Produktion nachstellen | nur mit dokumentierten alternativen Maßnahmen, die wirksamen Schutz bieten, und nur wenn die Aufgabe die Ausnahme wirklich erfüllt [14] |
| C: alles hinter Schutzeinrichtungen oder im Gefahrenbereich oder nicht routinemäßig | Grundreinigung im Schließbereich, Schmierstellen hinter Schutzeinrichtungen, Nachziehen im Inneren der Maschine | vollständiges Lockout/Tagout; Werker sind für diese Aufgaben als berechtigte Beschäftigte geschult, oder die Aufgabe bleibt bei der Instandhaltung |

Die Grundreinigung (Schritt 1) enthält fast immer Aufgaben der Gruppe C. Planen Sie die Lockout-Verfahren und die Schulung der berechtigten Beschäftigten vor dem ersten Reinigungstag, nicht danach.

### Ergonomie

Reinigung und Inspektion fügen der Schicht des Werkers Aufgaben hinzu. Prüfen Sie sie auf ungünstige Körperhaltungen, Greifen und Heben, die die OSHA zu den ergonomischen Risikofaktoren für Muskel-Skelett-Erkrankungen zählt [30]. Schritt 2 der autonomen Instandhaltung ist der richtige Ort, das zu beheben: Erreichbare Inspektionspunkte helfen der Maschine und dem Werker zugleich.

### Gewerkschaften, Mitarbeiterausschüsse und Respekt vor den Menschen

- **Tarifverträge und Tätigkeitseinstufungen.** In gewerkschaftlich organisierten Werken kann die Verlagerung von Aufgaben zwischen Produktions- und Instandhaltungseinstufungen Verhandlungsgegenstand sein. Stimmen Sie die Aufgabenliste aus dem Abschnitt "Was Werker nicht tun sollten" vor dem Pilot mit der Gewerkschaft ab.
- **Mitarbeiterausschüsse.** TPM-Lenkungskreise und Säulenteams beziehen Beschäftigte aus der Produktion ein. In den USA können ständige Ausschüsse, die sich mit Arbeitsbedingungen befassen, Fragen nach Section 8(a)(2) des National Labor Relations Act aufwerfen; maßgeblich ist der Fall *Electromation* (7th Circuit, 1994) [29]. Halten Sie die Chartas der Säulenteams auf Anlagen, Qualität und Sicherheit fokussiert und lassen Sie sie arbeitsrechtlich prüfen.
- **Zeit.** Die Reinigungs- und Inspektionsroutine und die Bearbeitung der Fehlerkarten brauchen bezahlte Zeit im Schichtplan. Ein Programm, das von Werkern erwartet, autonome Instandhaltung "nebenbei" zu machen, lehrt sie, dass die Führung es nicht ernst meint.
- **Anerkennung.** Gefundene und erledigte Fehlerkarten sind Teamleistungen. Verwenden Sie sie nie zur Bewertung Einzelner.
- **Ein Platz am Tisch.** Setzen Sie Werker und Techniker in den TPM-Lenkungskreis und in jedes Säulenteam, nicht nur Meister. Sie wissen, wo die Maschine leckt.

## TPM einführen: Roadmap von 0 bis 36 Monaten

Das Kaizen Institute beschreibt eine TPM-Roadmap in drei Phasen von 6 bis 12, 12 bis 24 und etwa 12 Monaten [15]; Vornes praktischer Einstieg verwendet fünf Schritte (Pilotbereich, Anlage wiederherstellen, OEE messen, die großen Verluste angehen, proaktive Instandhaltung einführen) [21]. Die folgende Roadmap verbindet beides mit Stage-Gates, sodass ein TPM-Programm nur so schnell wächst, wie die Routinen auf dem Shopfloor halten. Die Dauern sind ein Planungsrichtwert. [unbelegt: Keine Studie nennt eine typische Dauer; die Schätzungen der Beratungen gehen auseinander.]

| Phase | Monate | Inhalt | Gate zur nächsten Phase |
|---|---|---|---|
| 0. Entscheiden und vorbereiten | 0–2 | Commitment der Führung, Lenkungskreis, Information von Gewerkschaft bzw. Belegschaftsvertretung, TPM-Koordinator benannt, Sicherheitsprüfung der Aufgaben, OEE-Definitionsblatt, Start der Basismessung | Definitionen unterschrieben; Basismessung läuft; Lockout-Verfahren für den Pilot fertig |
| 1. Pilot | 2–8 | eine Pilotmaschine (ein Engpass oder eine Maschine mit sichtbaren Problemen), 5S, Schritte 1–3 der autonomen Instandhaltung, erstes Projekt der fokussierten Verbesserung zum größten Verlust, geplante Instandhaltung für den Pilot | OEE-Trend des Pilots 8 Wochen lang steigend; Reinigungs- und Inspektionsroutine in 90 % der Schichten erledigt; Erledigung der Fehlerkarten im Ziel |
| 2. Kernsäulen ausweiten | 8–20 | Ausrollen auf Linie oder Bereich; Schritte 4–5 der autonomen Instandhaltung; Kritikalitätsranking und Wartungssystem für A-kritische Anlagen; Schulungssäule mit Qualifikationsmatrix | mindestens 3 Bereiche auf Schritt 3; Anteil geplanter Instandhaltung steigt; MTBF der A-Anlagen steigt |
| 3. Restliche Säulen ergänzen | 18–30 | Qualitätsinstandhaltung für die häufigsten Fehlerarten; Anlaufmanagement für das nächste Investitionsprojekt; Office TPM in Ersatzteilwesen oder Instandhaltungsplanung; SHE-Prüfung | Qualitätsinstandhaltungsmatrix in Betrieb; nächste Beschaffung mit Checkliste Instandhaltbarkeit spezifiziert |
| 4. Selbstmanagement | 24–36+ | Schritte 6–7 der autonomen Instandhaltung; Teams verantworten ihr Verlust-Pareto; TPM in das tägliche Führungssystem integriert | Teams führen Stufenbesprechungen zu ihren eigenen Verlusten; interne Audits ersetzen die Audits des Koordinators |

### Die Pilotmaschine auswählen

| Kriterium | Warum |
|---|---|
| Sie ist ein Engpass oder fast ein Engpass | OEE-Gewinne werden zu Ausbringung und Geld (siehe Business Case) |
| Ihre Verluste sind sichtbar und häufig | Ergebnisse innerhalb von Wochen halten den Schwung |
| Das Team ist bereit | ein skeptischer, aber fairer Meister ist in Ordnung; offene Ablehnung nicht |
| Sie wird nicht demnächst ersetzt | dort ist das Anlaufmanagement der Hebel, nicht die autonome Instandhaltung |
| Ihre Daten lassen sich messen | mindestens manuelle Stillstandserfassung je Schicht ab dem ersten Tag |

### Rollen

| Rolle | Verantwortung |
|---|---|
| Werksleitung | Sponsor; leitet das monatliche TPM-Review; schützt Zeit und Budget |
| TPM-Koordinator | Methode, Schulung, Audits, Fortschrittsberichte; Voll- oder Teilzeit je nach Zahl der aktiven Bereiche |
| Säulenverantwortliche | eine Führungskraft je aktiver Säule mit schriftlichem Plan und Kennzahlen |
| Meister / Schichtführer | tägliche Reinigungs-, Inspektions- und Fehlerkartenroutine, Schichtübergabe, Teamzeit |
| Instandhaltungsplaner | Wartungsplan, Rückstau der Fehlerkarten, Ersatzteile |
| Werker und Techniker | die Arbeit, die Fehlerkarten, die Verbesserungsideen |
| Arbeitssicherheit und Umwelt (EHS) | Gefährdungsprüfung der Aufgaben, Lockout-Verfahren |
| Controlling | Basis und Nutzenverfolgung (siehe unten) |

## TPM-Vorlagen und Checklisten

### OEE-Definitionsblatt

| Feld | Eintrag für IMM-12 |
|---|---|
| Anlage / Umfang | IMM-12, Formwechsel eingeschlossen, Roboter und Förderband eingeschlossen |
| Basis Kalenderzeit | 24 h pro Produktionstag |
| Aus der geplanten Produktionszeit herausgenommen | Pausen (3 × 30 min), geplantes Instandhaltungsfenster (30 min/Tag), keine Aufträge, geplante Versuche mit neuen Formen |
| Quelle der idealen Taktzeit | beste nachgewiesene Zykluszeit je Form, vierteljährlich von der Prozesstechnik überprüft |
| Schwelle zwischen Ausfall und Kurzstillstand | Stopps ab 5 Minuten sind Ausfälle oder Rüstvorgänge; kürzere Stopps sind Kurzstillstände |
| Zählpunkt Gesamtmenge | Schusszähler der Maschine × Kavitäten |
| Zählpunkt Gutmenge | nach der Sichtprüfung durch den Werker und der Prüfung am Linienende |
| Nacharbeit | zählt als Fehler |
| Datenquelle | Maschinensignal für Lauf/Stopp und Stückzahlen; Werker wählt den Stillstandsgrund am Terminal |
| Verantwortlich | Prozessingenieur, Linie 2 |

### Katalog der Stillstandsgründe (zwei Ebenen)

| Ebene 1 (OEE-Verlust) | Gründe Ebene 2 (Beispiele) |
|---|---|
| Ausfall | Hydraulik, Elektrik, Mechanik, Heizung, Roboter, Formschaden |
| Rüsten und Einrichten | Formwechsel, Materialwechsel, Farbwechsel, Einstellen am Erstteil |
| Kurzstillstand | Teil hängt, Sensor ausgelöst, Roboter greift daneben, Stau am Förderband |
| Verringerte Geschwindigkeit | Zyklus wegen Qualität verlängert, Materialproblem, Entscheidung des Werkers |
| Anlaufverlust | Ausschuss beim Warmlaufen, Ausschuss nach dem Rüsten |
| Ausschuss / Nacharbeit | unvollständig gefüllt, Grat, Einfallstellen, Verunreinigung |
| Geplant (herausgenommen) | Pause, Besprechung, geplante Instandhaltung, kein Auftrag, Versuch |

Bleiben Sie bei zwei Ebenen und etwa 30 Gründen. Zu viele Gründe erzeugen "Sonstiges"; zu wenige erzeugen ein Pareto, mit dem niemand arbeiten kann.

### Audit eines Schritts der autonomen Instandhaltung (Beispiel Schritt 1)

| Prüfpunkt | Ja / Nein |
|---|---|
| Alle zugänglichen Flächen bis auf blankes Metall oder Lack gereinigt | |
| Jede gefundene Abweichung hat eine nummerierte Fehlerkarte | |
| Fehlerkartenprotokoll vollständig (Nummer, Datum, Finder, Beschreibung, Art) | |
| Werkerkarten innerhalb der vereinbarten Zeit erledigt oder eingeplant | |
| Verschmutzungsquellen für Schritt 2 aufgelistet | |
| Schwer zugängliche Inspektionspunkte für Schritt 2 aufgelistet | |
| Lockout/Tagout bei jeder Aufgabe der Gruppe C eingehalten (von EHS bestätigt) | |
| Jedes Teammitglied kann drei gefundene Abweichungen erklären und warum sie wichtig sind | |
| Vorher-Nachher-Fotos an der Teamtafel ausgehängt | |

Bestanden, wenn alle Punkte "Ja" sind; das Audit führen eine Führungskraft und der TPM-Koordinator an der Maschine durch.

### Fehlerkartenprotokoll

| Karten-Nr. | Datum | Gefunden von | Maschine / Ort | Beschreibung | Art (Werker / Instandhaltung) | Sicherheitsrelevant? | Fällig | Erledigt | Gegenmaßnahme |
|---|---|---|---|---|---|---|---|---|---|
| 12-041 | 3. Nov. | J. R. | IMM-12, Schließseite | Hydraulikschlauch an der Halterung durchgescheuert | Instandhaltung | ja | 4. Nov. | 4. Nov. | Schlauch getauscht, Halterung gepolstert |
| 12-042 | 3. Nov. | L. M. | IMM-12, Rutsche | Teile bleiben auf der linken Seite hängen | Werker | nein | 10. Nov. | 8. Nov. | Führungsschiene ergänzt |

### Vorlage Ein-Punkt-Lektion

| Feld | Inhalt |
|---|---|
| Titel | So prüfen Sie den Hydraulikölstand an IMM-12 |
| Art | Grundwissen / Problemfall / Verbesserung |
| Bild | Foto des Schauglases mit hervorgehobener Min-/Max-Markierung |
| Text (max. 50 Wörter) | "Maschine im normalen Stopp. Füllstand im Schauglas ablesen. Zwischen den Markierungen: in Ordnung. Unter Min: nicht nachfüllen; Instandhaltungskarte aufhängen und Instandhaltung rufen." |
| Autor / Datum | Instandhaltungstechniker, Datum |
| Geschult von / Teilnehmer / Datum / Unterschrift | Tabelle mit einer Zeile je Teilnehmer |

### Agenda des monatlichen TPM-Reviews (60 Minuten)

| Zeit | Thema | Eingang |
|---|---|---|
| 10 min | Trend von OEE und Verlustwasserfall je Pilot oder Bereich | OEE-Bericht aus Summen, nicht aus Mittelwerten |
| 10 min | autonome Instandhaltung: erreichte Schritte, bestandene Audits, gefundene und erledigte Fehlerkarten | Schritttafel, Fehlerkartenprotokoll |
| 10 min | geplante Instandhaltung: Anteil geplanter Instandhaltung, Termintreue der Wartung, MTBF/MTTR der A-Anlagen | CMMS |
| 15 min | Projekte der fokussierten Verbesserung: Stand in eingesparten Minuten | A3-Reports |
| 10 min | Sicherheit: anlagenbezogene Unfälle und Beinaheunfälle, offene Lockout-Maßnahmen | EHS |
| 5 min | Entscheidungen, Ressourcen, Eskalationen | |

## TPM-Kennzahlen: wie man das Programm misst

Die OEE ist das Ergebnis. Ein TPM-Programm braucht zusätzlich Prozesskennzahlen, die zeigen, ob die Routinen tatsächlich laufen. Die folgenden Definitionen sind gängige Praxis; für den Vergleich mit anderen Werken verwenden Sie die Definitionen der SMRP Best Practices [19] oder ISO 22400-2, soweit die Norm die Kennzahl abdeckt [11].

| Kennzahl | Formel | Was sie zeigt | Ebene |
|---|---|---|---|
| OEE | Gutmenge × ideale Taktzeit ÷ geplante Produktionszeit | Gesamtwirkung der sechs Verluste | Maschine, Linie |
| Verlustminuten je Kategorie | Minuten je Verlust (Qualitätsverluste × ideale Taktzeit) | wo man ansetzt; das nützlichste TPM-Diagramm | Maschine |
| TEEP | OEE × Belegung | ungenutzte Kalenderkapazität | Maschine, Werk |
| MTBF | Laufzeit ÷ Anzahl der Ausfälle | Zuverlässigkeit | Anlage |
| MTTR | Ausfallzeit ÷ Anzahl der Ausfälle | Instandhaltbarkeit, Reaktion, Qualifikation | Anlage |
| Anteil geplanter Instandhaltung | Stunden geplante Instandhaltung ÷ Instandhaltungsstunden gesamt | wie viel der Instandhaltung unter Kontrolle ist | Instandhaltung |
| Termintreue der Wartung (PM Compliance) | fristgerecht erledigte Wartungsaufträge ÷ fällige Wartungsaufträge | Disziplin des geplanten Instandhaltungssystems | Instandhaltung |
| Instandhaltungsrückstau | geplante, noch nicht erledigte Arbeit in Teamwochen | Personalbedarf | Instandhaltung |
| Einhaltung der Reinigungs- und Inspektionsroutine | Schichten mit erledigter Routine ÷ geplante Schichten | Disziplin der autonomen Instandhaltung | Team |
| Gefundene / erledigte Fehlerkarten pro Woche | Anzahl | Erkennung und Reaktion | Team |
| Durchschnittsalter der Fehlerkarten | Tage offen | Glaubwürdigkeit des Kartensystems | Team, Instandhaltung |
| Schrittstufe der autonomen Instandhaltung | höchster auditierter Schritt je Maschine | Reifegrad des Programms | Bereich |
| Abdeckung der Qualifikationsmatrix | qualifizierte Personen je kritischer Fähigkeit | Schulungssäule | Bereich |
| Instandhaltungskosten pro Einheit | Instandhaltungskosten ÷ Gutteile | Kostenwirkung | Werk |
| Anlagenbezogene Sicherheitsvorfälle | Anzahl, und als Teil der meldepflichtigen OSHA-Unfallrate (US-Kontext) | SHE-Säule | Werk |

**Früh- und Spätindikatoren:** Einhaltung der Routine, Erledigung der Fehlerkarten und Termintreue der Wartung sind Frühindikatoren; sie bewegen sich zuerst. OEE, MTBF und Instandhaltungskosten sind Spätindikatoren. Eine Tafel nur mit Spätindikatoren zeigt monatelang nichts und verliert dann die Aufmerksamkeit der Führung. Der Leitfaden [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/) erklärt die gestufte Kennzahlenstruktur; der Leitfaden [Shop Floor Management](https://www.m365.fm/learn/shop-floor-management/) zeigt, wie diese Zahlen in die tägliche [Stufenbesprechung (Tier Meeting)](https://www.m365.fm/entity/tier-meeting/) einfließen.

## Der Business Case: was ein OEE-Prozentpunkt wert ist

Das Controlling lehnt TPM-Zahlen oft ab, weil der Nutzen als "OEE-Punkte × Ausbringung × Preis" gerechnet wird. Diese Abkürzung stimmt nur unter einer Bedingung.

### Fall 1: Die Maschine ist ein Engpass und es gibt Nachfrage

Wenn IMM-12 die Ausbringung des Werks begrenzt und die Kunden mehr abnehmen würden, bringt jedes Gutteil seinen Deckungsbeitrag. Angenommen seien ein Verkaufspreis von 1,20 USD pro Teil und variable Kosten (Granulat, Energie, Verpackung) von 0,70 USD, also ein Deckungsbeitrag von 0,50 USD.

- Ein OEE-Prozentpunkt an IMM-12 = 1 % × 1.320 Minuten ÷ 0,25 Minuten = **52,8 Gutteile pro Tag**.
- Die Verbesserung von 73,6 % auf 84,3 % = 563 Gutteile pro Tag × 0,50 USD = **281,50 USD pro Tag**.
- Bei 250 Produktionstagen: **70.375 USD pro Jahr** zusätzlicher Deckungsbeitrag, von einer Maschine.

Der [Leitfaden zur Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant) erklärt, warum eine am Engpass gewonnene Stunde so viel wert ist wie die Ausbringung des ganzen Werks in dieser Stunde.

### Fall 2: Die Maschine ist kein Engpass

Wenn IMM-12 freie Kapazität hat und die Nachfrage fest ist, sind die 563 zusätzlichen Teile nichts wert; sie würden nur Bestand aufbauen. Der Nutzen sind dann die vermiedenen Kosten, um dieselbe Ausbringung zu erzeugen:

| Nutzen | Beispiel IMM-12 (pro Jahr, beispielhaft) |
|---|---|
| Weniger Ausschussteile | (85 + 76 − 50 − 60) = 51 Teile/Tag × 0,30 USD Material × 250 Tage = 3.825 USD |
| Weniger geplante Zeit für dieselbe Ausbringung | bei fester Nachfrage braucht die Maschine etwa 12,7 % weniger geplante Produktionszeit; Einsparungen entstehen nur, wenn Personal, Energie oder eine Schicht tatsächlich wegfallen oder anders eingesetzt werden können |
| Weniger Ausfälle | geringere Kosten für Notreparaturen, Überstunden und Eilmaßnahmen: tatsächliche Zahlen aus CMMS und Lohnabrechnung nehmen |
| Aufgeschobene Investitionen | wenn die TEEP zeigt, dass eine zweite Maschine nicht mehr nötig ist, die vermiedene Investition und ihre Abschreibung |

Die 12,7 % ergeben sich aus dem OEE-Verhältnis: Dieselbe Gutmenge braucht 73,6 ÷ 84,3 = 87,3 % der bisherigen geplanten Zeit.

### Kosten eines TPM-Programms

| Kostenposition | Investition oder laufende Kosten | Anmerkungen |
|---|---|---|
| Zeit von Werkern und Technikern für Reinigungs- und Inspektionsroutine, Fehlerkarten, Schulung und Workshops | laufend | der größte Kostenblock; Stunden ausdrücklich budgetieren |
| TPM-Koordinator | laufend | Voll- oder Teilzeit |
| Wiederherstellung der Grundbedingungen (Teile, Dichtungen, Schutzeinrichtungen, Zugangsabdeckungen) | überwiegend laufend, größere Reparaturen ggf. aktivierbar | hängt vom in Schritt 1 gefundenen Verschleiß ab |
| Werkzeuge, Schmiergeräte, visuelle Steuerung | laufend | gering |
| Datenerfassung (Maschinensignale, Terminals, OEE- oder CMMS-Software) | Investition oder Abonnement (laufend) | hängt von der bestehenden IT/OT-Landschaft ab |
| Externe Schulung oder Beratung | laufend | in den USA bieten die NIST-MEP-Zentren kleinen und mittleren Herstellern Leistungen zu Lean und Prozessverbesserung an [27][28] |

**Beispielhafte Amortisation im ersten Jahr für den Pilot an IMM-12 (Engpassfall):**

| Position | Rechnung | Betrag |
|---|---|---|
| Pilot-Workshops und Schulung (Grundreinigung, SMED, Kurzstillstandsprojekt, Ein-Punkt-Lektionen) | 400 Teamstunden × 45 USD Vollkostensatz | 18.000 USD |
| Teile zur Wiederherstellung und kleine Umbauten (Schläuche, Dichtungen, Rutschenführung, Zugangsabdeckungen) | Schätzung aus den Fehlerkarten von Schritt 1 | 8.000 USD |
| Anteil des TPM-Koordinators am Pilot | 0,2 Vollzeitstellen × 6 Monate, ca. | 9.000 USD |
| **Kosten im ersten Jahr** | | **35.000 USD** |
| Zusätzlicher Deckungsbeitrag, sobald die volle Verbesserung hält | 281,50 USD × 250 Tage | 70.375 USD pro Jahr |
| **Einfache Amortisation** | 35.000 USD ÷ (70.375 USD ÷ 12) | **etwa 6 Monate, nachdem die Verbesserung hält** |

Alle Sätze und Beträge sind beispielhaft; ersetzen Sie sie durch Ihre eigenen Lohn- und Einkaufsdaten. Im Nicht-Engpass-Fall amortisieren sich dieselben Kosten deutlich langsamer, ein weiterer Grund, TPM am Engpass zu beginnen. Die Zeit für die Reinigungs- und Inspektionsroutine steht nicht in der Tabelle, weil sie in diesem Zeitmodell innerhalb des bestehenden geplanten Instandhaltungsfensters läuft.

**Regeln für einen glaubwürdigen Business Case:** die Basis vor Programmstart festlegen, vorab vereinbaren, welche Nutzen zählen (Engpassausbringung, Ausschuss, Überstunden, vermiedene Investitionen), sie monatlich mit dem Werkscontroller verfolgen und dieselbe Minute nicht doppelt zählen (etwa als "mehr Ausbringung" und zugleich als "weniger Überstunden").

Die EPA schätzt, dass TPM die Anlageneffizienz innerhalb von drei Jahren um 15 bis 25 Prozent steigern kann [13]. Das ist eine behördliche Schätzung ohne auf der Seite veröffentlichte Methode; verwenden Sie für den Business Case daher Ihre eigene Basis und nehmen Sie die EPA-Zahl als Orientierung.

## Typische Fehler bei TPM

| Fehler | Was passiert | Besserer Ansatz |
|---|---|---|
| TPM als Instandhaltungsprogramm gestartet | die Produktion hält es für "Sache der Instandhaltung"; Werker machen nicht mit | Werksleitung als Sponsor; die Produktion führt die autonome Instandhaltung |
| Big-Bang-Einführung an allen Maschinen | Koordinatoren und Techniker überlastet; Fehlerkarten stapeln sich; Glaubwürdigkeit verloren | ein Pilot, Stage-Gates, Ausweitung erst nach dem Gate |
| OEE berichtet, aber nicht aufgeschlüsselt | ein monatlicher Prozentwert, mit dem niemand etwas anfangen kann | Verlustwasserfall in Minuten und ein Pareto je Maschine |
| OEE als bonusrelevantes Ziel | Rüstvorgänge werden vermieden, Stopps als "geplant" gebucht, ideale Taktzeiten gedehnt | OEE als Verbesserungskennzahl für dieselbe Anlage; Boni (wenn überhaupt) auf Prozesskennzahlen und Teamergebnisse |
| OEE über Werke oder Maschinentypen vergleichen | falsche Schlüsse, Teams in der Defensive | jede Anlage mit ihrer eigenen Basis vergleichen |
| Grundreinigung auslassen | Standards für eine Maschine in schlechtem Zustand geschrieben | Schritt 1 gründlich, mit Lockout/Tagout |
| Fehlerkarten geschrieben, aber nicht erledigt | Werker hören nach einigen Wochen auf, Karten zu schreiben | Erledigungsziele und wöchentlicher Blick auf das Kartenalter |
| Keine Zeit für die Routine im Schichtplan | die Routine wird nur auf dem Papier erledigt | Minuten für die Routine im Schichtstandard; Einhaltung verfolgt |
| Werker sollen reparieren | Sicherheitsrisiko, Konflikt mit Instandhaltung und Gewerkschaft | schriftliche Aufgabengrenze; Werker markieren, die Instandhaltung repariert |
| Wartungsplan aus dem Handbuch des Maschinenherstellers kopiert | Wartungsaufgaben, die nichts finden, Ausfälle, die die Wartung nicht verhindert | Aufgaben nach Ausfallart und Kritikalität; Trefferquote der Wartung prüfen |
| Software zuerst | ein OEE-Dashboard mit falschen Definitionen und ohne Routine dahinter | zuerst Definitionen und manuelle Routine, dann automatisieren |
| Controlling nicht eingebunden | Nutzen wird angezweifelt, Budget im zweiten Jahr gekürzt | Controller stimmt Basis und Nutzenregeln vorab zu |
| TPM neben Entlassungen ankündigen | Werker halten ihr Wissen zurück | klare Aussage zur Beschäftigungssicherung für die durch TPM frei werdende Kapazität |

## Grenzen und Kritik an TPM und OEE

TPM ist gut etabliert, hat aber Grenzen, die die Anbieterseiten in den Suchergebnissen selten erwähnen.

**1. Die Einführung dauert lange und bleibt oft stecken.** Reliable Plant berichtet über eine Umfrage eines Forschungszentrums für Fertigung, in der 27 % der Befragten TPM als laufende Unternehmensinitiative nannten, aber nur 6 % es vollständig umsetzten und 5 % es als den Ansatz ihres Werks für Instandhaltung und Zuverlässigkeit bezeichneten [23]. Die Quelle ist eine Sekundärquelle, und Details der Umfrage fehlen, aber das Muster (viele fangen an, wenige kommen an) deckt sich mit den Schilderungen aus der Praxis.

**2. Die OEE lässt sich leicht schönen.** Jede Eingangsgröße ist eine Konvention: was als geplante Zeit zählt, welche Taktzeit ideal ist, wo die Schwelle zwischen Kurzstillstand und Ausfall liegt. Ändert man eine davon, bewegt sich die OEE ohne jede physische Veränderung. Wenn die OEE zum Ziel für Boni oder Werksrankings wird, verschieben sich diese Konventionen. Es gilt Goodharts Gesetz (siehe den Leitfaden [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)).

**3. Die OEE ist kein Gewinnmaß.** Eine Nicht-Engpass-Maschine mit 90 % OEE, die Bestand aufbaut, den niemand braucht, ist für das Unternehmen schlechter als dieselbe Maschine mit 60 % OEE, die nur nach Kundenbedarf läuft. Setzen Sie die OEE an Engpässen und an Maschinen mit Qualitäts- oder Zuverlässigkeitsproblemen ein; drücken Sie sie nicht überall durch.

**4. Die OEE ignoriert manche Kosten.** Energie-, Personal-, Werkzeug- und Materialverluste außerhalb der sechs Kategorien sind in der OEE unsichtbar. Die Sicht der 16 Verlustarten und die Instandhaltungskosten pro Einheit schließen einen Teil der Lücke [15].

**5. Eignung für Fertigung mit hoher Variantenvielfalt und kleinen Stückzahlen.** In einer Werkstattfertigung mit häufigen Rüstvorgängen und vielen Produkten lassen sich ideale Taktzeiten schwerer pflegen, und das Rüsten dominiert das Verlustbild. TPM funktioniert trotzdem, aber SMED und geplante Instandhaltung zählen meist mehr als die Jagd nach einer hohen OEE.

**6. Datenqualität.** Manuelle Erfassung übersieht Kurzstillstände gern [8], und Muchiri und Pintelon nennen die Genauigkeit der Datenerfassung als eines der wichtigsten praktischen Probleme der OEE-Messung [8]. Ljungberg empfiehlt, mit einem einfachen Modell zu beginnen und dann automatische und manuelle Erfassung zu kombinieren, um sowohl ein genaues Maß als auch Einblick in die Ursachen zu bekommen [9].

**7. Arbeitslast und Vertrauen.** Die autonome Instandhaltung fügt dem Arbeitstag des Werkers Aufgaben hinzu. Ohne Zeit im Schichtplan, eine faire Aufgabengrenze und eine sichtbare Reaktion auf die Fehlerkarten wird sie als Mehrarbeit für dasselbe Geld erlebt. Deshalb ist die Stimme der Beschäftigten Teil der Roadmap und kein nachträglicher Gedanke.

## TPM im digitalen Werk: Daten, CMMS, MES und Predictive Maintenance

Digitale Werkzeuge machen TPM schneller und genauer, sobald die Routinen existieren. Sie ersetzen weder die Grundreinigung noch die Fehlerkarten noch das Gespräch an der Maschine.

### Datenerfassung für die OEE

| Stufe | Wie | Stärken | Grenzen |
|---|---|---|---|
| Papierprotokoll je Schicht | Werker notiert Stopps, Stückzahlen, Gründe | billig, morgen startklar, schafft Bewusstsein | übersieht Kurzstillstände [8]; Übertragungsaufwand |
| Tabellenkalkulation oder Formular-App | Werker erfasst dieselben Daten digital | leichtere Auswertung | dieselben Erkennungsgrenzen wie Papier |
| Maschinensignal plus Grund vom Werker | Lauf/Stopp- und Zählsignale aus der SPS oder von einem Sensor; Werker wählt den Grund am Terminal (schriftlich festlegen, welcher Maschinenzustand als "läuft" gilt, sonst melden zwei Systeme zwei OEE-Werte) | genaue Zeiten und Stückzahlen, Kurzstillstände sichtbar | Qualität der Gründe hängt vom Katalog und von der Disziplin ab |
| MES mit Kennzahlen nach ISO 22400 | OEE wird im Manufacturing Execution System auf ISA-95-Ebene 3 berechnet | einheitliche Definitionen im ganzen Werk, Integration mit Aufträgen und Qualität | Einführungsaufwand, Stammdatenpflege |

**Schnittstellen, die man kennen sollte:** MTConnect ist ein offener Standard für die Interoperabilität von Fertigungsdaten, veröffentlicht als ANSI/MTC1.4-2018 und in US-Zerspanungsbetrieben verbreitet [31]. OPC UA bietet Companion Specifications, darunter ein gemeinsames Objektmodell für ISA-95 [32]. Die Norm ISA-95 verortet das Manufacturing Operations Management, zu dem OEE und Instandhaltungsmanagement gehören, auf Ebene 3 zwischen Steuerungssystemen und ERP [33]. Der geplante [Leitfaden zu MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) erklärt die Architektur; [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/) zeigt, wie Maschinendaten in die Cloud gelangen. Jede neue Verbindung ins Maschinennetz ist zugleich eine Frage der OT-Security; siehe den geplanten [Leitfaden zu OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/).

### CMMS und das Fehlerkartensystem

Ein computergestütztes Instandhaltungsmanagementsystem (Computerized Maintenance Management System, CMMS) enthält Anlagenregister, Arbeitsaufträge, Wartungspläne und Ausfallhistorie. Für TPM sind zwei Einstellungen am wichtigsten: Fehlerkarten sollten im CMMS zu Instandhaltungsanforderungen werden (mit der Kartennummer), und Störungsaufträge sollten einen Ausfallartencode tragen, der dem Katalog der Stillstandsgründe entspricht. Dann erzählen das Verlust-Pareto der Produktion und die Ausfallhistorie der Instandhaltung dieselbe Geschichte.

### Predictive Maintenance

Zustandsorientierte und vorausschauende Instandhaltung gehören zur Säule geplante Instandhaltung. Sensorik und Analytik lohnen sich für kritische Anlagen mit Ausfallarten, die sich messbar ankündigen (Lager, Pumpen, Motoren, Getriebe). Sie ersetzen die autonome Instandhaltung nicht: Ein Modell, das aus Schwingungsdaten den Ausfall einer Hydraulikpumpe vorhersagt, sagt Ihnen nicht, dass der Schlauch daneben an einer Halterung scheuert; ein Werker mit Taschenlampe schon. Der geplante [Leitfaden zu Predictive Maintenance und IIoT](https://www.m365.fm/learn/predictive-maintenance-iiot/) und die m365.fm-Folge [Predictive Maintenance on Azure for Manufacturers: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/) behandeln die Voraussetzungen.

### Dashboards

Ein gutes TPM-Dashboard je Maschine hat vier Elemente: den OEE-Trend aus summierten Zeiten, den Verlustwasserfall in Minuten, die häufigsten Stillstandsgründe als Pareto und die offenen Fehlerkarten mit ihrem Alter. Der Leitfaden [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/) enthält ein Power-BI-Datenmodell und DAX-Measures, die die OEE korrekt verdichten. Für Kapazitätsfragen über eine ganze Linie kann ein [Digital Twin oder Simulationsmodell](https://www.m365.fm/learn/digital-twin/) zeigen, wie sich Verfügbarkeits- und Leistungsverluste an einer Maschine über Puffer auf die Ausbringung der Linie auswirken.

## Was Forschung und dokumentierte Fälle zeigen

| Quelle | Art | Ergebnis | Einschränkung |
|---|---|---|---|
| Ljungberg (1998), *International Journal of Operations & Production Management* [9] | etwa 20 Fallmessungen | OEE "nur rund 55 Prozent"; Leistungsverluste größter Anteil; viele Unternehmen konzentrieren sich auf Ausfälle und übersehen kleine Verluste | Daten von 1998, schwedischer Kontext |
| McKone, Schroeder und Cua (1999), *Journal of Operations Management* [16] | Befragung von 97 Werken in drei Ländern | Kontextfaktoren erklären einen signifikanten Teil der Unterschiede in der TPM-Umsetzung; Managementfaktoren (JIT, TQM, Mitarbeiterbeteiligung) zählen mehr als Land oder Branche | betrifft die Einführung, nicht die Leistungsergebnisse |
| Muchiri und Pintelon (2008), *International Journal of Production Research* [8] | Literaturübersicht | Standarddefinitionen der OEE, sechs Verluste, Genauigkeit der Datenerfassung als zentrale Herausforderung | Übersicht, keine neuen Daten |
| Ahuja und Khamba (2008), *International Journal of Quality & Reliability Management* [17] | Literaturübersicht zu TPM | Übersicht über TPM-Definitionen, Einführungspraxis und berichtete Ergebnisse | als weiterführende Literatur aufgeführt; keine Einzelzahl daraus wird in diesem Leitfaden verwendet |
| Thomas (2018), NIST AMS 100-18 [18] | Behördenbericht | US-Hersteller gaben 2016 etwa 50 Milliarden USD für fremdvergebene Instandhaltung und Reparatur aus; Daten für eine US-weite Schätzung des Instandhaltungsnutzens fehlen | viele zitierte Zahlen stammen aus Nicht-US-Erhebungen oder Einzelfällen |
| Lazim, Ramayah und Ahmad (2008), *International Review of Business Research Papers* [25] | Einzelfall, malaysischer Automobilzulieferer | Instandhaltungskosten im Verhältnis zu den Produktionskosten sanken nach TPM ab 2001 von etwa 19 % (2003) auf 8,8 % (2006); Ausschussquoten sanken bei allen fünf Produktarten (z. B. von 22 % auf 12 %) | ein Unternehmen, ein Interview plus Unternehmensunterlagen, kein statistischer Test |
| EPA, Lean Thinking and Methods: TPM [13] | behördlicher Leitfaden | Schätzung von 15 bis 25 % höherer Anlageneffizienz innerhalb von drei Jahren; Umweltnutzen | Methode hinter der Schätzung nicht angegeben |

**Was das zusammen ergibt:** TPM ist als Praxis und als Methodensammlung gut gestützt, und sein Wirkmechanismus (weniger Verluste durch bessere Grundbedingungen und geplante Instandhaltung) ist plausibel und in Einzelfällen sichtbar. Belastbare Belege aus vielen Werken zur Größe des Leistungsgewinns sind dünner, als Anbieterseiten nahelegen. Planen Sie Ihren Business Case auf Ihrer eigenen Basis.

## Glossar TPM und OEE

| Begriff | Bedeutung |
|---|---|
| Fehlerkarte (F-Tag, Abnormality Tag) | an der Anlage angebrachte Karte, die ein bei Reinigung oder Inspektion gefundenes Problem markiert |
| Autonome Instandhaltung (Jishu Hozen) | TPM-Säule, in der Werker die Grundbedingungen der Anlage erhalten und Abweichungen erkennen |
| Verfügbarkeit | Laufzeit ÷ geplante Produktionszeit |
| Grundbedingungen | Reinigen, Schmieren und Nachziehen, die den Verschleiß der Anlage verhindern |
| CILS / CILT | Clean, Inspect, Lubricate und Secure bzw. Tighten (Reinigen, Inspizieren, Schmieren, Sichern bzw. Nachziehen): die tägliche Routine der autonomen Instandhaltung |
| CMMS | Computerized Maintenance Management System, computergestütztes Instandhaltungsmanagementsystem |
| Kritikalitätsranking | Bewertung von Anlagen nach Auswirkung und Wahrscheinlichkeit eines Ausfalls |
| Anlaufmanagement neuer Anlagen (Early Equipment Management) | TPM-Säule, die Instandhaltbarkeit und einfache Bedienung in neue Anlagen hineinkonstruiert |
| Fokussierte Verbesserung (Kobetsu Kaizen) | TPM-Säule zur strukturierten Beseitigung bestimmter Verluste |
| Ideale Taktzeit | bestmögliche Zeit pro Teil; Basis des Leistungsfaktors |
| JIPM | Japan Institute of Plant Maintenance, vergibt die TPM-Preise |
| Belegung (Loading) | geplante Produktionszeit ÷ Kalenderzeit |
| Lockout/Tagout | in den USA von der OSHA geregelte Verfahren zur Beherrschung gefährlicher Energie bei Wartungsarbeiten (29 CFR 1910.147) |
| [Kurzstillstände (Micro-Stops)](https://www.m365.fm/entity/micro-stops/) | kurze Stopps unter einer festgelegten Schwelle; ein Leistungsverlust |
| MTBF / MTTR | Mean Time Between Failures / Mean Time To Repair (mittlere Betriebsdauer zwischen Ausfällen / mittlere Reparaturdauer) |
| OEE | Overall Equipment Effectiveness (Gesamtanlageneffektivität) = Verfügbarkeit × Leistung × Qualität |
| Ein-Punkt-Lektion (One Point Lesson, OPL) | einseitige Anleitung zu einem Thema, an der Maschine vermittelt |
| Leistung | (ideale Taktzeit × Gesamtmenge) ÷ Laufzeit |
| Geplante Instandhaltung | TPM-Säule für zeit- und zustandsorientierte Instandhaltung durch die Instandhaltungsfunktion |
| Anteil geplanter Instandhaltung | Stunden geplante Instandhaltung ÷ Instandhaltungsstunden gesamt |
| Qualität (Qualitätsrate) | Gutmenge ÷ Gesamtmenge |
| Qualitätsinstandhaltung (Hinshitsu Hozen) | TPM-Säule, die Anlagenbedingungen lenkt, um Fehler zu verhindern |
| Sechs große Verluste | Ausfälle, Rüsten und Einrichten, Kurzstillstände, verringerte Geschwindigkeit, Ausschuss und Nacharbeit, Anlaufverluste |
| SMED | Single Minute Exchange of Die, die Methode zur Reduzierung der [Rüstzeit](https://www.m365.fm/entity/setup-time/) |
| TEEP | Total Effective Equipment Performance = OEE × Belegung |

## FAQ: Total Productive Maintenance und OEE

### Was ist TPM einfach erklärt?

TPM ist eine Art, ein Werk zu führen, in der sich alle um die Anlagen kümmern, nicht nur die Instandhaltungsabteilung. Werker halten ihre Maschinen sauber, inspiziert und geschmiert und melden Probleme früh; die Instandhaltung plant ihre Arbeit und beseitigt Ursachen; die Technik kauft Anlagen, die leicht instand zu halten sind. Ziel sind keine Ausfälle, keine Kurzstillstände, keine Fehler und keine anlagenbedingten Unfälle [6][21].

### Wofür steht TPM in der Produktion?

Für Total Productive Maintenance. In anderen Zusammenhängen kann TPM etwas anderes bedeuten (zum Beispiel Trusted Platform Module in Computern); ergänzen Sie deshalb bei der Suche nach der Bedeutung in der Fertigung "Instandhaltung" oder "OEE".

### Was sind die 8 Säulen von TPM?

Fokussierte Verbesserung, autonome Instandhaltung, geplante Instandhaltung, Qualitätsinstandhaltung, Anlaufmanagement neuer Anlagen, Aus- und Weiterbildung, Arbeitssicherheit, Gesundheit und Umwelt sowie Office TPM (administratives TPM), alle auf einem Fundament aus 5S. Das JIPM behandelt die ersten vier als Pflicht, weil sie direkt auf Verluste und OEE wirken [1].

### Was ist der Unterschied zwischen TPM und OEE?

TPM ist das Verbesserungssystem; die OEE ist die Kennzahl, die seine Wirkung auf die Anlagen zeigt. Die OEE misst, wie viel der geplanten Produktionszeit Gutteile mit idealer Geschwindigkeit erzeugt hat, und ihre Aufschlüsselung in sechs Verluste zeigt den TPM-Teams, wo sie ansetzen müssen [8][9].

### Wie berechnet man die OEE?

OEE = Verfügbarkeit × Leistung × Qualität, oder in einem Schritt: Gutmenge × ideale Taktzeit ÷ geplante Produktionszeit. Beispiel: 3.887 Gutteile × 0,25 Minuten ÷ 1.320 Minuten = 73,6 % (siehe das [Rechenbeispiel](#oee-berechnen-rechenbeispiel-mit-den-sechs-großen-verlusten)).

### Was sind die sechs großen Verluste?

Ausfälle sowie Rüsten und Einrichten (Verfügbarkeitsverluste), Kurzstillstände und verringerte Geschwindigkeit (Leistungsverluste) sowie Ausschuss/Nacharbeit und Anlaufverluste (Qualitätsverluste) [8].

### Was ist ein guter OEE-Wert?

Eine allgemeingültige Antwort gibt es nicht. 85 % werden oft als Weltklasse bezeichnet [21], aber die Zuschreibung an Nakajima ließ sich nicht bestätigen, und die Forschung fand typische Werte um 55 % [9]. Setzen Sie Ziele aus Ihrer eigenen Basis, aus der Nachfrage und aus den Minuten, die Sie bei Ihren größten Verlusten abbauen können.

### Ist die OEE eine Kennzahl (KPI)?

Ja. ISO 22400-2, die internationale Norm für Leistungskennzahlen im Manufacturing Operations Management, definiert die OEE als eine ihrer Kennzahlen [11]. In einem TPM-Programm ist die OEE die wichtigste Ergebniskennzahl je Maschine; Prozesskennzahlen wie Erledigung der Fehlerkarten und Termintreue der Wartung zeigen, ob die Routinen, die die OEE bewegen, vorhanden sind.

### Kann die OEE über 100 % liegen?

Nein. Eine OEE von 100 % ist perfekte Produktion: nur Gutteile, mit idealer Taktzeit, ohne Stillstandszeit. Ein Wert über 100 % oder ein Leistungsfaktor über 100 % bedeutet, dass die ideale Taktzeit zu langsam angesetzt ist oder die Stückzahlen falsch sind; es ist per Definition ein Datenfehler [22].

### Wie kann man die OEE verbessern?

Die Verluste in Minuten messen, in einem Pareto sortieren und den größten zuerst angehen. Ausfälle verlangen die Wiederherstellung des Grundzustands und geplante Instandhaltung, Kurzstillstände autonome Instandhaltung und Fehlerkarten, Rüstverluste [SMED](https://www.m365.fm/learn/smed-ruestzeitreduzierung/). Verbessern Sie die OEE an einer Maschine, bevor Sie die Methode ausrollen, und prüfen Sie, dass die gewonnene Zeit zum Produzieren genutzt wird, sonst bewegt sich die OEE nicht (siehe [fokussierte Verbesserung](#fokussierte-verbesserung-zuerst-den-größten-verlust-angehen)).

### Was ist autonome Instandhaltung?

Die TPM-Säule, in der Werker in sieben Schritten die Grundpflege der Anlagen übernehmen: Grundreinigung und Inspektion, Beseitigung von Verschmutzungsquellen und schwer zugänglichen Stellen, vorläufige Standards für Reinigen, Inspizieren, Schmieren und Nachziehen, Schulung zur Gesamtinspektion, autonome Inspektion, Standardisierung und Selbstmanagement [26][3].

### Was ist der Unterschied zwischen TPM und vorbeugender Instandhaltung?

Vorbeugende Instandhaltung ist eine Instandhaltungstechnik: geplante Aufgaben, die die Instandhaltung ausführt, um bekannte Ausfälle zu verhindern. TPM ist ein werksweites System, das die vorbeugende Instandhaltung in seiner Säule geplante Instandhaltung enthält und um die Beteiligung der Werker, die Verlustmessung und die strukturierte Verbesserung ergänzt. Historisch ist TPM aus der amerikanischen vorbeugenden Instandhaltung hervorgegangen [7][2].

### Was bedeuten TBM und CBM bei TPM?

TBM steht für zeitbasierte Instandhaltung (Time-Based Maintenance): Aufgaben in festen Intervallen, etwa ein Filterwechsel alle 500 Betriebsstunden. CBM steht für zustandsorientierte Instandhaltung (Condition-Based Maintenance): Aufgaben, die ein gemessener Zustand auslöst, etwa Schwingung, Temperatur oder Ölanalyse. Beide gehören zur Säule geplante Instandhaltung, die zuerst ein zeitbasiertes System aufbaut und zustandsorientierte Instandhaltung dort ergänzt, wo sich die Ausfallart ankündigt und die Anlage kritisch genug ist (siehe [geplante Instandhaltung](#geplante-instandhaltung-vom-feuerlöschen-zum-system)).

### Was ist der Unterschied zwischen TPM und TQM?

TQM konzentriert sich auf die Qualität von Produkten und Prozessen im ganzen Unternehmen; TPM konzentriert sich auf die Anlagen und ihre Verluste. Beide setzen auf Mitarbeiterbeteiligung und strukturierte Problemlösung. In der Studie von McKone, Schroeder und Cua mit 97 Werken gehörten TQM, JIT und Praktiken der Mitarbeiterbeteiligung zu den Managementfaktoren, die erklärten, wie weit TPM umgesetzt war [16].

### Wie lange dauert eine TPM-Einführung?

Rechnen Sie mit einem Pilot in den ersten sechs Monaten und zwei bis drei Jahren, bis die Kernsäulen im ganzen Werk laufen. Das Kaizen Institute beschreibt Phasen von 6 bis 12, 12 bis 24 und etwa 12 Monaten [15]. Die Vorbereitung auf einen JIPM-Preis dauert meist länger. [unbelegt: Keine Studie nennt eine typische Dauer.]

### Welche Rolle spielt 5S bei TPM?

5S ist das Fundament. Ohne sauberen und geordneten Arbeitsplatz bleiben Abweichungen verborgen; aus "Säubern" wird das Reinigen als Inspektion, und das ist Schritt 1 der autonomen Instandhaltung.

### Gilt Lockout/Tagout für die autonome Instandhaltung?

Oft ja, jedenfalls in den USA. 29 CFR 1910.147 der OSHA gilt für Wartung und Instandhaltung; kleine Wartungsarbeiten sind nur ausgenommen, wenn sie routinemäßig, wiederkehrend und fester Bestandteil der Produktion sind und mit alternativen Maßnahmen ausgeführt werden, die wirksamen Schutz bieten [14]. Die Grundreinigung hinter Schutzeinrichtungen braucht vollständiges Lockout/Tagout.

### Ist TPM nur etwas für die Produktion?

TPM hat in der Fertigung begonnen und passt am besten dort, wo Anlagen die Ausbringung bestimmen: diskrete Fertigung, Prozessindustrie, Verpackung, Versorgungsbetriebe und Logistikzentren mit automatisierten Anlagen. Office TPM überträgt das Verlustdenken auf unterstützende Prozesse.

### Was bedeutet TEEP und wann sollte man sie verwenden?

Total Effective Equipment Performance = OEE × Belegung, mit Belegung = geplante Produktionszeit ÷ Kalenderzeit [10]. Verwenden Sie sie für Kapazitäts- und Investitionsentscheidungen, weil sie ungenutzte Kalenderzeit zeigt.

### Wie misst man den Erfolg von TPM?

Mit OEE und Verlustwasserfall als Ergebnis, MTBF, MTTR und Instandhaltungskosten pro Einheit als Zuverlässigkeits- und Kostenergebnis sowie mit vorlaufenden Prozesskennzahlen wie Einhaltung der Reinigungs- und Inspektionsroutine, Erledigung der Fehlerkarten, Termintreue der Wartung und Anteil geplanter Instandhaltung.

### Können kleine Hersteller TPM einführen?

Ja. Beginnen Sie mit einer Maschine, Papierprotokollen und den ersten drei Schritten der autonomen Instandhaltung. In den USA unterstützen NIST-MEP-Zentren in jedem Bundesstaat und in Puerto Rico kleine und mittlere Hersteller mit Leistungen zu Lean und Prozessverbesserung [27][28].

## Fazit und erste Schritte

Total Productive Maintenance macht aus der Anlagenpflege statt einer Spezialistenaufgabe eine Routine des ganzen Werks. Die Logik ist einfach: die sechs großen Verluste messen, die Grundbedingungen wiederherstellen, die Werker sie erhalten lassen, die Instandhaltung planen und vorbeugen lassen und den größten Verlust mit einem fokussierten Team beseitigen. Die OEE ist die Anzeigetafel, die das sichtbar macht, und ihr Wert liegt in den Minuten je Verlust, nicht im Prozentwert der Überschrift.

Das Rechenbeispiel zeigt, was das in Zahlen bedeutet: Eine Spritzgießmaschine mit 73,6 % OEE hat pro Tag 100 Minuten Rüsten, 84 Minuten Kurzstillstände und 70 Minuten Ausfälle, die sich nacheinander angehen lassen. Ob das Ergebnis Geld wert ist, hängt davon ab, ob die Maschine ein Engpass ist, und der Business Case sollte das ehrlich sagen. Die Grenzen sind real: Die OEE lässt sich schönen, TPM dauert Jahre und bleibt oft stecken, und Werker machen nur mit, wenn sie Zeit, Sicherheit und eine Reaktion auf ihre Fehlerkarten bekommen.

**Ihre ersten Schritte in den nächsten 30 Tagen**

- [ ] Eine Pilotmaschine wählen, idealerweise einen Engpass mit sichtbaren Verlusten
- [ ] Das OEE-Definitionsblatt schreiben (Zeitmodell, ideale Taktzeit, Schwelle, Zählpunkte) und mit Produktion, Instandhaltung und Controlling abstimmen
- [ ] Ein Stillstandsprotokoll auf Papier je Schicht mit dem zweistufigen Gründekatalog starten
- [ ] Die OEE zwei Wochen lang aus Summen berechnen und den Verlustwasserfall in Minuten zeichnen
- [ ] Jede geplante Aufgabe der autonomen Instandhaltung mit EHS prüfen und für Lockout/Tagout den Gruppen A, B und C zuordnen
- [ ] Gewerkschaft bzw. Arbeitnehmervertretung über die Aufgabengrenze und die Position zur Beschäftigungssicherung informieren
- [ ] Den Tag der Grundreinigung für den Pilot einplanen, mit fertigen Lockout-Verfahren und Fehlerkarten
- [ ] Den Werkscontroller bitten, Basis und Nutzenregeln freizugeben
- [ ] Prüfen, ob das NIST-MEP-Zentrum Ihres Bundesstaats Schulung oder ein Assessment für Ihren Pilot anbietet (US-Kontext) [27]

---

## Weiterlesen auf m365.fm

**Glossarbegriffe (Entities)**
[Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [5S](https://www.m365.fm/entity/5s/) · [SMED](https://www.m365.fm/entity/smed/) · [Rüstzeit](https://www.m365.fm/entity/setup-time/) · [Kurzstillstände](https://www.m365.fm/entity/micro-stops/) · [Zykluszeit](https://www.m365.fm/entity/cycle-time/) · [Poka Yoke](https://www.m365.fm/entity/poka-yoke/) · [Standardarbeit](https://www.m365.fm/entity/standard-work/) · [Stufenbesprechung (Tier Meeting)](https://www.m365.fm/entity/tier-meeting/) · [A3-Problemlösung](https://www.m365.fm/entity/a3-problem-solving/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Leistungskennzahl (KPI)](https://www.m365.fm/entity/key-performance-indicator/)

**Podcast-Folge**
- [Predictive Maintenance on Azure for Manufacturers: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/) (englisch)

**Verwandte Leitfäden**
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/) (OEE im Kreis aller Werkskennzahlen, Verdichtung der OEE, Power BI/DAX)
- [Lean Management](https://www.m365.fm/learn/lean-management/)
- [SMED und Rüstzeitreduzierung](https://www.m365.fm/learn/smed-ruestzeitreduzierung/) (geplant)
- [5S-Methode und visuelles Management](https://www.m365.fm/learn/5s-methode-visuelles-management/) (geplant)
- [Predictive Maintenance und IIoT](https://www.m365.fm/learn/predictive-maintenance-iiot/) (geplant)
- [Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant)
- [Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant)
- [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant)
- [OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant)
- [Shop Floor Management](https://www.m365.fm/learn/shop-floor-management/)
- [Operational Excellence](https://www.m365.fm/learn/operational-excellence/)
- [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)
- [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/)
- [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/)

**Verwandte Vertiefungen (geplant)**
- [Poka Yoke](https://www.m365.fm/learn/lean-management/poka-yoke/) (geplant)
- [PDCA-Zyklus](https://www.m365.fm/learn/lean-management/pdca-zyklus/) (geplant)
- [A3-Methode](https://www.m365.fm/learn/lean-management/a3-methode/) (geplant)
- [Kaizen](https://www.m365.fm/learn/lean-management/kaizen/) (geplant)
- [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) (geplant)
- [Andon](https://www.m365.fm/learn/shop-floor-management/andon/) (geplant)
- [Qualifikationsmatrix und Mitarbeiterqualifizierung](https://www.m365.fm/learn/operational-excellence/qualifikationsmatrix/) (geplant)
- [Nachhaltige Produktion](https://www.m365.fm/learn/operational-excellence/nachhaltige-produktion/) (geplant)

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Lean Management, Instandhaltung und Anlageneffektivität, Produktionskennzahlen und die digitale Transformation der Produktion. [Redaktion: Rolle, Kurzbio und Foto ergänzen.]

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Quellen

Alle Quellen abgerufen am 20. November 2026. Mit (*) markierte Quellen wurden für diesen Artikel an diesem Tag durch Abruf geprüft; mit (†) markierte Quellen wurden am selben Tag für die Schwesterleitfäden Produktionskennzahlen bzw. Lean Management geprüft und mit demselben Wortlaut zitiert, weil das Abrufbudget erschöpft war, bevor sie für diesen Artikel erneut abgerufen werden konnten (siehe Prüfhinweise der englischen Fassung, Punkt 3).

1. (*) Japan Institute of Plant Maintenance (JIPM), TPM Award Secretariat: TPM優秀賞 制度改訂のご案内 [Hinweise zur Überarbeitung des Systems des Award for TPM Excellence], gültig ab Geschäftsjahr 2024 (japanisch). https://www.jipm.or.jp/up_file/1688429795-799981.pdf
2. (*) Williamson, B.: Remembering the Father of TPM. Maintenance Technology, Juni 2015, S. 6. https://www.nxtbook.com/atp/MaintenanceTechnology/MTJune2015/index.php?startid=6
3. (*) Ginder, A.; Robinson, A.; Robinson, C. J.: Implementing TPM. Productivity Press (Ausgabe August 2020, ISBN 9781000162073), Kapitel 1. O'Reilly Learning. https://www.oreilly.com/library/view/implementing-tpm/9781000162073/08-9781000162073-ch01.xhtml
4. (*) Seiichi Nakajima. Wikipedia (englisch). https://en.wikipedia.org/wiki/Seiichi_Nakajima
5. (*) Total productive maintenance. Wikipedia (englisch). https://en.wikipedia.org/wiki/Total_productive_maintenance
6. (*) Total Productive Maintenance. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/total-productive-maintenance/
7. (*) Kubota, H.: Explore the Origins of TPM: Grope for the Principles of Immutability and Fluidity (japanisch). Journal of the Japanese Society for Quality Control (Quality), Bd. 44, Nr. 1 (2014), S. 19–24. DOI: 10.20684/quality.44.1_19. https://www.jstage.jst.go.jp/article/quality/44/1/44_KJ00009001846/_article/-char/en
8. (*) Muchiri, P.; Pintelon, L.: Performance measurement using overall equipment effectiveness (OEE): literature review and practical application discussion. International Journal of Production Research, Bd. 46, Nr. 13 (2008), S. 3517–3535. DOI: 10.1080/00207540601142645. https://scispace.com/pdf/performance-measurement-using-overall-equipment-3udssbfefm.pdf (bibliografische Angaben über Crossref erneut bestätigt am 20. November 2026)
9. (*) Ljungberg, Ö.: Measurement of overall equipment effectiveness as a basis for TPM activities. International Journal of Operations & Production Management, Bd. 18, Nr. 5 (1998), S. 495–507. DOI: 10.1108/01443579810206334. Nachweis: https://bvbvf1.bib-bvb.de/vufind/PrimoRecord/cdi_proquest_miscellaneous_29379575
10. (†) Overall equipment effectiveness. Wikipedia (englisch), mit Verweisen auf Nakajima und Hartmann (TEEP). https://en.wikipedia.org/wiki/Overall_equipment_effectiveness
11. (†) ISO 22400-2:2014 Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions. International Organization for Standardization. https://www.iso.org/standard/54497.html
12. (*) Kang, N.; Zhao, C.; Li, J.; Horst, J. A.: A hierarchical structure of key performance indicators for operation management and continuous improvement in production systems. International Journal of Production Research, Bd. 54, Nr. 21 (2016), S. 6333–6350. DOI: 10.1080/00207543.2015.1136082 (über Crossref bestätigt am 20. November 2026). NIST-Fassung: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=919754
13. (*) Lean Thinking and Methods – TPM. US Environmental Protection Agency (Seite zuletzt aktualisiert am 21. Oktober 2026). https://www.epa.gov/lean/lean-thinking-and-methods-tpm
14. (*) 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147
15. (*) Total Productive Maintenance (TPM): Principles, pillars, and implementation. Kaizen Institute (Beratung). https://kaizen.com/insights/tpm-principles-pillars-implementation/
16. (*) McKone, K. E.; Schroeder, R. G.; Cua, K. O.: Total productive maintenance: a contextual view. Journal of Operations Management, Bd. 17, Nr. 2 (1999), S. 123–144. DOI: 10.1016/S0272-6963(98)00039-4. https://experts.umn.edu/en/publications/total-productive-maintenance-a-contextual-view/
17. (*) Ahuja, I. P. S.; Khamba, J. S.: Total productive maintenance: literature review and directions. International Journal of Quality & Reliability Management, Bd. 25, Nr. 7 (2008), S. 709–756 (Seitenzahlen über Crossref bestätigt am 20. November 2026). DOI: 10.1108/02656710810890890. https://www.doi.org/10.1108/02656710810890890 (Titel und DOI geprüft; Volltext nicht eingesehen)
18. (*) Thomas, D. S.: The Costs and Benefits of Advanced Maintenance in Manufacturing. NIST Advanced Manufacturing Series 100-18, National Institute of Standards and Technology, April 2018. DOI: 10.6028/NIST.AMS.100-18. https://nvlpubs.nist.gov/nistpubs/ams/NIST.AMS.100-18.pdf
19. (*) Best Practices, Metrics & Guidelines (SMRP Best Practices, 7. Auflage). Society for Maintenance & Reliability Professionals. https://smrp.org/learning-resources/smrp-library/best-practices-metrics-guidelines/
20. (*) Body of Knowledge (SMRP Guide to the Maintenance and Reliability Body of Knowledge). Society for Maintenance & Reliability Professionals. https://smrp.org/learning-resources/smrp-library/body-of-knowledge/
21. (*) TPM (Total Productive Maintenance). Vorne Industries, leanproduction.com (Herstellerseite; Benchmarks ohne Quelle). https://leanproduction.com/tpm
22. (*) OEE (Overall Equipment Effectiveness). Vorne Industries, leanproduction.com (Herstellerseite). https://leanproduction.com/oee
23. (*) Trout, J.: Total Productive Maintenance: An Overview. Reliable Plant (Noria Corporation), ohne Datum; zitiert Aberdeen Research und eine Umfrage eines Manufacturing Research Center. https://www.reliableplant.com/Articles/Print/26210
24. (*) Zepf, P. J.: How to Calculate Overall Equipment Effectiveness: A Practical Guide. Automation World, 2. August 2013. https://www.automationworld.com/factory/plant-maintenance/article/13309925/how-to-calculate-overall-equipment-effectiveness-a-practical-guide
25. (*) Lazim, H. M.; Ramayah, T.; Ahmad, N.: Total Productive Maintenance and Performance: A Malaysian SME Experience. International Review of Business Research Papers, Bd. 4, Nr. 4 (2008), S. 237–250. https://core.ac.uk/download/19914269.pdf
26. (*) Autonomous Maintenance: Complete Guide (Abschnitt "The Seven Steps of Jishu Hozen (JIPM Standard)"). Reliable (reliamag.com). https://reliamag.com/guides/autonomous-maintenance/
27. (†) Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement
28. (†) Manufacturing Extension Partnership (MEP). National Institute of Standards and Technology (NIST). https://www.nist.gov/mep
29. (*) Electromation, Inc. v. National Labor Relations Board, 35 F.3d 1148 (7th Cir. 1994). Justia. https://law.justia.com/cases/federal/appellate-courts/F3/35/1148/605691/ (erneut geöffnet am 20. November 2026: Das Gericht bestätigte die Anordnung des NLRB, dass die Aktionsausschüsse vom Arbeitgeber beherrschte Arbeitnehmerorganisationen unter Verstoß gegen Section 8(a)(2) und (1) waren; das Gericht beschränkte seine Entscheidung auf die betroffenen Ausschüsse)
30. (†) Ergonomics. Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/ergonomics
31. (†) MTConnect Institute: MTConnect Standard, ANSI/MTC1.4-2018, Part 1.0 Overview and Fundamentals. https://docs.mtconnect.org/ANSI_MTC1_4-2018.pdf ; über MTConnect: https://www.mtconnect.org/about
32. (†) OPC 10030: ISA-95 Common Object Model, Abschnitt 4.2.3 ISA-95. OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3
33. (†) ISA-95 Standard: Enterprise-Control System Integration. International Society of Automation (ISA). https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
34. (†) World-Class OEE: What Is It and How Close Are You Actually? TEEPTRAK (Herstellerseite, Benchmarks aus eigenen Daten). https://teeptrak.com/en/world-class-oee-benchmark/
35. Nakajima, S.: Introduction to TPM: Total Productive Maintenance. Productivity Press, 1988 (bibliografische Angaben laut [4]; Buch nicht eingesehen).
36. Nakajima, S.: TPM Development Program: Implementing Total Productive Maintenance. Productivity Press, 1989 (bibliografische Angaben laut [4]; Buch nicht eingesehen).
37. (*) JIPM Awards (TPM Excellence Award recipients 1995–2016). Yamaha Motor Co., Ltd. https://global.yamaha-motor.com/about/technology/awards/awards_jipm.html

# Prüfhinweise für die Redaktion

Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.

**Abgrenzung zum Pillar Produktionskennzahlen:** Der Pillar `produktionskennzahlen` rechnet die OEE an "Linie 3" (75,9 %); dieser Artikel verwendet bewusst ein anderes Beispiel (IMM-12, 73,6 %) und konzentriert sich auf Verluste und Verbesserungspraxis. Beide verwenden dieselben Faktordefinitionen (Nacharbeit zählt als Fehler, Verdichtung aus Summen, gleiche Einordnung des 85-%-Werts) und verlinken sich gegenseitig. Wenn die Search Console nach etwa drei Monaten zeigt, dass sich beide URLs die Impressionen für "OEE berechnen" teilen, den OEE-Abschnitt im Kennzahlen-Pillar kürzen und für die Verlustanalyse hierher verweisen.

**Herstellerangaben (im Text gekennzeichnet):**
- Vorne (leanproduction.com) [21][22]: Benchmarks 85 % / 60 % / 40 %, Kurzstillstandsschwelle unter fünf Minuten, Teams von vier bis sechs Personen, zwei Wochen Daten, "Best of the Best"-Ziel.
- Kaizen Institute [15]: 16 Verlustarten in drei Gruppen, Schrittzahlen je Säule, Phasendauern der Roadmap (Beratungsdarstellung).
- TEEPTRAK [34]: Herstellerbenchmarks aus eigenen Daten; nur als Beispiel für eine nicht offengelegte Methode zitiert.
- Reliable Plant [23]: Umfragezahlen (27 % / 6 % / 5 %) aus zweiter Hand.
- EPA [13]: Schätzung von 15–25 % Effizienzgewinn ohne Methodenangabe; gekennzeichnet.

**[unbelegt]-Stellen (6):** Zuschreibung der 85 % an Nakajima; einzelne Bezeichnungen der 16 Verlustarten; Erledigungsziele für Fehlerkarten; Herkunft der P-M-Analyse; Dauern der Roadmap; typische Einführungsdauer in der FAQ.

**Vor Veröffentlichung erneut prüfen:** [10], [11], [27], [28], [30]–[34] (mit † markiert). Den OSHA-Absatz [14] sollte die Arbeitssicherheit im vollen Wortlaut lesen; die Einteilung A/B/C ist eine praktische Auslegung, keine Rechtsberatung. Den Punkt zu Mitarbeiterausschüssen (*Electromation* [29]) arbeitsrechtlich prüfen lassen.

**Rechenbeispiele:** Alle IMM-12-Zahlen sind beispielhaft und nachgerechnet (87,1 %; 88,0 %; 96,0 %; OEE 73,6 %; nachher 93,2 % / 92,7 % / 97,6 %, OEE 84,3 %; TEEP 67,5 % / 48,2 %; MTBF 410,7 min, MTTR 25,0 min, 94,3 %; 52,8 Teile je OEE-Punkt; 281,50 USD/Tag, 70.375 USD/Jahr; Amortisation 5,97 Monate; 12,7 % weniger geplante Zeit). Im Layout als Beispielkästen absetzen. Die Schließkraft "300-ton" steht im Original ohne metrische Angabe und wurde als "300 t" übernommen; prüfen, ob US-Tonnen (ca. 272 t) gemeint sind.

**Interne Links:** Alle `/en/learn/`-Links wurden auf die deutschen URLs laut Slug-Map umgestellt. Neue Pillars und Cluster sind mit "(geplant)" markiert; bei den bereits bestehenden deutschen Pillars (Lean Management, Produktionskennzahlen, Shop Floor Management, Operational Excellence, Wertstromanalyse, Digital Twin, Manufacturing IT mit Azure) entfällt der Zusatz. Entity-Links (`/entity/...`) und die Podcast-Folge (englisch) bleiben unverändert. Sprungmarken im Inhaltsverzeichnis gegen die vom CMS erzeugten Anker prüfen (Umlaute und ß in Ankern, z. B. `#die-sechs-großen-verluste-und-die-16-verlustarten`).

**iFAKT:** Kein iFAKT-Abschnitt (kein echter Produktbezug). Offenlegung nur in der Autorenbox, exakt "Hinweis: Der Autor arbeitet bei der iFAKT GmbH." Kein Sponsoring-Hinweis, iFAKT zahlt nicht für die Veröffentlichung.

**hreflang:** `de-DE` https://www.m365.fm/learn/tpm-oee/ <-> `en-US` https://www.m365.fm/en/learn/tpm-oee/. Die englische Fassung muss beim Livegang das Gegenstück erhalten (dort bisher "self-referencing canonical only, no hreflang pair").

**JSON-LD-Vorschlag:**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "headline": "Total Productive Maintenance (TPM) und OEE: 8 Säulen, Verluste, OEE-Berechnung und Einführung",
      "inLanguage": "de-DE",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-26",
      "dateModified": "2026-11-26",
      "mainEntityOfPage": "https://www.m365.fm/learn/tpm-oee/",
      "about": [
        {"@type": "Thing", "name": "Total Productive Maintenance", "sameAs": "https://www.m365.fm/entity/total-productive-maintenance/"},
        {"@type": "Thing", "name": "Gesamtanlageneffektivität (OEE)"}
      ],
      "mentions": [
        {"@type": "Thing", "name": "5S", "sameAs": "https://www.m365.fm/entity/5s/"},
        {"@type": "Thing", "name": "SMED", "sameAs": "https://www.m365.fm/entity/smed/"},
        {"@type": "Thing", "name": "Kurzstillstände", "sameAs": "https://www.m365.fm/entity/micro-stops/"},
        {"@type": "Thing", "name": "Theory of Constraints", "sameAs": "https://www.m365.fm/entity/theory-of-constraints/"}
      ]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "de-DE",
      "mainEntity": [
        {"@type": "Question", "name": "Was sind die 8 Säulen von TPM?", "acceptedAnswer": {"@type": "Answer", "text": "Fokussierte Verbesserung, autonome Instandhaltung, geplante Instandhaltung, Qualitätsinstandhaltung, Anlaufmanagement neuer Anlagen, Aus- und Weiterbildung, Arbeitssicherheit, Gesundheit und Umwelt sowie Office TPM, auf einem Fundament aus 5S."}}
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Start", "item": "https://www.m365.fm/"},
        {"@type": "ListItem", "position": 2, "name": "Learn", "item": "https://www.m365.fm/learn/"},
        {"@type": "ListItem", "position": 3, "name": "TPM und OEE", "item": "https://www.m365.fm/learn/tpm-oee/"}
      ]
    }
  ]
}
```

Alle 21 FAQ-Fragen in `FAQPage` aufnehmen (Antworten ohne [n]); eine ist als Muster gezeigt. `DefinedTermSet` für das Glossar optional.

**Empfohlene Grafiken:** (1) TPM-Haus: 5S-Fundament, acht Säulen, Dach mit null Ausfällen / null Fehlern / null Unfällen (SVG); (2) OEE-Verlustwasserfall für IMM-12 vorher und nachher, Minuten je Verlust; (3) sieben Schritte der autonomen Instandhaltung als Treppe mit Ausstiegskriterien; (4) Lockout/Tagout-Entscheidungsbaum für die Aufgaben der Routine (Gruppen A, B, C); (5) 36-Monats-Roadmap mit Stage-Gates; (6) Beispiel einer CILS-Karte und einer Fehlerkarte (Foto-Mock-up). Beschriftungen auf Deutsch.

**Für den deutschen Markt prüfen (Aufgabe für die Fachprüfung, nicht als Fakt in den Text übernommen):**
- Abschnitt "TPM und Arbeitssicherheit", Lockout/Tagout-Gruppen A/B/C, FAQ "Gilt Lockout/Tagout ...": Der Text beschreibt US-Recht (OSHA 29 CFR 1910.147). Für Deutschland prüfen: Betriebssicherheitsverordnung (BetrSichV), ArbSchG (Gefährdungsbeurteilung), DGUV-Regeln und -Vorschriften, Maschinenrichtlinie bzw. Maschinenverordnung (EU) 2023/1230, ggf. ergänzender Absatz zum deutschen Rechtsrahmen.
- Ergonomie: OSHA-Risikofaktoren [30]; für Deutschland ggf. Verweis auf Gefährdungsbeurteilung psychischer und physischer Belastungen und DGUV-Informationen.
- Abschnitt "Gewerkschaften, Mitarbeiterausschüsse": US-Kontext (NLRA Section 8(a)(2), *Electromation*). Für Deutschland prüfen: Mitbestimmung des Betriebsrats nach §87 BetrVG (u. a. Arbeitszeit, technische Einrichtungen zur Leistungs- und Verhaltenskontrolle bei OEE-Erfassung und Maschinendaten, Arbeitsschutz), ggf. §90/§91 BetrVG; Rolle von Tarifverträgen und Betriebsvereinbarungen.
- OEE-Datenerfassung und Dashboards mit Personenbezug (Werker wählt Grund am Terminal): Datenschutz (DSGVO, §26 BDSG) und Betriebsvereinbarung prüfen.
- NIST-MEP-Zentren (FAQ kleine Hersteller, erste Schritte): US-Angebot; für Deutschland ggf. Hinweis auf vergleichbare Förderangebote (z. B. Mittelstand-Digital-Zentren) als redaktionelle Ergänzung prüfen.
- Beträge in USD und Rechenbeispiele bleiben wie im Original.
