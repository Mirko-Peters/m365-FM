# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | SMED: Rüstzeit reduzieren mit der SMED-Methode (46 Zeichen) |
| Meta-Description | SMED erklärt: Rüstzeit reduzieren in 8 Schritten, internes und externes Rüsten, Formeln zur Rüstzeit, Beispiele, Vorlagen und Sicherheit beim Rüsten. (149 Zeichen) |
| Slug | `/learn/smed-ruestzeitreduzierung/` (vollständige URL: https://www.m365.fm/learn/smed-ruestzeitreduzierung/) |
| Hauptkeyword | SMED (Varianten: SMED-Methode, Rüstzeit reduzieren, Rüstzeitreduzierung) |
| Nebenkeywords | Single Minute Exchange of Die, Rüstzeitoptimierung, Rüstzeitverkürzung, Schnellrüsten, Rüstzeit, Rüstzeit berechnen, internes und externes Rüsten, inneres und äußeres Rüsten, SMED Schritte, SMED Beispiel, SMED Lean Management, Shigeo Shingo, OTED, Rüstcheckliste, Rüstwagen, Rüstzeit Formel, EPEI, Losgröße reduzieren, optimale Losgröße Rüstkosten, Andler-Formel, Rüstzeit OEE, Lockout/Tagout beim Rüsten, Erstteilfreigabe, Rüstkennzahlen |
| Suchintention | Informational und praktisch (Definition, Schritte, Beispiele, Vorlagen) mit nachgeordneter kommerzieller Absicht (Schulung, Software, Schnellspanntechnik). Zielgruppe: Werksleitung, KVP- und Fertigungsingenieure, Meister und Schichtführer, Einrichter und Instandhaltungsleitung, Studierende der Ingenieurwissenschaften |
| Wortzahl | 14.498 Wörter (`wc -w` von H1 bis Fazit inkl. Tabellen, Glossar und FAQ, 26.11.2026; englische Fassung: 15.158) |
| Sprachversion | Deutsch (`de-DE`). hreflang-Paar: `de-DE` https://www.m365.fm/learn/smed-ruestzeitreduzierung/ <-> `en-US` https://www.m365.fm/en/learn/smed-changeover-reduction/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus. Bis dahin sind Meta-Title, Nebenkeywords und Überschriften ein Arbeitsstand.

# SMED: Rüstzeit reduzieren mit Single Minute Exchange of Die, Schritt für Schritt

*Stand: November 2026 · Lesezeit: etwa 45 Minuten (Schnelleinstieg: Kurzantwort, Kasten "Das Wichtigste in Kürze", die acht Schritte und der Abschnitt mit den Vorlagen)*

> **Kurzantwort:** SMED (Single Minute Exchange of Die) ist eine Methode, um eine Maschine oder Linie in möglichst kurzer Zeit von einem Produkt auf das nächste umzurüsten, mit dem Ziel von unter zehn Minuten, also einer "einstelligen" Minutenzahl. Die Grundidee stammt von Shigeo Shingo: die Rüstarbeit, die nur bei stehender Maschine möglich ist (internes Rüsten), von der Arbeit trennen, die bei laufender Maschine erledigt werden kann (externes Rüsten), so viel internes Rüsten wie möglich in externes umwandeln und dann alles Verbleibende straffen [1][6].

> **Das Wichtigste in Kürze**
> - Die Rüstzeit reicht vom letzten Gutteil des alten Auftrags bis zum ersten Gutteil des neuen Auftrags bei normaler Geschwindigkeit. Anlauf und Einstellen zählen zur Rüstzeit [2][21].
> - SMED folgt einer festen Reihenfolge: beobachten, internes und externes Rüsten trennen, internes in externes umwandeln, internes straffen, externes straffen, standardisieren, wiederholen [5].
> - Die meisten frühen Gewinne kommen aus der Organisation (Bereitstellung, Checklisten, Rüstwagen, Parallelarbeit), nicht aus teurer Hardware [19][20].
> - Eine kürzere Rüstzeit zahlt sich erst dann voll aus, wenn die gewonnene Zeit genutzt wird: kleinere Lose, häufigeres Rüsten und ein kürzerer EPEI oder mehr Kapazität an einem Engpass. Das vor Projektbeginn entscheiden.
> - Losgröße und Bestand skalieren mit der Rüstzeit. In der klassischen Losgrößenformel halbiert eine Senkung der Rüstkosten um 75 Prozent die wirtschaftliche Losgröße.
> - Jeder interne Rüstschritt findet an einer stillstehenden Anlage statt. In den USA gilt Rüsten nach dem Lockout/Tagout-Standard der OSHA als "Servicing" (Wartung), sofern keine eng gefasste Ausnahme greift [8][9].
> - Rüstzeitgewinne verpuffen ohne Standardarbeit, Audits und eine Rüstkennzahl am Shopfloor-Board. Die Forschung kritisiert an der SMED-Praxis, dass sie die Anlagengestaltung zu wenig nutzt und die Ergebnisse schlecht hält [12][13].
> - Gute Kennzahlen: durchschnittliche Rüstzeit und ihre Streuung, Anteil der Rüstvorgänge innerhalb des Standards, Anlaufausschuss, Rüstvorgänge pro Woche, EPEI und Reichweite des Bestands in Tagen.

## Inhaltsverzeichnis

1. [Was ist SMED? Definition und Grundidee](#was-ist-smed-definition-und-grundidee)
2. [Warum die Rüstzeit zählt: Losgröße, Bestand, Flexibilität und OEE](#warum-die-rüstzeit-zählt-losgröße-bestand-flexibilität-und-oee)
3. [Geschichte: von Taylor und Ford zu Shingo und Toyota](#geschichte-von-taylor-und-ford-zu-shingo-und-toyota)
4. [Rüstzeit richtig messen](#rüstzeit-richtig-messen)
5. [Die SMED-Methode in 8 Schritten](#die-smed-methode-in-8-schritten)
6. [Shingos acht Techniken mit Beispielen](#shingos-acht-techniken-mit-beispielen)
7. [Rüsttechniken nach Maschinentyp](#rüsttechniken-nach-maschinentyp)
8. [SMED-Beispiel: ein vollständiges Projekt an einer Spritzgießmaschine](#smed-beispiel-ein-vollständiges-projekt-an-einer-spritzgießmaschine)
9. [Von kürzeren Rüstzeiten zu kleineren Losen: EPEI und Losgröße](#von-kürzeren-rüstzeiten-zu-kleineren-losen-epei-und-losgröße)
10. [Arbeitssicherheit: Rüsten, Lockout/Tagout und Ergonomie](#arbeitssicherheit-rüsten-lockouttagout-und-ergonomie)
11. [Qualität: Erstteilfreigabe, Fehlervermeidung und Line Clearance in regulierten Branchen](#qualität-erstteilfreigabe-fehlervermeidung-und-line-clearance-in-regulierten-branchen)
12. [Menschen und Rollen: wer beim Rüsten was tut](#menschen-und-rollen-wer-beim-rüsten-was-tut)
13. [SMED-Vorlagen und Checklisten](#smed-vorlagen-und-checklisten)
14. [Einführungsfahrplan: vom Pilot zum werksweiten Rüstsystem](#einführungsfahrplan-vom-pilot-zum-werksweiten-rüstsystem)
15. [Rüstkennzahlen: Fortschritt messen](#rüstkennzahlen-fortschritt-messen)
16. [Wirtschaftlichkeit: Kosten, ROI und Bestandsbewertung](#wirtschaftlichkeit-kosten-roi-und-bestandsbewertung)
17. [SMED und andere Lean-Werkzeuge](#smed-und-andere-lean-werkzeuge)
18. [Dokumentierte SMED-Beispiele](#dokumentierte-smed-beispiele)
19. [Typische Fehler bei SMED](#typische-fehler-bei-smed)
20. [Grenzen und Kritik an SMED](#grenzen-und-kritik-an-smed)
21. [SMED digital: Daten, Video, MES und Planung](#smed-digital-daten-video-mes-und-planung)
22. [SMED-Glossar](#smed-glossar)
23. [FAQ: SMED und Rüstzeit](#faq-smed-und-rüstzeit)
24. [Fazit und erste Schritte](#fazit-und-erste-schritte)

## Was ist SMED? Definition und Grundidee

Das Lean Enterprise Institute (LEI) definiert [SMED](https://www.m365.fm/entity/smed/) als Vorgehen, um Produktionsanlagen in möglichst kurzer Zeit von einer Teilenummer auf eine andere umzurüsten [1]. "Single Minute" bedeutet nicht eine Minute, sondern eine einstellige Minutenzahl, also unter zehn [1]. Der Begriff "Die" (Werkzeug, Stanzwerkzeug) kommt von den Pressen, an denen die Methode zuerst angewendet wurde, aber SMED gilt für jeden Rüstvorgang: Spritzgießwerkzeuge, Vorrichtungen, Schneidwerkzeuge, Druckplatten, Formatteile an einer Verpackungslinie, Rezepturen an einer Abfüllmaschine.

Ein [Rüstvorgang](https://www.m365.fm/entity/setup-time/) (englisch Changeover oder Setup) ist das Umstellen einer Maschine oder einer verketteten Gruppe von Maschinen, etwa einer Zelle oder einer Montagelinie, von einem Produkt auf ein anderes [2]. Das LEI misst die Rüstzeit ab dem Moment, in dem die letzte Einheit des abgeschlossenen Auftrags den Prozess verlässt, bis die erste brauchbare Einheit des nächsten Auftrags herauskommt [2]. Diese Grenze ist wichtig; wir kommen im Abschnitt zur Messung darauf zurück.

### Internes und externes Rüsten

Shingos zentrale Erkenntnis war, jeden Rüstvorgang in zwei Arten von Arbeit zu zerlegen [1]:

| Art | Definition | Beispiele |
|---|---|---|
| **Internes Rüsten (inneres Rüsten)** | Arbeit, die nur bei stehender Maschine möglich ist | Altes Werkzeug lösen und ausbauen, neues einbauen, Formatteile innerhalb der Schutzeinrichtung wechseln, Einstellen am Erstteil |
| **Externes Rüsten (äußeres Rüsten)** | Arbeit, die erledigt werden kann, während die Maschine noch den vorherigen Auftrag fertigt oder schon den nächsten | Neues Werkzeug, Hilfsmittel und Material holen; ein Werkzeug vorwärmen; das neue Werkzeug auf Schäden prüfen; das alte Werkzeug einlagern; Papierkram |

Bei einem nicht optimierten Rüstvorgang passiert fast alles bei stehender Maschine: Der Einrichter stoppt die Maschine und sucht dann das Werkzeug, den Kran, den richtigen Schlüssel und die Zeichnung. SMED verlagert das "Suchen" und "Holen" aus der Stillstandszeit heraus und nimmt sich dann die Arbeit vor, die wirklich eine stehende Maschine braucht.

### SMED, Schnellrüsten und Rüstzeitreduzierung: die Begriffe

Die Begriffe überschneiden sich und werden in der Praxis synonym verwendet:

- **SMED (Single Minute Exchange of Die):** Shingos Name für die Methode und ihr Ziel einer einstelligen Minutenzahl [1][6].
- **Schnellrüsten (Quick Changeover, QCO):** der in US-Werken übliche Begriff für dieselbe Praxis, wie ihn etwa die Zentren des NIST MEP verwenden [18].
- **Rüstzeitreduzierung / Rüstzeitoptimierung (Setup Reduction):** ein allgemeiner Oberbegriff, der SMED plus technische Änderungen an den Anlagen umfasst.
- **OTED (One-Touch Exchange of Die):** ein strengeres Ziel, ein Rüstvorgang in unter 100 Sekunden [5].
- **Rüstzeitverkürzung (Changeover Time Reduction):** das Ergebnis. SMED ist dafür die verbreitetste Methode, aber nicht der einzige Hebel; auch Produktgestaltung, Anlagengestaltung und Planung tragen bei [13][15].

### Die Grundidee in einem Satz

Die Maschine für nichts anhalten, was auch während des Laufs erledigt werden könnte, und alles, was während des Stillstands geschehen muss, so einfach machen, dass es kein Suchen, kein Einstellen und keine Probeteile braucht.

In der Praxis trennt der SMED-Ansatz Rüstaufgaben, für die die Maschine stehen muss, von denen, die bei laufender Maschine erledigt werden können, verschiebt so viel Arbeit wie möglich in die zweite Gruppe und verkürzt dann das Verbleibende. Damit ist SMED eine Methode der kontinuierlichen Verbesserung für den Rüstprozess und eines der Standardwerkzeuge des Lean Managements.

### Vorteile von SMED

Wettbewerbsseiten zählen Vorteile mit Prozentwerten auf, die selten eine Quelle haben. Die folgenden Vorteile sind die Wirkmechanismen; wie groß sie jeweils sind, hängt vom Ausgangszustand ab.

1. **Kapazität:** Jede Minute, die aus dem internen Rüsten verschwindet, bringt eine Minute Maschinenzeit zurück. Am Engpass ist das Ausbringung, die das ganze Werk gewinnt.
2. **Kleinere Lose und weniger Bestand:** Wenn ein Rüstvorgang billig ist, kann jedes Produkt öfter in kleineren Mengen gefertigt werden. Das LEI merkt an, dass der EPEx-Wert einer Maschine (every product every interval, jedes Produkt in jedem Intervall) direkt von ihren Rüstzeiten abhängt [3].
3. **Kürzere Durchlaufzeiten und bessere Liefertreue:** Weniger Ware in Arbeit bedeutet kürzere Warteschlangen; kleine Lose erlauben es, innerhalb von Tagen statt Wochen auf Nachfrageänderungen zu reagieren.
4. **Qualität:** Standardisierte Rüstvorgänge mit festen Einstellungen verringern Versuch und Irrtum, Anlaufausschuss und Fehler beim Erstteil. Weniger Teile pro Los bedeuten außerdem weniger gefährdete Teile, wenn ein Fehler entdeckt wird.
5. **Arbeitssicherheit und Ergonomie:** Ein gut gestalteter Rüstvorgang beseitigt ungünstiges Heben, das Hineingreifen in Werkzeuge und Hektik, vorausgesetzt, die Sicherheit wird eingeplant statt umgangen (siehe Abschnitt zur Arbeitssicherheit).

## Warum die Rüstzeit zählt: Losgröße, Bestand, Flexibilität und OEE

Lange Rüstzeiten führen Werke in eine vorhersehbare Falle. Kostet ein Rüstvorgang zwei Stunden, will ihn niemand oft durchführen, also fertigt das Werk große Lose. Große Lose erzeugen Bestand, lange Durchlaufzeiten und die Notwendigkeit, die Kundennachfrage weiter im Voraus zu prognostizieren. Prognosen liegen umso öfter daneben, je weiter sie reichen, also baut das Werk noch mehr Sicherheitsbestand auf. Der Rüstvorgang wird zum versteckten Grund für die Hälfte des Bestands im Gebäude.

### Die Losgrößenfalle in Zahlen

**Rechenbeispiel (veranschaulichend):** Eine Presse läuft 16 Stunden am Tag (960 Minuten). Jeder Rüstvorgang dauert 90 Minuten. Die Presse fertigt 8 Teilenummern.

- Rüstet die Presse zweimal am Tag um, verliert sie 180 Minuten, also 18,8 Prozent ihrer Zeit (180 / 960). Alle 8 Teilenummern zu fertigen, dauert dann 4 Tage; jedes Teil wird also etwa alle 4 Tage gefertigt, und das Werk muss für jedes Teil rund 4 Tage Bestand vorhalten, plus Sicherheitsbestand.
- Um jedes Teil jeden Tag zu fertigen, bräuchte die Presse 8 Rüstvorgänge am Tag: 8 × 90 = 720 Minuten, 75 Prozent ihrer Zeit. Das ist nicht möglich, wenn die Teile mehr als 240 Minuten Laufzeit brauchen.
- Sinkt die Rüstzeit auf 15 Minuten, kosten 8 Rüstvorgänge 120 Minuten, 12,5 Prozent des Tages. Jedes Teil kann jeden Tag gefertigt werden, und der Losbestand (Cycle Stock) sinkt von etwa 4 Tagen auf etwa 1 Tag.

Das ist der Grund, warum Toyota in die Rüstzeitreduzierung investierte, lange bevor sie in Mode kam: Ohne schnelles Rüsten funktioniert Just-in-Time-Produktion mit kleinen Losen nicht.

### Rüstzeit in der OEE

Die Gesamtanlageneffektivität (Overall Equipment Effectiveness, OEE) multipliziert Verfügbarkeit, Leistung und Qualität [4]. Das LEI zählt Einstellvorgänge zu den sechs großen Verlusten, auf die die OEE zielt [4]; in den meisten OEE-Schemata werden geplante Rüstvorgänge als Verfügbarkeitsverlust gebucht und Anlaufausschuss nach dem Rüsten als Qualitätsverlust. Das hat zwei Folgen:

- Eine Rüstzeitreduzierung zeigt sich nur dann in der OEE-Verfügbarkeit, wenn die gewonnene Zeit zum Produzieren genutzt wird. Fährt das Werk einfach weniger Stunden, bewegt sich die OEE-Verfügbarkeit nicht.
- Nutzt das Werk die gewonnene Zeit für häufigeres Rüsten (um die Losgrößen zu senken), kann die OEE-Verfügbarkeit gleich bleiben oder sogar sinken, während sich Bestand und Durchlaufzeit verbessern. Das ist ein gutes Ergebnis. SMED am gewählten Ziel messen, nicht allein an der OEE.

Die genauen OEE-Definitionen behandelt der Leitfaden zu [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/), die Instandhaltungsseite der OEE der geplante Leitfaden zu [TPM und OEE](https://www.m365.fm/learn/tpm-oee/).

### Drei Wege, die gewonnene Zeit zu nutzen

| Option | Wann sie passt | Was gemessen wird |
|---|---|---|
| **Mehr Kapazität** (gleiche Zahl an Rüstvorgängen) | Maschine ist ein Engpass, Nachfrage übersteigt die Kapazität | Ausbringung pro Woche, Überstunden, OEE-Verfügbarkeit |
| **Kleinere Lose** (mehr Rüstvorgänge, gleiche gesamte Rüstzeit) | Maschine hat freie Kapazität, hoher Bestand, lange Durchlaufzeiten, viele Varianten | EPEI, Losgröße, Reichweite des Bestands in Tagen, Durchlaufzeit |
| **Mischung** (etwas Kapazität, etwas kleinere Lose) | Die meisten realen Werke | Beide Kennzahlengruppen, mit einer ausdrücklichen Aufteilung, die mit der Planung vereinbart ist |

Der häufigste Grund, warum SMED-Projekte enttäuschen, ist, dass niemand diese Entscheidung getroffen hat. Das Rüsten wird schneller, die Planung behält die alten Losgrößen bei, und die gewonnene Zeit verschwindet in längeren Leerlaufphasen. Darauf kommen wir im Abschnitt zu den Fehlern zurück.

## Geschichte: von Taylor und Ford zu Shingo und Toyota

Rüstzeitreduzierung ist älter als ihr Name. Frederick Winslow Taylor analysierte die nicht wertschöpfenden Teile des Rüstens in *Shop Management* (1911), Frank Gilbreth beschrieb die Verkürzung der Rüstzeit in *Motion Study* (1911), und in den Werken von Henry Ford wurde die Rüstzeitreduzierung in *Ford Methods and Ford Shops* (1915) dokumentiert [5]. Keiner von ihnen machte daraus eine strukturierte, weit verbreitete Methode [5]. Den größten Teil des 20. Jahrhunderts war die Standardantwort auf lange Rüstzeiten mathematisch: die wirtschaftliche Losgröße (Economic Order Quantity), die die Rüstkosten als gegeben hinnimmt und das "richtige" große Los berechnet [5].

### Toyota und der schnelle Werkzeugwechsel

Bei Toyota dauerten Werkzeugwechsel in den frühen Nachkriegsjahren Berichten zufolge zwei bis acht Stunden; der Wikipedia-Artikel markiert diese Zahl als belegbedürftig [5]. Taiichi Ohno wurde 1945 Leiter der mechanischen Werkstätten bei Toyota und besichtigte 1955 Danly-Pressen in den USA; Toyota kaufte später mehrere davon für sein Werk Motomachi [5]. Toyotas internes Programm für den schnellen Werkzeugwechsel ("Quick Die Change") nutzte die ECRS-Fragen (eliminieren, kombinieren, umordnen, vereinfachen), die aus dem US-Programm Training Within Industry des Zweiten Weltkriegs stammen [5][33]. Nach derselben Quelle sanken Toyotas Rüstzeiten bis in die 1960er-Jahre von Stunden auf 15 Minuten und bis in die 1970er-Jahre auf 3 Minuten [5].

### Shigeo Shingo

Shigeo Shingo (1909–1990) war Wirtschaftsingenieur und ab 1945 Berater bei der Japan Management Association [6]. Er sammelte 1950 bei Toyo Kogyo (heute Mazda) und 1957 bei Mitsubishi Heavy Industries in Hiroshima Erfahrungen mit Verbesserungen und arbeitete ab 1969 bei Toyota daran, die Werkzeugwechselzeit an Pressen zu verkürzen; dort sanken Werkzeugwechsel von ein bis zwei Stunden, manchmal einem halben Tag, auf wenige Minuten [6]. Das LEI verortet seine zentralen Erkenntnisse, die Trennung von internem und externem Rüsten und die Umwandlung interner in externe Arbeit, in den 1950er- und 1960er-Jahren [1].

Shingo veröffentlichte die Methode 1985 auf Englisch als *A Revolution in Manufacturing: The SMED System* (Productivity Press) [6][7]. Das Buch berichtet, dass die Rüstzeiten in seinen Fällen zwischen 1975 und 1985 im Durchschnitt auf etwa 2,5 Prozent des Ausgangswerts sanken, also um den Faktor 40 [5]. Diese Zahl ist Shingos eigene Zusammenfassung seiner Beratungsfälle, kein unabhängiger Vergleichswert.

1988 schuf die Business School der Utah State University ihm zu Ehren den Shingo Prize; heute vergibt ihn das Shingo Institute an der Jon M. Huntsman School of Business [6][30].

### SMED in den USA

US-Hersteller lernten SMED über die Übersetzung von Shingos Büchern in den 1980er-Jahren kennen, über die Verbreitung von Just-in-Time und den Erfolg der japanischen Autohersteller. Heute ist SMED ein Standardmodul in Lean-Schulungen, einschließlich der Angebote zum Schnellrüsten der Zentren des NIST Manufacturing Extension Partnership (MEP) [18][31]. Den übergreifenden Lean-Kontext behandelt der Leitfaden zum [Lean Management](https://www.m365.fm/learn/lean-management/).

## Rüstzeit richtig messen

Die meisten Rüstdaten in Werken sind falsch, und zwar nicht, weil jemand lügt. Sie sind falsch, weil niemand vereinbart hat, wo ein Rüstvorgang beginnt und endet. Das ERP-System bucht "Rüsten" oft als Zeit zwischen zwei Auftragsrückmeldungen; Werker erfassen oft die Zeit, in der "die Maschine zerlegt war"; Ingenieure messen oft nur den Werkzeugwechsel. Alle drei Werte sind kürzer als der tatsächliche Verlust.

### Die Definition: vom letzten Gutteil bis zum ersten Gutteil

Die Grenze des LEI verwenden: vom letzten Gutteil des alten Auftrags bis zum ersten Gutteil des neuen Auftrags [2]. Zwei Präzisierungen machen sie wasserdicht:

1. **Bei normaler Geschwindigkeit.** Der neue Auftrag "läuft" erst, wenn er Gutteile in Standardleistung produziert. Leanproduction.com definiert das Ende als erstes Gutteil bei voller Geschwindigkeit [19]. Läuft die Linie nach dem Neustart 20 Minuten mit halber Geschwindigkeit, gehören diese 20 Minuten zum Rüstverlust.
2. **Einschließlich Auslauf.** Wenn der alte Auftrag vor dem Stopp langsamer wird (zum Beispiel weil die Linie leergefahren wird und nur teilweise läuft), zählt auch das. Manche Werke nennen das die "3 Ups": Clean-up, Set-up und Start-up (Aufräumen, Rüsten, Anlaufen) [24].

### Die drei Phasen eines Rüstvorgangs

| Phase | Was passiert | Typische versteckte Verluste |
|---|---|---|
| **Auslauf / Aufräumen** | Letzte Teile des alten Auftrags, Linie leerfahren, Material entfernen, reinigen | Linie läuft mit reduzierter Geschwindigkeit; Werker gehen, um den nächsten Auftrag zu holen |
| **Rüsten (Wechsel)** | Werkzeuge, Formen, Formatteile aus- und einbauen; Einstellungen ändern | Suchen, Warten auf Kran oder Stapler, fehlende Teile, Schrauben |
| **Anlauf / Hochfahren** | Erste Teile, Messen, Einstellen, Freigabe, Hochfahren auf volle Geschwindigkeit | Einstellen nach Versuch und Irrtum, Warten auf die Qualitätsfreigabe, Ausschuss |

Shingos eigene Aufteilung eines konventionellen Rüstvorgangs, wie Wikipedia sie wiedergibt, ordnet etwa 30 Prozent der Vorbereitung und der Prüfung von Material und Werkzeugen zu, etwa 5 Prozent dem Ein- und Ausbau, etwa 15 Prozent dem Zentrieren, Bemaßen und Einstellen der Bedingungen und etwa 50 Prozent den Probeläufen und Einstellungen [5]. Ein frei verfügbares Ingenieurlehrbuch zur Lean-Fertigung zeichnet für das Stanzen von Blech ein ähnliches Bild: Etwa 20 bis 50 Prozent der Rüstzeit entfallen auf das Einstellen [36]. Die praktische Lehre: Der Wechsel selbst ist der kleine Teil. Die großen Teile sind Vorbereitung und Anlauf.

### Formeln zur Rüstzeit

**Rüstzeit (pro Rüstvorgang):**
Rüstzeit = Zeitpunkt des ersten Gutteils bei Standardgeschwindigkeit − Zeitpunkt des letzten Gutteils des vorherigen Auftrags

**Durchschnittliche Rüstzeit:**
Durchschnittliche Rüstzeit = Summe aller Rüstzeiten / Anzahl der Rüstvorgänge

**Rüstanteil an der verfügbaren Zeit:**
Rüstanteil = gesamte Rüstzeit / geplante Produktionszeit × 100 %

**Interner Anteil:**
Interner Anteil = interne Rüstzeit / gesamter Rüstarbeitsinhalt × 100 %

**Kosten eines Rüstvorgangs (einfaches Modell):**
Kosten pro Rüstvorgang = entgangener Deckungsbeitrag (nur wenn die Maschine ein Engpass oder ausverkauft ist) + Lohnkosten des Rüstteams + Anlaufausschuss + Verbrauchsmaterial

MachineMetrics, ein Anbieter von Maschinenüberwachung, verwendet eine vergleichbare Aufteilung: entgangene Lohnkosten = Stillstandsstunden × Anzahl der Beschäftigten × Lohnkosten pro Stunde, und entgangener Produktwert = Stückpreis × Standardleistung × Stillstandsstunden [21]. Vorsicht beim zweiten Term: Er zählt nur dann als echter Verlust, wenn die entgangene Ausbringung verkauft worden wäre. An einer Maschine mit freier Kapazität bestehen die Kosten eines Rüstvorgangs vor allem aus Lohn und Ausschuss, und der Nutzen von SMED liegt in kleineren Losen, nicht in zurückgewonnener Ausbringung.

**Rechenbeispiel (veranschaulichend):** Ein CNC-Bearbeitungszentrum arbeitet in zwei 8-Stunden-Schichten an 5 Tagen pro Woche, mit 60 Minuten geplanten Pausen pro Tag: geplante Produktionszeit = (16 − 1) × 60 × 5 = 4.500 Minuten pro Woche. In der letzten Woche gab es 9 Rüstvorgänge mit 52, 68, 47, 95, 61, 58, 73, 49 und 87 Minuten.

- Summe = 590 Minuten; Durchschnitt = 590 / 9 = 65,6 Minuten.
- Rüstanteil = 590 / 4.500 = 13,1 Prozent.
- Streuung: kürzester Vorgang 47, längster 95 Minuten, eine Spannweite von 48 Minuten. Eine so große Spannweite bedeutet meist, dass es keinen Standard gibt; die langen Vorgänge sind die mit fehlenden Werkzeugen oder Programmen.
- Kosten: Rüstteam aus 1 Einrichter zu einem Vollkostensatz von 48 USD pro Stunde (veranschaulichend) = 590 / 60 × 48 USD = 472 USD Lohnkosten pro Woche. Ist die Maschine ein Engpass mit einem Deckungsbeitrag von 180 USD pro Stunde, beträgt der entgangene Deckungsbeitrag 590 / 60 × 180 USD = 1.770 USD pro Woche, bei 52 Wochen also etwa 92.000 USD im Jahr. Diese Zahl rechtfertigt ein Projekt.

### So werden die Daten erhoben

1. **Zuerst Video.** Einen vollständigen Rüstvorgang vom letzten bis zum ersten Gutteil filmen, mit sichtbarer Uhr. Eine Kamera auf die Maschine, idealerweise eine zweite, die dem Einrichter folgt. Vorher das Team um Erlaubnis bitten und den Zweck erklären: Es geht im Video um den Prozess, nicht um die Menschen. Das Michigan-Zentrum des NIST MEP nutzte im Projekt bei Brighton NC Machine Video, ein Spaghetti-Diagramm und ein Rüstanalyse-Diagramm [17].
2. **Spaghetti-Diagramm.** Den Laufweg des Einrichters auf einem Layout nachzeichnen. Rüstvorgänge enthalten oft Laufwege von Hunderten oder Tausenden Fuß (grob 30 m bis mehrere Hundert Meter); im Beispiel von Brighton waren es vor der Verbesserung ca. 2.780 m (9.121 Fuß) pro Rüstvorgang [17].
3. **Elementliste.** Das Video in Elemente von einigen Sekunden bis einigen Minuten zerlegen: "zur Werkzeugausgabe gehen, 3:20", "8 Spannschrauben lösen, 4:10". Ein typischer Rüstvorgang zerfällt laut leanproduction.com in etwa 30 bis 50 Elemente [19].
4. **Zwei Wochen Ausgangsbasis.** Mindestens zwei Wochen lang Start- und Endzeiten aller Rüstvorgänge erfassen, bevor etwas verändert wird, damit Durchschnitt und Streuung bekannt sind [19]. Vorne warnt, dass Teams ihr Verhalten ändern, wenn sie wissen, dass sie beobachtet werden (Hawthorne-Effekt); der erste gefilmte Rüstvorgang kann daher schneller sein als üblich [20].

Die Vorlage für die Elementliste steht im [Abschnitt mit den Vorlagen](#smed-vorlagen-und-checklisten).

## Die SMED-Methode in 8 Schritten

Shingo beschrieb vier konzeptionelle Stufen, oft SMED-Stufen genannt: In der Vorstufe sind internes und externes Rüsten vermischt; Stufe 1 trennt sie; Stufe 2 wandelt internes in externes Rüsten um; Stufe 3 strafft alle Aspekte des Rüstens [5]. Praxisquellen entfalten diese Stufen in sieben Grundschritte: beobachten, trennen, umwandeln, internes straffen, externes straffen, dokumentieren, wiederholen [5]. Die acht Schritte unten ergänzen den Schritt, den die meisten Leitfäden auslassen: die Vorbereitung des Projekts, einschließlich Arbeitssicherheit und der Entscheidung, wie die gewonnene Zeit genutzt wird.

| Schritt | Stufe nach Shingo | Ergebnis |
|---|---|---|
| 0. Vorbereiten: Maschine, Team, Ziel und Nutzung der gewonnenen Zeit festlegen | (Vorstufe) | Projektauftrag, Ausgangsdaten, Sicherheitsbewertung |
| 1. Den aktuellen Rüstvorgang aufnehmen | Vorstufe | Video, Elementliste mit Zeiten, Spaghetti-Diagramm |
| 2. Interne und externe Elemente trennen | Stufe 1 | Jedes Element mit I oder E markiert; Checkliste und Bereitstellungsplan |
| 3. Internes in externes Rüsten umwandeln | Stufe 2 | Maßnahmenliste: Vorbereitung, Funktionsstandardisierung, Zwischenvorrichtungen |
| 4. Interne Elemente straffen | Stufe 3 | Schnellspanner, entfallene Einstellungen, Parallelarbeit |
| 5. Externe Elemente straffen | Stufe 3 | Rüstwagen, Schattenbretter, Lagerung nahe der Maschine |
| 6. Standardisieren und schulen | (Nacharbeit) | Standard-Rüstblatt, Schulungsnachweise |
| 7. Halten und wiederholen | (Nacharbeit) | Kennzahl am Board, Audits, nächster Zyklus |

### Schritt 0: Das Projekt vorbereiten

**Die Pilotmaschine wählen.** Gute Piloten haben einen Rüstvorgang von etwa 30 bis 90 Minuten, der mehrmals pro Woche vorkommt, ein kooperatives Team und einen sichtbaren betrieblichen Schmerz (Engpass, hoher Bestand, verspätete Aufträge). Vorne schlägt einen Pilot-Rüstvorgang von 30 bis 60 Minuten vor [20]; leanproduction.com empfiehlt SMED, wenn Rüstvorgänge mindestens 20 Prozent der verlorenen produktiven Zeit ausmachen, andernfalls zuerst TPM [19]. Beides sind Faustregeln von Anbietern, keine Standards, aber sie zeigen in die richtige Richtung: nicht mit einem 12-stündigen und nicht mit einem 5-minütigen Rüstvorgang beginnen.

**Das Team bilden.** Werker und Einrichter, die den Rüstvorgang täglich durchführen, ein Instandhaltungstechniker, ein Fertigungsingenieur, ein Qualitätstechniker für die Erstteilfreigabe und eine Fachkraft für Arbeitssicherheit. Ein Meister ist Sponsor des Teams. Vier bis sieben Personen sind eine praktikable Größe.

**Ziel und Nutzung der gewonnenen Zeit vereinbaren.** Die Ausgangsbasis (Durchschnitt und Spannweite), das Ziel (zum Beispiel 50 Prozent Reduzierung im ersten Zyklus, wie Vorne vorschlägt [20]) und das, was die Planung mit der Zeit tun wird, schriftlich festhalten: Kapazität, kleinere Lose oder eine Aufteilung.

**Sicherheitsbewertung.** Die Energiequellen auflisten (elektrisch, hydraulisch, pneumatisch, Schwerkraft, thermisch) und das aktuelle Verfahren zur Energiesicherung. Vor dem Workshop festlegen, welche Schritte unter Lockout/Tagout fallen. Niemals "schnellere" Ideen akzeptieren, die das Freischalten der Energie auslassen (siehe Abschnitt zur Arbeitssicherheit).

### Schritt 1: Den aktuellen Rüstvorgang aufnehmen

Filmen, die Elementliste erstellen, das Spaghetti-Diagramm zeichnen. Die Elemente in der Reihenfolge notieren, in der sie stattfanden, mit Startzeit, Dauer und ausführender Person. Offensichtliche Verschwendung sofort markieren: Suchen, Laufen, Warten auf den Kran, Probeläufe.

Fragen, die zu jedem Element gestellt werden (auch die klassischen Fragen im Stil der "5 Warum" funktionieren):

- Warum wird das überhaupt gemacht? (Lässt es sich eliminieren?)
- Warum jetzt, während die Maschine steht? (Kann es extern sein?)
- Warum auf diese Weise? (Geht es einfacher?)
- Warum durch diese Person? (Können zwei Personen parallel arbeiten, oder kann der Werker es übernehmen?)

### Schritt 2: Interne und externe Elemente trennen

Jedes Element als I (braucht eine stehende Maschine) oder E (könnte bei laufender Maschine erledigt werden) markieren. Die Methode noch nicht ändern; nur aufhören, externe Arbeit während des Stillstands zu erledigen. Dieser Schritt ist vor allem organisatorisch:

- **Checkliste vor dem Rüsten:** Alles, was der nächste Auftrag braucht (Werkzeug, Hilfsmittel, Vorrichtungen, Einsätze, Material, Programm, Zeichnung, Messmittel, Verpackung), ist aufgelistet und geprüft, bevor die Maschine stoppt.
- **Funktionsprüfungen:** Das neue Werkzeug wird vor dem Einbau auf Schäden und Vollständigkeit geprüft, nicht erst nach dem ersten Schlechtteil.
- **Transport:** Das neue Werkzeug steht vor dem Stopp an der Maschine bereit; das alte Werkzeug geht nach dem Neustart zurück ins Lager.

Leanproduction.com merkt an, dass das Verlagern von Elementen ins externe Rüsten die Rüstzeit nahezu halbieren kann [19]. Das deckt sich mit der Praxiserfahrung, hängt aber ganz davon ab, wie viel heute gesucht und geholt wird.

### Schritt 3: Internes in externes Rüsten umwandeln

Jetzt jedes verbleibende I-Element erneut betrachten und fragen, was sich ändern müsste, damit es extern wird. Shingos Techniken dafür sind das Vorbereiten der Betriebsbedingungen im Voraus, das Standardisieren von Funktionen und der Einsatz von Zwischenvorrichtungen [5]:

- **Vorwärmen** von Spritzgieß- und Pressenwerkzeugen außerhalb der Maschine, damit die ersten Schüsse sie nicht auf Temperatur bringen müssen.
- **Voreinstellen** von Werkzeugen in einem Voreinstellgerät oder auf einer zweiten Vorrichtung, während die Maschine läuft.
- **Standardisieren** der Maße, auf die es für die Maschine ankommt (Spannhöhe, Positionierpunkte, Anschlusspunkte), damit ein neues Werkzeug kein Einstellen braucht.
- **Zwischenvorrichtungen:** das nächste Werkstück oder Werkzeug außerhalb der Maschine auf einer Standardpalette oder Grundplatte montieren und dann die ganze Palette tauschen.

### Schritt 4: Interne Elemente straffen

Was intern bleibt, wird schnell und einfach gemacht:

- **Funktionsspanner** statt Schrauben: Vierteldrehverschlüsse, Exzenterspanner, U-Schlitze, sodass eine Schraube nur eine halbe Umdrehung braucht, hydraulisches oder magnetisches Spannen.
- **Einstellungen eliminieren:** feste Anschläge, Passstifte, Skalen und Markierungen, Einstellungen als Rezepturen gespeichert. Das Einstellen ist in Shingos Aufteilung die größte einzelne Kategorie der Rüstzeit [5].
- **Parallele Arbeitsgänge:** Zwei Personen auf gegenüberliegenden Seiten der Maschine, jede mit festgelegter Reihenfolge, können die Durchlaufzeit des Rüstens um mehr als die Hälfte senken, weil das Herumlaufen um die Maschine entfällt. Sie brauchen ein klares Signalsystem, und unter Lockout/Tagout bringt jede Person ihr eigenes Schloss an.
- **Ein Werkzeug, eine Größe:** Schraubengrößen standardisieren, damit ein einziges Werkzeug überall passt.

### Schritt 5: Externe Elemente straffen

Externe Arbeit hält die Maschine nicht an, bindet aber Menschen und kann den Beginn des Rüstvorgangs verzögern. Sie wird gestrafft mit Rüstwagen, die nach Reihenfolge organisiert sind, mit Schattenbrettern, mit Lagerung von Werkzeugen und Hilfsmitteln am Einsatzort nach [5S](https://www.m365.fm/learn/5s-methode-visuelles-management/) und mit klaren visuellen Signalen ("nächster Auftrag bereit").

### Schritt 6: Standardisieren und schulen

Die neue Methode als Standard-Rüstblatt festhalten: Reihenfolge der Elemente, wer was tut, Schlüsselpunkte (Sicherheit, Qualität), Zeiten und benötigte Hilfsmittel. Das LEI beschreibt [Standardarbeit](https://www.m365.fm/entity/standard-work/) als das Festlegen präziser Abläufe für die Arbeit jedes Werkers [26]. Alle schulen, die den Rüstvorgang durchführen, nicht nur das Pilotteam; die TWI-Methode Job Instruction, die eine Tätigkeit in wichtige Schritte und Schlüsselpunkte zerlegt, ist ein praktisches Format [33]. Der Cluster zur [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) behandelt das Format im Detail.

### Schritt 7: Halten und wiederholen

Die Rüstzeit auf das Shopfloor-Board bringen, Abweichungen täglich besprechen und den Standard regelmäßig auditieren. SMED ist ein Kreislauf kontinuierlicher Verbesserung, keine einmalige Aktion. Den nächsten Zyklus starten: Die Zusammenfassung der SMED-Praxis bei Wikipedia besagt, dass mehrere Durchläufe nötig sein können, um unter zehn Minuten zu kommen [5]. Ein zweiter Zyklus nimmt sich typischerweise die hardwareabhängigen Elemente vor, die der erste Zyklus zurückgestellt hat.

## Shingos acht Techniken mit Beispielen

Shingo fasste seinen Ansatz in acht Techniken zusammen [5]. Die Tabelle erklärt jede in einfachen Worten und gibt Beispiele aus verschiedenen Branchen.

| Nr. | Technik | Was sie bedeutet | Beispiele |
|---|---|---|---|
| 1 | Internes und externes Rüsten trennen | Die Maschine nicht für Arbeit anhalten, die bei laufender Maschine erledigt werden kann | Checkliste, Bereitstellung von Werkzeug und Material vor dem Stopp |
| 2 | Internes Rüsten in externes umwandeln | Die Methode so ändern, dass Arbeit aus dem Stillstand herauswandert | Werkzeuge vorwärmen, Werkzeuge voreinstellen, Formatteile vormontieren |
| 3 | Funktion standardisieren, nicht Form | Nur die Merkmale standardisieren, mit denen die Maschine interagiert, nicht das ganze Werkzeug | Gleiche Spannhöhe und Kante an jedem Werkzeug über Distanzblöcke; gleiche Kupplung an jeder Spritzgießform |
| 4 | Funktionsspanner nutzen oder Befestigungen eliminieren | Mit einer Bewegung befestigen oder gar nicht | Vierteldrehschrauben, Exzenterhebel, Schlüssellochbohrungen, Hydraulikspanner, Magnetspannplatten |
| 5 | Zwischenvorrichtungen nutzen | Auf einem Standardträger außerhalb der Maschine vorbereiten und den Träger tauschen | Nullpunktspannpaletten an Bearbeitungszentren, Grundplatten für Pressenwerkzeuge |
| 6 | Parallele Arbeitsgänge einführen | Mehr als eine Person arbeitet gleichzeitig nach festgelegter Reihenfolge | Zwei Einrichter auf beiden Seiten einer Presse, der Werker bereitet Material vor, während der Einrichter das Werkzeug wechselt |
| 7 | Einstellungen eliminieren | Versuch und Irrtum durch feste Positionen und gespeicherte Einstellungen ersetzen | Passstifte, Anschläge, Skalen, Rezeptur-Download, digitale Positionsanzeigen |
| 8 | Mechanisierung | Kraftunterstützung dort einsetzen, wo sie wirklich hilft, und zwar nach den anderen sieben | Werkzeugwagen mit Rollen, Werkzeughebevorrichtungen, motorische Verstellachsen |

Zwei Anmerkungen zur Liste. Erstens kommt die Mechanisierung mit Absicht zuletzt. Hardware, die vor den organisatorischen Schritten gekauft wird, automatisiert oft Verschwendung. Zweitens ist "Funktion standardisieren, nicht Form" die am wenigsten genutzte Technik. Ein Werk muss nicht 200 Werkzeuge umbauen; oft genügt ein Satz Distanzblöcke oder Adapterplatten, der alle Werkzeuge auf dieselbe Spannhöhe und Anlagekante bringt.

## Rüsttechniken nach Maschinentyp

Die Prinzipien sind überall gleich, aber die großen Hebel unterscheiden sich je nach Prozess. Die Tabellen unten sind eine Checkliste aus der Praxis, kein quellengestützter Vergleichswert.

### Pressen

| Hebel | Beispiel |
|---|---|
| Einheitliche Werkzeughöhe und Positionierung | Parallelstücke oder Distanzblöcke bringen alle Werkzeuge auf dieselbe Einbauhöhe; Passstifte oder ein hinterer Anschlag zentrieren das Werkzeug |
| Werkzeugtransport | Werkzeugwagen oder Schiebetische an der Presse bereitgestellt; Rollen- oder Kugelleisten auf dem Pressentisch |
| Spannen | Hydraulische oder mechanische Schnellspanner; U-Schlitze und eine einzige Schraubengröße, falls Schrauben bleiben |
| Einstellungen | Einbauhöhe, Gewichtsausgleichsdruck und Vorschubeinstellungen je Werkzeug gespeichert; markierte Skalen |
| Sicherheit | Sicherheitsklötze, wann immer das Werkzeug in der Presse eingestellt oder repariert wird, wie es die OSHA in den USA verlangt [10]; Verfahren zum Werkzeugeinbau nach 29 CFR 1910.217(d)(9) |

### Spritzgießen

| Hebel | Beispiel |
|---|---|
| Vorwärmen | Werkzeug vor dem Wechsel an einem separaten Temperiergerät vorgewärmt |
| Anschlüsse | Mehrfachkupplungen für Wasser- und Heißkanalanschlüsse, farbcodiert |
| Material | Nächstes Material getrocknet und bereit; Spülmittel und Spülverfahren standardisiert |
| Spannen | Schnellwechselsysteme für Werkzeuge (magnetische oder hydraulische Spannplatten), standardisierte Aufspannplattendicke |
| Einstellungen | Prozessparameter aus einem Datensatz geladen, statt aus dem Gedächtnis eingestellt |

### CNC-Zerspanung

| Hebel | Beispiel |
|---|---|
| Werkzeugvoreinstellung | Werkzeuge offline in einem Voreinstellgerät vermessen, Korrekturwerte an die Steuerung übertragen |
| Spanntechnik | Nullpunktspannsysteme, standardisierte Paletten, eigene Vorrichtungen an der Maschine gelagert |
| Programme | Erprobte Programme freigegeben und vorab geladen; kein Editieren an der Maschine |
| Erstteil | Messtaster in der Maschine ersetzen das manuelle Messen zum Setzen der Nullpunkte |
| Werkzeugfamilien | Standard-Werkzeugbibliothek, sodass die meisten Aufträge wenige Werkzeugwechsel brauchen |

### Verpackungs- und Abfülllinien

| Hebel | Beispiel |
|---|---|
| Formatteile | Farbcodierte Formatteile je Produktgröße, auf einem Wagen in Rüstreihenfolge gelagert |
| Einstellungen | Feste Anschläge und nummerierte Skalen statt freier Verstellung; Servoachsen mit gespeicherten Positionen |
| Reinigung | Reinigungsreihenfolge standardisiert; zuerst trocken reinigen; ausgebaute Teile parallel reinigen |
| Etiketten und Packmittel | Checkliste für die Line Clearance (Linienräumung); Etiketten, Kartons und Verschlüsse vor dem Stopp bereitgestellt |
| Anlauf | Festgelegte Erstteilprüfungen; Verfahren zum Hochfahren der Geschwindigkeit |

### Reinigungsintensive und regulierte Rüstvorgänge (Lebensmittel, Pharma, Chemie)

In Werken für Lebensmittel, Getränke, Pharma und Chemie ist der eigentliche "Wechsel" oft klein, Reinigung und Verifizierung dagegen groß. Das SMED-Denken gilt trotzdem: Reinigungsmittel, Werkzeuge und Dokumente vorher bereitstellen; ausgebaute Teile offline reinigen, während die Maschine mit einem zweiten Satz wieder montiert wird; Produkte so reihen, dass Vollreinigungen möglichst selten nötig sind (hell vor dunkel, allergenfrei vor allergenhaltig). Der Unterschied: Manche Schritte sind vorgeschrieben und lassen sich nicht durch Weglassen verkürzen:

- Arzneimittelhersteller in den USA müssen Verpackungs- und Etikettiereinrichtungen unmittelbar vor der Nutzung prüfen, um sicherzustellen, dass alle Arzneimittel und ungeeigneten Verpackungs- und Etikettiermaterialien aus vorherigen Vorgängen entfernt wurden, und die Ergebnisse in den Chargenprotokollen dokumentieren (21 CFR 211.130(e)) [11].
- Lebensmittelbetriebe in den USA, die unter die Preventive Controls Rule fallen, müssen Allergenkontrollen haben, die Verfahren zum Schutz von Lebensmitteln vor Allergenkreuzkontakt bei Lagerung, Handhabung und Verwendung umfassen (21 CFR 117.135(c)(2)) [37].

Hier verkürzt SMED die Arbeit rund um die vorgeschriebenen Schritte und macht die vorgeschriebenen Schritte schneller und verlässlicher, zum Beispiel mit einer Checkliste für die Line Clearance und einer festen Reihenfolge. Es lässt sie nie weg.

### Montagelinien und Zellen

Rüstvorgänge in der Montage drehen sich vor allem um Material und Information: andere Kits, andere Arbeitsanweisungen, andere Vorrichtungen an einigen Stationen. Hebel sind das Kommissionieren (Kitting) der nächsten Variante vor dem Rüsten, Vorrichtungen, die mehrere Varianten abdecken, digitale Arbeitsanweisungen, die mit dem Auftrag umschalten, und "fliegende" Rüstvorgänge, bei denen jede Station umstellt, sobald die erste Einheit der neuen Variante ankommt, sodass die Linie nie als Ganzes stillsteht.

## SMED-Beispiel: ein vollständiges Projekt an einer Spritzgießmaschine

Das folgende Beispiel ist veranschaulichend. Die Zahlen sind für einen mittelgroßen Spritzgießbetrieb realistisch, beschreiben aber kein reales Werk. Sie zeigen, wie die Schritte zusammenpassen und wie sich der Effekt berechnen lässt.

**Ausgangslage.** Eine Spritzgießmaschine mit 300 Tonnen Schließkraft fertigt mit 6 Werkzeugen eine Gehäusefamilie. Sie arbeitet 3 Schichten zu 8 Stunden mit 30 Minuten Pause pro Schicht an 5 Tagen pro Woche: geplante Produktionszeit = 3 × 7,5 × 60 × 5 = 6.750 Minuten pro Woche. Sie wechselt das Werkzeug 5-mal pro Woche. Ausgangsbasis über zwei Wochen: durchschnittliche Rüstzeit 96 Minuten, Spannweite 78 bis 131 Minuten. Die Maschine ist kein Engpass; das Problem sind 11 Tage Fertigwarenbestand und häufige Eilaufträge.

**Mit der Planung vereinbartes Ziel.** Die durchschnittliche Rüstzeit im ersten Zyklus um mindestens 50 Prozent senken und die Zeit für mehr Rüstvorgänge nutzen, sodass jedes Werkzeug mindestens alle 3 Tage läuft statt alle 6.

### Schritt 1: Elementliste (vorher)

| Nr. | Element | Zeit (min) | I/E heute | Könnte sein |
|---|---|---|---|---|
| 1 | Letzte Schüsse, Trichter leeren, Maschine stoppen | 6 | I | I (teilweise E: Trichter vor Auftragsende leeren) |
| 2 | Zum Werkzeuglager gehen, nächstes Werkzeug suchen, Kran holen | 14 | I | E |
| 3 | Wasser- und Heißkanalleitungen trennen (12 Einzelkupplungen) | 8 | I | I, straffen |
| 4 | Werkzeug lösen (8 Schrauben), herausheben | 9 | I | I, straffen |
| 5 | Neues Werkzeug einheben, nach Augenmaß ausrichten, spannen (8 Schrauben) | 13 | I | I, straffen |
| 6 | Wasser- und Heißkanalleitungen anschließen, für jeden Anschluss den richtigen Schlauch suchen | 10 | I | I, straffen |
| 7 | Material suchen, trocknen | 7 | I | E |
| 8 | Werkzeug auf Temperatur bringen | 12 | I | E (vorwärmen) |
| 9 | Parameter nach Einrichteblatt einstellen, nachjustieren | 9 | I | I, Einstellen eliminieren |
| 10 | Probeschüsse, nachjustieren, auf Qualitätsfreigabe warten | 8 | I | I, straffen |
| **Summe intern (Durchlaufzeit)** | | **96** | | |

Die beiden externen Kandidaten (Elemente 2 und 7) und das Vorwärmen (Element 8) ergeben zusammen 33 Minuten Maschinenstillstand, für die keine stehende Maschine nötig ist.

### Schritte 2 und 3: trennen und umwandeln

- Die Elemente 2 und 7 werden extern, mit einer Checkliste vor dem Rüsten, die 45 Minuten vor dem geplanten Auftragsende ausgelöst wird: Werkzeug, Kranzeitfenster, Material (getrocknet), Schläuche, Dokumente, Erstteil-Messmittel. Einsparung: 21 Minuten.
- Element 8 wird extern, mit einer Vorwärmstation, an der das nächste Werkzeug auf Temperatur gebracht wird, während das alte noch läuft. Einsparung: etwa 10 Minuten (2 Minuten bleiben zur Stabilisierung in der Maschine).
- Element 1: Der Trichter wird in den letzten Minuten des Auftrags geleert statt nach dem Stopp. Einsparung: 3 Minuten.

Ergebnis nach den ersten beiden Schritten: 96 − 21 − 10 − 3 = **62 Minuten**, erreicht vor allem mit einer Checkliste, einem Vorwärmgerät und Disziplin.

### Schritt 4: internes Rüsten straffen

| Nr. | Maßnahme | Vorher (min) | Nachher (min) |
|---|---|---|---|
| 3 + 6 | Mehrfachkupplungsplatten für Wasser und Heißkanal, farbcodiert | 18 | 4 |
| 4 + 5 | Standardisierter Zentrierring und Spannschlitze, Schnellspanner; zweite Person für Parallelarbeit | 22 | 9 |
| 9 | Prozessparameter je Werkzeug gespeichert und aus der Steuerung geladen | 9 | 2 |
| 10 | Erstteilprüfung mit eigenem Messmittel an der Maschine, Qualitätstechniker vorab informiert | 8 | 5 |
| 1 | Auslauf mit bereits geleertem Trichter | 3 | 3 |
| 8 | Stabilisierung nach dem Vorwärmen | 2 | 2 |
| **Summe** | | **62** | **25** |

Die Durchlaufzeit beträgt jetzt 25 Minuten. Zu beachten: Parallelarbeit durch zwei Personen verkürzt die Durchlaufzeit, nicht aber die Arbeitszeit. Der Arbeitsinhalt der Elemente 4 und 5 liegt weiterhin bei etwa 18 Personenminuten.

### Schritt 6: standardisieren

Die neue Reihenfolge wird als Standard-Rüstblatt mit zwei Spalten (Einrichter A, Einrichter B) festgehalten, in allen drei Schichten geschult und einen Monat lang wöchentlich auditiert. Nach vier Wochen liegt der Durchschnitt bei 27 Minuten mit einer Spannweite von 23 bis 34 Minuten.

### Der Effekt

| Kennzahl | Vorher | Nachher |
|---|---|---|
| Durchschnittliche Rüstzeit | 96 min | 27 min (−72 %) |
| Spannweite der Rüstzeit | 78–131 min | 23–34 min |
| Rüstvorgänge pro Woche | 5 | 10 |
| Gesamte Rüstzeit pro Woche | 480 min | 270 min |
| Rüstanteil an der geplanten Zeit | 7,1 % | 4,0 % |
| Intervall, in dem jedes Werkzeug läuft (EPEI) | etwa 6 Tage | etwa 3 Tage |
| Fertigwarenbestand (Losbestand) | etwa 11 Tage | etwa 6 Tage (Ziel) |

Die Maschine rüstet jetzt doppelt so oft um und verbringt trotzdem 210 Minuten weniger pro Woche mit Rüsten. Der Losbestand sinkt ungefähr proportional zum Intervall. Die Investition: eine Vorwärmstation, sechs Sätze Mehrfachkupplungen, standardisierte Spanntechnik und zwei Tage Zeit des Teams. Die Wirtschaftlichkeit eines solchen Projekts wird im [Abschnitt zur Wirtschaftlichkeit](#wirtschaftlichkeit-kosten-roi-und-bestandsbewertung) berechnet.

## Von kürzeren Rüstzeiten zu kleineren Losen: EPEI und Losgröße

SMED schafft Potenzial; die Planung macht daraus Ergebnisse. Zwei Werkzeuge verbinden die Rüstzeit mit Losgröße und Bestand: der EPEI und die klassische Losgrößenformel.

### Was EPEI bedeutet

EPEI steht für "every part every interval" (jedes Teil in jedem Intervall; das Lexikon des LEI verwendet heute den Begriff EPEx, "every product every interval"). Der Wert beschreibt, wie oft eine Maschine oder ein Prozess alle seine Teilenummern durchläuft: Wird eine Maschine so umgerüstet, dass sie jede Teilenummer alle drei Tage fertigt, beträgt ihr EPEx drei Tage [3]. Das LEI merkt an, dass der EPEx von den Rüstzeiten und der Zahl der Teilenummern abhängt; lange Rüstzeiten und viele Teilenummern treiben ihn nach oben, sofern die Rüstzeit nicht gesenkt wird [3]. Ein kürzerer EPEI bedeutet kleinere Lose und weniger Bestand. In der [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/) ist der EPEI ein Standardeintrag im Datenkasten eines Prozesses mit Rüstvorgängen [35].

### So wird der EPEI berechnet

Eine verbreitete Formel aus der Praxis (abgeleitet aus der Zeitbilanz eines Prozesses; keine Formel des LEI):

EPEI = gesamte Rüstzeit für einen Durchlauf durch alle Teile / (verfügbare Zeit pro Tag − benötigte Laufzeit pro Tag)

Die Idee: Jeden Tag braucht die Maschine eine feste Laufzeit, um die Nachfrage zu decken. Die verbleibende Zeit kann für Rüstvorgänge verwendet werden. Je mehr Rüstzeit ein vollständiger Durchlauf durch alle Teile braucht, desto mehr Tage dauert der Durchlauf.

**Rechenbeispiel (veranschaulichend):** Eine Maschine hat 900 Minuten verfügbare Zeit pro Tag. Sie fertigt 4 Teile mit folgender Tagesnachfrage und folgenden Zykluszeiten:

| Teil | Tagesnachfrage (Stück) | Zykluszeit (min/Stück) | Laufzeit pro Tag (min) | Rüstzeit (min) |
|---|---|---|---|---|
| A | 400 | 0,8 | 320 | 40 |
| B | 300 | 0,8 | 240 | 40 |
| C | 150 | 1,0 | 150 | 60 |
| D | 50 | 1,2 | 60 | 60 |
| **Summe** | | | **770** | **200** |

- Verbleibende Zeit für Rüstvorgänge pro Tag: 900 − 770 = 130 Minuten.
- Ein vollständiger Durchlauf durch alle vier Teile braucht 200 Minuten Rüstzeit.
- EPEI = 200 / 130 = 1,54 Tage, in der Praxis aufgerundet auf **2 Tage**: Jedes Teil wird alle 2 Tage gefertigt.
- Losgrößen bei einem EPEI von 2 Tagen = 2 Tagesbedarfe: A 800, B 600, C 300, D 100 Stück.

**Jetzt SMED anwenden.** Die Rüstzeiten sinken auf 15 Minuten für A und B und auf 20 Minuten für C und D: Summe = 70 Minuten.

- EPEI = 70 / 130 = 0,54 Tage, aufgerundet auf **1 Tag**: jedes Teil jeden Tag.
- Die Losgrößen halbieren sich: A 400, B 300, C 150, D 50 Stück.
- Der durchschnittliche Losbestand (etwa ein halbes Los bei gleichmäßiger Nachfrage) sinkt von etwa 1 Tagesbedarf auf etwa einen halben Tag.
- Freie Zeit: Bei einem EPEI von 1 Tag brauchen die Rüstvorgänge 70 der 130 freien Minuten; 60 Minuten bleiben als Puffer für Störungen und Nachfragespitzen.

Zwei praktische Hinweise. Erstens nie mit null freier Zeit planen; reale Maschinen haben Störungen, und ein EPEI, der jede freie Minute verbraucht, bricht am ersten schlechten Tag zusammen. Zweitens kann der EPEI für Schnelldreher und Langsamdreher unterschiedlich sein: A und B jeden Tag, C und D jeden zweiten Tag ist oft ein besserer Kompromiss als ein einheitliches Intervall. Hier trifft SMED auf [Heijunka](https://www.m365.fm/entity/heijunka/), die Nivellierung der Produktion nach Menge und Mix [25].

### Die Losgrößenformel und warum die Rüstkosten zählen

Die wirtschaftliche Losgröße (Economic Order Quantity, EOQ), 1913 von Ford W. Harris entwickelt [39] und jahrzehntelang der Standardansatz zur Losgrößenbestimmung [5], wägt Rüstkosten gegen Lagerhaltungskosten ab (im deutschsprachigen Raum meist als Andler-Formel bezeichnet):

EOQ = √(2 × D × S / H)

mit D = Jahresbedarf, S = Kosten pro Rüstvorgang (oder Bestellung), H = jährliche Lagerhaltungskosten pro Stück. Für die Produktion mit endlicher Produktionsrate ergänzt die wirtschaftliche Produktionsmenge (Economic Production Quantity, EPQ) einen Korrekturfaktor √(1 / (1 − d/p)), wobei d die Bedarfsrate und p die Produktionsrate ist. Die Einzelheiten beider Formeln, einschließlich ihrer Annahmen, behandelt der Cluster zur [Losgröße](https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/).

Der entscheidende Punkt für SMED ist die Quadratwurzel. Sinken die Rüstkosten S auf ein Viertel, halbiert sich die wirtschaftliche Losgröße (√0,25 = 0,5). Sinkt S auf ein Neuntel, sinkt die Losgröße auf ein Drittel.

**Rechenbeispiel (veranschaulichend):** D = 24.000 Stück pro Jahr, H = 2,40 USD pro Stück und Jahr (zum Beispiel 20 Prozent Lagerhaltungskostensatz auf ein Teil zu 12 USD), S = 160 USD pro Rüstvorgang (zwei Stunden eines Zwei-Personen-Teams zu je 40 USD pro Stunde Vollkosten).

- EOQ = √(2 × 24.000 × 160 / 2,40) = √3.200.000 ≈ **1.789 Stück**, etwa 13 Lose pro Jahr (24.000 / 1.789 ≈ 13,4).
- Nach SMED dauert der Rüstvorgang mit demselben Team 30 Minuten: S = 40 USD.
- EOQ = √(2 × 24.000 × 40 / 2,40) = √800.000 ≈ **894 Stück**, etwa 27 Lose pro Jahr (24.000 / 894 ≈ 26,8).
- Der durchschnittliche Losbestand (EOQ / 2) sinkt von etwa 894 auf etwa 447 Stück; bei 12 USD pro Stück werden so für dieses eine Teil etwa 5.400 USD Bestand frei.

Die Formel hat bekannte Grenzen: Sie setzt konstante Nachfrage, bekannte Kosten und keine Kapazitätsbeschränkung voraus, und die "Kosten pro Rüstvorgang" sind schwer zu bestimmen, wenn der Einrichter ohnehin bezahlt wird. Lean-Praktiker nutzen sie daher als Richtungsargument ("geringere Rüstkosten rechtfertigen kleinere Lose"), nicht als Planungsregel. Ein Pull-System mit [Kanban](https://www.m365.fm/learn/kanban-pull-prinzip/) und eine EPEI-basierte Planung ersetzen sie meist [34].

### Kapazitätsprüfung: Sind mehr Rüstvorgänge drin?

Bevor die Planung die Losgrößen senkt, die Kapazitätsbilanz prüfen:

Benötigte Zeit pro Woche = Σ (Bedarf × Zykluszeit) + Anzahl der Rüstvorgänge × durchschnittliche Rüstzeit

Sie muss deutlich unter der verfügbaren Zeit bleiben. An einem Engpass ist eine kürzere Rüstzeit zunächst ein Kapazitätsgewinn; ob er für kleinere Lose verwendet wird, ist eine bewusste Entscheidung, die der Leitfaden zur [Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/) ausführlich behandelt. An einem Nicht-Engpass gibt es per Definition freie Kapazität, und es ist meist klüger, die gewonnene Rüstzeit in häufigere Rüstvorgänge zu stecken.

## Arbeitssicherheit: Rüsten, Lockout/Tagout und Ergonomie

Keine der zwölf bestplatzierten Seiten, die für diesen Leitfaden analysiert wurden, behandelt Lockout/Tagout, obwohl fast jedes interne Rüstelement im Gefahrenbereich einer Maschine stattfindet. In den USA ist das keine Option, sondern Pflicht.

### Rüsten gilt nach dem Lockout/Tagout-Standard der OSHA als Wartung

Der US-Standard der OSHA zur Beherrschung gefährlicher Energien, 29 CFR 1910.147, gilt für Wartung und Instandhaltung von Maschinen und Anlagen, bei denen unerwartetes Einschalten, Anlaufen oder Freisetzen gespeicherter Energie Beschäftigte verletzen könnte [8]. Seine Definition von "Servicing and/or Maintenance" schließt das Einrichten und Einstellen ausdrücklich ein, und "Setting up" ist definiert als jede Arbeit, die eine Maschine oder Anlage auf ihren normalen Produktionsbetrieb vorbereitet [8]. Ein Rüstvorgang ist nach dem Standard also grundsätzlich eine Wartungstätigkeit.

Der Standard verlangt ein dokumentiertes Verfahren zur Energiesicherung, Unterweisung und eine feste Abfolge: Vorbereitung der Abschaltung, Abschalten der Maschine, Trennen der Energiequellen, Anbringen der Lockout- oder Tagout-Vorrichtungen, Ableiten gespeicherter Energie und Prüfen der Trennung [8]. Arbeitgeber müssen jedes Verfahren zur Energiesicherung mindestens einmal im Jahr überprüfen [8].

### Die Ausnahme für geringfügige Wartung: eng gefasst, kein Schlupfloch

Eine Anmerkung zum Geltungsbereich nimmt geringfügige Werkzeugwechsel und Einstellungen sowie andere geringfügige Wartungstätigkeiten während des normalen Produktionsbetriebs aus, wenn sie routinemäßig, wiederkehrend und fester Bestandteil der Nutzung der Anlage für die Produktion sind, und nur dann, wenn die Arbeit mit alternativen Maßnahmen ausgeführt wird, die wirksamen Schutz bieten [8]. Das Lockout/Tagout-eTool der OSHA erläutert, dass solche Tätigkeiten dann unter die Anforderungen an Schutzeinrichtungen nach Subpart O fallen, und nennt Beispiele für alternative Maßnahmen: speziell konstruierte Werkzeuge, Fernbedienungen, verriegelte trennende Schutzeinrichtungen, lokale Trennschalter und Steuerschalter unter alleiniger Kontrolle der Person, die die Arbeit ausführt [9]. Ist auch nur ein Teil der Ausnahme nicht erfüllt, gilt Lockout/Tagout [9].

Was das für SMED bedeutet:

- Ein vollständiger Werkzeug- oder Formwechsel ist typischerweise kein "geringfügiger" Werkzeugwechsel im normalen Produktionsbetrieb; er wird mit Lockout/Tagout geplant. Ob eine bestimmte Tätigkeit unter die Ausnahme fällt, ist eine rechtliche und sicherheitstechnische Beurteilung der Fachkraft für Arbeitssicherheit, nicht des SMED-Teams.
- SMED muss Lockout schneller und einfacher machen, niemals überspringen. Beispiele: Freischaltpunkte an der Maschine gruppiert und beschriftet, eine Lockout-Station im Rüstwagen, Gruppen-Lockout-Boxen für Parallelarbeit, bei der jede Person ihr eigenes Schloss anbringt, Prüfschritte im Standard-Rüstblatt.
- Ein Rüstzeitstandard, der nur durch Überspringen der Energietrennung einzuhalten ist, ist ein falscher Standard. Die Zeit für Lockout gehört ins Ziel.

### Mechanische Pressen

Für mechanische Pressen verlangt die OSHA ein Verfahren zum Werkzeugeinbau, das die Einhaltung der Regeln zur Absicherung der Wirkstelle sicherstellt, federbelastete Drehstangen, wo die Presse dafür ausgelegt ist, Werkzeuganschläge an geneigten Pressen, Sicherheitsklötze, wann immer Werkzeuge in der Presse eingestellt oder repariert werden, und Hilfsmittel wie Pinsel oder Druckpistolen, damit Bediener und Einrichter zum Schmieren nicht in die Wirkstelle greifen [10]. Diese Punkte gehören in jeden Rüststandard für Pressen.

### Ergonomie

Rüstvorgänge bringen schwere, ungünstige Handhabung mit sich: Werkzeuge, Formatteile und Vorrichtungen heben, gebückt innerhalb von Schutzeinrichtungen arbeiten, nach Schrauben greifen. Die OSHA beschreibt Ergonomie als Anpassung der Arbeit an den Menschen, um Muskel-Skelett-Erkrankungen zu verringern [32]. SMED und Ergonomie zeigen meist in dieselbe Richtung: Werkzeugwagen, Rollenbahnen, Hebehilfen, Vorrichtungen auf Hüfthöhe und weniger Schrauben sind schneller und schonender für den Körper. Das Risiko liegt in Zeitvorgaben: Wird ein Team gedrängt, die Uhr zu schlagen, werden Hebetechnik und Heben zu zweit übersprungen. Zeitziele müssen so gesetzt sein, dass sie in einem dauerhaft durchhaltbaren Tempo erreichbar sind.

### Sicherheitscheckliste für SMED-Projekte

| Prüfpunkt | Erledigt |
|---|---|
| Energiequellen der Maschine aufgelistet (elektrisch, hydraulisch, pneumatisch, Schwerkraft, thermisch, chemisch) | ☐ |
| Aktuelles Verfahren zur Energiesicherung geprüft; Rüstschritte unter Lockout/Tagout identifiziert | ☐ |
| Fachkraft für Arbeitssicherheit hat jede Behauptung geprüft, ein Schritt falle unter die Ausnahme für geringfügige Wartung | ☐ |
| Lockout- und Prüfschritte mit Zeitangabe im Standard-Rüstblatt festgehalten | ☐ |
| Parallelarbeit: Jede Person bringt ihr eigenes Schloss an; Kommunikationssignale festgelegt | ☐ |
| Pressen: Verfahren zum Werkzeugeinbau, Sicherheitsklötze, Drehstangen, Werkzeuganschläge geprüft [10] | ☐ |
| Schweres Heben identifiziert; Hebehilfen oder Heben zu zweit festgelegt | ☐ |
| Heiße Oberflächen (vorgewärmte Formen, beheizte Werkzeuge) identifiziert; Handschuhe und Handhabung festgelegt | ☐ |
| Neue Schnellspanntechnik auf Spannkraft und ausfallsicheres Verhalten geprüft | ☐ |
| Erster Rüstvorgang nach dem neuen Standard von einem Meister beobachtet | ☐ |

## Qualität: Erstteilfreigabe, Fehlervermeidung und Line Clearance in regulierten Branchen

Anlauf und Einstellen sind bei vielen Rüstvorgängen der größte Teil [5]. Qualitätsprobleme nach dem Rüsten haben meist dieselben Ursachen: falsches Werkzeug oder Programm, Einstellungen aus dem Gedächtnis, fehlende Erstteilprüfungen oder eine Erstteilfreigabe, die auf einen Prüfer wartet, der anderswo beschäftigt ist.

### Erstteilfreigabe ohne Warten

- **Die Prüfung im Standard-Rüstblatt festlegen:** welche Merkmale, welches Messmittel, welcher Stichprobenumfang.
- **Das Messmittel an die Maschine bringen** und den Werker im Messen schulen; ein Qualitätstechniker gibt nur dort frei, wo der Produktionslenkungsplan (Control Plan) es verlangt.
- **Die Qualität vorab informieren**, über die Checkliste vor dem Rüsten, damit der Prüfer da ist, wenn das erste Teil herauskommt.
- **Das Erstteilergebnis mit dem Auftrag erfassen**, damit es rückverfolgbar ist.

### Fehlervermeidung beim Rüsten

[Poka-Yoke](https://www.m365.fm/learn/lean-management/poka-yoke/)-Vorrichtungen verhindern oder erkennen Fehler [28]. Beim Rüsten sind typische Beispiele:

| Fehler | Poka Yoke |
|---|---|
| Falsches Werkzeug oder falsche Form für den Auftrag | Codiertes Werkzeug (RFID, Barcode oder mechanische Codierung), das die Maschinensteuerung gegen den Auftrag prüft |
| Falsches Programm oder falsche Rezeptur | Rezeptur wird automatisch über die Auftragsnummer aufgerufen |
| Schläuche an falschen Anschlüssen | Mehrfachkupplungsplatten oder Kupplungen, die nur in einer Richtung passen, farbcodiert |
| Formatteil in falscher Lage montiert | Asymmetrische Passstifte |
| Alte Etiketten oder Materialien auf der Linie vergessen | Checkliste für die Line Clearance mit Abzeichnung; eigene Behälter für entferntes Material |

### Regulierte Branchen

In regulierten Werken ist der Rüstvorgang Teil des Qualitätssystems. In der US-Pharmaverpackung sind die Inspektion zur Line Clearance vor der Nutzung und ihre Dokumentation im Chargenprotokoll nach 21 CFR 211.130(e) vorgeschrieben [11]. Bei Lebensmitteln sind Allergen-Umstellungen Teil der Allergenkontrollen nach 21 CFR 117.135(c)(2) [37]. In Lieferketten der Automobilindustrie (IATF 16949) und der Luft- und Raumfahrt (AS9100) können Produktionslenkungspläne und kundenspezifische Anforderungen eine Einrichtverifizierung oder Erstteilverifizierung nach dem Rüsten verlangen; die eigenen Verträge und Lenkungspläne prüfen, statt eine allgemeine Regel anzunehmen. Der Leitfaden zur [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/) behandelt den Luftfahrtkontext. SMED-Projekte in diesen Umfeldern sollten die Qualitätsleitung vom ersten Tag an einbinden und jede Änderung an Reinigungs- oder Prüfschritten validieren, bevor sie angewendet wird.

### Statistische Sicht

Ein Rüstvorgang ist auch eine Quelle von Streuung. Unterscheiden sich Teile vom Beginn jedes Auftrags systematisch, macht eine Regelkarte, getrennt nach "erste 30 Minuten nach dem Rüsten" und "restlicher Auftrag", das sichtbar. Cakmakci nutzte in einer SMED-Studie aus der Automobilindustrie die Prozessfähigkeit (Cpk), um den Zusammenhang zwischen Rüstzeitreduzierung und Anlagengestaltung zu bewerten [16]. Der Leitfaden zu [Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) behandelt Fähigkeitsanalysen und Regelkarten.

## Menschen und Rollen: wer beim Rüsten was tut

SMED wird oft als technische Methode beschrieben. In der Praxis verändert es die Arbeit von Werkern und Einrichtern stärker als jedes andere Lean-Werkzeug, und deshalb steht und fällt es mit ihnen.

### Rollen

| Rolle | Im SMED-Projekt | Beim täglichen Rüsten |
|---|---|---|
| Werker | Teammitglied; kennt die Details, filmt und wird gefilmt | Erledigt die externe Vorbereitung, Teile der internen Arbeit, die Erstteilmessung |
| Einrichter / Werkzeugeinrichter | Kernmitglied des Teams; verantwortet die Methode | Erledigt den internen Wechsel, führt die Parallelarbeit |
| Instandhaltungstechniker | Baut und wartet Schnellwechseltechnik, Kupplungen, Spanner | Unterstützt komplexe Rüstvorgänge; hält Werkzeuge und Formen in gutem Zustand |
| Fertigungsingenieur | Moderiert, analysiert das Video, entwickelt technische Lösungen | Verantwortet den Standard; verbessert ihn |
| Qualitätstechniker | Legt Erstteilprüfungen und Fehlervermeidung fest | Gibt Erstteile frei, wo erforderlich |
| Meister | Sponsor; stellt Zeit für das Team frei | Plant Rüstvorgänge mit dem Produktionsplan; prüft die Einhaltung |
| Produktionsplaner | Vereinbart, wie die gewonnene Zeit genutzt wird; ändert Losgrößen | Reiht Aufträge so, dass der Rüstaufwand minimal wird |
| Fachkraft für Arbeitssicherheit | Prüft Energiesicherung und Ergonomie | Auditiert Lockout bei Rüstvorgängen |

### Was sich für Werker und Einrichter ändert

SMED verschiebt meist Arbeit: Werker übernehmen die externe Vorbereitung und Teile des internen Rüstens, und Einrichter verbringen weniger Zeit mit Suchen und mehr mit den technischen Schritten. Das ist eine Änderung des Arbeitsinhalts. In Werken mit Gewerkschaft sind Stellenbeschreibungen, Einstufungen und Lohngruppen oft im Tarifvertrag geregelt; die neue Aufteilung daher vor dem Start des neuen Standards mit der Gewerkschaft vereinbaren. In Werken ohne Gewerkschaft stellt sich dieselbe Frage informell: Wer wird geschult, wer ist verantwortlich, wenn ein Erstteil durchfällt, und werden die neuen Aufgaben anerkannt?

### Respekt vor den Menschen

Drei Regeln aus der Praxis machen den Unterschied zwischen einem SMED-Projekt, das der Shopfloor mitträgt, und einem, gegen das er sich wehrt:

1. **Den Prozess filmen, nicht die Person.** Den Zweck erklären, bevor gefilmt wird. Den Einrichter das Video zuerst kommentieren lassen; er oder sie weiß meist genau, wo die Verschwendung steckt. In Werken mit Gewerkschaft die Arbeitnehmervertreter früh informieren und vereinbaren, wie Videos gespeichert und genutzt werden.
2. **Gewonnene Zeit nicht in Personalabbau umwandeln.** Führt SMED zu Entlassungen, bekommt das nächste Verbesserungsprojekt keine Ideen mehr vom Shopfloor. Die Zeit für Kapazität, kleinere Lose oder Schulung nutzen.
3. **Ziele setzen, die sich sicher erreichen lassen.** Ein Rüststandard beschreibt eine gute Methode in normalem Tempo. Vergleiche mit dem Boxenstopp helfen, Parallelarbeit und Vorbereitung zu erklären, aber eine Boxencrew trainiert für einen Stopp unter Rennbedingungen; ein Einrichter macht denselben Rüstvorgang am Ende einer langen Schicht, viele Male im Jahr.

Vorne empfiehlt, mit "menschlichen" Verbesserungen zu beginnen, also mit Vorbereitung und Organisation, bevor technische Änderungen folgen [20]; leanproduction.com gibt dieselbe Empfehlung [19]. Diese Reihenfolge schafft auch Vertrauen: Das Team sieht schnelle Ergebnisse aus seinen eigenen Ideen, bevor Geld ausgegeben wird.

## SMED-Vorlagen und Checklisten

Die folgenden Vorlagen lassen sich in eine Tabellenkalkulation übernehmen oder als A3-Bogen (bzw. 11 × 17 Zoll) ausdrucken. Es sind Arbeitsformate aus der Praxis, kein Standard.

### Vorlage 1: Beobachtungsbogen für den Rüstvorgang (Elementliste)

| Nr. | Element (Verb + Objekt) | Start (mm:ss) | Dauer (min) | Person | I/E heute | Art der Verschwendung (Suchen, Laufen, Warten, Einstellen, Sonstiges) | Idee | Könnte I/E sein |
|---|---|---|---|---|---|---|---|---|
| 1 | Maschine stoppen, letztes Gutteil | 00:00 | | | I | | | |
| 2 | | | | | | | | |
| … | | | | | | | | |
| | **Summe intern** | | | | | | | |
| | **Summe extern** | | | | | | | |

Tipps: eine Zeile pro Element, Verben an den Anfang ("lösen", "gehen", "suchen"), Zeiten aus dem Video ablesen. Eine Spalte "Laufweg" ergänzen, wenn das Laufen ins Gewicht fällt.

### Vorlage 2: Arbeitsblatt zur Umwandlung von internem in externes Rüsten

| Internes Element | Warum muss die Maschine stehen? | Was müsste sich ändern, damit es extern wird? | Technik (vorbereiten, Funktion standardisieren, Zwischenvorrichtung) | Kosten (gering / mittel / hoch) | Verantwortlich | Termin |
|---|---|---|---|---|---|---|
| Werkzeug aufheizen | Werkzeug heizt nur in der Maschine auf | Separate Vorwärmstation | Betriebsbedingungen vorbereiten | Mittel | | |
| Werkzeug nach Augenmaß ausrichten | Kein Bezugspunkt | Passstift und hinterer Anschlag | Funktion standardisieren | Gering | | |
| | | | | | | |

### Vorlage 3: Checkliste vor dem Rüsten (externes Rüsten)

| Gegenstand für den nächsten Auftrag | Ort | Geprüft von | Uhrzeit | OK |
|---|---|---|---|---|
| Werkzeug / Form / Formatsatz Nr. … (geprüft, vollständig, sauber) | An der Maschine bereitgestellt, Position … | | | ☐ |
| Werkzeuge (Liste), Spanner, Ersatzschrauben | Rüstwagen | | | ☐ |
| Material / Komponenten (Menge, Charge, ggf. getrocknet) | | | | ☐ |
| Programm / Rezeptur freigegeben und geladen | Steuerung | | | ☐ |
| Zeichnung, Produktionslenkungsplan, Erstteil-Messmittel | Wagen | | | ☐ |
| Verpackung und Etiketten für den nächsten Auftrag | | | | ☐ |
| Kran / Stapler / zweite Person gebucht für Uhrzeit … | | | | ☐ |
| Qualitätstechniker informiert (falls Freigabe erforderlich) | | | | ☐ |
| Lockout-Vorrichtungen und Lockout-Verfahren griffbereit | Lockout-Station | | | ☐ |

Auslöser: ein fester Zeitpunkt vor Ende des laufenden Auftrags (zum Beispiel zu Beginn der letzten 45 Minuten), angezeigt an der Maschine oder im Produktionsplan.

### Vorlage 4: Standard-Rüstblatt (Version für zwei Personen)

| Schritt | Einrichter A | Zeit (min) | Einrichter B | Zeit (min) | Schlüsselpunkt (Sicherheit / Qualität) |
|---|---|---|---|---|---|
| 1 | Maschine stoppen, Schloss anbringen | 0–2 | Eigenes Schloss anbringen | 0–2 | Vor dem Eingreifen Energiefreiheit prüfen |
| 2 | Kupplungen trennen (Bedienseite) | 2–4 | Kupplungen trennen (Rückseite) | 2–4 | Heiße Oberflächen: Handschuhe |
| 3 | Altes Werkzeug lösen und herausheben | 4–8 | Kran führen, Werkzeug auf Wagen absetzen | 4–8 | Signal für Heben zu zweit |
| … | | | | | |
| n | Erstteilprüfung, Freigabe | | Altes Werkzeug ins Lager bringen | | Erstteilergebnis erfassen |
| | **Ziel-Durchlaufzeit** | | | | |

### Vorlage 5: Rüst-Audit (im ersten Monat wöchentlich, danach monatlich)

| Frage | Ja / Nein | Kommentar |
|---|---|---|
| Wurde die Checkliste vor dem Rüsten vor dem Stopp abgearbeitet? | | |
| Wurde die Standardreihenfolge eingehalten? | | |
| Wurden Lockout und Prüfung wie beschrieben durchgeführt? | | |
| Lagen alle Werkzeuge und Teile am Einsatzort (kein Suchen)? | | |
| Wurde die Erstteilprüfung wie festgelegt durchgeführt? | | |
| Wurde die Rüstzeit erfasst (letztes Gutteil bis erstes Gutteil)? | | |
| Abweichung vom Ziel, Ursache erfasst? | | |
| Verbesserungsidee aus dem Team aufgenommen? | | |

### Vorlage 6: SMED-Projektauftrag (eine Seite)

| Feld | Inhalt |
|---|---|
| Maschine / Linie | |
| Problem (mit Daten) | z. B. durchschnittliche Rüstzeit 96 min, Spannweite 78–131 min, 11 Tage Bestand |
| Ziel | z. B. −50 % im ersten Zyklus, jedes Werkzeug alle 3 Tage |
| Nutzung der gewonnenen Zeit (mit der Planung vereinbart) | Kapazität / kleinere Lose / Aufteilung |
| Team | Namen und Rollen |
| Sicherheitsbewertung durchgeführt von | |
| Zeitplan | Termine für Ausgangsbasis, Workshop, Umsetzung, Standardisierung |
| Budgetgrenze für Hardware | |
| Sponsor | |

## Einführungsfahrplan: vom Pilot zum werksweiten Rüstsystem

Der folgende Zeitplan ist eine Schätzung aus der Praxis für ein mittelgroßes Werk der Stückgutfertigung; die Zeitrahmen hängen von den Anlagen, den Lieferzeiten für Hardware und der Zeit ab, die das Team bekommt [unbelegt].

| Phase | Zeitrahmen | Aktivitäten | Ergebnis |
|---|---|---|---|
| 1. Vorbereiten | Wochen 1–3 | Pilotmaschine wählen, mindestens zwei Wochen Ausgangsdaten erheben [19], Projektauftrag, Sicherheitsbewertung, Nutzung der gewonnenen Zeit vereinbaren | Projektauftrag unterschrieben, Ausgangsbasis bekannt |
| 2. Pilot-Workshop | Woche 4 (3–5 Tage) | Rüstvorgang filmen und analysieren, trennen und umwandeln, schnelle Verbesserungen vor Ort, erster Versuch mit neuer Reihenfolge | Erster neuer Standard, Maßnahmenliste |
| 3. Umsetzen | Wochen 5–10 | Hardware (Kupplungen, Spanner, Wagen), Vorwärmen oder Voreinstellen, zweiter Versuch, Schulung aller Schichten | Neuer Standard geschult |
| 4. Stabilisieren | Wochen 11–16 | Tägliche Kennzahl am Board, wöchentliche Audits, Losgrößen und Planung anpassen | Stabile Zeit, Lose verkleinert |
| 5. Ausweiten | Monate 5–12 | Nächste 3–5 Maschinen, interne SMED-Coaches geschult, Rüststandard als Teil der Spezifikationen für neue Anlagen | Rüstsystem im ganzen Bereich |

### Die nächsten Maschinen auswählen

Kandidaten nach Wirkung und Aufwand reihen:

| Kriterium | Gewicht | Frage |
|---|---|---|
| Engpass | Hoch | Ist die Maschine der Engpass des Wertstroms? |
| Rüsthäufigkeit × Rüstdauer | Hoch | Wie viele Stunden pro Woche gehen durch Rüsten verloren? |
| Schmerz bei Bestand / Durchlaufzeit | Mittel | Treibt diese Maschine große Lose und hohen Bestand nachgelagert? |
| Streuung der Rüstzeit | Mittel | Ist die Spannweite groß (ein Zeichen fehlender Standards)? |
| Bereitschaft des Teams | Mittel | Ist die Mannschaft bereit, gibt es einen Meister als Sponsor? |
| Hardwareaufwand | Gering (negativ) | Ist eine größere Investition nötig, bevor Ergebnisse kommen? |

### Rüsten zur Konstruktionsanforderung machen

Das billigste SMED-Projekt ist das, das man nicht braucht. Rüstanforderungen gehören in die Spezifikationen für neue Anlagen, Werkzeuge und Formen: maximale Rüstzeit, standardisierte Spannhöhen und Kupplungen, gespeicherte Einstellungen, keine Einstellvorgänge. Braglia und Kollegen schlagen mit dem Quick Changeover Design (QCD) eine strukturierte Methode vor, die Maschinenbauern hilft, von Anfang an für schnelles Rüsten zu konstruieren [15]. Einkauf und Technik müssen das verantworten, nicht nur das Lean-Team.

## Rüstkennzahlen: Fortschritt messen

| Kennzahl | Formel / Definition | Warum sie wichtig ist | Typische Besprechung |
|---|---|---|---|
| Durchschnittliche Rüstzeit | Σ Rüstzeiten / Anzahl der Rüstvorgänge (letztes bis erstes Gutteil) | Hauptergebnis | Täglich je Maschine, wöchentlicher Trend |
| Spannweite oder Standardabweichung der Rüstzeit | Max − Min oder Standardabweichung über die letzten 20 Rüstvorgänge | Zeigt, ob ein Standard existiert und eingehalten wird | Wöchentlich |
| Rüstvorgänge innerhalb des Standards | Rüstvorgänge ≤ Zielzeit / alle Rüstvorgänge × 100 % | Einhaltung | Täglich am Board |
| Interne Rüstzeit | Summe der internen Elemente | Fortschritt bei Trennung und Umwandlung | Je SMED-Zyklus |
| Anlaufzeit und Anlaufausschuss | Zeit und Ausschuss vom Neustart bis Standardgeschwindigkeit und -qualität | Oft der größte versteckte Verlust | Je Rüstvorgang |
| Erstteil-Gutquote (First Time Right) | Beim ersten Prüfen freigegebene Erstteile / alle Erstteile × 100 % | Qualität des Rüstvorgangs | Wöchentlich |
| Anzahl der Rüstvorgänge pro Woche | Anzahl | Zeigt, ob die Gewinne für kleinere Lose genutzt werden | Wöchentlich mit der Planung |
| Rüstanteil an der geplanten Zeit | Σ Rüstzeit / geplante Produktionszeit × 100 % | Kapazitätssicht | Wöchentlich |
| EPEI | Intervall, in dem alle Teile einmal gefertigt werden | Flexibilität | Monatlich |
| Durchschnittliche Losgröße und Reichweite des Bestands | Stück pro Los; Bestand / durchschnittlicher Tagesbedarf | Betriebliches Ergebnis | Monatlich |
| OEE-Verfügbarkeit | Wie im eigenen OEE-Schema definiert | Effekt auf Maschinenebene, wenn die Zeit zum Produzieren genutzt wird | Wöchentlich |

Das Board einfach halten: ein Diagramm je Maschine mit den täglichen Rüstzeiten gegenüber dem Ziel und eine Zeile für den Grund, wenn ein Rüstvorgang das Ziel überschritten hat. Die allgemeinen Regeln für Kennzahlen-Boards behandelt der Leitfaden zum [Shop Floor Management](https://www.m365.fm/learn/shop-floor-management/).

**Ein Wort zu Zielen:** "Unter zehn Minuten" ist Shingos Anspruch, kein allgemeiner Vergleichswert. Eine gute Rüstzeit ist stabil, sicher und kurz genug, um den EPEI zu ermöglichen, den die Kunden brauchen. Für eine große Pressenlinie können 20 Minuten hervorragend sein; für eine kleine CNC-Drehmaschine können 20 Minuten langsam sein.

## Wirtschaftlichkeit: Kosten, ROI und Bestandsbewertung

Die Finanzabteilung stellt zu SMED drei Fragen: Was kostet es, was bringt es, und wann zeigt es sich in den Zahlen? Die Antworten hängen stark davon ab, ob die Maschine ein Engpass ist.

### Kosten

| Kostenposition | Typische Art | Buchhalterische Behandlung |
|---|---|---|
| Zeit des Teams für Workshop und Nacharbeit | Stunden von Werkern, Einrichtern, Ingenieuren | Betrieblicher Aufwand |
| Günstige Hardware (Wagen, Schattenbretter, Distanzblöcke, Farbcodierung) | Gering | Meist betrieblicher Aufwand, je nach Aktivierungsgrenze |
| Schnellwechseltechnik (Kupplungen, Spannsysteme, Vorwärmgeräte, Voreinstellgeräte) | Mittel bis hoch | Oft Investition (aktiviert), wenn über der Aktivierungsgrenze |
| Schulung | Stunden | Betrieblicher Aufwand |
| Produktionsverlust während der Versuche | Meist gering, wenn die Versuche in geplante Rüstvorgänge fallen | Betrieblicher Aufwand |

### Erträge

1. **Kapazität an einem Engpass:** gewonnene Rüststunden × Deckungsbeitrag pro Stunde, sofern die zusätzliche Ausbringung verkauft werden kann. Im CNC-Beispiel oben kosteten die 590 Rüstminuten pro Woche etwa 92.000 USD Deckungsbeitrag im Jahr; eine Halbierung würde etwa 46.000 USD im Jahr zurückholen, aber nur, wenn die zusätzliche Ausbringung Käufer findet.
2. **Bestandsabbau:** eine einmalige Freisetzung liquider Mittel (Bilanz) plus laufende Einsparungen bei den Lagerhaltungskosten (GuV).
3. **Weniger Eilaufträge und Eil-Rüstvorgänge:** Überstunden, Expressfracht und Störung geplanter Arbeit.
4. **Ausschuss und Nacharbeit:** kürzere und stabilere Anläufe.
5. **Personal:** manchmal geringer, oft ähnlich; Parallelarbeit verkürzt die Durchlaufzeit, aber nicht immer den Arbeitsinhalt.

### ROI-Rechenbeispiel (veranschaulichend, Fortsetzung des Spritzgießbeispiels)

| Position | Betrag |
|---|---|
| Investition: Vorwärmstation | 12.000 USD |
| Investition: 6 Sätze Mehrfachkupplungen zu je 1.500 USD | 9.000 USD |
| Investition: Standardisierung von Spannen und Positionieren | 6.000 USD |
| Zeit des Teams: 6 Personen × 16 Stunden × 45 USD Vollkosten | 4.320 USD |
| **Summe einmalige Kosten** | **31.320 USD** |
| Fertigwarenbestand um 5 Tage gesenkt, bei 6.000 USD Herstellkosten pro Tag | 30.000 USD einmalige Freisetzung liquider Mittel |
| Eingesparte Lagerhaltungskosten bei 20 % pro Jahr auf 30.000 USD | 6.000 USD pro Jahr |
| Weniger Eilaufträge und Überstunden (Schätzung aus den Aufzeichnungen des Vorjahres) | 8.000 USD pro Jahr |
| Anlaufausschuss: 15 Ausschussschüsse weniger je Rüstvorgang × 10 Rüstvorgänge × 50 Wochen × 0,90 USD | 6.750 USD pro Jahr |
| **Wiederkehrender Nutzen** | **20.750 USD pro Jahr** |
| **Einfache Amortisation über den wiederkehrenden Nutzen** | 31.320 / 20.750 ≈ 1,5 Jahre |

Die aus dem Bestand freigesetzten Mittel (30.000 USD) decken die Investition im ersten Jahr fast vollständig, aber das ist ein Bilanzeffekt, kein Gewinn. Beides in der Wirtschaftlichkeitsrechnung getrennt halten und dieselbe Einsparung nicht doppelt zählen.

### Der Effekt der Vollkostenrechnung

Bei der Vollkostenrechnung (Absorption Costing) [38], die die US-GAAP für die externe Bestandsbewertung der Sache nach verlangen (ASC 330-10-30-1 und 30-3 sehen eine Verrechnung fixer Fertigungsgemeinkosten auf Basis der Normalkapazität vor, und 330-10-30-8 stellt fest, dass der Ausschluss aller Gemeinkosten aus den Bestandskosten kein anerkanntes Bilanzierungsverfahren ist [40]; beim Controlling erfragen, wie das eigene Unternehmen das anwendet), wird ein Teil der fixen Fertigungsgemeinkosten im Bestand aktiviert. Sinkt der Bestand, werden die im abgebauten Bestand aktivierten Gemeinkosten in dieser Periode in die Herstellkosten des Umsatzes übernommen. Der ausgewiesene Gewinn kann daher vorübergehend sinken, während der Bestand abgebaut wird, obwohl sich die Liquidität verbessert.

**Rechenbeispiel (veranschaulichend):** Sind 30 Prozent des Bestandswerts von 30.000 USD fixe Gemeinkosten, setzt der Bestandsabbau etwa 9.000 USD Gemeinkosten in die Herstellkosten des Umsatzes der Periode frei. Das Werkscontrolling sollte das der Geschäftsleitung erklären, bevor das SMED-Programm startet, damit ein Lean-Erfolg nicht wie eine Kostenüberschreitung aussieht. Der Leitfaden zu [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/) erläutert, wie solche Effekte in einer Werks-Scorecard dargestellt werden.

## SMED und andere Lean-Werkzeuge

SMED wirkt selten allein. Es hängt von einigen Werkzeugen ab und ermöglicht andere.

| Werkzeug | Beziehung zu SMED |
|---|---|
| [5S](https://www.m365.fm/learn/5s-methode-visuelles-management/) | Voraussetzung: Werkzeuge und Formen an festgelegten Plätzen beseitigen das Suchen, die größte externe Verschwendung [27] |
| [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) | Hält die Gewinne: Der neue Rüstvorgang wird zum Standard [26] |
| [TPM](https://www.m365.fm/learn/tpm-oee/) | Hält Werkzeuge, Formen und Schnellwechseltechnik in Ordnung; leanproduction.com empfiehlt zuerst TPM, wenn Störungen und nicht Rüstvorgänge die verlorene Zeit dominieren [19][29] |
| [Poka Yoke](https://www.m365.fm/learn/lean-management/poka-yoke/) | Verhindert falsche Werkzeuge, Programme oder Anschlüsse [28] |
| [Kanban und Pull](https://www.m365.fm/learn/kanban-pull-prinzip/) | Nutzt kleinere Lose; Kanban-Mengen schrumpfen, wenn die Rüstzeiten kürzer werden [34] |
| [Heijunka](https://www.m365.fm/entity/heijunka/) | Nivellierung nach Mix erfordert häufige, kurze Rüstvorgänge [25] |
| [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/) | Zeigt, welche Rüstvorgänge Bestand und Durchlaufzeit treiben; Rüstzeit und EPEI sind Einträge im Datenkasten [35] |
| [Kaizen](https://www.m365.fm/learn/lean-management/kaizen/) | Der SMED-Workshop ist ein klassisches Format für einen Kaizen-Workshop |
| [Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/) | Lenkt den SMED-Aufwand zuerst auf den Engpass, wo gewonnene Zeit Systemausbringung ist |
| [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/) | Reiht Aufträge so, dass der Rüstaufwand minimal wird, und macht aus kürzeren Rüstzeiten kleinere Lose |

## Dokumentierte SMED-Beispiele

Viele Wettbewerbsseiten nennen "typische" Reduzierungen von 50 bis 90 Prozent ohne Quelle. Die folgenden Beispiele sind dokumentiert, mit ihren Grenzen.

### Pressenrüsten bei Toyota

Wikipedia berichtet auf Grundlage von Shingos Büchern, dass Toyotas Rüstzeiten bis in die 1960er-Jahre von Stunden auf 15 Minuten und bis in die 1970er-Jahre auf 3 Minuten sanken [5]; Shingos eigene Darstellung beschreibt Werkzeugwechsel von ein bis zwei Stunden, manchmal einem halben Tag, die nach Beginn seiner Arbeit bei Toyota 1969 auf wenige Minuten verkürzt wurden [6]. Ein frei verfügbares Ingenieurlehrbuch berichtet von einem Rüstvorgang an einer 1.000-Tonnen-Presse bei Toyota, der von vier Stunden auf drei Minuten verkürzt wurde [36]. Die Zahlen stammen aus Darstellungen von Shingo und Toyota und wurden nicht unabhängig geprüft, sind aber über die Quellen hinweg stimmig.

### Brighton NC Machine Corporation (Michigan, NIST MEP)

Brighton NC Machine, ein Hersteller in Michigan mit mehr als 100 Beschäftigten, arbeitete mit dem Michigan Manufacturing Technology Center zusammen, einem Teil des NIST MEP National Network [17]. Vor dem Projekt konnten Rüstvorgänge nur in der Frühschicht durchgeführt werden, dauerten 8 Stunden und 20 Minuten und erforderten Laufwege der Beschäftigten von ca. 2.780 m (9.121 Fuß) [17]. Ein Kaizen-Workshop mit Video, Spaghetti-Diagramm und Rüstanalyse-Diagramm führte zu 70 Prozent weniger Rüstzeit und 98 Prozent weniger Laufzeit, und das Unternehmen meldete 460.000 USD neuen Umsatz und 125.000 USD Kosteneinsparungen [17]. Die Ergebnisse sind die Angaben des Unternehmens und des MEP; Erfolgsgeschichten des MEP beruhen auf Angaben der Kunden.

### Shingos Beratungsfälle

Shingo berichtete, dass die Rüstzeiten in seinen Fällen zur Rüstzeitreduzierung zwischen 1975 und 1985 im Durchschnitt auf etwa 2,5 Prozent des Ausgangswerts sanken [5]. Das ist ein Durchschnitt ausgewählter Fälle des Erfinders der Methode und damit eher eine obere Messlatte als eine Erwartung.

### Forschungsüberblick

Ein Übersichtsartikel von da Silva und Godinho Filho im *International Journal of Advanced Manufacturing Technology* (2019) ordnete 130 Artikel zu SMED nach Bereich, Methode, Werkzeugen, Umsetzung und Ergebnissen [14]. Die Literatur zeigt SMED in Automobilindustrie, Metallverarbeitung, Verpackung, Druck, Lebensmittel und Pharma. Ein in einem frei verfügbaren Lehrbuch zitierter Fall aus der Druckindustrie berichtete von 46 Prozent weniger interner Rüstzeit [36]. Veröffentlichte Fälle berichten eher von Erfolgen; gescheiterte oder eingeschlafene Projekte werden selten beschrieben. Durchschnittswerte aus der Fallliteratur sind daher mit Vorsicht zu behandeln.

## Typische Fehler bei SMED

| Fehler | Warum er schadet | Besser |
|---|---|---|
| Keine Entscheidung, wie die gewonnene Zeit genutzt wird | Gewinne verschwinden im Leerlauf; Lose bleiben gleich | Vor dem Projekt mit der Planung vereinbaren: Kapazität, kleinere Lose oder Aufteilung |
| Zuerst Hardware kaufen | Automatisiert Verschwendung; Budget weg, bevor die Organisation steht | Zuerst Trennung und Umwandlung ausschöpfen; Mechanisierung zuletzt [5] |
| Nur den "Wechsel" messen | Übersieht Anlauf und Einstellen, oft der größte Teil | Letztes Gutteil bis erstes Gutteil bei Standardgeschwindigkeit [2] |
| Filmen ohne Erklärung | Das Team fühlt sich beobachtet; Widerstand | Zweck erklären, Einrichter in die Analyse einbinden, Nutzung der Videos vereinbaren |
| Pilot an der schwierigsten Maschine | Lang, teuer, langsame Ergebnisse | Pilot mit einem Rüstvorgang von 30–90 Minuten, der oft vorkommt |
| Ein einzelner "Helden"-Rüstvorgang | Rekordzeit mit anwesenden Ingenieuren, nicht wiederholbar | Standardisieren, alle Schichten schulen, über Wochen messen |
| Lockout/Tagout überspringen, um Zeit zu sparen | Ernsthaftes Verletzungsrisiko; in den USA ein OSHA-Verstoß | Lockout in den Standard schreiben; schneller machen, nie überspringen [8] |
| Kein Standard und kein Audit | Die Zeiten driften innerhalb von Monaten zurück | Standard-Rüstblatt, Audits, Kennzahl am Board |
| Die Planung ignorieren | Zufällige Reihenfolgen verursachen Vollrüstungen, wo Teilrüstungen reichen würden | Nach Produktfamilien reihen; Rüstvorgänge zu festen Zeiten planen |
| Einen Rüstvorgang kurz vor Schichtwechsel beginnen | Übergabe mitten im internen Rüsten; Schritte werden ausgelassen oder doppelt gemacht, Schlösser wechseln die Hand | Rüstvorgänge so planen, dass ein Team sie abschließt, oder einen formalen Übergabepunkt mit Lockout-Übergabe festlegen, wie das eigene Verfahren zur Energiesicherung es verlangt |
| Rüstkosten im Planungssystem nie aktualisiert | Das ERP berechnet weiter große Lose | Rüstzeiten und Losgrößenregeln im ERP nach SMED aktualisieren |
| SMED als einmaliges Projekt behandeln | Kein zweiter Zyklus; die Hardwarestufe kommt nie | Zyklen planen; SMED zum Teil der Verbesserungsroutine machen |

Der vorletzte Punkt wird leicht übersehen. Viele ERP-Systeme berechnen Losgrößen aus den Rüstzeiten, die in den Arbeitsplänen hinterlegt sind. Bleiben diese auf den alten Werten, empfiehlt das Planungssystem weiter die alten großen Lose. Der Leitfaden zu [S&OP und MRP](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) erklärt, wo diese Parameter liegen.

## Grenzen und Kritik an SMED

SMED ist eines der am besten dokumentierten Lean-Werkzeuge, hat aber Grenzen, und die Forschungsliteratur hat auf sie hingewiesen.

### 1. Zu viel Organisation, zu wenig Konstruktion

McIntosh und Kollegen argumentierten 1996, dass die verbreitete Auslegung von SMED Praktiker dazu gebracht hat, kostengünstige, teambasierte organisatorische Änderungen zu bevorzugen und konstruktive Lösungen zu übersehen, die das Rüsten grundlegender verbessern könnten; besonderes Augenmerk legten sie auf das Problem, Verbesserungen zu halten [13]. Dieselbe Forschungsgruppe veröffentlichte später im *International Journal of Production Research* (2000) eine kritische Bewertung von Shingos Methodik [12]. Cakmakcis Studie aus der Automobilindustrie verbindet Rüstprobleme ebenfalls mit unzureichender Anlagen- und Werkzeugkonstruktion [16], und Braglia und Kollegen entwickelten das Quick Changeover Design, um Rüstfähigkeit in die Maschinenkonstruktion zu bringen [15]. Die praktische Folgerung: SMED-Workshops durchführen, aber auch Rüstanforderungen in die Spezifikationen für neue Anlagen und Produktkonstruktionen schreiben.

### 2. Die Gewinne halten

Rüstzeiten driften tendenziell zurück, wenn der Standard neuen Mitarbeitenden nicht vermittelt wird, der Rüstwagen seine Werkzeuge verliert oder die Schnellwechseltechnik nicht gewartet wird. McIntosh und Kollegen hoben das Halten der Ergebnisse als zentrale Schwäche hervor [13]. Die Gegenmaßnahmen sind unspektakulär: Standardarbeit, Audits, eine Kennzahl am Board und die Wartung der Hardware im Rahmen von TPM.

### 3. Nicht jeder Prozess profitiert gleich

- **Prozessindustrie** (Chemie, Lebensmittel, Pharma) hat oft Rüstvorgänge, die von Reinigung, Validierung und vorgeschriebenen Prüfungen dominiert werden. SMED verkürzt die Arbeit rund um diese Schritte, aber Kampagnenplanung und Produktreihenfolge (hell vor dunkel, allergenfrei zuerst) können wichtiger sein.
- **Lohnfertiger mit hoher Variantenvielfalt und kleinen Stückzahlen** haben viele einmalige Rüstvorgänge. Die Analyse eines einzelnen Rüstvorgangs Element für Element lohnt sich weniger; standardisierte Spanntechnik, Werkzeugbibliotheken, Offline-Programmierung und die Bündelung nach Teilefamilien lohnen sich mehr.
- **Maschinen mit freier Kapazität und geringem Bestand** gewinnen wenig durch SMED. Zuerst den Anteil des Rüstens an der verlorenen Zeit prüfen [19].

### 4. Gewinne, die nicht im Ergebnis ankommen

Wird die gewonnene Zeit nicht genutzt (siehe die drei Optionen oben), verbessert SMED eine Zahl in einem Diagramm und sonst nichts. Die Methode kann das nicht verhindern; das muss die Führung tun, und es ist der häufigste Grund, warum SMED enttäuscht.

### 5. Druck auf die Menschen

Zeitvorgaben und Stoppuhren können Druck, hastiges Arbeiten und Abkürzungen um die Sicherheit herum erzeugen. Die Methode selbst verlangt das nicht, ihre Umsetzung kann es aber bewirken. Gute Praxis setzt Ziele in einem durchhaltbaren Tempo, schützt die Zeit für Lockout und nutzt gewonnene Zeit nicht für Stellenabbau.

## SMED digital: Daten, Video, MES und Planung

Digitale Werkzeuge ersetzen die SMED-Methode nicht, aber sie beschleunigen die Analyse und machen es leichter, die Ergebnisse zu halten.

### Rüstvorgänge automatisch messen

Manuelle Rüstprotokolle sind oft lückenhaft. Systeme zur Maschinenüberwachung können Rüstvorgänge aus Maschinenzuständen und Stückzahlen erkennen, sodass jeder Rüstvorgang ohne Papierkram einen Start, ein Ende und eine Dauer bekommt; Anbieter wie MachineMetrics argumentieren, dass automatisierte Datenerfassung verlässlicher ist als manuelle Erfassung [21] (Herstellerangabe). Der Werker muss weiterhin den Grund eintragen, wenn ein Rüstvorgang zu lange dauert. Der Leitfaden zu [MES (Manufacturing Execution System) und ISA-95](https://www.m365.fm/learn/mes-isa-95/) erklärt, wie solche Daten in die Systemarchitektur des Werks passen, und [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/) behandelt Cloud-Optionen für ihre Erfassung.

Schnellwechseltechnik ist zunehmend vernetzt: codierte Werkzeuge und Formen, die die Steuerung gegen den Auftrag prüft, Rezeptur-Downloads, Spannsysteme mit Sensoren. Jedes dieser Elemente ist ein OT-Asset im Werksnetz, mit denselben Fragen zu Patches und Zugriff wie jede Steuerung; der geplante Leitfaden zu [OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) behandelt, wie sie abzusichern sind.

### Videoanalyse

Für die meisten SMED-Workshops reicht Video vom Smartphone oder von einer Action-Kamera. Software, mit der das Team das Video in Elemente schneiden und diese als intern oder extern markieren kann, spart Stunden manueller Zeitmessung. Datenschutz vereinbaren: wer die Videos sieht, wie lange sie gespeichert werden und dass sie nicht zur Leistungsbeurteilung Einzelner genutzt werden.

### Digitale Arbeitsanweisungen und Rezepturen

Digitale Arbeitsanweisungen können automatisch mit dem Auftrag umschalten, das Standard-Rüstblatt Schritt für Schritt mit Bildern zeigen und das Erstteilergebnis erfassen; das behandelt der Cluster zur [papierlosen Fertigung](https://www.m365.fm/learn/shop-floor-management/papierlose-fertigung/). Rezepturverwaltung, bei der Maschineneinstellungen je Produkt gespeichert und mit dem Auftrag geladen werden, beseitigt das Einstellen als Quelle von Zeitverlust und Fehlern. In regulierten Branchen müssen beide validiert werden.

### Planung mit reihenfolgeabhängigen Rüstzeiten

Hängen die Rüstzeiten von der Reihenfolge ab (helle vor dunklen Farben, kleine vor großen Formaten, allergenfrei zuerst), kann ein Planungswerkzeug die Aufträge so reihen, dass die gesamte Rüstzeit minimal wird. Systeme für Advanced Planning and Scheduling (APS) können reihenfolgeabhängige Rüstmatrizen abbilden; der Leitfaden zu [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/) erklärt, wie sie funktionieren und was sie vom Shopfloor brauchen. Die Rüstmatrix im APS muss nach jedem SMED-Zyklus aktualisiert werden, sonst optimiert der Planer gegen alte Zeiten.

### Simulation und Wertstrommodelle

Bevor ein Werk die Losgrößen in einem ganzen Wertstrom senkt, kann es den Effekt kürzerer Rüstzeiten auf EPEI, Bestand und Durchlaufzeit in einem Wertstrommodell oder einer ereignisdiskreten Simulation testen. Der Leitfaden zum [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/) und der Cluster zur [Simulation in der Produktion](https://www.m365.fm/learn/digital-twin/simulation-produktion/) erläutern das Vorgehen. Wertstromsoftware wie iFAKT Polaris ist ein Beispiel für ein Werkzeug, das Rüstzeiten und Losgrößen je Prozessschritt vorhält und ihren Effekt auf den Wertstrom berechnet; siehe das Profil zu [iFAKT Polaris](https://www.m365.fm/learn/ifakt-polaris/). **Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

### Grenzen

Digitale Werkzeuge verstärken einen funktionierenden Standard; sie schaffen keinen. Ein Dashboard zur Maschinenüberwachung, das Rüstvorgänge von 90 Minuten zeigt, ändert nichts, bis ein Team den Rüstvorgang filmt und verbessert. Mit Papier und Video beginnen und die Datenerfassung digitalisieren, sobald Standard und Kennzahlenroutine funktionieren.

## SMED-Glossar

| Begriff | Bedeutung |
|---|---|
| **3 Ups** | Clean-up, Set-up, Start-up (Aufräumen, Rüsten, Anlaufen): ein einfaches Modell der Rüstphasen [24] |
| **Anlauf** | Phase nach dem Neustart, bis Gutteile in Standardgeschwindigkeit kommen |
| **Ausnahme für geringfügige Wartung (Minor Servicing Exception)** | Eng gefasste Ausnahme von Lockout/Tagout nach US-Recht für routinemäßige, wiederkehrende und integrale geringfügige Werkzeugwechsel im normalen Produktionsbetrieb mit wirksamem alternativem Schutz [8][9] |
| **ECRS** | Eliminate, Combine, Rearrange, Simplify (eliminieren, kombinieren, umordnen, vereinfachen): Verbesserungsfragen aus Training Within Industry, genutzt in Toyotas Programm für den schnellen Werkzeugwechsel [5] |
| **Einstellen (Adjustment)** | Einstellen nach Versuch und Irrtum nach dem Einbau eines Werkzeugs; die größte Kategorie der Rüstzeit in Shingos Aufteilung [5] |
| **EOQ / EPQ** | Economic Order Quantity / Economic Production Quantity: Losgrößenformeln, die Rüst- und Lagerhaltungskosten abwägen (EOQ im deutschsprachigen Raum meist als Andler-Formel bezeichnet) |
| **EPEI / EPEx** | Every part (product) every interval: wie oft ein Prozess alle seine Teile durchläuft [3] |
| **Erstteilfreigabe** | Prüfung des ersten Teils nach einem Rüstvorgang, bevor die Produktion weiterläuft |
| **Externes Rüsten (äußeres Rüsten)** | Rüstarbeit, die bei laufender Maschine erledigt werden kann [1] |
| **Funktion standardisieren, nicht Form** | Nur die Merkmale eines Werkzeugs standardisieren, die mit der Maschine interagieren, etwa die Spannhöhe [5] |
| **Funktionsspanner** | Befestigung, die mit einer Bewegung spannt, etwa ein Exzenterhebel oder eine Vierteldrehschraube [5] |
| **Internes Rüsten (inneres Rüsten)** | Rüstarbeit, die nur bei stehender Maschine erledigt werden kann [1] |
| **Line Clearance (Linienräumung)** | Prüfung, dass alle Materialien des vorherigen Auftrags entfernt sind, bevor der nächste beginnt; in der US-Arzneimittelverpackung vorgeschrieben [11] |
| **Lockout/Tagout (LOTO)** | Verfahren und Vorrichtungen zur Beherrschung gefährlicher Energien bei Wartung einschließlich Rüsten, nach dem US-Standard 29 CFR 1910.147 [8] |
| **Losbestand (Cycle Stock)** | Bestand, der durch Losgrößen entsteht; bei gleichmäßiger Nachfrage im Schnitt etwa ein halbes Los |
| **OTED** | One-Touch Exchange of Die: Rüstvorgang in unter 100 Sekunden [5] |
| **Parallele Arbeitsgänge** | Zwei oder mehr Personen arbeiten gleichzeitig nach festgelegter Reihenfolge an einem Rüstvorgang [5] |
| **Pressenwerkzeug (Die)** | Werkzeug, mit dem in einer Presse Material geschnitten oder umgeformt wird; Herkunft des "D" in SMED |
| **Rezeptur** | Gespeicherter Satz von Maschinenparametern je Produkt, der geladen statt von Hand eingestellt wird |
| **Rüstanalyse-Diagramm (Setup Analysis Chart)** | Elementliste eines Rüstvorgangs mit Zeiten und Einstufung intern/extern [17] |
| **Rüsten (Changeover)** | Umstellen einer Maschine oder Linie von einem Produkt auf ein anderes; auch Setup genannt [2] |
| **Rüstwagen** | Wagen, der alle Werkzeuge und Teile für einen Rüstvorgang in der Reihenfolge der Nutzung aufnimmt |
| **Rüstzeit (Changeover Time)** | Zeit vom letzten Gutteil des alten Auftrags bis zum ersten Gutteil des neuen Auftrags [2], am besten bei Standardgeschwindigkeit |
| **Schnellrüsten (Quick Changeover, QCO)** | In den USA gängiger Begriff für die SMED-Praxis [18] |
| **Sicherheitsklotz** | Klotz zwischen den Werkzeughälften einer Presse, während Werkzeuge eingestellt oder repariert werden; von der OSHA für mechanische Pressen vorgeschrieben [10] |
| **Spaghetti-Diagramm** | Zeichnung der Laufwege auf einem Layout |
| **Zwischenvorrichtung (Intermediate Jig)** | Standardträger (Palette, Grundplatte), auf dem das nächste Werkzeug oder Werkstück außerhalb der Maschine vorbereitet wird [5] |

## FAQ: SMED und Rüstzeit

### Wofür steht SMED?

SMED steht für Single Minute Exchange of Die (manchmal "Dies" geschrieben). "Single Minute" bedeutet eine einstellige Minutenzahl, also einen Rüstvorgang unter zehn Minuten [1]. Die Methode gilt für jeden Rüstvorgang, nicht nur für Pressenwerkzeuge.

### Wer hat SMED erfunden?

Shigeo Shingo (1909–1990), ein japanischer Wirtschaftsingenieur, entwickelte die Methode ab den 1950er-Jahren, mit Arbeiten bei Toyo Kogyo (Mazda), Mitsubishi Heavy Industries und ab 1969 bei Toyota [6]. Er veröffentlichte sie 1985 auf Englisch als *A Revolution in Manufacturing: The SMED System* [6].

### Welche Schritte hat SMED?

Den Rüstvorgang beobachten und aufnehmen, interne und externe Elemente trennen, internes in externes Rüsten umwandeln, interne Elemente straffen, externe Elemente straffen, standardisieren und wiederholen [5]. Dieser Leitfaden stellt einen Vorbereitungsschritt voran (Pilot, Team, Sicherheitsbewertung, Nutzung der gewonnenen Zeit).

### Was ist der Unterschied zwischen internem und externem Rüsten?

Internes Rüsten ist nur bei stehender Maschine möglich, etwa der Einbau eines Werkzeugs. Externes Rüsten kann bei laufender Maschine erledigt werden, etwa das Holen und Prüfen des nächsten Werkzeugs [1]. SMED verlagert so viel Arbeit wie möglich vom internen ins externe Rüsten.

### Wie berechnet man die Rüstzeit?

Vom letzten Gutteil des vorherigen Auftrags bis zum ersten Gutteil des neuen Auftrags bei Standardgeschwindigkeit messen [2][21]. Die durchschnittliche Rüstzeit ist die Summe aller Rüstzeiten geteilt durch die Zahl der Rüstvorgänge; der Rüstanteil ist die gesamte Rüstzeit geteilt durch die geplante Produktionszeit. Siehe Formeln und CNC-Beispiel im Abschnitt zur Messung.

### Was ist der Unterschied zwischen Changeover Time und Setup Time?

Im Alltag ist oft dasselbe gemeint, auch wenn manche Quellen ausdrücklich unterscheiden [23]. Streng genommen verwenden viele Praktiker "Setup Time" für den eigentlichen Wechsel und "Changeover Time" für den gesamten Verlust vom letzten bis zum ersten Gutteil, einschließlich Auslauf und Anlauf. Für die Verbesserungsarbeit die weitere Definition verwenden.

### Was ist eine gute Rüstzeit?

Shingos Anspruch ist unter zehn Minuten [1]. Eine praktische Antwort: Eine gute Rüstzeit ist stabil (geringe Spannweite), sicher und kurz genug, um die Losgrößen und den EPEI zu ermöglichen, die die Kunden brauchen. Für große Pressenlinien können 20 Minuten hervorragend sein; für eine kleine Maschine können sie langsam sein.

### Was ist OTED?

One-Touch Exchange of Die: ein Rüstvorgang in unter 100 Sekunden [5]. Es ist das nächste Ziel nach SMED und wird meist nur mit eigener Schnellwechseltechnik erreicht.

### Wie hängen SMED und OEE zusammen?

Rüstvorgänge werden in der OEE meist als Verfügbarkeitsverluste gebucht und Anlaufausschuss als Qualitätsverlust [4]. Kürzere Rüstzeiten erhöhen die OEE-Verfügbarkeit nur, wenn die gewonnene Zeit zum Produzieren genutzt wird. Wird sie für häufigeres Rüsten genutzt, kann die OEE gleich bleiben, während sich Bestand und Durchlaufzeit verbessern.

### Braucht man beim Rüsten Lockout/Tagout?

In den USA ist das Einrichten Teil von "Servicing and/or Maintenance" nach dem Lockout/Tagout-Standard der OSHA, 29 CFR 1910.147; interne Rüstschritte an Anlagen mit gefährlicher Energie fallen daher grundsätzlich darunter [8]. Eine eng gefasste Ausnahme gilt für geringfügige Werkzeugwechsel im normalen Produktionsbetrieb, die routinemäßig, wiederkehrend und integral sind, und nur bei wirksamem alternativem Schutz [8][9]. Die Fachkraft für Arbeitssicherheit entscheiden lassen, welche Schritte darunter fallen.

### Was ist der EPEI und wie verändert SMED ihn?

Der EPEI (every part every interval; LEI: EPEx) ist die Zeit, in der ein Prozess alle seine Teilenummern einmal fertigt [3]. Er hängt von den Rüstzeiten und der Zahl der Teile ab. Eine verbreitete Formel ist die gesamte Rüstzeit für alle Teile geteilt durch die tägliche Zeit, die nach der Laufzeit übrig bleibt. Im Beispiel dieses Leitfadens senkt eine Verkürzung der Rüstzeit von 200 auf 70 Minuten pro Durchlauf den EPEI von 2 Tagen auf 1 Tag und halbiert die Lose.

### Warum lassen Verbesserungen beim Rüsten mit der Zeit nach?

Weil der Standard nicht allen Schichten vermittelt wird, der Rüstwagen seine Werkzeuge verliert, die Schnellwechseltechnik nicht gewartet wird oder niemand die Kennzahl beobachtet. Die Forschung hat das Halten der Ergebnisse als zentrale Schwäche der SMED-Praxis identifiziert [13]. Praxisquellen nennen dieselben Ursachen, etwa uneinheitliche Ausführung und Anlagen, die nicht bereit sind [22]. Standardarbeit, Audits und eine tägliche Rüstkennzahl am Board sind die Gegenmaßnahmen.

### Ist SMED Teil von TPM?

Nein. SMED und TPM sind eigenständige Lean-Methoden, die aber voneinander abhängen. TPM hält Werkzeuge, Formen und Schnellwechseltechnik in Ordnung, und leanproduction.com empfiehlt, mit TPM zu beginnen, wenn Störungen und nicht Rüstvorgänge die verlorene Zeit dominieren [19][29]. In den meisten OEE-Schemata werden sowohl Rüstvorgänge als auch Störungen als Verfügbarkeitsverluste gebucht.

### Gilt SMED nur für Werkzeuge und Pressen?

Nein. Der Name stammt von den Pressen, aber das LEI definiert SMED als Vorgehen, um jede Produktionsanlage in möglichst kurzer Zeit von einer Teilenummer auf eine andere umzurüsten [1]. Dieselben Schritte funktionieren für einen Formatwechsel in der Verpackung, einen Formwechsel, einen Vorrichtungswechsel an einem Bearbeitungszentrum oder einen Produktwechsel an einer Montagelinie.

### Was ist der Unterschied zwischen einem SMED-Workshop und einem SMED-Programm?

Ein SMED-Workshop ist eine fokussierte Aktion, meist ein Kaizen-Workshop, an einer Maschine oder Linie. Ein SMED-Programm ist das werksweite System dahinter: eine Standardvorlage für das Rüsten, geschulte Teams, Rüstkennzahlen am Shopfloor-Board und ein Plan für die Ausweitung von Maschine zu Maschine. Workshops bringen die ersten Ergebnisse; das Programm hält und verbreitet sie (siehe Einführungsfahrplan).

### In welchen Branchen wird SMED eingesetzt?

In jeder Branche mit Rüstvorgängen: Automobilindustrie und Blechumformung, Kunststoff, Zerspanung, Verpackung, Druck, Elektronik, Lebensmittel und Getränke sowie Pharma. Eine Übersicht über 130 SMED-Artikel deckte ein breites Spektrum an Branchen ab [14]. In der Prozessindustrie dominieren oft Reinigung und vorgeschriebene Prüfungen; dort wird SMED mit Reihenfolge- und Kampagnenplanung kombiniert.

### Wie lange dauert ein SMED-Projekt?

Ein erster SMED-Zyklus an einer Maschine dauert von der Ausgangsbasis bis zum stabilen neuen Standard oft etwa drei bis vier Monate: einige Wochen Vorbereitung und Ausgangsbasis, ein Workshop von drei bis fünf Tagen, mehrere Wochen für Hardware und Schulung und ein Monat Stabilisierung [unbelegt; Schätzung aus der Praxis]. Lieferzeiten für Hardware können das verlängern.

### Was kostet SMED?

Der erste Zyklus ist oft günstig: Zeit des Teams, Checklisten, Wagen, Farbcodierung und Distanzblöcke. Schnellwechseltechnik wie Mehrfachkupplungen, hydraulisches Spannen oder Vorwärmstationen kostet mehr und sollte nach den organisatorischen Schritten kommen. Das ROI-Rechenbeispiel in diesem Leitfaden schätzt für eine Spritzgießmaschine eine Amortisation nach etwa 1,5 Jahren; die eigenen Zahlen werden abweichen.

### Funktioniert SMED in einem Lohnfertiger mit hoher Variantenvielfalt und kleinen Stückzahlen?

Ja, aber mit anderem Schwerpunkt. Wenn die meisten Rüstvorgänge einmalig sind, das standardisieren, was sich wiederholt: Spanntechnik, Werkzeugbibliotheken, Offline-Programmierung, Voreinstellung und Teilefamilien. Den Rüstprozess analysieren, nicht einen bestimmten Rüstvorgang.

## Fazit und erste Schritte

SMED gehört zu den praktischsten Lean-Methoden, weil seine Logik einfach und seine Ergebnisse messbar sind: die Maschine nicht für Arbeit anhalten, die bei laufender Maschine erledigt werden könnte, und das, was während des Stillstands geschehen muss, einfach, sicher und ohne Einstellen machen. Shingos Erkenntnis aus den 1950er- und 1960er-Jahren gilt weiterhin, und die ersten großen Gewinne kommen nach wie vor aus Checklisten, Bereitstellung und Parallelarbeit statt aus teurer Hardware.

Die Methode zahlt sich nur aus, wenn die gewonnene Zeit genutzt wird. Eine kürzere Rüstzeit ist potenzielle Kapazität oder potenzielle Flexibilität; das Werk muss entscheiden, was davon, und dann Losgrößen, Produktionsläufe, Pläne und ERP-Parameter an die Kundennachfrage anpassen. Die Zahlen in diesem Leitfaden zeigen, warum sich das lohnt: Im EPEI-Beispiel halbiert eine Verkürzung der Rüstzeit pro Durchlauf von 200 auf 70 Minuten die Losgrößen, und in der Losgrößenformel bedeutet ein Viertel der Rüstkosten die halbe wirtschaftliche Losgröße.

Auch die Grenzen verdienen Aufmerksamkeit. Organisatorisches SMED stößt an eine Decke, ab der Anlagen- und Produktkonstruktion übernehmen müssen, Gewinne verpuffen ohne Standards und Audits, und Geschwindigkeit darf nie zulasten von Lockout/Tagout oder Ergonomie gehen.

**Erste Schritte in den nächsten 30 Tagen**

- [ ] Eine Maschine mit häufigen Rüstvorgängen von 30 bis 90 Minuten und sichtbarem betrieblichen Schmerz auswählen
- [ ] Zwei Wochen lang Beginn und Ende jedes Rüstvorgangs erfassen (letztes Gutteil bis erstes Gutteil)
- [ ] Mit der Planung vereinbaren, wie die gewonnene Zeit genutzt wird: Kapazität, kleinere Lose oder eine Aufteilung
- [ ] Das Verfahren zur Energiesicherung dieser Maschine mit der Fachkraft für Arbeitssicherheit prüfen
- [ ] Mit Zustimmung des Teams einen Rüstvorgang filmen und die Elementliste erstellen
- [ ] Jedes Element als intern oder extern markieren und eine Checkliste vor dem Rüsten einführen
- [ ] Den aktuellen EPEI und die daraus folgenden Losgrößen berechnen
- [ ] Die Rüstzeit mit Ziel und Spalte für Gründe auf das Shopfloor-Board bringen
- [ ] Für Werke in den USA: prüfen, ob das NIST-MEP-Zentrum des eigenen Bundesstaats einen Workshop zum Schnellrüsten anbietet [18][31]

---

## Weiterlesen auf m365.fm

**Pillar-Leitfäden**
- [Lean Management: Prinzipien, Werkzeuge, Einführung und Grenzen](https://www.m365.fm/learn/lean-management/)
- [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)
- [Shop Floor Management und Gemba-Walks](https://www.m365.fm/learn/shop-floor-management/)
- [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/)
- [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/)
- [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/)
- [Operational Excellence](https://www.m365.fm/learn/operational-excellence/)
- [iFAKT Polaris](https://www.m365.fm/learn/ifakt-polaris/)
- [5S-Methode und visuelles Management](https://www.m365.fm/learn/5s-methode-visuelles-management/) (geplant)
- [Total Productive Maintenance (TPM) und OEE](https://www.m365.fm/learn/tpm-oee/) (geplant)
- [Kanban und Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/) (geplant)
- [Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant)
- [S&OP, MRP und Produktionsplanung](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) (geplant)
- [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant)
- [Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant)

**Vertiefungen (Cluster, geplant)**
- [Kaizen und Kaizen-Workshops](https://www.m365.fm/learn/lean-management/kaizen/) (geplant)
- [Poka Yoke](https://www.m365.fm/learn/lean-management/poka-yoke/) (geplant)
- [PDCA-Zyklus](https://www.m365.fm/learn/lean-management/pdca-zyklus/) (geplant)
- [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) (geplant)
- [Papierlose Fertigung und digitale Arbeitsanweisungen](https://www.m365.fm/learn/shop-floor-management/papierlose-fertigung/) (geplant)
- [Losgröße berechnen: Andler-Formel (EOQ) und EPQ](https://www.m365.fm/learn/produktionsplanung-aps/losgroesse/) (geplant)
- [Bestandsmanagement in der Produktion](https://www.m365.fm/learn/produktionsplanung-aps/bestandsmanagement/) (geplant)
- [Simulation in der Produktion](https://www.m365.fm/learn/digital-twin/simulation-produktion/) (geplant)
- [Qualifikationsmatrix und TWI](https://www.m365.fm/learn/operational-excellence/qualifikationsmatrix/) (geplant)

**Glossarbegriffe (Entitäten)**
[SMED](https://www.m365.fm/entity/smed/) · [Rüstzeit](https://www.m365.fm/entity/setup-time/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [Standardarbeit](https://www.m365.fm/entity/standard-work/) · [Kanban](https://www.m365.fm/entity/kanban/) · [5S](https://www.m365.fm/entity/5s/) · [Poka Yoke](https://www.m365.fm/entity/poka-yoke/) · [TPM](https://www.m365.fm/entity/total-productive-maintenance/) · [Wertstromanalyse](https://www.m365.fm/entity/value-stream-mapping/) · [Lean Management](https://www.m365.fm/entity/lean-management/)

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Lean Management, Operational Excellence und die digitale Transformation der Produktion, mit dem Schwerpunkt, wie Wertstrommodelle, Simulation und Kennzahlenanalyse Werken helfen, Methoden wie SMED in die Praxis zu bringen. [Redaktion: Rolle, Kurzbiografie und Foto ergänzen.]

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Quellen

Alle Quellen abgerufen am 20. November 2026. Regulatorische Texte und Definitionen des LEI wurden an diesem Datum geöffnet und geprüft; Anbieterseiten werden für Praxisempfehlungen von Anbietern zitiert und im Text als solche gekennzeichnet.

1. Single Minute Exchange of Die. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/single-minute-exchange-of-die/
2. Changeover. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/changeover/
3. Every Product Every Interval (EPEx). Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/every-product-every-interval/
4. Overall Equipment Effectiveness. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/
5. Single-minute exchange of die (Geschichte, Shingos acht Techniken, vier Stufen, sieben Grundschritte, Aufteilung der Rüstzeit, OTED; unter Berufung auf Shingo 1985 und 1989). Wikipedia. https://en.wikipedia.org/wiki/Single-minute_exchange_of_die
6. Shigeo Shingo. Wikipedia. https://en.wikipedia.org/wiki/Shigeo_Shingo
7. Shingo, S. (übersetzt von Dillon, A. P.): A Revolution in Manufacturing: The SMED System. Productivity Press, Cambridge, MA, 1985, 386 S., ISBN 978-0-915299-03-4 (Verlagsseite, Routledge: https://www.routledge.com/A-Revolution-in-Manufacturing-The-SMED-System-1st-Edition/Shingo/p/book/9780915299034; Buchtext nicht direkt eingesehen).
8. 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147 (Wortlaut abgeglichen unter https://www.law.cornell.edu/cfr/text/29/1910.147)
9. Lockout/Tagout eTool: Minor servicing exception (relationship to Subpart O). OSHA. https://www.osha.gov/etools/lockout-tagout/hot-topics/relationship-subpart-o/minor-servicing-exception
10. 29 CFR 1910.217, Mechanical power presses, Absatz (d)(9) Diesetting. OSHA. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.217
11. 21 CFR 211.130, Packaging and labeling operations, Absatz (e). Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/21/211.130
12. McIntosh, R. I. et al.: A critical evaluation of Shingo's "SMED" (Single Minute Exchange of Die) methodology. International Journal of Production Research, Vol. 38, Nr. 11 (2000), S. 2377–2395. Nachweis: https://acnpsearch.tweb-dev.unibo.it/singlejournalindex/73565535 (DOI online nicht bestätigt)
13. McIntosh, R.; Culley, S.; Gest, G.; Mileham, T.; Owen, G.: An assessment of the role of design in the improvement of changeover performance. International Journal of Operations & Production Management, Vol. 16, Nr. 9 (1996), S. 5–22. https://doi.org/10.1108/01443579610125552
14. da Silva, I. B.; Godinho Filho, M.: Single-minute exchange of die (SMED): a state-of-the-art literature review. International Journal of Advanced Manufacturing Technology, Vol. 102 (2019), S. 4289–4307. https://doi.org/10.1007/s00170-019-03484-w
15. Braglia, M.; Di Paco, F.; Frosolini, M.; Marrazzini, L.: Quick changeover design: a new Lean methodology to support the design of machines in terms of rapid changeover capability. Journal of Manufacturing Technology Management, Vol. 34, Nr. 9 (2023), S. 84–114. https://doi.org/10.1108/JMTM-12-2022-0430
16. Cakmakci, M.: Process improvement: performance analysis of the setup time reduction-SMED in the automobile industry. International Journal of Advanced Manufacturing Technology, Vol. 41, Nr. 1 (2009), S. 168–179. https://doi.org/10.1007/s00170-008-1434-4
17. Success Story: Improvement Effort Reduces Changeover Time (Brighton NC Machine Corporation, Michigan Manufacturing Technology Center), 6. April 2018. NIST Manufacturing Innovation Blog. https://www.nist.gov/blogs/manufacturing-innovation-blog/success-story-improvement-effort-reduces-changeover-time
18. Quick Changeover (16. April 2024). WMEP Manufacturing Solutions (Wisconsin), Teil des MEP National Network. https://wmep.org/quick-changeover/
19. SMED (Single-Minute Exchange of Die). leanproduction.com (von einem Anbieter betriebene Wissensseite). https://leanproduction.com/smed
20. Single-Minute Exchange of Die (SMED). Vorne Industries (Anbieter). https://www.vorne.com/tools/single-minute-exchange-of-die.htm
21. How to Reduce Changeover Time. MachineMetrics (Anbieter). https://www.machinemetrics.com/blog/changeover-time
22. How to Reduce Changeover Time in Manufacturing: A Practical Playbook for Maintenance and Operations. MaintainX (Anbieter). https://www.getmaintainx.com/blog/how-to-reduce-changeover-time-in-manufacturing
23. How To Reduce Changeover Time in Manufacturing. Tulip Interfaces (Anbieter). https://tulip.co/blog/reduce-changeover-time-in-manufacturing/
24. How to Reduce Changeover Time with Connected Workforce Software. L2L (Anbieter). https://l2l.com/blog/reduce-changeover-time
25. Heijunka. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/heijunka/
26. Standardized Work. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/standardized-work/
27. 5S. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/five-s/
28. Poka-Yoke. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/poka-yoke/
29. Total Productive Maintenance. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/total-productive-maintenance/
30. About the Shingo Institute. Shingo Institute, Jon M. Huntsman School of Business, Utah State University. https://shingo.org/about-the-shingo-institute/
31. Manufacturing Extension Partnership (MEP). National Institute of Standards and Technology (NIST). https://www.nist.gov/mep
32. Ergonomics. OSHA. https://www.osha.gov/ergonomics
33. Training Within Industry. Wikipedia. https://en.wikipedia.org/wiki/Training_Within_Industry
34. Kanban. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/kanban/
35. Value-Stream Mapping. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/value-stream-mapping/
36. Chapter 5: Single Minute Exchange of Die (SMED). In: Statistical Process Control and Lean Manufacturing (offenes Lehrbuch, Creative Commons). PALNI Pressbooks. https://pressbooks.palni.org/spcleanmanufacturing/?p=35
37. 21 CFR 117.135, Preventive controls, Absatz (c)(2) Food allergen controls. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/21/117.135
38. Total absorption costing. Wikipedia. https://en.wikipedia.org/wiki/Total_absorption_costing
39. Economic order quantity. Wikipedia (Formel Q* = √(2DK/h); Harris 1913). https://en.wikipedia.org/wiki/Economic_order_quantity (abgerufen am 20. November 2026)
40. Handbook: Inventory (2025), Abschnitte zu ASC 330-10-30-1, 30-3, 30-6 bis 30-8. KPMG LLP. https://kpmg.com/kpmg-us/content/dam/kpmg/frv/pdf/2025/inventory.pdf (abgerufen am 20. November 2026)

# Prüfhinweise für die Redaktion

**Fachliche Prüfung:** Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.

**Positionierung und interne Links**

1. Diese Seite besetzt "SMED", "Rüstzeit reduzieren", "Rüstzeitreduzierung" und "Schnellrüsten". Im bestehenden deutschen Pillar *Lean Management* den SMED-Abschnitt kurz halten und mit dem Ankertext "SMED" oder "Rüstzeit reduzieren" auf diese Seite verlinken. Die OEE-Systematik verbleibt bei TPM/OEE (geplant), die Herleitung der Andler-Formel beim Cluster Losgröße (geplant).
2. Alle internen Links zeigen auf die deutschen URLs laut Slug-Map. Die bestehenden deutschen Pillars (einschließlich iFAKT Polaris) sind ohne "(geplant)" verlinkt; neue Pillars und Cluster tragen "(geplant)". Verschachtelte Cluster-URLs gegen das finale CMS-Routing prüfen.
3. Entity-Links (`/entity/...`) unverändert übernommen; prüfen, ob es deutsche Entity-Seiten gibt.
4. Ergänzt wurde nur der Hinweis, dass die EOQ im deutschsprachigen Raum meist als Andler-Formel bezeichnet wird (Begriffsgleichsetzung, keine neue Zahl). Fachlich bestätigen.

**Herstellerangaben**

5. Vorne [20], leanproduction.com [19], MachineMetrics [21], MaintainX [22], Tulip [23] und L2L [24] sind Anbieter und nur für Faustregeln zitiert. MachineMetrics' Aussage zur automatisierten Erfassung ist im Text als Herstellerangabe markiert.
6. iFAKT Polaris wird einmal im Digitalabschnitt als Beispiel für Wertstromsoftware genannt, mit der Offenlegung "**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**". Funktionsbeschreibung vor Veröffentlichung mit dem deutschen Pillar iFAKT Polaris abgleichen. Keine Kennzeichnung als "gesponsert".

**[unbelegt]-Stellen und offene Punkte**

7. Zwei [unbelegt]-Stellen: Zeitrahmen im Einführungsfahrplan und Projektdauer in der FAQ (Schätzungen aus der Praxis).
8. Wikipedia [5][6][33] trägt Geschichte, Shingos acht Techniken und die Kennzahl 2,5 Prozent; möglichst durch Shingo (1985) ersetzen. Die Angabe "zwei bis acht Stunden" für frühe Toyota-Rüstzeiten ist auf Wikipedia als belegbedürftig markiert und im Text so gekennzeichnet.
9. McIntosh et al. 2000 [12]: DOI weiterhin nicht bestätigt. EPQ-Korrekturfaktor ohne eigene Quelle (Lehrbuchformel).
10. Alle Rechenbeispiele sind veranschaulichend; im Layout als Beispielkästen absetzen. Beträge bleiben in USD.

**Für den deutschen Markt prüfen (Aufgaben für die Fachprüfung; im Text bewusst nicht als Fakt ergänzt)**

11. Arbeitssicherheit: Der Abschnitt zu Lockout/Tagout, der Ausnahme für geringfügige Wartung und zu mechanischen Pressen beschreibt US-Recht (OSHA 29 CFR 1910.147 und 1910.217). Prüfen, ob ein Hinweis auf die deutschen Entsprechungen ergänzt werden soll (z. B. ArbSchG, Betriebssicherheitsverordnung und TRBS zu Instandhaltung und Rüsten, DGUV-Regeln und -Informationen zu Freischalten/Sichern, Maschinenrichtlinie bzw. EU-Maschinenverordnung, DIN EN ISO 16092 für Pressen, Lastenhandhabungsverordnung zur Ergonomie).
12. Regulierte Branchen: 21 CFR 211.130(e) und 21 CFR 117.135(c)(2) sind US-FDA-Recht. Prüfen, ob EU-GMP-Leitfaden (Kapitel 5, Line Clearance) und EU-Lebensmittelhygiene-/Allergenkennzeichnungsrecht als redaktioneller Hinweis sinnvoll sind.
13. Bilanzierung: Der Abschnitt zur Vollkostenrechnung bezieht sich auf US-GAAP (ASC 330). Für deutsche Leser prüfen, ob ein Hinweis auf HGB §255 bzw. IAS 2 ergänzt werden soll.
14. Mitbestimmung: Die Abschnitte zu Videoaufnahmen, Rollen und Gewerkschaft beschreiben US-Kontext. Für Deutschland prüfen: Beteiligung des Betriebsrats nach §87 BetrVG (insbesondere Abs. 1 Nr. 6 bei Videoanalyse und Maschinenüberwachung, Nr. 7 Arbeits- und Gesundheitsschutz) sowie Datenschutz (DSGVO, §26 BDSG) bei Videoaufnahmen.
15. Förderangebote: NIST MEP und WMEP sind US-Programme. Prüfen, ob deutsche Anlaufstellen (z. B. Mittelstand-Digital-Zentren) als redaktioneller Hinweis sinnvoll sind.
16. Einheiten: imperiale Angaben (Fuß, Zoll) mit metrischen "ca."-Werten ergänzt; "300 Tonnen" und "1.000 Tonnen" wie im Original (Einheit der Schließ- bzw. Presskraft nicht spezifiziert).

**JSON-LD-Vorschlag**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "headline": "SMED: Rüstzeit reduzieren mit Single Minute Exchange of Die, Schritt für Schritt",
      "inLanguage": "de-DE",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "datePublished": "2026-11-26",
      "dateModified": "2026-11-26",
      "mainEntityOfPage": "https://www.m365.fm/learn/smed-ruestzeitreduzierung/",
      "about": {"@type": "Thing", "name": "Single Minute Exchange of Die (SMED)", "sameAs": "https://www.m365.fm/entity/smed/"},
      "mentions": [
        {"@type": "Thing", "name": "Rüstzeit", "sameAs": "https://www.m365.fm/entity/setup-time/"},
        {"@type": "Thing", "name": "Heijunka", "sameAs": "https://www.m365.fm/entity/heijunka/"},
        {"@type": "Thing", "name": "Standardarbeit", "sameAs": "https://www.m365.fm/entity/standard-work/"},
        {"@type": "Thing", "name": "Kanban", "sameAs": "https://www.m365.fm/entity/kanban/"},
        {"@type": "Thing", "name": "Total Productive Maintenance", "sameAs": "https://www.m365.fm/entity/total-productive-maintenance/"}
      ]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "de-DE",
      "mainEntity": [
        {"@type": "Question", "name": "Wofür steht SMED?", "acceptedAnswer": {"@type": "Answer", "text": "SMED steht für Single Minute Exchange of Die. Single Minute bedeutet eine einstellige Minutenzahl, also einen Rüstvorgang unter zehn Minuten. Die Methode gilt für jeden Rüstvorgang, nicht nur für Pressenwerkzeuge."}}
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://www.m365.fm/"},
        {"@type": "ListItem", "position": 2, "name": "Learn", "item": "https://www.m365.fm/learn/"},
        {"@type": "ListItem", "position": 3, "name": "SMED und Rüstzeitreduzierung", "item": "https://www.m365.fm/learn/smed-ruestzeitreduzierung/"}
      ]
    }
  ]
}
```

- `FAQPage`: alle 19 FAQ-Fragen ergänzen (Antworten ohne [n]-Verweise); eine als Muster gezeigt. `DefinedTermSet` optional für das Glossar.

**Empfohlene Grafiken** (wie englische Fassung, mit deutschen Beschriftungen)

1. Internes und externes Rüsten: Balkendiagramm des Spritzgießbeispiels (96 -> 62 -> 25 Minuten) mit internen und externen Anteilen.
2. Diagramm der SMED-Stufen (Vorstufe, Stufe 1, Stufe 2, Stufe 3) mit Zuordnung der acht Schritte.
3. EPEI-Darstellung: ein Maschinentag aufgeteilt in Laufzeit und Rüstzeit, vorher (2-Tage-Zyklus) und nachher (1-Tag-Zyklus).
4. Losgrößenkurve: Gesamtkosten über Losgröße für S = 160 USD und S = 40 USD, Optimum verschiebt sich von 1.789 auf 894 Stück.
5. Spaghetti-Diagramm vorher/nachher (generisch, als veranschaulichend gekennzeichnet).
6. Lockout/Tagout-Abfolge (sechs Schritte nach 1910.147(d)) angepasst an einen Werkzeugwechsel.

**hreflang**

- `de-DE`: https://www.m365.fm/learn/smed-ruestzeitreduzierung/ <-> `en-US`: https://www.m365.fm/en/learn/smed-changeover-reduction/. Die englische Fassung trägt derzeit den Vermerk "keine deutsche Version, kein hreflang-Paar"; dort das hreflang-Paar und die Metadatenzeile nachziehen.
- Meta-Title und Meta-Description: Pixelbreite im Snippet-Tool prüfen; nach dem SERP-Check für google.de ggf. anpassen.
