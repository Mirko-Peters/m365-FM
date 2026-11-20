# SEO metadata

| Field | Value |
|---|---|
| Meta title | Software voor waardestroomanalyse: koopgids + iFAKT Polaris |
| Meta description | Hoe kies je software voor waardestroomanalyse: 5 categorieën, selectiecriteria, een checklist en een onderbouwde blik op iFAKT Polaris en de beperkingen ervan. |
| Slug | `ifakt-polaris` |

# Software voor waardestroomanalyse in de productie: een koopgids en een op bewijs gebaseerde blik op iFAKT Polaris

> **Opmerking: De auteur werkt bij iFAKT GmbH.**

*Vanaf 20 november 2026 · Elke productverklaring heeft een bron; claims van leveranciers zijn als zodanig gemarkeerd.*

> **Kort antwoord:** Software voor waardestroomanalyse loopt uiteen van tekenprogramma's met lean-symbolen, via specifieke VSM-tools die metrieken berekenen, tot simulatie- en planningssystemen. Welke categorie u nodig heeft, hangt af van de vraag of u waardestromen wilt documenteren, regelmatig met data wilt evalueren, in de tijd wilt simuleren, of wilt omzetten in planningen voor de productievloer. Gratis tekenprogramma's zoals Lucidchart en Miro, en de Visio-sjabloon, zijn voldoende voor workshops; specifieke VSM-tools renderen zich terug wanneer u regelmatig in kaart brengt; simulatie en APS zijn afzonderlijke categorieën. **iFAKT Polaris** is een modulair platform van iFAKT GmbH (Stuttgart, Duitsland) met zeven modules: VSM (waardestromen), BSM (procesbanen), Designer (product-proces-resourcemodel), Simulator, Optimizer (restrictiegebaseerde planning), Operator (taken op de productievloer) en Analyzer (KPI-dashboards). Volgens de leverancier delen de modules één datamodel [3]. De auteur is geen onafhankelijke vergelijkingstests van Polaris bekend. Wat wel te verifiëren is, omvat twee vermeldingen in de Microsoft AppSource-catalogus [15][16], de tweede plaats in de categorie Productie van de Best of Technology Award 2025 van het Duitse weekblad WirtschaftsWoche voor Polaris IMS [18], en een reeks technische artikelen in het Duitse vakblad ZWF [21][22][23][24].

Wie software voor waardestroomanalyse zoekt, loopt eerst tegen een probleem van terminologie aan. Onder "value stream mapping software" of "value stream management software" verkopen leveranciers heel verschillende dingen: tekenprogramma's met een symboolbibliotheek, lean-tools met formules, simulatiesystemen, platforms voor softwareleveringsteams en planningssystemen met een digitale tweeling. Vergelijkingen die deze categorieën door elkaar halen, leiden tot slechte aankopen. Een fabriek die haar waardestroom eens per jaar in een kaizen-event in kaart brengt, heeft iets anders nodig dan een maker van producten in veel varianten die elke week tegen krappe capaciteit inplant.

Deze gids bestaat daarom uit twee delen. **Deel A** brengt de markt neutraal in kaart: wat software voor waardestroomanalyse moet doen, welke categorieën bestaan, hoe u ze vergelijkt en welke fouten bij selectie en invoering typisch voorkomen. **Deel B** beschrijft iFAKT Polaris in detail, module voor module, met het bewijsmateriaal van leveranciersvermeldingen, de Microsoft-marktplaats, vakliteratuur en een prijzenjury, en met een duidelijke verklaring van wat niet gedocumenteerd is en voor wie het product niet geschikt is.

Omdat de auteur bij iFAKT GmbH werkt, geldt voor deze tekst één eenvoudige regel: elke productverklaring heeft een bron, claims van leveranciers over voordelen worden als zodanig aangeduid en niet als feit behandeld, en deel A is zo geschreven dat het ook dienst doet als beslishulp als u deel B nooit leest.

### Belangrijkste conclusies

- **Categorie vóór product:** Tekenprogramma's, specifieke VSM-tools, simulatiesoftware, APS-systemen en MES/BI lossen verschillende problemen op. Begin met de vraag die de software moet beantwoorden.
- **Tekenen is zelden het knelpunt.** Wat telt, is de dataconnectiviteit, de rekenlogica, scenario's, het vermogen om variabiliteit en productmix te modelleren, en of de analyse uitmondt in acties en planningen.
- **Statische waardestroomanalyse werkt met gemiddelden.** Variabiliteit, productmix en gedeelde resources vragen om simulatie; leverdata onder restricties vragen om planningsalgoritmen.
- **Er bestaan gratis opties** in de categorie tekenprogramma's (Lucidchart, Miro, Creately en andere) en, voor twee modules, bij iFAKT Polaris [3]. Controleer gebruikerslimieten, export en eigendom van gegevens.
- **iFAKT Polaris** dekt volgens de leverancier de keten van waardestroomanalyse via simulatie en planning tot taken op de productievloer en rapportage [3]. De modulepagina's noemen functies, maar geen voordeelcijfers met gepubliceerde methodologie.
- **Gedocumenteerd** zijn ISO 9001-certificering sinds oktober 2014 [4], een op de website vermelde ISO/IEC 27001-certificering door TÜV SÜD [1][3], hosting van VSM en BSM op Microsoft Azure West Europe (een regio in Nederland) volgens de modulepagina's [6][7][43], twee AppSource-vermeldingen [15][16] en de WirtschaftsWoche-prijs [18].
- **Niet gedocumenteerd** op de bekeken pagina's: een simulatiefunctie binnen de VSM-module, native integratie met Microsoft Teams of Power BI, een hostingregio in de VS, een SOC 2-rapport en openbare prijzen.

## Inhoudsopgave

**Deel A: Wat value stream mapping-software moet doen**

1. [Begrippen: value stream mapping, toekomstige-staatontwerp, value stream management](#1-begrippen-value-stream-mapping-toekomstige-staatontwerp-value-stream-management)
2. [Waarom papier en Excel hun grenzen bereiken](#2-waarom-papier-en-excel-hun-grenzen-bereiken)
3. [De vijf categorieën van value stream mapping-software](#3-de-vijf-categorieën-van-software-voor-waardestroomanalyse)
4. [Vergelijkingstabel per categorie](#4-vergelijking-van-categorieën)
5. [Hoe kies je value stream mapping-software: criteria in detail](#5-hoe-kies-je-software-voor-waardestroomanalyse-criteria-in-detail)
6. [Selectiechecklist](#6-selectiechecklist)
7. [Uitrol in zes stappen](#7-uitrol-in-zes-stappen)
8. [Veelgemaakte fouten bij selectie en uitrol](#8-veelgemaakte-fouten-bij-selectie-en-uitrol)
9. [Een businesscase zonder verzonnen cijfers](#9-een-businesscase-zonder-verzonnen-cijfers)

**Deel B: iFAKT Polaris in detail**

10. [Achtergrond en methode: van metrieken naar gebeurtenisdata](#10-achtergrond-en-methode)
11. [Platformprincipe: één datamodel, zeven modules](#11-platformprincipe-één-datamodel-zeven-modules)
12. [De modules één voor één](#12-de-modules-één-voor-één)
13. [Polaris IMS en de Best of Technology Award 2025](#13-polaris-ims-en-de-best-of-technology-award-2025)
14. [Branches volgens het bedrijf](#14-branches-volgens-het-bedrijf)
15. [Polaris in het Microsoft-ecosysteem](#15-polaris-in-het-microsoft-ecosysteem)
16. [Beveiliging, hosting en certificeringen](#16-beveiliging-hosting-en-certificeringen)
17. [Wat de leverancier belooft en hoe je dat test](#17-wat-de-leverancier-belooft-en-hoe-u-dat-test)
18. [Voor wie Polaris geschikt is en voor wie niet](#18-voor-wie-polaris-geschikt-is-en-voor-wie-niet)
19. [FAQ](#19-veelgestelde-vragen)
20. [Conclusie](#20-conclusie)

# Deel A: Wat value stream mapping-software moet doen

## 1. Begrippen: value stream mapping, toekomstige-staatontwerp, value stream management

**Value stream mapping** (VSM) toont de materiaal- en informatiestroom van één productfamilie van leverancier tot klant, met gestandaardiseerde symbolen. Onder elk procesvak staan gegevens zoals cyclustijd, omsteltijd, beschikbaarheid en ploegenpatroon; tussen de procesvakken staan voorraden, omgezet in dagen dekking. De tijdlijn onderaan laat zien hoeveel van de totale doorlooptijd waarde toevoegt. In de VS is de methode nauw verbonden met *Learning to See* van Mike Rother en John Shook, uitgegeven door het Lean Enterprise Institute. Dat boek doorloopt de huidige-staatmapping, het toekomstige-staatontwerp en een implementatieplan voor een fictieve fabriek, Acme Stamping; het werkboek ontving in 1999 een Shingo Research Prize [41]. De volledige methode met symbolen, formules en een uitgewerkt voorbeeld staat in het m365.fm-compendium [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

**Toekomstige-staatontwerp** gebruikt de huidige-staatkaart om een doelbeeld te ontwerpen: continue stroom waar mogelijk; pull via supermarkten waar stroom niet kan; één pacemakerproces dat het tempo bepaalt; geëgaliseerde productie. Pas de toekomstige staat en een implementatieplan maken van de analyse verbetering. Duitse praktijkmensen gebruiken voor deze stap vaak de term *Wertstromdesign*, naar het standaard Duitse leerboek van Klaus Erlach van Fraunhofer IPA [40].

**Value stream management** betekent in de productie het doorlopend aansturen van het bedrijf langs waardestromen: een verantwoordelijke value stream manager houdt huidige en toekomstige staat actueel, volgt metrieken en acties, en herhaalt de analyse wanneer productmix of vraag verandert. Sinds 2020 bestaat hiervoor een internationale norm, ISO 22468:2020 "Value stream management (VSM)" [39]. Een korte inleiding is de post [What is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/).

**Een belangrijk onderscheid:** In softwareontwikkeling duidt "value stream management" een aparte productcategorie aan. Deze platforms meten de stroom van werkitems door de softwareleveringspijplijn, van ticket tot deployment. Als je zoekt op "value stream management software" en een fabriek bedoelt, let dan goed op: in de Amerikaanse zoekresultaten mengen meerdere overzichtsartikelen DevOps-tools zoals LinearB, Copado of Plutora met productietools [50]. Die platforms zijn niet gebouwd voor materiaal, voorraad en machines. Deze gids behandelt alleen waardestromen in de productie en in de bedrijfsprocessen eromheen.

## 2. Waarom papier en Excel hun grenzen bereiken

Value Stream Mapping begon als een methode met potlood en papier, en voor een eerste map is dat nog steeds de juiste aanpak. Iemand die op de gemba (de plek waar waarde wordt gecreëerd, dus de productievloer) staat met een potlood en de voorraad telt, begrijpt de stroom beter dan iemand die door software klikt. Toch loopt de papieren methode in vier situaties tegen grenzen aan.

**Ten eerste: de momentopname.** Een klassieke value stream map toont één moment in de tijd. Bij de presentatie van het Duitse onderzoeksproject ECOWERT formuleerde Markus Böhm van het Fraunhofer IPA (een Duits instituut voor toegepast onderzoek op het gebied van productietechniek) het als volgt (vertaald uit het Duits): "Value stream mapping is in feite niets meer dan een momentopname." Volgens het instituut doen veel bedrijven dit hooguit één keer per jaar [25]. Wanneer productmix, vraag of shiftpatroon verandert, is de map verouderd.

**Ten tweede: gemiddelden in plaats van verdelingen.** Op papier heeft elk procesvak één cyclustijd, niet de variatie ervan. Storingen, omsteltijdvolgorden en gedeelde resources verdwijnen in het gemiddelde. Eén leverancier van simulatiesoftware beschrijft het verschil zo: value stream-simulatie voegt "tijdsafhankelijke volgordes, variatie en gedeelde resources" toe aan het beeld (vertaald uit het Duits) [37]. Türck, Weimer, Schubert en Drees beschreven deze stap van statische analyse naar dynamische simulatie van value streams al in 2014 in de ZWF, de *Zeitschrift für wirtschaftlichen Fabrikbetrieb*, een Duits vakblad voor productietechniek [22].

**Ten derde: productvariëteit.** De methode kijkt naar één productfamilie. In high-mix, low-volume productie lopen echter veel varianten met verschillende routings over dezelfde resources. Eén map per variant is onpraktisch; één map voor alle varianten vervaagt de knelpunten.

**Ten vierde: rekenwerk en versies.** Takt time, voorraaddagen, doorlooptijd en flow ratio kunnen in Excel worden berekend, maar elke wijziging in de map moet met de hand worden overgenomen. Meerdere scenario's, meerdere fabrieken en meerdere bewerkers leiden snel tot concurrerende bestandsversies.

De volgorde van de gevolgen is belangrijk. Software lost het eerste en vierde probleem vrij gemakkelijk op, mits er data beschikbaar zijn. Alleen software die variabiliteit en productmix daadwerkelijk modelleert, lost het tweede en derde op. En geen enkele software vervangt de teamdiscussie over hoe de toekomstige situatie eruit moet zien.

## 3. De vijf categorieën van software voor waardestroomanalyse

Het korte Wikipedia-artikel over software voor waardestroomanalyse onderscheidt twee basistypen: tools die je helpen de kaart te tekenen, en tools die berekeningen en analyses uitvoeren [46]. Voor een aankoopbeslissing helpt een fijnere indeling in vijf categorieën meer dan een ranglijst van afzonderlijke producten. De onderstaande voorbeelden zijn noch volledig noch aanbevelingen; ze laten zien wat voor soort tool je in elke categorie kunt verwachten. Alle productuitspraken zijn gebaseerd op de eigen pagina's van de leveranciers of op marktplaatsvermeldingen.

### 3.1 Teken- en whiteboardtools

**Wat ze doen:** Ze bieden symboolbibliotheken voor waardestroomkaarten en laten teams samenwerken in de browser of op de desktop. Microsoft Visio bevat een sjabloon voor waardestroomkaarten; het ondersteuningsartikel van Microsoft zegt dat de sjabloon Visio Professional (of de oudere Premium-editie) vereist en niet in Visio Standard is opgenomen, en het artikel vermeldt Visio Plan 2 onder "Van toepassing op" [27]. Lucidchart biedt een VSM-vormenbibliotheek in het gratis account [28]; Miro biedt een set sjablonen voor waardestroomkaarten op zijn whiteboard [29]. Creately, EdrawMax, SmartDraw en vergelijkbare tools werken op dezelfde manier. Excel- en PowerPoint-sjablonen horen hier ook bij.

**Sterke punten:** lage instapdrempel, goede samenwerking, vaak gratis instapniveaus, vertrouwde interface.

**Beperkingen:** achter de symbolen zit meestal geen rekenlogica. Meetwaarden worden handmatig ingevoerd, scenario's zijn kopieën van de tekening en er is geen dataverbinding met ERP of MES.

**Geschikt voor:** documentatie, training, eerste kaizen-workshops, verspreide teams die een gedeeld beeld nodig hebben.

### 3.2 Gespecialiseerde tools voor waardestroomanalyse (VSM-software met rekenlogica)

**Wat ze doen:** Ze combineren lean-symbolen met rekenlogica. Kengetallen zoals voorraaddagen, doorlooptijd en de waardetoevoegingsratio worden automatisch berekend op basis van procesdata, en scenario's kunnen naast elkaar worden vergeleken. Voorbeelden: eVSM, dat de leverancier beschrijft als "a complete lean toolkit to map, model and improve value streams of every type" (marktplaatsvermelding met door gebruikers gemelde functies zoals mixed-model mapping en Excel-import) [42]; SimVSM van SimPlan (Duitsland), waarvan de basisversie digitale waardestroomanalyse ondersteunt "including static evaluations" (uit het Duits vertaald) [30] en kerngetallen zoals cyclustijd, doorvoer en voorraad automatisch berekent [31]; visTable (Duitsland), dat waardestroom en fabrieksindeling in één model koppelt en volgens de leverancier doorlooptijden automatisch berekent op basis van proces-, cyclus- en voorraadgegevens [32]; en Polaris VSM van iFAKT (zie deel B).

**Sterke punten:** minder rekenfouten, snelle scenario's, versiebeheer, vaak ingebouwde actieopvolging.

**Beperkingen:** licentiekosten, leercurve, en de berekening blijft meestal statisch: er wordt met gemiddelden gewerkt, ook wanneer de gegevens automatisch binnenkomen.

**Geschikt voor:** bedrijven die regelmatig met waardestromen werken en meerdere waardestromen of fabrieken vergelijkbaar willen houden.

### 3.3 Simulatiesoftware

**Wat ze doen:** Discrete-event-simulatie modelleert orders, resources, buffers, shifts en storingen in de tijd. Daarmee beantwoord je vragen die een statische kaart niet kan beantwoorden: Waar ontstaat het knelpunt bij deze productmix? Is de buffer groot genoeg bij dit storingspercentage? Wat levert een extra shift op? Bekende tools zijn Siemens Tecnomatix Plant Simulation, AnyLogic (multimethodemodellering: agentgebaseerd, systeemdynamica en discrete-event) en FlexSim (discrete-event met 3D-modellering) [34]. Sommige leveranciers koppelen waardestroom en simulatie rechtstreeks: Siemens biedt een VSM-bibliotheek voor Plant Simulation X met voorgeconfigureerde waardestroomelementen, scenariovergelijking en dynamische simulatie van waardestromen die meetwaarden verzamelt zoals cyclustijd, doorlooptijd, WIP en resourcebenutting [33]; in SimVSM Pro kunnen scenario's worden gesimuleerd, bijvoorbeeld om maatregelen te evalueren of knelpunten te identificeren [31].

**Sterke punten:** variabiliteit, productmix en gedeelde resources worden zichtbaar; investeringen kunnen worden getest voordat je je vastlegt.

**Beperkingen:** het bouwen en valideren van een model kost tijd en expertise. Klassieke simulatieprojecten zijn vaak eenmalige studies waarvan het model na de beslissing niet meer wordt onderhouden.

**Geschikt voor:** investerings- en lay-outbeslissingen, productie met veel varianten, capaciteitsvragen met grote onzekerheid.

### 3.4 APS-systemen (advanced planning and scheduling)

**Wat ze doen:** APS-systemen maken gedetailleerde planningen onder beperkingen: machine- en personeelscapaciteit, vaardigheden, omstelvolgordes, materiaalbeschikbaarheid en leverdata. Siemens beschrijft Opcenter Scheduling als het maken van "production schedules based on availability of resources, constraints and materials required by the order" [36]. Een uitgebreid overzicht staat in het compendium [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

**Sterke punten:** realistische, uitvoerbare planningen in plaats van grove planning tegen oneindige capaciteit; snelle herplanning na verstoringen.

**Beperkingen:** hoge eisen aan de kwaliteit van stamdata (routings, tijden, middelen), integratie-inspanning met ERP en MES, acceptatie onder planners.

**Geschikt voor:** bedrijven met schaarse, gedeelde middelen, veel varianten en leverdruk.

### 3.5 MES, process mining en BI

**Wat ze doen:** Manufacturing execution systems leggen werkelijke data vast op de productievloer; BI-tools en data-gedreven analyses evalueren deze. Sommige leveranciers reconstrueren waardestromen automatisch uit die data. ONIQ, aangeboden via de PwC Store in Duitsland, stelt dat feedbackdata uit productie-IT-systemen "(e.g., MES, PDA, PPS, IIoT)" zonder handmatige mapping kan worden overgedragen naar een digitale waardestroomtweeling [35] (PDA is production data acquisition; PPS is de Duitse term voor systemen voor productieplanning en -besturing).

**Sterke punten:** werkelijke data in plaats van schattingen, continue in plaats van eenmalige analyse.

**Beperkingen:** het resultaat is niet beter dan de feedbackdata; toekomstige toestand en planningen verschijnen niet automatisch. Een MES vervangt waardestroomanalyse niet; het levert er data voor.

**Geschikt voor:** fabrieken met een goede datafundering die afwijkingen en trends continu willen volgen. Meer over kengetallen staat in het compendium [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/); over dagelijkse routines op de productievloer in het compendium [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

### 3.6 Platforms die meerdere categorieën omvatten

Sommige leveranciers combineren meerdere van deze categorieën in één product, zoals waardestroom en lay-out (visTable [32]), waardestroom en simulatie (SimVSM Pro [31], Plant Simulation X VSM library [33]) of waardestroom, simulatie, planning en uitvoering (iFAKT Polaris, volgens de leverancier [3]). Het voordeel is datacontinuïteit: wat je tijdens het in kaart brengen vastlegt, hoeft niet opnieuw ingevoerd te worden voor simulatie. Het nadeel: binnen elke afzonderlijke categorie kan een specialistisch hulpmiddel dieper gaan. Bij platforms moet je elke categorie afzonderlijk toetsen aan je eisen, in plaats van brede dekking als kwaliteit op zich te beschouwen.

## 4. Vergelijking van categorieën

| Criterium | Tekening/whiteboard | Speciale VSM-tool | Simulatiesoftware | APS-systeem | MES / process mining / BI |
|---|---|---|---|---|---|
| Belangrijkste vraag | Hoe ziet de stroom eruit? | Waar zitten de verspilling en de hefbomen? | Hoe gedraagt het systeem zich in de tijd? | Wie doet wat, en wanneer? | Wat is er werkelijk gebeurd? |
| Lean-symbolen | ja (sjablonen) | ja, met logica | gedeeltelijk (VSM-bibliotheken) | nee | zelden |
| Automatische metingen | nee | ja (statisch) | ja (dynamisch, als verdelingen) | planmetingen (leverdatums, benutting) | werkelijke metingen |
| Variabiliteit en storingen | nee | meestal nee | ja | gedeeltelijk (herplannen) | zichtbaar achteraf |
| Productvariëteit | zwak | gemiddeld | goed | goed | goed (werkelijke data) |
| Verbinding met ERP/MES-data | nee | optioneel | import, meestal per project | vereist | vereist |
| Resultaat | tekening | kaart met metingen, scenario's | evaluatie van scenario's | uitvoerbaar schema | rapporten, dashboards |
| Gebruikelijke inspanning | laag | laag tot gemiddeld | gemiddeld tot hoog | hoog | hoog |
| Gebruikelijke gebruikers | lean-coaches, kaizenteams | beheerders van waardestromen, industrieel ingenieurs | simulatie-ingenieurs, facilitair planners | productieplanners, planners | fabrieksmanagement, IT, financiën |

De tabel beschrijft typische profielen. Afzonderlijke producten kunnen daarvan afwijken, en platforms dekken soms meerdere kolommen. Voor uw beslissing telt welke kolom uw belangrijkste vraag beantwoordt.

### Snelle beslisgids

- **U wilt waardestromen documenteren voor workshops en training** en ze hooguit eens per jaar in kaart brengen: een tekentool met een sjabloon is meestal voldoende.
- **U doet regelmatig waardestroomwerk**, vergelijkt meerdere waardestromen of fabrieken en wilt metingen zonder spreadsheetonderhoud: een speciale VSM-tool.
- **Uw knelpunten verschuiven mee met de productmix**, of u moet een investering in machines, personeel of buffers onderbouwen: simulatie, bij voorkeur op een model dat na de studie wordt onderhouden.
- **Uw probleem zijn leverdatums**, omdat veel orders concurreren om schaarse machines, gereedschappen en vaardigheden: een APS-systeem.
- **U weet niet wat er werkelijk op de werkvloer gebeurt**, omdat bevestigingen ontbreken of onbetrouwbaar zijn: eerst dataverzameling (MES, machinedataverzameling), daarna analyse.
- **Meerdere hiervan zijn van toepassing:** kijk naar platforms die meerdere categorieën op één datamodel verbinden, en vergelijk elke categorie met een gespecialiseerde tool.

## 5. Hoe kies je software voor waardestroomanalyse: criteria in detail

### 5.1 Dataverbinding met ERP, MES en de productievloer

De belangrijkste vraag is: waar komen de gegevens vandaan, en hoe vaak? Een tool die alleen handmatige invoer kent, blijft een momentopname. Een tool die niet kan starten zonder ERP-integratie stelt elk voordeel maanden uit. Een goede oplossing begint zonder integratie en kan later gegevens binnenhalen. Vraag specifiek naar importformaten (Excel, CSV), standaardconnectors naar uw ERP-systeem (SAP, Microsoft Dynamics 365, Epicor, Infor, Oracle of wat u ook gebruikt), interfaces naar MES en machinegegevensverzameling, en de mogelijkheid om machinegegevens te koppelen via een IIoT-gateway (gangbare protocollen zijn OPC UA, MTConnect en MQTT). Leg ook vast wie de interface bouwt en onderhoudt: de leverancier, een partner of uw eigen IT-afdeling.

### 5.2 Rekenlogica en kengetallen

Controleer welke kengetallen de tool berekent en of de formules zichtbaar zijn. Takttijd (beschikbare tijd gedeeld door klantvraag), voorraaddagen, doorlooptijd, waardetoevoegingsratio (vaak gerapporteerd als process cycle efficiency, PCE), OEE en flowratio moeten herleidbaar zijn. Eigen kengetallen en formules zijn belangrijk, omdat elke fabriek haar eigen definities hanteert. Software waarvan niemand de resultaten kan narekenen, verliest het eerste argument bij de financiële afdeling.

### 5.3 Dynamiek en simulatie

Dit is het cruciale onderscheid: rekent de tool met gemiddelden, of simuleert hij de werkzaamheden in de tijd? Veel leveranciers noemen een scenariovergelijking "simulatie", hoewel alleen de statische kengetallen van twee varianten worden vergeleken. Vraag of variabiliteit, storingen, ploegendiensten, productmix en gedeelde middelen in de tijd worden gemodelleerd, en wat eruit komt: gemiddelden, verdelingen, tijdreeksen van bezetting. Bij stochastische invoer (storingen, variabele tijden) moet de software meerdere replicaties kunnen evalueren; één run is slechts één mogelijke uitkomst, geen betrouwbaar resultaat.

### 5.4 Productvariëteit en productstructuur

Wanneer veel varianten over dezelfde middelen lopen, heeft het model stuklijsten, routings en toewijzingen van middelen nodig, niet alleen procesblokken. Controleer of de tool producten, processen en middelen afzonderlijk modelleert en met elkaar koppelt (vaak een product-proces-middel-model, kortweg PPR) en of hij rekening houdt met volgordeafhankelijke omsteltijden tussen varianten.

### 5.5 Van analyse naar uitvoering

Een groot deel van de waarde ontstaat na de analyse. Vraag of acties, kaizenkaarten, eigenaren en vervaldata in dezelfde tool worden beheerd, of een PDCA-cyclus kan worden gedocumenteerd, en of een toekomstige situatie kan worden omgezet in een planning voor de productievloer.

### 5.6 Samenwerking en governance

Rollen en rechten (lezen, bewerken, beheren), versiegeschiedenis, multi-tenancy voor meerdere fabrieken of juridische entiteiten, gelijktijdig bewerken en een auditlogboek van wijzigingen zijn verplicht zodra meer dan één team de tool gebruikt.

### 5.7 Microsoft-integratie

Veel Amerikaanse producenten werken met Microsoft 365 en Microsoft Entra ID (voorheen Azure Active Directory), en sommigen gebruiken Dynamics 365 als ERP-systeem. Relevante vragen zijn: Ondersteunt de software single sign-on met uw identity provider? Is er een standaardconnector naar Dynamics 365, of alleen een bestandsimport? Kunnen kengetallen worden geëxporteerd naar uw BI-tool, zoals Power BI? Kunt u de oplossing via Microsoft AppSource of Azure Marketplace aanschaffen? Een vermelding op AppSource betekent dat de oplossing in de Microsoft-marktplaats wordt aangeboden; op zichzelf zegt dat niets over hoe diep een integratie gaat.

### 5.8 Hosting, gegevensbescherming en informatiebeveiliging

Productiegegevens bevatten capaciteiten, kosten, klantorders en leveranciers. Leg vast waar de gegevens staan (regio, beheerder van het datacenter), hoe tenants worden gescheiden en welke certificeringen de leverancier kan tonen. Voor Amerikaanse kopers zijn vier punten het vragen waard:

- **Datalocatie.** Vraag schriftelijk in welke cloudregio uw gegevens worden opgeslagen. Als de leverancier alleen in de EU hostt, controleer dan of dat past bij uw klantcontracten en interne beleid. Als uw waardestroomgegevens technische gegevens bevatten die onder ITAR of EAR vallen (gebruikelijk in de lucht- en ruimtevaart en defensie), betrek dan uw team voor exportcompliance voordat u die gegevens in een cloudservice plaatst.
- **Attestaties.** Veel Amerikaanse securityteams vragen om een SOC 2-rapport, een audit volgens de criteria van het AICPA voor controles die relevant zijn voor beveiliging, beschikbaarheid, verwerkingsintegriteit, vertrouwelijkheid of privacy [45]. Het internationale alternatief is een ISO/IEC 27001-certificering, die een geauditeerd managementsysteem voor informatiebeveiliging aantoont. Beide kunnen acceptabel zijn; vraag om het certificaat met scope en vervaldatum, of om het rapport zelf. Belangrijk is of de ontwikkeling en exploitatie van de software binnen de scope vallen.
- **Uw eigen risicokader.** Het Cybersecurity Framework 2.0 van NIST, uitgebracht op 26 februari 2024, is bedoeld voor organisaties van elke omvang en sector en voegde de functie "Govern" toe aan Identify, Protect, Detect, Respond en Recover [44]. U kunt het gebruiken om uw eigen leveranciersbeoordelingen te structureren.
- **EU-wetgeving voor gegevensbescherming.** Bij een Europese leverancier ziet u vaak verwijzingen naar de AVG, de Algemene Verordening Gegevensbescherming van de EU, en een verwerkersovereenkomst (DPA). Een DPA op grond van de AVG is een contract over de manier waarop de leverancier persoonsgegevens namens u verwerkt; bij productietools gaat het vooral om gebruikersaccounts en namen. Het is geen beveiligingscertificering.

### 5.9 Kosten, proefperiode en ondersteuning

Vraag naar het licentiemodel (per gebruiker, per fabriek, per module), een gratis versie of proefperiode, de inspanning voor training en implementatie, en advies van de leverancier of een partner. Voor Amerikaanse kopers van een buitenlandse leverancier geldt ook: vraag naar ondersteuningstijden in uw tijdzones en of er in de VS gevestigde implementatiepartners zijn. Veel leveranciers in deze markt publiceren hun prijzen niet; dat is gebruikelijk, maar maakt vergelijken moeilijker. Vraag om een schriftelijke offerte voor de totale kosten over drie jaar, inclusief integratie.

## 6. Selectiechecklist

**Vraagstelling en scope**
- [ ] De hoofdvraag is schriftelijk vastgelegd (documenteren, evalueren, simuleren, plannen of monitoren).
- [ ] De bijbehorende categorie uit Sectie 3 is gekozen.
- [ ] Een pilotgebied met één productfamilie en een meetbaar doel is benoemd.

**Gegevens**
- [ ] U kunt starten zonder systeemintegratie.
- [ ] Excel/CSV-import is getest met uw eigen gegevens.
- [ ] De koppeling met uw ERP en MES is beschreven (standaardconnector of project).
- [ ] De verantwoordelijkheid voor de exploitatie van de interfaces is vastgelegd.

**Functionaliteit**
- [ ] Metrieken en formules zijn zichtbaar en kunnen worden aangepast.
- [ ] Scenario's kunnen worden geversioneerd en vergeleken.
- [ ] Dynamiek (variabiliteit, storingen, productmix) wordt gemodelleerd, indien nodig.
- [ ] Varianten, stuklijsten en omsteltvolgordes kunnen worden gemodelleerd, indien nodig.
- [ ] Acties en PDCA worden in de tool bijgehouden.

**Exploitatie en beveiliging**
- [ ] Hostingregio en exploitant van het datacenter zijn schriftelijk bevestigd.
- [ ] Een SOC 2-rapport of een ISO/IEC 27001-certificaat met scope is beschikbaar.
- [ ] Een verwerkersovereenkomst is beschikbaar, waar persoonsgegevens betrokken zijn.
- [ ] Vragen over exportcontrole (ITAR/EAR) zijn afgehandeld, indien relevant.
- [ ] Single sign-on en het rollenmodel passen bij uw IT.

**Economie**
- [ ] De totale kosten over drie jaar, inclusief integratie en training, zijn bekend.
- [ ] Veronderstelde voordelen zijn onderbouwd met uw eigen nulmetingen (zie Sectie 9).
- [ ] U heeft gesproken met een referentieklant uit uw eigen branche.

## 7. Uitrol in zes stappen

**Stap 1: Stel het doel en het pilotgebied vast.** Kies een productfamilie met een duidelijk probleem, zoals een lange doorlooptijd of slechte levering op tijd, en een meetbaar doel. Een pilot over alle fabrieken tegelijk loopt meestal vast op coördinatie.

**Stap 2: Breng de huidige situatie in kaart op de gemba.** Ga naar de productievloer, tel de voorraad en vraag naar de tijden. De software is bedoeld om de gegevens vast te leggen, niet om het zelf kijken te vervangen.

**Stap 3: Verrijk de gegevens.** Voeg gegevens uit ERP, MES of machinedataverzameling toe aan de rondgang, eerst als bestand. Verschillen tussen wat u heeft waargenomen en wat de systemen zeggen, zijn op zichzelf al een resultaat: ze laten zien waar de stamgegevens niet kloppen.

**Stap 4: Ontwikkel de toekomstige situatie en scenario's.** Werk als team een toekomstige situatie uit en vergelijk varianten. Als variabiliteit of productmix een rol spelen, test de varianten dan met een simulatie.

**Stap 5: Implementeer en volg acties.** Vertaal de toekomstige situatie in acties met eigenaren en uiterlijke datums. Als de oplossing planning en uitvoering omvat, test dan in het pilotgebied of de planningen op de productievloer standhouden.

**Stap 6: Borg en rol uit.** Bepaal wie de waardestroom onderhoudt, hoe vaak de meetwaarden worden besproken en wanneer de analyse wordt herhaald. Pas dan is een uitrol naar meer waardestromen zinvol.

## 8. Veelgemaakte fouten bij selectie en uitrol

- **Eerst het hulpmiddel, dan de methode:** Als uw team de waardestroomanalyse nog niet beheerst, helpt software het alleen om sneller verkeerde kaarten te tekenen. Leer eerst de methode.
- **Categorieën door elkaar halen:** Een tekentool koopt u wanneer er planningsvragen spelen, of een APS-systeem wanneer niemand de waardestroom nog kent.
- **Scenariovergelijking verwarren met simulatie:** Twee statische kaarten naast elkaar laten geen knelpunten zien die alleen door variabiliteit ontstaan.
- **Datakwaliteit onderschatten:** Routings met verouderde tijden leveren in elke software onrealistische resultaten. Plan tijd in voor het opschonen van stamgegevens.
- **Integratie te vroeg forceren:** Een interfaceproject van maanden vóór het eerste resultaat kost draagvlak. Begin met bestandsimport.
- **Leveranciersvoordeelcijfers overnemen:** Percentages als "tot 50 procent kortere doorlooptijd" beschrijven afzonderlijke cases onder onbekende omstandigheden. Dergelijke cijfers komen veel voor in de markt, van APS-suites tot VSM-tools (voorbeelden staan in hoofdstuk 17). Reken met uw eigen uitgangswaarden.
- **Niemand is eigenaar van de waardestroom:** Zonder waardestroommanager veroudert de beste digitale kaart net zo snel als het bruine papier.
- **De productievloer buiten beschouwing laten:** Planningen en taken die operators niet begrijpen of niet kunnen bevestigen, blijven theorie.

## 9. Een businesscase zonder verzonnen cijfers

Een geloofwaardige businesscase voor softwaretoepassingen voor waardestroomanalyse steunt op uw eigen uitgangswaarden, niet op percentages uit brochures. De redenering kan worden opgesplitst in vijf hefbomen en drie kostenblokken.

**Hefboom 1: voorraad en doorlooptijd.** Volgens de wet van Little geldt in stabiele toestand: werk in proces = doorvoer × doorlooptijd. Als u de doorlooptijd verkort bij een gelijkblijvende doorvoer, verkleint u het vastliggende voorraadkapitaal in dezelfde verhouding. Reken met uw huidige WIP, uw kapitaalkosten en een streefhypothese die het projectteam kan verdedigen.

**Hefboom 2: levertrouw.** Te late leveringen kosten contractuele boetes, spoedvracht, spoedorders en vertrouwen van de klant. Leg de huidige levertrouw vast en de rechtstreeks toe te rekenen kosten van te late orders over het afgelopen jaar.

**Hefboom 3: capaciteit en vermeden investeringen.** Als een simulatie aantoont dat een schijnbaar knelpunt kan worden opgelost via volgorde-planning of buffers, vervalt een investering. Deze hefboom is vaak de grootste, maar eenmalig, en telt alleen mee als de investering daadwerkelijk was gepland.

**Hefboom 4: plannings- en analyse-inspanning.** Tel de uren die nu worden besteed aan waardestroomwandelingen, het bijhouden van spreadsheets en handmatige planning. Waardeer de besparingen voorzichtig: vrijgekomen tijd is alleen een voordeel als ze voor iets anders wordt ingezet.

**Hefboom 5: kwaliteit van beslissingen.** Moeilijk te kwantificeren, maar reëel: slechte investeringen die niet worden gedaan en productmixbeslissingen die vooraf worden getoetst. Benoem deze hefboom kwalitatief in plaats van er verzonnen getallen voor in te vullen.

**Kosten:** (1) licenties of abonnementen over de geplande looptijd, (2) implementatie, inclusief datavoorbereiding, interfaces, training en consultancy, (3) interne tijd voor de pilot, het onderhoud van stamgegevens en het doorlopende eigenaarschap van de waardestroom.

**Werkwijze:** Stel voor elke hefboom een uitgangswaarde, een conservatieve en een verwachte streefhypothese vast, en reken beide scenario's door tegen de kosten. De pilot dient om de hypothesen met echte gegevens te toetsen. Een leverancier die instemt met een pilot met meetbare criteria is betrouwbaarder dan een leverancier die batenbedragen noemt zonder methodologie.

# Deel B: iFAKT Polaris in detail

> **Opmerking: De auteur werkt bij iFAKT GmbH.**

De volgende secties beschrijven [iFAKT Polaris](https://www.m365.fm/entity/polaris/) op basis van de productpagina's van [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) (Engels en Duits, opgehaald op 20 november 2026), de vermeldingen op Microsoft AppSource, een bijdrage op de Microsoft Tech Community, de prijspagina's van WirtschaftsWoche en de technische literatuur. Waar een bewering uitsluitend van de leverancier afkomstig is, vermeldt de tekst dit. De auteur kent geen onafhankelijke vergelijkende tests of analistenbeoordelingen van Polaris.

## 10. Achtergrond en methode

iFAKT GmbH heeft zijn hoofdkantoor aan de Curiestrasse 2, 70563 Stuttgart, Duitsland (handelsregister: Amtsgericht Stuttgart, HRB 22661) [5]. De Engelstalige bedrijfspagina van het bedrijf stelt dat de kantoren dicht bij de luchthaven van Stuttgart liggen [4]. Volgens het bedrijf werkt het al meer dan 25 jaar aan de optimalisatie van productie- en bedrijfsprocessen [3]. De bedrijfspagina vermeldt de automobielsector, lucht- en ruimtevaart, werktuigbouw en medische technologie als branches [4].

Voor de beoordeling van Polaris is de bedrijfsgeschiedenis minder belangrijk dan de methodische gedachte achter de software. Hier is een controleerbaar spoor: Jörg Drees, in het ZWF-artikel uit 2023 vermeld met als affiliatie iFAKT GmbH [24], publiceerde tussen 2011 en 2023 meerdere artikelen met medeauteurs in ZWF, het laatste samen met Fraunhofer IPA. ZWF (*Zeitschrift für wirtschaftlichen Fabrikbetrieb*) is een Duitstalig vakblad voor techniek en productie, waarvan het archief nu wordt beheerd door De Gruyter Brill; de titels hieronder zijn vertaald, de oorspronkelijke Duitse titels staan in de bronnen. De artikelen tonen een ontwikkelingslijn die terugkomt in de modulestructuur van Polaris.

| Jaar | Artikel (vertaalde titel) | Auteurs | Referentie | Verband met Polaris |
|---|---|---|---|---|
| 2011 | Productieoptimalisatie door metrics uit waardestroommodellering | Jörg Drees, Christoph Sack | ZWF 106 (6), blz. 466–470, DOI 10.3139/104.110589 [21] | metriekberekening in de waardestroom (VSM) |
| 2014 | Dynamische simulatie van waardestromen | Stefan Türck, Andreas Weimer, Lars Schubert, Jörg Drees | ZWF 109 (11), blz. 839–842, DOI 10.3139/104.111242 [22] | stap van statische analyse naar simulatie |
| 2018 | Nieuwe perspectieven voor de waardestroommethode: Value Stream Management 4.0, Next Generation | Jörg Drees | ZWF 113 (9), blz. 605–609, DOI 10.3139/104.111974 [23] | waardestroommethode en software voor verbonden productie (Industrie 4.0, IIoT) |
| 2023 | Een universele data-interface voor digitale waardestroomdiensten | Markus Böhm, Jörg Drees, Brandon Sai, Klaus Erlach, Steffi Stambera, Tim Teriete | ZWF 118 (5), blz. 293–297, DOI 10.1515/zwf-2023-1062 [24] | machinegebeurtenisdata als gemeenschappelijke databasis voor waardestroomdiensten |

**2011: metrics.** Drees en Sack beschrijven hoe metrics uit waardestroommodellering kunnen worden gebruikt om de productie te optimaliseren [21]. Dat is de kern van een dedicated VSM-tool: symbolen met een berekeningslogica erachter.

**2014: dynamiek.** Volgens het abstract van het artikel van Türck, Weimer, [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) en [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) gaat de waardestroommodellering van een statische blik op waardestromen en metrics naar dynamische simulatie, en wordt gevraagd welke nieuwe mogelijkheden tijd biedt voor productieoptimalisatie [22]. Dit idee leeft voort in de module Simulator, die echter werkt op het product-proces-middelenmodel van de Designer en niet op de waardestroomkaart (sectie 12).

**2018: verbondenheid.** Drees vraagt hoe de waardestroommethode en de bijbehorende software zich moeten ontwikkelen nu Industrie 4.0 en IIoT informatie door de hele fabriek verbinden [23].

**2021 tot 2023: realtime data met Fraunhofer IPA.** In het onderzoeksproject ECOWERT (afkorting van de Duitse titel "realtime waardestroomanalyse voor duurzame productieoptimalisatie") werkte Fraunhofer IPA samen met iFAKT GmbH aan software die productiedata uit ERP-systemen en andere bronnen automatisch en bijna in realtime opvraagt en weergeeft. De Duitse deelstaat Baden-Württemberg financierde het eenjarige project, dat liep tot 31 augustus 2022, met ongeveer 300.000 euro uit het programma Invest BW; ESB Business School van de Hochschule Reutlingen hielp bij de bouw van een demonstrator [25]. Een vakartikel van Drees, Stambera en Böhm beschrijft het technische traject: machinedata in JSON-formaat via een IIoT-gateway (genoemd worden OPC UA, MTConnect, IO-Link en MQTT; het project gebruikte MQTT met Sparkplug), een tijdreeksdatabase, en de koppeling met de waardestroomtoepassing Polaris VSM, die metrics berekent via een KPI-boom voor geselecteerde periodes en productfamilies [26]. Het ZWF-artikel uit 2023 generaliseert deze aanpak tot een universele data-interface; volgens de auteurs is binnen ECOWERT een waardestroomdienst voor metriekberekening en visualisatie aangesloten [24]. Tot de auteurs behoort Klaus Erlach van Fraunhofer IPA, auteur van het standaard Duitse leerboek over waardestroomontwerp [40].

**Wat dit spoor bewijst en wat niet:** De publicaties laten zien dat de auteurs al lange tijd werken aan metrics, simulatie en dataconnectiviteit voor waardestromen, en dat een onderzoeksinstituut samenwerkte met iFAKT. Ze bewijzen niet dat de huidige software beter is dan andere. Fraunhofer IPA beoordeelt in zijn persbericht ook geen enkel product; het beschrijft een onderzoeksproject, en volgens het instituut gaven de apps destijds "nog geen suggesties" (vertaald uit het Duits) [25].

Waardestroomanalyse met live data en een continu datamodel is ook het onderwerp van de podcastaflevering [Value Stream Mapping with live data and a data model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) op m365.fm.

## 11. Platformprincipe: één datamodel, zeven modules

Volgens de FAQ van de leverancier is Polaris een modulair softwareplatform voor de smart factory dat productie-optimalisatie omvat, van waardestroomanalyse via simulatie en AI-ondersteunde planning tot shopfloor-uitvoering en rapportage [3]. De website noemt zeven modules: VSM, BSM, Designer, Simulator, Optimizer, Operator en Analyzer. Volgens de leverancier werken alle modules met hetzelfde datamodel, zodat simulatie of planning later kan worden toegevoegd zonder de gegevens opnieuw te verzamelen [3]. De leverancier beschrijft de stroom als een lus: "Map → Simulate → Optimize → Execute → Analyze" [3].

Op de Engelse homepage van iFAKT vat iFAKT het aanbod als volgt samen: "Polaris combines ERP data with a manufacturing digital twin to optimize schedules" [1]. Genoemde kernfuncties zijn "Constraint-based scheduling (resources, skills, shifts, buffers)", "What-if simulation for disruptions and mix changes" en een "KPI cockpit: lead time, WIP, utilization, OTD" [1]. De pagina benadrukt drie principes: ERP-, Excel- of shopfloor-gegevens koppelen of starten met een slank model ("plug and play"), één platform voor mapping, simulatie, planning en uitvoering zonder van tool te wisselen, en complexiteit modelleren, zoals productmix, omstellingen, vaardigheden, diensten, bewerkingsvolgordes, buffers en verstoringen [1][2].

Voor de start noemt de FAQ twee wegen: de modules VSM en BSM zijn beschikbaar in een gratis versie zonder creditcard; voor Simulator, Optimizer en Operator biedt de leverancier een persoonlijke demo en proefperiode aan [3]. Je hoeft niet elke module te gebruiken; volgens de leverancier begint veel bedrijf met VSM, omdat dat geen systeemintegratie vereist [3]. Voor simulatie en planning geeft de FAQ een gebruikelijke inwerktijd van twee tot vier weken, inclusief dataintegratie, modelconfiguratie en training [3]. Die doorlooptijd is een bewering van de leverancier; in de praktijk hangt die sterk af van de kwaliteit van de stamgegevens en de interfaces.

Om de architectuur te begrijpen, helpt het de modules te koppelen aan de categorieën uit deel A:

| Module | Categorie uit deel A | Databasis volgens de leverancier | Uitvoer |
|---|---|---|---|
| VSM | speciale VSM-tool | handmatige invoer, optioneel ERP, MES, machinedataverzameling, datawarehouse [6] | waardestroomkaart met metrics, scenario's |
| BSM | procesmodellering (swimlanes) | handmatige modellering [7] | proceskaart met tijdlijn en metrics |
| Designer | modellering (PPR-graaf) | ERP-gegevens, stuklijsten, procestijden, middelen [8] | product-proces-middel-model, netwerkdiagram |
| Simulator | simulatie | PPR-model uit de Designer [9] | bezetting, knelpunten, scenario's in de tijd |
| Optimizer | APS | PPR-model, ERP-gegevens, beschikbaarheid van middelen [10] | uitvoerbaar productieschema |
| Operator | shopfloor-uitvoering | planning uit de Optimizer [11] | taken per medewerker, bevestigingen |
| Analyzer | BI / metrics | metrics uit alle modules [12] | dashboards, plan versus werkelijkheid |

Voor een classificatie als bedrijfsapplicatie in de taxonomie van m365.fm, zie de entiteitspagina [Business Application](https://www.m365.fm/entity/business-application/).

## 12. De modules één voor één

### 12.1 Polaris VSM: digitale waardestroomanalyse

**Doel:** [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is de module voor waardestroomanalyse. De post van Microsoft over de AppSource-vermelding beschrijft het als een "digitale lean-managementtool" die productiebedrijven gebruiken om toeleveringsketens en waardestromen in kaart te brengen; een formulesysteem en Kanban- en Kaizenborden moeten KPI's berekenen, controleren en weergeven, en teams kunnen op afstand samenwerken [17].

**Functies volgens de pagina van de leverancier** [6][14]:
- import uit ERP-, MES-, machinedataverzamelings- en datawarehousesystemen via de Polaris IIoT Gateway, combineerbaar met handmatige observaties op de werkvloer
- automatische berekening van "25+ standaard VSM-KPI's", waaronder doorlooptijd, toegevoegde-waardeverhouding, voorraad, OEE en takt versus cyclustijd; aangepaste metrieken en formules zijn mogelijk
- "50+ vooraf gedefinieerde Lean-symbolen" met editor en kleurcodering
- drie hiërarchieniveaus: end-to-end waardestroom (niveau 1), deelprocessen (niveau 2) en gedetailleerde bewerkingen (niveau 3)
- "Onbeperkt scenario's aanmaken (A, B, C, D…)", gevoeligheidsanalyse en naast elkaar vergelijken van metrieken; waardestromen kunnen worden gedupliceerd om wijzigingen te testen zonder de productie te raken
- rollen Admin, Editor en Viewer in een multi-tenantarchitectuur, gelijktijdig bewerken, versiegeschiedenis, wijzigingsregistratie en PDCA-documentatie van acties
- "Export in meerdere formaten (JPEG, Excel, SVG)" plus versleutelde export voor archivering
- ondersteuning aangeduid als "AI-Support" in het rapportage- en dashboardgedeelte, zonder verdere beschrijving

**Bewijs buiten de website van de leverancier:** AppSource-vermelding [15][17]; gebruik als waardestroomtoepassing gekoppeld aan een tijdreeksdatabase in het vakartikel over automatisch vastgelegde waardestroomgegevens [26].

**Claims van de leverancier zonder methodologie:** "Complete VSM in 2-4 uur (vs. 2-3 dagen bruin papier & Excel)", "100% datanauwkeurigheid (geen handmatige Excel-fouten)" en een "30-40% lagere implementatierisicoreductie" [6]. De productpagina spreekt ook van het voltooien van waardestroomprojecten in een derde van de tijd [14]. Geen van deze claims gaat vergezeld van een methodologie. "100% datanauwkeurigheid" kan redelijkerwijs alleen verwijzen naar het elimineren van overschrijffouten, niet naar de kwaliteit van de invoergegevens.

**Beperkingen en wat niet gedocumenteerd is:** De VSM-pagina beschrijft scenario's en gevoeligheidsanalyse, maar **geen dynamische simulatie** in de zin van paragraaf 5.3 [6]. Als u variabiliteit, storingen of productmix in de tijd wilt bestuderen, hebt u de Simulator of een ander simulatiehulpmiddel nodig. De pagina vermeldt geen integratie met Microsoft Teams of Power BI. Prijzen worden niet gepubliceerd; volgens de FAQ is VSM beschikbaar in een gratis niveau [3], waarvan de reikwijdte de modulepagina niet beschrijft.

**Verder lezen:** compendium [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) · post [Value Stream Management Software for Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)

### 12.2 Polaris BSM: bedrijfsprocessen als swimlanes

**Doel:** [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/) (Business Swimlane Modeling) past de waardestroomvisie toe op bedrijfsprocessen zoals offertes, engineering, productietechniek of orderverwerking (lean-beoefenaars in de VS noemen dit vaak office- of transactionele waardestroomanalyse). De AppSource-vermelding beschrijft het als een "Digitale tool voor het modelleren van bedrijfsprocessen voor bedrijfsprocesanalyse in digitaal lean-management" [16].

**Functies volgens de pagina van de leverancier** [7]:
- pools als organisatorische containers, lanes voor rollen, vaardigheden of afdelingen, die getoond of verborgen kunnen worden
- modellering van dataobjecten, datastores en IT-systemen; mediabreuken tussen papier en digitaal of tussen systemen worden zichtbaar
- een tijdlijn met activiteitsduren op het kritieke pad, plus doorlooptijden en wachttijden
- een operatorbalansdiagram (gestapelde staven van cyclustijdaandelen) om onevenwichtigheden op te sporen
- automatische berekening van kritiek pad, doorlooptijd, cyclustijd en toegevoegde-waardeverhouding; volgens de pagina "10+" standaard procesmetrieken en aangepaste metrieken
- classificatie als waardetoevoegend of niet-waardetoevoegend, kwantificering van verspillingskosten
- onbeperkte scenario's (huidig, toekomstig, alternatieven) met impactanalyse
- kaizenkaarten die tijdens het modelleren worden aangemaakt en aan activiteiten worden gekoppeld, georganiseerd in PDCA- of DMAIC-cycli

**Plannen volgens AppSource** [16]: P0 "Read Only" (alle inhoud lezen), P1 "Basic" (BPMN-opnames, swimlane-sjablonen, basisformules, doorlooptijd, balansdiagram, snelbewerkingsweergave), P2 "Excellence" (alle functies van P0 en P1) en P3 "Integrate & Customize" (geen beschrijving). De vermelding geeft geen prijzen.

**Beperkingen en wat niet gedocumenteerd is:** De modulepagina noemt geen notatiestandaard; alleen de AppSource-vermelding vermeldt BPMN-opnames in plan P1 [7][16]. Of BSM-modellen in BPMN-conforme vorm kunnen worden geïmporteerd of geëxporteerd, is niet gedocumenteerd. De BSM-pagina noemt geen exportformaten. Als u zoekt naar een volledige BPM-suite met procesuitvoering (een workflowengine), dan is BSM volgens de beschrijving een analyse- en verbeterinstrument, geen procesautomatisering.

### 12.3 Polaris Designer: het product-proces-middelenmodel

**Doel:** Volgens de leverancier zet de [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) invoergegevens om in een gestructureerde product-proces-middelen-kennisgraaf (PPR-kennisgraaf), die dient als gedeelde basis voor simulatie en optimalisatie [8]. Het vormt de schakel tussen de waardestroombeschouwing en de simulatie- en planningsmodules.

**Functies volgens de leveranciersite** [8]:
- PPR-modellering: product als productie- of engineeringstuklijst (MBOM/EBOM), proces met omsteltijden, machine- en handlingtijden, middelen als stations, teams en zones
- invoergegevens: ERP-gegevens, productiestuklijsten, procestijden, middelenstructuren en randvoorwaarden
- automatisch genereren van een netwerkdiagram uit de productielogica, berekening van het kritieke pad
- wat-als-scenario's en vergelijking van huidige en geoptimaliseerde doorlooptijd
- productgebaseerde zones die processen groeperen per productfamilie en capaciteitsbalancering ondersteunen

**Beoordeling:** Voor het variantenprobleem uit paragraaf 5.4 is een PPR-model over het algemeen beter geschikt dan een waardestroomkaart, omdat varianten worden weergegeven via hun stuklijsten en routings in plaats van via afzonderlijke procesblokken. De startpagina gebruikt voor dit model de term "digital twin" [1]; voor de verschillende betekenissen van "digital twin" zie het compendium [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/).

**Beperkingen en wat niet gedocumenteerd is:** De pagina noemt geen importformaten of importmechanisme, geen kwantitatieve resultaten en geen expliciete variantconfiguratie (zoals regelsets voor configureerbare producten) [8]. Hoe randvoorwaarden in de graaf worden gemodelleerd, blijft open.

### 12.4 Polaris Simulator: scenario's in de tijd

**Doel:** Volgens de leverancier voert de [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) de netwerkdiagrammen van de Designer uit via configureerbare modellen van stations, lijnen en hallen (op gebouwniveau), voor enkele en meerdere lijnen [9].

**Functies volgens de leveranciersite** [9]:
- simulatie gebaseerd op de echte proceslogica uit het PPR-model
- scenario's voor capaciteit, bezetting en buffers
- analyse van dynamische productmixen op gedeelde middelen
- detectie van knelpunten en benuttingsonevenwichten in de tijd
- in de tijd gemeten benutting van mensen en technische middelen, over- en onderbenutting
- capaciteitstransparantie over ploegen en scenario's heen
- flexibele configuratie van stations en productieroutes

**Beoordeling:** De module dekt daarmee de vragen die deel A aan de categorie simulatie toewijst, vooral productmix en gedeelde middelen. Een klantcitaat op de startpagina (Everllance) luidt: "The Polaris simulation helped us identify problems in our planning data" [1]; dat is één citaat op de site van de leverancier, geen onderzoek.

**Beperkingen en wat niet gedocumenteerd is:** De pagina vermeldt het simulatietype niet expliciet (zoals discrete-event), definieert de outputmetrieken zoals doorvoer of WIP niet in detail en geeft geen informatie over stochastische invoer, zoals storingsverdelingen [9]. Of resultaten als verdelingen of als enkelvoudige waarden worden gerapporteerd, wordt niet beschreven. Voor transportsystemen, robotica of virtuele inbedrijfstelling zijn de gespecialiseerde tools uit paragraaf 3.3 de beoogde keuze; Polaris beschrijft zichzelf niet als 3D-materiaalstroomsimulator.

### 12.5 Polaris Optimizer: planning onder randvoorwaarden

**Doel:** Volgens de leverancier zet de [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) de PPR-graaf om in een uitvoerbare, geoptimaliseerde productieplanning op basis van ERP-gegevens en beschikbaarheid van middelen [10]. Het komt overeen met de categorie APS.

**Functies volgens de leverancierspagina** [10][13]:
- afweging van middelen, shifts, zones, vaardigheden en capaciteiten; orderprioriteiten ingesteld door planners
- planning van machines, medewerkers en gereedschap
- weergave van te late orders en leveringsrisico's
- lotgrootte per variant en machine, volgorde op basis van omsteltijden tussen varianten
- afweging tussen voorraad, opslagkosten en serviceniveau
- bevestigingen vanaf de werkvloer via de Operator, automatische herplanning na verstoringen met impactanalyse
- middelen die over projecten heen gedeeld worden
- operationele kortetermijnplanning en langetermijnzicht op capaciteit

Volgens de FAQ gebruikt Polaris "constraint-based optimization algorithms" om planningen te genereren die rekening houden met machinecapaciteit, vaardigheden van medewerkers, shifts, materialen en leverdatums [3]. De pagina over planning en uitvoering noemt ook beperkingen over meerdere middelen, omsteltrajecten en prioriteitsgestuurde planning; voor tests kunnen gegevens worden geïmporteerd via bestand, Excel of ERP-export, en in productie is er continue synchronisatie met ERP, MES of andere systemen [13].

**Claims van de leverancier zonder methodologie:** De planningspagina noemt 50 procent kortere doorlooptijd, 40 procent capaciteitsoptimalisatie en tot 80 procent minder handmatige planninginspanning [13]; de Optimizer-pagina spreekt van minimale doorlooptijd en maximale kosten-efficiëntie met één klik en een aanzienlijke reductie van de omsteltijd [10]. Uitgangssituatie, steekproef en meetmethode worden niet vermeld.

**Beperkingen en wat niet gedocumenteerd is:** De Optimizer wordt beschreven als AI-ondersteund (de planningspagina heeft de titel "AI-powered production planning and scheduling"), zonder algoritmen of methoden te noemen [10][13]. De modulepagina geeft geen concrete details over ERP-integratie; de FAQ vermeldt standaardinterfaces naar SAP en Microsoft Dynamics [3]. Planning over meerdere fabrieken of de volledige supply chain wordt niet beschreven. Meer context in het compendium [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

### 12.6 Polaris Operator: taken voor de werkvloer

**Doel:** Volgens de leverancier neemt de [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) de geoptimaliseerde planning rechtstreeks van de Optimizer over en toont deze op taakniveau op de werkvloer [11].

**Functies volgens de leverancierspagina** [11]:
- een individuele, actuele taakweergave per medewerker
- een kritieke-padweergave voor shiftleiders
- werkinstructies ingebed in taken
- taken pauzeren of blokkeren, of markeren met gestructureerde feedback
- realtime bevestigingen van voortgang, vertragingen, verstoringen, werkelijke bezetting en pauzes
- een live overzicht van het werk in uitvoering voor planners
- productiegegevens die terugvloeien naar de planning

**Beoordeling:** De Operator is ontworpen als het terugkoppelingskanaal tussen plan en uitvoering: een planning is alleen zo goed als de feedback over de vraag of ze op de werkvloer standhield. Functioneel overlapt het met onderdelen van een MES (werkwachtrij, bevestigingen), maar het beschrijft zichzelf niet als MES.

**Beperkingen en wat niet gedocumenteerd is:** De pagina noemt geen ondersteunde apparaten en geen prestatiemetingen [11]. De relatie tot een bestaand MES (aanvullend, vervangend of parallel) wordt niet beschreven; regel dit vroeg in een project om dubbele bevestigingen te voorkomen. Meer over dagelijkse routines op de werkvloer in het compendium [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

### 12.7 Polaris Analyzer: KPI-dashboards

**Doel:** Volgens de leverancier brengt de [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) metrieken uit alle Polaris-modules samen in dashboards [12].

**Functies volgens de leverancierspagina** [12]:
- centrale metrieken over alle Polaris-modules
- visualisatie van doorlooptijden, bezetting, knelpunten en projectstatus
- vergelijking van scenario's, planningen en werkelijke prestaties
- detectie van capaciteitsgrenzen en verbeterpotentieel

**Beperkingen en wat niet gedocumenteerd is:** De pagina noemt geen gegevensbronnen buiten de Polaris-modules, geen dashboardtypen en geen koppeling met externe BI-tools zoals Power BI [12]. Als uw bedrijf een centraal BI-systeem gebruikt, verduidelijk dan hoe de metrieken daarheen komen. Metrieddefinities worden behandeld in het compendium [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/).

### 12.8 Overzicht: wat per module is gedocumenteerd

| Module | Functiebeschrijving op ifakt.de | Externe onderbouwing | Nutscijfers met methodologie | Belangrijkste open vraag |
|---|---|---|---|---|
| VSM | gedetailleerd [6][14] | AppSource [15], Tech Community [17], vakartikel [26] | nee | omvang van de gratis versie |
| BSM | gedetailleerd [7] | AppSource met abonnementen [16] | nee | notatie, export |
| Designer | gemiddeld [8] | vakartikelen over de aanpak [22][24] (indirect) | nee | importformaten, variantlogica |
| Simulator | gemiddeld [9] | WirtschaftsWoche-prijs voor Polaris IMS [18] (indirect) | nee | simulatietype, stochastiek |
| Optimizer | gedetailleerd [10][13] | WirtschaftsWoche-prijs voor Polaris IMS [18] (indirect) | nee (cijfers zonder methodologie) | algoritmen, ERP-integratie |
| Operator | gemiddeld [11] | WirtschaftsWoche-prijs voor Polaris IMS [18] (indirect) | nee | apparaten, grens met MES |
| Analyzer | beknopt [12] | geen | nee | externe BI-koppeling |

## 13. Polaris IMS en de Best of Technology Award 2025

Naast de zeven modulenamen komt u de naam **Polaris IMS** tegen. Onder deze naam heeft iFAKT GmbH deelgenomen aan de Best of Technology Award 2025 van WirtschaftsWoche, een Duits wekelijks zakenmagazine. Op de winnarspagina van WirtschaftsWoche staat iFAKT met Polaris IMS (daar omschreven als een productieplanningssysteem) vermeld op de **tweede plaats in de categorie Production**, achter Skeleton Technologies en vóór OMRON Electronics [18]. Andere finalisten in de categorie waren remberg en UNWARE [19].

In de juryomschrijving (in het Duits) wordt Polaris IMS beschreven als een intelligent systeem dat een digitale tweeling van de productie opbouwt en het efficiënte gebruik van middelen automatisch plant; het plan wordt op de werkvloer uitgevoerd en met realtime gegevens bewaakt, en bij verstoringen stelt AI verbeteringen voor [18][19]. Naar de mening van de auteur komt dit functioneel overeen met het samenspel van Designer, Simulator, Optimizer en Operator. Ook een klantcitaat op de startpagina (Silhouette) gebruikt de naam: "The use of Polaris IMS was the next step towards the Smart Factory for our organization" [1]. Op de sponsorpagina van het lean-evenement Lean Around The Clock 2025 beschrijft iFAKT zichzelf met een "POLARIS suite" bestaande uit de modules IMS, BSM en VSM [20].

**Interpretatie:** Op basis van deze bronnen is IMS de naam voor het deel van het platform dat verder gaat dan waardestroom- en procesmodellering, namelijk modellering, simulatie, planning en uitvoering. De huidige website splitst dit deel op in afzonderlijke modules en gebruikt de naam IMS alleen in het klantcitaat [1]. De leverancier heeft geen officiële koppeling van IMS aan de huidige modulenamen gepubliceerd; de koppeling is de interpretatie van de auteur.

**Wat de prijs zegt:** De Best of Technology Award is een juryprijs van een zakelijke publicatie. Ze laat zien dat een jury het concept binnen de inzendingen in de categorie Production hoog heeft beoordeeld. Het is geen functionele of prestatietest en vervangt geen test met uw eigen gegevens. Voor lezers in de VS: het is een prijs van een Duitse publicatie, beoordeeld onder de eigen inzendingen; behandel het als één gegeven, niet als marktbevestiging.

## 14. Branches volgens het bedrijf

De volgende informatie komt van de website van iFAKT GmbH. Het is zelf opgegeven; de omvang en duur van elke klantrelatie worden niet vermeld.

| Branche volgens ifakt.de | Beschrijving op de website | Genoemde bedrijven (logo's, referenties, citaten) |
|---|---|---|
| Lucht- en ruimtevaart | hoge precisie voor de luchtvaartindustrie [2] | Airbus [1] |
| Automotive en mobiliteit | just-in-time en just-in-sequence productie van componentenfabricage tot eindassemblage [2] | Magna, Vitesco, ZF, Junghans [1] |
| Werktuigbouw en automatisering | engineer-to-order tot kleine series, stuklijsten en variantenproductie [2] | Karl Dungs, Pfannenberg, Weidmüller, GRASS [1] |
| Energie en infrastructuur | productieplanning voor kritieke infrastructuur [2] | MAN Energy, Siemens Energy, Liebherr [1] |

De logobalk op de Engelstalige homepage toont ook FFG, Fraunhofer, Helbling, Jumo, Liebherr, Pfannenberg, Silhouette, Airbus, Dungs en Eismann [1]. Citaten komen van Silhouette, Airbus en Everllance [1], en op de VSM-productpagina daarnaast van Siemens Energy over coaching door iFAKT [14]. De bedrijfspagina noemt medische technologie ook als branche [4]. De FAQ zegt dat Polaris is "built for manufacturing companies in aerospace, automotive, mechanical engineering, and energy" en noemt productiemanagers, lean-consultants en operationele teams als beoogde gebruikers [3].

**Wat u kunt afleiden:** De nadruk ligt op discrete productie en assemblage met veel variatie en complexe producten. Voor procesindustrieën (chemie, farma, voeding met recepturen en batches) noemt de leverancier geen referenties. De genoemde klanten zijn meestal Europese bedrijven of Europese vestigingen van internationale concerns; de bekeken pagina's noemen geen Amerikaanse fabrieken als referentie.

## 15. Polaris in het Microsoft-ecosysteem

Voor bedrijven die sterk leunen op Microsoft zijn de volgende punten gedocumenteerd:

- **AppSource-vermeldingen:** Polaris VSM ("Polaris VSM - Digital Value Stream Mapping") en Polaris BSM ("Polaris BSM - Business Swimlane Modeling") staan vermeld als oplossingen van iFAKT GmbH op Microsoft AppSource [15][16].
- **Microsoft Tech Community:** Op 11 juli 2024 publiceerde de Marketplace-blog van de Tech Community een bericht over Polaris VSM onder "ISV Success for Business Applications." Volgens Microsoft biedt het programma "platforms, resources, and support designed to help partners develop, publish, and market business apps" [17].
- **Hosting:** De moduleplbladen voor VSM en BSM zeggen "Hosted on Microsoft Azure West Europe" [6][7]. De regiolijst van Microsoft plaatst West Europe in Nederland [43]. De FAQ spreekt algemener van "secure European cloud infrastructure" [3].
- **ERP-integratie:** Volgens de FAQ kan Polaris via standaardinterfaces verbinding maken met SAP, Microsoft Dynamics en andere ERP-platforms, en kan het gegevens importeren uit spreadsheets en CSV-bestanden [3].
- **Partnerstatus:** De bedrijfspagina noemt de status Microsoft Gold Partner (behaald in 2019) en de competentie "Gold Application Development" voor de tiende keer achter elkaar [4]. Volgens Microsoft konden Gold- en Silver-competenties alleen tot 30 september 2022 worden verlengd; sinds 3 oktober 2022 kent Microsoft in plaats daarvan Solutions Partner-aanduidingen toe [38]. De vermelding beschrijft dus een historische status.

**Niet gedocumenteerd:** Native integratie met Microsoft Teams, een Power BI-connector, single sign-on met Microsoft Entra ID of beschikbaarheid als Dynamics 365-extensie worden op de bekeken pagina's niet genoemd. Een AppSource-vermelding betekent dat u via de Microsoft-marktplaats kunt kopen, niet automatisch een diepe integratie. Als deze punten voor u belangrijk zijn, laat ze dan tijdens de selectie schriftelijk bevestigen. Meer achtergrond over productie-IT op Azure staat in het compendium [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/).

## 16. Beveiliging, hosting en certificeringen

| Aspect | Verklaring | Bron | Status |
|---|---|---|---|
| ISO 9001 | gecertificeerd volgens DIN EN ISO 9001, van kracht vanaf oktober 2014 | bedrijfspagina [4] | verklaring van de leverancier, gedocumenteerd op de website |
| ISO/IEC 27001 | "TÜV SÜD – ISO 9001 & ISO/IEC 27001 Certified" (badge); FAQ: gecertificeerd volgens ISO 27001 en ISO 9001, geaudit door TÜV SÜD | homepage, FAQ [1][2][3] | verklaring van de leverancier; certificaat met reikwijdte niet publiekelijk ingezien |
| Hosting | Microsoft Azure West Europe, gevestigd in Nederland (VSM, BSM); "secure European cloud infrastructure" (FAQ) | modulepagina's, FAQ, Microsoft-regiolijst [3][6][7][43] | verklaring van de leverancier |
| Versleuteling, rollen, audits | versleuteling, op rollen gebaseerd toegangsbeheer en regelmatige beveiligingsaudits | FAQ [3] | verklaring van de leverancier |
| Tenant-isolatie, authenticatie | geïsoleerde tenant-omgevingen, OAuth 2.0 | BSM-pagina [7] | verklaring van de leverancier |
| AVG/GDPR | "100% GDPR-compliant" | VSM- en BSM-pagina's [6][7] | verklaring van de leverancier; naleving is geen certificering |
| SOC 2 | op de bekeken pagina's niet vermeld | n.v.t. | de leverancier vragen |
| Hostingregio VS | op de bekeken pagina's niet vermeld | n.v.t. | de leverancier vragen |

**Hoe dit te lezen:** Een ISO/IEC 27001-certificering dekt het managementsysteem van een organisatie binnen een afgebakende reikwijdte. Vraag bij de selectie om het certificaat te zien en controleer of ontwikkeling en beheer van Polaris binnen de reikwijdte vallen en hoe lang het certificaat geldig is. TÜV SÜD is een Duitse keuring- en certificeringsinstelling. "GDPR-compliant" is een zelfbeoordeling; doorslaggevend zijn de verwerkersovereenkomst, de lijst van subverwerkers en de technische en organisatorische maatregelen. Als uw security-team een SOC 2-rapport vereist (paragraaf 5.8), vraag er dan vroeg naar; de bekeken pagina's vermelden alleen ISO-certificeringen. Als u een installatie in uw eigen datacenter nodig heeft: een on-premises optie wordt op de bekeken pagina's niet genoemd; de FAQ vermeldt alleen gebruik op Europese cloudinfrastructuur [3]. Voor Amerikaanse bedrijven betekent dit bovendien dat volgens de bekeken pagina's gegevens buiten de VS worden gehost; controleer dit tegen klantcontracten en, in de lucht- en ruimtevaart en defensie, tegen exportcontroleregels.

## 17. Wat de leverancier belooft en hoe u dat test

De homepage vermeldt als resultaten een verkorting van de doorlooptijd van "Up To 50%" (omschreven als "Average decrease in production cycle time"), een optimalisatie van de capaciteit van "Up To 40%" ("Improvement in machine utilization rates") en een kwaliteitsverbetering van "Up To 25%" ("Reduction in schedule deviations and missed deadlines") [1]. De planningspagina noemt bovendien tot 80 procent minder handmatige planninginspanning [13]. Voor geen van deze cijfers is de uitgangssituatie, het aantal projecten of de meetmethode gepubliceerd. Let op de formulering op de homepage: "Up To 50%" naast "Average decrease" combineert een maximum met een gemiddelde, een reden te meer om te vragen hoe het cijfer is berekend.

Dergelijke claims zijn in deze markt gebruikelijk. Siemens bijvoorbeeld noemt voor Opcenter APS tot 50 procent lagere voorraad en tot 50 procent betere levertreffer [36]. Lees dergelijke cijfers als een bovengrens uit afzonderlijke cases, niet als verwachte waarde, ongeacht welke leverancier ze noemt.

Zo vertaalt u beloften naar toetsbare uitspraken:

1. **Vraag naar de berekening:** Welke uitgangs- en doelwaarden, over welke periode, bij welke klant, met welke definitie van doorlooptijd?
2. **Vraag om een referentiegesprek** met een gebruiker uit uw branche en type productie, bij voorkeur een Amerikaanse vestiging als dat voor u van belang is.
3. **Spreek een pilot af met exitcriteria:** één waardestroom, uw eigen gegevens, vooraf vastgelegde metrieken en doelen.
4. **Vergelijk plan en werkelijkheid** in de pilot: Houden de planningen uit de Optimizer stand op de werkvloer? Hoe vaak moet u opnieuw inplannen?
5. **Beoordeel de inspanning eerlijk:** Hoeveel tijd kostte het opschonen van stamgegevens en hoeveel de koppeling?

Deze teststappen gelden even zeer voor elke leverancier in deel A.

## 18. Voor wie Polaris geschikt is en voor wie niet

**Op basis van de functiebeschrijving is Polaris het overwegen waard als**
- u discrete productie of assemblage met veel varianten, stuklijsten en gedeelde resources draait,
- u value stream mapping, simulatie en planning op een gedeeld datamodel wilt verbinden in plaats van gegevens tussen tools te verplaatsen,
- u wilt beginnen met value stream mapping zonder systeemintegratie en later planning en uitvoering wilt toevoegen,
- u bedrijfsprocessen buiten de productie (offertes, engineering, orderverwerking) met dezelfde lean-logica (BSM) wilt bekijken,
- een in de EU gehoste cloudoplossing past bij uw IT-beleid.

**Polaris is waarschijnlijk minder geschikt als**
- u value stream maps slechts af en toe documenteert; dan is een tekenprogramma met sjabloon vaak voldoende (paragraaf 3.1),
- u gedetailleerde 3D-simulatie van materiaalstromen met transportbanden, robotica of virtuele inbedrijfstelling nodig heeft; daarvoor zijn gespecialiseerde simulatietools bedoeld (paragraaf 3.3),
- u in procesindustrieën werkt met recepturen en batches, waarvoor de leverancier geen referenties noemt,
- u een installatie in uw eigen datacenter of in een Amerikaanse hostingregio vereist, waarvan geen van beide op de beoordeelde pagina's wordt beschreven,
- u een SOC 2-rapport als voorwaarde nodig heeft, wat de beoordeelde pagina's niet vermelden,
- u op zoek bent naar volledige supply chain- of multi-plantplanning, die de modulepagina's niet beschrijven,
- u al een APS en MES gebruikt die uw planningsvragen beantwoorden; weeg de toegevoegde waarde dan afzonderlijk af tegen een pure VSM-tool,
- u openbare prijzen of onafhankelijke analistenbeoordelingen wilt zien voordat u een shortlist maakt.

**Alternatieven per categorie:** voor pure documentatie Visio, Lucidchart of Miro [27][28][29]; voor value streams met metrieken en optionele simulatie eVSM [42], SimVSM [30][31] of visTable met lay-outcontext [32]; voor value streams met simulatie Plant Simulation X met de VSM-bibliotheek [33]; voor datagedreven reconstructie van value streams ONIQ [35]; voor APS bijvoorbeeld Opcenter APS [36]. Dit is een selectie ter oriëntatie, geen rangschikking.

## 19. Veelgestelde vragen

### Wat is software voor waardestroomanalyse?
Software voor waardestroomanalyse ondersteunt het in kaart brengen van de waardestroom en het ontwerpen van de toekomstige situatie digitaal. Het aanbod loopt van tekenprogramma's met lean-symbolen, via speciale tools met automatische berekening van kengetallen en scenario's, tot platforms die simulatie en productieplanning omvatten (Sectie 3).

### Wat is de beste software voor value stream mapping?
Er bestaat geen enkele beste tool, omdat de categorieën verschillende vragen beantwoorden. Voor workshops en documentatie is een tekenprogramma met een VSM-sjabloon meestal voldoende. Voor regelmatig value stream-werk met metrieken past een speciale VSM-tool. Voor variabiliteit en productmix heb je simulatie nodig, en voor leveringsdata onder beperkingen een APS-systeem. Gebruik de beslisgids in Sectie 4 en de checklist in Sectie 6, en wees voorzichtig met ranglijsten die door leveranciers zijn geschreven of door hen zijn gefinancierd; de twee langste Amerikaanse ranglijstpagina's voor dit zoekwoord vallen onder een van beide [47][48].

### Is er gratis software voor value stream mapping?
Ja, in meerdere categorieën. Tekenprogramma's en whiteboardtools zoals Lucidchart en Miro bieden gratis instapabonnementen met VSM-vormen of sjablonen [28][29]. Bij iFAKT Polaris zijn de VSM- en BSM-modules volgens de FAQ beschikbaar in een gratis versie zonder creditcard [3]; de leverancier beschrijft de omvang van die versie niet in detail. Controleer bij elk gratis aanbod het aantal gebruikers, de exportmogelijkheden en de gegevensopslag.

### Kan ik value stream mapping doen in Excel of Visio?
Ja. Excel-sjablonen werken voor kleine mappings en eenvoudige berekeningen, maar elke wijziging moet met de hand worden overgenomen, en het aantal versies loopt snel op (sectie 2). Microsoft Visio heeft een sjabloon voor value stream mapping; volgens Microsoft vereist deze Visio Professional (of de oudere Premium-editie) en is hij niet opgenomen in Visio Standard [27]. Noch Excel noch Visio simuleert variabiliteit.

### Wat is het verschil tussen software voor waardestroomanalyse en simulatiesoftware?
Software voor waardestroomanalyse rekent meestal statisch met gemiddelden: dagen voorraad, doorlooptijd, waardetoevoegingsratio. Simulatiesoftware modelleert de processen over tijd, inclusief variabiliteit, storingen, productmix en gedeelde resources [22][33][37]. Een vergelijking van twee kaarten naast elkaar is geen simulatie.

### Wat is het verschil tussen value stream mapping en procesmapping?
Een value stream map volgt één productfamilie over de volledige stroom, van leverancier tot klant, en toont de materiaalstroom, informatiestroom, voorraad en een doorlooptijdlijn. Een procesmap (zoals een swimlane-diagram of BPMN-model) toont de stappen, rollen en beslissingen van één proces in detail. Beide kunnen worden gecombineerd: in Polaris dekt VSM de value streams en BSM de swimlane-procesmaps [6][7].

### Is "value stream management software" hetzelfde?
Niet altijd. In de maakindustrie betekent value stream management het voortdurend beheren langs waardestromen (ISO 22468 [39]). In softwareontwikkeling meten "value stream management"-platforms de doorstroming van werkitems van ticket tot deployment. Verschillende Amerikaanse overzichtsartikelen vermengen beide betekenissen [50]. Controleer of een tool materiaal, voorraad en machines beheert voordat u het op uw shortlist zet.

### Wat is iFAKT Polaris?
Een modulair softwareplatform van iFAKT GmbH (Stuttgart, Duitsland) voor productieoptimalisatie, van value stream mapping via simulatie en planning tot shopfloor-uitvoering en rapportage. Volgens de leverancier bestaat het uit zeven modules met een gedeeld datamodel: VSM, BSM, Designer, Simulator, Optimizer, Operator en Analyzer [3].

### Wat is Polaris IMS?
Onder de naam Polaris IMS behaalde iFAKT de tweede plaats in de categorie Production van de Best of Technology Award 2025 van het Duitse zakenweekblad WirtschaftsWoche [18]. De beschrijving van de jury noemt een digitale tweeling van de productie, geautomatiseerde capaciteitsplanning, shopfloor-uitvoering met realtime monitoring en AI-voorstellen bij verstoringen [18][19]. Op de huidige website is deze scope verdeeld over de modules Designer, Simulator, Optimizer en Operator (Sectie 13; de koppeling is de interpretatie van de auteur).

### Kan Polaris VSM simuleren?
De productpagina van de Polaris VSM-module beschrijft scenario's, gevoeligheidsanalyses en vergelijkingen van kengetallen, maar geen dynamische simulatie [6]. Simulatie wordt aangeboden door de afzonderlijke module Simulator, die werkt op het product-proces-middelenmodel van de Designer [9].

### Welke data heeft Polaris nodig, en moet ik mijn ERP koppelen?
Niet voor VSM en BSM: volgens de leverancier is er geen systeemintegratie nodig om te beginnen [3]. Simulatie en planning hebben gegevens nodig over producten, stuklijsten, procestijden en middelen; voor tests via bestand, Excel of ERP-export, in productie via continue synchronisatie met ERP, MES of andere systemen [13]. Volgens de FAQ zijn er standaardinterfaces naar SAP en Microsoft Dynamics [3].

### Is Polaris geïntegreerd met Microsoft 365 of Teams?
Gedocumenteerd zijn AppSource-vermeldingen voor Polaris VSM en BSM [15][16], een bericht op de Microsoft Tech Community [17] en hosting van VSM en BSM op Microsoft Azure West Europe volgens de moduleпagina's [6][7]. Integratie met Teams of Power BI wordt op de bekeken pagina's niet genoemd.

### Waar wordt Polaris gehost, en heeft iFAKT SOC 2?
De pagina's van VSM en BSM noemen Microsoft Azure West Europe [6][7], een regio in Nederland [43]; de FAQ spreekt over Europese cloudinfrastructuur [3]. De website vermeldt ISO 9001 (sinds oktober 2014) en certificering ISO/IEC 27001 door TÜV SÜD [1][3][4]. Een SOC 2-rapport en een Amerikaanse hostingregio worden op de bekeken pagina's niet genoemd. Vraag naar certificaten met vermelding van de scope, en vraag rechtstreeks naar SOC 2 als uw securityteam dat vereist.

### Hoe lang duurt de implementatie?
Volgens de leverancier hebben VSM en BSM geen opzet nodig; voor simulatie en planning geeft de FAQ een gebruikelijke onboardingtijd van twee tot vier weken, inclusief dataintegratie, modelconfiguratie en training [3]. De werkelijke duur hangt vooral af van de kwaliteit van stamdata en van de interfaces.

### Hoeveel kost Polaris?
De leverancier publiceert geen prijzen. De AppSource-vermelding van BSM noemt abonnementen van "Read Only" tot "Integrate & Customize" zonder prijzen [16]; voor Simulator, Optimizer en Operator biedt de FAQ een demo met proefperiode [3].

### Wat zijn alternatieven voor Polaris?
Dat hangt af van de categorie: tekentools zoals Visio, Lucidchart of Miro voor documentatie [27][28][29]; gespecialiseerde tools zoals eVSM, SimVSM of visTable [42][30][32]; simulatie met Plant Simulation, AnyLogic of FlexSim [33][34]; datagedreven benaderingen zoals ONIQ [35]; en APS-systemen zoals Opcenter APS [36]. Sectie 4 vergelijkt de categorieën.

## 20. Conclusie

Als u software voor value stream mapping kiest, begin dan niet met productnamen, maar met de vraag die de software moet beantwoorden. Documentatie, periodieke evaluatie met kengetallen, dynamische simulatie, planning onder beperkingen en voortdurende analyse van werkelijke data zijn verschillende taken, die door verschillende categorieën software worden uitgevoerd. De selectiechecklist in Sectie 6 en de logica van de businesscase in Sectie 9 helpen u om aanbiedingen vergelijkbaar te maken zonder te vertrouwen op brochurecijfers. Voor Amerikaanse kopers geldt: voeg hostingregio, SOC 2- of ISO/IEC 27001-scope en, waar relevant, exportcontrole vroeg aan de lijst toe.

iFAKT Polaris is een van de platformen die verschillende categorieën verbinden via een gedeeld datamodel: waardestroom- en processanalyse (VSM, BSM), product-proces-middelmodellering (Designer), simulatie, op beperkingen gebaseerde planning (Optimizer), taakbeheer op de werkvloer (Operator) en rapportage (Analyzer). Wat kan worden geverifieerd: de functiebeschrijvingen op de pagina's van de leverancier, twee AppSource-vermeldingen, een bericht op de Microsoft Tech Community, de tweede plaats in de categorie Productie van de 2025 Best of Technology Award, de onderzoekssamenwerking ECOWERT met Fraunhofer IPA en een reeks ZWF-tijdschriftartikelen die twaalf jaar beslaan. Niet gedocumenteerd: prestatiecijfers met opgegeven methodologie, simulatie in de VSM-module, integratie met Teams of Power BI, een hostingregio in de VS, een SOC 2-rapport en openbare prijzen.

Voor discrete productiebedrijven met veel varianten die van waardestroom naar planning willen overstappen, is Polaris op basis van de functiebeschrijving een kandidaat voor een pilot. Voor pure documentatie, 3D-simulatie van materiaalstromen of procesindustrie passen andere categorieën beter. In elk geval: beslis op basis van een pilot met uw eigen gegevens en vooraf vastgestelde meetgrootheden, niet op basis van deze of enige andere tekst.

## Verder lezen op m365.fm

**Entiteiten**
- [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) · [Business Application](https://www.m365.fm/entity/business-application/)
- Modules: [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) · [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/) · [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) · [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) · [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)
- Personen: [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) · [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) · [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Berichten en afleveringen**
- [Value Stream Management Software for Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)
- [What is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/)
- Podcast: [Value Stream Mapping with live data and a data model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Compendia**
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is de host van m365.fm en werkt bij iFAKT GmbH. Op m365.fm schrijft hij over waardestroombeheer, productieplanning en de digitale transformatie van de productie binnen het Microsoft-ecosysteem.

> **Let op: de auteur werkt bij iFAKT GmbH.**

*iFAKT GmbH ([entiteitspagina](https://www.m365.fm/entity/ifakt/)) is de leverancier van iFAKT Polaris.*

# Sources

All online sources retrieved on November 20, 2026. Titles of German-language sources are given in the original, with a translation in parentheses where helpful.

1. iFAKT GmbH: Polaris (home page, English). https://www.ifakt.de/en
2. iFAKT GmbH: Polaris (home page, German). https://www.ifakt.de/de
3. iFAKT GmbH: FAQ. https://www.ifakt.de/en/faq
4. iFAKT GmbH: About iFAKT (company page). https://www.ifakt.de/en/company/
5. iFAKT GmbH: Impressum (legal notice): iFAKT GmbH, Curiestr. 2, 70563 Stuttgart; Amtsgericht Stuttgart, HRB 22661. https://www.ifakt.de/de/imprint
6. iFAKT GmbH: Polaris VSM, Value Stream Mapping Software (module page, English and German). https://www.ifakt.de/en/solutions/value-stream-mapping-software · https://www.ifakt.de/de/solutions/value-stream-mapping-software
7. iFAKT GmbH: Polaris BSM, Business Swim Lane Modelling (module page). https://www.ifakt.de/en/solutions/business-swimlane-modelling
8. iFAKT GmbH: Polaris Designer (module page). https://www.ifakt.de/en/solutions/designer
9. iFAKT GmbH: Polaris Simulator (module page). https://www.ifakt.de/en/solutions/simulator
10. iFAKT GmbH: Polaris Optimizer (module page). https://www.ifakt.de/en/solutions/optimizer
11. iFAKT GmbH: Polaris Operator (module page). https://www.ifakt.de/en/solutions/operator
12. iFAKT GmbH: Polaris Analyzer (module page). https://www.ifakt.de/en/solutions/analyzer
13. iFAKT GmbH: Planning & Execution, AI-powered production planning and scheduling (application page). https://www.ifakt.de/en/software/ims/
14. iFAKT GmbH: Polaris VSM, Digital Value Stream Tool in Lean Management (product page). https://www.ifakt.de/en/software/vsm/
15. Microsoft AppSource: Polaris VSM - Digital Value Stream Mapping (iFAKT GmbH). https://appsource.microsoft.com/en-us/product/web-apps/ifaktgmbh.ifakt_vsm_1?tab=Overview
16. Microsoft AppSource: Polaris BSM - Business Swimlane Modeling (iFAKT GmbH). https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1
17. Microsoft Tech Community, Marketplace Blog: Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536
18. WirtschaftsWoche: Best of Technology Award, Gewinner 2025 (winners 2025), category Produktion (Production). https://award.wiwo.de/bot/gewinner-2025/
19. WirtschaftsWoche: Best of Technology Award, Finalisten 2025 (finalists 2025). https://award.wiwo.de/bot/finalisten-2025/
20. LeanBase: Lean Around The Clock 2025, sponsor iFAKT GmbH. https://leanbase.de/latc/sponsors/2025-ifakt
21. Drees, J.; Sack, C.: Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
22. Türck, S.; Weimer, A.; Schubert, L.; Drees, J.: Dynamische Simulation von Wertströmen. ZWF 109 (11), 2014, pp. 839–842. DOI: 10.3139/104.111242. https://www.degruyterbrill.com/document/doi/10.3139/104.111242/html
23. Drees, J.: Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation. ZWF 113 (9), 2018, pp. 605–609. DOI: 10.3139/104.111974. https://www.degruyterbrill.com/document/doi/10.3139/104.111974/html
24. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (Fraunhofer IPA, iFAKT GmbH): Universelle Datenschnittstelle für digitale Wertstromdienste. Eventbasierte Wertstromanalyse als einheitliche Datenbasis für individuelle Dienste zur Produktionsoptimierung. ZWF 118 (5), 2023, pp. 293–297. DOI: 10.1515/zwf-2023-1062. https://www.degruyterbrill.com/document/doi/10.1515/zwf-2023-1062/html
25. Fraunhofer IPA: Die Wertstromanalyse wird ins digitale Zeitalter übertragen (value stream analysis is moving into the digital age), press release, July 5, 2022. https://www.ipa.fraunhofer.de/de/presse/presseinformationen/die-wertstromanalyse-wird-ins-digitale-zeitalter-uebertragen.html (an AI-translated English republication exists at reinraum.de: https://www.reinraum.de/en/news/the-value-stream-analysis-is-being-transferred-into-the-digital-age.html)
26. Drees, J.; Stambera, S.; Böhm, M.: Daten für Wertstromanalysen automatisch erfassen (capturing value stream data automatically). IT&Production, January 12, 2023. https://www.it-production.com/industrie-4-0-iot/wertstromanalyse-mit-iiot-anbindung/
27. Microsoft Support: Create a value stream map (Visio). https://support.microsoft.com/en-us/visio/create-a-value-stream-map
28. Lucid Software: Value stream mapping symbols and icons (Lucidchart VSM shape library). https://lucid.co/diagram/vsm/value-stream-mapping-symbols
29. Miro: Value stream mapping templates. https://miro.com/templates/value-stream-map
30. SimPlan AG: SimVSM, Wertstromanalyse und Simulation in einer App (German product page). https://www.simplan.de/software/simvsm/
31. SimPlan AG: Digital value stream mapping and analysis as the key to informed decisions (English). https://www.simplan.de/en/from-paper-to-digital-value-stream/
32. visTable GmbH: Wertstromanalyse Software (German product page). https://www.vistable.com/de/solutions/wertstromanalyse-software/
33. Siemens: Plant Simulation X value stream mapping (VSM library). https://www.siemens.com/en-us/products/tecnomatix/offerings/plant-simulation-x-value-stream-mapping/
34. Wikipedia: List of discrete event simulation software (entries AnyLogic, FlexSim, Plant Simulation). https://en.wikipedia.org/wiki/List_of_discrete_event_simulation_software
35. PwC Store: ONIQ value stream analysis (English). https://store.pwc.de/en/products/oniq-value-stream-analysis
36. Siemens: Opcenter Advanced Planning and Scheduling (APS). https://www.siemens.com/en-us/products/opcenter/advanced-planning-scheduling-aps/
37. ATS Pro / Simio: Wertstromanalyse und Simulation im Vergleich (value stream mapping vs. simulation, German). https://simio-simulation.de/simulation-vs-wertstromanalyse-vsm
38. Microsoft Tech Community (News from Microsoft Norway): Silver and Gold competency partners, guidance on renewal, April 28, 2023. https://techcommunity.microsoft.com/blog/newsfrommicrosoftnorway/silver-and-gold-competency-partners---guidance-on-renewal/3808345
39. ISO 22468:2020 Value stream management (VSM). International Organization for Standardization. https://committee.iso.org/standard/73292.html?browse=ics
40. Erlach, K.: Wertstromdesign. Der Weg zur schlanken Fabrik. 3rd ed., Springer Vieweg, Berlin/Heidelberg 2020, ISBN 978-3-662-58906-9 (bibliographic data taken from the m365.fm Value Stream Mapping compendium).
41. Lean Enterprise Institute: Learning to See, by Mike Rother and John Shook (book page). https://www.lean.org/store/book/learning-to-see/
42. G2: eVSM product listing and reviews (vendor description "a complete lean toolkit to map, model and improve value streams of every type"). https://www.g2.com/products/evsm/reviews
43. Microsoft Learn: List of Azure regions (West Europe: Netherlands). https://learn.microsoft.com/azure/reliability/regions-list
44. NIST: NIST Releases Version 2.0 of Landmark Cybersecurity Framework, February 26, 2024. https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework
45. AICPA & CIMA: SOC 2 Reporting on an Examination of Controls at a Service Organization Relevant to Security, Availability, Processing Integrity, Confidentiality, or Privacy (guide). https://www.aicpa-cima.com/cpe-learning/publication/soc-2-reporting-on-an-examination-of-controls-at-a-service-organization-relevant-to-security-availability-processing-integrity-confidentiality-or-privacy
46. Wikipedia: Value-stream-mapping software. https://en.wikipedia.org/wiki/Value-stream-mapping_software
47. Lean Transition Solutions (Data Point): 7 Best Value Stream Mapping software for Manufacturing & Operations Teams (2026) (competitor, vendor-written). https://leandatapoint.com/blog/best-value-stream-mapping-software-for-manufacturing
48. Gitnux: Top 10 Best Value Stream Mapping Software of 2026 (competitor, labeled commissioned research). https://gitnux.org/best/value-stream-mapping-software/
49. ClickUp: 10 Value Stream Mapping Software to Improve Processes in 2026 (competitor, vendor-written). https://clickup.com/blog/value-stream-mapping-software/
50. Project-Management.com: Top Value Stream Mapping Tools & Software (competitor). https://project-management.com/value-stream-mapping-tools-software/
51. Lucidchart: Value stream mapping software (competitor, product page). https://www.lucidchart.com/pages/landing/value_stream_mapping
