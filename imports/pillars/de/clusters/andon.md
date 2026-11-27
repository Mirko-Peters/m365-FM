# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Andon-System: Aufbau, Eskalationsmatrix und Kennzahlen (54 Zeichen) |
| Meta-Description | So funktioniert ein Andon-System: Reißleine und Festpositionsstopp, Eskalationsmatrix, Rechnung zur Reaktionszeit, Regeln gegen Alarmflut und KPIs. (147 Zeichen) |
| Slug | `/learn/shop-floor-management/andon/` (vollständige URL: https://www.m365.fm/learn/shop-floor-management/andon/) |
| Parent-Pillar | [Shopfloor Management](https://www.m365.fm/learn/shop-floor-management/) |
| Hauptkeyword | Andon-System |
| Nebenkeywords | Andon, Andon-Leine, Andon-Reißleine, Andon-Tafel, Andon Board, Andon Farben, digitales Andon, Andon Eskalation, Eskalationsstufen Produktion, Andon Reaktionszeit, Festpositionsstopp, Jidoka, Band anhalten, Andon Lean, Andon Kennzahlen, Alarmflut Produktion, Störmeldesystem |
| Suchintention | Informational (was ist Andon, wie funktioniert es) mit praktischem und kommerziellem Anteil (Eskalation gestalten, digitale Andon-Systeme) |
| Wortzahl | Ziel 3.000 bis 5.000 Wörter H1 bis Fazit. Tatsächlich H1 bis Fazit (`wc -w`, inkl. FAQ, ohne Weiterlesen): **4.740 Wörter** (englische Fassung: 4.931) |
| Sprachversion | Deutsch (`de-DE`). hreflang-Paar: `de-DE` https://www.m365.fm/learn/shop-floor-management/andon/ <-> `en-US` https://www.m365.fm/en/learn/shop-floor-management/andon/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus; deutsche Suchbegriffe wie "Andon-System", "Andon-Leine" und "Eskalationsmatrix" sind dabei gesondert zu prüfen.

# Andon-System: So gelingen Signale, Eskalation und Reaktion

*Stand: 20. November 2026*

> **Kurzantwort:** Ein Andon-System ist ein Signal- und Reaktionssystem, das den Zustand der Abläufe auf einen Blick zeigt und in dem Moment Hilfe ruft, in dem etwas schiefgeht. Ein Werker zieht an einer Leine oder drückt einen Taster, oder eine Maschine löst das Signal automatisch aus, und eine Leuchte oder Tafel zeigt, wo das Problem ist [1]. Was Andon wirksam macht, ist nicht die Leuchte, sondern die Reaktion: ein Teamleiter, der innerhalb des Arbeitstakts eintrifft, ein fester Punkt, an dem das Band anhält, wenn das Problem nicht gelöst ist [1], und ein Eskalationspfad, der mit der Zeit mehr Hilfe hinzuzieht.

Dieser Artikel vertieft unseren Leitfaden zum [Shopfloor Management](https://www.m365.fm/learn/shop-floor-management/). Die Pillar ordnet Andon zwischen den geplanten Regelrunden ein: Die Runde schaut auf gestern und plant heute, das Andon regelt das Jetzt. Hier gestalten wir das Andon selbst: Signale, Rollen, Eskalationszeiten, Kennzahlen und das digitale System dahinter.

### Das Wichtigste in Kürze

- Andon kommt vom japanischen Wort für eine Papierlaterne [7] und ist Teil von Jidoka, Toyotas Prinzip, bei Abweichungen anzuhalten und sie zu beheben, statt Fehler weiterzugeben [2][1].
- In Toyotas Endmontage hält das Ziehen der Leine das Band nicht sofort an; das Band läuft bis zur nächsten festen Position, meist dem Ende des Arbeitsplatzes, und hält nur an, wenn das Problem bis dahin nicht gelöst ist [1][5].
- Die Reaktionskapazität entscheidet alles. Ein BBC-Bericht von 2007 nannte 2.000 Leinenzüge pro Woche im Toyota-Werk in Georgetown, Kentucky, und zwei pro Woche in einem neuen Ford-Werk in Dearborn [6].
- Andon gehört wie ein Alarmsystem gestaltet: Jedes Signal muss eine Reaktion erfordern, jede Rufart hat einen Verantwortlichen und eine Zeitgrenze, und Störsignale werden entfernt. ISA-18.2 bietet dafür ein nützliches Vokabular, auch wenn die Norm für die Prozessindustrie geschrieben ist [8][9].
- Gemessen werden Rufe, Reaktionszeit, Lösungszeit und wiederkehrende Ursachen. Viele Rufe sind anfangs keine schlechte Nachricht; unbeantwortete Rufe schon.

## Inhaltsverzeichnis

1. [Was ist ein Andon-System?](#was-ist-ein-andon-system)
2. [So funktioniert die Andon-Leine bei Toyota: der Festpositionsstopp](#so-funktioniert-die-andon-leine-bei-toyota-der-festpositionsstopp)
3. [Arten von Andon-Signalen](#arten-von-andon-signalen)
4. [Andon-Farben und Arbeitssicherheit](#andon-farben-und-arbeitssicherheit)
5. [Die Reaktion gestalten: Rollen und Eskalationsmatrix](#die-reaktion-gestalten-rollen-und-eskalationsmatrix)
6. [Warum die Reaktionszeit explodiert: die Warteschlangenrechnung](#warum-die-reaktionszeit-explodiert-die-warteschlangenrechnung)
7. [Alarmflut vermeiden: Lehren aus ISA-18.2](#alarmflut-vermeiden-lehren-aus-isa-182)
8. [Andon-Kennzahlen](#andon-kennzahlen)
9. [Die Wirtschaftlichkeit von Andon](#die-wirtschaftlichkeit-von-andon)
10. [Digitales Andon: Architektur und Integration](#digitales-andon-architektur-und-integration)
11. [Kultur: Das Ziehen der Leine sicher machen](#kultur-das-ziehen-der-leine-sicher-machen)
12. [Einführung in acht Schritten](#einführung-in-acht-schritten)
13. [Typische Fehler](#typische-fehler)
14. [FAQ](#faq-andon-system)
15. [Fazit](#fazit)

## Was ist ein Andon-System?

Das Lean Enterprise Institute definiert Andon als "a visual management tool that highlights the status of operations in an area at a glance" (ein Werkzeug des visuellen Managements, das den Zustand der Abläufe in einem Bereich auf einen Blick zeigt) und das immer dann signalisiert, wenn eine Abweichung auftritt [1]. Ein Andon kann den Produktionsstatus zeigen (welche Maschinen laufen), Abweichungen (Stillstand, Qualitätsprobleme, Werkzeugstörungen, Verzögerungen beim Werker, Materialmangel) und nötige Handlungen wie Rüstvorgänge; viele zeigen auch Soll- gegen Ist-Menge [1].

Das Wort selbst ist ein japanisches Lehnwort für eine Papierlaterne [7]. Die Idee dahinter stammt aus Jidoka. Toyota übersetzt Jidoka als "automation with a human touch" (Automatisierung mit menschlicher Note) und führt es auf Sakichi Toyodas Webstuhl zurück, der "built the capability to make judgments into the machine itself" (die Fähigkeit zu urteilen in die Maschine selbst einbaute) [2]. Wenn eine Anlage stoppt, "the andon (problem display board) lights up to notify workers of the abnormality" (leuchtet das Andon, die Problemanzeigetafel, auf, um die Mitarbeitenden über die Abweichung zu informieren), und an der Montagelinie "the operator can stop the line by pulling the stop cord themselves" (kann der Werker das Band selbst durch Ziehen der Stoppleine anhalten) [2].

Ein Andon-System besteht aus drei Teilen:

| Teil | Was es ist | Typische Form |
|---|---|---|
| Auslöser | das Ereignis, das das Signal auslöst | Reißleine, Taster, Maschinenstörung, Sensor (z. B. langsamer Takt) |
| Signal | was das Problem und seinen Ort zeigt | Hängetafel mit Stationsnummern, Signalsäule, Ton, Bildschirm, mobile Benachrichtigung [1] |
| Reaktion | wer kommt, wie schnell, was entschieden wird | Teamleiter innerhalb des Takts, Eskalation an Meister, Instandhaltung, Qualität, Leitung |

Die meisten Artikel beschreiben die ersten beiden. Am dritten Teil entscheidet sich, ob ein Andon-System funktioniert.

## So funktioniert die Andon-Leine bei Toyota: der Festpositionsstopp

Verbreitet ist die Vorstellung, ein einzelner Toyota-Mitarbeiter könne mit einem Zug das ganze Werk anhalten. In der Endmontage funktioniert es nicht so. Das LEI beschreibt ein "fixed-position stop system that Toyota uses in its final-assembly lines" (Festpositionsstopp-System, das Toyota in seinen Endmontagelinien verwendet) [1]:

1. Ein Werker entdeckt ein Problem und zieht an der Leine. Die Stationsnummer leuchtet auf der Tafel auf, und ein Ton ruft den Teamleiter [1].
2. Das Band läuft weiter, bis das Fahrzeug eine feste Position erreicht, typischerweise das Ende des Arbeitsplatzes [1].
3. Teamleiter und Werker versuchen, das Problem innerhalb des verbleibenden Takts zu beheben. Mark Graban beziffert das Fenster zwischen Zug und Stopp auf etwa 5 bis 30 Sekunden [5].
4. Ist das Problem gelöst, setzt der Teamleiter das Signal zurück, und das Band hält gar nicht an. Wenn nicht, stoppt das Fördersystem an der festen Position [1][5].

An einer festen Position statt sofort anzuhalten, vermeidet, dass andere Stationen mitten in einem Arbeitsschritt gestört werden, was neue Fehler wie unvollständige Montage verursachen könnte [1]. Weil die meisten Probleme innerhalb des Fensters gelöst werden, sind kein Neustart und keine Neusynchronisierung nötig [5]. Graban zitiert außerdem Liker und Meiers *Toyota Way Fieldbook* zu Puffern zwischen Bandabschnitten von nicht mehr als etwa 10 Minuten, wodurch ein Stopp weitgehend auf einen Abschnitt begrenzt bleibt [5]. Wikipedia beschreibt dieselbe Logik als Zwei-Zug-System: Der erste Zug ruft Hilfe, ein zweiter Zug bestätigt, dass das Band weiterlaufen kann [7].

Toyota UK beschreibt die Leine als Werkzeug, mit dem jedes Teammitglied das Band anhalten kann, wenn es eine Gefahr für die Fahrzeugqualität sieht [3]. Laut Wikipedia ersetzt Toyota die Leinen seit 2014 durch Funktaster, um Kabelgewirr und Stolpergefahren zu verringern [7].

**Was das für das eigene Werk bedeutet:** Wer eine Leine installiert, die das Band sofort anhält, und niemand ist frei, um zu reagieren, bekommt entweder sehr viel Stillstand oder, wahrscheinlicher, sehr wenige Leinenzüge. Der Festpositionsstopp funktioniert nur mit jemandem, der innerhalb des Takts eintreffen kann.

## Arten von Andon-Signalen

| Art | Auslöser | Beispiel | Gestaltungshinweis |
|---|---|---|---|
| manuelles Qualitäts-Andon | Werker | Fehler gefunden, Teil passt nicht | muss schnell und anonym genug sein, um ohne Zögern genutzt zu werden |
| manuelles Hilfe-Andon | Werker | Rückstand, unklare Anweisung | getrennt von Qualitätsrufen, damit die richtige Person kommt |
| Material-Andon | Werker oder Sensor | Mindestbestand am Band erreicht | oft mit Kanban verknüpft; siehe [Kanban und Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/) (geplant) |
| Maschinen-Andon | Maschinensteuerung | Störungscode, Stopp, langsamer Takt | braucht Filterung (siehe Alarmflut unten) |
| Instandhaltungs-Andon | Werker oder Maschine | ungewöhnliches Geräusch, Leck, wiederholte Störung | geht mit Anlagennummer an die Instandhaltung |
| Sicherheits-Andon | Werker | Beinaheunfall, erkannte Gefahr | niemals Ersatz für einen Not-Halt |
| Status-Andon | System | läuft, Rüsten, geplanter Stopp | nur Information, keine Reaktion nötig |

Die letzte Zeile ist wichtig. Eine Statusanzeige sagt den Menschen, was passiert; sie ruft niemanden. Status- und Rufsignale auf derselben Leuchte zu mischen, ist einer der häufigsten Gründe, warum Andon-Rufe ignoriert werden.

## Andon-Farben und Arbeitssicherheit

Die meisten Werke nutzen eine Drei-Farben-Logik: Grün für normal, Gelb (oder Bernstein) für ein Problem, das bearbeitet wird, oder angeforderte Hilfe, Rot für Stillstand. Herstellerleitfäden beschreiben dasselbe Schema [13]. Es gibt keinen einheitlichen Standard für Andon-Farben; der Farbcode muss daher vor Ort festgelegt und geschult werden.

Zwei US-amerikanische Sicherheitsvorschriften schränken die Wahl ein:

- OSHA 29 CFR 1910.144 legt Rot für Brandschutz, Gefahr und Stopp fest und verlangt, dass Not-Halt-Leisten an gefährlichen Maschinen rot sind [11]. Gelb ist die Grundfarbe für Vorsicht und physische Gefahren [11]. Rot für "Stillstand" zu verwenden, ist damit vereinbar; Rot für einen routinemäßigen Ruf "Material knapp" verwässert es.
- Ein Andon ist ein Produktionssignal, keine Sicherheitsfunktion. Not-Halt, Lichtvorhänge und andere Schutzeinrichtungen müssen vom Andon unabhängig bleiben. Führt ein Andon-Ruf dazu, dass jemand in eine Maschine greift, müssen die Reaktionsschritte die Energiefreischaltung nach dem Lockout/Tagout-Standard der OSHA enthalten [12] oder eine dokumentierte Begründung, warum die Ausnahme für kleinere Servicearbeiten gilt [12].

| Farbe | Empfohlene Bedeutung | Vermeiden |
|---|---|---|
| Grün | läuft nach Plan | blinkendes Grün für "fast nach Plan" |
| Gelb / Bernstein | Hilfe angefordert, Problem in Bearbeitung, Band läuft noch | Gelb für reine Statusinformation |
| Rot | Band oder Maschine steht | Rot für routinemäßige Material- oder Informationsrufe |
| Blau / Weiß (optional) | Materialruf, Anforderung einer Qualitätsprüfung | Farben ergänzen ohne Schulung und ohne Legende an der Tafel |

## Die Reaktion gestalten: Rollen und Eskalationsmatrix

Eine Eskalationsmatrix legt für jede Rufart fest, wer zuerst reagiert und wer nach wie vielen Minuten hinzukommt. Sie ist das wichtigste Dokument eines Andon-Systems und passt auf eine Seite.

### Beispiel einer Eskalationsmatrix (zur Veranschaulichung, für eine getaktete Montagelinie mit 60-Sekunden-Takt)

| Zeit seit dem Ruf | Qualitätsruf | Materialruf | Maschinen- / Instandhaltungsruf | Sicherheitsruf |
|---|---|---|---|---|
| 0 (Signal) | Teamleiter | Teamleiter / Water Spider (Materialversorger) | Teamleiter | Teamleiter und Meister sofort |
| Taktende (etwa 60 s) | Band hält an fester Position an, wenn nicht gelöst | Band hält an, wenn nicht gelöst | Band hält an, wenn nicht gelöst | Halt, wie es die Gefahr erfordert |
| 3 min | Meister + Qualitätstechniker | Vorarbeiter Materialversorgung | Instandhalter | Sicherheitsfachkraft |
| 10 min | Qualitätsingenieur | Leiter Logistik | Leiter Instandhaltung, Prozessingenieur | Bereichsleiter |
| 30 min | Bereichsleiter, Entscheidung über Sofortmaßnahme | Bereichsleiter | Bereichsleiter, Entscheidung über Ausweichroute | Werksleiter |
| 60 min | Werksleiter informiert | Werksleiter informiert | Werksleiter informiert | nach Ereignisverfahren |

Regeln, damit die Matrix funktioniert:

1. **Jede Stufe hat eine Entscheidung, nicht nur eine Benachrichtigung.** Nach 30 Minuten entscheidet der Bereichsleiter über Sofortmaßnahme oder Umleitung; informiert zu sein, reicht nicht.
2. **Eskalation läuft automatisch.** Überschreitet der Timer die Schwelle, wird die nächste Stufe gerufen, egal ob jemand das für nötig hält. Ermessen ist es, was Eskalation scheitern lässt.
3. **Die Zeiten passen zum Prozess.** Eine getaktete Linie mit 60-Sekunden-Takt braucht eine Reaktion in Sekunden. Eine Bearbeitungszelle mit 20-Minuten-Zyklen und Puffern kann mit längeren Schwellen arbeiten. Die erste Schwelle leitet sich aus Taktzeit und Puffer ab, nicht aus einer Vorlage.
4. **Die Abdeckung außerhalb der Frühschicht ist ausdrücklich geregelt.** Es steht fest, wer jede Rolle in Spät- und Nachtschicht und am Wochenende übernimmt. Ein Eskalationspfad, der an einem leeren Schreibtisch endet, ist kein Pfad.
5. **Jeder Ruf wird mit einem Ursachencode geschlossen.** Ohne ihn lässt sich aus den Rufen nichts lernen (siehe Kennzahlen).
6. **Qualitätsrufe lösen eine Sofortmaßnahme aus.** Hat ein Fehler die Station erreicht, entscheidet der Reagierende, welche Teile seit der letzten guten Prüfung verdächtig sind und wie sie gekennzeichnet und gesperrt werden. Der Cluster zu [Poka Yoke](https://www.m365.fm/learn/lean-management/poka-yoke/) (geplant) zeigt, wie sich verhindern lässt, dass derselbe Fehler erneut entsteht.

**Ungetaktete Linien und Werkstattfertigung.** Ohne bewegtes Band gibt es keine feste Position, aber die Logik bleibt: Die Zeit für die erste Reaktion wird aus dem Zyklus des Auftrags und dem nachgelagerten Puffer abgeleitet, und angehalten wird der Auftrag (nicht die Werkstatt), wenn das Problem in dieser Zeit nicht gelöst ist. Ein "Water Spider" (Materialversorger auf fester Route) ist oft der erste Reagierende bei Materialrufen.

Die Regelrunden der Pillar setzen hier an: Rufe, die eingedämmt, aber nicht an der Wurzel gelöst wurden, kommen am nächsten Morgen auf die Tafel der Ebene 1. Siehe die [Matrix der Regelrunden](https://www.m365.fm/learn/shop-floor-management/) in der Pillar.

## Warum die Reaktionszeit explodiert: die Warteschlangenrechnung

Das LEI beschreibt Toyotas Teamleiter als Stundenlöhner, die Teams von fünf bis acht Personen führen, auf Bandstopps und Andon-Rufe reagieren und Arbeitsplätze abwesender Teammitglieder übernehmen [4]. Viele westliche Werke versuchen, Andon mit einem Meister zu betreiben, der für 25 oder mehr Personen zuständig ist und nebenbei Papierkram und Besprechungen erledigt. Eine einfache Warteschlangenrechnung zeigt, warum das scheitert.

Der Reagierende wird als einzelne Bedienstation betrachtet. Rufe treffen mit einer Rate λ ein (Rufe pro Stunde); die Bearbeitung eines Rufs dauert im Mittel s Minuten, die Bedienrate ist also μ = 60 ÷ s Rufe pro Stunde. Die Auslastung ist ρ = λ ÷ μ. Im Lehrbuchmodell M/M/1 (zufällige Ankünfte, zufällige Bearbeitungszeiten) beträgt die mittlere Wartezeit, bis der Reagierende eintrifft, Wq = ρ ÷ (μ − λ).

**Beispiel:** Ein Reagierender betreut eine Linie mit im Mittel 6 Rufen pro Stunde. Jeder Ruf dauert in der Bearbeitung 6 Minuten (μ = 10 pro Stunde).

- ρ = 6 ÷ 10 = 0,6 (60 % Auslastung)
- Wq = 0,6 ÷ (10 − 6) = 0,15 Stunden = **9 Minuten mittlere Wartezeit**

| Rufe pro Stunde | Auslastung | Mittlere Wartezeit bis zur Reaktion |
|---|---|---|
| 3 | 30 % | 0,3 ÷ 7 h = etwa 2,6 min |
| 6 | 60 % | 9 min |
| 8 | 80 % | 0,8 ÷ 2 h = 24 min |
| 9 | 90 % | 0,9 ÷ 1 h = 54 min |

Die Bedienzeit muss den Weg zur Station enthalten, nicht nur die Behebung. Teilen sich zwei Reagierende die Rufe, gilt das Modell M/M/c, und die Wartezeiten sinken deutlich; das ist ein Argument dafür, Reagierende über benachbarte Linien zu bündeln. Die echte Linie ist nicht exakt M/M/1, aber das Muster gilt für jede Warteschlange mit zufälligen Ankünften: Die Wartezeit wächst viel schneller als die Auslastung. Ein Reagierender, der zu 60 % mit Andon-Rufen beschäftigt ist, kann kein Reaktionsziel von 60 Sekunden erreichen. Die Lösung ist strukturell: kleinere Teams je Reagierendem, eine eigene Rolle für die Reaktion oder weniger Rufe durch Problemlösung bei den wiederkehrenden Ursachen. Mehr Leuchten helfen nicht.

## Alarmflut vermeiden: Lehren aus ISA-18.2

Wenn jede Maschinenstörung, jeder Mindestbestandssensor und jeder langsame Takt ein Signal auslöst, hören die Menschen auf zu reagieren. Die Prozessindustrie hat für dieses Problem eine Norm: ANSI/ISA-18.2-2016, *Management of Alarm Systems for the Process Industries* [10]. Sie steuert Alarme über einen Lebenszyklus, der Philosophie, Identifikation, Rationalisierung, Detailgestaltung, Umsetzung, Betrieb, Instandhaltung, Überwachung und Bewertung, Änderungsmanagement und Audit umfasst [8]. Bei der Rationalisierung wird jeder vorgeschlagene Alarm gegen die Kriterien der Alarmphilosophie begründet, dokumentiert, priorisiert und klassifiziert [9]. Ein technischer Bericht, ISA-TR18.2.6-2012, überträgt die Grundsätze der Norm auf Batch- und diskrete Prozesse [9].

ISA-18.2 ist für Leitwarten geschrieben, nicht für Montagelinien, und keine Anforderung an Andon-Systeme. Ihre Logik lässt sich aber gut übertragen:

| Idee aus ISA-18.2 | Übertragung auf Andon |
|---|---|
| Ein Alarm zeigt einen Zustand an, der eine Handlung des Bedieners erfordert [8] | Jeder Andon-Ruf braucht eine festgelegte Reaktion. Muss niemand handeln, ist es Status, kein Ruf. |
| Dokument zur Alarmphilosophie [8] | Eine Seite: Rufarten, Farben, Töne, Verantwortliche, Eskalationszeiten |
| Rationalisierung: jeden Alarm begründen, priorisieren, klassifizieren [9] | Jedes automatische Maschinensignal prüfen: Braucht es jetzt einen Menschen? Welche Priorität? |
| Leistungsüberwachung [8] | Rufe je Reagierendem und Stunde, wiederkehrende Rufe, ohne Handlung geschlossene Rufe verfolgen |
| Änderungsmanagement [8] | Neue Signale oder geänderte Schwellen durchlaufen eine kurze Freigabe, keine schnelle SPS-Änderung |

Zur Größenordnung: Ein Artikel in Control Engineering zu ISA-18.2 nennt die Werte der Norm von etwa 150 Alarmen pro Tag (im Mittel etwa 1 pro 10 Minuten) als "very likely acceptable" (sehr wahrscheinlich akzeptabel) für einen Leitwartenfahrer und etwa 300 pro Tag (etwa 2 pro 10 Minuten) als handhabbares Maximum [8]; ein Whitepaper von Honeywell führt dieselben Werte aus ISA-18.2 auf, mit etwa 300 pro Tag (etwa 2 pro 10 Minuten) als "may be manageable" (möglicherweise handhabbar) [16]. Diese Zahlen gelten nicht für einen Teamleiter an einer Montagelinie, dessen Rufe jeweils Minuten dauern, aber sie zeigen das Prinzip: Die akzeptable Rate bestimmt sich aus der Zeit, die jede Reaktion braucht. Die eigene Grenze lässt sich mit der Warteschlangentabelle oben festlegen.

## Andon-Kennzahlen

| Kennzahl | Formel | Nutzen |
|---|---|---|
| Rufe pro Schicht | Anzahl Rufe nach Art | zeigt, wie viel das Team sichtbar macht; ein Rückgang auf null ist ein Warnsignal |
| Reaktionszeit | Zeit vom Ruf bis zum Eintreffen an der Station | prüft, ob die Reaktionsstruktur funktioniert |
| Lösungszeit | Zeit vom Ruf bis zum Zurücksetzen | zeigt die Schwierigkeit der Probleme; lange Zeiten gehen in die Regelrunden |
| Bandstillstandsminuten durch Andon | Summe der Stoppdauern nach Festpositionsstopp | fließt in die Verfügbarkeit der OEE ein; siehe [TPM und OEE](https://www.m365.fm/learn/tpm-oee/) (geplant) |
| Anteil der innerhalb des Takts gelösten Rufe | vor der festen Position zurückgesetzte Rufe ÷ alle Rufe | die zentrale Gesundheitskennzahl eines Festpositionssystems |
| Quote wiederkehrender Ursachen | Rufe mit einem Ursachencode, der in 30 Tagen 3-mal oder öfter auftrat ÷ alle Rufe | zeigt auf Probleme, die eine Ursachenanalyse brauchen |
| Eskalationsquote | Rufe, die Stufe 3 oder höher erreichen ÷ alle Rufe | zeigt, wo auf der ersten Stufe Fähigkeiten fehlen |

Die häufigsten Ursachencodes gehören als Pareto-Diagramm auf die Regelrundentafel; pro Woche wird einer für die strukturierte Problemlösung ausgewählt, zum Beispiel mit einem [A3](https://www.m365.fm/learn/lean-management/a3-methode/) (geplant) oder den Methoden aus [Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant). Andon-Kennzahlen werden nach Linie und Schicht berichtet, nicht nach Person (siehe Kultur unten).

## Die Wirtschaftlichkeit von Andon

Eine typische Wirtschaftlichkeitsrechnung für ein neues oder besseres Andon-System beruht auf kürzerer Reaktion und weniger wiederkehrenden Problemen. Eine Beispielrechnung:

| Position | Vorher | Nachher | Hinweis |
|---|---|---|---|
| Rufe pro Tag, die zum Bandstillstand führen | 12 | 12 | gleiche Probleme, schnellere Reaktion |
| mittlere Stoppdauer je Ruf | 4,0 min | 1,5 min | eigene Reaktionsrolle, klare Eskalation |
| Stoppminuten pro Tag | 48 | 18 | |
| zurückgewonnene Minuten pro Tag | | 30 | |
| Ausbringung der Linie | 1 Einheit/min | | |
| Deckungsbeitrag je Einheit | 35 USD | | Verkaufspreis minus variable Kosten |
| Wert pro Tag | | 1.050 USD | 30 Einheiten × 35 USD |
| Wert pro Jahr (240 Tage) | | 252.000 USD | |
| Kosten einer eigenen Reaktionsrolle | | −139.840 USD | 1 Stundenlöhner × 2 Schichten × 1.840 bezahlte Stunden (Annahme) × 38 USD Vollkostensatz |
| Nettowert pro Jahr | | 112.160 USD | vor Hardware, Software und Schulung |

**Vorbehalt des Controllings.** Die zurückgewonnenen Minuten werden nur dann zu Geld, wenn die Linie der Engpass des Werks ist und sich die zusätzlichen Einheiten verkaufen lassen. Deckt die Linie den Bedarf bereits, liegt der Gewinn in weniger Überstunden, weniger Eilaufträgen oder einer kürzeren Schicht, bewertet mit den tatsächlich eingesparten Kosten, nicht mit dem Deckungsbeitrag. Die andere Seite der Rechnung sind die Kosten: eine eigene Reaktionsrolle (ein Stundenlohn je Schicht und Bandabschnitt), Hardware und Software (Investition oder Abonnement), Integration und Schulung. Viele Andon-Verbesserungen sind überwiegend organisatorisch und brauchen wenig Investition. Sinnvoll ist, beide Sichten zu zeigen, Durchsatz und Kosten, damit der Werkscontroller die richtige wählen kann; die Pillar zur [Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant) erklärt, warum die Unterscheidung wichtig ist.

## Digitales Andon: Architektur und Integration

Ein einfaches Andon braucht nur eine Leine, eine Leuchte und eine Tafel. Digitales Andon ergänzt automatische Auslöser, Timer, Eskalationsnachrichten und eine Datenbank für die Auswertung. Hersteller beschreiben die Grundkette als Signal, Alarm und Lösung, mit Eskalation an größere Gruppen, je länger ein Ereignis dauert [13].

| Ebene (ISA-95) | Komponenten | Hinweise |
|---|---|---|
| Ebene 1–2: Sensorik und Steuerung | Taster, Leinen, Störungsbits der SPS, Taktsensoren | eigene Eingänge oder SPS-Variablen nutzen; vom Andon aus nur lesend |
| Ebene 2–3: Andon-Logik | Andon-Server oder MES-Modul: Rufarten, Timer, Eskalationsregeln | viele MES-Produkte enthalten Andon; siehe [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant) |
| Ebene 3: Anzeigen und Benachrichtigungen | Hängetafeln, Signalsäulen, Smartwatches, Pager, mobile Apps | Zustellzeiten testen; Benachrichtigungen müssen innerhalb der ersten Schwelle ankommen |
| Ebene 3–4: Auswertung | Datenbank, Dashboards, Daten für die Regelrundentafel | Ursachencodes und Dauern fließen in OEE- und Pareto-Auswertung |

Gestaltungshinweise:

- **Latenz.** Kollaborationswerkzeuge aus dem Büro können für die Eskalationsstufen nach 30 und 60 Minuten und für Berichte nützlich sein, aber bevor man sich bei der ersten Reaktion im Sekundenbereich auf sie verlässt, ist zu testen, ob ihre Zustellzeiten taugen. Das Signal der ersten Stufe bleibt lokal (Leuchte, Ton, Tafel).
- **Der Bandstopp ist eine Steuerungsfunktion.** Hält das Andon ein Fördersystem an, geht dieses Signal an die SPS der Linie und muss vom Steuerungsteam wie jede andere Steuerungsänderung ausgelegt, getestet und dokumentiert werden. Die Andon-Software selbst sollte Maschinensignale lesen, nicht in Steuerungen schreiben.
- **Ausfallsicheres Verhalten.** Fallen Andon-Server oder Netzwerk aus, müssen Werker trotzdem Hilfe rufen können. Eine lokale Leuchte und ein Funkgerät sind die Rückfallebene.
- **OT-Security.** Das Andon-System verbindet das Maschinennetz mit dem Büronetz. Es gehört in die segmentierte Architektur des Werks und erhält nur Lesezugriff auf Maschinensignale; siehe [OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant).
- **Datenmodell.** Je Ruf speichern: Linie, Station, Rufart, Auslöser (manuell/automatisch), Zeitstempel (Ruf, Eintreffen, Zurücksetzen, Stoppbeginn, Stoppende), Rolle des Reagierenden, Ursachencode, Kommentar. Das reicht für jede Kennzahl oben.
- **Papier und digital zusammen.** Viele Werke kombinieren digitales Andon mit digitalen Arbeitsanweisungen, damit der Reagierende an der Station den aktuellen Standard öffnen kann; siehe [papierlose Fertigung](https://www.m365.fm/learn/shop-floor-management/papierlose-fertigung/).

## Kultur: Das Ziehen der Leine sicher machen

Die Zahlen aus Georgetown und Dearborn aus dem BBC-Bericht machen den Punkt: 2.000 Züge pro Woche bei Toyota in Georgetown und zwei pro Woche in Fords neuem Lkw-Werk in Dearborn [6]. Der Artikel führte die Lücke auf "the legacy of generations of mistrust between shop-floor workers and managers" (das Erbe von Generationen des Misstrauens zwischen Mitarbeitenden in der Halle und Management) zurück [6]. Graban berichtete später Jeff Likers Darstellung, dass Ford in Dearborn eine Teamleiterrolle außerhalb des Bandes geschaffen habe, diese Rolle aber gefährdet gewesen sei, wenn sie ihren Wert nicht belegen konnte [5].

Die Hardware ist in beiden Werken identisch. Unterschiedlich ist, was mit der Person passiert, die zieht. Amy Edmondsons Forschung beschreibt psychologische Sicherheit als "a shared belief held by members of a team that the team is safe for interpersonal risk taking" (die gemeinsame Überzeugung der Mitglieder eines Teams, dass das Team ein sicherer Ort für zwischenmenschliche Risiken ist) [14]; vor den Kollegen am Andon zu ziehen, ist genau so ein Risiko.

Praktische Regeln:

- **Die ersten Worte des Reagierenden gelten dem Problem, nicht der Person.** "Was hast du gefunden?" statt "Was ist denn jetzt schon wieder?"
- **Keine Ziele für weniger Rufe.** Ein Ziel für weniger Andon-Züge ist ein Ziel, Probleme zu verstecken. Ziele gehören stattdessen auf Reaktionszeit und wiederkehrende Ursachen.
- **Nach Linie und Schicht berichten, nicht nach Namen.** Andon-Daten lassen sich als individuelle Leistungsdaten lesen. In gewerkschaftlich organisierten US-Werken gehört vor der Einführung personenbezogener Andon-Berichte das Gespräch mit der Gewerkschaft; für deutsche Werke behandelt die Pillar [Betriebsrat und Mitbestimmung](https://www.m365.fm/learn/shop-floor-management/) bei Kennzahlen.
- **Den Kreis sichtbar schließen.** Auf der Tafel zeigen, welche wiederkehrenden Ursachen dank Andon-Rufen behoben wurden.
- **Sicherheitsmeldungen schützen.** Die Leitlinie der US-Arbeitsschutzbehörde OSHA zur Beteiligung der Beschäftigten empfiehlt ein Verfahren, mit dem Beschäftigte Verletzungen, Beinaheunfälle und Gefahren melden können, Schutz vor Benachteiligung wegen solcher Meldungen und die Befugnis der Beschäftigten, eine vorübergehende Unterbrechung oder Stilllegung von Arbeiten zu verlangen, die sie für unsicher halten [15]. Ein Sicherheits-Andon-Ruf ist eine solche Meldung.
- **Das Ziehen üben.** Neue Werker sollten in ihrer ersten Woche üben, an der Leine zu ziehen, damit der erste echte Zug nicht zugleich der erste überhaupt ist.

## Einführung in acht Schritten

| Schritt | Inhalt | Ergebnis |
|---|---|---|
| 1 | eine Pilotlinie mit klarer Taktzeit und einem bereitwilligen Team wählen | Pilotumfang |
| 2 | Rufarten festlegen (mit drei beginnen: Qualität, Material, Hilfe) | Liste der Rufarten |
| 3 | die Reaktionsrolle festlegen und die Kapazität mit der Warteschlangenrechnung prüfen | Reagierender je Schicht, Teamgröße |
| 4 | Eskalationsmatrix und Farbcode schreiben | einseitige Andon-Philosophie |
| 5 | das einfachste funktionierende Signal installieren (Leuchte, Tafel, Ton) | funktionierendes Andon |
| 6 | Werker und Reagierende schulen, einschließlich Übungszügen | Schulungsnachweise |
| 7 | vier Wochen lang jeden Ruf mit Ursachencode erfassen; wöchentlich auswerten | Kennzahlen-Ausgangsbasis, Pareto |
| 8 | Schwellen anpassen, Störsignale entfernen, dann automatische Maschinenauslöser und digitale Eskalation ergänzen | überarbeitete Philosophie, Rollout-Plan |

Die Reaktion selbst wird als [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) geschrieben: was der Reagierende zuerst prüft, wann angehalten wird, wann eskaliert wird, wie zurückgesetzt wird.

## Typische Fehler

1. **Leuchten ohne Reagierende.** Das Signal funktioniert, niemand kommt, die Leute hören auf zu ziehen.
2. **Sofortiger Bandstopp ohne feste Position.** Stopps dauern länger und stören andere Stationen [1].
3. **Ein Reagierender für 25 Personen.** Die Warteschlangenrechnung garantiert lange Wartezeiten.
4. **Jede Maschinenstörung wird zum Ruf.** Alarmflut; Störsignale übertönen echte [8].
5. **Rot für alles.** Rot verliert seine Bedeutung, was mit seiner Verwendung im Arbeitsschutz kollidiert [11].
6. **Andon als Sicherheitseinrichtung.** Not-Halt und Schutzeinrichtungen bleiben getrennt [11][12].
7. **Eskalation nach Ermessen.** Niemand will die nächste Stufe stören; der Timer muss entscheiden.
8. **Keine Ursachencodes.** Rufe werden bearbeitet, aber niemand lernt.
9. **Ziele für weniger Rufe.** Probleme tauchen ab.
10. **Personenbezogene Berichte ohne Beteiligung der Belegschaft eingeführt.** Das Vertrauen bricht, die Züge gehen zurück.

## FAQ: Andon-System

### Was ist ein Andon-System im Lean Management?

Ein visuelles Signal- und Reaktionssystem, das den Zustand der Abläufe auf einen Blick zeigt und bei einer Abweichung Hilfe ruft, ausgelöst durch Leine, Taster oder Maschine [1].

### Was bedeutet Andon?

Andon ist ein japanisches Wort für eine Papierlaterne [7]. In der Produktion bezeichnet es die Leuchte oder Tafel, die ein Problem signalisiert.

### Hält das Ziehen der Andon-Leine das Band an?

In Toyotas Endmontage nicht sofort. Das Band läuft bis zur nächsten festen Position, typischerweise dem Ende des Arbeitsplatzes, und hält dort nur an, wenn das Problem nicht gelöst ist [1][5].

### Was ist eine Andon-Tafel (Andon Board)?

Eine Hängeanzeige mit nummerierten Zeilen oder Feldern für Arbeitsplätze oder Maschinen; ein Feld leuchtet auf, wenn eine Leine, ein Taster oder ein Sensor ein Problem meldet, damit der Teamleiter sieht, wohin er gehen muss [1]. Viele Tafeln zeigen auch Soll- gegen Ist-Menge [1].

### Wer hat Andon erfunden?

Das Andon ist Teil von Jidoka im Toyota-Produktionssystem; Toyota führt Jidoka auf Sakichi Toyodas Webstuhl zurück, der sich bei einem Problem selbst anhielt [2][7]. Einen einzelnen Erfinder der Andon-Tafel nennen die geprüften Quellen nicht.

### Was bedeuten die Andon-Farben?

Einen universellen Standard gibt es nicht. Übliche Praxis ist Grün für normal, Gelb für angeforderte Hilfe und Rot für Stillstand. In US-Werken bleibt Rot im Einklang mit seiner OSHA-Bedeutung für Gefahr und Stopp [11].

### Was ist ein digitales Andon-System?

Ein Andon, bei dem die Signale von Tastern oder Maschinensteuerungen kommen und Software Timer, Eskalationsnachrichten, Anzeigen und Auswertung übernimmt [13].

### Wie schnell sollte auf einen Andon-Ruf reagiert werden?

An einer getakteten Linie innerhalb des verbleibenden Arbeitstakts, damit das Problem vor dem Festpositionsstopp gelöst werden kann. Das Ziel leitet sich aus Taktzeit und Puffern ab; die Kapazität der Reagierenden lässt sich mit der Warteschlangenrechnung in diesem Artikel prüfen.

### Welche Kennzahlen sollte ein Andon-System erfassen?

Rufe pro Schicht, Reaktionszeit, Lösungszeit, Bandstillstandsminuten, Anteil der innerhalb des Takts gelösten Rufe, Quote wiederkehrender Ursachen und Eskalationsquote.

### Sind viele Andon-Rufe schlecht?

Anfangs nicht. Viele Rufe bedeuten, dass das Team Probleme sichtbar macht. Warnzeichen sind unbeantwortete Rufe, lange Reaktionszeiten und immer wieder dieselben Ursachen.

### Was ist der Unterschied zwischen Andon und Jidoka?

Jidoka ist das Prinzip: bei der ersten Abweichung anhalten und sie beheben, statt Fehler weiterzugeben [2]. Andon ist das Werkzeug, das einen solchen Halt sichtbar macht und Hilfe ruft: die Leine, der Taster oder das Maschinensignal und die Leuchte oder Tafel, die zeigt, wo das Problem ist [1][2].

### Was ist der Unterschied zwischen einer Andon-Tafel und einem OEE-Dashboard?

Eine Andon-Tafel zeigt, was jetzt eine Reaktion braucht: welche Station oder Maschine Hilfe gerufen hat oder steht [1]. Ein OEE-Dashboard fasst die Leistung über eine Schicht oder länger zusammen. Viele digitale Systeme zeigen beides auf einem Bildschirm; die Andon-Rufe gehören dann nach oben, damit sie nicht zwischen Diagrammen untergehen.

### Ist Andon dasselbe wie ein Not-Halt?

Nein. Andon ist ein Produktionssignal. Not-Halt und Maschinenschutzeinrichtungen sind Sicherheitsfunktionen und müssen unabhängig bleiben [11][12].

## Fazit

Ein Andon-System sagt den Werkern eine Sache: Wer ein Problem meldet, bekommt rechtzeitig Hilfe. Leuchte und Tafel machen das sichtbar; die Reaktion macht es wahr. Diese Reaktion braucht einen Reagierenden mit freier Kapazität (die Warteschlangenrechnung zeigt, wie schnell Wartezeiten wachsen), einen festen Punkt, an dem das Band anhält, eine Eskalationsmatrix, die automatisch mehr Hilfe hinzuzieht, und eine Signalgestaltung, die jeden Ruf als etwas behandelt, das eine Handlung erfordert.

Reaktionszeit und wiederkehrende Ursachen messen, nach Linie statt nach Person berichten und die wichtigsten Ursachen in die Regelrunden des [Shopfloor Managements](https://www.m365.fm/learn/shop-floor-management/) einspeisen: Dann tut das Andon, wofür es gedacht ist, und macht jede Abweichung sofort sichtbar, damit das Team sie dauerhaft beheben kann.

## Weiterlesen auf m365.fm

**Übergeordnete Pillar**
- [Shopfloor Management und Gemba Walks](https://www.m365.fm/learn/shop-floor-management/)

**Geschwister-Cluster (geplant)**
- [Standardarbeit: Elemente, Formblätter und ein durchgerechnetes Beispiel](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) (geplant)
- [Papierlose Fertigung und digitale Arbeitsanweisungen](https://www.m365.fm/learn/shop-floor-management/papierlose-fertigung/) (geplant)

**Verwandte Pillars und Cluster (vor Livegang Links prüfen)**
- [Lean Management](https://www.m365.fm/learn/lean-management/)
- [TPM und OEE](https://www.m365.fm/learn/tpm-oee/) (geplant)
- [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant)
- [OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant)
- [Kanban und Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/) (geplant)
- [Theory of Constraints (Engpasstheorie)](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant)
- [Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant)
- [A3-Methode](https://www.m365.fm/learn/lean-management/a3-methode/) (geplant)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)

**Begriffe**
[Shopfloor Management](https://www.m365.fm/entity/shop-floor-management/) · [Visuelles Management](https://www.m365.fm/entity/visual-management/) · [Kurzstillstände](https://www.m365.fm/entity/micro-stops/)

---

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH in Stuttgart ([iFAKT auf m365.fm](https://www.m365.fm/entity/ifakt/)). Auf m365.fm schreibt er über Lean Management, Operational Excellence und die Digitalisierung der Produktion mit Microsoft 365 und Azure.

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

*[Redaktion: Rolle, Werdegang und Profilfoto des Autors ergänzen.]*

---

# Quellen

Alle Quellen abgerufen am 20. November 2026.

1. Andon (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/andon/
2. Toyota Production System. Toyota Motor Corporation (globale Website). https://global.toyota/en/company/vision-and-philosophy/production-system/
3. Andon: Toyota Production System guide. Toyota UK Magazine. https://mag.toyota.co.uk/andon-toyota-production-system/
4. Team Leader (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/team-leader/
5. Graban, M.: No, One Toyota Worker Can't Stop the Whole Factory. Lean Blog, 29. Juni 2026 (zitiert Liker, J.; Meier, D.: The Toyota Way Fieldbook, und ein Gespräch mit Jeff Liker von 2024). https://www.leanblog.org/2026/06/andon-cord-stop-the-line-myth/
6. Schifferes, S.: The triumph of lean production. BBC News, 27. Februar 2007 (archiviertes PDF auf Lean Blog). https://www.leanblog.org/wp-content/uploads/2026/06/BBC-NEWS-_-Business-_-The-triumph-of-lean-production.pdf
7. Andon (manufacturing). Wikipedia (englisch). https://en.wikipedia.org/wiki/Andon_(manufacturing)
8. Tennant, M.: Implementing Alarm Management per the ANSI/ISA-18.2 Standard. Control Engineering, September 2013 (neu veröffentlicht von Yokogawa). https://www.yokogawa.com/us/library/resources/media-publications/implementing-alarm-management-per-the-ansi-isa-182-standard-control-engineering/
9. ISA18 alarm management standard updated. InTech, International Society of Automation, Mai/Juni 2016. https://www.isa.org/intech-home/2016/may-june/departments/isa18-alarm-management-standard-updated
10. ANSI/ISA-18.2-2016, Management of Alarm Systems for the Process Industries (Eintrag im ANSI-Webstore). https://webstore.ansi.org/standards/isa/ansiisa182016
11. 29 CFR 1910.144, Safety color code for marking physical hazards. Occupational Safety and Health Administration. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.144
12. 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). Occupational Safety and Health Administration. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147
13. Andon Systems. Vorne Industries (Herstellerseite). https://www.vorne.com/learn/key-concepts/andon/systems/
14. Edmondson, A.: Psychological Safety and Learning Behavior in Work Teams. Administrative Science Quarterly 44 (2), 1999, S. 350–383. https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Group_Performance/Edmondson%20Psychological%20safety.pdf
15. Safety Management – Worker Participation. Occupational Safety and Health Administration (OSHA), U.S. Department of Labor. https://www.osha.gov/safety-management/worker-participation
16. Enhance Alarm Management. Honeywell-Whitepaper WP-20-24-ENG, Oktober 2020, S. 8 (Herstellerquelle; Tabelle mit Alarmraten nach ANSI/ISA-18.2). https://process.honeywell.com/content/dam/process/en/documents/document-lists/honeywell_enhanced-a.pdf (abgerufen am 20. November 2026)

# Prüfhinweise für die Redaktion

**URL-Schema:** verschachtelte Cluster-URL (`/learn/shop-floor-management/andon/`) laut Übersetzungs-Brief; eine Annahme über die finale CMS-Struktur. Mit dem CMS abgleichen.

**Herstellerangaben:** Vorne [13] nur für die allgemeine Kette Signal–Alarm–Lösung und das übliche Drei-Farben-Schema; keine Leistungs- oder Preisangaben übernommen. Honeywell [16] und Yokogawa/Control Engineering [8] sind Herstellerquellen für die ISA-18.2-Alarmraten (zwei unabhängige Quellen stimmen überein; der kostenpflichtige Normtext selbst wurde nicht geöffnet [unbelegt gegenüber dem Normtext]).

**[unbelegt]-Stellen und Beispielwerte:**
- Eskalationsmatrix, Farbtabelle, Einführungsschritte und Zahlen der Wirtschaftlichkeitsrechnung (12 Rufe, 4,0 → 1,5 min, 35 USD Deckungsbeitrag, 240 Tage, 1.840 bezahlte Stunden, 38 USD Vollkostensatz) sind Beispielgestaltung und Beispielzahlen, keine belegten Benchmarks. Nachgerechnet: 48 − 18 = 30 min; 30 × 35 = 1.050 USD; × 240 = 252.000 USD; 2 × 1.840 × 38 = 139.840 USD; 252.000 − 139.840 = 112.160 USD.
- Warteschlangenrechnung: Lehrbuchformel M/M/1, Wq = ρ ÷ (μ − λ); Werte nachgerechnet (2,6 / 9 / 24 / 54 min).
- Fenster von 5 bis 30 Sekunden: Schätzung von Mark Graban [5], keine Toyota-Angabe. Puffer von etwa 10 Minuten: über Graban mit Verweis auf Liker/Meier [5], nicht im Buch geprüft.
- 2.000 vs. 2 Züge pro Woche: BBC News 2007 [6], als Illustration der Kultur verwendet, nicht als aktuelle Daten. Teamleiterrolle bei Ford Dearborn: Darstellung von Jeff Liker über Graban [5].
- Funktaster seit 2014 und Zwei-Zug-System: nur über Wikipedia [7], nicht auf einer Toyota-Seite bestätigt. Entscheidung für Mirko aus der englischen Fassung übernommen: mit der Zuschreibung "laut Wikipedia" behalten oder den Satz streichen.
- ISA-TR18.2.6-2012: im InTech-Artikel [9] genannt; Inhalt des Berichts nicht geprüft.

**Zitate:** Englische Originalzitate (LEI, Toyota, BBC, Edmondson, Control Engineering, Honeywell) stehen mit deutscher Übersetzung in Klammern. Die Toyota-Zitate gibt es ggf. auf der deutschen Toyota-Website; vor Veröffentlichung prüfen.

**iFAKT:** im Artikeltext nicht erwähnt (kein echter Bezug). Offenlegung in der Autorenbox wie gefordert; keine Kennzeichnung als gesponsert. Entity-Link auf iFAKT aus dem Original übernommen.

**Interne Links:** Parent-Pillar Shopfloor Management in den ersten 150 Wörtern, im Abschnitt Eskalation (Matrix der Regelrunden), im Abschnitt Kultur (Regeln zur Mitarbeiterüberwachung) und im Fazit. Geschwister Standardarbeit und papierlose Fertigung. Neue Pillars und Cluster im Text: Kanban/Pull-Prinzip, TPM/OEE, MES/ISA-95, OT-Security, Theory of Constraints, Six Sigma, A3-Methode, Poka Yoke. Alle (geplant); nach Veröffentlichung aktivieren. Prüfen, ob die deutsche Shopfloor-Management-Pillar tatsächlich einen Abschnitt zu US-Regeln der Mitarbeiterüberwachung enthält; sonst Linktext anpassen.

**Kannibalisierung:** Die Shopfloor-Management-Pillar hat einen kurzen Andon-Abschnitt. Dieser Cluster besetzt "Andon-System" mit Gestaltungstiefe; der Pillar-Abschnitt sollte hierher verlinken. Mögliche Überschneidung mit TPM/OEE (Stillstand) und MES/ISA-95 (Andon als MES-Modul): nur verlinkt.

**JSON-LD-Vorschlag:** wie in der englischen Fassung (`TechArticle` mit `about` Andon und Jidoka, `FAQPage` mit allen 13 Fragen, `BreadcrumbList`) mit `inLanguage: de-DE`, deutscher `headline` ("Andon-System: So gelingen Signale, Eskalation und Reaktion"), `url` https://www.m365.fm/learn/shop-floor-management/andon/, `isPartOf` https://www.m365.fm/learn/shop-floor-management/, deutschen FAQ-Fragen und -Antworten (ohne Quellenmarker). Breadcrumb: Learn > Shopfloor Management > Andon.

**Empfohlene Grafiken:** (1) Festpositionsstopp als Zeitleiste (Zug, Teamleiter trifft ein, feste Position, Stopp oder Zurücksetzen); (2) Eskalationsmatrix als Swimlane-Grafik nach verstrichener Zeit; (3) Diagramm mittlere Wartezeit über Auslastung des Reagierenden (aus der Warteschlangentabelle), um das nichtlineare Wachstum zu zeigen; (4) Architektur des digitalen Andon auf den ISA-95-Ebenen. Beschriftungen auf Deutsch, Dezimalkomma.

**hreflang:** `de-DE` https://www.m365.fm/learn/shop-floor-management/andon/ <-> `en-US` https://www.m365.fm/en/learn/shop-floor-management/andon/; gegenseitige Verweise und selbstreferenzierende Canonicals. Die englische Fassung muss beim Livegang um das hreflang-Paar ergänzt werden.

**Für den deutschen Markt prüfen:**
- Abschnitt "Andon-Farben und Arbeitssicherheit" und FAQ zu Farben/Not-Halt: beschreiben US-Recht (OSHA 1910.144 Farben, 1910.147 Lockout/Tagout). Für deutsche Werke prüfen, ob Hinweise auf Sicherheitsfarben nach ASR A1.3 / DIN EN ISO 7010, Farben von Anzeigeleuchten nach DIN EN 60204-1, Not-Halt nach DIN EN ISO 13850 und Freischalten nach DGUV/BetrSichV ergänzt werden sollen. Nur nach Fachprüfung als Fakt einfügen.
- Abschnitt Kultur: Personenbezogene Andon-Auswertungen und digitales Andon mit Zeitstempeln je Ruf unterliegen in Deutschland voraussichtlich der Mitbestimmung des Betriebsrats (§ 87 Abs. 1 Nr. 6 BetrVG) und dem Datenschutz (DSGVO, § 26 BDSG); der Text nennt nur Gewerkschaften und US-Regeln. Fachprüfung, ob ein Satz zum deutschen Kontext ergänzt wird.
- OSHA-Leitlinie zur Beteiligung der Beschäftigten [15]: deutsches Pendant (ArbSchG, Beteiligung der Beschäftigten, Gefährdungsbeurteilung) prüfen.
- OT-Security: Bezug zu NIS2-Umsetzung prüfen (nicht im Original).

**Review-Log:** Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.
