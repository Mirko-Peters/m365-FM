# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Intralogistik: Materialfluss, Milkrun und Supermarkt (52 Zeichen) |
| Meta-Description | Intralogistik mit Rechenbeispielen: Von-Nach-Matrix, Materialbereitstellung, Milkrun berechnen, Supermarkt, AMR-Flottengröße und Sicherheitsnormen. (147 Zeichen) |
| Slug | `/learn/produktionsplanung-aps/intralogistik/` (vollständige URL: https://www.m365.fm/learn/produktionsplanung-aps/intralogistik/) |
| Parent-Pillar | [Produktionsplanung mit APS](https://www.m365.fm/learn/produktionsplanung-aps/) |
| Hauptkeyword | Intralogistik |
| Nebenkeywords | Materialfluss, innerbetrieblicher Materialfluss, innerbetriebliche Logistik, Produktionslogistik, Milkrun, Milkrun berechnen, Routenzug, Schleppzug, Materialbereitstellung, Linienversorgung, Kommissionierung, Kitting, Sequenzierung, Just-in-Sequence, Supermarkt Lean, Wasserspinne, Mizusumashi, Von-Nach-Matrix, Transportmatrix, FTS, fahrerloses Transportsystem, AGV vs. AMR, AMR Flottengröße, staplerfreie Fertigung, VDA 5050 |
| Suchintention | Informational. "Intralogistik" ist im deutschsprachigen Raum der etablierte Begriff; Leser suchen außerdem "Materialfluss", "Milkrun" und "Routenzug". |
| Wortzahl | 4.349 Wörter (`wc -w` von H1 bis Fazit, inkl. FAQ, ohne Weiterlesen); englische Fassung: 4.443 Wörter (98 %) |
| Sprachversion | `de-DE`; hreflang-Paar: `de-DE` https://www.m365.fm/learn/produktionsplanung-aps/intralogistik/ <-> `en-US` https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus.

# Intralogistik in der Produktion: innerbetrieblicher Materialfluss, Milkrun und AMR-Planung

*Stand: 20. November 2026 · Teil des Leitfadens [Produktionsplanung mit APS](https://www.m365.fm/learn/produktionsplanung-aps/)*

> **Kurzantwort:** Intralogistik ist die Planung und Steuerung des Materialflusses innerhalb eines Werks: Wareneingang, Lagerung, Supermärkte, Materialbereitstellung an der Linie, WIP-Transport zwischen Arbeitsgängen und Versand. In den USA spricht man meist von In-Plant Logistics oder Material Handling. Gute Intralogistik liefert die richtigen Teile in kleinen, regelmäßigen Mengen an die Linie, typischerweise mit einem Milkrun in festem Takt, und hält Stapler, Routenzüge und mobile Roboter im Umfeld von Menschen sicher.

Ein Plan ist nur so gut wie das Material, das rechtzeitig am Arbeitsplatz ankommt. Der Parent-Leitfaden zur [Produktionsplanung mit APS](https://www.m365.fm/learn/produktionsplanung-aps/) zeigt, wie man gegen begrenzte Kapazität plant. Dieser Artikel behandelt die physische Seite dieses Plans: wie Teile vom Tor an die Linie kommen, wie man einen Milkrun mit echten Zahlen auslegt, wie man eine Flotte autonomer mobiler Roboter dimensioniert und welche US-Sicherheitsregeln gelten. Er hängt mit den Schwesterartikeln zur [Losgröße](https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/) und zum [Bestandsmanagement in der Produktion](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/) zusammen, weil Transportmengen und Bestand an der Linie aus beiden folgen.

### Das Wichtigste in Kürze

- **Erst den Fluss messen, dann Technik kaufen.** Eine Von-Nach-Matrix mit Ladungen × Entfernung zeigt, wo der Transportaufwand entsteht. Im Beispiel senkt eine einzige Verlagerung die Transportleistung um 16 %.
- **Die Materialbereitstellung kennt vier Grundformen.** Linienbestückung, Kanban aus dem Supermarkt, Kitting und Sequenzierung unterscheiden sich in Fläche an der Linie, Handlingaufwand und Fehlerquote.
- **Ein Milkrun ist ein fester Fahrplan.** Berechnen Sie den Umlauf aus Fahrt, Stopps und Handling; halten Sie eine Reserve zum Takt. Im Beispiel senkt schnelleres Behälterhandling den Umlauf von 92 % auf 79 % eines 30-Minuten-Takts.
- **Die Flottengröße ist zuerst Arithmetik.** Fahrten pro Stunde × Minuten je Fahrt ÷ (60 × Verfügbarkeit). Das Beispiel braucht 7 AMR, nicht 6.
- **Sicherheit ist eine Eingangsgröße der Planung.** In den USA verlangt OSHA 1910.178 für Flurförderzeuge eine Schulung der Fahrer und eine Bewertung mindestens alle drei Jahre; industrielle mobile Roboter haben eine eigene Norm, ANSI/RIA R15.08.

## Inhaltsverzeichnis

1. [Was Intralogistik umfasst](#1-was-intralogistik-umfasst)
2. [Den Fluss messen: Von-Nach-Matrix und Transportleistung](#2-den-fluss-messen-von-nach-matrix-und-transportleistung)
3. [Formen der Materialbereitstellung](#3-formen-der-materialbereitstellung)
4. [Milkrun auslegen mit Rechenbeispiel](#4-milkrun-auslegen-mit-rechenbeispiel)
5. [Supermärkte und Kanban-Mengen an der Linie](#5-supermaerkte-und-kanban-mengen-an-der-linie)
6. [Technik: Stapler, Routenzüge, Förderer, FTS und AMR](#6-technik-stapler-routenzuege-foerderer-fts-und-amr)
7. [Flottengröße für AMR und FTS](#7-flottengroesse-fuer-amr-und-fts)
8. [Sicherheit und die Menschen, die Material bewegen](#8-sicherheit-und-die-menschen-die-material-bewegen)
9. [IT- und OT-Integration](#9-it-und-ot-integration)
10. [Kennzahlen der innerbetrieblichen Logistik](#10-kennzahlen-der-innerbetrieblichen-logistik)
11. [Vorlage: Arbeitsblatt zur Milkrun-Auslegung](#11-vorlage-arbeitsblatt-zur-milkrun-auslegung)
12. [Häufige Fehler](#12-haeufige-fehler)
13. [FAQ: Intralogistik und Milkrun](#13-faq-intralogistik-und-milkrun)
14. [Fazit](#14-fazit)

## 1. Was Intralogistik umfasst

"Intralogistik" ist in Europa, besonders in Deutschland, der gängige Begriff für alle Logistik *innerhalb* eines Standorts. US-Werke sprechen meist von In-Plant Logistics, Internal Logistics oder Material Handling; der US-Branchenverband MHI beschreibt sich als "ein führender Branchenverband für Material Handling, Logistik und Supply Chain" [5]. Der Umfang ist derselbe:

| Prozessschritt | Typische Tätigkeiten | Typische Technik |
|---|---|---|
| Wareneingang | entladen, prüfen, etikettieren, einlagern | Stapler, Überladebrücken, Scanner |
| Lagerung | Rohstoffe und Kaufteile in Regalen oder automatischen Lagern | Palettenregale, automatische Lager (AS/RS), Fachbodenregale |
| Supermarkt | Kleinladungsträger-Bestand nahe der Linie, von Routenfahrern kommissioniert | Durchlaufregale, Wagen |
| Materialbereitstellung | Lieferung der Teile an den Verbauort | Routenzüge, Wagen, AMR, Förderer |
| WIP-Transport | Bewegungen zwischen Arbeitsgängen oder Zellen | Wagen, Förderer, FTS |
| Fertigware und Versand | Verpacken, Bereitstellen, Verladen | Stapler, Förderer, Stretchwickler |

Die Intralogistik berührt die Planung an zwei Stellen. Erstens bricht jeder Materialmangel an der Linie den Plan, egal wie gut er optimiert war. Zweitens ist Transportzeit Teil der Durchlaufzeit: Der WIP, der auf den nächsten Stapler wartet, ist WIP, den Littles Gesetz mitzählt. Der Parent-Pillar erklärt diesen Zusammenhang im Abschnitt zur Factory Physics.

## 2. Den Fluss messen: Von-Nach-Matrix und Transportleistung

Eine **Von-Nach-Matrix** (From-To Chart, Transportmatrix) erfasst, wie viele Ladungen pro Tag zwischen jedem Paar von Bereichen bewegt werden. Multipliziert mit der Entfernung ergibt sich die **Transportleistung** (Ladungen × Entfernung, auch Transportintensität). Sie ist das schnellste objektive Maß für den Transportaufwand und die Grundlage für Layoutentscheidungen. Eine [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/) zeigt denselben Fluss auf höherer Ebene; ein Spaghetti-Diagramm zeigt ihn bildlich.

**Rechenbeispiel.** Ein Montagewerk, fünf Bereiche, Flüsse über zwei Wochen gezählt und gemittelt:

| Von → Nach | Ladungen pro Tag | Entfernung (ft) | Entfernung (ca. m) | Ladungs-Fuß pro Tag |
|---|---|---|---|---|
| Wareneingang → Lager | 60 | 150 | 46 | 9.000 |
| Wareneingang → Supermarkt (direkt) | 20 | 450 | 137 | 9.000 |
| Lager → Supermarkt | 55 | 400 | 122 | 22.000 |
| Lager → Montage (Großteile) | 25 | 480 | 146 | 12.000 |
| Supermarkt → Montage | 120 | 120 | 37 | 14.400 |
| Montage → Versand | 40 | 500 | 152 | 20.000 |
| **Summe** | | | | **86.400** (ca. 26.300 Ladungs-Meter) |

Zwei Layoutideen, auf dem Papier getestet:

1. **Den Supermarkt neben das Lager verlegen** (Lager → Supermarkt ca. 18 m (60 ft), aber Supermarkt → Montage ca. 116 m (380 ft), Wareneingang → Supermarkt ca. 55 m (180 ft)). Die gesamte Transportleistung *steigt* auf 93.500 Ladungs-Fuß pro Tag (ca. 28.500 Ladungs-Meter, +8 %), weil der Fluss vom Supermarkt zur Linie der größte ist. Supermärkte gehören nah an den Verbauort.
2. **Die Bereitstellung der Fertigware neben die Montage verlegen** (Montage → Versand ca. 46 m (150 ft) statt ca. 152 m (500 ft)). Die Summe sinkt auf 72.400 Ladungs-Fuß pro Tag (ca. 22.100 Ladungs-Meter), **16 % weniger**, ohne Änderung am Konzept der Materialbereitstellung.

Die Transportleistung ist eine Näherungsgröße. Gewichten Sie nach Transportmittel, wenn die Ladungen stark voneinander abweichen (eine Palette per Stapler ist nicht dasselbe wie eine Kiste auf einem Wagen), und prüfen Sie, dass eine kürzere Route nicht durch einen Fußgängerbereich führt.

## 3. Formen der Materialbereitstellung

Die Materialbereitstellung ist der Schritt, den die Werker am deutlichsten sehen. Es gibt vier Grundformen, und die meisten Werke kombinieren sie je Teilefamilie. Boysen, Emde, Hoeck und Kauderer beschreiben in einem Übersichtsartikel von 2015 die Prozessschritte und Entscheidungsprobleme der Teilelogistik für Montagelinien in der Automobilindustrie, vom Abruf bis zur Rückführung der Leergutbehälter [1].

| Form | Wie es funktioniert | Fläche an der Linie | Handlingaufwand | Fehlerrisiko | Am besten für |
|---|---|---|---|---|---|
| Linienbestückung | volle Paletten oder Großbehälter an der Linie | hoch | gering (wenige Bewegungen) | mittel (falsches Teil in großer Menge) | große, billige Teile mit wenigen Varianten |
| Kanban aus dem Supermarkt | Kleinladungsträger, auf Signal vom Routenfahrer nachgefüllt | mittel | mittel | gering | Wiederholteile mit gleichmäßigem Verbrauch |
| Kitting | alle Teile für ein Produkt oder einen Auftrag in einen Satz (Kit) kommissioniert | gering | hoch (Kommissionierung) | gering an der Linie, Kommissionierfehler wandern nach vorn | viele Varianten, Kleinteile, geringe Stückzahl |
| Sequenzierung (Just-in-Sequence) | Teile in der genauen Reihenfolge der Produkte auf der Linie geliefert | gering | hoch | gering, wenn die Reihenfolge stabil ist | große, variantenreiche Teile (Sitze, Kabelbäume) |

Fragen, die die Form je Teilefamilie entscheiden:

- Wie viele Varianten des Teils nutzt die Linie, und wie groß ist jede?
- Ist am Arbeitsplatz Platz für mehr als zwei Behälter?
- Wie stabil ist die Produktionsreihenfolge in den Stunden vor dem Verbau? Sequenzierung braucht eine eingefrorene Reihenfolge; Kitting braucht einen Auftrag, der früh genug zum Kommissionieren freigegeben ist.
- Was kostet ein Fehler? Ein falsches Kit stoppt ein Produkt; eine falsche Palette kann eine Schicht stoppen.

Lean-Werke setzen oft eine **Wasserspinne** (Water Spider, japanisch Mizusumashi) ein, einen festen Materialversorger, der eine Standardroute fährt, damit die Werker an ihren Arbeitsplätzen bleiben [10]. Die Rolle und ihre Standardarbeit behandeln die Shopfloor-Artikel auf m365.fm, zum Beispiel [Shop Floor Management](https://www.m365.fm/learn/shop-floor-management/).

## 4. Milkrun auslegen mit Rechenbeispiel

### 4.1 Was ein Milkrun ist

Ein **Milkrun** ist eine feste Route, die nach festem Fahrplan gefahren wird, wie eine Buslinie: Der Fahrer sammelt an jedem Stopp Leergut und Kanban-Karten ein und liefert volle Behälter, die in der vorigen Runde im Supermarkt kommissioniert wurden. Das feste Intervall heißt **Takt** oder Routenzyklus (englisch Pitch). Weil der Fahrplan fest ist, kann der Bestand an der Linie klein und vorhersehbar sein. Derselbe Begriff wird für die externe Logistik verwendet (ein Lkw holt bei mehreren Lieferanten ab); dieser Artikel behandelt die innerbetriebliche Variante.

### 4.2 Die Formel für die Umlaufzeit

> **Umlaufzeit der Route = Fahrzeit + (Anzahl Stopps × Zeit je Stopp) + (gehandhabte Behälter × Zeit je Behälter) + Beladezeit im Supermarkt**

Die Umlaufzeit muss mit einer Reserve für Verkehr, Warten an Kreuzungen und kleine Probleme in den Takt passen.

### 4.3 Rechenbeispiel

Ein Routenzug bedient acht Stopps an einer Montagelinie. Routenlänge ca. 610 m (2.000 ft). Durchschnittsgeschwindigkeit ca. 4,8 km/h (3 mph), das sind ca. 80 m pro Minute (264 ft pro Minute), einschließlich Abbremsen an Kreuzungen. Jeder Stopp dauert 0,5 Minuten (anhalten, absteigen, wieder aufsteigen). Der Fahrer tauscht je Runde 40 Behälter (voll hin, leer zurück), je 0,25 Minuten. Das Beladen des Zugs im Supermarkt dauert 6 Minuten. Das Werk will einen 30-Minuten-Takt.

| Element | Rechnung | Minuten |
|---|---|---|
| Fahrt | 2.000 ft ÷ 264 ft/min (ca. 610 m ÷ 80 m/min) | 7,6 |
| Stopps | 8 × 0,5 | 4,0 |
| Behälterhandling | 40 × 0,25 | 10,0 |
| Beladen im Supermarkt | vorgegeben | 6,0 |
| **Umlaufzeit** | | **27,6** |
| Anteil am 30-Minuten-Takt | 27,6 ÷ 30 | **92 %** |

Bei 92 % macht eine einzige blockierte Kreuzung den Zug unpünktlich, und die Linie beginnt, ihre Sicherheitsbehälter zu verbrauchen. Die Auslegung braucht mehr Reserve. Viele Planer zielen auf etwa 80 bis 85 % [unbelegt: Faustregel ohne Quelle; mit eigenen Routendaten kalibrieren]. Drei Optionen:

| Option | Änderung | Neuer Umlauf | Anteil am Takt | Nebenwirkungen |
|---|---|---|---|---|
| A. Schnelleres Handling | Wagen mit Rollenbahn und Regale in Greifhöhe, 0,15 min je Behälter | 23,6 min | 79 % | Investition in Wagen und Regale |
| B. Route teilen | zwei Routen mit je 4 Stopps und 20 Behältern, je ca. 366 m (1.200 ft) | 4,5 + 2,0 + 5,0 + 3,0 = 14,5 min | 48 % | zweiter Fahrer oder Zug, ungenutzte Kapazität |
| C. Längerer Takt | 40-Minuten-Takt, also etwa 53 Behälter je Runde und 8 min Beladen | 7,6 + 4,0 + 13,3 + 8,0 = 32,9 min | 82 % | überschreitet die 48 Stellplätze des Zugs (Abschnitt 4.4); mehr Bestand an der Linie |

Option A ist meist der erste Schritt, weil die Handlingzeit das größte Element ist. Option B passt, wenn eine zweite Route auch andere Bereiche bedienen kann. Option C fällt bei der Kapazitätsprüfung durch und erhöht genau den Bestand an der Linie, den der Milkrun abbauen sollte.

### 4.4 Kapazitätsprüfung des Zugs

Die zweite Prüfung ist physisch: Passen die Behälter? Hat der Zug vier Anhänger mit je 12 Behälterplätzen (48 Plätze) und bringt eine Runde 40 volle Behälter hin, funktioniert es, mit 8 Plätzen Reserve für Verbrauchsspitzen. Prüfen Sie die Spitzenstunde, nicht den Schichtdurchschnitt, denn der Verbrauch folgt dem Produktmix im Plan.

## 5. Supermärkte und Kanban-Mengen an der Linie

Der Takt des Milkruns legt fest, wie viel Bestand die Linie braucht. Für einen Kanban-Kreislauf zwischen Supermarkt und Linie mit einer Route in festem Intervall gilt:

> **Anzahl Behälter = Verbrauch pro Stunde × (Takt × (1 + Auftragsverzug) + Sicherheitszeit) ÷ Behältermenge**, aufgerundet

Der Auftragsverzug (Order Lag) ist die Zahl der Routenzyklen zwischen dem Abholen einer Karte und der Lieferung des vollen Behälters. Bei einem Ablauf "im Supermarkt kommissionieren und in der nächsten Runde liefern" beträgt er 1.

**Rechenbeispiel.** Ein Teil wird einmal pro Minute verbraucht (60 pro Stunde). Takt 30 Minuten, Auftragsverzug 1, Sicherheitszeit 15 Minuten, Behälter mit 30 Teilen.

- Abdeckungszeit = 0,5 h × (1 + 1) + 0,25 h = 1,25 h
- Verbrauch während der Abdeckungszeit = 60 × 1,25 = 75 Teile
- Behälter = 75 ÷ 30 = 2,5, aufgerundet **3 Behälter** im Kreislauf

Halbiert man den Takt auf 15 Minuten, sinkt die Abdeckungszeit auf 0,25 h × 2 + 0,25 h = 0,75 h, was 45 Teile oder 2 Behälter braucht. Kürzere Takte bedeuten weniger Bestand an der Linie, häufigere Fahrten und mehr Handling. Der Pillar zu [Kanban und Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/) (geplant) behandelt Kartenkreisläufe, Supermärkte und Kanban-Regeln ausführlich. Behältermengen wirken mit den Losgrößen vorgelagerter Stufen zusammen: Ein Lieferanten- oder Pressenlos, das nicht zur Behältermenge passt, erzeugt angebrochene Behälter und Zählfehler (siehe [Losgröße](https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/)). Wo Chargenrückverfolgung oder Haltbarkeit zählen, betreiben Sie Supermarktkanäle nach First-in-first-out (hinten beladen, vorn entnehmen), damit die Linie immer das älteste Los verbraucht.

## 6. Technik: Stapler, Routenzüge, Förderer, FTS und AMR

| Technik | Stärken | Grenzen | Typischer Einsatz |
|---|---|---|---|
| Gabelstapler | flexibel, hebt Paletten in die Höhe | erhebliche Gefahr für Fußgänger, eine Ladung je Fahrt, hohe Fahrerkosten je Bewegung | Wareneingang, Lager, Versand |
| Routenzug (Schleppzug) | viele Kleinladungsträger je Fahrt, fahrplanbasiert | braucht breite, freie Wege und Wendeflächen | Materialbereitstellung (Milkrun) |
| Handwagen | billig, flexibel | ergonomische Grenzen bei Schubkraft und Gewicht | kurze Wege, Zellen |
| Förderer | kontinuierlich, vorhersehbar | fester Weg, blockiert Fläche und Querverkehr | feste Flüsse mit hohem Volumen |
| FTS bzw. AGV (fahrerloses Transportfahrzeug, Automated Guided Vehicle) | folgt festen Wegen (Leitdraht, Magnetband, Reflektoren); vorhersehbar | Umplanen der Wege braucht Änderungen an der Infrastruktur | wiederkehrende Punkt-zu-Punkt-Transporte |
| AMR (autonomer mobiler Roboter) | navigiert über Karte und Sensoren, kann Hindernisse umfahren | Durchsatz sinkt in vollen Gängen; braucht gutes WLAN und Flottenmanagement | Transport von Kisten und Wagen im Mischverkehr |

Der Unterschied zwischen AGV und AMR betrifft vor allem die Navigation: Ein AGV folgt vorgegebenen Wegen, ein AMR plant seinen Weg selbst innerhalb einer Karte. Für die Sicherheit gibt es in den USA eine eigene Norm für industrielle mobile Roboter: ANSI/RIA R15.08-1-2020, *Industrial Mobile Robots – Safety Requirements – Part 1: Requirements for the Industrial Mobile Robot*, die "Sicherheitsanforderungen an industrielle mobile Roboter (IMR) festlegt" [4]. Teil 2 behandelt "Anforderungen an IMR-Systeme und IMR-Anwendungen", also Integration und Einsatz [4]. Teil 2 wurde von A3 (Association for Advancing Automation) entwickelt und 2023 als ANSI/A3 R15.08-2-2023 veröffentlicht [6]. Fahrerlose Flurförderzeuge haben eigene Normen: ANSI/ITSDF B56.5-2024 in den USA [8] und international ISO 3691-4:2023 [9].

Viele Werke streben in Montagebereichen **staplerfreie Zonen** an: Stapler bleiben in Wareneingang, Lager und Versand, und Routenzüge, Wagen oder AMR versorgen die Linie. Die Gründe sind Sicherheit (Trennung von Fußgängern) und Fluss (kleine, häufige Lieferungen statt Paletten).

## 7. Flottengröße für AMR und FTS

Eine erste Flottengröße ergibt sich aus einer einfachen Rechnung, noch vor jeder Simulation:

> **Fahrzeuge = (Fahrten pro Stunde × durchschnittliche Minuten je Fahrt) ÷ (60 × Verfügbarkeit)**, aufgerundet

Die Minuten je Fahrt umfassen Lastfahrt, Leerfahrt zurück oder zum nächsten Auftrag, Lade- und Entladezeit und Warten an Toren oder Aufzügen. Die Verfügbarkeit berücksichtigt Laden und Wartung.

**Rechenbeispiel.** Ein Montagebereich braucht in der Spitze 48 Kistentransporte pro Stunde. Eine Fahrt dauert im Mittel 6,5 Minuten (2,5 Lastfahrt, 2,0 Leerfahrt, 1,5 Laden und Entladen, 0,5 Warten). Die Verfügbarkeit nach Abzug der Ladezeiten liegt bei 85 %.

- Arbeitslast = 48 × 6,5 = 312 Fahrzeugminuten pro Stunde
- Kapazität je Fahrzeug = 60 × 0,85 = 51 Minuten pro Stunde
- Fahrzeuge = 312 ÷ 51 = 6,1, aufgerundet **7 AMR**

Sechs Fahrzeuge bräuchten in der Spitze 102 % ihrer verfügbaren Zeit. Mit sieben liegt die Auslastung bei 87 %. Vergleichen Sie vor der Entscheidung die Kosten je Bewegung der Flotte (Kauf oder Abonnement, Flottensoftware, Wartung, Integration) mit den heutigen Kosten je Bewegung. Zwei Warnungen:

1. **Verkehr ist nicht linear.** Mit mehr Fahrzeugen in denselben Gängen wächst die Wartezeit. Derselbe Warteschlangeneffekt, den der Pillar für Maschinen beschreibt (Kingman-Formel), gilt für Gänge und Ladestationen. Validieren Sie Flotten mit mehr als einer Handvoll Fahrzeugen mit einer ereignisdiskreten Simulation; der geplante Cluster zur Simulation in der Produktion unter dem Pillar [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/) behandelt die Methode.
2. **Die Leerfahrt ist die versteckte Variable.** Gute Disposition (das nächste freie Fahrzeug zuweisen, Aufträge kombinieren) senkt sie; schlechte Disposition bläht sie auf.

## 8. Sicherheit und die Menschen, die Material bewegen

### 8.1 OSHA-Regeln für Flurförderzeuge (USA)

In den USA fallen Gabelstapler, Routenzüge und andere motorisierte Flurförderzeuge unter OSHA 29 CFR 1910.178 [2]. Die wichtigsten Anforderungen für Planer:

- **Schulung und Bewertung.** Der Arbeitgeber muss sicherstellen, dass jeder Fahrer "befähigt ist, ein motorisiertes Flurförderzeug sicher zu bedienen", die Schulung vor dem Fahren abschließt (außer unter Aufsicht während der Schulung) und "mindestens alle drei Jahre" bewertet wird. Eine Auffrischungsschulung ist nötig nach einem Unfall oder Beinaheunfall, wenn unsicheres Fahren beobachtet wurde, wenn der Fahrer einem anderen Fahrzeugtyp zugeteilt wird oder wenn sich die Bedingungen am Arbeitsplatz ändern [2]. Der Arbeitgeber bescheinigt Schulung und Bewertung [2].
- **Tägliche Prüfung.** Fahrzeuge werden geprüft, bevor sie in Betrieb gehen, "mindestens täglich", und bei Betrieb rund um die Uhr nach jeder Schicht. Ein Fahrzeug mit einem sicherheitsrelevanten Mangel wird aus dem Betrieb genommen [2].
- **Freie Gänge.** Feuerwehrgänge sowie Zugänge zu Treppen und Brandschutzeinrichtungen müssen frei bleiben [2].

OSHA 29 CFR 1910.176 ergänzt die allgemeinen Regeln für Materialhandling und Lagerung: Wo mechanische Fördertechnik eingesetzt wird, "müssen ausreichende sichere Abstände für Gänge vorgesehen werden", Gänge müssen "frei und in gutem Zustand gehalten werden", dauerhafte Gänge müssen markiert sein, und gelagertes Material muss "gestapelt, gesichert, verzahnt und in der Höhe begrenzt sein, sodass es stabil und sicher ist" [3].

Eine Routenänderung beim Milkrun ist eine **Änderung der Bedingungen am Arbeitsplatz** im Sinne von 1910.178: Fahrer einweisen, Routenplan aktualisieren und prüfen, ob eine Auffrischungsschulung nötig ist.

### 8.2 Mobile Roboter und Mischverkehr

AMR bewegen sich zwischen Menschen. Die Sicherheit hängt vom Roboter ab (sicherheitsgerichtete Scanner, Geschwindigkeitsgrenzen in der Nähe von Menschen), von der Integration (Geschwindigkeitszonen, Torverriegelungen, markierte Kreuzungen) und von der Unterweisung aller Personen im Bereich. R15.08 bildet diese Aufteilung ab: Teil 1 behandelt den Roboter, Teil 2 System und Anwendung [4]. Behandeln Sie jede neue Route und jede Flottenerweiterung als Änderung, die eine Gefährdungsbeurteilung braucht.

### 8.3 Die Sicht der Mitarbeitenden

Materialversorger und Routenfahrer wissen, wo die Route hakt: die Kreuzung, die immer blockiert ist, das Regal, das niemand ohne Bücken erreicht, die Kanban-Karte, die verloren geht. Beziehen Sie sie in die Routenplanung ein, messen Sie die Route mit ihnen statt an ihnen und behandeln Sie ihre Vorschläge als Teil der Standardarbeit. Wenn Automatisierung wie AMR die Arbeitsinhalte verändert, beteiligen Sie die Belegschaft und, wo es eine gibt, die Gewerkschaft früh: welche Aufgaben an Roboter gehen, wie sich Rollen ändern und welche Qualifizierung folgt. Auch die Ergonomie gehört in die Auslegung: Behältergewicht, Regalhöhe und Schubkräfte der Wagen entscheiden, ob eine Route eine ganze Schicht lang gefahren werden kann.

## 9. IT- und OT-Integration

Materialfluss braucht drei Informationsflüsse:

| Information | Quelle | Abnehmer |
|---|---|---|
| Was gebaut wird, in welcher Reihenfolge | ERP- / APS-Plan, MES-Arbeitsvorrat | Kommissionierung im Supermarkt, Sequenzierung, Kitting |
| Was verbraucht wurde | Kanban-Scan, retrograde Entnahme, MES-Rückmeldung | Nachschub, Bestandsführung |
| Wo Material und Fahrzeuge sind | Lagerverwaltungssystem (LVS/WMS), Flottenmanager, RFID- oder Barcode-Scans | Disposition, Sichtbarkeit des Bestands an der Linie |

In der Sprache von ISA-95 sind das Tätigkeiten des Manufacturing Operations Management auf Ebene 3, zwischen dem ERP auf Ebene 4 und den Steuerungssystemen darunter; der Parent-Pillar behandelt die Ebenen in seinem Abschnitt 6. Zwei praktische Punkte:

- **Elektronisches Kanban** ersetzt verlorene Karten durch Scans, braucht aber dieselbe Disziplin: ein Scan je leerem Behälter, zum richtigen Zeitpunkt.
- **Flottenmanager für FTS und AMR sind OT-Systeme.** Sie brauchen Netzsegmentierung und Zugriffskontrolle wie jedes andere System in der Produktion; siehe den geplanten Pillar zu [OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/). Wo Fahrzeuge mehrerer Hersteller in einem Werk fahren, vermeidet eine gemeinsame Schnittstelle zwischen Flottenmanager und Fahrzeugen ein eigenes Leitsystem je Marke; in Europa ist die Schnittstellenspezifikation VDA 5050, entwickelt von VDA und VDMA für die Kommunikation zwischen mobilen Robotern und einer zentralen Leitsteuerung, ein solcher Ansatz [7].

## 10. Kennzahlen der innerbetrieblichen Logistik

| Kennzahl | Definition | Warum sie zählt |
|---|---|---|
| Materialmangel an der Linie | Anzahl der Fälle, in denen ein Arbeitsplatz auf Material wartete, je Schicht | direktes Maß für Planstörungen |
| Pünktlichkeit des Milkruns | im Takt abgeschlossene Runden ÷ alle Runden | zeigt, ob die Routenauslegung genug Reserve hat |
| Routenauslastung | Umlaufzeit ÷ Takt | Frühwarnung, bevor die Pünktlichkeit sinkt |
| Transportleistung | Ladungen × Entfernung pro Tag (Abschnitt 2) | verfolgt Verbesserungen bei Layout und Routen |
| Bestandsgenauigkeit an der Linie | korrekte Mengen an der Linie ÷ geprüfte Plätze | Disziplin bei Kanban und retrograder Entnahme |
| Transportkosten je Bewegung | Personal- und Gerätekosten der Logistik ÷ Bewegungen | Grundlage für Technikentscheidungen |
| Sicherheitsereignisse | Beinaheunfälle und Unfälle mit Fahrzeugen pro Monat | Frühindikator für die Verkehrsgestaltung |

Mehr zu Kennzahlendefinitionen im Pillar [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/).

## 11. Vorlage: Arbeitsblatt zur Milkrun-Auslegung

| Schritt | Eingabe oder Rechnung | Wert |
|---|---|---|
| 1. Takt | Zielintervall in Minuten (aus Verbrauch und Fläche an der Linie) | |
| 2. Stopps | Anzahl Stopps auf der Route | |
| 3. Routenlänge | Meter (oder Fuß), auf der tatsächlichen Route gemessen | |
| 4. Durchschnittsgeschwindigkeit | Meter (oder Fuß) pro Minute, gemessen einschließlich Kreuzungen | |
| 5. Fahrzeit | Schritt 3 ÷ Schritt 4 | |
| 6. Zeit je Stopp | gemessen, Minuten | |
| 7. Behälter je Runde | Summe über die Stopps der Behälter je Takt, in der Spitze | |
| 8. Zeit je Behälter | gemessen, Minuten | |
| 9. Beladen im Supermarkt | gemessen, Minuten | |
| 10. Umlaufzeit | 5 + (2 × 6) + (7 × 8) + 9 | |
| 11. Auslastung | Schritt 10 ÷ Schritt 1 | |
| 12. Kapazitätsprüfung | Behälterplätze auf dem Zug ≥ Schritt 7 in der Spitze | |
| 13. Kanban-Behälter je Teil | Formel in Abschnitt 5 | |
| 14. Sicherheitsprüfung | Kreuzungen, Fußgängerzonen, Gangbreiten, Einweisung der Fahrer (in den USA nach OSHA 1910.178) | |

## 12. Häufige Fehler

1. **Die Route auf die Durchschnittsschicht auslegen.** Der Verbrauch hat Spitzen je nach Produktmix; prüfen Sie die Spitzenstunde.
2. **Keine Reserve im Takt.** Eine Route mit 90 % oder mehr ihres Takts ist zu spät, sobald irgendetwas passiert.
3. **Supermarkt weit weg von der Linie.** Der größte Fluss sollte der kürzeste sein (Abschnitt 2).
4. **AMR kaufen, um einen chaotischen Fluss zu reparieren.** Roboter automatisieren die heutigen Routen und die heutigen Fehler. Erst messen und vereinfachen.
5. **Leerfahrten bei der Flottengröße ignorieren.** Im Beispiel machen sie fast ein Drittel der Fahrzeit aus.
6. **Behältermengen, die nicht zu Losen oder Verbrauch passen.** Angebrochene Behälter erzeugen Zählfehler und zusätzliche Bewegungen.
7. **Routenfahrer als austauschbar behandeln.** Die Route ist Standardarbeit; sie braucht Schulung, Zeitaufnahme gemeinsam mit dem Fahrer und einen Weg, Probleme zu melden.
8. **Routen ohne Sicherheitsprüfung ändern.** Eine neue Kreuzung ist eine Änderung der Bedingungen am Arbeitsplatz.

## 13. FAQ: Intralogistik und Milkrun

### Was ist Intralogistik?

Intralogistik ist die Organisation, Steuerung und Durchführung des Materialflusses innerhalb eines Unternehmensstandorts: Wareneingang, Lagerung, Supermärkte, Materialbereitstellung, Transport zwischen Arbeitsgängen und Versand. Der Begriff ist in Europa gängig; in den USA heißt derselbe Umfang meist In-Plant Logistics, Internal Logistics oder Material Handling.

### Was sind Beispiele für Intralogistik?

Im Werk: Entladen und Einlagern im Wareneingang, ein Supermarkt neben der Montage, ein Routenzug, der als Milkrun nach festem Fahrplan die Linie versorgt, Kitting und Sequenzierung von Teilen, Förderer oder FTS zwischen Arbeitsgängen, AMR, die Kisten bewegen, und die Bereitstellung für den Versand. Typische Technik sind Stapler, Routenzüge, Wagen, Förderer, automatische Lager, FTS und AMR, koordiniert durch Lagerverwaltungssystem, MES oder Flottenmanager.

### Was ist der Unterschied zwischen Intralogistik und Logistik?

Logistik umfasst den gesamten Warenfluss, einschließlich der Transporte zwischen Lieferanten, Werken, Lagern und Kunden. Intralogistik ist der Teil innerhalb eines Standorts, vom Tor im Wareneingang bis zum Tor im Versand.

### Was ist ein Milkrun in der Produktion?

Ein Milkrun ist eine feste Route mit festem Fahrplan, auf der ein Fahrer, meist mit einem Routenzug, volle Behälter an die Linie liefert und Leergut und Kanban-Karten einsammelt. Das feste Intervall (Takt) macht den Bestand an der Linie klein und vorhersehbar.

### Wie berechnet man die Umlaufzeit eines Milkruns?

Addieren Sie Fahrzeit (Routenlänge ÷ Geschwindigkeit), Stoppzeit (Stopps × Zeit je Stopp), Handlingzeit (Behälter × Zeit je Behälter) und Beladezeit im Supermarkt. Im Beispiel ergibt das 7,6 + 4,0 + 10,0 + 6,0 = 27,6 Minuten, also 92 % eines 30-Minuten-Takts und damit zu knapp.

### Was ist Materialbereitstellung an der Linie?

Materialbereitstellung (Line Feeding) ist die Lieferung von Teilen aus dem Lager oder einem Supermarkt an den Verbauort an der Linie. Die Grundformen sind Linienbestückung (volle Paletten), Kanban-Nachschub mit Kleinladungsträgern, Kitting (alle Teile für ein Produkt in einem Satz) und Sequenzierung (Teile in Verbaureihenfolge).

### Was ist der Unterschied zwischen FTS (AGV) und AMR?

Ein FTS bzw. AGV folgt vorgegebenen Wegen wie Magnetband, Leitdraht oder reflektorbasierten Routen und hält an, wenn der Weg blockiert ist. Ein AMR navigiert mit Karte und Sensoren und kann einen Weg um Hindernisse herum planen. AMR lassen sich leichter umplanen; AGV sind auf festen Wegen mit hohem Volumen besser vorhersehbar.

### Brauchen Staplerfahrer in den USA eine OSHA-Zertifizierung?

OSHA 29 CFR 1910.178 verlangt in den USA, dass der Arbeitgeber jeden Fahrer eines motorisierten Flurförderzeugs schult, seine Leistung mindestens alle drei Jahre bewertet und bescheinigt, dass Schulung und Bewertung stattgefunden haben. Die Bescheinigung stellt der Arbeitgeber aus, nicht die OSHA.

### Wie viele AMR braucht man?

Beginnen Sie mit Fahrten pro Stunde × durchschnittliche Minuten je Fahrt ÷ (60 × Verfügbarkeit), aufgerundet. Bei 48 Fahrten pro Stunde mit 6,5 Minuten und 85 % Verfügbarkeit lautet die Antwort 7. Bei größeren Flotten oder vollen Gängen bestätigen Sie die Zahl mit einer Simulation.

## 14. Fazit

Ein Plan hält nur, wenn das Material rechtzeitig an der Linie ankommt. Die Planung dahinter ist überwiegend Arithmetik: eine Von-Nach-Matrix, um zu sehen, wo der Transportaufwand entsteht, ein Milkrun-Umlauf mit genug Reserve, Kanban-Mengen, die aus dem Takt folgen, und eine Flottengröße, die Leerfahrten und Ladezeiten einrechnet. Die Grenzen sind physisch und menschlich: Gangfläche, sichere Kreuzungen, ergonomische Behälter und Fahrer, die die Route kennen.

Beginnen Sie damit, den heutigen Fluss und die Materialmängel an der Linie zu messen. Korrigieren Sie das Layout dort, wo die größten Flüsse die weitesten Wege haben, legen Sie die häufigsten Lieferungen auf einen Fahrplan, und entscheiden Sie erst dann, ob Routenzüge, Wagen oder mobile Roboter die Routen fahren. Die Planungsseite, von begrenzter Kapazität bis zur Auftragsfreigabe, steht im Parent-Leitfaden zur Produktionsplanung mit APS.

## Weiterlesen auf m365.fm

**Parent-Leitfaden**

- [Produktionsplanung mit APS: der vollständige Leitfaden](https://www.m365.fm/learn/produktionsplanung-aps/)

**Schwester-Cluster (geplant)**

- [Losgröße berechnen: Andler-Formel (EOQ), EPQ und dynamische Verfahren](https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/) (geplant)
- [Bestandsmanagement in der Produktion: Sicherheitsbestand, ABC/XYZ und Bestandsbewertung](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/) (geplant)

**Verwandte Pillars (geplant)**

- [Kanban und Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/) (geplant)
- [S&OP, MRP und Produktionsplanung](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) (geplant)
- [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)
- [Shop Floor Management](https://www.m365.fm/learn/shop-floor-management/)
- [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/)
- [OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)

**Begriffsseiten**

[Kanban](https://www.m365.fm/entity/kanban/) · [Pull-Prinzip](https://www.m365.fm/entity/pull-system/) · [Durchlaufzeit](https://www.m365.fm/entity/lead-time/) · [Losgröße](https://www.m365.fm/entity/batch-size/) · [Taktzeit](https://www.m365.fm/entity/takt-time/)

---

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Produktionsplanung und Feinplanung, Lean Management und die digitale Transformation der Fertigung.

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

*[Redaktion: Rolle, Werdegang und Profilfoto des Autors ergänzen.]*

---

# Quellen

Alle Online-Quellen abgerufen am 20. November 2026.

1. Boysen, Nils; Emde, Simon; Hoeck, Michael; Kauderer, Markus: Part logistics in the automotive industry: Decision problems, literature review and research agenda. European Journal of Operational Research 242 (2015) 1, S. 107–120. DOI: 10.1016/j.ejor.2014.09.065. Eintrag: https://ideas.repec.org/a/eee/ejores/v242y2015i1p107-120.html
2. OSHA: 29 CFR 1910.178, Powered industrial trucks. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.178
3. OSHA: 29 CFR 1910.176, Handling materials – general. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.176
4. ANSI/RIA R15.08-1-2020: Industrial Mobile Robots – Safety Requirements – Part 1: Requirements for the Industrial Mobile Robot. Eintrag im ANSI Webstore (mit verwandtem Eintrag zu Teil 2: Requirements for IMR system(s) and IMR application(s)): https://webstore.ansi.org/standards/ria/ansiriar15082020
5. MHI: About MHI. https://www.mhi.org/about
6. A3 (Association for Advancing Automation): ANSI/A3 R15.08-2 Safety Standard for Industrial Mobile Robot Systems and Applications Now Available (Pressemitteilung, International Robot Safety Conference, Oktober 2023). https://www.automate.org/robotics/news/ansi-a3-r15-08-2-safety-standard-for-industrial-mobile-robot-systems-and-applications-now-available/aph ; Eintrag im ANSI Webstore ANSI/A3 R15.08-2-2023: https://webstore.ansi.org/standards/ria/ansia3r15082023 (Eintrag nicht geöffnet)
7. VDA (Verband der Automobilindustrie): VDA 5050, Schnittstelle für die Kommunikation zwischen fahrerlosen Transportfahrzeugen und einer zentralen Leitsteuerung (entwickelt mit dem VDMA, unterstützt vom KIT IFL; aktuelle Version 3.0.0, März 2026). https://www.vda.de/en/topics/automotive-industry/vda-5050
8. ANSI/ITSDF B56.5-2024: Safety Standard for Driverless, Automatic Guided Industrial Vehicles and Automated Functions of Manned Industrial Vehicles. Eintrag im ANSI Webstore. https://webstore.ansi.org/standards/ansi/ansiitsdfb562024
9. ISO 3691-4:2023: Industrial trucks – Safety requirements and verification – Part 4: Driverless industrial trucks and their systems (Juni 2023, aktuell; ersetzt ISO 3691-4:2020). Eintrag AFNOR Boutique. https://www.boutique.afnor.org/en-gb/standard/iso-369142023/industrial-trucks-safety-requirements-and-verification-part-4-driverless-in/xs140360/346822
10. Gillis, Alexander S.: What is a lean water spider? TechTarget, 9. April 2025 (Definition der Rolle; japanischer Begriff Mizusumashi). https://www.techtarget.com/searcherp/definition/Lean-water-spider

---

# Prüfhinweise für die Redaktion

Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.

## URL- und Strukturannahmen

- Cluster-URL `https://www.m365.fm/learn/produktionsplanung-aps/intralogistik/` nach dem verschachtelten Schema des Briefs (Annahme).
- Inhaltsverzeichnis-Anker als ASCII-Anker (ae/oe/ue); nach dem CMS-Import testen.

## [Unbelegt]-Stellen und Prüfpunkte

1. Faustregel 80 bis 85 % Routenauslastung [unbelegt].
2. Alle Rechenbeispiele sind konstruierte Beispielzahlen.
3. **Einheiten:** Das Original rechnet nur in Fuß und mph. Die metrischen Angaben sind mit "ca." ergänzt (1 ft = 0,3048 m), die Rechnungen selbst laufen wie im Original in Fuß, damit die Ergebnisse (86.400 / 93.500 / 72.400 Ladungs-Fuß, 7,6 min Fahrzeit) identisch bleiben. Redaktion entscheidet, ob das Beispiel vollständig auf Meter umgestellt werden soll (dann ändern sich die Zwischenwerte, nicht die Prozentwerte).
4. Zitate aus OSHA, ANSI und MHI sinngemäß übersetzt.
5. Begriff "Takt" für das Milkrun-Intervall (Pitch) gewählt, weil in deutschen Werken üblich; nicht mit der Taktzeit der Linie verwechseln. Ggf. "Routentakt" verwenden.

## Für den deutschen Markt prüfen

- Abschnitt 8.1 beschreibt US-Recht (OSHA 1910.178 und 1910.176), ebenso FAQ "OSHA-Zertifizierung" und Vorlage Schritt 14. Für Deutschland durch die Fachprüfung prüfen lassen, ob ein Hinweis auf DGUV Vorschrift 68 und DGUV Grundsatz 308-001 (Fahrerausbildung), Betriebssicherheitsverordnung, ArbSchG (Gefährdungsbeurteilung) und Arbeitsstättenregeln (z. B. ASR A1.8 Verkehrswege) ergänzt werden soll. Nicht ohne Prüfung als Fakt einfügen.
- Normen für FTS/AMR: Neben ANSI/RIA R15.08 und ISO 3691-4 (auch als DIN EN ISO 3691-4) ggf. Maschinenrichtlinie bzw. EU-Maschinenverordnung prüfen lassen.
- Abschnitt 8.3: Beteiligung der Gewerkschaft ist US-Kontext; für Deutschland Mitbestimmung des Betriebsrats (§ 87 und §§ 90, 91 BetrVG bei Änderungen von Arbeitsabläufen und technischen Anlagen) prüfen lassen.

## Herstellerangaben und iFAKT

- Keine Herstelleraussagen. iFAKT im Text nicht erwähnt; Offenlegung in der Autorenbox exakt wie vorgegeben.

## Interne Links

- Parent-Pillar in Unterzeile und erstem Absatz, Abschnitte 1 und 9, Fazit, Weiterlesen (Anker auf Abschnitte des deutschen Pillars nicht gesetzt, da unbekannt).
- Schwester-Cluster: losgroesse und bestandsmanagement (erster Absatz, Abschnitt 5).
- Neue Pillars: kanban-pull-prinzip (5), ot-security-iec-62443 (9), sop-mrp-produktionsplanung (Weiterlesen); bestehend: wertstromanalyse (2), shop-floor-management (3), digital-twin (7), produktionskennzahlen (10). Der Cluster Simulation (`/learn/digital-twin/simulation-produktion/`) ist wie im Original nicht verlinkt; Link nach Veröffentlichung ergänzen.

## Empfohlene Grafiken

- Von-Nach-Matrix als Flussdiagramm mit Linienstärke proportional zur Transportleistung.
- Zeitbalken des Milkruns: Fahrt, Stopps, Handling, Beladen gegen den 30-Minuten-Takt (vor und nach Option A).
- Vergleichsgrafik FTS/AGV vs. AMR.
- Kanban-Kreislauf: Linie, Route, Supermarkt, mit dem Beispiel mit 3 Behältern.

## JSON-LD-Vorschlag

Article, FAQPage und BreadcrumbList wie in der englischen Fassung, mit `"inLanguage": "de-DE"`, URL https://www.m365.fm/learn/produktionsplanung-aps/intralogistik/, `isPartOf` https://www.m365.fm/learn/produktionsplanung-aps/, `headline` wie H1, FAQPage mit allen 9 FAQ-Fragen auf Deutsch (ohne Quellenmarker), Breadcrumb Learn > Produktionsplanung mit APS > Intralogistik.

## hreflang

`de-DE` https://www.m365.fm/learn/produktionsplanung-aps/intralogistik/ <-> `en-US` https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/
