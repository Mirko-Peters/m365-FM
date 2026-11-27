# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Papierlose Fertigung: Business Case, Regeln, Fahrplan (53 Zeichen) |
| Meta-Description | Papierlose Fertigung: was zuerst digitalisieren, digitale Arbeitsanweisungen, FDA Part 11 und AS9100, Business Case mit Zahlen und Fahrplan. (140 Zeichen) |
| Slug | `/learn/shop-floor-management/papierlose-fertigung/` (vollständige URL: https://www.m365.fm/learn/shop-floor-management/papierlose-fertigung/) |
| Parent-Pillar | [Shop Floor Management](https://www.m365.fm/learn/shop-floor-management/) |
| Hauptkeyword | papierlose Fertigung |
| Nebenkeywords | digitale Arbeitsanweisungen, papierlose Produktion, papierlose Fabrik, digitaler Laufzettel, elektronischer Laufzettel, elektronisches Chargenprotokoll, eBR, eDHR, digitale Checklisten Produktion, Werkerführung, Werkerassistenz, 21 CFR Part 11, AS9100 Aufzeichnungen, papierlose Fertigung ROI, Connected Worker |
| Suchintention | Kommerzielle Recherche und Informational (Nutzen, was digitalisieren, Compliance, Business Case, Einstieg) |
| Wortzahl | 4.660 Wörter (`wc -w` von H1 bis Fazit, inkl. FAQ, ohne Weiterlesen); englische Fassung: 4.786 Wörter (97 %) |
| Sprachversion | `de-DE`; hreflang-Paar: `de-DE` https://www.m365.fm/learn/shop-floor-management/papierlose-fertigung/ <-> `en-US` https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus.

# Papierlose Fertigung: Was zuerst digitalisieren, wie compliant bleiben und wie den Business Case rechnen

*Stand: 20. November 2026*

> **Kurzantwort:** Papierlose Fertigung heißt, die Papierdokumente, die die Produktion steuern und dokumentieren (Arbeitsanweisungen, Laufzettel, Checklisten, Prüfblätter, Chargen- und Geräteprotokolle, Schichtbücher), durch elektronische Fassungen zu ersetzen, die Werker direkt am Arbeitsplatz nutzen. Gut gemacht, liegt an jedem Arbeitsplatz die aktuelle Revision, Daten werden einmal an der Quelle erfasst, und Aufzeichnungen werden durchsuchbar. Schlecht gemacht, wandern dieselben kaputten Formulare auf ein Tablet. In regulierten Branchen müssen die elektronischen Aufzeichnungen außerdem Regeln wie FDA 21 CFR Part 11 [1] und die Anforderungen des Qualitätsmanagementsystems an die Lenkung von Aufzeichnungen erfüllen.

Dieser Artikel vertieft ein Thema aus unserem Leitfaden zum [Shop Floor Management](https://www.m365.fm/learn/shop-floor-management/). Der Pillar vergleicht analoge und digitale Shopfloor-Boards; hier geht es um die Dokumente hinter der Produktion selbst: welche zuerst digitalisiert werden, was Behörden erwarten, wie sich der Business Case rechnet und wie die Einführung gelingt, ohne das Werk anzuhalten.

### Das Wichtigste in Kürze

- Papierlose Fertigung umfasst zwei Dokumentfamilien: Dokumente, die sagen, was zu tun ist (Arbeitsanweisungen, Arbeitspläne, Checklisten), und Dokumente, die belegen, was getan wurde (Laufzettel, Prüfaufzeichnungen, Chargen- und Geräteprotokolle). Digitalisieren Sie zuerst die erste Familie; das ist einfacher und regulatorisch weniger riskant.
- Nach FDA 21 CFR Part 11 brauchen elektronische Aufzeichnungen in geschlossenen Systemen Validierung, Zugriffsbeschränkung, sichere Audit Trails mit Zeitstempel, Ablauf- und Berechtigungsprüfungen und gelenkte Dokumentation [1]. Elektronische Signaturen müssen Name, Datum, Uhrzeit und Bedeutung der Unterschrift zeigen [1].
- Der Business Case hängt selten an Papier- und Druckkosten. Er hängt an Prüfzeit, Fehlern durch falsche Revisionen, Werkerzeit und in regulierten Werken an einer schnelleren Freigabe der Fertigware. Trennen Sie harte von weichen Einsparungen.
- Im Rechenbeispiel amortisiert sich ein Werk mit 160 Werkern in etwa drei Jahren, wenn die eingesparte Werkerzeit zählt, und mit harten Einsparungen allein gar nicht. Ein kürzerer Freigabeprozess in einem regulierten Werk verändert das Bild vollständig.
- Papierlos ist eine Änderung der Arbeitsweise. Werker müssen die Bildschirme mitgestalten, und das System muss funktionieren, wenn das WLAN es nicht tut.

## Inhaltsverzeichnis

1. [Was ist papierlose Fertigung?](#was-ist-papierlose-fertigung)
2. [Welche Dokumente papierlos werden](#welche-dokumente-papierlos-werden)
3. [Was zuerst digitalisieren: eine Priorisierungsmatrix](#was-zuerst-digitalisieren-eine-priorisierungsmatrix)
4. [Digitale Arbeitsanweisungen, die Werker wirklich nutzen](#digitale-arbeitsanweisungen-die-werker-wirklich-nutzen)
5. [Elektronische Aufzeichnungen in regulierten Branchen](#elektronische-aufzeichnungen-in-regulierten-branchen)
6. [Architektur: Wo papierlose Fertigung in ISA-95 sitzt](#architektur-wo-papierlose-fertigung-in-isa-95-sitzt)
7. [Business Case mit Rechenbeispiel](#business-case-mit-rechenbeispiel)
8. [Papierlos werden: ein Fahrplan in fünf Phasen](#papierlos-werden-ein-fahrplan-in-fuenf-phasen)
9. [Hardware, Ergonomie und die Sicht des Werkers](#hardware-ergonomie-und-die-sicht-des-werkers)
10. [Häufige Fehler](#haeufige-fehler)
11. [FAQ](#faq-papierlose-fertigung)
12. [Fazit](#fazit)

## Was ist papierlose Fertigung?

Papierlose Fertigung (auch papierlose Fabrik oder papierloser Shopfloor) ist der Ersatz von Produktionsdokumenten auf Papier durch elektronische Dokumente und Aufzeichnungen, die am Ort der Arbeit erstellt, genutzt und unterschrieben werden. Der Begriff deckt ein Spektrum ab:

| Stufe | Wie es aussieht | Typische Werkzeuge |
|---|---|---|
| 0: Papier | gedruckte Anweisungen in Klarsichthüllen, Laufzettel auf Papier, Klemmbretter, Ordner | Drucker, Ordner, Scanner für die Archivierung |
| 1: Digitale Anzeige | dasselbe PDF auf einem Bildschirm am Arbeitsplatz | Dokumentenmanagement, Netzlaufwerk, Bildschirm |
| 2: Interaktive Anweisungen | Schritt-für-Schritt-Anweisungen mit Bildern und Video, Werker bestätigt die Schritte | Software für digitale Arbeitsanweisungen bzw. Werkerführung, Connected-Worker-Apps |
| 3: Datenerfassung an der Quelle | Messwerte, Prüfungen und Unterschriften werden in strukturierte Aufzeichnungen eingegeben oder von Geräten eingelesen | MES, Qualitätssystem, vernetzte Werkzeuge und Messmittel |
| 4: Erzwungene Ausführung | das System sperrt den nächsten Schritt, bis der vorherige erledigt ist, prüft Material und Qualifikation | MES mit elektronischen Chargenprotokollen oder erzwungenem Laufzettel |

Stufe 1 spart das Drucken, ändert aber sonst wenig. Die Vorteile, die die meisten Werke wollen, also aktuelle Revisionen, kein Abschreiben, durchsuchbare Aufzeichnungen und Prüfung nach Ausnahmen (Review by Exception), beginnen auf den Stufen 2 und 3. Auf Stufe 4 holen regulierte Werke den größten Nutzen heraus, und dort ist auch der Validierungsaufwand am höchsten.

## Welche Dokumente papierlos werden

| Papierdokument | Digitale Entsprechung | Was sich ändert |
|---|---|---|
| Arbeitsanweisung, Standardarbeitsblatt | digitale Arbeitsanweisung mit Bildern, Video, Schrittbestätigung | Revision ist immer aktuell; Rückmeldung des Werkers je Schritt; siehe [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) |
| Laufzettel / Begleitkarte / Auftragsmappe | elektronischer Laufzettel, verknüpft mit dem Fertigungsauftrag | Status in Echtzeit sichtbar; keine verlorenen Mappen |
| Prüf- und Messblätter | digitale Formulare, Messmittelanbindung, SPC | kein Abschreiben; Werte außerhalb der Toleranz sofort markiert |
| Checklisten für Anfahren, Rüsten und 5S | digitale Checklisten mit Zeitstempel | Erledigung auf dem Board sichtbar; Trends über die Zeit |
| Chargenprotokoll (Arzneimittel) | elektronisches Chargenprotokoll (eBR) | Reihenfolge erzwungen, Prüfung nach Ausnahmen |
| Geräteprotokoll (Device History Record) / Produktionsaufzeichnungen (Medizinprodukte) | elektronische Aufzeichnungen nach der QMSR | Rückverfolgbarkeit je Los oder Seriennummer |
| Schichtübergabebuch, Instandhaltungsbuch | digitales Logbuch, mit der Anlage verknüpft | durchsuchbare Historie; Übergabe an das Instandhaltungssystem |
| Fehleranhänger und Fehlermeldung | digitale Abweichungsmeldung | Weiterleitung an die Qualität, Fotos, Verfolgung der Sofortmaßnahmen |

## Was zuerst digitalisieren: eine Priorisierungsmatrix

Bewerten Sie jede Dokumentart auf vier Kriterien von 1 (niedrig) bis 3 (hoch) und multiplizieren Sie die Nutzungshäufigkeit mit der Summe der anderen drei. Beginnen Sie mit den höchsten Werten, die ein geringes regulatorisches Risiko haben. Die Bewertung ist eine Faustregel, um die Diskussion zu strukturieren, keine validierte Methode; passen Sie die Kriterien an Ihr Werk an.

| Dokumentart | Nutzungshäufigkeit | Fehlerauswirkung | Änderungshäufigkeit | Datenwert | Punkte (Häufigkeit × Summe) | Regulierte Aufzeichnung? |
|---|---|---|---|---|---|---|
| Arbeitsanweisungen, Montage mit hoher Variantenvielfalt | 3 | 3 | 3 | 1 | 21 | meist nein (gelenktes Dokument) |
| Rüstcheckliste | 2 | 2 | 1 | 2 | 10 | nein |
| Prüfblatt, kritische Merkmale | 3 | 3 | 1 | 3 | 21 | oft ja |
| Laufzettel auf Papier | 3 | 2 | 1 | 3 | 18 | ja in Luftfahrt und Medizintechnik |
| Schichtübergabebuch | 3 | 1 | 1 | 2 | 12 | nein |
| 5S-Auditblatt | 1 | 1 | 1 | 1 | 3 | nein |

In diesem Beispiel liegen digitale Arbeitsanweisungen und das Prüfblatt gleichauf bei 21. Arbeitsanweisungen kommen meist zuerst, weil sie gelenkte Dokumente und keine Qualitätsaufzeichnungen sind, der Validierungsumfang ist also kleiner; das Prüfblatt folgt, sobald Infrastruktur und Änderungsprozess erprobt sind.

## Digitale Arbeitsanweisungen, die Werker wirklich nutzen

Digitale Arbeitsanweisungen sind der häufigste Einstieg in die papierlose Fertigung. Die Qualität der Inhalte entscheidet, ob Werker sie nutzen.

**Regeln für die Inhalte:**

1. **Ein Schritt je Bildschirm, eine Handlung je Schritt.** TWI Job Instruction sagt dasselbe für die Schulung: die Arbeit in kleinen Abschnitten vorführen und neue Information dosieren [9].
2. **Den Kniff zeigen.** Die Arbeitszerlegung in TWI listet die Schritte und den besonderen Kniff, der nötig ist, um die Arbeit sicher und gut zu erledigen [8]. Setzen Sie den Kniff als Foto oder kurzes Video direkt an den Schritt, nicht in eine Fußnote.
3. **Bilder vom echten Arbeitsplatz.** CAD-Darstellungen helfen bei der Orientierung; das Foto der echten Vorrichtung verhindert Fehler.
4. **Qualitäts- und Sicherheitspunkte markiert.** Nutzen Sie dieselben Symbole wie im Standardarbeitsblatt.
5. **Takt und Arbeitsfolge aus der Standardarbeit.** Die Anweisung zeigt die Arbeitsfolge; die Kombinationstabelle dahinter zeigt, ob die Folge in den Takt passt [8].
6. **Ein Rückmeldeknopf an jedem Schritt.** Werker melden unklare Schritte dort, wo sie auftreten. Der Autor antwortet innerhalb einer festen Frist.
7. **Sprachen und Leseniveau.** Mehrsprachige Belegschaften brauchen Anweisungen in ihren Sprachen, geprüft von Muttersprachlern aus der Produktion, mit Bildern, die ohne Text funktionieren.

**Änderungslenkung:** Hier hilft papierlos mehr als irgendwo sonst. Eine freigegebene Änderung erreicht jeden Arbeitsplatz im selben Moment, und niemand arbeitet nach einem alten Ausdruck. Das funktioniert nur mit einem gelenkten Freigabeprozess: Entwurf, Prüfung durch die Werker, die die Arbeit machen, Freigabe durch Fertigungstechnik und Qualität, Freigabe mit Gültigkeitsdatum und Unterweisung, bevor die neue Revision genutzt wird. Ein digitales System, in dem jeder die aktive Anweisung bearbeiten kann, ist schlechter als Papier.

## Elektronische Aufzeichnungen in regulierten Branchen

In regulierten Werken sind Entscheidungen zur papierlosen Fertigung Compliance-Entscheidungen. Dieser Abschnitt nennt die US-Regeln, auf die Sie auslegen müssen; er ersetzt nicht die Beratung durch Ihre Regulatory-Affairs- oder Qualitätsabteilung.

### FDA 21 CFR Part 11: elektronische Aufzeichnungen und Signaturen

Part 11 der US-Arzneimittelbehörde FDA gilt für elektronische Aufzeichnungen und Signaturen, die FDA-Vorschriften (die sogenannten Predicate Rules) verlangen. Für geschlossene Systeme, definiert als Umgebungen, in denen der Systemzugang von den für den Inhalt der Aufzeichnungen verantwortlichen Personen kontrolliert wird [1], verlangt Abschnitt 11.10 Kontrollen, darunter [1]:

| 11.10 | Kontrolle | Was sie für einen papierlosen Shopfloor bedeutet |
|---|---|---|
| (a) | Validierung auf Genauigkeit, Zuverlässigkeit und die Fähigkeit, ungültige oder veränderte Aufzeichnungen zu erkennen | Validierungspaket für das System und die konfigurierten Formulare |
| (b) | genaue und vollständige Kopien in lesbarer und elektronischer Form | Export von Aufzeichnungen für Inspektionen |
| (c) | Schutz der Aufzeichnungen über die Aufbewahrungsfrist | Archiv- und Backup-Strategie |
| (d) | Systemzugang nur für berechtigte Personen | persönliche Konten, keine gemeinsamen Terminal-Logins |
| (e) | sichere, vom Computer erzeugte Audit Trails mit Zeitstempel, die frühere Einträge nicht verdecken | jede Änderung eines regulierten Werts wird protokolliert |
| (f) | Ablaufprüfungen im System, die die zulässige Reihenfolge der Schritte erzwingen | die Schrittfolge des Chargenprotokolls oder Laufzettels wird erzwungen |
| (g) | Berechtigungsprüfungen | nur qualifizierte Personen dürfen unterschreiben oder Aufzeichnungen ändern |
| (h) | Geräteprüfungen | das System prüft Datenquellen wie Waagen und Messmittel |
| (i) | Ausbildung, Schulung und Erfahrung der Personen, die das System entwickeln, pflegen oder nutzen | Schulungsnachweise für Autoren, Administratoren und Werker |
| (j) | schriftliche Regeln, die Personen für Handlungen unter ihrer Signatur verantwortlich machen | Signaturrichtlinie |
| (k) | Kontrollen über die Systemdokumentation | gelenkte Handbücher, Änderungshistorie |

Elektronische Signaturen müssen den Namen des Unterzeichners in Druckschrift, Datum und Uhrzeit der Unterschrift und die Bedeutung der Unterschrift zeigen, etwa Prüfung, Freigabe, Verantwortung oder Urheberschaft [1]. Signaturen müssen mit ihren Aufzeichnungen verknüpft sein, damit sie nicht mit gewöhnlichen Mitteln entfernt, kopiert oder übertragen werden können, um eine Aufzeichnung zu fälschen [1]. Nicht biometrische Signaturen brauchen mindestens zwei getrennte Identifikationsbestandteile, etwa Kennung und Passwort; innerhalb einer durchgehenden Sitzung nutzt die erste Unterschrift alle Bestandteile, spätere mindestens einen [1].

**Praktische Folgen in der Produktion:** Ausweis plus PIN am Terminal statt eines gemeinsamen Logins; kein "Unterschreiben für den Kollegen"; eine klare Regel, was jede Unterschrift bedeutet (durchgeführt, geprüft, kontrolliert); und ein erprobtes Vorgehen für den Fall, dass das System ausfällt.

Wie die FDA Part 11 anwendet, erklärt sie in ihrem Leitfaden *Part 11, Electronic Records; Electronic Signatures: Scope and Application* (September 2003) [2]. Die FDA legt den Anwendungsbereich von Part 11 nach eigener Aussage "eng" aus [2]: Die Regel erfasst Aufzeichnungen, die Predicate Rules verlangen und die elektronisch statt auf Papier geführt werden, Aufzeichnungen in beiden Formen, wenn Sie sich bei regulierten Tätigkeiten auf die elektronische stützen, und elektronische Signaturen, die handschriftliche ersetzen sollen [2]. Bei Validierung, Audit Trails, Aufbewahrung und Kopieren von Aufzeichnungen will die FDA nach eigener Aussage Ermessen bei der Durchsetzung (Enforcement Discretion) ausüben, während sie Kontrollen wie Zugriffsbeschränkung, Ablauf-, Berechtigungs- und Geräteprüfungen, Schulung, Verantwortlichkeitsregeln und die Anforderungen an elektronische Signaturen weiter durchsetzt [2]. Die Predicate Rules selbst (zum Beispiel 21 CFR Parts 211 und 820) bleiben voll durchsetzbar [2].

**Was "Enforcement Discretion" nicht bedeutet:** Es bedeutet nicht, dass Audit Trails oder Validierung in der Praxis optional sind. Die Predicate Rules, Ihr eigenes Qualitätsmanagementsystem und die Erwartungen der FDA an Datenintegrität verlangen weiterhin Aufzeichnungen, denen man vertrauen kann. Stützen Sie den Umfang von Validierung und Audit Trail auf eine dokumentierte Risikobewertung, wie der Leitfaden es empfiehlt [2], und stimmen Sie ihn mit Ihrer Qualitätseinheit ab.

### Arzneimittel: Chargenprotokolle

Nach den US-Regeln zur guten Herstellungspraxis für Arzneimittel (CGMP) müssen für jede Charge Herstellungs- und Prüfprotokolle erstellt werden [4]. Ein elektronisches Chargenprotokoll (eBR) erzwingt die Rezepturfolge, erfasst Gewichte und Prozesswerte an der Quelle und unterstützt die Prüfung nach Ausnahmen: Die Qualität prüft die Abweichungen, die das System markiert hat, statt jeder Seite. Weil die Prüfung des Chargenprotokolls oft die Freigabe begrenzt, ist das einer der stärksten Business Cases für papierlose Fertigung.

### Medizinprodukte: QMSR

Die Quality Management System Regulation (QMSR) der FDA gilt seit dem 2. Februar 2026; sie übernimmt ISO 13485:2016 per Verweis, zusammen mit Abschnitt 3 der ISO 9000:2015 [5]. Produktionsaufzeichnungen auf Papier und elektronisch müssen jetzt den Anforderungen der ISO 13485 zugeordnet werden, wie die QMSR sie übernimmt. Der ältere Begriff "Device History Record" taucht noch in vielen Softwareprodukten und Werksverfahren auf; prüfen Sie Ihre Verfahren gegen die aktuelle Regelung, nicht gegen die alten Abschnittsnummern von Part 820.

### Datenintegrität

Der Datenintegritäts-Leitfaden der FDA für Arzneimittelhersteller definiert Datenintegrität als "die Vollständigkeit, Konsistenz und Genauigkeit von Daten" und nutzt das Akronym ALCOA: attributable (zuordenbar), legible (lesbar), contemporaneously recorded (zeitnah erfasst), original or a true copy (Original oder beglaubigte Kopie) und accurate (genau) [3]. Der Leitfaden der FDA (Dezember 2018) stellt fest, dass bei gemeinsam genutzten Zugangsdaten "über den Login keine eindeutige Person identifiziert werden kann" und das System die CGMP-Anforderungen nicht erfüllt; gemeinsame Nur-Lese-Konten zum Ansehen von Daten sind zulässig [3]. Papierlose Systeme machen die meisten ALCOA-Merkmale einfacher (zuordenbare Logins, Zeitstempel, keine unleserliche Handschrift), schaffen aber auch neue Risiken: gemeinsame Terminalkonten, bearbeitbare Tabellen als Aufzeichnungen und nachträglich eingegebene Daten.

### Hybride Aufzeichnungen

Während der Einführung arbeiten viele Werke mit hybriden Aufzeichnungen: ein Teil des Laufzettels auf Papier, ein Teil im System, oder Papierformulare, die in ein Archiv gescannt werden. Legen Sie in einer Verfahrensanweisung fest, welche Fassung für jede Aufzeichnungsart die offizielle ist, wie Papiereinträge übertragen oder gescannt werden, wer prüft, ob ein Scan vollständig und korrekt ist, und was mit dem Papieroriginal passiert. Zwei parallele Aufzeichnungen desselben Ereignisses ohne diese Regel sind ein Audit-Befund, der nur darauf wartet, gefunden zu werden.

### Luftfahrt und Automobil

AS9100, geschaffen von der International Aerospace Quality Group (IAQG) und 2016 zur Version D überarbeitet, baut auf ISO 9001 auf und ergänzt luftfahrtspezifische Anforderungen wie Konfigurationsmanagement, Vermeidung gefälschter Teile und Rückverfolgbarkeit [6]. IATF 16949 spielt eine ähnliche Rolle in der Automobilindustrie. Beide bauen auf ISO 9001:2015 auf, deren Abschnitt 7.5 dokumentierte Information in jedem Format und auf jedem Medium abdeckt und deren Abschnitt 7.5.3 verlangt, dass sie unter gelenkten Bedingungen verwaltet wird [11] (Sekundärquelle; die Grundlage von IATF 16949 wurde nicht erneut geprüft). ISO 9001 selbst hat eine neue Ausgabe, ISO 9001:2026, deren Veröffentlichung für den 16. September 2026 angekündigt war, mit einer Übergangsfrist von etwa drei Jahren [12]; der neuere Text spricht von Dokumenten, die "verfügbar sein müssen", und Aufzeichnungen, die "als Nachweis verfügbar sein müssen", statt von "aufrechterhalten" und "aufbewahren" [11]. Kunden- und behördliche Anforderungen ergänzen oft Aufbewahrungsfristen und Rückverfolgbarkeit je Seriennummer. Die Normen schreiben weder Papier noch elektronische Aufzeichnungen vor; sie verlangen, dass Dokumente gelenkt und Aufzeichnungen geschützt, auffindbar und lesbar sind. Prüfen Sie den genauen Wortlaut der Abschnitte im kostenpflichtigen Normtext mit Ihrem Qualitätsverantwortlichen. Der Pillar zur [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/) behandelt den Kontext von AS9100 ausführlicher.

## Architektur: Wo papierlose Fertigung in ISA-95 sitzt

ISA-95 (IEC 62264) ist die internationale Norm für die Integration von Unternehmens- und Steuerungssystemen [7]. Papierlose Fertigung sitzt überwiegend auf Ebene 3, dem Manufacturing Operations Management, zwischen dem ERP (Ebene 4) und den Maschinen (Ebenen 1 und 2).

| Quelle oder Abnehmer | Was geliefert oder gebraucht wird | Typisches System |
|---|---|---|
| ERP (Ebene 4) | Fertigungsaufträge, Stücklisten, Arbeitspläne; empfängt Rückmeldungen | ERP |
| PLM / Entwicklung | freigegebene Zeichnungen, Spezifikationen, Inhalte der Arbeitsanweisungen | PLM, Dokumentenmanagement |
| Papierlose Ebene (Ebene 3) | Anweisungen an der Station, elektronischer Laufzettel, Prüfungen, Unterschriften, Aufzeichnungen | MES, Plattform für digitale Arbeitsanweisungen, Qualitätssystem |
| Maschinen und Geräte (Ebenen 1 und 2) | Messwerte, Messmittelwerte, Maschinenzustände | SPS, smarte Werkzeuge, Messmittel |
| Analyse | Qualitäts- und Produktionsdaten für Kennzahlen und Verbesserung | Datenplattform, Dashboards |

Drei Gestaltungsfragen entscheiden über die Architektur:

1. **Ist die Aufzeichnung reguliert?** Dann gehört sie in ein für diesen Zweck validiertes System (MES, eBR, Qualitätssystem), nicht in ein allgemeines Kollaborationswerkzeug.
2. **Muss das System erzwingen oder nur aufzeichnen?** Erzwingen (einen Schritt sperren) braucht die Anbindung an Auftrags-, Material- und Qualifikationsdaten, was auf ein MES hinausläuft. Siehe [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant).
3. **Was passiert offline?** Entscheiden Sie je Dokument: zwischengespeicherte Anweisungen zum Lesen, ein Papier-Ersatzformular mit Abgleichverfahren für Aufzeichnungen, und wie lange die Linie ohne Server laufen kann.

Für nicht regulierte Dokumente wie Schichtübergabenotizen, 5S-Audits oder Verbesserungsideen können allgemeine Plattformen gut funktionieren. Unser Leitfaden zu [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/) beschreibt Cloud-Datenarchitekturen für Werke, und der Parent-Pillar beschreibt ein [digitales Shopfloor-Board mit Microsoft 365](https://www.m365.fm/learn/shop-floor-management/). Vernetzte Tablets und Terminals hängen im Werksnetz, also müssen sie zu den Segmentierungs- und Zugriffsregeln Ihres OT-Security-Programms passen; siehe [OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant).

## Business Case mit Rechenbeispiel

Das folgende Beispiel ist beispielhaft. Ersetzen Sie jede Zahl durch Ihre eigene; nützlich ist die Struktur.

**Werksprofil:** diskrete Montage, 160 Werker in zwei Schichten (80 je Schicht, davon arbeiten 40 je Schicht an Stationen mit Anweisungen und Aufzeichnungen), 400 gelenkte Arbeitsanweisungen, 240 Produktionstage pro Jahr, Vollkosten 38 USD pro Stunde für Werker und 60 USD pro Stunde für Ingenieure.

### Nutzen pro Jahr

| Nr. | Nutzen | Rechnung | Wert pro Jahr | Hart oder weich? |
|---|---|---|---|---|
| B1 | Werkerzeit für Papierkram und Suchen | 40 Werker × 2 Schichten × 10 min eingespart × 240 Tage = 3.200 h × 38 USD | 121.600 USD | weich, außer die Stunden werden anders eingesetzt oder Überstunden sinken |
| B2 | Prüfung der Aufzeichnungen durch die Qualität | 2,0 → 1,0 Prüfer-Vollzeitstellen, 95.000 USD Vollkosten je Stelle | 95.000 USD | hart nur, wenn eine Stelle umgesetzt oder eine geplante Einstellung vermieden wird |
| B3 | Fehler durch falsche Revisionen oder übersprungene Schritte | 6 → 1 Ereignisse pro Jahr × 12.000 USD Durchschnittskosten (Nacharbeit, Sortieren, Fracht) | 60.000 USD | hart |
| B4 | Papier, Drucken, Ablage, Scannen, externe Archivierung | Rechnungen | 18.000 USD | hart |
| | **Summe** | | **294.600 USD** | hart (B3 + B4): 78.000 USD |

### Kosten

| Posten | Rechnung | Einmalig | Pro Jahr |
|---|---|---|---|
| Geräte und Halterungen | 50 Stationen × 1.500 USD | 75.000 USD | 18.750 USD Ersatz (4 Jahre Nutzungsdauer) |
| Netzabdeckung in der Produktion | Ausleuchtung und Access Points | 40.000 USD | |
| Implementierungs- und Integrationsleistungen | Angebot von Anbieter oder Integrator | 150.000 USD | |
| Validierung (nur regulierte Aufzeichnungen) | Protokoll, Tests, Dokumentation | 60.000 USD | |
| Internes Projektteam | 0,5 Vollzeitstellen × 110.000 USD für ein Jahr | 55.000 USD | |
| Umstellung der Inhalte | 400 Anweisungen × 3 h × 60 USD | 72.000 USD | |
| Schulung | 80 Werker × 4 h × 38 USD + Autoren | 12.160 USD | |
| Software-Abonnement | Angebot des Anbieters | | 100.000 USD |
| Systemadministration | 0,25 Vollzeitstellen × 110.000 USD | | 27.500 USD |
| **Summe** | | **464.160 USD** | **146.250 USD** |

### Ergebnis

| Sicht | Nettonutzen pro Jahr | Einfache Amortisation | Netto über 5 Jahre (nicht abgezinst) |
|---|---|---|---|
| Alle Nutzen (B1 bis B4) | 294.600 USD − 146.250 USD = 148.350 USD | 464.160 USD ÷ 148.350 USD = 3,1 Jahre | 5 × 148.350 USD − 464.160 USD = 277.590 USD |
| Hart plus Prüfung (B2 bis B4) | 173.000 USD − 146.250 USD = 26.750 USD | 17,4 Jahre | negativ |
| Nur hart (B3 + B4) | 78.000 USD − 146.250 USD = −68.250 USD | keine | negativ |

Abgezinst mit angenommenen 8 Prozent Kapitalkosten liegt der Rentenbarwertfaktor für fünf Jahre bei 3,993; der Fall mit allen Nutzen hat damit einen Kapitalwert von 3,993 × 148.350 USD − 464.160 USD = rund 128.200 USD. Die ehrliche Schlussfolgerung für dieses Werk: Das Projekt rechnet sich nur, wenn Werkerzeit und Prüfzeit tatsächlich frei werden und genutzt werden, zum Beispiel um Mengenwachstum ohne Neueinstellungen aufzufangen. Das Werkscontrolling wird nach diesem Plan fragen. Die Umstellung der Inhalte wird leicht unterschätzt: Das Magazin *Assembly* zitierte einen Softwareanbieter mit der Aussage, viele seiner Kunden gäben mehr für die Umstellung der Dokumentation aus als für Softwarelizenzen [10] (eine Herstelleraussage, kein Benchmark). Die Kosten wachsen mit jeder Anweisung, die Sie unverändert übernehmen; räumen Sie auf, bevor Sie umstellen.

### Der Hebel im regulierten Werk: Durchlaufzeit der Freigabe

In einem Werk, in dem die Prüfung des Chargenprotokolls die Freigabe verzögert, ändert sich der Fall. Angenommen, Fertigware im Wert von 400.000 USD je Produktionstag wartet auf die Freigabe, und elektronische Chargenprotokolle mit Prüfung nach Ausnahmen verkürzen die Prüfung von 10 auf 4 Tage. Der Bestand, der auf die Freigabe wartet, sinkt um 6 Tage × 400.000 USD = 2,4 Mio. USD, ein einmaliger Liquiditätseffekt. Bei angenommenen jährlichen Lagerhaltungskosten von 20 Prozent kommen rund 480.000 USD pro Jahr hinzu. Der Lagerhaltungskostensatz ist eine Annahme; nutzen Sie Ihre eigenen Kapital- und Lagerkosten. Weisen Sie den einmaligen Liquiditätseffekt und die laufenden Lagerhaltungskosten getrennt aus und klären Sie mit der Finanzabteilung, wie die Bestandsbewertung Ware behandelt, die auf die Freigabe wartet.

**Capex oder Opex?** Geräte und Netz sind meist Investitionsausgaben (Capex); Abonnements sind Betriebsausgaben (Opex); Implementierungsleistungen können beides sein, je nach Ihrer Bilanzierungsrichtlinie für Software. Klären Sie die Behandlung früh, denn sie entscheidet, welches Budget zahlt und wie die Amortisation für das Werk aussieht.

## Papierlos werden: ein Fahrplan in fünf Phasen

| Phase | Dauer (typisch) | Inhalt | Abschlusskriterium |
|---|---|---|---|
| 1. Bestandsaufnahme | 4–6 Wochen | Dokumente erfassen, mit der Matrix bewerten, regulierte Aufzeichnungen zuordnen, Netz und Geräte in der Produktion prüfen | priorisierte Dokumentenliste, Entwurf des Business Case |
| 2. Konzept | 4–8 Wochen | Plattform auswählen, Vorlagen mit Werkern festlegen, Änderungslenkung, Offline-Verfahren, Bedeutung der Signaturen, Validierungsansatz definieren | freigegebenes Konzept, Vorlagenbibliothek |
| 3. Pilot | 8–12 Wochen | eine Linie oder Zelle, die Dokumentarten mit den höchsten Punkten, Papier parallel nur wo nötig, mit einer festgelegten maßgeblichen Aufzeichnung | Werker bevorzugen digital, Ausgangswerte für Fehler und Zeit gemessen |
| 4. Ausrollen | 6–18 Monate | Linie für Linie, Inhalte vor der Umstellung bereinigen, Autoren schulen | Papier je Linie abgeschafft, Aufzeichnungen abgeglichen |
| 5. Verbessern | laufend | die Daten nutzen: Rückmeldungen je Schritt, Abweichungen, Prüfzeiten | Kennzahlen in den Stufenrunden (Tier Meetings) besprochen |

Die Dauern sind Praxiswerte, keine belegten Benchmarks. Starten Sie den Pilot dort, wo das Team will und das Dokumentenproblem echt ist, nicht dort, wo das System am leichtesten zu installieren ist.

## Hardware, Ergonomie und die Sicht des Werkers

- **Bildschirmposition.** Die Anweisung muss aus der Arbeitsposition lesbar sein, ohne sich vom Teil abzuwenden. Für die Montage sind Halterungen besser als Tablets in der Hand; Handgeräte passen zu Prüfrundgängen und Instandhaltung.
- **Handschuhe, Staub, Kühlschmierstoff, Reinräume.** Wählen Sie Geräte und Eingabemethoden (Touch mit Handschuhen, Barcode, Fußpedal, Sprache) für die tatsächliche Umgebung.
- **Geschwindigkeit.** Jede Sekunde, die der Werker auf einen Bildschirm wartet, kommt auf den Zyklus drauf. Testen Sie Ladezeiten in der Produktion, nicht im Büro.
- **Geräteverwaltung.** Gemeinsam genutzte Tablets und Terminals brauchen zentrale Geräteverwaltung, Patches, eine Akku- und Laderoutine und einen klaren Verantwortlichen. Prüfen Sie die WLAN-Abdeckung an jeder Station; Metallregale und Maschinen erzeugen Funklöcher.
- **Rückfallebene.** Legen Sie fest, was passiert, wenn das System ausfällt: wer entscheidet, welche Papierformulare genutzt werden, wie die Aufzeichnungen danach abgeglichen werden.
- **Bedenken wegen Überwachung.** Schrittbestätigungen und Zeitstempel lassen sich als individuelle Leistungsdaten lesen. Vereinbaren Sie die Datennutzung vor dem Go-live mit der Belegschaft und in Werken mit Gewerkschaft mit der Gewerkschaft. Der Parent-Pillar behandelt die [Regeln zur Mitarbeiterüberwachung](https://www.m365.fm/learn/shop-floor-management/) in den USA.
- **Jemand zum Fragen.** Halten Sie in den ersten Wochen je Linie einen Key User oder den Autor in der Produktion. Unsichere Werker greifen sonst wieder zum Papier oder zum Kollegen nebenan.
- **Werker als Autoren.** Lassen Sie erfahrene Werker Anweisungen entwerfen und fotografieren, mit Prüfung durch die Fertigungstechnik. Das verbessert Genauigkeit und Akzeptanz.

## Häufige Fehler

1. **Schlechtes Papier digitalisieren.** Wer 400 veraltete Anweisungen unverändert umstellt, trägt jeden Fehler ins neue System und bläht die Umstellungskosten auf.
2. **PDF auf einem Bildschirm und das papierlos nennen.** Stufe 1 spart Papier und wenig sonst.
3. **Kollaborationswerkzeuge für regulierte Aufzeichnungen.** Aufzeichnungen, die eine Predicate Rule verlangt, gehören in ein validiertes System mit Part-11-Kontrollen [1].
4. **Gemeinsame Terminal-Logins.** Sie zerstören die Zuordenbarkeit und die Signaturregeln [1][3].
5. **Kein Offline-Verfahren.** Der erste Netzausfall stoppt die Linie oder erzeugt nicht dokumentierte Arbeit.
6. **Freigegebene Anweisungen live bearbeiten.** Papierlos ohne Änderungslenkung ist schlechter als Papier.
7. **Business Case auf Papierkosten.** Druckeinsparungen bezahlen das Projekt selten.
8. **Bildschirme im Büro gestaltet.** Die Werker wurden nicht gefragt; sie behalten eine Papierkopie in der Tasche.
9. **Andon und Anweisungen ohne Verbindung.** Wer auf einen [Andon](https://www.m365.fm/learn/shop-floor-management/andon/)-Ruf reagiert, sollte die aktuelle Anweisung an der Station öffnen können.
10. **Kein Verantwortlicher für die Inhalte nach dem Go-live.** Anweisungen veralten so schnell wie auf Papier.

## FAQ: papierlose Fertigung

### Was ist papierlose Fertigung?

Der Ersatz von Arbeitsanweisungen, Laufzetteln, Checklisten und Produktionsaufzeichnungen auf Papier durch elektronische Dokumente und Aufzeichnungen, die am Arbeitsplatz genutzt und unterschrieben werden.

### Welche Vorteile hat eine papierlose Fabrik?

Aktuelle Revisionen an jeder Station, einmalige Datenerfassung an der Quelle, schnellere Prüfung der Aufzeichnungen, durchsuchbare Historie und weniger Fehler durch Abschreiben und veraltete Dokumente. Wie groß jeder Vorteil ist, hängt vom Werk ab; trennen Sie im Business Case harte von weichen Einsparungen.

### Was sind digitale Arbeitsanweisungen?

Schritt-für-Schritt-Anweisungen auf einem Bildschirm am Arbeitsplatz, mit Bildern oder Video, Schrittbestätigung und Rückmeldung, gelenkt über einen Freigabeprozess.

### Braucht man für 21 CFR Part 11 ein papierloses System?

Verlangen FDA-Vorschriften die elektronischen Aufzeichnungen oder Signaturen, gilt Part 11; für geschlossene Systeme verlangt die Regel Kontrollen wie Validierung, Zugriffsbeschränkung, Audit Trails, Ablauf- und Berechtigungsprüfungen und die Angaben auf der Signatur [1]. Der Leitfaden der FDA zu Anwendungsbereich und Anwendung erklärt, wie die FDA die Regel anwendet [2].

### Was ist ein elektronisches Chargenprotokoll?

Eine elektronische Fassung des Herstellungs- und Prüfprotokolls, das Arzneimittelhersteller für jede Charge führen müssen [4], meist mit erzwungener Reihenfolge und Prüfung nach Ausnahmen.

### Erlaubt AS9100 elektronische Aufzeichnungen?

AS9100D baut auf ISO 9001 auf [6], die gelenkte dokumentierte Information verlangt, kein bestimmtes Medium. Elektronische Aufzeichnungen sind in der Luftfahrt üblich; prüfen Sie Anforderungen an Aufbewahrung, Lesbarkeit und Auffindbarkeit im Normtext und in Ihren Kundenverträgen.

### Was kostet papierlose Fertigung?

Das hängt vom Umfang ab. Im Rechenbeispiel kostet eine Einführung mit 50 Stationen rund 464.000 USD einmalig und 146.000 USD pro Jahr, wobei die Umstellung der Inhalte ein großer und oft unterschätzter Posten ist. Holen Sie Angebote für Ihren Umfang ein.

### Wo sollte ein Werk anfangen?

Bei den Dokumenten, die bei Häufigkeit, Fehlerauswirkung, Änderungshäufigkeit und Datenwert am höchsten punkten, aber ein geringes regulatorisches Risiko tragen, meist Arbeitsanweisungen in der Montage mit hoher Variantenvielfalt.

### Wie wird eine Fertigung papierlos?

In Phasen: Dokumente erfassen und bewerten, Vorlagen, Änderungslenkung und ein Offline-Verfahren festlegen, an einer Linie mit einer festgelegten maßgeblichen Aufzeichnung pilotieren, Linie für Linie ausrollen und die Inhalte vor der Umstellung bereinigen, dann die Daten in den Stufenrunden nutzen. Der Fahrplan oben nennt typische Dauern und Abschlusskriterien je Phase.

### Ist papierlose Fertigung dasselbe wie ein MES?

Nein. Ein MES ist ein Weg zur papierlosen Fertigung, vor allem für erzwungene Ausführung und regulierte Aufzeichnungen. Digitale Arbeitsanweisungen, digitale Checklisten und Dokumentenmanagement können Papier auch ohne MES abschaffen. Wo das System einen falschen Schritt sperren oder eine As-built-Dokumentation aufbauen muss, ist ein MES meist das richtige Werkzeug; siehe [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant).

### Was passiert, wenn das Netz ausfällt?

Das muss vor dem Go-live festgelegt sein: zwischengespeicherte Anweisungen zum Lesen, Papier-Ersatzformulare für Aufzeichnungen und ein Abgleichverfahren.

## Fazit

Bei papierloser Fertigung geht es darum, die richtige, aktuelle Information vor den Werker zu bringen und das Geschehene einmal an der Quelle zu erfassen, in einer Form, der man vertrauen und die man auswerten kann. Die Reihenfolge zählt: Inhalte bereinigen, Anweisungen vor Aufzeichnungen digitalisieren, Änderungslenkung und Offline-Verfahren an einer Pilotlinie erproben und erst dann ausrollen.

Regulierte Werke müssen das Projekt als Änderung des Qualitätsmanagementsystems behandeln, mit Part-11-Kontrollen, Validierung und klarer Bedeutung der Signaturen. Jedes Werk sollte den Business Case auf Prüfzeit, Fehler und freigesetzte Kapazität stützen statt auf Druckkosten und ehrlich sagen, welche Einsparungen hart sind. So werden papierlose Dokumente zum Rückgrat, das [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/), [Andon](https://www.m365.fm/learn/shop-floor-management/andon/) und die täglichen Routinen des [Shop Floor Managements](https://www.m365.fm/learn/shop-floor-management/) verbindet.

## Weiterlesen auf m365.fm

**Parent-Pillar**
- [Shop Floor Management und Gemba Walks](https://www.m365.fm/learn/shop-floor-management/)

**Schwester-Cluster (geplant)**
- [Standardarbeit: Elemente, Formulare und ein Rechenbeispiel](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) (geplant)
- [Andon-System: Gestaltung, Eskalation und Reaktion](https://www.m365.fm/learn/shop-floor-management/andon/) (geplant)

**Verwandte Pillars (geplant; Links vor dem Go-live prüfen)**
- [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant)
- [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/)
- [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/)
- [OT-Security und IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant)
- [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)
- [Lean Management](https://www.m365.fm/learn/lean-management/)

**Begriffe**
[Shop Floor Management](https://www.m365.fm/entity/shop-floor-management/) · [Standardarbeit](https://www.m365.fm/entity/standard-work/)

---

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) in Stuttgart. Auf m365.fm schreibt er über Lean Management, Operational Excellence und die Digitalisierung der Fertigung mit Microsoft 365 und Azure.

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

*[Redaktion: Rolle, Werdegang und Profilfoto des Autors ergänzen.]*

---

# Quellen

Alle Quellen abgerufen am 20. November 2026.

1. 21 CFR Part 11, Electronic Records; Electronic Signatures (Abschnitte 11.3, 11.10, 11.50, 11.70, 11.200). Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11
2. U.S. Food and Drug Administration: Part 11, Electronic Records; Electronic Signatures – Scope and Application. Guidance for Industry, September 2003. https://www.fda.gov/regulatory-information/search-fda-guidance-documents/part-11-electronic-records-electronic-signatures-scope-and-application
3. U.S. Food and Drug Administration: Data Integrity and Compliance With Drug CGMP: Questions and Answers. Guidance for Industry, Dezember 2018. https://www.fda.gov/media/119267/download (Übersichtsseite: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/data-integrity-and-compliance-drug-cgmp-questions-and-answers)
4. 21 CFR 211.188, Batch production and control records. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-J/section-211.188
5. Quality Management System Regulation (QMSR). U.S. Food and Drug Administration. https://www.fda.gov/quality-systems-regulation
6. AS9100 Certification: Aerospace QMS. ANSI Blog (ANAB). https://blog.ansi.org/anab/as9100-certification-aerospace-qms/
7. ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
8. Standardized Work (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/standardized-work/
9. TWI Job Instruction (Programmseite). TWI Institute. https://www.twi-institute.com/programs/twi-job-instruction/
10. Weber, A.: Visual Work Instructions and the Paperless Factory. Assembly Magazine, 1. März 2014. https://www.assemblymag.com/articles/91946-visual-work-instructions-and-the-paperless-factory
11. 7.5.3 Control of Documented Information Explained (und 7.5 Documented Information). ISO 9001 Checklist (Erläuterung eines Beraters; Sekundärquelle). https://www.iso-9001-checklist.co.uk/7.5.3-control-of-documented-information-explained.htm (abgerufen am 20. November 2026)
12. Brunato, M.: ISO 9001:2026 published on September 16, 2026: what quality leaders need to know. NSF (Zertifizierungsstelle). https://www.nsf.org/knowledge-library/iso-90012026-published-on-september-16-2026-what-quality-leaders-need-to-know (abgerufen am 20. November 2026)

# Prüfhinweise für die Redaktion

Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.

## Herstellerangaben, [unbelegt]-Stellen und Punkte vor der Veröffentlichung

- **URL-Schema:** verschachtelte Cluster-URL (`/learn/shop-floor-management/papierlose-fertigung/`) laut Brief; mit dem CMS bestätigen.
- **Business Case:** alle Zahlen (160 Werker, 10 Minuten, 38 und 60 USD Stundensätze, 2,0 → 1,0 Prüferstellen zu 95.000 USD, 6 → 1 Fehler zu 12.000 USD, 18.000 USD Papierkosten, Geräte-, Netz-, Dienstleistungs-, Validierungs- und Abonnementkosten, 8 Prozent Kapitalkosten, 400.000 USD Fertigware je Tag, 10 → 4 Prüftage, 20 Prozent Lagerhaltungskosten) sind beispielhaft. USD bewusst beibehalten, keine Umrechnung.
- **Reifegradstufen 0–4, Priorisierungsmatrix, Dauern im Fahrplan, Hardware-Hinweise:** Praxiswerte und Faustregeln, keine belegten Benchmarks.
- **Assembly Magazine (2014) [10]:** Aussage zu Umstellungs- vs. Lizenzkosten ist ein Herstellerzitat (Dozuki) und als solches gekennzeichnet.
- **Part 11 [1], FDA-Leitfäden [2][3], 21 CFR 211.188 [4], QMSR [5]:** Zitate sinngemäß ins Deutsche übertragen; keine Rechtsberatung, Abschnitt von Regulatory Affairs freigeben lassen.
- **ISO 9001:2015 Abschnitt 7.5 / 7.5.3 [11]:** Sekundärquelle; der deutsche Normwortlaut (DIN EN ISO 9001) wurde nicht geprüft, die zitierten Formulierungen sind eigene Übertragungen [unbelegt als Normwortlaut]. IATF 16949 nicht geprüft.
- **ISA-95 [7]:** aus dem Parent-Pillar übernommen, für diesen Cluster nicht erneut geöffnet.
- **Inhaltsverzeichnis-Anker:** ASCII-Anker (ae/oe/ue); nach dem CMS-Import testen.
- **iFAKT:** im Text nicht erwähnt; Offenlegung nur in der Autorenbox.

## Für den deutschen Markt prüfen

- Mitarbeiterüberwachung durch Schrittbestätigungen und Zeitstempel: Der Text nennt Belegschaft und Gewerkschaft (US-Kontext). Für Deutschland Mitbestimmung des Betriebsrats (§ 87 Abs. 1 Nr. 6 BetrVG, technische Einrichtungen zur Leistungs- und Verhaltenskontrolle) und DSGVO/BDSG durch die Fachprüfung ergänzen lassen.
- Regulierte Branchen: Der Abschnitt beschreibt nur US-Regeln (FDA). Für deutsche Leser ggf. Hinweis auf EU-GMP-Leitfaden Annex 11 und EU-MDR prüfen lassen; nicht ohne Prüfung als Fakt einfügen.
- Archivierung: Aufbewahrungsfristen nach deutschem Recht (z. B. HGB/AO, GoBD) nur nach Fachprüfung ergänzen.

## Interne Links

- Parent-Pillar in den ersten 150 Wörtern, im Architektur-Abschnitt (digitales Board mit Microsoft 365), im Werker-Abschnitt (Regeln zur Mitarbeiterüberwachung), im Fazit und im Weiterlesen.
- Schwester-Cluster: Standardarbeit (Dokumententabelle, Fazit, Weiterlesen), Andon (Fehler 9, Fazit, Weiterlesen).
- Pillars im Text: mes-isa-95 (geplant), manufacturing-it-azure, ot-security-iec-62443 (geplant), produktionsplanung-luftfahrt. Weiterlesen ergänzt digital-twin, produktionskennzahlen, lean-management. Alle deutschen Ziel-URLs vor dem Go-live prüfen.

## JSON-LD-Vorschlag

TechArticle, FAQPage und BreadcrumbList wie in der englischen Fassung, mit `"inLanguage": "de-DE"`, `headline` "Papierlose Fertigung: Was zuerst digitalisieren, wie compliant bleiben und wie den Business Case rechnen", `url` https://www.m365.fm/learn/shop-floor-management/papierlose-fertigung/, `isPartOf` https://www.m365.fm/learn/shop-floor-management/, Breadcrumb Learn > Shop Floor Management > Papierlose Fertigung. FAQPage: alle 11 FAQ-Fragen wörtlich auf Deutsch (ohne Quellenmarker).

## Empfohlene Grafiken

1. Reifegradstufen 0 bis 4 als Treppe.
2. Dokumentenlandkarte (Papierdokument → digitale Entsprechung) als zweispaltige Grafik.
3. Wasserfalldiagramm zum Business Case: Nutzen, Kosten, Netto je Sicht (alle / hart plus Prüfung / nur hart).
4. ISA-95-Einordnung (ERP, PLM, papierlose Ebene, Maschinen, Analyse).

## hreflang

`de-DE` https://www.m365.fm/learn/shop-floor-management/papierlose-fertigung/ <-> `en-US` https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/
