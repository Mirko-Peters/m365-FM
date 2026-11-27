# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Bestandsmanagement Produktion: Sicherheitsbestand, ABC/XYZ (58 Zeichen) |
| Meta-Description | Bestandsmanagement in der Produktion mit Rechenbeispielen: Sicherheitsbestand berechnen, Meldebestand, Lagerumschlag, ABC/XYZ-Analyse, FIFO/LIFO. (145 Zeichen) |
| Slug | `/learn/produktionsplanung-aps/bestandsmanagement/` (vollständige URL: https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/) |
| Parent-Pillar | [Produktionsplanung mit APS](https://www.m365.fm/learn/produktionsplanung-aps/) |
| Hauptkeyword | Bestandsmanagement Produktion |
| Nebenkeywords | Sicherheitsbestand, Sicherheitsbestand berechnen, Sicherheitsbestand Formel, Meldebestand berechnen, Bestellpunkt, Lagerumschlagshäufigkeit, Reichweite, ABC-Analyse, ABC-XYZ-Analyse, Alpha-Servicegrad, Beta-Servicegrad, Lieferbereitschaftsgrad, Bestellrhythmusverfahren, Bestellpunktverfahren, Lagerhaltungskosten, permanente Inventur, Stichprobeninventur, Rohstoffe, Halbfertigware, Fertigware, Bestandsbewertung FIFO LIFO Durchschnitt, Ladenhüter, Überbestand, Bestandsreduzierung |
| Suchintention | Informational mit kommerziellem Anteil. "Sicherheitsbestand" und "Sicherheitsbestand Formel" sind informationsgetrieben und auf Berechnung ausgerichtet. |
| Wortzahl | 5.035 Wörter (`wc -w` von H1 bis Fazit, inkl. FAQ, ohne Weiterlesen); englische Fassung: 5.235 Wörter (96 %) |
| Sprachversion | `de-DE`; hreflang-Paar: `de-DE` https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/ <-> `en-US` https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus.

# Bestandsmanagement in der Produktion: Sicherheitsbestand, Meldebestand, ABC/XYZ-Analyse und Bestandsbewertung

*Stand: 20. November 2026 · Teil des Leitfadens [Produktionsplanung mit APS](https://www.m365.fm/learn/produktionsplanung-aps/)*

> **Kurzantwort:** Bestandsmanagement in der Produktion steuert Rohstoffe, Halbfertigware (Work in Process, WIP), Fertigware und MRO-Material (Instandhaltung, Reparatur und Betrieb) so, dass die Produktion nie stillsteht und kein Kapital ohne Grund gebunden ist. Die wichtigsten Werkzeuge sind die ABC/XYZ-Klassifizierung, ein Nachschubverfahren je Klasse (Bestellpunkt oder Bestellrhythmus), ein Sicherheitsbestand, der auf einen ausdrücklich festgelegten Servicegrad ausgelegt ist, korrekte Bestandsdaten durch permanente Inventur (Cycle Counting) und eine Bewertung nach US GAAP (ASC 330) und den Regeln der US-Steuerbehörde IRS.

Der Bestand eines Herstellers unterscheidet sich in einem wichtigen Punkt von dem eines Händlers: Das meiste davon wird nicht so verkauft, wie es ist. Es wird von Fertigungsaufträgen verbraucht, sein Bedarf ist also vom Produktionsplan *abhängig*. Der Parent-Leitfaden zur [Produktionsplanung mit APS](https://www.m365.fm/learn/produktionsplanung-aps/) bringt die Grundformel für den Sicherheitsbestand mit einem Beispiel. Dieser Artikel behandelt den ganzen Regelkreis: wie man Bestand misst, wie man ihn klassifiziert, wie man den Sicherheitsbestand richtig für die Servicegröße dimensioniert, auf die es wirklich ankommt, wie man die Bestandsdaten korrekt hält und wie die Finanzabteilung bewertet, was in den Regalen liegt.

### Das Wichtigste in Kürze

- **Abhängigen von unabhängigem Bedarf trennen.** Fertigware und Ersatzteile bekommen Sicherheitsbestand. Komponenten, die das MRP plant, bekommen meist eine Sicherheitszeit oder gar keinen Puffer.
- **Erst klassifizieren, dann Regeln festlegen.** ABC ordnet Artikel nach Wert, XYZ nach Bedarfsschwankung. Ein AX-Artikel und ein CZ-Artikel brauchen eine gegensätzliche Behandlung.
- **Sagen, welcher Servicegrad gemeint ist.** Ein Alpha-Servicegrad (Cycle Service Level) von 95 % und ein Beta-Servicegrad (Fill Rate) von 99 % sind verschiedene Ziele. Im Rechenbeispiel braucht ein Beta-Servicegrad von 99 % *weniger* Sicherheitsbestand (62 Stück) als ein Alpha-Servicegrad von 95 % (76 Stück).
- **Das Bestellrhythmusverfahren braucht mehr Puffer.** Der Sicherheitsbestand muss die Wiederbeschaffungszeit plus das Überprüfungsintervall abdecken. Eine wöchentliche Überprüfung bei zehn Tagen Wiederbeschaffungszeit verlängert den Schutzzeitraum von 10 auf 15 Tage.
- **Genauigkeit schlägt Formeln.** Ein Sicherheitsbestand, berechnet auf falschen Buchbeständen, schützt nichts. Permanente Inventur nach ABC-Klassen hält die Daten ehrlich.
- **Die Bewertung verändert Marge und Steuern, nicht den Bestand.** FIFO, LIFO und gewogener Durchschnitt sind Entscheidungen der Finanzabteilung; wer in den USA LIFO steuerlich nutzt, muss LIFO auch in Berichten an Eigentümer und Kreditgeber verwenden.

## Inhaltsverzeichnis

1. [Bestandsarten in der Produktion](#1-bestandsarten-in-der-produktion)
2. [Erst messen: Lagerumschlag, Reichweite und Lagerhaltungskosten](#2-erst-messen-lagerumschlag-reichweite-und-lagerhaltungskosten)
3. [Klassifizieren: ABC/XYZ-Analyse mit Rechenbeispiel](#3-klassifizieren-abcxyz-analyse-mit-rechenbeispiel)
4. [Nachschubverfahren: Bestellpunkt und Bestellrhythmus](#4-nachschubverfahren-bestellpunkt-und-bestellrhythmus)
5. [Sicherheitsbestand: Formel, Berechnung und Bedeutung](#5-sicherheitsbestand-formel-berechnung-und-bedeutung)
6. [WIP: der Bestand, den die Feinplanung steuert](#6-wip-der-bestand-den-die-feinplanung-steuert)
7. [Bestandsgenauigkeit und permanente Inventur](#7-bestandsgenauigkeit-und-permanente-inventur)
8. [Bestandsbewertung: Grundlagen nach US GAAP und IRS](#8-bestandsbewertung-grundlagen-nach-us-gaap-und-irs)
9. [Vorlage: Bestandsregeln je ABC/XYZ-Klasse](#9-vorlage-bestandsregeln-je-abcxyz-klasse)
10. [Häufige Fehler](#10-haeufige-fehler)
11. [FAQ: Bestandsmanagement in der Produktion](#11-faq-bestandsmanagement-in-der-produktion)
12. [Fazit](#12-fazit)

## 1. Bestandsarten in der Produktion

| Art | Was es ist | Bedarfsart | Wichtigster Steuerungshebel |
|---|---|---|---|
| Rohstoffe und Kaufteile | Stahl, Granulat, Elektronikbauteile, Gussteile | abhängig (aus dem Produktionsplan) | MRP, Losgröße, Wiederbeschaffungszeit des Lieferanten |
| Halbfertigware (WIP) | freigegebene Aufträge zwischen erstem und letztem Arbeitsgang | abhängig | Auftragsfreigabe, WIP-Obergrenzen, Durchlaufzeit |
| Fertigware | versandfertige Produkte | unabhängig (Kundenbedarf) | Prognose, Sicherheitsbestand, S&OP |
| MRO (Instandhaltung, Reparatur und Betrieb) | Ersatzteile, Werkzeuge, Verbrauchsmaterial | überwiegend unabhängig, oft sporadisch | Min/Max, Kritikalität |
| Serviceteile | an Kunden für Reparaturen verkaufte Teile | unabhängig | Servicegradziele |

Joseph Orlicky baute das MRP 1975 auf dieser Unterscheidung auf: Abhängiger Bedarf soll aus der Stückliste *berechnet* und nicht prognostiziert werden [1]. Sicherheitsbestand gehört deshalb dorthin, wo der Bedarf unsicher ist: Fertigware, Serviceteile und Kaufteile mit langer Wiederbeschaffungszeit. Der Schwesterartikel zur [Losgröße](https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/) behandelt, wie viel je Los bestellt wird; dieser Artikel behandelt, wie viel Puffer zusätzlich gehalten wird.

## 2. Erst messen: Lagerumschlag, Reichweite und Lagerhaltungskosten

### 2.1 Lagerumschlagshäufigkeit und Reichweite

> **Lagerumschlag = Herstellkosten des Umsatzes (COGS) ÷ durchschnittlicher Bestand zu Anschaffungs- bzw. Herstellkosten**
>
> **Reichweite in Tagen = 365 ÷ Lagerumschlag** (oder durchschnittlicher Bestand ÷ COGS je Tag; die Finanzabteilung nennt das Days Inventory Outstanding, DIO)

Nutzen Sie den durchschnittlichen Bestand, nicht den Wert zum Jahresende: (Anfangsbestand + Endbestand) ÷ 2, besser noch den Mittelwert der Monatsendbestände.

**Rechenbeispiel.** Ein Werk hat jährliche Herstellkosten des Umsatzes von 24 Mio. USD. Der Bestand lag zu Jahresbeginn bei 3,6 Mio. USD und zum Jahresende bei 4,4 Mio. USD.

- Durchschnittlicher Bestand = (3,6 Mio. USD + 4,4 Mio. USD) ÷ 2 = 4,0 Mio. USD
- Lagerumschlag = 24 Mio. USD ÷ 4,0 Mio. USD = **6,0**
- Reichweite = 365 ÷ 6,0 ≈ **61 Tage**

Berechnen Sie den Umschlag je Bestandsart, nicht nur insgesamt. Ein Gesamtumschlag von 6 kann Fertigware mit 12 und Rohstoffe mit 3 verbergen, und beide brauchen andere Lösungen (Prognose und S&OP gegenüber Einkauf und Losgrößen). Vergleichswerte schwanken stark nach Branche; vergleichen Sie mit Ihrem eigenen Trend und Segment. Weitere Bestandskennzahlen finden Sie im Pillar [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/).

### 2.2 Lagerhaltungskosten

Der Lagerhaltungskostensatz steuert Losgrößen und Sicherheitsbestände überall im ERP. Er braucht einen Verantwortlichen in der Finanzabteilung. Bauen Sie ihn aus Bestandteilen auf, statt einen Lehrbuchwert zu übernehmen:

| Bestandteil | Wie schätzen | Ihr Wert (% pro Jahr) |
|---|---|---|
| Kapitalkosten | gewichtete durchschnittliche Kapitalkosten oder der mit der Finanzabteilung vereinbarte Fremdkapitalzins | |
| Lagerung | Lagerkosten (Fläche, Energie, Ausstattung, Personal) ÷ durchschnittlicher Bestandswert | |
| Versicherung und Steuern | Versicherungsprämie und bestandsbezogene Steuern ÷ durchschnittlicher Bestandswert | |
| Veralterung und Schwund | jährliche Abschreibungen und Zuführungen zur Wertberichtigung für Über- und Altbestände ÷ durchschnittlicher Bestandswert | |
| Handling und Zählen | Personal für Umlagerungen, Zählungen und Korrekturen ÷ durchschnittlicher Bestandswert | |
| **Lagerhaltungskostensatz gesamt** | Summe | |

Das EOQ-Beispiel des Parent-Pillars nutzt 20 % pro Jahr als Beispielwert; bei Produkten mit hoher Veralterung kann der Satz weit höher liegen.

## 3. Klassifizieren: ABC/XYZ-Analyse mit Rechenbeispiel

### 3.1 ABC nach Jahresverbrauchswert

Die ABC-Analyse wendet das Pareto-Prinzip an: Wenige Artikel tragen den größten Teil des Werts. Sortieren Sie die Artikel nach Jahresverbrauchswert (Jahresmenge × Stückkosten), berechnen Sie den kumulierten Anteil und legen Sie die Grenzen fest. Übliche Konventionen sind etwa 80 % des Werts für A-Artikel und etwa 95 % kumuliert für A plus B. Das sind Konventionen, keine Norm; legen Sie sie für Ihr Sortiment fest. "ABC" meint hier die ABC-*Analyse*, nicht die Prozesskostenrechnung (Activity-Based Costing).

### 3.2 XYZ nach Bedarfsschwankung

Die XYZ-Analyse ordnet Artikel danach, wie gut ihr Bedarf vorhersehbar ist, meist über den Variationskoeffizienten (VK = Standardabweichung ÷ Mittelwert des Bedarfs je Periode). Die Grenzen sind wieder Konventionen. Dieses Beispiel nutzt VK ≤ 0,25 für X (gleichmäßig), 0,25 bis 0,75 für Y (schwankend) und über 0,75 für Z (sporadisch). Nutzen Sie für alle Artikel dieselbe Periodenlänge (zum Beispiel wöchentlich), denn der VK hängt davon ab.

### 3.3 Rechenbeispiel: zehn Teile

Jahresverbrauchswerte und wöchentlicher VK aus einem Jahr Verbrauchsdaten (Beispielzahlen):

| Artikel | Jahresverbrauchswert (USD) | Anteil | Kumuliert | ABC | VK (wöchentlich) | XYZ | Klasse |
|---|---|---|---|---|---|---|---|
| Aluminiumgehäuse | 412.000 | 42,9 % | 42,9 % | A | 0,18 | X | AX |
| Servomotor | 268.000 | 27,9 % | 70,8 % | A | 0,62 | Y | AY |
| Stahlstange 40 mm | 96.000 | 10,0 % | 80,8 % | B | 0,22 | X | BX |
| Leiterplattenbaugruppe | 84.000 | 8,8 % | 89,6 % | B | 1,10 | Z | BZ |
| Lager 6205 | 41.000 | 4,3 % | 93,9 % | B | 0,35 | Y | BY |
| Dichtungssatz | 22.000 | 2,3 % | 96,1 % | C | 0,28 | Y | CY |
| Sonderhalter | 18.000 | 1,9 % | 98,0 % | C | 1,45 | Z | CZ |
| Schraubensatz | 9.000 | 0,9 % | 99,0 % | C | 0,15 | X | CX |
| Etikettenrolle | 6.000 | 0,6 % | 99,6 % | C | 0,40 | Y | CY |
| Ersatzdichtung | 4.000 | 0,4 % | 100,0 % | C | 2,10 | Z | CZ |
| **Summe** | **960.000** | | | | | | |

Zwei Artikel (20 %) tragen 71 % des Werts. Drei Beobachtungen zählen für die Regeln:

- **Das Aluminiumgehäuse (AX)** ist hochwertig und gleichmäßig: ideal für häufigen, kleinen Nachschub über ein Lieferanten-Kanban oder einen Lieferplan.
- **Die Leiterplattenbaugruppe (BZ)** ist wertvoll und unregelmäßig. Ein Sicherheitsbestand auf Basis der Normalverteilung liegt hier falsch (Abschnitt 5.4). Fragen Sie zuerst, ob die Spitzen echter Bedarf sind oder Lose, die eine nachgelagerte Losgrößenregel erzeugt hat.
- **Der Schraubensatz (CX)** ist billig und gleichmäßig. Ein Zwei-Behälter-System oder ein vom Lieferanten gesteuerter Bestand (VMI) mit großzügigem Sicherheitsbestand ist billiger als die Zeit eines Disponenten.

Abschnitt 9 macht daraus eine Vorlage für Regeln in allen neun Klassen.

## 4. Nachschubverfahren: Bestellpunkt und Bestellrhythmus

### 4.1 Kontinuierliche Überprüfung: Bestellpunktverfahren (s, Q)

Bei kontinuierlicher Überprüfung prüft das System den Bestand nach jeder Buchung und löst eine Bestellung der Menge Q aus, wenn der disponible Bestand (Lagerbestand + Bestellbestand − Rückstände) auf den Meldebestand s fällt:

> **Meldebestand (Bestellpunkt) = d × L + SB**
>
> d = durchschnittlicher Bedarf je Tag, L = Wiederbeschaffungszeit in Tagen, SB = Sicherheitsbestand

### 4.2 Periodische Überprüfung: Bestellrhythmusverfahren mit Bestellniveau (R, S)

Bei periodischer Überprüfung wird der Bestand alle R Tage geprüft (zum Beispiel jeden Montag, wenn der Einkäufer die Wochenbestellung aufgibt), und die Bestellung füllt den disponiblen Bestand auf ein Zielniveau S auf. Weil die nächste Bestellgelegenheit R Tage entfernt ist, muss der Sicherheitsbestand die Wiederbeschaffungszeit *plus* das Überprüfungsintervall abdecken [2]:

> **Bestellniveau S = d × (L + R) + SB, mit SB = z × σ_d × √(L + R)**

### 4.3 Rechenbeispiel: ein Teil, zwei Verfahren

Ein Kaufteil (der Servomotor aus Abschnitt 3): durchschnittlicher Bedarf d = 40 Stück pro Tag, Standardabweichung des Tagesbedarfs σ_d = 12 Stück, Wiederbeschaffungszeit L = 10 Tage, Ziel-Alpha-Servicegrad 95 % (z = 1,645).

| | Kontinuierliche Überprüfung (s, Q) | Wöchentliche Überprüfung (R = 5 Arbeitstage) |
|---|---|---|
| Schutzzeitraum | L = 10 Tage | L + R = 15 Tage |
| σ über den Zeitraum | 12 × √10 = 37,9 | 12 × √15 = 46,5 |
| Sicherheitsbestand (z = 1,645) | **62 Stück** | **76 Stück** |
| Auslöser | Meldebestand = 40 × 10 + 62 = 462 Stück | Auffüllen auf S = 40 × 15 + 76 = 676 Stück |

Die wöchentliche Überprüfung braucht für denselben Schutz 14 Stück mehr (etwa 23 %). Bei einem A-Artikel lohnt sich häufigeres Überprüfen; bei einem C-Artikel ist der zusätzliche Puffer billiger als die Zeit des Disponenten.

## 5. Sicherheitsbestand: Formel, Berechnung und Bedeutung

Der Sicherheitsbestand ist der zusätzliche Bestand, der über dem erwarteten Bedarf während der Wiederbeschaffungszeit gehalten wird. Er hilft, Fehlmengen in der Produktion und bei Kundenlieferungen zu vermeiden, wenn sich der Bedarf ändert oder eine Lieferung zu spät kommt. Zu wenig, und Linien stehen oder Aufträge gehen unvollständig raus. Zu viel, und Überbestand bindet Liquidität und endet als Überhang oder Ladenhüter. Das Ziel jeder Berechnung ist der richtige Sicherheitsbestand: der kleinste Bestand, der den gewünschten Servicegrad erreicht. Puffer- oder Mindestbestand wird oft als Synonym verwendet.

Eine Faustregel, die auf vielen Supply-Chain-Seiten steht, lautet (maximaler Tagesverbrauch × maximale Wiederbeschaffungszeit) − (durchschnittlicher Tagesverbrauch × durchschnittliche Wiederbeschaffungszeit). Sie braucht keine Statistik, dimensioniert den Sicherheitsbestand aber für einen schlimmsten Fall, nicht für ein Serviceziel. Die Formeln unten tun Letzteres.

Der Pillar bringt die zwei Kernformeln: SB = z × σ_D × √L bei schwankendem Bedarf und SB = z × √(L × σ_D² + d² × σ_L²), wenn auch die Wiederbeschaffungszeit schwankt, mit einem Rechenbeispiel von 148 und 361 Stück ([Abschnitt 10 des Pillars](https://www.m365.fm/learn/produktionsplanung-aps/)). Diese Formeln folgen Silver, Pyke und Thomas [2]. Dieser Abschnitt behandelt, was bei ihrer Anwendung schiefgeht.

### 5.1 Alpha-Servicegrad vs. Beta-Servicegrad

Die Formel mit dem z-Faktor zielt auf den **Alpha-Servicegrad** (Cycle Service Level, CSL): die Wahrscheinlichkeit, dass in einem Wiederbeschaffungszyklus *keine* Fehlmenge auftritt. Kunden und Produktionsleiter interessiert meist der **Beta-Servicegrad** (Fill Rate): der Anteil der Bedarfs*menge*, der sofort ab Lager bedient wird [2].

Der Beta-Servicegrad hängt davon ab, wie oft Sie dem Fehlmengenrisiko ausgesetzt sind. Bei einer Bestellmenge von Q Stück je Zyklus beträgt die erwartete Fehlmenge je Zyklus σ × G(z), wobei G(z) die Verlustfunktion der Standardnormalverteilung ist und σ die Standardabweichung über den Schutzzeitraum. Also:

> **Beta-Servicegrad = 1 − (σ × G(z)) ÷ Q** (Standardnäherung für normalverteilten Bedarf mit Rückständen [2])

**Rechenbeispiel (Servomotor, wöchentliche Überprüfung).** Jede Bestellung deckt eine Woche, also Q = 40 × 5 = 200 Stück; σ über L + R = 46,5 Stück.

| Ziel | z | Sicherheitsbestand | Ergebnis der anderen Größe |
|---|---|---|---|
| Alpha 90 % | 1,282 | 60 Stück | Beta 98,9 % |
| Alpha 95 % | 1,645 | 76 Stück | Beta 99,5 % |
| **Beta 99 %** | **1,326** | **62 Stück** | Alpha 90,8 % |
| Alpha 99 % | 2,326 | 108 Stück | Beta 99,9 % |

(Für den Beta-Servicegrad 99 %: G(z) = (1 − 0,99) × 200 ÷ 46,5 = 0,043, daraus z ≈ 1,33. Alle Werte per Skript nachgerechnet.)

Lautet das Ziel "99 % der angeforderten Stück gehen ab Lager raus", schießt ein Alpha-Servicegrad von 95 % übers Ziel hinaus (76 statt 62 Stück). Lautet das Ziel "höchstens eine Fehlmengensituation in zwanzig Zyklen", greift die Formel für den Beta-Servicegrad zu kurz. Die Lücke wächst mit kleineren Bestellmengen. Schreiben Sie auf, welche Größe das Ziel meint, bevor jemand den z-Faktor anfasst.

### 5.2 Prognosefehler nutzen, nicht die Bedarfsschwankung

Das σ in der Formel soll messen, was Sie nicht vorhersagen können. Hat der Bedarf einen Trend oder eine Saisonalität, die die Prognose erfasst, überschätzt die rohe Standardabweichung des Bedarfs das Risiko. Nutzen Sie stattdessen die Standardabweichung der Prognosefehler (Ist minus Prognose, bei gleicher Periodenlänge). Meldet Ihr System nur die mittlere absolute Abweichung (MAD), gilt für normalverteilte Fehler die übliche Näherung σ ≈ 1,25 × MAD [2]. Eine MAD von 10 Stück pro Tag wird zu σ ≈ 12,5. Und skalieren Sie σ nur dann mit √Zeit, wenn aufeinanderfolgende Perioden unabhängig sind; andernfalls messen Sie es bei der benötigten Periodenlänge.

### 5.3 Schwankende Wiederbeschaffungszeit ist oft der größere Treiber

Im Beispiel des Pillars treibt ein unzuverlässiger Lieferant mit einer Standardabweichung der Wiederbeschaffungszeit von zwei Tagen den Sicherheitsbestand von 148 auf 361 Stück, und die Schwankung der Wiederbeschaffungszeit trägt etwa 83 % der Varianz bei. Bevor Sie z erhöhen, messen Sie die Schwankung der Lieferzeit und arbeiten Sie mit dem Einkauf daran. Programme zur Lieferantenleistung und Dual Sourcing behandelt m365.fm unter resilienten Lieferketten (geplant).

### 5.4 Sporadischer und klumpiger Bedarf

Die Normalverteilung versagt bei Z-Artikeln mit vielen Nullperioden. Optionen, nach Aufwand geordnet:

1. Klären, ob die Klumpen echt sind. Oft entstehen sie durch Losbildung weiter hinten (beim Kunden oder durch eine interne Losgrößenregel).
2. Für Ersatzteile mit geringer Menge ein Min/Max nach Kritikalität und dem größten plausiblen Bedarf während der Wiederbeschaffungszeit festlegen.
3. Eine passende Verteilung nutzen (Poisson für kleine Stückzahlen) oder das Verfahren auf historischem Bedarf simulieren.

### 5.5 Abhängiger Bedarf: Sicherheitszeit statt Sicherheitsbestand

Bei Komponenten, die das MRP plant, kommt die Unsicherheit meist aus dem Liefertermin oder aus Änderungen des Hauptproduktionsplans, nicht aus zufälligem Verbrauch. Eine **Sicherheitszeit** (den Zugang ein paar Tage früher planen) schützt gegen verspätete Lieferungen, ohne einen dauerhaften Bestand zu halten. Nutzen Sie Sicherheitsbestand bei Komponenten nur dort, wo Sie bewusst entkoppeln, zum Beispiel bei einem Teil mit langer Wiederbeschaffungszeit, das in vielen Enderzeugnissen steckt. Die S&OP-Seite dieser Frage, also wie viel Planstabilität der Hauptproduktionsplan zusagen soll, gehört in den Pillar [S&OP, MRP und Produktionsplanung](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) (geplant).

### 5.6 Checkliste zur Überprüfung des Sicherheitsbestands

| Prüfpunkt | Erledigt |
|---|---|
| Servicegröße festgelegt (Alpha oder Beta) und mit dem Vertrieb oder dem internen Kunden abgestimmt | |
| σ auf Basis des Prognosefehlers, bei der richtigen Periodenlänge | |
| Mittelwert und Standardabweichung der Wiederbeschaffungszeit aus Wareneingängen gemessen, nicht aus Stammdaten übernommen | |
| Überprüfungsintervall bei periodisch überprüften Artikeln berücksichtigt | |
| Z-Artikel auf echte vs. durch Losbildung erzeugte Klumpen geprüft | |
| Verbrauch des Sicherheitsbestands verfolgt: Wird er in jedem Zyklus verbraucht, ist er kein Sicherheitsbestand, sondern ein Planungsfehler | |
| Bei A-Artikeln mindestens quartalsweise neu berechnet | |

## 6. WIP: der Bestand, den die Feinplanung steuert

WIP ist der Bestand, den die Feinplanung erzeugt. Nach Littles Gesetz gilt: durchschnittlicher WIP = Durchsatz × durchschnittliche Durchlaufzeit; bei konstantem Durchsatz ist also jeder zu früh freigegebene Auftrag zusätzliche Durchlaufzeit [3]. Daraus folgen drei Regeln:

- **Gegen Kapazität freigeben, nicht nur nach MRP-Termin.** Aufträge, die in eine volle Warteschlange freigegeben werden, erhöhen den WIP, nicht die Ausbringung. [Kanban](https://www.m365.fm/learn/kanban-pull-prinzip/) oder CONWIP-Obergrenzen verhindern das.
- **WIP in Tagen messen, nicht in Geld.** 500.000 USD WIP sagen wenig; "neun Tage WIP vor der Zerspanung" ist handlungsleitend.
- **Den Engpasspuffer gesondert beobachten.** WIP vor dem Engpass schützt den Durchsatz und ist gewollt (siehe [Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/), geplant). WIP vor Nicht-Engpässen ist meist Verschwendung.

Den Materialfluss zwischen Lager und Linie, die andere Hälfte des WIP, behandelt der Schwesterartikel zur [Intralogistik](https://www.m365.fm/learn/produktionsplanung-aps/intralogistik/).

## 7. Bestandsgenauigkeit und permanente Inventur

### 7.1 Warum Genauigkeit zuerst kommt

Jede Formel oben nutzt den Buchbestand des Systems. Ist er falsch, lösen Meldebestände zu spät aus, das MRP plant mit Phantombestand, und freigegebene Aufträge stehen wegen fehlender Teile. Die **Bestandsgenauigkeit** ist der Anteil der gezählten Artikel, deren Systemmenge innerhalb einer festgelegten Toleranz mit der Zählung übereinstimmt. Die Toleranzen werden je Klasse festgelegt: null für A-Artikel und serialisierte Teile, ein kleiner Prozentsatz für C-Schüttgut, das nach Gewicht gezählt wird. Führen Sie gesperrten Bestand (Quarantäne, fehlerhaftes Material vor der Entscheidung) in einem eigenen Bestandsstatus, damit das MRP nicht damit plant.

### 7.2 Permanente Inventur nach ABC-Klasse

Die permanente Inventur (Cycle Counting) ersetzt (oder verringert) die jährliche Stichtagsinventur, indem jeden Tag eine kleine Zahl von Lagerplätzen gezählt wird, hochwertige Artikel häufiger.

**Rechenbeispiel.** Ein Werk hat 2.000 aktive Artikel und 240 Arbeitstage pro Jahr.

| Klasse | Artikel | Zählungen pro Jahr je Artikel | Zählungen pro Jahr |
|---|---|---|---|
| A | 200 | 12 (monatlich) | 2.400 |
| B | 600 | 4 (quartalsweise) | 2.400 |
| C | 1.200 | 2 (zweimal im Jahr) | 2.400 |
| **Summe** | **2.000** | | **7.200** |

7.200 Zählungen ÷ 240 Tage = **30 Zählungen pro Tag**. Bei wenigen Minuten je Zählung plus Klärung der Differenzen ist das ein Teil des Arbeitstags einer Person, keine Abteilung.

Drei Regeln lassen die permanente Inventur funktionieren:

1. **Die Ursache jeder Differenz außerhalb der Toleranz finden.** Untersuchen Sie den Prozess, nicht den Zähler. Wer die Zahl korrigiert, ohne nicht gemeldeten Ausschuss, Fehler bei der retrograden Entnahme oder eine falsche Mengeneinheit zu beheben, hat nächsten Monat denselben Fehler.
2. **In einem ruhigen Moment zählen.** Zählen Sie einen Lagerplatz, wenn keine Buchungen offen sind, oder sperren Sie ihn kurz. Zählen während einer offenen Kommissionierung erzeugt falsche Differenzen.
3. **Genauigkeit nach Klasse und Ursache berichten.** "97 % genau" insgesamt kann A-Artikel mit 90 % verbergen.

Ob die permanente Inventur die jährliche Stichtagsinventur für die Rechnungslegung ersetzen kann, ist eine Frage für Ihre Wirtschaftsprüfer.

## 8. Bestandsbewertung: Grundlagen nach US GAAP und IRS

Dieser Abschnitt behandelt, was eine Führungskraft aus der Produktion für das Gespräch mit dem Controlling braucht. Er beschreibt US-Regeln und ist keine Bilanz- oder Steuerberatung.

### 8.1 Was in die Bestandskosten eingeht

Nach US GAAP regelt FASB ASC Topic 330 die Vorräte. Die Bestandskosten umfassen Materialeinzelkosten, Fertigungslöhne und einen Anteil der Fertigungsgemeinkosten. Fixe Gemeinkosten werden auf Basis der Normalkapazität des Werks verteilt; außergewöhnliche Kosten wie ungewöhnlich hohe Leerkapazität oder außergewöhnlicher Ausschuss werden in der Periode als Aufwand erfasst statt aktiviert [4][9][10]. Steuerlich verlangt die IRS ähnlich, dass Vorräte zu Anschaffungs- bzw. Herstellkosten "alle direkten und indirekten Kosten enthalten, die mit ihnen verbunden sind" [5], und die Uniform-Capitalization-Regeln von Section 263A haben Vorrang vor den allgemeinen Vorratsregeln [5][6].

Die Folge für den Betrieb: Läuft ein Werk deutlich unter Normalkapazität, geht ein Teil der fixen Gemeinkosten direkt in die Gewinn- und Verlustrechnung statt in den Bestand, ein Grund, warum sich die Finanzabteilung für den Auslastungsplan im S&OP interessiert.

### 8.2 Verbrauchsfolgeverfahren: FIFO, LIFO, gewogener Durchschnitt

Die Verbrauchsfolgeannahme entscheidet, welche Kosten in die Herstellkosten des Umsatzes gehen und welche im Bestand bleiben. Sie ändert nicht, welche physischen Teile verbraucht werden. Die IRS beschreibt FIFO als Annahme, dass "die zuerst gekauften oder hergestellten Artikel die zuerst verkauften sind", und LIFO als Annahme, dass "die zuletzt gekauften oder hergestellten Vorräte die zuerst verkauften sind" [5].

**Rechenbeispiel.** Ein händlerähnlicher Artikel mit drei Zugängen in einem Jahr steigender Preise und 2.000 verbrauchten Stück:

| Zugang | Stück | Stückkosten | Wert |
|---|---|---|---|
| 1 | 1.000 | 10,00 USD | 10.000 USD |
| 2 | 1.000 | 10,50 USD | 10.500 USD |
| 3 | 1.000 | 11,00 USD | 11.000 USD |
| **Summe** | **3.000** | | **31.500 USD** |

| Verfahren | Herstellkosten für 2.000 Stück | Endbestand (1.000 Stück) |
|---|---|---|
| FIFO | 10.000 USD + 10.500 USD = 20.500 USD | 11.000 USD |
| Gewogener Durchschnitt (10,50 USD) | 21.000 USD | 10.500 USD |
| LIFO | 11.000 USD + 10.500 USD = 21.500 USD | 10.000 USD |

Bei steigenden Kosten weist LIFO 1.000 USD mehr Herstellkosten und damit ein niedrigeres zu versteuerndes Einkommen aus als FIFO. Die Differenz zwischen FIFO- und LIFO-Wert des Endbestands (hier 11.000 USD − 10.000 USD = 1.000 USD) weisen Unternehmen als **LIFO-Reserve** aus.

LIFO hat Bedingungen. Ein Steuerpflichtiger wählt es, indem er mit der Steuererklärung für das erste LIFO-Jahr das Formular 970 einreicht [5], und nach der **LIFO-Konformitätsregel** von 26 U.S.C. § 472(c) darf ein Unternehmen, das LIFO steuerlich nutzt, in diesem Jahr keine andere Methode verwenden, um Eigentümern oder Kreditgebern das Ergebnis zu berichten [7]. US-Tochtergesellschaften von Konzernen, die nach IFRS berichten, sollten die Konzernrichtlinie prüfen, weil die IFRS-Regeln zu Kostenformeln abweichen [unbelegt: IFRS-Text nicht eingesehen].

**Standardkostenrechnung.** Die meisten Hersteller führen den Bestand im ERP zu Standardkosten und buchen Preis-, Verbrauchs- und Lohnabweichungen. Fragen Sie das Controlling, wie große Abweichungen zum Periodenende behandelt werden. Für die Produktion ist eine Materialpreisabweichung ein Signal an den Einkauf, eine Verbrauchsabweichung ein Signal an den Shopfloor.

### 8.3 Abwertungen: niedrigerer Wert aus Kosten und Nettoveräußerungswert

Vorräte dürfen nicht über dem Wert stehen, den sie wieder einbringen. Seit ASU 2015-11 bewertet US GAAP Vorräte unter FIFO oder Durchschnittskosten zum **niedrigeren Wert aus Kosten und Nettoveräußerungswert (Net Realizable Value, NRV)**; Vorräte unter LIFO oder der Retail-Methode nutzen weiter den älteren Test "Lower of Cost or Market" [8][11]. Steuerlich erlaubt die IRS die Bewertung zu Kosten oder zum niedrigeren Wert aus Kosten und Marktwert, angewendet Artikel für Artikel ("jeder Artikel im Bestand muss einzeln bewertet werden") [5].

**Rechenbeispiel.** Eine fertige Pumpe hat Standardkosten von 50 USD. Ihr erwarteter Verkaufspreis liegt jetzt bei 60 USD, und Fertigstellungs-, Verpackungs- und Vertriebskosten betragen 15 USD. NRV = 60 USD − 15 USD = 45 USD. Die Abwertung beträgt 50 USD − 45 USD = **5 USD je Stück**, als Aufwand der Periode erfasst.

### 8.4 Über- und Altbestände (Excess and Obsolete, E&O)

Wertberichtigungen auf Über- und Altbestände sind die Stelle, an der Bestandsmanagement und Finanzen am direktesten zusammentreffen. Eine einfache, prüfbare Regel nutzt Reichweite und Bewegung:

| Bedingung (je Artikel) | Wertberichtigungssatz (Beispielregel) |
|---|---|
| Bestand ≤ 12 Monate prognostizierter Bedarf, in den letzten 6 Monaten bewegt | 0 % |
| Bestand > 12 Monate prognostizierter Bedarf | 25 % der Übermenge |
| Bestand > 24 Monate prognostizierter Bedarf | 50 % der Übermenge |
| 12 Monate keine Bewegung und kein Bedarf im Plan | 100 % |
| Technische Änderung: ersetzt, kein Servicebedarf | 100 % |

Die Sätze sind ein Beispiel; legen Sie sie mit Controlling und Wirtschaftsprüfern fest. Die Liste hinter der Wertberichtigung zeigt, welche Losgrößenregeln, Mindestbestellmengen und Prognoseverzerrungen den Überbestand erzeugt haben.

### 8.5 Kleine Hersteller

Die IRS erlaubt kleinen Unternehmen mit durchschnittlichen jährlichen Bruttoeinnahmen von "26 Mio. USD oder weniger (inflationsindexiert)", auf die Führung von Vorräten im steuerlichen Sinn zu verzichten [5]. Diese steuerliche Wahl ändert nichts daran, dass der Betrieb wissen muss, was in den Regalen liegt.

## 9. Vorlage: Bestandsregeln je ABC/XYZ-Klasse

| Klasse | Nachschub | Überprüfung | Serviceziel (Beispiel) | Methode Sicherheitsbestand | Aufmerksamkeit des Disponenten |
|---|---|---|---|---|---|
| AX | Kanban, Lieferplan, häufige kleine Lieferungen | kontinuierlich oder täglich | Beta-Servicegrad 98 bis 99 % | Formel, niedrig, weil der Bedarf gleichmäßig ist | hoch: Losgröße und Wiederbeschaffungszeit senken |
| AY | MRP oder Bestellpunkt mit Prognose | kontinuierlich | Beta-Servicegrad 97 bis 99 % | Formel auf Prognosefehler | hoch |
| AZ | Auftragsfertigung bzw. -beschaffung, wo die Wiederbeschaffungszeit es erlaubt | je Auftrag | vereinbarter Liefertermin | Bestand vermeiden; Sicherheitszeit nutzen | hoch: Treiber der Klumpen verstehen |
| BX | Bestellpunkt oder Kanban | wöchentlich | Beta-Servicegrad 98 % | Formel | mittel |
| BY | Bestellpunkt oder Bestellrhythmus | wöchentlich | Beta-Servicegrad 97 % | Formel auf Prognosefehler | mittel |
| BZ | Bestellrhythmus, Min/Max | wöchentlich | je Artikel vereinbart | Simulation oder Min/Max | mittel |
| CX | Zwei-Behälter-System, VMI | visuell | Beta-Servicegrad 99 %+ | großzügig, weil der Bestand billig ist | gering |
| CY | Zwei-Behälter-System, Bestellrhythmus | monatlich | Beta-Servicegrad 98 % | großzügig | gering |
| CZ | Min/Max oder Bestellung bei Bedarf | monatlich | nach Kritikalität | Min/Max nach Kritikalität | gering, außer bei kritischen Ersatzteilen |

Die Serviceziele in der Tabelle sind beispielhafte Startpunkte, keine Benchmarks.

## 10. Häufige Fehler

1. **Sicherheitsbestand auf jeder Stücklistenebene.** Das puffert abhängigen Bedarf doppelt und bläht den WIP auf. Nutzen Sie ihn nur an Entkopplungspunkten.
2. **Ein z-Faktor, den niemand erklären kann.** Steht im ERP "z = 2" ohne ausdrückliches Alpha- oder Beta-Ziel, weiß niemand, für welchen Servicegrad das Werk bezahlt.
3. **σ aus dem Rohbedarf statt aus dem Prognosefehler.** Saisonartikel bekommen viel zu viel Puffer.
4. **Das Überprüfungsintervall vergessen.** Wöchentlich bestellte Artikel mit einer Formel für kontinuierliche Überprüfung sind etwa um den Faktor √((L + R) ÷ L) unterversorgt.
5. **Zähldifferenzen ohne Ursachenanalyse korrigieren.** Derselbe Fehler taucht in jedem Zyklus wieder auf.
6. **Umschlag nur insgesamt.** Die Summe verbirgt, ob Rohstoffe oder Fertigware das Problem sind.
7. **Über- und Altbestände als reines Finanzthema behandeln.** Jeder Dollar Wertberichtigung hat eine betriebliche Ursache: eine Mindestbestellmenge, ein zu großes Los oder eine verzerrte Prognose.
8. **Bestand senken, ohne die Schwankung zu senken.** Ein niedrigerer Sicherheitsbestand bei unveränderter Schwankung der Wiederbeschaffungszeit verwandelt Bestandskosten in Eilaufträge.

## 11. FAQ: Bestandsmanagement in der Produktion

### Was ist Bestandsmanagement in der Produktion?

Bestandsmanagement in der Produktion ist die Planung und Steuerung von Rohstoffen, Kaufteilen, Halbfertigware, Fertigware und MRO-Material in einem Werk. Es entscheidet, was bevorratet wird, wie viel, wann nachbestellt wird und wie die Bestandsdaten korrekt bleiben, damit die Produktion nicht stillsteht und kein Kapital unnötig gebunden ist.

### Welche Bestandsarten gibt es in der Produktion?

Rohstoffe und Kaufteile, Halbfertigware (WIP), Fertigware und MRO-Material (Instandhaltung, Reparatur und Betrieb), bei vielen Herstellern zusätzlich Serviceteile. Rohstoffe und WIP haben abhängigen Bedarf; Fertigware und Serviceteile haben unabhängigen Bedarf.

### Wie berechnet man den Sicherheitsbestand?

Bei schwankendem Bedarf und konstanter Wiederbeschaffungszeit: SB = z × σ_d × √L, wobei z aus dem Ziel-Alpha-Servicegrad folgt, σ_d die Standardabweichung des Tagesbedarfs ist (idealerweise des Prognosefehlers) und L die Wiederbeschaffungszeit in Tagen. Mit σ_d = 12, L = 10 Tagen und einem Alpha-Servicegrad von 95 % ergibt sich SB = 1,645 × 12 × √10 ≈ 62 Stück. Beim Bestellrhythmusverfahren ersetzen Sie L durch L + R.

### Was ist der Unterschied zwischen Sicherheitsbestand und Meldebestand?

Der Sicherheitsbestand ist der Puffer für Unsicherheit. Der Meldebestand (Bestellpunkt) löst eine neue Bestellung aus: durchschnittlicher Bedarf während der Wiederbeschaffungszeit plus Sicherheitsbestand, hier 400 + 62 = 462 Stück.

### Was ist der Unterschied zwischen Alpha- und Beta-Servicegrad?

Der Alpha-Servicegrad (Cycle Service Level) ist die Wahrscheinlichkeit, dass in einem Wiederbeschaffungszyklus keine Fehlmenge auftritt. Der Beta-Servicegrad (Fill Rate) ist der Anteil der Bedarfsmenge, der sofort ab Lager bedient wird. Derselbe Sicherheitsbestand ergibt für beide unterschiedliche Werte: Im Beispiel bringen 62 Stück einen Beta-Servicegrad von 99 %, aber nur einen Alpha-Servicegrad von etwa 91 %.

### Wie berechnet man die Lagerumschlagshäufigkeit für einen Hersteller?

Teilen Sie die jährlichen Herstellkosten des Umsatzes durch den durchschnittlichen Bestand zu Kosten. Bei Herstellkosten von 24 Mio. USD und einem durchschnittlichen Bestand von 4 Mio. USD liegt der Umschlag bei 6,0, das sind etwa 61 Tage Reichweite. Berechnen Sie ihn getrennt für Rohstoffe, WIP und Fertigware, um zu sehen, wo sich Bestand ansammelt.

### Was ist eine ABC/XYZ-Analyse?

ABC ordnet Artikel nach Jahresverbrauchswert; XYZ ordnet sie nach Bedarfsschwankung, meist über den Variationskoeffizienten. Kombiniert ergeben sich neun Klassen, jede mit eigenem Nachschub-, Überprüfungs- und Sicherheitsbestandsverfahren.

### Was ist eine gute Lagerumschlagshäufigkeit?

Es gibt nicht die eine gute Zahl. Vergleichswerte schwanken stark nach Branche, Produktmix und Bestandsart; ein Wert, der für ein Lebensmittelwerk gesund ist, kann für einen Maschinenbauer schlecht sein. Vergleichen Sie mit Ihrem eigenen Trend und mit Wettbewerbern im selben Segment und betrachten Sie Rohstoffe, WIP und Fertigware getrennt.

### Wie viel Sicherheitsbestand sollte man halten?

So viel, wie für den vereinbarten Servicegrad nötig ist, und nicht mehr. Im Beispiel des Servomotors braucht ein Alpha-Servicegrad von 95 % bei kontinuierlicher Überprüfung 62 Stück und bei wöchentlicher Überprüfung 76 Stück. Berechnen Sie den Sicherheitsbestand neu, wenn sich Bedarf, Prognosefehler oder Wiederbeschaffungszeit des Lieferanten ändern, bei A-Artikeln mindestens quartalsweise.

### Welches Bewertungsverfahren sollte ein Hersteller nutzen?

Das entscheiden Finanzabteilung und Steuerberater. Nach US GAAP werden FIFO, gewogener Durchschnitt und LIFO genutzt. Bei steigenden Kosten senkt LIFO das zu versteuernde Einkommen, aber ein Unternehmen, das LIFO in den USA steuerlich nutzt, muss es auch in Berichten an Eigentümer und Kreditgeber verwenden (LIFO-Konformitätsregel).

### Wie oft sollte man bei der permanenten Inventur zählen?

Ein üblicher Ansatz: A-Artikel monatlich, B quartalsweise, C ein- oder zweimal im Jahr. Bei 2.000 Artikeln sind das etwa 30 Zählungen je Arbeitstag. Zählen Sie Artikel mit wiederholten Fehlern und kritische Ersatzteile häufiger.

## 12. Fazit

Der Bestand im Werk ist das sichtbare Ergebnis von Losgrößenregeln, Servicezielen, Wiederbeschaffungszeiten der Lieferanten, Bestandsgenauigkeit und Auftragsfreigabe. Die Rechnungen in diesem Artikel sind einfach, aber jede erzwingt eine Entscheidung, für die jemand geradestehen muss: welche Servicegröße das Werk anstrebt, hinter welchem Lagerhaltungskostensatz die Finanzabteilung steht, wie oft jede Klasse überprüft und gezählt wird und wo in der Stückliste Puffer hingehören.

Beginnen Sie mit dem Umschlag je Bestandsart, einer ABC/XYZ-Klassifizierung und der Genauigkeit Ihrer A-Artikel. Dimensionieren Sie dann den Sicherheitsbestand für die richtige Servicegröße und den richtigen Schutzzeitraum, und arbeiten Sie an der Schwankung der Wiederbeschaffungszeit, bevor Sie einen z-Faktor erhöhen. Die Seite der Feinplanung, also wie WIP und Durchlaufzeiten aus der Auftragsfreigabe folgen, steht im Parent-Leitfaden zur Produktionsplanung mit APS.

## Weiterlesen auf m365.fm

**Parent-Leitfaden**

- [Produktionsplanung mit APS: der vollständige Leitfaden](https://www.m365.fm/learn/produktionsplanung-aps/)

**Schwester-Cluster (geplant)**

- [Losgröße berechnen: Andler-Formel (EOQ), EPQ und dynamische Verfahren](https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/) (geplant)
- [Intralogistik: innerbetrieblicher Materialfluss, Milkrun und AMR](https://www.m365.fm/learn/produktionsplanung-aps/intralogistik/) (geplant)

**Verwandte Pillars (geplant)**

- [S&OP, MRP und Produktionsplanung](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) (geplant)
- [Kanban und Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/) (geplant)
- [Theory of Constraints und Engpasstheorie](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)
- [Lean Management](https://www.m365.fm/learn/lean-management/)

**Begriffsseiten**

[Sicherheitsbestand](https://www.m365.fm/entity/safety-stock/) · [Losgröße](https://www.m365.fm/entity/batch-size/) · [Durchlaufzeit](https://www.m365.fm/entity/lead-time/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Pull-Prinzip](https://www.m365.fm/entity/pull-system/) · [ERP](https://www.m365.fm/entity/enterprise-resource-planning/)

---

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Produktionsplanung und Feinplanung, Lean Management und die digitale Transformation der Fertigung.

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

*[Redaktion: Rolle, Werdegang und Profilfoto des Autors ergänzen.]*

---

# Quellen

Alle Online-Quellen abgerufen am 20. November 2026.

1. Orlicky, Joseph: Material Requirements Planning. The New Way of Life in Production and Inventory Management. McGraw-Hill, New York 1975.
2. Silver, Edward A.; Pyke, David F.; Thomas, Douglas J.: Inventory and Production Management in Supply Chains. 4. Aufl., CRC Press, Boca Raton 2017, ISBN 978-1-4665-5861-8.
3. Little, John D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (1961) 3, S. 383–387. DOI: 10.1287/opre.9.3.383
4. FASB Accounting Standards Codification, Topic 330, Inventory. https://asc.fasb.org/ (Wortlaut der Paragraphen nicht geöffnet; Inhalt über [9] und [10] bestätigt)
5. Internal Revenue Service: Publication 538 (01/2022), Accounting Periods and Methods, Abschnitt "Inventories". https://www.irs.gov/publications/p538
6. 26 U.S.C. § 263A, Capitalization and inclusion in inventory costs of certain expenses. https://www.law.cornell.edu/uscode/text/26/263A (geöffnet am 20. November 2026: (a)(1) Kosten gehen bei Vorratsvermögen in die Bestandskosten ein; (a)(2) direkte Kosten plus angemessener Anteil indirekter Kosten; (i) Ausnahme für kleine Unternehmen über den Bruttoeinnahmentest nach § 448(c))
7. 26 U.S.C. § 472, Last-in, first-out inventories, Unterabschnitt (c). https://www.law.cornell.edu/uscode/text/26/472
8. FASB: Accounting Standards Update No. 2015-11, Inventory (Topic 330): Simplifying the Measurement of Inventory. 2015. (ASU-Text nicht geöffnet; Inhalt über [11] bestätigt)
9. PwC Viewpoint: Inventory guide, Abschnitt 1.3 Cost (Kosten als Summe der direkt oder indirekt angefallenen Aufwendungen; außergewöhnliche Fracht-, Handling- und Verderbkosten als Aufwand der laufenden Periode; ASC 330-10-30-3 bis 30-8). https://viewpoint.pwc.com/dt/us/en/pwc/accounting_guides/inventory/Inventory-Guide/Chapter-1-Inventory-costing/1_3_Cost.html
10. RSM US LLP: Inventory valuation considerations in the forecasted economy, April 2023 (fixe Fertigungsgemeinkosten auf Basis der Normalkapazität verteilt; nicht verteilte fixe Gemeinkosten aus außergewöhnlich niedriger Produktion als Aufwand, ASC 330-10-30-6). https://rsmus.com/content/dam/rsm/insights/financial-reporting/1pdf/Inventory-valuation-considerations-in-the-forecasted-economy.pdf
11. Journal of Accountancy: FASB simplifies inventory measurement guidance, 1. Oktober 2015 (ASU 2015-11: niedrigerer Wert aus Kosten und NRV für alle Vorräte außer LIFO und Retail-Methode; Definition NRV; gültig für Public Business Entities für Geschäftsjahre, die nach dem 15. Dezember 2016 beginnen). https://www.journalofaccountancy.com/issues/2015/oct/fasb-simplifies-inventory-measurement-guidance/

---

# Prüfhinweise für die Redaktion

Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.

## URL- und Strukturannahmen

- Cluster-URL `https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/` nach dem verschachtelten Schema des Briefs (Annahme).
- Die EN-Fassung verlinkt die Sprungmarke `#10-safety-stock-formula-and-worked-example` im Pillar. Der Anker des deutschen Pillars ist nicht bekannt; der Link zeigt vorerst auf die Pillar-URL ohne Anker. Nach Prüfung ergänzen.
- Inhaltsverzeichnis-Anker als ASCII-Anker (ae/oe/ue); nach dem CMS-Import testen.

## [Unbelegt]-Stellen und Prüfpunkte

1. IFRS-Bemerkung zu Kostenformeln (Abschnitt 8.2) [unbelegt].
2. ABC/XYZ-Grenzen, Wertberichtigungssätze für Über- und Altbestände und Serviceziele sind als Konventionen bzw. Beispiele gekennzeichnet, keine belegten Normen.
3. Resiliente Lieferketten (Abschnitt 5.3) wie im Original ohne Link erwähnt; deutsche Ziel-URL wäre `https://www.m365.fm/learn/operational-excellence/resiliente-lieferketten/` (geplant), Link setzen, sobald bestätigt.
4. Alle Rechenbeispiele sind konstruierte Beispielzahlen; USD bewusst beibehalten.
5. Terminologie: "Cycle Service Level" als Alpha-Servicegrad und "Fill Rate" als Beta-Servicegrad übertragen (übliche deutsche Lehrbuchbegriffe); von der Fachprüfung bestätigen lassen. "Cycle Counting" als permanente Inventur übertragen; im deutschen Handelsrecht ist "permanente Inventur" ein eigenes Inventurverfahren, Gleichsetzung prüfen.
6. IRS-Zitate sinngemäß übersetzt.

## Für den deutschen Markt prüfen

- Abschnitt 8 beschreibt ausschließlich US GAAP und US-Steuerrecht (IRS). Für deutsche Leser durch die Fachprüfung (Controller/Steuerberater) einen Hinweis prüfen lassen: HGB (z. B. Herstellungskosten § 255 HGB, Bewertungsvereinfachungen § 256 HGB, strenges Niederstwertprinzip § 253 Abs. 4 HGB), steuerliche Regeln (§ 6 EStG, LIFO steuerlich), Inventurverfahren (§§ 240, 241 HGB) und IFRS (IAS 2). Nicht ohne Prüfung als Fakt einfügen.
- Abschnitt 8.5 (Kleinunternehmerregel der IRS) hat keine deutsche Entsprechung im Text; ggf. kennzeichnen oder kürzen nur nach redaktioneller Entscheidung.

## Herstellerangaben und iFAKT

- Keine Herstelleraussagen im Text. iFAKT im Text nicht erwähnt; Offenlegung in der Autorenbox exakt wie vorgegeben.

## Interne Links

- Parent-Pillar in Unterzeile und erstem Absatz, Abschnitt 5, Weiterlesen.
- Schwester-Cluster: losgroesse (Abschnitt 1), intralogistik (Abschnitt 6).
- Neue Pillars: sop-mrp-produktionsplanung (5.5), kanban-pull-prinzip (6), theory-of-constraints-engpass (6); bestehend: produktionskennzahlen (2.1). Alle deutschen Ziel-URLs vor dem Go-live prüfen.

## Empfohlene Grafiken

- ABC-Paretokurve der zehn Artikel mit A/B/C-Grenzen.
- 3 × 3-Matrix ABC/XYZ mit den Stichworten aus Abschnitt 9.
- Sägezahndiagramm: kontinuierliche vs. wöchentliche Überprüfung, Sicherheitsbestand 62 vs. 76 Stück.
- Balkendiagramm: benötigter Sicherheitsbestand für Alpha 90/95/99 % vs. Beta 99 %.

## JSON-LD-Vorschlag

Article, FAQPage und BreadcrumbList wie in der englischen Fassung, mit `"inLanguage": "de-DE"`, URL https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/, `isPartOf` https://www.m365.fm/learn/produktionsplanung-aps/, `headline` wie H1, FAQPage mit allen 11 FAQ-Fragen auf Deutsch (ohne Quellenmarker), Breadcrumb Learn > Produktionsplanung mit APS > Bestandsmanagement.

## hreflang

`de-DE` https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/ <-> `en-US` https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/
