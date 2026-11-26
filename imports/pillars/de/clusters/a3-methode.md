# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | A3-Methode im Lean: A3-Report, Vorlage und Beispiel (51 Zeichen) |
| Meta-Description | A3-Methode erklärt: die 7 Abschnitte eines A3-Reports, ein durchgerechnetes Beispiel mit Ursachenanalyse, Vorlage, Coaching-Fragen und typische Fehler. (151 Zeichen) |
| Slug | `/learn/lean-management/a3-methode/` (vollständige URL: https://www.m365.fm/learn/lean-management/a3-methode/) |
| Parent-Pillar | [Lean Management](https://www.m365.fm/learn/lean-management/) |
| Hauptkeyword | A3-Methode, A3-Report |
| Nebenkeywords | A3 Problemlösung, A3-Vorlage, A3 Report Beispiel, A3-Denken, A3 Lean, Toyota A3, A3 Schritte, A3 Abschnitte, Managing to Learn, John Shook A3, A3-Antrag, Status-A3, A3 vs. 8D, A3 vs. DMAIC, A3 Coaching, A3-Bericht |
| Suchintention | Informational mit starker Vorlagen- und Beispielabsicht. Zielgruppe: Ingenieure, Meister und Schichtführer, KVP- und Qualitätsverantwortliche, Führungskräfte, die A3s coachen |
| Wortzahl | Ziel 3.000 bis 5.000 Wörter (Cluster). Tatsächlich H1 bis Fazit (`wc -w`): **4.241 Wörter** (englische Fassung: 4.425) |
| Sprachversion | Deutsch (`de-DE`). hreflang-Paar: `de-DE` https://www.m365.fm/learn/lean-management/a3-methode/ <-> `en-US` https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus; deutsche Suchbegriffe wie "A3-Methode", "A3-Report" und "A3 Vorlage" sind dabei gesondert zu prüfen.

# A3-Methode: So entsteht ein A3-Report (Vorlage und durchgerechnetes Beispiel)

*Stand: November 2026 · Lesezeit: etwa 17 Minuten*

> **Kurzantwort:** Die A3-Methode (A3 Problem Solving) ist eine Praxis von Toyota: Problem, Analyse, Gegenmaßnahmen und Maßnahmenplan stehen auf einem einzigen großen Blatt Papier im Format A3 (297 × 420 mm; in den USA meist 11 × 17 in., Tabloid) [1]. Sie folgt dem PDCA-Zyklus [2][4]. Das Blatt ist der sichtbare Teil; die Methode ist ein strukturierter Dialog, in dem eine Führungskraft den A3-Verantwortlichen durch das Problem coacht [1][3].

Dieser Artikel vertieft unseren [Leitfaden zu Lean Management](https://www.m365.fm/learn/lean-management/), der den A3 im Zusammenhang des gesamten Lean-Werkzeugkastens einführt. Hier wird jeder Abschnitt des A3 erklärt, dazu kommen ein vollständig durchgerechnetes Beispiel aus der Fertigung, eine leere Vorlage, Coaching-Fragen für Führungskräfte und die Fehler, die A3s zu Papierkram machen.

> **Das Wichtigste in Kürze**
> - Der A3-Report wurde bei Toyota entwickelt; Toyota nutzt ihn für Problemlösung, Statusberichte und Planung [1].
> - Die linke Seite enthält das Problem (Hintergrund, Ist-Zustand, Ziel, Grundursache), die rechte Seite die Lösung (Gegenmaßnahmen, Plan, Nachverfolgung) [1][4].
> - Jeder A3 hat einen Verantwortlichen, dessen Initialen oben rechts stehen; er sorgt dafür, dass Entscheidungen getroffen werden, auch ohne formale Weisungsbefugnis [1].
> - Sobek und Smalley beschreiben drei Arten: Problemlösungs-, Antrags- und Status-A3 [5].
> - John Shooks *Managing to Learn* (LEI, 2008) zeigt den A3 als Mentoring-Prozess; das Buch erhielt einen Shingo-Preis [3].
> - Ein guter A3 beginnt am Gemba mit Daten, nicht mit einer Lösung.
> - Der A3 ist erst fertig, wenn die Nachverfolgung zeigt, dass das Ziel erreicht und der neue Standard eingeführt ist.

## Inhaltsverzeichnis

1. [Was ist die A3-Methode?](#was-ist-die-a3-methode)
2. [Warum ein Blatt? Das Denken hinter dem A3-Format](#warum-ein-blatt-das-denken-hinter-dem-a3-format)
3. [Aufbau eines A3-Reports: die 7 Schritte vom Hintergrund bis zur Nachverfolgung](#aufbau-eines-a3-reports-die-7-schritte-vom-hintergrund-bis-zur-nachverfolgung)
4. [Durchgerechnetes Beispiel: A3 zur Liefertreue](#durchgerechnetes-beispiel-a3-zur-liefertreue)
5. [Leere A3-Vorlage](#leere-a3-vorlage)
6. [Einen A3 coachen: der A3 als Coaching-Prozess](#einen-a3-coachen-der-a3-als-coaching-prozess)
7. [Drei Arten von A3: Problemlösung, Antrag, Status](#drei-arten-von-a3-problemlösung-antrag-status)
8. [Wann sich die A3-Methode lohnt und welchen Nutzen sie bringt](#wann-sich-die-a3-methode-lohnt-und-welchen-nutzen-sie-bringt)
9. [A3 vs. 8D vs. DMAIC](#a3-vs-8d-vs-dmaic)
10. [Typische Fehler beim A3](#typische-fehler-beim-a3)
11. [A3 auf Papier oder digital?](#a3-auf-papier-oder-digital)
12. [FAQ](#faq-a3-methode)
13. [Fazit](#fazit)

## Was ist die A3-Methode?

Das Lean Enterprise Institute (LEI) beschreibt den A3-Report als von Toyota entwickelte Praxis, Problem, Analyse, Korrekturmaßnahmen und Maßnahmenplan auf einem einzigen großen Blatt Papier festzuhalten, oft mit Grafiken [1]. Bei Toyota wurde er zum Standardweg, um Problemlösung, Statusberichte und Planungsaufgaben wie die Wertstromanalyse zusammenzufassen [1].

Die American Society for Quality (ASQ) ergänzt zwei nützliche Details: A3-Denken beruht auf dem Plan-Do-Check-Act-Zyklus, und der Report nutzt Text, Bilder, Diagramme und Grafiken, um nur das darzustellen, was für das Problem und seine Lösung relevant ist [4].

Der Name kommt vom Papier. A3 ist das internationale Papierformat 297 × 420 mm; das nächstliegende US-Format ist 11 × 17 in. Tabloid, auch Ledger genannt [1][4].

Die A3-Methode ist kein vom übrigen Lean getrenntes Werkzeug. Sie ist die Art, wie ein Durchlauf des [PDCA-Zyklus](https://www.m365.fm/learn/lean-management/pdca-zyklus/) geplant, dokumentiert und gecoacht wird. Ein [Kaizen-Workshop](https://www.m365.fm/learn/lean-management/kaizen/) kann der Do-Schritt eines A3 sein, und ein [Poka Yoke](https://www.m365.fm/learn/lean-management/poka-yoke/) ist oft seine Gegenmaßnahme.

## Warum ein Blatt? Das Denken hinter dem A3-Format

Die ganze Geschichte auf eine Seite eines Blatts zu begrenzen, erzwingt drei Dinge.

1. **Verdichtung.** Es gibt keinen Platz für jeden Datensatz; der Verantwortliche muss die Fakten wählen, auf die es ankommt. Sobek und Smalley zählen "synthesis, distillation and visualization" (Synthese, Verdichtung und Visualisierung) zu ihren sieben Elementen des A3-Denkens [5].
2. **Nachvollziehbare Logik.** Die Abschnitte laufen der Reihe nach vom Hintergrund bis zur Nachverfolgung. Ein Leser kann prüfen, ob die Gegenmaßnahme an der Grundursache ansetzt und ob die Grundursache den Ist-Zustand erklärt. Sobek und Smalley nennen das den logischen Denkprozess und "coherency within and consistency across" (Stimmigkeit innerhalb des Reports und Konsistenz über Reports hinweg) [5].
3. **Gespräch.** Ein einzelnes Blatt lässt sich zwischen zwei Menschen auf den Tisch legen. Shook beschreibt den A3-Prozess als "the key to Toyota's entire system of developing talent and continually deepening its knowledge and capabilities" (den Schlüssel zu Toyotas gesamtem System, Talente zu entwickeln und Wissen und Fähigkeiten laufend zu vertiefen) [3].

Sobek und Smalleys sieben Elemente des A3-Denkens sind: logischer Denkprozess; Objektivität; Ergebnisse und Prozess; Synthese, Verdichtung und Visualisierung; Ausrichtung (Alignment); Stimmigkeit innerhalb und Konsistenz über Reports hinweg; Systemsicht [5]. Sie betonen auch, dass das Erstellen und Steuern von A3-Reports genauso wichtig ist wie die Reports selbst [5].

## Aufbau eines A3-Reports: die 7 Schritte vom Hintergrund bis zur Nachverfolgung

Vorlagen unterscheiden sich von Unternehmen zu Unternehmen. Der folgende Aufbau folgt der Abschnittsliste der ASQ [4] und der Beschreibung des A3-Inhalts durch das LEI [1].

| Nr. | Abschnitt | Seite | Was hineingehört | PDCA |
|---|---|---|---|---|
| 0 | Titel / Thema | oben | eine kurze Problembeschreibung, keine Lösung ("Verspätete Lieferungen, Pumpenfamilie P") | Plan |
| 1 | Hintergrund | links | warum das jetzt wichtig ist; Bezug zu Unternehmenszielen; Umfang | Plan |
| 2 | Ist-Zustand | links | Fakten und Daten vom Gemba: Diagramm, Prozessskizze, Wertstromanalyse, Pareto | Plan |
| 3 | Ziel-Zustand / Ziel | links | messbares, terminiertes Ziel | Plan |
| 4 | Ursachenanalyse | links | 5 Why, Ishikawa-Diagramm (Fischgräte), Daten, die die Ursache bestätigen | Plan |
| 5 | Gegenmaßnahmen | rechts | betrachtete Optionen, die gewählten, Begründung | Plan / Do |
| 6 | Umsetzungsplan | rechts | was, wer, Termin, Status | Do |
| 7 | Nachverfolgung / Wirksamkeitsnachweis | rechts | Ergebnis gegen Ziel, Standardisierung, offene Punkte | Check / Act |

Die ASQ ordnet den Ziel-Zustand zusammen mit den Gegenmaßnahmen auf der rechten Seite an [4]; viele Vorlagen im Toyota-Stil lassen das Ziel links, unter dem Ist-Zustand. Beides funktioniert. Entscheidend ist, dass das Ziel eine Zahl mit Termin ist und festgelegt wird, bevor Gegenmaßnahmen gewählt werden.

Das LEI verweist auch auf den Verantwortlichen: Die Initialen des Autors und Verantwortlichen stehen oben rechts, und diese Person übernimmt die Verantwortung dafür, dass Entscheidungen getroffen und umgesetzt werden, auch ohne Weisungsbefugnis über jeden Teil [1].

### A3-Abschnitte und Toyotas Problemlösungsprozess in 8 Schritten

Toyota beschreibt seine praktische Problemlösung in acht Schritten [9]. Die A3-Abschnitte decken dasselbe ab; die folgende Zuordnung stammt von uns, nicht von Toyota.

| Toyota-Schritt [9] | Wo er auf dem A3 steht |
|---|---|
| 1. Problem klären | Hintergrund und Ist-Zustand |
| 2. Problem aufgliedern | Ist-Zustand (Pareto, Prozessskizze) |
| 3. Ziel setzen | Ziel |
| 4. Grundursache analysieren | Ursachenanalyse |
| 5. Gegenmaßnahmen entwickeln | Gegenmaßnahmen |
| 6. Gegenmaßnahmen umsetzen | Umsetzungsplan |
| 7. Ergebnisse und Prozess bewerten | Nachverfolgung |
| 8. Erfolgreiche Prozesse standardisieren | Nachverfolgung (Standardisierung) |

## Durchgerechnetes Beispiel: A3 zur Liefertreue

Die Daten sind ein Beispiel zur Veranschaulichung. Verantwortlicher: Fertigungsingenieur Pumpenmontage. Mentor: Wertstromverantwortlicher.

**1. Thema:** Verspätete Lieferungen der Pumpenfamilie P

**2. Hintergrund.** Die Pumpenfamilie P macht 38 % des Werksumsatzes aus. Die Liefertreue (On-Time Delivery, OTD) zum Wunschtermin des Kunden fiel von 96 % im zweiten auf 88 % im dritten Quartal. Zwei Schlüsselkunden haben Lieferantenbewertungen im gelben Bereich ausgestellt; einer hat eine Korrekturmaßnahme angefordert. Umfang: Familie P von der Auftragsfreigabe bis zum Versand.

**3. Ist-Zustand (Q3, 13 Wochen).**

- Versandte Aufträge: 433. Verspätet: 52. OTD = 381 / 433 = **88,0 %**.
- Pareto der 52 verspäteten Aufträge nach erster Ursache:

| Ursache | Verspätete Aufträge | Anteil | Kumuliert |
|---|---|---|---|
| Warten auf bearbeitete Gehäuse | 29 | 56 % | 56 % |
| Prüfstandsfehler und Wiederholprüfung | 12 | 23 % | 79 % |
| Kaufteile fehlen | 7 | 13 % | 92 % |
| Sonstiges | 4 | 8 % | 100 % |

- Beobachtung am Gemba im Bearbeitungszentrum für Gehäuse (eine Fünf-Achs-Maschine, vier Gehäusevarianten, Bedarf 50 je Variante und Woche): Jede Variante läuft in Losen von 200, das entspricht etwa vier Wochen Reichweite. Rüstvorgänge dauern 180 Minuten; Vorrichtungen und Werkzeuge werden vorbereitet, während die Maschine steht.

**4. Ziel.** OTD der Familie P bei 95 % oder mehr bis 28. Februar, wöchentlich gemessen; keine Zunahme der Überstunden.

Bei 433 Aufträgen pro Quartal erlauben 95 % höchstens 21 verspätete Aufträge (433 × 0,05 = 21,7). Allein die Gehäuseursache zu beseitigen, ließe 23 verspätete Aufträge übrig, eine OTD von 410 / 433 = 94,7 %, knapp darunter. Der Verantwortliche hält das auf dem A3 fest: Die Gehäuse sind notwendig, aber nicht hinreichend; auch die Prüfstandsfehler müssen sinken.

**5. Ursachenanalyse (Zweig Gehäuse, 5 Why).**

| Warum? | Antwort | Beleg |
|---|---|---|
| Warum warten Montagen auf Gehäuse? | die benötigte Variante ist oft nicht am Lager | Fehlmengenprotokoll: 31 Fehlmengen in Q3 |
| Warum ist sie nicht am Lager? | jede Variante wird nur alle vier Wochen gefertigt | Planungshistorie |
| Warum alle vier Wochen? | Losgröße 200 je Variante | Arbeitsplan und Planung |
| Warum so große Lose? | jeder Rüstvorgang kostet 180 Minuten Maschinenzeit | 10 gestoppte Rüstvorgänge |
| Warum 180 Minuten? | die gesamte Vorbereitung von Vorrichtungen und Werkzeugen läuft bei stehender Maschine; kein Rüststandard | Video des Rüstvorgangs, es gibt keinen Rüststandard |

Grundursache: internes Rüsten, das sich extern erledigen ließe, und kein Rüststandard.

Eine 5-Why-Kette folgt einem Pfad; echte Probleme haben oft mehrere. Deshalb trägt jede Antwort in der Tabelle einen Beleg, und deshalb prüft der Verantwortliche die anderen Pareto-Zweige gesondert, statt anzunehmen, eine Grundursache erkläre alles. Der Zweig Prüfstand bekommt eine eigene kurze Analyse (eine undichte Dichtungsvorrichtung erklärt 8 der 12 Fehler, bestätigt durch Zerlegung).

**6. Betrachtete Gegenmaßnahmen.**

| Option | Wirkung auf die Ursache | Kosten | Zeit bis zur Wirkung | Entscheidung |
|---|---|---|---|---|
| A. Samstagsüberstunden am Bearbeitungszentrum | keine (mehr Kapazität, gleiche Lose) | etwa 2.600 USD pro Woche [Beispiel] | sofort | nur als befristete Überbrückung, max. 4 Wochen |
| B. SMED: Werkzeuge extern voreinstellen, Vorrichtungswagen, Rüststandard | beseitigt die Grundursache | etwa 9.000 USD (Wagen, zweiter Vorrichtungssatz, Zeit am Voreinstellgerät) [Beispiel] | 4 bis 6 Wochen | **gewählt** |
| C. Zweites Bearbeitungszentrum | verdeckt die Ursache | etwa 450.000 USD Investition [Beispiel] | 9 bis 12 Monate | verworfen |
| D. Dichtungsvorrichtung am Prüfstand ersetzen | beseitigt die Prüfstandsursache | etwa 1.200 USD | 2 Wochen | **gewählt** |

Option B rechnet sich schnell: 9.000 USD / 2.600 USD pro Woche vermiedener Samstagsüberstunden ≈ 3,5 Wochen, und sie vermeidet die Investition von 450.000 USD aus Option C. Mit Rüstzeiten von 45 statt 180 Minuten kann die Maschine Lose von 50 (eine Woche Reichweite) bei gleicher gesamter Rüstzeit pro Woche fahren: vorher 200 Gehäuse pro Woche / 200 je Los = 1 Rüstvorgang × 180 min = 180 min; nachher 200 / 50 = 4 Rüstvorgänge × 45 min = 180 min. Die Reichweite sinkt von vier Wochen auf eine. Die Methode behandelt der [Leitfaden zu SMED](https://www.m365.fm/learn/smed-ruestzeitreduzierung/) (geplant).

**7. Umsetzungsplan.**

| Nr. | Maßnahme | Verantwortlich | Termin | Status |
|---|---|---|---|---|
| 1 | Überbrückung: Samstagsschicht am Bearbeitungszentrum | Fertigungsmeister | 1. bis 28. Dez. | erledigt |
| 2 | Rüstvorgang filmen und analysieren; intern/extern trennen | Ingenieur + Einrichter | 8. Dez. | erledigt |
| 3 | Vorrichtungswagen bauen, zweiten Vorrichtungssatz kaufen | Instandhaltung, Einkauf | 9. Jan. | erledigt |
| 4 | Rüststandard schreiben und schulen, alle Schichten | Leiter Einrichter | 16. Jan. | erledigt |
| 5 | Losgröße im ERP auf 50 ändern, Kanban anpassen | Disponent | 19. Jan. | erledigt |
| 6 | neue Dichtungsvorrichtung am Prüfstand | Prüfingenieur | 15. Dez. | erledigt |

**8. Nachverfolgung.** Wöchentliche OTD nach der Umsetzung (19. Januar bis 28. Februar, sechs Wochen): im Mittel 93,8 %. Ziel noch nicht erreicht. Check zeigt: Die Gehäuseursache ist fast auf null gesunken, die Prüfstandsfehler haben sich halbiert, aber die Fehlmengen bei Kaufteilen sind gestiegen, weil die kleineren Lose die Teile häufiger abrufen. Der Verantwortliche startet mit dem Einkauf einen zweiten PDCA-Durchlauf zu den zwei betroffenen Teilen; Ende März liegt der Sechs-Wochen-Mittelwert bei 96,1 %. Der Rüststandard wird zur Standardarbeit für alle Einrichter und zusammen mit der neuen Losgröße in das Layered Audit des Bereichs aufgenommen. Offener Punkt: Der Rüstvorgang liegt bei 52 Minuten, nicht bei 45; das nächste Kaizen ist geplant.

Diese Nachverfolgung ist typisch: Die ersten Gegenmaßnahmen wirken auf die anvisierte Ursache, das Ziel wird trotzdem verfehlt, und der zweite Zyklus findet, was der erste verschoben hat. Ein A3, der nach dem ersten Zyklus "Ziel erreicht" meldet, ist nicht immer falsch, aber ein Mentor sollte fragen, woher der Verantwortliche das weiß.

## Leere A3-Vorlage

Auf A3 (297 × 420 mm; in den USA 11 × 17 in., Tabloid) im Querformat drucken. Mit Bleistift schreiben.

| LINKE SEITE | RECHTE SEITE |
|---|---|
| **Titel** (das Problem, nicht die Lösung) · Verantwortlicher (Initialen, oben rechts) · Mentor · Datum / Version | |
| **1. Hintergrund:** Warum ist das jetzt wichtig? Welches Unternehmensziel ist betroffen? Umfang? | **5. Gegenmaßnahmen:** betrachtete Optionen, wie jede an der Grundursache ansetzt, Kosten, Zeit, Entscheidung |
| **2. Ist-Zustand:** Was passiert am Gemba, in Zahlen? Diagramm, Skizze, Pareto. Wie groß ist die Lücke? | **6. Umsetzungsplan:** was, wer, wann, Status |
| **3. Ziel:** messbar, terminiert. Woran erkennen wir den Erfolg? | **7. Nachverfolgung:** Ergebnis gegen Ziel (Diagramm), was standardisiert wurde, was noch offen ist, was wir gelernt haben |
| **4. Ursachenanalyse:** 5 Why oder Ishikawa; Daten, die die Ursache bestätigen | **Sofortmaßnahme (optional):** Maßnahmen, die den Kunden schützen, bis die Gegenmaßnahmen wirken · **Freigaben / Review-Notizen** |

## Einen A3 coachen: der A3 als Coaching-Prozess

Das LEI betont, dass der A3 auch eine Führungsdisziplin ist: Eine Führungskraft fordert eine Mitarbeiterin oder einen Mitarbeiter heraus, ein Problem zu lösen, und coacht durch Fragen statt durch Antworten, während die Verantwortung für das Sammeln der Fakten und den Aufbau von Konsens bei der Mitarbeiterin oder dem Mitarbeiter bleibt [1]. Shook, der 11 Jahre für Toyota in Japan und den USA gearbeitet hat [3], hat *Managing to Learn* ganz darauf aufgebaut: Jede Doppelseite zeigt auf der einen Seite die Versuche eines Managers, einen A3 zu schreiben, und auf der anderen die Fragen seines Vorgesetzten [3]. In seinem Artikel "Toyota's Secret: The A3 Report" in der MIT Sloan Management Review von 2009 argumentiert Shook, dass es um mehr geht als um das aktuelle Problem: A3s sollen Problemlösung transparent und lehrbar machen [6].

**Coaching-Fragen für jeden Abschnitt** [Fragen für diesen Leitfaden zusammengestellt, im Sinne von [1] und [3]]

| Abschnitt | Fragen, die ein Mentor stellt |
|---|---|
| Thema | Ist das das Problem oder eine verkleidete Lösung? Würde der Kunde es wiedererkennen? |
| Hintergrund | Warum dieses Problem, warum jetzt? Was passiert, wenn wir nichts tun? |
| Ist-Zustand | Haben Sie es selbst gesehen? Was sagen die Werker? Was zeigen die Daten im Zeitverlauf, nicht nur im Mittel? |
| Ziel | Ist es messbar? Ambitioniert, aber erreichbar? Wer hat zugestimmt? |
| Grundursache | Woher wissen Sie, dass das die Ursache ist und kein Symptom? Lässt sich das Problem gezielt ein- und ausschalten? Welche Daten bestätigen es? |
| Gegenmaßnahmen | Welche anderen Optionen haben Sie betrachtet? Setzt jede Gegenmaßnahme an einer Grundursache an? Welche Beteiligten sind betroffen, und haben Sie mit ihnen gesprochen? |
| Plan | Wem gehört jede Maßnahme? Was könnte sie verzögern? |
| Nachverfolgung | Hat das Ergebnis das Ziel erreicht? Wenn nicht, warum nicht? Was haben wir standardisiert? Was würden Sie anders machen? |

Die Regel für Mentoren ist einfach: fragen, nicht schreiben. Schreibt der Mentor den A3 um, lernt der Verantwortliche nichts und bringt das Problem beim nächsten Mal zum Mentor, statt es zu lösen.

**Respekt vor dem Verantwortlichen.** Nach unserer Erfahrung schützt das Format auch den Verantwortlichen: Die Diskussion dreht sich um die Fakten auf dem Blatt, nicht darum, wer schuld ist. Das LEI merkt an, dass der Prozess Entscheidungen vom Streit darüber, wer zuständig ist, hin zur Diskussion darüber verschiebt, was das Richtige ist [1].

## Drei Arten von A3: Problemlösung, Antrag, Status

Sobek und Smalley beschreiben drei Hauptarten [5]; die ASQ nennt dieselben drei und bezeichnet die Statusform als Storyboard [4].

| Art | Zweck | Typische Abschnitte | Beispiel |
|---|---|---|---|
| Problemlösungs-A3 | eine Lücke zwischen Ist und Standard schließen | Hintergrund, Ist-Zustand, Ziel, Grundursache, Gegenmaßnahmen, Plan, Nachverfolgung | verspätete Lieferungen, Ausschuss, Stillstand |
| Antrags-A3 (Proposal A3) | eine Entscheidung über eine neue Initiative oder Investition herbeiführen | Hintergrund, Ist-Zustand, Vorschlag, Analyse der Optionen, Kosten und Nutzen, Plan, offene Fragen | neue Maschine, neues Layout, Softwareeinführung |
| Status-A3 | über den Fortschritt eines Projekts oder Plans berichten | Hintergrund, Plan gegen Ist, Ergebnisse, offene Punkte, nächste Schritte | Hoshin-Review im Quartal, Projektreview |

Das LEI nennt außerdem A3s für Planungsaufgaben wie Wertstromanalyse und Strategieentfaltung [1]. Ein Projekt zur [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/) endet oft in einem Antrags-A3 für den Soll-Zustand.

## Wann sich die A3-Methode lohnt und welchen Nutzen sie bringt

Ein A3 passt, wenn ein Problem zu groß für eine schnelle Abhilfe an der Linie ist, aber kein vollständiges Statistikprojekt braucht:

- die Lücke ist messbar und wiederkehrend, etwa verspätete Aufträge, Ausschuss oder Stillstand an einer Linie;
- die Ursache ist noch unbekannt, oder mehrere Ursachen konkurrieren;
- die Lösung braucht Einigkeit über Abteilungen hinweg, zum Beispiel zwischen Konstruktion, Einkauf und Produktion;
- es soll ein Mensch entwickelt werden, nicht nur ein Problem geschlossen: Der A3-Verantwortliche lernt Problemlösung mit einem Mentor [1][3].

Für ein einmaliges Problem, das ein Teamleiter innerhalb der Schicht beheben kann, ist kein A3 nötig; steckt die Ursache in Prozessstreuung, ist DMAIC die bessere Wahl (siehe Vergleich unten).

Der Nutzen ergibt sich aus dem Format. Ein knappes Blatt zwingt den Verantwortlichen, die wichtigen Fakten auszuwählen; die Logik von links nach rechts lässt jeden prüfen, ob die Gegenmaßnahmen an der Grundursache ansetzen; und der A3-Prozess gibt Führungskräften einen strukturierten Weg, zu coachen, statt Antworten zu verteilen [1][5]. Außerdem entsteht eine Dokumentation: Eine Sammlung abgeschlossener A3s zeigt, was das Werk gelernt hat, und ein Status-A3 kann in einem Review einen langen Foliensatz ersetzen. Der Hauptaufwand ist Zeit. Ein guter A3 braucht Arbeit am Gemba, Daten und mehrere Coaching-Gespräche; daher sollte jeder Verantwortliche nur ein oder zwei aktive A3s haben.

## A3 vs. 8D vs. DMAIC

| | A3 | 8D | DMAIC |
|---|---|---|---|
| Herkunft | Toyota [1] | Fords Handbuch *Team Oriented Problem Solving* (TOPS), erstmals 1987 veröffentlicht; verbreitet in der Automobilindustrie [8] | Six Sigma |
| Auslöser | jede Lücke, Verbesserung oder jeder Antrag | Kundenreklamation oder Fehlerschlupf | chronisches Streuungsproblem |
| Sofortmaßnahme | optionaler Abschnitt | eigene Disziplin (D3) | keine formale Phase |
| Datentiefe | mittel, visuell | mittel | hoch, statistisch |
| Format | ein Blatt | mehrseitiger Bericht, oft ein Kundenformular | Projektauftrag (Charter) plus Phasenabnahmen (Tollgates) |
| Typische Dauer | Wochen bis wenige Monate | Tage für die Sofortmaßnahme, Wochen bis zum Abschluss | Monate |
| Stärke | Denken und Coaching | kundengerechter Abschluss | statistische Strenge |

Der A3 passt für interne Probleme und Anträge, der 8D, wenn ein Kunde ihn verlangt, und DMAIC, wenn die Ursache in Streuung steckt, die nur Statistik findet. Der [Leitfaden zu Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant) behandelt DMAIC und die Werkzeuge der Ursachenanalyse ausführlich. Viele Qualitätsteams übertragen einen internen A3 bei Bedarf in das 8D-Formular des Kunden.

## Typische Fehler beim A3

| Fehler | Symptom | Abhilfe |
|---|---|---|
| Lösung im Titel | "Zweite Maschine installieren" | das Problem benennen; Optionen kommen später |
| am Schreibtisch geschrieben | keine Daten vom Gemba, nur ERP-Berichte | hingehen und sehen; mit den Werkern sprechen |
| vages Ziel | "OTD verbessern" | Zahl plus Termin: "≥ 95 % bis 28. Feb." |
| Symptom als Grundursache | "Bedienfehler" | fragen, warum der Prozess den Fehler zugelassen hat; Poka Yoke erwägen |
| eine Gegenmaßnahme, keine Optionen | kein Vergleich, kein Lernen | mindestens zwei Optionen mit Kosten und Wirkung |
| Gegenmaßnahme passt nicht zur Ursache | neue Software für ein Rüstproblem | jede Gegenmaßnahme auf eine Ursache auf der linken Seite zurückführen |
| A3 bei "Maßnahmen erledigt" geschlossen | keine Wirksamkeitsprüfung | erst schließen, wenn das Ziel erreicht und der Standard eingeführt ist |
| Mentor schreibt den A3 | Verantwortlicher klinkt sich aus | fragen, nicht schreiben [1][3] |
| A3 als Formular fürs Audit | Seiten voller Kästchen, keine Geschichte | ein Blatt, Bleistift, Überarbeitungen sichtbar |
| zu viele A3s pro Person | keiner wird fertig | ein oder zwei aktive A3s pro Verantwortlichem |

## A3 auf Papier oder digital?

Papier im Format A3 (in den USA 11 × 17 in.) hält den A3 kurz und lädt während des Coachings zu Korrekturen mit dem Bleistift ein; deshalb beginnen viele Lean-Coaches mit Papier. Digitale A3s (eine Tabellenkalkulation, eine Folie, ein geteiltes Dokument oder ein A3-Modul in einer KVP-Software) helfen, wenn Verantwortliche und Mentoren an verschiedenen Standorten sitzen, wenn das Unternehmen eine durchsuchbare Sammlung will oder wenn ein Prüfpfad verlangt ist, zum Beispiel in Umgebungen nach AS9100 oder IATF 16949. Auch digital gilt die Begrenzung auf eine Seite: Ein digitaler A3, der auf 15 Folien anwächst, hat den Sinn verfehlt. Daten, die sich automatisch aktualisieren, etwa die OTD aus dem ERP oder Stillstände aus dem MES, können die Diagramme für Ist-Zustand und Nachverfolgung speisen; der [Leitfaden zu Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/) erklärt die gängigen Definitionen.

## FAQ: A3-Methode

### Was ist die A3-Methode?

Ein bei Toyota entwickelter strukturierter Ansatz zur Problemlösung und kontinuierlichen Verbesserung, bei dem Problem, Analyse, Gegenmaßnahmen und Maßnahmenplan auf einem Blatt im Format A3 festgehalten und mit einem Mentor erarbeitet werden [1]. Er folgt dem PDCA-Zyklus [4].

### Wofür steht A3?

Für das Papierformat: A3 misst nach internationaler Norm 297 × 420 mm; das nächstliegende US-Format ist 11 × 17 in. Tabloid [1].

### Welche Schritte (Abschnitte) hat ein A3?

Sieben Abschnitte plus Titel: Hintergrund, Ist-Zustand, Ziel, Ursachenanalyse, Gegenmaßnahmen, Umsetzungsplan und Nachverfolgung [1][4]. Vorlagen gruppieren sie unterschiedlich.

### Wer hat den A3-Report erfunden?

Er ist eine Praxis von Toyota [1]. Im Westen bekannt wurde er vor allem durch John Shooks *Managing to Learn* (2008) und Sobek und Smalleys *Understanding A3 Thinking* (2008) [3][5].

### Welche Arten von A3-Reports gibt es?

Problemlösungs-, Antrags- und Status-A3 [5]. Die ASQ nennt die dritte Form Storyboard [4].

### Was ist der Unterschied zwischen A3 und 8D?

Der A3 ist ein einseitiges Denk- und Coaching-Format für jedes Problem; der 8D ist ein mehrstufiger Bericht mit eigener Sofortmaßnahme, den Automobilkunden nach einer Reklamation oft verlangen. Beide lassen sich kombinieren: das Problem auf einem A3 bearbeiten und im 8D-Formular des Kunden berichten.

### Was ist der Unterschied zwischen A3 und DMAIC?

DMAIC ist eine längere Six-Sigma-Projektmethode mit statistischer Analyse und Phasenabnahmen; der A3 ist leichter und wird für die meisten Alltagsprobleme genutzt. Ein DMAIC-Projekt lässt sich auf einem Status-A3 zusammenfassen.

### Wie lange dauert ein A3?

Von wenigen Wochen für ein abgegrenztes Problem bis zu mehreren Monaten für ein komplexes; das Beispiel oben dauerte etwa vier Monate, einschließlich eines zweiten PDCA-Durchlaufs. Die erste Fassung zu schreiben, dauert Stunden; die Zeit fließt in die Beobachtung am Gemba, die Bestätigung der Grundursache und die Nachverfolgung [unbelegt: Praxisschätzung].

### Was ist A3-Denken?

Die Denkweise hinter dem Report. Sobek und Smalley beschreiben sieben Elemente: logischer Denkprozess; Objektivität; Ergebnisse und Prozess; Synthese, Verdichtung und Visualisierung; Ausrichtung; Stimmigkeit innerhalb und Konsistenz über Reports hinweg; und Systemsicht [5].

### Welche 8 Schritte hat Toyotas Problemlösungsmethode?

Toyota nennt acht Schritte: Problem klären, Problem aufgliedern, Ziel setzen, Grundursache analysieren, Gegenmaßnahmen entwickeln, Gegenmaßnahmen umsetzen, Ergebnisse und Prozess bewerten und erfolgreiche Prozesse standardisieren [9]. Ein A3-Report dokumentiert diese Schritte auf einem Blatt; die Tabelle im Kapitel zum Aufbau ordnet sie den A3-Abschnitten zu.

### Ist die A3-Methode dasselbe wie PDCA?

Nicht dasselbe, aber darauf aufgebaut. PDCA ist der Verbesserungszyklus; der A3 ist das Format und der Coaching-Prozess, der einen Durchlauf davon dokumentiert, mit Plan auf der linken Seite und Do, Check und Act auf der rechten [4][5].

### Was ist der Unterschied zwischen A3 und Kaizen?

Kaizen ist kontinuierliche Verbesserung im Allgemeinen, von kleinen täglichen Ideen bis zu fünftägigen [Kaizen-Workshops](https://www.m365.fm/learn/lean-management/kaizen/). Ein A3 ist ein strukturierter Problemlösungsbericht für ein Problem. Beide arbeiten zusammen: Ein A3 nennt oft einen Kaizen-Workshop als Gegenmaßnahme, und das Ergebnis eines Kaizen-Workshops lässt sich auf einem A3 dokumentieren.

### Lässt sich A3 auch außerhalb der Produktion nutzen?

Ja. Das A3-Forschungsprojekt der Montana State University berichtet von einem Krankenhausteam, das die Transportzeit von Patienten von durchschnittlich 45 Minuten auf unter 10 Minuten senkte [7], und Mark Grabans Zusammenfassung von Shooks Artikel von 2009 erwähnt Krankenhäuser, die A3s nutzen [6].

## Fazit

Der A3-Report ist ein Blatt Papier, aber die A3-Methode ist eine Denkweise und eine Art zu führen. Das Blatt macht die Logik sichtbar: von Hintergrund über Ist-Zustand, Ziel und Grundursache auf der linken Seite zu Gegenmaßnahmen, Plan und Nachverfolgung auf der rechten. Das Coaching lässt die Logik haften: Ein Mentor, der Fragen stellt, statt Antworten zu verteilen, entwickelt Menschen, die das nächste Problem allein lösen können. Am Anfang stehen ein echtes Problem, ein Verantwortlicher, ein Mentor und ein Bleistift. Geschlossen wird der A3 erst, wenn die Nachverfolgung zeigt, dass das Ziel erreicht und der neue Standard eingeführt ist.

**Die nächsten Schritte**

- [ ] Ein Problem mit messbarer Lücke und einem namentlich Verantwortlichen wählen
- [ ] An den Gemba gehen und Daten zum Ist-Zustand sammeln, bevor irgendetwas anderes geschrieben wird
- [ ] Mit dem Mentor ein zahlenmäßiges, terminiertes Ziel festlegen
- [ ] Die Grundursache mit Daten bestätigen, dann mindestens zwei Gegenmaßnahmen vergleichen
- [ ] Den A3 wöchentlich mit dem Mentor anhand der Coaching-Fragen besprechen
- [ ] Erst schließen, wenn die Nachverfolgung zeigt, dass das Ziel erreicht und der Standard aktualisiert ist

---

## Weiterlesen auf m365.fm

**Übergeordneter Leitfaden**
- [Lean Management: Prinzipien, Werkzeuge, Einführung und Grenzen](https://www.m365.fm/learn/lean-management/)

**Weitere Vertiefungen zu Lean**
- [PDCA-Zyklus](https://www.m365.fm/learn/lean-management/pdca-zyklus/) (geplant)
- [Kaizen und Kaizen-Workshops](https://www.m365.fm/learn/lean-management/kaizen/) (geplant)
- [Poka Yoke und Fehlervermeidung](https://www.m365.fm/learn/lean-management/poka-yoke/) (geplant)

**Verwandte Leitfäden**
- [Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant)
- [SMED und Rüstzeitreduzierung](https://www.m365.fm/learn/smed-ruestzeitreduzierung/) (geplant)
- [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)
- [Shopfloor Management und Gemba Walks](https://www.m365.fm/learn/shop-floor-management/)
- [Operational Excellence](https://www.m365.fm/learn/operational-excellence/)

**Glossarbegriffe (Entities)**
[A3-Methode](https://www.m365.fm/entity/a3-problem-solving/) · [Lean Management](https://www.m365.fm/entity/lean-management/) · [Gemba Walk](https://www.m365.fm/entity/gemba-walk/) · [Wertstromanalyse](https://www.m365.fm/entity/value-stream-mapping/)

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Lean Management, Operational Excellence und die digitale Transformation der Produktion. [Redaktion: Rolle, Kurzbiografie und Foto ergänzen.]

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Quellen

Alle Quellen abgerufen am 20. November 2026.

1. A3 Report. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/a3-report/
2. Plan, Do, Check, Act (PDCA). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/pdca/
3. Shook, J.: Managing to Learn: Using the A3 Management Process to Solve Problems, Gain Agreement, Mentor and Lead. Lean Enterprise Institute, 2008, 138 S., ISBN 9781934109205 (ausgezeichnet mit dem Shingo Research and Professional Publication Award). https://www.lean.org/store/book/managing-to-learn/
4. A3 Report. American Society for Quality (ASQ). https://asq.org/quality-resources/a3-report
5. Sobek, D. K. II; Smalley, A.: Understanding A3 Thinking: A Critical Component of Toyota's PDCA Management System. Productivity Press, 2008, 184 S., ISBN 9781563273605 (Shingo Research and Professional Publication Prize 2009). Routledge. https://www.routledge.com/Understanding-A3-Thinking-A-Critical-Component-of-Toyotas-PDCA-Management/Sobek-II-Smalley/p/book/9781563273605
6. Shook, J.: Toyota's Secret: The A3 Report. MIT Sloan Management Review, Sommer 2009; Zusammenfassung und Zitate über Lean Blog (Mark Graban). https://www.leanblog.org/2009/07/john-shook-on-a3-reports-in-sloan
7. A3 Process. Montana State University (A3-Forschungsprojekt, NSF-Förderung 0115352). https://www.montana.edu/dsobek/a3/index.html
8. Eight disciplines problem solving. Wikipedia (Abschnitt zur Geschichte, mit Verweis auf Fords 8-D Problem Solving Overview). https://en.wikipedia.org/wiki/Eight_disciplines_problem_solving (abgerufen am 20. November 2026)
9. Problem Solving Through Toyota Lean Management. Blog von Toyota Forklifts (Toyota Material Handling, USA), 10. Juni 2021. https://www.toyotaforklift.com/resource-library/blog/toyota-solutions/problem-solving-through-toyota-lean-management (aufgerufen am 23. November 2026 für den SERP-Re-Check; nennt die acht Schritte wie zitiert)

# Prüfhinweise für die Redaktion

**URL-Schema:** verschachtelte Cluster-URL laut Übersetzungs-Brief; eine Annahme über die finale CMS-Struktur.

**Herstellerangaben:** keine.

**[unbelegt]-Stellen:** Zeitbedarf für einen A3 (Praxisschätzung). Die Coaching-Fragen sind für diesen Leitfaden zusammengestellt und so gekennzeichnet. Die 8D-Herkunft bei Ford (TOPS, 1987) ist über [8] belegt (Wikipedia mit Verweis auf Ford-Material; die genaue Geschichte des 8D gilt als umstritten).

**Zitate:** Die englischen Originalzitate von Sobek/Smalley und Shook stehen im Text mit deutscher Übersetzung in Klammern. Falls eine deutsche Buchausgabe zitiert werden soll, Wortlaut daraus übernehmen.

**Rechenbeispiel:** Beispielzahlen, nachgerechnet wie in der englischen Fassung (381 / 433 = 88,0 %; 433 × 0,05 = 21,65 → max. 21; 410 / 433 = 94,7 %; Pareto 55,8 / 23,1 / 13,5 / 7,7 %; Rüstlast 1 × 180 = 4 × 45 = 180 min; Reichweite 4 Wochen → 1 Woche; Amortisation Option B 9.000 / 2.600 = 3,46 Wochen). Kosten der Optionen A bis C sind als [Beispiel] gekennzeichnet. Den A3 als Grafik zeigen, nicht nur als Tabelle.

**Quellenhinweise:** [6] wird über Mark Grabans Zusammenfassung zitiert; im CMS nach Möglichkeit auf die Seite der MIT SMR verlinken. [3] und [5] sind Verlagsseiten.

**iFAKT:** im Artikeltext nicht erwähnt; Offenlegung nur in der Autorenbox.

**Interne Links (Text):** Parent-Pillar Lean Management (erste 150 Wörter), Geschwister PDCA-Zyklus, Kaizen, Poka Yoke; Pillars Wertstromanalyse, Produktionskennzahlen, SMED (neu), Six Sigma (neu). Neue URLs sind geplant; nach Veröffentlichung aktivieren.

**Kannibalisierung:** Die Lean-Management-Pillar hat einen kurzen Abschnitt zur A3-Methode. Dieser Cluster besetzt "A3-Report", "A3-Vorlage", "A3 Beispiel". Die Entity-Seite `/entity/a3-problem-solving/` ist ein Glossareintrag und sollte hierher verlinken.

**JSON-LD-Vorschlag:** wie in der englischen Fassung (`TechArticle` mit `about.sameAs` auf die Entity-Seite, `FAQPage`, `BreadcrumbList`) mit `inLanguage: de-DE`, deutscher `headline` ("A3-Methode: So entsteht ein A3-Report (Vorlage und durchgerechnetes Beispiel)"), `mainEntityOfPage` https://www.m365.fm/learn/lean-management/a3-methode/, `isPartOf` https://www.m365.fm/learn/lean-management/, deutschen FAQ-Fragen und -Antworten (ohne [n]). Breadcrumb: Start > Learn > Lean Management > A3-Methode.

**Empfohlene Grafiken:** (1) das Beispiel als ausgefülltes A3-Blatt (Querformat, lesbar bei 1.200 px Breite); (2) leere A3-Vorlage als PDF zum Herunterladen (A3 und 11 × 17 in.); (3) Pareto-Diagramm der 52 verspäteten Aufträge; (4) Verlaufsdiagramm der OTD mit Ziellinie, erster Zyklus bei 93,8 %, zweiter bei 96,1 %. Beschriftungen auf Deutsch, Dezimalkomma.

**hreflang:** `de-DE` https://www.m365.fm/learn/lean-management/a3-methode/ <-> `en-US` https://www.m365.fm/en/learn/lean-manufacturing/a3-problem-solving/; gegenseitige Verweise und selbstreferenzierende Canonicals. Die englische Fassung muss beim Livegang um das hreflang-Paar ergänzt werden.

**Für den deutschen Markt prüfen:**
- Keine US-Rechtsbezüge im Text. Beim Absatz zu digitalen A3s (durchsuchbare Sammlung, Prüfpfad, automatisch gespeiste Daten) prüfen, ob ein Hinweis auf Datenschutz und Mitbestimmung des Betriebsrats bei technischen Einrichtungen (§ 87 Abs. 1 Nr. 6 BetrVG) sinnvoll ist; nur nach Fachprüfung ergänzen.
- Im deutschen Sprachraum ist die Ishikawa-Methode (Fischgräte) oft als "7M"/"5M" bekannt; prüfen, ob ein Hinweis gewünscht ist.

**Review-Log:** Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.
