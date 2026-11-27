# SEO metadata

| Field | Value |
|---|---|
| Meta title | Guida a S&OP, MPS e MRP: pianificazione vendite e operazioni |
| Meta description | S&OP, MPS e MRP spiegati: il ciclo mensile di S&OP, il calcolo MRP passo per passo, DDMRP, opzioni ERP, KPI e modelli pratici. |
| Slug | `sop-mrp-production-planning` |

# Pianificazione delle vendite e delle operazioni (S&OP) e MRP: come funziona la pianificazione della produzione dal piano ai componenti

> **Risposta breve:** La pianificazione delle vendite e delle operazioni (S&OP) è un processo di gestione mensile in cui vendite, operations, supply chain e finanza concordano un unico piano per domanda, approvvigionamento e scorte per famiglia di prodotti, tipicamente su un orizzonte mobile di 18-36 mesi [5][6]; le fonti accademiche descrivono il suo nucleo tattico come arrivante fino a circa 18 mesi [1]. Il piano principale di produzione (MPS) traduce quel piano in quantità di prodotti finiti per settimana, e la pianificazione dei fabbisogni di materiali (MRP) scompone l'MPS attraverso le distinte base in ordini datati per ogni componente e materia prima [7][13]. Nella maggior parte degli stabilimenti MPS e MRP girano all'interno del sistema ERP; l'S&OP si svolge in un ciclo di riunioni supportato da fogli di calcolo, ERP o software di pianificazione dedicato.

> **Punti chiave**
> - L'S&OP decide *quanto* per famiglia di prodotti e per mese; l'MPS decide *quali prodotti finiti* per settimana; l'MRP decide *quali componenti, quanti e quando*. Lo scheduling di dettaglio (sequenza per macchina e ora) si colloca a un livello inferiore ed è trattato nella [guida allo scheduling della produzione e all'APS](https://www.m365.fm/en/learn/production-scheduling-aps/).
> - Il concetto di S&OP risale alla pianificazione aggregata della produzione degli anni Cinquanta; i consulenti di Oliver Wight hanno plasmato l'S&OP moderno negli anni Ottanta e hanno coniato l'espressione integrated business planning (IBP) all'inizio degli anni Duemila [1][2].
> - Joseph Orlicky ha formalizzato l'MRP nel 1964; Black & Decker è stata la prima azienda a utilizzarlo e, nel 1981, circa 8.000 aziende usavano l'MRP [3][4]. Oliver Wight ha esteso il modello a MRP II nel 1983 [3].
> - Un tipico ciclo mensile di S&OP prevede cinque fasi: raccolta dei dati, revisione della domanda, revisione dell'offerta, riunione di pre-S&OP (riconciliazione) e riunione esecutiva di S&OP [1].
> - L'MRP presuppone capacità infinita e lead time fissi; per questo richiede un controllo di capacità grossolano a monte e uno scheduler a capacità finita a valle [8][9].
> - Una piccola modifica nell'MPS può spostare contemporaneamente ordini su più livelli di distinta base ("nervosismo"). Il congelamento dell'orizzonte a breve termine e le regole sui costi di modifica lo attenuano meglio di scorte di sicurezza aggiuntive [10].
> - Il DDMRP sostituisce l'esplosione guidata dalle previsioni, in alcuni punti di disaccoppiamento selezionati, con buffer dimensionati (rosso, giallo, verde) e un'equazione del flusso netto [11][12].
> - Misurate l'S&OP con l'accuratezza della previsione (WMAPE) *e* con il bias, il raggiungimento del piano, la stabilità del programma e il livello di servizio. Una previsione accurata al 94% ma sempre superiore del 2% continua a generare scorte.

## Indice

1. [Che cos'è la pianificazione vendite e operations (S&OP)? Definizione e ambito](#che-cosè-la-pianificazione-vendite-e-operations-definizione-e-ambito)
2. [La gerarchia della pianificazione della produzione: S&OP, MPS, RCCP, MRP e scheduling](#la-gerarchia-della-pianificazione-di-produzione-sop-mps-rccp-mrp-e-scheduling)
3. [Storia: dalla pianificazione aggregata di Orlicky a IBP e DDMRP](#storia-dalla-pianificazione-aggregata-e-orlicky-a-ibp-e-ddmrp)
4. [Il processo S&OP: il ciclo mensile passo dopo passo](#il-processo-sop-il-ciclo-mensile-passo-dopo-passo)
5. [Strategie di approvvigionamento: livellamento, inseguimento o ibrida (esempio svolto)](#strategie-di-approvvigionamento-livellata-inseguimento-o-ibrida-esempio-svolto)
6. [S&OP vs. IBP vs. S&OE](#sop-vs-ibp-vs-soe)
7. [Modelli di maturità S&OP](#modelli-di-maturità-sop)
8. [Master production schedule (MPS) e available to promise (ATP)](#piano-principale-di-produzione-mps-e-disponibile-al-promettere-atp)
9. [Rough-cut capacity planning (RCCP)](#pianificazione-approssimata-della-capacità-rccp)
10. [Material requirements planning (MRP): come funziona il calcolo](#pianificazione-dei-fabbisogni-di-materiali-mrp-come-funziona-il-calcolo)
11. [MRP II, CRP e il ciclo chiuso](#mrp-ii-crp-e-il-ciclo-chiuso)
12. [Nervosismo dell'MRP: perché i piani oscillano e come stabilizzarli](#nervosità-del-mrp-perché-i-piani-sobbalzano-e-come-calmarli)
13. [Demand driven MRP (DDMRP)](#demand-driven-mrp-ddmrp)
14. [Pianificazione della produzione in ERP: cosa fanno i sistemi e dove si fermano](#pianificazione-della-produzione-in-erp-cosa-fanno-i-sistemi-e-dove-si-fermano)
15. [Modelli: calendario S&OP, agende, piano per famiglia, registrazioni MPS e MRP](#modelli-calendario-sop-ordini-del-giorno-piano-di-famiglia-record-mps-e-mrp)
16. [KPI di S&OP e MRP con esempi svolti](#kpi-di-sop-e-mrp-con-esempi-svolti)
17. [Roadmap di implementazione: 12 mesi per un S&OP e un MRP funzionanti](#roadmap-di-implementazione-12-mesi-per-un-sop-e-un-mrp-funzionanti)
18. [Errori comuni](#errori-comuni)
19. [Limiti di S&OP e MRP](#limiti-di-sop-e-mrp)
20. [IA e pianificazione digitale: cosa funziona oggi](#ia-e-pianificazione-digitale-cosa-funziona-oggi)
21. [Glossario](#glossario)
22. [FAQ: pianificazione vendite e operations e MRP](#faq-pianificazione-delle-vendite-e-delle-operazioni-sop-e-mrp)
23. [Conclusioni e primi passi](#conclusione-e-primi-passi)

## Che cos'è la pianificazione vendite e operations? Definizione e ambito

**La pianificazione vendite e operations (S&OP, Sales and Operations Planning)** è un processo decisionale ricorrente che integra la previsione della domanda con la pianificazione dell'offerta in un unico piano a cui lavorano vendite, marketing, operations, supply chain e finanza [1]. La letteratura accademica la descrive come un processo tattico con un orizzonte fino a circa 18 mesi, solitamente eseguito su base mensile o attivato da eventi [1]. Le fonti di fornitori e professionisti descrivono spesso un orizzonte mobile di 18-36 mesi [5][6]. La differenza non è una contraddizione: i primi mesi sono pianificati nel dettaglio, quelli successivi solo per famiglie e blocchi di capacità.

Tre caratteristiche distinguono l'S&OP da una riunione sulle previsioni di vendita o da una riunione di produzione:

- **Un solo insieme di numeri.** Domanda, offerta, scorte o arretrato e il valore finanziario del piano vengono esaminati insieme, per famiglia di prodotti, in unità e in dollari.
- **Decisioni, non report.** L'output è un insieme di decisioni: approvare un aumento di capacità, accettare un livello di servizio più basso per una famiglia lenta, rinviare un lancio, produrre in anticipo in vista di un fermo.
- **Integrazione invece di coordinamento.** Rogelio Oliva e Noel Watson hanno mostrato in un caso di studio che l'S&OP genera valore quando le funzioni pianificano *insieme rispetto a obiettivi condivisi*, e non quando si limitano a coordinare piani che ciascuna funzione ha realizzato da sola [21].

Il riferimento professionale per S&OP, programmazione master e MRP negli Stati Uniti è mantenuto da ASCM (Association for Supply Chain Management, già APICS). Il suo programma CPIM (Certified in Planning and Inventory Management) copre S&OP, domanda, offerta, scorte e programmi dettagliati come moduli separati [24].

### Pianificazione, non scheduling

L'S&OP non è il programma di produzione. Lavora con famiglie di prodotti, periodi mensili e capacità aggregate, come "ore di saldatura" o "turni della linea 2". La domanda "quale ordine gira per primo domani sulla macchina 14" appartiene allo scheduling dettagliato, che la [guida allo scheduling della produzione e APS](https://www.m365.fm/en/learn/production-scheduling-aps/) tratta in profondità, incluso lo scheduling a capacità finita e il drum-buffer-rope. Questo articolo resta un livello più in alto e collega l'S&OP al master production schedule e all'MRP.

### A cosa serve l'S&OP

La tabella mostra decisioni tipiche che solo un S&OP interfunzionale può prendere, perché nessuna singola funzione controlla sia il costo sia il beneficio.

| Decisione | Chi guadagna | Chi paga | Perché richiede l'S&OP |
|---|---|---|---|
| Aggiungere un secondo turno in saldatura da marzo | Vendite (livello di servizio) | Operations (costo del lavoro), HR (assunzioni) | compromesso tra ricavi e costi |
| Produrre in anticipo 2.000 unità prima della chiusura estiva | Clienti, vendite | Finanza (capitale circolante), magazzino | l'investimento in scorte deve essere approvato |
| Eliminare una variante a basso margine | Operations (meno cambi di produzione) | Vendite (ricavi persi) | decisione di portafoglio con impatto sul margine |
| Accettare un grande ordine promozionale | Vendite, marketing | Operations (straordinari), acquisti | fattibilità di capacità e materiali |
| Qualificare un secondo fornitore per un componente critico | Supply chain (rischio) | Acquisti, qualità (costo della qualifica) | resilienza rispetto al costo unitario, vedi [supply chain resilience](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/) |

### Chi partecipa

La riunione esecutiva è presieduta dal direttore generale o dal presidente della business unit. I membri permanenti tipici sono i responsabili di vendite, marketing, operations, supply chain, finanza e, nei prodotti ingegnerizzati, ingegneria o product management. Sotto la riunione esecutiva, il demand planner, il master scheduler, il supply planner e un analista finanziario svolgono gran parte del lavoro. La sezione 4 elenca i ruoli passo dopo passo.

## La gerarchia della pianificazione di produzione: S&OP, MPS, RCCP, MRP e scheduling

La pianificazione e il controllo della produzione (MPC) sono organizzati come una gerarchia. Ogni livello lavora con un orizzonte più lungo e dati più aggregati rispetto al livello sottostante e trasmette le proprie decisioni come obiettivi. Il materiale del corso MIT di Stanley Gershwin riassume così l'MRP II: una gerarchia di pianificazione a lungo, medio e breve termine, con gestione della domanda, previsione, pianificazione della capacità e controllo del reparto produttivo intorno al nucleo MRP [8].

| Livello | Orizzonte tipico | Periodo | Oggetto della pianificazione | Domanda chiave | Output | Strumento tipico |
|---|---|---|---|---|---|---|
| Piano strategico e di business | 3–5 anni | anno | business, stabilimento, rete | Quali mercati, stabilimenti e investimenti in capacità? | budget, piano capex | strumenti finanziari, Excel |
| S&OP / IBP | 18–36 mesi [5][6] | mese | famiglia di prodotti, risorsa aggregata | Quanto vendiamo e produciamo, con quali scorte e costi? | piano di famiglia approvato | software S&OP, ERP, Excel |
| Master production schedule (MPS) | da poche settimane a diversi mesi, almeno il lead time cumulato | settimana (giorno nel breve termine) | prodotto finito o articolo di pianificazione | Quali prodotti finiti, quanti, in quale settimana? | MPS, ATP | ERP |
| Rough-cut capacity planning (RCCP) | come per l'MPS | settimana o mese | risorse critiche | L'MPS è fattibile al collo di bottiglia? | carico vs. capacità per risorsa chiave | ERP, Excel |
| Material requirements planning (MRP) | come per l'MPS | giorno o settimana | ogni componente e materiale | Quali parti, quante, quando ordinare o avviare? | ordini pianificati, richieste d'acquisto, messaggi di eccezione | ERP |
| Capacity requirements planning (CRP) | settimane | giorno o settimana | ogni centro di lavoro | C'è capacità sufficiente per tutti gli ordini pianificati e rilasciati? | profili di carico dettagliati | ERP |
| Scheduling dettagliato e dispatching | da ore a poche settimane | ora, turno | operazione su una macchina | In quale sequenza viene eseguita ogni operazione? | schedulazione, lista di dispatch | APS, MES |

Due regole tengono insieme la gerarchia:

1. **La disaggregazione deve tornare.** La somma degli MPS di tutti i prodotti finiti di una famiglia deve corrispondere al piano di famiglia S&OP dello stesso mese, entro una tolleranza concordata (ad esempio più o meno 5%). In caso contrario, la decisione S&OP non ha effetto sul reparto.
2. **La fattibilità viene verificata a ogni livello.** L'S&OP verifica la capacità aggregata (pianificazione delle risorse), l'MPS viene verificato con la rough-cut capacity planning e l'output dell'MRP con la capacity requirements planning o con uno scheduler a capacità finita. L'MRP di per sé non verifica la capacità [8][9].

### Dove si collocano ERP, APS e MES

La norma ANSI/ISA-95 separa la pianificazione aziendale e la logistica (Livello 4, tipicamente ERP) dalla gestione delle operazioni di produzione (Livello 3, tipicamente MES e scheduling dettagliato) [25]. S&OP, MPS e MRP sono funzioni di Livello 4. La [guida su MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) illustra il lato di Livello 3, e la [guida Azure per la manifattura](https://www.m365.fm/en/learn/manufacturing-it-azure/) mostra come i dati tra i livelli possano essere integrati.

### Make-to-stock, assemble-to-order, make-to-order

L'ambiente produttivo decide dove si colloca l'MPS nella distinta base:

| Ambiente | Il cliente attende | MPS pianificato a | Esempio | Focus S&OP |
|---|---|---|---|---|
| Make-to-stock (MTS) | nulla (spedisce da magazzino) | articolo finito | beni di consumo, pompe standard | obiettivo di scorta per famiglia |
| Assemble-to-order (ATO) | assemblaggio finale | moduli e opzioni (distinta di pianificazione) | scrivanie configurabili, camion, PC | mix di moduli, percentuali delle opzioni |
| Make-to-order (MTO) | la produzione | articolo finito o sottoassiemi chiave dopo l'ordine | parti di macchinari su misura | obiettivo di backlog, lead time |
| Engineer-to-order (ETO) | progettazione e produzione | pietre miliari di progetto, articoli a lungo lead time | macchine speciali, interni di aeromobili | capacità di ingegneria e collaudo, vedi [pianificazione della produzione aerospaziale](https://www.m365.fm/en/learn/aerospace-production-planning/) |

In MTS, l'S&OP bilancia la domanda con una scorta obiettivo. In MTO ed ETO, bilancia la domanda con un backlog obiettivo o un lead time quotato. Mescolare queste logiche all'interno di una stessa famiglia è una causa frequente di numeri S&OP confusi.

## Storia: dalla pianificazione aggregata e Orlicky a IBP e DDMRP

### Pianificazione aggregata e primi sistemi MRP (anni '50–'60)

L'S&OP ha avuto origine all'inizio degli anni '50 come pianificazione aggregata della produzione: far corrispondere un tasso di produzione aggregato alla domanda prevista, bilanciando scorte, variazioni della forza lavoro e straordinari [1]. Più o meno nello stesso periodo, i costruttori di motori aeronautici Rolls-Royce e General Electric informatizzarono la pianificazione dei materiali [3].

Nel 1964, Joseph Orlicky, ingegnere di IBM, formalizzò la material requirements planning (MRP) [4]. La prima azienda a implementarla fu Black & Decker nel 1964, con Dick Alban come project leader [3]. Il libro di Orlicky *Material Requirements Planning* (McGraw-Hill, 1975) divenne il testo di riferimento [13]. La sua terza edizione, un aggiornamento del 2011 a cura di Carol Ptak e Chad Smith, introdusse la demand driven MRP (DDMRP) [4].

L'adozione crebbe rapidamente: circa 700 aziende usavano l'MRP nel 1975 e circa 8.000 nel 1981, secondo le cifre citate da Wikipedia [3]. Nel 1967, George Plossl e Oliver Wight, collega IBM di Orlicky, scrissero insieme un libro sul controllo della produzione e delle scorte [4].

### MRP II, ERP e S&OP (anni '80–'90)

Nel 1983, Oliver Wight estese l'MRP a **manufacturing resource planning (MRP II)** aggiungendo la master scheduling, la rough-cut capacity planning, la capacity requirements planning, l'S&OP e il collegamento con la pianificazione finanziaria [3]. La società di Oliver Wight descrive l'S&OP come sviluppato da Oliver Wight negli anni '80 [2]; Wikipedia attribuisce il termine e il suo significato moderno a Richard (Dick) Ling, allora consulente di Oliver Wight [1]. Gartner coniò il termine "enterprise resource planning" (ERP) nel 1990 [4]. Gli ERP integrarono finanza, vendite, acquisti e risorse umane attorno a un nucleo di pianificazione che restava l'MRP II.

### IBP, DDMRP e pianificazione concorrente (anni 2000–oggi)

All'inizio degli anni 2000 Oliver Wight coniò la **integrated business planning (IBP)**, che estende l'S&OP all'intera azienda, includendo la pianificazione di portafoglio e finanziaria, con un orizzonte di almeno 24 mesi [2]. Nel 2011, Ptak e Smith pubblicarono la terza edizione del libro di Orlicky con la **demand driven MRP (DDMRP)** [4], e fornitori di ERP come Microsoft hanno da allora integrato la DDMRP nei loro motori di pianificazione [11]. I fornitori di software di pianificazione promuovono ormai la pianificazione "concorrente" o continua, che ricalcola i piani in minuti anziché in un batch mensile [16]; si tratta di un'affermazione del fornitore, discussa nella sezione sull'IA.

| Anno | Traguardo | Fonte |
|---|---|---|
| inizio anni '50 | pianificazione aggregata della produzione; Rolls-Royce e GE informatizzano la pianificazione dei materiali | [1][3] |
| 1964 | Orlicky formalizza l'MRP in IBM; Black & Decker è il primo utilizzatore | [3][4] |
| 1967 | Plossl e Wight pubblicano sul controllo della produzione e delle scorte | [4] |
| 1975 | *Material Requirements Planning* di Orlicky; circa 700 utilizzatori di MRP | [3][13] |
| 1981 | circa 8.000 utilizzatori di MRP | [3] |
| 1983 | Oliver Wight definisce l'MRP II | [3] |
| anni '80 | S&OP sviluppato da Oliver Wight (Dick Ling) | [1][2] |
| 1990 | Gartner conia il termine "ERP" | [4] |
| inizio anni 2000 | Oliver Wight conia l'IBP | [2] |
| 2011 | terza edizione del libro di Orlicky a cura di Ptak e Smith introduce la DDMRP | [4] |

## Il processo S&OP: il ciclo mensile passo dopo passo

La descrizione accademica più citata del processo S&OP prevede cinque fasi: raccolta dei dati, pianificazione della domanda, pianificazione dell'offerta, pre-riunione e riunione esecutiva [1][20]. Alcuni autori aggiungono una revisione di eventi o prodotti all'inizio e una fase di revisione alla fine [1]; Anaplan, fornitore di software per la pianificazione, descrive sei revisioni: prodotto, domanda, offerta, finanza, pre-S&OP e S&OP esecutivo [15]. Kinaxis descrive un tradizionale ciclo mensile articolato in cinque fasi [16]. Le differenze sono per lo più di etichetta: i cicli coprono gli stessi ambiti e più o meno nello stesso ordine.

Il calendario seguente presuppone che il mese si chiuda nell'ultimo giorno lavorativo e che la riunione esecutiva si svolga nella terza settimana.

| Giorno lavorativo | Fase | Responsabile | Input | Output | Durata della riunione |
|---|---|---|---|---|---|
| 1–3 | 1. Raccolta dei dati e aggiornamento del portafoglio | demand planner, product management | consuntivi del mese precedente (spedizioni, ordini, produzione, scorte), nuove date di lancio e di uscita di prodotti | storico aggiornato, KPI pack, modifiche di prodotto | nessuna (lavoro d'ufficio) |
| 4–6 | 2. Revisione della domanda | VP vendite o marketing; il demand planner prepara | previsione statistica, input commerciali, eventi di marketing, piani dei clienti chiave | piano di domanda consensuale non vincolato per famiglia, in unità e dollari, con ipotesi e rischi | 60–90 minuti |
| 7–9 | 3. Revisione dell'offerta | VP operations o supply chain; master scheduler e supply planner preparano | domanda consensuale, obiettivi di scorta o backlog, capacità per risorsa chiave, vincoli dei fornitori | piano di offerta vincolato, criticità di capacità e opzioni con costi | 60–90 minuti |
| 10–12 | 4. Riunione pre-S&OP (riconciliazione) | responsabile del processo S&OP; analista finanziario | piani di domanda e offerta, gap, piano finanziario | piano riconciliato in unità e dollari, decisioni preparate con opzioni, questioni aperte | 90–120 minuti |
| 13–15 | 5. Riunione esecutiva S&OP | direttore generale | raccomandazioni del pre-S&OP, KPI | piano approvato, decisioni, escalation chiuse | 60–120 minuti |
| 16–20 | Rilascio | master scheduler, planner | piano approvato per famiglia | MPS aggiornato, MRP eseguito, azioni di acquisto e di capacità | nessuna |

### Fase 1: Raccolta dei dati e aggiornamento del portafoglio

Il ciclo inizia non appena il mese si chiude. Il demand planner estrae spedizioni, ordini in entrata, produzione, scorte e backlog per famiglia e SKU, ripulisce lo storico da eventi una tantum (un incendio presso un cliente, una gara occasionale) ed esegue la previsione statistica. Product management aggiorna le date di lancio e di uscita. Una previsione che non sa che una variante sarà dismessa al quarto mese continuerà a ordinarne i componenti.

**Checklist, fase 1**

| Voce | Completata quando |
|---|---|
| Consuntivi caricati | spedizioni, ordini, produzione e scorte riconciliati con la chiusura contabile del mese entro la tolleranza concordata |
| Storico ripulito | outlier segnalati con motivazione, non eliminati |
| Previsione statistica eseguita | modello e parametri documentati per famiglia |
| Modifiche di portafoglio | lanci, uscite di prodotto, modifiche ingegneristiche con date e responsabili |
| KPI pack | accuratezza e bias della previsione, raggiungimento del piano, servizio, scorte rispetto all'obiettivo |

### Fase 2: Revisione della domanda

La revisione della domanda produce il **piano di domanda consensuale non vincolato**: ciò che i clienti vorranno se la capacità di offerta fosse illimitata. Vendite e marketing modificano la previsione statistica con informazioni che lo storico non contiene: variazioni di prezzo, promozioni, un cliente perso, un nuovo distributore. Ogni modifica viene registrata con il suo responsabile e la relativa ipotesi. Questa registrazione mostra in seguito se gli interventi manuali hanno migliorato o peggiorato l'accuratezza.

Gli errori tipici in questa fase sono prevedere solo in ricavi (le operations non possono produrre dollari), prevedere a livello di SKU per 24 mesi (troppo rumore) e confondere l'obiettivo commerciale con la previsione. Un obiettivo è ciò che l'azienda desidera; una previsione è ciò che si aspetta. Lo scarto tra i due è una questione di business per la riunione esecutiva, non un numero da nascondere nella previsione.

**Ordine del giorno della revisione della domanda (60–90 minuti)**

| Tempo | Argomento | Responsabile |
|---|---|---|
| 10 min | mese precedente: accuratezza e bias della previsione per famiglia, principali scostamenti con causa radice | demand planner |
| 20 min | baseline statistica rispetto all'ultimo consenso, variazioni sopra soglia | demand planner |
| 30 min | input di vendite e marketing per famiglia: eventi, clienti, prezzi | vendite, marketing |
| 15 min | rischi e opportunità con probabilità e quantità | VP vendite |
| 5 min | consenso per famiglia, punti aperti, responsabili | demand planner |

### Passo 3: Revisione della fornitura

La revisione della fornitura verifica la domanda di consenso rispetto alla capacità, ai materiali e agli obiettivi di scorta. I pianificatori traducono i volumi per famiglia in carico sulle **risorse chiave** (centri di lavoro collo di bottiglia, fornitori critici, gruppi di manodopera qualificata) usando una distinta delle risorse: ore per unità per risorsa. Quando il carico supera la capacità, sviluppano opzioni con i relativi costi: straordinari, un turno aggiuntivo, esternalizzazione, produzione anticipata, una data di consegna posticipata oppure l'accettazione di un livello di servizio inferiore. La revisione della fornitura non decide tra opzioni con un impatto finanziario significativo; le prepara per la riunione pre-S&OP. La sezione 5 mostra come tali opzioni vengono confrontate.

**Ordine del giorno della revisione della fornitura (60–90 minuti)**

| Orario | Argomento | Responsabile |
|---|---|---|
| 10 min | mese precedente: raggiungimento del piano, aderenza al MPS, prestazioni dei fornitori | master scheduler |
| 25 min | carico vs. capacità per risorsa chiave e per mese (rough-cut) | pianificatore della fornitura |
| 20 min | proiezione di scorte e arretrati vs. obiettivi per famiglia | master scheduler |
| 20 min | vincoli e opzioni con costi e rischi | VP operations |
| 5 min | piano di fornitura vincolato, questioni per il pre-S&OP | master scheduler |

### Passo 4: Riunione pre-S&OP (riconciliazione)

La riunione pre-S&OP riunisce domanda, fornitura e finanza. La finanza valorizza il piano vincolato al costo standard e al prezzo di vendita e lo confronta con il budget o l'ultima previsione finanziaria. Il team risolve ciò che rientra nei diritti decisionali concordati e prepara il resto come documenti decisionali: due o tre opzioni, ciascuna con l'impatto su volumi, servizio, costi e capitale circolante e con una raccomandazione. Un buon documento decisionale sta su una pagina.

### Passo 5: Riunione S&OP esecutiva

La riunione esecutiva esamina i KPI, approva il piano e prende le decisioni preparate. Non è la sede per rielaborare i numeri. Un ordine del giorno tipico:

| Orario | Argomento |
|---|---|
| 10 min | revisione dei KPI: servizio, accuratezza e distorsione delle previsioni, scorte e arretrati vs. obiettivo, raggiungimento del piano |
| 15 min | panoramica di business per famiglia: piano della domanda vs. budget, piano della fornitura vs. domanda |
| 45 min | decisioni: un documento decisionale alla volta, opzioni, raccomandazione, decisione registrata |
| 10 min | rischi per i prossimi 3–6 mesi, stato dei nuovi prodotti |
| 10 min | revisione del registro delle decisioni, responsabili e date |

### Rollout: dal piano approvato all'MPS

Entro pochi giorni dalla riunione esecutiva, il master scheduler disaggrega il piano approvato per famiglia nell'MPS per articolo finito e settimana (sezione 8), lo verifica con la pianificazione della capacità rough-cut (sezione 9) ed esegue l'MRP (sezione 10). Gli acquisti ricevono ordini pianificati nuovi o modificati, e le decisioni sulla capacità (un secondo turno, gli straordinari) vengono rilasciate tramite HR e lo stabilimento. Senza questo rollout, l'S&OP diventa una presentazione mensile senza effetti sul reparto produttivo.

### Ruoli e diritti decisionali

| Ruolo | Responsabilità |
|---|---|
| Sponsor esecutivo (GM o presidente) | presiede la riunione esecutiva, detiene le decisioni finali, fa rispettare la partecipazione e la disciplina decisionale |
| Responsabile del processo S&OP | gestisce il calendario, prepara il pre-S&OP, mantiene i registri delle decisioni e delle ipotesi |
| Demand planner | previsione statistica, processo di consenso, KPI delle previsioni |
| Responsabili vendite e marketing | intelligence di mercato, responsabilità del numero di domanda di consenso |
| Master scheduler | MPS, regole ATP, pianificazione della capacità rough-cut, disaggregazione |
| Pianificatori di fornitura e materiali | eccezioni MRP, capacità dei fornitori, ordini di acquisto |
| Responsabile di stabilimento o delle operations | piano di capacità, manodopera, decisioni su straordinari e turni |
| Partner finanziario | valorizzazione in dollari, riconciliazione con il budget, capitale circolante |
| Product management o ingegneria | lanci, dismissioni, modifiche di ingegneria |

I diritti decisionali devono essere messi per iscritto. Esempio: la revisione della fornitura può approvare straordinari fino al 10% della capacità di un centro di lavoro; tutto ciò che è superiore, e qualsiasi modifica agli obiettivi di scorta, passa alla riunione esecutiva.

## Strategie di approvvigionamento: livellata, inseguimento o ibrida (esempio svolto)

La pianificazione aggregata offre tre strategie classiche di approvvigionamento, che le guide S&OP citano ma raramente calcolano [6]:

- **Livellata:** produrre a una cadenza costante e lasciare che le scorte assorbano le oscillazioni della domanda.
- **Inseguimento:** modificare la cadenza produttiva ogni mese per allinearla alla domanda, ricorrendo a straordinari, manodopera temporanea o turni aggiuntivi, e mantenere le scorte stabili.
- **Ibrida (mista):** modificare la cadenza alcune volte e accettare un certo accumulo di scorte.

**Esempio svolto (valori illustrativi).** Un produttore di scrivanie pianifica la famiglia "scrivanie a struttura in acciaio" per sei mesi. Le scorte iniziali sono 800 unità, le scorte finali obiettivo sono 800 unità e a fine mese devono essere disponibili almeno 500 unità (scorta di sicurezza). La cadenza produttiva precedente era di 3.000 unità al mese. La saldatura è il collo di bottiglia: 5 celle di saldatura × 2 turni × 8 ore × 20 giorni = 1.600 ore al mese; ogni scrivania richiede 0,4 ore di saldatura, quindi la cadenza massima è 1.600 / 0,4 = **4.000 scrivanie al mese**. Costi: mantenimento di 4 $ per unità al mese sulle scorte finali; ogni unità di variazione della cadenza mensile (assunzioni, formazione, avvio dello straordinario o licenziamenti) costa 5 $.

| Mese | Domanda | Livellata: produzione | Livellata: scorte finali | Inseguimento: produzione | Inseguimento: scorte finali | Ibrida: produzione | Ibrida: scorte finali |
|---|---|---|---|---|---|---|---|
| Gen | 3.000 | 3.800 | 1.600 | 3.000 | 800 | 3.500 | 1.300 |
| Feb | 3.200 | 3.800 | 2.200 | 3.200 | 800 | 3.500 | 1.600 |
| Mar | 4.200 | 3.800 | 1.800 | **4.200** | 800 | 4.000 | 1.400 |
| Apr | 4.800 | 3.800 | 800 | **4.800** | 800 | 4.000 | 600 |
| Mag | 4.000 | 3.800 | 600 | 4.000 | 800 | 4.000 | 600 |
| Giu | 2.800 | 3.800 | 1.600 | 2.800 | 800 | 3.000 | 800 |
| **Totale** | **22.000** | **22.800** | **8.600 unità-mese** | **22.000** | **4.800 unità-mese** | **22.000** | **6.300 unità-mese** |

Perché la cadenza livellata è 3.800: la domanda cumulata fino a maggio è 19.200 unità; con 500 unità richieste a fine maggio e 800 disponibili all'inizio, la produzione fino a maggio deve essere almeno 19.200 + 500 − 800 = 18.900, ovvero 3.780 al mese. Arrotondata a 3.800, la pianificazione livellata chiude giugno con 1.600 unità, 800 sopra l'obiettivo.

| Voce di costo | Livellata | Inseguimento | Ibrida |
|---|---|---|---|
| Variazioni di cadenza (unità × 5 $) | 3.000 → 3.800: 800 → 4.000 $ | +200, +1.000, +600, −800, −1.200 = 3.800 → 19.000 $ | +500, +500, −1.000 = 2.000 → 10.000 $ |
| Mantenimento (unità-mese × 4 $) | 8.600 → 34.400 $ | 4.800 → 19.200 $ | 6.300 → 25.200 $ |
| **Totale** | **38.400 $** | **38.200 $** | **35.200 $** |
| Fattibile al collo di bottiglia della saldatura (≤ 4.000/mese)? | sì | **no** (marzo 4.200, aprile 4.800) | sì |
| Scorte finali rispetto all'obiettivo 800 | +800 | in linea con l'obiettivo | in linea con l'obiettivo |

Sulla carta il piano a inseguimento sembra quasi costare quanto quello livellato, ma non è fattibile: marzo e aprile superano la capacità di saldatura, a meno che l'azienda non aggiunga un terzo turno, che comporterebbe a sua volta un costo. Il piano ibrido è il più economico tra le opzioni fattibili e porta la saldatura al 100% esatto per tre mesi, senza lasciare alcuna capacità di protezione. Le variazioni di cadenza non sono solo una voce di costo. Un piano a inseguimento significa assunzioni, manodopera temporanea, licenziamenti o straordinari prolungati; i contratti collettivi, le regole di preavviso per gli straordinari e i limiti di affaticamento determinano la velocità con cui uno stabilimento può cambiare la propria cadenza, e gli operatori sostengono il costo di ogni oscillazione. La revisione dell'approvvigionamento dovrebbe chiedere a stabilimento e risorse umane che cosa sia realistico prima di modellarlo. La finanza aggiungerà un secondo effetto: con il costing standard, nei mesi a bassa produzione si assorbe meno costo fisso di struttura, quindi un piano a inseguimento genera scostamenti di assorbimento che un piano livellato evita.

È questa la decisione che la revisione dell'approvvigionamento dovrebbe portare alla riunione con il top management: approvare il piano ibrido e decidere se qualificare un subfornitore di saldatura per 200–400 scrivanie al mese come assicurazione. Far funzionare un collo di bottiglia a piena utilizzazione fa crescere sensibilmente code e tempi di attraversamento, come mostrano la [sezione della guida APS sulla fisica della fabbrica](https://www.m365.fm/en/learn/production-scheduling-aps/) con la legge di Little e le curve operative, e la [guida alla teoria dei vincoli](https://www.m365.fm/en/learn/theory-of-constraints/) spiega come proteggere il tamburo.

## S&OP vs. IBP vs. S&OE

I tre termini descrivono ambiti e orizzonti diversi.

| Aspetto | S&OP | Integrated business planning (IBP) | Sales and operations execution (S&OE) |
|---|---|---|---|
| Domanda | Domanda e offerta coincidono per famiglia? | L'intero piano aziendale (portafoglio, domanda, offerta, finanza, strategia) regge nel suo insieme? | Cosa cambiamo questa settimana per eseguire il piano? |
| Orizzonte | Oliver Wight: tipicamente 6–12 mesi; SAP e altri: 18–36 mesi a scorrimento [2][5] | almeno 24 mesi [2] | 0–3 mesi (settimane) [unverified: orizzonte come comunemente usato dai professionisti] |
| Cadenza | mensile | mensile | settimanale |
| Unità | unità e dollari per famiglia | principalmente dollari, più unità | unità per SKU e cliente |
| Presidente | GM o VP operations | CEO o presidente di business unit | responsabile supply chain o pianificazione |
| Origine | Oliver Wight, anni '80 [1][2] | Oliver Wight, inizio anni 2000 [2] | termine di pratica, nessuna origine unica verificata |

Oliver Wight descrive l'S&OP come incentrato sui compromessi della supply chain e l'IBP come quello che porta l'intera azienda sotto osservazione, dal portafoglio alla domanda, dall'offerta alla finanza [2]. Molte aziende usano i termini in modo intercambiabile. L'etichetta conta meno di due fatti: se la finanza e il portafoglio fanno parte del processo, e se il team esecutivo prende decisioni al suo interno. L'S&OE è il ponte settimanale tra il piano approvato e l'MPS: gestisce i cambiamenti di domanda a breve termine, le interruzioni di fornitura e l'allocazione all'interno delle zone congelate e fluide dell'MPS (Sezione 8).

**Ordine del giorno settimanale S&OE (30–45 minuti, a titolo illustrativo)**

| Tempo | Argomento | Responsabile |
|---|---|---|
| 5 min | settimana passata: aderenza all'MPS, spedizioni vs. piano, i primi tre scostamenti | master scheduler |
| 10 min | variazioni di domanda entro la time fence di pianificazione: nuovi ordini di grandi dimensioni, cancellazioni, allocazione di forniture scarse | demand planner, customer service |
| 10 min | problemi di offerta: ritardi dei fornitori, fermi macchina, blocchi qualità, carenze di materiale dalle eccezioni MRP | supply planner, stabilimento |
| 10 min | decisioni entro le regole dell'MPS; tutto ciò che è fuori regola viene portato al passo successivo dell'S&OP | responsabile supply chain |
| 5 min | azioni, responsabili, scadenze | master scheduler |

## Modelli di maturità S&OP

I modelli di maturità aiutano un'azienda a capire dove si trova e qual è il passo successivo. Tre sono ampiamente usati.

**Gartner.** Gartner pubblica una roadmap di maturità S&OP a cinque livelli [17]. La sua pagina pubblica di presentazione non elenca i nomi dei livelli; fonti secondarie ne descrivono i contenuti, grosso modo, così: dalla mancanza di obiettivi condivisi e pianificazione basata su fogli di calcolo non coordinati (livello 1), alla pianificazione commerciale operativa, al bilanciamento di domanda e offerta lungo l'intera supply chain e a un mix di prodotti orientato alla domanda e redditizio, fino a un'azienda connessa in cui l'S&OP fa parte della pianificazione aziendale complessiva e le decisioni sono basate su scenari (livello 5) [18]. [unverified: i nomi dei livelli di Gartner; le descrizioni sopra seguono la sintesi di Jedox, un fornitore di software di pianificazione.]

**Grimson e Pyke (2007).** J. Andrew Grimson e David Pyke hanno proposto un modello con cinque dimensioni e cinque stadi: nessun processo S&OP, reattivo, standard, avanzato e proattivo [1][19].

**Wagner, Ullrich e Transchel (2014).** Stephan Wagner e colleghi descrivono quattro dimensioni e sei stadi, dal non sviluppato al proattivo, insieme al processo in cinque passi usato nella Sezione 4 [1][20].

Un semplice auto-assessment, derivato dalle dimensioni che questi modelli condividono (riunioni e collaborazione, organizzazione, misurazione, tecnologia dell'informazione, integrazione dei piani):

| Dimensione | Stadio 1: nessuno o reattivo | Stadio 2: standard | Stadio 3: avanzato | Stadio 4: proattivo |
|---|---|---|---|---|
| Riunioni | gestione ad hoc delle emergenze | ciclo mensile, l'executive partecipa a volte | ciclo completo in cinque passi, l'executive presiede ogni mese | il ciclo include scenari e strategia, gli executive decidono tra le opzioni |
| Organizzazione | nessun responsabile | coordinatore a tempo parziale | process owner dedicato, diritti decisionali scritti | l'S&OP è il modo in cui si gestisce l'azienda |
| Misurazione | nessuna | servizio e scorte | accuratezza e bias della previsione, raggiungimento del piano | KPI collegati ai risultati finanziari e agli incentivi |
| IT | fogli di calcolo separati | foglio condiviso o report ERP | strumento di pianificazione integrato, riconciliazione famiglia/SKU | pianificazione per scenari, flusso dati automatizzato |
| Integrazione dei piani | piani commerciali e produttivi differenti | un unico piano di volumi | piano di volumi riconciliato con il piano finanziario | un unico piano guida budget, MPS e investimenti |

La ricerca sugli effetti del S&OP è favorevole ma non uniforme. Una revisione della letteratura di Antônio Márcio Tavares Thomé e colleghi sull'*International Journal of Production Economics* ha sintetizzato la letteratura sul S&OP fino al 2012 [22], e uno studio correlato ha collegato il S&OP alle prestazioni dell'azienda [23]. Lavori successivi sottolineano che il design più adatto del S&OP dipende dal contesto, come la dimensione dell'azienda, la complessità dei prodotti e l'incertezza della catena di fornitura [34]. Le affermazioni su miglioramenti percentuali fissi ottenuti dal S&OP presenti nelle pagine dei fornitori vanno lette come affermazioni del fornitore.

## Piano principale di produzione (MPS) e disponibile al promettere (ATP)

Il **piano principale di produzione** è la dichiarazione di ciò che l'azienda prevede di produrre, basata sul piano tattico e sui vincoli di budget, come afferma la documentazione di JD Edwards di Oracle [7]. Si colloca tra il S&OP e l'MRP: è abbastanza specifico (articolo finito, settimana) da guidare la pianificazione dei materiali e della capacità, e abbastanza stabile da proteggere lo stabilimento dal rumore quotidiano. L'MRP calcola quindi i fabbisogni netti sfasati nel tempo per ogni componente a supporto dell'MPS [7].

### Disaggregazione: da famiglia ad articolo finito

Il piano S&OP approvato per le "scrivanie a telaio in acciaio" di aprile è di 4.000 unità. Il pianificatore principale lo suddivide per articolo finito usando il mix corrente e gli ordini noti: 55% D100 (2.200), 30% D120 (1.200) e 15% D140 (600), poi per settimana. Le distinte base di pianificazione vengono usate dove le opzioni sono pianificate in percentuale, ad esempio 60% telai neri e 40% telai bianchi.

### Barriere temporali

L'MPS è suddiviso in zone con regole di modifica diverse. Nomi e regole tipici di zona (definizioni esatte e durata delle zone variano per azienda e ERP):

| Zona | Estensione tipica | Cosa può cambiare | Chi approva |
|---|---|---|---|
| Congelata | da oggi alla barriera della domanda (ad esempio tempo di attraversamento dell'assemblaggio finale) | nulla, salvo emergenze | direttore di stabilimento o riunione S&OE |
| Flessibile | dalla barriera della domanda alla barriera di pianificazione (ad esempio tempo di attraversamento cumulato dei componenti acquistati a lungo termine) | mix all'interno della famiglia; quantità entro la tolleranza concordata | pianificatore principale |
| Libera | oltre la barriera di pianificazione | qualsiasi cosa coerente con il S&OP | sistema di pianificazione e pianificatore principale |

La zona congelata è ciò che nelle slide MIT di Gershwin si intende per congelamento del programma a breve termine: riduce l'instabilità a fronte di una perdita di flessibilità [8]. La sezione 12 ne quantifica il motivo.

### Scheda MPS con saldo disponibile proiettato e ATP

**Esempio svolto (numeri illustrativi).** Articolo finito D100, giacenza 60 unità, dimensione del lotto MPS 200, scorta di sicurezza 0, barriera della domanda alla fine della settimana 2. All'interno della barriera della domanda, la domanda proiettata è costituita solo dagli ordini dei clienti; al di fuori, è il maggiore tra previsione e ordini dei clienti.

| Settimana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Previsione | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| Ordini dei clienti | 90 | 70 | 40 | 20 | 10 | 0 | 0 | 0 |
| Domanda proiettata | 90 | 70 | 100 | 100 | 100 | 100 | 100 | 100 |
| MPS (completamenti) | 200 | | | 200 | | 200 | | 200 |
| Saldo disponibile proiettato (PAB), partenza 60 | 170 | 100 | 0 | 100 | 0 | 100 | 0 | 100 |
| ATP discreto | 60 | | | 170 | | 200 | | 200 |
| ATP cumulato | 60 | 60 | 60 | 230 | 230 | 430 | 430 | 630 |

Come si ottengono i numeri:

- **PAB, settimana 1:** 60 + 200 − 90 = 170. Settimana 2: 170 − 70 = 100. Settimana 3: 100 − 100 = 0. La settimana 4 scenderebbe a −100, quindi l'MPS pianifica un lotto di 200: 0 + 200 − 100 = 100. E così via.
- **L'ATP discreto** viene calcolato solo nelle settimane con un ricevimento MPS: giacenza (solo nel primo periodo) più la quantità MPS meno tutti gli ordini dei clienti fino al successivo ricevimento MPS. Settimana 1: 60 + 200 − (90 + 70 + 40) = 60. Settimana 4: 200 − (20 + 10) = 170. Settimane 6 e 8: 200 − 0 = 200.
- **L'ATP cumulato** somma nel tempo l'ATP discreto: 60, poi 60 + 170 = 230, poi 430, poi 630.
- Alcuni sistemi ERP usano una variante con anticipo: se gli ordini dei clienti in un periodo successivo superano il ricevimento MPS di quel periodo, il deficit viene dedotto dall'ATP dei periodi precedenti, così che le stesse unità non vengano promesse due volte. In questo esempio nessun periodo è venduto in eccesso, quindi entrambi i metodi danno lo stesso risultato.

Cosa può promettere il settore vendite: un cliente che vuole 100 scrivanie nella settimana 2 può ottenerne al massimo 60 dal piano attuale; le 100 complete sono disponibili dalla settimana 4 (ATP cumulativo 230). Il PAB di 0 nella settimana 3 non costituisce un problema per le promesse, perché l'ATP utilizza gli ordini dei clienti e non le previsioni. È invece un segnale per il responsabile della pianificazione principale: il piano non ha margini se gli ordini della settimana 3 superano la previsione. Sistemi ERP come JD Edwards riportano ATP e ATP cumulativo come output standard del MPS [7].

### Regole MPS che mantengono credibile il programma

| Regola | Perché |
|---|---|
| La somma MPS per famiglia resta entro ±5% del piano S&OP (tolleranza di esempio) | altrimenti le decisioni S&OP non arrivano in produzione |
| Nessun sovraccarico: carico RCCP ≤ capacità dimostrata nelle risorse chiave | un MPS sovrastimato rende fittizie le date ATP e MRP |
| Le modifiche all'interno della zona congelata richiedono un'approvazione nominativa | protegge materiali e capacità già impegnati |
| Ordini pianificati confermati per il breve termine | l'esecuzione MRP non può spostarli automaticamente |
| L'ATP viene verificato prima di ogni promessa d'ordine | evita di promettere due volte la stessa capacità |
| Revisione settimanale del MPS nella riunione S&OE | individua gli scostamenti prima che diventino ordini in ritardo |

## Pianificazione approssimata della capacità (RCCP)

La pianificazione approssimata della capacità verifica il MPS rispetto a poche **risorse critiche** prima che l'MRP lo esploda. È "approssimata" perché utilizza una distinta delle risorse (ore per articolo finito in ciascuna risorsa chiave), non cicli di lavorazione completi, e ignora la maggior parte degli sfasamenti dei tempi di attraversamento.

**Esempio svolto (numeri illustrativi).** MPS settimanale per i tre modelli di scrivania e relativa distinta delle risorse su tre risorse chiave:

| Modello | MPS settimana 14 | Saldatura (h/unità) | Verniciatura a polvere (h/unità) | Assemblaggio finale (h/unità) |
|---|---|---|---|---|
| D100 | 550 | 0,40 | 0,10 | 0,25 |
| D120 | 300 | 0,45 | 0,12 | 0,30 |
| D140 | 150 | 0,60 | 0,15 | 0,40 |

| Risorsa | Calcolo del carico | Carico (h) | Capacità settimanale (h) | Utilizzo |
|---|---|---|---|---|
| Saldatura | 550 × 0,40 + 300 × 0,45 + 150 × 0,60 = 220 + 135 + 90 | 445 | 400 | **111%** |
| Verniciatura a polvere | 550 × 0,10 + 300 × 0,12 + 150 × 0,15 = 55 + 36 + 22,5 | 113,5 | 160 | 71% |
| Assemblaggio finale | 550 × 0,25 + 300 × 0,30 + 150 × 0,40 = 137,5 + 90 + 60 | 287,5 | 320 | 90% |

La saldatura è sovraccarica di 45 ore. Opzioni: spostare 75 scrivanie D140 (75 × 0,60 = 45 h) alla settimana 15 se la settimana 15 ha margine e le date dei clienti lo consentono, pianificare 45 ore di straordinario, oppure spostare alcuni telai D100 al subfornitore previsto nella revisione della fornitura. La capacità settimanale di saldatura di 400 ore corrisponde alle 1.600 ore mensili utilizzate nell'S&OP (Sezione 5), ed è proprio questo il punto: l'RCCP usa le stesse definizioni di risorsa della revisione della fornitura S&OP, quindi i livelli possono essere riconciliati.

Nei testi e nei sistemi ERP sono comuni tre tecniche RCCP: pianificazione della capacità con fattori globali (percentuali storiche delle ore totali per centro di lavoro), distinte di capacità o distinte delle risorse (ore per unità per risorsa, come sopra) e profili delle risorse che aggiungono sfasamenti temporali. Quanto più dettagliato è il metodo, tanto più si avvicina alla pianificazione dei fabbisogni di capacità (Sezione 11).

## Pianificazione dei fabbisogni di materiali (MRP): come funziona il calcolo

**La pianificazione dei fabbisogni di materiali (MRP)** utilizza la distinta base e i dati di giacenza per calcolare i fabbisogni netti scaglionati nel tempo per ogni componente e sottoassieme e suggerisce un piano di reintegro a supporto del MPS [7]. La sua logica si basa su un'idea di Orlicky: la domanda di componenti è *dipendente* dalla domanda del prodotto finito, quindi va calcolata, non prevista [13]. Se lo stabilimento produce 150 scrivanie nella settimana 3 e ogni scrivania ha quattro gambe, servono 600 gambe prima della settimana 3, indipendentemente da ciò che una previsione statistica per le gambe indicherebbe.

### Gli input

| Input | Contenuto | Tipico problema di qualità dei dati |
|---|---|---|
| Programma di produzione principale | prodotti finiti, quantità, date | MPS non riconciliato con S&OP, o sovraccarico |
| Distinta base (BOM) | relazioni padre-componente, quantità per, fattori di scarto, date di validità | uso della distinta di ingegneria al posto di quella di produzione; assiemi fantasma mancanti; obsoleta dopo modifiche di ingegneria |
| Registrazioni di magazzino | disponibilità, allocato, scorta di sicurezza | inventari errati; scarti e consumi non registrati |
| Ordini aperti (ricevimenti programmati) | ordini di produzione e di acquisto rilasciati con date di scadenza | date di scadenza non mantenute; ordini chiusi in ritardo |
| Dati di pianificazione dell'anagrafica articoli | lead time, regola di dimensionamento dei lotti, multipli d'ordine, minimi, resa | lead time impostati anni fa e mai rivisti |

Le slide del MIT di Gershwin elencano gli stessi elementi di base: fabbisogni lordi, ricevimenti programmati, giacenza prevista, fabbisogni netti, ricevimenti di ordini pianificati e rilasci di ordini pianificati, sfalsati per lead time [8].

### I cinque passaggi per ogni articolo

1. **Fabbisogni lordi:** il MPS per i prodotti finiti, oppure i rilasci di ordini pianificati di tutti i padri moltiplicati per la quantità per, per i componenti.
2. **Compensazione:** giacenza prevista = giacenza precedente + ricevimenti programmati − fabbisogni lordi. Dove scenderebbe sotto la scorta di sicurezza, la carenza è il **fabbisogno netto**.
3. **Dimensionamento dei lotti:** il fabbisogno netto diventa un **ricevimento di ordine pianificato** secondo la regola di dimensionamento dei lotti (lotto per lotto, quantità d'ordine fissa, multipli, quantità d'ordine per periodo).
4. **Sfasamento:** il ricevimento di ordine pianificato viene anticipato di un lead time dell'articolo per ottenere il **rilascio di ordine pianificato**.
5. **Esplosione:** i rilasci di ordini pianificati diventano fabbisogni lordi del livello successivo della distinta base.

Gli articoli vengono elaborati livello per livello secondo l'ordine del **codice di basso livello**: ogni articolo riceve un codice pari al livello più basso al quale compare in una qualsiasi distinta base, in modo che tutti i fabbisogni lordi di tutti i padri siano raccolti prima che l'articolo venga compensato [8]. L'esempio svolto mostra perché questo è importante.

### Esempio svolto: esplosione MRP e compensazione su due livelli della distinta base

**Struttura del prodotto (a titolo illustrativo).** La scrivania D100 è composta da un piano T-20, un telaio gambe F-10 e 1 metro di tubo d'acciaio S-5 per un traverso di controventatura. Ogni telaio gambe F-10 è saldato da 4 metri di tubo d'acciaio S-5. S-5 compare quindi al livello 1 (direttamente in D100) e al livello 2 (in F-10); il suo codice di basso livello è 2.

```
D100 Scrivania (livello 0)
├── T-20 Piano, qtà 1 (livello 1, prodotto internamente, lead time 1 settimana)
├── F-10 Telaio gambe, qtà 1 (livello 1, saldato internamente, lead time 2 settimane)
│   └── S-5 Tubo d'acciaio, 4 m (livello 2, acquistato, lead time 2 settimane)
└── S-5 Tubo d'acciaio, 1 m (livello 1, traverso di controventatura)
```

Per rendere le tabelle leggibili, la riga MPS indica la settimana in cui inizia l'assemblaggio finale di D100; i componenti devono essere disponibili all'inizio di quella settimana.

**MPS per D100 (inizio assemblaggio finale):**

| Settimana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Totale |
|---|---|---|---|---|---|---|---|---|---|
| Inizio assemblaggio D100 | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 | 740 |

**Articolo T-20 Piano.** Lotto per lotto, lead time 1 settimana, giacenza 30, ricevimento programmato 100 nella settimana 1, scorta di sicurezza 0.

| Settimana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Fabbisogni lordi | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 |
| Ricevimenti programmati | 100 | | | | | | | |
| Giacenza prevista (inizio 30) | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 |
| Fabbisogni netti | | | 140 | 100 | | 150 | 100 | 120 |
| Ricevimenti di ordini pianificati | | | 140 | 100 | | 150 | 100 | 120 |
| Rilasci di ordini pianificati | | 140 | 100 | | 150 | 100 | 120 | |

Settimana 1: 30 + 100 − 120 = 10. Settimana 3: 10 − 150 = −140, quindi 140 sono necessari e vengono rilasciati una settimana prima, nella settimana 2.

**Articolo F-10 Telaio gambe.** Quantità d'ordine fissa 200 (un lotto di saldatura), lead time 2 settimane, giacenza 120, nessun ricevimento programmato, scorta di sicurezza 0.

| Settimana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Fabbisogni lordi | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 |
| Giacenza proiettata (inizio 120) | 0 | 0 | 50 | 150 | 150 | 0 | 100 | 180 |
| Fabbisogni netti | | | 150 | 50 | | | 100 | 20 |
| Ricevimenti di ordini pianificati | | | 200 | 200 | | | 200 | 200 |
| Rilasci di ordini pianificati | 200 | 200 | | | 200 | 200 | | |

Settimana 3: 0 − 150 = −150, quindi arriva un lotto da 200, con una giacenza residua di 50. Settimana 4: 50 − 100 = −50, un altro lotto da 200, con una giacenza residua di 150. La settimana 6 consuma esattamente le 150 unità rimanenti. I rilasci sono sfalsati di due settimane.

**Articolo S-5 Tubo in acciaio (codice di basso livello 2).** Articolo acquistato, lead time di 2 settimane, ordini in multipli di 500 m, giacenza di 1.400 m, ricevimento programmato di 500 m nella settimana 1, scorta di sicurezza di 100 m. I fabbisogni lordi combinano entrambi i genitori:

| Settimana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Da rilasci F-10 (× 4 m) | 800 | 800 | | | 800 | 800 | | |
| Da avvii D100 (× 1 m) | 120 | | 150 | 100 | | 150 | 100 | 120 |
| **Fabbisogni lordi** | **920** | **800** | **150** | **100** | **800** | **950** | **100** | **120** |
| Ricevimenti programmati | 500 | | | | | | | |
| Giacenza proiettata (inizio 1.400) | 980 | 180 | 530 | 430 | 130 | 180 | 580 | 460 |
| Fabbisogni netti | | | 70 | | 470 | 920 | 20 | |
| Ricevimenti di ordini pianificati | | | 500 | | 500 | 1.000 | 500 | |
| Rilasci di ordini pianificati | 500 | | 500 | 1.000 | 500 | | | |

Settimana 3: 180 − 150 = 30, sotto la scorta di sicurezza di 100, quindi il fabbisogno netto è 70 e viene ordinato un multiplo di 500 (giacenza proiettata 530). Settimana 6: 130 − 950 = −820; per chiudere almeno a 100, il fabbisogno netto è 920, arrotondato per eccesso a 1.000.

**Che cosa mostra l'esempio**

- **La domanda dipendente è a blocchi.** La domanda delle scrivanie è abbastanza regolare (da 100 a 150 a settimana), ma la domanda di tubo oscilla tra 100 e 950 m a settimana perché i lotti di saldatura da 200 telai assorbono 800 m in una volta sola. Una previsione statistica del consumo di tubo non coglierebbe quei picchi; l'esplosione della distinta base sì.
- **La codifica di basso livello previene le carenze.** Se S-5 fosse stato calcolato al livello 1 (con la sola domanda dei traversi, da 120 a 150 m a settimana), l'MRP non avrebbe visto alcun fabbisogno fino alla settimana 7 e i telai avrebbero esaurito il tubo già nella settimana 2.
- **I lotti si moltiplicano.** Due regole di dimensionamento dei lotti (200 telai, multipli di 500 m) hanno trasformato 740 scrivanie in 2.500 m di ordini di tubo in cinque settimane. La [guida al dimensionamento dei lotti](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/) spiega come scegliere tali regole; la [guida alla gestione delle giacenze manifatturiere](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) tratta le scorte di sicurezza.
- **L'output dell'ERP è un elenco di azioni:** rilasciare 200 telai e acquistare 500 m di tubo questa settimana; rilasciare 140 scrivanie la settimana prossima. Il pianificatore lavora su questi come **messaggi di eccezione** (rilascio, anticipo, posticipo, annullamento) invece di leggere le tabelle complete.

### Pegging e messaggi di eccezione

Il **pegging** collega ogni fabbisogno alla sua fonte: il fabbisogno di tubo della settimana 6, pari a 950 m, è agganciato al rilascio F-10 della settimana 6 (800 m) e all'avvio D100 della settimana 6 (150 m). Con il pegging, un pianificatore che non riesce a ottenere 1.000 m di tubo nella settimana 6 vede quali scrivanie e quali ordini dei clienti sono a rischio.

Messaggi di eccezione MRP tipici e azioni conseguenti:

| Messaggio | Significato | Azione tipica |
|---|---|---|
| Rilascia ordine | l'ordine pianificato rientra nella finestra di rilascio | convertire in ordine di produzione o di acquisto dopo aver verificato capacità e materiale |
| Riprogramma in anticipo (accelerazione) | un ordine aperto è in scadenza più tardi del necessario | chiedere al fornitore o allo stabilimento di anticiparlo; se impossibile, segnalare per modificare l'MPS |
| Riprogramma in posticipo (rallentamento) | un ordine aperto è in scadenza prima del necessario | posticiparlo per ridurre le giacenze e liberare capacità |
| Annulla | un ordine aperto non è più necessario | annullare o ridurre; verificare le condizioni di annullamento |
| Scaduto | la data di rilascio o di scadenza è già passata | il piano così com'è non è fattibile: correggere l'MPS, non solo l'ordine |
| Sotto la scorta di sicurezza | giacenza proiettata sotto il livello di sicurezza | verificare se la scorta di sicurezza è corretta prima di accelerare |

Uno stabilimento con centinaia di ordini pianificati scaduti dopo ogni esecuzione dell'MRP non ha un problema di MRP. Ha un MPS non fattibile, oppure lead time e dimensioni dei lotti che non riflettono la realtà.

### MRP vs. punto di riordino e kanban

MRP non è l'unico modo per riapprovvigionare i componenti. I sistemi a punto di riordino e il kanban riapprovvigionano quando la scorta scende fino a un livello di attivazione e funzionano bene per articoli con domanda stabile e ad alta frequenza. L'MRP è più adatto alla domanda dipendente discontinua, ai lunghi lead time, ai volumi bassi e ai prodotti ingegnerizzati. Molti stabilimenti usano entrambi: kanban per viteria e componenti a rapido movimento in linea, MRP per componenti a lungo lead time e costosi. La [guida al kanban e al sistema pull](https://www.m365.fm/en/learn/kanban-pull-system/) e la [guida al lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) spiegano il lato pull.

## MRP II, CRP e il ciclo chiuso

**Manufacturing resource planning (MRP II)** chiude il ciclo attorno all'MRP: S&OP e MPS sopra di esso, capacity requirements planning (CRP) e controllo del reparto produttivo sotto di esso, e il collegamento con la pianificazione finanziaria [3][8]. Oliver Wight lo descrisse nel 1983 [3].

**Capacity requirements planning (CRP)** prende tutti gli ordini pianificati e rilasciati dall'MRP, applica i cicli di lavorazione completi (tempi di setup e di esecuzione per operazione e centro di lavoro) e calcola il carico per centro di lavoro e periodo. Evidenzia i sovraccarichi ma non li risolve: il CRP, come l'MRP, si basa sull'ipotesi di capacità infinita [8]. In *Factory Physics*, Wallace Hopp e Mark Spearman sostengono che il modello MRP di base presuppone lead time indipendenti dal carico, cosa possibile solo con capacità illimitata [9]. La guida APS mostra un esempio svolto del sovraccarico che l'MRP non vede e spiega la **sindrome del lead time**: i pianificatori allungano i lead time previsti per coprire gli ordini in ritardo, il che anticipa il lavoro, aumenta il WIP e rende i lead time ancora più lunghi [26]. Piuttosto che ripetere quelle sezioni, questa guida le rimanda: vedi [i punti deboli della logica MRP classica](https://www.m365.fm/en/learn/production-scheduling-aps/).

| Elemento del ciclo chiuso | Verifica | Feedback in caso di mancato esito |
|---|---|---|
| Pianificazione delle risorse in S&OP | capacità aggregata per mese | modifica del piano di famiglia, decisione sulla capacità |
| RCCP | risorse chiave per settimana | modifica dell'MPS |
| CRP | ogni centro di lavoro per giorno o settimana | straordinari, percorso alternativo, modifica dell'MPS |
| Controllo input/output e schedulazione finita | code e sequenza effettive | riprogrammazione, controllo dei rilasci, escalation all'MPS |
| Feedback dal reparto (MES) | completamenti effettivi, scarti, fermi | aggiornamento degli ordini aperti e delle scorte per la successiva esecuzione MRP |

## Nervosità del MRP: perché i piani sobbalzano e come calmarli

**Nervosità** significa che piccole variazioni nel MPS o nelle giacenze causano modifiche ampie o frequenti negli ordini pianificati ai livelli inferiori. Le slide di Gershwin descrivono il fenomeno come piccole deviazioni che producono grandi variazioni del programma [8]. Le cause sono l'interazione tra dimensionamento dei lotti, sfasamenti dei lead time e orizzonte di pianificazione a scorrimento, più il rumore nei dati di domanda, fornitura e giacenza.

### Esempio svolto: 30 scrivanie in più nella settimana 4

Le vendite accettano un ordine extra: l'avvio dell'assemblaggio D100 nella settimana 4 passa da 100 a 130, una variazione del 4% del volume di otto settimane (30 su 740). Rieseguendo l'esempio precedente si ottiene:

| Articolo | Prima | Dopo | Variazione |
|---|---|---|---|
| T-20 Piano del desktop, rilasci pianificati | sett. 2: 140, sett. 3: 100, sett. 5: 150, sett. 6: 100, sett. 7: 120 | sett. 2: 140, sett. 3: **130**, sett. 5: 150, sett. 6: 100, sett. 7: 120 | quantità +30 |
| F-10 Telaio gamba, rilasci pianificati | sett. 1, 2, **5**, 6 (200 ciascuno) | sett. 1, 2, **4**, 6 (200 ciascuno) | un lotto di saldatura anticipato di una settimana |
| S-5 Tubo in acciaio, rilasci pianificati | sett. 1: 500, **sett. 3: 500**, sett. 4: 1.000, sett. 5: 500 | sett. 1: 500, **sett. 2: 500**, sett. 4: 1.000, sett. 5: 500 | un ordine d'acquisto anticipato di una settimana, ora da rilasciare la settimana prossima |

Le 30 unità in più non hanno cambiato alcuna quantità di tubi o telai. Hanno cambiato **le date** a due livelli inferiori, perché il lotto fisso di 200 telai ora si esaurisce una settimana prima. In una distinta base reale con centinaia di componenti, poche di queste variazioni al giorno generano migliaia di messaggi di riprogrammazione, e i pianificatori smettono di fidarsi del sistema. Questa è la nervosità.

### Rimedi

Joseph Blackburn, Dean Kropp e Robert Millen hanno confrontato cinque strategie per attenuare la nervosità in uno studio di simulazione pubblicato su *Management Science* nel 1986: congelamento del programma entro l'orizzonte di pianificazione, lotto per lotto sotto il prodotto finito, scorta di sicurezza, previsione oltre l'orizzonte di pianificazione e una procedura basata sul costo del cambiamento [10]. Per la nervosità causata dall'orizzonte a scorrimento e dal dimensionamento dei lotti, la scorta di sicurezza e il lotto per lotto non sono risultati convenienti, mentre le strategie basate sul costo del cambiamento e sul congelamento hanno generalmente dato i risultati migliori [10]. Lo studio non ha coperto la nervosità causata dall'incertezza su domanda, fornitura o lead time [10].

| Rimedio | Come funziona | Compromesso |
|---|---|---|
| Zona congelata e time fence | nessuna modifica automatica all'interno della zona congelata | minore reattività alle variazioni reali |
| Ordini pianificati fermi | il pianificatore fissa ordini selezionati; il MRP non li sposta | il pianificatore deve mantenerli |
| Regole sul costo del cambiamento o di "smorzamento" | il MRP propone una riprogrammazione solo se la variazione di data supera una soglia (ad esempio 3 giorni) o se il costo del cambiamento è giustificato | piccoli disallineamenti restano |
| Lotto per lotto ai livelli inferiori | elimina l'interazione con il dimensionamento dei lotti | più attrezzaggi e ordini; Blackburn et al. l'hanno trovato non conveniente per la nervosità legata all'orizzonte [10] |
| Scorta di sicurezza | assorbe piccole variazioni | costo delle giacenze; anch'essa non conveniente in quello studio [10] |
| Dati accurati | meno variazioni artificiali dovute a giacenze o distinte base errate | richiede conteggi ciclici e disciplina nelle modifiche di ingegneria |
| Disaccoppiamento con buffer (DDMRP) | interrompe la catena di dipendenza in punti selezionati | giacenza di buffer, metodo nuovo da apprendere |

## Demand driven MRP (DDMRP)

**Demand driven material requirements planning (DDMRP)** mantiene la logica di distinta base (BOM) dell'MRP, ma interrompe l'esplosione dei fabbisogni basati sulle previsioni in corrispondenza di alcuni **punti di disaccoppiamento** selezionati, dove colloca buffer dimensionati e gestiti attivamente. Gli ordini di fornitura vengono generati dalla domanda effettiva e dallo stato del buffer, non dalla sola previsione. Il metodo deriva dai consulenti Carol Ptak e Chad Smith: il loro aggiornamento del 2011 del libro di Orlicky, *Orlicky's Material Requirements Planning, Third Edition*, aggiunge indicazioni per la pianificazione basata sugli ordini di vendita effettivi anziché sulle previsioni, sotto il nome DDMRP [4]. TechTarget osserva che alcuni professionisti considerano l'approccio controverso [4]. Ptak e Smith hanno inoltre fondato il Demand Driven Institute nel 2011; l'istituto valuta e certifica gratuitamente per i fornitori il software conforme al DDMRP e assegna ai singoli professionisti certificati di approvazione professionale [35].

### I cinque componenti

La documentazione Microsoft per Dynamics 365 Supply Chain Management elenca i cinque componenti del DDMRP [11]:

1. **Posizionamento strategico delle scorte:** individuare i punti di disaccoppiamento nella catena di fornitura in cui viene mantenuto, monitorato e reintegrato un buffer di scorte.
2. **Profili e livelli dei buffer:** dimensionare ogni buffer (minimo, massimo, punto di riordino) e la quantità di riordino.
3. **Adeguamenti dinamici dei buffer:** adattare i livelli dei buffer al variare dei parametri operativi o degli eventi pianificati.
4. **Pianificazione guidata dalla domanda:** generare gli ordini di fornitura (produzione, acquisto, trasferimento) secondo necessità.
5. **Esecuzione altamente collaborativa e visibile:** eseguire gli ordini di fornitura con priorità visiva, tipicamente per colore del buffer.

### Dimensionamento dei buffer: esempio svolto

Ogni buffer ha tre zone, calcolate a partire dall'uso medio giornaliero (ADU), dal tempo di approvvigionamento disaccoppiato (DLT), da un fattore del tempo di approvvigionamento e da un fattore di variabilità, come documentato da Microsoft [12]:

| Zona | Formula [12] |
|---|---|
| Gialla | ADU × DLT |
| Rossa di base | ADU × DLT × fattore del tempo di approvvigionamento |
| Rossa di sicurezza | rossa di base × fattore di variabilità |
| Rossa | rossa di base + rossa di sicurezza |
| Verde | il maggiore tra: quantità minima d'ordine; ADU × ciclo d'ordine; ADU × DLT × fattore del tempo di approvvigionamento |

Microsoft raccomanda fattori del tempo di approvvigionamento di 0,20–0,40 per tempi lunghi, 0,41–0,60 per tempi medi e 0,61–1,00 per tempi brevi, e fattori di variabilità di 0,20–0,40 per variabilità bassa, 0,41–0,60 per variabilità media e 0,61–1,00 per variabilità alta [12]. Il **tempo di approvvigionamento disaccoppiato** è il tempo necessario per produrre o ricevere un articolo se i punti di disaccoppiamento a monte sono disponibili a magazzino; di solito è molto inferiore al tempo di approvvigionamento cumulativo [12].

**Esempio (numeri illustrativi).** Una staffa acquistata B-7: ADU 40 pezzi, tempo di approvvigionamento disaccoppiato 10 giorni, fattore del tempo di approvvigionamento 0,5 (medio), fattore di variabilità 0,5 (medio), quantità minima d'ordine 300, ciclo d'ordine 7 giorni.

| Zona | Calcolo | Dimensione | Cumulativo (limite superiore della zona) |
|---|---|---|---|
| Rossa di base | 40 × 10 × 0,5 | 200 | |
| Rossa di sicurezza | 200 × 0,5 | 100 | |
| Rossa | 200 + 100 | 300 | 300 |
| Gialla | 40 × 10 | 400 | 700 |
| Verde | max(300; 40 × 7 = 280; 200) | 300 | 1.000 |

### L'equazione del flusso netto

Il DDMRP decide il reintegro in base alla **posizione di flusso netto**: disponibilità a magazzino + ordini in corso − domanda da ordini di vendita qualificati [14]. La domanda qualificata include tipicamente gli ordini in scadenza oggi, gli ordini scaduti e i picchi qualificati entro un orizzonte definito. Se la posizione di flusso netto scende sotto il limite superiore della zona gialla, viene creato un ordine di fornitura per riportarla al limite superiore della zona verde [14].

Proseguendo l'esempio: disponibilità a magazzino 350, ordini in corso 400, domanda qualificata 90. Posizione di flusso netto = 350 + 400 − 90 = **660**. È inferiore al limite superiore della zona gialla (700), quindi il DDMRP propone un ordine di 1.000 − 660 = **340** pezzi. L'ordine supera la quantità minima d'ordine di 300, quindi è confermato. La priorità di esecuzione è poi stabilita dallo stato della disponibilità a magazzino: una disponibilità di 350 è appena sopra il limite superiore della zona rossa (300), che un pianificatore considererebbe urgente.

### Quando il DDMRP è adatto e quando no

| Situazione | Idoneità al DDMRP | Motivo |
|---|---|---|
| Tempi di approvvigionamento cumulativi lunghi, i clienti si aspettano tempi di consegna brevi | buona | il disaccoppiamento comprime il lead time percepito dal cliente |
| Molti componenti condivisi, alta variabilità, frequente nervosismo dell'MRP | buona | i buffer assorbono la variabilità invece di trasmetterla lungo la distinta base |
| Domanda stabile e prevedibile, distinte base corte | limitata | l'MRP classico o il kanban possono essere più semplici |
| Progetti unici engineer-to-order | limitata | pochi articoli ripetitivi da bufferizzare; domina la pianificazione di progetto |
| Accuratezza delle giacenze e anagrafiche deboli | scarsa | buffer dimensionati su ADU o lead time errati proteggono gli articoli sbagliati |

Il DDMRP non sostituisce l'S&OP. Le politiche dei buffer, la capacità e l'investimento in scorte richiedono ancora una decisione mensile interfunzionale, e l'ERP necessita comunque dell'MPS per i prodotti finiti non bufferizzati. In Dynamics 365, il DDMRP fa parte del modulo di pianificazione master, utilizza un proprio codice di copertura, non comporta costi di licenza aggiuntivi e richiede il componente aggiuntivo Planning Optimization; Microsoft sottolinea che non sostituisce le funzionalità di pianificazione esistenti [11]. SAP include il DDMRP tra gli argomenti del suo materiale sull'MRP [27], e IFS documenta il DDMRP in IFS Cloud [14]. Le evidenze indipendenti e sottoposte a revisione paritaria sui risultati del DDMRP sono ancora più scarse rispetto ai casi di studio di fornitori e società di consulenza; le percentuali di miglioramento dichiarate dai fornitori di DDMRP vanno trattate come affermazioni dei fornitori.

## Pianificazione della produzione in ERP: cosa fanno i sistemi e dove si fermano

Quasi tutti gli ERP per la manifattura contengono un motore MPS e un motore MRP. L'S&OP viene gestito in tre modi: all'interno dello stesso ERP, in una piattaforma S&OP o IBP dedicata collegata all'ERP, oppure in fogli di calcolo a supporto dell'ERP.

### Funzioni tipiche di pianificazione ERP

| Funzione | Cosa verificare |
|---|---|
| Gestione della domanda e previsione | modelli statistici, consumo della previsione con gli ordini, previsione a livello di famiglia e SKU |
| MPS | fasce temporali, ordini pianificati fissi, distinte di pianificazione per le opzioni, ATP e ATP cumulativo [7] |
| RCCP | distinte delle risorse per le risorse chiave, report di carico vs. capacità |
| MRP | esecuzioni a variazione netta e rigenerative, codici di basso livello, regole di dimensionamento dei lotti, pegging, messaggi di eccezione |
| CRP | carico per centro di lavoro dai cicli di lavorazione |
| DDMRP | punti di disaccoppiamento, profili dei buffer, flusso netto (ove supportato) [11] |
| Integrazione | verso lo strumento S&OP, APS, MES, portali fornitori, BI |

### Opzioni sul mercato (esempi, non una classifica)

| Categoria | Esempi verificati per questa guida | Note |
|---|---|---|
| ERP con MPS/MRP | Oracle JD Edwards EnterpriseOne (MPS, MRP, ATP) [7]; Microsoft Dynamics 365 Supply Chain Management (pianificazione master con Planning Optimization, DDMRP) [11]; SAP S/4HANA (MRP; il materiale SAP copre MRP predittivo e DDMRP) [27]; IFS Cloud (DDMRP) [14] | molti altri fornitori ERP offrono MRP; verificare la profondità della pianificazione con una demo guidata da script |
| S&OP e IBP affini all'ERP | SAP Integrated Business Planning [5]; Oracle Fusion Cloud Sales and Operations Planning [33] | più efficaci quando l'ERP proviene dallo stesso fornitore |
| Piattaforme S&OP / IBP autonome | Kinaxis, o9 Solutions, Blue Yonder, ToolsGroup, Board, Anaplan (elenco fornitori secondo la guida per acquirenti 2026 di Board, scritta da uno dei fornitori) [29][15] | le classifiche dei fornitori non sono indipendenti; usare report di analisti con metodologia dichiarata |
| Fogli di calcolo | Excel con estrazioni dall'ERP; Power BI per il reporting KPI | adeguati per un primo ciclo di S&OP con poche famiglie; fragili su larga scala |

Per le aziende orientate a Microsoft, una configurazione pratica consiste nell'eseguire MPS e MRP nell'ERP, preparare l'S&OP in Excel o in uno strumento di pianificazione, e pubblicare il pacchetto KPI e il registro delle decisioni tramite Power BI e Teams. Microsoft posiziona Dynamics 365, Microsoft 365 e Azure insieme come "Microsoft for Manufacturing" [31], e i dati di Dataverse possono essere resi disponibili in Microsoft Fabric senza una pipeline ETL separata [32]. La [guida Azure per la manifattura](https://www.m365.fm/en/learn/manufacturing-it-azure/) illustra l'architettura.

### Come l'ERP esegue l'MRP

La maggior parte dei sistemi ERP offre due modalità di esecuzione: un'esecuzione **rigenerativa**, che ricalcola tutti gli articoli da zero, spesso ogni notte o ogni settimana, e un'esecuzione **net change**, che ricalcola solo gli articoli la cui domanda, offerta o dati anagrafici sono cambiati. In entrambi i casi il piano è aggiornato solo quanto i dati che l'esecuzione utilizza: se il MES registra i completamenti e gli scarti una volta per turno ma l'MRP viene eseguito alle 2 di notte, l'elenco delle eccezioni del mattino riflette ciò che è accaduto in reparto il giorno prima. Allineate l'orario di esecuzione dell'MRP al ciclo di registrazione di MES e magazzino, e mantenete stabile l'MPS durante l'esecuzione, in modo che pianificatori e sistema non lavorino in direzioni opposte. La [guida su MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) illustra lo scambio di dati tra Livello 3 e Livello 4.

### Dove si ferma la pianificazione ERP

- **Capacità finita.** L'MRP e il CRP dell'ERP pianificano su una capacità infinita [8]. Dove un collo di bottiglia determina le date di consegna, serve uno scheduler a capacità finita o un APS; si veda la [guida APS](https://www.m365.fm/en/learn/production-scheduling-aps/).
- **Scenari.** Confrontare tre opzioni di approvvigionamento con tutti gli effetti su materiali e capacità è lento nella maggior parte delle esecuzioni MRP dell'ERP. Le piattaforme di pianificazione pubblicizzano ricalcoli rapidi degli scenari; Kinaxis, ad esempio, descrive una pianificazione concorrente che riduce i cicli da settimane a ore (affermazione del fornitore) [16].
- **Risposta alle interruzioni.** In un sondaggio IDC commissionato da Kinaxis (1.800 intervistati in nove paesi, somministrato a dicembre 2023), l'83% delle catene di fornitura non riusciva a rispondere alle interruzioni entro 24 ore (ricerca commissionata dal fornitore) [30].
- **Esecuzione.** Il dispatching, le conferme e il WIP in tempo reale appartengono al MES (ISA-95 Livello 3) [25].

### Checklist di selezione per S&OP e software di pianificazione

| Domanda | Perché è importante |
|---|---|
| Può riconciliare automaticamente i piani per famiglia con l'MPS a livello di SKU? | lo sforzo manuale più comune nell'S&OP |
| Mostra i piani in unità e in dollari fianco a fianco? | la finanza deve far parte del processo |
| Quanto tempo richiede il calcolo di uno scenario completo (variazione della domanda + capacità + materiali)? | determina se gli scenari vengono usati durante le riunioni |
| Quali integrazioni ERP sono standard e chi le mantiene? | l'integrazione spesso costa più delle licenze |
| I pianificatori possono modificare i dati anagrafici (lead time, lotti di produzione) con una traccia di audit? | la qualità dei dati è il principale fattore della qualità del piano |
| Viene misurato il valore aggiunto delle previsioni (correzione manuale vs. statistica)? | mostra se le correzioni di consenso migliorano il risultato |
| Qual è il tempo realistico per il primo ciclo S&OP operativo? | Anaplan, ad esempio, consiglia di attendersi un valore dimostrabile in 8–12 settimane (indicazione del fornitore) [15] |
| Costo totale su 5 anni, incluso il personale interno | i canoni di licenza sono di solito la parte minore [unverified: nessuno studio indipendente sui costi è stato verificato] |

## Modelli: calendario S&OP, ordini del giorno, piano di famiglia, record MPS e MRP

Le tabelle seguenti possono essere copiate in Excel o in un elenco SharePoint come punto di partenza. Gli ordini del giorno per la revisione della domanda, la revisione dell'offerta e la riunione esecutiva sono nella Sezione 4.

### Modello 1: piano di famiglia di prodotti (un foglio per famiglia, MTS)

| Riga | Consuntivo M-1 | M1 | M2 | M3 | M4–M6 (trimestre) | M7–M12 (semestre) | M13–M18 | Note |
|---|---|---|---|---|---|---|---|---|
| Budget / piano finanziario (unità) | | | | | | | | dalla finanza |
| Previsione statistica (unità) | | | | | | | | modello, versione |
| Piano della domanda di consenso (unità) | | | | | | | | responsabile: VP vendite |
| Consenso del mese precedente (unità) | | | | | | | | modifica visibile |
| Piano di fornitura (unità) | | | | | | | | responsabile: VP operations |
| Giacenza finale (unità) | | | | | | | | |
| Obiettivo di giacenza (unità o giorni di copertura) | | | | | | | | politica |
| Carico delle risorse chiave (% della capacità) | | | | | | | | es. saldatura |
| Ricavi a prezzo standard ($) | | | | | | | | finanza |
| Costo del venduto a costo standard ($) | | | | | | | | finanza |
| Ipotesi e rischi | | | | | | | | collegamento al registro |

Per le famiglie make-to-order, sostituire le righe delle giacenze con **arretrato ordini** e **obiettivo di arretrato (settimane)**. Arretrato finale = arretrato iniziale + nuovi ordini − spedizioni.

### Modello 2: registro delle ipotesi

| ID | Famiglia | Ipotesi | Responsabile | Data di inserimento | Impatto se errata (unità, $) | Stato / data di revisione |
|---|---|---|---|---|---|---|
| A-031 | scrivanie | l'aumento di prezzo dei concorrenti di aprile si conferma | VP vendite | 6 gen | −400 unità/mese | revisione 3 feb |
| A-032 | scrivanie | subfornitore di saldatura qualificato entro marzo | supply chain | 8 gen | −300 unità ad aprile | in corso |

### Modello 3: registro delle decisioni

| ID | Riunione / data | Decisione | Opzioni considerate | Responsabile | Scadenza | Effetto sul piano | Stato |
|---|---|---|---|---|---|---|---|
| D-014 | S&OP esecutivo, 15 gen | adottare il piano ibrido, ritmi 3.500 / 4.000 / 3.000 | livellato, inseguimento, ibrido | VP operations | 31 gen | +2.000 unità di variazione di ritmo, $35.200 | aperta |
| D-015 | S&OP esecutivo, 15 gen | qualificare il subfornitore di saldatura per 200–400 unità/mese | nessuno / qualificare / terzo turno | supply chain | 1 mar | riduzione del rischio per mar–mag | aperta |

### Modello 4: record MPS

| Articolo | Settimana | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| | Previsione | | | | |
| | Ordini dei clienti | | | | |
| | Domanda proiettata (regola per fascia temporale) | | | | |
| | MPS (confermato / pianificato) | | | | |
| | Saldo disponibile proiettato | | | | |
| | ATP / ATP cumulativo | | | | |
| | Zona della fascia temporale | congelata | congelata | semi-congelata | libera |

### Modello 5: record MRP (per articolo)

| Articolo, LLC, lead time, regola di lotto, scorta di sicurezza, disponibilità | Settimana | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| | Fabbisogni lordi | | | | |
| | Ricevimenti programmati | | | | |
| | Disponibilità proiettata | | | | |
| | Fabbisogni netti | | | | |
| | Ricevimenti di ordini pianificati | | | | |
| | Lanci di ordini pianificati | | | | |

### Modello 6: lista di verifica di prontezza S&OP prima del primo ciclo

| Elemento | Pronto quando |
|---|---|
| Famiglie di prodotti definite | 5–15 famiglie per unità di business, ciascuna con risorse e driver di domanda simili |
| Risorse chiave definite | 3–8 risorse che limitano la produzione, con capacità dimostrata al mese |
| Distinta delle risorse | ore per unità per ogni risorsa chiave, per famiglia |
| Fonti dei dati | spedizioni, ordini, giacenze, produzione per famiglia disponibili nei giorni lavorativi 1–2 |
| Politica di giacenza o arretrato | obiettivo per famiglia approvato dalla finanza |
| Calendario | 12 mesi di date prenotate per tutti e cinque i passaggi |
| Diritti decisionali | soglie scritte per la revisione dell'offerta, il pre-S&OP e la riunione esecutiva |
| Sponsor esecutivo | nominato, partecipa di persona ai primi tre cicli |

## KPI di S&OP e MRP con esempi svolti

Un buon pacchetto di KPI per S&OP è breve: circa dieci misure, ognuna con una definizione, un responsabile e un obiettivo. La [guida ai KPI di produzione](https://www.m365.fm/en/learn/manufacturing-kpis/) copre le misure a livello di stabilimento, come OEE e consegna puntuale; questa sezione tratta le misure di pianificazione.

### Accuratezza della previsione, bias e MAPE: un solo set di dati, cinque misure

**Dati (a titolo illustrativo).** Previsione mensile (F, formulata con un mese di anticipo) e domanda effettiva (A) per la famiglia di scrivanie:

| Mese | Previsione F | Effettivo A | Errore e = F − A | Errore assoluto \|e\| | Errore percentuale assoluto \|e\| / A |
|---|---|---|---|---|---|
| Gen | 3.000 | 2.850 | +150 | 150 | 5,26% |
| Feb | 3.200 | 3.350 | −150 | 150 | 4,48% |
| Mar | 4.200 | 3.900 | +300 | 300 | 7,69% |
| Apr | 4.800 | 5.100 | −300 | 300 | 5,88% |
| Mag | 4.000 | 3.700 | +300 | 300 | 8,11% |
| Giu | 2.800 | 2.650 | +150 | 150 | 5,66% |
| **Somma** | **22.000** | **21.550** | **+450** | **1.350** | **37,08%** |

| Misura | Formula | Calcolo | Risultato |
|---|---|---|---|
| MAPE (errore percentuale medio assoluto) | media di \|e\| / A | 37,08% / 6 | **6,18%** |
| WMAPE (MAPE ponderato) | Σ\|e\| / ΣA | 1.350 / 21.550 | **6,26%** |
| Accuratezza della previsione | 1 − WMAPE | 1 − 0,0626 | **93,7%** |
| Bias | Σe / ΣA | +450 / 21.550 | **+2,1% (sovrastima)** |
| MAD (deviazione assoluta media) | Σ\|e\| / n | 1.350 / 6 | **225 unità** |
| Segnale di tracking | Σe / MAD | 450 / 225 | **+2,0** |

Come leggerla:

- **Accuratezza e bias rispondono a domande diverse.** Un'accuratezza del 93,7% sembra buona. Ma quattro mesi su sei sono stati sovrastimati e l'errore cumulato è di +450 unità. Se la fornitura segue la previsione, in sei mesi le scorte crescono di circa 450 unità. Il bias è la misura che evidenzia un ottimismo sistematico o una sottostima deliberata.
- **MAPE vs. WMAPE.** Il MAPE attribuisce a ogni mese lo stesso peso; il WMAPE pondera per volume. A livello di SKU il MAPE esplode per gli articoli piccoli: uno SKU con previsione 10 ed effettivo 2 ha un errore del 400%. Per la reportistica a livello di SKU usate il WMAPE (o MAD/media) e riservate il MAPE alle serie stabili ad alto volume.
- **Segnale di tracking.** L'errore cumulato diviso per il MAD. Un valore che si allontana in modo costante da zero indica un bias; una regola empirica considera il modello funzionante correttamente finché il segnale di tracking resta tra −4 e +4 [36].
- **L'aggregazione nasconde l'errore.** Due SKU con previsioni di 1.000 ciascuno ed effettivi di 1.200 e 800 danno un errore di famiglia pari a 0, ma un WMAPE a livello di SKU di 400 / 2.000 = 20%. Riportate l'accuratezza al livello in cui si prendono le decisioni: famiglia per l'S&OP, SKU e ubicazione per il MPS e il reintegro.
- **Il ritardo conta.** Misurate la previsione congelata al lead time che conta (ad esempio, la previsione formulata tre mesi prima del mese per un componente con lead time di tre mesi), non l'aggiornamento dell'ultimo momento.

### Forecast value added

Il forecast value added (FVA) confronta l'errore di ogni fase del processo di previsione con quello della fase precedente. Se la previsione statistica aveva un WMAPE del 7,5% e la previsione di consenso, dopo le correzioni delle vendite, ne ha 6,3%, il processo di consenso ha aggiunto 1,2 punti percentuali di accuratezza. Se ne avesse avuti 8,5%, la riunione avrebbe peggiorato la previsione. L'FVA trasforma la revisione della domanda da una gara di opinioni in un processo misurato.

### KPI set per S&OP e MRP

| KPI | Definizione | Obiettivo di esempio (illustrativo) | Responsabile |
|---|---|---|---|
| Accuratezza della previsione (1 − WMAPE), famiglia, ritardo 1–3 | vedi sopra | ≥ 90% | pianificatore della domanda |
| Distorsione della previsione, famiglia | Σ(F − A) / ΣA su 3–6 mesi | entro ±3% | VP vendite |
| Raggiungimento del piano di fornitura | produzione effettiva / produzione pianificata per famiglia e mese | 95–105% | VP operations |
| Aderenza all'MPS | righe MPS completate nella settimana pianificata / tutte le righe MPS | ≥ 95% | master scheduler |
| Stabilità del programma | modifiche all'MPS nella zona congelata per settimana | in calo | master scheduler |
| Servizio al cliente | consegna puntuale e completa (OTIF) o tasso di evasione per famiglia | per segmento | VP vendite / supply chain |
| Scorte rispetto all'obiettivo | scorte finali / obiettivo, oppure giorni di copertura | 90–110% | supply chain |
| Accuratezza dei record di giacenza | articoli entro la tolleranza di conteggio / articoli contati | alta 90 | magazzino |
| Accuratezza delle distinte base (BOM) | BOM verificate corrette / BOM sottoposte ad audit | alta 90 | ingegneria |
| Carico di eccezioni MRP | messaggi di eccezione per pianificatore a settimana | in calo | responsabile materiali |
| Ordini pianificati in ritardo | numero dopo ogni esecuzione MRP | prossimo allo zero | responsabile materiali |
| Chiusura del registro decisionale | decisioni chiuse entro la scadenza / decisioni scadute | ≥ 90% | responsabile del processo S&OP |

Alcune guide MRP citano i benchmark "Class A" di Oliver Wight, come un'accuratezza dei record di giacenza del 95% e un'accuratezza delle distinte base del 98% [28]. Le stesse soglie compaiono nella letteratura sulla pianificazione principale: accuratezza dei record di giacenza del 95% come soglia di accettabilità (98% robusta) e accuratezza delle distinte base di almeno il 98% (99+% buona) [37]. La checklist corrente di Oliver Wight non era accessibile per questa guida, quindi l'attribuzione a Oliver Wight resta [unverified: checklist corrente non consultata]. Definite i vostri obiettivi a partire da una baseline misurata.

### Vista finanziaria: cosa fa l'S&OP per il capitale circolante

La finanza di solito pone due domande: quante scorte prevede il piano e quanto costano? Con il piano ibrido della Sezione 5, la giacenza media di fine mese è 6.300 / 6 = 1.050 scrivanie. A un costo standard di 180 $ per scrivania (illustrativo), significa 189.000 $ immobilizzati in media. Il piano a livello costante prevede 8.600 / 6 = 1.433 scrivanie, ovvero 258.000 $. Con un tasso di costo di possesso del 20% annuo (illustrativo; usate il tasso della vostra azienda), la differenza di 69.000 $ di giacenza media costa circa 13.800 $ all'anno. Questi numeri vanno inseriti nel documento decisionale pre-S&OP accanto agli effetti su servizio e capacità.

## Roadmap di implementazione: 12 mesi per un S&OP e un MRP funzionanti

| Fase | Mesi | Attività principali | Criteri di uscita |
|---|---|---|---|
| 0. Valutazione | 0–1 | autovalutazione della maturità (Sezione 7), inventario dei dati, interviste, impegno dello sponsor | sponsor nominato, perimetro concordato, KPI di base misurati |
| 1. Progettazione | 1–2 | famiglie di prodotti, risorse chiave, distinta delle risorse, calendario, diritti decisionali, definizioni dei KPI, modelli | documento di progettazione approvato dallo sponsor |
| 2. Base dati | 1–4 (in parallelo) | accuratezza dell'inventario (inventario ciclico), verifica delle distinte base incluse l'efficacia delle modifiche di ingegneria, revisione dei lead time, regole MPS e time fence nell'ERP | accuratezza dell'inventario e delle distinte base misurate e in miglioramento; lead time revisionati per l'80% superiore del valore |
| 3. Primi cicli | 3–5 | esecuzione del ciclo in cinque fasi con fogli di calcolo; tre cicli consecutivi con la partecipazione della direzione | tre cicli completati in orario, registro delle decisioni in uso |
| 4. Collegamento a MPS e MRP | 4–7 | regole di disaggregazione, MPS riconciliato con S&OP, RCCP sulle risorse chiave, disciplina delle eccezioni MRP | MPS entro la tolleranza dell'S&OP; ordini pianificati scaduti in calo |
| 5. Misurare e migliorare | 6–9 | accuratezza e distorsione delle previsioni, FVA, raggiungimento del piano; cause radice dei mancati obiettivi; regole di nervosismo | KPI riportati mensilmente; almeno una modifica di processo basata sui risultati FVA |
| 6. Estendere | 9–12 | integrazione con la finanza (direzione IBP), scenari, riunione settimanale S&OE, valutazione degli strumenti se i fogli di calcolo limitano il processo | piano in unità e dollari; S&OE attivo; decisione sullo strumento presa sulla base di evidenze |

**Note pratiche**

- **Iniziare con i fogli di calcolo.** Uno strumento non può correggere un processo che non esiste ancora. La maggior parte delle aziende capisce di cosa ha bisogno dal software solo dopo tre-sei cicli.
- **Avviare un progetto pilota su una business unit o uno stabilimento.** Un S&OP su cinque stabilimenti e venti famiglie fin dal primo giorno raramente sopravvive al secondo mese.
- **Il lavoro sui dati procede in parallelo.** Le decisioni S&OP sono valide solo quanto l'MPS e l'MRP sottostanti; l'accuratezza dell'inventario e delle distinte base determina l'affidabilità dei risultati MRP.
- **Controllo qualità e della configurazione.** In ambienti regolamentati o certificati (aerospaziale, automotive, medicale), le modifiche alle distinte base sono anche una questione del sistema qualità: una modifica di ingegneria deve arrivare alla distinta base MRP con la corretta data di efficacia, altrimenti l'MRP ordinerà componenti per una revisione superata. Coinvolgere il responsabile qualità nella verifica delle distinte base; la [guida alla pianificazione della produzione aerospaziale](https://www.m365.fm/en/learn/aerospace-production-planning/) tratta la gestione della configurazione.
- **Gestione del cambiamento.** I team commerciali temono di essere vincolati a una previsione; gli stabilimenti temono di essere incolpati per una capacità che non hanno mai avuto. Rendere visibile la distorsione senza attribuire colpe alle persone, e valorizzare le decisioni prese in anticipo.
- **Formazione.** Pianificatori e master scheduler traggono beneficio da una formazione strutturata sui fondamenti della MPC; il programma ASCM CPIM è la certificazione comune negli Stati Uniti [24].

## Errori comuni

| Errore | Sintomo | Correzione |
|---|---|---|
| S&OP trattato come una riunione di reporting | 40 slide, nessuna decisione | documenti decisionali con opzioni; registro delle decisioni |
| I dirigenti saltano la riunione | i delegati non possono decidere; i problemi slittano | presenza dello sponsor come regola; agenda più breve e orientata alle decisioni |
| Previsione = obiettivo di vendita | sovrastima sistematica, scorte in crescita | separare obiettivo e previsione; misurare il bias |
| S&OP a livello di SKU | centinaia di righe, nessun tempo per decidere | famiglie per l'S&OP, SKU per l'MPS |
| Nessuna finanza in sala | il piano in unità non corrisponde al budget | partner finanziario nel pre-S&OP; piano in unità e dollari |
| MPS non riconciliato con l'S&OP | il reparto produttivo segue un piano diverso | regola di disaggregazione e controllo di tolleranza ogni mese |
| MPS sovraccarico | ordini in ritardo dopo ogni esecuzione di MRP | RCCP sulle risorse chiave; MPS sulla capacità dimostrata |
| Lead time pianificati mai rivisti | rilasci anticipati o in ritardo, WIP gonfiato | revisione trimestrale dei lead time; vedi sindrome del lead time [26] |
| Dati di inventario e distinta base errati | solleciti, carenze nonostante scorte "disponibili" | conteggio ciclico, audit delle distinte base, processo di modifica ingegneristica |
| Reazione a ogni messaggio di eccezione | nervosismo, esaurimento dei pianificatori | finestre temporali, ordini pianificati fermi, soglie di smorzamento [10] |
| Acquistare prima il software | strumento costoso, stesse discussioni | prima da tre a sei cicli manuali |
| Ignorare il collo di bottiglia | piano fattibile in media, non fattibile nei mesi di picco | verifica del carico sulla risorsa chiave in ogni revisione della fornitura; vedi [teoria dei vincoli](https://www.m365.fm/en/learn/theory-of-constraints/) |

## Limiti di S&OP e MRP

**L'S&OP è un processo mensile in un mondo che cambia settimanalmente.** Un piano approvato il 15 può essere superato entro il 25. S&OE e aggiornamenti S&OP guidati dagli eventi affrontano il problema, ma richiedono disciplina per evitare di ripianificare tutto ogni settimana.

**L'aggregazione nasconde i problemi.** Un piano per famiglia può essere fattibile mentre una specifica variante è carente di un determinato componente. Per questo contano l'MPS e l'MRP sotto l'S&OP, e per questo le definizioni di famiglia dovrebbero raggruppare articoli che condividono le risorse.

**L'MRP è deterministico; la realtà non lo è.** L'MRP tratta previsioni, lead time e rese come numeri fissi [8]. Scorta di sicurezza e lead time di sicurezza coprono parte della variabilità, ma l'MRP non può rappresentare esplicitamente l'incertezza. DDMRP, modelli stocastici e simulazione (vedi [simulazione manifatturiera](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)) affrontano il tema da prospettive diverse.

**L'MRP pianifica con capacità infinita.** MRP e CRP mostrano i sovraccarichi ma non li risolvono [8][9]. Schedulazione finita e APS colmano questa lacuna a livello operativo.

**L'MRP presuppone lead time che dipendono in realtà dal carico.** I lead time pianificati sono input per l'MRP ma risultati del carico di lavoro dello stabilimento. La sindrome del lead time mostra cosa succede quando i pianificatori li trattano come leve [26].

**Dipendenza dai dati.** L'MRP amplifica gli errori nei dati: una quantità per unità errata in una distinta base al livello 2 si propaga a ogni articolo padre. Nessun algoritmo compensa registrazioni di inventario sbagliate.

**Cultura.** La letteratura accademica elenca tra le principali cause di stallo delle iniziative S&OP le barriere organizzative, come i silos funzionali e la mancanza di impegno da parte dei dirigenti [1]. Il software non le elimina.

**Non ogni azienda ha bisogno dell'intero stack.** Un job shop con lead time brevi e ordini prevalentemente specifici per cliente può aver bisogno più di una buona acquisizione ordini e di schedulazione finita che di un S&OP a 24 mesi. Un distributore può aver bisogno più di DRP che di MRP. Adatta il metodo all'azienda.

## IA e pianificazione digitale: cosa funziona oggi

I fornitori di software di pianificazione e di ERP ora commercializzano previsioni con machine learning, "demand sensing", agenti di pianificazione e copilot. Per uno stabilimento, le domande utili sono quale decisione di pianificazione migliora e come si misura il miglioramento.

| Applicazione | Cosa fa | Dove aiuta | Cosa verificare |
|---|---|---|---|
| Previsione con machine learning | utilizza molti driver (prezzo, promozioni, meteo, ordini) oltre allo storico | molti SKU con driver di domanda noti | misurare la FVA rispetto a una semplice baseline statistica; il ML spesso la supera per alcune famiglie e non per altre |
| Demand sensing a breve termine | adegua la previsione a breve termine con ordini recenti e dati di point-of-sale | beni di consumo, distribuzione | utile solo se MPS e S&OE possono reagire ai cambiamenti settimanali |
| Pianificazione di scenario e ricalcolo rapido | ricalcola gli effetti di una decisione su domanda, capacità e materiali | supply review, pre-S&OP | tempo di calcolo, latenza dei dati, chi può eseguire gli scenari [16] |
| Taratura dei parametri | suggerisce lead time, scorte di sicurezza, lotti e fattori dei buffer DDMRP a partire dai dati reali | manutenzione dei dati anagrafici MRP | revisione del pianificatore prima delle modifiche; traccia di audit |
| Triage delle eccezioni | classifica i messaggi di eccezione MRP per impatto sugli ordini dei clienti | pianificazione dei materiali | tasso di accettazione delle raccomandazioni; tempo risparmiato |
| Assistenti di IA generativa | riassumono i pacchetti S&OP, redigono documenti decisionali, rispondono a "perché il piano è cambiato?" a partire dai dati di pianificazione | preparazione delle riunioni | le risposte devono citare i dati utilizzati; nessuna modifica autonoma del piano senza approvazione |
| Gemello digitale e simulazione | testa opzioni di capacità, buffer e layout prima di decidere | supply review per investimenti in capacità | validazione del modello rispetto alle prestazioni effettive; vedi la [guida al gemello digitale](https://www.m365.fm/en/learn/digital-twin-manufacturing/) |

Quattro regole mantengono utile l'IA nella pianificazione:

1. **Sistemare prima il processo.** Una previsione di IA immessa in un processo privo di revisione della domanda, di misurazione del bias e di diritti decisionali produce confusione più rapida.
2. **Misurare il valore aggiunto.** Trattare ogni modello come qualsiasi altra fase di previsione e monitorarne la FVA (Sezione 16).
3. **Mantenere le persone responsabili delle decisioni.** Le decisioni S&OP riguardano denaro, persone e clienti. Gli strumenti possono preparare le opzioni; decide il team esecutivo.
4. **Prima i modelli, la base dati.** La maggior parte dei progetti di pianificazione con IA si blocca per la qualità dello storico, i dati anagrafici e l'integrazione, non per gli algoritmi. Negli ambienti Microsoft, le scelte di piattaforma come Fabric e Power BI sono trattate nella [guida Azure per la manifattura](https://www.m365.fm/en/learn/manufacturing-it-azure/) [31][32].

### Una configurazione realistica di Microsoft 365 per S&OP

| Elemento | Strumento | Note |
|---|---|---|
| Calendario e riunioni | Outlook, Teams | serie ricorrenti per tutti e cinque i passaggi, prenotate 12 mesi in anticipo |
| Pacchetto KPI | report Power BI da dati ERP e di pianificazione | una pagina per famiglia; stesso layout ogni mese |
| Piani di famiglia e scenari | Excel (primi cicli), in seguito uno strumento di pianificazione | controllo delle versioni: un file per ciclo, in sola lettura dopo l'approvazione |
| Ipotesi e registri decisionali | Microsoft Lists o un elenco SharePoint | responsabile, scadenza, stato; collegati nell'ordine del giorno esecutivo |
| Documenti decisionali | Word o pagine Loop, una pagina per decisione | opzioni, impatto, raccomandazione |
| Supporto alla preparazione | riepiloghi Copilot del pacchetto KPI e dei registri | rivisti dal responsabile del processo prima della distribuzione |

## Glossario

| Termine | Definizione |
|---|---|
| Pianificazione aggregata | pianificazione dei ritmi di produzione, della forza lavoro e delle scorte per famiglie di prodotti nel medio periodo; l'origine dell'S&OP [1] |
| Disponibile al promettere (ATP) | la quota non ancora impegnata della fornitura pianificata che può essere promessa a nuovi ordini cliente (Sezione 8) |
| Distinta base (BOM) | elenco di componenti, quantità e struttura necessari per realizzare un articolo padre |
| Distinta delle risorse | ore per unità di un prodotto o famiglia su ciascuna risorsa chiave; usata nella pianificazione delle risorse S&OP e nella RCCP |
| Pianificazione dei fabbisogni di capacità (CRP) | calcolo dettagliato del carico per centro di lavoro a partire dagli ordini MRP e dai cicli di lavorazione, a capacità infinita [8] |
| Tempo di approvvigionamento cumulato | il percorso più lungo dei tempi di approvvigionamento attraverso la BOM, dall'acquisto del primo materiale al completamento dell'articolo finito |
| Punto di disaccoppiamento | posizione nella BOM o nella catena di fornitura in cui un buffer DDMRP separa la fornitura dalla variabilità della domanda [11] |
| Orizzonte di congelamento della domanda | confine nel MPS entro il quale contano come domanda solo gli ordini cliente, non la previsione |
| Domanda dipendente | domanda calcolata a partire dalla domanda di un articolo padre, in contrapposizione alla domanda indipendente (previsionale) [13] |
| DDMRP | pianificazione dei fabbisogni di materiali guidata dalla domanda: buffer nei punti di disaccoppiamento, dimensionati per zone e reintegrati tramite l'equazione del flusso netto [11][12] |
| Messaggio di eccezione | raccomandazione MRP di rilasciare, riprogrammare o annullare un ordine |
| Ordine pianificato confermato | ordine pianificato fissato dal pianificatore affinché l'MRP non lo modifichi automaticamente |
| Errore sistematico di previsione | previsione sistematicamente in eccesso o in difetto; Σ(F − A) / ΣA |
| Valore aggiunto della previsione (FVA) | variazione dell'errore di previsione causata da una fase del processo di previsione |
| Fabbisogni lordi | domanda totale di un articolo in un periodo prima della compensazione |
| Business planning integrato (IBP) | termine di Oliver Wight per un'estensione dell'S&OP a livello aziendale che include portafoglio e finanza, con orizzonte di almeno 24 mesi [2] |
| Codice di livello basso | il livello più basso della BOM in cui compare un articolo; determina la sequenza di elaborazione dell'MRP [8] |
| Lotto per lotto | regola di dimensionamento dei lotti che ordina esattamente il fabbisogno netto di ogni periodo [8] |
| MAPE / WMAPE | errore percentuale assoluto medio / MAPE ponderato (Sezione 16) |
| Piano principale di produzione (MPS) | dichiarazione di ciò che l'azienda prevede di produrre per articolo finito e periodo, sulla base del piano tattico [7] |
| MRP | pianificazione dei fabbisogni di materiali: calcolo temporizzato dei fabbisogni netti di tutti i componenti a partire da MPS, BOM e giacenze [7] |
| MRP II | pianificazione delle risorse di produzione: MRP più S&OP, MPS, RCCP, CRP, controllo di reparto e integrazione finanziaria [3] |
| Posizione di flusso netto | DDMRP: disponibilità + ordinato − domanda qualificata [14] |
| Nervosismo | variazioni frequenti o ampie negli ordini pianificati causate da piccole variazioni in ingresso [8][10] |
| Fabbisogni netti | fabbisogni lordi meno giacenza disponibile e ricevimenti programmati, più scorta di sicurezza ove applicabile |
| Pegging | collegamento tra un fabbisogno e la domanda di origine |
| Rilascio dell'ordine pianificato | data e quantità alla quale un ordine pianificato deve essere rilasciato, anticipato del tempo di approvvigionamento rispetto alla sua ricezione |
| Orizzonte di pianificazione | confine oltre il quale il sistema di pianificazione può creare o modificare automaticamente gli ordini |
| Saldo disponibile proiettato (PAB) | giacenza prevista alla fine di un periodo nel MPS |
| Pianificazione grossolana della capacità (RCCP) | verifica del MPS rispetto alle risorse chiave mediante le distinte delle risorse |
| S&OE | esecuzione di vendite e operations: processo settimanale per eseguire il piano S&OP nel breve termine |
| Pianificazione vendite e operations (S&OP) | processo mensile interfunzionale per integrare i piani di domanda e fornitura per famiglia, in unità e in dollari [1] |
| Ricevimento programmato | ordine di produzione o d'acquisto aperto con una data di scadenza |
| Segnale di tracciamento | errore di previsione cumulato diviso per il MAD; indica l'errore sistematico |

## FAQ: pianificazione delle vendite e delle operazioni (S&OP) e MRP

### Che cos'è la pianificazione delle vendite e delle operazioni in parole semplici?

S&OP è un ciclo di riunioni mensile in cui vendite, operations, supply chain e finanza concordano un unico piano su cosa l'azienda venderà, produrrà e stoccherà nei successivi 18-36 mesi, per famiglia di prodotti [1][5]. Il team esecutivo lo usa per prendere decisioni di compromesso, come aggiungere un turno o costituire scorte prima di un fermo.

### Quali sono le fasi del processo S&OP?

Le cinque fasi comuni sono raccolta dei dati, revisione della domanda, revisione dell'offerta, pre-S&OP (riconciliazione) e riunione esecutiva S&OP [1][20]. Alcune aziende aggiungono all'inizio una revisione di prodotto o di portafoglio; Anaplan, ad esempio, elenca le revisioni di prodotto, domanda, offerta, finanza, pre-S&OP ed esecutiva [15].

### Con quale frequenza va svolto lo S&OP?

Mensilmente, secondo un calendario fisso [1][5]; Anaplan, ad esempio, descrive cicli mensili con incontri settimanali per i partecipanti chiave [15]. Una riunione S&OE settimanale gestisce i cambiamenti a breve termine tra un ciclo e l'altro, e eventi rilevanti (un ordine di grandi dimensioni, il fermo di uno stabilimento) possono far scattare una revisione straordinaria.

### Chi dovrebbe partecipare alla riunione esecutiva S&OP?

Il direttore generale o il presidente dell'unità di business come presidente, più i responsabili di vendite, marketing, operations, supply chain e finanza, e il product management o l'ingegneria quando nell'ordine del giorno ci sono decisioni di portafoglio. Il responsabile del processo S&OP lo prepara e ne documenta gli esiti.

### Qual è la differenza tra S&OP e IBP?

IBP estende lo S&OP dal bilanciamento domanda-offerta all'intero piano aziendale, inclusi portafoglio, strategia e aspetti finanziari, con un orizzonte di almeno 24 mesi [2]. Oliver Wight ha sviluppato lo S&OP negli anni Ottanta e ha coniato il termine IBP all'inizio degli anni Duemila [2].

### Qual è la differenza tra S&OP e MRP?

Lo S&OP decide i volumi per famiglia di prodotti e per mese, trasversalmente alle funzioni. L'MRP calcola, per ogni componente, quanti acquistarne o produrne e quando, a partire dal piano principale di produzione, dalle distinte base e dalle giacenze [7]. Lo S&OP definisce il quadro; l'MRP lo esegue a livello di articolo.

### Qual è la differenza tra MPS e MRP?

Il MPS pianifica i prodotti finiti (o gli articoli di pianificazione) per settimana; l'MRP esplode il MPS attraverso le distinte base per pianificare componenti e materiali [7]. Entrambi usano la stessa logica di compensazione, ma il MPS è definito da un master scheduler mentre l'MRP è calcolato dal sistema.

### Come funziona l'MRP?

Per ciascun articolo, livello per livello: si prendono i fabbisogni lordi, si sottraggono giacenza disponibile e ricevimenti programmati, si applica la scorta di sicurezza per ottenere i fabbisogni netti, si dimensionano i lotti, si anticipa con il tempo di approvvigionamento per ottenere gli ordini pianificati di lancio e si trasferiscono questi come fabbisogni lordi dei componenti [8]. La Sezione 10 mostra un esempio completo svolto.

### Quali sono gli input dell'MRP?

Il piano principale di produzione, le distinte base, le anagrafiche di magazzino (giacenza disponibile, scorta di sicurezza), gli ordini aperti (ricevimenti programmati) e i dati di pianificazione degli articoli (tempi di approvvigionamento, regole di lotto) [7][8].

### Qual è la differenza tra MRP e MRP II?

L'MRP calcola i fabbisogni di materiali. L'MRP II, definito da Oliver Wight nel 1983, aggiunge lo S&OP, la pianificazione della produzione, la pianificazione della capacità a grandi linee e dettagliata, il controllo della produzione in officina e il collegamento con la pianificazione finanziaria [3].

### Qual è la differenza tra MRP ed ERP?

L'MRP è un metodo di pianificazione e un modulo dell'ERP. L'ERP è un sistema integrato per finanza, vendite, acquisti, risorse umane e produzione, in cui l'MRP costituisce il nucleo di pianificazione dei materiali. Gartner ha coniato il termine ERP nel 1990 [4].

### Che cos'è il DDMRP?

Il Demand Driven MRP colloca buffer di giacenza in punti di disaccoppiamento selezionati, ne dimensiona le zone rossa, gialla e verde a partire dall'utilizzo medio giornaliero e dal tempo di approvvigionamento, e li riforniscono con l'equazione del flusso netto (giacenza disponibile + ordinato − domanda qualificata) [11][12][14]. È progettato per ridurre la dipendenza dalle previsioni e l'instabilità dell'MRP classico; le evidenze indipendenti sui risultati sono ancora limitate.

### Che cos'è l'available to promise?

L'ATP è la parte dell'offerta pianificata che non è ancora impegnata su ordini cliente e può essere promessa a nuovi ordini. Nell'esempio della Sezione 8, un cliente che chiede 100 unità in settimana 2 può ottenerne 60 subito e il resto dalla settimana 4.

### Quali KPI misurano il successo dello S&OP?

Accuratezza della previsione (1 − WMAPE) e bias a livello di famiglia, raggiungimento del piano di offerta, aderenza al MPS, servizio al cliente (OTIF o fill rate), giacenza o arretrato rispetto all'obiettivo, e tasso di chiusura delle decisioni. La Sezione 16 riporta le formule e un esempio svolto.

### Come si calcola l'accuratezza della previsione?

Una formula comune è 1 − WMAPE, dove WMAPE = Σ|previsione − effettivo| / Σ effettivo. Con errori assoluti pari a 1.350 unità su una domanda effettiva di 21.550, il WMAPE è 6,26% e l'accuratezza della previsione è 93,7%. Riportate sempre il bias insieme a questo valore.

### Perché i processi S&OP falliscono?

I motivi più comuni sono la mancata partecipazione della direzione, una previsione che in realtà è un obiettivo commerciale, il mancato coinvolgimento della finanza, un livello di dettaglio eccessivo (SKU invece di famiglie), l'assenza di collegamento con il MPS e l'acquisto di software prima che il processo funzioni. La Sezione 18 elenca le soluzioni.

### Un piccolo produttore può fare S&OP senza software specifico?

Sì. Un'azienda con poche famiglie di prodotti può eseguire S&OP con estrazioni dal ERP, Excel e un registro condiviso delle decisioni. Il software diventa conveniente quando la riconciliazione tra famiglie e SKU, gli scenari o la preparazione dei dati richiedono più tempo delle decisioni stesse.

### Cos'è la nervosità del MRP?

La nervosità è la tendenza dei piani MRP a cambiare frequentemente quando gli input variano leggermente. Nell'esempio della Sezione 12, 30 scrivanie in più hanno modificato gli ordini a due livelli inferiori della distinta base. Le finestre temporali, gli ordini pianificati fermi e le regole sul costo dei cambiamenti ne riducono l'effetto [10].

### Quali sono i vantaggi dell'S&OP?

L'S&OP sostituisce i numeri separati di vendite, produzione e finanza con un unico piano concordato per ciascuna famiglia di prodotti. Le decisioni che spostano costi da una funzione all'altra, come un secondo turno, una produzione anticipata o l'eliminazione di una variante, sono prese da chi è responsabile sia del costo sia del beneficio (Sezione 1). Il MPS e il MRP ricevono un piano già verificato rispetto alla capacità, quindi in seguito serve espedire meno ordini. La finanza vede in anticipo l'effetto sul capitale circolante: nell'esempio illustrativo della Sezione 16, il piano ibrido comporta in media circa 380 scrivanie in meno rispetto al piano a livello costante, pari a circa 13.800 dollari annui di costo di mantenimento. Le percentuali di beneficio pubblicate da fornitori e sondaggi variano molto, quindi misurate la vostra base di partenza prima del primo ciclo.

### Quali sono gli output del MRP?

Per ogni articolo prodotto e acquistato, il MRP genera ricezioni di ordini pianificati e rilasci di ordini pianificati, distribuiti nel tempo e sfalsati in base al lead time [8]. Produce anche messaggi di eccezione per gli ordini aperti (rilascio, anticipo, posticipo, annullamento, scaduto, sotto scorta di sicurezza) e il pegging, che collega ogni fabbisogno al suo articolo padre e all'ordine cliente. La Sezione 10 li mostra tutti e tre con un esempio svolto.

### Qual è la differenza tra MRP e JIT?

Il MRP è un calcolo di pianificazione: esplode il programma di produzione principale attraverso le distinte base e crea ordini datati prima che il fabbisogno si presenti. Il just-in-time (JIT) è un approccio di produzione snella che reintegra in base al consumo effettivo, di solito con segnali kanban, e punta a lotti piccoli e scorte basse. I due non si escludono a vicenda. Molti stabilimenti usano il MRP per i componenti a lungo lead time, costosi e a domanda discontinua, e il kanban per i componenti a rotazione rapida in linea (Sezione 10). La [guida a kanban e sistema pull](https://www.m365.fm/en/learn/kanban-pull-system/) tratta il lato pull.

## Conclusione e primi passi

La pianificazione delle vendite e delle operations (S&OP) e la MRP risolvono lo stesso problema a due livelli diversi. S&OP consente al team di leadership di decidere, una volta al mese, quanto vendere, produrre e stoccare per famiglia di prodotti, e quanto ciò costa. Il programma di produzione principale (MPS) traduce questa decisione in prodotti finiti per settimana, la pianificazione della capacità a grandi linee (RCCP) la verifica rispetto al collo di bottiglia, e la MRP calcola di cosa ogni componente ha bisogno e quando. Ogni livello ha bisogno che quello superiore sia realistico e che quello inferiore sia eseguito. La schedulazione di dettaglio e il reparto produttivo completano la catena.

I metodi sono datati (Orlicky ha formalizzato la MRP nel 1964, Oliver Wight ha dato forma all'S&OP negli anni '80) e restano la spina dorsale della pianificazione ERP [2][3][4]. I loro punti deboli sono noti: capacità infinita, lead time fissi, nervosismo e dipendenza dalla qualità dei dati. Time fence, RCCP, buffer DDMRP e schedulazione finita li affrontano. Gli strumenti di AI possono accelerare le attività di previsione e di analisi degli scenari, ma solo dove processo, dati e diritti decisionali sono già definiti.

**I vostri primi passi nei prossimi 30 giorni**

- [ ] Definire da 5 a 15 famiglie di prodotti e da 3 a 8 risorse chiave con la loro capacità mensile dimostrata
- [ ] Estrarre 24 mesi di spedizioni e ordini per famiglia e misurare l'accuratezza della previsione (1 − WMAPE) e il bias degli ultimi 6 mesi
- [ ] Verificare se la somma del vostro MPS per famiglia corrisponde al piano vendite e produzione attuale
- [ ] Eseguire la vostra MRP e contare gli ordini pianificati scaduti e i messaggi di eccezione per pianificatore; questa è la vostra base di riferimento per il nervosismo
- [ ] Verificare l'accuratezza delle giacenze per i primi 50 articoli per valore e l'accuratezza delle distinte base per i primi 10 prodotti finiti
- [ ] Pianificare il calendario S&OP in cinque fasi per i prossimi 12 mesi e nominare uno sponsor esecutivo e un responsabile di processo
- [ ] Eseguire il primo ciclo su fogli di calcolo con i modelli della Sezione 15 e avviare il registro delle decisioni nella prima riunione esecutiva

---

## Ulteriori letture su m365.fm

**Guide di questo percorso di apprendimento**
- [Schedulazione della produzione e APS](https://www.m365.fm/en/learn/production-scheduling-aps/): schedulazione di dettaglio, punti deboli della MRP, sindrome del lead time, capacità finita
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/): pull, heijunka, kanban come alternativa alla pianificazione push
- [KPI di produzione](https://www.m365.fm/en/learn/manufacturing-kpis/): OEE, consegna puntuale, misure sulle giacenze
- [Digital Twin nella produzione](https://www.m365.fm/en/learn/digital-twin-manufacturing/): test di scenari per le decisioni sulla capacità
- [Azure per la produzione](https://www.m365.fm/en/learn/manufacturing-it-azure/): integrazione con ERP, MES e piattaforma dati
- [Pianificazione della produzione aerospaziale](https://www.m365.fm/en/learn/aerospace-production-planning/): pianificazione in ambienti engineer-to-order e con lunghi lead time
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Teoria dei vincoli](https://www.m365.fm/en/learn/theory-of-constraints/): colli di bottiglia e drum-buffer-rope
- [Kanban e sistemi pull](https://www.m365.fm/en/learn/kanban-pull-system/)
- [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)

**Approfondimenti**
- [Lot sizing: EOQ, EPQ e regole di lot-sizing MRP](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Gestione delle giacenze in produzione e scorta di sicurezza](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)
- [Logistica interna e flusso dei materiali in stabilimento](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Resilienza della supply chain](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/)
- [Simulazione di produzione](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** è il conduttore di m365.fm e lavora presso iFAKT GmbH. Su m365.fm scrive di produzione snella, pianificazione della produzione e trasformazione digitale del manifatturiero, con particolare attenzione a come i processi di pianificazione, i modelli di flusso del valore, la simulazione e l'analisi dei KPI lavorano insieme nella pratica.

**Nota: l'autore lavora presso iFAKT GmbH.**

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
