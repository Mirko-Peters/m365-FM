# SEO metadata

| Field | Value |
|---|---|
| Meta title | OT-cyberbeveiliging & IEC 62443: een gids voor fabrikanten |
| Meta description | OT-cyberbeveiliging voor fabrikanten: ISA/IEC 62443 uitgelegd met zones, conduits, beveiligingsniveaus, een praktijkvoorbeeld, stappenplan, KPI's en FAQ. |
| Slug | `ot-cybersecurity-iec-62443` |

# OT-cyberbeveiliging en ISA/IEC 62443: een praktische gids voor fabrikanten

> **Kort antwoord:** OT-cyberbeveiliging (beveiliging van operationele technologie) beschermt de systemen die de fysieke productie aansturen, zoals PLC's, SCADA, HMI's, robots, aandrijvingen en veiligheidssystemen, zodat een fabriek veilig blijft, beschikbaar is en goede onderdelen blijft produceren. De internationale referentie daarvoor is de ISA/IEC 62443-serie: die wijst taken toe aan asset owners, integrators en leveranciers van producten, groepeert assets in zones die met conduits zijn verbonden, stelt per zone een doelbeveiligingsniveau vast (SL 1 tot en met 4) en toetst elke zone aan zeven fundamentele eisen [1][2]. In de VS combineert men dit meestal met het NIST Cybersecurity Framework 2.0 en NIST SP 800-82 [9][11].

> **Belangrijkste conclusies**
> - In OT komen beschikbaarheid en veiligheid op de eerste plaats. Een firewallregel of een patch die een lijn stilzet, kan meer schade veroorzaken dan de aanval die voorkomen moest worden.
> - ISA/IEC 62443 is een reeks normen en geen enkel document. De delen 2-1 (beveiligingsprogramma), 3-2 (risicobeoordeling en zones), 3-3 (systeemeisen), 4-1 en 4-2 (eisen aan leveranciers) doen in een fabriek het meeste werk [1].
> - De kernmethode is eenvoudig te benoemen: inventariseer uw assets, groepeer ze in zones, definieer de conduits tussen de zones, stel per zone een doelniveau vast en dicht het gat tussen doel- en behaald niveau [2].
> - In de gedocumenteerde gevallen begon de meeste productiestilstand in de kantoor-IT en niet in de besturingen. Colonial Pipeline, Norsk Hydro en Clorox stopten of vertraagden hun activiteiten na aanvallen op hun IT-omgevingen [17][20][35].
> - Een praktisch eerste jaar voor een middelgrote fabriek: assetinventarisatie, een model van zones en conduits, een gesegmenteerde industriële DMZ, gecontroleerde externe toegang, offline back-ups en een ingeoefend OT-incidentdraaiboek. Detectie en eisen aan leveranciers volgen in het tweede jaar.
> - NIST SP 800-82 Rev. 3 (2023) is de huidige Amerikaanse OT-beveiligingsgids; NIST publiceerde op 21 september 2026 de eerste openbare conceptversie van Rev. 4, herschreven rond CSF 2.0, met commentaarperiode tot 30 november 2026 [9][10].
> - Er bestaat certificering voor producten (ISASecure CSA, SSA, SDLA) en sinds juni 2025 ook voor productielocaties (ISASecure ACSSA, gebaseerd op 62443-2-1, 2-4, 3-2 en 3-3) [7][8].
> - Plan het programma als onderhoud: een stabiele jaarlijkse post met duidelijke KPI's, geen eenmalig project.

## Inhoudsopgave

1. [Wat is OT-cyberbeveiliging?](#wat-is-ot-cyberbeveiliging)
2. [IT- vs. OT-beveiliging: waarom het kantoorboek faalt op de productievloer](#it--vs-ot-beveiliging-waarom-het-kantoorboek-faalt-op-de-productievloer)
3. [Wat productie daadwerkelijk stillegt: incidenten en dreigingspatronen](#wat-productie-daadwerkelijk-stillegt-incidenten-en-dreigingspatronen)
4. [Het kaderlandschap: 62443, NIST, CISA, CMMC, NIS2 en de CRA](#het-kaderlandschap-62443-nist-cisa-cmmc-nis2-en-de-cra)
5. [ISA/IEC 62443 toegelicht: structuur, rollen en status](#isaiec-62443-toegelicht-structuur-rollen-en-status)
6. [Fundamentele eisen, beveiligingsniveaus en volwassenheidsniveaus](#fundamentele-eisen-beveiligingsniveaus-en-volwassenheidsniveaus)
7. [Zones en conduits en het Purdue-model](#zones-en-conduits-en-het-purdue-model)
8. [De risicobeoordeling volgens 62443-3-2, stap voor stap](#de-risicobeoordeling-volgens-62443-3-2-stap-voor-stap)
9. [Uitgewerkt voorbeeld: zones en conduits voor een middelgrote fabriek](#uitgewerkt-voorbeeld-zones-en-conduits-voor-een-middelgrote-fabriek)
10. [OT-assetinventaris](#ot-assetinventaris)
11. [Netwerksegmentatie en de industriële DMZ](#netwerksegmentatie-en-de-industriële-dmz)
12. [Veilige externe toegang voor leveranciers en ingenieurs](#veilige-externe-toegang-voor-leveranciers-en-ingenieurs)
13. [Patch- en kwetsbaarheidsbeheer in OT](#patch--en-kwetsbaarheidsbeheer-in-ot)
14. [Accounts, hardening en verwisselbare media](#accounts-hardening-en-verwisselbare-media)
15. [Monitoring en detectie](#monitoring-en-detectie)
16. [Back-up, herstel en OT-incidentrespons](#back-up-herstel-en-ot-incidentrespons)
17. [Eisen aan leveranciers en inkoop](#eisen-aan-leveranciers-en-inkoop)
18. [Mensen, veiligheid en de productievloer](#mensen-veiligheid-en-de-productievloer)
19. [Verplichtingen in de VS en EU: CMMC, SEC, CIRCIA, NIS2 en de CRA](#verplichtingen-in-de-vs-en-eu-cmmc-sec-circia-nis2-en-de-cra)
20. [Een routekaart van 12 tot 24 maanden](#een-routekaart-van-12-tot-24-maanden)
21. [Budget en ROI: hoe je de businesscase onderbouwt](#budget-en-roi-hoe-je-de-businesscase-onderbouwt)
22. [OT-beveiligings-KPI's](#ot-beveiligings-kpis)
23. [Veelgemaakte fouten](#veelgemaakte-fouten)
24. [Beperkingen van IEC 62443 en van OT-beveiligingsprogramma's](#beperkingen-van-iec-62443-en-van-ot-beveiligingsprogramma-s)
25. [Woordenlijst](#woordenlijst)
26. [Veelgestelde vragen](#faq-ot-cyberbeveiliging-en-iec-62443)
27. [Conclusie](#conclusie)

**Wie welk deel moet lezen**

| Lezer | Begin met |
|---|---|
| Fabrieksmanager of directeur operations | Hoofdstukken 1 tot 3, 9, 16, 20 en 21 |
| Regel- of automatiseringsingenieur | Hoofdstukken 5 tot 15 |
| IT- of securityverantwoordelijke die nieuw is in OT | Hoofdstukken 2, 7, 11 tot 15 |
| Inkoop en leverancierskwaliteit | Hoofdstuk 17 |
| CFO of fabrieks-controller | Hoofdstukken 3, 21 en 22 |
| Defensieleverancier of bedrijf met EU-vestigingen | Hoofdstuk 19 |

## Wat is OT-cyberbeveiliging?

Operational technology (OT) is de hardware en software die fysieke processen bewaakt en aanstuurt. NIST beschrijft OT als "a broad range of programmable systems and devices that interact with the physical environment" en noemt industriële besturingssystemen, gebouwautomatisering, transportsystemen, fysieke toegangscontrole en milieumonitoring als voorbeelden [9]. In een fabriek gaat het om de programmeerbare logische controllers (PLC's) op een stansstraat, het gedistribueerde besturingssysteem (DCS) van een verflijn, de SCADA-server (supervisory control and data acquisition) voor nutsbedrijven, de human-machine interfaces (HMI's) bij de werkstations, robotcontrollers, aandrijvingen, visiesystemen, de engineeringwerkstations waarop al dit werk wordt geprogrammeerd, en de veiligheidsinstrumentele systemen (SIS) die het proces in een veilige toestand brengen.

OT-cyberbeveiliging is de verzameling beleidsregels, technische maatregelen en routines die voorkomen dat deze systemen worden verstoord, gemanipuleerd of gebruikt als toegangspad tot de rest van het bedrijf. Het doel verschilt van klassieke IT-beveiliging. Op kantoor is de eerste vraag meestal "is de data vertrouwelijk?". Op de werkvloer zijn de eerste vragen "kan er iemand gewond raken?" en "blijft de lijn draaien en worden er goede producten gemaakt?"

### OT, ICS, IACS, SCADA: de termen op een rij

In het vakgebied worden verschillende, elkaar overlappende termen gebruikt. Ze zijn belangrijk omdat de normen ze nauwkeurig hanteren.

| Term | Betekenis | Waar je hem tegenkomt |
|---|---|---|
| OT (operational technology) | Verzamelnaam voor systemen die met de fysieke wereld interacteren | NIST SP 800-82 Rev. 3 gebruikt hem in de titel [9] |
| ICS (industrial control system) | Besturingssystemen in de industrie: PLC, DCS, SCADA en hun netwerken | Oudere NIST- en CISA-documenten, MITRE ATT&CK for ICS [15] |
| IACS (industrial automation and control system) | De term die ISA/IEC 62443 gebruikt: de mensen, hardware, software en beleidsregels die betrokken zijn bij het bedienen van een industrieel proces | Alle delen van 62443 [1][2] |
| SCADA | Bewaking en aansturing op afzonderlijke locaties (pijpleidingen, nutsbedrijven, waterzuivering) | Nutsbedrijven, energiesystemen voor de hele fabriek |
| DCS | Gedistribueerd besturingssysteem, typisch in continue procesfabrieken | Chemie, voeding, farma, verflijnen |
| PLC | Programmeerbare logische controller, het werkpaard van de discrete productie | Machines, transportbanden, assemblagelijnen |
| SIS | Veiligheidsinstrumenteel systeem; voert veiligheidsinstrumentele functies uit | Procesveiligheid, persen, branders |
| IIoT | Industrial Internet of Things: sensoren en apparaten die data naar edge- of cloudplatforms sturen | Predictief onderhoud, energiemonitoring; IEC PAS 62443-1-6 [5] |

In de praktijk worden "OT-beveiliging", "OT-cyberbeveiliging", "ICS-beveiliging" en "industriële cyberbeveiliging" als synoniemen gebruikt. Deze gids gebruikt "OT-beveiliging" voor de discipline en "IACS" wanneer het gaat om wat 62443 vereist.

### Waarom productie überhaupt in beeld komt

Veel fabrieksdirecteuren gaan er nog steeds van uit dat cyberaanvallen een IT-probleem zijn en dat hun machines "air-gapped" zijn. In de meeste fabrieken klopt dat al jaren niet meer. MES, historians, ERP-koppelingen, externe ondersteuning door machinebouwers, cloud-dashboards en IIoT-sensoren verbinden de productievloer met de onderneming en met internet. CISA noemt kritieke productie (primaire metalen, machinebouw, elektrische apparatuur en transportmiddelen) een Amerikaanse kritieke infrastructuursector, met het Department of Homeland Security als sectorale risicobeheersautoriteit [32]; de sector wordt vaak geteld als een van 16 sectoren [unverified: de geciteerde CISA-pagina vermeldt het aantal niet].

De kosten van een stilgelegde fabriek zijn duidelijk voor iedereen die er een heeft gerund. Elk uur stilstand kost dekkingsbijdrage, overwerk om in te halen, afval door onderbroken batches, spoedtoeslagen en in het slechtste geval contractuele boetes voor klanten. De casussen in sectie 3 laten zien dat aanvallers dit weten. Ransomwaregroepen hoeven een PLC niet te begrijpen om de productie stil te leggen; ze hoeven alleen de systemen te versleutelen zonder welke de fabriek niet kan draaien.

Voor meer context over de datakant van de fabriek kunt u de gidsen over [MES en ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) en [Azure voor productie](https://www.m365.fm/en/learn/manufacturing-it-azure/) raadplegen; deze beschrijven hoe fabrieksdata de bedrijfs- en cloudsystemen bereikt. Elk van deze verbindingen is een conduit in de zin van 62443.

## IT- vs. OT-beveiliging: waarom het kantoorplaybook faalt op de productievloer

IT- en OT-beveiliging gebruiken veel dezelfde hulpmiddelen: firewalls, accounts, logging, back-ups. Maar de systemen, de prioriteiten en de gevolgen verschillen genoeg dat het kopiëren van het kantoorplaybook naar de productievloer tot storingen leidt. De ISAGCA quick start guide vat de prioriteit van de fabriek samen in één concept: de **essentiële functies** die moeten worden behouden "om de gezondheid, veiligheid, het milieu en de beschikbaarheid van de Equipment Under Control te waarborgen". Het noemt de veiligheidsinstrumentele functie, de regelfunctie en het vermogen van de operator om de apparatuur te zien en te bedienen; het verlies daarvan betekent verlies van bescherming, verlies van regeling of verlies van zicht [2].

| Aspect | Typische kantoor-IT | Typische fabrieks-OT |
|---|---|---|
| Hoogste prioriteit | Vertrouwelijkheid en integriteit van data | Veiligheid, beschikbaarheid en integriteit van het proces; vertrouwelijkheid telt mee, maar komt meestal later |
| Gevolg van een storing | Dataverlies, boetes, reputatieschade | Letsel, milieuvrijkomen, materiële schade, afval, verloren productie |
| Levensduur van systemen | 3 tot 5 jaar voor laptops en servers | 15 tot 25 jaar voor controllers en machines is in de praktijk gebruikelijk [praktijkbereik, unverified: niet geverifieerd als industriestatistiek] |
| Wijzigingsvensters | 's Nachts of wekelijks | Geplande stilstanden, soms één of twee keer per jaar |
| Patchen | Geautomatiseerd, maandelijks | Alleen na goedkeuring en testen door de leverancier; sommige apparaten kunnen helemaal niet worden gepatcht |
| Herstarts | Acceptabel | Een herstart kan een lijn stilleggen of een batch bederven |
| Protocollen | Geauthenticeerd, versleuteld (HTTPS, Kerberos) | Veel oudere industriële protocollen zijn ontworpen zonder authenticatie of versleuteling |
| Antivirus en agents | Standaard op elk eindpunt | Vaak niet ondersteund door de leverancier van de HMI of controller; allowlisting is veiliger |
| Prestaties | Vertragingen van seconden zijn irritant | Vertragingen van milliseconden kunnen een proces laten uitvallen |
| Eigenaarschap | IT-afdeling | Onderhoud, regeltechniek, productie, vaak de machinebouwer |
| Wie wijzigt er iets | Beheerders | Monteurs, integrators, leveranciers, soms operators |

### Wat dit in de praktijk betekent

Uit de tabel volgen drie regels.

1. **Geen actieve scan van controllers zonder test.** Een kwetsbaarheidsscanner die onschadelijk is op een bestandsserver kan een oudere PLC of HMI laten crashen. Asset discovery in OT begint passief (meeluisteren naar netwerkverkeer) of gebruikt de engineeringtools van de leverancier.
2. **Beveiligingswijzigingen vereisen goedkeuring van productie.** Elke firewallregel, accountwijziging of patch in een zone met essentiële functies volgt management of change (MOC), net als een wijziging in een recept of een veiligheidsinterlock.
3. **De compenserende maatregel is het normale geval.** Wanneer een Windows 7 HMI pas bij de volgende herbouw van de lijn kan worden vervangen, beschermt u die door hem in een kleine zone te plaatsen, zijn conduits te beperken, USB-toegang te verwijderen en het verkeer ervan te monitoren. Een compenserende maatregel in die situatie accepteren is precies wat de 62443-methode beoogt.

### Waar IT en OT samen moeten werken

De omgekeerde fout is om OT-beveiliging te verklaren tot een zaak van de fabriek waar IT zich buiten moet houden. De incidenten in de volgende sectie laten zien dat aanvallers vaak binnenkomen via identiteitssystemen, e-mail of de helpdesk, die door IT worden beheerd. Een effectief programma heeft één risico-eigenaar op sitniveau, een gezamenlijk team van IT-beveiliging en regeltechniek, en duidelijk toegewezen verantwoordelijkheden per zone. De rollentabel in sectie 18 laat zien hoe u die kunt verdelen.

## Wat plants daadwerkelijk stilleggen: incidenten en dreigingspatronen

De hieronder beschreven gedocumenteerde gevallen zijn niet bedoeld om iemand bang te maken. Ze laten zien waar aanvallen binnenkwamen, waarom de productie stilviel en wat het herstel hielp. Elk cijfer komt uit een primaire of betrouwbare secundaire bron; waar een bedrijf nooit een getal heeft bekendgemaakt, zegt de tabel dat ook.

| Incident | Wat er gebeurde | Effect op de bedrijfsvoering | Bekendgemaakte cijfers | Les voor OT-beveiliging |
|---|---|---|---|---|
| NotPetya bij Merck (juni 2017) | Destructieve malware verspreidde zich wereldwijd via een gecompromitteerde update van accountingsoftware uit Oekraïne | Meer dan 40.000 Merck-computers beschadigd [18] | Merck eiste 1,4 miljard dollar van verzekeraars; in mei 2023 oordeelde een New Jersey-appelrechtbank dat de oorlogsuitsluiting niet van toepassing was; de partijen schikten in januari 2024 met niet-openbare voorwaarden [18] | Een plat netwerk laat malware productiesystemen bereiken; verzekering vervangt geen herstelvermogen |
| Norsk Hydro (maart 2019) | Ransomware-aanval trof de volledige wereldwijde organisatie in de vroege ochtend van 19 maart 2019 | Extruded Solutions leed de grootste operationele verliezen; andere bedrijfsonderdelen bleven nagenoeg normaal produceren met "arbeidsintensieve omwegen en handmatige procedures" [17] | Hydro schatte de totale kosten op ongeveer 800 miljoen NOK [17] | Handmatige noodprocedures en open communicatie verkortten de crisis |
| Colonial Pipeline (mei 2021) | Ransomware-aanval door de DarkSide-groep op of rond 7 mei 2021 | De pijplijnactiviteiten werden stilgelegd [35] | Colonial betaalde ongeveer 75 bitcoin; het Amerikaanse ministerie van Justitie beslag op 63,7 bitcoin, destijds ongeveer 2,3 miljoen dollar waard [16] | Een ransomware-incident leidde tot de stillegging van een fysieke operatie. De CEO van Colonial vertelde de Senaat dat de aanvallers de IT-systemen versleutelden en dat het bedrijf het hele systeem uitschakelde om te voorkomen dat de malware naar het OT-netwerk oversloeg, omdat herkomst en omvang onbekend waren [36] |
| Clorox (augustus 2023) | Op 11 augustus 2023 verkregen aanvallers inloggegevens- en MFA-resets door de uitbestede IT-helpdesk te bellen [20] | Clorox stopte de productie en schakelde over op handmatige orderverwerking; het verkoopvolume daalde in de zes maanden na de aanval met 6% [20] | Clorox' rechtszaak tegen Cognizant (juli 2025) claimt 380 miljoen dollar schadevergoeding, waaronder 49 miljoen dollar aan herstelkosten; Clorox heeft 100 miljoen dollar aan verzekeringsuitkeringen gemeld; Cognizant betwist aansprakelijkheid [19][20] | Identiteits- en helpdeskprocessen maken deel uit van OT-beveiliging; een telefoontje met social engineering kan een plant stilleggen |
| Jaguar Land Rover (augustus/september 2025) | Cyberaanval die de voertuigproductie stillegde | Productielijnen stonden meerdere weken stil; het UK Cyber Monitoring Centre telde meer dan 5.000 Britse organisaties als getroffen [21] | Het Cyber Monitoring Centre schatte de financiële impact in het Verenigd Koninkrijk op 1,9 miljard pond (ongeveer 2,55 miljard dollar) [21] | Strak gekoppelde toeleveringsketens verspreiden de uitval van één plant naar duizenden leveranciers |

### Patronen achter de gevallen

Naast elkaar gelegd tonen de gevallen vier patronen die de rest van deze gids bepalen.

- **Binnenkomst via IT, impact op OT.** In geen van de vijf gevallen beschrijven de geciteerde bronnen een directe aanval op controllers. De bedrijfsvoering stopte doordat gedeelde netwerken, gedeelde identiteiten of afhankelijke bedrijfssystemen faalden. Daarom staan de zonegrens tussen onderneming en plant (de industriële DMZ) en identiteitshygiëne bovenaan de roadmap.
- **Door operators geïnitieerde stilleggingen.** Clorox haalde systemen offline en stopte de productie na het ontdekken van de inbraak, waarna orders handmatig werden afgehandeld [20]; de pijplijn van Colonial werd na de ransomware-aanval stilgelegd [35]. Een plant die weet van welke bedrijfssystemen ze afhankelijk is en in een gedegradeerde modus kan draaien, heeft meer keuzes.
- **Herstel duurt weken.** Zelfs goed voorbereide bedrijven hadden weken nodig om de normale output te herstellen. Back-ups, opnieuw opgebouwde engineeringwerkstations en geverifieerde controllerlogica bepalen hoe lang de onderbreking duurt.
- **Derden maken deel uit van het aanvalsoppervlak.** Softwareupdates (NotPetya), uitbestede helpdesks (Clorox) en integrators (zie het CISA/FBI-feitenblad in paragraaf 12) komen allemaal voor in de documentatie [14][18][20].

### Aanvallen gericht op regelaars

Aanvallen die het industriële proces zelf manipuleren zijn zeldzamer, maar ze bestaan, en ze zijn de reden dat beveiligingsniveaus 3 en 4 in 62443 bestaan. MITRE onderhoudt een openbare kennisbank over het gedrag van tegenstanders tegen industriële besturingssystemen, ATT&CK for ICS. De matrix (contentversie 20.1) groepeert technieken in 12 tactieken, van Initial Access tot Inhibit Response Function en Impair Process Control en verder tot Impact [15]. Twee tactieken zijn specifiek voor OT: **Inhibit Response Function** (voorkomen dat veiligheids- en beschermingsfuncties reageren) en **Impair Process Control** (manipuleren van de aansturing van het proces) [15].

Voor verdedigers is ATT&CK for ICS op drie manieren nuttig:

1. Als checklist voor detectie: welke technieken zou uw monitoring kunnen zien?
2. Als gedeelde woordenschat tussen IT-beveiligingsanalisten en regeltechnici.
3. Als input voor de dreigingsscenario's in de risicobeoordeling volgens 62443-3-2 (sectie 8).

Deze gids blijft aan de defensieve kant. Zij beschrijft niet hoe een techniek wordt uitgevoerd.

## Het kader van normen: 62443, NIST, CISA, CMMC, NIS2 en de CRA

Amerikaanse maakbedrijven hebben te maken met een drukke markt van kaders. Ze concurreren minder dan het lijkt; ze beantwoorden verschillende vragen.

| Kader | Uitgever | Vraag die het beantwoordt | Bindend? | Status (november 2026) |
|---|---|---|---|---|
| ISA/IEC 62443-serie | ISA (ISA99-commissie) en IEC | Hoe beveiligen asset owners, integratoren en leveranciers een IACS gedurende de hele levenscyclus? | Vrijwillig; wordt bindend via contracten, klanteneisen of toezichthouders | Kernonderdelen gepubliceerd; meerdere in herziening (sectie 5) [1][6] |
| NIST Cybersecurity Framework (CSF) 2.0 | NIST | Hoe stuurt de organisatie cyberrisico's in het algemeen aan en beheert ze? | Vrijwillig | Uitgebracht 26 februari 2024; zes functies: Govern, Identify, Protect, Detect, Respond, Recover [11] |
| NIST SP 800-82 Rev. 3, Guide to OT Security | NIST | Hoe passen OT-architecturen, dreigingen en tegenmaatregelen in een Amerikaans besturingskader? | Vrijwillig (referentie voor federale instanties) | Definitief september 2023; Rev. 4 initiële publieke concept-versie 21 september 2026 [9][10] |
| NIST IR 8183 Rev. 2, CSF 2.0 Manufacturing Profile | NIST | Welke CSF-uitkomsten zijn het belangrijkst voor maakbedrijven? | Vrijwillig | Initiële publieke concept-versie 29 september 2025 [12] |
| CISA Cybersecurity Performance Goals (CPG's) 2.0 | CISA | Wat is een meetbare fundamentele basislijn voor kritieke infrastructuur? | Vrijwillig | CPG 2.0 uitgebracht 10 december 2025, met een nieuwe component voor governance [13] |
| CMMC 2.0 | Amerikaans ministerie van Defensie | Beschermt een defensieleverancier FCI en CUI? | Contractueel voor DoD-contracten | Programmaregel van kracht sinds 16 december 2024; DFARS-regel sinds 10 november 2025, gefaseerd ingevoerd [28][29] |
| Regels voor cyberbeveiligingsrapportage van de SEC | Amerikaanse Securities and Exchange Commission | Wanneer en hoe moeten beursgenoteerde bedrijven materiële incidenten melden? | Verplicht voor SEC-registranten | Aangenomen 26 juli 2023 [26] |
| CIRCIA | CISA | Wanneer moeten gedekte entiteiten van kritieke infrastructuur incidenten melden? | Verplicht zodra de definitieve regel van kracht wordt | Definitieve regel onder beoordeling door het Witte Huis sinds 1 oktober 2026, nog niet gepubliceerd per 9 november 2026 [27][39] |
| NIS2-richtlijn | Europese Unie (nationale wetgeving van lidstaten) | Welke essentiële en belangrijke entiteiten in de EU moeten cyberrisico's beheersen en incidenten melden? | Verplicht voor in scope vallende EU-entiteiten | Duitse implementatiewet van kracht sinds 6 december 2025 [24] |
| Cyber Resilience Act (CRA) | Europese Unie | Aan welke beveiligingseisen moeten producten met digitale elementen voldoen op de EU-markt? | Verplicht voor producten die op de EU-markt worden gebracht | Meldingsverplichtingen sinds 11 september 2026 [22] |

### Hoe de onderdelen op elkaar aansluiten

Een werkbare combinatie voor een Amerikaans maakbedrijf ziet er als volgt uit:

- **CSF 2.0 voor governance en de raad van bestuur.** Het biedt het management, auditors, verzekeraars en klanten een gemeenschappelijke taal. De nieuwe Govern-functie omvat rollen, risicobereidheid en leveranciersrisico [11].
- **62443 voor de fabrieksontwerp en de leveranciersketen.** Het is het enige raamwerk in de tabel dat concrete taken toewijst aan asset owners, integrators en productleveranciers en zones, conduits en beveiligingsniveaus definieert [1][2].
- **SP 800-82 als brug.** Het vertaalt OT-specifieke aspecten naar de NIST-controlewereld. De conceptversie Rev. 4 is herstructureerd rond CSF 2.0 en voegt richtlijnen toe voor assetmanagement, netwerkmonitoring en zero trust-principes voor systeembeheerfuncties [10].
- **CPG's als steekproef.** Ze zijn kort en meetbaar; nuttig voor een snelle nulmeting voordat u het volledige 62443-programma start [13].
- **CMMC, SEC, CIRCIA, NIS2 en de CRA** alleen waar ze op u van toepassing zijn (sectie 19).

Het NIST Manufacturing Extension Partnership (MEP) helpt kleine en middelgrote productiebedrijven met op CSF gebaseerde zelfevaluaties, gap-analyses en incidentresponsplannen [30]. Voor veel fabrieken met minder dan 500 medewerkers is dat de meest betaalbare manier om te beginnen.

## ISA/IEC 62443 toegelicht: structuur, rollen en status

### Waar de standaard vandaan komt

De International Society of Automation (ISA) richtte in 2002 de ISA99-commissie op om cybersecuritystandaarden voor automatiserings- en regelsystemen te schrijven. Rond 2010 begon de commissie nauw samen te werken met de International Electrotechnical Commission (IEC), en de documenten kregen de nummering ISA/IEC 62443 [3]. De ISA-documenten worden gepubliceerd als ANSI/ISA-62443-x-y; de IEC publiceert dezelfde inhoud als IEC 62443-x-y. ISA stelt dat de reeks wordt onderschreven door de Verenigde Naties, en de IEC heeft haar in 2021 aangewezen als horizontale standaard, wat betekent dat ze over sectoren heen geldt in plaats van voor één industrie [1].

Voor een lezer in de VS is het praktische punt dat u de ANSI/ISA-edities bij ISA kunt kopen en de IEC-edities via de IEC-webwinkel, en dat ze technisch op elkaar zijn afgestemd. Data en editienummers verschillen soms tussen de twee uitgevers, dus vermeld in contracten altijd de exacte editie.

### De vier groepen documenten

De reeks is ingedeeld in vier groepen [1][2]:

1. **Algemeen (1-x):** terminologie, concepten, modellen, meetgegevens.
2. **Beleid en procedures (2-x):** wat de asset owner en dienstverleners als organisatie moeten doen.
3. **Systeem (3-x):** risicobeoordeling, zones en conduits, en technische eisen voor de gehele automatiseringsoplossing.
4. **Component (4-x):** veilige ontwikkelprocessen en technische eisen voor afzonderlijke producten.

### De delen en hun status

De tabel combineert de ISA-catalogus [1], de IEC-webwinkel [4][5] en een secundair overzicht [3]. Status per november 2026.

| Deel | Titel (kort) | Belangrijkste doelgroep | Huidige editie (ISA / IEC) | Statusopmerking |
|---|---|---|---|---|
| 1-1 | Terminologie, concepten en modellen | Iedereen | ISA-62443-1-1 (2007); IEC TS 62443-1-1 (2009) | Tweede editie lang in voorbereiding [3] |
| 1-5 | Schema voor 62443-beveiligingsprofielen | Sectororganisaties, leveranciers | IEC TS 62443-1-5 (2023) [3] | Profielen voor specifieke sectoren |
| 1-6 | Toepassing van de 62443-reeks op het IIoT | Asset owners, dienstverleners | IEC PAS 62443-1-6 (19 december 2025) [5] | PAS, wordt na vier jaar automatisch ingetrokken [5] |
| 2-1 | Eisen aan het beveiligingsprogramma voor IACS-asset owners | Asset owners | ANSI/ISA-62443-2-1 (2024) [1]; IEC 62443-2-1 Ed. 2.0 (2024) [3] | Tweede editie; de centrale norm voor asset owners |
| 2-2 | IACS-beveiligingsbeschermingsschema | Asset owners | ISA-TR62443-2-2 (2025) [1]; IEC PAS 62443-2-2 (11 maart 2025) [4] | Richtlijnen voor het exploiteren van een beveiligingsbeschermingsschema |
| 2-3 | Patchmanagement in de IACS-omgeving | Asset owners, leveranciers | ISA-TR62443-2-3 (2015) [1] | Technisch rapport |
| 2-4 | Eisen aan het beveiligingsprogramma voor IACS-dienstverleners | Integrators, onderhoudsdienstverleners | ANSI/ISA-62443-2-4 (2018) [1]; IEC 62443-2-4 Ed. 2.0 (december 2023) [3] | Basis voor integratorcontracten |
| 3-1 | Beveiligingstechnologieën voor IACS | Iedereen | ISA-TR99.00.01 (2007) [1]; IEC TR 62443-3-1 (2009) [3] | Technologieoverzicht, verouderd |
| 3-2 | Beveiligingsrisicobeoordeling voor systeemontwerp | Asset owners, integrators | ANSI/ISA-62443-3-2 (2020) [1] | Tweede editie in ontwikkeling [6] |
| 3-3 | Systeembeveiligingseisen en beveiligingsniveaus | Integrators, asset owners | ISA-62443-3-3 (2013) [1] | Tweede editie in ontwikkeling [6] |
| 4-1 | Eisen aan de levenscyclus van veilige productontwikkeling | Productleveranciers | ANSI/ISA-62443-4-1 (2018) [1] | Basis voor ISASecure SDLA [7] |
| 4-2 | Technische beveiligingseisen voor IACS-componenten | Productleveranciers | ANSI/ISA-62443-4-2 (2018) [1] | Tweede editie in ontwikkeling [6]; basis voor ISASecure CSA [7] |
| 6-1 | Beveiligingsevaluatiemethodologie voor 62443-2-4 | Certificeringsinstanties | IEC TS 62443-6-1 (2024) [3] | Voor het beoordelen van dienstverleners |

Twee praktische opmerkingen. Ten eerste betekent de datering van de kernonderdelen (3-3 uit 2013, 4-2 uit 2018) niet dat de inhoud verouderd is; het zijn nog steeds de edities waarnaar certificering en contracten verwijzen. Ten tweede zijn er herzieningen gaande voor 3-2, 3-3 en 4-2 [6]. Als u langlopende leverancierscontracten opstelt, verwijs dan naar "de op het moment van bestelling geldende editie" of noem de editie en voeg een herzieningsclausule toe.

Een waarschuwing over secundaire bronnen: in 2026 kondigden sommige websites een nieuwe "IEC 62443-4-2:2026" aan met verplichte AI-anomaliedetectie. Vanaf november 2026 vonden wij geen zodanige publicatie in de ISA-catalogus of de IEC-webwinkel [1][4]. Controleer elke bewering over een editie bij de uitgever.

### De rollen: wie moet wat doen

62443 wijst verantwoordelijkheden toe aan rollen, niet aan afdelingen. De ISAGCA-snelstartgids definieert ze als volgt [2]:

| Rol | Definitie (ISAGCA) | Typisch bedrijf | Belangrijkste 62443-onderdelen |
|---|---|---|---|
| Asset owner | "De organisatie die verantwoordelijk en aansprakelijk is voor het IACS" | De fabrikant die de fabriek exploiteert | 2-1, 2-2, 2-3, 3-2 |
| Integratiedienstverlener | "De organisatie die integratieactiviteiten levert voor een automatiseringsoplossing" | Systeemintegrator, machinebouwer die een lijn levert, interne engineering | 2-4, 3-2, 3-3 |
| Onderhoudsdienstverlener | Levert ondersteunende activiteiten voor een automatiseringsoplossing onder het beleid van de asset owner | Serviceaannemer, OEM-service, interne onderhoudsafdeling | 2-4 |
| Productleverancier | "De organisatie die een hardware- en/of softwareproduct vervaardigt en ondersteunt" | Leveranciers van PLC's, HMI's, netwerk-, aandrijf- en software | 4-1, 4-2 |

Eén bedrijf kan meerdere rollen vervullen. Een machinebouwer is productleverancier voor zijn software in de schakelkast en integratiedienstverlener wanneer hij de lijn installeert. Een grote fabrikant met een eigen afdeling regeltechniek is tegelijk asset owner en integrator. De waarde van het rolmodel is dat het contract en de audit precies kunnen vastleggen welke eisen elke partij beheert.

### De twee levenscycli

62443 onderscheidt de **productontwikkelingslevenscyclus** van de leverancier van de **levenscyclus van de automatiseringsoplossing** in de fabriek, die een integratiefase en een fase van beheer en onderhoud kent [2]. Een veilige PLC (4-2) maakt een lijn nog niet veilig; de integrator moet hem correct configureren (3-3), en de asseteigenaar moet hem twintig jaar lang veilig beheren (2-1). De meeste problemen in de fabriek ontstaan in de derde stap.

## Fundamentele eisen, beveiligingsniveaus en volwassenheidsniveaus

### De zeven fundamentele eisen

Alle technische eisen in 3-3 (systeem) en 4-2 (component) zijn gegroepeerd onder zeven fundamentele eisen (FR's) [2]. Leer ze uit het hoofd; ze vormen de ruggengraat van elke gap-analyse.

| FR | Naam | Wat er in fabriekstaal gevraagd wordt | Typische maatregelen in de fabriek |
|---|---|---|---|
| FR 1 | Identificatie- en authenticatiebeheer (IAC) | Weten we wie of wat er verbinding maakt? | Persoonlijke accounts in plaats van gedeelde "operator"-logins, MFA voor externe toegang, apparaatcertificaten voor OPC UA |
| FR 2 | Gebruiksbeheer (UC) | Kan iedereen alleen doen wat zijn rol vereist? | Rolgebaseerde rechten op HMI's en engineeringtools, aparte beheeraccounts, controle op wie logica heeft gewijzigd |
| FR 3 | Systeemintegriteit (SI) | Kunnen we ongeautoriseerde wijzigingen in software, logica en data detecteren of voorkomen? | Application allowlisting, ondertekende firmware, sleutelschakelaar van de controller in RUN, detectie van logicawijzigingen |
| FR 4 | Vertrouwelijkheid van gegevens (DC) | Worden gevoelige gegevens beschermd tijdens gebruik, transport en opslag? | Versleutelde externe sessies, bescherming van recepten en tekeningen, omgang met CUI bij defensiewerk |
| FR 5 | Beperkte gegevensstroom (RDF) | Is het verkeer beperkt tot wat tussen zones noodzakelijk is? | Segmentatie, firewalls bij conduits, industriële DMZ, eenrichtingsgateways waar dat gerechtvaardigd is |
| FR 6 | Tijdige reactie op gebeurtenissen (TRE) | Merken we incidenten op en reageren we op tijd? | Logverzameling, monitoring van het OT-netwerk, alarmafhandeling, incidentplaybook |
| FR 7 | Beschikbaarheid van middelen (RA) | Blijven de essentiële functies draaien onder druk of aanval? | Redundantie, back-ups, geteste herstelprocedures, bescherming tegen netwerkoverstromingen, handmatige terugvaloptie |

### Beveiligingsniveaus (SL 1 tot en met 4)

Een beveiligingsniveau beschrijft hoe sterk een aanvaller is die een zone of component kan doorstaan. 62443-3-3 definieert vier niveaus [2]:

| SL | Bescherming tegen | Voorbeeld van een dreiging in de fabriek |
|---|---|---|
| SL 0 | Geen speciale bescherming nodig | Zelden gerechtvaardigd; geen ontwerpdoel |
| SL 1 | Toevallige of onbedoelde schending | Een monteur steekt een laptop in de verkeerde switchpoort |
| SL 2 | Opzettelijke schending met eenvoudige middelen, beperkte middelen, generieke vaardigheden en lage motivatie | Standaard ransomware, een opportunistische aanvaller met gangbare tools |
| SL 3 | Opzettelijke schending met geavanceerde middelen, gematigde middelen, IACS-specifieke vaardigheden en gematigde motivatie | Een criminele groep die uw besturingssysteem bestudeert voordat ze handelt |
| SL 4 | Opzettelijke schending met geavanceerde middelen, uitgebreide middelen, IACS-specifieke vaardigheden en hoge motivatie | Een goed gefinancierd, door een staat gesteund team dat op een specifiek proces mikt |

Elk beveiligingsniveau is niet één getal voor de hele fabriek, maar een vector over de zeven FR's. Een zone heeft misschien SL 3 nodig voor FR 3 (integriteit, omdat gemanipuleerde logica iemand kan schaden), maar slechts SL 1 voor FR 4 (vertrouwelijkheid, omdat de gegevens niet gevoelig zijn). De secundaire overzichtsbron merkt op dat SL's per technische eis worden beoordeeld, en niet als algemene score van een product [3].

Er bestaan ook drie soorten beveiligingsniveau [2]:

- **SL-T (target):** het gewenste niveau voor een zone of conduit, vastgesteld door de risicobeoordeling.
- **SL-C (capability):** wat een systeem (3-3) of component (4-2) kan bieden wanneer het correct is geïntegreerd en geconfigureerd.
- **SL-A (achieved):** het werkelijke niveau van de geïnstalleerde oplossing.

Het hele programma kan in één zin worden samengevat: kies componenten waarvan de SL-C ten minste gelijk is aan de SL-T, configureer ze zo dat de SL-A de SL-T bereikt, en gebruik compenserende maatregelen waar dat niet lukt.

**Hoe de meeste middelgrote fabrikanten doelen vaststellen.** SL 2 is het gebruikelijke doel voor productiezones in discrete productie, met SL 3 voor zones waarvan een compromittering letsel, grote milieuvrijkomingen of lange stilstand zou kunnen veroorzaken, zoals veiligheidssystemen en kritische procesbesturing. Dit is praktijkervaring en geen regel van de standaard [unverified as a statistic]. De beslissing hoort thuis in uw risicobeoordeling, gedocumenteerd en goedgekeurd door de asseteigenaar.

### Volwassenheidsniveaus

Beveiligingsniveaus meten de technische sterkte. Volwassenheidsniveaus meten hoe goed processen worden uitgevoerd. Het volwassenheidsmodel van 62443 is gebaseerd op CMMI en wordt gebruikt in de delen 2-1, 2-2, 2-4 en 4-1 [2]. Het secundaire overzicht beschrijft ML 1 (initieel, ad hoc), ML 2 (beheerd, gedocumenteerd en herhaalbaar), ML 3 (gedefinieerd, organisatiebreed toegepast met bewijs) en ML 4 (verbeterend, gemeten en continu verbeterd) [3].

Een praktische lezing: een integrator wiens 2-4-processen op ML 1 staan, levert goed werk wanneer de juiste engineer ter plaatse is en slecht werk wanneer dat niet zo is. Vraag in contracten om ML 2 of hoger, wat betekent: schriftelijke procedures, getraind personeel en bewijsmateriaal.

### De ontwerpprincipes achter de eisen

De snelstartgids noemt vier ontwerpprincipes die door de hele reeks lopen: secure by design, het verkleinen van het aanvalsoppervlak (toegangscontrole, segmentatie, minimale functie, minimale privileges), defense in depth en bescherming van essentiële functies [2]. Defense in depth wordt gedefinieerd als "het aanbrengen van meerdere beveiligingsmaatregelen, vooral in lagen, met als doel een aanval te vertragen of te voorkomen" [2]. Geen enkele firewall hoeft de hele last te dragen.

## Zones en conduits en het Purdue-model

### Definities

- **Zone:** "een groepering van logische of fysieke assets op basis van risico of andere criteria" [2].
- **Conduit:** "een logische groepering van communicatiekanalen die gemeenschappelijke beveiligingseisen delen" [2].

Assets in één zone delen dezelfde beveiligingseisen; verkeer tussen zones loopt alleen via gedefinieerde conduits, en elke conduit krijgt zijn eigen maatregelen (firewallregels, protocolbeperkingen, authenticatie, monitoring). Een zone kan een enkele cel zijn met een robot en zijn PLC, een volledige productielijn, het utilitysysteem of de industriële DMZ.

### Zones tekenen

Groepeer assets op basis van deze criteria, in ongeveer deze volgorde:

1. **Functie en gevolg:** veiligheidssystemen in een eigen zone, gescheiden van basisprocesbesturing.
2. **Fysieke of logische locatie:** lijn, gebouw, site.
3. **Eigendom en levenscyclus:** een turnkey-lijn van één machinebouwer vormt vaak een natuurlijke zone.
4. **Technische mogelijkheden:** legacy-systemen die niet kunnen worden verhard, hebben mogelijk een eigen kleine zone met strakke conduits nodig.
5. **Connectiviteitsbehoeften:** systemen die met de onderneming of de cloud moeten praten, horen dicht bij de grens te staan, niet diep in het systeem.

Vermijd twee uitersten. Eén zone voor de hele fabriek geeft geen insluiting. Honderd zones maken regels onbeheersbaar en leveren een firewall op die niemand durft aan te raken. Voor een middelgrote fabriek zijn 8 tot 20 zones in de praktijk gebruikelijk [praktijkbereik, unverified].

### Het Purdue-model en zijn grenzen

Veel fabrieken beschrijven hun architectuur nog steeds met de Purdue Enterprise Reference Architecture, die de ISA-95-standaard als functionele hiërarchie heeft overgenomen. De niveaus ervan vormen een bruikbare startkaart voor zones:

| Niveau | Inhoud | Voorbeeldsystemen | Typische zone |
|---|---|---|---|
| 4-5 | Onderneming: bedrijfsplanning en logistiek, corporate IT, internet | ERP, e-mail, Microsoft 365, enterprise-identiteit | Enterprisezone |
| 3.5 | Industriële DMZ (niet in het oorspronkelijke model; gebruikelijk in de praktijk) | Replica van historian, patchserver, gateway voor externe toegang, bestandsoverdracht | IDMZ |
| 3 | Sitebedrijfsvoering: beheer van productiebedrijfsvoering | MES, site-historian, OT-domeincontroller, backupserver | Zone sitebedrijfsvoering |
| 2 | Gebiedsgewijze toezichthoudende besturing | SCADA, HMI, engineeringwerkstations | Lijn- of gebiedszones |
| 1 | Basisbesturing | PLC's, DCS-controllers, robotcontrollers, aandrijvingen | Cel- of lijnzones |
| 0 | Fysiek proces | Sensoren, actuatoren, motoren, kleppen | Binnen de celzones |
| Veiligheid | Veiligheidsinstrumenteerde systemen | Veiligheids-PLC, branderbeheer, perspersveiligheid | Aparte veiligheidszone |

Het Purdue-model is een startkaart, niet het zonemodel zelf. De grenzen ervan blijken op drie plaatsen:

- **IIoT en cloud.** Draadloze sensoren die gegevens rechtstreeks naar een cloudplatform sturen, slaan niveaus over. IEC PAS 62443-1-6 (december 2025) geeft richtlijnen voor het toepassen van de reeks op IIoT-systemen [5]; het concept van NIST SP 800-82 Rev. 4 voegt ook dekking van IIoT met cloudconvergentie toe [10].
- **Platte lijnen.** Veel machines combineren niveau 1 en niveau 2 in één kast. Zones volgen het risico, niet de tekening.
- **Gedeelde diensten.** Een Active Directory die zowel kantoor als fabriek bedient, verbindt de niveaus 4 en 3 op een manier die de tekening niet laat zien. Breng de werkelijke afhankelijkheden in kaart, niet de bedoelde.

Voor de datarchitectuurkant (ISA-95-niveaus, unified namespace, edge-clusters in de industriële DMZ) zie de gidsen over [MES en ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) en [Azure voor productie](https://www.m365.fm/en/learn/manufacturing-it-azure/).

## De risicobeoordeling volgens 62443-3-2, stap voor stap

62443-3-2 beschrijft hoe je van "we hebben een systeem" komt naar "we kennen de zones, conduits en beoogde beveiligingsniveaus". De quick start-gids vat de werkwijze samen in zeven eisen voor zones en conduits (ZCR) [2]:

| Stap | ZCR | Activiteit | Resultaat |
|---|---|---|---|
| 1 | ZCR 1 | Het beschouwde systeem (SUC) identificeren | Grens, assetlijst, toegangspunten |
| 2 | ZCR 2 | Een initiële cyberbeveiligingsrisicobeoordeling uitvoeren | Worst-case gevolgen, uitgaande van een gecompromitteerd systeem |
| 3 | ZCR 3 | Het SUC opdelen in zones en conduits | Diagram van zones en conduits |
| 4 | ZCR 4 | Beslissen: overschrijdt het initiële risico het tolereerbare risico? | Lijst van zones die een gedetailleerde beoordeling nodig hebben |
| 5 | ZCR 5 | Een gedetailleerde cyberbeveiligingsrisicobeoordeling uitvoeren | Dreigingen, kwetsbaarheden, waarschijnlijkheid, gevolgen, SL-T per zone en conduit |
| 6 | ZCR 6 | Cyberbeveiligingseisen, aannames en beperkingen documenteren | Cyberbeveiligingseisenspecificatie (CRS) |
| 7 | ZCR 7 | Goedkeuring door de asset owner | Ondertekende CRS |

(De quick start-gids noemt de documentatiestap op één plek "ZCR 4"; in de volgorde is het de zesde stap.)

### Hoe je het in de praktijk uitvoert

**Stap 1: Definieer het systeem.** Kies een scope die één team in enkele weken aankan, zoals één productiegebouw of één lijn plus de ondersteunende systemen. Neem de externe toegangspaden en cloudverbindingen mee; ook die horen bij het systeem, ook als de servers elders staan.

**Stap 2: Initiële beoordeling met de "assume breach"-blik.** Vraag voor elke kandidaat-zone wat de slechtst denkbare uitkomst is als een aanvaller volledige controle krijgt. Gebruik je procesrisicoanalyse (PHA) of HAZOP als input: het veiligheidsteam weet al welke afwijkingen mensen kunnen schaden. De initiële beoordeling gebruikt het ongemitigeerde risico: geen krediet voor bestaande beveiligingsmaatregelen.

**Stap 3: Zones en conduits.** Teken ze aan de hand van de criteria in de vorige paragraaf. Elke verbinding die een zonegrens oversteekt, wordt onderdeel van een conduit.

**Stap 4: Tolereerbaar risico.** Je bedrijf heeft een risicomatrix nodig die aangeeft welke combinaties van waarschijnlijkheid en gevolg tolereerbaar zijn. Veel fabrieken hebben er al een voor procesveiligheid of enterprise risk management; hergebruik die in plaats van een nieuwe te bedenken.

**Stap 5: Gedetailleerde beoordeling.** Voor zones boven de tolereerbaarheidsgrens: maak een lijst van dreigingsscenario's (ATT&CK for ICS helpt [15]), bestaande maatregelen en kwetsbaarheden, en schat daarna waarschijnlijkheid en gevolg in. Leid per FR de SL-T af.

**Stap 6: Cyberbeveiligingseisenspecificatie.** Leg per zone en conduit vast: SL-T, vereiste maatregelen, aannames (bijvoorbeeld "de kast is op slot en de hal heeft badgetoegang") en beperkingen ("de HMI-leverancier ondersteunt geen antivirus"). De CRS is het document dat je overhandigt aan een integrator of een machinebouwer.

**Stap 7: Goedkeuring.** De fabrieksmanager of de aangewezen asset owner ondertekent. Deze stap is belangrijk: hij maakt het restrisico tot een managementbeslissing en niet tot een technische voorkeur.

### Een eenvoudig scoringsschema

Gebruik de schaal die je enterprise risk management hanteert. Heb je er geen, dan werkt het onderstaande 5x5-schema voor een eerste ronde.

| Score | Waarschijnlijkheid (met huidige maatregelen) | Gevolg (slechtst denkbaar, per zone) |
|---|---|---|
| 1 | Niet plausibel binnen de levensduur van het systeem | Geen veiligheidseffect, minder dan 4 uur stilstand, minder dan $50.000 |
| 2 | Plausibel maar onwaarschijnlijk | Eerstehulpgeval, tot 1 shift stilstand, tot $250.000 |
| 3 | Kan binnen 10 jaar gebeuren | Meldingsplichtig letsel, 1 tot 3 dagen stilstand, tot $1 miljoen |
| 4 | Kan binnen 3 jaar gebeuren | Ernstig letsel of milieuvrijkomen, 1 tot 2 weken stilstand, tot $5 miljoen |
| 5 | Naar verwachting binnen een jaar | Dodelijk slachtoffer of grote vrijkomst, meer dan 2 weken, meer dan $5 miljoen |

De dollar- en tijdsdrempels hierboven zijn illustratief en moeten door elk bedrijf worden vastgesteld, afgestemd op de eigen risicobereidheid.

Risico = waarschijnlijkheid x gevolg. Een veelgebruikte indeling: 1 tot 6 tolerabel, 8 tot 12 vereist maatregelen en goedkeuring, 15 tot 25 niet tolerabel. Voor de SL-T is een praktische vuistregel: zones waarvan het ergste gevolg 4 of 5 scoort, krijgen SL-T 3 voor FR 1 tot FR 3 en FR 7; zones met gevolg 2 of 3 krijgen SL-T 2; gevolg 1 krijgt SL-T 1. Deze vuistregel is onze vereenvoudiging voor een eerste ronde; de norm vereist een gedocumenteerde onderbouwing, geen formule.

## Uitgewerkt voorbeeld: zones en conduits voor een middelgrote fabriek

Abstracte definities brengen je maar een eind. Deze sectie past 62443-3-2 toe op een fictieve maar typische fabriek. Alle namen en getallen zijn illustratief.

### De fabriek

"Midwest Components" maakt metalen behuizingen en onderdelen voor landbouw- en bouwmachines. Eén locatie, 420 medewerkers, drie ploegen, een jaaromzet van ongeveer $150 miljoen. Productie:

- **Perserij:** vier servopersen met transferautomatisering; één persstraat heeft een veiligheids-PLC met lichtschermen en een tweehandbediening.
- **Lascelgebied:** twaalf robotlascellen van twee machinebouwers, elk met eigen PLC, robotcontroller en HMI.
- **Verfafdeling:** poedercoatlijn met een uitharingsoven (gasbrander met een brandermanagementsysteem), aangestuurd door een kleine DCS.
- **Montage:** twee handmatige montagelijnen met momentsleutels, etikettenprinters en een lijn-PLC voor de transportband.
- **Utilities:** perslucht, koelwater, HVAC en energiemeting op een SCADA-systeem.
- **Sitesystemen:** MES met een server en 40 clients, een historian, een kwaliteitslab met een coördinatenmeetmachine (CMM), een OT Active Directory, een back-upserver.
- **Onderneming:** ERP gehost door de IT van het moederbedrijf, Microsoft 365, bedrijfsidentiteit.
- **Externe toegang:** de twee machinebouwers voor lassen en de persfabrikant gebruiken elk momenteel hun eigen externe-toegangsbox met een mobiele modem. De integrator van de verfstraat maakt verbinding via een VPN van de leverancier.
- **Cloud:** een dienst voor energiemonitoring ontvangt meterdata via internet van een gateway in het utilities-netwerk.

### Stap 1 en 2: initiële beoordeling

Het team (manager technische dienst, controls lead, IT-securitylead, EHS-manager en de onderhoudsmanager) loopt elk gebied langs met de vraag "wat is het ergste plausibele resultaat als een aanvaller dit beheerst?"

| Gebied | Ergste plausibele resultaat (uitgaan van een inbreuk) | Gevolgscore |
|---|---|---|
| Veiligheids-PLC persstraat | Veiligheidsfunctie uitgeschakeld tijdens bedrijf, risico op ernstig letsel | 5 |
| Persbesturing | Beschadigde matrijzen en persen, weken stilstand | 4 |
| Brandermanagement verfoven | Onveilige brandercondities, risico op brand of explosie | 5 |
| Verf-DCS | Verloren batches, meerdere dagen stilstand | 3 |
| Lascellen | Beschadigde spanmiddelen, kwaliteitsafwijkingen, 1 tot 3 dagen per cel | 3 |
| Montagelijnen | Verkeerd moment of verkeerde etiketten, kwaliteitsafwijking richting klanten | 3 |
| Utilities SCADA | Verlies van perslucht en koelwater stopt de hele fabriek | 4 |
| MES en historian | Fabriek kan enkele dagen in een verminderde handmatige modus draaien | 3 |
| Kwaliteitslab | Verkeerde meetdata, kwaliteitsafwijking | 2 |
| Enterprise-IT | Bedrijfsverstoring; fabriek stopt als order- en verzenddata niet beschikbaar zijn | 4 |

### Stap 3: het zonemodel

| Zone | Inhoud | SL-T (FR 1-3, FR 5-7 / FR 4) | Onderbouwing |
|---|---|---|---|
| Z0 Enterprise | Corporate IT, ERP, Microsoft 365 | Beheerd door corporate IT onder CSF 2.0 | Buiten de IACS, maar de belangrijkste bron van dreigingen |
| Z1 Industriële DMZ | Historian-replica, server voor patch- en antivirusupdates, remote access-gateway, bestandsoverdrachtserver, jump hosts | SL 3 / SL 2 | Enige zone met directe verbinding naar Z0 en naar externe leveranciers |
| Z2 Site-operations | MES-server, site-historian, OT Active Directory, backupserver, beheer van OT-monitoringsensoren | SL 2 / SL 2 | Gevolg 3, maar centrale diensten voor alle lijnen |
| Z3 Perslijnbesturing | Pers-PLC's, transferautomatisering, HMI's, engineeringwerkstation pers | SL 2, SL 3 voor FR 3 / SL 1 | Gevolg 4: integriteit van de logica is het belangrijkst |
| Z4 Persveiligheid | Veiligheids-PLC, lichtschermen, tweehandbediening | SL 3 / SL 1 | Gevolg 5; aparte zone met minimale conduits |
| Z5 Lascellen (machinebouwer A) | Zes cellen | SL 2 / SL 1 | Gevolg 3, turnkey van één leverancier |
| Z6 Lascellen (machinebouwer B) | Zes cellen | SL 2 / SL 1 | Idem, andere leverancier en ander pad voor remote access |
| Z7 Verf-DCS | DCS-controllers, operatorstations | SL 2 / SL 1 | Gevolg 3 |
| Z8 Brandermanagement | Brandermanagementsysteem van de uitharingsoven | SL 3 / SL 1 | Gevolg 5; aparte veiligheidszone |
| Z9 Montage | Lijn-PLC's, torsiecontrollers, labelprinters, HMI's | SL 2 / SL 1 | Gevolg 3 |
| Z10 Utilities | SCADA, compressoren, koelmachines, HVAC-regelingen, meters | SL 2, SL 3 voor FR 7 / SL 1 | Gevolg 4: beschikbaarheid is het belangrijkst |
| Z11 Kwaliteitslab | CMM, lab-pc's | SL 2 / SL 2 | Meetgegevens en klanttekeningen |
| Z12 IIoT-energiegateway | Metergateway met cloudverbinding | SL 2 / SL 1 | Directe internetverbinding, geïsoleerd van de besturing in Z10 |

Twaalf zones binnen de fabriek, plus de enterprise-zone. Let op wat er met de cellulaire remote access-boxjes is gebeurd: die verdwijnen. Alle toegang van leveranciers verloopt nu via de remote access-gateway in Z1.

### De conduits

| Conduit | Tussen | Toegestaan verkeer | Beheersmaatregelen |
|---|---|---|---|
| C1 | Z0 Enterprise <-> Z1 IDMZ | ERP naar MES-orderinterface via IDMZ-broker; gebruikers naar historian-replica (alleen lezen); downloads van updates | Firewallpaar (enterprisekant en fabriekskant), geen direct verkeer van Z0 naar Z2 of lager, logging |
| C2 | Z1 IDMZ <-> Z2 Site-operations | Replicatie van historian (Z2 naar Z1), MES-interface, distributie van patches, sessies via jump hosts | Firewall met expliciete allow-regels, MFA voor jump hosts, sessie-opname |
| C3 | Externe leveranciers <-> Z1 IDMZ | Remote access-sessies | Remote access-gateway met persoonlijke accounts, MFA, goedkeuring per sessie, tijdslimieten, opname |
| C4 | Z2 <-> Z3, Z5, Z6, Z7, Z9, Z10, Z11 | MES naar lijn-PLC's en HMI's (gedefinieerde industriële protocollen), verzamelen van historiandata, backups, engineeringtoegang via jump host | Interne firewall of ACL's per zone; alleen benoemde protocollen en hosts |
| C5 | Z3 Perslijnbesturing <-> Z4 Persveiligheid | Alleen statussignalen | Bedraad of een dedicated veiligheidsnetwerk; geen routeerbare verbinding naar Z2 |
| C6 | Z7 Verf-DCS <-> Z8 Brandermanagement | Status- en permissiesignalen | Bedrade I/O; geen engineeringtoegang behalve lokaal met MOC |
| C7 | Z12 IIoT-gateway <-> internet (cloudservice) | Alleen uitgaande versleutelde telemetrie | Gateway in een eigen VLAN, alleen uitgaand, geen inkomende verbindingen |
| C8 | Z10 Utilities -> Z12 | Meterwaarden | Eenrichtingsdataverkeer (datadiode of unidirectionele firewallregel), geen pad van Z12 terug naar Z10. Controleer eerst of het meterprotocol eenrichtingsverkeer ondersteunt; request-response-protocollen vragen om een gateway die aan de kant van Z10 pollt |

### Stappen 4 tot 7: van lacunes naar een eisenspecificatie

De gedetailleerde beoordeling voor Z4 Persveiligheid laat zien: initieel risico 5 (gevolg) x 3 (waarschijnlijkheid: de veiligheids-PLC is bereikbaar vanuit het HMI-netwerk van de pers en vanaf een cellulair modem van een machinebouwer) = 15, niet tolereerbaar. Met de geplande maatregelen (aparte zone, geen routeerbare conduit, cellulair modem verwijderd, sleutelschakelaar beveiligd in RUN, logchecksum wekelijks gecontroleerd) schat het team de waarschijnlijkheid op 1 en het restrisico op 5, tolereerbaar. De asset owner tekent voor akkoord.

Voor Z5 en Z6 zit de achterstand vooral in FR 1 en FR 2: gedeelde accounts op alle twaalf HMI's en de teach pendants van de robots. De CRS voor de volgende celaankoop vereist benoemde accounts en een SL-C 2 gecertificeerde HMI; voor de bestaande cellen is de compenserende maatregel een jump host met persoonlijke accounts ervoor en een verbod op directe laptopverbindingen.

### Hoe het resultaat eruitziet na één jaar

| Meetwaarde | Voor | Na 12 maanden |
|---|---|---|
| Ongecontroleerde externe toegangspaden | 4 (3 cellulaire boxen, 1 VPN van een leverancier) | 0; één gateway met MFA en registratie |
| Zones | 1 vlak productienetwerk, kantoor-VLAN ernaar gerouteerd | 12 productiezones plus enterprise, met IDMZ ertussen |
| Assets met bekende eigenaar en firmwareversie | Onbekend | 96% van de 640 geïnventariseerde netwerkgekoppelde assets |
| Controllers met offline back-up van de actuele logica | Ongeveer de helft (schatting) | 100% van de 58 PLC's en controllers, herstel getest op 6 |
| Incidentplaybook | Geen | Geschreven, getest in één tabletop-oefening met productie |

Deze cijfers zijn illustratief. Het gaat om de vorm van het resultaat: minder paden, bekende assets, herstelbare logica.

## OT-assetinventaris

Je kunt niet beschermen wat je niet kent. De assetinventaris is stap nul van 62443-3-2 (identificeer het beschouwde systeem) en van elk NIST-profiel. De concept-versie van NIST SP 800-82 Rev. 4 breidt de richtlijnen over assetbeheer uit [10].

### Wat je moet vastleggen

Een bruikbare inventaris is meer dan een lijst met IP-adressen. De tabel is een sjabloon; begin met de vetgedrukte velden en voeg de rest na verloop van tijd toe.

| Veld | Voorbeeld | Waarom het ertoe doet |
|---|---|---|
| **Asset-ID en naam** | PR3-PLC01 | Unieke verwijzing in tickets en tekeningen |
| **Type** | PLC, HMI, robotcontroller, switch, server, werkstation | Bepaalt welke maatregelen van toepassing zijn |
| **Fabrikant, model** | (leverancier), (model) | Vergelijken met adviezen van leveranciers |
| **Firmware- / softwareversie** | v32.011 | Beslissingen over kwetsbaarheden en patches |
| **Zone** | Z3 Perscontrole | Koppelt de asset aan het zonemodel |
| **Locatie** | Persllijn 3, kast +A1 | Fysieke toegang en onderhoud |
| **Eigenaar** | Regeltechniek, pers | Wie beslist over wijzigingen |
| **Kritikaliteit** | Gevolgscore 4 | Prioritering |
| Netwerkadressen en protocollen | 10.30.3.11, EtherNet/IP | Firewallregels, basislijnen voor monitoring |
| Communicatiepartners | HMI PR3-HMI01, MES-server | Definitie van de conduit |
| Externe toegang | Alleen via jump host | Blootstelling |
| Back-upstatus | Logica geback-upt 2026-11-05, herstel getest 2026-06 | Herstelgereedheid |
| Ondersteuningsstatus leverancier | Ondersteund tot (datum) of end of life | Levenscyclusplanning |
| Accounts | Benoemde accounts ja/nee; standaardwachtwoord gewijzigd ja/nee | Hiaten FR 1 en FR 2 |
| Bekende kwetsbaarheden | Adviesreferentie, besluit | Patch- en compenserende maatregelen |
| Reserveonderdelen en vervanging | Reserve op voorraad ja/nee | Hersteltijd |

### Hoe je hem opbouwt zonder iets te breken

1. **Begin met wat er al is.** Elektrotechnische tekeningen, PLC-projectbestanden, switchconfiguraties, onderhoudsbeheer (CMMS)-gegevens, inkooporders en de documentatie van de machinebouwers bevatten al het grootste deel van de gegevens.
2. **Passieve netwerkdetectie.** Commerciële OT-monitoringtools luisteren mee op een kopie van het netwerkverkeer (via een SPAN-poort of netwerk-TAP) en herkennen apparaten, firmwareversies en communicatiepatronen zonder pakketten naar de controllers te sturen.
3. **Leverancierstools en gecontroleerde queries.** Engineeringsoftware kan apparaatinformatie veilig uit controllers lezen. Actieve queries zijn acceptabel wanneer de leverancier ze ondersteunt en productie een tijdvenster heeft ingestemd.
4. **Loop de productievloer af.** Elke inventaris vindt apparaten die op geen enkele tekening staan: een vergeten cellulaire router, een laptop in een kast, een draadloos toegangspunt dat door een contractor is geïnstalleerd.
5. **Houd hem actueel.** Koppel updates aan wijzigingsbeheer: geen nieuw apparaat gaat live zonder inventarisvermelding. Stem maandelijks af met wat de monitoring ziet.

### Een opmerking over tools

Gespecialiseerde OT-beveiligingsplatforms automatiseren passieve detectie en het koppelen van kwetsbaarheden. Microsoft heeft aangekondigd dat het de OT-beveiligingscomponent van Defender for IoT in oktober 2029 uit dienst neemt en verwijst klanten naar partneroplossingen [31]; de [Azure for manufacturing guide](https://www.m365.fm/en/learn/manufacturing-it-azure/) behandelt die overgang. Welke tool je ook kiest, de inventaris behoort toe aan de assetbeheerder en moet exporteerbaar zijn; leg hem niet vast in de console van één leverancier.

## Netwerksegmentatie en de industriële DMZ

Segmentatie implementeert FR 5 (beperkte gegevensstroom). Het is de enige maatregel die de verspreiding in de meeste gevallen uit sectie 3 had kunnen beperken, en het is ook waar de meeste fabrieken de grootste leemte vinden.

### Doelarchitectuur

- **Tweelaagse grens tussen bedrijfsnetwerk en fabriek.** Een industriële DMZ (IDMZ) tussen het bedrijfsnetwerk en de sitebediening, met firewalls aan beide kanten. Er gaat geen verkeer rechtstreeks van het bedrijfsnetwerk naar de fabriek; elke uitwisseling eindigt in de IDMZ (databroker, replica van de historian, bestandsoverdracht, jump host, patchserver).
- **Interne segmentatie per zone.** Binnen de fabriek bevindt elke zone zich in een eigen VLAN of fysiek netwerk, met een firewall of toegangslijsten (ACL's) op de conduit.
- **Veiligheidssystemen gescheiden.** Veiligheidszones hebben geen routeerbare verbinding met de rest, of alleen via een strikt beperkte conduit die door procesveiligheid is goedgekeurd.
- **Geen computers met twee netwerkkaarten.** Een pc met één netwerkkaart op kantoor en één in de fabriek omzeilt elke firewall.
- **Internet alleen via gedefinieerde paden.** Cloudverbindingen verlopen via de IDMZ of vanuit een speciale IIoT-zone, alleen uitgaand.

### Een segmentatieproject in zeven stappen

1. **Breng eerst het werkelijke verkeer in kaart.** Voer twee tot vier weken passieve monitoring uit om te zien wie met wie communiceert. Fabrieken komen altijd verrast uit de bus.
2. **Teken het doelzonemodel** (sectie 9) en stem het af met de productie.
3. **Bouw de IDMZ** en verplaats diensten die grenzen overschrijden ernaartoe: replica van de historian, gateway voor externe toegang, patchserver, bestandsoverdracht.
4. **Zet firewalls eerst op "toestaan en loggen".** Installeer firewalls op de conduits met regels die het huidige verkeer toestaan en alles loggen.
5. **Verscherp de regels stapsgewijs.** Vervang brede regels door specifieke (bron, bestemming, protocol, poort), één zone tegelijk, tijdens geplande vensters met regeltechnici ter plaatse.
6. **Schakel over op "standaard weigeren"** zodra de logs alleen verwacht verkeer tonen.
7. **Beheer de regels via wijzigingsbeheer.** Elke nieuwe regel heeft een aanvrager, een zakelijke reden, een vervaldatum en een goedkeuring nodig.

### Sjabloon voor firewallregels

| Veld | Voorbeeld |
|---|---|
| Regel-ID | C4-017 |
| Conduit | C4 (Z2 Sitebediening -> Z3 Persbesturing) |
| Bron | MES-server 10.20.1.15 |
| Bestemming | PR3-PLC01 10.30.3.11 |
| Protocol / poort | EtherNet/IP, TCP 44818 |
| Richting | Alleen Z2 -> Z3 |
| Zakelijke reden | MES leest onderdeeltellers en schrijft ordernummers |
| Aangevraagd door / goedgekeurd door | MES-beheerder / regeltechnisch leider, pers |
| Geldig tot | Evaluatiedatum 2027-11 |
| Logging | Ja |

### Draadloze en mobiele verbindingen

Wi-Fi voor handscanners, draadloze sensoren en de mobiele modems in machinekasten creëren allemaal paden die niet op de bekabelde netwerktekening staan. Behandel elk draadloos netwerk als een eigen zone of als onderdeel van een conduit: afzonderlijke SSID's voor fabrieksapparaten en gasten, certificaatgebaseerde authenticatie voor fabrieksapparaten, geen koppeling tussen draadloze en besturingsnetwerken, en een regelmatige radiometing om ongeautoriseerde toegangspunten en modems op te sporen. Draadloze IIoT-sensoren die gegevens rechtstreeks naar een clouddienst sturen, horen thuis in een IIoT-zone zoals Z12 in het uitgewerkte voorbeeld.

### Veelvoorkomende segmentatieproblemen

- **Engineeringlaptops** die tussen zones en het kantoor worden meegenomen. Oplossing: vaste engineeringwerkstations per zone of een jump host, en laptops die het fabrieksnetwerk nooit verlaten.
- **Platte machinenetwerken** die door machinebouwers worden opgeleverd, waarbij de HMI, PLC en een router voor externe toegang op dezelfde onbeheerde switch zitten. Oplossing: behandel de machine als één zone en beheers de conduit aan de rand.
- **Gedeelde Active Directory.** Een bedrijfsdomein dat in de fabriek is uitgebreid, geeft een aanvaller die het domein in handen heeft ook de fabriek. Oplossing: een apart OT-domein of lokale accounts met een gedefinieerd vertrouwensmodel.
- **Broadcast-zware protocollen** die niet goed routeren. Oplossing: plan VLAN-grenzen samen met de leverancier van de besturing; sommige protocollen vereisen layer-2-buren.

## Veilige externe toegang voor leveranciers en engineers

In veel fabrieken is externe toegang het grootste ongecontroleerde pad: machinebouwers hebben het nodig voor ondersteuning, en productie wil snelle hulp wanneer een machine stilvalt. Verbieden werkt zelden; het praktische antwoord is één gecontroleerd pad dat makkelijker te gebruiken is dan de omwegen.

In september 2026 publiceerden CISA en de FBI een factsheet voor exploitanten van kritieke infrastructuur die werken met externe ICS-integratoren. Het verwijst naar een FBI-analyse van een inbraak in 2025 bij een Amerikaans automatiseringsbedrijf en raadt aan de toegang van integratoren te beperken tot het minimaal noodzakelijke, cyberbeveiligingseisen (inclusief externe toegang en patchbeheer) in contracten op te nemen, de blootstelling van apparaten aan internet te verminderen, en externe toegang te monitoren en te loggen, waarbij waar mogelijk gebruik wordt gemaakt van toegang op verzoek [14].

### Eisen voor externe toegang (sjabloon)

| Eis | Detail | 62443 FR |
|---|---|---|
| Eén pad | Alle externe sessies via een gateway in de IDMZ; geen cellulaire modems, geen leveranciers-VPN's die in productiezones eindigen | FR 5 |
| Persoonlijke accounts | Één account per persoon, geen gedeelde leveranciersaccounts | FR 1 |
| Multifactorauthenticatie | Voor elke externe sessie | FR 1 |
| Goedkeuring per sessie | Contactpersoon in de fabriek keurt elke sessie goed; toegang staat standaard uit | FR 2 |
| Minimale rechten | Alleen toegang tot de assets die de leverancier ondersteunt, voor de benodigde tijd | FR 2 |
| Sessieregistratie en logging | Opgenomen en gedurende een vastgestelde periode bewaard | FR 6 |
| Toezicht bij wijzigingen | Logicawijzigingen alleen met een procesengineer die meekijkt en een werkorder | FR 3 |
| Bestandsoverdracht | Bestanden alleen via een gescande overdrachtszone | FR 3 |
| Contract | Regels voor externe toegang, meldingsplichten en aansprakelijkheid in het serviceontract | 2-4 |

### Praktische tips

- **Maak het veilige pad makkelijker dan het onveilige.** Als goedkeuring 's nachts twee uur duurt, sluit iemand een cellulaire router aan. Wijs per ploeg een goedkeurder van wacht aan.
- **Verwijder de losse apparaten.** Tel elk apparaat voor externe toegang in de inventaris en verwijder of schakel uit wat niet via de gateway loopt. Veel machinebouwers leveren lijnen met hun eigen router; neem dat op in de inkoopspecificatie (paragraaf 17).
- **Controleer accounts elk kwartaal.** Verwijder accounts van leveranciersmedewerkers die zijn vertrokken.

## Patchbeheer en kwetsbaarheidsbeheer in OT

In kantoor-IT geldt de regel "patch snel". In OT geldt de regel "beslis weloverwogen". Een patch kan vereisen: goedkeuring van de leverancier, een herstart van de controller, hervalidatie in gereguleerde industrieën of een volledige lijntest. In door de FDA gereguleerde fabrieken (farmacie, medische hulpmiddelen, voedsel) en onder eisen van klanten in de automotive- of luchtvaartsector activeert een wijziging aan een gevalideerd systeem meestal uw wijzigingsbeheer- en validatieprocedure; plan de beoordelingstijd van de kwaliteitsafdeling in het patchvenster. ISA-TR62443-2-3 beschrijft patchbeheer in de IACS-omgeving [1].

### Bronnen van kwetsbaarheidsinformatie

- Beveiligingsadviezen van leveranciers en productbeveiligingsportalen van uw PLC-, HMI-, aandrijvings- en softwareleveranciers.
- De ICS-adviezen van CISA, die kwetsbaarheden in industriële producten publiceren, vaak in overleg met de leveranciers [unverified as to current volume; check the CISA advisories page].
- Uw OT-monitoringtool, die firmwareversies uit de inventaris vergelijkt met adviezen.

### Een beslistabel per advies

| Vraag | Bij ja | Bij nee |
|---|---|---|
| Staat het getroffen product in onze inventaris? | Doorgaan | Sluiten, documenteren |
| Wordt de kwetsbare functie gebruikt of is zij bereikbaar in onze configuratie? | Doorgaan | Reden documenteren; opnieuw controleren bij de volgende wijziging |
| Is bekend dat er misbruik van wordt gemaakt, of is een openbare exploit beschikbaar? | Prioriteit hoog | Prioriteit op basis van gevolgscore |
| Is het asset bereikbaar vanuit een zone met lager vertrouwen of op afstand? | Prioriteit hoog | Prioriteit gemiddeld |
| Keurt de leverancier de patch goed voor onze versie? | Patch plannen in het eerstvolgende venster | Compenserende maatregelen toepassen |
| Kan de patch worden toegepast zonder stilstand? | Plannen in normaal onderhoud | Plannen in geplande stilstand |

### Compenserende maatregelen wanneer u niet kunt patchen

Wanneer de patch niet beschikbaar is, niet is goedgekeurd of niet mogelijk is vóór de volgende stilstand:

- Beperk de conduit: sta alleen de hosts en protocollen toe die het asset nodig heeft.
- Schakel ongebruikte services en poorten uit.
- Zet de sleutelschakelaar van de controller op RUN om externe wijzigingen aan het programma te blokkeren, waar de controller dat ondersteunt.
- Verhoog de monitoring van het asset (meldingen bij nieuwe verbindingen of programmadownloads).
- Documenteer het restrisico en verkrijg goedkeuring van de eigenaar van het asset.

### Voorbeeldbeslissing

Een advies beschrijft een op afstand uitbuitbare denial-of-service-kwetsbaarheid in de webserver van het PLC-model dat wordt gebruikt voor de besturing van pers Z3. De inventaris toont vier getroffen PLC's. De webserver is ingeschakeld maar wordt niet gebruikt. De firmwarefix is beschikbaar, maar vereist een herstart van de controller en de leverancier adviseert een functionele test. Besluit: schakel de webserver in het eerstvolgende weekendvenster uit op alle vier de PLC's (30 minuten per pers), blokkeer HTTP en HTTPS naar de PLC's in conduit C4, en installeer de firmware bij de geplande stilstand over acht weken. Het tijdelijke risico wordt gedocumenteerd en goedgekeurd door de manager technische dienst van de fabriek.

### Verouderde systemen en systemen aan het einde van hun levensduur

Elke fabriek heeft systemen die nooit meer een patch zullen krijgen: HMI's met een niet langer ondersteunde Windows-versie, controllers waarvan de leverancier de productie heeft stopgezet. Behandel ze als een levenscyclusprobleem met een budget, niet als een beveiligingsuitzondering die eindeloos wordt verlengd. Het inventarisveld "ondersteuningsstatus van de leverancier" voedt een vervangingsplan dat is afgestemd op lijnherbouw en kapitaalplanning.

## Accounts, hardening en verwisselbare media

FR 1 tot FR 3 zijn de plaatsen waar fabrieken de meest zichtbare hiaten hebben en de goedkoopste oplossingen.

### Accounts en identiteiten

- **Schaf gedeelde logins af waar het systeem dat toelaat.** Gedeelde accounts zoals "Operator", "maint" en "admin" die door een hele ploeg worden gebruikt, maken elke wijziging onherleidbaar. Veel actuele HMI's en SCADA-systemen ondersteunen benoemde accounts of login met badge; oudere systemen misschien niet.
- **Scheid beheerdersaccounts.** Ingenieurs gebruiken een gewoon account voor e-mail en een apart account voor OT-beheer, nooit hetzelfde.
- **Wijzig standaardwachtwoorden** op elk apparaat dat ze heeft: switches, routers, HMI's, robotcontrollers, camera's. Maak er een punt van op de inbedrijfstellingschecklist.
- **Gebruik MFA waar een mens op afstand of naar de IDMZ inlogt.** Op de productievloer is MFA op een HMI vaak onpraktisch; compenseer dit met fysieke toegangscontrole en korte schermvergrendelingen waar het proces dat toelaat.
- **Bescherm de helpdesk.** De zaak Clorox laat zien dat een social engineering-telefoontje naar een IT-helpdesk kan leiden tot bevoegde toegang [20]. Eis identiteitsverificatie bij het resetten van wachtwoorden en MFA, met strengere controles voor geprivilegieerde accounts.

### Hardening van op Windows gebaseerde OT-systemen

HMI's, SCADA-servers, historians en engineeringwerkstations zijn meestal Windows-computers. Hardening ervan volgt de richtlijnen van de leverancier:

1. Verwijder software en services die het systeem niet nodig heeft (minimale functionaliteit).
2. Gebruik application allowlisting in plaats van, of naast, antivirus, waar de leverancier dat ondersteunt.
3. Schakel USB-poorten uit of beperk ze.
4. Beperk lokale beheerdersrechten.
5. Bewaar een bekend-goed image en de installatiemedia voor snelle herinstallatie.

### Controllers

- Zet de sleutelschakelaar of softwarebeveiliging op RUN waar de controller dat biedt, en registreer elke wijziging naar de PROGRAM-modus.
- Bewaar de huidige logica offline en vergelijk regelmatig checksums of projectversies om ongeautoriseerde wijzigingen te detecteren (FR 3).
- Schakel ongebruikte services uit (webservers, FTP, SNMP-schrijftoegang).

### Verwisselbare media

USB-sticks en laptops brengen malware over elke netwerkgrens. Een eenvoudige set regels:

| Regel | Implementatie |
|---|---|
| Geen privémedia | Schriftelijk beleid, training, bordjes bij de werkplekken |
| Scan vóór gebruik | Een scanstation bij de fabrieksingang of in de IDMZ |
| Alleen bedrijfsmedia | Versleutelde, geïnventariseerde USB-sticks voor engineering |
| Geef het netwerkpad de voorkeur | Bestandsoverdracht via de IDMZ-server in plaats van USB |
| Technische handhaving | USB-poorten uitgeschakeld of beperkt via beleid op HMI's en servers |

## Monitoring en detectie

FR 6 (tijdige reactie op gebeurtenissen) vereist dat u incidenten opmerkt. In OT komt detectie uit twee bronnen: logs en netwerkverkeer.

### Wat te loggen

| Bron | Gebeurtenissen | Gebruik |
|---|---|---|
| Firewalls bij conduits | Toegestane en geweigerde verbindingen | Onverwacht verkeer tussen zones |
| Gateway voor externe toegang | Aanmeldingen, goedkeuringen, sessieopnamen | Beoordeling van leverancieractiviteit |
| OT Active Directory en jump hosts | Aanmeldingen, wijzigingen van rechten, nieuwe accounts | Misbruik van accounts |
| Engineeringwerkstations | Starten van software, downloads van projecten | Ongeautoriseerde wijzigingen van logica |
| Controllers (waar ondersteund) | Modus-wijzigingen, programmadownloads, firmware-updates | Integriteit |
| Backupsysteem | Succesvolle en mislukte jobs | Hersteltereidheid |

### Passieve OT-netwerkmonitoring

Gespecialiseerde OT-monitoringtools decoderen industriële protocollen en leren het normale communicatiepatroon van een fabriek. Vervolgens waarschuwen ze bij afwijkingen: een nieuw apparaat, een nieuwe verbinding tussen zones, een programmadownload buiten een onderhoudsvenster, of een commando dat van een ongebruikelijke host wordt verzonden. Omdat ze uitsluitend meeluisteren naar gekopieerd verkeer, hebben ze geen invloed op het proces. De NIST SP 800-82 Rev. 4-conceptversie breidt haar richtlijnen voor netwerkmonitoring en detectie uit [10].

### Wie let op de meldingen

Een melding die niemand leest, is een kost zonder baten. Opties voor een middelgrote fabriek:

- **Corporate security operations center (SOC)** met een OT-playbook en een benoemde regeltechnisch ingenieur die in de fabriek bereikbaar is.
- **Managed detection service** van een aanbieder met OT-ervaring.
- **Beoordeling op fabrieksniveau** van een klein aantal waardevolle meldingen (nieuw apparaat, programmadownload, externe sessie zonder goedkeuring), waarbij de rest naar het SOC wordt doorgestuurd.

Wat u ook kiest, leg vast wie welke actie mag ondernemen. Een SOC-analist mag nooit zelfstandig een lijn stilleggen; het playbook bepaalt wie beslist.

## Back-up, herstel en OT-incidentrespons

FR 7 (beschikbaarheid van middelen) en de functies "Respond" en "Recover" van CSF 2.0 komen hier samen [11]. De zaak Norsk Hydro is het klassieke voorbeeld: het bedrijf hield grote delen van de productie draaiende met handmatige procedures en schatte later de totale kosten op ongeveer NOK 800 miljoen [17].

### Wat u moet back-uppen

| Item | Frequentie | Opslag | Herstelttest |
|---|---|---|---|
| PLC-, veiligheids-PLC- en robotprogramma's | Na elke wijziging en maandelijks | Offline en offsite kopie | Jaarlijks per kritieke controller, op een reserve of simulator |
| HMI- en SCADA-projecten | Na elke wijziging | Offline en offsite | Jaarlijks |
| Serverimages (MES, historian, SCADA, OT-domeincontroller) | Wekelijks volledig, dagelijks incrementeel | Onveranderlijke of offline kopie | Tweemaal per jaar, volledige herbouw van één server |
| Configuraties van netwerkapparaten | Na elke wijziging | Offline | Jaarlijks |
| Firmware en installatiemedia | Bij update | Offline bibliotheek | Jaarlijks controleren op volledigheid |
| Documentatie (tekeningen, zonemodel, inventaris, export van wachtwoordkluis) | Maandelijks | Offline, afgedrukt exemplaar van het essentiële | Controleren tijdens tabletop-oefening |

### Het OT-incidentplaybook

Een OT-playbook verschilt van een IT-playbook in wie beslist en wat eerst komt.

| Fase | OT-specifieke inhoud |
|---|---|
| Voorbereiding | Contactlijst inclusief machinebouwers en leveranciers van besturingen; beslissingsbevoegdheid; reserve engineeringlaptop met schone images; handmatige bedieningsprocedures per gebied |
| Detectie en analyse | Gezamenlijk overleg van IT-beveiliging, regeltechnisch verantwoordelijke en productiemanager binnen een vastgestelde tijd; eerste vraag: is de veiligheid in het geding? |
| Insluiten | Vooraf afgesproken opties: bedrijfsnetwerk loskoppelen van de IDMZ, IDMZ loskoppelen van de fabriek, afzonderlijke zones isoleren. Wie mag welke stekker eruit trekken, en tegen welk risico voor de productie |
| Veilige toestand | Procesveiligheid beslist of er wordt doorgedraaid, handmatig wordt gedraaid of veilig wordt afgeschakeld; veiligheidssystemen worden nooit uitgeschakeld om het herstel te "helpen" |
| Verwijdering en herstel | Herbouwen vanuit bekende goede images; controllerlogica verifiëren tegen offline back-ups vóór herstart; gefaseerde herstart per zone |
| Rapportage | Juridisch en communicatie: beoordeling van materialiteit volgens de SEC voor beursgenoteerde bedrijven, meldingen aan klanten, verzekeraar, politie, NIS2- of CRA-meldingen voor EU-verplichtingen (hoofdstuk 19) |
| Lessen geleerd | Grondoorzaak, bijgewerkt zonemodel en playbook |

### Oefenen

Voer minstens één keer per jaar een tabletoefening uit met productie, onderhoud, IT, EHS, communicatie en management. Een bruikbaar eerste scenario: "Ransomware heeft de MES en de ERP versleuteld. De lijnen draaien nog. Gaan we door met produceren, en hoe houden we bij wat we bouwen en verzenden?" Het antwoord laat zien of er handmatige noodprocedures bestaan.

De CISA CPGs leggen de nadruk op governance en meetbare basispraktijken, waaronder het plannen van incidentrespons; CPG 2.0 voegde in december 2025 een governance-onderdeel toe [13].

## Eisen aan leveranciers en inkoop

Het grootste deel van het beveiligingsniveau van een fabriek wordt ingekocht, niet zelf gebouwd. Elke nieuwe machine, lijn en besturingssysteem is een kans om dat niveau te verhogen. 62443 geeft de terminologie voor de inkoopspecificatie: 4-1 en 4-2 voor producten, 2-4 voor integratoren en serviceproviders, en 3-3 voor het opgeleverde systeem.

### Certificering die u kunt vragen

ISASecure, een volledig dochterbedrijf van ISA dat in 2007 is opgericht, voert certificeringsprogramma's uit op basis van 62443 [7]:

| Programma | Wat wordt gecertificeerd | Gebaseerd op |
|---|---|---|
| ISASecure CSA | Componenten (controllers, HMI's, netwerkapparatuur, software) | IEC 62443-4-2 [7] |
| ISASecure SSA | Systemen | IEC 62443-3-3 [7] |
| ISASecure SDLA | Het secure development lifecycle van een leverancier | IEC 62443-4-1 [7] |
| ISASecure ACSSA | Een operationeel IACS op een locatie: beleid, procedures, serviceproviders en technische maatregelen, beginnend met de risicobeoordeling van de asset owner | IEC 62443-2-1, 2-4, 3-2 en 3-3; aangekondigd op 18 juni 2025 [8] |

Er bestaan ook certificaten van andere conformiteitsbeoordelingsschema's (het IEC IECEE-cyberbeveiligingsprogramma is het belangrijkste alternatief voor ISASecure, zoals een whitepaper van ISASecure gepubliceerd door ISA beschrijft [37]). Een certificaat is bewijs, geen garantie: controleer de gecertificeerde productversie en het beveiligingsniveau tegen wat u koopt.

### Clausules voor de inkoopspecificatie (sjabloon)

| Onderwerp | Voorbeeldeis |
|---|---|
| Norm | Leverancier voldoet op de orderdatum aan de huidige editie van IEC 62443-4-1 (product) en IEC 62443-2-4 (integratie); bewijs: certificaat of zelfbeoordeling aan de vermelde eisen |
| Beveiligingsniveau | Componenten en het opgeleverde systeem voldoen aan SL-C 2 (SL-C 3 voor zones Z4, Z8) volgens IEC 62443-4-2 / 3-3 |
| Zonepassing | Machine wordt geleverd als één zone met een gedefinieerde conduit-interface; gedocumenteerde lijst van alle poorten, protocollen en diensten |
| Externe toegang | Geen ingebouwde modems of routers; externe ondersteuning uitsluitend via de gateway van de asset owner |
| Accounts | Named user accounts met op rollen gebaseerde rechten; geen hardcoded of ongedocumenteerde accounts; standaardwachtwoorden gewijzigd bij ingebruikname |
| Hardening | Ongebruikte diensten uitgeschakeld; hardeningshandleiding meegeleverd |
| Patching | Leverancier publiceert beveiligingsadviezen, test OS- en firmwarepatches binnen een gestelde termijn en ondersteunt het product gedurende een gestelde periode |
| SBOM | Software bill of materials voor geleverde software en firmware |
| Back-ups | Geleverde programma's en projecten in bewerkbare vorm, met herstelinstructies |
| Documentatie | Netwerkdiagram, assetlijst in het sjabloon van de asset owner, eisen voor firewallregels |
| Testen | Security-acceptatietest (poortscan in een testomgeving, accountcontrole) als onderdeel van de Factory- en Site Acceptance Tests |
| Incidentverplichtingen | Leverancier meldt kwetsbaarheden en incidenten die het geleverde systeem raken binnen een gestelde termijn aan de asset owner |

De CRA (artikel 19) maakt verschillende van deze eisen wettelijke verplichtingen voor producten die op de EU-markt worden gebracht, waaronder beveiligingsupdates en een SBOM [22][23]. Ook Amerikaanse kopers profiteren hiervan, zelfs voor fabrieken die alleen in de VS staan, omdat dezelfde producten wereldwijd worden verkocht.

### Integratoren en serviceproviders

Het CISA/FBI-factsheet voor integratoren van september 2026 voegt het standpunt van de operator toe: neem cyberbeveiliging- en leveketenseisen op in contracten en serviceovereenkomsten, leg vast waar gegevens en apparaten worden gehost, en beperk en monitor de toegang van integratoren [14]. Vraag serviceproviders naar hun bewijs volgens 62443-2-4 en beoordeel hun externe toegang en gegevensverwerking zoals u het veiligheidsprogramma van een contractor zou beoordelen.

## Mensen, veiligheid en de productievloer

OT-beveiliging faalt wanneer ze op het kantoor van IT wordt ontworpen en vervolgens aan de vloer wordt opgelegd. De mensen die de machines bedienen zijn zowel de eerste verdedigingslinie als de eersten die lijden onder slecht ontworpen maatregelen.

### Rollen en verantwoordelijkheden (voorbeeld voor een middelgrote vestiging)

| Rol | OT-beveiligingsverantwoordelijkheid |
|---|---|
| Fabrieksmanager | Eigenaar van de assets; keurt risicobeoordelingen en restrisico's goed; is verantwoordelijk voor het budget |
| OT-beveiligingsverantwoordelijke (vaak een regeltechnicus, in eerste instantie deeltijds) | Zonemodel, inventaris, regels, coördinatie bij incidenten |
| Corporate IT-beveiliging / CISO | Enterprisezone, identiteit, SOC, beleid, afstemming op CSF 2.0 |
| Regeltechniek | Veilige configuratie, back-ups, wijzigingsbeheer van de logica |
| Onderhoud | Fysieke toegang, regels voor verwisselbare media, reserveonderdelen |
| EHS / procesveiligheid | Koppelt PHA/HAZOP aan beveiligingsgevolgen; tekent voor veiligheidszones |
| Inkoop | Beveiligingsclausules in specificaties en contracten |
| Productieteamleiders en operators | Melden afwijkingen, volgen de regels voor toegang en media, voeren handmatige noodprocedures uit |

### Veiligheid en beveiliging samen

Veiligheidsingenieurs en beveiligingsingenieurs gebruiken vaak verschillende woorden voor vergelijkbare zaken: gevaren en dreigingen, SIL en SL, PHA en risicobeoordeling. Breng ze in één ruimte samen. Twee regels zijn niet onderhandelbaar:

- Beveiligingsmaatregelen mogen nooit een veiligheidsfunctie uitschakelen of verzwakken.
- Een reactie op een beveiligingsincident mag nooit het oordeel van het veiligheidsteam over de veilige toestand omzeilen.

### Training die operators accepteren

- Maak melden veilig. Een operator die toegeeft een telefoonlader te hebben aangesloten, moet bedankt worden en niet bestraft; anders wordt het volgende incident niet gemeld.
- Korte, rolspecifieke modules: wat een operator moet melden (onbekende USB-sticks, onverwacht gedrag van de HMI, vreemden die om toegang vragen), en geen algemene phishingcursus.
- Leg uit waarom. Operators begrijpen lockout/tagout omdat ze weten wat het voorkomt. Beveiligingsregels hebben dezelfde uitleg nodig.
- Betrek het personeel bij het ontwerp van maatregelen die hen raken, zoals badge-aanmelding op HMI's of schermvergrendeling. In vakbondsgevoelige vestigingen moeten wijzigingen in werkafspraken of monitoring mogelijk met de vakbond worden besproken; betrek HR en arbeidsverhoudingen vroegtijdig [algemene richtlijn; controleer uw collectieve arbeidsovereenkomst].

Voor de bredere dagelijkse praktijk van probleemoplossing op de vloer, zie de gids over [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/); een beveiligingsafwijking is één extra punt voor de dagelijkse overlegronde.

## VS- en EU-verplichtingen: CMMC, SEC, CIRCIA, NIS2 en de CRA

62443 zelf is vrijwillig. De onderstaande verplichtingen zijn dat niet. Welke ervan van toepassing zijn, hangt af van uw klanten, uw eigendomsstructuur en de landen waar u verkoopt.

### CMMC 2.0 voor defensieleveranciers

Als u onderdelen maakt voor het Amerikaanse Department of Defense, is het Cybersecurity Maturity Model Certification (CMMC)-programma van toepassing op systemen die Federal Contract Information (FCI) of Controlled Unclassified Information (CUI) verwerken, opslaan of doorgeven. De programmaregel (32 CFR Part 170) is op 16 december 2024 van kracht geworden [28]. De DFARS-regel die CMMC in contracten opneemt, is op 10 november 2025 van kracht geworden, met een gefaseerde invoering over drie jaar: fase 2 is op 10 november 2026 gestart en fase 3 is gepland voor 10 november 2027 [29]. Niveau 2 is gebaseerd op NIST SP 800-171 [28][29].

Wat dit betekent voor de productievloer:

- **De reikwijdte gaat over data, niet over machines.** Een CNC-machine die tekeningen of programma's ontvangt die als CUI zijn gemarkeerd, kan binnen de reikwijdte vallen. Een controller die alleen een transportband aanstuurt, meestal niet. De CUI-markeringen en het contract bepalen dit.
- **Gebruik zones om de reikwijdte te beperken.** Een goed gesegmenteerd zonemodel kan de CMMC-beoordelingsgrens klein houden. Dat is een van de duidelijkste financiële argumenten voor segmentatie in defensieketens.
- **Bijzondere gevallen.** Voor Niveau 2 noemt 32 CFR 170.19(c)(1) OT-, IIoT- en IoT-apparaten, testapparatuur, door de overheid verstrekte apparatuur en beperkte informatiesystemen als "Specialized Assets": assets die CUI kunnen verwerken, opslaan of doorgeven, maar niet volledig beveiligd kunnen worden. Ze moeten in de asset-inventaris staan, in de SSP worden opgenomen, beheerd worden volgens uw risicogebaseerde beveiligingsbeleid en in het netwerkdiagram worden getoond; de beoordelaar controleert de SSP maar toetst deze assets niet aan de overige CMMC-eisen [38].

Voor de planningskant van defensiewerk behandelt de [gids voor productieplanning in de lucht- en ruimtevaart](https://www.m365.fm/en/learn/aerospace-production-planning/) CMMC, ITAR en DFARS in de context van AS9100-leveranciersketens.

### SEC-regels voor beursgenoteerde bedrijven

Op grond van de SEC-regels die op 26 juli 2023 zijn vastgesteld, moeten registranten een materieel cyberbeveiligingsincident binnen vier werkdagen na de vaststelling dat het materieel is, melden op Form 8-K, en in het jaarverslag hun risicobeheer, strategie en governance op het gebied van cyberbeveiliging beschrijven [26]. Een ransomwareaanval die een fabriek stilzet, is een typisch geval voor een materialiteitsbeoordeling, dus het OT-draaiboek heeft een snelle route nodig naar de openbaarmakingscommissie.

### CIRCIA

De Cyber Incident Reporting for Critical Infrastructure Act zal vereisen dat gedekte entiteiten gedekte cyberincidenten binnen 72 uur bij CISA melden en losgeldbetalingen binnen 24 uur, zodra de definitieve regel van CISA van kracht wordt. Vanaf oktober 2026 was de definitieve regel naar het Witte Huis gestuurd voor beoordeling en nog niet gepubliceerd [27]; op 9 november 2026 lag hij daar nog, na aankomst op 1 oktober 2026 [39]. Kritieke maakindustrie is een kritieke infrastructuursector [32], dus volg welke fabrikanten de definitieve regel gaat omvatten.

### NIS2 voor Amerikaanse bedrijven met EU-vestigingen

De EU NIS2-richtlijn is via nationale wetten van toepassing op essentiële en belangrijke entiteiten in de EU, waaronder veel productiesectoren. Een Amerikaans bedrijf wordt geraakt via zijn EU-dochters en -fabrieken. De Duitse implementatiewet is op 6 december 2025 van kracht geworden; het Duitse Bundesamt für Sicherheit in der Informationstechnik (BSI) meldt dat het nu toezicht houdt op ongeveer 29.500 entiteiten in plaats van ongeveer 4.500 [24]. In Duitsland vallen bedrijven binnen de reikwijdte als ze onder de genoemde entiteitstypen vallen en minstens 50 werknemers hebben of zowel een jaaromzet als een balanstotaal van meer dan EUR 10 miljoen hebben; de productiecategorieën omvatten medische hulpmiddelen, computers en elektronica, elektrische apparatuur, machines en voertuigen [25][40]. Significante incidenten vereisen een vroegtijdige waarschuwing binnen 24 uur, een melding binnen 72 uur en een eindrapport binnen één maand [25]. Andere lidstaten hanteren vergelijkbare regels met lokale details; controleer elk land waar u een fabriek heeft.

### Cyberweerbaarheidswet voor machinebouwers en componentfabrikanten

Als u machines, controllers of software met digitale elementen op de EU-markt verkoopt, is de Cyberweerbaarheidswet (Verordening (EU) 2024/2847) van toepassing, ook op Amerikaanse fabrikanten. Vanaf 11 september 2026 moeten fabrikanten actief uitgebuite kwetsbaarheden en ernstige incidenten melden via het Single Reporting Platform van ENISA: een vroegtijdige waarschuwing binnen 24 uur, een melding binnen 72 uur, een eindrapport binnen 14 dagen nadat een corrigerende maatregel beschikbaar is (kwetsbaarheden) of binnen één maand (incidenten) [22]. De belangrijkste productvereisten gelden vanaf 11 december 2027 [23]. Voor machinebouwers betekent dit dat veilige ontwikkeling volgens de stijl van 62443-4-1 een onderdeel wordt van productconformiteit.

### Cyberverzekering

Verzekeraars stellen steeds vaker gedetailleerde vragen over OT: segmentatie, externe toegang, offline back-ups, MFA. De zaak Merck laat zien hoeveel er kan afhangen van de polisformulering; een New Jersey appelrechter oordeelde dat de oorlogsuitsluiting in de opstalpolissen van Merck niet van toepassing was op NotPetya, voordat partijen een schikking troffen [18]. Bespreek met uw makelaar of uw polissen productieverliezen door cybergebeurtenissen dekken en onder welke voorwaarden [algemene richtlijn: unverified].

## Een stappenplan van 12 tot 24 maanden

Onderstaand stappenplan is bedoeld voor één vestiging van gemiddelde omvang, zoals die in hoofdstuk 9, met een OT-beveiligingsverantwoordelijke op ongeveer een halve fulltime functie in jaar 1 (onze planningsaanname), ondersteuning vanuit de corporate IT en een externe partner voor specifieke taken, zoals de risicobeoordelingsworkshop en het ontwerp van de segmentatie. Bedrijven met meerdere vestigingen voeren fase 0 centraal uit en fasen 1 tot en met 4 per vestiging, te beginnen bij de fabriek met het hoogste risico of de meeste komende kapitaalprojecten.

| Fase | Maanden | Doelen | Belangrijkste resultaten | 62443 / CSF-anker |
|---|---|---|---|---|
| 0. Mandaat | 0-1 | Eigenaarschap en scope | Aangewezen asset owner en OT-beveiligingsverantwoordelijke, stuurgroep, scope van het eerste systeem in beschouwing, budget voor jaar 1 | 2-1; CSF Govern |
| 1. Zicht krijgen en de schade beperken | 1-6 | Zichtbaarheid en snelle risicoreductie | Asset-inventaris (eerste versie), verkeerskaart, lijst van externe toegangspaden; ongecontroleerde externe toegang verwijderen of omleiden; offline back-ups van alle controllerlogica; standaardwachtwoorden gewijzigd; regels voor verwisselbare media; eerste tabletop-oefening | 3-2 ZCR 1-2; CSF Identify, Protect |
| 2. Architectuur | 4-12 | Insluiting | Zone- en conduitmodel met SL-T, goedgekeurd door de asset owner; IDMZ gebouwd; verkeer van bedrijfsnetwerk naar productienetwerk uitsluitend via de IDMZ; remote access gateway met MFA en registratie; scheiding van OT-domein of accounts | 3-2 ZCR 3-7; 3-3 FR 5; CSF Protect |
| 3. Detecteren en reageren | 9-18 | Zien en reageren | Passieve OT-monitoring op belangrijke conduits; logverzameling; SOC-playbook met beslisbevoegdheden; schriftelijk OT-incidentplaybook; herstelltesten | 3-3 FR 6, FR 7; CSF Detect, Respond, Recover |
| 4. Verharden en slim inkopen | 12-24 | SL-A verhogen, nieuwe lekken voorkomen | Interne segmentatie voltooid; verharding van Windows-OT-systemen; patchbeslisproces actief; beveiligingsclausules in alle nieuwe inkoopspecificaties; eisen aan integrators conform 2-4; KPI-rapportage aan het management | 2-3, 2-4, 4-1, 4-2; CSF Govern |
| 5. Beheren en verbeteren | vanaf 24 | Programma in bedrijf | Jaarlijkse update van de risicobeoordeling, jaarlijkse tabletop, interne audit, optionele ACSSA- of andere sitebeoordeling | 2-1; CSF alle functies |

### Wat te doen in de eerste 30 dagen

1. Wijs de asset owner aan (meestal de fabrieksdirecteur) en de OT-beveiligingsverantwoordelijke.
2. Maak een lijst van elk extern toegangspad dat u kent en vraag elke machinebouwer hoe zij verbinding maken.
3. Controleer of u offline kopieën hebt van de huidige programma's van uw meest kritieke controllers.
4. Ga na of het kantoornetwerk en het productienetwerk zonder firewall met elkaar zijn verbonden.
5. Vraag NIST MEP of uw corporate securityteam om een op de CSF gebaseerde zelfbeoordeling [30].
6. Plan een tweeurige tabletop met het scenario "MES en ERP worden versleuteld".

Voor geen van deze stappen is nieuwe technologie nodig. Ze leveren de feiten op waarop het budget voor fase 2 wordt gebaseerd.

### Het stappenplan laten passen bij de praktijk van de fabriek

- **Gebruik geplande stilstanden.** Segmentatie- en firmwarewijzigingen hebben tijdvensters nodig; plan ze een jaar vooruit met onderhoud.
- **Haak aan bij kapitaalprojecten.** Een nieuwe lijn is het goedkoopste moment om een schone zone te bouwen met veilige externe toegang en benoemde accounts.
- **Begin niet met het hulpmiddel.** Een monitoringplatform kopen voordat de inventaris en het zonemodel er zijn, levert waarschuwingen op die niemand kan interpreteren.

## Budget en ROI: zo onderbouw je de businesscase

OT-beveiliging levert geen omzet op. Ze verkleint de kans op en de impact van een verlies. De businesscase bestaat daarom uit drie onderdelen: vermeden verwacht verlies, mogelijkmakende waarde en verplichtingen.

### Kostencategorieën

| Categorie | Typische posten | Capex of opex |
|---|---|---|
| Architectuur | Firewalls voor IDMZ en conduits, beheerde switches, IDMZ-servers, gateway voor externe toegang | Voornamelijk capex (hardware), opex voor abonnementen |
| Zichtbaarheid | OT-monitoringplatform, sensoren, network TAPs | Capex of abonnement |
| Personeel | OT-beveiligingsverantwoordelijke (deeltijds of voltijds), training, externe specialisten | Opex |
| Diensten | Ondersteuning bij risicobeoordeling, ontwerp van segmentatie, SOC of beheerde detectie | Opex |
| Vervanging | Upgrade van end-of-life HMI's en controllers | Capex, bij voorkeur binnen lijnherbouwen |
| Herstel | Back-upsystemen, reserve-engineeringwerkstations, reservecontrollers | Capex |

We geven hier geen generieke dollarbedragen, omdat er geen verifieerbare Amerikaanse bron is die een betrouwbare benchmark biedt voor een fabriek van een bepaalde omvang; prijzen hangen af van het aantal zones, de leeftijd van de apparatuur en de leveranciers. Vraag na fase 1 twee of drie afgebakende offertes op.

### Verwacht verlies: een uitgewerkt voorbeeld

Geannualiseerde verwachte verliezen (ALE, annualized loss expectancy) zijn een eenvoudige manier om risico te vertalen naar de taal van de financiële afdeling:

ALE = jaarlijkse frequentie van voorkomen (ARO) x verwacht verlies per incident (SLE)

Voor Midwest Components (sectie 9) schat de financiële afdeling en operations de kosten van een ransomware-incident dat de fabriek stilzet:

| Post | Aanname | Bedrag |
|---|---|---|
| Verloren bijdragemarge | 10 productiedagen x $160.000 bijdragemarge per dag | $1.600.000 |
| Overuren en versneld werk om de achterstand weg te werken | Schatting | $350.000 |
| Uitval en herbewerking door onderbroken batches | Schatting | $120.000 |
| Diensten voor incidentrespons en herstel | Schatting | $400.000 |
| Boetes van klanten | Contractvoorwaarden met twee OEM-klanten | $250.000 |
| **SLE (verwacht verlies per incident)** | | **$2.720.000** |

Zonder het programma schat het team de jaarlijkse kans op zo'n gebeurtenis op 10% (ARO 0,10); met de fasen 1 tot en met 3 afgerond, verwacht het dat de gebeurtenis zowel minder waarschijnlijk is (ARO 0,04, omdat segmentatie en gecontroleerde externe toegang de meest voorkomende paden afsluiten) als korter duurt (5 dagen in plaats van 10, omdat back-ups en draaiboeken getest zijn), wat de SLE verlaagt naar ongeveer $1.640.000 (5 dagen x $160.000 = $800.000, de helft van de overuren bij $175.000, ongewijzigde uitval van $120.000, responskosten van $300.000 en ongewijzigde boetes van $250.000, afgerond).

- ALE vooraf: 0,10 x $2.720.000 = $272.000 per jaar
- ALE daarna: 0,04 x $1.640.000 = $65.600 per jaar
- Risicoreductie: $272.000 - $65.600 = $206.400 per jaar

Als het programma $450.000 kost over twee jaar plus $120.000 per jaar aan lopende kosten, is de eenvoudige terugverdientijd op alleen de risicoreductie: ($450.000) / ($206.400 - $120.000) = ongeveer 5,2 jaar. Dat ziet er bescheiden uit, en het moet eerlijk worden gepresenteerd. De aannames zijn schattingen; met name de ARO is onzeker. Presenteer een bandbreedte (bijvoorbeeld ARO 0,05 tot 0,20) en laat het management zien hoe het resultaat verandert. Met ARO 0,20 vooraf en 0,06 daarna bedraagt de jaarlijkse reductie $544.000 - $98.400 = $445.600, en daalt de terugverdientijd tot ongeveer 1,4 jaar.

Alle cijfers in dit voorbeeld zijn illustratieve aannames, geen branchebenchmarks.

### Waarde buiten verliespreventie

- **Klant- en contracteisen:** CMMC voor defensieopdrachten [28][29], beveiligingsvragenlijsten van OEM-klanten, EU-verplichtingen voor EU-vestigingen en -producten [22][24].
- **Verzekering:** betere antwoorden over segmentatie, MFA en back-ups beïnvloeden de verzekerbaarheid en de voorwaarden [algemene richtlijn; vraag uw makelaar].
- **Mogelijk maken van digitale projecten:** een zuiver IDMZ- en conduitmodel maakt MES-, historian- en cloudprojecten sneller en veiliger goed te keuren. Zie [predictive maintenance en IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/) en [digital twin in de maakindustrie](https://www.m365.fm/en/learn/digital-twin-manufacturing/) voor de projecten die ervan afhangen.
- **Minder zelfveroorzaakte storingen:** assetinventaris, wijzigingsbeheer en getest back-upbeheer verkorten ook het herstel van gewone storingen, zoals een defecte harde schijf in een HMI.

### Capex en opex

Firewalls en servers worden doorgaans geactiveerd als kapitaaluitgave (capex); abonnementen, beheerde diensten en personeel zijn operationele uitgaven (opex). Het overstappen naar abonnementstools verschuift uitgaven van capex naar opex, wat van belang is voor fabrieken met een krap kapitaalbudget maar een flexibel exploitatiebudget. Bespreek vroeg met de fabrieksccontroller hoe het programma wordt geclassificeerd; dat bepaalt welke budgethouder moet goedkeuren.

## OT-beveiligingskpi's

Meet een paar indicatoren die gedrag sturen. Rapporteer ze maandelijks aan de stuurgroep en per kwartaal aan het management. Voor het ontwerpen van kpi's in het algemeen, zie de gids over [productie-kpi's](https://www.m365.fm/en/learn/manufacturing-kpis/).

| KPI | Formule | Voorbeelddoel | Waarom het ertoe doet |
|---|---|---|---|
| Inventarisdekking | Assets met volledige verplichte velden / assets gezien door monitoring x 100 | > 95% | Basis voor al het andere |
| Ongecontroleerde externe toegangspaden | Aantal externe paden niet via de gateway | 0 | Meest voorkomend toegangspad |
| Zones met goedgekeurd SL-T | Zones met ondertekende risicobeoordeling / totaal aantal zones x 100 | 100% | Toont aan dat de methode wordt toegepast |
| Hygiëne van conduitregels | Firewallregels met eigenaar, reden en geldige herzieningsdatum / alle regels x 100 | > 90% | Voorkomt wildgroei van regels |
| Kritieke controllers met getest herstel | Controllers met getest herstel in de afgelopen 12 maanden / kritieke controllers x 100 | 100% | Herstelgereedheid |
| Actualiteit van back-ups | Controllers waarvan de offline back-up overeenkomt met het draaiende programma / alle controllers x 100 | > 98% | Detecteert afwijkingen en ongeautoriseerde wijzigingen |
| Gemiddelde tijd tot besluit over advisories | Gemiddeld aantal dagen van publicatie van de advisory tot gedocumenteerd besluit | < 30 dagen | Toont aan dat het patchproces werkt |
| Vermindering gedeelde accounts | Systemen die nog gedeelde logins gebruiken / systemen in scope | Daalt elk kwartaal | Voortgang FR 1 en FR 2 |
| Triagetijd alarmen | Mediaan van de tijd van een hoogprioritair OT-alarm tot triage | < 1 uur | Detectie is bruikbaar |
| Tabletoefeningen | Oefeningen per jaar met productiepersoneel aanwezig | Minstens 1 | Respons wordt geoefend |
| Nieuwe apparatuur met beveiligingsclausules | Inkooporders voor automatisering met 62443-clausules / alle inkooporders voor automatisering x 100 | 100% | Voorkomt nieuwe hiaten |

**Voorbeeldberekening.** De monitoring ziet 640 assets; 598 hebben alle verplichte velden. Inventarisdekking = 598 / 640 x 100 = 93,4%. Het doel is met 1,6 punt gemist; actie: de 42 records aanvullen, vooral in het lasgebied.

Vermijd ijdelheidsmetrieken zoals "aantal geblokkeerde verbindingen". Een stijgend aantal kan betekenen dat de bescherming beter is, maar ook dat er meer misconfiguratie is.

## Veelvoorkomende fouten

1. **IT-beheersmaatregelen één-op-één overnemen.** Actief scannen, automatisch patchen en endpoint-agents op controllers hebben al storingen veroorzaakt. Test alles eerst met de leverancier.
2. **Beginnen met de aanschaf van een tool.** Zonder inventaris en zonemodel levert een monitoringplatform alleen ruis op.
3. **Eén grote zone.** Een firewall tussen kantoor en productie is noodzakelijk, maar een vlak productienetwerk achter die firewall laat malware bij elke lijn komen.
4. **Te veel zones.** Regels die niemand begrijpt worden "tijdelijk" open gezet en blijven zo.
5. **Remote-toegangsapparaten negeren.** De cellulaire router in een machinekast omzeilt de hele architectuur.
6. **Back-ups die nooit zijn teruggezet.** Veel fabrieken ontdekken tijdens een incident dat de back-up incompleet of verouderd is.
7. **Geen beslisbevoegdheid.** Bij een incident moet het antwoord op de vraag "wie mag de productie loskoppelen?" al vaststaan.
8. **Beveiliging zonder productie.** Maatregelen die zonder operators en onderhoudspersoneel zijn ontworpen, worden omzeild.
9. **62443 behandelen als een certificeringsproject.** De waarde zit in de methode en de doorlopende routine, niet in het papier.
10. **Helpdesk en identiteitsbeheer vergeten.** Clorox laat zien dat een proces voor het resetten van identiteiten de zwakste schakel kan zijn [20].
11. **Nieuwe hiaten kopen.** Elke machine die zonder beveiligingseisen wordt besteld, levert een legacy-probleem op voor de komende 20 jaar.
12. **Aannemen dat er sprake is van "air gap".** De meeste fabrieken die denken luchtgescheiden te zijn, hebben minstens één onbekende verbinding.

## Beperkingen van IEC 62443 en van OT-beveiligingsprogramma's

62443 is het beste beschikbare framework voor de beveiliging van industriële automatisering, maar het heeft beperkingen die u moet kennen voordat u er een programma op bouwt.

- **Kosten en toegang.** De documenten zijn betaalde publicaties, en Industrial Cyber becijfert de volledige reeks op meer dan 800 pagina's [34]. Kleine fabrieken lezen ze zelden volledig; snelstartgidsen en consultants vullen de leemte, met wisselende kwaliteit.
- **Ouderdom en herziening.** 3-3 dateert uit 2013, en de tweede edities van 3-2, 3-3 en 4-2 zijn nog in ontwikkeling [1][6]. Sommige onderwerpen (cloud, IIoT, gecontaineriseerde edge) worden alleen behandeld in nieuwere PAS-documenten zoals 1-6 [5].
- **Oordeel, geen formule.** De norm vertelt u om het SL-T op basis van risico vast te stellen, maar zegt niet precies welk SL een perslijn nodig heeft. Twee gekwalificeerde teams kunnen tot verschillende antwoorden komen.
- **Beveiligingsniveaus zijn geen garanties.** Een SL-C 3-component die slecht is geconfigureerd, levert SL-A 1 op. Certificering geldt voor specifieke versies en configuraties.
- **Legacy-werkelijkheid.** Veel geïnstalleerde systemen kunnen niet voldoen aan de SL 2-eisen voor FR 1 en FR 2. Compenserende maatregelen werken, maar voegen complexiteit toe.
- **Organisatorische eisen.** 2-1 en 2-4 vereisen gedocumenteerde processen; ML 2 en hoger is een echte inspanning voor een kleine fabriek en haar integrators.
- **Geen bescherming tegen alles.** Segmentatie en monitoring verminderen het risico; ze voorkomen niet dat een vastberaden, goed uitgeruste aanvaller binnendringt. Herstelvermogen blijft essentieel.
- **Overlap tussen frameworks.** Het in kaart brengen van 62443 ten opzichte van CSF 2.0, SP 800-82, CMMC en NIS2 kost veel inspanning. De conceptversie van SP 800-82 Rev. 4, herstructureerd rond CSF 2.0, zou de NIST-kant eenvoudiger moeten maken zodra die definitief is [10].

## Woordenlijst

| Term | Betekenis |
|---|---|
| ACSSA | ISASecure-certificeringsregeling voor productiesites, gebaseerd op 62443-2-1, 2-4, 3-2 en 3-3 [8] |
| ALE | Jaarlijkse verliesverwachting = ARO x SLE |
| Asset owner | Organisatie die verantwoordelijk en aansprakelijk is voor het IACS [2] |
| ATT&CK for ICS | MITRE-kennisbank met tactieken en technieken van aanvallers tegen industriële besturingssystemen [15] |
| Conduit | Logische groepering van communicatiekanalen tussen zones die dezelfde beveiligingseisen delen [2] |
| CPG | CISA Cybersecurity Performance Goals; versie 2.0 van december 2025 [13] |
| CRS | Cybersecurity-eisenspecificatie, uitvoer van 62443-3-2 |
| CSA / SSA / SDLA | ISASecure-certificeringen voor componenten (4-2), systemen (3-3) en ontwikkelingslevenscycli (4-1) [7] |
| CSF 2.0 | NIST Cybersecurity Framework 2.0 met zes functies [11] |
| CUI / FCI | Controlled Unclassified Information / Federal Contract Information (CMMC-scope) |
| DCS | Gedistribueerd besturingssysteem |
| Defense in depth | Meerdere beschermingslagen om een aanval te vertragen of te voorkomen [2] |
| Essential functions | Functies die nodig zijn voor gezondheid, veiligheid, milieu en beschikbaarheid van de bestuurde installatie [2] |
| FR | Fundamentele eis; zeven in 62443 (IAC, UC, SI, DC, RDF, TRE, RA) [2] |
| HMI | Mens-machine-interface |
| IACS | Industrieel automatiserings- en besturingssysteem |
| IDMZ | Industriële demilitarized zone tussen bedrijfsnetwerk en productie |
| IIoT | Industrieel internet der dingen |
| Maturity level (ML) | Maat voor procesvolwassenheid, ML 1 tot ML 4 in 62443 [3] |
| MOC | Wijzigingsbeheer |
| OT | Operationele technologie: systemen die interacteren met de fysieke omgeving [9] |
| PLC | Programmeerbare logische controller |
| Purdue model | Gelaagde referentiearchitectuur (niveaus 0 tot 5) die wordt gebruikt om productienetwerken in kaart te brengen |
| SBOM | Software-materiaallijst (software bill of materials) |
| SCADA | Supervisory control and data acquisition |
| SIS | Veiligheidsinstrumentatiesysteem |
| SL-T / SL-C / SL-A | Doel-, capaciteits- en gerealiseerd beveiligingsniveau [2] |
| SUC | Beschouwd systeem (62443-3-2) |
| Zone | Groepering van assets op basis van risico of andere criteria [2] |

## FAQ: OT-cybersecurity en IEC 62443

### Wat is OT-cybersecurity?

OT-cybersecurity beschermt de systemen die fysieke processen bewaken en besturen, zoals PLC's, SCADA, HMI's, robots en veiligheidssystemen, tegen verstoring en manipulatie. De prioriteiten zijn eerst veiligheid en beschikbaarheid, daarna integriteit en vertrouwelijkheid. NIST SP 800-82 Rev. 3 is de belangrijkste Amerikaanse gids [9].

### Wat is het verschil tussen IT- en OT-beveiliging?

IT-beveiliging beschermt gegevens en bedrijfssystemen, meestal met vertrouwelijkheid als eerste prioriteit. OT-beveiliging beschermt fysieke processen, waarbij een storing in een regeling mensen kan verwonden of de productie kan stilleggen. OT-systemen gaan langer mee, zijn moeilijker te patchen, gebruiken vaak protocollen zonder authenticatie en worden alleen in geplande onderhoudsvensters gewijzigd (paragraaf 2).

### Wat is ISA/IEC 62443?

Een reeks internationale normen voor de beveiliging van industriële automatiserings- en besturingssystemen, ontwikkeld door de ISA99-commissie en de IEC. Ze is ingedeeld in vier groepen (algemeen, beleid en procedures, systeem, component) en definieert rollen, zones en conduits, beveiligingsniveaus en fundamentele eisen [1][2].

### Wat is het verschil tussen OT-beveiliging en ICS-beveiliging?

In het dagelijks gebruik geen. ICS-beveiliging is de oudere term en verwijst naar industriële besturingssystemen zoals PLC, DCS en SCADA. OT-beveiliging is breder en omvat ook gebouwautomatisering, transport en systemen voor fysieke toegang, zoals NIST SP 800-82 Rev. 3 OT definieert [9]. IIoT-beveiliging is het deel dat gaat over verbonden sensoren en gateways die gegevens naar edge- of cloudplatforms sturen; IEC PAS 62443-1-6 past de 62443-reeks toe op IIoT [5].

### Wat zijn de rollen in IEC 62443?

De asset owner (verantwoordelijk voor het IACS), de integration service provider, de maintenance service provider en de product supplier [2]. Elke rol heeft zijn eigen delen van de reeks, wat het mogelijk maakt heldere contracten op te stellen (paragraaf 5).

### Is IEC 62443 in de VS verplicht?

Geen Amerikaanse wet schrijft 62443 in het algemeen voor. Het wordt bindend via klantcontracten, inkoopspecificaties, verzekeringsvoorwaarden of sectorregels. EU-wetgeving zoals de CRA creëert verplichtingen die processen op basis van 62443 helpen vervullen [22].

### Wat zijn de beveiligingsniveaus in IEC 62443?

SL 1 beschermt tegen toevallige of onbedoelde schending, SL 2 tegen opzettelijke schending met eenvoudige middelen, SL 3 tegen geavanceerde aanvallers met IACS-specifieke vaardigheden en gematigde middelen, en SL 4 tegen geavanceerde aanvallers met uitgebreide middelen en hoge motivatie [2]. Elke zone krijgt een doelniveau, vaak per fundamentele eis.

### Wat zijn de zeven fundamentele eisen van IEC 62443?

Beheer van identificatie en authenticatie, gebruiksbeheer, systeemintegriteit, vertrouwelijkheid van gegevens, beperkte gegevensstroom, tijdige reactie op gebeurtenissen en beschikbaarheid van middelen [2].

### Wat zijn zones en conduits?

Een zone groepeert assets met vergelijkbare beveiligingseisen; een conduit groepeert de communicatiekanalen tussen zones en bevat de beheersmaatregelen voor dat verkeer [2]. Sectie 9 toont een volledig voorbeeld voor een middelgrote fabriek.

### Met welk deel van IEC 62443 moet een asset owner beginnen?

Met 62443-2-1 voor het beveiligingsprogramma en 62443-3-2 voor de risicobeoordeling en het zonemodel. 3-3 definieert vervolgens de systeemeisen per beveiligingsniveau, en 2-4 en 4-1/4-2 gaan over contracten met integratoren en leveranciers [1].

### Hoe verhoudt IEC 62443 zich tot het NIST Cybersecurity Framework?

Ze vullen elkaar aan. CSF 2.0 biedt governance en een gemeenschappelijke taal voor het hele bedrijf [11]; 62443 biedt de technische en organisatorische methode voor de fabriek. NIST SP 800-82 verbindt beide, en het concept Rev. 4 is herstructureerd rond CSF 2.0 [10].

### Wat is het Purdue-model en is het nog relevant?

Een gelaagde referentiearchitectuur van veldapparaten (niveau 0) tot de onderneming (niveaus 4 en 5), vaak met een industriële DMZ op niveau 3.5. Het blijft een nuttige startkaart voor zones, maar IIoT- en cloudverbindingen doorkruisen zijn niveaus, dus zones moeten de werkelijke risico- en gegevensstromen volgen (sectie 7).

### Hoe past zero trust toe op OT?

Zero trust betekent geen impliciet vertrouwen op basis van netwerklocatie: elke gebruiker, elk apparaat en elke verbinding moet voor de specifieke toegang die nodig is, geautoriseerd zijn. In een fabriek sluit dat aan bij wat 62443 al vraagt: zones met expliciete, op een toegestane lijst gebaseerde conduits, individuele accounts in plaats van gedeelde logins, en gebrokerde, goedgekeurde externe toegangssessies (secties 7, 11, 12 en 14). Begin bij de conduits en bij beheerfuncties zoals engineering en leverancierstoegang, want veel veldprotocollen hebben geen ingebouwde authenticatie (sectie 2). Het concept van NIST SP 800-82 Rev. 4 voegt richtlijnen toe over zero-trustprincipes voor systeembeheerfuncties [10].

### Kun je verouderde PLC's patchen zonder de productie stil te leggen?

Vaak niet meteen, en dat hoeft ook niet. Controleer eerst of de kwetsbare functie wordt gebruikt en bereikbaar is. Als de firmwarefix een herstart of een functionele test vereist, pas dan nu compenserende maatregelen toe: beperk de conduit, schakel ongebruikte diensten uit, zoals een ongebruikte webserver, houd de sleutelschakelaar waar ondersteund in RUN en houd de asset nauwlettend in de gaten. Documenteer en keur het restrisico goed en installeer de fix tijdens de volgende geplande stilstand. Sectie 13 bevat een beslistabel en een uitgewerkt voorbeeld. Controllers waarvoor nooit een fix komt, horen in een vervangingsplan thuis, niet in een permanente uitzondering.

### Kun je gecertificeerd worden voor IEC 62443?

Ja. Producten kunnen gecertificeerd worden onder ISASecure CSA (4-2), systemen onder SSA (3-3), ontwikkelorganisaties onder SDLA (4-1) [7], en sinds juni 2025 operationele sites onder ISASecure ACSSA [8]. Andere conformiteitsbeoordelingsschema's certificeren ook tegen 62443, vooral het cybersecurityprogramma van de IEC, IECEE [37].

### Wat is het verschil tussen 62443-4-1 en 62443-4-2?

4-1 behandelt het veilige ontwikkelproces van de leverancier (hoe producten worden gebouwd), 4-2 de technische beveiligingsmogelijkheden van een component (wat het product kan) [1][7].

### Hoe lang duurt het om IEC 62443 in een fabriek te implementeren?

Voor één middelgrote locatie is een realistisch traject 12 tot 24 maanden voor de kern: inventarisatie, zonemodel, IDMZ, externe toegang, back-ups, monitoring en incidentrespons (sectie 20). Het programma loopt daarna door als een jaarlijkse routine. Deze schatting is gebaseerd op de roadmap in deze gids, niet op een gepubliceerde benchmark.

### Wat kost OT-beveiliging?

Dat hangt af van het aantal zones, de leeftijd van de apparatuur en de gekozen tools; we hebben geen betrouwbare openbare benchmark gevonden. Sectie 21 laat zien hoe je de businesscase opbouwt met annualized loss expectancy en geeft een uitgewerkt voorbeeld met aannames.

### Geldt CMMC voor OT-systemen?

CMMC is van toepassing op systemen die FCI of CUI verwerken, opslaan of verzenden. Machines die tekeningen of programma's met CUI-markering ontvangen, kunnen binnen de reikwijdte vallen; goede segmentatie houdt de beoordelingsgrens klein [28][29]. Op Level 2 telt OT die CUI kan verwerken maar niet volledig beveiligd kan worden als een "Specialized Asset": gedocumenteerd in de inventaris, SSP en netwerkdiagram, maar niet getoetst aan de overige eisen [38].

### Wat heeft de aanval op Colonial Pipeline fabrikanten geleerd?

Dat een IT-incident een OT-operatie kan stilleggen. Colonial stopte de pijplijnactiviteiten na een ransomware-aanval op of rond 7 mei 2021, betaalde ongeveer 75 bitcoin, en het Department of Justice heeft later 63,7 bitcoin in beslag genomen [16]. Het kennen van uw afhankelijkheden en het hebben van een gedegradeerde bedrijfsmodus zijn even belangrijk als het beschermen van controllers.

### Moeten Amerikaanse bedrijven met EU-fabrieken aan NIS2 voldoen?

Hun EU-entiteiten kunnen daartoe verplicht zijn, indien ze vallen onder de sectoren en de grootteschijven van de nationale implementatiewet. Duitsland past NIS2 bijvoorbeeld toe op genoteerde entiteitstypen met ten minste 50 werknemers of meer dan 10 miljoen euro zowel aan omzet als aan balanstotaal [25][40].

## Conclusie

OT-cyberbeveiliging is fabrieksengineering met een aanvaller in gedachten. ISA/IEC 62443 geeft fabrikanten een methode die bij de fabriek past: ken uw assets, verdeel de fabriek in zones met gecontroleerde conduits, stel doelbeveiligingsniveaus vast op basis van risico, sluit de kloof met technische en organisatorische maatregelen, en houd leveranciers en integrators aan dezelfde regels. NIST CSF 2.0 en SP 800-82 verbinden die methode met het Amerikaanse bestuur, en CMMC, SEC-regels, NIS2 en de CRA voegen verplichtingen toe waar ze van toepassing zijn.

De gedocumenteerde incidenten wijzen op dezelfde eerste stappen: scheid de fabriek van de onderneming via een industriële DMZ, beheers elk extern toegangspad, bewaar geteste offline back-ups van controllerlogica en servers, en oefen hoe de fabriek draait wanneer IT uitligt. Niets van dat vereist wachten op een perfecte architectuur of de volgende editie van de standaard. Begin met de lijst voor de eerste 30 dagen in sectie 20, bouw het zonemodel in het eerste jaar, en meet de voortgang met een handvol KPI's. Binnen twee jaar kan een middelgrote fabriek zich ontwikkelen van "we hopen dat we geïsoleerd zijn" naar een gedocumenteerd, getest en gestaag verbeterend beveiligingsprogramma.

## Verder lezen op m365.fm

**Gerelateerde gidsen**
- [Azure voor Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/): OT-beveiliging voor edge- en cloudarchitecturen, overgang naar Defender for IoT, CMMC en NIS2
- [MES en ISA-95](https://www.m365.fm/en/learn/mes-isa-95/): de functionele niveaus en datastromen die het zonemodel beschermt
- [Predictief onderhoud en IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/): sensor- en cloudverbindingen die eigen zones nodig hebben
- [Digitale tweeling in de productie](https://www.m365.fm/en/learn/digital-twin-manufacturing/): dataтoegang die afhankelijk is van schone verbindingen
- [Productieplanning in de luchtvaart](https://www.m365.fm/en/learn/aerospace-production-planning/): CMMC, ITAR en DFARS voor defensieleveranciersketens
- [Productie-KPI's](https://www.m365.fm/en/learn/manufacturing-kpis/): het ontwerpen van KPI-systemen
- [Shopfloormanagement en Gemba-wandelingen](https://www.m365.fm/en/learn/shop-floor-management/): dagelijkse routines waarin beveiligingsafwijkingen kunnen opduiken
- [TPM en OEE](https://www.m365.fm/en/learn/tpm-oee/): onderhoudsroutines waar back-ups en wijzigingsbeheer bij horen
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/): managementsystemen die programma's zoals dit programma in stand houden

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is de host van m365.fm en werkt bij iFAKT GmbH. Op m365.fm schrijft hij over lean manufacturing, operational excellence, productie-IT en de digitale transformatie van productie, inclusief hoe fabrieken productiesystemen veilig verbinden met enterprise- en cloudplatforms.

**Let op: de auteur werkt bij iFAKT GmbH.**

# Sources

All sources were opened and checked on November 20, 2026, unless noted otherwise.

1. ISA/IEC 62443 Series of Standards. International Society of Automation (ISA), catalog page with editions of all published parts. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
2. Quick Start Guide: An Overview of ISA/IEC 62443 Standards, Security of Industrial Automation and Control Systems. ISA Global Cybersecurity Alliance (ISAGCA), June 2020. https://gca.isa.org/hubfs/ISAGCA%20Quick%20Start%20Guide%20FINAL.pdf
3. IEC 62443. Wikipedia (secondary overview used for IEC edition dates, the SL 0 description and maturity level wording; checked against [1], [4], [5]). https://en.wikipedia.org/wiki/IEC_62443
4. IEC PAS 62443-2-2:2025, Security for industrial automation and control systems, Part 2-2: IACS security protection scheme. IEC webstore, published March 11, 2025. https://webstore.iec.ch/en/publication/63886
5. IEC PAS 62443-1-6:2025, Part 1-6: Application of the 62443 series to the Industrial Internet of Things (IIoT). IEC webstore, published December 19, 2025. https://webstore.iec.ch/en/publication/102885
6. Building a Resilient World: Status of the 62443 standards (second editions of 3-2, 3-3 and 4-2 in revision). ISA Global Cybersecurity Alliance blog (undated). https://gca.isa.org/blog/status-of-the-62443-standards
7. ISASecure (home page with the CSA, SSA, SDLA and ACSSA programs; "founded in 2007 and is a wholly owned subsidiary of ISA"). https://isasecure.org/
8. ISASecure Announces New IACS Security Assurance (ACSSA) Inspection and Certification Scheme. ISA press release, June 18, 2025. https://www.isa.org/news-press-releases/2025/june/isasecure-announces-new-iacs-security-assurance-ac
9. NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security. NIST CSRC, September 28, 2023. https://csrc.nist.gov/pubs/sp/800/82/r3/final
10. Guide to Operational Technology (OT) Security: NIST Requests Comments on Draft SP 800-82r4. NIST news, September 21, 2026 (comments through November 30, 2026). https://www.nist.gov/news-events/news/2026/09/guide-operational-technology-ot-security-nist-requests-comments-draft-sp
11. NIST Releases Version 2.0 of Landmark Cybersecurity Framework. NIST news release, February 26, 2024. https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework
12. NIST IR 8183 Rev. 2 (Initial Public Draft), Cybersecurity Framework 2.0 Manufacturing Profile. NIST CSRC, September 29, 2025. https://csrc.nist.gov/pubs/ir/8183/r2/ipd (re-fetched November 20, 2026: still the initial public draft; comments closed November 17, 2025; no later version listed)
13. Cybersecurity Performance Goals 2.0 for Critical Infrastructure. CISA bulletin, released December 10, 2025. https://content.govdelivery.com/accounts/USDHSCISA/bulletins/3ff7850
14. OT Security Guidance: NIST Drafts Updated Guide, CISA, FBI Advise on ICS Integrators. SecurityWeek, September 24, 2026 (secondary report on the CISA/FBI fact sheet for operators working with third-party ICS integrators). https://www.securityweek.com/ot-security-guidance-nist-drafts-updated-guide-cisa-fbi-advise-on-ics-integrators/
15. ICS Matrix. MITRE ATT&CK for ICS, content version 20.1. https://attack.mitre.org/matrices/ics/
16. Department of Justice Seizes $2.3 Million in Cryptocurrency Paid to the Ransomware Extortionists Darkside. US Department of Justice, press release, June 7, 2021. https://www.justice.gov/archives/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside
17. Cyber-attack on Hydro. Norsk Hydro (company page). https://hydro.com/en/media/on-the-agenda/cyber-attack
18. Merck, insurers settle NotPetya coverage case. Cybersecurity Dive, January 8, 2024. https://www.cybersecuritydive.com/news/merck-settlement-notpetya/703922/
19. Clorox files $380M suit against Cognizant over 2023 cyberattack. Cybersecurity Dive, July 23, 2025. https://www.cybersecuritydive.com/news/clorox-380-million-suit-cognizant-cyberattack/753837/
20. Clorox lawsuit against Cognizant (details of the August 11, 2023 help desk calls, $49 million remediation, 6% volume decline, $100 million insurance recoveries). The Record by Recorded Future, July 2025. https://therecord.media/clorox-cyberattack-lawsuit-cognizant-it-contractor
21. JLR Hack UK's Costliest Ever, Hitting Economy with £1.9bn Loss. Infosecurity Magazine, October 2025 (report on the Cyber Monitoring Centre assessment). https://www.infosecurity-magazine.com/news/jlr-hack-uk-costliest-ever-19bn/
22. Cyber Resilience Act: Reporting obligations. European Commission. https://digital-strategy.ec.europa.eu/en/policies/cra-reporting
23. Cyber Resilience Act. German Federal Office for Information Security (BSI), English page (all requirements apply from December 11, 2027; SBOM; support period generally five years). https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Cyber_Resilience_Act/cyber_resilience_act_node.html
24. Cybersicherheitsrecht: NIS-2-Umsetzungsgesetz ab morgen in Kraft (NIS2 implementation act in force tomorrow). BSI press release, December 5, 2025 (German). https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2025/251205_NIS-2-Umsetzungsgesetz_in_Kraft.html
25. Fragen und Antworten zu NIS-2 (NIS2 FAQ) and NIS-2-Meldepflicht (reporting obligation). BSI (German). https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-regulierte-Unternehmen/NIS-2-FAQ/NIS-2-FAQ-allgemein/FAQ-zu-NIS-2.html (re-fetched November 20, 2026; the FAQ refers to the size thresholds of § 28 BSIG without the figures, see [40])
26. SEC Adopts Rules on Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure by Public Companies. SEC press release 2023-139, July 26, 2023. https://www.sec.gov/newsroom/press-releases/2023-139 (re-fetched November 20, 2026)
27. CIRCIA final rule at the White House: deadlines set, scope open. Paubox, October 8, 2026 (secondary source on rulemaking status). https://www.paubox.com/blog/circia-final-rule-white-house-deadlines-set-scope-open (re-fetched November 20, 2026; 72 hours / 24 hours confirmed)
28. DoD Publishes Final CMMC Program Rule. Greenberg Traurig, October 2024 (summary of 32 CFR Part 170, effective December 16, 2024). https://www.gtlaw.com/en/insights/2024/10/dod-publishes-final-cmmc-program-rule (re-fetched November 20, 2026; article dated October 15, 2024)
29. The CMMC DFARS Final Rule Goes Live: Ready or Not, Here It Comes. Squire Patton Boggs, September 2025 (DFARS rule effective November 10, 2025, three-year phase-in). https://www.squirepattonboggs.com/en/insights/publications/2025/09/the-cmmc-dfars-final-rule-goes-live-ready-or-not-here-it-comes (verified for the sister guide)
30. Cybersecurity Services. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/cybersecurity-services (re-fetched November 20, 2026)
31. Retirement: OT security in Microsoft Defender for IoT. Azure Updates, ID 576255, November 2, 2026. https://azure.microsoft.com/updates?id=576255 (verified for the sister guide; the Azure page renders client-side and showed no content on November 20, 2026; the same notice AZ576255, published November 2, 2026, retirement October 2029, was re-read on the message-center mirror https://mc.merill.net/message/AZ576255)
32. Critical Manufacturing Sector. CISA. https://www.cisa.gov/critical-manufacturing-sector (re-fetched November 20, 2026; four core industries and DHS as SRMA confirmed; the page does not state the number of sectors)
33. Understanding ISA/IEC 62443: A Guide for OT Security Teams. Dragos blog (competitor page, used for the SERP analysis only; not cited in the article body). https://www.dragos.com/blog/isa-iec-62443-concepts
34. The Essential Guide to the IEC 62443 industrial cybersecurity standards. Industrial Cyber (secondary; source for the "more than 800 pages" figure). https://industrialcyber.co/features/the-essential-guide-to-the-iec-62443-industrial-cybersecurity-standards/
35. U.S. Retrieves Some Of The Colonial Pipeline Ransom. NPR, June 7, 2021 (refers to "last month's shutdown of Colonial Pipeline"). https://www.npr.org/2021/06/07/1004050873/u-s-retrieves-some-of-the-colonial-pipeline-ransom
36. Testimony of Joseph Blount, President and CEO, Colonial Pipeline Company, before the US Senate Committee on Homeland Security and Governmental Affairs, June 8, 2021. https://www.hsgac.senate.gov/imo/media/doc/Testimony-Blount-2021-06-08.pdf (accessed November 20, 2026)
37. Lin, S.: White paper: Comparing ISASecure, IECEE and proprietary ISA/IEC 62443 certification schemes. Automation.com (ISA), May 15, 2026 (white paper created by ISASecure; interested party). https://www.automation.com/article/white-paper-comparing-isasecure-iecee-proprietary-isa/iec-62443-certification-schemes (accessed November 20, 2026)
38. 32 CFR 170.19, CMMC scoping, paragraph (c)(1), Table 3 (Specialized Assets). Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/32/170.19 (accessed November 20, 2026)
39. DiMolfetta, D.: CISA updates cyber reporting form as broader incident mandate awaits approval. Nextgov/FCW, November 9, 2026. https://www.nextgov.com/cybersecurity/2026/11/cisa-updates-cyber-reporting-form-broader-incident-mandate-awaits-approval/417130/ (accessed November 20, 2026)
40. § 28 BSIG (BSI Act 2025), paragraph 2 no. 3: important entities with at least 50 employees or annual turnover and balance sheet total each above EUR 10 million. Gesetze im Internet, Federal Ministry of Justice (German). https://www.gesetze-im-internet.de/bsig_2025/__28.html (accessed November 20, 2026)
