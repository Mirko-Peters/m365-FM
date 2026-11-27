# SEO metadata

| Field | Value |
|---|---|
| Meta title | Shopfloor-management & gemba-wandelingen: een praktische gids |
| Meta description | Shopfloor-management uitgelegd: tierbesprekingen, SQDCP-borden, KPI's, een checklist voor de gemba-wandeling, een uitrolplan en een digitaal bord in Microsoft 365. |
| Slug | `shop-floor-management` |

# Shopfloor-management en gemba-wandelingen: de complete gids om te leiden waar het werk gebeurt

*Laatst bijgewerkt: 20 november 2026 · Microsoftgegevens geverifieerd op Microsoft Learn op deze datum*

> **Kort antwoord:** Shop floor management (ook geschreven als shopfloor management, vaak aangeduid als dagelijks managementsysteem of getrapt management) is een leiderschapssysteem waarin managers leiding geven aan de activiteiten waar waarde daadwerkelijk wordt gecreëerd: op de productievloer, in het magazijn of in het laboratorium. Het combineert leidinggevenden die aanwezig zijn op de gemba (de "echte plek"), visuele KPI's op een shopfloorbord, korte dagelijkse tierbesprekingen die problemen omhoog in de organisatie doorgeven, en gestructureerde probleemoplossing, zodat afwijkingen elke dag worden opgemerkt en blijvend worden verholpen. De gemba-wandeling is de leiderschapsroutine in de kern.

Bijna elke maakonderneming heeft ergens een whiteboard met cijfers erop. Peter Gelbrich, geciteerd door het Duitse opleidingsinstituut CETPM, schat op basis van bedrijfsbezoeken dat ongeveer 80 procent van de maakbedrijven een of andere visuele shopfloor-managementtool heeft [3]. De echte vraag is dus niet meer of je een bord hebt, maar of het werkt. Worden afwijkingen binnen uren in plaats van weken afgehandeld? Komen leidinggevenden naar de gemba met vragen of met antwoorden? En bereiken problemen die het team niet betrouwbaar kan oplossen op dezelfde dag het volgende niveau?

Deze gids legt de oorsprong en principes uit, beschrijft elk element in detail en geeft je een tierbesprekingsmatrix, een indeling van het bord, een gemba-wandelgids met checklist, leader standard work, een uitrolroutekaart en een referentiearchitectuur voor een digitaal shopfloorbord gebouwd met Microsoft Teams, Power BI, Power Apps en Microsoft Fabric. Veel van het onderzoek naar shop floor management komt uit Duitsland, waar de term "Shopfloor Management" standaardvocabulaire is in fabrieken; deze gids gebruikt die bronnen waar ze waarde toevoegen en legt de context uit voor Amerikaanse lezers. Een beknopte definitie is ook beschikbaar op de entiteitspagina [Shop floor management](https://www.m365.fm/entity/shop-floor-management/).

### Belangrijkste punten

- Shop floor management is een leiderschapssysteem, geen bord en geen software. Het bestaat uit leidinggevenden die aanwezig zijn op de vloer, visueel management, een paar KPI's, een vast vergaderritme, probleemoplossing en standaarden.
- Tierbesprekingen op teamniveau duren 10 tot 15 minuten en zijn gestaffeld, zodat een probleem uit de eerste ploeg dezelfde dag de fabrieksmanager bereikt.
- Een bord moet vier tot zes KPI's bevatten die het team daadwerkelijk kan beïnvloeden, meestal geordend volgens SQDCP (safety, quality, delivery, cost, people).
- De gemba-wandeling is de centrale leiderschapsroutine: ze heeft een onderwerp, berust op observatie en open vragen, en eindigt altijd met opvolging.
- Een actie wordt pas gesloten wanneer het effect zichtbaar is in de KPI en de standaard is bijgewerkt.
- Eerst routine, dan digitaal. Een digitaal bord in Microsoft 365 is een gereedschapskist; licenties, vernieuwingsintervallen, datadesign en regels voor monitoring van medewerkers bepalen de inspanning.

### Leesroutes voor drukke lezers

| Je bent een … | Lees eerst |
|---|---|
| Teamleider, supervisor of ploegleider | Hoofdstuk 5 (tierbesprekingen), 6 (bord), 9 (gemba-wandeling), 10 (leader standard work) |
| Fabrieksmanager of vicepresident operations | Hoofdstuk 3 (voordelen), 13 (cultuur en regels voor monitoring van medewerkers), 14 (uitrol), 15 (veelgemaakte fouten) |
| Microsoft 365- of Azure-beheerder | Hoofdstuk 16 (analoog of digitaal), 17 (Microsoft 365 inclusief het bouwplan), 18 (dataintegratie) |
| Lean-coach, CI-manager of projectleider | Hoofdstuk 4 (elementen), 8 (probleemoplossing), 14 (routekaart met volwassenheidscheck) |

## Inhoudsopgave

1. [Wat is shop floor management? Definitie en reikwijdte](#wat-is-shop-floor-management-definitie-en-reikwijdte)
2. [Oorsprong: gemba, genchi genbutsu en het Toyota Productiesysteem](#oorsprong-gemba-genchi-genbutsu-en-het-toyota-productiesysteem)
3. [Doelen en voordelen](#doelen-en-voordelen)
4. [De zes elementen van shop floor management](#de-zes-elementen-van-shopfloor-management)
5. [Gelaagde overleggen: de dagelijkse cascade](#tier-overleg-de-dagelijkse-cascade)
6. [Het shop floor bord: structuur, velden en een voorbeeldindeling](#het-shop-floor-bord-structuur-velden-en-een-voorbeeldindeling)
7. [Shop floor KPI's: SQDCP-indicatoren kiezen die werken](#kpis-op-de-werkvloer-sqdcp-metrieken-kiezen-die-werken)
8. [Probleemoplossing op de werkvloer: van inperken tot standaard](#probleemoplossing-op-de-werkvloer-van-containment-tot-standaard)
9. [De gemba-wandeling: stappen, vragen en checklist](#de-gemba-wandeling-stappen-vragen-en-checklist)
10. [Standaardwerk voor leidinggevenden: leiderschap als routine](#leidinggevend-standaardwerk-leiderschap-als-routine)
11. [Andon: afwijkingen real-time zichtbaar maken](#andon-afwijkingen-direct-zichtbaar-maken)
12. [Rollen en verantwoordelijkheden](#rollen-en-verantwoordelijkheden)
13. [Cultuur, psychologische veiligheid en regels voor medewerkersmonitoring](#cultuur-psychologische-veiligheid-en-regels-voor-medewerkersmonitoring)
14. [Shop floor management implementeren: een stappenplan in zes fasen](#shop-floor-management-implementeren-een-zesfasen-stappenplan)
15. [Veelgemaakte fouten en hoe ze te verhelpen](#veelgemaakte-fouten-en-hoe-u-ze-oplost)
16. [Analoog of digitaal? Digitaal shop floor management vergeleken](#analoog-of-digitaal-digitaal-shopfloormanagement-vergeleken)
17. [Een digitaal shop floor bord bouwen met Microsoft 365](#een-digitaal-shopfloor-bord-bouwen-met-microsoft-365)
18. [Data-integratie: MES, ERP en machinedata](#gegevensintegratie-mes-erp-en-machinegegevens)
19. [Softwareondersteuning: het voorbeeld van iFAKT Polaris](#softwareondersteuning-het-voorbeeld-van-ifakt-polaris)
20. [Woordenlijst](#woordenlijst)
21. [Veelgestelde vragen: shop floor management en gemba-wandelingen](#faq-shop-floor-management-en-gemba-wandelingen)
22. [Conclusie](#conclusie)

## Wat is shop floor management? Definitie en reikwijdte

De term combineert "shop floor" (het productiegebied, meer in het algemeen de plek waar waarde wordt gecreëerd) en "management." In Amerikaanse fabrieken gaat dezelfde praktijk vaak onder andere namen, zoals daily management system, tiered accountability, tier meetings of huddle boards. Het onderliggende idee is hetzelfde.

Het Duitse Institut für angewandte Arbeitswissenschaft (ifaa, een onderzoeksinstituut voor industriële techniek en ergonomie) beschrijft shop floor management als leidinggeven op het punt waar waarde wordt gecreëerd: planning, sturing, verbetering en uitvoering samenbrengen op de werkvloer, zodat de kennis van de "experts ter plaatse" wordt benut [2]. De Duitse wetenschappelijke vereniging voor productietechnologie (WGP) noemt het een geïntegreerd managementsysteem voor de systematische ontwikkeling van processen en medewerkers op de werkvloer [4]. Remco Peters, wiens boek uit 2009 een standaardwerk is in de Duitstalige landen, benadrukt dat shop floor management "niet alleen een beheersinstrument is, maar een holistisch leiderschapsinstrument" [1][6].

Uit deze definities volgen drie kenmerken die echt shop floor management onderscheiden van een KPI-wand:

1. **Plaats:** Leidinggeven gebeurt waar waarde wordt gecreëerd, niet in de vergaderzaal.
2. **Ritme:** Communicatie is gepland, kort en gestandaardiseerd. Ze volgt een vaste cascade door de niveaus van de organisatie.
3. **Effect:** Elke afwijking leidt tot een actie met een eigenaar en een deadline, en het effect wordt gecontroleerd.

### Wat shop floor management niet is

In de praktijk wordt shop floor management vaak verward met verwante begrippen. In de VS wordt "shop floor management" vooral ook door ERP- en planningsleveranciers gebruikt voor shop floor control: werkorders vrijgeven, reeksen bepalen en voortgang volgen. De tabel hieronder scheidt de begrippen.

| Begrip | Waar het over gaat | Relatie tot shop floor management |
|---|---|---|
| Shop floor control / productiebesturing | Volgordebepaling, orderrelease, capaciteitsbalancering, volgen van werkorders | Een deeltaak; shop floor management gebruikt de resultaten ervan, maar is een leidinggevend systeem |
| MES (manufacturing execution system) | IT-systeem voor het registreren en besturen van de productie | Gegevensbron en hulpmiddel, niet het leidinggevende systeem zelf |
| Visueel management | Status en afwijkingen zichtbaar maken | Een onderdeel van shop floor management |
| Gemba walk | Een leidinggevende gaat naar de plek waar het werk gebeurt, observeert en stelt vragen | Een onderdeel en leidinggevende routine binnen shop floor management |
| Continue verbetering / kaizen | Verbetering in kleine, voortdurende stappen | Resultaat en drijfveer; shop floor management biedt het dagelijkse platform |
| Lean manufacturing | Overkoepelende filosofie om verspilling te elimineren | Het bredere raamwerk; shop floor management is het dagelijkse leidinggevende systeem ervan |

Voor het bredere raamwerk, zie de entiteitspagina [Lean management](https://www.m365.fm/entity/lean-management/) en het compendium van m365.fm [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/). In Duitsland wordt dit raamwerk vaak een "Ganzheitliches Produktionssystem" (holistisch productiesysteem) genoemd. De richtlijnenreeks VDI 2870 van de Vereniging Duitse Ingenieurs (VDI) beschrijft de grondslagen (deel 1, juli 2012) en een catalogus van methoden (deel 2, februari 2013). De VDI heeft beide delen geclassificeerd als deels herzieningsbehoeftig, en een nieuwe editie van deel 2 is in voorbereiding [27].

### Shop floor, office floor en andere gebieden

Shop floor management is begonnen in de productie, maar het is overdraagbaar naar elk gebied met terugkerend werk en een meetbaar resultaat: logistiek, onderhoud, laboratoria, ziekenhuisafdelingen, klantenservice, engineering. Voor indirecte gebieden is de term "office floor management" ingeburgerd [3]. De principes blijven gelijk; de KPI's veranderen. In plaats van output en uitval toont het bord bijvoorbeeld de doorlooptijd van dossiers, de op tijd vrijgegeven tekeningen of de achterstand aan tickets.

## Oorsprong: gemba, genchi genbutsu en het Toyota Productiesysteem

### Gemba: de "echte plek"

"Gemba" (soms gespeld als "genba") is Japans voor "de werkelijke plek". In lean betekent het de plek waar waardecreërend werk daadwerkelijk plaatsvindt, meestal de productievloer [7][8]. Nauw verwant is **genchi genbutsu**, ongeveer "echte plek, echt ding". De Lean Lexicon van het Lean Enterprise Institute (LEI) definieert het als naar de bron gaan om de feiten zelf te controleren [8]. Michael Ballé van LEI maakt het onderscheid zo: gemba is een plek, genchi genbutsu is een handeling [8].

Hoe centraal dit principe is voor Toyota blijkt uit "The Toyota Way 2001". In april 2001 presenteerde Toyota twee pijlers (continue verbetering en respect voor mensen) en vijf kernwaarden. Naast uitdaging, kaizen, respect en teamwork is genchi genbutsu uitdrukkelijk een van die waarden, vertaald als "ga naar de bron om de feiten te vinden" [9].

### Taiichi Ohno en de krijtcirkel

Taiichi Ohno (1912–1990) wordt beschouwd als de architect van het Toyota Productiesysteem; zijn boek "Toyota Production System: Beyond Large-Scale Production" verscheen in het Engels in 1988 bij Productivity Press [13]. Aan hem is een bekend verhaal verbonden: hij zou nieuwe ingenieurs in een op de productievloer met krijt getekende cirkel hebben geplaatst en hen uren laten kijken totdat ze de problemen in het proces echt zagen. Het verhaal is mogelijk opgesmukt [12], maar het vangt de kern: begrip komt voort uit observatie ter plaatse, niet uit rapporten.

### Masaaki Imai en "Gemba Kaizen"

Masaaki Imai maakte de term in het Westen bekend met zijn boek "Gemba Kaizen: A Commonsense, Low-Cost Approach to Management" (McGraw-Hill, 1997) [10]. De bijbehorende "gouden regels van gemba-management" luiden zoals samengevat door het Kaizen Institute [11]:

1. Wanneer zich een probleem voordoet, ga eerst naar de gemba.
2. Controleer de gembutsu (machine, gereedschap, materiaal, defect onderdeel).
3. Neem tijdelijke tegenmaatregelen ter plekke.
4. Vind de grondoorzaak.
5. Standaardiseer om herhaling te voorkomen.

Deze vijf stappen vormen nog steeds de blauwdruk voor probleemoplossing in shop floor management (zie sectie 8).

### Suzaki en de verspreiding van de term

Kiyoshi Suzaki wordt beschouwd als de grondlegger van de term "shop floor management" met zijn boek "The New Shop Floor Management: Empowering People for Continuous Improvement" (Free Press, 1993) [5]. Het Duitse opleidingsinstituut CETPM citeert Constantin May, die Suzaki de "vader van het shop floor management" noemt [3]. Suzaki voegde aan het leiderschap op de werkvloer goede communicatie tussen leidinggevenden en medewerkers toe, een organisatiebreed begrip van de klant, het vermogen om te leren en een eis van de hoogst mogelijke kwaliteit [1]. In de Duitstalige landen hebben Remco Peters (2009) [6] en het werk aan de Technische Universiteit Darmstadt (waaronder Hertle et al. over competentieontwikkeling in shop floor management [26]) de discussie gevormd. In de VS verspreidden dezelfde praktijken zich vooral onder de namen lean management system, daily management en leader standard work, met name via het boek "Creating a Lean Culture" van David Mann [19].

### Hoe wijdverbreid is het vandaag?

Volgens een studie uit 2018, aangehaald door WGP, had ongeveer 82,5 procent van de deelnemende bedrijven shop floor management ingevoerd, een stijging van ongeveer 20 procent ten opzichte van drie jaar eerder. Het werd vooral toegepast in de productie en aangrenzende gebieden, maar niet op alle niveaus van de hiërarchie [4]. WGP noemt de studie niet, dus steekproef en methode zijn niet te controleren. De bevinding wijst op een kernprobleem in veel fabrieken, dat in hoofdstuk 5 aan bod komt: een bord op teamniveau zonder werkende cascade erboven heeft weinig effect. Vergelijkbare representatieve Amerikaanse cijfers zijn in het onderzoek voor dit artikel niet gevonden.

## Doelen en voordelen

Shop floor management streeft vijf doelen na die van elkaar afhankelijk zijn:

| Doel | Wat er in de praktijk gebeurt | Gemeten door |
|---|---|---|
| Transparantie | Doel en werkelijkheid zijn in één oogopslag zichtbaar voor iedereen | Actualiteit van het bord, aandeel KPI's met een doel |
| Snelle reactie | Afwijkingen worden binnen één shift opgemerkt en afgehandeld | Tijd van afwijking tot actie, doorlooptijd escalatie |
| Duurzame probleemoplossing | Grondoorzaken worden weggenomen, niet de symptomen | Herhalingspercentage van dezelfde fout |
| Betrokkenheid van medewerkers | De kennis van de mensen die het werk doen vloeit in beslissingen mee | Aantal uitgevoerde ideeën, deelname aan korte overlegmomenten |
| Ontwikkeling van leidinggevenden | Leidinggevenden verschuiven van brandweerman naar coach | Aandeel uitgevoerde leader standard work, frequentie van gemba-wandelingen |

### Wat is het bewijs?

Solide, onafhankelijke cijfers over het voordeel van shop floor management zijn zeldzaam, omdat het effect moeilijk te scheiden is van andere lean-maatregelen. De gedocumenteerde voorbeelden zijn toch leerzaam:

- **fischer (Duitse maker van bevestigingsmiddelen, fischerwerke):** Na een project van negen maanden daalde het aantal klachten met 13 procent en de proceskosten met 9 procent; het aantal leveringen steeg met 11 procent, met dezelfde personeelsbezetting en op tijd [3].
- **Schinko (Oostenrijkse maker van plaatwerkbehuizingen):** Na de invoering van digitaal shop floor management steeg de productiviteit bij het snijden met 20 procent; bij het buigen, waar het systeem nieuwer was, bedroeg de stijging op het moment van het rapport 10 procent. Het artikel is geschreven door het marketinghoofd van de betrokken softwareleverancier, GFT, en moet dienovereenkomstig gelezen worden [42].
- **Onderzoek naar digitaal shop floor management:** De studie van het wbk Institute of Production Science aan het Karlsruhe Institute of Technology (KIT) en het IPRI-instituut in het ShopfloorPulse-project wijst erop dat bijna realtime digitale informatie de tijd tot het verhelpen van een storing aanzienlijk kan verkorten, terwijl analoge opvolging van acties afhangt van individuele discipline [24][25]. De studie is gebaseerd op 18 bedrijven en is daarom een kwalitatieve momentopname en geen representatief onderzoek.

Veel leverancierspagina's op google.com noemen veel grotere winsten (bijvoorbeeld 25 tot 35 procent meer productiviteit) zonder een bron te vermelden. Deze gids herhaalt dergelijke cijfers niet. De nuchtere conclusie: shop floor management is geen instrument met een gegarandeerd rendement, maar een leiderschapssysteem waarvan het effect afhangt van hoe consequent het wordt uitgevoerd. De volgende hoofdstukken laten zien waar die consequentie van afhangt.

## De zes elementen van shopfloor management

De literatuur structureert shopfloor management op verschillende manieren. ifaa onderscheidt vier zichtbare bouwstenen (visueel management, KPI's, standaardcommunicatie, systematisch probleemoplossen) en drie "onzichtbare" fundamenten (werkprincipes, begrip van rollen, duurzaamheid) [2]. Peters identificeerde vier kernelementen: leidinggeven op locatie, afwijkingen herkennen, problemen duurzaam oplossen en middelen optimaal inzetten [1]. WGP noemt stabiliteit en standaardisatie als voorwaarden, en prestatiemanagement, probleemoplossing en verbetermanagement, leidinggeven op locatie, visueel management en competentieontwikkeling als managementelementen [4]. Veel Amerikaanse pagina's noemen doorgaans vijf "pijlers" met vergelijkbare inhoud.

Het volgende model brengt deze opvattingen samen en heeft zich in de praktijk bewezen:

| Element | Kernvraag | Belangrijkste hulpmiddelen |
|---|---|---|
| 1. Leidinggevenden aanwezig op de vloer | Zien leidinggevenden de werkelijkheid zelf? | Gemba-walk, standaardwerk voor leidinggevenden |
| 2. Visueel management | Kan iedereen in seconden zien of het volgens plan verloopt? | Shopfloorbord, andon, 5S, statuslampen |
| 3. KPI's | Meten we wat het team kan beïnvloeden? | SQDCP, OEE, first pass yield |
| 4. Overlegritme (gelaagde communicatie) | Stroomt informatie elke dag betrouwbaar omhoog en omlaag? | Tier-overleggen, escalatieregels |
| 5. Probleemoplossing | Worden grondoorzaken definitief weggenomen? | PDCA, 5 Whys, visgraatdiagram (Ishikawa), A3 |
| 6. Standaardisatie | Is wat we geleerd hebben vastgelegd? | Standaardwerk, werkinstructies |

### Element 1: Leidinggevenden aanwezig op de vloer

LEI beschrijft de gemba-mindset als volgt: je gaat naar de gemba om het werk te begrijpen, om leiding te geven en om te leren [15]. Fujio Cho, voormalig president en later voorzitter van Toyota, vatte de houding van lean-leidinggevenden samen in drie imperatieven: "Ga kijken, vraag waarom, toon respect" [15]. Aanwezigheid betekent niet controleren; het betekent bereikbaar zijn en interesse tonen. Hoofdstuk 9 beschrijft in detail hoe aanwezigheid eruitziet als gemba-walk.

### Element 2: Visueel management

LEI definieert visueel management als het zichtbaar plaatsen van alle hulpmiddelen, onderdelen, productieactiviteiten en prestatie-indicatoren "in volledig zicht", zodat de status van het systeem door iedereen die erbij betrokken is in één oogopslag begrepen kan worden [20]. Visueel management is dus veel meer dan het bord: vloermarkeringen, schaduwborden, kanbankaarten, andonlampen en statuslampen op machines maken er allemaal deel van uit. [5S](https://www.m365.fm/entity/5s/) vormt vaak de basis, omdat afwijkingen alleen opvallen in een geordende omgeving. Meer: [Visueel management](https://www.m365.fm/entity/visual-management/).

### Element 3: KPI's

KPI's maken afwijkingen objectief. Ze moeten aan drie criteria voldoen: het team kan ze beïnvloeden, ze zijn tijdig beschikbaar, en ze hebben een doelwaarde. Hoofdstuk 7 behandelt hoe je ze kiest. De basis staat op de entiteitspagina [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) en in het compendium [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/).

### Element 4: Overlegritme

Het overlegritme (Duitse bronnen noemen het "Regelkommunikation", standaardcommunicatie) betekent korte, ingeplande, gestandaardiseerde overleggen bij het bord. Het kenmerkende is de cascade: informatie en problemen stromen van teamniveau via afdelingsniveau naar fabrieksniveau, en ondersteuning en beslissingen stromen terug [3][58]. Hoofdstuk 5 biedt een volledige matrix.

### Element 5: Probleemoplossing

Zonder probleemoplossing verwordt shopfloor management tot een rapportagesessie. Wat telt, is het scheiden van snelle indamming en het duurzaam wegnemen van grondoorzaken. Hoofdstuk 8 beschrijft het pad van een rode stip op het bord naar een bijgewerkte standaard.

### Element 6: Standaardisatie

Standaarden zijn zowel voorwaarde als resultaat. Zonder standaard is er geen afwijking, en zonder het bijwerken van de standaard gaat elke verbetering weer verloren. WGP noemt stabiliteit en standaardisatie daarom expliciet als voorwaarden [4]. Meer: [Standaardwerk](https://www.m365.fm/entity/standard-work/).

## Tier-overleg: de dagelijkse cascade

> **Kort samengevat:** Elk niveau komt kort bijeen bij zijn bord, lost op wat het kan en geeft de rest dezelfde dag door aan het volgende niveau. Dat vraagt vaste vergadertijden, duidelijke escalatiecriteria en een plicht om te reageren.

Tier-overleggen (ook wel tiered meetings, tier meetings, tiered huddles, stand-ups of dagelijkse verantwoordingsoverleggen genoemd) vormen de ruggengraat van het vergaderritme. Het idee: elk niveau komt kort bijeen, bespreekt zijn KPI's, lost op wat het kan en escaleert de rest naar het volgende niveau, dat een tikje later vergadert. Het Kaizen Institute beschrijft de gebruikelijke Amerikaanse structuur als vier niveaus, van frontlineteams (tier 1) via supervisors (tier 2) en afdelingsmanagers (tier 3) tot de plantleiding (tier 4), waarbij problemen dezelfde dag worden doorgegeven aan een benoemde eigenaar [58]. CETPM beschrijft het klassieke ritme in Duitse fabrieken als dagelijks of per ploeg op teamniveau, wekelijks op afdelingsniveau en maandelijks of per kwartaal op fabrieksniveau [3]. In veel lean-fabrieken is een dagelijks overleg inmiddels ook gebruikelijk op tier 2 en tier 3, zodat een probleem uit de eerste ploeg de fabrieksdirecteur diezelfde ochtend bereikt. De ShopfloorPulse-studie beschrijft dezelfde structuur: overleggen stromen vanaf de werkvloer omhoog, in dagelijkse, wekelijkse of maandelijkse ritmes [25]. Meer over de term op de entiteitspagina [Tier meeting](https://www.m365.fm/entity/tier-meeting/).

### Hoe lang mag een tier-overleg duren?

Er zijn gedocumenteerde richtwaarden. Gelbrich noemt ongeveer 10 tot 12 minuten op operationeel niveau en 20 tot 30 minuten op managementniveau; Orth noemt 10, hooguit 20 minuten voor stand-upoverleggen in indirecte afdelingen; Schwarz noemt in zijn praktijkvoorbeeld maximaal 15 minuten, maar wijst erop dat vroege overleggen tijdens de uitrol vaak 30 minuten of meer duren [3]. Gelbrich rekent overleggen die te lang duren, vooral tijdens de uitrol, tot de tien meest voorkomende redenen waarom shopfloor management faalt [3].

### Tier-overlegmatrix (voorbeeldontwerp)

De volgende matrix is een voorbeeldontwerp voor een fabriek met ploegendiensten, gebaseerd op gangbare praktijk. Frequentie en duur volgen de hierboven genoemde gedocumenteerde richtwaarden; kloktijden en deelnemers zijn suggesties om aan te passen aan uw ploegenmodel en organisatie.

| Kenmerk | Tier 1: team | Tier 2: area / supervisor | Tier 3: afdeling / productiemanager | Tier 4: fabriek |
|---|---|---|---|---|
| Frequentie | elke ploeg, bij start van de ploeg | dagelijks | dagelijks (alternatief wekelijks) | dagelijks of wekelijks, plus een maandelijkse review |
| Tijd (voorbeeld: eerste ploeg start om 6:00) | 6:10 tot 6:30, gespreid per lijn | 8:30 | 9:15 | 10:00 |
| Duur | 10 tot 15 minuten | 15 minuten | 15 tot 20 minuten | 20 tot 30 minuten |
| Locatie | bord bij de lijn | areabord | afdelingsbord op de vloer | fabriekbord (obeya-ruimte of op de vloer) |
| Voorzitter | teamleider | supervisor / ploegleider | productie- of afdelingsmanager | fabrieksdirecteur |
| Deelnemers | team van de lijn of cel | teamleiders van de area, onderhoud en kwaliteit waar nodig | supervisors, vertegenwoordigers van kwaliteit, onderhoud, logistiek, EHS (milieu, gezondheid en veiligheid) | afdelingshoofden, ondersteunende functies (kwaliteit, supply chain, inkoop, HR, financiën) |
| Tijdshorizon | laatste ploeg, huidige ploeg | laatste 24 uur, vandaag | gisteren, vandaag, deze week | week, maand, trend |
| Typische KPI's | veiligheidsincidenten, stuks per uur doel versus werkelijk, uitval, stilstand, aanwezigheid | output, OEE van knelpunten, first pass yield, achterstand | levering op tijd, kwaliteitskosten, productiviteit, openstaande escalaties | SQDCP-overzicht fabriek, klachten van klanten, kosten, projectstatus |
| Beslissingen | bezetting, containment, ideeën | mensen herverdelen over lijnen, onderhoudsprioriteiten | middelen over areas, extra ploegen, probleemoplossende teams | kapitaalinvesteringen, prioriteiten, wijzigingen in doelen |
| Escaleer omhoog wanneer | het probleem niet binnen de ploeg is op te lossen of middelen ontbreken | het probleem meerdere lijnen raakt of een ondersteunende functie nodig heeft | het probleem klanten, budget of meerdere afdelingen raakt | corporate, klant, leverancier |

**Tweede en derde ploeg:** Tier 1 draait elke ploeg; tiers 2 tot en met 4 meestal alleen overdag. Zodat issues uit de tweede en derde ploeg niet verloren gaan, zet de ploegleider openstaande escalaties op het bord of in het ploegenlogboek en overdraagt ze persoonlijk aan de eerste ploeg. Het ochtendoverleg van tier 2 begint met deze punten.

### Escalatieregels die werken

Een cascade is maar zo goed als de escalatieregels eronder. Vier principes hebben zich bewezen:

1. **Duidelijke triggers in plaats van onderbuikgevoel.** Leg per KPI vast wanneer er geëscaleerd wordt, bijvoorbeeld: "lijn staat langer dan 30 minuten stil," "uitval boven de grens in twee opeenvolgende uren," "letsel of bijna-ongeval: altijd."
2. **Timing die op elkaar aansluit.** Het overleg op het hogere niveau vindt plaats na het overleg op het lagere niveau, zodat escalaties dezelfde dag aankomen. De facilitator van het lagere overleg geeft de escalatie persoonlijk of via het bord door.
3. **Plicht tot reageren.** Elke escalatie krijgt een antwoord, uiterlijk in het eerstvolgende overleg van het lagere niveau. Stilte is de snelste manier om een escalatiecultuur te vernietigen.
4. **Veiligheid gaat voor.** Veiligheidskwesties worden direct geëscaleerd, ongeacht de cascade.

CETPM beschrijft een gebrekkige schakel tussen de niveaus van shop floor management als een typisch struikelblok [3]. Dit sluit aan bij de studie van KIT en IPRI: wanneer acties op papier worden bijgehouden, faalt de escalatie naar hogere niveaus en hangt het bijhouden van acties af van "de discipline van individuen" [24].

### Standaardagenda voor een tier 1-overleg (maximaal 15 minuten)

De agenda houdt zich aan de bovengrens van 15 minuten. Goed ingespeelde teams doorlopen hem in 10 tot 12 minuten, het bereik dat Gelbrich voor het operationele niveau noemt [3].

| Minuut | Onderdeel | Leidende vraag |
|---|---|---|
| 0–2 | Veiligheid | Zijn er letsels, bijna-ongevallen of onveilige situaties? |
| 2–6 | KPI's gisteren / vorige shift | Waar staan we rood, en waarom? |
| 6–9 | Plan voor vandaag | Wat is het doel voor vandaag? Zijn er beperkingen qua mensen, materiaal, machines? |
| 9–12 | Acties | Welke openstaande acties zijn aan de beurt, wat is klaar, wat heeft hulp nodig? |
| 12–14 | Escalaties | Wat geven we door aan tier 2? |
| 14–15 | Afronding | Wie doet wat, en wanneer? Is er erkenning voor goed werk? |

Belangrijk: het tieroverleg benoemt problemen, wijst eigenaren aan en spreekt inperking af. Oorzaakanalyse vindt daarna plaats in een kleine groep, dicht bij de machine.

## Het shop floor-bord: structuur, velden en een voorbeeldindeling

> **Kort gezegd:** Een goed bord is leesbaar vanaf ongeveer 3 m, toont vier tot zes KPI's met doelen, volgt de overlegagenda van links naar rechts en koppelt elke rode KPI aan een actie. Het team onderhoudt het zelf.

Het shop floor-bord (ook wel huddle board, tierbord, SQDCP-bord of performancebord genoemd) is het centrale hulpmiddel van de overlegcyclus. ifaa beschrijft de taken als volgt: het visualiseert geselecteerde KPI's van een gebied, toont verbeteracties met hun status zodat hun effect op de KPI's te volgen is, en bevat dagelijkse stuurinformatie, vooral over de actuele order- en capaciteitssituatie [2]. Als voorbeeldcategorieën noemt ifaa kwaliteit, kosten, logistiek, veiligheid, personeel, capaciteit en ordersituatie, en doelen en acties (continu verbeteren); voorbeeld-KPI's zijn first pass yield, ppm-cijfers, OEE, levertrouw, ongevalscijfers, 5S-status en aanwezigheidspercentage [2].

### Ontwerpregels

- **Leesbaar vanaf ongeveer 3 m:** Rood/groen-status en grote cijfers, geen tabellen met 30 kolommen.
- **Vier tot zes KPI's:** CETPM adviseert ongeveer vier tot zes KPI's die het team kan beïnvloeden [3]; de Duitse opleider Haufe Akademie noemt vijf tot zeven als bovengrens [43].
- **Doel naast werkelijk:** Elke KPI heeft een doel en een trend.
- **Vertel het verhaal van links naar rechts:** Het bord volgt de overlegagenda, zodat de facilitator simpelweg van links naar rechts beweegt.
- **Acties zichtbaar:** Elke rode KPI is gekoppeld aan een actie of een probleemoplossingsblad.
- **Eigendom van het team:** Het team onderhoudt het bord zelf. Een bord dat door financiën of IT is ingevuld en dat niemand in het team begrijpt, wordt genegeerd.

### Voorbeeldindeling van een tier 1-bord

De volgende indeling toont een bord voor een montagelijn met drie rijen en vijf kolommen. Het werkt net zo goed op een whiteboard (ongeveer 2 × 1,2 m) als op een scherm.

| | Kolom A: Veiligheid (S) | Kolom B: Kwaliteit (Q) | Kolom C: Levering (D) | Kolom D: Kosten / productiviteit (C) | Kolom E: Mensen (P) |
|---|---|---|---|---|---|
| **Rij 1: status vandaag** | Veiligheidskruis (maandkalender, elke dag groen, geel of rood) | Uitval en herbewerking per shift vs. doel | Dagplanning doel vs. werkelijk, achterstand | Units per uur doel vs. werkelijk (grafiek uur voor uur) | Aanwezigheid, vaardighedenmatrix (wie kan wat) |
| **Rij 2: trend** | Bijna-ongevallen over de laatste 4 weken | First pass yield, de 3 belangrijkste defecttypen (Pareto) | Op-tijd levering deze week | OEE van de bottleneck, de 3 belangrijkste stilstandoorzaken, [micro stops](https://www.m365.fm/entity/micro-stops/) | Vakantie- en opleidingsplan |
| **Rij 3: acties** | Openstaande veiligheidsacties | Probleemoplossingsformulieren / A3's in behandeling | Escalaties naar tier 2 en reacties | Actielijst (wat, wie, wanneer, status) | Ideeën en suggesties met status |

De meeste borden hebben ook een kop met teamnaam, gebiedsdoel en tijdstip van de laatste update, plus een veld "standaarden en audits" (bijvoorbeeld het resultaat van de laatste 5S-audit). Opmerking over de kolomvolgorde: het Duitse origineel van deze gids gebruikt SQCDP, waarbij kosten voor levering komt; Amerikaanse fabrieken schrijven vaker SQDCP. De volgorde van C en D is minder belangrijk dan dat veiligheid op de eerste plaats staat.

### Bordinhoud per niveau

Naarmate het niveau stijgt, wordt het bord meer geaggregeerd en wordt de tijdshorizon langer. De MES-leverancier Symestic beschrijft dit als twee consistentieregels: KPI's worden naar boven toe samengevat en minder vaak besproken, maar ze moeten op elk niveau terug te voeren zijn op dezelfde gegevens [41].

| Niveau | Detail | Typische tijdshorizon | Kwaliteitsvoorbeeld |
|---|---|---|---|
| Tier 1 | station, uur | shift | defecten per uur bij station 3 |
| Tier 2 | lijn, shift | dag | uitvalpercentage per lijn |
| Tier 3 | gebied, dag | week | first pass yield en kosten van kwaliteit per gebied |
| Tier 4 | fabriek, week | maand | klachten van klanten in ppm, kosten van slechte kwaliteit |

## KPI's op de werkvloer: SQDCP-metrieken kiezen die werken

De meeste borden volgen een vaste volgorde van dimensies. De meest voorkomende is **SQDCP** (of SQCDP): veiligheid, kwaliteit, levering, kosten en mensen [41]. Varianten zijn SQDC (zonder P), SQDCM (M voor moraal) of SQDCE met milieu. CETPM noemt veiligheid, kwaliteit, kosten, betrouwbaarheid van levering en mensen als typische dimensies [3]. De volgorde is bewust gekozen: veiligheid staat altijd op de eerste plaats.

### Drie leidende vragen voor het kiezen van KPI's

Gelbrich stelt drie vragen voor waarmee geschikte KPI's kunnen worden afgeleid [3]:

1. Hoe moet de output van mijn proces eruitzien qua tijd en kwaliteit?
2. Hoe kan ik de efficiëntie van mijn acties laten zien qua kosten en middelen?
3. Wat weerspiegelt verantwoorde uitvoering van mijn proces qua veiligheid en milieu?

Zijn centrale principe, geformuleerd als een variant op een bekend citaat van Drucker: wat het team niet kan beïnvloeden, hoort niet op zijn bord gemeten te worden [3].

### KPI-catalogus voor het bord op de werkvloer

| Dimensie | KPI | Definitie / berekening | Tier |
|---|---|---|---|
| S | Dagen sinds laatste registreerbaar letsel | kalenderdagen sinds het laatste OSHA-registreerbare geval (zie opmerking hieronder) | 1–4 |
| S | Total recordable incident rate (TRIR) | aantal registreerbare letsels en ziekten × 200.000 / totaal gewerkte uren; 200.000 uur komt overeen met 100 fulltime werknemers voor een jaar [51] | 3–4 |
| S | Bijna-ongevallen (gemeld) | meldingen per week (meer meldingen zijn in het begin een goed teken) | 1–3 |
| Q | Uitvalpercentage | uitvalhoeveelheid / totale hoeveelheid; zie [uitvalpercentage](https://www.m365.fm/entity/scrap-rate/) | 1–3 |
| Q | First pass yield (FPY) | goede onderdelen bij de eerste doorloop / gestarte onderdelen | 1–3 |
| Q | Klachten van klanten | aantal of ppm | 3–4 |
| D | Units doel vs. werkelijk | per uur of per shift | 1–2 |
| D | Op-tijd levering | op tijd geleverde orders / alle orders | 2–4 |
| D | Achterstand | open hoeveelheid vs. planning | 1–3 |
| C | OEE | beschikbaarheid × prestatie × kwaliteit [22] | 1–3 |
| C | Productiviteit | goede onderdelen per arbeidsuur | 2–4 |
| C | Omsteltijd | tijd van het laatste goede onderdeel tot het eerste goede onderdeel van de volgende order | 1–2 |
| P | Aanwezigheid / bezetting | aanwezige / ingeplande medewerkers | 1–2 |
| P | Niveau van kruisopleiding | aandeel taken dat is gedekt in de vaardighedenmatrix | 1–2 |
| P | Geïmplementeerde ideeën | geïmplementeerde verbetersuggesties per maand | 1–3 |

**Opmerking over veiligheids-KPI's in Amerikaanse fabrieken:** Tellers van "dagen zonder letsel" zijn populair, maar OSHA heeft gewaarschuwd dat op percentages gebaseerde prikkels (bijvoorbeeld een beloning voor een maand zonder letsel) melden kunnen ontmoedigen. In haar memo van 11 oktober 2018 stelt OSHA dat dergelijke programma's toegestaan zijn op grond van 29 CFR 1904.35(b)(1)(iv), maar alleen als ze niet zo worden uitgevoerd dat ze melden ontmoedigen, en dat een beleid tegen represailles alleen "may not, by itself, be adequate" [50]. OSHA beveelt een proces aan voor het melden van letsel, ziekte, bijna-ongevallen/near misses en gevaren, inclusief een anonieme optie [49]. Voor de raad van bestuur betekent dit: toon near misses en gevarenmeldingen naast het aantal letsels, en koppel nooit een teambeloning uitsluitend aan een schone veiligheidsrecord.

OEE (overall equipment effectiveness) komt voort uit total productive maintenance; LEI noemt zes grote verliezen: storingen, omsteltijd en afstelling, kleine stilstanden, verminderde snelheid, afval en herbewerking [22]. Op het bord is het OEE-getal zelf minder belangrijk dan de uitsplitsing per verliestype, omdat het team daaruit acties kan afleiden. Het m365.fm-compendium [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) behandelt deze metrieken uitgebreid.

### Wat onderzoek laat zien over KPI's in shopfloor management

In de studie van KIT en IPRI volgde 94 procent van de ondervraagde bedrijven kwaliteits- en productiviteits-KPI's in shopfloor management, terwijl kosten-KPI's zelden werden gebruikt [24][25]. Digitaal gebruik van KPI's in bijna realtime was de uitzondering, met iets meer dan 15 procent van de vermeldingen, en het voorspellen van afwijkingen was bij geen enkel van de ondervraagde bedrijven een werkelijkheid [24].

## Probleemoplossing op de werkvloer: van containment tot standaard

Een rood veld op het bord is het begin, niet het einde. Probleemoplossing in shopfloor management volgt een patroon dat rechtstreeks is afgeleid van de gouden regels van gemba-management [11]:

| Stap | Wat gebeurt er | Wie | Wanneer |
|---|---|---|---|
| 1. Detecteren | Afwijking wordt zichtbaar op het bord of via andon | team | direct of in het tier-overleg |
| 2. Indammen | Containment beschermt de klant (bijv. 100 procent inspectie, quarantaine, reserveonderdeel) | teamleider | in dezelfde shift |
| 3. Begrijpen | Gembutsu ter plaatse controleren, gegevens verzamelen, het proces observeren | klein team bij de machine | na het overleg |
| 4. Grondoorzaak vinden | 5 Whys, visgraatdiagram, A3 voor complexe problemen | probleemoplossingsteam | dagen tot weken |
| 5. Corrigeren | Permanente tegenmaatregel implementeren | eigenaar per actielijst | volgens planning |
| 6. Effect verifiëren | KPI volgen over een afgesproken periode | teamleider | na implementatie |
| 7. Standaardiseren | Standaard, werkinstructie en training bijwerken; delen over lijnen heen (yokoten) | supervisor, procesowner | nadat het effect is aangetoond |

Een actie geldt pas als afgesloten wanneer het effect in de KPI zichtbaar is. De regel klinkt vanzelfsprekend, maar veel fabrieken breken hem: actielijsten worden "groen" gerapporteerd terwijl het defect de week erna terugkomt.

### Welke methode bij welk probleem?

| Probleemtype | Kenmerk | Methode | Benodigde tijd |
|---|---|---|---|
| Eenvoudig, oorzaak duidelijk | oorzaak en oplossing zijn in het overleg helder | directe actie met deadline | minuten |
| Terugkerend, oorzaak onduidelijk | komt herhaaldelijk voor, team is niet zeker van de oorzaak | 5 Whys, visgraatdiagram | uren |
| Complex, over afdelingen heen | meerdere oorzaken, meerdere afdelingen | A3-probleemoplossing op basis van PDCA | weken |
| Systemisch, strategisch | raakt de waardestroom, lay-out, product | kaizen-event, value stream mapping | weken tot maanden |

A3 is bijzonder waardevol omdat het probleem, huidige situatie, grondoorzaakanalyse, doelsituatie, tegenmaatregelen en opvolging op één vel A3-papier (297 × 420 mm, dicht bij het Amerikaanse formaat 11 × 17 in. tabloid dat de meeste Amerikaanse fabrieken gebruiken) zet. De entiteitspagina [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) biedt een introductie, en het compendium [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) behandelt het systemische niveau. De PDCA-cyclus (plan, do, check, act), meestal toegeschreven aan W. Edwards Deming (Deming zelf erkende Walter A. Shewhart), vormt de basis van alle probleemoplossingsprocessen [1].

## De gemba-wandeling: stappen, vragen en checklist

> **Kort samengevat:** Een gemba-wandeling heeft een onderwerp, begint bij het bord, observeert het werk over meerdere cycli, stelt open vragen en eindigt met toegezegde terugkoppeling aan het team. Zonder onderwerp en opvolging is het slechts een wandelingetje.

De gemba-wandeling is de belangrijkste leiderschapsroutine in het shopfloor management. De Lean Lexicon definieert haar als "een managementpraktijk om de huidige situatie te begrijpen door directe observatie en onderzoek, voordat er actie wordt ondernomen" [7]. Een beknopte inleiding is ook te vinden in de post [What is a gemba walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/) en op de entiteitspagina [Gemba walk](https://www.m365.fm/entity/gemba-walk/).

### Drie soorten gemba-wandelingen

Jim Womack, oprichter van LEI, zegt dat hij en Dan Jones de term "gemba walk" voor het eerst gebruikten in de vroege jaren negentig, oorspronkelijk voor managers die de volledige waardestroom van een product doorliepen over afdelingen en bedrijven heen [14]. Tegenwoordig onderscheidt hij twee vormen en stelt hij een derde, inmiddels wijdverbreide toepassing van de term daar tegenover [14]:

| Type | Doel | Typische frequentie | Wie |
|---|---|---|---|
| Waardestroomwandeling | bewustwording van fundamentele verbetering van begin tot eind | naar behoefte, bijv. per kwartaal | fabriek- en afdelingsleiding, alle functies langs de waardestroom |
| Managementsysteemwandeling | controleren of het managementsysteem stabiliteit kan behouden (borden, standaarden, escalaties) | wekelijks tot dagelijks | leiders op alle niveaus |
| Probleemgerichte wandeling (genchi genbutsu) | op de werkvloer tot de kern van een specifiek probleem doordringen | naar behoefte | probleemeigenaren, specialisten |

Womack is kritisch over de derde toepassing en plaatst die dicht bij "management by walking around": als het dagelijks management werkt, zouden problemen al in de cascade opgelost moeten zijn, in plaats van dat topmanagers en verbeterstaf naar de gemba snellen om brandjes te blussen. Hun tijd is beter besteed aan waardestroom- en managementsysteemwandelingen [14].

### De drie leidende vragen van LEI: doel, proces, mensen

LEI raadt aan de gemba-wandeling rond drie dimensies op te bouwen [7]:

1. **Doel:** Welk probleem lost dit proces voor de klant op?
2. **Proces:** Hoe verloopt het werk werkelijk, in tegenstelling tot hoe de standaard het beschrijft?
3. **Mensen:** Zijn de medewerkers betrokken bij het creëren, borgen en verbeteren van het proces?

LEI raadt ook aan één productfamilie of klantgericht proces van begin tot eind te volgen en iedereen die erbij betrokken is mee te nemen, omdat waarde horizontaal door afdelingen heen stroomt [7].

### Gemba-wandeling versus management by walking around

De gemba-wandeling wordt vaak gelijkgesteld aan "management by walking around" (MBWA). MBWA begon bij Hewlett-Packard; medeoprichter David Packard had de praktijk bij General Electric opgepikt. Bekend werd ze door het boek "In Search of Excellence" van Tom Peters en Robert Waterman (1982) [16]. De verschillen zijn nog steeds aanzienlijk:

| Kenmerk | Gemba-wandeling | Management by walking around |
|---|---|---|
| Doel | het proces begrijpen, afwijkingen van de standaard opsporen, probleemoplossend vermogen opbouwen | nabijheid tot medewerkers, informele uitwisseling, zicht krijgen op de stemming |
| Structuur | onderwerp, route, leidende vragen, opvolging | grotendeels ongestructureerd en spontaan |
| Referentiepunt | standaard, KPI, bord | mensen en gesprek |
| Resultaat | concrete observaties, coaching, acties | relatie, informatie |
| Verankerd in | leiderschapsstandaardwerk, vast ritme | persoonlijke leiderschapsstijl |

De twee sluiten elkaar niet uit: een informeel praatje in het voorbijgaan vervangt geen gemba-wandeling, maar doet er ook geen afbreuk aan. De post [Gemba walk vs. management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/) vergelijkt de twee concepten uitgebreider.

### Een gemba-wandeling in zeven stappen

**1. Stel een onderwerp vast.** Elke gemba-wandeling heeft een focus, bijvoorbeeld "omstelling op lijn 4," "gebruik van de nieuwe inspectie-instructie" of "effect van de acties uit het tier 3-overleg." Zonder onderwerp wordt de wandeling een rondleiding.

**2. Bereid je voor.** Bekijk de KPI's en het bord van het gebied, controleer openstaande acties en neem de standaard mee (werkinstructie, standaardwerkblad). Laat het team van tevoren weten, zodat het bezoek niet als een verrassingsinspectie wordt gezien. De post [Gemba walk preparation: team and roles](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/) bevat tips.

**3. Begin bij het bord.** Het bord laat zien wat het team zelf als probleem ziet. Vraag: "Wat vertelt jullie bord jullie vandaag?"

**4. Observeer.** Blijf bij één werkplek en kijk naar meerdere cycli. Vergelijk wat je ziet met de standaard. Schrijf feiten op, geen interpretaties.

**5. Stel vragen.** Open en respectvolle vragen aan de persoon die het werk doet. Geef geen oplossingen voor.

**6. Vat samen en bedank.** Spiegel aan het eind kort terug wat je hebt geleerd en spreek af wat er met de observaties gebeurt.

**7. Volg op.** Documenteer observaties, breng acties in de juiste tier-vergadering in en geef het team feedback. Een ronde zonder feedback ondermijnt het vertrouwen.

**Vergeet de tweede en derde ploeg niet.** In een fabriek met drie ploegen ziet een leidinggevende die alleen in de dagploeg loopt maar een derde van de operatie. Plan minstens af en toe een ronde in de andere ploegen; problemen met bezetting, onderhoudsondersteuning en overdrachten komen daar vaak als eerste naar boven (praktijkadvies).

**Hoe lang moet een gemba-walk duren?** De hier gebruikte bronnen geven geen vaste waarde. In de praktijk duurt een gerichte managementsysteemronde in één gebied 20 tot 45 minuten; een waardestroomronde over een hele productfamilie kan een halve dag duren. De voorbeelddag in sectie 10 plant 30 minuten. Dit zijn praktijkwaarden, geen uitspraken uit de bronnen.

### Vragenbank gemba-walk

**Doel en doelstellingen**
- Wie is de klant van dit proces, en wat heeft die nodig?
- Wat is het doel van je ploeg vandaag, en hoe weet je of je dat haalt?
- Welke KPI is nu voor jou het belangrijkst, en waarom?

**Proces en standaard**
- Hoe verloopt deze stap normaal? Kun je het me laten zien?
- Waar is de standaard vastgelegd, en komt die overeen met de werkelijkheid?
- Hoe merk je meteen dat hier iets niet klopt?
- Wat gebeurt er als materiaal ontbreekt of de machine stilvalt?
- Waar wacht je, zoek je naar spullen of moet je iets opnieuw doen?

**Problemen en probleemoplossing**
- Wat was het laatste probleem dat hier is opgelost?
- Welk probleem kost je nu de meeste tijd?
- Wat gebeurt er als je een probleem meldt? Hoe snel komt er hulp?
- Welke actie op het bord loopt achter, en wat heeft die nodig?

**Mensen**
- Wat houdt je tegen om je werk goed te doen?
- Wat zou je veranderen als je het voor het zeggen had?
- Wie anders dan jij kan deze taak uitvoeren?
- Wat kan ik doen om jou te ondersteunen?

### Checklist gemba-walk

Print hem uit of zet hem om in een digitaal formulier (zie sectie 17). Een langere versie met rolspecifieke vragen staat in de post [Gemba walk checklist and questions](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/).

- [ ] Onderwerp en gebied zijn vastgesteld.
- [ ] KPI's, bordstatus en openstaande acties zijn vooraf bekeken.
- [ ] De relevante standaard is bij de hand (geprint of op een tablet).
- [ ] Het team of de teamleider is geïnformeerd.
- [ ] Persoonlijke beschermingsmiddelen (PBM) en de veiligheidsregels van het gebied worden nageleefd.
- [ ] Minstens één werkplek is over meerdere cycli geobserveerd.
- [ ] Vragen waren open; er zijn geen oplossingen opgelegd.
- [ ] Observaties zijn als feiten opgeschreven (plaats, tijd, wat er gezien is).
- [ ] Goede praktijken zijn erkend.
- [ ] Afspraken zijn samengevat.
- [ ] Acties zijn in de actielijst of de volgende tier-vergadering opgenomen.
- [ ] Feedback aan het team is ingepland.

### Veelgemaakte fouten bij de gemba-walk

| Fout | Waarom het schaadt | Beter |
|---|---|---|
| Gemba-walk als inspectie | mensen verbergen problemen | vragen in plaats van controleren; zie problemen als een geschenk |
| Oplossingen ter plekke opleggen | het team verlaat het probleemoplossend denken, de leider wordt een knelpunt | coach met vragen, laat het team de oplossing ontwikkelen |
| Geen onderwerp, geen route | de ronde blijft oppervlakkig | stel een focus vast, neem de standaard mee |
| Alleen leidinggevenden praten | de kennis van de experts blijft ongebruikt | luister 80 procent van de tijd |
| Geen opvolging | verlies van vertrouwen, "er gebeurt toch niets" | feedback binnen een week |
| Onregelmatige rondes | de ronde lijkt een bijzonder evenement | vast ritme in de leiderschapsstandaardwerk |
| Schuldtoewijzing | angst, problemen worden verborgen | stel vragen over het proces en het systeem, niet over mensen |

Veel van deze fouten hebben één gemeenschappelijke oorzaak: de ronde wordt opgevat als controle. De post [Gemba walk mistakes: when the walk becomes an inspection](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/) gaat hier dieper op in. Womack beschrijft zijn eigen houding zo: "I've never invented anything. I just take walks, comment on what I see, and give courage to people to try" (geciteerd in het voorwoord van John Shook) [15].

## Leidinggevend standaardwerk: leiderschap als routine

Leidinggevend standaardwerk past het principe van standaardwerk toe op leidinggevenden. LEI beschrijft het als "kaizen voor management": in combinatie met het juiste leiderschapsgedrag verschuift leidinggevend standaardwerk de rol van managers weg van het zelf primair oplossen van problemen, naar het opbouwen van het probleemoplossend vermogen van hun medewerkers [18].

In "Creating a Lean Culture" noemt David Mann vier hoofdelementen van een lean managementsysteem: leidinggevend standaardwerk, visuele besturing, een dagelijks verantwoordingsproces en leiderschapsdiscipline [19]. Het aandeel gestandaardiseerd werk neemt af naarmate men hoger in de hiërarchie staat: operators kunnen 100 procent van de tijd volgens standaard werken, een supervisor ongeveer 80 procent van de dag; op hogere niveaus daalt dit aandeel verder [19].

### Voorbeeld: leidinggevend standaardwerk voor een productiesupervisor

| Tijd | Activiteit | Bewijs |
|---|---|---|
| 6:00–6:10 uur | Overdracht van de ploeg, controle van het bord op alle lijnen | Ondertekend overdrachtslogboek |
| 6:10–6:30 uur | Bijwonen van twee van de gespreide tier 1-overleggen (wisselend) | Aanwezigheidslijst |
| 6:30–6:45 uur | Procesbevestiging: één standaard op één lijn controleren | Auditkaart |
| 6:45–8:15 uur | Aanwezigheid op de vloer: ondersteuning bij storingen, oplossen van materiaal- en bezettingstekorten, controle van de borden | Notities, actielijst |
| 8:30–8:45 uur | Leiden van het tier 2-overleg | Tier 2-bord |
| 8:45–9:00 uur | Voorbereiden van escalaties voor tier 3 | Escalatielijst |
| 9:15–9:35 uur | Bijwonen van het tier 3-overleg | Tier 3-bord |
| 10:00–11:00 uur | Coachen van een probleemoplossend team (A3) | A3-status |
| 13:00–13:30 uur | Gemba-wandeling over een focusonderwerp | Notities, acties |
| 13:30–14:00 uur | Voorbereiden van de ploegoverdracht | Overdrachtslogboek |

Het plan is een praktijkvoorbeeld, geen bronvermelding. Op een ploeg van 6:00 tot 14:00 uur structureert het ruim tweederde van de dag; Mann beschrijft ongeveer 80 procent als haalbaar op dit niveau [19]. De rest blijft bewust open voor het onverwachte, personeelskwesties en projecten. Leidinggevend standaardwerk is zelf zichtbaar: veel fabrieken hangen de vaste routines van hun leidinggevenden op het bord en vinken voltooide onderdelen af. Dat creëert verantwoordelijkheid in beide richtingen.

### Procesbevestiging (gelaagde procesaudit)

Een belangrijk bouwblok van leidinggevend standaardwerk is procesbevestiging: leidinggevenden op verschillende niveaus controleren kort en op een vast ritme of een standaard wordt nagevolgd en of de standaard nog past. Meerdere niveaus controleren dezelfde processen met verschillende frequenties, bijvoorbeeld de teamleider dagelijks, de supervisor wekelijks, de fabrieksdirecteur maandelijks. In Amerikaanse fabrieken, vooral in de toeleverketen van de automobielindustrie, staat de praktijk meestal bekend als layered process audit (LPA). Afwijkingen worden niet bestraft; ze worden beschouwd als een teken van een ongeschikte standaard of ontbrekende training.

## Andon: afwijkingen direct zichtbaar maken

LEI definieert andon als een visueel managementinstrument dat in één oogopslag de status van de werkzaamheden in een gebied toont en een signaal geeft zodra zich een afwijking voordoet [17]. Het signaal wordt geactiveerd met een trekkoord of knop bij de werkplek, of automatisch door een machinesensor. Bij Toyota blijft de lijn draaien nadat het koord is getrokken, terwijl het team het probleem probeert op te lossen; lukt dat niet binnen de cyclus, dan stopt de lijn op een vaste positie aan het einde van het station [17]. Het brandende stationsnummer roept de teamleider op, van wie verwacht wordt dat hij snel reageert [17].

In shop floor management overbrugt andon de kloof tussen de geplande overleggen: het tier-overleg kijkt terug op gisteren en plant vandaag, andon regelt wat er nu gebeurt. Bij Toyota leidt een teamleider (hancho) een team van vijf tot acht personen, reageert op lijnstops en andon-oproepen, leidt verbeteractiviteiten en controleert dagelijks met auditformulieren of de standaardwerkwijze wordt gevolgd [21]. Dit is belangrijk bij het overbrengen van het model naar westerse fabrieken: de teamleider van Toyota is een uurloner zonder disciplinaire bevoegdheid en zonder vaste positie op de lijn; hij beheerst alle taken van het team en vervangt bij pauzes, afwezigheid of achterstanden [21]. Als u deze rol bovenop een leidinggevende operator legt die volledig aan de cyclustijd van de lijn gebonden is, krijgt u geen snelle andon-reactie. Hetzelfde geldt voor een teamleider die verantwoordelijk is voor 25 personen.

Andon-gebeurtenissen horen op het bord: aantal oproepen per shift, gemiddelde reactietijd en de meest voorkomende oorzaken. Veel oproepen zijn aanvankelijk geen slecht teken; ze laten zien dat het team problemen zichtbaar maakt.

## Rollen en verantwoordelijkheden

| Rol | Taken in shop floor management |
|---|---|
| Fabrieksdirecteur | rolmodel, faciliteert tier 4, gaat regelmatig naar de gemba, beslist over middelen voor escalaties, vertaalt doelen door (bijvoorbeeld via hoshin kanri) |
| Afdelingsmanager / productiemanager | faciliteert tier 3, coacht leidinggevenden, zorgt dat de niveaus op elkaar aansluiten |
| Supervisor / shiftleider | faciliteert tier 2, procesbevestiging, coacht teamleiders |
| Teamleider | faciliteert tier 1, onderhoudt het bord samen met het team, reageert op andon, zet containment in gang |
| Operators en technici | melden afwijkingen, dragen ideeën aan, zijn eigenaar van acties, onderhouden delen van het bord |
| Ondersteunende functies (kwaliteit, onderhoud, supply chain, EHS) | nemen deel aan tier 2 en 3, pakken geëscaleerde problemen op, leveren gegevens |
| Shop floor coach / lean- of CI-specialist | woont vergaderingen bij, geeft feedback op de begeleiding, traint probleemoplossing |
| Vertegenwoordigers van werknemers (vakbond, veiligheidscommissie; in Duitsland de ondernemingsraad) | vroeg betrokken; zorgen dat KPI's niet worden gebruikt om het gedrag of de prestaties van individuen te volgen (zie hoofdstuk 13) |

CETPM beschrijft shop floor coaches die vergaderingen observeren en achteraf feedback geven [3]. Deze rol wordt tijdens de uitrol vaak onderschat: een teamleider die nog nooit een overleg heeft geleid, heeft in de eerste weken concrete feedback nodig.

### Hoe de rol van de leidinggevende verandert

| Voorheen | In shop floor management |
|---|---|
| lost problemen persoonlijk op | ontwikkelt het probleemoplossend vermogen van het team |
| ontvangt meldingen op kantoor | ziet de werkelijkheid op de vloer |
| vraagt "Wie heeft dit gedaan?" | vraagt "Wat in het proces heeft dit mogelijk gemaakt?" |
| beantwoordt escalaties per e-mail | beantwoordt escalaties in het eerstvolgende overleg |
| beoordeelt KPI's | gebruikt KPI's om een gesprek te starten |

## Cultuur, psychologische veiligheid en regels voor medewerkersmonitoring

Shopfloormanagement werkt alleen wanneer problemen openlijk benoemd worden. Dat klinkt vanzelfsprekend, maar in veel organisaties is dat niet het geval. Een rood veld op het bord dat tot kritiek op het team leidt, wordt de volgende keer groen geschilderd.

Organisatieonderzoeker Amy Edmondson van Harvard heeft het concept van psychologische veiligheid in teams vormgegeven: "a shared belief held by members of a team that the team is safe for interpersonal risk taking" [23]. Haar onderzoek naar 51 werkteams bij een meubelfabrikant met ongeveer 5.000 medewerkers verscheen in 1999 in Administrative Science Quarterly [23] en behoort tot de meest geciteerde werken over leergedrag in teams. Voor shopfloormanagement betekent dit: alleen in psychologisch veilige teams worden fouten gemeld, bijna-ongevallen gedocumenteerd en normen ter discussie gesteld.

### Hoe leidinggevenden psychologische veiligheid bij het bord opbouwen

- **Rood is welkom.** Bedank mensen voor elk probleem dat zichtbaar wordt gemaakt. De reactie op het eerste rode veld bepaalt alle volgende.
- **Proces, niet persoon.** Vraag naar omstandigheden, niet naar schuldigen.
- **Toon je eigen fouten.** Leidinggevenden die hun eigen missers openlijk benoemen, verlagen de drempel.
- **Beantwoord escalaties.** Mensen die escaleren en nooit antwoord krijgen, stoppen met escaleren.
- **Voer ideeën uit.** Zichtbare uitvoering van suggesties is de sterkste vorm van erkenning. De studie van KIT en IPRI bekritiseerde dat medewerkers vaak de status van hun suggesties niet konden zien, wat de motivatie verlaagt [24].
- **Straf veiligheidsmeldingen niet af.** OSHA verwacht dat werknemers "do not experience retaliation" wanneer zij letsel, ziekten en gevaren melden [49]; de reactie bij het bord is de plek waar die verwachting werkelijkheid wordt.

De post [Operational excellence culture on the shop floor](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/) beschrijft hoe zo'n cultuur op de lange termijn verankerd wordt; het compendium [Operational excellence](https://www.m365.fm/en/learn/operational-excellence/) plaatst dit in de bredere context. Haufe Akademie noemt hansei, de Japanse praktijk van zelfkritische reflectie, als bouwsteen van een positieve foutcultuur [43].

### Regels voor medewerkersmonitoring: Amerikaans arbeidsrecht en Duitse ondernemingsraden

Een digitaal bord dat machinedata naast gebruikersinloggingen toont, kan als monitoringsysteem worden gelezen. Hoe zwaar dat weegt, hangt af van de locatie van de fabriek. Het volgende is algemene informatie, geen juridisch advies; laat bij elke digitale uitrol het arbeidsrecht door een jurist beoordelen.

**In de VS.** Er bestaat geen algemeen medebeslissingsrecht vergelijkbaar met Duitsland, maar verschillende regels zijn van toepassing:

- **Fabrieken met vakbond:** De NLRB heeft de installatie en het gebruik van verborgen bewakingscamera's aangemerkt als verplicht onderwerp van onderhandeling (Colgate-Palmolive, 1997), een standpunt dat het Zevende Circuit in National Steel Corp. v. NLRB (2003) bevestigde [54]. Of een specifiek digitaal bord met persoonsgegevens onder de onderhandelingsplicht valt, is een kwestie van geval tot geval; de veilige route is de vakbond vóór de uitrol te betrekken.
- **Fabrieken zonder vakbond:** In oktober 2022 gaf de toenmalige NLRB General Counsel memo GC 23-02 uit, die stelde dat ingrijpende elektronische monitoring de rechten van werknemers op grond van Section 7 van de NLRA kan aantasten en aandrong op openbaarmaking van monitoringtechnologieën [52]. Op 14 februari 2025 heeft de waarnemend General Counsel dat memo ingetrokken (GC 25-05) [53]. De NLRA zelf is niet veranderd, dus monitoring die beschermde activiteiten kan ontmoedigen, blijft een risico.
- **Staatswetten over kennisgeving:** Sommige staten verplichten tot kennisgeving van elektronische monitoring. New York bijvoorbeeld vereist dat werkgevers werknemers wier telefoon-, e-mail- of internetgebruik wordt gemonitord, bij indiensttreding vooraf schriftelijk informeren [55]. Een shopfloor-app die individueel systeemgebruik registreert, kan onder dergelijke regels vallen.
- **Veiligheidsmeldingen:** Zoals in hoofdstuk 7 wordt getoond, beschermen OSHA-regels werknemers die letsel melden [49][50]. Een bord dat de persoon die een incident heeft gemeld apart uitlicht, werkt tegen die bescherming in.

**In Duitsland (relevant voor Amerikaanse bedrijven met Duitse fabrieken of een Duitse moedermaatschappij).** Het betrekken van de ondernemingsraad (Betriebsrat, het gekozen medewerkersorgaan met wettelijke medebeslissingsrechten) is geen formaliteit. ifaa adviseert om die van meet af aan te betrekken en de KPI's zo te ontwerpen dat er geen angst voor bewaking ontstaat [2]. Bij digitale borden die machine- en persoonsgegevens gebruiken, geldt paragraaf 87, lid 1, nr. 6 van de Duitse Betriebsverfassungsgesetz (BetrVG): de ondernemingsraad heeft inspraak bij "de invoering en het gebruik van technische inrichtingen die bestemd zijn om het gedrag of de prestaties van werknemers te controleren" [44]. Volgens het Duitse Bundesarbeitsgericht (BAG) is het voldoende dat een systeem objectief geschikt is om gedrags- of prestatiegegevens te verzamelen; het oogmerk van de werkgever om te controleren doet er niet toe [48]. Dat geldt in het algemeen voor Power BI, Power Apps of een MES met gebruikersaanmeldingen. Daarnaast geldt de AVG. In de praktijk regelt een ondernemingsovereenkomst (Betriebsvereinbarung) de details.

**Wat in beide landen werkt:** een schriftelijke regel die bepaalt welke gegevens op welk aggregatieniveau worden getoond, wie welke rapporten mag zien, hoe lang gegevens worden bewaard en dat KPI's processen beoordelen, niet mensen. Dat is dezelfde inhoud die een Duitse ondernemingsovereenkomst regelt, en het geeft een Amerikaanse vakbond of medewerkers een duidelijk antwoord op de vraag: "Gaat dit tegen ons gebruikt worden?"

## Shop floor management implementeren: een zesfasen-stappenplan

> **Kort samengevat:** begin met een pilotgebied, ontwerp het bord samen met het team, draai het ongeveer drie maanden met coaching en bouw het volgende niveau pas op wanneer het niveau eronder betrouwbaar werkt.

ifaa heeft een zesfasen-uitrolmodel beschreven en in verschillende kleine en middelgrote bedrijven getest; de evaluatie toonde aan dat het concept met eenvoudige middelen kan worden ingevoerd [2]. Het onderstaande stappenplan bouwt op dit model voort en voegt de gemba-wandeling, de cascade en digitalisering toe.

| Fase | Inhoud | Deelnemers | Duur (richtwaarde) |
|---|---|---|---|
| 1. Doelen stellen | doelen, pilotgebied en succescriteria definiëren; rondgang door de fabriek | bedrijfsleiding, productiemanagement, projectleider, facilitator | een halve dag volgens ifaa [2] |
| 2. Informeren en bewustwording creëren | informatiebijeenkomst met vragenronde; betrek medewerkersvertegenwoordigers | leiding, managers, medewerkers van het pilotgebied, vakbond of ondernemingsraad waar van toepassing | een halve dag volgens de ifaa-cijfer [2] |
| 3. Invoeren | het bord samen met het team ontwerpen, KPI's kiezen, faciliteren oefenen | managers en medewerkers van het pilotgebied, 6 tot 8 personen | twee blokken van een halve dag van maximaal 4 uur elk volgens ifaa [2] |
| 4. Proefperiode | dagelijkse shopfloor-overleggen, coaching, het bord stapsgewijs verbeteren | pilotteam, coach | ongeveer 3 maanden volgens ifaa [2] |
| 5. Tussentijdse controle | neutrale observatie van overleggen, feedback | interne of externe observatoren | regelmatig tijdens de proefperiode [2] |
| 6. Valideren en uitrollen | evaluatieworkshop, bord en overleg standaardiseren, cascade opbouwen, verdere gebieden | alle projectdeelnemers, daarna verdere gebieden | workshop van 2 tot 3 uur volgens ifaa [2], uitrol afhankelijk van de fabrieksgrootte |

### Praktische aanbevelingen per fase

**Fase 1:** Kies een pilotgebied met een stabiel proces, gemotiveerde leiding en een zichtbaar probleem. ifaa spreekt over een "vuurtoren" die de latere uitrol draagt [2]. Een gebied dat in chaos verzeild is, is ongeschikt, omdat daar eerst stabiliteit moet komen.

**Fase 2:** Leg het waarom uit, niet alleen het wat. Maak duidelijk dat KPI's processen beoordelen, niet mensen.

**Fase 3:** Laat het team het bord ontwerpen. Begin met hooguit vier tot zes KPI's [3] en een eenvoudige actielijst. Een perfect bord op dag één is niet nodig en ook niet nuttig.

**Fase 4:** De eerste weken zijn bepalend. Overleggen duren in het begin langer dan nodig [3]. Een coach observeert het overleg en geeft de facilitator achteraf persoonlijke feedback. Orth beschrijft hiervoor ongeveer 15 minuten, met één sterk punt, één ontwikkelpunt en één concrete opdracht [3]. In de eerste weken betaalt dit zich dagelijks uit, later wekelijks. Gemba-wandelingen door het volgende leidinggevende niveau beginnen in deze fase.

**Fase 5:** Gebruik een eenvoudige beoordeling (zie de volwassenheidscheck hieronder) om te controleren of het systeem werkt.

**Fase 6:** Bouw niveau 2 pas op wanneer niveau 1 betrouwbaar draait, daarna niveaus 3 en 4. Vervang bestaande overleggen in plaats van nieuwe toe te voegen. Gelbrich noemt het een typische fout wanneer shop floor management niet wordt gebruikt om bestaande overleggen te vervangen [3].

### Voorwaarden en succesfactoren volgens ifaa

ifaa noemt als voorwaarden: managementbetrokkenheid, een budget aan tijd en geld, communicatie over het project binnen het bedrijf, een gedefinieerde doelsituatie (visie en missie), overtuiging bij de betrokken medewerkers en betrokkenheid van de ondernemingsraad [2]. Voor succes benadrukt het ook management dat op de werkvloer aanwezig is bij de overleggen, doelen die duidelijk worden gecommuniceerd en op alle niveaus worden doorgegeven, participatie en training van medewerkers, en discipline, consistentie en doorzettingsvermogen, want shop floor management is geen eenmalige campagne [2]. In Amerikaanse fabrieken zonder ondernemingsraad geldt dezelfde logica voor de vakbond of, in een niet-georganiseerde fabriek, voor vroege en open communicatie met het personeel.

### Maturiteitscheck: werkt uw shop floor management?

- [ ] Het bord is vandaag bijgewerkt en het team kan elke KPI toelichten.
- [ ] Elke rode KPI heeft een actie met een eigenaar en een einddatum.
- [ ] Overleggen beginnen op tijd en blijven binnen het tijdsbestek.
- [ ] Escalaties bereiken dezelfde dag het volgende niveau en krijgen een antwoord.
- [ ] Leidinggevenden lopen gemba-rondes volgens een vast ritme.
- [ ] Acties worden pas gesloten nadat hun effect is aangetoond.
- [ ] Het aantal gemelde problemen en bijna-ongevallen is gestegen, niet gedaald.
- [ ] Minstens één bestaand overleg is vervangen door het tier-overleg.
- [ ] Verbeterde processen zijn vastgelegd in bijgewerkte standaarden.
- [ ] Medewerkers kunnen de status van hun ideeën zien.

Acht of meer keer ja wijst op een effectief systeem; minder dan vijf wijst op een bord dat meer ritueel is dan een managementinstrument.

## Veelgemaakte fouten en hoe u ze oplost

Op basis van waarnemingen sinds 2015 bij ongeveer 50 Duitse bedrijven uit verschillende sectoren heeft Gelbrich tien veelvoorkomende redenen afgeleid waarom shop floor management mislukt [3]. De tabel koppelt ze aan tegenmaatregelen.

| Fout (volgens Gelbrich [3]) | Tegenmaatregel |
|---|---|
| onrealistisch hoge verwachtingen zonder directe betrokkenheid van het management | de fabrieksdirecteur faciliteert tier 4 persoonlijk en gaat regelmatig naar de gemba |
| gebrekkige koppeling tussen de niveaus van shop floor management | onderling verbonden cascade, gedefinieerde escalatietriggers, plicht tot reageren |
| inhoudelijke overbelasting met onnodige informatie | vier tot zes KPI's, al het overige van het bord halen |
| ingewikkelde, tijdrovende informatie-updates | gegevensverzameling vereenvoudigen, automatiseren waar dat zinvol is |
| KPI's die niet relevant zijn voor het proces | KPI's opnieuw afleiden met de drie leidende vragen |
| KPI's die het team niet kan beïnvloeden | naar het eerstvolgende hogere niveau verplaatsen |
| lange updatelussen en verouderde informatie | de update een vast onderdeel maken van de overdracht tussen ploegen |
| geen tegenmaatregelen wanneer afwijkingen worden gevonden | regel: geen rood zonder actie |
| shop floor-overleggen die te lang duren, vooral tijdens de uitrol | tijdsbestek, staand overleg, probleemoplossing buiten het overleg houden |
| shop floor management vervangt bestaande overleggen niet | overzicht van overleggen, dubbele overleggen schrappen |

Drie andere fouten komen in de praktijk vaak voor:

- **KPI-theater:** KPI's worden gepresenteerd maar niet besproken. De vraag "Wat doen we nu?" ontbreekt.
- **Gemba-toerisme:** Leidinggevenden lopen door de fabriek zonder onderwerp, zonder vragen en zonder opvolging.
- **Te vroeg digitaliseren:** Een fabriek introduceert software voordat de routines zijn ingebed. Wat gedigitaliseerd wordt, is een proces dat niemand leeft.

## Analoog of digitaal? Digitaal shopfloormanagement vergeleken

De vraag "whiteboard of scherm?" wordt vaak behandeld als een kwestie van principe. Ze is echter nuchter te beantwoorden. Het beschikbare onderzoek suggereert dat de huidige situatie grotendeels analoog is: in de studie van KIT en IPRI (18 bedrijven) werd shopfloormanagement vooral op papier uitgevoerd en slechts deels digitaal ondersteund; slechts ongeveer 10 procent van de vergaderingen gebruikte een digitaal shopfloorbord, en digitale weergave van KPI's begon meestal pas op middenmanagementniveau [24][25]. De studie beschrijft ook onderbroken overdrachten tussen papier, Excel en OneNote zonder leidend systeem, waardoor het volgen over niveaus heen moeilijker wordt [24].

| Criterium | Analoog bord | Digitaal bord |
|---|---|---|
| Aanschafkosten vooraf | zeer laag | licenties, hardware, integratie |
| Betrokkenheid en eigenaarschap | het team schrijft erop, sterke identificatie | risico dat het team alleen consumeert |
| Actualiteit | hangt af van handmatig bijhouden | automatisch, tot bijna realtime |
| Datakwaliteit | overschrijffouten, hiaten | consistent, mits de bronnen schoon zijn |
| Escalatie over niveaus heen | handmatig, foutgevoelig | end-to-end, traceerbaar |
| Actiebewaking | individuele discipline | systeemondersteund met deadlines en herinneringen |
| Gedistribueerde teams, meerdere locaties | niet mogelijk | mogelijk |
| Geschiedenis en analyse | foto's, ordners | analyseerbaar, trends, patronen |
| Veerkracht | werkt altijd | hangt af van netwerk en systemen |
| Regels voor monitoring van medewerkers | meestal onkritisch | schriftelijke gegevensregels aanbevolen (vakbond, landelijke wetgeving; ondernemingsovereenkomst in Duitsland) |
| OT-beveiliging | geen issue | netwerksegmentatie en toegangsbeheer nodig (zie hoofdstuk 18) |

### Welke aanpak wanneer?

- **Begin analoog** wanneer de routines nieuw zijn, het team klein is en de KPI's eenvoudig met de hand te registreren zijn. Het whiteboard dwingt je om het slank te houden.
- **Ga hybride** wanneer machinedata automatisch naar een scherm stromen, maar acties en ideeën nog met de hand aan het bord worden bijgehouden. Voor veel fabrieken is dit de beste compromisoplossing.
- **Breid digitaal uit** wanneer meerdere niveaus, ploegen of locaties met elkaar verbonden moeten worden, wanneer handmatige gegevensregistratie te veel inspanning kost of wanneer acties tussen niveaus verloren gaan.

CETPM verwijst naar een vijffasenmodel van Müller-Seegers voor digitalisering: project- en doeldefinitie, leverancierstests en toolselectie, pilot (hooguit vier weken), aanpassingsfase (alleen indien nodig), uitrol en exploitatie; in totaal verwacht hij ongeveer zes maanden [3]. Belangrijker dan het gereedschap is de volgorde: eerst routine, dan digitaal. De post [Shop floor optimization: ways to improve flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/) laat zien hoe je de materiaalstroom tegelijkertijd kunt verbeteren.

## Een digitaal shopfloor-bord bouwen met Microsoft 365

> **Kort samengevat:** Teams biedt de ruimte, Power BI de KPI-wand, Power Apps de gegevensregistratie, Lists de actielijst en Fabric realtime-waarschuwingen. De grootste hefbomen zijn de licenties voor kijkers, het vernieuwingsinterval van Power BI en het datamodel.

Veel producenten gebruiken al Microsoft 365 voor e-mail, Teams en documenten. Het is logisch om het digitale shopfloor-bord te bouwen op de plek waar medewerkers al werken. De onderstaande bouwstenen zijn gedocumenteerd op Microsoft Learn. Controleer de licentievereisten en de beschikbaarheid voor uw eigen tenant voordat u aan een project begint. Amerikaanse overheids- en defensieleveranciers op de overheidsclouds van Microsoft (GCC, GCC High) moeten de beschikbaarheid van functies daar afzonderlijk controleren.

### Referentiearchitectuur in een oogopslag

| Functie van het bord | Microsoft-bouwsteen | Wat het doet (volgens de Microsoft-documentatie) |
|---|---|---|
| Communicatieruimte per afdeling | Microsoft Teams (één team per afdeling, één kanaal per lijn of niveau) | kanalen met tabbladen voor bord, acties en apps |
| KPI's visualiseren | Power BI, ingebed als tabblad in Teams | interactieve rapporten in kanalen en chats, linkvoorvertoningen, meldingen in de activiteitenfeed [28] |
| KPI's met doelen | Power BI Metrics (scorecards) | metrics met eigenaren, huidige waarde en doel, status, check-ins; als tabblad in kanalen of vergaderingen [31] |
| Gegevensregistratie op de werkplek | Power Apps (canvas-app als Teams-tabblad) | aangepaste invoerschermen, bijvoorbeeld voor stilstandredenen, uitval, ideeën [30] |
| Actielijst, issuetracker | Microsoft Lists (bijvoorbeeld de sjabloon "Issue tracker") of Planner | lijsten met weergaven, regels en meldingen, opgeslagen in SharePoint [38] |
| Standaardtaken over vestigingen heen | Planner met taakpublicatie | taaklijsten verspreiden naar veel teams en voltooiing per locatie bijhouden [37] |
| Shiftcommunicatie | Teams-apps voor frontlinemedewerkers (Shifts, Walkie Talkie, Approvals, Updates) | shiftroosters, push-to-talk, goedkeuringen, terugkerende updates [35][36] |
| Realtime data en waarschuwingen | Microsoft Fabric Real-Time Intelligence (Eventstream, Eventhouse, Real-Time Dashboard, Activator) | streamingdata vastleggen, analyseren en visualiseren en automatisch handelen bij voorwaarden [32][33] |

### Power BI als KPI-wand

Power BI-rapporten kunnen als tabblad in een Teams-kanaal worden ingebed, zodat het team KPI's ziet en bespreekt op de plek waar het al communiceert [28]. In de praktijk zijn drie punten belangrijk:

1. **Machtigingen:** Het inbedden van een rapport in Teams geeft gebruikers niet automatisch toegang om het te bekijken; machtigingen moeten expliciet worden verleend [28].
2. **Licenties:** Gebruikers met een gratis Fabric-licentie kunnen inhoud in een werkruimte op een Premium-capaciteit (P-SKU) of een Fabric-capaciteit van F64 of groter bekijken; maken en delen vereist Power BI Pro of Premium Per User [28]. Onder F64 hebben alle kijkers dus een Pro- of PPU-licentie nodig. Bij veel kijkers op de vloer is dit de belangrijkste kostenpost; laat de licentiëring voor beeldschermen bij de lijn verduidelijken door uw Microsoft-licentiepartner.
3. **Beperkingen:** Power BI-dashboards (in tegenstelling tot rapporten) kunnen niet in het Power BI-tabblad worden ingebed, en het tabblad ondersteunt geen URL-filters [28].

**Hoe actueel kan een Power BI-bord zijn?** Automatisch vernieuwen van pagina's werkt voor DirectQuery-bronnen, Direct Lake en sommige live-verbindingsscenario's, maar niet in importmodus [29]. In gedeelde capaciteit (typisch bij alleen Pro-licenties) is het minimale interval 30 minuten en is wijzigingsdetectie niet beschikbaar. In toegewezen capaciteit (Fabric F, Premium P) en bij Premium Per User zijn intervallen tot één seconde mogelijk met DirectQuery, als de capaciteitsbeheerder dit toestaat; het standaard minimale interval is vijf minuten, en vijf seconden voor wijzigingsdetectie [29]. Dat is voldoende voor een bord dat stuks per uur toont; voor echte andon-functies past Real-Time Intelligence beter.

### Power Apps voor gegevensregistratie op de werkplek

Canvas-apps gebouwd met Power Apps kunnen via het tabblad "Power Apps" aan een Teams-kanaal worden toegevoegd, mits de app eerst met de gebruikers is gedeeld [30]. Typische shopfloor-apps:

- registratie van stilstandredenen met enkele grote knoppen (bijvoorbeeld "materiaal ontbreekt", "gereedschapsbreuk", "kwaliteit"),
- registratie van uitval en herwerk per uur,
- ideeën en verbetervoorstellen met een foto,
- een digitale gemba-walk-checklist met observaties en acties,
- procesbevestiging (gelaagde procesaudit) op een tablet.

Microsoft somt bekende beperkingen op, bijvoorbeeld dat sensoren zoals locatie of kompas niet worden ondersteund in de Teams-desktopapp en dat bijlagen niet kunnen worden gedownload in de Teams-mobiele app [30]. Belangrijk voor de architectuurbeslissing: Dataverse for Teams-omgevingen zijn verouderd [30]. Volgens Microsoft kunnen er vanaf 15 november 2026 geen nieuwe Dataverse for Teams-omgevingen meer worden aangemaakt; niet-geüpgradede omgevingen worden op 15 september 2027 opgeschort en op 30 oktober 2027 buiten gebruik gesteld [45]. Nieuwe oplossingen moeten daarom worden gebouwd op een reguliere Dataverse-omgeving, SharePoint-lijsten of andere gegevensbronnen.

**De vraag naar Power Apps-licenties:** Dataverse-tabellen, premium-connectors en on-premises data gateways (bijvoorbeeld voor een MES-database in de fabriek) vereisen Power Apps-premiumrechten [46]. Een registratie-app op basis van SharePoint-lijsten werkt meestal met de rechten die bij Microsoft 365 zijn inbegrepen; de Power Platform Licensing Guide beschrijft de exacte reikwijdte. Dit onderscheid bepaalt vaak de kosten per gebruiker aan de lijn.

### Acties en taken

Microsoft Lists, bruikbaar als tabblad in Teams, past goed bij de actielijst. Microsoft beschrijft Lists als een hulpmiddel om informatie bij te houden, zoals problemen, assets, routines of incidenten, met aanpasbare weergaven, regels en meldingen; er is een sjabloon "Issue tracker" beschikbaar, en de gegevens staan op de SharePoint-teamsite [38]. Een lijst met de kolommen probleem, KPI, grondoorzaak, actie, eigenaar, uiterste datum, status, effect geverifieerd en escalatieniveau spiegelt de actiekolom van het bord. Een filter per niveau toont precies de relevante items in elk overlegniveau.

Gestandaardiseerde routines, zoals dagelijkse 5S-controles of wekelijkse procesbevestigingen op alle lijnen, kunnen worden verspreid met taakpublicatie in Planner. Microsoft beschrijft hoe operations managers takenlijsten in een gedefinieerde hiërarchie naar teams kunnen publiceren en de voltooiing kunnen volgen via rapporten per taak en per lijst; taken kunnen checklists bevatten met maximaal 20 items [37].

### Realtime en waarschuwingen met Microsoft Fabric

Voor fabrieken die machinegegevens realtime willen gebruiken, biedt Microsoft Fabric Real-Time Intelligence verschillende bouwstenen [32]:

- **Eventstream** verzamelt, transformeert en routeert grote volumes realtime gegevens zonder code; connectors omvatten MQTT, Apache Kafka en change data capture uit databases. Azure-bronnen zoals Event Hubs en IoT Hub zijn beschikbaar in de Real-Time hub.
- **Eventhouse** is geoptimaliseerd voor tijdgebonden streamingevenementen; queries gebruiken KQL (Kusto Query Language) of, in de KQL-queryset, T-SQL.
- **Real-Time Dashboard** visualiseert data in beweging.
- **Activator** bewaakt datastromen met lage latentie (subseconde voor stateless regels op streamingdata) en activeert acties wanneer drempelwaarden worden bereikt of patronen worden gedetecteerd, inclusief het ontbreken van data. Acties omvatten Teams-berichten aan personen, groepen of kanalen, e-mails, Power Automate-flows en Fabric-items zoals pipelines of notebooks [33].

Microsoft noemt productie en IoT uitdrukkelijk als scenario's [32]. Voor shop floor management betekent dit dat een Activator-regel bijvoorbeeld een bericht kan plaatsen in het Teams-kanaal van de lijn wanneer een machine langer dan een vastgestelde tijd stilstaat. Dat is een digitale andon die de teamleider op de smartphone bereikt. Het vult de trekkoord en de signaallamp aan de lijn aan, maar vervangt ze niet, zolang niet elke teamleider een zakelijke telefoon heeft.

### Voorbeeld: een tier 1-bord in Teams

| Kanaaltabblad | Inhoud | Bouwsteen |
|---|---|---|
| "Board" | SQDCP-pagina met rood/groen status, uurdoel vs. werkelijk, top 3 stilstandoorzaken | Power BI-rapport |
| "Capture" | stilstandoorzaken, uitval, ideeën | Power Apps canvas-app |
| "Actions" | actielijst gefilterd op tier 1 | Microsoft Lists |
| "Routines" | dagelijkse controles, 5S, procesbevestiging | Planner (gepubliceerde taken) |
| "Goals" | gebiedsdoelen met check-ins | Power BI Metrics |
| Kanaalberichten | escalaties, andon-berichten, overdracht van dienst | Teams, Activator, Power Automate |

### Bouwplan: zes stappen naar je eerste digitale tier 1-bord

Voor Microsoft 365-beheerders heeft de volgende volgorde zich bewezen. Er wordt van uitgegaan dat het pilotteam al met een analoog bord werkt.

1. **Fotografeer het bord en definieer de KPI's.** Neem de velden en KPI's van het analoge bord over; leg voor elke KPI de formule, de bron, het doel en de vernieuwingsbehoefte vast.
2. **Maak het team en de kanalen aan.** Een team per gebied, een kanaal per lijn of niveau; rechten via groepen in plaats van via individuen.
3. **Bouw de actielijst in Microsoft Lists.** Kolommen zoals in "Acties en taken" hierboven, één weergave per niveau, herinnering op de vervaldatum.
4. **Maak de registratie-app.** Een canvas-app met enkele grote knoppen voor stilstandredenen en uitval, gegevens in SharePoint-lijsten of Dataverse (let op de licentievraag).
5. **Koppel het Power BI-rapport.** Eén rapportpagina per bord, rood/groen-logica ten opzichte van doelen, DirectQuery of Direct Lake als paginavernieuwing nodig is; insluiten als tabblad in het kanaal en leesrechten toekennen.
6. **Test vier weken in het overleg en breid daarna uit.** Pas wanneer het team het digitale bord in het overleg van niveau 1 zelf gebruikt, volgen Activator-waarschuwingen, Planner-routines en de koppeling met niveau 2.

Spreek de gegevensregels af met de vertegenwoordigers van de medewerkers voordat stap 4 begint (en in Duitsland met de ondernemingsraad), omdat er vanaf die stap gegevens kunnen ontstaan die tot individuen herleidbaar zijn.

### Wat Microsoft 365 niet vervangt

Microsoft 365 is een toolkit, geen kant-en-klaar systeem voor shopfloor management. Het ontwerp van de cascadelogica, de escalatieregels, de koppeling tussen KPI, actie en geverifieerd effect en de discipline van de gespreksleiding moet je zelf uitwerken. Zonder helder datamodel eindig je snel met een verzameling losse lijsten en rapporten, precies de gebroken overdrachten tussen tools die onderzoek bij analoog shopfloor management aanwijst [24]. Controleer ook vroeg de hardwarevraag: grote schermen aan de lijn, robuuste tablets en apparaataccounts voor gedeelde toestellen brengen eigen inspanning met zich mee.

## Gegevensintegratie: MES, ERP en machinegegevens

> **Kort samengevat:** Aantallen en stilstand komen automatisch van de machine of het MES; stilstandredenen en ideeën worden eenvoudig met de hand vastgelegd. Elke KPI is één keer gedefinieerd en op elk niveau op dezelfde manier berekend.

Een digitaal bord is zo goed als zijn gegevens. Typische bronnen:

| Bron | Gegevens voor het bord | Typisch pad |
|---|---|---|
| ERP (bijv. SAP, Microsoft Dynamics 365) | orders, geplande hoeveelheden, leverdata, achterstand | gegevensexport of connector naar Power BI of Fabric |
| MES / productie- en machinedataverzameling | aantallen, stilstand, stilstandredenen, OEE, uitval | database- of API-verbinding, repliceren naar Fabric |
| Machinebesturingen (PLC, OPC UA) | toestanden, tellers, proceswaarden | edge-gateway, bijv. Azure IoT Operations met de OPC UA-connector, daarna via MQTT |
| Kwaliteitsmanagementsysteem (QMS) | inspectieresultaten, klachten | database- of API-verbinding |
| HR- en planningssystemen / shifts | aanwezigheid, ploegrooster | interface, geaggregeerd |
| Handmatige registratie | stilstandredenen, ideeën, veiligheidsincidenten | Power Apps, Microsoft Lists |

In ISA-95-termen (ANSI/ISA-95, internationaal IEC 62264) bevindt het bord zich boven niveau 3 (productiebeheer, zoals MES) en niveau 4 (bedrijfsplanning en logistiek, zoals ERP); de norm behandelt vooral de interface tussen deze twee niveaus [56]. Door de terminologie ervan te gebruiken voor orders, materialen en apparatuur, sluit het datamodel van het bord beter aan op MES en ERP.

Voor het aansluiten van machines beschrijft Microsoft de connector voor OPC UA in Azure IoT Operations: die verbindt met OPC UA-servers, leest gegevens en publiceert ze als JSON-berichten in het OPC UA PubSub-formaat naar de MQTT-broker; hij kan ook assets automatisch ontdekken [34]. Vanaf daar sturen dataflows in Azure IoT Operations de gegevens naar bestemmingen zoals Microsoft Fabric OneLake, Azure Data Explorer of een Kafka-endpoint [47]. De hier beoordeelde documentatie beschrijft geen OPC UA-connector rechtstreeks in Fabric; het pad loopt via de edge-gateway.

Zodra machinenetwerken met clouddiensten worden verbonden, wordt OT-beveiliging onderdeel van het project. De ISA/IEC 62443-reeks behandelt de beveiliging van industriële automatiserings- en besturingssystemen en verbindt operatie en IT [57]; het NIST Cybersecurity Framework (CSF) 2.0, gepubliceerd op 26 februari 2024, beschrijft zichzelf als een taxonomie van cyberbeveiligingsresultaten op hoog niveau en kan als referentie dienen voor het sturen van dat werk [59]. Een shopfloor-bord moet gegevens uit het OT-netwerk lezen en geen weg naar binnen openen.

### Principes voor de gegevensarchitectuur

1. **Eén waarheid per KPI.** Definieer elke KPI één keer (formule, bron, granulariteit) en gebruik die definitie op elk niveau. Zo komt OEE op het bord van tier 1 overeen met OEE in het productierapport.
2. **Automatiseer wat stabiel is.** Aantallen en stilstand komen van de machine of het MES. Stilstandredenen die mensen moeten beoordelen, worden handmatig vastgelegd, eenvoudig en snel.
3. **Latentie afgestemd op de beslissing.** Tier 1 heeft uurwaarden of realtime waarden nodig, tier 4 dagelijkse of wekelijkse waarden. Niet alles hoeft realtime te zijn.
4. **Privacy- en medewerkersregels vanaf het begin.** Persoonsgegevens worden geaggregeerd; rollen en rechten worden gedocumenteerd.

Het compendium [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) behandelt deze vragen over productie-IT uitgebreid, en [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) laat zien waar realtime productiedata vervolgens toe leiden.

## Softwareondersteuning: het voorbeeld van iFAKT Polaris

> **Opmerking: de auteur werkt bij iFAKT GmbH.**

Naast het zelf bouwen van een bord met Microsoft 365 bestaat er gespecialiseerde software voor digitaal lean management. Een voorbeeld is [Polaris](https://www.m365.fm/entity/polaris/) van [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), gevestigd in Stuttgart, Duitsland. Polaris-oplossingen staan op Microsoft AppSource, waaronder Polaris VSM voor digitale waardestroomanalyse [39] en Polaris BSM voor procesmodellering in digitaal lean management [40]. Het compendium [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) beschrijft de productfamilie in detail.

Volgens de leverancier zijn twee modules relevant voor shopfloormanagement [unverified: informatie van de leverancier, niet onafhankelijk gecontroleerd]:

- **[Polaris Operator](https://www.m365.fm/entity/polaris-operator/)** brengt taken rechtstreeks naar de shopfloor, bijvoorbeeld acties uit tierbesprekingen of gemba-wandelingen, zodat ze bij de eigenaars aan de lijn terechtkomen en hun afronding gevolgd kan worden.
- **[Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)** toont KPI's in dashboards en ondersteunt de KPI-wand van het bord op de verschillende niveaus.

Beoordeling: een gespecialiseerde oplossing ontwerpt uw cascade, escalatieregels en facilitatiediscipline niet voor u, net zomin als een zelfgebouwde oplossing dat doet. Ze kan wel de koppeling tussen KPI, actie en geverifieerd effect vooraf structureren en zo het werk aan uw eigen datamodel verkorten. Belangrijk is of de oplossing past in uw bestaande IT-landschap; de AppSource-vermelding wijst op een focus op het Microsoft-ecosysteem.

Naast Polaris zijn er veel andere leveranciers, zoals shopfloormodules van MES-leveranciers of zelfstandige platforms voor lean en tierbesprekingen. Ongeacht de leverancier helpen deze vragen bij de selectie:

- Brengt de software de cascade in kaart met escalatie en respons over meerdere tiers?
- Kan een actie pas worden gesloten nadat het effect is aangetoond?
- Welke interfaces naar ERP, MES en machines bestaan er, en wie onderhoudt die?
- Kan de software KPI's aggregeren op de manier waarop uw dataregels (cao, landelijke wetgeving, ondernemingsovereenkomst) dat vereisen?
- Wat gebeurt er als het netwerk aan de lijn uitvalt?
- Hoe worden kijkers gelicentieerd, en wat kost een scherm aan de lijn?

Over het bedrijf: iFAKT GmbH heeft zijn hoofdkantoor aan de Curiestrasse 2, 70563 Stuttgart, Duitsland (handelsregister Stuttgart HRB 22661) [61]. Volgens het bedrijf is het in 2001 opgericht en heeft het ongeveer 25 medewerkers (bedrijfsinformatie, niet onafhankelijk geverifieerd). Op de website staat een TÜV SÜD-zegel voor ISO 9001- en ISO/IEC 27001-certificering [61]. Met zijn Polaris IMS-systeem werd het in de categorie productie tweede bij de Best of Technology Award 2025 van het Duitse zakenweekblad WirtschaftsWoche [60].

## Woordenlijst

| Term | Betekenis |
|---|---|
| A3 | probleemoplossing op één vel A3-papier (in de VS meestal 11 × 17 in.): probleem, huidige situatie, grondoorzaak, doel, tegenmaatregelen, opvolging |
| Andon | signaal (trekkoord, knop, lampje) dat een afwijking direct zichtbaar maakt en om hulp vraagt |
| Escalatie | een probleem doorgeven aan het volgende niveau wanneer het team het zelf niet kan oplossen |
| Gemba | Japans voor "de werkelijke plaats"; de plek waar waarde wordt gecreëerd |
| Gembutsu | het "werkelijke ding" op de gemba: machine, gereedschap, materiaal, afgekeurd onderdeel |
| Genchi genbutsu | zelf gaan kijken en de feiten ter plaatse controleren |
| Hoshin kanri | methode om bedrijfsdoelen op alle niveaus uit te rollen (ook wel beleidsdeployment genoemd) |
| Gelaagde procesaudit (proces­bevestiging) | korte controle van een standaard door leidinggevenden op meerdere niveaus, volgens een vast ritme |
| Leidinggevendenstandaardwerk | vaste, zichtbare dagelijkse routines voor leidinggevenden |
| Obeya | "grote kamer"; een vergaderruimte met alle KPI's en projecten aan de muren |
| OEE | overall equipment effectiveness: beschikbaarheid × prestatie × kwaliteit |
| SQDCP | bordstructuur naar veiligheid, kwaliteit, levering, kosten, mensen (ook SQCDP) |
| Tier-overleg | kort regelmatig overleg aan het bord op een specifiek niveau van de hiërarchie |
| TRIR | total recordable incident rate: bij OSHA meldingsplichtige gevallen × 200.000 / gewerkte uren |
| Yokoten | het overbrengen van een bewezen oplossing naar andere lijnen of fabrieken |
| DirectQuery / Direct Lake | Power BI-verbindingsmodi waarbij gegevens rechtstreeks worden opgevraagd in plaats van geïmporteerd; vereist voor automatisch verversen van pagina's |
| F64 | grootte van een Microsoft Fabric-capaciteit waarvan kijkers inhoud kunnen zien zonder betaalde Power BI-licentie |

## FAQ: shop floor management en gemba-wandelingen

### Wat is shop floor management in eenvoudige bewoordingen?

Shop floor management betekent dat leidinggevenden leiding geven op de plek waar het werk wordt gedaan. Het team komt elke dag kort samen bij een bord met een paar KPI's, bespreekt afwijkingen, spreekt acties af en geeft problemen die het niet zelf kan oplossen door aan het volgende leidinggevende niveau. Leidinggevenden gaan regelmatig naar de werkvloer om zelf te zien wat er gebeurt.

### Wat zijn de elementen van shop floor management?

Zes elementen: leidinggevenden aanwezig op de werkvloer (gemba), visueel management, een paar KPI's die het team kan beïnvloeden, een vast vergaderritme in tier-overleggen, gestructureerde probleemoplossing en standaardisatie. Duitse onderzoeksinstituten groeperen ze iets anders [2][4], en Amerikaanse leveranciers spreken vaak van vijf pijlers, maar de inhoud is hetzelfde.

### Wat betekent gemba?

Gemba (ook genba) is Japans voor "de werkelijke plaats." In lean betekent het de plek waar waarde wordt gecreëerd, meestal de werkvloer [7][8]. Genchi genbutsu, "ga zelf kijken," is de bijbehorende handeling: gemba is een plaats, genchi genbutsu is wat je daar doet [8].

### Wat is een gemba-wandeling?

Een gemba-wandeling is een geplande bezoek van een leidinggevende aan de plek waar waarde wordt gecreëerd. De leidinggevende observeert het werk, vergelijkt het met de standaard en stelt open vragen om de situatie te begrijpen voordat hij actie onderneemt [7]. Een goede wandeling heeft een onderwerp, begint bij het bord en eindigt met terugkoppeling aan het team.

### Wat zijn de drie principes van een gemba-wandeling?

De meest geciteerde versie komt van de voormalige Toyota-voorzitter Fujio Cho: "Ga kijken, vraag waarom, toon respect" [15]. LEI voegt drie dingen toe om tijdens de wandeling op te letten: doel (welk probleem het proces voor de klant oplost), proces (hoe het in werkelijkheid werkt) en mensen (of zij betrokken zijn bij het verbeteren ervan) [7].

### Wat is het verschil tussen shop floor management en een gemba-wandeling?

Shop floor management is het volledige leiderschapssysteem van bord, KPI's, tier-overleggen, probleemoplossing en standaarden. De gemba-wandeling is één routine binnen dit systeem: de leidinggevende gaat naar de plek waar het werk wordt gedaan, observeert en stelt vragen om de situatie te begrijpen voordat hij handelt [7].

### Hoe lang moet een shop floor-overleg duren?

Ongeveer 10 tot 15 minuten op teamniveau en 20 tot 30 minuten op managementniveau. Gelbrich noemt 10 tot 12 minuten op operationeel niveau en 20 tot 30 minuten op managementniveau; tijdens de uitrol duren de overleggen vaak langer [3].

### Wat is een tier 1-, tier 2- en tier 3-overleg?

Een tier-overleg is een kort, gestandaardiseerd overleg aan het bord op één niveau van de organisatie. Tier 1 is het frontlinieteam, tier 2 de supervisors van een gebied, tier 3 de afdelingsmanagers en tier 4 de fabrieksleiding [58]. De overleggen worden na elkaar ingepland zodat problemen dezelfde dag omhoog kunnen worden geëscaleerd.

### Wat is een shop floor-bord?

Een shop floor board (ook huddle board of SQDCP-board) is het whiteboard of scherm waar het team samenkomt voor het tieroverleg. Het toont een paar KPI's met doel en trend, open acties met eigenaren en uiterste data, en escalaties naar het volgende niveau. Een typische indeling heeft kolommen per SQDCP en rijen voor status, trend en acties.

### Waar staat SQDCP voor?

SQDCP staat voor safety (veiligheid), quality (kwaliteit), delivery (levering), cost (kosten) en people (mensen). De volgorde is de boodschap: veiligheid wordt in elk overleg als eerste besproken. Varianten zijn SQDC, SQDCM (moraal) of SQDCE (milieu).

### Welke KPI's horen op een shop floor board?

Vier tot zes KPI's die het team kan beïnvloeden [3], geordend naar SQDCP: veiligheid (registreerbare letsels, bijna-ongevallen), kwaliteit (uitval, first pass yield), levering (doel versus werkelijk, op-tijd-levering), kosten of productiviteit (OEE, stuks per uur) en mensen (aanwezigheid, cross-training, ideeën).

### Hoe vaak moet je een gemba walk doen?

Er is geen universeel getal. Wat telt is een vast, betrouwbaar ritme, verankerd in leiderschapsstandaardwerk. In de praktijk doen supervisors en shiftleiders dagelijks een onderwerpgerichte walk, afdelingsmanagers meerdere keren per week en de fabrieksdirecteur minstens wekelijks; value stream walks vinden plaats wanneer nodig. Teamleiders zijn sowieso de hele dag op de gemba en gebruiken in plaats daarvan dagelijkse proces-bevestiging. Belangrijker dan de frequentie is dat elke walk een onderwerp heeft en opvolging.

### Wie moet een gemba walk doen?

Leidinggevenden op elk niveau, elk met een andere focus: supervisors en afdelingsmanagers doen vooral managementsysteem-walks (werken de borden, standaarden en escalaties?), fabrieksleiding doet value stream walks over functies heen, en specialisten doen probleemgerichte walks [14]. Teamleiders werken sowieso op de gemba en gebruiken proces-bevestiging. Neem de mensen die het proces uitvoeren mee, zoals LEI aanbeveelt [7].

### Hoe lang moet een gemba walk duren?

De geraadpleegde bronnen geven geen vaste lengte. Een gerichte walk in één gebied duurt typisch 20 tot 45 minuten; een value stream walk over een productfamilie kan een halve dag duren. Het observeren van meerdere cycli bij één werkstation is belangrijker dan het afleggen van veel terrein.

### Welke vragen moet je stellen tijdens een gemba walk?

Open vragen werken het best, zoals "Hoe verloopt deze stap normaal?", "Hoe merk je dat er iets niet goed is?", "Welk probleem heb je hier als laatste opgelost?" en "Wat kan ik doen om jou te ondersteunen?" De volledige vragenbank staat in de sectie over gemba walks.

### Is een gemba walk hetzelfde als management by walking around?

Nee. MBWA komt van Hewlett-Packard en werd bekend via "In Search of Excellence" (1982) [16]; het gaat vooral om nabijheid en informele uitwisseling. De gemba walk is gestructureerder, verwijst naar standaarden en KPI's en dient om het proces te begrijpen en probleemoplossend vermogen op te bouwen.

### Werkt shop floor management in kleine bedrijven?

Ja. ifaa heeft zijn uitrolmodel getest in verschillende kleine en middelgrote bedrijven en vond dat het met eenvoudige middelen kan worden ingevoerd [2]. In kleine bedrijven zijn vaak twee niveaus voldoende: een teamoverleg en een leiderschapsoverleg.

### Heb ik software nodig voor shop floor management?

Niet om te beginnen. Een whiteboard, magneten en stiften volstaan om de routines op te bouwen. Software levert pas iets op wanneer meerdere niveaus, shifts of vestigingen aan elkaar moeten worden gekoppeld, wanneer handmatige gegevensregistratie te veel inspanning kost of wanneer acties tussen niveaus verloren gaan [24].

### Kan ik een digitaal shop floor board bouwen met Microsoft Teams en Power BI?

Ja. Power BI-rapporten kunnen als tabbladen in Teams-kanalen worden ingebed [28], Power Apps verzorgen de gegevensregistratie bij het werkstation [30], Microsoft Lists vormt de actielijst [38] en Microsoft Fabric Real-Time Intelligence zorgt voor realtime waarschuwingen [32][33]. Let op de licentie-eisen voor kijkers (gratis kijkers alleen vanaf Fabric F64 of Premium-capaciteit), de minimale intervallen van automatisch paginavernieuwen in Power BI (30 minuten in gedeelde capaciteit) en de uitfasering van Dataverse for Teams [28][29][45].

### Hoe lang duurt het om shop floor management in te voeren?

Voor een pilotgebied voorziet het ifaa-model na doelstelling, informatie- en introductieworkshops in een proeffase van ongeveer drie maanden [2]. Uitrollen naar een hele fabriek met een werkende cascade over alle niveaus duurt aanzienlijk langer, afhankelijk van de omvang, omdat elk niveau betrouwbaar moet draaien voordat het volgende wordt opgebouwd.

## Conclusie

Shop floor management is geen bord en geen software, maar een leidingssysteem met duidelijke werkingsprincipes: leidinggevenden gaan naar de plek waar waarde wordt gecreëerd, het team maakt afwijkingen zichtbaar met een paar KPI's die het zelf kan beïnvloeden, korte, vaste tier-overleggen brengen problemen op dezelfde dag naar de plek waar ze kunnen worden opgelost, en elke oplossing wordt pas de nieuwe standaard nadat het effect is aangetoond. De gemba walk is de routine waarmee leidinggevenden begrijpen in plaats van aannemen.

De gedocumenteerde ervaring laat twee dingen zien. Ten eerste is shop floor management wijdverbreid, maar faalt het vaak op dezelfde manieren: ontbrekende verbindingen tussen niveaus, overvolle borden, overleggen die te lang duren en gebrek aan betrokkenheid van het management [3]. Ten tweede is de huidige situatie grotendeels analoog, met gebroken overdrachten tussen hulpmiddelen die escalatie en actieopvolging moeilijker maken [24]. Digitalisering kan helpen, maar alleen wanneer de routines al worden nageleefd.

Voor bedrijven die werken met Microsoft 365 is een digitaal bord met Teams, Power BI, Power Apps, Lists en Fabric een voor de hand liggende optie. Plan het datamodel, de licenties, de verversingsintervallen en de regels voor medewerkersgegevens vanaf het begin. En begin waar elke uitrol moet beginnen: met één pilotteam, één eenvoudig bord, een tijdsblok van 15 minuten en een leidinggevende die luistert.

## Verder lezen op m365.fm

**Blogposts**
- [What is a gemba walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/)
- [Gemba walk checklist and questions](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/)
- [Gemba walk vs. management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/)
- [Gemba walk preparation: team and roles](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/)
- [Gemba walk mistakes: when the walk becomes an inspection](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/)
- [Operational excellence culture on the shop floor](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/)
- [Shop floor optimization: ways to improve flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/)

**Begrippen**
[Shop floor management](https://www.m365.fm/entity/shop-floor-management/) · [Gemba walk](https://www.m365.fm/entity/gemba-walk/) · [Tier meeting](https://www.m365.fm/entity/tier-meeting/) · [Visual management](https://www.m365.fm/entity/visual-management/) · [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [5S](https://www.m365.fm/entity/5s/) · [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Micro stops](https://www.m365.fm/entity/micro-stops/) · [Scrap rate](https://www.m365.fm/entity/scrap-rate/) · [Lean management](https://www.m365.fm/entity/lean-management/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)

**Gerelateerde gidsen**
- [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Operational excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is de host van m365.fm en werkt bij [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) in Stuttgart, Duitsland. Op m365.fm schrijft hij over lean management, operational excellence en de digitalisering van de productie met Microsoft 365 en Azure. Zijn aandachtspunt is hoe bewezen lean-routines, zoals shopfloor-management en de gemba-wandeling, samen kunnen werken met moderne dataplatforms zonder hun kern te verliezen.

**Let op: de auteur werkt bij iFAKT GmbH.**

# Sources

All sources accessed on November 20, 2026. Sources 1 to 48 are carried over from the German version; sources 49 to 61 were added and verified for the US version. German-language sources are marked (German).

1. Shopfloor Management. Wikipedia (German). https://de.wikipedia.org/wiki/Shopfloor_Management
2. Conrad, R. W.; Eisele, O.: Shopfloor-Management: Führen am Ort der Wertschöpfung. In: Betriebspraxis & Arbeitsforschung 235, ifaa – Institut für angewandte Arbeitswissenschaft e. V., 2019, pp. 18–24 (German). https://www.arbeitswissenschaft.net/fileadmin/Downloads/Angebote_und_Produkte/Publikationen/ifaa_BA_235_Shopfloormanagement.pdf
3. Was ist Shopfloor Management? (glossary). CETPM – Centre of Excellence for Total Performance Management (with references to Gelbrich 2019, Orth, Schwarz, Hartmann/Melas 2020, Müller-Seegers 2020) (German). https://www.cetpm.de/lexikon/was-ist-shopfloor-management/141/
4. Shopfloor Management: Definition, Bedeutung, Kennzahlen. WGP – Wissenschaftliche Gesellschaft für Produktionstechnik (German). https://wgp.de/de/shopfloor-management/
5. Suzaki, K.: The New Shop Floor Management: Empowering People for Continuous Improvement. Free Press, 1993. https://books.google.com/books/about/New_Shop_Floor_Management.html?id=5vMvj0ge92IC
6. Peters, Remco: Shopfloor-Management. Führen am Ort der Wertschöpfung. LOG_X Verlag, Stuttgart 2009, ISBN 978-3-932298-39-4; quote p. 59, core elements p. 39 (cited via [1]; first name per Wikipedia and trade data; German National Library catalog not reachable at the time of access) (German).
7. Gemba Walk (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/gemba-walk/
8. Ballé, M.: Gemba, workplace, genchi genbutsu, go-and-see … What's the difference? Lean Enterprise Institute, September 14, 2015. https://www.lean.org/the-lean-post/articles/gemba-workplace-genchi-genbutsu-go-and-see-whats-the-difference/
9. Toyota Motor Corporation: 75 Years of Toyota, Section 7: The Functions that Supported Globalization (Toyota Way 2001). https://www.toyota-global.com/company/history_of_toyota/75years/text/leaping_forward_as_a_global_corporation/chapter4/section7/item4.html
10. Imai, M.: Gemba Kaizen: A Commonsense, Low-Cost Approach to Management. McGraw-Hill, 1997, ISBN 978-0-07-031446-7 (Publishers Weekly review). https://www.publishersweekly.com/9780070314467
11. Gemba and Its Meaning: The Heart of Lean Management. Kaizen Institute. https://kaizen.com/insights/gemba-meaning-lean-management/
12. Genchi Genbutsu. Wikipedia (English). https://en.wikipedia.org/wiki/Genchi_Genbutsu
13. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press, 1988 (publisher page, Routledge). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140
14. Womack, J.: Value Stream Walk, Management Walk or … Just Walking Around? Lean Enterprise Institute, June 19, 2018. https://www.lean.org/the-lean-post/articles/value-stream-walk-management-walk-or-just-walking-around/
15. Shook, J.: Foreword. In: Womack, J.: Gemba Walks, 2nd edition. Lean Enterprise Institute, 2013. https://www.lean.org/wp-content/uploads/2021/01/gemba-walks-foreward.pdf
16. Tom Peters: The four-letter word every modern manager needs to know: MBWA. Fortune, December 18, 2015. https://fortune.com/2015/12/18/tom-peters-the-four-letter-word-every-modern-manager-needs-to-know-mbwa/
17. Andon (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/andon/
18. Leader Standard Work (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/leader-standard-work/
19. Graban, M.: Book Review: Creating a Lean Culture (David Mann). Lean Blog, November 2005. https://leanblog.org/2005/11/book-review-creating-lean-culture
20. Visual Management (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/visual-management/
21. Team Leader (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/team-leader/
22. Overall Equipment Effectiveness (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/
23. Edmondson, A.: Psychological Safety and Learning Behavior in Work Teams. Administrative Science Quarterly 44 (2), 1999, pp. 350–383. https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Group_Performance/Edmondson%20Psychological%20safety.pdf
24. wbk Institute of Production Science (KIT) and IPRI: Auf dem Weg zum digitalen Shopfloor Management. Eine Studie zum Stand der Echtzeitentscheidungsfähigkeit und des Industrie 4.0-Reifegrads (ShopfloorPulse project; 18 companies from more than eight industries; undated, probably 2018/2019) (German). https://www.wbk.kit.edu/downloads/Auf%20dem%20Weg%20zum%20digitalen%20Shopfloor%20Management.pdf
25. Bundesvereinigung Logistik (BVL), IPRI, wbk (KIT): ShopfloorPulse, final report IGF project 19372 N (2017–2019) (German). https://www.bvl.de/files/1951/2125/2131/2133/Abschlussbericht_ShopfloorPulse_19372_N.pdf
26. Hertle, C.; Siedelhofer, C.; Metternich, J.; Abele, E.: The next generation shop floor management: How to continuously develop competencies in manufacturing environments. 23rd International Conference on Production Research, Manila 2015; TUprints TU Darmstadt, 2016. https://tuprints.ulb.tu-darmstadt.de/5253
27. VDI 2870 Part 2: Lean production systems; list of methods (project page for the new edition, possible publication date according to VDI: June 2027). VDI. https://vdi.de/richtlinien/details/vdi-2870-blatt-2-lean-production-systems-list-of-methods
28. Collaborate with Power BI in Teams. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-collaborate-microsoft-teams
29. Automatic page refresh in Power BI Desktop. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-automatic-page-refresh
30. Embed a canvas app as tab app. Microsoft Learn (Power Apps). https://learn.microsoft.com/en-us/power-apps/teams/embed-teams-tab
31. Use Power BI Metrics to track goals in Microsoft Teams. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/explore-reports/business-user-teams-goals
32. What is Real-Time Intelligence in Microsoft Fabric? Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/overview
33. What is Fabric Activator? Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-introduction
34. What is the connector for OPC UA? Microsoft Learn (Azure IoT Operations). https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector
35. Frontline team collaboration. Microsoft Learn (Microsoft 365 for frontline workers). https://learn.microsoft.com/en-us/microsoft-365/frontline/flw-team-collaboration?view=o365-worldwide
36. Simplify business processes for frontline teams. Microsoft Learn. https://learn.microsoft.com/en-us/microsoft-365/frontline/simplify-business-processes?view=o365-worldwide
37. Publish task lists to define and track work in your organization. Microsoft Support. https://support.microsoft.com/en-us/teams/shifts/publish-task-lists-to-define-and-track-work-in-your-organization
38. Manage the Lists app for your organization. Microsoft Learn (Microsoft Teams). https://learn.microsoft.com/en-us/microsoftteams/manage-lists-app
39. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource (Polaris VSM). Microsoft Tech Community, Marketplace Blog, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536
40. Polaris BSM (Business Swimlane Modeling). Microsoft AppSource. https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1
41. What is shopfloor management? SYMESTIC (German page; English page: https://www.symestic.com/en-us/what-is/shopfloor-management). https://www.symestic.com/de-de/was-ist/shopfloor-management
42. Trummer, R. (GFT Technologies SE): Digitales Shopfloor-Management ermöglicht 20 Prozent mehr Produktivität. Digital Manufacturing Magazin, November 2, 2022 (German). https://www.digital-manufacturing-magazin.de/digitales-shopfloor-management-ermoeglicht-20-prozent-mehr-produktivitaet-a-2b00c53c429d27a792ea7f51627fac4a/
43. Shopfloor Management (glossary). Haufe Akademie (German). https://www.haufe-akademie.de/blog/glossar/shopfloor-management/
44. Section 87 Works Constitution Act (Betriebsverfassungsgesetz, BetrVG): co-determination rights. Federal Ministry of Justice, gesetze-im-internet.de (German). https://www.gesetze-im-internet.de/betrvg/__87.html
45. Important changes (deprecations) coming in Power Apps, Power Automate, and Copilot Studio: Deprecation of Microsoft Dataverse for Teams environments. Microsoft Learn. https://learn.microsoft.com/en-gb/power-platform/important-changes-coming
46. Power Apps licensing FAQs. Microsoft Learn (Power Platform). https://learn.microsoft.com/en-us/power-platform/admin/powerapps-licensing-faq
47. Configure data flow endpoints. Microsoft Learn (Azure IoT Operations). https://learn.microsoft.com/azure/iot-operations/connect-to-cloud/howto-configure-dataflow-endpoint
48. Federal Labor Court (Bundesarbeitsgericht), decision of July 16, 2024, 1 ABR 16/23 (headset system; co-determination under Section 87(1) No. 6 BetrVG) (German). https://www.bundesarbeitsgericht.de/wp-content/uploads/2024/11/1-ABR-16-23.pdf
49. Safety Management – Worker Participation. Occupational Safety and Health Administration (OSHA), U.S. Department of Labor. https://www.osha.gov/safety-management/worker-participation
50. OSHA: Clarification of OSHA's Position on Workplace Safety Incentive Programs and Post-Incident Drug Testing Under 29 C.F.R. § 1904.35(b)(1)(iv). Standard interpretation memorandum, October 11, 2018. https://www.osha.gov/laws-regs/standardinterpretations/2018-10-11
51. TRIR (Total Recordable Incident Rate). National Safety Council, Injury Facts. https://injuryfacts.nsc.org/definitions/trir-total-recordable-incident-rate/
52. Morgan Lewis: Electronic Monitoring and Algorithmic Management: Permissible Labor Practice or Unlawful Oversight? LawFlash, November 8, 2022 (on NLRB GC Memo 23-02, October 31, 2022). https://www.morganlewis.com/pubs/2022/11/electronic-monitoring-and-algorithmic-management-permissible-labor-practice-or-unlawful-oversight
53. NLRB: GC 25-05 Rescission of Certain General Counsel Memoranda. National Labor Relations Board, February 14, 2025. https://www.nlrb.gov/news-outreach/news-story/gc-25-05-rescission-of-certain-general-counsel-memoranda
54. National Steel Corp. v. National Labor Relations Board, 324 F.3d 928 (7th Cir. 2003), discussing Colgate-Palmolive Co., 323 N.L.R.B. 515 (1997). Justia. https://law.justia.com/cases/federal/appellate-courts/F3/324/928/577225/
55. New York Civil Rights Law § 52-c (notice of electronic monitoring by employers). Justia, 2021 New York Laws. https://law.justia.com/codes/new-york/2021/cvr/article-5/52-c-2/
56. ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
57. ISA/IEC 62443 Series of Standards. International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
58. How should daily management be structured in a manufacturing plant? Kaizen Institute. https://kaizen.com/insights/daily-management-manufacturing-plant/
59. NIST: The NIST Cybersecurity Framework (CSF) 2.0. NIST CSWP 29, February 26, 2024. https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final
60. Best of Technology Award 2025: winners (category Produktion: 2nd place iFAKT GmbH, Polaris IMS). WirtschaftsWoche (German). https://award.wiwo.de/bot/gewinner-2025/
61. iFAKT GmbH: imprint (Curiestr. 2, 70563 Stuttgart; Amtsgericht Stuttgart HRB 22661) and home page (TÜV SÜD seal ISO 9001 & ISO/IEC 27001). https://www.ifakt.de/de/imprint and https://www.ifakt.de/
