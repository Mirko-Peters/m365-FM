# SEO metadata

| Field | Value |
|---|---|
| Meta title | Software di value stream mapping: guida + iFAKT Polaris |
| Meta description | Come scegliere un software di value stream mapping: 5 categorie di strumenti, criteri di selezione, checklist e un'analisi documentata di iFAKT Polaris. |
| Slug | `ifakt-polaris` |

# Software per la mappatura del flusso di valore per la manifattura: guida all'acquisto e un'analisi basata su evidenze di iFAKT Polaris

> **Nota: l'autore lavora presso iFAKT GmbH.**

*Aggiornato al 20 novembre 2026 · Ogni affermazione sul prodotto ha una fonte; le affermazioni del fornitore sono contrassegnate come tali.*

> **Risposta breve:** Il software di value stream mapping spazia dagli strumenti di disegno con una libreria di simboli Lean, ai tool VSM dedicati che calcolano le metriche, fino ai sistemi di simulazione e pianificazione. Quale categoria serve dipende dal fatto che si voglia documentare i flussi di valore, valutarli regolarmente con i dati, simularli nel tempo o trasformarli in programmi per il reparto produttivo. Gli strumenti di disegno gratuiti come Lucidchart e Miro, e il template Visio, bastano per i workshop; i tool VSM dedicati si ripagano quando si mappa con regolarità; la simulazione e l'APS sono categorie separate. **iFAKT Polaris** è una piattaforma modulare di iFAKT GmbH (Stoccarda, Germania) con sette moduli: VSM (flussi di valore), BSM (swimlane di processo), Designer (modello prodotto-processo-risorsa), Simulator, Optimizer (pianificazione vincolata), Operator (attività in produzione) e Analyzer (dashboard KPI). Secondo il fornitore, i moduli condividono un unico modello dati [3]. L'autore non conosce test comparativi indipendenti su Polaris. Sono verificabili due schede su Microsoft AppSource [15][16], il secondo posto nella categoria Produzione del Best of Technology Award 2025 del settimanale economico tedesco WirtschaftsWoche per Polaris IMS [18] e una serie di articoli tecnici sulla rivista tedesca di ingegneria ZWF [21][22][23][24].

Chi cerca un software di value stream mapping si scontra subito con un problema di terminologia. Sotto le voci "value stream mapping software" o "value stream management software" i fornitori vendono cose molto diverse: programmi di disegno con una libreria di simboli, strumenti Lean con formule, sistemi di simulazione, piattaforme per team di sviluppo software e sistemi di pianificazione con gemello digitale. Confronti che mescolano queste categorie portano ad acquisti sbagliati. Uno stabilimento che mappa il proprio flusso di valore una volta all'anno in un evento kaizen ha bisogno di qualcosa di diverso rispetto a un produttore ad alta varietà che pianifica ogni settimana con una capacità molto stretta.

Questa guida si articola quindi in due parti. **Parte A** descrive il mercato in modo neutrale: che cosa deve fare un software di value stream mapping, quali categorie esistono, come confrontarle e quali errori sono tipici nella selezione e nell'introduzione. **Parte B** descrive in dettaglio iFAKT Polaris, modulo per modulo, con le prove tratte dalle pagine del fornitore, dal marketplace Microsoft, dalla letteratura tecnica e da una giuria di premiazione, e con una dichiarazione chiara di ciò che non è documentato e di chi il prodotto non è adatto a servire.

Poiché l'autore lavora presso iFAKT GmbH, per questo testo vale una regola semplice: ogni affermazione sul prodotto ha una fonte, le promesse di beneficio del fornitore sono contrassegnate come tali e non trattate come fatti, e la Parte A è scritta in modo da funzionare come strumento di decisione anche se non si legge la Parte B.

### Punti chiave

- **Prima la categoria, poi il prodotto:** strumenti di disegno, tool VSM dedicati, software di simulazione, sistemi APS e MES/BI risolvono problemi diversi. Partire dalla domanda a cui il software deve rispondere.
- **Il disegno raramente è il collo di bottiglia.** Ciò che conta è la connettività dei dati, la logica di calcolo, gli scenari, la capacità di modellare variabilità e mix di prodotti e se l'analisi si traduce in azioni e programmi.
- **Il value stream mapping statico lavora con valori medi.** Variabilità, mix di prodotti e risorse condivise richiedono la simulazione; le date di consegna sotto vincoli richiedono algoritmi di scheduling.
- **Esistono opzioni gratuite** nella categoria dei disegni (Lucidchart, Miro, Creately e altri) e, per due moduli, in iFAKT Polaris [3]. Verificare i limiti di utenti, l'esportazione e la titolarità dei dati.
- **iFAKT Polaris** copre, secondo il fornitore, la catena che va dal value stream mapping alla simulazione e allo scheduling, fino alle attività in produzione e al reporting [3]. Le pagine dei moduli elencano le funzioni, ma non riportano cifre di beneficio con una metodologia dichiarata.
- **Documentati** sono la certificazione ISO 9001 dall'ottobre 2014 [4], una certificazione ISO/IEC 27001 da parte di TÜV SÜD indicata sul sito [1][3], l'hosting di VSM e BSM su Microsoft Azure West Europe (una regione situata nei Paesi Bassi) secondo le pagine dei moduli [6][7][43], due schede su AppSource [15][16] e il premio di WirtschaftsWoche [18].
- **Non documentati** nelle pagine esaminate: una funzione di simulazione all'interno del modulo VSM, l'integrazione nativa con Microsoft Teams o Power BI, una regione di hosting negli Stati Uniti, un report SOC 2 e prezzi pubblici.

## Indice

**Parte A: Cosa deve fare il software di value stream mapping**

1. [Termini: value stream mapping, progettazione dello stato futuro, value stream management](#1-termini-value-stream-mapping-progettazione-dello-stato-futuro-value-stream-management)
2. [Perché carta ed Excel raggiungono i loro limiti](#2-perché-carta-ed-excel-raggiungono-i-loro-limiti)
3. [Le cinque categorie di software per il value stream mapping](#3-le-cinque-categorie-di-software-per-la-value-stream-mapping)
4. [Tabella di confronto delle categorie](#4-tabella-di-confronto-tra-le-categorie)
5. [Come scegliere il software di value stream mapping: criteri in dettaglio](#5-come-scegliere-un-software-di-value-stream-mapping-criteri-in-dettaglio)
6. [Checklist di selezione](#6-checklist-di-selezione)
7. [Introduzione in sei passi](#7-implementazione-in-sei-fasi)
8. [Errori comuni nella selezione e nell'introduzione](#8-errori-comuni-nella-scelta-e-nellimplementazione)
9. [Un business case senza numeri inventati](#9-un-caso-aziendale-senza-numeri-inventati)

**Parte B: iFAKT Polaris in dettaglio**

10. [Contesto e metodo: dalle metriche ai dati degli eventi](#10-contesto-e-metodo)
11. [Principio della piattaforma: un unico modello dati, sette moduli](#11-principio-di-piattaforma-un-modello-dati-sette-moduli)
12. [I moduli uno per uno](#12-i-moduli-uno-per-uno)
13. [Polaris IMS e il Best of Technology Award 2025](#13-polaris-ims-e-il-best-of-technology-award-2025)
14. [Settori secondo l'azienda](#14-settori-secondo-lazienda)
15. [Polaris nell'ecosistema Microsoft](#15-polaris-nellecosistema-microsoft)
16. [Sicurezza, hosting e certificazioni](#16-sicurezza-hosting-e-certificazioni)
17. [Cosa promette il fornitore e come verificarlo](#17-cosa-promette-il-fornitore-e-come-verificarlo)
18. [A chi si adatta Polaris e a chi no](#18-a-chi-si-adatta-polaris-e-a-chi-no)
19. [FAQ](#19-domande-frequenti)
20. [Conclusione](#20-conclusione)

# Parte A: Cosa deve fare il software di value stream mapping

## 1. Termini: value stream mapping, progettazione dello stato futuro, value stream management

**Value stream mapping** (VSM) mostra il flusso di materiali e informazioni di una famiglia di prodotti dal fornitore al cliente, con simboli standardizzati. Sotto ogni casella di processo figurano dati come tempo ciclo, tempo di cambio, disponibilità e turnazione; tra le caselle di processo figurano le scorte, convertite in giorni di copertura. La linea del tempo in basso mostra quale quota del lead time complessivo è a valore aggiunto. Negli Stati Uniti il metodo è strettamente legato a *Learning to See* di Mike Rother e John Shook, pubblicato dal Lean Enterprise Institute, che illustra la mappatura dello stato attuale, la progettazione dello stato futuro e un piano di implementazione per uno stabilimento fittizio, Acme Stamping; il quaderno ha ricevuto lo Shingo Research Prize nel 1999 [41]. Il metodo completo, con simboli, formule ed esempio svolto, è nel compendio di m365.fm [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

**La progettazione dello stato futuro** usa la mappa dello stato attuale per definire un obiettivo: flusso continuo dove possibile; pull tramite supermercati dove il flusso non è possibile; un processo pacemaker che definisce il ritmo; produzione livellata. Solo lo stato futuro e un piano di implementazione trasformano l'analisi in miglioramento. Gli operatori tedeschi usano spesso il termine *Wertstromdesign* per questo passo, dal manuale tedesco standard di Klaus Erlach del Fraunhofer IPA [40].

**Il value stream management** in produzione significa gestire l'attività lungo i flussi di valore in modo continuativo: un responsabile del value stream aggiorna lo stato attuale e futuro, monitora metriche e azioni, e ripete l'analisi quando cambiano il mix di prodotti o la domanda. Dal 2020 esiste uno standard internazionale in merito, la ISO 22468:2020 "Value stream management (VSM)" [39]. Una breve introduzione è il post [What is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/).

**Una distinzione importante:** nello sviluppo software, "value stream management" indica una categoria di prodotti a sé stante. Queste piattaforme misurano il flusso degli elementi di lavoro lungo la pipeline di distribuzione del software, dal ticket al rilascio. Se cerchi "value stream management software" intendendo una fabbrica, fai attenzione: nei risultati di ricerca statunitensi, diversi elenchi mescolano strumenti DevOps come LinearB, Copado o Plutora con strumenti per la produzione [50]. Queste piattaforme non sono progettate per materiali, scorte e macchine. Questa guida tratta esclusivamente i flussi di valore nella produzione e nei processi aziendali che la circondano.

## 2. Perché carta ed Excel raggiungono i loro limiti

La mappatura del flusso del valore è nata come metodo a matita e carta, e per una prima mappa è ancora il modo giusto di procedere. Chi sta sul gemba (il luogo in cui si crea valore, cioè il reparto produttivo) con una matita e conta le scorte capisce il flusso meglio di chi clicca nel software. Tuttavia il metodo cartaceo incontra limiti in quattro situazioni.

**Primo: l'istantanea.** Una mappa classica del flusso del valore mostra un unico momento nel tempo. Presentando il progetto di ricerca tedesco ECOWERT, Markus Böhm del Fraunhofer IPA (un istituto tedesco di ricerca applicata in ingegneria della produzione) ha affermato (traduzione dal tedesco): "In sostanza, la mappatura del flusso del valore non è nient'altro che un'istantanea." Secondo l'istituto, molte aziende la realizzano al massimo una volta all'anno [25]. Quando cambiano il mix di prodotti, la domanda o il modello di turni, la mappa è superata.

**Secondo: medie invece di distribuzioni.** Su carta, ogni riquadro di processo riporta un unico tempo ciclo, non la sua variabilità. Guasti, sequenze di cambio formato e risorse condivise scompaiono nella media. Un fornitore di simulazione descrive la differenza in questo modo: la simulazione del flusso del valore aggiunge alla visione "sequenze dipendenti dal tempo, variabilità e risorse condivise" (traduzione dal tedesco) [37]. Türck, Weimer, Schubert e Drees hanno descritto questo passaggio dall'analisi statica alla simulazione dinamica dei flussi del valore già nel 2014 sulla ZWF, la *Zeitschrift für wirtschaftlichen Fabrikbetrieb*, una rivista tedesca di ingegneria della produzione [22].

**Terzo: varietà di prodotto.** Il metodo considera una sola famiglia di prodotti. Nella produzione ad alta varietà e bassi volumi, invece, molte varianti con cicli di lavorazione diversi attraversano le stesse risorse. Una mappa per ogni variante è poco pratica; una mappa unica per tutte le varianti sfoca i colli di bottiglia.

**Quarto: sforzo di calcolo e versioni.** Takt time, giorni di scorta, lead time e rapporto di flusso si possono calcolare in Excel, ma ogni modifica alla mappa va riportata a mano. Più scenari, più stabilimenti e più redattori producono rapidamente versioni concorrenti dei file.

L'ordine delle conseguenze conta. Il software risolve il primo e il quarto problema con relativa facilità, purché i dati siano disponibili. Solo il software che modella davvero la variabilità e il mix di prodotti risolve il secondo e il terzo. E nessun software sostituisce la discussione di squadra su come dovrebbe apparire lo stato futuro.

## 3. Le cinque categorie di software per la value stream mapping

L'articolo breve di Wikipedia sul software per la value stream mapping distingue due tipi fondamentali: strumenti che aiutano a disegnare la mappa e strumenti che eseguono calcoli e analisi [46]. Per una decisione di acquisto, una suddivisione più fine in cinque categorie è più utile di una classifica di singoli prodotti. Gli esempi seguenti non sono completi né raccomandazioni; mostrano quale tipo di strumento ci si può aspettare in ciascuna categoria. Tutte le affermazioni sui prodotti si basano sulle pagine dei fornitori e sulle schede dei marketplace.

### 3.1 Strumenti di disegno e lavagne collaborative

**Cosa fanno:** Forniscono librerie di simboli per le mappe del flusso del valore e permettono ai team di lavorare insieme nel browser o sul desktop. Microsoft Visio include un modello di mappa del flusso del valore; l'articolo di supporto Microsoft indica che il modello richiede Visio Professional (o la precedente edizione Premium) e non è incluso in Visio Standard, e l'articolo elenca Visio Plan 2 alla voce "Si applica a" [27]. Lucidchart offre una libreria di forme VSM nell'account gratuito [28]; Miro offre un insieme di modelli di mappa del flusso del valore sulla sua lavagna [29]. Creately, EdrawMax, SmartDraw e strumenti simili funzionano allo stesso modo. Anche i modelli Excel e PowerPoint rientrano in questa categoria.

**Punti di forza:** barriera d'ingresso bassa, buona collaborazione, spesso livelli d'ingresso gratuiti, interfaccia familiare.

**Limiti:** di solito non esiste una logica di calcolo dietro i simboli. Le metriche vengono inserite a mano, gli scenari sono copie del disegno e non c'è alcun collegamento dati con ERP o MES.

**Adatti a:** documentazione, formazione, primi workshop kaizen, team distribuiti che necessitano di una visione condivisa.

### 3.2 Strumenti dedicati alla value stream mapping (software VSM con logica di calcolo)

**Cosa fanno:** Combinano i simboli lean con una logica di calcolo. Metriche come i giorni di scorta, il lead time e il rapporto di valore aggiunto vengono calcolate automaticamente dai dati di processo, e gli scenari possono essere confrontati fianco a fianco. Esempi: eVSM, che il fornitore descrive come "un toolkit lean completo per mappare, modellare e migliorare i flussi del valore di ogni tipo" (scheda del marketplace con funzionalità segnalate dagli utenti, come la mappatura di modelli misti e l'importazione da Excel) [42]; SimVSM di SimPlan (Germania), la cui versione base supporta la value stream mapping digitale "incluse le valutazioni statiche" (tradotto dal tedesco) [30] e calcola automaticamente indicatori chiave come tempo ciclo, produttività e scorte [31]; visTable (Germania), che collega flusso del valore e layout di fabbrica in un unico modello e, secondo il fornitore, calcola automaticamente i lead time a partire da dati di processo, tempo ciclo e scorte [32]; e Polaris VSM di iFAKT (vedi Parte B).

**Punti di forza:** meno errori di calcolo, scenari rapidi, versionamento, spesso monitoraggio delle azioni integrato.

**Limiti:** costi di licenza, curva di apprendimento, e il calcolo di solito resta statico: lavora con valori medi, anche quando i dati affluiscono automaticamente.

**Adatti a:** aziende che svolgono regolarmente lavori di value stream e vogliono mantenere confrontabili più flussi del valore o stabilimenti.

### 3.3 Software di simulazione

**Cosa fa:** La simulazione a eventi discreti modella ordini, risorse, buffer, turni e guasti nel tempo. Questo risponde a domande che una mappa statica non può affrontare: dove compare il collo di bottiglia con questo mix di prodotti? Il buffer è sufficientemente grande con questo tasso di guasti? Cosa porta un turno in più? Tra gli strumenti noti figurano Siemens Tecnomatix Plant Simulation, AnyLogic (modellazione multimetodo: basata su agenti, dinamica dei sistemi ed eventi discreti) e FlexSim (eventi discreti con modellazione 3D) [34]. Alcuni fornitori collegano direttamente flusso del valore e simulazione: Siemens offre una libreria VSM per Plant Simulation X con elementi del flusso del valore preconfigurati, confronto di scenari e simulazione dinamica dei flussi del valore che raccoglie metriche come tempo ciclo, lead time, WIP e utilizzo delle risorse [33]; in SimVSM Pro si possono simulare scenari, ad esempio per valutare misure o individuare colli di bottiglia [31].

**Punti di forza:** variabilità, mix di prodotti e risorse condivise diventano visibili; gli investimenti possono essere testati prima di impegnarsi.

**Limiti:** costruire e validare un modello richiede tempo e competenze. I classici progetti di simulazione sono spesso studi una tantum il cui modello non viene mantenuto dopo la decisione.

**Adatti a:** decisioni su investimenti e layout, produzione ad alta varietà, domande sulla capacità con forte incertezza.

### 3.4 Sistemi APS (advanced planning and scheduling)

**Cosa fanno:** I sistemi APS creano pianificazioni dettagliate tenendo conto dei vincoli: capacità di macchine e personale, competenze, sequenze di cambio formato, disponibilità dei materiali e date di consegna. Siemens descrive Opcenter Scheduling come un sistema che crea "production schedules based on availability of resources, constraints and materials required by the order" [36]. Una panoramica dettagliata è nel compendio [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

**Punti di forza:** pianificazioni realistiche ed eseguibili invece di una pianificazione grossolana a capacità infinita; riprogrammazione rapida dopo le interruzioni.

**Limiti:** elevate esigenze di qualità dei dati di base (cicli di lavorazione, tempi, risorse), sforzo di integrazione con ERP e MES, accettazione da parte dei pianificatori.

**Indicato per:** aziende con risorse scarse e condivise, molte varianti e forte pressione sulle consegne.

### 3.5 MES, process mining e BI

**Cosa fanno:** I sistemi MES (manufacturing execution system) registrano i dati effettivi dal reparto produttivo; gli strumenti BI e le analisi basate sui dati li valutano. Alcuni fornitori ricostruiscono automaticamente i flussi di valore a partire da questi dati. ONIQ, offerto tramite il PwC Store in Germania, afferma che i dati di feedback dai sistemi IT di produzione "(e.g., MES, PDA, PPS, IIoT)" possono essere trasferiti in un gemello digitale del flusso di valore "without manual mapping" [35] (PDA è l'acquisizione dei dati di produzione; PPS è il termine tedesco per i sistemi di pianificazione e controllo della produzione).

**Punti di forza:** dati effettivi invece di stime, analisi continua anziché occasionale.

**Limiti:** il risultato è buono solo quanto i dati di feedback; lo stato futuro e le pianificazioni non compaiono automaticamente. Un MES non sostituisce la mappatura del flusso di valore; le fornisce dati.

**Indicato per:** stabilimenti con una buona base di dati che vogliono monitorare con continuità scostamenti e tendenze. Ulteriori informazioni sulle metriche nel compendio [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/); sulle routine quotidiane in reparto nel compendio [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

### 3.6 Piattaforme che coprono più categorie

Alcuni fornitori combinano più di queste categorie in un unico prodotto, ad esempio flusso di valore e layout (visTable [32]), flusso di valore e simulazione (SimVSM Pro [31], libreria VSM di Plant Simulation X [33]) oppure flusso di valore, simulazione, scheduling ed esecuzione (iFAKT Polaris, secondo il fornitore [3]). Il vantaggio è la continuità dei dati: ciò che si rileva durante la mappatura non deve essere reinserito per la simulazione. Lo svantaggio: in ciascuna singola categoria uno strumento specialistico può arrivare più in profondità. Con le piattaforme, verificate ogni categoria separatamente rispetto alle vostre esigenze, invece di considerare l'ampiezza dell'offerta come qualità in sé.

## 4. Tabella di confronto tra le categorie

| Criterio | Disegno/lavagna | Strumento VSM dedicato | Software di simulazione | Sistema APS | MES / process mining / BI |
|---|---|---|---|---|---|
| Domanda principale | Come appare il flusso? | Dove sono gli sprechi e le leve? | Come si comporta il sistema nel tempo? | Chi fa cosa e quando? | Che cosa è realmente successo? |
| Simboli Lean | sì (template) | sì, con logica | in parte (librerie VSM) | no | raramente |
| Metriche automatiche | no | sì (statiche) | sì (dinamiche, come distribuzioni) | metriche di pianificazione (date di consegna, saturazione) | metriche effettive |
| Variabilità e guasti | no | per lo più no | sì | in parte (riprogrammazione) | visibili solo a posteriori |
| Varietà di prodotto | debole | media | buona | buona | buona (dati effettivi) |
| Collegamento a dati ERP/MES | no | opzionale | importazione, di norma per progetto | richiesto | richiesto |
| Output | disegno | mappa con metriche, scenari | valutazione degli scenari | programma eseguibile | report, dashboard |
| Impegno tipico | basso | da basso a medio | da medio ad alto | alto | alto |
| Utenti tipici | coach Lean, team kaizen | responsabili del value stream, ingegneri industriali | ingegneri di simulazione, pianificatori di impianto | pianificatori della produzione, schedulatori | direzione di stabilimento, IT, finanza |

La tabella descrive profili tipici. i singoli prodotti possono differire e alcune piattaforme coprono più colonne. Per la vostra decisione conta quale colonna risponde alla domanda più importante.

### Guida rapida alla decisione

- **Volete documentare i value stream per workshop e formazione** e mapparli al massimo una volta all'anno: di solito basta uno strumento di disegno con un template.
- **Lavorate regolarmente sui value stream**, confrontate più value stream o stabilimenti e volete metriche senza la manutenzione di fogli di calcolo: uno strumento VSM dedicato.
- **I vostri colli di bottiglia si spostano con il mix di prodotti**, oppure dovete giustificare un investimento in macchinari, personale o buffer: simulazione, idealmente su un modello mantenuto dopo lo studio.
- **Il vostro problema sono le date di consegna**, perché molti ordini competono per macchine, attrezzature e competenze scarse: un sistema APS.
- **Non sapete con certezza che cosa accade sul shop floor**, perché le conferme mancano o non sono affidabili: prima la raccolta dei dati (MES, raccolta dati dalle macchine), poi l'analisi.
- **Se più di questi casi si applicano:** valutate piattaforme che collegano più categorie su un unico modello dati e confrontate ciascuna categoria con uno strumento specialistico.

## 5. Come scegliere un software di value stream mapping: criteri in dettaglio

### 5.1 Connessione dati con ERP, MES e reparto produttivo

La domanda più importante è: da dove provengono i dati e con quale frequenza vengono aggiornati? Uno strumento che conosce solo l'inserimento manuale resta una fotografia istantanea. Uno strumento che non può partire senza un'integrazione con l'ERP ritarda qualsiasi beneficio di mesi. Una buona soluzione parte senza integrazione e può acquisire dati in un secondo momento. Chiedete in modo specifico quali formati di importazione supporta (Excel, CSV), quali connettori standard offre per il vostro sistema ERP (SAP, Microsoft Dynamics 365, Epicor, Infor, Oracle o quello che usate), quali interfacce ha verso il MES e la raccolta dati dalle macchine, e se è possibile collegare i dati delle macchine tramite un gateway IIoT (i protocolli comuni sono OPC UA, MTConnect e MQTT). Stabilite anche chi realizza e mantiene l'interfaccia: il fornitore, un partner o il vostro team IT interno.

### 5.2 Logica di calcolo e metriche

Verificate quali metriche calcola lo strumento e se le formule sono visibili. Il takt time (tempo disponibile diviso per la domanda del cliente), i giorni di giacenza, il lead time, il rapporto di valore aggiunto (spesso indicato come process cycle efficiency, PCE), l'OEE e il flow ratio devono essere tracciabili. Metriche e formule personalizzate sono importanti perché ogni stabilimento mantiene le proprie definizioni. Un software i cui risultati nessuno è in grado di ricalcolare perde la prima discussione con la funzione finanza.

### 5.3 Dinamica e simulazione

Questa è la distinzione chiave: lo strumento calcola con valori medi oppure simula le operazioni nel tempo? Molti fornitori chiamano "simulazione" un semplice confronto di scenari, anche quando vengono confrontate solo le metriche statiche di due varianti. Chiedete se la variabilità, i guasti, i modelli di turno, il mix di prodotti e le risorse condivise sono modellati nel tempo, e quali risultati vengono prodotti: medie, distribuzioni, serie temporali di utilizzo. Con input stocastici (guasti, tempi variabili), il software dovrebbe consentire la valutazione di più repliche; una singola esecuzione è solo uno dei possibili esiti, non un risultato affidabile.

### 5.4 Varietà di prodotto e struttura di prodotto

Quando molte varianti girano sulle stesse risorse, il modello richiede distinte base, cicli di lavorazione e assegnazioni delle risorse, non soltanto blocchi di processo. Verificate se lo strumento modella separatamente prodotti, processi e risorse e li collega tra loro (spesso definito modello prodotto-processo-risorsa, in breve PPR) e se tiene conto dei tempi di cambio formato dipendenti dalla sequenza tra le varianti.

### 5.5 Dall'analisi all'esecuzione

Gran parte del valore si crea dopo l'analisi. Chiedete se azioni, schede kaizen, responsabili e scadenze sono gestiti nello stesso strumento, se è possibile documentare un ciclo PDCA e se uno stato futuro può trasformarsi in un programma per il reparto produttivo.

### 5.6 Collaborazione e governance

Ruoli e permessi (lettura, modifica, amministrazione), cronologia delle versioni, multi-tenancy per più stabilimenti o entità giuridiche, modifica simultanea e un registro di audit delle modifiche diventano obbligatori non appena più di un team utilizza lo strumento.

### 5.7 Integrazione con Microsoft

Molti produttori statunitensi utilizzano Microsoft 365 e Microsoft Entra ID (in precedenza Azure Active Directory), e alcuni usano Dynamics 365 come sistema ERP. Le domande rilevanti sono: il software supporta il single sign-on con il vostro provider di identità? Esiste un connettore standard per Dynamics 365, oppure solo un'importazione da file? Le metriche possono essere esportate verso il vostro strumento di BI, come Power BI? La soluzione può essere acquistata tramite Microsoft AppSource o Azure Marketplace? Una scheda su AppSource significa che la soluzione è offerta nel marketplace Microsoft; da sola non dice nulla sulla profondità dell'integrazione.

### 5.8 Hosting, protezione dei dati e sicurezza delle informazioni

I dati di produzione contengono capacità, costi, ordini dei clienti e fornitori. Stabilite dove risiedono i dati (regione, operatore del data center), come vengono separati i tenant e quali certificazioni può mostrare il fornitore. Per gli acquirenti statunitensi, quattro punti meritano di essere approfonditi:

- **Residenza dei dati.** Chiedi per iscritto in quale regione cloud sono ospitati i tuoi dati. Se il fornitore ospita i dati solo nell'UE, verifica che ciò sia compatibile con i contratti con i clienti e con le politiche interne. Se i dati del tuo value stream includono dati tecnici soggetti a ITAR o EAR (comuni nell'aerospaziale e nella difesa), coinvolgi il team di conformità sulle esportazioni prima di caricare tali dati in qualsiasi servizio cloud.
- **Attestazioni.** Molti team di sicurezza statunitensi richiedono un report SOC 2, cioè una verifica secondo i criteri AICPA per i controlli rilevanti in termini di sicurezza, disponibilità, integrità del trattamento, riservatezza o privacy [45]. L'alternativa internazionale è una certificazione ISO/IEC 27001, che attesta un sistema di gestione della sicurezza delle informazioni sottoposto a verifica. Entrambe possono essere accettabili: chiedi il certificato con ambito di applicazione e data di scadenza, oppure il report stesso. Ciò che conta è se lo sviluppo e l'esercizio del software rientrano nell'ambito.
- **Il tuo framework di rischio.** Il NIST Cybersecurity Framework 2.0, pubblicato il 26 febbraio 2024, è pensato per organizzazioni di ogni dimensione e settore e ha aggiunto una funzione "Govern" alle funzioni Identify, Protect, Detect, Respond e Recover [44]. Puoi usarlo per strutturare le tue valutazioni dei fornitori.
- **Normativa UE sulla protezione dei dati.** Con un fornitore europeo incontrerai spesso riferimenti al GDPR, il Regolamento generale sulla protezione dei dati dell'UE, e a un accordo sul trattamento dei dati (DPA). Un DPA ai sensi del GDPR è un contratto che disciplina il modo in cui il fornitore tratta i dati personali per tuo conto; negli strumenti di produzione si tratta soprattutto di account utente e nomi. Non è una certificazione di sicurezza.

### 5.9 Costi, prova e supporto

Chiedi il modello di licenza (per utente, per stabilimento, per modulo), una versione gratuita o una prova, la formazione e l'impegno per l'implementazione, nonché la consulenza del fornitore o di un partner. Per gli acquirenti statunitensi di un fornitore estero, chiedi anche gli orari di supporto nei tuoi fusi orari e se esistono partner di implementazione con sede negli Stati Uniti. Molti fornitori di questo mercato non pubblicano i prezzi; è prassi comune, ma rende più difficile il confronto. Richiedi un preventivo scritto del costo totale su tre anni, integrazione inclusa.

## 6. Checklist di selezione

**Domanda e ambito**
- [ ] La domanda principale è messa per iscritto (documentare, valutare, simulare, schedulare o monitorare).
- [ ] È scelta la categoria corrispondente della Sezione 3.
- [ ] È definita un'area pilota con una famiglia di prodotti e un obiettivo misurabile.

**Dati**
- [ ] Puoi iniziare senza integrazione di sistema.
- [ ] L'importazione da Excel/CSV è stata testata con i tuoi dati.
- [ ] È descritta la connessione al tuo ERP e al tuo MES (connettore standard o progetto).
- [ ] La responsabilità della gestione delle interfacce è stabilita.

**Funzionalità**
- [ ] Metriche e formule sono visibili e adattabili.
- [ ] Gli scenari possono essere versionati e confrontati.
- [ ] Le dinamiche (variabilità, guasti, mix di prodotto) sono modellate, se le necessiti.
- [ ] Varianti, distinte base e sequenze di cambio formato possono essere modellate, se le necessiti.
- [ ] Azioni e PDCA sono tracciati nello strumento.

**Operatività e sicurezza**
- [ ] Regione di hosting e operatore del data center sono confermati per iscritto.
- [ ] È disponibile un report SOC 2 o un certificato ISO/IEC 27001 con ambito.
- [ ] È disponibile un accordo sul trattamento dei dati, ove siano coinvolti dati personali.
- [ ] Le questioni di controllo delle esportazioni (ITAR/EAR) sono chiarite, se rilevanti.
- [ ] Single sign-on e modello dei ruoli sono compatibili con la tua IT.

**Economia**
- [ ] Il costo totale su tre anni, inclusi integrazione e formazione, è noto.
- [ ] Le ipotesi di beneficio sono supportate dai tuoi valori di riferimento (vedi Sezione 9).
- [ ] Hai parlato con un cliente di riferimento del tuo settore.

## 7. Implementazione in sei fasi

**Fase 1: Definire l'obiettivo e l'area pilota.** Scegliere una famiglia di prodotti con un problema evidente, come un lead time elevato o una scarsa puntualità delle consegne, e un obiettivo misurabile. Un pilota esteso contemporaneamente a tutti gli stabilimenti di solito fallisce per problemi di coordinamento.

**Fase 2: Mappare lo stato attuale sul gemba.** Andare sul reparto produttivo, contare le scorte, chiedere i tempi. Il software serve a raccogliere i dati, non a sostituire l'osservazione diretta.

**Fase 3: Arricchire i dati.** Integrare nel sopralluogo i dati provenienti da ERP, MES o dalla raccolta dati delle macchine, inizialmente tramite file. Le differenze tra ciò che si è osservato e ciò che indicano i sistemi sono già un risultato: mostrano dove i dati anagrafici sono errati.

**Fase 4: Sviluppare lo stato futuro e gli scenari.** Definire come team uno stato futuro e confrontare le varianti. Se variabilità e mix di prodotti sono rilevanti, verificare le varianti con una simulazione.

**Fase 5: Implementare e monitorare le azioni.** Trasformare lo stato futuro in azioni con responsabili e scadenze. Se la soluzione copre la pianificazione e l'esecuzione, verificare nell'area pilota che i piani reggano nella pratica del reparto.

**Fase 6: Consolidare ed estendere.** Decidere chi mantiene il flusso del valore, con quale frequenza vengono rivisti gli indicatori e quando l'analisi viene ripetuta. Solo a quel punto ha senso estendere l'approccio ad altri flussi del valore.

## 8. Errori comuni nella scelta e nell'implementazione

- **Lo strumento prima del metodo:** se il team non padroneggia la mappatura del flusso del valore, il software aiuta solo a disegnare più in fretta mappe sbagliate. Formare prima sul metodo.
- **Confondere le categorie:** uno strumento di disegno si acquista quando sul tavolo ci sono domande di schedulazione, un sistema APS quando nessuno conosce ancora il flusso del valore.
- **Scambiare il confronto di scenari per una simulazione:** due mappe statiche affiancate non mostrano i colli di bottiglia che emergono solo a causa della variabilità.
- **Sottovalutare la qualità dei dati:** cicli con tempi non aggiornati producono risultati irrealistici in qualsiasi software. Pianificare il tempo necessario per la pulizia dei dati anagrafici.
- **Forzare l'integrazione troppo presto:** un progetto di interfacce durato mesi prima del primo risultato costa consenso. Iniziare con l'importazione da file.
- **Adottare le cifre sui benefici dei fornitori:** percentuali come "fino al 50 percento di lead time in meno" descrivono casi singoli in condizioni sconosciute. Cifre di questo tipo sono diffuse nel mercato, dalle suite APS agli strumenti VSM (esempi nella Sezione 17). Calcolare con i propri valori di partenza.
- **Nessuno è responsabile del flusso del valore:** senza un responsabile del flusso del valore, la migliore mappa digitale diventa obsoleta proprio come quella di carta marrone.
- **Escludere il reparto produttivo:** programmi e attività che gli operatori non capiscono o non possono confermare restano teorici.

## 9. Un caso aziendale senza numeri inventati

Un caso aziendale credibile per il software di value stream mapping si basa sui vostri valori di riferimento, non su percentuali tratte dalle brochure. La logica può essere suddivisa in cinque leve e tre blocchi di costo.

**Leva 1: scorte e lead time.** Secondo la Legge di Little, in condizioni di regime: lavoro in corso = throughput × lead time. Se riducete il lead time a parità di throughput, riducete le scorte immobilizzate nella stessa proporzione. Calcolate con il vostro WIP attuale, il vostro costo del capitale e un'ipotesi di obiettivo che il team di progetto sia in grado di sostenere.

**Leva 2: puntualità delle consegne.** Le consegne in ritardo comportano penali contrattuali, spedizioni urgenti, ordini express e perdita di fiducia da parte del cliente. Registrate la puntualità delle consegne attuale e il costo direttamente attribuibile agli ordini in ritardo nell'ultimo anno.

**Leva 3: capacità e investimenti evitati.** Se una simulazione dimostra che un apparente collo di bottiglia può essere risolto attraverso il sequenziamento o i buffer, un investimento viene meno. Questa leva è spesso la più rilevante, ma è una tantum e vale solo se l'investimento era effettivamente pianificato.

**Leva 4: sforzo di pianificazione e analisi.** Contate le ore spese oggi per i sopralluoghi di value stream, la manutenzione dei fogli di calcolo e la schedulazione manuale. Valutate i risparmi con prudenza: il tempo liberato è un beneficio solo se viene utilizzato per altro.

**Leva 5: qualità delle decisioni.** Difficile da quantificare ma reale: investimenti sbagliati che non vengono effettuati e decisioni sul mix di prodotti testate in anticipo. Elencate questa leva in modo qualitativo invece di riempirla con numeri inventati.

**Costi:** (1) licenze o abbonamenti per la durata prevista, (2) implementazione, inclusa la preparazione dei dati, le interfacce, la formazione e la consulenza, (3) tempo interno per il pilota, la manutenzione dei dati anagrafici e la gestione continua del value stream.

**Come procedere:** per ciascuna leva, definite un valore di riferimento, un'ipotesi di obiettivo prudenziale e un'ipotesi di obiettivo atteso, e calcolate entrambi gli scenari rispetto ai costi. Il pilota serve a verificare le ipotesi con dati reali. Un fornitore disposto a concordare un pilota con criteri misurabili è più affidabile di uno che indica cifre di beneficio senza una metodologia.

# Parte B: iFAKT Polaris in dettaglio

> **Nota: l'autore lavora presso iFAKT GmbH.**

Le sezioni seguenti descrivono [iFAKT Polaris](https://www.m365.fm/entity/polaris/) sulla base delle pagine di prodotto di [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) (in inglese e in tedesco, consultate il 20 novembre 2026), delle schede di Microsoft AppSource, di un post della Microsoft Tech Community, delle pagine dei premi WirtschaftsWoche e della letteratura tecnica. Laddove un'affermazione proviene solo dal fornitore, il testo lo indica. L'autore non è a conoscenza di test comparativi indipendenti né di valutazioni di analisti su Polaris.

## 10. Contesto e metodo

iFAKT GmbH ha sede in Curiestrasse 2, 70563 Stoccarda, Germania (registro delle imprese: Tribunale di Stoccarda, HRB 22661) [5]. La sua pagina aziendale in inglese afferma che gli uffici si trovano vicino all'aeroporto di Stoccarda [4]. Secondo l'azienda, lavora all'ottimizzazione dei processi produttivi e aziendali da oltre 25 anni [3]. La pagina aziendale elenca come settori l'automotive, l'aerospaziale, l'ingegneria meccanica e la tecnologia medicale [4].

Per giudicare Polaris, la storia dell'azienda conta meno del pensiero metodologico alla base del software. Qui esiste una traccia verificabile: Jörg Drees, indicato con l'affiliazione iFAKT GmbH nell'articolo ZWF del 2023 [24], ha pubblicato diversi articoli con coautori su ZWF tra il 2011 e il 2023, l'ultimo insieme a Fraunhofer IPA. ZWF (*Zeitschrift für wirtschaftlichen Fabrikbetrieb*) è una rivista tecnica in lingua tedesca il cui archivio è oggi ospitato da De Gruyter Brill; i titoli seguenti sono tradotti, mentre i titoli originali in tedesco sono riportati nelle fonti. Gli articoli tracciano un percorso che si ritrova nella struttura modulare di Polaris.

| Anno | Articolo (titolo tradotto) | Autori | Riferimento | Collegamento a Polaris |
|---|---|---|---|---|
| 2011 | Ottimizzazione della produzione attraverso metriche di modellazione del flusso del valore | Jörg Drees, Christoph Sack | ZWF 106 (6), pp. 466–470, DOI 10.3139/104.110589 [21] | calcolo delle metriche nel flusso del valore (VSM) |
| 2014 | Simulazione dinamica dei flussi del valore | Stefan Türck, Andreas Weimer, Lars Schubert, Jörg Drees | ZWF 109 (11), pp. 839–842, DOI 10.3139/104.111242 [22] | passaggio dall'analisi statica alla simulazione |
| 2018 | Nuove prospettive per il metodo del flusso del valore: Value Stream Management 4.0, Next Generation | Jörg Drees | ZWF 113 (9), pp. 605–609, DOI 10.3139/104.111974 [23] | metodo del flusso del valore e software per la produzione connessa (Industria 4.0, IIoT) |
| 2023 | Un'interfaccia dati universale per i servizi digitali di flusso del valore | Markus Böhm, Jörg Drees, Brandon Sai, Klaus Erlach, Steffi Stambera, Tim Teriete | ZWF 118 (5), pp. 293–297, DOI 10.1515/zwf-2023-1062 [24] | dati di evento dalle macchine come base dati comune per i servizi di flusso del valore |

**2011: metriche.** Drees e Sack descrivono come le metriche della modellazione del flusso del valore possano essere usate per ottimizzare la produzione [21]. Questo è il nucleo di uno strumento VSM dedicato: simboli con una logica di calcolo alle spalle.

**2014: dinamica.** Secondo il suo abstract, l'articolo di Türck, Weimer, [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) e [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) parte dalla considerazione che la modellazione del flusso del valore si sta spostando da una visione statica dei flussi e delle metriche verso la simulazione dinamica, e si chiede quali nuove possibilità, incluso il tempo, si aprano per l'ottimizzazione della produzione [22]. Questa idea continua nel modulo Simulator, che però lavora sul modello prodotto-processo-risorsa del Designer anziché sulla mappa del flusso del valore (Sezione 12).

**2018: connettività.** Drees si chiede come il metodo del flusso del valore e il suo software debbano evolvere ora che Industria 4.0 e IIoT collegano le informazioni in tutto lo stabilimento [23].

**2021 -2023: dati in tempo reale con Fraunhofer IPA.** Nel progetto di ricerca ECOWERT (acronimo tedesco di "analisi del flusso del valore in tempo reale per un'ottimizzazione sostenibile della produzione"), Fraunhofer IPA ha collaborato con iFAKT GmbH a un software che interroga e visualizza automaticamente, quasi in tempo reale, i dati di produzione provenienti da sistemi ERP e da altre fonti. Il Land tedesco del Baden-Württemberg ha finanziato il progetto di un anno, concluso il 31 agosto 2022, con circa 300.000 euro dal suo programma Invest BW; ESB Business School della Reutlingen University ha contribuito alla realizzazione di un dimostratore [25]. Un articolo di settore di Drees, Stambera e Böhm descrive il percorso tecnico: dati macchina in formato JSON attraverso un gateway IIoT (cita OPC UA, MTConnect, IO-Link e MQTT; il progetto ha usato MQTT con Sparkplug), un database di serie temporali e il collegamento all'applicazione per il flusso del valore Polaris VSM, che calcola le metriche tramite un albero dei KPI per periodi e famiglie di prodotti selezionati [26]. L'articolo ZWF del 2023 generalizza questo approccio in un'interfaccia dati universale; secondo gli autori, nell'ambito di ECOWERT è stato collegato un servizio di flusso del valore per il calcolo e la visualizzazione delle metriche [24]. Tra gli autori figura Klaus Erlach di Fraunhofer IPA, autore del manuale tedesco standard sulla progettazione dei flussi del valore [40].

**Cosa dimostra questa traccia e cosa non dimostra:** Le pubblicazioni mostrano che gli autori lavorano da tempo su metriche, simulazione e connettività dei dati per i flussi di valore, e che un istituto di ricerca ha collaborato con iFAKT. Non dimostrano che il software attuale sia migliore di altri. Anche Fraunhofer IPA non valuta alcun prodotto nel suo comunicato stampa; descrive un progetto di ricerca e, secondo l'istituto, le applicazioni di allora non facevano "ancora alcun suggerimento" (traduzione dal tedesco) [25].

La mappatura del flusso di valore con dati in tempo reale e un modello dati continuo è anche l'argomento dell'episodio del podcast [Value Stream Mapping with live data and a data model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) su m365.fm.

## 11. Principio di piattaforma: un modello dati, sette moduli

Secondo le FAQ del fornitore, Polaris è una piattaforma software modulare per smart factory che copre l'ottimizzazione della produzione, dalla mappatura del flusso di valore alla simulazione e alla pianificazione supportata dall'IA, fino all'esecuzione in officina e al reporting [3]. Il sito web elenca sette moduli: VSM, BSM, Designer, Simulator, Optimizer, Operator e Analyzer. Secondo il fornitore, tutti i moduli lavorano con lo stesso modello dati, così simulazione o pianificazione possono essere aggiunte in seguito senza raccogliere di nuovo i dati [3]. Il fornitore descrive il flusso come un ciclo: "Map → Simulate → Optimize → Execute → Analyze" [3].

Nella sua home page inglese, iFAKT riassume così l'offerta: "Polaris combines ERP data with a manufacturing digital twin to optimize schedules" [1]. Tra le funzionalità principali elencate figurano "Constraint-based scheduling (resources, skills, shifts, buffers)", "What-if simulation for disruptions and mix changes" e "KPI cockpit: lead time, WIP, utilization, OTD" [1]. La pagina evidenzia tre principi: collegare dati ERP, Excel o dati di officina oppure partire da un modello snello ("plug and play"), un'unica piattaforma per mappatura, simulazione, pianificazione ed esecuzione senza cambiare strumento, e la modellazione di complessità come mix di prodotti, cambi di attrezzaggio, competenze, turni, sequenze di operazioni, buffer e disturbi [1][2].

Per iniziare, le FAQ indicano due percorsi: i moduli VSM e BSM sono disponibili in una versione gratuita senza carta di credito; per Simulator, Optimizer e Operator il fornitore offre una demo personalizzata e una prova [3]. Non è necessario adottare tutti i moduli; secondo il fornitore, molte aziende iniziano con VSM perché non richiede integrazione di sistema [3]. Per simulazione e pianificazione, le FAQ indicano un tempo tipico di avviamento da due a quattro settimane, inclusi integrazione dei dati, configurazione del modello e formazione [3]. Questa durata è un'affermazione del fornitore; nella pratica dipende fortemente dalla qualità dei dati anagrafici e dalle interfacce.

Per comprendere l'architettura, è utile associare i moduli alle categorie della Parte A:

| Modulo | Categoria dalla Parte A | Base dati secondo il fornitore | Output |
|---|---|---|---|
| VSM | strumento dedicato VSM | rilevazione manuale, facoltativamente ERP, MES, raccolta dati macchina, data warehouse [6] | mappa del flusso di valore con metriche, scenari |
| BSM | modellazione di processo (swimlane) | modellazione manuale [7] | mappa di processo con timeline e metriche |
| Designer | modellazione (grafo PPR) | dati ERP, distinte base, tempi di processo, risorse [8] | modello prodotto-processo-risorsa, diagramma di rete |
| Simulator | simulazione | modello PPR dal Designer [9] | utilizzo, colli di bottiglia, scenari nel tempo |
| Optimizer | APS | modello PPR, dati ERP, disponibilità delle risorse [10] | piano di produzione eseguibile |
| Operator | esecuzione in officina | piano dall'Optimizer [11] | attività per operatore, conferme |
| Analyzer | BI / metriche | metriche da tutti i moduli [12] | dashboard, pianificato vs. effettivo |

Per una classificazione come applicazione aziendale nella tassonomia di m365.fm, vedere la pagina dell'entità [Business Application](https://www.m365.fm/entity/business-application/).

## 12. I moduli uno per uno

### 12.1 Polaris VSM: mappatura digitale del flusso del valore

**Scopo:** [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) è il modulo per la mappatura del flusso del valore. Il post di Microsoft sulla scheda AppSource lo descrive come uno "strumento digitale di lean management" che i produttori usano per mappare catene di fornitura e flussi del valore; un sistema di formule e lavagne Kanban e Kaizen servono a calcolare, verificare e visualizzare i KPI, e i team possono collaborare da remoto [17].

**Funzioni secondo la pagina del fornitore** [6][14]:
- importazione da sistemi ERP, MES, raccolta dati dalle macchine e data warehouse tramite il Polaris IIoT Gateway, combinabile con osservazioni manuali sul shop floor
- calcolo automatico di "25+ KPI standard VSM", tra cui lead time, rapporto del valore aggiunto, scorte, OEE e takt time rispetto al cycle time; sono possibili metriche e formule personalizzate
- "50+ simboli Lean predefiniti" con editor e codifica a colori
- tre livelli gerarchici: flusso del valore end-to-end (Livello 1), sottoprocessi (Livello 2), operazioni di dettaglio (Livello 3)
- "creazione illimitata di scenari (A, B, C, D…)", analisi di sensitività e confronto affiancato delle metriche; i flussi del valore possono essere duplicati per testare modifiche senza intervenire sulla produzione
- ruoli Admin, Editor e Viewer in un'architettura multi-tenant, modifica simultanea, cronologia delle versioni, tracciamento delle modifiche e documentazione PDCA delle azioni
- "esportazione multiformato (JPEG, Excel, SVG)" più esportazione cifrata per l'archiviazione
- supporto denominato "AI-Support" nell'area di report e dashboard, senza ulteriori dettagli

**Evidenze al di fuori del sito del fornitore:** scheda AppSource [15][17]; utilizzo come applicazione di flusso del valore collegata a un database di serie temporali nell'articolo di settore sui dati del flusso del valore acquisiti automaticamente [26].

**Affermazioni del fornitore senza metodologia:** "VSM completa in 2-4 ore (contro 2-3 giorni con carta e Excel)", "100% di accuratezza dei dati (nessun errore manuale in Excel)" e una "riduzione del 30-40% del rischio di implementazione" [6]. La pagina del prodotto parla anche di completare i progetti di flusso del valore in un terzo del tempo [14]. Nessuna di queste affermazioni è accompagnata da una metodologia. "100% di accuratezza dei dati" può ragionevolmente riferirsi solo all'eliminazione degli errori di trascrizione, non alla qualità dei dati di input.

**Limiti e ciò che non è documentato:** La pagina VSM descrive scenari e analisi di sensitività ma **nessuna simulazione dinamica** nel senso della Sezione 5.3 [6]. Se si vuole studiare la variabilità, i guasti o il mix di prodotti nel tempo, è necessario il Simulator o un altro strumento di simulazione. La pagina non menziona l'integrazione con Microsoft Teams o Power BI. I prezzi non sono pubblicati; secondo le FAQ, VSM è disponibile in un piano gratuito [3], la cui portata non è descritta nella pagina del modulo.

**Approfondimenti:** compendio [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) · post [Value Stream Management Software for Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)

### 12.2 Polaris BSM: processi aziendali come swimlane

**Scopo:** [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/) (Business Swimlane Modeling) applica la visione del flusso del valore ai processi aziendali come quotazione, ingegneria, ingegneria di produzione o gestione degli ordini (i professionisti lean statunitensi chiamano spesso questo approccio office o transactional value stream mapping). La scheda AppSource lo descrive come uno "strumento digitale di modellazione dei processi aziendali per l'analisi dei processi nel digital lean management" [16].

**Funzioni secondo la pagina del fornitore** [7]:
- pool come contenitori organizzativi, corsie per ruoli, competenze o reparti, che possono essere mostrati o nascosti
- modellazione di oggetti dati, archivi dati e sistemi IT; le interruzioni di flusso tra carta e digitale o tra sistemi diventano visibili
- una timeline con le durate delle attività sul percorso critico più i tempi di attesa e di anticipo
- un grafico di bilanciamento degli operatori (barre impilate delle quote di cycle time) per individuare squilibri
- calcolo automatico di percorso critico, lead time, cycle time e rapporto del valore aggiunto; secondo la pagina, "10+" metriche di processo standard più metriche personalizzate
- classificazione in attività a valore aggiunto o senza valore aggiunto, quantificazione dei costi degli sprechi
- scenari illimitati (attuale, futuro, alternative) con analisi d'impatto
- schede kaizen create durante la modellazione e collegate alle attività, organizzate in cicli PDCA o DMAIC

**Piani secondo AppSource** [16]: P0 "Read Only" (lettura di tutti i contenuti), P1 "Basic" (registrazioni BPMN, modelli a corsie, formule di base, lead time, grafico di bilanciamento, vista di modifica rapida), P2 "Excellence" (tutte le funzionalità di P0 e P1) e P3 "Integrate & Customize" (nessuna descrizione). L'elenco non riporta prezzi.

**Limiti e informazioni non documentate:** La pagina del modulo non indica alcuno standard di notazione; solo l'elenco su AppSource menziona le registrazioni BPMN nel piano P1 [7][16]. Non è documentato se i modelli BSM possano essere importati o esportati in formato conforme a BPMN. La pagina BSM non indica i formati di esportazione. Se si cerca una suite BPM completa con esecuzione dei processi (un motore di workflow), BSM, secondo la sua descrizione, è uno strumento di analisi e miglioramento, non di automazione dei processi.

### 12.3 Polaris Designer: il modello prodotto-processo-risorsa

**Scopo:** Secondo il fornitore, [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) trasforma i dati di input in un grafo di conoscenza strutturato prodotto-processo-risorsa (grafo di conoscenza PPR) che serve da base comune per simulazione e ottimizzazione [8]. È il collegamento tra la vista del flusso del valore e i moduli di simulazione e schedulazione.

**Funzioni secondo la pagina del fornitore** [8]:
- modellazione PPR: prodotto come distinta base di produzione o di progettazione (MBOM/EBOM), processo con tempi di setup, di macchina e di movimentazione, risorse come postazioni, team e zone
- dati di input: dati ERP, distinte base di produzione, tempi di processo, strutture delle risorse e vincoli
- generazione automatica di un diagramma di rete dalla logica di produzione, calcolo del percorso critico
- scenari what-if e confronto tra lead time attuale e ottimizzato
- zone per prodotto che raggruppano i processi per famiglia di prodotto e supportano il bilanciamento della capacità

**Valutazione:** Per il problema delle varianti descritto nella Sezione 5.4, un modello PPR è in genere più adatto di una mappa del flusso del valore, perché le varianti sono rappresentate attraverso le loro distinte base e i loro cicli di lavorazione anziché tramite singole caselle di processo. La home page usa il termine "digital twin" per questo modello [1]; per i diversi significati di "digital twin", vedere il compendio [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/).

**Limiti e informazioni non documentate:** La pagina non indica formati o meccanismi di importazione, né risultati quantitativi né una configurazione esplicita delle varianti (come insiemi di regole per prodotti configurabili) [8]. Resta aperto come siano modellati i vincoli nel grafo.

### 12.4 Polaris Simulator: scenari nel tempo

**Scopo:** Secondo il fornitore, [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) esegue i diagrammi di rete del Designer attraverso modelli configurabili di postazione, linea e capannone (a livello di edificio), per linee singole e multiple [9].

**Funzioni secondo la pagina del fornitore** [9]:
- simulazione basata sulla logica di processo reale del modello PPR
- scenari per capacità, personale e buffer
- analisi di mix di prodotti dinamici su risorse condivise
- individuazione di colli di bottiglia e squilibri di utilizzo nel tempo
- utilizzo temporale di persone e risorse tecniche, sovra- e sotto-utilizzo
- trasparenza della capacità tra turni e scenari
- configurazione flessibile di postazioni e percorsi di produzione

**Valutazione:** Il modulo copre quindi le domande che la Parte A assegna alla categoria della simulazione, in particolare mix di prodotti e risorse condivise. Una citazione di un cliente nella home page (Everllance) recita: "The Polaris simulation helped us identify problems in our planning data" [1]; si tratta di una singola citazione sul sito del fornitore, non di uno studio.

**Limiti e informazioni non documentate:** La pagina non dichiara esplicitamente il tipo di simulazione (ad esempio a eventi discreti), non definisce in dettaglio le metriche di output come throughput o WIP e non fornisce informazioni sugli input stocastici, come le distribuzioni dei guasti [9]. Non viene descritto se i risultati siano riportati come distribuzioni o come valori singoli. Per sistemi a nastro trasportatore, robotica o messa in servizio virtuale, la scelta prevista sono gli strumenti specialistici della Sezione 3.3; Polaris non si descrive come simulatore 3D dei flussi di materiale.

### 12.5 Polaris Optimizer: schedulazione con vincoli

**Scopo:** Secondo il fornitore, [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) trasforma il grafo PPR in un piano di produzione ottimizzato e eseguibile, basato sui dati ERP e sulla disponibilità delle risorse [10]. Corrisponde alla categoria APS.

**Funzioni secondo la pagina del fornitore** [10][13]:
- considerazione di risorse, turni, zone, competenze e capacità; priorità degli ordini definite dai pianificatori
- schedulazione di macchine, operatori e attrezzature
- visualizzazione di ordini in ritardo e rischi di consegna
- dimensionamento dei lotti per variante e macchina, sequenziamento in base ai tempi di cambio tra le varianti
- compromesso tra scorte, costi di magazzinaggio e livello di servizio
- conferme dal reparto produttivo tramite l'Operator, riottimizzazione automatica dopo le perturbazioni con analisi dell'impatto
- risorse condivise tra più progetti
- schedulazione operativa a breve termine e prospettiva di capacità a lungo termine

Secondo le FAQ, Polaris utilizza "algoritmi di ottimizzazione basati sui vincoli" per generare schedulazioni che tengono conto di capacità delle macchine, competenze degli operatori, turni, materiali e date di scadenza [3]. La pagina su pianificazione ed esecuzione menziona inoltre vincoli su più risorse, sequenze di cambio e schedulazione basata sulle priorità; per i test i dati possono essere importati tramite file, Excel o esportazione dell'ERP, mentre in produzione è prevista una sincronizzazione continua con ERP, MES o altri sistemi [13].

**Affermazioni del fornitore senza metodologia:** La pagina di pianificazione cita una riduzione del lead time del 50 percento, un'ottimizzazione della capacità del 40 percento e fino all'80 percento in meno di sforzo di pianificazione manuale [13]; la pagina dell'Optimizer parla di lead time minimo ed efficienza dei costi massima con un clic e di una riduzione considerevole dei tempi di cambio [10]. Non vengono indicati la baseline, il campione né il metodo di misurazione.

**Limiti e ciò che non è documentato:** L'Optimizer viene descritto come supportato dall'IA (la pagina di pianificazione è intitolata "AI-powered production planning and scheduling"), senza citare algoritmi o metodi specifici [10][13]. La pagina del modulo non fornisce dettagli concreti sull'integrazione con l'ERP; le FAQ menzionano interfacce standard verso SAP e Microsoft Dynamics [3]. La pianificazione multi-stabilimento o della catena di fornitura non è descritta. Ulteriore contesto nel compendio [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

### 12.6 Polaris Operator: attività per il reparto produttivo

**Scopo:** Secondo il fornitore, il [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) riceve la schedulazione ottimizzata direttamente dall'Optimizer e la presenta a livello di attività nel reparto produttivo [11].

**Funzioni secondo la pagina del fornitore** [11]:
- una vista individuale e aggiornata delle attività per ogni operatore
- una vista del percorso critico per i capisquadra
- istruzioni di lavoro integrate nelle attività
- sospensione o blocco delle attività, oppure segnalazione con feedback strutturato
- conferme in tempo reale di avanzamento, ritardi, perturbazioni, personale effettivamente presente e pause
- una panoramica in tempo reale del lavoro in corso per i pianificatori
- dati di produzione che alimentano nuovamente la schedulazione

**Valutazione:** L'Operator è progettato come canale di ritorno tra pianificazione ed esecuzione: una schedulazione vale quanto il riscontro sul fatto che abbia retto nel reparto produttivo. Dal punto di vista funzionale si sovrappone in parte a un MES (coda di lavoro, conferme), ma non si presenta come MES.

**Limiti e ciò che non è documentato:** La pagina non indica dispositivi supportati né metriche di prestazione [11]. Il rapporto con un MES esistente (complementare, sostitutivo o in parallelo) non è descritto; va chiarito in una fase precoce del progetto per evitare conferme duplicate. Ulteriori informazioni sulle routine quotidiane del reparto nel compendio [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

### 12.7 Polaris Analyzer: dashboard KPI

**Scopo:** Secondo il fornitore, il [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) raccoglie in dashboard le metriche di tutti i moduli Polaris [12].

**Funzioni secondo la pagina del fornitore** [12]:
- metriche centralizzate per tutti i moduli Polaris
- visualizzazione di lead time, utilizzo, colli di bottiglia e stato dei progetti
- confronto tra scenari, schedulazioni e prestazioni effettive
- individuazione dei limiti di capacità e del potenziale di miglioramento

**Limiti e ciò che non è documentato:** La pagina non indica fonti dati esterne ai moduli Polaris, tipologie di dashboard né collegamenti con strumenti BI esterni come Power BI [12]. Se la vostra azienda utilizza un sistema BI centrale, chiarite come le metriche vi confluiscono. Le definizioni delle metriche sono trattate nel compendio [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/).

### 12.8 Panoramica: cosa è documentato per modulo

| Modulo | Descrizione della funzione su ifakt.de | Evidenze esterne | Cifre sui benefici con metodologia | Domanda aperta più importante |
|---|---|---|---|---|
| VSM | dettagliata [6][14] | AppSource [15], Tech Community [17], articolo di stampa [26] | no | ambito del piano gratuito |
| BSM | dettagliata [7] | AppSource con piani [16] | no | notazione, esportazione |
| Designer | media [8] | articoli di riviste sull'approccio [22][24] (indiretti) | no | formati di importazione, logica delle varianti |
| Simulator | media [9] | premio WirtschaftsWoche per Polaris IMS [18] (indiretto) | no | tipo di simulazione, stocastica |
| Optimizer | dettagliata [10][13] | premio WirtschaftsWoche per Polaris IMS [18] (indiretto) | no (cifre senza metodologia) | algoritmi, integrazione ERP |
| Operator | media [11] | premio WirtschaftsWoche per Polaris IMS [18] (indiretto) | no | dispositivi, confine con il MES |
| Analyzer | breve [12] | nessuna | no | collegamento con BI esterna |

## 13. Polaris IMS e il Best of Technology Award 2025

Oltre ai sette nomi dei moduli, incontrerai il nome **Polaris IMS**. Con questo nome, iFAKT GmbH ha partecipato al Best of Technology Award 2025 di WirtschaftsWoche, un settimanale tedesco di economia. Nella pagina dei vincitori di WirtschaftsWoche, iFAKT con Polaris IMS (descritto lì come sistema di pianificazione della produzione) figura al **secondo posto nella categoria Production**, dietro a Skeleton Technologies e davanti a OMRON Electronics [18]. Gli altri finalisti della categoria erano remberg e UNWARE [19].

La descrizione della giuria (in tedesco) definisce Polaris IMS un sistema intelligente che costruisce un gemello digitale della produzione e pianifica automaticamente l'uso efficiente delle risorse; il piano viene eseguito in produzione e monitorato con dati in tempo reale e, quando si verificano interruzioni, l'IA propone miglioramenti [18][19]. Secondo la valutazione dell'autore, ciò corrisponde funzionalmente all'interazione di Designer, Simulator, Optimizer e Operator. Anche una citazione di un cliente nella home page (Silhouette) usa il nome: "L'uso di Polaris IMS è stato il passo successivo verso la Smart Factory per la nostra organizzazione" [1]. Nella pagina dello sponsor dell'evento Lean Around The Clock 2025, iFAKT si descrive con una "POLARIS suite" composta dai moduli IMS, BSM e VSM [20].

**Interpretazione:** Sulla base di queste fonti, IMS è il nome della parte della piattaforma che va oltre la modellazione del flusso del valore e dei processi, cioè modellazione, simulazione, schedulazione ed esecuzione. Il sito attuale suddivide questa parte in singoli moduli e usa il nome IMS solo nella citazione del cliente [1]. Il fornitore non ha pubblicato una mappatura ufficiale di IMS con gli attuali nomi dei moduli; la mappatura è un'interpretazione dell'autore.

**Cosa dice il premio:** Il Best of Technology Award è un premio della giuria di una testata economica. Dimostra che una giuria ha valutato positivamente il concept tra i partecipanti della categoria Production. Non è un test funzionale o prestazionale e non sostituisce una prova con i propri dati. Per i lettori statunitensi: è un premio di una pubblicazione tedesca assegnato tra i suoi partecipanti, quindi va considerato come un singolo dato, non come un'approvazione di mercato.

## 14. Settori secondo l'azienda

Le seguenti informazioni provengono dal sito web di iFAKT GmbH. Sono autodichiarate; l'ambito e la durata di ciascun rapporto con i clienti non sono indicati.

| Settore secondo ifakt.de | Descrizione sul sito web | Aziende citate (loghi, referenze, citazioni) |
|---|---|---|
| Aerospaziale e aviazione | alta precisione per l'industria aerospaziale [2] | Airbus [1] |
| Automotive e mobilità | produzione just-in-time e just-in-sequence dalla produzione di componenti al montaggio finale [2] | Magna, Vitesco, ZF, Junghans [1] |
| Ingegneria meccanica e automazione | engineer-to-order fino a piccoli lotti, distinte base e produzione a varianti [2] | Karl Dungs, Pfannenberg, Weidmüller, GRASS [1] |
| Energia e infrastrutture | pianificazione della produzione per infrastrutture critiche [2] | MAN Energy, Siemens Energy, Liebherr [1] |

La barra dei loghi sulla home page in inglese mostra inoltre FFG, Fraunhofer, Helbling, Jumo, Liebherr, Pfannenberg, Silhouette, Airbus, Dungs ed Eismann [1]. Le citazioni provengono da Silhouette, Airbus ed Everllance [1], e nella pagina del prodotto VSM anche da Siemens Energy riguardo al coaching di iFAKT [14]. La pagina aziendale elenca inoltre la tecnologia medicale come settore [4]. La FAQ afferma che Polaris è "progettato per aziende manifatturiere in ambito aerospaziale, automotive, ingegneria meccanica ed energia" e indica come utenti previsti i responsabili di produzione, i consulenti Lean e i team operativi [3].

**Cosa si può dedurre:** il focus è sulla produzione discreta e sul montaggio con elevata varietà e prodotti complessi. Per le industrie di processo (chimica, farmaceutica, alimentare con ricette e lotti), il fornitore non cita alcuna referenza. I clienti citati sono per lo più aziende europee o siti europei di gruppi internazionali; le pagine esaminate non citano stabilimenti statunitensi come referenze.

## 15. Polaris nell'ecosistema Microsoft

Per le aziende che si affidano in larga misura a Microsoft, sono documentati i seguenti punti:

- **Schede su AppSource:** Polaris VSM ("Polaris VSM - Digital Value Stream Mapping") e Polaris BSM ("Polaris BSM - Business Swimlane Modeling") sono elencate come soluzioni di iFAKT GmbH su Microsoft AppSource [15][16].
- **Microsoft Tech Community:** l'11 luglio 2024 il blog Marketplace della Tech Community ha pubblicato un post su Polaris VSM nella sezione "ISV Success for Business Applications". Secondo Microsoft, il programma offre "piattaforme, risorse e supporto progettati per aiutare i partner a sviluppare, pubblicare e commercializzare applicazioni business" [17].
- **Hosting:** le pagine dei moduli VSM e BSM riportano "Hosted on Microsoft Azure West Europe" [6][7]. L'elenco delle regioni di Microsoft colloca West Europe nei Paesi Bassi [43]. La FAQ parla in termini più generali di "infrastruttura cloud europea sicura" [3].
- **Integrazione ERP:** secondo la FAQ, Polaris può collegarsi a SAP, Microsoft Dynamics e altre piattaforme ERP tramite interfacce standard, e può importare dati da fogli di calcolo e file CSV [3].
- **Stato di partner:** la pagina aziendale cita lo stato di Microsoft Gold Partner (raggiunto nel 2019) e la competenza "Gold Application Development" per la decima volta consecutiva [4]. Secondo Microsoft, le competenze Gold e Silver potevano essere rinnovate solo fino al 30 settembre 2022; dal 3 ottobre 2022 Microsoft assegna invece le designazioni Solutions Partner [38]. La dichiarazione descrive quindi uno stato storico.

**Non documentato:** l'integrazione nativa con Microsoft Teams, un connettore Power BI, il single sign-on con Microsoft Entra ID o la disponibilità come estensione di Dynamics 365 non sono menzionati nelle pagine esaminate. Una scheda su AppSource significa che è possibile acquistare tramite il marketplace Microsoft, non automaticamente un'integrazione profonda. Se questi aspetti sono importanti per voi, fatevi confermare per iscritto durante la selezione. Ulteriori approfondimenti sull'IT di produzione su Azure sono nel compendio [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/).

## 16. Sicurezza, hosting e certificazioni

| Aspetto | Dichiarazione | Fonte | Stato |
|---|---|---|---|
| ISO 9001 | certificato secondo DIN EN ISO 9001, in vigore da ottobre 2014 | pagina aziendale [4] | dichiarazione del fornitore, documentata sul sito web |
| ISO/IEC 27001 | "TÜV SÜD – ISO 9001 & ISO/IEC 27001 Certified" (badge); FAQ: certificato ISO 27001 e ISO 9001, verificato da TÜV SÜD | homepage, FAQ [1][2][3] | dichiarazione del fornitore; certificato con ambito non consultato pubblicamente |
| Hosting | Microsoft Azure West Europe, situato nei Paesi Bassi (VSM, BSM); "infrastruttura cloud europea sicura" (FAQ) | pagine dei moduli, FAQ, elenco delle regioni Microsoft [3][6][7][43] | dichiarazione del fornitore |
| Crittografia, ruoli, audit | crittografia, controllo degli accessi basato sui ruoli e audit di sicurezza regolari | FAQ [3] | dichiarazione del fornitore |
| Isolamento dei tenant, autenticazione | ambienti tenant isolati, OAuth 2.0 | pagina BSM [7] | dichiarazione del fornitore |
| GDPR | "100% conforme al GDPR" | pagine VSM e BSM [6][7] | dichiarazione del fornitore; la conformità non è una certificazione |
| SOC 2 | non menzionato nelle pagine esaminate | n/d | chiedere al fornitore |
| Regione di hosting statunitense | non menzionata nelle pagine esaminate | n/d | chiedere al fornitore |

**Come leggere questi dati:** Una certificazione ISO/IEC 27001 copre il sistema di gestione di un'organizzazione entro un ambito definito. Durante la selezione, chiedete di visionare il certificato e verificate se lo sviluppo e la gestione di Polaris rientrano nell'ambito e per quanto tempo il certificato è valido. TÜV SÜD è un ente tedesco di prove e certificazione. "Conforme al GDPR" è un'autovalutazione; ciò che conta sono il contratto di trattamento dei dati, l'elenco dei sub-responsabili e le misure tecniche e organizzative. Se il vostro team di sicurezza richiede un rapporto SOC 2 (Sezione 5.8), chiedetelo subito; le pagine esaminate menzionano solo certificazioni ISO. Se avete bisogno di un'installazione nel vostro data center: un'opzione on-premises non è menzionata nelle pagine esaminate; la FAQ cita solo il funzionamento su infrastruttura cloud europea [3]. Per le aziende statunitensi ciò significa anche che, secondo le pagine esaminate, i dati sono ospitati al di fuori degli Stati Uniti; verificatelo rispetto ai contratti con i clienti e, nel settore aerospaziale e della difesa, rispetto alle norme sul controllo delle esportazioni.

## 17. Cosa promette il fornitore e come verificarlo

La homepage elenca come risultati una riduzione del lead time "fino al 50%" (descritta come "diminuzione media del tempo di ciclo produttivo"), un'ottimizzazione della capacità "fino al 40%" ("miglioramento dei tassi di utilizzo delle macchine") e un miglioramento della qualità "fino al 25%" ("riduzione degli scostamenti dal programma e delle scadenze mancate") [1]. La pagina sulla pianificazione cita inoltre fino all'80 percento in meno di lavoro di pianificazione manuale [13]. Per nessuna di queste cifre sono pubblicati il valore di partenza, il numero di progetti o il metodo di misurazione. Si noti la formulazione della homepage: "Fino al 50%" accanto a "Diminuzione media" mescola un massimo con una media, un motivo in più per chiedere come è stato calcolato il dato.

Affermazioni di questo tipo sono comuni in questo mercato. Siemens, ad esempio, cita fino al 50 percento di scorte in meno e fino al 50 percento di miglior rispetto delle consegne puntuali per Opcenter APS [36]. Leggete cifre come queste come un limite superiore derivante da casi individuali, non come un valore atteso, qualunque sia il fornitore che le dichiara.

Come trasformare le promesse in affermazioni verificabili:

1. **Chiedete il calcolo:** quali valori di partenza e obiettivo, su quale periodo, presso quale cliente, con quale definizione di lead time?
2. **Chiedete una chiamata di riferimento** con un utente del vostro settore e del vostro tipo di produzione, idealmente un sito statunitense se per voi è rilevante.
3. **Concordate un pilota con criteri di uscita:** un flusso di valore, i vostri dati, metriche e obiettivi definiti in anticipo.
4. **Confrontate piano ed effettivo** nel pilota: i programmi dell'Optimizer reggono sul reparto produttivo? Con quale frequenza è necessario riprogrammare?
5. **Valutate lo sforzo in modo onesto:** quanto tempo ha richiesto la pulizia dei dati anagrafici e quanto l'interfaccia?

Questi passaggi di test valgono allo stesso modo per ogni fornitore della Parte A.

## 18. A chi si adatta Polaris e a chi no

**In base alla descrizione delle sue funzioni, Polaris merita di essere considerato se**
- gestite produzione discreta o montaggio con molte varianti, distinte base (BOM) e risorse condivise,
- volete collegare mappatura del flusso del valore, simulazione e schedulazione su un modello dati condiviso, invece di spostare dati tra strumenti diversi,
- volete iniziare con la mappatura del flusso del valore senza integrazione di sistemi e aggiungere schedulazione ed esecuzione in un secondo momento,
- volete analizzare processi aziendali al di fuori della produzione (preventivazione, ingegneria, gestione degli ordini) con la stessa logica snella (BSM),
- una soluzione cloud ospitata nell'UE è compatibile con le vostre politiche IT.

**Polaris è probabilmente meno adatto se**
- documentate le mappe del flusso del valore solo occasionalmente; in tal caso uno strumento di disegno con modelli è spesso sufficiente (Sezione 3.1),
- avete bisogno di una simulazione dettagliata 3D dei flussi di materiale con nastri trasportatori, robotica o virtual commissioning; a questo scopo sono pensati strumenti di simulazione specialistici (Sezione 3.3),
- lavorate nell'industria di processo con ricette e lotti, per i quali il fornitore non indica referenze,
- richiedete un'installazione nel vostro data center o in una regione di hosting negli Stati Uniti, nessuna delle quali è descritta nelle pagine esaminate,
- come requisito preliminare vi serve un report SOC 2, che le pagine esaminate non menzionano,
- cercate una pianificazione completa della supply chain o multi-stabilimento, che le pagine dei moduli non descrivono,
- disponete già di un APS e di un MES che rispondono alle vostre esigenze di schedulazione; in tal caso valutate separatamente il valore aggiunto rispetto a uno strumento VSM puro,
- richiedete prezzi pubblici o valutazioni indipendenti di analisti prima di redigere una shortlist.

**Alternative per categoria:** per la sola documentazione, Visio, Lucidchart o Miro [27][28][29]; per flussi del valore con metriche e simulazione opzionale, eVSM [42], SimVSM [30][31] o visTable con contesto di layout [32]; per flussi del valore con simulazione, Plant Simulation X con la libreria VSM [33]; per la ricostruzione dei flussi del valore basata sui dati, ONIQ [35]; per APS, ad esempio Opcenter APS [36]. Si tratta di una selezione di orientamento, non di una classifica.

## 19. Domande frequenti

### Che cos'è un software di value stream mapping?
Il software di value stream mapping supporta in formato digitale la mappatura del flusso del valore e la progettazione dello stato futuro. La gamma va dagli strumenti di disegno con simboli Lean, passando per gli strumenti dedicati con calcolo automatico delle metriche e gestione di scenari, fino alle piattaforme che includono simulazione e pianificazione della produzione (Sezione 3).

### Qual è il miglior software per la mappatura del flusso di valore?
Non esiste un unico strumento migliore, perché le categorie rispondono a domande diverse. Per workshop e documentazione di solito basta uno strumento di disegno con un modello VSM. Per il lavoro regolare sul flusso di valore con metriche è indicato uno strumento VSM dedicato. Per la variabilità e il mix di prodotti serve la simulazione, e per le date di consegna sotto vincoli serve un sistema APS. Usate la guida alle decisioni nella Sezione 4 e la checklist nella Sezione 6, e siate prudenti con le classifiche scritte o finanziate dai fornitori; le due pagine di classifica in lingua inglese più lunghe per questa parola chiave sono una per tipo [47][48].

### Esiste un software gratuito per la mappatura del flusso del valore?
Sì, in diverse categorie. Gli strumenti di disegno e lavagna virtuale come Lucidchart e Miro offrono piani gratuiti di base con forme o modelli VSM [28][29]. In iFAKT Polaris, i moduli VSM e BSM sono disponibili in un piano gratuito senza carta di credito, secondo le FAQ [3]; il fornitore non descrive in dettaglio la portata di tale piano. Con qualsiasi offerta gratuita, verificate i limiti di utenti, le opzioni di esportazione e l'archiviazione dei dati.

### Posso realizzare la mappatura del flusso del valore in Excel o Visio?
Sì. I modelli Excel funzionano per mappe di piccole dimensioni e calcoli semplici, ma ogni modifica va riportata a mano e le versioni si moltiplicano rapidamente (Sezione 2). Microsoft Visio dispone di un modello per la mappa del flusso del valore; secondo Microsoft, richiede Visio Professional (o la precedente edizione Premium) e non è incluso in Visio Standard [27]. Né Excel né Visio simulano la variabilità.

### Qual è la differenza tra software di value stream mapping e software di simulazione?
Il software di value stream mapping di solito effettua calcoli statici con valori medi: giorni di scorta, lead time, rapporto tra tempo a valore aggiunto e tempo totale. Il software di simulazione modella le operazioni nel tempo, includendo variabilità, guasti, mix di prodotti e risorse condivise [22][33][37]. Un semplice confronto affiancato di due mappe non è una simulazione.

### Qual è la differenza tra value stream mapping e process mapping?
Una value stream map segue una famiglia di prodotti lungo l'intero flusso, dal fornitore al cliente, e mostra il flusso dei materiali, il flusso informativo, le scorte e una linea dei tempi di attraversamento (lead time). Una process map (come un diagramma swimlane o un modello BPMN) mostra in dettaglio le fasi, i ruoli e le decisioni di un singolo processo. Le due tecniche possono essere combinate: in Polaris, VSM copre i value stream e BSM copre le process map swimlane [6][7].

### "Value stream management software" è la stessa cosa?
Non sempre. In ambito manifatturiero, value stream management indica la gestione continua lungo i flussi di valore (ISO 22468 [39]). Nello sviluppo software, le piattaforme di "value stream management" misurano il flusso degli work item dal ticket al rilascio. Diverse liste pubblicate negli Stati Uniti mescolano i due significati [50]. Prima di inserire uno strumento in una short list, verifica che gestisca materiali, scorte e macchine.

### Che cos'è iFAKT Polaris?
Una piattaforma software modulare di iFAKT GmbH (Stoccarda, Germania) per l'ottimizzazione della produzione, dalla mappatura del flusso del valore alla simulazione e pianificazione, fino all'esecuzione in reparto e al reporting. Secondo il fornitore, è composta da sette moduli con un modello dati condiviso: VSM, BSM, Designer, Simulator, Optimizer, Operator e Analyzer [3].

### Che cos'è Polaris IMS?
Con il nome Polaris IMS, iFAKT si è classificata al secondo posto nella categoria Production del Best of Technology Award 2025 del settimanale economico tedesco WirtschaftsWoche [18]. La descrizione della giuria cita un gemello digitale della produzione, la pianificazione automatica delle risorse, l'esecuzione in reparto con monitoraggio in tempo reale e proposte basate sull'AI in caso di disturbi [18][19]. Sul sito attuale, questo perimetro è distribuito tra i moduli Designer, Simulator, Optimizer e Operator (Sezione 13; la corrispondenza è un'interpretazione dell'autore).

### Polaris VSM può simulare?
La pagina del modulo Polaris VSM descrive scenari, analisi di sensitività e confronto di metriche, ma non una simulazione dinamica [6]. La simulazione è offerta dal modulo separato Simulator, che lavora sul modello prodotto-processo-risorsa del Designer [9].

### Quali dati servono a Polaris e devo collegare il mio ERP?
Non per VSM e BSM: secondo il fornitore, per iniziare non serve alcuna integrazione di sistema [3]. Simulazione e pianificazione richiedono dati su prodotti, distinte base, tempi di processo e risorse; per i test tramite file, Excel o esportazione dall'ERP, in produzione tramite sincronizzazione continua con ERP, MES o altri sistemi [13]. Secondo le FAQ, esistono interfacce standard verso SAP e Microsoft Dynamics [3].

### Polaris è integrato con Microsoft 365 o Teams?
Sono documentati le schede AppSource per Polaris VSM e BSM [15][16], un post della Microsoft Tech Community [17] e l'hosting di VSM e BSM su Microsoft Azure West Europe secondo le pagine dei moduli [6][7]. Nelle pagine esaminate non si menziona l'integrazione con Teams o Power BI.

### Dove è ospitato Polaris e iFAKT ha la certificazione SOC 2?
Le pagine di VSM e BSM indicano Microsoft Azure West Europe [6][7], una regione situata nei Paesi Bassi [43]; le FAQ parlano di infrastruttura cloud europea [3]. Il sito dichiara la certificazione ISO 9001 (dall'ottobre 2014) e ISO/IEC 27001 rilasciata da TÜV SÜD [1][3][4]. Nelle pagine esaminate non compaiono un report SOC 2 né una regione di hosting negli Stati Uniti. Richiedi i certificati con il relativo perimetro e chiedi esplicitamente della SOC 2 se il tuo team di sicurezza la richiede.

### Quanto dura l'implementazione?
Secondo il fornitore, VSM e BSM non richiedono configurazione; per simulazione e pianificazione, le FAQ indicano un tempo tipico di onboarding di due-quattro settimane, inclusi integrazione dei dati, configurazione del modello e formazione [3]. La durata reale dipende soprattutto dalla qualità dei dati anagrafici e dalle interfacce.

### Quanto costa Polaris?
Il fornitore non pubblica i prezzi. La scheda AppSource di BSM indica piani da "Read Only" a "Integrate & Customize" senza prezzi [16]; per Simulator, Optimizer e Operator, le FAQ offrono una demo con prova gratuita [3].

### Quali sono le alternative a Polaris?
Dipende dalla categoria: strumenti di disegno come Visio, Lucidchart o Miro per la documentazione [27][28][29]; strumenti dedicati come eVSM, SimVSM o visTable [42][30][32]; simulazione con Plant Simulation, AnyLogic o FlexSim [33][34]; approcci data-driven come ONIQ [35]; e sistemi APS come Opcenter APS [36]. La Sezione 4 confronta le categorie.

## 20. Conclusione

Se stai scegliendo un software per la mappatura del flusso del valore, non partire dai nomi dei prodotti, ma dalla domanda a cui il software deve rispondere. Documentazione, valutazione periodica con metriche, simulazione dinamica, pianificazione sotto vincoli e analisi continua dei dati reali sono compiti diversi, affrontati da categorie di software diverse. La checklist di selezione nella Sezione 6 e la logica del business case nella Sezione 9 ti aiutano a rendere le offerte confrontabili senza affidarti alle cifre dei depliant. Per gli acquirenti statunitensi, inserisci presto nell'elenco la regione di hosting, il perimetro della SOC 2 o della ISO/IEC 27001 e, ove pertinente, il controllo delle esportazioni.

iFAKT Polaris è una delle piattaforme che collegano diverse categorie su un modello dati condiviso: analisi del flusso di valore e dei processi (VSM, BSM), modellazione prodotto-processo-risorsa (Designer), simulazione, schedulazione basata sui vincoli (Optimizer), gestione delle attività in reparto (Operator) e reportistica (Analyzer). Ciò che può essere verificato: le descrizioni delle funzioni nelle pagine del fornitore, due inserzioni su AppSource, un post della Microsoft Tech Community, il secondo posto nella categoria Production del Best of Technology Award 2025, la collaborazione di ricerca ECOWERT con Fraunhofer IPA e una serie di articoli della rivista ZWF che coprono dodici anni. Non documentato: cifre sui benefici con metodologia dichiarata, simulazione nel modulo VSM, integrazione con Teams o Power BI, un'area di hosting negli Stati Uniti, un report SOC 2 e prezzi pubblici.

Per i produttori discreti con molte varianti che vogliono passare dal flusso di valore alla schedulazione, Polaris è, sulla base della sua descrizione funzionale, un candidato per un pilota. Per la sola documentazione, la simulazione 3D del flusso dei materiali o per l'industria di processo, altre categorie sono più adatte. In ogni caso: decidere sulla base di un pilota con i propri dati e metriche definite in anticipo, non sulla base di questo o di qualsiasi altro testo.

## Ulteriori letture su m365.fm

**Entità**
- [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) · [Business Application](https://www.m365.fm/entity/business-application/)
- Moduli: [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) · [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/) · [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) · [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) · [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)
- Persone: [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) · [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) · [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Post ed episodi**
- [Value Stream Management Software for Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)
- [What is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/)
- Podcast: [Value Stream Mapping with live data and a data model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Compendi**
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

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** è il conduttore di m365.fm e lavora presso iFAKT GmbH. Su m365.fm scrive di value stream management, pianificazione della produzione e trasformazione digitale della manifattura nell'ecosistema Microsoft.

> **Nota: l'autore lavora presso iFAKT GmbH.**

*iFAKT GmbH ([pagina dell'entità](https://www.m365.fm/entity/ifakt/)) è il fornitore di iFAKT Polaris.*

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
