# SEO metadata

| Field | Value |
|---|---|
| Meta title | Waardestroommapping: symbolen, kengetallen & uitgewerkt voorbeeld |
| Meta description | Waardestroommapping (VSM) stap voor stap: symbolen, formules voor takttijd en doorlooptijd, een volledig uitgewerkt voorbeeld, toekomstige staat en VSM-software. |
| Slug | `value-stream-mapping` |

# Waardestroommapping: De complete gids voor VSM-symbolen, kengetallen, toekomstige-staatontwerp en waardestroombeheer

> **Kort antwoord:** Value Stream Mapping (VSM) is een Lean-methode om de materiaal- en informatiestroom van één productfamilie, van leverancier tot klant, op één pagina te tekenen met standaardsymbolen. Een tijdlijn met doorlooptijd, bewerkingstijd en voorraaddagen laat zien hoe weinig van de totale tijd waarde toevoegt. Een toekomstige-toestandkaart ontwerpt daarna een slankere stroom, en een implementatieplan zorgt dat die er ook komt.

In veel fabrieken ligt een order drie of vier weken in de productie, terwijl het daadwerkelijke werk eraan slechts enkele minuten kost. De Duitstalige Wikipedia geeft een typisch voorbeeld: vier weken doorlooptijd tegenover tien minuten pure bewerkingstijd [27]. Als je alleen naar afzonderlijke machines kijkt, zie je die kloof nooit. Value Stream Mapping dwingt je de hele stroom te bekijken: waar ligt materiaal stil? Waarom ligt het daar? Wie vertelt elk proces wat het volgende moet maken, en wanneer?

Deze gids legt de methode van de grond af uit. Je krijgt de volledige symbolenset, een stapsgewijze handleiding, elke belangrijke metriek met formule en een volledig uitgewerkt voorbeeld, de ontwerprichtlijnen voor de toekomstige toestand, de beperkingen van de papieren methode, dynamische en digitale Value Stream Mapping, Value Stream 4.0, Value Stream Management als leidinggevende taak, en een neutraal overzicht van softwarecategorieën. Voor een compacte definitie zie de entiteitspagina van m365.fm [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/).

Een opmerking over bronnen: Wertstromanalyse (Value Stream Mapping) heeft in Duitsland een sterke onderzoekstraditie, onder meer bij Fraunhofer IPA en TU Darmstadt. Waar een Duitse bron iets toevoegt dat de Engelstalige literatuur mist, blijft dat in de tekst staan met een korte uitleg.

### Belangrijkste punten

- Value Stream Mapping kijkt altijd naar één **productfamilie** en de volledige door-to-door stroom, niet naar afzonderlijke machines of afdelingen.
- Je tekent **vanaf de klant terug**, stroomopwaarts, met potlood, op de werkvloer bij de gemba (Japans voor "de werkelijke plek", hier de productievloer).
- De kernmetrieken zijn **takttijd, cyclustijd, voorraaddagen, doorlooptijd en de flow-ratio** (ook procescyclusefficiëntie of activiteitsratio genoemd). Voorraaddagen volgen uit de wet van Little: voorraad gedeeld door vraag.
- De kaart van de huidige toestand is maar de helft van de methode. Resultaten komen van de **kaart van de toekomstige toestand**, opgesteld met duidelijke ontwerprichtlijnen, en een **implementatieplan** met verantwoordelijken en data.
- De klassieke kaart is een **momentopname** die op gemiddelden is gebaseerd. Bij grote productvariëteit en wisselende vraag breiden dynamische simulatie en automatisch verzamelde data de analyse uit.
- **Value Stream Management** maakt van een eenmalige workshop een doorlopende leidinggevende taak met een verantwoordelijke value stream manager.

### Leesroutes voor drukke lezers

| Je bent … | Lees eerst |
|---|---|
| Nieuw in Lean, of student | Hoofdstukken 1 tot 4 (definitie, geschiedenis, doelen, symbolen) |
| Een beginnende facilitator of Lean-coach | Hoofdstukken 5 tot 8 (stapsgewijze handleiding met workshopagenda, metrieken, voorbeeld, ontwerp van de toekomstige toestand) en 14 (veelgemaakte fouten) |
| Een fabrieksmanager of operationeel leidinggevende | Hoofdstuk 7 (voorbeeld met cijfers van huidige en toekomstige toestand), hoofdstukken 10 tot 13 (beperkingen, dynamische en digitale VSM, Value Stream 4.0, Value Stream Management) |
| Een IT-, MES- of Microsoft 365/Azure-verantwoordelijke | Hoofdstukken 11 (dynamische en digitale VSM), 12 (Value Stream 4.0) en 15 (softwarecategorieën) |

## Inhoudsopgave

1. Wat is value stream mapping? Definitie en het verschil met procesmapping
2. Geschiedenis: van het materiaal- en informatiestroomdiagram van Toyota tot "Learning to See"
3. Doelen en voordelen van value stream mapping
4. Symbolen voor value stream mapping: volledig referentieoverzicht
5. Een value stream map maken: stapsgewijze gids voor de huidige situatie
6. Metrieken en formules voor value stream mapping
7. Voorbeeld van value stream mapping: één value stream volledig berekend
8. Future state mapping: ontwerprichtlijnen van Rother/Shook en Erlach
9. Verspilling opsporen: de 8 verspillingen en het spaghettidiagram
10. Grenzen van traditionele value stream mapping
11. Dynamische en digitale value stream mapping
12. Value Stream 4.0: informatielogistiek als tweede dimensie
13. Value stream management: de value stream aansturen als leidinggevende taak
14. Veelgemaakte fouten bij value stream mapping en hoe u ze voorkomt
15. Software voor value stream mapping: categorieën vergeleken
16. Digitale value stream mapping met iFAKT Polaris VSM en BSM
17. Value stream management in softwareontwikkeling: het verschil
18. Bewijs en onderzoekspublicaties
19. FAQ: veelgestelde vragen over value stream mapping
20. Conclusie

## 1. Wat is value stream mapping? Definitie en het verschil met procesmapping

Het Lean Enterprise Institute (LEI) definieert value stream mapping als "het in kaart brengen van elke stap in de materiaal- en informatiestromen die nodig zijn om een product van bestelling tot levering te krijgen" [45]. ASQ noemt het "een lean-instrument dat gebruikmaakt van een stroomdiagram waarin elke stap van het proces wordt vastgelegd" [46]. Preciezer gesteld: voor één productfamilie toont een value stream map alle activiteiten die nodig zijn om een product van grondstof tot klant te brengen. Daaronder vallen waardetoevoegende en niet-waardetoevoegende activiteiten, de fysieke materiaalstroom en de informatiestroom die die stroom aanstuurt. Het resultaat past op één groot vel, meestal 11 × 17 in (tabloid, dicht bij het A3-formaat dat in Europa wordt gebruikt), en wordt getekend met standaardsymbolen.

De **value stream** is de som van die activiteiten. In het Engels zijn "value stream mapping" en "VSM" de standaardtermen; "value stream analysis" wordt ook gebruikt, vooral voor het werk aan de huidige situatie. Klaus Erlach van het Fraunhofer-instituut voor Productietechniek en Automatisering IPA in Stuttgart trekt een duidelijke grens tussen **value stream analysis** (het vastleggen en beoordelen van de huidige situatie) en **value stream design** (het ontwerpen van de toekomstige situatie) [3][4]. Samen vormen ze de value stream-methode. De Duitse vereniging voor industriële bedrijfskunde REFA definieert de analyse in vergelijkbare bewoordingen als een methode om alle processen en stromen van een waardetoevoegend proces zichtbaar te maken [37].

Sinds maart 2020 bestaat er een internationale norm, **ISO 22468:2020 "Value stream management (VSM)"**. ISO omschrijft die als richtlijnen voor het verzamelen, evalueren en voortdurend verbeteren van value stream-gegevens en voor het beoordelen van value streams met gedefinieerde KPI's, toepasbaar op materiaal-, energie- en datagerelateerde processen [40]. De inhoudsopgave (gepubliceerd door DIN, het Duitse normalisatie-instituut) structureert value stream management in basisprocedure, value stream analyse, value stream design, value stream planning, en de beoordeling en bijstelling van value streams, met een informatieve bijlage over datakaders en toepassingsvoorbeelden [40]. ISO bevestigde de norm als actueel in de herziening van 2025 [40]. Het is een nuttige referentie als u de methode wilt verankeren in een bedrijfsbreed productiesysteem.

### Hoe VSM verschilt van verwante methoden

| Methode | Focus | Verschil met value stream mapping |
|---|---|---|
| Procesmapping / stroomdiagram | afzonderlijke procedures, vaak binnen één afdeling | geen informatiestroom, geen voorraad, geen tijdlijn |
| Materiaalstroomanalyse | transportroutes, hoeveelheden, indeling | kijkt naar logistiek, niet naar hoe informatie de stroom aanstuurt |
| Waardeanalyse / waardetechniek (in Duitsland: VDI 2800) | functies en kosten van een product | productgericht, niet stroomgericht |
| Porters waardeketen | strategische activiteiten van een bedrijf | managementmodel, geen operationeel stroomdiagram; de Engelstalige Wikipedia maakt hetzelfde onderscheid [49] |
| Swimlane-diagram / BPMN | bedrijfsprocessen met verantwoordelijkheden | sterk op kantoor, zwakker op voorraad en takt |
| Simulatie | tijdsafhankelijk gedrag van een systeem | dynamisch en gedetailleerd maar meer werk; vult VSM aan (zie paragraaf 11) |

Wat value stream mapping onderscheidt, is de combinatie van drie zaken op één pagina: materiaalstroom, informatiestroom en een tijdlijn. De inleiding van *Learning to See* legt uit dat Toyota drie stromen in de productie onderwijst (materiaal, informatie en mensen/processen) en dat de mapping-methode de eerste twee behandelt, zodat producenten "denken in termen van stroom in plaats van losse productieprocessen" [1].

## 2. Geschiedenis: van Toyota's Material and Information Flow Diagram tot "Learning to See"

Value stream mapping komt voort uit het Toyota Production System. Bij Toyota heet het hulpmiddel "Material and Information Flow Mapping". Toyota-medewerkers gebruikten het om de huidige en de gewenste situatie in beeld te brengen bij het plannen van Lean-implementaties, niet als trainingsinstrument [1]. De term "value stream" zelf wordt bij Toyota zelden gebruikt [1]. Het lexicon van LEI beschrijft het hulpmiddel ook als een ontwikkeling van Toyota, die Toyota een material and information flow diagram noemt [45].

Mike Rother ontdekte de mapping-methode tijdens zijn onderzoek naar de Lean-implementatiepraktijk van Toyota, formaliseerde haar en bouwde er een trainingsmethode omheen [1]. Samen met John Shook, die elf jaar bij Toyota in Japan en de VS had gewerkt [1], publiceerde hij in 1998 bij LEI het werkboek **"Learning to See"** (de inleiding is ondertekend in Ann Arbor, Michigan, en gedateerd mei 1998; de ondertitel van de eerste editie luidde "Value Stream Mapping to Create Value and Eliminate Muda", de huidige luidt "… to Add Value and Eliminate Muda") [1]. Het boek ontving in 1999 de Shingo Research and Professional Publication Award [1]. De casestudy over de fictieve stansfabriek "Acme Stamping" leidt de lezer van de huidige situatie via het zoeken naar verspilling naar de toekomstige situatie [1]. De huidige editie van LEI is van 2018 (ISBN 978-0-9667843-0-5, 148 pagina's) [1].

In de Duitstalige landen hebben drie boeken de verspreiding van de methode bepaald, waarvan één later ook in het Engels verscheen:

- **Rother/Shook: "Sehen lernen"**, de Duitse editie van het LEI-werkboek, uitgegeven door het Lean Management Institut in Aachen (versie 1.1, 2004, ISBN 978-3-9809521-1-8) [2].
- **Klaus Erlach: "Wertstromdesign. Der Weg zur schlanken Fabrik"** (Springer; 1e druk 2007, 2e druk 2010, ISBN 978-3-540-89867-2; 3e druk 2020, ISBN 978-3-662-58906-9) [3]. Erlach systematiseert de methode voor fabrieksplanning. Een Engelse editie, **"Value Stream Design: The Way Towards a Lean Factory"**, verscheen in 2012 bij Springer (copyright 2013, ISBN 978-3-642-12568-3) [4].
- **Thomas Klevers: "Wertstrom-Mapping und Wertstrom-Design"** (mi-Fachverlag, Landsberg am Lech 2007, ISBN 978-3-636-03097-9) [5].

De methode is later overgebracht naar kantoor- en kenniswerk, vooral door Karen Martin en Mike Osterling in "Value Stream Mapping: How to Visualize Work and Align Leadership for Organizational Transformation" (McGraw-Hill, gepubliceerd oktober 2013, copyright 2014, ISBN 978-0-07-182891-8) [6].

In de VS maakt de methode deel uit van de standaard Lean-toolkit die wordt onderwezen door LEI, ASQ en het NIST Manufacturing Extension Partnership (MEP). NIST MEP noemt VSM "vaak de eerste stap bij het toepassen van Lean-procesverbeteringen" [47]. In Duitsland maakt zij deel uit van zogenoemde holistische productiesystemen, waarvan de grondbeginselen worden beschreven in richtlijn **VDI 2870 deel 1** (juli 2012) van de Verein Deutscher Ingenieure (VDI). Volgens de VDI is de richtlijn deels nog geldig en wordt zij herzien [7].

## 3. Doelen en voordelen van value stream mapping

Het overkoepelende doel is een op de klant afgestemde stroom: materiaal moet met zo min mogelijk wachttijd door de fabriek bewegen, en elk proces mag alleen maken wat het volgende proces daadwerkelijk nodig heeft. Dat leidt tot concrete doelen:

- **Doorlooptijd verkorten.** De tijdlijn laat zien hoeveel van de totale doorlooptijd uit wachten bestaat. Omdat voorraad meestal het grootste deel van de doorlooptijd uitmaakt, is het verminderen ervan de sterkste hefboom.
- **Verspilling zichtbaar maken.** Overproductie, voorraad, wachttijd en onnodig transport zijn direct op de kaart te zien.
- **Planning vereenvoudigen.** De kaart laat zien naar hoeveel punten het ERP-systeem orders stuurt. Het doel is, waar mogelijk, op één punt te plannen.
- **Een gemeenschappelijke taal creëren.** Productie, logistiek, planning en verkoop bespreken dezelfde stroom op dezelfde pagina.
- **Verbeteringen prioriteren.** In plaats van lokale optimalisatie krijg je een implementatieplan dat de hele stroom als geheel aanpakt.

### Wanneer is value stream mapping de moeite waard?

De methode past het best bij repetitieve en gemengde productie met terugkerende producten, veel voorraad en lange levertijden, vóór wijzigingen in de indeling, nieuwe fabrieksontwerpen of capaciteitsinvesteringen, wanneer de levertrouw slecht is ondanks een hoge bezettingsgraad, en als startpunt van een Lean-programma. De klassieke vorm past minder goed bij pure job-shop- of engineer-to-order-productie met wisselende routings, omdat een stabiele productfamilie daar moeilijk te definiëren is. Uitgebreidere benaderingen, zoals simulatie of datagedreven analyse, helpen in die gevallen (zie hoofdstuk 11). Kleine en middelgrote Amerikaanse producenten die externe begeleiding willen, kunnen terecht bij de NIST MEP Centers, die value stream mapping opnemen in de lean-methoden waarbij zij helpen [47].

### Voor- en nadelen in het kort

| Voordelen | Nadelen |
|---|---|
| end-to-endoverzicht van de stroom vanuit het perspectief van de klant | momentopname op basis van gemiddelden |
| eenvoudige, standaard symbolen | weinig detail over varianten en omsteltvolgordes |
| lage drempel: papier, potlood, stopwatch | handmatige gegevensverzameling kost tijd en veroudert snel |
| kwantitatieve resultaten (doorlooptijd, stroomratio) | variabiliteit, storingen en effecten van batchgroottes worden niet getoond |
| verbindt materiaal- en informatiestroom | toekomstige situaties kunnen niet op papier getest worden |
| sterke basis voor verbeteracties en communicatie | effect hangt af van gedisciplineerde implementatie |

De rechterkolom verklaart waarom onderzoek en industrie de methode al meer dan tien jaar uitbreiden in dynamische en digitale richtingen [16][23]. Daarover meer vanaf hoofdstuk 10.

## 4. Waardestroomanalyse-symbolen: volledige referentietabel

De symbolen komen uit *Learning to See* [1][2] en zijn bewust eenvoudig gehouden, zodat iedereen ze met potlood kan tekenen. Boeken en softwarebibliotheken verschillen enigszins. Belangrijk is dat je team het eens wordt over een legenda en die consequent gebruikt. De onderstaande tabellen beschrijven de gangbare symbolen zoals gebruikt door Rother/Shook en Erlach [1][3].

### Symbolen voor proces- en materiaalstroom

| Symbool (uiterlijk) | Naam | Betekenis en gebruik |
|---|---|---|
| fabrieksgebouw met zaagtandvormig dak | klant / leverancier (externe bron) | klant rechtsboven, leverancier linksboven; eronder een datavak met vraag, leverfrequentie en verpakking |
| rechthoek met een kopregel en de procesnaam | procesvak | één proces waardoor materiaal continu stroomt; een nieuw vak begint waar de stroom stopt en voorraad zich opbouwt |
| rechthoek onder het procesvak | datavak | procesgegevens: cyclustijd, omsteltijd, uptime/beschikbaarheid, batchgrootte, aantal operators, shifts, uitval |
| driehoek met een "I" | voorraad | materiaal dat tussen twee processen ligt; hoeveelheid en voorraaddagen staan eronder geschreven |
| breed gestreepte pijl | duwpijl | materiaal wordt door het voorgaande proces geduwd volgens diens eigen planning, niet volgens de behoefte van het volgende proces |
| brede holle pijl | zending | grondstof van de leverancier naar de fabriek, of eindproduct van de fabriek naar de klant |
| vrachtwagen (of trein, vliegtuig, schip) | externe transport | transportmiddel met leverfrequentie, bijv. "2× per week" |
| links open schap | supermarkt | gecontroleerde buffervoorraad waaruit het klantproces afneemt; het leverende proces vult alleen aan wat er is weggenomen |
| cirkelpijl | afname (pull) | fysieke afname uit de supermarkt door het volgende proces |
| pijl met "FIFO" en een maximale hoeveelheid | FIFO-baan | beperkte wachtrij tussen twee processen; onderdelen gaan in volgorde van aankomst, en het leverende proces stopt wanneer het maximum is bereikt |
| driehoek met een veiligheidsnotitie | veiligheids- of buffervoorraad | voorraad tegen vraagschommelingen (buffer) of procesuitval (veiligheid) |
| cirkel met het hoofd van een operator | operator | aantal personen bij een proces |

### Symbolen voor informatiestroom

| Symbool (uiterlijk) | Naam | Betekenis en gebruik |
|---|---|---|
| dunne rechte pijl | handmatige informatiestroom | informatie op papier of mondeling, bijv. routekaart, pakbon, mondelinge instructie |
| bliksempijl (zigzag) | elektronische informatiestroom | EDI-, ERP- of MES-berichten, e-mail |
| rechthoek "Productiebesturing" | productiebesturing | planning, MRP of ERP, vaak met de planningsfrequentie |
| kaart met afgesneden hoek, ingevuld | productiekanban | signaal aan een proces om een bepaalde hoeveelheid te maken |
| kaart met afgesneden hoek, gearceerd of anders gemarkeerd afhankelijk van de bibliotheek | afnamekanban | instructie aan een materiaalmedewerker om onderdelen uit de supermarkt op te halen |
| driehoek op zijn punt | signaalkanban | activeert een batch wanneer de supermarktvoorraad het bestelpunt bereikt; typisch voor processen met omsteltijden |
| brievenbusachtig symbool | kanbanpost | plaats waar kanbans worden verzameld voor afhaling |
| gestreepte pijl met kanban | kanbanroute | route van de kaarten terug naar het leverende proces |
| doos met een raster van vakjes "OXOX" | heijunka-box (nivelleringsbox) | hulpmiddel voor het nivelleren van volume en mix bij het pacemakerproces |
| brilletje | go-see-planning | planning op basis van visuele controle in plaats van systematische signalen; een teken dat verbetering nodig is |

### Algemene symbolen

| Symbool (uiterlijk) | Naam | Betekenis en gebruik |
|---|---|---|
| gekartelde uitbarsting ("kaizen-uitbarsting") | verbeterbehoefte | markeert een plek op de huidige of toekomstige stroomkaart waar verbetering nodig is |
| vierkante golflijn langs de onderkant | tijdlijn (doorlooptijdladder) | wachttijden (voorraaddagen) op het ene niveau, bewerkingstijden op het andere; totalen voor doorlooptijd en bewerkingstijd rechts |

Sommige online handleidingen beschrijven de gestreepte pijl als elektronische informatiestroom [38]. In *Learning to See* staat de bliksempijl voor elektronische informatie en de dunne rechte pijl voor handmatige informatie [1]. Houd je aan die conventie, zodat kaarten leesbaar blijven over fabrieken en softwaretools heen. Een geïllustreerde toelichting bij de symbolen staat in de post [Value Stream Mapping Symbols and Icons Explained](https://www.m365.fm/community/u/mirko-p/blog/value-stream-mapping-symbols-icons/).

Voor kantoorprocessen, zoals orderverwerking vóór de productie, voegt Polaris BSM BPMN-swimlanes toe aan de symbolen van de waardestroom [30]. Ook het onderzoek heeft hetzelfde idee opgepakt: de Value Stream Mapping 4.0-aanpak van de TU Darmstadt omvat expliciet alle afdelingen die orders verwerken, vanaf het eerste contact met de klant [14].

## 5. Een waardestroomkaart maken: stapsgewijze gids voor de huidige situatie

De onderstaande gids volgt de logica van Rother/Shook en Erlach [1][3] en voegt praktische details toe. Voor een eerste kaart van een beheersbare waardestroom reken je op één tot twee dagen met een klein team [unverified]. De aanbevelingen over de teamgrootte lopen uiteen: ASQ noemt ongeveer 10 leden ideaal en adviseert een kaizen-evenement van drie dagen als start [46], terwijl een Duitse praktijkgids van Mind Logistik een klein team van maximaal zes personen verkiest [42]. Beide zijn praktijkadviezen, geen onderzoeksbevindingen. Kies het kleinere team als de waardestroom kort is en het grotere als veel afdelingen erbij betrokken zijn.

> **Als je voor de eerste keer faciliteert: een beproefde agenda**
>
> - **Team:** mensen uit de productie (supervisor of ploegleider), logistiek, productieplanning, onderhoud en kwaliteit; voeg verkoop of ordermanagement toe als de levertijd het probleem is. De toekomstige eigenaar van de waardestroom neemt deel.
> - **Materialen:** papier van 11 × 17 inch of een rol bruin papier, potlood en gum, klembord, stopwatch, een telblad voor voorraden en een vooraf afgesproken symbolenlegenda.
> - **Vooraf verduidelijken:** productfamilie, klantvraag van de afgelopen maanden, ploegenpatroon en pauzes. Kondig de rondgang in de betrokken gebieden aan en leg uit dat processen worden beoordeeld, niet mensen.
> - **Dag 1:** inleiding over doel en symbolen (ongeveer één uur), de stroom in paren van de verzending terug naar de ontvangst lopen, de gegevens samenvoegen tot één kaart, de kengetallen berekenen.
> - **Dag 2 of een vervolgsessie:** de kaart valideren met de gebieden, kaizen-uitbarstingen toevoegen, de vragen voor de toekomstige situatie doorlopen (sectie 8), het implementatieplan met eigenaren starten.
>
> Duur en samenstelling van het team zijn ervaringswaarden en hangen af van de omvang van de waardestroom [unverified].

### Stap 1: Doel en scope bepalen

Bepaal vóór de eerste rondgang welke vraag de kaart moet beantwoorden. Voorbeelden: Waarom bedraagt onze levertijd 15 dagen terwijl de klant 5 verwacht? Hoeveel vloeroppervlak winnen we door de voorraad te verlagen? Stel de grenzen vast. De gebruikelijke scope is "door to door", van ontvangst tot verzending binnen één fabriek [1]. Een waardestroom over meerdere fabrieken of leveranciers (uitgebreide waardestroom) is de tweede stap, niet de eerste.

Wijs ook een eigenaar aan. Rother/Shook adviseren om de verantwoordelijkheid voor de waardestroom bij één persoon te leggen, de waardestroommanager, in plaats van die over afdelingen te verdelen. LEI definieert deze rol als "een persoon aan wie duidelijke verantwoordelijkheid is toegekend voor het succes van een waardestroom" [10]. Meer hierover in sectie 13.

### Stap 2: De productfamilie bepalen

Een productfamilie is een groep producten die gelijkaardige bewerkingsstappen doorlopen op gedeelde apparatuur. Het hulpmiddel hiervoor is een **product-procesmatrix**: producten of varianten in de rijen, processen in de kolommen. Producten met grotendeels dezelfde vinkjes vormen een familie. ASQ stelt voor te zoeken naar producten die ongeveer 80% van hun stappen delen [46]. Als vuistregel geldt dat het werkinhoud van producten binnen één familie niet sterk mag verschillen [unverified]. De Duitstalige Wikipedia benadrukt dat waardestromen worden gevormd langs procesketens of materiaalstromen, en dat splitsing per functie ongebruikelijk is omdat die tegen korte doorlooptijden werkt [27].

Kies voor je eerste kaart een familie met een hoog aandeel in de omzet of een dringend probleem. Een Pareto-analyse (ABC) op volume en omzet helpt daarbij.

### Stap 3: Klantvraag vastleggen

Begin de kaart rechtsboven met het klantsymbool. Schrijf in het gegevensvak de vraag (bijv. stuks per maand), de variantmix, de batchgrootte of verpakkingshoeveelheid, de leverfrequentie en de gewenste levertijd. Bereken uit de vraag en de beschikbare werktijd de **takttijd** (formule in sectie 6). De takttijd is het referentiepunt voor elke andere beoordeling.

### Stap 4: Het proces lopen op de gemba, terug vanaf de verzending

Loop de stroom tegen de richting in, van verzending naar ontvangst. Rother/Shook leggen uit dat je zo begint bij de processen die het dichtst bij de klant liggen, en die moeten het tempo bepalen [1]. De Duitstalige Wikipedia beschrijft eveneens het registreren vanaf de klant terug via de producent naar de leverancier [27].

Teken een procesvak voor elke sectie waarin materiaal continu stroomt. Waar materiaal blijft liggen, eindigt een procesvak en begint een voorraaddriehoek. Gebruik je eigen waarnemingen en een stopwatch, niet de ERP-data. Het ERP-systeem kent de standaardtijden uit de routings, maar niet wat er werkelijk gebeurt op de werkplek.

### Stap 5: Vul de datavakken in

Registreer minimaal de volgende gegevens per proces:

| Dataveld | Afkorting | Toelichting |
|---|---|---|
| Cyclustijd | C/T | tijd tussen twee goede stuks aan het einde van het proces |
| Bewerkingstijd (waardetoevoegende tijd) | P/T, VA | tijd waarin het werk daadwerkelijk waarde aan het stuk toevoegt |
| Omsteltijd | C/O | tijd van het laatste goede stuk van de oude batch tot het eerste goede stuk van de nieuwe batch |
| Uptime / beschikbaarheid | | aandeel van de geplande tijd waarin de apparatuur daadwerkelijk kan produceren; bepaal of omsteltijden zijn inbegrepen of apart worden geregistreerd |
| Batchgrootte / EPEI | | stuks per batch, of "every part every interval": hoe vaak elke variant wordt geproduceerd |
| Operators | | aantal personen per shift |
| Shifts | | aantal shifts en beschikbare tijd per shift na pauzes |
| Uitval / herbewerking | | aandeel defecte stuks |

Voor processen met meerdere machines naast elkaar noteer je het aantal machines en bereken je de effectieve cyclustijd van het proces (cyclustijd per machine gedeeld door het aantal machines).

### Stap 6: Tel de voorraad

Tel de voorraad op de vloer, niet in het systeem. Schrijf de hoeveelheid onder elke voorraaddriehoek en reken deze om naar **voorraaddagen** op basis van de dagelijkse vraag. Tel ook de voorraad die "niet meetelt": stuks in wachtzones, op karren, in hoeken voor herbewerking. Daar verstopt zich vaak het grootste deel van de wachttijd.

### Stap 7: Voeg externe materiaalstromen toe

Teken linksboven de belangrijkste leverancier (of de leveranciers van de belangrijkste grondstoffen) en verbind leverancier, ontvangst, verzending en klant met vrachtwagensymbolen en leverfrequenties.

### Stap 8: Teken de informatiestroom

De informatiestroom is het onderdeel dat teams het vaakst verwaarlozen, hoewel die verklaart waarom materiaal blijft liggen. Vraag bij elk proces: hoe weet dit proces wat het hierna moet maken? Typische antwoorden zijn een wekelijkse planning uit het ERP-systeem, een dagelijkse lijst van de voorman, een kanban, een roep over het gangpad, of "wat er maar staat". Teken productieplanning bovenaan in het midden, verbind klant en leverancier met elektronische of handmatige pijlen, en toon welke informatie elk proces bereikt. Waar een proces meerdere signalen of planningen door kijken krijgt, voeg de brillen toe voor go-see-planning.

Markeer daarna de materiaalstromen tussen processen als push (gestreepte pijl), FIFO of pull (supermarkt en afroep).

### Stap 9: Teken de tijdlijn en bereken de kengetallen

De tijdlijn komt onder de processen. Op de ene lijn vul je de voorraaddagen in; op de andere de bewerkingstijden van de processen. Rechts tel je beide op tot de **doorlooptijd** en de **bewerkingstijd** en bereken je de **flow ratio**. Bij vertakte waardestromen bepaalt het langste pad de doorlooptijd [41].

### Stap 10: Markeer verspilling en valideer

Markeer problemen met kaizen-uitroepstekens: processen met cyclustijden boven takt, hoge voorraad, lange omsteltijden, lage uptime, meerdere planningspunten. Bespreek de afgeronde kaart met de medewerkers in de betrokken gebieden. Validatie door de mensen op de vloer voorkomt dat een werkplaatsteam een waardestroom tekent die in de fabriek niet bestaat.

### Checklist huidige situatie

- [ ] Doel, scope en eigenaar van de waardestroom vastgelegd
- [ ] Productfamilie vastgelegd met een product-procesmatrix
- [ ] Klantvraag, varianten en takttijd bepaald
- [ ] Alle processen vastgelegd op de vloer en stroomopwaarts
- [ ] Datavakken ingevuld met gemeten waarden
- [ ] Voorraad geteld en omgerekend naar dagen
- [ ] Leveranciers, klant en transport getekend
- [ ] Informatiestroom per proces verduidelijkt
- [ ] Tijdlijn, doorlooptijd, bewerkingstijd en flow ratio berekend
- [ ] Kaizen-uitroepstekens toegevoegd en kaart gevalideerd met medewerkers

## 6. Formules en metrieken voor waardestroomanalyse

Metrieken maken waardestroomkaarten vergelijkbaar. In ZWF (Zeitschrift für wirtschaftlichen Fabrikbetrieb, een Duitstalig tijdschrift voor productietechniek, uitgegeven door De Gruyter) tonen Jörg Drees en Christoph Sack aan dat waardestroommetrieken zoals voorraadreductie, benutting van middelen, leverbetrouwbaarheid en korte doorlooptijden schijnbaar tegenstrijdige doelen nastreven, maar bij correcte toepassing consistente aanbevelingen opleveren. Zij stellen een kernset van metrieken voor die samen met gerichte Lean-methoden regelkringen vormen [19]. De onderstaande formules behandelen die kernset. Meer definities staan op de entiteitspagina's [Lead Time](https://www.m365.fm/entity/lead-time/), [Cycle Time](https://www.m365.fm/entity/cycle-time/) en [Takt Time](https://www.m365.fm/entity/takt-time/).

**Een opmerking over terminologie.** Amerikaanse gidsen gebruiken verschillende namen voor dezelfde verhouding. Wat Duitse teksten *Flussgrad* noemen, verschijnt in het Engels als flow ratio, process cycle efficiency (PCE), value-added ratio, flow efficiency of, in de terminologie van Karen Martin, activity ratio ("de som van de procestijden van alle afzonderlijke stappen gedeeld door de totale doorlooptijd") [44]. Deze gids gebruikt overal **flow ratio**. Evenzo betekenen "inventory days", "days of supply" en "days of inventory" hetzelfde.

### Takt time

> **Takt time = beschikbare werktijd per periode ÷ klantvraag per periode**

LEI geeft het voorbeeld van een widgetfabriek die 480 minuten per dag draait terwijl klanten 240 widgets per dag vragen, wat een takt time van twee minuten oplevert [8]. ASQ werkt dezelfde formule uit met 22.000 seconden en 200 stuks, wat 110 seconden per stuk oplevert [46]. De beschikbare werktijd is de shifttijd minus geplande pauzes. Ongeplande stilstand wordt niet afgetrokken; die hoort bij de beschikbaarheid. Het woord "takt" is Duits (het betekent maat of tel, zoals in de muziek). Volgens LEI werd takt voor het eerst als productiemanagementinstrument gebruikt in de Duitse luchtvaartindustrie in de jaren dertig en werd het in de jaren vijftig veel toegepast bij Toyota [8].

### Cycle time en effectieve cycle time

Cycle time is de tijd tussen twee goede stuks aan het einde van een proces. Om die te vergelijken met takt time, moet men beschikbaarheid en afkeur meenemen:

> **Effectieve cycle time = cycle time ÷ (beschikbaarheid × first-pass yield)**

Een proces met een cycle time van 98 seconden en 85% beschikbaarheid produceert effectief één stuk elke 115 seconden. Tegenover een takt time van 117 seconden is het bijna volledig belast, hoewel de nominale cycle time 16% reserve suggereert.

Let op een veelvoorkomende verwarring: sommige Engelstalige gidsen gebruiken "cycle time" voor de totale tijd die een eenheid in het proces doorbrengt, of zelfs voor de levertijd van de leverancier. Op een waardestroomkaart betekent cycle time altijd het interval tussen twee goede stuks aan het einde van één proces.

### Inventory days en de wet van Little

> **Inventory days = voorraad (stuks) ÷ dagelijkse vraag (stuks per dag)**

De Duitstalige Wikipedia berekent 280 stuks bij een dagelijkse vraag van 80 stuks als 3,5 dagen voorraad [27]. Deze berekening past de **wet van Little** toe, die John D. C. Little in 1961 bewees in het tijdschrift Operations Research [12]:

> **L = λ × W**, herschikt: **W = L ÷ λ**

L is de gemiddelde voorraad in het systeem, λ de gemiddelde doorvoersnelheid en W de gemiddelde verblijftijd in het systeem. Toegepast op een waardestroom: de gemiddelde tijd die een stuk in een buffer wacht, is gelijk aan de voorraad gedeeld door de verbruiksnelheid. De wet van Little geldt op lange termijn voor stabiele systemen. Voor afzonderlijke dagen met vraagpieken, of voor een systeem tijdens het opstarten, is de formule slechts een benadering. Dat is een van de redenen voor dynamische waardestroomanalyse (sectie 11).

### Lead time

> **Productie-lead time = Σ inventory days + Σ bewerkingstijden (langs het langste pad)**

Omdat bewerkingstijden meestal in seconden of minuten worden gemeten en voorraad in dagen, domineert de som van de inventory days het resultaat. Een diplomascriptie aan de Hochschule Mittweida (een Duitse hogeschool) vat Erlachs definitie van productie-lead time samen als de som van bewerkings- en procestijden plus de voorraadbereiken, waarbij het langste pad doorslaggevend is [41]. Martins woordenlijst formuleert het algemener: lead time is gelijk aan procestijd plus wachttijd [44].

### Processing time en process time

**Bewerkingstijd** is de tijd waarin aan het onderdeel wordt gewerkt. Erlach onderscheidt daarnaast **procestijd** voor stappen als drogen, uitharden of warmtebehandeling, die tijd kosten zonder dat er aan het onderdeel wordt gewerkt [41]. Beide tellen mee in de flow ratio.

### Flow ratio (procescycle-efficiëntie)

> **Flow ratio = (bewerkingstijd + procestijd) ÷ doorlooptijd × 100%**

De Duitstalige Wikipedia beschrijft de flow ratio als het aandeel van de pure bewerkingstijd in de totale doorlooptijd en noemt deze de kern-KPI van de waardestroomanalyse [27]. Let op de tijdbasis. Als de doorlooptijd in werkdagen is opgegeven, reken deze dan om naar seconden met behulp van de dagelijkse werktijd, zoals de formule van Erlach dat doet met de factor "dagelijkse werktijd" [41]. Als u in kalenderdagen rekent, daalt de flow ratio verder. Kies één conventie en houd die aan, anders zijn de huidige en de toekomstige situatie niet vergelijkbaar.

### Overige metrics

| Metric | Formule / definitie | Gebruik |
|---|---|---|
| Belasting ten opzichte van takt | effectieve cyclustijd ÷ takttijd | waarden boven 100% wijzen op een knelpunt |
| Benodigd aantal operators | Σ werkinhoud ÷ takttijd | basis voor lijnbalancering |
| EPEI | tijd totdat elke variant één keer is geproduceerd | toont flexibiliteit en effecten van batchgrootte |
| Aandeel omsteltijd | (aantal omstellingen × omsteltijd) ÷ beschikbare tijd | toont hoeveel capaciteit vrijkomt voor kleinere batches |
| Belasting inclusief omstellingen | (dagelijkse vraag × cyclustijd + omstellingen × omsteltijd) ÷ (beschikbare tijd × beschikbaarheid) | controleert of een toekomstige situatie met kleine batches nog aan de takt kan voldoen (voorbeeld in hoofdstuk 7) |
| Levering op tijd | op tijd geleverde orders ÷ alle orders | resultaatmetric vanuit het perspectief van de klant |
| %C&A (percentage compleet en correct) | aandeel van het werk dat de volgende stap compleet en foutloos ontvangt | kwaliteit van overdrachten; vooral gebruikt in kantoorwaardeketens [44] |
| OEE | beschikbaarheid × prestatie × kwaliteit | effectiviteit van de installatie; het datavak verkort dit vaak tot uptime |

Een operatorbalansdiagram (een staafdiagram van effectieve cyclustijden met een horizontale lijn voor de takttijd) maakt knelpunten en overcapaciteit in één oogopslag zichtbaar. Erlach gebruikt het om te laten zien hoe goed de capaciteit op de takt is afgestemd [3]. De Duitstalige Wikipedia merkt op dat cyclustijden dicht bij de takt op knelpunten wijzen, en cyclustijden ruim onder de takt op overcapaciteit en verspilling [27].

## 7. Voorbeeld van waardestroomanalyse: één waardestroom volledig doorgerekend

Het volgende voorbeeld is **fictief en speciaal voor deze handleiding opgesteld**. Het laat zien hoe de kengetallen met elkaar samenhangen en doorloopt de huidige en de toekomstige situatie met dezelfde basisgegevens.

### Uitgangspunt

Een leverancier maakt een productfamilie van hydraulische klepbehuizingen in vijf varianten met dezelfde routing: zagen, draaien, frezen, wassen, assembleren. De klant roept gemiddeld 9.200 stuks per maand af, verdeeld over 20 werkdagen. De fabriek draait twee ploegen van elk 8 uur, met elk een pauze van 30 minuten.

**Stap A: Bereken de takttijd**

- Dagelijkse vraag: 9.200 stuks ÷ 20 dagen = **460 stuks per dag**
- Beschikbare werktijd: 2 × (480 min − 30 min) = 900 min = **54.000 s per dag**
- Takttijd: 54.000 s ÷ 460 stuks = **117,4 s per stuk**

### Huidige situatie: procesgegevens

| Proces | Cyclustijd | Omsteltijd | Beschikbaarheid | Effectieve cyclustijd | Belasting t.o.v. takt |
|---|---|---|---|---|---|
| Zagen | 45 s | 30 min | 95% | 47,4 s | 40% |
| Draaien | 98 s | 60 min | 85% | 115,3 s | 98% |
| Frezen | 125 s | 45 min | 90% | 138,9 s | **118%** |
| Wassen | 40 s | 0 min | 98% | 40,8 s | 35% |
| Assembleren | 105 s | 15 min | 95% | 110,5 s | 94% |

Vereenvoudigingen: procestijd is hier gelijk aan de cyclustijd, omdat elk proces het ene onderdeel na het andere bewerkt. Uitval wordt buiten beschouwing gelaten. De beschikbaarheid dekt alleen storingen; omsteltijden worden apart behandeld.

**Knelpuntbevinding:** Frezen ligt al boven de takt bij een nominale 125 s, en bij een effectieve 138,9 s ligt het 18% erboven. Per dag maakt frezen 54.000 s × 0,90 ÷ 125 s = **389 stuks** in plaats van de benodigde 460. Omsteltijden verlagen dat aantal nog verder. De fabriek dicht de kloof met overwerkploegen op zaterdag. Draaien lijkt op papier onkritisch (98 s), maar is bij meerekening van de beschikbaarheid belast met 98%. Als je de beschikbaarheid negeert, mis je dit tweede bijna-knelpunt.

### Huidige situatie: voorraad en doorlooptijd

| Voorraad | Hoeveelheid | Voorraaddagen (hoeveelheid ÷ 460) |
|---|---|---|
| Grondstof voor het zagen | 4.600 stuks | 10,0 dagen |
| Na zagen | 1.380 stuks | 3,0 dagen |
| Na draaien | 920 stuks | 2,0 dagen |
| Na frezen | 690 stuks | 1,5 dagen |
| Na wassen | 460 stuks | 1,0 dag |
| Eindproducten | 1.150 stuks | 2,5 dagen |
| **Totaal** | **9.200 stuks** | **20,0 dagen** |

- **Procestijd:** 45 + 98 + 125 + 40 + 105 = **413 s** (net iets minder dan 7 minuten)
- **Doorlooptijd:** 20,0 werkdagen + 413 s ≈ **20 werkdagen**
- **Flow-ratio (op basis van werktijd):** 413 s ÷ (20 × 54.000 s) = 413 ÷ 1.080.000 = **0,038%**
- **Flow-ratio (op basis van kalendertijd):** 20 werkdagen komen overeen met ongeveer 28 kalenderdagen; 413 s ÷ (28 × 86.400 s) = **0,017%**

**Controle met de Wet van Little:** totale voorraad van 9.200 stuks ÷ doorvoer van 460 stuks per dag = 20 dagen [12]. De som van de afzonderlijke voorraaddagen en de totaalberekening komen overeen. Als deze controle niet klopt op je kaart, heb je ofwel voorraad gemist, ofwel referentiewaarden door elkaar gehaald.

**Bevinding informatiestroom:** Productieplanning stuurt een wekelijks schema naar alle vijf processen. Elk proces produceert volgens het eigen schema en duwt materiaal door. Er is geen hoeveelheidsgrens tussen processen, dus voorraad hoopt zich op voor het knelpunt. De supervisor assemblage grijpt dagelijks in met spoedorders (go-see planning).

### Toekomstige situatie: verbeteracties

Met de ontwerprichtlijnen uit hoofdstuk 8 ontwerpt het team deze toekomstige situatie:

1. **Knelpunt bij frezen opheffen:** verbeteringen aan gereedschappen en spanmiddelen verlagen de cyclustijd van 125 naar 95 s; een TPM-initiatief (total productive maintenance, preventief onderhoud met betrokkenheid van operators) verhoogt de beschikbaarheid van 90 naar 95%.
2. **Draaien stabiliseren:** programma-optimalisatie verlaagt de cyclustijd van 98 naar 90 s; TPM verhoogt de beschikbaarheid van 85 naar 92%.
3. **Montage in balans brengen:** de werkinhoud wordt herverdeeld en de cyclustijd daalt van 105 naar 95 s.
4. **Omsteltijden verkorten (SMED):** omdat elke variant dagelijks wordt gemaakt, moet elk proces per dag vijf keer omstellen. SMED (single-minute exchange of die: de omstelling voorbereiden terwijl de machine nog draait) verlaagt de omsteltijd bij draaien van 60 naar 10 min, bij frezen van 45 naar 10 min en bij montage van 15 naar 5 min. Zonder deze stap zou de toekomstige situatie niet haalbaar zijn: vijf omstellingen van elk 60 minuten passen niet in de vrije capaciteit van het draaien.
5. **FIFO-verbindingen:** draaien, frezen, wassen en montage worden verbonden door drie FIFO-banen met maximale hoeveelheden van 60, 30 en 30 stuks.
6. **Supermarkt na zagen:** omdat zagen veel sneller is en moet omstellen, ontkoppelt een supermarkt met een voorraad van een halve dag (230 stuks) dit proces. Een signaalkanban start nieuwe batches.
7. **Montage als pacemaker:** de planning stuurt klantorders alleen naar de montage. Een heijunka-box verdeelt de vijf varianten gelijkmatig over de dag. Bij een verpakkingshoeveelheid van 20 stuks is de pitch 20 × 117,4 s ≈ 39 minuten.
8. **Supermarkt eindproducten:** één dag voorraad (460 stuks) buffert schommelingen in de afroepen van klanten.
9. **Aansluiting leveranciers:** leveringen van grondstoffen stijgen van één keer naar twee keer per week; de grondstoffenvoorraad daalt naar vijf dagen (2.300 stuks).

### Toekomstige situatie: capaciteitscontrole met omsteltijden

Een toekomstige situatie moet aan de takttijd voldoen, ook met dagelijkse omstellingen. De controle berekent daarom twee waarden: de effectieve cyclustijd vergeleken met de takt, en de belasting inclusief omsteltijden.

> **Belasting inclusief omsteltijden = (dagelijkse vraag × cyclustijd + omstellingen × omsteltijd) ÷ (beschikbare tijd × beschikbaarheid)**

| Proces | Cyclustijd | Omsteltijd | Beschikbaarheid | Effectieve cyclustijd | Belasting vs. takt | Belasting incl. 5 omstellingen |
|---|---|---|---|---|---|---|
| Zagen | 45 s | 30 min | 95% | 47,4 s | 40% | 58% |
| Draaien | 90 s | 10 min | 92% | 97,8 s | 83% | 89% |
| Frezen | 95 s | 10 min | 95% | 100,0 s | 85% | **91%** |
| Wassen | 40 s | 0 min | 98% | 40,8 s | 35% | 35% |
| Montage | 95 s | 5 min | 95% | 100,0 s | 85% | 88% |

Uitgewerkt voor frezen: (460 × 95 s + 5 × 600 s) ÷ (54.000 s × 0,95) = 46.700 ÷ 51.300 = 91%. Alle processen blijven onder 100%, met de hoogste waarde bij frezen. De pacemaker, montage, heeft nog enige reserve voor schommelingen in de afroepen, met 88%.

### Toekomstige situatie: resultaat

| Metriek | Huidig | Toekomstig | Verandering |
|---|---|---|---|
| Totale voorraad | 9.200 stuks | 2.300 + 230 + 120 + 460 = 3.110 stuks | −66% |
| Doorlooptijd (Little) | 20,0 werkdagen | 3.110 ÷ 460 = 6,8 werkdagen | −66% |
| Bewerkingstijd | 413 s | 45 + 90 + 95 + 40 + 95 = 365 s | −12% |
| Flow-ratio (basis werktijd) | 0,038% | 365 ÷ (6,76 × 54.000) = 0,100% | factor 2,6 |
| Knelpunt | frezen 118% (zonder omsteltijden) | hoogste belasting frezen 91% incl. omsteltijden | takt gehaald zonder zaterdagdiensten |
| Planningspunten | 5 (wekelijkse planning naar alle) | 1 (pacemaker montage) | eenvoudiger plannen |

De FIFO-banen zijn meegeteld op hun maximale hoeveelheden (60 + 30 + 30 = 120 stuks). In de praktijk zijn ze zelden vol, dus de toekomstige voorraad is een voorzichtige bovengrens.

Twee lessen uit het voorbeeld. Ten eerste leveren planning- en voorraadmaatregelen het grootste deel van de doorlooptijdreductie op, niet snellere machines. De bewerkingstijd daalt met 12%, de doorlooptijd met 66%. Ten tweede is de verbeterde flow-ratio van 0,1% nog steeds laag. Dat is typerend voor fabrieken met een buffer aan grondstoffen. Belangrijk is de richting, en een takttijd die betrouwbaar gehaald kan worden, ook met dagelijkse omstellingen.

## 8. Toekomstige-staattoewijzing: ontwerprichtlijnen van Rother/Shook en Erlach

Het ontwerp van de toekomstige staat beantwoordt de vraag hoe de waardestroom moet gaan stromen. *Learning to See* brengt lezers van de huidige staat naar een "kaart van een slankere toekomstige staat" en naar een waardestroomplan dat de implementatie stuurt en regelmatig wordt geëvalueerd [1].

### Kernvragen voor de toekomstige staat volgens Rother/Shook

Rother/Shook structureren het ontwerp aan de hand van een reeks kernvragen [1] (geparafraseerd):

1. Wat is de takttijd?
2. Produceren we naar een eindproductsupermarkt of direct naar verzending?
3. Waar kunnen we continue flow toepassen?
4. Waar hebben we supermarkt-pullsystemen nodig?
5. Op welk enkel punt in de productieketen (het pacemakerproces) plannen we de productie?
6. Hoe egaliseren we de productiemix bij het pacemakerproces?
7. Welke werkincrement geven we consequent vrij en nemen we af bij de pacemaker?
8. Welke procesverbeteringen zijn nodig om de toekomstige staat te laten werken?

### De richtlijnen van Rother en Shook

In een artikel voor de Lean Post van LEI (19 oktober 2022) vatten Mike Rother en John Shook de richtlijnen voor een slanke waardestroom als volgt samen [11]:

| Nr. | Richtlijn (oorspronkelijke formulering) | Wat het betekent |
|---|---|---|
| 1 | "Produce to your takt time" | de productie afstemmen op de klantvraag |
| 2 | "Develop continuous flow wherever possible" | waar mogelijk one-piece flow creëren |
| 3 | "Use supermarkets to control production where continuous flow does not extend upstream" | supermarkten gebruiken waar flow niet mogelijk is |
| 4 | "Try to send the customer schedule only to one production process" | klantorders naar slechts één proces sturen (de pacemaker) |
| 5 | "Distribute the production of different products evenly over a set time at the pacemaker process" | de productmix bij de pacemaker egaliseren (heijunka) |
| 6 | "Create an 'initial pull' by releasing and withdrawing small, consistent increments of work at the pacemaker process" | het productievolume egaliseren |

Secundaire bronnen noemen een zevende richtlijn uit *Learning to See*: het vermogen om in de processen stroomopwaarts van de pacemaker elk onderdeel elke dag te maken ("every part every day"), en later elke shift of elk uur [1] [unverified: niet gecontroleerd tegen de boektekst]. Het voorbeeld in sectie 7 laat zien waarom deze richtlijn korte omsteltijden vereist.

### Ontwerprichtlijnen van Erlach

Klaus Erlach ordent het ontwerp van waardestromen in acht ontwerprichtlijnen die op elkaar voortbouwen [3]. Ze vallen in drie groepen uiteen: ontwerp van productieprocessen (richtlijnen 1 en 2), productiesturing (3 tot en met 5) en productieplanning (6 tot en met 8). De namen hieronder volgen Erlachs Duitse boek en het overzicht op zijn website; de Engelse editie (Springer 2012/2013) wordt door de uitgever omschreven als het overbrengen van "ten design guidelines" [4], dus de nummering kan in de Engelse tekst afwijken.

| Nr. | Ontwerprichtlijn [3] | Kernvraag voor uw waardestroom |
|---|---|---|
| 1 | Afstemming op takttijd | Zijn alle processen betrouwbaar ontworpen om de takttijd te halen, en waar is overcapaciteit? |
| 2 | Procesintegratie | Welke processtappen kunnen fysiek en organisatorisch worden samengevoegd tot continue flow? |
| 3 | FIFO-koppeling | Waar kunnen processen worden gekoppeld via beperkte FIFO-banen in plaats van onbeperkte opslag? |
| 4 | Kanban-sturing | Waar is een supermarkt met kanban nodig omdat processen verschillende cyclustijden of omsteltijden hebben? |
| 5 | Pacemakerproces | Bij welk enkel proces worden klantorders ingepland? |
| 6 | Bepalen van de vrijgaveeenheid | In welk tijdsincrement wordt werk bij de pacemaker vrijgegeven (pitch)? |
| 7 | Egalisatie van de productiemix | Hoe worden varianten gelijkmatig verdeeld, en waar heeft campagnevorming zin? |
| 8 | Knelpuntsturing | Hoe wordt een resterend knelpunt gestuurd zodat het nooit leeg loopt? |

De volgorde volgt de logica van de drie groepen: een geëgaliseerde productiemix (richtlijn 7) veronderstelt dat processen op takt zijn afgestemd en dat sturing via FIFO, kanban en pacemaker werkt (richtlijnen 1 tot en met 5).

### Begrippen van de toekomstige staat in het kort

- **Continue stroom (one-piece flow):** onderdelen bewegen één voor één van proces naar proces zonder tussenopslag.
- **Supermarkt en kanban:** het stroomafwaartse proces haalt op, het leverende proces vult alleen aan wat is weggenomen. Meer op de entiteitspagina's [Kanban](https://www.m365.fm/entity/kanban/) en [Pull System](https://www.m365.fm/entity/pull-system/).
- **FIFO-baan:** een wachtrij met een maximale hoeveelheid; wanneer die vol is, stopt het leverende proces. FIFO is eenvoudiger dan kanban en past bij onderdelen met veel variatie die niet op voorraad gebouwd mogen worden.
- **Pacemaker-proces:** het enige proces dat klantorders ontvangt. Stroomopwaartse processen worden aangestuurd via supermarkt-pull of FIFO-banen; stroomafwaartse processen lopen in continue stroom of FIFO.
- **Heijunka:** nivellering van volume en mix, bijvoorbeeld met een heijunka-box met een vak per tijdsinterval.
- **Pitch / releaseeenheid:** het tijdsinterval waarin werk wordt vrijgegeven en eindproducten worden afgevoerd: takttijd × verpakkingshoeveelheid; in het voorbeeld van paragraaf 7 is dat 20 × 117,4 s ≈ 39 minuten.
- **SMED en TPM:** SMED verkort omsteltijden door het omstelwerk voor te bereiden terwijl de machine nog draait; TPM verhoogt de beschikbaarheid door preventief onderhoud. Beide zijn vaak voorwaarden voor een toekomstige situatie met kleine batches.

### Van toekomstige situatie naar implementatieplan

Een toekomstige situatie zonder plan is slechts een mooi poster. Verdeel de toekomstige situatie in **waardestroomlussen**: de pacemaker-lus (van de pacemaker naar de klant) en de stroomopwaartse lussen tot aan elke supermarkt. Elke lus krijgt doelen, acties, eigenaren en data. Rother en Shook raden aan te beginnen met de pacemaker-lus omdat deze het dichtst bij de klant ligt [unverified: bron niet gespecificeerd in de tekst]. Plan in cycli van enkele maanden en evalueer de voortgang regelmatig, bijvoorbeeld in een maandelijkse waardestroomreview.

Waardering is een veelvoorkomend obstakel. Busch, Niehues en Maassen beschrijven in ZWF dat de industrie het potentieel van waardestromen vaak niet realiseert omdat het voordeel slecht gekwantificeerd is. Zij breiden de waardestroommethode uit met een kostengebaseerd waarderingsmodel dat operationele en strategische maatstaven met elkaar verbindt [25]. Voor uw implementatieplan betekent dat: reken de vermindering van voorraad, de vrijgekomen vloeroppervlakte en de verkorting van de doorlooptijd om naar geldbedragen voordat u om budget vraagt.

## 9. Verspilling opsporen: de 8 verliezen en het spaghettidiagram

Waardestroomanalyse is een hulpmiddel om verspilling (Japans: muda) op te sporen. De indeling van de zeven verliezen gaat terug op Taiichi Ohno [9][32]; LEI noemt ze als overproductie, wachten, transport, bewerking, voorraad, bewegen en herstelwerk [9]. Jeffrey Liker voegde in "The Toyota Way" (2004) een achtste toe: ongebruikte creativiteit en vaardigheden van medewerkers [33]. In de VS worden de acht vaak aangeleerd met het acroniem DOWNTIME: defects, overproduction, waiting, non-utilized talent, transportation, inventory, motion, extra processing [51]. Een beknopt overzicht staat op de entiteitspagina [Eight Wastes](https://www.m365.fm/entity/eight-wastes/).

| Nr. | Verlies | Hoe je het herkent op de waardestroomkaart |
|---|---|---|
| 1 | Overproductie | duwpijlen, grote batches, voorraad na snelle processen; volgens LEI "de ergste vorm van verspilling omdat het bijdraagt aan de andere zes" [9] |
| 2 | Wachten | operators wachten op machines, materiaal of goedkeuringen; lage belasting ten opzichte van takt |
| 3 | Transport | veel vrachtwagen- en transportpijlen, tussenopslag tussen processen |
| 4 | Overbewerking | processtappen zonder klantwaarde, dubbele inspecties |
| 5 | Voorraad | voorraaddriehoeken met veel dagen, supermarkten zonder maximumhoeveelheden |
| 6 | Bewegen | lange looproutes voor medewerkers, zoeken naar onderdelen en gereedschap (beter zichtbaar in een spaghettidiagram) |
| 7 | Defecten / herstelwerk | afval en doorwerk in het databox, retourstroompijlen |
| 8 | Ongebruikt talent | go-see-planning, geen betrokkenheid bij het tekenen van de kaart, geen verbeteringsvoorstellen |

### Het spaghettidiagram als aanvulling

De waardestroomkaart toont de stroom op abstract niveau. Ze laat niet zien hoe ver onderdelen en mensen daadwerkelijk lopen. Daarvoor dient het **spaghettidiagram**: op een geschaalde plattegrond traceer je met een pen elke route van een onderdeel of een persoon. Het resultaat lijkt vaak op een bord spaghetti en maakt transport- en beweegverspilling tegelijk zichtbaar. LEI beschrijft het geval Thrustmaster of Texas, een in Houston gevestigde fabrikant van scheepsvoortstuwingsapparatuur, waar een spaghettidiagram van het assemblagegebied van de thrusters meer dan zeven mijl aan lopen en bijna 10 uur niet-waardetoevoegende tijd per eenheid aan het licht bracht; na een herinrichting van de lay-out gericht op stroom en standaardwerk meldde het bedrijf 18 maanden later 100% levering op tijd [43]. Gebruik het spaghettidiagram na de waardestroomkaart voor de processen met de meest opvallende kaizen-uitbarstingen. Details staan op de entiteitspagina [Spaghetti Diagram](https://www.m365.fm/entity/spaghetti-diagram/).

## 10. Grenzen der traditionellen Wertstrom-Analyse

Die papierbasierte Wertstrom-Analyse ist bewusst einfach gehalten. Diese Einfachheit ist ihre Stärke und zugleich ihre Grenze. In der Literatur werden vor allem fünf Schwächen diskutiert.

**1. Momentaufnahme.** Die Karte zeigt den Zustand eines Tages oder einer Woche. In der ZWF weisen Lugert und Winkler darauf hin, dass der statische Charakter der Wertstrom-Analyse unter den aktuellen Megatrends der Produktion zunehmend zum Problem wird, und fordern ein dynamisches Wertstrommanagement [23]. Das Fraunhofer IPA fragt, ob einzelne Momentaufnahmen ausreichen, um einen Produktionsprozess vollständig zu analysieren [22].

**2. Mittelwerte statt Verteilungen.** Datenkästchen enthalten Durchschnittswerte. Schwankende Zykluszeiten, Störungen und Nachfragespitzen verschwinden im Mittelwert. Das Gesetz von Little gilt für den langfristigen Durchschnitt stabiler Systeme [12], sagt aber nichts über die Streuung einzelner Aufträge aus.

**3. Produktvielfalt.** Bereits 2011 verwiesen Drees und Sack auf komplexere Wertschöpfungsketten, wachsende Zahl an Produktvarianten und alltägliche Nachfrageschwankungen [19]. Bei Hunderten von Varianten und unterschiedlichen Arbeitsplänen wird es nahezu unmöglich, eine Produktfamilie mit einheitlichen Zykluszeiten zu bilden.

**4. Manuelle Datenerfassung.** Nach Angaben des Fraunhofer IPA sind Daten von Klemmbrett und geschätzte Durchschnittswerte weniger aktuell, genau und vollständig als digital erfasste Daten [22]. In vielen Unternehmen werden Daten für die Wertstrom-Analyse nur manuell als Momentaufnahme erhoben [21]. Der Aufwand führt dazu, dass Karten selten aktualisiert werden.

**5. Kein Test des Zukunftszustands.** Ob FIFO-Bahnen mit 30 Teilen ausreichen oder ob ein Supermarkt bei Nachfragespitzen leerläuft, lässt sich auf Papier nicht prüfen. Türck, Weimer, Schubert und Drees (iFAKT GmbH) fragen daher, welche neuen Optimierungsmöglichkeiten entstehen, wenn der Zeitfaktor berücksichtigt wird [16].

Außerdem besteht eine inhaltliche Lücke: Die klassische Methode verbessert vor allem den Materialfluss. Der Informationsfluss wird zwar eingezeichnet, aber kaum bewertet. Hier setzt die Wertstrom-Analyse 4.0 an (Abschnitt 12) [13][15].

## 11. Dynamische und digitale Wertstrom-Analyse

Die Methode entwickelt sich entlang zweier Achsen weiter: **dynamisch** (Simulation des zeitlichen Verhaltens und der Variabilität) und **digital** (automatische Datenerfassung und kontinuierliche Berechnung von Kennzahlen). Beide Achsen ergänzen die klassische Methode; keine ersetzt sie.

### Von der statischen Karte zur Simulation

Bereits 2014 beschrieben Stefan Türck, Andreas Weimer, Lars Schubert und Jörg Drees von der iFAKT GmbH in der ZWF den Weg von der statischen Analyse von Wertströmen und ihren Kennzahlen zur **dynamischen Simulation** [16]. Ausgangspunkt war, dass die Modellierung von Wertströmen in vielen Fertigungsunternehmen etabliert ist und digitale Werkzeuge dafür zunehmend Akzeptanz finden [16]. Die dynamische Wertstrom-Analyse fragt nicht nur, wie hoch der durchschnittliche Bestand ist, sondern wie sich dieser über die Zeit entwickelt, wenn Aufträge schwanken, Maschinen ausfallen oder Rüstfolgen sich ändern.

In der Praxis wird die Wertstromkarte zu einem Modell, in dem jedes Symbol ein Verhalten hat. Ein Prozess hat nicht mehr eine feste Zykluszeit, sondern eine Verteilung; ein Supermarkt hat einen Meldebestand und ein Maximum; die Kundennachfrage folgt einer Zeitreihe. Die Simulation zeigt, ob der Zukunftszustand unter realistischen Bedingungen funktioniert, wo Puffer zu klein sind und welche Durchlaufzeitverteilung zu erwarten ist. Mehr zur Fabriksimulation allgemein auf der Entitätsseite [Factory Simulation](https://www.m365.fm/entity/factory-simulation/).

### Vergleich: statische vs. dynamische Wertstrom-Analyse

| Criterium | Statische (klassieke) VSM | Dynamische VSM / simulatie |
|---|---|---|
| Databasis | gemiddelden uit één opname op de werkvloer | verdelingen, tijdreeksen, gebeurtenisdata |
| Tijdreferentie | momentopname | ontwikkeling over dagen, weken, maanden |
| Productvariëteit | productfamilie met uniforme waarden | varianten met eigen routings en omsteltellingen |
| Variabiliteit en storingen | niet zichtbaar | gemodelleerd via verdelingen en storingsprofielen |
| Metrieken | doorlooptijd, flowratio, voorraaddagen als enkelvoudige waarden | plus spreiding, percentielen, belasting in de tijd |
| Toekomstige situatie testen | niet mogelijk, alleen deskundig oordeel | scenario's vergelijkbaar vóór implementatie |
| Inspanning | laag: papier en stopwatch | hoger: modellering en onderhoud van data |
| Hulpmiddelen | papier, whiteboard, tekensoftware | gespecialiseerde VSM-software met simulatiekoppeling, simulatiesuites |
| Sterkte | begrip, communicatie, betrokkenheid | risico's van investeringen en buffergroottes verkleinen |
| Typisch gebruik | instap, workshop, Lean-training | fabrieksplanning, high-mix productie, capaciteitsbeslissingen |

### Digitale value stream mapping: data uit de fabriek in plaats van het klembord

De tweede as is dataverzameling. In ZWF laat Christian Urnauer zien hoe **process mining** processen, hun onderlinge verbindingen en prestatiemetrieken kan afleiden uit tijdstempels van de productie, waardoor value stream mapping een datagedreven perspectief krijgt [24].

Fraunhofer IPA volgt een vergelijkbare weg onder het motto "We are automating the gemba walk": van digitale datacaptatie op de werkvloer tot gevisualiseerde value stream-metrieken, met actuele analyses, consistente datagedreven metrieken en eenvoudige integratie van energie- en CO2-voetafdruk-KPI's [22]. Ook voor de milieukant hebben Amerikaanse producenten een openbare referentie: de Lean & Environment Toolkit van de EPA beveelt aan "one or two environmental performance metrics to measure for each process in the value stream", zoals de hoeveelheid gevaarlijk afval per shift, en deze in de procesvakken op te nemen naast cycle time en uptime [48].

In ISA-95-termen (ANSI/ISA-95, internationaal bekend als IEC 62264) komt de data voor een digitale value stream uit bedrijfssystemen op Niveau 4, zoals ERP, productiebeheersystemen op Niveau 3, zoals MES, en besturingssystemen en sensoren op Niveau 2 [50]. Die lagenindeling helpt wanneer u met IT bespreekt welk systeem welk veld in een datavak levert.

Een concreet voorbeeld is het onderzoeksproject **ECOWERT** ("real-time-oriented value stream analysis for sustainable production optimization") van Fraunhofer IPA en iFAKT GmbH. Het liep van 1 september 2021 tot en met 31 augustus 2022, had een omvang van €500.000 en werd gefinancierd door de Duitse deelstaat Baden-Württemberg via het programma Invest BW [20]. Het doel was een value stream-analyse die ERP-, MES-, machine- en sensordata automatisch verzamelt, continu bijwerkt en energie-value-stream-data toevoegt [20]. Jörg Drees en Steffi Stambera (iFAKT) en Markus Böhm (Fraunhofer IPA) beschrijven de architectuur: ruwe data gaat via een IIoT-gateway en MQTT (met de Sparkplug-payloadspecificatie) naar een tijdreeksendatabase en wordt geëvalueerd met de software Polaris VSM. Hun conclusie: het resultaat is een aanpak die value stream-analyses vrijwel in real time kan opleveren, en het nalopen van machines met eenvoudige sensoren is al genoeg om de data te genereren [21].

Om deze data te hergebruiken hebben Böhm, Drees, Sai, Erlach, Stambera en Teriete een **universele data-interface voor digitale value stream-diensten** ontwikkeld. Zij behandelen gebeurtenissen op de werkvloer als gestructureerde ruwe data voor optimalisatiediensten en standaardiseren de datastroom zodat diensten via één interface kunnen aansluiten. Een dienst voor het berekenen en visualiseren van metrieken werd in het ECOWERT-project aangesloten [18]. De auteurs omvatten Klaus Erlach (Fraunhofer IPA), auteur van het standaardwerk over value stream-ontwerp [18][3].

### Van digitale value stream naar digitale tweeling

Wanneer de waardestroomkaart continu wordt bijgewerkt met realtimegegevens en gekoppeld is aan een simulatiemodel, wordt zij een bouwsteen van een digitale tweeling van de productie. Siemens biedt bijvoorbeeld een VSM Library-add-on voor Plant Simulation X waarmee gebruikers "dynamische simulaties van waardestromen kunnen uitvoeren" en "meerdere scenario's kunnen maken en vergelijken", zoals de huidige en de toekomstige toestand [35]. Meer over het concept vindt u op de entiteitspagina [Digital Twin](https://www.m365.fm/entity/digital-twin/) en in de gids [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/).

Hoe een waardestroom functioneert als een levend datamodel, wordt ook besproken in de m365.fm-aflevering [Value Stream Mapping with a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/).

**Belangrijk voorbehoud:** digitalisering lost een slechte stroom niet op. De TU Darmstadt beveelt uitdrukkelijk aan eerst een stabiele, lean stroom tot stand te brengen met het klassieke ontwerp van waardestromen en pas daarna digitale verbeteringen aan te pakken. Ze raadt af complexe processen te digitaliseren voordat ze stabiel zijn [14].

## 12. Value Stream 4.0: informatielogistiek als tweede dimensie

**Value Stream Mapping 4.0** is ontwikkeld aan het Institut für Produktionsmanagement, Technologie und Werkzeugmaschinen (PTW) van de TU Darmstadt in Duitsland. Tobias Meudt, Joachim Metternich en Eberhard Abele presenteerden het in 2017 in CIRP Annals onder de titel "Value stream mapping 4.0: Holistic examination of value stream and information logistics in production" [13]. Daarna verscheen een Engelstalig boek: "Value Stream 4.0: A Systems View of Information Flow for Digitalization" van Metternich, Meudt en Hartmann (CRC Press, uitgegeven in juli 2025, copyright 2026) [15].

Het kernidee: naast de materiaalstroom wordt ook de **informatielogistiek** systematisch geanalyseerd. Informatie moet op het juiste moment, op de juiste plaats, in de juiste hoeveelheid en kwaliteit beschikbaar zijn, met zo weinig mogelijk verspilling [14]. Volgens de gids "Industrie 4.0 trifft Lean" (Industrie 4.0 ontmoet Lean) van de Duitse branchevereniging voor de machinebouw (VDMA), wetenschappelijk ontwikkeld door Metternich, Meudt en Hartmann, omvat de methode de volgende elementen [14]:

- **Breder bereik:** van het eerste klantcontact tot het gebruik van het product, over alle afdelingen die orders verwerken.
- **Uitgebreide procesvakken:** met informatiebronnen, registratie-intervallen, het type registratie (geautomatiseerd, halfautomatisch, handmatig) en actuele waarden.
- **Opslagmedia als lijnen:** papier, ERP, MES, Excel en andere opslagmedia worden als horizontale lijnen getekend en via verticale lijnen met de bronnen verbonden.
- **Acht soorten verspilling in de informatielogistiek**, georganiseerd langs de levenscyclus van gegevens: bij het ontstaan en de overdracht (gegevensselectie, gegevenskwaliteit, gegevensregistratie, gegevensoverdracht), bij verwerking en opslag (wachten en voorraad van informatie; transport, beweging en zoeken) en bij gebruik (gegevensanalyse, ondersteuning van beslissingen).
- **Metrieken:** beschikbaarheid van informatie, gebruik van informatie en de mate van digitalisering.

In het voorbeeld van een bouwer van speciale machines bleek de analyse twaalf opslagmedia in gebruik, handmatige dubbele gegevensinvoer en een mate van digitalisering en gegevensgebruik van telkens nul procent [14].

Bega en collega's breidden Value Stream Mapping 4.0 in 2023 uit in het tijdschrift Production Engineering voor een uitgebreide identificatie van gegevens- en informatiestromen [26]. Dat laat zien dat Value Stream 4.0 geen afgerond methode is, maar een actief onderzoeksgebied.

In 2018 nam Jörg Drees in ZWF een verwant standpunt in vanuit het perspectief van een softwareleverancier, onder de titel "Wertstrom Management 4.0: Next Generation": de toenemende onderlinge verbondenheid van informatie door Industrie 4.0 en het industriële internet der dingen (IIoT) creëert nieuwe verwachtingen, en methode en software moeten zich aanpassen aan nieuwe vormen van organiseren en sturen van de waardeketen [17].

## 13. Value Stream Management: De value stream aansturen als leidinggevende taak

Een project voor value stream mapping heeft een begin en een einde. **Value stream management** is doorlopend. Het betekent een value stream over afdelingsgrenzen heen op de lange termijn aansturen, met regelmatige updates van de map, doelen op value stream-niveau en duidelijke verantwoordelijkheid. Een uitgebreide inleiding vindt u in de post [What Is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/).

Lugert en Winkler stellen dat technische Industrie 4.0-oplossingen alleen niet voldoende zijn om statische value stream mapping om te zetten in een dynamische managementaanpak. Organisatie en mensen moeten even zwaar meewegen [23]. ISO 22468:2020 weerspiegelt deze cyclus in zijn structuur: analyse, ontwerp, planning, beoordeling en bijsturing van value streams [40].

### De cyclus van value stream management

1. **Analyseren:** leg de huidige situatie vast, bij voorkeur met automatisch verzamelde gegevens.
2. **Ontwerpen:** teken de toekomstige situatie met de ontwerprichtlijnen, bij voorkeur gevalideerd via simulatie.
3. **Plannen:** implementatieplan per value stream-lus, met doelen en eigenaren.
4. **Implementeren:** acties in kaizen-evenementen en in het dagelijks werk.
5. **Beoordelen:** volg de meetgegevens continu en waardeer de impact in geld [25].
6. **Bijsturen:** werk de map bij en leid de volgende toekomstige situatie af.

### De rol van de value stream manager

LEI beschrijft de value stream manager als "een persoon die duidelijk verantwoordelijk is voor het succes van een value stream". Deze persoon bepaalt de waarde vanuit het perspectief van de klant, ontwerpt de value stream en stuurt aan op steeds snellere flow. Omdat het geld, de middelen en de mensen meestal bij de functionele afdelingen liggen, "leidt de value stream manager door invloed, niet door positie". LEI noemt de chief engineer van Toyota als het voorbeeld voor deze rol [10].

In de praktijk doet de value stream manager doorgaans het volgende:

- is eigenaar van de huidige en toekomstige situatiekaarten en het implementatieplan
- faciliteert de regelmatige value stream-review
- volgt de value stream-metrics (doorlooptijd, voorraad, levering op tijd, productiviteit)
- lost doelconflicten tussen afdelingen op
- escaleert obstakels naar de fabrieksdirectie

De post [Value Stream Manager: Role and Responsibilities](https://www.m365.fm/community/u/mirko-p/blog/value-stream-manager-role-responsibilities/) beschrijft het profiel, de bevoegdheden en de gangbare valkuilen van deze rol in detail. Hoe value stream management in de maakindustrie door software wordt ondersteund, wordt behandeld in [Value Stream Management Software in Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/).

Value stream management hangt nauw samen met [Lean management](https://www.m365.fm/entity/lean-management/) als geheel; zie de gidsen [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) en [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/). De dagelijkse routines die een toekomstige situatie levend houden, zoals gelaagde overleggen en gemba walks, komen aan bod in de gids [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

## 14. Veelvoorkomende fouten bij Value Stream Mapping en hoe ze te voorkomen

| Fout | Gevolg | Tegenmaatregel |
|---|---|---|
| in-kantoor mappen op basis van ERP-data | de map toont standaardtijden, niet de werkelijkheid | opnemen op de gemba met stopwatch en tellingen |
| geen productfamilie gedefinieerd | de map wordt onoverzichtelijk en is niet te beoordelen | productproces-matrix vóór de eerste rondgang |
| te veel detail | de werkgroep verliest zich in afzonderlijke stappen | teken een procesvak alleen waar de stroom stokt |
| informatiestroom weggelaten | oorzaak van voorraad blijft onduidelijk | vraag bij elk proces: hoe weet het wat het moet maken? |
| beschikbaarheid niet meegenomen | knelpunten worden gemist | vergelijk effectieve cyclustijd met takttijd |
| alleen huidige toestand, geen toekomstige toestand | analyse zonder effect | ontwerp van de toekomstige toestand en een implementatieplan zijn verplicht |
| toekomstige toestand als ideaalbeeld zonder plan | frustratie, er gebeurt niets | value stream-loops met doelen, eigenaren en data |
| medewerkers niet betrokken | weerstand, verkeerde gegevens | valideer de map samen met de afdelingen |
| eenmalig project zonder eigenaar | map is binnen weken verouderd | benoem een value stream manager, stel een evaluatieritme vast |
| digitaliseren vóór stabiliseren | verspilling wordt geautomatiseerd | stabiliseer eerst de stroom, digitaliseer daarna [14] |
| verschillende tijdbasis voor huidige en toekomstige toestand | stroomverhoudingen niet vergelijkbaar | leg de conventie (werkdagen of kalenderdagen) één keer vast |

## 15. Software voor Value Stream Mapping: categorieën vergeleken

Mensen die zoeken naar "value stream mapping software" willen meestal weten welk hulpmiddel past, welke functies het moet hebben en of er gratis opties zijn. In plaats van een ranglijst van afzonderlijke producten helpt een indeling in categorieën, omdat de hulpmiddelen minder verschillen in het tekenen dan in wat er na het tekenen gebeurt.

| Categorie | Typische voorbeelden | Sterke punten | Beperkingen | Het best geschikt voor |
|---|---|---|---|---|
| Papier en whiteboard | bruin papier, memoblaadjes, potlood | maximale betrokkenheid, geen toolvaardigheden nodig, gratis | geen berekeningen, moeilijk te delen en te versioneren | eerste map op de gemba, training |
| Algemene diagram- en whiteboardsoftware | Microsoft Visio, Lucidchart, Miro, EdrawMax | symboolbibliotheken, samenwerking, vaak gratis instapniveaus | metrieken meestal handmatig, geen logica achter de symbolen | documentatie, gedistribueerde teams |
| Gespecialiseerde VSM-software met metrieke berekening | iFAKT Polaris VSM, SimVSM (SimPlan), visTable | symbolen met ingebouwde formules, automatische tijdlijn, vergelijking van varianten en scenario's | licentiekosten, leercurve | regelmatig value stream-werk, value stream management |
| VSM-software met simulatiekoppeling | SimVSM Pro [34], Plant Simulation X met VSM Library [35] | dynamische analyse, toetsen van de toekomstige toestand | meer modelleer- en datawerk | productie met veel varianten, investeringsbeslissingen |
| Data-gedreven analyse / process mining | ONIQ [36], onderzoeksbenaderingen zoals ECOWERT [20] | metrieken uit productiedata, continu in plaats van eenmalige analyse | datakwaliteit en IT-integratie zijn doorslaggevend | fabrieken met een MES/ERP-datafundament |
| Value stream management-platforms (softwarelevering) | platforms volgens de marktdefinitie van Gartner [31] | end-to-end meting van de softwareleveringsketen | niet ontworpen voor fysieke productie | IT- en softwareorganisaties |

Lees leveranciersclaims kritisch. ONIQ stelt bijvoorbeeld dat automatisering de inspanning voor value stream-analyse met tot 90% verlaagt [36]; er is geen onafhankelijke methodologie gepubliceerd. SimPlan beschrijft SimVSM als digitale registratie en statische kengetallen, met SimVSM Pro als uitbreiding met dynamische parameters en een interface naar simulatie [34].

### Selectiecriteria

- **Symbolen:** Ondersteunt de tool de gangbare Rother/Shook-symbolen, en kunt u eigen symbolen toevoegen?
- **Rekenlogica:** Worden takttijd, voorraaddagen, doorlooptijd en flowratio automatisch berekend? Zijn de formules transparant en aanpasbaar?
- **Scenario's:** Kunt u huidige, toekomstige en tussentoestanden versioneren en vergelijken?
- **Dynamiek:** Is er een simulatie of een koppeling met een simulatietool?
- **Datakoppeling:** Kan de tool starten zonder ERP- of MES-koppeling en later data automatisch overnemen?
- **Implementatie:** Worden acties, kaizen-bursts en verantwoordelijken in dezelfde tool beheerd?
- **Samenwerking en beheer:** rollen en rechten, multi-tenancy, cloud of on-premises, integratie in het bestaande IT-landschap (voor op Microsoft gebaseerde fabrieken zie de gids [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)).
- **Kosten:** licentiemodel, proefperiode, opleidingsinspanning.

Een goede controlevraag: helpt de tool alleen om de huidige toestand te documenteren, of ondersteunt zij ook het sturen naar de toekomstige toestand terwijl de fabriek week na week verandert?

## 16. Digitale waardestroomanalyse met iFAKT Polaris VSM en BSM

> **Opmerking: De auteur werkt bij iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), gevestigd in Stuttgart, Duitsland, is volgens het bedrijf in 2001 opgericht [19]. Medewerkers van het bedrijf schreven verschillende ZWF-artikelen over dynamische en digitale waardestroomanalyse die in deze gids worden aangehaald (overzicht in sectie 18, "Onderzoekspublicaties"). De softwarefamilie [iFAKT Polaris](https://www.m365.fm/entity/polaris/) is uit dit werk voortgekomen; een aparte gids staat op [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/). Twee modules zijn relevant voor waardestroomanalyse:

**[Polaris VSM](https://www.m365.fm/entity/polaris-vsm/)** is een digitale Lean-managementtool die fabrikanten gebruiken om toeleveringsketens en waardestromen in kaart te brengen. Volgens de post van Microsoft over de vermelding op AppSource kunnen metrieken via een formulesysteem worden berekend, gecontroleerd en gevisualiseerd, aangevuld met Kanban- en Kaizen-borden en samenwerking vanaf elke locatie [29]. Op ifakt.de somt de leverancier deze functies op [28]:

- drag-and-drop waardestroomkaarten met standaardsymbolen en meerlaagse hiërarchieën
- automatische metrieken zoals doorlooptijd, cyclustijd, waardetoevoegingsratio en OEE in dashboards, met exportklare rapporten
- onbeperkte scenario's, gevoeligheidsanalyse, versiegeschiedenis met terugdraaien en vergelijking van metrieken naast elkaar
- rolgebaseerde rechten, multi-tenancy en PDCA-documentatie
- starten zonder ERP- of MES-koppeling, met optionele datakoppeling later

In het ECOWERT-onderzoeksproject diende Polaris VSM als evaluatietool voor automatisch verzamelde data (zie sectie 11) [21]. De leverancier vermeldt geen simulatiefunctie in strikte zin; voor dynamische analyse heeft u een tool uit de categorie "simulatiekoppeling" nodig (sectie 15). Batenraming op de leverancierspagina (zoals 25% kortere doorlooptijd) wordt hier niet herhaald, omdat geen methodologie wordt vermeld.

**[Polaris BSM](https://www.m365.fm/entity/polaris-bsm/)** (Business Swimlane Modeling) voegt bedrijfsprocessen toe aan de waardestroomweergave. Volgens de AppSource-vermelding worden processtappen gegroepeerd in pools en lanes, en worden tijdsfactoren en metrieken vastgelegd en vergeleken; de abonnementen lopen van "Read Only" via "Basic" (BPMN-opnamen, swimlane-sjablonen, basisformules, doorlooptijd- en balansgrafiek) tot "Excellence" en "Integrate & Customize" [30]. Dat is nuttig wanneer de waardestroom niet in de productie begint maar bij offertes, engineering en orderverwerking.

Beide modules staan vermeld op Microsoft AppSource [29][30]. De leverancier publiceert geen prijzen; een demo is op aanvraag beschikbaar [30].

**Beoordeling:** Een tool als Polaris VSM vervangt niet het gaan naar de gemba of het ontwerpen van de toekomstige toestand. Zij neemt berekeningen over, maakt scenario's vergelijkbaar en kan de kaart actueel houden wanneer data automatisch binnenkomt. Of zij bij uw fabriek past, hangt af van productvariëteit, beschikbare data en IT-landschap. Toets haar aan de selectiecriteria in sectie 15, net als elke andere oplossing.

## 17. Waardestroombeheer in softwarelevering: de verschillen

Als je op google.com zoekt naar "value stream mapping" of "value stream management", komen veel resultaten uit softwareontwikkeling en DevOps. Gartner beschrijft value stream management-platforms als tools die "organisaties in staat stellen de end-to-end levering van producten te optimaliseren en bedrijfsresultaten te verbeteren"; ze zijn toolonafhankelijk en koppelen aan bestaande tools in de hele levenscyclus van software [31]. Mik Kersten introduceerde in "Project to Product" (IT Revolution, 2018) het Flow Framework met metrieken zoals flow time en flow load voor deze wereld [39].

Het basisidee is hetzelfde als in de fabriek: maak de stroom van klantverzoek tot levering zichtbaar en verminder wachttijd. De verschillen zijn echter groot. In softwarelevering stromen werkitems in plaats van materiaal, is voorraad onafgewerkte tickets en is takttijd moeilijk zinvol te definiëren. Martin en Osterling vertaalden de methode naar kantoor- en kennisarbeid en plaatsten metrieken zoals percent complete and accurate (%C&A) centraal: het aandeel werk dat de volgende stap compleet en foutloos aantreft. Vermenigvuldigd over alle stappen levert dit de rolled %C&A op, die in Martins woordenlijst rolled first pass yield heet [6][44]. Voor de productie blijft de klassieke methode met takttijd, voorraad en doorlooptijd het referentiepunt.

## 18. Bewijs en onderzoekspublicaties

Robuuste, onafhankelijk gepubliceerde praktijkcijfers voor value stream mapping zijn zeldzamer dan de vele succesclaims online doen vermoeden. De volgende zijn gedocumenteerd:

- **Machinebouwer voor speciale machines (TU Darmstadt / VDMA):** twaalf opslagmedia en een digitaliseringsgraad van nul procent (details in sectie 12) [14].
- **ECOWERT (Fraunhofer IPA en iFAKT):** waardestroomanalyse vrijwel in real time met nagerüstete sensoren (details in sectie 11) [20][21].
- **HELLA (ZWF 2018):** ontwikkeling van een kostengebaseerd waarderingsmodel voor waardestroomacties samen met de Duitse automotive-leverancier HELLA GmbH & Co. KGaA, om concurrerende verbeteringen in bedrijfseconomische termen te prioriteren [25].
- **Schaeffler (ZWF 2017):** Andreas Lugert, Lean management bij Schaeffler AG, en Herwig Winkler (BTU Cottbus-Senftenberg) beschrijven de weg van statische value stream mapping naar dynamisch value stream management [23].
- **Thrustmaster of Texas (LEI):** casusverslag over het spaghettidiagram als aanvulling op stroomanalyse, met 100% levering op tijd gerapporteerd 18 maanden later [43].

De bekende handboekcasus "Acme Stamping" uit *Learning to See* is fictief [1], maar werkt goed voor de praktijk.

### Onderzoekspublicaties over dynamische en digitale value stream mapping

De volgende artikelen zijn geschreven door auteurs van iFAKT GmbH, deels samen met Fraunhofer IPA. Ze zijn in het Duits en zijn via de DOI bij de uitgever te controleren. Samen beschrijven ze de ontwikkeling van metriekberekening via simulatie naar een event-gebaseerde data-interface:

| Jaar | Titel (Engelse vertaling) | Auteurs | Publicatie |
|---|---|---|---|
| 2011 | Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung (Productie-optimalisatie via kengetallen van waardestroommodellering) | J. Drees, C. Sack | ZWF 106 (6), blz. 466–470, DOI 10.3139/104.110589 [19] |
| 2014 | Dynamische Simulation von Wertströmen (Dynamische simulatie van waardestromen) | S. Türck, A. Weimer, [L. Schubert](https://www.m365.fm/entity/lars-schubert/), [J. Drees](https://www.m365.fm/entity/jorg-drees/) | ZWF 109 (11), blz. 839–842, DOI 10.3139/104.111242 [16] |
| 2018 | Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation (Nieuwe perspectieven voor de waardestroommethode) | J. Drees | ZWF 113 (9), blz. 605–609, DOI 10.3139/104.111974 [17] |
| 2023 | Universelle Datenschnittstelle für digitale Wertstromdienste (Universele data-interface voor digitale waardestroomdiensten) | M. Böhm, J. Drees, B. Sai, K. Erlach, S. Stambera, T. Teriete | ZWF 118 (5), blz. 293–297, DOI 10.1515/zwf-2023-1062 [18] |
| 2023 | Daten für Wertstromanalysen automatisch erfassen (Gegevens voor waardestroomanalyses automatisch verzamelen) | J. Drees, S. Stambera, M. Böhm | IT&Production, 12 januari 2023 [21] |

Verdere onafhankelijke ZWF-artikelen over de uitbreiding van de methode zijn Lugert/Winkler (2017) [23], Busch/Niehues/Maassen (2018) [25] en Urnauer (2019) [24]. In het Engels zijn de belangrijkste onderzoekslijnen Meudt et al. in CIRP Annals (2017) [13] en Bega et al. in Production Engineering (2023) [26].

## 19. FAQ: Veelgestelde vragen over value stream mapping beantwoord

### Wat is value stream mapping in eenvoudige bewoordingen?
Een value stream map is een overzicht op één pagina van uw productiestroom. Eenvoudige symbolen laten zien door welke processen een product gaat, waar materiaal wacht, hoe lang dat duurt en welke informatie de processen aanstuurt. Het toont hoe weinig van de doorlooptijd daadwerkelijk waarde toevoegt.

### Wat zijn de stappen van value stream mapping?
Doel en scope bepalen, de productfamilie vastleggen, klantvraag en takttijd vaststellen, het proces vanaf de verzending achterwaarts doorlopen, de datavakjes invullen, de voorraad tellen, leveranciers en transport toevoegen, de informatiestroom tekenen, de tijdlijn tekenen en de kengetallen berekenen, daarna verspilling markeren en de map valideren. Daarna volgen de toekomstige-state map en het implementatieplan. Hoofdstuk 5 beschrijft elke stap.

### Wat is het verschil tussen een current state map en een future state map?
De current state map legt vast hoe materiaal en informatie vandaag stromen, met gemeten gegevens. De future state map ontwerpt hoe ze zouden moeten stromen, volgens richtlijnen zoals produceren op takttijd, continue stroom waar mogelijk, supermarkten waar stroom niet mogelijk is, en één pacemakerproces [11]. Samen vormen ze de value stream-methode, gevolgd door een implementatieplan.

### Wat is het verschil tussen value stream mapping en procesmapping?
Een procesmap toont de stappen van één procedure, vaak binnen één afdeling. Een value stream map beslaat één productfamilie van deur tot deur en voegt toe wat een procesmap mist: voorraad tussen stappen, de informatiestroom die de productie aanstuurt, en een tijdlijn met doorlooptijd en bewerkingstijd.

### Wat is het verschil tussen value stream mapping en value stream management?
Value stream mapping is een project: een team legt de huidige situatie vast en ontwerpt een toekomstige situatie. Value stream management is het voortdurend sturen van de value stream door een verantwoordelijke value stream manager, met een regelmatig bijgewerkte map, kengetallen en evaluaties. ISO 22468:2020 beschrijft deze cyclus van analyse, ontwerp, planning, beoordeling en bijsturing [40].

### Welke symbolen worden gebruikt bij value stream mapping?
De belangrijkste zijn het procesvakje, het datavakje, de voorraaddriehoek, de push-pijl, de supermarkt, de FIFO-baan, de vrachtwagen, kanbansymbolen, handmatige en elektronische informatiepijlen, de heijunka-box, de kaizen burst en de tijdlijn. De volledige tabel staat in hoofdstuk 4.

### Welke kengetallen horen op een value stream map?
Per proces: cyclustijd, omsteltijd, beschikbaarheid (uptime), batchgrootte en bezetting. Per voorraadpunt: hoeveelheid en dagen voorraad. Voor de hele stroom: takttijd, doorlooptijd, bewerkingstijd en stroomratio. De formules staan in hoofdstuk 6.

### Hoe berekent u de processcycle-efficiëntie (stroomratio)?
Deel de bewerkingstijd (plus procestijd zoals uithardingstijd) door de doorlooptijd en vermenigvuldig met 100%. Druk beide uit in dezelfde eenheid en op dezelfde basis (werkdagen of kalenderdagen). In het voorbeeld in hoofdstuk 7: 413 s ÷ 1.080.000 s = 0,038%.

### Waarom brengt u de map van de klant naar achteren in kaart?
Omdat de klant het tempo bepaalt. Als u bij de verzending begint en stroomopwaarts loopt, legt u eerst de processen vast die de stroom moeten sturen, en beoordeelt u alle andere processen aan de hand van de klantvraag [1][27].

### Hoe lang duurt value stream mapping?
Voor een beheersbare value stream in één fabriek zijn één tot twee dagen voor de current state en nog een workshop voor de future state realistisch [unverified: geen bronvermelding voor deze schatting]. ASQ beschrijft een kaizen-evenement van drie dagen als aftrap [46]. De echte inspanning zit in de implementatie, die maanden duurt.

### Is value stream mapping Lean of Six Sigma?
Het is een Lean-instrument uit het Toyota Production System, en ASQ rekent het tot Lean [46]. Het Engelstalige Wikipedia noemt het "een erkende methode die deel uitmaakt van Lean Six Sigma-methodologieën" [49]. Het heeft geen Six Sigma-statistiek nodig om te werken.

### Wat zijn de nadelen van value stream mapping?
Het is een momentopname op basis van gemiddelden, toont productvariëteit en variabiliteit slecht, vraagt om handmatige gegevensverzameling en laat de future state niet testen [22][23]. Dynamische simulatie en automatische gegevensverzameling dichten een deel van deze hiaten.

### Wat is dynamic value stream mapping?
Value stream mapping dat rekening houdt met tijdsgedrag. Processen krijgen verdelingen in plaats van gemiddelden, de vraag volgt tijdreeksen, en een simulatie laat zien hoe voorraad en doorlooptijden zich in de tijd ontwikkelen [16].

### Is er een standaard voor value stream mapping?
Ja. ISO 22468:2020 "Value stream management (VSM)" behandelt value stream-analyse, value stream-ontwerp, value stream-planning en het beoordelen en aanpassen van value streams [40]. ISO heeft de norm in 2025 als actueel bevestigd. In Duitsland is ook richtlijn VDI 2870 over holistische productiesystemen relevant [7].

### Is er gratis software voor value stream mapping?
Veel algemene diagramtools bieden gratis instapversies met VSM-symbolen, en spreadsheetsjablonen zijn gangbaar. Ze berekenen de kengetallen meestal niet automatisch. Gespecialiseerde VSM-software is doorgaans betaald, vaak met een proefperiode. Voor je eerste map blijven papier en potlood de beste gratis keuze.

### Kan een MES value stream mapping vervangen?
Nee. Een MES levert waardevolle gegevens zoals cyclustijden, stilstand en voorraad, die een digitale value stream map kunnen voeden [20]. Het ontwerpen van de flow, dat wil zeggen beslissen over supermarkten, FIFO-banen en de pacemaker, blijft het werk van de value stream-methode en de mensen die haar toepassen.

## 20. Conclusie

Sinds "Learning to See" in 1998 verscheen, is value stream mapping het standaardinstrument om de flow in de productie zichtbaar te maken [1]. De waarde ligt niet in de map zelf, maar in wat de map in gang zet: een gedeeld begrip van de hele flow, een eerlijk getal voor de flow-ratio en een toekomstige staat die volgens duidelijke richtlijnen is ontworpen [3][11].

Neem drie punten mee. Ten eerste: reken zorgvuldig. Takt time, effectieve cyclustijd, voorraaddagen volgens de wet van Little en een flow-ratio op een vaste tijdbasis maken van een tekening een betrouwbare basis voor beslissingen. Ten tweede: blijf niet steken bij de huidige staat. Het ontwerp van de toekomstige staat, een implementatieplan en een verantwoordelijke value stream manager bepalen of er daadwerkelijk iets verandert. Ten derde: gebruik de uitbreidingen waar de klassieke methode zijn grenzen bereikt. Dynamische simulatie, automatisch verzamelde gegevens en het informatielogistieke perspectief van Value Stream 4.0 maken de methode geschikt voor grote productvariëteit en digitale fabrieken [13][16][18], mits de flow eerst stabiel is [14].

Begin met papier, een potlood en één productfamilie. Ga digitaal zodra je de map regelmatig wilt bijwerken.

## Verder lezen op m365.fm

**Blogposts**
- [Wat is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/)
- [Value Stream Manager: rol en verantwoordelijkheden](https://www.m365.fm/community/u/mirko-p/blog/value-stream-manager-role-responsibilities/)
- [Value Stream Management-software in de productie](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)
- [Symbolen en iconen voor value stream mapping uitgelegd](https://www.m365.fm/community/u/mirko-p/blog/value-stream-mapping-symbols-icons/)

**Podcastaflevering**
- [Value Stream Mapping met een live datamodel](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Woordenlijst**
[Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Acht verspillingen](https://www.m365.fm/entity/eight-wastes/) · [Spaghettidiagram](https://www.m365.fm/entity/spaghetti-diagram/) · [Lead time](https://www.m365.fm/entity/lead-time/) · [Cyclustijd](https://www.m365.fm/entity/cycle-time/) · [Takt time](https://www.m365.fm/entity/takt-time/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Pull-systeem](https://www.m365.fm/entity/pull-system/) · [Fabriekssimulatie](https://www.m365.fm/entity/factory-simulation/) · [Digitale tweeling](https://www.m365.fm/entity/digital-twin/) · [Lean management](https://www.m365.fm/entity/lean-management/) · [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) · [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/)

**Bedrijven en personen**
[iFAKT GmbH](https://www.m365.fm/entity/ifakt/) · [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) · [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Gerelateerde gidsen**
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is de host van m365.fm en werkt bij [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) in Stuttgart, Duitsland. Op m365.fm schrijft hij over lean management, waardestroommapping en de digitalisering van de productie met Microsoft 365 en Azure. Zijn focus ligt op hoe beproefde Lean-tools zoals waardestroommapping samenwerken met realtime data, simulatie en moderne dataplatforms, zonder hun methodische kern te verliezen.

**Let op: de auteur werkt bij iFAKT GmbH.** De geciteerde onderzoekspublicaties van iFAKT zijn via de DOI te controleren in ZWF.

# Sources

All sources accessed November 20, 2026. Sources marked "verified 11/20/2026" were opened for this English version; the others were verified for the German original on the same date and spot-checked.

1. Rother, M.; Shook, J.: Learning to See: Value Stream Mapping to Create Value and Eliminate Muda. Lean Enterprise Institute, 1998 (introduction dated May 1998, Ann Arbor); current edition subtitled "… to Add Value and Eliminate Muda", LEI, September 2018, 148 pages, ISBN 978-0-9667843-0-5. Publisher page (Shingo award 1999, Shook eleven years at Toyota): https://www.lean.org/store/workbooks/learning-to-see/ · Introduction (PDF): https://www.lean.org/wp-content/uploads/2021/01/Learning-to-See-introduction.pdf (verified 11/20/2026)
2. Rother, M.; Shook, J.: Sehen lernen. Mit Wertstromdesign die Wertschöpfung erhöhen und Verschwendung beseitigen. German edition, version 1.1. Lean Management Institut, Aachen 2004, ISBN 978-3-9809521-1-8 (German Digital Library catalog).
3. Erlach, K.: Wertstromdesign. Der Weg zur schlanken Fabrik. Springer, 1st ed. 2007; 2nd ed. 2010 (VDI-Buch), ISBN 978-3-540-89867-2; 3rd ed. Springer Vieweg, Berlin/Heidelberg 2020, ISBN 978-3-662-58906-9 (eBook 978-3-662-58907-6). Sample of 2nd ed.: https://lesejury.de/media/samples/672/9783540898672_leseprobe.pdf · Overview with the eight design guidelines: http://www.wertstromdesign.de/wertstromdesign.html (verified 11/20/2026)
4. Erlach, K.: Value Stream Design: The Way Towards a Lean Factory. Springer, Lecture Notes in Logistics, published September 2012 (copyright 2013), ISBN 978-3-642-12568-3 (hardcover), eBook 978-3-642-12569-0. https://link.springer.com/978-3-642-12568-3 · Publisher description ("ten design guidelines") via https://ebooks.mpdl.mpg.de/ebooks/Record/EB000384257 (verified 11/20/2026)
5. Klevers, T.: Wertstrom-Mapping und Wertstrom-Design. Verschwendung erkennen – Wertschöpfung steigern. mi-Fachverlag, Landsberg am Lech 2007, ISBN 978-3-636-03097-9 (bibliographic data per [27]).
6. Martin, K.; Osterling, M.: Value Stream Mapping: How to Visualize Work and Align Leadership for Organizational Transformation. McGraw-Hill, New York, published October 2013 (copyright 2014), ISBN 978-0-07-182891-8. https://www.mheducation.com/highered/mhp/product/value-stream-mapping-how-visualize-work-align-leadership-organizational-transformation.html (verified 11/20/2026)
7. VDI 2870 Part 1: Lean production systems; basic principles, introduction and review. VDI (Association of German Engineers), July 2012. https://vdi.de/richtlinien/details/vdi-2870-blatt-1-lean-production-systems-basic-principles-introduction-and-review
8. Takt Time (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/takt-time/ (verified 11/20/2026)
9. Seven Wastes (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/seven-wastes/ (verified 11/20/2026)
10. Value-Stream Manager (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/value-stream-manager/ (verified 11/20/2026)
11. Rother, M.; Shook, J.: 6 Guidelines for Moving Toward a Lean Value Stream. Lean Enterprise Institute, The Lean Post, October 19, 2022. https://www.lean.org/the-lean-post/articles/6-guidelines-for-moving-toward-a-lean-value-stream/ (verified 11/20/2026)
12. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (3), 1961, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://econpapers.repec.org/RePEc:inm:oropre:v:9:y:1961:i:3:p:383-387 (verified 11/20/2026)
13. Meudt, T.; Metternich, J.; Abele, E.: Value stream mapping 4.0: Holistic examination of value stream and information logistics in production. CIRP Annals 66 (1), 2017, pp. 413–416. DOI: 10.1016/j.cirp.2017.04.005 (bibliographic data per the reference list of [26]).
14. VDMA / PTW TU Darmstadt (Metternich, J.; Meudt, T.; Hartmann, L.): Leitfaden Industrie 4.0 trifft Lean, excerpt on Value Stream Mapping 4.0 (German). https://www.ptw.tu-darmstadt.de/media/fachgebietptw/dokumente_3/wissenssammlung_ptw/leitfaeden_2/Leitfaden_I40_Lean.pdf
15. Metternich, J.; Meudt, T.; Hartmann, L.: Value Stream 4.0: A Systems View of Information Flow for Digitalization. CRC Press, released July 20, 2025 (copyright 2026), ISBN 978-1-032-95831-6. https://www.routledge.com/Value-Stream-40-A-Systems-View-of-Information-Flow-for-Digitalization/Metternich-Meudt-Hartmann/p/book/9781032958316 (verified 11/20/2026)
16. Türck, S.; Weimer, A.; Schubert, L.; Drees, J. (iFAKT GmbH): Dynamische Simulation von Wertströmen. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 109 (11), 2014, pp. 839–842. DOI: 10.3139/104.111242. https://www.degruyterbrill.com/document/doi/10.3139/104.111242/html (verified 11/20/2026)
17. Drees, J. (iFAKT GmbH): Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation. ZWF 113 (9), 2018, pp. 605–609. DOI: 10.3139/104.111974. https://www.degruyterbrill.com/document/doi/10.3139/104.111974/html
18. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (Fraunhofer IPA, iFAKT GmbH): Universelle Datenschnittstelle für digitale Wertstromdienste. Eventbasierte Wertstromanalyse als einheitliche Datenbasis für individuelle Dienste zur Produktionsoptimierung. ZWF 118 (5), 2023, pp. 293–297. DOI: 10.1515/zwf-2023-1062. https://www.degruyterbrill.com/document/doi/10.1515/zwf-2023-1062/html
19. Drees, J.; Sack, C. (iFAKT GmbH): Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung. ZWF 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
20. ECOWERT – Echtzeitorientierte Wertstromanalyse für die nachhaltige Produktionsoptimierung (reference project). Fraunhofer IPA. https://www.ipa.fraunhofer.de/de/referenzprojekte/ECOWERT.html (verified 11/20/2026)
21. Drees, J.; Stambera, S.; Böhm, M.: Daten für Wertstromanalysen automatisch erfassen. IT&Production, January 12, 2023 (updated July 23, 2024). https://www.it-production.com/industrie-4-0-iot/wertstromanalyse-mit-iiot-anbindung/ (verified 11/20/2026)
22. Digitalized value stream analysis: We are automating the gemba walk. Fraunhofer IPA. https://www.ipa.fraunhofer.de/en/current-research/factory-planning-and-production-management/production-management-and-value-stream-mapping-and-design/WertstromDigital.html (verified 11/20/2026)
23. Lugert, A.; Winkler, H.: Von der Wertstromanalyse zum Wertstrommanagement. ZWF 112 (4), 2017, pp. 261–265. DOI: 10.3139/104.111703. https://www.degruyterbrill.com/document/doi/10.3139/104.111703/html
24. Urnauer, C.: Die digitale Wertstrommethode. ZWF 114, 2019 (issue and pages not shown at access). DOI: 10.3139/104.112203. https://www.degruyterbrill.com/document/doi/10.3139/104.112203/html
25. Busch, O.; Niehues, M.; Maassen, K.: Die monetäre Bewertung von Wertströmen. ZWF 113 (6), 2018, pp. 389–392. DOI: 10.3139/104.111935. https://www.degruyterbrill.com/document/doi/10.3139/104.111935/html
26. Bega, M.; Sapel, P.; Ercan, F.; Schramm, T.; Spitz, M.; Kuhlenkötter, B.; Hopmann, C.: Extension of value stream mapping 4.0 for comprehensive identification of data and information flows within the manufacturing domain. Production Engineering 17 (6), 2023, pp. 915–927. DOI: 10.1007/s11740-023-01207-5. https://link.springer.com/10.1007/s11740-023-01207-5
27. Wertstromanalyse. Wikipedia (German-language). https://de.wikipedia.org/wiki/Wertstromanalyse (verified 11/20/2026)
28. Polaris VSM – Digital Value Stream Tool in Lean Management (vendor page). iFAKT GmbH. https://www.ifakt.de/en/software/vsm/ (verified 11/20/2026)
29. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource (Polaris VSM). Microsoft Tech Community, Marketplace Blog, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536 (verified 11/20/2026)
30. Polaris BSM (Business Swimlane Modeling). Microsoft AppSource. https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1 (verified 11/20/2026)
31. Value Stream Management Platforms. Gartner Peer Insights. https://www.gartner.com/reviews/market/value-stream-management-platforms (verified 11/20/2026)
32. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press, 1988 (Japanese original 1978). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140
33. Liker, J. K.: The Toyota Way: 14 Management Principles from the World's Greatest Manufacturer. McGraw-Hill, New York 2004, ISBN 978-0-07-139231-0.
34. SimVSM – digital value stream analysis. SimPlan AG. https://www.simplan.de/en/software/simvsm (verified 11/20/2026)
35. Plant Simulation X – Value Stream Mapping. Siemens. https://www.siemens.com/en-us/products/tecnomatix/offerings/plant-simulation-x-value-stream-mapping/ (verified 11/20/2026)
36. Was ist eine Wertstromanalyse? (What is a value stream analysis?) ONIQ (German). https://oniq.com/de/ressourcen/was-ist-eine-wertstromanalyse (verified 11/20/2026)
37. Wertstromanalyse (REFA lexicon). REFA Bundesverband. https://refa.de/service/refa-lexikon/wertstromanalyse
38. Wertstromanalyse: Anleitung, Kennzahlen, Symbole. Industriezeitschrift (German). https://industriezeitschrift.de/qualitaet/wertstromanalyse/
39. Kersten, M.: Project to Product: How to Survive and Thrive in the Age of Digital Disruption with the Flow Framework. IT Revolution Press, Portland 2018, ISBN 978-1-942788-39-3.
40. ISO 22468:2020 Value stream management (VSM). ISO/TC 154, published March 9, 2020, confirmed June 25, 2025. https://committee.iso.org/standard/73292.html (verified 11/20/2026) · Table of contents (DIN): https://www.din.de/de/mitwirken/normenausschuesse/nia/veroeffentlichungen/wdc-beuth:din21:322285827/toc-3156892/download
41. Fuchs, H.-W.: Wertstrom-Methode (diploma thesis). Hochschule Mittweida. https://monami.hs-mittweida.de/frontdoor/deliver/index/docId/796/file/DA_Wertstrommethode.pdf
42. Wertstromanalyse (Value Stream Mapping). Mind Logistik (German). https://mind-logistik.de/knowhow/wertstromanalyse/
43. Small Chart, Big Impact: How a Simple Spaghetti Chart Led to Huge Wins at Thrustmaster of Texas. Lean Enterprise Institute, The Lean Post, February 4, 2016. https://www.lean.org/the-lean-post/articles/small-chart-big-impact-how-a-simple-spaghetti-chart-led-to-huge-wins-at-thrustmaster-of-texas/ (verified 11/20/2026)
44. The Karen Martin Group: Lean Terminology (glossary, PDF, 2014): definitions of activity ratio, lead time, process time, %C&A and rolled first pass yield. https://tkmg.com/wp-content/files/Lean-Terminology.pdf (verified 11/20/2026)
45. Value-Stream Mapping (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/value-stream-mapping/ (verified 11/20/2026)
46. Value Stream Mapping. ASQ, Quality Resources (adapted from "Lean Lessons: Value Stream Mapping – An Introduction", Quality Progress). https://asq.org/quality-resources/lean/value-stream-mapping (verified 11/20/2026)
47. Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement (verified 11/20/2026)
48. Lean & Environment Toolkit, Chapter 3 (Value Stream Mapping). US Environmental Protection Agency. https://epa.gov/sustainability/lean-environment-toolkit-chapter-3 (verified 11/20/2026)
49. Value-stream mapping. Wikipedia (English). https://en.wikipedia.org/wiki/Value-stream_mapping (verified 11/20/2026)
50. ISA-95 framework and layers. Siemens. https://www.siemens.com/en-us/technology/isa-95-framework-layers/ (verified 11/20/2026)
51. 8 Wastes (DOWNTIME). GoLeanSixSigma.com. https://goleansixsigma.com/8-wastes/ (verified 11/20/2026)
