# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Losgröße berechnen: Andler-Formel, Beispiel und Grenzen (55 Zeichen) |
| Meta-Description | Losgröße berechnen mit Rechenbeispielen: Andler-Formel (EOQ), EPQ, Mengenrabatt, Lot-for-Lot, Silver-Meal, Wagner-Whitin und Kapazitätsgrenzen. (143 Zeichen) |
| Slug | `/learn/produktionsplanung-aps/losgroesse/` (vollständige URL: https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/) |
| Parent-Pillar | [Produktionsplanung mit APS](https://www.m365.fm/learn/produktionsplanung-aps/) |
| Hauptkeyword | Losgröße berechnen |
| Nebenkeywords | optimale Losgröße, Andler-Formel, Andlersche Losgrößenformel, wirtschaftliche Losgröße, klassische Losgrößenformel, Losgrößenplanung, Losgrößenverfahren MRP, Fertigungslosgröße, EPQ, EOQ, exakte Losgröße (Lot-for-Lot), feste Losgröße, Periodenlosgröße, Stückperiodenausgleich, gleitende wirtschaftliche Losgröße, Silver-Meal-Verfahren, Wagner-Whitin-Algorithmus, dynamische Losgrößenplanung, kapazitierte Losgrößenplanung, Mengenrabatt Losgröße, EPEI, Losgrößenreduzierung |
| Suchintention | Informational mit praktischer Ebene "wie rechne ich das". Leser wollen Formeln, einen durchgerechneten Vergleich der Verfahren und Hinweise, welche Regel im ERP eingestellt werden soll. |
| Wortzahl | 4.914 Wörter (`wc -w` von H1 bis Fazit, inkl. FAQ, ohne Weiterlesen); englische Fassung: 5.030 Wörter (98 %) |
| Sprachversion | `de-DE`; hreflang-Paar: `de-DE` https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/ <-> `en-US` https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus.

# Losgröße berechnen: Andler-Formel (EOQ), EPQ und dynamische Verfahren mit Rechenbeispielen

*Stand: 20. November 2026 · Teil des Leitfadens [Produktionsplanung mit APS](https://www.m365.fm/learn/produktionsplanung-aps/)*

> **Kurzantwort:** Die Losgrößenplanung entscheidet, wie viele Einheiten je Auftrag gefertigt oder beschafft werden. Statische Regeln wie die wirtschaftliche Bestellmenge (EOQ, Economic Order Quantity, im deutschsprachigen Raum als Andler-Formel bekannt) und die wirtschaftliche Fertigungslosgröße (EPQ, Economic Production Quantity) setzen einen gleichmäßigen Bedarf voraus. Dynamische Regeln wie das Silver-Meal-Verfahren, der Stückperiodenausgleich und der Wagner-Whitin-Algorithmus kommen mit Bedarf zurecht, der sich von Woche zu Woche ändert. Alle wägen Rüst- oder Bestellkosten gegen Lagerhaltungskosten ab. Keine davon sieht die Kapazität, deshalb brauchen Engpassarbeitsplätze eine eigene Prüfung.

Die Losgrößenplanung sitzt zwischen Materialbedarfsplanung und Shopfloor. Der MRP-Lauf ermittelt die Nettobedarfe; die Losgrößenregel macht daraus Planaufträge. Der Leitfaden zur [Produktionsplanung mit APS](https://www.m365.fm/learn/produktionsplanung-aps/) stellt die EOQ-Formel und ihre Grenzen in einem Abschnitt vor. Dieser Artikel geht weiter: endliche Produktionsgeschwindigkeit (EPQ), Preisstaffeln, die ganze Familie der MRP-Losgrößenverfahren an einem Datensatz und was sich ändert, wenn Rüstvorgänge Engpasskapazität verbrauchen.

### Das Wichtigste in Kürze

- **Die Regel nach dem Bedarfsverlauf wählen.** EOQ oder EPQ für gleichmäßigen Bedarf. Für schwankenden, zeitlich gestaffelten Bedarf aus dem MRP ein dynamisches Verfahren. Die exakte Losgröße (Lot-for-Lot) ist nur dann der Standard, wenn Rüsten billig ist.
- **EPQ ergibt größere Lose als EOQ,** wenn die Fertigung nicht schlagartig erfolgt. Im Beispiel unten wächst das Los von 949 auf 1.095 Stück, und die Jahreskosten sinken von 7.589 USD auf 6.573 USD.
- **Heuristiken liegen nah dran, nicht exakt.** In einem Beispiel über acht Wochen kostet Silver-Meal 13 % mehr als das Wagner-Whitin-Optimum, der Stückperiodenausgleich 25 % mehr. Lot-for-Lot kostet 72 % mehr.
- **Kostenkurven sind flach, die Kapazität ist es nicht.** 20 % Abweichung vom "optimalen" Los ändern die Kosten kaum. Dieselbe Änderung kann am Engpass Stunden an Rüstzeit hinzufügen oder einsparen.
- **Die Rüstzeit ist der eigentliche Hebel.** Sinkt die Rüstzeit, liefert jede Regel kleinere Lose, kürzere Durchlaufzeiten und weniger Bestand.

## Inhaltsverzeichnis

1. [Was die Losgrößenplanung entscheidet](#1-was-die-losgroessenplanung-entscheidet)
2. [Das Kostenmodell hinter jeder Regel](#2-das-kostenmodell-hinter-jeder-regel)
3. [Statische Losgrößen: EOQ, EPQ und Mengenrabatte](#3-statische-losgroessen-eoq-epq-und-mengenrabatte)
4. [Dynamische Losgrößenplanung: sieben Verfahren an einem Datensatz](#4-dynamische-losgroessenplanung-sieben-verfahren-an-einem-datensatz)
5. [Kapazität: wenn die Formel auf den Engpass trifft](#5-kapazitaet-wenn-die-formel-auf-den-engpass-trifft)
6. [Losgrößen in ERP und MRP](#6-losgroessen-in-erp-und-mrp)
7. [Die Lean-Sicht: kleinere Lose durch kürzere Rüstzeiten](#7-die-lean-sicht-kleinere-lose-durch-kuerzere-ruestzeiten)
8. [Vorlage: Entscheidungstabelle für die Losgröße](#8-vorlage-entscheidungstabelle-fuer-die-losgroesse)
9. [Häufige Fehler](#9-haeufige-fehler)
10. [FAQ: Losgröße](#10-faq-losgroesse)
11. [Fazit](#11-fazit)

## 1. Was die Losgrößenplanung entscheidet

Ein **Los** (oder eine Charge, englisch Lot oder Batch) ist die Menge, die nach einem Rüstvorgang gefertigt oder mit einer Bestellung beschafft wird. Die Losgrößenplanung beantwortet zwei verknüpfte Fragen: *wie viel* je Auftrag und damit *wie oft* bestellt oder gerüstet wird. Das ASCM Supply Chain Dictionary, inzwischen in der 20. Auflage, ist das Standardnachschlagewerk in den USA für die hier verwendeten englischen Begriffe (Lot-for-Lot, Period Order Quantity, Fixed Order Quantity) [13].

Die Losgrößenplanung unterscheidet sich von drei benachbarten Entscheidungen:

| Entscheidung | Frage | Behandelt in |
|---|---|---|
| Losgrößenplanung | Wie viele Einheiten je Auftrag oder Fertigungslauf? | diesem Artikel |
| Sicherheitsbestand | Wie viel Puffer gegen Schwankungen von Bedarf und Versorgung? | [Bestandsmanagement in der Produktion](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/) |
| Reihenfolgeplanung | In welcher Reihenfolge laufen die Lose auf einer Maschine? | [Produktionsplanung mit APS](https://www.m365.fm/learn/produktionsplanung-aps/) |
| Hauptproduktionsplanung | Wie viel wird pro Monat oder Woche überhaupt produziert? | [S&OP, MRP und Produktionsplanung](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) |

Die Losgröße wirkt direkt auf die anderen drei. Sie bestimmt den **Losgrößenbestand** (Cycle Stock, bei Kaufteilen im Mittel ein halbes Los), sie legt fest, wie viele Rüstvorgänge eine Maschine verkraften muss, und sie verändert die Durchlaufzeit jedes Auftrags, der hinter einem großen Los wartet.

## 2. Das Kostenmodell hinter jeder Regel

Jedes Losgrößenverfahren in diesem Artikel minimiert dieselben zwei Kostenbestandteile:

- **Rüst- oder Bestellkosten S** je Los: Lohn für den Rüstvorgang, Ausschuss bei der Erstteilprüfung, Bearbeitung der Bestellung, Wareneingang und Eingangsprüfung. Sie sind je Los fix, egal wie viele Einheiten das Los enthält.
- **Lagerhaltungskosten H** je Einheit und Periode: Kapitalkosten, Lagerung, Versicherung, Handling, Veralterung und Schwund. In der Praxis gilt H = Stückkosten × Lagerhaltungskostensatz.

Beide sind teilweise kalkulatorisch. Wird die Rüstmannschaft bezahlt, ob sie rüstet oder nicht, kostet ein Rüstvorgang an einem Nicht-Engpass kaum zusätzliches Geld; am Engpass kostet er verlorene Ausbringung. Stimmen Sie beide Werte mit dem Werkscontrolling ab und notieren Sie das Datum. Die Qualität bringt einen weiteren Gesichtspunkt: In regulierten Lieferketten (AS9100, IATF 16949) ist das Fertigungslos oft zugleich das Rückverfolgbarkeitslos, ein größeres Los erweitert also den Umfang jeder Sperrung oder jedes Rückrufs.

Große Lose verteilen S auf viele Einheiten, erhöhen aber den Durchschnittsbestand. Kleine Lose senken den Bestand, vervielfachen aber die Rüstvorgänge. Die Regeln unterscheiden sich nur in ihren Annahmen über den Bedarf:

| Familie | Bedarfsannahme | Typische Verfahren | Optimal? |
|---|---|---|---|
| Statisch, kontinuierlich | konstante Rate, unendlicher Horizont | EOQ (Andler), EPQ, EOQ mit Mengenrabatten | optimal unter ihren Annahmen |
| Statisch, periodisch | konstant, als Reichweite ausgedrückt | Periodenlosgröße (POQ), feste Periode | Näherung |
| Dynamisch, heuristisch | bekannt, zeitlich schwankend, endlicher Horizont | gleitende wirtschaftliche Losgröße (Least Unit Cost), Stückperiodenausgleich, Silver-Meal | Näherung |
| Dynamisch, exakt | bekannt, zeitlich schwankend, endlicher Horizont | Wagner-Whitin | optimal für einen Artikel ohne Kapazitätsgrenzen |
| Kapazitiert | mehrere Artikel teilen sich begrenzte Kapazität | kapazitierte Losgrößenmodelle, APS | im Allgemeinen NP-schwer |

Zwei Kosten fehlen in all diesen Modellen, und sie zählen oft mehr als S und H: **Kapazität, die am Engpass durch Rüsten verloren geht**, und **Durchlaufzeit, die große Lose hinzufügen**. Abschnitt 5 kommt auf beide zurück.

## 3. Statische Losgrößen: EOQ, EPQ und Mengenrabatte

### 3.1 EOQ in einem Absatz

Ford Whitman Harris veröffentlichte die Wurzelformel 1913 in *Factory, The Magazine of Management*; Donald Erlenkotters Aufsatz von 1990 in *Operations Research* zeichnete ihre Geschichte nach, nachdem sie jahrzehntelang ohne Quellenangabe zitiert worden war [1]. Im deutschsprachigen Raum ist sie als Andler-Formel bekannt. Die Formel lautet Q* = √(2DS ÷ H). Der Parent-Leitfaden rechnet sie mit einem Drehteil durch: D = 12.000 Stück pro Jahr, S = 300 USD je Rüstvorgang, H = 8 USD je Stück und Jahr, daraus Q* ≈ 949 Stück und Gesamtkosten von etwa 7.589 USD pro Jahr ([Abschnitt 9 des Pillars](https://www.m365.fm/learn/produktionsplanung-aps/)). Dieser Artikel nutzt dasselbe Teil, damit die Zahlen zusammenpassen.

EOQ setzt voraus, dass das ganze Los auf einmal ankommt. Das stimmt für eine Bestellung, die mit einem Lkw geliefert wird. Es stimmt nicht für einen Fertigungslauf, bei dem die Teile nach und nach von der Maschine kommen, während der Verbrauch in der Folgestufe weiterläuft.

### 3.2 EPQ: die wirtschaftliche Fertigungslosgröße

E. W. Taft, statistischer Ingenieur bei der Winchester Repeating Arms Company, veröffentlichte die Variante mit endlicher Produktionsgeschwindigkeit 1918 in *The Iron Age* [2]. Mit Produktionsrate P und Bedarfsrate D (gleiche Zeiteinheit, P > D) baut sich der Bestand während des Laufs nur mit der Rate P − D auf. Der Höchstbestand ist daher Q × (1 − D/P), nicht Q, und die Formel lautet:

> **Q*_EPQ = √(2 × D × S ÷ (H × (1 − D/P)))**
>
> D = Bedarf pro Jahr, P = Produktionsrate pro Jahr, S = Rüstkosten je Lauf, H = Lagerhaltungskosten je Stück und Jahr

**Rechenbeispiel.** Das Drehteil aus dem Pillar läuft mit 200 Stück pro Tag; die Montagelinie verbraucht 50 pro Tag. Bei 240 Arbeitstagen ergibt das P = 48.000 und D = 12.000 Stück pro Jahr, also D/P = 0,25.

| Schritt | Rechnung | Ergebnis |
|---|---|---|
| EPQ | √(2 × 12.000 × 300 ÷ (8 × 0,75)) = √1.200.000 | **1.095 Stück** |
| Höchstbestand | 1.095 × (1 − 0,25) | 822 Stück |
| Durchschnittsbestand | 822 ÷ 2 | 411 Stück |
| Lagerhaltungskosten pro Jahr | 411 × 8 USD | 3.286 USD |
| Rüstkosten pro Jahr | 12.000 ÷ 1.095 × 300 USD | 3.286 USD |
| Gesamtkosten pro Jahr | | **6.573 USD** |
| Laufdauer | 1.095 ÷ 200 pro Tag | 5,5 Tage |
| Zykluslänge | 1.095 ÷ 50 pro Tag | 21,9 Tage |

Das EPQ-Los ist etwa 15 % größer als das EOQ-Los (1.095 gegenüber 949), und seine Gesamtkosten sind etwa 13 % niedriger (6.573 USD gegenüber 7.589 USD), weil die einfache EOQ den Durchschnittsbestand eines Teils überschätzt, das schon während der Fertigung verbraucht wird.

Wie viel macht es aus, wenn ein Werk trotzdem EOQ nutzt? Fertigt man Lose von 949 Stück, bewertet sie aber mit dem korrekten Bestand bei endlicher Produktionsrate, liegen die Jahreskosten bei 6.640 USD (Lagerhaltung 2.847 USD, Rüsten 3.793 USD). Das sind nur 1 % über dem EPQ-Optimum. Die flache Kostenkurve aus dem Pillar gilt wieder: Die "falsche" Formel kostet wenig. Ein Los, das der Engpass nicht verkraftet, kostet viel, wie Abschnitt 5 zeigt.

Die Zykluslänge zählt für die Feinplanung. Die Maschine ist an 5,5 von 21,9 Tagen mit diesem Teil belegt. Teilen sich mehrere Teile die Maschine, passen ihre einzelnen EPQs womöglich nicht zusammen (das Economic Lot Scheduling Problem, das die Formel für einen Artikel ignoriert).

### 3.3 Mengenrabatte: wenn ein größeres Los die EOQ schlägt

Für Kaufteile nennen Lieferanten oft Preisstaffeln. Die EOQ-Formel allein kann sie nicht abbilden, weil der Stückpreis die Lagerhaltungskosten verändert und einen Kostenterm für den Einkaufspreis hinzufügt. Das Standardvorgehen: die EOQ für jeden Preis berechnen, sie auf die Staffelmenge anheben, falls sie darunter liegt, und die jährlichen Gesamtkosten einschließlich Einkaufspreis vergleichen [10].

**Rechenbeispiel.** Ein zugekaufter Halter: D = 6.000 Stück pro Jahr, S = 80 USD je Bestellung, Lagerhaltungskostensatz 25 % pro Jahr. Der Lieferant bietet 10,00 USD je Stück unter 1.000 Stück und 9,70 USD je Stück ab 1.000 Stück.

| Preis | EOQ bei diesem Preis | Zulässige Bestellmenge | Einkaufskosten | Bestellkosten | Lagerhaltungskosten | Summe |
|---|---|---|---|---|---|---|
| 10,00 USD | √(2 × 6.000 × 80 ÷ 2,50) ≈ 620 | 620 | 60.000 USD | 775 USD | 775 USD | **61.549 USD** |
| 9,70 USD | √(2 × 6.000 × 80 ÷ 2,425) ≈ 629 | 629 liegt unter der Staffel, also 1.000 | 58.200 USD | 480 USD | 1.213 USD | **59.893 USD** |

Der Rabatt gewinnt mit etwa 1.657 USD pro Jahr, obwohl die Bestellung 61 % größer ist als die EOQ. Bevor Sie zugreifen, prüfen Sie, was die Formel nicht sieht: Lagerfläche für die zusätzlichen 380 Stück, Haltbarkeit, das Risiko technischer Änderungen und das gebundene Kapital. Die Finanzsicht auf die Bestandsbewertung steht im Schwesterartikel zum [Bestandsmanagement in der Produktion](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/).

## 4. Dynamische Losgrößenplanung: sieben Verfahren an einem Datensatz

Das MRP liefert keine gleichmäßige Bedarfsrate. Es liefert **zeitlich gestaffelte Nettobedarfe**, die von Woche zu Woche springen. Statische Formeln versagen hier: Eine EOQ von 170 Stück, bestellt in eine Woche mit einem Bedarf von 20, erzeugt Restbestand. Dynamische Verfahren entscheiden, welche künftigen Perioden jedes Los abdeckt.

### 4.1 Der Datensatz

Ein Fertigteil, acht Wochen Nettobedarf aus dem MRP. Rüstkosten S = 200 USD je Los. Lagerhaltungskosten h = 1 USD je Stück und Woche, berechnet auf den Bestand am Ende jeder Woche. Einheiten, die in der Woche ihrer Fertigung verbraucht werden, verursachen keine Lagerhaltungskosten.

| Woche | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Summe |
|---|---|---|---|---|---|---|---|---|---|
| Nettobedarf | 80 | 40 | 150 | 150 | 80 | 40 | 20 | 20 | 580 |

Der Durchschnittsbedarf liegt bei 72,5 Stück pro Woche. Die EOQ auf diesen Durchschnitt beträgt √(2 × 72,5 × 200 ÷ 1) ≈ 170 Stück, etwa 2,3 Wochen Bedarf.

### 4.2 Die Verfahren

- **Exakte Losgröße (Lot-for-Lot, L4L):** genau den Nettobedarf jeder Woche bestellen. Keine Lagerhaltungskosten, maximale Rüstvorgänge.
- **Feste Losgröße (Fixed Order Quantity, FOQ):** immer dieselbe Menge bestellen, hier die EOQ von 170 (oder ein Vielfaches, wenn ein Los nicht reicht).
- **Periodenlosgröße (Period Order Quantity, POQ):** die EOQ in eine Reichweite umrechnen, hier round(170 ÷ 72,5) = 2 Wochen, und jeweils den Bedarf von zwei Wochen bestellen.
- **Gleitende wirtschaftliche Losgröße (Least Unit Cost, LUC):** das Los um jeweils eine Periode verlängern, solange die Kosten je *Stück* (Rüsten plus Lagerhaltung, geteilt durch die Losmenge) weiter sinken. SAP ERP bietet es als Verfahren der optimierenden Losgrößenbildung an [12].
- **Stückperiodenausgleich (Part Period Balancing, PPB):** das Los verlängern, bis die aufgelaufenen Lagerhaltungskosten den Rüstkosten am nächsten kommen (manche Systeme nutzen "überschreitet nicht" statt "am nächsten", was leicht andere Lose ergeben kann). In "Stückperioden" liegt die Schwelle bei S/h = 200 Stückwochen. Das Verfahren geht auf DeMatteis' Part-Period-Algorithmus zurück, 1968 im *IBM Systems Journal* veröffentlicht [5]; SAP beschreibt sein Verfahren als Zusammenfassen von Bedarfen, "bis die Summe der Lagerkosten den losgrößenunabhängigen Kosten entspricht" [11].
- **Silver-Meal (SM):** das Los verlängern, solange die Durchschnittskosten je abgedeckter *Periode* sinken; stoppen, wenn sie steigen [4].
- **Wagner-Whitin (WW):** dynamische Programmierung, die für einen Artikel mit bekanntem Bedarf und ohne Kapazitätsgrenze den kostenminimalen Plan findet [3]. Sie nutzt die Eigenschaft, dass ein optimaler Plan nur dann bestellt, wenn der Bestand auf null gelaufen ist.

### 4.3 Ergebnisse

Alle Pläne wurden per Skript nachgerechnet; Gesamtkosten = Rüstvorgänge × 200 USD + gelagerte Stückwochen × 1 USD.

| Verfahren | Planaufträge (Wochen 1 bis 8) | Rüstvorgänge | Rüstkosten | Lagerhaltungskosten | Gesamtkosten | ggü. Optimum |
|---|---|---|---|---|---|---|
| Lot-for-Lot | 80, 40, 150, 150, 80, 40, 20, 20 | 8 | 1.600 USD | 0 USD | 1.600 USD | +72 % |
| FOQ (170) | 170, 0, 170, 170, 0, 170, 0, 0 | 4 | 800 USD | 670 USD | 1.470 USD | +58 % |
| POQ (2 Wochen) | 120, 0, 300, 0, 120, 0, 40, 0 | 4 | 800 USD | 250 USD | 1.050 USD | +13 % |
| Gleitende wirtschaftliche Losgröße | 270, 0, 0, 230, 0, 80, 0, 0 | 3 | 600 USD | 480 USD | 1.080 USD | +16 % |
| Stückperiodenausgleich | 270, 0, 0, 290, 0, 0, 0, 20 | 3 | 600 USD | 560 USD | 1.160 USD | +25 % |
| Silver-Meal | 120, 0, 460, 0, 0, 0, 0, 0 | 2 | 400 USD | 650 USD | 1.050 USD | +13 % |
| **Wagner-Whitin** | **120, 0, 300, 0, 160, 0, 0, 0** | **3** | **600 USD** | **330 USD** | **930 USD** | **Optimum** |

### 4.4 Die Ergebnisse lesen

**Silver-Meal Schritt für Schritt.** Ab Woche 1 kostet die Abdeckung einer Woche 200 USD je Periode; die Abdeckung der Wochen 1 und 2 kostet (200 + 40) ÷ 2 = 120 USD je Periode; mit Woche 3 steigt der Wert auf (200 + 40 + 300) ÷ 3 = 180 USD. Das erste Los deckt also die Wochen 1 und 2 ab (120 Stück). Ab Woche 3 sinken die Durchschnittskosten je Periode bis zum Ende des Horizonts immer weiter (200 USD, 175 USD, 170 USD, 157,50 USD, 142 USD, 135 USD). Die Heuristik packt daher die Wochen 3 bis 8 in ein Los von 460 Stück und lagert 80 Stück Bedarf der Woche 5 zwei Wochen lang. Wagner-Whitin erkennt, dass ein dritter Rüstvorgang in Woche 5 billiger ist als diese Lagerhaltungskosten.

**Warum Heuristiken danebenliegen.** Jede Heuristik schaut vom aktuellen Los nach vorn und revidiert keine Entscheidung. Auch das Ende des Horizonts verzerrt sie: Der Durchschnitt bei Silver-Meal sinkt weiter, weil die kleinen Bedarfe der Wochen 7 und 8 wenig Lagerhaltungskosten hinzufügen. In einer rollierenden MRP-Planung werden diese Wochen ohnehin neu geplant.

**Warum Lot-for-Lot trotzdem seinen Platz hat.** L4L ist hier nur deshalb 72 % teurer, weil ein Rüstvorgang 200 USD kostet. Kostet ein Rüstvorgang 20 USD, liegt L4L nahe am Optimum und bringt die kürzesten Durchlaufzeiten und den geringsten Bestand. L4L ist außerdem die übliche Wahl für teure, kundenspezifische oder nur begrenzt haltbare Artikel und für die oberen Ebenen einer tiefen Stückliste, wo Losbildung auf jeder Ebene den Bestand aufschaukeln würde.

**Wie gut ist "gut genug"?** Der Wagner-Whitin-Algorithmus galt lange als zu aufwendig für den Routineeinsatz, was Heuristiken wie Silver-Meal hervorbrachte [9]. Spätere Arbeiten senkten den Aufwand auf O(n log n) und im Wagner-Whitin-Kostenfall auf lineare Zeit (Federgruen und Tzur 1991; Wagelmans, van Hoesel und Kolen 1992) [9]. Rechenzeit ist für einen einzelnen Artikel kein Grund mehr, auf ihn zu verzichten. Die eigentliche Grenze ist die Annahme unbegrenzter Kapazität, die er mit jedem Verfahren in der Tabelle teilt.

## 5. Kapazität: wenn die Formel auf den Engpass trifft

### 5.1 Rüststunden sind die versteckten Kosten

Angenommen, die Drehmaschine aus Abschnitt 3 ist der Engpass des Werks, und jeder Rüstvorgang dauert vier Stunden. Die Zahl der Rüstvorgänge pro Jahr folgt direkt aus der Losgröße:

| Losgröße | Rüstvorgänge pro Jahr (12.000 ÷ Los) | Rüststunden pro Jahr (× 4 h) |
|---|---|---|
| 600 | 20,0 | 80 |
| 949 (EOQ) | 12,6 | 51 |
| 1.095 (EPQ) | 11,0 | 44 |

Am Engpass ist jede dieser Stunden eine Stunde verlorene Ausbringung des Werks, nicht nur 300 USD Rüstkosten. Der Abschnitt des Pillars zur Theory of Constraints erklärt die Regel, die daraus folgt: Lose sind am Engpass eher größer und an Nicht-Engpässen kleiner, wo Leerlaufzeit zusätzliche Rüstvorgänge fast kostenlos aufnimmt. Mehr zur Engpasslogik im geplanten Pillar [Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/).

Ein verwandter Hebel ist die Trennung von **Transportlos** und **Fertigungslos** (Transfer Batch und Process Batch). Die Drehmaschine kann 1.095 Teile mit einem Rüstvorgang fertigen, sie aber in Behältern zu 100 an den nächsten Arbeitsgang weitergeben. Die Folgestufe beginnt nach dem ersten Behälter, nicht nach 5,5 Tagen.

### 5.2 Kapazitierte Losgrößenplanung

Teilen sich mehrere Artikel eine Maschine, beeinflussen sich die Losgrößen gegenseitig: Ein großes Los von Teil A verzögert Teil B, das dann ein größeres Los braucht, um die längere Wartezeit zu überbrücken. Das Operations Research nennt das das kapazitierte Losgrößenproblem (Capacitated Lot Sizing Problem). Florian, Lenstra und Rinnooy Kan zeigten 1980, dass Spezialfälle der kapazitätsbeschränkten Produktionsplanung NP-schwer sind [6]. Bitran und Yanasse zeigten 1982, dass schon das Problem mit zwei Artikeln und unabhängigen Rüstvorgängen NP-schwer ist, unter Bedingungen, unter denen das Einartikelproblem einfach ist [7]. Der Übersichtsartikel von Karimi, Fatemi Ghomi und Wilson von 2003 nennt die Losgrößenplanung "eines der wichtigsten und zugleich eines der schwierigsten Probleme der Produktionsplanung" [8].

In der Praxis heißt das:

- Eine Losgrößenregel im ERP entscheidet jeden Artikel für sich. Sie kann nicht erkennen, ob die entstehenden Lose auf die Maschine passen.
- Ein APS kann Losgröße und Reihenfolge gemeinsam bewerten, einschließlich reihenfolgeabhängiger Rüstzeiten. Der Pillar beschreibt, wie APS-Solver das handhaben ([Abschnitt 5](https://www.m365.fm/learn/produktionsplanung-aps/)).
- Für eine schnelle Prüfung ohne Software addieren Sie für jeden gemeinsam genutzten Arbeitsplatz Bearbeitungszeit plus Rüstzeit je Woche. Übersteigt die Belastung die verfügbaren Stunden, sind die Losgrößen nicht machbar, egal wie "wirtschaftlich" sie sind.

### 5.3 Losgröße und Durchlaufzeit

Hopp und Spearman beschreiben in *Factory Physics*, wie Losbildung Wartezeit hinzufügt: Ein Teil in einem Los der Größe Q wartet, bis die anderen Q − 1 Einheiten bearbeitet sind, bevor das Los weiterwandert, und große Lose erhöhen außerdem die Schwankung der Ankünfte an der nächsten Station [14]. Keiner der beiden Effekte taucht in S oder H auf. Ist Ihr Problem gegenüber dem Kunden die Durchlaufzeit und nicht die Kosten, beginnen Sie bei der benötigten Durchlaufzeit und dimensionieren die Lose passend dazu.

## 6. Losgrößen in ERP und MRP

In einem ERP-System ist die Losgröße ein Stammdatenfeld je Artikel und Werk, das nach der Nettobedarfsrechnung in jedem MRP-Lauf angewendet wird. Der Pillar [S&OP, MRP und Produktionsplanung](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) (geplant) behandelt die MRP-Logik selbst; hier steht, was für die Einstellung der Losgröße zählt.

**Losgrößenschlüssel.** SAP ERP nutzt zum Beispiel Schlüssel wie EX (exakte Losgröße, also Lot-for-Lot), FX (feste Losgröße), TB, WB und MB (Tages-, Wochen- und Monatslosgröße) [12] sowie optimierende Verfahren wie den Stückperiodenausgleich [11] und die gleitende wirtschaftliche Losgröße (Least Unit Cost) [12]. Andere ERP-Systeme bieten ähnliche Optionen unter anderen Namen.

**Rundungs- und Begrenzungsparameter.** Die meisten Systeme wenden nach der Regel Parameter an: Mindestlosgröße, Höchstlosgröße, Rundungswert (zum Beispiel ein voller Behälter oder eine Palette) und Ausschusszuschlag. Diese Parameter bestimmen das Ergebnis oft stärker als die Regel. Ein Rundungswert von 500 macht aus jedem "optimalen" Los von 170 ein Los von 500.

**Planungsnervosität.** Dynamische Verfahren berechnen die Lose in jedem Lauf neu. Eine kleine Bedarfsänderung in Woche 6 kann ein Los von Woche 3 nach Woche 5 verschieben und Umterminierungsmeldungen durch die ganze Stückliste auslösen. Übliche Gegenmaßnahmen sind eine feste Planungszeitgrenze (Fixierungshorizont), Lot-for-Lot oder feste Lose innerhalb der eingefrorenen Zone und dynamische Verfahren erst dahinter.

**Mehrstufiger Effekt.** Losbildung auf jeder Ebene einer tiefen Stückliste vervielfacht Bestand und Durchlaufzeit, weil jede Ebene den bereits zu Losen gebündelten Bedarf der Ebene darüber erneut bündelt. Viele Werke nutzen auf Zwischenebenen Lot-for-Lot und bilden Lose nur dort, wo Rüsten teuer ist.

**Zusammenspiel mit dem Sicherheitsbestand.** Die Losgröße deckt den vorhersehbaren Bedarf ab, der Sicherheitsbestand den nicht vorhersehbaren Teil. Lose "zur Sicherheit" zu vergrößern, puffert doppelt. Die Dimensionierung des Sicherheitsbestands behandelt der Schwesterartikel zum [Bestandsmanagement in der Produktion](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/).

## 7. Die Lean-Sicht: kleinere Lose durch kürzere Rüstzeiten

Lean Management behandelt große Lose als Symptom: Es gibt sie, weil Rüstvorgänge lange dauern. Das Ziel ist nicht, das optimale Los zu berechnen, sondern die Eingangsgrößen so zu verändern, dass das optimale Los klein wird. Der Pillar zeigt, dass halbierte Rüstkosten die EOQ von 949 auf 671 Stück und die Gesamtkosten um etwa 29 % senken [Pillar, Abschnitt 9.3].

Eine praktische Planungsgröße ist der **EPEI** ("Every Part Every Interval"): wie oft eine Maschine alle ihre Teilenummern einmal durchlaufen kann. Er wird aus der Zeit berechnet, die für Rüstvorgänge übrig bleibt.

**Rechenbeispiel.** Eine Presse fertigt sechs Teilenummern. Sie läuft in zwei Schichten zu 450 Minuten an fünf Tagen pro Woche, hat also 4.500 Minuten pro Woche. Der Kundenbedarf braucht 3.600 Minuten Bearbeitungszeit. Für Rüstvorgänge bleiben 900 Minuten.

| | Vor SMED | Nach SMED |
|---|---|---|
| Rüstzeit je Teil | 60 min | 20 min |
| Zeit für einen vollen Zyklus mit sechs Rüstvorgängen | 360 min | 120 min |
| Mögliche Zyklen pro Woche (900 ÷ Zyklus) | 2,5 | 7,5 |
| EPEI (5 Tage ÷ Zyklen) | 2 Tage | etwa 0,7 Tage |
| Losgröße je Teil | 2 Tage Bedarf | weniger als 1 Tag Bedarf |

Nach der Rüstzeitreduzierung kann die Presse jedes Teil jeden Tag fertigen und hat noch Luft. Das ist die Voraussetzung für ein stabiles [Kanban-System nach dem Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/) mit kleinen Behältern. Die Methode behandelt der geplante Pillar zu [SMED und Rüstzeitreduzierung](https://www.m365.fm/learn/smed-ruestzeitreduzierung/). Werke, die zuerst ihren Fluss aufnehmen, finden die Maschinen mit langen Rüstzeiten meist schnell; siehe [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/).

Mehr Rüstvorgänge bedeuten auch mehr Arbeit für Werker und Einrichter. SMED-Projekte funktionieren, wenn die Menschen, die rüsten, den neuen Standard gestalten und wenn die eingesparte Zeit nicht einfach mit mehr Rüstvorgängen gefüllt wird, ohne die Personalplanung anzupassen. Alle 900 Minuten für Rüstvorgänge zu nutzen, geht nur auf dem Papier. In der Praxis behalten Sie einen Teil der Zeit als Puffer für Störungen und Qualitätsprobleme, sonst hält der EPEI nicht.

## 8. Vorlage: Entscheidungstabelle für die Losgröße

Eine Zeile je Artikelklasse. Füllen Sie sie mit den Disponenten, dem Feinplaner des Engpasses und dem Controlling aus.

| Artikelklasse | Bedarfsverlauf | Rüst- oder Bestellkosten | Engpass betroffen? | Empfohlene Regel | Parameter | Überprüfungszyklus |
|---|---|---|---|---|---|---|
| Zugekaufte C-Teile, gleichmäßiger Bedarf | gleichmäßig | gering je Bestellung, aber viele Bestellungen | nein | FOQ aus EOQ, auf Packungsgröße gerundet, oder Kanban | Packungsgröße, Mindestbestellmenge | jährlich |
| Zugekaufte A-Teile mit Preisstaffeln | gleichmäßig | mittel | nein | EOQ mit Prüfung der Mengenrabatte | Staffelmengen | bei jeder Preisänderung |
| Eigenfertigungsteile auf einer eigenen Linie | gleichmäßig | mittel | nein | EPQ, auf Behälter gerundet | Behältermenge | zweimal im Jahr |
| Eigenfertigungsteile auf einem gemeinsam genutzten Engpass | schwankend (MRP) | hoch in Kapazität gerechnet | ja | fester Zyklus (EPEI) oder im APS optimierte Lose | Mindestlos aus der Rüstzeit | monatlich mit Kapazitätsprüfung |
| Eigenfertigungsteile, Nicht-Engpass | schwankend (MRP) | gering bis mittel | nein | Lot-for-Lot oder POQ (1 bis 2 Wochen) | Höchstlos | quartalsweise |
| Kundenspezifische oder begrenzt haltbare Artikel | schwankend | beliebig | beliebig | Lot-for-Lot | Haltbarkeitsgrenze | je Auftrag |
| Zwischenebenen der Stückliste | abhängig | gering | nein | Lot-for-Lot | keine | jährlich |

Und eine kurze Checkliste, bevor Sie eine Regel im ERP ändern:

| Prüfpunkt | Ja / Nein |
|---|---|
| Rüstkosten und Lagerhaltungskostensatz mit dem Controlling abgestimmt, mit Datum der letzten Aktualisierung | |
| Rüstzeit je Arbeitsplatz bekannt (gemessen, nicht der Vorgabewert aus dem Arbeitsplan) | |
| Engpassarbeitsplätze ermittelt und Losgrößen gegen ihre Wochenkapazität geprüft | |
| Rundungs- und Begrenzungsparameter (Mindestbestellmenge, Rundung, Höchstlos) überprüft, weil sie die Regel übersteuern | |
| Planungszeitgrenze festgelegt, um Nervosität zu begrenzen | |
| Wirkung auf Sicherheitsbestand und Durchlaufzeit geprüft | |

## 9. Häufige Fehler

1. **EOQ für schwankenden MRP-Bedarf nutzen.** Die feste Losgröße erzeugt in Wochen mit geringem Bedarf Restbestände. Im Datensatz kostet FOQ 58 % mehr als das Optimum.
2. **Den Lagerhaltungskostensatz als Konstante behandeln, für die niemand zuständig ist.** Ein vor Jahren festgelegter Satz steuert jedes Los im System. Stimmen Sie ihn mit der Finanzabteilung ab und überprüfen Sie ihn, wenn sich Zinsen oder Lagerkosten ändern.
3. **Rüststunden am Engpass ignorieren.** Die Kostenformel bewertet einen Rüstvorgang mit 300 USD. Das Werk verliert vier Stunden Ausbringung. Prüfen Sie die Engpassbelastung, bevor Sie dort Lose verkleinern.
4. **Rundungs- und Begrenzungsparameter unbemerkt die Logik übersteuern lassen.** Ein Rundungswert auf Palette oder eine Mindestbestellmenge des Lieferanten kann jede Regel in ein festes Los verwandeln.
5. **Losbildung auf jeder Stücklistenebene.** Jede Ebene bündelt die Lose der Ebene darüber erneut; Bestand und Durchlaufzeit vervielfachen sich.
6. **Den Rabatt ohne die vollen Kosten kaufen.** Die Rechnung mit Mengenrabatt lässt Lagerfläche, Veralterungsrisiko und technische Änderungen weg. Ergänzen Sie sie, bevor Sie unterschreiben.
7. **Lose optimieren statt Rüstvorgänge.** Eine bessere Formel verschiebt die Kosten um wenige Prozent. Halbierte Rüstzeit verschiebt sie um etwa 29 %.

## 10. FAQ: Losgröße

### Was ist Losgrößenplanung im MRP?

Losgrößenplanung im MRP ist der Schritt, der zeitlich gestaffelte Nettobedarfe in Planaufträge umwandelt. Nachdem der MRP-Lauf die Bruttobedarfe mit Bestand und offenen Aufträgen verrechnet hat, entscheiden die Losgrößenregel des Artikels (zum Beispiel Lot-for-Lot, feste Losgröße oder Periodenlosgröße) und seine Rundungs- und Begrenzungsparameter über Menge und Termin jedes Planauftrags.

### Was ist der Unterschied zwischen Losgrößenplanung und EOQ (Andler-Formel)?

Die Losgrößenplanung ist die Entscheidung selbst: wie viele Einheiten je Auftrag gefertigt oder beschafft werden. Die EOQ ist eine Regel für diese Entscheidung und setzt gleichmäßigen Bedarf und ein Los voraus, das auf einmal ankommt. MRP-Artikel mit wöchentlich wechselndem Bedarf brauchen dynamische Verfahren wie die Periodenlosgröße, Silver-Meal oder Wagner-Whitin, und Fertigung mit endlicher Rate braucht die EPQ.

### Was ist der Unterschied zwischen EOQ und EPQ?

Die EOQ setzt voraus, dass das ganze Los auf einmal ankommt, wie bei einer Bestellung. Die EPQ geht davon aus, dass das Los mit endlicher Rate gefertigt wird, während der Verbrauch weiterläuft, sodass der Höchstbestand nur Q × (1 − D/P) beträgt. Die EPQ ergibt daher größere Lose: im Beispiel 1.095 statt 949 Stück bei gleichen Rüst- und Lagerhaltungskosten.

### Was ist der Unterschied zwischen exakter und fester Losgröße?

Die exakte Losgröße (Lot-for-Lot) bestellt genau den Nettobedarf jeder Periode, hält also keinen Losgrößenbestand, braucht aber in jeder Periode mit Bedarf einen Rüstvorgang. Die feste Losgröße bestellt immer dieselbe Menge, oft abgeleitet aus der EOQ, einer Packungsgröße oder einer Mindestmenge des Lieferanten, und trägt Reste in spätere Perioden.

### Wann sollte man Lot-for-Lot nutzen?

Wenn Rüstvorgänge oder Bestellungen billig sind, wenn Artikel teuer, kundenspezifisch oder nur begrenzt haltbar sind, und auf Zwischenebenen einer tiefen Stückliste. Lot-for-Lot bringt den geringsten Bestand und die kürzeste Durchlaufzeit. Vermeiden Sie es an Engpassmaschinen mit langen Rüstzeiten.

### Ist die feste Losgröße dasselbe wie die EOQ?

Nicht unbedingt. Die EOQ ist ein Weg, eine feste Losgröße festzulegen; Behältergrößen, Paletten, Mindestmengen der Lieferanten und Maschinengrenzen sind andere. Einmal im MRP hinterlegt, verhält sich eine EOQ wie jede andere feste Losgröße.

### Was ist der Wagner-Whitin-Algorithmus?

Der Wagner-Whitin-Algorithmus, 1958 von Harvey Wagner und Thomson Whitin in *Management Science* veröffentlicht, findet die kostenminimalen Losgrößen für einen Artikel mit bekanntem, zeitlich schwankendem Bedarf über einen endlichen Horizont und ohne Kapazitätsgrenze. Er nutzt dynamische Programmierung und die Eigenschaft, dass ein optimaler Plan nur bestellt, wenn der Bestand null erreicht.

### Was ist das Silver-Meal-Verfahren?

Das Silver-Meal-Verfahren, 1973 von Edward Silver und Harlan Meal veröffentlicht, verlängert jedes Los um jeweils eine Periode, solange die durchschnittlichen Rüst- plus Lagerhaltungskosten je abgedeckter Periode weiter sinken. Es ist einfach und meist nah am Optimum; im Beispiel kostet es 13 % mehr als Wagner-Whitin.

### Welches Losgrößenverfahren ist das beste?

Für einen Artikel mit bekanntem Bedarf und ohne Kapazitätsgrenze liefert Wagner-Whitin die niedrigsten Kosten. In der Praxis wählen Sie nach Kontext: EOQ oder EPQ für gleichmäßigen Bedarf, POQ oder Silver-Meal für schwankenden MRP-Bedarf, Lot-for-Lot bei billigem Rüsten und kapazitätsbewusste Planung (ein APS), wo mehrere Artikel um einen Engpass konkurrieren.

### Wie wirkt die Losgröße auf OEE und Rüstvorgänge?

Kleinere Lose bedeuten mehr Rüstvorgänge. Sind die Rüstzeiten lang, sinken Verfügbarkeit und damit OEE; deshalb gehören Losgrößenreduzierung und Rüstzeitreduzierung (SMED) zusammen. Am Engpass kosten zusätzliche Rüstvorgänge Ausbringung.

## 11. Fazit

Die Losgrößenplanung sieht aus wie ein Formelproblem und entpuppt sich als Kapazitäts- und Rüstproblem. Die Formeln lohnen sich trotzdem: EOQ und EPQ für gleichmäßigen Bedarf, eine Rabattprüfung für Kaufteile und ein dynamisches Verfahren für schwankende MRP-Bedarfe. Im Beispiel über acht Wochen lag der Unterschied zwischen der schlechtesten und der besten Regel bei 72 %. Zwischen den guten Heuristiken und dem Optimum lag er bei 13 bis 25 %.

Die größeren Gewinne liegen außerhalb der Formel. Prüfen Sie jede Losgröße gegen die Engpasskapazität, behalten Sie Lot-for-Lot, wo Rüsten billig ist, kontrollieren Sie Rundungs- und Begrenzungsparameter und arbeiten Sie an der Rüstzeit. Sinkt die Rüstzeit, liefert jede Regel kleinere Lose, und das Werk bekommt kürzere Durchlaufzeiten ohne zusätzlichen Planungsaufwand. Wo mehrere Artikel um dieselbe Maschine konkurrieren, ist ein APS, das Lose und Reihenfolge gemeinsam plant, der logische nächste Schritt; der Parent-Leitfaden erklärt, wie.

## Weiterlesen auf m365.fm

**Parent-Leitfaden**

- [Produktionsplanung mit APS: der vollständige Leitfaden](https://www.m365.fm/learn/produktionsplanung-aps/)

**Schwester-Cluster (geplant)**

- [Bestandsmanagement in der Produktion: Sicherheitsbestand, ABC/XYZ und Bestandsbewertung](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/) (geplant)
- [Intralogistik: innerbetrieblicher Materialfluss, Milkrun und AMR](https://www.m365.fm/learn/produktionsplanung-aps/intralogistik/) (geplant)

**Verwandte Pillars (geplant)**

- [S&OP, MRP und Produktionsplanung](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) (geplant)
- [SMED und Rüstzeitreduzierung](https://www.m365.fm/learn/smed-ruestzeitreduzierung/) (geplant)
- [Kanban und Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/) (geplant)
- [Theory of Constraints und Engpasstheorie](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant)
- [Lean Management](https://www.m365.fm/learn/lean-management/)
- [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)

**Begriffsseiten**

[Losgröße](https://www.m365.fm/entity/batch-size/) · [Rüstzeit](https://www.m365.fm/entity/setup-time/) · [Sicherheitsbestand](https://www.m365.fm/entity/safety-stock/) · [Durchlaufzeit](https://www.m365.fm/entity/lead-time/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Kanban](https://www.m365.fm/entity/kanban/)

---

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Produktionsplanung und Feinplanung, Lean Management und die digitale Transformation der Fertigung.

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

*[Redaktion: Rolle, Werdegang und Profilfoto des Autors ergänzen.]*

---

# Quellen

Alle Online-Quellen abgerufen am 20. November 2026.

1. Harris, Ford W.: How Many Parts to Make at Once. Factory, The Magazine of Management 10 (1913) 2 (Februar 1913), S. 135–136; und Erlenkotter, Donald: Ford Whitman Harris and the Economic Order Quantity Model. Operations Research 38 (1990) 6, S. 937–946. DOI: 10.1287/opre.38.6.937. Eintrag: https://ideas.repec.org/a/inm/oropre/v38y1990i6p937-946.html (Seitenzahlen des Harris-Originals wie im Parent-Pillar; Band/Heft bestätigt über https://en.wikipedia.org/wiki/Ford_Whitman_Harris)
2. Taft, E. W.: The most economical production lot. The Iron Age 101 (1918) 18, S. 1410–1412. Zitiert über https://en.wikipedia.org/wiki/Economic_production_quantity [Original nicht eingesehen].
3. Wagner, Harvey M.; Whitin, Thomson M.: Dynamic Version of the Economic Lot Size Model. Management Science 5 (1958) 1, S. 89–96. DOI: 10.1287/mnsc.5.1.89. Eintrag: https://econpapers.repec.org/RePEc:inm:ormnsc:v:5:y:1958:i:1:p:89-96
4. Silver, Edward A.; Meal, Harlan C.: A Heuristic for Selecting Lot Size Quantities for the Case of a Deterministic Time-Varying Demand Rate and Discrete Opportunities for Replenishment. Production and Inventory Management (1973), S. 64–74. Eintrag: https://cir.nii.ac.jp/crid/1570291226041264256 [Band/Heft nicht bestätigt]
5. DeMatteis, J. J.: An economic lot-sizing technique, I: The part-period algorithm. IBM Systems Journal 7 (1968) 1, S. 30–38. DOI: 10.1147/sj.71.0030 (bibliografische Angaben über Crossref bestätigt, 20. November 2026).
6. Florian, M.; Lenstra, J. K.; Rinnooy Kan, A. H. G.: Deterministic Production Planning: Algorithms and Complexity. Management Science 26 (1980) 7, S. 669–679. DOI: 10.1287/mnsc.26.7.669. Eintrag: https://ideas.repec.org/a/inm/ormnsc/v26y1980i7p669-679.html
7. Bitran, Gabriel R.; Yanasse, Horacio H.: Computational Complexity of the Capacitated Lot Size Problem. Management Science 28 (1982) 10, S. 1174–1186. DOI: 10.1287/mnsc.28.10.1174. Eintrag: https://ideas.repec.org/a/inm/ormnsc/v28y1982i10p1174-1186.html
8. Karimi, B.; Fatemi Ghomi, S. M. T.; Wilson, J. M.: The capacitated lot sizing problem: a review of models and algorithms. Omega 31 (2003) 5, S. 365–378. PII S0305-0483(03)00059-8. Eintrag: https://ideas.repec.org/a/eee/jomega/v31y2003i5p365-378.html
9. Federgruen, Awi; Tzur, Michal: A simple forward algorithm to solve general dynamic lot sizing models with n periods in O(n log n) or O(n) time. Management Science 37 (1991) 8, S. 909–925, DOI: 10.1287/mnsc.37.8.909; Wagelmans, Albert; van Hoesel, Stan; Kolen, Antoon: Economic lot sizing: an O(n log n) algorithm that runs in linear time in the Wagner-Whitin case. Operations Research 40 (1992) Supplement 1, S. S145–S156, DOI: 10.1287/opre.40.1.S145. Beide zitiert über https://en.wikipedia.org/wiki/Dynamic_lot-size_model; bibliografische Angaben beider über Crossref bestätigt, 20. November 2026 (Volltexte nicht geöffnet)
10. Silver, Edward A.; Pyke, David F.; Thomas, Douglas J.: Inventory and Production Management in Supply Chains. 4. Aufl., CRC Press, Boca Raton 2017, ISBN 978-1-4665-5861-8.
11. SAP Help Portal: Part Period Balancing (Dokumentation SAP R/3 4.6C). https://help.sap.com/SAPHelp_46c/helpdata/EN/f4/7d288744af11d182b40000e829fbfe/content.htm
12. SAP Help Portal: lot-sizing procedures supported in SAP AFS (EX, FX, TB, WB, MB und weitere). https://help.sap.com/saphelp_afs60/helpdata/en/23/9671f6d32f11d2aca80000e829fbfe/content.htm ; SAP Community Blog: Optimum lot size "WI" – least unit cost procedure. https://blogs.sap.com/t5/enterprise-resource-planning-blogs-by-sap/optimum-lot-size-quot-wi-quot-least-unit-cost-procedure/ba-p/13141473
13. ASCM (Association for Supply Chain Management): ASCM Supply Chain Dictionary, 20th Edition. https://learn.ascm.org/s/ascm-dictionary
14. Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3. Aufl., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1.

---

# Prüfhinweise für die Redaktion

Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.

## URL- und Strukturannahmen

- Cluster-URL `https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/` folgt dem verschachtelten Schema des Briefs; mit dem CMS bestätigen.
- Die EN-Fassung verlinkt Sprungmarken im Parent-Pillar (Abschnitt 9 EOQ, Abschnitt 5 APS). Die Anker des deutschen Pillars sind nicht bekannt; die Links zeigen vorerst auf die Pillar-URL ohne Anker. Nach Prüfung des deutschen Pillars Anker ergänzen. Ebenso den Verweis "[Pillar, Abschnitt 9.3]" prüfen.
- Inhaltsverzeichnis-Anker als ASCII-Anker (ae/oe/ue); nach dem CMS-Import testen.

## [Unbelegt]-Stellen und Prüfpunkte

1. Silver und Meal 1973 [4]: Band und Heft nicht bestätigt.
2. Taft 1918 [2] sowie Federgruen/Tzur und Wagelmans u. a. [9] über Wikipedia zitiert; Originale nicht eingesehen.
3. Seitenzahlen Harris 1913 aus dem Parent-Pillar übernommen.
4. Hopp/Spearman [14]: sinngemäße Wiedergabe ohne Seitenzahl.
5. Alle Rechenbeispiele sind konstruierte Beispielzahlen, keine Werksdaten. USD bewusst beibehalten.
6. **Bezeichnung "Andler-Formel":** im deutschen Text als im deutschsprachigen Raum gebräuchlicher Name der EOQ ergänzt (Hauptkeyword laut Brief). Keine neue Quelle; Fachprüfung soll bestätigen, dass die Zuordnung so stehen bleiben kann (ggf. Quelle zu Kurt Andler ergänzen).
7. **Deutsche Verfahrensnamen:** "gleitende wirtschaftliche Losgröße" (LUC) und "Stückperiodenausgleich" (PPB) entsprechen der üblichen deutschen SAP-Terminologie; mit dem deutschen SAP-Hilfeportal abgleichen. Das SAP-Zitat zum Stückperiodenausgleich ist eine eigene Übersetzung der englischen Dokumentation [11].
8. Zitat Karimi u. a. [8] sinngemäß übersetzt.

## Herstellerangaben

- Keine. SAP wird nur als Beispiel für Losgrößenschlüssel aus der SAP-Dokumentation genannt [11][12]; keine Leistungsaussagen.

## iFAKT

- Im Text nicht erwähnt (kein echter Bezug). Offenlegung in der Autorenbox exakt wie vorgegeben.

## Für den deutschen Markt prüfen

- Keine US-Rechtsstellen im Artikel. Prüfen, ob für deutsche Leser die SAP-Schlüssel um die deutschen Bezeichnungen der Losgrößenverfahren (z. B. SP, WI, DY, GR) ergänzt werden sollen; nur nach Abgleich mit der SAP-Dokumentation.

## Interne Links

- Parent-Pillar: erste 150 Wörter, Abschnitte 3.1, 5.2, Fazit und Weiterlesen.
- Schwester-Cluster: bestandsmanagement (Abschnitte 1, 3.3, 6), intralogistik (Weiterlesen).
- Neue Pillars: sop-mrp-produktionsplanung (Abschnitte 1, 6), smed-ruestzeitreduzierung, kanban-pull-prinzip (Abschnitt 7), theory-of-constraints-engpass (Abschnitt 5.1); bestehender Pillar wertstromanalyse (Abschnitt 7). Alle deutschen Ziel-URLs vor dem Go-live prüfen.

## Empfohlene Grafiken

- EPQ-Sägezahndiagramm (Bestand steigt während des Laufs mit P − D, fällt danach mit D) mit markiertem Höchstbestand 822.
- Balkendiagramm: Gesamtkosten je Verfahren aus Abschnitt 4.3 (sieben Balken, Optimum hervorgehoben).
- EPEI vor und nach SMED als Wochenzeitbalken (Bearbeitungszeit, Rüstzeit, Puffer).

## JSON-LD-Vorschlag

Article, FAQPage und BreadcrumbList wie in der englischen Fassung, mit `"inLanguage": "de-DE"`, `@id` und `mainEntityOfPage` https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/, `isPartOf` https://www.m365.fm/learn/produktionsplanung-aps/#article, `headline` wie H1, `description` wie Meta-Description, deutsche Keywords. FAQPage: alle 10 FAQ-Fragen auf Deutsch auszeichnen; der Markup-Text muss den sichtbaren Antworten entsprechen. Breadcrumb Learn > Produktionsplanung mit APS > Losgröße.

## hreflang

`de-DE` https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/ <-> `en-US` https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/
