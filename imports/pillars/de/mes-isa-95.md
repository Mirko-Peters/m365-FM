# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | MES und ISA-95: Funktionen, Ebenen, Auswahl und ROI (51 Zeichen) |
| Meta-Description | Was ein Manufacturing Execution System leistet, wie die ISA-95-Ebenen es einordnen, MES vs. ERP vs. SCADA, Auswahl-Checkliste, Fahrplan und ROI. (144 Zeichen) |
| Slug | `/learn/mes-isa-95/` (vollständige URL: https://www.m365.fm/learn/mes-isa-95/) |
| Hauptkeyword | MES (Manufacturing Execution System); ISA-95 |
| Nebenkeywords | was ist ein MES, MES-System, MES-Software, MES Funktionen, MESA-11, ISA-95 Ebenen, ISA-95 Aktivitätsmodell, IEC 62264, Automatisierungspyramide, Purdue-Modell, Manufacturing Operations Management (MOM), Unterschied MES und ERP, MES vs. SCADA, BDE MDE, Betriebsdatenerfassung, B2MML, Unified Namespace, MQTT Sparkplug, OPC UA, MES-Einführung, MES-Auswahl Checkliste, MES Kosten, MES ROI, MES Kennzahlen, ISO 22400, 21 CFR Part 11 MES, elektronischer Chargenbericht, Device History Record, Composable MES, Cloud-MES, MES selbst entwickeln oder kaufen |
| Suchintention | Informational (Definition, Funktionen, Norm) mit starkem kommerziellem Anteil (Auswahl, Kosten, ROI, Einführung). Zielgruppe: Werks- und Produktionsleitung, Fertigungs- und Prozessingenieure, IT/OT-Architekten, Qualitätsverantwortliche, Controlling (Freigabe des Business Case) sowie Microsoft-365- und IT-Teams, die Werke betreuen |
| Wortzahl | Tatsächlich H1 bis Fazit einschl. Tabellen, Glossar und FAQ (`wc -w`): **14.978 Wörter** (englische Fassung: 15.562 Wörter, Anteil 96 %) |
| Sprachversion | Deutsch (`de-DE`). hreflang-Paar: `de-DE` https://www.m365.fm/learn/mes-isa-95/ <-> `en-US` https://www.m365.fm/en/learn/mes-isa-95/ |

# Hinweis zur Wettbewerbsanalyse

Die Wettbewerbsanalyse der englischen Fassung bezieht sich auf die Suchergebnisse von google.com (USA). Für google.de steht ein eigener SERP-Check (z. B. mit NEURONwriter) noch aus. Überschriften, FAQ-Fragen und Nebenkeywords dieser Fassung sind nach deutschem Suchverhalten formuliert, aber noch nicht gegen die deutschen Top-Ergebnisse geprüft.

# Manufacturing Execution System (MES) und ISA-95: Funktionen, Ebenen, Auswahl und ROI

*Stand: November 2026 · Lesezeit: etwa 50 Minuten (Schnelleinstieg: Kurzantwort, das Wichtigste in Kürze, die Vergleichstabelle in Abschnitt 5 und das Glossar)*

> **Kurzantwort:** Ein Manufacturing Execution System (MES, auf Deutsch auch Produktionsleitsystem) ist die Softwareschicht, die die Ausführung von Fertigungsaufträgen auf dem Shopfloor in Echtzeit steuert, überwacht und dokumentiert, und zwar zwischen dem ERP-System, das plant, und den Steuerungen, die die Maschinen betreiben [8]. ISA-95 (ANSI/ISA-95, international IEC 62264) ist die Norm, die festlegt, wo diese Schicht sitzt (Ebene 3, Manufacturing Operations Management), welche Aktivitäten sie umfasst und welche Informationen sie mit dem ERP austauscht [1][3].

> **Das Wichtigste in Kürze**
> - Gartner definiert MES als produktionsorientierte Software, die "die Ausführung physischer Echtzeitprozesse steuert, überwacht und synchronisiert" ("manages, monitors and synchronizes the execution of real-time physical processes") und Fertigungsaufträge mit Feinplanung, ERP, PLM und Qualitätssystemen abstimmt [8].
> - ISA-95 hat acht Teile. Teil 1 (Modelle und Terminologie) ist 2025 neu erschienen; Teil 3 (Aktivitätsmodelle) stammt von 2013 [1][2].
> - ISA-95 beschreibt fünf Ebenen. Die Ebenen 0 bis 2 sind der physische Prozess und seine Steuerung, Ebene 3 ist Manufacturing Operations Management (MES und verwandte Systeme), Ebene 4 ist Geschäftsplanung und Logistik (ERP) [1].
> - Das Aktivitätsmodell aus Teil 3 teilt Ebene 3 in vier Kategorien (Produktion, Instandhaltung, Qualitätsprüfung, Bestand) und wiederholt in jeder dieselben acht Aktivitäten: Definitionsmanagement, Ressourcenmanagement, Feinplanung, Auftragsfreigabe (Dispatching), Ausführungsmanagement, Datenerfassung, Verfolgung (Tracking) und Leistungsanalyse [3].
> - Das Modell der MESA International von 1997 nannte 11 MES-Funktionen; ISA-95 hat dieses Denken später übernommen [9][12]. MESA hat den Betrieb am 30. Juni 2026 eingestellt, ihre Inhalte gingen an die ISA [11].
> - Ein Unified Namespace (UNS) verändert, wie Daten fließen; er ersetzt weder die MES-Logik noch das ISA-95-Vokabular.
> - Ein MES-Business-Case steht und fällt meist mit ein oder zwei Nutzenpositionen. Im Rechenbeispiel unten hat dasselbe Projekt im Basisfall einen positiven Kapitalwert über fünf Jahre und im vorsichtigen Fall einen negativen.
> - Mit dem Datenmodell und einem Wertstrom beginnen, nicht mit der vollständigen Funktionsliste.

## Inhaltsverzeichnis

1. [Was ist ein Manufacturing Execution System (MES)?](#was-ist-ein-manufacturing-execution-system-mes)
2. [Geschichte des MES: von AMR und MESA-11 bis ISA-95](#geschichte-des-mes-von-amr-und-mesa-11-bis-isa-95)
3. [ISA-95 erklärt: Norm, Teile und Ebenen](#isa-95-erklärt-norm-teile-und-ebenen)
4. [Die ISA-95-Modelle, die für ein MES-Projekt zählen](#die-isa-95-modelle-die-für-ein-mes-projekt-zählen)
5. [MES vs. ERP vs. MOM vs. SCADA und andere Systeme im Werk](#mes-vs-erp-vs-mom-vs-scada-und-andere-systeme-im-werk)
6. [MES-Funktionen im Detail](#mes-funktionen-im-detail)
7. [Integration: B2MML, OPC UA, MTConnect und Unified Namespace](#integration-b2mml-opc-ua-mtconnect-und-unified-namespace)
8. [MES in regulierten Branchen](#mes-in-regulierten-branchen)
9. [Betriebsmodelle und Architektur: Suite, Plattform, ERP-Modul, Cloud](#betriebsmodelle-und-architektur)
10. [MES selbst entwickeln oder kaufen?](#mes-selbst-entwickeln-oder-kaufen)
11. [Checkliste für die MES-Auswahl](#checkliste-für-die-mes-auswahl)
12. [Fahrplan für die MES-Einführung](#fahrplan-für-die-mes-einführung)
13. [MES-Kosten und ROI mit Rechenbeispiel](#mes-kosten-und-roi-mit-rechenbeispiel)
14. [MES-Kennzahlen: was gemessen wird und wie](#mes-kennzahlen-was-gemessen-wird-und-wie)
15. [Mitarbeiter und Shopfloor](#mitarbeiter-und-shopfloor)
16. [Typische Fehler bei der MES-Einführung](#typische-fehler-bei-der-mes-einführung)
17. [Grenzen von MES und ISA-95](#grenzen-von-mes-und-isa-95)
18. [Glossar](#glossar)
19. [FAQ](#faq)
20. [Fazit und erste Schritte](#fazit-und-erste-schritte)

## Was ist ein Manufacturing Execution System (MES)?

Ein Manufacturing Execution System ist die Software, die aus einem Fertigungsauftrag fertige, dokumentierte Ware macht. Das ERP sagt dem Werk, *was* in welcher Menge bis wann gefertigt werden soll. Maschinen und ihre Steuerungen fertigen die Teile. Das MES sitzt dazwischen: Es gibt Arbeit frei und bringt sie in eine Reihenfolge, sagt Werkern und Maschinen, was als Nächstes zu tun ist, erfasst, was tatsächlich passiert ist (Mengen, Zeiten, Parameter, Material, Fehler, wer es gemacht hat), und meldet das Ergebnis zurück.

Die Marktdefinition von Gartner ist ein guter Bezugspunkt, weil sie herstellerneutral und genau ist. Sie nennt MES "eine spezielle Klasse produktionsorientierter Software" ("a specialist class of production-oriented software"), die "die Ausführung physischer Echtzeitprozesse steuert, überwacht und synchronisiert, die Rohstoffe in Zwischen- und/oder Fertigerzeugnisse umwandeln". Weiter heißt es, dass diese Systeme Fertigungsaufträge mit der Produktionsfeinplanung und mit Unternehmenssystemen wie ERP, Product Lifecycle Management und Qualitätsmanagement abstimmen, Rückmeldung über die Prozessleistung geben und Rückverfolgbarkeit und Genealogie bis auf Bauteil- und Materialebene unterstützen [8].

### Die Kernidee in einem Satz

Ein MES schließt Schicht für Schicht den Kreis zwischen Plan und Wirklichkeit, sodass alle, vom Werker bis zum Controller, mit demselben aktuellen Bild davon arbeiten, was in der Fertigung passiert ist.

### Was ein MES in einer typischen Schicht tut

Ein konkretes Bild hilft mehr als eine Funktionsliste. Ein mittelgroßes Werk fertigt und montiert Hydraulikventile auf vier Linien:

1. **06:00 Uhr, Schichtbeginn.** Das MES zeigt dem Schichtführer die Auftragsliste (Dispatch-Liste) für Linie 2: zwölf Aufträge, aus dem ERP freigegeben und von der Feinplanung so sortiert, dass möglichst wenig gerüstet werden muss. Zwei Aufträge sind markiert, weil die Kalibrierung eines Prüfmittels überfällig ist.
2. **06:10 Uhr.** Der Werker scannt die Auftragsbegleitkarte des ersten Auftrags (oder wählt ihn am Terminal aus). Das MES prüft, ob der Werker für diesen Arbeitsgang qualifiziert ist, ob die Programmversion auf der CNC-Maschine zum freigegebenen Arbeitsplan passt und ob die Rohmaterialcharge im Regal zum Auftrag gehört. Es zeigt den aktuellen Stand der Arbeitsanweisung.
3. **06:12 bis 13:30 Uhr.** Die Maschine meldet Zyklen und Zustände (läuft, wartet, Störung) über OPC UA oder MTConnect. Das MES zählt Gut- und Schlechtteile, erfasst Stillstände und fragt den Werker nach einem Grundcode, wenn ein Stopp länger als zwei Minuten dauert. Messwerte aus dem Prozess laufen in SPC-Regelkarten; ein Punkt außerhalb der Eingriffsgrenzen sperrt den nächsten Arbeitsgang, bis ein Techniker freigibt.
4. **11:45 Uhr.** Eine Dichtungscharge erweist sich als verdächtig. Weil das MES erfasst hat, welche Charge in welche Ventil-Seriennummer eingebaut wurde, kann die Qualitätssicherung 140 Ventile sperren statt der Produktion einer ganzen Woche.
5. **14:00 Uhr, Schichtübergabe.** Das MES übergibt Mengen, Ausschuss, OEE und offene Punkte an die nächste Schicht und bucht bestätigte Mengen und Materialverbrauch ins ERP.

Ohne MES passiert vieles davon auf Papier-Laufkarten, Whiteboards und in Tabellen, die Stunden oder Tage später ins ERP abgetippt werden. Das funktioniert bis zu einem gewissen Punkt. Die Kosten zeigen sich als späte oder falsche Daten, langsame Rückrufe, Qualitätsdurchschlupf und lange Ursachensuchen. Der Vertiefungsartikel zur [papierlosen Fertigung](https://www.m365.fm/learn/shop-floor-management/papierlose-fertigung/) (geplant) behandelt den Schritt von Papier-Laufkarten zu digitalen Arbeitsanweisungen, oft das erste MES-Modul, das ein Werk nutzt.

### Wo das MES unter den Systemen im Werk sitzt

ISA-95 ordnet das MES auf **Ebene 3** ein, Manufacturing Operations Management, zwischen Geschäftsplanung und Logistik auf Ebene 4 (ERP) und den Steuerungsebenen 0 bis 2 (Sensoren, SPS, Prozessleitsystem/DCS, SCADA) [1]. Ebene 3 ist kein einzelnes System. Auf derselben Ebene liegen Labor-Informationsmanagement (LIMS), Lagerverwaltung (WMS), Instandhaltungsmanagement (CMMS) und andere; zusammen nennt man sie oft Manufacturing-Operations-Management-Systeme [14]. Abschnitt 5 vergleicht sie.

### Nutzen eines MES, und was die Belege sagen

Die meisten MES-Seiten nennen Nutzen mit eindrucksvollen Prozentzahlen und ohne Quelle. Mit der nötigen Vorsicht lässt sich Folgendes sagen:

| Nutzen | Wirkmechanismus | Was messen | Einschränkung |
|---|---|---|---|
| Schnellere, genaue Produktionsdaten | Daten werden an der Quelle erfasst, nicht abgetippt | Datenverzug, manuelle Eingaben je Auftrag | Nur wenn die Stammdaten (Arbeitspläne, Stücklisten) stimmen |
| Kürzere Durchlaufzeiten | Weniger Warten auf Papiere, schnellere Freigabe und Zuteilung | Auftragsdurchlaufzeit, Liegezeit | *Control Engineering* berichtet, dass MESA International die durchschnittliche Verkürzung der Fertigungsdurchlaufzeit mit 45 Prozent angab; das ist eine Verbandsaussage, kein Benchmark [9] |
| Weniger Qualitätsdurchschlupf | Erzwungene Prüfungen, SPC, Verriegelungen vor dem nächsten Schritt | First Pass Yield, Kundenreklamationen | Hängt davon ab, ob die Prüfungen wirklich als harte Sperren konfiguriert sind |
| Schnellere, engere Rückrufe | Chargen- und Seriennummern-Genealogie | Zeit bis zur Identifikation betroffener Einheiten | Setzt diszipliniertes Scannen des Materials voraus |
| Höhere OEE am Engpass | Sichtbare Stillstandsgründe, schnellere Reaktion | OEE, MTTR | Nur Geld wert, wenn die Mehrmenge verkauft werden kann |
| Audit-Bereitschaft | Elektronische Aufzeichnungen, Audit-Trails, elektronische Unterschriften | Stunden je Audit, Feststellungen | Der Validierungsaufwand in regulierten Branchen ist erheblich |

Ein Artikel in *Automation World* von 2006 berichtete, dass mehr als 40 globale Hersteller ISA-95 genutzt hatten, um ihre MES-Anforderungen zu definieren, und dass die Zeit für die Anforderungsdefinition von mehreren Monaten auf vier bis sechs Wochen sank [10]. Das ist ein bescheidener, plausibler Effekt eines gemeinsamen Vokabulars und ein guter Grund, die nächsten Abschnitte zu lesen, bevor ein Lastenheft geschrieben wird.

## Geschichte des MES: von AMR und MESA-11 bis ISA-95

Die Geschichte erklärt, warum Hersteller, Analysten und Normen für dieselbe Sache leicht unterschiedliche Begriffe verwenden.

### Anfang der 1990er-Jahre: der Begriff MES

Laut *Automation World* hat das Bostoner Analystenhaus AMR Research das MES-Konzept 1992 als Schicht zwischen Unternehmenssystemen und Steuerungssystemen etabliert, die Transparenz und Kontrolle liefert [10]. Werke hatten schon vorher Werkstattsteuerung, Betriebsdatenerfassung und Qualitätssysteme genutzt, oft im eigenen Haus für einen einzigen Zweck gebaut; ihre Funktionen überschnitten sich, und sie tauschten selten Daten miteinander aus [14].

### 1997: MESA-11

MESA International (Manufacturing Enterprise Solutions Association) veröffentlichte 1997 ihr White Paper zum MES [15] und damit das Funktionsmodell, das als **MESA-11** bekannt ist [12]. Die elf Funktionen waren [9]:

1. Ressourcenzuordnung und -status (Resource allocation and status)
2. Feinplanung (Operations/detailed scheduling)
3. Auftragsfreigabe an Fertigungseinheiten (Dispatching production units)
4. Dokumentenlenkung (Document control)
5. Datenerfassung (Data acquisition)
6. Personalmanagement (Labor management)
7. Qualitätsmanagement (Quality management)
8. Prozessmanagement (Process management)
9. Instandhaltungsmanagement (Maintenance management)
10. Produktverfolgung und Genealogie (Product tracking and genealogy)
11. Leistungsanalyse (Performance analysis)

Die MESA-Definition von 1997 betonte, dass ein MES "Informationen liefern soll, die die Optimierung der Produktionsaktivitäten ermöglichen" ("deliver information that enables the optimization of production activities"), eine Formulierung, die *Automation World* noch 2006 als praxisnah bezeichnete [10]. Mehrere der elf Funktionen (Instandhaltung, Personal, Dokumentenlenkung) werden heute oft von eigenen Systemen abgedeckt. Deshalb wurde das Modell schon damals als "zu breit" kritisiert [9].

### 2000 bis 2013: ISA-95

Das ISA95-Komitee baute auf dem Purdue-Referenzmodell für Computer Integrated Manufacturing auf [1]. Teil 1 erschien 2000, Teil 3 mit den Aktivitätsmodellen der Ebene 3 im Jahr 2005; Sekundärquellen beschreiben ISA-95 als Verbindung von MESAs funktionaler Sicht mit der Purdue-Hierarchie [12][14]. Bis 2020 folgten weitere Teile, und Teil 1 wurde 2025 neu herausgegeben [1][2]. Abschnitt 3 listet sie auf.

### Ab 2004: MOM, Collaborative MES und spätere Modelle

Weil ISA-95 die Ebene 3 "Manufacturing Operations Management" nannte, setzte sich der Begriff MOM für den breiteren Umfang durch (Produktion plus Qualitäts-, Instandhaltungs- und Bestandsprozesse), mit dem MES als produktionsbezogenem Kern [10]. MESA selbst veröffentlichte mehrere spätere Modelle; der *Control-Engineering*-Artikel zum ursprünglichen Modell vermerkt, dass es damals eines von acht MESA-Modellen war [9]. Namen und Jahre der späteren MESA-Modelle (oft genannt: c-MES 2004 und das MESA-Modell von 2008) konnten wir nicht aus einer Primärquelle bestätigen [unbelegt]. Die Seite von MESA zur Modellgeschichte leitet inzwischen auf die ISA weiter, und MESAs Ankündigung des neuesten Modells von 2022 sagt nur, man habe "drei (jetzt vier) MESA-Modelle" veröffentlicht ("three (now four) MESA models") [43].

### 2026: MESA löst sich auf, die ISA übernimmt die Inhalte

MESA International hat beschlossen, den Betrieb zum 30. Juni 2026 einzustellen; die ISA erklärt, dass "die Inhalte und Bildungsprogramme der MESA von der ISA übernommen werden" ("MESA's content and educational programs will be assumed by ISA") [11]. Das ist praktisch relevant, weil MESA **B2MML** gepflegt hat, die XML-Umsetzung von ISA-95, die in vielen ERP-MES-Schnittstellen genutzt wird [5]. Vor einer vertraglichen Festlegung auf B2MML-Schemas sollte mit der ISA geklärt werden, wo diese und künftige Versionen gehostet werden. Stand November 2026 sind die B2MML- und BatchML-Schemas weiterhin im Repository MESAInternational auf GitHub veröffentlicht, dessen README die Übertragung nicht erwähnt [36] [unbelegt: das künftige Hosting nach der Übertragung ist nicht dokumentiert].

### Die 2020er-Jahre: IIoT, Cloud und Composable MES

Drei Verschiebungen prägen heutige MES-Projekte: Maschinendaten lassen sich günstiger erfassen (OPC UA, MTConnect, MQTT), Cloud- und Hybridbetrieb ist normal geworden, und Anbieter verkaufen MES zunehmend als Plattform kleinerer Apps statt als monolithische Suite ("composable" oder "Next-Generation"-MES). Abschnitt 9 behandelt, was das für Architektur und Vertrag bedeutet.

## ISA-95 erklärt: Norm, Teile und Ebenen

Die ISA beschreibt ISA-95, "auch bekannt als ANSI/ISA-95 oder IEC 62264", als internationale Normenreihe für die Integration von Logistiksystemen mit Fertigungssteuerungssystemen [1]. Sie ordnet Technik und Geschäftsprozesse in Schichten, die durch die dort stattfindenden Aktivitäten definiert sind, und beschreibt, wie ein Unternehmen Schnittstellen zwischen diesen Schichten aufbauen kann. Die ISA betont, dass die auf dem Purdue-Modell beruhende Architektur "unabhängig von der eingesetzten Technologie" angewendet werden kann und dass die Anlagenhierarchie für diskrete Fertigung, kontinuierliche Prozesse und Logistik gleichermaßen funktioniert [1].

Daraus folgen zwei Dinge. Erstens ist ISA-95 **technologieneutral**: Die Norm sagt nichts darüber, welche Datenbank, welches Protokoll oder welchen Anbieter man einsetzt. Zweitens liegt ihr Schwerpunkt auf der **Schnittstelle zwischen Ebene 3 und Ebene 4** [1], und genau dort bleiben die meisten MES-Projekte stecken (wem gehört der Arbeitsplan, wann gilt eine Menge als "rückgemeldet", wie wird Ausschuss gebucht).

### ISA-95 und IEC 62264: gleicher Inhalt, andere Nummerierung

Die ISA entwickelt die Reihe als ANSI/ISA-95; die IEC veröffentlicht sie als IEC 62264. Die Ausgabe 2025 von Teil 1 trägt die Bezeichnung ANSI/ISA-95.00.01-2025 (IEC 62264-1 Mod), wobei "Mod" für eine modifizierte Übernahme steht [1][2]. Die Ausgaben laufen nicht immer synchron. IEC 62264-1 und -2 erschienen 2013, Teil 3 im Jahr 2016, Teil 4 im Jahr 2015 und Teil 5 im Jahr 2016 [7]; IEC 62264-6, das Messaging-Service-Modell, erschien am 26. Juni 2020 als Ausgabe 1.0 [6]. Wenn ein Vertrag oder ein Lastenheft "ISA-95" zitiert, sollten Teil und Ausgabe genannt werden.

### Die acht Teile von ISA-95

| Teil | Titel (ANSI/ISA-95) | Aktuelle Ausgabe laut ISA | Inhalt in einfachen Worten |
|---|---|---|---|
| 1 | Models and Terminology | 2025 (IEC 62264-1 Mod) | Umfang von Fertigungsbetrieb und Steuerung, Organisation der physischen Anlagen, Schnittstellenfunktionen, gemeinsame Informationen |
| 2 | Objects and Attributes for Enterprise-Control System Integration | 2018 | Die Objekte und Attribute, die an der Schnittstelle Ebene 3 / Ebene 4 ausgetauscht werden |
| 3 | Activity Models of Manufacturing Operations Management | 2013 | Die Aktivitäten innerhalb von Ebene 3 und ein Teil der Daten, die sie austauschen |
| 4 | Objects and Attributes for Manufacturing Operations Management Integration | 2018 | Objektmodelle für Informationen zwischen Aktivitäten der Ebene 3, unabhängig vom Automatisierungsgrad |
| 5 | Business-to-Manufacturing Transactions | 2018 | Transaktionen zwischen Ebene 3 und 4 (Verben wie get, process, sync) |
| 6 | Messaging Service Model | 2014 | Nachrichtenaustausch zwischen Ebene 3 und 4 und innerhalb von Ebene 3 |
| 7 | Alias Service Model | 2017 | Zuordnung gleichwertiger Kennungen zwischen Fertigungsbetrieb und anderen Bereichen |
| 8 | Information Exchange Profiles | 2020 | Profile für bestimmte Schnittstellen zwischen Ebene 4 und 3 oder zwischen Aktivitäten der Ebene 3 |

Quelle: ISA-95-Seite der ISA [1]. Die ISA nennt für Teil 6 das Jahr 2014, während die IEC-Ausgabe von Teil 6 aus dem Jahr 2020 stammt [6].
Für die meisten MES-Projekte leisten die Teile 1 bis 3 die Hauptarbeit: Sie liefern das Vokabular, das Ebenenmodell und das Aktivitätsmodell, die man für ein Lastenheft braucht. Die Teile 2, 4 und 5 werden wichtig, wenn Schnittstellen und Datenmodelle entworfen werden. Die Teile 6 bis 8 betreffen vor allem Integrationsarchitekten und Softwarehersteller.

### Was sich in der Ausgabe 2025 von Teil 1 geändert hat

Die ISA kündigte den neuen Teil 1 am 10. April 2025 an. Er aktualisiert die Fassung von 2010, bildet bestimmte Unternehmensfunktionen ab, schärft die Grenze zwischen Unternehmensebene und Fertigungs-/Steuerungsbereich und verbessert die Konsistenz mit den anderen Teilen [2]. Der Vorsitzende des ISA95-Komitees, Christian Monchinski, verband die Neuausgabe mit "zunehmend modularen Architekturen in Geschäfts- und Fertigungsprozessen" ("increasingly modular architectures across business and manufacturing operations") und einer Verschiebung zu datenzentrierten Designs und sagte, die Aktualisierung "bekräftigt die Bedeutung standardisierter Integrationsschnittstellen" ("reaffirms the importance of standardized integration interfaces") [2]. Für die Praxis ist das ein Signal: ISA-95 soll das gemeinsame Vokabular für modulare, ereignisgesteuerte Architekturen bleiben und nicht durch sie ersetzt werden.

### Die fünf Ebenen von ISA-95

ISA-95 übernimmt sein Ebenenmodell von Purdue. Die Ebenen beschreiben *Funktionen*, nicht Rechner oder Netzwerksegmente [1][4]. Im deutschen Sprachraum ist dafür auch das Bild der Automatisierungspyramide verbreitet.

| Ebene | Name | Was hier passiert (unsere Zusammenfassung) | Typische Systeme | Typischer Zeithorizont |
|---|---|---|---|---|
| 4 | Geschäftsplanung und Logistik (Business planning and logistics) | Aufträge, Materialbedarf, Bestand, Versand, Kostenrechnung für das Werk | ERP, Supply-Chain-Planung | Monate, Wochen, Tage [4] |
| 3 | Manufacturing Operations Management | Ablauf- und Rezeptsteuerung zur Herstellung der Endprodukte; Feinplanung, Auftragsfreigabe, Aufzeichnungen, Qualitäts-, Instandhaltungs- und Bestandsprozesse | MES, LIMS, WMS, CMMS, QMS, Historian, APS (Feinplanung) | Tage, Schichten, Stunden, Minuten, Sekunden [4] |
| 2 | Überwachung und Prozessführung (Monitoring and supervisory control) | Überwachen und Steuern des physischen Prozesses | SCADA, HMI, DCS, SPS | Echtzeitreaktionen im Sub-Sekunden-Bereich [4] |
| 1 | Erfassen und Stellen (Sensing and manipulating) | Sensoren, Aktoren, intelligente Feldgeräte, Ventile | Feldgeräte | In den hier genutzten Quellen nicht angegeben |
| 0 | Physischer Prozess | Die Maschinen und das Material, das umgewandelt wird | Maschinen, Linien, Prozessanlagen | Nicht zutreffend |

Zwei Anmerkungen. Die ISA-Seite selbst führt SCADA in der Zeile von Ebene 3 als Beispiel für ein System der Ebene 3 neben dem MES [1], während die Zusammenfassung der OPC Foundation Automatisierung und Steuerung den Ebenen 1 und 2 und MOM der Ebene 3 zuordnet [4]. In der Praxis überspannt SCADA die Grenze zwischen Ebene 2 und 3: Bildschirme und Alarmbehandlung sind Prozessführung (Ebene 2), Historian- und Berichtsfunktionen dienen oft der Ebene 3. Statt über das Kästchen zu streiten, sollte man für jedes Datum festlegen, welches System das führende System (System of Record) ist. Zweitens betont die OPC Foundation, dass "jede Ebene ihre eigene Definition von Echtzeit hat" ("each level has its own definition for real-time") [4]. Ein MES, das ein Dashboard alle 30 Sekunden aktualisiert, ist für einen Schichtführer Echtzeit und für eine Maschinenverriegelung viel zu langsam.

### Ebenen sind keine Netzwerkzonen

Ein häufiger Fehler ist, die ISA-95-Ebenen und die in der OT-Security verwendeten Purdue-Ebenen gleichzusetzen. ISA-95 beschreibt Funktionen und Informationen; die Netzwerksegmentierung folgt einer anderen Logik, die heute in ISA/IEC 62443 mit Zonen und Conduits (Kommunikationskanälen) festgelegt ist [23]. Die ISA vermerkt, dass ISA-95 sich auf das Purdue-Referenzmodell stützt, um die Netzwerksegmentierung in industriellen Steuerungssystemen zu beschreiben [1]. Eine *Funktion* der Ebene 3 kann aber in einem Cloud-Tenant laufen, während ein *Server* der Ebene 3 im Werk in einer bestimmten Sicherheitszone steht. Der Leitfaden [OT-Security und ISA/IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant) behandelt Zonen, Conduits und DMZ; NIST SP 800-82 Rev. 3 ist der US-Leitfaden zur OT-Sicherheit [24].

### Ist ISA-95 noch aktuell?

Die Antwort der ISA selbst: Die Ebenen helfen weiterhin, Systemgrenzen für Industrie 4.0 und Smart Manufacturing zu beschreiben, auch wenn das Modell als Hierarchie entstanden ist [1]. Das deckt sich mit der Praxis. Die Hierarchie als *Datenpfad* (jeder Wert klettert Ebene für Ebene über Punkt-zu-Punkt-Schnittstellen nach oben) ist schlecht gealtert, und Abschnitt 7 zeigt die Alternativen. Die Hierarchie als *Landkarte von Zuständigkeiten und Vokabular* ist es nicht.

## Die ISA-95-Modelle, die für ein MES-Projekt zählen

ISA-95 enthält mehrere Modelle. Vier davon sollte man beim Namen kennen, bevor man ein MES-Lastenheft schreibt.

### 1. Die funktionale Hierarchie (Ebenen)

Oben behandelt. Sie dient dazu, ein Systemkontextdiagramm zu zeichnen, in dem jedes vorhandene System auf seiner Ebene steht und jede Schnittstelle ein beschrifteter Pfeil ist.

### 2. Die Anlagenhierarchie (Equipment Hierarchy)

ISA-95 ordnet das physische Werk in eine rollenbasierte Anlagenhierarchie: **Unternehmen (Enterprise), Standort (Site), Bereich (Area), Arbeitsbereich (Work Center), Arbeitseinheit (Work Unit)** (die Namen, die die führenden Erklärseiten und der Schwesterleitfaden zu Azure verwenden) [1][27]. Arbeitsbereiche werden weiter typisiert, zum Beispiel als Prozesszellen (Batch), Produktionseinheiten (kontinuierlich), Fertigungslinien (diskret) und Lagerzonen, mit passenden Arbeitseinheiten wie Units, Arbeitszellen und Lagereinheiten. Das ISA-95-Informationsmodell der OPC Foundation führt genau diese Ebenennamen [32], und der öffentliche Entwurf von Teil 1 aus dem Jahr 1999 ordnet Prozesszellen und Units der Batch-Fertigung, Produktionseinheiten der kontinuierlichen und Fertigungslinien und Arbeitszellen der diskreten Fertigung zu [33]. Die Zuordnung der OPC Foundation vermerkt, dass Anlagen verschachtelt sein können und dass das Modell die *Rollen* beschreibt, die Anlagen in der Produktion spielen, getrennt von den physischen Anlagegütern, aus denen sie bestehen [5].

Warum das wichtig ist: Die Anlagenhierarchie wird zur Namenskonvention im MES, im Historian, im CMMS, im Topic-Baum des Unified Namespace und in der Datenplattform. Ein Werk, das dieselbe Maschine in drei Systemen "L2-CNC3", "Linie 2 Mazak" und "WC-4711" nennt, zahlt dafür in jedem Bericht und jeder Integration.

**Beispielhierarchie für das Ventilwerk:**

| Ebene | Beispiel |
|---|---|
| Unternehmen | Acme Fluid Power |
| Standort | Werk Dayton |
| Bereich | Zerspanung; Montage und Prüfung; Lager |
| Arbeitsbereich | Linie 2 (Fertigungslinie); Prüfzelle T1 (Gruppe von Arbeitszellen); Rohmateriallager (Lagerzone) |
| Arbeitseinheit | CNC 3; Waschstation; Dichtheitsprüfer LT-1; Regalzone A |

### 3. Die Objektmodelle (Teil 2 und Teil 4)

ISA-95 beschreibt die Informationen, die zwischen ERP und MES sowie zwischen MES-Aktivitäten ausgetauscht werden, als Objektmodelle mit Attributen. Die Companion Specification der OPC Foundation nennt vier Ressourcenmodelle, die ERP- und MOM-Systeme austauschen: **Material** (einschließlich Materialeigenschaften und Chargen), **Anlagen** (Equipment, bezogen auf die ausgeführten Arbeitsgänge), **physische Anlagegüter** (Physical Assets, aus denen die Anlagen bestehen) und **Personal** (Rollen und Qualifikationen) [4][5]. Darum herum ordnet ISA-95 den Austausch in vier Informationskategorien, die den Lebenslauf eines Auftrags spiegeln: **Produktdefinition** (wie es hergestellt wird), **Produktionsfähigkeit** (welche Ressourcen verfügbar sind), **Produktionsplan** (was wann hergestellt wird) und **Produktionsleistung** (was hergestellt wurde). Die Kategorien entsprechen den Aktivitätsnamen aus Teil 3 [3]; der öffentliche Entwurf von Teil 1 aus dem Jahr 1999 fasst Plan und Leistung als "Produktionsinformation" zusammen [33].

Eine praktische Regel aus diesem Modell: Dem ERP gehört das "Was und Wann", dem MES das "Wie und was tatsächlich passiert ist". Wenn das ERP einen Arbeitsplan mit Vorgabezeiten führt und das MES eine detailliertere Arbeitsdefinition mit Parametern und Anweisungen, muss ausdrücklich festgelegt werden, welches System für welches Attribut führend ist und wie Änderungen fließen.

### 4. Das Aktivitätsmodell (Teil 3)

Das ist der nützlichste und am wenigsten erklärte Teil von ISA-95. Teil 3 teilt das Manufacturing Operations Management in vier Kategorien: **Produktionsprozesse, Instandhaltungsprozesse, Qualitätsprüfprozesse und Bestandsprozesse**. In jeder davon verwendet er dieselben acht generischen Aktivitäten [3]:

| Generische Aktivität | Produktion | Instandhaltung | Qualitätsprüfung | Bestand |
|---|---|---|---|---|
| Definitionsmanagement | Produktdefinitionsmanagement (Arbeitspläne, Rezepte, Arbeitsanweisungen) | Instandhaltungsdefinitionsmanagement (Aufgabenlisten, Verfahren) | Prüfdefinitionsmanagement (Prüfspezifikationen, Stichprobenpläne) | Bestandsdefinitionsmanagement (Lager- und Umlagerungsregeln) |
| Ressourcenmanagement | Produktionsressourcenmanagement (Verfügbarkeit und Qualifikation von Personal, Anlagen, Material) | Instandhaltungsressourcenmanagement (Techniker, Ersatzteile, Werkzeuge) | Prüfressourcenmanagement (Laborgeräte, Laboranten) | Bestandsressourcenmanagement (Lagerplätze, Fördermittel) |
| Feinplanung | Produktionsfeinplanung (Reihenfolge auf Ressourcen) | Instandhaltungsfeinplanung | Prüffeinplanung | Bestandsfeinplanung (Umlagerungen, Nachschub) |
| Auftragsfreigabe (Dispatching) | Produktionsfreigabe (Arbeit an Stationen freigeben) | Instandhaltungsfreigabe (Aufträge an Techniker) | Prüffreigabe (Proben ins Labor) | Bestandsfreigabe (Transportaufträge) |
| Ausführungsmanagement | Produktionsausführung (Ausführung führen und prüfen) | Instandhaltungsausführung | Prüfausführung | Bestandsausführung |
| Datenerfassung | Produktionsdatenerfassung (Stückzahlen, Zeiten, Parameter) | Instandhaltungsdatenerfassung (Befunde, Stunden, Teile) | Prüfdatenerfassung (Ergebnisse) | Bestandsdatenerfassung (Bewegungen, Zählungen) |
| Verfolgung (Tracking) | Produktionsverfolgung (WIP, Genealogie, Rückmeldung ans ERP) | Instandhaltungsverfolgung (Historie je Anlage) | Prüfverfolgung (Ergebnisse je Charge oder Seriennummer) | Bestandsverfolgung (Ort und Status des Materials) |
| Leistungsanalyse | Produktionsleistungsanalyse (OEE, Ausbeute, Zykluszeit) | Instandhaltungsleistungsanalyse (MTBF, MTTR) | Prüfleistungsanalyse (Prozessfähigkeit, Trends) | Bestandsleistungsanalyse (Umschlag, Bestandsgenauigkeit) |

Zeilen- und Spaltennamen folgen den Abschnittstiteln von ANSI/ISA-95.00.03-2013 (Abschnitte 6 bis 9) [3]; die Beispiele in Klammern stammen von uns. *Automation World* fasste dieselbe Aufteilung als "Produktion, Instandhaltung, Qualität und Bestand" zusammen [13].

**So wird die Matrix im Projekt genutzt:** Als 4 × 8-Raster ausdrucken. Für jede der 32 Zellen notieren, welches System das heute erledigt (Papier, Excel, ERP, MES, CMMS, LIMS, WMS, niemand) und welches es nach dem Projekt erledigen soll. Die leeren Zellen und die Zellen mit drei Systemen sind die eigentliche Umfangsdiskussion. Ein typisches Ergebnis für ein Werk der diskreten Fertigung: Produktionsspalte überwiegend MES, Instandhaltungsspalte im CMMS, Qualitätsprüfung aufgeteilt zwischen MES (Prüfungen im Prozess) und LIMS oder QMS (Laborprüfungen, CAPA), Bestand aufgeteilt zwischen ERP (Lagerbestände) und WMS oder MES (Bereitstellung an die Linie). Die Feinplanung in der Produktionsspalte geht oft an ein APS (siehe [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/)).

### Eine Anmerkung zu ISA-88 und VDI 5600

Zwei verwandte Rahmenwerke tauchen in MES-Projekten auf. **ISA-88** ist die Norm für Chargensteuerung (Batch Control); ihr Modell der prozeduralen Steuerung (Prozeduren, Teilprozeduren, Operationen, Phasen) wurde von der IEC als IEC 61512-1 übernommen [34] und ist der übliche Weg, Rezepte in Pharma, Lebensmittel und Chemie zu strukturieren. BatchML, das Gegenstück zu B2MML, setzt ISA-88 um [36], und viele MES-Produkte setzen elektronische Chargenprotokolle darauf auf [unbelegt: Beobachtung aus der Praxis]. **VDI 5600**, eine Richtlinie des Vereins Deutscher Ingenieure (Blatt 1 vom Oktober 2016), listet die MES-Aufgaben ähnlich wie MESA-11 und ist in deutschen Werken und in Ausschreibungen deutscher Muttergesellschaften verbreitet [21].

## MES vs. ERP vs. MOM vs. SCADA und andere Systeme im Werk

"Was ist der Unterschied zwischen MES und ERP?" ist die häufigste MES-Frage in der Suche, gefolgt von MES vs. SCADA. Die Kurzfassung: Das ERP plant und bucht, das MES führt aus und dokumentiert, SCADA überwacht und steuert Maschinen. Die ausführliche Fassung braucht eine Tabelle, denn die Grenzen hängen von der Branche und von den bereits vorhandenen Produkten ab.

### Vergleichstabelle

| Dimension | ERP (Ebene 4) | MES (Ebene 3) | MOM (Ebene 3, breiter) | SCADA / HMI (Ebene 2, teils 3) | Historian |
|---|---|---|---|---|---|
| Leitfrage | Was sollen wir fertigen, kaufen und versenden, und was hat es gekostet? | Wie genau wird dieser Auftrag gefertigt, und was ist tatsächlich passiert? | Wie arbeiten Produktions-, Qualitäts-, Instandhaltungs- und Bestandsprozesse zusammen? | Was macht die Maschine oder der Prozess gerade, und wie steuere ich ihn? | Wie haben sich die Prozesswerte über die Zeit entwickelt? |
| Zeithorizont | Monate, Wochen, Tage [4] | Schichten, Stunden, Minuten, Sekunden [4] | Wie MES | Sub-Sekunden bis Sekunden [4] | Sekunden bis Jahre |
| Arbeitseinheit | Fertigungsauftrag, Bestellung, Kundenauftrag | Arbeitsgang, Arbeitsschritt, Charge, Seriennummer | Auftrag plus Prüfung, Instandhaltungsauftrag, Transportauftrag | Tag (Datenpunkt), Alarm, Sollwert | Zeitreihen-Tag |
| Typische Daten | Stückliste, Arbeitsplan, Standardkosten, Bestand, Bedarf | Arbeitsanweisungen, Ist-Zeiten und Ist-Mengen, Parameter, Genealogie, Fehler, Freigaben | MES-Daten plus Laborergebnisse, Instandhaltungshistorie, Materialbewegungen | Live-Werte, Alarme, Bedienbefehle | Komprimierte Zeitreihen |
| Nutzer | Planung, Einkauf, Finanzen, Vertrieb | Werker, Schichtführer, Qualität, Prozessingenieure | Werksleitung, alle operativen Funktionen | Leitstandsfahrer, Instandhaltungstechniker | Ingenieure, Analysten |
| Führendes System für | Finanzbuchungen, Bestandswert, Bedarf | Ist-Dokumentation (As-built), Ausführungshistorie | Betriebsaufzeichnungen über alle Kategorien | Steuerungszustände und Alarme | Prozesshistorie |
| Typischer Fehler bei falschem Einsatz | Rückmeldungen aus der Fertigung werden Tage zu spät abgetippt | Als Planungswerkzeug oder Datenhalde ohne Prozesslogik genutzt | Umfang so breit, dass nichts live geht | Als Auftragsverwaltung genutzt | Als führendes System für Mengen behandelt |

MOM ist der ISA-95-Name für die gesamte Ebene 3; unter MES versteht man meist ihren produktionsbezogenen Kern [10][14]. Viele Anbieter verkaufen "MOM-Suiten" mit Qualitäts- und Instandhaltungsmodulen. Ob man es MES oder MOM nennt, ist weniger wichtig als die Frage, ob jede Zelle der Aktivitätsmatrix aus Abschnitt 4 genau einen Verantwortlichen hat.

### Andere Systeme der Ebene 3 und wo die MES-Grenze meist verläuft

| System | Kernaufgabe | Typische Grenze zum MES |
|---|---|---|
| QMS (Qualitätsmanagementsystem) | Abweichungen, CAPA, Audits, Dokumentenlenkung, Lieferantenqualität | Das MES erfasst Prüfergebnisse im Prozess und Sperren; das QMS steuert Untersuchung und Korrekturmaßnahme. Integration: Abweichung im MES angelegt, im QMS bearbeitet |
| LIMS (Labor-Informationsmanagementsystem) | Proben, Laborprüfungen, Spezifikationen, Analysenzertifikate | Das MES fordert Proben an und erhält Freigabeentscheidungen; das LIMS führt den Prüfdatensatz |
| CMMS / EAM | Instandhaltungsaufträge, Ersatzteile, Anlagenhistorie | Das MES meldet Maschinenzustände und Zähler; das CMMS plant die Instandhaltung. Gemeinsame Anlagenkennungen sind unverzichtbar |
| WMS | Einlagerung, Kommissionierung, Lagerbewegungen | Das MES fordert Material an die Linie an und bestätigt den Verbrauch; das WMS führt die Bewegungen aus |
| APS | Kapazitätsgenaue Feinplanung und Reihenfolgebildung | Das APS erzeugt die Reihenfolge; das MES gibt frei und meldet Istwerte zurück. Manche MES-Produkte enthalten ein APS-Modul |
| PLM | Produktentwicklung, Konstruktionsstückliste, Änderungsmanagement | Das PLM gibt die Konstruktionsdefinition frei; das MES nutzt die Fertigungsdefinition (oft über das ERP oder ein Werkzeug zur Fertigungsprozessplanung) |
| Datenplattform / Analytics | Werksübergreifende Analyse, KI, Langzeitspeicherung | Das MES ist eine Quelle; es sollte nicht zum unternehmensweiten Data Lake werden. Siehe [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/) |

### Ist SAP ein MES? Reicht das ERP?

ERP-Anbieter bieten Funktionen für die Fertigungsausführung an, entweder im ERP selbst (Rückmeldungen aus der Fertigung, einfache Auftragslisten) oder als eigene Produkte. SAP zum Beispiel beschreibt SAP Digital Manufacturing als cloudbasierte Plattform für Manufacturing Operations Management (MOM) und empfiehlt Kunden des älteren SAP Manufacturing Execution den Umstieg darauf (Herstellerangabe) [35]. Ob das ERP allein genügt, hängt von vier Fragen ab:

1. **Granularität:** Muss je Arbeitsgang und Auftrag erfasst werden oder je Arbeitsschritt, Seriennummer und Parameter?
2. **Verzug:** Reicht die Rückmeldung zum Schichtende, oder hängen Entscheidungen an Minuten?
3. **Durchsetzung:** Muss das System einen falschen Schritt *verhindern* (falsches Material, nicht qualifizierter Werker, fehlende Prüfung) oder ihn nur aufzeichnen?
4. **Regulierung:** Werden elektronische Chargenprotokolle oder Device History Records mit Audit-Trails und elektronischen Unterschriften benötigt?

**Anzeichen, dass die reine ERP-Ausführung nicht mehr reicht:** Rückmeldungen werden mehr als eine Schicht zu spät eingetippt; mehr als eine Schattentabelle je Bereich; ein Kunde oder eine Behörde verlangt eine Rückverfolgbarkeit, die sich nur in Tagen zusammenstellen lässt; Qualitätsdurchschlupf durch falsche Revisionsstände oder falsches Material; Schichtführer verbringen die erste Stunde jeder Schicht damit, Zahlen einzusammeln.

Lauten alle vier Antworten "grob, Schichtende, nur aufzeichnen, nein", können die Fertigungsfunktionen des ERP plus gute Disziplin genügen, vor allem in kleinen Werken. Zeigen zwei oder mehr Antworten in die andere Richtung, werden MES-Funktionen gebraucht, ob vom ERP-Anbieter, von einem MES-Anbieter oder von einer Plattform.

## MES-Funktionen im Detail

Die folgenden Funktionen folgen der Produktionsspalte des ISA-95-Aktivitätsmodells [3], ergänzt um die MESA-11-Funktionen, die die meisten Produkte weiterhin abdecken [9]. Für jede gilt: was sie tut, was sie braucht und woran sie typischerweise scheitert.

### 1. Produktdefinitionsmanagement (Arbeitsdefinitionen, Arbeitspläne, Rezepte)

**Was sie tut:** Hält die Fertigungsdefinition jedes Produkts: Arbeitsgänge, Arbeitsschritte, Parameter, benötigte Materialien, Werkzeuge, Qualifikationen, Arbeitsanweisungen und Prüfungen. In der Batch-Industrie ist das das Grundrezept (Master Recipe).

**Was sie braucht:** Eine klare Aufteilung der Stammdaten mit ERP und PLM, Versionsverwaltung und einen Änderungsprozess, der die Fertigung erreicht, bevor der nächste Auftrag startet.

**Typischer Fehler:** Zwei führende Systeme. Der ERP-Arbeitsplan sagt 12 Arbeitsgänge, das MES 14, und niemand weiß, welche Zeiten für die Kalkulation verwendet werden.

### 2. Ressourcenmanagement (Personal, Anlagen, Material)

**Was sie tut:** Weiß, welche Ressourcen verfügbar und qualifiziert sind: Maschinenstatus, Werkzeugstandzeit, Schulung und Zertifizierung der Werker, an der Linie vorhandene Materialchargen.

**Was sie braucht:** Schulungsnachweise (oft aus der Personalabteilung oder einem Lernsystem), Anlagenstatus aus CMMS und Steuerung, Materialstatus aus ERP oder WMS.

**Typischer Fehler:** Das MES sperrt einen Werker, weil der Schulungsnachweis in der Personalabteilung drei Monate hinterherhinkt. Erst den Prozess für Qualifikationsaktualisierungen in Ordnung bringen, dann die harte Durchsetzung einschalten. Der Vertiefungsartikel zur [Qualifikationsmatrix](https://www.m365.fm/learn/operational-excellence/qualifikationsmatrix/) (geplant) behandelt Qualifikationsmatrizen.

### 3. Feinplanung

**Was sie tut:** Macht aus freigegebenen Aufträgen eine Reihenfolge je Ressource und berücksichtigt dabei Kapazitäten, Rüstvorgänge, Materialverfügbarkeit und Liefertermine. MESA-11 nennt das Operations/Detailed Scheduling [9].

**Was sie braucht:** Genaue Bearbeitungs- und Rüstzeiten, echte Ressourcenkalender und den tatsächlichen Fortschritt aus der Fertigung.

**Typischer Fehler:** Ein "Plan", der in Wirklichkeit die nach Liefertermin sortierte ERP-Auftragsliste ist. Wenn die Planung im Werk ein echter Engpass ist, das MES-Modul mit einem eigenständigen APS vergleichen.

### 4. Auftragsfreigabe (Dispatching)

**Was sie tut:** Gibt den nächsten Auftrag im richtigen Moment an einen Arbeitsplatz oder Werker frei, mit allen Unterlagen und Materialien bereit. MESA-11: Dispatching Production Units [9].

**Typischer Fehler:** Auftragslisten, die Werker ignorieren, weil sie nicht die Wirklichkeit abbilden (fehlendes Material, Maschine steht). Die Abhilfe ist ein geschlossener Regelkreis: Die Freigabe muss den Live-Status der Ressourcen nutzen.

### 5. Ausführungsmanagement und Arbeitsanweisungen

**Was sie tut:** Führt den Werker oder die Maschine durch die Schritte, erzwingt Reihenfolge und Prüfungen, sammelt Freigaben und stoppt den Prozess, wenn eine erforderliche Bedingung nicht erfüllt ist. Hier unterscheidet sich ein MES am stärksten von einem Berichtswerkzeug.

**Was sie braucht:** Gut geschriebene, visuelle Arbeitsanweisungen; Entscheidungen darüber, welche Prüfungen harte Sperren und welche Warnungen sind; Terminals oder Tablets am Arbeitsplatz.

**Sicherheitsgrenze:** Sicherheitsfunktionen (Schutzeinrichtungen, Not-Halt, Sicherheitsverriegelungen) gehören in sicherheitsgerichtete Steuerungen auf den Ebenen 1 und 2, nie ins MES. Das MES darf den *nächsten Auftragsschritt* sperren; es darf nie das Einzige sein, was einen Menschen schützt.

**Typischer Fehler:** Eine 40-seitige Papieranweisung eins zu eins digitalisieren. Anweisungen für den Bildschirm neu schreiben, mit Werkern testen und kurz halten. Siehe [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) (geplant) und [papierlose Fertigung](https://www.m365.fm/learn/shop-floor-management/papierlose-fertigung/) (geplant).

### 6. Datenerfassung (Betriebs- und Maschinendatenerfassung)

**Was sie tut:** Erfasst Mengen, Zeiten, Zustände, Parameter und Messwerte, wo möglich automatisch von den Maschinen und sonst manuell. In deutschen Werken spricht man hier von BDE und MDE.

**Was sie braucht:** Maschinenanbindung (OPC UA, MTConnect, herstellereigene Protokolle oder einfache E/A-Signale für Zähler und Zustände), ein Zeitmodell (was als geplanter Stillstand zählt) und Listen von Grundcodes, die Werker tatsächlich nutzen können.

**Typischer Fehler:** 120 Stillstandsgründe. Werker wählen den ersten in der Liste. Mit acht bis fünfzehn Codes je Bereich beginnen und sie mit den Menschen verfeinern, die sie benutzen.

### 7. Qualitätsmanagement in der Ausführung

**Was sie tut:** Prüfungen im Prozess, SPC, Stichprobenpläne, Sperren und Freigaben, Erfassung von Abweichungen, Verknüpfung mit dem QMS für die Untersuchung.

**Was sie braucht:** Prüfpläne und Merkmale aus der Qualitätsplanung (in der Automobilindustrie PFMEA und Produktionslenkungsplan), Anbindung der Messmittel, Regeln dafür, was bei einer nicht bestandenen Prüfung passiert.

**Typischer Fehler:** Prüfergebnisse werden gesammelt, aber nie genutzt, um den Prozess zu stoppen. Eine Prüfung, die die Linie nicht anhalten kann, ist eine Aufzeichnung, keine Lenkung. Ursachenanalyse gehört ins Qualitätssystem; siehe [Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant).

### 8. Verfolgung, Rückverfolgbarkeit und Genealogie

**Was sie tut:** Verfolgt die Ware in Arbeit (WIP) und baut die Ist-Dokumentation auf: welche Materialchargen und Bauteile von welchen Lieferanten in welche Seriennummern oder Chargen eingingen, auf welcher Anlage mit welchen Parametern von wem bearbeitet. MESA-11: Product Tracking and Genealogy [9].

**Was sie braucht:** Eindeutige Kennzeichnung (Barcodes, 2D-Codes, RFID), diszipliniertes Scannen an jedem Verbrauchspunkt, eine klare Regel für Schüttgut (Chargenebene vs. Seriennummernebene).

**Typischer Fehler:** Die Genealogie wird nachträglich aus Versandpapieren rekonstruiert. Sie muss im Prozess erfasst werden. Ein einfacher Test: Eine zufällige fertige Seriennummer wählen und fragen, wie lange es dauert, alle Bauteilchargen aufzulisten. Dann umgekehrt: Eine Bauteilcharge wählen und alle fertigen Einheiten auflisten, die sie enthalten.

### 9. Leistungsanalyse

**Was sie tut:** OEE, Ausbeute, Ausschuss, Zykluszeit, Plantreue und Stillstandsanalyse nach Schicht, Linie und Produkt; die Grundlage für die täglichen Shopfloor-Runden. Abschnitt 14 behandelt die Kennzahlen.

**Typischer Fehler:** Dashboards, über die niemand spricht. Jede Kennzahl an eine Besprechung und einen Verantwortlichen knüpfen, wie im [Shopfloor Management](https://www.m365.fm/learn/shop-floor-management/) beschrieben.

### 10. Dokumentenlenkung

**Was sie tut:** Liefert den aktuellen Revisionsstand von Zeichnungen, Anweisungen und Spezifikationen an den Arbeitsplatz und dokumentiert, welcher Stand verwendet wurde. Oft geteilt mit einem Dokumentenmanagementsystem oder dem QMS oder an diese delegiert.

### 11. Personalmanagement (Labor Management)

**Was sie tut:** Erfasst, wer wie lange an welchem Auftrag gearbeitet hat, für Kalkulation, Qualifikationsprüfungen und Schnittstellen zur Lohnabrechnung. Dazu die menschliche Seite in Abschnitt 15: Arbeitszeiterfassung auf Arbeitsgangebene ist sensibel und kann in den USA in gewerkschaftlich organisierten Werken Gegenstand von Tarifverhandlungen sein.

### 12. Instandhaltungsbezogene Funktionen

**Was sie tut:** Maschinenzustände, Zähler und Alarme aus dem MES speisen zustands- oder nutzungsabhängige Instandhaltung im CMMS. Das vollständige Instandhaltungsmanagement bleibt meist im CMMS. Siehe [TPM und OEE](https://www.m365.fm/learn/tpm-oee/) (geplant) und [Predictive Maintenance und IIoT](https://www.m365.fm/learn/predictive-maintenance-iiot/) (geplant).

### 13. Bestand und Materialfluss an der Linie

**Was sie tut:** Fordert Material an die Linie an, bestätigt den Verbrauch, verfolgt WIP-Puffer und den Bestand an der Linie. Kanban-Signale können aus Verbrauchsdaten des MES ausgelöst werden; siehe [Kanban und Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/) (geplant) und [Intralogistik](https://www.m365.fm/learn/produktionsplanung-aps/intralogistik/) (geplant).

### Diskret, Prozess und Batch: wie sich der Schwerpunkt verschiebt

| Fertigungstyp | Typischer MES-Schwerpunkt | Beispiele |
|---|---|---|
| Diskret, hohe Stückzahl (Automobil, Elektronik) | Seriennummern-Genealogie, Verriegelungen, Maschinendaten, OEE, Andon | Karosseriebau, Leiterplattenbestückung |
| Diskret, hohe Variantenvielfalt, kleine Stückzahl (Maschinenbau, Luftfahrt) | Arbeitsanweisungen, Laufkarten, Abweichungen, Qualifikation der Werker, Ist-Konfiguration | Montage von Werkzeugmaschinen, Flugzeugstrukturen |
| Batch (Pharma, Lebensmittel, Spezialchemie) | Elektronische Chargenprotokolle, Rezeptausführung, Einwaage und Verwiegung, Review by Exception, Compliance | Tablettenherstellung, Soßen |
| Kontinuierlich (Papier, Stahl, Raffinerie) | Produktionsverfolgung nach Zeit und Charge, Qualität über Proben, Energie, Integration mit DCS und LIMS | Papiermaschine, Warmbreitbandstraße |

Für Besonderheiten der Luftfahrt (AS9100/EN 9100, Erstmusterprüfung, Konfigurationskontrolle) siehe [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/).

## Integration: B2MML, OPC UA, MTConnect und Unified Namespace

Ein MES ist nur so gut wie seine Schnittstellen. Es braucht Aufträge und Stammdaten von oben, Maschinendaten von unten und muss bestätigte Ergebnisse zurückgeben. Vier Bausteine kehren immer wieder.

### Nach oben: ERP-Integration und B2MML

Die ERP-MES-Schnittstelle trägt nur wenige Nachrichtentypen, die sich sauber auf die Informationskategorien von ISA-95 abbilden lassen:

| Richtung | Nachricht | Inhalt | Auslöser |
|---|---|---|---|
| ERP -> MES | Produktdefinition / Arbeitsplan | Arbeitsgänge, Stückliste, Arbeitsplätze, Vorgabezeiten | Freigabe einer technischen Änderung |
| ERP -> MES | Fertigungsauftrag (Plan) | Material, Menge, Liefertermin, Verweis auf den Arbeitsplan | Auftragsfreigabe |
| ERP -> MES | Materialstamm, Chargen | Materialnummern, Chargenmerkmale | Änderung, Wareneingang |
| MES -> ERP | Arbeitsgangrückmeldung (Leistung) | Gut- und Ausschussmengen, Zeiten, Personalzeiten | Ende des Arbeitsgangs oder periodisch |
| MES -> ERP | Warenbewegungen | Verbrauch, Wareneingang aus der Fertigung | Verbrauchsscan, Auftragsabschluss |
| MES -> ERP | Qualitätsmeldung | Fehler, Sperren | Abweichung |
| MES <-> ERP | Fähigkeit / Status | Ressourcenverfügbarkeit, Auftragsstatus | Statusänderung |

**B2MML** (Business To Manufacturing Markup Language) ist die XML-Umsetzung der ISA-95-Objektmodelle durch die MESA; die ISA-95-Companion-Specification der OPC Foundation folgt, wo möglich, der B2MML-Zuordnung, um die Übersetzung zu erleichtern [5]. B2MML oder ein JSON-Gegenstück macht eine Schnittstelle nicht Plug-and-Play, gibt aber beiden Seiten dieselben Objektnamen und Strukturen und verkürzt so die Spezifikationsarbeit. Nach der Auflösung der MESA sollte geklärt werden, wo die Schemas gepflegt werden (siehe Abschnitt 2) [11].

**Regeln, die Monate sparen:**

- Für jedes Attribut festlegen, welches System führend ist, und nie zwei Systeme dasselbe Feld schreiben lassen.
- Sich auf das *Ereignis* einigen, das eine Rückmeldung auslöst (Ende des Arbeitsgangs, alle 15 Minuten, Auftragsende), nicht nur auf das Format.
- Schnittstellen idempotent bauen: Eine doppelt gesendete Nachricht darf Mengen nicht doppelt buchen.
- Für den Fall planen, dass das ERP nicht erreichbar ist. Das MES muss weiterlaufen und Buchungen zwischenspeichern.

### Nach unten: Maschinen- und Steuerungsintegration mit OPC UA und MTConnect

**OPC UA** ist die vorherrschende herstellerneutrale Schnittstelle zwischen Steuerungen und Software der Ebene 3. Die OPC Foundation pflegt Companion Specifications, die Informationsmodelle für bestimmte Bereiche festlegen, darunter OPC 10030, das das gemeinsame Objektmodell von ISA-95 in OPC UA abbildet [4][5]. In Azure IoT Operations von Microsoft zum Beispiel liest der OPC-UA-Connector konfigurierte Datenpunkte und veröffentlicht sie an einen MQTT-Broker [26]; der Schwesterleitfaden [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/) behandelt diesen Stack.

**MTConnect** ist ein offener Standard für Daten von Werkzeugmaschinen und Fertigungseinrichtungen, veröffentlicht als ANSI/MTC1.4-2018 [22]. Viele US-Werkzeugmaschinenhersteller unterstützen ihn von Haus aus, was ihn für Lohnfertiger mit CNC-Maschinen attraktiv macht.

Für Verpackungslinien liefert das PackML-Zustandsmodell (aus dem technischen Bericht ISA-TR88.00.02, aktuelle Ausgabe 2022) Maschinen einen gemeinsamen Satz von Zuständen und Betriebsarten [37], was die OEE-Berechnung über verschiedene Maschinenhersteller hinweg vereinfacht.

**Was mindestens von der Maschine gebraucht wird:** ein Zustand (läuft, steht, gestört, im Rüsten), ein Gutteilzähler, ein Ausschusszähler, das aktive Programm oder Rezept und Alarmcodes. Alles andere ist ein Bonus für spätere Anwendungsfälle.

### Seitwärts und nach außen: der Unified Namespace (UNS)

Ein **Unified Namespace** ist ein Architekturmuster, kein Standard: Systeme veröffentlichen ihren aktuellen Zustand als Ereignisse an einen zentralen Broker, meist MQTT, gegliedert in einem hierarchischen Topic-Baum, und andere Systeme abonnieren, was sie brauchen. Der Topic-Baum folgt meist der ISA-95-Anlagenhierarchie. Der [Azure-Pillar](https://www.m365.fm/learn/manufacturing-it-azure/) zeigt ein vollständiges Topic-Beispiel und die Azure-Dienste, die es umsetzen; dieser Abschnitt konzentriert sich darauf, was ein UNS für das MES bedeutet.

```
acme/dayton/machining/line-2/cnc-3/state
acme/dayton/machining/line-2/cnc-3/counts
acme/dayton/machining/line-2/order/current
acme/dayton/assembly/test-cell-t1/lt-1/result
```

**MQTT** ist ein schlankes Publish/Subscribe-Protokoll; aktuelle Broker unterstützen die Versionen 3.1.1 und 5, wie Microsoft für den Broker in Azure IoT Operations dokumentiert [25]. **Sparkplug**, gepflegt von der Eclipse Sparkplug Working Group, ergänzt MQTT um eine Konvention für Nutzdaten und Zustände; aktuell ist Version 3.0. Ihre "Birth and Death Certificates" teilen den Abonnenten mit, ob die Daten eines Geräts noch gültig sind [28]. Die eigene Topic-Struktur von Sparkplug (Gruppe, Edge-Knoten, Gerät) ist nicht die ISA-95-Hierarchie. Werke, die Sparkplug nutzen, bilden die Hierarchie deshalb meist in der Group-ID ab (zum Beispiel `spBv1.0/Plant1:Area3:Line4:Cell2/NDATA/<edge node>`) oder verteilen die Ebenen auf mehrere Broker oder einen zweiten, nach ISA-95 strukturierten Namespace; ein Broker-Anbieter beschreibt beide Muster und warnt, dass die begrenzte Zahl von Topic-Elementen in Sparkplug die Zuordnung eng macht [44].

**Was ein UNS für das MES ändert:**

| Ohne UNS | Mit UNS |
|---|---|
| Das MES verbindet sich Punkt zu Punkt mit jeder Maschine, dem ERP, dem QMS, jedem Dashboard | Das MES abonniert Maschinen- und Auftrags-Topics und veröffentlicht eigene Ereignisse (Auftrag gestartet, Arbeitsgang abgeschlossen, Sperre gesetzt) |
| Neue Abnehmer (ein Dashboard, ein KI-Modell) brauchen eine neue Schnittstelle zum MES | Neue Abnehmer abonnieren vorhandene Topics |
| Der aktuelle Zustand ist über Systeme verstreut | Der aktuelle Zustand ist an einer Stelle sichtbar |

**Was ein UNS nicht ändert:**

- **Die Geschäftslogik bleibt im MES.** Der Broker transportiert Nachrichten; er stellt nicht sicher, dass das richtige Material verwendet wird, dass ein Werker qualifiziert ist oder dass ein Chargenprotokoll vollständig ist.
- **Die führenden Aufzeichnungen bleiben in den führenden Systemen.** Ein Broker hält den aktuellen Zustand, keine prüfbare Historie. Genealogie, Chargenprotokolle und Rückmeldungen müssen transaktional im MES (und im ERP) gespeichert werden, in regulierten Umgebungen mit Audit-Trails.
- **Semantik braucht weiterhin ein Modell.** Ein Topic namens `counts` ist nutzlos, wenn eine Maschine Zyklen und eine andere Gutteile zählt. ISA-95-Objekte und OPC-UA-Companion-Specifications liefern die Semantik der Nutzdaten.
- **Sicherheit wird schwieriger, nicht einfacher.** Ein Broker, an den jedes System schreiben darf, ist ein lohnendes Angriffsziel; Zugriffskontrolle je Topic, authentifizierte Clients und Segmentierung nach ISA/IEC 62443 sind Pflicht [23][24].

**Streitfrage: "UNS ersetzt ISA-95."** Diese Behauptung liest man immer wieder. Sie verwechselt zwei Dinge. Die ISA selbst vertritt die Position, dass die Ebenen weiterhin helfen, Systemgrenzen zu beschreiben, auch wenn Daten nicht mehr Ebene für Ebene fließen [1], und die Ausgabe 2025 von Teil 1 zielt ausdrücklich auf datenzentrierte, modulare Architekturen [2]. Die tragfähige Synthese: ISA-95 für Vokabular, Anlagenhierarchie und Zuständigkeiten; UNS (oder ein anderes Event-Backbone) für den Transport; MES und ERP als transaktionale führende Systeme.

### Integrationsarchitektur: drei Muster im Vergleich

| Muster | Funktionsweise | Geeignet für | Worauf achten |
|---|---|---|---|
| Punkt-zu-Punkt | Jedes System hat direkte Schnittstellen zu den anderen | Kleine Werke mit 3 bis 5 Systemen | Bis zu n × (n − 1) ÷ 2 Schnittstellen: 10 bei 5 Systemen, 45 bei 10; fragile Upgrades |
| Integrations-Middleware / ESB | Eine zentrale Integrationsschicht wandelt und leitet Nachrichten | ERP-zentrierte Unternehmen mit IT-Integrationsteams | Kann zum Flaschenhals werden, der einem fernen Team gehört |
| Event-Backbone / UNS | Publish/Subscribe-Broker mit gemeinsamer Topic- und Nutzdatenkonvention | Werke mit vielen Maschinen und vielen Datenabnehmern | Braucht Governance für Topics, Nutzdaten und Zugriffe; transaktionale Flüsse brauchen weiterhin garantierte Zustellung |

Die meisten Werke landen bei einer Mischung: ein UNS für Maschinen- und Zustandsdaten, eine Integration mit garantierter Zustellung für ERP-Transaktionen.

## MES in regulierten Branchen

In regulierten Branchen ist das MES Teil des Qualitätssystems, und seine Aufzeichnungen sind rechtlich relevante Aufzeichnungen. Dieser Abschnitt nennt die US-Regeln, auf die hin ausgelegt werden muss (US-Kontext; FDA-Vorschriften gelten für Hersteller, die für den US-Markt produzieren); er ersetzt nicht den Rat der eigenen Zulassungsabteilung (Regulatory Affairs).

### FDA 21 CFR Part 11: elektronische Aufzeichnungen und Unterschriften

Für geschlossene Systeme verlangt 21 CFR 11.10 in den USA unter anderem die Validierung der Systeme auf Genauigkeit, Zuverlässigkeit und gleichbleibend bestimmungsgemäße Leistung; die Möglichkeit, genaue und vollständige Kopien von Aufzeichnungen zu erzeugen; den Schutz der Aufzeichnungen über die gesamte Aufbewahrungsfrist; die Beschränkung des Systemzugangs auf befugte Personen; und "sichere, computergenerierte, mit Zeitstempel versehene Audit-Trails" ("secure, computer-generated, time-stamped audit trails"), die Datum und Uhrzeit von Benutzereingaben und Aktionen festhalten, die Aufzeichnungen anlegen, ändern oder löschen, ohne früher erfasste Informationen zu verdecken [19]. Weitere Absätze betreffen Ablauf- und Berechtigungsprüfungen, Geräteprüfungen, Schulung und schriftliche Richtlinien.

**Was das für ein MES bedeutet:** Benutzerkonten je Person (keine geteilten Anmeldungen am Terminal), Audit-Trails für jede regulierte Aufzeichnung, elektronische Unterschriften, die mit der Aufzeichnung verknüpft sind und Namen, Datum, Uhrzeit und Bedeutung der Unterschrift zeigen, und ein Validierungspaket. Validierungsaufwand in Zeit und Budget einplanen; in der Pharmaindustrie ist er oft ein großer Teil des Einführungsaufwands [unbelegt: kein öffentlicher Benchmark für den Anteil].

### Pharma: elektronische Chargenprotokolle

Arzneimittelhersteller müssen nach den US-Vorschriften zur Guten Herstellungspraxis (cGMP) in 21 CFR Part 211 für jede Charge Herstellungs- und Prüfprotokolle führen; Abschnitt 211.188 legt fest, dass "für jede hergestellte Charge eines Arzneimittels Chargenherstellungs- und Kontrollaufzeichnungen zu erstellen sind" ("batch production and control records shall be prepared for each batch of drug product produced") [38]. Ein MES mit elektronischen Chargenprotokollen (eBR) erzwingt die Rezeptreihenfolge, erfasst Gewichte und Parameter an der Quelle und unterstützt **Review by Exception**: Die QA prüft die vom System markierten Abweichungen, statt jede Seite zu lesen. Das ist einer der stärksten MES-Business-Cases überhaupt, weil die Prüfzeit für Chargenprotokolle oft die Freigabe begrenzt.

### Medizinprodukte: QMSR und Device History Records

Seit dem 2. Februar 2026 bezieht die Quality Management System Regulation der FDA (21 CFR Part 820) die ISO 13485:2016 per Verweis ein, einschließlich ihrer Anforderungen an Kennzeichnung und Rückverfolgbarkeit [20]. Der ältere Begriff "Device History Record" (DHR) taucht noch in vielen MES-Produktbeschreibungen und Werksverfahren auf; die QMSR-Seite der FDA verwendet ihn nicht. Unsere Empfehlung ist deshalb, die eigenen Aufzeichnungen den Anforderungen der ISO 13485:2016 zuzuordnen, die die QMSR einbezieht, statt den alten Abschnittsnummern von Part 820, und die Zuordnung mit Regulatory Affairs abzustimmen. Das MES erzeugt typischerweise die Ist-Dokumentation je Charge oder Seriennummer: Bauteile, Arbeitsgänge, Prüfungen, Anlagen und Personal.

### Lebensmittel: Rückverfolgbarkeit nach FSMA 204

Die Food Traceability Rule der FDA (FSMA Section 204) verlangt in den USA Schlüsseldatenelemente für kritische Tracking-Ereignisse (Wareneingang, Verarbeitung, Versand), verknüpft mit einem Traceability Lot Code, und die Herausgabe der Aufzeichnungen an die FDA innerhalb von 24 Stunden nach Anforderung; die FDA wird die Regel nicht vor dem 20. Juli 2028 durchsetzen [29]. Verarbeitungsereignisse finden in der Produktion statt, daher sind das MES oder ein Rückverfolgbarkeitsmodul der natürliche Ort, um die Lot Codes zu erzeugen und Eingänge mit Ausgängen zu verknüpfen.

### Automobil und Luftfahrt

IATF 16949 und AS9100 ergänzen Anforderungen an Rückverfolgbarkeit, Produktionslenkungsplan und Erstmusterprüfung; kundenspezifische Anforderungen gehen oft weiter. In IATF 16949 ergänzt Abschnitt 8.5.2.1 die Anforderungen der ISO 9001 an Kennzeichnung und Rückverfolgbarkeit um dokumentierte Rückverfolgbarkeitspläne auf Basis "der Risikostufen oder der Fehlerschwere für Mitarbeiter, Kunden und Verbraucher" ("the levels of risk or failure severity for employees, customers, and consumers"), laut der Vergleichsmatrix einer Zertifizierungsstelle [39] (Sekundärquelle; die Norm ist kostenpflichtig). Beide Normen sind kostenpflichtig; der Leitfaden [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/) behandelt AS9100 und AS9102 ausführlich.

### Vorgehen bei der Validierung

Die finale Leitlinie der FDA *Computer Software Assurance for Production and Quality Management System Software* (CDRH und CBER, Februar 2026) beschreibt einen risikobasierten Ansatz, um Vertrauen in Produktions- und Qualitätssystemsoftware herzustellen und zu entscheiden, wo mehr Strenge nötig ist [40]. Sie richtet sich an Medizinproduktehersteller unter 21 CFR Part 820; Arzneimittelhersteller können sie zur Orientierung nutzen, nicht als eigene Vorschrift. In der Praxis: Jede MES-Funktion nach Risiko einstufen, Funktionen mit hohem Risiko (elektronische Unterschriften, Verriegelungen, Berechnungen, Genealogie) gründlich mit skriptbasierten Tests prüfen und für Konfigurationen mit geringem Risiko ungeskriptete oder vom Anbieter gelieferte Tests nutzen. Anbieter nach ihren Validierungsbeschleunigern und der Zertifizierung ihres eigenen Qualitätssystems fragen.

## Betriebsmodelle und Architektur

Der Markt hat sich von "eine große MES-Suite je Werk" zu einer breiteren Auswahl bewegt. Die Varianten unterscheiden sich darin, wo die Software läuft und wie sie aufgebaut ist.

### Wo es läuft: On-Premises, Cloud, hybrid

| Variante | Beschreibung | Vorteile | Nachteile |
|---|---|---|---|
| On-Premises | MES-Server im Werk oder im Rechenzentrum des Unternehmens | Läuft auch bei WAN-Ausfall; volle Kontrolle; vertraut für Validierungsteams | Hardware, Patches und Upgrades liegen beim Werk; Upgrades werden oft jahrelang verschoben |
| Cloud (SaaS) | Der Anbieter betreibt das MES in seiner Cloud; das Werk verbindet sich über Gateways | Schnellerer Start, Upgrades durch den Anbieter, Abo-Kosten | Abhängigkeit vom WAN; Latenz für Verriegelungen; Datenresidenz; der vorgegebene Upgrade-Takt muss zur Validierung passen |
| Hybrid / Edge plus Cloud | Zeitkritische Ausführung auf einem Edge-Knoten im Werk, Analytics und Verwaltung in der Cloud | Läuft bei Ausfällen weiter; Analytics skaliert | Zwei Umgebungen zu betreiben und abzusichern; Synchronisationslogik |

**Faustregel:** Alles, was einen falschen Schritt stoppen oder eine Linie am Laufen halten muss, muss auch ohne Internetverbindung funktionieren. Jeden Cloud-Anbieter das Offline-Verhalten vorführen lassen, nicht nur beschreiben.

### Wie es aufgebaut ist: Suite, Plattform, ERP-Modul

| Ansatz | Was man bekommt | Passt zu | Risiken |
|---|---|---|---|
| Branchen-MES-Suite | Breite, vorgefertigte Funktionalität für eine oder mehrere Branchen, oft mit regulatorischen Funktionen | Regulierte, komplexe Werke; Standardisierung über mehrere Standorte | Lange Projekte, viel Customizing, Herstellerbindung, hohe Lizenzkosten |
| Composable / App-Plattform ("Next-Generation-MES") | Eine Plattform mit Low-Code-Werkzeugen und Konnektoren; das Werk baut oder konfiguriert Apps für bestimmte Anwendungsfälle | Werke, die klein anfangen und ausbauen wollen; Fertigung mit hoher Variantenvielfalt; starke interne Teams | Viele kleine Apps ohne gemeinsames Datenmodell; Governance; Validierung von Apps, die Fachanwender selbst gebaut haben |
| ERP-integriertes MES | MES-Modul oder Begleitprodukt des ERP-Anbieters | ERP-zentrierte Unternehmen mit mäßiger Komplexität in der Fertigung | Bedienbarkeit am Shopfloor und Maschinenanbindung können hinter Spezialprodukten zurückbleiben |
| Eigenentwicklung | Eigene Software auf einer allgemeinen Plattform | Einzigartige Prozesse, starkes Softwareteam | Die Wartung bleibt für immer im eigenen Haus (Abschnitt 10) |

"Composable MES" ist eher ein Marketingbegriff von Anbietern und Analysten als eine genormte Kategorie. Die zugrunde liegende Idee, kleine Funktionen, die ein Datenmodell teilen und nach und nach ergänzt werden können, ist vernünftig und passt zur aktivitätsweisen Sicht von ISA-95. Das Risiko ist das Gegenteil des Monolithen: zwanzig Apps, die "Auftrag" und "Maschine" jeweils anders definieren. Die ISA-95-Anlagenhierarchie und die Objektmodelle sind das Gegenmittel.

### Vorlagen für mehrere Standorte

Für Unternehmen mit mehreren Werken lautet die Frage weniger "welches MES" als "wie viel Standardisierung". Ein verbreiteter Ansatz ist ein **globales Template** (Datenmodell, Kernprozesse, Schnittstellen, Kennzahlen) mit lokalen Erweiterungen. Das Template auf das beschränken, was standortübergreifend vergleichbar sein muss (Kennzahlendefinitionen nach ISO 22400, Genealogie, ERP-Schnittstelle); Standorte dürfen sich dort unterscheiden, wo sich ihre Prozesse unterscheiden.

## MES selbst entwickeln oder kaufen?

Die meisten Werke sollten kaufen (oder abonnieren) und konfigurieren. Eigenentwicklung lohnt sich in weniger Fällen, als Engineering-Teams gerne glauben, aber in mehr, als Anbieter zugeben.

### Entscheidungskriterien

| Kriterium | Spricht für Kauf | Spricht für Eigenentwicklung oder Aufbau auf einer Plattform |
|---|---|---|
| Einzigartigkeit der Prozesse | Prozesse ähneln der Branchenpraxis | Prozesse sind ein echtes Wettbewerbsmerkmal und ändern sich oft |
| Regulierung | Validierte, regulierte Umgebung (Part 11, GMP) | Nicht oder wenig reguliert |
| Interne Fähigkeiten | Kein Softwareteam, oder eines, das mit dem ERP voll ausgelastet ist | Erfahrenes Team, das Software 10 Jahre und länger pflegen kann |
| Umfang | Breit: Ausführung, Qualität, Genealogie, Feinplanung | Schmal: Datenerfassung und OEE, digitale Arbeitsanweisungen |
| Zeit | Ergebnisse werden in Monaten gebraucht | Eine längere Entwicklung ist möglich |
| Gesamtkosten über 10 Jahre | Lizenz plus Konfiguration ist günstiger als ein Team | Teamkosten sind bereits versunken und stabil |
| Abhängigkeit von Schlüsselpersonen | Inakzeptabel | Durch Dokumentation und Teamgröße abgefedert |

### Die versteckten Kosten der Eigenentwicklung

Ein selbst entwickeltes MES hat keine Lizenzgebühr, aber es kostet Anforderungen, Entwicklung, Tests, Dokumentation, Hosting, Sicherheitspatches, Upgrades der zugrunde liegenden Plattform, Support um 3 Uhr nachts und in regulierten Branchen die Validierung jeder Änderung. Der häufigste Fehlschlag ist nicht die erste Version, sondern das fünfte Jahr: Der ursprüngliche Entwickler ist gegangen, und das Werk läuft mit Software, die niemand mehr anzufassen wagt.

### Ein Mittelweg

Viele Werke kaufen eine Plattform oder ein MES für den Kern (Ausführung, Genealogie, ERP-Schnittstelle) und bauen darauf über deren APIs oder Low-Code-Werkzeuge eigene Apps oder Dashboards. Das funktioniert, wenn der gekaufte Kern das Datenmodell besitzt und die eigenen Teile nur daraus lesen oder dokumentierte APIs nutzen.

## Checkliste für die MES-Auswahl

Die folgende Tabelle ist eine Auswahl-Checkliste mit 30 Kriterien in acht Gruppen. Die Gruppen für die eigene Situation gewichten (die vorgeschlagenen Gewichte passen zu einem mittelgroßen, wenig regulierten Werk der diskreten Fertigung), jeden Anbieter je Kriterium mit 0 bis 4 bewerten und vor allem die Spalte **Prüfmethode** nutzen: Kein Kriterium sollte anhand von Präsentationsfolien bewertet werden.

| # | Gruppe (vorgeschlagenes Gewicht) | Kriterium | Prüfmethode |
|---|---|---|---|
| 1 | Funktionale Eignung (25 %) | Deckt die wichtigsten eigenen Anwendungsfälle aus der ISA-95-Aktivitätsmatrix ab | Drehbuch-Demo mit eigenen Produkten, Arbeitsplänen und einem echten Auftrag |
| 2 | Funktionale Eignung | Arbeitsanweisungen: visuell, versioniert, mit erzwungener Schrittfolge | Ein Werker erstellt während der Demo eine Anweisung und arbeitet sie ab |
| 3 | Funktionale Eignung | Genealogie auf der benötigten Ebene (Charge, Seriennummer, beides) | Vorwärts- und Rückwärtsverfolgung auf Demodaten innerhalb von 60 Sekunden |
| 4 | Funktionale Eignung | Qualität in der Ausführung: Prüfungen, SPC, Sperren, Abweichungen | Eine nicht bestandene Prüfung erzwingen und zeigen, was stoppt |
| 5 | Funktionale Eignung | Stillstände und OEE nach dem eigenen Zeitmodell | Eigene Grundcodes und Regeln für geplante Stopps konfigurieren |
| 6 | Funktionale Eignung | Tiefe von Feinplanung und Auftragsfreigabe (oder Integration mit APS) | Nach einem Maschinenausfall neu sequenzieren |
| 7 | Integration (15 %) | ERP-Konnektor für das eigene ERP und dessen Version | Referenzkunde mit demselben ERP; Schnittstellendokumentation prüfen |
| 8 | Integration | Maschinenanbindung: OPC UA, MTConnect, die eigenen SPS-Marken | Eine eigene Maschine im Proof of Concept anbinden |
| 9 | Integration | Offene APIs (REST, Events), dokumentiert und versioniert | Ein Entwickler liest die API-Dokumentation und baut eine kleine Abfrage |
| 10 | Integration | Unterstützung von ISA-95-Objekten oder B2MML | Die Zuordnung des Datenmodells zu ISA-95 anfordern |
| 11 | Integration | Veröffentlichung von Ereignissen an MQTT / UNS | Ereignisse in der Demo auf einem Broker zeigen |
| 12 | Daten und Architektur (10 %) | Das Datenmodell folgt der ISA-95-Anlagenhierarchie oder lässt sich ihr zuordnen | Die Konfiguration des Anlagenmodells prüfen |
| 13 | Daten und Architektur | Offline-Fähigkeit am Edge | Im Proof of Concept das WAN trennen |
| 14 | Daten und Architektur | Datenexport und Dateneigentum: alle Daten in offenen Formaten erhältlich | Vertragsklausel plus Testexport |
| 15 | Daten und Architektur | Fähigkeit zu Templates für mehrere Standorte | Referenz mit drei oder mehr Standorten |
| 16 | Bedienbarkeit (10 %) | Werkerbildschirme mit Handschuhen, auf Tablets und bei Lärm bedienbar | Zwei Werker testen 30 Minuten lang ohne Schulung |
| 17 | Bedienbarkeit | Konfiguration durch Schichtführer und Ingenieure ohne Code | Ein Ingenieur ändert einen Arbeitsplanschritt und eine Prüfung |
| 18 | Bedienbarkeit | Sprachen, die die Belegschaft liest | Bildschirme in jeder Sprache zeigen |
| 19 | Compliance und Sicherheit (10 %) | Part-11-Funktionen, falls nötig (Audit-Trail, elektronische Unterschrift) | Audit-Trail an einer geänderten Aufzeichnung vorführen |
| 20 | Compliance und Sicherheit | Sichere Entwicklung und Produktsicherheitszertifizierung (z. B. ISA/IEC 62443-4-1/4-2) | Zertifikate und die Richtlinie des Anbieters zur Offenlegung von Schwachstellen [23] |
| 21 | Compliance und Sicherheit | Identitätsintegration (SSO, MFA für Administratoren, Rollenmodell) | Rollen für Werker, Schichtführer und Qualität konfigurieren |
| 22 | Compliance und Sicherheit | Unterlagen zur Unterstützung der Validierung | Das Validierungspaket prüfen |
| 23 | Anbieter und Partner (10 %) | Finanzielle Stabilität und Eigentümerstruktur | Jahresberichte oder Bonitätsprüfung; Eigentümerwechsel in den letzten fünf Jahren |
| 24 | Anbieter und Partner | Implementierungspartner mit Referenzen in der eigenen Branche und Region | Zwei Referenzen ohne Anwesenheit des Anbieters anrufen |
| 25 | Anbieter und Partner | Produkt-Roadmap und Release-Takt | Roadmap unter NDA; wie oft machen Kunden tatsächlich Upgrades? |
| 26 | Anbieter und Partner | Supportmodell und Supportzeiten | SLA-Text; wer antwortet samstags um 2 Uhr nachts? |
| 27 | Kosten (15 %) | Gesamtbetriebskosten (TCO) über fünf Jahre | Das eigene TCO-Modell (Abschnitt 13), gefüllt mit Angeboten der Anbieter |
| 28 | Kosten | Lizenzmodell passt zum Wachstum (je Standort, Nutzer, Maschine, Verbrauch) | Das Ausbauszenario für drei Jahre schon jetzt bepreisen |
| 29 | Kosten | Kosten für Upgrades und Anpassungen | Fragen, was ein Upgrade einen Referenzkunden gekostet hat |
| 30 | Ausstieg (5 %) | Exit-Plan: Daten, Konfigurationen, Dokumentation bei Vertragsende | Vertragsklausel; fragen, wie ein früherer Kunde migriert ist |

**Bewertung:** gewichtete Punktzahl = Summe über die Gruppen von (Gruppengewicht × durchschnittliche Kriterienpunktzahl ÷ 4). Ein Anbieter mit 78 Prozent schlägt einen mit 72 Prozent nur, wenn keiner ein K.-o.-Kriterium hat: Jedes mit 0 bewertete Kriterium in funktionaler Eignung, Offline-Fähigkeit (falls gefordert) oder Compliance sollte den Anbieter unabhängig von der Gesamtpunktzahl ausschließen.

**Tipps für den Prozess:**

- Die Ausschreibung um Anwendungsfälle und die Aktivitätsmatrix herum schreiben, nicht als 600-zeilige Funktionsliste. Funktionslisten bekommen zu jeder Zeile ein "Ja".
- Vor der endgültigen Entscheidung auf einem bezahlten Proof of Concept auf einer Linie mit eigenen Daten bestehen. Zwei bis sechs Wochen sind eine typische Spanne [unbelegt: Schätzung aus der Praxis].
- Werker und Schichtführer die Bedienbarkeit bewerten lassen, das Controlling die Kosten; die Bewertungen bis zum Schluss getrennt halten.
- Als herstellerneutraler Ausgangspunkt sind Analystenbewertungen (Gartner Peer Insights führt den MES-Markt [8]) und Referenzen aus vergleichbaren Werken nützlicher als Anbieter-Rankings, die Anbieter selbst veröffentlichen.

## Fahrplan für die MES-Einführung

Der folgende Fahrplan gilt für ein einzelnes mittelgroßes Werk. Die Dauern sind Planungsannahmen für ein konfiguriertes Produkt, keine Benchmarks; regulierte Werke und Eigenentwicklungen dauern länger [unbelegt: Schätzungen aus der Praxis].

| Phase | Dauer (typische Annahme) | Hauptaktivitäten | Abschlusskriterien |
|---|---|---|---|
| 0. Business Case und Umfang | 4 bis 8 Wochen | Problembeschreibung, Begehung des Wertstroms, ISA-95-Aktivitätsmatrix im Ist-Zustand, Basiskennzahlen, Entwurf des Business Case | Sponsor, Budgetrahmen und ein Pilot-Wertstrom freigegeben |
| 1. Anforderungen und Auswahl | 8 bis 16 Wochen | Anwendungsfälle, Datenmodell (Anlagenhierarchie, Verantwortung für Stammdaten), Ausschreibung, Drehbuch-Demos, Proof of Concept | Anbieter und Partner ausgewählt, Vertrag mit Exit- und Datenklauseln |
| 2. Design | 6 bis 10 Wochen | Lösungsdesign, Schnittstellenspezifikationen, Zeitmodell und Grundcodes, Standards für Arbeitsanweisungen, Validierungsplan (falls reguliert), Sicherheitsdesign | Unterschriebenes Design, Testplan |
| 3. Pilotaufbau und Test | 10 bis 20 Wochen | Konfiguration, Maschinenanbindung, ERP-Schnittstelle, Datenmigration, Testzyklen, Werkerschulung | Abnahme durch die Anwender auf der Pilotlinie |
| 4. Go-live des Piloten und Stabilisierung | 6 bis 12 Wochen | Go-live mit Hypercare, tägliche Durchsicht offener Punkte, Kennzahlenvergleich mit der Basis | Kennzahlen 4 Wochen in Folge stabil; offene Fehler unter der vereinbarten Schwelle |
| 5. Rollout | 3 bis 6 Monate je Welle | Weitere Linien und Bereiche; Template verfeinert | Alle Bereiche im Umfang live |
| 6. Kontinuierliche Verbesserung | Laufend | Neue Anwendungsfälle, Upgrades, kennzahlengetriebene Verbesserung (KVP) | Liegt in der Verantwortung des Werks, nicht des Projekts |

### Phase 0 im Detail: mit dem Wertstrom beginnen

Zuerst den Wertstrom abgehen. Festhalten, wo Informationen verzögert, abgetippt oder fehlen und wo Qualitätsdurchschlupf oder lange Durchlaufzeiten entstehen. Der Leitfaden zur [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/) zeigt das Vorgehen; eine Ist-Wertstromkarte mit eingezeichnetem Informationsfluss ist das beste MES-Lastenheft, das sich in einer Woche erstellen lässt. Einen Piloten wählen, der wichtig genug ist, um zu zählen, und abgegrenzt genug, um fertig zu werden: eine Linie oder eine Produktfamilie mit einem klaren Schmerzpunkt.

### Phase 1 im Detail: das Datenmodell vor der Software

Die Anlagenhierarchie festlegen (Abschnitt 4), den Verantwortlichen für die Stammdaten jedes Objekts (Material, Arbeitsplan, Anlage, Personal), das Zeitmodell für die OEE (was ist geplante Produktionszeit) und das Statusmodell für Aufträge und Arbeitsgänge. Wenn sich ERP, Qualität und Instandhaltung darauf nicht vor der Auswahl einigen können, löst das auch kein Anbieter.

### Go-live-Checkliste

| Prüfpunkt | Erledigt |
|---|---|
| Stammdaten der Pilotprodukte in der Fertigung geprüft (Arbeitsplanschritte, Stückliste, Anweisungen) | ☐ |
| Jeder Werker an seinem eigenen Arbeitsplatz mit echten Aufträgen geschult, nicht nur im Schulungsraum | ☐ |
| Rückfallverfahren (Papier-Laufkarte) für einen MES-Ausfall gedruckt und getestet | ☐ |
| ERP-Schnittstelle mit Fehlerfällen getestet (ERP nicht erreichbar, doppelte Nachricht, falsche Menge) | ☐ |
| Grundcodes und Prüfungen mit Werkern durchgesprochen | ☐ |
| Hypercare-Dienstplan für die ersten zwei Wochen, alle Schichten | ☐ |
| Basiskennzahlen für den Vergleich eingefroren | ☐ |
| Sicherheit: Konten, Rollen, MFA für Administratoren, Backups getestet | ☐ |
| Reguliert: Validierungsabschlussbericht vor Produktionsnutzung freigegeben | ☐ |

### Rollen

| Rolle | Verantwortung |
|---|---|
| Sponsor aus der Geschäftsleitung (Werksleiter oder Leiter Operations) | Entscheidet Konflikte zum Umfang, schützt die Ressourcen |
| Product Owner aus der Produktion | Verantwortet Anwendungsfälle und Prioritäten, zeichnet die Abnahme |
| MES-Leitung / Lösungsarchitekt | Design, Datenmodell, Integration |
| IT/OT-Ingenieur | Infrastruktur, Netzwerke, Maschinenanbindung, Sicherheit |
| Qualität und Regulatory | Prüfungen, Aufzeichnungen, Validierung |
| Key User je Bereich und Schicht | Testen, Kollegen schulen, Rückmeldung geben |
| Partner aus dem Controlling | Business Case, Nutzenverfolgung |
| Anbieter / Integrator | Konfiguration, Produktwissen |

## MES-Kosten und ROI mit Rechenbeispiel

"Was kostet ein MES?" hat keine ehrliche Einzelzahl. Die Preise hängen von Umfang, Zahl der Linien und Nutzer, Betriebsmodell, Regulierung und Integrationsaufwand ab, und Anbieter veröffentlichen sie selten. Einige Wettbewerbsseiten nennen Spannen ohne Quelle; wir wiederholen sie nicht. Stattdessen folgt hier eine Struktur für die eigenen Gesamtbetriebskosten und ein Rechenbeispiel mit **beispielhaften Annahmen**, die durch eigene Angebote und Basiswerte zu ersetzen sind.

### Kostenstruktur

| Kostenblock | Einmalig | Laufend | Hinweise |
|---|---|---|---|
| Software | Kauflizenz (falls vorhanden) | Abo oder Wartung (oft ein Prozentsatz der Lizenz pro Jahr) | Die Bemessungsgrundlage prüfen: Standort, Nutzer, Maschine, Verbrauch |
| Implementierungsleistungen | Konfiguration, Schnittstellen, Datenmigration, Projektleitung | Änderungsanforderungen | Meist der größte einmalige Block |
| Hardware und Netzwerk | Terminals, Tablets, Scanner, Etikettendrucker, Edge-Server, WLAN, Verkabelung | Ersatzzyklus | In älteren Werken oft unterschätzt |
| Maschinenanbindung | Gateways, SPS-Programmierung, Nachrüstung alter Maschinen | Wartung | Preis je Maschinentyp, nicht je Maschine |
| Internes Team | Projektteam, Key User, Vertretung für deren normale Aufgaben | MES-Support, Administration, kontinuierliche Verbesserung | Vollkosten ansetzen |
| Schulung | Schulungskonzept und Schulungen | Neue Mitarbeiter, Auffrischungen | |
| Validierung (reguliert) | Validierungsplan, Protokolle, Durchführung | Revalidierung nach Änderungen und Upgrades | |
| Hosting und Betrieb | Einrichtung | Cloud-Gebühren oder Serverbetrieb, Backups, Sicherheitsüberwachung | |

**Capex vs. Opex:** Ein MES im Abo ist in der Regel Opex; Kauflizenzen, Hardware und ein Teil der Implementierungskosten können je nach Bilanzierungsrichtlinie aktiviert werden. Nach US-GAAP regelt ASC 350-40 Software für den Eigengebrauch (US-Kontext). Seit ASU 2018-15 (August 2018) folgen die Implementierungskosten einer Cloud-Vereinbarung, die ein Dienstleistungsvertrag ist, denselben Aktivierungsstufen; die aktivierten Kosten werden aber wie vorausbezahlte Hosting-Gebühren ausgewiesen, über die Laufzeit des Hostings abgeschrieben und in derselben Zeile der Gewinn- und Verlustrechnung gezeigt wie die Gebühr [41]. ASU 2025-06 (September 2025) ändert ASC 350-40 erneut, wirksam für Geschäftsjahre, die nach dem 15. Dezember 2027 beginnen, mit zulässiger vorzeitiger Anwendung [42]. Die Behandlung mit dem Abschlussprüfer abstimmen. Die Bilanzierungsentscheidung ändert das EBITDA und den zeitlichen Anfall der Kosten, nicht die Wirtschaftlichkeit.

### Nutzenstruktur

| Nutzenposition | Formel | Datenquelle |
|---|---|---|
| Zusätzlicher Durchsatz am Engpass | Zusätzliche produktive Stunden × Deckungsbeitrag je Stunde | MES oder manuelles Stillstandsprotokoll, Controlling (nur wenn Nachfrage besteht) |
| Weniger Ausschuss und Nacharbeit | Jährliche Kosten für Ausschuss und Nacharbeit × erwartete Senkung | Qualitätskostenberichte |
| Personalzeit für Papierkram und Dateneingabe | Eingesparte Stunden × Vollkostensatz × Anteil, der tatsächlich anders eingesetzt wird | Zeitstudie, Interviews |
| Weniger WIP und Bestand | Einmalige Liquiditätsfreisetzung; Kapitalbindungskosten × Senkung pro Jahr | Bestandsbewertung |
| Schnellere Chargen- oder Auftragsfreigabe | Verkürzung der Durchlaufzeit × Wert (Bestand, Liefertreue) | Prüfzeiten der QA, Auftragsdaten |
| Vermiedene Compliance- und Rückrufkosten | Wahrscheinlichkeit × Auswirkung, meist nicht im Basisfall | Risikoregister |

### Rechenbeispiel: ein Ventilwerk mit 220 Beschäftigten

**Ausgangslage (alle Zahlen beispielhaft):** vier Linien, zwei Schichten, Umsatz 85 Mio. USD. Linie 2 ist der Engpass. Papier-Laufkarten, ERP-Rückmeldungen zum Schichtende, keine automatische Stillstandserfassung.

**Einmalige Kosten (Jahr 0):**

| Position | Betrag |
|---|---|
| Implementierungsleistungen | 450.000 USD |
| Hardware, Netzwerk, Maschinenanbindung | 160.000 USD |
| Internes Projektteam (2,5 VZÄ für 12 Monate zu 120.000 USD Vollkosten) | 300.000 USD |
| Schulung und Vertretung | 60.000 USD |
| **Summe einmalig** | **970.000 USD** |

**Laufende Kosten (ab Jahr 1):** Abo 180.000 USD + interner MES-Support 1 VZÄ 120.000 USD = **300.000 USD pro Jahr**.

**Nutzen bei voller Wirkung (Basisfall):**

| Nutzen | Rechnung | Pro Jahr |
|---|---|---|
| OEE auf Linie 2 von 62 % auf 67 % | 4.000 geplante Stunden × 5 Punkte = 200 zusätzliche produktive Stunden × 2.000 USD Deckungsbeitrag je Stunde | 400.000 USD |
| Weniger Ausschuss | 1,2 Mio. USD Ausschusskosten × 15 % | 180.000 USD |
| Zeit für Papierkram | 4.000 Stunden × 45 USD Vollkosten × 50 % anders eingesetzt | 90.000 USD |
| Kapitalbindungskosten WIP | 3,0 Mio. USD WIP × 10 % Senkung × 20 % Kapitalbindungskostensatz | 60.000 USD |
| **Jährlicher Gesamtnutzen** | | **730.000 USD** |

Dazu eine einmalige Liquiditätsfreisetzung aus dem WIP: 3,0 Mio. USD × 10 % = 300.000 USD (angenommen in Jahr 2).

**Hochlauf:** Jahr 1 bringt 40 Prozent des Jahresnutzens (Pilot und Rollout), die Jahre 2 bis 5 bringen 100 Prozent.

**Zahlungsströme (in Tausend USD), Kalkulationszins 10 %:**

| Jahr | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Basisfall | −970 | 730 × 0,4 − 300 = −8 | 730 − 300 + 300 = 730 | 430 | 430 | 430 |
| Kumuliert | −970 | −978 | −248 | 182 | 612 | 1.042 |

Kapitalwert (NPV) bei 10 % = −970 − 8/1,1 + 730/1,1² + 430/1,1³ + 430/1,1⁴ + 430/1,1⁵ ≈ **+510.000 USD**. Einfache Amortisation: Der kumulierte Zahlungsstrom wird im Jahr 3 positiv, etwa 2,6 Jahre nach Projektstart (248 ÷ 430 = 0,58 von Jahr 3).

**Vorsichtiger Fall:** Der OEE-Gewinn ist nur halb so groß (oder die Mehrmenge lässt sich nicht vollständig verkaufen): 200.000 USD statt 400.000 USD; Ausschusssenkung 10 Prozent (120.000 USD) statt 15 Prozent. Jahresnutzen 470.000 USD, netto 170.000 USD pro Jahr.

| Jahr | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Vorsichtiger Fall | −970 | 470 × 0,4 − 300 = −112 | 470 − 300 + 300 = 470 | 170 | 170 | 170 |
| Kumuliert | −970 | −1.082 | −612 | −442 | −272 | −102 |

Kapitalwert bei 10 % ≈ **−334.000 USD**; keine Amortisation innerhalb von fünf Jahren.

**Sensitivität:** Bleiben Ausschuss-, Papierkram- und WIP-Nutzen auf dem Niveau des Basisfalls, erreicht das Projekt den Break-even (Kapitalwert = 0 bei 10 %) mit einem Durchsatznutzen von etwa 243.000 USD pro Jahr, also etwa 121 zusätzlichen produktiven Stunden oder rund 3 OEE-Punkten auf Linie 2 statt 5. Kommt nur die Hälfte des OEE-Gewinns zustande und bleibt alles andere gleich, liegt der Kapitalwert bei etwa −139.000 USD. Die Empfindlichkeit gegenüber dieser einen Annahme ist die eigentliche Erkenntnis.

**Was das Beispiel lehrt:**

1. **Eine Position dominiert.** Der Durchsatznutzen ist mehr als die Hälfte des Basisfalls. Bevor er gezählt wird, mit dem Vertrieb bestätigen, dass das Werk auf dieser Linie kapazitätsbeschränkt ist, oder mit dem Leitfaden zur [Theory of Constraints](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant) zuerst den echten Engpass finden.
2. **Laufende Kosten zählen mehr, als die Lizenzzeile vermuten lässt.** Der interne Support macht hier 40 Prozent der laufenden Kosten aus und wird oft vergessen.
3. **Der Hochlauf drückt den Kapitalwert.** Ein Pilot, der sich 18 statt 12 Monate hinzieht, schiebt den vorsichtigen Fall weiter ins Minus. Die Zeit bis zur ersten stabilen Linie ist eine finanzielle Größe.
4. **Nicht bezifferte Nutzen sind real, aber getrennt zu zeigen.** Engere Rückrufe, Audit-Bereitschaft und Kundenanforderungen können ein MES in regulierten oder OEM-getriebenen Lieferketten allein rechtfertigen. Sie neben den Zahlen zeigen, nicht darin.
5. **Den Nutzen nach dem Go-live verfolgen,** gegen die eingefrorene Basis, gemeinsam mit dem Controlling, mindestens zwei Jahre lang.

Die Definitionen von Kennzahlen und Kosten hinter diesen Positionen stehen im Leitfaden zu [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/).

## MES-Kennzahlen: was gemessen wird und wie

Ein MES liefert die Daten für die meisten Shopfloor-Kennzahlen. Zwei Gruppen zählen: die operativen Kennzahlen, die das MES berechnet, und die Kennzahlen, die zeigen, ob das MES selbst funktioniert.

### Standarddefinitionen: ISO 22400

ISO 22400-2:2014 definiert Kennzahlen (Key Performance Indicators) für das Manufacturing Operations Management, jeweils mit Formel, Einheit, Zeitbezug und Nutzergruppe [16]; Sekundärquellen zählen 34 Kennzahlen in der Norm [18], und eine Ergänzung von 2017 fügte Kennzahlen für das Energiemanagement hinzu [16]. Wer diese Definitionen nutzt, macht Kennzahlen über Linien und Werke vergleichbar. Forscher des NIST haben eine hierarchische Struktur dieser Kennzahlen mit Formeln veröffentlicht, die frei verfügbar ist [17].

### Operative Kennzahlen aus dem MES

| Kennzahl | Formel (vereinfacht) | Typische Verwendung |
|---|---|---|
| OEE | Verfügbarkeit × Leistung × Qualität | Engpass und Schlüsselanlagen |
| Verfügbarkeit | Laufzeit ÷ geplante Produktionszeit | Fokus auf Stillstände |
| Leistung | (Ideale Zykluszeit × Gesamtmenge) ÷ Laufzeit | Geschwindigkeitsverluste, Kurzstillstände |
| Qualität (Rate) | Gutmenge ÷ Gesamtmenge | Ausschuss und Nacharbeit |
| First Pass Yield | Einheiten ohne Nacharbeit ÷ gestartete Einheiten | Prozessfähigkeit |
| Ausschussquote | Ausschussmenge ÷ produzierte Menge | Materialverlust |
| Plantreue | Wie geplant abgeschlossene Aufträge (oder Mengen) ÷ geplante | Planstabilität |
| Durchsatz | Gutteile je Stunde | Kapazität |
| WIP | Einheiten oder Wert zwischen erstem und letztem Arbeitsgang | Fluss |
| Auftragsdurchlaufzeit | Fertigstellungszeitpunkt − Freigabezeitpunkt | Reaktionsfähigkeit gegenüber Kunden |
| MTBF / MTTR | Betriebszeit ÷ Ausfälle; Reparaturzeit ÷ Ausfälle | Instandhaltung |

**OEE-Rechenbeispiel (eine Schicht auf Linie 2):** geplante Produktionszeit 450 Minuten, ungeplante Stillstände 60 Minuten, also Laufzeit 390 Minuten. Ideale Zykluszeit 1,0 Minute, Gesamtmenge 340, Gutmenge 323.

- Verfügbarkeit = 390 ÷ 450 = 86,7 %
- Leistung = (1,0 × 340) ÷ 390 = 87,2 %
- Qualität = 323 ÷ 340 = 95,0 %
- OEE = 0,867 × 0,872 × 0,950 = **71,8 %**

Gegenprobe: Gutmenge × ideale Zykluszeit ÷ geplante Produktionszeit = 323 ÷ 450 = 71,8 %. Besteht das MES diese Probe nicht, ist sein Zeitmodell inkonsistent. Muchiri und Pintelon geben einen Überblick über die gebräuchlichen OEE-Definitionen und ihre Fallstricke [30]; der Leitfaden [TPM und OEE](https://www.m365.fm/learn/tpm-oee/) (geplant) geht tiefer.

### Kennzahlen für das MES selbst

| Kennzahl | Definition | Zielrichtung |
|---|---|---|
| Datenverzug | Zeit vom Ereignis in der Fertigung bis zur Verfügbarkeit in MES / ERP | Sinkend (Minuten, nicht Tage) |
| Automatische Erfassungsquote | Anteil der Mengen und Zustände, die von Maschinen erfasst statt eingetippt werden | Steigend |
| Manuelle Korrekturquote | Korrekturen je 100 Aufträge | Sinkend |
| Abdeckung mit Grundcodes | Anteil der Stillstandsminuten mit gültigem Grund | Steigend (über 90 % ist ein übliches Ziel) |
| Rückverfolgungszeit | Minuten bis zur vollständigen Rückwärtsverfolgung einer Seriennummer oder Charge | Sinkend |
| Nutzung (Adoption) | Anteil der Aufträge, die vollständig im MES laufen (keine Umgehung über Papier außer dem dokumentierten Rückfallverfahren bei Ausfällen) | Steigend (Zielzustand 100 %; dauerhafte Umgehungen deuten auf ein Designproblem hin, nicht auf ein Werkerproblem) |
| Schnittstellenfehlerquote | Fehlgeschlagene oder abgewiesene Buchungen je Tag | Sinkend |
| Verfügbarkeit des MES | Betriebszeit während der Produktionsstunden | Steigend |

## Mitarbeiter und Shopfloor

Ein MES verändert, wie Werker in jeder Minute der Schicht arbeiten. Werke, die es als IT-Projekt behandeln, bekommen meist Umgehungslösungen; Werke, die es als Veränderung der Arbeit behandeln, bekommen Akzeptanz.

**Was Werker gewinnen:** aktuelle Anweisungen am Arbeitsplatz statt eines Ordners, weniger Formulare, schnellere Hilfe, wenn etwas schiefgeht (Andon-Ruf vom Terminal; siehe den Vertiefungsartikel zum [Andon-System](https://www.m365.fm/learn/shop-floor-management/andon/), geplant), und weniger Schuldzuweisung, wenn das System zeigt, dass ein Stopp vorgelagert verursacht wurde.

**Was Werker befürchten, oft mit Grund:** minutengenau überwacht zu werden, von einem fehlerhaften System blockiert zu werden und das eigene Urteil an einen Bildschirm zu verlieren. Jeder Punkt sollte direkt angegangen werden:

- **Überwachung:** Festlegen und bekannt machen, welche Personaldaten das MES erfasst, wer sie sieht und wofür sie verwendet werden. Leistungsdaten zur Verbesserung des Prozesses nutzen, nicht für Ranglisten von Einzelpersonen. In den USA kann in gewerkschaftlich organisierten Werken die Einführung elektronischer Überwachung und die Änderung von Arbeitsregeln ein Pflichtgegenstand von Tarifverhandlungen sein; die Gewerkschaft früh einbinden und arbeitsrechtlichen Rat einholen [unbelegt: die rechtliche Bewertung hängt vom Tarifvertrag und der aktuellen Spruchpraxis des NLRB ab].
- **Von einem fehlerhaften System blockiert werden:** Werkern einen schnellen, sichtbaren Weg geben, eine falsche Anweisung oder eine falsche Sperre zu melden, und diese Meldungen innerhalb weniger Tage beheben. Jede unerledigte Meldung lehrt die Fertigung, eine Umgehung zu suchen.
- **Urteilsvermögen:** Harte Sperren nur für sicherheits- und qualitätskritische Schritte. Für den Rest warnen und aufzeichnen.

**Werker in das Design einbeziehen.** Zwei oder drei Werker je Bereich in den Design-Workshops, Werker, die Bildschirme vor dem Go-live testen, und Werker als Multiplikatoren für Kollegen sind günstig und wirksam. Respekt vor den Menschen ist eine Designvorgabe, keine Folie im Change Management; siehe [Lean Management](https://www.m365.fm/learn/lean-management/) für das Prinzip.

**Ergonomie und Sicherheit an Terminals:** Terminals dort aufstellen, wo die Arbeit stattfindet, in Stehhöhe, lesbar bei der Beleuchtung im Werk und mit Handschuhen bedienbar. Scanner sollten keine zusätzlichen Wege verursachen. Ein MES, das bei einem Takt von 60 Sekunden 30 Sekunden je Arbeitsgang hinzufügt, ist schon vor dem Go-live gescheitert.

## Typische Fehler bei der MES-Einführung

| # | Fehler | Was passiert | Besser |
|---|---|---|---|
| 1 | Funktionen kaufen, bevor das Datenmodell definiert ist | Schnittstellen brechen an nicht passenden Kennungen, Kennzahlen unterscheiden sich je System | Zuerst Anlagenhierarchie, Stammdatenverantwortliche und Zeitmodell |
| 2 | Den heutigen Papierprozess eins zu eins digitalisieren | Dieselbe Verschwendung, jetzt auf dem Bildschirm | Den Prozess zuerst bei der Wertstrombegehung vereinfachen |
| 3 | Umfang "alles aus der MESA-11-Liste" | Mehrjähriges Projekt, nichts live | Ein Wertstrom, drei bis fünf Anwendungsfälle, live in Monaten |
| 4 | Anpassen (Customizing) statt Konfigurieren | Upgrades werden zu Projekten; der Herstellersupport lehnt ab | Standardprozesse akzeptieren, wo sie kein Unterscheidungsmerkmal sind |
| 5 | Keine Beteiligung der Werker | Umgehungen, Schattensysteme auf Papier | Werker in Design, Test und Schulung |
| 6 | ERP und MES führen beide dieselben Daten | Widersprüchliche Mengen und Zeiten | Ein führendes System je Attribut, dokumentiert |
| 7 | Harte Sperren überall | Linien stoppen aus trivialen Gründen; das Vertrauen bricht ein | Harte Sperren nur, wo Sicherheit oder Qualität es verlangen |
| 8 | Netzwerk und Terminals vernachlässigen | Langsame Bildschirme, verlorene Scans | Standortbegehung und Netzwerkausbau in Phase 2 |
| 9 | Kein Rückfallverfahren für Ausfälle | Die Produktion steht, wenn MES oder WAN ausfallen | Getestetes Papier-Rückfallverfahren und Offline-Fähigkeit am Edge |
| 10 | Schwaches Sicherheitsdesign | Flaches Netzwerk zwischen Büro und Maschinen | Zonen und Conduits nach ISA/IEC 62443; minimale Rechte (Least Privilege) [23][24] |
| 11 | Kein Verantwortlicher nach dem Go-live | Das MES verfällt; die Datenqualität sinkt | MES-Team in der Verantwortung des Werks und eine Kennzahl für die Nutzung |
| 12 | Der Nutzen wird nie gemessen | Der Business Case des nächsten Standorts hat keine Belege | Eingefrorene Basis, das Controlling verfolgt den Nutzen zwei Jahre lang |
| 13 | Unterschätzte Validierung (reguliert) | Verzögerungen um Monate | Risikobasierte Validierung ab Phase 1 geplant |
| 14 | UNS oder Datenplattform als MES behandeln | Daten überall, keine Durchsetzung, keine Aufzeichnungen | MES für Ausführung und Aufzeichnungen; UNS für die Verteilung |

## Grenzen von MES und ISA-95

Ehrlichkeit über die Grenzen hilft bei der Entscheidung, was man nicht kaufen sollte.

### Grenzen des MES

1. **Ein MES repariert keinen kaputten Prozess.** Sind Arbeitspläne falsch, fehlt Material oder läuft das Werk ohne Standardarbeit, macht das MES diese Probleme schneller sichtbar. Das ist nützlich, aber nicht die Lösung. Zuerst die Lean-Grundlagen; siehe [Lean Management](https://www.m365.fm/learn/lean-management/) und [5S-Methode und visuelles Management](https://www.m365.fm/learn/5s-methode-visuelles-management/) (geplant).
2. **Die Datenqualität hängt von Menschen ab.** Manuelle Eingaben, Scans und Grundcodes sind nur so gut wie die Disziplin und die Gestaltung der Bildschirme.
3. **Starre Systeme widersetzen sich Veränderungen.** Ein stark angepasstes MES kann Produkteinführungen und Prozessänderungen verlangsamen, das Gegenteil dessen, was Werke mit hoher Variantenvielfalt brauchen.
4. **Kosten und Aufwand sind für kleine Werke hoch.** Für einen Lohnfertiger mit 30 Beschäftigten können die Fertigungsfunktionen des ERP, ein einfaches Werkzeug zur Datenerfassung und gutes visuelles Management den größten Teil des Nutzens bringen.
5. **Planung ist keine Ausführung.** Ein MES mit Feinplanungsmodul ersetzt weder Sales and Operations Planning noch MRP; siehe [S&OP, MRP und Produktionsplanung](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) (geplant).
6. **Analytics gehört im großen Maßstab woandershin.** Werksübergreifende Analytics, KI und Langzeithistorie gehören meist in eine Datenplattform, die vom MES gespeist wird, nicht in das MES selbst. Der Leitfaden zum [Digital Twin](https://www.m365.fm/learn/digital-twin/) und der Vertiefungsartikel zu [Process Mining in der Produktion](https://www.m365.fm/learn/digital-twin/process-mining-produktion/) (geplant) zeigen, was die MES-Daten speisen können.

### Grenzen von ISA-95

1. **Die Norm ist abstrakt.** ISA-95 ist bewusst technologieunabhängig [1]. Sie sagt, was benannt und ausgetauscht wird, nicht, wie es gebaut wird. Deshalb können zwei "ISA-95-konforme" Produkte trotzdem schwer zu integrieren sein.
2. **Das Ebenenmodell ist kein Datenpfad.** Wörtlich gelesen legt die Hierarchie nahe, dass Daten Ebene für Ebene über Punkt-zu-Punkt-Schnittstellen wandern. Moderne Architekturen (UNS, Event-Streaming, Cloud) funktionieren nicht so; die ISA selbst betont die Ebenen heute als Grenzen, nicht als Rohrleitungen [1][2].
3. **Die Normtexte sind kostenpflichtig und lang.** Viele Teams arbeiten mit Sekundärzusammenfassungen, was zu uneinheitlichen Auslegungen führt. Für die Projektbibliothek mindestens die Teile 1 und 3 kaufen.
4. **Konformität wird nicht zertifiziert.** Es gibt keine formale ISA-95-Zertifizierung für Produkte, so wie es für ISA/IEC 62443 Zertifizierungsprogramme für Produktsicherheit gibt [unbelegt: kein ISA-95-Zertifizierungsprogramm für Produkte gefunden]. "ISA-95-konform" in einer Broschüre ist eine Herstellerangabe.
5. **Grenzen werden in der Praxis unterschiedlich gezogen.** Feinplanung, Qualität und Instandhaltung liegen in jedem Werk in anderen Systemen; das Aktivitätsmodell lässt das zu, nimmt aber die Entscheidung nicht ab.

## Glossar

| Begriff | Bedeutung |
|---|---|
| Aktivitätsmodell (Activity Model) | Modell der Aktivitäten auf Ebene 3 aus ISA-95 Teil 3: vier Prozesskategorien mit je acht generischen Aktivitäten [3] |
| Anlagenhierarchie (Equipment Hierarchy) | Rollenbasierte ISA-95-Struktur: Unternehmen, Standort, Bereich, Arbeitsbereich, Arbeitseinheit |
| APS | Advanced Planning and Scheduling; Software für kapazitätsgenaue Feinplanung |
| Arbeitsbereich / Arbeitseinheit (Work Center / Work Unit) | Ebenen der ISA-95-Anlagenhierarchie unterhalb des Bereichs |
| Auftragsfreigabe (Dispatching) | Freigabe des nächsten Auftrags an eine Ressource [3] |
| B2MML | Business To Manufacturing Markup Language; XML-Umsetzung der ISA-95-Objekte, entwickelt von der MESA [5] |
| Chargenprotokoll (eBR) | Aufzeichnung von Herstellung und Prüfung einer Charge; elektronisches Chargenprotokoll (Electronic Batch Record), wenn im MES geführt |
| CMMS / EAM | Computergestütztes Instandhaltungsmanagementsystem / Enterprise Asset Management |
| Composable MES | Anbieterbegriff für ein MES, das aus kleineren Apps auf einer gemeinsamen Plattform besteht |
| Device History Record (DHR) | Begriff aus der Medizintechnik für die Fertigungsaufzeichnung eines Produkts oder einer Charge; siehe QMSR [20] |
| ERP | Enterprise Resource Planning; Geschäftssystem auf ISA-95-Ebene 4 |
| Feinplanung (Detailed Scheduling) | ISA-95-Aktivität, die Arbeit innerhalb von Ebene 3 auf Ressourcen in eine Reihenfolge bringt [3] |
| Genealogie | Verknüpfung zwischen Einsatzmaterialien und Ausgangseinheiten (Vorwärts- und Rückwärtsverfolgung) |
| Historian | Zeitreihendatenbank für Prozesswerte |
| IEC 62264 | Internationale Veröffentlichung von ISA-95 [1][7] |
| Ist-Dokumentation (As-built Record) | Aufzeichnung, wie eine bestimmte Einheit oder Charge tatsächlich gefertigt wurde |
| ISA-88 | Norm für Chargensteuerung, genutzt für Rezeptstrukturen |
| ISA-95 | ANSI/ISA-95, Enterprise-Control System Integration, acht Teile [1] |
| ISA/IEC 62443 | Normenreihe zur Sicherheit industrieller Automatisierungs- und Steuerungssysteme [23] |
| ISO 22400 | Norm für Kennzahlen im Manufacturing Operations Management [16] |
| LIMS | Labor-Informationsmanagementsystem |
| MES | Manufacturing Execution System; produktionsorientierte Software der Ebene 3 zum Ausführen und Dokumentieren der Produktion [8] |
| MESA-11 | Modell der MESA International von 1997 mit 11 MES-Funktionen [9][12] |
| MOM | Manufacturing Operations Management; ISA-95-Ebene 3 als Ganzes |
| MQTT | Schlankes Publish/Subscribe-Nachrichtenprotokoll, im IIoT verbreitet |
| MTConnect | Offener Standard für Daten von Fertigungseinrichtungen (ANSI/MTC1.4-2018) [22] |
| OEE | Overall Equipment Effectiveness (Gesamtanlageneffektivität) = Verfügbarkeit × Leistung × Qualität |
| OPC UA | Herstellerneutraler Standard der OPC Foundation für industrielle Kommunikation und Informationsmodellierung |
| Part 11 | 21 CFR Part 11, FDA-Regeln für elektronische Aufzeichnungen und Unterschriften (USA) [19] |
| Purdue-Modell | Purdue-Referenzmodell für Computer Integrated Manufacturing, Grundlage der ISA-95-Ebenen [1] |
| QMS | Qualitätsmanagementsystem (Software für Abweichungen, CAPA, Dokumente, Audits) |
| Review by Exception | Prüfung von Chargenprotokollen, die sich auf vom System markierte Abweichungen konzentriert |
| SCADA | Supervisory Control and Data Acquisition; Software zur Prozessführung auf Ebene 2 |
| Sparkplug | Eclipse-Spezifikation auf Basis von MQTT für Nutzdaten und Zustände (Birth and Death Certificates) [28] |
| Unified Namespace (UNS) | Architekturmuster: zentraler Broker mit hierarchischem Topic-Baum, der den aktuellen Zustand des Unternehmens hält |
| WMS | Lagerverwaltungssystem (Warehouse Management System) |

## FAQ

### Was ist ein MES einfach erklärt?

Es ist die Software, die dem Shopfloor sagt, was als Nächstes zu tun ist, und dokumentiert, was tatsächlich passiert ist, Auftrag für Auftrag und Schritt für Schritt. Gartner definiert es als produktionsorientierte Software, die die Ausführung physischer Echtzeitprozesse steuert, überwacht und synchronisiert, die Rohstoffe in Produkte umwandeln [8].

### Welche Funktionen hat ein MES?

Das ISA-95-Aktivitätsmodell nennt acht generische Aktivitäten für die Produktion: Produktdefinitionsmanagement, Ressourcenmanagement, Feinplanung, Auftragsfreigabe, Ausführungsmanagement, Datenerfassung, Verfolgung und Leistungsanalyse [3]. Das MESA-Modell von 1997 nannte 11 Funktionen und ergänzte Dokumentenlenkung, Personalmanagement, Qualitätsmanagement, Prozessmanagement und Instandhaltungsmanagement [9].

### Welche Vorteile bringt ein MES?

Produktionsdaten werden an der Quelle erfasst statt abgetippt, Auftragsdurchlaufzeiten sinken durch schnellere Freigabe und Zuteilung, erzwungene Prüfungen verringern den Qualitätsdurchschlupf, Chargen- und Seriennummern-Genealogie macht Rückrufe schneller und enger, Stillstände am Engpass werden sichtbarer, und elektronische Aufzeichnungen sind auditbereit. Jeder Nutzen hängt an einer Bedingung: korrekte Stammdaten, Prüfungen als harte Sperren konfiguriert, diszipliniertes Scannen des Materials und eine Mehrmenge, die sich tatsächlich verkaufen lässt. Abschnitt 1 nennt, was für jeden Nutzen zu messen ist.

### Was ist ISA-95 einfach erklärt?

ISA-95 (IEC 62264) ist die internationale Norm für die Integration von Unternehmenssystemen wie dem ERP mit den Steuerungssystemen der Fertigung. Sie definiert Ebenen, eine Anlagenhierarchie, Objektmodelle und Aktivitätsmodelle, damit IT, OT und Fachbereiche dasselbe Vokabular verwenden [1].

### Welche fünf Ebenen hat ISA-95?

Ebene 0 ist der physische Prozess, Ebene 1 Erfassen und Stellen, Ebene 2 Überwachung und Prozessführung, Ebene 3 Manufacturing Operations Management (MES und verwandte Systeme) und Ebene 4 Geschäftsplanung und Logistik (ERP) [1].

### Ist ISA-95 dasselbe wie IEC 62264?

Der Inhalt ist abgestimmt: Die ISA veröffentlicht ANSI/ISA-95, die IEC veröffentlicht IEC 62264. Ausgaben und Nummerierung unterscheiden sich; ANSI/ISA-95 Teil 1 von 2025 ist eine modifizierte Übernahme von IEC 62264-1 [1][2], und IEC 62264-6 erschien 2020 [6]. Immer Teil und Ausgabe angeben.

### Wie viele Teile hat ISA-95?

Acht: Modelle und Terminologie; Objekte und Attribute für die Integration von Unternehmens- und Steuerungsebene; Aktivitätsmodelle des MOM; Objekte und Attribute für die MOM-Integration; Business-to-Manufacturing-Transaktionen; Messaging-Service-Modell; Alias-Service-Modell; Informationsaustauschprofile [1].

### Was ist Ebene 3 in ISA-95?

Ebene 3 ist das Manufacturing Operations Management: die Aktivitäten, die Pläne in Produkte verwandeln, in Zeithorizonten von Tagen, Schichten, Stunden, Minuten und Sekunden [4]. Sie umfasst Produktions-, Instandhaltungs-, Qualitätsprüf- und Bestandsprozesse [3]. Das MES ist das häufigste System auf Ebene 3.

### Was ist der Unterschied zwischen MES und ERP?

Das ERP (Ebene 4) plant, was gefertigt wird, und bucht es, im Zeithorizont von Monaten bis Tagen. Das MES (Ebene 3) führt aus und dokumentiert, wie jeder Auftrag tatsächlich gefertigt wird, im Bereich von Schichten bis Sekunden [4]. Das ERP führt die finanzielle Aufzeichnung, das MES die Ist-Dokumentation. Sie tauschen Aufträge, Rückmeldungen und Materialbewegungen aus.

### Braucht man ein MES, wenn schon ein ERP vorhanden ist?

Nicht unbedingt. Vier Fragen klären es: Muss je Arbeitsschritt, Seriennummer und Parameter statt je Arbeitsgang erfasst werden; hängen Entscheidungen an Minuten statt an Rückmeldungen zum Schichtende; muss das System einen falschen Schritt verhindern statt ihn nur aufzuzeichnen; und werden elektronische Chargenprotokolle oder Device History Records benötigt? Lauten alle vier Antworten nein, können die Fertigungsfunktionen des ERP genügen. Sind zwei oder mehr ja, werden MES-Funktionen gebraucht, vom ERP-Anbieter, einem MES-Anbieter oder einer Plattform (Abschnitt 5).

### Was ist der Unterschied zwischen MES und SCADA?

SCADA überwacht und steuert Maschinen und Prozesse in Echtzeit (Datenpunkte, Alarme, Sollwerte). Das MES verwaltet Aufträge, Material, Personal, Qualität und Aufzeichnungen. SCADA weiß, dass eine Maschine läuft; das MES weiß, für welchen Auftrag, mit welcher Materialcharge und für welchen Werker sie läuft.

### Was ist der Unterschied zwischen MES und MOM?

MOM (Manufacturing Operations Management) ist der ISA-95-Begriff für die gesamte Ebene 3, einschließlich Produktions-, Qualitäts-, Instandhaltungs- und Bestandsprozessen. MES bezeichnet meist den produktionsbezogenen Kern; viele "MOM-Suiten" sind MES-Produkte mit zusätzlichen Modulen [10].

### Was ist B2MML?

B2MML ist eine XML-Umsetzung der ISA-95-Objektmodelle, entwickelt von der MESA International und in vielen ERP-MES-Schnittstellen genutzt; die ISA-95-Zuordnung in OPC UA folgt ihr, wo möglich [5]. Nach der Auflösung der MESA am 30. Juni 2026 hat die ISA deren Inhalte übernommen [11].

### Wie wird das ERP nach ISA-95 angebunden?

ISA-95 definiert die Schnittstelle zwischen Ebene 4 (ERP) und Ebene 3 (MES und andere operative Systeme). Die Teile 2 und 4 legen die ausgetauschten Objekte fest, Teil 5 die Transaktionen. In der Praxis schickt das ERP Produktdefinitionen, Fertigungsaufträge und Materialdaten nach unten; das MES schickt Arbeitsgangrückmeldungen, Warenbewegungen, Qualitätsmeldungen und Status nach oben. B2MML setzt die ISA-95-Objektmodelle in XML um [5]. Ein gemeinsames Modell verkürzt die Spezifikationsarbeit, aber jedes Projekt muss trotzdem festlegen, welches System für jedes Feld führend ist und welches Ereignis eine Buchung auslöst (Abschnitt 7).

### Ersetzt ein Unified Namespace ISA-95 oder das MES?

Nein. Ein UNS ist ein Weg, Daten zum aktuellen Zustand über einen Broker zu bewegen und zu teilen. Er braucht ISA-95 (oder ein ähnliches Modell) für Benennung und Semantik und er braucht MES und ERP für Geschäftslogik und prüfbare Aufzeichnungen.

### Was kostet ein MES?

Das hängt von Umfang, Zahl der Linien, Betriebsmodell, Integration und Regulierung ab, und Anbieter veröffentlichen selten Preise. Die eigenen Gesamtbetriebskosten über fünf Jahre lassen sich mit den Kostenblöcken aus Abschnitt 13 aufbauen; im beispielhaften Werk mit 220 Beschäftigten lagen die einmaligen Kosten bei 970.000 USD und die laufenden Kosten bei 300.000 USD pro Jahr.

### Wie lange dauert eine MES-Einführung?

Für ein Werk mit einem konfigurierten Produkt sind grob sechs bis zwölf Monate bis zu einem stabilen Piloten einzuplanen und weitere Wellen von drei bis sechs Monaten [unbelegt: Planungsannahme aus der Praxis]. Regulierte Werke und Eigenentwicklungen dauern länger.

### Ist SAP ein MES?

Das ERP-Kernsystem von SAP hat Funktionen für die Fertigungssteuerung; SAP verkauft außerdem eigene Produkte für die Fertigungsausführung. Ob die ERP-Funktionen genügen, hängt von den in Abschnitt 5 beschriebenen Anforderungen an Granularität, Verzug, Durchsetzung und Regulierung ab.

### Brauchen kleine Fertigungsbetriebe ein MES?

Nicht immer. Ein kleiner Lohnfertiger kann den größten Teil des Nutzens oft mit Rückmeldungen im ERP, einfacher Maschinenüberwachung und gutem visuellem Management erreichen. Ein MES wird nötig, wenn Schrittfolgen erzwungen, Seriennummern-Genealogie, elektronische Chargenprotokolle oder Entscheidungen nahezu in Echtzeit gebraucht werden. In den USA ist die Manufacturing Extension Partnership (MEP) des NIST, die sich auf kleine und mittlere Hersteller konzentriert, eine herstellerneutrale Anlaufstelle für eine Bewertung [31].

### Was ist ein Cloud-MES oder Composable MES?

Ein Cloud-MES läuft als Dienst in der Cloud des Anbieters; ein Composable MES besteht aus kleineren Apps auf einer gemeinsamen Plattform. Beides kann funktionieren; zu prüfen sind das Offline-Verhalten am Edge, das gemeinsame Datenmodell und in regulierten Umgebungen, wie der Release-Takt des Anbieters zur eigenen Validierung passt.

### Ist ISA-95 mit IIoT und Cloud-Plattformen noch relevant?

Ja. Die ISA erklärt, dass die Ebenen weiterhin helfen, Systemgrenzen für Industrie 4.0 zu beschreiben [1], und die Ausgabe 2025 von Teil 1 wurde für modulare, datenzentrierte Architekturen geschrieben [2]. Gealtert ist die Vorstellung, dass Daten die Ebenen einzeln hinaufklettern müssen.

### Welche Nachteile hat ISA-95?

Die Norm ist abstrakt und sagt, was benannt und ausgetauscht wird, nicht, wie es gebaut wird. Wörtlich gelesen legt ihr Ebenenmodell nahe, dass Daten Ebene für Ebene aufsteigen müssen, was moderne ereignisgesteuerte Architekturen nicht tun. Die Normtexte sind kostenpflichtig und lang, deshalb arbeiten Teams oft mit uneinheitlichen Zusammenfassungen. "ISA-95-konform" ist eine Herstellerangabe, keine Zertifizierung. Und die Norm entscheidet nicht, wo das eigene Werk die Grenze zwischen MES, Qualitäts- und Instandhaltungssystemen zieht (Abschnitt 17).

### Welche Kennzahlen sollte ein MES erfassen?

OEE und ihre Komponenten, First Pass Yield, Ausschussquote, Plantreue, Durchsatz, WIP, Durchlaufzeit und MTBF/MTTR, definiert nach ISO 22400-2 [16][17]. Außerdem das MES selbst verfolgen: Datenverzug, automatische Erfassungsquote, Nutzung und Rückverfolgungszeit.

### Was verlangt 21 CFR Part 11 von einem MES?

Für geschlossene Systeme unter anderem: Validierung, genaue Kopien der Aufzeichnungen, Schutz der Aufzeichnungen, Zugang nur für befugte Personen und sichere, computergenerierte, mit Zeitstempel versehene Audit-Trails, die frühere Einträge nicht verdecken [19]. Elektronische Unterschriften müssen mit ihren Aufzeichnungen verknüpft sein. Die Vorschrift gilt für Hersteller, die unter FDA-Aufsicht für den US-Markt produzieren.

## Fazit und erste Schritte

Ein Manufacturing Execution System ist seine Kosten wert, wenn es den Kreis zwischen Plan und Wirklichkeit schneller und zuverlässiger schließt, als Menschen mit Papier und Tabellen es können. ISA-95 liefert dafür die Landkarte: Die Ebenen zeigen, wo das MES sitzt, die Anlagenhierarchie gibt jedem System dieselben Namen, die Objektmodelle legen fest, was ERP und MES austauschen, und die 4 × 8-Matrix des Aktivitätsmodells zeigt, welches System welche Aufgabe übernehmen sollte. Ein Unified Namespace und Cloud-Plattformen ändern die Leitungen, nicht diese Zuständigkeiten.

Erfolgreiche Projekte folgen einem Muster: Sie beginnen mit einem Wertstrom und einem Datenmodell, pilotieren eine Linie mit eingefrorener Basis, beziehen Werker ab dem ersten Workshop ein, behalten harte Sperren für das wirklich Wichtige und messen den Nutzen jahrelang gemeinsam mit dem Controlling. Das Rechenbeispiel zeigt, warum: Dasselbe MES ist eine gute oder eine schlechte Investition, je nachdem, ob sich der Gewinn am Engpass verkaufen lässt und wie schnell sich der Pilot stabilisiert.

**Die ersten 30 Tage:**

- [ ] Einen Wertstrom abgehen und jede Stelle markieren, an der Informationen abgetippt werden, verzögert sind oder fehlen
- [ ] Die ISA-95-Aktivitätsmatrix (4 × 8) für diesen Wertstrom ausfüllen: Wer erledigt heute welche Aktivität?
- [ ] Die Anlagenhierarchie für den Pilotbereich entwerfen und die Namen mit Instandhaltung und IT abstimmen
- [ ] Eine Basis einfrieren: OEE am Engpass, Ausschusskosten, Auftragsdurchlaufzeit, Rückverfolgungszeit
- [ ] Vertrieb und Controlling fragen, ob sich eine Mehrmenge am Engpass verkaufen lässt und zu welchem Deckungsbeitrag
- [ ] Die regulatorischen Anforderungen an Aufzeichnungen auflisten (Part 11, QMSR, FSMA 204, Kundenanforderungen)
- [ ] Mit zwei vergleichbaren Werken sprechen, die ein MES betreiben, ohne Anwesenheit von Anbietern
- [ ] ISA-95 Teil 1 und Teil 3 für die Projektbibliothek kaufen

---

## Weiterlesen auf m365.fm

**Schwesterleitfäden**
- [Manufacturing IT mit Azure](https://www.m365.fm/learn/manufacturing-it-azure/): Cloud-Architektur, Unified Namespace auf Azure IoT Operations, Datenplattform
- [Digital Twin in der Produktion](https://www.m365.fm/learn/digital-twin/)
- [Produktionsplanung und APS](https://www.m365.fm/learn/produktionsplanung-aps/)
- [Produktionskennzahlen](https://www.m365.fm/learn/produktionskennzahlen/)
- [Shopfloor Management und Gemba Walks](https://www.m365.fm/learn/shop-floor-management/)
- [Lean Management](https://www.m365.fm/learn/lean-management/)
- [Wertstromanalyse](https://www.m365.fm/learn/wertstromanalyse/)
- [Produktionsplanung in der Luftfahrt](https://www.m365.fm/learn/produktionsplanung-luftfahrt/)
- [OT-Security und ISA/IEC 62443](https://www.m365.fm/learn/ot-security-iec-62443/) (geplant)
- [Predictive Maintenance und IIoT](https://www.m365.fm/learn/predictive-maintenance-iiot/) (geplant)
- [TPM und OEE](https://www.m365.fm/learn/tpm-oee/) (geplant)
- [S&OP, MRP und Produktionsplanung](https://www.m365.fm/learn/sop-mrp-produktionsplanung/) (geplant)
- [Theory of Constraints und Engpasssteuerung](https://www.m365.fm/learn/theory-of-constraints-engpass/) (geplant)
- [Six Sigma und Ursachenanalyse](https://www.m365.fm/learn/six-sigma-ursachenanalyse/) (geplant)
- [Kanban und Pull-Prinzip](https://www.m365.fm/learn/kanban-pull-prinzip/) (geplant)
- [5S-Methode und visuelles Management](https://www.m365.fm/learn/5s-methode-visuelles-management/) (geplant)

**Vertiefungsartikel (geplant)**
- [Papierlose Fertigung und digitale Arbeitsanweisungen](https://www.m365.fm/learn/shop-floor-management/papierlose-fertigung/) (geplant)
- [Standardarbeit](https://www.m365.fm/learn/shop-floor-management/standardarbeit/) (geplant)
- [Andon-System](https://www.m365.fm/learn/shop-floor-management/andon/) (geplant)
- [Intralogistik und innerbetrieblicher Materialfluss](https://www.m365.fm/learn/produktionsplanung-aps/intralogistik/) (geplant)
- [Process Mining in der Produktion](https://www.m365.fm/learn/digital-twin/process-mining-produktion/) (geplant)
- [Qualifikationsmatrix und Mitarbeiterqualifizierung](https://www.m365.fm/learn/operational-excellence/qualifikationsmatrix/) (geplant)

**Glossarbegriffe (Entities)**
[Enterprise resource planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Total productive maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Poka-yoke](https://www.m365.fm/entity/poka-yoke/)

# Autorenbox

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Lean Management, Operational Excellence und die digitale Transformation der Produktion, einschließlich der Systeme und Datenmodelle, die den Shopfloor mit der Planung verbinden. [Redaktion: Rolle, Kurzbiografie und Foto ergänzen.]

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Quellen

Alle Quellen abgerufen am 20. November 2026. Status: **(F)** = für diesen Artikel geöffnet und geprüft; **(S)** = am 20. November 2026 im Faktencheck eines Schwester-Pillars auf m365.fm geöffnet und geprüft (Datei genannt), hier mit gleichem Wortlaut zitiert, für diesen Artikel nicht erneut abgerufen, weil das gemeinsame Budget für Webabrufe erschöpft war (siehe Prüfhinweise).

1. ISA-95 Standard: Enterprise-Control System Integration (Liste der Teile mit Ausgaben, Ebenen 0–4, Purdue-Grundlage, Umfang jedes Teils). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard (F)
2. Update to ISA-95 Standard Addresses Integration of Enterprise and Manufacturing Control Systems. ISA-Pressemitteilung, Durham, N.C., 10. April 2025 (ANSI/ISA-95.00.01-2025, IEC 62264-1 Mod; Zitate von Christian Monchinski). https://www.isa.org/news-press-releases/2025/april/update-to-isa-95-standard-addresses-integration-of (F)
3. ANSI/ISA-95.00.03-2013, Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management, Vorschau einschließlich Inhaltsverzeichnis (Abschnitte 6–9). ANSI Webstore. https://webstore.ansi.org/preview-pages/ISA/preview_ANSI+ISA+95.00.03-2013.pdf ; ISA-Vorschau mit Anwendungsbereich: https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf (F)
4. OPC 10030: ISA-95 Common Object Model, Abschnitt 4.2.3 ISA-95 (Ebenen, Zeithorizonte, Informationsarten). OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3 (F)
5. OPC 10030: ISA-95 Common Object Model, Abschnitt 4.2 ISA-95 Summary (Objektmodelle, Verschachtelung, B2MML der MESA, OPC-UA-Zuordnung folgt B2MML). OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2 (F)
6. IEC 62264-6:2020, Enterprise-control system integration – Part 6: Messaging service model, Ausgabe 1.0, 26.06.2020. IEC Webstore. https://webstore.iec.ch/publication/59706 (F)
7. IEC 62264 (Liste der Teile und IEC-Ausgaben). Wikipedia (Sekundärquelle). https://en.wikipedia.org/wiki/IEC_62264 (F)
8. Manufacturing Execution Systems, Marktdefinition. Gartner Peer Insights. https://www.gartner.com/reviews/market/manufacturing-execution-systems (F)
9. What Isn't an MES? (MES-Funktionsmodell der MESA International mit 11 Funktionen, eines von acht MESA-Modellen; MESA zugeschriebene Angabe von 45 Prozent kürzerer Durchlaufzeit). Control Engineering. https://www.controleng.com/what-isnt-an-mes (F)
10. MES Definition Work Continues (AMR Research 1992; MESA-Definition 1997; ISA-95-MOM-Kategorien; mehr als 40 Hersteller, Zeit für Anforderungen auf vier bis sechs Wochen verkürzt). Automation World, 1. März 2006. https://automationworld.com/products/control/news/13302768/mes-definition-work-continues (F)
11. ISA Receives MESA International Content (MESA stellt den Betrieb zum 30. Juni 2026 ein; Inhalte und Bildungsprogramme gehen an die ISA). International Society of Automation. https://programs.isa.org/isa-receives-mesa-international-content (F)
12. Manufacturing execution system (MES), Definition (MESA-11 im Jahr 1997; ISA-95 verband MESA-11 mit dem Purdue-Referenzmodell). TechTarget. https://www.techtarget.com/searcherp/definition/manufacturing-execution-system-MES (F)
13. The Five Parts of ISA-95. Automation World, 6. Mai 2013. https://automationworld.com/products/software/article/13309288/the-five-parts-of-isa-95 (F)
14. Manufacturing execution system. Wikipedia (Sekundärquelle; ISA-95 Teil 1 2000, Teil 3 2005; Systeme der Ebene 3 als MOMS; B2MML). https://en.wikipedia.org/wiki/Manufacturing_execution_system (F)
15. HPImpact: Report "clarifies" MES for management (MESA-White-Paper "MES: A High Level Vision"). Hydrocarbon Processing, Ausgabe Dezember 1997. https://www.hydrocarbonprocessing.com/magazine/1997/december-1997/misc/hpimpact-report-clarifies-mes-for-management (F; die Metadaten der Seite zeigen ein Upload-Datum von 2016)
16. ISO 22400-2:2014 Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions. Ausgabe 1, 2014-01; Status "to be revised"; Amendment 1:2017 "Key performance indicators for energy management". https://www.iso.org/standard/54497.html (F, erneut abgerufen am 20. November 2026)
17. Kang, N.; Zhao, C.; Li, J.; Horst, J. A. (2016): A hierarchical structure of key performance indicators for operation management and continuous improvement in production systems. International Journal of Production Research 54(21), S. 6333–6350. NIST-Fassung: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=919754 (F, erneut abgerufen am 20. November 2026)
18. ISO 22400 KPI Selection Guide (Sekundärquelle für die Zahl von 34 Kennzahlen). Fabrico. https://www.fabrico.io/blog/iso-22400-kpi-selection-guide/ (F, erneut abgerufen am 20. November 2026)
19. 21 CFR 11.10, Controls for closed systems. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11/subpart-B/section-11.10 (F, erneut abgerufen am 20. November 2026)
20. Quality Management System Regulation (QMSR): in Kraft seit 2. Februar 2026; bezieht ISO 13485:2016 und Abschnitt 3 der ISO 9000:2015 per Verweis ein. U.S. Food and Drug Administration. https://www.fda.gov/quality-systems-regulation (F)
21. VDI 5600 Blatt 1: Fertigungsmanagementsysteme (Manufacturing Execution Systems – MES). Ausgabe Oktober 2016. https://www.din.de/en/wdc-beuth:din21:251310997 (F, erneut abgerufen am 20. November 2026)
22. MTConnect Standard, ANSI/MTC1.4-2018, Part 1.0 Overview and Fundamentals. MTConnect Institute. https://docs.mtconnect.org/ANSI_MTC1_4-2018.pdf (F, erneut abgerufen am 20. November 2026)
23. ISA/IEC 62443 Series of Standards. International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards (F, erneut abgerufen am 20. November 2026)
24. Stouffer, K. et al. (2023): Guide to Operational Technology (OT) Security. NIST SP 800-82 Rev. 3, 28. September 2023. DOI: [10.6028/NIST.SP.800-82r3](https://doi.org/10.6028/NIST.SP.800-82r3) (S: digital-twin-manufacturing.md)
25. Publish and subscribe MQTT messages using MQTT broker (Azure IoT Operations; MQTT 3.1.1 und MQTT 5). Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/manage-mqtt-broker/overview-broker (F, erneut abgerufen am 20. November 2026)
26. What is the connector for OPC UA? Azure IoT Operations, Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector (F, erneut abgerufen am 20. November 2026)
27. What is ISA-95? The Five Levels, IEC 62264 and the Automation Pyramid (Sekundärquelle für die Namen der Anlagenhierarchie Enterprise, Site, Area, Work Center, Work Unit; Herstellerseite). OPC Router. https://www.opc-router.com/what-is-isa-95/ (F)
28. Eclipse Sparkplug (Sparkplug Specification Version 3.0; Birth and Death Certificates; TLS). Eclipse Foundation, Sparkplug Working Group. https://sparkplug.eclipse.org/ (F)
29. FSMA Final Rule on Requirements for Additional Traceability Records for Certain Foods. U.S. Food and Drug Administration. https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods (F, erneut abgerufen am 20. November 2026)
30. Muchiri, P.; Pintelon, L. (2008): Performance measurement using overall equipment effectiveness (OEE): literature review and practical application discussion. International Journal of Production Research 46(13), S. 3517–3535. DOI: 10.1080/00207540601142645 (S: manufacturing-kpis.md)
31. Manufacturing Extension Partnership (MEP). National Institute of Standards and Technology (NIST). https://www.nist.gov/mep (F, erneut abgerufen am 20. November 2026)
32. 7.4.1 ISA95EquipmentElementLevelEnum, OPC 10030: ISA-95 Common Object Model. OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/7.4.1 (F, abgerufen am 20. November 2026)
33. Enterprise-Control System Integration, Part 1: Models and Terminology, ISA-dS95.01-1999, Draft 14, November 1999 (historischer öffentlicher Entwurf, Abschnitt 5.2 Anlagenhierarchie, Abschnitt 7.1 Informationskategorien; nicht die aktuelle Ausgabe). https://xml.coverpages.org/ISA95Part1-Draft14-NIST.pdf (F, abgerufen am 20. November 2026)
34. ISA-88. Wikipedia (Sekundärquelle; Modell der prozeduralen Steuerung; 1997 von der IEC als IEC 61512-1 übernommen). https://en.wikipedia.org/wiki/ISA-88 (F, abgerufen am 20. November 2026)
35. SAP Digital Manufacturing (Produktseite, Herstellerangabe; MOM-Plattform auf der SAP Business Technology Platform; Kunden von SAP Manufacturing Execution wird der Umstieg empfohlen). SAP. https://www.sap.com/products/scm/digital-manufacturing.html (F, abgerufen am 20. November 2026)
36. B2MML-BatchML (README: B2MML setzt ANSI/ISA-95 um, BatchML setzt ANSI/ISA-88 um). MESA International, GitHub. https://github.com/MESAInternational/B2MML-BatchML (F, abgerufen am 20. November 2026)
37. ISA-TR88.00.02-2022, Machine and Unit States: An Implementation Example of ISA-88 (PackML), Vorschau (Abschnitte 4 bis 6: Zustandsmodell, Betriebsarten). International Society of Automation. https://www.isa.org/getmedia/300dbd50-d549-41ac-b372-a5e52f32fc97/tr_880002_preview.pdf (F, abgerufen am 20. November 2026; vollständiger Titel laut ISA-Katalog in der Vorschau nicht angegeben)
38. 21 CFR 211.188, Batch production and control records. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-J/section-211.188 (F, abgerufen am 20. November 2026)
39. IATF 16949:2016 vs. ISO/TS 16949:2009 comparison matrix (Abschnitt 8.5.2.1). DNV (Sekundärquelle). https://www.dnv.com/siteassets/images/pdf-documents/iatf-2009-to-2016-comparison-matrix.pdf (F, abgerufen am 20. November 2026)
40. Computer Software Assurance for Production and Quality Management System Software, finale Leitlinie, Februar 2026 (CDRH, CBER). U.S. Food and Drug Administration. https://fda.gov/regulatory-information/search-fda-guidance-documents/computer-software-assurance-production-and-quality-management-system-software (F, abgerufen am 20. November 2026)
41. FASB Amends Guidance on Cloud Computing Arrangements (ASU 2018-15, veröffentlicht am 29. August 2018). Deloitte DART, Heads Up. https://dart.deloitte.com/USDART/home/publications/archive/deloitte-publications/heads-up/2018/fasb-amends-guidance-cloud-computing-arrangements (F, abgerufen am 20. November 2026)
42. FASB Amends Guidance on the Accounting for and Disclosure of Software Costs (ASU 2025-06, 18. September 2025). Deloitte DART. https://dart.deloitte.com/USDART/home/news/all-news/2025/sep/fasb-amends-guidance-on-software-costs (F, abgerufen am 20. November 2026)
43. New MESA Model: A Framework for Smarter Manufacturing. Automation.com, 22. April 2022. https://www.automation.com/article/mesa-model-a-framework-smarter-manufacturing (F, abgerufen am 20. November 2026)
44. Manditereza, K.: Implementing Unified Namespace (UNS) With MQTT Sparkplug. HiveMQ-Blog (Herstellerquelle), erstmals veröffentlicht am 20. Dezember 2022, aktualisiert am 22. Februar 2026. https://hivemq.com/blog/implementing-unified-namespace-uns-mqtt-sparkplug (F, abgerufen am 20. November 2026)

# Prüfhinweise für die Redaktion

**Quellenlage.** Quellen mit (F) wurden für die englische Fassung geöffnet, Quellen mit (S) im Faktencheck eines Schwester-Pillars am selben Tag geprüft und nicht erneut abgerufen ([24] NIST SP 800-82r3, [30] Muchiri und Pintelon). Vor Veröffentlichung einen kurzen Faktencheck der (S)-Quellen und der [unbelegt]-Stellen durchführen. Die Fachgutachter hatten zusätzlich peer-reviewte MES-Literatur angeregt (z. B. Literaturübersichten in *Production Planning & Control* und *Computers in Industry*); sie konnte nicht geprüft werden und ist deshalb nicht zitiert.

**Herstellerangaben und Herstellerquellen**

- Die Angabe von 45 Prozent kürzerer Durchlaufzeit stammt von der MESA, berichtet von *Control Engineering* [9]; im Text als Verbandsaussage gekennzeichnet.
- OPC Router [27] und HiveMQ [44] sind Herstellerseiten, nur als Sekundärquellen genutzt. SAP Digital Manufacturing [35] ist als Herstellerangabe gekennzeichnet.
- Keine Anbieter-Rankings, Marktanteile oder Preislisten. MES-Preisspannen von Wettbewerbsseiten haben keine Quelle und wurden bewusst nicht übernommen.
- "Composable MES" und "Next-Generation-MES" sind als Marketingbegriffe von Anbietern und Analysten beschrieben.

**[unbelegt]-Stellen (9 Markierungen im Text, 7 Punkte)**

1. Namen und Jahre der späteren MESA-Modelle (c-MES 2004, MESA-Modell 2008).
2. Künftiges Hosting von B2MML nach der Übertragung an die ISA (derzeit GitHub [36]; bei der ISA nachfragen).
3. "Viele MES-Produkte setzen eBR auf ISA-88 auf" (Beobachtung aus der Praxis).
4. Anteil des Validierungsaufwands in der Pharmaindustrie (kein öffentlicher Benchmark).
5. Dauer des Proof of Concept, Dauern im Fahrplan und FAQ-Antwort "sechs bis zwölf Monate" (Planungsannahmen aus der Praxis).
6. Verhandlungspflichten bei elektronischer Überwachung in gewerkschaftlich organisierten US-Werken (rechtliche Bewertung).
7. Fehlen eines ISA-95-Zertifizierungsprogramms für Produkte.

**Interne Links.** Alle `/en/learn/`-Links sind auf die deutschen URLs der Slug-Map umgestellt. Bestehende deutsche Pillars (manufacturing-it-azure, produktionsplanung-aps, produktionskennzahlen, shop-floor-management, lean-management, wertstromanalyse, produktionsplanung-luftfahrt, digital-twin) sind ohne "(geplant)" verlinkt; neue Pillars und Cluster (ot-security-iec-62443, tpm-oee, predictive-maintenance-iiot, kanban-pull-prinzip, six-sigma-ursachenanalyse, theory-of-constraints-engpass, sop-mrp-produktionsplanung, 5s-methode-visuelles-management; Cluster papierlose-fertigung, standardarbeit, andon, intralogistik, process-mining-produktion, qualifikationsmatrix) tragen "(geplant)" und sind nach Veröffentlichung zu aktivieren. Abgrenzung zu Schwesterseiten wie in der englischen Fassung: Azure-Umsetzung und Datenplattform liegen bei manufacturing-it-azure, digitale Arbeitsanweisungen beim Cluster papierlose-fertigung, Kennzahlendefinitionen bei produktionskennzahlen, Feinplanung bei produktionsplanung-aps, OT-Security bei ot-security-iec-62443. Empfohlene Ankertexte von Schwesterseiten: "Manufacturing Execution System (MES)" und "ISA-95".

**iFAKT-Offenlegung.** Die Offenlegung "Hinweis: Der Autor arbeitet bei der iFAKT GmbH." steht in der Autorenbox. Der Artikel enthält keinen iFAKT-Produktabschnitt, weil kein iFAKT-Produkt direkt zum Thema MES/ISA-95 passt. iFAKT bezahlt die Veröffentlichung nicht.

**Empfohlene Grafiken**

1. ISA-95-Ebenenmodell (Ebenen 0 bis 4) mit Beispielsystemen und Zeithorizonten; Alt-Text "ISA-95-Ebenen vom physischen Prozess bis zum ERP, MES auf Ebene 3".
2. Die 4 × 8-Aktivitätsmatrix als farbiges Raster (Produktion, Instandhaltung, Qualitätsprüfung, Bestand × acht Aktivitäten).
3. Baum der Anlagenhierarchie für das Ventilwerk.
4. Punkt-zu-Punkt vs. UNS mit der Schnittstellenzahl n × (n − 1) ÷ 2.
5. Kumulierter Zahlungsstrom für Basisfall und vorsichtigen Fall.
6. MES vs. ERP vs. SCADA als dreispaltige Grafik.

**JSON-LD-Vorschlag**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Manufacturing Execution System (MES) und ISA-95: Funktionen, Ebenen, Auswahl und ROI",
      "description": "Was ein Manufacturing Execution System leistet, wie die ISA-95-Ebenen es einordnen, MES vs. ERP vs. SCADA, Auswahl-Checkliste, Fahrplan und ROI.",
      "inLanguage": "de-DE",
      "datePublished": "2026-11-26",
      "dateModified": "2026-11-26",
      "author": {"@type": "Person", "name": "Mirko Peters", "url": "https://www.m365.fm/entity/mirko-peters/"},
      "publisher": {"@type": "Organization", "name": "m365.fm", "url": "https://www.m365.fm/"},
      "mainEntityOfPage": "https://www.m365.fm/learn/mes-isa-95/",
      "about": [
        {"@type": "Thing", "name": "Manufacturing Execution System"},
        {"@type": "Thing", "name": "ISA-95"}
      ]
    },
    {
      "@type": "FAQPage",
      "inLanguage": "de-DE",
      "mainEntity": [
        {"@type": "Question", "name": "Was ist ein MES einfach erklärt?", "acceptedAnswer": {"@type": "Answer", "text": "Es ist die Software, die dem Shopfloor sagt, was als Nächstes zu tun ist, und dokumentiert, was tatsächlich passiert ist, Auftrag für Auftrag und Schritt für Schritt."}},
        {"@type": "Question", "name": "Welche fünf Ebenen hat ISA-95?", "acceptedAnswer": {"@type": "Answer", "text": "Ebene 0 ist der physische Prozess, Ebene 1 Erfassen und Stellen, Ebene 2 Überwachung und Prozessführung, Ebene 3 Manufacturing Operations Management (MES und verwandte Systeme) und Ebene 4 Geschäftsplanung und Logistik (ERP)."}},
        {"@type": "Question", "name": "Was ist der Unterschied zwischen MES und ERP?", "acceptedAnswer": {"@type": "Answer", "text": "Das ERP plant, was gefertigt wird, und bucht es, im Zeithorizont von Monaten bis Tagen; das MES führt aus und dokumentiert, wie jeder Auftrag tatsächlich gefertigt wird, im Bereich von Schichten bis Sekunden."}},
        {"@type": "Question", "name": "Ersetzt ein Unified Namespace ISA-95 oder das MES?", "acceptedAnswer": {"@type": "Answer", "text": "Nein. Ein UNS bewegt und teilt Daten zum aktuellen Zustand über einen Broker; er braucht ISA-95 für Benennung und Semantik und MES und ERP für Geschäftslogik und prüfbare Aufzeichnungen."}},
        {"@type": "Question", "name": "Braucht man ein MES, wenn schon ein ERP vorhanden ist?", "acceptedAnswer": {"@type": "Answer", "text": "Nicht unbedingt. Entscheidend sind Granularität der Erfassung, Verzug, die Frage, ob falsche Schritte verhindert werden müssen, und regulatorische Anforderungen an Aufzeichnungen. Lauten alle vier Antworten nein, können die Fertigungsfunktionen des ERP genügen."}},
        {"@type": "Question", "name": "Welche Nachteile hat ISA-95?", "acceptedAnswer": {"@type": "Answer", "text": "Die Norm ist abstrakt, ihr Ebenenmodell wird oft fälschlich als Datenpfad gelesen, die Normtexte sind kostenpflichtig und lang, und 'ISA-95-konform' ist eine Herstellerangabe, keine Zertifizierung."}}
      ]
    }
  ]
}
```

**hreflang.** Canonical selbstreferenzierend auf `https://www.m365.fm/learn/mes-isa-95/`. hreflang-Paar: `de-DE` https://www.m365.fm/learn/mes-isa-95/ und `en-US` https://www.m365.fm/en/learn/mes-isa-95/. Die englische Fassung vermerkt bisher "kein hreflang-Paar"; dort muss das Paar nachgetragen werden.

**Für den deutschen Markt prüfen (Aufgabe für die Fachprüfung)**

- Abschnitt "Mitarbeiter und Shopfloor" und Funktion 11 (Personalmanagement): Der Text nennt nur US-Tarifrecht (NLRB). Für Deutschland prüfen, ob ein Hinweis auf die Mitbestimmung des Betriebsrats bei technischen Einrichtungen zur Leistungs- und Verhaltenskontrolle (§ 87 Abs. 1 Nr. 6 BetrVG) und auf Datenschutz (DSGVO, Beschäftigtendatenschutz) ergänzt werden soll.
- Abschnitt "MES in regulierten Branchen": nur US-Regeln (21 CFR Part 11, Part 211, QMSR, FSMA 204, US-GAAP). Prüfen, ob EU-GMP Annex 11, EU-MDR und die EU-Lebensmittel-Rückverfolgbarkeit (VO (EG) Nr. 178/2002) als europäisches Gegenstück erwähnt werden sollen; ebenso HGB/IFRS statt US-GAAP bei der Aktivierung von Software.
- OT-Security: prüfen, ob NIS2 (bzw. die deutsche Umsetzung) neben ISA/IEC 62443 und NIST SP 800-82 genannt werden soll.
- NIST MEP (FAQ kleine Betriebe) ist eine US-Anlaufstelle; prüfen, ob ein deutsches Gegenstück (z. B. Mittelstand-Digital-Zentren) ergänzt werden soll.
- Lokalisierungszusätze ohne Quelle, bitte fachlich bestätigen: Hinweis auf die "Automatisierungspyramide" bei den ISA-95-Ebenen, "BDE und MDE" bei der Datenerfassung, "Produktionsleitsystem" in der Kurzantwort, "EN 9100" neben AS9100.
- Das Beispielwerk (Acme Fluid Power, Werk Dayton) und die USD-Beträge sind bewusst unverändert übernommen (Rechenbeispiel).

Fachliche Prüfung (9-köpfiges Expertenpanel, mehrere Runden) siehe englische Fassung; die deutsche Fassung ist eine Übertragung ohne inhaltliche Änderungen.
