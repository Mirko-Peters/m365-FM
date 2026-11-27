# SEO metadata

| Field | Value |
|---|---|
| Meta title | Azure voor productie: de architectuurgids 2026 |
| Meta description | Azure voor productie in 2026: servicestatus, referentiearchitectuur, OT-beveiliging (IEC 62443, NIST CSF 2.0), traceerbaarheid, AI en FinOps. |
| Slug | `manufacturing-it-azure` |

# Azure voor productie: de complete gids voor productie-IT op Microsoft Azure (november 2026)

**Kort antwoord:** Eind 2026 bestaat Azure voor de maakindustrie uit drie lagen: Azure IoT Operations op Azure Arc-enabled Kubernetes in de fabriek, Microsoft Fabric (Real-Time Intelligence en OneLake) als dataplatform, en Microsoft Foundry, Power BI en Copilot voor analyse, AI en de werkplek. Oudere bouwstenen zijn uitgefaseerd (Time Series Insights, de manufacturing agent-previews) of staan gepland voor uitfasering (IoT Central in 2029, OT-beveiliging in Defender for IoT). Het succes hangt minder af van de diensten dan van het bezitten van je eigen datamodel, een OT-beveiligingsontwerp dat is afgestemd op ISA/IEC 62443 en NIST-richtlijnen, en het kiezen van use cases met een gemeten uitgangspunt.

**Belangrijkste punten**

- Plan nieuwe fabrieksaansluitingen op **Azure IoT Operations**, niet op IoT Central of zelfgebouwde IoT Edge-modulketens. Kies de **Standard**-SKU als je machines OPC UA spreken; Essentials bevat de OPC UA-connector niet.
- Gebruik **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator) voor tijdreeksdata. Time Series Insights is op 7 juli 2024 uitgefaseerd.
- Houd bedrijfslogica uit de buurt van previewdiensten. Microsoft heeft zijn previews van het productiedatamodel en de fabriek-agent in 2025 uitgefaseerd, ongeveer een jaar na de lancering.
- Plan nu de vervanging van je **OT-monitoring**. Microsoft zal OT-beveiliging in Defender for IoT in oktober 2029 volledig uitfaseren; een blog van een Microsoft-partner noemt 31 mei 2028 als einde van de ondersteuning.
- Koppel je beveiligingsprogramma aan **ISA/IEC 62443** (zones en conduits) en **NIST CSF 2.0**; defensieleveranciers hebben daarnaast **CMMC** nodig voor systemen die FCI of CUI verwerken.
- Begin met use cases die een uitgangspunt en een eigenaar hebben: realtime OEE en traceerbaarheid leveren meestal eerder rendement op dan predictive maintenance.

## Inhoudsopgave

1. [Wat Azure voor de maakindustrie vandaag betekent](#wat-azure-voor-de-maakindustrie-vandaag-betekent)
2. [Status van Azure-diensten voor de maakindustrie, november 2026](#status-van-azure-diensten-voor-productie-november-2026)
3. [Eerst het datamodel: ISA-95 en de unified namespace](#eerst-het-datamodel-isa-95-en-de-unified-namespace)
4. [Azure-referentiearchitectuur voor de maakindustrie](#azure-referentiearchitectuur-voor-de-maakindustrie)
5. [IT/OT-convergentie en beveiliging: ISA/IEC 62443, NIST CSF 2.0, CMMC en NIS2](#itot-convergentie-en-beveiliging)
6. [Use case 1: Predictive maintenance op Azure](#use-case-1-predictive-maintenance-op-azure)
7. [Use case 2: Traceerbaarheid en genealogie](#gebruiksscenario-2-traceerbaarheid-en-genealogie)
8. [Use case 3: Digital twins](#use-case-3-digital-twins)
9. [Use case 4: Realtime KPI's, OEE en waardestromen](#use-case-4-realtime-kpis-oee-en-waardestromen)
10. [ERP- en MES-integratie: SAP, Dynamics 365 en de datastroom op de werkvloer](#erp--en-mes-integratie)
11. [AI en Copilot in de maakindustrie: wat realistisch is](#ai-en-copilot-in-de-maakindustrie)
12. [FinOps voor IT in de maakindustrie](#finops-voor-industriële-it)
13. [Het businesscase opstellen voor Azure in de maakindustrie](#het-businesscase-opstellen-voor-azure-in-de-maakindustrie)
14. [Routekaart: vijf fasen naar een schaalbaar Azure-platform voor de maakindustrie](#roadmap-vijf-fasen-naar-een-schaalbaar-azure-platform-voor-de-maakindustrie)
15. [Veelgemaakte fouten in Azure-projecten voor de maakindustrie](#veelvoorkomende-fouten-in-azure-productieprojecten)
16. [Toepassingen voor de industrie in het Microsoft-ecosysteem: het voorbeeld van iFAKT Polaris](#industrietoepassingen-in-het-microsoft-ecosysteem)
17. [FAQ](#faq)
18. [Conclusie](#conclusie)

---

## Wat Azure voor de maakindustrie vandaag betekent

Vijf jaar geleden leverde een zoekopdracht naar "Azure for manufacturing" of "Azure IoT for manufacturing" een bekende lijst op: IoT Hub, IoT Edge, Stream Analytics, Time Series Insights en Synapse. Die lijst beschrijft de situatie in 2026 niet meer. Microsoft heeft zijn industriële IoT-strategie in drie richtingen herbouwd:

1. **Edge in plaats van device:** Dataverzameling in de fabriek draait nu op **Azure IoT Operations**, een set dataservices op Kubernetes-clusters die vanuit de cloud worden beheerd via **Azure Arc**. Microsoft beschrijft de service als een "unified data plane for the edge" [3]. General availability werd aangekondigd in november 2024 [5].
2. **Dataplatform in plaats van puntdiensten:** Tijdreeksen, gebeurtenissen en stamdata komen terecht in **Microsoft Fabric**, in het bijzonder in Real-Time Intelligence met Eventstream, Eventhouse en Activator. Microsoft heeft Time Series Insights uit dienst genomen en verwijst klanten naar het Fabric Eventhouse als migratiedoel [10].
3. **Platform in plaats van kant-en-klare applicatie:** Op het gebied van IoT en maakindustrie trekt Microsoft zich terug uit zijn eigen voorgeconfigureerde applicaties. IoT Central accepteert sinds 23 september 2026 geen nieuwe applicaties meer en wordt op 20 september 2029 uitgefaseerd [8], [64]. De branchespecifieke previews "Manufacturing data solutions" en "Factory Operations Agent" zijn op 30 mei 2025 uit dienst genomen [2].

Het branche-aanbod heet nu **Microsoft for Manufacturing** (voorheen "Microsoft Cloud for Manufacturing"). Microsoft ordent het in vier oplossingsgebieden: digitale engineering, veerkrachtige supply chains, intelligente fabrieken en verbonden klanten [1]. Voor de intelligente fabriek noemt Microsoft vier scenario's: edge en infrastructuur moderniseren, operaties optimaliseren met AI, de medewerkers verbinden en versterken, en onderhoud en kwaliteit [1]. Microsoft wijst Fabric aan als platform voor de "digital thread" [1].

Voor u als leider van IT, OT of digitale transformatie betekent dit dat de bouwstenen generieker zijn geworden en dat meer van de verantwoordelijkheid voor het datamodel, de integratie en de operatie bij u of uw partners ligt. Deze gids laat zien hoe u die verantwoordelijkheid gestructureerd kunt dragen. Ze verbindt Azure-technologie met de onderwerpen die het succes bepalen: het datamodel, beveiliging, [Industry 4.0](https://www.m365.fm/entity/industry-4-0/) als organisatorisch onderwerp, KPI's en kosten.

### Voor wie deze gids is

- **IT-leiders en cloudteams** die al Microsoft 365 en Azure gebruiken en gevraagd zijn de fabrieken te verbinden.
- **OT- en automatiseringsingenieurs** die willen begrijpen wat Kubernetes, MQTT en Fabric voor hun apparatuur betekenen.
- **Fabriek-, kwaliteits- en onderhoudsmanagers** die use cases zoals predictive maintenance of traceerbaarheid evalueren.
- **Finance- en inkoopteams** die cloudkosten in de maakindustrie voorspelbaar moeten maken.

### Begrippen uit de maakindustrie voor Microsoft 365- en Azure-beheerders

Als u uit de corporate IT komt, brengen productieprojecten een eigen vocabulaire mee. Hier zijn de kernbegrippen die in deze gids worden gebruikt, elk in één zin:

| Term | Betekenis | Dichtstbijzijnde IT-analogie |
|---|---|---|
| **OT** (operational technology) | Technologie die fysieke processen aanstuurt: machines, besturingen, regelsystemen | Als een apart datacenter waarbij een storing de productie stilzet |
| **PLC** (programmable logic controller) | Industriële computer die een machine in realtime aanstuurt | Een embedded systeem met een levensduur van 15 jaar of langer |
| **SCADA** | Supervisory-systeem voor het bewaken en bedienen van meerdere machines of lijnen | Een monitoringconsole met schrijfrechten |
| **MES** (manufacturing execution system) | Stuurt en registreert de uitvoering van productieorders in de fabriek | Een workflowsysteem tussen ERP en machine |
| **OPC UA** | Leveranciersonafhankelijke industriële standaard voor gegevensuitwisseling, met informatiemodel en ingebouwde beveiliging | REST-API plus schema plus certificaten, voor machines |
| **MQTT** | Lichtgewicht publish/subscribe-protocol | Een berichtenbus, vergelijkbaar met Event Grid- of Service Bus-topics |
| **Unified namespace (UNS)** | Centrale, hiërarchische gebeurtenisstructuur waarin alle systemen hun actuele status publiceren | Een bedrijfsbrede topicdirectory |
| **OEE** (overall equipment effectiveness) | Effectiviteit van apparatuur op basis van beschikbaarheid, prestatie en kwaliteit | Een beschikbaarheids-SLA, maar voor machines en inclusief kwaliteit |
| **KQL** (Kusto Query Language) | Querytaal van Fabric Eventhouse en Azure Data Explorer | Dezelfde taal die je gebruikt in Log Analytics en Microsoft Sentinel |
| **Purdue-model** | Referentiemodel dat fabrieksystemen in lagen indeelt, van veldapparaten tot de onderneming; ISA-95 bouwt hierop voort [26] | Een netwerkmodel met lagen, van het apparaat-VLAN tot het WAN van het bedrijf |

De KQL-rij is een goed startpunt voor beheerders: als je KQL kent van Sentinel of Log Analytics, kun je direct machinegegevens in een Eventhouse bevragen.

### Waar te beginnen als Microsoft 365- of Azure-beheerder

Je hoeft geen automatiseringsingenieur te worden om waarde toe te voegen aan een productieproject. Vijf taken liggen doorgaans bij de centrale IT en kunnen worden voorbereid voordat de eerste machine wordt aangesloten:

1. **Identiteiten en rollen:** Maak Microsoft Entra ID-groepen en Azure RBAC-rollen aan voor OT-medewerkers, partners en productieteams; gebruik Privileged Identity Management om bevoegde toegang tijdgebonden te maken.
2. **Een Azure-landingszone voor fabrieken:** Definieer een structuur van abonnementen en resourcegroepen per fabriek, en gebruik Azure Policy om tags (fabriek, kostenplaats, use case) en toegestane regio's af te dwingen.
3. **Test Azure Arc:** Koppel een testserver of Kubernetes-cluster aan Arc en laat de vereiste uitgaande endpoints via de proxyketen goedkeuren met je netwerkteam. In veel bedrijven kosten deze firewallgoedkeuringen het meeste tijd.
4. **Fabric-basics:** Bepaal capaciteit, werkruimtestructuur en toegangsmodel; neem je bestaande Power BI-governance over.
5. **Bouw een werkrelatie op met OT:** Begrijp het zonemodel van de fabriek voordat je netwerkwijzigingen voorstelt. In OT gaat beschikbaarheid vóór vertrouwelijkheid, en onderhoudsvensters volgen het productieschema, niet Patch Tuesday.

---

## Status van Azure-diensten voor productie, november 2026

Microsoft hernoemt diensten, lanceert previews en haalt ze later weer uit de handel. Voor productieprojecten met een levensduur van vijf tot tien jaar is de productlevenscyclus daarom een architectuurcriterium. De onderstaande tabel vat de geverifieerde status samen op 20 november 2026.

### Serviceoverzicht: doel, status, bron

| Service | Doel in de productie | Status, november 2026 | Bron |
|---|---|---|---|
| **Azure IoT Operations** | Edge-dataplatform: MQTT-broker, connectors (OPC UA, HTTP/REST), dataflows, assetbeheer | Algemeen beschikbaar sinds november 2024; regelmatige releases. Microsoft Learn noemt versie 1.5.x (release 2610) als de release die een nieuwe SKU introduceert, **Essentials** (alleen clusters met één node, zonder OPC UA-connector), naast **Standard** met de volledige functieset | [3], [5], [7] |
| **Azure Device Registry** | Cloudrepresentatie van assets en apparaten, schemaregister | Integraal onderdeel van Azure IoT Operations; integratie met IoT Hub in preview | [3], [36] |
| **Azure IoT Hub** + Device Provisioning Service | Cloudgateway voor direct verbonden apparaten, levenscyclus van apparaten | Actief; door Microsoft aanbevolen als doel voor IoT Central-klanten | [8], [64] |
| **Azure IoT Central** | Low-code IoT-SaaS | Geen nieuwe applicaties sinds 23 september 2026; uitfasering op 20 september 2029 | [8], [64] |
| **Azure IoT Edge** | Containerruntime voor edge-apparaten (modules) | Product ondersteund; versie 1.5 LTS sinds 10 november 2026 niet meer ondersteund (evenals EFLOW 1.5 voor Windows); huidige versie 1.6 LTS (juli 2026) ondersteund tot 14 november 2028; op de versiepagina staat geen EFLOW 1.6 LTS vermeld (alleen een EFLOW-releasetrack voor continue releases) | [12], [13] |
| **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator, Real-Time hub) | Streamingingestie, tijdreeksanalyse met KQL, waarschuwingen | Algemeen beschikbaar sinds Ignite, november 2024 | [18] |
| **Microsoft Fabric OneLake / Lakehouse** | Centrale opslag voor stamgegevens, transactionele gegevens en sensordata | Algemeen beschikbaar | [17] |
| **Digital twin builder** (Fabric Real-Time Intelligence) | Ontologiegebaseerde digitale representaties van assets en processen | Preview | [15] |
| **Fabric IQ ontology** | Semantische zakelijke laag voor analyses en agents | Preview; de oude ontologie-ervaring wordt uitgefaseerd op 31 januari 2027, en bestaande ontologieën moeten worden gekopieerd naar de nieuwe ervaring | [16] |
| **Azure Digital Twins** | Graafgebaseerde twins met DTDL | Actief, geen uitfaseringsbericht op de overzichtspagina; 3D Scenes Studio in preview | [14] |
| **Azure Data Explorer** | KQL-tijdreeksdatabase buiten Fabric | Actief, geen uitfaseringsbericht; gebruikt KQL net als de Fabric Eventhouse | [19] |
| **Microsoft Foundry** (voorheen Azure AI Foundry / Azure AI Studio) | Modellen, agents en tools voor AI-toepassingen | Actief; "Azure AI Services" heten nu "Foundry Tools"; prompt flow wordt uitgefaseerd op 20 april 2027 | [20], [34], [37] |
| **Azure Machine Learning** | Training, implementatie en MLOps voor klassieke ML-modellen | Actief; Microsoft positioneert Foundry voor generatieve AI en Azure ML voor klassieke ML en MLOps. Ingebouwde datalabeling is op 30 september 2026 uitgefaseerd | [37], [38] |
| **Azure Arc** | Beheer van Kubernetes en servers buiten Azure | Actief; fundament van Azure IoT Operations | [3] |
| **Azure Local** (voorheen Azure Stack HCI) | Hyperconverged infrastructuur in de fabriek | Actief; hernoemd in november 2024 | [21] |
| **Microsoft Defender for IoT (OT-beveiliging)** | Passieve OT-netwerkbewaking, assetinventaris, detectie van afwijkingen | Uitfasering officieel aangekondigd op 2 november 2026; volledige uitfasering in oktober 2029; tot die tijd alleen beveiligingsupdates en bugfixes, geen nieuwe OT-functies. Een partnerblog van Microsoft noemt 31 mei 2028 als einde van de ondersteuning. Connectors voor Armis, Dragos en Forescout | [22], [24], [39] |
| **Azure Time Series Insights** | Tijdreeksverkenner (verouderd) | Uitgefaseerd op 7 juli 2024; Microsoft noemt de Fabric Eventhouse als migratiedoel | [10] |
| **Azure Percept** | Edge-AI-ontwikkelkit | Uitgefaseerd op 30 maart 2023 | [11] |
| **Manufacturing data solutions** (Azure) en **Factory Operations Agent** (Azure AI en Copilot Studio) | Datamodel voor productie en productiecopilot (previews) | Uitgefaseerd per 30 mei 2025 (aangekondigd in februari 2025) | [2] |
| **Factory Safety Agent** (Copilot Studio) | Agent voor arbeidsveiligheid (preview) | Uitgefaseerd per 23 juni 2025 | [2] |
| **Manufacturing data solutions in Microsoft Fabric** | Datamodel voor productie in Fabric (preview sinds april 2024) | Status onduidelijk: de uitfaseringsberichten noemen "Manufacturing data solutions" zonder de Fabric-toevoeging en sluiten de Fabric-variant niet uit of in; sinds april 2024 is er geen afzonderlijk item meer verschenen. Neem het niet op in nieuwe projecten; vraag Microsoft naar de status. | [2] |

### Wat de tabel betekent voor uw architectuur

**Ten eerste:** Plan nieuwe fabrieksaansluitingen op Azure IoT Operations, niet op IoT Central en niet op uw eigen IoT Edge-modulestapels, tenzij u een specifieke reden heeft. IoT Edge blijft ondersteund, maar het is een runtimemodel voor apparaten; Azure IoT Operations pakt de dataplane van de fabriek aan met een broker, connectors en een assetmodel [3]. Houd er bij de keuze van de SKU rekening mee dat Essentials de OPC UA-connector niet bevat [3]. Voor een typische fabriek met OPC UA-machines is Standard het uitgangspunt.

**Ten tweede:** Houd bedrijfslogica uit de buurt van previewservices. De geschiedenis van Manufacturing data solutions laat zien dat een Microsoft-datamodel voor productie in iets meer dan een jaar van preview naar uitfasering kan gaan [2]. Uw datamodel hoort bij u en moet worden gedocumenteerd in open formaten (Delta-tabellen in OneLake, JSON-schema's in de broker, DTDL- of OPC UA-informatiemodellen).

**Ten derde:** Evalueer uw strategie voor OT-beveiliging. De officiële Azure-aankondiging noemt oktober 2029 als einde van OT-beveiliging in Defender for IoT, terwijl een blog van een Microsoft-partner 31 mei 2028 geeft als einde van de ondersteuning [22], [39]. Plan met de vroegere datum: inkoop, uitrol en acceptatie van nieuwe sensoren duren in gereguleerde omgevingen vaak langer dan een jaar.

**Ten vierde:** Evalueer uw IoT Edge-vloot. Apparaten met IoT Edge 1.5 hebben sinds 10 november 2026 geen beveiligingsupdates meer ontvangen. Microsoft omschrijft de overstap naar 1.6 LTS als eenvoudig, omdat er geen grote functiewijzigingen in zitten [12]. Hetzelfde einde van de ondersteuning geldt voor Windows-apparaten met IoT Edge for Linux on Windows (EFLOW) 1.5; de versiepagina vermeldt geen EFLOW 1.6 LTS, alleen een doorlopend releasetraject [12]. Verduidelijk het doelpad voor deze apparaten met Microsoft of uw hardwareleverancier.

> **Opmerking over actualiteit:** Deze tabel is een momentopname. Controleer vóór elke architectuurbeslissing de gekoppelde Microsoft-pagina's en de Azure Updates-portal, gefilterd op "Retirements".

---

## Eerst het datamodel: ISA-95 en de unified namespace

Veel productieprojecten mislukken niet door de cloud, maar doordat niemand heeft vastgelegd wat een "machine", een "order" of een "stilstandgebeurtenis" is in het datamodel. Beantwoord die vraag voordat u de eerste Azure-service implementeert.

### ISA-95 en de automatiseringspiramide

De reeks **ANSI/ISA-95** (internationaal IEC 62264) beschrijft de integratie van bedrijfs- en besturingssystemen [26]. ISA beschrijft die als een reeks normen voor het integreren van logistieke systemen met productiebesturingssystemen, gebaseerd op het Purdue-referentiemodel en toepasbaar op discrete, continue en logistieke industrieën; de reeks bestaat uit acht delen [26]. Het levert twee zaken op die nuttig zijn voor elke cloudarchitectuur:

- **Een niveaumodel:** Niveaus 0 tot en met 2 omvatten het fysieke proces, sensoren, actuatoren en besturing (PLC, SCADA). Niveau 3 is productiebeheer (MES, MOM). Niveau 4 is bedrijfsplanning ([ERP](https://www.m365.fm/entity/enterprise-resource-planning/)). In Europa wordt deze hiërarchie vaak getekend als de "automatiseringspiramide"; in Noord-Amerika is het Purdue-model het gangbaardere beeld.
- **Een objectmodel:** ISA-95 definieert begrippen zoals de apparatuurhiërarchie (onderneming, vestiging, gebied, werkcentrum, werkeenheid), materiaal, personeel, productieorders en prestatiegegevens. De OPC Foundation heeft dit model vertaald naar een eigen companion specification voor OPC UA [35].

De kritiek op de piramide is bekend: data beweegt alleen laag voor laag, elke interface is een point-to-point-integratie, en een nieuwe toepassing moet op meerdere systemen worden aangesloten. Het objectmodel blijft daarentegen waardevol, omdat het IT, OT en de business een gedeelde taal geeft.

### Unified namespace: gebeurtenissen in plaats van de piramide

De **unified namespace (UNS)** is een architectuurpatroon, geen norm. Alle systemen publiceren hun actuele toestand als gebeurtenissen naar een centrale, hiërarchisch gestructureerde broker, doorgaans MQTT. Consumenten abonneren zich op de topics die zij nodig hebben. De topichiërarchie volgt vaak de ISA-95-apparatuurhiërarchie, bijvoorbeeld:

```
acme/dayton-plant/assembly/line-3/station-20/state
acme/dayton-plant/assembly/line-3/station-20/order
acme/dayton-plant/assembly/line-3/station-20/quality
```

Azure IoT Operations bevat een edge-native MQTT-broker die MQTT 3.1.1 en MQTT 5 ondersteunt [40]. De OPC UA-connector publiceert gegevens van OPC UA-servers als JSON in het OPC UA PubSub-formaat naar brokeronderwerpen en kan waarden ook terugschrijven naar OPC UA-nodes; schrijfverzoeken gebruiken het request/response-patroon van MQTT 5 [4]. Daarmee kunt u in de fabriek een UNS opbouwen zonder een aparte broker te draaien.

Als u al een UNS op een andere broker draait, hoeft u die niet te vervangen: dataflows kunnen berichten doorsturen naar externe MQTT-brokers [3]. Of u de Microsoft-broker gebruikt als fabriek-UNS of als voeder voor een bestaande broker, is een beslissing voor de operations-organisatie. Belangrijk is een bindende convention voor onderwerpen en payloads, onafhankelijk van het product.

### ISA-95 of UNS? Beide.

Het praktische antwoord luidt: gebruik **ISA-95 als vocabulaire** en **de UNS als transportpatroon**. In de praktijk betekent dat:

| Vraag | Aanbeveling |
|---|---|
| Hoe benoem ik assets? | ISA-95-equipmenthiërarchie, consistent over de hele onderneming |
| Hoe structureer ik onderwerpen? | Volgens de equipmenthiërarchie, met bedrijfsdomeinen eronder (status, order, kwaliteit, energie) |
| Hoe beschrijf ik payloads? | JSON-schema's in het schemaregister van Azure Device Registry [3]; voor machines heeft OPC UA-companion-specificaties de voorkeur |
| Waar staan stamgegevens? | In het system of record (ERP, MES, PLM); de UNS distribueert alleen verwijzingen en statussen |
| Hoe ga ik om met historiek? | Niet in de broker, maar in het Eventhouse of Lakehouse in Fabric |

### Het minimale productiedatamodel

Ongeacht de gebruikte tools hebben de use cases in deze gids een kernmodel met zeven entiteiten nodig:

1. **Asset** (machine, station, gereedschap) met een unieke ID en een plaats in de hiërarchie
2. **Signaal** (tag, gemeten variabele) met eenheid, bemonsteringsfrequentie en een koppeling naar de asset
3. **Status** (draait, geplande stilstand, ongeplande stilstand, omstelling) met een redencode
4. **Order** (productieorder, bewerking) met een koppeling naar het ERP
5. **Materiaal en lot-/serienummer** met een koppeling naar de stuklijst
6. **Gebeurtenis** (alarm, kwaliteitsbevinding, onderhoud)
7. **Persoon/shift**, voor zover privacyregels en cao-afspraken dat toelaten

Als u deze zeven entiteiten zuiver met elkaar verbindt, kunt u OEE, predictief onderhoud, traceerbaarheid en een digital twin uit dezelfde datafundering bedienen. In de aflevering [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) bespreken we hoe u zo'n model uit een waardestroom afleidt; de methode zelf wordt behandeld in onze gids over [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

---

## Azure-referentiearchitectuur voor de maakindustrie

De onderstaande referentiearchitectuur vat samen wat Microsoft beschrijft in de documentatie van Azure IoT Operations [3] en in de Fabric-referentiearchitectuur "Connected Factory" [17], en voegt de lagen toe die beide bronnen niet behandelen: beveiliging, stamgegevens en de werkplek.

### Lagenmodel

| Laag | Taak | Azure- en Microsoft-bouwstenen | Typische beslissingen |
|---|---|---|---|
| **0: Veld en besturing** | Machines, PLC's, sensoren, testopstellingen, camera's | Geen Azure-component; OPC UA-server op de besturing of een gateway, waar nodig sensoren achteraf toevoegen | Welke machines spreken OPC UA? Waar is achteraf installeren nodig? |
| **1: Edge-infrastructuur** | Rekenkracht in de fabriek, netwerksegmentatie | Industriële pc's of servers met Kubernetes (bijvoorbeeld AKS Edge Essentials op Windows, Ubuntu-gebaseerde clusters) [3], of Azure Local [21]; beheerd via Azure Arc | Cluster met één node of meerdere nodes? Wie beheert de hardware? Let op: de Essentials-SKU is beperkt tot één node [3] |
| **2: Edge-dataplane** | Verzamelen, normaliseren, bufferen, lokale UNS | Azure IoT Operations: MQTT-broker, OPC UA-connector, HTTP/REST-connector (Akri-connectors), dataflows, operations-ervaring, automatische detectie van apparaten en assets [3], [4] | Onderwerpstructuur, schema's, edge-aggregatie, schijfbuffer van de broker, gedrag bij offline werking (maximaal 72 uur, mogelijk gedegradeerd [3]) |
| **3: Asset- en apparaatbeheer** | Welke asset is welke? Welke datapunten? | Azure Device Registry met namespaces en schemaregister [3]; voor rechtstreeks verbonden apparaten IoT Hub en DPS [8] | Wie onderhoudt de stamgegevens van assets? Afstemming met het onderhoudssysteem (CMMS)? |
| **4: Streaming en realtime-analyse** | Gebeurtenissen opnemen, verrijken, meldingen genereren | Fabric Real-Time Intelligence: Eventstream, Eventhouse (KQL), Activator, Real-Time Dashboards [17], [18]; alternatief Azure Event Hubs en Azure Data Explorer [19] | Fabric-capaciteit of Azure PaaS? Retentie voor hot/cold data? |
| **5: Dataplatform** | Historie, contextgegevens, dataproducten | OneLake, Lakehouse, Data Factory voor ERP-, MES- en ploegdata [17] | Medallion-structuur, eigenaarschap van dataproducten, toegangsmodel |
| **6: Semantiek en twin** | Betekenis, relaties, ontologie | Fabric IQ-ontologie (preview) [16], digital twin builder (preview) [15] of Azure Digital Twins met DTDL [14] | Is een preview acceptabel? Eigenaarschap van het model behouden |
| **7: Analyse en AI** | Modellen, prognoses, agents | Fabric Data Science [17], Azure Machine Learning, Microsoft Foundry [20] | Waar trainen, waar inferentie uitvoeren (cloud of edge)? |
| **8: Werkplek en processen** | Mensen informeren en laten handelen | Power BI, Teams (inclusief frontline-scenario's), Power Apps, Power Automate, Microsoft 365 Copilot, Dynamics 365 | Welke rol ziet wat? Mobiel gebruik op de werkvloer? |
| **Transversaal: beveiliging en governance** | Identiteiten, netwerk, monitoring, compliance | Microsoft Entra ID, Azure Policy, Microsoft Defender-portfolio, Microsoft Purview, OT-sensoren (Defender for IoT alleen als overgangsoplossing, partneroplossingen) [22] | Zonemodel volgens ISA/IEC 62443, NIST CSF 2.0-profiel, meldroutes voor incidenten |
| **Transversaal: kosten** | Transparantie, toerekening, optimalisatie | Microsoft Cost Management, Fabric-capaciteitsmetrics, FinOps-praktijken [25] | Kosten per fabriek, lijn, gebruiksscenario |

### Datastroom in tien stappen

1. De controller maakt proceswaarden beschikbaar via een OPC UA-server.
2. De OPC UA-connector in Azure IoT Operations leest de geconfigureerde datapunten van een asset en publiceert ze naar een brokeronderwerp, bijvoorbeeld `azure-iot-operations/data/<asset>` [4].
3. De connector kan assets op OPC UA-servers automatisch detecteren en hun configuratie toevoegen aan Azure Device Registry [4].
4. Dataflows filteren, normaliseren, converteren eenheden en verrijken met context [3], [31].
5. Lokale toepassingen (bijvoorbeeld een andon-bord of een inline inspectie) abonneren zich rechtstreeks op de broker.
6. Een dataflow stuurt geaggregeerde data door naar een cloudeindpunt: Event Hubs/Kafka, de Event Grid MQTT-broker, Data Lake Storage, Fabric OneLake of Azure Data Explorer [3].
7. In Fabric neemt een Eventstream de data op en slaat de Eventhouse deze op voor KQL-query's [17].
8. Data Factory synchroniseert ERP-, MES-, ploeg- en kostendata naar OneLake [17].
9. Events worden verrijkt met assethiërarchie en lijntopologie; modellen worden getraind en gescoord, en resultaten worden opgeslagen in OneLake [17].
10. Real-Time Dashboards en Power BI visualiseren, Activator waarschuwt technici en Copilot beantwoordt vragen in natuurlijke taal [17].

Microsoft dimensioneert de Connected Factory-referentie op meer dan één miljoen IIoT-events per uur, afkomstig van 30.000 tags verspreid over 40 fabrieken [17]. Beschouw dat als oriëntatie, niet als prestatiegarantie voor uw omgeving.

### Lessen uit projecten

Het consultancybureau b.telligent beschrijft drie lessen uit projecten met Azure IoT Operations en Fabric [31]:

- **Configureer brokeropslag:** Zonder geconfigureerde persistente opslag kunnen berichten die niet doorgestuurd kunnen worden het geheugen vullen. Microsoft bevestigt dit punt indirect: de schijfgebaseerde berichtenbuffer van de broker kan alleen bij de initiële implementatie worden ingesteld, niet achteraf [40]. Beslis over het geheugenprofiel en de buffer vóór de uitrol.
- **Houd schema's stabiel:** Gewijzigde JSON-structuren maken de downstreamverwerking kwetsbaar. Een uniforme envelop met metadata en payload helpt.
- **Consolideer Eventstreams:** Omdat elke Eventstream lopende kosten met zich meebrengt, adviseert de post om per fabriek te consolideren in plaats van per bron, en transformaties uit te voeren in de Eventhouse met update policies en KQL in plaats van in de Eventstream.

Deze tips komen uit een post van maart 2025 (bijgewerkt in juni 2025); controleer of ze nog gelden voor uw release.

### Alternatieve routes

Niet elke maker heeft de volledige architectuur nodig. Vier varianten komen vaak voor:

| Variant | Wanneer het zinvol is | Bouwblokken |
|---|---|---|
| **Rechtstreeks naar de cloud** | Weinig, moderne, verbonden apparaten; geen latentie-eisen | IoT Hub, DPS, Fabric Real-Time Intelligence |
| **Edge-gericht** | Veel machines, OPC UA, lokale beslissingen, OT-netwerk zonder directe cloudverbinding | Azure IoT Operations op Arc, Fabric |
| **Partner-edge** | Bestaand industrieel edgeplatform van een automatiseringsleverancier | Partnerplatform plus Fabric of Azure; Microsoft noemt bijvoorbeeld het draaien van Azure AI-modellen op Siemens Industrial Edge als architectuurrichtlijn [2] |
| **Kleine start (middelgrote maker, één fabriek)** | Enkele lijnen, geen eigen Kubernetes-team, eerste use case OEE of conditiebewaking | Eén single-node cluster met Azure IoT Operations Standard (vanwege OPC UA), een kleine Fabric-capaciteit, Power BI; clusterbeheer eventueel via een partner |

Voor een middelgrote maker met één fabriek is de volledige lagenarchitectuur een doelbeeld, geen startpunt. Begin met lagen 1, 2, 4 en 8 en voeg semantiek, AI en governance over meerdere fabrieken toe zodra de eerste use case resultaat oplevert.

---

## IT/OT-convergentie en beveiliging

Zodra machinegegevens naar de cloud stromen, wordt de fabriek onderdeel van uw aanvalsoppervlak. Tegelijkertijd nemen de wettelijke en klanteisen toe. CISA rekent de productie van primaire metalen, machines, elektrische apparatuur en componenten, en transportmiddelen tot de kern van de Amerikaanse **Critical Manufacturing Sector** [52]. Veel fabrieken die gegevens naar Azure sturen, behoren dus tot een sector van kritieke infrastructuur.

Deze sectie begint met de normen die het technische ontwerp bepalen (ISA/IEC 62443, NIST CSF 2.0, NIST SP 800-82). Daarna volgen de verplichtingen voor specifieke groepen producenten (CMMC, SEC, CIRCIA) en, voor bedrijven met activiteiten in de EU of Europese klanten, NIS2 en de Cyber Resilience Act.

### ISA/IEC 62443: zones, conduits, beveiligingsniveaus

De reeks **ISA/IEC 62443** is het referentiekader voor de beveiliging van industriële automatiserings- en besturingssystemen. De kernbegrippen zijn zones (groepen assets met dezelfde beschermingsbehoefte), conduits (gecontroleerde communicatiepaden tussen zones) en beveiligingsniveaus als doel per zone, van SL 1 (bescherming tegen toevallige of onbedoelde schending) tot SL 4 (bescherming tegen geavanceerde aanvallers met uitgebreide middelen) [27]. De norm definieert ook zeven fundamentele eisen, van identificatie- en authenticatiebeheer tot beschikbaarheid van middelen [27]. Voor een Azure-architectuur betekent dat:

- **Het edge-cluster is een eigen zone:** Het Kubernetes-cluster waarop Azure IoT Operations draait, hoort niet in het kantoornetwerk en ook niet rechtstreeks in het besturingsnetwerk, maar in een tussenzone (vaak de "industriële DMZ" genoemd, Purdue-niveau 3.5).
- **Alleen uitgaande verbindingen:** Arc en de datastromen openen verbindingen van de fabriek naar de cloud. Inkomende verbindingen vanaf het internet naar de fabriek zijn niet nodig en moeten niet worden opengezet.
- **Gelaagde netwerken:** Microsoft stelt dat Azure IoT Operations veilig beheer van apparaten in gelaagde netwerken ondersteunt [3]. Plan de keten van proxy's en firewalls al vroeg samen met de OT-beveiliging.
- **Schrijftoegang bewust toekennen:** De OPC UA-connector kan waarden terugschrijven naar controllers [4]. Deze mogelijkheid vraagt om een eigen risicobeoordeling en goedkeuringsproces, en idealiter start ze uitgeschakeld.
- **Certificaten in plaats van wachtwoorden:** Voor OPC UA zijn gebruikersnaam/wachtwoord, X.509-certificaten en anonieme toegang (alleen voor tests) beschikbaar [4]. Gebruik certificaten en een vertrouwenslijst, en behandel het vernieuwen van certificaten als een terugkerend beheerproces.

### NIST CSF 2.0 en NIST SP 800-82: de Amerikaanse basislijn

Voor de meeste Amerikaanse producenten is het **NIST Cybersecurity Framework (CSF) 2.0** de gemeenschappelijke taal tussen fabriek, IT en de directie. NIST publiceerde het op 26 februari 2024; het breidt de vijf functies Identify, Protect, Detect, Respond en Recover uit met een nieuwe functie **Govern** en is van toepassing op organisaties in elke sector en van elke omvang [49]. Het kader is vrijwillig, maar klanten, verzekeraars en auditors vragen steeds vaker om een CSF-profiel.

Twee NIST-documenten maken het kader concreet voor fabrieken:

- **NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security** (september 2023) behandelt OT-architecturen, dreigingen en tegenmaatregelen en voegt een OT-overlay toe met op maat gemaakte SP 800-53-controlebaselines voor OT-systemen met een lage, gemiddelde en hoge impact [50].
- **NIST IR 8183 Rev. 2, Cybersecurity Framework 2.0 Manufacturing Profile**, is op 29 september 2025 gepubliceerd als eerste openbare conceptversie; de commentaarperiode eindigde op 17 november 2025, en per november 2026 is er nog geen definitieve versie vermeld [51]. Gebruik het als conceptreferentie, niet als definitieve norm.

Hoe de onderdelen in een Azure-project op elkaar aansluiten:

| CSF 2.0-functie | Wat het betekent voor het Azure-productieplatform |
|---|---|
| Govern | Benoemde eigenaren voor het fabrieksplatform, risicoacceptatie voor previewdiensten, leverancierslijst (Microsoft, integrator, OT-leveranciers) |
| Identify | OT-activainventaris afgestemd op Azure Device Registry; gegevensstroomoverzicht per zone en conduit |
| Protect | Entra ID-rollen met minimale rechten, PIM, OPC UA-certificaten, alleen uitgaande connectiviteit, schrijftoegang standaard uitgeschakeld |
| Detect | OT-netwerkbewaking (partneroplossing na Defender for IoT), centrale logs van edge en cloud in Sentinel of uw SIEM |
| Respond | Incidentplaybook dat fabriek en cloud omvat, inclusief wie een cluster tijdens de productie mag ontkoppelen |
| Recover | Getest opnieuw uitrollen van het edge-cluster (infrastructure as code), back-up van broker- en activaconfiguratie |

Kleine en middelgrote producenten hoeven dit niet alleen te doen: het National Network van het NIST Manufacturing Extension Partnership (MEP) biedt op CSF gebaseerde zelfbeoordelingen, gap-analyses, corrigerende actieplannen, incidentresponsplannen en hulp bij DFARS-eisen [58].

### CMMC voor defensieleveranciers

Als u onderdelen maakt of diensten levert voor het Amerikaanse ministerie van Defensie, is het **Cybersecurity Maturity Model Certification (CMMC)** van toepassing op de systemen die Federal Contract Information (FCI) of Controlled Unclassified Information (CUI) verwerken, opslaan of doorgeven. De programmaregel (32 CFR Part 170) is op 16 december 2024 in werking getreden [53]. De DFARS-regel die CMMC in contracten opneemt, is op 10 november 2025 in werking getreden, met een gefaseerde invoering: fase 1 is op die datum begonnen, fase 2 op 10 november 2026 en fase 3 is gepland voor 10 november 2027 [54]. De niveaus zijn Niveau 1 (zelfbeoordeling, FCI), Niveau 2 (zelfbeoordeling of beoordeling door een externe C3PAO, op basis van NIST SP 800-171) en Niveau 3 (DIBCAC-beoordeling, met de praktijken uit NIST SP 800-172) [53], [54].

Wat dit betekent voor Azure:

- **Bepaal de scope op basis van de gegevens, niet de cloud.** CMMC is van toepassing op uw systemen, niet op Azure als platform; er bestaat geen CMMC-certificaat voor Azure zelf [55]. Gewone machinetelemetrie is mogelijk geen CUI, terwijl tekeningen, specificaties en sommige procesparameters voor defensieonderdelen dat wel kunnen zijn; de CUI-markeringen en contractvoorwaarden van uw klant bepalen dit. Bepaal welke gegevens in de UNS en in OneLake binnen de scope vallen.
- **Kies bewust de cloudomgeving.** Microsoft stelt dat zowel Azure commercial als Azure Government FedRAMP High-autorisaties hebben die NIST SP 800-171 dekken, en dat u voor oplossingen in beide omgevingen CMMC-certificering kunt verkrijgen. Azure Government voegt DoD IL4/IL5-autorisaties toe en contractuele toezeggingen over opslag van Amerikaanse gegevens en gescreend Amerikaans personeel, en Microsoft beschouwt die omgeving als de betere keuze voor de meeste defensieaannemers [55]. Let op: de CMMC-pagina van Microsoft is voor het laatst bijgewerkt in april 2023, dus controleer de details bij uw Microsoft-accountteam.
- **Controleer de beschikbaarheid van functies.** Niet elke dienst in deze gids is beschikbaar in Azure Government of in de Microsoft 365 GCC High-omgeving. Verifieer de beschikbaarheid van Azure IoT Operations, Fabric en Copilot voor uw doelcloud voordat u er een ontwerp op baseert [unverified: voor de afzonderlijke diensten; controleer de pagina's over functiebeschikbaarheid voor Amerikaanse overheid van Microsoft].

### SEC-openbaarmaking en CIRCIA-incidentmelding

Twee Amerikaanse meldingsregimes beïnvloeden hoe u logging en incidentrespons voor het fabrieksplatform ontwerpt:

- **Beursgenoteerde bedrijven:** Op grond van de SEC-regels van 26 juli 2023 moeten registranten een materieel cyberbeveiligingsincident openbaar maken via Formulier 8-K (Item 1.05) binnen vier werkdagen nadat zij hebben vastgesteld dat het materieel is, en moeten zij hun risicobeheer, strategie en governance op het gebied van cyberbeveiliging beschrijven in het jaarlijkse Formulier 10-K [56]. Een ransomware-aanval die een fabriek stilzet, is een typisch geval voor een beoordeling van materialiteit, dus uw OT-incidentplaybook heeft een snelle route nodig naar de openbaarmakingscommissie.
- **Kritieke infrastructuur (CIRCIA):** De Cyber Incident Reporting for Critical Infrastructure Act verplicht gedekte entiteiten om gedekte cyberincidenten binnen 72 uur bij CISA te melden en losgeldbetalingen binnen 24 uur, maar pas zodra de definitieve regel van CISA in werking treedt. Vanaf oktober 2026 had CISA de definitieve regel naar het Witte Huis gestuurd voor beoordeling, en was deze nog niet gepubliceerd [57]. Volg de definitieve regel; die bepaalt welke producenten gedekt zijn.

### NIS2 en de Cyber Resilience Act voor EU-activiteiten

Als u fabrieken in de EU runt of machines daar verkoopt, zijn er ook twee Europese wetten van belang. De Duitse voorbeelden hieronder komen uit de oorspronkelijke Duitse editie van deze gids en laten zien hoe de EU-regels in de praktijk uitpakken.

**NIS2 (voorbeeld: Duitsland).** De Duitse NIS2-implementatiewet (NIS2UmsuCG) is op 6 december 2025 van kracht geworden; het Duitse Bundesamt für Sicherheit in der Informationstechnik (BSI) houdt nu toezicht op ongeveer 29.500 entiteiten in plaats van ongeveer 4.500 [28]. Bedrijven vallen onder de wet als ze behoren tot een van de entiteitstypen in bijlage 1 en 2 van de BSI-wet en voldoen aan de drempels in artikel 28: minimaal 50 werknemers, of meer dan 10 miljoen euro jaaromzet én balanstotaal [41]. Productie-items in bijlage 2 omvatten medische hulpmiddelen, computers, elektronische en optische producten, elektrische apparatuur, machines en voertuigen; chemie en voedsel vallen onder aparte sectoren. Belangrijkste verplichtingen:

- **Registratie** in twee stappen, via het account "Mein Unternehmenskonto" en het BSI-portaal, dat op 6 januari 2026 openging [28].
- **Risicobeheer** met verantwoordelijkheid op bestuursniveau.
- **Technische en organisatorische maatregelen**, waaronder beveiliging van de toeleveringsketen en multifactorauthenticatie.
- **Incidentmelding** voor significante incidenten: vroegtijdige waarschuwing binnen 24 uur na kennisname, incidentmelding binnen 72 uur, eindrapport uiterlijk één maand na de melding [41].

Bedrijven moeten zelf beoordelen of ze onder de wet vallen; het BSI brengt hen niet op de hoogte. Het biedt een niet-bindende online zelftoets en raadt juridisch advies aan in onduidelijke gevallen [41]. Andere EU-lidstaten hebben eigen implementatiewetten met vergelijkbare opzet.

**Cyber Resilience Act.** Als u machines of producten met digitale elementen bouwt en deze op de EU-markt brengt, geldt ook de **Cyber Resilience Act (verordening (EU) 2024/2847)**, ook voor Amerikaanse fabrikanten. Vanaf 11 september 2026 moeten fabrikanten actief uitgebuite kwetsbaarheden en ernstige incidenten melden via het Single Reporting Platform van ENISA: vroegtijdige waarschuwing binnen 24 uur, melding binnen 72 uur, en een eindrapport uiterlijk 14 dagen nadat een oplossing beschikbaar is voor kwetsbaarheden, of binnen één maand voor incidenten [30]. Vanaf 11 december 2027 moeten producten voldoen aan de essentiële cyberbeveiligingseisen voordat ze op de markt worden gebracht; daartoe behoren veilige standaardinstellingen, een software bill of materials (SBOM) en beveiligingsupdates gedurende een vermelde ondersteuningsperiode, over het algemeen minimaal vijf jaar [42]. Voor machinebouwers die apparatuur met cloudservices leveren, wordt productie-IT een kwestie van productcompliance.

Voor de Azure-architectuur wijzen NIS2, CSF 2.0 en CMMC in dezelfde richting: een inventaris (wat is er met de cloud verbonden?), logging (wie heeft wat wanneer gewijzigd?), transparantie in de toeleveringsketen (welke diensten en partners zijn betrokken?) en een geoefend meldingsproces.

### OT-monitoring na de uitfasering van Defender for IoT

Op 2 november 2026 heeft Microsoft in Azure Updates officieel aangekondigd dat het de OT-beveiligingscomponent van Defender for IoT in oktober 2029 volledig zal uitfaseren, na een overgangsperiode van drie jaar [22]. Tot die tijd ontvangt de dienst beveiligingsupdates en bugfixes, maar geen nieuwe OT-functies; bestaande overeenkomsten en verlengingen worden tot oktober 2029 gehonoreerd [22]. De IoT-mogelijkheden voor ondernemingen in Defender for Endpoint, evenals apparaatdetectie en kwetsbaarheidsbeoordeling, worden hierdoor niet geraakt [22]. Er is geen eigen vervanging van Microsoft [39]. Microsoft biedt connectors voor Armis, Dragos en Forescout die OT-asset- en kwetsbaarheidsgegevens naar Microsoft Security Exposure Management en het Defender-portaal brengen; de oplossingen van partners vereisen eigen licenties en implementatie [22], [24].

Tegenstrijdige data: een partnerblog van Microsoft uit november 2026 noemt **31 mei 2028** als einde van de ondersteuning voor OT-beveiliging [39]. Of dit een andere datum is voor bepaalde contracttypen, of een fout, was op het moment van schrijven nog niet opgehelderd.

Aanbeveling: als u nu OT-monitoring invoert, evalueer dan rechtstreeks de oplossingen van partners. Als u Defender for IoT gebruikt, plan de vervanging dan zo dat deze vóór medio 2028 is afgerond, en bevestig met uw accountteam van Microsoft welke datum voor uw contract geldt.

### Beveiligingschecklist voor de eerste fabrieksverbinding

- [ ] Zonemodel volgens ISA/IEC 62443 gedocumenteerd voor de fabriek
- [ ] Edge-cluster in een eigen zone, alleen uitgaande verbindingen, via een proxy
- [ ] Arc- en Azure-eindpunten expliciet toegestaan in de firewall, al het overige geblokkeerd
- [ ] OPC UA-verbindingen met certificaten; schrijftoegang uitgeschakeld of onderhevig aan goedkeuring
- [ ] Entra ID-rollen voor OT-medewerkers met minimale rechten; bevoegde toegang beperkt in de tijd
- [ ] Logs van edge en cloud centraal verzameld
- [ ] OT-assetinventaris afgestemd op Azure Device Registry
- [ ] CSF 2.0-profiel (huidig en doel) opgesteld voor het fabrieksplatform
- [ ] CMMC-scope bepaald indien de fabriek FCI of CUI verwerkt
- [ ] Meldingsroute voor incidenten getest (SEC, CIRCIA zodra van kracht, NIS2 voor EU-vestigingen)
- [ ] Updateproces voor Azure IoT Operations-releases en Kubernetes gedefinieerd (onderhoudsvensters afgestemd met de productie)

---

## Use case 1: Predictive maintenance op Azure

Predictive maintenance is een van de meest genoemde productietoepassingen op Azure, en tegelijk een waarbij veel pilots mislukken. Een veelvoorkomende reden: het model komt vóór de data. We gaan hier dieper op in de aflevering [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/).

### Houd de begrippen uit elkaar

| Strategie | Trigger | Benodigde data |
|---|---|---|
| Reactief onderhoud | Storing | Geen |
| Preventief onderhoud | Tijd- of tellerinterval | Bedrijfsuren, cycli |
| Conditiegericht onderhoud (conditiebewaking) | Drempelwaarde overschreden | Conditievariabelen (trilling, temperatuur, stroom) |
| Predictive maintenance | Voorspelling van de resterende levensduur of de kans op storing | Conditievariabelen plus gelabelde storingshistorie plus bedrijfscontext |
| Prescriptief onderhoud | Aanbevolen actie | Plus kennis van oorzaken en acties |

Veel bedrijven halen het grootste deel van het voordeel al uit conditiegericht onderhoud alleen. Voorspellende modellen renderen wanneer storingen duur zijn, frequent genoeg voorkomen en fysiek vooraf aankondigen. [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) levert de overkoepelende strategie; de pijlers autonoom en gepland onderhoud werken ook zonder AI.

### Datavoorwaarden

Voordat u een model traint, moet u ja kunnen antwoorden op deze vragen:

1. **Is er een storingshistorie?** Een supervised model heeft storingen nodig met tijdstempels en storingstypen. Die staan meestal in het onderhoudssysteem (bijvoorbeeld SAP PM of een CMMS) en zijn zelden netjes gecodeerd.
2. **Zijn de tijdstempels gesynchroniseerd?** Sensortijd, controllertijd en boekingstijd in het ERP moeten op elkaar aansluiten. Het is geen toeval dat Microsoft speciale gezondheidsmeldingen voor ontbrekende of onbereikbare NTP-servers heeft toegevoegd aan Defender for IoT-sensoren [23]; hetzelfde geldt voor uw datapijplijn. De OPC UA-connector draagt het brontijdstempel van elke waarde [4]; gebruik dat in plaats van de aankomsttijd in de cloud.
3. **Past de samplefrequentie bij de storingsmodus?** Lagerschade is zichtbaar in trillingsspectra in het kilohertzbereik; slijtage aan verwarmingsbanden is zichtbaar in waarden op minutenniveau. Een OPC UA-tag met een resolutie van één seconde is voldoende voor het ene, niet voor het andere.
4. **Is er bedrijfscontext beschikbaar?** Zonder informatie over product, recept, order en toestand (omstelling, productie, stilstand) behandelt het model elke productwissel als een afwijking.
5. **Is de actie gedefinieerd?** Wie reageert op een waarschuwing, met hoeveel doorlooptijd, en hoe wordt het resultaat teruggemeld?

### Zes stappen

1. **Selecteer kandidaten:** Assets met hoge faalkosten, terugkerende storingsoorzaken en bestaande sensoren. Een Pareto-analyse van de stilstandoorzaken uit het MES levert de lijst op.
2. **Koppel de data:** OPC UA-connector in Azure IoT Operations, datapunten per asset, dataflow naar Fabric [3], [4]. Aggregeer hoogfrequente trillingsdata aan de edge tot features (RMS, kurtosis, bandenergieën).
3. **Eerst conditiebewaking:** Drempelwaarden en eenvoudige anomaliedetectie in Eventhouse en Activator. Activator kan technici rechtstreeks melden [17]. Dit levert binnen weken waarde op in plaats van maanden en verzamelt tegelijk labels.
4. **Maak labels:** Koppel onderhoudsorders met storingscodes aan de tijdreeksen. Hier zit de echte inspanning. Plan hiervoor een tool in: Microsoft heeft de ingebouwde datalabeling in Azure Machine Learning op 30 september 2026 uitgefaseerd en verwijst naar externe leveranciers [38]. Voor tijdreekslabels uit onderhoud is vaak een Power App voldoende die terugschrijft naar het onderhoudssysteem.
5. **Train het model:** In Fabric Data Science of Azure Machine Learning; sla resultaten op in OneLake [17]. Begin met interpreteerbare methoden (gradient boosting op features) voordat u deep learning inzet.
6. **Operationaliseer:** Stuur voorspellingen als events naar het onderhoudsproces (melding in het onderhoudssysteem, Teams-bericht, Power Apps-formulier voor terugkoppeling). Monitor de modelkwaliteit en drift.

### Succesmetrieken

Meet de operationele impact, niet de nauwkeurigheid van het model: ongeplande stilstand, gemiddelde tijd tussen storingen (MTBF), gemiddelde hersteltijd (MTTR), aandeel gepland in het totale onderhoudsuren en voorraad reserveonderdelen. Deze [KPI's](https://www.m365.fm/entity/key-performance-indicator/) hebben een nulmeting nodig voordat het project start; anders kunt u geen enkel voordeel aantonen. Onze gids over [productie-KPI's](https://www.m365.fm/en/learn/manufacturing-kpis/) behandelt de definities.

### Edge of cloud voor inferentie?

| Criterium | Inferentie in de cloud | Inferentie aan de edge |
|---|---|---|
| Latentie | Seconden tot minuten | Milliseconden |
| Datavolume | Alleen geaggregeerde data wordt verstuurd | Ruwe data blijft lokaal |
| Beheer | Eenvoudiger (centrale modellen) | Gedistribueerde uitrol, versiebeheer per fabriek |
| Veerkracht | Afhankelijk van connectiviteit | Werkt offline |
| Typisch gebruik | Resterende levensduur, onderhoudsplanning | Snelle afschakeling, inline kwaliteit |

Voor klassiek predictive maintenance is cloudinferentie op geaggregeerde data in de meeste gevallen voldoende. Sinds release 2603 positioneert Microsoft Azure IoT Operations expliciet voor AI-scenario's dichter bij de machine ("Physical AI") [6]; controleer voor edge-inferentie de actuele releasenotities [7].

### Predictive maintenance op Azure: bouwblokken in een oogopslag

| Stap | Azure- en Microsoft-bouwblok | Alternatief |
|---|---|---|
| Data verzamelen | Azure IoT Operations (OPC UA-connector, dataflows) [3], [4] | IoT Hub voor direct aangesloten sensoren [36] |
| Tijdreeksen opslaan en analyseren | Fabric Eventhouse met KQL [17] | Azure Data Explorer [19] |
| Drempelwaarden en meldingen | Fabric Activator [17] | Azure Monitor of maatwerklogica |
| Model trainen | Fabric Data Science, Azure Machine Learning [17], [37] | Eigen applicatie van de machinebouwer |
| Actie activeren | Power Automate, Teams, Power Apps, onderhoudssysteem | Directe API naar het CMMS |

---

## Gebruiksscenario 2: Traceerbaarheid en genealogie

Traceerbaarheid beantwoordt de vraag "Waar is dit onderdeel ingebouwd, en waaruit is het gemaakt?". Genealogie beschrijft de volledige herkomstketen van een product: materiaal, partij, processtap, machine, parameters, inspectieresultaat en medewerker. In gereguleerde industrieën is dit verplicht; overal elders versnelt het de afhandeling van klachten en beperkt het terugroepacties. De aflevering [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) behandelt het onderwerp uitgebreid.

### Eisen per industrie

| Industrie / regel | Kernvereiste aan gegevens | Opmerking |
|---|---|---|
| Voeding, FDA Food Traceability Rule (FSMA Section 204) | Key data elements (KDEs) voor elk kritiek trackinggebeurtenis (CTE), zoals ontvangst, transformatie en verzending, gekoppeld aan een traceability lot code; gegevens binnen 24 uur aan de FDA verstrekken op verzoek, plus een elektronische, sorteerbare spreadsheet tijdens uitbraken of terugroepacties | [59]; de FDA past de regel niet toe vóór 20 juli 2028, na een opdracht van het Congres (oorspronkelijke datum 20 januari 2026) |
| Medische hulpmiddelen, FDA QMSR (21 CFR Part 820) | Sinds 2 februari 2026 neemt het Quality Management System Regulation ISO 13485:2016 door verwijzing op, inclusief de identificatie- en traceerbaarheidseisen ervan | [61] |
| Door de FDA gereguleerde elektronische registraties, 21 CFR Part 11 | Beveiligde, computergegenereerde, van tijdstempel voorziene audittrails die invoer en wijzigingen door medewerkers registreren zonder eerdere invoer te verbergen, zolang de registraties worden bewaard | [60]; relevant voor farma, medische hulpmiddelen en voedingsregistraties die elektronisch worden bijgehouden |
| Automotive, IATF 16949 | Paragraaf 8.5.2.1 vult de identificatie- en traceerbaarheidseisen van ISO 9001 aan (inclusief een traceerbaarheidsplan op basis van risicoanalyse); paragraaf 7.5.3.2.1 behandelt het bewaren van bepaalde registraties, doorgaans gelezen als de duur van de productie- en servicedelevering plus één kalenderjaar, tenzij de klant of toezichthouder anders vereist | De normtekst is betaald; details uit secundaire bronnen. Klantspecifieke eisen van OEM's (CSR's) gaan vaak verder |
| Lucht- en ruimtevaart, AS9100D (EN 9100 in Europa, JIS Q 9100 in Japan) | Traceerbaarheid over de volledige levenscyclus van het product, identificatie van de configuratie, en de mogelijkheid om producten te traceren die zijn gemaakt uit dezelfde grondstofpartij of productiebatch | AS9100D (2016) is de huidige revisie; EN 9100 is de technisch gelijkwaardige Europese uitgave [62]. Artikelverwijzing (8.5.2) niet gecontroleerd tegen de originele normtekst |
| Batterijen verkocht in de EU, EU-batterijverordening (Verordening (EU) 2023/1542) | Elektronisch batterijpaspoort vanaf 18 februari 2027 voor EV-tractiebatterijen, batterijen voor lichte transportmiddelen (bijvoorbeeld e-bikes, e-scooters) en industriële batterijen boven 2 kWh | [29]; tijdpad volgens de Europese Commissie is indicatief; relevant voor Amerikaanse exporteurs naar de EU |
| Producten verkocht in de EU onder de ecodesignverordening (ESPR, Verordening (EU) 2024/1781) | Digitaal productpaspoort afhankelijk van de gedelegeerde handeling; EU-DPP-register in gebruik sinds 20 juli 2026 (aanvankelijk met een testomgeving); gedelegeerde handeling voor ijzer en staal gepland voor het vierde kwartaal van 2026, textiel, aluminium en banden in 2027; minstens 18 maanden overgangsperiode na vaststelling van een gedelegeerde handeling | [29]; tijdpad volgens de Europese Commissie is indicatief |

Voor de lucht- en ruimtevaart legt Mirko Peters in zijn bijdrage [Aerospace Production Planning: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/) uit waarom doorlooptijd en traceerbaarheid daar nauw met elkaar verbonden zijn; onze gids over [aerospace production planning](https://www.m365.fm/en/learn/aerospace-production-planning/) behandelt de context van AS9100, FAA en exportcontrole.

### Het genealogische gegevensmodel

Een robuuste genealogie vereist drie soorten relaties:

1. **Materiaal-in-materiaal:** Partij A en onderdeel B gaan naar samenstelling C (BOM-verwijzing, serie- of partijnummer).
2. **Materiaal-naar-proces:** Samenstelling C is in bewerking 30 op station 20 verwerkt met parameterset X door ploeg Y.
3. **Proces-naar-resultaat:** Bewerking 30 heeft inspectieresultaat Z opgeleverd en, waar van toepassing, een afwijking.

Deze relaties vormen een graaf. Je kunt die in Fabric representeren als een tabelstructuur in het Lakehouse en doorlopen met KQL of SQL, of modelleren als graaf in een digital twin (Fabric-ontologie of Azure Digital Twins) [14], [16]. Wat ertoe doet, is dat de identificatie bij de bron plaatsvindt: scannen, RFID of Data Matrix-codes op het station, gekoppeld aan de ordergebeurtenis in de UNS.

### Implementatie op Azure

- **Gebeurtenissen aan de edge vastleggen:** Scanners en stations publiceren "onderdeel X gestart/afgerond op station Y" naar de MQTT-broker van Azure IoT Operations [3]. Procesparameters komen binnen via de OPC UA-connector [4]; "dataset triggering" laat één datapunt de publicatie van de andere triggeren, bijvoorbeeld "cyclus voltooid" [4].
- **Context samenbrengen:** In Fabric worden de gebeurtenissen gekoppeld aan order- en stuklijstgegevens uit ERP en MES [17].
- **Onveranderlijkheid waarborgen:** Wettelijk vereiste registraties hebben onveranderlijke opslag nodig, of minstens een manipulatiebestendig wijzigingslogboek (voor FDA-gereguleerde registraties de auditspoorvereiste van Part 11 [60]). Het onveranderlijkheidsbeleid van OneLake geldt momenteel alleen voor diagnostische logs, niet voor bedrijfsgegevens [43]. Voor controlebestendige traceerbaarheidsarchieven voeg je Azure Blob Storage toe met onveranderlijke opslagbeleidsregels (WORM); Fabric blijft de analyselaag.
- **Query's beschikbaar maken:** Typische query's zijn voorwaartse tracering (welke eindproducten bevatten partij A?) en achterwaartse tracering (waaruit bestaat serienummer S?). Een Power BI-rapport of een Power App voor kwaliteitsborging maakt deze query's bruikbaar zonder KQL-kennis. Onder FSMA 204 is het kunnen exporteren van een sorteerbaar spreadsheet binnen 24 uur [59] een concrete acceptatietest voor deze laag.

### Van traceerbaarheidsregistratie naar digitaal productpaspoort

Een digitaal productpaspoort is in wezen een extern toegankelijk uittreksel van je genealogie, aangevuld met duurzaamheids- en materiaalgegevens. Als je vandaag een zuivere genealogie opbouwt, heb je het zwaarste voorwerk al gedaan. Zorg dat identificatoren uniek en permanent zijn, en dat je kunt onderscheiden welke gegevens openbaar zijn, welke voor toezichthouders bestemd zijn en welke uitsluitend intern blijven.

---

## Use case 3: Digital twins

De term [digital twin](https://www.m365.fm/entity/digital-twin/) wordt gebruikt voor zeer uiteenlopende zaken: van een 3D-model tot een simulatiemodel tot een live representatie van een fabriek. Voor architectuurdoeleinden helpt een onderscheid. Onze gids over [digital twins in de productie](https://www.m365.fm/en/learn/digital-twin-manufacturing/) gaat verder dan het Azure-perspectief.

### Drie soorten twins

| Soort | Vraag | Gegevens | Tools in het Microsoft-ecosysteem |
|---|---|---|---|
| **Informatietwin** | Wat staat waar, en hoe hangt het samen? | Asset-hiërarchie, relaties, live toestanden | Fabric digital twin builder (preview) [15], Fabric IQ-ontologie (preview) [16], Azure Digital Twins [14] |
| **Simulatietwin** | Wat gebeurt er als …? | Proceslogica, tijden, capaciteiten, verstoringsgedrag | Industrietoepassingen voor materiaalstroom- en processimulatie, mogelijk op Azure-infrastructuur |
| **Engineeringtwin** | Hoe gedraagt het product of de machine zich fysiek? | CAD, CAE, besturingslogica | PLM/CAE op Azure; Microsoft vermeldt onder andere architectuurrichtlijnen voor Siemens NX op Azure Virtual Desktop met GPU-VM's en Ansys Discovery op GPU-VM's [2] |

[Virtual commissioning](https://www.m365.fm/entity/virtual-commissioning/) verbindt de engineering- en simulatietwin: stuurcode wordt getest tegen een fabrieksmodel voordat de echte apparatuur bestaat.

### Azure Digital Twins of Fabric?

Microsoft wijst zelf erop dat digital twin builder in Fabric een ander product is dan Azure Digital Twins [14], [15]. De praktische verschillen:

| Criterium | Azure Digital Twins | Fabric digital twin builder |
|---|---|---|
| Status | Actief, geen uitfasering vermeld op de overzichtspagina [14] | Preview [15] |
| Modellering | DTDL (Digital Twins Definition Language), versie 3 [14] | Ontologie met entiteitstypen en relaties [15] |
| Opslag | Eigen twin-graaf; historie via datahistorie naar Azure Data Explorer [14] | OneLake; gegevens moeten eerst in een Fabric-lakehouse staan [15] |
| Integratie | Eventroutes naar Event Hubs, Event Grid, Service Bus [14] | Native in Fabric Real-Time Intelligence, Power BI |
| Doelgroep | Ontwikkelteams, API-gericht | Data- en business-teams, low-code |
| Visualisatie | 3D Scenes Studio (preview) [14] | Fabric-ervaringen, Power BI |

**Aanbeveling:** Als uw dataplatform Fabric is en u analytische twins nodig heeft voor KPI's en oorzaakanalyse, volg dan digital twin builder en de Fabric IQ-ontologie en voer er pilots mee uit, maar laat uw datamodel niet afhangen van een preview. Microsoft heeft nog niet gedocumenteerd hoe de twee Fabric-bouwstenen zich ten opzichte van elkaar zullen ontwikkelen; de ontologie is al één keer van ervaring veranderd met verplichte migratie [16]. Als u vandaag een productieve, op API gebaseerde twin-toepassing bouwt, is Azure Digital Twins de algemeen beschikbare dienst. Hoe dan ook: bewaar een kopie van uw ontologie in een toolonafhankelijk formaat.

### Waar beginnen?

De meest voorkomende fout is beginnen met 3D-visualisatie. Begin met een vraag die de twin moet beantwoorden, bijvoorbeeld "Welke orders worden geraakt als station 20 uitvalt?". Die vraag bepaalt welke entiteiten en relaties u nodig heeft. Mirko Peters beschrijft deze aanpak in [Digital Twin in Manufacturing: Where to Start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/) en het pad van ERP naar een shop floor-twin in [From ERP to Shop Floor: Building the Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/). We bespreken de technische implementatie op Azure in de aflevering [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/).

---

## Use case 4: Realtime KPI's, OEE en waardestromen

Realtime KPI's zijn vaak de snelste manier om waarde te halen uit een koppeling met de productievloer. Ze hebben geen AI nodig, wel een schoon statusmodel.

### OEE correct berekenen

Overall equipment effectiveness (OEE) is het product van beschikbaarheid, prestatie en kwaliteit. De formule is eenvoudig; de definities zijn dat niet:

- **Beschikbaarheid:** Welke stilstanden tellen als gepland (pauzes, gepland onderhoud, geen order)? Deze beslissing verschuift de OEE met vele procentpunten.
- **Prestatie:** Welke cyclustijd is de referentie: de ontwerpwaarde, de beste behaalde cyclustijd of de standaard in het ERP?
- **Kwaliteit:** Telt nabewerking als goed deel of als slecht deel?

Stem deze definities af over alle fabrieken heen voordat u een dashboard bouwt. Anders vergelijken fabrieken getallen die niet vergelijkbaar zijn.

### Architectuur voor realtime KPI's

1. Machinestatussen en stukteller stromen via OPC UA naar de broker [4].
2. Een data flow koppelt statussen aan een uniform statusmodel (mapping van machinespecifieke codes) [3].
3. Het Eventhouse berekent lopende KPI's per station, lijn en ploeg met KQL.
4. Een Real-Time Dashboard bedient de productievloer; Power BI bedient managementrapportages [17].
5. Activator geeft alarm wanneer waarden onder drempelwaarden zakken [17].

### De waardestroom als live datamodel

Waardestroomanalyse is traditioneel een papieren oefening. Als u de procesblokken van een waardestroom koppelt aan live data, krijgt u een eenvoudig maar effectief datamodel: doorlooptijd, voorraad tussen processen, cyclustijden en knelpunten worden meetbaar. De aflevering [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) laat zien hoe dit in de praktijk werkt. Voor gedetailleerde planning op basis van deze data komen systemen voor [advanced planning and scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) in beeld; zie onze gids over [productieplanning en APS](https://www.m365.fm/en/learn/production-scheduling-aps/). Hoe deze cijfers in de dagelijkse tier-overleggen worden gebruikt, is het onderwerp van onze gids over [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/).

### Startende KPI-catalogus

| KPI | Gegevensbron | Granulariteit |
|---|---|---|
| OEE en zijn factoren | Machinestatus, tellers, kwaliteitsbevindingen | Station, ploeg |
| Doorlooptijd | Orderevents (start/eind per bewerking) | Order, product |
| Work in process | Voorraadboekingen, scans | Buffer, lijn |
| Levering op tijd | ERP (gevraagde vs. werkelijke datum) | Klant, productgroep |
| MTBF / MTTR | Stilstand, onderhoudsorders | Asset |
| Energie per goed deel | Energiemeters, stukteller | Lijn, product |
| First pass yield | Inspectieresultaten | Bewerking |

---

## ERP- en MES-integratie

Productiedata zonder context van orders en materialen zijn metingen, geen informatie. Integratie met ERP en MES bepaalt de waarde van het hele platform.

### Welk systeem is de system of record?

| Dataobject | System of record (typisch) | Rol van het Azure-platform |
|---|---|---|
| Materiaal, stuklijst, routing | ERP / PLM | Kopie voor verrijking, geen onderhoud |
| Productieorder (planning) | ERP / APS | Kopie; statusterugkoppeling als event |
| Uitvoering van bewerkingen, bevestiging | MES | Events in de UNS, historie in Fabric |
| Machinestatussen, proceswaarden | Besturing / edge | Primaire databron |
| Onderhoudsorders | ERP-onderhoud / CMMS | Getriggerd door voorspellingen, historie voor labels |
| Kwaliteitsbevindingen | QMS / MES | Gekoppeld aan procesdata |

### SAP-integratie

Er zijn meerdere manieren om SAP-data in Fabric te krijgen: Data Factory-connectors, open mirroring-oplossingen van partners, en "SAP Business Data Cloud Connect for Microsoft Fabric", bedoeld om SAP-dataproducten beschikbaar te maken in OneLake zonder kopiëren; algemene beschikbaarheid voor de laatste werd aangekondigd voor het derde kwartaal van 2026 [44]. Wij konden op het moment van schrijven de daadwerkelijke algemene beschikbaarheid niet bevestigen [unverified: geen officiële bevestiging gevonden op het moment van schrijven]; controleer de actuele status en de licentievereisten aan SAP-zijde voordat u plant. Voor shopfloorintegratie met SAP Digital Manufacturing publiceerde DSAG (de Duitstalige SAP-gebruikersgroep) in april 2026 de gids "SAP DM Shopfloor Integration"; de samenvattingspagina is in het Engels beschikbaar. Volgens de inleiding behandelt die architectuur, datastructuren en -modellen, schaalbaarheid, templates, operating model en inkoop; de volledige tekst is voorbehouden aan DSAG-leden [48]. Basisregel: bevestigingen gaan naar SAP via de MES of gedefinieerde API's, niet rechtstreeks vanuit het dataplatform.

### Dynamics 365

Als u Dynamics 365 Supply Chain Management gebruikt, profiteert u van de nabijheid tot het Microsoft-ecosysteem: met "Link to Microsoft Fabric" kunnen Dataverse-data, inclusief geselecteerde financiële en operationele tabellen, in Fabric beschikbaar worden gesteld zonder eigen ETL-pipeline [45]. Microsoft beschrijft zijn productieaanbod als een combinatie van mogelijkheden van Dynamics 365, Microsoft 365 en Azure [1].

### Bestaande historians en SCADA

Veel Amerikaanse fabrieken draaien al een procshistorian naast SCADA. Behandel die als bron, niet als iets dat moet worden vervangen: de historian blijft lokaal operators en procesingenieurs bedienen, terwijl het Azure-platform ofwel de ruwe signalen uit de OPC UA-laag ontvangt of gecureerde data uit de historian. Beslis per signaal welk pad de system of record is voor historie, zodat u dezelfde tijdreeks niet twee keer opslaat en betaalt, en controleer bij de historianleverancier welke interfaces en licenties gelden voordat u de datastroom ontwerpt.

### De shopfloordatastroom naar het ERP

Een gangbaar patroon:

1. Het ERP geeft een order vrij; het event "order vrijgegeven" komt in de UNS terecht.
2. De MES start een bewerking; het event "bewerking gestart" bevat station en order.
3. Machinedata wordt in de datastroom verrijkt met het actuele ordernummer.
4. De MES bevestigt hoeveelheden en tijden; het ERP boekt ze.
5. Fabric koppelt alle events tot een volledige orderhistorie voor analyse en genealogie.

---

## AI en Copilot in de maakindustrie

Generatieve AI is de maakindustrie binnengekomen, maar anders dan verwacht in 2024. Microsoft heeft zijn manufacturing-specifieke agent-previews (Factory Operations Agent, Factory Safety Agent) in 2025 uitgefaseerd [2] en vertrouwt in plaats daarvan op generieke platformbouwstenen: Microsoft Foundry voor agents en modellen [20], Copilot in Fabric voor vragen over data [17], en Copilot Studio en Microsoft 365 Copilot voor scenario's op de werkvloer. Op Ignite 2025 zijn Fabric IQ en Foundry IQ als preview verschenen, bedoeld om agents respectievelijk een semantische laag en een kennisbank te geven [34]. De levenscyclusbenadering geldt hier ook: prompt flow, een veelgebruikt hulpmiddel voor vroege LLM-toepassingen in Foundry en Azure Machine Learning, wordt op 20 april 2027 uitgefaseerd; Microsoft raadt aan over te stappen op het Microsoft Agent Framework [37].

### Realistische scenario's

| Scenario | Bouwstenen | Vereiste |
|---|---|---|
| Vragen in natuurlijke taal over productiedata ("Waarom was lijn 3 gisteren langzamer?") | Copilot in Fabric, Fabric data agents, ontologie [16], [17] | Schoon datamodel, begrijpelijke tabel- en kolomnamen, gedefinieerde KPI's |
| Samenvatten van overdrachten tussen diensten en incidentrapporten | Microsoft 365 Copilot, Teams, Copilot Studio | Gestructureerde registratie, bijvoorbeeld via Power Apps of Teams-formulieren |
| Onderhoudsassistent (zoeken in handleidingen en storingshistorie) | Microsoft Foundry met retrieval, Copilot Studio | Documenten digitaal en actueel, rechten onderhouden |
| Visuele kwaliteitsinspectie | Computer-visionmodellen, inferentie aan de rand (edge) | Gelabelde beelddata (third-party labeling tool, omdat Azure ML data labeling is uitgefaseerd [38]), stabiele belichting |
| Planningsassistent (scenario's vergelijken) | Industriële toepassing (APS, simulatie) plus AI | Een geldig planningsmodel |

### Microsoft 365 als brug naar de productievloer

Voor organisaties die al Microsoft 365 gebruiken, ligt de grootste hefboom op korte termijn vaak helemaal niet in Azure, maar in het koppelen van gebeurtenissen op de productievloer aan de werkplek:

- **Teams voor medewerkers in de productie:** Communicatie per dienst, taken, meldingen van Activator of Power Automate direct in Teams [17].
- **Power BI:** KPI-rapporten voor management en plantleiding, gebouwd op dezelfde Fabric-data.
- **Power Apps:** Redenen voor stilstand, kwaliteitsbevindingen en feedback over onderhoud vastleggen op tablets bij de werkplek. Zo ontstaan precies de labels die predictive maintenance nodig heeft.
- **Copilot:** Samenvattingen van dienstrapporten, afwijkingsanalyses en notulen van overleggen op de productievloer.
- **Licenties tijdig regelen:** Medewerkers op de productievloer krijgen doorgaans frontline-licenties (Microsoft 365 F1 of F3). Controleer vóór de uitrol welke mogelijkheden zij hebben, zoals Power Apps of Copilot, en welke add-onlicenties nodig zijn; anders loopt een goede pilot vast bij opschaling.

### Grenzen en governance

- **Geen besturingsbeslissingen door taalmodellen.** Taalmodellen horen thuis in ondersteuning, niet in de gesloten besturingslus van een machine.
- **Gebruik een risicokader.** Het **NIST AI Risk Management Framework (AI RMF 1.0)**, uitgebracht op 26 januari 2023, is een vrijwillig kader met vier functies: Govern, Map, Measure en Manage [63]. Het is een praktische manier om risico's van AI in kwaliteitsinspectie of planning te documenteren voor klanten en auditors.
- **EU AI Act voor operaties in de EU:** Als u AI-systemen draait in fabrieken in de EU of daar AI-gestuurde producten verkoopt, controleer dan of een systeem wordt gebruikt als veiligheidscomponent van een product of voor het beheer van medewerkers; verplichtingen voor hoog-risicosystemen kunnen dan gelden. De "Digital Omnibus on AI" (Verordening (EU) 2026/1744, sinds eind juli 2026 van kracht) heeft deze termijnen uitgesteld: tot 2 december 2027 voor zelfstandige hoog-risicosystemen (bijvoorbeeld in HR) en tot 2 augustus 2028 voor systemen die in producten zijn ingebed. AI in machines wordt gereguleerd via gedelegeerde handelingen onder de EU-Machineverordening [46]. De classificatie van uw specifieke systeem vraagt een juridische beoordeling.
- **Personeel en arbeidsverhoudingen:** Systemen die prestaties of gedrag van medewerkers kunnen beoordelen, roepen arbeidsrechtelijke vragen op. Controleer in Amerikaanse fabrieken met vakbondsvertegenwoordiging of uw collectieve arbeidsovereenkomst prestatiemonitoring regelt; in Duitse fabrieken vereisen dergelijke systemen over het algemeen de instemming van de ondernemingsraad (Betriebsrat), die medebeslissingsrechten heeft. Betrek in beide gevallen vroegtijdig de vertegenwoordigers van het personeel.
- **Rechten:** Copilot toont wat een gebruiker mag zien. Te ruime deling in SharePoint of Fabric wordt via AI zichtbaar.

---

## FinOps voor industriële IT

Cloudkosten in de maakindustrie gedragen zich anders dan klassieke IT-workloads: datavolumes groeien met elke aangesloten machine, workloads draaien dag en nacht, en een deel van de infrastructuur staat in de fabriek. FinOps helpt om deze kosten voorspelbaar te maken en te koppelen aan waarde. De aflevering [FinOps for Manufacturing IT](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/) behandelt de specifieke aspecten.

### Het FinOps-framework in het kort

Microsoft baseert zijn FinOps-richtlijnen op het FinOps Foundation-framework [25]. Het bestaat uit zes principes (waaronder "Teams need to collaborate", "Business value drives technology decisions" en "Take advantage of the variable cost model of the cloud"), drie levenscyclusfasen (Inform, Optimize, Operate) en vier domeinen [25]:

| Domein | Wat het betekent voor de maakindustrie |
|---|---|
| Gebruik en kosten begrijpen | Kosten per fabriek, lijn en use case zichtbaar maken (tagging, afzonderlijke Fabric-capaciteiten of werkruimten) |
| Zakelijke waarde kwantificeren | Kosten per goed product, per aangesloten machine of per vermeden uur stilstand |
| Gebruik en kosten optimaliseren | Datavolume aan de edge verminderen, bewaartermijnen in lagen indelen, capaciteiten passend dimensioneren |
| FinOps-praktijk beheren | Verantwoordelijkheden, beleid, doorbelasting aan fabrieken |

Het framework adviseert de volwassenheid per capaciteit te beoordelen in plaats van over het geheel heen, en die elke drie tot zes maanden opnieuw te bekijken [25].

### De tien belangrijkste kostenhefbomen

1. **Aggregeren aan de edge:** Niet elke waarde op een resolutie van één seconde hoeft de cloud te bereiken. Datastromen kunnen filteren en aggregeren [3]. Dit is de grootste afzonderlijke hefboom.
2. **Verzenden bij wijziging:** Standaard stuurt de OPC UA-connector alleen gewijzigde waarden en voegt periodiek key frames toe met alle waarden, zodat consumenten de toestand kunnen herstellen [4]. Controleer daarnaast de deadbands in de controller of OPC UA-server, zodat ruis niet als wijziging telt.
3. **Eventstreams consolideren:** Per fabriek in plaats van per bron, met transformaties in het Eventhouse [31].
4. **Bewaartermijnen in lagen indelen:** Hot data in de Eventhouse-cache voor dagen of weken, oudere data in OneLake-opslag.
5. **Fabric-capaciteit bewust dimensioneren:** Het gebruik bewaken met de app Capacity Metrics, ontwikkel- en productieworkloads scheiden, capaciteiten pauzeren die u niet nodig heeft. Pauzeren is gedocumenteerd voor F-SKU's; bij pauzeren worden opgebouwde overschrijdingen direct gefactureerd en is de inhoud van de capaciteit niet beschikbaar [47]. Een capaciteit die een Eventstream of een fabrieksdashboard bedient, is daarom geen kandidaat om te pauzeren.
6. **Kies de juiste edge-SKU:** Sinds release 2610 biedt Azure IoT Operations naast Standard een goedkopere Essentials-SKU voor implementaties met veel data, beperkt tot clusters met één knooppunt en zonder de OPC UA-connector [3]. Die past bijvoorbeeld bij locaties waarvan de data al via MQTT of HTTP binnenkomt. Controleer per locatie welke functies u werkelijk nodig heeft.
7. **Gebruik reserveringen en savings plans** voor Azure-resources die continu draaien.
8. **Kosten toewijzen:** Dwing tags af voor fabriek, kostenplaats en use case (Azure Policy).
9. **Eenheidseconomie invoeren:** Rapporteer de cloudkosten per geproduceerde eenheid of per aangesloten machine. Pas dan kunt u fabrieken met elkaar vergelijken.
10. **Legacy uitfaseren:** Migreer diensten die worden uitgefaseerd (IoT Central, IoT Edge 1.5) voordat parallelle structuren uw kosten verdubbelen.

### Vergeet de edge-kosten niet

Hardware in de fabriek, Kubernetes-beheer, licenties voor Azure Arc-enabled services en het personeel voor updates horen in dezelfde berekening thuis. Een businesscase die alleen naar de Azure-rekening kijkt, onderschat de totale kosten systematisch. Deze gids geeft bewust geen prijzen, omdat die vaak veranderen; de actuele prijsmodellen voor Azure IoT Operations (Standard en Essentials), Azure Arc en Azure Local vindt u op de Azure-prijspagina's en in de Azure-prijscalculator.

---

## Het businesscase opstellen voor Azure in de maakindustrie

Algemene batenclaims uit brancheonderzoeken helpen zelden om een budget goedgekeurd te krijgen, omdat ze uw uitgangspunt niet kennen. Een berekeningslogica die u met uw eigen cijfers invult, is robuuster.

### Batencategorieën

| Categorie | Berekening | Gegevensbron |
|---|---|---|
| Vermeden ongeplande stilstand | Stilstanduren × bijdragemarge per uur × verwachte reductie | MES-stilstandhistorie, financiën |
| Hogere OEE | Extra goede producten × bijdragemarge per product | OEE-uitgangspunt |
| Lagere kosten van afval en herbewerking | Afvalhoeveelheid × productiekosten × reductie | QMS |
| Snellere afhandeling van klachten | Uren per klacht × uurtarief × reductie; kleinere terugroepactie | Klachtenhistorie |
| Onderhoudskosten | Voorraad reserveonderdelen, diensten van contractors, overwerk | ERP-onderhoud |
| Compliance | Vermeden inspanning voor handmatig bewijs (audits, FSMA 204-verzoeken, CMMC-beoordelingen, DPP) | Kwaliteits- en compliance-team |

### Kostencategorieën

- Edge-hardware en -beheer per fabriek
- Azure- en Fabric-verbruik (doorlopend)
- Licenties (Power BI, Copilot, industriële toepassingen, OT-beveiliging waar nodig)
- Implementatie (intern en extern)
- Change management en training
- Retrofitsensoren voor oudere machines

### Uitgewerkt voorbeeld met fictieve cijfers

Een lijn heeft 120 uur ongeplande stilstand per jaar, en de bijdragemarge bedraagt $1.600 per uur. Als condition monitoring en snellere reactie 20 procent van die uren vermijden, is dat 24 uur × $1.600 = $38.400 per jaar. Daartegenover staan de toegerekende kosten: edge-hardware en -beheer, Fabric-verbruik, licenties en interne uren. De cijfers zijn bewust eenvoudig. Belangrijk is dat elke aanname een bron binnen uw bedrijf heeft (MES-historie, financiën) en dat u de reductie na drie tot zes maanden meet ten opzichte van het uitgangspunt.

### Vuistregel voor prioritering

Begin met de use case waarin drie voorwaarden samenkomen: een meetbaar uitgangspunt, beschikbare data en een procesverantwoordelijke die de resultaten wil gebruiken. Dat is vaker realtime OEE of traceerbaarheid dan predictive maintenance.

---

## Roadmap: vijf fasen naar een schaalbaar Azure-platform voor de maakindustrie

De onderstaande roadmap volgt het gangbare patroon "eerst fundament en één lighthouse use case, daarna opschalen". De doorlooptijden zijn richtlijnen voor een eerste fabriek en hangen sterk af van uw uitgangspunt, netwerkgoedkeuringen en beschikbare capaciteit.

### Fase 1: Duidelijkheid (4 tot 8 weken)

- Portfolio van use cases met batenschattingen; selectie van één of twee lighthouse use cases
- Huidige situatie: machinepark, protocollen (is OPC UA beschikbaar?), netwerk, bestaande systemen
- Doelgegevensmodel (ISA-95-hiërarchie, UNS-topicconventie)
- Beveiligingsconcept met OT-beveiliging, CSF 2.0-profiel, CMMC-scope waar relevant, privacy en ondernemingsraad
- Levenscycluscontrole van alle diensten aan de hand van de statustabel in deze gids

### Fase 2: Fundament (6 tot 12 weken)

- Edge-infrastructuur in de pilotfabriek, Arc-verbinding, Azure IoT Operations
- Fabric-werkruimtestructuur, capaciteitsplanning, toegangsmodel
- Eerste machines verbonden via OPC UA, assets in Azure Device Registry
- FinOps-basis: tags, budgetten, kostenrapportages per fabriek

### Fase 3: Eerste waarde (8 tot 12 weken)

- Lighthouse use case in de productie, bijvoorbeeld realtime OEE met vastlegging van stilstandredenen in een Power App
- Dashboard op de werkvloer en managementrapport
- Uitgangspunt en eerste meting van het effect

### Fase 4: Verdieping (3 tot 6 maanden)

- ERP- en MES-context geïntegreerd, orderhistorie en genealogie
- Condition monitoring, verzamelen van labels voor predictive maintenance
- Eerste Copilot-scenario's op gecureerde data

### Fase 5: Opschaling (vanaf maand 9 tot 15, afhankelijk van de voortgang)

- Uitrol naar meer lijnen en fabrieken met infrastructure as code en GitOps
- KPI's over meerdere fabrieken met uniforme definities
- Predictive maintenance voor geselecteerde assets, digitale-tweelingscenario's
- Operating model: platformteam, dataproductverantwoordelijken per domein, releasemanagement voor de meestal maandelijkse releases van Azure IoT Operations [7]

De kernverschuiving is van proof of concept naar minimum viable product: een PoC bewijst dat de technologie werkt. Een MVP bewijst dat mensen beter werken met de technologie. Als u die verschuiving wilt verankeren in een breder verbeterprogramma, zie onze gidsen over [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) en [operational excellence](https://www.m365.fm/en/learn/operational-excellence/).

---

## Veelvoorkomende fouten in Azure-productieprojecten

1. **Technologie vóór de vraag:** Een platform bouwen zonder een bedrijfsonderdeel dat een specifiek probleem wil oplossen.
2. **Preview als fundament:** Bedrijfslogica op preview-services zetten. De uitfasering van Manufacturing data solutions en de factory agents laat het risico zien [2].
3. **Verouderde bouwstenen uit oude gidsen:** Nieuwe projecten plannen op IoT Central, Time Series Insights of IoT Edge 1.5 omdat een artikel uit 2021 ze aanbeveelt [8], [10], [12].
4. **Verkeerde SKU:** Azure IoT Operations Essentials plannen voor een fabriek met OPC UA-machines, hoewel die SKU de OPC UA-connector niet bevat [3].
5. **Geen statusmodel:** Machinespecifieke statuscodes ongefilterd overnemen. Vergelijkingen tussen fabrieken worden dan onmogelijk.
6. **Alles naar de cloud:** Ruwe data in volledige resolutie versturen en verrast zijn door de factuur.
7. **OT-beveiliging als bijzaak:** Een edge-cluster op het netwerk plaatsen zonder zonesconcept en schrijftoegang tot controllers open laten.
8. **Labels vergeten:** Predictive maintenance starten zonder gestructureerde storingshistorie.
9. **KPI's zonder definities:** OEE-dashboards bouwen voordat fabrieken het eens zijn over beschikbaarheidsdefinities.
10. **Operations onderschatten:** Regelmatige releases, Kubernetes-updates, certificaatvernieuwing en een broker-buffer die alleen bij de initiële uitrol ingesteld kan worden [40], zonder dat iemand verantwoordelijk is.
11. **Mensen buiten spel zetten:** Medewerkers op de werkvloer horen van het project wanneer de tablet bij hun werkplek wordt gemonteerd.
12. **Het compliancebereik negeren:** Tekeningen of specificaties voor defensieonderdelen in een gedeelde Fabric-werkruimte plaatsen zonder CMMC-scopingbeslissing.

---

## Industrietoepassingen in het Microsoft-ecosysteem

> **Opmerking: de auteur werkt bij iFAKT GmbH.**

Een platform gebouwd op Azure IoT Operations en Fabric levert data, maar geen bedrijfslogica voor planning, waardestromen of simulatie. Industrietoepassingen die beschikbaar zijn via Microsoft AppSource of de Microsoft Marketplace vullen die leemte op.

Een voorbeeld is [Polaris](https://www.m365.fm/entity/polaris/) van [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), een softwarebedrijf met hoofdkantoor in Stuttgart, Duitsland. De leverancier omschrijft Polaris als software om productie te digitaliseren, te simuleren en te optimaliseren, met de modules VSM/BSM (modellering van waardestromen en swimlanes), Simulator, Optimizer (planning), Operator en Analyzer (KPI-analyse). Volgens de leverancier is de planning restrictiegebaseerd en houdt ze rekening met middelen, kwalificaties, diensten en buffers; een KPI-cockpit toont doorlooptijd, voorraad, benutting en levering op tijd. Polaris VSM staat vermeld als SaaS-aanbod in de Microsoft Marketplace [33]; Microsoft heeft iFAKT uitgelicht als onderdeel van het programma "ISV Success for Business Applications" [32]. Onze gids over [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) beschrijft het product uitgebreider.

In de architectuur van deze gids bevindt zo'n toepassing zich in de lagen 6 tot en met 8: ze gebruikt proces- en orderdata om waardestromen te modelleren, scenario's te simuleren en plannen te optimaliseren. Hoe een concrete integratie met uw dataplatform eruitziet, moet u met de leverancier verduidelijken; dit artikel doet daarover geen uitspraken.

Ongeacht de leverancier helpen vier vragen bij de selectie van dergelijke toepassingen: Leest de toepassing data uit open formaten (bijvoorbeeld Delta-tabellen in OneLake of events van de broker), of heeft ze eigen interfaces nodig? Welk systeem is de system of record voor stamgegevens zoals routings en capaciteiten? Waar draaien data en berekeningen (regio, tenant)? En hoe komen resultaten, zoals een geoptimaliseerd plan, op gecontroleerde wijze terug in de ERP of MES?

---

## FAQ

### Wat is Azure voor de maakindustrie?

Azure voor de maakindustrie is de verzameling van Microsoft-cloud- en edge-diensten waarmee fabrikanten fabrieken verbinden, productiedata opslaan en analyseren, en er AI- en werkplekapplicaties op bouwen. In 2026 bestaat de kern uit Azure IoT Operations op Arc-enabled Kubernetes in de fabriek, Microsoft Fabric als dataplatform, en Foundry, Power BI en Copilot voor analyse en AI [3], [17]. Microsoft verpakt zijn industrieverhaal als "Microsoft for Manufacturing", dat Azure, Dynamics 365 en Microsoft 365 combineert [1].

### Wat is het verschil tussen Azure IoT Hub en Azure IoT Operations?

IoT Hub is een clouddienst waarmee afzonderlijke apparaten rechtstreeks verbinding maken. Azure IoT Operations is een data plane die in de fabriek draait op Arc-enabled Kubernetes en machines via OPC UA en andere connectors verbindt met een lokale MQTT-broker [3]. Voor fabrieken met veel machines is Azure IoT Operations meestal het juiste startpunt; IoT Hub past bij gedistribueerde, rechtstreeks verbonden apparaten. Voor de afwegingen met IoT Edge, zie [Azure IoT Edge vs Azure IoT Operations: Choosing the Right Industrial Architecture](https://www.m365.fm/community/u/mirko-p/blog/azure-iot-edge-vs-azure-iot-operations/).

### Wordt Azure IoT Central uitgefaseerd?

Ja. Sinds 23 september 2026 kunnen er geen nieuwe IoT Central-applicaties meer worden aangemaakt; bestaande applicaties blijven werken tot 20 september 2029. Microsoft beveelt als doel IoT Hub met de Device Provisioning Service, Azure Device Registry en Microsoft Fabric aan; dashboards en analyse verhuizen naar Fabric Real-Time Intelligence [8], [64]. Een uitfasering-melding voor 31 maart 2027 die in februari 2024 in de Azure-portal verscheen, heeft Microsoft destijds als onjuist systeembericht ingetrokken [9]. De aankondiging uit 2026 is daarentegen een gewone melding met een looptijd van drie jaar.

### Wat verving Azure Time Series Insights?

Time Series Insights is op 7 juli 2024 uitgefaseerd. Microsoft noemt de Eventhouse in Microsoft Fabric Real-Time Intelligence als migratiedoel [10]. Als u Fabric niet gebruikt, is Azure Data Explorer een alternatief dat eveneens KQL gebruikt [19].

### Wat is er gebeurd met Microsoft Cloud for Manufacturing?

Het industrieaanbod heet nu "Microsoft for Manufacturing" en bundelt mogelijkheden uit Azure, Dynamics 365 en Microsoft 365 [1]. De specifieke previews "Manufacturing data solutions" en "Factory Operations Agent" zijn op 30 mei 2025 uitgefaseerd, en de "Factory Safety Agent" op 23 juni 2025 [2]. Er is geen afzonderlijke melding voor "Manufacturing data solutions in Microsoft Fabric"; neem dit niet op in nieuwe projecten.

### Welke Azure-diensten heb ik nodig voor een slimme fabriek?

Voor een typische fabrieksaansluiting: Azure Arc en een Kubernetes-cluster in de fabriek, Azure IoT Operations erbovenop (broker, OPC UA-connector, dataflows), Azure Device Registry voor assets, Microsoft Fabric met Eventstream, Eventhouse en Activator voor realtime data, en Power BI voor rapportage [3], [17]. AI-bouwstenen (Fabric Data Science, Azure Machine Learning, Microsoft Foundry) en digitale tweelingen komen later. Entra ID, Azure Policy, Cost Management en een OT-beveiligingsoplossing vormen het kader.

### Wat is het verschil tussen Azure IoT Operations Essentials en Standard?

Standard biedt de volledige functionaliteit. Essentials, beschikbaar sinds release 2610, is een goedkopere optie voor deployments met veel volume; het draait alleen op clusters met één node en bevat de OPC UA-connector niet [3]. Voor fabrieken met OPC UA-machines is Standard het startpunt.

### Heb ik Kubernetes-kennis nodig voor Azure IoT Operations?

Ja, in elk geval voor het beheer. Azure IoT Operations draait op Arc-enabled Kubernetes-clusters en wordt geconfigureerd op de Kubernetes-manier [3]. Om te beginnen documenteert Microsoft installaties op Ubuntu en op Windows met AKS Edge Essentials [3]. Plan ontwikkeling van vaardigheden of een partner voor beheer in.

### Blijft de productie doorlopen als de internetverbinding uitvalt?

Volgens Microsoft kan Azure IoT Operations maximaal 72 uur offline werken, mogelijk met beperkingen, en hervat het de volledige functionaliteit bij herverbinding [3]. Hoeveel berichten in die tijd worden gebufferd, hangt af van de brokerconfiguratie, die bij de eerste uitrol wordt ingesteld [40]. Besturingsfuncties mogen nooit van de cloud afhangen; de besturing blijft in PLC's en lokale systemen.

### Azure Digital Twins of digital twin builder in Fabric?

Azure Digital Twins is een algemeen beschikbare service met DTDL-modellen en API-toegang [14]. Digital twin builder maakt deel uit van Fabric Real-Time Intelligence, werkt met ontologieën op OneLake-data en is in preview [15]. Voor productie-, door ontwikkelaars gedreven twins is Azure Digital Twins vandaag de veilige keuze; voor analytische twins op een Fabric-platform is een pilot met digital twin builder de moeite waard. Mirko Peters legt een verwant onderscheid uit, tussen de device twin in IoT Hub en Azure Digital Twins, in [Device Twin vs Azure Digital Twins: Choosing the Right Layer for Industrial IoT](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/).

### Welke data heb ik nodig voor predictive maintenance?

Conditievariabelen met een geschikte samplingfrequentie, gesynchroniseerde tijdstempels, bedrijfscontext (order, product, machinestatus) en vooral een gelabelde storingshistorie uit het onderhoud. Zonder storingshistorie is in eerste instantie alleen anomaliedetectie mogelijk.

### Wat betekent de uitfasering van Defender for IoT voor mijn OT-beveiliging?

Op 2 november 2026 heeft Microsoft officieel aangekondigd dat het de OT-beveiligingscomponent van Defender for IoT in oktober 2029 volledig zal uitfaseren; tot die tijd zijn er alleen beveiligingsupdates en bugfixes [22]. Een blog van een Microsoft-partner noemt in plaats daarvan 31 mei 2028 als einde van de ondersteuning [39]. Er is geen eigen vervanging van Microsoft; Microsoft biedt connectors voor Armis, Dragos en Forescout, waarvan de oplossingen apart gelicentieerd worden [22]. Plan de vervanging zo dat deze vóór half 2028 volledig is afgerond.

### Is IoT Edge nog de moeite waard?

IoT Edge als product wordt nog ondersteund. Versie 1.5 LTS bereikte het einde van de ondersteuning op 10 november 2026; de huidige versie 1.6 LTS wordt ondersteund tot 14 november 2028 [12]. Voor bestaande Linux-apparatenparken is updaten naar 1.6 het directe pad. Voor Windows-apparaten op EFLOW 1.5 vermeldt de versiepagina geen EFLOW 1.6 LTS; verduidelijk daar het doelpad. Voor nieuwe dataplatforms in fabrieken kunt u Azure IoT Operations evalueren.

### Is Azure CMMC-conform?

Er bestaat geen CMMC-certificering voor Azure zelf, omdat CMMC van toepassing is op de systemen van een aannemer en niet op een cloudplatform [55]. Microsoft stelt dat Azure en Azure Government beide FedRAMP High-autorisaties hebben die NIST SP 800-171 dekken, dat u CMMC-certificering kunt verkrijgen voor oplossingen in beide clouds, en dat de meeste defensieaannemers het best aansluiten bij Azure Government [55]. De DFARS-regeling die CMMC-eisen in DoD-contracten opneemt, wordt sinds 10 november 2025 in fasen uitgerold [54].

### Welk beveiligingsraamwerk moet een Amerikaanse fabrikant gebruiken voor Azure en OT?

Gebruik ze samen. NIST CSF 2.0 biedt de governancestructuur en een gemeenschappelijke taal met management, verzekeraars en klanten [49]; ISA/IEC 62443 biedt het technische model voor OT (zones, conduits, beveiligingsniveaus) [27]; NIST SP 800-82 Rev. 3 verbindt beide met OT-specifieke richtlijnen en controle-overlays [50]. Voeg CMMC toe als u FCI of CUI voor het DoD verwerkt [53], en NIS2 voor Europese vestigingen [41].

### Hoeveel kost Azure voor de maakindustrie?

Er is geen betrouwbaar algemeen bedrag. De kosten hangen af van het aantal fabrieken en machines, datavolume, retentie, de gekozen Fabric-capaciteit, edge-hardware en licenties. De grootste hefboom is dataaggregatie aan de edge. Gebruik de Azure-prijscalculator en introduceer FinOps-praktijken vanaf fase 2 [25].

### Welke rol speelt Microsoft 365 in de maakindustrie?

Microsoft 365 is de werkplekLaag: Teams voor ploegoverdracht en meldingen, Power BI voor KPI's, Power Apps voor gegevensregistratie aan de werkplek en Copilot voor samenvattingen en vragen over data. Voor bedrijven met een gevestigde Microsoft 365-omgeving is deze koppeling vaak de snelste manier om shopfloordata bruikbaar te maken.

### Waar begin ik als Microsoft 365- of Azure-beheerder?

Met de taken die sowieso bij de centrale IT liggen: Entra ID-rollen voor OT-medewerkers en partners, een Azure landing zone met tagbeleid per fabriek, een Arc-testcluster inclusief firewallgoedkeuringen via de proxyketen, en een Fabric-werkruimtestructuur. Tegelijkertijd kunt u met de OT-verantwoordelijke afstemmen om het zonemodel van de fabriek te begrijpen. Details staan in de sectie "Waar te beginnen als Microsoft 365- of Azure-beheerder" aan het begin van deze gids.

---

## Conclusie

Azure voor de maakindustrie in 2026 gaat minder over het kiezen van diensten dan over discipline. De technische basis is duidelijk: Azure IoT Operations op Arc in de fabriek, Microsoft Fabric als dataplatform, en Foundry, Power BI en Copilot voor analyse en de werkplek. Tegelijkertijd laten de buitengebruikstelling van Time Series Insights en de productiegerichte previews, en de geplande buitengebruikstelling van IoT Central en van OT-beveiliging in Defender for IoT zien dat levenscyclusbeheer onderdeel is van het architectuurwerk.

Drie zaken maken het verschil: een eigen, toolneutraal datamodel gebaseerd op ISA-95, een beveiligingsontwerp gebaseerd op ISA/IEC 62443 en NIST CSF 2.0 dat ook CMMC of NIS2 omvat waar die van toepassing zijn, en een consequente focus op use cases met een gemeten uitgangspunt. Als u zo werkt, bouwt u een platform dat predictive maintenance, traceerbaarheid, digitale tweelingen en AI vanuit dezelfde datafundering bedient, en dat de volgende hernoeming door Microsoft overleeft.

### Verder lezen op m365.fm

**Afleveringen**
- [Predictive Maintenance op Azure: wat u werkelijk nodig heeft voordat het model komt](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/)
- [FinOps voor IT in de maakindustrie](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/)
- [Traceerbaarheid en genealogie](https://www.m365.fm/show/episodes/traceability-and-genealogy/)
- [Digitale tweelingen op Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/)
- [Waardestroomanalyse als live datamodel](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Artikelen**
- [Digitale tweeling in de maakindustrie: waar begint u?](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/)
- [Van ERP naar de fabrieksvloer: de digitale tweeling opbouwen](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Productieplanning in de lucht- en ruimtevaart: doorlooptijd en traceerbaarheid](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)
- [Azure IoT Edge vs Azure IoT Operations: de juiste industriële architectuur kiezen](https://www.m365.fm/community/u/mirko-p/blog/azure-iot-edge-vs-azure-iot-operations/)
- [Device Twin vs Azure Digital Twins: de juiste laag kiezen voor industriële IoT](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/)

**Woordenlijst**
- [Industrie 4.0](https://www.m365.fm/entity/industry-4-0/) · [Digitale tweeling](https://www.m365.fm/entity/digital-twin/) · [ERP](https://www.m365.fm/entity/enterprise-resource-planning/) · [Geavanceerde planning en scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Virtuele inbedrijfstelling](https://www.m365.fm/entity/virtual-commissioning/)

**Gerelateerde gidsen**
- [Digitale tweeling in de maakindustrie](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Productieplanning en APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Productie-KPI's](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Shop floor management](https://www.m365.fm/en/learn/shop-floor-management/)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Productieplanning in de lucht- en ruimtevaart](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [Waardestroomanalyse](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is de host van m365.fm en werkt bij [iFAKT GmbH](https://www.m365.fm/entity/ifakt/). Op m365.fm schrijft hij over het snijvlak van productieplanning, digitale tweelingen en de Microsoft-cloud, en vertaalt hij productieonderwerpen zoals waardestromen, traceerbaarheid en predictief onderhoud voor een publiek van Microsoft 365- en Azure-gebruikers.

**Let op: de auteur werkt bij iFAKT GmbH.**

*Laatst beoordeeld: 20 november 2026 (feitencontrole tegen primaire bronnen van Microsoft, NIST, CISA, FDA, SEC, BSI en de EU). Volgende beoordeling van de servicestatustabel: februari 2027.*

# Sources

All sources retrieved on November 20, 2026, unless noted. Sources 1 to 48 are carried over from the German edition; 49 to 64 are new for the US edition.

1. What is Microsoft for Manufacturing? Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/overview
2. What's new in Microsoft for Manufacturing. Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/whats-new
3. What is Azure IoT Operations? Microsoft Learn (last updated November 11, 2026). https://learn.microsoft.com/en-us/azure/iot-operations/overview-iot-operations
4. What is the connector for OPC UA? (Azure IoT Operations). Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector
5. Azure IoT Operations now Generally Available. Microsoft Tech Community (IoT Blog). https://techcommunity.microsoft.com/blog/iotblog/azure-iot-operations-now-generally-available/4282445
6. Azure IoT Operations 2603 is now available: Powering the next era of Physical AI. Microsoft Tech Community (IoT Blog). https://techcommunity.microsoft.com/blog/iotblog/azure-iot-operations-2603-is-now-available-powering-the-next-era-of-physical-ai/4509342
7. Releases: Azure/azure-iot-operations. Microsoft on GitHub. https://github.com/Azure/azure-iot-operations/releases
8. Azure IoT Central is evolving: what you need to know. Microsoft Tech Community (IoT Blog), September 25, 2026. https://techcommunity.microsoft.com/blog/iotblog/azure-iot-central-is-evolving-what-you-need-to-know/4554570
9. Microsoft Confirms Azure IoT Central Commitment. Automation World, February 27, 2024. https://www.automationworld.com/communication/article/33037810/microsoft-confirms-azure-iot-central-commitment
10. Migrating Time Series Insights Gen2 to Real-Time Intelligence in Microsoft Fabric. Microsoft Learn (archived page; newer version at https://learn.microsoft.com/en-us/previous-versions/azure/time-series-insights/migration-to-fabric). https://learn.microsoft.com/en-us/azure/time-series-insights/how-to-tsi-gen2-migration
11. Retirement of Azure Percept DK. Microsoft Learn. https://learn.microsoft.com/en-us/azure/azure-percept/retirement-of-azure-percept-dk
12. Azure IoT Edge versions and release notes. Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-edge/version-history
13. Azure IoT Edge: Microsoft Lifecycle. Microsoft Learn. https://learn.microsoft.com/en-us/lifecycle/products/azure-iot-edge
14. What is Azure Digital Twins? Microsoft Learn. https://learn.microsoft.com/en-us/azure/digital-twins/overview
15. What is digital twin builder (preview)? Microsoft Fabric, Microsoft Learn (last updated May 20, 2026). https://learn.microsoft.com/en-us/fabric/real-time-intelligence/digital-twin-builder/overview
16. Ontology (preview) overview, Fabric IQ. Microsoft Learn (October 16, 2026). https://learn.microsoft.com/en-us/fabric/iq/ontology/overview
17. Connected Factory Reference Architecture. Microsoft Fabric, Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/architectures/connected-factory
18. Transform your business with Real-Time Intelligence, now generally available. Microsoft Fabric Updates Blog. https://blog.fabric.microsoft.com/fi-fi/blog/transform-your-business-with-real-time-intelligence-now-generally-available
19. What is Azure Data Explorer? Microsoft Learn (July 23, 2026). https://learn.microsoft.com/en-us/azure/data-explorer/data-explorer-overview
20. What is Microsoft Foundry? Microsoft Learn. https://learn.microsoft.com/azure/foundry/what-is-foundry
21. New name for Azure Stack HCI / Azure Local. Microsoft Learn. https://learn.microsoft.com/en-us/azure/azure-local/rename-to-azure-local
22. Retirement: OT security in Microsoft Defender for IoT. Azure Updates, ID 576255, November 2, 2026. https://azure.microsoft.com/updates?id=576255 (full text via the Release Communications API: https://www.microsoft.com/releasecommunications/api/v2/azure/576255; mirror: https://mc.merill.net/message/AZ576255)
23. What's new in Microsoft Defender for IoT? Microsoft Learn. https://learn.microsoft.com/en-us/azure/defender-for-iot/organizations/whats-new
24. Microsoft Defender now integrates with Dragos, Forescout & Armis for OT Security. Microsoft Tech Community, July 2026. https://techcommunity.microsoft.com/blog/microsoftthreatprotectionblog/microsoft-defender-now-integrates-with-dragos-forescout--armis-for-ot-security/4534936
25. FinOps Framework. Microsoft Learn (Microsoft Cloud FinOps). https://learn.microsoft.com/en-us/cloud-computing/finops/framework/finops-framework
26. ISA-95 Standard. International Society of Automation (ISA). https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
27. Quick Start Guide: An Overview of ISA/IEC 62443 Standards. ISA Global Cybersecurity Alliance. https://gca.isa.org/hubfs/ISAGCA%20Quick%20Start%20Guide%20FINAL.pdf
28. Cybersicherheitsrecht: NIS-2-Umsetzungsgesetz ab morgen in Kraft (NIS2 implementation act in force tomorrow). BSI press release, December 5, 2025 (German). https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2025/251205_NIS-2-Umsetzungsgesetz_in_Kraft.html; also: Zweiter Schritt zur NIS-2-Registrierung: BSI-Portal ab sofort freigeschaltet (second registration step: BSI portal open). BSI, January 6, 2026 (German). https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2026/260601_NIS2_BSI-Portal.html
29. Digital Product Passport (including the Batteries subpage). European Commission, DG GROW. https://single-market-economy.ec.europa.eu/single-market/digital-product-passport_en and https://single-market-economy.ec.europa.eu/single-market/digital-product-passport/batteries_en
30. Cyber Resilience Act: Reporting obligations. European Commission. https://digital-strategy.ec.europa.eu/en/policies/cra-reporting
31. Smart Manufacturing: Unlocking Real-Time Intelligence With Azure IoT Operations and Microsoft Fabric. b.telligent. https://www.btelligent.com/en/blog/real-time-intelligence-azure-iot-microsoft-fabric
32. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource. Microsoft Tech Community (Marketplace Blog), July 11, 2024. https://techcommunity.microsoft.com/blog/marketplace-blog/learn-about-ifakt-gmbhs-isv-success-for-business-applications-solution-in-micros/4182536
33. Polaris VSM: Digital Value Stream Mapping. Microsoft Marketplace. https://marketplace.microsoft.com/en-us/product/saas/ifaktgmbh.ifakt_vsm_1?tab=overview
34. Microsoft Ignite 2025: Ten Things You Need to Know. Directions on Microsoft, November 18, 2025. https://www.directionsonmicrosoft.com/microsoft-ignite-2025-ten-things-you-need-to-know/
35. OPC 10030: ISA-95 Common Object Model, section 4.2.3 ISA-95. OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3
36. Integration with Azure Device Registry (preview). Azure IoT Hub, Microsoft Learn. https://learn.microsoft.com/en-gb/azure/iot-hub/iot-hub-device-registry-overview
37. What is Azure Machine Learning? Microsoft Learn (includes the notice that prompt flow retires on April 20, 2027). https://learn.microsoft.com/en-us/azure/machine-learning/overview-what-is-azure-machine-learning?view=azureml-api-2
38. Labeling images and text documents. Azure Machine Learning, Microsoft Learn (retirement notice for data labeling, September 30, 2026). https://learn.microsoft.com/en-us/azure/machine-learning/how-to-label-data?view=azureml-api-2
39. November update: What's new in Security for partners. Microsoft Tech Community (Partner News), November 12, 2026. https://techcommunity.microsoft.com/blog/partnernews/november-update-what%E2%80%99s-new-in-security-for-partners/4572658
40. Publish and subscribe MQTT messages using MQTT broker. Azure IoT Operations, Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/manage-mqtt-broker/overview-broker
41. Fragen und Antworten zu NIS-2 (NIS2 FAQ). BSI (German). https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-regulierte-Unternehmen/NIS-2-FAQ/NIS-2-FAQ-allgemein/FAQ-zu-NIS-2.html; NIS-2-Meldepflicht (NIS2 reporting obligation). BSI (German). https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-regulierte-Unternehmen/NIS-2-Infopakete/NIS-2-Meldepflicht/NIS-2-Meldepflicht_node.html
42. Cyber Resilience Act. BSI. https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Cyber_Resilience_Act/cyber_resilience_act_node.html
43. OneLake Settings: Modify Immutability Policy. Fabric REST API, Microsoft Learn. https://learn.microsoft.com/en-us/rest/api/fabric/core/onelake-settings/modify-immutability-policy
44. SAP and Microsoft accelerate business insights and AI innovation with SAP Business Data Cloud Connect for Microsoft Fabric. Microsoft Fabric Blog. https://blog.fabric.microsoft.com/en-us/blog/29410
45. Link your Dataverse environment to Microsoft Fabric. Power Apps, Microsoft Learn. https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-view-in-fabric
46. Digital Omnibus on AI has been published (Regulation (EU) 2026/1744). Cuatrecasas, July 2026. https://www.cuatrecasas.com/en/spain/intellectual-property/art/digital-omnibus-ai-has-been-published; also European Commission, Advanced Manufacturing Transition Pathway: AI Act Digital Omnibus: high-risk deadlines postponed, machinery carved out. https://transition-pathways.europa.eu/adv-man/legislation/ai-act-digital-omnibus-high-risk-deadlines-postponed-machinery-carved-out
47. Pause and resume your capacity. Microsoft Fabric, Microsoft Learn. https://learn.microsoft.com/en-us/fabric/enterprise/pause-resume
48. SAP DM Shopfloor Integration. DSAG impulsant, May 4, 2026 (guide dated April 2026). https://impulsant.dsag.de/formate/textbeitrag/sap-dm-shopfloor-integration-english/
49. NIST Releases Version 2.0 of Landmark Cybersecurity Framework. NIST news release, February 26, 2024. https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework
50. NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security. NIST CSRC, September 28, 2023. https://csrc.nist.gov/pubs/sp/800/82/r3/final; news release: https://www.nist.gov/news-events/news/2023/09/guide-operational-technology-ot-security-nist-publishes-sp-800-82-revision
51. NIST IR 8183 Rev. 2 (Initial Public Draft), Cybersecurity Framework 2.0 Manufacturing Profile. NIST CSRC, September 29, 2025. https://csrc.nist.gov/pubs/ir/8183/r2/ipd
52. Critical Manufacturing Sector. Cybersecurity and Infrastructure Security Agency (CISA). https://www.cisa.gov/critical-manufacturing-sector
53. DoD Publishes Final CMMC Program Rule. Greenberg Traurig, October 2024 (summary of 32 CFR Part 170, effective December 16, 2024). https://www.gtlaw.com/en/insights/2024/10/dod-publishes-final-cmmc-program-rule
54. The CMMC DFARS Final Rule Goes Live: Ready or Not, Here It Comes. Squire Patton Boggs, September 2025 (summary of the DFARS rule, effective November 10, 2025). https://www.squirepattonboggs.com/en/insights/publications/2025/09/the-cmmc-dfars-final-rule-goes-live-ready-or-not-here-it-comes
55. Cybersecurity Maturity Model Certification (CMMC). Azure compliance documentation, Microsoft Learn (last updated April 5, 2023). https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-cmmc
56. SEC Adopts Rules on Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure by Public Companies. SEC press release 2023-139, July 26, 2023. https://www.sec.gov/newsroom/press-releases/2023-139
57. CIRCIA final rule at the White House: deadlines set, scope open. Paubox, October 8, 2026 (secondary source on rulemaking status). https://www.paubox.com/blog/circia-final-rule-white-house-deadlines-set-scope-open
58. Cybersecurity Services. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/cybersecurity-services
59. FSMA Final Rule on Requirements for Additional Traceability Records for Certain Foods. U.S. Food and Drug Administration. https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods
60. 21 CFR 11.10, Controls for closed systems. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11/subpart-B/section-11.10
61. Quality Management System Regulation (QMSR). U.S. Food and Drug Administration. https://www.fda.gov/quality-systems-regulation
62. AS9100 Certification: Aerospace QMS. ANSI blog (ANAB). https://blog.ansi.org/anab/as9100-certification-aerospace-qms/
63. NIST Risk Management Framework Aims to Improve Trustworthiness of Artificial Intelligence. NIST news release, January 26, 2023. https://www.nist.gov/news-events/news/2023/01/nist-risk-management-framework-aims-improve-trustworthiness-artificial
64. AZ569914, Retirement: Azure IoT Central will be retired on September 20, 2029. Azure Updates notice, published September 29, 2026 (via the Message Center mirror mc.merill.net). https://mc.merill.net/message/AZ569914
