# SEO metadata

| Field | Value |
|---|---|
| Meta title | Pianificazione produzione aerospaziale: guida completa fornitori |
| Meta description | Pianificazione della produzione aerospaziale spiegata: AS9100, FAA Parte 21/145, tracciabilità, curve di apprendimento, rampa di produzione, APS e MRO, con esempi. |
| Slug | `aerospace-production-planning` |

# Pianificazione della produzione aerospaziale: la guida completa per fornitori e officine MRO

*Aggiornato al 20 novembre 2026 · Basato su dati di settore e aziendali, standard IAQG/SAE, normative FAA ed EASA e letteratura tecnica (vedi Fonti)*

> **Risposta breve:** La pianificazione della produzione aerospaziale significa far corrispondere i ritmi richiesti dal cliente con una capacità finita, tempi di consegna lunghi, processi speciali certificati e una tracciabilità completa. A differenza dei settori a grande volume, non basta rispettare la data di consegna. Bisogna anche dimostrare come è stato realizzato il pezzo: ogni componente richiede un'origine documentata, una configurazione rilasciata e un processo controllato, e queste evidenze devono essere pianificate esattamente come le ore macchina.

Martedì mattina presso un fornitore di Tier 2 di componenti strutturali. Il cliente ha aumentato del venti per cento le consegne del prossimo trimestre perché il costruttore aeronautico sta incrementando il proprio ritmo produttivo. Le celle di lavorazione a cinque assi sono già in funzione su tre turni. Il trattamento termico viene affidato a un processore esterno accreditato Nadcap, con un tempo di consegna di tre settimane. È appena arrivata una modifica di ingegneria per due codici articolo, che fa scattare un'ispezione parziale del primo articolo. E da ieri il reparto qualità sta cercando il certificato di materiale di un lotto termico di titanio, perché un cliente ha una domanda su un lotto già spedito.

Ciascuno di questi compiti può essere risolto da solo. La difficoltà è che finiscono tutti nello stesso piano nello stesso momento. È questo che distingue la pianificazione della produzione aerospaziale dalla pianificazione in molti altri settori: non pianifica soltanto quantità e date, ma anche evidenze, approvazioni e configurazioni. E lo fa in un mercato in cui i portafogli ordini dei costruttori aeronautici sono pieni per anni, mentre la catena di fornitura è bloccata in più punti contemporaneamente.

Questa guida è rivolta a direttori di stabilimento, responsabili della pianificazione e della schedulazione e responsabili qualità presso i fornitori aerospaziali, nonché ai pianificatori delle officine di manutenzione, riparazione e revisione (MRO) e delle stazioni di riparazione. Chi cerca la schedulazione della produzione aerospaziale troverà il lato della schedulazione (capacità finita, APS, controllo dei colli di bottiglia) nelle Sezioni 5, 10 e 11. La guida illustra la situazione di mercato nel 2026 con dati documentati, ciò che rende il settore diverso, gli standard e le normative rilevanti su entrambe le sponde dell'Atlantico (FAA ed EASA), la tracciabilità e la genealogia, le curve di apprendimento di Wright con un esempio svolto, come pianificare una rampa di incremento del ritmo, la pianificazione della capacità con APS e simulazione, la pianificazione MRO con i riscontri non previsti, i KPI, un approccio passo dopo passo ed errori tipici. Una breve introduzione al legame tra tempo di consegna e tracciabilità è disponibile nel post [Aerospace production planning: lead time and traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/) su m365.fm.

Una nota sul contesto europeo: la versione originale di questa guida è stata scritta per i fornitori tedeschi, e gran parte della catena di fornitura globale di Airbus passa per l'Europa. Dove le normative europee (EASA, norme EN) sono rilevanti per le aziende statunitensi, ad esempio quando si forniscono clienti europei o si detengono approvazioni duali FAA/EASA, la guida le spiega accanto alle rispettive controparti statunitensi.

### Punti chiave

- **La domanda c'è, la capacità no.** Airbus aveva un portafoglio ordini di 9.310 aeromobili commerciali alla fine di settembre 2026 [3]; Boeing ha riportato un portafoglio commerciale di oltre 6.300 velivoli alla stessa data [47]. I ritmi produttivi stanno crescendo più lentamente del previsto perché mancano motori, fusioni e forgiati, materie prime e manodopera qualificata [4][10].
- **Pianificare in questo settore significa pianificare con un onere della prova.** La norma AS9100D richiede, tra l'altro, la gestione della configurazione, la tracciabilità e la prevenzione dei componenti contraffatti [14][44]. I titolari di un'approvazione di produzione FAA devono gestire un sistema di qualità che copra il controllo dei fornitori, le registrazioni di qualità e le fughe di qualità [41]. Ogni modifica di progetto può innescare un'ispezione del primo articolo completa o parziale secondo AS9102 [18][46].
- **Il lead time è per lo più tempo di attesa.** La Legge di Little afferma: lead time = lavoro in corso ÷ throughput [27]. Al di fuori dei processi speciali, i cicli di ispezione e le approvazioni sono fonti tipiche di attesa.
- **Le curve di apprendimento sono input di pianificazione.** Wright dimostrò nel 1936 che le ore di lavoro per aeromobile diminuivano di circa il 20 % ogni volta che la produzione cumulativa raddoppiava [24][25]. Se si pianifica un lancio con i tempi standard a regime, si pianifica una capacità insufficiente.
- **Una rampa di produzione fallisce al collo di bottiglia, non in media.** Un aumento del ritmo del 20 % colpisce una risorsa che lavora all'85 % di utilizzo molto più duramente di quanto suggerisca la capacità totale.
- **La pianificazione MRO deve tenere conto dell'imprevisto.** La portata di un intervento in officina è nota solo dopo l'ispezione. Una buona pianificazione MRO lavora con probabilità di rilevamento, scorte di sicurezza e disponibilità dei ricambi.
- **Nessun algoritmo corregge dati anagrafici errati.** APS, simulazione e gemelli digitali richiedono cicli di lavorazione, tempi standard, capacità e dati di certificazione corretti.

### Percorsi di lettura rapida

| Sei … | Leggi prima |
|---|---|
| Responsabile di stabilimento presso un fornitore che affronta un aumento del ritmo | Sezioni 1, 9 e 10 (mercato, curva di apprendimento, rampa di produzione con checklist) |
| Pianificatore o schedulatore della produzione con piani ERP irrealistici | Sezioni 5, 6 e 11 (livelli di pianificazione, lead time, APS e simulazione) |
| Responsabile qualità | Sezioni 3, 4 e 8 (standard e normative, tracciabilità, modifiche ingegneristiche) |
| Pianificatore MRO presso una stazione di riparazione | Sezioni 3, 4 e 13 (Parte 145, parti a vita limitata, pianificazione MRO) |
| Responsabile IT, digitale o cybersecurity | Sezioni 3.6, 4, 11, 14 e 16 (ITAR/CMMC, modello dei dati, APS, gemello digitale, approccio) |

## Indice

1. [Il mercato 2026: perché la pianificazione è diventata il collo di bottiglia](#1-il-mercato-2026-perché-la-pianificazione-è-diventata-il-collo-di-bottiglia)
2. [Che cosa rende diversa la pianificazione della produzione aerospaziale rispetto ad altri settori](#2-che-cosa-rende-diversa-la-pianificazione-della-produzione-aerospaziale-rispetto-ad-altri-settori)
3. [Standard e normative rilevanti per la pianificazione](#3-standard-e-normative-rilevanti-per-la-pianificazione)
4. [Tracciabilità e genealogia](#4-tracciabilità-e-genealogia)
5. [Livelli di pianificazione: dal rateo del cliente all'operazione](#5-livelli-di-pianificazione-dal-rateo-del-cliente-allaperazione)
6. [Comprendere e ridurre il lead time](#6-comprendere-e-ridurre-il-lead-time)
7. [Pianificazione dei processi speciali e delle lavorazioni esterne](#7-pianificazione-dei-processi-speciali-e-delle-lavorazioni-esterne)
8. [Modifiche di ingegneria e gestione della configurazione](#8-modifiche-di-ingegneria-e-gestione-della-configurazione)
9. [Curve di apprendimento di Wright: teoria ed esempio svolto](#9-curve-di-apprendimento-di-wright-teoria-ed-esempio-svolto)
10. [Pianificare una rampa di incremento della cadenza: calcolo e checklist](#10-pianificare-una-rampa-di-incremento-della-cadenza-calcolo-e-checklist)
11. [Pianificazione della capacità con APS, gestione dei colli di bottiglia e simulazione](#11-pianificazione-della-capacità-con-aps-gestione-dei-colli-di-bottiglia-e-simulazione)
12. [Rischi della supply chain dal 2022 al 2026 e loro implicazioni per la pianificazione](#12-rischi-della-supply-chain-dal-2022-al-2026-e-loro-implicazioni-per-la-pianificazione)
13. [Pianificazione MRO: manutenzione con riscontri non previsti](#13-pianificazione-mro-manutenzione-con-riscontri-non-previsti)
14. [Gemello digitale e filo digitale](#14-gemello-digitale-e-filo-digitale)
15. [KPI per pianificazione e controllo](#15-kpi-per-pianificazione-e-controllo)
16. [Approccio: sei passi verso un piano affidabile](#16-approccio-sei-passi-verso-un-piano-affidabile)
17. [Errori comuni e come evitarli](#17-errori-comuni-e-come-evitarli)
18. [iFAKT e l'aerospazio](#18-ifakt-e-laerospazio)
19. [Glossario](#19-glossario)
20. [FAQ: domande comuni sulla pianificazione della produzione aerospaziale](#20-faq-domande-comuni-sulla-pianificazione-della-produzione-aerospaziale)
21. [Conclusione](#21-conclusione)

## 1. Il mercato 2026: perché la pianificazione è diventata il collo di bottiglia

### 1.1 Domanda record, capacità di consegna limitata

L'aviazione commerciale vive una situazione insolita: la domanda di nuovi aeromobili non è mai stata così alta, ma il settore non riesce a consegnare al ritmo richiesto dai clienti. Secondo uno studio presentato a ottobre 2025 dall'associazione delle compagnie aeree IATA insieme a Oliver Wyman, il portafoglio ordini globale di aeromobili commerciali ha raggiunto il record di oltre 17.000 velivoli nel 2024. Tra il 2010 e il 2019 la media era di circa 13.000 [9]. Lo studio stima che i ritardi nelle consegne siano costati alle compagnie aeree più di 11 miliardi di dollari nel 2025. Le voci principali sono il maggior consumo di carburante dovuto ai velivoli più vecchi (circa 4,2 miliardi di dollari), la manutenzione aggiuntiva (3,1 miliardi di dollari), il leasing dei motori (2,6 miliardi di dollari) e le scorte di ricambi più elevate (1,4 miliardi di dollari) [9].

I numeri dei due grandi costruttori mostrano il quadro nel dettaglio:

| Metrica | Airbus | Boeing |
|---|---|---|
| Consegne 2025 | 793 aeromobili commerciali, di cui 607 della famiglia A320 [2] | 600 aerei commerciali, di cui 447 Boeing 737 [6] |
| Portafoglio ordini | 8.754 a fine 2025 [2]; 9.310 a fine settembre 2026 [3] | oltre 6.100 a fine 2025, per un valore di circa 567 miliardi di dollari [6]; oltre 6.300 a fine settembre 2026, per un valore di 611,8 miliardi di dollari [47] |
| Obiettivo 2026 | circa 870 consegne [3] | nessuna previsione unitaria nelle fonti citate |
| Stato 2026 | 547 consegne al 30 settembre [3]; 621 fino a fine ottobre [5] | 161 consegne nel terzo trimestre 2026, di cui 124 Boeing 737 [47]; il programma 737 procede ancora verso una produzione stabilizzata di 47 al mese; il 787 stabile a 8 al mese [47] |

### 1.2 Obiettivi di cadenza e perché continuano a cambiare

Per i fornitori, la cadenza mensile del costruttore è l'input di pianificazione più importante, perché determina i rilasci lungo tutti i livelli della supply chain. Nel suo rapporto sui primi nove mesi del 2026, Airbus indica questi obiettivi: da 70 a 75 aeromobili della famiglia A320 al mese entro la fine del 2027, per poi stabilizzarsi alla cadenza 75; cadenza 12 per l'A350 nel 2028; cadenza 13 per l'A220 nel 2028; e cadenza 5 per l'A330 nel 2029 [3].

La storia del target "rate 75" mostra quanto siano volatili queste ipotesi. Airbus inizialmente voleva raggiungere questo rateo nel 2025-2026. Alla fine del 2024 il target è stato spostato al 2027 [4]. Nell'aprile 2026 il CEO di Airbus Guillaume Faury ha attribuito pubblicamente a Pratt & Whitney la mancata consegna del numero di motori ordinati e ha parlato di carenze che non corrispondevano né alla domanda né agli ordini [4]. I media di settore considerano possibile uno slittamento del rate 75 al 2028 [4]. L'intervallo di target da 70 a 75 entro la fine del 2027 riflette la situazione al 28 ottobre 2026 [3].

In Boeing, dopo il distacco del portellone (door plug) su un volo di Alaska Airlines nel gennaio 2024, la FAA ha limitato la produzione del 737 MAX a 38 aerei al mese. Nell'ottobre 2025 la FAA ha approvato un aumento a 42 [7]. Nel maggio 2026 il CEO di Boeing Kelly Ortberg ha dichiarato che la linea funzionava ormai al rateo 47; ha descritto un ulteriore passaggio a 52 come un carico più pesante a causa dei livelli di scorte nella catena di fornitura [8]. Il comunicato trimestrale di Boeing del 27 ottobre 2026 descrive il programma 737 come ancora in fase di avvicinamento a una produzione stabilizzata di 47 al mese [47].

**Che cosa significa per la vostra pianificazione:** I target di rateo non sono impegni. Sono ipotesi di pianificazione con un'incertezza significativa. Un fornitore che costruisce capacità strettamente in base al target ufficiale rischia costi di inattività. Un fornitore che costruisce troppo tardi diventa esso stesso il collo di bottiglia, in un settore in cui un solo componente mancante blocca un intero aereo. Una pianificazione solida lavora quindi con scenari (ad esempio rateo 60, 67 e 75) e con soglie di investimento definite in anticipo.

### 1.3 Il settore in cifre: Stati Uniti e Germania

L'industria aerospaziale e della difesa statunitense è la più grande del mondo. Secondo l'Aerospace Industries Association (AIA) e S&P Global Market Intelligence, il settore ha registrato vendite complessive per 988,6 miliardi di dollari nel 2025 (l'AIA indica un'attività economica complessiva di 1.000 miliardi) e ha sostenuto circa 2,1 milioni di posti di lavoro. Circa 1,1 milioni di questi posti di lavoro e quasi 483 miliardi di dollari di attività si trovano nella catena di fornitura nazionale. Le esportazioni hanno raggiunto 172,7 miliardi di dollari, in aumento del 25 % su base annua [48]. In altre parole, circa la metà dei posti di lavoro è presso i fornitori, ed è proprio il gruppo a cui questa guida è rivolta.

La Germania è una parte più piccola ma importante della catena di fornitura di Airbus e il mercato di origine della versione originale di questa guida. La German Aerospace Industries Association (BDLI) ha riportato cifre record nel maggio 2026: 62 miliardi di euro di fatturato nel 2025 (2024: 52 miliardi di euro, +19 %) e 130.000 dipendenti (anno precedente: 120.000). L'aviazione civile è il segmento più grande con 45 miliardi di euro di fatturato (+15 %), seguita dall'aviazione militare con 13,5 miliardi di euro (+35 %) e dallo spazio con 3,5 miliardi di euro. La quota di esportazione è stata del 66 %, e la spesa in ricerca e sviluppo è stata di circa 4 miliardi di euro [1].

Dietro questi numeri, su entrambe le sponde dell'Atlantico, ci sono molti piccoli e medi fornitori accanto agli OEM e ai grandi system house. Producono parti strutturali, componenti per cabine, parti di motori, sistemi e processi speciali, oppure forniscono servizi di manutenzione. Per queste aziende in particolare, il passaggio dalla sottoutilizzazione (2020-2022) a un sovraccarico sostenuto rappresenta una sfida di pianificazione.

### 1.4 La prospettiva dei fornitori: cosa mostrano le indagini

La società di consulenza Roland Berger ha intervistato 95 aziende della catena di fornitura aerospaziale all'inizio del 2026 [10]. I risultati sono rivelatori per chiunque sia responsabile della pianificazione:

- Il 55 % delle aziende segnala interruzioni della catena di fornitura (2025: 64 %).
- Circa l'80 % rileva un rischio da medio ad alto di carenza di materie prime critiche; titanio, acciaio, rame, terre rare e magneti sono quelli citati più spesso.
- Il 56 % riporta una carenza di personale qualificato (anno precedente: 65 %). Resta il freno più comune alla rampa di produzione.
- Quasi il 40 % non dispone di capacità produttiva sufficiente.
- Circa un terzo opera con un margine EBIT inferiore al 5 %, e il 40 % ha accumulato scorte più elevate in vista dell'avvio della produzione, il che esercita ulteriore pressione sui margini.
- I lunghi tempi di consegna riguardano non solo i materiali ma anche servizi come collaudi, trattamenti superficiali e finiture.

Un'indagine precedente va nella stessa direzione dal punto di vista della pianificazione. In una valutazione della prontezza ai tassi produttivi su oltre 100 fornitori in Asia, Europa e Stati Uniti, la società di consulenza Vendigital ha riscontrato che il 38 % disponeva di processi di pianificazione della capacità inadeguati. Ha indicato come cause la carenza di competenze, la condizione sconosciuta di impianti e macchinari, programmi di manutenzione trascurati e una scarsa comunicazione tra i pianificatori di alto livello e il reparto produttivo [55]. L'articolo non riporta una data di pubblicazione; fa riferimento al piano di Airbus del 2021 per raggiungere il rate 75 entro il 2025, quindi i dati risalgono a diversi anni fa.

L'ultimo punto dell'elenco di Roland Berger è centrale per la pianificazione: i processi speciali e le ispezioni sono diventati essi stessi colli di bottiglia in molte catene di fornitura. La sezione 7 illustra come affrontare questo problema.

## 2. Che cosa rende diversa la pianificazione della produzione aerospaziale da quella di altri settori

Molti principi di pianificazione valgono per qualsiasi produzione discreta. Il settore aerospaziale, però, combina diverse caratteristiche che, prese singolarmente, sono familiari, ma che insieme richiedono una logica di pianificazione propria.

### 2.1 Alto mix, basso volume e molte varianti

Un fornitore aerospaziale produce tipicamente molti codici articolo in piccole quantità. Anche con un rate di 75 aeromobili al mese, si tratta di circa 3,5 aeromobili al giorno lavorativo (con circa 21 giorni lavorativi al mese). Un componente installato una volta per aeromobile ha quindi una quantità giornaliera nell'ordine delle singole unità. A ciò si aggiungono le varianti specifiche per cliente (configurazione della cabina), la domanda di ricambi e i componenti per modelli più datati. Il risultato è un ambiente ad alto mix e basso volume (HMLV), in cui attrezzaggi, cambi di programma e sforzo di ispezione assorbono una quota elevata della capacità.

### 2.2 Tempi di approvvigionamento lunghi e distinte base profonde

Un componente strutturale in titanio può impiegare molte settimane tra la materia prima e la spedizione: forgiatura o fusione, sgrossatura, trattamento termico, finitura, controlli non distruttivi (NDT), trattamento superficiale, ispezione finale. Diverse di queste fasi avvengono spesso presso specialisti esterni. Le distinte base di grandi assiemi sono profondamente annidate; un aeromobile è composto da milioni di parti che si congiungono attraverso molti livelli di fornitura. La conseguenza: un ritardo a un livello inferiore spesso si manifesta settimane dopo sulla linea di assemblaggio finale. Se non si comprende e non si gestisce attivamente il [lead time](https://www.m365.fm/entity/lead-time/), si pianifica con margini di cui non si conosce l'entità.

### 2.3 Certificazione, qualificazione e documentazione di prova

Nel settore aerospaziale non basta realizzare un componente a quota. Deve essere prodotto con un processo rilasciato, su attrezzature qualificate, da personale qualificato, con materiale certificato e nella configurazione approvata, e tutto questo deve essere documentato. Ne derivano conseguenze dirette per la pianificazione: un ordine non può semplicemente essere spostato su una macchina libera ma non qualificata. Un dipendente privo di una qualifica valida per un processo speciale non rappresenta capacità dal punto di vista della pianificazione. Un cambio di fornitore può richiedere una nuova ispezione del primo articolo.

### 2.4 Logica di rate anziché logica di lotto

I costruttori di aeromobili pianificano in rate mensili annunciati con anni di anticipo e aumentati per gradi. Un fornitore deve tradurre questo rate nei propri lotti produttivi senza perdere la cadenza richiesta dal cliente. Allo stesso tempo, i gradini di rate raramente sono regolari: il cliente accumula scorte, posticipa o anticipa i rilasci. Una buona pianificazione separa quindi il rate del cliente (ciò di cui il cliente ha bisogno nel lungo periodo) dai rilasci (ciò che il cliente ordina nel breve termine) e monitora lo scarto tra i due.

### 2.5 Cicli di vita del prodotto lunghi

Un tipo di aeromobile viene spesso costruito per decenni ed esercito ancora più a lungo. Ciò significa che revisioni dei disegni, specifiche dei materiali e approvazioni di processo restano valide per molto tempo, ma continuano a cambiare. I ricambi per configurazioni più vecchie devono rimanere disponibili. E le registrazioni devono essere conservate per periodi molto lunghi. Secondo le norme FAA, il titolare di un'approvazione di produzione deve conservare le registrazioni di qualità per almeno 5 anni per prodotti e articoli realizzati nell'ambito dell'approvazione e per almeno 10 anni per i componenti critici [41]; i requisiti del cliente spesso vanno oltre. Nella pratica, i periodi di conservazione derivano dai requisiti contrattuali trasferiti dal cliente e dalla normativa applicabile.

### 2.6 Il costo elevato di un errore

Un pezzo difettoso che arriva al cliente (un *escape*) può far scattare rilavorazioni sulla linea di assemblaggio finale, ispezioni sugli aeromobili consegnati o, nei casi estremi, fermi a terra. La FAA tratta questo aspetto come un tema del sistema qualità in sé: il 14 CFR 21.137 elenca i "quality escapes" tra gli elementi obbligatori del sistema qualità di un titolare di approvazione di produzione [41]. Il motore Pratt & Whitney GTF mostra a cosa può portare un difetto di materiale (Sezione 12). Per la pianificazione questo significa che le ispezioni di qualità non sono un margine da tagliare quando il programma è stretto. Sono parti fisse del ciclo di lavorazione.

## 3. Norme e regolamenti rilevanti per la pianificazione

### 3.1 La famiglia di norme IAQG in sintesi

L'International Aerospace Quality Group (IAQG) sviluppa gli standard di qualità del settore. Sono pubblicati nelle Americhe come standard AS (da SAE International), in Europa come standard EN e in Asia come standard JISQ; il contenuto è identico. Lo standard di base è la 9100, integrato da norme per le organizzazioni di manutenzione (9110), i distributori (9120), l'ispezione del primo articolo (9102), la gestione della variabilità delle caratteristiche chiave (9103) e altre [13]. Negli Stati Uniti si incontrano soprattutto le sigle AS (AS9100D, AS9102C, AS9145); i clienti e i documenti europei usano EN 9100 e così via. Si riferiscono agli stessi requisiti.

Sul piano normativo, per la maggior parte dei fornitori contano due sistemi: la Federal Aviation Administration (FAA) statunitense, le cui regole sono nel Titolo 14 del Code of Federal Regulations (14 CFR), e l'European Union Aviation Safety Agency (EASA). In modo poco intuitivo, entrambe hanno una "Part 21" e una "Part 145", e in entrambi i sistemi la Subpart G della Part 21 riguarda le approvazioni di produzione. Lo scopo è simile, ma il contenuto non è identico.

La tabella seguente riassume ciò che un responsabile della pianificazione deve sapere:

| Norma / regolamento | Contenuto | Impatto sulla pianificazione |
|---|---|---|
| **AS9100D** (EN 9100:2018, JISQ 9100:2016) | Sistema di gestione della qualità per l'aviazione, lo spazio e la difesa; comprende la ISO 9001:2015 più circa 105 requisiti aggiuntivi specifici del settore, tra cui gestione della configurazione, gestione del rischio, sicurezza del prodotto, prevenzione dei pezzi contraffatti, tracciabilità e consegna puntuale [14][44] | La consegna puntuale diventa un indicatore soggetto ad audit; la tracciabilità di materiale, processi, utensili e persone deve accompagnare il flusso dell'ordine [14] |
| **AS9102C** (2023; EN 9102:2024) | Ispezione del primo articolo (FAI): verifica completa del primo pezzo proveniente dal processo produttivo rispetto a tutte le caratteristiche di progetto [17][18][46] | Pianificare l'attività di FAI come operazione a sé stante; modifiche di progetto, materiale, fonte, processo, attrezzaggio o ubicazione, nonché un'interruzione della produzione superiore a due anni, comportano una FAI completa o parziale [18][34] |
| **AS9103 / EN 9103:2023** | Gestione della variabilità delle caratteristiche chiave [19] | Le caratteristiche chiave richiedono studi di capacità di processo e carte di controllo; ciò impegna la capacità di ispezione e influisce sulle dimensioni dei lotti e sulla frequenza dei controlli |
| **AS9145** (2016; EN 9145:2018) | Advanced Product Quality Planning (APQP) e Production Part Approval Process (PPAP) per l'aerospazio, in cinque fasi dalla pianificazione alla produzione continua [16][35][45] | La prontezza produttiva deve essere dimostrata alla cadenza richiesta dal cliente (production readiness review, prove a regime); la pianificazione del lancio e la dimostrazione della capacità diventano parte dell'approvazione [35] |
| **AS9110 / EN 9110:2018** | Sistema di gestione della qualità per le organizzazioni di manutenzione aeronautica [20] | Aggiunge requisiti del sistema qualità per le Part 145; rilevante per i processi di pianificazione, il controllo dei fornitori e gli indicatori KPI nella MRO |
| **AS9120 / EN 9120** | Sistema di gestione della qualità per distributori e stoccatori [13][14] | Tracciabilità e catena dei certificati per parti standard e materie prime acquistate |
| **Nadcap** | Programma di accreditamento gestito dal settore per i processi speciali, fondato nel 1990 sotto SAE e amministrato dal Performance Review Institute (PRI); le aree comprendono trattamenti termici, trattamenti chimici, NDT, saldatura, rivestimenti e compositi [21][54] | Molti clienti consentono di eseguire i processi speciali solo a officine accreditate; ciò limita la scelta dei fornitori e spesso rende i processi speciali il collo di bottiglia |
| **FAA 14 CFR Part 21, Subpart G** (certificato di produzione); anche Subpart K (Parts Manufacturer Approval, PMA) e Subpart O (autorizzazione TSO) | Approvazioni di produzione; il 14 CFR 21.137 richiede un sistema qualità scritto con 14 elementi, tra cui controllo dei dati di progetto, controllo dei fornitori, controllo dei processi produttivi, controllo dei prodotti non conformi, registrazioni di qualità e fughe di qualità [41] | Il titolare dell'approvazione controlla i propri fornitori; le registrazioni devono essere conservate per almeno 5 anni (10 anni per i componenti critici) [41]. La maggior parte dei fornitori di Tier 2 e Tier 3 non detiene essa stessa un'approvazione di produzione, ma opera sotto il controllo fornitori del proprio cliente |
| **FAA 14 CFR Part 145** | Certificato di stazione di riparazione; lavori solo entro le abilitazioni e le specifiche operative, con dati di manutenzione aggiornati, un programma di formazione approvato dalla FAA e registrazioni conservate per almeno 2 anni [42] | La pianificazione può assegnare solo lavori per i quali la stazione è abilitata, a personale formato, con manuali e dati aggiornati a disposizione |
| **EASA Part 21 Subpart G** | Approvazione dell'organizzazione di produzione (POA) nell'UE [22] | Il titolare dell'approvazione rilascia le parti con un EASA Form 1 e sovrintende ai propri fornitori; processi e personale devono corrispondere all'approvazione. Rilevante per i fornitori statunitensi di clienti europei |
| **EASA Part 145** | Approvazione dell'organizzazione di manutenzione (Allegato II del Regolamento (UE) n. 1321/2014) [23] | Lavori solo entro l'ambito approvato (abilitazione), con personale certificatore e dati di manutenzione validi. Uno stabilimento che detiene sia le approvazioni FAA sia quelle EASA può emettere un rilascio duale sul FAA Form 8130-3 [43] |
| **EASA Part-CAMO** | Organizzazione di gestione della navigabilità continua, introdotta dal Regolamento (UE) 2019/1383 [23] | Pianifica il programma di manutenzione, le direttive di aeronavigabilità e le parti a vita limitata in Europa e affida i pacchetti di lavoro alla MRO |
| **ITAR / EAR** (USA) | Controlli sulle esportazioni per articoli di difesa (ITAR, 22 CFR 120–130) e beni a duplice uso (EAR, 15 CFR 730–774) [36] | L'accesso a dati tecnici e parti può essere limitato in base alla persona e alla località; ciò vale anche per i sistemi di pianificazione e IT |
| **DFARS / CMMC 2.0** (programmi di difesa USA) | Cybersecurity Maturity Model Certification; clausola DFARS 252.204-7021 in vigore dal 10 novembre 2025, introdotta gradualmente nell'arco di tre anni; regola del programma 32 CFR Part 170 [49][50] | I fornitori che trattano informazioni contrattuali federali (FCI) o informazioni controllate non classificate (CUI) nei propri sistemi di pianificazione, ERP o MES devono possedere il livello CMMC richiesto; i prime contractor devono verificare lo stato CMMC di un subappaltatore prima dell'aggiudicazione [49] |
| **DFARS 252.225-7009** (metalli speciali) | I metalli speciali, inclusi il titanio e le leghe di titanio, contenuti negli articoli consegnati nell'ambito di contratti del DoD devono essere fusi o prodotti negli USA o in un Paese qualificato; la clausola si estende ai subcontratti per articoli che contengono metalli speciali [51] | La pianificazione dei materiali deve tracciare l'origine della colata per lotto di colata, non solo lega e quantità; un lotto più economico o più rapido proveniente da una fonte non qualificata potrebbe non essere utilizzabile |

### 3.2 AS9100 in dettaglio: cosa significa la norma per la pianificazione

AS9100D adotta la struttura della ISO 9001 e aggiunge requisiti che incidono direttamente sulla pianificazione [44]. Tre di essi sono particolarmente importanti.

**Gestione della configurazione.** In ogni momento occorre sapere quale revisione del progetto si applica a quale ordine e quale revisione è stata effettivamente realizzata. Questo riguarda il rilascio degli ordini (rilasciare solo revisioni valide), la gestione degli ordini aperti quando arrivano modifiche e la documentazione delle deviazioni.

**Tracciabilità.** La norma richiede la tracciabilità di tutte le materie prime, dei materiali e dei processi utilizzati, nonché di utensili e persone [14]. Per la pianificazione ciò significa che ogni conferma di operazione deve registrare almeno chi ha lavorato, quando, su quale macchina, con quale materiale e secondo quale revisione del processo. La sezione 4 approfondisce l'argomento.

**Consegna puntuale.** La AS9100 indica esplicitamente la consegna puntuale come requisito [14]. I clienti valutano i propri fornitori in base alla consegna puntuale (OTD) e alla qualità. Una scarsa OTD non è quindi solo un problema commerciale, ma anche un problema di audit.

### 3.3 Approvazione di produzione FAA: cosa significa il 14 CFR 21.137 per i pianificatori

Se si è in possesso di un certificato di produzione FAA o di un'approvazione di produttore di parti (PMA: i titolari PMA devono soddisfare gli stessi requisiti del sistema di qualità ai sensi del 14 CFR 21.307), oppure se si fornisce un titolare di tale approvazione, i requisiti del sistema di qualità del 14 CFR 21.137 determinano la vostra pianificazione [41]. La norma prevede che ogni richiedente o titolare di un certificato di produzione stabilisca un sistema di qualità scritto "che garantisca che ogni prodotto e articolo sia conforme al proprio progetto approvato e si trovi in condizioni di funzionamento sicure" [41]. I suoi 14 elementi si leggono come una lista di controllo per un processo di pianificazione efficace:

- **Controllo dei dati di progetto e controllo dei documenti:** sul reparto produttivo può essere rilasciata solo la revisione corrente e approvata.
- **Controllo dei fornitori:** procedure che garantiscano che ogni prodotto, articolo o servizio fornito dal fornitore sia conforme ai requisiti del titolare dell'approvazione, più un processo di segnalazione delle non conformità riscontrate dopo il rilascio [41].
- **Controllo del processo produttivo, ispezione e collaudo, stato di ispezione e collaudo:** il ciclo di lavorazione deve indicare quali ispezioni avvengono dove, e lo stato di ogni parte deve essere visibile.
- **Controllo dei prodotti non conformi e azione correttiva:** scarti, rilavorazioni e deviazioni devono essere pianificati e documentati, non gestiti in modo informale.
- **Controllo delle registrazioni di qualità:** almeno 5 anni per prodotti e articoli, almeno 10 anni per componenti critici [41].
- **Feedback dal servizio e fuga di difetti (quality escapes):** i riscontri dal campo e le fughe di difetti rientrano nel sistema.

Per un fornitore di Tier 2 o Tier 3 privo di una propria approvazione, questi requisiti arrivano come clausole trasmesse a valle nell'ordine d'acquisto del cliente e nel manuale qualità del fornitore. La conseguenza per la pianificazione è la stessa: le evidenze devono essere prodotte nel flusso dell'ordine, non ricostruite a posteriori.

### 3.4 Prospettive: la AS9100D diventa IA9100

Lo IAQG sta lavorando a una revisione della 9100 che dovrebbe essere pubblicata come IA9100. Il nuovo nome intende unificare le denominazioni regionali (AS, EN, JISQ). A metà ottobre 2026, secondo una verifica delle informazioni disponibili, non vi era alcuna pubblicazione ufficiale né una data confermata; le stime variano dalla fine del 2026 all'inizio del 2027. Anche il periodo di transizione per i certificati non è stato ancora fissato [15]. Fino ad allora la AS9100D (EN 9100:2018) resta l'edizione valida e i certificati esistenti rimangono validi [15]. Pianificate la transizione come progetto separato una volta che lo IAQG avrà pubblicato la norma, e concordate i tempi con il vostro ente di certificazione.

### 3.5 AS9145: dimostrare la prontezza produttiva alla cadenza del cliente

La AS9145 porta in ambito aerospaziale APQP e PPAP, metodi familiari nell'industria automobilistica [45]. Struttura il percorso verso la produzione in cinque fasi: pianificazione; progettazione e sviluppo del prodotto; progettazione e sviluppo del processo; validazione di prodotto e processo; produzione continua, utilizzo e servizio post-consegna [35]. Il pacchetto PPAP comprende, tra l'altro, le registrazioni di progetto, un diagramma di flusso del processo, una FMEA di processo, un piano di controllo, l'analisi del sistema di misura, gli studi iniziali di capacità di processo e il rapporto di ispezione del primo pezzo (FAIR) [35].

Le fasi 3 e 4 sono decisive per la pianificazione. Nella fase 3 la prontezza produttiva viene valutata in una production readiness review, e i processi devono soddisfare i requisiti alla cadenza di domanda del cliente. Nella fase 4 le serie di produzione devono dimostrare che il processo fornisce parti conformi alla cadenza del cliente [35]. In altre parole: la prova della capacità fa parte dell'approvazione. Se la vostra capacità esiste solo sulla carta, è in questa fase che emerge.

### 3.6 Programmi di difesa: CMMC 2.0, controlli sulle esportazioni e metalli speciali

Molti fornitori del settore aerospaziale servono sia clienti commerciali sia clienti della difesa, spesso sugli stessi macchinari e nello stesso sistema ERP. Tre requisiti statunitensi arrivano quindi fino alla pianificazione:

- **CMMC 2.0.** La regola DFARS "Assessing Contractor Implementation of Cybersecurity Requirements" è entrata in vigore il 10 novembre 2025. Aggiunge la clausola 252.204-7021 e introduce i requisiti CMMC in fasi nell'arco di tre anni; la regola di programma sottostante, 32 CFR Part 170, è entrata in vigore il 16 dicembre 2024 [49]. Il modello prevede tre livelli ed è allineato con NIST SP 800-171 [50]. La trasmissione dei requisiti ai subappaltatori si applica quando il subappalto comporta FCI o CUI, e i primi appaltatori devono confermare lo stato CMMC attuale di un subappaltatore prima dell'aggiudicazione [49]. Se disegni, cicli di lavorazione o istruzioni di lavoro con CUI si trovano nel vostro sistema di pianificazione, tale sistema rientra nell'ambito di applicazione.
- **ITAR ed EAR.** I dati tecnici relativi agli articoli di difesa possono essere accessibili solo a persone autorizzate [36]. Pianificatori, supporto IT offshore e tenant cloud devono essere tutti verificati. Ciò incide su dove vengono conservati i dati di pianificazione e su chi può vedere quali ordini.
- **Metalli speciali.** In base alla DFARS 252.225-7009, il titanio e le leghe di titanio (tra gli altri metalli speciali) contenuti negli articoli consegnati nell'ambito di contratti del DoD devono essere fusi o prodotti negli Stati Uniti o in un paese qualificato, e la clausola si trasmette ai subappalti per articoli che contengono metalli speciali [51]. L'allocazione dei materiali deve quindi conoscere l'origine di fusione di ogni lotto di colata.

## 4. Tracciabilità e genealogia

### 4.1 Perché la tracciabilità è un compito di pianificazione

La tracciabilità viene spesso trattata come un tema puramente qualitativo. In realtà nasce nel flusso degli ordini, dove il lavoro viene pianificato, eseguito e confermato. Quando un pianificatore sposta un ordine su una macchina diversa, divide un lotto o riassegna una lavorazione esterna, la genealogia del pezzo cambia. Se in seguito quell'informazione manca, il pezzo nel caso peggiore potrebbe non essere più spedibile perché la sua registrazione è incompleta.

Un recente articolo della rivista tedesca di settore *Produktion* descrive le evidenze e la qualità dei dati come il vero collo di bottiglia per i fornitori di medie dimensioni del settore della difesa. Cita un sondaggio di BearingPoint secondo cui solo il 10 % delle aziende intervistate in Germania dispone di un'architettura dei dati completamente integrata, mentre il 38 % lavora con sistemi frammentati [37]. L'episodio del podcast m365.fm [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) esamina come tracciabilità e genealogia possano essere implementate tecnicamente e organizzativamente nella produzione.

### 4.2 Termini: tracciabilità, genealogia, as-designed e as-built

- **Tracciabilità** è la capacità di seguire l'origine di un pezzo (in avanti e a ritroso): da quale materiale, da quale fornitore, con quale processo, quando e da chi?
- **Genealogia** descrive le relazioni padre-figlio tra pezzi, lotti e gruppi. Risponde a domande come: quali gruppi contengono materiale del lotto di colata X? Quali numeri di serie sono interessati da un ciclo di trattamento termico difettoso?
- **As-designed** è la configurazione specificata dall'ingegneria; **as-built** è la configurazione effettivamente realizzata, comprese le deviazioni approvate. **As-maintained** descrive la condizione dopo la manutenzione in MRO.

### 4.3 Il modello dei dati: cosa occorre registrare come minimo

| Oggetto | Attributi tipici | Perché la pianificazione ne ha bisogno |
|---|---|---|
| Parte / numero di serie | numero di parte, revisione, numero di serie, configurazione | collegamento con l'ordine del cliente e la revisione di progetto |
| Lotto / batch | numero di lotto, quantità, suddivisioni e unioni | dimensionamento dei lotti, circoscrizione di un richiamo |
| Materia prima | materiale, specifica, colata (heat), fornitore, certificato di materiale, origine della fusione (per i metalli speciali DFARS [51]) | rilascio del materiale prima dell'avvio dell'ordine |
| Operazione | macchina, revisione del programma NC, utensile, parametri di processo, inizio/fine | conferma, lead time, riconciliazione della capacità |
| Personale | dipendente, qualifica, validità | assegnazione solo di personale qualificato |
| Processo speciale | fornitore del processo, accreditamento, numero di carico del forno / della vasca, certificato | pianificazione delle fasi esterne, contenimento delle deviazioni |
| Ispezione | piano di ispezione, calibro, risultato, ispettore | rilascio, FAI, evidenza per le caratteristiche chiave |
| Deviazione | concessione, rilavorazione, approvazione di deviazione | documentazione as-built, spedibilità |
| Documento di rilascio | certificato di conformità (C of C); presso le organizzazioni approvate FAA Form 8130-3 o EASA Form 1 [22][23][43] | rilascio per la spedizione; i fornitori privi di una propria approvazione di produzione di norma spediscono al titolare dell'approvazione con un certificato di conformità |

Una nota sui documenti di rilascio per i lettori statunitensi: il FAA Form 8130-3 (Authorized Release Certificate, Airworthiness Approval Tag) documenta le approvazioni di navigabilità nazionali, le approvazioni per il rientro in servizio e le approvazioni all'esportazione. Può essere emesso solo da persone e organizzazioni autorizzate dalla FAA, e la FAA Order 8130.21H stabilisce che i fornitori privi di approvazione di produzione generalmente non possono emetterlo per parti spedite al titolare dell'approvazione di produzione; l'ordine precisa inoltre che esso non è "un documento di consegna o di spedizione" [43]. Gli impianti approvati sia dalla FAA sia dall'EASA possono emettere un rilascio duale sull'8130-3, che rende una parte idonea all'installazione su aeromobili statunitensi ed europei [43]. La controparte europea per i rilasci singoli EASA è l'EASA Form 1 [22][23].

### 4.4 Parti a vita limitata

Alcune parti, in particolare componenti rotanti di motori come dischi e alberi, hanno una vita approvata espressa in cicli o ore (life-limited parts, LLP). Il loro consumo deve essere documentato senza lacune per l'intera vita. Negli Stati Uniti, proprietari e operatori devono conservare le registrazioni dello "stato attuale delle parti a vita limitata" per ogni cellula, motore, elica, rotore e apparecchiatura, e tali registrazioni vengono conservate e trasferite con l'aeromobile in caso di vendita [53]. In Europa, lo stesso compito fa parte della navigabilità continua ai sensi delle norme EASA [23]. Se una parte della storia manca (la cosiddetta tracciabilità dalla nascita, back-to-birth), una parte tecnicamente perfetta può diventare inutilizzabile. Per i costruttori ciò significa: il registro di nascita della parte, vale a dire materiale, colata, lotto di forgiatura e dati di fabbricazione, deve essere completo. Per le officine MRO significa: senza una storia completa una parte non può essere rimontata, e la pianificazione deve reperire un ricambio.

### 4.5 Parti contraffatte e parti non approvate

L'AS9100 richiede esplicitamente misure per prevenire le parti contraffatte [14]. La Advisory Circular AC 21-29D (2016) della FAA descrive come individuare e segnalare le presunte parti non approvate (suspected unapproved parts, SUP); definisce una parte non approvata come una parte che non soddisfa i criteri del 14 CFR 21.8 o 21.9, il che include le parti intenzionalmente falsificate e contraffatte [52]. Le sue indicazioni per l'acquisto sono direttamente rilevanti per i pianificatori: acquistare da fonti la cui documentazione riconduca le parti a una fonte approvata dalla FAA, e diffidare dei segnali di allarme come un prezzo nettamente inferiore a quello di altri venditori, un tempo di consegna insolitamente breve o documentazione mancante [52]. Le presunte parti non approvate vengono segnalate con il FAA Form 8120-11 [52].

Per la pianificazione ciò significa: gli acquisti possono provenire solo da fonti approvate, i certificati devono essere verificati al controllo di ricevimento, e un ricambio reperito rapidamente presso una fonte sconosciuta non è un'opzione, nemmeno sotto pressione dei tempi. Le carenze di fornitura aumentano il rischio, perché cresce la pressione a rivolgersi a fonti del mercato grigio.

### 4.6 In pratica: integrare la tracciabilità nel processo di pianificazione

1. **Riservare e rilasciare il materiale prima dell'avvio dell'ordine.** Un ordine parte solo quando il materiale specifico (colata, certificato) è assegnato e verificato.
2. **Modellare le qualifiche nel modello di capacità.** La pianificazione assegna le operazioni solo a persone e macchine con qualifiche valide.
3. **Registrare divisioni e unioni nel sistema.** Ogni divisione di lotto crea un nuovo numero di lotto collegato alla sua origine.
4. **Pianificare le lavorazioni esterne includendo il ritorno dei certificati.** Un pezzo è considerato rientrato solo quando il suo certificato è rientrato.
5. **Registrare le conferme alla postazione di lavoro, non a fine turno.** Più si registra tardi, più dati mancano.
6. **Testare regolarmente le query.** Eseguire un richiamo simulato: quanto tempo serve per trovare tutti i numeri di serie di una colata?

## 5. Livelli di pianificazione: dal tasso di produzione del cliente all'operazione

### 5.1 Quattro livelli, quattro orizzonti temporali

La pianificazione della produzione aerospaziale può essere suddivisa in quattro livelli. Ciascuno risponde a una domanda diversa e richiede dati diversi.

| Livello | Orizzonte | Domanda chiave | Strumenti tipici |
|---|---|---|---|
| Pianificazione strategica di tassi e capacità | da 2 a 5 anni | Quale tasso di produzione possiamo garantire con quale investimento? | calcolo di scenari, simulazione di stabilimento, pianificazione degli investimenti |
| Sales and operations planning (S&OP) e programmazione della produzione principale | da 6 a 24 mesi | Come traduciamo i tassi del cliente in un programma fattibile? | ERP, pianificazione grossolana della capacità, APS |
| Pianificazione di materiali e capacità | da 1 a 6 mesi | Quale materiale e quale capacità ci servono e quando? | ERP/MRP, portali dei fornitori, APS |
| Schedulazione di dettaglio e controllo del reparto produttivo | da alcune ore a 4 settimane | Quale ordine viene eseguito quando, su quale macchina, con chi? | APS, MES, lavagna di reparto |

Una causa frequente di scarse consegne puntuali non è un singolo livello debole, ma una frattura tra i livelli: il programma principale si impegna sul tasso 75, la schedulazione di dettaglio conosce i colli di bottiglia che lo rendono impossibile, e nessuno riconcilia sistematicamente i due.

### 5.2 ERP, APS e MES: chi fa cosa

Nella maggior parte delle aziende, la [pianificazione delle risorse d'impresa (ERP)](https://www.m365.fm/entity/enterprise-resource-planning/) è il sistema guida per ordini, distinte base, cicli di lavorazione, scorte e acquisti. La sua classica pianificazione dei fabbisogni di materiale (MRP), nella forma base, calcola con tempi di approvvigionamento fissi pianificati e senza limiti di capacità. Ciò è sufficiente per determinare i fabbisogni di materiale, ma non per creare un programma di produzione realizzabile.

Un sistema di [pianificazione e schedulazione avanzata (APS)](https://www.m365.fm/entity/advanced-planning-and-scheduling/), invece, programma su capacità finita: macchine, persone con qualifiche, utensili, turni e disponibilità di materiale vengono considerati contemporaneamente. Il metodo sottostante è chiamato [schedulazione basata su vincoli](https://www.m365.fm/entity/constraint-based-scheduling/). Infine, un sistema di esecuzione della produzione (MES) controlla e documenta l'esecuzione in reparto e fornisce le conferme senza le quali né la pianificazione né la tracciabilità funzionano.

La guida correlata [Schedulazione della produzione e APS](https://www.m365.fm/en/learn/production-scheduling-aps/) illustra in dettaglio le differenze tra ERP, APS e MES, i limiti della logica MRP e come selezionare il software di pianificazione.

### 5.3 Cosa deve includere in più un modello di pianificazione aerospaziale

Rispetto alla manifattura generica, un modello di pianificazione in ambito aerospaziale richiede alcuni vincoli aggiuntivi:

- **Matrice delle qualifiche** per il personale (processi speciali, autorizzazioni all'ispezione, autorizzazioni al rilascio)
- **Qualifica delle macchine** per codice articolo (non tutte le macchine sono approvate per ogni pezzo)
- **Lavorazioni esterne** con tempi di approvvigionamento realistici e impegni di capacità da parte dei fornitori di processo
- **Fasi di ispezione e rilascio** come operazioni schedulabili con capacità propria (laboratorio di ispezione, ispettori, FAI)
- **Dati di configurazione e di effettività** (quale revisione si applica da quale numero di serie o velivolo)
- **Allocazione del materiale a livello di colata** anziché solo disponibilità di quantità (inclusa l'origine di fusione dove si applicano le norme DFARS sui metalli speciali [51])
- **Vincoli di lotto** per forni, autoclavi e vasche di processo (carico minimo, compatibilità di pezzi e materiali)
- **Restrizioni di accesso ai dati** per ordini controllati ITAR o CUI (chi può vedere e programmare quali lavori) [36][49]

## 6. Comprendere e ridurre il lead time

### 6.1 La legge di Little: il legame tra scorte e tempo

Nel 1961, John D. C. Little ha dimostrato una relazione valida per ogni sistema produttivo stabile: le scorte medie nel sistema sono pari al throughput moltiplicato per il tempo medio di permanenza nel sistema [27]. Riordinando:

**Lead time = work in process (WIP) ÷ throughput**

**Esempio pratico:** Un reparto che produce componenti per motori spedisce in media 40 pezzi a settimana. Nel sistema si trovano 320 pezzi (in lavorazione, in attesa, presso il fornitore di lavorazioni esterne, in ispezione). Il lead time medio è quindi 320 ÷ 40 = 8 settimane. Se il WIP può essere ridotto a 200 pezzi con lo stesso throughput, il lead time scende a 5 settimane. Il throughput non cambia finché il collo di bottiglia è sempre alimentato.

La legge spiega perché rilasciare più ordini in produzione non riduce i tempi di consegna ma li allunga: il WIP aumenta, il throughput resta invariato, il lead time cresce.

### 6.2 Dove va il tempo

In molte fabbriche il tempo di lavorazione effettivo è solo una piccola parte del lead time; la parte maggiore è il tempo di attesa. Si tratta di una regola empirica ampiamente condivisa, non di un rapporto documentato in modo generale [unverified: regola empirica diffusa, non documentata in modo generale]. La proporzione dipende fortemente dall'azienda e andrebbe misurata nel proprio stabilimento, ad esempio con la [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/). Nell'aerospaziale, le cause tipiche sono:

- **Attesa per lavorazioni speciali esterne** (trasporto di andata e ritorno, coda presso il fornitore, restituzione dei certificati)
- **Attesa per ispezione e rilascio** (laboratorio di ispezione, FAI, ispezione presso il cliente, deroghe)
- **Attesa per materiale o documenti** (certificati mancanti, modifiche ingegneristiche aperte)
- **Raggruppamento in lotti** (i pezzi attendono finché un forno o un lotto non è completo)
- **Colli di bottiglia sovraccarichi** (un'elevata saturazione crea code sproporzionatamente lunghe)
- **Interruzioni causate da ordini urgenti** (l'espediting mette da parte gli ordini regolari)

### 6.3 Leve per ridurre il lead time

1. **Limitare il WIP.** Rilasciare solo tanti ordini quanti il collo di bottiglia può elaborarne. La Teoria dei Vincoli lo chiama "fune" (Sezione 11).
2. **Raggruppare e programmare le fasi esterne.** Giorni fissi di ritiro e consegna presso il fornitore riducono la variabilità.
3. **Pianificare la capacità di ispezione.** Il laboratorio di ispezione e gli ispettori sono capacità come le macchine e vanno inclusi nel piano di capacità.
4. **Completare i documenti prima dell'avvio.** Nessun ordine senza documentazione completa, materiale con certificato e revisione di progetto valida.
5. **Non caricare i colli di bottiglia oltre l'85–90 % per periodi prolungati** quando la variabilità è elevata. Questa regola empirica deriva dalla teoria delle code (Sezione 11.1); il valore corretto dipende dalla variabilità del proprio stabilimento. Una piccola riserva di capacità costa spesso meno di code lunghe.

## 7. Pianificazione dei processi speciali e delle lavorazioni esterne

### 7.1 Perché i processi speciali diventano spesso il collo di bottiglia

I processi speciali sono processi il cui risultato non può essere verificato completamente sul pezzo finito senza distruggerlo, ad esempio trattamento termico, trattamento superficiale, saldatura o alcuni rivestimenti. La loro qualità deve quindi essere garantita attraverso processi, attrezzature e persone qualificati. In ambito aerospaziale, molti clienti richiedono per essi l'accreditamento Nadcap [21][54].

Questo ha tre conseguenze per la pianificazione. In primo luogo, il numero di fornitori approvati è limitato; un cambio richiede una qualifica e spesso una nuova ispezione del primo articolo. In secondo luogo, molti di questi processi funzionano a lotti (forni, vasche, autoclavi), il che crea tempi di raggruppamento e di attesa. In terzo luogo, i fornitori segnalano che in particolare i collaudi e i trattamenti superficiali hanno tempi di consegna lunghi [10].

### 7.2 Regole di pianificazione per i processi speciali

- **Modellare il processo speciale come una risorsa,** non come un lead time piatto. Un trattamento termico esterno con due cicli di forno a settimana è una capacità con una cadenza, non un "lead time di 10 giorni".
- **Concordare per contratto gli impegni di capacità** (slot settimanali) e memorizzarli nella pianificazione come vincolo rigido.
- **Pianificare il raggruppamento in modo deliberato.** Quali pezzi possono essere lavorati insieme? Quale carico minimo ha senso? Per quanto tempo al massimo un pezzo può attendere un lotto?
- **Rendere la conferma, certificato incluso, una condizione per l'operazione successiva.**
- **Qualificare fornitori alternativi** prima che il collo di bottiglia diventi critico. La qualifica richiede spesso mesi.

### 7.3 Processi speciali interni: fare o acquistare dal punto di vista della capacità

Molti fornitori valutano di internalizzare i processi speciali per ridurre la propria dipendenza. Questo può avere senso, ma è un progetto con un proprio lungo lead time: attrezzature, qualifica, accreditamento, personale e approvazioni dei clienti. Una simulazione del futuro utilizzo (Sezione 11.4) aiuta a chiarire se l'investimento è remunerativo oppure se l'attrezzatura interna crea solo un nuovo collo di bottiglia con bassa saturazione.

## 8. Modifiche di ingegneria e gestione della configurazione

### 8.1 Le modifiche sono normali in ambito aerospaziale

Nel lungo ciclo di vita di un programma aeronautico, disegni, materiali, processi e fornitori cambiano continuamente. Ogni modifica deve essere valutata, approvata e assegnata a una effettività: da quale numero di serie, aeromobile o data si applica la nuova revisione? Per la pianificazione, questa è una fonte permanente di disturbo.

### 8.2 Cosa comporta una modifica nella pianificazione

| Impatto | Conseguenza per la pianificazione |
|---|---|
| Nuova revisione di progetto | verificare gli ordini aperti: esaurirli, rilavorarli, rottamarli oppure spedirli con una deroga |
| Operazioni nuove o modificate | aggiornare ciclo di lavorazione, tempi standard, programmi NC e piani di controllo |
| Ispezione del primo articolo (completa o parziale) | pianificare la FAI come operazione autonoma con capacità di ispezione; approvazione prima delle consegne di produzione [18][34] |
| Cambio di materiale o fornitore | qualifica, eventualmente una nuova FAI, nuovi certificati e lead time di approvvigionamento |
| Nuove attrezzature o dispositivi di bloccaggio | lead time di approvvigionamento, accettazione, eventualmente FAI per attrezzature modificate |

Secondo AS9102, una modifica di progetto che incide su forma, adattamento o funzione, un cambio di fonte, processo, ubicazione o attrezzatura di produzione e un'interruzione della produzione superiore a due anni, tra gli altri casi, attivano un'ispezione completa o parziale del primo articolo [34]. La revisione C di AS9102, pubblicata nel 2023, pone maggiore enfasi sulla pianificazione, sulla valutazione e sulla ripetizione delle ispezioni del primo articolo [18][46]. In Europa, l'edizione corrispondente è stata pubblicata come EN 9102:2024 (in Germania come DIN EN 9102:2025-01) [17].

### 8.3 Regole pratiche per la gestione delle modifiche

1. **Raggruppare le modifiche dove il cliente lo consente.** Molte piccole modifiche singole costano più di poche modifiche raggruppate.
2. **Definire presto l'effettività e trasferirla alla pianificazione.** Un ordine deve sapere fin dall'inizio quale revisione sta costruendo.
3. **Gestire attivamente le scorte delle vecchie revisioni.** Lanciare grandi lotti della vecchia revisione quando una modifica è prevedibile produce scarti.
4. **Riservare capacità per la FAI.** Le risorse di ispezione per i primi articoli si saturano rapidamente durante le fasi di avviamento e le ondate di modifiche.
5. **Rendere visibile lo stato delle modifiche sulla bacheca di pianificazione.** Gli ordini con modifiche aperte sono ordini a rischio.

## 9. Curve di apprendimento di Wright: teoria ed esempio svolto

### 9.1 La scoperta del 1936

Nel 1936, Theodore Paul Wright pubblicò l'articolo "Factors Affecting the Cost of Airplanes" sul *Journal of the Aeronautical Sciences* (vol. 3, n. 4, pp. 122–128) [24]. Egli constatò che le ore di lavoro necessarie per ogni aeroplano diminuivano di circa il 20 % a ogni raddoppio della produzione cumulativa [25]. Questo andamento è oggi noto come legge di Wright o curva di apprendimento. Una riduzione del 20 % per raddoppio è chiamata curva di apprendimento all'80 %; il nome indica la quota residua [25].

Le curve di apprendimento restano uno strumento standard per la stima dei costi e la pianificazione della capacità nel settore aerospaziale. L'US Government Accountability Office (GAO) le descrive nella sua Cost Estimating and Assessment Guide [26].

### 9.2 Due varianti: modello della media cumulativa e modello unitario

Esistono due formulazioni comuni [26]:

- **Modello della media cumulativa (Wright):** le ore *medie* su tutte le unità prodotte fino a quel momento diminuiscono di una percentuale fissa a ogni raddoppio.
- **Modello unitario (modello Crawford):** le ore per la singola unità *individuale* diminuiscono di una percentuale fissa a ogni raddoppio.

Entrambi usano la stessa formula ma grandezze di riferimento diverse [26][40]. Decidete quale variante utilizzate e mantenetela. Se si trasferisce un tasso di apprendimento dal modello della media cumulativa al modello unitario, si confrontano valori effettivi e valori obiettivo che non corrispondono.

La formula è: **Y = A · X^b**, dove A = ore per la prima unità, X = unità cumulative e b = log(tasso di apprendimento) ÷ log(2) [26].

### 9.3 Esempio svolto: avvio di un nuovo assemblaggio

Un fornitore assume l'assemblaggio di un nuovo sottogruppo. La prima unità richiede 1.000 ore di assemblaggio. Sulla base di programmi comparabili si ipotizza una curva di apprendimento all'85 % (modello della media cumulativa).

**Passo 1: calcolo dell'esponente.** b = log(0,85) ÷ log(2) = −0,2345.

**Passo 2: ore medie e ore unitarie.** Le ore per l'unità N derivano dalla differenza dei totali cumulativi: T(N) = N · media(N) − (N−1) · media(N−1).

| Unità cumulative N | Ore medie per unità | Ore cumulative | Ore per l'unità N |
|---|---|---|---|
| 1 | 1.000,0 | 1.000 | 1.000,0 |
| 2 | 850,0 | 1.700 | 700,0 |
| 4 | 722,5 | 2.890 | 571,3 |
| 8 | 614,1 | 4.913 | 477,4 |
| 16 | 522,0 | 8.352 | 402,6 |
| 32 | 443,7 | 14.199 | 340,9 |
| 50 | 399,6 | 19.981 | 306,6 |
| 100 | 339,7 | 33.968 | 260,3 |

**Passo 3: conseguenze per la pianificazione della capacità.** Se il fornitore pianificasse le prime dieci unità con le ore della centesima unità (260 ore), arriverebbe a 2.603 ore. Secondo la curva di apprendimento, le prime dieci unità richiedono in realtà 5.828 ore, più del doppio. Un avvio pianificato con le ore standard a regime è quindi sistematicamente sottodimensionato.

**Passo 4: verifica della sensibilità.** Quanto dipende il risultato dal tasso di apprendimento ipotizzato? Con una curva al 90 % invece che all'85 %, il fabbisogno per le prime 100 unità sale da 33.968 a 49.659 ore, un aumento del 46 %. La scelta del tasso di apprendimento è quindi una delle ipotesi più influenti nell'intero piano di avvio.

### 9.4 Regole pratiche per le curve di apprendimento

- **Ricavate i tassi di apprendimento dai vostri dati,** non copiateli dalla letteratura. Registrate fin dall'inizio le ore effettive per unità.
- **Distinguete le curve di apprendimento in base al contenuto di lavoro.** L'assemblaggio manuale apprende più della lavorazione meccanica, dove il tempo macchina quasi non diminuisce.
- **Tenete conto delle interruzioni.** Dopo pause prolungate, cambi di personale o trasferimenti, una parte dell'effetto di apprendimento va perduta.
- **Confrontate costantemente effettivo e obiettivo.** Se le ore effettive restano sopra la curva, o l'ipotesi o il processo è sbagliato. La pianificazione deve sapere quale dei due.
- **Le modifiche di ingegneria azzerano in parte la curva.** Una modifica rilevante può avviare un nuovo processo di apprendimento.

## 10. Pianificazione di un aumento di cadenza: calcolo e checklist

### 10.1 Perché gli aumenti di cadenza falliscono al collo di bottiglia

Un aumento di cadenza viene spesso valutato sulla base della capacità complessiva: "Siamo al 75 % di utilizzo medio, quindi possiamo gestire il 20 % in più". Questo raramente è vero, perché il throughput è determinato dal collo di bottiglia, non dalla media. La [Teoria dei Vincoli](https://www.m365.fm/entity/theory-of-constraints/) di Eliyahu M. Goldratt ha reso popolare questo principio negli anni Ottanta [28].

### 10.2 Esempio svolto: da cadenza 60 a cadenza 72

Un fornitore consegna un set di componenti di raccordo per ogni aeromobile. La cadenza del cliente deve salire da 60 a 72 aeromobili al mese (+20 %). Le tre risorse più importanti si presentano così:

| Risorsa | Ore disponibili/mese | Carico a cadenza 60 | Utilizzo cadenza 60 | Carico a cadenza 72 | Utilizzo cadenza 72 |
|---|---|---|---|---|---|
| Lavorazione a 5 assi | 1.400 | 1.190 | 85 % | 1.428 | 102 % |
| Sbavatura e assemblaggio | 2.000 | 1.300 | 65 % | 1.560 | 78 % |
| Laboratorio di ispezione (CMM) | 600 | 420 | 70 % | 504 | 84 % |
| Totale (ponderato sulle ore) | 4.000 | 2.910 | 73 % | 3.492 | 87 % |

Un utilizzo complessivo dell'87 % sembra fattibile. Ma la lavorazione a 5 assi, con il 102 %, è sopra la sua capacità, e questo senza considerare disservizi, attrezzaggi per varianti aggiuntive o prime ispezioni di articolo dopo le modifiche. A ciò si aggiunge l'effetto descritto nella Sezione 6: più l'utilizzo si avvicina al 100 %, più le code crescono. Senza interventi, il lead time e le consegne in ritardo aumentano, anche se matematicamente la capacità totale è sufficiente.

**Possibili azioni, ordinate per tempo di attuazione:**

1. **Immediatamente:** proteggere il collo di bottiglia (nessun tempo morto durante le pause, preparazione degli attrezzaggi fuori tempo macchina, separazione dell'ispezione dalla macchina).
2. **Settimane:** turni straordinari nel fine settimana, spostamento di parti a minore complessità su altre macchine qualificate.
3. **Mesi:** ottimizzazione dei programmi (tempo ciclo), attrezzature per più attrezzaggi, esternalizzazione di singole parti a partner qualificati (con FAI).
4. **Trimestri o anni:** una macchina aggiuntiva, inclusi tempi di consegna, installazione, qualifica e approvazione del cliente.

L'ultimo punto mostra perché gli aumenti di cadenza nell'aerospazio richiedono tanto tempo: tra la decisione per una nuova macchina e la prima consegna di produzione approvata passano spesso molti mesi.

### 10.3 Checklist: il vostro stabilimento è pronto per la prossima cadenza?

**Domanda e scenari**

- [ ] Cadenza del cliente, rilasci e domanda di ricambi per numero di parte sono disponibili per almeno 18 mesi.
- [ ] Sono stati calcolati almeno tre scenari di cadenza (conservativo, di piano, ambizioso).
- [ ] I trigger per investimenti e assunzioni sono definiti in anticipo.

**Capacità**

- [ ] Il collo di bottiglia è noto per ogni scenario, non solo l'utilizzo medio.
- [ ] L'utilizzo del collo di bottiglia nello scenario di piano è inferiore all'85-90 %.
- [ ] Le curve di apprendimento per le nuove parti sono pianificate (Sezione 9).
- [ ] La capacità di ispezione e misura è pianificata per produzione, FAI e modifiche.

**Persone**

- [ ] La matrice delle qualifiche mostra quante persone sono disponibili per ogni processo speciale e ogni ispezione.
- [ ] I tempi di onboarding e qualificazione dei nuovi dipendenti sono inclusi nel piano.
- [ ] I single point of failure (qualifiche detenute da una sola persona) sono identificati.

**Materiali e fornitori**

- [ ] I contratti di materia prima coprono la cadenza più alta, inclusi i lead time.
- [ ] I processi speciali esterni hanno impegni di capacità per la nuova cadenza.
- [ ] Le seconde fonti per materiali e processi critici sono qualificate o in qualifica.
- [ ] Per le forniture della difesa: le fonti di materiale rispettano le regole DFARS sui metalli speciali [51].

**Qualità e approvazioni**

- [ ] Nuove macchine, attrezzature e fonti sono pianificate con i tempi di FAI e approvazione del cliente.
- [ ] La prova di prontezza produttiva alla cadenza del cliente (AS9145) è preparata [35].
- [ ] La tracciabilità funziona con volumi più elevati senza rilavorazioni manuali.

**Controllo**

- [ ] I KPI (OTD, lead time, WIP, utilizzo del collo di bottiglia) sono monitorati settimanalmente.
- [ ] È definito un percorso di escalation per i disservizi al collo di bottiglia.
- [ ] Il piano viene regolarmente riconciliato con le conferme effettive.

## 11. Pianificazione della capacità con APS, gestione dei colli di bottiglia e simulazione

### 11.1 Perché un'elevata utilizzazione costa tempo

La teoria delle code fornisce una semplice regola empirica: il tempo medio di attesa presso una risorsa cresce con il fattore u ÷ (1 − u), dove u è l'utilizzazione. Questa approssimazione risale a J. F. C. Kingman (1961); nella sua forma completa include anche la variabilità degli arrivi e dei tempi di lavorazione [38]. Con un'utilizzazione dell'80 % il fattore è 4, al 90 % è già 9 e al 95 % è 19. Il tempo di attesa presso una risorsa con utilizzazione del 95 % è quindi quasi cinque volte quello con l'80 %, a parità di altre condizioni.

Questo è particolarmente rilevante per l'aerospaziale, con la sua elevata variabilità (modifiche, rilavorazioni, lavorazioni esterne, ordini urgenti). Se si pianifica un collo di bottiglia al 98 % di utilizzazione, si pianificano anche lunghi tempi di attraversamento.

### 11.2 Gestione dei colli di bottiglia con la Teoria dei Vincoli

La Teoria dei Vincoli (TOC) descrive cinque fasi di focalizzazione: identificare il vincolo, sfruttarlo, subordinare a esso tutto il resto, elevarlo e poi ricominciare, perché il vincolo si sposta [28]. Per il controllo della produzione in officina si è affermato il principio drum-buffer-rope (DBR):

- **Drum (tamburo):** il collo di bottiglia detta il ritmo. Il suo programma è il programma principale dell'officina.
- **Buffer (polmone):** davanti al collo di bottiglia è posto un polmone temporale, affinché i disturbi a monte non lo lascino senza materiale.
- **Rope (fune):** il rilascio del materiale all'inizio della produzione è legato al collo di bottiglia. Viene rilasciato solo ciò che il collo di bottiglia può lavorare nel prossimo futuro. Ciò mantiene limitato il lavoro in corso (WIP).

Nell'aerospaziale il collo di bottiglia spesso non si trova nel proprio stabilimento, ma nella lavorazione speciale esterna o nel laboratorio di ispezione. Il DBR funziona comunque: si tratta la fase esterna come drum e si lega il proprio rilascio ai suoi slot.

### 11.3 APS nell'aerospaziale: cosa deve fare

Un sistema APS per un fornitore aerospaziale dovrebbe essere in grado di fare almeno quanto segue:

| Capacità | Perché è importante nell'aerospaziale |
|---|---|
| Schedulazione a capacità finita | I colli di bottiglia sono la regola, non l'eccezione |
| Qualifiche di persone e macchine | Possono essere schedulate solo risorse qualificate |
| Operazioni esterne con slot | Le lavorazioni speciali sono spesso il vero collo di bottiglia |
| Formazione di batch | Forni, vasche e autoclavi lavorano a lotti |
| Fasi di ispezione e rilascio | FAI e ispezioni assorbono capacità |
| Riprogrammazione rapida | Modifiche, rilavorazioni e ordini urgenti sono frequenti |
| Scenari (what-if) | Valutare scenari di ritmo, investimenti, guasti dei fornitori |
| Feedback dall'officina | Senza dati effettivi, ogni piano diventa obsoleto |
| Integrazione con ERP e MES | I dati anagrafici e gli ordini provengono dall'ERP, i dati effettivi dal MES |
| Controllo degli accessi ai dati controllati | Gli ordini ITAR e CUI devono essere visibili solo agli utenti autorizzati [36][49] |

La guida gemella [Production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) contiene una checklist di selezione e una roadmap di implementazione per i sistemi APS.

### 11.4 Simulazione: verificare le decisioni sulla capacità prima di prenderle

Una [simulazione di fabbrica](https://www.m365.fm/entity/factory-simulation/) rappresenta in un modello risorse, ordini, variabilità e regole e percorre settimane o mesi in pochi minuti. Risponde a domande che un calcolo statico della capacità non può affrontare:

- Come evolvono il tempo di attraversamento e la puntualità delle consegne al ritmo 67 e al ritmo 75?
- Che cosa porta una macchina in più e dove compare il collo di bottiglia successivo?
- Che cosa succede se il trattamento termico esterno è fermo per due settimane?
- Quale regola di rilascio mantiene il WIP più basso a parità di puntualità delle consegne?
- Una lavorazione speciale interna è conveniente, o l'attrezzatura resterà sottoutilizzata?

La simulazione non sostituisce la schedulazione di dettaglio; prepara le decisioni strategiche e tattiche. È particolarmente preziosa prima di investimenti con lunghi tempi di approvvigionamento, situazione in cui si trovano molti fornitori con gli attuali piani di ritmo. Su m365.fm trovate anche la pagina dell'entità [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) sul tema della pianificazione e della simulazione.

## 12. Rischi della catena di fornitura dal 2022 al 2026 e le loro implicazioni per la pianificazione

### 12.1 Cosa è successo negli ultimi anni

**Motori.** Nel 2023 Pratt & Whitney ha comunicato un difetto nella metallurgia delle polveri di alcune parti del motore turbofan a ingranaggi (GTF), che può portare alla formazione di cricche. Nel settembre 2023 la società madre RTX ha annunciato che fino al 2026 sarebbero stati necessari ulteriori 600-700 motori da rimuovere per le visite in officina, e ha previsto una media di 350 aeromobili della famiglia A320 a terra ogni anno. RTX ha registrato un onere al lordo delle imposte di 3 miliardi di dollari; i costi complessivi sono stimati fino a 7 miliardi di dollari, parte dei quali ricade su partner come MTU [11]. Nel 2026 Airbus ha accusato Pratt & Whitney di dare priorità alla manutenzione sul campo rispetto alla consegna di nuovi motori e di non fornire le quantità ordinate [4]. A metà 2026 Airbus ha dichiarato di non avere più aeromobili completati in attesa solo dei motori, ma di non disporre neppure di una scorta di riserva [39].

**Titanio.** Dopo l'attacco della Russia all'Ucraina, nel marzo 2022 Boeing ha sospeso gli acquisti dal produttore russo di titanio VSMPO-Avisma. Airbus, che all'epoca dichiarava di approvvigionarsi per circa la metà del proprio titanio dalla Russia, ha inizialmente continuato ad acquistare [12]. Il titanio resta nel 2026 uno dei rischi per le materie prime più citati [10]. Per i fornitori dei programmi di difesa statunitensi, la clausola DFARS sui metalli speciali aggiunge una restrizione sulla fonte di approvvigionamento al problema della disponibilità [51].

**Fusioni e forgiature.** Roland Berger segnala carenze persistenti nel 2026 per fusioni e forgiature destinate a componenti di motori e sistemi (come il carrello di atterraggio) e per i fissaggi per le strutture. Per le pale delle turbine, l'aerospaziale compete con le turbine a gas industriali, la cui domanda cresce anch'essa a causa del fabbisogno energetico dei data center [10].

**Manodopera qualificata.** La carenza di personale qualificato resta il freno più comune alla rampa di produzione (56% dei rispondenti) [10]. La situazione nella manutenzione è analoga (Sezione 13).

**Cambiamenti strutturali tra i fornitori.** Airbus sta rilevando pacchetti di lavoro già affidati a Spirit AeroSystems. L'integrazione ha ridotto i risultati di Airbus per i primi nove mesi del 2026 di 235 milioni di euro [3]. Cambiamenti di questo tipo modificano i rapporti di fornitura su tutti i livelli a valle.

### 12.2 Risposte nella pianificazione

| Rischio | Risposta nella pianificazione |
|---|---|
| Tempi di approvvigionamento dei materiali lunghi e variabili | accordi a lungo termine con impegni di capacità, scorte di sicurezza mirate sui materiali critici, aggiornamento regolare dei tempi di reintegro |
| Fonti uniche per i processi speciali | qualificare fonti alternative, assicurare slot tramite contratto, modellare il collo di bottiglia nel piano |
| Rilasci fluttuanti da parte del cliente | monitorare separatamente il ritmo e i rilasci del cliente, segnalare tempestivamente gli scostamenti |
| Carenza di manodopera | matrice delle qualifiche, formazione incrociata, inserimento dei neoassunti nel piano di capacità |
| Guasto di un fornitore | simulare scenari, monitorare gli indicatori di allerta precoce (consegne in ritardo, qualità, salute finanziaria) |
| Accumulo di scorte contro le interruzioni | detenere scorte in modo deliberato e in quantità limitate dove proteggono il collo di bottiglia; ogni unità di scorta allunga il lead time secondo la Legge di Little |

Una nota importante sull'ultimo punto: le scorte non sono una protezione gratuita. Secondo Roland Berger, il 40% dei fornitori ha costituito scorte più elevate in vista dell'avvio della produzione, con una pressione sui margini già ridotti [10]. Scorte di sicurezza mirate davanti al collo di bottiglia sono più efficaci di scorte generalizzate per tutti i componenti.

## 13. Pianificazione MRO: manutenzione con riscontri non pianificati

### 13.1 Il mercato MRO nel 2026

La manutenzione, riparazione e revisione (MRO) è un mercato ampio e in crescita. Nella sua previsione pubblicata insieme alla US Aeronautical Repair Station Association (ARSA), Oliver Wyman stima il mercato globale MRO dell'aviazione commerciale a 139,6 miliardi di dollari per il 2026, e prevede una crescita fino a 193,1 miliardi di dollari entro il 2036. La manutenzione dei motori è il segmento più grande, con 70,1 miliardi di dollari. La flotta dovrebbe crescere da circa 30.000 aeromobili commerciali all'inizio del 2026 a circa 41.100 nel 2036 [30]. In un'analisi separata di settembre 2026, Oliver Wyman indica carenze di materiali, tempi di consegna lunghi per fusioni e forgiati e pochi fornitori per le parti critiche dei motori; quasi il 30 % degli intervistati ritiene che la catena di fornitura tornerà pienamente operativa solo tra più di tre anni [29].

Anche i ritardi nelle consegne di nuovi aeromobili aumentano la pressione: le compagnie aeree utilizzano gli aeromobili più vecchi per periodi più lunghi, e questi richiedono più manutenzione. Lo studio IATA stima il costo aggiuntivo di manutenzione del solo 2025 in 3,1 miliardi di dollari [9]. Allo stesso tempo, la nuova produzione e la manutenzione competono per gli stessi ricambi e la stessa capacità, come mostra la controversia tra Airbus e Pratt & Whitney [4].

### 13.2 Quadro normativo

Negli Stati Uniti, un'officina di manutenzione opera tipicamente con un certificato di stazione di riparazione rilasciato ai sensi del 14 CFR Parte 145. Una stazione di riparazione può lavorare solo su articoli per i quali è abilitata e entro le proprie specifiche operative, e "non può manutenere né modificare alcun articolo per il quale non è abilitata" [42]. Deve mantenere aggiornati i dati di manutenzione, come le direttive di aeronavigabilità, i manuali di manutenzione, i manuali di revisione e i bollettini di servizio, "aggiornati e accessibili quando viene eseguito il relativo lavoro", gestire un programma di formazione approvato dalla FAA e conservare le registrazioni dei lavori per almeno due anni dall'approvazione per il ritorno in servizio [42]. I pacchetti di lavoro provengono tipicamente dall'operatore dell'aeromobile, che è anche responsabile delle registrazioni, come lo stato attuale dei componenti a vita limitata ai sensi del 14 CFR 91.417 [53]. Molte stazioni di riparazione sono inoltre certificate secondo AS9110 [20].

In Europa, un'organizzazione di manutenzione opera con un'approvazione ai sensi dell'EASA Parte 145. I pacchetti di lavoro provengono spesso da un'organizzazione di gestione della navigabilità continua (Part-CAMO), che gestisce il programma di manutenzione, le direttive di aeronavigabilità e i componenti a vita limitata [23]. Le stazioni di riparazione statunitensi che detengono anche un'approvazione EASA possono emettere doppi rilasci sul modulo FAA 8130-3 [43].

Per la pianificazione, entrambi i sistemi significano la stessa cosa: il lavoro è consentito solo entro l'ambito approvato, da personale autorizzato e secondo dati di manutenzione validi, come l'Aircraft Maintenance Manual (AMM) o il Component Maintenance Manual (CMM) nella revisione corrente. Anche un tecnico senza l'autorizzazione o la formazione adeguata non rappresenta qui capacità disponibile.

### 13.3 Cosa rende la pianificazione MRO fondamentalmente diversa

Nella nuova produzione, il contenuto di lavoro è noto prima dell'avvio dell'ordine. Nella manutenzione, è noto solo dopo che l'aeromobile, il motore o il componente è stato aperto e ispezionato. La pianificazione deve quindi gestire tre tipi di lavoro:

- **Lavoro di routine:** attività programmate dal programma di manutenzione o dal manuale di officina, facili da pianificare
- **Lavoro non di routine (riscontri):** corrosione, cricche, usura o danni scoperti durante l'ispezione; portata e tempistica sono incerte
- **Lavoro aggiuntivo:** modifiche, direttive di aeronavigabilità o richieste del cliente aggiunte al pacchetto di lavoro

Il KPI centrale è il tempo di turnaround (TAT), ossia il tempo dall'ingresso in officina alla restituzione al cliente. Ogni giorno che un aeromobile o un motore trascorre in più in officina costa denaro all'operatore. Il TAT è spesso determinato meno dalle ore di manodopera che dall'attesa di ricambi, dalle decisioni sui riscontri, dalle approvazioni e dagli specialisti.

### 13.4 Esempio svolto: pianificare i riscontri invece di sperare

Un'officina MRO di componenti pianifica la revisione di un tipo di componente. Il lavoro di routine è di 80 ore. Dalla storia dell'officina negli ultimi 50 ordini emergono tre riscontri tipici (tutti i valori sono ipotesi per l'esempio):

| Riscontro | Frequenza | Ore aggiuntive | Ricambi necessari |
|---|---|---|---|
| Corrosione, riparabile | 40 % | 12 h | no |
| Cricca, sostituzione del pezzo | 10 % | 20 h | sì, tempo di consegna 15 giorni lavorativi, non a magazzino |
| Usura, ricambio | 30 % | 6 h | sì, da magazzino |

**Ore aggiuntive attese:** 0,4 × 12 + 0,1 × 20 + 0,3 × 6 = 4,8 + 2,0 + 1,8 = 8,6 ore. In media, si possono pianificare circa 89 ore per ordine. Per la pianificazione della capacità su molti ordini, questo valore atteso è utile.

**Per l'impegno sul TAT, non basta.** Per il 10 % degli ordini si aggiungono 15 giorni lavorativi di attesa per il ricambio. Se si assume il TAT come media (matematicamente un margine di 1,5 giorni), si mancherà l'obiettivo in modo marcato su ogni decimo ordine. Opzioni migliori sono:

1. **Tenere il ricambio a magazzino:** una o due parti in giacenza riducono notevolmente il rischio sul TAT. Confrontare il costo della giacenza con il costo del ritardo.
2. **Ispezionare prima:** prima si conosce il riscontro, prima si può ordinare. Pianificare l'ispezione come primo passo, con priorità.
3. **Impegnare il TAT per percentile:** ad esempio un TAT rispettato nell'80 o nel 90 % dei casi, con una regola trasparente per i riscontri con tempi di approvvigionamento lunghi.
4. **Pool di scambio:** per i riscontri frequenti, un pool di scambio di componenti revisionabili può separare il TAT dal ciclo di riparazione.

### 13.5 Regole pratiche per la pianificazione MRO

- **Registrare sistematicamente lo storico dei riscontri.** Senza dati sulla frequenza e sull'impegno dei riscontri, ogni piano resta una stima.
- **Riservare capacità per i lavori non di routine.** Se l'hangar o l'officina sono caricati al 100 % con lavori di routine, non resta spazio per i riscontri.
- **Verificare la disponibilità dei ricambi prima di accettare l'ordine.** I ricambi critici con tempi di approvvigionamento lunghi sono il maggiore rischio per il TAT.
- **Verificare la vita residua e lo storico dei ricambi.** I ricambi privi di tracciabilità completa non possono essere rimontati (Sezione 4.4).
- **Pianificare in modo visibile gli specialisti del collo di bottiglia.** Ispettori NDT, personale autorizzato all'approvazione per il ritorno in servizio e officine specializzate sono spesso il collo di bottiglia.
- **Informare tempestivamente i clienti sui riscontri.** Le decisioni di approvazione del cliente sono spesso l'attesa più lunga del processo.

## 14. Gemello digitale e filo digitale

### 14.1 Termini

Un [gemello digitale](https://www.m365.fm/entity/digital-twin/) della produzione è un modello della fabbrica reale alimentato con dati attuali e utilizzato per analisi, pianificazione e simulazione. Copre risorse, ordini, cicli di lavorazione, giacenze e regole. Il filo digitale (digital thread) è il collegamento continuo dei dati di un prodotto lungo il suo ciclo di vita: dalla progettazione alla produzione e al collaudo, fino all'esercizio e alla manutenzione. In ambito aerospaziale il filo digitale è strettamente legato alla tracciabilità e alla gestione della configurazione, perché collega il progettato, il costruito e il mantenuto.

### 14.2 Vantaggi per la pianificazione e la qualità

- **Pianificazione:** il gemello della fabbrica consente scenari e ottimizzazione basati sullo stato attuale (vedere Sezione 11.4).
- **Tracciabilità:** il filo digitale risponde a domande su lotti, processi e configurazioni in pochi minuti anziché in giorni.
- **Modifiche:** diventa visibile l'impatto di una modifica di progetto sugli ordini aperti, sulle giacenze e sui cicli di lavorazione.
- **MRO:** collegare lo storico di produzione e i riscontri di manutenzione permette di trarre conclusioni su punti deboli di processo e di progetto.

### 14.3 Prerequisiti

Un gemello digitale vale quanto i suoi dati. Prima di investire in modelli, verificare cicli di lavorazione, tempi standard, calendari di capacità, qualifiche e qualità delle conferme. La società di consulenza 4flow indica come ostacoli tipici in ambito aerospaziale le distinte base errate, i tempi di approvvigionamento non aggiornati e i dati sparsi tra piattaforme ERP, PLM e MES non collegate, che spesso riportano i pianificatori a fogli di calcolo isolati [33]. La guida gemella [Gemello digitale nella manifattura](https://www.m365.fm/en/learn/digital-twin-manufacturing/) tratta questo tema più in profondità; le questioni di architettura IT, come il collegamento dei dati di macchine e pianificazione alle piattaforme cloud, sono trattate nella guida [IT manifatturiero con Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/). Per i dati soggetti a controlli sull'esportazione o alle regole CUI, la localizzazione dei dati e i diritti di accesso devono essere chiariti in anticipo [36][37][49]. Nei programmi di difesa statunitensi ciò include il livello CMMC richiesto per i sistemi che ospitano i dati [49][50].

## 15. KPI per la pianificazione e il controllo

| KPI | Definizione | Perché è importante nell'aerospazio |
|---|---|---|
| On-time delivery (OTD) | quota di consegne effettuate alla data concordata (concordare definizione e finestra di tolleranza con il cliente) | criterio centrale nelle valutazioni dei fornitori; indicato come requisito in AS9100 [14] |
| Lead time | tempo dall'avvio dell'ordine al completamento, come media e dispersione | determina la capacità di consegna e le scorte (legge di Little) [27] |
| Work in process (WIP) | numero o valore degli ordini in officina | indicatore anticipatore dell'aumento dei lead time |
| Utilizzo del collo di bottiglia | tempo occupato ÷ tempo disponibile al collo di bottiglia | determina il throughput; sopra il 90 % i tempi di attesa aumentano bruscamente [38] |
| Aderenza al programma | quota di operazioni completate nella finestra di tempo pianificata | mostra se il piano è realistico |
| Escapes | numero di parti difettose che raggiungono il cliente | impatto di costo più elevato, spesso un indicatore del cliente; elemento obbligatorio del sistema qualità per i titolari di approvazione di produzione FAA [41] |
| First pass yield (FPY) | quota di parti senza rilavorazione o scarto | le rilavorazioni consumano capacità del collo di bottiglia |
| Tempo di FAI | tempo dal completamento del primo articolo all'approvazione | fattore spesso sottostimato negli avviamenti e nelle modifiche |
| Scostamento dalla curva di apprendimento | ore effettive per unità rispetto alla curva obiettivo | mostra se le ipotesi di lancio sono valide |
| Turnaround time (TAT) | tempo dall'ingresso al rientro in MRO, come media e percentile | criterio principale per i clienti MRO |
| Finding rate | quota di ordini con lavori non di routine e relativo impegno | base per la pianificazione della capacità MRO |

**Una nota sulla misurazione:** definire ogni KPI in modo univoco e applicare la definizione in modo coerente. Le definizioni di OTD in particolare differiscono tra i clienti (riferimento alla prima data richiesta o confermata, consegna anticipata ammessa, consegna parziale o completa). Una metrica che ciascuno calcola in modo diverso non controlla nulla. La guida collegata [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) illustra più nel dettaglio le definizioni dei KPI.

## 16. Approccio: sei passi verso un piano affidabile

**Passo 1: misurare lo stato attuale.** Rilevare lead time, WIP, OTD e utilizzo per risorsa su almeno tre mesi. Una mappa del flusso del valore per le famiglie di parti più importanti mostra dove si perde tempo.

**Passo 2: individuare i colli di bottiglia.** Dove si accumulano gli ordini? Quale risorsa determina il throughput? Includere le lavorazioni speciali esterne, il controllo e le qualifiche del personale.

**Passo 3: pulire i dati anagrafici.** Cicli di lavorazione, tempi standard, tempi di attrezzaggio, calendari di capacità, qualifiche, lead time di approvvigionamento. Senza questa base, ogni strumento di pianificazione produce risultati errati.

**Passo 4: introdurre regole di controllo.** Limitare il WIP, legare il rilascio al collo di bottiglia, proteggere il collo di bottiglia con un polmone e definire regole di priorità.

**Passo 5: introdurre la schedulazione basata sui vincoli.** Aggiungere al sistema ERP una schedulazione di dettaglio che consideri la capacità finita, le qualifiche e gli slot esterni. Iniziare con un'area pilota, idealmente sul collo di bottiglia.

**Passo 6: stabilire scenari e un ciclo di feedback.** Usare la simulazione per le decisioni su cadenze e investimenti e riconciliare piano e consuntivo ogni settimana. Migliorare continuamente i parametri di pianificazione sulla base delle conferme.

> **Verifica rapida per i responsabili di stabilimento e di pianificazione: cinque domande a cui si può rispondere questa settimana**
>
> 1. Qual è oggi il vostro collo di bottiglia e quale è stato il suo utilizzo nelle ultime quattro settimane?
> 2. Quanti ordini sono attualmente in officina e quanti di essi stanno aspettando lavorazioni speciali esterne o controlli?
> 3. Quanto tempo serve per trovare tutti i numeri di serie di un determinato lotto di colata di materia prima?
> 4. Quali tempi standard state usando per le parti in fase di lancio: tempi a regime o una curva di apprendimento?
> 5. Che cosa succede alla vostra on-time delivery se il vostro fornitore esterno di lavorazioni più importante è fermo per due settimane?
>
> Se non riuscite a rispondere con dati entro un giorno a una di queste domande, iniziate dal Passo 1.

**Tempistiche:** i Passi da 1 a 4 non richiedono nuovo software e, secondo l'esperienza dell'autore, possono essere attuati in molte aziende nell'arco di pochi mesi [unverified: stima dell'autore non supportata da dati]. I Passi 5 e 6 richiedono un'implementazione software; la loro durata dipende principalmente dalla qualità dei dati anagrafici. Non sono disponibili dati affidabili di settore sulla durata.

## 17. Errori comuni e come evitarli

1. **Pianificare con capacità infinita.** La logica MRP dell'ERP ignora i colli di bottiglia. Risultato: piani non fattibili fin dall'inizio. *Soluzione:* schedulazione dettagliata con capacità finita.
2. **Rilasciare più ordini per consegnare più in fretta.** Secondo la Legge di Little, un WIP più alto allunga il lead time. *Soluzione:* legare il rilascio al collo di bottiglia.
3. **Modellare le lavorazioni esterne come un lead time fisso.** Le lavorazioni esterne hanno capacità, cadenze e variabilità. *Soluzione:* concordare gli slot e pianificarli come una risorsa.
4. **Dimenticare ispezioni e FAI.** Il laboratorio di ispezione e gli ispettori non sono pianificati e diventano un collo di bottiglia nascosto. *Soluzione:* far entrare le fasi di ispezione come operazioni con capacità.
5. **Usare tempi standard a regime durante il lancio.** Le curve di apprendimento vengono ignorate e il lancio è sottopianificato. *Soluzione:* curva di apprendimento ricavata dai propri dati.
6. **Valutare la media invece del collo di bottiglia.** Un'utilizzazione media del 75 % non dice nulla sulla risorsa collo di bottiglia. *Soluzione:* valutare risorsa per risorsa, concentrandosi sul collo di bottiglia.
7. **Ricostruire la tracciabilità a posteriori.** Le conferme mancanti vengono ricomposte alla fine. *Soluzione:* registrare nel processo, assegnare il materiale prima dell'avvio.
8. **Ignorare le qualifiche.** Il piano assegna attività a persone senza qualifiche valide. *Soluzione:* matrice delle qualifiche come vincolo.
9. **Trattare gli obiettivi di cadenza come impegni.** Si costruisce capacità su un obiettivo ufficiale che poi slitta. *Soluzione:* scenari con trigger.
10. **Impegnarsi sulla media nel MRO.** Gli impegni di TAT basati sulla media vengono regolarmente disattesi quando emergono rilievi. *Soluzione:* percentili e una strategia sui ricambi.
11. **Lasciare che gli ordini urgenti diventino la regola.** Il sollecito costante distrugge la stabilità della schedulazione. *Soluzione:* regole di priorità chiare e diritti di intervento.
12. **Software prima dei dati.** Un APS viene introdotto prima che i dati anagrafici siano corretti. *Soluzione:* la qualità dei dati come primo pacchetto di lavoro.
13. **Trattare i dati controllati come un ripensamento IT.** Ordini soggetti a ITAR o CUI finiscono in un sistema di pianificazione o in un tenant cloud non configurato per essi. *Soluzione:* chiarire il perimetro di controllo delle esportazioni e di CMMC prima di selezionare o implementare il software di pianificazione [36][49].

## 18. iFAKT e aerospazio

> **Nota: l'autore lavora presso iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), con sede a Stoccarda, Germania, sviluppa il software [Polaris](https://www.m365.fm/entity/polaris/). Secondo il sito web dell'azienda, Polaris collega i dati ERP a un digital twin della produzione per ottimizzare i piani. La piattaforma comprende moduli per la modellazione del flusso del valore e dei processi aziendali, la simulazione, l'ottimizzazione della pianificazione (Optimizer), l'esecuzione in reparto (Operator) e l'analisi (Analyzer) [31]. Il sito elenca l'aerospazio come settore a sé stante e descrive il supporto a fornitori e produttori con processi produttivi complessi [31].

Come riferimento nel settore aerospaziale, iFAKT pubblica un caso di studio con Airbus Netherlands. Dal 2018 lo stabilimento realizza telai di spinta per i moduli propulsivi del lanciatore Ariane 6 (Vulcain Aft Bay e Vinci Thrust Frame). Secondo il caso di studio, i moduli Polaris Optimizer, Operator e Analyzer supportano questa produzione da sette anni. I requisiti dichiarati erano documentazione digitale, assicurazione della qualità in processo, lead time più brevi, schedulazione automatica degli ordini e allocazione ottimizzata delle risorse. Il caso di studio descrive risultati qualitativi come tempi di attesa più brevi grazie a una risposta più rapida alle modifiche non pianificate, tempi di passaggio di consegne più brevi e stato degli ordini disponibile in ogni momento; non fornisce cifre [32]. Il responsabile AIT di Airbus Netherlands è citato affermando che gli strumenti Polaris hanno contribuito a portare più struttura nella produzione [32].

Nella sua home page, iFAKT riporta anche cifre di miglioramento con la qualifica "fino a" (ad esempio per lead time e capacità). Poiché per esse non è stata pubblicata alcuna metodologia, tali cifre non vengono usate qui [31].

**Contesto:** i requisiti descritti in questa guida (schedulazione basata su vincoli, qualifiche, lavorazioni esterne, simulazione di scenari di cadenza, feedback dal reparto) sono indipendenti dal fornitore. Polaris è una delle diverse soluzioni presenti sul mercato. Valutate qualsiasi sistema in base ai criteri della Sezione 11.3 e con un pilota che usi i vostri dati. L'articolo collegato [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) descrive il software più in dettaglio.

## 19. Glossario

**APQP (Advanced Product Quality Planning):** Pianificazione strutturata della qualità per nuovi prodotti e processi; in ambito aerospaziale disciplinata da AS9145 / EN 9145.

**APS (Advanced Planning and Scheduling):** Software di pianificazione che programma la produzione in base alla capacità finita e alla disponibilità dei materiali.

**As-built / as-designed:** La configurazione effettivamente realizzata rispetto alla configurazione specificata dall'ingegneria.

**Bottleneck (constraint):** La risorsa che limita il throughput dell'intero sistema.

**CAMO (Continuing Airworthiness Management Organisation):** Organizzazione approvata EASA che gestisce l'aeronavigabilità continua di un aeromobile (EASA Part-CAMO).

**CMMC (Cybersecurity Maturity Model Certification):** Programma del Dipartimento della Difesa degli Stati Uniti per la verifica della cybersecurity dei fornitori che trattano FCI o CUI; clausola contrattuale DFARS 252.204-7021.

**CUI (Controlled Unclassified Information):** Informazioni governative che richiedono protezione ma non sono classificate; la loro presenza nei sistemi di pianificazione li porta nel perimetro del CMMC.

**Digital thread:** Collegamento continuo di tutti i dati di prodotto lungo il ciclo di vita.

**Drum-buffer-rope (DBR):** Principio di controllo della Teoria dei Vincoli in cui il collo di bottiglia determina il ritmo e limita il rilascio.

**EASA Form 1:** Certificato di rilascio autorizzato per parti aeronautiche emesso da organizzazioni di produzione o manutenzione approvate EASA.

**Effectivity:** Indicazione del numero di serie, dell'aeromobile o della data da cui una configurazione o una modifica si applica.

**Escape:** Parte difettosa che ha raggiunto il cliente.

**FAA Form 8130-3:** Certificato di rilascio autorizzato FAA (Airworthiness Approval Tag) per l'approvazione di aeronavigabilità nazionale, il ritorno in servizio e l'esportazione; emesso solo da persone e organizzazioni autorizzate FAA.

**FAI (First Article Inspection):** Ispezione completa di un primo pezzo di produzione rispetto a tutte le caratteristiche di progetto secondo AS9102 / EN 9102.

**Genealogy:** Relazioni padre-figlio tra materiale, lotti, parti e assiemi.

**HMLV (high mix, low volume):** Produzione di molte varianti in piccole quantità.

**Key characteristic:** Caratteristica la cui variazione influisce in modo significativo su montaggio, funzione, prestazioni o vita utile; disciplinata da AS9103 / EN 9103.

**Learning curve:** Relazione tra quantità cumulata e impegno per unità; dal nome di Wright (1936).

**LLP (life-limited part):** Parte con un numero massimo approvato di cicli o ore.

**MRO (maintenance, repair and overhaul):** Servizi di manutenzione, riparazione e revisione di aeromobili e componenti.

**Nadcap:** Programma di accreditamento gestito dall'industria per i processi speciali, amministrato dal Performance Review Institute (PRI).

**OTD (on-time delivery):** Quota di consegne effettuate alla data concordata.

**Part 145:** Negli Stati Uniti, il certificato di stazione di riparazione FAA (14 CFR Part 145); nell'UE, l'approvazione dell'organizzazione di manutenzione EASA.

**Part 21 Subpart G:** Negli Stati Uniti, il certificato di produzione FAA (14 CFR 21.131 - 21.150); nell'UE, l'approvazione dell'organizzazione di produzione EASA (POA).

**PMA (Parts Manufacturer Approval):** Approvazione di produzione FAA per parti di ricambio e di modifica (14 CFR Part 21, Subpart K).

**PPAP (Production Part Approval Process):** Procedura di approvazione dei pezzi di produzione; in ambito aerospaziale parte di AS9145 / EN 9145.

**Rate:** Quantità prodotta al mese, ad esempio rate 75 = 75 aeromobili al mese.

**Repair station:** Organizzazione di manutenzione certificata dalla FAA ai sensi del 14 CFR Part 145.

**Special process:** Processo il cui risultato non può essere pienamente verificato sul pezzo finito senza distruggerlo, come il trattamento termico o il trattamento superficiale.

**TAT (turnaround time):** Tempo dall'apertura di un ordine di manutenzione fino al rientro del velivolo o del componente al cliente.

**Tier 1 / Tier 2:** Livelli della filiera di fornitura; il Tier 1 fornisce direttamente il costruttore di aeromobili, il Tier 2 fornisce il Tier 1.

**WIP (work in process):** Scorte in lavorazione sul reparto produttivo.

## 20. FAQ: domande frequenti sulla pianificazione della produzione aerospaziale

**Che cos'è la pianificazione della produzione aerospaziale?**
È la pianificazione di quantità, date, capacità e materiali per la produzione di velivoli, motori e componenti, nel rispetto dei requisiti di evidenza del settore. Combina produzione ad alta varietà e basso volume, tempi di approvvigionamento lunghi e processi speciali esternalizzati con una rigorosa tracciabilità e un controllo della configurazione. I ritmi di produzione dei costruttori di aeromobili determinano il passo di tutti i livelli della supply chain.

**Perché la schedulazione con ERP non basta per l'aerospazio?**
La logica MRP classica calcola con tempi di approvvigionamento fissi e senza limiti di capacità. Un piano di produzione realizzabile deve tenere conto della capacità finita, delle qualifiche di persone e macchine e dei posti disponibili presso i fornitori di lavorazioni esterne. Lo fanno i sistemi APS oppure uno strato di schedulazione di dettaglio esteso.

**Quale ritmo di produzione pianifica Airbus per la famiglia A320?**
Secondo il suo rapporto sui primi nove mesi del 2026, Airbus punta a 70-75 aeromobili al mese entro la fine del 2027, per poi stabilizzarsi al rateo 75 [3]. L'obiettivo è slittato più volte, in parte per la mancanza di motori [4].

**Qual è il ritmo di produzione del 737 di Boeing?**
Nel maggio 2026 l'amministratore delegato di Boeing ha dichiarato che la linea del 737 operava al rateo 47 [8]. Il comunicato del terzo trimestre 2026 di Boeing descrive il programma in avanzamento verso una produzione stabilizzata di 47 al mese [47]. La FAA aveva limitato il ritmo a 38 dopo il gennaio 2024 e ne ha approvato 42 nell'ottobre 2025 [7].

**Quali standard deve conoscere un fornitore aerospaziale?**
Il nucleo è AS9100D (EN 9100:2018). A seconda del lavoro, si aggiungono AS9102 (ispezione del primo articolo), AS9103 (caratteristiche chiave), AS9145 (APQP/PPAP), AS9120 (distributori) e spesso l'accreditamento Nadcap per i processi speciali. I titolari di approvazione di produzione operano secondo la FAA 14 CFR Part 21 (o EASA Part 21 Subpart G); i fornitori della difesa devono rispettare anche ITAR/EAR, DFARS e CMMC.

**Qual è la differenza tra AS9100 ed EN 9100?**
Nessuna nel contenuto. Lo standard IAQG è pubblicato come AS9100 da SAE International nelle Americhe, come EN 9100 in Europa e come JISQ 9100 in Asia [13][14].

**AS9100D è ancora valido?**
Sì. Lo IAQG sta lavorando a una revisione che sarà pubblicata come IA9100. Alla data di ottobre 2026 la data di pubblicazione e il periodo di transizione non erano stati confermati, e i certificati AS9100D restano validi [15].

**Che cosa richiede AS9100 in termini di tracciabilità?**
Richiede la tracciabilità delle materie prime, dei materiali e dei processi utilizzati, nonché degli utensili e del personale [14]. I clienti aggiungono requisiti specifici nei loro requisiti di qualità del fornitore, e i titolari di approvazione di produzione FAA trasferiscono a valle i propri requisiti del sistema di qualità [41].

**Quando è richiesta un'ispezione del primo articolo (AS9102)?**
Per parti nuove e per modifiche che possono influire su forma, adattamento o funzione, ad esempio a progetto, materiale, fonte di produzione, processo, attrezzatura o ubicazione, e dopo un'interruzione della produzione superiore a due anni. A seconda dell'ambito, è richiesta una FAI completa o parziale [34].

**Che cos'è la curva di apprendimento nella produzione di aeromobili e perché è importante per la pianificazione?**
La curva di apprendimento descrive come lo sforzo per unità diminuisce al crescere della quantità cumulata. Wright ha mostrato una riduzione di circa il 20% per ogni raddoppio nel 1936 [25]. Se pianifichi un lancio con tempi del rateo maturo, sottostimi significativamente la capacità richiesta (esempio svolto nella Sezione 9).

**Come pianifico correttamente la rampa di un ritmo produttivo?**
Valuta ogni risorsa singolarmente, in particolare il collo di bottiglia, invece dell'utilizzo medio. Calcola diversi scenari di rateo, tieni conto delle curve di apprendimento, della capacità di ispezione, dei tempi di qualifica e delle approvazioni, e assicura per contratto la capacità esterna. La checklist nella Sezione 10.3 aiuta.

**Che cos'è Nadcap?**
Nadcap è un programma di accreditamento gestito dall'industria per processi speciali come trattamenti termici, trattamenti chimici, saldatura e controlli non distruttivi, fondato nel 1990 e amministrato dal Performance Review Institute [21][54]. Molti clienti richiedono l'accreditamento Nadcap per i processi speciali.

**L'APS può gestire lavorazioni esterne come i trattamenti termici?**
Sì, se vengono modellate come risorse con capacità e slot anziché come un semplice tempo di approvvigionamento fisso. Concorda con il fornitore slot settimanali, memorizzali come vincolo e rendi il certificato restituito una condizione per l'operazione successiva (Sezione 7.2).

**Il CMMC si applica ai fornitori del settore aerospaziale?**
Si applica ai contraenti e subappaltatori della difesa i cui contratti riguardano informazioni federali di contratto (FCI) o informazioni non classificate controllate (CUI). La clausola DFARS è entrata in vigore il 10 novembre 2025 e viene introdotta gradualmente nell'arco di tre anni; si trasmette ai subappalti che coinvolgono FCI o CUI [49].

**In cosa la pianificazione MRO differisce dalla pianificazione della produzione?**
In manutenzione, l'ambito del lavoro è noto solo dopo l'ispezione. La pianificazione deve lavorare con le probabilità di rilevamento di difetti, la disponibilità dei ricambi e i buffer. Il KPI centrale è il tempo di turnaround.

**Come può una stazione di riparazione ridurre il tempo di turnaround?**
Ispezionando in anticipo, tenendo a magazzino i ricambi critici o fornendoli tramite pool di scambio, riservando capacità per i lavori non di routine e accelerando le approvazioni del cliente. Gli impegni sul TAT dovrebbero basarsi su percentili anziché su medie.

**Quali KPI sono più importanti per i fornitori del settore aerospaziale?**
Consegna puntuale (OTD), lead time, lavoro in corso (WIP), utilizzo dei colli di bottiglia, fughe di difetti e resa al primo passaggio (FPY). In manutenzione si aggiungono il tempo di turnaround e il tasso di rilevamento (finding rate).

**Che cosa porta un digital twin alla produzione aerospaziale?**
Consente di simulare scenari di cadenza e investimenti, una riprogrammazione più rapida durante le interruzioni e, insieme al digital thread, risposte rapide alle domande sulla tracciabilità. Il presupposto sono dati anagrafici puliti e dati di conferma affidabili.

**Dove si trovano i rischi maggiori della catena di fornitura nel 2026?**
Secondo Roland Berger, nella manodopera qualificata, nelle materie prime come titanio, fusioni e forgiati, nei fissaggi e nei servizi di collaudo e trattamento superficiale [10]. Per i motori, la carenza di forniture sta limitando le cadenze produttive dei costruttori di aeromobili [4].

## 21. Conclusione

Nel 2026 l'industria aerospaziale ha portafogli ordini pieni, ma una catena di fornitura che riesce a smaltirli solo lentamente. Per i fornitori e le officine di manutenzione, la pianificazione della produzione è diventata un fattore competitivo. Chi conosce i propri colli di bottiglia, pianifica in modo realistico le curve di apprendimento e i processi speciali, costruisce la tracciabilità nel flusso degli ordini e calcola in anticipo gli scenari di cadenza può affrontare le fasi di rampa senza sacrificare la consegna puntuale e la qualità.

Il percorso non inizia quasi mai dal software. Inizia dalla misurazione, da dati anagrafici puliti e da regole di controllo semplici, come un WIP limitato e il rilascio basato sul collo di bottiglia. APS, simulazione e digital twin rafforzano queste basi; non le sostituiscono. I meccanismi sono noti e documentati da decenni, dalla curva di apprendimento di Wright alla Legge di Little fino alla Teoria dei Vincoli. Il vero compito è applicarli con coerenza.

## Ulteriori letture su m365.fm

**Post e podcast**

- [Pianificazione della produzione aerospaziale: lead time e tracciabilità](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)
- Episodio del podcast [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/)

**Pagine delle entità**

[Lead Time](https://www.m365.fm/entity/lead-time/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Constraint-based Scheduling](https://www.m365.fm/entity/constraint-based-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) · [iFAKT](https://www.m365.fm/entity/ifakt/) · [Polaris](https://www.m365.fm/entity/polaris/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Guide correlate**

- [Pianificazione della produzione e APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Digital twin nella manifattura](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Manufacturing IT con Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPI di produzione](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Shop floor management](https://www.m365.fm/en/learn/shop-floor-management/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** è il conduttore di m365.fm e lavora presso iFAKT GmbH. Su m365.fm scrive di pianificazione della produzione, tracciabilità, simulazione e digitalizzazione della manifattura. Si concentra su come la pianificazione basata sui vincoli, i gemelli digitali e il feedback dal reparto produttivo lavorano insieme, affinché i piani reggano in officina, anche in settori esigenti come l'aerospaziale.

**Nota: l'autore lavora presso iFAKT GmbH.**

# Sources

All online sources accessed on November 20, 2026. Sources 41 to 55 were added for the US version and verified online on that date.

1. BDLI (German Aerospace Industries Association): BDLI Industry Data 2026: Aerospace Industry Sets New Records for Revenue and Employment. Press release, Berlin, May 27, 2026. https://www.bdli.de/en/meldungen/bdli-branchendaten-2026-luft-und-raumfahrtindustrie-erreicht-neue-rekorde-bei-umsatz-und
2. Nasdaq/RTTNews: Airbus Delivers 793 Aircraft In 2025 As Order Backlog Reaches Record Level. January 2026. https://www.nasdaq.com/articles/airbus-delivers-793-aircraft-2025-order-backlog-reaches-record-level
3. Airbus: Airbus reports Nine-Month (9m) 2026 results. Press release, October 28, 2026. https://www.airbus.com/en/newsroom/press-releases/2026-10-airbus-reports-nine-month-9m-2026-results
4. Aerospace Global News: Airbus accuses Pratt & Whitney of failing to deliver as A320 ramp up stalls. April 15, 2026. https://aerospaceglobalnews.com/news/airbus-pratt-whitney-a320-ramp-up/
5. Terminair: Airbus delivers 74 aircraft in October, needs 249 more by year-end for its 870 target. November 5, 2026. https://terminair.com/story/113485-airbus-delivers-74-aircraft-in-october-needs-249
6. Boeing: Boeing Reports Fourth-Quarter Results. Press release, January 27, 2026. https://boeing.mediaroom.com/2026-01-27-Boeing-Reports-Fourth-Quarter-Results
7. Assembly Magazine: Boeing Cleared to Boost Production of 737 MAX. October 22, 2025. https://www.assemblymag.com/articles/99622-boeing-cleared-to-boost-production-of-737-max
8. CAPA Centre for Aviation: Boeing testing production rate of 47 aircraft per month, cautious of increasing to 52: CEO. May 28, 2026. https://centreforaviation.com/news/boeing-testing-production-rate-of-47-aircraft-per-month-cautious-of-increasing-to-52-ceo-1360867
9. ADS Group (summary of the IATA release): Supply chain challenges could cost airlines over $11bn in 2025. October 14, 2025; study "Reviving the Commercial Aircraft Supply Chain" by IATA and Oliver Wyman. https://www.adsgroup.org.uk/knowledge/industry-member-news/supply-chain-challenges-could-cost-airlines-over-11bn-in-2025/
10. Roland Berger: Global Aerospace Supply Chain Study 2026. June 2026 (survey of 95 companies, January/February 2026). https://mailing.rolandberger.com/hubfs/07_presse/Aerospace%20Supply%20Chain%20Study%202026%20Roland%20Berger.pdf
11. CNBC: RTX to take $3 billion charge on Pratt & Whitney engine problem. September 11, 2023. https://www.cnbc.com/2023/09/11/rtx-to-take-3-billion-charge-on-pratt-whitney-engine-problem.html
12. Malay Mail (Reuters): Boeing suspends Russian titanium as Airbus keeps buying. March 8, 2022. https://www.malaymail.com/news/money---international/2022/03/08/boeing-suspends-russian-titanium-as-airbus-keeps-buying/2046061
13. IAQG: Standards (overview of the 9100 family). https://ma.iaqg.org/standards
14. TÜV Rheinland: FAQ EN/AS 9100ff. series of standards (German). https://certification.tuv.com/content-media-files/master-content/services/systems/0403-tuv-rheinland-en-as-9100ff-series-of-standards/tuv-rheinland-en-as-9100-faq-de.pdf
15. The QMS Collective: The Current AS9100 Revision, and How to Read Dates That Keep Slipping. October 16, 2026. https://theqmscollective.com/blog/current-as9100-revision-confirmed-vs-expected-ia9100
16. Estonian Centre for Standardisation (EVS): EVS-EN 9145:2018 Aerospace series – Requirements for Advanced Product Quality Planning and Production Part Approval Process. https://www.evs.ee/en/evs-en-9145-2018
17. DIN Media: DIN EN 9102:2025-01, Aerospace series – Quality management systems – First article inspection requirement (EN 9102:2024). https://www.dinmedia.de/en/standard/din-en-9102/377807227
18. Net-Inspect: AS9102 First Article Inspection Report Rev B vs Rev C. https://www.net-inspect.com/blog/as9102-rev-b-vs-rev-c/
19. IAQG: 9103 Variation Management of Key Characteristics. https://iaqg.org/standard/9103-variation-management-of-key-characteristics/ ; EVS-EN 9103:2023: https://www.evs.ee/en/evs-en-9103-2023
20. EVS: EVS-EN 9110:2018 Quality Management Systems – Requirements for Aviation Maintenance Organizations. https://www.evs.ee/en/evs-en-9110-2018
21. Wikipedia: Nadcap. https://en.wikipedia.org/wiki/Nadcap
22. EASA: Easy Access Rules for Initial Airworthiness and Environmental Protection (Part 21), 21.A.131 Scope (Subpart G). https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-initial-airworthiness-and?page=13
23. EASA: Easy Access Rules for Continuing Airworthiness (Regulation (EU) No 1321/2014 with Part-M, Part-145, Part-CAMO; amending Regulation (EU) 2019/1383). https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-continuing-airworthiness?page=66
24. Wright, T. P.: Factors Affecting the Cost of Airplanes. Journal of the Aeronautical Sciences, vol. 3, no. 4 (1936), pp. 122–128. Reference: https://en.wikipedia.org/wiki/Theodore_Paul_Wright
25. Wikipedia: Experience curve effect. https://en.wikipedia.org/wiki/Experience_curve_effect
26. U.S. Government Accountability Office (GAO): Cost Estimating and Assessment Guide, Cumulative Average Formulation. https://gaoinnovations.gov/cost-guide/cumulative-average-formulation.html
27. Little, John D. C.: A Proof for the Queuing Formula L = λW. Operations Research, vol. 9, no. 3 (1961), pp. 383–387.
28. Goldratt, Eliyahu M.; Cox, Jeff: The Goal. A Process of Ongoing Improvement. North River Press, 1984.
29. Oliver Wyman: Why engine availability is a growing challenge for aviation. September 24, 2026. https://www.oliverwyman.com/our-expertise/insights/2026/sep/aviation-engine-availaibility-bottlenecks.html
30. Oliver Wyman / ARSA: Global Fleet & MRO Market Forecast 2026–2036, Executive Summary. 2026. https://arsa.org/wp-content/uploads/2026/03/ARSA-OW-2026FleetMROMarketReport-ExecSum-2026.pdf
31. iFAKT GmbH: website (home page, solutions, contact, imprint). https://www.ifakt.de/
32. iFAKT GmbH: Customer Reference Airbus Netherlands. https://www.ifakt.de/references/Airbus_Netherlands_Reference.pdf
33. 4flow: Advanced planning in multi-level production networks in aviation and aerospace. https://4flow.com/blog/advanced-planning-in-multi-level-production-networks-in-aviation-and-aerospace
34. InspectionXpert: When to Conduct a First Article Inspection. https://www.inspectionxpert.com/blog/when-to-conduct-a-first-article-inspection
35. IAQG: 9145 Guidance Presentation (APQP phases, PPAP elements). https://ma.iaqg.org/wp-content/uploads/2019/10/9145-Guidance-Presentation.pdf
36. Electronic Code of Federal Regulations: International Traffic in Arms Regulations, 22 CFR Parts 120–130 (https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M); Export Administration Regulations, 15 CFR Parts 730–774 (https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C).
37. Produktion (German trade journal): Nachweispflicht als Nadelöhr: Warum die Rückverfolgbarkeit über Millionenaufträge in der Verteidigungsindustrie entscheidet ("Evidence requirements as a bottleneck: why traceability decides multi-million defense contracts"). October 27, 2026. https://www.produktion.de/ruestung-aerospace/nachweispflicht-als-nadeloehr-warum-die-rueckverfolgbarkeit-ueber-millionenauftraege-in-der-verteidigungsindustrie-entscheidet/2758489
38. Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society, vol. 57, no. 4 (1961), pp. 902–904.
39. Defence Agenda: Airbus Keeps Production Ramp-Up Targets Unchanged. August 1, 2026. https://defenceagenda.com/airbus-production-ramp-up-targets-h1-2026
40. Martin, James R.: Learning Curve Summary (cumulative average model after Wright, incremental unit model after Crawford). Management And Accounting Web. https://maaw.info/LearningCurveSummary.htm
41. 14 CFR 21.137 Quality system (production certificates), 14 CFR 21.307 Quality system (PMA), and table of subparts of 14 CFR Part 21. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/14/21.137 ; https://www.law.cornell.edu/cfr/text/14/21.307 ; https://www.law.cornell.edu/cfr/text/14/part-21 (official text: https://www.ecfr.gov/current/title-14/chapter-I/subchapter-C/part-21/subpart-G)
42. Electronic Code of Federal Regulations: 14 CFR Part 145 Repair Stations (145.1, 145.59, 145.109, 145.163, 145.201, 145.219). https://www.ecfr.gov/current/title-14/chapter-I/subchapter-H/part-145
43. FAA: Order 8130.21H, Procedures for Completion and Use of the Authorized Release Certificate, FAA Form 8130-3, Airworthiness Approval Tag. Effective February 1, 2014. https://www.faa.gov/documentLibrary/media/Order/FAA_Order_8130.21H.pdf
44. SAE International: AS9100D Quality Management Systems – Requirements for Aviation, Space, and Defense Organizations (revised September 20, 2016). https://saemobilus.sae.org/standards/as9100d-quality-management-systems-requirements-aviation-space-defense-organizations
45. SAE International: AS9145 Aerospace Series – Requirements for Advanced Product Quality Planning and Production Part Approval Process (issued November 8, 2016). https://saemobilus.sae.org/standards/as9145-aerospace-series-requirements-advanced-product-quality-planning-production-part-approval-process
46. ANSI Webstore: SAE AS9102C-2023, Aerospace Series – First Article Inspection Requirements. https://webstore.ansi.org/standards/sae/sae9102c2023
47. Boeing: Boeing Reports Third-Quarter Results. Press release, Arlington, Va., October 27, 2026. https://boeing.mediaroom.com/2026-10-27-Boeing-Reports-Third-Quarter-Results
48. Aerospace Industries Association (AIA): 2026 AIA Facts & Figures: U.S. Aerospace & Defense Industry Leads the World with $1 Trillion in Sales. June 25, 2026 (with S&P Global Market Intelligence, 2025 data). https://www.aia-aerospace.org/?p=27492 ; overview: https://aia-aerospace.org/industry-impact
49. Federal Register, vol. 90, no. 173 (September 10, 2025): Defense Federal Acquisition Regulation Supplement: Assessing Contractor Implementation of Cybersecurity Requirements (DFARS Case 2019-D041), effective November 10, 2025. https://www.govinfo.gov/content/pkg/FR-2025-09-10/html/2025-17359.htm
50. U.S. Department of Defense, Office of Small Business Programs: Cybersecurity Maturity Model Certification (CMMC) 2.0. https://business.defense.gov/Programs/Cyber-Security-Resources/CMMC-20
51. 48 CFR 252.225-7009 Restriction on Acquisition of Certain Articles Containing Specialty Metals. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/48/252.225-7009
52. FAA: Advisory Circular AC 21-29D, Detecting and Reporting Suspected Unapproved Parts. July 12, 2016. https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_21-29D.pdf
53. 14 CFR 91.417 Maintenance records. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/14/91.417
54. Boeing Suppliers: Nadcap Accreditation FAQ (Nadcap as an "industry-managed approach to conformity assessment of 'special processes'", administered by PRI). https://www.boeingsuppliers.com/nadcap/nadcap_faq.htm
55. Aerospace Manufacturing (aero-mag.com): Lack of capacity planning adding to ramp-up challenge, report reveals (Vendigital rate readiness assessment, 100+ suppliers). Undated. https://www.aero-mag.com/lack-of-capacity-planning-adding-to-ramp-up-challenge-report-reveals
