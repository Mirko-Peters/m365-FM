# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Resiliente Lieferketten: Risikobewertung und Puffer (51 Zeichen) |
| Meta-Description | Resiliente Lieferketten in der Produktion: Lieferantenrisiko-Matrix, Time to Survive vs. Time to Recover, strategischer Bestand, SCOR DS, Praxisplan. (149 Zeichen) |
| Slug | `/learn/operational-excellence/resiliente-lieferketten/` (vollständige URL: https://www.m365.fm/learn/operational-excellence/resiliente-lieferketten/) |
| Parent-Pillar | [Operational Excellence](https://www.m365.fm/learn/operational-excellence/) |
| Hauptkeyword | resiliente Lieferketten |
| Nebenkeywords | Supply Chain Resilienz, Lieferkettenresilienz, Lieferantenrisikomanagement, Risikobewertung Lieferanten, Lieferantenrisiko-Matrix, Single Sourcing Risiko, Dual Sourcing, strategischer Bestand, Sicherheitsbestand berechnen, Time to Recover, Time to Survive, SCOR-Modell, Lieferengpass, Lieferkettenstörung Beispiele |
| Suchintention | Informational mit praktischer Ebene (Werksleitung, Produktionsleitung, Einkauf und Supply-Chain-Management, die eine Methode brauchen, nicht nur eine Definition) |
| Wortzahl | 4.383 Wörter (`wc -w` H1 bis Fazit; englische Fassung: 4.506) |
| Sprachversion | `de-DE`. hreflang-Paar: `de-DE` https://www.m365.fm/learn/operational-excellence/resiliente-lieferketten/ <-> `en-US` https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus.

---

# Resiliente Lieferketten in der Produktion: Risikobewertung, Puffer und ein Praxisplan für das Werk

*Stand: 20. November 2026 · Lesezeit: etwa 20 Minuten*

*Ein Cluster-Artikel des m365.fm-Leitfadens [Operational Excellence](https://www.m365.fm/learn/operational-excellence/).*

> **Kurzantwort:** Supply Chain Resilienz ist die Fähigkeit eines Herstellers, Kunden weiter zu beliefern, wenn ein Lieferant, eine Route oder eine Region ausfällt, und sich danach schnell zu erholen. Im Werk läuft das je kritischem Teil auf drei Fragen hinaus: Wie lange können wir ohne das Teil weiter ausliefern (Time to Survive), wie lange dauert es, bis die Versorgung wieder steht (Time to Recover), und was schließt die Lücke am günstigsten?

> **Das Wichtigste in Kürze**
> - Störungen sind häufig. Eine Analyse des McKinsey Global Institute ergab, dass Unternehmen im Durchschnitt etwa alle 3,7 Jahre mit Lieferunterbrechungen von einem Monat oder länger konfrontiert sind [1].
> - Risiken je Teil bewerten, nicht je Lieferant: Wahrscheinlichkeit × Auswirkung × Wiederherstellbarkeit ergibt eine Rangfolge, mit der sich innerhalb einer Woche arbeiten lässt.
> - Statistischer Sicherheitsbestand deckt Schwankungen von Bedarf und Wiederbeschaffungszeit ab. Einen 20-wöchigen Lieferantenausfall deckt er nicht. Dafür braucht es einen separaten, bewusst dimensionierten strategischen Bestand oder eine zweite Quelle.
> - Die jährlichen Kosten eines Puffers oder einer zweiten Quelle mit dem erwarteten Verlust vergleichen. Im Rechenbeispiel unten kosten sowohl ein strategischer Bestand als auch eine zweite Quelle pro Jahr weniger als der erwartete Verlust.
> - Kleine und mittlere Werke bekommen Hilfe, in den USA etwa von den NIST-MEP-Zentren mit Lieferkettenkartierung, Risikobewertung und einem landesweiten Lieferantensuchdienst [2].

Dieser Artikel ist ein Cluster des Leitfadens [Operational Excellence](https://www.m365.fm/learn/operational-excellence/) auf m365.fm. Der Pillar beschreibt das Managementsystem für kontinuierliche Verbesserung. Diese Vertiefung wendet es auf den Teil des Wertstroms an, der außerhalb des eigenen Werkszauns liegt: Lieferanten, Logistik und die Teile, die man nicht selbst herstellen kann. Sie richtet sich an Werks- und Produktionsleitungen, die das Problem mit Einkauf und Supply-Chain-Teams teilen.

## Inhaltsverzeichnis

1. [Was resiliente Lieferketten für ein Werk bedeuten](#was-resiliente-lieferketten-für-ein-werk-bedeuten)
2. [Wie oft Störungen auftreten und was sie kosten](#wie-oft-störungen-auftreten-und-was-sie-kosten)
3. [Dokumentierte Störfälle](#dokumentierte-störfälle)
4. [Ein Rahmen: die SCOR-DS-Prozesse als Resilienz-Checkliste](#ein-rahmen-die-scor-ds-prozesse-als-resilienz-checkliste)
5. [Rechenbeispiel 1: eine Lieferantenrisiko-Matrix](#rechenbeispiel-1-eine-lieferantenrisiko-matrix)
6. [Rechenbeispiel 2: Time to Survive vs. Time to Recover](#rechenbeispiel-2-time-to-survive-vs-time-to-recover)
7. [Rechenbeispiel 3: warum Sicherheitsbestand kein Resilienzpuffer ist](#rechenbeispiel-3-warum-sicherheitsbestand-kein-resilienzpuffer-ist)
8. [Hebel zur Risikominderung und was sie kosten](#hebel-zur-risikominderung-und-was-sie-kosten)
9. [Öffentliche Programme und Politik](#öffentliche-programme-und-politik)
10. [Ein 90-Tage-Plan und Vorlagen](#ein-90-tage-plan-und-vorlagen)
11. [Typische Fehler](#typische-fehler)
12. [FAQ](#faq-resiliente-lieferketten)
13. [Fazit](#fazit)

## Was resiliente Lieferketten für ein Werk bedeuten

Der Review von Ponomarov und Holcomb beschreibt resiliente Lieferketten als solche, die sich auf unerwartete Ereignisse vorbereiten, effizient auf Störungen reagieren und sich in ihren ursprünglichen oder einen besseren Zustand zurückversetzen [6]. Ihr Hauptbefund: Der Begriff war in vielen Disziplinen definiert worden, von der Entwicklungspsychologie bis zur Ökologie, ohne einheitliche Theorie [6]. Für die Produktion umfasst die praktische Fassung drei Fähigkeiten: den ersten Stoß abfangen, sich während der Störung anpassen und danach die normale Ausbringung wiederherstellen [7].

Drei verwandte Begriffe werden in Besprechungen oft verwechselt:

| Begriff | Welche Frage er beantwortet | Beispiel im Werk |
|---|---|---|
| Robustheit | Können wir einen Schock abfangen, ohne etwas zu ändern? | vier Wochen eines kritischen Kunststoffgranulats vor Ort tragen das Werk durch einen kurzen Lieferantenausfall |
| Resilienz | Können wir abfangen, anpassen und uns erholen? | nach einem Brand beim Lieferanten verteilt das Werk Bestände um, qualifiziert eine zweite Quelle und ist nach zehn Wochen wieder bei voller Ausbringung |
| Agilität | Können wir schnell auf Änderungen bei Bedarf oder Versorgung reagieren? | der Planer stellt die Auftragsreihenfolge innerhalb eines Tages um, wenn ein Teil verspätet ist |

Resilienz ist nicht das Gegenteil von Lean. Ein Lean-Werk mit stabilem Fluss, kurzen Rüstzeiten und klarem Blick auf seinen Wertstrom erholt sich schneller, weil es das Problem früher sieht und die Arbeit umplanen kann. Was Lean-Denken nicht beantwortet: wie viel Puffer man gegen seltene, lange Störungen vorhalten soll. Das ist eine Risikoentscheidung, und sie gehört in dasselbe Managementsystem wie Qualität und Arbeitssicherheit.

## Wie oft Störungen auftreten und was sie kosten

Die meistzitierten Zahlen stammen aus einem Bericht des McKinsey Global Institute von 2020, der auf Branchenrecherchen und einer Befragung von Supply-Chain-Führungskräften beruht [1]:

| Befund | Zahl |
|---|---|
| Häufigkeit von Störungen von einem Monat oder länger | im Durchschnitt etwa alle 3,7 Jahre |
| Erwartete Verluste über ein Jahrzehnt | fast 45 % des Gewinns eines Jahres (die Abbildung im Bericht nennt 42 % des EBITDA eines Jahres) |
| Ein einzelner Produktionsschock von 100 Tagen (Szenario) | 30 bis 50 % des EBITDA eines Jahres für die meisten Branchen |
| Produkte, bei denen ein Land 70 % oder mehr der Exporte liefert | 180 |
| Führungskräfte (Befragung, Mai 2020), die ihre Lieferketten resilienter machen wollen | 93 % |

Das sind Durchschnittswerte über Branchen und Szenarien, keine Prognose für das eigene Werk. Sie sind für eines nützlich: Sie verschieben die Diskussion von "Das passiert uns nicht" zu "Wie viel ist es uns wert, vorbereitet zu sein?"

## Dokumentierte Störfälle

Die folgenden Fälle haben belegte Zahlen. Sie sind aus Sekundärquellen zusammengefasst, die die ursprüngliche Berichterstattung zitieren; vor einem Zitat in einer Vorstandsvorlage der Quellenspur folgen.

| Fall | Was passiert ist | Belegte Zahlen | Lehre für ein Werk |
|---|---|---|---|
| Sperrung des Suezkanals durch die *Ever Given*, März 2021 | Containerschiff am 23. März 2021 auf Grund gelaufen, am 29. März wieder flottgemacht [8] | mindestens 369 Schiffe stauten sich bis 28. März, mehr als 400 bei Wiedereröffnung; der Rückstau war bis 3. April abgebaut; BBC News schätzte etwa 9,6 Mrd. USD aufgehaltene Waren pro Tag, Lloyd's List etwa 400 Mio. USD pro Stunde [8] | eine sechstägige Routensperrung verursachte wochenlange Folgeverzögerungen. Bestand im Transit in die Überlebenszeit einrechnen und wissen, welche Teile über eine einzige Route laufen |
| Brand im Halbleiterwerk von Renesas, März 2021 | Brand in einer Renesas-Halbleiterfabrik, die laut Reuters 30 % des Weltmarkts für Automobil-Mikrocontroller belieferte [9] | Renesas erklärte, es werde mindestens 100 Tage dauern, bis die normale Produktion wieder erreicht sei [9] | eine Wiederherstellungszeit von mehr als 14 Wochen für ein Teil ohne schnellen Ersatz. Das ist das Muster von Teil A in den Rechenbeispielen |
| Chipmangel in der Automobilindustrie, 2020 bis 2023 | Nachfrageverschiebungen während der Pandemie plus Störfälle in der Versorgung ließen Autohersteller ohne Chips dastehen [9] | erwartete Kosten für die globale Autoindustrie von 210 Mrd. USD Umsatz im Jahr 2021 (Prognose von AlixPartners vom 23. September 2021 [11]); GM stoppte im September 2021 für ein bis zwei Wochen die Produktion in fast allen nordamerikanischen Werken; Ford stellte Tausende unfertige Fahrzeuge auf dem Kentucky Speedway ab, während es auf Chips wartete [9] | unvollständige Produkte zu bauen verlagert das Problem in Nacharbeit, Fläche und Liquidität. Vorab festlegen, wann eine Linie gestoppt wird, statt mit Fehlteilen zu bauen |
| Risikoexpositionsmodell bei Ford (Forschung) | ein dreijähriges Projekt mit Ford entwickelte ein Modell, das die Auswirkung einer Störung an jedem Knoten des Liefernetzwerks schätzt [3] | das Modell half Ford, bisher unerkannte Risiken zu identifizieren und Notfallpläne zu erstellen, selbst wenn die Dauer einer Störung unbekannt ist [3] | die größten Risiken liegen nicht immer dort, wo das Einkaufsvolumen liegt. Nach Auswirkung und Wiederherstellungszeit bewerten, nicht nach Einkaufsvolumen |

## Ein Rahmen: die SCOR-DS-Prozesse als Resilienz-Checkliste

Das Supply Chain Operations Reference Model des ASCM in seiner aktuellen digitalen Fassung, SCOR DS, beschreibt sieben Prozesse: Orchestrate, Plan, Order, Source, Transform, Fulfill und Return [5]. Über die SCORmark-Bewertung des ASCM werden außerdem Leistungsattribute verglichen, darunter Zuverlässigkeit, Resilienz und Reaktionsfähigkeit [5]. Die Prozessliste ist eine gute Checkliste für Resilienzarbeit, weil sie den Blick über den Einkauf hinaus lenkt:

| SCOR-DS-Prozess | Resilienzfrage für ein Werk | Typischer Verantwortlicher |
|---|---|---|
| Orchestrate (Steuern) | Wer verantwortet das Versorgungsrisiko, und wie oft prüft die Leitung es? | Produktionsleitung / Operations Director |
| Plan (Planen) | Enthalten die S&OP-Szenarien "Lieferant X fällt 12 Wochen aus"? | Supply-Chain-Planung |
| Order (Auftrag) | Können wir knappe Ausbringung nach einer vorab vereinbarten Regel auf Kunden verteilen? | Vertriebsinnendienst |
| Source (Beschaffen) | Welche Teile sind single- oder sole-sourced, und wo liegen Risiken bei Unterlieferanten (Tier 2)? | Einkauf |
| Transform (Herstellen) | Können wir alternative Arbeitspläne, Materialien oder Produktvarianten fahren? | Entwicklung/Konstruktion, Produktion |
| Fulfill (Liefern) | Haben wir alternative Spediteure, Routen und Häfen? | Logistik |
| Return (Rückführen) | Können wir verwendbares Material aus Retouren und Nacharbeit zurückgewinnen? | Qualität |

Die Zeile Plan verweist direkt auf den geplanten Leitfaden [S&OP, MRP und Produktionsplanung](https://www.m365.fm/learn/sop-mrp-produktionsplanung/). In der Zeile Transform zählen die eigenen Fähigkeiten des Werks am meisten, zum Beispiel kurze Rüstzeiten, wie im geplanten Leitfaden [SMED und Rüstzeitreduzierung](https://www.m365.fm/learn/smed-ruestzeitreduzierung/) beschrieben.

## Rechenbeispiel 1: eine Lieferantenrisiko-Matrix

*Veranschaulichendes Beispiel mit fiktiven Werten.* Ein mittelständischer Hersteller industrieller Steuerungen bewertet sechs Zukaufteile. Jedes wird auf drei Kriterien mit 1 bis 5 bewertet:

- **Wahrscheinlichkeit (W):** Chance einer Störung von mehr als zwei Wochen in den nächsten 12 Monaten (1 = sehr unwahrscheinlich, 5 = wahrscheinlich). Eingangsgrößen: eine oder mehrere Quellen, finanzielle Lage des Lieferanten, Region, bisherige Liefertreue.
- **Auswirkung (A):** Anteil des Umsatzes, der stoppt, wenn das Teil fehlt (1 = unter 2 %, 5 = über 40 %).
- **Wiederherstellbarkeit (R):** Zeit, um eine Alternative zu qualifizieren und hochzufahren (1 = unter 2 Wochen, 3 = 6 bis 12 Wochen, 5 = über 26 Wochen).

Risikowert = W × A × R (Spanne 1 bis 125).

| Teil | Beschaffung | W | A | R | Wert | Maßnahmenklasse |
|---|---|---|---|---|---|---|
| A Mikrocontroller | eine Quelle, Halbleiterwerk in Übersee | 4 | 5 | 5 | **100** | sofort handeln |
| D Kabelbaum | eine Quelle, grenzüberschreitend | 3 | 4 | 4 | **48** | sofort handeln |
| E Sonderdichtung | einzige Quelle (sole source), kleiner inländischer Lieferant | 3 | 3 | 5 | **45** | sofort handeln |
| B Gefrästes Gehäuse | zwei inländische Lieferanten | 2 | 4 | 2 | 16 | quartalsweise beobachten |
| C Technischer Kunststoff | drei Lieferanten, Standardware | 3 | 3 | 1 | 9 | jährlich prüfen |
| F Wellpappkartons | viele lokale Lieferanten | 2 | 2 | 1 | 4 | jährlich prüfen |

**Schwellen (vom Führungsteam festgelegt):** 40 oder mehr = Maßnahmenplan innerhalb von 90 Tagen und monatliche Prüfung; 15 bis 39 = quartalsweise Prüfung; unter 15 = jährliche Prüfung.

**So liest man die Matrix:**

1. Die Sonderdichtung (E) liegt fast so hoch wie der Kabelbaum, obwohl sie nur Cent kostet. Billige Teile aus einziger Quelle sind der klassische blinde Fleck, weil volumenbasierte Lieferantenbewertungen sie nie betrachten.
2. Die Wiederherstellbarkeit trennt A von C. Beide haben eine ähnliche Wahrscheinlichkeit, aber Kunststoffgranulat lässt sich innerhalb von Tagen anderswo kaufen, während ein neuer Mikrocontroller eine Neukonstruktion und Neuqualifizierung erfordern kann.
3. Ordinale Bewertungen zu multiplizieren ist eine Heuristik, genau wie die Risikoprioritätszahl (RPZ) in einer FMEA. Den Wert zum Reihen und als Diskussionsanstoß nutzen, nicht als präzises Maß. Zwei Teile mit 45 und 48 sind gleich dringend.

Die Bewertung je Teilenummer für alles durchführen, was eine Linie stoppen kann, nicht nur für die größten Lieferanten nach Einkaufsvolumen. Ein Stücklistenexport und zwei Stunden mit Einkauf, Konstruktion und Planung reichen für einen ersten Durchgang.

## Rechenbeispiel 2: Time to Survive vs. Time to Recover

Forschung mit der Ford Motor Company hat ein Risikoexpositionsmodell hervorgebracht, das die Wirkung einer Störung an beliebiger Stelle im Liefernetzwerk schätzt, ohne dass zuerst für jedes einzelne Ereignis eine Wahrscheinlichkeit nötig ist [3]. Ein Werk kann die Kernlogik ohne das vollständige Modell nutzen, indem es zwei Dauern vergleicht, die die Resilienzliteratur Time to Recover und Time to Survive nennt [7]:

- **Time to Recover (TTR, Wiederherstellungszeit):** wie lange ein Lieferantenstandort nach einer Störung braucht, um wieder volle Leistung zu erreichen.
- **Time to Survive (TTS, Überlebenszeit):** wie lange das eigene Werk den Bedarf mit dem decken kann, was es hat: Bestand vor Ort, Bestand im Transit, alternative Quellen, die hochfahren können, und Fertigwaren.

Ist die TTS kürzer als die TTR, ist die Differenz der Zeitraum, in dem Ausbringung verloren geht.

*Veranschaulichendes Beispiel mit fiktiven Werten* für Teil A, den Mikrocontroller:

| Element | Abgedeckte Bedarfswochen |
|---|---|
| Bestand im Werk | 4 |
| Bestand im Transit | 3 |
| Fertigwaren, die das Teil enthalten | 2 |
| **Time to Survive (TTS)** | **9** |
| Geschätzte Wiederherstellungszeit des Lieferanten nach einem Brand im Halbleiterwerk | 20 |
| **Lücke (TTR − TTS)** | **11 Wochen** |

**Was die Lücke kostet.** Die Produktfamilie, die das Teil verwendet, erzielt 600.000 USD Umsatz pro Woche bei 30 % Deckungsbeitrag: 180.000 USD pro Woche. Eine Lücke von 11 Wochen bedeutet 1,98 Mio. USD verlorenen Deckungsbeitrag, vor Vertragsstrafen und verlorenen Kunden.

**Erwarteter Verlust.** Schätzt das Team die Wahrscheinlichkeit eines so langen Ausfalls auf 5 % pro Jahr (eine Annahme, als solche dokumentiert), beträgt der erwartete Verlust 5 % × 1,98 Mio. USD = **99.000 USD pro Jahr**.

**Option 1: strategischer Bestand von 11 Wochen.** Der Wochenbedarf liegt bei 5.000 Teilen zu 4,20 USD, 11 Wochen sind also 55.000 Teile = 231.000 USD Bestand. Bei angenommenen jährlichen Lagerhaltungskosten von 20 % des Bestandswerts (Kapital, Lagerung, Handling, Obsoleszenzrisiko; den Satz des eigenen Controllings verwenden) kostet der Puffer **46.200 USD pro Jahr**. Er bindet 231.000 USD Liquidität, und Elektronikteile können altern.

**Option 2: eine zweite Quelle qualifizieren.** Einmalige Entwicklungs- und Qualifizierungskosten: 120.000 USD. Preisaufschlag auf 40 % des Volumens: 0,15 USD × 104.000 Teile = **15.600 USD pro Jahr**. Verteilt man die Einmalkosten auf drei Jahre (40.000 USD pro Jahr; Entwicklungszeit wird meist als Aufwand gebucht, die bilanzielle Behandlung mit dem Controlling klären), kostet die Option in den ersten drei Jahren etwa **55.600 USD pro Jahr** und danach 15.600 USD.

**Entscheidung.** Beide Optionen kosten weniger als die 99.000 USD erwarteter Verlust. Eine häufige Wahl ist ein kleinerer Überbrückungsbestand (zum Beispiel 4 Wochen, 84.000 USD Bestand, 16.800 USD pro Jahr), während die zweite Quelle qualifiziert wird, und den Überbrückungsbestand dann abzubauen, sobald die zweite Quelle liefert. Zu beachten ist, was die Rechnung auslässt: Vertragsstrafen von Kunden, Reputationsschäden und die Chance, dass ein Wettbewerber den Kunden gewinnt. Diese Punkte sprechen noch stärker für Handeln.

Den Lagerhaltungskostensatz und die Margenzahlen sollte der Werkscontroller verantworten. Eine Resilienzentscheidung ohne das Controlling am Tisch wird beim nächsten Bestandssenkungsziel gern wieder rückgängig gemacht.

## Rechenbeispiel 3: warum Sicherheitsbestand kein Resilienzpuffer ist

Die Lehrbuchformel für den Sicherheitsbestand, nur mit Bedarfsschwankung, lautet:

**Sicherheitsbestand = z × σd × √LT**

mit z als Servicefaktor (1,65 für etwa 95 % Zyklus-Servicegrad bei Normalverteilung), σd als Standardabweichung des Wochenbedarfs und LT als Wiederbeschaffungszeit in Wochen.

*Veranschaulichende Werte:* mittlerer Wochenbedarf d = 5.000 Teile, σd = 900 Teile, LT = 8 Wochen.

- Sicherheitsbestand = 1,65 × 900 × √8 = 1,65 × 900 × 2,83 = **4.200 Teile**, etwa 0,84 Wochen Bedarf.

Schwankt auch die Wiederbeschaffungszeit (Standardabweichung σLT = 2 Wochen), lautet die übliche erweiterte Formel:

**Sicherheitsbestand = z × √(LT × σd² + d² × σLT²)**

- = 1,65 × √(8 × 900² + 5.000² × 2²) = 1,65 × √(6.480.000 + 100.000.000) = 1,65 × 10.319 = **17.000 Teile**, etwa 3,4 Wochen.

Zwei Lehren:

1. **Die Schwankung der Wiederbeschaffungszeit dominiert.** In diesem Beispiel vervierfacht sie den Sicherheitsbestand. Mit Lieferanten an der Liefertreue zu arbeiten, setzt oft mehr Bestand frei als jedes Prognoseprojekt.
2. **Sicherheitsbestand deckt normale Schwankung ab, keine Störungen.** Weder 0,84 noch 3,4 Wochen kommen auch nur in die Nähe der 11-Wochen-Lücke aus Beispiel 2. Strategischen Bestand als separate, benannte Menge mit eigenem Verantwortlichen und eigenem Prüftermin führen, damit ihn die nächste Bestandssenkungsaktion nicht versehentlich kürzt.

Der Schwester-Cluster zu [Bestandsmanagement und Sicherheitsbestand](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/) (geplant) behandelt Servicegrade und die Formeln ausführlicher.

## Hebel zur Risikominderung und was sie kosten

| Hebel | Reduziert | Typische Kosten | Worauf achten |
|---|---|---|---|
| Strategischer Bestand kritischer Teile | TTS-Lücke | Lagerhaltungskosten, Liquidität, Obsoleszenz | Alterung (Elektronik, Chemikalien, Haltbarkeit); muss getrennt von Zyklus- und Sicherheitsbestand geführt werden |
| Zweite Quelle (Dual Sourcing) | Wahrscheinlichkeit und TTR | Qualifizierungsaufwand, Preisaufschlag, geteiltes Volumen | in regulierten Branchen kann die Qualifizierung Monate dauern (Kundenfreigabe, Erstmusterprüfung) |
| Alternative Konstruktion oder alternatives Material | TTR | Entwicklungszeit, Tests | Konstruktionsänderungen brauchen in Automobil, Luftfahrt und Medizintechnik eine Kundenfreigabe |
| Lieferantenentwicklung | Wahrscheinlichkeit | Zeit von Entwicklung und Qualität | wirkt am besten bei langfristigen Beziehungen |
| Kapazitätsreservierung oder längere Verträge | Wahrscheinlichkeit | Mindestabnahmeverpflichtungen | das Bedarfsrisiko geht auf das eigene Unternehmen über |
| Regionalisierung oder Reshoring | Wahrscheinlichkeit (bei manchen Risiken), Wiederbeschaffungszeit | in vielen Fällen höhere Stückkosten, Investition | tauscht ein Risikobündel gegen ein anderes; Gesamtkosten prüfen, nicht den Stückpreis |
| Transparenz über Tier 2 und 3 | Entdeckungszeit | Lieferantenbefragungen, Datendienste | Lieferanten teilen Daten möglicherweise nicht; mit kritischen Teilen beginnen |
| Flexibles Werk (kurze Rüstzeiten, mehrfach qualifiziertes Personal) | TTR innerhalb des eigenen Werkszauns | Lean- und Schulungsaufwand | braucht die Qualifikationen aus dem [Cluster zur Qualifikationsmatrix](https://www.m365.fm/learn/operational-excellence/qualifikationsmatrix/) |
| Cyber-Anforderungen an Lieferanten | Wahrscheinlichkeit von Ausfällen durch Cyberangriffe | Vertragsklauseln, Audits | mit dem geplanten Leitfaden [OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) verbinden |

**Simulation hilft bei den schwierigeren Fragen.** Wer wissen muss, wie sich ein 12-wöchiger Ausfall durch gemeinsam genutzte Kapazitäten, Puffer und Kundenprioritäten fortpflanzt, kann mit einem ereignisdiskreten Modell oder einem Digital Twin des Liefernetzwerks Szenarien testen, bevor Geld ausgegeben wird. Der Leitfaden [Digital Twin](https://www.m365.fm/learn/digital-twin/) und der geplante Cluster [Simulation in der Produktion](https://www.m365.fm/learn/digital-twin/simulation-produktion/) erklären den Ansatz.

## Öffentliche Programme und Politik

**NIST MEP (USA).** Das Netzwerk Manufacturing Extension Partnership bietet Lieferkettenkartierung und Risikobewertung, Pläne etwa für alternative Lieferanten oder Sicherheitsbestand, einen landesweiten Supplier-Scouting-Dienst, der inländische Lieferanten mit den benötigten Fähigkeiten sucht, Lieferantenentwicklung über mehrere Stufen und Unterstützung bei der Beschaffungsstrategie [2]. Für einen kleinen US-Hersteller ohne eigenes Risikoteam ist das lokale MEP-Zentrum die naheliegende erste Anlaufstelle.

**Executive Order 14017 (USA).** Die am 24. Februar 2021 unterzeichnete Verordnung "America's Supply Chains" erklärte es zur Politik, "die Resilienz der Lieferketten Amerikas zu stärken" [4]. Sie ordnete 100-Tage-Überprüfungen für vier Produktbereiche an (Halbleiter und Advanced Packaging, Hochleistungsbatterien, kritische Mineralien und strategische Materialien einschließlich Seltener Erden sowie Arzneimittel und Wirkstoffe) und einjährige Überprüfungen von sechs industriellen Basen: Verteidigung, öffentliche Gesundheit, Informations- und Kommunikationstechnik, Energie, Verkehr sowie Agrarrohstoffe und Lebensmittel [4]. Für Werksleitungen sind die Überprüfungen ein nützlicher Hintergrund dazu, wo nationale Konzentrationsrisiken liegen. Stand November 2026 zeigt das Federal Register keine Aufhebung, aber eine Verordnung vom März 2025 (EO 14239) führte sie unter den Maßnahmen auf, die auf Änderungen zu prüfen sind [4][10]. Den aktuellen Status prüfen, bevor man sich in Planungsunterlagen darauf stützt.

## Ein 90-Tage-Plan und Vorlagen

| Wochen | Maßnahme | Ergebnis | Verantwortlich |
|---|---|---|---|
| 1 bis 2 | Stücklisten der wichtigsten Produktfamilien exportieren; jedes Zukaufteil auflisten, das eine Linie stoppen kann | Liste kritischer Teile | Planung + Konstruktion |
| 3 bis 4 | Single und Sole Sources markieren; W × A × R bewerten | Risikomatrix | Einkauf, Konstruktion, Planung |
| 5 bis 6 | Für jedes Teil "sofort handeln": TTS aus Bestandsdaten, TTR vom Lieferanten | Tabelle der TTS/TTR-Lücken | Supply Chain + Lieferanten |
| 7 bis 8 | Kostenbewertung der Optionen (Puffer, zweite Quelle, Neukonstruktion) mit dem Controlling | Entscheidungsvorlage je Teil | Werkscontroller + Einkauf |
| 9 bis 10 | Einseitige Notfallpläne (Playbooks) für die drei größten Risiken schreiben | Playbooks | Produktionsleitung |
| 11 bis 12 | Monatlicher Risiko-Review in der Produktionsbesprechung; eine Planspielübung (Tabletop) | Standardroutine | Werksleitung |

**Vorlage: Lieferantenrisikoregister (eine Zeile je kritischem Teil)**

| Feld | Beispiel |
|---|---|
| Teilenummer und Bezeichnung | 4711, Mikrocontroller |
| Quellen (Anzahl, Art) | 1, single, Übersee |
| Lieferantenstandort(e) und Region | Fertigungsstandort (nicht nur die juristische Einheit), Land; nach dem Business-Continuity-Plan des Lieferanten fragen |
| W / A / R / Wert | 4 / 5 / 5 / 100 |
| TTS (Wochen) / TTR (Wochen) / Lücke | 9 / 20 / 11 |
| Gewählte Maßnahme und Kosten pro Jahr | 4-Wochen-Überbrückungsbestand (16.800 USD) + zweite Quelle (55.600 USD) |
| Auslöser für Eskalation | Liefertreue (OTIF) des Lieferanten zwei Monate in Folge unter 90 %; Meldung über einen Vorfall am Standort |
| Verantwortlicher und nächste Prüfung | Name, Datum |

**Vorlage: einseitiger Notfallplan für Lieferstörungen**

| Abschnitt | Inhalt |
|---|---|
| Auslöser | welches Ereignis den Plan aktiviert |
| Erste 24 Stunden | wer wen anruft; Bestand für die Zuteilung einfrieren; Bestand im Transit prüfen |
| Zuteilungsregel | welche Kunden und Produkte knappe Teile zuerst bekommen (vorab mit dem Vertrieb vereinbart) |
| Alternativen | Kontakte der zweiten Quelle, freigegebene Alternativteile, Stand der Neukonstruktion |
| Menschen | Plan zur Umsetzung untätiger Mannschaften (Schulung, Instandhaltung, Kaizen), abgestimmt mit der Personalabteilung und, wo zutreffend, der Gewerkschaft |
| Kommunikation | Vorlage für Kundenmitteilung; interner Update-Rhythmus |
| Abschluss | Kriterien zur Beendigung; Lessons-Learned-Review innerhalb von 30 Tagen |

## Typische Fehler

| Fehler | Warum er schadet | Abhilfe |
|---|---|---|
| Nur die größten Lieferanten nach Einkaufsvolumen prüfen | billige Teile aus einziger Quelle stoppen Linien ebenso | nach Teil und Auswirkung bewerten, nicht nach Volumen |
| Sicherheitsbestand als Störungsschutz zählen | der Puffer ist zu klein und wird bei Bestandsaktionen gekürzt | strategischen Bestand separat mit eigenem Verantwortlichen führen |
| Tier 2 ignorieren | die zwei "unabhängigen" Lieferanten kaufen bei derselben Gießerei | kritische Lieferanten nach ihren kritischen Quellen fragen |
| Reshoring nur wegen der Stückkosten | höhere Kosten ohne die beabsichtigte Risikominderung | gesamte Einstandskosten (Total Landed Cost) und Risikowert vergleichen |
| Keine Zuteilungsregel vor der Krise | Vertrieb und Produktion streiten, während der Bestand ausgeht | Zuteilungsregeln jetzt vereinbaren |
| Ein Risikoregister, das niemand prüft | Risiken veralten, Maßnahmen stocken | monatlicher Review in der Produktionsbesprechung |
| Das Controlling außen vor lassen | Puffer werden beim nächsten Working-Capital-Ziel gestrichen | der Controller ist Mitverantwortlicher der Entscheidungsvorlage |
| Resilienz als Einkaufsprojekt behandeln | die Flexibilität des Werks (Rüsten, Qualifikationen) wird ignoriert | Konstruktion, Produktion und Personal einbeziehen |

## FAQ: resiliente Lieferketten

### Was ist Supply Chain Resilienz?

Die Fähigkeit einer Lieferkette, sich auf unerwartete Ereignisse vorzubereiten, auf Störungen zu reagieren und sich in ihren ursprünglichen oder einen besseren Zustand zurückzuversetzen [6]. Für einen Hersteller heißt das, weiter auszuliefern, wenn ein Lieferant, eine Route oder eine Region ausfällt, und schnell wieder volle Ausbringung zu erreichen.

### Warum sind resiliente Lieferketten wichtig?

Weil Störungen häufig und teuer sind. Das McKinsey Global Institute schätzt, dass Unternehmen im Durchschnitt etwa alle 3,7 Jahre mit Störungen von einem Monat oder länger konfrontiert sind und über ein Jahrzehnt mit Verlusten von fast 45 % des Gewinns eines Jahres rechnen müssen [1].

### Was ist der Unterschied zwischen Resilienz und Agilität in der Lieferkette?

Agilität ist die Reaktionsgeschwindigkeit auf Änderungen, etwa das Umplanen von Aufträgen, wenn ein Teil verspätet ist. Resilienz ist breiter: einen Schock abfangen, sich währenddessen anpassen und sich danach erholen. Ein agiles Werk erholt sich schneller, aber Agilität allein ersetzt keine Puffer oder zweiten Quellen für lange Ausfälle.

### Wie misst man Supply Chain Resilienz?

Auf Werksebene mit Time to Survive (TTS) und Time to Recover (TTR) je kritischem Teil, der Lücke zwischen beiden, dem Anteil der "sofort handeln"-Risiken mit finanzierter Maßnahme und der Liefertreue der Lieferanten. Den Trend der größten Risikowerte monatlich verfolgen.

### Was sind Beispiele für Lieferkettenstörungen?

Gut dokumentiert sind die Sperrung des Suezkanals im März 2021 [8], der Brand im Renesas-Werk im März 2021 und der Chipmangel in der Automobilindustrie von 2020 bis 2023 [9]. Störungen auf Werksebene sind häufiger: eine Lieferanteninsolvenz, eine Qualitätssperre, ein Brand bei einem Tier-2-Lieferanten oder ein Cyberangriff.

### Wie baut man eine resiliente Lieferkette auf?

Die Teile auflisten, die Linien stoppen können, sie bewerten (Wahrscheinlichkeit × Auswirkung × Wiederherstellbarkeit), TTS und TTR für die größten Risiken vergleichen, die Optionen (strategischer Bestand, zweite Quelle, Neukonstruktion) gegen den erwarteten Verlust bewerten, kurze Notfallpläne schreiben und monatlich prüfen. In den USA unterstützen die NIST-MEP-Zentren kleine Hersteller mit Kartierung und Risikobewertung [2].

### Lohnt sich Dual Sourcing?

Bei Teilen mit langer Wiederherstellungszeit und hoher Auswirkung meist ja. Im Rechenbeispiel kostete die Qualifizierung einer zweiten Quelle etwa 55.600 USD pro Jahr über drei Jahre, bei einem erwarteten Verlust von 99.000 USD pro Jahr. Bei Standardteilen mit vielen Lieferanten lohnt es sich selten.

### Macht Lean Manufacturing Lieferketten anfällig?

Gut umgesetztes Lean macht Werke schneller darin, Probleme zu erkennen und darauf zu reagieren. Die Anfälligkeit entsteht, wenn alle Puffer ohne Risikobewertung gestrichen werden oder wenn Single Sourcing nur wegen des Stückpreises gewählt wird. Strategischen Bestand bewusst dimensionieren und getrennt von Zyklus- und Sicherheitsbestand führen.

### Was war die Executive Order 14017?

Eine Verordnung des US-Präsidenten vom 24. Februar 2021 mit dem Titel "America's Supply Chains". Sie ordnete 100-Tage-Überprüfungen zu Halbleitern, Hochleistungsbatterien, kritischen Mineralien und Arzneimitteln an, dazu einjährige Überprüfungen von sechs industriellen Basen [4].

### Was sind die vier Säulen der Supply Chain Resilienz?

Mehrere Leitfäden gliedern Resilienz in vier Säulen; IBM nennt sie Contingency (Notfallvorsorge), Flexibility (Flexibilität), Visibility (Transparenz) und Collaboration (Zusammenarbeit) [12]. Auf das Werk übertragen: Notfallvorsorge bedeutet Notfallpläne und strategischen Bestand für die größten Risiken, Flexibilität bedeutet zweite Quellen und alternative Kapazität, Transparenz bedeutet, die Tier-2-Lieferanten und ihre Standorte zu kennen, und Zusammenarbeit bedeutet, Prognosen und Risikodaten mit Schlüssellieferanten zu teilen. Die Risikomatrix in diesem Artikel zeigt, wo jede Säule am meisten zählt.

### Was sind die wichtigsten Strategien für resiliente Lieferketten?

Ein systematischer Review von 91 Studien, zusammengefasst in [7], fand vier wiederkehrende Strategien: Flexibilität, Redundanz, Zusammenarbeit und Agilität. Auf das Werk übertragen: flexible Kapazität und Qualifikationen, bewusste Puffer und zweite Quellen, Informationsaustausch mit Lieferanten und Kunden sowie schnelles Umplanen.

### Wie können kleine Hersteller ihre Lieferketten resilienter machen?

Mit der Liste kritischer Teile und der Risikomatrix aus diesem Artikel beginnen; das dauert ein paar Tage, kein Softwareprojekt. In den USA dann beim lokalen NIST-MEP-Zentrum nach einer Lieferkettenrisikobewertung und dem Supplier-Scouting-Dienst für alternative inländische Quellen fragen [2].

## Fazit

Supply Chain Resilienz wird beherrschbar, wenn man sie konkret macht: eine Liste der Teile, die Linien stoppen können, ein Wert, der sie reiht, und für die wichtigsten Teile ein Vergleich, wie lange man überleben kann und wie lange die Erholung dauert. Die Lücke hat einen Preis, und die Optionen, sie zu schließen, auch. Die Zahlen Controlling und Leitung vorlegen, entscheiden und monatlich prüfen.

Resilienz und Lean sind vereinbar. Ein Werk mit stabilem Fluss, kurzen Rüstzeiten und mehrfach qualifizierten Menschen erholt sich schneller. Was Lean nicht entscheidet: wie viel strategischer Bestand oder zweite Quelle eine seltene, aber lange Störung wert ist. Diese Entscheidung gehört in das eigene Operational-Excellence-System, verantwortet von benannten Personen, mit Terminen.

## Weiterlesen auf m365.fm

**Parent-Pillar**
- [Operational Excellence: der vollständige Leitfaden](https://www.m365.fm/learn/operational-excellence/)

**Schwester-Cluster (geplant)**
- [Nachhaltige Produktion: Energie pro Stück und Scope 1-3](https://www.m365.fm/learn/operational-excellence/nachhaltige-produktion/) (geplant)
- [Qualifikationsmatrix, Mitarbeiterqualifizierung und TWI](https://www.m365.fm/learn/operational-excellence/qualifikationsmatrix/) (geplant)

**Verwandte Leitfäden**
- [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/)
- [S&OP, MRP und Produktionsplanung](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) (geplant)
- [Bestandsmanagement und Sicherheitsbestand](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/) (geplant)
- [SMED und Rüstzeitreduzierung](https://www.m365.fm/learn/smed-ruestzeitreduzierung/) (geplant)
- [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/)
- [Simulation in der Produktion](https://www.m365.fm/learn/digital-twin/simulation-produktion/) (geplant)
- [OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant)
- [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/)

---

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Operational Excellence, Lean Management und die digitale Transformation der Produktion. [Redaktion: Rolle, Kurzbiografie und Foto ergänzen.]

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Quellen

Alle Quellen geöffnet und geprüft am 20. November 2026.

1. Lund, S.; Manyika, J.; Woetzel, L.; Barriball, E.; Krishnan, M.; Alicke, K.; Birshan, M.; George, K.; Smit, S.; Swan, D.; Hutzler, K.: "Risk, resilience, and rebalancing in global value chains". McKinsey Global Institute, 6. August 2020. https://www.mckinsey.com/capabilities/operations/our-insights/risk-resilience-and-rebalancing-in-global-value-chains
2. NIST Manufacturing Extension Partnership: "Supply Chain" (Leistungen: Kartierung und Risikobewertung, Supplier Scouting, Lieferantenentwicklung, Beschaffungsstrategie). https://www.nist.gov/mep/supply-chain
3. Simchi-Levi, D.; Schmidt, W.; Wei, Y.; Zhang, P. Y.; Combs, K.; Ge, Y.; Gusikhin, O.; Sanders, M.; Zhang, D.: "Identifying Risks and Mitigating Disruptions in the Automotive Supply Chain". *Interfaces* 45 (5), 2015, S. 375–390. DOI: 10.1287/inte.2015.0804
4. Executive Order 14017 vom 24. Februar 2021, "America's Supply Chains". Federal Register 86 FR 11849, 1. März 2021. https://www.federalregister.gov/documents/2021/03/01/2021-04280/americas-supply-chains
5. ASCM: "SCOR Digital Standard (SCOR DS)". https://www.ascm.org/corporate-solutions/standards-tools/scor-ds/
6. Ponomarov, S. Y.; Holcomb, M. C.: "Understanding the concept of supply chain resilience". *The International Journal of Logistics Management* 20 (1), 2009, S. 124–143. DOI: 10.1108/09574090910954873
7. Wikipedia: "Supply chain resilience" (Sekundärquelle für absorptive, adaptive und restorative Fähigkeiten sowie für die Begriffe Time to Survive und Time to Recover). https://en.wikipedia.org/wiki/Supply_chain_resilience
8. Wikipedia: "2021 Suez Canal obstruction" (Sekundärquelle; Zahlen dort zitiert nach BBC News, 26. März 2021, und Lloyd's List, 25. März 2021). https://en.wikipedia.org/wiki/2021_Suez_Canal_obstruction
9. Wikipedia: "2020–2023 global chip shortage" (Sekundärquelle; Renesas-Zahlen dort zitiert nach Reuters, 31. März 2021; Umsatzschätzung nach CNBC, 23. September 2021; GM nach CNN Business, 3. September 2021; Ford nach The Drive, 5. Mai 2021). https://en.wikipedia.org/wiki/2020%E2%80%932023_global_chip_shortage
10. Executive Order 14239 vom 18. März 2025, "Achieving Efficiency Through State and Local Preparedness", Abschnitt 3(b)(iii) (EO 14017 unter den Maßnahmen, die innerhalb von 180 Tagen geprüft und zur Änderung empfohlen werden sollen). Zusammenfassung und Textauszug: Ballotpedia. https://ballotpedia.org/Executive_Order:_Achieving_Efficiency_Through_State_and_Local_Preparedness_(Donald_Trump,_2025) ; EO-Hinweise auf der Federal-Register-Seite zu EO 14017 [4] ("See: EO 14123, June 14, 2024; EO 14239, March 18, 2025"; keine Aufhebung vermerkt)
11. AlixPartners: "Shortages related to semiconductors to cost the auto industry $210 billion in revenues this year, says new AlixPartners forecast", Pressemitteilung, 23. September 2021 (210 Mrd. USD Umsatzverlust und 7,7 Mio. Einheiten Produktionsausfall im Jahr 2021). https://www.alixpartners.com/media-center/press-releases/press-release-shortages-related-to-semiconductors-to-cost-the-auto-industry-210-billion-in-revenues-this-year-says-new-alixpartners-forecast/
12. IBM: "What is supply chain resilience?" IBM Think (vier Säulen: contingency, flexibility, visibility, collaboration; abgerufen am 23. November 2026). https://www.ibm.com/think/topics/supply-chain-resiliency

---

# Prüfhinweise für die Redaktion

## URL, Canonical und hreflang

- Cluster-URL verschachtelt unter dem Parent-Pillar: `/learn/operational-excellence/resiliente-lieferketten/`; im CMS bestätigen.
- hreflang-Paar `de-DE` (diese Seite) <-> `en-US` (https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/), jeweils selbstreferenzierendes Canonical. In der englischen Fassung das hreflang-Paar nachtragen.

## Offene Punkte und [unbelegt]-Stellen

1. **Störfälle [8][9]** stützen sich auf Wikipedia als Sekundärquelle; vor Veröffentlichung durch die Primärberichte (BBC, Lloyd's List, Reuters, CNBC, CNN) ersetzen. Die 210-Mrd.-USD-Schätzung ist über die AlixPartners-Pressemitteilung [11] belegt.
2. **Time to Survive:** Der Begriff ist in [7] genannt; seine Herkunft aus späteren Arbeiten von Simchi-Levi und Kollegen ist [unbelegt]. Der Artikel schreibt [3] nur das Risikoexpositionsmodell und den Ansatz über Wiederherstellungszeiten zu.
3. **Status der Executive Order 14017:** keine Aufhebung im Federal Register; EO 14239 ordnet eine Prüfung an [10]. Ob Änderungen folgten, wurde nicht gefunden; der Text fordert zur Prüfung des aktuellen Status auf.
4. **Lagerhaltungskostensatz (20 %)** und die Ausfallwahrscheinlichkeit von 5 % in Beispiel 2 sind gekennzeichnete Annahmen.
5. **Sicherheitsbestandsformeln:** Standardformeln aus dem Lehrbuch; z = 1,65 für etwa 95 % ist eine Eigenschaft der Normalverteilung.
6. **Skalen und Schwellen der Risikomatrix:** redaktionelles Design, als veranschaulichend gekennzeichnet.
7. **Qualifizierungsstandards** (PPAP in der Automobilindustrie, Erstmusterprüfung nach AS9102 in der Luftfahrt) sind [unbelegt] und daher im Text nicht genannt; der Text bleibt allgemein.
8. **Kein iFAKT-Abschnitt** im Artikeltext; die Offenlegung "**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**" steht nur in der Autorenbox. Kein Sponsoring-Hinweis.

## Interne Links

- Parent: https://www.m365.fm/learn/operational-excellence/ (erste 150 Wörter und "Weiterlesen").
- Schwester-Cluster: https://www.m365.fm/learn/operational-excellence/nachhaltige-produktion/, https://www.m365.fm/learn/operational-excellence/qualifikationsmatrix/
- Im Text: sop-mrp-produktionsplanung, smed-ruestzeitreduzierung, produktionsplanung-aps/bestandsmanagement, ot-security-iec-62443, digital-twin, digital-twin/simulation-produktion. "Weiterlesen" ergänzt produktionsplanung-aps und produktionsplanung-luftfahrt. "(geplant)" nur bei noch nicht veröffentlichten deutschen Zielen.

## Empfohlene Grafiken

1. Blasendiagramm der Risikomatrix (Wahrscheinlichkeit über Auswirkung, Blasengröße = Wiederherstellbarkeit) für die sechs Teile.
2. Balken TTS vs. TTR für Teil A mit schraffierter 11-Wochen-Lücke.
3. Kostenvergleich: erwarteter Verlust (99.000 USD), strategischer Bestand (46.200 USD), zweite Quelle (55.600 USD, danach 15.600 USD), Überbrückungsbestand plus zweite Quelle.
4. Ring der sieben SCOR-DS-Prozesse mit je einer Resilienzfrage.

## JSON-LD-Vorschlag

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Resiliente Lieferketten in der Produktion: Risikobewertung, Puffer und ein Praxisplan für das Werk",
      "inLanguage": "de-DE",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-26",
      "mainEntityOfPage": "https://www.m365.fm/learn/operational-excellence/resiliente-lieferketten/",
      "isPartOf": {"@type": "Article", "url": "https://www.m365.fm/learn/operational-excellence/"},
      "about": {"@type": "Thing", "name": "Resiliente Lieferketten"}
    },
    {"@type": "FAQPage", "inLanguage": "de-DE", "mainEntity": "[alle 12 FAQ-Fragen als Question mit acceptedAnswer; Antworttext ohne [n]-Verweise]"},
    {"@type": "BreadcrumbList", "itemListElement": ["Startseite", "Learn", "Operational Excellence", "Resiliente Lieferketten"]}
  ]
}
```

## Für den deutschen Markt prüfen

- US-Programme (NIST MEP, Executive Order 14017) sind als US-Kontext gekennzeichnet. Für die Fachprüfung: Soll das Lieferkettensorgfaltspflichtengesetz (LkSG) bzw. die EU-Lieferkettenrichtlinie (CSDDD) erwähnt werden, und gibt es deutsche Anlaufstellen (z. B. IHK, Mittelstand-Digital-Zentren) als Gegenstück zu NIST MEP? Nichts davon neu als Fakt eingefügt; nur mit Beleg ergänzen.
- Cyber-Anforderungen an Lieferanten: Bezug zu NIS2 und deren deutscher Umsetzung für die Fachprüfung prüfen.
- Notfallplan, Zeile "Menschen": Umsetzung von Mannschaften und ggf. Kurzarbeit berühren in Deutschland die Mitbestimmung des Betriebsrats (§ 87 BetrVG); prüfen, ob ein Hinweis ergänzt werden soll.
- Kannibalisierung: Überschneidung mit dem geplanten Cluster Bestandsmanagement (Sicherheitsbestand) über kurzes Beispiel und Link gelöst.

## Fachliche Prüfung

Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.
