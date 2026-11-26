# SEO metadata

| Field | Value |
|---|---|
| Meta title | SMED: Snelle Omstelling en Reductie van Insteltijd in Lean |
| Meta description | SMED (single-minute exchange of die) uitgelegd: snelle omstelling in 8 stappen, interne vs. externe insteltijd, formules voor omsteltijd, voorbeelden en OSHA LOTO. |
| Slug | `smed-changeover-reduction` |

# SMED: Single-Minuut Omstelling en Reductie van Omsteltijd, Stap voor Stap

> **Kort antwoord:** SMED (single-minute exchange of die) is een methode om een machine of lijn van het ene naar het volgende product om te stellen in zo kort mogelijke tijd, met als doel minder dan tien minuten, een omstelling met "één cijfer" aan minuten. De kern van de methode komt van Shigeo Shingo: scheid het instelwerk dat alleen kan worden gedaan terwijl de machine stilstaat (interne instelling) van het werk dat kan worden gedaan terwijl de machine draait (externe instelling), zet zoveel mogelijk intern werk om naar extern werk en stroomlijn daarna alles wat overblijft [1][6].

> **Belangrijkste punten**
> - De omsteltijd loopt van het laatste goede stuk van de oude run tot het eerste goede stuk van de nieuwe run, bij normale snelheid. Opstarten en afstellen tellen mee in de omsteltijd [2][21].
> - SMED werkt in een vaste volgorde: observeren, intern en extern scheiden, intern naar extern omzetten, intern stroomlijnen, extern stroomlijnen, standaardiseren, herhalen [5].
> - De meeste vroege winst komt uit organisatie (voorbereiding, checklists, karren, parallel werk), niet uit dure hardware [19][20].
> - Een kortere omsteltijd betaalt zich pas volledig uit als u de tijd benut: kleinere partijen, vaker omstellen en een kortere EPEI, of meer capaciteit op een knelpunt. Beslis vóór het project welke van de twee.
> - Partijgrootte en voorraad schalen mee met de omsteltijd. In de klassieke formule voor de partijgrootte halveert een verlaging van de instelkosten met 75 procent de economische partijgrootte.
> - Elke stap van interne instelling gebeurt op stilstaande apparatuur. In de VS geldt instellen als "onderhoud" onder de lockout/tagout-norm van OSHA, tenzij een smalle uitzondering van toepassing is [8][9].
> - Omsteltwinst vervlakt zonder standaardwerk, audits en een omsteltijd-KPI op het bord op de werkvloer. Onderzoek heeft SMED-praktijk bekritiseerd omdat het ontwerp van apparatuur onderbenut blijft en de borging zwak is [12][13].
> - Goede KPI's: gemiddelde omsteltijd en de spreiding ervan, percentage omstellingen binnen standaard, uitval bij opstarten, omstellingen per week, EPEI en dagen voorraad.

## Inhoudsopgave

1. [Wat is SMED? Definitie en kernidee](#wat-is-smed-definitie-en-kernidee)
2. [Waarom omsteltijd ertoe doet: partijgrootte, voorraad, flexibiliteit en OEE](#waarom-omsteltijd-telt-partijgrootte-voorraad-flexibiliteit-en-oee)
3. [Geschiedenis: van Taylor en Ford tot Shingo en Toyota](#geschiedenis-van-taylor-en-ford-tot-shingo-en-toyota)
4. [Hoe u omsteltijd correct meet](#hoe-je-omsteltijd-correct-meet)
5. [De SMED-methode in 8 stappen](#de-smed-methode-in-8-stappen)
6. [Shingo's acht technieken met voorbeelden](#shingos-acht-technieken-met-voorbeelden)
7. [Omsteltechnieken per type apparatuur](#omsteltechnieken-per-type-apparatuur)
8. [SMED-voorbeeld: een compleet project op een spuitgietmachine](#smed-voorbeeld-een-volledig-project-op-een-spuitgietmachine)
9. [Van kortere omsteltijden naar kleinere partijen: EPEI en partijgrootte](#van-kortere-omstelling-naar-kleinere-loten-epei-en-lotgrootte)
10. [Veiligheid: omstellingen, lockout/tagout en ergonomie](#veiligheid-omstellingen-lockouttagout-en-ergonomie)
11. [Kwaliteit: goedkeuring van het eerste stuk, error proofing en gereguleerde line clearance](#kwaliteit-goedkeuring-van-het-eerste-stuk-error-proofing-en-gereguleerde-line-clearance)
12. [Mensen en rollen: wie doet wat bij een omstelling](#mensen-en-rollen-wie-doet-wat-bij-een-omstelling)
13. [SMED-sjablonen en checklists](#smed-sjablonen-en-checklists)
14. [Uitrolplan: van een pilot naar een fabriekbreed omstelsysteem](#uitrolroadmap-van-een-pilot-naar-een-fabriekbreed-omstelsysteem)
15. [Omstel-KPI's: hoe u voortgang meet](#omsteltijd-kpis-hoe-je-voortgang-meet)
16. [De businesscase: kosten, ROI en voorraadverwerking](#de-businesscase-kosten-roi-en-voorraadverwerking)
17. [SMED en andere lean-tools](#smed-en-andere-lean-tools)
18. [Gedocumenteerde SMED-voorbeelden](#gedocumenteerde-smed-voorbeelden)
19. [Veelgemaakte SMED-fouten](#veelvoorkomende-smed-fouten)
20. [Grenzen en kritiek op SMED](#beperkingen-en-kritiek-op-smed)
21. [SMED gaat digitaal: data, video, MES en planning](#smed-gaat-digitaal-data-video-mes-en-planning)
22. [SMED-woordenlijst](#smed-woordenlijst)
23. [FAQ: vragen over SMED en omstellingen](#faq-smed-en-omsteltijd-vragen)
24. [Conclusie en eerste stappen](#conclusie-en-eerste-stappen)

## Wat is SMED? Definitie en kernidee

Het Lean Enterprise Institute (LEI) definieert [SMED](https://www.m365.fm/entity/smed/) als een proces om productieapparatuur van het ene artikelnummer naar het andere om te stellen in zo kort mogelijke tijd [1]. "Single-minute" betekent niet één minuut. Het betekent een getal van één cijfer aan minuten, dus minder dan tien [1]. De term "die" komt uit de stansperspersen waar de methode voor het eerst werd toegepast, maar SMED geldt voor elke omstelling: mallen, opspanmiddelen, snijgereedschap, drukplaten, formaatdelen op een verpakkingslijn, recepten op een vulmachine.

Een [omstelling](https://www.m365.fm/entity/setup-time/) (ook wel setup genoemd) is het overschakelen van een machine of een gekoppelde groep machines, zoals een cel of een assemblagelijn, van het ene product naar het andere [2]. LEI meet de omsteltijd vanaf het moment dat het laatste stuk van de voltooide run het proces verlaat tot het moment dat het eerste goede stuk van de volgende run eraf komt [2]. Die grens is belangrijk, en we komen er in de sectie over meting op terug.

### Interne setup en externe setup

Shingo's belangrijkste inzicht was om elke omstelling in twee soorten werk te splitsen [1]:

| Type | Definitie | Voorbeelden |
|---|---|---|
| **Interne setup** | Werk dat alleen kan worden uitgevoerd terwijl de machine stilstaat | Het oude gereedschap losmaken en verwijderen, het nieuwe monteren, formaatdelen binnen de afscherming wisselen, bijstelling van het eerste stuk |
| **Externe setup** | Werk dat kan worden uitgevoerd terwijl de machine nog de vorige opdracht draait of al de volgende draait | Het nieuwe gereedschap, de matrijs en het materiaal ophalen; een mal voorverwarmen; de nieuwe matrijs controleren op beschadiging; het oude gereedschap terugbrengen naar de opslag; administratie |

Bij een niet-verbeterde omstelling gebeurt bijna alles terwijl de machine stilstaat: de instelder stopt de machine en gaat dan zoeken naar de matrijs, de kraan, de juiste moersleutel en de tekening. SMED verplaatst het "zoeken" en "halen" buiten de stilstandtijd en pakt vervolgens het werk aan dat werkelijk een stilstaande machine vereist.

### SMED, snelle omstelling en setupreductie: de termen

De termen overlappen elkaar, en fabrieken in de Verenigde Staten gebruiken ze door elkaar:

- **SMED (single-minute exchange of die):** Shingo's naam voor de methode en het doel van omsteltijden van één cijfer aan minuten [1][6].
- **Quick changeover (QCO):** de gangbare Amerikaanse term op de werkvloer voor dezelfde aanpak, bijvoorbeeld gebruikt door NIST MEP-centra [18].
- **Setupreductie / reductie van setuptijd:** een algemeen label dat SMED omvat plus technische aanpassingen aan apparatuur.
- **OTED (one-touch exchange of die):** een strengere doelstelling, een omstelling in minder dan 100 seconden [5].
- **Reductie van omsteltijd:** het resultaat. SMED is de meest gebruikte methode daarvoor, maar niet de enige hefboom; productontwerp, apparaatontwerp en planning dragen er ook aan bij [13][15].

### Het kernidee in één zin

Stop de machine niet voor iets dat terwijl hij draait gedaan kan worden, en maak wat tijdens de stilstand moet gebeuren zo eenvoudig dat er niet gezocht, niet bijgesteld en geen proefstukken nodig zijn.

In de praktijk scheidt de SMED-aanpak de setuptaken die een stilstaande machine vereisen van die welke uitgevoerd kunnen worden terwijl de machine nog draait, verplaatst zoveel mogelijk werk naar de tweede groep en verkort daarna wat overblijft. Daarmee is SMED een methode voor continue verbetering van het omstelproces en een van de standaardinstrumenten van lean manufacturing.

### Voordelen van SMED

Veel webpagina's noemen voordelen met percentages die zelden een bron hebben. De onderstaande voordelen zijn de mechanismen; de omvang van elk hangt af van uw uitgangssituatie.

1. **Capaciteit:** elke minuut die uit de interne setup verdwijnt, levert een minuut machinetijd op. Bij een knelpunt is dat productie die de hele fabriek ten goede komt.
2. **Kleinere series en minder voorraad:** wanneer een omstelling goedkoop is, kunt u elk product vaker in kleinere hoeveelheden draaien. LEI merkt op dat de EPEx (every product every interval) van een machine rechtstreeks afhangt van de omsteltijden [3].
3. **Kortere doorlooptijden en betere levertrouw:** minder werk in proces betekent kortere wachtrijen; kleine series laten u binnen dagen in plaats van weken reageren op veranderingen in de vraag.
4. **Kwaliteit:** gestandaardiseerde omstellingen met vaste instellingen verminderen proefondervindelijk werken, aanloopuitval en mislukte eerste stukken. Minder stuks per serie betekent ook minder stuks in gevaar wanneer een defect wordt ontdekt.
5. **Veiligheid en ergonomie:** een goed ontworpen omstelling verwijdert ongemakkelijk tillen, reiken in matrijzen en haasten, mits veiligheid in het ontwerp is verwerkt en niet wordt omzeild (zie de sectie over veiligheid).

## Waarom omsteltijd telt: partijgrootte, voorraad, flexibiliteit en OEE

Lange omsteltijden duwen fabrieken in een voorspelbare val. Als een omstelling twee uur kost, wil niemand die vaak uitvoeren, dus draait de fabriek grote batches. Grote batches creëren voorraad, lange doorlooptijden en de noodzaak om klantvraag verder vooruit te voorspellen. Voorspellingen kloppen vaker niet naarmate ze verder vooruitreiken, dus bouwt de fabriek nog meer veiligheidsvoorraad op. De omstelling wordt zo de verborgen oorzaak van de helft van de voorraad in het gebouw.

### De batchgrootte-val in cijfers

**Uitgewerkt voorbeeld (illustratief):** Een stansperse draait 16 uur per dag (960 minuten). Elke omstelling duurt 90 minuten. De perse maakt 8 artikelnummers.

- Als de perse twee keer per dag omstelt, verliest zij 180 minuten, oftewel 18,8 procent van haar tijd (180 / 960). Het doorlopen van alle 8 artikelnummers duurt dan 4 dagen, dus wordt elk onderdeel ongeveer elke 4 dagen gemaakt, en moet de fabriek voor elk onderdeel ongeveer 4 dagen voorraad aanhouden, plus veiligheidsvoorraad.
- Om elk onderdeel elke dag te maken, zou de perse 8 omstellingen per dag nodig hebben: 8 × 90 = 720 minuten, 75 procent van haar tijd. Dat is niet haalbaar als de onderdelen meer dan 240 minuten looptijd nodig hebben.
- Breng de omsteltijd terug naar 15 minuten, dan kosten 8 omstellingen 120 minuten, 12,5 procent van de dag. Elk onderdeel kan dan elke dag worden gemaakt, en daalt de cyclusvoorraad van ongeveer 4 dagen naar ongeveer 1 dag.

Dat is de reden waarom Toyota lang voordat het gemeengoed werd, investeerde in het terugdringen van omsteltijden: zonder snelle omstellingen werkt kleine-partij just-in-time productie niet.

### Omsteltijd in OEE

Overall equipment effectiveness (OEE) vermenigvuldigt beschikbaarheid, prestatie en kwaliteit [4]. LEI rekent aanpassingen tot de zes belangrijkste verliezen die OEE aanpakt [4]; in de meeste OEE-systemen worden geplande omstellingen geboekt als een beschikbaarheidsverlies, en opstartuitval na een omstelling als een kwaliteitsverlies. Dat heeft twee gevolgen:

- Een reductie van de omsteltijd komt alleen tot uiting in de OEE-beschikbaarheid als de bespaarde tijd wordt gebruikt voor productie. Als de fabriek simpelweg minder uren draait, beweegt de OEE-beschikbaarheid niet.
- Als de fabriek de bespaarde tijd gebruikt voor frequentere omstellingen (om de partijgroottes te verkleinen), kan de OEE-beschikbaarheid gelijk blijven of zelfs dalen, terwijl voorraad en doorlooptijd verbeteren. Dat is een goed resultaat. Beoordeel SMED op het doel dat je hebt gekozen, niet op OEE alleen.

De gedetailleerde OEE-definities worden behandeld in de gids [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/), en de onderhoudskant van OEE in de gids over [TPM en OEE](https://www.m365.fm/en/learn/tpm-oee/).

### Drie manieren om de gewonnen tijd te gebruiken

| Optie | Wanneer het past | Wat je meet |
|---|---|---|
| **Meer capaciteit** (zelfde aantal omstellingen) | Machine is een knelpunt, vraag overstijgt capaciteit | Output per week, overuren, OEE-beschikbaarheid |
| **Kleinere partijen** (meer omstellingen, zelfde totale omsteltijd) | Machine heeft ruimte over, hoge voorraad, lange doorlooptijden, veel varianten | EPEI, partijgrootte, dagen voorraad, doorlooptijd |
| **Mix** (deels capaciteit, deels kleinere partijen) | De meeste echte fabrieken | Beide sets, met een expliciete verdeling afgesproken met planning |

De meest voorkomende reden waarom SMED-projecten teleurstellen, is dat niemand deze beslissing heeft genomen. De omstelling wordt sneller, planning houdt de oude partijgroottes aan, en de bespaarde tijd verdwijnt in langere stilstandperiodes. Daar komen we terug in de sectie over fouten.

## Geschiedenis: van Taylor en Ford tot Shingo en Toyota

Het verkorten van omsteltijden is ouder dan de naam. Frederick Winslow Taylor analyseerde niet-waardetoevoegende delen van omstellingen in *Shop Management* (1911), Frank Gilbreth beschreef het verkorten van omsteltijd in *Motion Study* (1911), en de fabrieken van Henry Ford legden omsteltijdverkorting vast in *Ford Methods and Ford Shops* (1915) [5]. Geen van hen maakte er een gestructureerde, breed toegepaste methode van [5]. Gedurende het grootste deel van de 20e eeuw was het standaardantwoord op lange omsteltijden wiskundig: de economische bestelhoeveelheid, die de omstelkosten als gegeven accepteert en de "juiste" grote batch berekent [5].

### Toyota en quick die change

Bij Toyota duurden matrijswisselingen in de vroege naoorlogse jaren naar verluidt twee tot acht uur; het Wikipedia-artikel markeert deze cijfers als bronvermelding nodig [5]. Taiichi Ohno werd in 1945 manager van de machineafdelingen van Toyota en observeerde in 1955 Danly-stansperses in de Verenigde Staten; Toyota kocht later er verschillende voor de fabriek in Motomachi [5]. Het interne "quick die change"-programma van Toyota gebruikte de ECRS-vragen (elimineren, combineren, herschikken, vereenvoudigen), die afkomstig waren van het Amerikaanse Training Within Industry-programma uit de Tweede Wereldoorlog [5][33]. Volgens dezelfde bron daalden de omsteltijden van Toyota van uren naar 15 minuten in de jaren zestig en naar 3 minuten in de jaren zeventig [5].

### Shigeo Shingo

Shigeo Shingo (1909–1990) was industrieel ingenieur en consultant bij de Japan Management Association vanaf 1945 [6]. Hij deed verbeterervaring op bij Toyo Kogyo (tegenwoordig Mazda) in 1950 en bij Mitsubishi Heavy Industries in Hiroshima in 1957, en vanaf 1969 werkte hij bij Toyota aan het verkorten van matrijswisseltijden op persen, waarbij matrijswisselingen van één tot twee uur, soms een halve dag, terugliepen tot enkele minuten [6]. LEI plaatst zijn belangrijkste inzichten, de scheiding van interne en externe omstelling en de omzetting van interne in externe werkzaamheden, in de jaren vijftig en zestig [1].

Shingo publiceerde de methode in het Engels in 1985 als *A Revolution in Manufacturing: The SMED System* (Productivity Press) [6][7]. Het boek meldt dat over zijn cases tussen 1975 en 1985 de omsteltijden gemiddeld daalden tot ongeveer 2,5 procent van het oorspronkelijke niveau, een factor 40 [5]. Beschouw dit cijfer als Shingo's eigen samenvatting van zijn consultancycases, niet als een onafhankelijke benchmark.

In 1988 richtte de business school van Utah State University de Shingo Prize op ter ere van hem; vandaag wordt deze prijs beheerd door het Shingo Institute aan de Jon M. Huntsman School of Business [6][30].

### SMED in de VS

Amerikaanse producenten kwamen in de jaren tachtig via de vertaling van Shingo's boeken, de verspreiding van just-in-time en het succes van Japanse autofabrikanten in aanraking met SMED. Vandaag is het een standaardmodule in lean-training, inclusief de quick changeover-diensten van de NIST Manufacturing Extension Partnership (MEP)-centra [18][31]. De bredere leancontext wordt behandeld in de gids [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/).

## Hoe je omsteltijd correct meet

De meeste omsteldata in fabrieken zijn onbetrouwbaar, en niet omdat mensen liegen. Ze zijn onbetrouwbaar omdat niemand het eens was over waar een omstelling begint en eindigt. Het ERP-systeem registreert "omstelling" vaak als de tijd tussen twee orderbevestigingen; operators noteren vaak de tijd dat "de machine uit elkaar was"; engineers meten vaak alleen de matrijswisseling. Alle drie zijn korter dan het werkelijke verlies.

### De definitie: laatste goede deel tot eerste goede deel

Gebruik de LEI-grens: van de laatste goede eenheid van de oude run tot de eerste goede eenheid van de nieuwe run [2]. Twee verfijningen maken dit waterdicht:

1. **Bij normale snelheid.** De nieuwe run telt pas als "up" wanneer hij goede delen produceert tegen de standaardsnelheid. Leanproduction.com definieert het einde als het eerste goede deel op volle snelheid [19]. Als de lijn na de herstart 20 minuten op halve snelheid draait, maken die 20 minuten deel uit van het omsteelverlies.
2. **Inclusief afbouw.** Als de oude run vóór de stop vertraagt (bijvoorbeeld wanneer de lijn wordt leeggemaakt en gedeeltelijk draait), tel dat ook mee. Sommige fabrieken noemen dit de "3 Ups": opruimen, opstellen en opstarten [24].

### De drie fasen van een omstelling

| Fase | Wat er gebeurt | Typische verborgen verliezen |
|---|---|---|
| **Afbouw / opruimen** | Laatste delen van de oude order, leegmaken van de lijn, verwijderen van materiaal, reinigen | Lijn draait op verlaagde snelheid; operators gaan de volgende job halen |
| **Opstelling (wissel)** | Verwijderen en monteren van gereedschap, matrijzen, formaatdelen; wijzigen van instellingen | Zoeken, wachten op kraan of vorkheftruck, ontbrekende onderdelen, bouten |
| **Opbouw / opstarten** | Eerste delen, meting, bijstelling, goedkeuring, oprit naar volle snelheid | Proef-en-foutbijstellingen, wachten op kwaliteitsgoedkeuring, uitval |

De eigen uitsplitsing van Shingo voor een conventionele omstelling, zoals vermeld op Wikipedia, kent ongeveer 30 procent toe aan voorbereiding en controle van materialen en gereedschap; ongeveer 5 procent aan monteren en demonteren; ongeveer 15 procent aan centreren, dimensioneren en instellen van condities; en ongeveer 50 procent aan proefruns en bijstellingen [5]. Een open engineeringleerboek over lean manufacturing geeft een vergelijkbaar beeld voor metaalstansen, met ongeveer 20 tot 50 procent van de omsteltijd besteed aan bijstellen [36]. De praktische les: de wissel zelf is het kleine deel. De grote delen zijn voorbereiding en opbouw.

### Formules voor omsteltijd

**Omsteltijd (per gebeurtenis):**
Omsteltijd = tijdstip van eerste goede deel op standaardsnelheid − tijdstip van laatste goede deel van de vorige run

**Gemiddelde omsteltijd:**
Gemiddelde omsteltijd = som van alle omsteltijden / aantal omstellingen

**Aandeel omstelling in beschikbare tijd:**
Aandeel omstelling = totale omsteltijd / geplande productietijd × 100%

**Interne ratio:**
Interne ratio = interne omsteltijd / totale omstelarbeid × 100%

**Kosten van één omstelling (eenvoudig model):**
Kosten per omstelling = gederfde bijdragemarge (alleen als de machine een bottleneck is of uitverkocht is) + loonkosten van de omstelploeg + uitval bij opbouw + verbruiksmaterialen

MachineMetrics, een leverancier van machinebewaking, gebruikt een vergelijkbare opsplitsing: gederfde loonkosten = uren stilstand × aantal medewerkers × loonkosten per uur, en gederfde productwaarde = verkoopprijs per stuk × standaardsnelheid × uren stilstand [21]. Wees voorzichtig met de tweede term: die telt alleen als echt verlies als de gederfde output verkocht had kunnen worden. Op een machine met overcapaciteit bestaan de kosten van een omstelling vooral uit arbeid en uitval, en ligt het voordeel van SMED in kleinere series, niet in teruggewonnen output.

**Uitgewerkt voorbeeld (illustratief):** Een CNC-bewerkingscentrum draait twee diensten van 8 uur, 5 dagen per week, met 60 minuten geplande pauzes per dag: geplande productietijd = (16 − 1) × 60 × 5 = 4.500 minuten per week. Vorige week had het 9 omstellingen die 52, 68, 47, 95, 61, 58, 73, 49 en 87 minuten duurden.

- Totaal = 590 minuten; gemiddelde = 590 / 9 = 65,6 minuten.
- Aandeel omstelling = 590 / 4.500 = 13,1 procent.
- Spreiding: kortste 47, langste 95 minuten, een bandbreedte van 48 minuten. Zo'n brede bandbreedte betekent meestal dat er geen standaard is; de lange omstellingen zijn die met ontbrekend gereedschap of ontbrekende programma's.
- Kosten: ploeg van 1 omsteller tegen een belaste tarief van $48 per uur (illustratief) = 590 / 60 × $48 = $472 per week aan arbeid. Als de machine een bottleneck is met een bijdragemarge van $180 per uur, is de gederfde marge 590 / 60 × $180 = $1.770 per week, of ongeveer $92.000 per jaar bij 52 weken. Dat is het getal dat een project rechtvaardigt.

### Hoe de gegevens verzamelen

1. **Eerst video.** Filmuit één volledige omstelling, van het laatste goede stuk tot het eerste goede stuk, met een zichtbare klok. Eén camera op de machine en, idealiter, een tweede camera die de instelder volgt. Vraag eerst toestemming aan het team en leg het doel uit: de video gaat over het proces, niet over de mensen. Het Michigan-centrum van NIST MEP gebruikte in het Brighton NC Machine-project video, een spaghettidiagram en een instelanalysegrafiek [17].
2. **Spaghettidiagram.** Teken het looppad van de instelder op een indeling. Omstellingen omvatten vaak honderden of duizenden voet lopen; in het Brighton-voorbeeld was dat 9.121 voet per omstelling vóór verbetering [17].
3. **Lijst met elementen.** Splits de video op in elementen van enkele seconden tot enkele minuten: "naar de gereedschapsuitgifte lopen, 3:20", "8 klemboutjes losdraaien, 4:10". Een typische omstelling bestaat volgens leanproduction.com [19] uit ongeveer 30 tot 50 elementen.
4. **Twee weken nulmeting.** Verzamel starttijden en eindtijden van alle omstellingen gedurende minstens twee weken voordat je iets verandert, zodat je het gemiddelde en de spreiding kent [19]. Vorne waarschuwt dat teams hun gedrag veranderen wanneer ze weten dat ze worden geobserveerd (het Hawthorne-effect), dus de eerste gefilmde omstelling kan sneller verlopen dan normaal [20].

Het sjabloon voor de lijst met elementen staat in de [sectie met sjablonen](#smed-sjablonen-en-checklists).

## De SMED-methode in 8 stappen

Shingo beschreef vier conceptuele fasen, vaak de SMED-fasen genoemd: in de voorbereidende fase zijn interne en externe instelling door elkaar gemengd; fase 1 scheidt ze; fase 2 zet interne instelling om in externe; fase 3 stroomlijnt alle aspecten van de instelling [5]. Praktijkbronnen werken dit uit tot zeven basisstappen: observeren, scheiden, omzetten, interne instelling stroomlijnen, externe instelling stroomlijnen, documenteren, herhalen [5]. De acht stappen hieronder voegen de stap toe die de meeste handleidingen overslaan: het voorbereiden van het project, inclusief veiligheid en de beslissing hoe de bespaarde tijd wordt gebruikt.

| Stap | Shingo-fase | Resultaat |
|---|---|---|
| 0. Voorbereiden: kies de machine, het team, het doel en het gebruik van de bespaarde tijd | (voorbereidend) | Projectcharter, nulmetingsgegevens, veiligheidsbeoordeling |
| 1. Huidige omstelling vastleggen | voorbereidende fase | Video, lijst met elementen en tijden, spaghettidiagram |
| 2. Interne en externe elementen scheiden | fase 1 | Elk element gemarkeerd als I of E; checklist en stagingplan |
| 3. Interne omzetten naar externe | fase 2 | Actielijst: voorbereiding, standaardisatie van functies, tussenliggende hulpmiddelen |
| 4. Interne elementen stroomlijnen | fase 3 | Snelklemmen, geëlimineerde afstellingen, parallel werk |
| 5. Externe elementen stroomlijnen | fase 3 | Karren, schaduwborden, opslag dicht bij de machine |
| 6. Standaardiseren en trainen | (opvolging) | Standaard omstellingsblad, trainingsregistraties |
| 7. Borgen en herhalen | (opvolging) | KPI op het bord, audits, volgende cyclus |

### Stap 0: Het project voorbereiden

**Kies de pilotmachine.** Goede pilots hebben een omstelling van ongeveer 30 tot 90 minuten die meerdere keren per week plaatsvindt, een meewerkende ploeg en zichtbare bedrijfspijn (bottleneck, hoge voorraad, late orders). Vorne adviseert een pilotomstelling van 30 tot 60 minuten [20]; leanproduction.com beveelt SMED aan wanneer omstellingen minstens 20 procent van de verloren productieve tijd veroorzaken, en anders eerst TPM [19]. Beide zijn vuistregels van leveranciers, geen normen, maar ze wijzen in de juiste richting: begin niet met een omstelling van 12 uur of een van 5 minuten.

**Stel het team samen.** Operator(s) en instelder(s) die de omstelling dagelijks uitvoeren, een onderhoudstechnicus, een productie-ingenieur, een kwaliteitstechnicus voor goedkeuring van het eerste stuk en een veiligheidsvertegenwoordiger. Een leidinggevende steunt het team. Vier tot zeven personen is een werkbare omvang.

**Spreek het doel en het gebruik van de bespaarde tijd af.** Leg de nulmeting (gemiddelde en bereik), het streefdoel (bijvoorbeeld 50 procent reductie in de eerste cyclus, zoals Vorne voorstelt [20]) en wat de planning met de tijd gaat doen vast: capaciteit, kleinere lotgroottes of een splitsing.

**Veiligheidsbeoordeling.** Breng de energiebronnen in kaart (elektrisch, hydraulisch, pneumatisch, zwaartekracht, thermisch) en de huidige procedure voor energiebeheersing. Bepaal vóór de workshop welke stappen onder lockout/tagout vallen. Accepteer nooit "snellere" ideeën die de energie-isolatie overslaan (zie de veiligheidssectie).

### Stap 1: Leg de huidige omstelling vast

Film de omstelling, stel de elementenlijst op en teken het spaghettidiagram. Schrijf de elementen op in de volgorde waarin ze plaatsvonden, met starttijd, duur en wie ze uitvoerde. Markeer meteen duidelijke verspilling: zoeken, lopen, wachten op de kraan, proefdraaien.

Vragen om bij elk element te stellen (de klassieke "vijf waaroms"-vragen werken ook):

- Waarom wordt dit überhaupt gedaan? (Kunnen we het schrappen?)
- Waarom nu, terwijl de machine stilstaat? (Kan het extern worden uitgevoerd?)
- Waarom op deze manier? (Kan het eenvoudiger?)
- Waarom door deze persoon? (Kunnen twee personen het parallel doen, of kan de operator het zelf doen?)

### Stap 2: Scheid interne en externe elementen

Markeer elk element als I (vereist een stilstaande machine) of E (kan worden uitgevoerd terwijl de machine draait). Verander de methode nog niet; stop alleen met het uitvoeren van extern werk tijdens de stilstand. Deze stap is vooral organisatorisch:

- **Checklist vóór de omstelling:** alles wat de volgende order nodig heeft (matrijs, gereedschap, opspanmiddelen, inzetstukken, materiaal, programma, tekening, meetmiddelen, verpakking) wordt vastgelegd en gecontroleerd voordat de machine stopt.
- **Functiecontroles:** de nieuwe matrijs wordt op beschadiging en volledigheid gecontroleerd voordat hij erin gaat, niet pas na het eerste slechte product.
- **Transport:** de nieuwe matrijs wordt vóór de stilstand bij de machine klaargezet; de oude matrijs gaat na de herstart terug naar de opslag.

Leanproduction.com meldt dat het verplaatsen van elementen naar extern de omsteltijd bijna kan halveren [19]. Dat komt overeen met de ervaring in de praktijk, maar het hangt volledig af van hoeveel zoeken en halen er nu plaatsvindt.

### Stap 3: Zet interne om in externe elementen

Kijk nu opnieuw naar elk overgebleven I-element en vraag wat er moet veranderen om het extern te maken. Shingo's technieken hiervoor zijn het vooraf voorbereiden van de bedrijfsomstandigheden, het standaardiseren van functies en het gebruik van tussenopspanningen [5]:

- **Voorverwarm** mallen en matrijzen buiten de machine, zodat de eerste schoten niet hoeven te wachten tot ze op temperatuur zijn.
- **Preset** gereedschap in een presetter of op een tweede opspanning terwijl de machine draait.
- **Standaardiseer** de afmetingen die voor de machine belangrijk zijn (spanhoogte, positioneerpunten, aansluitpunten), zodat een nieuwe matrijs geen aanpassing nodig heeft.
- **Tussenopspanningen**: monteer het volgende werkstuk of de volgende matrijs op een standaardpallet of onderplaat buiten de machine, en wissel dan de hele pallet.

### Stap 4: Stroomlijn interne elementen

Wat intern blijft, wordt snel en eenvoudig gemaakt:

- **Functionele klemmen** in plaats van bouten: kwartslagsluitingen, nokklemmen, U-gleuven zodat een bout maar een halve slag hoeft te draaien, hydraulisch of magnetisch klemmen.
- **Elimineer afstellingen:** vaste aanslagen, positioneerpennen, schalen en merktekens, instellingen opgeslagen als recepten. Afstellen is volgens Shingo's indeling de grootste afzonderlijke categorie van omsteltijd [5].
- **Parallelle werkzaamheden:** twee personen aan weerszijden van de machine, elk met een vaste volgorde, kunnen de doorlooptijd met meer dan de helft verkorten door het lopen rond de machine weg te nemen. Ze hebben een duidelijk signaalsysteem nodig en onder lockout/tagout past elke persoon zijn eigen slot toe.
- **Eén gereedschap, één maat:** standaardiseer boutmaten zodat één gereedschap overal werkt.

### Stap 5: Stroomlijn externe elementen

Extern werk stopt de machine niet, maar het bindt mensen en kan de start van de omstelling vertragen. Stroomlijn het met omstelwagens die op volgorde zijn ingericht, schaduwborden, opslag van matrijzen en gereedschap op het gebruikspunt volgens [5S](https://www.m365.fm/en/learn/5s-visual-management/), en duidelijke visuele signalen ("volgende order gereed").

### Stap 6: Standaardiseer en train

Schrijf de nieuwe methode uit als een standaard omstelblad: de volgorde van de elementen, wie wat doet, sleutelpunten (veiligheid, kwaliteit), tijden en het benodigde gereedschap. LEI beschrijft [standaardwerk](https://www.m365.fm/entity/standard-work/) als het vastleggen van precieze procedures voor het werk van elke operator [26]. Train iedereen die de omstelling uitvoert, niet alleen de proefploeg; de TWI-methode Job Instruction, die een taak opdeelt in belangrijke stappen en sleutelpunten, is een praktisch format [33]. Het cluster over [standaardwerk](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) behandelt het format in detail.

### Stap 7: Borgen en herhalen

Zet de omsteltijd op het bord op de werkvloer, bespreek afwijkingen dagelijks en controleer de standaard regelmatig. SMED is een continue verbeterlus, geen eenmalige gebeurtenis. Start de volgende cyclus: de samenvatting van de SMED-praktijk op Wikipedia stelt dat er mogelijk verschillende iteraties nodig zijn om onder de tien minuten te komen [5]. Een tweede cyclus richt zich doorgaans op de hardwareafhankelijke elementen die de eerste cyclus heeft uitgesteld.

## Shingo's acht technieken met voorbeelden

Shingo vatte zijn aanpak samen in acht technieken [5]. De tabel geeft elk een eenvoudige uitleg en voorbeelden uit verschillende branches.

| # | Techniek | Wat het betekent | Voorbeelden |
|---|---|---|---|
| 1 | Scheid interne van externe omstelling | Stop de machine niet voor werk dat terwijl hij draait kan worden gedaan | Checklist, klaarzetten van matrijs en materiaal vóór de stop |
| 2 | Zet interne omstelling om in externe | Verander de methode zodat werk buiten de stilstand plaatsvindt | Voorverwarmen van mallen, vooraf instellen van gereedschap, vooraf monteren van formaatdelen |
| 3 | Standaardiseer functie, niet vorm | Standaardiseer alleen de kenmerken waarmee de machine in aanraking komt, niet het hele gereedschap | Zelfde klemhoogte en randmaat op elke matrijs via spacerblokken; zelfde koppeling op elke mal |
| 4 | Gebruik functionele klemmen of schrap bevestigingen | Bevestig met één beweging, of helemaal niet | Kwartslagschroeven, nokhendels, peervormige gaten, hydraulische klemmen, magnetische plaatsen |
| 5 | Gebruik tussenliggende hulpstukken | Bereid op een standaarddrager buiten de machine voor en wissel de drager | Nulpuntklempallets op bewerkingscentra, subplaten voor persmatrijzen |
| 6 | Pas parallelle bewerkingen toe | Meer dan één persoon werkt tegelijk volgens een vastgelegde volgorde | Twee monteurs aan beide zijden van een pers, operator bereidt materiaal voor terwijl de monteur de matrijs wisselt |
| 7 | Schrap afstellingen | Vervang proberen en corrigeren door vaste posities en opgeslagen instellingen | Positioneringspennen, aanslagen, schalen, receptdownload, digitale uitlezingen |
| 8 | Mechanisatie | Gebruik krachtondersteuning waar die werkelijk helpt, pas nadat de overige zeven zijn toegepast | Matrijswagens met rollen, matrijsheffers, gemotoriseerde verstelassen |

Twee opmerkingen bij de lijst. Ten eerste komt mechanisatie bewust als laatste. Hardware die vóór de organisatorische stappen wordt aangeschaft, automatiseert vaak verspilling. Ten tweede is "standaardiseer functie, niet vorm" de techniek die het minst wordt benut. Een fabriek hoeft niet 200 matrijzen opnieuw te bouwen; vaak volstaat een set spacerblokken of adapterplaten die alle matrijzen op dezelfde klemhoogte en positioneringsrand brengen.

## Omsteltechnieken per type apparatuur

De principes zijn overal hetzelfde, maar de grote hefbomen verschillen per proces. De onderstaande tabellen zijn een checklist vanuit de praktijk, geen op bronnen gebaseerde benchmark.

### Stansperssen

| Hefboom | Voorbeeld |
|---|---|
| Standaard matrijshoogte en positionering | Parallellen of afstandsblokken brengen alle matrijzen op dezelfde gesloten hoogte; positioneerpennen of een aanslag centreren de matrijs |
| Matrijstransport | Matrijswagens of rolbolsters die bij de pers worden klaargezet; rol- of kogelbanen op de bolster |
| Klemmen | Hydraulische of snelwerkende mechanische klemmen; U-sleuven en één boutmaat als er nog bouten nodig zijn |
| Instellingen | Gesloten hoogte, tegendrukdruk en toevoerinstellingen per matrijs opgeslagen; gemarkeerde schalen |
| Veiligheid | Veiligheidsblokken telkens wanneer de matrijs in de pers wordt afgesteld of gerepareerd, zoals OSHA vereist [10]; matrijsinstelprocedure volgens 29 CFR 1910.217(d)(9) |

### Spuitgieten

| Hefboom | Voorbeeld |
|---|---|
| Voorverwarmen | Mal voorverwarmd op een aparte temperatuurregeleenheid vóór de wissel |
| Aansluitingen | Multikoppelingen voor water- en hete-kanaalaansluitingen, kleurgecodeerd |
| Materiaal | Volgend materiaal gedroogd en klaar; spoelcompound en procedure gestandaardiseerd |
| Klemmen | Snelle mal-wisselsystemen (magnetische of hydraulische platen), gestandaardiseerde maldikte |
| Instellingen | Procesparameters gedownload uit een recept in plaats van uit het geheugen afgesteld |

### CNC-bewerking

| Hefboom | Voorbeeld |
|---|---|
| Gereedstelling van gereedschap | Gereedschappen offline gemeten in een presetter, correcties overgedragen naar de besturing |
| Werkstukopspanning | Nulpuntklemmen, gestandaardiseerde pallets, speciale opspanningen die bij de machine worden bewaard |
| Programma's | Beproefde programma's vrijgegeven en vooraf geladen; geen bewerking aan de machine |
| Eerste stuk | Metingen in de machine (probing) vervangen handmatige meting voor het instellen van werkstuknulpunten |
| Gereedschapsfamilies | Standaard gereedschapsbibliotheek, zodat de meeste opdrachten weinig gereedschapswissels vergen |

### Verpakkings- en vullijnen

| Hefboom | Voorbeeld |
|---|---|
| Formaatdelen | Kleurgecodeerde formaatdelen per productgrootte, op een wagen bewaard in wisselvolgorde |
| Afstellingen | Vaste aanslagen en genummerde schalen in plaats van vrije afstelling; servoassen met opgeslagen posities |
| Reiniging | Reinigingsvolgorde gestandaardiseerd; eerst droog reinigen; losgenomen delen parallel reinigen |
| Etiketten en materialen | Checklist lijnvrijmaking; etiketten, kartons en doppen klaargezet vóór de stop |
| Opstarten | Vastgelegde controles op het eerste stuk; procedure voor het opvoeren van de snelheid |

### Reinigingsbepaalde en gereguleerde wissels (voeding, farma, chemie)

In voedings-, drank-, farmaceutische en chemische fabrieken is de "wissel" vaak klein en zijn het reinigen en de verificatie groot. SMED-denken blijft van toepassing: bereid reinigingsmiddelen, gereedschap en documenten vooraf voor; maak losneembare delen offline schoon terwijl de machine met een tweede set weer wordt opgebouwd; plan producten zo dat volledige reinigingen worden geminimaliseerd (licht naar donker, allergeenvrij vóór allergeenhoudend). Het verschil is dat sommige stappen verplicht zijn en niet kunnen worden ingekort door ze over te slaan:

- Amerikaanse geneesmiddelenfabrikanten moeten verpakkings- en etiketteringsfaciliteiten direct vóór gebruik inspecteren om te waarborgen dat alle geneesmiddelen en ongeschikte verpakkings- en etiketteringsmaterialen van eerdere werkzaamheden zijn verwijderd, en de resultaten vastleggen in de batchproductieregistraties (21 CFR 211.130(e)) [11].
- Amerikaanse voedselbedrijven die onder de regel voor preventieve beheersmaatregelen vallen, moeten voedselallergeenbeheersmaatregelen hebben die procedures omvatten om voedsel te beschermen tegen allergeenkruisbesmetting tijdens opslag, behandeling en gebruik (21 CFR 117.135(c)(2)) [37].

Hier verkort SMED het werk rond de verplichte stappen en maakt het de verplichte stappen sneller en betrouwbaarder, bijvoorbeeld met een checklist lijnvrijmaking en een vaste volgorde. Het schrapt ze nooit.

### Assemblagelijnen en -cellen

Wissels in assemblage gaan vooral over materiaal en informatie: andere kits, andere werkinstructies, andere opspanningen op enkele stations. Hefbomen zijn het kitten van de volgende variant vóór de wissel, opspanningen die meerdere varianten bestrijken, digitale werkinstructies die met de order wisselen, en "rollende" wissels waarbij elk station overschakelt zodra het eerste exemplaar van de nieuwe variant arriveert, zodat de lijn als geheel nooit stilvalt.

## SMED-voorbeeld: een volledig project op een spuitgietmachine

Het volgende voorbeeld is illustratief. De getallen zijn realistisch voor een middelgrote spuitgieterij, maar beschrijven geen echte fabriek. Ze laten zien hoe de stappen op elkaar aansluiten en hoe het effect wordt berekend.

**Situatie.** Een spuitgietmachine van 300 ton draait 6 mallen voor een familie van behuizingen. Er wordt in 3 diensten van 8 uur gewerkt, met 30 minuten pauze per dienst, 5 dagen per week: gepland productietijd = 3 × 7,5 × 60 × 5 = 6.750 minuten per week. Er worden 5 keer per week mallen gewisseld. Nulmeting over twee weken: gemiddelde omsteltijd 96 minuten, bereik 78 tot 131 minuten. De machine is geen bottleneck; het probleem is 11 dagen eindproductvoorraad en frequente spoedorders.

**Doel afgesproken met planning.** De gemiddelde omsteltijd met minstens 50 procent verkorten in de eerste cyclus en de vrijgekomen tijd gebruiken voor meer omstellingen, zodat elke mal minstens elke 3 dagen loopt in plaats van elke 6 dagen.

### Stap 1: elementenlijst (voor)

| # | Element | Tijd (min) | I/E nu | Zou kunnen zijn |
|---|---|---|---|---|
| 1 | Laatste shots, trechter leegmaken, machine stoppen | 6 | I | I (deels E: trechter leegmaken vóór het einde van de run) |
| 2 | Lopen naar malopslag, volgende mal zoeken, kraan ophalen | 14 | I | E |
| 3 | Water- en hete-kanaalleidingen loskoppelen (12 losse koppelingen) | 8 | I | I, stroomlijnen |
| 4 | Mal ontklemmen (8 bouten), eruit tillen | 9 | I | I, stroomlijnen |
| 5 | Nieuwe mal erin tillen, op het oog uitlijnen, klemmen (8 bouten) | 13 | I | I, stroomlijnen |
| 6 | Water- en hete-kanaalleidingen aansluiten, per aansluiting de juiste slang zoeken | 10 | I | I, stroomlijnen |
| 7 | Materiaal zoeken, drogen | 7 | I | E |
| 8 | Mal op temperatuur brengen | 12 | I | E (voorverwarmen) |
| 9 | Parameters instellen volgens instelblad, bijstellen | 9 | I | I, bijstelling elimineren |
| 10 | Proefshots, bijstellen, wachten op kwaliteitsgoedkeuring | 8 | I | I, stroomlijnen |
| **Totaal intern (doorlooptijd)** | | **96** | | |

De twee externe kandidaten (elementen 2 en 7) en het voorverwarmen (element 8) tellen samen op tot 33 minuten machinestilstand die geen stilgezette machine nodig heeft.

### Stap 2 en 3: scheiden en omzetten

- Elementen 2 en 7 worden extern met een controlelijst vóór de omstelling, geactiveerd 45 minuten vóór het geplande einde van de run: mal, kraanplaats, materiaal (gedroogd), slangen, documenten, eerste-stuk-meetmiddel. Besparing: 21 minuten.
- Element 8 wordt extern met een voorverwarmstation waar de volgende mal op temperatuur wordt gebracht terwijl de oude mal nog draait. Besparing: ongeveer 10 minuten (2 minuten blijven over voor stabilisatie in de machine).
- Element 1: de trechter wordt in de laatste minuten van de run leeggemaakt in plaats van na de stop. Besparing: 3 minuten.

Resultaat na de eerste twee stappen: 96 − 21 − 10 − 3 = **62 minuten**, vooral bereikt met een controlelijst, een voorverwarmer en discipline.

### Stap 4: intern stroomlijnen

| # | Maatregel | Voor (min) | Na (min) |
|---|---|---|---|
| 3 + 6 | Multikoppelplaten voor water en hete kanalen, kleurgecodeerd | 18 | 4 |
| 4 + 5 | Gestandaardiseerde centreerring en klemsleuven, snelwerkende klemmen; tweede persoon voor parallel werk | 22 | 9 |
| 9 | Procesparameters per mal opgeslagen en geladen vanuit de regelaar | 9 | 2 |
| 10 | Eerste-stuk-controle met een speciaal meetmiddel bij de machine, kwaliteitstechnicus vooraf ingelicht | 8 | 5 |
| 1 | Uitlopen met trechter al leeg | 3 | 3 |
| 8 | Stabilisatie na voorverwarmen | 2 | 2 |
| **Totaal** | | **62** | **25** |

De doorlooptijd is nu 25 minuten. Let op: parallel werk door twee personen verkort de doorlooptijd, maar niet de arbeidstijd; de arbeidsinhoud van de elementen 4 en 5 blijft ongeveer 18 persoonsminuten.

### Stap 6: standaardiseren

De nieuwe volgorde wordt vastgelegd in een standaard omstelblad met twee kolommen (instelder A, instelder B), getraind voor alle drie de diensten en een maand lang wekelijks gecontroleerd. Na vier weken is het gemiddelde 27 minuten met een bereik van 23 tot 34 minuten.

### Het effect

| Indicator | Voor | Na |
|---|---|---|
| Gemiddelde omsteltijd | 96 min | 27 min (−72%) |
| Bereik omsteltijd | 78–131 min | 23–34 min |
| Omstellingen per week | 5 | 10 |
| Totale omsteltijd per week | 480 min | 270 min |
| Aandeel omstellingen in geplande tijd | 7,1% | 4,0% |
| Interval waarin elke mal loopt (EPEI) | ongeveer 6 dagen | ongeveer 3 dagen |
| Eindproductvoorraad (cyclusvoorraad) | ongeveer 11 dagen | ongeveer 6 dagen (doel) |

De machine wisselt nu twee keer zo vaak om en besteedt toch 210 minuten per week minder aan omstellingen. De cyclusvoorraad daalt ongeveer evenredig met het interval. De investering: een voorverwarmstation, zes multi-koppelingssets, standaardisatie van klemmen en twee dagen tijd van het team. De businesscase voor dit soort projecten wordt berekend in de [businesscase-sectie](#de-businesscase-kosten-roi-en-voorraadverwerking).

## Van kortere omstelling naar kleinere loten: EPEI en lotgrootte

SMED creëert potentieel; planning zet dat om in resultaten. Twee instrumenten verbinden omsteltijd met lotgrootte en voorraad: EPEI en de klassieke lotgrootteformule.

### Wat EPEI betekent

EPEI staat voor "every part every interval" (in het LEI-lexicon wordt nu de term EPEx gebruikt, "every product every interval"). Het beschrijft hoe vaak een machine of proces al zijn artikelnummers doorloopt: als een machine zo wordt omgesteld dat elk artikelnummer elke drie dagen wordt gemaakt, is de EPEx drie dagen [3]. LEI merkt op dat de EPEx afhangt van de omsteltijden en het aantal artikelnummers; lange omstellingen en veel artikelnummers drijven de EPEx omhoog, tenzij de omsteltijd wordt verkort [3]. Een kortere EPEI betekent kleinere loten en minder voorraad. In [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) is EPEI een standaardvermelding in het datavak van een proces met omstellingen [35].

### Hoe EPEI berekend wordt

Een gangbare praktijkformule (afgeleid van de tijdbalans van een proces; geen LEI-formule):

EPEI = totale omsteltijd voor één cyclus door alle artikelen / (beschikbare tijd per dag − benodigde run-tijd per dag)

Het idee: elke dag heeft de machine een vaste hoeveelheid run-tijd nodig om aan de vraag te voldoen. De resterende tijd kan worden besteed aan omstellingen. Hoe meer omsteltijd een volledige cyclus door alle artikelen kost, hoe meer dagen de cyclus duurt.

**Uitgewerkt voorbeeld (illustratief):** Een machine heeft 900 minuten beschikbare tijd per dag. Ze maakt 4 artikelen met de volgende dagelijkse vraag en cyclustijden:

| Artikel | Dagelijkse vraag (stuks) | Cyclustijd (min/stuk) | Run-tijd per dag (min) | Omsteltijd (min) |
|---|---|---|---|---|
| A | 400 | 0,8 | 320 | 40 |
| B | 300 | 0,8 | 240 | 40 |
| C | 150 | 1,0 | 150 | 60 |
| D | 50 | 1,2 | 60 | 60 |
| **Totaal** | | | **770** | **200** |

- Resterende tijd voor omstellingen per dag: 900 − 770 = 130 minuten.
- Eén volledige cyclus door alle vier artikelen vraagt 200 minuten omsteltijd.
- EPEI = 200 / 130 = 1,54 dagen, in de praktijk naar boven afgerond tot **2 dagen**: elk artikel wordt elke 2 dagen gemaakt.
- Lotgroottes bij EPEI 2 dagen = 2 dagen vraag: A 800, B 600, C 300, D 100 stuks.

**Pas nu SMED toe.** De omsteltijden dalen naar 15 minuten voor A en B en 20 minuten voor C en D: totaal = 70 minuten.

- EPEI = 70 / 130 = 0,54 dagen, naar boven afgerond tot **1 dag**: elk artikel elke dag.
- Lotgroottes halveren: A 400, B 300, C 150, D 50 stuks.
- Gemiddelde cyclusvoorraad (ongeveer een halve lot, bij constante vraag) daalt van ongeveer 1 dag vraag naar ongeveer een halve dag.
- Overgebleven tijd: bij EPEI 1 dag vragen omstellingen 70 van de 130 vrije minuten; 60 minuten blijven over als buffer voor storingen en vraagpieken.

Twee praktische opmerkingen. Ten eerste: plan nooit met nul overgebleven tijd; echte machines hebben storingen, en een EPEI die elke vrije minuut opeist, stort in op de eerste slechte dag. Ten tweede: de EPEI kan verschillen voor hoogdraaiers en laagdraaiers: A en B elke dag, C en D elke tweede dag is vaak een betere afweging dan een uniform interval. Hier raakt SMED [heijunka](https://www.m365.fm/entity/heijunka/) elkaar, het egaliseren van de productie naar volume en mix [25].

### De lotgrootteformule en waarom setupkosten ertoe doen

De economische bestelhoeveelheid (EOQ), ontwikkeld door Ford W. Harris in 1913 [39] en decennialang de standaardaanpak voor lotgrootte [5], balanceert setupkosten tegen voorraadkosten:

EOQ = √(2 × D × S / H)

waarin D = jaarlijkse vraag, S = kosten per setup (of bestelling), H = jaarlijkse voorraadkosten per stuk. Voor productie met een eindige productiesnelheid voegt de economische productiehoeveelheid (EPQ) een correctiefactor √(1 / (1 − d/p)) toe, waarbij d de vraagsnelheid is en p de productiesnelheid. De details van beide formules, inclusief hun aannames, worden behandeld in het cluster over [lotgrootte](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/).

Het kernpunt voor SMED is de wortel. Als de setupkosten S terugvallen tot een kwart, halveert de economische lotgrootte (√0,25 = 0,5). Als S terugvalt tot een negende, daalt de lotgrootte tot een derde.

**Uitgewerkt voorbeeld (illustratief):** D = 24.000 stuks per jaar, H = $2,40 per stuk per jaar (bijvoorbeeld 20 procent voorraadkosten op een onderdeel van $12), S = $160 per omstelling (twee uur van een ploeg van twee personen tegen $40 per uur, inclusief lasten).

- EOQ = √(2 × 24.000 × 160 / 2,40) = √3.200.000 ≈ **1.789 stuks**, ongeveer 13 partijen per jaar (24.000 / 1.789 ≈ 13,4).
- Na SMED duurt de omstelling 30 minuten met dezelfde ploeg: S = $40.
- EOQ = √(2 × 24.000 × 40 / 2,40) = √800.000 ≈ **894 stuks**, ongeveer 27 partijen per jaar (24.000 / 894 ≈ 26,8).
- De gemiddelde cyclusvoorraad (EOQ / 2) daalt van ongeveer 894 naar ongeveer 447 stuks; bij $12 per stuk komt er voor dit ene onderdeel ongeveer $5.400 aan voorraad vrij.

De formule heeft bekende beperkingen: ze gaat uit van constante vraag, bekende kosten en geen capaciteitsbeperking, en de "kosten per omstelling" zijn moeilijk vast te stellen wanneer de omsteller toch betaald wordt. Lean-beoefenaars gebruiken haar daarom als argument voor de richting ("lagere omstellingskosten rechtvaardigen kleinere partijen"), niet als planningsregel. Een pull-systeem met [kanban](https://www.m365.fm/en/learn/kanban-pull-system/) en een op EPEI gebaseerde planning vervangt haar meestal [34].

### Capaciteitscontrole: kunt u zich meer omstellingen veroorloven?

Controleer vóór het verkleinen van de partijgroottes de capaciteitsbalans:

Benodigde tijd per week = Σ (vraag × cyclustijd) + aantal omstellingen × gemiddelde omsteltijd

Deze moet ruim onder de beschikbare tijd blijven. Bij een knelpunt is een kortere omstelling in de eerste plaats een capaciteitswinst; of u die besteedt aan kleinere partijen is een bewuste beslissing, die de [theorie van de beperkingen](https://www.m365.fm/en/learn/theory-of-constraints/) in detail behandelt. Bij een niet-knelpunt is er per definitie overcapaciteit, en het is meestal verstandiger de bespaarde omsteltijd te besteden aan frequentere omstellingen.

## Veiligheid: omstellingen, lockout/tagout en ergonomie

Geen van de twaalf veelgelezen pagina's die voor deze gids zijn geanalyseerd, behandelt lockout/tagout, hoewel vrijwel elk intern omstelelement plaatsvindt binnen de gevarenzone van een machine. In de VS is dit niet optioneel.

### Omstellen is onderhoud onder de lockout/tagout-norm van OSHA

De norm van OSHA voor de beheersing van gevaarlijke energie, 29 CFR 1910.147, geldt voor het onderhoud van machines en apparatuur waarbij onverwachte energievoorziening, opstart of vrijkomen van opgeslagen energie werknemers kan schaden [8]. In de definitie van "servicing and/or maintenance" zijn instellen en afstellen uitdrukkelijk opgenomen, en "setting up" wordt gedefinieerd als elk werk dat wordt uitgevoerd om een machine of apparatuur voor te bereiden op de normale productiewerking [8]. Een omstelling is daarom standaard een onderhoudsactiviteit onder de norm.

De norm vereist een gedocumenteerde procedure voor energiebeheersing, opleiding en een vaste toepassingsvolgorde: voorbereiding van de uitschakeling, uitschakeling van de machine, isolatie van de energiebronnen, aanbrengen van lockout- of tagout-middelen, afvoeren van opgeslagen energie en verificatie van de isolatie [8]. Werkgevers moeten elke energiebeheersingsprocedure minstens jaarlijks inspecteren [8].

### De uitzondering voor kleine onderhoudswerkzaamheden: smal, geen achterdeur

Een opmerking bij de reikwijdteparagraaf stelt kleine gereedschapswisselingen, afstellingen en andere kleine onderhoudswerkzaamheden die tijdens de normale productie plaatsvinden vrij, mits ze routinematig, repetitief en integraal onderdeel van het productiegebruik van de apparatuur zijn, en alleen als het werk wordt uitgevoerd met alternatieve maatregelen die effectieve bescherming bieden [8]. De eTool van OSHA over lockout/tagout legt uit dat zulke werkzaamheden dan vallen onder de eisen voor machinebeveiliging in Subpart O, en noemt voorbeelden van alternatieve maatregelen: speciaal ontworpen gereedschap, afstandsbediening, vergrendelde afschermingen, lokale scheidingsschakelaars en bedieningsschakelaars die uitsluitend onder controle staan van de werknemer die het werk uitvoert [9]. Als niet aan een onderdeel van de uitzondering wordt voldaan, geldt lockout/tagout [9].

Wat dit betekent voor SMED:

- Een volledige matrijs- of gereedschapswissel is doorgaans geen "kleine" gereedschapswissel tijdens normale productie; plan deze met lockout/tagout. Of een specifieke taak onder de uitzondering valt, is een juridisch en veiligheidstechnisch oordeel voor uw veiligheidsdeskundige, niet voor het SMED-team.
- SMED moet het vergrendelen sneller en eenvoudiger maken, nooit overslaan. Voorbeelden: vergrendelpunten gegroepeerd en gelabeld bij de machine, een vergrendelstation in de omsteltrolley, groepsvergrendelboxen voor parallel werk waarbij elke persoon zijn eigen slot aanbrengt, verificatiestappen opgenomen in het standaard omsteltblad.
- Een omsteltijdnorm die alleen gehaald kan worden door energie-isolatie over te slaan, is een verkeerde norm. Neem de vergrendeltijd op in het doel.

### Mechanische excenterpersen

Voor mechanische excenterpersen vereist OSHA een matrijsinstelprocedure die voldoet aan de regels voor beveiliging van het werkpunt, veerbelaste keerstangen waar de pers daarvoor is ontworpen, matrijsstoppen op hellende persen, veiligheidsblokken telkens wanneer matrijzen in de pers worden afgesteld of hersteld, en hulpmiddelen zoals borstels of drukpistolen, zodat operators en matrijsinstellers niet in het werkpunt reiken om te smeren [10]. Deze horen in elke standaard voor persomstelling thuis.

### Ergonomie

Omstellingen omvatten zwaar en ongemakkelijk handwerk: het tillen van matrijzen, formaatdelen en opspanninrichtingen, werken gebukt binnen beschermkappen, reiken naar bouten. OSHA beschrijft ergonomie als het afstemmen van de taak op de werknemer om musculoskeletale aandoeningen te verminderen [32]. SMED en ergonomie wijzen meestal in dezelfde richting: matrijswagens, rollenbanen, hefhulpmiddelen, opspanninrichtingen op heuphoogte en minder bouten zijn sneller en gemakkelijker voor het lichaam. Het risico zit in de snelheidsdoelen: wanneer een team wordt gedreven om de klok te verslaan, worden heftechnieken en tweepersoonstillen overgeslagen. Tijdsdoelen moeten zo worden gesteld dat ze in een houdbaar tempo haalbaar zijn.

### Veiligheidschecklist voor SMED-projecten

| Controle | Gedaan |
|---|---|
| Energiebronnen van de machine opgesomd (elektrisch, hydraulisch, pneumatisch, zwaartekracht, thermisch, chemisch) | ☐ |
| Huidige energiebeheersprocedure beoordeeld; omstelstappen onder lockout/tagout geïdentificeerd | ☐ |
| Veiligheidsdeskundige heeft elke claim beoordeeld dat een stap onder de uitzondering voor kleine onderhoudswerkzaamheden valt | ☐ |
| Vergrendel- en verificatiestappen opgenomen in het standaard omsteltblad, met tijd | ☐ |
| Parallel werk: elke persoon brengt zijn eigen slot aan; communicatiesignalen gedefinieerd | ☐ |
| Persen: matrijsinstelprocedure, veiligheidsblokken, keerstangen, matrijsstoppen gecontroleerd [10] | ☐ |
| Zware handelingen geïdentificeerd; hefhulpmiddelen of tweepersoonstillen vastgelegd | ☐ |
| Hete oppervlakken (voorverwarmde mallen, verwarmde matrijzen) geïdentificeerd; handschoenen en hanteren vastgelegd | ☐ |
| Nieuwe snelspanmiddelen gecontroleerd op klemkracht en storingsveilig gedrag | ☐ |
| Eerste omstelling volgens de nieuwe standaard geobserveerd door een leidinggevende | ☐ |

## Kwaliteit: goedkeuring van het eerste stuk, error proofing en gereguleerde line clearance

De aanloop en afstelling vormen het grootste deel van veel omstellingen [5]. Kwaliteitsproblemen na een omstelling hebben meestal dezelfde oorzaken: verkeerd gereedschap of verkeerd programma, instellingen uit het geheugen, ontbrekende controles van het eerste stuk, of een goedkeuring van het eerste stuk die wacht op een inspecteur die elders bezig is.

### Goedkeuring van het eerste stuk zonder wachttijd

- **Definieer de controle** in het standaard omstellingsblad: welke kenmerken, welk meetmiddel, welke steekproefomvang.
- **Breng het meetmiddel naar de machine** en leer de operator meten; een kwaliteitstechnicus keurt alleen goed waar het controleplan dat vereist.
- **Informeer de kwaliteitsafdeling vooraf** met de checklist vóór de omstelling, zodat de inspecteur aanwezig is wanneer het eerste stuk van de machine komt.
- **Registreer het resultaat van het eerste stuk** bij de order, zodat het traceerbaar is.

### Error proofing van de omstelling

[Poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/)-voorzieningen voorkomen of detecteren fouten [28]. Bij omstellingen zijn typische voorbeelden:

| Fout | Poka-yoke |
|---|---|
| Verkeerde matrijs of mal voor de order | Gecodeerde matrijs (RFID, barcode of mechanische sleutel) die de machinebesturing controleert tegen de order |
| Verkeerd programma of recept | Recept dat automatisch wordt opgeroepen op basis van het ordernummer |
| Slangen op de verkeerde aansluitingen | Meervoudige koppelplaten of koppelingen die maar op één manier passen, kleurgecodeerd |
| Formaatdeel in de verkeerde positie gemonteerd | Asymmetrische positioneerpennen |
| Oude etiketten of materialen op de lijn achtergelaten | Line clearance-checklist met handtekening; aparte containers voor verwijderd materiaal |

### Gereguleerde branches

In gereguleerde fabrieken is de omstelling onderdeel van het kwaliteitssysteem. In de Amerikaanse farmaceutische verpakking zijn de line clearance-inspectie vóór gebruik en de vastlegging ervan in het batchrecord vereist volgens 21 CFR 211.130(e) [11]. In de voedingsindustrie maken allergeenomstellingen deel uit van de allergeencontroles die vereist zijn onder 21 CFR 117.135(c)(2) [37]. In de automobielketen (IATF 16949) en lucht- en ruimtevaartketen (AS9100) kunnen controleplannen en klantspecifieke eisen verificatie van de afstelling of verificatie van het eerste stuk na afstellingen vereisen; controleer uw contracten en controleplannen in plaats van uit te gaan van een generieke regel. De gids [productieplanning voor de lucht- en ruimtevaart](https://www.m365.fm/en/learn/aerospace-production-planning/) behandelt de context van de luchtvaart. SMED-projecten in deze omgevingen moeten de kwaliteitsverantwoordelijke vanaf het begin betrekken en elke wijziging in reinigings- of verificatiestappen valideren voordat die wordt gebruikt.

### Statistische benadering

Een omstelling is ook een bron van variatie. Als onderdelen uit het begin van elke run systematisch afwijken, maakt een regelkaart die is opgesplitst in "eerste 30 minuten na de omstelling" versus "rest van de run" dat zichtbaar. Cakmakci gebruikte procesvermogen (Cpk) in een SMED-studie in de automobielindustrie om het verband tussen het verminderen van de omsteltijd en het ontwerp van de apparatuur te evalueren [16]. De gids [Six Sigma en root cause analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) behandelt capaciteitsanalyse en regelkaarten.

## Mensen en rollen: wie doet wat bij een omstelling

SMED wordt vaak beschreven als een technische methode. In de praktijk verandert het werk van operators en instellers echter meer dan welk ander lean-instrument ook, dus het slaagt of mislukt met hen.

### Rollen

| Rol | In het SMED-project | In de dagelijkse omstelling |
|---|---|---|
| Operator | Teamlid; kent de details, filmt en wordt gefilmd | Doet externe voorbereiding, delen van het interne werk, meting van het eerste stuk |
| Instelling / matrijsinsteller | Kernlid van het team; is eigenaar van de methode | Voert de interne wissel uit, leidt parallel werk |
| Onderhoudstechnicus | Bouwt en onderhoudt snelwisselhardware, koppelingen, klemmen | Ondersteunt complexe omstellingen; houdt matrijzen en mallen in goede staat |
| Productie-ingenieur | Faciliteert, analyseert video, ontwerpt technische oplossingen | Is eigenaar van de standaard; verbetert deze |
| Kwaliteitstechnicus | Definieert controles van het eerste stuk en foutpreventie | Keurt eerste stukken goed waar vereist |
| Supervisor | Is sponsor; maakt tijd vrij voor het team | Plant omstellingen met het schema; controleert naleving |
| Productieplanner | Spreekt af hoe bespaarde tijd wordt gebruikt; wijzigt lotgroottes | Plant orders zo dat de inspanning voor omstellingen minimaal is |
| Veiligheidsvertegenwoordiger | Beoordeelt energiebeheersing, ergonomie | Controleert lockout tijdens omstellingen |

### Wat verandert voor operators en instellers

SMED verschuift meestal het werk: operators nemen de externe voorbereiding en delen van de interne instelling over, en instellers besteden minder tijd aan zoeken en meer aan de technische stappen. Dat is een verandering in de inhoud van de functie. In fabrieken met vakbonden worden functiebeschrijvingen, classificaties en loonschalen vaak in de cao vastgelegd, dus spreek de nieuwe verdeling af met de vakbond voordat de nieuwe standaard ingaat. In fabrieken zonder vakbond komt dezelfde vraag informeel naar boven: wie wordt getraind, wie is verantwoordelijk als een eerste stuk faalt, en worden de nieuwe taken erkend?

### Respect voor mensen

Drie regels uit de praktijk maken het verschil tussen een SMED-project dat de werkvloer steunt en een project waar de werkvloer tegen in verzet komt:

1. **Film het proces, niet de persoon.** Leg het doel uit voordat je filmt. Laat de instelling eerst commentaar geven op de video; hij of zij weet meestal precies waar de verspilling zit. Informeer in fabrieken met vakbonden de vakbondsvertegenwoordigers vroeg en spreek af hoe video's worden opgeslagen en gebruikt.
2. **Zet bespaarde tijd niet om in personeelsreductie.** Als SMED tot ontslagen leidt, komen er bij het volgende verbeterproject geen ideeën meer van de werkvloer. Gebruik de tijd voor capaciteit, kleinere lotgroottes of training.
3. **Stel doelen die veilig haalbaar zijn.** Een omstellingsstandaard beschrijft een goede methode in een normaal tempo. Pitstop-vergelijkingen helpen om parallel werk en voorbereiding uit te leggen, maar een pitcrew traint op één stop onder racecondities; een instelling voert dezelfde omstelling uit aan het eind van een lange dienst, vele keren per jaar.

Vorne raadt aan te beginnen met "menselijke" verbeteringen, dat wil zeggen voorbereiding en organisatie, voordat technische wijzigingen worden doorgevoerd [20]; leanproduction.com doet dezelfde aanbeveling [19]. Die volgorde bouwt ook vertrouwen op: het team ziet snelle resultaten van de eigen ideeën voordat er geld wordt uitgegeven.

## SMED-sjablonen en checklists

De onderstaande sjablonen kunnen in een spreadsheet worden gekopieerd of op A3- of 11 × 17-inch vellen worden afgedrukt. Het zijn werkformats uit de praktijk, geen norm.

### Sjabloon 1: observatieblad omstelling (elementenlijst)

| # | Element (werkwoord + object) | Start (mm:ss) | Duur (min) | Persoon | I/E vandaag | Verspillingstype (zoeken, lopen, wachten, afstellen, overig) | Idee | Zou E kunnen zijn |
|---|---|---|---|---|---|---|---|---|
| 1 | Machine stoppen, laatste goede deel | 00:00 | | | I | | | |
| 2 | | | | | | | | |
| … | | | | | | | | |
| | **Totaal intern** | | | | | | | |
| | **Totaal extern** | | | | | | | |

Tips: één regel per element, werkwoorden vooraan ("losmaken", "lopen", "zoeken"), tijden uit de video afgelezen. Voeg een kolom "afgelegde afstand" toe als lopen een significant aandeel heeft.

### Sjabloon 2: werkblad omzetting intern naar extern

| Intern element | Waarom moet de machine stilstaan? | Wat zou moeten veranderen om het extern te maken? | Techniek (voorbereiden, functie standaardiseren, tussenmal) | Kosten (laag / middel / hoog) | Eigenaar | Deadline |
|---|---|---|---|---|---|---|
| Mal opwarmen | Mal warmt alleen op in de machine | Apart voorverwarmstation | Bedrijfsomstandigheden voorbereiden | Middel | | |
| Matrijs uitlijnen op het oog | Geen referentie | Centreerpen en aanslag | Functie standaardiseren | Laag | | |
| | | | | | | |

### Sjabloon 3: checklist voor de omstelling (externe voorbereiding)

| Onderdeel voor de volgende opdracht | Locatie | Gecontroleerd door | Tijd | OK |
|---|---|---|---|---|
| Matrijs / mal / formaatset nr. … (gekeurd, compleet, schoon) | Klaargezet bij machine, positie … | | | ☐ |
| Gereedschap (lijst), klemmen, reservebouten | Omstelwagen | | | ☐ |
| Materiaal / componenten (hoeveelheid, partij, indien nodig gedroogd) | | | | ☐ |
| Programma / recept vrijgegeven en geladen | Besturing | | | ☐ |
| Tekening, controleplan, meetmiddel eerste stuk | Wagen | | | ☐ |
| Verpakking en etiketten voor de volgende opdracht | | | | ☐ |
| Kraan / heftruck / tweede persoon gereserveerd voor tijdstip … | | | | ☐ |
| Kwaliteitstechnicus op de hoogte gebracht (indien goedkeuring vereist) | | | | ☐ |
| Vergrendelmiddelen en vergrendelprocedure bij de hand | Vergrendelpunt | | | ☐ |

Trigger: een vast tijdstip vóór het einde van de huidige run (bijvoorbeeld wanneer de laatste 45 minuten beginnen), zichtbaar op de machine of in de planning.

### Sjabloon 4: standaard omstelblad (versie met twee personen)

| Stap | Monteur A | Tijd (min) | Monteur B | Tijd (min) | Kernpunt (veiligheid / kwaliteit) |
|---|---|---|---|---|---|
| 1 | Machine stoppen, vergrendeling aanbrengen | 0–2 | Eigen vergrendeling aanbrengen | 0–2 | Controleer nulenergie voordat u de machine betreedt |
| 2 | Koppelingen ontkoppelen (bedienerszijde) | 2–4 | Koppelingen ontkoppelen (achterzijde) | 2–4 | Hete oppervlakken: handschoenen |
| 3 | Ontklemmen, oude mal uitnemen | 4–8 | Kraan begeleiden, plaatsen op wagen | 4–8 | Signaal voor tweepersoonstilheffen |
| … | | | | | |
| n | Controle eerste stuk, vrijgave | | Oude mal terugbrengen naar opslag | | Resultaat eerste stuk registreren |
| | **Doeltijd verstreken** | | | | |

### Sjabloon 5: audit omstelling (wekelijks gedurende de eerste maand, daarna maandelijks)

| Vraag | Ja / Nee | Opmerking |
|---|---|---|
| Is de checklist voor de omstelling voltooid vóór de stilstand? | | |
| Is de standaardvolgorde gevolgd? | | |
| Zijn vergrendeling en verificatie uitgevoerd zoals voorgeschreven? | | |
| Waren alle gereedschappen en onderdelen op het gebruikspunt (geen zoeken)? | | |
| Is de controle van het eerste stuk uitgevoerd zoals gedefinieerd? | | |
| Is de omsteltijd geregistreerd (laatste goede deel tot eerste goede deel)? | | |
| Afwijking van het doel, oorzaak geregistreerd? | | |
| Verbeteridee van de ploeg vastgelegd? | | |

### Sjabloon 6: SMED-projectcharter (één pagina)

| Veld | Inhoud |
|---|---|
| Machine / lijn | |
| Probleem (met gegevens) | bv. gemiddelde omsteltijd 96 min, bereik 78–131 min, 11 dagen voorraad |
| Doel | bv. −50% in de eerste cyclus, elke mal elke 3 dagen |
| Gebruik van de bespaarde tijd (afgestemd met planning) | capaciteit / kleinere lots / splitsen |
| Team | namen en rollen |
| Veiligheidsbeoordeling uitgevoerd door | |
| Planning | data nulmeting, workshop, implementatie, standaardisatie |
| Budgetlimiet voor hardware | |
| Opdrachtgever | |

## Uitrolroadmap: van een pilot naar een fabriekbreed omstelsysteem

De onderstaande planning is een schatting van praktijkdeskundigen voor een middelgrote discrete fabriek; de tijdsduur hangt af van apparatuur, levertijden van hardware en hoeveel tijd het team krijgt [unverified: schatting van praktijkdeskundigen, geen gegevens uit meerdere fabrieken].

| Fase | Tijdsduur | Activiteiten | Resultaat |
|---|---|---|---|
| 1. Voorbereiden | Weken 1–3 | Kies pilotmachine, verzamel nulmeting gedurende minstens twee weken [19], projectopdracht, veiligheidsbeoordeling, afspraken over het gebruik van de bespaarde tijd | Projectopdracht ondertekend, nulmeting bekend |
| 2. Pilotworkshop | Week 4 (3–5 dagen) | Filmen en analyseren van de omstelling, scheiden van interne en externe handelingen, snelle verbeteringen op de vloer, eerste proef met de nieuwe volgorde | Eerste nieuwe standaard, actielijst |
| 3. Implementeren | Weken 5–10 | Hardware (koppelingen, klemmen, karren), voorverwarmen of vooraf instellen, tweede proef, training van alle ploegen | Nieuwe standaard getraind |
| 4. Stabiliseren | Weken 11–16 | Dagelijkse KPI op het bord, wekelijkse audits, aanpassen van lotgroottes en planning | Stabiele tijd, kleinere loten |
| 5. Uitrollen | Maanden 5–12 | Volgende 3–5 machines, interne SMED-coaches opgeleid, omstelstandaard als onderdeel van specificaties voor nieuwe apparatuur | Omstelsysteem over het hele gebied |

### Kiezen van de volgende machines

Rangschik kandidaten op effect en inspanning:

| Criterium | Gewicht | Vraag |
|---|---|---|
| Bottleneck | Hoog | Is de machine de beperking van de waardestroom? |
| Omstellingsfrequentie × duur | Hoog | Hoeveel uren per week gaan verloren aan omstellingen? |
| Voorraad- / doorlooptijdprobleem | Gemiddeld | Zorgt deze machine voor grote loten en veel voorraad stroomafwaarts? |
| Variatie in omstelltijd | Gemiddeld | Is de spreiding groot (een teken van ontbrekende standaarden)? |
| Teamgereedheid | Gemiddeld | Is de ploeg bereid en steunt een leidinggevende het project? |
| Hardware-inspanning | Laag (negatief) | Is een grote investering nodig voordat er resultaten zijn? |

### Maak omstellingen een ontwerpeis

Het goedkoopste SMED-project is het project dat je niet nodig hebt. Neem omstelvereisten op in de specificaties voor nieuwe apparatuur, gereedschap en mallen: maximale omstelltijd, gestandaardiseerde klemhoogten en koppelingen, opgeslagen instellingen, geen afstellen. Braglia en collega's stellen een gestructureerde methode voor, quick changeover design (QCD), die machinebouwers helpt om vanaf het begin te ontwerpen voor snelle omstellingen [15]. Inkoop en engineering moeten hier de eigenaar van zijn, niet alleen het lean-team.

## Omsteltijd-KPI's: hoe je voortgang meet

| KPI | Formule / definitie | Waarom het belangrijk is | Typische beoordeling |
|---|---|---|---|
| Gemiddelde omsteltijd | Σ omsteltijden / aantal omsteltijden (laatste goede naar eerste goede stuk) | Hoofdresultaat | Dagelijks per machine, wekelijkse trend |
| Bereik of standaarddeviatie van omsteltijd | Max − min, of standaarddeviatie over de laatste 20 omsteltijden | Laat zien of er een standaard bestaat en of die wordt gevolgd | Wekelijks |
| Omsteltijden binnen standaard | Omsteltijden ≤ doeltijd / alle omsteltijden × 100% | Naleving | Dagelijks op het bord |
| Interne insteltijd | Som van interne elementen | Voortgang van scheiding en conversie | Per SMED-cyclus |
| Opstartijd en uitval | Tijd en uitval vanaf herstart tot standaardsnelheid en -kwaliteit | Vaak het grootste verborgen verlies | Per omsteltijd |
| Eerste stuk goed bij eerste keer | Eerste stukken goedgekeurd bij eerste controle / alle eerste stukken × 100% | Kwaliteit van de omstelling | Wekelijks |
| Aantal omsteltijden per week | Telling | Laat zien of winst wordt benut voor kleinere series | Wekelijks met planning |
| Aandeel omsteltijd in geplande tijd | Σ omsteltijd / geplande productietijd × 100% | Capaciteitsoverzicht | Wekelijks |
| EPEI | Interval waarin alle onderdelen één keer worden geproduceerd | Flexibiliteit | Maandelijks |
| Gemiddelde partijgrootte en voorraaddagen | Stuks per partij; voorraad / gemiddelde dagelijkse vraag | Bedrijfsresultaat | Maandelijks |
| OEE-beschikbaarheid | Zoals gedefinieerd in uw OEE-schema | Effect op machineniveau, als de tijd wordt gebruikt om te produceren | Wekelijks |

Houd het bord eenvoudig: één grafiek per machine met de dagelijkse omsteltijden tegen het doel, en één regel voor de reden wanneer een omstelling het doel overschreed. De algemene regels voor KPI-borden staan in de gids [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/).

**Een opmerking over doelen:** "onder tien minuten" is Shingo's streefbeeld, geen universele maatstaf. Een goede omsteltijd is er een die stabiel, veilig en kort genoeg is om de EPEI te ondersteunen die uw klanten nodig hebben. Voor een grote persstraat kunnen 20 minuten uitstekend zijn; voor een kleine CNC-draaibank kunnen 20 minuten traag zijn.

## De businesscase: kosten, ROI en voorraadverwerking

Financiële teams stellen drie vragen over SMED: wat kost het, wat levert het op, en wanneer zie je het terug in de cijfers. De antwoorden hangen sterk af van de vraag of de machine een knelpunt is.

### Kosten

| Kostenpost | Typische aard | Verwerking |
|---|---|---|
| Teamtijd voor workshop en opvolging | Uren van operators, instellers, engineers | Bedrijfskosten |
| Goedkope hulpmiddelen (karren, schaduwborden, afstandsblokken, kleurcodering) | Klein | Meestal bedrijfskosten, afhankelijk van uw activeringsgrens |
| Snelwisselhulpmiddelen (koppelingen, klemsystemen, voorverwarmers, presetters) | Middel tot hoog | Vaak investering als deze boven uw grens ligt |
| Training | Uren | Bedrijfskosten |
| Productieverlies tijdens proefdraaien | Meestal klein als proefdraaien plaatsvindt tijdens geplande omstellingen | Bedrijfskosten |

### Opbrengsten

1. **Capaciteit bij een knelpunt:** bespaarde omsteluren × contributiemarge per uur, als de extra output verkocht kan worden. In het CNC-voorbeeld hierboven kosten de 590 minuten omstelling per week ongeveer $92.000 per jaar aan verloren marge; halveren levert ongeveer $46.000 per jaar op, maar alleen als de extra output afnemers vindt.
2. **Voorraadreductie:** een eenmalige vrijgave van kasgeld (balans) plus doorlopende besparing op voorraadkosten (resultatenrekening).
3. **Minder spoedopdrachten en haastige omstellingen:** overwerk, toeslagvracht en verstoring van gepland werk.
4. **Uitval en herbewerking:** kortere en stabielere opstartfasen.
5. **Arbeid:** soms lager, vaak vergelijkbaar; parallel werk verkort de doorlooptijd, maar niet altijd de arbeidsinhoud.

### Uitgewerkt ROI-voorbeeld (illustratief, vervolg op het spuitgietvoorbeeld)

| Post | Bedrag |
|---|---|
| Investering: voorverwarmstation | $12.000 |
| Investering: 6 sets multi-koppelingen à $1.500 | $9.000 |
| Investering: standaardisatie van klemmen en positioneringen | $6.000 |
| Teamtijd: 6 personen × 16 uur × $45 belast tarief | $4.320 |
| **Totale eenmalige kosten** | **$31.320** |
| Afname van eindproductvoorraad met 5 dagen tegen $6.000 per dag aan kostprijs van de omzet | $30.000 eenmalige kasvrijmaking |
| Bespaarde voorraadkosten tegen 20% per jaar over $30.000 | $6.000 per jaar |
| Minder spoedorders en overwerk (schatting op basis van de registraties van vorig jaar) | $8.000 per jaar |
| Ramp-upuitval: 15 minder uitvalschoten per omstelling × 10 omstellingen × 50 weken × $0,90 | $6.750 per jaar |
| **Terugkerend voordeel** | **$20.750 per jaar** |
| **Eenvoudige terugverdientijd op terugkerende voordelen** | 31.320 / 20.750 ≈ 1,5 jaar |

De uit de voorraad vrijgekomen liquiditeit ($30.000) dekt de investering in het eerste jaar bijna, maar het is een effect op de balans, geen winst. Houd deze in het businesscase gescheiden en tel dezelfde besparing niet twee keer mee.

### Het effect van absorptiekostprijsberekening

Bij absorptiekostprijsberekening [38], die in de praktijk vereist is onder US GAAP voor externe voorraadverslaggeving (ASC 330-10-30-1 en 30-3 omvatten een toerekening van vaste productieoverhead op basis van normale capaciteit, en 330-10-30-8 stelt dat het uitsluiten van alle overhead uit de voorraadkostprijs geen aanvaarde boekhoudkundige procedure is [40]; vraag uw controller hoe uw bedrijf dit toepast), wordt een deel van de vaste productieoverhead in de voorraad geactiveerd. Wanneer de voorraad daalt, wordt de overhead die in de verminderde voorraad was geactiveerd in die periode naar de kostprijs van de omzet overgeboekt. De gerapporteerde winst kan daardoor tijdelijk dalen terwijl de voorraad afneemt, ook al verbetert de liquiditeit.

**Uitgewerkt voorbeeld (illustratief):** Als 30 procent van de voorraadwaarde van $30.000 uit vaste overhead bestaat, komt bij de voorraadreductie ongeveer $9.000 aan overhead vrij in de kostprijs van de omzet van die periode. Fabrieksmanagers moeten dit aan het management uitleggen voordat het SMED-programma start, zodat een lean-succes niet eruitziet als een kostenoverschrijding. De gids [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) bespreekt hoe zulke effecten op een fabrieksscorecard gepresenteerd kunnen worden.

## SMED en andere lean-tools

SMED werkt zelden op zichzelf. Het is afhankelijk van een aantal tools en maakt andere mogelijk.

| Tool | Relatie tot SMED |
|---|---|
| [5S](https://www.m365.fm/en/learn/5s-visual-management/) | Voorwaarde: gereedschap en mallen op vaste plaatsen elimineren het zoeken, de grootste externe verspilling [27] |
| [Standaardwerk](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) | Borgt de winst: de nieuwe omstelling wordt de standaard [26] |
| [TPM](https://www.m365.fm/en/learn/tpm-oee/) | Houdt matrijzen, mallen en snelwisselhardware in goede staat; leanproduction.com adviseert eerst TPM wanneer storingen, en niet omstellingen, de verloren tijd domineren [19][29] |
| [Poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/) | Voorkomt verkeerd gereedschap, verkeerde programma's of verkeerde aansluitingen [28] |
| [Kanban en pull](https://www.m365.fm/en/learn/kanban-pull-system/) | Gebruikt kleinere lotgroottes; kanban-hoeveelheden worden kleiner naarmate omstellingen korter worden [34] |
| [Heijunka](https://www.m365.fm/entity/heijunka/) | Egalisatie op mix vereist frequente, korte omstellingen [25] |
| [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) | Toont welke omstellingen voorraad en doorlooptijd bepalen; omstellingstijd en EPEI zijn gegevens in het databox [35] |
| [Kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/) | De SMED-workshop is een klassiek kaizen-evenement |
| [Theory of constraints](https://www.m365.fm/en/learn/theory-of-constraints/) | Richt de SMED-inspanning eerst op de knelpunt, waar bespaarde tijd systeemoutput is |
| [Productieplanning en APS](https://www.m365.fm/en/learn/production-scheduling-aps/) | Plant orders zo dat de omstelinspanning minimaal is en maakt kortere omstellingen tot kleinere lotgroottes mogelijk |

## Gedocumenteerde SMED-voorbeelden

Veel webpagina's noemen "typische" reducties van 50 tot 90 procent zonder bron. De onderstaande voorbeelden zijn gedocumenteerd, met hun beperkingen.

### Toyota-persomstellingen

Wikipedia, gebaseerd op Shingo's boeken, meldt dat de omstellingen bij Toyota in de jaren zestig van uren naar 15 minuten en in de jaren zeventig naar 3 minuten daalden [5]; Shingo's eigen verslag beschrijft matrijswisselingen van één tot twee uur, soms een halve dag, die na zijn indiensttreding bij Toyota in 1969 tot enkele minuten werden teruggebracht [6]. Een open engineering-leerboek meldt dat een omstelling van een pers van 1.000 ton bij Toyota van vier uur naar drie minuten werd teruggebracht [36]. De cijfers komen uit Shingo- en Toyota-verslagen en zijn niet onafhankelijk gecontroleerd, maar ze zijn consistent over de bronnen heen.

### Brighton NC Machine Corporation (Michigan, NIST MEP)

Brighton NC Machine, een fabrikant in Michigan met meer dan 100 medewerkers, werkte samen met het Michigan Manufacturing Technology Center, onderdeel van het NIST MEP National Network [17]. Voor het project konden omstellingen alleen in de eerste ploeg worden uitgevoerd, duurden 8 uur en 20 minuten en vereisten 9.121 voet looppad voor medewerkers [17]. Een kaizen-evenement met video, een spaghettidiagram en een omstelanalyseschema leidde tot een reductie van 70 procent in omstellingstijd en 98 procent minder looptijd; het bedrijf meldde $460.000 aan nieuwe omzet en $125.000 aan kostenbesparing [17]. De resultaten zijn zoals gerapporteerd door het bedrijf en MEP; MEP-succesverhalen zijn door klanten gerapporteerd.

### Shingo's adviesgevallen

Shingo meldde dat over zijn omstelreductiegevallen tussen 1975 en 1985 de omstellingstijden gemiddeld daalden tot ongeveer 2,5 procent van het oorspronkelijke niveau [5]. Dat is een gemiddelde van geselecteerde gevallen van de uitvinder van de methode, en dus een bovengrens als maatstaf en geen verwachting.

### Onderzoeksoverzicht

Een state-of-the-art review van da Silva en Godinho Filho in de *International Journal of Advanced Manufacturing Technology* (2019) classificeerde 130 artikelen over SMED naar gebied, methode, tools, implementatie en resultaten [14]. De literatuur laat SMED zien in de automobielindustrie, metaalbewerking, verpakking, drukkerijen, voedingsmiddelen en farmaceutische omgevingen. Een geval uit de drukkerijsector dat in een open leerboek wordt genoemd, meldde een reductie van 46 procent in interne omstellingstijd [36]. Gepubliceerde gevallen melden doorgaans successen; mislukte of verlopen projecten worden zelden beschreven, dus behandel gemiddelden uit de casusliteratuur met voorzichtigheid.

## Veelvoorkomende SMED-fouten

| Fout | Waarom het schadelijk is | Beter |
|---|---|---|
| Geen besluit over hoe de bespaarde tijd wordt gebruikt | Winst verdwijnt in wachttijd; de lotgroottes blijven gelijk | Vooraf met de planning afspreken: capaciteit, kleinere lotgroottes of splitsing |
| Eerst hardware kopen | Automatiseert verspilling; budget op voordat de organisatie op orde is | Eerst scheiden en omzetten uitputten; mechanisatie als laatste [5] |
| Alleen de "wissel" meten | Mist het opstarten en afstellen, vaak het grootste deel | Van laatste goede stuk tot eerste goede stuk bij standaardsnelheid [2] |
| Filmen zonder uitleg | Ploeg voelt zich bekeken; weerstand | Doel uitleggen, de afsteller bij de analyse betrekken, afspreken hoe de video wordt gebruikt |
| Pilot op de moeilijkste machine | Lang, kostbaar, trage resultaten | Pilot met een omstelling van 30–90 minuten die vaak voorkomt |
| Eén "held"-omstelling | Recordtijd met ingenieurs aanwezig, niet herhaalbaar | Standaardiseren, alle ploegen opleiden, over weken meten |
| Vergrendeling/labeling overslaan om tijd te besparen | Ernstig letselrisico; overtreding van OSHA-voorschriften | Vergrendeling in de standaard opnemen; sneller maken, nooit overslaan [8] |
| Geen standaard en geen audit | Tijden glijden binnen enkele maanden terug | Standaard omsteltblad, audits, KPI op het bord |
| Het schema negeren | Willekeurige volgordes veroorzaken volledige omstellingen die gedeeltelijk zouden kunnen zijn | Sequencing per productfamilie; omstellingen op vaste tijdstippen plannen |
| Een omstelling starten vlak voor de ploegwissel | Overdracht midden in de interne omstelling; stappen worden overgeslagen of herhaald, vergrendelingen wisselen van handen | Omstellingen zo plannen dat één ploeg ze afrondt, of een formeel overdrachtsmoment definiëren met overdracht van de vergrendeling zoals uw energiebeheerprocedure vereist |
| Omsteltkosten in het planningssysteem nooit bijgewerkt | ERP blijft grote lotgroottes berekenen | Omsteltijden en lotgroottregels in het ERP bijwerken na SMED |
| SMED behandelen als eenmalig project | Geen tweede cyclus; de hardwarefase komt nooit | Cycli plannen; SMED onderdeel maken van de verbeterroutine |

Het op één na laatste punt wordt gemakkelijk over het hoofd gezien. Veel ERP-systemen berekenen lotgroottes op basis van omsteltijden die in routings zijn opgeslagen. Blijven die op de oude waarden staan, dan blijft het planningssysteem de oude grote lotgroottes aanbevelen. De gids [S&OP and MRP](https://www.m365.fm/en/learn/sop-mrp-production-planning/) legt uit waar deze parameters zich bevinden.

## Beperkingen en kritiek op SMED

SMED is een van de best gedocumenteerde lean-methoden, maar het kent beperkingen, en de onderzoeksliteratuur heeft die aangewezen.

### 1. Te veel organisatie, te weinig ontwerp

McIntosh en collega's stelden in 1996 dat de wijdverbreide interpretatie van SMED ertoe heeft geleid dat praktijkmensen de voorkeur geven aan goedkope, teamgerichte organisatorische veranderingen en oplossingen op ontwerpniveau over het hoofd zien die omsteltijden fundamenteler zouden kunnen verbeteren; zij besteedden in het bijzonder aandacht aan het probleem van het borgen van verbeteringen [13]. Dezelfde onderzoeksgroep publiceerde later een kritische evaluatie van de methodologie van Shingo in de *International Journal of Production Research* (2000) [12]. Cakmakci's studie in de automobielindustrie koppelt omsteltproblemen op vergelijkbare wijze aan ontoereikende apparatuur en matrijsontwerp [16], en Braglia en collega's ontwikkelden een ontwerp voor snelle omstelling om omsteelcapaciteit in het machineontwerp te verankeren [15]. De praktische conclusie: voer SMED-workshops uit, maar leg omstelvereisten ook vast in specificaties voor nieuwe apparatuur en productontwerpen.

### 2. De winst borgen

Omsteltijden hebben de neiging terug te glijden wanneer de standaard niet aan nieuwe medewerkers wordt getraind, de omstelwagen zijn gereedschap kwijtraakt of snelwisselhulpmiddelen niet worden onderhouden. McIntosh en collega's noemden het borgen een centrale zwakte [13]. De tegenmaatregelen zijn onopvallend: standaardwerk, audits, een KPI op het bord en onderhoud van de hardware onder TPM.

### 3. Niet elk proces profiteert even sterk

- **Procesindustrieën** (chemie, voeding, farma) hebben omsteltijden die vaak worden bepaald door reiniging, validatie en verplichte controles. SMED verkort het werk eromheen, maar campagneplanning en productvolgorde (licht voor donker, allergeenvrij eerst) kunnen zwaarder wegen.
- **Job shops met veel variatie en kleine volumes** kennen veel unieke opstellingen die maar één keer voorkomen. Element-voor-element-analyse van een enkele opstelling levert dan minder op; gestandaardiseerde opspanning, gereedschapsbibliotheken, offline programmeren en groeperen per artikelfamilie leveren meer op.
- **Machines met overcapaciteit en lage voorraden** profiteren weinig van SMED. Controleer eerst het aandeel van omsteltijden in het verlies [19].

### 4. Winst die de bottom line niet bereikt

Als de bespaarde tijd niet wordt benut (zie de drie opties hierboven), verbetert SMED een getal op een grafiek en verder niets. De methode kan dat niet voorkomen; het management moet dat doen, en dit is de meest voorkomende reden waarom SMED teleurstelt.

### 5. Druk op mensen

Snelheidsdoelen en stopwatches kunnen druk, gehaaste werkwijzen en snelkoppelingen rond veiligheid veroorzaken. De methode zelf vereist dat niet, maar de implementatie ervan kan het wel. Goede praktijk stelt doelen op een houdbaar tempo, beschermt de vergrendelingstijd en gebruikt bespaarde tijd niet om banen te schrappen.

## SMED gaat digitaal: data, video, MES en planning

Digitale hulpmiddelen vervangen de SMED-methode niet, maar ze maken de analyse sneller en de resultaten makkelijker vast te houden.

### Omsteltijden automatisch meten

Handmatige omstelregistraties zijn vaak onvolledig. Machinebewakingssystemen kunnen omstellingen herkennen aan machinetoestanden en stukaantallen, zodat elke omstelling zonder papierwerk een starttijd, eindtijd en duur krijgt. Leveranciers zoals MachineMetrics stellen dat automatische dataregistratie betrouwbaarder is dan handmatig loggen [21] (vendor claim). De operator moet nog steeds de reden invoeren wanneer een omstelling langer duurt. De gids over het [manufacturing execution system (MES) en ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) legt uit hoe zulke data past in de systeemarchitectuur van de fabriek, en [Manufacturing IT met Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) behandelt cloudopties om die data te verzamelen.

Snelwisselhardware wordt steeds vaker verbonden: gecodeerde matrijzen en mallen die de besturing controleert tegen de order, receptdownloads, klemsystemen met sensoren. Elk daarvan is een OT-asset op het fabrieksnetwerk, met dezelfde vragen over patching en toegang als elke besturing; de gids over [OT-cyberbeveiliging en ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) behandelt hoe je ze beveiligt.

### Videoanalyse

Video van een smartphone of actiecamera is voor de meeste SMED-workshops voldoende. Software waarmee het team de video in elementen kan knippen en die als intern of extern kan markeren, bespaart uren handmatig tijdwerk. Maak afspraken over gegevensbescherming: wie de video's ziet, hoe lang ze worden bewaard, en dat ze niet worden gebruikt voor individuele prestatiebeoordeling.

### Digitale werkinstructies en recepten

Digitale werkinstructies kunnen automatisch wisselen met de order, het standaard omstelblad stap voor stap met afbeeldingen tonen, en het resultaat van het eerste stuk vastleggen; dit wordt behandeld in het cluster over [papierloze productie](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/). Receptbeheer, waarbij machine-instellingen per product worden opgeslagen en vanuit de order worden gedownload, haalt het bijstellen weg als bron van tijdverlies en fouten. In gereguleerde industrieën moeten beide worden gevalideerd.

### Plannen met volgorde-afhankelijke omstellingen

Wanneer omsteltijden afhangen van de volgorde (licht naar donker, klein naar groot formaat, allergeenvrij eerst), kan een planningstool orders zo rangschikken dat de totale omsteltijd minimaal is. Advanced planning and scheduling (APS)-systemen kunnen volgorde-afhankelijke omstelmatrices modelleren; de gids over [productieplanning en APS](https://www.m365.fm/en/learn/production-scheduling-aps/) behandelt hoe ze werken en wat ze van de productievloer nodig hebben. De omstelmatrix in het APS-systeem moet na elke SMED-cyclus worden bijgewerkt, anders optimaliseert de planner op basis van oude tijden.

### Simulatie en waardestroommodellen

Voordat een fabriek de lotgroottes in een waardestroom verkleint, kan ze het effect van kortere omstellingen op EPEI, voorraad en doorlooptijd testen in een waardestroommodel of een discrete-event-simulatie. De gids over de [digital twin in de productie](https://www.m365.fm/en/learn/digital-twin-manufacturing/) en het cluster over [productiesimulatie](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) leggen de aanpak uit. Waardestroomsoftware zoals iFAKT Polaris is een voorbeeld van een tool die omsteltijden en lotgroottes per processtap bijhoudt en het effect ervan op de waardestroom berekent; zie het profiel [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/). **Let op: de auteur werkt bij iFAKT GmbH.**

### Grenzen

Digitale hulpmiddelen versterken een werkstandaard; ze creëren er geen. Een dashboard van machinebewaking dat omstellingen van 90 minuten toont, verandert niets zolang een team de omstelling niet filmt en oplost. Begin met papier en video, en digitaliseer de dataverzameling zodra de standaard en de KPI-routine werken.

## SMED-woordenlijst

| Term | Betekenis |
|---|---|
| **Afstelling** | Afstellen door trial-and-error na het monteren van een gereedschap; de grootste categorie van omsteltijd in Shingo's indeling [5] |
| **Omstelling** | Een machine of lijn overschakelen van het ene product naar het andere; ook setup genoemd [2] |
| **Omsteltijd** | Tijd vanaf het laatste goede stuk van de oude serie tot het eerste goede stuk van de nieuwe serie [2], bij voorkeur bij standaardsnelheid |
| **Omsteltrolley** | Trolley met alle gereedschappen en onderdelen voor een omstelling, in de volgorde van gebruik |
| **Cyclusvoorraad** | Voorraad die ontstaat door lotgroottes; bij gelijkblijvende vraag gemiddeld ongeveer een halve lot |
| **Matrijs** | Gereedschap in een pers om materiaal te snijden of te vormen; de oorsprong van de "D" in SMED |
| **ECRS** | Elimineren, combineren, rangschikken, vereenvoudigen: verbetervragen uit Training Within Industry, gebruikt in Toyota's programma voor snelle matrijswissel [5] |
| **EOQ / EPQ** | Economische bestelhoeveelheid / economische productiehoeveelheid: formules voor lotgroottes die omstel- en voorraadkosten in evenwicht brengen |
| **EPEI / EPEx** | Every part (product) every interval: hoe vaak een proces alle onderdelen (producten) doorloopt [3] |
| **Externe omstelling** | Omstelwerk dat kan worden uitgevoerd terwijl de machine draait [1] |
| **Goedkeuring eerste stuk** | Controle van het eerste onderdeel na een omstelling voordat de productie doorgaat |
| **Functionele klem** | Bevestiging die met één beweging klemt, zoals een nokhendel of een kwartslag-schroef [5] |
| **Tussenstuk** | Standaarddrager (pallet, subplaat) waarop het volgende gereedschap of werkstuk buiten de machine wordt voorbereid [5] |
| **Interne omstelling** | Omstelwerk dat alleen kan worden uitgevoerd terwijl de machine stilstaat [1] |
| **Lijnvrijmaking** | Controle dat alle materialen van de vorige serie zijn verwijderd voordat de volgende begint; vereist in de Amerikaanse geneesmiddelenverpakking [11] |
| **Lockout/tagout (LOTO)** | Procedures en voorzieningen om gevaarlijke energie te beheersen tijdens onderhoud, inclusief instellen, volgens 29 CFR 1910.147 [8] |
| **Uitzondering voor klein onderhoud** | Smalle uitzondering op lockout/tagout voor routinematige, repetitieve en integrale kleine gereedschapswissels tijdens normale productie, met effectieve alternatieve bescherming [8][9] |
| **OTED** | One-touch exchange of die: omstelling in minder dan 100 seconden [5] |
| **Parallelle werkzaamheden** | Twee of meer personen die tegelijk aan een omstelling werken volgens een vastgelegde volgorde [5] |
| **Snelle omstelling (QCO)** | Veelgebruikte Amerikaanse term voor de SMED-praktijk [18] |
| **Recept** | Opgeslagen set machineparameters per product, die wordt geladen in plaats van handmatig ingesteld |
| **Opstartfase** | Fase na het herstarten tot er goede stukken komen op standaardsnelheid |
| **Veiligheidsblokkering** | Blokkering die tussen de matrijshelften van een pers wordt geplaatst terwijl matrijzen worden afgesteld of hersteld; door OSHA vereist voor mechanische krachtpersen [10] |
| **Omstelanalyseschema** | Elementenlijst van een omstelling met tijden en de indeling intern/extern [17] |
| **Spaghettidiagram** | Tekening van looppaden op een indeling |
| **Standaardiseer functie, niet vorm** | Alleen de kenmerken van een gereedschap standaardiseren die met de machine samenwerken, zoals de klemhoogte [5] |
| **3 Ups** | Opruimen, instellen, opstarten: een eenvoudig model van de fasen van een omstelling [24] |

## FAQ: SMED en omsteltijd-vragen

### Wat betekent SMED?

SMED staat voor single-minute exchange of die (soms geschreven als "dies"). "Single-minute" betekent een getal van één cijfer aan minuten, dus een omstelling van minder dan tien minuten [1]. De methode geldt voor elke omstelling, niet alleen voor persgereedschappen.

### Wie heeft SMED uitgevonden?

Shigeo Shingo (1909–1990), een Japanse industrieel ingenieur, ontwikkelde de methode vanaf de jaren vijftig, met werk bij Toyo Kogyo (Mazda), Mitsubishi Heavy Industries en, vanaf 1969, Toyota [6]. Hij publiceerde haar in 1985 in het Engels als *A Revolution in Manufacturing: The SMED System* [6].

### Wat zijn de stappen van SMED?

Observeer en leg de omstelling vast, scheid interne van externe elementen, zet interne om naar externe elementen, stroomlijn de interne elementen, stroomlijn de externe elementen, standaardiseer en herhaal [5]. Deze gids voegt er vooraf een voorbereidingsstap aan toe (pilot, team, veiligheidscontrole, gebruik van de bespaarde tijd).

### Wat is het verschil tussen interne en externe omstelling?

Interne omstelling kan alleen worden uitgevoerd terwijl de machine stilstaat, zoals het monteren van een matrijs. Externe omstelling kan worden uitgevoerd terwijl de machine draait, zoals het ophalen en controleren van de volgende matrijs [1]. SMED verplaatst zoveel mogelijk werk van intern naar extern.

### Hoe bereken je de omsteltijd?

Meet vanaf het laatste goede deel van de vorige run tot het eerste goede deel van de nieuwe run bij standaardsnelheid [2][21]. De gemiddelde omsteltijd is de som van alle omsteltijden gedeeld door het aantal omstellingen; het omsteldeel is de totale omsteltijd gedeeld door de geplande productietijd. Zie de formules en het CNC-voorbeeld in de meetsectie.

### Wat is het verschil tussen omsteltijd en insteltijd?

In het dagelijks gebruik vallen ze vaak samen, hoewel sommige bronnen ze expliciet scheiden [23]. Strikt genomen gebruiken veel praktijkmensen "insteltijd" voor de wisseling zelf en "omsteltijd" voor het totale verlies van het laatste goede deel tot het eerste goede deel, inclusief uitloop en opstart. Gebruik de bredere definitie voor verbeterwerk.

### Wat is een goede omsteltijd?

Shingo's streefwaarde is minder dan tien minuten [1]. Een praktisch antwoord: een goede omsteltijd is stabiel (smalle spreiding), veilig en kort genoeg om de partijgroottes en EPEI te ondersteunen die uw klanten nodig hebben. Voor grote perslijnen kan 20 minuten uitstekend zijn; voor een kleine machine kan het traag zijn.

### Wat is OTED?

One-touch exchange of die: een omstelling in minder dan 100 seconden [5]. Het is het volgende doel na SMED, meestal alleen bereikbaar met speciale snelwisselhardware.

### Hoe hangt SMED samen met OEE?

Omsteltijden worden in OEE meestal geboekt als beschikbaarheidsverlies en opstartuitval als kwaliteitsverlies [4]. Kortere omsteltijden verhogen de OEE-beschikbaarheid alleen als de bespaarde tijd wordt gebruikt om te produceren. Als de tijd wordt gebruikt voor frequentere omstellingen, kan de OEE gelijk blijven terwijl voorraad en doorlooptijd verbeteren.

### Vereist SMED lockout/tagout?

In de VS valt het inrichten onder "servicing and/or maintenance" in de OSHA-norm voor lockout/tagout, 29 CFR 1910.147, dus interne omstellingsstappen op apparatuur met gevaarlijke energie vallen er standaard onder [8]. Een smalle uitzondering geldt voor kleine gereedschapswisselingen tijdens normale productie die routinematig, repetitief en integraal zijn, en alleen met effectieve alternatieve bescherming [8][9]. Laat uw veiligheidsdeskundige bepalen welke stappen daarvoor in aanmerking komen.

### Wat is EPEI en hoe verandert SMED dat?

EPEI (every part every interval; LEI: EPEx) is de tijd waarin een proces al zijn artikelnummers één keer produceert [3]. Het hangt af van de omsteltijden en het aantal onderdelen. Een veelgebruikte formule is de totale omsteltijd voor alle onderdelen gedeeld door de resterende dagelijkse tijd na de looptijd. In het voorbeeld van deze gids halveren we de partijen en verlaagt het terugbrengen van de omsteltijden van 200 naar 70 minuten per cyclus de EPEI van 2 dagen naar 1 dag.

### Waarom falen verbeteringen van de omsteltijd na verloop van tijd?

Omdat de standaard niet aan alle ploegen is getraind, de omstelwagen zijn gereedschap kwijtraakt, snelwisselhardware niet wordt onderhouden, of niemand de KPI bewaakt. Onderzoek heeft borging als een centrale zwakte van SMED-praktijken aangewezen [13]. Praktijkbronnen wijzen op dezelfde oorzaken, zoals inconsistente uitvoering en apparatuur die niet gereed is [22]. Standaardwerk, audits en een dagelijkse omsteltijd-KPI op het bord zijn de tegenmaatregelen.

### Is SMED onderdeel van TPM?

Nee. SMED en TPM zijn afzonderlijke lean-methoden, maar ze zijn van elkaar afhankelijk. TPM houdt matrijzen, mallen en snelwisselmateriaal in goede staat, en leanproduction.com raadt aan om met TPM te beginnen wanneer storingen en niet de omstelling de meeste verloren tijd veroorzaken [19][29]. In de meeste OEE-systemen worden zowel omsteltijden als storingen geboekt als beschikbaarheidsverliezen.

### Geldt SMED alleen voor matrijzen en persen?

Nee. De naam komt van stansperses, maar LEI definieert SMED als een proces om elke productieapparatuur in zo kort mogelijke tijd om te stellen van het ene artikelnummer naar het andere [1]. Dezelfde stappen werken voor een lijnomstelling in verpakking, een malwissel, een opspanningswissel op een bewerkingscentrum of een productwissel op een montagelijn.

### Wat is het verschil tussen een SMED-event en een SMED-programma?

Een SMED-event is een gerichte workshop, meestal een kaizen-event, op één machine of lijn. Een SMED-programma is het fabrieksbrede systeem daarachter: een standaard omsteltemplate, opgeleide teams, omstel-KPI's op het shopfloorbord en een uitrolplan van machine naar machine. Events leveren de eerste resultaten op; het programma behoudt ze en verspreidt ze (zie het uitrolroadmap).

### In welke industrieën wordt SMED gebruikt?

In elke industrie met omstellingen: automotive en metaalstansen, kunststof, machinale bewerking, verpakking, drukwerk, elektronica, voedings- en drankenindustrie en farmacie. Een review van 130 SMED-artikelen besloeg een breed scala aan sectoren [14]. In procesindustrieën domineren vaak reiniging en verplichte controles, daarom wordt SMED gecombineerd met sequencing en campagneplanning.

### Hoe lang duurt een SMED-project?

Een eerste SMED-cyclus op één machine duurt vaak drie tot vier maanden van nulmeting tot een stabiele nieuwe standaard: enkele weken voorbereiding en nulmeting, een workshop van drie tot vijf dagen, enkele weken voor hardware en training, en een maand stabilisatie [unverified: schatting van praktijkervaring]. Levertijden van hardware kunnen dit verlengen.

### Wat kost SMED?

De eerste cyclus is vaak goedkoop: teamtijd, checklists, karren, kleurcodering en spacerblokken. Snelwisselmateriaal zoals multi-koppelingen, hydraulische klemming of voorverwarmingsstations kost meer en moet na de organisatorische stappen komen. Het uitgewerkte ROI-voorbeeld in deze gids schat een terugverdientijd van ongeveer 1,5 jaar voor een spuitgietmachine; uw cijfers zullen afwijken.

### Kan SMED werken in een high-mix, low-volume jobshop?

Ja, maar met een andere focus. Wanneer de meeste opstellingen uniek zijn, standaardiseer dan wat zich herhaalt: opspanning, gereedschapsbibliotheken, offline programmeren, voorinstellen en productfamilies. Analyseer het instelproces, niet één specifieke instelling.

## Conclusie en eerste stappen

SMED is een van de meest praktische lean-methoden omdat de logica eenvoudig is en de resultaten meetbaar zijn: stop de machine niet voor werk dat terwijl hij draait kan gebeuren, en maak wat tijdens de stilstand moet gebeuren eenvoudig, veilig en vrij van afstelling. Shingo's inzicht uit de jaren vijftig en zestig geldt nog steeds, en de eerste grote winsten komen nog steeds uit checklists, voorbereiding en parallel werk in plaats van uit dure hardware.

De methode loont pas wanneer de bespaarde tijd wordt benut. Een kortere omstelling is potentiële capaciteit of potentiële flexibiliteit; de fabriek moet beslissen welke van beide, en vervolgens loopgroottes, productieruns, planningen en ERP-parameters aanpassen aan de vraag van de klant. De cijfers in deze gids laten zien waarom het de moeite waard is: in het EPEI-voorbeeld halveert het terugbrengen van de omsteltijd per cyclus van 200 naar 70 minuten de loopgroottes, en in de formule voor de loopgrootte betekent een kwart van de omstelkosten een economische loopgrootte die de helft is.

Ook de grenzen verdienen aandacht. Organisatorische SMED bereikt een plafond waar apparatuur- en productontwerp het overnemen, winsten verdwijnen zonder standaarden en audits, en snelheid mag nooit ten koste gaan van lockout/tagout of ergonomie.

**Uw eerste stappen in de komende 30 dagen**

- [ ] Kies één machine met frequente omsteltijden van 30 tot 90 minuten en zichtbare bedrijfsimpact
- [ ] Registreer gedurende twee weken begin en einde van elke omstelling (laatste goede stuk tot eerste goede stuk)
- [ ] Spreek met de planning af hoe de bespaarde tijd wordt gebruikt: capaciteit, kleinere loten of een splitsing
- [ ] Bekijk met uw veiligheidsfunctionaris de energiebeheersprocedure van die machine
- [ ] Filmt één omstelling met instemming van de ploeg en stel de lijst met elementen op
- [ ] Markeer elk element als intern of extern en introduceer een checklist vóór de omstelling
- [ ] Bereken de huidige EPEI en de loopgroottes die daaruit volgen
- [ ] Zet de omsteltijd op het shop-floor-bord met een doel en een kolom voor de reden
- [ ] Controleer of het NIST MEP-centrum van uw staat een workshop snelle omstelling aanbiedt [18][31]

---

## Verder lezen op m365.fm

**Gidsen in dit leertraject**
- [Lean Manufacturing: principes, hulpmiddelen, implementatie en grenzen](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Productie-KPI's](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Shop Floor Management en Gemba-wandelingen](https://www.m365.fm/en/learn/shop-floor-management/)
- [Productieplanning en APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Digital Twin in de productie](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Manufacturing IT met Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [5S en visueel management](https://www.m365.fm/en/learn/5s-visual-management/)
- [Total Productive Maintenance (TPM) en OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [Kanban en pull-systemen](https://www.m365.fm/en/learn/kanban-pull-system/)
- [Six Sigma en root cause-analyse](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/)
- [S&OP, MRP en productieplanning](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [MES en ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)
- [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/)

**Verdiepingen**
- [Kaizen en kaizen-evenementen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/)
- [Poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/)
- [PDCA-cyclus](https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/)
- [Standaardwerk](https://www.m365.fm/en/learn/shop-floor-management/standard-work/)
- [Papierloze productie en digitale werkinstructies](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/)
- [Loodgrootte: EOQ en EPQ](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Voorraadbeheer in de productie](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)
- [Productiesimulatie](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)
- [Vaardigheden van productiepersoneel en TWI](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/)

**Glossaryttermen (entiteiten)**
[SMED](https://www.m365.fm/entity/smed/) · [Setup time](https://www.m365.fm/entity/setup-time/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [Kanban](https://www.m365.fm/entity/kanban/) · [5S](https://www.m365.fm/entity/5s/) · [Poka-yoke](https://www.m365.fm/entity/poka-yoke/) · [TPM](https://www.m365.fm/entity/total-productive-maintenance/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Lean management](https://www.m365.fm/entity/lean-management/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** is de host van m365.fm en werkt bij iFAKT GmbH. Op m365.fm schrijft hij over lean manufacturing, operational excellence en de digitale transformatie van productie, met de nadruk op hoe waardestroommodellen, simulatie en KPI-analyse fabrieken helpen methoden zoals SMED in de praktijk te brengen.

**Let op: de auteur werkt bij iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Regulatory texts and LEI definitions were opened and checked on that date; vendor pages are cited for vendor guidance and labeled as such in the text.

1. Single Minute Exchange of Die. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/single-minute-exchange-of-die/
2. Changeover. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/changeover/
3. Every Product Every Interval (EPEx). Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/every-product-every-interval/
4. Overall Equipment Effectiveness. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/
5. Single-minute exchange of die (history, Shingo's eight techniques, four stages, seven basic steps, setup time breakdown, OTED; citing Shingo 1985 and 1989). Wikipedia. https://en.wikipedia.org/wiki/Single-minute_exchange_of_die
6. Shigeo Shingo. Wikipedia. https://en.wikipedia.org/wiki/Shigeo_Shingo
7. Shingo, S. (translated by Dillon, A. P.): A Revolution in Manufacturing: The SMED System. Productivity Press, Cambridge, MA, 1985, 386 pp., ISBN 978-0-915299-03-4 (publisher page, Routledge: https://www.routledge.com/A-Revolution-in-Manufacturing-The-SMED-System-1st-Edition/Shingo/p/book/9780915299034; book text not consulted directly).
8. 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147 (verbatim text cross-checked at https://www.law.cornell.edu/cfr/text/29/1910.147)
9. Lockout/Tagout eTool: Minor servicing exception (relationship to Subpart O). OSHA. https://www.osha.gov/etools/lockout-tagout/hot-topics/relationship-subpart-o/minor-servicing-exception
10. 29 CFR 1910.217, Mechanical power presses, paragraph (d)(9) Diesetting. OSHA. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.217
11. 21 CFR 211.130, Packaging and labeling operations, paragraph (e). Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/21/211.130
12. McIntosh, R. I. et al.: A critical evaluation of Shingo's "SMED" (Single Minute Exchange of Die) methodology. International Journal of Production Research, Vol. 38, No. 11 (2000), pp. 2377–2395. Record: https://acnpsearch.tweb-dev.unibo.it/singlejournalindex/73565535 (DOI not confirmed online)
13. McIntosh, R.; Culley, S.; Gest, G.; Mileham, T.; Owen, G.: An assessment of the role of design in the improvement of changeover performance. International Journal of Operations & Production Management, Vol. 16, No. 9 (1996), pp. 5–22. https://doi.org/10.1108/01443579610125552
14. da Silva, I. B.; Godinho Filho, M.: Single-minute exchange of die (SMED): a state-of-the-art literature review. International Journal of Advanced Manufacturing Technology, Vol. 102 (2019), pp. 4289–4307. https://doi.org/10.1007/s00170-019-03484-w
15. Braglia, M.; Di Paco, F.; Frosolini, M.; Marrazzini, L.: Quick changeover design: a new Lean methodology to support the design of machines in terms of rapid changeover capability. Journal of Manufacturing Technology Management, Vol. 34, No. 9 (2023), pp. 84–114. https://doi.org/10.1108/JMTM-12-2022-0430
16. Cakmakci, M.: Process improvement: performance analysis of the setup time reduction-SMED in the automobile industry. International Journal of Advanced Manufacturing Technology, Vol. 41, No. 1 (2009), pp. 168–179. https://doi.org/10.1007/s00170-008-1434-4
17. Success Story: Improvement Effort Reduces Changeover Time (Brighton NC Machine Corporation, Michigan Manufacturing Technology Center), April 6, 2018. NIST Manufacturing Innovation Blog. https://www.nist.gov/blogs/manufacturing-innovation-blog/success-story-improvement-effort-reduces-changeover-time
18. Quick Changeover (April 16, 2024). WMEP Manufacturing Solutions (Wisconsin), part of the MEP National Network. https://wmep.org/quick-changeover/
19. SMED (Single-Minute Exchange of Die). leanproduction.com (vendor-operated knowledge page). https://leanproduction.com/smed
20. Single-Minute Exchange of Die (SMED). Vorne Industries (vendor). https://www.vorne.com/tools/single-minute-exchange-of-die.htm
21. How to Reduce Changeover Time. MachineMetrics (vendor). https://www.machinemetrics.com/blog/changeover-time
22. How to Reduce Changeover Time in Manufacturing: A Practical Playbook for Maintenance and Operations. MaintainX (vendor). https://www.getmaintainx.com/blog/how-to-reduce-changeover-time-in-manufacturing
23. How To Reduce Changeover Time in Manufacturing. Tulip Interfaces (vendor). https://tulip.co/blog/reduce-changeover-time-in-manufacturing/
24. How to Reduce Changeover Time with Connected Workforce Software. L2L (vendor). https://l2l.com/blog/reduce-changeover-time
25. Heijunka. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/heijunka/
26. Standardized Work. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/standardized-work/
27. 5S. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/five-s/
28. Poka-Yoke. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/poka-yoke/
29. Total Productive Maintenance. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/total-productive-maintenance/
30. About the Shingo Institute. Shingo Institute, Jon M. Huntsman School of Business, Utah State University. https://shingo.org/about-the-shingo-institute/
31. Manufacturing Extension Partnership (MEP). National Institute of Standards and Technology (NIST). https://www.nist.gov/mep
32. Ergonomics. OSHA. https://www.osha.gov/ergonomics
33. Training Within Industry. Wikipedia. https://en.wikipedia.org/wiki/Training_Within_Industry
34. Kanban. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/kanban/
35. Value-Stream Mapping. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/value-stream-mapping/
36. Chapter 5: Single Minute Exchange of Die (SMED). In: Statistical Process Control and Lean Manufacturing (open textbook, Creative Commons). PALNI Pressbooks. https://pressbooks.palni.org/spcleanmanufacturing/?p=35
37. 21 CFR 117.135, Preventive controls, paragraph (c)(2) Food allergen controls. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/21/117.135
38. Total absorption costing. Wikipedia. https://en.wikipedia.org/wiki/Total_absorption_costing
39. Economic order quantity. Wikipedia (formula Q* = √(2DK/h); Harris 1913). https://en.wikipedia.org/wiki/Economic_order_quantity (accessed November 20, 2026)
40. Handbook: Inventory (2025), sections on ASC 330-10-30-1, 30-3, 30-6 to 30-8. KPMG LLP. https://kpmg.com/kpmg-us/content/dam/kpmg/frv/pdf/2025/inventory.pdf (accessed November 20, 2026)
