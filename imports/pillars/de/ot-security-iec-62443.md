# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | OT-Security und IEC 62443: Leitfaden für die Produktion (55 Zeichen) |
| Meta-Description | OT-Security für Fertigungsunternehmen: ISA/IEC 62443 mit Zonen, Conduits, Security Levels, Praxisbeispiel, Fahrplan, Kennzahlen und FAQ. (136 Zeichen) |
| Slug | `/learn/ot-security-iec-62443/` (vollständige URL: https://www.m365.fm/learn/ot-security-iec-62443/) |
| Hauptkeyword | OT-Security; IEC 62443 (ISA/IEC 62443) |
| Nebenkeywords | OT-Sicherheit, OT Security, Cybersecurity Produktion, Industrial Security, ICS-Security, IACS, IEC 62443 einfach erklärt, IEC 62443 Zonen und Conduits, IEC 62443 Security Level, SL 1 bis SL 4, Foundational Requirements, IEC 62443-3-2 Risikobewertung, IEC 62443-3-3, IEC 62443-4-1, IEC 62443-4-2, IEC 62443-2-1, ISASecure, Purdue-Modell, industrielle DMZ, OT-Asset-Inventar, Netzwerksegmentierung OT, Fernwartung absichern, OT-Patchmanagement, OT-Incident-Response, NIST SP 800-82, NIST CSF 2.0, MITRE ATT&CK for ICS, IT- vs. OT-Security, NIS2 Produktion, Cyber Resilience Act Maschinenbau |
| Suchintention | Informational mit starker praktischer Absicht: Werksleitung, Automatisierungstechnik, IT-Sicherheit, Einkauf und Controlling wollen verstehen, was OT-Security und IEC 62443 verlangen, wie man Zonen und Security Levels auf ein reales Werk anwendet, was zuerst zu tun ist, was es kostet und welche Pflichten in den USA und der EU gelten |
| Wortzahl | 16.143 Wörter H1 bis Fazit inkl. Tabellen, Glossar und FAQ (`wc -w`; englische Fassung: 17.037) |
| Sprachversion | Deutsch (`de-DE`). hreflang-Paar: `de-DE` https://www.m365.fm/learn/ot-security-iec-62443/ <-> `en-US` https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter, Suchbegriffe "OT-Security", "IEC 62443", "OT-Sicherheit Produktion") noch aus.

---

# OT-Security und ISA/IEC 62443: ein Praxisleitfaden für Fertigungsunternehmen

*Stand: November 2026 · Lesezeit: etwa 50 Minuten (Schnelleinstieg: Kurzantwort, Kasten "Das Wichtigste in Kürze", das Zonenbeispiel und der Fahrplan)*

> **Kurzantwort:** OT-Security (Sicherheit der Betriebstechnik, Operational Technology) schützt die Systeme, die die physische Produktion steuern, etwa SPS, SCADA, HMIs, Roboter, Antriebe und Sicherheitssysteme, damit ein Werk sicher und verfügbar bleibt und Gutteile produziert. Die internationale Referenz dafür ist die Normenreihe ISA/IEC 62443: Sie weist Betreibern, Integratoren und Produktherstellern Pflichten zu, gruppiert Assets in Zonen, die über Conduits verbunden sind, legt je Zone ein Ziel-Security-Level (SL 1 bis 4) fest und prüft jede Zone gegen sieben grundlegende Anforderungen [1][2]. In den USA wird sie meist mit dem NIST Cybersecurity Framework 2.0 und NIST SP 800-82 kombiniert [9][11].

> **Das Wichtigste in Kürze**
> - In der OT stehen Verfügbarkeit und Sicherheit an erster Stelle. Eine Firewallregel oder ein Patch, der eine Linie stoppt, kann mehr Schaden anrichten als der Angriff, den er verhindern sollte.
> - ISA/IEC 62443 ist eine Normenreihe, kein einzelnes Dokument. Die Teile 2-1 (Security-Programm), 3-2 (Risikobewertung und Zonen), 3-3 (Systemanforderungen), 4-1 und 4-2 (Anforderungen an Hersteller) leisten im Werk den Großteil der Arbeit [1].
> - Die Kernmethode lässt sich einfach beschreiben: Assets erfassen, in Zonen gruppieren, die Conduits zwischen den Zonen festlegen, je Zone ein Ziel-Security-Level setzen und die Lücke zwischen Ziel- und erreichtem Level schließen [2].
> - Die meisten Produktionsstillstände in den dokumentierten Fällen begannen in der Büro-IT, nicht in den Steuerungen. Colonial Pipeline, Norsk Hydro und Clorox haben nach Angriffen auf ihre IT-Umgebungen den Betrieb eingestellt oder gedrosselt [17][20][35].
> - Ein praxistaugliches erstes Jahr für ein mittelgroßes Werk: Asset-Inventar, ein Zonen- und Conduit-Modell, eine segmentierte industrielle DMZ, kontrollierter Fernzugriff, Offline-Backups und ein geübtes OT-Incident-Playbook. Angriffserkennung und Lieferantenanforderungen folgen im zweiten Jahr.
> - NIST SP 800-82 Rev. 3 (2023) ist der aktuelle US-Leitfaden für OT-Security; NIST hat am 21. September 2026 den ersten öffentlichen Entwurf von Rev. 4 veröffentlicht, neu aufgebaut entlang des CSF 2.0, Kommentierung bis 30. November 2026 [9][10].
> - Zertifizierungen gibt es für Produkte (ISASecure CSA, SSA, SDLA) und seit Juni 2025 auch für Betriebsstandorte (ISASecure ACSSA, auf Basis von 62443-2-1, 2-4, 3-2 und 3-3) [7][8].
> - Das Programm wie die Instandhaltung budgetieren: eine stabile jährliche Position mit klaren Kennzahlen, kein einmaliges Projekt.

## Inhaltsverzeichnis

1. [Was ist OT-Security?](#was-ist-ot-security)
2. [IT- vs. OT-Security: warum das Büro-Regelwerk in der Fertigung scheitert](#it--vs-ot-security-warum-das-büro-regelwerk-in-der-fertigung-scheitert)
3. [Was Werke wirklich stoppt: Vorfälle und Angriffsmuster](#was-werke-wirklich-stoppt-vorfälle-und-angriffsmuster)
4. [Die Landschaft der Rahmenwerke: 62443, NIST, CISA, CMMC, NIS2 und der CRA](#die-landschaft-der-rahmenwerke-62443-nist-cisa-cmmc-nis2-und-der-cra)
5. [ISA/IEC 62443 erklärt: Aufbau, Rollen und Stand](#isaiec-62443-erklärt-aufbau-rollen-und-stand)
6. [Grundlegende Anforderungen, Security Levels und Reifegrade](#grundlegende-anforderungen-security-levels-und-reifegrade)
7. [Zonen und Conduits und das Purdue-Modell](#zonen-und-conduits-und-das-purdue-modell)
8. [Die Risikobewertung nach 62443-3-2 Schritt für Schritt](#die-risikobewertung-nach-62443-3-2-schritt-für-schritt)
9. [Praxisbeispiel: Zonen und Conduits für ein mittelgroßes Werk](#praxisbeispiel-zonen-und-conduits-für-ein-mittelgroßes-werk)
10. [OT-Asset-Inventar](#ot-asset-inventar)
11. [Netzwerksegmentierung und die industrielle DMZ](#netzwerksegmentierung-und-die-industrielle-dmz)
12. [Sicherer Fernzugriff für Lieferanten und Techniker](#sicherer-fernzugriff-für-lieferanten-und-techniker)
13. [Patch- und Schwachstellenmanagement in der OT](#patch--und-schwachstellenmanagement-in-der-ot)
14. [Konten, Härtung und Wechseldatenträger](#konten-härtung-und-wechseldatenträger)
15. [Überwachung und Angriffserkennung](#überwachung-und-angriffserkennung)
16. [Backup, Wiederherstellung und OT-Incident-Response](#backup-wiederherstellung-und-ot-incident-response)
17. [Anforderungen an Lieferanten und Einkauf](#anforderungen-an-lieferanten-und-einkauf)
18. [Mensch, Sicherheit und Shopfloor](#mensch-sicherheit-und-shopfloor)
19. [Pflichten in den USA und der EU: CMMC, SEC, CIRCIA, NIS2 und der CRA](#pflichten-in-den-usa-und-der-eu-cmmc-sec-circia-nis2-und-der-cra)
20. [Ein Fahrplan für 12 bis 24 Monate](#ein-fahrplan-für-12-bis-24-monate)
21. [Budget und ROI: die Investition begründen](#budget-und-roi-die-investition-begründen)
22. [OT-Security-Kennzahlen](#ot-security-kennzahlen)
23. [Typische Fehler](#typische-fehler)
24. [Grenzen der IEC 62443 und von OT-Security-Programmen](#grenzen-der-iec-62443-und-von-ot-security-programmen)
25. [Glossar](#glossar)
26. [FAQ](#faq-ot-security-und-iec-62443)
27. [Fazit](#fazit)

**Wer welchen Teil lesen sollte**

| Leser | Einstieg |
|---|---|
| Werksleitung oder Leitung Produktion | Abschnitte 1 bis 3, 9, 16, 20 und 21 |
| Automatisierungs- oder Steuerungstechnik | Abschnitte 5 bis 15 |
| IT- oder Security-Verantwortliche, neu in der OT | Abschnitte 2, 7, 11 bis 15 |
| Einkauf und Lieferantenqualität | Abschnitt 17 |
| CFO oder Werkscontroller | Abschnitte 3, 21 und 22 |
| Rüstungszulieferer oder Unternehmen mit EU-Standorten | Abschnitt 19 |

## Was ist OT-Security?

Operational Technology (OT, Betriebstechnik) ist die Hard- und Software, die physische Prozesse überwacht und steuert. NIST beschreibt OT als "a broad range of programmable systems and devices that interact with the physical environment" (ein breites Spektrum programmierbarer Systeme und Geräte, die mit der physischen Umgebung interagieren) und nennt als Beispiele industrielle Steuerungssysteme, Gebäudeautomation, Verkehrssysteme, physische Zutrittskontrolle und Umweltüberwachung [9]. In einer Fabrik heißt das: die speicherprogrammierbaren Steuerungen (SPS, englisch PLC) einer Presslinie, das Prozessleitsystem (PLS, englisch DCS) einer Lackiererei, der SCADA-Server für die Medienversorgung, die Bedienoberflächen (HMIs) an den Stationen, Robotersteuerungen, Antriebe, Bildverarbeitungssysteme, die Engineering-Workstations, mit denen all das programmiert wird, und die sicherheitstechnischen Systeme (SIS), die den Prozess in einen sicheren Zustand bringen.

OT-Security ist die Gesamtheit aus Richtlinien, technischen Maßnahmen und Routinen, die verhindern, dass diese Systeme gestört, manipuliert oder als Weg in den Rest des Unternehmens genutzt werden. Das Ziel unterscheidet sich von klassischer IT-Sicherheit. Im Büro lautet die erste Frage meist: "Sind die Daten vertraulich?" Auf dem Shopfloor lauten die ersten Fragen: "Kann sich jemand verletzen?" und "Läuft die Linie weiter und produziert sie Gutteile?"

### OT, ICS, IACS, SCADA: die Begriffe sortiert

Das Fachgebiet verwendet mehrere sich überschneidende Begriffe. Sie sind wichtig, weil die Normen sie präzise verwenden.

| Begriff | Bedeutung | Wo man ihm begegnet |
|---|---|---|
| OT (Operational Technology) | Oberbegriff für Systeme, die mit der physischen Welt interagieren | NIST SP 800-82 Rev. 3 verwendet ihn im Titel [9] |
| ICS (Industrial Control System) | Steuerungssysteme in der Industrie: SPS, PLS, SCADA und ihre Netze | ältere NIST- und CISA-Dokumente, MITRE ATT&CK for ICS [15] |
| IACS (Industrial Automation and Control System) | der Begriff der ISA/IEC 62443: Menschen, Hardware, Software und Richtlinien, die am Betrieb eines industriellen Prozesses beteiligt sind | alle Teile der 62443 [1][2] |
| SCADA | übergeordnete Überwachung und Steuerung verteilter Standorte (Pipelines, Versorger, Wasser) | Versorger, werksweite Energiesysteme |
| DCS (PLS) | Prozessleitsystem, typisch in kontinuierlichen Prozessanlagen | Chemie, Lebensmittel, Pharma, Lackierereien |
| PLC (SPS) | speicherprogrammierbare Steuerung, das Arbeitspferd der diskreten Fertigung | Maschinen, Fördertechnik, Montagelinien |
| SIS | sicherheitstechnisches System; führt Sicherheitsfunktionen aus | Prozesssicherheit, Pressen, Brenner |
| IIoT | Industrial Internet of Things: Sensoren und Geräte, die Daten an Edge- oder Cloud-Plattformen senden | Predictive Maintenance, Energiemonitoring; IEC PAS 62443-1-6 [5] |

In der Praxis werden "OT-Security", "OT-Cybersecurity", "ICS-Security" und "Industrial Security" gleichbedeutend verwendet. Dieser Leitfaden nutzt "OT-Security" für die Disziplin und "IACS", wenn es um das geht, was die 62443 verlangt.

### Warum die Fertigung überhaupt betroffen ist

Viele Werksleiter gehen noch davon aus, dass Cyberangriffe ein IT-Problem sind und ihre Maschinen "air-gapped", also physisch getrennt, sind. In den meisten Werken stimmt das seit Jahren nicht mehr. MES, Historians, ERP-Schnittstellen, Fernwartung der Maschinenbauer, Cloud-Dashboards und IIoT-Sensoren verbinden den Shopfloor mit dem Unternehmen und dem Internet. Die US-Behörde CISA führt die kritische Fertigung (Primärmetalle, Maschinen, elektrische Ausrüstung und Transportausrüstung) als Sektor der kritischen Infrastruktur der USA, mit dem Department of Homeland Security als zuständiger Behörde für das Sektorrisikomanagement [32]; üblicherweise wird er als einer von 16 Sektoren gezählt [unbelegt: die zitierte CISA-Seite nennt die Anzahl nicht].

Was ein stehendes Werk kostet, versteht jeder, der eines geführt hat. Jede Stunde Stillstand kostet Deckungsbeitrag, Überstunden zum Aufholen, Ausschuss aus unterbrochenen Chargen, Eilfrachtkosten und schlimmstenfalls Vertragsstrafen. Die Fälle in Abschnitt 3 zeigen, dass Angreifer das wissen. Ransomware-Gruppen müssen keine SPS verstehen, um die Produktion zu stoppen; es reicht, die Systeme zu verschlüsseln, ohne die das Werk nicht laufen kann.

Mehr zur Datenseite des Werks bieten die Leitfäden [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant) und [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/), die beschreiben, wie Werksdaten in Unternehmens- und Cloud-Systeme gelangen. Jede dieser Verbindungen ist ein Conduit im Sinne der 62443.

## IT- vs. OT-Security: warum das Büro-Regelwerk in der Fertigung scheitert

IT- und OT-Security nutzen viele gleiche Werkzeuge: Firewalls, Konten, Protokollierung, Backups. Aber Systeme, Prioritäten und Folgen unterscheiden sich so stark, dass das Übertragen des Büro-Regelwerks auf den Shopfloor zu Ausfällen führt. Der Quick Start Guide der ISAGCA fasst die Priorität im Werk in einem Begriff zusammen: die **essenziellen Funktionen** (Essential Functions), die aufrechterhalten werden müssen, "to maintain health, safety, the environment, and availability of the Equipment Under Control" (um Gesundheit, Sicherheit, Umwelt und Verfügbarkeit der gesteuerten Anlage zu erhalten). Er nennt die Sicherheitsfunktion, die Steuerungsfunktion und die Fähigkeit des Bedieners, die Anlage zu sehen und zu bedienen; fallen sie aus, gehen Schutz, Kontrolle oder Sicht verloren [2].

| Aspekt | Typische Büro-IT | Typische Werks-OT |
|---|---|---|
| Höchste Priorität | Vertraulichkeit und Integrität der Daten | Sicherheit, Verfügbarkeit und Integrität des Prozesses; Vertraulichkeit zählt, kommt aber meist später |
| Folge eines Ausfalls | Datenverlust, Bußgelder, Rufschaden | Verletzungen, Umweltfreisetzung, Anlagenschäden, Ausschuss, verlorene Ausbringung |
| Lebensdauer der Systeme | 3 bis 5 Jahre für Laptops und Server | 15 bis 25 Jahre für Steuerungen und Maschinen sind in der Praxis üblich [Praxiswert, als Branchenstatistik unbelegt] |
| Änderungsfenster | nachts oder wöchentlich | geplante Stillstände, manchmal ein- oder zweimal im Jahr |
| Patchen | automatisiert, monatlich | erst nach Herstellerfreigabe und Test; manche Geräte lassen sich gar nicht patchen |
| Neustarts | akzeptabel | ein Neustart kann eine Linie stoppen oder eine Charge verderben |
| Protokolle | authentifiziert, verschlüsselt (HTTPS, Kerberos) | viele ältere Industrieprotokolle wurden ohne Authentifizierung oder Verschlüsselung entworfen |
| Virenschutz und Agenten | Standard auf jedem Endgerät | vom Hersteller des HMI oder der Steuerung oft nicht unterstützt; Allowlisting ist sicherer |
| Performance | Verzögerungen von Sekunden sind lästig | Verzögerungen von Millisekunden können einen Prozess auslösen |
| Zuständigkeit | IT-Abteilung | Instandhaltung, Automatisierungstechnik, Produktion, oft der Maschinenbauer |
| Wer Änderungen vornimmt | Administratoren | Techniker, Integratoren, Hersteller, manchmal Bediener |

### Was das in der Praxis bedeutet

Aus der Tabelle folgen drei Regeln.

1. **Kein aktives Scannen von Steuerungen ohne Test.** Ein Schwachstellenscanner, der auf einem Dateiserver harmlos ist, kann eine ältere SPS oder ein HMI zum Absturz bringen. Die Asset-Erkennung in der OT beginnt passiv (Mithören des Netzwerkverkehrs) oder nutzt die Engineering-Werkzeuge des Herstellers.
2. **Security-Änderungen brauchen die Freigabe der Produktion.** Jede Firewallregel, Kontoänderung oder jeder Patch in einer Zone mit essenziellen Funktionen durchläuft das Änderungsmanagement (Management of Change, MOC), genau wie eine Änderung an einem Rezept oder einer Sicherheitsverriegelung.
3. **Die kompensierende Maßnahme ist der Normalfall.** Wenn ein HMI mit Windows 7 erst beim nächsten Linienumbau ersetzt werden kann, schützt man es, indem man es in eine kleine Zone legt, seine Conduits einschränkt, den USB-Zugang entfernt und seinen Datenverkehr beobachtet. Eine kompensierende Maßnahme in dieser Lage zu akzeptieren, ist genau das, was die Methode der 62443 vorsieht.

### Wo IT und OT zusammenarbeiten müssen

Der umgekehrte Fehler ist, OT-Security zur Werksangelegenheit zu erklären, aus der sich die IT heraushalten soll. Die Vorfälle im nächsten Abschnitt zeigen, dass Angreifer oft über Identitätssysteme, E-Mail oder Helpdesks eindringen, die die IT betreibt. Ein wirksames Programm hat einen Risikoverantwortlichen auf Standortebene, ein gemeinsames Team aus IT-Security und Automatisierungstechnik und klar zugeordnete Verantwortlichkeiten für jede Zone. Die Rollentabelle in Abschnitt 18 zeigt eine Möglichkeit der Aufteilung.

## Was Werke wirklich stoppt: Vorfälle und Angriffsmuster

Die folgenden dokumentierten Fälle sollen niemandem Angst machen. Sie zeigen, wo Angriffe eindrangen, warum die Produktion stand und was bei der Wiederherstellung half. Jede Zahl stammt aus einer Primärquelle oder einer seriösen Sekundärquelle; wo ein Unternehmen nie eine Zahl veröffentlicht hat, steht das in der Tabelle.

| Vorfall | Was geschah | Wirkung auf den Betrieb | Veröffentlichte Zahlen | Lehre für die OT-Security |
|---|---|---|---|---|
| NotPetya bei Merck (Juni 2017) | Zerstörerische Schadsoftware verbreitete sich weltweit über ein kompromittiertes Update einer ukrainischen Buchhaltungssoftware | Mehr als 40.000 Merck-Computer beschädigt [18] | Merck forderte 1,4 Mrd. USD von Versicherern; im Mai 2023 entschied ein Berufungsgericht in New Jersey, dass der Kriegsausschluss nicht greift; die Parteien einigten sich im Januar 2024 zu nicht veröffentlichten Bedingungen [18] | Ein flaches Netz lässt Schadsoftware bis zu den Produktionssystemen; eine Versicherung ersetzt keine Wiederherstellungsfähigkeit |
| Norsk Hydro (März 2019) | Ein Ransomware-Angriff traf in den frühen Morgenstunden des 19. März 2019 die gesamte globale Organisation | Extruded Solutions erlitt die größten operativen Verluste; andere Geschäftsbereiche produzierten mit "labor-intensive workarounds and manual procedures" (arbeitsintensiven Behelfslösungen und manuellen Verfahren) annähernd normal weiter [17] | Hydro schätzte die Gesamtkosten auf etwa 800 Mio. NOK [17] | Manuelle Rückfallverfahren und offene Kommunikation verkürzten die Krise |
| Colonial Pipeline (Mai 2021) | Ransomware-Angriff der Gruppe DarkSide am oder um den 7. Mai 2021 | Der Pipelinebetrieb wurde eingestellt [35] | Colonial zahlte etwa 75 Bitcoin; das US-Justizministerium beschlagnahmte 63,7 Bitcoin, damals etwa 2,3 Mio. USD wert [16] | Ein Ransomware-Vorfall führte zur Abschaltung eines physischen Betriebs. Der CEO von Colonial sagte vor dem US-Senat aus, dass die Angreifer IT-Systeme verschlüsselten und das Unternehmen das gesamte System abschaltete, um eine Ausbreitung der Schadsoftware ins OT-Netz zu verhindern, weil Ursprung und Ausmaß unbekannt waren [36] |
| Clorox (August 2023) | Am 11. August 2023 erschlichen sich Angreifer durch Anrufe beim ausgelagerten IT-Helpdesk das Zurücksetzen von Zugangsdaten und MFA [20] | Clorox stoppte die Fertigung und stellte auf manuelle Auftragsabwicklung um; das Absatzvolumen sank in den sechs Monaten nach dem Angriff um 6 % [20] | Die Klage von Clorox gegen Cognizant (Juli 2025) fordert 380 Mio. USD Schadenersatz, darunter 49 Mio. USD Kosten der Schadensbeseitigung; Clorox hat 100 Mio. USD Versicherungsleistungen gemeldet; Cognizant bestreitet die Haftung [19][20] | Identitäts- und Helpdesk-Prozesse gehören zur OT-Security; ein Social-Engineering-Anruf kann ein Werk stoppen |
| Jaguar Land Rover (August/September 2025) | Cyberangriff, der die Fahrzeugproduktion stoppte | Die Produktionslinien standen mehrere Wochen still; das britische Cyber Monitoring Centre zählte mehr als 5.000 betroffene Organisationen in Großbritannien [21] | Das Cyber Monitoring Centre schätzte die finanziellen Auswirkungen für Großbritannien auf 1,9 Mrd. GBP (etwa 2,55 Mrd. USD) [21] | Eng gekoppelte Lieferketten übertragen den Ausfall eines einzelnen Werks auf Tausende von Zulieferern |

### Muster hinter den Fällen

Nebeneinander gelesen zeigen die Fälle vier Muster, die den Rest dieses Leitfadens prägen.

- **Eintritt über die IT, Wirkung in der OT.** In keinem der fünf Fälle beschreiben die zitierten Quellen einen direkten Angriff auf Steuerungen. Der Betrieb stand, weil gemeinsame Netze, gemeinsame Identitäten oder abhängige Geschäftssysteme ausfielen. Deshalb stehen die Zonengrenze zwischen Unternehmen und Werk (die industrielle DMZ) und eine saubere Identitätsverwaltung oben im Fahrplan.
- **Vom Betreiber eingeleitete Abschaltungen.** Clorox nahm Systeme vom Netz und stoppte die Fertigung, nachdem das Eindringen entdeckt worden war, und wickelte Aufträge danach manuell ab [20]; die Pipeline von Colonial wurde nach dem Ransomware-Angriff abgeschaltet [35]. Ein Werk, das weiß, von welchen Geschäftssystemen es abhängt, und in einem eingeschränkten Modus laufen kann, hat mehr Optionen.
- **Wiederherstellung dauert Wochen.** Selbst gut vorbereitete Unternehmen brauchten Wochen, um die normale Ausbringung wiederherzustellen. Backups, neu aufgesetzte Engineering-Workstations und geprüfte Steuerungslogik entscheiden, wie lang die Lücke ist.
- **Dritte gehören zur Angriffsfläche.** Software-Updates (NotPetya), ausgelagerte Helpdesks (Clorox) und Integratoren (siehe das Merkblatt von CISA und FBI in Abschnitt 12) tauchen alle in den Fällen auf [14][18][20].

### Angriffe auf Steuerungen

Angriffe, die den industriellen Prozess selbst manipulieren, sind seltener, aber es gibt sie, und sie sind der Grund, warum es in der 62443 die Security Levels 3 und 4 gibt. MITRE pflegt mit ATT&CK for ICS eine öffentliche Wissensbasis über das Verhalten von Angreifern gegen industrielle Steuerungssysteme. Ihre Matrix (Inhaltsversion 20.1) gruppiert Techniken in 12 Taktiken, von Initial Access über Inhibit Response Function und Impair Process Control bis Impact [15]. Zwei Taktiken sind OT-spezifisch: **Inhibit Response Function** (verhindern, dass Sicherheits- und Schutzfunktionen reagieren) und **Impair Process Control** (die Steuerung des Prozesses manipulieren) [15].

Für Verteidiger ist ATT&CK for ICS auf drei Arten nützlich:

1. Als Checkliste für die Erkennung: Welche Techniken könnte die eigene Überwachung sehen?
2. Als gemeinsames Vokabular von IT-Security-Analysten und Automatisierungstechnikern.
3. Als Eingabe für die Bedrohungsszenarien in der Risikobewertung nach 62443-3-2 (Abschnitt 8).

Dieser Leitfaden bleibt auf der Seite der Verteidigung. Er beschreibt nicht, wie eine Technik ausgeführt wird.

## Die Landschaft der Rahmenwerke: 62443, NIST, CISA, CMMC, NIS2 und der CRA

US-Fertigungsunternehmen stehen vor einem dichten Feld von Rahmenwerken. Sie konkurrieren weniger, als es scheint; sie beantworten unterschiedliche Fragen.

| Rahmenwerk | Herausgeber | Beantwortete Frage | Verbindlich? | Stand (November 2026) |
|---|---|---|---|---|
| Normenreihe ISA/IEC 62443 | ISA (Komitee ISA99) und IEC | Wie sichern Betreiber, Integratoren und Hersteller ein IACS über seinen Lebenszyklus? | freiwillig; wird verbindlich über Verträge, Kundenanforderungen oder Aufsichtsbehörden | Kernteile veröffentlicht; mehrere in Überarbeitung (Abschnitt 5) [1][6] |
| NIST Cybersecurity Framework (CSF) 2.0 | NIST | Wie steuert und managt die Organisation das Cyberrisiko insgesamt? | freiwillig | veröffentlicht am 26. Februar 2024; sechs Funktionen: Govern, Identify, Protect, Detect, Respond, Recover [11] |
| NIST SP 800-82 Rev. 3, Guide to OT Security | NIST | Wie passen OT-Architekturen, Bedrohungen und Gegenmaßnahmen in ein US-Kontrollrahmenwerk? | freiwillig (Referenz für US-Bundesbehörden) | endgültig September 2023; erster öffentlicher Entwurf von Rev. 4 am 21. September 2026 [9][10] |
| NIST IR 8183 Rev. 2, CSF 2.0 Manufacturing Profile | NIST | Welche CSF-Ergebnisse zählen für Fertigungsunternehmen am meisten? | freiwillig | erster öffentlicher Entwurf am 29. September 2025 [12] |
| CISA Cybersecurity Performance Goals (CPGs) 2.0 | CISA | Was ist eine messbare Grundlinie für kritische Infrastruktur? | freiwillig | CPG 2.0 veröffentlicht am 10. Dezember 2025, mit neuer Governance-Komponente [13] |
| CMMC 2.0 | US-Verteidigungsministerium | Schützt ein Rüstungsauftragnehmer FCI und CUI? | vertraglich bei Aufträgen des US-Verteidigungsministeriums | Programmregel in Kraft seit 16. Dezember 2024; DFARS-Regel seit 10. November 2025, stufenweise Einführung [28][29] |
| SEC-Regeln zur Offenlegung von Cybervorfällen | US-Börsenaufsicht SEC | Wann und wie müssen börsennotierte Unternehmen wesentliche Vorfälle offenlegen? | Pflicht für bei der SEC registrierte Unternehmen | verabschiedet am 26. Juli 2023 [26] |
| CIRCIA | CISA | Wann müssen erfasste Betreiber kritischer Infrastruktur Vorfälle melden? | Pflicht, sobald die endgültige Regel in Kraft tritt | endgültige Regel seit 1. Oktober 2026 zur Prüfung im Weißen Haus, Stand 9. November 2026 noch nicht veröffentlicht [27][39] |
| NIS2-Richtlinie | Europäische Union (Gesetze der Mitgliedstaaten) | Welche wesentlichen und wichtigen Einrichtungen in der EU müssen Cyberrisiken managen und Vorfälle melden? | Pflicht für erfasste Einrichtungen in der EU | deutsches Umsetzungsgesetz in Kraft seit 6. Dezember 2025 [24] |
| Cyber Resilience Act (CRA) | Europäische Union | Welche Sicherheitsanforderungen müssen Produkte mit digitalen Elementen auf dem EU-Markt erfüllen? | Pflicht für Produkte, die auf dem EU-Markt in Verkehr gebracht werden | Meldepflichten seit 11. September 2026 [22] |

### Wie die Teile zusammenpassen

Eine praktikable Kombination für ein US-Fertigungsunternehmen sieht so aus:

- **CSF 2.0 für Governance und Aufsichtsgremium.** Es gibt Management, Prüfern, Versicherern und Kunden eine gemeinsame Sprache. Die neue Funktion Govern umfasst Rollen, Risikobereitschaft und Lieferantenrisiko [11].
- **62443 für die Werksarchitektur und die Lieferkette.** Es ist das einzige Rahmenwerk in der Tabelle, das Betreibern, Integratoren und Herstellern konkrete Pflichten zuweist und Zonen, Conduits und Security Levels definiert [1][2].
- **SP 800-82 als Brücke.** Es übersetzt OT-Besonderheiten in die NIST-Kontrollwelt. Der Entwurf von Rev. 4 ist entlang des CSF 2.0 neu aufgebaut und ergänzt Hinweise zu Asset-Management, Netzwerküberwachung und Zero-Trust-Prinzipien für Systemverwaltungsfunktionen [10].
- **CPGs als Plausibilitätsprüfung.** Sie sind kurz und messbar; nützlich für eine schnelle Grundlinie, bevor das vollständige 62443-Programm beginnt [13].
- **CMMC, SEC, CIRCIA, NIS2 und der CRA** nur dort, wo sie zutreffen (Abschnitt 19).

Das NIST Manufacturing Extension Partnership (MEP) unterstützt kleine und mittlere US-Fertiger bei CSF-basierten Selbstbewertungen, Lückenanalysen und Incident-Response-Plänen [30]. Für viele Werke mit weniger als 500 Beschäftigten ist das in den USA der günstigste Einstieg.

## ISA/IEC 62443 erklärt: Aufbau, Rollen und Stand

### Woher die Norm kommt

Die International Society of Automation (ISA) richtete 2002 ihr Komitee ISA99 ein, um Cybersecurity-Normen für Automatisierungs- und Steuerungssysteme zu schreiben. Um 2010 begann das Komitee eng mit der International Electrotechnical Commission (IEC) zusammenzuarbeiten, und die Dokumente wurden als ISA/IEC 62443 neu nummeriert [3]. Die ISA-Dokumente erscheinen als ANSI/ISA-62443-x-y; die IEC veröffentlicht denselben Inhalt als IEC 62443-x-y. Laut ISA wird die Reihe von den Vereinten Nationen unterstützt, und die IEC hat sie 2021 zur horizontalen Norm erklärt, das heißt, sie gilt branchenübergreifend und nicht nur für eine Industrie [1].

Für US-Leser ist der praktische Punkt, dass die ANSI/ISA-Ausgaben bei der ISA und die IEC-Ausgaben im IEC-Webstore erhältlich und technisch aufeinander abgestimmt sind. Daten und Ausgabennummern unterscheiden sich zwischen beiden Herausgebern manchmal; in Verträgen deshalb immer die genaue Ausgabe zitieren.

### Die vier Dokumentgruppen

Die Reihe ist in vier Gruppen gegliedert [1][2]:

1. **Allgemeines (1-x):** Terminologie, Konzepte, Modelle, Metriken.
2. **Richtlinien und Verfahren (2-x):** was der Betreiber und Dienstleister als Organisation tun müssen.
3. **System (3-x):** Risikobewertung, Zonen und Conduits sowie technische Anforderungen an die gesamte Automatisierungslösung.
4. **Komponente (4-x):** sichere Entwicklungsprozesse und technische Anforderungen an einzelne Produkte.

### Die Teile und ihr Stand

Die Tabelle verbindet den ISA-Katalog [1], den IEC-Webstore [4][5] und eine Sekundärübersicht [3]. Stand November 2026.

| Teil | Titel (kurz) | Hauptzielgruppe | Aktuelle Ausgabe (ISA / IEC) | Hinweis zum Stand |
|---|---|---|---|---|
| 1-1 | Terminologie, Konzepte und Modelle | alle | ISA-62443-1-1 (2007); IEC TS 62443-1-1 (2009) | zweite Ausgabe seit Langem in Vorbereitung [3] |
| 1-5 | Schema für 62443-Security-Profile | Branchengremien, Hersteller | IEC TS 62443-1-5 (2023) [3] | Profile für bestimmte Branchen |
| 1-6 | Anwendung der 62443-Reihe auf das IIoT | Betreiber, Dienstleister | IEC PAS 62443-1-6 (19. Dezember 2025) [5] | PAS, wird nach vier Jahren automatisch zurückgezogen [5] |
| 2-1 | Anforderungen an das Security-Programm von IACS-Betreibern | Betreiber | ANSI/ISA-62443-2-1 (2024) [1]; IEC 62443-2-1 Ed. 2.0 (2024) [3] | zweite Ausgabe; die zentrale Norm für Betreiber |
| 2-2 | IACS Security Protection Scheme | Betreiber | ISA-TR62443-2-2 (2025) [1]; IEC PAS 62443-2-2 (11. März 2025) [4] | Leitfaden zum Betrieb eines Security Protection Scheme |
| 2-3 | Patchmanagement in der IACS-Umgebung | Betreiber, Hersteller | ISA-TR62443-2-3 (2015) [1] | Technischer Bericht |
| 2-4 | Anforderungen an das Security-Programm von IACS-Dienstleistern | Integratoren, Instandhaltungsdienstleister | ANSI/ISA-62443-2-4 (2018) [1]; IEC 62443-2-4 Ed. 2.0 (Dezember 2023) [3] | Grundlage für Integratorverträge |
| 3-1 | Security-Technologien für IACS | alle | ISA-TR99.00.01 (2007) [1]; IEC TR 62443-3-1 (2009) [3] | Technologieüberblick, veraltet |
| 3-2 | Security-Risikobewertung für den Systementwurf | Betreiber, Integratoren | ANSI/ISA-62443-3-2 (2020) [1] | zweite Ausgabe in Arbeit [6] |
| 3-3 | System-Security-Anforderungen und Security Levels | Integratoren, Betreiber | ISA-62443-3-3 (2013) [1] | zweite Ausgabe in Arbeit [6] |
| 4-1 | Anforderungen an den sicheren Produktentwicklungsprozess | Produkthersteller | ANSI/ISA-62443-4-1 (2018) [1] | Grundlage für ISASecure SDLA [7] |
| 4-2 | Technische Security-Anforderungen an IACS-Komponenten | Produkthersteller | ANSI/ISA-62443-4-2 (2018) [1] | zweite Ausgabe in Arbeit [6]; Grundlage für ISASecure CSA [7] |
| 6-1 | Bewertungsmethodik für 62443-2-4 | Zertifizierungsstellen | IEC TS 62443-6-1 (2024) [3] | zur Bewertung von Dienstleistern |

Zwei praktische Hinweise. Erstens bedeuten die Daten der Kernteile (3-3 von 2013, 4-2 von 2018) nicht, dass der Inhalt veraltet ist; es sind weiterhin die Ausgaben, auf die sich Zertifizierungen und Verträge beziehen. Zweitens laufen Überarbeitungen für 3-2, 3-3 und 4-2 [6]. Wer langfristige Lieferverträge schreibt, verweist auf "die zum Bestellzeitpunkt aktuelle Ausgabe" oder nennt die Ausgabe und ergänzt eine Überprüfungsklausel.

Ein Wort der Vorsicht zu Sekundärquellen: 2026 kündigten einige Websites eine neue "IEC 62443-4-2:2026" mit verpflichtender KI-Anomalieerkennung an. Eine solche Veröffentlichung fanden wir im ISA-Katalog und im IEC-Webstore mit Stand November 2026 nicht [1][4]. Jede Angabe zu einer Ausgabe beim Herausgeber prüfen.

### Die Rollen: wer was tun muss

Die 62443 weist Verantwortlichkeiten Rollen zu, nicht Abteilungen. Der Quick Start Guide der ISAGCA definiert sie so [2]:

| Rolle | Definition (ISAGCA) | Typisches Unternehmen | Wichtigste 62443-Teile |
|---|---|---|---|
| Betreiber (Asset Owner) | "The organization that is accountable and responsible for the IACS" (die Organisation, die für das IACS verantwortlich ist) | der Fertiger, der das Werk betreibt | 2-1, 2-2, 2-3, 3-2 |
| Integrationsdienstleister (Integration Service Provider) | "The organization that provides integration activities for an Automation Solution" (die Organisation, die Integrationsleistungen für eine Automatisierungslösung erbringt) | Systemintegrator, Maschinenbauer, der eine Linie liefert, eigene Engineering-Abteilung | 2-4, 3-2, 3-3 |
| Instandhaltungsdienstleister (Maintenance Service Provider) | erbringt Unterstützungsleistungen für eine Automatisierungslösung nach den Richtlinien des Betreibers | Servicedienstleister, OEM-Service, eigene Instandhaltung | 2-4 |
| Produkthersteller (Product Supplier) | "The organization that manufactures and supports a hardware and/or software product" (die Organisation, die ein Hardware- und/oder Softwareprodukt herstellt und betreut) | Hersteller von SPS, HMI, Netzwerktechnik, Antrieben und Software | 4-1, 4-2 |

Ein Unternehmen kann mehrere Rollen haben. Ein Maschinenbauer ist Produkthersteller für seine Schaltschranksoftware und Integrationsdienstleister, wenn er die Linie installiert. Ein großer Fertiger mit eigener Automatisierungstechnik ist zugleich Betreiber und Integrator. Der Wert des Rollenmodells liegt darin, dass Vertrag und Audit genau sagen können, welche Anforderungen jede Partei verantwortet.

### Die zwei Lebenszyklen

Die 62443 unterscheidet den **Produktentwicklungslebenszyklus** des Herstellers vom **Lebenszyklus der Automatisierungslösung** im Werk, der eine Integrationsphase und eine Betriebs- und Instandhaltungsphase hat [2]. Eine sichere SPS (4-2) ergibt noch keine sichere Linie; der Integrator muss sie richtig konfigurieren (3-3), und der Betreiber muss sie zwanzig Jahre lang sicher betreiben (2-1). Die meisten Probleme im Werk entstehen im dritten Schritt.

## Grundlegende Anforderungen, Security Levels und Reifegrade

### Die sieben grundlegenden Anforderungen

Alle technischen Anforderungen in 3-3 (System) und 4-2 (Komponente) sind unter sieben grundlegenden Anforderungen (Foundational Requirements, FRs) gruppiert [2]. Es lohnt sich, sie zu kennen; sie sind das Rückgrat jeder Lückenanalyse.

| FR | Name | Was sie in Werkssprache fragt | Typische Maßnahmen im Werk |
|---|---|---|---|
| FR 1 | Identifizierung und Authentifizierung (Identification and Authentication Control, IAC) | Wissen wir, wer oder was sich verbindet? | persönliche Konten statt gemeinsamer "Bediener"-Logins, MFA für Fernzugriff, Gerätezertifikate für OPC UA |
| FR 2 | Nutzungskontrolle (Use Control, UC) | Kann jede Person nur das tun, was ihre Rolle erfordert? | rollenbasierte Rechte auf HMIs und Engineering-Werkzeugen, getrennte Administratorkonten, Nachvollziehbarkeit, wer Logik geändert hat |
| FR 3 | Systemintegrität (System Integrity, SI) | Können wir unbefugte Änderungen an Software, Logik und Daten erkennen oder verhindern? | Application Allowlisting, signierte Firmware, Schlüsselschalter der Steuerung in RUN, Erkennung von Logikänderungen |
| FR 4 | Vertraulichkeit der Daten (Data Confidentiality, DC) | Sind sensible Informationen bei Nutzung, Übertragung und Speicherung geschützt? | verschlüsselte Fernsitzungen, Schutz von Rezepten und Zeichnungen, Umgang mit CUI bei Rüstungsaufträgen |
| FR 5 | Eingeschränkter Datenfluss (Restricted Data Flow, RDF) | Ist der Verkehr zwischen Zonen auf das Notwendige begrenzt? | Segmentierung, Firewalls an Conduits, industrielle DMZ, Einweg-Gateways, wo begründet |
| FR 6 | Rechtzeitige Reaktion auf Ereignisse (Timely Response to Events, TRE) | Bemerken wir Vorfälle und reagieren wir rechtzeitig? | Logsammlung, OT-Netzwerküberwachung, Alarmbearbeitung, Incident-Playbook |
| FR 7 | Verfügbarkeit von Ressourcen (Resource Availability, RA) | Laufen die essenziellen Funktionen unter Last oder Angriff weiter? | Redundanz, Backups, getestete Wiederherstellungen, Schutz gegen Netzwerkfluten, manueller Rückfallbetrieb |

### Security Levels (SL 1 bis 4)

Ein Security Level beschreibt, wie starkem Angreifer eine Zone oder Komponente standhalten kann. 62443-3-3 definiert vier Stufen [2]:

| SL | Schutz gegen | Beispielbedrohung im Werk |
|---|---|---|
| SL 0 | kein besonderer Schutz nötig | selten begründet; kein Entwurfsziel |
| SL 1 | gelegentliche oder zufällige Verstöße | ein Techniker steckt einen Laptop in den falschen Switch-Port |
| SL 2 | absichtliche Verstöße mit einfachen Mitteln, geringen Ressourcen, allgemeinen Fähigkeiten und geringer Motivation | Standard-Ransomware, ein Gelegenheitsangreifer mit Standardwerkzeugen |
| SL 3 | absichtliche Verstöße mit ausgefeilten Mitteln, moderaten Ressourcen, IACS-spezifischen Fähigkeiten und moderater Motivation | eine kriminelle Gruppe, die das Steuerungssystem studiert, bevor sie handelt |
| SL 4 | absichtliche Verstöße mit ausgefeilten Mitteln, umfangreichen Ressourcen, IACS-spezifischen Fähigkeiten und hoher Motivation | ein gut finanziertes, staatlich unterstütztes Team, das einen bestimmten Prozess angreift |

Ein Security Level ist keine einzelne Zahl für das ganze Werk, sondern ein Vektor über die sieben FRs. Eine Zone kann SL 3 für FR 3 brauchen (Integrität, weil manipulierte Logik jemanden verletzen könnte), aber nur SL 1 für FR 4 (Vertraulichkeit, weil die Daten nicht sensibel sind). Die Sekundärübersicht weist darauf hin, dass SLs je technischer Anforderung bewertet werden, nicht als Gesamtnote eines Produkts [3].

Außerdem gibt es drei Arten von Security Level [2]:

- **SL-T (Target, Ziel):** das gewünschte Level für eine Zone oder ein Conduit, festgelegt durch die Risikobewertung.
- **SL-C (Capability, Fähigkeit):** was ein System (3-3) oder eine Komponente (4-2) bei richtiger Integration und Konfiguration leisten kann.
- **SL-A (Achieved, erreicht):** das tatsächliche Level der installierten Lösung.

Das gesamte Programm lässt sich in einem Satz beschreiben: Komponenten mit einem SL-C mindestens gleich dem SL-T wählen, sie so konfigurieren, dass das SL-A das SL-T erreicht, und kompensierende Maßnahmen einsetzen, wo es das nicht tut.

**Wie die meisten mittelgroßen Fertiger ihre Ziele setzen.** SL 2 ist das übliche Ziel für Produktionszonen in der diskreten Fertigung, SL 3 für Zonen, deren Kompromittierung Verletzungen, große Umweltfreisetzungen oder lange Ausfälle verursachen könnte, etwa Sicherheitssysteme und kritische Prozesssteuerung. Das ist Praxiserfahrung, keine Regel der Norm [als Statistik unbelegt]. Die Entscheidung gehört in die eigene Risikobewertung, dokumentiert und vom Betreiber freigegeben.

### Reifegrade

Security Levels messen technische Stärke. Reifegrade (Maturity Levels) messen, wie gut Prozesse gelebt werden. Das Reifegradmodell der 62443 basiert auf CMMI und wird in den Teilen 2-1, 2-2, 2-4 und 4-1 verwendet [2]. Die Sekundärübersicht beschreibt ML 1 (initial, ad hoc), ML 2 (gemanagt, dokumentiert und wiederholbar), ML 3 (definiert, in der ganzen Organisation mit Nachweisen gelebt) und ML 4 (verbessernd, gemessen und kontinuierlich verbessert) [3].

Praktisch gelesen: Ein Integrator, dessen Prozesse nach 2-4 auf ML 1 stehen, liefert gute Arbeit, wenn der richtige Ingenieur vor Ort ist, und schlechte, wenn nicht. In Verträgen ML 2 oder höher verlangen, also schriftliche Verfahren, geschultes Personal und Nachweise.

### Die Gestaltungsprinzipien hinter den Anforderungen

Der Quick Start Guide nennt vier Gestaltungsprinzipien, die sich durch die Reihe ziehen: Secure by Design, Verkleinerung der Angriffsfläche (Zugriffskontrolle, Segmentierung, minimale Funktion, minimale Rechte), Defense in Depth und Schutz der essenziellen Funktionen [2]. Defense in Depth ist definiert als "the provision of multiple security protections, especially in layers, with the intent to delay or prevent an attack" (das Bereitstellen mehrerer Schutzmaßnahmen, insbesondere in Schichten, mit dem Ziel, einen Angriff zu verzögern oder zu verhindern) [2]. Keine einzelne Firewall soll die ganze Last tragen.

## Zonen und Conduits und das Purdue-Modell

### Definitionen

- **Zone:** "a grouping of logical or physical assets based upon risk or other criteria" (eine Gruppierung logischer oder physischer Assets nach Risiko oder anderen Kriterien) [2].
- **Conduit:** "a logical grouping of communication channels that share common security requirements" (eine logische Gruppierung von Kommunikationskanälen mit gemeinsamen Security-Anforderungen) [2].

Assets in einer Zone haben dieselben Security-Anforderungen; Verkehr zwischen Zonen fließt nur über definierte Conduits, und jedes Conduit bekommt eigene Maßnahmen (Firewallregeln, Protokollbeschränkungen, Authentifizierung, Überwachung). Eine Zone kann eine einzelne Zelle mit einem Roboter und seiner SPS sein, eine ganze Produktionslinie, die Medienversorgung oder die industrielle DMZ.

### Wie man Zonen zieht

Assets nach diesen Kriterien gruppieren, ungefähr in dieser Reihenfolge:

1. **Funktion und Folgen:** Sicherheitssysteme in eine eigene Zone, getrennt von der Basisprozesssteuerung.
2. **Physischer oder logischer Ort:** Linie, Gebäude, Standort.
3. **Zuständigkeit und Lebenszyklus:** Eine schlüsselfertige Linie eines Maschinenbauers bildet oft eine natürliche Zone.
4. **Technische Fähigkeit:** Altsysteme, die sich nicht härten lassen, brauchen unter Umständen eine eigene kleine Zone mit engen Conduits.
5. **Verbindungsbedarf:** Systeme, die mit dem Unternehmen oder der Cloud sprechen müssen, gehören an die Grenze, nicht tief ins Innere.

Zwei Extreme vermeiden. Eine Zone für das ganze Werk bietet keine Eindämmung. Hundert Zonen machen die Regeln unbeherrschbar und erzeugen eine Firewall, die niemand anzufassen wagt. Für ein mittelgroßes Werk sind in der Praxis 8 bis 20 Zonen typisch [Praxiswert, unbelegt].

### Das Purdue-Modell und seine Grenzen

Viele Werke beschreiben ihre Architektur noch mit der Purdue Enterprise Reference Architecture, die die Norm ISA-95 als funktionale Hierarchie übernommen hat. Ihre Ebenen sind eine nützliche erste Landkarte für Zonen:

| Ebene | Inhalt | Beispielsysteme | Typische Zone |
|---|---|---|---|
| 4-5 | Unternehmen: Geschäftsplanung und Logistik, Unternehmens-IT, Internet | ERP, E-Mail, Microsoft 365, Unternehmensidentität | Unternehmenszone |
| 3,5 | Industrielle DMZ (nicht im ursprünglichen Modell; in der Praxis üblich) | Historian-Replikat, Patchserver, Fernzugriffs-Gateway, Dateiübertragung | IDMZ |
| 3 | Standortbetrieb: Fertigungsmanagement | MES, Standort-Historian, OT-Domänencontroller, Backupserver | Zone Standortbetrieb |
| 2 | Überwachung und Steuerung eines Bereichs | SCADA, HMI, Engineering-Workstations | Linien- oder Bereichszonen |
| 1 | Basissteuerung | SPS, PLS-Controller, Robotersteuerungen, Antriebe | Zellen- oder Linienzonen |
| 0 | Physischer Prozess | Sensoren, Aktoren, Motoren, Ventile | innerhalb der Zellenzonen |
| Sicherheit | sicherheitstechnische Systeme | Sicherheits-SPS, Brennermanagement, Pressensicherheit | eigene Sicherheitszone |

Das Purdue-Modell ist eine erste Landkarte, nicht das Zonenmodell selbst. Seine Grenzen zeigen sich an drei Stellen:

- **IIoT und Cloud.** Funksensoren, die Daten direkt an eine Cloud-Plattform senden, überspringen Ebenen. IEC PAS 62443-1-6 (Dezember 2025) gibt Hinweise zur Anwendung der Reihe auf IIoT-Systeme [5]; auch der Entwurf von NIST SP 800-82 Rev. 4 behandelt nun IIoT im Zusammenspiel mit der Cloud [10].
- **Flache Linien.** Viele Maschinen vereinen Ebene 1 und Ebene 2 in einem Schaltschrank. Zonen folgen dem Risiko, nicht der Zeichnung.
- **Gemeinsame Dienste.** Ein Active Directory, das Büro und Werk bedient, verbindet die Ebenen 4 und 3 auf eine Weise, die die Zeichnung nicht zeigt. Die tatsächlichen Abhängigkeiten erfassen, nicht die beabsichtigten.

Zur Datenarchitektur (ISA-95-Ebenen, Unified Namespace, Edge-Cluster in der industriellen DMZ) siehe die Leitfäden [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant) und [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/).

## Die Risikobewertung nach 62443-3-2 Schritt für Schritt

62443-3-2 beschreibt, wie man von "wir haben ein System" zu "wir kennen die Zonen, Conduits und Ziel-Security-Levels" kommt. Der Quick Start Guide fasst den Ablauf in sieben Anforderungen an Zonen und Conduits (Zone and Conduit Requirements, ZCR) zusammen [2]:

| Schritt | ZCR | Tätigkeit | Ergebnis |
|---|---|---|---|
| 1 | ZCR 1 | das betrachtete System (System under Consideration, SUC) identifizieren | Grenze, Asset-Liste, Eintrittspunkte |
| 2 | ZCR 2 | eine erste Cybersecurity-Risikobewertung durchführen | Worst-Case-Folgen unter der Annahme, dass das System kompromittiert ist |
| 3 | ZCR 3 | das SUC in Zonen und Conduits aufteilen | Zonen- und Conduit-Diagramm |
| 4 | ZCR 4 | entscheiden: Übersteigt das Anfangsrisiko das tolerierbare Risiko? | Liste der Zonen, die eine Detailbewertung brauchen |
| 5 | ZCR 5 | eine detaillierte Cybersecurity-Risikobewertung durchführen | Bedrohungen, Schwachstellen, Eintrittswahrscheinlichkeit, Folgen, SL-T je Zone und Conduit |
| 6 | ZCR 6 | Cybersecurity-Anforderungen, Annahmen und Randbedingungen dokumentieren | Cybersecurity-Anforderungsspezifikation (Cybersecurity Requirements Specification, CRS) |
| 7 | ZCR 7 | Freigabe durch den Betreiber | unterschriebene CRS |

(Der Quick Start Guide bezeichnet den Dokumentationsschritt an einer Stelle als "ZCR 4"; in der Abfolge ist es der sechste Schritt.)

### So läuft sie in der Praxis

**Schritt 1: Das System festlegen.** Einen Umfang wählen, den ein Team in einigen Wochen bewältigen kann, etwa ein Produktionsgebäude oder eine Linie mit ihren unterstützenden Systemen. Fernzugriffswege und Cloud-Verbindungen einbeziehen; sie gehören zum System, auch wenn die Server anderswo stehen.

**Schritt 2: Erste Bewertung mit der Sicht "Assume Breach".** Für jede mögliche Zone fragen, was das schlimmste plausible Ergebnis ist, wenn ein Angreifer die volle Kontrolle erlangt. Die Prozessgefahrenanalyse (PHA) oder HAZOP als Eingabe nutzen: Das Sicherheitsteam weiß bereits, welche Abweichungen Menschen schaden können. Die erste Bewertung verwendet das unverminderte Risiko: ohne Anrechnung vorhandener Security-Maßnahmen.

**Schritt 3: Zonen und Conduits.** Sie nach den Kriterien aus dem vorigen Abschnitt zeichnen. Jede Verbindung, die eine Zonengrenze überschreitet, wird Teil eines Conduits.

**Schritt 4: Tolerierbares Risiko.** Das Unternehmen braucht eine Risikomatrix, die sagt, welche Kombinationen aus Eintrittswahrscheinlichkeit und Folge tolerierbar sind. Viele Werke haben bereits eine für Prozesssicherheit oder das Risikomanagement des Unternehmens; diese wiederverwenden, statt eine neue zu erfinden.

**Schritt 5: Detailbewertung.** Für Zonen oberhalb der Toleranzlinie Bedrohungsszenarien auflisten (ATT&CK for ICS hilft dabei [15]), vorhandene Maßnahmen und Schwachstellen erfassen, dann Eintrittswahrscheinlichkeit und Folge schätzen. Das SL-T je FR ableiten.

**Schritt 6: Cybersecurity-Anforderungsspezifikation.** Je Zone und Conduit festhalten: SL-T, erforderliche Maßnahmen, Annahmen (zum Beispiel "der Schaltschrank ist verschlossen und die Halle hat Ausweiszutritt") und Randbedingungen ("der HMI-Hersteller unterstützt keinen Virenschutz"). Die CRS ist das Dokument, das man einem Integrator oder Maschinenbauer übergibt.

**Schritt 7: Freigabe.** Die Werksleitung oder der benannte Betreiberverantwortliche unterschreibt sie. Dieser Schritt ist wichtig: Er macht das Restrisiko zu einer Managemententscheidung statt zu einer Vorliebe der Technik.

### Ein einfaches Bewertungsschema

Die Skala verwenden, die das Risikomanagement des Unternehmens nutzt. Gibt es keine, taugt das folgende 5x5-Schema für einen ersten Durchgang.

| Wert | Eintrittswahrscheinlichkeit (mit aktuellen Maßnahmen) | Folge (schlimmste plausible, je Zone) |
|---|---|---|
| 1 | in der Lebensdauer des Systems nicht plausibel | keine Sicherheitsauswirkung, unter 4 Stunden Stillstand, unter 50.000 USD |
| 2 | plausibel, aber unwahrscheinlich | Erste-Hilfe-Fall, bis 1 Schicht Stillstand, bis 250.000 USD |
| 3 | könnte innerhalb von 10 Jahren eintreten | meldepflichtige Verletzung, 1 bis 3 Tage Stillstand, bis 1 Mio. USD |
| 4 | könnte innerhalb von 3 Jahren eintreten | schwere Verletzung oder Umweltfreisetzung, 1 bis 2 Wochen Stillstand, bis 5 Mio. USD |
| 5 | innerhalb eines Jahres zu erwarten | Todesfall oder große Freisetzung, mehr als 2 Wochen, mehr als 5 Mio. USD |

Die obigen Dollar- und Zeitschwellen sind Beispiele und müssen von jedem Unternehmen passend zur eigenen Risikobereitschaft festgelegt werden.

Risiko = Eintrittswahrscheinlichkeit x Folge. Eine verbreitete Zuordnung: 1 bis 6 tolerierbar, 8 bis 12 braucht Maßnahmen und Freigabe, 15 bis 25 nicht tolerierbar. Für das SL-T ist eine praktische Faustregel: Zonen, deren schlimmste Folge mit 4 oder 5 bewertet wird, bekommen SL-T 3 für FR 1 bis FR 3 und FR 7; Zonen mit Folge 2 oder 3 bekommen SL-T 2; Folge 1 bekommt SL-T 1. Diese Faustregel ist unsere Vereinfachung für einen ersten Durchgang; die Norm verlangt eine dokumentierte Begründung, keine Formel.

## Praxisbeispiel: Zonen und Conduits für ein mittelgroßes Werk

Abstrakte Definitionen tragen nur begrenzt. Dieser Abschnitt wendet 62443-3-2 auf ein fiktives, aber typisches Werk an. Alle Namen und Zahlen sind Beispiele.

### Das Werk

"Midwest Components" fertigt Metallgehäuse und Baugruppen für Land- und Baumaschinen. Ein Standort in den USA, 420 Beschäftigte, drei Schichten, Jahresumsatz etwa 150 Mio. USD. Produktion:

- **Presswerk:** vier Servopressen mit Transferautomation; eine Presslinie hat eine Sicherheits-SPS mit Lichtvorhängen und einer Zweihandsteuerung.
- **Schweißzellenbereich:** zwölf Roboterschweißzellen von zwei Maschinenbauern, jede mit eigener SPS, Robotersteuerung und HMI.
- **Lackiererei:** Pulverbeschichtungslinie mit Einbrennofen (Erdgasbrenner mit Brennermanagementsystem), gesteuert von einem kleinen PLS.
- **Montage:** zwei manuelle Montagelinien mit Schraubwerkzeugen, Etikettendruckern und einer Linien-SPS für die Fördertechnik.
- **Medienversorgung:** Druckluft, Kühlwasser, Lüftung und Energiezählung auf einem SCADA-System.
- **Standortsysteme:** MES mit einem Server und 40 Clients, ein Historian, ein Qualitätslabor mit einer Koordinatenmessmaschine (KMG), ein OT-Active-Directory, ein Backupserver.
- **Unternehmen:** ERP, gehostet von der Konzern-IT, Microsoft 365, Unternehmensidentität.
- **Fernzugriff:** Die beiden Maschinenbauer der Schweißzellen und der Pressenhersteller nutzen derzeit jeweils eine eigene Fernwartungsbox mit Mobilfunkmodem. Der Integrator der Lackierlinie verbindet sich über ein Hersteller-VPN.
- **Cloud:** Ein Energiemonitoring-Dienst erhält Zählerdaten über das Internet von einem Gateway im Netz der Medienversorgung.

### Schritt 1 und 2: erste Bewertung

Das Team (Leitung Werkstechnik, Leitung Automatisierungstechnik, Leitung IT-Security, Leitung Arbeits- und Umweltschutz (EHS) und der Meister der Instandhaltung) geht jeden Bereich mit der Frage durch: "Was ist das schlimmste plausible Ergebnis, wenn ein Angreifer das hier kontrolliert?"

| Bereich | Schlimmstes plausibles Ergebnis (Assume Breach) | Folgewert |
|---|---|---|
| Sicherheits-SPS der Presslinie | Sicherheitsfunktion im Betrieb deaktiviert, Gefahr schwerer Verletzungen | 5 |
| Pressensteuerung | beschädigte Werkzeuge und Pressen, Wochen Stillstand | 4 |
| Brennermanagement des Lackofens | unsichere Brennerzustände, Brand- oder Explosionsgefahr | 5 |
| PLS der Lackiererei | verdorbene Chargen, mehrere Tage Stillstand | 3 |
| Schweißzellen | beschädigte Vorrichtungen, Qualitätsdurchschlupf, 1 bis 3 Tage je Zelle | 3 |
| Montagelinien | falsches Drehmoment oder falsche Etiketten, Qualitätsdurchschlupf zum Kunden | 3 |
| SCADA der Medienversorgung | Ausfall von Druckluft und Kühlung stoppt das ganze Werk | 4 |
| MES und Historian | das Werk kann einige Tage im eingeschränkten manuellen Modus laufen | 3 |
| Qualitätslabor | falsche Messdaten, Qualitätsdurchschlupf | 2 |
| Unternehmens-IT | Geschäftsunterbrechung; das Werk steht, wenn Auftrags- und Versanddaten nicht verfügbar sind | 4 |

### Schritt 3: das Zonenmodell

| Zone | Inhalt | SL-T (FR 1-3, FR 5-7 / FR 4) | Begründung |
|---|---|---|---|
| Z0 Unternehmen | Konzern-IT, ERP, Microsoft 365 | von der Konzern-IT nach CSF 2.0 verwaltet | außerhalb des IACS, aber die Hauptquelle von Bedrohungen |
| Z1 Industrielle DMZ | Historian-Replikat, Patch- und Virenschutz-Updateserver, Fernzugriffs-Gateway, Dateiübertragungsserver, Jump Hosts | SL 3 / SL 2 | einzige Zone mit direktem Kontakt zu Z0 und zu externen Lieferanten |
| Z2 Standortbetrieb | MES-Server, Standort-Historian, OT-Active-Directory, Backupserver, Sensorverwaltung der OT-Überwachung | SL 2 / SL 2 | Folge 3, aber zentrale Dienste für alle Linien |
| Z3 Pressensteuerung | Pressen-SPS, Transferautomation, HMIs, Engineering-Workstation der Pressen | SL 2, SL 3 für FR 3 / SL 1 | Folge 4: die Integrität der Logik zählt am meisten |
| Z4 Pressensicherheit | Sicherheits-SPS, Lichtvorhänge, Zweihandsteuerungen | SL 3 / SL 1 | Folge 5; eigene Zone mit minimalen Conduits |
| Z5 Schweißzellen (Maschinenbauer A) | sechs Zellen | SL 2 / SL 1 | Folge 3, schlüsselfertig von einem Lieferanten |
| Z6 Schweißzellen (Maschinenbauer B) | sechs Zellen | SL 2 / SL 1 | ebenso, anderer Lieferant und anderer Fernzugriffsweg |
| Z7 PLS Lackiererei | PLS-Controller, Bedienstationen | SL 2 / SL 1 | Folge 3 |
| Z8 Brennermanagement | Brennermanagementsystem des Einbrennofens | SL 3 / SL 1 | Folge 5; eigene Sicherheitszone |
| Z9 Montage | Linien-SPS, Schraubsteuerungen, Etikettendrucker, HMIs | SL 2 / SL 1 | Folge 3 |
| Z10 Medienversorgung | SCADA, Kompressoren, Kältemaschinen, Lüftungssteuerungen, Zähler | SL 2, SL 3 für FR 7 / SL 1 | Folge 4: die Verfügbarkeit zählt am meisten |
| Z11 Qualitätslabor | KMG, Labor-PCs | SL 2 / SL 2 | Messdaten und Kundenzeichnungen |
| Z12 IIoT-Energie-Gateway | Zähler-Gateway mit Cloud-Verbindung | SL 2 / SL 1 | direkter Internetweg, von der Steuerung in Z10 isoliert |

Zwölf Zonen im Werk plus das Unternehmen. Bemerkenswert ist, was mit den Fernwartungsboxen mit Mobilfunk passiert: Sie verschwinden. Jeder Lieferantenzugriff läuft künftig über das Fernzugriffs-Gateway in Z1.

### Die Conduits

| Conduit | Zwischen | Erlaubter Verkehr | Maßnahmen |
|---|---|---|---|
| C1 | Z0 Unternehmen <-> Z1 IDMZ | Auftragsschnittstelle ERP zu MES über einen Broker in der IDMZ; Benutzer auf das Historian-Replikat (nur lesend); Update-Downloads | Firewallpaar (Unternehmensseite und Werksseite), kein direkter Verkehr von Z0 nach Z2 oder tiefer, Protokollierung |
| C2 | Z1 IDMZ <-> Z2 Standortbetrieb | Historian-Replikation (Z2 nach Z1), MES-Schnittstelle, Patchverteilung, Jump-Host-Sitzungen | Firewall mit expliziten Erlaubnisregeln, MFA für Jump Hosts, Sitzungsaufzeichnung |
| C3 | externe Lieferanten <-> Z1 IDMZ | Fernzugriffssitzungen | Fernzugriffs-Gateway mit persönlichen Konten, MFA, Freigabe je Sitzung, Zeitlimits, Aufzeichnung |
| C4 | Z2 <-> Z3, Z5, Z6, Z7, Z9, Z10, Z11 | MES zu Linien-SPS und HMIs (definierte Industrieprotokolle), Datenerfassung des Historians, Backups, Engineering-Zugriff vom Jump Host | interne Firewall oder ACLs je Zone; nur benannte Protokolle und Hosts |
| C5 | Z3 Pressensteuerung <-> Z4 Pressensicherheit | nur Statussignale | fest verdrahtet oder eigenes Sicherheitsnetz; keine routbare Verbindung zu Z2 |
| C6 | Z7 PLS Lackiererei <-> Z8 Brennermanagement | Status- und Freigabesignale | fest verdrahtete E/A; kein Engineering-Zugriff außer lokal mit MOC |
| C7 | Z12 IIoT-Gateway <-> Internet (Cloud-Dienst) | nur ausgehende verschlüsselte Telemetrie | Gateway in eigenem VLAN, nur ausgehend, keine eingehenden Verbindungen |
| C8 | Z10 Medienversorgung -> Z12 | Zählerwerte | Datenfluss in eine Richtung (Datendiode oder unidirektionale Firewallregel), kein Weg von Z12 zurück nach Z10. Vorher prüfen, ob das Zählerprotokoll in eine Richtung funktioniert; Anfrage-Antwort-Protokolle brauchen ein Gateway, das auf der Seite von Z10 abfragt |

### Schritte 4 bis 7: von den Lücken zur Anforderungsspezifikation

Die Detailbewertung für Z4 Pressensicherheit zeigt: Anfangsrisiko 5 (Folge) x 3 (Eintrittswahrscheinlichkeit: Die Sicherheits-SPS ist aus dem HMI-Netz der Pressen und über das Mobilfunkmodem eines Maschinenbauers erreichbar) = 15, nicht tolerierbar. Mit den geplanten Maßnahmen (eigene Zone, kein routbares Conduit, Mobilfunkmodem entfernt, Schlüsselschalter in RUN gesichert, wöchentliche Prüfung der Logik-Prüfsumme) schätzt das Team die Eintrittswahrscheinlichkeit auf 1 und das Restrisiko auf 5, tolerierbar. Der Betreiber gibt frei.

Bei Z5 und Z6 liegt die Lücke vor allem bei FR 1 und FR 2: gemeinsame Konten auf allen zwölf HMIs und den Programmierhandgeräten der Roboter. Die CRS für den nächsten Zellenkauf verlangt benannte Konten und ein nach SL-C 2 zertifiziertes HMI; für die bestehenden Zellen ist die kompensierende Maßnahme ein vorgeschalteter Jump Host mit persönlichen Konten und ein Verbot direkter Laptopverbindungen.

### Wie das Ergebnis nach einem Jahr aussieht

| Kennzahl | Vorher | Nach 12 Monaten |
|---|---|---|
| Unkontrollierte Fernzugriffswege | 4 (3 Mobilfunkboxen, 1 Hersteller-VPN) | 0; ein Gateway mit MFA und Aufzeichnung |
| Zonen | 1 flaches Werksnetz, Büro-VLAN dorthin geroutet | 12 Werkszonen plus Unternehmen, IDMZ dazwischen |
| Assets mit bekanntem Verantwortlichen und Firmwarestand | unbekannt | 96 % der 640 inventarisierten netzwerkfähigen Assets |
| Steuerungen mit Offline-Backup der aktuellen Logik | etwa die Hälfte (Schätzung) | 100 % der 58 SPS und Steuerungen, Wiederherstellung an 6 getestet |
| Incident-Playbook | keines | geschrieben, in einer Planspielübung (Tabletop) mit der Produktion getestet |

Diese Zahlen sind Beispiele. Entscheidend ist die Form des Ergebnisses: weniger Wege, bekannte Assets, wiederherstellbare Logik.

## OT-Asset-Inventar

Was man nicht kennt, kann man nicht schützen. Das Asset-Inventar ist Schritt null der 62443-3-2 (das betrachtete System identifizieren) und jedes NIST-Profils. Der Entwurf von NIST SP 800-82 Rev. 4 erweitert seine Hinweise zum Asset-Management [10].

### Was erfasst werden sollte

Ein brauchbares Inventar geht über eine Liste von IP-Adressen hinaus. Die Tabelle ist eine Vorlage; mit den fett gedruckten Feldern beginnen und den Rest mit der Zeit ergänzen.

| Feld | Beispiel | Warum es zählt |
|---|---|---|
| **Asset-ID und Name** | PR3-PLC01 | eindeutige Referenz in Tickets und Zeichnungen |
| **Typ** | SPS, HMI, Robotersteuerung, Switch, Server, Workstation | bestimmt, welche Maßnahmen gelten |
| **Hersteller, Modell** | (Hersteller), (Modell) | Abgleich mit Herstellerwarnungen |
| **Firmware-/Softwarestand** | v32.011 | Entscheidungen zu Schwachstellen und Patches |
| **Zone** | Z3 Pressensteuerung | verknüpft das Asset mit dem Zonenmodell |
| **Ort** | Presslinie 3, Schaltschrank +A1 | physischer Zugang und Instandhaltung |
| **Verantwortlicher** | Automatisierungstechnik, Pressen | wer über Änderungen entscheidet |
| **Kritikalität** | Folgewert 4 | Priorisierung |
| Netzwerkadressen und Protokolle | 10.30.3.11, EtherNet/IP | Firewallregeln, Überwachungs-Baselines |
| Kommunikationspartner | HMI PR3-HMI01, MES-Server | Definition der Conduits |
| Fernzugriff | nur über Jump Host | Exponiertheit |
| Backupstatus | Logik gesichert am 05.11.2026, Wiederherstellung getestet 06/2026 | Wiederherstellungsbereitschaft |
| Supportstatus beim Hersteller | unterstützt bis (Datum) oder End of Life | Lebenszyklusplanung |
| Konten | benannte Konten ja/nein; Standardpasswort geändert ja/nein | Lücken bei FR 1 und FR 2 |
| Bekannte Schwachstellen | Referenz der Warnung, Entscheidung | Patches und kompensierende Maßnahmen |
| Ersatzteile und Austausch | Ersatzteil im Lager ja/nein | Wiederherstellungszeit |

### Wie man es aufbaut, ohne etwas kaputt zu machen

1. **Vom Vorhandenen ausgehen.** Elektropläne, SPS-Projektdateien, Switch-Konfigurationen, Einträge im Instandhaltungssystem (CMMS), Bestellungen und die Dokumentation der Maschinenbauer enthalten bereits die meisten Daten.
2. **Passive Netzwerkerkennung.** Kommerzielle OT-Überwachungswerkzeuge hören eine Kopie des Netzwerkverkehrs mit (über einen SPAN-Port oder einen Netzwerk-TAP) und erkennen Geräte, Firmwarestände und Kommunikationsmuster, ohne Pakete an die Steuerungen zu senden.
3. **Herstellerwerkzeuge und kontrollierte Abfragen.** Engineering-Software kann Geräteinformationen sicher aus Steuerungen lesen. Aktive Abfragen sind akzeptabel, wenn der Hersteller sie unterstützt und die Produktion einem Zeitfenster zustimmt.
4. **Den Shopfloor ablaufen.** Jedes Inventar findet Geräte, die auf keiner Zeichnung stehen: einen vergessenen Mobilfunkrouter, einen Laptop im Schaltschrank, einen WLAN-Access-Point, den ein Dienstleister installiert hat.
5. **Es lebendig halten.** Aktualisierungen an das Änderungsmanagement koppeln: Kein neues Gerät geht ohne Inventareintrag in Betrieb. Monatlich mit dem abgleichen, was die Überwachung sieht.

### Ein Hinweis zu Werkzeugen

Spezialisierte OT-Security-Plattformen automatisieren passive Erkennung und Schwachstellenabgleich. Microsoft hat angekündigt, die OT-Security-Komponente von Defender for IoT im Oktober 2029 einzustellen, und verweist Kunden auf Partnerlösungen [31]; der [Leitfaden Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/) behandelt diesen Übergang. Welches Werkzeug auch immer gewählt wird: Das Inventar gehört dem Betreiber und sollte exportierbar sein; es nicht in der Konsole eines einzelnen Anbieters einsperren.

## Netzwerksegmentierung und die industrielle DMZ

Segmentierung setzt FR 5 (eingeschränkter Datenfluss) um. Sie ist die eine Maßnahme, die in den meisten Fällen aus Abschnitt 3 die Ausbreitung begrenzt hätte, und dort finden die meisten Werke ihre größte Lücke.

### Zielarchitektur

- **Zweistufige Grenze zwischen Unternehmen und Werk.** Eine industrielle DMZ (IDMZ) zwischen Unternehmen und Standortbetrieb, mit Firewalls auf beiden Seiten. Kein Verkehr geht direkt vom Unternehmen ins Werk; jeder Austausch endet in der IDMZ (Daten-Broker, Historian-Replikat, Dateiübertragung, Jump Host, Patchserver).
- **Interne Segmentierung nach Zonen.** Im Werk liegt jede Zone in einem eigenen VLAN oder physischen Netz, mit einer Firewall oder Zugriffskontrolllisten am Conduit.
- **Sicherheitssysteme getrennt.** Sicherheitszonen haben keine routbare Verbindung zum Rest oder nur über ein eng beschränktes Conduit, das die Prozesssicherheit freigegeben hat.
- **Keine Rechner mit zwei Netzen (Dual-Homed).** Ein PC mit einer Netzwerkkarte im Büro und einer im Werk umgeht jede Firewall.
- **Internet nur über definierte Wege.** Cloud-Verbindungen verlassen das Werk über die IDMZ oder aus einer eigenen IIoT-Zone, nur ausgehend.

### Ein Segmentierungsprojekt in sieben Schritten

1. **Zuerst den realen Verkehr erfassen.** Zwei bis vier Wochen passive Überwachung laufen lassen, um zu sehen, wer mit wem spricht. Werke sind immer überrascht.
2. **Das Ziel-Zonenmodell zeichnen** (Abschnitt 9) und mit der Produktion abstimmen.
3. **Die IDMZ aufbauen** und grenzüberschreitende Dienste dorthin verlagern: Historian-Replikat, Fernzugriffs-Gateway, Patchserver, Dateiübertragung.
4. **Firewalls zuerst auf "erlauben und protokollieren" stellen.** Firewalls an den Conduits mit Regeln installieren, die den aktuellen Verkehr erlauben und alles protokollieren.
5. **Regeln schrittweise verschärfen.** Breite Regeln durch spezifische ersetzen (Quelle, Ziel, Protokoll, Port), Zone für Zone, in geplanten Fenstern mit Automatisierungstechnikern vor Ort.
6. **Auf "Deny by Default" umstellen,** sobald die Protokolle nur noch erwarteten Verkehr zeigen.
7. **Regeln unter Änderungsmanagement stellen.** Jede neue Regel braucht einen Antragsteller, einen fachlichen Grund, ein Ablaufdatum und eine Freigabe.

### Vorlage für Firewallregeln

| Feld | Beispiel |
|---|---|
| Regel-ID | C4-017 |
| Conduit | C4 (Z2 Standortbetrieb -> Z3 Pressensteuerung) |
| Quelle | MES-Server 10.20.1.15 |
| Ziel | PR3-PLC01 10.30.3.11 |
| Protokoll / Port | EtherNet/IP, TCP 44818 |
| Richtung | nur Z2 -> Z3 |
| Fachlicher Grund | MES liest Teilezähler und schreibt Auftragsnummern |
| Beantragt von / freigegeben von | MES-Administrator / Leitung Automatisierungstechnik, Pressen |
| Gültig bis | Überprüfung 11/2027 |
| Protokollierung | ja |

### Funk- und Mobilfunkverbindungen

WLAN für Handscanner, Funksensoren und die Mobilfunkmodems in Maschinenschaltschränken schaffen Wege, die auf der Zeichnung des kabelgebundenen Netzes nicht auftauchen. Jedes Funknetz als eigene Zone oder als Teil eines Conduits behandeln: getrennte SSIDs für Werksgeräte und Gäste, zertifikatsbasierte Authentifizierung für Werksgeräte, keine Brücken zwischen Funk- und Steuerungsnetzen und eine regelmäßige Funkbegehung, um unerlaubte Access Points und Modems zu finden. Funk-IIoT-Sensoren, die Daten direkt an einen Cloud-Dienst senden, gehören in eine IIoT-Zone wie Z12 im Praxisbeispiel.

### Häufige Probleme bei der Segmentierung

- **Engineering-Laptops,** die zwischen Zonen und Büro hin- und hergetragen werden. Antwort: feste Engineering-Workstations je Zone oder ein Jump Host, und Laptops, die das Werksnetz nie verlassen.
- **Flache Maschinennetze** von Maschinenbauern, bei denen HMI, SPS und ein Fernwartungsrouter am selben unmanaged Switch hängen. Antwort: die Maschine als eine Zone behandeln und das Conduit an ihrem Rand kontrollieren.
- **Gemeinsames Active Directory.** Eine ins Werk erweiterte Unternehmensdomäne gibt einem Angreifer, der die Domäne übernimmt, auch das Werk. Antwort: eine eigene OT-Domäne oder lokale Konten mit definiertem Vertrauensmodell.
- **Broadcast-lastige Protokolle,** die sich schlecht routen lassen. Antwort: VLAN-Grenzen mit dem Steuerungshersteller planen; manche Protokolle brauchen Nachbarn auf Layer 2.

## Sicherer Fernzugriff für Lieferanten und Techniker

In vielen Werken ist der Fernzugriff der größte unkontrollierte Weg hinein: Maschinenbauer brauchen ihn für den Support, und die Produktion will schnelle Hilfe, wenn eine Maschine steht. Ein Verbot funktioniert selten; die praktische Antwort ist ein kontrollierter Weg, der einfacher zu nutzen ist als die Umgehungen.

Im September 2026 veröffentlichten CISA und FBI ein Merkblatt für Betreiber kritischer Infrastruktur, die mit externen ICS-Integratoren arbeiten. Es zitiert eine FBI-Analyse eines Einbruchs bei einem US-Automatisierungsunternehmen im Jahr 2025 und empfiehlt, den Zugriff von Integratoren auf das notwendige Minimum zu beschränken, Cybersecurity-Anforderungen (einschließlich Fernzugriff und Patchmanagement) in Verträge zu schreiben, die Internet-Exponierung von Geräten zu verringern und Fernzugriffe zu überwachen und zu protokollieren, möglichst mit Zugriff nur auf Anforderung [14].

### Anforderungen an den Fernzugriff (Vorlage)

| Anforderung | Detail | 62443-FR |
|---|---|---|
| Ein Weg | alle Fernsitzungen über ein Gateway in der IDMZ; keine Mobilfunkmodems, keine Hersteller-VPNs, die in Produktionszonen enden | FR 5 |
| Persönliche Konten | ein Konto je Person, keine gemeinsamen Lieferantenkonten | FR 1 |
| Multifaktor-Authentifizierung | für jede Fernsitzung | FR 1 |
| Freigabe je Sitzung | ein Ansprechpartner im Werk gibt jede Sitzung frei; der Zugriff ist standardmäßig aus | FR 2 |
| Minimale Rechte | Zugriff nur auf die Assets, die der Lieferant betreut, für die nötige Zeit | FR 2 |
| Sitzungsaufzeichnung und Protokollierung | aufgezeichnet und für einen festgelegten Zeitraum aufbewahrt | FR 6 |
| Aufsicht bei Änderungen | Logikänderungen nur unter Aufsicht eines Werksingenieurs und mit Arbeitsauftrag | FR 3 |
| Dateiübertragung | Dateien nur über eine Übertragungszone mit Virenprüfung | FR 3 |
| Vertrag | Fernzugriffsregeln, Meldepflichten und Haftung im Servicevertrag | 2-4 |

### Praktische Tipps

- **Den sicheren Weg einfacher machen als den unsicheren.** Dauert die Freigabe nachts zwei Stunden, steckt jemand einen Mobilfunkrouter ein. Je Schicht einen erreichbaren Freigeber festlegen.
- **Die Boxen entfernen.** Jedes Fernzugriffsgerät im Inventar zählen und diejenigen entfernen oder deaktivieren, die nicht über das Gateway laufen. Viele Maschinenbauer liefern Linien mit eigenem Router; das in die Einkaufsspezifikation aufnehmen (Abschnitt 17).
- **Konten quartalsweise prüfen.** Konten von Lieferantenmitarbeitern löschen, die ausgeschieden sind.

## Patch- und Schwachstellenmanagement in der OT

In der Büro-IT lautet die Regel "schnell patchen". In der OT lautet sie "bewusst entscheiden". Ein Patch kann eine Herstellerfreigabe, einen Neustart der Steuerung, eine Revalidierung in regulierten Branchen oder einen vollständigen Linientest erfordern. In FDA-regulierten Werken (Pharma, Medizinprodukte, Lebensmittel; FDA ist die US-Aufsichtsbehörde) und unter Kundenanforderungen aus Automobil- oder Luftfahrtindustrie löst eine Änderung an einem validierten System meist das eigene Änderungs- und Validierungsverfahren aus; die Prüfzeit des Qualitätsteams in das Patchfenster einplanen. ISA-TR62443-2-3 behandelt das Patchmanagement in der IACS-Umgebung [1].

### Quellen für Schwachstelleninformationen

- Sicherheitswarnungen und Produktsicherheitsportale der Hersteller von SPS, HMI, Antrieben und Software.
- Die ICS Advisories der CISA, die Schwachstellen in Industrieprodukten veröffentlichen, oft in Abstimmung mit den Herstellern [zum aktuellen Umfang unbelegt; auf der Advisory-Seite der CISA prüfen].
- Das eigene OT-Überwachungswerkzeug, das Firmwarestände aus dem Inventar mit Warnungen abgleicht.

### Eine Entscheidungstabelle für jede Warnung

| Frage | Wenn ja | Wenn nein |
|---|---|---|
| Ist das betroffene Produkt in unserem Inventar? | weiter | schließen, dokumentieren |
| Wird die verwundbare Funktion in unserer Konfiguration genutzt oder ist sie erreichbar? | weiter | Grund dokumentieren; bei der nächsten Änderung erneut prüfen |
| Wird sie bekanntermaßen ausgenutzt oder gibt es einen öffentlichen Exploit? | Priorität hoch | Priorität nach Folgewert |
| Ist das Asset aus einer Zone mit geringerem Vertrauen oder aus der Ferne erreichbar? | Priorität hoch | Priorität mittel |
| Gibt der Hersteller den Patch für unsere Version frei? | Patch im nächsten Fenster einplanen | kompensierende Maßnahmen umsetzen |
| Lässt sich der Patch ohne Stillstand einspielen? | in der normalen Instandhaltung einplanen | im geplanten Stillstand einplanen |

### Kompensierende Maßnahmen, wenn nicht gepatcht werden kann

Wenn der Patch nicht verfügbar, nicht freigegeben oder vor dem nächsten Stillstand nicht möglich ist:

- Das Conduit einschränken: nur die Hosts und Protokolle erlauben, die das Asset brauchen.
- Nicht genutzte Dienste und Ports abschalten.
- Den Schlüsselschalter der Steuerung auf RUN stellen, um Programmänderungen aus der Ferne zu blockieren, wo die Steuerung das unterstützt.
- Die Überwachung des Assets verstärken (Alarme bei neuen Verbindungen oder Programm-Downloads).
- Das Restrisiko dokumentieren und die Freigabe des Betreibers einholen.

### Beispielentscheidung

Eine Warnung beschreibt eine aus der Ferne ausnutzbare Denial-of-Service-Schwachstelle im Webserver des SPS-Modells, das in Z3 Pressensteuerung eingesetzt wird. Das Inventar zeigt vier betroffene SPS. Der Webserver ist aktiviert, wird aber nicht genutzt. Die Firmwarekorrektur ist verfügbar, erfordert aber einen Neustart der Steuerung, und der Hersteller empfiehlt einen Funktionstest. Entscheidung: den Webserver auf allen vier SPS im nächsten Wochenendfenster abschalten (30 Minuten je Presse), HTTP und HTTPS zu den SPS im Conduit C4 sperren und die Firmware im geplanten Stillstand in acht Wochen einspielen. Das Zwischenrisiko wird dokumentiert und von der Leitung Werkstechnik freigegeben.

### Alt- und End-of-Life-Systeme

Jedes Werk hat Systeme, die nie wieder einen Patch bekommen: HMIs auf nicht mehr unterstützten Windows-Versionen, Steuerungen, die der Hersteller abgekündigt hat. Sie als Lebenszyklusproblem mit Budget behandeln, nicht als Security-Ausnahme, die ewig verlängert wird. Das Inventarfeld "Supportstatus beim Hersteller" speist einen Austauschplan, der mit Linienumbauten und der Investitionsplanung abgestimmt ist.

## Konten, Härtung und Wechseldatenträger

Bei FR 1 bis FR 3 haben Werke die sichtbarsten Lücken und die günstigsten Lösungen.

### Konten und Identitäten

- **Gemeinsame Logins abschaffen, wo das System es unterstützt.** Konten wie "Bediener", "Instandhaltung" und "Admin", die eine ganze Schicht teilt, machen jede Änderung unnachvollziehbar. Viele aktuelle HMIs und SCADA-Systeme unterstützen benannte Konten oder Anmeldung per Ausweis; ältere unter Umständen nicht.
- **Getrennte Administratorkonten.** Ingenieure nutzen ein normales Konto für E-Mail und ein separates für die OT-Administration, nie dasselbe.
- **Standardpasswörter ändern** auf jedem Gerät, das welche hat: Switches, Router, HMIs, Robotersteuerungen, Kameras. Das als Punkt in die Inbetriebnahme-Checkliste aufnehmen.
- **MFA nutzen, wo sich ein Mensch aus der Ferne oder an der IDMZ anmeldet.** Auf dem Shopfloor ist MFA an einem HMI oft unpraktisch; das mit physischer Zugangskontrolle und kurzen Bildschirmsperren ausgleichen, wo der Prozess es zulässt.
- **Den Helpdesk schützen.** Der Fall Clorox zeigt, dass ein Social-Engineering-Anruf beim IT-Helpdesk zu privilegiertem Zugriff führen kann [20]. Für das Zurücksetzen von Passwörtern und MFA eine Identitätsprüfung verlangen, mit strengeren Prüfungen für privilegierte Konten.

### Härtung Windows-basierter OT-Systeme

HMIs, SCADA-Server, Historians und Engineering-Workstations sind meist Windows-Rechner. Ihre Härtung folgt den Herstellervorgaben:

1. Software und Dienste entfernen, die das System nicht braucht (minimale Funktion).
2. Application Allowlisting statt oder zusätzlich zum Virenschutz verwenden, wo der Hersteller das unterstützt.
3. USB-Ports deaktivieren oder einschränken.
4. Lokale Administratorrechte einschränken.
5. Ein bekannt gutes Image und die Installationsmedien für einen schnellen Neuaufbau bereithalten.

### Steuerungen

- Den Schlüsselschalter oder Softwareschutz in RUN halten, wo die Steuerung das bietet, und jeden Wechsel in den Modus PROGRAM protokollieren.
- Die aktuelle Logik offline speichern und Prüfsummen oder Projektversionen regelmäßig vergleichen, um unbefugte Änderungen zu erkennen (FR 3).
- Nicht genutzte Dienste abschalten (Webserver, FTP, SNMP-Schreibzugriff).

### Wechseldatenträger

USB-Sticks und Laptops tragen Schadsoftware über jede Netzwerkgrenze. Ein einfaches Regelwerk:

| Regel | Umsetzung |
|---|---|
| Keine privaten Datenträger | schriftliche Richtlinie, Schulung, Beschilderung an den Stationen |
| Vor Gebrauch prüfen | ein Prüfkiosk (Schleusen-PC) am Werkseingang oder in der IDMZ |
| Nur Firmendatenträger | verschlüsselte, inventarisierte USB-Sticks für das Engineering |
| Netzwerkweg bevorzugen | Dateiübertragung über den Server in der IDMZ statt per USB |
| Technische Durchsetzung | USB-Ports auf HMIs und Servern per Richtlinie deaktiviert oder eingeschränkt |

## Überwachung und Angriffserkennung

FR 6 (rechtzeitige Reaktion auf Ereignisse) verlangt, dass Vorfälle bemerkt werden. In der OT hat die Erkennung zwei Quellen: Protokolle und Netzwerkverkehr.

### Was protokolliert werden sollte

| Quelle | Ereignisse | Nutzen |
|---|---|---|
| Firewalls an Conduits | erlaubte und abgelehnte Verbindungen | unerwarteter Verkehr zwischen Zonen |
| Fernzugriffs-Gateway | Anmeldungen, Freigaben, Sitzungsaufzeichnungen | Überprüfung der Lieferantenaktivität |
| OT-Active-Directory und Jump Hosts | Anmeldungen, Rechteänderungen, neue Konten | Kontomissbrauch |
| Engineering-Workstations | Softwarestarts, Projekt-Downloads | unbefugte Logikänderungen |
| Steuerungen (wo unterstützt) | Moduswechsel, Programm-Downloads, Firmware-Updates | Integrität |
| Backupsystem | Erfolg und Fehlschlag von Jobs | Wiederherstellungsbereitschaft |

### Passive OT-Netzwerküberwachung

Spezialisierte OT-Überwachungswerkzeuge dekodieren Industrieprotokolle und lernen das normale Kommunikationsmuster eines Werks. Danach melden sie Abweichungen: ein neues Gerät, eine neue Verbindung zwischen Zonen, einen Programm-Download außerhalb eines Instandhaltungsfensters oder einen Befehl von einem ungewöhnlichen Host. Weil sie nur kopierten Verkehr mithören, beeinflussen sie den Prozess nicht. Der Entwurf von NIST SP 800-82 Rev. 4 erweitert seine Hinweise zu Netzwerküberwachung und Erkennung [10].

### Wer die Alarme beobachtet

Ein Alarm, den niemand liest, kostet ohne Nutzen. Möglichkeiten für ein mittelgroßes Werk:

- **Security Operations Center (SOC) des Konzerns** mit einem OT-Playbook und einem benannten Automatisierungstechniker in Rufbereitschaft im Werk.
- **Managed Detection Service** eines Anbieters mit OT-Erfahrung.
- **Prüfung auf Werksebene** für eine kleine Zahl hochwertiger Alarme (neues Gerät, Programm-Download, Fernsitzung ohne Freigabe), der Rest wird an das SOC weitergeleitet.

Wie auch immer die Wahl ausfällt: festlegen, wer welche Maßnahme ergreifen darf. Ein SOC-Analyst sollte niemals allein eine Linie abschalten können; das Playbook legt fest, wer entscheidet.

## Backup, Wiederherstellung und OT-Incident-Response

Hier kommen FR 7 (Verfügbarkeit von Ressourcen) und die Funktionen "Respond" und "Recover" des CSF 2.0 zusammen [11]. Der Fall Norsk Hydro ist das klassische Beispiel: Das Unternehmen hielt große Teile der Produktion mit manuellen Verfahren am Laufen und schätzte seine Gesamtkosten später auf etwa 800 Mio. NOK [17].

### Was gesichert werden sollte

| Element | Häufigkeit | Speicherung | Wiederherstellungstest |
|---|---|---|---|
| Programme von SPS, Sicherheits-SPS und Robotern | nach jeder Änderung und monatlich | Offline- und externe Kopie | jährlich je kritischer Steuerung, auf einem Ersatzgerät oder Simulator |
| HMI- und SCADA-Projekte | nach jeder Änderung | offline und extern | jährlich |
| Server-Images (MES, Historian, SCADA, OT-Domänencontroller) | wöchentlich voll, täglich inkrementell | unveränderliche oder Offline-Kopie | zweimal im Jahr, vollständiger Neuaufbau eines Servers |
| Konfigurationen der Netzwerkgeräte | nach jeder Änderung | offline | jährlich |
| Firmware und Installationsmedien | bei Aktualisierung | Offline-Bibliothek | Vollständigkeit jährlich prüfen |
| Dokumentation (Zeichnungen, Zonenmodell, Inventar, Export des Passworttresors) | monatlich | offline, gedruckte Kopie des Wesentlichen | bei der Planspielübung prüfen |

### Das OT-Incident-Playbook

Ein OT-Playbook unterscheidet sich von einem IT-Playbook darin, wer entscheidet und was zuerst kommt.

| Phase | OT-spezifischer Inhalt |
|---|---|
| Vorbereitung | Kontaktliste einschließlich Maschinenbauer und Steuerungshersteller; Entscheidungsbefugnisse; Ersatz-Engineering-Laptop mit sauberen Images; manuelle Betriebsverfahren je Bereich |
| Erkennung und Analyse | gemeinsame Telefonkonferenz von IT-Security, Leitung Automatisierungstechnik und Produktionsleitung innerhalb einer festgelegten Zeit; erste Frage: Ist die Sicherheit betroffen? |
| Eindämmung | vorab vereinbarte Optionen: Unternehmen von der IDMZ trennen, IDMZ vom Werk trennen, einzelne Zonen isolieren. Wer welchen Stecker ziehen darf, mit welchem Risiko für die Produktion |
| Sicherer Zustand | die Prozesssicherheit entscheidet, ob weiterlaufen, manuell weiterlaufen oder sicher abschalten; Sicherheitssysteme werden nie deaktiviert, um der Wiederherstellung zu "helfen" |
| Beseitigung und Wiederherstellung | Neuaufbau aus bekannt guten Images; Steuerungslogik vor dem Neustart gegen Offline-Backups prüfen; gestufter Neustart Zone für Zone |
| Meldung | Recht und Kommunikation: Wesentlichkeitsprüfung nach SEC-Regeln für börsennotierte US-Unternehmen, Kundenbenachrichtigungen, Versicherer, Strafverfolgung, Meldungen nach NIS2 oder CRA für EU-Pflichten (Abschnitt 19) |
| Lessons Learned | Grundursache, aktualisiertes Zonenmodell und Playbook |

### Üben

Mindestens einmal im Jahr eine Planspielübung (Tabletop Exercise) mit Produktion, Instandhaltung, IT, Arbeits- und Umweltschutz, Kommunikation und Geschäftsleitung durchführen. Ein nützliches erstes Szenario: "Ransomware hat das MES und das ERP verschlüsselt. Die Linien laufen. Laufen wir weiter, und wie verfolgen wir, was wir bauen und versenden?" Die Antwort zeigt, ob es manuelle Rückfallverfahren gibt.

Die CISA-CPGs betonen Governance und messbare Grundlagenpraktiken, einschließlich der Planung der Incident Response; CPG 2.0 hat im Dezember 2025 eine Governance-Komponente ergänzt [13].

## Anforderungen an Lieferanten und Einkauf

Der größte Teil des Security Levels eines Werks wird gekauft, nicht gebaut. Jede neue Maschine, Linie und jedes neue Steuerungssystem ist eine Gelegenheit, es zu erhöhen. Die 62443 liefert das Vokabular für die Einkaufsspezifikation (Lastenheft): 4-1 und 4-2 für Produkte, 2-4 für Integratoren und Dienstleister und 3-3 für das gelieferte System.

### Zertifizierungen, die man verlangen kann

ISASecure, eine 2007 gegründete hundertprozentige Tochter der ISA, betreibt Zertifizierungsprogramme auf Basis der 62443 [7]:

| Programm | Was zertifiziert wird | Grundlage |
|---|---|---|
| ISASecure CSA | Komponenten (Steuerungen, HMIs, Netzwerkgeräte, Software) | IEC 62443-4-2 [7] |
| ISASecure SSA | Systeme | IEC 62443-3-3 [7] |
| ISASecure SDLA | der sichere Entwicklungsprozess eines Herstellers | IEC 62443-4-1 [7] |
| ISASecure ACSSA | ein betriebenes IACS an einem Standort: Richtlinien, Verfahren, Dienstleister und technische Maßnahmen, beginnend mit der Risikobewertung des Betreibers | IEC 62443-2-1, 2-4, 3-2 und 3-3; angekündigt am 18. Juni 2025 [8] |

Es gibt auch Zertifikate anderer Konformitätsbewertungssysteme (das Cybersecurity-Programm IECEE der IEC ist die wichtigste Alternative zu ISASecure, wie ein von der ISA veröffentlichtes ISASecure-Whitepaper beschreibt [37]). Ein Zertifikat ist ein Nachweis, keine Garantie: zertifizierte Produktversion und Security Level mit dem abgleichen, was gekauft wird.

### Klauseln für die Einkaufsspezifikation (Vorlage)

| Thema | Beispielanforderung |
|---|---|
| Norm | Der Lieferant erfüllt IEC 62443-4-1 (Produkt) und IEC 62443-2-4 (Integration) in der zum Bestelldatum aktuellen Ausgabe; Nachweis: Zertifikat oder Selbstbewertung gegen die aufgeführten Anforderungen |
| Security Level | Komponenten und gelieferte Anlage erfüllen SL-C 2 (SL-C 3 für die Zonen Z4, Z8) nach IEC 62443-4-2 / 3-3 |
| Zoneneignung | Maschine wird als eine Zone mit definierter Conduit-Schnittstelle geliefert; dokumentierte Liste aller Ports, Protokolle und Dienste |
| Fernzugriff | keine eingebauten Modems oder Router; Fernwartung nur über das Gateway des Betreibers |
| Konten | benannte Benutzerkonten mit rollenbasierten Rechten; keine fest codierten oder undokumentierten Konten; Standardpasswörter bei Inbetriebnahme geändert |
| Härtung | nicht genutzte Dienste deaktiviert; Härtungsleitfaden wird mitgeliefert |
| Patchen | der Lieferant veröffentlicht Sicherheitswarnungen, testet Betriebssystem- und Firmwarepatches innerhalb einer festgelegten Frist und unterstützt das Produkt für einen festgelegten Zeitraum |
| SBOM | Software-Stückliste (Software Bill of Materials) für gelieferte Software und Firmware |
| Backups | gelieferte Programme und Projekte in bearbeitbarer Form, mit Anleitung zur Wiederherstellung |
| Dokumentation | Netzwerkplan, Asset-Liste in der Vorlage des Betreibers, Anforderungen an Firewallregeln |
| Prüfung | Security-Abnahmetest (Portscan in einer Testumgebung, Prüfung der Konten) als Teil von Werksabnahme (FAT) und Abnahme vor Ort (SAT) |
| Meldepflichten | der Lieferant meldet dem Betreiber Schwachstellen und Vorfälle, die die gelieferte Anlage betreffen, innerhalb einer festgelegten Frist |

Der CRA (Abschnitt 19) macht mehrere dieser Anforderungen für Produkte, die auf dem EU-Markt in Verkehr gebracht werden, zu gesetzlichen Pflichten, darunter Sicherheitsupdates und eine SBOM [22][23]. US-Käufer profitieren davon auch für reine US-Werke, weil dieselben Produkte weltweit verkauft werden.

### Integratoren und Dienstleister

Das Integrator-Merkblatt von CISA und FBI vom September 2026 ergänzt die Sicht des Betreibers: Cybersecurity- und Lieferkettenanforderungen in Verträge und Serviceverträge aufnehmen, festlegen, wo Daten und Geräte gehostet werden, und den Zugriff von Integratoren begrenzen und überwachen [14]. Von Dienstleistern ihre Nachweise nach 62443-2-4 verlangen und ihren Fernzugriff und Datenumgang so prüfen, wie man das Arbeitssicherheitsprogramm eines Fremdfirmen-Auftragnehmers prüfen würde.

## Mensch, Sicherheit und Shopfloor

OT-Security scheitert, wenn sie im IT-Büro entworfen und dem Shopfloor übergestülpt wird. Die Menschen, die die Maschinen bedienen, sind die erste Verteidigungslinie und zugleich die Ersten, die unter schlecht gestalteten Maßnahmen leiden.

### Rollen und Verantwortlichkeiten (Beispiel für einen mittelgroßen Standort)

| Rolle | Verantwortung für die OT-Security |
|---|---|
| Werksleitung | Betreiber (Asset Owner); gibt Risikobewertungen und Restrisiken frei; verantwortet das Budget |
| OT-Security-Verantwortlicher (oft ein Automatisierungstechniker, anfangs in Teilzeit) | Zonenmodell, Inventar, Regeln, Koordination bei Vorfällen |
| IT-Security des Konzerns / CISO | Unternehmenszone, Identität, SOC, Richtlinien, Abstimmung mit dem CSF 2.0 |
| Automatisierungstechnik | sichere Konfiguration, Backups, Änderungskontrolle der Logik |
| Instandhaltung | physischer Zugang, Regeln für Wechseldatenträger, Ersatzteile |
| Arbeits- und Umweltschutz (EHS) / Prozesssicherheit | verknüpft PHA/HAZOP mit Security-Folgen; gibt Sicherheitszonen frei |
| Einkauf | Security-Klauseln in Spezifikationen und Verträgen |
| Meister, Schichtführer und Werker | Auffälligkeiten melden, Zugangs- und Datenträgerregeln befolgen, den manuellen Rückfallbetrieb fahren |

### Safety und Security zusammen

Sicherheitsingenieure (Safety) und Security-Ingenieure verwenden oft unterschiedliche Wörter für Ähnliches: Gefährdungen und Bedrohungen, SIL und SL, PHA und Risikobewertung. Sie gehören in einen Raum. Zwei Regeln sind nicht verhandelbar:

- Security-Maßnahmen dürfen eine Sicherheitsfunktion nie deaktivieren oder verschlechtern.
- Eine Security-Incident-Response darf die Entscheidung des Sicherheitsteams über den sicheren Zustand nie umgehen.

### Schulungen, die Werker annehmen

- Melden sicher machen. Ein Werker, der zugibt, ein Handyladegerät eingesteckt zu haben, sollte Dank bekommen, keine Abmahnung; sonst bleibt der nächste Vorfall ungemeldet.
- Kurze, rollenspezifische Module: was ein Werker melden sollte (unbekannte USB-Sticks, unerwartetes Verhalten des HMI, Fremde, die nach Zugang fragen), keinen allgemeinen Phishing-Kurs.
- Das Warum erklären. Werker verstehen Lockout/Tagout, weil sie wissen, was es verhindert. Security-Regeln brauchen dieselbe Erklärung.
- Die Belegschaft an der Gestaltung von Maßnahmen beteiligen, die sie betreffen, etwa Anmeldung per Ausweis am HMI oder Bildschirmsperren. In gewerkschaftlich organisierten Werken müssen Änderungen an Arbeitsregeln oder an der Überwachung unter Umständen mit der Gewerkschaft besprochen werden; Personalabteilung und Arbeitnehmerbeziehungen früh einbinden [allgemeiner Hinweis; den Tarifvertrag prüfen].

Zur breiteren Routine der täglichen Problemlösung auf dem Shopfloor siehe den Leitfaden [Shopfloor Management](https://www.m365.fm/learn/shop-floor-management/); eine Security-Auffälligkeit ist ein weiterer Punkt für die tägliche Regelkommunikation.

## Pflichten in den USA und der EU: CMMC, SEC, CIRCIA, NIS2 und der CRA

Die 62443 selbst ist freiwillig. Die folgenden Pflichten sind es nicht. Welche gelten, hängt von Kunden, Eigentümerstruktur und Absatzmärkten ab.

### CMMC 2.0 für Rüstungszulieferer

Wer Teile für das US-Verteidigungsministerium (Department of Defense, DoD) fertigt, für den gilt die Cybersecurity Maturity Model Certification (CMMC) für Systeme, die Federal Contract Information (FCI) oder Controlled Unclassified Information (CUI) verarbeiten, speichern oder übertragen. Die Programmregel (32 CFR Part 170) trat am 16. Dezember 2024 in Kraft [28]. Die DFARS-Regel, die CMMC in Verträge bringt, trat am 10. November 2025 in Kraft, mit einer stufenweisen Einführung über drei Jahre: Phase 2 begann am 10. November 2026, Phase 3 ist für den 10. November 2027 geplant [29]. Level 2 basiert auf NIST SP 800-171 [28][29].

Was das für den Shopfloor heißt:

- **Der Geltungsbereich hängt an Daten, nicht an Maschinen.** Eine CNC-Maschine, die Zeichnungen oder Programme mit CUI-Kennzeichnung erhält, kann im Geltungsbereich liegen. Eine Steuerung, die nur ein Förderband steuert, meist nicht. Die CUI-Kennzeichnungen und der Vertrag entscheiden.
- **Zonen nutzen, um den Geltungsbereich zu begrenzen.** Ein gut segmentiertes Zonenmodell kann die Bewertungsgrenze für CMMC klein halten. Das ist eines der klarsten finanziellen Argumente für Segmentierung in Rüstungslieferketten.
- **Sonderfälle.** Für Level 2 führt 32 CFR 170.19(c)(1) OT-, IIoT- und IoT-Geräte, Prüfmittel, vom Staat beigestellte Ausrüstung und eingeschränkte Informationssysteme als "Specialized Assets": Assets, die CUI verarbeiten, speichern oder übertragen können, sich aber nicht vollständig absichern lassen. Sie müssen im Asset-Inventar und im System Security Plan (SSP) stehen, nach den risikobasierten Security-Richtlinien des Unternehmens gemanagt werden und im Netzwerkplan erscheinen; der Prüfer sichtet den SSP, bewertet sie aber nicht gegen die übrigen CMMC-Anforderungen [38].

Zur Planungsseite der Rüstungsarbeit behandelt der Leitfaden [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/) CMMC, ITAR und DFARS im Kontext von AS9100-Lieferketten.

### SEC-Regeln für börsennotierte Unternehmen

Nach den am 26. Juli 2023 verabschiedeten Regeln der US-Börsenaufsicht SEC müssen registrierte Unternehmen einen wesentlichen Cybersecurity-Vorfall innerhalb von vier Geschäftstagen, nachdem seine Wesentlichkeit festgestellt wurde, im Formular 8-K offenlegen und im Jahresbericht ihr Cybersecurity-Risikomanagement, ihre Strategie und ihre Governance beschreiben [26]. Ein Ransomware-Angriff, der ein Werk stoppt, ist ein typischer Kandidat für eine Wesentlichkeitsprüfung; das OT-Playbook braucht deshalb einen schnellen Weg zum Disclosure Committee.

### CIRCIA

Der Cyber Incident Reporting for Critical Infrastructure Act wird erfasste Einrichtungen in den USA verpflichten, erfasste Cybervorfälle innerhalb von 72 Stunden und Lösegeldzahlungen innerhalb von 24 Stunden an die CISA zu melden, sobald die endgültige Regel der CISA in Kraft tritt. Mit Stand Oktober 2026 war die endgültige Regel zur Prüfung an das Weiße Haus gegangen und nicht veröffentlicht [27]; am 9. November 2026 lag sie dort nach Eingang am 1. Oktober 2026 noch zur Prüfung [39]. Die kritische Fertigung ist ein Sektor der kritischen Infrastruktur [32]; deshalb verfolgen, welche Fertiger die endgültige Regel erfasst.

### NIS2 für US-Unternehmen mit EU-Standorten

Die EU-Richtlinie NIS2 gilt über nationale Gesetze für wesentliche und wichtige Einrichtungen in der EU, darunter viele Fertigungssektoren. Ein US-Unternehmen ist über seine EU-Tochtergesellschaften und Werke betroffen. Das deutsche Umsetzungsgesetz trat am 6. Dezember 2025 in Kraft; das Bundesamt für Sicherheit in der Informationstechnik (BSI) gibt an, dass es nun etwa 29.500 Einrichtungen beaufsichtigt statt etwa 4.500 [24]. In Deutschland fallen Unternehmen in den Geltungsbereich, wenn sie zu den aufgeführten Einrichtungsarten gehören und mindestens 50 Beschäftigte haben oder sowohl beim Jahresumsatz als auch bei der Bilanzsumme mehr als 10 Mio. EUR erreichen; zu den Einträgen der Fertigung gehören Medizinprodukte, Computer und Elektronik, elektrische Ausrüstungen, Maschinen und Fahrzeuge [25][40]. Erhebliche Sicherheitsvorfälle erfordern eine Frühwarnung innerhalb von 24 Stunden, eine Meldung innerhalb von 72 Stunden und einen Abschlussbericht innerhalb eines Monats [25]. Andere Mitgliedstaaten haben ähnliche Regeln mit lokalen Besonderheiten; für jedes Land mit einem Werk prüfen.

### Cyber Resilience Act für Maschinenbauer und Komponentenhersteller

Wer Maschinen, Steuerungen oder Software mit digitalen Elementen auf dem EU-Markt verkauft, für den gilt der Cyber Resilience Act (Verordnung (EU) 2024/2847), auch für US-Hersteller. Seit dem 11. September 2026 müssen Hersteller aktiv ausgenutzte Schwachstellen und schwerwiegende Vorfälle über die Single Reporting Platform der ENISA melden: eine Frühwarnung innerhalb von 24 Stunden, eine Meldung innerhalb von 72 Stunden, einen Abschlussbericht innerhalb von 14 Tagen, nachdem eine Korrekturmaßnahme verfügbar ist (Schwachstellen), oder innerhalb eines Monats (Vorfälle) [22]. Die wesentlichen Produktanforderungen gelten ab dem 11. Dezember 2027 [23]. Für Maschinenbauer wird damit eine sichere Entwicklung im Stil der 62443-4-1 zur Produktkonformität.

### Cyberversicherung

Versicherer stellen zunehmend detaillierte Fragen zur OT: Segmentierung, Fernzugriff, Offline-Backups, MFA. Der Fall Merck zeigt, wie viel vom Wortlaut der Police abhängen kann; ein Berufungsgericht in New Jersey entschied, dass der Kriegsausschluss in Mercks Sachversicherungspolicen nicht für NotPetya galt, bevor sich die Parteien einigten [18]. Mit dem Makler prüfen, ob die Policen Produktionsausfälle durch Cyberereignisse abdecken und unter welchen Bedingungen [allgemeiner Hinweis].

## Ein Fahrplan für 12 bis 24 Monate

Der folgende Fahrplan gilt für einen einzelnen mittelgroßen Standort wie den in Abschnitt 9, mit einem OT-Security-Verantwortlichen mit etwa einer halben Vollzeitstelle im ersten Jahr (unsere Planungsannahme), Unterstützung durch die Konzern-IT und einen externen Partner für bestimmte Aufgaben wie den Workshop zur Risikobewertung und den Entwurf der Segmentierung. Unternehmen mit mehreren Standorten führen Phase 0 zentral durch und die Phasen 1 bis 4 je Standort, beginnend mit dem Werk mit dem höchsten Risiko oder den meisten anstehenden Investitionsprojekten.

| Phase | Monate | Ziele | Wichtigste Ergebnisse | Bezug 62443 / CSF |
|---|---|---|---|---|
| 0. Mandat | 0-1 | Verantwortung und Umfang | benannter Betreiberverantwortlicher und OT-Security-Verantwortlicher, Lenkungskreis, Umfang des ersten betrachteten Systems, Budget für Jahr 1 | 2-1; CSF Govern |
| 1. Kennen und die Blutung stoppen | 1-6 | Transparenz und schnelle Risikominderung | Asset-Inventar (erster Durchgang), Verkehrskarte, Liste der Fernzugriffswege; unkontrollierten Fernzugriff entfernen oder umleiten; Offline-Backups aller Steuerungslogik; Standardpasswörter geändert; Regeln für Wechseldatenträger; erste Planspielübung | 3-2 ZCR 1-2; CSF Identify, Protect |
| 2. Architektur | 4-12 | Eindämmung | Zonen- und Conduit-Modell mit SL-T, vom Betreiber freigegeben; IDMZ aufgebaut; Verkehr vom Unternehmen ins Werk nur über die IDMZ; Fernzugriffs-Gateway mit MFA und Aufzeichnung; OT-Domäne oder Kontentrennung | 3-2 ZCR 3-7; 3-3 FR 5; CSF Protect |
| 3. Erkennen und reagieren | 9-18 | Sehen und handeln | passive OT-Überwachung an wichtigen Conduits; Logsammlung; SOC-Playbook mit Entscheidungsbefugnissen; schriftliches OT-Incident-Playbook; Wiederherstellungstests | 3-3 FR 6, FR 7; CSF Detect, Respond, Recover |
| 4. Härten und richtig einkaufen | 12-24 | SL-A erhöhen, neue Lücken verhindern | interne Segmentierung abgeschlossen; Härtung der Windows-OT-Systeme; Entscheidungsprozess für Patches läuft; Security-Klauseln in allen neuen Einkaufsspezifikationen; Integratoranforderungen nach 2-4; Kennzahlenberichte an die Geschäftsleitung | 2-3, 2-4, 4-1, 4-2; CSF Govern |
| 5. Betreiben und verbessern | ab 24 | Programm im Regelbetrieb | jährliche Aktualisierung der Risikobewertung, jährliche Planspielübung, internes Audit, optional ACSSA oder eine andere Standortbewertung | 2-1; CSF alle Funktionen |

### Was in den ersten 30 Tagen zu tun ist

1. Den Betreiberverantwortlichen (meist die Werksleitung) und den OT-Security-Verantwortlichen benennen.
2. Jeden bekannten Fernzugriffsweg auflisten und jeden Maschinenbauer fragen, wie er sich verbindet.
3. Prüfen, ob es Offline-Kopien der aktuellen Programme der kritischsten Steuerungen gibt.
4. Herausfinden, ob Büronetz und Werksnetz ohne Firewall ineinander geroutet sind.
5. Das NIST MEP oder das Security-Team des Konzerns um eine CSF-basierte Selbstbewertung bitten [30].
6. Eine zweistündige Planspielübung mit dem Szenario "MES und ERP sind verschlüsselt" ansetzen.

Keiner dieser Schritte braucht neue Technik. Sie liefern die Fakten, auf denen das Budget für Phase 2 aufbaut.

### Den Fahrplan in die Werksrealität einpassen

- **Geplante Stillstände nutzen.** Segmentierung und Firmwareänderungen brauchen Fenster; sie ein Jahr im Voraus mit der Instandhaltung planen.
- **Auf Investitionsprojekten mitfahren.** Eine neue Linie ist der günstigste Moment, eine saubere Zone mit sicherem Fernzugriff und benannten Konten aufzubauen.
- **Nicht mit dem Werkzeug beginnen.** Wer eine Überwachungsplattform kauft, bevor Inventar und Zonenmodell existieren, erzeugt Alarme, die niemand deuten kann.

## Budget und ROI: die Investition begründen

OT-Security erzeugt keinen Umsatz. Sie senkt Wahrscheinlichkeit und Auswirkung eines Schadens. Die Begründung hat deshalb drei Teile: vermiedener erwarteter Schaden, ermöglichender Nutzen und Pflichten.

### Kostenkategorien

| Kategorie | Typische Posten | Capex oder Opex |
|---|---|---|
| Architektur | Firewalls für IDMZ und Conduits, Managed Switches, IDMZ-Server, Fernzugriffs-Gateway | überwiegend Capex (Hardware), Opex für Abonnements |
| Transparenz | OT-Überwachungsplattform, Sensoren, Netzwerk-TAPs | Capex oder Abonnement |
| Personal | OT-Security-Verantwortlicher (Teil- oder Vollzeit), Schulung, externe Spezialisten | Opex |
| Dienstleistungen | Unterstützung bei der Risikobewertung, Entwurf der Segmentierung, SOC oder Managed Detection | Opex |
| Austausch | Erneuerung von End-of-Life-HMIs und -Steuerungen | Capex, idealerweise im Rahmen von Linienumbauten |
| Wiederherstellung | Backupsysteme, Ersatz-Engineering-Workstations, Ersatzsteuerungen | Capex |

Allgemeine Dollarbeträge nennen wir hier nicht, weil keine überprüfbare US-Quelle einen verlässlichen Vergleichswert für ein Werk bestimmter Größe bietet; die Preise hängen von der Zahl der Zonen, dem Alter der Anlagen und den Herstellern ab. Nach Phase 1 zwei oder drei Angebote mit festgelegtem Umfang einholen.

### Erwarteter Schaden: ein Rechenbeispiel

Die jährliche Schadenserwartung (Annualized Loss Expectancy, ALE) ist ein einfacher Weg, Risiko in die Sprache des Controllings zu übersetzen:

ALE = jährliche Eintrittsrate (Annual Rate of Occurrence, ARO) x Schadenserwartung je Ereignis (Single Loss Expectancy, SLE)

Für Midwest Components (Abschnitt 9) schätzt das Team aus Controlling und Betrieb die Kosten eines Ransomware-Ereignisses, das das Werk stoppt:

| Posten | Annahme | Betrag |
|---|---|---|
| Entgangener Deckungsbeitrag | 10 Produktionstage x 160.000 USD Deckungsbeitrag pro Tag | 1.600.000 USD |
| Überstunden und Eilaktionen zum Abbau des Rückstands | Schätzung | 350.000 USD |
| Ausschuss und Nacharbeit aus unterbrochenen Chargen | Schätzung | 120.000 USD |
| Dienstleistungen für Incident Response und Wiederherstellung | Schätzung | 400.000 USD |
| Vertragsstrafen von Kunden | Vertragsbedingungen mit zwei OEM-Kunden | 250.000 USD |
| **SLE (Schadenserwartung je Ereignis)** | | **2.720.000 USD** |

Ohne das Programm schätzt das Team die jährliche Wahrscheinlichkeit eines solchen Ereignisses auf 10 % (ARO 0,10); mit abgeschlossenen Phasen 1 bis 3 erwartet es, dass das Ereignis sowohl unwahrscheinlicher (ARO 0,04, weil Segmentierung und kontrollierter Fernzugriff die häufigsten Wege schließen) als auch kürzer wird (5 statt 10 Tage, weil Backups und Playbooks getestet sind). Das senkt die SLE auf etwa 1.640.000 USD (5 Tage x 160.000 USD = 800.000 USD, halbe Überstunden mit 175.000 USD, unveränderter Ausschuss von 120.000 USD, Kosten der Incident Response von 300.000 USD und unveränderte Vertragsstrafen von 250.000 USD, gerundet).

- ALE vorher: 0,10 x 2.720.000 USD = 272.000 USD pro Jahr
- ALE nachher: 0,04 x 1.640.000 USD = 65.600 USD pro Jahr
- Risikominderung: 272.000 USD - 65.600 USD = 206.400 USD pro Jahr

Kostet das Programm 450.000 USD über zwei Jahre plus 120.000 USD pro Jahr an laufenden Kosten, beträgt die einfache Amortisation allein über die Risikominderung: (450.000 USD) / (206.400 USD - 120.000 USD) = etwa 5,2 Jahre. Das wirkt bescheiden, und es sollte ehrlich so dargestellt werden. Die Annahmen sind Schätzungen; besonders die ARO ist unsicher. Eine Bandbreite zeigen (zum Beispiel ARO 0,05 bis 0,20) und die Geschäftsleitung sehen lassen, wie sich das Ergebnis ändert. Mit ARO 0,20 vorher und 0,06 nachher beträgt die jährliche Minderung 544.000 USD - 98.400 USD = 445.600 USD, und die Amortisation sinkt auf etwa 1,4 Jahre.

Alle Zahlen in diesem Beispiel sind beispielhafte Annahmen, keine Branchenvergleichswerte.

### Nutzen über die Schadensvermeidung hinaus

- **Kunden- und Vertragsanforderungen:** CMMC bei Rüstungsaufträgen [28][29], Security-Fragebögen von OEM-Kunden, EU-Pflichten für EU-Standorte und -Produkte [22][24].
- **Versicherung:** bessere Antworten zu Segmentierung, MFA und Backups beeinflussen Versicherbarkeit und Konditionen [allgemeiner Hinweis; den Makler fragen].
- **Digitale Projekte ermöglichen:** eine saubere IDMZ und ein sauberes Conduit-Modell machen MES-, Historian- und Cloud-Projekte schneller und sicherer genehmigungsfähig. Siehe [Predictive Maintenance und IIoT](https://www.m365.fm/learn/predictive-maintenance-iiot/) (geplant) und [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/) für die Projekte, die davon abhängen.
- **Weniger selbst verursachte Ausfälle:** Asset-Inventar, Änderungskontrolle und getestete Backups verkürzen auch die Wiederherstellung nach gewöhnlichen Störungen, etwa einer defekten Festplatte in einem HMI.

### Capex und Opex

Firewalls und Server werden meist aktiviert; Abonnements, Managed Services und Personal sind Opex. Der Umstieg auf Abonnementwerkzeuge verschiebt Ausgaben von Capex zu Opex, was für Werke mit knappem Investitionsbudget, aber flexiblem Betriebsbudget wichtig ist. Früh mit dem Werkscontroller klären, wie das Programm eingeordnet wird; davon hängt ab, welcher Budgetverantwortliche freigeben muss.

## OT-Security-Kennzahlen

Wenige Kennzahlen messen, die Verhalten steuern. Sie monatlich an den Lenkungskreis und quartalsweise an die Geschäftsleitung berichten. Zur Gestaltung von Kennzahlen allgemein siehe den Leitfaden [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/).

| Kennzahl | Formel | Beispielziel | Warum sie zählt |
|---|---|---|---|
| Inventarabdeckung | Assets mit vollständigen Pflichtfeldern / von der Überwachung gesehene Assets x 100 | > 95 % | Grundlage für alles andere |
| Unkontrollierte Fernzugriffswege | Anzahl der Fernzugriffswege, die nicht über das Gateway laufen | 0 | häufigster Eintrittsweg |
| Zonen mit freigegebenem SL-T | Zonen mit unterschriebener Risikobewertung / alle Zonen x 100 | 100 % | zeigt, dass die Methode angewendet wird |
| Regelhygiene an Conduits | Firewallregeln mit Verantwortlichem, Grund und gültigem Überprüfungsdatum / alle Regeln x 100 | > 90 % | verhindert Wildwuchs bei Regeln |
| Kritische Steuerungen mit getesteter Wiederherstellung | Steuerungen mit Wiederherstellungstest in den letzten 12 Monaten / kritische Steuerungen x 100 | 100 % | Wiederherstellungsbereitschaft |
| Aktualität der Backups | Steuerungen, deren Offline-Backup dem laufenden Programm entspricht / alle Steuerungen x 100 | > 98 % | erkennt Abweichungen und unbefugte Änderungen |
| Mittlere Entscheidungszeit bei Warnungen | durchschnittliche Tage von der Veröffentlichung einer Warnung bis zur dokumentierten Entscheidung | < 30 Tage | der Patchprozess funktioniert |
| Abbau gemeinsamer Konten | Systeme, die noch gemeinsame Logins nutzen / Systeme im Geltungsbereich | sinkt jedes Quartal | Fortschritt bei FR 1 und FR 2 |
| Zeit bis zur Alarmbewertung | Median der Zeit von einem OT-Alarm hoher Priorität bis zur Bewertung | < 1 Stunde | die Erkennung ist nützlich |
| Planspielübungen | Übungen pro Jahr mit Beteiligung der Produktion | mindestens 1 | die Reaktion ist geübt |
| Neue Anlagen mit Security-Klauseln | Bestellungen von Automatisierungstechnik mit 62443-Klauseln / alle Bestellungen von Automatisierungstechnik x 100 | 100 % | verhindert neue Lücken |

**Rechenbeispiel.** Die Überwachung sieht 640 Assets; 598 haben alle Pflichtfelder. Inventarabdeckung = 598 / 640 x 100 = 93,4 %. Ziel um 1,6 Punkte verfehlt; Maßnahme: die 42 Datensätze vervollständigen, überwiegend im Schweißbereich.

Eitelkeitskennzahlen wie "Anzahl blockierter Verbindungen" vermeiden. Eine steigende Zahl kann besseren Schutz oder mehr Fehlkonfiguration bedeuten.

## Typische Fehler

1. **IT-Maßnahmen eins zu eins übernehmen.** Aktives Scannen, automatisches Patchen und Endpoint-Agenten auf Steuerungen haben schon Ausfälle verursacht. Alles zuerst mit dem Hersteller testen.
2. **Mit einem Werkzeugkauf beginnen.** Ohne Inventar und Zonenmodell erzeugt eine Überwachungsplattform nur Rauschen.
3. **Eine riesige Zone.** Eine Firewall zwischen Büro und Werk ist notwendig, aber ein flaches Werksnetz dahinter lässt Schadsoftware jede Linie erreichen.
4. **Zu viele Zonen.** Regeln, die niemand versteht, werden "vorübergehend" weit geöffnet und bleiben es.
5. **Fernwartungsboxen ignorieren.** Der Mobilfunkrouter im Maschinenschaltschrank umgeht die gesamte Architektur.
6. **Backups, die nie wiederhergestellt wurden.** Viele Werke stellen bei einem Vorfall fest, dass das Backup unvollständig oder alt ist.
7. **Keine Entscheidungsbefugnisse.** Bei einem Vorfall muss die Frage "Wer darf das Werk vom Netz trennen?" bereits beantwortet sein.
8. **Security ohne Produktion.** Maßnahmen, die ohne Werker und Instandhaltung entworfen werden, werden umgangen.
9. **Die 62443 als Zertifikatsprojekt behandeln.** Der Wert liegt in der Methode und der laufenden Routine, nicht im Papier.
10. **Helpdesk und Identität vergessen.** Clorox zeigt, dass ein Prozess zum Zurücksetzen von Identitäten das schwächste Glied sein kann [20].
11. **Neue Lücken einkaufen.** Jede Maschine, die ohne Security-Klauseln bestellt wird, fügt ein Altlastenproblem für die nächsten 20 Jahre hinzu.
12. **Einen "Air Gap" unterstellen.** Die meisten Werke, die glauben, physisch getrennt zu sein, haben mindestens eine unbekannte Verbindung.

## Grenzen der IEC 62443 und von OT-Security-Programmen

Die 62443 ist das beste verfügbare Rahmenwerk für die Security der industriellen Automatisierung, aber sie hat Grenzen, die man kennen sollte, bevor man ein Programm darauf aufbaut.

- **Kosten und Zugang.** Die Dokumente sind kostenpflichtig, und Industrial Cyber beziffert die gesamte Reihe auf mehr als 800 Seiten [34]. Kleine Werke lesen sie selten vollständig; Quick Start Guides und Berater füllen die Lücke, in unterschiedlicher Qualität.
- **Alter und Überarbeitung.** 3-3 stammt von 2013, und die zweiten Ausgaben von 3-2, 3-3 und 4-2 sind noch in Arbeit [1][6]. Einige Themen (Cloud, IIoT, containerisierte Edge-Systeme) werden nur von neueren PAS-Dokumenten wie 1-6 behandelt [5].
- **Urteil, keine Formel.** Die Norm verlangt, das SL-T nach Risiko festzulegen, sagt aber nicht genau, welches SL eine Presslinie braucht. Zwei qualifizierte Teams können zu unterschiedlichen Antworten kommen.
- **Security Levels sind keine Garantien.** Eine schlecht konfigurierte Komponente mit SL-C 3 ergibt SL-A 1. Zertifizierungen gelten für bestimmte Versionen und Konfigurationen.
- **Realität der Altanlagen.** Viele installierte Systeme können die SL-2-Anforderungen für FR 1 und FR 2 nicht erfüllen. Kompensierende Maßnahmen wirken, erhöhen aber die Komplexität.
- **Organisatorischer Aufwand.** 2-1 und 2-4 verlangen dokumentierte Prozesse; ML 2 und höher sind für ein kleines Werk und seine Integratoren ein echter Aufwand.
- **Kein Schutz gegen alles.** Segmentierung und Überwachung senken das Risiko; sie verhindern keinen entschlossenen, gut ausgestatteten Angreifer. Die Fähigkeit zur Wiederherstellung bleibt unverzichtbar.
- **Überschneidung der Rahmenwerke.** Die Zuordnung der 62443 zu CSF 2.0, SP 800-82, CMMC und NIS2 kostet Aufwand. Der entlang des CSF 2.0 neu aufgebaute Entwurf von SP 800-82 Rev. 4 sollte die NIST-Seite nach seiner Fertigstellung erleichtern [10].

## Glossar

| Begriff | Bedeutung |
|---|---|
| ACSSA | ISASecure-Zertifizierungsschema für Betriebsstandorte, auf Basis von 62443-2-1, 2-4, 3-2 und 3-3 [8] |
| ALE | Annualized Loss Expectancy (jährliche Schadenserwartung) = ARO x SLE |
| Betreiber (Asset Owner) | Organisation, die für das IACS verantwortlich ist [2] |
| ATT&CK for ICS | Wissensbasis von MITRE zu Taktiken und Techniken von Angreifern gegen industrielle Steuerungssysteme [15] |
| Conduit | logische Gruppierung von Kommunikationskanälen zwischen Zonen mit gemeinsamen Security-Anforderungen [2] |
| CPG | CISA Cybersecurity Performance Goals; Version 2.0 vom Dezember 2025 [13] |
| CRS | Cybersecurity Requirements Specification (Cybersecurity-Anforderungsspezifikation), Ergebnis der 62443-3-2 |
| CSA / SSA / SDLA | ISASecure-Zertifizierungen für Komponenten (4-2), Systeme (3-3) und Entwicklungsprozesse (4-1) [7] |
| CSF 2.0 | NIST Cybersecurity Framework 2.0 mit sechs Funktionen [11] |
| CUI / FCI | Controlled Unclassified Information / Federal Contract Information (Geltungsbereich von CMMC) |
| DCS (PLS) | Distributed Control System, Prozessleitsystem |
| Defense in Depth | mehrere Schutzschichten, um einen Angriff zu verzögern oder zu verhindern [2] |
| Essenzielle Funktionen | Funktionen, die für Gesundheit, Sicherheit, Umwelt und Verfügbarkeit der gesteuerten Anlage nötig sind [2] |
| FR | Foundational Requirement (grundlegende Anforderung); sieben in der 62443 (IAC, UC, SI, DC, RDF, TRE, RA) [2] |
| HMI | Human-Machine Interface, Bedienoberfläche |
| IACS | Industrial Automation and Control System |
| IDMZ | industrielle demilitarisierte Zone zwischen Unternehmen und Werk |
| IIoT | Industrial Internet of Things |
| Reifegrad (Maturity Level, ML) | Maß für die Prozessreife, ML 1 bis ML 4 in der 62443 [3] |
| MOC | Management of Change, Änderungsmanagement |
| OT | Operational Technology: Systeme, die mit der physischen Umgebung interagieren [9] |
| PLC (SPS) | Programmable Logic Controller, speicherprogrammierbare Steuerung |
| Purdue-Modell | geschichtete Referenzarchitektur (Ebenen 0 bis 5) zur Abbildung von Werksnetzen |
| SBOM | Software Bill of Materials, Software-Stückliste |
| SCADA | Supervisory Control and Data Acquisition |
| SIS | Safety Instrumented System, sicherheitstechnisches System |
| SL-T / SL-C / SL-A | Ziel-, Fähigkeits- und erreichtes Security Level [2] |
| SUC | System under Consideration, betrachtetes System (62443-3-2) |
| Zone | Gruppierung von Assets nach Risiko oder anderen Kriterien [2] |

## FAQ: OT-Security und IEC 62443

### Was ist OT-Security?

OT-Security schützt die Systeme, die physische Prozesse überwachen und steuern, etwa SPS, SCADA, HMIs, Roboter und Sicherheitssysteme, gegen Störung und Manipulation. Ihre Prioritäten sind zuerst Sicherheit und Verfügbarkeit, dann Integrität und Vertraulichkeit. NIST SP 800-82 Rev. 3 ist der wichtigste US-Leitfaden [9].

### Was ist der Unterschied zwischen IT- und OT-Security?

IT-Security schützt Daten und Geschäftssysteme, meist mit Vertraulichkeit an erster Stelle. OT-Security schützt physische Prozesse, bei denen eine ausgefallene Steuerung Menschen verletzen oder die Produktion stoppen kann. OT-Systeme leben länger, lassen sich schwerer patchen, nutzen oft Protokolle ohne Authentifizierung und werden nur in geplanten Fenstern geändert (Abschnitt 2).

### Was ist ISA/IEC 62443?

Eine Reihe internationaler Normen für die Security industrieller Automatisierungs- und Steuerungssysteme, entwickelt vom Komitee ISA99 und der IEC. Sie ist in vier Gruppen gegliedert (Allgemeines, Richtlinien und Verfahren, System, Komponente) und definiert Rollen, Zonen und Conduits, Security Levels und grundlegende Anforderungen [1][2].

### Was ist der Unterschied zwischen OT-Security und ICS-Security?

Im Alltag keiner. ICS-Security ist der ältere Begriff und bezieht sich auf industrielle Steuerungssysteme wie SPS, PLS und SCADA. OT-Security ist breiter und umfasst auch Gebäudeautomation, Verkehrs- und physische Zutrittssysteme; so definiert NIST SP 800-82 Rev. 3 die OT [9]. IIoT-Security ist der Teil, der sich mit vernetzten Sensoren und Gateways befasst, die Daten an Edge- oder Cloud-Plattformen senden; IEC PAS 62443-1-6 wendet die 62443-Reihe auf das IIoT an [5].

### Welche Rollen gibt es in der IEC 62443?

Den Betreiber (Asset Owner, verantwortlich für das IACS), den Integrationsdienstleister, den Instandhaltungsdienstleister und den Produkthersteller [2]. Jede Rolle hat eigene Teile der Reihe, was klare Verträge möglich macht (Abschnitt 5).

### Ist die IEC 62443 in den USA Pflicht?

Kein US-Gesetz schreibt die 62443 allgemein vor. Verbindlich wird sie über Kundenverträge, Einkaufsspezifikationen, Versicherungsbedingungen oder Branchenregeln. EU-Gesetze wie der CRA schaffen Pflichten, deren Erfüllung Prozesse auf Basis der 62443 erleichtern [22].

### Welche Security Levels gibt es in der IEC 62443?

SL 1 schützt gegen gelegentliche oder zufällige Verstöße, SL 2 gegen absichtliche Verstöße mit einfachen Mitteln, SL 3 gegen versierte Angreifer mit IACS-spezifischen Fähigkeiten und moderaten Ressourcen und SL 4 gegen versierte Angreifer mit umfangreichen Ressourcen und hoher Motivation [2]. Jede Zone bekommt ein Ziellevel, oft je grundlegender Anforderung.

### Was sind die sieben grundlegenden Anforderungen (Foundational Requirements) der IEC 62443?

Identifizierung und Authentifizierung, Nutzungskontrolle, Systemintegrität, Vertraulichkeit der Daten, eingeschränkter Datenfluss, rechtzeitige Reaktion auf Ereignisse und Verfügbarkeit von Ressourcen [2].

### Was sind Zonen und Conduits?

Eine Zone gruppiert Assets mit ähnlichen Security-Anforderungen; ein Conduit gruppiert die Kommunikationskanäle zwischen Zonen und trägt die Maßnahmen für diesen Verkehr [2]. Abschnitt 9 zeigt ein vollständiges Beispiel für ein mittelgroßes Werk.

### Mit welchem Teil der IEC 62443 sollte ein Betreiber beginnen?

Mit 62443-2-1 für das Security-Programm und 62443-3-2 für die Risikobewertung und das Zonenmodell. 3-3 legt dann die Systemanforderungen je Security Level fest, und 2-4 sowie 4-1/4-2 gehen in die Verträge mit Integratoren und Lieferanten ein [1].

### Wie hängt die IEC 62443 mit dem NIST Cybersecurity Framework zusammen?

Beide ergänzen sich. Das CSF 2.0 liefert Governance und eine gemeinsame Sprache für das ganze Unternehmen [11]; die 62443 liefert die technische und organisatorische Methode für das Werk. NIST SP 800-82 verbindet beide, und der Entwurf von Rev. 4 ist entlang des CSF 2.0 neu aufgebaut [10].

### Was ist das Purdue-Modell und ist es noch aktuell?

Eine geschichtete Referenzarchitektur von den Feldgeräten (Ebene 0) bis zum Unternehmen (Ebenen 4 und 5), oft mit einer industriellen DMZ auf Ebene 3,5. Sie bleibt eine nützliche erste Landkarte für Zonen, aber IIoT- und Cloud-Verbindungen durchschneiden ihre Ebenen; Zonen müssen deshalb dem realen Risiko und den realen Datenflüssen folgen (Abschnitt 7).

### Wie lässt sich Zero Trust auf die OT anwenden?

Zero Trust heißt: kein implizites Vertrauen aufgrund des Netzwerkorts; jeder Benutzer, jedes Gerät und jede Verbindung muss für den konkreten Zugriff autorisiert sein, den er oder sie braucht. Im Werk entspricht das dem, was die 62443 ohnehin verlangt: Zonen mit expliziten, per Allowlist geregelten Conduits, persönliche Konten statt gemeinsamer Logins und vermittelte, freigegebene Fernzugriffssitzungen (Abschnitte 7, 11, 12 und 14). An den Conduits und bei Verwaltungsfunktionen wie Engineering- und Lieferantenzugriff beginnen, weil viele Feldprotokolle keine eingebaute Authentifizierung haben (Abschnitt 2). Der Entwurf von NIST SP 800-82 Rev. 4 ergänzt Hinweise zu Zero-Trust-Prinzipien für Systemverwaltungsfunktionen [10].

### Kann man alte SPS patchen, ohne die Produktion zu stoppen?

Oft nicht sofort, und das muss man auch nicht. Zuerst prüfen, ob die verwundbare Funktion genutzt wird und erreichbar ist. Braucht die Firmwarekorrektur einen Neustart oder einen Funktionstest, jetzt kompensierende Maßnahmen umsetzen: das Conduit einschränken, nicht genutzte Dienste wie einen ungenutzten Webserver abschalten, den Schlüsselschalter in RUN halten, wo unterstützt, und das Asset enger beobachten. Das Restrisiko dokumentieren und freigeben lassen, dann die Korrektur im nächsten geplanten Stillstand einspielen. Abschnitt 13 enthält eine Entscheidungstabelle und ein Rechenbeispiel. Steuerungen, die nie eine Korrektur bekommen werden, gehören in einen Austauschplan, nicht in eine Dauerausnahme.

### Kann man sich nach IEC 62443 zertifizieren lassen?

Ja. Produkte können nach ISASecure CSA (4-2) zertifiziert werden, Systeme nach SSA (3-3), Entwicklungsorganisationen nach SDLA (4-1) [7] und seit Juni 2025 Betriebsstandorte nach ISASecure ACSSA [8]. Auch andere Konformitätsbewertungssysteme zertifizieren nach 62443, vor allem das Cybersecurity-Programm IECEE der IEC [37].

### Was ist der Unterschied zwischen 62443-4-1 und 62443-4-2?

4-1 behandelt den sicheren Entwicklungsprozess des Herstellers (wie Produkte gebaut werden), 4-2 die technischen Security-Fähigkeiten einer Komponente (was das Produkt kann) [1][7].

### Wie lange dauert die Umsetzung der IEC 62443 in einem Werk?

Für einen einzelnen mittelgroßen Standort sind 12 bis 24 Monate für den Kern realistisch: Inventar, Zonenmodell, IDMZ, Fernzugriff, Backups, Überwachung und Incident Response (Abschnitt 20). Danach läuft das Programm als jährliche Routine weiter. Diese Schätzung beruht auf dem Fahrplan in diesem Leitfaden, nicht auf einem veröffentlichten Vergleichswert.

### Was kostet OT-Security?

Das hängt von der Zahl der Zonen, dem Alter der Anlagen und den gewählten Werkzeugen ab; einen verlässlichen öffentlichen Vergleichswert haben wir nicht gefunden. Abschnitt 21 zeigt, wie man die Begründung mit der jährlichen Schadenserwartung aufbaut, und gibt ein Rechenbeispiel mit Annahmen.

### Gilt CMMC für OT-Systeme?

CMMC gilt für Systeme, die FCI oder CUI verarbeiten, speichern oder übertragen. Maschinen, die Zeichnungen oder Programme mit CUI-Kennzeichnung erhalten, können im Geltungsbereich liegen; gute Segmentierung hält die Bewertungsgrenze klein [28][29]. Auf Level 2 zählt OT, die mit CUI umgehen kann, sich aber nicht vollständig absichern lässt, als "Specialized Asset": dokumentiert in Inventar, SSP und Netzwerkplan, aber nicht gegen die übrigen Anforderungen bewertet [38].

### Was hat der Angriff auf Colonial Pipeline Fertigungsunternehmen gelehrt?

Dass ein IT-Vorfall einen OT-Betrieb stoppen kann. Colonial stellte den Pipelinebetrieb nach einem Ransomware-Angriff am oder um den 7. Mai 2021 ein, zahlte etwa 75 Bitcoin, und das US-Justizministerium beschlagnahmte später 63,7 Bitcoin [16]. Die eigenen Abhängigkeiten zu kennen und einen eingeschränkten Betriebsmodus zu haben, ist ebenso wichtig wie der Schutz der Steuerungen.

### Müssen US-Unternehmen mit Werken in der EU NIS2 erfüllen?

Ihre EU-Gesellschaften unter Umständen ja, wenn sie unter die Sektoren und Größenschwellen des nationalen Umsetzungsgesetzes fallen. Deutschland zum Beispiel wendet NIS2 auf aufgeführte Einrichtungsarten mit mindestens 50 Beschäftigten oder mehr als 10 Mio. EUR sowohl beim Umsatz als auch bei der Bilanzsumme an [25][40].

## Fazit

OT-Security ist Anlagentechnik mit einem Angreifer im Blick. ISA/IEC 62443 gibt Fertigungsunternehmen eine Methode, die zum Werk passt: die eigenen Assets kennen, das Werk in Zonen mit kontrollierten Conduits aufteilen, Ziel-Security-Levels nach Risiko festlegen, die Lücke mit technischen und organisatorischen Maßnahmen schließen und Lieferanten und Integratoren an dieselben Regeln binden. NIST CSF 2.0 und SP 800-82 verbinden diese Methode mit der US-Governance, und CMMC, SEC-Regeln, NIS2 und der CRA ergänzen Pflichten, wo sie gelten.

Die dokumentierten Vorfälle weisen auf dieselben ersten Schritte: das Werk über eine industrielle DMZ vom Unternehmen trennen, jeden Fernzugriffsweg kontrollieren, getestete Offline-Backups von Steuerungslogik und Servern vorhalten und üben, wie das Werk läuft, wenn die IT ausfällt. Nichts davon erfordert, auf eine perfekte Architektur oder die nächste Ausgabe der Norm zu warten. Mit der 30-Tage-Liste in Abschnitt 20 beginnen, im ersten Jahr das Zonenmodell aufbauen und den Fortschritt mit einer Handvoll Kennzahlen messen. Innerhalb von zwei Jahren kann ein mittelgroßes Werk von "wir hoffen, dass wir physisch getrennt sind" zu einem dokumentierten, getesteten und stetig verbesserten Security-Programm kommen.

## Weiterlesen auf m365.fm

**Verwandte Leitfäden**
- [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/): OT-Security für Edge- und Cloud-Architekturen, Übergang bei Defender for IoT, CMMC und NIS2
- [MES und ISA-95](https://www.m365.fm/learn/mes-isa-95/) (geplant): die funktionalen Ebenen und Datenflüsse, die das Zonenmodell schützt
- [Predictive Maintenance und IIoT](https://www.m365.fm/learn/predictive-maintenance-iiot/) (geplant): Sensor- und Cloud-Verbindungen, die eigene Zonen brauchen
- [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/): Datenzugriffe, die von sauberen Conduits abhängen
- [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/): CMMC, ITAR und DFARS für Rüstungslieferketten
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/): Kennzahlensysteme gestalten
- [Shopfloor Management und Gemba Walks](https://www.m365.fm/learn/shop-floor-management/): tägliche Routinen, die auch Security-Auffälligkeiten aufnehmen können
- [TPM und OEE](https://www.m365.fm/learn/tpm-oee/) (geplant): Instandhaltungsroutinen, zu denen Backups und Änderungskontrolle gehören
- [Operational Excellence](https://www.m365.fm/learn/operational-excellence/): Managementsysteme, die Programme wie dieses tragen

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Lean Management, Operational Excellence, Manufacturing IT und die digitale Transformation der Produktion, darunter die Frage, wie Werke Shopfloor-Systeme sicher mit Unternehmens- und Cloud-Plattformen verbinden. [Redaktion: Rolle, Kurzbiografie und Foto ergänzen.]

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Quellen

Alle Quellen wurden am 20. November 2026 geöffnet und geprüft, sofern nicht anders angegeben.

1. ISA/IEC 62443 Series of Standards. International Society of Automation (ISA), Katalogseite mit den Ausgaben aller veröffentlichten Teile. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
2. Quick Start Guide: An Overview of ISA/IEC 62443 Standards, Security of Industrial Automation and Control Systems. ISA Global Cybersecurity Alliance (ISAGCA), Juni 2020. https://gca.isa.org/hubfs/ISAGCA%20Quick%20Start%20Guide%20FINAL.pdf
3. IEC 62443. Wikipedia (Sekundärübersicht, genutzt für IEC-Ausgabedaten, die Beschreibung von SL 0 und die Formulierung der Reifegrade; gegen [1], [4], [5] geprüft). https://en.wikipedia.org/wiki/IEC_62443
4. IEC PAS 62443-2-2:2025, Security for industrial automation and control systems, Part 2-2: IACS security protection scheme. IEC-Webstore, veröffentlicht am 11. März 2025. https://webstore.iec.ch/en/publication/63886
5. IEC PAS 62443-1-6:2025, Part 1-6: Application of the 62443 series to the Industrial Internet of Things (IIoT). IEC-Webstore, veröffentlicht am 19. Dezember 2025. https://webstore.iec.ch/en/publication/102885
6. Building a Resilient World: Status of the 62443 standards (zweite Ausgaben von 3-2, 3-3 und 4-2 in Überarbeitung). Blog der ISA Global Cybersecurity Alliance (ohne Datum). https://gca.isa.org/blog/status-of-the-62443-standards
7. ISASecure (Startseite mit den Programmen CSA, SSA, SDLA und ACSSA; "founded in 2007 and is a wholly owned subsidiary of ISA"). https://isasecure.org/
8. ISASecure Announces New IACS Security Assurance (ACSSA) Inspection and Certification Scheme. Pressemitteilung der ISA, 18. Juni 2025. https://www.isa.org/news-press-releases/2025/june/isasecure-announces-new-iacs-security-assurance-ac
9. NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security. NIST CSRC, 28. September 2023. https://csrc.nist.gov/pubs/sp/800/82/r3/final
10. Guide to Operational Technology (OT) Security: NIST Requests Comments on Draft SP 800-82r4. NIST News, 21. September 2026 (Kommentare bis 30. November 2026). https://www.nist.gov/news-events/news/2026/09/guide-operational-technology-ot-security-nist-requests-comments-draft-sp
11. NIST Releases Version 2.0 of Landmark Cybersecurity Framework. Pressemitteilung des NIST, 26. Februar 2024. https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework
12. NIST IR 8183 Rev. 2 (Initial Public Draft), Cybersecurity Framework 2.0 Manufacturing Profile. NIST CSRC, 29. September 2025. https://csrc.nist.gov/pubs/ir/8183/r2/ipd (erneut abgerufen am 20. November 2026: weiterhin der erste öffentliche Entwurf; Kommentierung am 17. November 2025 geschlossen; keine spätere Version gelistet)
13. Cybersecurity Performance Goals 2.0 for Critical Infrastructure. CISA-Bulletin, veröffentlicht am 10. Dezember 2025. https://content.govdelivery.com/accounts/USDHSCISA/bulletins/3ff7850
14. OT Security Guidance: NIST Drafts Updated Guide, CISA, FBI Advise on ICS Integrators. SecurityWeek, 24. September 2026 (Sekundärbericht über das Merkblatt von CISA und FBI für Betreiber, die mit externen ICS-Integratoren arbeiten). https://www.securityweek.com/ot-security-guidance-nist-drafts-updated-guide-cisa-fbi-advise-on-ics-integrators/
15. ICS Matrix. MITRE ATT&CK for ICS, Inhaltsversion 20.1. https://attack.mitre.org/matrices/ics/
16. Department of Justice Seizes $2.3 Million in Cryptocurrency Paid to the Ransomware Extortionists Darkside. US-Justizministerium, Pressemitteilung, 7. Juni 2021. https://www.justice.gov/archives/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside
17. Cyber-attack on Hydro. Norsk Hydro (Unternehmensseite). https://hydro.com/en/media/on-the-agenda/cyber-attack
18. Merck, insurers settle NotPetya coverage case. Cybersecurity Dive, 8. Januar 2024. https://www.cybersecuritydive.com/news/merck-settlement-notpetya/703922/
19. Clorox files $380M suit against Cognizant over 2023 cyberattack. Cybersecurity Dive, 23. Juli 2025. https://www.cybersecuritydive.com/news/clorox-380-million-suit-cognizant-cyberattack/753837/
20. Klage von Clorox gegen Cognizant (Details zu den Helpdesk-Anrufen vom 11. August 2023, 49 Mio. USD Schadensbeseitigung, 6 % Volumenrückgang, 100 Mio. USD Versicherungsleistungen). The Record by Recorded Future, Juli 2025. https://therecord.media/clorox-cyberattack-lawsuit-cognizant-it-contractor
21. JLR Hack UK's Costliest Ever, Hitting Economy with £1.9bn Loss. Infosecurity Magazine, Oktober 2025 (Bericht über die Bewertung des Cyber Monitoring Centre). https://www.infosecurity-magazine.com/news/jlr-hack-uk-costliest-ever-19bn/
22. Cyber Resilience Act: Reporting obligations. Europäische Kommission. https://digital-strategy.ec.europa.eu/en/policies/cra-reporting
23. Cyber Resilience Act. Bundesamt für Sicherheit in der Informationstechnik (BSI), englische Seite (alle Anforderungen gelten ab 11. Dezember 2027; SBOM; Supportzeitraum in der Regel fünf Jahre). https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Cyber_Resilience_Act/cyber_resilience_act_node.html
24. Cybersicherheitsrecht: NIS-2-Umsetzungsgesetz ab morgen in Kraft. Pressemitteilung des BSI, 5. Dezember 2025. https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2025/251205_NIS-2-Umsetzungsgesetz_in_Kraft.html
25. Fragen und Antworten zu NIS-2 und NIS-2-Meldepflicht. BSI. https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-regulierte-Unternehmen/NIS-2-FAQ/NIS-2-FAQ-allgemein/FAQ-zu-NIS-2.html (erneut abgerufen am 20. November 2026; die FAQ verweist auf die Größenschwellen des § 28 BSIG ohne Zahlen, siehe [40])
26. SEC Adopts Rules on Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure by Public Companies. SEC-Pressemitteilung 2023-139, 26. Juli 2023. https://www.sec.gov/newsroom/press-releases/2023-139 (erneut abgerufen am 20. November 2026)
27. CIRCIA final rule at the White House: deadlines set, scope open. Paubox, 8. Oktober 2026 (Sekundärquelle zum Stand des Regelungsverfahrens). https://www.paubox.com/blog/circia-final-rule-white-house-deadlines-set-scope-open (erneut abgerufen am 20. November 2026; 72 Stunden / 24 Stunden bestätigt)
28. DoD Publishes Final CMMC Program Rule. Greenberg Traurig, Oktober 2024 (Zusammenfassung von 32 CFR Part 170, in Kraft seit 16. Dezember 2024). https://www.gtlaw.com/en/insights/2024/10/dod-publishes-final-cmmc-program-rule (erneut abgerufen am 20. November 2026; Artikel vom 15. Oktober 2024)
29. The CMMC DFARS Final Rule Goes Live: Ready or Not, Here It Comes. Squire Patton Boggs, September 2025 (DFARS-Regel in Kraft seit 10. November 2025, dreijährige Einführung). https://www.squirepattonboggs.com/en/insights/publications/2025/09/the-cmmc-dfars-final-rule-goes-live-ready-or-not-here-it-comes (für den Schwester-Leitfaden geprüft)
30. Cybersecurity Services. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/cybersecurity-services (erneut abgerufen am 20. November 2026)
31. Retirement: OT security in Microsoft Defender for IoT. Azure Updates, ID 576255, 2. November 2026. https://azure.microsoft.com/updates?id=576255 (für den Schwester-Leitfaden geprüft; die Azure-Seite wird clientseitig gerendert und zeigte am 20. November 2026 keinen Inhalt; dieselbe Meldung AZ576255, veröffentlicht am 2. November 2026, Einstellung Oktober 2029, wurde auf dem Message-Center-Spiegel https://mc.merill.net/message/AZ576255 nachgelesen)
32. Critical Manufacturing Sector. CISA. https://www.cisa.gov/critical-manufacturing-sector (erneut abgerufen am 20. November 2026; vier Kernbranchen und DHS als SRMA bestätigt; die Seite nennt die Zahl der Sektoren nicht)
33. Understanding ISA/IEC 62443: A Guide for OT Security Teams. Dragos-Blog (Wettbewerbsseite, nur für die SERP-Analyse der englischen Fassung genutzt; im Artikeltext nicht zitiert). https://www.dragos.com/blog/isa-iec-62443-concepts
34. The Essential Guide to the IEC 62443 industrial cybersecurity standards. Industrial Cyber (Sekundärquelle; Quelle für die Angabe "mehr als 800 Seiten"). https://industrialcyber.co/features/the-essential-guide-to-the-iec-62443-industrial-cybersecurity-standards/
35. U.S. Retrieves Some Of The Colonial Pipeline Ransom. NPR, 7. Juni 2021 (verweist auf "last month's shutdown of Colonial Pipeline"). https://www.npr.org/2021/06/07/1004050873/u-s-retrieves-some-of-the-colonial-pipeline-ransom
36. Testimony of Joseph Blount, President and CEO, Colonial Pipeline Company, before the US Senate Committee on Homeland Security and Governmental Affairs, 8. Juni 2021. https://www.hsgac.senate.gov/imo/media/doc/Testimony-Blount-2021-06-08.pdf (abgerufen am 20. November 2026)
37. Lin, S.: White paper: Comparing ISASecure, IECEE and proprietary ISA/IEC 62443 certification schemes. Automation.com (ISA), 15. Mai 2026 (Whitepaper von ISASecure erstellt; interessierte Partei). https://www.automation.com/article/white-paper-comparing-isasecure-iecee-proprietary-isa/iec-62443-certification-schemes (abgerufen am 20. November 2026)
38. 32 CFR 170.19, CMMC scoping, Absatz (c)(1), Tabelle 3 (Specialized Assets). Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/32/170.19 (abgerufen am 20. November 2026)
39. DiMolfetta, D.: CISA updates cyber reporting form as broader incident mandate awaits approval. Nextgov/FCW, 9. November 2026. https://www.nextgov.com/cybersecurity/2026/11/cisa-updates-cyber-reporting-form-broader-incident-mandate-awaits-approval/417130/ (abgerufen am 20. November 2026)
40. § 28 BSIG (BSI-Gesetz 2025), Absatz 2 Nr. 3: wichtige Einrichtungen mit mindestens 50 Beschäftigten oder einem Jahresumsatz und einer Jahresbilanzsumme von jeweils über 10 Mio. EUR. Gesetze im Internet, Bundesministerium der Justiz. https://www.gesetze-im-internet.de/bsig_2025/__28.html (abgerufen am 20. November 2026)

# Prüfhinweise für die Redaktion

**Herstellerangaben und Sekundärquellen**

- Es wird kein Herstellerprodukt empfohlen. Der Artikel nennt Produktkategorien (OT-Überwachung, Fernzugriffs-Gateways, Datendioden), aber keine Produkte. Microsoft erscheint nur mit dem Einstellungsdatum von Defender for IoT [31].
- SecurityWeek [14] ist ein Sekundärbericht über das Integrator-Merkblatt von CISA und FBI; vor Veröffentlichung nach Möglichkeit durch das CISA-Merkblatt selbst ersetzen.
- Wikipedia [3] nur für IEC-Ausgabedaten, SL 0, Reifegrad-Formulierungen und Geschichte (ISA99 2002, IEC-Kooperation um 2010); möglichst durch IEC-Webstore-Einträge ersetzen.
- Infosecurity Magazine [21] (JLR) und die Kanzleizusammenfassungen [28], [29] (CMMC-Daten) sind Sekundärquellen; optional Primärquellen ergänzen.
- Die angebliche "IEC 62443-4-2:2026" wird nur als Warnung erwähnt, ohne Link auf die Website.

**[unbelegt]-Stellen**

1. Abschnitt 1: kritische Fertigung als "einer von 16" Sektoren ([32] bestätigt den Sektor, nicht die Zahl).
2. Abschnitt 2: Lebensdauer von Steuerungen und Maschinen 15 bis 25 Jahre (Praxiswert).
3. Abschnitt 6: SL 2 als übliches Ziel für Produktionszonen, SL 3 für sicherheitsrelevante Zonen (Praxiserfahrung).
4. Abschnitt 7: 8 bis 20 Zonen für ein mittelgroßes Werk (Praxiswert).
5. Abschnitt 13: Umfang und Abstimmung der ICS Advisories der CISA.
6. Abschnitt 18 (Gewerkschaft) sowie Abschnitte 19 und 21 (Versicherung): als allgemeine Hinweise gekennzeichnet.

**Interne Links** Alle `/en/learn/`-Links der englischen Fassung sind auf die deutschen URLs umgestellt: mes-isa-95 (2x, geplant), manufacturing-it-azure (3x), shop-floor-management, produktionsplanung-luftfahrt, predictive-maintenance-iiot (geplant), digital-twin, produktionskennzahlen; im Abschnitt Weiterlesen zusätzlich tpm-oee (geplant) und operational-excellence. Entity-Link `/entity/mirko-peters/` unverändert. Kannibalisierung: Der deutsche Pillar Manufacturing IT mit Azure hat einen Abschnitt zu IT/OT-Konvergenz und Security; dort auf diesen Artikel verlinken (Ankertext z. B. "OT-Security und ISA/IEC 62443") und die Keywords "OT-Security" und "IEC 62443" diesem Artikel überlassen.

**JSON-LD-Vorschlag**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "OT-Security und ISA/IEC 62443: ein Praxisleitfaden für Fertigungsunternehmen",
      "description": "OT-Security für Fertigungsunternehmen: ISA/IEC 62443 mit Zonen, Conduits, Security Levels, Praxisbeispiel, Fahrplan, Kennzahlen und FAQ.",
      "inLanguage": "de-DE",
      "datePublished": "2026-11-26",
      "dateModified": "2026-11-26",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "mainEntityOfPage": "https://www.m365.fm/learn/ot-security-iec-62443/",
      "about": ["OT-Security", "ISA/IEC 62443", "Security industrieller Steuerungssysteme"]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "de-DE",
      "mainEntity": [
        {"@type": "Question", "name": "Was ist OT-Security?", "acceptedAnswer": {"@type": "Answer", "text": "OT-Security schützt die Systeme, die physische Prozesse überwachen und steuern, etwa SPS, SCADA, HMIs, Roboter und Sicherheitssysteme, gegen Störung und Manipulation, mit Sicherheit und Verfügbarkeit als ersten Prioritäten."}},
        {"@type": "Question", "name": "Was ist ISA/IEC 62443?", "acceptedAnswer": {"@type": "Answer", "text": "Eine Reihe internationaler Normen für die Security industrieller Automatisierungs- und Steuerungssysteme, entwickelt vom Komitee ISA99 und der IEC. Sie definiert Rollen, Zonen und Conduits, Security Levels und sieben grundlegende Anforderungen."}},
        {"@type": "Question", "name": "Welche Security Levels gibt es in der IEC 62443?", "acceptedAnswer": {"@type": "Answer", "text": "SL 1 schützt gegen gelegentliche oder zufällige Verstöße, SL 2 gegen absichtliche Verstöße mit einfachen Mitteln, SL 3 gegen versierte Angreifer mit IACS-spezifischen Fähigkeiten und moderaten Ressourcen und SL 4 gegen versierte Angreifer mit umfangreichen Ressourcen und hoher Motivation."}},
        {"@type": "Question", "name": "Ist die IEC 62443 in den USA Pflicht?", "acceptedAnswer": {"@type": "Answer", "text": "Kein US-Gesetz schreibt die IEC 62443 allgemein vor. Verbindlich wird sie über Kundenverträge, Einkaufsspezifikationen, Versicherungsbedingungen oder Branchenregeln."}},
        {"@type": "Question", "name": "Was sind Zonen und Conduits?", "acceptedAnswer": {"@type": "Answer", "text": "Eine Zone gruppiert Assets mit ähnlichen Security-Anforderungen; ein Conduit gruppiert die Kommunikationskanäle zwischen Zonen und trägt die Maßnahmen für diesen Verkehr."}},
        {"@type": "Question", "name": "Wie lässt sich Zero Trust auf die OT anwenden?", "acceptedAnswer": {"@type": "Answer", "text": "Zero Trust heißt: kein implizites Vertrauen aufgrund des Netzwerkorts. Im Werk entspricht das dem, was die 62443 ohnehin verlangt: Zonen mit expliziten, per Allowlist geregelten Conduits, persönliche Konten statt gemeinsamer Logins und vermittelte, freigegebene Fernzugriffssitzungen. An den Conduits und bei Engineering- und Lieferantenzugriff beginnen."}},
        {"@type": "Question", "name": "Kann man alte SPS patchen, ohne die Produktion zu stoppen?", "acceptedAnswer": {"@type": "Answer", "text": "Oft nicht sofort, und das muss man auch nicht. Zuerst prüfen, ob die verwundbare Funktion genutzt wird und erreichbar ist; dann kompensierende Maßnahmen umsetzen, das Restrisiko freigeben lassen und die Korrektur im nächsten geplanten Stillstand einspielen."}}
      ]
    }
  ]
}
```

**hreflang** `de-DE` https://www.m365.fm/learn/ot-security-iec-62443/ <-> `en-US` https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/; jeweils selbstreferenzierender Canonical. In der englischen Fassung steht noch "no hreflang pair"; dort beim Livegang ergänzen.

**Empfohlene Grafiken**

1. Zonen- und Conduit-Diagramm des Praxisbeispiels (Abschnitt 9): 12 Werkszonen, IDMZ und Unternehmen, Conduits C1 bis C8 als beschriftete Pfeile.
2. Purdue-Ebenen neben dem Zonenmodell, mit dem IIoT-Gateway, das die Ebenen durchschneidet.
3. Dokumentenkarte der 62443: vier Gruppen, Teile nach Rolle eingefärbt (Betreiber, Integrator, Hersteller).
4. Schema SL-T / SL-C / SL-A: Ziel nach Risiko, Fähigkeit eingekauft, erreicht nach Integration.
5. Gantt-Diagramm des Fahrplans (Abschnitt 20).
6. Sensitivitätsdiagramm der ALE (Abschnitt 21): jährliche Risikominderung für ARO 0,05 bis 0,20.

**Wiedervorlage** NIST SP 800-82 Rev. 4 (endgültige Fassung nach Ende der Kommentierung am 30. November 2026) quartalsweise; zweite Ausgaben von 62443-3-2, 3-3, 4-2 halbjährlich; endgültige CIRCIA-Regel quartalsweise; CMMC Phase 3 (10. November 2027) halbjährlich; Hauptpflichten des CRA (11. Dezember 2027) halbjährlich.

**Offenlegung** Die Autorenbox enthält "Hinweis: Der Autor arbeitet bei der iFAKT GmbH." iFAKT bezahlt nicht für die Veröffentlichung. Der Artikel enthält keinen iFAKT-Produktabschnitt, weil keines der iFAKT-Produkte ein OT-Security-Werkzeug ist.

**Für den deutschen Markt prüfen (Aufgabe für die Fachprüfung)**

- Abschnitt 4 und 19: Der Artikel ist aus US-Sicht geschrieben (CMMC, SEC, CIRCIA, NIST, CISA). Für deutsche Leser prüfen, ob die deutschen bzw. europäischen Referenzen stärker gewichtet werden sollen, z. B. BSI-Empfehlungen und IT-Grundschutz-Bausteine für Industrie (ICS), die Pflichten aus dem NIS2-Umsetzungsgesetz (BSIG 2025, Registrierung, Risikomanagement, Haftung der Geschäftsleitung) und die Maschinenverordnung (EU) 2023/1230 mit ihren Cybersecurity-Anforderungen. Nichts davon ist bisher im Text, weil es im Original nicht steht.
- Abschnitt 18 (Schulung, Anmeldung per Ausweis, Bildschirmsperren) und Abschnitt 15 (Protokollierung, Sitzungsaufzeichnung): Das Original spricht von Union und Collective Bargaining Agreement. In Deutschland unterliegen technische Einrichtungen, die Verhalten oder Leistung von Beschäftigten überwachen können, der Mitbestimmung des Betriebsrats (§ 87 Abs. 1 Nr. 6 BetrVG); Sitzungsaufzeichnungen und Logauswertungen berühren zudem den Beschäftigtendatenschutz (DSGVO, BDSG). Prüfen, ob "Betriebsrat" ausdrücklich genannt werden soll.
- Abschnitt 18 (Safety und Security) und Abschnitt 2: Lockout/Tagout ist US-Praxis (OSHA); für deutsche Werke ggf. auf Betriebssicherheitsverordnung und DGUV-Regeln verweisen.
- Abschnitt 13: FDA-Validierung ist US-Kontext; für deutsche Pharma- und Lebensmittelwerke ggf. GMP/EU-GMP Annex 11 prüfen.
- Abschnitt 21: Capex/Opex-Einordnung nach US-Praxis; für deutsche Leser ggf. Aktivierung nach HGB/IFRS ergänzen.
- Das Praxisbeispiel "Midwest Components" ist ein US-Werk; bewusst unverändert gelassen (USD-Beträge bleiben USD).

**Fachliche Prüfung** Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.
