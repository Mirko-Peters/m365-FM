# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Theory of Constraints (Engpasstheorie): 5 Schritte und DBR (58 Zeichen) |
| Meta-Description | Theory of Constraints in der Produktion: fünf Fokussierungsschritte, Engpassanalyse, Drum-Buffer-Rope mit Zahlen, Throughput Accounting, Vorlagen. (146 Zeichen) |
| Slug | `/learn/theory-of-constraints-engpass/` (vollständige URL: https://www.m365.fm/learn/theory-of-constraints-engpass/) |
| Hauptkeyword | Theory of Constraints |
| Nebenkeywords | Engpasstheorie, TOC, Theory of Constraints Produktion, Engpass, Engpassanalyse, Engpass erkennen, Engpass Produktion, Engpassmaschine, Engpassressource, fünf Fokussierungsschritte, 5 Schritte TOC, Drum-Buffer-Rope, DBR, Trommel-Puffer-Seil, S-DBR, Puffermanagement, Zeitpuffer, Engpasspuffer, Versandpuffer, Throughput Accounting, Durchsatzrechnung, Engpassbezogener Deckungsbeitrag, Goldratt, Das Ziel, Denkprozesse, Gegenwartsbaum, Konfliktwolke, Critical Chain, wandernder Engpass, Little's Law, TOC vs. Lean, TOC vs. Six Sigma |
| Suchintention | Informational (Definition, fünf Fokussierungsschritte, Beispiele) mit starker praktischer Nebenabsicht (Engpass finden, mit DBR planen, Entscheidungen mit Throughput Accounting bewerten). Zielgruppe: Werksleitung, Produktionsleitung, KVP- und Lean-Verantwortliche, Produktionsplaner und Disponenten, Werkscontroller, Studierende des Wirtschaftsingenieurwesens |
| Wortzahl | 15.986 Wörter H1 bis Fazit inkl. Tabellen, Glossar und FAQ (`wc -w`; englische Fassung: 16.570) |
| Sprachversion | Deutsch (`de-DE`). hreflang-Paar: `de-DE` https://www.m365.fm/learn/theory-of-constraints-engpass/ <-> `en-US` https://www.m365.fm/en/learn/theory-of-constraints/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter, Suchbegriffe "Theory of Constraints", "Engpass erkennen", "Drum-Buffer-Rope") noch aus.

---

# Theory of Constraints: die fünf Fokussierungsschritte, Engpässe und Drum-Buffer-Rope

*Stand: 20. November 2026 · Lesezeit: etwa 50 Minuten (Schnelleinstieg: Kurzantwort, Kasten "Das Wichtigste in Kürze", das durchgerechnete Werksbeispiel und die FAQ)*

> **Kurzantwort:** Die Theory of Constraints (TOC, auf Deutsch auch Engpasstheorie) ist ein Managementansatz, den Eliyahu M. Goldratt entwickelt und 1984 mit dem Wirtschaftsroman *The Goal* (deutsch: *Das Ziel*) bekannt gemacht hat. Sie besagt, dass die Leistung jedes Systems durch sehr wenige Engpässe begrenzt wird, oft durch einen einzigen, und dass Verbesserungsarbeit deshalb zuerst dort ansetzen sollte. Umgesetzt wird das mit fünf Fokussierungsschritten (identifizieren, ausschöpfen, unterordnen, erweitern, Trägheit verhindern), der Planungsmethode Drum-Buffer-Rope und dem Throughput Accounting [1][4][6].

> **Das Wichtigste in Kürze**
> - *The Goal* von Eliyahu M. Goldratt und Jeff Cox erschien erstmals 1984 bei North River Press; bis 2011 wurden mehr als 5 Millionen Exemplare in 35 Sprachen verkauft [1][2].
> - Die fünf Fokussierungsschritte lauten: Engpass identifizieren, ausschöpfen, alles andere ihm unterordnen, ihn erweitern und verhindern, dass Trägheit zum Engpass wird [4].
> - Eine Stunde, die am Engpass verloren geht, ist eine Stunde für das ganze Werk. Eine Stunde, die an einem Nicht-Engpass gespart wird, ändert nichts, solange sie den Engpass nicht entlastet.
> - Drum-Buffer-Rope (DBR, Trommel-Puffer-Seil) plant den Engpass (Trommel), schützt ihn mit einem Zeitpuffer (Puffer) und gibt Material nur in dem Tempo frei, das der Engpass verarbeiten kann (Seil) [6][8].
> - Throughput Accounting bewertet Entscheidungen nach Durchsatz (Umsatz minus wirklich variable Kosten), Bestand/Investition und Betriebsaufwand und reiht Produkte nach Durchsatz je Engpassminute. Das kann die Rangfolge der klassischen Kostenrechnung umkehren [6][19][20].
> - Engpässe sollten datenbasiert gefunden werden: mit einer Kapazitätsbelastungsrechnung, mit Beobachtung der Warteschlangen und, wo Maschinenzustandsdaten vorliegen, mit der Active-Period-Methode, die auch wandernde Engpässe sichtbar macht [13][14][15].
> - Eine Übersichtsarbeit von 2003 über mehr als 80 veröffentlichte TOC-Anwendungen fand große operative und finanzielle Verbesserungen und keinen einzigen berichteten Fehlschlag. Das sagt auch etwas darüber, welche Fälle veröffentlicht werden [10].
> - TOC, Lean und Six Sigma wirken am besten zusammen: TOC sagt, wo man ansetzt, Lean beseitigt Verschwendung und schafft Fluss, Six Sigma reduziert Streuung an der Stelle, auf die es ankommt.

## Inhaltsverzeichnis

1. [Was ist die Theory of Constraints? Definition und Grundidee](#was-ist-die-theory-of-constraints-definition-und-grundidee)
2. [Geschichte: Eliyahu Goldratt, OPT und Das Ziel](#geschichte-eliyahu-goldratt-opt-und-das-ziel)
3. [Engpass oder Constraint: Arten von Engpässen](#engpass-oder-constraint-arten-von-engpässen)
4. [Die fünf Fokussierungsschritte](#die-fünf-fokussierungsschritte)
5. [Theory of Constraints Beispiel: die fünf Schritte in einem Werk für Hydraulikblöcke](#theory-of-constraints-beispiel-die-fünf-schritte-in-einem-werk-für-hydraulikblöcke)
6. [Engpassanalyse: Engpass erkennen mit sechs Methoden](#engpassanalyse-engpass-erkennen-mit-sechs-methoden)
7. [Drum-Buffer-Rope mit Zahlen](#drum-buffer-rope-mit-zahlen)
8. [Simplified Drum-Buffer-Rope (S-DBR) für die Auftragsfertigung](#simplified-drum-buffer-rope-s-dbr-für-die-auftragsfertigung)
9. [Puffermanagement: der Regelkreis](#puffermanagement-der-regelkreis)
10. [Factory Physics hinter TOC: Little's Law und Variabilität](#factory-physics-hinter-toc-littles-law-und-variabilität)
11. [Throughput Accounting vs. Kostenrechnung](#throughput-accounting-vs-kostenrechnung)
12. [Die Denkprozesse (Thinking Processes)](#die-denkprozesse-thinking-processes)
13. [TOC vs. Lean vs. Six Sigma](#toc-vs-lean-vs-six-sigma)
14. [Über das Werk hinaus: Critical Chain und Nachschub](#über-das-werk-hinaus-critical-chain-und-nachschub)
15. [Vorlagen für die TOC-Arbeit](#vorlagen-für-die-toc-arbeit)
16. [Einführungsfahrplan: die ersten sechs Monate](#einführungsfahrplan-die-ersten-sechs-monate)
17. [TOC-Kennzahlen: Fortschritt messen](#toc-kennzahlen-fortschritt-messen)
18. [Typische Fehler](#typische-fehler)
19. [Kritik und Grenzen der Theory of Constraints](#kritik-und-grenzen-der-theory-of-constraints)
20. [Mensch und Arbeitssicherheit am Engpass](#mensch-und-arbeitssicherheit-am-engpass)
21. [TOC im digitalen Werk: Daten, Simulation und APS](#toc-im-digitalen-werk-daten-simulation-und-aps)
22. [Glossar](#glossar)
23. [FAQ: häufige Fragen zur Theory of Constraints](#faq-häufige-fragen-zur-theory-of-constraints)
24. [Fazit und erste Schritte](#fazit-und-erste-schritte)

**Welcher Abschnitt passt zu Ihrer Rolle?**

| Rolle | Einstieg |
|---|---|
| Werksleitung oder Leitung Produktion | Abschnitte 4, 5, 16 und 18 |
| Produktionsplaner oder Disponent | Abschnitte 6 bis 10 |
| Werkscontroller oder CFO | Abschnitte 11 und 17 |
| KVP-, Lean- oder Six-Sigma-Verantwortliche | Abschnitte 12, 13 und 15 |
| Studierende oder TOC-Einsteiger | Abschnitte 1 bis 5, dann das Glossar |

## Was ist die Theory of Constraints? Definition und Grundidee

Die Theory of Constraints ist eine Art, eine Organisation als Kette voneinander abhängiger Schritte zu führen. Ihr Ausgangspunkt ist einfach: Jedes System, das ein Ziel hat, besitzt mindestens einen Faktor, der begrenzt, wie viel von diesem Ziel es erreichen kann. Das TOC Institute nutzt das Bild der Kette: Eine Kette ist nur so stark wie ihr schwächstes Glied, und wer ein anderes Glied verstärkt, macht die Kette nicht stärker [4]. Goldratts spätere Bücher und die TOC-Community haben die Idee vom Shopfloor auf Distribution, Projekte, Finanzen und Strategie übertragen [6].

Für ein Produktionswerk wird das Ziel meist so formuliert: jetzt und in Zukunft Geld verdienen. Der begrenzende Faktor kann eine Maschine sein, eine Qualifikation, ein Lieferant, eine Regel oder der Markt selbst. TOC nennt ihn den Constraint, auf Deutsch meist Engpass. Die Kernaussage: Die meisten Systeme haben zu jedem Zeitpunkt nur einen oder sehr wenige Engpässe. Laut TOC Institute haben die meisten Systeme eine kapazitätsbeschränkte Ressource und selten mehr als zwei oder drei [4].

### Die Grundidee in einem Absatz

Wenn die Leistung eines Werks durch eine Ressource begrenzt ist, dann entspricht die Leistung des Werks der Leistung dieser Ressource. Jede Minute, die diese Ressource verliert, ist eine Minute Ausbringung, die das Werk endgültig verliert. Jede Minute, die anderswo eingespart wird, ist bestenfalls freie Kapazität und schlimmstenfalls zusätzlicher Bestand, der vor dem Engpass wartet. Deshalb sagt TOC, dass lokale Effizienzen an Nicht-Engpässen sich nicht zur Werksleistung addieren. Jeden Schritt einzeln optimieren zu wollen, ist vergebliche Mühe; TOC verbessert das Gesamtsystem über seinen Engpass.

### Theory of Constraints in der Produktion: warum sie in der Praxis zählt

Drei alltägliche Situationen im Werk zeigen die Idee:

| Situation | Typische Reaktion ohne TOC | Reaktion mit TOC |
|---|---|---|
| Aufträge sind verspätet, überall liegt Umlaufbestand (WIP) | Eilaufträge, überall Überstunden, Aufträge früher starten | die eine Ressource finden, die die Ausbringung begrenzt, und Arbeit in ihrem Takt freigeben |
| Eine Nicht-Engpassmaschine steht still | Arbeit für sie suchen, damit die "Effizienz" hoch bleibt | sie warten lassen; Stillstand an einem Nicht-Engpass ist normal und billig |
| Eine neue Maschine wird beantragt | genehmigen, weil die Abteilung ausgelastet ist | fragen, ob sie Kapazität am Engpass schafft und was sie für den Durchsatz bedeutet |

### Vorteile der Theory of Constraints

Am häufigsten berichtet werden kürzere Lieferzeiten, bessere Termintreue, weniger Bestand und höherer Durchsatz. Eine Auswertung veröffentlichter Anwendungen durch Mabin und Balderstone, zusammengefasst von Panizzolo, berichtete mittlere Verbesserungen von 70 Prozent bei der Lieferzeit vom Auftrag bis zur Auslieferung, 65 Prozent bei der Durchlaufzeit in der Fertigung, 49 Prozent beim Bestand, 63 Prozent bei Durchsatz oder Umsatz und 44 Prozent bei der Termintreue [11]. Panizzolo ordnet diese Mittelwerte der Buchveröffentlichung *The World of the Theory of Constraints* (2000) von Mabin und Balderstone zu; der Zeitschriftenartikel derselben Autoren von 2003 wertet denselben Bestand von mehr als 80 Fällen aus [10][11]. Diese Werte sind als obere Grenze des Möglichen zu lesen: Sie stammen aus veröffentlichten Erfolgsgeschichten, und die ursprüngliche Auswertung fand überhaupt keine Berichte über Fehlschläge [10]. Abschnitt 19 erläutert, was das bedeutet.

Über die Zahlen hinaus gibt TOC einem Werk eine gemeinsame Antwort auf die Frage "Wo arbeiten wir zuerst?" Das ist oft die größte Veränderung: weniger Verbesserungsprojekte, dafür gezielt dort, wo sie das Ergebnis verändern.

## Geschichte: Eliyahu Goldratt, OPT und Das Ziel

Eliyahu M. Goldratt wurde am 31. März 1947 geboren und starb am 11. Juni 2011 in seinem Haus in Israel. Er hatte einen BSc der Universität Tel Aviv sowie einen MSc und einen PhD der Bar-Ilan-Universität [2][3]. Bevor TOC ihren Namen hatte, arbeitete er bei Creative Output, einem Unternehmen, das die Produktionsplanungssoftware Optimized Production Technology (OPT) vertrieb [3].

| Jahr | Meilenstein | Quelle |
|---|---|---|
| vor 1984 | Planungssoftware OPT, vertrieben von Creative Output, die technische Wurzel von Drum-Buffer-Rope (genaues Einführungsjahr [unbelegt]) | [3] |
| 1984 | *The Goal: Excellence in Manufacturing* von Goldratt und Jeff Cox, North River Press, 262 Seiten | [1] |
| etwa 1985 | Gründung des Avraham Y. Goldratt Institute, nachdem Goldratt Creative Output verlassen hatte | [3] |
| 1986 | *The Race* (mit Robert E. Fox) beschreibt Drum-Buffer-Rope im Detail; erste überarbeitete Auflage von *The Goal* | [3][7][8] |
| 1990 bis 1991 | *The Haystack Syndrome*: Durchsatz, Bestand und Betriebsaufwand als Entscheidungsgrößen | [3][20] |
| 1992 | zweite überarbeitete Auflage von *The Goal* | [3][7] |
| 1994 | *It's Not Luck*: Denkprozesse für Marketing und Strategie | [3][12] |
| 1997 | *Critical Chain*: TOC im Projektmanagement | [3] |
| 2000 | *Necessary But Not Sufficient*: TOC und Unternehmenssoftware | [3] |
| 2004 | dritte überarbeitete Auflage von *The Goal* | [7] |
| 2009 | *Isn't It Obvious?* (Handel und Distribution) | [3] |
| 2010 | *Theory of Constraints Handbook* (Hrsg. Cox und Schleier), das Standardwerk zu DBR, S-DBR und Puffermanagement | [9] |
| 2011 | Goldratt stirbt; *The Goal* wird von Time unter die 25 einflussreichsten Managementbücher gezählt (Time-Liste, wie von Wikipedia zitiert) | [2][7] |
| 2014 | vierte überarbeitete Auflage (Jubiläumsausgabe zum 30. Jahrestag) von *The Goal* (Auflagenliste aus einer Infobox ohne Beleg) | [7] |

### Das Ziel: ein Roman als Lehrbuch

*The Goal* erzählt die Geschichte von Alex Rogo, einem Werksleiter, dessen Werk drei Monate Zeit hat, die Wende zu schaffen. Sein früherer Physikprofessor Jonah führt ihn mit Fragen statt mit Antworten [7]. Die meistzitierte Szene ist eine Pfadfinderwanderung: Die Gruppe kann nur so schnell gehen wie ihr langsamster Junge, Herbie, und die Lücken in der Reihe werden immer größer, solange die schnellen Läufer das Tempo bestimmen. Rogos Lösung: Herbie geht vorne, sein Rucksack wird leichter gemacht, und die Gruppe wird zusammengebunden. Das sind die fünf Fokussierungsschritte und Drum-Buffer-Rope an einem Nachmittag: Herbie identifizieren, ihn ausschöpfen (leichterer Rucksack), die Gruppe seinem Tempo unterordnen und die Reihe kurz halten.

Die Romanform machte die Ideen für Meister und Werker zugänglich, nicht nur für Ingenieure. North River Press meldete 2011, dass das Buch mehr als 5 Millionen Mal in 35 Sprachen verkauft worden war [2].

### Von OPT zur Managementphilosophie

TOC wuchs in Stufen. Die erste Stufe war die Planung (OPT, dann DBR). Die zweite war die Bewertung (Throughput Accounting). Die dritte war eine allgemeine Problemlösungsmethode (die Denkprozesse). Die vierte übertrug die Logik auf Projekte (Critical Chain) und Distribution (Nachschub) [6][12]. Heute zertifiziert die Theory of Constraints International Certification Organization (TOCICO), eine gemeinnützige Organisation nach US-Recht (501(c)(3)), Fachleute in drei Stufen: Grundlagenprüfungen, Praktikerprüfungen und eine Bewertung als Implementierer [5].

## Engpass oder Constraint: Arten von Engpässen

Die Begriffe "Constraint" und "Bottleneck" werden oft gleichbedeutend verwendet. Ganz gleich sind sie nicht. Im Deutschen heißt meist beides "Engpass"; die Unterscheidung lohnt sich trotzdem.

- Ein **Bottleneck** (Kapazitätsengpass) ist eine Ressource, deren Kapazität kleiner ist als die Nachfrage, die auf ihr lastet. Es ist ein Kapazitätsbegriff.
- Ein **Constraint** ist alles, was die Leistung des Systems in Richtung seines Ziels begrenzt. Das kann ein Kapazitätsengpass sein, aber auch der Markt, ein Material, eine Regel oder eine Denkweise.
- Eine **kapazitätsbeschränkte Ressource (Capacity Constrained Resource, CCR)** ist im Durchschnitt kein Engpass, wird aber zu einem, wenn sie nicht sorgfältig gesteuert wird, zum Beispiel wegen Spitzen im Produktmix.

Jeder Kapazitätsengpass begrenzt den Durchsatz nur, wenn er auf dem Weg der Aufträge liegt, die zählen. Ein Werk kann eine "Engpassmaschine" haben, die mit Arbeit niedriger Priorität überladen ist, während der eigentliche Engpass der Markt ist. TOC fragt deshalb zuerst: Was begrenzt das Ziel?

### Arten von Engpässen

| Art | Beispiel | Woran man es merkt | Typischer erster Schritt |
|---|---|---|---|
| Physisch: Anlagen | ein 5-Achs-Bearbeitungszentrum, ein Härteofen, eine Lackierlinie | dauerhafte Warteschlange davor, wartende Ressourcen dahinter | ausschöpfen: keine verlorenen Minuten |
| Physisch: Personal und Qualifikation | nur zwei zertifizierte Schweißer pro Schicht | Arbeit wartet auf bestimmte Personen | Mehrfachqualifizierung, Planung um die Qualifikationen herum |
| Material | ein Gussteil mit 16 Wochen Lieferzeit | die Montage wartet auf ein Teil | Nachschubpuffer, zweite Bezugsquelle |
| Markt | Nachfrage unter der Werkskapazität | überall freie Kapazität, Absatz unter Plan | der Engpass liegt außen; Angebot und Lieferzeit verbessern |
| Regel (Policy) | "nur volle Lose fahren", "jede Maschine über 85 % Effizienz halten" | Regeln, die falsches Verhalten erzwingen | Denkprozesse, Regel ändern |
| Denkmuster (Paradigma) | "Bestand ist ein Vermögenswert", "ein ausgelastetes Werk ist ein gutes Werk" | Widerstand gegen stillstehende Nicht-Engpässe | Schulung, Planspiele |

In der Praxis verdienen Regelengpässe besondere Aufmerksamkeit: Ein physischer Engpass wird oft durch eine Regel gebremst (Mindestlosgrößen, Freigaberegeln, Auslastungsziele) statt durch seine tatsächliche Kapazität. Das durchgerechnete Beispiel in Abschnitt 5 zeigt zwei solche Regeln.

### Statische, dynamische und wandernde Engpässe

Ein **statischer** Engpass bleibt monatelang auf derselben Ressource. Ein **dynamischer** oder **wandernder** Engpass springt mit Produktmix, Störungen oder Personalbesetzung zwischen Ressourcen. Der Unterschied bestimmt die Methodenwahl: Ein statischer Engpass lässt sich mit einer festen DBR-Einstellung führen, ein wandernder Engpass braucht Daten und oft ein APS, das die Belastung je Ressource für den aktuellen Auftragsbestand berechnet [13][14]. Abschnitt 6 zeigt, wie man sie unterscheidet.

### VATI: der Werkstyp prägt den Engpass

TOC ordnet Werke nach der Form ihres Materialflusses ein, die sogenannte VATI-Analyse [6][9]:

| Typ | Flussform | Beispiel | Typisches Problem |
|---|---|---|---|
| V | wenige Rohstoffe verzweigen sich in viele Produkte | Stahl, Papier, Chemie, Extrusion | Fehlzuordnung: Material wird zu früh dem falschen Produkt zugeschlagen |
| A | viele Teile laufen in wenigen Produkten zusammen | Luftfahrtmontage, Maschinenbau | Teile kommen unsynchronisiert an, die Montage wartet auf das letzte Teil |
| T | wenige Komponenten, spät zu vielen Varianten montiert | Elektronik, Haushaltsgeräte | Teile werden zwischen Varianten "geklaut", Fertigwaren passen nicht zur Nachfrage |
| I | gerade Linie | einfache Bearbeitungslinien | klassisches Engpassverhalten |

Die meisten realen Werke sind Mischformen. Der Werkstyp zeigt, wohin die Puffer gehören: vor die Montage in einem A-Werk, vor die Verzweigung in einem V-Werk.

## Die fünf Fokussierungsschritte

Die fünf Fokussierungsschritte sind das Kernverfahren der TOC. Das TOC Institute formuliert sie so: den Engpass des Systems identifizieren, den Engpass ausschöpfen, alles andere dem Engpass unterordnen, den Engpass erweitern und verhindern, dass Trägheit zum Engpass wird [4]. Goldratt nannte diesen Kreislauf den Prozess der fortlaufenden Verbesserung (Process of Ongoing Improvement, POOGI), so lautet auch der Untertitel späterer Auflagen von *The Goal* [6]. Weil Schritt 5 zu Schritt 1 zurückführt, bilden die fünf Schritte einen kontinuierlichen Verbesserungskreislauf, verwandt mit dem KVP: Ist ein Systemengpass beseitigt, taucht an anderer Stelle ein neuer auf, und die Arbeit beginnt von vorn.

Vor Schritt 1 müssen zwei Fragen beantwortet sein: Was ist das Ziel des Systems, und woran messen wir den Fortschritt? In einem Unternehmen nutzt TOC dafür Durchsatz, Bestand (oder Investition) und Betriebsaufwand (Abschnitt 11).

| Schritt | Frage | Bedeutung im Werk | Was es nicht bedeutet |
|---|---|---|---|
| 1. Identifizieren | Was begrenzt den Durchsatz gerade? | die Ressource, das Material, den Markt oder die Regel finden, die das Tempo bestimmt | die Maschine mit den meisten Störungen oder dem höchsten Preis auswählen |
| 2. Ausschöpfen | Wie holen wir mit dem Vorhandenen das Meiste heraus? | keine verlorenen Minuten, keine fehlerhafte Arbeit, der richtige Produktmix | Kapazität zukaufen |
| 3. Unterordnen | Wie unterstützt alles andere Schritt 2? | Freigabe, Losgrößen, Instandhaltung, Qualität und Personaleinsatz richten sich nach dem Engpass | jede Ressource beschäftigt halten |
| 4. Erweitern | Wenn es immer noch nicht reicht: Wie schaffen wir Kapazität? | Überstunden, Fremdvergabe, eine zweite Maschine, ein neuer Lieferant | der erste Reflex |
| 5. Trägheit verhindern | Ist der Engpass gewandert? Sind alte Regeln jetzt der Engpass? | zurück zu Schritt 1, Regeln überprüfen, die für den alten Engpass gemacht wurden | den Sieg ausrufen |

### Schritt 1: Den Engpass identifizieren

Der Engpass ist die Ressource, deren Kapazität im Verhältnis zur Nachfrage am kleinsten ist. In der Praxis beginnt man mit einer Belastungsrechnung (Nachfrage mal Bearbeitungszeit gegen verfügbare Zeit) und bestätigt sie dann vor Ort: Wo staut sich Arbeit, wo warten Leute auf eine Ressource, nach welcher Ressource fragen die Meister ständig? Das TOC Institute ergänzt, dass ein falsch identifizierter Engpass leicht und ohne bleibenden Schaden korrigiert werden kann. Das ist ein guter Grund, nicht auf perfekte Daten zu warten [4]. Abschnitt 6 beschreibt sechs Methoden zur Engpasserkennung.

### Schritt 2: Den Engpass ausschöpfen

Ausschöpfen heißt, den Engpass so produktiv wie möglich zu machen, ohne nennenswert Geld auszugeben. Laut TOC Institute wird ein Engpass, gerechnet auf einen 24/7-Betrieb, oft weniger als 50 Prozent der Zeit genutzt, und die ersten drei Schritte legen typischerweise innerhalb weniger Monate mindestens 30 Prozent verborgene Kapazität frei. Für beide Aussagen gibt es keinen veröffentlichten Datensatz, sie sollten also im eigenen Werk geprüft werden [4]. Typische Maßnahmen zum Ausschöpfen:

- Pausen, Schichtwechsel und Besprechungen abdecken, damit der Engpass weiterläuft;
- die Rüstvorbereitung aus der Laufzeit des Engpasses herausnehmen (externes Rüsten, siehe den Leitfaden [SMED und Rüstzeitreduzierung](https://www.m365.fm/learn/smed-ruestzeitreduzierung/));
- vor dem Engpass prüfen, damit er nie ein Teil bearbeitet, das schon Ausschuss ist (in AS9100- oder IATF-16949-Umgebungen heißt das Verlegen eines Prüfpunkts, Produktionslenkungsplan und Prozess-FMEA zu aktualisieren);
- die Qualität direkt nach dem Engpass prüfen, weil ein später verschrottetes Teil Engpasszeit kostet;
- einen Arbeitsvorrat vor dem Engpass halten, damit er nie leerläuft;
- ihm Vorrang bei Instandhaltung, Programmierung, Werkzeugen und Materialtransport geben;
- den Produktmix nach Durchsatz je Engpassminute wählen (Abschnitt 11);
- Arbeit auslagern, die andere Ressourcen erledigen können, auch wenn sie dort weniger effizient läuft.

### Schritt 3: Alles andere unterordnen

Das Unterordnen ist der schwierigste Schritt, weil er lokalen Effizienzkennzahlen widerspricht. Nicht-Engpässe müssen freie Kapazität haben, und sie sollen sie nutzen, um den Engpass zu schützen, nicht um Bestand aufzubauen. Beispiele:

- **Freigabe:** Material kommt im Takt des Engpasses ins Werk (das Seil bei DBR).
- **Losgrößen:** Nicht-Engpässe können kleine Lose und mehr Rüstvorgänge fahren, weil sie freie Kapazität haben; der Engpass braucht unter Umständen größere Lose, um Rüstzeit zu sparen.
- **Instandhaltung:** Eine Störung am Engpass bekommt den nächsten freien Techniker; vorbeugende Instandhaltung am Engpass wird in geplante Stillstände gelegt.
- **Qualität:** Die Erstteilfreigabe am Engpass hat Vorrang vor anderen Erstteilprüfungen.
- **Kennzahlen:** Abteilungen an Nicht-Engpässen nicht mehr für Auslastung oder "verdiente Stunden" belohnen.

Das TOC Institute weist darauf hin, dass häufig wandernde Engpässe Regeln, Abläufe und Menschen durcheinanderbringen [4]. Zum Unterordnen gehört deshalb auch, die Position des Engpasses zu sichern, zum Beispiel indem andere Ressourcen deutlich mehr Kapazität haben als der Engpass.

### Schritt 4: Den Engpass erweitern

Erst wenn die Schritte 2 und 3 umgesetzt sind, sollte Geld für Kapazität ausgegeben werden. Möglichkeiten zum Erweitern sind Überstunden oder eine Zusatzschicht nur am Engpass, die Fremdvergabe eines Teils seiner Arbeit, zusätzliches Personal, neue Anlagen oder eine Konstruktionsänderung, damit das Produkt weniger Engpasszeit braucht. Viele Werke springen direkt zu diesem Schritt und kaufen eine Maschine, während der vorhandene Engpass noch ein Viertel seiner Zeit durch Pausen, Rüsten und Materialmangel verliert.

### Schritt 5: Verhindern, dass Trägheit zum Engpass wird

Wenn Ausschöpfen und Erweitern greifen, wandert der Engpass oft, und es entsteht ein neuer: an einer anderen Maschine, bei einem Lieferanten oder im Markt. Regeln, die für den alten Engpass richtig waren, richten jetzt Schaden an. Typische Trägheit: Die große Losgröße des alten Engpasses bleibt im Arbeitsplan stehen, eine Freigaberegel, die an die alte Trommel gekoppelt war, bleibt im ERP, oder der Vertrieb rationiert weiter Aufträge, obwohl das Werk inzwischen freie Kapazität hat. Zurück zu Schritt 1 und die Regeln überprüfen.

## Theory of Constraints Beispiel: die fünf Schritte in einem Werk für Hydraulikblöcke

Das folgende Beispiel ist für diesen Leitfaden konstruiert. Die Zahlen sind für eine kleine US-Lohnfertigung plausibel, stammen aber nicht aus einem realen Unternehmen.

### Das Werk

Ein Werk mit 60 Beschäftigten im Mittleren Westen der USA fertigt Hydraulik-Steuerblöcke (Manifolds) in zwei Produktfamilien:

- **Produkt A** (Standardblock): Preis 900 USD, Rohmaterial und Kaufteile 400 USD.
- **Produkt B** (kundenspezifischer Block): Preis 1.200 USD, Rohmaterial und Kaufteile 450 USD.

Das Werk arbeitet in zwei 8-Stunden-Schichten an fünf Tagen pro Woche: 80 Stunden oder 4.800 Minuten verfügbare Zeit je Ressource und Woche. Die Wochennachfrage beträgt 100 Stück A und 60 Stück B. Der Betriebsaufwand (alle Löhne, Gehälter, Miete, Energie, Abschreibungen; alles außer dem wirklich variablen Material) beträgt 62.000 USD pro Woche.

### Schritt 1: Den Engpass mit einer Belastungstabelle identifizieren

Bearbeitungszeiten in Minuten je Stück, aus den Arbeitsplänen und vor Ort per Zeitaufnahme bestätigt:

| Ressource | A (min/Stück) | B (min/Stück) | Belastung A (100 Stück) | Belastung B (60 Stück) | Gesamtbelastung (min) | Belastung vs. 4.800 min |
|---|---|---|---|---|---|---|
| Säge | 8 | 10 | 800 | 600 | 1.400 | 29 % |
| 5-Achs-CNC-Zelle | 25 | 40 | 2.500 | 2.400 | 4.900 | **102 %** |
| Entgraten und Waschen | 12 | 12 | 1.200 | 720 | 1.920 | 40 % |
| Montage | 15 | 20 | 1.500 | 1.200 | 2.700 | 56 % |
| Druckprüfung | 10 | 15 | 1.000 | 900 | 1.900 | 40 % |

**Rechnung für die CNC-Zelle:** 100 × 25 + 60 × 40 = 2.500 + 2.400 = 4.900 Minuten gegenüber 4.800 verfügbaren, eine Belastung von 4.900 ÷ 4.800 = 102 Prozent. Schon auf dem Papier kann die CNC-Zelle die Nachfrage nicht decken.

Die Belastungstabelle verwendet nur theoretische Zeiten. Die Wirklichkeit ist schlechter. Eine zweiwöchige Zeitstudie an der CNC-Zelle (Schichtprotokoll plus Maschinenzustandsdaten) zeigte, wohin die 4.800 Minuten gingen:

| Nutzung der CNC-Zeit pro Woche | Minuten | Anteil |
|---|---|---|
| Produktive Bearbeitung von Gutteilen | 3.600 | 75,0 % |
| Nicht abgedeckte Pausen und Schichtübergaben (2 Schichten × 30 min × 5 Tage) | 300 | 6,3 % |
| Rüstvorgänge (15 pro Woche × 30 min) | 450 | 9,4 % |
| Leerlauf: Warten auf Material, Programme oder Vorrichtungen | 250 | 5,2 % |
| Ungeplante Stillstände | 100 | 2,1 % |
| Bearbeitung von Teilen, die später bei der Druckprüfung Ausschuss werden | 100 | 2,1 % |
| **Summe** | **4.800** | **100 %** |

Die effektive Kapazität des Engpasses liegt also bei 3.600 Minuten pro Woche, bei einer Nachfrage von 4.900. Das Werk kann etwa 73 Prozent der Nachfrage decken (3.600 ÷ 4.900).

Der Shopfloor bestätigte die Zahlen: Vor der CNC-Zelle wartete im Schnitt Arbeit für 2,5 Tage, während Montage und Druckprüfung regelmäßig auf Teile warteten. Die Meister hatten die Montage als Engpass benannt, weil sie "immer hinterher" war. Hinterher war sie aber, weil die CNC-Zelle sie nicht versorgte.

### Schritt 2a: Ausschöpfen über den Produktmix

Mit 3.600 effektiven Minuten kann das Werk nicht alles fertigen. Welche Produkte sollen zuerst gefertigt werden? Hier geben Throughput Accounting und klassische Kostenrechnung unterschiedliche Antworten (Abschnitt 11 erläutert die Logik im Detail).

| | Produkt A | Produkt B |
|---|---|---|
| Preis | 900 USD | 1.200 USD |
| Wirklich variable Kosten (Material) | 400 USD | 450 USD |
| Durchsatz je Stück (T) | 500 USD | 750 USD |
| CNC-Minuten je Stück | 25 | 40 |
| **Durchsatz je CNC-Minute** | **20,00 USD** | **18,75 USD** |
| Marge zu Standardkosten je Stück (siehe Abschnitt 11) | 161,20 USD | 280,52 USD |

Produkt B sieht je Stück besser aus, nach beiden Methoden. Je Engpassminute verdient aber A mehr.

- **Mix 1, B zuerst (was der Kostenbericht nahelegt):** 60 B belegen 2.400 min; mit den restlichen 1.200 min werden 48 A gefertigt. Durchsatz = 60 × 750 USD + 48 × 500 USD = 45.000 USD + 24.000 USD = **69.000 USD**. Nettogewinn = 69.000 USD − 62.000 USD = **7.000 USD pro Woche**.
- **Mix 2, A zuerst (Durchsatz je Engpassminute):** 100 A belegen 2.500 min; mit den restlichen 1.100 min werden 27 B gefertigt (27 × 40 = 1.080 min). Durchsatz = 100 × 500 USD + 27 × 750 USD = 50.000 USD + 20.250 USD = **70.250 USD**. Nettogewinn = 70.250 USD − 62.000 USD = **8.250 USD pro Woche**.

Der engpassorientierte Mix bringt 1.250 USD mehr pro Woche, bei 52 Wochen etwa 65.000 USD pro Jahr, ohne jede Investition. Er verändert auch das Gespräch mit dem Vertrieb: B-Kunden brauchen längere zugesagte Lieferzeiten oder einen Preis, der den Engpassverbrauch von B widerspiegelt.

### Schritt 2b: Ausschöpfen über verlorene Zeit

Danach ging das Team die Verluste aus der Zeitstudie an:

| Maßnahme | Kosten | Zurückgewonnene Minuten pro Woche |
|---|---|---|
| Pausen versetzen; ein geschulter Springer hält die Zelle am Laufen | 1.500 USD pro Woche (anteilig für einen Springer) | 300 |
| Externe Rüstvorbereitung: Werkzeuge voreingestellt, Vorrichtungen und Programme bereitgestellt, bevor die Maschine stoppt; Rüstzeit von 30 auf 18 min | etwa 6.000 USD einmalig für ein Werkzeugvoreinstellgerät und Rüstwagen | 180 (15 × 12 min) |
| Material und Programme eine Schicht im Voraus bereitgestellt (ein Zeitpuffer, siehe Abschnitt 7) | keine | 200 |
| Kritische Bohrungsmaße direkt nach der Bearbeitung statt bei der Druckprüfung geprüft | Messmittel, etwa 2.500 USD einmalig | 70 |
| Vorbeugende Instandhaltung ins geplante Wochenendfenster verlegt | keine | 50 |
| **Summe** | | **800** |

Die effektive Kapazität steigt von 3.600 auf 4.400 Minuten pro Woche, ein Plus von 22 Prozent (800 ÷ 3.600). Mit Mix 2 fertigt das Werk jetzt 100 A (2.500 min) und 47 B (47 × 40 = 1.880 min, zusammen 4.380 min).

Durchsatz = 100 × 500 USD + 47 × 750 USD = 50.000 USD + 35.250 USD = **85.250 USD pro Woche**. Der Betriebsaufwand steigt um den Springer: 62.000 USD + 1.500 USD = 63.500 USD. Nettogewinn = 85.250 USD − 63.500 USD = **21.750 USD pro Woche**, nach vorher 8.250 USD. Die einmaligen Ausgaben von etwa 8.500 USD sind in weniger als einer Woche zurückverdient.

Das ist das typische TOC-Muster: Weil der Betriebsaufwand kurzfristig weitgehend fix ist, fließt jede zusätzliche Engpassminute fast vollständig in den Gewinn.

### Schritt 3: Den Rest des Werks unterordnen

Um die 800 Minuten zu halten, musste sich der Rest des Werks ändern:

- Die Säge hörte auf, "auf Beschäftigung" zu sägen. Sie sägt jetzt nur noch, was der CNC-Plan braucht, freigegeben eine Schicht im Voraus (das Seil).
- Die CNC-Zelle fährt eine feste Wochenreihenfolge, die Produkte nach Vorrichtungsfamilien bündelt; Säge und Entgraten folgen dieser Reihenfolge.
- Die Instandhaltung bedient CNC-Rufe zuerst; Zielreaktionszeit 10 Minuten.
- Das Qualitätslabor erledigt CNC-Erstteilprüfungen vor allen anderen Anfragen.
- Die Meister von Säge und Entgraten werden nicht mehr an der Auslastung gemessen. Ihre Kennzahl lautet "Die CNC wartet nie auf uns".

Die Auslastung der Säge sinkt von etwa 45 Prozent (sie baute Bestand auf) auf 29 Prozent. Das ist gewollt. In TOC-Begriffen ist der Stillstand der Säge der Preis für einen geschützten Engpass.

### Schritt 4: Den Engpass erweitern

Nach dem Ausschöpfen bleiben pro Woche noch 13 Stück B ungedeckt (60 − 47). Drei Möglichkeiten zum Erweitern:

| Option | Zusätzliche Engpassminuten | Zusätzlicher Durchsatz pro Woche | Zusätzlicher Betriebsaufwand pro Woche | Nettoeffekt pro Woche | Kommentar |
|---|---|---|---|---|---|
| Samstagsschicht nur an der CNC-Zelle (8 h, besetzt über freiwillige Meldung oder die Überstundenregeln des Tarifvertrags) | 480 | 12 B × 750 USD = 9.000 USD | 1.200 USD Überstundenzuschlag und Unterstützung | **+7.800 USD** | schnell, umkehrbar |
| Schruppbearbeitung von B an einen Lohnfertiger vergeben, 180 USD je Stück | 13 B brauchen nicht mehr die vollen 40 min | 13 × (750 USD − 180 USD) = 7.410 USD | Koordination, etwa 300 USD | **+7.110 USD** | T je Stück sinkt auf 570 USD, weil die Kosten des Lohnfertigers wirklich variabel sind |
| Zweite 5-Achs-Maschine kaufen, 650.000 USD | 4.800 | 13 B × 750 USD = 9.750 USD (die Nachfrage begrenzt den Gewinn) | 4.000 USD (Bediener, Abschreibung, Service) | **+5.750 USD** | Amortisation etwa 650.000 USD ÷ 5.750 USD = 113 Wochen, sofern die Nachfrage nicht wächst |

Die Samstagsschicht gewinnt. Die zweite Maschine lohnt sich nur, wenn der Vertrieb sie füllen kann, denn sobald sie steht, wandert der Engpass in den Markt. Die Finanzprüfung ist einfach: Erhöht die Option T minus OE, und um wie viel im Verhältnis zur Investition? Abschnitt 11 zeigt die Formeln.

### Schritt 5: Trägheit verhindern

Mit der Samstagsschicht hat die CNC-Zelle 4.880 effektive Minuten, genug für die volle Nachfrage von 4.900 bis auf wenige Minuten, und jetzt ist die Nachfrage die Grenze. Neues Belastungsbild:

| Ressource | Belastung bei voller Nachfrage | Belastung vs. verfügbar |
|---|---|---|
| CNC-Zelle (mit Samstag) | 4.900 | etwa 100 % der effektiven Zeit |
| Montage | 2.700 | 56 % |
| Druckprüfung | 1.900 | 40 % |

Der Engpass ist dabei, in den Markt zu wandern. In der Überprüfung tauchten zwei Trägheitsfallen auf:

1. Im ERP stand noch die alte Mindestlosgröße von 40 für B, vor Jahren festgelegt, um CNC-Rüstvorgänge zu sparen. Mit den schnelleren Rüstvorgängen verhinderte sie kurze Lieferzeiten. Die Losgröße wurde auf 10 gesenkt.
2. Der Vertrieb sagte für B noch sechs Wochen zu, "weil das Werk immer voll ist". Die zugesagte Lieferzeit wurde auf drei Wochen verkürzt, was innerhalb eines Quartals zwei neue B-Kunden brachte.

Zurück zu Schritt 1: Wenn die neuen B-Kunden die Nachfrage erhöhen, wird die CNC-Zelle wieder zum Engpass, und die Option zweite Maschine wird neu gerechnet. Diese Schleife ist der Prozess der fortlaufenden Verbesserung.

### Was das Beispiel lehrt

| Lehre | Beleg im Beispiel |
|---|---|
| Der sichtbare Engpass ist nicht unbedingt der Constraint | die Meister beschuldigten die Montage, die aber nicht versorgt wurde |
| Ausschöpfen schlägt Investieren | 800 Minuten für 8.500 USD einmalig plus 1.500 USD pro Woche statt 650.000 USD |
| Die Kostenrechnung kann Produkte falsch reihen | B sah je Stück besser aus, A verdient je Engpassminute mehr |
| Nicht-Engpässe sollen Leerlauf haben | die Säge ging von 45 % auf 29 % Auslastung |
| Alte Regeln überleben alte Engpässe | die Losgröße 40 und die Zusage von sechs Wochen |

## Engpassanalyse: Engpass erkennen mit sechs Methoden

Engpassanalyse heißt, die Ressource zu finden, die den Durchsatz begrenzt, zu messen, wie viel Ausbringung sie kostet, und zu prüfen, ob sie wandert. Sie ist Schritt 1 der fünf Fokussierungsschritte und sollte immer dann wiederholt werden, wenn sich Produktmix, Nachfrage oder Produktionsplan ändern.

Der Engpass ist nicht immer die teuerste Maschine, die mit den meisten Störungen oder die Abteilung mit dem lautesten Meister. Mehr als eine Methode verwenden und prüfen, ob die Ergebnisse übereinstimmen.

### Methode 1: Kapazitätsbelastungsrechnung

Für jede Ressource wird die Zeit, die die Nachfrage erfordert, mit der verfügbaren Zeit verglichen.

**Formel:** Belastung (%) = Σ (Nachfrage je Produkt × Bearbeitungszeit je Stück, einschließlich Rüsten) ÷ verfügbare Zeit × 100

Die Ressource mit der höchsten Belastung ist der Engpasskandidat. Abschnitt 5 zeigt die Rechnung; die CNC-Zelle lag mit theoretischen Zeiten bei 102 Prozent. Zwei Verfeinerungen machen die Methode verlässlich:

1. **Effektive statt nominaler Zeit verwenden.** Die theoretische Belastung durch den Anteil der Zeit teilen, in dem die Ressource tatsächlich Gutteile produziert (Verfügbarkeit × Qualität oder ein gemessener produktiver Anteil). Eine Ressource mit 85 Prozent Belastung auf dem Papier und 75 Prozent produktivem Anteil liegt in Wirklichkeit bei 113 Prozent (85 ÷ 0,75).
2. **Den realen Produktmix des Planungszeitraums verwenden.** Eine Ressource kann in einer B-lastigen Woche der Engpass sein und in einer A-lastigen Woche nicht.

Stärke: braucht nur Arbeitspläne, Nachfrage und einen Kalender. Schwäche: Arbeitspläne sind oft falsch, und die Methode ignoriert Streuung und wandernde Engpässe.

### Methode 2: Warteschlangen und Umlaufbestand beobachten

Vor einem Engpass stapelt sich Arbeit, und die Ressourcen dahinter warten. An mehreren Tagen zur selben Uhrzeit die Arbeit vor jeder Ressource zählen (in Arbeitsstunden, nicht in Stück). Eine Ressource mit großer, dauerhafter Warteschlange und unterversorgten Ressourcen dahinter ist wahrscheinlich der Engpass. Vorsicht: Eine Warteschlange kann auch vor einer Ressource liegen, die in großen Losen beliefert wird oder nach einer Regel auf Vorrat arbeitet.

### Methode 3: Der Engpassrundgang

Christoph Roser empfiehlt den Engpassrundgang (Bottleneck Walk) als Shopfloor-Methode, wenn Maschinenzustandsdaten fehlen [15]. Die Linie mehrmals pro Schicht ablaufen und für jeden Prozess notieren, ob er arbeitet, unterversorgt ist (wartet auf Eingang) oder blockiert ist (kann Arbeit nicht weitergeben). Ein Prozess, der meistens arbeitet, mit blockierten Prozessen davor und unterversorgten danach, ist der Engpass. Über mehrere Tage wiederholen, um zu sehen, ob er wandert.

| Rundgang um | Säge | CNC-Zelle | Entgraten | Montage | Prüfung |
|---|---|---|---|---|---|
| 07:30 | blockiert | arbeitet | unterversorgt | unterversorgt | arbeitet |
| 09:00 | arbeitet | arbeitet | arbeitet | unterversorgt | unterversorgt |
| 10:30 | blockiert | arbeitet | unterversorgt | arbeitet | unterversorgt |
| 13:00 | blockiert | Stillstand (Werkzeug) | unterversorgt | unterversorgt | unterversorgt |
| Muster | oft blockiert | arbeitet immer | oft unterversorgt | oft unterversorgt | oft unterversorgt |

### Methode 4: Auslastung (Anteil aktiver Zeit)

Maschinendaten aus einem MES, einer IIoT-Plattform oder der Maschinensteuerung zeigen den Zeitanteil, in dem jede Ressource aktiv ist. Die Ressource mit dem höchsten Anteil aktiver Zeit ist der Engpasskandidat. Roser, Nakano und Tanaka nennen das die Workload-Methode und verwenden sie in ihrer Arbeit von 2001 als Vergleich [13]. Sie lässt sich leicht automatisieren, ist aber blind für die Reihenfolge, in der Ressourcen einander unterbrechen: Zwei Ressourcen mit 85 Prozent sehen gleich aus, auch wenn eine davon die andere stoppt.

### Methode 5: Die Active-Period-Methode

Die Active-Period-Methode wurde von Roser, Nakano und Tanaka auf der Winter Simulation Conference 2001 veröffentlicht und 2002 auf wandernde Engpässe erweitert [13][14]. Sie braucht ein Zustandsprotokoll mit Zeitstempeln für jede Ressource.

- **Aktive Zustände** sind Zustände, in denen die Ressource andere warten lassen kann: Bearbeitung, aber auch Rüsten, Störung, Reparatur und Wartung [14][15].
- **Inaktive Zustände** sind Zustände, in denen die Ressource auf andere wartet: unterversorgt (wartet auf Material oder Transport) und blockiert [14][15].
- Eine **aktive Periode** ist eine ununterbrochene Folge aktiver Zustände [13].
- Zu jedem Zeitpunkt ist **die Ressource mit der längsten ununterbrochenen aktiven Periode der momentane Engpass** [14].
- Wo sich die aktive Periode des aktuellen Engpasses mit der des vorherigen oder nächsten Engpasses überschneidet, **wandert** der Engpass zwischen beiden; außerhalb der Überschneidungen ist die Ressource **alleiniger** Engpass [14].

**Rechenbeispiel (zwei Stunden aus einem beispielhaften Schichtprotokoll):**

| Ressource | Aktive Perioden | Inaktive Perioden |
|---|---|---|
| Säge | 08:00–08:20, 08:35–08:55, 09:10–09:30, 09:45–10:00 | dazwischen blockiert |
| CNC-Zelle | 08:00–09:05 (65 min), 09:15–10:00 (45 min) | 09:05–09:15 unterversorgt |
| Montage | 08:00–08:10, 08:30–09:10 (40 min), 09:40–10:00 | unterversorgt 08:10–08:30 und 09:10–09:40 |

Schritt für Schritt:

1. 08:00–09:05: Die 65-minütige aktive Periode der CNC-Zelle ist die längste laufende Periode, also ist die CNC-Zelle der momentane Engpass.
2. 09:05–09:10: Die CNC-Zelle ist unterversorgt. Die längste aktive Periode zu diesem Zeitpunkt hat die Montage (08:30–09:10). Die Montage ist der Engpass.
3. 09:10–09:15: Nur die Säge ist aktiv (09:10–09:30). Die Säge ist der Engpass.
4. 09:15–10:00: Die zweite Periode der CNC-Zelle (45 Minuten) ist die längste. Die CNC-Zelle ist der Engpass.
5. Überschneidungen: Die CNC-Periode 08:00–09:05 überschneidet sich 35 Minuten lang (08:30–09:05) mit der Montageperiode 08:30–09:10, dort wandert der Engpass also zwischen CNC und Montage. Die Sägeperiode 09:10–09:30 überschneidet sich 15 Minuten lang mit der CNC-Periode 09:15–10:00, ein Wechsel zwischen Säge und CNC.

| Ressource | Alleiniger Engpass | Wandernder Engpass | Summe | Anteil an 120 min (alleinig / Summe) |
|---|---|---|---|---|
| CNC-Zelle | 08:00–08:30 und 09:30–10:00 = 60 min | 35 + 15 = 50 min | 110 min | 50 % / 92 % |
| Montage | 09:05–09:10 = 5 min | 35 min | 40 min | 4 % / 33 % |
| Säge | 09:10–09:15 = 5 min | 15 min | 20 min | 4 % / 17 % |

Roser interpretiert den alleinigen Anteil als Untergrenze und die Summe als Obergrenze für die Wirkung einer Verbesserung: Ist die CNC-Zelle 50 Prozent der Zeit alleiniger Engpass und 92 Prozent der Zeit alleiniger oder wandernder Engpass, sollte eine gewonnene Minute an der CNC-Zelle die Systemausbringung um etwa 0,5 bis 0,9 Minuten verbessern [15]. Zwei Stunden Daten reichen nur, um die Mechanik zu zeigen; eine echte Analyse verwendet Protokolle über Wochen.

Zum Vergleich mit Methode 4: Die CNC-Zelle war 110 von 120 Minuten aktiv (92 Prozent), die Säge 80 (67 Prozent) und die Montage 70 (58 Prozent). Die Auslastung zeigt hier auf dieselbe Ressource, würde aber die Säge vor die Montage reihen, obwohl die Montage häufiger Teil eines wandernden Engpasses ist.

**Woher die Daten kommen:** MES-Maschinenzustände, IIoT-Gateways, die die Steuerung auslesen, oder das Ereignisprotokoll einer ereignisdiskreten Simulation. Roser weist darauf hin, dass die Methode mit Simulation oder hochautomatisierten Systemen am einfachsten ist, und empfiehlt den Engpassrundgang, wo solche Daten fehlen [15]. Der Leitfaden [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) erklärt, wie Werke Anlagenzustände erfassen.

### Methode 6: Simulation und Sensitivitätstests

Ein ereignisdiskretes Simulationsmodell der Linie erlaubt, die Frage direkt zu testen: Wenn jede Ressource nacheinander 10 Prozent mehr Kapazität bekommt, welche Änderung erhöht die Ausbringung? Die Ressource, deren Verbesserung die Ausbringung am stärksten erhöht, ist der Engpass für diesen Mix. Die Simulation zeigt auch wandernde Engpässe unter Streuung, die statische Belastungstabellen übersehen. Der Leitfaden [Simulation in der Produktion](https://www.m365.fm/learn/digital-twin/simulation-produktion/) beschreibt, wie man ein solches Modell aufbaut.

### Häufige Ursachen von Engpässen

Eine Engpassanalyse sollte mit einer Ursache enden, nicht nur mit einem Ort. Die üblichen Ursachen im Werk:

- Kapazität unter der Nachfrage für den aktuellen Produktmix (ein echter Kapazitätsengpass)
- ungeplante Stillstände und langsame Reparaturen an der kritischen Ressource
- lange Rüstzeiten in Verbindung mit Regeln für große Lose
- fehlende Qualifikation oder Besetzung: nur wenige Personen können die Ressource bedienen oder rüsten
- Qualitätsverluste: Ausschuss und Nacharbeit, die Engpasszeit doppelt verbrauchen
- Unterversorgung: Material, Werkzeuge, Programme oder Vorarbeit kommen zu spät
- Regeln, etwa Auslastungsziele, die Nicht-Engpässe beschäftigt halten, während sich Arbeit an der falschen Stelle stapelt

Die Ursache bestimmt die Lösung. Die ersten fünf verlangen zuerst Ausschöpfen (Abschnitt 4, Schritt 2) und Erweitern nur, wenn das nicht reicht; Unterversorgung verlangt Unterordnen (Schritt 3); Regeln verlangen eine Regeländerung, oft mit den Denkprozessen (Abschnitt 12).

### Welche Methode wann?

| Methode | Benötigte Daten | Findet wandernde Engpässe | Aufwand | Beste Verwendung |
|---|---|---|---|---|
| Kapazitätsbelastung | Arbeitspläne, Nachfrage, Kalender | nein | gering | erste Prüfung, Planung, Angebotserstellung |
| Warteschlangen beobachten | Zählungen vor Ort | teilweise | gering | Bestätigung |
| Engpassrundgang | wiederholte Rundgänge | teilweise | gering bis mittel | Werke ohne Maschinendaten |
| Auslastung | Maschinenzustände | nein | gering, sobald Daten fließen | Dashboards |
| Active Period | Zustände mit Zeitstempel | ja | mittel | automatisierte Linien, MES-Daten, Simulation |
| Simulation | Modell plus Daten | ja | mittel bis hoch | hohe Variantenvielfalt, Investitionsentscheidungen |

### Sechs Fragen, die einen falschen Engpass entlarven

1. Läuft die Ressource wirklich während der gesamten verfügbaren Zeit, oder ist sie oft unterversorgt?
2. Ist die Warteschlange davor dauerhaft, oder ist nur gerade ein Los angekommen?
3. Warten die nachfolgenden Ressourcen auf sie oder auf etwas anderes?
4. Würden die Auslieferungen steigen, wenn sie morgen 10 Prozent mehr Kapazität hätte?
5. Ist der "Engpass" mit Arbeit beschäftigt, die gerade nicht gebraucht wird?
6. Ist die eigentliche Grenze eine Regel, etwa Mindestlosgrößen oder ein festes Schichtmodell?

## Drum-Buffer-Rope mit Zahlen

Drum-Buffer-Rope (DBR, deutsch auch Trommel-Puffer-Seil) ist die TOC-Methode zur Planung und Steuerung der Produktion. Goldratt und Robert E. Fox beschrieben sie in *The Race* (1986) und bauten dabei auf dem Bild der Pfadfindergruppe aus *The Goal* auf [3][8]. Das *Theory of Constraints Handbook* beschreibt die heutige Form einschließlich Puffermanagement und VATI-Flussklassifikation [9].

- **Drum (Trommel):** der Plan des Engpasses. Er ist der einzige Detailplan im Werk, der eingehalten werden muss.
- **Buffer (Puffer):** Zeitpuffer, die den Durchsatz des Werks gegen Streuung schützen. Klassisches DBR setzt Puffer am Engpass, an Montagepunkten, an denen Engpassteile auf Nicht-Engpassteile treffen, und am Versand [6].
- **Rope (Seil):** der Freigabemechanismus. Material kommt eine Pufferzeit vor seinem Bedarf am Engpass ins Werk; frühere Freigabe erhöht nur den Umlaufbestand [6].

Puffer werden bei DBR in **Zeit** gemessen, nicht in Stück [6]. Ein Engpasspuffer von 16 Stunden bedeutet, dass Material 16 Arbeitsstunden vor seinem geplanten Start am Engpass freigegeben wird.

### Schritt 1: Den Trommelplan erstellen

Zurück im Werk für Hydraulikblöcke: Die CNC-Zelle ist die Trommel. Ihr Plan für Mittwoch (Schicht 1: 06:00–14:00, Schicht 2: 14:00–22:00) mit den 18-minütigen Rüstvorgängen aus Abschnitt 5:

| Auftrag | Produkt und Menge | Rüsten + Bearbeiten (min) | CNC-Start | CNC-Ende |
|---|---|---|---|---|
| 1041 | A × 10 | 18 + 250 = 268 | Mi 06:00 | Mi 10:28 |
| 1042 | B × 5 | 18 + 200 = 218 | Mi 10:28 | Mi 14:06 |
| 1043 | A × 10 | 268 | Mi 14:06 | Mi 18:34 |
| 1044 | B × 4 | 18 + 160 = 178 | Mi 18:34 | Mi 21:32 |

Die Reihenfolge folgt der Produktmix-Entscheidung aus Abschnitt 5 und der Wochennachfrage, mit Losen, die klein genug sind, um die Durchlaufzeiten kurz zu halten. Die 28 Minuten am Schichtende gehen in eine geplante Werkzeugkontrolle.

### Schritt 2: Die Puffer festlegen

- **Engpasspuffer:** 16 Arbeitsstunden (zwei Schichten). Säge und Materialtransport brauchen weniger als eine Stunde Bearbeitungszeit je Auftrag; der Rest schützt gegen Probleme an der Säge, fehlendes Material und fehlende Programme.
- **Versandpuffer:** 16 Arbeitsstunden nach der CNC-Zelle. Entgraten, Montage und Prüfung brauchen etwa eine Stunde Bearbeitungszeit je Auftrag.
- **Physische Pufferfläche:** eine markierte Bodenfläche vor der CNC-Zelle, ausgelegt für etwa einen Tag Arbeit, mit FIFO-Bahnen nach Vorrichtungsfamilie. Läuft die Fläche über, ist die Freigabe dem Seil voraus; ist sie leer, ist die CNC-Zelle gefährdet.

Wie groß sollte ein Puffer zu Beginn sein? Gray, Felan, Umble und Umble halten fest, dass es Faustregeln gibt, dass Puffergrößen nach ihrer Erfahrung aber meist so gesetzt werden, dass ein stabiles System entsteht, und dann angepasst werden [24]; das Anpassen übernimmt das Puffermanagement (Abschnitt 9). Ein in der TOC-Praxis oft genannter Startwert ist etwa die Hälfte der aktuellen Durchlaufzeit für diesen Abschnitt [unbelegt]. Im Beispiel wartete Arbeit früher 2,5 Tage vor der CNC-Zelle; das Team begann mit einem Tag und plante Anpassungen ein.

### Schritt 3: Das Seil knüpfen

Freigabezeitpunkt = geplanter Engpassstart − Engpasspuffer.

| Auftrag | CNC-Start | Engpasspuffer | Freigabe an die Säge | Liefertermin (CNC-Ende + Versandpuffer) |
|---|---|---|---|---|
| 1041 | Mi 06:00 | 16 h | Di 06:00 | Do 10:28 |
| 1042 | Mi 10:28 | 16 h | Di 10:28 | Do 14:06 |
| 1043 | Mi 14:06 | 16 h | Di 14:06 | Do 18:34 |
| 1044 | Mi 18:34 | 16 h | Di 18:34 | Do 21:32 |

Kein Material wird vor seinem Freigabezeitpunkt freigegeben, egal wie sehr die Säge stillsteht. Genau das hält Umlaufbestand und Durchlaufzeit niedrig.

### Schritt 4: Das Werk nach Pufferstatus steuern

Nicht-Engpässe bekommen keinen Detailplan. Sie arbeiten in der Reihenfolge des Pufferstatus (Abschnitt 9): Aufträge, deren Puffer am stärksten verbraucht ist, kommen zuerst. Die CNC-Zelle folgt ihrer Reihenfolge.

### DBR vs. MRP-Push: was sich ändert

| Thema | MRP-Push | DBR |
|---|---|---|
| Freigabe | geplante Durchlaufzeiten je Arbeitsgang, oft mit Zuschlägen | Engpassplan minus Puffer |
| Detailpläne | für jeden Arbeitsplatz | nur für den Engpass |
| Umlaufbestand | wächst, wenn Durchlaufzeiten aufgepolstert werden | durch das Seil begrenzt |
| Prioritäten auf dem Shopfloor | Eillisten, Expediting | Pufferstatus-Farben |
| Reaktion auf Streuung | mehr Durchlaufzeit, mehr Bestand | Puffer an wenigen Stellen, bemessen und angepasst |

Der Leitfaden [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/) erklärt, wie DBR in die Feinplanung mit begrenzter Kapazität passt und wann ein APS Mehrwert bringt.

### DBR in Montagewerken (A-Typ)

In einem A-Werk treffen Engpassteile in der Montage auf Nicht-Engpassteile. Klassisches DBR ergänzt einen **Montagepuffer**: Nicht-Engpassteile werden so freigegeben, dass sie an der Montage bereitliegen, bevor das Engpassteil ankommt, damit die Ausbringung des Engpasses nie auf eine fehlende Halterung wartet [6][9]. In Luftfahrt und Maschinenbau, wo Baugruppen Hunderte von Teilen brauchen, zahlt sich DBR oft genau hier am meisten aus; der Leitfaden [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/) behandelt dieses Umfeld.

## Simplified Drum-Buffer-Rope (S-DBR) für die Auftragsfertigung

Simplified DBR (S-DBR) wurde für Auftragsfertiger (Make-to-Order) entwickelt, bei denen meist der Markt und nicht eine interne Ressource der Engpass ist oder bei denen der interne Engpass nicht stark belastet ist. Es verwendet nur einen Puffer, den **Versandpuffer**, und ersetzt den detaillierten Trommelplan durch eine Prüfung der **geplanten Belastung (Planned Load)** der kapazitätsbeschränkten Ressource [6][9].

### So funktioniert S-DBR

1. **Versandpuffer:** Jeder Auftrag wird eine feste Pufferzeit vor seinem Liefertermin freigegeben.
2. **Geplante Belastung:** Das Werk führt eine laufende Summe der bereits zugesagten Arbeit auf der CCR, ausgedrückt in Tagen.
3. **Lieferterminzusage:** Ein neuer Auftrag bekommt einen Liefertermin nicht früher als das Datum, an dem die CCR ihn bearbeiten kann, plus einen Teil des Versandpuffers für die Arbeit nach der CCR. Eine verbreitete Konvention ist das Datum der geplanten Belastung plus der halbe Versandpuffer [unbelegt].
4. **Puffermanagement** setzt die Prioritäten auf dem Shopfloor nach dem verbrauchten Anteil des Versandpuffers.

### Rechenbeispiel: Liefertermin mit S-DBR zusagen

Angenommen, das Werk für Hydraulikblöcke ist zum Auftragsfertiger geworden, und in den meisten Wochen ist der Markt der Engpass. Die CNC-Zelle wird als CCR mit 4.400 effektiven Minuten pro Woche behandelt, also 880 Minuten pro Arbeitstag.

- Bereits zugesagte Aufträge auf der CNC-Zelle: 3.520 Minuten. Geplante Belastung = 3.520 ÷ 880 = **4,0 Arbeitstage**.
- Versandpuffer: **6 Arbeitstage** (die aktuelle Gesamtdurchlaufzeit beträgt 12 Tage; das Team beginnt mit der Hälfte).
- Neuer Auftrag: 10 Stück B zu je 40 Minuten = 400 Minuten = 0,45 Tage auf der CNC-Zelle.

Sicherer Liefertermin = heute + geplante Belastung + CNC-Zeit des neuen Auftrags + halber Versandpuffer = 0 + 4,0 + 0,45 + 3,0 = **7,45, also 8 Arbeitstage**. Freigabetermin = Liefertermin − Versandpuffer = Tag 8 − 6 = **Tag 2**.

Will der Vertrieb 5 Tage zusagen, zeigt die Prüfung, dass der Auftrag auf der CNC-Zelle die Warteschlange überspringen und andere Aufträge verspäten würde. Dieses Gespräch findet bei der Auftragserfassung statt, nicht zwei Wochen später auf dem Shopfloor.

### DBR oder S-DBR?

| Kriterium | Klassisches DBR | S-DBR |
|---|---|---|
| Engpass | intern und stark belastet | Markt, oder intern und mäßig belastet |
| Puffer | Engpass, Montage, Versand | nur Versand |
| Engpassplan | detaillierte Reihenfolge | Prüfung der geplanten Belastung |
| Aufwand | höher | geringer |
| Typische Eignung | stabiler Engpass, A- oder I-Werke | Auftragsfertiger, Werkstattfertigung, hohe Variantenvielfalt |

## Puffermanagement: der Regelkreis

Puffermanagement ist der Steuerungs- und Verbesserungskreis von DBR und S-DBR [9]. Für jeden offenen Auftrag verfolgt das Werk, wie viel seines Puffers verbraucht ist, und färbt ihn entsprechend ein. Die Wikipedia-Zusammenfassung zur TOC beschreibt die Rot-Gelb-Grün-Codierung nach Pufferverbrauch (Buffer Penetration) [6].

**Formel (für einen Auftrag, der den geschützten Punkt noch nicht erreicht hat):**
Pufferverbrauch (%) = (1 − verbleibende Zeit bis zur geplanten Ankunft am geschützten Punkt ÷ Puffergröße) × 100

| Zone | Pufferverbrauch | Bedeutung | Reaktion |
|---|---|---|---|
| Grün | 0 bis 33 % | im Plan | keine |
| Gelb | 33 bis 67 % | wird knapp | prüfen, wo der Auftrag steht, Maßnahme vorbereiten |
| Rot | 67 bis 100 % | der geschützte Punkt muss eventuell warten | beschleunigen: Auftrag nach vorne ziehen, Ursache beheben |
| Schwarz (in manchen Werken) | über 100 % | bereits verspätet | eskalieren, bei einem Versandpuffer den Kunden informieren |

Die Aufteilung in Drittel ist eine Konvention, kein Naturgesetz.

### Rechenbeispiel: Pufferstatus am Mittwoch um 06:00

Engpasspuffer: 16 Arbeitsstunden. Zu Schichtbeginn hat noch keiner der vier Aufträge die CNC-Zelle erreicht.

| Auftrag | Geplanter CNC-Start | Verbleibende Arbeitsstunden | Verbrauch | Zone | Maßnahme |
|---|---|---|---|---|---|
| 1041 | Mi 06:00 | 0 | 100 % | rot/schwarz | die CNC wird warten; den Auftrag sofort suchen |
| 1042 | Mi 10:28 | 4,5 | 1 − 4,5 ÷ 16 = 72 % | rot | an der Säge beschleunigen |
| 1043 | Mi 14:06 | 8,1 | 1 − 8,1 ÷ 16 = 49 % | gelb | Status prüfen |
| 1044 | Mi 18:34 | 12,6 | 1 − 12,6 ÷ 16 = 21 % | grün | keine |

An einem gesunden Tag liegen Aufträge, die in den nächsten Stunden fällig sind, schon im Puffer vor der CNC-Zelle. Dass Auftrag 1041 um 06:00 nicht dort liegt, heißt: Die CNC-Zelle ist dabei, Zeit zu verlieren.

### Pufferdaten zur Verbesserung nutzen

Jedes Mal, wenn ein Auftrag rot wird, den Grund festhalten: fehlendes Material, Sägenstörung, Programm nicht freigegeben, Qualitätssperre. Nach einigen Wochen ist ein Pareto-Diagramm der Ursachen die Verbesserungsliste für die Nicht-Engpässe. Zwei Faustregeln zur Bemessung:

- Sind viele Aufträge rot, ist der Puffer zu klein oder der vorgelagerte Prozess zu instabil. Zuerst die wichtigsten Ursachen beheben, dann über einen größeren Puffer nachdenken.
- Bleiben fast alle Aufträge grün, ist der Puffer zu groß. Ihn schrittweise verkleinern; Umlaufbestand und Durchlaufzeit sinken mit.

Für Lagerpuffer in der Distribution lautet die Regel des dynamischen Puffermanagements, wie auf Wikipedia zusammengefasst: einen Puffer um ein Drittel verkleinern, wenn der Bestand eine volle Wiederbeschaffungszeit lang im oberen Drittel bleibt, und um ein Drittel vergrößern, wenn er zu lange im unteren Drittel bleibt [6].

## Factory Physics hinter TOC: Little's Law und Variabilität

TOC wird manchmal als Philosophie gelehrt. Ihre Planungsregeln folgen aber auch aus der Warteschlangentheorie.

### Little's Law

John D. C. Little bewies 1961, dass in einem stabilen System die mittlere Anzahl der Einheiten im System gleich der Ankunftsrate mal der mittleren Verweilzeit ist [16]. In Fabrikbegriffen (Hopp und Spearman) [17]:

**Umlaufbestand (WIP) = Durchsatz × Durchlaufzeit**, oder **Durchlaufzeit = Umlaufbestand ÷ Durchsatz**

**Rechenbeispiel (Werk für Hydraulikblöcke, vor und nach DBR):**

| | Vorher (Push) | Nachher (DBR) |
|---|---|---|
| Umlaufbestand zwischen Säge und Versand | 640 Stück | 90 Stück |
| Durchsatz | 127 Stück pro Woche | 147 Stück pro Woche |
| Durchlaufzeit = Umlaufbestand ÷ Durchsatz | 640 ÷ 127 = 5,0 Wochen | 90 ÷ 147 = 0,61 Wochen, etwa 3 Arbeitstage |

Der Umlaufbestand sank, weil das Seil die verfrühte Freigabe stoppte; der Durchsatz stieg, weil der Engpass ausgeschöpft wurde. Die Durchlaufzeit sank um mehr als 80 Prozent. Little's Law warnt auch vor der Grenze: Sinkt der Bestand vor dem Engpass so weit, dass er leerläuft, fällt auch der Durchsatz. Deshalb hält DBR einen Puffer am Engpass und sonst nirgends.

### Variabilität und Auslastung

Die Kingman-Näherung für eine einzelne Station zeigt, warum Nicht-Engpässe freie Kapazität brauchen [17][18]:

**Wartezeit ≈ ((ca² + ce²) ÷ 2) × (u ÷ (1 − u)) × te**

Dabei sind ca und ce die Variationskoeffizienten der Ankünfte und der Bearbeitungszeiten, u die Auslastung und te die mittlere Bearbeitungszeit. Es handelt sich um eine Näherung für eine einzelne Station mit allgemeinen Verteilungen der Ankunfts- und Bearbeitungszeiten (G/G/1), die bei hoher Auslastung am genauesten ist [17][18].

| Auslastung u | u ÷ (1 − u) | Wartezeit mit ca = ce = 1, te = 40 min |
|---|---|---|
| 70 % | 2,3 | 93 min |
| 85 % | 5,7 | 227 min |
| 95 % | 19,0 | 760 min |

Von 85 auf 95 Prozent Auslastung verdreifacht sich die Wartezeit mehr als. Ein Werk, das jede Ressource Richtung 95 Prozent treibt, erzeugt überall lange Warteschlangen. Die Antwort der TOC: den Engpass mit sehr hoher Auslastung fahren, geschützt durch einen bewusst gesetzten Puffer, und Nicht-Engpässe deutlich darunter halten.

## Throughput Accounting vs. Kostenrechnung

Throughput Accounting (Durchsatzrechnung) ist das Bewertungssystem der TOC. Goldratt legte die drei Größen in *The Goal* und *The Haystack Syndrome* dar [20]; Thomas Corbetts *Throughput Accounting* (North River Press) ist die maßgebliche Buchdarstellung [21].

### Die drei Größen

| Größe | Definition (Goldratt, zusammengefasst von MAAW) [20] | Praktische Definition im Werk |
|---|---|---|
| Durchsatz (Throughput, T) | die Rate, mit der das System durch Verkäufe Geld erwirtschaftet | Umsatz minus vollständig variable Kosten, meist Rohmaterial, Kaufteile, Provisionen und Fremdbearbeitung je Stück [6][22] |
| Bestand (Inventory, I), später oft "Investition" | Geld, das das System in den Kauf von Dingen investiert, die es verkaufen will | Rohmaterial, Umlaufbestand und Fertigwaren, bewertet zu Materialkosten, in der weiteren Definition zusätzlich Anlagen und Gebäude [22] |
| Betriebsaufwand (Operating Expense, OE) | alles Geld, das das System ausgibt, um Bestand in Durchsatz zu verwandeln | Löhne und Gehälter (einschließlich Fertigungslöhne), Miete, Energie, Instandhaltung, Abschreibungen |

Fertigungslöhne gehören zum OE, nicht zu T. Das ist der entscheidende Unterschied zur Standardkostenrechnung: In den meisten Werken steigen oder sinken die Lohnkosten kurzfristig nicht mit jedem zusätzlichen Stück.

### Abgeleitete Größen

| Größe | Formel | Werk für Hydraulikblöcke nach dem Ausschöpfen (wöchentlich) |
|---|---|---|
| Nettogewinn (NP) | T − OE | 85.250 USD − 63.500 USD = 21.750 USD |
| Kapitalrendite (ROI) | (T − OE) ÷ I | mit I = 1,2 Mio. USD: 21.750 USD × 52 ÷ 1.200.000 USD = 94 % pro Jahr |
| Produktivität | T ÷ OE | 85.250 USD ÷ 63.500 USD = 1,34 |
| Investitionsumschlag | T ÷ I | 85.250 USD × 52 ÷ 1.200.000 USD = 3,7 pro Jahr |

Die Zusammenfassung von Lean Production nennt dieselben abgeleiteten Größen und die Entscheidungspriorität der TOC: zuerst den Durchsatz erhöhen, dann die Investition senken, dann den Betriebsaufwand senken [22]. Der Investitionswert von 1,2 Mio. USD ist eine Annahme für das Beispiel.

### Entscheidungsregel: Durchsatz je Engpasseinheit

Gibt es einen Engpass, sollten Produkte nach Durchsatz je Einheit Engpasszeit gereiht werden, nicht nach Marge je Stück. In Lehrbüchern der Kostenrechnung ist das der bekannte "Deckungsbeitrag je Einheit des Engpassfaktors" (engpassbezogener Deckungsbeitrag); das Prüfungsteam der ACCA beschreibt die Durchsatzvariante mit dem Return per Factory Hour und der Throughput Accounting Ratio (TPAR) [19]:

- **Return per Factory Hour** = Durchsatz je Stück ÷ Stunden je Stück am Engpass
- **Cost per Factory Hour** = gesamte Fabrikkosten ÷ insgesamt verfügbare Stunden am Engpass
- **TPAR** = Return per Factory Hour ÷ Cost per Factory Hour; sie sollte normalerweise größer als 1 sein [19].

### Rechenbeispiel: Standardkosten vs. Throughput Accounting

Die Standardkostenrechnung im Werk verteilt den Betriebsaufwand nach Standardlohnminuten auf die Produkte. Budgetierte Standardminuten bei Nachfrage: A 70 Minuten je Stück (8 + 25 + 12 + 15 + 10) × 100 Stück = 7.000; B 97 Minuten (10 + 40 + 12 + 20 + 15) × 60 Stück = 5.820; zusammen 12.820 Minuten. Gemeinkostensatz = 62.000 USD ÷ 12.820 = **4,84 USD je Standardminute**.

| | Produkt A | Produkt B |
|---|---|---|
| Preis | 900,00 USD | 1.200,00 USD |
| Material | 400,00 USD | 450,00 USD |
| Lohn und Gemeinkosten (70 × 4,84 USD; 97 × 4,84 USD) | 338,80 USD | 469,48 USD |
| **Standardmarge je Stück** | **161,20 USD** | **280,52 USD** |
| Standardmarge in % | 17,9 % | 23,4 % |
| Durchsatz je Stück | 500 USD | 750 USD |
| CNC-Stunden je Stück | 0,417 | 0,667 |
| **Return je CNC-Stunde** | **1.200 USD** | **1.125 USD** |

Cost per Factory Hour mit dem Betriebsaufwand nach dem Ausschöpfen: 63.500 USD ÷ (4.400 ÷ 60 = 73,3 CNC-Stunden) = **865,91 USD**. TPAR A = 1.200 ÷ 865,91 = **1,39**; TPAR B = 1.125 ÷ 865,91 = **1,30**. Beide Produkte verdienen Geld, aber A verdient je Engpassstunde mehr.

Die Standardkostenrechnung sagt "B pushen": B hat die höhere Marge je Stück und in Prozent. Throughput Accounting sagt "den Engpass zuerst mit A füllen". Abschnitt 5 zeigte das Ergebnis: 1.250 USD mehr Nettogewinn pro Woche mit der Durchsatzreihung. Als Rechnung ist die Standardkostenrechnung nicht falsch. Sie beantwortet eine andere Frage (die durchschnittlichen Vollkosten eines Stücks über einen Zeitraum), und diese Frage ist nicht die, die eine Produktmix-Entscheidung unter einem Engpass braucht.

### Rechenbeispiel: ein Auftrag, der nur freie Kapazität nutzt

Ein Kunde fragt 40 Adapterplatten pro Woche zu je 260 USD an. Das Material kostet 150 USD. Die Platten brauchen die Säge (15 Minuten), das Entgraten (10 Minuten) und die Montage (25 Minuten), aber **keine CNC-Zeit**. Zusammen: 50 Standardminuten.

| | Sicht der Standardkosten | Sicht des Durchsatzes |
|---|---|---|
| Material | 150,00 USD | 150,00 USD |
| Lohn und Gemeinkosten (50 × 4,84 USD) | 242,00 USD | nicht je Stück: der OE ändert sich nicht, die Ressourcen haben freie Kapazität |
| Marge je Stück | 260 USD − 392 USD = **−132 USD** | T = 260 USD − 150 USD = **+110 USD** |
| Entscheidung | ablehnen | annehmen |
| Wirkung auf den wöchentlichen Nettogewinn (40 Platten) | | +4.400 USD, solange Säge, Entgraten und Montage unter ihrer Kapazität bleiben |

Belastungen prüfen: Säge +600 Minuten (auf 2.000, 42 Prozent), Entgraten +400 (auf 2.320, 48 Prozent), Montage +1.000 (auf 3.700, 77 Prozent). Die Montage rückt näher an einen Engpass heran, also sollte der Auftrag mit einer Mengengrenze angenommen und beobachtet werden. Mit der Standardkostenrechnung hätte das Werk 4.400 USD pro Woche abgelehnt.

### Bestand und ausgewiesener Gewinn

Bei der Vollkostenrechnung (Absorption Costing) werden Gemeinkosten in den Bestand übernommen. Baut das Werk 50 zusätzliche Stück A auf Lager, wandern 50 × 338,80 USD = **16.940 USD** Gemeinkosten der Periode in die Bilanz statt in die Gewinn- und Verlustrechnung, und der ausgewiesene Gewinn steigt um diesen Betrag. Die Liquidität sinkt um das gekaufte Material, 50 × 400 USD = 20.000 USD. Im Throughput Accounting ändert sich der Nettogewinn nicht, und der Bestand steigt um 20.000 USD. Deshalb warnen TOC-Praktiker, dass Bestandsaufbau ein Werk auf dem Papier besser aussehen lassen kann, während es bei Liquidität und Durchlaufzeit schlechter wird.

Die externe Rechnungslegung in den USA verlangt, dass Fertigungsgemeinkosten in die Bestandsbewertung einbezogen werden (Vollkostenansatz): Nach ASC 330 sind die Anschaffungs- oder Herstellungskosten eines Bestands die Summe der direkt oder indirekt angefallenen Ausgaben, um einen Artikel in seinen aktuellen Zustand und an seinen aktuellen Ort zu bringen, und fixe Fertigungsgemeinkosten werden auf Basis der Normalkapazität der Produktionsanlagen auf den Bestand verteilt [28][29]. Wie das Werk das anwendet, entscheidet das Controlling. Throughput Accounting ist deshalb ein internes Entscheidungsinstrument. Die meisten Werke, die es nutzen, führen für die externe Berichterstattung weiter Abschlüsse nach US-GAAP und stimmen beide Rechnungen ab.

### Worauf das Werkscontrolling achten sollte

| Risiko | Warum es zählt | Gegenmaßnahme |
|---|---|---|
| "Wirklich variabel" zu eng oder zu weit definiert | T wird zu hoch oder zu niedrig ausgewiesen | eine schriftliche Liste vereinbaren: Material, Kaufteile, Fremdbearbeitung, Ausgangsfracht, wenn je Stück, Vertriebsprovisionen |
| OE auch langfristig als fix behandelt | große Mengenänderungen verändern den OE sehr wohl | OE-Annahmen für Entscheidungen über ein Quartal hinaus neu prüfen |
| Ort des Engpasses ignoriert | Durchsatz je Engpassminute ist bedeutungslos, wenn der Engpass wandert | neu rechnen, wenn sich die Belastungstabelle ändert |
| Dauerhafte Preise unter Vollkosten | die freie Kapazität verschwindet und der OE muss wachsen | Mengenobergrenzen, Überprüfung jedes Quartal |
| Zwei Zahlenwerke | Verwirrung in Managementrunden | ein Überleitungsblatt; TA für Entscheidungen, GAAP für Abschlüsse |
| Arbeit, die wirklich je Stück variiert | Akkordlohn oder je Stück abgerechnete Leiharbeit ist wirklich variabel | in die wirklich variablen Kosten aufnehmen; reguläre Löhne bleiben im OE |

Der Leitfaden [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/) behandelt Lagerumschlag und weitere finanziell-operative Kennzahlen.

## Die Denkprozesse (Thinking Processes)

Die Denkprozesse (Thinking Processes, TP) sind die Werkzeuge der TOC für Probleme, die keine Kapazitätsprobleme sind: Regelengpässe, Konflikte und Veränderungsmanagement. Goldratts Roman *It's Not Luck* (1994) machte sie einem breiten Publikum bekannt; Kim, Mabin und Davies werteten die Forschungsliteratur dazu von 1994, nach diesem Buch, bis Anfang 2006 aus und stellten fest, dass sich TOC vor allem durch die Praxis entwickelt hat, mit vielen Anwendungsfeldern und Mehrmethodenansätzen [12].

Die Denkprozesse beantworten drei Fragen: Was ändern, wozu hin ändern, und wie die Änderung herbeiführen.

| Werkzeug | Frage | Logik | Ergebnis |
|---|---|---|---|
| Gegenwartsbaum (Current Reality Tree, CRT) | was ändern? | Ursache und Wirkung ("wenn ... dann ...") von wenigen Kernursachen zu vielen unerwünschten Effekten (UDEs) | das Kernproblem |
| Konfliktwolke (Evaporating Cloud, EC), Konfliktlösungsdiagramm | wozu hin ändern? | Notwendigkeit ("um ... zu erreichen, müssen wir ...") | die Annahme, deren Widerlegung den Konflikt auflöst |
| Zukunftsbaum (Future Reality Tree, FRT) | wozu hin ändern? | Hinlänglichkeit, mit Injektionen | die Lösung und ihre Nebenwirkungen (negative Zweige) |
| Voraussetzungsbaum (Prerequisite Tree, PRT) | wie die Änderung herbeiführen? | Hindernisse und Zwischenziele | die Abfolge der Meilensteine |
| Übergangsbaum (Transition Tree, TrT) | wie die Änderung herbeiführen? | Handlung, Grund, Wirkung | ein Schritt-für-Schritt-Plan |

### Rechenbeispiel: Konfliktwolke zur Losgröße

Im Werk für Hydraulikblöcke stritten der CNC-Meister und der Vertriebsleiter über die Losgröße für B.

| Feld | Inhalt |
|---|---|
| A (gemeinsames Ziel) | ein profitables Werk führen |
| B (Bedürfnis 1) | die Kapazität der CNC-Zelle gut nutzen |
| C (Bedürfnis 2) | B-Aufträge schnell liefern |
| D (Forderung 1, dient B) | große B-Lose (40) fahren, um Rüstvorgänge zu sparen |
| D' (Forderung 2, dient C) | kleine B-Lose (10) fahren |
| Konflikt | D und D' gehen nicht gleichzeitig |

Die Annahme unter B–D: "Rüsten an der CNC-Zelle dauert 30 Minuten, also kostet jeder zusätzliche Rüstvorgang 30 Minuten Engpasszeit." Die Injektion: die Rüstzeit mit externer Vorbereitung auf 18 Minuten senken und B-Varianten nach Vorrichtungsfamilien bündeln, sodass kleine Lose wenig Engpasszeit kosten. Die Wolke "löst sich auf" (evaporates), weil die Annahme hinter dem Konflikt nicht mehr stimmt.

### Rechenbeispiel: ein kleiner Gegenwartsbaum

Unerwünschte Effekte (UDEs), die das Führungsteam aufgelistet hat: verspätete Aufträge, hoher Umlaufbestand, häufige Eilaktionen, Überstunden in der Montage, Meister, die um Prioritäten streiten. Den Baum von unten gelesen:

1. Wenn Meister an der Auslastung gemessen werden, dann geben sie Arbeit früh frei, um ihre Maschinen beschäftigt zu halten.
2. Wenn Arbeit früh freigegeben wird, dann wächst der Umlaufbestand, und die Warteschlangen vor der CNC-Zelle wachsen.
3. Wenn die Warteschlangen lang sind, dann bearbeitet die CNC-Zelle, was oben liegt, nicht was fällig ist.
4. Wenn die CNC-Zelle die falschen Aufträge bearbeitet, dann sind fällige Aufträge verspätet, und Eilaktionen und Überstunden in der Montage folgen.

Kernproblem: die Kennzahl Auslastung (ein Regelengpass). Die Lösung ist nicht mehr Kapazität, sondern eine andere Kennzahl und eine Freigaberegel, also DBR.

### Die Denkprozesse gut nutzen

- Bäume zu Beginn klein halten. Fünf bis zehn UDEs reichen für einen Bereich.
- Jeden Pfeil prüfen: Führt die Ursache wirklich zur Wirkung? Gibt es andere Ursachen?
- In einer Gruppe arbeiten, zu der Werker gehören; sie kennen die Effekte, die Führungskräfte nicht sehen.
- Die Konfliktwolke ist das einfachste Werkzeug für den Einstieg und das nützlichste bei alltäglichen Konflikten.

## TOC vs. Lean vs. Six Sigma

TOC, Lean und Six Sigma werden oft als Konkurrenten dargestellt. In der Praxis beantworten sie unterschiedliche Fragen.

| Thema | Theory of Constraints | Lean | Six Sigma |
|---|---|---|---|
| Ursprung | Goldratt, 1980er Jahre, Israel und USA [1][3] | Toyota-Produktionssystem, Japan | Motorola, 1980er Jahre, USA [27] |
| Kernfrage | wo ist der Hebel? | wo ist die Verschwendung? | wo ist die Streuung? |
| Fokus | der Engpass und der Gesamtdurchsatz | Fluss und Kundennutzen entlang des Wertstroms | Fehler und Prozessfähigkeit |
| Hauptwerkzeuge | fünf Fokussierungsschritte, DBR, Puffermanagement, Throughput Accounting, Denkprozesse | Wertstromanalyse, 5S, SMED, Kanban, Standardarbeit, Kaizen | DMAIC, Statistik, Regelkarten, statistische Versuchsplanung |
| Sicht auf Kapazität | Überkapazität an Nicht-Engpässen schützen | auf den Takt abgleichen, Überkapazität als Verschwendung abbauen | nicht zentral |
| Sicht auf Bestand | Puffer an wenigen ausgewählten Punkten, in Zeit | überall minimieren | nicht zentral |
| Finanzielle Sicht | Durchsatz, Bestand, Betriebsaufwand | Durchlaufzeit, Kosten, Qualität | Fehlerkosten (Cost of Poor Quality) |
| Typische Schwäche | enger Fokus kann Verschwendung außerhalb des Engpasses übersehen | Werkzeuge überall gleichzeitig anwenden | Projekte ohne Systemsicht ausgewählt |

### Wie sie zusammenwirken

1. **TOC setzt den Fokus.** Die fünf Fokussierungsschritte wählen die Stelle, an der Verbesserung das Werksergebnis verändert.
2. **Lean schöpft den Engpass aus.** SMED verkürzt die Rüstzeiten am Engpass, TPM erhöht seine Verfügbarkeit, Standardarbeit und 5S stabilisieren ihn. Siehe die Leitfäden [Lean Management](https://www.m365.fm/learn/lean-management/), [SMED](https://www.m365.fm/learn/smed-ruestzeitreduzierung/) und [TPM und OEE](https://www.m365.fm/learn/tpm-oee/).
3. **Six Sigma beseitigt Streuung am und vor dem Engpass.** Ausschuss am Engpass und eine späte, instabile Versorgung seines Puffers sind gute DMAIC-Projekte. Siehe [Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/).
4. **TOC misst das Ergebnis.** Throughput Accounting zeigt, was jedes Projekt für T, I und OE bewirkt hat.

### Wo Lean und TOC sich wirklich widersprechen

- **Austaktung (Line Balancing).** Lean gleicht Arbeitsinhalte auf den Takt ab. TOC hält Nicht-Engpässe bewusst unausgeglichen, mit freier Kapazität, um den Engpass zu schützen. In einer getakteten Montagelinie wirkt die Linie als Ganzes als Engpass; der Widerspruch zählt in der Werkstattfertigung mehr.
- **Puffer.** Lean behandelt Bestand als Verschwendung und Puffer als vorübergehende Gegenmaßnahme. TOC behandelt einen bemessenen Zeitpuffer am Engpass als dauerhaften Schutz. Beide senken den gesamten Umlaufbestand im Vergleich zu einem Push-System deutlich.
- **Pull-Mechanismen.** Kanban begrenzt den Umlaufbestand zwischen jedem Prozesspaar; DBR begrenzt ihn zwischen Freigabe und Engpass, ähnlich wie CONWIP, das Spearman, Woodruff und Hopp als Pull-Alternative zu Kanban vorgeschlagen haben [23]. Siehe den Leitfaden [Kanban und Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/).

### OEE am Engpass

Die OEE (Verfügbarkeit × Leistung × Qualität) ist am Engpass am nützlichsten, wo jede verlorene Minute Durchsatz kostet. An einem Nicht-Engpass kann eine niedrige OEE einfach heißen, dass er wartet, wie er soll. Wenn das Werk eine einzige OEE-Zahl über alle Maschinen berichtet, den Engpass getrennt ausweisen.

## Über das Werk hinaus: Critical Chain und Nachschub

### Critical-Chain-Projektmanagement

In *Critical Chain* (1997) übertrug Goldratt die TOC auf Projekte [3]. Die Ideen in Kürze:

- **Die kritische Kette** ist die längste Kette abhängiger Vorgänge unter Berücksichtigung sowohl der Vorgangs- als auch der Ressourcenabhängigkeiten. Ein kritischer Pfad ignoriert Ressourcenkonflikte.
- **Ambitionierte Vorgangsschätzungen.** Sicherheitszeiten werden aus den einzelnen Vorgängen herausgenommen.
- **Gebündelte Puffer.** Die herausgenommene Sicherheit wird in einem **Projektpuffer** am Ende und in **Zuführungspuffern** (Feeding Buffers) gebündelt, wo nicht kritische Ketten in die kritische Kette münden.
- **Puffermanagement.** Der Fortschritt wird mit einem Fieberdiagramm (Fever Chart) verfolgt: verbrauchter Puffer gegen erledigte Kette.
- **Kein schlechtes Multitasking.** Ressourcen beenden einen Vorgang, bevor sie den nächsten beginnen.

Der Vergleich von DBR- und Critical-Chain-Puffern beim PMI beschreibt die gemeinsame Logik: Beide schützen den Engpass des Systems mit gebündelten Zeitpuffern statt mit lokaler Sicherheit an jedem Schritt [24]. Für Werkzeugprojekte, Werkserweiterungen und Produktanläufe ist Critical Chain oft die zweite TOC-Anwendung nach DBR.

### Nachschub und Distribution

Für Lagerartikel und Ersatzteile ersetzt TOC die Prognosen an jedem Standort durch Puffer, die nach tatsächlichem Verbrauch aufgefüllt werden. Der Puffer wird auf den maximal erwarteten Verbrauch innerhalb der durchschnittlichen Wiederbeschaffungszeit bemessen, plus einen Zuschlag für unzuverlässige Belieferung; danach wird er um ein Drittel nach oben oder unten angepasst, je nachdem, wie lange der Bestand in der roten oder grünen Zone liegt [6]. Der Leitfaden [Bestandsmanagement in der Produktion](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/) vergleicht das mit klassischen Formeln für den Sicherheitsbestand, und der Leitfaden [S&OP und MRP](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) zeigt, wo es in die Planung passt.

## Vorlagen für die TOC-Arbeit

Diese Tabellen lassen sich in eine Tabellenkalkulation oder auf eine Shopfloor-Tafel übernehmen. Sie sind bewusst einfach gehalten.

### Vorlage 1: Arbeitsblatt zur Engpassidentifikation

| Ressource | Nachfragebedingte Belastung (min/Woche) | Verfügbar (min/Woche) | Produktiver Anteil | Effektive Belastung % | Mittlere Warteschlange davor (Arbeitsstunden) | Engpassrundgang: % arbeitet | Active Period: % alleinig / Summe | Ergebnis |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Vorlage 2: Verlustprotokoll am Engpass (je Schicht)

| Datum | Schicht | Geplante Minuten | Produktive Minuten | Pause nicht abgedeckt | Rüsten | Unterversorgt | Blockiert | Stillstand | Ausschuss/Nacharbeit | Bemerkungen |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | |

### Vorlage 3: Produktmix nach Durchsatz je Engpassminute

| Produkt | Preis | Wirklich variable Kosten | T je Stück | Engpassminuten je Stück | T je Engpassminute | Nachfrage | Rang | Geplante Menge |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Vorlage 4: Pufferstatus-Tafel

| Auftrag | Geschützter Punkt (Engpass / Montage / Versand) | Fällig am geschützten Punkt | Puffergröße (h) | Verbleibend (h) | Verbrauch % | Zone | Aktueller Ort | Verantwortlich |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Vorlage 5: Ursachenprotokoll für rote Aufträge

| Datum | Auftrag | Erreichte Zone | Ursachenkategorie (Material, Maschine, Qualität, Programm, Personal, Sonstiges) | Ursache im Detail | Verlorene Minuten am Engpass | Gegenmaßnahme | Verantwortlich |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Vorlage 6: Entscheidungsblatt zum Erweitern

| Option | Zusätzliche Engpassminuten/Woche | Δ T pro Woche | Δ OE pro Woche | Δ I (einmalig) | Δ NP pro Woche (ΔT − ΔOE) | Amortisation in Wochen (ΔI ÷ ΔNP) | Wohin wandert der Engpass als Nächstes? |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Vorlage 7: Konfliktwolke

| A: gemeinsames Ziel | B: Bedürfnis 1 | C: Bedürfnis 2 | D: Forderung für B | D': Forderung für C | Annahmen B–D | Annahmen C–D' | Annahmen D vs. D' | Injektion |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Vorlage 8: Tägliche Engpassrunde (10 Minuten, am Engpass)

| Minute | Thema | Eingabe |
|---|---|---|
| 0–2 | gestern: produktive Minuten vs. Plan, größter Verlust | Vorlage 2 |
| 2–5 | Puffer: rote und gelbe Aufträge, wer handelt | Vorlage 4 |
| 5–8 | Ursachen der roten Aufträge, offene Gegenmaßnahmen | Vorlage 5 |
| 8–10 | heute: Reihenfolge, Besetzung, Instandhaltungsfenster | Trommelplan |

Der Leitfaden [Shopfloor Management](https://www.m365.fm/learn/shop-floor-management/) zeigt, wie sich eine solche Runde in eine Kaskade von Regelkommunikationsrunden einbetten lässt.

## Einführungsfahrplan: die ersten sechs Monate

Der folgende Fahrplan gilt für ein Werk oder einen Wertstrom. Er setzt einen physischen Engpass im Werk voraus; zeigt die Analyse in Monat 1, dass der Markt der Engpass ist, direkt zu S-DBR und zur Vertriebsseite springen.

| Phase | Wochen | Ziele | Wichtige Aktivitäten | Abschlusskriterien |
|---|---|---|---|---|
| 0. Vorbereiten | 1–2 | gemeinsames Verständnis | die Führung liest *The Goal* oder spielt ein TOC-Planspiel; Ziel und Kennzahlen (T, I, OE) vereinbaren; Gewerkschaft oder Arbeitnehmervertretung früh einbinden | Sponsor benannt, Kernteam steht, Kennzahlen vereinbart |
| 1. Identifizieren | 3–6 | den Engpass mit Daten finden | Belastungstabelle (Methode 1), Zählung der Warteschlangen, Engpassrundgänge, Maschinendaten oder Active-Period-Analyse, falls vorhanden | Engpass durch Daten und durch den Shopfloor bestätigt |
| 2. Ausschöpfen | 5–12 | verlorene Engpasszeit zurückgewinnen | Verlustprotokoll am Engpass, Pausen abdecken, externes Rüsten, Qualität vor und nach dem Engpass, Vorrang in der Instandhaltung, Produktmix nach T je Engpassminute | produktive Minuten steigen, Verlust-Pareto in Gebrauch |
| 3. Unterordnen | 9–16 | Engpass schützen, Umlaufbestand senken | DBR- oder S-DBR-Pilot: Trommelplan, Puffer, Freigabe über das Seil; Auslastungsziele an Nicht-Engpässen abschaffen | Freigaberegel im täglichen Einsatz, Umlaufbestand sinkt |
| 4. Puffermanagement | 12–20 | tägliche Steuerung und Lernen | Pufferstatus-Tafel, Ursachenprotokoll für rote Aufträge, tägliche 10-Minuten-Engpassrunde, erste Anpassung der Puffergröße | weniger rote Aufträge, Ursachen werden behoben |
| 5. Messen und entscheiden | 16–24 | das Controlling an Bord holen | Throughput-Accounting-Sicht für Mix- und Auftragsentscheidungen, Abstimmung mit der Standardkostenrechnung | TA in mindestens einer echten Entscheidung genutzt |
| 6. Erweitern und überprüfen | 20–26 | Kapazität nur dort schaffen, wo es begründet ist; auf Trägheit prüfen | Entscheidungsblatt zum Erweitern (Vorlage 6), Arbeitspläne, Losregeln und Regeln für Terminzusagen überprüfen | Ort des Engpasses neu geprüft, nächster Zyklus geplant |

### Rollen

| Rolle | Verantwortung |
|---|---|
| Sponsor (Werksleitung) | Ziel, Kennzahlen, Beseitigung von Regelengpässen wie Auslastungszielen |
| Engpassverantwortlicher (Meister am Engpass) | tägliche produktive Minuten, Verlustprotokoll, Engpassrunde |
| Planer oder Disponent | Trommelplan, Freigabe, Puffergrößen, Lieferterminzusagen |
| Werkscontroller | Definitionen von T, I, OE; Produktmix- und Auftragsentscheidungen; Abstimmung |
| Leitung Instandhaltung | Reaktionszeit am Engpass, geplante Instandhaltungsfenster |
| Leitung Qualität | Prüfung vor und nach dem Engpass, Qualitätsursachen roter Aufträge |
| Werker am und um den Engpass | Verlustgründe, Rüstverbesserung, Ideen; sie verantworten die Gegenmaßnahmen |

### Kriterien für den Pilotbereich

Einen Wertstrom wählen, in dem (1) ein Engpass klar sichtbar ist, (2) Lieferfähigkeit oder Durchlaufzeit den Kunden schadet, (3) der Meister bereit ist und (4) Daten vorhanden sind oder für einige Wochen von Hand erfasst werden können. Der Leitfaden [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/) zeigt, wie man den Fluss aufnimmt und sieht, wo der Engpass im Wertstrom sitzt.

## TOC-Kennzahlen: Fortschritt messen

| Kennzahl | Formel | Ebene | Häufigkeit | Kommentar |
|---|---|---|---|---|
| Durchsatz (T) | Umsatz − wirklich variable Kosten | Werk | wöchentlich, monatlich | die zentrale Zielgröße |
| Betriebsaufwand (OE) | alle übrigen Ausgaben | Werk | monatlich | sollte langsamer wachsen als T |
| Bestand/Investition (I) | Materialwert von Lager und Umlaufbestand (in der weiten Sicht plus Anlagen) | Werk | monatlich | der Anteil Umlaufbestand sollte mit DBR sinken |
| Nettogewinn | T − OE | Werk | monatlich | |
| ROI | (T − OE) ÷ I | Werk | quartalsweise | |
| Produktive Minuten am Engpass | Gutteilminuten am Engpass ÷ verfügbare Minuten | Engpass | je Schicht | der tägliche Herzschlag |
| Plantreue am Engpass | im geplanten Fenster gestartete Aufträge ÷ geplante Aufträge | Engpass | täglich | zeigt, ob die Trommel hält |
| Anteil roter Aufträge | rote Aufträge ÷ offene Aufträge | Puffer | täglich | zu hoch: Puffer zu klein oder Prozess instabil |
| Termintreue | am oder vor dem zugesagten Termin versandte Aufträge ÷ versandte Aufträge | Kunde | wöchentlich | das sichtbarste Ergebnis |
| Durchlaufzeit | Freigabe bis Versand, Median und 90. Perzentil | Wertstrom | wöchentlich | mit Little's Law prüfen |
| Umlaufbestand in Tagen | Umlaufbestand ÷ mittlerer Tagesdurchsatz | Wertstrom | wöchentlich | |
| Throughput-Dollar-Days (TDD) | Σ (T-Wert des verspäteten Auftrags × Verspätungstage) | Verantwortlichkeit | wöchentlich | ein TOC-Maß für "Dinge, die hätten getan werden sollen"; Ursprung in Goldratts Arbeiten zur Leistungsmessung [unbelegt] |
| Inventory-Dollar-Days (IDD) | Σ (Bestandswert × Liegetage) | Verantwortlichkeit | wöchentlich | misst "Dinge, die nicht hätten getan werden sollen" [unbelegt] |

Zwei Regeln für die Kennzahlentafel: Engpasskennzahlen am Engpass zeigen, und die Auslastung von Nicht-Engpässen nicht als Leistungsziel zeigen. Der Leitfaden [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/) definiert die Standardkennzahlen der Produktion, die daneben stehen.

## Typische Fehler

| Fehler | Warum er schadet | Besser |
|---|---|---|
| Den Engpass nach Bauchgefühl bestimmen | das sichtbare Problem ist oft ein Symptom (die Montage war unterversorgt) | Belastungstabelle plus Prüfung vor Ort, Active-Period-Daten, falls vorhanden |
| Direkt zu Schritt 4 springen | Geld wird ausgegeben, während der Engpass noch 20 bis 25 % seiner Zeit verliert | zuerst ausschöpfen und unterordnen |
| Auslastungsziele an Nicht-Engpässen beibehalten | frühe Freigabe, mehr Umlaufbestand, der Engpass bearbeitet die falschen Aufträge | Nicht-Engpässe an "Der Engpass wartet nie auf uns" messen |
| Arbeit "sicherheitshalber" früh freigeben | Umlaufbestand und Durchlaufzeiten wachsen; Prioritäten gehen verloren | strikte Freigabe über das Seil |
| Puffer einmal festgelegt und vergessen | zu groß: Umlaufbestand bleibt hoch; zu klein: ständig rote Aufträge | anhand der Daten roter Aufträge anpassen |
| Kein Qualitätstor vor dem Engpass | der Engpass bearbeitet Teile, die schon Ausschuss sind | Prüfung oder Poka Yoke vor dem Engpass |
| Ausschuss wird weit hinten entdeckt | Engpasszeit wird unbemerkt verschwendet | kritische Merkmale direkt nach dem Engpass prüfen |
| Den Marktengpass ignorieren | ein Werk mit überall freier Kapazität "optimiert" weiter Maschinen | S-DBR, Lieferzeitangebote, Vertrieb einbinden |
| Produktmix nach Marge je Stück | weniger Gewinn bei gleicher Kapazität | nach T je Engpassminute reihen |
| Zwei konkurrierende Prioritätensysteme | Eillisten und Pufferfarben widersprechen sich | eine Regel: Pufferstatus |
| Engpass wandert, Regeln bleiben | alte Losgrößen und Terminzusagen blockieren den nächsten Gewinn | Überprüfung nach Schritt 5 in jedem Zyklus |
| Die Werker am Engpass bleiben allein | die Menschen, die die Verluste sehen, werden nicht gefragt | Werker verantworten Verlustgründe und Gegenmaßnahmen |

## Kritik und Grenzen der Theory of Constraints

TOC hat starke Ergebnisse in der Praxis und schwächere Unterstützung in der Forschung. Ein seriöser Leitfaden muss beides behandeln.

### 1. Evidenz: Erfolgsgeschichten und Publikationsverzerrung

Mabin und Balderstone werteten mehr als 80 veröffentlichte erfolgreiche TOC-Anwendungen aus und fanden erhebliche operative und finanzielle Verbesserungen; trotz umfangreicher Recherchen fanden sie keine Berichte über Fehlschläge [10]. Das ist ebenso eine Warnung wie eine Bestätigung. Veröffentlichte Fälle werden von Beratern, Anbietern und begeisterten Unternehmen geschrieben; gescheiterte Einführungen schaffen es selten in den Druck. Gupta und Snyder (2009) argumentierten, wie auf Wikipedia zusammengefasst, dass TOC ihre Wirksamkeit in der wissenschaftlichen Literatur noch nicht belegt habe, und forderten Studien, die die Einführung mit der finanziellen Leistung verknüpfen [6]. Panizzolos Befragung von 61 europäischen Werken ergab, dass einige TOC-Praktiken, vor allem DBR, Nicht-Engpässe mit Überkapazität und ein engpassbasierter Produktionsprogrammplan, mit besserer Leistung verbunden waren; die Ergebnisse unterschieden sich aber nach Land und beruhten auf Selbsteinschätzungen der Führungskräfte [11].

### 2. Optimalität und Forschung zur Ablaufplanung

Operations-Research-Fachleute haben TOC-Heuristiken als nicht optimal kritisiert. Trietsch argumentierte, DBR sei konkurrierenden Methoden unterlegen, und Linhares (2009) argumentierte, dass die TOC-Regel für den Produktmix (Reihung nach Durchsatz je Engpasseinheit) im Allgemeinen keine optimalen Ergebnisse garantieren kann, weil das Produktmixproblem mit mehreren Engpässen rechnerisch schwer ist [6]. Die praktische Lehre: Die Regel "T je Engpassminute" ist bei einem klaren Engpass verlässlich. Bei zwei oder mehr zusammenwirkenden Engpässen lineare Optimierung oder ein APS einsetzen.

### 3. Originalität

Kritiker haben darauf hingewiesen, dass viele TOC-Ideen schon vorher existierten: der Deckungsbeitrag je Engpassfaktor in der Kostenrechnung (Noreen, Smith und Mackey, 1995), Elemente von System Dynamics und statistischer Prozesslenkung, PERT/CPM im Projektmanagement [6]. Goldratt selbst würdigte frühere Arbeiten, insbesondere das Toyota-Produktionssystem und Fords Flussideen, in seinem Aufsatz "Standing on the Shoulders of Giants" von 2009 [6]. Für Praktiker zählt Originalität weniger als die Frage, ob die Kombination funktioniert; für Studierende lohnt es sich zu wissen, woher die Bausteine stammen.

### 4. Menschen und Regeln

Nave (2002) argumentierte, wie auf Wikipedia zusammengefasst, dass TOC dazu neige, die Beschäftigten zu übersehen, und erfolglose Regeln nicht als Engpässe behandle [6]. In der Praxis besteht das Risiko, dass "unterordnen" als "gehorchen" gelesen wird und die Werker am Engpass den ganzen Druck tragen. Abschnitt 20 behandelt das.

### 5. Wo TOC weniger gut passt

- **Ausgetaktete, getaktete Linien** mit Takt und geringer Streuung: Die Linie selbst ist der Engpass, und die Lean-Austaktung ist das bessere Werkzeug.
- **Stark wandernde Engpässe** in Werkstattfertigungen mit hoher Variantenvielfalt: Eine einzelne Trommel ist schwer zu bestimmen. S-DBR, belastungsorientierte Auftragsfreigabe (Workload Control) oder ein APS passen besser.
- **Werke, in denen jahrelang der Markt der Engpass ist:** Internes DBR bringt wenig; der Hebel liegt bei Vertrieb, Lieferzeit und Angebotsgestaltung.
- **Reife der Leistungsmessung:** Throughput Accounting braucht ein Controlling, das bereit ist, eine zweite Sicht zu führen. Fehlt es, fallen Entscheidungen auf Standardkosten zurück.

### 6. Kommerzieller Kontext

Ein großer Teil der TOC-Literatur erscheint bei North River Press und bei Beratungen, die Goldratt oder seine Weggefährten gegründet haben. Das macht sie nicht falsch, heißt aber, dass viele Quellen nicht unabhängig sind. Dieser Leitfaden nutzt begutachtete Quellen, wo es sie gibt, und kennzeichnet Praktikeraussagen (etwa die Angabe "30 Prozent verborgene Kapazität" des TOC Institute) als solche [4].

## Mensch und Arbeitssicherheit am Engpass

TOC kann die Arbeit der Menschen am Engpass besser oder schlechter machen. Die Methode selbst ist neutral; die Art der Einführung entscheidet.

### Was Werker zuerst bemerken

- **Mehr Aufmerksamkeit:** Führungskräfte interessieren sich plötzlich für jede Minute an einer Maschine. Das kann sich wie Kontrolle anfühlen. Erklären, warum, und die Werker die Verluste selbst erfassen lassen.
- **Pausen:** "Pausen abdecken" heißt, dass ein Springer die Maschine fährt, niemals, dass Leute ihre Pausen ausfallen lassen.
- **Leerlauf anderswo:** Werker an Nicht-Engpässen können sich um ihre Arbeitsplätze sorgen, wenn ihnen gesagt wird, keinen Bestand aufzubauen. Klarstellen, dass freie Kapazität gewollt ist, und sie für Schulung, Rüstverbesserung, 5S, Qualifizierung für den Engpass und Qualitätsarbeit nutzen.
- **Anerkennung:** Die Verbesserungen der Engpassmannschaft (wie das Rüsten von 30 auf 18 Minuten) sollten auf der Tafel sichtbar sein, mit Namen, wenn die Beteiligten zustimmen.

### Sicherheitsregeln werden für den Engpass nicht gebogen

Der Druck, den Engpass am Laufen zu halten, darf nie zu Abkürzungen bei der Sicherheit führen. In den USA fallen Wartung und Instandhaltung an Maschinen, bei denen unerwartetes Einschalten Menschen verletzen könnte, unter die OSHA-Norm zur Kontrolle gefährlicher Energie (Lockout/Tagout, 29 CFR 1910.147) [25]. Schnellere Rüstvorgänge müssen in das Verfahren hineinkonstruiert werden (Schnellspannvorrichtungen, voreingestellte Werkzeuge, bereitgestelltes Material), nicht durch das Auslassen von Lockout erreicht werden. Dasselbe gilt für Schutzeinrichtungen und Ergonomie: Ein Springer braucht dieselbe Unterweisung und Qualifikation wie der reguläre Bediener.

### Gewerkschaft und Arbeitnehmervertretung

In gewerkschaftlich organisierten Werken berühren versetzte Pausen, Springer, Samstagsschichten und geänderte Kennzahlen oft den Tarifvertrag. Gewerkschaft oder Arbeitnehmervertretung in Phase 0 des Fahrplans einbinden, das Ziel erklären und vereinbaren, wie Überstunden und Springerrollen vergeben werden. Eine TOC-Einführung, die mit einer Beschwerde über Pausenpläne beginnt, verliert Monate.

### Respekt vor dem Menschen in TOC-Begriffen

Die Konfliktwolke (Abschnitt 12) ist ein praktisches Werkzeug für Respekt vor dem Menschen: Sie unterstellt, dass beide Seiten eines Konflikts ein berechtigtes Bedürfnis haben, und sucht die falsche Annahme hinter dem Konflikt. In einem Team, zu dem Werker gehören, macht sie aus "Werker gegen Planer" ein gemeinsames Problem mit einem gemeinsamen Ziel.

## TOC im digitalen Werk: Daten, Simulation und APS

TOC entstand mit Software: OPT war ein Planungsprogramm, bevor es eine Philosophie wurde [3]. Heute helfen digitale Werkzeuge an vier Stellen.

### 1. Daten für die Engpasserkennung

MES- und IIoT-Plattformen liefern die Maschinenzustände mit Zeitstempel, die die Active-Period-Methode braucht (Abschnitt 6). Die meisten Werke haben die Zustände bereits (läuft, Leerlauf, Stillstand, Rüsten), trennen aber "unterversorgt" und "blockiert" nicht von "Leerlauf". Diese beiden Zustände zu ergänzen, ist oft die nützlichste einzelne Änderung für die TOC-Analyse. Mit den Werkern und, wo zutreffend, mit der Gewerkschaft oder Arbeitnehmervertretung vereinbaren, dass Maschinenzustandsdaten dazu dienen, Systemverluste zu finden, nicht einzelne Personen zu bewerten. Daten nur lesend von den Steuerungen erfassen und das OT-Netz segmentiert halten; der Leitfaden [OT-Security und ISA/IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) beschreibt, wie. Prüfen, ob die Uhren aller Maschinen synchronisiert sind, denn die Active-Period-Methode vergleicht Zeitstempel zwischen Ressourcen. Die Leitfäden [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) und [Predictive Maintenance und IIoT](https://www.m365.fm/learn/predictive-maintenance-iiot/) erklären den Datenweg; der Leitfaden [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/) behandelt Cloud-Analysen solcher Daten.

### 2. Simulation für wandernde Engpässe und Puffergrößen

Eine ereignisdiskrete Simulation erlaubt, Puffergrößen, Freigaberegeln und Erweiterungsoptionen zu testen, bevor man den Shopfloor ändert. Roser, Nakano und Tanaka entwickelten die Active-Period-Methode an Simulationsdaten [13][14]. Typische Fragen: Wie oft wandert der Engpass mit dem Mix des nächsten Quartals? Wie groß muss der Engpasspuffer sein, damit der Anteil roter Aufträge unter 10 Prozent bleibt? Verschiebt eine zweite Maschine den Engpass in die Montage? Der Leitfaden [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/) erklärt, wann aus einem Simulationsmodell ein digitaler Zwilling wird.

### 3. APS für die Trommelplanung

Ein APS kann die Trommel mit reihenfolgeabhängigen Rüstzeiten planen, Freigabetermine aus den Puffern berechnen und den Pufferstatus anzeigen. DBR liefert die Steuerungslogik, das APS die Rechenleistung, besonders wenn der Engpass wandert oder mehrere Engpässe zusammenwirken (dort versagt die einfache Produktmix-Regel, siehe Abschnitt 19). Der Leitfaden [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/) behandelt das ausführlich, einschließlich der Frage, wann das ERP ausreicht.

### 4. Wertstrommodelle für die Systemsicht

Ein digitales Wertstrommodell zeigt den Engpass im Zusammenhang des gesamten Flusses: Zykluszeiten, Verfügbarkeit, Losgrößen und Bestände. Ein Beispiel für solche Software ist iFAKT Polaris, das Wertstrommodellierung und Simulation verbindet; laut Hersteller gehört zu den Modulen eine Optimierung der Ablaufplanung [26]. Das ist eine Herstellerbeschreibung, kein unabhängiger Test. **Hinweis: Der Autor arbeitet bei der iFAKT GmbH.** Der Leitfaden [iFAKT Polaris](https://www.m365.fm/learn/ifakt-polaris/) beschreibt es ausführlicher; andere Wertstrom- und Simulationswerkzeuge können dieselbe TOC-Analyse leisten.

### Reihenfolge: erst die Methode, dann die Software

Verlustprotokoll am Engpass und Puffertafel auf Papier oder in einer Tabellenkalkulation beginnen. Automatisieren, wenn die Methode funktioniert und die Leute den Zahlen vertrauen. Ein Pufferstatus-Bildschirm, auf den niemand reagiert, ist schlechter als ein Whiteboard, das die tägliche Runde steuert.

## Glossar

| Begriff | Definition |
|---|---|
| Active Period (aktive Periode) | eine ununterbrochene Folge aktiver Zustände einer Ressource; Grundlage der Active-Period-Methode [13] |
| Active-Period-Methode | Methode zur Engpasserkennung: Zu jedem Zeitpunkt ist die Ressource mit der längsten ununterbrochenen aktiven Periode der Engpass [13][14] |
| Montagepuffer (Assembly Buffer) | Zeitpuffer, der Nicht-Engpassteile an der Montage auf das Engpassteil warten lässt |
| Bottleneck (Kapazitätsengpass) | eine Ressource, deren Kapazität kleiner ist als die Nachfrage, die auf ihr lastet |
| Engpassrundgang (Bottleneck Walk) | Shopfloor-Methode, bei der auf wiederholten Rundgängen die Zustände arbeitet, unterversorgt und blockiert notiert werden [15] |
| Puffermanagement (Buffer Management) | Verfolgung des Pufferverbrauchs nach Farbzonen, um Prioritäten zu setzen und Verbesserungsursachen zu finden [9] |
| Pufferverbrauch (Buffer Penetration) | bereits verbrauchter Anteil eines Zeitpuffers |
| Kapazitätsbeschränkte Ressource (CCR) | eine Ressource nahe ihrer Kapazitätsgrenze, die ohne Steuerung zum Engpass werden kann |
| Constraint (Engpass) | alles, was die Leistung eines Systems in Richtung seines Ziels begrenzt |
| Engpasspuffer (Constraint Buffer) | Zeitpuffer vor dem Engpass |
| CONWIP | Constant Work in Process; ein Pull-System, das den gesamten Umlaufbestand einer Linie begrenzt [23] |
| Kritische Kette (Critical Chain) | die längste Kette abhängiger Vorgänge unter Berücksichtigung von Vorgangs- und Ressourcenabhängigkeiten |
| Gegenwartsbaum (Current Reality Tree, CRT) | Denkprozess-Werkzeug, das unerwünschte Effekte mit Kernursachen verknüpft |
| Trommel (Drum) | der Plan des Engpasses, der das Tempo des Werks bestimmt |
| Drum-Buffer-Rope (DBR) | TOC-Planungsmethode: den Engpass planen, ihn mit Zeitpuffern schützen, in seinem Takt freigeben [6][8] |
| Erweitern (Elevate) | Schritt 4: Kapazität am Engpass schaffen |
| Konfliktwolke (Evaporating Cloud, EC) | Denkprozess-Werkzeug, um einen Konflikt durch Hinterfragen einer Annahme aufzulösen |
| Ausschöpfen (Exploit) | Schritt 2: mit vorhandenen Mitteln das Meiste aus dem Engpass herausholen |
| Zuführungspuffer (Feeding Buffer) | bei Critical Chain ein Puffer an der Stelle, an der eine nicht kritische Kette in die kritische Kette mündet |
| Fünf Fokussierungsschritte | identifizieren, ausschöpfen, unterordnen, erweitern, Trägheit verhindern [4] |
| Zukunftsbaum (Future Reality Tree, FRT) | Denkprozess-Werkzeug, um eine Lösung und ihre Nebenwirkungen zu prüfen |
| Trägheit (Inertia) | Regeln und Gewohnheiten, die den Engpass überleben, für den sie gemacht wurden |
| Bestand/Investition (Inventory, I) | Geld, das in Dingen gebunden ist, die das System verkaufen will (in der weiten Sicht auch in Anlagen) [20] |
| Little's Law | Umlaufbestand = Durchsatz × Durchlaufzeit [16] |
| Betriebsaufwand (Operating Expense, OE) | alles Geld, das ausgegeben wird, um Bestand in Durchsatz zu verwandeln [20] |
| Geplante Belastung (Planned Load) | bei S-DBR die zugesagte Arbeit auf der CCR, ausgedrückt in Zeit |
| POOGI | Process of Ongoing Improvement; die fünf Fokussierungsschritte als Kreislauf |
| Voraussetzungsbaum (Prerequisite Tree, PRT) | Denkprozess-Werkzeug, das Hindernisse und Zwischenziele auflistet |
| Projektpuffer (Project Buffer) | bei Critical Chain die gebündelte Sicherheitszeit am Projektende |
| Seil (Rope) | der Freigabemechanismus, der die Materialfreigabe an den Engpassplan koppelt |
| S-DBR (Simplified Drum-Buffer-Rope) | DBR-Variante mit Versandpuffer und Prüfung der geplanten Belastung, für Auftragsfertigung [6][9] |
| Wandernder Engpass (Shifting Bottleneck) | ein Engpass, der im Zeitverlauf zwischen Ressourcen wechselt [14] |
| Versandpuffer (Shipping Buffer) | Zeitpuffer, der den Liefertermin schützt |
| Unterordnen (Subordinate) | Schritt 3: alle Nicht-Engpässe auf den Engpass ausrichten |
| Durchsatz (Throughput, T) | Rate, mit der das System durch Verkäufe Geld erwirtschaftet: Umsatz minus wirklich variable Kosten [20] |
| Throughput Accounting (Durchsatzrechnung) | Kosten- und Leistungsrechnung auf Basis von T, I und OE |
| Throughput Accounting Ratio (TPAR) | Return per Factory Hour ÷ Cost per Factory Hour [19] |
| Übergangsbaum (Transition Tree, TrT) | Denkprozess-Werkzeug für die schrittweise Umsetzung |
| TOCICO | Theory of Constraints International Certification Organization, eine gemeinnützige Organisation nach US-Recht (501(c)(3)) [5] |
| Unerwünschter Effekt (Undesirable Effect, UDE) | ein beobachteter negativer Effekt, der als Eingabe für einen Gegenwartsbaum dient |
| VATI | Einteilung von Werken nach der Form des Materialflusses: V, A, T, I [6] |

## FAQ: häufige Fragen zur Theory of Constraints

### Was ist die Theory of Constraints einfach erklärt?

Jedes System hat ein oder wenige schwache Glieder, die begrenzen, wie viel es produzieren kann. Die Theory of Constraints sagt: Dieses schwache Glied finden, das Meiste aus ihm herausholen, alles andere darauf ausrichten und erst dann in es investieren. Sie wurde von Eliyahu M. Goldratt entwickelt und 1984 in *The Goal* vorgestellt [1].

### Was sind die 5 Schritte der Theory of Constraints?

Den Engpass identifizieren, den Engpass ausschöpfen, alles andere dem Engpass unterordnen, den Engpass erweitern und verhindern, dass Trägheit zum Engpass wird; danach von vorn beginnen [4].

### Was ist ein Beispiel für die Theory of Constraints?

Im Werk für Hydraulikblöcke in Abschnitt 5 begrenzte eine CNC-Zelle die Ausbringung. Abgedeckte Pausen, schnelleres Rüsten, bereitgestelltes Material und frühere Qualitätsprüfungen erhöhten ihre produktive Zeit um 800 Minuten pro Woche (22 Prozent), und die Umstellung des Produktmix auf Durchsatz je Engpassminute brachte Gewinn ohne Investition. Eine zweite Maschine für 650.000 USD erwies sich als schwächste Option.

### Was ist der Unterschied zwischen Bottleneck und Constraint?

Ein Bottleneck ist eine Ressource mit weniger Kapazität als die Nachfrage, die auf ihr lastet. Ein Constraint ist alles, was das Ziel des Systems begrenzt: ein Bottleneck, aber auch der Markt, ein Material, eine Regel oder eine Denkweise. Jeder Bottleneck, der die Ausbringung begrenzt, ist ein Constraint; nicht jeder Constraint ist ein Bottleneck.

### Wie erkennt man einen Engpass im Prozess?

Mit einer Kapazitätsbelastungstabelle beginnen (Nachfrage × Bearbeitungszeit gegen verfügbare Zeit) und das Ergebnis vor Ort mit Zählungen der Warteschlangen und einem Engpassrundgang bestätigen. Liegen Maschinenzustände mit Zeitstempel vor, die Active-Period-Methode nutzen, die auch wandernde Engpässe zeigt [13][14][15]. Abschnitt 6 vergleicht sechs Methoden.

### Was ist eine Engpassanalyse?

Die Engpassanalyse findet die Ressource, die einen Prozess begrenzt, beziffert, wie viel Ausbringung sie kostet, und prüft, ob sie im Zeitverlauf wandert. Im Werk mit einer Kapazitätsbelastungsrechnung beginnen, sie mit Zählungen der Warteschlangen und einem Engpassrundgang bestätigen und, wo vorhanden, Maschinenzustandsdaten mit der Active-Period-Methode nutzen (Abschnitt 6).

### Wie beseitigt man einen Engpass?

Den fünf Fokussierungsschritten folgen. Zuerst ausschöpfen (keine verlorenen Minuten, keine fehlerhafte Arbeit, der richtige Produktmix), dann den Rest des Werks seinem Takt unterordnen und erst danach mit Überstunden, Fremdvergabe oder neuen Anlagen erweitern. Im Beispiel mit den Hydraulikblöcken in Abschnitt 5 erhöhte allein das Ausschöpfen die produktive Zeit am Engpass um 22 Prozent, noch vor jeder Investition.

### Was sind Engpässe in der Produktion?

Alles, was begrenzt, wie viel ein Werk produzieren und ausliefern kann: Anlagenkapazität, Personal und Qualifikation, Material und Lieferanten, der Markt und die eigenen Regeln des Werks, etwa Losgrößen- oder Auslastungsregeln. Ein Produktionsengpass ist nicht immer eine Maschine (Abschnitt 3).

### Welche vier Arten von Engpässen gibt es?

Die Listen unterscheiden sich. In vier Gruppen gefasst sind die Arten aus Abschnitt 3 physische Engpässe (Anlagen, Personal, Material), Marktengpässe, Regelengpässe und Denkmuster-Engpässe. Die Tabelle in Abschnitt 3 teilt die physische Art in drei, das ergibt sechs.

### Was ist Drum-Buffer-Rope?

Drum-Buffer-Rope ist die Planungsmethode der TOC. Die Trommel ist der Plan des Engpasses, der Puffer ist ein Zeitpuffer, der den Engpass und den Liefertermin schützt, und das Seil gibt Material erst eine Pufferzeit vor dem Bedarf am Engpass frei [6][8]. Abschnitt 7 zeigt einen Freigabeplan mit Zahlen.

### Was ist Simplified Drum-Buffer-Rope (S-DBR)?

S-DBR ist eine Variante für Auftragsfertiger. Es verwendet nur einen Versandpuffer und prüft bei der Lieferterminzusage die geplante Belastung der kapazitätsbeschränkten Ressource, statt einen detaillierten Engpassplan zu führen [6][9].

### Was ist Puffermanagement?

Puffermanagement verfolgt, wie viel des Zeitpuffers jedes Auftrags verbraucht ist, und färbt Aufträge grün, gelb oder rot. Rote Aufträge bekommen Vorrang, und die Ursachen roter Aufträge werden zur Verbesserungsliste [9].

### Was ist Throughput Accounting?

Throughput Accounting ist die Kosten- und Leistungsrechnung der TOC. Sie verwendet Durchsatz (Umsatz minus wirklich variable Kosten), Bestand oder Investition und Betriebsaufwand; der Nettogewinn ist T − OE und der ROI (T − OE) ÷ I [20][22]. Unter einem Engpass reiht sie Produkte nach Durchsatz je Engpassminute.

### Was unterscheidet Throughput Accounting von der Kostenrechnung?

Die Standardkostenrechnung verteilt Lohn- und Gemeinkosten auf die Stücke und reiht Produkte nach Marge je Stück. Throughput Accounting behandelt Lohn- und Gemeinkosten als Betriebsaufwand, der sich kurzfristig nicht mit jedem Stück ändert, und reiht Produkte nach Durchsatz je Einheit Engpasszeit. Beide können gegensätzliche Antworten geben, wie das Beispiel in Abschnitt 11 zeigt.

### Was ist der Unterschied zwischen Lean und der Theory of Constraints?

Lean sucht Verschwendung im gesamten Wertstrom und schafft Fluss und Pull. TOC sucht den einen Engpass und konzentriert die Verbesserung dort. Lean taktet die Arbeit auf den Takt aus; TOC hält freie Kapazität an Nicht-Engpässen. Gemeinsam eingesetzt sagt TOC den Lean-Werkzeugen wie SMED und TPM, wo sie zuerst ansetzen sollen.

### Lassen sich TOC und Six Sigma kombinieren?

Ja. TOC wählt die Stelle, Six Sigma reduziert dort die Streuung, zum Beispiel Ausschuss am Engpass oder eine instabile Versorgung seines Puffers. Throughput Accounting zeigt dann die finanzielle Wirkung jedes Projekts.

### Was sind die Denkprozesse der TOC?

Eine Reihe von Logikwerkzeugen für nicht physische Probleme: Gegenwartsbaum, Konfliktwolke, Zukunftsbaum, Voraussetzungsbaum und Übergangsbaum. Sie beantworten, was zu ändern ist, wozu hin es zu ändern ist und wie die Änderung herbeigeführt wird [12].

### Was ist Critical-Chain-Projektmanagement?

Goldratts Anwendung der TOC auf Projekte, aus seinem Buch *Critical Chain* von 1997 [3]. Es plant die längste Kette aus Vorgangs- und Ressourcenabhängigkeiten, nimmt die Sicherheit aus den einzelnen Vorgängen heraus und bündelt sie in Projekt- und Zuführungspuffern.

### Was bedeutet die Theory of Constraints im Supply Chain Management?

In Lieferketten ersetzt TOC prognosegetriebene Bestände an jedem Standort durch Puffer, die nach tatsächlichem Verbrauch aufgefüllt und nach Pufferstatus neu bemessen werden [6]. Sie behandelt das schwächste Glied, oft einen Lieferanten, ein Werk oder den Markt, als den Engpass, der das Tempo des ganzen Systems bestimmt. Abschnitt 14 fasst die Nachschubregeln zusammen.

### Welche Kritik gibt es an der Theory of Constraints?

Die Hauptkritikpunkte sind Publikationsverzerrung in Erfolgsstudien, die fehlende Optimalität von TOC-Heuristiken, wenn mehrere Engpässe zusammenwirken, die begrenzte Originalität einiger Ideen und eine Neigung, Menschen und Regeln zu vernachlässigen [6][10]. Abschnitt 19 behandelt jeden Punkt.

### Ist die Theory of Constraints noch aktuell?

Ja. Werke haben weiterhin Engpässe, und die Kombination aus besseren Maschinendaten, Simulation und APS macht es leichter, wandernde Engpässe zu finden und eine Trommel zu planen. Geändert hat sich, dass TOC selten allein eingesetzt wird; meist wird sie mit Lean, Six Sigma und digitaler Planung kombiniert.

### Wer hat die Theory of Constraints entwickelt?

Eliyahu M. Goldratt (1947 bis 2011), ein israelischer Physiker und Wirtschaftsautor. Er stellte TOC in *The Goal* (1984) vor, gemeinsam geschrieben mit Jeff Cox [1][2].

### Wie lange dauert die Einführung der Theory of Constraints?

In einem Werk oder Wertstrom kommen die ersten messbaren Ergebnisse meist innerhalb weniger Wochen aus dem Ausschöpfen, weil es wenig Geld braucht. Eine stabile DBR- oder S-DBR-Routine mit Puffermanagement dauert mehrere Monate; der Fahrplan in Abschnitt 16 plant sechs Monate für den ersten vollständigen Zyklus. Diese Dauern sind Planungsannahmen, keine Vergleichswerte aus einer Studie.

### Gibt es eine Zertifizierung für die Theory of Constraints?

TOCICO bietet eine Zertifizierung in drei Stufen an: Grundlagenprüfungen, Praktikerprüfungen und eine Bewertung als Implementierer, in Bereichen wie Operations, Supply Chain, Projektmanagement (CCPM), Denkprozesse und Finanzen [5].

## Fazit und erste Schritte

Die Theory of Constraints beginnt mit einer einfachen Beobachtung: Die Ausbringung eines Werks wird von sehr wenigen Engpässen bestimmt, meist von einem. Das verändert, was Führungskräfte tun sollten. Statt alles gleichzeitig zu verbessern: den Engpass finden, aufhören, seine Zeit zu verschwenden, den Rest des Werks ihm dienen lassen und erst danach Geld ausgeben. Drum-Buffer-Rope macht aus dieser Logik einen Plan, Puffermanagement macht daraus tägliche Prioritäten, und Throughput Accounting macht daraus finanzielle Entscheidungen, die Standardkostenberichte falsch treffen können.

Das durchgerechnete Beispiel zeigt die Größenordnung dessen, was ohne Investition oft möglich ist: 22 Prozent mehr Engpasszeit durch Pausen, Rüsten, Materialbereitstellung und Qualitätsprüfungen, und eine Änderung des Produktmix, die die Standardkostenrechnung nicht nahegelegt hätte. Es zeigt auch die Grenzen: Ist der Engpass ausgeschöpft, wandert er, und alte Regeln werden zum nächsten Problem. TOC ist am stärksten bei einem klaren Engpass und braucht andere Werkzeuge (Optimierung, APS, Lean-Austaktung), wo Engpässe wandern oder zusammenwirken. Die Evidenz besteht überwiegend aus Erfolgsgeschichten, also die Aussagen im eigenen Werk prüfen.

**Erste Schritte in den nächsten 30 Tagen**

- [ ] Für die wichtigste Produktfamilie eine Belastungstabelle erstellen (Nachfrage × Bearbeitungszeit gegen verfügbare Zeit) und den Engpasskandidaten benennen
- [ ] Ihn eine Woche lang mit Zählungen der Warteschlangen und drei Engpassrundgängen pro Schicht bestätigen
- [ ] Am Kandidaten ein Verlustprotokoll (Vorlage 2) beginnen und zwei Wochen lang in jeder Schicht ausfüllen
- [ ] Mit dem Controlling den Durchsatz je Engpassminute für die 10 wichtigsten Produkte berechnen (Vorlage 3)
- [ ] Die zwei größten Verluste auswählen und angehen (Pausenabdeckung, externes Rüsten, Qualität vor dem Engpass)
- [ ] Mindestens ein Auslastungsziel an einem Nicht-Engpass abschaffen
- [ ] Gewerkschaft oder Arbeitnehmervertretung über Ziele, Pausenabdeckung und die Rolle freier Kapazität informieren
- [ ] Bei der IT nachfragen, ob die Maschinendaten "unterversorgt" und "blockiert" für die Active-Period-Methode von "Leerlauf" trennen können
- [ ] Eine tägliche 10-Minuten-Runde am Engpass abhalten (Vorlage 8)

---

## Weiterlesen auf m365.fm

**Verwandte Leitfäden**
- [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/) (Feinplanung mit begrenzter Kapazität, DBR in einem APS, Freigabeverfahren)
- [Lean Management](https://www.m365.fm/learn/lean-management/)
- [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)
- [Operational Excellence](https://www.m365.fm/learn/operational-excellence/)
- [Shopfloor Management und Gemba Walks](https://www.m365.fm/learn/shop-floor-management/)
- [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/)
- [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/)
- [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/)
- [iFAKT Polaris](https://www.m365.fm/learn/ifakt-polaris/)

**Neue Leitfäden dieser Reihe (geplant)**
- [SMED und Rüstzeitreduzierung](https://www.m365.fm/learn/smed-ruestzeitreduzierung/) (geplant)
- [TPM und OEE](https://www.m365.fm/learn/tpm-oee/) (geplant)
- [Kanban und Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/) (geplant)
- [Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant)
- [S&OP, MRP und Produktionsplanung](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) (geplant)
- [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant)
- [Predictive Maintenance und IIoT](https://www.m365.fm/learn/predictive-maintenance-iiot/) (geplant)
- [Simulation in der Produktion](https://www.m365.fm/learn/digital-twin/simulation-produktion/) (geplant)
- [Losgröße berechnen](https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/) (geplant)
- [Bestandsmanagement in der Produktion](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/) (geplant)

**Glossarbegriffe (Entities)**
[Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Engpassorientierte Planung](https://www.m365.fm/entity/constraint-based-scheduling/) · [Puffermanagement](https://www.m365.fm/entity/buffer-management/) · [Taktzeit](https://www.m365.fm/entity/takt-time/) · [Wertstromanalyse](https://www.m365.fm/entity/value-stream-mapping/) · [SMED](https://www.m365.fm/entity/smed/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Pull-Prinzip](https://www.m365.fm/entity/pull-system/)

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Lean Management, Operational Excellence, Produktionsplanung und die digitale Transformation der Produktion, mit einem Schwerpunkt darauf, wie Wertstrommodelle, Simulation und Kennzahlenanalyse Werken helfen, ihre Engpässe zu finden und zu steuern. [Redaktion: Rolle, Kurzbiografie und Foto ergänzen.]

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Quellen

Alle Onlinequellen abgerufen am 20. November 2026. Mit (S) gekennzeichnete Quellen wurden aus der Quellenliste des Schwester-Pillars *Production Scheduling and APS* (`production-scheduling-aps.md`) übernommen und dort am selben Tag geprüft; in der Recherchesitzung der englischen Fassung konnten sie nicht erneut abgerufen werden, weil das gemeinsame Budget für Websuche und Abruf aufgebraucht war (siehe Prüfhinweise).

1. Goldratt, Eliyahu M.; Cox, Jeff: The Goal: Excellence in Manufacturing. North River Press, Croton-on-Hudson (NY) 1984, 262 S., ISBN 978-0-88427-060-7, LCCN 85021827. Katalogeintrag: Open Library. https://openlibrary.org/books/OL2540561M/The_goal
2. North River Press: Eliyahu M. Goldratt, Renowned Business Guru and Author of International Best Selling Business Novel The Goal, Dies at Age 64. Pressemitteilung über PR Newswire, 14. Juni 2011. https://prnewswire.com/news-releases/eliyahu-m-goldratt-renowned-business-guru-and-author-of-international-best-selling-business-novel-the-goal-dies-at-age-64-123796619.html
3. Eliyahu M. Goldratt (Biografie, Creative Output und OPT, Avraham Y. Goldratt Institute, Bibliografie mit Jahreszahlen). Wikipedia. https://en.wikipedia.org/wiki/Eliyahu_M._Goldratt
4. Theory of Constraints Institute: Five Focusing Steps. https://www.tocinstitute.org/five-focusing-steps.html (sowie die Übersichtsseite https://www.tocinstitute.org/theory-of-constraints.html)
5. Theory of Constraints International Certification Organization (TOCICO): About us (Status 501(c)(3), Zertifizierungsstufen, TOC Innovation Summit). https://www.tocico.org/about-us
6. Theory of constraints (fünf Fokussierungsschritte, Puffer und Puffermanagement, DBR und S-DBR, VATI, Throughput Accounting, Critical Chain, Kritikabschnitt mit Verweisen auf Trietsch, Linhares 2009, Noreen/Smith/Mackey 1995, Gupta/Snyder 2009, Nave 2002 und Goldratt 2009). Wikipedia. https://en.wikipedia.org/wiki/Theory_of_constraints
7. The Goal (novel) (Auflagen, Figuren, Time-Liste 2011 mit Verweis auf Rawlings, N.: The 25 Most Influential Business Management Books, Time, 9. August 2011). Wikipedia. https://en.wikipedia.org/wiki/The_Goal_(novel)
8. (S) Goldratt, Eliyahu M.; Fox, Robert E.: The Race. North River Press 1986, 179 S., ISBN 0-88427-062-9. Nachweis: https://buresund.nu/books/the-race
9. (S) Cox, James F. III; Schleier, John G. (Hrsg.): Theory of Constraints Handbook. McGraw-Hill, New York 2010, ISBN 978-0-07-166554-4; Kap. 8: Srikanth, M. L.: DBR, Buffer Management, and VATI Flow Classification; Kap. 9: From DBR to Simplified-DBR for Make-to-Order. Kapitelnachweis: https://www.toc-goldratt.com/en/product/dbr-buffer-management-and-vati-flow-classification-chapter-8-of-the-theory-of-constraints-handbook
10. Mabin, Victoria J.; Balderstone, Steven J.: The performance of the theory of constraints methodology: Analysis and discussion of successful TOC applications. International Journal of Operations & Production Management 23 (2003) 6, S. 568–595. DOI: 10.1108/01443570310476636. https://www.emeraldinsight.com/doi/abs/10.1108/01443570310476636
11. Panizzolo, Roberto: Theory of Constraints (TOC) Production and Manufacturing Performance. International Journal of Industrial Engineering and Management 7 (2016) 1, S. 15–23. https://www.research.unipd.it/retrieve/e14fb26b-f0bc-3de1-e053-1705fe0ac030/ijiem_vol7_no1_3.pdf
12. Kim, Sanghyun; Mabin, Victoria J.; Davies, John: The theory of constraints thinking processes: retrospect and prospect. International Journal of Operations & Production Management 28 (2008) 2, S. 155–184. DOI: 10.1108/01443570810846883
13. Roser, Christoph; Nakano, Masaru; Tanaka, Minoru: A Practical Bottleneck Detection Method. In: Peters, B. A.; Smith, J. S.; Medeiros, D. J.; Rohrer, M. W. (Hrsg.): Proceedings of the 2001 Winter Simulation Conference, S. 949–953. https://informs-sim.org/wsc01papers/126.PDF
14. Roser, Christoph; Nakano, Masaru; Tanaka, Minoru: Shifting Bottleneck Detection. In: Yücesan, E.; Chen, C.-H.; Snowdon, J. L.; Charnes, J. M. (Hrsg.): Proceedings of the 2002 Winter Simulation Conference, S. 1079–1086. https://www.informs-sim.org/wsc02papers/145.pdf
15. Roser, Christoph: Mathematically Accurate Bottleneck Detection 2 – The Active Period Method. AllAboutLean.com, 29. Juni 2014 (aktualisiert am 13. Mai 2026). https://www.allaboutlean.com/active-period-method
16. Little, John D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (1961) 3, S. 383–387. DOI: 10.1287/opre.9.3.383 (bibliografische Daten über Crossref bestätigt, 20. November 2026)
17. (S) Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3. Aufl., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Katalogeintrag: https://search.worldcat.org/oclc/718450337
18. (S) Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57 (1961) 4, S. 902–904. DOI: 10.1017/S0305004100036094
19. ACCA (Performance Management examining team): Throughput accounting and the theory of constraints, part 2. Association of Chartered Certified Accountants, Fachartikel. https://www.accaglobal.com/us/en/student/exam-support-resources/fundamentals-exams-study-resources/f5/technical-articles/throughput-constraints2.html
20. Murphy, Sean: Zusammenfassung von Goldratt, E. M.: The Haystack Syndrome: Sifting Information Out of the Data Ocean. North River Press, New York 1990. Management and Accounting Web (MAAW, J. R. Martin). https://maaw.info/ArticleSummaries/ArtSumHaystackSyndrome90.htm
21. Corbett, Thomas: Throughput Accounting. North River Press, 174 S., ISBN 978-0-88427-158-1 (Händlereintrag mit Datum 1. Januar 1999; Verlagsseite: https://www.toc-goldratt.com/en/product/Throughput-Accounting). Eintrag: https://www.booktopia.com.au/throughput-accounting-thomas-corbett/book/9780884271581.html
22. Theory of Constraints (TOC): Kennzahlen des Throughput Accounting, abgeleitete Größen und Entscheidungspriorität. Lean Production (Vorne Industries). https://www.leanproduction.com/theory-of-constraints/
23. (S) Spearman, Mark L.; Woodruff, David L.; Hopp, Wallace J.: CONWIP: a pull alternative to kanban. International Journal of Production Research 28 (1990) 5, S. 879–894. DOI: 10.1080/00207549008942761
24. Gray, Virginia; Felan, Joe; Umble, Elisabeth; Umble, Michael: A comparison of drum-buffer-rope (DBR) and critical chain (CC) buffering techniques. Vortrag auf der PMI Research Conference 2000, Paris. Project Management Institute. https://www.pmi.org/learning/library/drum-buffer-rope-critical-chain-buffering-8526
25. Occupational Safety and Health Administration (OSHA): 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). US Department of Labor. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147
26. iFAKT GmbH: Polaris Optimizer (Herstellerseite; die Navigation nennt außerdem Simulator und Value Stream Mapping). https://www.ifakt.de/en/solutions/optimizer
27. National Institute of Standards and Technology (NIST): Malcolm Baldrige National Quality Award 1988, Preisträgerprofil Motorola Inc. ("Six Sigma Quality"). https://www.nist.gov/system/files/documents/2017/10/11/1988_Motorola_Inc.pdf
28. PwC Viewpoint: Inventory guide, Abschnitt 1.3 Cost (Definition der Bestandskosten als Summe der direkt oder indirekt angefallenen Ausgaben; Verweis auf ASC 330-10-30-3 bis 30-8). https://viewpoint.pwc.com/dt/us/en/pwc/accounting_guides/inventory/Inventory-Guide/Chapter-1-Inventory-costing/1_3_Cost.html (abgerufen am 20. November 2026)
29. RSM US LLP: Inventory valuation considerations in the forecasted economy, April 2023 (Verteilung fixer Fertigungsgemeinkosten auf Basis der Normalkapazität; ASC 330-10-30-6 zu ungewöhnlich niedriger Produktion). https://rsmus.com/content/dam/rsm/insights/financial-reporting/1pdf/Inventory-valuation-considerations-in-the-forecasted-economy.pdf (abgerufen am 20. November 2026)

# Prüfhinweise für die Redaktion

**Hersteller- und Praktikerangaben (im Text gekennzeichnet)**

- TOC Institute: "ein Engpass wird, gerechnet auf 24/7, oft weniger als 50 % der Zeit genutzt" und "die ersten drei Schritte legen typischerweise innerhalb weniger Monate mindestens 30 % verborgene Kapazität frei" [4]. Kein veröffentlichter Datensatz; in den Abschnitten 4 und 19 als unbelegte Praktikeraussagen gekennzeichnet.
- Modulbeschreibung iFAKT Polaris [26]: Herstellerangabe, als solche gekennzeichnet, mit Offenlegung. iFAKT bezahlt nicht für die Veröffentlichung.
- Die mittleren Verbesserungen nach Mabin und Balderstone (70/65/49/63/44 %) sind so zitiert, wie Panizzolo sie berichtet [11]; das Originalbuch von 2000 wurde nicht eingesehen. Ihr Abstract stellt fest, dass keine Berichte über Fehlschläge gefunden wurden [10]; der Artikel behandelt das als Hinweis auf Publikationsverzerrung.

**[unbelegt]-Stellen**

1. Einführungsjahr von OPT bei Creative Output ("vor 1984"; Wikipedia nennt kein Jahr).
2. Startwert "etwa die Hälfte der aktuellen Durchlaufzeit" für einen Puffer.
3. S-DBR-Konvention "Datum der geplanten Belastung plus halber Versandpuffer" (Kap. 9 des *Theory of Constraints Handbook* nicht direkt eingesehen).
4. Throughput-Dollar-Days und Inventory-Dollar-Days: Formeln in der TOC-Praxis üblich, Ursprung in Goldratts Werk nicht geprüft.

Die Kritiker im Abschnitt 19 (Trietsch, Linhares 2009, Noreen et al. 1995, Gupta und Snyder 2009, Nave 2002, Goldratt 2009) sind über die Wikipedia-Zusammenfassung [6] zitiert; vor Veröffentlichung die Primär-DOIs ergänzen (z. B. Linhares 2009, DOI 10.1016/j.ijpe.2009.04.023, laut englischer Fassung über Crossref und RePEc bestätigt).

**Rechenbeispiel** Das Werk für Hydraulikblöcke (Abschnitte 5, 7 bis 11) ist für diesen Leitfaden konstruiert. Alle Zahlen sind in sich stimmig und wurden aus der englischen Fassung unverändert übernommen, nur ins deutsche Zahlenformat gebracht; USD-Beträge bleiben USD.

**Interne Links** Alle `/en/learn/`-Links der englischen Fassung sind auf die deutschen URLs umgestellt: produktionsplanung-aps, lean-management, wertstromanalyse, produktionskennzahlen, operational-excellence, shop-floor-management, digital-twin, manufacturing-it-azure, produktionsplanung-luftfahrt, ifakt-polaris (bestehende deutsche Pillars); smed-ruestzeitreduzierung, tpm-oee, kanban-pull-prinzip, six-sigma-ursachenanalyse, sop-mrp-produktionsplanung, mes-isa-95, predictive-maintenance-iiot, ot-security-iec-62443 (neue Pillars, geplant); Cluster `/learn/digital-twin/simulation-produktion/`, `/learn/produktionsplanung-aps/bestandsmanagement/` und `/learn/produktionsplanung-aps/losgroesse/` (geplant). Entity-Links (`/entity/...`) unverändert. Vor Veröffentlichung prüfen, ob alle Ziele online sind. Kannibalisierung: Der deutsche Pillar Produktionsplanung und APS enthält einen kompakten TOC/DBR-Abschnitt; dort auf diesen Artikel verlinken und die Keywords "Theory of Constraints" und "Drum-Buffer-Rope" diesem Artikel überlassen.

**JSON-LD-Vorschlag**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Theory of Constraints: die fünf Fokussierungsschritte, Engpässe und Drum-Buffer-Rope",
      "description": "Theory of Constraints in der Produktion: fünf Fokussierungsschritte, Engpassanalyse, Drum-Buffer-Rope mit Zahlen, Throughput Accounting, Vorlagen.",
      "inLanguage": "de-DE",
      "datePublished": "2026-11-26",
      "dateModified": "2026-11-26",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "mainEntityOfPage": "https://www.m365.fm/learn/theory-of-constraints-engpass/",
      "about": [
        {"@type": "Thing", "name": "Theory of Constraints"},
        {"@type": "Thing", "name": "Drum-Buffer-Rope"},
        {"@type": "Thing", "name": "Throughput Accounting"}
      ]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "de-DE",
      "mainEntity": [
        {"@type": "Question", "name": "Was sind die 5 Schritte der Theory of Constraints?", "acceptedAnswer": {"@type": "Answer", "text": "Den Engpass identifizieren, den Engpass ausschöpfen, alles andere dem Engpass unterordnen, den Engpass erweitern und verhindern, dass Trägheit zum Engpass wird; danach von vorn beginnen."}},
        {"@type": "Question", "name": "Was ist Drum-Buffer-Rope?", "acceptedAnswer": {"@type": "Answer", "text": "Die Planungsmethode der TOC: Die Trommel ist der Plan des Engpasses, der Puffer ist ein Zeitpuffer, der den Engpass und den Liefertermin schützt, und das Seil gibt Material erst eine Pufferzeit vor dem Bedarf am Engpass frei."}},
        {"@type": "Question", "name": "Was ist der Unterschied zwischen Bottleneck und Constraint?", "acceptedAnswer": {"@type": "Answer", "text": "Ein Bottleneck ist eine Ressource mit weniger Kapazität als die Nachfrage, die auf ihr lastet. Ein Constraint ist alles, was das Ziel des Systems begrenzt, auch der Markt, Material und Regeln."}},
        {"@type": "Question", "name": "Was ist Throughput Accounting?", "acceptedAnswer": {"@type": "Answer", "text": "Die Kosten- und Leistungsrechnung der TOC auf Basis von Durchsatz (Umsatz minus wirklich variable Kosten), Bestand oder Investition und Betriebsaufwand. Der Nettogewinn ist T minus OE; unter einem Engpass werden Produkte nach Durchsatz je Engpassminute gereiht."}},
        {"@type": "Question", "name": "Was ist eine Engpassanalyse?", "acceptedAnswer": {"@type": "Answer", "text": "Die Engpassanalyse findet die Ressource, die einen Prozess begrenzt, beziffert, wie viel Ausbringung sie kostet, und prüft, ob sie im Zeitverlauf wandert. Im Werk mit einer Kapazitätsbelastungsrechnung beginnen, sie mit Zählungen der Warteschlangen und einem Engpassrundgang bestätigen und, wo vorhanden, Maschinenzustandsdaten mit der Active-Period-Methode nutzen."}},
        {"@type": "Question", "name": "Wie beseitigt man einen Engpass?", "acceptedAnswer": {"@type": "Answer", "text": "Den fünf Fokussierungsschritten folgen: zuerst ausschöpfen, dann den Rest des Werks seinem Takt unterordnen und erst danach mit Überstunden, Fremdvergabe oder neuen Anlagen erweitern. Im Beispiel erhöhte allein das Ausschöpfen die produktive Zeit am Engpass um 22 Prozent."}},
        {"@type": "Question", "name": "Welche vier Arten von Engpässen gibt es?", "acceptedAnswer": {"@type": "Answer", "text": "Die Listen unterscheiden sich. In vier Gruppen gefasst: physische Engpässe (Anlagen, Personal, Material), Marktengpässe, Regelengpässe und Denkmuster-Engpässe."}},
        {"@type": "Question", "name": "Was bedeutet die Theory of Constraints im Supply Chain Management?", "acceptedAnswer": {"@type": "Answer", "text": "In Lieferketten ersetzt TOC prognosegetriebene Bestände an jedem Standort durch Puffer, die nach tatsächlichem Verbrauch aufgefüllt und nach Pufferstatus neu bemessen werden. Das schwächste Glied bestimmt das Tempo des ganzen Systems."}}
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Learn", "item": "https://www.m365.fm/learn/"},
        {"@type": "ListItem", "position": 2, "name": "Theory of Constraints", "item": "https://www.m365.fm/learn/theory-of-constraints-engpass/"}
      ]
    }
  ]
}
```

**hreflang** `de-DE` https://www.m365.fm/learn/theory-of-constraints-engpass/ <-> `en-US` https://www.m365.fm/en/learn/theory-of-constraints/; jeweils selbstreferenzierender Canonical. In der englischen Fassung steht noch "no hreflang pair"; dort beim Livegang ergänzen.

**Empfohlene Grafiken**

1. Die fünf Fokussierungsschritte als Kreislauf (identifizieren → ausschöpfen → unterordnen → erweitern → Trägheit verhindern → zurück zu identifizieren).
2. Balkendiagramm der Belastung im Werk für Hydraulikblöcke (fünf Ressourcen gegen die 100-%-Linie; CNC theoretisch bei 102 %, effektiv bei 136 %).
3. Gestapelter Balken: Nutzung der 4.800 CNC-Minuten vor und nach dem Ausschöpfen.
4. DBR-Schema: Freigabe (Seil) → Säge → Engpasspuffer → CNC (Trommel) → Versandpuffer → Kunde, mit Zeitachse.
5. Gantt-Diagramm der aktiven Perioden für das Zwei-Stunden-Protokoll in Abschnitt 6, alleinige und wandernde Perioden schattiert.
6. Muster einer Pufferstatus-Tafel (grün/gelb/rot).
7. Gegenüberstellung als Tabellengrafik: Reihung von A und B nach Standardkosten und nach Durchsatz.
8. Konfliktwolke zum Losgrößenkonflikt.

**Für den deutschen Markt prüfen (Aufgabe für die Fachprüfung)**

- Abschnitt 20 "Sicherheitsregeln": Die OSHA-Norm 29 CFR 1910.147 (Lockout/Tagout) ist US-Kontext. Für deutsche Werke prüfen, ob ein Hinweis auf die entsprechenden deutschen Regelungen (z. B. ArbSchG, BetrSichV, DGUV-Vorschriften zum Sichern gegen Wiedereinschalten) ergänzt werden soll.
- Abschnitt 20 "Gewerkschaft und Arbeitnehmervertretung", Fahrplan Phase 0, Abschnitt 21 (Maschinenzustandsdaten) und Checkliste im Fazit: Das Original spricht von Union und Collective Bargaining Agreement. In Deutschland betreffen Pausenregelungen, Samstagsschichten, Überstunden und die Auswertung von Maschinendaten mit möglichem Personenbezug die Mitbestimmung des Betriebsrats (§ 87 BetrVG); prüfen, ob "Betriebsrat" ausdrücklich genannt werden soll.
- Abschnitt 11 "Bestand und ausgewiesener Gewinn": US-GAAP (ASC 330) ist US-Kontext. Für deutsche Leser prüfen, ob ein Hinweis auf die Herstellungskosten nach HGB (§ 255) bzw. IAS 2 sinnvoll ist.
- Schritt 4 im Beispiel (Samstagsschicht über Tarifvertrag): Beispiel spielt in den USA; ggf. Hinweis auf Arbeitszeitgesetz und Tarifbindung prüfen.
- Deutsche Buchtitel (*Das Ziel*) wurden nur für *The Goal* ergänzt; weitere deutsche Ausgaben von Goldratt-Titeln vor Ergänzung belegen.

**Fachliche Prüfung** Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.
