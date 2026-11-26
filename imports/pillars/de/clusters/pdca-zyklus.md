# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | PDCA-Zyklus (Plan-Do-Check-Act): Phasen und Beispiel (52 Zeichen) |
| Meta-Description | Der PDCA-Zyklus für KVP: die vier Phasen, PDCA vs. PDSA, Geschichte von Shewhart bis Deming, ein Praxisbeispiel aus der Fertigung und eine Vorlage. (147 Zeichen) |
| Slug | `/learn/lean-management/pdca-zyklus/` (vollständige URL: https://www.m365.fm/learn/lean-management/pdca-zyklus/) |
| Parent-Pillar | [Lean Management](https://www.m365.fm/learn/lean-management/) |
| Hauptkeyword | PDCA-Zyklus, Deming-Kreis |
| Nebenkeywords | PDCA, Plan Do Check Act, Deming-Rad, Deming-Zyklus, Shewhart-Zyklus, PDSA, Plan Do Study Act, PDCA vs. PDSA, PDCA Beispiel, PDCA Vorlage, PDCA in der Produktion, PDCA vs. DMAIC, OPDCA, PDCA ISO 9001, PDCA KVP, Model for Improvement |
| Suchintention | Informational (Definition, Phasen, Geschichte) mit How-to-Absicht (Beispiel, Vorlage). Zielgruppe: Meister und Schichtführer, Qualitäts- und KVP-Ingenieure, Werksleitung, Studierende, Qualitätsmanagementbeauftragte in ISO-basierten Managementsystemen |
| Wortzahl | Ziel 3.000 bis 5.000 Wörter (Cluster). Tatsächlich H1 bis Fazit (`wc -w`): **4.263 Wörter** (englische Fassung: 4.377) |
| Sprachversion | Deutsch (`de-DE`). hreflang-Paar: `de-DE` https://www.m365.fm/learn/lean-management/pdca-zyklus/ <-> `en-US` https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus; deutsche Suchbegriffe wie "PDCA-Zyklus", "Deming-Kreis" und "PDCA Beispiel" sind dabei gesondert zu prüfen.

# PDCA-Zyklus (Plan-Do-Check-Act): Phasen, Geschichte und ein Beispiel aus der Fertigung

*Stand: November 2026 · Lesezeit: etwa 16 Minuten*

> **Kurzantwort:** Der PDCA-Zyklus (Plan-Do-Check-Act, auch Deming-Kreis oder Deming-Rad genannt) ist eine sich wiederholende Verbesserungsmethode in vier Schritten, die auf der wissenschaftlichen Methode beruht: eine Änderung planen, ausprobieren, das Ergebnis mit dem Ziel vergleichen, dann standardisieren oder neu beginnen [1]. Deming selbst bevorzugte später PDSA, mit "Study" statt "Check", um das Lernen aus dem Vergleich von Vorhersage und Ergebnis zu betonen [2][3].

PDCA ist die Logik unter fast jedem Lean-Werkzeug, vom täglichen Kaizen über A3-Reports bis zu Hoshin Kanri. Diese Vertiefung gehört zu unserem [Leitfaden zu Lean Management](https://www.m365.fm/learn/lean-management/), der das ganze System behandelt. Hier folgen die vier Phasen im praktischen Detail, die tatsächliche Geschichte, ein Rechenbeispiel mit Zahlen und eine Vorlage, die sich schon morgen einsetzen lässt.

> **Das Wichtigste in Kürze**
> - PDCA hat vier Schritte: Plan (Ziel und Änderung), Do (umsetzen), Check (Ergebnisse mit dem Ziel vergleichen), Act (standardisieren oder neu beginnen) [1].
> - Walter Shewharts ursprünglicher Zyklus hatte drei Schritte: Spezifikation, Produktion, Prüfung [1][2].
> - Deming stellte 1950 in Japan ein Rad mit vier Schritten vor (Entwurf, Produktion, Verkauf, Untersuchung); japanische Führungskräfte formten es um 1951 zu PDCA um [1][2].
> - Deming nannte den Zyklus später PDSA und bat 1990 in einem Brief darum, ihn "PDSA, not the corruption PDCA" zu nennen [2].
> - Ein guter Plan enthält eine Vorhersage. Ohne sie kann Check nur sagen "es wurde besser" oder "es wurde nicht besser", und man lernt wenig [2][4].
> - Act endet in einem neuen Standard. Das LEI verbindet PDCA über die Standardarbeit mit Kaizen [1].
> - PDCA läuft auf jeder Zeitebene: stündlich an der Linie, wöchentlich in der Problemlösung, jährlich in Hoshin Kanri [5].

## Inhaltsverzeichnis

1. [Was ist der PDCA-Zyklus?](#was-ist-der-pdca-zyklus)
2. [So funktioniert der PDCA-Zyklus: die 4 Phasen im Detail](#so-funktioniert-der-pdca-zyklus-die-4-phasen-im-detail)
3. [Wann der PDCA-Zyklus für KVP sinnvoll ist](#wann-der-pdca-zyklus-für-kvp-sinnvoll-ist)
4. [Geschichte: Shewhart, Deming und das japanische PDCA](#geschichte-shewhart-deming-und-das-japanische-pdca)
5. [PDCA vs. PDSA: Macht "Check" oder "Study" einen Unterschied?](#pdca-vs-pdsa-macht-check-oder-study-einen-unterschied)
6. [Rechenbeispiel: Ausschuss an einer CNC-Drehmaschine senken](#rechenbeispiel-ausschuss-an-einer-cnc-drehmaschine-senken)
7. [PDCA-Vorlage und Checkliste für die Check-Phase](#pdca-vorlage-und-checkliste-für-die-check-phase)
8. [PDCA auf jeder Ebene des Werks](#pdca-auf-jeder-ebene-des-werks)
9. [PDCA vs. DMAIC vs. A3 vs. Kaizen-Workshop](#pdca-vs-dmaic-vs-a3-vs-kaizen-workshop)
10. [Typische Fehler beim PDCA](#typische-fehler-beim-pdca)
11. [FAQ](#faq-pdca-zyklus)
12. [Fazit](#fazit)

## Was ist der PDCA-Zyklus?

Das Lean Enterprise Institute (LEI) definiert PDCA als Verbesserungszyklus, der auf der wissenschaftlichen Methode beruht: eine Änderung an einem Prozess vorschlagen, die Änderung umsetzen, die Ergebnisse messen und angemessen handeln [1]. Zyklus heißt er, weil der Act-Schritt in den nächsten Plan mündet. Jeder Durchlauf bestätigt entweder einen besseren Standard oder liefert Wissen für den nächsten Versuch.

Für dieselbe Idee sind mehrere Namen im Umlauf:

| Name | Herkunft |
|---|---|
| PDCA (Plan-Do-Check-Act) | japanische Umformung von Demings Rad von 1950, um 1951 [1][2] |
| Deming-Kreis / Deming-Rad | benannt nach W. Edwards Deming, der die Idee in den 1950er-Jahren nach Japan brachte [1] |
| Shewhart-Zyklus | nach Walter Shewhart, dessen Abfolge Spezifizieren-Produzieren-Prüfen der Ausgangspunkt war; Deming selbst verwendete diesen Namen [1][2] |
| PDSA (Plan-Do-Study-Act) | Demings spätere Formulierung, beschrieben in *The New Economics* (1993) [2] |

Im Werk taucht PDCA überall auf, sobald man danach sucht: in der Maßnahmenspalte einer Shopfloor-Tafel, im Aufbau eines [A3-Reports](https://www.m365.fm/learn/lean-management/a3-methode/), in jedem [Kaizen](https://www.m365.fm/learn/lean-management/kaizen/) und im Catchball von Hoshin Kanri.

## So funktioniert der PDCA-Zyklus: die 4 Phasen im Detail

Die kurzen Definitionen des LEI sind ein guter Ausgangspunkt: Plan setzt Ziele und bestimmt die nötigen Änderungen, Do setzt sie um, Check bewertet die Ergebnisse gegenüber den Leistungszielen, und Act standardisiert und stabilisiert die Änderung oder beginnt den Zyklus neu [1]. In der Praxis steckt in jedem Schritt mehr.

### Plan: verstehen, vorhersagen, entscheiden

Plan verdient meist die meiste Zeit. Ein vollständiger Plan beantwortet sechs Fragen:

| Frage | Beispielantwort (CNC-Ausschuss weiter unten) |
|---|---|
| Was ist das Problem, in Zahlen? | 4,2 % Ausschuss am Bohrungsdurchmesser, Arbeitsgang 20, Drehmaschine 7 |
| Was ist das Ziel, bis wann? | unter 2,0 % innerhalb von 6 Wochen |
| Was ist die Ursache, soweit bekannt? | Verschleiß der Wendeschneidplatte: zu große Bohrungen häufen sich im letzten Drittel jeder Standzeit |
| Welche Änderung testen wir? | Wechselintervall der Wendeschneidplatte von 600 auf 450 Teile verkürzen |
| Was sagen wir voraus? | Ausschuss sinkt auf etwa 1,5 %; Kosten für Wendeschneidplatten steigen um etwa 40 USD pro Woche |
| Wie und wann messen wir? | Ausschuss nach Position in der Standzeit, 2 Wochen, jedes Teil auf der vorhandenen SPC-Karte gemessen |

Die Zeile mit der Vorhersage überspringen die meisten Teams. Moen und Norman zeichnen nach, wie die Vorhersage Teil des Zyklus wurde: 1991 erweiterten Moen, Nolan und Provost den Plan-Schritt um eine Vorhersage und die dahinterstehende Theorie, damit der Study-Schritt die beobachteten Ergebnisse mit dieser Vorhersage vergleicht [2]. Das Deming Institute betont dasselbe: Neues Wissen aus Lernen aufzubauen, "is always guided by a theory" (wird immer von einer Theorie geleitet) [3].

### Do: klein testen

Do heißt, den Plan auszuführen, idealerweise als kleiner Test: eine Maschine, eine Schicht, ein Produkt. Währenddessen werden Daten gesammelt und festgehalten, was nicht wie geplant lief. John Hunter schlägt in einem Beitrag für das Deming Institute vor, Do als "Do-the-experiment"-Schritt zu bezeichnen, weil sein Zweck darin besteht, Lernen zu erzeugen [4].

Kleine Tests haben zwei Vorteile. Sie lassen sich billig zurücknehmen, falls die Änderung etwas verschlechtert, und sie sind schnell fertig; so kann das Team in der Zeit, die ein großer Rollout bräuchte, mehrere Zyklen durchlaufen.

### Check-Phase: Ergebnis mit Vorhersage vergleichen

Check vergleicht das gemessene Ergebnis mit dem Ziel und mit der Vorhersage. Drei Ausgänge sind möglich:

1. **Ergebnis wie vorhergesagt:** Die Theorie hat gehalten; weiter zu Act und standardisieren.
2. **Ergebnis besser oder schlechter als vorhergesagt:** Die Theorie ist unvollständig; vor dem Standardisieren klären, warum.
3. **Keine Veränderung:** Die Ursache war falsch, oder die Änderung wurde nicht wie geplant umgesetzt; zurück zu Plan.

Check sucht auch nach Nebenwirkungen: Hat sich die Qualität verbessert, während die Zykluszeit gestiegen ist? Hat eine Änderung in einer Schicht das Problem in eine andere verschoben?

### Act: standardisieren oder neu beginnen

Hat die Änderung funktioniert, macht Act sie zum neuen Standard: Arbeitsanweisung aktualisieren, jede Schicht schulen, ins Audit aufnehmen, Arbeitsplan oder Produktionslenkungsplan ändern. Das LEI verbindet das direkt mit Kaizen: Gemessene Verbesserungen werden durch die Aktualisierung der Standardarbeit festgeschrieben [1]. Unser [Leitfaden zur Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) (geplant) zeigt, wie das geht.

Hat sie nicht funktioniert, entscheidet Act, was als Nächstes getestet wird. In beiden Fällen endet der Zyklus mit einer Entscheidung, nicht mit einer Folie.

## Wann der PDCA-Zyklus für KVP sinnvoll ist

Der PDCA-Zyklus passt immer dann, wenn sich eine Änderung im Kleinen testen und das Ergebnis messen lässt. Typische Fälle im Werk:

- ein wiederkehrendes Problem mit einer vermuteten Ursache, wie der Ausschussfall im Rechenbeispiel unten;
- ein neuer oder geänderter Prozess (neues Produkt, neue Maschine, neuer Lieferant), bei dem die ersten Läufe geprüft werden müssen;
- das tägliche Führen, bei dem die Stundentafel und die gestuften Regelrunden kurze PDCA-Schleifen fahren;
- eine Maßnahme aus einer Ursachenanalyse, die einen Nachweis braucht, bevor sie zum Standard wird.

PDCA ist eine Managementmethode, nicht nur ein Werkzeug für die Fertigung. Derselbe iterative Ablauf funktioniert für Geschäftsprozesse wie Auftragserfassung, Angebotserstellung oder Einarbeitung, für Produkte und Dienstleistungen und in Projekt-Reviews. ISO 9001:2015 wendet ihn auf alle Prozesse und auf das Qualitätsmanagementsystem als Ganzes an [10].

Weniger gut passt er, wenn sich nicht im Kleinen testen lässt (eine Werksverlagerung, eine ERP-Umstellung) oder wenn ein Streuungsproblem viele zusammenwirkende Ursachen hat. Dort ist meist ein [Six-Sigma-DMAIC-Projekt](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant) mit statistischer Versuchsplanung die bessere Wahl.

### Vorteile und Grenzen des PDCA-Zyklus

| Vorteile | Grenzen |
|---|---|
| einfach genug für jede Ebene der Organisation, vom Werker bis zur Werksleitung | so einfach, dass Teams die Vorhersage und die Check-Phase überspringen |
| kleine Tests halten Risiko und Kosten niedrig | langsam bei dringenden Problemen, wenn jeder Zyklus auf eine Besprechung wartet |
| datenbasiert: Entscheidungen beruhen auf gemessenen Ergebnissen, nicht auf Meinungen | braucht verlässliche Messung; ein schwaches Messmittel macht Check bedeutungslos |
| baut eine KVP-Kultur auf, weil jeder Zyklus in einem Standard oder einer Erkenntnis endet | sagt nicht, an welchem Problem gearbeitet werden soll; das kommt aus Strategie, Kennzahlen oder einer Wertstromanalyse |
| passt zu Lean, Six Sigma, ISO 9001 und Total Quality Management | wird zum Papierkram, wenn Formulare die Arbeit am Gemba ersetzen |

## Geschichte: Shewhart, Deming und das japanische PDCA

Die Geschichte ist interessanter und umstrittener, als die meisten Zusammenfassungen vermuten lassen. Die sorgfältigste Darstellung ist der Artikel von Moen und Norman aus *Quality Progress* von 2010, "Clearing up myths about the Deming cycle and seeing how it keeps evolving" [2].

| Jahr | Ereignis | Quelle |
|---|---|---|
| 1939 | Walter Shewharts *Statistical Method From the Viewpoint of Quality Control* stellt drei Schritte vor: Spezifikation, Produktion, Prüfung; später zeichnet Shewhart sie als Zyklus | [1][2] |
| 1950 | Auf einem von der JUSE ausgerichteten Seminar in Japan stellt Deming ein Rad mit vier Schritten vor: Entwurf, Produktion, Verkauf, Untersuchung (Marktforschung und Erprobung im Einsatz) | [2][6] |
| 1951 | Japanische Führungskräfte formen das Deming-Rad zu Plan-Do-Check-Act um; das LEI schreibt die Überarbeitung der JUSE zu, während Moen und Norman anmerken, dass Masaaki Imai darüber berichtete, ohne zu sagen, wer es war | [1][2] |
| 1986 | In *Out of the Crisis* stellt Deming den "Shewhart-Zyklus" vor und sagt, er stamme aus seiner Arbeit von 1950 | [2] |
| 1990 | In einem Brief an Ronald Moen vom 17. November 1990 schreibt Deming: "Be sure to call it PDSA, not the corruption PDCA" | [2] |
| 1991 | Moen, Nolan und Provost ergänzen den Plan-Schritt um Vorhersage und Theorie | [2] |
| 1993 | Deming beschreibt den Plan-Do-Study-Act-Zyklus in *The New Economics* | [2] |
| 1994 | Langley, Nolan und Nolan stellen dem Zyklus drei Fragen voran, aus denen das Model for Improvement wird | [2] |

Die drei Fragen des Model for Improvement gehören an jede Verbesserungstafel [2]:

1. Was wollen wir erreichen?
2. Woran erkennen wir, dass eine Änderung eine Verbesserung ist?
3. Welche Änderung können wir vornehmen, die zu einer Verbesserung führt?

Aus dieser Geschichte folgen zwei praktische Lehren. Erstens war der Zyklus nie als Checkliste für die Umsetzung gedacht, sondern als Lernschleife. Zweitens haben sich das japanische PDCA und Demings PDSA parallel entwickelt, und beide sind legitim. Die Lean-Literatur verwendet überwiegend PDCA, so auch das LEI [1]; das Model for Improvement verwendet PDSA [2].

## PDCA vs. PDSA: Macht "Check" oder "Study" einen Unterschied?

Deming warnte, "Check" könne missverstanden werden [2]. Das Deming Institute erklärt den Unterschied so: Bei PDCA zielt Check eher auf die Umsetzung einer Änderung und darauf, ob sie gelungen oder gescheitert ist; Deming wählte Study, weil er den Fokus darauf legen wollte, Ergebnisse vorherzusagen, die tatsächlichen Ergebnisse zu untersuchen und die Theorie zu überarbeiten [3].

| | PDCA, wie es oft gelebt wird | PDSA, wie Deming es meinte |
|---|---|---|
| Plan | über eine Änderung entscheiden | über eine Änderung entscheiden, eine Theorie und eine Vorhersage formulieren |
| Do | umsetzen | einen Test fahren und Daten sammeln |
| Check / Study | hat es funktioniert: ja oder nein? | wie verhalten sich die Ergebnisse zur Vorhersage, und warum? |
| Act | ausrollen oder verwerfen | anpassen, übernehmen oder aufgeben; die Theorie überarbeiten |
| Typisches Scheitern | "Prüf"-Denken, Kästchen abhaken | Überanalyse, wenn Tests zu groß sind |

Im Werk ist die Bezeichnung weniger wichtig als die Gewohnheit. Ein Team, das "Check" schreibt, aber eine schriftliche Vorhersage mit Messdaten vergleicht, macht PDSA. Ein Team, das "Study" schreibt, aber nur fragt "haben wir die Maßnahmen erledigt?", macht es nicht. Sinnvoll ist das Wort, das im Unternehmen schon üblich ist, verbunden mit dem Bestehen auf der Vorhersage.

**OPDCA.** Manche Lean-Organisationen stellen dem Plan ein O für "Observe" (den Ist-Zustand beobachten) voran [7]. Das betont, vor dem Planen an den Gemba zu gehen. An der Logik ändert es nichts; ein guter Plan beginnt ohnehin mit Beobachtung.

## Rechenbeispiel: Ausschuss an einer CNC-Drehmaschine senken

Die Zahlen sind ein Beispiel zur Veranschaulichung.

**Plan.** Drehmaschine 7 fährt Arbeitsgang 20 (Fertigbohrung) an einem Stahlgehäuse, 5.000 Teile pro Woche. Der Ausschuss wegen zu großer Bohrung liegt bei 4,2 %: 210 Teile pro Woche. Jedes Ausschussteil kostet 18 USD an Material und vorgelagerten Arbeitsgängen. Das Team trägt die zu großen Bohrungen über der Position in der Standzeit der Wendeschneidplatte auf und sieht, dass sie sich nach etwa Teil 400 des derzeitigen Wechselintervalls von 600 Teilen häufen.

*Theorie:* Der Verschleiß der Wendeschneidplatte treibt die Bohrung im letzten Drittel der Standzeit ins Übermaß.
*Änderung:* Wendeschneidplatten alle 450 statt alle 600 Teile wechseln.
*Vorhersage:* Ausschuss sinkt auf etwa 1,5 %; zusätzliche Kosten für Wendeschneidplatten etwa 40 USD pro Woche; keine Auswirkung auf andere Merkmale.

**Do.** Der Test läuft nur auf Drehmaschine 7, in allen drei Schichten, zwei Wochen lang. Die Werker tragen den Standzeitzähler auf der vorhandenen SPC-Karte ein. Eine Abweichung wird festgehalten: An Tag 3 fuhr die zweite Schicht 520 Teile mit einer Platte, weil keine Ersatzplatte an der Maschine lag.

**Check.** Ergebnisse über zwei Wochen (10.000 Teile):

| Messgröße | Vorher | Vorhergesagt | Tatsächlich |
|---|---|---|---|
| Ausschussquote | 4,2 % | etwa 1,5 % | 1,6 % |
| Ausschussteile pro Woche | 210 | etwa 75 | 80 |
| Ausschusskosten pro Woche (× 18 USD) | 3.780 USD | etwa 1.350 USD | 1.440 USD |
| Plattenwechsel pro Woche (5.000 / Intervall) | 8,3 | 11,1 | 11,1 |
| zusätzliche Plattenkosten pro Woche (2,8 × 14 USD) | | etwa 40 USD | 39 USD |
| zusätzliche Maschinenzeit für Wechsel pro Woche (2,8 × 6 min) | | etwa 17 min | 17 min |

Ist der Unterschied echt oder Rauschen? Bei der alten Quote würden 10.000 Teile etwa 420 Ausschussteile ergeben, mit einer Standardabweichung von etwa √(10.000 × 0,042 × 0,958) ≈ 20. Der Test ergab 160, etwa 13 Standardabweichungen weniger: weit jenseits normaler Streuung. Eine p-Karte der täglichen Ausschussquoten zeigt dasselbe optisch.

Das Ergebnis stimmt eng mit der Vorhersage überein, und die Abweichung an Tag 3 erklärt einen Teil des verbleibenden Ausschusses: Die meisten zu großen Teile in Woche 1 stammten von Platten, die über 450 Teile hinaus liefen. Die Theorie hält.

**Nettoeffekt:** 3.780 USD − 1.440 USD − 39 USD = **etwa 2.300 USD Einsparung pro Woche**, rund 115.000 USD pro Jahr bei 50 Wochen. Siebzehn Minuten zusätzliche Wechselzeit pro Woche sind an dieser Maschine vernachlässigbar; an einem Engpass müssten sie bewertet werden.

**Act.** Das Team aktualisiert das Einrichteblatt und das Werkzeugverwaltungssystem auf 450 Teile, richtet an der Maschine eine Zwei-Behälter-Versorgung mit Wendeschneidplatten ein (die Ursache der Abweichung an Tag 3), schult alle Schichten und überträgt die Änderung nach je einer Woche Prüfung auf die zwei Schwestermaschinen. Der nächste PDCA-Zyklus beginnt bei den verbleibenden 1,6 %: Die Auswertung zeigt jetzt Ausschuss, der sich nach Plattenwechseln häuft; die nächste Theorie betrifft also das Setzen des Korrekturwerts nach einem Wechsel, ein Kandidat für ein [Poka Yoke](https://www.m365.fm/learn/lean-management/poka-yoke/) bei der Korrekturwerteingabe.

Ein Hinweis aus dem Controlling: Die 18 USD pro Ausschussteil sind ein Vollkostenwert. Lässt sich das Material wertschöpfend recyceln oder haben die vorgelagerten Arbeitsgänge freie Kapazität, ist die Liquiditätseinsparung niedriger als die Einsparung zu Standardkosten. Welcher Wert verwendet wird, gehört offen dazugeschrieben.

## PDCA-Vorlage und Checkliste für die Check-Phase

**Vorlage: PDCA-Arbeitsblatt auf einer Seite**

| Abschnitt | Inhalt | Ausgefüllt von / wann |
|---|---|---|
| Titel, Verantwortlicher und Team | Problem in wenigen Worten; ein namentlich Verantwortlicher; Teammitglieder einschließlich der Werker, die den Test fahren | Verantwortlicher, Start |
| Hintergrund | warum das jetzt wichtig ist (Sicherheit, Qualität, Lieferung, Kosten) | Verantwortlicher, Start |
| Ist-Zustand | Daten und eine Skizze vom Gemba | Team, Plan |
| Ziel | messbar, mit Termin | Verantwortlicher mit Führungskraft, Plan |
| Ursache / Theorie | was die Lücke nach unserer Überzeugung verursacht, und die Belege | Team, Plan |
| Zu testende Änderung | was, wo, wie klein | Team, Plan |
| Vorhersage | erwartetes Ergebnis in Zahlen, erwartete Nebenwirkungen | Team, Plan |
| Messplan | was, wie, wie oft, wer | Team, Plan |
| Testprotokoll | was gemacht wurde, Abweichungen, Beobachtungen | Team, Do |
| Ergebnis vs. Vorhersage | Tabelle: vorher, vorhergesagt, tatsächlich | Team, Check |
| Erkenntnis | warum die Ergebnisse übereinstimmten oder nicht | Team, Check |
| Entscheidung | übernehmen, anpassen, aufgeben; nächster Zyklus | Verantwortlicher mit Führungskraft, Act |
| Standardisierung | geänderte Dokumente, geschulte Personen, ergänztes Audit | Verantwortlicher, Act |

**Checkliste: bevor die Check-Phase verlassen wird**

| Frage | Ja / Nein |
|---|---|
| Wurde die Änderung wie geplant umgesetzt? Abweichungen festgehalten? | ☐ |
| Ist die Messung dieselbe wie bei der Ausgangsbasis (gleiches Messmittel, gleiche Definition), und ist das Messmittel fähig (MSA / Messsystemanalyse, Gage R&R)? | ☐ |
| Ist die Stichprobe groß genug, um den Effekt von normaler Streuung zu trennen (Verlaufsdiagramm oder Regelkarte ansehen)? | ☐ |
| Haben wir das Ergebnis mit der schriftlichen Vorhersage verglichen, nicht nur mit der Ausgangsbasis? | ☐ |
| Können wir eine Lücke zwischen Vorhersage und Ergebnis erklären? | ☐ |
| Haben wir Nebenwirkungen auf Sicherheit, andere Qualitätsmerkmale, Zykluszeit und Kosten geprüft? | ☐ |
| Stimmen die Werker, die den Test gefahren haben, der Schlussfolgerung zu? | ☐ |

**Checkliste: Act (Standardisierung)**

| Punkt | Erledigt |
|---|---|
| Arbeitsanweisung oder Standardarbeitsblatt aktualisiert | ☐ |
| Alle Schichten geschult, Schulung dokumentiert | ☐ |
| Produktionslenkungsplan / PFMEA aktualisiert (wo verwendet, z. B. in Umgebungen nach IATF 16949 oder AS9100) | ☐ |
| ERP-Arbeitsplan, Standzeit oder Maschinenprogramm geändert und die Parameteränderung im Änderungsmanagement dokumentiert | ☐ |
| Layered Audit oder Führungsstandardarbeit enthält den neuen Punkt | ☐ |
| Änderung nach Prüfung auf ähnliche Prozesse übertragen (Yokoten) | ☐ |
| Nächster PDCA-Zyklus festgelegt oder Problem abgeschlossen | ☐ |

## PDCA auf jeder Ebene des Werks

PDCA ist nicht nur eine Projektmethode. Er läuft gleichzeitig in mehreren Geschwindigkeiten.

| Ebene | Zyklusdauer | Plan | Do | Check | Act |
|---|---|---|---|---|---|
| Werker an der Linie | Minuten bis Stunden | Stundenziel auf der Produktionstafel | die Stunde fahren | Ist gegen Plan jede Stunde | Problem notieren, Teamleiter rufen, schnelle Abhilfe |
| Team / Meister | täglich | Schichtplan, Tagesziele | die Schicht fahren | Regelrunde Ebene 1 bespricht den Vortag | Maßnahmen mit Verantwortlichen auf der Tafel |
| Abteilung | wöchentlich bis monatlich | Verbesserungsprioritäten, A3s | Tests fahren | A3-Reviews, Kennzahlentrends | standardisieren, nächsten A3 starten |
| Werk | quartalsweise bis jährlich | Hoshin-Kanri-Ziele | Entfaltung im Catchball | Quartalsreviews | Ziele und den Plan fürs nächste Jahr anpassen |

Das LEI beschreibt Hoshin Kanri als auf PDCA aufbauend [5]. Die tägliche Ebene ist die Routine des [Shopfloor Managements](https://www.m365.fm/learn/shop-floor-management/), in der Stundentafeln und gestufte Regelrunden PDCA zur Gewohnheit machen statt zum Projekt.

## PDCA vs. DMAIC vs. A3 vs. Kaizen-Workshop

| | PDCA | DMAIC (Six Sigma) | A3 | Kaizen-Workshop |
|---|---|---|---|---|
| Was es ist | allgemeiner Lernzyklus | strukturierte Projektmethode | einseitiger PDCA-Report und Coaching-Prozess [8] | fünftägiger Team-Workshop [9] |
| Schritte | Plan, Do, Check, Act | Define, Measure, Analyze, Improve, Control | vom Hintergrund bis zur Nachverfolgung auf einem Blatt | vorbereiten, schulen, umsetzen, nachbereiten |
| Typische Dauer | Minuten bis Monate | etwa 3 bis 6 Monate [unbelegt: übliche Praxis] | Wochen bis wenige Monate | 1 Woche plus Nachbereitung |
| Datentiefe | nach Bedarf | viel Statistik | mittel, visuell | mittel, Zeitaufnahmen |
| Am besten für | jede Verbesserung, schnelle Tests | Streuungsprobleme mit unbekannten Ursachen | Probleme, die Ursachenanalyse und Abstimmung brauchen | abgegrenzte Fluss- und Layoutprobleme |
| Zusammenhang | die Grundlogik | DMAIC lässt sich auf PDCA abbilden (Define/Measure/Analyze ≈ Plan) | die linke Seite eines A3 ist Plan, die rechte Do-Check-Act | jeder Workshop ist ein großer PDCA-Durchlauf |

Der [Leitfaden zu Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant) behandelt DMAIC ausführlich; der [Leitfaden zur A3-Methode](https://www.m365.fm/learn/lean-management/a3-methode/) zeigt, wie ein PDCA auf ein Blatt passt.

## Typische Fehler beim PDCA

| Fehler | Woran man ihn erkennt | Abhilfe |
|---|---|---|
| PDDDD: Plan, Do, Do, Do | Maßnahmen stapeln sich, niemand prüft die Wirkung | keine neue Maßnahme ohne Prüftermin |
| keine Vorhersage | "Check" kann nur besser oder schlechter sagen | die erwartete Zahl in Plan aufschreiben [2] |
| Plan ohne Gemba | Theorie im Besprechungsraum gebaut | erst den Prozess beobachten und mit den Werkern sprechen |
| Test zu groß | werksweiter Rollout als erster Versuch | an einer Maschine, in einer Schicht testen |
| nur die Maßnahmenliste prüfen | "alle Maßnahmen erledigt" gilt als Erfolg | die Kennzahl gegen das Ziel prüfen |
| danach kein Standard | Verbesserung verschwindet binnen Wochen | Act-Checkliste: Dokumente, Schulung, Audit [1] |
| ein Zyklus und fertig | erste Maßnahme wirkt teilweise, Problem bleibt | den nächsten Zyklus ausdrücklich planen |
| PDCA als Papierkram | Formulare fürs Audit ausgefüllt, kein Lernen | kurz, handschriftlich, am Gemba besprochen |
| in Check Menschen beschuldigen | Werker verstecken Abweichungen beim nächsten Mal | auf den Prozess schauen; Abweichungen sind Daten |

## FAQ: PDCA-Zyklus

### Was sind die 4 Phasen des PDCA-Zyklus?

Plan (Ziele setzen und die Änderung bestimmen), Do (umsetzen), Check (Ergebnisse gegen das Ziel bewerten) und Act (die Änderung standardisieren oder den Zyklus neu beginnen) [1].

### Wer hat den PDCA-Zyklus erfunden?

Keine einzelne Person. Walter Shewhart beschrieb 1939 eine Abfolge Spezifizieren-Produzieren-Prüfen; W. Edwards Deming stellte 1950 in Japan ein Rad mit vier Schritten vor; japanische Führungskräfte formten es um 1951 zu Plan-Do-Check-Act um [1][2]. Deming bevorzugte später PDSA [2].

### Was ist der Unterschied zwischen PDCA und PDSA?

Der dritte Schritt. Deming ersetzte "Check" durch "Study", weil Teams Ergebnisse mit einer Vorhersage vergleichen und ihre Theorie überarbeiten sollten, statt nur zu prüfen, ob eine Änderung umgesetzt wurde [2][3]. Gut angewendet führen beide zum selben Verhalten.

### Was ist ein Beispiel für PDCA in der Produktion?

Das Wechselintervall der Wendeschneidplatten an einer Drehmaschine von 600 auf 450 Teile zu verkürzen, um Ausschuss durch zu große Bohrungen zu senken: Plan mit Vorhersage (Ausschuss auf etwa 1,5 %), Test an einer Maschine über zwei Wochen, Check (tatsächlich 1,6 %), Act durch Aktualisierung des Einrichteblatts und Übertragung auf die Schwestermaschinen. Die Details stehen im Rechenbeispiel oben.

### Was ist der Unterschied zwischen PDCA und DMAIC?

PDCA ist ein kurzer, allgemeiner Lernzyklus; DMAIC ist die fünfphasige Six-Sigma-Projektmethode für Streuungsprobleme, mit mehr statistischer Analyse und formalen Phasenabnahmen (Tollgates). DMAIC lässt sich als erweitertes PDCA lesen.

### Wie lange dauert ein PDCA-Zyklus?

So kurz, wie das Problem es erlaubt. An der Linie kann ein Zyklus eine Stunde dauern; ein Problemlösungszyklus mit zweiwöchigem Test wie im Beispiel oben dauert etwa einen Monat; Hoshin Kanri fährt einen Jahreszyklus [5]. Kürzere Zyklen heißen schnelleres Lernen.

### Ist PDCA Teil der ISO 9001?

Ja. Die Einleitung der ISO 9001:2015 sagt, dass die Steuerung der Prozesse und des Systems als Ganzes "can be achieved using the PDCA cycle" (mit dem PDCA-Zyklus erreicht werden kann, 0.3.1) und dass der PDCA-Zyklus "can be applied to all processes and to the quality management system as a whole" (auf alle Prozesse und das Qualitätsmanagementsystem als Ganzes angewendet werden kann, 0.3.2) [10]. Vor dem Zitieren in Audits die aktuelle Ausgabe prüfen.

### Ist PDCA Teil von Six Sigma?

Ja, und ebenso von Lean. PDCA ist älter als beide: Lean-Organisationen nutzen ihn als Logik von Kaizen und A3 [1][8], und DMAIC aus Six Sigma lässt sich als erweitertes PDCA mit mehr Statistik lesen.

### Was ist OPDCA?

Eine Variante, die vor Plan ein "Observe" (Beobachten) setzt, um zu betonen, dass zuerst der Ist-Zustand am Gemba untersucht wird [7].

### In welcher PDCA-Phase wird die Lösung gefunden und umgesetzt?

Die Lösung, genauer die zu testende Änderung, wird in Plan bestimmt, nachdem die Ursache analysiert ist, und in Do umgesetzt, zunächst als kleiner Test. Zum dauerhaften Standard wird sie erst in Act, nachdem Check bestätigt hat, dass sie wirkt [1].

### Ist der PDCA-Zyklus heute noch aktuell?

Ja. ISO 9001:2015 baut ihren prozessorientierten Ansatz weiterhin darauf auf [10], und das LEI beschreibt ihn als Logik von Kaizen und Grundlage von Hoshin Kanri [1][5]. Digitale Tafeln und MES-Daten machen die Check-Phase schneller, ersetzen aber weder die Vorhersage noch die Entscheidung in Act.

### Ist PDCA dasselbe wie Kaizen?

Nicht ganz. Kaizen ist die Praxis kontinuierlicher Verbesserung; PDCA ist die Methode darin: Führungskräfte setzen Ziele gegenüber einer stabilen Ausgangsbasis, Teams testen Verbesserungen, und Erfolge werden durch Aktualisierung der Standardarbeit festgeschrieben [1]. Mehr dazu in unserem [Leitfaden zu Kaizen](https://www.m365.fm/learn/lean-management/kaizen/).

## Fazit

Der PDCA-Zyklus wirkt zu einfach, um einen Leitfaden zu brauchen: Plan, Do, Check, Act. Sein Wert liegt in zwei Details, die die meisten Teams überspringen. Plan sollte eine schriftliche Vorhersage enthalten, damit Check zu einem echten Vergleich wird und nicht zu einem Ja-oder-Nein-Urteil. Und Act sollte in einem neuen Standard enden, dem jede Schicht folgt, sonst verschwindet der Gewinn. Demings Beharren auf "Study" macht denselben Punkt aus einem anderen Blickwinkel: Der Zyklus ist ein Weg, etwas über den eigenen Prozess zu lernen, und erst in zweiter Linie ein Weg, Maßnahmen umzusetzen. Klein und oft gefahren, wird PDCA zur Alltagsgewohnheit hinter KVP statt zu einem Formular.

**Die nächsten Schritte**

- [ ] Ein offenes Problem von der Shopfloor-Tafel wählen und auf die einseitige PDCA-Vorlage schreiben
- [ ] Vor jedem Test eine zahlenmäßige Vorhersage ergänzen
- [ ] Klein testen: eine Maschine, eine Schicht, zwei Wochen
- [ ] Ergebnis und Vorhersage in einer dreispaltigen Tabelle vergleichen
- [ ] Mit der Act-Checkliste standardisieren, dann den nächsten Zyklus festlegen

---

## Weiterlesen auf m365.fm

**Übergeordneter Leitfaden**
- [Lean Management: Prinzipien, Werkzeuge, Einführung und Grenzen](https://www.m365.fm/learn/lean-management/)

**Weitere Vertiefungen zu Lean**
- [Kaizen und Kaizen-Workshops](https://www.m365.fm/learn/lean-management/kaizen/) (geplant)
- [A3-Methode](https://www.m365.fm/learn/lean-management/a3-methode/) (geplant)
- [Poka Yoke und Fehlervermeidung](https://www.m365.fm/learn/lean-management/poka-yoke/) (geplant)

**Verwandte Leitfäden**
- [Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant)
- [Shopfloor Management und Gemba Walks](https://www.m365.fm/learn/shop-floor-management/)
- [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) (geplant)
- [Operational Excellence](https://www.m365.fm/learn/operational-excellence/)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)

**Glossarbegriffe (Entities)**
[Lean Management](https://www.m365.fm/entity/lean-management/) · [A3-Methode](https://www.m365.fm/entity/a3-problem-solving/) · [Standardarbeit](https://www.m365.fm/entity/standard-work/) · [Gemba Walk](https://www.m365.fm/entity/gemba-walk/)

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Lean Management, Operational Excellence und die digitale Transformation der Produktion. [Redaktion: Rolle, Kurzbiografie und Foto ergänzen.]

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Quellen

Alle Quellen abgerufen am 20. November 2026.

1. Plan, Do, Check, Act (PDCA). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/pdca/
2. Moen, R. D.; Norman, C. L.: Clearing up myths about the Deming cycle and seeing how it keeps evolving. Quality Progress, November 2010, S. 23–28 (ASQ). Kopie bereitgestellt vom East London NHS Foundation Trust QI: https://qi.elft.nhs.uk/wp-content/uploads/2026/02/ron-cliff-circling-back.pdf
3. PDSA Cycle. The W. Edwards Deming Institute. https://deming.org/?p=920
4. Hunter, J.: The History and Evolution of the PDSA Cycle. Blog des W. Edwards Deming Institute. https://deming.org/the-history-and-evolution-of-the-pdsa-cycle/
5. Hoshin Kanri. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/hoshin-kanri/
6. Timeline: W. Edwards Deming. The W. Edwards Deming Institute. https://deming.org/timeline/
7. PDCA (Abschnitt zu Varianten, OPDCA). Wikipedia. https://en.wikipedia.org/wiki/PDCA
8. A3 Report. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/a3-report/
9. Kaizen. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/kaizen/
10. ISO 9001:2015 Quality management systems – Requirements, informative Leseprobe (Einleitung, Abschnitte 0.3.1 und 0.3.2). https://www.en-standard.eu/publicdoc/iso-9001-prev-1.pdf (abgerufen am 20. November 2026)

# Prüfhinweise für die Redaktion

**URL-Schema:** verschachtelte Cluster-URL laut Übersetzungs-Brief; eine Annahme über die finale CMS-Struktur.

**Herstellerangaben:** keine.

**[unbelegt]-Stellen:** DMAIC-Dauer 3 bis 6 Monate (Praxisschätzung). Die PDCA-Formulierung der ISO 9001 ist über die offizielle Leseprobe [10] belegt; die Zitate stehen im englischen Original mit deutscher Übersetzung in Klammern. Für den deutschen Markt prüfen, ob stattdessen aus der deutschen Fassung DIN EN ISO 9001:2015 zitiert werden soll (Wortlaut dann aus der Norm übernehmen).

**Quellenhinweise:** [2] ist der ASQ-Artikel in *Quality Progress*, gelesen in der Kopie der ELFT; bei Veröffentlichung nach Möglichkeit auf die ASQ-Seite verlinken. [3] wurde über den Kurzlink des Deming Institute abgerufen; im CMS durch die kanonische URL ersetzen. [7] (Wikipedia) dient nur als Beleg für die Existenz der Variante OPDCA; eine deutsche Wikipedia-Seite wäre als Zusatz denkbar, nicht als Ersatz.

**Rechenbeispiel:** Beispielzahlen, nachgerechnet wie in der englischen Fassung (210; 3.780 USD; 80; 1.440 USD; 8,33 bzw. 11,11 Wechsel; 2,78 × 14 USD = 38,9 USD; 16,7 min; 2.301 USD pro Woche; 115.050 USD pro Jahr; Binomialprüfung σ = 20,06, (420 − 160) / 20,06 = 13,0). USD bleibt laut Brief.

**iFAKT:** im Artikeltext nicht erwähnt; Offenlegung nur in der Autorenbox.

**Interne Links (Text):** Parent-Pillar Lean Management (erste 150 Wörter), Geschwister Kaizen, A3-Methode, Poka Yoke; Cluster Standardarbeit; Pillars Shopfloor Management, Six Sigma (neu). Neue URLs sind geplant; nach Veröffentlichung aktivieren.

**Kannibalisierung:** Die Lean-Management-Pillar erwähnt PDCA ohne eigenen Abschnitt. Dieser Cluster besetzt "PDCA-Zyklus", "PDSA" und "Deming-Kreis". Die geplante Six-Sigma-Pillar sollte DMAIC besetzen und für PDCA hierher verlinken.

**JSON-LD-Vorschlag:** wie in der englischen Fassung (`TechArticle`, `FAQPage`, `BreadcrumbList`) mit `inLanguage: de-DE`, deutscher `headline` ("PDCA-Zyklus (Plan-Do-Check-Act): Phasen, Geschichte und ein Beispiel aus der Fertigung"), `mainEntityOfPage` https://www.m365.fm/learn/lean-management/pdca-zyklus/, `isPartOf` https://www.m365.fm/learn/lean-management/, deutschen FAQ-Fragen und -Antworten (ohne [n]). Breadcrumb: Start > Learn > Lean Management > PDCA-Zyklus.

**Empfohlene Grafiken:** (1) PDCA-Kreis mit den sechs Plan-Fragen um den Plan-Quadranten; (2) Zeitleiste 1939 bis 1994 (Shewhart, Deming-Rad, PDCA, PDSA, Model for Improvement); (3) Balkendiagramm vorher / vorhergesagt / tatsächlich zum Drehmaschinen-Beispiel; (4) Diagramm "PDCA in vier Geschwindigkeiten" (Stunde, Tag, Woche/Monat, Jahr). Beschriftungen auf Deutsch, Dezimalkomma.

**hreflang:** `de-DE` https://www.m365.fm/learn/lean-management/pdca-zyklus/ <-> `en-US` https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/; gegenseitige Verweise und selbstreferenzierende Canonicals. Die englische Fassung muss beim Livegang um das hreflang-Paar ergänzt werden.

**Für den deutschen Markt prüfen:**
- Keine US-Rechtsbezüge im Text. Bei der Act-Checkliste (Schulung, Layered Audit) prüfen, ob ein Hinweis auf Mitbestimmung des Betriebsrats bei Schulungs- und Kontrollmaßnahmen (§ 87, § 98 BetrVG) gewünscht ist; nur nach Fachprüfung ergänzen.
- Begriffe Produktionslenkungsplan (Control Plan) und PFMEA sind in IATF-16949-Umgebungen üblich; mit der Fachprüfung abgleichen.

**Review-Log:** Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.
