# SEO metadata

| Field | Value |
|---|---|
| Meta title | Software voor productieplanning: de APS-gids (2026) |
| Meta description | Software voor productieplanning en APS uitgelegd: eindige capaciteit, knelpunten, drum-buffer-rope, EOQ, veiligheidsvoorraad, uitgewerkte voorbeelden en een checklist. |
| Slug | `production-scheduling-aps` |

# Software voor productieplanning en APS: De complete gids voor planningen die op de werkvloer standhouden

> **Kort antwoord:** Productieplanningssoftware met APS (advanced planning and scheduling) plant productieorders tegelijk tegen eindige capaciteit en beschikbaar materiaal. Klassieke MRP-logica in een ERP-systeem gaat uit van onbeperkte capaciteit en vaste doorlooptijden. Een APS modelleert machines, mensen, gereedschappen, omsteltijden, shifts en knelpunten, zodat de volgorde en data die het oplevert data zijn die uw fabriek daadwerkelijk kan halen.

Het is maandagochtend op de productieplanning. De MRP-run van het weekend heeft 140 werkorders aangemaakt met een startdatum van "deze week." De bewerkingscel heeft bijna twee weken werk op de plank liggen, de montage wacht op onderdelen, en verkoop wil een leverdatum waar niemand met een gerust hart op kan toezeggen. Dus wordt de planning opnieuw opgebouwd: in Excel, op het whiteboard, in een gesprek in de gang met de ploegchef. Tegen woensdag is hij alweer verouderd.

Als dit bekend voorkomt, ligt de oorzaak zelden aan een gebrek aan discipline. Het ligt aan de planningslogica. Material requirements planning (MRP) is ontworpen om één vraag te beantwoorden: *Welk materiaal heb ik nodig, en wanneer?* De vraag *Kan mijn fabriek dit werk in deze volgorde daadwerkelijk draaien?* beantwoordt het hooguit grof, of helemaal niet. Op die tweede vraag zijn detailplanning en APS gericht.

Deze gids behandelt de grondbeginselen van productieplanning en -besturing, de structurele zwakheden van MRP, de fysica van een fabriek, de werking van APS-systemen, de theorie van beperkingen (theory of constraints) met drum-buffer-rope, lean-bouwstenen zoals heijunka en lijnbalancering, de klassieke formules voor partijgrootte en veiligheidsvoorraad met uitgewerkte voorbeelden, en de selectie en implementatie van productieplanningssoftware met APS-mogelijkheden. Voor een korte definitie, zie de m365.fm-entiteitspagina [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/).

### Belangrijkste conclusies

- **ERP plant materiaal, APS plant haalbaarheid.** MRP-logica binnen een ERP gaat in de basisvorm uit van onbeperkte capaciteit en vaste geplande doorlooptijden. Een APS plant tegen eindige capaciteit en materiaalbeschikbaarheid tegelijk.
- **Doorlooptijd is vooral wachttijd.** De Wet van Little stelt: doorlooptijd = werk in proces ÷ doorvoer [9]. Verminder het WIP zonder het knelpunt uit te hongeren, en de doorlooptijden dalen.
- **Hoge bezetting kost tijd.** De wachttijd in de rij groeit met de factor u/(1−u), niet lineair. Bij 95% bezetting is de wachttijd bijna vijf keer zo lang als bij 80% [10][11].
- **Het knelpunt bepaalt het tempo.** De theorie van beperkingen (TOC) en drum-buffer-rope (DBR) stemmen orderrelease en volgordebepaling af op het knelpunt [1][2].
- **Klassieke formules zijn startpunten, geen waarheid.** De economische bestelhoeveelheid (EOQ) en de formule voor veiligheidsvoorraad berusten op vereenvoudigende aannames. De kostencurve van EOQ is vlak, en omsteltijd is meestal de grotere hefboom.
- **Een APS is slechts zo goed als de stamdata.** Routings, standaardtijden, omstelmatrices en capaciteitskalenders bepalen de kwaliteit van de planning meer dan het algoritme.

### Waar te beginnen, per rol

| U bent … | Lees eerst |
|---|---|
| Productieplanner of -roosteraar die vastzit aan onrealistische ERP-planningen | Hoofdstukken 3, 4 en 5 (zwakheden van MRP, fabrieksfysica, werking van APS) |
| Werkzaam in productiebesturing, produktietechniek of leiding op de werkvloer | Hoofdstukken 7 en 8 (knelpunt, DBR, takt, heijunka) |
| Werkzaam in supply chain, materiaal- of voorraadplanning | Hoofdstukken 9 en 10 (partijgrootte, veiligheidsvoorraad) |
| Leidinggevende van een APS-selectie of -implementatie | Hoofdstukken 13 tot en met 16 (selectie, data, roadmap, fouten) |
| Fabrieksmanager of operations-directeur | Kort antwoord, Hoofdstuk 11 (KPI's) en Hoofdstuk 21 (Conclusie) |

## Inhoudsopgave

1. [Waarom ERP-planningen op de werkvloer falen](#1-waarom-erp-planningen-op-de-werkvloer-falen)
2. [Grondbeginselen: wat productieplanning en -besturing omvat](#2-grondbeginselen-wat-productieplanning-en--beheersing-omvat)
3. [De zwakke punten van klassieke MRP-logica](#3-de-zwakheden-van-klassieke-mrp-logica)
4. [Factory physics: de wet van Little, bedrijfscurven en variabiliteit](#4-fabrieksfysica-de-wet-van-little-operationele-curven-en-variabiliteit)
5. [Wat een APS-systeem is en hoe het rekent](#5-wat-een-aps-systeem-is-en-hoe-het-rekent)
6. [ERP vs. APS vs. MES](#6-erp-vs-aps-vs-mes)
7. [Theory of constraints, drum-buffer-rope en buffermanagement](#7-theory-of-constraints-drum-buffer-rope-en-buffermanagement)
8. [Lean-bouwstenen in de planning: takt, heijunka, lijnbalancering, pull](#8-lean-bouwstenen-in-planning-takt-heijunka-lijnbalancering-pull)
9. [Partijgroottes: EOQ, uitgewerkt voorbeeld en beperkingen](#9-partijgrootte-eoq-uitgewerkt-voorbeeld-en-beperkingen)
10. [Veiligheidsvoorraad: formule en uitgewerkt voorbeeld](#10-veiligheidsvoorraad-formule-en-uitgewerkt-voorbeeld)
11. [KPI's voor productieplanning](#11-kpis-voor-productieplanning)
12. [Digital twin en simulatie](#12-digitale-tweeling-en-simulatie)
13. [Productieplanningssoftware kiezen: criteria en checklist](#13-productieplanningssoftware-kiezen-criteria-en-checklist)
14. [Dataeisen en kwaliteit van stamgegevens](#14-gegevenseisen-en-kwaliteit-van-stamgegevens)
15. [Stappenplan voor de implementatie van APS](#15-aps-implementatieroadmap)
16. [Veelgemaakte fouten en hoe je ze voorkomt](#16-veelgemaakte-fouten-en-hoe-je-ze-vermijdt)
17. [Bewijs: wat studies en gebruikers rapporteren](#17-bewijs-wat-studies-en-gebruikers-rapporteren)
18. [Constraint-based planning met iFAKT Polaris](#18-constraintgebaseerde-planning-met-ifakt-polaris)
19. [Woordenlijst](#19-verklarende-woordenlijst)
20. [FAQ: productieplanningssoftware en APS](#20-faq-productieplanningssoftware-en-aps)
21. [Conclusie](#21-conclusie)

## 1. Waarom ERP-planningen op de werkvloer falen

De meeste producenten plannen de productie in hun ERP-systeem, en dat heeft een goede reden: daar staan klantorders, stuklijsten, routings en voorraad. Een [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/)-systeem is het systeem van record voor hoeveelheden, waarden en data. De planlogica in de meeste ERP-systemen is echter gebaseerd op een methode die in de jaren zestig en zeventig is ontwikkeld en door Joseph Orlicky in zijn standaardwerk uit 1975 is beschreven: material requirements planning [24].

Planners herkennen de symptomen zodra deze logica zijn grenzen bereikt:

- **Overbelaste werkcentra op papier:** Het ERP plant orders in een week waarin de capaciteit van het werkcentrum al lang vol is.
- **Verzenddata op gevoel:** Toegezegde data zijn gebaseerd op standaard doorlooptijden, niet op de huidige belasting.
- **Schaduwplanning in Excel:** De echte gedetailleerde planning staat buiten het ERP, in spreadsheets, op whiteboards of in de hoofden van ervaren ploegleiders.
- **Spoedorders verdringen al het andere:** Elke spoedopdracht veroorzaakt elders nieuwe te late orders.
- **Veel voorraad en toch tekorten:** Er ligt genoeg materiaal op de vloer, maar niet wat de montage nu nodig heeft.
- **Planners als brandweer:** Een groot deel van de week gaat op aan herplannen in plaats van plannen.

Hoe wijdverspreid dit is, blijkt uit een enquête die IDC uitvoerde in opdracht van planningssoftwareleverancier Kinaxis. IDC ondervroeg in december 2023 meer dan 1.800 leiders van supply chains in negen landen, waaronder de VS en Canada; 83% zei dat hun organisatie niet binnen 24 uur kon reageren op een verstoring in de supply chain [32]. Voor de 200 Duitse respondenten meldde het Duitse vakblad Logistik Heute dat 37% uitsluitend op Excel vertrouwde, of op Excel in combinatie met losse tools, voor supply chain-planning, en dat 89% niet binnen 24 uur kon reageren op verstoringen [25]. Het onderzoek wordt door een leverancier gesponsord en gaat over supply chain-planning in het algemeen, niet specifiek over planning op de werkvloer, en de gepubliceerde release bevat geen Amerikaans cijfer over spreadsheets. Toch laat het de omvang van het probleem zien.

Het goede nieuws: de oorzaken zijn goed begrepen. Ze liggen in drie gebieden die deze gids achtereenvolgens behandelt: de planningslogica (hoofdstuk 3), de fysica van wachtrijen en voorraden (hoofdstuk 4) en het ontbrekende aandachtspunt op de bottleneck (hoofdstuk 7). Een kortere versie van het eerste argument staat in de m365.fm-post [Beyond MRP: Why Enterprise Resource Planning Fails at Finite Production Scheduling](https://www.m365.fm/community/u/mirko-p/blog/beyond-mrp-enterprise-resource-planning-finite-scheduling/).

## 2. Grondbeginselen: wat productieplanning en -beheersing omvat

### 2.1 Definities

**Productieplanning en -beheersing (PPC)** omvat alle taken waarmee een bedrijf beslist *wat*, *hoeveel*, *wanneer* en *waar* er wordt geproduceerd, en waarmee de uitvoering wordt gestart en bewaakt. Planning stelt doelen vast; beheersing voert die uit op de werkvloer en reageert op afwijkingen. In de Amerikaanse praktijk wordt hetzelfde terrein vaak manufacturing planning and control (MPC) genoemd. De professionele kennisbasis wordt onderhouden door ASCM, de Association for Supply Chain Management, via de APICS CPIM-certificering, waarvan de modules onder meer sales and operations planning, interne bevoorrading, voorraad en gedetailleerde planning omvatten [33].

Twee termen leiden regelmatig tot verwarring: **planning** en **scheduling**. Planning (rough-cut- of aggregaatplanning) werkt met geaggregeerde hoeveelheden, wekelijkse of maandelijkse periodes en groepen werkplekken. **Gedetailleerde scheduling** bepaalt per afzonderlijke bewerking op welke resource die draait, in welke volgorde en op welk tijdstip. Ze werkt in dagen, shifts of minuten en is de kern van wat een APS-systeem doet. In de Duitse praktijk gebruikt men het paar *Grobplanung* en *Feinplanung* voor hetzelfde onderscheid; in Duitse leveranciersliteratuur komt "Feinplanung" veel voor.

### 2.2 De planningsniveaus in het kort

De vakliteratuur ordent planning hiërarchisch, van het langetermijnverkoop- en capaciteitsplan tot de volgorde op één machine [7][12]. De tabel vat de niveaus samen. De horizonten zijn typische grootteordes en verschillen per branche en productietype.

| Niveau | Typische horizon | Kernvraag | Uitvoer | Typisch systeem |
|---|---|---|---|---|
| Sales and operations planning (S&OP) | 12 tot 24 maanden | Wat gaan we verkopen en welke capaciteit hebben we nodig? | Verkoop- en capaciteitsplan per productfamilie | ERP, planningstools, Excel |
| Master production schedule (MPS) | weken tot maanden | Welke eindproducten bouwen we, wanneer en hoeveel? | Onafhankelijke vraag, productieprogramma | ERP |
| Material requirements planning (MRP) | weken | Welke samenstellingen, onderdelen en grondstoffen hebben we nodig, en wanneer? | Afhankelijke vraag, geplande orders, inkoopaanvragen | ERP |
| Capacity requirements planning (CRP) | dagen tot weken | Wanneer draaien de bewerkingen, en is er voldoende capaciteit? | Mijlpaaldata, capaciteitsbelasting | ERP (grof), APS (nauwkeurig) |
| Gedetailleerde scheduling | uren tot dagen, doorlopend tot enkele weken | Welke bewerking draait op welke resource, in welke volgorde? | Resourceplanning, volgorde (Gantt-diagram) | APS, planningsmodule van MES, planbord |
| Productieactiviteitsbeheersing / dispatching | shift tot minuut | Welke order wordt vrijgegeven, wat gebeurt er als er iets stukgaat? | Vrijgaven, bevestigingen, triggers voor herplanning | MES, APS, werkvloer |

Hermann Lödding, een Duits onderzoeker van productiebeheersing, verdeelt productiebeheersing in vier taken: ordergeneratie, orderyrijgave, capaciteitsbeheersing en sequencing [12]. Die indeling is nuttig omdat ze laat zien dat een goede planning op zichzelf niet genoeg is. De beslissing *wanneer* een order de productie ingaat, beïnvloedt WIP en doorlooptijd vaak meer dan de volgorde op één machine.

### 2.3 Referentiemodellen: ISA-95, ASCM en het Aachener PPC-model

Amerikaanse producenten richten zich meestal op twee kaders. De ASCM/APICS-planningshiërarchie uit de tabel hierboven (S&OP, MPS, MRP, CRP, gedetailleerde scheduling, uitvoering) is de gangbare taal van planners en supply chainprofessionals [33]. ANSI/ISA-95 (internationaal gepubliceerd als IEC 62264) trekt de grens tussen bedrijfsplanning en logistiek (niveau 4, meestal ERP) en manufacturing operations management (niveau 3, meestal MES en scheduling). Deel 3, ANSI/ISA-95.00.03-2013, beschrijft de activiteitsmodellen van manufacturing operations management en definieert finite capacity scheduling als een methode waarbij werk wordt gepland voor een set productieresources zodanig dat geen enkele geplande capaciteit de beschikbare capaciteit overschrijdt [31].

In de Duitstalige landen is het dominante referentiemodel het **Aachen PPC-model** (*Aachener PPS-Modell*) van het FIR-instituut aan de RWTH Aachen University. Het wordt beschreven in meerdere edities van het standaard Duitse handboek *Produktionsplanung und -steuerung*; de vierde editie werd in 2012 samengesteld door Günther Schuh en Volker Stich [7]. Het model groepeert planning- en besturingstaken in drie categorieën:

- **Netwerktaken:** strategisch ontwerp van het productienetwerk, zoals beslissingen over locaties en leveranciers.
- **Kerntaken:** de taken die een order vooruithelpen, namelijk productieprogrammaplanning, planning van productiebehoeften, interne productieplanning en -besturing, en planning en besturing van externe inkoop.
- **Dwarsdoorsnijdende taken:** orderbeheer, voorraadbeheer en controlling, die over functies heen integreren en optimaliseren.

De waarde van alle drie de kaders ligt in de heldere scheiding van taken. Ze helpen bepalen welk systeem welke taak moet beheren: het ERP dekt doorgaans programma- en behoefteplanning, een APS dekt gedetailleerde interne productieplanning, en een MES dekt uitvoering en terugmeldingen.

### 2.4 Van MRP naar MRP II naar APS

De geschiedenis van planningssystemen verklaart veel van de huidige problemen:

1. **Bestelpunten en partijgroottеformules (vanaf 1913):** Ford Whitman Harris publiceerde in 1913 de formule voor de economische partijgrootte [17]. In de Duitstalige landen werd deze bekend via Kurt Andler (1929) en wordt daar nog steeds de *Andler-formule* genoemd [18].
2. **MRP (jaren zestig en zeventig):** Computers maakten het mogelijk om vraag via stuklijsten uit te splitsen en in de tijd te verschuiven met geplande doorlooptijden. Orlicky beschreef de methode in 1975 uitgebreid [24].
3. **MRP II (begin jaren tachtig):** Manufacturing Resource Planning voegde hoofdplanning, grofcapaciteitsplanning, capaciteitsbehoefteplanning (CRP) en de koppeling met financiële planning toe. De capaciteitscontrole bleef echter een stap achteraf: eerst plannen, dan de belasting tonen [10].
4. **ERP (jaren negentig):** ERP-systemen integreerden financiën, verkoop, inkoop en HR. De planningskern bleef vaak MRP II.
5. **APS (vanaf de jaren negentig):** Advanced Planning Systems pakken de achteraf uitgevoerde capaciteitscontrole aan door materiaal en capaciteit samen te plannen met optimalisatiemethoden. Ze vervangen het ERP niet; ze voegen planning toe die rekening houdt met eindige capaciteit [13].

## 3. De zwakheden van klassieke MRP-logica

MRP-logica is niet fout. Voor het bepalen van welk materiaal in welke hoeveelheid nodig is, is zij onmisbaar. Het wordt een probleem wanneer de uitvoer ongecontroleerd wordt gebruikt als productieplanning. Wallace Hopp en Mark Spearman bekritiseren in *Factory Physics* dat het basismodel van MRP vaste doorlooptijden aanneemt die niet van de belasting afhangen. Vaste doorlooptijden zijn echter alleen mogelijk bij onbeperkte capaciteit [10].

### 3.1 Oneindige capaciteit

MRP plant elke geplande order door de geplande doorlooptijd vanaf de vervaldatum terug te rekenen. Het controleert niet of het werkcentrum op dat moment vrij is. Dit heet **planning met oneindige capaciteit**. Downstream capaciteitsbehoefteplanning (CRP) toont overbelastingen, maar lost ze niet op. Dat wordt aan de planner overgelaten.

**Uitgewerkt voorbeeld: de overbelasting die MRP niet ziet**

Een bewerkingscentrum draait in twee ploegen, vijf dagen per week, 8 uur per ploeg: 80 uur capaciteit per week. De MRP-run levert deze belasting op:

| Week | Capaciteit (u) | MRP-belasting (u) | Verschil (u) | Belasting |
|---|---|---|---|---|
| Week 12 | 80 | 112 | −32 | 140% |
| Week 13 | 80 | 54 | +26 | 68% |
| Week 14 | 80 | 96 | −16 | 120% |
| **Totaal** | **240** | **262** | **−22** | **109%** |

Zelfs als de planner perfect egaliseert en werk uit week 12 naar week 13 verschuift, blijven er 22 uur over die in de drie weken niet kunnen worden uitgevoerd. Dan wordt overwerk, uitbesteding of een alternatieve machine ingepland, of minstens één order wordt te laat afgerond. Het ERP toont echter nog steeds elke order met de oorspronkelijke datum, en verkoop belooft leverdata op basis daarvan. Een APS zou de orders plannen tegen 80 uur per week en de vroegst realistische gereedmeldingsdatum rapporteren.

### 3.2 Vaste geplande doorlooptijden

De tweede aanname is een **vaste geplande doorlooptijd** per artikel of routing, bijvoorbeeld "frezen: 5 werkdagen". In werkelijkheid hangt de doorlooptijd sterk af van de actuele belasting, zoals sectie 4 laat zien. Wanneer de werkplaats leeg is, doorloopt een order het proces in twee dagen. Wanneer hij vol is, duurt het twee weken. Een vaste waarde is daarom bijna altijd ofwel te lang (gevolg: hoge voorraad, vroege vrijgave) ofwel te kort (gevolg: te late orders).

De geplande doorlooptijd bevat bovendien meestal een groot aandeel verplaatsings- en wachttijd. Peter Nyhuis en Hans-Peter Wiendahl van de Leibniz Universiteit Hannover onderscheiden bewerkingstijd (insteltijd en bewerking) van tussenbewerkingstijd (wachttijd voor en na de bewerking, plus transport) [8]. In jobshops is de tussenbewerkingstijd meestal het grotere deel. Deze wachttijd als vaste constante in de stamgegevens opnemen, legt haar vast.

### 3.3 Het doorlooptijdsyndroom

Wat gebeurt er wanneer planners op te late orders reageren door geplande doorlooptijden te verhogen? Het effect is al decennia bekend als het **doorlooptijdsyndroom** en wordt vooral in de context van MRP besproken [23]:

1. Orders worden te laat afgerond.
2. Planners verhogen de geplande doorlooptijden om op safe te spelen.
3. Orders worden hierdoor eerder vrijgegeven.
4. Er liggen meer orders tegelijk in de werkplaats; de WIP stijgt.
5. Volgens de wet van Little stijgt bij constante doorvoer de werkelijke doorlooptijd.
6. Orders worden opnieuw te laat afgerond, en de cyclus begint opnieuw.

In 2023 gebruikten Matthias Thürer, Nuno Fernandes, Stefan Haeussler en Mark Stevenson simulatie om te testen of dynamisch aangepaste geplande doorlooptijden make-to-order-werkplaatsen schaden. Hun antwoord: ja, maar niet op de manier die men zou verwachten. De schade komt vooral door het verkorten van geplande doorlooptijden in perioden met lage belasting, wat vervolgens de belasting in latere perioden met hoge belasting verhoogt [23]. In de praktijk: het aanpassen van geplande doorlooptijden zonder de ordervrijgave te beheersen verplaatst het probleem alleen.

De oplossingen zijn op belasting gebaseerde of op knelpunt gebaseerde ordervrijgave (secties 7 en 8) en eindige capaciteitsplanning die doorlooptijden afleidt uit de werkelijke planning in plaats van ze voor te schrijven.

### 3.4 Sequentiële planning

De derde zwakte is **sequentiële planning**: eerst het programma, dan materiaal, dan data, dan capaciteit. Elke stap neemt het vorige resultaat als vaststaand. Terugkoppeling zoals "deze machine is vol, dus verplaats ik de behoefte en daarmee de inkooporder" maakt geen deel uit van het ontwerp. Het resultaat zijn plannen die bij elke stap consistent zijn, maar als geheel niet uitvoerbaar.

| MRP-aanname | Realiteit op de werkvloer | Gevolg |
|---|---|---|
| Capaciteit is onbeperkt | Capaciteit is bij elk werkcentrum beperkt | overbelaste weken, onrealistische data |
| Doorlooptijden zijn vast | Doorlooptijden hangen af van de belasting | orders te vroeg of te laat vrijgegeven |
| Partijgroottes staan los van de volgorde | Insteltijden hangen af van de vorige variant | verloren capaciteit op het knelpunt |
| Planningsstappen verlopen na elkaar | Materiaal, capaciteit en data beïnvloeden elkaar | plannen die alleen op papier werken |
| Vraag en voorraad zijn exact bekend | Prognoses variëren, voorraadregistraties bevatten fouten | nerveusiteit, tekorten, veiligheidsbuffers |

## 4. Fabrieksfysica: de wet van Little, operationele curven en variabiliteit

Om te begrijpen waarom planningen mislukken, heb je drie verbanden nodig die gelden, ongeacht de sector of de software. Hopp en Spearman hebben ze samengevat onder de naam *Factory Physics* [10].

### 4.1 De wet van Little: WIP, doorvoer en cyclustijd

In 1961 bewees John D. C. Little een verband dat geldt voor elk stabiel systeem met aankomsten en vertrekken [9]. In productietermen:

> **Cyclustijd (CT) = werk in proces (WIP) ÷ doorvoer (TH)**

De formule geldt voor langetermijngemiddelden, ongeacht de verdeling van de bewerkingstijden of de volgorderegel. Let op de terminologie: in de wet van Little betekent "cyclustijd" de tijd die een order in het systeem doorbrengt (de doorstroomtijd of productiedoorlooptijd), niet de stationscyclustijd die in Hoofdstuk 8 wordt vergeleken met de takttijd.

**Uitgewerkt voorbeeld:** Een onderdelenwerkplaats voltooit gemiddeld 40 werkorders per werkdag. Gemiddeld liggen er 600 vrijgegeven, nog niet voltooide orders op de vloer.

- CT = 600 ÷ 40 = **15 werkdagen**

Als gecontroleerde orderlevering de WIP terugbrengt naar 320 orders, terwijl het knelpunt volledig gevoed blijft en de doorvoer op 40 orders per dag blijft:

- CT = 320 ÷ 40 = **8 werkdagen**

De doorlooptijd is bijna gehalveerd zonder dat één machine sneller draait. Daarom behoren WIP-beheersing en orderlevering tot de meest effectieve en goedkoopste hefbomen in productieplanning. Zie voor meer over deze maatstaf de entiteitspagina [Lead Time](https://www.m365.fm/entity/lead-time/).

**Belangrijke kanttekening:** De wet van Little zegt niet dat elke WIP-verlaging zonder bijwerkingen de doorlooptijd verkort. Als de WIP vóór het knelpunt zo sterk daalt dat het knelpunt leegloopt, daalt ook de doorvoer. Operationele curven beschrijven precies die relatie.

### 4.2 Operationele curven en het trechtermodel

Onderzoekers van het Instituut voor Productiesystemen en Logistiek (IFA) aan de Leibniz Universiteit Hannover ontwikkelden het **trechtermodel**: een werkcentrum wordt beschouwd als een trechter waarin orders binnenstromen en waaruit ze na bewerking weer vertrekken. De afgeleide **doorvoerdiagram** toont WIP, output en doorlooptijd in de tijd [8]. Voortbouwend hierop formuleerden Nyhuis en Wiendahl de **logistieke operationele curven**, die laten zien hoe de output en doorlooptijd van een werksysteem afhangen van de WIP [8]:

- Bij **lage WIP** stijgt de output bijna lineair bij elke extra order, en blijft de doorlooptijd dicht bij de pure bewerkingstijd. Maar het werkcentrum loopt het risico leeg te lopen door een gebrek aan materiaal.
- Vanaf **middelmatige WIP** nadert de output zijn maximum. Meer WIP levert nauwelijks extra output op.
- Bij **hoge WIP** blijft de output gelijk terwijl de doorlooptijd evenredig met de WIP blijft groeien. Extra WIP is pure wachttijd.

Daaruit volgt een kernregel voor planning: elk werkcentrum heeft een WIP-bereik waarin de output zeker is en de doorlooptijd nog kort is. Planning en vrijgave moeten ernaar streven de werkvloer binnen dat bereik te houden. Hopp en Spearman beschrijven een verwant concept, de **kritische WIP**: het WIP-niveau waarbij een ideale lijn net de maximale doorvoer bereikt tegen een minimale cyclustijd [10]. Nyhuis en Wiendahl brengen beide benaderingen uitdrukkelijk samen en koppelen de theorie van de operationele curven aan de wet van Little [8].

### 4.3 Variabiliteit en benutting: waarom 95% te veel kan zijn

Het derde wetmatigheid betreft de wachttijd voor een middel. John Kingman publiceerde in 1961 een benadering voor wachtrijen onder zware belasting [11]. Hopp en Spearman gebruiken die in *Factory Physics* als de **VUT-vergelijking** (variabiliteit × benutting × tijd) [10]:

> **Gemiddelde wachtrijtijd bij het middel ≈ V × U × T**
>
> V = (c_a² + c_e²) ÷ 2 (variabiliteit van aankomsten en van bewerkingstijden)
> U = u ÷ (1 − u) (benuttingsfactor, u = benutting tussen 0 en 1)
> T = t_e (gemiddelde effectieve bewerkingstijd)

c_a en c_e zijn de variatiecoëfficiënten (standaarddeviatie gedeeld door het gemiddelde) van de tussenankomsttijden en de bewerkingstijden. De benadering geldt voor één resource en is het nauwkeurigst bij een hoge bezettingsgraad.

**Uitgewerkt voorbeeld:** Een machine heeft een gemiddelde effectieve bewerkingstijd van 1 uur per order. Aankomsten en bewerkingstijden variëren matig; beide variatiecoëfficiënten zijn 1, dus V = (1 + 1) ÷ 2 = 1.

| Bezettingsgraad u | U = u ÷ (1 − u) | Gemiddelde wachttijd in de rij (u) | Verblijftijd bij de machine incl. bewerking (u) |
|---|---|---|---|
| 80% | 4,0 | 4,0 | 5,0 |
| 85% | 5,7 | 5,7 | 6,7 |
| 90% | 9,0 | 9,0 | 10,0 |
| 95% | 19,0 | 19,0 | 20,0 |

Een stijging van 80% naar 95% bezetting voegt 15 procentpunt belasting toe, maar vermenigvuldigt de wachttijd in de rij bijna vijfvoudig. Hieruit volgen drie lessen voor de planning:

1. **Overal volledige bezetting is geen verstandig doel.** Als elk werkcentrum op 95% wordt ingepland, ontstaan lange en sterk wisselende doorlooptijden.
2. **Variabiliteit verminderen werkt als extra capaciteit toevoegen.** Halveer V, bijvoorbeeld door stabielere omsteltijden, kleinere en gelijkmatiger lotgroottes of een geëgaliseerde vrijgave, en de wachttijd in de rij halveert bij dezelfde bezetting.
3. **Hoge bezetting is gewenst bij het knelpunt, maar alleen met een buffer.** Het knelpunt mag nooit zonder werk komen te staan. Dat lukt alleen als er vóór het knelpunt een bewust gedimensioneerde buffer ligt en de overige resources over reservecapaciteit beschikken (Sectie 7).

## 5. Wat een APS-systeem is en hoe het rekent

### 5.1 Definitie

**Advanced planning and scheduling (APS)** verwijst naar softwaresystemen en methoden die productieorders plannen en inplannen, waarbij tegelijkertijd rekening wordt gehouden met materiaalbeschikbaarheid en eindige capaciteit. In de supply chain-literatuur geldt een bredere definitie: Bernhard Fleischmann, Herbert Meyr en Michael Wagner plaatsen advanced planning in een planningsmatrix die loopt van langetermijnnetwerkontwerp tot kortetermijninplanning, over inkoop, productie, distributie en verkoop [13]. Op de productievloer betekent "APS" meestal het onderdeel dat verantwoordelijk is voor de gedetailleerde planning en volgordebepaling in de productie. Veel producten die in Amerikaanse softwarecatalogi onder "production scheduling software" worden vermeld, dekken deze laag, als zelfstandig product of als module van een ERP- of MES-systeem; andere in dezelfde lijsten zijn project- of capaciteitsplanners (Sectie 13.1).

Het woord **"advanced"** verwijst naar drie verschillen met klassieke MRP-logica:

- **Eindige-capaciteitsplanning:** Elke resource heeft een beperkte, van de kalender afhankelijke capaciteit. Een bewerking wordt alleen ingepland waar de resource vrij is. ISA-95 definieert eindige-capaciteitsplanning precies zo: geen ingeplande capaciteit mag de beschikbare capaciteit overschrijden [31].
- **Gelijktijdige planning:** Materiaal, capaciteit en data worden samen beschouwd. Ontbreekt materiaal, dan verschuift de bewerking; is de machine bezet, dan verschuift de materiaalbehoefte.
- **Optimalisatie:** In plaats van één antwoord te berekenen, zoekt het systeem onder vele haalbare oplossingen naar een goede, idealiter de beste volgens vastgelegde doelstellingen.

### 5.2 Constraint-gebaseerde planning: wat een APS modelleert

Een APS plant niet tegen "capaciteit" als één getal, maar tegen een netwerk van beperkingen. Dit heet **[constraint-based scheduling](https://www.m365.fm/entity/constraint-based-scheduling/)**. Typische beperkingen:

| Beperking | Voorbeeld | Waarom het ertoe doet |
|---|---|---|
| Capaciteit van middelen | Machine A: 2 ploegen, maandag tot en met vrijdag | basis van elk gedetailleerd schema |
| Alternatieve middelen | Onderdeel kan op machine A of B draaien, 20% langzamer op B | uitweg wanneer een middel overbelast is |
| Arbeid en vaardigheden | Slechts drie operators zijn gecertificeerd voor de testopstelling | arbeid is vaak de echte knelpunt |
| Gereedschap en opspanningen | Slechts één spuitgietmal per variant | twee machines kunnen niet tegelijk dezelfde variant draaien |
| Omsteltijden afhankelijk van volgorde | Van licht naar donker kleur: 10 min; van donker naar licht: 45 min | de volgorde bepaalt de beschikbare capaciteit |
| Bewerkingsvolgorde en overlapping | Montage start pas na het schilderen; transport in deellots toegestaan | doorlooptijd en synchronisatie |
| Minimale en maximale wachttijden | Lijm moet 24 u uitharden; onderdeel mag hooguit 4 u staan tussen wassen en coaten | technologische minimum- en maximumtijden |
| Materiaal en ingekochte onderdelen | Elektronica arriveert donderdag | materiaal bepaalt de vroegst mogelijke start |
| Zones en vloeroppervlak | Slechts twee romp-secties passen tegelijk in een montagezone | typisch bij montage van grote apparatuur en in de luchtvaart |
| Campagnes en batches | Oven draait alleen volle batches bij dezelfde temperatuur | groeperen versus leverdatums |

Hoe meer van deze beperkingen gelden, hoe minder betrouwbaar een schema met de hand of in Excel kan worden opgesteld, en hoe groter het voordeel van een APS.

### 5.3 Hoe groot het probleem is: combinatorische explosie

Zelfs op één machine groeit het aantal mogelijke volgordes met de faculteit van het aantal orders:

- 4 orders: 4! = 24 volgordes
- 10 orders: 10! = 3.628.800 volgordes
- 15 orders: 15! = 1.307.674.368.000 volgordes, ofwel ongeveer 1,3 biljoen

In een echte job shop met tientallen machines, honderden orders en meerstapsroutes is het proberen van alle opties hopeloos. In 1976 toonden Michael Garey, David Johnson en Ravi Sethi aan dat het minimaliseren van de makespan NP-compleet is in een flow shop met drie of meer machines en in een job shop met twee of meer machines [14]. Voor zulke problemen is geen methode bekend die voor willekeurig grote instanties binnen redelijke tijd het optimum garandeert. Daarom combineren APS-systemen regels, heuristieken en optimalisatie.

### 5.4 Methoden: van prioriteitsregels tot wiskundige optimalisatie

**Dispatching-regels** (prioriteitsregels) bepalen welke wachtende order als volgende draait. Ze zijn eenvoudig, snel en transparant:

| Regel | Logica | Sterkte | Zwakte |
|---|---|---|---|
| FIFO (first in, first out) | wie eerst komt, wordt eerst geholpen | eerlijk, eenvoudig, lage variantie | negeert leverdatums |
| EDD (earliest due date) | vroegste leverdatum eerst | op één machine minimaliseert het de maximale vertraging | negeert bewerkingstijden |
| SPT (shortest processing time) | kortste bewerking eerst | op één machine minimaliseert het de gemiddelde doorlooptijd | lange taken kunnen uitgehongerd raken |
| CR (critical ratio) | resterende tijd tot leverdatum ÷ resterend werk | houdt rekening met leverdatum en resterend werk | onstabiel bij frequent herplannen |
| Slack | tijd tot leverdatum minus resterende bewerkingstijd, kleinste eerst | goed voor orders met meerdere stappen | vereist betrouwbare resterende tijden |
| Omsteltijd-geoptimaliseerd | taken van dezelfde omsteltfamilie groeperen | bespaart omsteltijd op het knelpunt | kan leverdatums overschrijden |

Dat EDD de maximale vertraging minimaliseert en SPT de gemiddelde doorlooptijd op één machine minimaliseert, zijn klassieke resultaten uit de scheduling-theorie [29].

**Uitgewerkt voorbeeld: drie regels, vier orders, één machine**

Vier orders wachten op tijdstip 0 bij een machine, in volgorde van aankomst A, B, C, D. Tijden in uren:

| Order | Bewerkingstijd | Leverdatum |
|---|---|---|
| A | 4 | 6 |
| B | 2 | 4 |
| C | 6 | 14 |
| D | 3 | 9 |

| Regel | Volgorde | Voltooiingstijden | Vertraging | Te late orders | Totale vertraging | Gemiddelde doorlooptijd |
|---|---|---|---|---|---|---|
| FIFO | A, B, C, D | A 4, B 6, C 12, D 15 | B 2, D 6 | 2 | 8 u | (4+6+12+15)÷4 = 9,25 u |
| SPT | B, D, A, C | B 2, D 5, A 9, C 15 | A 3, C 1 | 2 | 4 u | (2+5+9+15)÷4 = 7,75 u |
| EDD | B, A, D, C | B 2, A 6, D 9, C 15 | C 1 | 1 | 1 u | (2+6+9+15)÷4 = 8,00 u |

Zelfde machine, zelfde werk, zelfde capaciteit: alleen de volgorde bepaalt of één of twee orders te laat zijn en of de totale vertraging 1 of 8 uur bedraagt. SPT geeft de kortste gemiddelde doorlooptijd, EDD de beste nakoming van leverdatums. Welke regel "juist" is, hangt af van het doel. In een werkplaats met meerdere stappen en omsteltijden die van de volgorde afhangen, volstaat geen enkele regel, en juist daar begint een APS zich terug te verdienen.

**Heuristieken** leveren snel goede maar niet gegarandeerd optimale oplossingen. Ze omvatten constructiemethoden die een planning order voor order opbouwen (bijvoorbeeld bottleneck-first: de bottleneck eerst beladen en daarna de overige middelen daarop afstemmen) en verbeteringsmethoden die een bestaande planning stap voor stap aanpassen.

**Metaheuristieken** zoals genetische algoritmen, simulated annealing of tabu search verkennen de oplossingsruimte systematisch en kunnen lokale optima ontvluchten. Ze komen veel voor in commerciële APS-systemen voor sequentie-optimalisatie.

**Wiskundige optimalisatie** formuleert het planningsprobleem als model met een doelfunctie en beperkingen, bijvoorbeeld als gemengd-geheeltallig lineair programma (MILP) of als constraint programming (CP)-model. Solvers vinden optimale oplossingen voor kleine en middelgrote problemen of geven ten minste een grens aan hoe ver de gevonden oplossing van het optimum af kan liggen. Grote, gedetailleerde planningsproblemen worden vaak opgesplitst, bijvoorbeeld per tijdvenster of per middelengroep.

**Kunstmatige intelligentie** speelt verschillende rollen in APS-systemen: het voorspellen van bewerkings- en omsteltijden op basis van werkelijke data, het voorspellen van verstoringen, het leren van planningsbeleid (bijvoorbeeld met reinforcement learning) en natuurlijketaalinteractie. Betrouwbare leveranciers gebruiken het om de invoer te verbeteren en het zoeken te versnellen, niet om optimalisatie te vervangen. Door AI ondersteunde planning is alleen zo goed als de bevestigingsdata van de productievloer waarvan het leert.

### 5.5 Doelstellingen en afwegingen

Een APS optimaliseert nooit "de planning"; het optimaliseert een gewogen combinatie van doelstellingen. Typische doelstellingen:

- levering op tijd (minimaliseren van vertraging of gewogen vertraging)
- korte doorlooptijden en lage WIP
- hoge benutting van de bottleneck
- lage omsteltijd
- weinig overwerk en een gelijkmatige werkbelasting voor medewerkers
- stabiliteit van de planning (weinig wijzigingen ten opzichte van de vorige planning)

Deze doelstellingen staan op gespannen voet met elkaar. De Duitse bedrijfskundige literatuur noemt de kern van dit conflict het "planningsdilemma" (*Dilemma der Ablaufplanung*): hoge benutting vereist wachtrijen, korte doorlooptijden vereisen onbenutte capaciteit. Sectie 4.3 laat zien waarom dat wiskundig zo is. Een van de belangrijkste taken bij de invoering van een APS is daarom het afstemmen van de weging van doelstellingen met verkoop, productie en logistiek.

### 5.6 Planningsrichting, ATP en CTP

De vraag "wat zijn de soorten productieplanning?" komt meestal neer op twee paren: eindige versus oneindige capaciteit (sectie 3.1) en de planningsrichting:

- **Voorwaartse planning (forward scheduling):** Bewerkingen worden ingepland vanaf de vroegst mogelijke starttijd. Het resultaat is de vroegst mogelijke opleverdatum.
- **Achterwaartse planning (backward scheduling):** Bewerkingen worden achterwaarts ingepland vanaf de leverdatum. Het resultaat is de laatst mogelijke starttijd, wat voorraad bespaart maar geen speling laat.
- **Bottleneckgebaseerde planning:** De bottleneck wordt eerst beladen; bewerkingen stroomopwaarts worden vervolgens achterwaarts en bewerkingen stroomafwaarts voorwaarts ingepland.

Twee functies zijn vooral waardevol voor verkoop:

- **Available to promise (ATP):** Welke hoeveelheid kan op welke datum worden toegezegd uit voorraad en geplande ontvangsten?
- **Capable to promise (CTP):** Welke datum is haalbaar voor een nieuwe order, rekening houdend met materiaal *en* capaciteit?

CTP is een typische APS-functie omdat het een nieuwe order proefgewijs inplant tegen de huidige belasting. Het maakt van een toezegging van een leverdatum een berekening in plaats van een schatting.

## 6. ERP vs. APS vs. MES

De drie systeemklassen concurreren niet met elkaar; ze vullen elkaar aan. ANSI/ISA-95 plaatst ERP op Niveau 4 (bedrijfsplanning en logistiek) en productiebeheer op Niveau 3; de activiteitsmodellen in Deel 3 behandelen het werkschema (in de editie van 2005 de "detailed production schedule" genoemd) en de uitvoering ervan [31]. De Duitse richtlijn VDI 5600 Deel 1 (oktober 2016), die in Europa veel wordt gebruikt, gaat verder en noemt "gedetailleerde planning en gedetailleerde besturing" expliciet als een van de tien taken van een Manufacturing Execution System, naast orderbeheer, apparatuurbeheer, materiaalbeheer, personeelsbeheer, gegevensverzameling, prestatieanalyse, kwaliteitsbeheer, informatiebeheer en energiebeheer [15]. In de praktijk wordt gedetailleerde planning ofwel in het MES geleverd, ofwel in een zelfstandige APS, ofwel in een APS-module van het ERP.

| Kenmerk | ERP (planningsmodule) | APS | MES |
|---|---|---|---|
| Hoofdtaak | hoeveelheden, waarden, materiaal, mijlpaaldata | haalbare data en volgordes binnen randvoorwaarden | uitvoering, bevestiging, realtime zichtbaarheid |
| Planningshorizon | weken tot maanden | uren tot weken, rollend | shift tot minuut |
| Capaciteitsmodel | in de basisvorm oneindig, downstream beladingsweergave | eindig, veel middelen tegelijk | meet de daadwerkelijk gebruikte capaciteit |
| Tijdsgranulariteit | dagen, weken | minuten tot uren | seconden tot minuten |
| Planningslogica | MRP, achterwaartse planning met vaste doorlooptijden | heuristieken, metaheuristieken, wiskundige optimalisatie | vrijgave- en dispatchregels, soms een eigen planner |
| Typische vraag | Wat moet wanneer klaar zijn, welk materiaal ontbreekt? | Welke bewerking loopt wanneer op welk middel? | Wat loopt er nu, hoe ver is elke order, waarom staat de machine stil? |
| Gegevens | stamgegevens, klant- en geplande orders | ERP-gegevens plus omsteltijdmatrices, kalenders, randvoorwaarden, bevestigingen | machine-, productie- en kwaliteitsgegevens |
| Reactie op verstoringen | volgende planningsrun, vaak 's nachts | herplannen binnen minuten, scenariovergelijking | vastleggen, alarm, herplanningstrigger |
| Gebruikers | materiaalplanning, inkoop, verkoop, financiën | productieplanning, productiebeheersing, supply chain | teamleiders, operators, onderhoud, kwaliteit |
| Beperking | plant op basis van aannames in plaats van de werkelijkheid | vereist goede stamgegevens en bevestigingen | plant vaak alleen op korte termijn en lokaal |

**Hoe de systemen samenwerken:** Het ERP geeft orders, stuklijsten, routings en voorraad door aan de APS. De APS plant op eindige capaciteit en levert realistische data en volgordes terug, die het ERP gebruikt voor leverdata en materiaalbehoefte. Het MES voert de volgorde op de werkvloer uit en rapporteert werkelijke tijden, hoeveelheden en verstoringen terug aan APS en ERP. Alleen deze gesloten lus maakt een planning betrouwbaar. Hoe het pad van ERP naar de werkvloer met een digital twin kan worden gesloten, wordt beschreven in de blogpost [From ERP to Shop Floor: Why Production Plans Need a Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/).

**Wanneer is ERP voldoende?** Als uw orders weinig bewerkingen hebben, de omsteltijden nauwelijks van de volgorde afhangen, een duidelijk zichtbaar knelpunt met een eenvoudige vrijgaveregel kan worden gestuurd en de capaciteit zelden krap is, is een goed onderhouden ERP-planning plus een planbord vaak voldoende. Hoe meer de beperkingen uit Sectie 5.2 gelden, hoe duidelijker de noodzaak van een APS.

## 7. Theory of constraints, drum-buffer-rope en buffermanagement

### 7.1 Theory of constraints

Eliyahu M. Goldratt introduceerde de **[theory of constraints](https://www.m365.fm/entity/theory-of-constraints/)** (TOC) in 1984 in de bedrijfsroman *The Goal*, mede geschreven met Jeff Cox [1]. De kernboodschap: elk systeem heeft minstens één beperking die de doorvoer begrenst. Een uur verloren op de bottleneck is een uur verloren voor het hele systeem. Een uur bespaard op een niet-bottleneck is waardeloos zolang het de bottleneck niet ontlast.

Goldratt formuleerde vijf focusstappen, bekend als het proces van voortdurende verbetering (POOGI) [3]:

1. **Identificeer** de beperking van het systeem.
2. **Benut** de beperking: geen stilstand, geen bewerking van afval, omsteltijden waar mogelijk buiten de bottleneck-tijd.
3. **Ondergeschik** alles andere aan de beperking: vrijgave, lotgroottes en volgordes van de overige middelen volgen de bottleneck.
4. **Verhoog** de beperking: pas dan extra shifts toevoegen, investeren of uitbesteden.
5. **Voorkom inertie:** als de beperking is verschoven, ga terug naar stap 1.

De volgorde is belangrijk. Veel bedrijven springen direct naar stap 4 en kopen een nieuwe machine, terwijl de bestaande bottleneck nog capaciteit verliest door stilstand, wachten op materiaal, slechte volgordes of onnodige omsteltijden.

### 7.2 De bottleneck vinden: bottleneckanalyse in de praktijk

De bottleneck is niet altijd de machine met de meeste storingen of het hoogste aanschafbedrag. Beproefde indicatoren:

- **Wachtrijen:** Orders stapelen zich permanent op voor de bottleneck, terwijl middelen erachter stilstaan.
- **Belasting versus capaciteit:** Vergelijk voor elk middel de geplande belasting (inclusief omsteltijden) met de beschikbare capaciteit over meerdere weken. Het middel met de hoogste verhouding is de kandidaat.
- **Doorvoerdiagrammen:** Waar de WIP hoog blijft en de uitvoercurve nog steeds niet steiler wordt, is er een capaciteitsbottleneck [8].
- **Vraag de experts, en controleer daarna:** Supervisors weten meestal waar het vastloopt. Verifieer met data, want "gevoelde" bottlenecks zijn vaak middelen met veel zichtbare storingen.

Let op **verschuivende bottlenecks**. Bij een wisselende productmix kan de bottleneck van week tot week tussen middelen verschuiven. Statische bottleneckbeheersing is dan niet genoeg, en wordt een APS die per middel vooruitkijkende belasting berekent voor de huidige orderportefeuille bijzonder waardevol. Bottlenecks zijn ook niet altijd machines: vaak zijn het geschoolde mensen, inspectiestations, gereedschappen of de planningsafdeling zelf.

### 7.3 Drum-buffer-rope

In *The Race* (1986) beschreven Goldratt en Robert E. Fox een beheersmethode die de vijf stappen vertaalt naar sturing op de werkvloer: **drum-buffer-rope** (DBR) [2]. De metafoor komt uit *The Goal*, waar een scoutgroep niet sneller kan lopen dan het langzaamste lid:

- **Drum:** De bottleneck bepaalt het tempo. Zijn planning is de enige gedetailleerde planning die moet worden gehaald.
- **Buffer:** Een **tijdbuffer** staat vóór de bottleneck (en vóór verzend- en assemblagepunten waar bottleneckonderdelen samenkomen met andere onderdelen). Hij beschermt de bottleneck tegen variabiliteit stroomopwaarts.
- **Rope:** Materiaal wordt de productie alleen ingestuurd zo snel als de bottleneck het kan verwerken. Het touw koppelt de vrijgave aan de bottleneckplanning, verschoven met de buffertijd.

**Uitgewerkt voorbeeld van DBR-vrijgave:** De bottleneck is een warmtebehandeling. Order 4711 is gepland om daar donderdag om 6:00 uur te starten. De tijdbuffer vóór de bottleneck is 3 werkdagen. Het materiaal voor order 4711 wordt dus op maandag om 6:00 uur vrijgegeven, niet eerder. Eerder vrijgeven verhoogt alleen de WIP en, volgens de wet van Little, de doorlooptijd, zonder de doorvoer te verhogen.

De tijdbuffer wordt in eerste instantie pragmatisch ingesteld. Een vaak genoemde startwaarde in TOC-praktijk is ongeveer de helft van de huidige doorlooptijd tot de bottleneck [unverified: vaak genoemde vuistregel zonder bronvermelding]. Daarna wordt hij bijgesteld via buffermanagement.

### 7.4 Buffermanagement

**[Buffermanagement](https://www.m365.fm/entity/buffer-management/)** is het terugkoppelingsmechanisme van DBR [4]. Voor elke vrijgegeven order houd je bij hoeveel van de tijdbuffer is verbruikt. Een verdeling in drie zones is gebruikelijk:

| Zone | Verbruikte buffer | Betekenis | Reactie |
|---|---|---|---|
| Groen | tot ongeveer een derde | order loopt op schema | geen actie |
| Geel | ongeveer één tot twee derde | order komt onder druk te staan | oorzaak zoeken, actie voorbereiden |
| Rood | meer dan twee derde | bottleneck kan zonder materiaal komen te zitten of de leverdatum is in gevaar | versnellen: order prioriteren, obstakel wegnemen |

De indeling in dritjes is een wijdverbreide conventie, geen natuurwet. Twee voordelen wegen het zwaarst:

1. **Dagelijkse prioriteiten:** In plaats van vele conflicterende urgentielijsten is er één regel: eerst rode orders, dan gele, dan groene.
2. **Systematische verbetering:** Registreer en analyseer de oorzaken van rode orders, en je krijgt een Pareto-lijst van verstoringsbronnen. Als er voortdurend veel orders rood zijn, is de buffer te klein of het proces te instabiel. Als bijna alle orders groen zijn, kan de buffer worden verkleind, wat WIP en doorlooptijd verlaagt.

De variant **vereenvoudigde DBR** (S-DBR) voor make-to-order-producenten doet zonder een gedetailleerd knelpuntschema en werkt met een verzendbuffer plus een belastingcontrole van het knelpunt bij orderacceptatie. Deze wordt beschreven in het *Theory of Constraints Handbook* naast klassieke DBR [4].

### 7.5 DBR en APS: tegenpolen of aanvullingen?

Beoefenaars van TOC stonden lange tijd sceptisch tegenover complexe planningssoftware, omdat een gedetailleerd schema voor elke resource snel veroudert zodra zich verstoringen voordoen. Moderne APS-systemen kunnen DBR-principes echter goed modelleren: planning op basis van het knelpunt, vrijgave met een tijdbuffer en een weergave van de bufferstatus zijn in veel systemen configureerbaar. Omgekeerd profiteert DBR van een APS wanneer het knelpunt verschuift, wanneer volgorden van omstellingen bij het knelpunt geoptimaliseerd moeten worden of wanneer er tegelijk veel beperkingen gelden. Het verstandige standpunt: DBR levert de besturingsfilosofie, het APS levert de rekenkracht.

## 8. Lean-bouwstenen in planning: takt, heijunka, lijnbalancering, pull

Lean-productie en APS worden vaak als tegenpolen gepresenteerd: pull en visuele besturing aan de ene kant, centrale planning door algoritmen aan de andere. In de praktijk vullen ze elkaar aan. Lean stabiliseert de stroom en vermindert variabiliteit; APS plant waar stroomsturing alleen niet voldoende is, bijvoorbeeld bij een grote productvariëteit, lange doorlooptijden of gedeelde resources. Voor de lean-kant in detail, zie de gids van m365.fm [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/).

### 8.1 Taktijd

**[Taktijd](https://www.m365.fm/entity/takt-time/)** is het interval waarin één eenheid moet worden afgerond om aan de klantvraag te voldoen:

> **Taktijd = beschikbare werktijd per periode ÷ klantvraag per periode**

**Uitgewerkt voorbeeld:** Een assemblagelijn draait twee ploegen van elk 7,5 uur netto werktijd (na geplande pauzes), dus 900 minuten per dag. De klantvraag is 450 eenheden per dag.

- Taktijd = 900 min ÷ 450 eenheden = **2,0 minuten per eenheid** (120 seconden)

De taktijd is een vraagsnelheid, geen prestatiemaatstaf. De werkelijke cyclustijd van elk station moet eronder liggen, wil de vraag worden gehaald.

### 8.2 Lijnbalancering

**[Lijnbalancering](https://www.m365.fm/entity/line-balancing/)** verdeelt de werkinhoud over de stations zodat elk station onder de taktijd blijft met zo weinig mogelijk wachttijd. Nils Boysen, Malte Fliedner en Armin Scholl hebben de vele varianten van het probleem systematisch geclassificeerd [22].

**Uitgewerkt voorbeeld (vervolg):** De totale werkinhoud per eenheid is 9,6 minuten.

- Theoretisch minimum aantal stations = 9,6 min ÷ 2,0 min = 4,8, naar boven afgerond op **5 stations**
- Vanwege de precedentiegraaf en onsplitsbare werkelementen zijn in de praktijk **6 stations** nodig.
- Balanceringsefficiëntie = 9,6 min ÷ (6 × 2,0 min) = 9,6 ÷ 12,0 = **80%**
- Balanceringsverlies = 100% − 80% = **20%** van de lijncapaciteit

Voor de planning betekent dat: met 6 stations haalt de lijn 450 eenheden per dag, maar wacht elk station gemiddeld 20% van de tijd. Als de vraag stijgt, moet de lijn opnieuw gebalanceerd worden of de werktijd verlengd.

### 8.3 Heijunka

**[Heijunka](https://www.m365.fm/entity/heijunka/)** (Japans voor egaliseren) is een kernprincipe van het Toyota Production System, zoals beschreven door Taiichi Ohno [20]. Het Lean Enterprise Institute definieert het als het egaliseren van het type en de hoeveelheid productie over een vaste periode [34]. In plaats van grote series van de ene variant na de andere te bouwen, wordt de mix gelijkmatig over de tijd verdeeld.

**Voorbeeld:** Een fabriek bouwt per week 200 eenheden van variant A, 100 van variant B en 100 van variant C, verdeeld over vijf dagen.

| Aanpak | Maandag | Dinsdag | Woensdag | Donderdag | Vrijdag |
|---|---|---|---|---|---|
| Batch na batch | 80 A | 80 A | 40 A, 40 B | 60 B, 20 C | 80 C |
| Geëgaliseerd (heijunka) | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C |

In het geplande niveau-schema daalt de piekbelasting van de stroomopwaartse processen, neemt de eindproductvoorraad per variant af en kunnen klanten van elke variant dagelijks worden geleverd. De prijs is vaker omstellen. Heijunka vereist daarom korte omsteltijden, en hier komen lean en APS samen: een APS kan binnen een dag de omsteltechnisch gunstigste volgorde berekenen voor een geniveleerde mix.

### 8.4 Kanban, pull en CONWIP

Een **[pull-systeem](https://www.m365.fm/entity/pull-system/)** beperkt het WIP door nieuw werk pas te starten wanneer een stroomafwaartse afnemer vraag signaleert. De bekendste vorm is **[kanban](https://www.m365.fm/entity/kanban/)**: kaarten of elektronische signalen tussen processen activeren de bijvulling, en het aantal kaarten begrenst de voorraad.

Kanban past bij onderdelen met regelmatige vraag en een beheersbaar aantal varianten. In jobshops en productie met lage volumes en veel varianten bereikt het zijn grenzen, omdat voor elke variant voorraad nodig zou zijn. Een alternatief is **CONWIP** (constant work in process), in 1990 voorgesteld door Mark Spearman, David Woodruff en Wallace Hopp als pull-alternatief voor kanban [21]. CONWIP begrenst niet de voorraad per onderdeel, maar het totale aantal orders in een lijn: een nieuwe order wordt pas vrijgegeven wanneer een andere order klaar is. De wet van Little wordt daarmee een besturingsregel. Een verwante methode van het IFA in Hannover is de **belastingsgerichte orderfreigave** (*belastungsorientierte Auftragsfreigabe*), die orders alleen vrijgeeft zolang de werkbelasting voor een werkplek onder een belastinggrens blijft; Lödding beschrijft haar samen met CONWIP en knelpuntbesturing als orderfreigavemethoden [12]. In Engelstalig onderzoek wordt deze groep methoden meestal besproken onder de noemer workload control.

**Wat dit betekent voor de planning:** Kanban en CONWIP bepalen *wanneer* er wordt vrijgegeven en begrenzen het WIP. Een APS bepaalt *wat* in welke volgorde wordt gemaakt en of de data haalbaar zijn. Veel fabrieken gebruiken beide: standaardonderdelen lopen in een kanban-lus, klantspecifieke orders worden in de APS ingepland en onder een WIP-limiet vrijgegeven.

## 9. Partijgrootte: EOQ, uitgewerkt voorbeeld en beperkingen

### 9.1 Het basisprobleem

Elke partij brengt vaste kosten met zich mee voor omstelling, orderverwerking en opstart, ongeacht de hoeveelheid. Grote partijen verdelen deze kosten over veel stuks, maar verhogen de voorraad en het vastgelegde kapitaal. Kleine partijen verlagen de voorraad, maar betekenen vaker omstellen. De **[partijgrootte](https://www.m365.fm/entity/batch-size/)** is daarom een klassieke afweging.

### 9.2 De klassieke formule: Harris (EOQ) en Andler

Ford Whitman Harris publiceerde de wortelformule voor de economische partijgrootte in 1913 in *Factory, The Magazine of Management*. Vandaag staat ze bekend als de economische bestelhoeveelheid (economic order quantity, EOQ); Donald Erlenkotter herleidde het auteurschap in 1990 [17]. Wanneer de formule wordt gebruikt voor productiepartijen in plaats van inkooporders, spreken Amerikaanse teksten vaak van de economische productie- of economische partijgrootte. In het Duitstalige gebied staat zij bekend als de **Andler-formule**, naar Kurt Andlers boek uit 1929 [18]:

> **Q* = √(2 × D × S ÷ H)**
>
> Q* = optimale partijgrootte (stuks)
> D = vraag per periode (stuks per jaar)
> S = vaste kosten per partij, d.w.z. omstel- en bestelkosten ($ per partij)
> H = voorraadkosten per stuk en periode ($ per stuk per jaar), vaak berekend als eenheidskosten × kostenpercentage voor kapitaal

De formule minimaliseert de som van omstelkosten (D ÷ Q × S) en voorraadkosten (Q ÷ 2 × H). In het optimum zijn beide kostencomponenten gelijk.

### 9.3 Uitgewerkt voorbeeld

Een gedraaid (draai)onderdeel heeft een jaarlijkse vraag van 12.000 stuks. Eén omstelling kost $300, inclusief machine- en arbeidstijd. De eenheidskosten bedragen $40, het kostenpercentage voor kapitaal 20% per jaar. (Het Duitse origineel gebruikt dezelfde cijfers in euro's; de getallen zijn illustratief, niet omgerekend.)

- H = $40 × 0,20 = $8 per stuk per jaar
- Q* = √(2 × 12.000 × 300 ÷ 8) = √(7.200.000 ÷ 8) = √900.000 ≈ **949 stuks**
- Partijen per jaar = 12.000 ÷ 949 ≈ 12,6
- Omstelkosten per jaar = 12.000 ÷ 949 × $300 ≈ $3.793
- Voorraadkosten per jaar = 949 ÷ 2 × $8 = $3.796
- **Totale kosten ≈ $7.589** per jaar

Hoe gevoelig zijn de kosten voor afwijkingen van Q*?

| Partijgrootte | Omstelkosten ($/jr) | Voorraadkosten ($/jr) | Totale kosten ($/jr) | Afwijking van optimum |
|---|---|---|---|---|
| 500 | 7.200 | 2.000 | 9.200 | +21,2% |
| 600 | 6.000 | 2.400 | 8.400 | +10,7% |
| 949 | 3.793 | 3.796 | 7.589 | 0% |
| 1.200 | 3.000 | 4.800 | 7.800 | +2,8% |
| 2.000 | 1.800 | 8.000 | 9.800 | +29,1% |

De kostencurve is vlak rond het optimum: een lotgrootte die ongeveer een kwart groter is, kost minder dan 3% meer. In de praktijk kun je lotgroottes afronden op praktische waarden, zoals containerhoeveelheden of dagelijkse vraag, zonder een merkbare kostenstraf.

**Insteltijd is de grotere hefboom:** Als insteltijdreductie de instelkosten halveert van $300 naar $150, daalt de optimale lotgrootte naar √(2 × 12.000 × 150 ÷ 8) ≈ **671 eenheden**. De totale kosten dalen tot ongeveer $5.367 per jaar, of ruim 29% minder, omdat de totale kosten in het optimum evenredig zijn met de vierkantswortel van S. De gemiddelde cyclusvoorraad daalt eveneens met ongeveer 29%. Methoden voor insteltijdreductie, zoals SMED (single-minute exchange of die), betalen zich dus dubbel terug. Meer op de entiteitspagina [Setup Time](https://www.m365.fm/entity/setup-time/).

### 9.4 Grenzen van de EOQ-formule

De formule is een bruikbaar startpunt, maar de aannames ervan worden op de werkvloer vrijwel nooit gehaald:

- **Constante, bekende vraag:** De werkelijke vraag fluctueert en is onzeker.
- **Onbeperkte capaciteit:** De formule negeert dat instellingen capaciteit kosten op de bottleneck. Bij een bottleneck is een uur instellen een uur verloren doorvoer; bij een niet-bottleneck kost het bijna niets. TOC concludeert dat lots bij de bottleneck doorgaans groter moeten zijn en bij niet-bottlenecks kleiner.
- **Enkel product, geen interacties:** Meerdere producten delen machines; volgorde-afhankelijke instellingen worden niet gemodelleerd.
- **Onmiddellijke productie:** In de basisvorm is het hele lot in één keer beschikbaar. Voor een eindige productiesnelheid bestaat een uitgebreide formule (economische productiehoeveelheid) waarin de voorraadkosten worden gewogen met de factor (1 − vraagsnelheid ÷ productiesnelheid).
- **Geen effect op doorlooptijd:** Grote lots verlengen de doorlooptijd van elke volgende order op dezelfde machine en vergroten de variabiliteit. Dat effect ontbreekt in de kostenberekening.
- **Moeilijk vast te stellen kostentarieven:** Instelkosten en het voorraadkostenpercentage zijn vaak geschatte waarden met veel speelruimte.

Voor dynamische vraag bestaan methoden zoals het Wagner-Whitin-algoritme en heuristieken zoals part-period balancing en Silver-Meal. Een APS gaat een stap verder: die bepaalt lotgroottes en volgorde tegelijk, met inachtneming van capaciteit, omstellingsmatrices en leverdata.

## 10. Veiligheidsvoorraad: formule en uitgewerkt voorbeeld

### 10.1 Waarvoor veiligheidsvoorraad dient

**[Veiligheidsvoorraad](https://www.m365.fm/entity/safety-stock/)** beschermt tegen twee onzekerheden: vraagvariatie gedurende de aanvoerdoorlooptijd en variatie in de doorlooptijd zelf. Het is geen oplossing voor slechte planning, maar een bewust betaalde verzekering tegen toeval.

### 10.2 Formule voor variabele vraag

Als de dagelijkse vraag ongeveer normaal verdeeld is en de aanvoerdoorlooptijd constant is [19]:

> **SS = z × σ_D × √L**
>
> SS = veiligheidsvoorraad (eenheden)
> z = veiligheidsfactor uit de standaardnormaalverdeling voor het gewenste serviceniveau
> σ_D = standaarddeviatie van de dagelijkse vraag (eenheden)
> L = aanvoerdoorlooptijd (dagen)

Het hier gebruikte serviceniveau is het **cyclusserviceniveau** (kans op geen tekort gedurende een aanvulcyclus, in Duitse teksten het α-serviceniveau genoemd). Het is niet hetzelfde als de **fill rate** (aandeel van de vraaghoeveelheid dat direct uit voorraad wordt geleverd, het β-serviceniveau). Ze door elkaar halen leidt tot systematisch verkeerd gedimensioneerde voorraad.

**Uitgewerkt voorbeeld:** Een ingekocht onderdeel wordt gemiddeld 100 eenheden per dag verbruikt; de standaarddeviatie is 30 eenheden per dag. De aanvoerdoorlooptijd is 9 werkdagen.

| Cyclusserviceniveau | z | Berekening | Veiligheidsvoorraad |
|---|---|---|---|
| 90% | 1,282 | 1,282 × 30 × √9 = 1,282 × 30 × 3 | ≈ 115 eenheden |
| 95% | 1,645 | 1,645 × 30 × 3 | ≈ 148 eenheden |
| 99% | 2,326 | 2,326 × 30 × 3 | ≈ 209 eenheden |

Van 95% naar 99% kost meer dan 40% extra veiligheidsvoorraad. Hoge serviceniveaus worden onevenredig duur.

### 10.3 Formule voor variabele vraag en variabele doorlooptijd

Als ook de doorlooptijd varieert, wordt de formule uitgebreid [19]:

> **SS = z × √(L × σ_D² + d² × σ_L²)**
>
> d = gemiddelde dagelijkse vraag, σ_L = standaarddeviatie van de doorlooptijd (dagen)

**Uitgewerkt voorbeeld (vervolg):** De leverancier levert gemiddeld na 9 dagen, maar met een standaarddeviatie van 2 dagen.

- L × σ_D² = 9 × 30² = 8.100
- d² × σ_L² = 100² × 2² = 40.000
- √(8.100 + 40.000) = √48.100 ≈ 219,3
- SS (95%) = 1,645 × 219,3 ≈ **361 eenheden**

Veiligheidsvoorraad stijgt van 148 naar 361 eenheden, bijna tweeënhalf keer zoveel, puur door de onbetrouwbare doorlooptijd. Variatie in de doorlooptijd verklaart hier ongeveer 83% van de variantie. Het verbeteren van de levertijdbetrouwbaarheid van de leverancier verlaagt de voorraad vaak meer dan welke verbetering van de vraagvoorspelling ook.

### 10.4 Grenzen van de formule

- De normale verdeling past slecht bij intermitterende vraag (veel perioden zonder verbruik). Andere verdelingen of simulatie zijn daar geschikter.
- De formule gaat uit van onafhankelijke vraag. Voor artikelen met afhankelijke vraag uit stuklijsten is veiligheidsvoorraad meestal het verkeerde instrument; veiligheidsdoorlooptijd of buffers op gerichte punten werken beter.
- Veiligheidsvoorraad die voortdurend wordt aangesproken, is geen veiligheidsvoorraad maar een planningsfout. Controleer regelmatig hoe vaak en waarom die wordt aangesproken.

## 11. KPI's voor productieplanning

Zonder KPI's kunt u de waarde van een APS niet aantonen en de planning niet verbeteren. Definieer elke KPI ondubbelzinnig vóór de invoering en meet een nulmeting. Een afzonderlijke m365.fm-gids over [productie-KPI's](https://www.m365.fm/en/learn/manufacturing-kpis/) behandelt de bredere set.

| KPI | Formule | Wat het u vertelt | Valkuilen |
|---|---|---|---|
| On time in full (OTIF) | regels op tijd én compleet geleverd ÷ alle regels met leverdatum | klantperspectief | leg de referentie vast: gevraagde of bevestigde datum; stel een tolerantievenster vast |
| Levertijdbetrouwbaarheid (OTD, on-time delivery) | regels op tijd geleverd ÷ alle regels met leverdatum | als OTIF, maar zonder het criterium voor de hoeveelheid | deelleveringen vertekenen het beeld |
| Doorlooptijd (productiecyclustijd) | gereed minus vrijgave (per order), gemiddelde en spreiding | snelheid van de stroom | het gemiddelde is niet genoeg; de spreiding bepaalt de betrouwbaarheid van de verzenddatum |
| Flowfactor | gemiddelde doorlooptijd ÷ gemiddelde bewerkingstijd | hoeveel langer een order wacht dan dat eraan wordt gewerkt [8] | gebruik dezelfde tijdseenheid (werkuren of kalenderuren) |
| Work in process (WIP) | aantal of werkinhoud van vrijgegeven, niet-afgeronde orders | driver van de doorlooptijd volgens de wet van Little | meet in uren werkinhoud, niet alleen in aantallen |
| Benutting | bezette tijd ÷ beschikbare tijd | gebruik van capaciteit | hoge benutting op niet-knelpunten is geen succes |
| Knelpuntbenutting | productieve tijd op het knelpunt ÷ beschikbare tijd op het knelpunt | de belangrijkste benuttings-KPI binnen TOC | rapporteer omstel- en stilstandtijd op het knelpunt afzonderlijk |
| Omsteltijdratio | omsteltijd ÷ (omsteltijd + bewerkingstijd) | capaciteit die verloren gaat aan omstellingen | vooral kritiek op het knelpunt |
| Overall equipment effectiveness (OEE) | beschikbaarheid × prestatie × kwaliteit | effectiviteit van een machine | past bij machines, niet bij de beoordeling van een planning |
| Planningsnaleving (schedule adherence) | bewerkingen gestart of afgerond volgens planning ÷ alle geplande bewerkingen | hoe realistisch en stabiel is de planning? | definieer een tolerantie, bijvoorbeeld ± 1 shift |
| Planningsstabiliteit (schedule stability) | gewijzigde bewerkingen in de bevroren horizon ÷ alle bewerkingen | nervositeit van de planning | te veel wijzigingen wijzen op slechte data of een ontbrekende bevroren zone |
| Bufferstatus | aandeel orders in rood, geel en groen | vroegtijdige waarschuwing bij bufferbeheer | alleen zinvol met gedefinieerde buffers |

**Uitgewerkt voorbeeld, leveringsprestatie:** In oktober stonden 480 orderregels op hun bevestigde leverdatum. 432 werden op tijd verzonden; 410 daarvan werden ook compleet verzonden.

- Levertijdbetrouwbaarheid = 432 ÷ 480 = **90,0%**
- OTIF = 410 ÷ 480 ≈ **85,4%**

**Uitgewerkt voorbeeld, omsteltijdratio en flowfactor:** In één week besteedde het knelpunt 18 uur aan omstellingen en 62 uur aan bewerking. Omsteltijdratio = 18 ÷ (18 + 62) = **22,5%**. Een order met 6 uur bewerkingstijd bracht 120 werkuren (15 dagen van 8 uur) in de werkplaats door. Flowfactor = 120 ÷ 6 = **20**: de order stond twintig keer zo lang in de werkplaats als dat er daadwerkelijk aan werd gewerkt.

**KPI-set voor een APS-invoering:** Meet minimaal OTIF, doorlooptijd (gemiddelde en spreiding), WIP en knelpuntbenutting vóór de go-live en daarna maandelijks. Deze vier zijn via de wet van Little en de bedrijfscurven met elkaar verbonden en laten samen zien of een betere planning ook tot een betere stroom heeft geleid.

## 12. Digitale tweeling en simulatie

**Simulatie** modelleert een productiesysteem en laat het over tijd draaien. De Duitse richtlijn VDI 3633 Deel 1 behandelt de grondbeginselen van het simuleren van logistieke systemen, materiaalstromen en productiesystemen [16]. Simulatie geeft antwoorden die een statische capaciteitsberekening niet kan geven, omdat ze rekening houdt met toeval, verstoringen en onderlinge beïnvloeding: Hoe werkt een machinestoring door op de verzenddatums van de komende twee weken? Wat levert een derde ploeg bij het knelpunt op? Hoe veranderen de doorlooptijden bij een nieuwe productmix?

Een **digitale tweeling van de productie** gaat een stap verder: het is een model dat voortdurend wordt gesynchroniseerd met gegevens uit ERP, MES en machines. Voor productieplanning heeft het drie functies:

1. **Planningsbasis:** De APS plant op een model dat in realtime de middelen, beperkingen en de actuele status weergeeft.
2. **Scenarioanalyse:** Vóór een beslissing, zoals het accepteren van een spoedorder of een investering, worden alternatieven gesimuleerd en op KPI's vergeleken.
3. **Leercyclus:** Afwijkingen tussen plan en werkelijke stroom worden teruggekoppeld en verbeteren de standaardtijden en beperkingen.

Maak onderscheid tussen een simulatiemodel dat eenmalig voor een studie is gebouwd en een continu onderhouden tweeling die in de operatie wordt gebruikt. De tweede levert meer waarde op, maar vereist stabiele gegevensintegratie en duidelijke verantwoordelijkheid voor het onderhoud van het model. Hoe ERP-gegevens, tweeling en shopfloor met elkaar verbonden kunnen worden, wordt getoond in de post [From ERP to Shop Floor: Why Production Plans Need a Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/). De m365.fm-gids [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) gaat dieper in; de cloud- en datakant wordt behandeld in [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/).

**Eerst waardestroomanalyse:** Breng voordat u een tweeling of APS modelleert de waardestroom in kaart. Die laat zien waar voorraad ligt, waar het knelpunt vermoedelijk zit en welke informatiestromen de planning vandaag aansturen. Zie de gids [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

## 13. Productieplanningssoftware kiezen: criteria en checklist

### 13.1 Vóór de shortlist: doelen en uitgangssituatie verhelderen

Of u zoekt naar "production scheduling software," "APS software," "finite capacity scheduling software" of "capacity planning software": in de maakindustrie telt of een systeem capaciteit eindig en met uw echte beperkingen plant. Veel tools die voor deze termen hoog scoren zijn projectmanagement- of teamcapaciteitstools. Ze zijn nuttig voor projecten, maar modelleren doorgaans geen routings, volgordeafhankelijke omsteltijden of materiaalbeschikbaarheid. De lijsten met de "best production scheduling software" op google.com mengen beide categorieën, dus toets elke kandidaat aan de beperkingentabel in paragraaf 5.2.

Beantwoord vóór u met leveranciers praat drie vragen:

1. **Welk probleem moet worden opgelost?** Bijvoorbeeld: OTIF verhogen van 78% naar meer dan 90%, de doorlooptijd halveren, de planningsinspanning verminderen, betrouwbare verzenddatums geven bij orderinvoer.
2. **Welke beperkingen doen er echt toe?** Loop de tabel in paragraaf 5.2 door en markeer wat in uw fabriek geldt.
3. **Hoe goed zijn uw gegevens?** Controleer vóór de selectie routings, standaardtijden en de kwaliteit van de boekingen (paragraaf 14).

### 13.2 Selectiecriteria

| Criterium | Vraag die te stellen is | Gewicht (voorbeeld) |
|---|---|---|
| Modellering van beperkingen | Modelleert het systeem alle relevante beperkingen zonder maatwerkcode? | hoog |
| Kwaliteit van de planning | Hoe goed zijn de planningen voor *jouw* data, gemeten aan jouw doelstellingen? | hoog |
| Rekentijd | Hoe lang duurt een volledige herplanning bij realistisch datavolume? | gemiddeld tot hoog |
| Interactief plannen | Kunnen planners orders slepen en neerzetten, en controleert het systeem direct de gevolgen? | hoog |
| Verklaarbaarheid | Kunnen planners zien waarom een order op zijn plek is ingepland? | hoog |
| Scenario's en simulatie | Kunnen varianten parallel worden doorgerekend en op KPI's worden vergeleken? | gemiddeld |
| ERP-integratie | Zijn er standaardconnectoren naar jouw ERP, in welke richting, hoe vaak? | hoog |
| MES- en terugmeldingsintegratie | Hoe en hoe snel bereiken de werkelijke gegevens de APS? | hoog |
| Gebruiksvriendelijkheid | Accepteren planners en leidinggevenden de interface? | hoog |
| Schaalbaarheid | Meerdere fabrieken, meer resources, meer orders? | gemiddeld |
| Beheer en beveiliging | Cloud of on-premises, hostinglocatie, certificeringen (bijvoorbeeld ISO/IEC 27001, SOC 2), rollen- en rechtenmodel, aansluiting op jouw beveiligingskader (bijvoorbeeld NIST CSF 2.0 [35]); voor Amerikaanse defensieleveranciers de CMMC-eisen die gelden voor de betrokken gegevens [36] | gemiddeld |
| Leverancier en partners | Branche-ervaring, referenties met vergelijkbare productie, ondersteuning, roadmap | gemiddeld |
| Totale eigendomskosten | Licenties, implementatie, datasanering, training, beheer over 5 jaar | gemiddeld |

**Wat met de prijs?** De prijzen in deze categorie lopen uiteen van abonnementen per gebruiker voor eenvoudige tools tot offertes op maat voor APS-oplossingen met meerdere fabrieken, en de meeste APS-leveranciers publiceren geen catalogusprijzen. De softwaredirectories die op de hoofdzoekterm scoren, laten hetzelfde beeld zien: veel vermeldingen melden "prijs op aanvraag", en minstens één ranglijst toont nog prijsgegevens die in 2019 zijn verzameld. Vergelijk de totale eigendomskosten over vijf jaar, inclusief de interne inspanning voor datasanering en integratie, in plaats van alleen de licentieprijs.

### 13.3 Checklist voor de selectie

Gebruik de lijst als checklist voor leveranciersgesprekken en proof-of-concept-tests:

- [ ] Doelen en KPI's met nulmetingen zijn gedocumenteerd.
- [ ] Relevante beperkingen zijn geprioriteerd (moet, zou moeten, fijn om te hebben).
- [ ] Een representatieve testdataset met echte orders, routings en omsteltijden is klaar.
- [ ] Elke leverancier plant **dezelfde** testdataset; resultaten worden op dezelfde KPI's vergeleken.
- [ ] Een verstoringsscenario is getest (machinestoring, spoedorder, te laat materiaal).
- [ ] De rekentijd van een volledige herplanning is gemeten.
- [ ] Je eigen planners hebben met het systeem gewerkt, niet alleen een demo bekeken.
- [ ] De ERP-interface is gespecificeerd (objecten, richting, frequentie, foutafhandeling).
- [ ] Het terugmeldpad vanaf de productievloer is gedefinieerd (MES, terminal, mobiele app).
- [ ] Het systeem verklaart zijn planningsbeslissingen op een manier die planners kunnen volgen.
- [ ] Rollen en rechten kunnen worden gemodelleerd (wie mag plannen, vrijgeven, bevriezen?).
- [ ] Minstens één referentie met een vergelijkbaar productietype is persoonlijk geïnterviewd.
- [ ] De totale kosten over vijf jaar zijn berekend, inclusief interne inspanning.
- [ ] Gegevensbescherming, hosting en informatiebeveiliging zijn met IT afgestemd (en voor defensiewerk met degene die verantwoordelijk is voor CMMC-naleving).
- [ ] Een exitoptie (gegevensexport, contractduur) is uitgeklaard.

**Tip:** De meest veelzeggende test is een **pilot met je eigen data**. Demo's van leveranciers met schone voorbeelddata zeggen weinig over hoe een systeem omgaat met jouw onvolledige routings en uitzonderingen.

## 14. Gegevenseisen en kwaliteit van stamgegevens

Een APS rekent precies, ook met verkeerde gegevens. Een planning op basis van standaardtijden die 30% afwijken, is precies fout. Datakwaliteit is daarom de meest voorkomende reden waarom APS-projecten langer duren dan gepland.

| Gegevensobject | Minimale eis | Typische hiaten | Hoe te controleren |
|---|---|---|---|
| Routings | volledige bewerkingsvolgorde, correcte werkplekgroep | ontbrekende bewerkingen, verouderde middelen | steekproeven vergelijken met de werkelijke productiestroom |
| Standaardtijden (bewerking) | afwijking van werkelijke tijden binnen een gedefinieerde tolerantieband | standaarden uit kostprijsberekening in plaats van meting | gepland vs. werkelijk uit bevestigingen |
| Omsteltijden | volgordeafhankelijk waar relevant (omstelmatrix) | één vaste omsteltijd per bewerking | omsteltijdlogboeken analyseren |
| Middelen en kalenders | ploegenpatronen, pauzes, onderhoudsvensters, fabrieksstilstanden | kalenders niet bijgehouden in het ERP | vergelijken met het ploegenrooster |
| Alternatieve middelen | toegestane alternatieven met prestatiefactor | alleen bekend bij voorlieden | interviews, daarna onderhouden in het systeem |
| Personeel en vaardigheden | vaardighedenmatrix, aanwezigheidsplanning | niet digitaal beschikbaar | een vaardighedenmatrix opstellen |
| Gereedschap en opspanmiddelen | aantal, toewijzing aan bewerkingen | niet gemodelleerd als middel | afstemmen met de gereedschapslijst |
| Voorraad en inkoopdata | correcte voorraad, betrouwbare leverdata | boekingsachterstanden, onbevestigde leverdata | voorraadtelling-afwijkingen, leveranciers op tijd leveren |
| Bevestigingen | tijdig, per bewerking, met hoeveelheid en tijd | batchgewijs bevestigen aan het eind van de ploeg of helemaal niet | bevestigingspercentage en vertraging meten |
| Orders en prioriteiten | duidelijke leverdatums, klantprioriteit | data naar voren gehaald "voor de zekerheid" | leverdatumhistorie controleren |

**Vuistregel voor de volgorde:** Begin bij de bottleneck. Als routings, standaardtijden en omsteltijden bij de bottleneckmiddelen kloppen, is de planning al veel beter dan voorheen, zelfs als niet-bottlenecks nog onnauwkeurigheden bevatten. Werk daarna langs de materiaalstroom.

**Bevestigingen zijn de sleutel:** Zonder tijdige bevestigingen op de werkvloer weet de APS niet waar een order zich bevindt en plant het op basis van een toestand die niet meer bestaat. Even belangrijk: alleen bevestigingen maken de vergelijking van gepland met werkelijk mogelijk, waarmee standaardtijden na verloop van tijd verbeterd kunnen worden.

## 15. APS-implementatieroadmap

De onderstaande roadmap beschrijft bewezen fasen. De doorlooptijden zijn grove richtwaarden voor een fabriek met één locatie en gemiddelde omvang en hangen sterk af van datakwaliteit, integratie-inspanning en projectcapaciteit [unverified: geen robuuste studie over de duur van implementaties gevonden].

| Fase | Inhoud | Resultaat | Richtwaarde |
|---|---|---|---|
| 1. Beoordeling | doelen, KPI's met nulmetingen, waardestroom en knelpunten, beperkingen, datakwaliteit | eisenspecificatie, bevindingen over data, businesscase | 4 tot 8 weken |
| 2. Selectie | lange lijst van leveranciers, testdataset, proof of concept, referentiegesprekken | systeembesluit, contract | 6 tot 12 weken |
| 3. Opschoning van data | routings, standaard- en insteltijden, kalenders, vaardigheden; beginnend bij het knelpunt | plande stamgegevens | parallel aan fasen 2 en 4, vaak het langste blok |
| 4. Modellering en integratie | resourcemodel, beperkingen, gewichten van doelstellingen, interfaces met ERP en MES | werkend planningsmodel | 8 tot 16 weken |
| 5. Pilot | één gebied, bij voorkeur inclusief het knelpunt; parallelle run met het oude proces | bewijs van plankwaliteit, acceptatie door gebruikers | 6 tot 12 weken |
| 6. Uitrol | verdere gebieden, uitfaseren van schaduwplanning, vrijgaveregels, bevroren zone | productief gebruik | hangt af van de omvang |
| 7. Continue verbetering | plan versus werkelijkheid, standaardtijden onderhouden, oorzaken van buffers analyseren, KPI-review | een planningssysteem dat leert | doorlopend |

**Succesfactoren in alle fasen:**

- **Betrek planners vanaf dag één.** Een APS die planners niet vertrouwen, wordt omzeild, en het Excel-blad blijft bestaan.
- **Leg planningsregels vast vóór de software.** Wie mag prioriteiten wijzigen? Hoe lang is de bevroren zone? Welke regel bepaalt de vrijgave?
- **Begin klein, leer snel.** Een pilot bij het knelpunt laat binnen weken zien of data en model standhouden.
- **Meet het succes.** Zonder nulmetingen is de waarde niet te bewijzen en verzandt het projectgesprek in meningen.
- **Betrek de productievloer.** Een planning helpt alleen als die de vloer bereikt en taken en bevestigingen terugstromen. Voor de dagelijkse routines die dat mogelijk maken, zie de gids [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

## 16. Veelgemaakte fouten en hoe je ze vermijdt

| Fout | Gevolg | Beter |
|---|---|---|
| APS als vervanging van procesverbetering | instabiele processen worden alleen preciezer ingepland | eerst setups, storingen en vrijgave stabiliseren, parallel inplannen |
| Alle beperkingen tegelijk modelleren | project loopt vertraging op, model wordt onleesbaar | begin met de beperkingen die op het knelpunt werken |
| Standaardtijden uit de kostprijsberekening overnemen | planningen zijn systematisch te optimistisch of te pessimistisch | gebruik werkelijke tijden uit bevestigingen en werk ze regelmatig bij |
| Alle resources op maximale benutting inplannen | lange wachtrijen, grillige doorlooptijden | belast het knelpunt volledig, laat speling bij niet-knelpunten |
| Geen bevroren horizon | voortdurend herplannen, onrust op de vloer | definieer een bevroren zone, bijvoorbeeld de komende 1 tot 3 ploegen |
| Vrijgave zonder WIP-plafond | doorlooptijdsyndroom, voorraadopbouw | vrijgave op basis van het knelpunt of onder een WIP-plafond |
| Algemene verhoging van geplande doorlooptijden bij achterstand | eerdere vrijgaven verhogen WIP en te laat leveren | verhelp de oorzaken bij het knelpunt, beheers de vrijgave |
| Doelstellingen niet afgestemd | verkoop, productie en logistiek beoordelen de planning verschillend | stem gewichten van doelstellingen samen af en leg ze vast |
| Planners niet betrokken | systeem wordt omzeild, schaduwplanning blijft | betrek planners bij selectie, modellering en pilot |
| Bevestigingen pas aan het eind van de ploeg | APS plant op basis van een verouderde status | bevestig tijdig per bewerking |
| Succes niet gemeten | waarde blijft een bewering | verzamel nulmetingen vóór de go-live |
| Black-box-optimalisatie | planners begrijpen of vertrouwen de planning niet | kies een systeem met verklaarbare planningsbeslissingen |

**Snelle winst zonder nieuwe software:** Als je morgen wilt beginnen, zijn er vijf stappen die geen investering vragen:

1. Vergelijk voor de laatste acht weken per resource belasting en capaciteit en benoem de bottleneck.
2. Tel de WIP en gebruik de Wet van Little om de gemiddelde doorlooptijd te berekenen. Wijkt die sterk af van de geplande doorlooptijden in de ERP, dan weet u waarom de data niet kloppen.
3. Stel een vrijgaveregel vast: nieuwe orders gaan de productie pas in als de wachtrij voor de bottleneck onder een vastgestelde grens ligt.
4. Prioriteer bij de bottleneck op basis van leverdatum en setupfamilie, niet op basis van wie het hardst roept.
5. Controleer de standaard- en setuptijden bij de bottleneck tegen de werkelijke tijden en corrigeer de grootste afwijkingen.

## 17. Bewijs: wat studies en gebruikers rapporteren

**Theory of constraints in de literatuur:** Victoria Mabin en Steven Balderstone hebben meer dan 80 succesvolle TOC-toepassingen geanalyseerd, met kwantitatieve resultaten die in de literatuur zijn gerapporteerd [5]. Volgens de samenvatting van Roberto Panizzolo rapporteerden deze cases gemiddelde verbeteringen van 70% in doorlooptijd van order tot levering, 65% in productiecyclustijd, 49% in voorraad, 63% in doorvoer of omzet en 44% in leveringstrouw [6]. Lees deze getallen met zorg: er zijn alleen gepubliceerde succesverhalen geanalyseerd en in de literatuur zijn geen mislukkingen gevonden [5]. Dit is een positieve selectie, geen verwacht gemiddelde van enige implementatie. De richting van de resultaten is wel consistent met de Wet van Little en de operationele curves: minder WIP met een beschermde bottleneck betekent kortere doorlooptijden.

**Gebruikersrapportages van APS-leveranciers:** Leveranciers publiceren veel praktijkvoorbeelden. De Duitse MES-leverancier MPDV rapporteert bijvoorbeeld voor zijn klant VACOM, die ongeveer 1.200 orders plant met elk tot 20 bewerkingen, ongeveer 50% tijdwinst in de planning [30]. Zulke cijfers zijn leveranciersclaims zonder vermelde meetmethode. Ze laten zien welke effecten mogelijk zijn, maar vervangen geen pilot met uw eigen data. Hetzelfde geldt voor de casecijfers op de pagina's van Amerikaanse leveranciers die scoren op "production scheduling software."

**Luchtvaart als extreem geval:** Luchtvaartproductie combineert lange doorlooptijden, montagezones met beperkte vloeroppervlakte, eisen aan vaardigheden en certificering en volledige traceerbaarheid. Planning moet daar niet alleen de data beschermen, maar ook de registraties. De eisen voor doorlooptijd en traceerbaarheid worden beschreven in de post [Production Planning for Aerospace Suppliers: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/). Een volledige gids: [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/).

**Wat generaliseert:** Over studies en rapporten heen komen drie patronen steeds terug. Ten eerste zit het grootste deel van het voordeel niet in het algoritme maar in transparantie over capaciteit en de bottleneck. Ten tweede werken WIP-plafonds en gecontroleerde vrijgave snel en goedkoop. Ten derde hangt het of resultaten blijven staan af van de vraag of bevestigingen op de werkvloer en de vergelijking van gepland met werkelijk blijven werken.

## 18. Constraintgebaseerde planning met iFAKT Polaris

> **Opmerking: De auteur werkt bij iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), gevestigd in Stuttgart, Duitsland, ontwikkelt de softwarefamilie [iFAKT Polaris](https://www.m365.fm/entity/polaris/). Volgens de website van het bedrijf koppelt Polaris ERP-gegevens aan een digitale tweeling van de productie. De genoemde functies zijn constraintgebaseerde planning (resources, vaardigheden, shifts, buffers), what-if-simulaties voor verstoringen en productmixwijzigingen, en een KPI-cockpit met doorlooptijd, WIP, bezetting en op-tijd-prestatie [28]. De website noemt als sectoren lucht- en ruimtevaart, automotive, machinebouw en automatisering, en energie en infrastructuur [28]. Twee modules zijn relevant voor de onderwerpen van deze gids:

**[Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/)** maakt volgens de productpagina van de leverancier op basis van ERP-gegevens, beschikbaarheid van middelen en operationele constraints een geoptimaliseerd en uitvoerbaar productieschema [26]. Genoemde mogelijkheden:

- automatische planning van machines, medewerkers en gereedschappen, rekening houdend met shifts, zones, vaardigheden en capaciteiten
- detectie van knelpunten, prioritering van orders en zichtbaarheid van te late orders en leveringsrisico's
- impactanalyse en herplanning na verstoringen, ook op basis van feedback uit de productie
- een module voor lotgroottenoptimalisatie die lotgroottes per variant en machine bepaalt, een op omsteltijd geoptimaliseerde volgorde, en voorraadniveaus die opslagkosten afwegen tegen leverbereidheid
- ondersteuning voor operationele kortetermijnplanning en langetermijncapaciteitsprognoses

**[Polaris Operator](https://www.m365.fm/entity/polaris-operator/)** neemt volgens de productpagina van de leverancier de geoptimaliseerde schema's over en levert ze als tijdgebonden taken aan medewerkers en ploegleiders op de werkvloer [27]. Genoemd worden een individuele takenweergave per medewerker, zichtbaarheid van het kritieke pad voor ploegleiders, werkinstructies in de taken, de mogelijkheid taken te pauzeren, te blokkeren of te markeren met gestructureerde feedback, en een live WIP-overzicht voor planners. Feedback over voortgang, vertragingen en verstoringen stroomt terug naar de planning [27].

De beschreven functies adresseren daarmee twee punten die deze gids als kritiek aanmerkt: plannen tegen reële constraints (paragraaf 5.2) en de gesloten lus van plan, uitvoering en feedback (paragrafen 6 en 14). iFAKT GmbH toont op zijn website ISO 9001- en ISO/IEC 27001-certificeringen [27]. De productpagina's geven geen klantaantallen of gekwantificeerde resultaten met een openbaar gemaakte methode [26][27]. Alle hierboven genoemde mogelijkheden zijn claims van de leverancier.

**Perspectief:** Polaris is een van vele oplossingen op de markt. Beoordeel het als elk ander systeem, met de checklist uit paragraaf 13.3 en een pilot met uw eigen gegevens. Een aparte gids, [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/), is in voorbereiding.

## 19. Verklarende woordenlijst

| Term | Uitleg |
|---|---|
| APS (advanced planning and scheduling) | software en methoden voor het plannen van volgorde en tijd op basis van eindige capaciteit en materiaalbeschikbaarheid, met optimalisatie |
| ATP (available to promise) | hoeveelheid die uit voorraad en geplande ontvangsten toegezegd kan worden |
| Buffer management | sturing op basis van het verbruik van tijdbuffers in zones (groen, geel, rood) |
| Changeover matrix | tabel met volgorde-afhankelijke omsteltijden tussen varianten |
| CONWIP | pull-sturing met een constant totaal aantal orders in een lijn |
| CTP (capable to promise) | haalbare leverdatum rekening houdend met materiaal en capaciteit |
| CRP (capacity requirements planning) | capaciteitsplanningsstap in MRP II; toont de belasting maar lost overbelasting niet op |
| Cycle time (Little's Law) | tijd die een order in het systeem doorbrengt van vrijgave tot gereedmelding; zie [Lead Time](https://www.m365.fm/entity/lead-time/) |
| Detailed scheduling | inplannen van afzonderlijke bewerkingen op middelen met volgorde en tijd (Duits: *Feinplanung*) |
| Drum-buffer-rope (DBR) | TOC-sturing: de bottleneck bepaalt het tempo, een tijdbuffer beschermt deze, vrijgave is eraan gekoppeld |
| EOQ (economic order quantity) | wortelformule voor de economische orderhoeveelheid van Harris (1913); in Duitse teksten de Andler-formule genoemd |
| Finite capacity scheduling | plannen waarbij geen geplande capaciteit de beschikbare capaciteit overschrijdt (ISA-95) |
| Flow factor | verhouding tussen doorlooptijd en bewerkingstijd |
| Frozen zone | bevroren planningshorizon waarin niet meer herplanning plaatsvindt |
| Heijunka | egaliseren van volume en mix in de tijd |
| Lead time syndrome | vicieuze cirkel van langere geplande doorlooptijden, eerdere vrijgave, meer WIP en nog langere doorlooptijden |
| Little's Law | cycle time = WIP ÷ doorvoer |
| Lot size | hoeveelheid die zonder onderbreking door een omstelling wordt geproduceerd; zie [Batch Size](https://www.m365.fm/entity/batch-size/) |
| MES (manufacturing execution system) | systeem voor uitvoering, dataverzameling en sturing op de werkvloer (ISA-95 niveau 3; VDI 5600) |
| MPS (master production schedule) | productieprogramma voor eindproducten |
| MRP (material requirements planning) | materiaalplanning via stuklijstexplosie met geplande doorlooptijden |
| MRP II (manufacturing resource planning) | uitbreiding van MRP met hoofdplanning, capaciteits- en financiële planning |
| OTIF (on time in full) | aandeel regels dat op tijd en compleet wordt geleverd |
| PPC | productieplanning en -besturing (Duits: PPS) |
| Setup time | tijd om een middel tussen twee orders om te stellen; zie [Setup Time](https://www.m365.fm/entity/setup-time/) |
| Safety stock | voorraad ter bescherming tegen schommelingen in vraag en doorlooptijd |
| Takt time | beschikbare tijd ÷ klantvraag |
| Bottleneck (constraint) | middel dat de doorvoer van het hele systeem beperkt |
| TOC (theory of constraints) | managementbenadering die het systeem afstemt op de beperking |
| WIP (work in process) | vrijgegeven, nog niet voltooide orders op de werkvloer |

## 20. FAQ: productieplanningssoftware en APS

### Wat is productieplanningssoftware?

Productieplanningssoftware bepaalt welke bewerking op welke machine of werkplek wordt uitgevoerd, in welke volgorde en op welk tijdstip. Goede tools plannen op basis van eindige capaciteit en echte beperkingen, zoals ploegen, vaardigheden, gereedschap en omsteltijden die afhankelijk zijn van de volgorde. Veel tools die onder die naam worden verkocht, zijn project- of capaciteitsplanners; controleer voor de maakindustrie of ze routings, omsteltijden en materiaalbeschikbaarheid modelleren.

### Wat is een APS-systeem?

Een APS (advanced planning and scheduling) systeem is planningssoftware die productieorders plant op basis van de eindige capaciteit van machines, mensen en gereedschap en op basis van materiaalbeschikbaarheid. Het maakt uitvoerbare volgordes en data met behulp van heuristieken en wiskundige optimalisatie.

### Wat is het verschil tussen APS en MRP?

MRP berekent welk materiaal wanneer nodig is door stuklijsten uit te werken en vaste geplande doorlooptijden terug te rekenen. In de basisvorm gaat het uit van onbeperkte capaciteit. APS plant bewerkingen en materiaal tegelijk op basis van eindige capaciteit, zodat de data haalbaar zijn. MRP beantwoordt de vraag "wat hebben we nodig"; APS beantwoordt de vraag "wat kunnen we echt bouwen, en wanneer."

### Wat is het verschil tussen APS en ERP? Vervangt APS het ERP?

Nee, APS vervangt het ERP niet. Het ERP is het systeem van vastlegging voor orders, materiaal, voorraad en financiën. De planningslogica ervan (MRP) gaat in de basisvorm uit van onbeperkte capaciteit en vaste doorlooptijden. Een APS voegt planning op basis van echte capaciteit en beperkingen toe en geeft realistische data terug aan het ERP.

### Wat is het verschil tussen APS en MES?

Een APS plant wat wanneer op welke resource moet draaien. Een MES stuurt de uitvoering in realtime aan en legt deze vast. ISA-95 plaatst zowel het werkschema als de uitvoering ervan in het beheer van de productieprocessen (niveau 3) [31], en de Duitse VDI 5600 noemt gedetailleerde planning een MES-taak [15]. In de praktijk gebeurt de planning ofwel door een MES-module, ofwel door een zelfstandige APS die gegevens uitwisselt met het MES.

### Wat is het verschil tussen productieplanning en productiescheduling?

Planning werkt met geaggregeerde hoeveelheden, weekse of maandelijkse periodes en groepen van werkplekken om het programma en de materiaalbehoefte vast te stellen. Scheduling wijst individuele bewerkingen toe aan resources met een volgorde en starttijd, meestal in uren of ploegen.

### Welke soorten productiescheduling bestaan er?

De nuttigste onderscheidingen zijn scheduling met eindige versus oneindige capaciteit en de plandirectie: forward scheduling (vroegst mogelijke start, vroegst mogelijke einde), backward scheduling (vanaf de leverdatum, laatst mogelijke start) en knelpuntgestuurde scheduling (eerst het knelpunt beladen, daarna stroomopwaarts achterwaarts en stroomafwaarts voorwaarts inplannen).

### Is Excel voldoende voor productiescheduling?

Soms wel. Bij weinig orders, omsteltijden die nauwelijks van de volgorde afhangen en een stabiel knelpunt werkt vaak een spreadsheet of planbord, aangevuld met gedisciplineerde knelpuntbeheersing (DBR). Software wordt noodzakelijk wanneer het aantal beperkingen en herplanningen de mogelijkheden van handmatige planning overschrijdt; de beperkingentabel in paragraaf 5.2 helpt u dat beoordelen.

### Wanneer loont een APS?

Meestal wanneer meerdere van de volgende punten gelden: veel bewerkingen per order, omsteltijden die afhankelijk zijn van de volgorde, wisselende of meerdere knelpunten, schaarse gekwalificeerde arbeid, frequente spoedorders, veel herplanningswerk en leveringstrouw die tegenvalt ondanks een hoge voorraad. Er bestaat geen algemene drempel op basis van bedrijfsgrootte.

### Is APS geschikt voor kleine en middelgrote producenten?

Ja. Planningscomplexiteit is belangrijker dan bedrijfsgrootte. Voor kleine en middelgrote producenten zijn systemen met standaard ERP-koppelingen, configuratie zonder maatwerkcode en een stapsgewijze start bij het knelpunt een goede keuze.

### Wat kost productieplanningssoftware?

Er is geen betrouwbare openbare prijsbenchmark. Eenvoudige tools worden verkocht als abonnement per gebruiker; de meeste APS-leveranciers offreren per fabriek, resources en scope. Reken op de totale eigendomskosten over vijf jaar, inclusief data-opschoning, integratie, training en intern werk, en vraag elke leverancier om een offerte op basis van dezelfde scope.

### Hoe vind ik het knelpunt in mijn fabriek?

Vergelijk per resource de geplande belasting, inclusief omsteltijden, met de beschikbare capaciteit over meerdere weken, houd bij waar permanent wachtrijen ontstaan en controleer welke resource stroomafwaartse gebieden onbenut laat. Knelpunten kunnen ook mensen, inspectiestations of gereedschappen zijn, en ze verschuiven wanneer de productmix verandert.

### Wat is drum-buffer-rope in eenvoudige bewoordingen?

Het knelpunt is de trom die het tempo bepaalt. Een tijdbuffer vóór het knelpunt beschermt het tegen verstoringen. Het touw koppelt de vrijgave van materiaal aan het planningsschema van het knelpunt, zodat er nooit meer werk de werkvloer in gaat dan het knelpunt kan verwerken [2].

### Hoe kan ik de doorlooptijd in de productie verkorten?

De snelste hefboom is meestal het begrenzen van WIP, omdat de doorlooptijd volgens de wet van Little bij constante doorvoer evenredig met de WIP daalt [9]. Andere hefbomen zijn kleinere loten met korte omsteltijden, minder variabiliteit en het bewaken van de bezettingsgraad van niet-knelpuntresources onder het punt waarop wachtrijen exploderen.

### Hoe verbeter ik de levertijdbetrouwbaarheid?

Plan op eindige capaciteit zodat toegezegde data haalbaar zijn, stuur de vrijgave aan het knelpunt, prioriteer het dagelijkse werk op basis van de bufferstatus en analyseer systematisch de oorzaken van te late orders. Meet de leverprestatie consistent, bijvoorbeeld als OTIF ten opzichte van de bevestigde datum.

### Hoe bereken je de economische bestelhoeveelheid?

De klassieke EOQ-formule is Q* = √(2 × jaarlijkse vraag × opstart- of bestelkosten per lot ÷ opslagkosten per eenheid per jaar). Bij een vraag van 12.000 eenheden, $300 opstartkosten en $8 opslagkosten komt het resultaat op ongeveer 949 eenheden. De formule houdt geen rekening met capaciteit en volgorde en is alleen een startwaarde.

### Hoe bereken je veiligheidsvoorraad?

Bij variabele vraag en constante doorlooptijd: SS = z × σ_D × √L. Met een standaarddeviatie van 30 eenheden per dag, een doorlooptijd van 9 dagen en een cyclische servicegraad van 95% (z = 1,645) komt de uitkomst op ongeveer 148 eenheden. Als ook de doorlooptijd varieert, stijgt de waarde sterk.

### Kan AI de productieplanning overnemen?

AI verbetert voorspellingen van bewerkings- en omsteltijden, herkent verstoringspatronen en versnelt het zoeken naar goede schema's. Het vervangt geen schone stamdata of overeenstemming over doelstellingen en regels. Zonder betrouwbare bevestigingsdata leert AI ook van slechte data.

### Hoe lang duurt een APS-implementatie?

Dat hangt vooral af van datakwaliteit, integratie-inspanning en scope. Een pilot in een knelpuntgebied kan binnen enkele maanden operationeel zijn; een volledige uitrol over meerdere gebieden duurt langer. Er bestaat geen robuuste, onafhankelijke studie over gebruikelijke implementatietijden.

### Vervangt APS de productieplanners?

Nee. Een APS neemt de berekening over, niet de beslissingen. Planners stellen prioriteiten, onderhouden regels en data, behandelen uitzonderingen en beslissen tussen scenario's. Bij succesvolle uitrollen besteden planners minder tijd aan het opnieuw opbouwen van schema's en meer tijd aan de oorzaken van vertragingen.

## 21. Conclusie

Productieplanningen falen zelden omdat planners onvoldoende hun best doen. Ze falen omdat de planningslogica uitgaat van onbeperkte capaciteit en vaste doorlooptijden. De fysica van de fabriek is helder: de doorlooptijd volgt uit WIP en doorvoer, wachtrijen exploderen bij een hoge bezettingsgraad, en het knelpunt bepaalt wat de fabriek kan leveren.

Een APS pakt precies dat aan. Het plant op basis van eindige capaciteit en reële beperkingen, maakt leverdata berekenbaar en laat de gevolgen van verstoringen en spoedorders zien voordat ze zich voordoen. Het levert alleen resultaat samen met drie zaken die geen software kan leveren: een duidelijke focus op het knelpunt, gecontroleerde orderrelease, en stamgegevens en bevestigingen die overeenkomen met de werkelijkheid.

Begin dus in een eenvoudige volgorde: identificeer het knelpunt, meet en begrens de WIP, maak de gegevens van het knelpunt schoon, en test daarna productieplanningssoftware met APS-mogelijkheden in een pilot met je eigen gegevens. Zo wordt het Excel-schaduwrooster niet vervangen door een nieuwe black box, maar door een planning waarop productie, verkoop en klanten kunnen vertrouwen.

## Verder lezen op m365.fm

**Berichten**

- [Voorbij MRP: waarom Enterprise Resource Planning faalt bij eindige productieplanning](https://www.m365.fm/community/u/mirko-p/blog/beyond-mrp-enterprise-resource-planning-finite-scheduling/)
- [Van ERP tot de productievloer: waarom productieplannen een digitale tweeling nodig hebben](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Productieplanning voor luchtvaartleveranciers: doorlooptijd en traceerbaarheid](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)

**Entiteitspagina's**

[Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Buffer Management](https://www.m365.fm/entity/buffer-management/) · [Constraint-based Scheduling](https://www.m365.fm/entity/constraint-based-scheduling/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [Line Balancing](https://www.m365.fm/entity/line-balancing/) · [Batch Size](https://www.m365.fm/entity/batch-size/) · [Safety Stock](https://www.m365.fm/entity/safety-stock/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Setup Time](https://www.m365.fm/entity/setup-time/) · [Takt Time](https://www.m365.fm/entity/takt-time/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Pull System](https://www.m365.fm/entity/pull-system/) · [Polaris](https://www.m365.fm/entity/polaris/) · [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [iFAKT](https://www.m365.fm/entity/ifakt/)

**Gerelateerde gidsen**

- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is de host van m365.fm en werkt bij iFAKT GmbH. Op m365.fm schrijft hij over productieplanning en -scheduling, lean manufacturing en de digitale transformatie van de productie. Bij [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), de ontwikkelaar van [iFAKT Polaris](https://www.m365.fm/entity/polaris/), werkt hij aan de manier waarop op beperkingen gebaseerde planning, digitale tweelingen en feedback van de werkvloer samenkomen, zodat planningen op de werkvloer standhouden.

**Let op: De auteur werkt bij iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026.

1. Goldratt, Eliyahu M.; Cox, Jeff: The Goal. A Process of Ongoing Improvement. North River Press 1984 (3rd rev. ed. 2004, ISBN 978-0-88427-178-9).
2. Goldratt, Eliyahu M.; Fox, Robert E.: The Race. North River Press 1986, 179 pp., ISBN 0-88427-062-9. Reference: https://buresund.nu/books/the-race
3. Theory of Constraints Institute: Five Focusing Steps. https://www.tocinstitute.org/five-focusing-steps.html
4. Cox, James F. III; Schleier, John G. (eds.): Theory of Constraints Handbook. McGraw-Hill, New York 2010, ISBN 978-0-07-166554-4; ch. 8: Srikanth, Mokshagundam L.: DBR, Buffer Management, and VATI Flow Classification; ch. 9: From DBR to Simplified-DBR for Make-to-Order. Chapter reference: https://www.toc-goldratt.com/en/product/dbr-buffer-management-and-vati-flow-classification-chapter-8-of-the-theory-of-constraints-handbook
5. Mabin, Victoria J.; Balderstone, Steven J.: The performance of the theory of constraints methodology: Analysis and discussion of successful TOC applications. International Journal of Operations & Production Management 23 (2003) 6, pp. 568–595. DOI: 10.1108/01443570310476636
6. Panizzolo, Roberto: Theory of Constraints (TOC) Production and Manufacturing Performance. International Journal of Industrial Engineering and Management 7 (2016) 1, pp. 15–23. https://www.research.unipd.it/retrieve/e14fb26b-f0bc-3de1-e053-1705fe0ac030/ijiem_vol7_no1_3.pdf
7. Schuh, Günther; Stich, Volker (eds.): Produktionsplanung und -steuerung 1. Grundlagen der PPS [Production planning and control 1: Fundamentals]. 4th rev. ed., Springer Vieweg, Berlin/Heidelberg 2012, ISBN 978-3-642-25422-2. (German)
8. Nyhuis, Peter; Wiendahl, Hans-Peter: Logistische Kennlinien. Grundlagen, Werkzeuge und Anwendungen. 3rd ed., Springer Vieweg, Berlin/Heidelberg 2012, ISBN 978-3-540-92838-6. DOI: 10.1007/978-3-540-92839-3 (German). English edition: Nyhuis, Peter; Wiendahl, Hans-Peter: Fundamentals of Production Logistics. Theory, Tools and Applications. Springer, Berlin/Heidelberg 2009 (published October 2008), ISBN 978-3-540-34210-6, DOI: 10.1007/978-3-540-34211-3
9. Little, John D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383
10. Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337
11. Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57 (1961) 4, pp. 902–904. DOI: 10.1017/S0305004100036094
12. Lödding, Hermann: Verfahren der Fertigungssteuerung. Grundlagen, Beschreibung, Konfiguration [Production control methods]. 3rd ed., Springer Vieweg, Berlin/Heidelberg 2016, ISBN 978-3-662-48458-6 (print), 978-3-662-48459-3 (e-book). (German)
13. Fleischmann, Bernhard; Meyr, Herbert; Wagner, Michael: Advanced Planning. In: Stadtler, Hartmut; Kilger, Christoph; Meyr, Herbert (eds.): Supply Chain Management and Advanced Planning. Concepts, Models, Software, and Case Studies. 5th ed., Springer, Berlin/Heidelberg 2015, pp. 71–95. DOI: 10.1007/978-3-642-55309-7_4 (book: DOI 10.1007/978-3-642-55309-7)
14. Garey, M. R.; Johnson, D. S.; Sethi, Ravi: The Complexity of Flowshop and Jobshop Scheduling. Mathematics of Operations Research 1 (1976) 2, pp. 117–129. DOI: 10.1287/moor.1.2.117
15. VDI 5600 Part 1: Manufacturing Execution Systems (MES). Edition October 2016. https://www.din.de/en/wdc-beuth:din21:251310997 ; table of contents: https://www.vdi.de/fileadmin/pages/vdi_de/redakteure/richtlinien/inhaltsverzeichnisse/2436698.pdf (German guideline of the Association of German Engineers)
16. VDI 3633 Part 1: Simulation of systems in materials handling, logistics and production – Fundamentals. Edition December 2014. https://din.de/de/wdc-beuth:din21:149034959 (German guideline)
17. Harris, Ford W.: How Many Parts to Make at Once. Factory, The Magazine of Management 10 (1913) 2, pp. 135–136; and Erlenkotter, Donald: Ford Whitman Harris and the Economic Order Quantity Model. Operations Research 38 (1990) 6, pp. 937–946. DOI: 10.1287/opre.38.6.937
18. Andler, Kurt: Rationalisierung der Fabrikation und optimale Losgröße. Oldenbourg, Munich/Berlin 1929 [unverified: bibliographic details and first name not verified online, original not consulted; formula and assumptions per University of Duisburg-Essen, exercise "Statische Losgröße – Andler-Modell": https://www.uni-due.de/imperia/md/content/tul/de_ss2013_lm01_uebung_statische_losgroesse_andler_modell.pdf].
19. Silver, Edward A.; Pyke, David F.; Thomas, Douglas J.: Inventory and Production Management in Supply Chains. 4th ed., CRC Press, Boca Raton 2017, ISBN 978-1-4665-5861-8.
20. Ohno, Taiichi: Toyota Production System. Beyond Large-Scale Production. Productivity Press, Cambridge (MA) 1988, ISBN 978-0-915299-14-0.
21. Spearman, Mark L.; Woodruff, David L.; Hopp, Wallace J.: CONWIP: a pull alternative to kanban. International Journal of Production Research 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761
22. Boysen, Nils; Fliedner, Malte; Scholl, Armin: A classification of assembly line balancing problems. European Journal of Operational Research 183 (2007) 2, pp. 674–693. Reference: https://econpapers.repec.org/RePEc:eee:ejores:v:183:y:2007:i:2:p:674-693
23. Thürer, Matthias; Fernandes, Nuno O.; Haeussler, Stefan; Stevenson, Mark: Dynamic planned lead times in production planning and control systems: does the lead time syndrome matter? International Journal of Production Research 61 (2023) 4, pp. 1268–1282. DOI: 10.1080/00207543.2022.2034193
24. Orlicky, Joseph: Material Requirements Planning. The New Way of Life in Production and Inventory Management. McGraw-Hill, New York 1975.
25. Logistik Heute: SCM-Studie: Mehr als ein Drittel der deutschen Unternehmen nutzt Excel als Rückgrat für die Lieferkettenplanung (IDC for Kinaxis), April 18, 2024. https://logistik-heute.de/news/scm-studie-mehr-als-ein-drittel-der-deutschen-unternehmen-nutzt-excel-als-rueckgrat-fuer-die-lieferkettenplanung-104313.html (German)
26. iFAKT GmbH: Polaris Optimizer. https://www.ifakt.de/en/solutions/optimizer
27. iFAKT GmbH: Polaris Operator. https://www.ifakt.de/en/solutions/operator
28. iFAKT GmbH: Home page. https://www.ifakt.de/
29. Pinedo, Michael L.: Scheduling. Theory, Algorithms, and Systems. 5th ed., Springer, Cham 2016. DOI: 10.1007/978-3-319-26580-3
30. MPDV Mikrolab GmbH: APS-Systeme einfach erklärt (Smart Factory glossary, with VACOM customer example). https://www.mpdv.com/industrie-4-0/smart-factory-glossar/advanced-planning-and-scheduling-system-aps (German)
31. ANSI/ISA-95.00.03-2013: Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management. International Society of Automation. Preview incl. clause 3.1 definition of finite capacity scheduling: https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf
32. Kinaxis Inc.: New Research Finds 83% of Supply Chains Can't Respond to Disruptions in 24 Hours (IDC research commissioned by Kinaxis, 1,800 respondents in nine countries incl. USA and Canada, fielded December 2023), press release, April 16, 2024. https://investors.kinaxis.com/news-releases/news-release-details/2024/New-Research-Finds-83-of-Supply-Chains-Cant-Respond-to-Disruptions-in-24-Hours
33. ASCM (Association for Supply Chain Management): APICS Certified in Planning and Inventory Management (CPIM), 2026 certification brochure. https://www.ascm.org/globalassets/ascm_website_assets/docs/credentials/2026-certification_brochures_cpim.pdf
34. Lean Enterprise Institute: Lean Lexicon, "Heijunka." https://www.lean.org/lexicon-terms/heijunka/
35. National Institute of Standards and Technology (NIST): The NIST Cybersecurity Framework (CSF) 2.0. NIST CSWP 29, February 26, 2024. https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final
36. U.S. Department of Defense: Defense Federal Acquisition Regulation Supplement: Assessing Contractor Implementation of Cybersecurity Requirements (DFARS Case 2019-D041), final rule. Federal Register 90 (2025) 173, September 10, 2025, effective November 10, 2025. https://www.govinfo.gov/content/pkg/FR-2025-09-10/html/2025-17359.htm
