# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | S&OP, MRP und Produktionsprogramm: Planung im ERP erklärt (57 Zeichen; Alternative: "S&OP und MRP: Produktionsplanung vom Plan bis zum Teil", 54 Zeichen) |
| Meta-Description | S&OP, Produktionsprogramm (MPS) und MRP erklärt: monatlicher S&OP-Zyklus, Brutto-Netto-Rechnung durchgerechnet, DDMRP, ERP, Kennzahlen, Vorlagen. (145 Zeichen) |
| Slug | `/learn/sop-mrp-produktionsplanung/` (vollständige URL: https://www.m365.fm/learn/sop-mrp-produktionsplanung/) |
| Hauptkeyword | S&OP (Sales and Operations Planning), MRP / Materialbedarfsplanung, Produktionsplanung im ERP |
| Nebenkeywords | S&OP-Prozess, S&OP-Zyklus, S&OP-Meeting, Absatz- und Produktionsplanung, Integrated Business Planning, IBP, Materialbedarfsplanung, MRP-Lauf, MRP II, Manufacturing Resource Planning, Produktionsprogrammplanung, Master Production Schedule, MPS, Primärbedarf, Sekundärbedarf, Available to Promise, ATP, Verfügbarkeitsprüfung, Grobkapazitätsplanung, RCCP, Kapazitätsbedarfsplanung, Stücklistenauflösung, Brutto-Netto-Rechnung, MRP Beispiel Berechnung, Planungsnervosität, Zeitzäune, Frozen Zone, DDMRP, Demand Driven MRP, Produktionsplanung ERP, Produktionsplanung und -steuerung (PPS), aggregierte Planung, Level- oder Chase-Strategie, Bedarfsplanung, Prognosegenauigkeit, Forecast Bias, MAPE, S&OP-Kennzahlen, S&OP-Reifegradmodell |
| Suchintention | Informational (was S&OP und MRP sind, wie sie zusammenhängen, wie die Rechnung funktioniert) mit praktischer Nebenintention (den Monatszyklus fahren, Planung im ERP einrichten, Software auswählen). Zielgruppe: Werksleitung, Supply-Chain- und Materialwirtschaftsleitung, Programmplaner (Master Scheduler) und Disponenten, Controller im S&OP, ERP-Key-User, Studierende des Produktionsmanagements und CPIM-Kandidaten |
| Wortzahl | **15.418 Wörter** von H1 bis Fazit inkl. Tabellen, Glossar und FAQ (`wc -w`, 26.11.2026); englische Fassung 16.396 Wörter nach derselben Zählung (94 %) |
| Sprachversion | Deutsch (`de-DE`). hreflang-Paar: `de-DE` https://www.m365.fm/learn/sop-mrp-produktionsplanung/ <-> `en-US` https://www.m365.fm/en/learn/sop-mrp-production-planning/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung (einschließlich SERP-Nachprüfung vom 20. November 2026) bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus; Hauptkeyword, Nebenkeywords und Überschriften sind danach zu prüfen. Im deutschen Sprachraum konkurrieren die Begriffe "S&OP", "Absatz- und Produktionsplanung", "Materialbedarfsplanung" und "PPS"; welcher Begriff das Hauptkeyword trägt, entscheidet erst der SERP-Check.

# Sales and Operations Planning (S&OP) und MRP: Wie Produktionsplanung vom Plan bis zum Teil funktioniert

*Stand: November 2026 · Lesezeit: etwa 60 Minuten (Schnelleinstieg: Kurzantwort, "Das Wichtigste in Kürze" und das durchgerechnete MRP-Beispiel im Abschnitt zu MRP)*

> **Kurzantwort:** Sales and Operations Planning (S&OP, auf Deutsch etwa Absatz- und Produktionsplanung) ist ein monatlicher Managementprozess, in dem Vertrieb, Produktion, Supply Chain und Finanzen sich auf einen gemeinsamen Plan für Bedarf, Versorgung und Bestand je Produktfamilie einigen, typischerweise über einen rollierenden Horizont von 18 bis 36 Monaten [5][6]; wissenschaftliche Quellen beschreiben den taktischen Kern mit bis zu etwa 18 Monaten [1]. Das Produktionsprogramm (Master Production Schedule, MPS) übersetzt diesen Plan in Mengen je Enderzeugnis und Woche, und die Materialbedarfsplanung (Material Requirements Planning, MRP) löst das MPS über die Stücklisten in terminierte Aufträge für jedes Teil und jedes Rohmaterial auf [7][13]. In den meisten Werken laufen MPS und MRP im ERP-System; S&OP läuft als Besprechungszyklus, unterstützt von Tabellenkalkulation, ERP oder spezieller Planungssoftware.

> **Das Wichtigste in Kürze**
> - S&OP entscheidet *wie viel* je Produktfamilie und Monat; das MPS entscheidet *welche Enderzeugnisse* je Woche; MRP entscheidet *welche Teile, wie viele und wann*. Die Feinplanung (Reihenfolge je Maschine und Stunde) liegt darunter und wird im [Leitfaden Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/) behandelt.
> - Das S&OP-Konzept geht auf die aggregierte Produktionsplanung der 1950er-Jahre zurück; Berater von Oliver Wight prägten das moderne S&OP in den 1980er-Jahren und den Begriff Integrated Business Planning (IBP) Anfang der 2000er-Jahre [1][2].
> - Joseph Orlicky formalisierte MRP 1964; Black & Decker war der erste Anwender, und 1981 nutzten etwa 8.000 Unternehmen MRP [3][4]. Oliver Wight erweiterte es 1983 zu MRP II [3].
> - Ein typischer monatlicher S&OP-Zyklus hat fünf Schritte: Datensammlung, Demand Review, Supply Review, Pre-S&OP-Meeting (Abgleich) und Executive-S&OP-Meeting [1].
> - MRP setzt unbegrenzte Kapazität und feste Wiederbeschaffungszeiten voraus; deshalb braucht es darüber eine Grobkapazitätsprüfung und darunter eine Feinplanung mit begrenzter Kapazität [8][9].
> - Eine kleine Änderung im MPS kann Aufträge auf mehreren Stücklistenstufen gleichzeitig verschieben ("Nervosität"). Das Einfrieren des nahen Planungszeitraums und Regeln zu Änderungskosten dämpfen das besser als zusätzlicher Sicherheitsbestand [10].
> - DDMRP ersetzt die prognosegetriebene Auflösung an ausgewählten Entkopplungspunkten durch dimensionierte Puffer (rot, gelb, grün) und eine Net-Flow-Gleichung [11][12].
> - S&OP mit Prognosegenauigkeit (WMAPE) *und* Bias, Planerfüllung, Planstabilität und Servicegrad messen. Eine Prognose mit 94 % Genauigkeit, die immer 2 % zu hoch liegt, baut trotzdem Bestand auf.

## Inhaltsverzeichnis

1. [Was ist Sales and Operations Planning (S&OP)? Definition und Abgrenzung](#was-ist-sales-and-operations-planning-sop-definition-und-abgrenzung)
2. [Die Planungshierarchie der Produktion: S&OP, MPS, RCCP, MRP und Feinplanung](#die-planungshierarchie-der-produktion-sop-mps-rccp-mrp-und-feinplanung)
3. [Geschichte: von der aggregierten Planung und Orlicky zu IBP und DDMRP](#geschichte-von-der-aggregierten-planung-und-orlicky-zu-ibp-und-ddmrp)
4. [Der S&OP-Prozess: der Monatszyklus Schritt für Schritt](#der-sop-prozess-der-monatszyklus-schritt-für-schritt)
5. [Versorgungsstrategien: Level, Chase oder hybrid (Rechenbeispiel)](#versorgungsstrategien-level-chase-oder-hybrid-rechenbeispiel)
6. [S&OP, IBP und S&OE im Vergleich](#sop-ibp-und-soe-im-vergleich)
7. [S&OP-Reifegradmodelle](#sop-reifegradmodelle)
8. [Produktionsprogramm (MPS) und Available to Promise (ATP)](#produktionsprogramm-mps-und-available-to-promise-atp)
9. [Grobkapazitätsplanung (RCCP)](#grobkapazitätsplanung-rccp)
10. [Materialbedarfsplanung (MRP): So funktioniert die Berechnung](#materialbedarfsplanung-mrp-so-funktioniert-die-berechnung)
11. [MRP II, Kapazitätsbedarfsplanung und der geschlossene Regelkreis](#mrp-ii-kapazitätsbedarfsplanung-und-der-geschlossene-regelkreis)
12. [MRP-Nervosität: Warum Pläne springen und wie man sie beruhigt](#mrp-nervosität-warum-pläne-springen-und-wie-man-sie-beruhigt)
13. [Demand Driven MRP (DDMRP)](#demand-driven-mrp-ddmrp)
14. [Produktionsplanung im ERP: Was die Systeme können und wo sie aufhören](#produktionsplanung-im-erp-was-die-systeme-können-und-wo-sie-aufhören)
15. [Vorlagen: S&OP-Kalender, Agenden, Familienplan, MPS- und MRP-Datensatz](#vorlagen-sop-kalender-agenden-familienplan-mps--und-mrp-datensatz)
16. [S&OP- und MRP-Kennzahlen mit Rechenbeispielen](#sop--und-mrp-kennzahlen-mit-rechenbeispielen)
17. [Einführungsfahrplan: in 12 Monaten zu funktionierendem S&OP und MRP](#einführungsfahrplan-in-12-monaten-zu-funktionierendem-sop-und-mrp)
18. [Häufige Fehler](#häufige-fehler)
19. [Grenzen von S&OP und MRP](#grenzen-von-sop-und-mrp)
20. [KI und digitale Planung: Was heute funktioniert](#ki-und-digitale-planung-was-heute-funktioniert)
21. [Glossar](#glossar)
22. [FAQ: Sales and Operations Planning und MRP](#faq-sales-and-operations-planning-und-mrp)
23. [Fazit und erste Schritte](#fazit-und-erste-schritte)

## Was ist Sales and Operations Planning (S&OP)? Definition und Abgrenzung

**Sales and Operations Planning (S&OP)** ist ein wiederkehrender Entscheidungsprozess, der die Bedarfsprognose mit der Versorgungsplanung zu einem Plan verbindet, nach dem Vertrieb, Marketing, Produktion, Supply Chain und Finanzen gemeinsam arbeiten [1]. Die wissenschaftliche Literatur beschreibt ihn als taktischen Prozess mit einem Horizont von bis zu etwa 18 Monaten, meist monatlich oder ereignisgesteuert durchgeführt [1]. Quellen von Anbietern und Praktikern beschreiben oft einen rollierenden Horizont von 18 bis 36 Monaten [5][6]. Das ist kein Widerspruch: Die ersten Monate werden detaillierter geplant, die äußeren Monate nur in Familien und Kapazitätsblöcken.

Drei Merkmale unterscheiden S&OP von einer Vertriebsprognose-Runde oder einer Produktionsbesprechung:

- **Ein Zahlenwerk.** Bedarf, Versorgung, Bestand oder Auftragsrückstand und der finanzielle Wert des Plans werden gemeinsam betrachtet, je Produktfamilie, in Stück und in Dollar.
- **Entscheidungen statt Berichte.** Das Ergebnis ist eine Reihe von Entscheidungen: eine Kapazitätserhöhung genehmigen, einen niedrigeren Servicegrad für eine langsam drehende Familie akzeptieren, einen Produktanlauf verschieben, vor einem Betriebsstillstand vorproduzieren.
- **Integration statt Koordination.** Rogelio Oliva und Noel Watson zeigten in einer Fallstudie, dass S&OP Wert schafft, wenn die Bereiche *gemeinsam gegen geteilte Ziele* planen, nicht wenn sie lediglich Pläne abstimmen, die jeder Bereich allein gemacht hat [21].

Den fachlichen Wissenskanon (Body of Knowledge) für S&OP, Programmplanung und MRP pflegt in den USA die ASCM (Association for Supply Chain Management, früher APICS). Ihr Programm CPIM (Certified in Planning and Inventory Management) behandelt S&OP, Bedarf, Versorgung, Bestand und Feinplanung als getrennte Module [24].

### Planung, nicht Feinsteuerung

S&OP ist nicht der Produktionsplan im Sinne der Maschinenbelegung. Es arbeitet mit Produktfamilien, Monatsraster und aggregierter Kapazität wie "Schweißstunden" oder "Schichten auf Linie 2". Die Frage "welcher Auftrag läuft morgen zuerst auf Maschine 14" gehört zur Feinplanung, die der [Leitfaden Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/) ausführlich behandelt, einschließlich Planung mit begrenzter Kapazität und Drum-Buffer-Rope. Dieser Artikel bleibt eine Ebene darüber und verbindet S&OP mit dem Produktionsprogramm und MRP.

### Wofür S&OP genutzt wird

Die Tabelle zeigt typische Entscheidungen, die nur ein bereichsübergreifendes S&OP treffen kann, weil kein einzelner Bereich sowohl die Kosten als auch den Nutzen trägt.

| Entscheidung | Wer profitiert | Wer zahlt | Warum es S&OP braucht |
|---|---|---|---|
| Ab März eine zweite Schicht in der Schweißerei | Vertrieb (Servicegrad) | Produktion (Personalkosten), Personalabteilung (Einstellung) | Abwägung zwischen Umsatz und Kosten |
| 2.000 Einheiten vor einem Betriebsstillstand im Sommer vorproduzieren | Kunden, Vertrieb | Finanzen (Working Capital), Lager | die Investition in Bestand muss genehmigt werden |
| Eine margenschwache Variante streichen | Produktion (weniger Rüstvorgänge) | Vertrieb (Umsatzverlust) | Portfolioentscheidung mit Margenwirkung |
| Einen großen Aktionsauftrag annehmen | Vertrieb, Marketing | Produktion (Überstunden), Einkauf | Machbarkeit bei Kapazität und Material |
| Einen zweiten Lieferanten für ein kritisches Teil qualifizieren | Supply Chain (Risiko) | Einkauf, Qualität (Qualifizierungskosten) | Resilienz gegen Stückkosten, siehe [resiliente Lieferketten](https://www.m365.fm/learn/operational-excellence/resiliente-lieferketten/) |

### Wer teilnimmt

Das Executive-Meeting leitet die Geschäftsführung oder die Leitung des Geschäftsbereichs. Ständige Mitglieder sind typischerweise die Leitungen von Vertrieb, Marketing, Produktion, Supply Chain, Finanzen und bei konstruierten Produkten der Entwicklung oder des Produktmanagements. Unterhalb des Executive-Meetings leisten Bedarfsplaner (Demand Planner), Programmplaner (Master Scheduler), Versorgungsplaner (Supply Planner) und ein Controller den größten Teil der Arbeit. Abschnitt 4 nennt die Rollen Schritt für Schritt.

## Die Planungshierarchie der Produktion: S&OP, MPS, RCCP, MRP und Feinplanung

Produktionsplanung und -steuerung (Manufacturing Planning and Control, MPC; im Deutschen meist PPS) ist als Hierarchie organisiert. Jede Ebene arbeitet mit einem längeren Horizont und gröberen Daten als die Ebene darunter und gibt ihre Entscheidungen als Vorgaben nach unten weiter. Das MIT-Kursmaterial von Stanley Gershwin fasst MRP II so zusammen: eine Hierarchie aus lang-, mittel- und kurzfristiger Planung, mit Bedarfsmanagement, Prognose, Kapazitätsplanung und Fertigungssteuerung rund um den MRP-Kern [8].

| Ebene | Typischer Horizont | Raster | Planungsobjekt | Leitfrage | Ergebnis | Typisches Werkzeug |
|---|---|---|---|---|---|---|
| Strategie- und Geschäftsplan | 3–5 Jahre | Jahr | Geschäft, Werk, Netzwerk | Welche Märkte, Werke und Kapazitätsinvestitionen? | Budget, Investitionsplan | Finanzwerkzeuge, Excel |
| S&OP / IBP | 18–36 Monate [5][6] | Monat | Produktfamilie, aggregierte Ressource | Wie viel verkaufen und produzieren wir, bei welchem Bestand und welchen Kosten? | genehmigter Familienplan | S&OP-Software, ERP, Excel |
| Produktionsprogramm (MPS) | einige Wochen bis mehrere Monate, mindestens die kumulierte Durchlaufzeit | Woche (nah: Tag) | Enderzeugnis oder Planungsartikel | Welche Enderzeugnisse, wie viele, in welcher Woche? | MPS, ATP | ERP |
| Grobkapazitätsplanung (RCCP) | wie MPS | Woche oder Monat | kritische Ressourcen | Ist das MPS am Engpass machbar? | Belastung gegen Kapazität je Schlüsselressource | ERP, Excel |
| Materialbedarfsplanung (MRP) | wie MPS | Tag oder Woche | jede Komponente und jedes Material | Welche Teile, wie viele, wann bestellen oder starten? | Planaufträge, Bestellanforderungen, Ausnahmemeldungen | ERP |
| Kapazitätsbedarfsplanung (CRP) | Wochen | Tag oder Woche | jeder Arbeitsplatz | Reicht die Kapazität für alle geplanten und freigegebenen Aufträge? | detaillierte Belastungsprofile | ERP |
| Feinplanung und Auftragsfreigabe (Dispatching) | Stunden bis wenige Wochen | Stunde, Schicht | Arbeitsgang auf einer Maschine | In welcher Reihenfolge läuft jeder Arbeitsgang? | Maschinenbelegungsplan, Arbeitsvorrat | APS, MES |

Zwei Regeln halten die Hierarchie zusammen:

1. **Die Disaggregation muss aufgehen.** Die Summe des MPS für alle Enderzeugnisse einer Familie muss innerhalb einer vereinbarten Toleranz (zum Beispiel plus oder minus 5 %) dem S&OP-Familienplan für denselben Monat entsprechen. Sonst hat die S&OP-Entscheidung keine Wirkung in der Fertigung.
2. **Die Machbarkeit wird auf jeder Ebene geprüft.** S&OP prüft die aggregierte Kapazität (Ressourcenplanung), das MPS wird durch die Grobkapazitätsplanung geprüft, das MRP-Ergebnis durch die Kapazitätsbedarfsplanung oder eine Feinplanung mit begrenzter Kapazität. MRP selbst prüft keine Kapazität [8][9].

### Wo ERP, APS und MES stehen

ANSI/ISA-95 trennt Geschäftsplanung und Logistik (Ebene 4, typischerweise ERP) vom Manufacturing Operations Management (Ebene 3, typischerweise MES und Feinplanung) [25]. S&OP, MPS und MRP sind Funktionen der Ebene 4. Der [Leitfaden MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant) erklärt die Seite der Ebene 3, und der [Leitfaden Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/) zeigt, wie sich die Daten zwischen den Ebenen integrieren lassen.

### Lagerfertigung, Montage auf Auftrag, Auftragsfertigung

Die Fertigungsart entscheidet, wo das MPS in der Stückliste ansetzt:

| Fertigungsart | Der Kunde wartet auf | MPS geplant auf Ebene | Beispiel | Schwerpunkt im S&OP |
|---|---|---|---|---|
| Lagerfertigung (Make-to-Stock, MTS) | nichts (Lieferung ab Lager) | Enderzeugnis | Konsumgüter, Standardpumpen | Zielbestand je Familie |
| Montage auf Auftrag (Assemble-to-Order, ATO) | die Endmontage | Module und Optionen (Planungsstückliste) | konfigurierbare Schreibtische, Lkw, PCs | Modulmix, Optionsanteile |
| Auftragsfertigung (Make-to-Order, MTO) | die Fertigung | Enderzeugnis oder wichtige Baugruppen nach Auftragseingang | Sondermaschinenteile | Ziel-Auftragsrückstand, Lieferzeit |
| Auftragsbezogene Entwicklung und Fertigung (Engineer-to-Order, ETO) | Konstruktion und Fertigung | Projektmeilensteine, Teile mit langer Wiederbeschaffungszeit | Sondermaschinen, Flugzeugkabinen | Kapazität in Entwicklung und Erprobung, siehe [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/) |

Bei Lagerfertigung gleicht S&OP den Bedarf gegen einen Zielbestand ab. Bei Auftragsfertigung und ETO gleicht es den Bedarf gegen einen Ziel-Auftragsrückstand oder eine zugesagte Lieferzeit ab. Werden diese Logiken in einer Familie vermischt, sind verwirrende S&OP-Zahlen eine häufige Folge.

## Geschichte: von der aggregierten Planung und Orlicky zu IBP und DDMRP

### Aggregierte Planung und die ersten MRP-Systeme (1950er–1960er)

S&OP begann Anfang der 1950er-Jahre als aggregierte Produktionsplanung: Eine aggregierte Produktionsrate wurde auf den prognostizierten Bedarf abgestimmt, indem man Bestand, Veränderungen der Belegschaft und Überstunden gegeneinander abwog [1]. Etwa zur selben Zeit computerisierten die Triebwerkshersteller Rolls-Royce und General Electric ihre Materialplanung [3].

1964 formalisierte Joseph Orlicky, ein Ingenieur bei IBM, die Materialbedarfsplanung [4]. Das erste Unternehmen, das sie einführte, war Black & Decker im Jahr 1964, mit Dick Alban als Projektleiter [3]. Orlickys Buch *Material Requirements Planning* (McGraw-Hill, 1975) wurde zum Standardwerk [13]. Seine dritte Auflage, eine Überarbeitung von Carol Ptak und Chad Smith aus dem Jahr 2011, führte Demand Driven MRP (DDMRP) ein [4].

Die Verbreitung wuchs schnell: Nach in Wikipedia zitierten Zahlen nutzten 1975 etwa 700 Unternehmen MRP und 1981 etwa 8.000 [3]. 1967 schrieben George Plossl und Oliver Wight, ein IBM-Kollege Orlickys, gemeinsam ein Buch über Produktions- und Bestandssteuerung [4].

### MRP II, ERP und S&OP (1980er–1990er)

1983 erweiterte Oliver Wight MRP zum **Manufacturing Resource Planning (MRP II)**, indem er Programmplanung, Grobkapazitätsplanung, Kapazitätsbedarfsplanung, S&OP und die Verbindung zur Finanzplanung ergänzte [3]. Oliver Wights Firma beschreibt S&OP als in den 1980er-Jahren von Oliver Wight entwickelt [2]; Wikipedia schreibt den Begriff und seine moderne Bedeutung Richard (Dick) Ling zu, damals Berater bei Oliver Wight [1]. Gartner prägte 1990 den Begriff "Enterprise Resource Planning" (ERP) [4]. ERP integrierte Finanzen, Vertrieb, Einkauf und Personalwesen rund um einen Planungskern, der MRP II blieb.

### IBP, DDMRP und gleichzeitige Planung (2000er bis heute)

Anfang der 2000er-Jahre prägte Oliver Wight den Begriff **Integrated Business Planning (IBP)**, der S&OP auf das ganze Unternehmen ausweitet, einschließlich Portfolio- und Finanzplanung, mit einem Horizont von mindestens 24 Monaten [2]. 2011 veröffentlichten Ptak und Smith die dritte Auflage von Orlickys Buch mit **Demand Driven MRP (DDMRP)** [4], und ERP-Anbieter wie Microsoft haben DDMRP seitdem in ihre Planungsmaschinen eingebaut [11]. Anbieter von Planungssoftware werben heute mit "gleichzeitiger" (concurrent) oder kontinuierlicher Planung, die Pläne in Minuten statt in einem monatlichen Batchlauf neu berechnet [16]; das ist eine Herstelleraussage und wird im Abschnitt zu KI besprochen.

| Jahr | Meilenstein | Quelle |
|---|---|---|
| Anfang der 1950er | aggregierte Produktionsplanung; Rolls-Royce und GE computerisieren die Materialplanung | [1][3] |
| 1964 | Orlicky formalisiert MRP bei IBM; Black & Decker ist der erste Anwender | [3][4] |
| 1967 | Plossl und Wight veröffentlichen zur Produktions- und Bestandssteuerung | [4] |
| 1975 | Orlickys *Material Requirements Planning*; etwa 700 MRP-Anwender | [3][13] |
| 1981 | etwa 8.000 MRP-Anwender | [3] |
| 1983 | Oliver Wight definiert MRP II | [3] |
| 1980er | S&OP wird bei Oliver Wight entwickelt (Dick Ling) | [1][2] |
| 1990 | Gartner prägt "ERP" | [4] |
| Anfang der 2000er | Oliver Wight prägt IBP | [2] |
| 2011 | dritte Auflage von Orlickys Buch durch Ptak und Smith führt DDMRP ein | [4] |

## Der S&OP-Prozess: der Monatszyklus Schritt für Schritt

Die meistzitierte wissenschaftliche Beschreibung des S&OP-Prozesses hat fünf Schritte: Datensammlung, Bedarfsplanung, Versorgungsplanung, Vorbesprechung und Executive-Meeting [1][20]. Manche Autoren ergänzen am Anfang ein Ereignis- oder Produktreview und am Ende einen Revisionsschritt [1]; Anaplan, ein Anbieter von Planungssoftware, beschreibt sechs Reviews: Produkt, Bedarf, Versorgung, Finanzen, Pre-S&OP und Executive-S&OP [15]. Kinaxis beschreibt einen traditionellen Monatszyklus mit fünf Stufen [16]. Die Unterschiede sind vor allem Bezeichnungen: Die Zyklen decken dasselbe Feld in ungefähr derselben Reihenfolge ab.

Der folgende Kalender setzt voraus, dass der Monat am letzten Arbeitstag abgeschlossen wird und das Executive-Meeting in der dritten Woche stattfindet.

| Arbeitstag | Schritt | Verantwortlich | Eingaben | Ergebnisse | Besprechungsdauer |
|---|---|---|---|---|---|
| 1–3 | 1. Datensammlung und Portfolio-Update | Bedarfsplaner, Produktmanagement | Istwerte des Vormonats (Lieferungen, Auftragseingang, Produktion, Bestand), Termine für Neuprodukte und Auslauf | aktualisierte Historie, Kennzahlenpaket, Produktänderungen | keine (Schreibtischarbeit) |
| 4–6 | 2. Demand Review | Leitung Vertrieb oder Marketing; Bedarfsplaner bereitet vor | statistische Prognose, Vertriebseingaben, Marketingaktionen, Pläne von Schlüsselkunden | unbeschränkter Konsens-Bedarfsplan je Familie, in Stück und Dollar, mit Annahmen und Risiken | 60–90 Minuten |
| 7–9 | 3. Supply Review | Leitung Produktion oder Supply Chain; Programmplaner und Versorgungsplaner bereiten vor | Konsensbedarf, Ziele für Bestand oder Auftragsrückstand, Kapazität je Schlüsselressource, Lieferantenengpässe | beschränkter Versorgungsplan, Kapazitätsprobleme und Optionen mit Kosten | 60–90 Minuten |
| 10–12 | 4. Pre-S&OP-Meeting (Abgleich) | S&OP-Prozesseigner; Controller | Bedarfs- und Versorgungspläne, Lücken, Finanzplan | abgeglichener Plan in Stück und Dollar, vorbereitete Entscheidungen mit Optionen, offene Punkte | 90–120 Minuten |
| 13–15 | 5. Executive-S&OP-Meeting | Geschäftsführung | Empfehlungen aus dem Pre-S&OP, Kennzahlen | genehmigter Plan, Entscheidungen, Eskalationen abgeschlossen | 60–120 Minuten |
| 16–20 | Umsetzung (Rollout) | Programmplaner, Disponenten | genehmigter Familienplan | MPS aktualisiert, MRP-Lauf, Einkaufs- und Kapazitätsmaßnahmen | keine |

### Schritt 1: Datensammlung und Portfolio-Update

Der Zyklus beginnt, sobald der Monat abgeschlossen ist. Der Bedarfsplaner zieht Lieferungen, Auftragseingang, Produktion, Bestand und Auftragsrückstand je Familie und Artikel (SKU), bereinigt die Historie um Einmalereignisse (ein Brand bei einem Kunden, eine einmalige Ausschreibung) und lässt die statistische Prognose laufen. Das Produktmanagement aktualisiert Anlauf- und Auslauftermine. Eine Prognose, die nicht weiß, dass eine Variante in Monat 4 ausläuft, bestellt weiter deren Teile.

**Checkliste, Schritt 1**

| Punkt | Erledigt, wenn |
|---|---|
| Istwerte geladen | Lieferungen, Auftragseingang, Produktion und Bestand stimmen mit dem Monatsabschluss der Finanzen innerhalb der vereinbarten Toleranz überein |
| Historie bereinigt | Ausreißer mit Grund markiert, nicht gelöscht |
| Statistische Prognose gelaufen | Modell und Parameter je Familie dokumentiert |
| Portfolioänderungen | Anläufe, Ausläufe, technische Änderungen mit Terminen und Verantwortlichen |
| Kennzahlenpaket | Prognosegenauigkeit und Bias, Planerfüllung, Service, Bestand gegen Ziel |

### Schritt 2: Demand Review

Das Demand Review erzeugt den **unbeschränkten Konsens-Bedarfsplan**: was Kunden wollen würden, wenn die Versorgung unbegrenzt wäre. Vertrieb und Marketing passen die statistische Prognose mit Informationen an, die die Historie nicht enthält: Preisänderungen, Aktionen, ein verlorener Kunde, ein neuer Händler. Jede Anpassung wird mit Verantwortlichem und Annahme festgehalten. Diese Aufzeichnung zeigt später, ob manuelle Übersteuerungen die Genauigkeit verbessert oder verschlechtert haben.

Typische Fehler in diesem Schritt sind Prognosen nur in Umsatz (die Produktion kann keine Dollar bauen), Prognosen auf Artikelebene über 24 Monate (zu viel Rauschen) und die Verwechslung von Vertriebsziel und Prognose. Ein Ziel ist, was das Unternehmen will; eine Prognose ist, was es erwartet. Die Lücke zwischen beiden ist ein geschäftliches Thema für das Executive-Meeting, keine Zahl, die man in der Prognose versteckt.

**Agenda Demand Review (60–90 Minuten)**

| Zeit | Thema | Leitung |
|---|---|---|
| 10 Min. | Vormonat: Prognosegenauigkeit und Bias je Familie, größte Abweichungen mit Ursache | Bedarfsplaner |
| 20 Min. | statistische Basis gegen letzten Konsens, Änderungen über Schwellenwert | Bedarfsplaner |
| 30 Min. | Eingaben von Vertrieb und Marketing je Familie: Ereignisse, Kunden, Preise | Vertrieb, Marketing |
| 15 Min. | Risiken und Chancen mit Wahrscheinlichkeit und Menge | Vertriebsleitung |
| 5 Min. | Konsens je Familie, offene Punkte, Verantwortliche | Bedarfsplaner |

### Schritt 3: Supply Review

Das Supply Review prüft den Konsensbedarf gegen Kapazität, Material und Bestandsziele. Die Planer übersetzen die Familienmengen über eine Ressourcenstückliste (Bill of Resources: Stunden je Einheit je Ressource) in Belastung der **Schlüsselressourcen** (Engpassarbeitsplätze, kritische Lieferanten, Gruppen von Fachkräften). Wo die Belastung die Kapazität übersteigt, entwickeln sie Optionen mit Kosten: Überstunden, eine zusätzliche Schicht, Fremdvergabe, Vorproduktion, ein späterer Liefertermin oder ein niedrigerer Servicegrad. Das Supply Review entscheidet nicht zwischen Optionen mit erheblicher finanzieller Wirkung; es bereitet sie für das Pre-S&OP-Meeting vor. Abschnitt 5 zeigt, wie solche Optionen verglichen werden.

**Agenda Supply Review (60–90 Minuten)**

| Zeit | Thema | Leitung |
|---|---|---|
| 10 Min. | Vormonat: Planerfüllung, MPS-Treue, Lieferantenleistung | Programmplaner |
| 25 Min. | Belastung gegen Kapazität je Schlüsselressource und Monat (grob) | Versorgungsplaner |
| 20 Min. | Prognose von Bestand und Auftragsrückstand gegen Ziele je Familie | Programmplaner |
| 20 Min. | Engpässe und Optionen mit Kosten und Risiko | Produktionsleitung |
| 5 Min. | beschränkter Versorgungsplan, Themen für das Pre-S&OP | Programmplaner |

### Schritt 4: Pre-S&OP-Meeting (Abgleich)

Das Pre-S&OP-Meeting bringt Bedarf, Versorgung und Finanzen zusammen. Das Controlling bewertet den beschränkten Plan zu Standardkosten und Verkaufspreisen und vergleicht ihn mit dem Budget oder der letzten Finanzprognose. Das Team löst, was es innerhalb der vereinbarten Entscheidungsbefugnisse lösen kann, und bereitet den Rest als Entscheidungsvorlagen auf: zwei oder drei Optionen, jeweils mit Wirkung auf Menge, Service, Kosten und Working Capital, und eine Empfehlung. Eine gute Entscheidungsvorlage passt auf eine Seite.

### Schritt 5: Executive-S&OP-Meeting

Das Executive-Meeting prüft die Kennzahlen, genehmigt den Plan und trifft die vorbereiteten Entscheidungen. Es ist nicht der Ort, um Zahlen zu überarbeiten. Eine typische Agenda:

| Zeit | Thema |
|---|---|
| 10 Min. | Kennzahlenreview: Service, Prognosegenauigkeit und Bias, Bestand und Auftragsrückstand gegen Ziel, Planerfüllung |
| 15 Min. | Geschäftsüberblick je Familie: Bedarfsplan gegen Budget, Versorgungsplan gegen Bedarf |
| 45 Min. | Entscheidungen: eine Entscheidungsvorlage nach der anderen, Optionen, Empfehlung, Entscheidung protokolliert |
| 10 Min. | Risiken für die nächsten 3–6 Monate, Stand der Neuprodukte |
| 10 Min. | Durchsicht des Entscheidungsprotokolls, Verantwortliche und Termine |

### Umsetzung: vom genehmigten Plan zum MPS

Wenige Tage nach dem Executive-Meeting disaggregiert der Programmplaner den genehmigten Familienplan in das MPS je Enderzeugnis und Woche (Abschnitt 8), prüft es mit der Grobkapazitätsplanung (Abschnitt 9) und startet den MRP-Lauf (Abschnitt 10). Der Einkauf erhält neue oder geänderte Planaufträge, und Kapazitätsentscheidungen (eine zweite Schicht, Überstunden) werden über Personalabteilung und Werk umgesetzt. Ohne diese Umsetzung wird S&OP zu einem monatlichen Foliensatz ohne Wirkung in der Fertigung.

### Rollen und Entscheidungsbefugnisse

| Rolle | Aufgaben |
|---|---|
| Executive Sponsor (Geschäftsführung) | leitet das Executive-Meeting, trifft die endgültigen Entscheidungen, sorgt für Teilnahme und Entscheidungsdisziplin |
| S&OP-Prozesseigner | führt den Kalender, bereitet das Pre-S&OP vor, pflegt Entscheidungs- und Annahmenprotokoll |
| Bedarfsplaner | statistische Prognose, Konsensprozess, Prognosekennzahlen |
| Leitungen Vertrieb und Marketing | Marktinformationen, Verantwortung für die Konsens-Bedarfszahl |
| Programmplaner (Master Scheduler) | MPS, ATP-Regeln, Grobkapazität, Disaggregation |
| Versorgungsplaner und Disponenten | MRP-Ausnahmen, Lieferantenkapazität, Bestellungen |
| Werks- oder Produktionsleitung | Kapazitätsplan, Personal, Entscheidungen zu Überstunden und Schichten |
| Controlling | Bewertung in Dollar, Abgleich mit dem Budget, Working Capital |
| Produktmanagement oder Entwicklung | Anläufe, Ausläufe, technische Änderungen |

Entscheidungsbefugnisse sollten schriftlich festgelegt werden. Beispiel: Das Supply Review darf Überstunden bis 10 % der Kapazität eines Arbeitsplatzes genehmigen; alles darüber und jede Änderung von Bestandszielen geht an das Executive-Meeting.

## Versorgungsstrategien: Level, Chase oder hybrid (Rechenbeispiel)

Die aggregierte Planung kennt drei klassische Versorgungsstrategien, die S&OP-Leitfäden nennen, aber selten durchrechnen [6]:

- **Level (Produktionsglättung):** mit konstanter Rate produzieren und die Bedarfsschwankungen vom Bestand auffangen lassen.
- **Chase (Bedarfsfolge):** die Produktionsrate jeden Monat dem Bedarf anpassen, mit Überstunden, Leiharbeit oder Schichten, und den Bestand flach halten.
- **Hybrid (gemischt):** die Rate einige Male ändern und etwas Bestandsaufbau in Kauf nehmen.

**Rechenbeispiel (Beispielzahlen).** Ein Schreibtischhersteller plant die Familie "Schreibtische mit Stahlgestell" für sechs Monate. Der Anfangsbestand beträgt 800 Einheiten, der Ziel-Endbestand 800 Einheiten, und an jedem Monatsende müssen mindestens 500 Einheiten vorhanden sein (Sicherheitsbestand). Die bisherige Produktionsrate lag bei 3.000 Einheiten pro Monat. Das Schweißen ist der Engpass: 5 Schweißzellen × 2 Schichten × 8 Stunden × 20 Tage = 1.600 Stunden pro Monat; jeder Schreibtisch braucht 0,4 Schweißstunden, also beträgt die Höchstrate 1.600 / 0,4 = **4.000 Schreibtische pro Monat**. Kosten: Lagerhaltung 4 USD je Einheit und Monat auf den Endbestand; jede Einheit Änderung der Monatsrate (Einstellung, Einarbeitung, Einrichtung von Überstunden oder Entlassung) kostet 5 USD.

| Monat | Bedarf | Level: Produktion | Level: Endbestand | Chase: Produktion | Chase: Endbestand | Hybrid: Produktion | Hybrid: Endbestand |
|---|---|---|---|---|---|---|---|
| Jan. | 3.000 | 3.800 | 1.600 | 3.000 | 800 | 3.500 | 1.300 |
| Feb. | 3.200 | 3.800 | 2.200 | 3.200 | 800 | 3.500 | 1.600 |
| März | 4.200 | 3.800 | 1.800 | **4.200** | 800 | 4.000 | 1.400 |
| Apr. | 4.800 | 3.800 | 800 | **4.800** | 800 | 4.000 | 600 |
| Mai | 4.000 | 3.800 | 600 | 4.000 | 800 | 4.000 | 600 |
| Juni | 2.800 | 3.800 | 1.600 | 2.800 | 800 | 3.000 | 800 |
| **Summe** | **22.000** | **22.800** | **8.600 Einheitenmonate** | **22.000** | **4.800 Einheitenmonate** | **22.000** | **6.300 Einheitenmonate** |

Warum die Level-Rate 3.800 beträgt: Der kumulierte Bedarf bis Mai beträgt 19.200 Einheiten; mit 500 Einheiten, die Ende Mai vorhanden sein müssen, und 800 zu Beginn muss die Produktion bis Mai mindestens 19.200 + 500 − 800 = 18.900 betragen, also 3.780 pro Monat. Auf 3.800 gerundet endet der Level-Plan im Juni mit 1.600 Einheiten, 800 über dem Ziel.

| Kostenelement | Level | Chase | Hybrid |
|---|---|---|---|
| Ratenänderungen (Einheiten × 5 USD) | 3.000 → 3.800: 800 → 4.000 USD | +200, +1.000, +600, −800, −1.200 = 3.800 → 19.000 USD | +500, +500, −1.000 = 2.000 → 10.000 USD |
| Lagerhaltung (Einheitenmonate × 4 USD) | 8.600 → 34.400 USD | 4.800 → 19.200 USD | 6.300 → 25.200 USD |
| **Summe** | **38.400 USD** | **38.200 USD** | **35.200 USD** |
| Am Schweißengpass machbar (≤ 4.000/Monat)? | ja | **nein** (März 4.200, April 4.800) | ja |
| Endbestand gegen Ziel 800 | +800 | im Ziel | im Ziel |

Der Chase-Plan wirkt auf dem Papier fast so günstig wie der Level-Plan, ist aber nicht machbar: März und April übersteigen die Schweißkapazität, es sei denn, das Unternehmen führt eine dritte Schicht ein, die ihre eigenen Kosten hätte. Der Hybrid-Plan ist unter den machbaren Optionen der günstigste und lastet das Schweißen drei Monate lang zu genau 100 % aus, was keine Schutzkapazität lässt. Ratenänderungen sind nicht nur eine Kostenzeile. Ein Chase-Plan bedeutet Einstellungen, Leiharbeit, Entlassungen oder dauerhafte Überstunden; Tarifverträge (in den USA: Gewerkschaftsverträge), Ankündigungsfristen für Überstunden und Ermüdung begrenzen, wie schnell ein Werk seine Rate ändern kann, und die Werker tragen die Last jeder Schwankung. Das Supply Review sollte Werk und Personalabteilung fragen, was realistisch ist, bevor es modelliert wird. Das Controlling ergänzt einen zweiten Effekt: Bei Standardkostenrechnung decken Monate mit niedriger Produktion weniger Fixkosten, sodass ein Chase-Plan Beschäftigungsabweichungen erzeugt, die ein Level-Plan vermeidet.

Das ist die Entscheidung, die das Supply Review in das Executive-Meeting bringen sollte: den Hybrid-Plan genehmigen und entscheiden, ob ein Schweiß-Unterlieferant für 200–400 Schreibtische pro Monat als Absicherung qualifiziert wird. Einen Engpass voll auszulasten, treibt Warteschlangen und Durchlaufzeiten stark nach oben, wie der [Abschnitt zur Factory Physics im APS-Leitfaden](https://www.m365.fm/learn/produktionsplanung-aps/) mit Littles Gesetz und Betriebskennlinien zeigt, und der [Leitfaden Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant) erklärt, wie man die Trommel (Drum) schützt.

## S&OP, IBP und S&OE im Vergleich

Die drei Begriffe beschreiben unterschiedliche Reichweiten und Horizonte.

| Aspekt | S&OP | Integrated Business Planning (IBP) | Sales and Operations Execution (S&OE) |
|---|---|---|---|
| Frage | Passen Bedarf und Versorgung je Familie zusammen? | Hält der gesamte Geschäftsplan (Portfolio, Bedarf, Versorgung, Finanzen, Strategie) zusammen? | Was ändern wir diese Woche, um den Plan umzusetzen? |
| Horizont | Oliver Wight: typischerweise 6–12 Monate; SAP und andere: 18–36 Monate rollierend [2][5] | mindestens 24 Monate [2] | 0–3 Monate (Wochen) [unbelegt: Horizont, wie in der Praxis üblich verwendet] |
| Takt | monatlich | monatlich | wöchentlich |
| Einheiten | Stück und Dollar je Familie | vor allem Dollar, dazu Stück | Stück je Artikel und Kunde |
| Leitung | Geschäftsführung oder Leitung Produktion | CEO oder Leitung des Geschäftsbereichs | Leitung Supply Chain oder Planung |
| Herkunft | Oliver Wight, 1980er [1][2] | Oliver Wight, Anfang der 2000er [2] | Begriff aus der Praxis, kein einzelner Ursprung belegt |

Oliver Wight beschreibt S&OP als auf Abwägungen in der Supply Chain zentriert und IBP als Blick auf das gesamte Unternehmen über Portfolio, Bedarf, Versorgung und Finanzen [2]. Viele Unternehmen verwenden die Begriffe austauschbar. Das Etikett ist weniger wichtig als zwei Tatsachen: ob Finanzen und Portfolio Teil des Prozesses sind und ob die Führung darin Entscheidungen trifft. S&OE ist die wöchentliche Brücke zwischen dem genehmigten Plan und dem MPS: Es behandelt kurzfristige Bedarfsänderungen, Versorgungsstörungen und Zuteilungen innerhalb der eingefrorenen und der teilflexiblen Zone des MPS (Abschnitt 8).

**Wöchentliche Agenda S&OE (30–45 Minuten, Beispiel)**

| Zeit | Thema | Leitung |
|---|---|---|
| 5 Min. | Vorwoche: MPS-Treue, Lieferungen gegen Plan, die drei größten Abweichungen | Programmplaner |
| 10 Min. | Bedarfsänderungen innerhalb des Planungszeitzauns: neue Großaufträge, Stornierungen, Zuteilung bei knapper Versorgung | Bedarfsplaner, Kundendienst |
| 10 Min. | Versorgungsprobleme: Lieferverzug, Maschinenausfälle, Qualitätssperren, Materialfehlmengen aus MRP-Ausnahmen | Versorgungsplaner, Werk |
| 10 Min. | Entscheidungen innerhalb der MPS-Regeln; alles außerhalb der Regeln wird an den nächsten S&OP-Schritt eskaliert | Leitung Supply Chain |
| 5 Min. | Maßnahmen, Verantwortliche, Termine | Programmplaner |

## S&OP-Reifegradmodelle

Reifegradmodelle helfen einem Unternehmen zu sehen, wo es steht und was der nächste Schritt ist. Drei sind weit verbreitet.

**Gartner.** Gartner veröffentlicht einen fünfstufigen S&OP-Reifegradfahrplan [17]. Die öffentliche Übersichtsseite nennt die Stufenbezeichnungen nicht; Sekundärquellen beschreiben die Stufen ungefähr so: von fehlenden gemeinsamen Zielen und unkoordinierter Planung in Tabellenkalkulationen (Stufe 1) über operative Vertriebsplanung, Abgleich von Bedarf und Versorgung über die gesamte Supply Chain und einen bedarfsorientierten, profitablen Produktmix bis zu einem vernetzten Unternehmen, in dem S&OP Teil der gesamten Geschäftsplanung ist und Entscheidungen szenariobasiert fallen (Stufe 5) [18]. [unbelegt: Gartners eigene Stufenbezeichnungen; die Beschreibungen oben folgen der Zusammenfassung von Jedox, einem Anbieter von Planungssoftware.]

**Grimson und Pyke (2007).** J. Andrew Grimson und David Pyke schlugen einen Rahmen mit fünf Dimensionen und fünf Stufen vor: kein S&OP-Prozess, reaktiv, Standard, fortgeschritten und proaktiv [1][19].

**Wagner, Ullrich und Transchel (2014).** Stephan Wagner und Kollegen beschreiben vier Dimensionen und sechs Stufen von unentwickelt bis proaktiv, zusammen mit dem Fünf-Schritte-Prozess aus Abschnitt 4 [1][20].

Eine einfache Selbsteinschätzung, abgeleitet aus den Dimensionen, die diese Modelle gemeinsam haben (Besprechungen und Zusammenarbeit, Organisation, Messung, Informationstechnik, Planintegration):

| Dimension | Stufe 1: keine oder reaktiv | Stufe 2: Standard | Stufe 3: fortgeschritten | Stufe 4: proaktiv |
|---|---|---|---|---|
| Besprechungen | Feuerwehreinsätze nach Bedarf | Monatszyklus, Führung nimmt manchmal teil | vollständiger Fünf-Schritte-Zyklus, Führung leitet jeden Monat | Zyklus umfasst Szenarien und Strategie, Führung entscheidet über Optionen |
| Organisation | kein Verantwortlicher | Koordinator in Teilzeit | eigener Prozesseigner, schriftliche Entscheidungsbefugnisse | S&OP ist die Art, wie das Geschäft geführt wird |
| Messung | keine | Service und Bestand | Prognosegenauigkeit und Bias, Planerfüllung | Kennzahlen mit Finanzergebnis und Anreizen verknüpft |
| IT | getrennte Tabellen | gemeinsame Tabelle oder ERP-Berichte | integriertes Planungswerkzeug, Abgleich Familie/Artikel | Szenarioplanung, automatisierter Datenfluss |
| Planintegration | Vertriebs- und Produktionsplan weichen voneinander ab | ein Mengenplan | Mengenplan mit Finanzplan abgeglichen | ein Plan steuert Budget, MPS und Investitionen |

Die Forschungslage zu den Wirkungen von S&OP ist unterstützend, aber nicht einheitlich. Eine Literaturauswertung von Antônio Márcio Tavares Thomé und Koautoren im *International Journal of Production Economics* fasste die S&OP-Literatur bis 2012 zusammen [22], und eine Begleitstudie verband S&OP mit dem Unternehmenserfolg [23]. Spätere Arbeiten betonen, dass die richtige S&OP-Gestaltung vom Kontext abhängt, etwa von Unternehmensgröße, Produktkomplexität und Unsicherheit in der Supply Chain [34]. Angaben zu festen prozentualen Verbesserungen durch S&OP auf Anbieterseiten sind als Herstelleraussagen zu lesen.

## Produktionsprogramm (MPS) und Available to Promise (ATP)

Das **Produktionsprogramm (Master Production Schedule, MPS)** ist eine Aussage darüber, was das Unternehmen auf Basis des taktischen Plans und der Budgetgrenzen zu produzieren erwartet, wie es die Dokumentation von Oracle JD Edwards formuliert [7]. Es steht zwischen S&OP und MRP: konkret genug (Enderzeugnis, Woche), um Material- und Kapazitätsplanung zu steuern, und stabil genug, um das Werk vor dem täglichen Rauschen zu schützen. MRP berechnet dann die zeitlich gestaffelten Nettobedarfe für jede Komponente, die das MPS braucht [7].

### Disaggregation: von der Familie zum Enderzeugnis

Der genehmigte S&OP-Plan für "Schreibtische mit Stahlgestell" im April beträgt 4.000 Einheiten. Der Programmplaner teilt ihn nach aktuellem Mix und bekannten Aufträgen auf die Enderzeugnisse auf: 55 % D100 (2.200), 30 % D120 (1.200) und 15 % D140 (600), dann auf die Wochen. Planungsstücklisten kommen dort zum Einsatz, wo Optionen als Prozentsätze geplant werden, zum Beispiel 60 % schwarze und 40 % weiße Gestelle.

### Zeitzäune (Time Fences)

Das MPS ist in Zonen mit unterschiedlichen Änderungsregeln eingeteilt. Typische Zonenbezeichnungen und Regeln (genaue Definitionen und Zonenlängen unterscheiden sich je nach Unternehmen und ERP):

| Zone | Typische Ausdehnung | Was sich ändern darf | Wer genehmigt |
|---|---|---|---|
| Eingefroren (Frozen) | von heute bis zum Bedarfszeitzaun (zum Beispiel Durchlaufzeit der Endmontage) | nichts, außer in Notfällen | Werksleitung oder S&OE-Meeting |
| Teilflexibel (Slushy) | vom Bedarfszeitzaun bis zum Planungszeitzaun (zum Beispiel kumulierte Wiederbeschaffungszeit der Kaufteile mit langer Lieferzeit) | Mix innerhalb der Familie; Mengen innerhalb vereinbarter Toleranz | Programmplaner |
| Flexibel (Liquid) | jenseits des Planungszeitzauns | alles, was mit dem S&OP vereinbar ist | Planungssystem und Programmplaner |

Die eingefrorene Zone meinen Gershwins MIT-Folien, wenn sie vom Einfrieren des nahen Planungszeitraums sprechen: Es verringert die Nervosität auf Kosten der Flexibilität [8]. Abschnitt 12 quantifiziert, warum.

### MPS-Datensatz mit disponiblem Bestand und ATP

**Rechenbeispiel (Beispielzahlen).** Enderzeugnis D100, Lagerbestand 60 Einheiten, MPS-Losgröße 200, Sicherheitsbestand 0, Bedarfszeitzaun am Ende von Woche 2. Innerhalb des Bedarfszeitzauns besteht der projizierte Bedarf nur aus Kundenaufträgen; außerhalb ist er das Maximum aus Prognose und Kundenaufträgen.

| Woche | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Prognose | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| Kundenaufträge | 90 | 70 | 40 | 20 | 10 | 0 | 0 | 0 |
| Projizierter Bedarf | 90 | 70 | 100 | 100 | 100 | 100 | 100 | 100 |
| MPS (Fertigmeldungen) | 200 | | | 200 | | 200 | | 200 |
| Projizierter verfügbarer Bestand (PAB), Start 60 | 170 | 100 | 0 | 100 | 0 | 100 | 0 | 100 |
| Diskretes ATP | 60 | | | 170 | | 200 | | 200 |
| Kumuliertes ATP | 60 | 60 | 60 | 230 | 230 | 430 | 430 | 630 |

So kommen die Zahlen zustande:

- **PAB, Woche 1:** 60 + 200 − 90 = 170. Woche 2: 170 − 70 = 100. Woche 3: 100 − 100 = 0. Woche 4 würde auf −100 fallen, also plant das MPS ein Los von 200: 0 + 200 − 100 = 100. Und so weiter.
- **Diskretes ATP** wird nur in Wochen mit einem MPS-Zugang berechnet: Lagerbestand (nur in der ersten Periode) plus MPS-Menge minus alle Kundenaufträge bis zum nächsten MPS-Zugang. Woche 1: 60 + 200 − (90 + 70 + 40) = 60. Woche 4: 200 − (20 + 10) = 170. Wochen 6 und 8: 200 − 0 = 200.
- **Kumuliertes ATP** summiert das diskrete ATP über die Zeit: 60, dann 60 + 170 = 230, dann 430, dann 630.
- Manche ERP-Systeme verwenden eine Variante mit Vorausschau: Übersteigen die Kundenaufträge einer späteren Periode den MPS-Zugang dieser Periode, wird die Lücke vom ATP früherer Perioden abgezogen, damit dieselben Einheiten nicht zweimal zugesagt werden. In diesem Beispiel ist keine Periode überbucht, daher liefern beide Methoden dasselbe Ergebnis.

Was der Vertrieb zusagen kann: Ein Kunde, der 100 Schreibtische in Woche 2 möchte, kann aus dem aktuellen Plan höchstens 60 bekommen; die vollen 100 sind ab Woche 4 verfügbar (kumuliertes ATP 230). Der PAB von 0 in Woche 3 ist für Zusagen kein Problem, weil ATP mit Kundenaufträgen rechnet, nicht mit der Prognose. Für den Programmplaner ist er ein Signal, dass der Plan keinen Puffer hat, wenn die Aufträge in Woche 3 die Prognose übersteigen. ERP-Systeme wie JD Edwards weisen ATP und kumuliertes ATP als Standardergebnisse des MPS aus [7].

### MPS-Regeln, die den Plan glaubwürdig halten

| Regel | Warum |
|---|---|
| Die MPS-Summe je Familie bleibt innerhalb von ±5 % des S&OP-Plans (Beispieltoleranz) | sonst erreichen S&OP-Entscheidungen die Fertigung nicht |
| Keine Überlastung: RCCP-Belastung ≤ nachgewiesene Kapazität an Schlüsselressourcen | ein überhöhtes MPS macht ATP- und MRP-Termine fiktiv |
| Änderungen in der eingefrorenen Zone brauchen eine namentliche Genehmigung | schützt bereits gebundenes Material und gebundene Kapazität |
| Fixierte Planaufträge für den nahen Zeitraum | der MRP-Lauf kann sie nicht automatisch verschieben |
| ATP wird vor jeder Auftragszusage geprüft | verhindert, dass dieselbe Kapazität zweimal zugesagt wird |
| Wöchentliche MPS-Durchsicht im S&OE-Meeting | fängt Abweichungen ab, bevor daraus überfällige Aufträge werden |

## Grobkapazitätsplanung (RCCP)

Die Grobkapazitätsplanung (Rough-Cut Capacity Planning, RCCP) prüft das MPS gegen wenige **kritische Ressourcen**, bevor MRP es auflöst. "Grob" ist sie, weil sie eine Ressourcenstückliste (Stunden je Enderzeugnis an jeder Schlüsselressource) statt vollständiger Arbeitspläne verwendet und die meisten Vorlaufverschiebungen ignoriert.

**Rechenbeispiel (Beispielzahlen).** Wochen-MPS für die drei Schreibtischmodelle und ihre Ressourcenstückliste an drei Schlüsselressourcen:

| Modell | MPS Woche 14 | Schweißen (Std./Einheit) | Pulverbeschichtung (Std./Einheit) | Endmontage (Std./Einheit) |
|---|---|---|---|---|
| D100 | 550 | 0,40 | 0,10 | 0,25 |
| D120 | 300 | 0,45 | 0,12 | 0,30 |
| D140 | 150 | 0,60 | 0,15 | 0,40 |

| Ressource | Belastungsrechnung | Belastung (Std.) | Wochenkapazität (Std.) | Auslastung |
|---|---|---|---|---|
| Schweißen | 550 × 0,40 + 300 × 0,45 + 150 × 0,60 = 220 + 135 + 90 | 445 | 400 | **111 %** |
| Pulverbeschichtung | 550 × 0,10 + 300 × 0,12 + 150 × 0,15 = 55 + 36 + 22,5 | 113,5 | 160 | 71 % |
| Endmontage | 550 × 0,25 + 300 × 0,30 + 150 × 0,40 = 137,5 + 90 + 60 | 287,5 | 320 | 90 % |

Das Schweißen ist um 45 Stunden überlastet. Optionen: 75 Schreibtische D140 (75 × 0,60 = 45 Std.) in Woche 15 verschieben, wenn Woche 15 Luft hat und die Kundentermine es zulassen, 45 Überstunden einplanen oder einige D100-Gestelle an den im Supply Review vorbereiteten Unterlieferanten geben. Die wöchentliche Schweißkapazität von 400 Stunden entspricht den 1.600 Stunden pro Monat aus dem S&OP (Abschnitt 5), und genau darum geht es: Die RCCP verwendet dieselben Ressourcendefinitionen wie das S&OP Supply Review, sodass sich die Ebenen abgleichen lassen.

In Lehrbüchern und ERP-Systemen sind drei RCCP-Techniken verbreitet: Kapazitätsplanung mit Gesamtfaktoren (historische Anteile der Gesamtstunden je Arbeitsplatz), Kapazitäts- bzw. Ressourcenstücklisten (Stunden je Einheit je Ressource, wie oben) und Ressourcenprofile, die zeitliche Versätze ergänzen. Je detaillierter die Methode, desto näher kommt sie der Kapazitätsbedarfsplanung (Abschnitt 11).

## Materialbedarfsplanung (MRP): So funktioniert die Berechnung

Die **Materialbedarfsplanung (Material Requirements Planning, MRP)** nutzt Stückliste und Bestandsdaten, um zeitlich gestaffelte Nettobedarfe für jede Komponente und Baugruppe zu berechnen, und schlägt einen Nachschubplan vor, der das MPS stützt [7]. Ihre Logik beruht auf einer Idee Orlickys: Der Bedarf an Komponenten ist vom Bedarf am Enderzeugnis *abhängig* (Sekundärbedarf), deshalb soll er berechnet, nicht prognostiziert werden [13]. Baut das Werk in Woche 3 150 Schreibtische und hat jeder Schreibtisch vier Beine, braucht es vor Woche 3 600 Beine, gleichgültig, was eine statistische Prognose für Beine sagen würde.

### Die Eingangsdaten

| Eingangsdaten | Inhalt | Typisches Datenqualitätsproblem |
|---|---|---|
| Produktionsprogramm (MPS) | Enderzeugnisse, Mengen, Termine | MPS nicht mit dem S&OP abgeglichen oder überlastet |
| Stückliste (Bill of Materials, BOM) | Beziehungen zwischen übergeordnetem Teil und Komponente, Menge je Einheit, Ausschussfaktoren, Gültigkeitstermine | Konstruktionsstückliste statt Fertigungsstückliste verwendet; fehlende Phantombaugruppen; nach technischen Änderungen veraltet |
| Bestandsdaten | Lagerbestand, reservierter Bestand, Sicherheitsbestand | Zählungen falsch; Ausschuss und Verbrauch nicht gebucht |
| Offene Aufträge (geplante Zugänge) | freigegebene Fertigungs- und Bestellaufträge mit Fälligkeitsterminen | Fälligkeitstermine nicht gepflegt; Aufträge zu spät abgeschlossen |
| Dispositionsdaten im Materialstamm | Wiederbeschaffungszeit, Losgrößenverfahren, Rundungswerte, Mindestmengen, Ausbeute | Wiederbeschaffungszeiten vor Jahren gesetzt und nie überprüft |

Gershwins MIT-Folien nennen dieselben Bausteine: Bruttobedarf, geplante Zugänge, projizierter Lagerbestand, Nettobedarf, Planauftragszugänge und Planauftragsfreigaben, verschoben um die Wiederbeschaffungszeit [8].

### Die fünf Schritte je Teil

1. **Bruttobedarf:** für Enderzeugnisse das MPS, für Komponenten die Planauftragsfreigaben aller übergeordneten Teile multipliziert mit der Menge je Einheit.
2. **Nettobedarfsrechnung (Brutto-Netto-Rechnung):** projizierter Lagerbestand = vorheriger Lagerbestand + geplante Zugänge − Bruttobedarf. Wo er unter den Sicherheitsbestand fallen würde, ist die Lücke der **Nettobedarf**.
3. **Losgrößenbildung:** Der Nettobedarf wird nach dem Losgrößenverfahren (exakte Losgröße bzw. Lot-for-Lot, feste Bestellmenge, Rundungswerte, Periodenlosgröße) zu einem **Planauftragszugang**.
4. **Vorlaufverschiebung:** Der Planauftragszugang wird um die Wiederbeschaffungszeit des Teils nach vorn verschoben und ergibt die **Planauftragsfreigabe**.
5. **Stücklistenauflösung:** Die Planauftragsfreigaben werden zum Bruttobedarf der nächsten Stücklistenstufe.

Die Teile werden Stufe für Stufe in der Reihenfolge der **Dispositionsstufe** (Low-Level-Code) bearbeitet: Jedes Teil erhält einen Code, der der tiefsten Stufe entspricht, auf der es in irgendeiner Stückliste vorkommt, damit alle Bruttobedarfe aller übergeordneten Teile gesammelt sind, bevor die Nettobedarfsrechnung für das Teil läuft [8]. Das Rechenbeispiel zeigt, warum das wichtig ist.

### Rechenbeispiel: Stücklistenauflösung und Nettobedarfsrechnung über zwei Stücklistenstufen

**Erzeugnisstruktur (Beispiel).** Der Schreibtisch D100 besteht aus einer Tischplatte T-20, einem Beingestell F-10 und 1 Meter Stahlrohr S-5 für eine Querstrebe. Jedes Beingestell F-10 wird aus 4 Metern Stahlrohr S-5 geschweißt. S-5 erscheint daher auf Stufe 1 (direkt in D100) und auf Stufe 2 (in F-10); seine Dispositionsstufe ist 2.

```
D100 Schreibtisch (Stufe 0)
├── T-20 Tischplatte, Menge 1 (Stufe 1, Eigenfertigung, Wiederbeschaffungszeit 1 Woche)
├── F-10 Beingestell, Menge 1 (Stufe 1, eigene Schweißerei, Wiederbeschaffungszeit 2 Wochen)
│   └── S-5 Stahlrohr, 4 m (Stufe 2, Kaufteil, Wiederbeschaffungszeit 2 Wochen)
└── S-5 Stahlrohr, 1 m (Stufe 1, Querstrebe)
```

Damit die Tabellen lesbar bleiben, zeigt die MPS-Zeile die Woche, in der die Endmontage von D100 beginnt; die Komponenten müssen zu Beginn dieser Woche verfügbar sein.

**MPS für D100 (Starts der Endmontage):**

| Woche | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Summe |
|---|---|---|---|---|---|---|---|---|---|
| Montagestarts D100 | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 | 740 |

**Teil T-20 Tischplatte.** Exakte Losgröße (Lot-for-Lot), Wiederbeschaffungszeit 1 Woche, Lagerbestand 30, geplanter Zugang 100 in Woche 1, Sicherheitsbestand 0.

| Woche | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Bruttobedarf | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 |
| Geplante Zugänge | 100 | | | | | | | |
| Projizierter Lagerbestand (Start 30) | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 |
| Nettobedarf | | | 140 | 100 | | 150 | 100 | 120 |
| Planauftragszugänge | | | 140 | 100 | | 150 | 100 | 120 |
| Planauftragsfreigaben | | 140 | 100 | | 150 | 100 | 120 | |

Woche 1: 30 + 100 − 120 = 10. Woche 3: 10 − 150 = −140, also werden 140 benötigt und eine Woche früher, in Woche 2, freigegeben.

**Teil F-10 Beingestell.** Feste Bestellmenge 200 (ein Schweißlos), Wiederbeschaffungszeit 2 Wochen, Lagerbestand 120, keine geplanten Zugänge, Sicherheitsbestand 0.

| Woche | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Bruttobedarf | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 |
| Projizierter Lagerbestand (Start 120) | 0 | 0 | 50 | 150 | 150 | 0 | 100 | 180 |
| Nettobedarf | | | 150 | 50 | | | 100 | 20 |
| Planauftragszugänge | | | 200 | 200 | | | 200 | 200 |
| Planauftragsfreigaben | 200 | 200 | | | 200 | 200 | | |

Woche 3: 0 − 150 = −150, also kommt ein Los von 200, und 50 bleiben übrig. Woche 4: 50 − 100 = −50, ein weiteres Los von 200, und 150 bleiben übrig. Woche 6 verbraucht die verbleibenden 150 genau. Die Freigaben sind um zwei Wochen nach vorn verschoben.

**Teil S-5 Stahlrohr (Dispositionsstufe 2).** Kaufteil, Wiederbeschaffungszeit 2 Wochen, Bestellung in Vielfachen von 500 m, Lagerbestand 1.400 m, geplanter Zugang 500 m in Woche 1, Sicherheitsbestand 100 m. Der Bruttobedarf fasst beide übergeordneten Teile zusammen:

| Woche | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Aus Freigaben F-10 (× 4 m) | 800 | 800 | | | 800 | 800 | | |
| Aus Starts D100 (× 1 m) | 120 | | 150 | 100 | | 150 | 100 | 120 |
| **Bruttobedarf** | **920** | **800** | **150** | **100** | **800** | **950** | **100** | **120** |
| Geplante Zugänge | 500 | | | | | | | |
| Projizierter Lagerbestand (Start 1.400) | 980 | 180 | 530 | 430 | 130 | 180 | 580 | 460 |
| Nettobedarf | | | 70 | | 470 | 920 | 20 | |
| Planauftragszugänge | | | 500 | | 500 | 1.000 | 500 | |
| Planauftragsfreigaben | 500 | | 500 | 1.000 | 500 | | | |

Woche 3: 180 − 150 = 30, unter dem Sicherheitsbestand von 100, also beträgt der Nettobedarf 70, und ein Vielfaches von 500 wird bestellt (projizierter Lagerbestand 530). Woche 6: 130 − 950 = −820; um mindestens bei 100 zu enden, beträgt der Nettobedarf 920, aufgerundet auf 1.000.

**Was das Beispiel zeigt**

- **Abhängiger Bedarf ist sprunghaft.** Der Bedarf an Schreibtischen ist recht gleichmäßig (100 bis 150 pro Woche), aber der Rohrbedarf springt zwischen 100 und 950 m pro Woche, weil die Schweißlose von je 200 Gestellen jeweils 800 m auf einmal ziehen. Eine statistische Prognose des Rohrverbrauchs würde diese Spitzen verfehlen; die Stücklistenauflösung nicht.
- **Dispositionsstufen verhindern Fehlmengen.** Wäre S-5 auf Stufe 1 disponiert worden (nur mit dem Bedarf für die Querstrebe von 120 bis 150 m pro Woche), hätte MRP bis Woche 7 keinen Bedarf gesehen, und den Gestellen wäre in Woche 2 das Rohr ausgegangen.
- **Losgrößen multiplizieren sich.** Zwei Losgrößenregeln (200 Gestelle, Vielfache von 500 m) machten aus 740 Schreibtischen 2.500 m Rohrbestellungen in fünf Wochen. Der [Leitfaden Losgröße](https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/) (geplant) erklärt, wie man diese Regeln wählt; der [Leitfaden Bestandsmanagement](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/) (geplant) behandelt den Sicherheitsbestand.
- **Das ERP-Ergebnis ist eine Liste von Maßnahmen:** diese Woche 200 Gestelle freigeben und 500 m Rohr kaufen; nächste Woche 140 Tischplatten freigeben. Der Disponent arbeitet diese als **Ausnahmemeldungen** ab (freigeben, vorziehen, verschieben, stornieren), statt die vollständigen Tabellen zu lesen.

### Pegging und Ausnahmemeldungen

**Pegging** (Bedarfsverfolgung) verknüpft jeden Bedarf mit seiner Quelle: Der Rohrbedarf von 950 m in Woche 6 geht auf die F-10-Freigabe in Woche 6 (800 m) und den D100-Start in Woche 6 (150 m) zurück. Mit Pegging sieht ein Disponent, der in Woche 6 keine 1.000 m Rohr bekommt, welche Schreibtische und welche Kundenaufträge gefährdet sind.

Typische MRP-Ausnahmemeldungen und was zu tun ist:

| Meldung | Bedeutung | Typische Maßnahme |
|---|---|---|
| Auftrag freigeben | der Planauftrag liegt in seinem Freigabefenster | nach Prüfung von Kapazität und Material in einen Fertigungs- oder Bestellauftrag umsetzen |
| Vorziehen (Eilauftrag) | ein offener Auftrag ist später fällig als benötigt | Lieferant oder Werk bitten vorzuziehen; wenn unmöglich, als MPS-Änderung eskalieren |
| Verschieben (nach hinten) | ein offener Auftrag ist früher fällig als benötigt | nach hinten schieben, um Bestand zu senken und Kapazität freizumachen |
| Stornieren | ein offener Auftrag wird nicht mehr benötigt | stornieren oder reduzieren; Stornobedingungen prüfen |
| Überfällig | Freigabe- oder Fälligkeitstermin liegt bereits in der Vergangenheit | der Plan ist so nicht machbar: das MPS korrigieren, nicht nur den Auftrag |
| Unter Sicherheitsbestand | projizierter Lagerbestand unter Sicherheitsniveau | prüfen, ob der Sicherheitsbestand stimmt, bevor man eilt |

Ein Werk mit Hunderten überfälliger Planaufträge nach jedem MRP-Lauf hat kein MRP-Problem. Es hat ein MPS, das nicht machbar ist, oder Wiederbeschaffungszeiten und Losgrößen, die nicht der Realität entsprechen.

### MRP im Vergleich zu Bestellpunktverfahren und Kanban

MRP ist nicht der einzige Weg, Teile nachzuschieben. Bestellpunktverfahren und Kanban füllen auf, wenn der Bestand auf ein Auslöseniveau fällt, und funktionieren gut für Teile mit stabilem, häufigem Bedarf. MRP ist besser bei sprunghaftem abhängigem Bedarf, langen Wiederbeschaffungszeiten, kleinen Mengen und konstruierten Produkten. Viele Werke nutzen beides: Kanban für Verbindungselemente und Schnelldreher an der Linie, MRP für teure Teile mit langer Wiederbeschaffungszeit. Der [Leitfaden Kanban und Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/) (geplant) und der [Leitfaden Lean Management](https://www.m365.fm/learn/lean-management/) erklären die Pull-Seite.

## MRP II, Kapazitätsbedarfsplanung und der geschlossene Regelkreis

**Manufacturing Resource Planning (MRP II)** schließt den Regelkreis um MRP: S&OP und das MPS darüber, Kapazitätsbedarfsplanung (Capacity Requirements Planning, CRP) und Fertigungssteuerung darunter sowie die Verbindung zur Finanzplanung [3][8]. Oliver Wight beschrieb es 1983 [3].

Die **Kapazitätsbedarfsplanung (CRP)** übernimmt alle geplanten und freigegebenen Aufträge aus MRP, wendet die vollständigen Arbeitspläne an (Rüst- und Bearbeitungszeit je Arbeitsgang und Arbeitsplatz) und berechnet die Belastung je Arbeitsplatz und Periode. Sie zeigt Überlastungen, löst sie aber nicht auf: CRP beruht wie MRP auf der Annahme unbegrenzter Kapazität [8]. Wallace Hopp und Mark Spearman argumentieren in *Factory Physics*, das Grundmodell von MRP setze Durchlaufzeiten voraus, die nicht von der Belastung abhängen, was nur bei unbegrenzter Kapazität möglich sei [9]. Der APS-Leitfaden zeigt ein Rechenbeispiel der Überlastung, die MRP nicht sieht, und erklärt das **Durchlaufzeit-Syndrom** (Lead Time Syndrome): Disponenten verlängern die geplanten Durchlaufzeiten, um verspätete Aufträge abzufangen, wodurch Arbeit früher freigegeben wird, der Umlaufbestand (WIP) steigt und die Durchlaufzeiten noch länger werden [26]. Statt diese Abschnitte zu wiederholen, verlinkt dieser Leitfaden darauf: siehe [die Schwächen der klassischen MRP-Logik](https://www.m365.fm/learn/produktionsplanung-aps/).

| Element des geschlossenen Regelkreises | Prüft | Rückkopplung, wenn es nicht passt |
|---|---|---|
| Ressourcenplanung im S&OP | aggregierte Kapazität je Monat | Familienplan ändern, Kapazitätsentscheidung |
| RCCP | Schlüsselressourcen je Woche | MPS ändern |
| CRP | jeden Arbeitsplatz je Tag oder Woche | Überstunden, Ausweicharbeitsplan, MPS ändern |
| Input/Output-Kontrolle und Feinplanung mit begrenzter Kapazität | tatsächliche Warteschlangen und Reihenfolge | umplanen, Freigabe steuern, ins MPS eskalieren |
| Rückmeldung aus der Fertigung (MES) | tatsächliche Fertigmeldungen, Ausschuss, Stillstände | offene Aufträge und Bestand für den nächsten MRP-Lauf aktualisieren |

## MRP-Nervosität: Warum Pläne springen und wie man sie beruhigt

**Nervosität** bedeutet, dass kleine Änderungen im MPS oder im Bestand große oder häufige Änderungen der Planaufträge auf tieferen Stufen auslösen. Gershwins Folien beschreiben sie als kleine Abweichungen, die große Planänderungen verursachen [8]. Ursachen sind das Zusammenspiel von Losgrößenbildung, Vorlaufverschiebung und rollierendem Planungshorizont sowie Rauschen in Bedarf, Versorgung und Bestandsdaten.

### Rechenbeispiel: 30 Schreibtische mehr in Woche 4

Der Vertrieb nimmt einen Zusatzauftrag an: Die Montagestarts von D100 in Woche 4 steigen von 100 auf 130, eine Änderung von 4 % der Menge über acht Wochen (30 von 740). Ein neuer Lauf des obigen Beispiels ergibt:

| Teil | Vorher | Nachher | Änderung |
|---|---|---|---|
| T-20 Tischplatte, Planfreigaben | Wo. 2: 140, Wo. 3: 100, Wo. 5: 150, Wo. 6: 100, Wo. 7: 120 | Wo. 2: 140, Wo. 3: **130**, Wo. 5: 150, Wo. 6: 100, Wo. 7: 120 | Menge +30 |
| F-10 Beingestell, Planfreigaben | Wo. 1, 2, **5**, 6 (je 200) | Wo. 1, 2, **4**, 6 (je 200) | ein Schweißlos um eine Woche vorgezogen |
| S-5 Stahlrohr, Planfreigaben | Wo. 1: 500, **Wo. 3: 500**, Wo. 4: 1.000, Wo. 5: 500 | Wo. 1: 500, **Wo. 2: 500**, Wo. 4: 1.000, Wo. 5: 500 | eine Bestellung um eine Woche vorgezogen, jetzt nächste Woche freizugeben |

Die zusätzlichen 30 Einheiten haben keine Menge bei Rohr oder Gestellen verändert. Sie haben **Termine** auf zwei tieferen Stufen verändert, weil das feste Los von 200 Gestellen jetzt eine Woche früher aufgebraucht ist. In einer echten Stückliste mit Hunderten von Komponenten erzeugen eine Handvoll solcher Änderungen jeden Tag Tausende von Umplanungsmeldungen, und die Disponenten hören auf, dem System zu trauen. Das ist Nervosität.

### Gegenmittel

Joseph Blackburn, Dean Kropp und Robert Millen verglichen in einer 1986 in *Management Science* veröffentlichten Simulationsstudie fünf Strategien zur Dämpfung der Nervosität: Einfrieren des Plans innerhalb des Planungshorizonts, exakte Losgröße unterhalb des Enderzeugnisses, Sicherheitsbestand, Prognose über den Planungshorizont hinaus und ein Verfahren mit Änderungskosten [10]. Bei Nervosität aus rollierendem Horizont und Losgrößenbildung waren Sicherheitsbestand und exakte Losgröße nicht kosteneffizient, während die Strategien mit Änderungskosten und Einfrieren im Allgemeinen am besten abschnitten [10]. Nervosität aus Unsicherheit bei Bedarf, Versorgung oder Wiederbeschaffungszeit deckte die Studie nicht ab [10].

| Gegenmittel | Wie es wirkt | Zielkonflikt |
|---|---|---|
| Eingefrorene Zone und Zeitzäune | keine automatischen Änderungen in der eingefrorenen Zone | weniger Reaktionsfähigkeit auf echte Änderungen |
| Fixierte Planaufträge | der Disponent fixiert ausgewählte Aufträge; MRP verschiebt sie nicht | der Disponent muss sie pflegen |
| Änderungskosten- oder Dämpfungsregeln | MRP schlägt eine Umplanung nur vor, wenn die Terminänderung einen Schwellenwert überschreitet (zum Beispiel 3 Tage) oder sich die Änderung lohnt | kleine Abweichungen bleiben bestehen |
| Exakte Losgröße auf tieferen Stufen | beseitigt das Zusammenspiel der Losgrößen | mehr Rüstvorgänge und Aufträge; Blackburn et al. fanden es bei horizontgetriebener Nervosität nicht kosteneffizient [10] |
| Sicherheitsbestand | fängt kleine Änderungen ab | Bestandskosten; in dieser Studie ebenfalls nicht kosteneffizient [10] |
| Genaue Daten | weniger künstliche Änderungen durch falsche Bestände oder Stücklisten | erfordert permanente Inventur (Cycle Counting) und Disziplin bei technischen Änderungen |
| Entkopplung mit Puffern (DDMRP) | unterbricht die Abhängigkeitskette an ausgewählten Punkten | Pufferbestand, neue Methode zu lernen |

## Demand Driven MRP (DDMRP)

**Demand Driven Material Requirements Planning (DDMRP)** behält die Stücklistenlogik von MRP bei, stoppt aber die Auflösung prognosegetriebener Bedarfe an ausgewählten **Entkopplungspunkten** und setzt dort dimensionierte, aktiv gesteuerte Puffer. Versorgungsaufträge werden aus dem tatsächlichen Bedarf und dem Pufferstatus erzeugt statt allein aus der Prognose. Die Methode stammt von den Beratern Carol Ptak und Chad Smith: Ihre Überarbeitung von Orlickys Buch aus dem Jahr 2011, *Orlicky's Material Requirements Planning, Third Edition*, ergänzt unter dem Namen DDMRP Anleitungen zur Planung aus tatsächlichen Kundenaufträgen statt aus Prognosen [4]. TechTarget merkt an, dass manche Praktiker den Ansatz für umstritten halten [4]. Ptak und Smith gründeten 2011 außerdem das Demand Driven Institute; es prüft und zertifiziert Software auf DDMRP-Konformität, für die Anbieter kostenlos, und vergibt Zertifikate an Einzelpersonen [35].

### Die fünf Komponenten

Die Microsoft-Dokumentation zu Dynamics 365 Supply Chain Management nennt die fünf Komponenten von DDMRP [11]:

1. **Strategische Bestandspositionierung:** Entkopplungspunkte in der Supply Chain bestimmen, an denen ein Bestandspuffer gehalten, überwacht und aufgefüllt wird.
2. **Pufferprofile und Pufferniveaus:** jeden Puffer dimensionieren (Minimum, Maximum, Bestellpunkt) und die Nachbestellmenge festlegen.
3. **Dynamische Pufferanpassung:** Pufferniveaus an veränderte Betriebsparameter oder geplante Ereignisse anpassen.
4. **Bedarfsgetriebene Planung:** Versorgungsaufträge (Fertigung, Einkauf, Umlagerung) nach Bedarf erzeugen.
5. **Stark kollaborative und sichtbare Ausführung:** Versorgungsaufträge mit visueller Priorität abarbeiten, typischerweise nach Pufferfarbe.

### Pufferdimensionierung: Rechenbeispiel

Jeder Puffer hat drei Zonen, berechnet aus dem durchschnittlichen Tagesverbrauch (Average Daily Usage, ADU), der entkoppelten Wiederbeschaffungszeit (Decoupled Lead Time, DLT), einem Wiederbeschaffungszeitfaktor und einem Variabilitätsfaktor, wie von Microsoft dokumentiert [12]:

| Zone | Formel [12] |
|---|---|
| Gelb | ADU × DLT |
| Rot-Basis | ADU × DLT × Wiederbeschaffungszeitfaktor |
| Rot-Sicherheit | Rot-Basis × Variabilitätsfaktor |
| Rot | Rot-Basis + Rot-Sicherheit |
| Grün | das Größte aus: Mindestbestellmenge; ADU × Bestellzyklus; ADU × DLT × Wiederbeschaffungszeitfaktor |

Microsoft empfiehlt Wiederbeschaffungszeitfaktoren von 0,20–0,40 für lange, 0,41–0,60 für mittlere und 0,61–1,00 für kurze Wiederbeschaffungszeiten sowie Variabilitätsfaktoren von 0,20–0,40 für niedrige, 0,41–0,60 für mittlere und 0,61–1,00 für hohe Variabilität [12]. Die **entkoppelte Wiederbeschaffungszeit** ist die Zeit, die nötig ist, um ein Teil zu fertigen oder zu erhalten, wenn die vorgelagerten Entkopplungspunkte Bestand haben; sie ist meist deutlich kürzer als die kumulierte Wiederbeschaffungszeit [12].

**Beispiel (Beispielzahlen).** Ein Kaufteil, Halter B-7: ADU 40 Stück, entkoppelte Wiederbeschaffungszeit 10 Tage, Wiederbeschaffungszeitfaktor 0,5 (mittel), Variabilitätsfaktor 0,5 (mittel), Mindestbestellmenge 300, Bestellzyklus 7 Tage.

| Zone | Berechnung | Größe | Kumuliert (Obergrenze der Zone) |
|---|---|---|---|
| Rot-Basis | 40 × 10 × 0,5 | 200 | |
| Rot-Sicherheit | 200 × 0,5 | 100 | |
| Rot | 200 + 100 | 300 | 300 |
| Gelb | 40 × 10 | 400 | 700 |
| Grün | max(300; 40 × 7 = 280; 200) | 300 | 1.000 |

### Die Net-Flow-Gleichung

DDMRP entscheidet über den Nachschub mit der **Net-Flow-Position**: Lagerbestand + Bestellbestand − qualifizierter Kundenauftragsbedarf [14]. Der qualifizierte Bedarf umfasst typischerweise heute fällige Aufträge, überfällige Aufträge und qualifizierte Bedarfsspitzen innerhalb eines festgelegten Horizonts. Fällt die Net-Flow-Position unter die Obergrenze von Gelb, wird ein Versorgungsauftrag erzeugt, der sie wieder auf die Obergrenze von Grün bringt [14].

Fortsetzung des Beispiels: Lagerbestand 350, Bestellbestand 400, qualifizierter Bedarf 90. Net-Flow-Position = 350 + 400 − 90 = **660**. Das liegt unter der Obergrenze von Gelb (700), also schlägt DDMRP eine Bestellung über 1.000 − 660 = **340** Stück vor. Die Bestellung übersteigt die Mindestbestellmenge von 300 und bleibt damit bestehen. Die Ausführungspriorität richtet sich dann nach dem Lagerbestand: Ein Lagerbestand von 350 liegt knapp über der Obergrenze von Rot (300), was ein Disponent als dringend behandeln würde.

### Wann DDMRP passt und wann nicht

| Situation | Eignung von DDMRP | Grund |
|---|---|---|
| Lange kumulierte Wiederbeschaffungszeiten, Kunden erwarten kurze Lieferzeiten | gut | die Entkopplung verkürzt die Lieferzeit, die der Kunde sieht |
| Viele gemeinsame Komponenten, hohe Variabilität, häufige MRP-Nervosität | gut | Puffer fangen Variabilität ab, statt sie durch die Stückliste weiterzugeben |
| Stabiler, prognostizierbarer Bedarf, flache Stücklisten | begrenzt | klassisches MRP oder Kanban ist vielleicht einfacher |
| Einmalige Engineer-to-Order-Projekte | begrenzt | wenige wiederkehrende Teile zum Puffern; Projektplanung dominiert |
| Schwache Bestandsgenauigkeit und Stammdaten | schlecht | Puffer, die auf falschem ADU oder falschen Wiederbeschaffungszeiten beruhen, schützen die falschen Teile |

DDMRP ist kein Ersatz für S&OP. Pufferrichtlinien, Kapazität und Bestandsinvestitionen brauchen weiterhin eine monatliche bereichsübergreifende Entscheidung, und das ERP braucht weiterhin das MPS für Enderzeugnisse, die nicht gepuffert sind. In Dynamics 365 ist DDMRP Teil des Moduls für die Produktprogrammplanung (Master Planning), nutzt einen eigenen Deckungsschlüssel, kommt ohne zusätzliche Lizenzgebühren und erfordert das Add-in Planning Optimization; Microsoft betont, dass es bestehende Planungsfunktionen nicht ersetzt [11]. SAP nennt DDMRP unter den Themen seines MRP-Materials [27], und IFS dokumentiert DDMRP in IFS Cloud [14]. Unabhängige, begutachtete Belege zu DDMRP-Ergebnissen sind noch dünner als das Fallmaterial von Anbietern und Beratungen; Verbesserungsprozente von DDMRP-Anbietern als Herstelleraussagen behandeln.

## Produktionsplanung im ERP: Was die Systeme können und wo sie aufhören

Fast jedes ERP für die Fertigung enthält ein MPS und eine MRP-Maschine. S&OP wird auf drei Arten abgebildet: im ERP selbst, in einer eigenen S&OP- oder IBP-Plattform, die an das ERP angebunden ist, oder in Tabellenkalkulationen rund um das ERP.

### Typische Planungsfunktionen im ERP

| Funktion | Worauf zu achten ist |
|---|---|
| Bedarfsmanagement und Prognose | statistische Modelle, Prognoseverrechnung mit Aufträgen, Prognose auf Familien- und Artikelebene |
| MPS | Zeitzäune, fixierte Planaufträge, Planungsstücklisten für Optionen, ATP und kumuliertes ATP [7] |
| RCCP | Ressourcenstücklisten für Schlüsselressourcen, Berichte Belastung gegen Kapazität |
| MRP | Net-Change- und Neuaufwurf-Läufe, Dispositionsstufen, Losgrößenverfahren, Pegging, Ausnahmemeldungen |
| CRP | Belastung je Arbeitsplatz aus den Arbeitsplänen |
| DDMRP | Entkopplungspunkte, Pufferprofile, Net Flow (wo unterstützt) [11] |
| Integration | zu S&OP-Werkzeug, APS, MES, Lieferantenportalen, BI |

### Optionen am Markt (Beispiele, keine Rangfolge)

| Kategorie | Für diesen Leitfaden geprüfte Beispiele | Hinweise |
|---|---|---|
| ERP mit MPS/MRP | Oracle JD Edwards EnterpriseOne (MPS, MRP, ATP) [7]; Microsoft Dynamics 365 Supply Chain Management (Produktprogrammplanung mit Planning Optimization, DDMRP) [11]; SAP S/4HANA (MRP; das SAP-Material behandelt Predictive MRP und DDMRP) [27]; IFS Cloud (DDMRP) [14] | viele weitere ERP-Anbieter bieten MRP; die Planungstiefe in einer Demo mit festem Drehbuch prüfen |
| S&OP und IBP nah am ERP | SAP Integrated Business Planning [5]; Oracle Fusion Cloud Sales and Operations Planning [33] | am stärksten, wenn das ERP vom selben Anbieter stammt |
| Eigenständige S&OP-/IBP-Plattformen | Kinaxis, o9 Solutions, Blue Yonder, ToolsGroup, Board, Anaplan (Anbieterliste laut Käuferleitfaden 2026 von Board, verfasst von einem der Anbieter) [29][15] | Anbieter-Rankings von Anbietern sind nicht unabhängig; Analystenberichte mit offengelegter Methodik nutzen |
| Tabellenkalkulation | Excel mit ERP-Auszügen; Power BI für das Kennzahlenreporting | ausreichend für einen ersten S&OP-Zyklus mit wenigen Familien; bei größerem Umfang fragil |

Für Microsoft-orientierte Unternehmen ist eine praktische Aufstellung: MPS und MRP im ERP fahren, S&OP in Excel oder einem Planungswerkzeug vorbereiten und Kennzahlenpaket und Entscheidungsprotokoll über Power BI und Teams veröffentlichen. Microsoft positioniert Dynamics 365, Microsoft 365 und Azure gemeinsam als "Microsoft for Manufacturing" [31], und Dataverse-Daten lassen sich ohne eigene ETL-Pipeline in Microsoft Fabric bereitstellen [32]. Der [Leitfaden Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/) behandelt die Architektur.

### Wie das ERP MRP rechnet

Die meisten ERP-Systeme bieten zwei Laufarten: einen **Neuaufwurf** (regenerativer Lauf), der alle Teile von Grund auf neu berechnet, oft nächtlich oder wöchentlich, und einen **Net-Change-Lauf** (Veränderungsplanung), der nur Teile neu berechnet, deren Bedarf, Versorgung oder Stammdaten sich geändert haben. In beiden Fällen ist der Plan nur so aktuell wie die Daten, die der Lauf sieht: Bucht das MES Fertigmeldungen und Ausschuss einmal pro Schicht, läuft MRP aber um 2 Uhr nachts, spiegelt die morgendliche Ausnahmeliste die Fertigung von gestern. Den Zeitpunkt des MRP-Laufs auf den Buchungszyklus von MES und Bestand abstimmen und das MPS während des Laufs stabil halten, damit Disponenten und System nicht gegeneinander arbeiten. Der [Leitfaden MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant) behandelt den Datenaustausch zwischen Ebene 3 und Ebene 4.

### Wo die ERP-Planung aufhört

- **Begrenzte Kapazität.** MRP und CRP im ERP planen gegen unbegrenzte Kapazität [8]. Wo ein Engpass über die Liefertermine entscheidet, braucht es eine Feinplanung mit begrenzter Kapazität oder ein APS; siehe den [Leitfaden Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/).
- **Szenarien.** Drei Versorgungsoptionen mit vollständigen Material- und Kapazitätswirkungen zu vergleichen, ist in den meisten MRP-Läufen im ERP langsam. Planungsplattformen werben mit schneller Neuberechnung von Szenarien; Kinaxis zum Beispiel beschreibt eine gleichzeitige Planung (Concurrent Planning), die Zyklen von Wochen auf Stunden verkürzt (Herstelleraussage) [16].
- **Reaktion auf Störungen.** In einer von Kinaxis beauftragten IDC-Umfrage (1.800 Befragte in neun Ländern, durchgeführt im Dezember 2023) konnten 83 % der Lieferketten nicht innerhalb von 24 Stunden auf Störungen reagieren (vom Anbieter beauftragte Studie) [30].
- **Ausführung.** Arbeitsverteilung, Rückmeldungen und Umlaufbestand in Echtzeit gehören ins MES (ISA-95 Ebene 3) [25].

### Auswahl-Checkliste für S&OP- und Planungssoftware

| Frage | Warum sie wichtig ist |
|---|---|
| Kann es Familienpläne automatisch mit dem MPS auf Artikelebene abgleichen? | der häufigste manuelle Aufwand im S&OP |
| Zeigt es Pläne in Stück und Dollar nebeneinander? | das Controlling muss im Prozess sein |
| Wie lange dauert die Berechnung eines vollständigen Szenarios (Bedarfsänderung + Kapazität + Material)? | entscheidet, ob Szenarien in Besprechungen genutzt werden |
| Welche ERP-Integrationen sind Standard, und wer pflegt sie? | die Integration kostet oft mehr als die Lizenzen |
| Können Disponenten Stammdaten (Wiederbeschaffungszeiten, Losgrößen) mit Änderungsprotokoll ändern? | Datenqualität ist der wichtigste Treiber der Planqualität |
| Wird der Forecast Value Added (manuelle Übersteuerung gegen statistische Prognose) gemessen? | zeigt, ob Konsensanpassungen helfen |
| Wie lange dauert es realistisch bis zum ersten produktiven S&OP-Zyklus? | Anaplan zum Beispiel rät, innerhalb von 8–12 Wochen nachweisbaren Nutzen zu erwarten (Herstellerempfehlung) [15] |
| Gesamtkosten über 5 Jahre inkl. internem Personal | Lizenzgebühren sind meist der kleinere Teil [unbelegt: keine unabhängige Kostenstudie geprüft] |

## Vorlagen: S&OP-Kalender, Agenden, Familienplan, MPS- und MRP-Datensatz

Die folgenden Tabellen lassen sich als Ausgangspunkt in Excel oder eine SharePoint-Liste kopieren. Die Agenden für Demand Review, Supply Review und Executive-Meeting stehen in Abschnitt 4.

### Vorlage 1: Produktfamilienplan (ein Blatt je Familie, Lagerfertigung)

| Zeile | Ist M-1 | M1 | M2 | M3 | M4–M6 (Quartal) | M7–M12 (Halbjahr) | M13–M18 | Hinweise |
|---|---|---|---|---|---|---|---|---|
| Budget / Finanzplan (Stück) | | | | | | | | aus dem Controlling |
| Statistische Prognose (Stück) | | | | | | | | Modell, Version |
| Konsens-Bedarfsplan (Stück) | | | | | | | | verantwortlich: Vertriebsleitung |
| Konsens des Vormonats (Stück) | | | | | | | | Änderung sichtbar |
| Versorgungsplan (Stück) | | | | | | | | verantwortlich: Produktionsleitung |
| Endbestand (Stück) | | | | | | | | |
| Bestandsziel (Stück oder Reichweite in Tagen) | | | | | | | | Richtlinie |
| Belastung Schlüsselressource (% der Kapazität) | | | | | | | | z. B. Schweißen |
| Umsatz zu Standardpreis (USD) | | | | | | | | Controlling |
| Herstellkosten zu Standardkosten (USD) | | | | | | | | Controlling |
| Annahmen und Risiken | | | | | | | | Verweis auf Protokoll |

Bei Familien mit Auftragsfertigung die Bestandszeilen durch **Auftragsrückstand** und **Ziel-Auftragsrückstand (Wochen)** ersetzen. Auftragsrückstand am Ende = Auftragsrückstand am Anfang + Auftragseingang − Lieferungen.

### Vorlage 2: Annahmenprotokoll

| ID | Familie | Annahme | Verantwortlich | Erfasst am | Wirkung, falls falsch (Stück, USD) | Status / Prüftermin |
|---|---|---|---|---|---|---|
| A-031 | Schreibtische | Preiserhöhung des Wettbewerbers im April bleibt bestehen | Vertriebsleitung | 6. Jan. | −400 Stück/Monat | Prüfung 3. Feb. |
| A-032 | Schreibtische | Schweiß-Unterlieferant bis März qualifiziert | Supply Chain | 8. Jan. | −300 Stück im April | in Arbeit |

### Vorlage 3: Entscheidungsprotokoll

| ID | Besprechung / Datum | Entscheidung | Geprüfte Optionen | Verantwortlich | Fällig | Wirkung auf den Plan | Status |
|---|---|---|---|---|---|---|---|
| D-014 | Executive-S&OP, 15. Jan. | Hybrid-Plan übernehmen, Raten 3.500 / 4.000 / 3.000 | Level, Chase, Hybrid | Produktionsleitung | 31. Jan. | +2.000 Einheiten Ratenänderung, 35.200 USD | offen |
| D-015 | Executive-S&OP, 15. Jan. | Schweiß-Unterlieferant für 200–400 Stück/Monat qualifizieren | keine / qualifizieren / dritte Schicht | Supply Chain | 1. März | Risikominderung für März–Mai | offen |

### Vorlage 4: MPS-Datensatz

| Artikel | Woche | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| | Prognose | | | | |
| | Kundenaufträge | | | | |
| | Projizierter Bedarf (Regel je Zeitzaun) | | | | |
| | MPS (fixiert / geplant) | | | | |
| | Projizierter verfügbarer Bestand | | | | |
| | ATP / kumuliertes ATP | | | | |
| | Zeitzaun-Zone | eingefroren | eingefroren | teilflexibel | flexibel |

### Vorlage 5: MRP-Datensatz (je Teil)

| Teil, Dispositionsstufe, Wiederbeschaffungszeit, Losgrößenregel, Sicherheitsbestand, Lagerbestand | Woche | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| | Bruttobedarf | | | | |
| | Geplante Zugänge | | | | |
| | Projizierter Lagerbestand | | | | |
| | Nettobedarf | | | | |
| | Planauftragszugänge | | | | |
| | Planauftragsfreigaben | | | | |

### Vorlage 6: S&OP-Bereitschaftscheckliste vor dem ersten Zyklus

| Punkt | Bereit, wenn |
|---|---|
| Produktfamilien festgelegt | 5–15 Familien je Geschäftsbereich, jeweils mit ähnlichen Ressourcen und Bedarfstreibern |
| Schlüsselressourcen festgelegt | 3–8 Ressourcen, die den Ausstoß begrenzen, mit nachgewiesener Kapazität je Monat |
| Ressourcenstückliste | Stunden je Einheit je Schlüsselressource, je Familie |
| Datenquellen | Lieferungen, Aufträge, Bestand, Produktion je Familie an Arbeitstag 1–2 verfügbar |
| Bestands- oder Rückstandsrichtlinie | Ziel je Familie vom Controlling genehmigt |
| Kalender | 12 Monate mit Terminen für alle fünf Schritte gebucht |
| Entscheidungsbefugnisse | schriftliche Schwellenwerte für Supply Review, Pre-S&OP und Executive-Meeting |
| Executive Sponsor | benannt, nimmt an den ersten drei Zyklen persönlich teil |

## S&OP- und MRP-Kennzahlen mit Rechenbeispielen

Ein gutes S&OP-Kennzahlenpaket ist kurz: etwa zehn Kennzahlen, jede mit Definition, Verantwortlichem und Ziel. Der [Leitfaden Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/) behandelt Kennzahlen auf Werksebene wie OEE und Liefertreue; dieser Abschnitt behandelt Planungskennzahlen.

### Prognosegenauigkeit, Bias und MAPE: ein Datensatz, fünf Kennzahlen

**Daten (Beispiel).** Monatsprognose (F, einen Monat vorher erstellt) und tatsächlicher Bedarf (A) für die Schreibtischfamilie:

| Monat | Prognose F | Ist A | Fehler e = F − A | Absoluter Fehler \|e\| | Absoluter prozentualer Fehler \|e\| / A |
|---|---|---|---|---|---|
| Jan. | 3.000 | 2.850 | +150 | 150 | 5,26 % |
| Feb. | 3.200 | 3.350 | −150 | 150 | 4,48 % |
| März | 4.200 | 3.900 | +300 | 300 | 7,69 % |
| Apr. | 4.800 | 5.100 | −300 | 300 | 5,88 % |
| Mai | 4.000 | 3.700 | +300 | 300 | 8,11 % |
| Juni | 2.800 | 2.650 | +150 | 150 | 5,66 % |
| **Summe** | **22.000** | **21.550** | **+450** | **1.350** | **37,08 %** |

| Kennzahl | Formel | Berechnung | Ergebnis |
|---|---|---|---|
| MAPE (mittlerer absoluter prozentualer Fehler) | Mittelwert von \|e\| / A | 37,08 % / 6 | **6,18 %** |
| WMAPE (gewichteter MAPE) | Σ\|e\| / ΣA | 1.350 / 21.550 | **6,26 %** |
| Prognosegenauigkeit | 1 − WMAPE | 1 − 0,0626 | **93,7 %** |
| Bias (systematische Abweichung) | Σe / ΣA | +450 / 21.550 | **+2,1 % (Überprognose)** |
| MAD (mittlere absolute Abweichung) | Σ\|e\| / n | 1.350 / 6 | **225 Stück** |
| Tracking Signal (Warnsignal) | Σe / MAD | 450 / 225 | **+2,0** |

So liest man das:

- **Genauigkeit und Bias beantworten unterschiedliche Fragen.** 93,7 % Genauigkeit klingt gut. Aber vier von sechs Monaten waren überprognostiziert, und der kumulierte Fehler beträgt +450 Stück. Folgt die Versorgung der Prognose, wächst der Bestand in sechs Monaten um etwa 450 Stück. Der Bias ist die Kennzahl, die systematischen Optimismus oder systematisches Tiefstapeln (Sandbagging) zeigt.
- **MAPE oder WMAPE.** MAPE gewichtet jeden Monat gleich; WMAPE gewichtet nach Menge. Auf Artikelebene explodiert MAPE bei kleinen Artikeln: Ein Artikel mit Prognose 10 und Ist 2 hat einen Fehler von 400 %. Für das Reporting auf Artikelebene WMAPE (oder MAD/Mittelwert) verwenden und MAPE für stabile Reihen mit großen Mengen behalten.
- **Tracking Signal.** Der kumulierte Fehler geteilt durch die MAD. Ein Wert, der sich stetig von null entfernt, zeigt Bias an; eine verbreitete Faustregel betrachtet das Modell als korrekt arbeitend, solange das Tracking Signal zwischen −4 und +4 bleibt [36].
- **Aggregation versteckt Fehler.** Zwei Artikel mit Prognosen von je 1.000 und Istwerten von 1.200 und 800 ergeben einen Familienfehler von 0, aber einen WMAPE auf Artikelebene von 400 / 2.000 = 20 %. Genauigkeit auf der Ebene berichten, auf der entschieden wird: Familie für S&OP, Artikel und Standort für MPS und Nachschub.
- **Der Prognosevorlauf (Lag) zählt.** Die Prognose messen, die zur maßgeblichen Wiederbeschaffungszeit eingefroren war (zum Beispiel die drei Monate vorher erstellte Prognose für ein Teil mit drei Monaten Wiederbeschaffungszeit), nicht die Aktualisierung in letzter Minute.

### Forecast Value Added

Der Forecast Value Added (FVA) vergleicht den Fehler jedes Schritts im Prognoseprozess mit dem vorherigen Schritt. Hatte die statistische Prognose einen WMAPE von 7,5 % und hat die Konsensprognose nach den Anpassungen des Vertriebs 6,3 %, hat der Konsensprozess 1,2 Prozentpunkte Genauigkeit hinzugefügt. Hätte sie 8,5 %, hätte die Besprechung die Prognose verschlechtert. Der FVA macht das Demand Review von einem Meinungswettbewerb zu einem gemessenen Prozess.

### Kennzahlensatz für S&OP und MRP

| Kennzahl | Definition | Beispielziel (Beispiel) | Verantwortlich |
|---|---|---|---|
| Prognosegenauigkeit (1 − WMAPE), Familie, Lag 1–3 | siehe oben | ≥ 90 % | Bedarfsplaner |
| Prognose-Bias, Familie | Σ(F − A) / ΣA über 3–6 Monate | innerhalb ±3 % | Vertriebsleitung |
| Erfüllung des Versorgungsplans | tatsächliche Produktion / geplante Produktion je Familie und Monat | 95–105 % | Produktionsleitung |
| MPS-Treue | in der geplanten Woche erledigte MPS-Positionen / alle MPS-Positionen | ≥ 95 % | Programmplaner |
| Planstabilität | MPS-Änderungen in der eingefrorenen Zone je Woche | Trend fallend | Programmplaner |
| Kundenservice | On Time In Full (OTIF) oder Lieferbereitschaftsgrad je Familie | je Segment | Vertriebsleitung / Supply Chain |
| Bestand gegen Ziel | Endbestand / Ziel oder Reichweite in Tagen | 90–110 % | Supply Chain |
| Bestandsgenauigkeit | Artikel innerhalb der Zähltoleranz / gezählte Artikel | hohe 90er | Lager |
| Stücklistengenauigkeit | als korrekt verifizierte Stücklisten / geprüfte Stücklisten | hohe 90er | Entwicklung |
| MRP-Ausnahmelast | Ausnahmemeldungen je Disponent und Woche | Trend fallend | Leitung Materialwirtschaft |
| Überfällige Planaufträge | Anzahl nach jedem MRP-Lauf | nahe null | Leitung Materialwirtschaft |
| Abschluss des Entscheidungsprotokolls | termingerecht abgeschlossene Entscheidungen / fällige Entscheidungen | ≥ 90 % | S&OP-Prozesseigner |

Manche MRP-Leitfäden zitieren "Class A"-Benchmarks von Oliver Wight wie 95 % Bestandsgenauigkeit und 98 % Stücklistengenauigkeit [28]. Dieselben Schwellen finden sich in der Literatur zur Programmplanung: Bestandsgenauigkeit von 95 % als Schwelle der Akzeptanz (98 % robust) und Stücklistengenauigkeit von mindestens 98 % (99+ % gut) [37]. Die aktuelle Checkliste von Oliver Wight selbst war für diesen Leitfaden nicht zugänglich, daher bleibt die Zuordnung zu Oliver Wight [unbelegt]. Eigene Ziele aus einem gemessenen Ausgangswert ableiten.

### Finanzsicht: Was S&OP für das Working Capital tut

Das Controlling stellt meist zwei Fragen: Wie viel Bestand trägt der Plan, und was kostet er? Mit dem Hybrid-Plan aus Abschnitt 5 beträgt der durchschnittliche Monatsendbestand 6.300 / 6 = 1.050 Schreibtische. Bei Standardkosten von 180 USD je Schreibtisch (Beispiel) sind das im Durchschnitt 189.000 USD gebundenes Kapital. Der Level-Plan trägt 8.600 / 6 = 1.433 Schreibtische, also 258.000 USD. Bei einem Lagerhaltungskostensatz von 20 % pro Jahr (Beispiel; den eigenen Satz des Unternehmens verwenden) kostet der Unterschied von 69.000 USD im Durchschnittsbestand etwa 13.800 USD pro Jahr. Diese Zahlen gehören in die Entscheidungsvorlage des Pre-S&OP, neben die Wirkungen auf Service und Kapazität.

## Einführungsfahrplan: in 12 Monaten zu funktionierendem S&OP und MRP

| Phase | Monate | Hauptaktivitäten | Abschlusskriterien |
|---|---|---|---|
| 0. Bewerten | 0–1 | Reifegrad-Selbsteinschätzung (Abschnitt 7), Bestandsaufnahme der Daten, Interviews, Zusage des Sponsors | Sponsor benannt, Umfang vereinbart, Ausgangskennzahlen gemessen |
| 1. Gestalten | 1–2 | Produktfamilien, Schlüsselressourcen, Ressourcenstückliste, Kalender, Entscheidungsbefugnisse, Kennzahldefinitionen, Vorlagen | Gestaltungsdokument vom Sponsor freigegeben |
| 2. Datenbasis | 1–4 (parallel) | Bestandsgenauigkeit (permanente Inventur), Stücklistenaudit inkl. Gültigkeit technischer Änderungen, Überprüfung der Wiederbeschaffungszeiten, MPS-Regeln und Zeitzäune im ERP | Bestands- und Stücklistengenauigkeit gemessen und steigend; Wiederbeschaffungszeiten für die obersten 80 % des Werts überprüft |
| 3. Erste Zyklen | 3–5 | den Fünf-Schritte-Zyklus mit Tabellenkalkulation fahren; drei Zyklen in Folge mit Teilnahme der Führung | drei Zyklen termingerecht abgeschlossen, Entscheidungsprotokoll in Gebrauch |
| 4. An MPS und MRP anbinden | 4–7 | Disaggregationsregeln, MPS mit S&OP abgeglichen, RCCP an Schlüsselressourcen, Disziplin bei MRP-Ausnahmen | MPS innerhalb der Toleranz zum S&OP; überfällige Planaufträge sinken |
| 5. Messen und verbessern | 6–9 | Prognosegenauigkeit und Bias, FVA, Planerfüllung; Ursachen der Abweichungen; Regeln gegen Nervosität | Kennzahlen monatlich berichtet; mindestens eine Prozessänderung aus FVA-Ergebnissen |
| 6. Erweitern | 9–12 | Integration der Finanzen (Richtung IBP), Szenarien, wöchentliches S&OE-Meeting, Werkzeugbewertung, wenn die Tabellenkalkulation den Prozess begrenzt | Plan in Stück und Dollar; S&OE läuft; Werkzeugentscheidung auf Basis von Belegen getroffen |

**Praktische Hinweise**

- **Mit Tabellenkalkulation beginnen.** Ein Werkzeug kann keinen Prozess reparieren, den es noch nicht gibt. Die meisten Unternehmen lernen erst nach drei bis sechs Zyklen, was sie von einer Software brauchen.
- **Einen Geschäftsbereich oder ein Werk pilotieren.** S&OP über fünf Werke und zwanzig Familien ab dem ersten Tag überlebt selten den zweiten Monat.
- **Die Datenarbeit läuft parallel.** S&OP-Entscheidungen sind nur so gut wie MPS und MRP darunter; Bestands- und Stücklistengenauigkeit entscheiden, ob man dem MRP-Ergebnis trauen kann.
- **Qualitäts- und Konfigurationsmanagement.** In regulierten oder zertifizierten Umfeldern (Luftfahrt, Automobil, Medizintechnik) sind Stücklistenänderungen auch eine Angelegenheit des QM-Systems: Eine technische Änderung muss mit dem richtigen Gültigkeitsdatum in die MRP-Stückliste gelangen, sonst bestellt MRP Teile für einen überholten Änderungsstand. Die Qualitätsleitung in das Stücklistenaudit einbinden; der [Leitfaden Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/) behandelt das Konfigurationsmanagement.
- **Veränderungsmanagement.** Vertriebsteams fürchten, an einer Prognose festgenagelt zu werden; Werke fürchten, für Kapazität verantwortlich gemacht zu werden, die sie nie hatten. Bias sichtbar machen, ohne Personen zu beschuldigen, und früh getroffene Entscheidungen würdigen.
- **Schulung.** Disponenten und Programmplaner profitieren von strukturierter Schulung in den Grundlagen der PPS; das ASCM-Programm CPIM ist in den USA der gängige Nachweis [24].

## Häufige Fehler

| Fehler | Symptom | Abhilfe |
|---|---|---|
| S&OP als Berichtsrunde | 40 Folien, keine Entscheidungen | Entscheidungsvorlagen mit Optionen; Entscheidungsprotokoll |
| Die Führung bleibt der Besprechung fern | Vertreter können nicht entscheiden; Themen werden weitergeschoben | Teilnahme des Sponsors als Regel; kürzere, entscheidungsorientierte Agenda |
| Prognose = Vertriebsziel | systematische Überprognose, steigender Bestand | Ziel und Prognose trennen; Bias messen |
| S&OP auf Artikelebene | Hunderte Zeilen, keine Zeit für Entscheidungen | Familien für S&OP, Artikel für das MPS |
| Kein Controlling im Raum | der Plan in Stück passt nicht zum Budget | Controller im Pre-S&OP; Plan in Stück und Dollar |
| MPS nicht mit S&OP abgeglichen | die Fertigung folgt einem anderen Plan | Disaggregationsregel und Toleranzprüfung jeden Monat |
| Überlastetes MPS | überfällige Aufträge nach jedem MRP-Lauf | RCCP an Schlüsselressourcen; MPS zur nachgewiesenen Kapazität |
| Geplante Durchlaufzeiten nie überprüft | zu frühe oder zu späte Freigaben, aufgeblähter Umlaufbestand | vierteljährliche Überprüfung der Durchlaufzeiten; siehe Durchlaufzeit-Syndrom [26] |
| Falsche Bestands- und Stücklistendaten | Eilaktionen, Fehlmengen trotz "verfügbarem" Bestand | permanente Inventur, Stücklistenaudits, Prozess für technische Änderungen |
| Auf jede Ausnahmemeldung reagieren | Nervosität, ausgebrannte Disponenten | Zeitzäune, fixierte Planaufträge, Dämpfungsschwellen [10] |
| Zuerst Software kaufen | teures Werkzeug, dieselben Streitereien | zuerst drei bis sechs manuelle Zyklen |
| Den Engpass ignorieren | Plan im Durchschnitt machbar, in Spitzenmonaten nicht | Belastung der Schlüsselressourcen in jedem Supply Review; siehe [Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant) |

## Grenzen von S&OP und MRP

**S&OP ist ein Monatsprozess in einer Welt, die sich wöchentlich ändert.** Ein am 15. genehmigter Plan kann am 25. veraltet sein. S&OE und ereignisgesteuerte S&OP-Aktualisierungen gehen das an, brauchen aber Disziplin, damit nicht jede Woche alles neu geplant wird.

**Aggregation versteckt Probleme.** Ein Familienplan kann machbar sein, während einer bestimmten Variante eine bestimmte Komponente fehlt. Deshalb sind MPS und MRP unter dem S&OP wichtig, und deshalb sollten Familiendefinitionen Artikel gruppieren, die sich Ressourcen teilen.

**MRP ist deterministisch, die Realität nicht.** MRP behandelt Prognosen, Wiederbeschaffungszeiten und Ausbeuten als feste Zahlen [8]. Sicherheitsbestand und Sicherheitszeit decken einen Teil der Schwankung ab, aber MRP kann Unsicherheit nicht explizit abbilden. DDMRP, stochastische Modelle und Simulation (siehe [Simulation in der Produktion](https://www.m365.fm/learn/digital-twin/simulation-produktion/), geplant) gehen das aus verschiedenen Richtungen an.

**MRP plant gegen unbegrenzte Kapazität.** MRP und CRP zeigen Überlastungen, lösen sie aber nicht auf [8][9]. Feinplanung mit begrenzter Kapazität und APS schließen diese Lücke auf operativer Ebene.

**MRP setzt Durchlaufzeiten fest, die tatsächlich von der Belastung abhängen.** Geplante Durchlaufzeiten sind Eingaben für MRP, aber Ergebnisse der Werkstattbelastung. Das Durchlaufzeit-Syndrom zeigt, was passiert, wenn Disponenten sie als Stellhebel behandeln [26].

**Datenabhängigkeit.** MRP verstärkt Datenfehler: Eine falsche Menge je Einheit in einer Stückliste auf Stufe 2 multipliziert sich durch jedes übergeordnete Teil. Kein Algorithmus gleicht falsche Bestandsdaten aus.

**Kultur.** Die wissenschaftliche Literatur nennt organisatorische Hürden wie Abteilungssilos und fehlendes Engagement der Führung unter den Hauptgründen, warum S&OP-Initiativen ins Stocken geraten [1]. Software beseitigt sie nicht.

**Nicht jedes Unternehmen braucht den vollen Stapel.** Ein Werkstattfertiger mit kurzen Durchlaufzeiten und überwiegend kundenspezifischen Aufträgen braucht vielleicht eher eine gute Auftragsannahme und Feinplanung mit begrenzter Kapazität als ein S&OP über 24 Monate. Ein Händler braucht vielleicht eher DRP (Distribution Requirements Planning) als MRP. Die Methode an das Geschäft anpassen.

## KI und digitale Planung: Was heute funktioniert

Anbieter von Planungssoftware und ERP vermarkten inzwischen Prognosen mit maschinellem Lernen, "Demand Sensing", Planungsagenten und Copilots. Für ein Werk lauten die nützlichen Fragen: Welche Planungsentscheidung wird besser, und wie wird die Verbesserung gemessen?

| Anwendung | Was sie tut | Wo sie hilft | Was zu prüfen ist |
|---|---|---|---|
| Prognose mit maschinellem Lernen | nutzt viele Treiber (Preis, Aktionen, Wetter, Aufträge) über die Historie hinaus | viele Artikel mit bekannten Bedarfstreibern | FVA gegen eine einfache statistische Basis messen; ML schlägt sie oft für manche Familien und für andere nicht |
| Kurzfristiges Demand Sensing | passt die kurzfristige Prognose mit jüngsten Aufträgen und Kassendaten an | Konsumgüter, Distribution | nur nützlich, wenn MPS und S&OE auf wöchentliche Änderungen reagieren können |
| Szenarioplanung und schnelle Neuberechnung | berechnet die Wirkungen einer Entscheidung auf Bedarf, Kapazität und Material neu | Supply Review, Pre-S&OP | Rechenzeit, Datenlatenz, wer Szenarien rechnen darf [16] |
| Parameterabstimmung | schlägt Wiederbeschaffungszeiten, Sicherheitsbestände, Losgrößen und DDMRP-Pufferfaktoren aus Istdaten vor | Pflege der MRP-Stammdaten | Disponent prüft vor Änderungen; Änderungsprotokoll |
| Priorisierung von Ausnahmen | ordnet MRP-Ausnahmemeldungen nach Wirkung auf Kundenaufträge | Materialdisposition | Annahmequote der Empfehlungen; eingesparte Zeit |
| Assistenten mit generativer KI | fassen S&OP-Pakete zusammen, entwerfen Entscheidungsvorlagen, beantworten "Warum hat sich dieser Plan geändert?" aus den Planungsdaten | Vorbereitung von Besprechungen | Antworten müssen die verwendeten Daten nennen; keine autonomen Planänderungen ohne Genehmigung |
| Digitaler Zwilling und Simulation | testet Optionen für Kapazität, Puffer und Layout vor der Entscheidung | Supply Review bei Kapazitätsinvestitionen | Validierung des Modells gegen die tatsächliche Leistung; siehe den [Leitfaden Digital Twin](https://www.m365.fm/learn/digital-twin/) |

Vier Regeln halten KI in der Planung nützlich:

1. **Zuerst den Prozess in Ordnung bringen.** Eine KI-Prognose, die in einen Prozess ohne Demand Review, ohne Bias-Messung und ohne Entscheidungsbefugnisse eingespeist wird, erzeugt schnellere Verwirrung.
2. **Den Wertbeitrag messen.** Jedes Modell wie jeden anderen Prognoseschritt behandeln und seinen FVA verfolgen (Abschnitt 16).
3. **Menschen bleiben für Entscheidungen verantwortlich.** S&OP-Entscheidungen betreffen Geld, Menschen und Kunden. Werkzeuge können Optionen vorbereiten; die Führung entscheidet.
4. **Datenbasis vor Modellen.** Die meisten KI-Planungsprojekte bleiben an der Qualität der Historie, den Stammdaten und der Integration hängen, nicht an Algorithmen. In Microsoft-Umgebungen behandelt der [Leitfaden Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/) Plattformentscheidungen wie Fabric und Power BI [31][32].

### Eine realistische Microsoft-365-Aufstellung für S&OP

| Element | Werkzeug | Hinweise |
|---|---|---|
| Kalender und Besprechungen | Outlook, Teams | Serientermine für alle fünf Schritte, 12 Monate im Voraus gebucht |
| Kennzahlenpaket | Power-BI-Bericht aus ERP- und Planungsdaten | eine Seite je Familie; jeden Monat dasselbe Layout |
| Familienpläne und Szenarien | Excel (erste Zyklen), später ein Planungswerkzeug | Versionskontrolle: eine Datei je Zyklus, nach Genehmigung schreibgeschützt |
| Annahmen- und Entscheidungsprotokolle | Microsoft Lists oder eine SharePoint-Liste | Verantwortlicher, Fälligkeit, Status; in der Executive-Agenda verlinkt |
| Entscheidungsvorlagen | Word- oder Loop-Seiten, eine Seite je Entscheidung | Optionen, Wirkung, Empfehlung |
| Unterstützung bei der Vorbereitung | Copilot-Zusammenfassungen von Kennzahlenpaket und Protokollen | vom Prozesseigner vor der Verteilung geprüft |

## Glossar

| Begriff | Definition |
|---|---|
| Aggregierte Planung (Aggregate Planning) | Planung von Produktionsraten, Belegschaft und Bestand für Produktfamilien auf mittlere Sicht; der Ursprung von S&OP [1] |
| Available to Promise (ATP) | der noch nicht gebundene Teil der geplanten Versorgung, der neuen Kundenaufträgen zugesagt werden kann (Abschnitt 8) |
| Stückliste (Bill of Materials, BOM) | Liste der Komponenten, Mengen und Struktur, die für ein übergeordnetes Teil benötigt werden |
| Ressourcenstückliste (Bill of Resources) | Stunden je Einheit eines Produkts oder einer Familie an jeder Schlüsselressource; genutzt in der S&OP-Ressourcenplanung und der RCCP |
| Kapazitätsbedarfsplanung (CRP) | detaillierte Belastungsrechnung je Arbeitsplatz aus MRP-Aufträgen und Arbeitsplänen, bei unbegrenzter Kapazität [8] |
| Kumulierte Durchlaufzeit (Cumulative Lead Time) | der längste Pfad der Wiederbeschaffungs- und Durchlaufzeiten durch die Stückliste, vom Einkauf des ersten Materials bis zur Fertigstellung des Enderzeugnisses |
| Entkopplungspunkt (Decoupling Point) | Stelle in der Stückliste oder Supply Chain, an der ein DDMRP-Puffer die Versorgung von der Bedarfsschwankung trennt [11] |
| Bedarfszeitzaun (Demand Time Fence) | Grenze im MPS, innerhalb derer nur Kundenaufträge, nicht die Prognose, als Bedarf zählen |
| Abhängiger Bedarf (Sekundärbedarf) | aus dem Bedarf eines übergeordneten Teils berechneter Bedarf, im Gegensatz zum unabhängigen (prognostizierten) Bedarf [13] |
| DDMRP | Demand Driven Material Requirements Planning: Puffer an Entkopplungspunkten, nach Zonen dimensioniert und über die Net-Flow-Gleichung aufgefüllt [11][12] |
| Ausnahmemeldung (Exception Message) | MRP-Empfehlung, einen Auftrag freizugeben, umzuplanen oder zu stornieren |
| Fixierter Planauftrag (Firm Planned Order) | vom Disponenten fixierter Planauftrag, den MRP nicht automatisch ändert |
| Prognose-Bias | systematische Über- oder Unterprognose; Σ(F − A) / ΣA |
| Forecast Value Added (FVA) | Veränderung des Prognosefehlers durch einen Schritt im Prognoseprozess |
| Bruttobedarf | Gesamtbedarf an einem Teil in einer Periode vor der Nettobedarfsrechnung |
| Integrated Business Planning (IBP) | Begriff von Oliver Wight für eine unternehmensweite Erweiterung von S&OP einschließlich Portfolio und Finanzen, Horizont mindestens 24 Monate [2] |
| Dispositionsstufe (Low-Level-Code) | die tiefste Stücklistenstufe, auf der ein Teil vorkommt; bestimmt die Bearbeitungsreihenfolge im MRP [8] |
| Exakte Losgröße (Lot-for-Lot) | Losgrößenverfahren, das genau den Nettobedarf jeder Periode bestellt [8] |
| MAPE / WMAPE | mittlerer absoluter prozentualer Fehler / gewichteter MAPE (Abschnitt 16) |
| Produktionsprogramm (Master Production Schedule, MPS) | Aussage darüber, was das Unternehmen je Enderzeugnis und Periode auf Basis des taktischen Plans zu produzieren erwartet [7] |
| MRP | Material Requirements Planning (Materialbedarfsplanung): zeitlich gestaffelte Berechnung der Nettobedarfe für alle Komponenten aus MPS, Stückliste und Bestand [7] |
| MRP II | Manufacturing Resource Planning: MRP plus S&OP, MPS, RCCP, CRP, Fertigungssteuerung und Finanzintegration [3] |
| Net-Flow-Position | DDMRP: Lagerbestand + Bestellbestand − qualifizierter Bedarf [14] |
| Nervosität | häufige oder große Änderungen der Planaufträge infolge kleiner Änderungen der Eingangsdaten [8][10] |
| Nettobedarf | Bruttobedarf minus verfügbarer Bestand und geplante Zugänge, gegebenenfalls plus Sicherheitsbestand |
| Pegging (Bedarfsverfolgung) | Verknüpfung zwischen einem Bedarf und seinem Ursprungsbedarf |
| Planauftragsfreigabe | Termin und Menge, zu denen ein Planauftrag freigegeben werden soll, um die Wiederbeschaffungszeit vor seinem Zugang |
| Planungszeitzaun (Planning Time Fence) | Grenze, jenseits derer das Planungssystem Aufträge automatisch anlegen oder ändern darf |
| Projizierter verfügbarer Bestand (Projected Available Balance, PAB) | erwarteter Bestand am Ende einer Periode im MPS |
| Grobkapazitätsplanung (RCCP) | Prüfung des MPS gegen Schlüsselressourcen mithilfe von Ressourcenstücklisten |
| S&OE | Sales and Operations Execution: wöchentlicher Prozess zur kurzfristigen Umsetzung des S&OP-Plans |
| Sales and Operations Planning (S&OP) | monatlicher bereichsübergreifender Prozess, der Bedarfs- und Versorgungspläne je Familie in Stück und Dollar zusammenführt [1] |
| Geplanter Zugang (Scheduled Receipt) | offener Fertigungs- oder Bestellauftrag mit Fälligkeitstermin |
| Tracking Signal | kumulierter Prognosefehler geteilt durch die MAD; zeigt Bias an |

## FAQ: Sales and Operations Planning und MRP

### Was ist S&OP einfach erklärt?

S&OP ist ein monatlicher Besprechungszyklus, in dem Vertrieb, Produktion, Supply Chain und Finanzen sich auf einen Plan einigen, was das Unternehmen in den nächsten 18 bis 36 Monaten je Produktfamilie verkaufen, produzieren und auf Lager halten wird [1][5]. Die Führung nutzt ihn, um Abwägungen zu treffen, etwa eine Schicht hinzuzunehmen oder vor einem Stillstand Bestand aufzubauen.

### Welche Schritte hat der S&OP-Prozess?

Die üblichen fünf Schritte sind Datensammlung, Demand Review, Supply Review, Pre-S&OP (Abgleich) und Executive-S&OP-Meeting [1][20]. Manche Unternehmen ergänzen am Anfang ein Produkt- oder Portfolioreview; Anaplan zum Beispiel nennt Reviews für Produkt, Bedarf, Versorgung, Finanzen, Pre-S&OP und Executive [15].

### Wie oft sollte S&OP stattfinden?

Monatlich, nach festem Kalender [1][5]; Anaplan zum Beispiel beschreibt Monatszyklen mit wöchentlichen Abstimmungen für wichtige Beteiligte [15]. Ein wöchentliches S&OE-Meeting behandelt kurzfristige Änderungen zwischen den Zyklen, und größere Ereignisse (ein Großauftrag, ein Werksausfall) können ein zusätzliches Review auslösen.

### Wer sollte am Executive-S&OP-Meeting teilnehmen?

Die Geschäftsführung oder Leitung des Geschäftsbereichs als Vorsitz, dazu die Leitungen von Vertrieb, Marketing, Produktion, Supply Chain und Finanzen sowie Produktmanagement oder Entwicklung, wenn Portfolioentscheidungen auf der Agenda stehen. Der S&OP-Prozesseigner bereitet die Besprechung vor und dokumentiert sie.

### Was ist der Unterschied zwischen S&OP und IBP?

IBP erweitert S&OP vom Abgleich von Bedarf und Versorgung auf den gesamten Geschäftsplan einschließlich Portfolio, Strategie und Finanzen, mit einem Horizont von mindestens 24 Monaten [2]. Oliver Wight entwickelte S&OP in den 1980er-Jahren und prägte IBP Anfang der 2000er-Jahre [2].

### Was ist der Unterschied zwischen S&OP und MRP?

S&OP entscheidet bereichsübergreifend über Mengen je Produktfamilie und Monat. MRP berechnet für jede Komponente aus Produktionsprogramm, Stücklisten und Bestand, wie viele gekauft oder gefertigt werden und wann [7]. S&OP setzt den Rahmen; MRP setzt ihn auf Teileebene um.

### Was ist der Unterschied zwischen MPS und MRP?

Das MPS plant Enderzeugnisse (oder Planungsartikel) je Woche; MRP löst das MPS über die Stücklisten auf, um Komponenten und Material zu planen [7]. Beide nutzen dieselbe Logik der Nettobedarfsrechnung, aber das MPS legt ein Programmplaner fest, und MRP wird vom System berechnet.

### Wie funktioniert MRP?

Für jedes Teil, Stufe für Stufe: Bruttobedarf nehmen, Lagerbestand und geplante Zugänge abziehen, den Sicherheitsbestand berücksichtigen, um den Nettobedarf zu erhalten, Lose bilden, um die Wiederbeschaffungszeit nach vorn verschieben, um die Planauftragsfreigaben zu erhalten, und diese als Bruttobedarf an die Komponenten weitergeben [8]. Abschnitt 10 zeigt ein vollständiges Rechenbeispiel.

### Welche Eingangsdaten braucht MRP?

Das Produktionsprogramm, die Stücklisten, die Bestandsdaten (Lagerbestand, Sicherheitsbestand), offene Aufträge (geplante Zugänge) und die Dispositionsdaten der Teile (Wiederbeschaffungszeiten, Losgrößenverfahren) [7][8].

### Was ist der Unterschied zwischen MRP und MRP II?

MRP berechnet den Materialbedarf. MRP II, 1983 von Oliver Wight definiert, ergänzt S&OP, Programmplanung, Grob- und Feinkapazitätsplanung, Fertigungssteuerung und die Verbindung zur Finanzplanung [3].

### Was ist der Unterschied zwischen MRP und ERP?

MRP ist eine Planungsmethode und ein ERP-Modul. ERP ist ein integriertes System für Finanzen, Vertrieb, Einkauf, Personal und Fertigung, mit MRP als Planungskern für das Material. Gartner prägte den Begriff ERP 1990 [4].

### Was ist DDMRP?

Demand Driven MRP setzt Bestandspuffer an ausgewählte Entkopplungspunkte, dimensioniert sie in roten, gelben und grünen Zonen aus durchschnittlichem Tagesverbrauch und Wiederbeschaffungszeit und füllt sie über die Net-Flow-Gleichung auf (Lagerbestand + Bestellbestand − qualifizierter Bedarf) [11][12][14]. Es soll die Prognoseabhängigkeit und Nervosität des klassischen MRP verringern; unabhängige Belege zu den Ergebnissen sind noch begrenzt.

### Was bedeutet Available to Promise (ATP)?

ATP ist der Teil der geplanten Versorgung, der noch nicht an Kundenaufträge gebunden ist und neuen Aufträgen zugesagt werden kann. Im Beispiel in Abschnitt 8 kann ein Kunde, der 100 Einheiten in Woche 2 möchte, sofort 60 bekommen und den Rest ab Woche 4.

### Welche Kennzahlen messen den Erfolg von S&OP?

Prognosegenauigkeit (1 − WMAPE) und Bias auf Familienebene, Erfüllung des Versorgungsplans, MPS-Treue, Kundenservice (OTIF oder Lieferbereitschaftsgrad), Bestand oder Auftragsrückstand gegen Ziel und die Abschlussquote der Entscheidungen. Abschnitt 16 nennt Formeln und ein Rechenbeispiel.

### Wie berechnet man die Prognosegenauigkeit?

Eine verbreitete Formel ist 1 − WMAPE, wobei WMAPE = Σ|Prognose − Ist| / Σ Ist. Bei absoluten Fehlern von 1.350 Stück auf einen tatsächlichen Bedarf von 21.550 beträgt der WMAPE 6,26 % und die Prognosegenauigkeit 93,7 %. Immer den Bias mit angeben.

### Warum scheitern S&OP-Prozesse?

Die üblichen Gründe sind fehlende Teilnahme der Führung, eine Prognose, die in Wahrheit ein Vertriebsziel ist, kein Einbezug der Finanzen, zu viel Detail (Artikel statt Familien), keine Verbindung zum MPS und der Kauf von Software, bevor der Prozess funktioniert. Abschnitt 18 nennt Abhilfen.

### Kann ein kleiner Hersteller S&OP ohne spezielle Software machen?

Ja. Ein Unternehmen mit einer Handvoll Produktfamilien kann S&OP mit ERP-Auszügen, Excel und einem gemeinsamen Entscheidungsprotokoll fahren. Software lohnt sich, wenn Abgleich zwischen Familien und Artikeln, Szenarien oder Datenaufbereitung mehr Zeit kosten als die Entscheidungen.

### Was ist MRP-Nervosität?

Nervosität ist die Neigung von MRP-Plänen, sich häufig zu ändern, wenn sich die Eingangsdaten leicht ändern. Im Beispiel in Abschnitt 12 haben 30 zusätzliche Schreibtische Aufträge auf zwei tieferen Stücklistenstufen verschoben. Zeitzäune, fixierte Planaufträge und Änderungskostenregeln verringern sie [10].

### Welchen Nutzen hat S&OP?

S&OP ersetzt getrennte Zahlen von Vertrieb, Produktion und Finanzen durch einen vereinbarten Plan je Produktfamilie. Entscheidungen, die Kosten von einem Bereich in einen anderen verschieben, etwa eine zweite Schicht, eine Vorproduktion oder die Streichung einer Variante, treffen die Menschen, die sowohl die Kosten als auch den Nutzen verantworten (Abschnitt 1). MPS und MRP erhalten einen Plan, der bereits gegen die Kapazität geprüft ist, sodass später weniger Aufträge beschleunigt werden müssen. Das Controlling sieht die Wirkung auf das Working Capital, bevor sie eintritt: Im Beispiel in Abschnitt 16 trägt der Hybrid-Plan im Durchschnitt etwa 380 Schreibtische weniger als der Level-Plan, was etwa 13.800 USD Lagerhaltungskosten pro Jahr entspricht. Veröffentlichte Nutzenprozente von Anbietern und Umfragen schwanken stark, daher vor dem ersten Zyklus den eigenen Ausgangswert messen.

### Was sind die Ergebnisse von MRP?

Für jedes Eigen- und Kaufteil erzeugt MRP zeitlich gestaffelte Planauftragszugänge und Planauftragsfreigaben, verschoben um die Wiederbeschaffungszeit [8]. Außerdem erzeugt es Ausnahmemeldungen für offene Aufträge (freigeben, vorziehen, verschieben, stornieren, überfällig, unter Sicherheitsbestand) und Pegging, das jeden Bedarf mit seinem übergeordneten Teil und Kundenauftrag verknüpft. Abschnitt 10 zeigt alle drei mit einem Rechenbeispiel.

### Was ist der Unterschied zwischen MRP und Just-in-Time (JIT)?

MRP ist eine Planungsrechnung: Es löst das Produktionsprogramm über die Stücklisten auf und erzeugt terminierte Aufträge, bevor der Bedarf entsteht. Just-in-Time (JIT) ist ein Lean-Produktionsansatz, der nach tatsächlichem Verbrauch nachfüllt, meist mit Kanban-Signalen, und kleine Lose und niedrige Bestände anstrebt. Beides schließt sich nicht aus. Viele Werke nutzen MRP für teure Teile mit langer Wiederbeschaffungszeit und sprunghaftem Bedarf und Kanban für Schnelldreher an der Linie (Abschnitt 10). Der [Leitfaden Kanban und Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/) (geplant) behandelt die Pull-Seite.

## Fazit und erste Schritte

Sales and Operations Planning und MRP lösen dasselbe Problem auf zwei Ebenen. S&OP lässt die Führung einmal im Monat entscheiden, wie viel je Familie verkauft, produziert und auf Lager gehalten wird und was das kostet. Das Produktionsprogramm übersetzt diese Entscheidung in Enderzeugnisse je Woche, die Grobkapazitätsplanung prüft sie gegen den Engpass, und MRP berechnet, was jedes Teil braucht und wann. Jede Ebene braucht eine realistische Ebene darüber und eine umgesetzte Ebene darunter. Feinplanung und Shopfloor vervollständigen die Kette.

Die Methoden sind alt (Orlicky formalisierte MRP 1964, Oliver Wight prägte S&OP in den 1980er-Jahren) und immer noch das Rückgrat der ERP-Planung [2][3][4]. Ihre Schwächen sind bekannt: unbegrenzte Kapazität, feste Wiederbeschaffungszeiten, Nervosität und Datenabhängigkeit. Zeitzäune, RCCP, DDMRP-Puffer und Feinplanung mit begrenzter Kapazität gehen sie an. KI-Werkzeuge können Prognose und Szenarioarbeit beschleunigen, aber nur dort, wo Prozess, Daten und Entscheidungsbefugnisse bereits stehen.

**Erste Schritte in den nächsten 30 Tagen**

- [ ] 5–15 Produktfamilien und 3–8 Schlüsselressourcen mit ihrer nachgewiesenen Monatskapazität festlegen
- [ ] 24 Monate Lieferungen und Aufträge je Familie ziehen und Prognosegenauigkeit (1 − WMAPE) und Bias für die letzten 6 Monate messen
- [ ] Prüfen, ob die Summe des MPS je Familie mit dem aktuellen Absatz- und Produktionsplan übereinstimmt
- [ ] Den MRP-Lauf starten und überfällige Planaufträge und Ausnahmemeldungen je Disponent zählen; das ist der Ausgangswert für die Nervosität
- [ ] Die Bestandsgenauigkeit für die 50 wertmäßig wichtigsten Teile und die Stücklistengenauigkeit für die 10 wichtigsten Enderzeugnisse prüfen
- [ ] Den Fünf-Schritte-S&OP-Kalender für die nächsten 12 Monate buchen und einen Executive Sponsor und einen Prozesseigner benennen
- [ ] Den ersten Zyklus mit den Vorlagen aus Abschnitt 15 in der Tabellenkalkulation fahren und im ersten Executive-Meeting mit dem Entscheidungsprotokoll beginnen

---

## Weiterlesen auf m365.fm

**Pillar-Leitfäden**
- [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/): Feinplanung, Schwächen von MRP, Durchlaufzeit-Syndrom, begrenzte Kapazität
- [Lean Management](https://www.m365.fm/learn/lean-management/): Pull, Heijunka, Kanban als Alternative zur Push-Planung
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/): OEE, Liefertreue, Bestandskennzahlen
- [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/): Szenariotests für Kapazitätsentscheidungen
- [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/): Integration von ERP, MES und Datenplattform
- [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/): Planung bei Engineer-to-Order und langen Wiederbeschaffungszeiten
- [Operational Excellence](https://www.m365.fm/learn/operational-excellence/)
- [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)
- [Theory of Constraints und Engpasstheorie](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant): Engpässe und Drum-Buffer-Rope
- [Kanban und Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/) (geplant)
- [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant)

**Vertiefungen (geplant)**
- [Losgröße berechnen: Andler-Formel, EPQ und MRP-Losgrößenverfahren](https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/) (geplant)
- [Bestandsmanagement in der Produktion und Sicherheitsbestand](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/) (geplant)
- [Intralogistik und innerbetrieblicher Materialfluss](https://www.m365.fm/learn/produktionsplanung-aps/intralogistik/) (geplant)
- [Resiliente Lieferketten](https://www.m365.fm/learn/operational-excellence/resiliente-lieferketten/) (geplant)
- [Simulation in der Produktion](https://www.m365.fm/learn/digital-twin/simulation-produktion/) (geplant)

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Lean Management, Produktionsplanung und die digitale Transformation der Fertigung, mit dem Schwerpunkt, wie Planungsprozesse, Wertstrommodelle, Simulation und Kennzahlenanalyse in der Praxis zusammenwirken. [Redaktion: Rolle, Kurzbiografie und Foto ergänzen.]

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Quellen

Alle Onlinequellen abgerufen am 20. November 2026. Quellen mit dem Vermerk "über Schwester-Pillar" wurden am selben Tag für den m365.fm-Leitfaden zu Produktionsplanung und APS oder zu Manufacturing IT mit Azure geöffnet und geprüft und werden mit ihren geprüften bibliografischen Angaben wiederverwendet.

1. Sales and operations planning (Geschichte einschließlich aggregierter Produktionsplanung und Richard "Dick" Ling; Definitionen; fünf Prozessschritte nach Wagner et al. 2014; taktischer Horizont bis 18 Monate; Reifegradmodelle nach Grimson und Pyke 2007 und Wagner et al. 2014; Treiber und Hürden). Wikipedia. https://en.wikipedia.org/wiki/Sales_and_operations_planning
2. What Is the Difference Between S&OP and IBP? Oliver Wight Americas (Blog). https://www.oliverwight-americas.com/blog/difference-between-sop-and-ibp/
3. Material requirements planning (Rolls-Royce und GE Anfang der 1950er; Orlicky 1964; Black & Decker 1964 mit Dick Alban; etwa 700 Anwender bis 1975 und etwa 8.000 bis 1981; Oliver Wights MRP II 1983). Wikipedia. https://en.wikipedia.org/wiki/Material_requirements_planning
4. Material requirements planning (MRP), Definition und Geschichte (Harris 1913; Orlicky bei IBM 1964; Plossl und Wight 1967; Orlickys Buch 1975; Wights MRP II 1983; Gartner prägt ERP 1990; dritte Auflage von Ptak und Smith 2011 mit DDMRP; in Prüfrunde 3 erneut geprüft). TechTarget. https://www.techtarget.com/searcherp/definition/material-requirements-planning-MRP
5. What is sales and operations planning (S&OP)? (monatlicher Takt, rollierender Horizont von 18–36 Monaten; Seite im Bereich Integrated Business Planning von SAP). SAP. https://www.sap.com/resources/sop-sales-and-operations-planning und https://www.sap.com/products/scm/integrated-business-planning/what-is-supply-chain-planning/sop-sales-operations.html
6. Sales and Operations Planning (S&OP): Process, Challenges, and Expert Tips (Horizont 18–36 Monate; Level-, Chase- und gemischte Strategien). Smartsheet. https://www.smartsheet.com/sales-operations-planning-101
7. Master Production Scheduling and Material Requirements Planning (Definitionen von MPS und MRP; ATP und kumuliertes ATP als Ergebnisse). Oracle JD Edwards EnterpriseOne Applications Requirements Planning Implementation Guide, Release 9.2. https://docs.oracle.com/en/applications/jd-edwards/supply-chain-manufacturing/9.2/eoarp/master-production-scheduling-and-material-requirements-planning.html
8. Gershwin, Stanley B.: Material Requirements Planning (MRP) and MRP II, Vorlesungsfolien, MIT 2.854 Introduction to Manufacturing Systems, Herbst 2016 (auf Basis von Hopp und Spearman, Factory Physics). MIT OpenCourseWare. https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/4eec617bb52d64f4ea1bed6d9905bc00_MIT2_854F16_MatrialRequire.pdf
9. Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3. Aufl., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Katalogeintrag: https://search.worldcat.org/oclc/718450337 (über Schwester-Pillar)
10. Blackburn, Joseph D.; Kropp, Dean H.; Millen, Robert A.: A Comparison of Strategies to Dampen Nervousness in MRP Systems. Management Science 32 (1986) 4, S. 413–429. DOI: 10.1287/mnsc.32.4.413. Eintrag: https://ideas.repec.org/a/inm/ormnsc/v32y1986i4p413-429.html
11. Demand Driven Material Requirements Planning (DDMRP) overview. Dynamics 365 Supply Chain Management, Microsoft Learn. https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/ddmrp-overview
12. Buffer profile and levels (DDMRP-Zonenformeln, Spannen für Wiederbeschaffungszeit- und Variabilitätsfaktor, Rechenbeispiel). Dynamics 365 Supply Chain Management, Microsoft Learn. https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/ddmrp-buffer-profile-and-levels
13. Orlicky, Joseph: Material Requirements Planning. The New Way of Life in Production and Inventory Management. McGraw-Hill, New York 1975. (über Schwester-Pillar; Original nicht eingesehen)
14. The five steps of DDMRP (Net-Flow-Gleichung, Pufferzonen). IFS-Blog. https://blog.ifs.com/the-five-steps-of-ddmrp/ ; DDMRP in der Dokumentation zu IFS Cloud: https://docs.ifs.com/ifsclouddocs/24r2/Planning/AboutDDMRP.htm
15. The ultimate guide to the sales and operations planning (S&OP) process (sechs Reviews; Einführungsempfehlung von 8–12 Wochen). Anaplan (Anbieter), 24. Juli 2023. https://anaplan.com/blog/the-myths-of-sop
16. What is sales and operations planning (S&OP)? (traditioneller Monatszyklus mit fünf Stufen; Concurrent Planning, Herstelleraussage). Kinaxis (Anbieter), veröffentlicht 6. Januar 2023, geändert 3. Dezember 2025. https://www.kinaxis.com/en/sop
17. Supply Chain S&OP: Process Improvement (fünf Stufen der S&OP-Reife). Gartner. https://www.gartner.com/en/supply-chain/trends/supply-chain-sop
18. The 5 S&OP maturity levels (Sekundärbeschreibung des Gartner-S&OP-Reifegradmodells). Jedox (Anbieter von Planungssoftware). https://jedox.com/en/blog/5-sop-maturity-levels
19. Grimson, J. Andrew; Pyke, David F.: Sales and operations planning: an exploratory study and framework. The International Journal of Logistics Management 18 (2007) 3, S. 322–346. DOI: 10.1108/09574090710835093 (bibliografische Angaben über Crossref bestätigt, 20. November 2026; Volltext nicht eingesehen)
20. Wagner, Stephan M.; Ullrich, Kristoph K. R.; Transchel, Sandra: The game plan for aligning the organization. Business Horizons 57 (2014) 2, S. 189–201. DOI: 10.1016/j.bushor.2013.11.002 (bibliografische Angaben über Crossref bestätigt, 20. November 2026; Volltext nicht eingesehen)
21. Oliva, Rogelio; Watson, Noel: Cross-functional alignment in supply chain planning: A case study of sales and operations planning. Journal of Operations Management 29 (2011) 5, S. 434–448. DOI: 10.1016/j.jom.2010.11.012 (bibliografische Angaben über Crossref bestätigt, 20. November 2026; Kernaussage über Wikipedia [1]; Volltext nicht eingesehen)
22. Tavares Thomé, António Márcio; Scavarda, Luiz Felipe; Fernandez, Nicole Suclla; Scavarda, Annibal José: Sales and operations planning: A research synthesis. International Journal of Production Economics 138 (2012) 1, S. 1–13. DOI: 10.1016/j.ijpe.2011.11.027 (Auflösung der DOI auf den Elsevier-Eintrag S0925527311004907 bestätigt; bibliografische Angaben und Autorenliste über Crossref bestätigt, 20. November 2026; Volltext nicht eingesehen)
23. Tavares Thomé, António Márcio; Scavarda, Luiz Felipe; Fernandez, Nicole Suclla; Scavarda, Annibal José: Sales and operations planning and the firm performance. International Journal of Productivity and Performance Management 61 (2012) 4, S. 359–381. DOI: 10.1108/17410401211212643 (bibliografische Angaben und Autorenliste über Crossref bestätigt, 20. November 2026; Volltext nicht eingesehen)
24. ASCM (Association for Supply Chain Management): APICS Certified in Planning and Inventory Management (CPIM), Zertifizierungsbroschüre 2026. https://www.ascm.org/globalassets/ascm_website_assets/docs/credentials/2026-certification_brochures_cpim.pdf (über Schwester-Pillar)
25. ANSI/ISA-95.00.03-2013: Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management. International Society of Automation, Leseprobe. https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf (über Schwester-Pillar)
26. Thürer, Matthias; Fernandes, Nuno O.; Haeussler, Stefan; Stevenson, Mark: Dynamic planned lead times in production planning and control systems: does the lead time syndrome matter? International Journal of Production Research 61 (2023) 4, S. 1268–1282. DOI: 10.1080/00207543.2022.2034193 (über Schwester-Pillar)
27. What is material requirements planning (MRP)? (MRP gegenüber ERP; FAQ-Themen inkl. MRP II, MPS, DDMRP, Predictive MRP, APS). SAP. https://www.sap.com/products/erp/what-is-mrp.html
28. Material requirements planning (MRP) in manufacturing: A complete guide (zitiert Class-A-Benchmarks von Oliver Wight/APICS ohne Link). Zoho Inventory Academy. https://www.zoho.com/inventory/academy/inventory-management/what-is-materials-requirement-planning-mrp-in-manufacturing.html
29. Best S&OP Software in 2026: Sales & Operations Planning Buyer's Guide (Anbieterliste; verfasst von Board, einem der aufgeführten Anbieter). Board International. https://www.board.com/guide/best-sop-software
30. Kinaxis Inc.: New Research Finds 83% of Supply Chains Can't Respond to Disruptions in 24 Hours (von Kinaxis beauftragte IDC-Studie), Pressemitteilung, 16. April 2024. https://investors.kinaxis.com/news-releases/news-release-details/2024/New-Research-Finds-83-of-Supply-Chains-Cant-Respond-to-Disruptions-in-24-Hours (über Schwester-Pillar)
31. What is Microsoft for Manufacturing? Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/overview (über Schwester-Pillar)
32. Link your Dataverse environment to Microsoft Fabric. Power Apps, Microsoft Learn. https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-view-in-fabric (über Schwester-Pillar)
33. Overview of Sales and Operations Planning. Oracle Fusion Cloud SCM documentation. https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/23d/fasop/overview-of-sales-and-operations-planning.html (Existenz des Produkts aus dem Dokumentationstitel in Suchergebnissen bestätigt; Seiteninhalt nicht abgerufen)
34. Kristensen, Jesper; Jonsson, Patrik: Context-based sales and operations planning (S&OP) research: A literature review and future agenda. International Journal of Physical Distribution & Logistics Management 48 (2018) 1, S. 19–46. DOI: 10.1108/IJPDLM-11-2017-0352. https://www.emerald.com/insight/content/doi/10.1108/IJPDLM-11-2017-0352/full/html
35. About the Demand Driven Institute (2011 von Carol Ptak und Chad Smith gegründet; Konformitätszertifizierung von Software für Anbieter kostenlos; Zertifikate für Einzelpersonen). Demand Driven Institute. https://demanddriveninstitute.com/about-us (abgerufen am 20. November 2026)
36. Measuring Forecast Accuracy: Approaches to Forecasting: A Tutorial (Faustregel für das Tracking Signal: zwischen −4 und 4). Supply Chain Resource Cooperative, NC State University, 25. Januar 2011. https://scm.ncsu.edu/scm-articles/article/measuring-forecast-accuracy-approaches-to-forecasting-a-tutorial (abgerufen am 20. November 2026)
37. World Class Master Scheduling: Best Practices and Lean Six Sigma Continuous Improvement, Abschnitt "Data accuracy" (Bestandsgenauigkeit 95 % akzeptabel, 98 % robust; Stücklistengenauigkeit mindestens 98 %, 99+ % gut). Auszug auf GlobalSpec Engineering360. https://www.globalspec.com/reference/47612/203279/data-accuracy (abgerufen am 20. November 2026; Autor und Verlag auf der Auszugsseite nicht angegeben)

# Prüfhinweise für die Redaktion

**Herstelleraussagen (im Text gekennzeichnet)**

- Kinaxis: Concurrent Planning verkürzt Planungszyklen von Wochen oder Monaten auf Stunden [16].
- Kinaxis/IDC: 83 % der Lieferketten können nicht innerhalb von 24 Stunden auf Störungen reagieren (vom Anbieter beauftragte Studie) [30].
- Anaplan: S&OP-Software soll innerhalb von 8–12 Wochen nachweisbaren Nutzen zeigen [15].
- Board: Anbieterliste 2026, verfasst von einem der aufgeführten Anbieter [29].
- Jedox: Beschreibung der Gartner-Reifegradstufen [18] (ein Anbieter von Planungssoftware fasst Analysteninhalte zusammen).
- Microsoft: DDMRP in Dynamics 365 SCM ohne zusätzliche Lizenzgebühren, erfordert das Add-in Planning Optimization [11]. Produktdokumentation, keine Leistungsaussage.

**[unbelegt]-Stellen**

1. Horizont von S&OE (0–3 Monate): Praxisgebrauch, keine Primärquelle geprüft.
2. Gartners eigene Bezeichnungen der fünf S&OP-Reifegradstufen: Die Gartner-Seite bestätigt fünf Stufen [17]; die Beschreibungen folgen Jedox [18].
3. Class-A-Benchmarks von Oliver Wight (95 % Bestandsgenauigkeit, 98 % Stücklistengenauigkeit): Zahlen in der Literatur zur Programmplanung bestätigt [37]; nur die Zuordnung zur Oliver-Wight-Checkliste bleibt [unbelegt].
4. Aussage, dass Lizenzgebühren meist der kleinere Teil der Fünfjahreskosten von Planungssoftware sind.
5. Glossar: Das ASCM Supply Chain Dictionary ist nicht frei zugänglich; die Definitionen folgen üblichem Lehrbuchgebrauch und den zitierten Oracle- und MIT-Unterlagen [7][8]. Für die deutschen Begriffe (Primär-/Sekundärbedarf, Dispositionsstufe, Neuaufwurf/Net Change, Planungszeitzaun) mit der SAP-/ERP-Terminologie des Zielpublikums abgleichen.
6. Wissenschaftliche Quellen [19]–[23]: bibliografische Angaben über Crossref bestätigt, Volltexte nicht eingesehen.

**Beispielzahlen.** Alle Rechenbeispiele (Schreibtischfamilie, MPS/ATP, RCCP, Stücklistenauflösung, Nervosität, DDMRP-Halter, Prognosekennzahlen, Bestandsbewertung) verwenden erfundene, in sich konsistente Zahlen und sind im Text als Beispiel gekennzeichnet. Die Zahlen sind unverändert aus der englischen Fassung übernommen (dort von Hand nachgerechnet); in der deutschen Fassung wurde nur das Zahlenformat umgestellt.

**Interne Links**

Alle `/en/learn/`-Links der englischen Fassung sind auf die deutschen URLs laut Slug-Map umgestellt: Produktionsplanung und APS (3 Anker im Text), Lean Management, Produktionskennzahlen, Digital Twin, Manufacturing IT Azure, Produktionsplanung Luftfahrt, Operational Excellence, Wertstromanalyse (bestehend); Theory of Constraints, Kanban und Pull-Prinzip, MES und ISA-95 (neue Pillars, geplant); Losgröße, Bestandsmanagement, Intralogistik, resiliente Lieferketten, Simulation Produktion (Cluster, geplant). Alle "(geplant)"-Links nach Veröffentlichung der Zielseiten aktivieren. Abgleich mit dem deutschen APS-Pillar: dort die Abschnitte zu Planungsebenen und MRP-Geschichte mit dem Anker "Sales and Operations Planning" oder "MRP" auf diesen Artikel verlinken (Empfehlung aus der englischen Fassung). Das APS-Pillar behält Feinplanung, begrenzte Kapazität, Durchlaufzeit-Syndrom, Littles Gesetz, Drum-Buffer-Rope, Andler-Formel und Sicherheitsbestandsformeln.

**JSON-LD-Vorschlag**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Sales and Operations Planning (S&OP) und MRP: Wie Produktionsplanung vom Plan bis zum Teil funktioniert",
      "description": "S&OP, Produktionsprogramm (MPS) und MRP erklärt: monatlicher S&OP-Zyklus, Brutto-Netto-Rechnung durchgerechnet, DDMRP, ERP, Kennzahlen, Vorlagen.",
      "inLanguage": "de-DE",
      "author": { "@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/" },
      "publisher": { "@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/" },
      "datePublished": "2026-11-26",
      "dateModified": "2026-11-26",
      "mainEntityOfPage": "https://www.m365.fm/learn/sop-mrp-produktionsplanung/",
      "about": [
        { "@type": "Thing", "name": "Sales and Operations Planning" },
        { "@type": "Thing", "name": "Materialbedarfsplanung" },
        { "@type": "Thing", "name": "Produktionsprogramm" }
      ]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "de-DE",
      "mainEntity": [
        { "@type": "Question", "name": "Was ist S&OP einfach erklärt?", "acceptedAnswer": { "@type": "Answer", "text": "S&OP ist ein monatlicher Besprechungszyklus, in dem Vertrieb, Produktion, Supply Chain und Finanzen sich auf einen Plan einigen, was das Unternehmen in den nächsten 18 bis 36 Monaten je Produktfamilie verkaufen, produzieren und auf Lager halten wird." } },
        { "@type": "Question", "name": "Welche Schritte hat der S&OP-Prozess?", "acceptedAnswer": { "@type": "Answer", "text": "Datensammlung, Demand Review, Supply Review, Pre-S&OP (Abgleich) und Executive-S&OP-Meeting." } },
        { "@type": "Question", "name": "Was ist der Unterschied zwischen S&OP und MRP?", "acceptedAnswer": { "@type": "Answer", "text": "S&OP entscheidet bereichsübergreifend über Mengen je Produktfamilie und Monat. MRP berechnet für jede Komponente aus Produktionsprogramm, Stücklisten und Bestand, wie viele gekauft oder gefertigt werden und wann." } },
        { "@type": "Question", "name": "Was ist der Unterschied zwischen MPS und MRP?", "acceptedAnswer": { "@type": "Answer", "text": "Das MPS plant Enderzeugnisse je Woche; MRP löst das MPS über die Stücklisten auf, um Komponenten und Material zu planen." } },
        { "@type": "Question", "name": "Was ist DDMRP?", "acceptedAnswer": { "@type": "Answer", "text": "Demand Driven MRP setzt Bestandspuffer an Entkopplungspunkte, dimensioniert sie in roten, gelben und grünen Zonen und füllt sie über die Net-Flow-Gleichung auf: Lagerbestand plus Bestellbestand minus qualifizierter Bedarf." } },
        { "@type": "Question", "name": "Wie berechnet man die Prognosegenauigkeit?", "acceptedAnswer": { "@type": "Answer", "text": "Eine verbreitete Formel ist 1 minus WMAPE, wobei WMAPE die Summe der absoluten Fehler geteilt durch die Summe des tatsächlichen Bedarfs ist. Den Bias immer mit angeben." } }
      ]
    }
  ]
}
```

Übrige FAQ-Fragen bei Veröffentlichung in den `FAQPage`-Block aufnehmen, wenn das CMS es unterstützt. Datum an den tatsächlichen Veröffentlichungstag anpassen.

**Empfohlene Grafiken** (aus der englischen Fassung, Beschriftungen auf Deutsch)

1. Pyramide der Planungshierarchie: S&OP → MPS → RCCP → MRP → CRP → Feinplanung, mit Horizont und Raster je Ebene.
2. Monatlicher S&OP-Kalender als Zeitstrahl (Arbeitstage 1–20) mit den fünf Schritten und der Umsetzung.
3. Diagramm Level, Chase, Hybrid: monatliche Bedarfsbalken, Produktionslinien, Engpasskapazität bei 4.000.
4. Erzeugnisstruktur D100 mit hervorgehobenen Dispositionsstufen (S-5 auf Stufe 1 und 2).
5. MRP-Datensatz als Schrittgrafik: Brutto → Netto → Losgröße → Vorlaufverschiebung → Auflösung.
6. Nervosität vorher/nachher: eine MPS-Änderung, Pfeile zu verschobenen Aufträgen auf zwei Stufen.
7. DDMRP-Pufferbalken (Rot 300, Gelb bis 700, Grün bis 1.000) mit Net-Flow-Position 660 und Bestellung über 340.
8. Prognosekennzahlen: Prognose gegen Ist mit kumulierter Fehlerlinie (Bias) und Tracking Signal.

**hreflang**

`de-DE` https://www.m365.fm/learn/sop-mrp-produktionsplanung/ und `en-US` https://www.m365.fm/en/learn/sop-mrp-production-planning/ gegenseitig verknüpfen (jeweils selbstreferenzierendes Canonical plus beide hreflang-Einträge). Die englische Fassung trägt bisher den Hinweis "keine deutsche Version, kein hreflang-Paar"; dort nachziehen.

**iFAKT und Offenlegung**

Kein iFAKT-Produktabschnitt, weil kein Teil des Themas ein Softwarebeispiel vom Arbeitgeber des Autors braucht. Die Autorenbox trägt exakt "Hinweis: Der Autor arbeitet bei der iFAKT GmbH."; keine Kennzeichnung als "gesponsert". iFAKT zahlt nicht für die Veröffentlichung.

**Für den deutschen Markt prüfen** (Aufgabe für die Fachprüfung; im Text nicht als Fakt ergänzt)

1. Abschnitt "Versorgungsstrategien" (Chase-Plan): Der Text nennt Gewerkschafts-/Tarifverträge, Ankündigungsfristen für Überstunden und Entlassungen allgemein bzw. im US-Kontext. Für Deutschland prüfen: Mitbestimmung des Betriebsrats bei Überstunden und Schichtplänen (§ 87 Abs. 1 Nr. 2 und 3 BetrVG), Arbeitszeitgesetz, Kurzarbeit als Instrument, Regeln zu Leiharbeit (AÜG).
2. Abschnitt "Wer teilnimmt" / Executive Sponsor: US-Titel (GM, President, VP) sind mit deutschen Funktionen (Geschäftsführung, Bereichsleitung) übersetzt; Rollenbezeichnungen an die Zielunternehmen anpassen.
3. Schulung/Zertifizierung: ASCM/CPIM ist US-geprägt; ob deutsche Angebote (z. B. Weiterbildungen zu PPS, BVL) erwähnt werden sollen, redaktionell entscheiden.
4. ERP-Optionen: Für den deutschen Mittelstand verbreitete ERP-/PPS-Systeme (z. B. proALPHA, abas, PSIpenta, Infor) fehlen in der Quellenbasis; nur nach Prüfung ergänzen, keine Rangfolge.
5. Terminologie: deutsche Begriffe (Produktionsprogramm, Programmplaner, Bruttobedarf/Nettobedarf, Dispositionsstufe, Planungszeitzaun) mit der Fachprüfung abstimmen; im SAP-Umfeld heißt der MRP-Lauf oft "Disposition" bzw. "Bedarfsplanung".

**Fachliche Prüfung**

Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.
