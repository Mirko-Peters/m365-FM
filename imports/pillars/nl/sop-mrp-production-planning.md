# SEO metadata

| Field | Value |
|---|---|
| Meta title | Gids voor Verkoop- en operationeel planning (S&OP), MPS en MRP |
| Meta description | Verkoop- en operationele planning, MPS en MRP uitgelegd: de maandelijkse S&OP-cyclus, MRP-netting stap voor stap, DDMRP, ERP-opties, KPI's en sjablonen. |
| Slug | `sop-mrp-production-planning` |

# Verkoop- en operationeel planning (S&OP) en MRP: hoe productieplanning werkt van plan tot onderdelen

> **Kort antwoord:** Sales and operations planning (S&OP) is een maandelijks managementproces waarin sales, operations, supply chain en finance één plan afstemmen voor vraag, aanbod en voorraad per productfamilie, doorgaans op een rollende horizon van 18 tot 36 maanden [5][6]; academische bronnen beschrijven de tactische kern als reikend tot ongeveer 18 maanden [1]. Het master production schedule (MPS) vertaalt dat plan naar eindproductaantallen per week, en material requirements planning (MRP) explodeert de MPS via de stuklijsten tot gedateerde orders voor elk onderdeel en elke grondstof [7][13]. In de meeste fabrieken draaien de MPS en MRP binnen het ERP-systeem; S&OP draait in een vergadercyclus, ondersteund door spreadsheets, ERP of speciale planningssoftware.

> **Belangrijkste punten**
> - S&OP beslist *hoeveel* per productfamilie en maand; de MPS beslist *welke eindproducten* per week; MRP beslist *welke onderdelen, hoeveel en wanneer*. Gedetailleerde planning (volgorde per machine en uur) komt daaronder en wordt behandeld in de [gids over productieplanning en APS](https://www.m365.fm/en/learn/production-scheduling-aps/).
> - Het S&OP-concept gaat terug tot aggregate production planning in de jaren vijftig; Oliver Wight-consultants vormden de moderne S&OP in de jaren tachtig en bedachten het begrip integrated business planning (IBP) aan het begin van de jaren 2000 [1][2].
> - Joseph Orlicky formaliseerde MRP in 1964; Black & Decker was de eerste gebruiker, en in 1981 gebruikten ongeveer 8.000 bedrijven MRP [3][4]. Oliver Wight breidde het uit tot MRP II in 1983 [3].
> - Een typische maandelijkse S&OP-cyclus kent vijf stappen: gegevensverzameling, vraagreview, aanbodreview, pre-S&OP (afstemmings)vergadering en executive S&OP-vergadering [1].
> - MRP gaat uit van oneindige capaciteit en vaste doorlooptijden; daarom heeft het een grove capaciteitscontrole erboven en een eindige planner eronder nodig [8][9].
> - Een kleine wijziging in de MPS kan orders op meerdere stuklijstniveaus tegelijk verschuiven ("nervousness"). Het bevriezen van de kortetermijnplanning en regels voor wijzigingskosten dempen dit beter dan extra veiligheidsvoorraad [10].
> - DDMRP vervangt de op prognoses gebaseerde explosie op geselecteerde ontkoppelpunten door gedimensioneerde buffers (rood, geel, groen) en een netto-stroomvergelijking [11][12].
> - Meet S&OP met prognosenauwkeurigheid (WMAPE) *en* bias, planrealisatie, schedulestabiliteit en serviceniveau. Een prognose die voor 94% nauwkeurig is maar altijd 2% te hoog zit, bouwt nog steeds voorraad op.

## Inhoudsopgave

1. [Wat is sales and operations planning? Definitie en reikwijdte](#wat-is-sales-and-operations-planning-definitie-en-reikwijdte)
2. [De productieplanningshiërarchie: S&OP, MPS, RCCP, MRP en scheduling](#de-productieplanningshiërarchie-sop-mps-rccp-mrp-en-scheduling)
3. [Geschiedenis: van aggregate planning en Orlicky tot IBP en DDMRP](#geschiedenis-van-aggregate-planning-en-orlicky-tot-ibp-en-ddmrp)
4. [Het S&OP-proces: de maandelijkse cyclus stap voor stap](#het-sop-proces-de-maandelijkse-cyclus-stap-voor-stap)
5. [Aanbodstrategieën: level, chase of hybride (uitgewerkt voorbeeld)](#leveringsstrategieën-vlak-chase-of-hybride-uitgewerkt-voorbeeld)
6. [S&OP vs. IBP vs. S&OE](#sop-vs-ibp-vs-soe)
7. [S&OP-volwassenheidsmodellen](#sop-volwassenheidsmodellen)
8. [Master production schedule (MPS) en available to promise (ATP)](#hoofdproductieplanning-mps-en-available-to-promise-atp)
9. [Rough-cut capacity planning (RCCP)](#rough-cut-capacity-planning-rccp)
10. [Material requirements planning (MRP): hoe de berekening werkt](#materials-requirements-planning-mrp-hoe-de-berekening-werkt)
11. [MRP II, CRP en de closed loop](#mrp-ii-crp-en-de-gesloten-lus)
12. [MRP-nervositeit: waarom plannen springen en hoe je ze kalmeert](#mrp-nervositeit-waarom-plannen-springen-en-hoe-je-ze-kalmeert)
13. [Demand driven MRP (DDMRP)](#vraaggestuurde-mrp-ddmrp)
14. [Productieplanning in ERP: wat de systemen doen en waar ze stoppen](#productieplanning-in-erp-wat-de-systemen-doen-en-waar-ze-ophouden)
15. [Sjablonen: S&OP-kalender, agenda's, familieplan, MPS- en MRP-records](#sjablonen-sop-kalender-agendas-gezinsplan-mps--en-mrp-records)
16. [S&OP- en MRP-KPI's met uitgewerkte voorbeelden](#sop--en-mrp-kpis-met-uitgewerkte-voorbeelden)
17. [Implementatieroadmap: 12 maanden naar een werkende S&OP en MRP](#implementatiestappenplan-12-maanden-naar-een-werkend-sop-en-mrp)
18. [Veelgemaakte fouten](#veelvoorkomende-fouten)
19. [Beperkingen van S&OP en MRP](#beperkingen-van-sop-en-mrp)
20. [AI en digitale planning: wat vandaag werkt](#ai-en-digitale-planning-wat-vandaag-werkt)
21. [Verklarende woordenlijst](#woordenlijst)
22. [Veelgestelde vragen: sales and operations planning en MRP](#faq-verkoop--en-operationsplanning-en-mrp)
23. [Conclusie en eerste stappen](#conclusie-en-eerste-stappen)

## Wat is sales and operations planning? Definitie en reikwijdte

**Sales and operations planning (S&OP)** is een terugkerend besluitvormingsproces dat de vraagvoorspelling integreert met de aanbodplanning tot één plan waarop verkoop, marketing, operations, supply chain en financiën allemaal werken [1]. De academische literatuur beschrijft het als een tactisch proces met een horizon van ongeveer 18 maanden, meestal maandelijks uitgevoerd of getriggerd door gebeurtenissen [1]. Leveranciers- en praktijkbronnen spreken vaak van een rollende horizon van 18 tot 36 maanden [5][6]. Het verschil is geen tegenspraak: de eerste maanden worden in meer detail gepland, de verdere maanden alleen op familieniveau en in capaciteitsblokken.

Drie kenmerken onderscheiden S&OP van een verkoopvoorspellingsoverleg of een productieoverleg:

- **Eén set cijfers.** Vraag, aanbod, voorraad of achterstand en de financiële waarde van het plan worden samen beoordeeld, per productfamilie, in eenheden en in dollars.
- **Besluiten, geen rapporten.** De uitkomst is een set besluiten: een capaciteitsuitbreiding goedkeuren, een lager serviceniveau voor een traag lopende familie accepteren, een lancering uitstellen, vooraf produceren voor een stilstand.
- **Integratie in plaats van coördinatie.** Rogelio Oliva en Noel Watson toonden in een casestudy aan dat S&OP waarde toevoegt wanneer functies *samen plannen tegen gedeelde doelen*, en niet wanneer ze alleen plannen die elke functie afzonderlijk maakte, op elkaar afstemmen [21].

De professionele kennisbasis voor S&OP, master scheduling en MRP in de VS wordt onderhouden door ASCM (Association for Supply Chain Management, voorheen APICS). Het CPIM-programma (Certified in Planning and Inventory Management) behandelt S&OP, vraag, aanbod, voorraad en gedetailleerde schema's als afzonderlijke modules [24].

### Plannen, niet inplannen

S&OP is niet het productieschema. Het werkt met productfamilies, maandelijkse periodes en geaggregeerde capaciteit, zoals "lashuren" of "shifts op lijn 2." De vraag "welke order draait morgen als eerste op machine 14" hoort bij gedetailleerde planning, die de [gids over productieplanning en APS](https://www.m365.fm/en/learn/production-scheduling-aps/) uitgebreid behandelt, inclusief eindige capaciteitsplanning en drum-buffer-rope. Dit artikel blijft een niveau hoger en verbindt S&OP met de master production schedule en MRP.

### Waarvoor S&OP wordt gebruikt

De tabel toont typische beslissingen die alleen een cross-functionele S&OP kan nemen, omdat geen enkele afdeling zowel de kosten als het voordeel beheert.

| Beslissing | Wie profiteert | Wie betaalt | Waarom S&OP nodig is |
|---|---|---|---|
| Een tweede ploeg in het lassen toevoegen vanaf maart | Verkoop (serviceniveau) | Operations (arbeidskosten), HR (aanwerving) | afweging tussen omzet en kosten |
| 2.000 eenheden vooraf produceren vóór een zomerstilstand | Klanten, verkoop | Finance (werkkapitaal), magazijn | investering in voorraad moet worden goedgekeurd |
| Een variant met lage marge schrappen | Operations (minder omstellingen) | Verkoop (gederfde omzet) | portfoliobeslissing met margeimpact |
| Een grote promotieorder accepteren | Verkoop, marketing | Operations (overwerk), inkoop | haalbaarheid qua capaciteit en materiaal |
| Een tweede leverancier kwalificeren voor een kritiek onderdeel | Supply chain (risico) | Inkoop, kwaliteit (kwalificatiekosten) | veerkracht versus stukkosten, zie [supply chain resilience](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/) |

### Wie neemt deel

De managementvergadering wordt voorgezeten door de algemeen directeur of de president van de business unit. Vaste leden zijn meestal de hoofden van verkoop, marketing, operations, supply chain, finance en, bij engineered products, engineering of productmanagement. Onder de managementvergadering doen de demand planner, de master scheduler, de supply planner en een financiële analist het meeste werk. Sectie 4 beschrijft de rollen stap voor stap.

## De productieplanningshiërarchie: S&OP, MPS, RCCP, MRP en scheduling

Manufacturing planning and control (MPC) is georganiseerd als een hiërarchie. Elk niveau werkt met een langere horizon en grovere gegevens dan het niveau eronder en geeft zijn beslissingen als doelstellingen naar beneden door. Het collegemateriaal van Stanley Gershwin aan het MIT vat MRP II zo samen: een hiërarchie van lange-, middellange- en kortetermijnplanning, met vraagbeheer, prognoses, capaciteitsplanning en shopfloorcontrole rond de MRP-kern [8].

| Niveau | Typische horizon | Periode | Planningsobject | Kernvraag | Output | Typisch hulpmiddel |
|---|---|---|---|---|---|---|
| Strategisch en bedrijfsplan | 3–5 jaar | jaar | bedrijf, fabriek, netwerk | Welke markten, fabrieken en capaciteitsinvesteringen? | budget, investeringsplan | financiële tools, Excel |
| S&OP / IBP | 18–36 maanden [5][6] | maand | productfamilie, geaggregeerde resource | Hoeveel verkopen en maken we, tegen welke voorraad en kosten? | goedgekeurd familieplan | S&OP-software, ERP, Excel |
| Master production schedule (MPS) | enkele weken tot meerdere maanden, minimaal de cumulatieve doorlooptijd | week (dag op korte termijn) | eindproduct of planningsitem | Welke eindproducten, hoeveel, in welke week? | MPS, ATP | ERP |
| Rough-cut capacity planning (RCCP) | zelfde als MPS | week of maand | kritieke resources | Is de MPS haalbaar op het knelpunt? | belasting versus capaciteit per kritieke resource | ERP, Excel |
| Material requirements planning (MRP) | zelfde als MPS | dag of week | elk onderdeel en materiaal | Welke onderdelen, hoeveel, wanneer bestellen of starten? | geplande orders, inkoopaanvragen, uitzonderingsmeldingen | ERP |
| Capacity requirements planning (CRP) | weken | dag of week | elk werkcentrum | Is er genoeg capaciteit voor alle geplande en vrijgegeven orders? | gedetailleerde belastingprofielen | ERP |
| Gedetailleerde scheduling en dispatching | uren tot enkele weken | uur, ploeg | bewerking op een machine | In welke volgorde loopt elke bewerking? | planning, dispatchlijst | APS, MES |

Twee regels houden de hiërarchie bij elkaar:

1. **Desaggregatie moet optellen.** De som van de MPS voor alle eindproducten in een familie moet voor dezelfde maand overeenkomen met het S&OP-familieplan, binnen een afgesproken tolerantie (bijvoorbeeld plus of min 5%). Anders heeft de S&OP-beslissing geen effect op de vloer.
2. **Haalbaarheid wordt op elk niveau getoetst.** S&OP toetst de geaggregeerde capaciteit (resourceplanning), de MPS wordt getoetst met rough-cut capacity planning, en de output van MRP wordt getoetst met capacity requirements planning of met een finite scheduler. MRP zelf toetst de capaciteit niet [8][9].

### Waar ERP, APS en MES zich bevinden

ANSI/ISA-95 scheidt bedrijfsplanning en logistiek (niveau 4, meestal ERP) van de aansturing van de productieprocessen (niveau 3, meestal MES en gedetailleerde scheduling) [25]. S&OP, MPS en MRP zijn functies van niveau 4. De [MES- en ISA-95-gids](https://www.m365.fm/en/learn/mes-isa-95/) legt de kant van niveau 3 uit, en de [Azure for manufacturing-gids](https://www.m365.fm/en/learn/manufacturing-it-azure/) laat zien hoe de gegevens tussen de niveaus geïntegreerd kunnen worden.

### Make-to-stock, assemble-to-order, make-to-order

De productieomgeving bepaalt waar de MPS in de stuklijst zit:

| Omgeving | Klant wacht op | MPS gepland op | Voorbeeld | Focus S&OP |
|---|---|---|---|---|
| Make-to-stock (MTS) | niets (levering uit voorraad) | eindproduct | consumentengoederen, standaardpompen | voorraaddoel per productfamilie |
| Assemble-to-order (ATO) | eindassemblage | modules en opties (planningsstuklijst) | configureerbare bureaus, vrachtwagens, pc's | modulemix, optiepercentages |
| Make-to-order (MTO) | productie | eindproduct of belangrijke subassemblages na order | op maat gemaakte machineonderdelen | backlogdoel, levertijd |
| Engineer-to-order (ETO) | ontwerp en productie | projectmijlpalen, items met lange levertijd | speciale machines, vliegtuiginterieurs | engineering- en testcapaciteit, zie [productieplanning voor de luchtvaart](https://www.m365.fm/en/learn/aerospace-production-planning/) |

Bij MTS balanceert S&OP de vraag tegen een doelvoorraad. Bij MTO en ETO balanceert S&OP de vraag tegen een doelbacklog of een opgegeven levertijd. Het mengen van deze logica's binnen één productfamilie is een veelvoorkomende oorzaak van verwarrende S&OP-cijfers.

## Geschiedenis: van aggregate planning en Orlicky tot IBP en DDMRP

### Aggregate planning en de eerste MRP-systemen (jaren 50–60)

S&OP begon in de vroege jaren vijftig als aggregate production planning: een geaggregeerde productiesnelheid afstemmen op de vraagprognose door een afweging te maken tussen voorraad, personeelswijzigingen en overwerk [1]. Ongeveer tegelijkertijd computeriseerden de vliegtuigmotorfabrikanten Rolls-Royce en General Electric hun materiaalplanning [3].

In 1964 formaliseerde Joseph Orlicky, ingenieur bij IBM, material requirements planning [4]. Het eerste bedrijf dat het implementeerde was Black & Decker in 1964, met Dick Alban als projectleider [3]. Orlicky's boek *Material Requirements Planning* (McGraw-Hill, 1975) werd de standaardtekst [13]. De derde editie, een update uit 2011 door Carol Ptak en Chad Smith, introduceerde demand driven MRP (DDMRP) [4].

De adoptie groeide snel: volgens cijfers die op Wikipedia worden geciteerd, draaiden in 1975 ongeveer 700 bedrijven MRP en in 1981 ongeveer 8.000 [3]. In 1967 schreven George Plossl en Oliver Wight, een IBM-collega van Orlicky, samen een boek over productie- en voorraadbeheer [4].

### MRP II, ERP en S&OP (jaren 80–90)

In 1983 breidde Oliver Wight MRP uit tot **manufacturing resource planning (MRP II)** door masterscheduling, rough-cut capaciteitsplanning, capaciteitsbehoefteplanning, S&OP en de koppeling met financiële planning toe te voegen [3]. Het bedrijf van Oliver Wight beschrijft S&OP als ontwikkeld door Oliver Wight in de jaren tachtig [2]; Wikipedia schrijft de term en de moderne betekenis toe aan Richard (Dick) Ling, toen consultant bij Oliver Wight [1]. Gartner bedacht in 1990 de term "enterprise resource planning" (ERP) [4]. ERP integreerde financiën, verkoop, inkoop en HR rond een planningskern die MRP II bleef.

### IBP, DDMRP en gelijktijdige planning (jaren 2000 tot nu)

In het begin van de jaren 2000 bedacht Oliver Wight de term **integrated business planning (IBP)**, die S&OP uitbreidt naar de hele onderneming, inclusief portfolio- en financiële planning, met een horizon van minimaal 24 maanden [2]. In 2011 publiceerden Ptak en Smith de derde editie van Orlicky's boek met **demand driven MRP (DDMRP)** [4], en ERP-leveranciers zoals Microsoft hebben DDMRP sindsdien in hun planningsengines ingebouwd [11]. Leveranciers van planningssoftware promoten nu "gelijktijdige" of continue planning, die plannen in minuten herberekent in plaats van in een maandelijkse batch [16]; die bewering is een leveranciersclaim en wordt besproken in de AI-sectie.

| Jaar | Mijlpaal | Bron |
|---|---|---|
| begin jaren 50 | aggregate production planning; Rolls-Royce en GE computeriseren materiaalplanning | [1][3] |
| 1964 | Orlicky formaliseert MRP bij IBM; Black & Decker is de eerste gebruiker | [3][4] |
| 1967 | Plossl en Wight publiceren over productie- en voorraadbeheer | [4] |
| 1975 | Orlicky's *Material Requirements Planning*; ongeveer 700 MRP-gebruikers | [3][13] |
| 1981 | ongeveer 8.000 MRP-gebruikers | [3] |
| 1983 | Oliver Wight definieert MRP II | [3] |
| jaren 80 | S&OP ontwikkeld door Oliver Wight (Dick Ling) | [1][2] |
| 1990 | Gartner bedenkt "ERP" | [4] |
| begin jaren 2000 | Oliver Wight bedenkt IBP | [2] |
| 2011 | derde editie van Orlicky's boek door Ptak en Smith introduceert DDMRP | [4] |

## Het S&OP-proces: de maandelijkse cyclus stap voor stap

De meest geciteerde academische beschrijving van het S&OP-proces kent vijf stappen: gegevensverzameling, vraagplanning, aanbodplanning, voorbespreking en directievergadering [1][20]. Sommige auteurs voegen aan het begin een evenement- of productreview toe en aan het eind een herzieningsstap [1]; Anaplan, een leverancier van planningssoftware, beschrijft zes reviews: product, vraag, aanbod, financiën, pre-S&OP en executive S&OP [15]. Kinaxis beschrijft een traditionele maandelijkse cyclus met vijf fasen [16]. De verschillen zijn vooral een kwestie van benamingen: de cycli bestrijken hetzelfde terrein in ongeveer dezelfde volgorde.

De volgende planning gaat ervan uit dat de maand sluit op de laatste werkdag en dat de directievergadering in de derde week plaatsvindt.

| Werkdag | Stap | Eigenaar | Input | Output | Duur vergadering |
|---|---|---|---|---|---|
| 1–3 | 1. Gegevensverzameling en portfolio-update | vraagplanner, productmanagement | werkelijke cijfers van vorige maand (verzendingen, orders, productie, voorraad), nieuwe producten en uitfasedata | bijgewerkte historie, KPI-pakket, productwijzigingen | geen (bureauwerk) |
| 4–6 | 2. Vraagreview | VP verkoop of marketing; vraagplanner bereidt voor | statistische prognose, verkoopinput, marketingevenementen, plannen van belangrijke klanten | niet-beperkt consensusvraagplan per productfamilie, in stuks en dollars, met aannames en risico's | 60–90 minuten |
| 7–9 | 3. Aanbodreview | VP operations of supply chain; master scheduler en supply planner bereiden voor | consensusvraag, voorraad- of backlogdoelen, capaciteit per kritieke resource, leveranciersbeperkingen | beperkt aanbodplan, capaciteitsproblemen en opties met kosten | 60–90 minuten |
| 10–12 | 4. Pre-S&OP (afstemmings)vergadering | S&OP-proceseigenaar; financieel analist | vraag- en aanbodplannen, gaten, financieel plan | afgestemd plan in stuks en dollars, besluiten voorbereid met opties, openstaande punten | 90–120 minuten |
| 13–15 | 5. Executive S&OP-vergadering | algemeen directeur | aanbevelingen uit de pre-S&OP, KPI's | goedgekeurd plan, besluiten, escalaties afgesloten | 60–120 minuten |
| 16–20 | Uitrol | master scheduler, planners | goedgekeurd familieplan | MPS bijgewerkt, MRP gedraaid, inkoop- en capaciteitsacties | geen |

### Stap 1: Gegevensverzameling en portfolio-update

De cyclus begint zodra de maand is afgesloten. De vraagplanner haalt verzendingen, binnenkomende orders, productie, voorraad en backlog op per familie en SKU, zuivert de historie van eenmalige gebeurtenissen (een brand bij een klant, een eenmalige aanbesteding) en draait de statistische prognose. Productmanagement actualiseert de lanceer- en uitfasedata. Een prognose die niet weet dat een variant in maand 4 wordt uitgefaseerd, blijft de onderdelen ervoor bestellen.

**Checklist, stap 1**

| Onderdeel | Klaar wanneer |
|---|---|
| Werkelijke cijfers geladen | verzendingen, orders, productie en voorraad sluiten aan op de maandafsluiting van financiën binnen de afgesproken marge |
| Historie gezuiverd | uitschieters gemarkeerd met reden, niet verwijderd |
| Statistische prognose gedraaid | model en parameters per familie gedocumenteerd |
| Portfoliowijzigingen | lanceringen, uitfaseringen, engineeringwijzigingen met data en eigenaren |
| KPI-pakket | prognosenauwkeurigheid en bias, planrealisatie, service, voorraad vs. doel |

### Stap 2: Vraagreview

De vraagreview levert het **niet-beperkte consensusvraagplan** op: wat klanten zullen willen als het aanbod onbeperkt zou zijn. Verkoop en marketing passen de statistische prognose aan met informatie die de historie niet bevat: prijswijzigingen, promoties, een verloren klant, een nieuwe distributeur. Elke aanpassing wordt vastgelegd met eigenaar en aanname. Die registratie laat later zien of handmatige aanpassingen de nauwkeurigheid hebben verbeterd of verslechterd.

Typische fouten in deze stap zijn prognosticeren alleen in omzet (operations kan geen dollars bouwen), prognosticeren op SKU-niveau voor 24 maanden (te veel ruis) en de verkoopdoelstelling verwarren met de prognose. Een doel is wat het bedrijf wil; een prognose is wat het verwacht. Het verschil tussen beide is een bedrijfskwestie voor de directievergadering, geen getal om in de prognose te verbergen.

**Agenda vraagreview (60–90 minuten)**

| Tijd | Onderwerp | Leiding |
|---|---|---|
| 10 min | vorige maand: prognosenauwkeurigheid en bias per familie, grootste missers met hoofdoorzaak | vraagplanner |
| 20 min | statistische basis vs. vorige consensus, wijzigingen boven drempelwaarde | vraagplanner |
| 30 min | verkoop- en marketinginput per familie: evenementen, klanten, prijzen | verkoop, marketing |
| 15 min | risico's en kansen met kans en hoeveelheid | VP verkoop |
| 5 min | consensus per familie, openstaande punten, eigenaren | vraagplanner |

### Stap 3: Aanbodbeoordeling

De aanbodbeoordeling toetst de consensusvraag aan capaciteit, materialen en voorraaddoelen. Planners vertalen volumes per productfamilie naar belasting van **sleutelresources** (knelpuntwerkplekken, kritieke leveranciers, groepen geschoolde arbeid) met behulp van een resourcestuklijst: uren per eenheid per resource. Waar de belasting de capaciteit overschrijdt, ontwikkelen zij opties met kosten: overwerk, een extra ploeg, uitbesteding, vooraf produceren, een latere leverdatum of het accepteren van een lager serviceniveau. De aanbodbeoordeling beslist niet tussen opties met aanzienlijke financiële impact; zij bereidt die voor op de pre-S&OP-vergadering. Sectie 5 laat zien hoe zulke opties worden vergeleken.

**Agenda aanbodbeoordeling (60–90 minuten)**

| Tijd | Onderwerp | Verantwoordelijke |
|---|---|---|
| 10 min | vorige maand: plananttainment, MPS-naleving, leveranciersprestaties | masterplanner |
| 25 min | belasting vs. capaciteit per sleutelresource en maand (rough-cut) | aanbodplanner |
| 20 min | projectie voorraad en achterstand vs. doelen per familie | masterplanner |
| 20 min | beperkingen en opties met kosten en risico | VP Operations |
| 5 min | beperkt aanbodplan, vraagstukken voor pre-S&OP | masterplanner |

### Stap 4: Pre-S&OP (afstemmings)vergadering

De pre-S&OP-vergadering brengt vraag, aanbod en financiën samen. Financiën waardeert het beperkte plan tegen standaardkosten en verkoopprijs en vergelijkt dit met het budget of de laatste financiële prognose. Het team lost op wat binnen de afgesproken beslissingsbevoegdheid valt en bereidt de rest voor als besluitnota's: twee of drie opties, elk met de impact op volume, service, kosten en werkkapitaal, en een aanbeveling. Een goede besluitnota past op één pagina.

### Stap 5: Executive S&OP-vergadering

De executive vergadering beoordeelt KPI's, keurt het plan goed en neemt de voorbereide beslissingen. Het is niet de plek om cijfers opnieuw uit te werken. Een typische agenda:

| Tijd | Onderwerp |
|---|---|
| 10 min | KPI-review: service, prognosenauwkeurigheid en bias, voorraad en achterstand vs. doel, plananttainment |
| 15 min | bedrijfsoverzicht per familie: vraagplan vs. budget, aanbodplan vs. vraag |
| 45 min | beslissingen: één besluitnota tegelijk, opties, aanbeveling, beslissing vastgelegd |
| 10 min | risico's voor de komende 3–6 maanden, status nieuwe producten |
| 10 min | review van het beslissingslogboek, eigenaren en data |

### Uitrol: van het goedgekeurde plan naar de MPS

Binnen enkele dagen na de executive vergadering splitst de masterplanner het goedgekeurde familieplan op in de MPS per eindproduct en week (Sectie 8), controleert dit met rough-cut capaciteitsplanning (Sectie 9) en draait MRP (Sectie 10). Inkoop ontvangt nieuwe of gewijzigde geplande orders, en capaciteitsbeslissingen (een tweede ploeg, overwerk) worden vrijgegeven via HR en de fabriek. Zonder deze uitrol wordt S&OP een maandelijkse presentatie zonder effect op de vloer.

### Rollen en beslissingsbevoegdheid

| Rol | Verantwoordelijkheden |
|---|---|
| Executive sponsor (directeur of president) | voorzit de executive vergadering, is eigenaar van de eindbeslissingen, borgt aanwezigheid en beslissingsdiscipline |
| Eigenaar S&OP-proces | beheert de kalender, bereidt de pre-S&OP voor, onderhoudt het beslissings- en aannamelogboek |
| Vraagplanner | statistische prognose, consensusproces, prognose-KPI's |
| Sales- en marketingleiders | marktinformatie, eigenaarschap van het consensusvraagcijfer |
| Masterplanner | MPS, ATP-regels, rough-cut capaciteit, uitsplitsing |
| Aanbod- en materiaalplanners | MRP-uitzonderingen, leveranciercapaciteit, inkooporders |
| Fabrieks- of operationeel manager | capaciteitsplan, arbeid, beslissingen over overwerk en ploegen |
| Financiële partner | waardering in dollars, afstemming met budget, werkkapitaal |
| Productmanagement of engineering | lanceringen, uitfasering, engineeringwijzigingen |

Beslissingsbevoegdheden moeten schriftelijk vastgelegd zijn. Voorbeeld: de aanbodbeoordeling mag overwerk goedkeuren tot 10% van de capaciteit van een werkplek; alles daarboven, en elke wijziging van voorraaddoelen, gaat naar de executive vergadering.

## Leveringsstrategieën: vlak, chase of hybride (uitgewerkt voorbeeld)

Aggregatieve planning kent drie klassieke leveringsstrategieën, die S&OP-gidsen wel noemen maar zelden doorrekenen [6]:

- **Vlak:** produceer tegen een constant tempo en laat de voorraad de vraagschommelingen opvangen.
- **Chase:** wijzig het productietempo elke maand om de vraag te volgen, met overwerk, tijdelijke arbeid of extra ploegen, en houd de voorraad vlak.
- **Hybride (gemengd):** wijzig het tempo enkele keren en accepteer een beperkte voorraadopbouw.

**Uitgewerkt voorbeeld (illustratieve getallen).** Een bureaufabrikant plant de familie "stalen-frame bureaus" voor zes maanden. De beginvoorraad bedraagt 800 stuks, de gewenste eindvoorraad 800 stuks, en aan het einde van elke maand moet minimaal 500 stuks op voorraad zijn (veiligheidsvoorraad). Het vorige productietempo was 3.000 stuks per maand. Lassen is het knelpunt: 5 lascellen × 2 ploegen × 8 uur × 20 dagen = 1.600 uur per maand; elk bureau vraagt 0,4 laswerkuur, dus het maximale tempo is 1.600 / 0,4 = **4.000 bureaus per maand**. Kosten: opslagkosten van $4 per stuk per maand op de eindvoorraad; elke eenheid wijziging in het maandelijkse tempo (aannemen, opleiden, overwerk-opstart of ontslag) kost $5.

| Maand | Vraag | Vlak: productie | Vlak: eindvoorraad | Chase: productie | Chase: eindvoorraad | Hybride: productie | Hybride: eindvoorraad |
|---|---|---|---|---|---|---|---|
| Jan | 3.000 | 3.800 | 1.600 | 3.000 | 800 | 3.500 | 1.300 |
| Feb | 3.200 | 3.800 | 2.200 | 3.200 | 800 | 3.500 | 1.600 |
| Mrt | 4.200 | 3.800 | 1.800 | **4.200** | 800 | 4.000 | 1.400 |
| Apr | 4.800 | 3.800 | 800 | **4.800** | 800 | 4.000 | 600 |
| Mei | 4.000 | 3.800 | 600 | 4.000 | 800 | 4.000 | 600 |
| Jun | 2.800 | 3.800 | 1.600 | 2.800 | 800 | 3.000 | 800 |
| **Totaal** | **22.000** | **22.800** | **8.600 stuk-maanden** | **22.000** | **4.800 stuk-maanden** | **22.000** | **6.300 stuk-maanden** |

Waarom het vlakke tempo 3.800 is: de cumulatieve vraag tot en met mei is 19.200 stuks; met 500 stuks vereist aan het eind van mei en 800 stuks op voorraad aan het begin, moet de productie tot en met mei minstens 19.200 + 500 − 800 = 18.900 bedragen, oftewel 3.780 per maand. Afgerond op 3.800 eindigt het vlakke plan juni met 1.600 stuks, 800 boven het doel.

| Kostenpost | Vlak | Chase | Hybride |
|---|---|---|---|
| Tempowijzigingen (stuks × $5) | 3.000 → 3.800: 800 → $4.000 | +200, +1.000, +600, −800, −1.200 = 3.800 → $19.000 | +500, +500, −1.000 = 2.000 → $10.000 |
| Opslag (stuk-maanden × $4) | 8.600 → $34.400 | 4.800 → $19.200 | 6.300 → $25.200 |
| **Totaal** | **$38.400** | **$38.200** | **$35.200** |
| Haalbaar bij het lasknelpunt (≤ 4.000/maand)? | ja | **nee** (maart 4.200, april 4.800) | ja |
| Eindvoorraad t.o.v. doel 800 | +800 | op doel | op doel |

Het chase-plan lijkt op papier bijna even goedkoop als het vlakke plan, maar het is niet haalbaar: maart en april overschrijden de lascapaciteit, tenzij het bedrijf een derde ploeg toevoegt, wat eigen kosten met zich meebrengt. Het hybride plan is het goedkoopste van de haalbare opties en laat het lassen drie maanden lang precies op 100% draaien, waardoor geen beschermende capaciteit overblijft. Tempowijzigingen zijn niet alleen een kostenpost. Een chase-plan betekent aannemen, tijdelijke arbeid, ontslagen of aanhoudend overwerk; cao's, regels over overwerkaankondiging en vermoeidheidsgrenzen bepalen hoe snel een fabriek van tempo kan veranderen, en de operators dragen de kosten van elke schommeling. De leveringsreview moet de fabriek en HR vragen wat realistisch is voordat het wordt gemodelleerd. Financiën voegt een tweede effect toe: bij standaardkostprijsberekening nemen maanden met lage productie minder vaste overhead op, zodat een chase-plan afwijkingen in de overheadtoerekening veroorzaakt die een vlak plan vermijdt.

Dat is de beslissing die de leveringsreview naar de directievergadering moet brengen: keur het hybride plan goed en besluit of een lasonderaannemer gekwalificeerd moet worden voor 200–400 bureaus per maand als verzekering. Een knelpunt op volledige benutting laten draaien doet wachtrijen en doorlooptijden sterk toenemen, zoals de [APS-gids over de sectie fabrieksfysica](https://www.m365.fm/en/learn/production-scheduling-aps/) laat zien met de wet van Little en werkingscurven, en de [gids over de theory of constraints](https://www.m365.fm/en/learn/theory-of-constraints/) legt uit hoe je de drum beschermt.

## S&OP vs. IBP vs. S&OE

De drie termen beschrijven verschillende scope en horizon.

| Aspect | S&OP | Integrated business planning (IBP) | Sales and operations execution (S&OE) |
|---|---|---|---|
| Vraag | Komen vraag en aanbod per familie overeen? | Houdt het volledige bedrijfsplan (portfolio, vraag, aanbod, financiën, strategie) stand? | Wat veranderen we deze week om het plan uit te voeren? |
| Horizon | Oliver Wight: meestal 6–12 maanden; SAP en andere: 18–36 maanden rollend [2][5] | minimaal 24 maanden [2] | 0–3 maanden (weken) [unverified: horizon zoals gebruikelijk in de praktijk] |
| Cadans | maandelijks | maandelijks | wekelijks |
| Eenheden | stuks en dollars per familie | voornamelijk dollars, daarnaast stuks | stuks per SKU en klant |
| Voorzitter | GM of VP operations | CEO of business unit president | supply chain- of planningmanager |
| Oorsprong | Oliver Wight, jaren tachtig [1][2] | Oliver Wight, begin jaren 2000 [2] | praktijkterm, geen enkele geverifieerde oorsprong |

Oliver Wight beschrijft S&OP als gericht op afwegingen in de supply chain en IBP als het brengen van de volledige onderneming in beeld, over portfolio, vraag, aanbod en financiën [2]. Veel bedrijven gebruiken de termen door elkaar. Het label is minder belangrijk dan twee feiten: of financiën en het portfolio onderdeel van het proces zijn, en of het management-team in dit proces beslissingen neemt. S&OE is de wekelijkse brug tussen het goedgekeurde plan en de MPS: het behandelt kortetermijnwijzigingen in de vraag, verstoringen in de aanvoer en toewijzing binnen de bevroren en slushy zones van de MPS (Sectie 8).

**S&OE wekelijkse agenda (30–45 minuten, illustratief)**

| Tijd | Onderwerp | Verantwoordelijke |
|---|---|---|
| 5 min | afgelopen week: MPS-naleving, verzendingen vs. plan, de drie grootste afwijkingen | master scheduler |
| 10 min | wijzigingen in de vraag binnen het planningstijdvak: nieuwe grote orders, annuleringen, toewijzing bij tekort | demand planner, klantenservice |
| 10 min | aanvoerproblemen: leveranciersvertragingen, machinestoringen, kwaliteitsblokkades, materiaaltekorten uit MRP-uitzonderingen | supply planner, fabriek |
| 10 min | beslissingen binnen de MPS-regels; alles buiten de regels wordt doorgeschoven naar de volgende S&OP-stap | supply chain manager |
| 5 min | acties, eigenaren, datums | master scheduler |

## S&OP-volwassenheidsmodellen

Volwassenheidsmodellen helpen een bedrijf te zien waar het staat en wat de volgende stap is. Drie worden breed gebruikt.

**Gartner.** Gartner publiceert een vijfniveau S&OP-volwassenheidsroadmap [17]. De openbare overzichtspagina vermeldt de namen van de niveaus niet; secundaire bronnen beschrijven de niveaus ruwweg als volgt, van geen gedeelde doelen en spreadsheetgebaseerde, ongecoördineerde planning (niveau 1) via operationele verkoopplanning, balancering van vraag en aanbod over de volledige end-to-end supply chain, en een vraaggericht, winstgevend productmix, tot een verbonden onderneming waarin S&OP onderdeel is van de algehele bedrijfsplanning en beslissingen scenariogebaseerd zijn (niveau 5) [18]. [unverified: Gartners eigen niveaunamen; de beschrijvingen hierboven volgen de samenvatting van Jedox, een leverancier van planningssoftware.]

**Grimson en Pyke (2007).** J. Andrew Grimson en David Pyke stelden een kader voor met vijf dimensies en vijf fasen: geen S&OP-proces, reactief, standaard, geavanceerd en proactief [1][19].

**Wagner, Ullrich en Transchel (2014).** Stephan Wagner en collega's beschrijven vier dimensies en zes fasen, van onontwikkeld tot proactief, samen met het vijfstappenproces dat in Sectie 4 wordt gebruikt [1][20].

Een eenvoudige zelfevaluatie, afgeleid van de dimensies die deze modellen gemeen hebben (vergaderingen en samenwerking, organisatie, meting, informatietechnologie, planintegratie):

| Dimensie | Fase 1: geen of reactief | Fase 2: standaard | Fase 3: geavanceerd | Fase 4: proactief |
|---|---|---|---|---|
| Vergaderingen | ad-hoc brandjes blussen | maandelijkse cyclus, management soms aanwezig | volledige vijfstappencyclus, directie voorzitter elke maand | cyclus omvat scenario's en strategie, directie beslist over opties |
| Organisatie | geen eigenaar | parttime coördinator | toegewijde procesowner, schriftelijk vastgelegde beslissingsbevoegdheden | S&OP is de manier waarop het bedrijf wordt gestuurd |
| Meting | geen | service en voorraad | nauwkeurigheid en bias van de prognose, planrealisatie | KPI's gekoppeld aan financiële resultaten en beloning |
| IT | afzonderlijke spreadsheets | gedeelde spreadsheet of ERP-rapporten | geïntegreerd planningsinstrument, afstemming familie/SKU | scenarioplanning, geautomatiseerde gegevensstroom |
| Planintegratie | verkoop- en productieplannen verschillen | één volumeplan | volumeplan afgestemd op het financiële plan | één plan stuurt budget, MPS en investeringen aan |

Het onderzoeksbewijs over de effecten van S&OP is ondersteunend, maar niet eenduidig. Een literatuuroverzicht van Antônio Márcio Tavares Thomé en co-auteurs in de *International Journal of Production Economics* vatte de S&OP-literatuur tot 2012 samen [22], en een vervolgstudie koppelde S&OP aan de bedrijfsprestaties [23]. Later werk benadrukt dat het juiste S&OP-ontwerp afhangt van de context, zoals bedrijfsgrootte, productcomplexiteit en onzekerheid in de supply chain [34]. Claims over vaste procentuele verbeteringen door S&OP op leverancierspagina's moeten als claims van de leverancier worden gelezen.

## Hoofdproductieplanning (MPS) en available to promise (ATP)

De **hoofdproductieplanning** is een opgave van wat het bedrijf verwacht te produceren, gebaseerd op het tactische plan en de budgetbeperkingen, zoals de documentatie van Oracle JD Edwards stelt [7]. Ze staat tussen S&OP en MRP: ze is specifiek genoeg (eindproduct, week) om materiaal- en capaciteitsplanning aan te sturen, en stabiel genoeg om de fabriek te beschermen tegen dagelijkse ruis. MRP berekent vervolgens de in de tijd gefaseerde nettobehoeften voor elk onderdeel ter ondersteuning van de MPS [7].

### Disaggregatie: van familie naar eindproduct

Het goedgekeurde S&OP-plan voor "stalen-frame bureaus" in april is 4.000 eenheden. De hoofdplanner splitst dit per eindproduct op basis van de huidige mix en bekende orders: 55% D100 (2.200), 30% D120 (1.200) en 15% D140 (600), daarna per week. Planningsstuklijsten worden gebruikt waar opties als percentages worden gepland, bijvoorbeeld 60% zwarte frames en 40% witte.

### Tijdsbarrières

De MPS is verdeeld in zones met verschillende wijzigingsregels. Gebruikelijke zonenamen en regels (exacte definities en zonelengten verschillen per bedrijf en ERP):

| Zone | Gebruikelijke omvang | Wat mag veranderen | Wie keurt goed |
|---|---|---|---|
| Bevroren | van vandaag tot de vraagtijdsbarrière (bijvoorbeeld doorlooptijd eindassemblage) | niets, behalve noodgevallen | fabrieksmanager of S&OE-vergadering |
| Stroperig | van de vraagtijdsbarrière tot de planningstijdsbarrière (bijvoorbeeld cumulatieve doorlooptijd van inkoopdelen met lange levertijd) | mix binnen de familie; hoeveelheden binnen de afgesproken tolerantie | hoofdplanner |
| Vloeibaar | voorbij de planningstijdsbarrière | alles wat consistent is met S&OP | planningssysteem en hoofdplanner |

De bevroren zone is wat Gershwins MIT-dia's bedoelen met het bevriezen van het kortetermijnschema: het vermindert nervositeit ten koste van flexibiliteit [8]. Paragraaf 12 kwantificeert waarom.

### MPS-record met geprojecteerd beschikbaar saldo en ATP

**Uitgewerkt voorbeeld (illustratieve getallen).** Eindproduct D100, voorraad 60 stuks, MPS-lotgrootte 200, veiligheidsvoorraad 0, vraagtijdsbarrière aan het einde van week 2. Binnen de vraagtijdsbarrière is de geprojecteerde vraag alleen klantorders; daarbuiten is het het grootste van prognose en klantorders.

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Prognose | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| Klantorders | 90 | 70 | 40 | 20 | 10 | 0 | 0 | 0 |
| Geprojecteerde vraag | 90 | 70 | 100 | 100 | 100 | 100 | 100 | 100 |
| MPS (gereedmeldingen) | 200 | | | 200 | | 200 | | 200 |
| Geprojecteerd beschikbaar saldo (PAB), start 60 | 170 | 100 | 0 | 100 | 0 | 100 | 0 | 100 |
| Discrete ATP | 60 | | | 170 | | 200 | | 200 |
| Cumulatieve ATP | 60 | 60 | 60 | 230 | 230 | 430 | 430 | 630 |

Hoe de getallen tot stand komen:

- **PAB, week 1:** 60 + 200 − 90 = 170. Week 2: 170 − 70 = 100. Week 3: 100 − 100 = 0. Week 4 zou naar −100 gaan, dus plant de MPS een lot van 200: 0 + 200 − 100 = 100. En zo verder.
- **Discrete ATP** wordt alleen berekend in weken met een MPS-ontvangst: voorraad (alleen eerste periode) plus de MPS-hoeveelheid minus alle klantorders tot de volgende MPS-ontvangst. Week 1: 60 + 200 − (90 + 70 + 40) = 60. Week 4: 200 − (20 + 10) = 170. Weken 6 en 8: 200 − 0 = 200.
- **Cumulatieve ATP** telt de discrete ATP over de tijd op: 60, dan 60 + 170 = 230, dan 430, dan 630.
- Sommige ERP-systemen gebruiken een vooruitkijkvariant: als klantorders in een latere periode de MPS-ontvangst van die periode overschrijden, wordt het tekort afgetrokken van de ATP van eerdere periodes, zodat dezelfde eenheden niet dubbel worden beloofd. In dit voorbeeld wordt geen enkele periode overbeloofd, dus beide methoden geven hetzelfde resultaat.

Wat verkoop kan toezeggen: een klant die 100 bureaus in week 2 wil, kan met het huidige plan maximaal 60 krijgen; de volledige 100 zijn beschikbaar vanaf week 4 (cumulatieve ATP 230). De PAB van 0 in week 3 is geen probleem voor het toezeggen, omdat ATP klantorders gebruikt en niet de prognose. Het is wel een signaal voor de master scheduler dat het plan geen speelruimte heeft als de orders in week 3 de prognose overschrijden. ERP-systemen zoals JD Edwards rapporteren ATP en cumulatieve ATP als standaardoutput van de MPS [7].

### MPS-regels die het schema geloofwaardig houden

| Regel | Waarom |
|---|---|
| De MPS-som per familie blijft binnen ±5% van het S&OP-plan (voorbeeldtolerantie) | anders bereiken S&OP-beslissingen de productievloer niet |
| Geen overbelasting: RCCP-belasting ≤ aangetoonde capaciteit op kritieke resources | een overschatte MPS maakt ATP- en MRP-data fictief |
| Wijzigingen binnen de bevroren zone vereisen een benoemde goedkeuring | beschermt materiaal en capaciteit die al zijn toegezegd |
| Vaste geplande orders voor de korte termijn | de MRP-run kan die niet automatisch verschuiven |
| ATP wordt gecontroleerd vóór elke orderbelofte | voorkomt dat dezelfde capaciteit tweemaal wordt toegezegd |
| Wekelijkse MPS-review in de S&OE-vergadering | vangt afwijkingen op voordat ze achterstallige orders worden |

## Rough-cut capacity planning (RCCP)

Rough-cut capacity planning toetst de MPS aan een paar **kritieke resources** voordat MRP het uiteenrafelt. Het is "rough" omdat het een bill of resources gebruikt (uren per eindproduct per kritieke resource), geen volledige routings, en de meeste doorlooptijdverschuivingen negeert.

**Uitgewerkt voorbeeld (illustratieve getallen).** Wekelijkse MPS voor de drie bureaumodellen en hun bill of resources bij drie kritieke resources:

| Model | MPS week 14 | Lassen (u/eenheid) | Poedercoating (u/eenheid) | Eindmontage (u/eenheid) |
|---|---|---|---|---|
| D100 | 550 | 0,40 | 0,10 | 0,25 |
| D120 | 300 | 0,45 | 0,12 | 0,30 |
| D140 | 150 | 0,60 | 0,15 | 0,40 |

| Resource | Belastingberekening | Belasting (u) | Wekelijkse capaciteit (u) | Bezetting |
|---|---|---|---|---|
| Lassen | 550 × 0,40 + 300 × 0,45 + 150 × 0,60 = 220 + 135 + 90 | 445 | 400 | **111%** |
| Poedercoating | 550 × 0,10 + 300 × 0,12 + 150 × 0,15 = 55 + 36 + 22,5 | 113,5 | 160 | 71% |
| Eindmontage | 550 × 0,25 + 300 × 0,30 + 150 × 0,40 = 137,5 + 90 + 60 | 287,5 | 320 | 90% |

Lassen is overbelast met 45 uur. Opties: 75 D140-bureaus (75 × 0,60 = 45 u) naar week 15 verschuiven als week 15 ruimte heeft en de klantdata dit toelaten, 45 uur overwerk plannen, of een deel van de D100-frames verschuiven naar de onderaannemer die in de leveranciersreview is voorbereid. De wekelijkse lascapaciteit van 400 uur komt overeen met de 1.600 uur per maand die in S&OP wordt gebruikt (Sectie 5), en dat is het punt: RCCP gebruikt dezelfde resourcedefinities als de leveranciersreview van S&OP, zodat de niveaus kunnen worden afgestemd.

Drie RCCP-technieken zijn gebruikelijk in handboeken en ERP-systemen: capaciteitsplanning met totaalfactoren (historische percentages van de totale uren per werkcentrum), bills of capacity of bills of resources (uren per eenheid per resource, zoals hierboven), en resourceprofielen die tijdsverschuivingen toevoegen. Hoe gedetailleerder de methode, hoe dichter die bij capacity requirements planning komt (Sectie 11).

## Materials Requirements Planning (MRP): hoe de berekening werkt

**Materials Requirements Planning (MRP)** gebruikt de stuklijst en de voorraadgegevens om voor elk onderdeel en elke subassemblage tijdsgefaseerde nettobehoeften te berekenen en stelt een aanvulplan voor dat de MPS ondersteunt [7]. De logica berust op één idee van Orlicky: de vraag naar onderdelen is *afhankelijk* van de vraag naar het eindproduct, dus moet ze worden berekend en niet voorspeld [13]. Als de fabriek in week 3 150 bureaus bouwt en elk bureau vier poten heeft, zijn er vóór week 3 600 poten nodig, ongeacht wat een statistische voorspelling voor poten zou zeggen.

### De invoer

| Invoer | Inhoud | Typisch datakwaliteitsprobleem |
|---|---|---|
| Hoofdproductieplan | eindproducten, hoeveelheden, data | MPS niet afgestemd op S&OP, of overbelast |
| Stuklijst (BOM) | relaties tussen moeder en onderdeel, hoeveelheid per, uitvalpercentages, geldigheidsdata | engineering-stuklijst in plaats van productiestuklijst gebruikt; ontbrekende phantom-assemblages; verouderd na engineeringwijzigingen |
| Voorraadregistraties | fysiek aanwezig, gereserveerd, veiligheidsvoorraad | tellingen onjuist; uitval en verbruik niet geboekt |
| Openstaande orders (geplande ontvangsten) | vrijgegeven productie- en inkooporders met leverdatum | leverdatums niet bijgehouden; orders te laat gesloten |
| Planningsgegevens in de artikelmaster | doorlooptijd, lotgroottebeleid, orderveelvouden, minimumhoeveelheden, opbrengst | doorlooptijden jaren geleden vastgesteld en nooit herzien |

De MIT-slides van Gershwin noemen dezelfde bouwstenen: bruto-behoeften, geplande ontvangsten, geprojecteerde voorraad, nettobehoeften, geplande orderontvangsten en geplande orderreleases, verschoven met de doorlooptijd [8].

### De vijf stappen per artikel

1. **Bruto-behoeften:** de MPS voor eindproducten, of voor onderdelen de geplande orderreleases van alle moeders vermenigvuldigd met de hoeveelheid per.
2. **Netting:** geprojecteerde voorraad = vorige voorraad + geplande ontvangsten − bruto-behoeften. Waar die onder de veiligheidsvoorraad zou zakken, is het tekort de **nettobehoefte**.
3. **Lotgrootte:** de nettobehoefte wordt een **geplande orderontvangst** volgens de lotgroottebeleid (lot-for-lot, vaste orderhoeveelheid, veelvouden, periodeorderhoeveelheid).
4. **Verschuiven (offsetting):** de geplande orderontvangst wordt met de doorlooptijd van het artikel naar achteren verschoven tot de **geplande orderrelease**.
5. **Explosie:** de geplande orderreleases worden de bruto-behoeften van het volgende stuklijstniveau.

Artikelen worden niveau voor niveau verwerkt in volgorde van de **low-level code**: elk artikel krijgt een code gelijk aan het laagste niveau waarop het in enige stuklijst voorkomt, zodat alle bruto-behoeften van alle moeders zijn verzameld voordat het artikel wordt genet [8]. Het uitgewerkte voorbeeld laat zien waarom dat belangrijk is.

### Uitgewerkt voorbeeld: MRP-explosie en netting over twee stuklijstniveaus

**Productstructuur (illustratief).** Bureau D100 bestaat uit één bureaublad T-20, één poot-frame F-10 en 1 meter stalen buis S-5 voor een dwarsligger. Elk poot-frame F-10 is gelast uit 4 meter stalen buis S-5. S-5 komt dus voor op niveau 1 (direct in D100) en op niveau 2 (in F-10); de low-level code is 2.

```
D100 Bureau (niveau 0)
├── T-20 Bureaublad, aantal 1 (niveau 1, intern gemaakt, doorlooptijd 1 week)
├── F-10 Poot-frame, aantal 1 (niveau 1, intern gelast, doorlooptijd 2 weken)
│   └── S-5 Stalen buis, 4 m (niveau 2, ingekocht, doorlooptijd 2 weken)
└── S-5 Stalen buis, 1 m (niveau 1, dwarsligger)
```

Om de tabellen leesbaar te houden, toont de MPS-rij de week waarin de eindassemblage van D100 start; onderdelen moeten aan het begin van die week beschikbaar zijn.

**MPS voor D100 (eindassemblage start):**

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Totaal |
|---|---|---|---|---|---|---|---|---|---|
| D100-assemblage start | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 | 740 |

**Artikel T-20 Bureaublad.** Lot-for-lot, doorlooptijd 1 week, voorraad 30, geplande ontvangst 100 in week 1, veiligheidsvoorraad 0.

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Bruto-behoeften | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 |
| Geplande ontvangsten | 100 | | | | | | | |
| Geprojecteerde voorraad (start 30) | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 |
| Nettobehoeften | | | 140 | 100 | | 150 | 100 | 120 |
| Geplande orderontvangsten | | | 140 | 100 | | 150 | 100 | 120 |
| Geplande orderreleases | | 140 | 100 | | 150 | 100 | 120 | |

Week 1: 30 + 100 − 120 = 10. Week 3: 10 − 150 = −140, dus er zijn 140 nodig en die worden één week eerder vrijgegeven, in week 2.

**Artikel F-10 Poot-frame.** Vaste orderhoeveelheid 200 (een lasbatch), doorlooptijd 2 weken, voorraad 120, geen geplande ontvangsten, veiligheidsvoorraad 0.

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Bruto behoefte | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 |
| Geprojecteerde voorraad (start 120) | 0 | 0 | 50 | 150 | 150 | 0 | 100 | 180 |
| Netto behoefte | | | 150 | 50 | | | 100 | 20 |
| Geplande orderontvangsten | | | 200 | 200 | | | 200 | 200 |
| Geplande orderreleases | 200 | 200 | | | 200 | 200 | | |

Week 3: 0 − 150 = −150, dus er komt één lot van 200 binnen, waardoor 50 overblijft. Week 4: 50 − 100 = −50, nog een lot van 200, waardoor 150 overblijft. Week 6 gebruikt precies de resterende 150. De releases liggen twee weken eerder dan de ontvangsten.

**Artikel S-5 Stalen buis (laagste-niveaucode 2).** Ingekocht, doorlooptijd 2 weken, bestellen in veelvouden van 500 m, voorraad 1.400 m, geplande ontvangst 500 m in week 1, veiligheidsvoorraad 100 m. Bruto behoeften combineren beide bovenliggende artikelen:

| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Uit F-10 releases (× 4 m) | 800 | 800 | | | 800 | 800 | | |
| Uit D100 starts (× 1 m) | 120 | | 150 | 100 | | 150 | 100 | 120 |
| **Bruto behoefte** | **920** | **800** | **150** | **100** | **800** | **950** | **100** | **120** |
| Geplande ontvangsten | 500 | | | | | | | |
| Geprojecteerde voorraad (start 1.400) | 980 | 180 | 530 | 430 | 130 | 180 | 580 | 460 |
| Netto behoefte | | | 70 | | 470 | 920 | 20 | |
| Geplande orderontvangsten | | | 500 | | 500 | 1.000 | 500 | |
| Geplande orderreleases | 500 | | 500 | 1.000 | 500 | | | |

Week 3: 180 − 150 = 30, onder de veiligheidsvoorraad van 100, dus de netto behoefte is 70 en er wordt één veelvoud van 500 besteld (geprojecteerde voorraad 530). Week 6: 130 − 950 = −820; om minstens op 100 uit te komen, is de netto behoefte 920, naar boven afgerond op 1.000.

**Wat het voorbeeld laat zien**

- **Afhankelijke vraag is klonterig.** De vraag naar bureaus is redelijk gelijkmatig (100 tot 150 per week), maar de buisvraag springt per week tussen 100 en 950 m, omdat de lassen van lotten van 200 frames elk tegelijk 800 m opvragen. Een statistische prognose van buisverbruik zou die pieken missen; de stuklijstexplosie doet dat niet.
- **Codering op laagste niveau voorkomt tekorten.** Als S-5 op niveau 1 was genetteerd (met alleen de dwarsbalkvraag van 120 tot 150 m per week), had MRP tot week 7 geen behoefte gezien en zouden de frames in week 2 zonder buis zijn komen te zitten.
- **Lotgroottes vermenigvuldigen zich.** Twee lotgrootteregels (200 frames, veelvouden van 500 m) maakten van 740 bureaus 2.500 m buisorders in vijf weken. De [gids voor lotgrootte](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/) legt uit hoe je die regels kiest; de [gids voor voorraadbeheer in de productie](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) behandelt veiligheidsvoorraad.
- **De ERP-uitvoer is een lijst met acties:** release deze week 200 frames en koop 500 m buis; release volgende week 140 bureaubladen. De planner werkt deze af als **uitzonderingsmeldingen** (release, herplan naar voren, herplan naar achteren, annuleer) in plaats van de volledige tabellen te lezen.

### Pegging en uitzonderingsmeldingen

**Pegging** koppelt elke behoefte aan haar bron: de buisbehoefte van 950 m in week 6 is gekoppeld aan de F-10-release in week 6 (800 m) en de D100-start in week 6 (150 m). Met pegging ziet een planner die in week 6 geen 1.000 m buis kan krijgen, welke bureaus en welke klantorders in gevaar zijn.

Typische MRP-uitzonderingsmeldingen en wat te doen:

| Melding | Betekenis | Typische actie |
|---|---|---|
| Release order | geplande order valt binnen het releasevenster | omzetten naar productie- of inkooporder na controle van capaciteit en materiaal |
| Herplan naar voren (versnellen) | een openstaande order is later dan nodig | leverancier of fabriek vragen om te vervroegen; lukt dat niet, escaleren naar een wijziging van de MPS |
| Herplan naar achteren (vertragen) | een openstaande order is eerder dan nodig | uitstellen om voorraad te verlagen en capaciteit vrij te maken |
| Annuleer | een openstaande order is niet langer nodig | annuleren of verkleinen; controleer de annuleringsvoorwaarden |
| Achterstallig | releasedatum of leverdatum ligt al in het verleden | het plan is zo niet haalbaar: los de MPS op, niet alleen de order |
| Onder veiligheidsvoorraad | geprojecteerde voorraad onder het veiligheidsniveau | controleer eerst of de veiligheidsvoorraad juist is voordat je versnelt |

Een fabriek met honderden achterstallige geplande orders na elke MRP-run heeft geen MRP-probleem. Ze heeft een MPS die niet haalbaar is, of doorlooptijden en lotgroottes die de werkelijkheid niet weerspiegelen.

### MRP versus bestelpunt en kanban

MRP is niet de enige manier om onderdelen aan te vullen. Bestelpuntsystemen en kanban vullen aan wanneer de voorraad onder een triggerniveau zakt en werken goed voor artikelen met een stabiele, hoogfrequente vraag. MRP is beter geschikt voor onregelmatige afhankelijke vraag, lange doorlooptijden, lage volumes en geengineerde producten. Veel fabrieken gebruiken beide: kanban voor bevestigingsmiddelen en snel bewegende onderdelen aan de lijn, MRP voor onderdelen met lange doorlooptijden en hoge kosten. De [kanban- en pull-systeemgids](https://www.m365.fm/en/learn/kanban-pull-system/) en de [lean manufacturing-gids](https://www.m365.fm/en/learn/lean-manufacturing/) behandelen de pull-kant.

## MRP II, CRP en de gesloten lus

**Manufacturing resource planning (MRP II)** sluit de lus rond MRP: S&OP en de MPS erboven, capacity requirements planning (CRP) en shopvloerbesturing eronder, en de koppeling met financiële planning [3][8]. Oliver Wight beschreef het in 1983 [3].

**Capacity requirements planning (CRP)** neemt alle geplande en vrijgegeven orders uit MRP, past de volledige routings toe (insteltijd en looptijd per bewerking en werkcentrum) en berekent de belasting per werkcentrum en periode. Het toont overbelasting, maar lost die niet op: CRP rust, net als MRP, op een aanname van oneindige capaciteit [8]. Wallace Hopp en Mark Spearman stellen in *Factory Physics* dat het basismodel van MRP doorlooptijden veronderstelt die niet van de belasting afhangen, wat alleen mogelijk is met onbeperkte capaciteit [9]. De APS-gids toont een uitgewerkt voorbeeld van de overbelasting die MRP niet ziet en legt het **doorlooptijdsyndroom** uit: planners verlengen geplande doorlooptijden om late orders op te vangen, waardoor werk eerder wordt vrijgegeven, de WIP stijgt en de doorlooptijden nog langer worden [26]. In plaats van die secties te herhalen, verwijst deze gids ernaar: zie [de zwakke punten van de klassieke MRP-logica](https://www.m365.fm/en/learn/production-scheduling-aps/).

| Element van de gesloten lus | Controleert | Terugkoppeling bij falen |
|---|---|---|
| Capaciteitsplanning in S&OP | totale capaciteit per maand | gezinsplan aanpassen, capaciteitsbeslissing |
| RCCP | kritieke resources per week | MPS aanpassen |
| CRP | elk werkcentrum per dag of week | overwerk, alternatieve routing, MPS aanpassen |
| Input/output control en eindige planning | werkelijke wachtrijen en volgorde | herplannen, vrijgavecontrole, escaleren naar MPS |
| Terugkoppeling vanaf de shopvloer (MES) | werkelijke gereedmeldingen, uitval, stilstand | openstaande orders en voorraad bijwerken voor de volgende MRP-run |

## MRP-nervositeit: waarom plannen springen en hoe je ze kalmeert

**Nervositeit** betekent dat kleine wijzigingen in de MPS of in de voorraad grote of frequente wijzigingen in de geplande orders op lagere niveaus veroorzaken. Gershwin's sheets beschrijven het als kleine afwijkingen die grote wijzigingen in de planning veroorzaken [8]. De oorzaken zijn de interactie tussen lotgrootte, doorlooptijdverschuivingen en de rollende planhorizon, plus ruis in vraag-, aanbod- en voorraadgegevens.

### Uitgewerkt voorbeeld: 30 extra bureaus in week 4

Verkoop accepteert een extra order: de start van de D100-assemblage in week 4 gaat van 100 naar 130, een wijziging van 4% van het volume van acht weken (30 van 740). Het opnieuw draaien van het voorbeeld hierboven geeft:

| Artikel | Voor | Na | Wijziging |
|---|---|---|---|
| T-20 Desktop, geplande vrijgaven | wk 2: 140, wk 3: 100, wk 5: 150, wk 6: 100, wk 7: 120 | wk 2: 140, wk 3: **130**, wk 5: 150, wk 6: 100, wk 7: 120 | hoeveelheid +30 |
| F-10 Pootframe, geplande vrijgaven | wk 1, 2, **5**, 6 (elk 200) | wk 1, 2, **4**, 6 (elk 200) | één lassenlot een week naar voren gehaald |
| S-5 Staalbuis, geplande vrijgaven | wk 1: 500, **wk 3: 500**, wk 4: 1.000, wk 5: 500 | wk 1: 500, **wk 2: 500**, wk 4: 1.000, wk 5: 500 | één inkooporder een week naar voren gehaald, nu vrijgavedatum volgende week |

De extra 30 eenheden veranderden geen enkele hoeveelheid buis of frames. Ze veranderden **data** op twee lagere niveaus, omdat het vaste lot van 200 frames nu een week eerder opraakt. In een echte stuklijst met honderden componenten leveren een handvol zulke wijzigingen per dag duizenden herplanningsberichten op, en planners stoppen met het systeem te vertrouwen. Dat is nervositeit.

### Remedies

Joseph Blackburn, Dean Kropp en Robert Millen vergeleken in 1986 in *Management Science* vijf strategieën om nervositeit te dempen in een simulatiestudie: het bevriezen van het schema binnen de planhorizon, lot-for-lot onder het eindproduct, veiligheidsvoorraad, prognose buiten de planhorizon en een procedure met wijzigingskosten [10]. Bij nervositeit veroorzaakt door de rollende horizon en lotgrootte waren veiligheidsvoorraad en lot-for-lot niet kosteneffectief, terwijl de strategieën met wijzigingskosten en bevriezing over het algemeen het best presteerden [10]. De studie behandelde nervositeit veroorzaakt door onzekerheid in vraag, aanbod of doorlooptijd niet [10].

| Remedie | Werking | Afweging |
|---|---|---|
| Bevroren zone en tijdhekken | geen automatische wijzigingen binnen de bevroren zone | minder reactievermogen op echte wijzigingen |
| Vaste geplande orders | de planner legt geselecteerde orders vast; MRP verschuift ze niet | planner moet ze onderhouden |
| Regels voor wijzigingskosten of "dempen" | MRP stelt alleen een herplanning voor als de datumwijziging een drempel overschrijdt (bijvoorbeeld 3 dagen) of de wijzigingskosten het waard zijn | kleine afwijkingen blijven bestaan |
| Lot-for-lot op lagere niveaus | verwijdert de interactie van lotgroottes | meer omstellingen en orders; Blackburn et al. vonden het niet kosteneffectief bij door de horizon veroorzaakte nervositeit [10] |
| Veiligheidsvoorraad | vangt kleine wijzigingen op | voorraadkosten; in die studie ook niet kosteneffectief [10] |
| Nauwkeurige gegevens | minder kunstmatige wijzigingen door foute voorraad of stuklijsten | vereist cycle counting en discipline bij engineeringwijzigingen |
| Ontkoppelen met buffers (DDMRP) | breekt de afhankelijkheidsketen op geselecteerde punten | buffervoorraad, nieuwe methode om te leren |

## Vraaggestuurde MRP (DDMRP)

**Vraaggestuurde materiaalbehoefteplanning (DDMRP)** behoudt de stuklijstlogica van MRP, maar stopt de uitsplitsing van op prognose gebaseerde behoeften op geselecteerde **ontkoppelpunten**, waar gedimensioneerde, actief beheerde buffers worden aangehouden. Leveringsorders worden gegenereerd op basis van de werkelijke vraag en de bufferstatus, en niet alleen op basis van de prognose. De methode komt van de consultants Carol Ptak en Chad Smith: hun update uit 2011 van het boek van Orlicky, *Orlicky's Material Requirements Planning, Third Edition*, voegt richtlijnen toe voor planning op basis van werkelijke verkooporders in plaats van prognoses, onder de naam DDMRP [4]. TechTarget merkt op dat sommige praktijkmensen de aanpak controversieel vinden [4]. Ptak en Smith richtten in 2011 ook het Demand Driven Institute op; het evalueert en certificeert software op DDMRP-conformiteit, kosteloos voor leveranciers, en reikt individuen professionele erkenningscertificaten uit [35].

### De vijf componenten

Microsofts documentatie voor Dynamics 365 Supply Chain Management noemt de vijf componenten van DDMRP [11]:

1. **Strategische voorraadpositionering:** identificeer ontkoppelpunten in de supply chain waar een voorraadbuffer wordt aangehouden, bewaakt en aangevuld.
2. **Bufferprofielen en -niveaus:** dimensioneer elke buffer (minimum, maximum, bestelpunt) en de bestelhoeveelheid.
3. **Dynamische bufferaanpassingen:** pas bufferniveaus aan bij wijzigende bedrijfsparameters of geplande gebeurtenissen.
4. **Vraaggestuurde planning:** genereer leveringsorders (productie, inkoop, overdracht) wanneer nodig.
5. **Sterk samenwerkende en zichtbare uitvoering:** voer leveringsorders uit met visuele prioriteit, doorgaans op bufferkleur.

### Bufferdimensionering: uitgewerkt voorbeeld

Elke buffer heeft drie zones, berekend op basis van gemiddeld dagelijks gebruik (ADU), ontkoppelde doorlooptijd (DLT), een doorlooptijdfactor en een variabiliteitsfactor, zoals gedocumenteerd door Microsoft [12]:

| Zone | Formule [12] |
|---|---|
| Geel | ADU × DLT |
| Rood basis | ADU × DLT × doorlooptijdfactor |
| Rood veiligheid | rood basis × variabiliteitsfactor |
| Rood | rood basis + rood veiligheid |
| Groen | het grootste van: minimale bestelhoeveelheid; ADU × bestelcyclus; ADU × DLT × doorlooptijdfactor |

Microsoft beveelt doorlooptijdfactoren aan van 0,20–0,40 voor lange, 0,41–0,60 voor middellange en 0,61–1,00 voor korte doorlooptijden, en variabiliteitsfactoren van 0,20–0,40 voor lage, 0,41–0,60 voor middelmatige en 0,61–1,00 voor hoge variabiliteit [12]. **Ontkoppelde doorlooptijd** is de tijd die nodig is om een artikel te produceren of te ontvangen als de stroomopwaartse ontkoppelpunten op voorraad zijn; deze is meestal veel korter dan de cumulatieve doorlooptijd [12].

**Voorbeeld (illustratieve getallen).** Een ingekocht beugeltje B-7: ADU 40 stuks, ontkoppelde doorlooptijd 10 dagen, doorlooptijdfactor 0,5 (middel), variabiliteitsfactor 0,5 (middel), minimale bestelhoeveelheid 300, bestelcyclus 7 dagen.

| Zone | Berekening | Omvang | Cumulatief (bovenkant van zone) |
|---|---|---|---|
| Rood basis | 40 × 10 × 0,5 | 200 | |
| Rood veiligheid | 200 × 0,5 | 100 | |
| Rood | 200 + 100 | 300 | 300 |
| Geel | 40 × 10 | 400 | 700 |
| Groen | max(300; 40 × 7 = 280; 200) | 300 | 1.000 |

### De netto-stroomvergelijking

DDMRP beslist over aanvulling met de **netto-stroompositie**: voorraad + openstaand + bestelling − gekwalificeerde verkoopordervraag [14]. Gekwalificeerde vraag omvat doorgaans orders die vandaag vervallen, achterstallige orders en gekwalificeerde pieken binnen een gedefinieerde horizon. Als de netto-stroompositie onder de bovenkant van geel daalt, wordt een leveringsorder aangemaakt om deze terug te brengen naar de bovenkant van groen [14].

Doorlopend voorbeeld: voorraad 350, openstaand 400, gekwalificeerde vraag 90. Netto-stroompositie = 350 + 400 − 90 = **660**. Dit ligt onder de bovenkant van geel (700), dus DDMRP stelt een order voor van 1.000 − 660 = **340** stuks. De order overschrijdt de minimale bestelhoeveelheid van 300, dus hij blijft staan. De uitvoeringsprioriteit wordt vervolgens bepaald door de voorraadstatus: een voorraad van 350 ligt net boven de bovenkant van rood (300), wat een planner als urgent zou behandelen.

### Wanneer DDMRP past en wanneer niet

| Situatie | Geschiktheid DDMRP | Reden |
|---|---|---|
| Lange cumulatieve doorlooptijden, klanten verwachten korte levertijden | goed | ontkoppeling verkort de doorlooptijd die de klant ziet |
| Veel gedeelde componenten, hoge variabiliteit, frequente MRP-nervositeit | goed | buffers absorberen variabiliteit in plaats van die door de stuklijst naar beneden door te geven |
| Stabiele, voorspelbare vraag, korte stuklijsten | beperkt | klassieke MRP of kanban kan eenvoudiger zijn |
| Eenmalige engineer-to-order projecten | beperkt | weinig herhalende artikelen om te bufferen; projectplanning overheerst |
| Zwakke voorraadnauwkeurigheid en stamgegevens | slecht | buffers gedimensioneerd op foutieve ADU of doorlooptijden beschermen de verkeerde artikelen |

DDMRP is geen vervanging van S&OP. Bufferbeleid, capaciteit en voorraadinvesteringen vragen nog steeds om een maandelijkse, cross-functionele beslissing, en de ERP heeft de MPS nog steeds nodig voor eindproducten die niet gebufferd worden. In Dynamics 365 maakt DDMRP deel uit van de masterplanningmodule, gebruikt het een eigen dekkingscode, komt het zonder extra licentiekosten en vereist het de Planning Optimization-add-in; Microsoft benadrukt dat het bestaande planningsfunctionaliteit niet vervangt [11]. SAP noemt DDMRP onder de onderwerpen van zijn MRP-materiaal [27], en IFS documenteert DDMRP in IFS Cloud [14]. Onafhankelijk, peer-reviewed bewijs over de resultaten van DDMRP is nog schaarser dan leverancier- en adviesbureaucasussen; beschouw verbeterpercentages van DDMRP-leveranciers als claims van de leverancier.

## Productieplanning in ERP: wat de systemen doen en waar ze ophouden

Vrijwel elke productie-ERP bevat een MPS- en een MRP-engine. S&OP wordt op drie manieren ondersteund: in de ERP zelf, in een afzonderlijk S&OP- of IBP-platform dat met de ERP is verbonden, of in spreadsheets rond de ERP.

### Gangbare ERP-planningsfuncties

| Functie | Waar op te letten |
|---|---|
| Vraagmanagement en forecasting | statistische modellen, forecastverbruik door orders, forecast op familie- en SKU-niveau |
| MPS | tijdvensters, vaste geplande orders, planningsstuklijsten voor opties, ATP en cumulatieve ATP [7] |
| RCCP | resourcestuklijsten voor kritieke resources, belasting-versus-capaciteitsrapporten |
| MRP | net-change- en regeneratieve runs, low-level codes, lotgroottebepalingsregels, pegging, uitzonderingsmeldingen |
| CRP | belasting per werkplek op basis van routings |
| DDMRP | ontkoppelpunten, bufferprofielen, netto flow (waar ondersteund) [11] |
| Integratie | naar S&OP-tool, APS, MES, leveranciersportalen, BI |

### Opties in de markt (voorbeelden, geen ranglijst)

| Categorie | Voorbeelden geverifieerd voor deze gids | Opmerkingen |
|---|---|---|
| ERP met MPS/MRP | Oracle JD Edwards EnterpriseOne (MPS, MRP, ATP) [7]; Microsoft Dynamics 365 Supply Chain Management (masterplanning met Planning Optimization, DDMRP) [11]; SAP S/4HANA (MRP; SAP-materiaal behandelt predictive MRP en DDMRP) [27]; IFS Cloud (DDMRP) [14] | veel meer ERP-leveranciers bieden MRP; controleer de planningsdiepte in een scripted demo |
| ERP-verwante S&OP en IBP | SAP Integrated Business Planning [5]; Oracle Fusion Cloud Sales and Operations Planning [33] | het sterkst wanneer de ERP van dezelfde leverancier is |
| Zelfstandige S&OP-/IBP-platforms | Kinaxis, o9 Solutions, Blue Yonder, ToolsGroup, Board, Anaplan (leverancierslijst volgens de buyer's guide 2026 van Board, geschreven door een van de leveranciers) [29][15] | ranglijsten van leveranciers zijn niet onafhankelijk; gebruik analistenrapporten met een vermelde methodologie |
| Spreadsheets | Excel met ERP-extracten; Power BI voor KPI-rapportage | toereikend voor een eerste S&OP-cyclus met weinig families; broos op schaal |

Voor bedrijven die vooral op Microsoft draaien, is een praktische opzet om de MPS en MRP in de ERP uit te voeren, S&OP voor te bereiden in Excel of een planningstool, en het KPI-pakket en het beslissingslogboek te publiceren via Power BI en Teams. Microsoft positioneert Dynamics 365, Microsoft 365 en Azure samen als "Microsoft for Manufacturing" [31], en Dataverse-data kan beschikbaar worden gemaakt in Microsoft Fabric zonder aparte ETL-pijplijn [32]. De [Azure for manufacturing guide](https://www.m365.fm/en/learn/manufacturing-it-azure/) behandelt de architectuur.

### Hoe ERP MRP uitvoert

De meeste ERP-systemen bieden twee uitvoermodi: een **regeneratieve** run die alle artikelen opnieuw vanaf nul berekent, vaak 's nachts of wekelijks, en een **net change**-run die alleen artikelen herberekent waarvan vraag, aanbod of stamgegevens zijn gewijzigd. In beide gevallen is het plan alleen zo actueel als de gegevens die de run ziet: als de MES completions en afkeur eenmaal per shift boekt maar MRP om 2 uur 's nachts draait, weerspiegelt de ochtendlijst met uitzonderingen de productie van gisteren. Stem het tijdstip van de MRP-run af op de boekingscyclus van MES en voorraad, en houd de MPS stabiel tijdens de run, zodat planners en het systeem niet tegen elkaar in werken. De [MES- en ISA-95-gids](https://www.m365.fm/en/learn/mes-isa-95/) behandelt de gegevensuitwisseling tussen Niveau 3 en Niveau 4.

### Waar ERP-planning ophoudt

- **Eindige capaciteit.** ERP MRP en CRP plannen met oneindige capaciteit [8]. Waar een bottleneck de leverdata bepaalt, is een eindige planner of APS nodig; zie de [APS-gids](https://www.m365.fm/en/learn/production-scheduling-aps/).
- **Scenario's.** Het vergelijken van drie leveropties met volledige materiaal- en capaciteitseffecten duurt in de meeste ERP MRP-runs lang. Planningsplatforms adverteren snelle scenariodoorrekening; Kinaxis beschrijft bijvoorbeeld gelijktijdige planning die cycli van weken naar uren terugbrengt (leveranciersclaim) [16].
- **Reactie op verstoringen.** In een door Kinaxis gefinancierd IDC-onderzoek (1.800 respondenten in negen landen, uitgevoerd in december 2023) kon 83% van de toeleveringsketens niet binnen 24 uur op verstoringen reageren (door de leverancier gefinancierd onderzoek) [30].
- **Uitvoering.** Dispatching, bevestigingen en realtime WIP horen thuis in MES (ISA-95 Niveau 3) [25].

### Selectiechecklist voor S&OP- en planningssoftware

| Vraag | Waarom het ertoe doet |
|---|---|
| Kan het familieplannen automatisch afstemmen op de MPS op SKU-niveau? | de meest voorkomende handmatige inspanning in S&OP |
| Toont het plannen naast elkaar in eenheden en dollars? | financiën moeten in het proces zitten |
| Hoe lang duurt het om een volledig scenario (vraagwijziging + capaciteit + materiaal) door te rekenen? | bepaalt of scenario's in vergaderingen worden gebruikt |
| Welke ERP-integraties zijn standaard, en wie onderhoudt ze? | integratie kost vaak meer dan de licenties |
| Kunnen planners stamgegevens (doorlooptijden, lotgroottes) wijzigen met een auditspoor? | datakwaliteit is de belangrijkste factor voor plankwaliteit |
| Wordt de toegevoegde waarde van de prognose gemeten (handmatige overschrijving versus statistisch)? | laat zien of consensusaanpassingen helpen |
| Wat is de realistische tijd tot de eerste live S&OP-cyclus? | Anaplan adviseert bijvoorbeeld om binnen 8–12 weken aantoonbare waarde te verwachten (leveranciersadvies) [15] |
| Totale kosten over 5 jaar, inclusief interne medewerkers | licentiekosten zijn meestal het kleinere deel [unverified: geen onafhankelijke kostenstudie geverifieerd] |

## Sjablonen: S&OP-kalender, agenda's, gezinsplan, MPS- en MRP-records

De onderstaande tabellen kunnen als startpunt in Excel of een SharePoint-lijst worden gekopieerd. De agenda's voor de vraagreview, de aanbodreview en de directievergadering staan in sectie 4.

### Sjabloon 1: productgezinsplan (één blad per gezin, MTS)

| Rij | M-1 werkelijk | M1 | M2 | M3 | M4–M6 (kwartaal) | M7–M12 (halfjaar) | M13–M18 | Opmerkingen |
|---|---|---|---|---|---|---|---|---|
| Budget / financieel plan (stuks) | | | | | | | | van financiën |
| Statistische prognose (stuks) | | | | | | | | model, versie |
| Consensusvraagplan (stuks) | | | | | | | | eigenaar: VP sales |
| Consensus van vorige maand (stuks) | | | | | | | | wijziging zichtbaar |
| Aanbodplan (stuks) | | | | | | | | eigenaar: VP operations |
| Eindvoorraad (stuks) | | | | | | | | |
| Voorraaddoel (stuks of dagen dekking) | | | | | | | | beleid |
| Belasting van kritieke resource (% van capaciteit) | | | | | | | | bijv. lassen |
| Omzet tegen standaardprijs ($) | | | | | | | | financiën |
| Kostprijs van de omzet tegen standaardkosten ($) | | | | | | | | financiën |
| Aannames en risico's | | | | | | | | koppeling naar log |

Voor productgezinnen op bestelling vervangt u de voorraadrijen door **backlog** en **backlogdoel (weken)**. Eindbacklog = startbacklog + nieuwe orders − verzendingen.

### Sjabloon 2: logboek van aannames

| ID | Gezin | Aanname | Eigenaar | Datum toegevoegd | Impact als het misgaat (stuks, $) | Status / datum van beoordeling |
|---|---|---|---|---|---|---|
| A-031 | bureaus | prijsverhoging door concurrent in april blijft gelden | VP sales | 6 jan | −400 stuks/maand | beoordeling 3 feb |
| A-032 | bureaus | onderaannemer lassen gekwalificeerd tegen maart | supply chain | 8 jan | −300 stuks in april | in uitvoering |

### Sjabloon 3: beslislogboek

| ID | Vergadering / datum | Beslissing | Overwogen opties | Eigenaar | Deadline | Effect op plan | Status |
|---|---|---|---|---|---|---|---|
| D-014 | Directie-S&OP, 15 jan | hybride plan aannemen, snelheden 3.500 / 4.000 / 3.000 | vlak, volgen, hybride | VP operations | 31 jan | +2.000 stuks snelheidswijziging, $35.200 | open |
| D-015 | Directie-S&OP, 15 jan | onderaannemer lassen kwalificeren voor 200–400 stuks/maand | geen / kwalificeren / derde ploeg | supply chain | 1 mrt | risicoreductie voor mrt–mei | open |

### Sjabloon 4: MPS-record

| Item | Week | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| | Prognose | | | | |
| | Klantorders | | | | |
| | Geprojecteerde vraag (regel per tijdsvenster) | | | | |
| | MPS (vast / gepland) | | | | |
| | Geprojecteerd beschikbaar saldo | | | | |
| | ATP / cumulatief ATP | | | | |
| | Tijdsvensterzone | bevroren | bevroren |半-flexibel | vloeibaar |

### Sjabloon 5: MRP-record (per item)

| Item, LLC, doorlooptijd, lotregel, veiligheidsvoorraad, voorraad op hand | Week | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| | Bruto behoefte | | | | |
| | Geplande ontvangsten | | | | |
| | Geprojecteerde voorraad op hand | | | | |
| | Nettobehoefte | | | | |
| | Geplande orderontvangsten | | | | |
| | Geplande orderreleases | | | | |

### Sjabloon 6: S&OP-gereedheidschecklist vóór de eerste cyclus

| Item | Gereed wanneer |
|---|---|
| Productgezinnen gedefinieerd | 5–15 gezinnen per bedrijfseenheid, elk met vergelijkbare resources en vraagdrijvers |
| Kritieke resources gedefinieerd | 3–8 resources die de output beperken, met aangetoonde capaciteit per maand |
| Resourcestuklijst | uren per stuk per kritieke resource, per gezin |
| Gegevensbronnen | verzendingen, orders, voorraad, productie per gezin beschikbaar op werkdag 1–2 |
| Voorraad- of backlogbeleid | doel per gezin goedgekeurd door financiën |
| Kalender | 12 maanden aan data vastgelegd voor alle vijf stappen |
| Beslissingsbevoegdheden | schriftelijke drempelwaarden voor supply review, pre-S&OP en directievergadering |
| Executive sponsor | benoemd, woont de eerste drie cycli persoonlijk bij |

## S&OP- en MRP-KPI's met uitgewerkte voorbeelden

Een goed S&OP-KPI-pakket is kort: ongeveer tien maatstaven, elk met een definitie, een eigenaar en een streefwaarde. De [handleiding over productie-KPI's](https://www.m365.fm/en/learn/manufacturing-kpis/) behandelt maatstaven op fabrieksniveau, zoals OEE en levering op tijd; dit hoofdstuk gaat over planningsmaatstaven.

### Prognosenauwkeurigheid, bias en MAPE: één dataset, vijf maatstaven

**Gegevens (illustratief).** Maandelijkse prognose (F, één maand vooruit gemaakt) en werkelijke vraag (A) voor de bureaufamilie:

| Maand | Prognose F | Werkelijk A | Fout e = F − A | Absolute fout \|e\| | Absolute procentuele fout \|e\| / A |
|---|---|---|---|---|---|
| Jan | 3.000 | 2.850 | +150 | 150 | 5,26% |
| Feb | 3.200 | 3.350 | −150 | 150 | 4,48% |
| Mrt | 4.200 | 3.900 | +300 | 300 | 7,69% |
| Apr | 4.800 | 5.100 | −300 | 300 | 5,88% |
| Mei | 4.000 | 3.700 | +300 | 300 | 8,11% |
| Jun | 2.800 | 2.650 | +150 | 150 | 5,66% |
| **Som** | **22.000** | **21.550** | **+450** | **1.350** | **37,08%** |

| Maatstaf | Formule | Berekening | Resultaat |
|---|---|---|---|
| MAPE (gemiddelde absolute procentuele fout) | gemiddelde van \|e\| / A | 37,08% / 6 | **6,18%** |
| WMAPE (gewogen MAPE) | Σ\|e\| / ΣA | 1.350 / 21.550 | **6,26%** |
| Prognosenauwkeurigheid | 1 − WMAPE | 1 − 0,0626 | **93,7%** |
| Bias | Σe / ΣA | +450 / 21.550 | **+2,1% (te hoge prognose)** |
| MAD (gemiddelde absolute afwijking) | Σ\|e\| / n | 1.350 / 6 | **225 eenheden** |
| Tracking signal | Σe / MAD | 450 / 225 | **+2,0** |

Hoe je dit leest:

- **Nauwkeurigheid en bias beantwoorden verschillende vragen.** 93,7% nauwkeurigheid klinkt goed. Maar in vier van de zes maanden was de prognose te hoog, en de cumulatieve fout is +450 eenheden. Als de aanvoer de prognose volgt, groeit de voorraad in zes maanden met ongeveer 450 eenheden. Bias is de maatstaf die systematisch optimisme of bewust te lage prognoses zichtbaar maakt.
- **MAPE versus WMAPE.** MAPE weegt elke maand even zwaar; WMAPE weegt naar volume. Op SKU-niveau explodeert MAPE voor kleine artikelen: een SKU met prognose 10 en werkelijk 2 heeft een fout van 400%. Gebruik WMAPE (of MAD/gemiddelde) voor rapportage op SKU-niveau en houd MAPE voor stabiele reeksen met hoog volume.
- **Tracking signal.** De cumulatieve fout gedeeld door MAD. Een waarde die gestaag van nul wegloopt, wijst op bias; een gangbare vuistregel stelt dat het model correct werkt zolang de tracking signal tussen −4 en +4 blijft [36].
- **Aggregatie verbergt fouten.** Twee SKU's met elk een prognose van 1.000 en werkelijke waarden van 1.200 en 800 geven een familiefout van 0, maar een SKU-niveau WMAPE van 400 / 2.000 = 20%. Rapporteer nauwkeurigheid op het niveau waarop beslissingen worden genomen: familie voor S&OP, SKU en locatie voor de MPS en bevoorrading.
- **Vertraging is belangrijk.** Meet de prognose die is vastgelegd op de doorlooptijd die telt (bijvoorbeeld de prognose van drie maanden vóór de maand voor een onderdeel met een doorlooptijd van drie maanden), niet de last-minute aanpassing.

### Forecast value added

Forecast value added (FVA) vergelijkt de fout van elke stap in het prognoseproces met de stap ervoor. Als de statistische prognose een WMAPE van 7,5% had en de consensusprognose na verkoopaanpassingen 6,3%, heeft het consensusproces 1,2 procentpunt nauwkeurigheid toegevoegd. Als die 8,5% was, heeft de vergadering de prognose slechter gemaakt. FVA maakt van de vraagreview een gemeten proces in plaats van een meningenstrijd.

### KPI-set voor S&OP en MRP

| KPI | Definitie | Voorbeelddoel (illustratief) | Eigenaar |
|---|---|---|---|
| Prognosenauwkeurigheid (1 − WMAPE), familie, lag 1–3 | zie hierboven | ≥ 90% | vraagplanner |
| Prognosebias, familie | Σ(F − A) / ΣA over 3–6 maanden | binnen ±3% | VP verkoop |
| Realisatie van het leveringsplan | werkelijke productie / geplande productie per familie en maand | 95–105% | VP operations |
| MPS-naleving | MPS-regels afgerond in de geplande week / alle MPS-regels | ≥ 95% | masterplanner |
| Stabiliteit van het planningsschema | MPS-wijzigingen binnen de bevroren zone per week | dalende trend | masterplanner |
| Klantenservice | on-time in-full (OTIF) of fill rate per familie | per segment | VP verkoop / supply chain |
| Voorraad versus doel | eindvoorraad / doel, of dagen voorraadbeslag | 90–110% | supply chain |
| Nauwkeurigheid voorraadregistratie | items binnen telltolerantie / geteld aantal items | hoog 90% | magazijn |
| BOM-nauwkeurigheid | geverifieerde correcte BOM's / geaudite BOM's | hoog 90% | engineering |
| MRP-uitzonderingsbelasting | uitzonderingsmeldingen per planner per week | dalende trend | materiaalmanager |
| Achterstallige geplande orders | aantal na elke MRP-run | bijna nul | materiaalmanager |
| Afsluiting beslissingenlogboek | beslissingen afgesloten vóór de vervaldatum / beslissingen met vervaldatum | ≥ 90% | eigenaar van het S&OP-proces |

Sommige MRP-gidsen verwijzen naar Oliver Wight "Class A"-benchmarks, zoals 95% nauwkeurigheid van de voorraadregistratie en 98% BOM-nauwkeurigheid [28]. Dezelfde drempelwaarden komen voor in de literatuur over masterplanning: nauwkeurigheid van de voorraadregistratie van 95% als acceptatiedrempel (98% robuust) en BOM-nauwkeurigheid van minimaal 98% (99+% goed) [37]. De actuele Oliver Wight-checklist zelf was voor deze gids niet toegankelijk, dus de toeschrijving aan Oliver Wight blijft [unverified]. Stel uw eigen doelen vast op basis van een gemeten uitgangspunt.

### Financieel perspectief: wat S&OP doet voor het werkkapitaal

Financiën stelt meestal twee vragen: hoeveel voorraad draagt het plan, en wat kost dat? Met het hybride plan uit sectie 5 bedraagt de gemiddelde voorraad aan het einde van de maand 6.300 / 6 = 1.050 bureaus. Bij een standaardkostprijs van $180 per bureau (illustratief) is dat gemiddeld $189.000 vastgelegd. Het gelijkmatige plan draagt 8.600 / 6 = 1.433 bureaus, of $258.000. Bij een voorraadkostenpercentage van 20% per jaar (illustratief; gebruik het percentage van uw bedrijf) kost het verschil van $69.000 aan gemiddelde voorraad ongeveer $13.800 per jaar. Deze getallen horen in het voorbereidende beslisdocument voor S&OP, naast de effecten op service en capaciteit.

## Implementatiestappenplan: 12 maanden naar een werkend S&OP en MRP

| Fase | Maanden | Belangrijkste activiteiten | Afrondingscriteria |
|---|---|---|---|
| 0. Beoordelen | 0–1 | zelfbeoordeling van volwassenheid (Sectie 7), data-inventarisatie, interviews, toezegging van de sponsor | sponsor benoemd, scope vastgelegd, KPI's als uitgangspunt gemeten |
| 1. Ontwerpen | 1–2 | productfamilies, kritieke middelen, stuklijst van middelen, kalender, beslissingsbevoegdheden, KPI-definities, sjablonen | ontwerpdocument goedgekeurd door de sponsor |
| 2. Datafundament | 1–4 (parallel) | nauwkeurigheid van de voorraad (cycle counting), audit van de stuklijsten inclusief geldigheid van engineeringwijzigingen, herziening van doorlooptijden, MPS-regels en time fences in het ERP | nauwkeurigheid van voorraad en stuklijsten gemeten en verbeterend; doorlooptijden herzien voor de top 80% van de waarde |
| 3. Eerste cycli | 3–5 | de vijfstappencyclus uitvoeren met spreadsheets; drie cycli achter elkaar met aanwezigheid van het management | drie cycli op tijd afgerond, beslissingslogboek in gebruik |
| 4. Koppelen aan MPS en MRP | 4–7 | disaggregatieregels, MPS afgestemd op S&OP, RCCP op kritieke middelen, discipline bij MRP-uitzonderingen | MPS binnen de tolerantie van S&OP; achterstallige geplande orders nemen af |
| 5. Meten en verbeteren | 6–9 | nauwkeurigheid en vertekening van de prognose, FVA, planrealisatie; grondoorzaken van gemiste doelen; regels voor nervositeit | KPI's maandelijks gerapporteerd; minstens één procesverandering op basis van FVA-resultaten |
| 6. Uitbreiden | 9–12 | financiële integratie (IBP-richting), scenario's, wekelijkse S&OE-vergadering, toolevaluatie als spreadsheets het proces beperken | plan in eenheden en dollars; S&OE draait; toolbeslissing op basis van bewijs genomen |

**Praktische opmerkingen**

- **Begin met spreadsheets.** Een tool kan een proces dat nog niet bestaat niet repareren. De meeste bedrijven leren wat ze van software nodig hebben pas na drie tot zes cycli.
- **Pilot met één business unit of fabriek.** S&OP over vijf fabrieken en twintig families op dag één overleeft zelden de tweede maand.
- **Dataweerk loopt parallel.** S&OP-beslissingen zijn slechts zo goed als de MPS en MRP eronder; de nauwkeurigheid van voorraad en stuklijsten bepaalt of de output van MRP vertrouwd kan worden.
- **Kwaliteit en configuratiebeheer.** In gereguleerde of gecertificeerde omgevingen (lucht- en ruimtevaart, automotive, medisch) is wijzigingsbeheer van stuklijsten ook een kwestie van het kwaliteitssysteem: een engineeringwijziging moet met de juiste geldigheidsdatum in de MRP-stuklijst terechtkomen, anders bestelt MRP onderdelen voor een vervangen revisie. Betrek de kwaliteitsverantwoordelijke bij de stuklijstaudit; de [gids voor productieplanning in de lucht- en ruimtevaart](https://www.m365.fm/en/learn/aerospace-production-planning/) behandelt configuratiebeheer.
- **Veranderingsmanagement.** Verkoopteams zijn bang om aan een prognose gehouden te worden; fabrieken zijn bang de schuld te krijgen van capaciteit die ze nooit hadden. Maak vertekening zichtbaar zonder mensen de schuld te geven, en vier beslissingen die vroeg zijn genomen.
- **Training.** Planners en masterplanners profiteren van gestructureerde training in de grondbeginselen van MPC; het ASCM CPIM-programma is het gangbare Amerikaanse certificaat [24].

## Veelvoorkomende fouten

| Fout | Symptoom | Oplossing |
|---|---|---|
| S&OP als rapportagevergadering | 40 dia's, geen beslissingen | beslisnotities met opties; beslislogboek |
| Directieleden slaan de vergadering over | afgevaardigden kunnen niet beslissen; issues schuiven door | aanwezigheid van de sponsor als regel; kortere, op beslissingen gerichte agenda |
| Forecast = verkoopdoelstelling | systematische overvoorspelling, stijgende voorraad | doelstelling en forecast scheiden; bias meten |
| S&OP op SKU-niveau | honderden regels, geen tijd voor beslissingen | families voor S&OP, SKU's voor MPS |
| Geen financiële expertise in de ruimte | plan in stuks past niet bij het budget | financieel partner in pre-S&OP; plan in stuks en dollars |
| MPS niet afgestemd op S&OP | productievloer volgt een ander plan | disaggregatieregel en tolerantiecontrole elke maand |
| Overbelaste MPS | achterstallige orders na elke MRP-run | RCCP op kritieke resources; MPS op aangetoonde capaciteit |
| Geplande doorlooptijden nooit herzien | te vroege of te late vrijgave, opgeblazen WIP | kwartaalreview van doorlooptijden; zie doorlooptijdsyndroom [26] |
| Onjuiste voorraad- en BOM-gegevens | spoedwerk, tekorten ondanks "beschikbare" voorraad | cycle counting, BOM-audits, proces voor engineering changes |
| Reageren op elk uitzonderingsbericht | nervositeit, uitputting van planners | time fences, vaste geplande orders, dempingsdrempels [10] |
| Eerst software kopen | duur hulpmiddel, dezelfde discussies | eerst drie tot zes handmatige cycli |
| Knelpunt negeren | plan haalbaar gemiddeld, onhaalbaar in piekmaanden | belasting van kritieke resources in elke leveringsbeoordeling; zie [theory of constraints](https://www.m365.fm/en/learn/theory-of-constraints/) |

## Beperkingen van S&OP en MRP

**S&OP is een maandelijks proces in een wereld die wekelijks verandert.** Een plan dat op de 15e is goedgekeurd, kan op de 25e verouderd zijn. S&OE en event-gedreven S&OP-updates pakken dit aan, maar ze vragen discipline om te voorkomen dat elke week alles opnieuw wordt gepland.

**Aggregatie verbergt problemen.** Een familieplan kan haalbaar zijn terwijl een specifieke variant een specifiek component tekortkomt. Daarom zijn de MPS en de MRP onder S&OP belangrijk, en moeten familiedefinities items groeperen die resources delen.

**MRP is deterministisch; de werkelijkheid niet.** MRP behandelt forecasts, doorlooptijden en opbrengsten als vaste getallen [8]. Veiligheidsvoorraad en veiligheidsdoorlooptijd dekken een deel van de variatie af, maar MRP kan onzekerheid niet expliciet weergeven. DDMRP, stochastische modellen en simulatie (zie [manufacturing simulation](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)) pakken dat vanuit verschillende invalshoeken aan.

**MRP plant met oneindige capaciteit.** MRP en CRP tonen overbelasting, maar lossen die niet op [8][9]. Finite scheduling en APS vullen die leemte op operationeel niveau.

**MRP legt doorlooptijden vast die in werkelijkheid van de belasting afhangen.** Geplande doorlooptijden zijn invoer voor MRP, maar uitkomsten van de werkbelasting van de werkplaats. Het doorlooptijdsyndroom laat zien wat er gebeurt wanneer planners ze als hefbomen behandelen [26].

**Afhankelijkheid van gegevens.** MRP versterkt datafouten: een verkeerde hoeveelheid per eenheid in een BOM op niveau 2 werkt door in elk bovenliggend item. Geen algoritme compenseert verkeerde voorraadregistraties.

**Cultuur.** De academische literatuur noemt organisatorische belemmeringen, zoals functionele silo's en ontbrekende betrokkenheid van de directie, als belangrijkste redenen waarom S&OP-initiatieven stagneren [1]. Software neemt die niet weg.

**Niet elk bedrijf heeft de volledige opzet nodig.** Een jobshop met korte doorlooptijden en vooral klantspecifieke orders heeft misschien meer aan een goede orderinname en finite scheduling dan aan een 24-maanden-S&OP. Een distributeur heeft mogelijk meer aan DRP dan aan MRP. Kies de methode die bij het bedrijf past.

## AI en digitale planning: wat vandaag werkt

Planningssoftware- en ERP-leveranciers adverteren nu met machine learning-prognoses, "demand sensing", planningsagents en copilots. Voor een fabriek zijn de relevante vragen welke planningsbeslissing beter wordt en hoe de verbetering wordt gemeten.

| Toepassing | Wat het doet | Waar het helpt | Wat te controleren |
|---|---|---|---|
| Machine learning-prognose | gebruikt veel drivers (prijs, promoties, weer, orders) naast historie | veel SKU's met bekende vraagdrivers | meet FVA ten opzichte van een eenvoudige statistische baseline; ML verslaat die voor sommige productfamilies wel en voor andere niet |
| Kortetermijn-demand sensing | past de prognose op korte termijn aan met recente orders en verkoopgegevens | consumentengoederen, distributie | alleen nuttig als de MPS en S&OE kunnen reageren op wekelijkse wijzigingen |
| Scenarioplanning en snelle herberekening | herberekent de effecten van een beslissing op vraag, capaciteit en materialen | leveranciersreview, pre-S&OP | rekentijd, datalatentie, wie scenario's kan draaien [16] |
| Parameterafstemming | stelt doorlooptijden, veiligheidsvoorraden, lotgroottes en DDMRP-bufferfactoren voor op basis van actuele data | onderhoud van MRP-stamdata | planner controleert wijzigingen voordat ze worden doorgevoerd; auditspoor |
| Triage van uitzonderingen | rangschikt MRP-uitzonderingsmeldingen op impact op klantorders | materiaalplanning | acceptatiegraad van aanbevelingen; bespaarde tijd |
| Generatieve AI-assistenten | vatten S&OP-pakketten samen, stellen beslisnota's op, beantwoorden "waarom is het plan veranderd?" op basis van planningsdata | voorbereiding van vergaderingen | antwoorden moeten de gebruikte data citeren; geen autonome planwijzigingen zonder goedkeuring |
| Digitale tweeling en simulatie | test capaciteits-, buffer- en lay-outopties voordat er wordt beslist | leveranciersreview voor capaciteitsinvesteringen | modelvalidatie aan de hand van werkelijke prestaties; zie de [gids digitale tweeling](https://www.m365.fm/en/learn/digital-twin-manufacturing/) |

Vier regels houden AI nuttig in de planning:

1. **Verbeter eerst het proces.** Een AI-prognose die wordt ingevoerd in een proces zonder vraagreview, zonder biasmeting en zonder beslissingsbevoegdheid, levert sneller verwarring op.
2. **Meet de toegevoegde waarde.** Behandel elk model als elke andere prognosestap en volg de FVA (hoofdstuk 16).
3. **Houd mensen verantwoordelijk voor beslissingen.** S&OP-beslissingen gaan over geld, mensen en klanten. Tools kunnen opties voorbereiden; het management beslist.
4. **Databasis vóór modellen.** De meeste AI-planningsprojecten lopen vast op de kwaliteit van historie, stamdata en integratie, niet op algoritmen. In Microsoft-omgevingen worden platformkeuzes zoals Fabric en Power BI behandeld in de [Azure-gids voor de maakindustrie](https://www.m365.fm/en/learn/manufacturing-it-azure/) [31][32].

### Een realistische Microsoft 365-opzet voor S&OP

| Element | Hulpmiddel | Toelichting |
|---|---|---|
| Agenda en vergaderingen | Outlook, Teams | terugkerende reeksen voor alle vijf stappen, 12 maanden vooruit ingepland |
| KPI-pakket | Power BI-rapport op basis van ERP- en planningsdata | één pagina per familie; elke maand dezelfde lay-out |
| Familieplannen en scenario's | Excel (eerste cycli), later een planningstool | versiebeheer: één bestand per cyclus, alleen-lezen na goedkeuring |
| Aannames en beslissingslogboeken | Microsoft Lists of een SharePoint-lijst | eigenaar, deadline, status; gekoppeld aan de agenda van het management |
| Beslisnota's | Word- of Loop-pagina's, één pagina per beslissing | opties, impact, aanbeveling |
| Ondersteuning bij voorbereiding | Copilot-samenvattingen van het KPI-pakket en de logboeken | gecontroleerd door de procese­igenaar vóór verspreiding |

## Woordenlijst

| Term | Definitie |
|---|---|
| Aggregate planning | Plannen van productiesnelheden, personeelsbezetting en voorraad voor productfamilies op middellange termijn; de oorsprong van S&OP [1] |
| Available to promise (ATP) | Het niet-toegezegde deel van de geplande aanvoer dat aan nieuwe klantorders kan worden beloofd (Sectie 8) |
| Bill of materials (BOM) | Lijst van componenten, hoeveelheden en structuur die nodig zijn om een bovenliggend artikel te maken |
| Bill of resources | Uren per eenheid van een product of familie per belangrijke resource; gebruikt in S&OP-capaciteitsplanning en RCCP |
| Capacity requirements planning (CRP) | Gedetailleerde belastingsberekening per werkcentrum op basis van MRP-orders en routings, bij oneindige capaciteit [8] |
| Cumulative lead time | Het langste pad van doorlooptijden door de BOM, van het inkopen van het eerste materiaal tot het afwerken van het eindproduct |
| Decoupling point | Positie in de BOM of supplychain waar een DDMRP-buffer de variabiliteit van aanbod en vraag van elkaar scheidt [11] |
| Demand time fence | Grens in de MPS waarbinnen alleen klantorders, en niet de prognose, als vraag tellen |
| Dependent demand | Vraag die berekend wordt uit de vraag naar een bovenliggend artikel, in tegenstelling tot onafhankelijke (prognose)vraag [13] |
| DDMRP | Demand driven material requirements planning: buffers op decoupling points, gedimensioneerd met zones en aangevuld met de net flow-vergelijking [11][12] |
| Exception message | MRP-advies om een order vrij te geven, te herplannen of te annuleren |
| Firm planned order | Geplande order die door de planner is vastgelegd, zodat MRP deze niet automatisch wijzigt |
| Forecast bias | Systematisch te hoge of te lage prognose; Σ(F − A) / ΣA |
| Forecast value added (FVA) | Verandering in de prognosefout veroorzaakt door een stap in het prognoseproces |
| Gross requirements | Totale vraag naar een artikel in een periode, vóór verrekening |
| Integrated business planning (IBP) | Oliver Wight-term voor een onderneemingsbrede uitbreiding van S&OP met portfolio en financiën, met een horizon van minstens 24 maanden [2] |
| Low-level code | Het laagste BOM-niveau waarop een artikel voorkomt; bepaalt de volgorde van verwerking in MRP [8] |
| Lot-for-lot | Losgrootteregel die precies de nettobehoefte van elke periode bestelt [8] |
| MAPE / WMAPE | Mean absolute percentage error / gewogen MAPE (Sectie 16) |
| Master production schedule (MPS) | Overzicht van wat het bedrijf per eindproduct en periode verwacht te produceren, gebaseerd op het tactische plan [7] |
| MRP | Material requirements planning: tijdsgefaseerde berekening van nettobehoeften voor alle componenten op basis van MPS, BOM en voorraad [7] |
| MRP II | Manufacturing resource planning: MRP plus S&OP, MPS, RCCP, CRP, shopfloorcontrole en financiële integratie [3] |
| Net flow position | DDMRP: voorraad + open aanvoer − gekwalificeerde vraag [14] |
| Nervousness | Frequente of grote wijzigingen in geplande orders veroorzaakt door kleine wijzigingen in de input [8][10] |
| Net requirements | Bruto behoefte minus beschikbare voorraad en geplande ontvangsten, plus veiligheidsvoorraad waar van toepassing |
| Pegging | Koppeling tussen een behoefte en de bronvraag |
| Planned order release | Datum en hoeveelheid waarop een geplande order vrijgegeven moet worden, verschoven met de doorlooptijd vanaf de ontvangstdatum |
| Planning time fence | Grens voorbij welke het planningssysteem orders automatisch mag aanmaken of wijzigen |
| Projected available balance (PAB) | Verwachte voorraad aan het einde van een periode in de MPS |
| Rough-cut capacity planning (RCCP) | Controle van de MPS op belangrijke resources met behulp van bills of resources |
| S&OE | Sales and operations execution: wekelijks proces om het S&OP-plan op korte termijn uit te voeren |
| Sales and operations planning (S&OP) | Maandelijks cross-functioneel proces om vraag- en aanbodplannen per familie te integreren, in stuks en in dollars [1] |
| Scheduled receipt | Open productie- of inkooporder met een vervaldatum |
| Tracking signal | Cumulatieve prognosefout gedeeld door MAD; geeft bias aan |

## FAQ: verkoop- en operationsplanning en MRP

### Wat is verkoop- en operationsplanning in eenvoudige bewoordingen?

S&OP is een maandelijkse vergadercyclus waarin verkoop, operations, supply chain en finance één plan afspreken voor wat het bedrijf de komende 18 tot 36 maanden gaat verkopen, produceren en op voorraad houden, per productfamilie [1][5]. Het managementteam gebruikt het om afwegingen te maken, bijvoorbeeld het toevoegen van een ploeg of het opbouwen van voorraad vóór een stilstand.

### Wat zijn de stappen van het S&OP-proces?

De gangbare vijf stappen zijn gegevensverzameling, vraagreview, aanbodreview, pre-S&OP (afstemming) en de S&OP-vergadering van het management [1][20]. Sommige bedrijven voegen aan het begin een product- of portfolioreview toe; Anaplan noemt bijvoorbeeld productreview, vraagreview, aanbodreview, financiële review, pre-S&OP en de reviews van het management [15].

### Hoe vaak moet S&OP worden uitgevoerd?

Maandelijks, volgens een vaste kalender [1][5]; Anaplan beschrijft bijvoorbeeld maandelijkse cycli met wekelijkse contactmomenten voor de belangrijkste deelnemers [15]. Een wekelijkse S&OE-vergadering behandelt kortetermijnwijzigingen tussen de cycli, en grote gebeurtenissen (een grote order, een storing in een fabriek) kunnen een extra review veroorzaken.

### Wie moet bij de S&OP-vergadering van het management aanwezig zijn?

De algemeen directeur of de directeur van de business unit als voorzitter, plus de hoofden van verkoop, marketing, operations, supply chain en finance, en productmanagement of engineering wanneer portfoliobeslissingen op de agenda staan. De eigenaar van het S&OP-proces bereidt de vergadering voor en legt haar vast.

### Wat is het verschil tussen S&OP en IBP?

IBP breidt S&OP uit van het in balans brengen van vraag en aanbod naar het volledige bedrijfsplan, inclusief portfolio, strategie en financiën, met een horizon van minimaal 24 maanden [2]. Oliver Wight ontwikkelde S&OP in de jaren tachtig en bedacht de term IBP in het begin van de jaren 2000 [2].

### Wat is het verschil tussen S&OP en MRP?

S&OP bepaalt volumes per productfamilie en per maand over de functies heen. MRP berekent voor elk component hoeveel er ingekocht of geproduceerd moet worden en wanneer, op basis van het hoofdproductieplan, stuklijsten en voorraad [7]. S&OP stelt het kader; MRP voert het uit op onderdeelniveau.

### Wat is het verschil tussen MPS en MRP?

Het MPS plant eindproducten (of planningsitems) per week; MRP explodeert het MPS via de stuklijsten om componenten en materialen te plannen [7]. Beide gebruiken dezelfde netting-logica, maar het MPS wordt vastgesteld door een hoofdplanner en MRP wordt door het systeem berekend.

### Hoe werkt MRP?

Per item, niveau voor niveau: neem de bruto behoeften, trek de beschikbare voorraad en geplande ontvangsten af, pas veiligheidsvoorraad toe om netto behoeften te krijgen, bepaal de partijgrootte, verschuif met de doorlooptijd naar geplande orderreleases en geef die door als bruto behoeften van de componenten [8]. Sectie 10 toont een volledig uitgewerkt voorbeeld.

### Wat zijn de invoergegevens van MRP?

Het hoofdproductieplan, de stuklijsten, de voorraadgegevens (beschikbaar, veiligheidsvoorraad), openstaande orders (geplande ontvangsten) en planningsgegevens per item (doorlooptijden, partijgrootteregels) [7][8].

### Wat is het verschil tussen MRP en MRP II?

MRP berekent materiaalbehoeften. MRP II, in 1983 gedefinieerd door Oliver Wight, voegt S&OP, hoofdplanning, grove en gedetailleerde capaciteitsplanning, werkplaatsbesturing en de koppeling met financiële planning toe [3].

### Wat is het verschil tussen MRP en ERP?

MRP is een planningsmethode en een ERP-module. ERP is een geïntegreerd systeem voor financiën, verkoop, inkoop, HR en productie, met MRP als planningskern voor materialen. Gartner bedacht de term ERP in 1990 [4].

### Wat is DDMRP?

Demand driven MRP plaatst voorraadbuffers op geselecteerde ontkoppelpunten, bepaalt de omvang ervan in rode, gele en groene zones op basis van gemiddeld dagelijks gebruik en doorlooptijd, en vult ze aan met de netto-stroomvergelijking (beschikbaar + besteld − gekwalificeerde vraag) [11][12][14]. Het is bedoeld om de afhankelijkheid van prognoses en de onrust van klassieke MRP te verminderen; onafhankelijk bewijs over de resultaten is nog beperkt.

### Wat is available to promise?

ATP is het deel van het geplande aanbod dat nog niet is toegezegd aan klantorders en aan nieuwe orders kan worden beloofd. In het voorbeeld in Sectie 8 kan een klant die in week 2 100 stuks vraagt, er direct 60 krijgen en de rest uit week 4.

### Welke KPI's meten het succes van S&OP?

Prognosenauwkeurigheid (1 − WMAPE) en bias op familieniveau, realisatie van het aanbodplan, naleving van het MPS, klantenservice (OTIF of leverbetrouwbaarheid), voorraad of achterstand ten opzichte van de doelstelling, en het afsluitpercentage van beslissingen. Sectie 16 geeft formules en een uitgewerkt voorbeeld.

### Hoe bereken je de prognosenauwkeurigheid?

Een gangbare formule is 1 − WMAPE, waarbij WMAPE = Σ|prognose − werkelijk| / Σ werkelijk. Met absolute fouten van 1.350 stuks bij een werkelijke vraag van 21.550 bedraagt de WMAPE 6,26% en de prognosenauwkeurigheid 93,7%. Rapporteer altijd de bias naast deze cijfers.

### Waarom mislukken S&OP-processen?

De gebruikelijke oorzaken zijn ontbrekende deelname van de directie, een prognose die in feite een verkoopdoelstelling is, geen betrokkenheid van financiën, te veel detail (SKU's in plaats van productfamilies), geen koppeling met de MPS, en software aanschaffen voordat het proces werkt. Sectie 18 somt de oplossingen op.

### Kan een kleine maker S&OP doen zonder speciale software?

Ja. Een bedrijf met enkele productfamilies kan S&OP draaien met ERP-extracten, Excel en een gedeeld besluitenlogboek. Software wordt pas zinvol wanneer het afstemmen tussen families en SKU's, scenario's of het voorbereiden van data meer tijd kost dan de besluiten zelf.

### Wat is MRP-nervositeit?

Nervositeit is de neiging van MRP-plannen om vaak te veranderen wanneer de invoer net iets wijzigt. In het voorbeeld in Sectie 12 veranderden 30 extra bureaus de orders op twee lagere stuklijstniveaus. Tijdvensters, vaste geplande orders en regels voor wijzigingskosten verminderen dit [10].

### Wat zijn de voordelen van S&OP?

S&OP vervangt afzonderlijke verkoop-, productie- en financiële cijfers door één overeengekomen plan per productfamilie. Beslissingen die kosten van de ene functie naar de andere verschuiven, zoals een tweede shift, een voorbouw of het schrappen van een variant, worden genomen door de mensen die zowel de kosten als het voordeel beheren (Sectie 1). De MPS en MRP ontvangen een plan dat al is getoetst aan de capaciteit, waardoor later minder orders versneld hoeven te worden. Financiën ziet het effect op het werkkapitaal voordat het zich voordoet: in het illustratieve voorbeeld in Sectie 16 heeft het hybride plan gemiddeld ongeveer 380 bureaus minder op voorraad dan het gelijkmatige plan, wat neerkomt op ongeveer $13.800 per jaar aan voorraadkosten. Gepubliceerde batenpercentages van leveranciers en enquêtes lopen sterk uiteen, dus meet je eigen uitgangssituatie voordat de eerste cyclus start.

### Wat zijn de outputs van MRP?

Voor elk geproduceerd en ingekocht artikel levert MRP tijdsgefaseerde geplande orderontvangsten en geplande orderreleases, verschoven met de doorlooptijd [8]. Daarnaast levert het uitzonderingsmeldingen voor openstaande orders (vrijgeven, eerder inplannen, later plannen, annuleren, over tijd, onder veiligheidsvoorraad) en pegging, die elke behoefte koppelt aan het bovenliggende artikel en de klantorder. Sectie 10 toont alle drie met een uitgewerkt voorbeeld.

### Wat is het verschil tussen MRP en JIT?

MRP is een plancalculatie: het splitst de hoofdproductieplanning door de stuklijsten en maakt gedateerde orders aan voordat de behoefte ontstaat. Just-in-time (JIT) is een lean-productiebenadering die aanvult op basis van het werkelijke verbruik, meestal met kanban-signalen, en gericht is op kleine partijen en lage voorraad. De twee sluiten elkaar niet uit. Veel fabrieken gebruiken MRP voor onderdelen met lange levertijden, hoge kosten en onregelmatige vraag, en kanban voor snel lopende onderdelen aan de lijn (Sectie 10). De [gids over kanban en pull-systemen](https://www.m365.fm/en/learn/kanban-pull-system/) behandelt de pull-kant.

## Conclusie en eerste stappen

Sales and operations planning (S&OP) en MRP lossen hetzelfde probleem op, maar op twee niveaus. S&OP laat het leidinggevend team eens per maand beslissen hoeveel per productfamilie wordt verkocht, geproduceerd en op voorraad gehouden, en wat dat kost. Het master production schedule (MPS) vertaalt die beslissing naar eindproducten per week, rough-cut capacity planning (RCCP) toetst die aan de bottleneck, en MRP berekent wat elk onderdeel nodig heeft en wanneer. Elk niveau heeft het niveau erboven nodig om realistisch te zijn en het niveau eronder om uitgevoerd te worden. Detailplanning en de productievloer sluiten de keten af.

De methoden zijn oud (Orlicky formaliseerde MRP in 1964, Oliver Wight vormde S&OP in de jaren tachtig) en vormen nog steeds de ruggengraat van ERP-planning [2][3][4]. Hun zwakke punten zijn bekend: oneindige capaciteit, vaste doorlooptijden, nervositeit en afhankelijkheid van data. Time fences, RCCP, DDMRP-buffers en finite scheduling pakken die aan. AI-tools kunnen forecasting en scenarioanalyses versnellen, maar alleen waar het proces, de data en de beslissingsbevoegdheden al op orde zijn.

**Uw eerste stappen in de komende 30 dagen**

- [ ] Definieer 5–15 productfamilies en 3–8 kritieke resources met hun aangetoonde maandelijkse capaciteit
- [ ] Haal 24 maanden aan verzendingen en orders per familie op en meet de forecastnauwkeurigheid (1 − WMAPE) en bias over de afgelopen 6 maanden
- [ ] Controleer of de som van uw MPS per familie overeenkomt met uw huidige verkoop- en productieplan
- [ ] Draai uw MRP en tel het aantal over tijd gelopen geplande orders en exceptieberichten per planner; dat is uw nulmeting voor nervositeit
- [ ] Audit de voorraadnauwkeurigheid voor de top 50 artikelen op waarde en de BOM-nauwkeurigheid voor de top 10 eindproducten
- [ ] Plan de vijf-stappen S&OP-kalender voor de komende 12 maanden in en wijs een executive sponsor en een procesverantwoordelijke aan
- [ ] Voer de eerste cyclus uit in spreadsheets met de sjablonen uit Sectie 15, en start het beslissingslogboek in de eerste directievergadering

---

## Verder lezen op m365.fm

**Gidsen in dit leertraject**
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/): detailplanning, zwakke punten van MRP, lead time syndrome, finite capacity
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/): pull, heijunka, kanban als alternatief voor push-planning
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/): OEE, leveringstrouwheid, voorraadmaatstaven
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/): scenariotests voor capaciteitsbeslissingen
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/): integratie van ERP, MES en dataplatform
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/): planning in engineer-to-order- en lange-doorlooptijdomgevingen
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/): bottlenecks en drum-buffer-rope
- [Kanban and Pull Systems](https://www.m365.fm/en/learn/kanban-pull-system/)
- [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)

**Verdiepingen**
- [Lot Sizing: EOQ, EPQ and MRP Lot-Sizing Rules](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Manufacturing Inventory Management and Safety Stock](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)
- [Intralogistics and In-Plant Material Flow](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Supply Chain Resilience](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/)
- [Manufacturing Simulation](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is de host van m365.fm en werkt bij iFAKT GmbH. Op m365.fm schrijft hij over lean manufacturing, productieplanning en de digitale transformatie van de productie, met de nadruk op hoe planningsprocessen, waardestroommodellen, simulatie en KPI-analyse in de praktijk samenwerken.

**Opmerking: De auteur werkt bij iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026. Sources marked "via sibling pillar" were opened and verified on the same date for the m365.fm guide on production scheduling and APS or the Azure for manufacturing guide and are reused with their verified bibliographic data.

1. Sales and operations planning (history incl. aggregate production planning and Richard "Dick" Ling; definitions; five process steps after Wagner et al. 2014; tactical horizon up to 18 months; maturity models after Grimson and Pyke 2007 and Wagner et al. 2014; enablers and barriers). Wikipedia. https://en.wikipedia.org/wiki/Sales_and_operations_planning
2. What Is the Difference Between S&OP and IBP? Oliver Wight Americas (blog). https://www.oliverwight-americas.com/blog/difference-between-sop-and-ibp/
3. Material requirements planning (Rolls-Royce and GE in the early 1950s; Orlicky 1964; Black & Decker 1964 with Dick Alban; about 700 users by 1975 and about 8,000 by 1981; Oliver Wight's MRP II 1983). Wikipedia. https://en.wikipedia.org/wiki/Material_requirements_planning
4. Material requirements planning (MRP), definition and history (Harris 1913; Orlicky at IBM 1964; Plossl and Wight 1967; Orlicky's book 1975; Wight's MRP II 1983; Gartner coins ERP 1990; third edition by Ptak and Smith 2011 with DDMRP; re-checked in review round 3). TechTarget. https://www.techtarget.com/searcherp/definition/material-requirements-planning-MRP
5. What is sales and operations planning (S&OP)? (monthly cadence, rolling 18–36 month horizon; page within SAP's Integrated Business Planning section). SAP. https://www.sap.com/resources/sop-sales-and-operations-planning and https://www.sap.com/products/scm/integrated-business-planning/what-is-supply-chain-planning/sop-sales-operations.html
6. Sales and Operations Planning (S&OP): Process, Challenges, and Expert Tips (18–36 month horizon; level, chase and mixed strategies). Smartsheet. https://www.smartsheet.com/sales-operations-planning-101
7. Master Production Scheduling and Material Requirements Planning (definitions of MPS and MRP; ATP and cumulative ATP as outputs). Oracle JD Edwards EnterpriseOne Applications Requirements Planning Implementation Guide, release 9.2. https://docs.oracle.com/en/applications/jd-edwards/supply-chain-manufacturing/9.2/eoarp/master-production-scheduling-and-material-requirements-planning.html
8. Gershwin, Stanley B.: Material Requirements Planning (MRP) and MRP II, lecture slides, MIT 2.854 Introduction to Manufacturing Systems, Fall 2016 (based on Hopp and Spearman, Factory Physics). MIT OpenCourseWare. https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/4eec617bb52d64f4ea1bed6d9905bc00_MIT2_854F16_MatrialRequire.pdf
9. Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337 (via sibling pillar)
10. Blackburn, Joseph D.; Kropp, Dean H.; Millen, Robert A.: A Comparison of Strategies to Dampen Nervousness in MRP Systems. Management Science 32 (1986) 4, pp. 413–429. DOI: 10.1287/mnsc.32.4.413. Record: https://ideas.repec.org/a/inm/ormnsc/v32y1986i4p413-429.html
11. Demand Driven Material Requirements Planning (DDMRP) overview. Dynamics 365 Supply Chain Management, Microsoft Learn. https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/ddmrp-overview
12. Buffer profile and levels (DDMRP zone formulas, lead time and variability factor ranges, worked example). Dynamics 365 Supply Chain Management, Microsoft Learn. https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/ddmrp-buffer-profile-and-levels
13. Orlicky, Joseph: Material Requirements Planning. The New Way of Life in Production and Inventory Management. McGraw-Hill, New York 1975. (via sibling pillar; original not consulted)
14. The five steps of DDMRP (net flow equation, buffer zones). IFS blog. https://blog.ifs.com/the-five-steps-of-ddmrp/ ; DDMRP in IFS Cloud documentation: https://docs.ifs.com/ifsclouddocs/24r2/Planning/AboutDDMRP.htm
15. The ultimate guide to the sales and operations planning (S&OP) process (six reviews; deployment guidance of 8–12 weeks). Anaplan (vendor), July 24, 2023. https://anaplan.com/blog/the-myths-of-sop
16. What is sales and operations planning (S&OP)? (traditional monthly cycle with five stages; concurrent planning, vendor claim). Kinaxis (vendor), published January 6, 2023, modified December 3, 2025. https://www.kinaxis.com/en/sop
17. Supply Chain S&OP: Process Improvement (five levels of S&OP maturity). Gartner. https://www.gartner.com/en/supply-chain/trends/supply-chain-sop
18. The 5 S&OP maturity levels (secondary description of the Gartner S&OP maturity model). Jedox (planning software vendor). https://jedox.com/en/blog/5-sop-maturity-levels
19. Grimson, J. Andrew; Pyke, David F.: Sales and operations planning: an exploratory study and framework. The International Journal of Logistics Management 18 (2007) 3, pp. 322–346. DOI: 10.1108/09574090710835093 (bibliographic data confirmed via Crossref, November 20, 2026; full text not consulted)
20. Wagner, Stephan M.; Ullrich, Kristoph K. R.; Transchel, Sandra: The game plan for aligning the organization. Business Horizons 57 (2014) 2, pp. 189–201. DOI: 10.1016/j.bushor.2013.11.002 (bibliographic data confirmed via Crossref, November 20, 2026; full text not consulted)
21. Oliva, Rogelio; Watson, Noel: Cross-functional alignment in supply chain planning: A case study of sales and operations planning. Journal of Operations Management 29 (2011) 5, pp. 434–448. DOI: 10.1016/j.jom.2010.11.012 (bibliographic data confirmed via Crossref, November 20, 2026; key finding via Wikipedia [1]; full text not consulted)
22. Tavares Thomé, António Márcio; Scavarda, Luiz Felipe; Fernandez, Nicole Suclla; Scavarda, Annibal José: Sales and operations planning: A research synthesis. International Journal of Production Economics 138 (2012) 1, pp. 1–13. DOI: 10.1016/j.ijpe.2011.11.027 (DOI resolution to Elsevier record S0925527311004907 confirmed; bibliographic data and author list confirmed via Crossref, November 20, 2026; full text not consulted)
23. Tavares Thomé, António Márcio; Scavarda, Luiz Felipe; Fernandez, Nicole Suclla; Scavarda, Annibal José: Sales and operations planning and the firm performance. International Journal of Productivity and Performance Management 61 (2012) 4, pp. 359–381. DOI: 10.1108/17410401211212643 (bibliographic data and author list confirmed via Crossref, November 20, 2026; full text not consulted)
24. ASCM (Association for Supply Chain Management): APICS Certified in Planning and Inventory Management (CPIM), 2026 certification brochure. https://www.ascm.org/globalassets/ascm_website_assets/docs/credentials/2026-certification_brochures_cpim.pdf (via sibling pillar)
25. ANSI/ISA-95.00.03-2013: Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management. International Society of Automation, preview. https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf (via sibling pillar)
26. Thürer, Matthias; Fernandes, Nuno O.; Haeussler, Stefan; Stevenson, Mark: Dynamic planned lead times in production planning and control systems: does the lead time syndrome matter? International Journal of Production Research 61 (2023) 4, pp. 1268–1282. DOI: 10.1080/00207543.2022.2034193 (via sibling pillar)
27. What is material requirements planning (MRP)? (MRP vs. ERP; FAQ topics incl. MRP II, MPS, DDMRP, predictive MRP, APS). SAP. https://www.sap.com/products/erp/what-is-mrp.html
28. Material requirements planning (MRP) in manufacturing: A complete guide (cites Oliver Wight/APICS Class A benchmarks without link). Zoho Inventory Academy. https://www.zoho.com/inventory/academy/inventory-management/what-is-materials-requirement-planning-mrp-in-manufacturing.html
29. Best S&OP Software in 2026: Sales & Operations Planning Buyer's Guide (vendor list; written by Board, one of the listed vendors). Board International. https://www.board.com/guide/best-sop-software
30. Kinaxis Inc.: New Research Finds 83% of Supply Chains Can't Respond to Disruptions in 24 Hours (IDC research commissioned by Kinaxis), press release, April 16, 2024. https://investors.kinaxis.com/news-releases/news-release-details/2024/New-Research-Finds-83-of-Supply-Chains-Cant-Respond-to-Disruptions-in-24-Hours (via sibling pillar)
31. What is Microsoft for Manufacturing? Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/overview (via sibling pillar)
32. Link your Dataverse environment to Microsoft Fabric. Power Apps, Microsoft Learn. https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-view-in-fabric (via sibling pillar)
33. Overview of Sales and Operations Planning. Oracle Fusion Cloud SCM documentation. https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/23d/fasop/overview-of-sales-and-operations-planning.html (existence of the product confirmed from the documentation title in search results; page content not fetched)
34. Kristensen, Jesper; Jonsson, Patrik: Context-based sales and operations planning (S&OP) research: A literature review and future agenda. International Journal of Physical Distribution & Logistics Management 48 (2018) 1, pp. 19–46. DOI: 10.1108/IJPDLM-11-2017-0352. https://www.emerald.com/insight/content/doi/10.1108/IJPDLM-11-2017-0352/full/html
35. About the Demand Driven Institute (founded in 2011 by Carol Ptak and Chad Smith; software compliance certification free of charge to vendors; professional endorsement certificates). Demand Driven Institute. https://demanddriveninstitute.com/about-us (accessed November 20, 2026)
36. Measuring Forecast Accuracy: Approaches to Forecasting: A Tutorial (tracking signal rule of thumb: between −4 and 4). Supply Chain Resource Cooperative, NC State University, January 25, 2011. https://scm.ncsu.edu/scm-articles/article/measuring-forecast-accuracy-approaches-to-forecasting-a-tutorial (accessed November 20, 2026)
37. World Class Master Scheduling: Best Practices and Lean Six Sigma Continuous Improvement, section "Data accuracy" (inventory record accuracy 95% acceptable, 98% robust; BOM accuracy 98% minimum, 99+% good). Excerpt on GlobalSpec Engineering360. https://www.globalspec.com/reference/47612/203279/data-accuracy (accessed November 20, 2026; author and publisher not shown on the excerpt page)
