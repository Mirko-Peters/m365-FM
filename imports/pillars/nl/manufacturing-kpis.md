# SEO metadata

| Field | Value |
|---|---|
| Meta title | Productiekpi's: Formules, Voorbeelden & Power BI-gids |
| Meta description | Productiekpi's met formules en uitgewerkte voorbeelden: takttijd, cyclustijd, doorlooptijd, OEE, uitval, FPY, OTIF, MTBF, TRIR en een Power BI-dashboard. |
| Slug | `manufacturing-kpis` |

# Productiekpi's: De complete gids voor productiemetrics, formules, uitgewerkte voorbeelden en Power BI-dashboards

> **Kort antwoord:** Productie-KPI's zijn maatstaven die de snelheid, kwaliteit, levertrouwbaarheid, kosten en veiligheid van een productiebedrijf in cijfers uitdrukken. De belangrijkste zijn taktijd, cyclustijd, doorlooptijd in de productie, OEE, uitvalpercentage, first pass yield, op tijd en compleet leveren (OTIF), voorraaddagen, MTBF/MTTR, kosten per eenheid en een veiligheidsratio zoals TRIR. Ze werken alleen wanneer elke KPI één afgesproken definitie heeft, betrouwbare data en een vaste overlegroutine waarin afwijkingen leiden tot acties.

> **Belangrijkste punten**
> - **Definieer voordat je een dashboard bouwt:** ISO 22400-2:2014 beschrijft 34 KPI's voor het beheer van productieprocessen, elk met formule, eenheid en timing [1][38]. ISA-95 plaatst deze KPI's op Niveau 3, tussen de regellaag en het ERP [40]. In Duitsland voegt de richtlijn VDMA 66412-1 definities voor MES-KPI's toe [4].
> - **Taktijd is geen machinetijd:** takt is beschikbare tijd gedeeld door de klantvraag [9]. Cyclustijd wordt gemeten; doorlooptijd omvat ook alle wachtrij- en wachttijd [10].
> - **OEE = Beschikbaarheid × Prestatie × Kwaliteit.** Het populaire "wereldklasse"-doel van 85 % gaat terug op Nakajima, maar is geen universele benchmark [6][8].
> - **De wet van Little** koppelt voorraad, doorvoer en doorlooptijd: als je de WIP niet verlaagt, verkort je de doorlooptijd op termijn niet [13].
> - **Veiligheid komt eerst en heeft een Amerikaanse standaardformule:** de incidentie-ratio van OSHA is gevallen × 200.000 ÷ gewerkte uren [42]. In 2025 registreerde de Amerikaanse particuliere industrie 2,3 totale registreerbare gevallen per 100 fulltime-equivalente werknemers [43].
> - **Minder is meer (aanbeveling):** vijf tot acht KPI's per niveau, gesorteerd op Veiligheid, Kwaliteit, Kosten, Levering en Mensen (SQCDP), zijn voldoende om een bedrijf te sturen.
> - **KPI's die als doel worden gebruikt, verliezen hun waarde** wanneer ze worden beloond in plaats van begrepen (wet van Goodhart) [23][24].
> - **Power BI** werkt goed voor KPI-dashboards als het datamodel een sterrenschema is en OEE wordt berekend uit opgetelde tijden, niet uit gemiddelden van percentages [27].

## Inhoudsopgave

1. Wat zijn productie-KPI's?
2. Spiekbriefje productie-KPI's: alle formules in één overzicht
3. Het uitgewerkte voorbeeld "Lijn 3": invoergegevens
4. Tijdmaatstaven: taktijd, cyclustijd, doorlooptijd, verwerkingstijd, flowfactor
5. Taktijd vs. cyclustijd vs. doorlooptijd
6. Omsteltijd, SMED en microstops
7. OEE: hoe de totale anlageneffectiviteit te berekenen
8. Kwaliteits-KPI's: uitvalpercentage, first pass yield, herbewerkingspercentage, PPM
9. Levering- en voorraad-KPI's: OTIF, roosteraanhoudendheid, WIP, voorraaddagen
10. Capaciteit en productiviteit: bezettingsgraad, benuttingsefficiëntie, arbeidsproductiviteit
11. Onderhouds-KPI's: MTBF, MTTR en inherente beschikbaarheid
12. Energie, veiligheid (TRIR, DART, LTIFR) en kosten per eenheid
13. KPI-systemen: hiërarchie, voorlopende en volgende indicatoren, SQCDP
14. Gegevensverzameling en datakwaliteit
15. Visualisatie: productievloerborden en Power BI-dashboards
16. Hoe KPI-doelen te stellen
17. Veelgemaakte fouten en hoe ze te voorkomen
18. Stappenplan: productie-KPI's in 90 dagen uitrollen
19. KPI's uit waardestroommodellering: iFAKT Polaris
20. Verklarende woordenlijst
21. Veelgestelde vragen: productie-KPI's
22. Conclusie

## 1. Wat zijn productie-KPI's?

Productie-KPI's (ook wel productiemetrics, productie-KPI's of key performance indicators in de productie genoemd) zijn samengevatte getallen die één aspect van de productie meetbaar maken. Hoe snel stroomt een order door de fabriek? Hoeveel van de geplande tijd besteedt een machine daadwerkelijk aan het maken van goede onderdelen? Hoeveel zendingen bereiken de klant op tijd en compleet? Elke KPI bestaat uit vier elementen: een **definitie** (wat precies geteld wordt), een **formule**, een **eenheid** en een **tijdsperiode**. Ontbreekt er een van deze, dan krijg je de bekende vergadering waarin twee afdelingen dezelfde naam gebruiken voor twee verschillende getallen.

Niet elke metric is een [key performance indicator (KPI)](https://www.m365.fm/entity/key-performance-indicator/). Een KPI is een metric die rechtstreeks gekoppeld is aan een doel en regelmatig beslissingen aanstuurt. Het aantal geproduceerde onderdelen is een metric. Levering op tijd aan de klant is voor de meeste fabrieken een KPI, omdat omzet en klantbehoud daarvan afhangen.

### De normen achter de formules: ISO 22400, ISA-95, SEMI en VDMA 66412

Je hoeft je KPI-definities niet zelf te bedenken. De internationale norm **ISO 22400-2:2014** "Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions" definieert een selectie van veelgebruikte KPI's met formule, timing, eenheid, gebruikersgroep en de productiemethodiek waarop ze van toepassing zijn [1]. Secundaire bronnen tellen 34 KPI's [38][3]. ISO heeft de norm als "te herzien" aangemerkt; Amendement 1 voegde in 2017 een reeks energie-KPI's toe [1].

De norm werkt met een precies tijdmodel. Kang et al., in een artikel gepubliceerd via het Amerikaanse National Institute of Standards and Technology (NIST), geven de kernformules als: beschikbaarheid = werkelijke productietijd (APT) ÷ geplande bezettingstijd (PBT), en effectiviteit = geplande looptijd per item (PRI) × geproduceerde hoeveelheid (PQ) ÷ APT [3]. De norm spreekt dus van "effectiviteit" waar de TPM-literatuur van "performance" spreekt.

Voor Amerikaanse lezers levert **ISA-95** (ANSI/ISA-95, internationaal IEC 62264) de architectuur rond deze KPI's. Gebaseerd op het Purdue-referentiemodel definieert het vijf niveaus, van het fysieke proces (niveau 0) via meten en bewaking, supervisory control en **niveau 3, manufacturing operations management (MOM), waar MES en SCADA thuishoren**, tot bedrijfsplanning en logistiek in ERP (niveau 4) [40]. ISO 22400-KPI's zijn met name KPI's voor manufacturing operations management, dus ze worden berekend op ISA-95-niveau 3 en naar boven gerapporteerd. In halfgeleiderfabrieken zijn SEMI E10 (betrouwbaarheid, beschikbaarheid, onderhoudbaarheid en benutting van apparatuur) en SEMI E79 (productiviteit van apparatuur, inclusief OEE) de branchespecifieke referenties [41].

In Duitsland heeft een werkgroep van de VDMA (de Duitse branchevereniging van de machinebouw) de richtlijn **VDMA 66412-1 "Manufacturing Execution Systems (MES) – KPIs"** gepubliceerd (editie 2009-10, 36 pagina's, gewijzigd door A1:2010-05) [4]. Ze definieert standaard-KPI's en hoe ze berekend worden uit machinetoestanden [5]. De boodschap voor jou als praktijkmens is in elk land dezelfde: hanteer waar mogelijk de standaardtermen en documenteer elke afwijking. Dat maakt vergelijkingen tussen fabrieken en MES-integratie veel eenvoudiger.

### Waar productie-KPI's voor dienen

KPI's hebben drie taken. Ze **maken zichtbaar** wat in het dagelijkse werk verloren gaat, bijvoorbeeld dat een machine de hele tijd draait maar slechts twee derde van de mogelijke output levert. Ze **richten de aandacht** op de grootste hefboom, omdat ze verliezen opdelen in categorieën. En ze **toetsen tegenmaatregelen**: heeft de nieuwe omsteltechniek de omsteltijd echt verkort, of is het verlies alleen naar de opstartfase verschoven? Zonder getal blijft die vraag een kwestie van mening.

Een vierde doel wordt vaak vergeten: KPI's zijn een **communicatiemiddel**. In [shop floor management](https://www.m365.fm/entity/shop-floor-management/) vormen ze de gemeenschappelijke taal tussen operators, ploegleiders en fabrieksleiding. Ze dienen dat doel alleen als iedereen de definitie kent en hetzelfde getal ziet.

## 2. Manufacturing KPI-spiekbriefje: alle formules in één overzicht

De tabel vat alle KPI's samen die in deze gids worden behandeld. "Niveau" geeft het gebruikelijke managementniveau aan (M = machine/werkstation, L = lijn/afdeling, P = fabriek). De formules volgen de bronnen die in elke sectie worden genoemd.

| KPI | Formule (korte vorm) | Eenheid | Richting | Niveau |
|---|---|---|---|---|
| Takt time | beschikbare productietijd ÷ klantvraag | s/stuk | een gegeven, niet iets om te optimaliseren | L |
| Cycle time | gemeten tijd tussen twee afgeronde stuks | s/stuk | ≤ takt | M, L |
| Doorlooptijd productie | eind − start (order of onderdeel); gemiddeld WIP ÷ doorvoer | u, dagen | ↓ | L, P |
| Bewerkingstijd | som van de tijden waarin het onderdeel daadwerkelijk wordt bewerkt | s, min | ↓ (zonder kwaliteitsverlies) | M, L |
| Flow factor (Wiendahl) | doorlooptijd ÷ bewerkingstijd | verhouding (≥ 1) | ↓ | L |
| Waardetoevoegingsratio (VSM) | bewerkingstijd ÷ doorlooptijd × 100 | % | ↑ | L, P |
| Omsteltijd | laatste goede deel van oude run tot eerste goede deel van nieuwe run | min | ↓ | M |
| Aandeel omsteltijd | omsteltijd ÷ geplande productietijd × 100 | % | ↓ | M, L |
| Micro-stops | aantal of duur van korte stilstanden onder een vastgestelde drempel | aantal, min | ↓ | M |
| Beschikbaarheid (OEE) | draaitijd ÷ geplande productietijd | % | ↑ | M |
| Prestatie (OEE) | ideale cycle time × totaal aantal ÷ draaitijd | % | ↑ | M |
| Kwaliteitspercentage (OEE) | aantal goede ÷ totaal aantal | % | ↑ | M |
| OEE | beschikbaarheid × prestatie × kwaliteit | % | ↑ | M, L |
| TEEP | OEE × bezetting (geplande tijd ÷ kalendertijd) | % | ↑ | M, P |
| Uitvalpercentage | aantal uitval ÷ totaal aantal × 100 | % | ↓ | M, L, P |
| First pass yield (FPY) | in één keer goede stuks ÷ totaal aantal × 100 | % | ↑ | M, L |
| Herbewerkingspercentage | aantal herbewerkte stuks ÷ totaal aantal × 100 | % | ↓ | M, L |
| PPM | defecte onderdelen ÷ gecontroleerde of verzonden onderdelen × 1.000.000 | ppm | ↓ | P |
| OTIF | op tijd en compleet geleverde orderregels ÷ alle vervallen orderregels × 100 | % | ↑ | P |
| Planningstrouw (productie) | op tijd afgeronde orders ÷ alle vervallen orders × 100 | % | ↑ | L, P |
| WIP | hoeveelheid of waarde van werk in uitvoering | stuks, $ | ↓ (tot het minimaal benodigde) | L |
| Voorraaddagen | voorraad ÷ gemiddeld dagelijks verbruik | dagen | ↓ (tot het veiligheidsniveau) | L, P |
| Capaciteitsbenutting | belasting ÷ beschikbare capaciteit × 100 | % | doelband, geen maximum | L, P |
| Benuttingsefficiëntie (ISO) | werkelijke productietijd ÷ werkelijke bezettingstijd per eenheid | % | ↑ | M |
| Arbeidsproductiviteit | aantal goede ÷ arbeidsuren | stuks/u | ↑ | L, P |
| MTBF | draaitijd ÷ aantal storingen | u, min | ↑ | M |
| MTTR | totale reparatietijd ÷ aantal storingen | min | ↓ | M |
| Energie per eenheid | verbruikte energie ÷ aantal goede | kWh/stuk | ↓ | M, P |
| TRIR (OSHA) | registreerbare gevallen × 200.000 ÷ gewerkte uren | per 100 FTE | ↓ | P |
| DART-percentage (OSHA) | DART-gevallen × 200.000 ÷ gewerkte uren | per 100 FTE | ↓ | P |
| LTIFR | verzuimongevallen ÷ gewerkte uren × 1.000.000 | per 1 miljoen u | ↓ | P |
| Kosten per eenheid | kosten over de periode ÷ aantal goede | $/stuk | ↓ | L, P |

## 3. Het uitgewerkte voorbeeld "Lijn 3": invoergegevens

Om de formules concreet te houden, berekent deze gids elke KPI op één fictieve assemblagelijn. De getallen zijn zo gekozen dat ze elkaar controleren: klopt de OEE, dan moet die overeenkomen met het aantal goede stuks, en klopt de doorlooptijd, dan moet die overeenkomen met WIP en doorvoer.

| Invoer | Waarde |
|---|---|
| Shiftpatroon | 2 shifts van 8 u (480 min), 5 dagen per week |
| Pauzes per shift | 30 min (geen geplande productietijd) |
| Geplande productietijd per shift | 450 min |
| Klantvraag | 900 stuks per dag, dus 450 stuks per shift |
| Ideale cyclustijd (knelpuntstation) | 50 s/stuk |
| Storingen per shift | 25 min |
| Omstellingen per shift | 2 omstellingen van 10 min = 20 min |
| Totaal aantal per shift | 432 stuks |
| waarvan goed bij de eerste keer | 410 stuks |
| waarvan nabewerkt en daarna goed | 12 stuks |
| waarvan uitschot | 10 stuks |
| Bezetting | 6 operators per shift |

Deze invoergegevens keren in elke sectie terug. Elke berekening is opnieuw gecontroleerd; afronding gebeurt alleen in het resultaat. Kosten in sectie 12 worden weergegeven in Amerikaanse dollars; de bedragen zijn illustratief, net als de lijn zelf.

## 4. Tijdsmetrieken: takttijd, cyclustijd, doorlooptijd, bewerkingstijd, flowfactor

Tijdsmetrieken zijn de productie-KPI's die het vaakst met elkaar worden verward. De termen klinken op elkaar, en bedrijven gebruiken ze in de praktijk verschillend. Leg de definities voor uw fabriek één keer vast en koppel die definitie aan elk bord.

### Takttijd berekenen

[Takttijd](https://www.m365.fm/entity/takt-time/) geeft aan hoe vaak een afgewerkt stuk de lijn moet verlaten om aan de klantvraag te voldoen. Het Lean Enterprise Institute (LEI) definieert deze als beschikbare productietijd gedeeld door klantvraag [9]. Rother en Shook noemen "Produceer op uw takttijd" de eerste richtlijn voor een lean waardestroom en beschrijven takt als een stand-in voor de klantvraag [2][12].

> **Takttijd = beschikbare productietijd per periode ÷ klantvraag per periode**

Het woord komt uit het Duits ("Takt" betekent slag of maat). Volgens LEI werd takt in de jaren dertig van de vorige eeuw in de Duitse vliegtuigindustrie voor het eerst als productiemanagementinstrument gebruikt [9].

**Voorbeeld Lijn 3:** beschikbare tijd per shift 450 min = 27.000 s; vraag per shift 450 stuks.
Takttijd = 27.000 s ÷ 450 stuks = **60 s/stuk**.

Als controle het voorbeeld van LEI: 480 minuten per dag en een vraag van 240 stuks geven een takttijd van 2 minuten [9].

**Veelgemaakte fouten:**
- **Pauzes niet aftrekken.** Met 480 in plaats van 450 minuten krijgt u een takt van 64 s. Op papier zou de lijn dan te langzaam worden ontworpen.
- **Ongeplande stilstand aftrekken.** Storingen horen niet in de beschikbare tijd voor takt. Het zijn verliezen die de lijn moet opvangen via zijn capaciteitsreserve. Ze aftrekken verbergt het probleem binnen de takt.
- **Takt behandelen als iets om te optimaliseren.** De klant bepaalt de takt, niet de productie. Wat u optimaliseert is de cyclustijd, zodat die betrouwbaar aan de takt voldoet.
- **Takt verwarren met een snelheid.** Takt is tijd per stuk, niet stuks per tijdseenheid. De inverse (1 stuk elke 60 s = 60 stuks per uur) is het vereiste outputtempo.

### Cyclustijd

Volgens LEI is [cyclustijd](https://www.m365.fm/entity/cycle-time/) "de tijd die nodig is om een onderdeel te produceren of een proces af te ronden, zoals gemeten door werkelijke meting" [10]. In value stream mapping beschrijft zij hoe vaak een proces een onderdeel afrondt. Het kernwoord is "gemeten": cyclustijd is een werkelijke waarde. De **ideale cyclustijd** (ook wel standaard-, ontwerp- of typeplaatcyclustijd genoemd) is de best technisch mogelijke tijd en de basis van de OEE-prestatie.

> **Gemiddelde werkelijke cyclustijd = draaitijd ÷ geproduceerde stuks**

**Voorbeeld Lijn 3:** draaitijd 405 min (450 min minus 25 min storingen minus 20 min omstellingen) = 24.300 s; 432 stuks geproduceerd.
Werkelijke cyclustijd = 24.300 s ÷ 432 = **56,25 s/stuk**.
De ideale cyclustijd is 50 s. Het verschil van 6,25 s per stuk zit in microstops en verlaagde snelheid, dat wil zeggen in het prestatieverlies (sectie 7).

Voor machines definieert LEI ook de **effectieve machinecyclustijd**: machinecyclustijd plus laad- en lostijd plus omsteltijd, gedeeld door het aantal stuks dat tussen omstellingen wordt gemaakt [10]. Dit laat zien of een machine de takt überhaupt kan halen, gezien hoe vaak die wordt omgesteld.

**Veelvoorkomende fout:** cyclustijd verwarren met takttijd. Beide worden uitgedrukt in seconden per stuk, maar takt is een vraagcijfer en cyclustijd is een procescijfer. Ten minste één hoog gerangschikte Engelstalige pagina geeft de cyclustijdformule omgekeerd weer (onderdelen ÷ looptijd); dat is een snelheid, geen cyclustijd.

### Hoe je de doorlooptijd in de productie berekent

De [doorlooptijd](https://www.m365.fm/entity/lead-time/) (productiedoorlooptijd, ook wel throughput time genoemd) is "de tijd die nodig is om een product van begin tot eind door een proces of een waardestroom te laten bewegen" [10]. Naast de bewerkingstijd omvat zij alle transport-, wachtrij- en wachttijden. De Duitse productietechniek splitst haar op in bewerkingstijd (inrichten en bewerken), overgangstijd (wachtrij en transport) en wachttijd tussen bewerkingen [15]. Hans-Peter Wiendahl maakte de doorlooptijd met zijn trechtermodel het centrale begrip van de productiesturing [15][14].

Er zijn twee manieren om haar vast te stellen:

**1. Direct, per order of onderdeel:**

> **Doorlooptijd = tijdstip van gereedmelding − starttijdstip (of vrijgave van de order)**

Bepaal of je kalenderdagen, werkdagen (werkagendadagen) of uren telt, en waar de klok begint (orderinvoer, vrijgave, eerste bewerking). Verschillende startpunten zijn de meest voorkomende reden waarom verkoop en productie ruzie maken over "de" doorlooptijd.

**2. Indirect, met de wet van Little:**

In 1961 bewees John D. C. Little dat in een stabiel systeem het gemiddelde aantal items in het systeem gelijk is aan de aankomstsnelheid maal de gemiddelde verblijftijd in het systeem (L = λW) [13]. Toegepast op de productie:

> **Gemiddelde doorlooptijd = gemiddelde WIP ÷ gemiddelde doorvoer**

**Voorbeeld lijn 3:** gemiddeld 2.700 stuks bevinden zich in de lijn en de buffers; de lijn levert gemiddeld 900 stuks per werkdag.
Doorlooptijd = 2.700 ÷ 900 = **3 werkdagen**.

De wet van Little geldt voor gemiddelden over een voldoende lange periode waarin de WIP noch blijft groeien, noch blijft krimpen. WIP en doorvoer moeten dezelfde eenheid gebruiken (stuks of euro's, niet gemengd). De grote praktische waarde: zij laat zien dat bij constante doorvoer een kortere doorlooptijd alleen mogelijk is met minder WIP. Snellere machines alleen helpen weinig zolang onderdelen voor hen wachten.

### Bewerkingstijd en standaardtijd (REFA)

De **bewerkingstijd** is de tijd waarin een product daadwerkelijk wordt bewerkt [10]; zij is meestal een klein deel van de doorlooptijd. Voor planning en kostprijsberekening gebruiken Duitse fabrieken de tijdcategorieën van REFA, de Duitse vereniging voor arbeidsontwerp en industriële techniek (qua rol vergelijkbaar met standaardtijdconventies in de Amerikaanse industrial engineering). REFA splitst de ordertijd op in insteltijd en looptijd, elk opgebouwd uit basis-, rust- en toeslagcomponenten; de machinekant heet bezettingstijd van het werkmiddel [16][17]:

> **Ordertijd T = insteltijd t_r + looptijd t_a**, met **t_a = ordergrootte m × tijd per stuk t_e**

**Voorbeeld:** een order van 400 stuks loopt op het knelpuntstation: insteltijd 20 min, tijd per stuk 50 s.
T = 20 min + 400 × 50 s ÷ 60 = 20 + 333,3 = **353,3 min** (ongeveer 5,9 u).

Nyhuis en Wiendahl leiden de **bewerkingstijd** van een werkstap af uit de ordertijd en drukken haar uit in werkagendadagen door de ordertijd te relateren aan de dagelijkse capaciteit van het werksysteem [14]. [unverified: exacte formulenotatie bij Nyhuis/Wiendahl, paragraaf 2.1.1, alleen geverifieerd via de inhoudsopgave en de lijst met afkortingen] Om de voorbeelden vergelijkbaar te houden, vereenvoudigt deze gids en rekent zij in minuten bedrijfstijd; voor één machine is de bewerkingstijd dan gelijk aan de ordertijd.

### Doorlooppercentage en waardetoevoegingsratio

Er circuleren twee verschillende KPI's onder vergelijkbare namen, en je moet ze niet door elkaar halen.

**Doorlooppercentage volgens Wiendahl (logistiek perspectief):** de verhouding van doorlooptijd tot bewerkingstijd van een werkstap of order [14][15]. Een waarde van 1 betekent dat de order zonder wachttijd is verwerkt; een waarde van 6 betekent dat zij zes keer zo lang in het systeem heeft doorgebracht als inrichten en bewerken vereisten.

> **Doorlooppercentage = doorlooptijd ÷ bewerkingstijd**

**Voorbeeld:** de order uit het REFA-voorbeeld heeft een bewerkingstijd van 353,3 min. Zij wacht twee werkdagen vóór de bewerking (2 × 900 min = 1.800 min bedrijfstijd).
Doorlooptijd van de bewerking = 1.800 + 353,3 = 2.153,3 min. Doorlooppercentage = 2.153,3 ÷ 353,3 = **6,09**.

**Waardetoevoegingsratio (waardestroomperspectief):** bij [value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) wordt vaak het omgekeerde perspectief gebruikt: het aandeel van de bewerkingstijd in de doorlooptijd, in procent. (De smallere "waardecreërende tijd" van LEI telt alleen de werkelementen waarvoor de klant bereid is te betalen [10].) De Duitstalige Wikipedia noemt deze ratio "Fließgrad", de omgekeerde waarde "Flussgrad", en stelt het aandeel van waardetoevoegende activiteit in de Duitse industrie op 5 tot 15 procent [15]. [unverified: primaire bron voor dit bereik is in Wikipedia niet duidelijk gedocumenteerd] Sommige leerboeken over waardestromen noemen het percentage ook een flowfactor. Controleer daarom altijd of een waarde boven 1 of onder 100 % bedoeld is.

> **Waardetoevoegingsratio = bewerkingstijd ÷ doorlooptijd × 100 %**

**Voorbeeld lijn 3:** de bewerkingstijden van de vier stations tellen op tot 190 s. De doorlooptijd is 3 werkdagen van elk 900 min bedrijfstijd = 162.000 s.
Waardetoevoegingsratio = 190 ÷ 162.000 × 100 % = **0,117 %**.

Waarden onder één procent zijn normaal in operaties met buffers en batches. Belangrijk zijn de trend en de tijdbasis: in kalendertijd daalt de waarde nog verder. De methode wordt uitgebreid behandeld in de gids [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

## 5. Takttijd versus cyclustijd versus doorlooptijd

"Wat is het verschil tussen takttijd en cyclustijd?" is een van de meest voorkomende vragen rond productie-KPI's. De tabel zet de drie naast elkaar. LEI vat de volgorde als volgt samen: "Meestal is de waardecreërende tijd kleiner dan de cyclustijd, die kleiner is dan de productiedoorlooptijd" [10].

| Kenmerk | Takttijd | Cyclustijd | Doorlooptijd |
|---|---|---|---|
| Vraag | Hoe vaak **moet** een onderdeel klaar zijn? | Hoe vaak **wordt** een onderdeel klaar? | Hoe lang **doet** een onderdeel over het systeem? |
| Bron | klantvraag en werktijd | meting bij het proces | tijdstempels of de wet van Little |
| Formule | beschikbare tijd ÷ vraag | looptijd ÷ aantal (gemeten) | eind − begin, of WIP ÷ doorvoer |
| Gebruikelijke eenheid | s/stuk | s/stuk | u, dagen |
| Lijn 3 | 60 s | 56,25 s (ideaal 50 s) | 3 werkdagen |
| Wie heeft invloed? | verkoop, klant, ploegenpatroon | engineering, methode, onderhoud | planning, WIP, batchgroottes |
| Verstandige richting | geen; het is het gegeven | ≤ takt met een reserve | zo kort mogelijk |
| Veelgemaakte fout | pauzes niet afgetrokken | ideale in plaats van werkelijke waarde gebruikt | startpunt niet gedefinieerd |

**Belangrijk inzicht uit het voorbeeld:** de werkelijke cyclustijd van 56,25 s ligt onder de takt van 60 s. Toch haalt lijn 3 de vraag niet, zoals de volgende secties laten zien, omdat cyclustijd alleen geldt tijdens de looptijd. Storingen, omsteltijden en uitval ontbreken in die weergave. Voor het ontwerp van de lijn telt de **effectieve cyclustijd per goed deel**, dat wil zeggen de geplande productietijd gedeeld door het aantal goede delen.

## 6. Omsteltijd, SMED en microstops

### Omsteltijd en omsteltijdaandeel

[Omsteltijd](https://www.m365.fm/entity/setup-time/) (insteltijd) is de tijd die nodig is om een machine of lijn van het ene product naar het andere over te schakelen. In de praktijk werkt het meten vanaf het laatste goede stuk van de oude run tot het eerste goede stuk van de nieuwe run het best, omdat dit afstelling en opstartfase omvat. [unverified: deze conventie is in de praktijk wijdverspreid, maar wordt in de hier geraadpleegde bronnen niet letterlijk vermeld.] In het REFA-systeem maakt insteltijd deel uit van de ordertijd [16].

> **Omsteltijdaandeel = omsteltijd ÷ geplande productietijd × 100 %**

**Voorbeeld lijn 3:** 20 min omsteltijd ÷ 450 min = **4,44 %**.

### SMED: omstellingen in enkele minuten

[SMED](https://www.m365.fm/entity/smed/) (Single-Minute Exchange of Die) is een methode om omstellingen zo kort mogelijk te maken; het doel is een omsteltijd van enkele minuten, dus minder dan tien minuten [11]. Shigeo Shingo ontwikkelde de kernideeën in de jaren 1950 en 1960: hij scheidde interne insteltijd, die alleen kan worden uitgevoerd terwijl de machine stilstaat, van externe insteltijd, die kan plaatsvinden terwijl de machine draait, en verplaatste zoveel mogelijk naar extern [11].

**Voorbeeld lijn 3:** als beide omstellingen van 10 naar 6 min dalen, wint de lijn 8 min productietijd per shift. Bij een ongewijzigde prestatie van 88,9 % is dat 8 × 60 ÷ 50 × 0,889 = **ongeveer 8,5 extra stuks** per shift. Als alternatief kan de lijn dezelfde totale omsteltijd aanhouden, vaker omstellen en kleinere batches draaien, wat de WIP en doorlooptijd verlaagt.

**Veelgemaakte fout:** omsteltijd alleen als verlies beschouwen. Kortere omstellingen zijn vooral een hefboom voor kleinere batches. Als u alle gewonnen tijd in grotere runs steekt, geeft u het logistieke voordeel weg.

### Microstops

[Microstops](https://www.m365.fm/entity/micro-stops/) (kleine stilstanden) zijn korte onderbrekingen, zoals een vastgelopen stuk of een getriggerde sensor, die afzonderlijk nauwelijks worden geregistreerd. In Nakajima's TPM-raamwerk horen zij bij de zes grote verliezen als "idling- en kleine stilstandsverliezen" en verlagen zij de prestatie, niet de beschikbaarheid [7]. Elk bedrijf bepaalt zelf de grens tussen een microstop en een storing; drempels van enkele minuten zijn gebruikelijk. [unverified: geen norm met een bindende drempel gevonden.] Muchiri en Pintelon wijzen erop dat handmatige registratie kleine stops vaak mist [7].

**Voorbeeld lijn 3:** het totale prestatieverlies is draaitijd min de ideale tijd voor de geproduceerde eenheden: 405 min − 432 × 50 s ÷ 60 = 405 − 360 = **45 min**. De machinebesturing telt 120 microstops van elk 15 s = 30 min. De resterende 15 min zijn verminderde snelheid. Zonder automatische dataregistratie zouden die 30 minuten microstops waarschijnlijk in het ploegenrapport als "lijn draait" zijn genoteerd.

## 7. OEE: hoe bereken je de totale effectiviteit van een machine

Overall equipment effectiveness (OEE) is de bekendste KPI in de maakindustrie. De term gaat terug op Seiichi Nakajima en is een kernelement van [Total Productive Maintenance (TPM)](https://www.m365.fm/entity/total-productive-maintenance/) [8][6]. De ASQ-woordenlijst beschrijft OEE als een maat voor hoe goed een productie-eenheid presteert ten opzichte van de ontworpen capaciteit tijdens de periodes waarin zij gepland draait, waarbij beschikbaarheid, snelheid en het aandeel goede output worden gecombineerd [36]. OEE beantwoordt één vraag: welk deel van de geplande productietijd is gebruikt om goede onderdelen te maken met ideale snelheid?

### De drie factoren

> **OEE = Beschikbaarheid × Prestatie × Kwaliteit**

| Factor | Formule | Verliezen die worden vastgelegd |
|---|---|---|
| Beschikbaarheid | draaitijd ÷ geplande productietijd | storingen, omstellen en afstellen |
| Prestatie (ISO: effectiviteit) | ideale cyclustijd × totaal aantal ÷ draaitijd | microstops, verlaagde snelheid |
| Kwaliteit | aantal goede stuks ÷ totaal aantal | afval, herbewerking, opstartverliezen |

Muchiri en Pintelon definiëren beschikbaarheid als bedrijfstijd als percentage van de belaste tijd, prestatie als theoretische cyclustijd maal werkelijke output gedeeld door bedrijfstijd, en het kwaliteitspercentage als totale output minus defecten ten opzichte van de totale output [7]. ISO 22400-2 gebruikt dezelfde logica met eigen tijdbegrippen [3].

### De zes grote verliezen

Nakajima verdeelt de verliezen over zes categorieën [7]:

1. **Storingen** (storingsverliezen) → beschikbaarheid
2. **Omstellen en afstellen** → beschikbaarheid
3. **Stationair draaien en kleine stilstanden** → prestatie
4. **Verlaagde snelheid** → prestatie
5. **Kwaliteitsdefecten en herbewerking** → kwaliteit
6. **Verlaagde opbrengst tijdens opstart** → kwaliteit

Deze indeling is de echte waarde van OEE. Het totaal zegt op zichzelf weinig; alleen de uitsplitsing laat zien of onderhoud, het omstelteam of kwaliteit de grootste hefboom heeft.

### Hoe bereken je OEE: het voorbeeld van lijn 3

**Stap 1, beschikbaarheid:** geplande productietijd 450 min; storingen 25 min, omstellingen 20 min; draaitijd 405 min.
Beschikbaarheid = 405 ÷ 450 = **90,0 %**.

**Stap 2, prestatie:** 432 stuks × 50 s = 21.600 s ideale tijd; draaitijd 405 min = 24.300 s.
Prestatie = 21.600 ÷ 24.300 = **88,9 %**.

**Stap 3, kwaliteit:** 410 stuks goed bij de eerste keer van 432 stuks.
Kwaliteit = 410 ÷ 432 = **94,9 %**.

**Stap 4, OEE:** 0,900 × 0,8889 × 0,9491 = **75,9 %**.

**Controle via tijd:** goed aantal maal ideale cyclustijd gedeeld door geplande productietijd = 410 × 50 s ÷ 27.000 s = 20.500 ÷ 27.000 = **75,9 %**. Beide manieren moeten hetzelfde resultaat geven; als dat niet zo is, zijn de invoergegevens fout.

**Wat OEE betekent voor takt:** de effectieve cyclustijd per goed stuk is 50 s ÷ 0,759 = 65,9 s, wat boven de takt van 60 s ligt. In 27.000 s maakt de lijn 410 goede stuks bij de eerste keer, 422 inclusief de 12 herbewerkte stuks. De vraag van 450 stuks per shift wordt met 28 stuks gemist. Om die vraag alleen met goede stuks bij de eerste keer te dekken, zou lijn 3 een OEE van 450 × 50 ÷ 27.000 = 83,3 % nodig hebben.

### Herbewerking: goed of fout?

In TPM-logica is herbewerking een kwaliteitsverlies [7]; daarom telt het voorbeeld alleen de 410 stuks die bij de eerste keer goed waren. Kang e.a. gebruiken een kwaliteitspercentage dat herbewerkte stuks als goed telt [3]. Met 422 in plaats van 410 stuks zou de kwaliteit stijgen tot 97,7 % en de OEE tot 78,1 %. Beide varianten zijn verdedigbaar, maar je moet kiezen en mag fabrieken met verschillende definities niet met elkaar vergelijken.

### TEEP: OEE ten opzichte van kalendertijd

Total effective equipment performance (TEEP) relateert OEE aan de totale kalendertijd in plaats van alleen de geplande tijd [8]:

> **TEEP = OEE × belasting**, met **belasting = geplande productietijd ÷ kalendertijd**

**Voorbeeld lijn 3:** 10 shifts × 450 min = 4.500 min geplande tijd per week; kalendertijd 7 × 24 × 60 = 10.080 min.
Belasting = 4.500 ÷ 10.080 = 44,6 %. TEEP = 75,9 % × 44,6 % = **33,9 %**.

TEEP is de juiste KPI voor investeringsbeslissingen: voordat je een tweede machine koopt, laat het zien hoeveel ongebruikte kalendertijd de bestaande machine nog heeft. Let op dat sommige Engelstalige pagina's OEE, OOE en TEEP dezelfde formule geven; dat klopt niet, want de drie verschillen in de tijdbasis.

### Wat is een goede OEE? Waar de 85 %-benchmark vandaan komt en waarom die wordt betwist

De cijfer van 85 % als "wereldklasse-OEE" wordt in vakartikelen regelmatig aan Nakajima toegeschreven, vaak opgebouwd uit 90 % beschikbaarheid, 95 % prestatie en 99,9 % kwaliteit (0,90 × 0,95 × 0,999 = 85,4 %) [37]. In de primaire en beoordelende bronnen die voor dit artikel zijn gecontroleerd, kon de verdeling in componenten niet woordelijk worden teruggevonden. [unverified: originele passage in Nakajima 1988] De Engelse Wikipedia stelt uitdrukkelijk dat 85 % in veel gevallen niet het juiste doel is, bijvoorbeeld wanneer niet alle verliezen worden vastgelegd of wanneer de kwaliteitseisen in de sector hoger liggen [8].

Verdere kritiekpunten [8]:

- OEE gedraagt zich als een meetkundig gemiddelde en straft ongelijke factoren af: 20 % × 80 % = 16 %, 50 % × 50 % = 25 %.
- Definities verschillen tussen bedrijven, waardoor OEE slecht geschikt is voor vergelijkingen tussen fabrieken of machinetypen.
- OEE is geen maatstaf voor de prestaties van individuele medewerkers.

Gebruik OEE als verbeter-KPI voor dezelfde installatie in de tijd, niet als ranglijst. Een continu proces dat 24/7 draait en een job shop met veel omstellingen hebben structureel verschillende waarden.

### OEE over machines correct samenvoegen

Een veelgemaakte rapportagefout is het gemiddelde nemen van OEE-percentages. Voorbeeld: machine A heeft 80 % OEE bij 450 minuten geplande tijd, machine B 50 % bij 150 minuten.

- Fout (ongewogen gemiddelde): (80 % + 50 %) ÷ 2 = 65,0 %
- Juist (tijdgewogen): (0,80 × 450 + 0,50 × 150) ÷ (450 + 150) = (360 + 75) ÷ 600 = **72,5 %**

De zuiverste aanpak is de OEE op elk niveau opnieuw te berekenen uit opgetelde tijden: som van de waardetoevoegende tijd (goede aantal × ideale cyclustijd) gedeeld door de som van de geplande tijd. Sectie 15 toont de bijbehorende DAX-formule.

## 8. Kwaliteits-KPI's: uitvalpercentage, first pass yield, herwerkpercentage, PPM

Kwaliteits-KPI's beantwoorden twee verschillende vragen: hoeveel materiaal en tijd gaat er binnen de fabriek verloren (intern), en hoeveel defecten bereiken de klant (extern)? Elke invalshoek heeft eigen KPI's nodig. ISO 22400-2 bevat onder meer de kwaliteitsratio, de uitvalratio, de herwerkratio en een first pass yield [3]; de uitval- en herwerkratio komen ook voor in de lijst van de 34 ISO-KPI's van Fabrico [38].

### Formule uitvalpercentage

Het [uitvalpercentage](https://www.m365.fm/entity/scrap-rate/) meet het aandeel onderdelen dat niet meer bruikbaar is en wordt afgekeurd of gerecycled. In de presentatie van Kang et al. is de ISO-formule de uitvalhoeveelheid gedeeld door de geproduceerde hoeveelheid [3].

> **Uitvalpercentage = aantal uitval ÷ totaal aantal × 100 %**

**Voorbeeld lijn 3:** 10 afgekeurde onderdelen ÷ 432 onderdelen × 100 % = **2,31 %**.

**Veelgemaakte fouten:**
- **De basis wisselen.** Soms wordt het totaal aantal gebruikt, soms het aantal goede stuks (10 ÷ 422 = 2,37 %). Bij lage percentages is het verschil klein; bij hoge percentages is het van belang.
- **Opstartuitval vergeten.** Onderdelen die na een omstelling worden weggegooid tijdens het instellen, worden vaak niet geteld. Toch laten ze zien of omstellingen beheerst verlopen.
- **Alleen stuks, geen waarde.** Een afgekeurd onderdeel aan het eind van de waardeketen kost veel meer dan een ruw onderdeel. Voeg de uitvalkosten toe aan het stuksbedrag.

### First pass yield (FPY)

First pass yield (ook first time through of right first time) meet het aandeel eenheden dat een proces de eerste keer doorloopt zonder herwerk en zonder uitval. ASQ beschrijft FPY, ook wel de kwaliteitsratio genoemd, als het percentage eenheden dat een proces voltooit en aan de kwaliteitsrichtlijnen voldoet zonder te worden afgekeurd, opnieuw uitgevoerd, opnieuw getest, geretourneerd of naar een offline herstelafdeling afgevoerd [36]. Kang et al. geven de formule als het aantal goed bij de eerste doorloop gedeeld door de geproduceerde hoeveelheid [3].

> **FPY = eenheden goed bij eerste doorloop ÷ totaal aantal × 100 %**

**Voorbeeld lijn 3:** 410 ÷ 432 × 100 % = **94,9 %**.

Bij meerdere processtappen vermenigvuldig je de FPY-waarden van de afzonderlijke stappen om de **rolled throughput yield (RTY)** te krijgen. Drie stations met elk 98 % FPY geven 0,98 × 0,98 × 0,98 = 94,1 %. RTY laat zien hoeveel onderdelen de hele keten zonder enige correctie doorlopen. [unverified: RTY is wijdverbreid in de Six Sigma-literatuur, maar voor dit artikel niet gecontroleerd aan een primaire bron.]

**OEE-kwaliteit versus FPY:** als je herwerk als verlies beschouwt, zijn FPY en de OEE-kwaliteitsratio identiek (beide 94,9 % in het voorbeeld). Als je herwerk als goed telt, is OEE-kwaliteit gelijk aan de eindopbrengst: (410 + 12) ÷ 432 = 97,7 %.

### Herwerkpercentage

> **Herwerkpercentage = aantal herwerkt ÷ totaal aantal × 100 %**

**Voorbeeld lijn 3:** 12 ÷ 432 × 100 % = **2,78 %**.

De controle: FPY + herwerkpercentage + uitvalpercentage = 94,91 % + 2,78 % + 2,31 % = 100 %. Deze somcontrole moet in elk dashboard automatisch draaien; klopt de som niet, dan ontbreken er transacties.

Herbewerking wordt vaak onderschat omdat het onderdeel uiteindelijk goed is. Maar het bindt mensen, creëert WIP en verlengt de doorlooptijd. Registreer de herbewerkingstijd net zo goed als de herbewerkte hoeveelheid.

### PPM (parts per million)

ASQ definieert PPM als een metriek die het aantal defecten rapporteert, genormaliseerd naar een populatie van één miljoen, voor een eenvoudiger vergelijking [36]. Het wordt vooral gebruikt voor klantklachten en leveranciersbeoordelingen.

> **PPM = defecte onderdelen ÷ verzonden (of gecontroleerde) onderdelen × 1.000.000**

**Voorbeeld:** in een kwartaal verzendt de fabriek 250.000 onderdelen; de klant keurt er 18 af. PPM = 18 ÷ 250.000 × 1.000.000 = **72 ppm**.

Spreek met de klant af of afgekeurde onderdelen, afgekeurde zendingen of geaccepteerde klachten meetellen. Interne uitval uitdrukken in PPM (Lijn 3: 10 ÷ 432 × 1.000.000 = 23.148 ppm) is mogelijk maar niet erg intuïtief; het percentage werkt daar beter.

## 9. KPI's voor levering en voorraad: OTIF, planningsnauwkeurigheid, WIP, dagen voorraaddekking

### Levertijdbetrouwbaarheid en OTIF

Leveringsprestatie meet hoe betrouwbaar de fabriek haar toezeggingen aan klanten nakomt. De meest gebruikelijke vorm is **OTIF** (on time in full): een levering telt alleen mee als zij op tijd **én** compleet is.

> **OTIF = orderregels op tijd en compleet geleverd ÷ alle vervallen orderregels × 100 %**

Er is geen bindende standaarddefinitie. McKinsey merkte in 2019 op dat OTIF zonder standaarddefinitie zeer uiteenlopend wordt geïnterpreteerd; in een enquête onder 24 grote Noord-Amerikaanse detailhandelaren en consumentengoederenfabrikanten gaf 79 % de voorkeur aan één gecombineerde OTIF-metriek boven aparte meting, en er was geen consensus over de breedte van het leveringsvenster [18].

**Voorbeeld:** in één maand zijn 200 orderregels vervallen. 184 werden op tijd geleverd, 190 compleet, 178 op tijd en compleet.
- Op tijd = 184 ÷ 200 = 92,0 %
- Compleet = 190 ÷ 200 = 95,0 %
- OTIF = 178 ÷ 200 = **89,0 %**

Let op: OTIF is niet het product van de twee percentages (0,92 × 0,95 = 87,4 %); het wordt geteld op basis van de regels die op hetzelfde moment aan beide voorwaarden voldeden.

**U moet vaststellen:** de referentiedatum (gevraagde of bevestigde datum), het toleranbvenster (bijvoorbeeld ±1 dag), het niveau (order, regel, hoeveelheid) en of vroege leveringen als op tijd gelden. Grote klanten stellen vaak de regels voor u vast: Walmart vereiste bijvoorbeeld in 2019 van leveranciers dat zij volledige vrachtwagenladingen binnen een venster van twee dagen in 87 % van de gevallen leverden, en legde boetes op van 3 % van de kostprijs van de verkochte goederen bij missers [47]. Zulke programma's veranderen, dus controleer de huidige definitie van elke klant voordat u vergelijkt.

### Planningsnauwkeurigheid in de productie

Planningsnauwkeurigheid (tijdige productieafronding) meet of productieorders op hun geplande datum worden afgerond. Het is een interne KPI en een vooruitlopende indicator voor de OTIF bij klanten.

> **Planningsnauwkeurigheid = op schema afgeronde productieorders ÷ alle vervallen productieorders × 100 %**

**Voorbeeld:** 102 van de 120 vervallen orders worden op schema afgerond: **85,0 %**.

Nyhuis en Wiendahl onderbouwen hun model van logistieke bedrijfscurves deels met het onbevredigende behalen van logistieke doelen bij veel bedrijven [14]. [unverified: abstract in de opgehaalde versie na dit deel van de zin afgebroken] Voeg de gemiddelde planningsafwijking in dagen aan het percentage toe; 85 % nauwkeurigheid met één dag vertraging is iets anders dan 85 % met twee weken vertraging.

### WIP (work in process)

Werk in uitvoering omvat alle onafgewerkte goederen tussen materiaalvrijgave en afronding. Het wordt gerapporteerd in stuks (voor sturing) of dollars (voor financiën). De wet van Little koppelt WIP rechtstreeks aan de doorlooptijd [13]: Lijn 3 heeft 2.700 onderdelen WIP bij een dagelijkse doorvoer van 900 onderdelen, dus 3 dagen doorlooptijd. Als het team de WIP bij dezelfde doorvoer terugbrengt tot 1.800 onderdelen, daalt de doorlooptijd tot 2 dagen.

### Dagen voorraaddekking (voorraadafdekking)

> **Dagen voorraaddekking = voorraad ÷ gemiddeld dagelijks verbruik (of vraag)**

**Voorbeeld:** eindproductvoorraad 2.250 eenheden, vraag 900 eenheden per dag. Dagen voorraaddekking = 2.250 ÷ 900 = **2,5 dagen**.

Wiskundig gezien is dagen voorraaddekking de wet van Little toegepast op één voorraadpunt. Gebruik vooruitkijkende vraag wanneer de vraag sterk fluctueert; anders kan dekking op basis van historie misleidend hoog of laag lijken.

## 10. Capaciteit en productiviteit: bezetting, bezettingsefficiëntie, arbeidsproductiviteit

### Capaciteitsbezetting

Bezetting vergelijkt de belasting (benodigde capaciteit volgens standaardtijden) met de beschikbare capaciteit.

> **Capaciteitsbezetting = belasting ÷ beschikbare capaciteit × 100 %**

**Voorbeeld:** orders met 4.050 min standaardtijd worden voor de week ingepland op het knelpuntstation; de beschikbare capaciteit is 4.500 min. Bezetting = 4.050 ÷ 4.500 = **90,0 %**.

**Waarom 100 % geen doel is:** de logistieke bedrijfscurven van Nyhuis en Wiendahl beschrijven het verband tussen WIP, output en doorlooptijd van een werksysteem [14]. Naarmate de bezetting de capaciteitsgrens nadert, nemen wachtrijen en doorlooptijden onevenredig toe, omdat elke verstoring en elke schommeling niet meer kan worden opgevangen. Het knelpunt mag hoog bezet zijn; niet-knelpunten hebben reserve nodig. Stel een doelbandbreedte in in plaats van een maximum.

### Bezetting is niet hetzelfde als bezettingsefficiëntie

De termen worden vaak door elkaar gehaald. **Capaciteitsbezetting** is een planningscijfer (hoeveel werk is op de capaciteit belast?). **Bezettingsefficiëntie** (ISO 22400) is een uitvoeringscijfer: de verhouding tussen werkelijke productietijd (APT) en werkelijke bezette eenheidstijd (AUBT) [3]. Een machine kan voor 95 % belast zijn en toch een slechte bezettingsefficiëntie hebben als een groot deel van de bezette tijd verloren gaat aan storingen en wachttijd. Voor Lijn 3 is de verhouding tussen looptijd en bezette tijd 405 ÷ 450 = 90 %, wat in dit eenvoudige geval gelijk is aan de OEE-beschikbaarheid; in fabrieken die omsteltijden en bezettingstijden afzonderlijk registreren, wijken de waarden af.

### Productiviteit

Productiviteit is de verhouding tussen output en input. In de maakindustrie meet je meestal **partiële productiviteiten**, omdat inputfactoren niet zinvol kunnen worden opgeteld.

> **Arbeidsproductiviteit = goede aantallen ÷ gewerkte arbeidsuren**

**Voorbeeld Lijn 3:** 422 goede stuks (inclusief nabewerkte) ÷ (6 operators × 8 u) = 422 ÷ 48 = **8,79 stuks per arbeidsuur**.

**Veelvoorkomende fouten:** productiviteit verwarren met een prestatieverhouding (werkelijke versus standaardoutput is een prestatie- of efficiëntieverhouding, geen productiviteit), totale in plaats van goede output tellen, en productiviteit vergelijken tussen producten met een verschillende werkinhoud. Voor fabrieken met een hoge productmix is verdiende standaarduren per aanwezige uur een beter maatstaf.

## 11. Onderhoudskpi's: MTBF, MTTR en inherente beschikbaarheid

ISO 22400 neemt MTBF en MTTR op als onderhoudskpi's [38][3]. Ze splitsen het beschikbaarheidsverlies door storingen in twee vragen: hoe vaak valt de machine uit, en hoe lang duurt het voordat hij weer draait?

> **MTBF (mean time between failures) = draaitijd ÷ aantal storingen**
> **MTTR (mean time to repair) = totale reparatietijd ÷ aantal storingen**

**Voorbeeld lijn 3, één maand:** 40 ploegen van elk 405 min draaitijd = 16.200 min; 40 storingen met samen 1.000 min.
- MTBF = 16.200 ÷ 40 = **405 min** (6,75 u)
- MTTR = 1.000 ÷ 40 = **25 min**

Hieruit kun je de **inherente (technische) beschikbaarheid** afleiden, die alleen storingen meeneemt:

> **Inherente beschikbaarheid = MTBF ÷ (MTBF + MTTR)**

405 ÷ (405 + 25) = 405 ÷ 430 = **94,2 %**. De OEE-beschikbaarheid van 90 % is lager omdat die ook de omsteltijd bevat.

**Veelgemaakte fouten:** MTTR kan alleen de reparatie meten en niet de reactietijd tot de monteur er is; bepaal welke tijd je bedoelt en meet reactie en reparatie apart. Een gemiddelde over enkele gebeurtenissen is ook sterk willekeurig; MTBF wordt pas betrouwbaar over meerdere maanden. En verwar MTBF niet met MTTF (mean time to failure), die geldt voor niet-herstelbare onderdelen; sommige hoog scorende Engelstalige pagina's vermengen beide.

## 12. Energie, veiligheid (TRIR, DART, LTIFR) en kosten per eenheid

### Energie per eenheid

In veel fabrieken is energie een kostenpost geworden die een eigen kpi verdient. ISO 22400-2 is in 2017 uitgebreid met energiekpi's [1]; voor energiemanagement beschrijft ISO 50006:2023 (tweede editie, ter vervanging van de versie uit 2014) hoe je energieprestatie-indicatoren (EnPI's) en energiebasislijnen opstelt [22][34].

> **Specifiek energieverbruik = in de periode verbruikte energie ÷ goed aantal**

**Voorbeeld lijn 3:** 1.520 kWh per ploeg ÷ 422 goede stuks = **3,60 kWh per eenheid**.

Let op de basislast: een lijn die perslucht en verwarming laat draaien terwijl hij stilstaat, lijkt per eenheid veel slechter bij lage output. Een eenvoudige regressielijn met een basislastcomponent en een volumeafhankelijke component zegt meer dan de simpele verhouding.

### Veiligheidskpi's: OSHA TRIR en DART-percentage

In een SQCDP-kpisysteem komt veiligheid op de eerste plaats. In de VS is de referentie de registratieregel van OSHA (29 CFR Part 1904). OSHA berekent incidentpercentages met één formule [42]:

> **Incidentpercentage = aantal letsels en ziekten × 200.000 ÷ gewerkte uren van werknemers**

De 200.000 is het aantal uren dat 100 werknemers werken bij 40 uur per week gedurende 50 weken per jaar [42], dus het resultaat leest als "gevallen per 100 voltijdequivalente werknemers". Twee varianten zijn standaard:

- **TRIR** (total recordable incident rate, ook total case incident rate): alle registreerbare gevallen. Registreerbare gevallen zijn arbeidsgerelateerde letsels en ziekten die leiden tot overlijden, bewusteloosheid, verzuim, beperkt werk of functieovergang, of medische behandeling die verder gaat dan eerste hulp, naast andere criteria [46].
- **DART-percentage:** alleen gevallen met verzuim, beperkte werkactiviteit of functieovergang [46].

**Voorbeeld:** 5 registreerbare gevallen, waarvan 3 DART-gevallen, in een fabriek met 420.000 gewerkte uren per jaar.
TRIR = 5 × 200.000 ÷ 420.000 = **2,38**. DART-percentage = 3 × 200.000 ÷ 420.000 = **1,43**.

Ter context: volgens het Bureau of Labor Statistics registreerde de Amerikaanse private sector in 2025 een totaal registreerbaar gevallenpercentage van 2,3 gevallen per 100 voltijdequivalente werknemers (gepubliceerd op 18 november 2026) [43]. De BLS-grafiek voor 2025 toont 2,5 gevallen per 100 voltijdwerknemers voor de maakindustrie, met 304.200 gevallen [44][43]. Dit zijn nationale gemiddelden, geen benchmarks voor uw fabriek; vergelijk met uw eigen NAICS-branche.

Los van de percentages moeten werkgevers volgens OSHA een arbeidsgerelateerd overlijden binnen 8 uur melden, en een opname in het ziekenhuis, amputatie of verlies van een oog binnen 24 uur (29 CFR 1904.39) [45].

### LTIFR en het Duitse percentage per 1.000 werknemers

Multinationale concerns gebruiken vaak ook de **LTIFR** (lost time injury frequency rate), die uitgaat van een basis van één miljoen uur in plaats van 200.000:

> **LTIFR = aantal verzuimongevallen ÷ gewerkte uren × 1.000.000**

Safe Work Australia definieert LTIFR als het aantal verzuimongevallen per miljoen gewerkte uren; een verzuimongeval is een ongeval dat leidt tot ten minste één volledige dag of ploeg verzuim [21].

**Voorbeeld:** 3 verzuimongevallen met 420.000 gewerkte uren per jaar: 3 ÷ 420.000 × 1.000.000 = **7,14**. Let op: dit is dezelfde fabriek als hierboven: een DART-percentage van 1,43 en een LTIFR van 7,14 beschrijven dezelfde drie gevallen (1,43 × 5 = 7,14) als alle drie DART-gevallen verzuim betroffen. DART telt ook gevallen met beperkt werk en functietransfer mee, die de meeste LTI-definities uitsluiten. Vermeld bij vergelijkingen tussen vestigingen altijd de basis.

Duitse fabrieken rapporteren een "1.000-werknemerspercentage": meldingsplichtige ongevallen per 1.000 fulltime-equivalenten. Een ongeval is in Duitsland meldingsplichtig als de verzekerde overlijdt of langer dan drie dagen niet kan werken (paragraaf 193, lid 1, van het Duitse Sociaal Wetboek, Boek VII) [20]. De Duitse wettelijke ongevallenverzekeringsinstelling DGUV meldde voor 2025 19,9 meldingsplichtige arbeidsongevallen per 1.000 fulltime-equivalenten, 3,2 % lager dan het jaar ervoor [19]. **Voorbeeld:** 4 meldingsplichtige ongevallen bij 250 fulltime-equivalenten geeft 4 ÷ 250 × 1.000 = **16,0**. Omdat de meldingsdrempels verschillen, kan dit percentage niet rechtstreeks met een OSHA-percentage worden vergeleken.

Vul deze achterblijvende indicatoren aan met voorlopende indicatoren, zoals gemelde bijna-ongevallen en afgeronde veiligheidsacties. Een dalend aantal gemelde bijna-ongevallen kan een waarschuwingssignaal zijn als het een zwakkere meldcultuur weerspiegelt.

### Kosten per eenheid

> **Kosten per eenheid = periodekosten ÷ aantal goede stuks**

**Voorbeeld lijn 3, één ploeg (illustratieve bedragen in US-dollar):**
- Arbeid: 6 × 8 u × $45/u = $2.160
- Machine (afschrijving, onderhoud, vloeroppervlak): 8 u × $60/u = $480
- Materiaal: 432 stuks × $4,00 = $1.728 (uitschot verbruikt ook materiaal)
- Totaal: $4.368

Kosten per eenheid = $4.368 ÷ 422 goede stuks = **$10,35 per eenheid**.

De berekening laat het verband met OEE zien: als alle 432 stuks bij de eerste keer goed zouden zijn, zouden de kosten per eenheid dalen tot $4.368 ÷ 432 = $10,11, zonder dat een van de percentages verandert. Bij vaste kosten speelt het outputvolume de hoofdrol, daarom is de kost per eenheid moeilijk te interpreteren zonder volume. Voor make-or-buy- of prijsbeslissingen heeft u ook vaste en variabele kosten afzonderlijk nodig. Hoe u verbeteringen omzet in een sterke businesscase, wordt behandeld in de post [The Business Case for Operational Excellence: How to Prove ROI](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roi-business-case/).

## 13. KPI-systemen: hiërarchie, leidende en volgende indicatoren, SQCDP

Afzonderlijke KPI's zijn metingen. Een **KPI-systeem** ordent ze zodat elk niveau de cijfers ziet die het kan beïnvloeden, en de cijfers van lagere niveaus logisch optellen tot die van hogere niveaus.

### Hiërarchie: fabriek, afdeling, lijn, werkplek

| Niveau | Typische KPI's | Ritme | Overleg |
|---|---|---|---|
| Fabriek | OTIF, kosten per eenheid, klant-PPM, TRIR, dagen voorraadbedekking | wekelijks, maandelijks | overleg fabrieksleiding |
| Afdeling | planningsnauwkeurigheid, doorlooptijd, OEE van knelpunt, schrapkosten, productiviteit | dagelijks, wekelijks | afdelingsoverleg (Tier 3) |
| Lijn | gepland vs. werkelijk aantal per uur, OEE, FPY, belangrijkste stilstandoorzaken, openstaande acties | per shift | lijnoverleg (Tier 2) |
| Werkplek/machine | aantal per uur vs. takt, storingen, microstops, kwaliteitsafwijkingen | per uur, per shift | teambriefing (Tier 1) |

De niveaus zijn verbonden door oorzaak-gevolgketens: een dalende OTIF op fabrieksniveau is via planningsnauwkeurigheid op afdelingsniveau terug te voeren tot de OEE en stilstandoorzaken van één machine. Dat is precies de keten die een [tieroverleg](https://www.m365.fm/entity/tier-meeting/) gebruikt: elk niveau bespreekt de eigen cijfers, escaleert wat het zelf niet kan oplossen en krijgt terugkoppeling van bovenaf. De gids [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) beschrijft deze routines in detail.

### Leidende en volgende indicatoren

**Volgende indicatoren** meten resultaten die al hebben plaatsgevonden: OTIF, kosten per eenheid, het schrappercentage van de maand, TRIR. Ze zijn belangrijk voor het bereiken van doelen, maar komen te laat voor tegenmaatregelen.

**Leidende indicatoren** meten de drijvende factoren die het resultaat voorspellen: planningsnauwkeurigheid van het voorliggende proces, WIP vóór het knelpunt, omsteltijd, naleving van preventief onderhoud, bijna-ongevallen, aantal per uur tegenover takt. Fabrico benadrukt terecht dat een KPI tot actie moet leiden [35]; leidende indicatoren doen dat terwijl er nog tijd is om te handelen.

Een goede vuistregel: op de lagere niveaus domineren leidende indicatoren, op fabrieksniveau volgende indicatoren. Elke volgende KPI op fabrieksniveau moet minstens één toegewezen leidende indicator op lijnniveau hebben.

### SQCDP: een structuur voor borden en overleggen

Veel fabrieken ordenen hun KPI's volgens **SQCDP**: Safety (veiligheid), Quality (kwaliteit), Cost (kosten), Delivery (levering) en People (mensen). De volgorde is bewust gekozen: veiligheid vóór kwaliteit vóór kosten. [unverified: SQCDP is een praktijkconventie, geen norm; de oorsprong ervan is niet duidelijk te documenteren.] Fabrieken gebruiken ook varianten met een andere volgorde of zonder People (bijvoorbeeld SQDC).

| Categorie | Lijn 3, voorbeeld-KPI's |
|---|---|
| S | letsels en bijna-ongevallen van de shift, openstaande veiligheidsacties |
| Q | FPY 94,9 %, schrappercentage 2,31 %, klachten van klanten |
| C | kosten per eenheid $10,35, energie 3,60 kWh/eenheid |
| D | plan 450 / werkelijk 422 goede stuks, OEE 75,9 %, planningsnauwkeurigheid |
| P | aanwezigheid, vaardighedenmatrix, doorgevoerde verbeteridealen |

De categorieën voorkomen een eenzijdige fixatie op output. Als je alleen output meet, krijg je output ten koste van kwaliteit en veiligheid.

## 14. Gegevensverzameling en datakwaliteit

De beste formule is nutteloos als de invoergegevens onjuist zijn. In de praktijk mislukken KPI-projecten vaker door de data dan door de methode.

### Vergelijking van methoden voor gegevensverzameling

| Methode | Beschrijving | Sterke punten | Zwakke punten |
|---|---|---|---|
| Handmatig (telblad, ploegenlogboek, Excel) | operators noteren aantallen en stilstanden | snel te starten, bouwt bewustzijn op, geen IT nodig | micro-stops worden gemist, afronding, invoer achteraf, veel inspanning |
| Productiedataterminals | terminals voor start/stop van orders, hoeveelheden, stilstandredenen | gestructureerde redenen, ordercontext | afhankelijk van discipline bij het boeken |
| Machinedataverzameling | signalen van de besturing (draaien, stilstand, teller) | volledige tijden, korte stops inbegrepen | redenen ontbreken zonder invoer van de operator |
| MES | integreert productie- en machinedata, kwaliteit- en ordercontrole; KPI's volgens ISO 22400, ISA-95 niveau 3 (VDMA 66412-1 in Duitsland) | consistente definities, realtime | implementatie-inspanning, onderhoud van stamdata |
| IoT-retrofit | sensoren en gateways op bestaande machines, data in een cloudplatform | werkt voor oude machines, schaalbaar | context (order, product) moet worden toegevoegd |

De pragmatische route is een combinatie: machinesignalen leveren tijden en aantallen, operators voegen aan een terminal de reden van een stilstand en kwaliteitsbeslissingen toe. Muchiri en Pintelon noemen de nauwkeurigheid van gegevensverzameling als een van de grootste uitdagingen van OEE-meting [7]. Hoe machines, MES en de cloud technisch met elkaar worden verbonden, wordt behandeld in de gids [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/).

### Vijf regels voor betrouwbare KPI's

1. **Eén tijdmodel voor iedereen.** Bepaal welke tijden tot de geplande productietijd behoren (pauzes? onderhoud? proefdraaien? geen orders?). ISO 22400-2 en VDMA 66412-1 bieden een sjabloon [1][4].
2. **Eén catalogus van stilstandredenen met maximaal twee niveaus.** Te veel redenen leiden tot "overig", te weinig tot betekenisloze Pareto-analyses. Koppel elke reden duidelijk aan één OEE-verliescategorie.
3. **Onderhoud ideale cyclustijden.** De OEE-prestatie hangt volledig af van deze stamdata. Een te ruime norm leidt tot een prestatie boven 100 % of verbergt verliezen.
4. **Automatiseer plausibiliteitscontroles.** FPY + herwerk + uitval = 100 %; draaitijd ≤ geplande tijd; prestatie ≤ 100 %; som van stilstanden ≤ ploegduur.
5. **Maak de definitie zichtbaar.** Elke KPI heeft een KPI-definitieblad met doel, formule, gegevensbron, eigenaar, frequentie en streefwaarde.

### Het KPI-definitieblad

| Veld | Voorbeeld: OEE Lijn 3 |
|---|---|
| Doel | de verliezen van de knelpuntmachine zichtbaar maken en prioriteren |
| Formule | beschikbaarheid × prestatie × kwaliteit; controle via goed aantal × ideale cyclustijd ÷ geplande tijd |
| Gegevensbron | machinedata (draaien/stilstand, teller), terminal (stilstandreden, uitval, herwerk) |
| Definities | geplande tijd = ploegduur minus pauzes; omstelling telt als beschikbaarheidsverlies; herwerk telt als kwaliteitsverlies |
| Eigenaar | ploegleider Lijn 3 |
| Frequentie | per ploeg, wekelijkse trend |
| Streefwaarde | 80 % tegen eind Q2 (uitgangspunt 75,9 %, zie hoofdstuk 16) |
| Escalatie | twee opeenvolgende ploegen onder 70 % → overleg Tier 2 |

## 15. Visualisatie: shopfloorborden en Power BI-dashboards

### Het shopfloorbord

Bij de werkplek is leesbaarheid in enkele seconden belangrijker dan volledigheid. [Visueel management](https://www.m365.fm/entity/visual-management/) betekent hier: gepland en werkelijk per uur, een duidelijk rood/groen ten opzichte van het doel, de drie belangrijkste stilstandoorzaken en een actielijst met eigenaren en uiterste data. Uur-voor-uur-borden werken goed: het team voert per uur het geplande en werkelijke aantal in (Lijn 3: 60 stuks in elk volledig productie-uur bij een takttijd van 60 s, dienovereenkomstig minder in uren met een pauze) en geeft meteen een korte reden voor elke afwijking. Hoe flow en het bord samenkomen, wordt beschreven in de post [Shop Floor Optimization: Ways to Improve Flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/).

Digitale borden vervangen het whiteboard niet automatisch. Ze lonen wanneer gegevens al automatisch worden vastgelegd, wanneer meerdere ploegen of locaties dezelfde weergave nodig hebben en wanneer acties gevolgd moeten worden. De teamdiscussie blijft hetzelfde.

### Power BI-dashboard: structuur

Voor het niveau van afdeling en fabriek is Power BI een voor de hand liggend hulpmiddel als het bedrijf al Microsoft 365 gebruikt. Een beproefde driepaginastructuur:

1. **Overzicht (fabriek):** SQCDP-tegels met werkelijk, doel en trend; verkeerslichten alleen waar een doel is vastgelegd.
2. **Lijn:** OEE als waterfall van geplande tijd via de zes verliescategorieën naar waardetoevoegende tijd; Pareto van stilstandoorzaken; FPY en uitval in de tijd.
3. **Detail en acties:** tabellen per ploeg en order met drill-through, gekoppeld aan de actielijst.

Voor doelen, check-ins en eigenaren biedt Power BI ook scorecards met doelen. Volgens Microsoft is het maken en delen van scorecards een Pro-functie; bekijken is mogelijk met een Pro-licentie of als gratis gebruiker in een werkruimte op Premium- of Fabric F64-capaciteit of groter [29].

### Datamodel: sterschema

Microsoft beveelt voor Power BI een sterschema aan: dimensietabellen beschrijven zakelijke entiteiten en worden gebruikt voor filteren en groeperen, feitentabellen slaan gebeurtenissen op en worden gebruikt voor aggregatie [27]. Voor productie-KPI's betekent dat:

| Tabel | Type | Inhoud (voorbeeldkolommen) |
|---|---|---|
| FactProduction | feit | Datum, ShiftID, LineID, ProductID, PlannedMin, BreakdownMin, ChangeoverMin, TotalQty, GoodFirstPass, Rework, Scrap, IdealCycleSec |
| FactDowntime | feit | Start, End, DurationMin, LineID, ReasonID |
| DimDate | dimensie | Datum, Week, Maand, Werkdag ja/nee |
| DimShift | dimensie | ShiftID, Naam, Start, End |
| DimLine | dimensie | LineID, Lijn, Gebied, Fabriek |
| DimProduct | dimensie | ProductID, Product, ProductFamilie |
| DimDowntimeReason | dimensie | ReasonID, Reden, LossCategory (storing, omstelling, microstops …) |

De kolom LossCategory in de redendimensie is de sleutel tot de verliescascade: ze koppelt elke stilstandoorzaak aan een van de zes grote verliezen.

### DAX-voorbeeld: OEE correct aggregeren

De volgende measures berekenen OEE zo dat deze op elk niveau correct optelt (ploeg, lijn, week, fabriek), omdat ze is opgebouwd uit gesommeerde tijden in plaats van gemiddelden. `DIVIDE` geeft BLANK in plaats van een fout wanneer de noemer nul is [25]; Microsoft raadt de functie aan wanneer de noemer nul of leeg kan zijn, en de `/`-operator wanneer de noemer een constante is [26].

```dax
Planned Min =
SUM ( FactProduction[PlannedMin] )

Run Min =
[Planned Min]
    - SUM ( FactProduction[BreakdownMin] )
    - SUM ( FactProduction[ChangeoverMin] )

Ideal Min =
SUMX (
    FactProduction,
    FactProduction[TotalQty] * FactProduction[IdealCycleSec] / 60
)

Value Adding Min =
SUMX (
    FactProduction,
    FactProduction[GoodFirstPass] * FactProduction[IdealCycleSec] / 60
)

Availability =
DIVIDE ( [Run Min], [Planned Min] )

Performance =
DIVIDE ( [Ideal Min], [Run Min] )

Quality (time-weighted) =
DIVIDE ( [Value Adding Min], [Ideal Min] )

OEE =
DIVIDE ( [Value Adding Min], [Planned Min] )
```

**Waarom kwaliteit hier tijdgewogen is:** voor één product is `Value Adding Min ÷ Ideal Min` identiek aan goed aantal ÷ totaal aantal. Bij meerdere producten met verschillende ideale tijden weegt deze vorm elk stuk naar zijn ideale tijd. Alleen dan geldt beschikbaarheid × prestatie × kwaliteit = OEE exact op elk aggregatieniveau, omdat looptijd en ideale tijd tegen elkaar wegvallen. Een stukgebaseerde kwaliteitsratio is een nuttige aanvullende measure, maar hoort niet in de OEE-vermenigvuldiging thuis.

**Controle met Lijn 3:** geplande tijd 450, looptijd 405, ideale tijd 432 × 50 ÷ 60 = 360, waardetoevoegende tijd 410 × 50 ÷ 60 = 341,67 min. Beschikbaarheid 90,0 %, prestatie 88,9 %, kwaliteit 94,9 %, OEE 341,67 ÷ 450 = 75,9 %. De maatstaven reproduceren de handmatige berekening uit Sectie 7.

Nog een maatstaf voor de takttijdcontrole:

```dax
Effective Cycle Time per Good Part Sec =
DIVIDE (
    [Planned Min] * 60,
    SUM ( FactProduction[GoodFirstPass] )
)
```

Voor Lijn 3 levert dat 27.000 ÷ 410 = 65,9 s op, boven de takttijd van 60 s.

De kwaliteits-KPI's uit Sectie 8 volgen hetzelfde patroon:

```dax
FPY =
DIVIDE (
    SUM ( FactProduction[GoodFirstPass] ),
    SUM ( FactProduction[TotalQty] )
)

Scrap Rate =
DIVIDE (
    SUM ( FactProduction[Scrap] ),
    SUM ( FactProduction[TotalQty] )
)

Rework Rate =
DIVIDE (
    SUM ( FactProduction[Rework] ),
    SUM ( FactProduction[TotalQty] )
)

Quality Sum Check =
[FPY] + [Scrap Rate] + [Rework Rate]
```

`Quality Sum Check` moet gelijk zijn aan 100 %; voorwaardelijke opmaak die afwijkingen rood markeert, maakt ontbrekende transacties direct zichtbaar.

**Twee valkuilen voor Power BI-ontwikkelaars:**
- **Stilstand dubbel tellen.** Als minuten van storingen en omstellingen zowel in `FactProduction` als in `FactDowntime` zijn opgeslagen, bereken dan de looptijd uit slechts één van beide tabellen. De meest robuuste aanpak is `FactProduction` op het niveau van ploeg, lijn en product te houden en de stilstandminuten daar in Power Query uit `FactDowntime` te aggregeren.
- **Granulariteit van geplande tijd.** Als er per ploeg meer dan één product draait, moet de geplande tijd over de producten worden verdeeld (bijvoorbeeld op basis van orderstart en -einde). Als de volledige ploegtijd in elke productrij staat, wordt die bij optelling meerdere keren geteld.

### Licentienotities

Volgens Microsoft Learn (pagina bijgewerkt op 24 augustus 2026): gebruikers met een gratis licentie kunnen rapporten maken voor eigen gebruik, maar kunnen deze niet delen. Publiceren en delen vereist Power BI Pro. Gratis gebruikers kunnen gedeelde inhoud alleen bekijken als die in een werkruimte staat op Power BI Premium-capaciteit of Fabric-capaciteit F64 of groter. Met Premium Per User (PPU) kan inhoud alleen worden gedeeld met andere PPU-gebruikers, tenzij die in een Premium-capaciteit staat [28]. Voor een dashboard op de productievloer dat veel supervisors alleen lezen, is licentiering daarom een architectuurbeslissing. Controleer de actuele prijzen en voorwaarden bij Microsoft; die worden hier bewust niet vermeld.

## 16. Hoe stel je KPI-doelen vast

Doelen zijn de plek waar KPI's het vaakst schade aanrichten. Drie principes helpen.

**1. Start vanuit je eigen uitgangspunt, niet vanuit een benchmark.** Meet minimaal vier tot acht weken zorgvuldig voordat je een doel vaststelt. Lijn 3 met 75,9 % OEE heeft weinig aan een wereldklasse-doel van 85 % zolang niemand weet welk verlies het eerst moet worden aangepakt.

**2. Leid doelen af uit de vraag.** In het voorbeeld volgt het doel rechtstreeks uit de klant: voor 450 goede onderdelen per shift heeft Lijn 3 een OEE van 83,3 % nodig als alleen goede onderdelen bij de eerste keer tellen (Sectie 7). Een verstandig tussendoel is 80 %; dat is 4,1 procentpunt verwijderd. Rekenkundig komt dit neer op (0,800 − 0,759) × 450 min = ongeveer 18,3 min waardetoevoegende tijd per shift, bijvoorbeeld door minder microstops (30 min potentieel) of kortere omsteltijden (8 min potentieel via SMED).

**3. Gebruik doelbanden in plaats van puntwaarden bij KPI's met afwegingen.** Bezetting, WIP en dagen voorraad volgen niet de regel "hoe hoger, hoe beter". Een band (bijvoorbeeld dagen voorraad 2 tot 3 dagen) voorkomt dat een team de voorraad zo ver terugbrengt dat de levering eronder lijdt. Drees en Sack beschrijven precies deze spanning tussen voorraadreductie, benutting van middelen, leverprestatie en doorlooptijdreductie voor waardestroom-KPI's [32].

**Over externe benchmarks:** branchewaarden voor OEE, uitval of MTTR die op veel leveranciverswebsites worden genoemd, komen meestal uit eigen klantdata zonder openbare methode [37]. Gebruik ze hooguit als grove oriëntatie, nooit als doel. Uitzondering zijn officiële statistieken met gepubliceerde methode, zoals de BLS-letselpercentages per NAICS-branche [43].

## 17. Veelgemaakte fouten en hoe je ze voorkomt

| Fout | Gevolg | Tegenmaatregel |
|---|---|---|
| KPI-overload: 30 KPI's op het bord | niemand weet wat ertoe doet; overleggen worden colleges | 5 tot 8 KPI's per niveau, gesorteerd op SQCDP |
| KPI zonder definitie | elke afdeling rekent anders; vergelijkingen zijn waardeloos | definitieblad, begrippen volgens ISO 22400 (VDMA 66412-1 in Duitsland) |
| Percentages middelen | vertekende fabriek-OEE | KPI's op elk niveau herberekenen uit sommen |
| KPI als individuele prestatiebeoordeling | datamanipulatie, verborgen storingen | KPI's voor processen, niet voor personen |
| Doel zonder pad | frustratie, opgepoetste cijfers | elk doel onderbouwd met verliesanalyse en actieplan |
| Alleen achterlopende indicatoren | tegenmaatregelen komen te laat | bij elke achterlopende indicator een voorlopende indicator koppelen |
| Te ruime standaardtijden | prestatie boven 100 % of verborgen verliezen | ideale tijden technisch onderbouwen en jaarlijks herzien |
| Data zonder vaste routine | dashboard wordt na drie maanden niet meer geopend | vaste overlegmomenten met KPI's als agenda |
| Veiligheidscijfers met verschillende basis vergelijken | TRIR, DART, LTIFR en Duitse cijfers door elkaar gehaald | altijd formule en basis vermelden (200.000 uur, 1 miljoen uur, 1.000 fte) |

### De wet van Goodhart

In 1975 merkte de Britse econoom Charles Goodhart op dat elke waargenomen statistische regelmatigheid de neiging heeft in elkaar te storten zodra er druk op wordt gezet voor bestuurlijke doeleinden [24]. De antropoloog Marilyn Strathern vatte dit in 1997 samen in de bekende zin: "Wanneer een maatstaf een doel wordt, houdt hij op een goede maatstaf te zijn" [23]. Op de werkvloer ziet dat er zo uit: als OEE aan bonussen wordt gekoppeld, worden omsteltijden vermeden (grotere batches, meer voorraad), worden stilstanden als "gepland" geboekt, of worden standaardtijden opgerekt. De KPI stijgt; de fabriek wordt er niet beter van.

Drie tegengiffen: bekijk een KPI altijd samen met een tegen-KPI (OEE met voorraad en OTIF), beheer definities centraal en registreer wijzigingen, en gebruik KPI's in overleggen als aanleiding om vragen te stellen, niet als oordeel.

## 18. Stappenplan: manufacturing-KPI's binnen 90 dagen uitrollen

Het volgende stappenplan werkt als kader voor een lijn of een afdeling. Het vereist geen software; software versnelt fase 2 en 3.

**Fase 1, weken 1 tot 3: doel en definities**
- Verduidelijk de doelen van de afdeling (wat wil de klant? waar liggen de grootste verliezen?).
- Selecteer 5 tot 8 KPI's, minstens één per SQCDP-categorie.
- Definieer het tijdsmodel, de catalogus met stilstandsredenen en de definitiebladen; controleer de ideale cyclustijden.

**Fase 2, weken 4 tot 8: meten en leren**
- Start de dataverzameling, handmatig of waar nodig eerst semi-automatisch.
- Controleer de plausibiliteit dagelijks; scherp definities aan waar vragen ontstaan.
- Stel baselines vast over minstens vier weken.

**Fase 3, weken 9 tot 12: sturen**
- Leid doelen af uit vraag en baseline.
- Bouw het bord en, waar zinvol, een Power BI-rapport.
- Richt tier-routines in: Tier 1 per shift, Tier 2 dagelijks, Tier 3 wekelijks.
- Kies de eerste verbeteronderwerpen uit de verliesparetos en werk ze uit met PDCA.

**Daarna:** controleer elk kwartaal of elke KPI nog een beslissing stuurt. KPI's die niemand gebruikt, worden afgeschaft. Het inbedden van KPI's in een breder verbeteringssysteem komt aan bod in de gidsen [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) en [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/). Doelen voor het knelpunt voeden ook rechtstreeks de planning, zie [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

## 19. KPI's uit waardestroommodellering: iFAKT Polaris

> **Opmerking: de auteur werkt bij iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), gevestigd in Stuttgart, Duitsland, ontwikkelt software voor het plannen en optimaliseren van logistieke en productieprocessen op basis van Microsoft-technologie [33]. Het bedrijf werkt al lange tijd aan KPI's: in 2011 lieten Jörg Drees en Christoph Sack in het Duitse vakblad ZWF (Zeitschrift für wirtschaftlichen Fabrikbetrieb) zien dat waardestroom-KPI's gemakkelijk in conflict komen tussen voorraadreductie, resultaat van middelen, leverbetrouwbaarheid en doorlooptijdverkorting, en dat een bewust gekozen KPI-set in combinatie met lean-methoden duurzame regelkringen mogelijk maakt [32].

Volgens de leverancier omvat de softwarefamilie [iFAKT Polaris](https://www.m365.fm/entity/polaris/) Value Stream Mapping, Business Swim Lane Mapping, Designer, Simulator, Optimizer, Operator en Analyzer [31]. Twee daarvan zijn relevant voor manufacturing-KPI's:

- **[Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)** brengt volgens ifakt.de KPI's uit alle Polaris-modules samen in gestructureerde dashboards, visualiseert doorlooptijden, benutting, knelpunten en projectstatus, toont capaciteitsgrenzen en verbeterpotentieel, en vergelijkt scenario's, plannen en werkelijke prestaties [30]. De productpagina van de leverancier geeft geen informatie over integraties, implementatiemodel of prijzen.
- **Polaris VSM** berekent volgens de leverancier lean-KPI's zoals doorlooptijd, cyclustijd, WIP, toegevoegdewaardeverhouding en flowfactor automatisch uit het waardestroommodel, biedt dashboards voor doorlooptijd, WIP, toegevoegdewaardeverhouding en OEE, en vergelijkt scenario-KPI's naast elkaar [31].

**Beoordeling:** zo'n tool vervangt noch heldere definities, noch de overlegroutine. De waarde ligt in het consistent berekenen van KPI's uit één model en het vergelijken van scenario's vóór implementatie, bijvoorbeeld het effect van een WIP-limiet op doorlooptijd en OTIF. Of het bij uw fabriek past, moet worden gecontroleerd zoals bij elke andere oplossing: aan de hand van uw gegevens, uw IT-landschap en de beslissingen die de KPI's moeten ondersteunen. Meer over de productfamilie staat in de gids [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/).

## 20. Woordenlijst

| Term | Uitleg |
|---|---|
| Beschikbaarheid (OEE) | draaitijd ÷ geplande productietijd [7] |
| Cyclustijd | gemeten tijd om één eenheid bij een proces af te ronden [10] |
| DART-rate | OSHA-rate van gevallen met verzuim, beperkt werk of functieoverdracht per 100 FTE [42][46] |
| Dagen voorraad | voorraad ÷ gemiddeld dagelijks verbruik |
| Effectiviteit (ISO 22400) | komt overeen met OEE-prestatie: geplande draaitijd per artikel × aantal ÷ werkelijke productietijd [3] |
| Doorlooptijdfactor | doorlooptijd ÷ bewerkingstijd (Wiendahl) [14][15] |
| FPY | first pass yield, aandeel eenheden die goed zijn zonder herwerk of afkeur [36] |
| ISA-95 | ANSI/ISA-95 (IEC 62264); niveau 3 = beheer van productiebewerkingen [40] |
| Achterlopende indicator | KPI die een resultaat meet dat al heeft plaatsgevonden |
| Doorlooptijd | tijd van start tot einde van een order, inclusief alle wacht-, wachtrij- en transporttijd [10][15] |
| Vooruitlopende indicator | KPI die een toekomstig resultaat voorspelt |
| Wet van Little | L = λW: gemiddelde WIP = doorvoer × gemiddelde doorlooptijd [13] |
| Belasting | geplande productietijd ÷ kalendertijd; factor van TEEP [8] |
| MES | manufacturing execution system; ISA-95 niveau 3 [40]; KPI-richtlijn VDMA 66412-1 in Duitsland [4] |
| MTBF / MTTR | gemiddelde draaitijd tussen storingen / gemiddelde hersteltijd |
| OEE | beschikbaarheid × prestatie × kwaliteit [7] |
| Bewerkingstijd | insteltijd plus verwerkingstijd van een werkstap (Wiendahl) [14][15] |
| Ordertijd (REFA) | insteltijd plus draaitijd (aantal × tijd per eenheid) [16][17] |
| OTIF | on time in full; geen standaarddefinitie [18] |
| PPM | parts per million, defecten genormaliseerd naar één miljoen [36] |
| SMED | omsteltechniek die streeft naar minder dan tien minuten [11] |
| SQCDP | Safety, Quality, Cost, Delivery, People: ordeningsschema voor KPI's |
| Takttijd | beschikbare tijd ÷ klantvraag [9] |
| TEEP | OEE × belasting [8] |
| TRIR | OSHA total recordable incident rate: registreerbare gevallen × 200.000 ÷ gewerkte uren [42] |
| WIP | work in process (werk in uitvoering) |

## 21. FAQ: productie-KPI's

**Wat zijn productie-KPI's?**
Productie-KPI's zijn maatstaven die de tijd, output, kwaliteit, levering, kosten en veiligheid van een productiebedrijf kwantificeren, bijvoorbeeld takttijd, OEE, afkeurpercentage of OTIF. Elke KPI heeft een definitie, formule, eenheid en tijdsperiode nodig.

**Wat is het verschil tussen een KPI en een metriek?**
Elke KPI is een metriek, maar niet elke metriek is een KPI. Een KPI is direct gekoppeld aan een doel en stuurt regelmatig beslissingen aan, zoals OTIF of de OEE van het knelpunt. Het aantal geproduceerde onderdelen is een metriek; op zichzelf leidt dat zelden tot een actie.

**Wat zijn de belangrijkste KPI's in de productie?**
Voor de meeste fabrieken volstaat een basisset: OEE van het knelpunt, FPY of afkeurpercentage, OTIF, doorlooptijd of WIP, kosten per eenheid en een veiligheidsmaatstaf zoals TRIR. Welke KPI's "het belangrijkst" zijn, hangt af van waar uw grootste verliezen zitten.

**Wat zijn de 5 belangrijkste prestatie-indicatoren in de productie?**
Er bestaat geen officiële top vijf. Een praktische set dekt één KPI per SQCDP-categorie: TRIR (veiligheid), first pass yield (kwaliteit), kosten per eenheid (kosten), OTIF (levering) en een people-maatstaf zoals doorgevoerde verbeteridealen, plus OEE van het knelpunt.

**Hoe berekent u de takttijd?**
Takttijd = beschikbare productietijd ÷ klantvraag. Voorbeeld: 450 min (27.000 s) beschikbare tijd per shift en een vraag van 450 eenheden geven 60 s per eenheid. Trek pauzes af, maar niet ongeplande stilstand.

**Wat is het verschil tussen takttijd en cyclustijd?**
De takttijd komt uit de klantvraag en geeft aan hoe vaak een onderdeel gereed moet zijn. De cyclustijd wordt bij het proces gemeten en geeft aan hoe vaak een onderdeel daadwerkelijk gereed komt. De cyclustijd moet met een reserve onder de takttijd liggen.

**Hoe berekent u de productiedoorlooptijd?**
Rechtstreeks als tijdstip van gereedmelding min tijdstip van start per order, of indirect met de wet van Little: gemiddelde WIP ÷ gemiddelde doorvoer. 2.700 onderdelen WIP bij een dagelijkse doorvoer van 900 onderdelen geeft 3 werkdagen.

**Hoe berekent u OEE?**
OEE = beschikbaarheid × prestatie × kwaliteit. Met 90 % beschikbaarheid, 88,9 % prestatie en 94,9 % kwaliteit is de OEE 75,9 %. Controle: goed aantal × ideale cyclustijd ÷ geplande productietijd.

**Wat is een goede OEE-score?**
85 % wordt vaak genoemd als "wereldklasse" en wordt herleid tot Nakajima, maar het cijfer is omstreden en hangt af van de branche [8]. Een beter doel is er een dat is afgeleid van uw eigen uitgangssituatie en de klantvraag.

**Hoe bereken je de uitvalpercentage?**
Uitvalpercentage = aantal uitval ÷ totaal aantal × 100 %. 10 uitgevallen stuks op 432 geproduceerde stuks geven 2,31 %.

**Wat is het verschil tussen uitvalpercentage en first pass yield?**
Het uitvalpercentage telt alleen de stukken die uiteindelijk worden afgekeurd. De FPY telt alleen de stukken die zonder enige correctie goed waren, dus ook zonder nabewerking. FPY, nabewerkingspercentage en uitvalpercentage tellen samen op tot 100 %.

**Wat betekent OTIF?**
On time in full: het aandeel leveringen of orderregels dat op tijd en compleet bij de klant aankomt. Er is geen standaarddefinitie; je moet zelf de referentiedatum, tolerantie en het niveau vaststellen [18].

**Hoe bereken je de TRIR?**
TRIR = aantal OSHA-registreerbare gevallen × 200.000 ÷ totaal gewerkte uren [42]. 5 registreerbare gevallen bij 420.000 uur geven 2,38. De 200.000 staat voor 100 voltijdmedewerkers die 40 uur per week en 50 weken per jaar werken.

**Wat is het verschil tussen capaciteitsbezetting en bezettingsefficiëntie?**
Capaciteitsbezetting is een planningscijfer (belasting ten opzichte van capaciteit). Bezettingsefficiëntie meet tijdens de uitvoering hoeveel van de bezette tijd daadwerkelijk productief was. Een hoge bezetting is op zich geen doel, omdat de doorlooptijden sterk stijgen wanneer de capaciteitsgrens wordt benaderd.

**Hoeveel KPI's moet een fabriek bijhouden?**
Vijf tot acht KPI's per managementniveau, gerangschikt naar SQCDP, waarbij elke achterlopende indicator is gekoppeld aan een voorlopende indicator. Meer KPI's verhogen de inspanning voor gegevensverzameling zonder de beheersing te verbeteren.

**Welke norm definieert productie-KPI's?**
ISO 22400-2:2014 definieert KPI's voor het beheer van productieprocessen, met formules, eenheden en timing [1]. ISA-95 definieert de Level 3-context waarin ze worden berekend [40]; in Duitsland wordt ook de VDMA-richtlijn 66412-1 over MES-KPI's veel gebruikt [4].

**Kan ik productie-KPI's bouwen in Power BI?**
Ja. Belangrijk zijn een sterrenschema met feit- en dimensietabellen [27] en measures die KPI's berekenen uit gesommeerde tijden. Delen vereist Power BI Pro; kijkers zonder Pro-licentie hebben content nodig op Premium- of Fabric F64-capaciteit of groter [28].

**Wat zijn MTBF en MTTR?**
MTBF is de gemiddelde draaitijd tussen twee storingen, MTTR de gemiddelde tijd om de machine te herstellen. 16.200 min draaitijd en 40 storingen met een totale duur van 1.000 min geven een MTBF van 405 min en een MTTR van 25 min.

## 22. Conclusie

Productie-KPI's zijn geen doel op zich. Hun waarde zit in drie zaken: een eenduidige definitie op basis van ISO 22400-2 (en ISA-95 voor de systeemcontext), een betrouwbare databasis uit machinesignalen en invoer door operators, en een routine waarin afwijkingen leiden tot vragen en acties. Het voorbeeld van Lijn 3 laat zien hoe nauw de KPI's met elkaar samenhangen: een cyclustijd onder de takt garandeert de levering niet zolang storingen, omsteltijden en kwaliteitsverliezen de OEE naar 75,9 % drukken; de ontbrekende 28 stuks per shift zijn terug te voeren op afzonderlijke verliescategorieën en minuten. Begin met enkele KPI's, bereken ze op elk niveau uit sommen, stel doelen op basis van de klantvraag, geef veiligheid voorrang met een correct berekende kengetal, en behandel elke KPI als aanleiding voor een gesprek op de gemba.

### Verder lezen op m365.fm

- Gidsen: [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) · [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) · [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) · [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) · [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) · [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) · [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- Blog: [Shop Floor Optimization: Ways to Improve Flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/) · [The Business Case for Operational Excellence: How to Prove ROI](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roi-business-case/)
- Begrippen: [Takt Time](https://www.m365.fm/entity/takt-time/) · [Cycle Time](https://www.m365.fm/entity/cycle-time/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Setup Time](https://www.m365.fm/entity/setup-time/) · [Micro Stops](https://www.m365.fm/entity/micro-stops/) · [Scrap Rate](https://www.m365.fm/entity/scrap-rate/) · [Key Performance Indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [SMED](https://www.m365.fm/entity/smed/) · [Shop Floor Management](https://www.m365.fm/entity/shop-floor-management/) · [Visual Management](https://www.m365.fm/entity/visual-management/) · [Tier Meeting](https://www.m365.fm/entity/tier-meeting/) · [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is de host van m365.fm en werkt bij [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) in Stuttgart, Duitsland. Op m365.fm schrijft hij over lean manufacturing, productiekpi's, value stream-methoden en de digitalisering van de productie met Microsoft 365, Power BI en Azure. Zijn focus ligt op hoe KPI's gedefinieerd en gevisualiseerd kunnen worden, zodat ze leiden tot beslissingen op de werkvloer.

**Let op: de auteur werkt bij iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Sources [1] to [39] keep the German numbering; [35], [36] and [38] now point to English sources, and [40] to [47] were added for the US version. All new or replaced sources were verified online.

1. ISO 22400-2:2014 Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions. Edition 1, 2014-01; status "to be revised"; Amendment 1:2017 "Key performance indicators for energy management". https://www.iso.org/standard/54497.html
2. Rother, M.; Shook, J.: 6 Guidelines for Moving Toward a Lean Value Stream. Lean Enterprise Institute, The Lean Post, October 19, 2022. https://www.lean.org/the-lean-post/articles/6-guidelines-for-moving-toward-a-lean-value-stream/
3. Kang, N.; Zhao, C.; Li, J.; Horst, J. A.: A Hierarchical structure of key performance indicators for operation management and continuous improvement in production systems. International Journal of Production Research 54 (21), 2016, pp. 6333–6350. NIST version: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=919754
4. VDMA 66412-1:2009-10 Manufacturing Execution Systems (MES) – Kennzahlen (KPIs). 36 pages; amended by VDMA 66412-1/A1:2010-05. DIN Media: https://6sku3uaup9f9.din.de/en/technical-rule/vdma-66412-1/122410632
5. Schließmann, A.; Strahlberger, M.: Kennzahlen und Prozessgrößen wohl definiert. MES-Kennzahlen basierend auf Maschinenzuständen (well-defined KPIs: MES KPIs based on machine states). ZWF 109 (7–8), 2014, pp. 549–551. DOI: 10.3139/104.111180. https://www.degruyterbrill.com/document/doi/10.3139/104.111180/html
6. Nakajima, S.: Introduction to TPM: Total Productive Maintenance. Productivity Press, Cambridge (MA) 1988, ISBN 978-0-915299-23-2 (bibliographic data per [8]).
7. Muchiri, P.; Pintelon, L.: Performance measurement using overall equipment effectiveness (OEE): literature review and practical application discussion. International Journal of Production Research 46 (13), 2008, pp. 3517–3535. DOI: 10.1080/00207540601142645. https://scispace.com/pdf/performance-measurement-using-overall-equipment-3udssbfefm.pdf
8. Overall equipment effectiveness. Wikipedia (English), with references to Nakajima 1982/1988/1989 and Hartmann 1992 (TEEP). https://en.wikipedia.org/wiki/Overall_equipment_effectiveness
9. Takt Time (lexicon term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/takt-time/
10. Cycle Time (lexicon term, with lead time, processing time, value-creating time, effective machine cycle time). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/cycle-time/
11. Single Minute Exchange of Die (lexicon term). Lean Enterprise Institute, referring to Shingo, S.: A Revolution in Manufacturing: The SMED System. Productivity Press, 1985. https://www.lean.org/lexicon-terms/single-minute-exchange-of-die/
12. Rother, M.; Shook, J.: Learning to See: Value Stream Mapping to Create Value and Eliminate Muda. Lean Enterprise Institute, Brookline (MA) 1998 (Shingo Research Prize 1999); current edition LEI 2018. https://www.lean.org/store/workbooks/learning-to-see/
13. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (3), 1961, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://ideas.repec.org/a/inm/oropre/v9y1961i3p383-387.html
14. Nyhuis, P.; Wiendahl, H.-P.: Logistische Kennlinien. Grundlagen, Werkzeuge und Anwendungen. 3rd ed., Springer, Berlin/Heidelberg 2012 (VDI-Buch), ISBN 978-3-540-92838-6 (English edition: Fundamentals of Production Logistics: Theory, Tools and Applications, Springer, Berlin/Heidelberg 2009, ISBN 978-3-540-34210-6). Sample (table of contents and abbreviations): https://lesejury.de/media/samples/393/9783540928393_leseprobe.pdf · Chapter "Zusammenfassung und Ausblick": https://rd.springer.com/content/pdf/10.1007%2F978-3-540-92839-3_10.pdf
15. Durchlaufzeit. Wikipedia (German), referring to Wiendahl, H.-P.: Fertigungsregelung. Hanser, Munich 1997, ISBN 3-446-19084-8. https://de.wikipedia.org/wiki/Durchlaufzeit
16. REFA (ed.): Lexikon der Betriebsorganisation. Carl Hanser, Munich 1993, ISBN 3-446-17523-7, p. 195 (bibliographic data per [17]).
17. Auftragszeit. Wikipedia (German). https://de.wikipedia.org/wiki/Auftragszeit
18. Davies, A.; Lal, S.; Perez, F.; Potdar, S.: Defining 'on-time, in-full' in the consumer sector. McKinsey & Company, June 13, 2019. https://www.mckinsey.com/capabilities/operations/our-insights/defining-on-time-in-full-in-the-consumer-sector
19. DGUV: Unfallrisiko bei der Arbeit 2025 erneut gesunken (workplace accident risk fell again in 2025). Press release, September 22, 2026. https://dguv.de/de/mediencenter/pm/pressearchiv/2026/quartal_3/details_3_713348.jsp
20. Section 193 SGB VII (German Social Code, Book VII): employer's duty to report an insured event. https://www.gesetze-im-internet.de/sgb_7/__193.html
21. Lost time injury frequency rates (LTIFR). Safe Work Australia. https://data.safeworkaustralia.gov.au/node/33
22. ISO 50006:2023 Energy management systems – Evaluating energy performance using energy performance indicators and energy baselines. https://www.iso.org/standard/79367.html
23. Strathern, M.: 'Improving ratings': audit in the British University system. European Review 5 (3), 1997, pp. 305–321. DOI: 10.1002/(SICI)1234-981X(199707)5:3<305::AID-EURO184>3.0.CO;2-4
24. Goodhart, C.: Problems of Monetary Management: The UK Experience. Papers in Monetary Economics, Vol. 1, Reserve Bank of Australia, Sydney 1975 (bibliographic data per https://en.wikipedia.org/wiki/Goodhart%27s_law).
25. DIVIDE function (DAX). Microsoft Learn. https://learn.microsoft.com/en-us/dax/divide-function-dax
26. DIVIDE function vs. divide operator (/) in DAX. Microsoft Learn. https://learn.microsoft.com/en-us/dax/best-practices/dax-divide-function-operator
27. Understand star schema and the importance for Power BI. Microsoft Learn (updated December 30, 2024). https://learn.microsoft.com/en-us/power-bi/guidance/star-schema
28. Power BI service per-user and capacity-based licenses. Microsoft Learn (updated August 24, 2026; re-checked November 20, 2026). https://learn.microsoft.com/en-us/power-bi/service-features-license-type
29. Get started with goals and scorecards in Power BI. Microsoft Learn (updated March 5, 2026). https://learn.microsoft.com/power-bi/create-reports/service-goals-introduction
30. Polaris Analyzer (vendor page). iFAKT GmbH. https://www.ifakt.de/en/solutions/analyzer
31. Polaris VSM (vendor page, with overview of the Polaris suite). iFAKT GmbH. https://www.ifakt.de/en/software/vsm/
32. Drees, J.; Sack, C. (iFAKT GmbH): Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung (production optimization through value stream modeling KPIs). ZWF 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
33. About iFAKT (company page). iFAKT GmbH. https://www.ifakt.de/en/company/
34. ISO 50006:2023, preview pages (second edition 2023-05, replaces ISO 50006:2014). ANSI Webstore. https://webstore.ansi.org/preview-pages/ISO/preview_ISO+50006-2023.pdf
35. Manufacturing KPIs: The Metrics That Actually Drive the Floor. Fabrico (vendor blog), published June 29, 2026, updated October 26, 2026. https://www.fabrico.io/blog/manufacturing-kpis/
36. Quality Glossary of Terms, Acronyms & Definitions (entries "first pass yield", "overall equipment effectiveness", "parts per million"). ASQ. https://asq.org/quality-resources/quality-glossary
37. World-Class OEE: What Is It and How Close Are You Actually? TEEPTRAK (vendor page, benchmarks from own data). https://teeptrak.com/en/world-class-oee-benchmark/
38. ISO 22400 KPI Selection Guide. Fabrico (secondary source for the count of 34 KPIs and the categories). https://www.fabrico.io/blog/iso-22400-kpi-selection-guide/
39. Competitor pages: https://netsuite.com/portal/resource/articles/erp/manufacturing-kpis-metrics.shtml · https://www.insightsoftware.com/blog/30-manufacturing-kpis-and-metric-examples/ · https://www.dataparc.com/blog/manufacturing-kpi-examples-10-formulas-for-measuring-success/ · https://machinemetrics.com/blog/manufacturing-kpis · https://tulip.co/blog/manufacturing/how-to-calculate-34-manufacturing-kpis/ · https://www.cascade.app/blog/manufacturing-kpis · https://scw.ai/blog/manufacturing-kpis/ · https://upkeep.com/learning/what-are-the-best-metrics-and-kpis-for-manufacturing-companies/ · https://safetyculture.com/topics/kpi/manufacturing-kpis/ (redirects to mitti.com) · https://www.vorne.com/learning-center/kpi.htm
40. ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264; Purdue-based Levels 0–4, Level 3 = manufacturing operations management). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
41. Equipment Performance Metrics (SEMI E10 RAM and utilization; SEMI E79 equipment productivity incl. OEE). SEMI. https://semi.org/en/products-services/standards/step/equipment-performance-metrics
42. OSHA: Clarification on how the formula is used by OSHA to calculate incident rates. Standard interpretation letter, August 23, 2016. https://www.osha.gov/laws-regs/standardinterpretations/2016-08-23
43. U.S. Bureau of Labor Statistics: Employer-Reported Workplace Injuries and Illnesses – 2025. News release, November 18, 2026. https://www.bls.gov/news.release/osh.nr0.htm
44. U.S. Bureau of Labor Statistics: Number and rate of nonfatal work injuries and illnesses in private industries, 2025 (chart). https://www.bls.gov/charts/injuries-and-illnesses/number-and-rate-of-nonfatal-work-injuries-and-illnesses-by-industry.htm
45. 29 CFR 1904.39 – Reporting fatalities, hospitalizations, amputations, and losses of an eye as a result of work-related incidents to OSHA. https://www.osha.gov/laws-regs/regulations/standardnumber/1904/1904.39
46. U.S. Bureau of Labor Statistics: Occupational Safety and Health Definitions (recordable cases, DART, days away from work). https://www.bls.gov/iif/definitions/occupational-safety-and-health-definitions.htm
47. Supply Chain Dive: news brief on Walmart's on-time, in-full requirement for suppliers (87 %, two-day window, 3 % fine). March 8, 2019. https://www.supplychaindive.com/news/walmart-on-time-in-full-87-suppliers/550083/
