# SEO-Metadaten

| Feld | Wert |
|---|---|
| Meta-Title | Azure in der Fertigung: Manufacturing IT Kompendium 2026 (56 Zeichen) |
| Meta-Description | Azure in der Fertigung: Dienste-Status, Referenzarchitektur, Predictive Maintenance, Traceability, OT-Sicherheit und FinOps. Stand November 2026. (145 Zeichen) |
| Slug | `/learn/manufacturing-it-azure/` |
| Hauptkeyword | Azure Fertigung / Manufacturing IT Azure |
| Nebenkeywords | Azure Industrie 4.0, Microsoft Azure Manufacturing, Azure IoT Produktion, Azure IoT Operations, Predictive Maintenance Azure, Microsoft for Manufacturing (ehem. Microsoft Cloud for Manufacturing), Unified Namespace Azure, OPC UA Azure, Rückverfolgbarkeit Fertigung, Digitaler Zwilling Azure, Microsoft Fabric Fertigung, FinOps Fertigung, Copilot Fertigung |
| Suchintention | Informational mit kommerzieller Vorbereitung: IT-, OT- und Digitalisierungsverantwortliche in der Fertigung wollen verstehen, welche Azure-Dienste heute (Stand November 2026) tragfähig sind, wie eine Referenzarchitektur aussieht und wie sie Use Cases wirtschaftlich umsetzen. |
| Zielwortzahl | 9.000 bis 10.500 Wörter (längster Wettbewerber ca. 3.500 Wörter) |
| Sekundäre Suchanfragen (FAQ/H2) | Wird IoT Central eingestellt, Azure IoT Operations Essentials, Defender for IoT Abkündigung, Azure Digital Twins oder Fabric, Unified Namespace Azure, OEE Azure Fabric |

---

# Wettbewerbsanalyse

Auswertung der stärksten Seiten für „Azure Fertigung“, „Azure Industrie 4.0“, „Microsoft Azure Manufacturing“, „Azure IoT Produktion“, „Predictive Maintenance Azure“ und „Microsoft Cloud for Manufacturing“ (Abruf 20.11.2026; Wortzahlen geschätzt, nur Fließtext).

| URL | ca. Wörter | Stärken | Lücken |
|---|---|---|---|
| pi-informatik.berlin/pi-lexikon/produktions-it/was-ist-azure-for-manufacturing/ | 1.200 | Deutsch, ordnet Azure-Dienste konkreten Szenarien zu, betont Ergänzung statt Ersatz von MES/SCADA | Dienste-Auswahl veraltet (IoT Edge, Synapse als Kern), kein Status, keine Sicherheit, keine Kosten, stark werblich |
| digitalbusiness-magazin.de/smart-factory-wie-microsoft-azure-… | 850 | Deutsch, Fallbeispiel Werkzeughersteller mit IoT Hub | Von 2021, gesponsert, keine Architektur, keine Risiken, keine Zahlen |
| learn.microsoft.com/en-us/industry/manufacturing/overview | 1.040 | Offizielle Einordnung „Microsoft for Manufacturing“, vier Lösungsfelder | Englisch, rein deskriptiv, nennt weder Dienste-Status noch Azure IoT Operations, keine Vorgehensweise |
| ki-syndikat.de/usecases/produktion/01-predictive-maintenance/ | 3.500 | Deutsch, ehrliche Kosten- und Zeitplanbetrachtung, Datenschutz und Betriebsrat | Kaum Azure-Tiefe (nur IoT Hub erwähnt), Quellen teils nicht nachvollziehbar, nur ein Use Case |
| btelligent.com/en/blog/real-time-intelligence-azure-iot-microsoft-fabric | 1.000 | Praxisnah: Azure IoT Operations plus Fabric, konkrete Fehlerbilder, Kostenhinweis zu Eventstreams | Englisch, Versionen der Fehler nicht genannt, wenig zu Sicherheit, Datenmodell, Predictive Maintenance |
| maibornwolff.de/azure-iot-operations/ | 1.100 | Unified Namespace, MVP-Vorgehen statt PoC | Anbieterseite, ohne Datum, ohne Kosten, ohne Grenzen der Technologie |
| learn.microsoft.com/en-us/fabric/real-time-intelligence/architectures/connected-factory | ca. 900 | Offizielle Referenzarchitektur mit Mengengerüst (30.000 Tags, 40 Werke) | Englisch, keine Edge-Schicht, kein ISA-95, keine Governance |
| azure.microsoft.com/en-us/industries/discrete-manufacturing/ | ca. 800 [geschätzt, nicht vollständig gelesen] | Microsoft-Marketingeinstieg | Keine Umsetzungstiefe |

**Wie dieser Artikel die Wettbewerber übertrifft:** Keine der rankenden deutschen Seiten gibt einen belegten Dienste-Status für November 2026; mehrere empfehlen implizit Dienste, die abgekündigt sind oder deren Version das Supportende erreicht hat (IoT Central, IoT Edge 1.5). Dieser Artikel liefert eine Statustabelle mit Microsoft-Quellen und Datum, eine durchgängige Referenzarchitektur von der Maschine bis zum Copilot, und behandelt die Themen, die in allen Wettbewerbern fehlen: Datenmodell (ISA-95 und Unified Namespace), OT-Sicherheit mit IEC 62443 und NIS2, Rückverfolgbarkeit mit regulatorischen Anforderungen, FinOps für Fertigungs-IT und eine realistische Roadmap. Mit rund 10.000 Wörtern ist er fast dreimal so lang wie der längste Wettbewerber und deckt alle sechs Suchanfragen in einem Dokument ab.

---

# Manufacturing IT auf Microsoft Azure: Das Kompendium für Fertigungsunternehmen (Stand November 2026)

**Kurzantwort:** Azure in der Fertigung besteht Ende 2026 im Kern aus drei Schichten: Azure IoT Operations auf Arc-fähigem Kubernetes im Werk, Microsoft Fabric (Real-Time Intelligence, OneLake) als Datenplattform sowie Microsoft Foundry, Power BI und Copilot für Analyse, KI und Arbeitsplatz. Ältere Bausteine sind eingestellt (Time Series Insights, die Fertigungs-Agenten-Previews) oder abgekündigt (IoT Central bis 2029, die OT-Sicherheit in Defender for IoT). Entscheidend für den Erfolg sind weniger die Dienste als ein eigenes Datenmodell, ein OT-Sicherheitskonzept und Use Cases mit messbarer Ausgangsbasis.

## Inhaltsverzeichnis

1. [Was Manufacturing IT auf Azure heute bedeutet](#was-manufacturing-it-auf-azure-heute-bedeutet)
2. [Der Dienste-Stand im November 2026: Was gilt, was eingestellt ist](#der-dienste-stand-im-november-2026)
3. [Datenmodell zuerst: ISA-95 und Unified Namespace](#datenmodell-zuerst-isa-95-und-unified-namespace)
4. [Referenzarchitektur für Azure in der Fertigung](#referenzarchitektur-für-azure-in-der-fertigung)
5. [IT/OT-Konvergenz und Sicherheit: IEC 62443, NIS2 und Cyber Resilience Act](#itot-konvergenz-und-sicherheit)
6. [Use Case 1: Predictive Maintenance mit Azure](#use-case-1-predictive-maintenance-mit-azure)
7. [Use Case 2: Rückverfolgbarkeit und Genealogie](#use-case-2-rückverfolgbarkeit-und-genealogie)
8. [Use Case 3: Digitale Zwillinge](#use-case-3-digitale-zwillinge)
9. [Use Case 4: Kennzahlen, OEE und Wertstrom in Echtzeit](#use-case-4-kennzahlen-oee-und-wertstrom)
10. [ERP- und MES-Integration: SAP, Dynamics 365 und das Shopfloor-Datenmodell](#erp-und-mes-integration)
11. [KI und Copilot in der Fertigung: Was realistisch ist](#ki-und-copilot-in-der-fertigung)
12. [FinOps für Manufacturing IT](#finops-für-manufacturing-it)
13. [Business Case: So rechnen Sie den Nutzen](#business-case-so-rechnen-sie-den-nutzen)
14. [Roadmap: In fünf Phasen zur skalierbaren Plattform](#roadmap-in-fünf-phasen-zur-skalierbaren-plattform)
15. [Typische Fehler in Azure-Fertigungsprojekten](#typische-fehler-in-azure-fertigungsprojekten)
16. [Fachanwendungen im Microsoft-Ökosystem: Beispiel iFAKT Polaris](#fachanwendungen-im-microsoft-ökosystem)
17. [FAQ](#faq)
18. [Fazit](#fazit)

---

## Was Manufacturing IT auf Azure heute bedeutet

Wer vor fünf Jahren „Azure in der Fertigung“ oder „Azure Industrie 4.0“ gesucht hat, bekam eine Liste aus IoT Hub, IoT Edge, Stream Analytics, Time Series Insights und Synapse. Diese Liste beschreibt die Lage von 2026 nicht mehr. Microsoft hat seine Industrie-IoT-Strategie in drei Richtungen umgebaut:

1. **Edge statt Gerät:** Die Datenerfassung im Werk läuft heute über **Azure IoT Operations**, eine Sammlung von Datendiensten auf Kubernetes-Clustern, die über **Azure Arc** aus der Cloud verwaltet werden. Microsoft beschreibt den Dienst als „unified data plane for the edge“ [3]. Die allgemeine Verfügbarkeit wurde im November 2024 angekündigt [5].
2. **Datenplattform statt Einzeldienste:** Zeitreihen, Ereignisse und Stammdaten landen in **Microsoft Fabric**, insbesondere in Real-Time Intelligence mit Eventstream, Eventhouse und Activator. Microsoft hat Time Series Insights eingestellt und verweist für die Migration auf das Eventhouse in Fabric [10].
3. **Plattform statt Fertiganwendung:** Im IoT- und Fertigungsumfeld zieht sich Microsoft aus eigenen, fertig konfigurierten Anwendungen zurück. IoT Central nimmt seit dem 23. September 2026 keine neuen Anwendungen mehr an und wird am 20. September 2029 eingestellt [8]. Die branchenspezifischen Previews „Manufacturing data solutions“ und „Factory Operations Agent“ wurden zum 30. Mai 2025 eingestellt [2].

Das Branchenangebot heißt inzwischen **Microsoft for Manufacturing** (früher „Microsoft Cloud for Manufacturing“). Microsoft gliedert es in vier Lösungsfelder: Digital Engineering, resiliente Lieferketten, intelligente Fabriken und vernetzte Kunden [1]. Für die intelligente Fabrik nennt Microsoft vier Szenarien: Edge und Infrastruktur modernisieren, Betrieb mit KI optimieren, Mitarbeitende vernetzen und befähigen sowie Instandhaltung und Qualität [1]. Als Plattform für den „digitalen Faden“ verweist Microsoft auf Fabric [1].

Für Sie als Verantwortliche in IT, OT oder Digitalisierung bedeutet das: Die Bausteine sind generischer geworden, die Verantwortung für Datenmodell, Integration und Betrieb liegt stärker bei Ihnen oder Ihren Partnern. Dieses Kompendium zeigt, wie Sie diese Verantwortung strukturiert wahrnehmen. Es verbindet die Azure-Technik mit den Fachthemen, die über Erfolg entscheiden: Datenmodell, Sicherheit, [Industrie 4.0](https://www.m365.fm/entity/industry-4-0/) als Organisationsthema, Kennzahlen und Kosten.

### Für wen dieser Leitfaden geschrieben ist

- **IT-Leitung und Cloud-Teams**, die bereits Microsoft 365 und Azure betreiben und die Fertigung anbinden sollen.
- **OT- und Automatisierungsverantwortliche**, die verstehen wollen, was Kubernetes, MQTT und Fabric für ihre Anlagen bedeuten.
- **Produktions-, Qualitäts- und Instandhaltungsleitung**, die Use Cases wie Predictive Maintenance oder Rückverfolgbarkeit bewerten.
- **Controlling und Einkauf**, die Cloud-Kosten in der Fertigung planbar machen müssen.

### Fertigungsbegriffe für Microsoft-365- und Azure-Admins

Wer aus der Büro-IT kommt, trifft in Fertigungsprojekten auf ein eigenes Vokabular. Die wichtigsten Begriffe dieses Kompendiums in einem Satz:

| Begriff | Bedeutung | Vergleich aus der IT-Welt |
|---|---|---|
| **OT** (Operational Technology) | Technik, die physische Prozesse steuert: Maschinen, Steuerungen, Leitsysteme | Wie ein eigenes Rechenzentrum, in dem ein Ausfall die Produktion stoppt |
| **SPS** (Speicherprogrammierbare Steuerung, engl. PLC) | Industrierechner, der eine Maschine in Echtzeit steuert | Ein Embedded-System mit Laufzeiten von 15 Jahren und mehr |
| **SCADA** | Leitsystem zum Überwachen und Bedienen mehrerer Anlagen | Monitoring-Konsole mit Schreibzugriff |
| **MES** (Manufacturing Execution System) | Steuert und dokumentiert die Ausführung von Fertigungsaufträgen im Werk | Workflow-System zwischen ERP und Maschine |
| **OPC UA** | Herstellerneutraler Industriestandard für Datenaustausch mit Informationsmodell und Sicherheit | REST-API plus Schema plus Zertifikate, für Maschinen |
| **MQTT** | Leichtgewichtiges Publish/Subscribe-Protokoll | Message Bus, vergleichbar mit Event Grid oder Service Bus Topics |
| **Unified Namespace (UNS)** | Zentrale, hierarchische Ereignisstruktur, in der alle Systeme ihren Zustand veröffentlichen | Ein unternehmensweites Topic-Verzeichnis |
| **OEE** | Gesamtanlageneffektivität aus Verfügbarkeit, Leistung und Qualität | Verfügbarkeits-SLA, aber für Maschinen und mit Qualitätsanteil |
| **KQL** | Abfragesprache von Fabric Eventhouse und Azure Data Explorer | Dieselbe Sprache wie in Log Analytics und Microsoft Sentinel |

Der letzte Punkt ist für Admins ein guter Einstieg: Wer KQL aus Sentinel oder Log Analytics kennt, kann Maschinendaten im Eventhouse sofort abfragen.

### Ihr Einstieg als Microsoft-365- oder Azure-Admin

Sie müssen kein Automatisierungstechniker werden, um in einem Fertigungsprojekt wertvoll zu sein. Fünf Aufgaben liegen typischerweise bei der zentralen IT und lassen sich vorbereiten, bevor die erste Maschine angebunden ist:

1. **Identitäten und Rollen:** Entra-ID-Gruppen und RBAC-Rollen für OT-Personal, Partner und Betriebsteams anlegen; privilegierte Zugriffe über Privileged Identity Management zeitlich begrenzen.
2. **Azure-Landezone für Werke:** Abonnement- und Ressourcengruppenstruktur je Werk, Azure Policy für Tags (Werk, Kostenstelle, Use Case) und erlaubte Regionen.
3. **Azure Arc testen:** Einen Test-Server oder Kubernetes-Cluster mit Arc verbinden und die benötigten ausgehenden Endpunkte mit der Netzwerkabteilung durch die Proxy-Kette bringen. Diese Freigaben brauchen in vielen Unternehmen den längsten Vorlauf.
4. **Fabric-Grundlagen:** Kapazität, Workspace-Struktur und Zugriffskonzept festlegen; bestehende Power-BI-Governance übertragen.
5. **Gesprächsbasis mit der OT schaffen:** Das Zonenmodell des Werks verstehen, bevor Sie Netzänderungen vorschlagen. In der OT gilt Verfügbarkeit vor Vertraulichkeit; Wartungsfenster richten sich nach der Produktion, nicht nach dem Patch-Dienstag.

---

## Der Dienste-Stand im November 2026

Microsoft benennt Dienste um, führt Previews ein und kündigt sie wieder ab. Für Fertigungsprojekte mit Laufzeiten von fünf bis zehn Jahren ist der Lebenszyklus deshalb ein Architekturkriterium. Die folgende Tabelle fasst den belegten Stand zum 20.11.2026 zusammen.

### Dienste-Übersicht: Zweck, Status, Quelle

| Dienst | Zweck in der Fertigung | Status Nov. 2026 | Quelle |
|---|---|---|---|
| **Azure IoT Operations** | Edge-Datenebene: MQTT-Broker, Konnektoren (OPC UA, HTTP/REST), Data Flows, Asset-Verwaltung | Allgemein verfügbar seit Nov. 2024; regelmäßige Releases, laut Microsoft Learn aktuell Release 2610 (Version 1.5.x); neue SKU „Essentials“ (nur Single-Node-Cluster, ohne OPC-UA-Konnektor) neben „Standard“ mit vollem Funktionsumfang | [3], [5], [7] |
| **Azure Device Registry** | Cloud-Abbild von Assets und Geräten, Schema Registry | Fester Bestandteil von Azure IoT Operations; Integration mit IoT Hub in Preview | [3], [36] |
| **Azure IoT Hub** + Device Provisioning Service | Cloud-Gateway für direkt angebundene Geräte, Gerätelebenszyklus | Aktiv; von Microsoft als Zielpfad für IoT-Central-Kunden empfohlen | [8] |
| **Azure IoT Central** | Low-Code-IoT-SaaS | Keine Neuanlage seit 23.09.2026, Einstellung am 20.09.2029 | [8] |
| **Azure IoT Edge** | Container-Runtime für Edge-Geräte (Module) | Produkt im Support; Version 1.5 LTS seit 10.11.2026 ohne Support (ebenso EFLOW 1.5 für Windows); aktuelle Version 1.6 LTS (Juli 2026) mit Support bis 14.11.2028; eine EFLOW-Version 1.6 ist in den Release Notes nicht aufgeführt | [12], [13] |
| **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator, Real-Time Hub) | Streaming-Ingest, Zeitreihenanalyse mit KQL, Alarme | Allgemein verfügbar seit Ignite Nov. 2024 | [18] |
| **Microsoft Fabric OneLake / Lakehouse** | Zentrale Datenhaltung für Stamm-, Bewegungs- und Sensordaten | Allgemein verfügbar | [17] |
| **Digital twin builder** (Fabric RTI) | Ontologie-basierte digitale Abbilder von Anlagen und Prozessen | Preview | [15] |
| **Fabric IQ Ontology** | Semantische Geschäftsschicht für Analytik und Agenten | Preview; die alte Ontologie-Oberfläche wird am 31.01.2027 eingestellt, bestehende Ontologien müssen in die neue Oberfläche kopiert werden | [16] |
| **Azure Digital Twins** | Graphbasierte Zwillinge mit DTDL | Aktiv, keine Abkündigung auf der Übersichtsseite; 3D Scenes Studio in Preview | [14] |
| **Azure Data Explorer** | KQL-Zeitreihendatenbank außerhalb von Fabric | Aktiv, keine Abkündigung; nutzt wie das Fabric Eventhouse die Abfragesprache KQL | [19] |
| **Microsoft Foundry** (ehem. Azure AI Foundry / Azure AI Studio) | Modelle, Agenten, Werkzeuge für KI-Anwendungen | Aktiv; „Azure AI Services“ heißen nun „Foundry Tools“; Prompt flow wird am 20.04.2027 eingestellt | [20], [34], [37] |
| **Azure Machine Learning** | Training, Deployment und MLOps klassischer ML-Modelle | Aktiv; Microsoft positioniert Foundry für generative KI, Azure ML für klassisches ML und MLOps. Die eingebaute Datenbeschriftung (Data Labeling) wurde am 30.09.2026 eingestellt | [37], [38] |
| **Azure Arc** | Verwaltung von Kubernetes und Servern außerhalb von Azure | Aktiv; Basis von Azure IoT Operations | [3] |
| **Azure Local** (ehem. Azure Stack HCI) | Hyperkonvergente Infrastruktur im Werk | Aktiv; Umbenennung Nov. 2024 | [21] |
| **Microsoft Defender for IoT (OT-Sicherheit)** | Passives OT-Netzwerk-Monitoring, Asset-Inventar, Anomalien | Abkündigung am 02.11.2026 offiziell mitgeteilt, vollständige Einstellung im Oktober 2029; bis dahin nur noch Sicherheitsupdates und Fehlerbehebungen, keine neuen OT-Funktionen. Ein Microsoft-Partnerblog nennt abweichend den 31.05.2028 als Supportende. Konnektoren für Armis, Dragos, Forescout | [22], [24], [39] |
| **Azure Time Series Insights** | Zeitreihen-Explorer (alt) | Eingestellt am 07.07.2024; Microsoft nennt das Fabric Eventhouse als Migrationsziel | [10] |
| **Azure Percept** | Edge-KI-Entwicklungskit | Eingestellt am 30.03.2023 | [11] |
| **Manufacturing data solutions** (Azure) und **Factory Operations Agent** (Azure AI und Copilot Studio) | Fertigungsdatenmodell und Fertigungs-Copilot (Previews) | Eingestellt zum 30.05.2025 (Ankündigung Februar 2025) | [2] |
| **Factory Safety Agent** (Copilot Studio) | Arbeitssicherheits-Agent (Preview) | Eingestellt zum 23.06.2025 | [2] |
| **Manufacturing data solutions in Microsoft Fabric** | Fertigungsdatenmodell in Fabric (Preview seit April 2024) | Status unklar: Die Einstellungsmitteilungen nennen „Manufacturing data solutions“ ohne Fabric-Zusatz und schließen die Fabric-Variante weder ein noch aus; es gibt keinen eigenen Eintrag seit April 2024. Nicht für Neuprojekte einplanen, Status bei Microsoft erfragen. | [2] |

### Was die Tabelle für Ihre Architektur bedeutet

**Erstens:** Planen Sie neue Werksanbindungen auf Azure IoT Operations, nicht auf IoT Central und nicht auf eigenen IoT-Edge-Modulketten, sofern Sie keinen konkreten Grund dafür haben. IoT Edge bleibt im Support, ist aber ein Geräte-Runtime-Modell; Azure IoT Operations adressiert die Werksdatenebene mit Broker, Konnektoren und Asset-Modell [3]. Achten Sie bei der SKU-Wahl darauf, dass „Essentials“ den OPC-UA-Konnektor nicht enthält [3]. Für ein typisches Werk mit OPC-UA-Maschinen ist damit „Standard“ der Ausgangspunkt.

**Zweitens:** Halten Sie Fachlogik von Preview-Diensten fern. Die Geschichte der Manufacturing data solutions zeigt, dass ein fertigungsspezifisches Datenmodell von Microsoft in gut einem Jahr von der Preview zur Einstellung gehen kann [2]. Ihr Datenmodell gehört Ihnen und sollte in offenen Formaten (Delta-Tabellen in OneLake, JSON-Schemas im Broker, DTDL oder OPC-UA-Informationsmodelle) dokumentiert sein.

**Drittens:** Prüfen Sie Ihre OT-Sicherheitsstrategie. Die offizielle Azure-Mitteilung nennt Oktober 2029 als Ende der OT-Sicherheit in Defender for IoT, ein Microsoft-Partnerblog dagegen den 31. Mai 2028 als Supportende [22], [39]. Planen Sie mit dem früheren Datum: Beschaffung, Rollout und Abnahme neuer Sensorik dauern in regulierten Umgebungen oft länger als ein Jahr.

**Viertens:** Prüfen Sie Ihre IoT-Edge-Flotte. Geräte mit IoT Edge 1.5 erhalten seit dem 10. November 2026 keine Sicherheitsupdates mehr. Microsoft beschreibt den Wechsel auf 1.6 LTS als unkompliziert, weil keine größeren Funktionsänderungen enthalten sind [12]. Für Windows-Geräte mit IoT Edge for Linux on Windows (EFLOW) gilt dasselbe Supportende; eine EFLOW-Version 1.6 nennen die Release Notes nicht [12]. Klären Sie für diese Geräte den Zielpfad mit Microsoft oder Ihrem Hardwarelieferanten.

> **Hinweis zur Aktualität:** Diese Tabelle ist eine Momentaufnahme. Prüfen Sie vor jeder Architekturentscheidung die verlinkten Microsoft-Seiten sowie das Azure-Updates-Portal mit dem Filter „Retirements“.

---

## Datenmodell zuerst: ISA-95 und Unified Namespace

Viele Fertigungsprojekte scheitern nicht an der Cloud, sondern daran, dass niemand festgelegt hat, was eine „Maschine“, ein „Auftrag“ oder ein „Stillstand“ im Datenmodell ist. Bevor Sie den ersten Azure-Dienst bereitstellen, sollten Sie diese Frage beantworten.

### ISA-95 und die Automatisierungspyramide

Die Normenreihe **ANSI/ISA-95** (international IEC 62264) beschreibt die Integration von Unternehmens- und Leitsystemen [26]. Sie liefert zwei Dinge, die für jede Cloud-Architektur nützlich sind:

- **Ein Ebenenmodell:** Ebene 0 bis 2 umfassen den physischen Prozess, Sensorik, Aktorik und Steuerung (SPS, SCADA). Ebene 3 ist die Fertigungssteuerung (MES, MOM). Ebene 4 ist die Unternehmensplanung ([ERP](https://www.m365.fm/entity/enterprise-resource-planning/)). Diese Hierarchie wird im deutschsprachigen Raum oft als Automatisierungspyramide dargestellt.
- **Ein Objektmodell:** ISA-95 definiert Begriffe wie Equipment-Hierarchie (Enterprise, Site, Area, Work Center, Work Unit), Material, Personal, Produktionsaufträge und Leistungsdaten. Die OPC Foundation hat dieses Modell in einer eigenen Companion Specification für OPC UA abgebildet [35].

Die Kritik an der Pyramide ist bekannt: Daten wandern nur Ebene für Ebene, jede Schnittstelle ist eine Punkt-zu-Punkt-Integration, und eine neue Anwendung muss sich an mehrere Systeme anbinden. Das Objektmodell bleibt dagegen wertvoll, weil es eine gemeinsame Sprache zwischen IT, OT und Fachbereich liefert.

### Unified Namespace: Ereignisse statt Pyramide

Der **Unified Namespace (UNS)** ist ein Architekturmuster, kein Standard. Alle Systeme publizieren ihren aktuellen Zustand als Ereignisse in einen zentralen, hierarchisch strukturierten Broker, typischerweise MQTT. Konsumenten abonnieren die Themen, die sie brauchen. Die Topic-Hierarchie folgt dabei häufig der ISA-95-Equipment-Hierarchie, zum Beispiel:

```
unternehmen/werk-hamburg/montage/linie-3/station-20/zustand
unternehmen/werk-hamburg/montage/linie-3/station-20/auftrag
unternehmen/werk-hamburg/montage/linie-3/station-20/qualitaet
```

Azure IoT Operations bringt dafür einen edge-nativen MQTT-Broker mit, der MQTT 3.1.1 und MQTT 5 unterstützt [40]. Der Konnektor für OPC UA publiziert Daten aus OPC-UA-Servern als JSON im OPC-UA-PubSub-Format auf Broker-Topics und kann umgekehrt Werte in OPC-UA-Knoten zurückschreiben; Schreibanforderungen laufen über das Request/Response-Muster von MQTT 5 [4]. Damit lässt sich ein UNS im Werk aufbauen, ohne einen separaten Broker zu betreiben.

Betreiben Sie bereits einen UNS auf einem anderen Broker, müssen Sie ihn nicht ersetzen: Data Flows können Nachrichten an externe MQTT-Broker weiterleiten [3]. Ob Sie den Microsoft-Broker als Werks-UNS nutzen oder als Zubringer zu einem bestehenden Broker, ist eine Betriebsentscheidung. Wichtig ist eine verbindliche Topic- und Payload-Konvention, unabhängig vom Produkt.

### ISA-95 oder UNS? Beides.

Die produktive Antwort lautet: Verwenden Sie **ISA-95 als Vokabular** und **UNS als Transportmuster**. Konkret:

| Frage | Empfehlung |
|---|---|
| Wie benenne ich Anlagen? | ISA-95-Equipment-Hierarchie, unternehmensweit einheitlich |
| Wie strukturiere ich Topics? | Nach der Equipment-Hierarchie, darunter fachliche Domänen (Zustand, Auftrag, Qualität, Energie) |
| Wie beschreibe ich Nutzdaten? | JSON-Schemas in der Schema Registry der Azure Device Registry [3], bei Maschinen bevorzugt OPC-UA-Companion-Specifications |
| Wo liegen Stammdaten? | Im führenden System (ERP, MES, PLM); der UNS verteilt nur Referenzen und Zustände |
| Wie gehe ich mit Historie um? | Nicht im Broker, sondern im Eventhouse bzw. Lakehouse in Fabric |

### Das minimale Fertigungsdatenmodell

Unabhängig von Werkzeugen brauchen Sie für die Use Cases dieses Kompendiums ein Kernmodell mit sieben Entitäten:

1. **Asset** (Maschine, Station, Werkzeug) mit eindeutiger ID und Platz in der Hierarchie
2. **Signal** (Tag, Messgröße) mit Einheit, Abtastrate und Bezug zum Asset
3. **Zustand** (läuft, Stillstand geplant, Stillstand ungeplant, Rüsten) mit Grundcode
4. **Auftrag** (Fertigungsauftrag, Arbeitsgang) mit Bezug zum ERP
5. **Material und Charge/Serie** mit Bezug zur Stückliste
6. **Ereignis** (Alarm, Qualitätsbefund, Wartung)
7. **Person/Schicht** soweit datenschutzrechtlich zulässig

Wer diese sieben Entitäten sauber verknüpft, kann OEE, Predictive Maintenance, Rückverfolgbarkeit und einen digitalen Zwilling aus derselben Datenbasis bedienen. Wie man ein solches Modell aus einem Wertstrom ableitet, besprechen wir in der Episode [Value Stream Mapping als Live-Datenmodell](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/).

---

## Referenzarchitektur für Azure in der Fertigung

Die folgende Referenzarchitektur fasst zusammen, was Microsoft in der Dokumentation zu Azure IoT Operations [3] und in der Fabric-Referenzarchitektur „Connected Factory“ [17] beschreibt, ergänzt um die Schichten, die dort fehlen: Sicherheit, Stammdaten und Arbeitsplatz.

### Schichtenmodell

| Schicht | Aufgabe | Azure- und Microsoft-Bausteine | Typische Entscheidungen |
|---|---|---|---|
| **0: Feld und Steuerung** | Maschinen, SPS, Sensoren, Prüfstände, Kameras | Keine Azure-Komponente; OPC-UA-Server der Steuerung oder Gateway, ggf. Retrofit-Sensorik | Welche Maschinen sprechen OPC UA? Wo ist Retrofit nötig? |
| **1: Edge-Infrastruktur** | Rechenleistung im Werk, Netzsegmentierung | Industrie-PCs oder Server mit Kubernetes (z. B. AKS Edge Essentials unter Windows, Ubuntu-basierte Cluster) [3], alternativ Azure Local [21]; verwaltet über Azure Arc | Single-Node oder Mehrknoten-Cluster? Wer betreibt die Hardware? Hinweis: Die SKU „Essentials“ ist auf Single-Node beschränkt [3] |
| **2: Edge-Datenebene** | Erfassung, Normalisierung, Pufferung, lokaler UNS | Azure IoT Operations: MQTT-Broker, Konnektor für OPC UA, Konnektor für HTTP/REST (Akri-Konnektoren), Data Flows, Operations Experience, automatische Geräte- und Asset-Erkennung [3], [4] | Topic-Struktur, Schemas, Verdichtung am Edge, Plattenpuffer des Brokers, Offline-Verhalten (höchstens 72 Stunden, ggf. mit Einschränkungen [3]) |
| **3: Asset- und Geräteverwaltung** | Wer ist welches Asset? Welche Datenpunkte? | Azure Device Registry mit Namespaces und Schema Registry [3]; für direkt angebundene Geräte IoT Hub und DPS [8] | Wer pflegt die Asset-Stammdaten? Abgleich mit Instandhaltungssystem? |
| **4: Streaming und Echtzeitanalyse** | Ereignisse aufnehmen, anreichern, Alarme | Fabric Real-Time Intelligence: Eventstream, Eventhouse (KQL), Activator, Real-Time Dashboards [17], [18]; alternativ Azure Event Hubs und Azure Data Explorer [19] | Fabric-Kapazität oder Azure-PaaS? Aufbewahrung heiß/kalt? |
| **5: Datenplattform** | Historie, Kontextdaten, Datenprodukte | OneLake, Lakehouse, Data Factory für ERP-, MES- und Schichtdaten [17] | Medaillon-Struktur, Datenprodukt-Verantwortung, Zugriffskonzept |
| **6: Semantik und Zwilling** | Bedeutung, Beziehungen, Ontologie | Fabric IQ Ontology (Preview) [16], digital twin builder (Preview) [15] oder Azure Digital Twins mit DTDL [14] | Preview akzeptabel? Eigene Modellhoheit sichern |
| **7: Analytik und KI** | Modelle, Prognosen, Agenten | Fabric Data Science [17], Azure Machine Learning, Microsoft Foundry [20] | Wo wird trainiert, wo inferiert (Cloud oder Edge)? |
| **8: Arbeitsplatz und Prozesse** | Menschen informieren und handeln lassen | Power BI, Teams (inkl. Frontline-Szenarien), Power Apps, Power Automate, Microsoft 365 Copilot, Dynamics 365 | Welche Rolle sieht was? Mobil am Shopfloor? |
| **Querschnitt: Sicherheit und Governance** | Identitäten, Netz, Überwachung, Compliance | Microsoft Entra ID, Azure Policy, Microsoft Defender-Portfolio, Microsoft Purview, OT-Sensorik (Defender for IoT nur noch übergangsweise, Partnerlösungen) [22] | Zonenmodell nach IEC 62443, NIS2-Meldewege |
| **Querschnitt: Kosten** | Transparenz, Zuordnung, Optimierung | Microsoft Cost Management, Fabric-Kapazitätsmetriken, FinOps-Praktiken [25] | Kosten pro Werk, Linie, Use Case |

### Datenfluss in zehn Schritten

1. Die Steuerung stellt Prozesswerte über einen OPC-UA-Server bereit.
2. Der OPC-UA-Konnektor von Azure IoT Operations liest die konfigurierten Datenpunkte eines Assets und publiziert sie auf ein Broker-Topic, zum Beispiel `azure-iot-operations/data/<asset>` [4].
3. Der Konnektor kann Assets auf OPC-UA-Servern automatisch erkennen und ihre Konfiguration in der Azure Device Registry anlegen [4].
4. Data Flows filtern, normalisieren, rechnen Einheiten um und reichern mit Kontext an [3], [31].
5. Lokale Anwendungen (z. B. ein Andon-Board oder eine Inline-Prüfung) abonnieren den Broker direkt.
6. Ein Data Flow leitet verdichtete Daten an einen Cloud-Endpunkt weiter: Event Hubs/Kafka, den MQTT-Broker von Event Grid, Data Lake Storage, Fabric OneLake oder Azure Data Explorer [3].
7. In Fabric nimmt ein Eventstream die Daten auf; das Eventhouse speichert sie für KQL-Abfragen [17].
8. Data Factory synchronisiert ERP-, MES-, Schicht- und Kostendaten in OneLake [17].
9. Ereignisse werden mit Asset-Hierarchie und Linientopologie angereichert; Modelle werden trainiert und bewertet, Ergebnisse in OneLake gespeichert [17].
10. Real-Time Dashboards und Power BI visualisieren, Activator benachrichtigt Techniker, Copilot beantwortet Fragen in natürlicher Sprache [17].

Microsoft beziffert das Mengengerüst der Connected-Factory-Referenz mit mehr als einer Million IIoT-Ereignissen pro Stunde aus 30.000 Tags in 40 Werken [17]. Das ist eine Orientierung, kein Leistungsversprechen für Ihre Umgebung.

### Praxiserfahrungen aus Projekten

Die Beratung b.telligent beschreibt aus Projekten mit Azure IoT Operations und Fabric drei Lektionen [31]:

- **Broker-Speicher konfigurieren:** Ohne Konfiguration für persistenten Speicher können nicht weitergeleitete Nachrichten den Arbeitsspeicher füllen. Microsoft bestätigt den Punkt indirekt: Der Plattenpuffer des Brokers („disk-backed message buffer“) lässt sich nur bei der Erstbereitstellung festlegen, nicht nachträglich [40]. Entscheiden Sie Speicherprofil und Puffer deshalb vor dem Rollout.
- **Schemas stabil halten:** Wechselnde JSON-Strukturen machen nachgelagerte Verarbeitung fragil. Eine einheitliche Hülle mit Metadaten und Nutzlast hilft.
- **Eventstreams bündeln:** Da jeder Eventstream laufende Kosten verursacht, empfiehlt der Beitrag, pro Werk statt pro Quelle zu bündeln und Transformationen im Eventhouse per Update Policy und KQL statt im Eventstream durchzuführen.

Diese Hinweise stammen aus einem Beitrag vom März 2025 (aktualisiert Juni 2025); prüfen Sie, ob sie für Ihre Release-Version noch gelten.

### Alternative Pfade

Nicht jede Fertigung braucht die volle Architektur. Drei Varianten sind verbreitet:

| Variante | Wann sinnvoll | Bausteine |
|---|---|---|
| **Cloud-direkt** | Wenige, moderne, vernetzte Geräte; keine Latenzanforderungen | IoT Hub, DPS, Fabric RTI |
| **Edge-zentriert** | Viele Maschinen, OPC UA, lokale Entscheidungen, OT-Netz ohne direkte Cloud-Verbindung | Azure IoT Operations auf Arc, Fabric |
| **Partner-Edge** | Bestehende Industrial-Edge-Plattform eines Automatisierers | Partnerplattform plus Fabric bzw. Azure; Microsoft listet z. B. Azure-KI-Modelle auf Siemens Industrial Edge als Architekturleitfaden [2] |
| **Kleiner Einstieg (Mittelstand, ein Werk)** | Wenige Linien, kein eigenes Kubernetes-Team, erster Use Case OEE oder Zustandsüberwachung | Ein Single-Node-Cluster mit Azure IoT Operations „Standard“ (wegen OPC UA), eine kleine Fabric-Kapazität, Power BI; Betrieb des Clusters ggf. über einen Partner |

Für ein mittelständisches Unternehmen mit einem Werk ist die volle Schichtenarchitektur ein Zielbild, kein Startpunkt. Beginnen Sie mit Schicht 1, 2, 4 und 8 und ergänzen Sie Semantik, KI und werksübergreifende Governance, wenn der erste Use Case trägt.

---

## IT/OT-Konvergenz und Sicherheit

Sobald Maschinendaten in die Cloud fließen, wird die Fertigung Teil Ihrer Angriffsfläche. Gleichzeitig steigen die regulatorischen Anforderungen.

### IEC 62443: Zonen, Conduits, Security Levels

Die Normenreihe **ISA/IEC 62443** ist der Referenzrahmen für die Sicherheit industrieller Automatisierungs- und Steuerungssysteme. Ihre zentralen Konzepte sind Zonen (Gruppen von Assets mit gleichem Schutzbedarf), Conduits (kontrollierte Kommunikationswege zwischen Zonen) und Security Levels als Zielniveau je Zone [27]. Für eine Azure-Architektur heißt das:

- **Edge-Cluster als eigene Zone:** Der Kubernetes-Cluster mit Azure IoT Operations gehört weder in das Büro-Netz noch direkt in das Steuerungsnetz, sondern in eine Zwischenzone (häufig als „Industrial DMZ“ bezeichnet).
- **Nur ausgehende Verbindungen:** Arc und die Data Flows bauen Verbindungen aus dem Werk zur Cloud auf. Eingehende Verbindungen aus dem Internet in das Werk sind nicht vorgesehen und sollten auch nicht geöffnet werden.
- **Geschichtete Netze:** Microsoft beschreibt, dass Azure IoT Operations die sichere Verwaltung von Geräten in geschichteten Netzen unterstützt [3]. Planen Sie die Proxy- und Firewall-Kette früh mit der OT-Sicherheit.
- **Schreibrechte bewusst vergeben:** Der OPC-UA-Konnektor kann Werte in Steuerungen zurückschreiben [4]. Diese Funktion gehört in eine eigene Risikobetrachtung mit Freigabeprozess, idealerweise anfangs deaktiviert.
- **Zertifikate statt Passwörter:** Für OPC UA stehen Benutzername/Passwort, X.509-Zertifikate und anonymer Zugriff (nur für Tests) zur Verfügung [4]. Nutzen Sie Zertifikate und eine Trust List und planen Sie Zertifikatserneuerungen als wiederkehrenden Betriebsprozess.

### NIS2 in Deutschland

Das **NIS2-Umsetzungs- und Cybersicherheitsstärkungsgesetz (NIS2UmsuCG)** ist am 6. Dezember 2025 in Kraft getreten; das BSI beaufsichtigt seitdem rund 29.500 Einrichtungen statt zuvor etwa 4.500 [28]. Erfasst sind Unternehmen, die unter eine Einrichtungsart der Anlagen 1 und 2 des BSI-Gesetzes fallen und die Schwellenwerte nach § 28 BSIG erreichen: mindestens 50 Beschäftigte oder mehr als 10 Millionen Euro Jahresumsatz und Jahresbilanzsumme [41]. Aus der Fertigung zählen nach Anlage 2 insbesondere die Herstellung von Medizinprodukten, von Datenverarbeitungsgeräten, elektronischen und optischen Erzeugnissen, von elektrischen Ausrüstungen, der Maschinenbau sowie der Fahrzeugbau dazu; Chemie und Lebensmittel sind eigene Sektoren. Die wichtigsten Pflichten:

- **Registrierung** zweistufig über „Mein Unternehmenskonto“ und das seit 6. Januar 2026 freigeschaltete BSI-Portal [28].
- **Risikomanagement** mit Verantwortung der Geschäftsleitung.
- **Technische und organisatorische Maßnahmen**, unter anderem Lieferkettensicherheit und Multifaktor-Authentifizierung.
- **Meldeverfahren** für erhebliche Sicherheitsvorfälle: Erstmeldung binnen 24 Stunden nach Kenntnis, Folgemeldung binnen 72 Stunden, Abschlussmeldung spätestens einen Monat nach der Meldung [41].

Die Betroffenheit müssen Unternehmen selbst feststellen; das BSI benachrichtigt nicht. Es bietet eine unverbindliche Online-Betroffenheitsprüfung an und empfiehlt in unklaren Fällen rechtliche Beratung [41].

Für die Azure-Architektur bedeutet NIS2 vor allem: Inventar (Was ist mit der Cloud verbunden?), Protokollierung (Wer hat was wann geändert?), Lieferkettentransparenz (Welche Dienste und Partner sind beteiligt?) und ein geübter Meldeweg.

### Cyber Resilience Act für Maschinenbauer

Wer selbst Maschinen oder Produkte mit digitalen Elementen herstellt, ist zusätzlich vom **Cyber Resilience Act (Verordnung (EU) 2024/2847)** betroffen. Seit dem 11. September 2026 müssen Hersteller aktiv ausgenutzte Schwachstellen und schwere Sicherheitsvorfälle über die Single Reporting Platform der ENISA melden: Frühwarnung binnen 24 Stunden, Meldung binnen 72 Stunden, Abschlussbericht bei Schwachstellen spätestens 14 Tage nach Verfügbarkeit einer Korrektur, bei Vorfällen binnen eines Monats [30]. Ab dem 11. Dezember 2027 müssen Produkte die grundlegenden Cybersicherheitsanforderungen erfüllen, bevor sie in Verkehr gebracht werden; dazu gehören unter anderem sichere Voreinstellungen, eine Software-Stückliste (SBOM) und Sicherheitsupdates über einen angegebenen Unterstützungszeitraum, in der Regel mindestens fünf Jahre [42]. Für Maschinenbauer, die ihre Anlagen mit Cloud-Diensten ausliefern, wird Manufacturing IT damit zur Produkt-Compliance.

### OT-Monitoring nach der Defender-for-IoT-Abkündigung

Microsoft hat am 2. November 2026 in den Azure Updates offiziell mitgeteilt, die OT-Sicherheitskomponente von Defender for IoT nach einer dreijährigen Übergangsphase im Oktober 2029 vollständig einzustellen [22]. Bis dahin erhält der Dienst Sicherheitsupdates und Fehlerbehebungen, aber keine neuen OT-Funktionen; bestehende Verträge und Verlängerungen werden bis Oktober 2029 eingehalten [22]. Enterprise-IoT-Funktionen in Defender for Endpoint sowie Geräteerkennung und Schwachstellenbewertung sind nicht betroffen [22]. Einen Microsoft-eigenen Nachfolger gibt es nicht [39]. Microsoft bietet Konnektoren für Armis, Dragos und Forescout, die OT-Asset- und Schwachstellendaten in Microsoft Security Exposure Management und das Defender-Portal bringen; die Partnerlösungen erfordern eigene Lizenzen und eine eigene Bereitstellung [22], [24].

Achtung, widersprüchliche Daten: Ein Microsoft-Partnerblog vom November 2026 nennt den **31. Mai 2028** als Supportende der OT-Sicherheit [39]. Ob es sich um ein abweichendes Datum für bestimmte Vertragsformen oder um einen Fehler handelt, war zum Redaktionsschluss nicht geklärt.

Empfehlung: Wenn Sie heute ein OT-Monitoring neu einführen, bewerten Sie die Partnerlösungen direkt. Wenn Sie Defender for IoT betreiben, planen Sie die Ablösung so, dass sie vor Mitte 2028 abgeschlossen ist, und klären Sie das für Ihren Vertrag gültige Datum mit Ihrem Microsoft-Ansprechpartner.

### Sicherheits-Checkliste für die erste Werksanbindung

- [ ] Zonenmodell nach IEC 62443 für das Werk dokumentiert
- [ ] Edge-Cluster in eigener Zone, nur ausgehende Verbindungen über Proxy
- [ ] Arc- und Azure-Endpunkte in der Firewall explizit freigegeben, Rest gesperrt
- [ ] OPC-UA-Verbindungen mit Zertifikaten, Schreibzugriff deaktiviert oder freigabepflichtig
- [ ] Entra-ID-Rollen für OT-Personal mit minimalen Rechten, privilegierte Zugriffe zeitlich begrenzt
- [ ] Protokolle aus Edge und Cloud zentral gesammelt
- [ ] OT-Asset-Inventar mit Abgleich zur Azure Device Registry
- [ ] Meldeweg für NIS2-relevante Vorfälle getestet
- [ ] Update-Prozess für Azure-IoT-Operations-Releases und Kubernetes definiert (Wartungsfenster mit Produktion abgestimmt)

---

## Use Case 1: Predictive Maintenance mit Azure

Predictive Maintenance ist einer der meistgenannten Fertigungs-Use-Cases auf Azure und zugleich einer, an dem viele Piloten scheitern. Ein häufiger Grund: Das Modell kommt vor den Daten. Diesen Punkt vertiefen wir in der Episode [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/).

### Begriffe sauber trennen

| Strategie | Auslöser | Datenbedarf |
|---|---|---|
| Reaktive Instandhaltung | Ausfall | Keiner |
| Präventive Instandhaltung | Zeit- oder Zählerintervall | Betriebsstunden, Zyklen |
| Zustandsbasierte Instandhaltung (Condition Monitoring) | Grenzwertüberschreitung | Zustandsgrößen (Vibration, Temperatur, Strom) |
| Prädiktive Instandhaltung | Prognose der Restlebensdauer oder Ausfallwahrscheinlichkeit | Zustandsgrößen plus gelabelte Ausfallhistorie plus Betriebskontext |
| Präskriptive Instandhaltung | Empfehlung einer Maßnahme | Zusätzlich Wissen über Ursachen und Maßnahmen |

Viele Unternehmen erzielen den größten Teil des Nutzens bereits mit zustandsbasierter Instandhaltung. Prädiktive Modelle lohnen sich, wenn Ausfälle teuer, hinreichend häufig und physikalisch angekündigt sind. Einbettung in eine Gesamtstrategie liefert [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/), dessen Säulen autonome und geplante Instandhaltung auch ohne KI tragen.

### Datenvoraussetzungen

Bevor Sie ein Modell trainieren, sollten Sie diese Fragen mit Ja beantworten können:

1. **Gibt es eine Fehlerhistorie?** Ein überwachtes Modell braucht Ausfälle mit Zeitstempel und Fehlerart. Diese stehen meist im Instandhaltungssystem (z. B. SAP PM) und sind selten sauber kodiert.
2. **Sind die Zeitstempel synchron?** Sensorzeit, Steuerungszeit und Buchungszeit im ERP müssen sich zuordnen lassen. Nicht ohne Grund hat Microsoft für Defender-for-IoT-Sensoren eigene Gesundheitsmeldungen für fehlende oder nicht erreichbare NTP-Server eingeführt [23]; für Ihre Datenpipeline gilt dasselbe. Der OPC-UA-Konnektor überträgt den Quellzeitstempel jedes Werts mit [4]; nutzen Sie ihn statt der Ankunftszeit in der Cloud.
3. **Passt die Abtastrate zum Fehlerbild?** Lagerschäden kündigen sich in Vibrationsspektren im Kilohertzbereich an, Verschleiß an Heizbändern in Minutenwerten. Ein OPC-UA-Tag mit Sekundenauflösung reicht für das eine, nicht für das andere.
4. **Ist der Betriebskontext vorhanden?** Ohne Information über Produkt, Rezeptur, Auftrag und Zustand (Rüsten, Produktion, Stillstand) interpretiert das Modell jede Produktumstellung als Anomalie.
5. **Ist die Maßnahme definiert?** Wer reagiert auf eine Warnung, mit welcher Vorlaufzeit, und wie wird das Ergebnis zurückgemeldet?

### Vorgehen in sechs Schritten

1. **Kandidaten auswählen:** Anlagen mit hohen Ausfallkosten, wiederkehrenden Fehlerbildern und vorhandener Sensorik. Eine Pareto-Analyse der Stillstandsgründe aus dem MES liefert die Liste.
2. **Daten anbinden:** OPC-UA-Konnektor in Azure IoT Operations, Datenpunkte pro Asset definieren, Data Flow nach Fabric [3], [4]. Hochfrequente Vibrationsdaten am Edge zu Kennwerten (RMS, Kurtosis, Bandenergien) verdichten.
3. **Zustandsüberwachung zuerst:** Grenzwerte und einfache Anomalieerkennung in Eventhouse und Activator. Activator kann Techniker direkt benachrichtigen [17]. Das erzeugt Nutzen nach Wochen statt Monaten und sammelt zugleich Labels.
4. **Labels herstellen:** Instandhaltungsaufträge mit Fehlercodes an die Zeitreihen hängen. Hier entsteht der eigentliche Aufwand. Planen Sie dafür ein eigenes Werkzeug ein: Microsoft hat die eingebaute Datenbeschriftung in Azure Machine Learning am 30. September 2026 eingestellt und verweist auf Drittanbieter [38]. Für Zeitreihen-Labels aus der Instandhaltung genügt oft eine Power App mit Rückmeldung an das Instandhaltungssystem.
5. **Modell trainieren:** In Fabric Data Science oder Azure Machine Learning; Ergebnisse in OneLake speichern [17]. Beginnen Sie mit interpretierbaren Verfahren (Gradient Boosting auf Kennwerten), bevor Sie Deep Learning einsetzen.
6. **Operationalisieren:** Prognosen als Ereignis in den Instandhaltungsprozess (Meldung im Instandhaltungssystem, Teams-Benachrichtigung, Power-Apps-Formular für Rückmeldung). Modellgüte und Drift überwachen.

### Kennzahlen für den Erfolg

Messen Sie nicht die Modellgenauigkeit, sondern die betriebliche Wirkung: ungeplante Stillstandszeit, mittlere Zeit zwischen Ausfällen (MTBF), mittlere Reparaturzeit (MTTR), Anteil geplanter an allen Instandhaltungsstunden und Ersatzteilbestand. Diese [Kennzahlen](https://www.m365.fm/entity/key-performance-indicator/) brauchen eine Ausgangsbasis vor Projektstart, sonst lässt sich kein Nutzen belegen.

### Edge oder Cloud für die Inferenz?

| Kriterium | Inferenz in der Cloud | Inferenz am Edge |
|---|---|---|
| Latenz | Sekunden bis Minuten | Millisekunden |
| Datenvolumen | Nur verdichtete Daten übertragen | Rohdaten bleiben lokal |
| Betrieb | Einfacher (zentrale Modelle) | Verteilte Deployments, Versionierung pro Werk |
| Ausfallsicherheit | Abhängig von Verbindung | Auch offline nutzbar |
| Typischer Einsatz | Restlebensdauer, Wartungsplanung | Schnelle Abschaltung, Inline-Qualität |

Für klassische Predictive Maintenance reicht in den meisten Fällen die Cloud-Inferenz auf verdichteten Daten. Microsoft positioniert Azure IoT Operations seit dem Release 2603 ausdrücklich auch für KI-Szenarien näher an der Anlage („Physical AI“) [6]; prüfen Sie für Edge-Inferenz die aktuellen Release Notes [7].

### Predictive Maintenance mit Azure: Bausteine im Überblick

| Schritt | Azure- und Microsoft-Baustein | Alternative |
|---|---|---|
| Daten erfassen | Azure IoT Operations (OPC-UA-Konnektor, Data Flows) [3], [4] | IoT Hub für direkt vernetzte Sensoren [36] |
| Zeitreihen speichern und analysieren | Fabric Eventhouse mit KQL [17] | Azure Data Explorer [19] |
| Grenzwerte und Alarme | Fabric Activator [17] | Azure Monitor oder eigene Logik |
| Modell trainieren | Fabric Data Science, Azure Machine Learning [17], [37] | Fachanwendung des Maschinenherstellers |
| Maßnahme auslösen | Power Automate, Teams, Power Apps, Instandhaltungssystem | Direkte API zum CMMS |

---

## Use Case 2: Rückverfolgbarkeit und Genealogie

Rückverfolgbarkeit (Traceability) beantwortet die Frage „Wo ist dieses Teil eingebaut, und woraus besteht es?“. Genealogie beschreibt die vollständige Herkunftskette eines Produkts über Material, Charge, Prozessschritt, Maschine, Parameter, Prüfergebnis und Person. In regulierten Branchen ist sie Pflicht, in allen anderen ein Hebel für schnellere Reklamationsbearbeitung und gezieltere Rückrufe. Die Episode [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) vertieft das Thema.

### Anforderungen nach Branche

| Branche / Regelwerk | Kernanforderung an die Daten | Hinweis |
|---|---|---|
| Automotive, IATF 16949 | Abschnitt 8.5.2.1 ergänzt die Identifikation und Rückverfolgbarkeit aus ISO 9001 (u. a. Rückverfolgbarkeitsplan auf Basis einer Risikoanalyse); Abschnitt 7.5.3.2.1 regelt die Aufbewahrung bestimmter Aufzeichnungen, nach verbreiteter Lesart für die Dauer der Serien- und Ersatzteilversorgung plus ein Kalenderjahr, sofern Kunde oder Behörde nichts anderes fordern | Normtext ist kostenpflichtig; Angaben nach Sekundärquellen. Kundenspezifische Anforderungen (CSR) der OEMs gehen oft weiter |
| Luft- und Raumfahrt, EN 9100 | Rückverfolgbarkeit über den Lebenszyklus, Identifikation der Konfiguration, Rückverfolgung von Produkten aus derselben Rohmaterialcharge bzw. demselben Fertigungslos | Normzitat (Abschnitt 8.5.2) nicht im Originaltext geprüft |
| Batterien, EU-Batterieverordnung (Verordnung (EU) 2023/1542) | Elektronischer Batteriepass ab 18.02.2027 für Traktionsbatterien von Elektrofahrzeugen, Batterien leichter Verkehrsmittel (z. B. E-Bikes, E-Scooter) und Industriebatterien mit mehr als 2 kWh | [29]; Zeitplan laut EU-Kommission indikativ |
| Produkte unter der Ökodesign-Verordnung (ESPR, Verordnung (EU) 2024/1781) | Digitaler Produktpass je nach delegiertem Rechtsakt; EU-DPP-Register seit 20.07.2026 in Betrieb (zunächst mit Testumgebung); Rechtsakt für Eisen und Stahl für Q4 2026 geplant, Textilien, Aluminium und Reifen 2027; nach Annahme eines Rechtsakts gilt eine Übergangsfrist von mindestens 18 Monaten | [29]; Zeitplan laut EU-Kommission indikativ |

Für die Luftfahrt beschreibt Mirko Peters in seinem Beitrag [Aerospace Production Planning: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/), warum Durchlaufzeit und Rückverfolgbarkeit dort eng zusammenhängen.

### Das Genealogie-Datenmodell

Eine belastbare Genealogie braucht drei Arten von Beziehungen:

1. **Material-in-Material:** Charge A und Bauteil B gehen in Baugruppe C ein (Stücklistenbezug, Serien- oder Chargennummer).
2. **Material-zu-Prozess:** Baugruppe C wurde in Arbeitsgang 30 auf Station 20 mit Parametersatz X von Schicht Y bearbeitet.
3. **Prozess-zu-Ergebnis:** Arbeitsgang 30 erzeugte Prüfergebnis Z und gegebenenfalls eine Abweichung.

Diese Beziehungen sind ein Graph. Sie können ihn in Fabric als Tabellenstruktur im Lakehouse abbilden und per KQL oder SQL traversieren, oder als Graph in einem digitalen Zwilling (Fabric-Ontologie oder Azure Digital Twins) modellieren [14], [16]. Entscheidend ist, dass die Identifikation an der Quelle passiert: Scannen, RFID oder Data-Matrix-Codes an der Station, gekoppelt an das Auftragsereignis im UNS.

### Umsetzung auf Azure

- **Ereignisse am Edge erfassen:** Scanner und Stationen publizieren „Teil X an Station Y gestartet/beendet“ in den MQTT-Broker von Azure IoT Operations [3]. Prozessparameter kommen über den OPC-UA-Konnektor [4]; die Funktion „Dataset Triggering“ erlaubt, dass ein Datenpunkt die Veröffentlichung der anderen auslöst, etwa „Zyklus beendet“ [4].
- **Kontext zusammenführen:** In Fabric werden die Ereignisse mit Auftrags- und Stücklistendaten aus ERP und MES verbunden [17].
- **Unveränderbarkeit sicherstellen:** Für regulatorische Aufzeichnungen brauchen Sie unveränderbare Speicherung oder zumindest ein revisionssicheres Änderungsprotokoll. Die Unveränderbarkeitsrichtlinie von OneLake gilt derzeit nur für Diagnoseprotokolle, nicht für Geschäftsdaten [43]. Für revisionssichere Traceability-Archive bietet sich daher ergänzend Azure Blob Storage mit unveränderbaren Speicherrichtlinien (WORM) an; Fabric bleibt die Analyseschicht.
- **Abfragen bereitstellen:** Typische Abfragen sind Vorwärtsverfolgung (welche Endprodukte enthalten Charge A?) und Rückwärtsverfolgung (woraus besteht Seriennummer S?). Ein Power-BI-Bericht oder eine Power App für die Qualitätssicherung macht diese Abfragen ohne KQL-Kenntnisse nutzbar.

### Vom Traceability-Datensatz zum Digitalen Produktpass

Der Digitale Produktpass ist im Kern ein extern zugänglicher Auszug aus Ihrer Genealogie plus Nachhaltigkeits- und Materialdaten. Wer heute eine saubere Genealogie aufbaut, hat die schwierigste Vorarbeit erledigt. Achten Sie darauf, dass Identifikatoren eindeutig und dauerhaft sind und dass Sie trennen können, welche Daten öffentlich, welche für Behörden und welche nur intern bestimmt sind.

---

## Use Case 3: Digitale Zwillinge

Der Begriff [Digitaler Zwilling](https://www.m365.fm/entity/digital-twin/) wird für sehr unterschiedliche Dinge verwendet: vom 3D-Modell über das Simulationsmodell bis zur Live-Abbildung eines Werks. Für die Architektur ist eine Unterscheidung hilfreich.

### Drei Arten von Zwillingen

| Art | Frage | Daten | Werkzeuge im Microsoft-Umfeld |
|---|---|---|---|
| **Informationszwilling** | Was ist wo, und wie hängt es zusammen? | Asset-Hierarchie, Beziehungen, Live-Zustände | Fabric digital twin builder (Preview) [15], Fabric IQ Ontology (Preview) [16], Azure Digital Twins [14] |
| **Simulationszwilling** | Was passiert, wenn …? | Prozesslogik, Zeiten, Kapazitäten, Störverhalten | Fachanwendungen für Materialfluss- und Ablaufsimulation, ggf. auf Azure-Infrastruktur |
| **Engineering-Zwilling** | Wie verhält sich das Produkt oder die Anlage physikalisch? | CAD, CAE, Steuerungslogik | PLM/CAE auf Azure; Microsoft listet Architekturleitfäden u. a. für Siemens NX auf Azure Virtual Desktop mit GPU-VMs und Ansys Discovery auf GPU-VMs [2] |

Die [Virtuelle Inbetriebnahme](https://www.m365.fm/entity/virtual-commissioning/) verbindet Engineering- und Simulationszwilling: Steuerungscode wird gegen ein Anlagenmodell getestet, bevor die reale Anlage steht.

### Azure Digital Twins oder Fabric?

Microsoft weist selbst darauf hin, dass der digital twin builder in Fabric ein anderes Produkt ist als Azure Digital Twins [14], [15]. Die Unterschiede in der Praxis:

| Kriterium | Azure Digital Twins | Fabric digital twin builder |
|---|---|---|
| Status | Aktiv, keine Abkündigung auf der Übersicht [14] | Preview [15] |
| Modellierung | DTDL (Digital Twins Definition Language), Version 3 [14] | Ontologie mit Entitätstypen und Beziehungen [15] |
| Datenhaltung | Eigener Twin-Graph; Historie über Data History nach Azure Data Explorer [14] | OneLake; Daten müssen zuvor in einem Fabric Lakehouse liegen [15] |
| Integration | Event Routes zu Event Hubs, Event Grid, Service Bus [14] | Nativ in Fabric RTI, Power BI |
| Zielgruppe | Entwicklerteams, API-zentriert | Daten- und Fachteams, Low-Code |
| Visualisierung | 3D Scenes Studio (Preview) [14] | Fabric-Oberflächen, Power BI |

**Empfehlung:** Wenn Ihre Datenplattform Fabric ist und Sie analytische Zwillinge für Kennzahlen und Ursachenanalyse brauchen, beobachten Sie digital twin builder und Fabric IQ Ontology und pilotieren Sie sie, aber machen Sie Ihr Datenmodell nicht von einer Preview abhängig. Wie sich die beiden Fabric-Bausteine zueinander entwickeln, dokumentiert Microsoft bisher nicht; die Ontologie hat bereits einen Oberflächenwechsel mit Migrationspflicht hinter sich [16]. Wenn Sie heute eine produktive, API-basierte Zwillingsanwendung bauen, ist Azure Digital Twins der GA-Dienst. In beiden Fällen gilt: Halten Sie Ihre Ontologie zusätzlich in einem werkzeugneutralen Format vor.

### Wo anfangen?

Der häufigste Fehler ist, mit der 3D-Visualisierung zu beginnen. Beginnen Sie mit einer Frage, die ein Zwilling beantworten soll, zum Beispiel „Welche Aufträge sind von einem Ausfall an Station 20 betroffen?“. Daraus ergeben sich die benötigten Entitäten und Beziehungen. Mirko Peters beschreibt diesen Einstieg in [Digital Twin in Manufacturing: Where to Start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/) und den Weg vom ERP zum Shopfloor-Zwilling in [From ERP to Shop Floor: Building the Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/). Die technische Umsetzung auf Azure diskutieren wir in der Episode [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/).

---

## Use Case 4: Kennzahlen, OEE und Wertstrom

Echtzeit-Kennzahlen sind oft der schnellste Weg, Nutzen aus einer Werksanbindung zu ziehen. Sie benötigen keine KI, aber ein sauberes Zustandsmodell.

### OEE richtig berechnen

Die Gesamtanlageneffektivität (OEE) ist das Produkt aus Verfügbarkeit, Leistung und Qualität. Die Formel ist einfach, die Definitionen sind es nicht:

- **Verfügbarkeit:** Welche Stillstände zählen als geplant (Pausen, geplante Wartung, kein Auftrag)? Diese Festlegung verändert die OEE um viele Prozentpunkte.
- **Leistung:** Gegen welche Taktzeit wird gemessen: Konstruktionswert, beste erreichte Taktzeit oder Vorgabewert im ERP?
- **Qualität:** Zählt Nacharbeit als Gutteil oder Schlechtteil?

Legen Sie diese Definitionen werksübergreifend fest, bevor Sie ein Dashboard bauen. Andernfalls vergleichen Werke Zahlen, die nicht vergleichbar sind.

### Architektur für Echtzeit-Kennzahlen

1. Maschinenzustände und Stückzähler über OPC UA in den Broker [4].
2. Data Flow ordnet Zustände einem einheitlichen Statusmodell zu (Mapping von maschinenspezifischen Codes) [3].
3. Eventhouse berechnet per KQL rollierende Kennzahlen je Station, Linie und Schicht.
4. Real-Time Dashboard für den Shopfloor, Power BI für Management-Berichte [17].
5. Activator alarmiert bei Unterschreitung von Schwellwerten [17].

### Wertstrom als Live-Datenmodell

Value Stream Mapping ist klassisch eine Papierübung. Verbindet man die Prozesskästen eines Wertstroms mit Live-Daten, entsteht ein einfaches, aber wirkungsvolles Datenmodell: Durchlaufzeit, Bestände zwischen Prozessen, Zykluszeiten und Engpässe werden messbar. Wie das konkret funktioniert, zeigt die Episode [Value Stream Mapping als Live-Datenmodell](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/). Für die Feinplanung auf Basis dieser Daten kommen Systeme für [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) ins Spiel.

### Kennzahlen-Katalog für den Start

| Kennzahl | Datenquelle | Granularität |
|---|---|---|
| OEE und Teilfaktoren | Maschinenzustand, Zähler, Qualitätsbefunde | Station, Schicht |
| Durchlaufzeit | Auftragsereignisse (Start/Ende je Arbeitsgang) | Auftrag, Produkt |
| Work in Progress | Bestandsbuchungen, Scans | Puffer, Linie |
| Liefertreue | ERP (Wunsch- vs. Ist-Termin) | Kunde, Produktgruppe |
| MTBF / MTTR | Stillstände, Instandhaltungsaufträge | Anlage |
| Energie je Gutteil | Energiezähler, Stückzahl | Linie, Produkt |
| First Pass Yield | Prüfergebnisse | Arbeitsgang |

---

## ERP- und MES-Integration

Shopfloor-Daten ohne Auftrags- und Materialkontext sind Messwerte, keine Informationen. Die Integration mit ERP und MES entscheidet über den Wert der gesamten Plattform.

### Wer ist führend wofür?

| Datenobjekt | Führendes System (typisch) | Rolle der Azure-Plattform |
|---|---|---|
| Material, Stückliste, Arbeitsplan | ERP / PLM | Kopie zur Anreicherung, keine Pflege |
| Fertigungsauftrag (Planung) | ERP / APS | Kopie, Status-Rückmeldung als Ereignis |
| Arbeitsgang-Ausführung, Rückmeldung | MES | Ereignisse im UNS, Historie in Fabric |
| Maschinenzustände, Prozesswerte | Steuerung / Edge | Primäre Datenquelle |
| Instandhaltungsaufträge | ERP-Instandhaltung / CMMS | Auslösen durch Prognosen, Historie für Labels |
| Qualitätsbefunde | QM-System / MES | Verknüpfung mit Prozessdaten |

### SAP-Integration

Für SAP-Systeme existieren mehrere Wege, Daten nach Fabric zu bringen: Data-Factory-Konnektoren, Open-Mirroring-Lösungen von Partnern und „SAP Business Data Cloud Connect for Microsoft Fabric“, das SAP-Datenprodukte ohne Kopie in OneLake bereitstellen soll; für Letzteres war die allgemeine Verfügbarkeit für das dritte Quartal 2026 angekündigt [44]. Prüfen Sie den aktuellen Status und die Lizenzvoraussetzungen auf SAP-Seite vor der Planung. Für die Shopfloor-Integration mit SAP Digital Manufacturing hat die DSAG im April 2026 den Leitfaden „SAP DM Shopfloor Integration“ veröffentlicht. Er behandelt laut Einführung Architektur, Datenstrukturen und -modelle, Skalierung, Vorlagen, Betriebsorganisation und Beschaffungsaspekte; der Volltext ist DSAG-Mitgliedern vorbehalten [48]. Grundregel: Rückmeldungen in SAP erfolgen über das MES oder definierte APIs, nicht direkt aus der Datenplattform.

### Dynamics 365

Wer Dynamics 365 Supply Chain Management einsetzt, profitiert von der Nähe zum Microsoft-Ökosystem: Mit „Link to Microsoft Fabric“ lassen sich Dataverse-Daten einschließlich ausgewählter Finance-and-Operations-Tabellen ohne eigene ETL-Strecke in Fabric bereitstellen [45]. Microsoft beschreibt sein Fertigungsangebot als Kombination aus Fähigkeiten von Dynamics 365, Microsoft 365 und Azure [1].

### Der Shopfloor-Datenfluss zum ERP

Ein verbreitetes Muster:

1. ERP gibt Auftrag frei, Ereignis „Auftrag freigegeben“ landet im UNS.
2. MES startet Arbeitsgang, Ereignis „Arbeitsgang gestartet“ mit Station und Auftrag.
3. Maschinendaten werden im Data Flow mit der aktuellen Auftragsnummer angereichert.
4. MES meldet Mengen und Zeiten zurück; das ERP bucht.
5. Fabric verbindet alle Ereignisse zu einem vollständigen Auftragsverlauf für Analyse und Genealogie.

---

## KI und Copilot in der Fertigung

Generative KI ist in der Fertigung angekommen, aber anders als 2024 erwartet. Microsoft hat seine fertigungsspezifischen Agenten-Previews (Factory Operations Agent, Factory Safety Agent) 2025 eingestellt [2] und setzt stattdessen auf generische Plattformbausteine: Microsoft Foundry für Agenten und Modelle [20], Copilot in Fabric für Fragen an Daten [17], Copilot Studio und Microsoft 365 Copilot für Arbeitsplatzszenarien. Auf der Ignite 2025 kamen Fabric IQ und Foundry IQ als Preview hinzu, die Agenten mit einer semantischen Schicht bzw. einer Wissensbasis versorgen sollen [34]. Auch hier gilt der Lebenszyklus-Blick: Prompt flow, ein verbreitetes Werkzeug für frühe LLM-Anwendungen in Foundry und Azure Machine Learning, wird am 20. April 2027 eingestellt; Microsoft empfiehlt die Migration auf das Microsoft Agent Framework [37].

### Realistische Szenarien

| Szenario | Bausteine | Voraussetzung |
|---|---|---|
| Fragen an Produktionsdaten in natürlicher Sprache („Warum war Linie 3 gestern langsamer?“) | Copilot in Fabric, Fabric-Datenagenten, Ontologie [16], [17] | Sauberes Datenmodell, verständliche Tabellen- und Spaltennamen, definierte Kennzahlen |
| Schichtübergabe und Störungsberichte zusammenfassen | Microsoft 365 Copilot, Teams, Copilot Studio | Strukturierte Erfassung, z. B. in Power Apps oder Teams-Formularen |
| Assistenz für Instandhaltung (Handbücher, Störungshistorie durchsuchen) | Microsoft Foundry mit Retrieval, Copilot Studio | Dokumente digital und aktuell, Berechtigungen gepflegt |
| Visuelle Qualitätsprüfung | Bildverarbeitungsmodelle, Inferenz am Edge | Gelabelte Bilddaten (Beschriftungswerkzeug eines Drittanbieters, da Azure ML Data Labeling eingestellt ist [38]), stabile Beleuchtung |
| Planungsassistenz (Szenarien vergleichen) | Fachanwendung (APS, Simulation) plus KI | Valides Planungsmodell |

### Microsoft 365 als Brücke zum Shopfloor

Für ein Publikum, das Microsoft 365 bereits betreibt, liegt der größte kurzfristige Hebel oft nicht in Azure, sondern in der Verbindung von Shopfloor-Ereignissen mit dem Arbeitsplatz:

- **Teams für Frontline Worker:** Schichtkommunikation, Aufgaben, Benachrichtigungen aus Activator oder Power Automate direkt in Teams [17].
- **Power BI:** Kennzahlenberichte für Management und Werkleitung, aufbauend auf denselben Fabric-Daten.
- **Power Apps:** Erfassung von Stillstandsgründen, Qualitätsbefunden und Wartungsrückmeldungen an Tablets am Arbeitsplatz. Damit entstehen genau die Labels, die Predictive Maintenance braucht.
- **Copilot:** Zusammenfassungen von Schichtberichten, Abweichungsanalysen und Besprechungsnotizen aus dem Shopfloor-Management.
- **Lizenzen früh klären:** Für Shopfloor-Mitarbeitende kommen meist Frontline-Lizenzen (Microsoft 365 F1 oder F3) infrage. Prüfen Sie vor dem Rollout, welche Funktionen wie Power Apps oder Copilot darin enthalten sind und welche Zusatzlizenzen nötig werden; sonst scheitert ein guter Pilot an der Skalierung.

### Grenzen und Governance

- **Keine Steuerungsentscheidungen durch Sprachmodelle.** Sprachmodelle gehören in die Assistenz, nicht in den geschlossenen Regelkreis einer Anlage.
- **EU AI Act beachten:** Prüfen Sie, ob ein KI-System als Sicherheitsbauteil eines Produkts oder in der Beschäftigtensteuerung eingesetzt wird; daraus können Hochrisiko-Pflichten folgen. Mit dem „Digital Omnibus on AI“ (Verordnung (EU) 2026/1744, in Kraft seit Ende Juli 2026) wurden diese Fristen verschoben: für eigenständige Hochrisiko-Systeme, etwa im Personalbereich, auf den 2. Dezember 2027, für in Produkte eingebettete Systeme auf den 2. August 2028. KI in Maschinen soll künftig über delegierte Rechtsakte zur Maschinenverordnung geregelt werden [46]. Die Einordnung Ihres konkreten Systems muss rechtlich geprüft werden.
- **Mitbestimmung:** Systeme, die Leistung oder Verhalten von Beschäftigten auswerten können, sind in Deutschland in der Regel mitbestimmungspflichtig. Binden Sie den Betriebsrat früh ein.
- **Berechtigungen:** Copilot zeigt, was ein Benutzer sehen darf. Übermäßig breite Freigaben in SharePoint oder Fabric werden durch KI sichtbar.

---

## FinOps für Manufacturing IT

Cloud-Kosten in der Fertigung verhalten sich anders als in klassischen IT-Workloads: Datenmengen wachsen mit jeder angebundenen Maschine, Lasten laufen rund um die Uhr, und ein Teil der Infrastruktur steht im Werk. FinOps hilft, diese Kosten planbar und dem Nutzen zuordenbar zu machen. Die Episode [FinOps for Manufacturing IT](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/) geht auf die Besonderheiten ein.

### Das FinOps-Framework in Kürze

Microsoft orientiert seine FinOps-Leitlinien am Framework der FinOps Foundation [25]. Es besteht aus sechs Prinzipien (unter anderem „Teams need to collaborate“, „Business value drives technology decisions“ und „Take advantage of the variable cost model of the cloud“), drei Lebenszyklusphasen (Inform, Optimize, Operate) und vier Domänen [25]:

| Domäne | Bedeutung für die Fertigung |
|---|---|
| Understand usage and cost | Kosten je Werk, Linie und Use Case sichtbar machen (Tagging, getrennte Fabric-Kapazitäten oder Workspaces) |
| Quantify business value | Kosten pro Gutteil, pro angebundener Maschine oder pro vermiedener Stillstandsstunde |
| Optimize usage and cost | Datenvolumen am Edge reduzieren, Aufbewahrung staffeln, Kapazitäten richtig dimensionieren |
| Manage the FinOps practice | Verantwortlichkeiten, Richtlinien, Chargeback an Werke |

Das Framework empfiehlt, die Reife je Fähigkeit statt pauschal zu bewerten und alle drei bis sechs Monate neu zu prüfen [25].

### Die zehn wichtigsten Kostenhebel

1. **Am Edge verdichten:** Nicht jeder Messwert in Sekundenauflösung muss in die Cloud. Data Flows können filtern und aggregieren [3]. Das ist der größte Einzelhebel.
2. **Änderungsbasiert senden:** Der OPC-UA-Konnektor überträgt standardmäßig nur geänderte Werte und ergänzt periodische Key Frames mit allen Werten für den Zustandsabgleich [4]. Prüfen Sie zusätzlich Totbänder (Deadband) in der Steuerung oder im OPC-UA-Server, damit Rauschen nicht als Änderung zählt.
3. **Eventstreams bündeln:** Pro Werk statt pro Quelle, Transformationen im Eventhouse [31].
4. **Aufbewahrung staffeln:** Heiße Daten im Eventhouse-Cache für Tage oder Wochen, ältere Daten im OneLake-Speicher.
5. **Fabric-Kapazität bewusst dimensionieren:** Kapazitätsauslastung mit der Capacity-Metrics-App überwachen, Entwicklungs- und Produktivlasten trennen, nicht benötigte Kapazitäten pausieren. Pausieren ist für F-SKUs dokumentiert; beim Pausieren werden aufgelaufene Überziehungen sofort abgerechnet, und Inhalte der Kapazität sind nicht erreichbar [47]. Eine Kapazität, an der ein Eventstream oder ein Werks-Dashboard hängt, eignet sich deshalb nicht zum Pausieren.
6. **Edge-SKU passend wählen:** Azure IoT Operations bietet seit Release 2610 neben „Standard“ eine günstigere SKU „Essentials“ für volumenstarke Einsätze, beschränkt auf Single-Node-Cluster und ohne OPC-UA-Konnektor [3]. Sinnvoll ist sie etwa an Standorten, deren Daten bereits per MQTT oder HTTP ankommen. Prüfen Sie je Standort, welche Funktionen Sie tatsächlich brauchen.
7. **Reservierungen und Sparpläne** für dauerhaft laufende Azure-Ressourcen nutzen.
8. **Kosten zuordnen:** Tags für Werk, Kostenstelle und Use Case erzwingen (Azure Policy).
9. **Unit Economics einführen:** Cloud-Kosten je produzierter Einheit oder je angebundener Maschine berichten. Erst dann lassen sich Werke vergleichen.
10. **Altlasten abbauen:** Abgekündigte Dienste (IoT Central, IoT Edge 1.5) migrieren, bevor parallele Strukturen doppelt kosten.

### Kosten der Edge-Seite nicht vergessen

Hardware im Werk, Kubernetes-Betrieb, Lizenzen für Azure Arc-fähige Dienste und das Personal für Updates gehören in dieselbe Rechnung. Ein Business Case, der nur die Azure-Rechnung betrachtet, unterschätzt die Gesamtkosten systematisch. Preise nennt dieses Kompendium bewusst nicht, weil sie sich häufig ändern; die aktuellen Preismodelle für Azure IoT Operations (Standard und Essentials), Azure Arc und Azure Local finden Sie auf den Azure-Preisseiten und im Azure-Preisrechner.

---

## Business Case: So rechnen Sie den Nutzen

Pauschale Nutzenversprechen aus Branchenstudien helfen bei der Freigabe eines Budgets selten weiter, weil sie Ihre Ausgangslage nicht kennen. Belastbarer ist eine Rechenlogik, die Sie mit Ihren eigenen Werten füllen.

### Nutzenkategorien

| Kategorie | Rechenweg | Datenquelle |
|---|---|---|
| Vermiedene ungeplante Stillstände | Stillstandsstunden × Deckungsbeitrag je Stunde × erwartete Reduktion | MES-Stillstandshistorie, Controlling |
| Höhere OEE | Zusätzliche Gutteile × Deckungsbeitrag je Teil | OEE-Ausgangsbasis |
| Geringere Ausschuss- und Nacharbeitskosten | Ausschussmenge × Herstellkosten × Reduktion | QM-System |
| Schnellere Reklamationsbearbeitung | Stunden je Reklamation × Stundensatz × Reduktion; kleinerer Rückrufumfang | Reklamationshistorie |
| Instandhaltungskosten | Ersatzteilbestand, Fremdleistungen, Überstunden | ERP-Instandhaltung |
| Compliance | Vermiedene Aufwände für manuelle Nachweise (Audit, DPP) | Qualitäts- und Compliance-Abteilung |

### Kostenkategorien

- Edge-Hardware und -Betrieb je Werk
- Azure- und Fabric-Verbrauch (laufend)
- Lizenzen (Power BI, Copilot, Fachanwendungen, ggf. OT-Sicherheit)
- Implementierung (intern und extern)
- Change Management und Schulung
- Retrofit-Sensorik für Altmaschinen

### Rechenbeispiel mit fiktiven Werten

Eine Linie hat 120 Stunden ungeplanten Stillstand pro Jahr, der Deckungsbeitrag liegt bei 1.500 Euro je Stunde. Gelingt es, durch Zustandsüberwachung und schnellere Reaktion 20 Prozent dieser Stunden zu vermeiden, ergibt das 24 Stunden × 1.500 Euro = 36.000 Euro pro Jahr. Dem stehen die anteiligen Kosten gegenüber: Edge-Hardware und Betrieb, Fabric-Verbrauch, Lizenzen und interne Stunden. Die Zahlen sind bewusst einfach gewählt; entscheidend ist, dass jede Annahme eine Quelle in Ihrem Haus hat (MES-Historie, Controlling) und dass Sie die Reduktion nach drei bis sechs Monaten gegen die Ausgangsbasis messen.

### Faustregel für die Priorisierung

Beginnen Sie mit dem Use Case, bei dem drei Bedingungen zusammenkommen: messbare Ausgangsbasis, verfügbare Daten und ein Prozessverantwortlicher, der die Ergebnisse nutzen will. Das ist häufiger Echtzeit-OEE oder Rückverfolgbarkeit als Predictive Maintenance.

---

## Roadmap: In fünf Phasen zur skalierbaren Plattform

Die folgende Roadmap folgt dem verbreiteten Muster „erst Fundament und ein Leit-Use-Case, dann Skalierung“. Die Zeitangaben sind Richtwerte für ein erstes Werk und hängen stark von Ausgangslage, Netzwerkfreigaben und Ressourcen ab.

### Phase 1: Klarheit (4 bis 8 Wochen)

- Use-Case-Portfolio mit Nutzenabschätzung, Auswahl von ein bis zwei Leit-Use-Cases
- Ist-Aufnahme: Maschinenpark, Protokolle (OPC UA vorhanden?), Netzwerk, bestehende Systeme
- Zielbild Datenmodell (ISA-95-Hierarchie, UNS-Topic-Konvention)
- Sicherheitskonzept mit OT-Sicherheit und Datenschutz, Einbindung Betriebsrat
- Lebenszyklusprüfung aller eingeplanten Dienste anhand dieser Statustabelle

### Phase 2: Fundament (6 bis 12 Wochen)

- Edge-Infrastruktur im Pilotwerk, Arc-Anbindung, Azure IoT Operations
- Fabric-Workspace-Struktur, Kapazitätsplanung, Zugriffskonzept
- Erste Maschinen über OPC UA angebunden, Assets in der Device Registry
- FinOps-Grundlagen: Tags, Budgets, Kostenberichte je Werk

### Phase 3: Erster Nutzen (8 bis 12 Wochen)

- Leit-Use-Case produktiv, z. B. Echtzeit-OEE mit Stillstandsgrund-Erfassung per Power App
- Shopfloor-Dashboard und Management-Bericht
- Ausgangsbasis und erste Wirkungsmessung

### Phase 4: Vertiefung (3 bis 6 Monate)

- ERP- und MES-Kontext integriert, Auftragsverlauf und Genealogie
- Zustandsüberwachung, Labelsammlung für Predictive Maintenance
- Erste Copilot-Szenarien auf kuratierten Daten

### Phase 5: Skalierung (je nach Verlauf ab Monat 9 bis 15)

- Ausrollen auf weitere Linien und Werke mit Infrastructure as Code und GitOps
- Werksübergreifende Kennzahlen mit einheitlichen Definitionen
- Predictive Maintenance für ausgewählte Anlagen, Zwillingsszenarien
- Betriebsmodell: Plattformteam, Datenprodukt-Verantwortliche je Domäne, Release-Management für die in der Regel monatlichen Azure-IoT-Operations-Releases [7]

Entscheidend ist der Wechsel vom Proof of Concept zum Minimum Viable Product: Ein PoC beweist, dass Technik funktioniert. Ein MVP beweist, dass Menschen damit besser arbeiten.

---

## Typische Fehler in Azure-Fertigungsprojekten

1. **Technik vor Frage:** Plattform aufbauen, ohne dass ein Fachbereich ein konkretes Problem lösen will.
2. **Preview als Fundament:** Fachlogik auf Preview-Dienste setzen. Die Einstellung der Manufacturing data solutions und der Factory Agents zeigt das Risiko [2].
3. **Veraltete Bausteine aus alten Leitfäden:** Neue Projekte auf IoT Central, Time Series Insights oder IoT Edge 1.5 planen, weil ein Artikel von 2021 sie empfiehlt [8], [10], [12].
4. **Falsche SKU:** Azure IoT Operations „Essentials“ für ein Werk mit OPC-UA-Maschinen einplanen, obwohl die SKU keinen OPC-UA-Konnektor enthält [3].
5. **Kein Zustandsmodell:** Maschinenspezifische Statuscodes ungefiltert übernehmen. Werksvergleiche werden unmöglich.
6. **Alles in die Cloud:** Rohdaten in voller Auflösung übertragen und sich über die Rechnung wundern.
7. **OT-Sicherheit nachgelagert:** Edge-Cluster ohne Zonenkonzept ins Netz stellen, Schreibzugriff auf Steuerungen offen lassen.
8. **Labels vergessen:** Predictive Maintenance ohne strukturierte Fehlerhistorie starten.
9. **Kennzahlen ohne Definition:** OEE-Dashboards bauen, bevor Werke sich auf Verfügbarkeitsdefinitionen geeinigt haben.
10. **Betrieb unterschätzen:** Regelmäßige Releases, Kubernetes-Updates, Zertifikatswechsel und der Broker-Puffer, der nur bei der Erstbereitstellung festgelegt werden kann [40], ohne Verantwortliche.
11. **Menschen nicht mitnehmen:** Shopfloor-Mitarbeitende erfahren vom Projekt erst, wenn das Tablet am Arbeitsplatz hängt.

---

## Fachanwendungen im Microsoft-Ökosystem

> **Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

Eine Plattform aus Azure IoT Operations und Fabric liefert Daten, aber keine Fachlogik für Planung, Wertstrom oder Simulation. Diese Lücke füllen Fachanwendungen, die über Microsoft AppSource bzw. den Microsoft Marketplace bezogen werden können.

Ein Beispiel ist [Polaris](https://www.m365.fm/entity/polaris/) der [iFAKT GmbH](https://www.m365.fm/entity/ifakt/). Der Hersteller beschreibt Polaris als Software zum Digitalisieren, Simulieren und Optimieren der Produktion mit den Modulen VSM/BSM (Wertstrom- und Swimlane-Modellierung), Simulator, Optimizer (Planung), Operator und Analyzer (Kennzahlenanalyse). Die Planung arbeitet nach Herstellerangaben constraint-basiert mit Ressourcen, Qualifikationen, Schichten und Puffern; ein KPI-Cockpit zeigt Durchlaufzeit, Bestände, Auslastung und Liefertreue. Polaris VSM ist als SaaS-Angebot im Microsoft Marketplace gelistet [33]; Microsoft hat iFAKT im Rahmen des Programms „ISV Success for Business Applications“ vorgestellt [32].

Für die Architektur dieses Kompendiums ist eine solche Anwendung in Schicht 6 bis 8 einzuordnen: Sie nutzt Prozess- und Auftragsdaten, um Wertströme abzubilden, Szenarien zu simulieren und Pläne zu optimieren. Wie eine konkrete Integration mit Ihrer Datenplattform aussieht, sollten Sie im Einzelfall mit dem Anbieter klären; dieser Artikel trifft dazu keine Aussage.

Unabhängig vom Anbieter helfen bei der Auswahl solcher Fachanwendungen vier Fragen: Liest die Anwendung Daten aus offenen Formaten (z. B. Delta-Tabellen in OneLake oder Ereignisse aus dem Broker), oder braucht sie eigene Schnittstellen? Wer ist führend für Stammdaten wie Arbeitspläne und Kapazitäten? Wo laufen Daten und Berechnungen (Region, Mandant)? Und wie kommen Ergebnisse, etwa ein optimierter Plan, kontrolliert zurück in ERP oder MES?

---

## FAQ

### Was ist der Unterschied zwischen Azure IoT Hub und Azure IoT Operations?

IoT Hub ist ein Cloud-Dienst, mit dem sich einzelne Geräte direkt mit Azure verbinden. Azure IoT Operations ist eine Datenebene, die im Werk auf Arc-fähigem Kubernetes läuft und Maschinen über OPC UA und andere Konnektoren an einen lokalen MQTT-Broker anbindet [3]. Für Fabriken mit vielen Maschinen ist Azure IoT Operations meist der passende Einstieg, IoT Hub für verteilte, direkt vernetzte Geräte.

### Wird Azure IoT Central eingestellt?

Ja. Seit dem 23. September 2026 können keine neuen IoT-Central-Anwendungen angelegt werden; bestehende Anwendungen laufen bis zum 20. September 2029. Microsoft empfiehlt als Zielpfad IoT Hub mit Device Provisioning Service, Microsoft Fabric und, wo passend, Azure Device Registry; Dashboards und Analysen wandern nach Fabric Real-Time Intelligence [8]. Eine im Februar 2024 im Azure-Portal angezeigte Abkündigung zum 31. März 2027 hatte Microsoft damals als fehlerhafte Systemmeldung zurückgezogen [9]. Die Ankündigung von 2026 ist dagegen eine reguläre Mitteilung mit dreijähriger Frist.

### Gibt es Azure Time Series Insights noch?

Nein. Time Series Insights wurde am 7. Juli 2024 eingestellt. Microsoft verweist als Migrationsziel auf das Eventhouse in Microsoft Fabric Real-Time Intelligence [10]. Wer Fabric nicht einsetzt, kann Azure Data Explorer nutzen, der ebenfalls mit KQL arbeitet [19].

### Was ist aus Microsoft Cloud for Manufacturing geworden?

Das Branchenangebot heißt heute „Microsoft for Manufacturing“ und bündelt Fähigkeiten aus Azure, Dynamics 365 und Microsoft 365 [1]. Die spezifischen Previews „Manufacturing data solutions“ und „Factory Operations Agent“ wurden zum 30. Mai 2025 eingestellt, der „Factory Safety Agent“ zum 23. Juni 2025 [2]. Für die Variante „Manufacturing data solutions in Microsoft Fabric“ gibt es keine eigene Mitteilung; planen Sie sie nicht für Neuprojekte ein.

### Welche Azure-Dienste brauche ich für Industrie 4.0?

Für eine typische Werksanbindung: Azure Arc und einen Kubernetes-Cluster im Werk, darauf Azure IoT Operations (Broker, OPC-UA-Konnektor, Data Flows), Azure Device Registry für Assets, Microsoft Fabric mit Eventstream, Eventhouse und Activator für Echtzeitdaten sowie Power BI für Berichte [3], [17]. KI-Bausteine (Fabric Data Science, Azure Machine Learning, Microsoft Foundry) und Zwillinge kommen später hinzu. Den Rahmen bilden Entra ID, Azure Policy, Cost Management und eine OT-Sicherheitslösung.

### Was ist der Unterschied zwischen Azure IoT Operations Essentials und Standard?

„Standard“ bietet den vollen Funktionsumfang. „Essentials“ ist seit Release 2610 eine günstigere Variante für volumenstarke Einsätze, läuft nur auf Single-Node-Clustern und enthält den OPC-UA-Konnektor nicht [3]. Für Werke mit OPC-UA-Maschinen ist daher „Standard“ die Ausgangsbasis.

### Brauche ich für Azure IoT Operations Kubernetes-Know-how?

Ja, zumindest im Betrieb. Azure IoT Operations läuft auf Arc-fähigen Kubernetes-Clustern und wird Kubernetes-basiert konfiguriert [3]. Für den Einstieg dokumentiert Microsoft Installationen unter Ubuntu und unter Windows mit AKS Edge Essentials [3]. Planen Sie Kompetenzaufbau oder einen Betriebspartner ein.

### Funktioniert die Produktion weiter, wenn die Internetverbindung ausfällt?

Azure IoT Operations kann laut Microsoft höchstens 72 Stunden offline arbeiten, gegebenenfalls mit Einschränkungen, und nimmt nach Wiederverbindung den vollen Funktionsumfang wieder auf [3]. Wie viele Nachrichten in dieser Zeit gepuffert werden, hängt von der Broker-Konfiguration ab, die bei der Erstbereitstellung festgelegt wird [40]. Steuerungsfunktionen dürfen grundsätzlich nicht von der Cloud abhängen; die Steuerung bleibt in SPS und lokalen Systemen.

### Azure Digital Twins oder digital twin builder in Fabric?

Azure Digital Twins ist ein allgemein verfügbarer Dienst mit DTDL-Modellen und API-Zugriff [14]. Der digital twin builder ist Teil von Fabric Real-Time Intelligence, arbeitet mit Ontologien auf OneLake-Daten und befindet sich in Preview [15]. Für produktive, entwicklergetriebene Zwillinge ist heute Azure Digital Twins die sichere Wahl, für analytische Zwillinge in einer Fabric-Plattform lohnt ein Pilot mit dem digital twin builder.

### Welche Daten brauche ich für Predictive Maintenance?

Zustandsgrößen in passender Abtastrate, synchronisierte Zeitstempel, Betriebskontext (Auftrag, Produkt, Anlagenzustand) und vor allem eine gelabelte Fehlerhistorie aus der Instandhaltung. Ohne Fehlerhistorie ist zunächst nur Anomalieerkennung möglich.

### Was bedeutet die Abkündigung von Defender for IoT für meine OT-Sicherheit?

Microsoft hat am 2. November 2026 offiziell mitgeteilt, die OT-Sicherheitskomponente von Defender for IoT im Oktober 2029 vollständig einzustellen; bis dahin gibt es nur noch Sicherheitsupdates und Fehlerbehebungen [22]. Ein Microsoft-Partnerblog nennt abweichend den 31. Mai 2028 als Supportende [39]. Einen Microsoft-eigenen Nachfolger gibt es nicht; Microsoft bietet Konnektoren für Armis, Dragos und Forescout an, deren Lösungen separat lizenziert werden [22]. Planen Sie die Ablösung so, dass sie vor Mitte 2028 abgeschlossen ist.

### Ist IoT Edge noch sinnvoll?

IoT Edge als Produkt ist weiterhin im Support. Version 1.5 LTS hat am 10. November 2026 ihr Supportende erreicht; die aktuelle Version 1.6 LTS ist bis zum 14. November 2028 unterstützt [12]. Für bestehende Linux-Geräteflotten ist ein Update auf 1.6 der direkte Weg. Für Windows-Geräte mit EFLOW 1.5 nennen die Release Notes keine Version 1.6; klären Sie dort den Zielpfad. Für neue Werksdatenebenen sollten Sie Azure IoT Operations prüfen.

### Was kostet Manufacturing IT auf Azure?

Eine seriöse Pauschalzahl gibt es nicht. Die Kosten hängen von Anzahl der Werke und Maschinen, Datenvolumen, Aufbewahrung, gewählter Fabric-Kapazität, Edge-Hardware und Lizenzen ab. Der wichtigste Hebel ist die Datenverdichtung am Edge. Nutzen Sie den Azure-Preisrechner und führen Sie FinOps-Praktiken ab Phase 2 ein [25].

### Welche Rolle spielt Microsoft 365 in der Fertigung?

Microsoft 365 ist die Arbeitsplatzschicht: Teams für Schichtkommunikation und Benachrichtigungen, Power BI für Kennzahlen, Power Apps für die Datenerfassung am Arbeitsplatz und Copilot für Zusammenfassungen und Fragen an Daten. Für Unternehmen mit etablierter Microsoft-365-Umgebung ist diese Verbindung oft der schnellste Weg, Shopfloor-Daten nutzbar zu machen.

### Womit fange ich als Microsoft-365- oder Azure-Admin an?

Mit den Aufgaben, die ohnehin bei der zentralen IT liegen: Entra-ID-Rollen für OT-Personal und Partner, eine Azure-Landezone mit Tag-Richtlinien je Werk, ein Arc-Testcluster samt Firewall-Freigaben durch die Proxy-Kette und eine Fabric-Workspace-Struktur. Parallel lohnt ein Termin mit der OT-Verantwortlichen, um das Zonenmodell des Werks zu verstehen. Details stehen im Abschnitt „Ihr Einstieg als Microsoft-365- oder Azure-Admin“ zu Beginn dieses Kompendiums.

---

## Fazit

Manufacturing IT auf Azure ist 2026 weniger eine Frage der Dienste-Auswahl als eine Frage der Disziplin. Die technische Basis ist klar: Azure IoT Operations auf Arc im Werk, Microsoft Fabric als Datenplattform, Foundry, Power BI und Copilot für Analyse und Arbeitsplatz. Gleichzeitig zeigen die Einstellung von Time Series Insights und der Manufacturing-Previews sowie die Abkündigung von IoT Central und der OT-Sicherheit in Defender for IoT, dass Lebenszyklusmanagement zur Architekturaufgabe gehört.

Den Unterschied machen drei Dinge: ein eigenes, werkzeugneutrales Datenmodell nach ISA-95, ein Sicherheitskonzept nach IEC 62443 mit Blick auf NIS2, und ein konsequenter Fokus auf Use Cases mit messbarer Ausgangsbasis. Wer so vorgeht, baut eine Plattform, die Predictive Maintenance, Rückverfolgbarkeit, digitale Zwillinge und KI aus derselben Datenbasis bedient und auch die nächste Umbenennung bei Microsoft übersteht.

### Weiterführend auf m365.fm

**Episoden**
- [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/)
- [FinOps for Manufacturing IT](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/)
- [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/)
- [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/)
- [Value Stream Mapping als Live-Datenmodell](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Artikel**
- [Digital Twin in Manufacturing: Where to Start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/)
- [From ERP to Shop Floor: Building the Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Aerospace Production Planning: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)

**Begriffe**
- [Industrie 4.0](https://www.m365.fm/entity/industry-4-0/) · [Digitaler Zwilling](https://www.m365.fm/entity/digital-twin/) · [ERP](https://www.m365.fm/entity/enterprise-resource-planning/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [Key Performance Indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Virtuelle Inbetriebnahme](https://www.m365.fm/entity/virtual-commissioning/)

**Geplante Kompendien (in Vorbereitung)**
- Digitaler Zwilling: `/learn/digital-twin/` (geplant)
- Produktionsplanung und APS: `/learn/produktionsplanung-aps/` (geplant)
- Produktionskennzahlen: `/learn/produktionskennzahlen/` (geplant)
- Shop Floor Management: `/learn/shop-floor-management/` (geplant)
- Operational Excellence: `/learn/operational-excellence/` (geplant)
- Produktionsplanung in der Luftfahrt: `/learn/produktionsplanung-luftfahrt/` (geplant)

---

## Autorenbox (Vorschlag)

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Gastgeber von m365.fm und arbeitet bei der [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) an der Schnittstelle von Produktionsplanung, digitalem Zwilling und Microsoft-Cloud. In Podcast und Blog übersetzt er Fertigungsthemen wie Wertstrom, Rückverfolgbarkeit und Predictive Maintenance für ein Microsoft-365- und Azure-Publikum. *Transparenzhinweis: Der Autor ist bei der iFAKT GmbH tätig.*

*Zuletzt fachlich geprüft: 20.11.2026 (Faktenprüfung gegen Microsoft-, BSI- und EU-Primärquellen). Nächste Prüfung der Dienste-Statustabelle: Februar 2027.*

---

# Quellen

Alle Quellen abgerufen am 20.11.2026.

1. What is Microsoft for Manufacturing? Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/overview
2. What's new in Microsoft for Manufacturing. Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/whats-new
3. What is Azure IoT Operations? Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/overview-iot-operations
4. What is the connector for OPC UA? (Azure IoT Operations). Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector
5. Azure IoT Operations now Generally Available. Microsoft Tech Community (IoT Blog). https://techcommunity.microsoft.com/blog/iotblog/azure-iot-operations-now-generally-available/4282445
6. Azure IoT Operations 2603 is now available: Powering the next era of Physical AI. Microsoft Tech Community (IoT Blog). https://techcommunity.microsoft.com/blog/iotblog/azure-iot-operations-2603-is-now-available-powering-the-next-era-of-physical-ai/4509342
7. Releases: Azure/azure-iot-operations. Microsoft auf GitHub. https://github.com/Azure/azure-iot-operations/releases
8. Azure IoT Central is evolving: what you need to know. Microsoft Tech Community (IoT Blog), 25.09.2026. https://techcommunity.microsoft.com/blog/iotblog/azure-iot-central-is-evolving-what-you-need-to-know/4554570
9. Microsoft Confirms Azure IoT Central Commitment. Automation World, 27.02.2024. https://www.automationworld.com/communication/article/33037810/microsoft-confirms-azure-iot-central-commitment
10. Migrating Time Series Insights Gen2 to Real-Time Intelligence in Microsoft Fabric. Microsoft Learn (archivierte Seite; neuere Fassung unter https://learn.microsoft.com/en-us/previous-versions/azure/time-series-insights/migration-to-fabric). https://learn.microsoft.com/en-us/azure/time-series-insights/how-to-tsi-gen2-migration
11. Retirement of Azure Percept DK. Microsoft Learn. https://learn.microsoft.com/en-us/azure/azure-percept/retirement-of-azure-percept-dk
12. Azure IoT Edge versions and release notes. Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-edge/version-history
13. Azure IoT Edge: Microsoft Lifecycle. Microsoft Learn. https://learn.microsoft.com/en-us/lifecycle/products/azure-iot-edge
14. What is Azure Digital Twins? Microsoft Learn. https://learn.microsoft.com/en-us/azure/digital-twins/overview
15. What is digital twin builder (preview)? Microsoft Fabric, Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/digital-twin-builder/overview
16. Ontology (preview) overview, Fabric IQ. Microsoft Learn. https://learn.microsoft.com/en-us/fabric/iq/ontology/overview
17. Connected Factory Reference Architecture. Microsoft Fabric, Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/architectures/connected-factory
18. Transform your business with Real-Time Intelligence, now generally available. Microsoft Fabric Updates Blog. https://blog.fabric.microsoft.com/fi-fi/blog/transform-your-business-with-real-time-intelligence-now-generally-available
19. What is Azure Data Explorer? Microsoft Learn (Stand 23.07.2026). https://learn.microsoft.com/en-us/azure/data-explorer/data-explorer-overview
20. What is Microsoft Foundry? Microsoft Learn. https://learn.microsoft.com/azure/foundry/what-is-foundry
21. New name for Azure Stack HCI / Azure Local. Microsoft Learn. https://learn.microsoft.com/en-us/azure/azure-local/rename-to-azure-local
22. Retirement: OT security in Microsoft Defender for IoT. Azure Updates, ID 576255, 02.11.2026. https://azure.microsoft.com/updates?id=576255 (Volltext über die Release-Communications-API: https://www.microsoft.com/releasecommunications/api/v2/azure/576255)
23. What's new in Microsoft Defender for IoT? Microsoft Learn. https://learn.microsoft.com/en-us/azure/defender-for-iot/organizations/whats-new
24. Microsoft Defender now integrates with Dragos, Forescout & Armis for OT Security. Microsoft Tech Community, Juli 2026. https://techcommunity.microsoft.com/blog/microsoftthreatprotectionblog/microsoft-defender-now-integrates-with-dragos-forescout--armis-for-ot-security/4534936
25. FinOps Framework. Microsoft Learn (Microsoft Cloud FinOps). https://learn.microsoft.com/en-us/cloud-computing/finops/framework/finops-framework
26. ISA-95 Standard. International Society of Automation (ISA). https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
27. Quick Start Guide: An Overview of ISA/IEC 62443 Standards. ISA Global Cybersecurity Alliance. https://gca.isa.org/hubfs/ISAGCA%20Quick%20Start%20Guide%20FINAL.pdf
28. Cybersicherheitsrecht: NIS-2-Umsetzungsgesetz ab morgen in Kraft. BSI, Pressemitteilung vom 05.12.2025. https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2025/251205_NIS-2-Umsetzungsgesetz_in_Kraft.html; ergänzend: Zweiter Schritt zur NIS-2-Registrierung: BSI-Portal ab sofort freigeschaltet. BSI, 06.01.2026. https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2026/260601_NIS2_BSI-Portal.html
29. Digital Product Passport (inkl. Unterseite Batteries). Europäische Kommission, GD Binnenmarkt. https://single-market-economy.ec.europa.eu/single-market/digital-product-passport_en und https://single-market-economy.ec.europa.eu/single-market/digital-product-passport/batteries_en
30. Cyber Resilience Act: Reporting obligations. Europäische Kommission. https://digital-strategy.ec.europa.eu/en/policies/cra-reporting
31. Smart Manufacturing: Unlocking Real-Time Intelligence With Azure IoT Operations and Microsoft Fabric. b.telligent. https://www.btelligent.com/en/blog/real-time-intelligence-azure-iot-microsoft-fabric
32. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource. Microsoft Tech Community (Marketplace Blog), 11.07.2024. https://techcommunity.microsoft.com/blog/marketplace-blog/learn-about-ifakt-gmbhs-isv-success-for-business-applications-solution-in-micros/4182536
33. Polaris VSM: Digital Value Stream Mapping. Microsoft Marketplace. https://marketplace.microsoft.com/en-us/product/saas/ifaktgmbh.ifakt_vsm_1?tab=overview
34. Microsoft Ignite 2025: Ten Things You Need to Know. Directions on Microsoft, 18.11.2025. https://www.directionsonmicrosoft.com/microsoft-ignite-2025-ten-things-you-need-to-know/
35. OPC 10030: ISA-95 Common Object Model, Abschnitt 4.2.3 ISA-95. OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3
36. Integration with Azure Device Registry (preview). Azure IoT Hub, Microsoft Learn. https://learn.microsoft.com/en-gb/azure/iot-hub/iot-hub-device-registry-overview
37. What is Azure Machine Learning? Microsoft Learn (Stand 09.09.2026; enthält den Hinweis zur Einstellung von Prompt flow am 20.04.2027). https://learn.microsoft.com/en-us/azure/machine-learning/overview-what-is-azure-machine-learning?view=azureml-api-2
38. Labeling images and text documents. Azure Machine Learning, Microsoft Learn (Einstellungshinweis Data Labeling zum 30.09.2026). https://learn.microsoft.com/en-us/azure/machine-learning/how-to-label-data?view=azureml-api-2
39. November update: What's new in Security for partners. Microsoft Tech Community (Partner News), 12.11.2026. https://techcommunity.microsoft.com/blog/partnernews/november-update-what%E2%80%99s-new-in-security-for-partners/4572658
40. Publish and subscribe MQTT messages using MQTT broker. Azure IoT Operations, Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/manage-mqtt-broker/overview-broker
41. Fragen und Antworten zu NIS-2. BSI. https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-regulierte-Unternehmen/NIS-2-FAQ/NIS-2-FAQ-allgemein/FAQ-zu-NIS-2.html; NIS-2-Meldepflicht. BSI. https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-regulierte-Unternehmen/NIS-2-Infopakete/NIS-2-Meldepflicht/NIS-2-Meldepflicht_node.html
42. Cyber Resilience Act. BSI. https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Cyber_Resilience_Act/cyber_resilience_act_node.html
43. OneLake Settings: Modify Immutability Policy. Fabric REST API, Microsoft Learn. https://learn.microsoft.com/en-us/rest/api/fabric/core/onelake-settings/modify-immutability-policy
44. SAP and Microsoft accelerate business insights and AI innovation with SAP Business Data Cloud Connect for Microsoft Fabric. Microsoft Fabric Blog. https://blog.fabric.microsoft.com/en-us/blog/29410
45. Link your Dataverse environment to Microsoft Fabric. Power Apps, Microsoft Learn. https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-view-in-fabric
46. Digital Omnibus on AI has been published (Verordnung (EU) 2026/1744). Cuatrecasas, Juli 2026. https://www.cuatrecasas.com/en/spain/intellectual-property/art/digital-omnibus-ai-has-been-published; ergänzend EU-Kommission, Advanced Manufacturing Transition Pathway: AI Act Digital Omnibus: high-risk deadlines postponed, machinery carved out. https://transition-pathways.europa.eu/adv-man/legislation/ai-act-digital-omnibus-high-risk-deadlines-postponed-machinery-carved-out
47. Pause and resume your capacity. Microsoft Fabric, Microsoft Learn. https://learn.microsoft.com/en-us/fabric/enterprise/pause-resume
48. SAP DM Shopfloor Integration. DSAG impulsant, 04.05.2026 (Leitfaden Stand April 2026). https://impulsant.dsag.de/formate/textbeitrag/sap-dm-shopfloor-integration-english/

---

# Prüfhinweise für die Redaktion

### 1. Offene Prüfpunkte (nach Review-Runde 3)

Alle früheren [ungeprüft]-Marker im Artikel wurden aufgelöst: belegt, präzisiert oder in den Text als offene Frage eingearbeitet. Offen bleiben:

| Stelle im Text | Was zu prüfen ist |
|---|---|
| Defender for IoT: Supportende 31.05.2028 (Partnerblog [39]) vs. Einstellung Oktober 2029 (Azure Updates [22]) | Widerspruch bei Microsoft klären (Partner-Center-Ansprechpartner oder Microsoft Learn „What's new“ beobachten). Der Artikel nennt beide Daten und empfiehlt, mit dem früheren zu planen. Die Message-Center-Meldung MC1526670 (laut Spiegelseiten vom 26.10.2026, Oktober 2029) wurde nicht im Original eingesehen. |
| Azure IoT Operations Release 2610 / Essentials | Laut Microsoft Learn [3] bestätigt; die GitHub-Releaseseite [7] zeigte beim Abruf am 20.11.2026 als jüngsten Eintrag 2608 (v1.4.73). Bei Veröffentlichung abgleichen. |
| Manufacturing data solutions in Microsoft Fabric | Microsoft schließt die Fabric-Variante in den Einstellungsmitteilungen weder ein noch aus. Status bei Microsoft (MDSsupport@microsoft.com) erfragen. |
| IATF 16949 (8.5.2.1, 7.5.3.2.1) und EN 9100 (8.5.2) | Normtexte sind kostenpflichtig; Angaben nach Sekundärquellen (u. a. Fachforen, OEM-CSR). Vor Veröffentlichung mit Normtext oder einer QM-Fachperson abgleichen. |
| EU AI Act / Digital Omnibus (Verordnung (EU) 2026/1744) | Daten (02.12.2027, 02.08.2028) aus Kanzlei-Zusammenfassung und EU-Transition-Pathway-Seite [46]; EUR-Lex-Volltext war per Proxy nicht vollständig lesbar. Im Amtsblatt gegenprüfen. |
| NIS2: Sektorliste aus Anlage 2 BSIG | Aus NIS2-Anhang II abgeleitet; die BSI-FAQ [41] verweist nur auf die Anlagen. Gegen Anlage 2 BSIG (gesetze-im-internet.de) prüfen. |
| CRA: Datum 11.12.2027 | Durch BSI [42] belegt; EUR-Lex-Artikel 71 war technisch nicht abrufbar. Optional im Amtsblatt gegenprüfen. |
| SAP Business Data Cloud Connect for Microsoft Fabric | GA war für Q3 2026 angekündigt [44]; tatsächliche Verfügbarkeit prüfen. |
| „Microsoft Cloud for Manufacturing“ als früherer Name | Die aktuelle Learn-Übersicht [1] nennt den alten Namen nicht mehr (nur interne Metadaten). Historisch korrekt, aber ohne aktuelle Microsoft-Quelle. |
| Batteriepass: Schwelle „mehr als 2 kWh“ für Industriebatterien | Die Kommissionsseite [29] nennt die Kategorien ohne Schwelle; die Schwelle stammt aus Art. 77 der Batterieverordnung. Optional im Verordnungstext gegenprüfen. |
| Wettbewerbstabelle: azure.microsoft.com/…/discrete-manufacturing/ | Wortzahl geschätzt, Seite nicht vollständig gelesen |

### 2. Status-Aussagen mit Wiedervorlage

| Aussage | Stand | Wiedervorlage |
|---|---|---|
| Azure IoT Operations aktuell Release 2610 (1.5.x), SKU „Essentials“ ohne OPC-UA-Konnektor, nur Single-Node | Nov. 2026 [3], [7] | Monatlich (Release-Zyklus) |
| IoT Central: Neuanlage gesperrt seit 23.09.2026, Ende 20.09.2029 | [8] (Microsoft-Blog vom 25.09.2026, geprüft) | Halbjährlich |
| IoT Edge 1.6 LTS bis 14.11.2028; 1.5 und EFLOW 1.5 seit 10.11.2026 ohne Support; keine EFLOW 1.6 gelistet | [12] (geprüft) | Halbjährlich, EFLOW-Nachfolge und Ankündigung 1.7 beobachten |
| Defender for IoT OT-Sicherheit: Einstellung Oktober 2029 (Azure Updates ID 576255 vom 02.11.2026, Primärquelle geprüft); Partnerblog nennt 31.05.2028 | [22], [39] | Monatlich, bis der Widerspruch geklärt ist |
| Digital twin builder und Fabric IQ Ontology in Preview; alte Ontologie-Oberfläche endet 31.01.2027 | [15], [16] (geprüft) | Quartalsweise, insbesondere nach FabCon und Ignite |
| Azure Digital Twins ohne Abkündigung | [14] (sichtbarer Stand der Seite 28.01.2025, Metadaten 11.08.2026) | Quartalsweise |
| Azure Data Explorer aktiv | [19] (Microsoft Learn, Stand 23.07.2026) | Halbjährlich |
| Microsoft Foundry als aktueller Name; „Foundry Tools“ | [20] (geprüft) | Halbjährlich |
| Prompt flow Einstellung 20.04.2027; Azure ML Data Labeling eingestellt 30.09.2026 | [37], [38] | Halbjährlich |
| NIS2UmsuCG in Kraft seit 06.12.2025; BSI-Portal seit 06.01.2026 | [28] (BSI, Primärquelle) | Jährlich |
| CRA: Meldepflicht seit 11.09.2026, volle Anwendung 11.12.2027 | [30], [42] (EU-Kommission, BSI) | Jährlich |
| DPP: EU-Register seit 20.07.2026, Batteriepass ab 18.02.2027, Eisen und Stahl Q4 2026 | [29] (EU-Kommission; Zeitplan indikativ) | Halbjährlich |
| AI Act: Hochrisiko-Fristen 02.12.2027 bzw. 02.08.2028 | [46] | Halbjährlich |

**Korrektur gegenüber Briefing:** Azure Time Series Insights wurde laut Microsoft am **7. Juli 2024** eingestellt, nicht 2025 [10]. Die im Briefing genannte „IoT Central Retirement-Ankündigung“ ist inzwischen konkret (Ende 20.09.2029) [8]; die ältere, im Februar 2024 im Azure-Portal angezeigte Meldung (Ende 31.03.2027) hat Microsoft damals als fehlerhafte Systemmeldung zurückgezogen [9].

### 3. Linktexte prüfen

Die Linktexte zu den m365.fm-Episoden und -Artikeln sind beschreibend formuliert, da die Seiten per Proxy nicht abrufbar waren. Bitte an die tatsächlichen Episoden- und Artikeltitel angleichen. Die geplanten Schwester-Pillars sind bewusst nicht verlinkt, sondern als Pfad mit „(geplant)“ aufgeführt; nach Veröffentlichung verlinken.

### 4. iFAKT-Abschnitt

- Kennzeichnung des iFAKT-Abschnitts laut Entscheidung von Mirko (20.11.2026): nur „Der Autor arbeitet bei der iFAKT GmbH“, kein Partnerschaftshinweis; Transparenzhinweis in der Autorenbox bleibt.
- Der Claim „AI + Digital Twin for Production“ aus dem Briefing wurde im Review gestrichen, weil er nur aus dem Briefing belegt war; der Text nutzt die Herstellerbeschreibung von ifakt.de („Digitize, simulate and optimize your production“). Falls iFAKT den Claim wünscht, bitte mit Quelle nachreichen.
- Im Review ergänzt: vier herstellerneutrale Auswahlfragen für Fachanwendungen, damit der Abschnitt auch ohne Polaris-Interesse Nutzen stiftet.
- Der Marketplace-Eintrag [33] war beim Abruf technisch nicht lesbar (nur über Suchtreffer und [32] belegt). Bitte Eintrag manuell öffnen und Angebotsform (SaaS) bestätigen; ggf. Einträge für weitere Module (z. B. Polaris BSM) ergänzen.
- Es werden bewusst keine Aussagen über eine technische Azure-Integration von Polaris gemacht.

### 5. Schema-Vorschlag (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://www.m365.fm/learn/manufacturing-it-azure/#article",
      "headline": "Manufacturing IT auf Microsoft Azure: Das Kompendium für Fertigungsunternehmen",
      "description": "Architektur, Dienste-Status, Predictive Maintenance, Traceability, Digitale Zwillinge, FinOps und KI für die Fertigung auf Microsoft Azure.",
      "inLanguage": "de-DE",
      "datePublished": "2026-11-20",
      "dateModified": "2026-11-20",
      "author": {
        "@type": "Person",
        "name": "Mirko Peters",
        "url": "https://www.m365.fm/entity/mirko-peters/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "m365.fm",
        "url": "https://www.m365.fm/"
      },
      "mainEntityOfPage": "https://www.m365.fm/learn/manufacturing-it-azure/",
      "about": [
        {"@type": "Thing", "name": "Microsoft Azure"},
        {"@type": "Thing", "name": "Industrie 4.0", "url": "https://www.m365.fm/entity/industry-4-0/"},
        {"@type": "Thing", "name": "Digitaler Zwilling", "url": "https://www.m365.fm/entity/digital-twin/"}
      ],
      "mentions": [
        {"@type": "SoftwareApplication", "name": "Azure IoT Operations"},
        {"@type": "SoftwareApplication", "name": "Microsoft Fabric"},
        {"@type": "SoftwareApplication", "name": "Polaris", "url": "https://www.m365.fm/entity/polaris/"}
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.m365.fm/learn/manufacturing-it-azure/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Wird Azure IoT Central eingestellt?",
          "acceptedAnswer": {"@type": "Answer", "text": "Ja. Seit dem 23. September 2026 können keine neuen IoT-Central-Anwendungen angelegt werden; bestehende Anwendungen laufen bis zum 20. September 2029."}
        },
        {
          "@type": "Question",
          "name": "Was bedeutet die Abkündigung von Defender for IoT für meine OT-Sicherheit?",
          "acceptedAnswer": {"@type": "Answer", "text": "Microsoft hat am 2. November 2026 mitgeteilt, die OT-Sicherheitskomponente von Defender for IoT im Oktober 2029 vollständig einzustellen; ein Microsoft-Partnerblog nennt abweichend den 31. Mai 2028 als Supportende. Einen Microsoft-eigenen Nachfolger gibt es nicht; Microsoft bietet Konnektoren für Armis, Dragos und Forescout."}
        },
        {
          "@type": "Question",
          "name": "Gibt es Azure Time Series Insights noch?",
          "acceptedAnswer": {"@type": "Answer", "text": "Nein. Time Series Insights wurde am 7. Juli 2024 eingestellt. Microsoft verweist auf das Eventhouse in Microsoft Fabric Real-Time Intelligence."}
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Learn", "item": "https://www.m365.fm/learn/"},
        {"@type": "ListItem", "position": 2, "name": "Manufacturing IT auf Azure", "item": "https://www.m365.fm/learn/manufacturing-it-azure/"}
      ]
    }
  ]
}
```

Hinweis: FAQPage-Markup mit allen 15 Fragen aus dem Artikel befüllen (insbesondere die neuen Fragen zu Industrie-4.0-Diensten, Essentials vs. Standard und zum Einstieg für Admins). Google zeigt FAQ-Rich-Results nur noch eingeschränkt an; das Markup schadet nicht, sollte aber nicht der Grund für die FAQ sein.

---

## Review-Protokoll

Review- und Optimierungsschleife am 20.11.2026 mit fünf Rollen. Sicherung der Ausgangsfassung: `manufacturing-it-azure.v1.md` (Scratchpad der Sitzung). Drei Runden; nach Runde 3 waren alle Rollen zufrieden.

### Runde 1: Befunde zur Ausgangsfassung

- **Fachexperte Manufacturing IT / Azure-Architekt (nicht zufrieden):** Architektur solide, aber praxisrelevante Lücken: Die SKU „Essentials“ ohne OPC-UA-Konnektor wurde nur als Kostenhebel erwähnt, nicht als Architekturfalle; der Broker-Plattenpuffer ist nur bei der Erstbereitstellung konfigurierbar; EFLOW (IoT Edge unter Windows) fehlte; die Einbindung eines bestehenden UNS-Brokers und eine Mittelstands-Variante fehlten. „Akri-Discovery“ war dem OPC-UA-Konnektor falsch zugeordnet.
- **SEO-Spezialist (nicht zufrieden):** Hauptkeyword „Azure Fertigung“ fehlte in Meta-Title, Kurzantwort und den H2; mehrere H2 waren generisch („Roadmap“, „Business Case“, „Typische Fehler“). FAQ deckte die Suchanfragen „Welche Azure-Dienste für Industrie 4.0“ und „Essentials vs. Standard“ nicht ab. Interne Links in Ordnung, Linktexte weiterhin an echte Titel anzugleichen.
- **Leser aus der Zielgruppe (nicht zufrieden):** Für einen M365-/Azure-Admin zu viel OT-Jargon ohne Erklärung (SPS, MES, OEE, Conduits); unklar, was die zentrale IT konkret beitragen kann. Der IT-Leiter Mittelstand vermisste eine kleine Einstiegsvariante und ein greifbares Rechenbeispiel.
- **Faktenprüfer (nicht zufrieden):** Defender-for-IoT-Abkündigung nur über eine Spiegelseite belegt; Time-Series-Insights-Migration nach ADX Microsoft zugeschrieben, obwohl Microsoft nur das Eventhouse nennt; MQTT-Versionen und IoT-Hub-Integration der Device Registry mit falschen Quellen belegt; „abgekündigt“ für bereits eingestellte Previews; NIS2, CRA und DPP nur über Sekundärquellen (usd AG, IHK, Handelskammer); 13 [ungeprüft]-Stellen offen.
- **Kritiker (nicht zufrieden):** Mehrere unbelegte Pauschalaussagen („die meisten Projekte scheitern“, „meistgesuchter Use Case“, „hat sich bewährt“, „deckt sich mit eigenen Erfahrungen“); Seitenhieb auf „die Wettbewerber“ im Artikeltext; Werbeclaim „AI + Digital Twin for Production“ nur aus dem Briefing; Roadmap-Zeitangabe „ab Monat 9“ passt nicht zur Summe der Phasen (bis ca. 14 Monate); Defender-Information redundant über vier Stellen verteilt.

**Diskussion und Entscheidungen:** SEO wollte mehr Keyword-Wiederholungen, der Kritiker warnte vor Keyword-Stuffing. Entscheidung: Hauptkeyword in Meta-Title, Kurzantwort, Einleitung und fünf H2, keine weiteren Wiederholungen im Fließtext. Der Leser wollte ein Glossar am Anfang, der Fachexperte fürchtete eine Verwässerung. Entscheidung: kompaktes Glossar als Tabelle mit IT-Vergleich, klar als Einstiegshilfe für Admins benannt. Beim Defender-Widerspruch (2028 vs. 2029) wollte der Kritiker nur ein Datum; der Faktenprüfer bestand auf beiden. Entscheidung: beide Daten mit Quelle nennen, Empfehlung auf das frühere Datum ausrichten.

### Optimierung 1: Was sich geändert hat

**Korrigierte oder präzisierte Fakten (alt → neu):**
- Defender for IoT OT: Beleg über Spiegelseite (mc.merill.net) → Primärquelle Azure Updates ID 576255 vom 02.11.2026 (über die Microsoft-Release-Communications-API im Volltext gelesen). Bestätigt: Einstellung Oktober 2029, dreijährige Übergangsphase, nur noch Sicherheitsupdates, Verträge bis Oktober 2029, Enterprise IoT nicht betroffen, Konnektoren für Armis, Dragos, Forescout. **Neu entdeckt:** Ein Microsoft-Partnerblog vom 12.11.2026 nennt den 31.05.2028 als Supportende und „keinen First-Party-Ersatz“. Empfehlung von „Ablösung 2027/2028“ → „vor Mitte 2028 abschließen“.
- Manufacturing data solutions, Factory Operations Agent, Factory Safety Agent: „abgekündigt zum“ → „eingestellt zum“ 30.05.2025 bzw. 23.06.2025 (Ankündigung Februar bzw. Mai 2025). Fabric-Variante: „[ungeprüft]“ → „Status unklar, von den Mitteilungen weder ein- noch ausgeschlossen“.
- „innerhalb von rund 13 Monaten“ → „in gut einem Jahr“ (genaue Preview-Dauer nicht belegbar).
- Time Series Insights: „Migration zu Fabric Eventhouse oder ADX“ → Microsoft nennt nur das Eventhouse; ADX als eigene Alternative mit KQL gekennzeichnet. Datum 07.07.2024 bestätigt.
- IoT Central: 23.09.2026 / 20.09.2029 bestätigt (Microsoft-Blog 25.09.2026); Rücknahme 2024 präzisiert: fehlerhafte Systemmeldung vom 14.02.2024 mit Enddatum 31.03.2027, von Microsoft zurückgezogen.
- IoT Edge: 1.5 EOS 10.11.2026, 1.6 LTS (Juli 2026) bis 14.11.2028 bestätigt. Neu: EFLOW 1.5 hat dasselbe Supportende, eine EFLOW 1.6 ist nicht gelistet.
- Azure IoT Operations: Essentials (nur Single-Node, ohne OPC-UA-Konnektor), Release 2610 / 1.5.x und 72 Stunden offline („höchstens“, ggf. mit Einschränkungen) per Microsoft Learn bestätigt. MQTT 3.1.1/5 neu mit Broker-Dokumentation belegt; „Akri-Discovery“ beim OPC-UA-Konnektor → automatische Asset-Erkennung durch den Konnektor; „Deadband“ → änderungsbasiertes Senden laut Doku, Deadband als Empfehlung für Steuerung/Server.
- Azure Device Registry: IoT-Hub-Integration (Preview) nun mit IoT-Hub-Doku belegt statt mit [8].
- Fabric IQ Ontology: Preview und Ende der alten Oberfläche am 31.01.2027 bestätigt, Migrationspflicht ergänzt. Digital twin builder: Preview, eigenes Produkt, Lakehouse-Voraussetzung bestätigt.
- Microsoft Foundry: Name und „Foundry Tools“ bestätigt. Azure Machine Learning: [ungeprüft] → Positionierung laut Learn (Foundry für generative KI, Azure ML für ML/MLOps). Neu: Prompt flow endet 20.04.2027, Azure ML Data Labeling eingestellt 30.09.2026.
- Microsoft for Manufacturing: Factory-Szenarien an die vier offiziellen Szenarien angepasst; Fabric als Plattform für den digitalen Faden ergänzt.
- Engineering-Zwilling: „Siemens NX und Ansys auf Azure-GPU-VMs“ → „Siemens NX auf Azure Virtual Desktop mit GPU-VMs, Ansys Discovery auf GPU-VMs“.
- Azure Data Explorer: Drittquelle (Directions on Microsoft) → Microsoft Learn; „gleiche Kusto-Engine“ → „nutzt ebenfalls KQL“.
- NIS2: usd AG → BSI (Pressemitteilungen, FAQ, Meldepflicht-Seite). Ergänzt: rund 29.500 Einrichtungen, zweistufige Registrierung, Fristen 24 h / 72 h / ein Monat, Selbsteinschätzung. „Ohne Übergangsfrist“ gestrichen, da so nicht in der BSI-Quelle.
- CRA: Handelskammer → EU-Kommission und BSI; 11.12.2027 von [ungeprüft] zu belegt; Fristen 72 h und Abschlussberichte ergänzt.
- DPP/Batteriepass: IHK → EU-Kommission; Register 20.07.2026 bestätigt (zunächst Testumgebung), Batteriepass 18.02.2027 bestätigt, 18-Monats-Übergangsfrist ergänzt.
- EU AI Act: [ungeprüft] → Fristverschiebung durch Verordnung (EU) 2026/1744 (02.12.2027 bzw. 02.08.2028; Maschinen über Maschinenverordnung) mit Quelle, Amtsblatt-Prüfung als offen vermerkt.
- IATF 16949 / EN 9100: [ungeprüft] → präzisierte Abschnitte (8.5.2.1, 7.5.3.2.1, 8.5.2) mit Hinweis auf Sekundärquellen.
- Fabric-Kapazität pausieren: [ungeprüft] → für F-SKUs dokumentiert, mit Nebenwirkungen. OneLake-WORM: [ungeprüft] → Unveränderbarkeitsrichtlinie gilt nur für Diagnoseprotokolle, daher Blob Storage WORM empfohlen. Dynamics 365 „Link to Microsoft Fabric“ bestätigt. SAP: konkrete Optionen inkl. SAP Business Data Cloud Connect ergänzt. DSAG-Leitfaden: Datum und Inhaltsbereiche belegt.

**Neue Abschnitte:** „Fertigungsbegriffe für Microsoft-365- und Azure-Admins“ (Glossar), „Ihr Einstieg als Microsoft-365- oder Azure-Admin“, Absatz zur Einbindung bestehender UNS-Broker, Variante „Kleiner Einstieg (Mittelstand)“, „Predictive Maintenance mit Azure: Bausteine im Überblick“, „Rechenbeispiel mit fiktiven Werten“, herstellerneutrale Auswahlfragen für Fachanwendungen, Fehler Nr. 4 „Falsche SKU“, drei neue FAQ-Fragen.

**Gestrichen oder entschärft:** Seitenhieb auf Wettbewerber im Business Case; Claim „AI + Digital Twin for Production“; „deckt sich mit eigenen Erfahrungen“; „die meisten“, „meistgesucht“, „hat sich bewährt“, „erfahrungsgemäß“.

**SEO-Änderungen:** Meta-Title „Azure in der Fertigung: Manufacturing IT Kompendium 2026“ (56 Zeichen), neue Meta-Description (145 Zeichen) mit Stand-Datum; Kurzantwort mit Hauptkeyword und Eingrenzung eingestellt vs. abgekündigt; „Azure Industrie 4.0“ in der Einleitung; fünf H2 mit Keywords (Datenmodell, Referenzarchitektur, Predictive Maintenance mit Azure, Business Case, Roadmap, Typische Fehler) samt angepasster Sprungmarken im Inhaltsverzeichnis; FAQ von 12 auf 15 Fragen; JSON-LD um die Defender-Frage ergänzt; sekundäre Suchanfragen in den Metadaten.

### Runde 2: Prüfung der geänderten Fassung

- **Fachexperte (zufrieden mit Vorbehalt):** Essentials-Falle, Broker-Puffer, EFLOW und UNS-Bridging sind sauber eingebaut. Wunsch: Offline-FAQ mit dem Pufferthema verknüpfen.
- **SEO-Spezialist (zufrieden):** Keyword-Abdeckung und H-Struktur passen; FAQ-Hinweis im Schema-Abschnitt war noch auf 12 Fragen gestellt.
- **Leser (zufrieden mit Vorbehalt):** Glossar und Admin-Einstieg helfen deutlich. Der NIS2-Absatz ist als Fließtext schwer scanbar; Lizenzfrage für Shopfloor-Mitarbeitende fehlt.
- **Faktenprüfer (Stichprobe, nicht zufrieden):** NIS2-Sektorliste war der BSI-FAQ zugeschrieben, die nur auf die Anlagen verweist; Meldefristen gegen die BSI-Meldepflicht-Seite geprüft und bestätigt (Erstmeldung 24 h, Folgemeldung 72 h, Abschlussmeldung spätestens einen Monat nach Meldung). „Kein Microsoft-Nachfolger“ brauchte eine Quelle.
- **Kritiker (zufrieden mit Vorbehalt):** Ton deutlich sachlicher; Restfloskeln „bewährtes Muster“ und „erfahrungsgemäß“ im neuen Admin-Abschnitt.

### Optimierung 2: Was sich geändert hat

- NIS2: Sektorliste als Ableitung aus Anlage 2 BSIG formuliert, Schwellenwerte § 28 BSIG zugeordnet, Pflichten als Liste, Meldestufen mit BSI-Begriffen; Betroffenheit als Selbsteinschätzung mit unverbindlicher BSI-Prüfung.
- „Kein Microsoft-eigener Nachfolger“ mit Partnerblog [39] belegt.
- Offline-FAQ um den Broker-Puffer ergänzt; Fehler Nr. 10 nennt den nur bei Erstbereitstellung konfigurierbaren Puffer.
- Neuer Punkt „Lizenzen früh klären“ (Frontline-Lizenzen F1/F3) im Abschnitt Microsoft 365 als Brücke.
- „bewährtes Muster“ → „verbreitetes Muster“, „erfahrungsgemäß“ → „in vielen Unternehmen“, „Abkündigung“ → „Einstellung“ bei den Manufacturing-Previews in der Fehlerliste.
- Schema-Hinweis auf 15 FAQ-Fragen aktualisiert.

### Runde 3: Abschlussprüfung

- **Fachexperte:** zufrieden. Architektur und Statustabelle sind konsistent; offene Punkte (Fabric-Variante der MDS, GitHub-Stand 2608 vs. Learn 2610) sind transparent dokumentiert.
- **SEO-Spezialist:** zufrieden. Wettbewerbs- und Wortzahlangaben in den Metadaten an die neue Länge angepasst (Artikel rund 10.200 Wörter); offen bleibt nur das Angleichen der m365.fm-Linktexte.
- **Leser:** zufrieden. Der Einstieg für Admins, das Glossar, die Mittelstands-Variante und das Rechenbeispiel machen den Text auch ohne Fertigungshintergrund nutzbar.
- **Faktenprüfer:** zufrieden mit dokumentierten Restpunkten. Alle Status-Aussagen sind gegen Microsoft-Primärquellen geprüft; Regulierung stützt sich auf BSI und EU-Kommission. Offen: Defender-Widerspruch 2028/2029, Normtexte IATF/EN 9100, AI-Act-Omnibus und Anlage 2 BSIG im Originaltext.
- **Kritiker:** zufrieden. Keine unbelegten Superlative mehr, iFAKT-Abschnitt sachlich und um neutrale Auswahlkriterien ergänzt. Das Spannungsfeld zwischen Autorenrolle bei iFAKT und der Kennzeichnung „Bezahlte Partnerschaft“ ist als redaktioneller Prüfpunkt festgehalten.

### Endurteil

| Rolle | Urteil |
|---|---|
| Fachexperte Manufacturing IT / Azure-Architekt | Zufrieden |
| SEO-Spezialist | Zufrieden |
| Leser aus der Zielgruppe | Zufrieden |
| Faktenprüfer | Zufrieden, Restpunkte in den Prüfhinweisen (Abschnitt 1) |
| Kritiker / Advocatus Diaboli | Zufrieden |

**Konsistenz-Check 20.11.2026:** Schwester-Liste um Produktionsplanung in der Luftfahrt (`/learn/produktionsplanung-luftfahrt/`, geplant) ergänzt. Autorenbox, Offenlegung und Dienste-Status (Azure IoT Operations, digital twin builder in Preview, Defender for IoT, IoT Central) mit den Schwesterartikeln abgeglichen, kein weiterer Änderungsbedarf.
