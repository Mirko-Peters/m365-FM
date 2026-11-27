# SEO metadata

| Field | Value |
|---|---|
| Meta title | Sistema MES e ISA-95: guida a funzioni e livelli |
| Meta description | Cosa fa un sistema MES, come i livelli e i modelli di attività ISA-95 lo inquadrano, MES vs. ERP vs. SCADA, checklist per i fornitori, roadmap e ROI. |
| Slug | `mes-isa-95` |

# Manufacturing Execution System (MES) e ISA-95: funzioni, livelli, selezione e ROI

> **Risposta breve:** Un sistema di esecuzione della produzione (MES, Manufacturing Execution System) è lo strato software che gestisce, monitora e registra in tempo reale l'esecuzione degli ordini di produzione sul piano di fabbrica, collocandosi tra il sistema ERP che pianifica e i sistemi di controllo che fanno funzionare le macchine [8]. ISA-95 (ANSI/ISA-95, a livello internazionale IEC 62264) è lo standard che definisce dove si colloca questo strato (Livello 3, gestione delle operazioni di produzione), quali attività copre e quali informazioni scambia con l'ERP [1][3].

> **Punti chiave**
> - Gartner definisce il MES come software orientato alla produzione che "gestisce, monitora e sincronizza l'esecuzione dei processi fisici in tempo reale" e coordina gli ordini di lavoro con la schedulazione, l'ERP, il PLM e i sistemi di qualità [8].
> - ISA-95 è composto da otto parti. La Parte 1 (modelli e terminologia) è stata ripubblicata nel 2025; la Parte 3 (modelli delle attività) risale al 2013 [1][2].
> - ISA-95 descrive cinque livelli. I Livelli da 0 a 2 riguardano il processo fisico e il suo controllo, il Livello 3 è la gestione delle operazioni di produzione (MES e sistemi correlati), il Livello 4 è la pianificazione aziendale e la logistica (ERP) [1].
> - Il modello di attività della Parte 3 suddivide il Livello 3 in quattro categorie (produzione, manutenzione, test di qualità, magazzino) e ripete le stesse otto attività in ciascuna: gestione delle definizioni, gestione delle risorse, schedulazione di dettaglio, dispatching, gestione dell'esecuzione, raccolta dati, tracciabilità e analisi delle prestazioni [3].
> - Il modello di MESA International del 1997 ha individuato 11 funzioni MES; ISA-95 ha successivamente assorbito quell'impostazione [9][12]. MESA ha cessato le attività il 30 giugno 2026 e i suoi contenuti sono passati a ISA [11].
> - Una unified namespace (UNS) cambia il modo in cui i dati circolano; non sostituisce la logica del MES né il vocabolario di ISA-95.
> - Il business case di un MES di solito regge o cade con una o due voci di beneficio. Nell'esempio svolto qui sotto, lo stesso progetto ha un VAN a cinque anni positivo nello scenario base e negativo in quello prudenziale.
> - Si parte dal modello dei dati e da un singolo flusso di valore, non dall'elenco completo delle funzionalità.

## Indice

1. [Che cos'è un sistema di esecuzione della produzione (MES)?](#cosè-un-sistema-di-esecuzione-della-produzione-mes)
2. [Breve storia: dal AMR e MESA-11 a ISA-95 e oltre](#breve-storia-da-amr-e-mesa-11-a-isa-95-e-oltre)
3. [ISA-95 spiegato: lo standard, le sue parti e i suoi livelli](#isa-95-spiegato-lo-standard-le-sue-parti-e-i-suoi-livelli)
4. [I modelli ISA-95 che contano per un progetto MES](#i-modelli-isa-95-che-contano-per-un-progetto-mes)
5. [MES vs. ERP vs. MOM vs. SCADA e altri sistemi di stabilimento](#mes-vs-erp-vs-mom-vs-scada-e-altri-sistemi-di-stabilimento)
6. [Funzioni del MES in dettaglio](#funzioni-mes-in-dettaglio)
7. [Integrazione: B2MML, OPC UA, MTConnect e la unified namespace](#integrazione-b2mml-opc-ua-mtconnect-e-il-namespace-unificato)
8. [MES nei settori regolamentati](#mes-nei-settori-regolamentati)
9. [Opzioni di distribuzione e architettura: suite, piattaforma, modulo ERP, cloud](#opzioni-di-distribuzione-e-architettura)
10. [Sviluppare internamente vs. acquistare](#costruire-o-acquistare)
11. [Checklist per la selezione del fornitore MES](#checklist-per-la-selezione-del-fornitore-mes)
12. [Roadmap di implementazione del MES](#roadmap-di-implementazione-del-mes)
13. [Costi e ROI del MES con un esempio svolto](#costo-mes-e-roi-con-un-esempio-svolto)
14. [KPI del MES: cosa misurare e come](#kpi-mes-cosa-misurare-e-come)
15. [Persone e reparto produttivo](#persone-e-reparto-produttivo)
16. [Errori comuni nell'implementazione del MES](#errori-comuni-nellimplementazione-di-un-mes)
17. [Limiti del MES e di ISA-95](#limiti-di-mes-e-isa-95)
18. [Glossario](#glossario)
19. [FAQ](#faq)
20. [Conclusioni e primi passi](#conclusione-e-primi-passi)

## Cos'è un sistema di esecuzione della produzione (MES)?

Un sistema di esecuzione della produzione è il software che trasforma un ordine di produzione in merci finite e documentate. L'ERP indica all'impianto *cosa* produrre, in quale quantità e con quale scadenza. Macchine e relativi controllori realizzano i pezzi. L'MES si colloca in mezzo: rilascia e sequenzia il lavoro, indica a operatori e macchine cosa fare successivamente, raccoglie ciò che è realmente accaduto (quantità, tempi, parametri, materiali, difetti, chi ha eseguito l'operazione) e riporta il risultato al sistema.

La definizione di mercato di Gartner è un buon punto di riferimento perché è neutrale rispetto ai fornitori e precisa. Descrive l'MES come "una classe specialistica di software orientato alla produzione" che "gestisce, monitora e sincronizza l'esecuzione dei processi fisici in tempo reale coinvolti nella trasformazione di materie prime in beni intermedi e/o finiti." Aggiunge che questi sistemi coordinano gli ordini di lavoro con la schedulazione della produzione e con i sistemi aziendali come ERP, gestione del ciclo di vita del prodotto e gestione della qualità, e che forniscono un riscontro sulle prestazioni di processo e supportano la tracciabilità e la genealogia fino al livello di componente e materiale [8].

### L'idea centrale in una frase

Un MES chiude il ciclo tra pianificazione e realtà, turno dopo turno, in modo che tutti, dall'operatore al controllore, lavorino sulla stessa registrazione tempestiva di ciò che è accaduto in reparto.

### Cosa fa un MES in un turno tipico

Un esempio concreto aiuta più di un elenco di funzioni. Prendiamo uno stabilimento di medie dimensioni che lavora e assembla valvole idrauliche su quattro linee:

1. **06:00, inizio turno.** L'MES mostra al supervisore l'elenco di lancio per la Linea 2: dodici ordini rilasciati dall'ERP, sequenziati dallo schedulatore per ridurre al minimo i cambi di attrezzaggio. Due ordini sono segnalati perché un calibro è scaduto per la taratura.
2. **06:10.** L'operatore scansiona il cartellino di lavorazione del primo ordine (oppure lo seleziona su un terminale). L'MES verifica che l'operatore sia qualificato per questa operazione, che la versione del programma sul CNC corrisponda al ciclo rilasciato e che il lotto di materia prima nel magazzino appartenga all'ordine. Mostra la revisione corrente delle istruzioni di lavoro.
3. **Dalle 06:12 alle 13:30.** La macchina riporta cicli e stati (in funzione, ferma, allarme) tramite OPC UA o MTConnect. L'MES conta i pezzi buoni e quelli scartati, registra i fermi macchina e chiede all'operatore un codice motivo quando un arresto supera i due minuti. Le misure in processo confluiscono nelle carte SPC; un punto fuori controllo blocca l'operazione successiva finché un tecnico non la autorizza.
4. **11:45.** Un lotto di guarnizioni risulta sospetto. Poiché l'MES ha registrato quale lotto è entrato in quale numero di serie della valvola, la qualità può isolare 140 valvole invece dell'intera produzione della settimana.
5. **14:00, passaggio di consegne.** L'MES riporta al turno successivo quantità, scarti, OEE e problemi aperti, e registra in ERP le quantità confermate e i consumi di materiale.

Senza un MES, gran parte di questo avviene su cartellini cartacei, lavagne e fogli di calcolo, digitati nell'ERP ore o giorni dopo. Questo funziona, entro certi limiti. Il costo emerge sotto forma di dati in ritardo o errati, richiami lenti, fuga di difetti e lunghe indagini. L'approfondimento sulla [produzione senza carta](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/) tratta il passaggio dai cartellini cartacei alle istruzioni di lavoro digitali, che è spesso il primo modulo MES adottato da uno stabilimento.

### Dove si colloca l'MES tra i sistemi di stabilimento

La norma ISA-95 colloca l'MES al **Livello 3**, gestione delle operazioni di produzione, tra la pianificazione aziendale e la logistica del Livello 4 (ERP) e i livelli di controllo dal Livello 0 al 2 (sensori, PLC, DCS, SCADA) [1]. Il Livello 3 non è un sistema unico. Lo stesso livello comprende il sistema di gestione delle informazioni di laboratorio (LIMS), la gestione del magazzino (WMS), la gestione della manutenzione (CMMS) e altri; nel loro insieme sono spesso definiti sistemi di gestione delle operazioni di produzione [14]. La sezione 5 li confronta.

### Vantaggi di un MES e cosa dicono le evidenze

La maggior parte delle pagine sugli MES elenca i vantaggi con percentuali impressionanti e senza fonti. Ecco ciò che si può affermare con prudenza:

| Vantaggio | Meccanismo | Cosa misurare | Avvertenza |
|---|---|---|---|
| Dati di produzione più rapidi e accurati | Dati acquisiti alla fonte, non riscritti a mano | Latenza dei dati, inserimenti manuali per ordine | Solo se i dati master (cicli di lavorazione, distinte base) sono corretti |
| Tempi di ciclo più brevi | Meno attese per la documentazione, rilascio e spedizione più rapidi | Lead time dell'ordine, tempo in coda | *Control Engineering* riporta che MESA International ha stimato in media una riduzione dei tempi di ciclo produttivi del 45 percento; va considerato un'affermazione associativa, non un benchmark [9] |
| Meno fughe di qualità | Controlli imposti, SPC, interblocchi prima della fase successiva | Resa al primo passaggio, reclami dei clienti | Dipende dal fatto che i controlli siano configurati come veri arresti bloccanti |
| Richiami più rapidi e più circoscritti | Genealogia di lotto e numero di serie | Tempo per identificare le unità interessate | Richiede una scansione disciplinata dei materiali |
| OEE più alto sul collo di bottiglia | Motivi di fermo visibili, risposta più rapida | OEE, MTTR | Vale denaro solo se la produzione aggiuntiva può essere venduta |
| Predisposizione agli audit | Registrazioni elettroniche, tracce di audit, firme elettroniche | Ore per audit, rilievi | Lo sforzo di convalida nei settori regolamentati è sostanziale |

Un articolo di *Automation World* del 2006 riportava che più di 40 produttori globali avevano usato ISA-95 per definire i requisiti del loro MES, e che il tempo necessario per definire i requisiti era sceso da diversi mesi a quattro-sei settimane [10]. Si tratta di un effetto modesto e plausibile di un vocabolario condiviso, e un buon motivo per leggere le sezioni successive prima di scrivere un documento dei requisiti.

## Breve storia: da AMR e MESA-11 a ISA-95 e oltre

La storia spiega perché fornitori, analisti e standard usano parole leggermente diverse per la stessa cosa.

### Primi anni Novanta: il termine MES

Secondo *Automation World*, la società di analisi di Boston AMR Research ha definito il concetto di MES nel 1992 come lo strato tra i sistemi aziendali e i sistemi di controllo, che fornisce visibilità e controllo [10]. In precedenza gli stabilimenti usavano sistemi di controllo di reparto, raccolta dati e sistemi di qualità, spesso sviluppati internamente per un solo scopo; le loro funzioni si sovrapponevano e raramente comunicavano tra loro [14].

### 1997: MESA-11

MESA International (Manufacturing Enterprise Solutions Association) ha pubblicato nel 1997 il suo white paper sul MES [15] e con esso il modello funzionale noto come **MESA-11** [12]. Le undici funzioni erano [9]:

1. Allocazione e stato delle risorse
2. Programmazione delle operazioni/di dettaglio
3. Lancio delle unità di produzione
4. Controllo dei documenti
5. Acquisizione dei dati
6. Gestione della manodopera
7. Gestione della qualità
8. Gestione dei processi
9. Gestione della manutenzione
10. Tracciabilità e genealogia dei prodotti
11. Analisi delle prestazioni

La definizione MESA del 1997 sottolineava che un MES dovrebbe "fornire informazioni che consentano l'ottimizzazione delle attività produttive", una formulazione che *Automation World* nel 2006 definiva ancora pratica [10]. Diverse delle undici funzioni (manutenzione, manodopera, controllo dei documenti) sono oggi spesso gestite da sistemi separati, ed è per questo che il modello fu criticato come "troppo ampio" già all'epoca [9].

### 2000-2013: ISA-95

Il comitato ISA95 ha costruito sul Purdue Reference Model per l'integrazione della produzione assistita da computer [1]. La Parte 1 è apparsa nel 2000 e la Parte 3, con i modelli di attività di Livello 3, nel 2005; fonti secondarie descrivono ISA-95 come la fusione della visione funzionale di MESA con la gerarchia Purdue [12][14]. Seguirono altre parti fino al 2020, e la Parte 1 è stata ripubblicata nel 2025 [1][2]. La sezione 3 le elenca.

### Dal 2004 in poi: MOM, MES collaborativo e modelli successivi

Poiché ISA-95 ha denominato il Livello 3 "gestione delle operazioni di produzione", il termine MOM è diventato comune per l'ambito più ampio (produzione più qualità, manutenzione e operazioni di magazzino), con il MES come nucleo produttivo [10]. La stessa MESA ha pubblicato diversi modelli successivi; l'articolo di *Control Engineering* sul modello originale osserva che era uno degli otto modelli MESA dell'epoca [9]. Non siamo riusciti a verificare da una fonte primaria i nomi e gli anni dei modelli MESA successivi (spesso citati come c-MES nel 2004 e il modello MESA del 2008) [unverified: fonte primaria non reperita]. La pagina della storia dei modelli di MESA ora reindirizza a ISA, e l'annuncio MESA del 2022 del suo ultimo modello riferisce soltanto di aver rilasciato "tre (ora quattro) modelli MESA" [43].

### 2026: MESA si scioglie, ISA ne assorbe i contenuti

MESA International ha votato la cessazione delle attività con effetto dal 30 giugno 2026; ISA dichiara che "i contenuti e i programmi formativi di MESA saranno assunti da ISA" [11]. La cosa ha conseguenze pratiche perché MESA manteneva **B2MML**, l'implementazione XML dell'ISA-95 usata in molte interfacce ERP-MES [5]. Prima di specificare gli schemi B2MML in un contratto, verificate con ISA dove saranno ospitati gli schemi e le eventuali versioni future. A novembre 2026 gli schemi B2MML e BatchML risultano ancora pubblicati nel repository MESAInternational su GitHub, il cui README non menziona il passaggio [36] [unverified: l'hosting futuro dopo il passaggio non è documentato].

### Gli anni 2020: IIoT, cloud e MES componibile

Tre tendenze caratterizzano i progetti MES attuali: la raccolta dei dati dalle macchine costa meno (OPC UA, MTConnect, MQTT), il deployment in cloud e ibrido è diventato la norma e i fornitori propongono sempre più spesso il MES come piattaforma di applicazioni più piccole anziché come suite monolitica (MES "componibile" o "di nuova generazione"). La sezione 9 spiega che cosa questo comporta per la vostra architettura e per il contratto.

## ISA-95 spiegato: lo standard, le sue parti e i suoi livelli

ISA descrive l'ISA-95, "noto anche come ANSI/ISA-95 o IEC 62264," come un insieme internazionale di standard per l'integrazione dei sistemi logistici con i sistemi di controllo della produzione [1]. Organizza i processi tecnologici e di business in livelli definiti dalle attività che vi si svolgono e descrive come un'azienda possa costruire interfacce tra tali livelli. ISA sottolinea che l'architettura, basata sul modello Purdue, può essere applicata "indipendentemente dalla tecnologia utilizzata", e che la gerarchia degli equipaggiamenti vale allo stesso modo per le industrie discrete, continue e logistiche [1].

Ne derivano due conseguenze. In primo luogo, l'ISA-95 è **neutrale rispetto alla tecnologia**: non dice nulla su quale database, protocollo o fornitore utilizzate. In secondo luogo, il suo focus principale è l'**interfaccia tra Livello 3 e Livello 4** [1], ed è esattamente lì che la maggior parte dei progetti MES si blocca (chi è responsabile del routing, quando una quantità si considera "confermata", come si registrano gli scarti).

### ISA-95 e IEC 62264: stesso contenuto, numerazione diversa

ISA sviluppa la serie come ANSI/ISA-95; la IEC la pubblica come IEC 62264. L'edizione 2025 della Parte 1 porta la designazione ANSI/ISA-95.00.01-2025 (IEC 62264-1 Mod), dove "Mod" indica un'adozione modificata [1][2]. Le edizioni non sono sempre allineate. IEC 62264-1 e -2 sono state pubblicate nel 2013, la Parte 3 nel 2016, la Parte 4 nel 2015 e la Parte 5 nel 2016 [7]; la IEC 62264-6, il modello di servizio di messaggistica, è apparsa come edizione 1.0 il 26 giugno 2020 [6]. Quando un contratto o un documento di requisiti cita "ISA-95", indicate la parte e l'edizione.

### Le otto parti dell'ISA-95

| Parte | Titolo (ANSI/ISA-95) | Edizione attuale secondo ISA | Ambito in termini semplici |
|---|---|---|---|
| 1 | Modelli e terminologia | 2025 (IEC 62264-1 Mod) | Ambito delle operazioni e del controllo di produzione, organizzazione degli asset fisici, funzioni di interfaccia, informazioni condivise |
| 2 | Oggetti e attributi per l'integrazione tra sistema aziendale e sistema di controllo | 2018 | Oggetti e attributi scambiati all'interfaccia Livello 3 / Livello 4 |
| 3 | Modelli di attività per la gestione delle operazioni di produzione | 2013 | Le attività interne al Livello 3 e alcuni dei dati che scambiano |
| 4 | Oggetti e attributi per l'integrazione della gestione delle operazioni di produzione | 2018 | Modelli di oggetti per le informazioni che fluiscono tra le attività di Livello 3, indipendentemente dal grado di automazione |
| 5 | Transazioni business-to-manufacturing | 2018 | Transazioni tra Livelli 3 e 4 (verbi come get, process, sync) |
| 6 | Modello di servizio di messaggistica | 2014 | Messaggistica tra Livelli 3 e 4 e all'interno del Livello 3 |
| 7 | Modello di servizio alias | 2017 | Mappatura di identificatori equivalenti tra le operazioni di produzione e altri domini |
| 8 | Profili di scambio delle informazioni | 2020 | Profili per interfacce specifiche tra Livelli 4 e 3 o tra attività del Livello 3 |

Fonte: pagina ISA-95 di ISA [1]. Si noti che ISA indica il 2014 per la Parte 6, mentre l'edizione IEC della Parte 6 è del 2020 [6].
Per la maggior parte dei progetti MES, le Parti da 1 a 3 svolgono il lavoro più pesante: forniscono il vocabolario, il modello dei livelli e il modello delle attività necessari per un documento di requisiti. Le Parti 2, 4 e 5 contano quando si progettano interfacce e modelli dati. Le Parti da 6 a 8 interessano soprattutto gli architetti dell'integrazione e i fornitori di software.

### Cosa è cambiato nell'edizione 2025 della Parte 1

ISA ha annunciato la nuova Parte 1 della norma ISA-95 il 10 aprile 2025. Aggiorna la versione del 2010, riflette funzioni aziendali specifiche, chiarisce il confine tra il dominio aziendale e quelli della manifattura e del controllo, e migliora la coerenza con le altre parti [2]. Il presidente del comitato ISA95, Christian Monchinski, l'ha collegata alle "architetture sempre più modulari tra le operazioni aziendali e quelle di produzione" e a un passaggio verso progetti orientati ai dati, e ha affermato che l'aggiornamento "riafferma l'importanza di interfacce di integrazione standardizzate" [2]. Per chi opera sul campo è un segnale: ISA-95 è destinata a restare il vocabolario comune per le architetture modulari e guidate dagli eventi, non a essere sostituita da esse.

### I cinque livelli di ISA-95

ISA-95 eredita il proprio modello a livelli da Purdue. I livelli descrivono *funzioni*, non computer o segmenti di rete [1][4].

| Livello | Nome | Cosa avviene qui (nostra sintesi) | Sistemi tipici | Orizzonte temporale tipico |
|---|---|---|---|---|
| 4 | Pianificazione aziendale e logistica | Ordini, fabbisogni di materiale, scorte, spedizioni, costi di stabilimento | ERP, pianificazione della supply chain | Mesi, settimane, giorni [4] |
| 3 | Gestione delle operazioni di produzione | Controllo del flusso di lavoro e delle ricette per produrre i prodotti finiti; schedulazione di dettaglio, dispatching, registrazioni, qualità, manutenzione e operazioni di magazzino | MES, LIMS, WMS, CMMS, QMS, historian, APS (schedulazione di dettaglio) | Giorni, turni, ore, minuti, secondi [4] |
| 2 | Monitoraggio e controllo supervisionale | Monitoraggio e controllo del processo fisico | SCADA, HMI, DCS, PLC | Risposte in tempo reale misurate in frazioni di secondo [4] |
| 1 | Rilevamento e manipolazione | Sensori, attuatori, dispositivi intelligenti, valvole | Dispositivi di campo | Non specificato nelle fonti qui utilizzate |
| 0 | Processo fisico | I macchinari e il materiale da trasformare | Macchine, linee, apparecchiature di processo | Non applicabile |

Due osservazioni. La pagina ufficiale di ISA colloca SCADA nella riga del Livello 3 come esempio di sistema di Livello 3 accanto al MES [1], mentre la sintesi dell'OPC Foundation assegna automazione e controllo ai Livelli 1 e 2 e il MOM al Livello 3 [4]. In pratica SCADA si estende sul confine tra 2 e 3: le sue schermate e la gestione degli allarmi sono controllo supervisionale (Livello 2), mentre le sue funzioni di historian e di reporting servono spesso il Livello 3. Non discutete sulla casella; decidete quale sistema è il sistema di riferimento per ciascun dato. In secondo luogo, l'OPC Foundation sottolinea che "ogni livello ha una propria definizione di tempo reale" [4]. Un MES che aggiorna una dashboard ogni 30 secondi è in tempo reale per un supervisore, ma troppo lento per un blocco di sicurezza della macchina.

### I livelli non sono zone di rete

Un errore comune è trattare i livelli di ISA-95 e i livelli Purdue usati nella sicurezza OT come se fossero la stessa cosa. ISA-95 descrive funzioni e informazioni; la segmentazione di rete segue una logica diversa, ora definita nella ISA/IEC 62443 con zone e condotti [23]. ISA osserva che ISA-95 si basa sul modello di riferimento Purdue per descrivere la segmentazione di rete nei sistemi di controllo industriali [1], ma una *funzione* di Livello 3 può girare in un tenant cloud, mentre un *server* di Livello 3 nel vostro stabilimento si trova in una specifica zona di sicurezza. La guida [OT cybersecurity and ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) tratta zone, condotti e DMZ; il documento NIST SP 800-82 Rev. 3 è la guida statunitense sulla sicurezza OT [24].

### ISA-95 è ancora rilevante?

La risposta di ISA: i livelli aiutano ancora a descrivere i confini dei sistemi per l'Industria 4.0 e la produzione intelligente, pur essendo nati come una gerarchia [1]. Questo corrisponde alla pratica. La gerarchia come *percorso dei dati* (ogni valore risale livello per livello attraverso interfacce punto a punto) è invecchiata male, e la sezione 7 illustra le alternative. La gerarchia come *mappa di responsabilità e di vocabolario* non lo è.

## I modelli ISA-95 che contano per un progetto MES

ISA-95 contiene diversi modelli. Quattro di essi vale la pena conoscere per nome prima di scrivere un documento di requisiti MES.

### 1. La gerarchia funzionale (livelli)

Trattata sopra. Usala per disegnare un diagramma di contesto del sistema, con ogni sistema esistente collocato al proprio livello e ogni interfaccia rappresentata da una freccia etichettata.

### 2. La gerarchia delle apparecchiature

ISA-95 organizza l'impianto fisico in una gerarchia delle apparecchiature basata sui ruoli: **enterprise, site, area, work center, work unit** (i nomi usati dalle guide divulgative più diffuse e dalla guida sorella su Azure) [1][27]. I work center sono ulteriormente tipizzati, ad esempio come process cell (batch), production unit (continuo), production line (discreto) e storage zone, con work unit corrispondenti come unit, work cell e storage unit. Il modello informativo ISA-95 della OPC Foundation elenca esattamente questi nomi di livello [32], e la bozza pubblica del 1999 della Parte 1 assegna process cell e unit al batch, production unit al continuo, production line e work cell al discreto [33]. La mappatura della OPC Foundation osserva che le apparecchiature possono essere annidate e che il modello descrive i *ruoli* che le apparecchiature svolgono nella produzione, distinti dai beni fisici che le compongono [5].

Perché conta: la gerarchia delle apparecchiature diventa la convenzione di denominazione nel MES, nello storico di processo, nel CMMS, nell'albero dei topic della unified namespace e nella piattaforma dati. Un impianto che chiama la stessa macchina "L2-CNC3", "Line 2 Mazak" e "WC-4711" in tre sistemi lo paga in ogni report e in ogni integrazione.

**Esempio di gerarchia per lo stabilimento di valvole:**

| Livello | Esempio |
|---|---|
| Enterprise | Acme Fluid Power |
| Site | Stabilimento di Dayton |
| Area | Lavorazione meccanica; Assemblaggio e collaudo; Magazzino |
| Work center | Linea 2 (production line); Cella di collaudo T1 (gruppo di work cell); Magazzino materie prime (storage zone) |
| Work unit | CNC 3; Stazione di lavaggio; Tester di tenuta LT-1; Zona scaffali A |

### 3. I modelli a oggetti (Parte 2 e Parte 4)

ISA-95 descrive le informazioni scambiate tra ERP e MES, e tra le attività MES, come modelli a oggetti con attributi. La specifica complementare della OPC Foundation nomina quattro modelli di risorse che i sistemi ERP e MOM si scambiano: **material** (comprese proprietà del materiale e lotti), **equipment** (per quanto riguarda le operazioni eseguite), **physical assets** (i beni che compongono l'apparecchiatura) e **personnel** (ruoli e qualifiche) [4][5]. Attorno a essi, ISA-95 organizza lo scambio in quattro categorie informative che rispecchiano il ciclo di vita di un ordine: **product definition** (come produrlo), **production capability** (quali risorse sono disponibili), **production schedule** (cosa produrre e quando) e **production performance** (cosa è stato prodotto). Le categorie corrispondono ai nomi delle attività della Parte 3 [3]; la bozza pubblica del 1999 della Parte 1 raggruppa schedule e performance sotto "production information" [33].

Una regola pratica da questo modello: l'ERP è responsabile del "cosa e quando", il MES del "come e cosa è realmente accaduto". Quando l'ERP contiene un ciclo con tempi operativi e il MES contiene una definizione di lavoro più dettagliata, con parametri e istruzioni, decidete esplicitamente quale dei due è il master per quale attributo e come fluiscono le modifiche.

### 4. Il modello delle attività (Parte 3)

Questa è la parte più utile e meno spiegata di ISA-95. La Parte 3 divide la gestione delle operazioni di produzione in quattro categorie: **production operations, maintenance operations, quality test operations e inventory operations**. All'interno di ciascuna, utilizza le stesse otto attività generiche [3]:

| Attività generica | Operazioni di produzione | Operazioni di manutenzione | Operazioni di test di qualità | Operazioni di magazzino |
|---|---|---|---|---|
| Gestione delle definizioni | Gestione delle definizioni di prodotto (cicli di lavorazione, ricette, istruzioni di lavoro) | Gestione delle definizioni di manutenzione (liste di attività, procedure) | Gestione delle definizioni dei test di qualità (specifiche di prova, piani di campionamento) | Gestione delle definizioni di magazzino (regole di stoccaggio e trasferimento) |
| Gestione delle risorse | Gestione delle risorse di produzione (persone, attrezzature, disponibilità e qualifica di materiali) | Gestione delle risorse di manutenzione (tecnici, ricambi, utensili) | Gestione delle risorse per i test di qualità (attrezzature di laboratorio, analisti) | Gestione delle risorse di magazzino (ubicazioni di stoccaggio, attrezzature di movimentazione) |
| Schedulazione di dettaglio | Schedulazione di dettaglio della produzione (sequenza sulle risorse) | Schedulazione di dettaglio della manutenzione | Schedulazione di dettaglio dei test di qualità | Schedulazione di dettaglio del magazzino (movimenti, rifornimenti) |
| Dispatching | Dispatching della produzione (rilascio del lavoro alle postazioni) | Dispatching della manutenzione (ordini di lavoro ai tecnici) | Dispatching dei test di qualità (campioni al laboratorio) | Dispatching del magazzino (ordini di trasferimento) |
| Gestione dell'esecuzione | Gestione dell'esecuzione della produzione (guida e verifica dell'esecuzione) | Gestione dell'esecuzione della manutenzione | Gestione dell'esecuzione dei test di qualità | Gestione dell'esecuzione del magazzino |
| Raccolta dati | Raccolta dati di produzione (conteggi, tempi, parametri) | Raccolta dati di manutenzione (rilievi, ore, parti) | Raccolta dati dei test di qualità (risultati) | Raccolta dati di magazzino (movimenti, inventari) |
| Tracciabilità | Tracciabilità della produzione (WIP, genealogia, reporting verso l'ERP) | Tracciabilità della manutenzione (storico per asset) | Tracciabilità dei test di qualità (risultati per lotto o matricola) | Tracciabilità del magazzino (ubicazione e stato del materiale) |
| Analisi delle prestazioni | Analisi delle prestazioni della produzione (OEE, resa, tempo ciclo) | Analisi delle prestazioni della manutenzione (MTBF, MTTR) | Analisi delle prestazioni dei test di qualità (capacità, trend) | Analisi delle prestazioni del magazzino (rotazioni, accuratezza) |

I nomi di righe e colonne seguono i titoli dei capitoli dell'ANSI/ISA-95.00.03-2013 (capitoli da 6 a 9) [3]; gli esempi tra parentesi sono nostri. *Automation World* ha riassunto la stessa suddivisione come "produzione, manutenzione, qualità e magazzino" [13].

**Come usare la matrice in un progetto:** Stampatela come griglia 4 × 8. Per ciascuna delle 32 celle, scrivete quale sistema svolge oggi questa attività (carta, Excel, ERP, MES, CMMS, LIMS, WMS, nessuno) e quale sistema dovrebbe svolgerla dopo il progetto. Le celle vuote e quelle con tre sistemi sono il punto di partenza della discussione sull'ambito. Un risultato tipico per uno stabilimento discreto: nella colonna produzione prevale il MES, nella colonna manutenzione il CMMS, i test di qualità si dividono tra MES (controlli in processo) e LIMS o QMS (prove di laboratorio, CAPA), il magazzino si divide tra ERP (livelli di scorta) e WMS o MES (movimenti verso la linea). La schedulazione di dettaglio nella colonna produzione è spesso affidata a un APS (vedi [schedulazione della produzione e APS](https://www.m365.fm/en/learn/production-scheduling-aps/)).

### Nota su ISA-88 e VDI 5600

Due framework correlati compaiono nei progetti MES. **ISA-88** è lo standard per il controllo dei processi batch; il suo modello di controllo procedurale (procedure, procedure di unità, operazioni, fasi) è stato adottato dalla IEC come IEC 61512-1 [34] ed è il modo abituale per strutturare le ricette nel farmaceutico, nel food e nella chimica. BatchML, il complemento di B2MML, implementa ISA-88 [36], e molti prodotti MES implementano batch record elettronici su questa base [unverified: osservazione di prassi]. **VDI 5600**, una linea guida dell'Associazione degli ingegneri tedeschi (Parte 1 datata ottobre 2016), elenca i compiti del MES in modo simile a MESA-11 ed è diffusa negli stabilimenti tedeschi e nelle RFP delle capogruppo tedesche [21].

## MES vs. ERP vs. MOM vs. SCADA e altri sistemi di stabilimento

"Qual è la differenza tra MES ed ERP?" è una delle domande più frequenti sul MES, seguita da MES vs. SCADA. La versione breve: l'ERP pianifica e contabilizza, il MES esegue e registra, lo SCADA supervisiona e controlla le macchine. La versione più lunga richiede una tabella, perché i confini dipendono dal settore e dai prodotti già in uso.

### Tabella di confronto

| Dimensione | ERP (Livello 4) | MES (Livello 3) | MOM (Livello 3, più ampio) | SCADA / HMI (Livello 2, in parte 3) | Historian |
|---|---|---|---|---|---|
| Domanda principale | Cosa dobbiamo produrre, acquistare e spedire, e quanto è costato? | Come viene esattamente realizzato questo ordine, e cosa è effettivamente successo? | Come lavorano insieme produzione, qualità, manutenzione e magazzino? | Cosa sta facendo ora la macchina o il processo, e come lo controllo? | Quali sono stati nel tempo i valori di processo? |
| Orizzonte temporale | Mesi, settimane, giorni [4] | Turni, ore, minuti, secondi [4] | Come il MES | Da sub-secondi a secondi [4] | Da secondi a anni |
| Unità di lavoro | Ordine di produzione, ordine d'acquisto, ordine di vendita | Operazione, fase, lotto, numero di serie | Ordine più test, ordine di lavoro di manutenzione, ordine di trasferimento | Tag, allarme, setpoint | Tag di serie temporale |
| Dati tipici | Distinta base, ciclo di lavorazione, costo standard, scorte, domanda | Istruzioni di lavoro, tempi e quantità effettivi, parametri, genealogia, difetti, approvazioni | Dati MES più risultati di laboratorio, storico di manutenzione, movimenti di materiale | Valori live, allarmi, comandi operatore | Serie temporali compresse |
| Utenti | Pianificazione, acquisti, finanza, vendite | Operatori, supervisori, qualità, ingegneri di processo | Direzione di stabilimento, tutte le funzioni operative | Operatori di sala controllo, tecnici di manutenzione | Ingegneri, analisti |
| Fonte di verità per | Registrazioni contabili, valore delle scorte, domanda | Registro as-built, storico di esecuzione | Registrazioni operative nelle diverse categorie | Stati di controllo e allarmi | Storico di processo |
| Guasto tipico se usato impropriamente | Conferme da officina digitate con giorni di ritardo | Usato come strumento di pianificazione o come semplice deposito di dati senza logica di processo | Perimetro così ampio che nulla va in produzione | Usato come sistema di gestione degli ordini | Trattato come sistema di riferimento per le quantità |

MOM è il nome ISA-95 dell'intero Livello 3; il MES è generalmente inteso come suo nucleo produttivo [10][14]. Molti fornitori vendono "suite MOM" che includono moduli di qualità e manutenzione. Che lo si chiami MES o MOM conta meno del fatto che ogni cella della matrice delle attività della sezione 4 abbia un unico responsabile.

### Altri sistemi di Livello 3 e dove di solito passa il confine con il MES

| Sistema | Funzione principale | Confine tipico con il MES |
|---|---|---|
| QMS (sistema di gestione della qualità) | Non conformità, CAPA, audit, controllo documentale, qualità dei fornitori | Il MES acquisisce i risultati in processo e i blocchi; il QMS gestisce l'indagine e l'azione correttiva. Integrazione: non conformità creata nel MES, gestita nel QMS |
| LIMS (gestione delle informazioni di laboratorio) | Campioni, prove di laboratorio, specifiche, certificati di analisi | Il MES richiede campioni e riceve le decisioni di rilascio; il LIMS è proprietario del registro delle prove |
| CMMS / EAM | Ordini di lavoro di manutenzione, ricambi, storico degli asset | Il MES riporta stati e contatori delle macchine; il CMMS pianifica la manutenzione. Gli ID asset condivisi sono essenziali |
| WMS | Stoccaggio, prelievo, movimenti di magazzino | Il MES richiede il materiale alla linea e conferma il consumo; il WMS esegue i movimenti |
| APS | Pianificazione e sequenziamento a capacità finita | L'APS produce la sequenza; il MES la lancia e riporta i consuntivi. Alcuni prodotti MES includono un modulo APS |
| PLM | Progettazione del prodotto, distinta base di ingegneria, gestione delle modifiche | Il PLM rilascia la definizione di ingegneria; il MES utilizza la definizione di fabbricazione (spesso tramite ERP o uno strumento di pianificazione del processo produttivo) |
| Piattaforma dati / analytics | Analisi multi-stabilimento, IA, archiviazione a lungo termine | Il MES è una fonte; non dovrebbe diventare il data lake aziendale. Vedi [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) |

### SAP è un MES? L'ERP è sufficiente?

I fornitori ERP offrono funzioni di esecuzione della produzione, sia all'interno dell'ERP (conferme da officina, liste di lancio semplici) sia come prodotti separati. SAP, ad esempio, descrive SAP Digital Manufacturing come una piattaforma cloud di gestione delle operazioni di produzione (MOM) e invita i clienti del suo precedente SAP Manufacturing Execution a passare ad essa (descrizione del fornitore) [35]. Se l'ERP da solo sia sufficiente dipende da quattro domande:

1. **Granularità:** Serve registrare per operazione e per ordine, oppure per fase, numero di serie e parametro?
2. **Latenza:** La conferma a fine turno è sufficiente, oppure le decisioni dipendono da minuti?
3. **Applicazione:** Il sistema deve *impedire* un passo sbagliato (materiale errato, operatore non qualificato, controllo mancante), oppure deve solo registrarlo?
4. **Normativa:** Servono registri di lotto elettronici o registri storici dei dispositivi con tracce di audit e firme elettroniche?

**Segnali che indicano di aver superato l'esecuzione basata solo su ERP:** conferme inserite con più di un turno di ritardo; più di un foglio di calcolo ombra per area; un cliente o un ente regolatore che chiede tracciabilità che si riesce a ricostruire solo in diversi giorni; fughe di qualità causate da revisioni o materiali errati; supervisori che passano la prima ora di ogni turno a raccogliere dati.

Se tutte e quattro le risposte sono "grossolana, a fine turno, solo registrazione, no", il controllo della produzione in ERP insieme a una buona disciplina può bastare, soprattutto per gli stabilimenti piccoli. Se due o più risposte vanno nella direzione opposta, servono funzioni MES, che si ottengano dal fornitore dell'ERP, da un fornitore MES o da una piattaforma.

## Funzioni MES in dettaglio

Le funzioni seguenti seguono la colonna della produzione del modello delle attività ISA-95 [3], integrato dalle funzioni MESA-11 che la maggior parte dei prodotti copre ancora [9]. Per ciascuna: cosa fa, di cosa ha bisogno e come tipicamente fallisce.

### 1. Gestione della definizione di prodotto (definizioni di lavoro, cicli di lavorazione, ricette)

**Cosa fa:** Mantiene la definizione produttiva di ciascun prodotto: operazioni, fasi, parametri, materiali richiesti, attrezzi, competenze, istruzioni di lavoro e controlli. Nelle industrie di processo questa è la ricetta master.

**Di cosa ha bisogno:** Una chiara suddivisione dei dati master tra ERP e PLM, un controllo delle versioni e un processo di modifica ingegneristica che arrivi in produzione prima dell'avvio del successivo ordine.

**Tipico punto di fallimento:** Due master. Il ciclo ERP prevede 12 operazioni, il MES ne prevede 14, e nessuno sa quali tempi siano usati per il costing.

### 2. Gestione delle risorse (persone, impianti, materiali)

**Cosa fa:** Conosce quali risorse sono disponibili e qualificate: stato delle macchine, vita utile degli utensili, formazione e certificazione degli operatori, lotti di materiale disponibili in linea.

**Di cosa ha bisogno:** Registrazioni di formazione (spesso dalle risorse umane o da un sistema di apprendimento), stato degli impianti dal CMMS e dai sistemi di controllo, stato dei materiali dall'ERP o dal WMS.

**Tipico punto di fallimento:** Il MES blocca un operatore perché la registrazione della formazione nelle risorse umane è in ritardo di tre mesi. Definite il processo di aggiornamento delle qualifiche prima di attivare un'applicazione rigorosa. L'approfondimento sulle [competenze della forza lavoro manifatturiera](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/) tratta le matrici delle competenze.

### 3. Schedulazione di dettaglio

**Cosa fa:** Trasforma gli ordini rilasciati in una sequenza per risorsa, rispettando capacità, cambi formato, disponibilità dei materiali e date di consegna. MESA-11 la chiama schedulazione operativa/di dettaglio [9].

**Di cosa ha bisogno:** Tempi di lavorazione e di cambio formato accurati, calendari reali delle risorse e avanzamento effettivo rilevato in produzione.

**Tipico punto di fallimento:** Una "schedulazione" che in realtà è la lista di lancio dell'ERP ordinata per data di consegna. Se la schedulazione è un vincolo reale nel vostro stabilimento, confrontate il modulo MES con un APS autonomo.

### 4. Lancio e dispacciamento

**Cosa fa:** Rilascia il lavoro successivo a un centro di lavoro o a un operatore nel momento giusto, con tutta la documentazione e i materiali pronti. MESA-11: dispacciamento delle unità produttive [9].

**Tipico punto di fallimento:** Liste di dispacciamento che gli operatori ignorano perché non riflettono la realtà (materiale mancante, macchina ferma). La soluzione è chiudere il ciclo: il dispacciamento deve usare lo stato delle risorse in tempo reale.

### 5. Gestione dell'esecuzione e istruzioni di lavoro

**Cosa fa:** Guida l'operatore o la macchina attraverso le fasi, impone la sequenza e i controlli, raccoglie le approvazioni e arresta il processo quando una condizione richiesta non è soddisfatta. È qui che un MES si differenzia maggiormente da uno strumento di reportistica.

**Di cosa ha bisogno:** Istruzioni di lavoro ben scritte e visive; decisioni su quali controlli siano blocchi rigidi e quali avvisi; terminali o tablet nella postazione.

**Limite di sicurezza:** Le funzioni di sicurezza (protezioni, arresti di emergenza, interblocchi di sicurezza) appartengono ai sistemi di controllo certificati ai Livelli 1 e 2, mai al MES. Il MES può bloccare il *passo successivo dell'ordine*; non deve essere l'unico elemento che tutela le persone.

**Errore tipico:** digitalizzare una procedura cartacea di 40 pagine una per una. Riscrivete le istruzioni per lo schermo, testatele con gli operatori e mantenetele brevi. Vedi [standard work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) e [paperless manufacturing](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/).

### 6. Raccolta dati (data acquisition)

**Cosa fa:** Acquisisce quantità, tempi, stati, parametri e misure, automaticamente dalle macchine dove possibile e manualmente dove non lo è.

**Cosa richiede:** Connettività delle macchine (OPC UA, MTConnect, protocolli dei costruttori, oppure semplice I/O per contatori e stati), un modello dei tempi (cosa conta come fermo pianificato) e liste di codici di causa che gli operatori possano effettivamente usare.

**Errore tipico:** 120 codici di causa per i fermi. Gli operatori scelgono il primo della lista. Iniziate con otto-quindici codici per area e affinateli insieme alle persone che li usano.

### 7. Gestione della qualità in esecuzione

**Cosa fa:** Ispezioni in processo, SPC, piani di campionamento, blocchi e rilasci, registrazione delle non conformità, collegamenti al QMS per le indagini.

**Cosa richiede:** Piani di controllo e caratteristiche dall'ingegneria della qualità (nell'automotive, il PFMEA e il piano di controllo), integrazione degli strumenti di misura, regole per ciò che accade in caso di controllo non superato.

**Errore tipico:** Risultati di ispezione raccolti ma mai usati per fermare il processo. Un controllo che non può fermare la linea è una registrazione, non un controllo. Il lavoro sulle cause radice appartiene al sistema qualità; vedi [Six Sigma and root cause analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).

### 8. Tracciabilità, rintracciabilità e genealogia

**Cosa fa:** Traccia il lavoro in corso e costruisce la registrazione dell'as-built: quali lotti di materiale e componenti, da quali fornitori, sono entrati in quali numeri di serie o lotti, lavorati su quali attrezzature con quali parametri e da chi. MESA-11: tracciamento del prodotto e genealogia [9].

**Cosa richiede:** Identificazione univoca (codici a barre, codici 2D, RFID), scansioni rigorose in ogni punto di consumo del materiale, una regola chiara per i materiali sfusi (a livello di lotto o di numero di serie).

**Errore tipico:** Genealogia ricostruita a posteriori dai documenti di spedizione. Deve essere acquisita nel processo. Un test semplice: prendete un numero di serie finito a caso e chiedete quanto tempo serve per elencare tutti i lotti dei componenti. Poi invertite: prendete un lotto di componenti ed elencate tutte le unità finite che lo contengono.

### 9. Analisi delle prestazioni

**Cosa fa:** OEE, resa, scarti, tempo ciclo, rispetto del programma e analisi dei fermi per turno, linea e prodotto; è l'input per le riunioni giornaliere di reparto. La sezione 14 tratta i KPI.

**Errore tipico:** Dashboard di cui nessuno discute. Legate ogni KPI a una riunione e a un responsabile, come descritto in [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/).

### 10. Controllo dei documenti

**Cosa fa:** Consegna all'postazione la revisione corrente di disegni, istruzioni e specifiche, e registra quale revisione è stata usata. Spesso condiviso o delegato a un sistema di gestione documentale o al QMS.

### 11. Gestione della manodopera

**Cosa fa:** Registra chi ha lavorato su quale ordine e per quanto tempo, per il costing, le verifiche di qualificazione e le interfacce con le paghe. Notate l'aspetto relativo alle persone nella sezione 15: la rilevazione del lavoro a livello di operazione è sensibile e negli stabilimenti sindacalizzati può essere oggetto di contrattazione.

### 12. Funzioni legate alla manutenzione

**Cosa fa:** Stati delle macchine, contatori e allarmi dal MES alimentano la manutenzione basata sulla condizione o sull'utilizzo nel CMMS. La gestione completa della manutenzione di solito resta nel CMMS. Vedi [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/) e [predictive maintenance and IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/).

### 13. Gestione delle scorte e del flusso di materiali in linea

**Cosa fa:** Richiede il materiale alla linea, conferma i consumi, traccia i buffer di WIP e le scorte a bordo linea. I segnali kanban possono essere attivati dai dati di consumo del MES; vedi [kanban and pull systems](https://www.m365.fm/en/learn/kanban-pull-system/) e [intralogistics](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/).

### Discreto, processo e batch: come cambia l'enfasi

| Tipo di industria | Enfasi tipica del MES | Esempi |
|---|---|---|
| Discreto, alto volume (automotive, elettronica) | Genealogia seriale, interblocchi, dati macchina, OEE, Andon | Carrozzeria, assemblaggio di PCB |
| Discreto, alto mix, basso volume (macchinari, aerospaziale) | Istruzioni di lavoro, traveler, non conformità, qualifica degli operatori, configurazione as-built | Assemblaggio di macchine utensili, strutture aeronautiche |
| Batch (farmaceutico, alimentare, chimica specialistica) | Batch record elettronici, esecuzione delle ricette, pesatura e dosaggio, revisione per eccezione, conformità | Produzione di compresse, salse |
| Continuo (carta, acciaio, raffinazione) | Tracciamento della produzione per tempo e lotto, qualità per campionamento, energia, integrazione con DCS e LIMS | Macchina continua per carta, laminatoio a caldo di nastri |

Per gli aspetti specifici dell'aerospaziale (AS9100, ispezione del primo articolo, controllo della configurazione), vedere [aerospace production planning](https://www.m365.fm/en/learn/aerospace-production-planning/).

## Integrazione: B2MML, OPC UA, MTConnect e il namespace unificato

Un MES vale quanto le sue interfacce. Ha bisogno di ordini e dati anagrafici dai livelli superiori, di dati macchina dal basso e deve restituire i risultati confermati. Ricorrono quattro elementi costitutivi.

### Verso l'alto: integrazione con l'ERP e B2MML

L'interfaccia ERP-MES trasporta un numero limitato di tipi di messaggio, che corrispondono in modo preciso alle categorie informative dell'ISA-95:

| Direzione | Messaggio | Contenuto | Trigger |
|---|---|---|---|
| ERP -> MES | Definizione di prodotto / ciclo | Operazioni, distinta base, centri di lavoro, tempi standard | Rilascio della modifica di ingegneria |
| ERP -> MES | Ordine di produzione (programma) | Materiale, quantità, data di scadenza, riferimento al ciclo | Rilascio dell'ordine |
| ERP -> MES | Anagrafica materiali, lotti | ID materiali, caratteristiche del lotto | Modifica, ricevimento |
| MES -> ERP | Conferma di operazione (prestazione) | Quantità buone e scarti, tempi, manodopera | Fine operazione o periodica |
| MES -> ERP | Movimenti di magazzino | Consumi, carico di merce dalla produzione | Scansione del consumo, completamento dell'ordine |
| MES -> ERP | Notifica di qualità | Difetti, blocchi | Non conformità |
| MES <-> ERP | Capacità / stato | Disponibilità delle risorse, stato dell'ordine | Cambio di stato |

**B2MML** (Business To Manufacturing Markup Language) è l'implementazione XML di MESA dei modelli a oggetti dell'ISA-95; la specifica companion ISA-95 dell'OPC Foundation segue, dove possibile, la mappatura B2MML per facilitare la traduzione [5]. Usare B2MML o un suo equivalente JSON non rende un'interfaccia plug-and-play, ma offre a entrambe le parti gli stessi nomi e le stesse strutture di oggetti, riducendo i tempi di specifica. Con lo scioglimento di MESA, verificate dove vengono mantenuti gli schemi (vedere la sezione 2) [11].

**Regole che fanno risparmiare mesi:**

- Definite per ogni attributo quale sistema è il master e non lasciate mai che due sistemi scrivano lo stesso campo.
- Concordate l'*evento* che attiva una conferma (fine operazione, ogni 15 minuti, fine ordine), non solo il formato.
- Rendete le interfacce idempotenti: un messaggio inviato due volte non deve registrare due volte le quantità.
- Prevedete l'indisponibilità dell'ERP. Il MES deve continuare a funzionare e mettere in coda le registrazioni.

### Verso il basso: integrazione con macchine e controlli tramite OPC UA e MTConnect

**OPC UA** è l'interfaccia neutrale rispetto ai fornitori, dominante tra i controlli e il software di Livello 3. L'OPC Foundation mantiene specifiche companion che definiscono modelli informativi per domini specifici, tra cui OPC 10030, che mappa il modello a oggetti comune ISA-95 in OPC UA [4][5]. In Azure IoT Operations di Microsoft, per esempio, il connettore OPC UA legge i punti dati configurati e li pubblica su un broker MQTT [26]; la guida gemella [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) descrive quello stack.

**MTConnect** è uno standard aperto per i dati delle macchine utensili e delle attrezzature di produzione, pubblicato come ANSI/MTC1.4-2018 [22]. Molti costruttori statunitensi di macchine utensili lo supportano nativamente, il che lo rende interessante per le officine con macchine CNC.

Per le linee di confezionamento, il modello di stati PackML (dal rapporto tecnico ISA-TR88.00.02, edizione attuale 2022) fornisce alle macchine un insieme comune di stati e modalità [37], semplificando il calcolo dell'OEE tra OEM diversi.

**Di cosa avete bisogno dalla macchina, come minimo:** uno stato (in esecuzione, fermo, in guasto, in attrezzaggio), un contatore dei pezzi buoni, un contatore degli scarti, il programma o la ricetta attivi e i codici di allarme. Tutto il resto è un vantaggio per casi d'uso successivi.

### Lateralmente e verso l'esterno: il namespace unificato (UNS)

Uno **namespace unificato** (unified namespace, UNS) è un pattern architetturale, non uno standard: i sistemi pubblicano il proprio stato corrente come eventi su un broker centrale, tipicamente MQTT, organizzato in un albero di topic gerarchico, e gli altri sistemi si iscrivono a ciò di cui hanno bisogno. L'albero dei topic segue di norma la gerarchia degli equipaggiamenti ISA-95. Il [pilastro Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) mostra un esempio completo di topic e i servizi Azure che lo implementano; questa sezione si concentra su che cosa significa un UNS per il MES.

```
acme/dayton/machining/line-2/cnc-3/state
acme/dayton/machining/line-2/cnc-3/counts
acme/dayton/machining/line-2/order/current
acme/dayton/assembly/test-cell-t1/lt-1/result
```

**MQTT** è un protocollo leggero di publish/subscribe; i broker attuali supportano le versioni 3.1.1 e 5, come Microsoft documenta per il broker in Azure IoT Operations [25]. **Sparkplug**, mantenuto dall'Eclipse Sparkplug Working Group, aggiunge una convenzione di payload e di stato sopra MQTT; la versione 3.0 è quella attuale. I suoi "certificati di nascita e di morte" (birth and death certificates) indicano ai subscriber se i dati di un dispositivo sono ancora validi [28]. La struttura di topic propria di Sparkplug (gruppo, edge node, dispositivo) non coincide con la gerarchia ISA-95, quindi gli impianti che la usano di solito mappano la gerarchia nel group ID (per esempio `spBv1.0/Plant1:Area3:Line4:Cell2/NDATA/<edge node>`) oppure distribuiscono i livelli su broker diversi o su un secondo namespace strutturato secondo ISA-95; un fornitore di broker descrive entrambi i pattern e avverte che il numero limitato di elementi di topic di Sparkplug rende la mappatura stringente [44].

**Che cosa cambia un UNS per il MES:**

| Senza UNS | Con UNS |
|---|---|
| Il MES si collega punto a punto a ogni macchina, ERP, QMS, dashboard | Il MES si iscrive ai topic di macchine e ordini e pubblica i propri eventi (ordine avviato, operazione completata, blocco posto) |
| I nuovi consumatori (una dashboard, un modello di IA) richiedono una nuova interfaccia verso il MES | I nuovi consumatori si iscrivono ai topic esistenti |
| Lo stato corrente è disperso tra i sistemi | Lo stato corrente è visibile in un unico punto |

**Che cosa un UNS non cambia:**

- **La logica di business resta nel MES.** Il broker trasporta i messaggi; non garantisce che si usi il materiale giusto, che un operatore sia qualificato o che un registro di lotto sia completo.
- **I registri di riferimento restano nei sistemi di riferimento (system of record).** Un broker conserva lo stato corrente, non una storia verificabile. Genealogia, registri di lotto e conferme devono essere memorizzati in modo transazionale nel MES (e nell'ERP), con tracce di audit dove previsto dalla normativa.
- **La semantica richiede ancora un modello.** Un topic chiamato `counts` è inutile se una macchina conta i cicli e un'altra conta i pezzi buoni. Gli oggetti ISA-95 e le specifiche companion OPC UA forniscono la semantica del payload.
- **La sicurezza diventa più difficile, non più facile.** Un broker in cui ogni sistema può scrivere è un bersaglio di alto valore; il controllo degli accessi per topic, i client autenticati e la segmentazione secondo ISA/IEC 62443 sono obbligatori [23][24].

**Dibattito: "UNS sostituisce ISA-95."** Vi imbatterete in questa affermazione. Confonde due cose. La posizione dello stesso ISA è che i livelli restano utili per descrivere i confini dei sistemi anche quando i dati non fluiscono più livello per livello [1], e l'edizione 2025 della Parte 1 si rivolge esplicitamente ad architetture modulari e orientate ai dati [2]. La sintesi praticabile: ISA-95 per il vocabolario, la gerarchia degli equipaggiamenti e le responsabilità; UNS (o un altro backbone di eventi) per il trasporto; MES ed ERP come sistemi transazionali di riferimento.

### Architettura di integrazione: tre pattern a confronto

| Pattern | Come funziona | Adatto a | Da tenere presente |
|---|---|---|---|
| Punto a punto | Ogni sistema ha interfacce dirette con gli altri | Piccoli impianti con 3–5 sistemi | Fino a n × (n − 1) ÷ 2 interfacce: 10 per 5 sistemi, 45 per 10; aggiornamenti fragili |
| Middleware di integrazione / ESB | Un livello di integrazione centrale trasforma e instrada i messaggi | Aziende incentrate sull'ERP con team IT di integrazione | Può diventare un collo di bottiglia gestito da un team lontano |
| Backbone di eventi / UNS | Broker publish/subscribe con una convenzione condivisa di topic e payload | Impianti con molte macchine e molti consumatori di dati | Richiede governance di topic, payload e accessi; i flussi transazionali necessitano comunque di consegna garantita |

La maggior parte degli impianti finisce per avere un mix: un UNS per i dati di macchine e stato, e un'integrazione a consegna garantita per le transazioni ERP.

## MES nei settori regolamentati

Nei settori regolamentati il MES fa parte del sistema di qualità e i suoi registri sono documenti con valore legale. Questa sezione descrive le norme statunitensi per cui occorre progettare; non sostituisce il parere del vostro team di affari regolatori.

### FDA 21 CFR Part 11: registrazioni elettroniche e firme

Per i sistemi chiusi, il 21 CFR 11.10 richiede, tra gli altri controlli, la convalida dei sistemi per accuratezza, affidabilità e prestazioni costanti previste; la capacità di generare copie accurate e complete dei registri; la protezione dei registri per tutto il periodo di conservazione; la limitazione dell'accesso al sistema alle persone autorizzate; e "audit trail sicuri, generati dal computer e con marcatura temporale" che registrino data e ora delle immissioni e delle azioni dell'operatore che creano, modificano o cancellano registri, senza oscurare le informazioni già registrate [19]. Altri paragrafi riguardano controlli operativi e di autorità, controlli sui dispositivi, formazione e politiche scritte.

**Che cosa significa per un MES:** account utente personali (nessun login condiviso al terminale), audit trail su ogni registro regolamentato, firme elettroniche collegate al registro che mostrino nome del firmatario, data, ora e significato, e un pacchetto di convalida. Pianificate il lavoro di convalida in termini di tempi e budget; nel farmaceutico spesso rappresenta una quota rilevante dello sforzo di implementazione [unverified: nessun benchmark pubblico per la quota].

### Farmaceutico: batch record elettronici

I produttori di farmaci devono conservare i registri di produzione e controllo di ogni lotto ai sensi delle norme di buona fabbricazione (cGMP) del 21 CFR Parte 211; la sezione 211.188 stabilisce che "i registri di produzione e controllo del lotto devono essere predisposti per ogni lotto di prodotto farmaceutico fabbricato" [38]. Un MES con batch record elettronici (eBR) fa rispettare la sequenza della ricetta, acquisisce pesi e parametri alla fonte e supporta la **revisione per eccezione**: il revisore QA verifica le deviazioni segnalate dal sistema invece di leggere ogni pagina. È uno dei casi d'uso più solidi del MES in qualsiasi settore, perché il tempo di revisione dei batch record spesso limita il rilascio.

### Dispositivi medici: QMSR e device history record

Dal 2 febbraio 2026, il Quality Management System Regulation della FDA (21 CFR Parte 820) incorpora per riferimento la norma ISO 13485:2016, inclusi i suoi requisiti di identificazione e tracciabilità [20]. Il termine precedente "device history record" (DHR) compare ancora in molte descrizioni di prodotti MES e procedure di stabilimento; la pagina QMSR della FDA non usa il termine, quindi la nostra raccomandazione è di mappare i vostri registri sui requisiti della ISO 13485:2016 che il QMSR incorpora, anziché sui vecchi numeri di sezione della Parte 820, e di confermare la mappatura con gli affari regolatori. Il MES produce tipicamente il registro "as-built" per lotto o numero di serie: componenti, operazioni, controlli, attrezzature e personale.

### Alimentare: tracciabilità FSMA 204

La Food Traceability Rule della FDA (sezione 204 del FSMA) richiede elementi dati chiave per gli eventi di tracciabilità critici (ricevimento, trasformazione, spedizione) collegati a un codice di lotto di tracciabilità, con registri da fornire alla FDA entro 24 ore da una richiesta; la FDA non la applicherà prima del 20 luglio 2028 [29]. Gli eventi di trasformazione avvengono in produzione, quindi il MES o un modulo di tracciabilità è la sede naturale per creare i codici di lotto e collegare input e output.

### Automotive e aerospaziale

Le norme IATF 16949 e AS9100 aggiungono requisiti di tracciabilità, piano di controllo e primo articolo; i requisiti specifici dei clienti spesso vanno oltre. Nella IATF 16949, la sezione 8.5.2.1 integra i requisiti di identificazione e tracciabilità della ISO 9001 con piani di tracciabilità documentati basati su "i livelli di rischio o di gravità del guasto per dipendenti, clienti e consumatori", secondo una matrice di confronto di un organismo di certificazione [39] (fonte secondaria; la norma è un testo a pagamento). Entrambe le norme sono testi a pagamento; la guida sulla [pianificazione della produzione aerospaziale](https://www.m365.fm/en/learn/aerospace-production-planning/) tratta in dettaglio AS9100 e AS9102.

### Approccio alla validazione

La guida finale della FDA *Computer Software Assurance for Production and Quality Management System Software* (CDRH e CBER, febbraio 2026) descrive un approccio basato sul rischio per stabilire la fiducia nel software di produzione e di sistema di gestione della qualità e per decidere dove serve un maggior rigore [40]. È scritta per i produttori di dispositivi medici ai sensi del 21 CFR Parte 820; i produttori di farmaci possono usarla come orientamento, non come regola propria. In pratica: classificate ogni funzione MES in base al rischio, testate con rigore le funzioni ad alto rischio (firme elettroniche, interblocchi, calcoli, genealogia) mediante test scriptati, e usate test non scriptati o forniti dal fornitore per la configurazione a basso rischio. Chiedete ai fornitori i loro acceleratori di validazione e la certificazione del loro sistema di gestione della qualità.

## Opzioni di distribuzione e architettura

Il mercato è passato da "una grande suite MES per stabilimento" a un insieme più ampio di opzioni. Si differenziano per il luogo in cui il software viene eseguito e per la loro struttura.

### Dove viene eseguito: on-premises, cloud, ibrido

| Opzione | Descrizione | Vantaggi | Svantaggi |
|---|---|---|---|
| On-premises | Server MES nello stabilimento o nel data center aziendale | Funziona quando la WAN è inattiva; controllo completo; familiare ai team di validazione | Hardware, patch e aggiornamenti sono di vostra competenza; gli aggiornamenti vengono spesso rinviati per anni |
| Cloud (SaaS) | Il fornitore gestisce il MES nel proprio cloud; lo stabilimento si connette tramite gateway | Avvio più rapido, aggiornamenti gestiti dal fornitore, costo in abbonamento | Dipendenza dalla WAN; latenza per gli interblocchi; residenza dei dati; cadenza forzata degli aggiornamenti da conciliare con la validazione |
| Ibrido / edge più cloud | Esecuzione time-critical su un nodo edge nello stabilimento, analisi e gestione nel cloud | Continua a funzionare durante le interruzioni; scala le analisi | Due ambienti da gestire e proteggere; logica di sincronizzazione |

**Regola pratica:** tutto ciò che deve fermare una fase errata o mantenere in marcia una linea deve funzionare quando la connessione internet è interrotta. Chiedete a ogni fornitore cloud di dimostrare il comportamento offline, non di descriverlo.

### Come è strutturato: suite, piattaforma, modulo ERP

| Approccio | Cosa si ottiene | Adatto a | Rischi |
|---|---|---|---|
| Suite MES di settore | Funzionalità ampie e predefinite per uno o più settori, spesso con funzioni normative | Stabilimenti regolamentati e complessi; standardizzazione multi-sito | Progetti lunghi, personalizzazione pesante, vendor lock-in, costo elevato delle licenze |
| Componibile / piattaforma applicativa ("MES di nuova generazione") | Una piattaforma con strumenti low-code e connettori; lo stabilimento costruisce o configura applicazioni per casi d'uso specifici | Stabilimenti che vogliono partire in piccolo ed espandersi; produzione ad alta varietà; team interni solidi | Molte piccole applicazioni senza un modello dati condiviso; governance; validazione di applicazioni sviluppate dagli utenti |
| MES integrato con l'ERP | Modulo MES o prodotto complementare del fornitore ERP | Aziende incentrate sull'ERP con complessità di officina moderata | Usabilità in officina e integrazione con le macchine possono essere inferiori ai prodotti specialistici |
| Sviluppo su misura | Software proprietario su una piattaforma generica | Processi unici, team software solido | La manutenzione resta a vostro carico per sempre (sezione 10) |

"MES componibile" è un termine di marketing di fornitori e analisti, non una categoria standard. L'idea di fondo, piccole funzioni che condividono un unico modello dati e possono essere aggiunte nel tempo, è valida e corrisponde alla visione per attività di ISA-95. Il rischio è l'opposto del monolite: venti applicazioni che definiscono "ordine" e "macchina" in modi diversi. La gerarchia delle apparecchiature e i modelli a oggetti di ISA-95 sono l'antidoto.

### Modelli multi-sito

Per le aziende con più stabilimenti, la domanda non è tanto "quale MES" quanto "quanta standardizzazione". Un approccio comune è un **modello globale** (modello dati, processi core, interfacce, KPI) con estensioni locali. Limitate il modello a ciò che deve essere confrontabile tra i siti (definizioni dei KPI secondo ISO 22400, genealogia, interfaccia ERP); lasciate che i siti differiscano dove i loro processi differiscono.

## Costruire o acquistare

La maggior parte degli stabilimenti dovrebbe acquistare (o sottoscrivere un abbonamento) e configurare. Costruire ha senso in meno casi di quanto i team di ingegneria amino credere, ma in più casi di quanto ammettano i fornitori.

### Fattori decisionali

| Fattore | Orienta verso l'acquisto | Orienta verso la costruzione o la costruzione su piattaforma |
|---|---|---|
| Unicità del processo | I processi ricalcano la prassi del settore | I processi sono un vero elemento di differenziazione competitiva e cambiano spesso |
| Normativa | Ambiente validato e regolamentato (Part 11, GMP) | Ambiente non regolamentato o poco regolamentato |
| Capacità interna | Nessun team software, oppure un team completamente occupato con l'ERP | Team esperto in grado di mantenere il software per oltre 10 anni |
| Ambito | Ampio: esecuzione, qualità, genealogia, schedulazione | Ristretto: raccolta dati e OEE, istruzioni di lavoro digitali |
| Tempi | Servono risultati in pochi mesi | È possibile investire in una costruzione più lunga |
| Costo totale in 10 anni | Licenza più configurazione inferiori al costo di un team | Il costo del team è già sostenuto e stabile |
| Rischio legato alle persone chiave | Inaccettabile | Mitigato da documentazione e dimensione del team |

### Il costo nascosto della costruzione

Un MES costruito internamente non ha canone di licenza, ma si pagano requisiti, sviluppo, test, documentazione, hosting, patch di sicurezza, aggiornamenti della piattaforma sottostante, supporto alle 3 del mattino e, nei settori regolamentati, la validazione di ogni modifica. Il fallimento più comune non è la prima versione; è il quinto anno, quando lo sviluppatore originale se n'è andato e lo stabilimento gira su un software che nessuno osa modificare.

### Una via di mezzo

Molti stabilimenti acquistano una piattaforma o un MES per il nucleo (esecuzione, genealogia, interfaccia ERP) e costruiscono app o dashboard specifiche sopra di essa, usando le sue API o strumenti low-code. Funziona quando il nucleo acquistato possiede il modello dei dati e le parti personalizzate si limitano a leggerlo o usano API documentate.

## Checklist per la selezione del fornitore MES

La tabella seguente è una checklist di selezione con 30 criteri suddivisi in otto gruppi. Pesa i gruppi in base alla tua situazione (i pesi suggeriti si adattano a uno stabilimento discreto di medie dimensioni e poco regolamentato), assegna a ciascun fornitore un punteggio da 0 a 4 per criterio e, soprattutto, usa la colonna **metodo di test**: nessun criterio dovrebbe essere valutato sulla base di una presentazione.

| # | Gruppo (peso suggerito) | Criterio | Come verificarlo |
|---|---|---|---|
| 1 | Idoneità funzionale (25%) | Copre i principali casi d'uso della matrice delle attività ISA-95 | Dimostrazione scriptata con i vostri prodotti, cicli di lavorazione e un ordine reale |
| 2 | Idoneità funzionale | Istruzioni di lavoro: visive, versionate, con imposizione dei passaggi | L'operatore crea ed esegue un'istruzione durante la dimostrazione |
| 3 | Idoneità funzionale | Genealogia al livello necessario (lotto, numero di serie, entrambi) | Tracciabilità diretta e inversa sui dati di dimostrazione entro 60 secondi |
| 4 | Idoneità funzionale | Qualità in esecuzione: controlli, SPC, blocchi, non conformità | Forzare un controllo fallito e mostrare cosa si blocca |
| 5 | Idoneità funzionale | Fermi macchina e OEE secondo il vostro modello temporale | Configurare i vostri codici motivo e le regole di fermo pianificato |
| 6 | Idoneità funzionale | Profondità di schedulazione e dispatching (o integrazione con APS) | Riordinare la sequenza dopo un guasto macchina |
| 7 | Integrazione (15%) | Connettore ERP per il vostro ERP e la sua versione | Cliente di riferimento con lo stesso ERP; verifica della documentazione delle interfacce |
| 8 | Integrazione | Connettività macchine: OPC UA, MTConnect, le vostre marche di PLC | Collegare una delle vostre macchine in un proof of concept |
| 9 | Integrazione | API aperte (REST, eventi), documentate e versionate | Lo sviluppatore legge la documentazione delle API e costruisce una piccola query |
| 10 | Integrazione | Supporto per oggetti ISA-95 o B2MML | Richiedere la mappatura del modello dati su ISA-95 |
| 11 | Integrazione | Pubblicazione di eventi su MQTT / UNS | Mostrare gli eventi su un broker durante la dimostrazione |
| 12 | Dati e architettura (10%) | Il modello dati segue o è mappato sulla gerarchia delle apparecchiature ISA-95 | Verifica della configurazione del modello delle apparecchiature |
| 13 | Dati e architettura | Capacità offline al edge | Disconnettere la WAN durante il proof of concept |
| 14 | Dati e architettura | Esportazione e proprietà dei dati: potete ottenere tutti i dati in formati aperti | Clausola contrattuale più un'esportazione di prova |
| 15 | Dati e architettura | Capacità di template multisito | Riferimento con tre o più siti |
| 16 | Usabilità (10%) | Schermate operatore utilizzabili con i guanti, su tablet, con rumore ambientale | Due operatori testano senza formazione per 30 minuti |
| 17 | Usabilità | Configurazione da parte di supervisori e ingegneri senza codice | L'ingegnere modifica un passaggio di ciclo e un controllo |
| 18 | Usabilità | Lingue lette dalla vostra forza lavoro | Mostrare le schermate in ciascuna lingua |
| 19 | Conformità e sicurezza (10%) | Funzioni Part 11 se necessarie (audit trail, firma elettronica) | Dimostrazione dell'audit trail su un record modificato |
| 20 | Conformità e sicurezza | Sviluppo sicuro e certificazione di sicurezza del prodotto (es. ISA/IEC 62443-4-1/4-2) | Certificati e politica di divulgazione delle vulnerabilità del fornitore [23] |
| 21 | Conformità e sicurezza | Integrazione dell'identità (SSO, MFA per gli amministratori, modello dei ruoli) | Configurare i ruoli di operatore, supervisore, qualità |
| 22 | Conformità e sicurezza | Documenti di supporto alla convalida | Verifica del pacchetto di convalida |
| 23 | Fornitore e partner (10%) | Stabilità finanziaria e proprietà | Bilanci annuali o verifica del credito; cambi di proprietà negli ultimi cinque anni |
| 24 | Fornitore e partner | Partner di implementazione con referenze nel vostro settore e nella vostra area | Chiamare due referenze senza la presenza del fornitore |
| 25 | Fornitore e partner | Roadmap di prodotto e cadenza dei rilasci | Roadmap sotto NDA; con quale frequenza i clienti eseguono effettivamente gli aggiornamenti? |
| 26 | Fornitore e partner | Modello di supporto e orari | Testo dello SLA; chi risponde alle 2 di notte di sabato? |
| 27 | Costo (15%) | Costo totale di proprietà a cinque anni | Il vostro modello TCO (sezione 13) compilato con le offerte dei fornitori |
| 28 | Costo | Il modello di licenza si adatta alla crescita (per sito, per utente, per macchina, a consumo) | Quotare ora lo scenario di espansione a 3 anni |
| 29 | Costo | Costo di aggiornamenti e personalizzazioni | Chiedere quanto è costato un aggiornamento a un cliente di riferimento |
| 30 | Uscita (5%) | Piano di uscita: dati, configurazioni, documentazione alla cessazione | Clausola contrattuale; chiedere come un ex cliente è migrato altrove |

**Punteggio:** punteggio ponderato = somma sui gruppi di (peso del gruppo × punteggio medio dei criteri ÷ 4). Un fornitore con il 78 percento batte uno con il 72 percento solo se nessuno dei due ha un criterio eliminatorio: qualsiasi criterio con punteggio 0 in idoneità funzionale, capacità offline (se richiesta) o conformità deve escludere il fornitore indipendentemente dal totale.

**Suggerimenti di processo:**

- Scrivi la richiesta di offerta (RFP) basandoti su casi d'uso e sulla matrice delle attività, non su un elenco di funzionalità da 600 righe. Gli elenchi di funzionalità ricevono un "sì" per ogni riga.
- Insisti su una proof of concept a pagamento su una linea, con i tuoi dati, prima della decisione finale. Un intervallo tipico è da due a sei settimane [unverified: stima di esperti del settore].
- Lascia che operatori e supervisori valutino l'usabilità e che la finanza valuti i costi; mantieni separati i punteggi fino alla fine.
- Come punto di partenza neutrale rispetto ai fornitori, le analisi di analisti (Gartner Peer Insights elenca il mercato dei MES [8]) e le referenze di stabilimenti pari sono più utili delle classifiche dei fornitori pubblicate dai fornitori stessi.

## Roadmap di implementazione del MES

La roadmap seguente è pensata per un singolo stabilimento di medie dimensioni. Le durate sono ipotesi di pianificazione per un prodotto configurato, non benchmark; gli stabilimenti regolamentati e le realizzazioni su misura richiedono più tempo [unverified: stime di esperti del settore].

| Fase | Durata (ipotesi tipica) | Attività principali | Criteri di uscita |
|---|---|---|---|
| 0. Caso e perimetro | Da 4 a 8 settimane | Dichiarazione del problema, camminata lungo il flusso del valore, matrice delle attività ISA-95 as-is, KPI di riferimento, bozza del business case | Sponsor, intervallo di budget e un flusso del valore pilota approvati |
| 1. Requisiti e selezione | Da 8 a 16 settimane | Casi d'uso, modello dei dati (gerarchia delle apparecchiature, responsabilità dei dati master), RFP, dimostrazioni scriptate, proof of concept | Fornitore e partner selezionati, contratto con clausole di uscita e sui dati |
| 2. Progettazione | Da 6 a 10 settimane | Progettazione della soluzione, specifiche delle interfacce, modello dei tempi e codici motivo, standard delle istruzioni di lavoro, piano di convalida (se regolamentato), progettazione della sicurezza | Progetto firmato, piano di test |
| 3. Realizzazione e test del pilota | Da 10 a 20 settimane | Configurazione, connettività delle macchine, interfaccia con l'ERP, migrazione dei dati, cicli di test, formazione degli operatori | Accettazione da parte degli utenti sulla linea pilota |
| 4. Avvio del pilota e stabilizzazione | Da 6 a 12 settimane | Avvio con hypercare, revisione quotidiana dei problemi, confronto dei KPI con il riferimento | KPI stabili per 4 settimane consecutive; difetti aperti sotto la soglia concordata |
| 5. Estensione | Da 3 a 6 mesi per ondata | Ulteriori linee e aree; modello affinato | Tutte le aree previste in funzione |
| 6. Miglioramento continuo | Continuo | Nuovi casi d'uso, aggiornamenti, miglioramento guidato dai KPI | Di proprietà dello stabilimento, non del progetto |

### Fase 0 in dettaglio: partire dal flusso del valore

Percorri per primo il flusso del valore. Mappa dove le informazioni sono ritardate, riscritte a mano o mancanti, e dove nascono le fughe di qualità o i lunghi lead time. La guida alla [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) mostra come fare; una mappa dello stato attuale con il flusso informativo disegnato è il miglior documento dei requisiti MES che puoi produrre in una settimana. Scegli un pilota abbastanza importante da contare e abbastanza circoscritto da poter essere completato: una linea o una famiglia di prodotti con un punto dolente chiaro.

### Fase 1 in dettaglio: il modello dei dati prima del software

Definisci la gerarchia delle apparecchiature (sezione 4), il responsabile dei dati master per ciascun oggetto (materiale, ciclo di lavorazione, apparecchiature, personale), il modello dei tempi per l'OEE (cos'è il tempo di produzione pianificato) e il modello di stato di ordini e operazioni. Se non riesci a concordare questi punti con ERP, qualità e manutenzione prima della selezione, nessun fornitore potrà risolverli al posto tuo.

### Checklist di avvio in produzione

| Controllo | Fatto |
|---|---|
| Dati master dei prodotti pilota verificati in reparto (fasi del ciclo, distinta base, istruzioni) | ☐ |
| Ogni operatore formato sulla propria postazione con ordini reali, non solo in aula | ☐ |
| Procedura di ripiego (cartellino cartaceo) stampata e testata per un'interruzione del MES | ☐ |
| Interfaccia ERP testata con casi di errore (ERP fuori servizio, messaggio duplicato, quantità errata) | ☐ |
| Codici motivo e controlli rivisti con gli operatori | ☐ |
| Turni di hypercare per le prime due settimane, tutti i turni | ☐ |
| KPI di riferimento congelati per il confronto | ☐ |
| Sicurezza: account, ruoli, MFA per gli amministratori, backup testati | ☐ |
| Regolamentato: rapporto di sintesi della convalida approvato prima dell'uso in produzione | ☐ |

### Ruoli

| Ruolo | Responsabilità |
|---|---|
| Sponsor esecutivo (direttore di stabilimento o VP operations) | Decide sui conflitti di perimetro, tutela le risorse |
| Product owner dal lato operations | Gestisce casi d'uso e priorità, firma l'accettazione |
| Responsabile MES / solution architect | Progettazione, modello dei dati, integrazione |
| Ingegnere IT/OT | Infrastruttura, reti, connettività delle macchine, sicurezza |
| Qualità e normativa | Controlli, registrazioni, convalida |
| Utenti chiave per area e turno | Testano, formano i colleghi, forniscono feedback |
| Partner finanziario | Business case, monitoraggio dei benefici |
| Fornitore / integratore | Configurazione, conoscenza del prodotto |

## Costo MES e ROI con un esempio svolto

"Quanto costa un MES?" non ammette una cifra unica e onesta. I prezzi dipendono da ambito, numero di linee e utenti, modello di distribuzione, normativa e sforzo di integrazione, e i fornitori raramente li pubblicano. Alcune pagine web indicano intervalli senza fonte; noi non li riportiamo. Proponiamo invece una struttura per il vostro costo totale di proprietà (TCO) e un esempio svolto con **ipotesi illustrative** che sostituirete con i vostri preventivi e i vostri dati di partenza.

### Struttura dei costi

| Voce di costo | Una tantum | Ricorrente | Note |
|---|---|---|---|
| Software | Licenza perpetua (se prevista) | Abbonamento o manutenzione (spesso una percentuale della licenza all'anno) | Verificare la metrica: sito, utente, macchina, consumo |
| Servizi di implementazione | Configurazione, interfacce, migrazione dei dati, gestione del progetto | Richieste di modifica | Di solito la voce una tantum più grande |
| Hardware e rete | Terminali, tablet, scanner, stampanti di etichette, server edge, Wi-Fi, cablaggi | Ciclo di sostituzione | Spesso sottostimato negli stabilimenti più datati |
| Connettività delle macchine | Gateway, programmazione PLC, retrofit per macchine datate | Manutenzione | Prezzo per tipo di macchina, non per singola macchina |
| Team interno | Team di progetto, key user, sostituzione per le loro normali attività | Supporto MES, amministrazione, miglioramento continuo | Conteggiare il costo caricato |
| Formazione | Progettazione e sessioni di formazione | Nuovi assunti, aggiornamenti | |
| Convalida (settori regolamentati) | Piano di convalida, protocolli, esecuzione | Riconvalida dopo modifiche e aggiornamenti | |
| Hosting e operatività | Configurazione | Canoni cloud o gestione dei server, backup, monitoraggio della sicurezza | |

**Capex vs. opex:** un MES in abbonamento è generalmente opex; licenze perpetue, hardware e alcuni costi di implementazione possono essere capitalizzati in base alla vostra politica contabile. Secondo gli US GAAP, l'ASC 350-40 disciplina il software per uso interno. Dall'ASU 2018-15 (agosto 2018), i costi di implementazione di un accordo cloud che è un contratto di servizio seguono le stesse fasi di capitalizzazione, ma i costi capitalizzati sono presentati come i canoni di hosting anticipati, ammortizzati lungo la durata dell'hosting e indicati nella stessa voce del conto economico del canone [41]. L'ASU 2025-06 (settembre 2025) modifica nuovamente l'ASC 350-40, con effetto per gli esercizi annuali che iniziano dopo il 15 dicembre 2027, con possibilità di adozione anticipata [42]. Concordate il trattamento con il vostro revisore. La scelta contabile modifica l'EBITDA e la tempistica dei costi, non l'economia dell'operazione.

### Struttura dei benefici

| Voce di beneficio | Formula | Fonte dei dati |
|---|---|---|
| Produttività aggiuntiva sul collo di bottiglia | Ore produttive aggiuntive × margine di contribuzione per ora | Log MES o registro manuale dei fermi, finanza (solo se esiste domanda) |
| Riduzione di scarti e rilavorazioni | Costo annuo di scarti e rilavorazioni × riduzione attesa | Report sui costi di qualità |
| Tempo di lavoro per documentazione e inserimento dati | Ore risparmiate × costo orario caricato × quota effettivamente riallocata | Studio dei tempi, interviste |
| Riduzione di WIP e scorte | Liberazione di cassa una tantum; costo di mantenimento × riduzione annua | Valutazione delle scorte |
| Rilascio più rapido di lotti o ordini | Riduzione del lead time × valore (scorte, consegna puntuale) | Tempi di revisione QA, dati degli ordini |
| Costi evitati di conformità e richiami | Probabilità × impatto, di solito non nello scenario base | Registro dei rischi |

### Esempio svolto: uno stabilimento di valvole con 220 dipendenti

**Situazione (tutte le cifre sono illustrative):** quattro linee, due turni, fatturato di 85 milioni di dollari. La linea 2 è il collo di bottiglia. Cartellini cartacei, conferme ERP di fine turno, nessuna rilevazione automatica dei fermi.

**Costi una tantum (anno 0):**

| Voce | Importo |
|---|---|
| Servizi di implementazione | 450.000 $ |
| Hardware, rete, connettività delle macchine | 160.000 $ |
| Team di progetto interno (2,5 FTE per 12 mesi a 120.000 $ di costo caricato) | 300.000 $ |
| Formazione e sostituzioni | 60.000 $ |
| **Totale una tantum** | **970.000 $** |

**Costi ricorrenti (dall'anno 1):** abbonamento 180.000 $ + supporto MES interno 1 FTE 120.000 $ = **300.000 $ all'anno**.

**Benefici a pieno regime (scenario base):**

| Beneficio | Calcolo | All'anno |
|---|---|---|
| OEE sulla linea 2 dal 62% al 67% | 4.000 ore pianificate × 5 punti = 200 ore produttive aggiuntive × 2.000 $ di margine di contribuzione per ora | 400.000 $ |
| Riduzione degli scarti | 1,2 milioni di $ di costo degli scarti × 15% | 180.000 $ |
| Tempo per la documentazione | 4.000 ore × 45 $ caricati × 50% riallocate | 90.000 $ |
| Costo di mantenimento del WIP | 3,0 milioni di $ di WIP × 10% di riduzione × 20% di tasso di mantenimento | 60.000 $ |
| **Beneficio annuo totale** | | **730.000 $** |

A ciò si aggiunge una liberazione di cassa una tantum dal WIP: 3,0 milioni di $ × 10% = 300.000 $ (ipotizzata nell'anno 2).

**Rampa di avviamento:** nel primo anno si ottiene il 40 percento del beneficio annuo (pilota e implementazione), negli anni dal 2 al 5 si ottiene il 100 percento.

**Flussi di cassa (in migliaia di $), tasso di sconto 10%:**

| Anno | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Caso base | −970 | 730 × 0,4 − 300 = −8 | 730 − 300 + 300 = 730 | 430 | 430 | 430 |
| Cumulativo | −970 | −978 | −248 | 182 | 612 | 1.042 |

VAN al 10% = −970 − 8/1,1 + 730/1,1² + 430/1,1³ + 430/1,1⁴ + 430/1,1⁵ ≈ **+510.000 $**. Tempo di recupero semplice: il flusso di cassa cumulativo diventa positivo durante il terzo anno, circa 2,6 anni dopo l'avvio del progetto (248 ÷ 430 = 0,58 del terzo anno).

**Caso prudenziale:** il guadagno OEE è solo la metà (oppure non tutta la produzione aggiuntiva può essere venduta): 200.000 $ invece di 400.000 $; riduzione degli scarti del 10 percento (120.000 $) invece del 15 percento. Beneficio annuo di 470.000 $, netto di 170.000 $ all'anno.

| Anno | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Caso prudenziale | −970 | 470 × 0,4 − 300 = −112 | 470 − 300 + 300 = 470 | 170 | 170 | 170 |
| Cumulativo | −970 | −1.082 | −612 | −442 | −272 | −102 |

VAN al 10% ≈ **−334.000 $**; nessun recupero entro cinque anni.

**Analisi di sensibilità:** mantenendo i benefici su scarti, documentazione e WIP al livello del caso base, il progetto raggiunge il pareggio (VAN = 0 al 10%) con un beneficio di produttività di circa 243.000 $ all'anno, equivalenti a circa 121 ore produttive in più oppure a circa 3 punti OEE sulla Linea 2 invece di 5. Se si realizza solo la metà del guadagno OEE e tutto il resto rimane invariato, il VAN è di circa −139.000 $. La sensibilità a questa singola ipotesi è il vero risultato da considerare.

**Cosa insegna l'esempio:**

1. **Una sola linea domina.** Il beneficio di produttività supera la metà del caso base. Prima di includerlo, verificare con le vendite che lo stabilimento sia vincolato dalla capacità su quella linea, oppure usare la guida sulla [teoria dei vincoli](https://www.m365.fm/en/learn/theory-of-constraints/) per individuare prima il vero vincolo.
2. **I costi ricorrenti contano più di quanto suggerisca la voce delle licenze.** Il supporto interno rappresenta qui il 40 percento dei costi ricorrenti e viene spesso trascurato.
3. **La rampa di avviamento compromette il VAN.** Un pilota che si trascina per 18 mesi invece di 12 spinge ulteriormente in negativo il caso prudenziale. La rapidità nel raggiungere la prima linea stabile è una variabile finanziaria.
4. **I benefici non quantificati sono reali ma distinti.** La riduzione del perimetro dei richiami, la prontezza per gli audit e i requisiti dei clienti possono giustificare da soli un MES nelle catene di fornitura regolamentate o guidate dagli OEM. Presentarli accanto ai numeri, non all'interno di essi.
5. **Monitorare i benefici dopo l'avvio in esercizio** rispetto alla baseline congelata, insieme alla finanza, per almeno due anni.

Per le definizioni di KPI e costi alla base di queste voci, vedere [KPI di produzione](https://www.m365.fm/en/learn/manufacturing-kpis/).

## KPI MES: cosa misurare e come

Un MES produce i dati per la maggior parte dei KPI di reparto. Contano due gruppi: i KPI operativi che il MES calcola e i KPI che indicano se il MES stesso funziona.

### Definizioni standard: ISO 22400

La norma ISO 22400-2:2014 definisce gli indicatori chiave di prestazione per la gestione delle operazioni di produzione, con formula, unità, tempistica e gruppo di utenti per ciascuno [16]; fonti secondarie contano 34 KPI nella norma [18], e un emendamento del 2017 ha aggiunto KPI per la gestione dell'energia [16]. Usare le sue definizioni rende i KPI confrontabili tra linee e stabilimenti. I ricercatori del NIST hanno pubblicato una struttura gerarchica di questi KPI con le relative formule, liberamente disponibile [17].

### KPI operativi dal MES

| KPI | Formula (semplificata) | Uso tipico |
|---|---|---|
| OEE | Disponibilità × prestazione × qualità | Collo di bottiglia e macchine chiave |
| Disponibilità | Tempo di marcia ÷ tempo di produzione pianificato | Focus sui fermi |
| Prestazione | (Tempo ciclo ideale × conteggio totale) ÷ tempo di marcia | Perdite di velocità, micro-fermi |
| Qualità (tasso) | Conteggio buoni ÷ conteggio totale | Scarti e rilavorazioni |
| First pass yield | Unità superate senza rilavorazione ÷ unità avviate | Capacità di processo |
| Tasso di scarto | Quantità scartata ÷ quantità prodotta | Perdita di materiale |
| Aderenza al programma | Ordini (o quantità) completati come pianificato ÷ pianificati | Stabilità del piano |
| Throughput | Unità buone per ora | Capacità |
| WIP | Unità o valore tra la prima e l'ultima operazione | Flusso |
| Lead time ordine | Tempo di completamento − tempo di rilascio | Reattività verso il cliente |
| MTBF / MTTR | Tempo di funzionamento ÷ guasti; tempo di riparazione ÷ guasti | Manutenzione |

**Esempio di calcolo OEE (un turno sulla Linea 2):** tempo di produzione pianificato 450 minuti, fermo non pianificato 60 minuti, quindi tempo di marcia 390 minuti. Tempo ciclo ideale 1,0 minuti, conteggio totale 340, conteggio buoni 323.

- Disponibilità = 390 ÷ 450 = 86,7%
- Prestazione = (1,0 × 340) ÷ 390 = 87,2%
- Qualità = 323 ÷ 340 = 95,0%
- OEE = 0,867 × 0,872 × 0,950 = **71,8%**

Verifica incrociata: conteggio buoni × tempo ciclo ideale ÷ tempo di produzione pianificato = 323 ÷ 450 = 71,8%. Se il vostro MES non supera questa verifica, il suo modello dei tempi è incoerente. Muchiri e Pintelon esaminano le definizioni di OEE in uso e le loro insidie [30]; la guida [TPM e OEE](https://www.m365.fm/en/learn/tpm-oee/) approfondisce l'argomento.

### KPI per il MES stesso

| KPI | Definizione | Direzione del target |
|---|---|---|
| Latenza dei dati | Tempo dall'evento in reparto alla disponibilità nel MES / ERP | In calo (minuti, non giorni) |
| Tasso di acquisizione automatica | Quota di quantità e stati acquisiti dalle macchine rispetto a quelli digitati | In crescita |
| Tasso di correzioni manuali | Correzioni ogni 100 ordini | In calo |
| Copertura dei codici motivo | Quota di minuti di fermo con un motivo valido | In crescita (oltre il 90% è un obiettivo comune) |
| Tempo di tracciabilità | Minuti necessari per produrre una tracciatura completa a ritroso per un numero di serie o lotto | In calo |
| Adozione | Quota di ordini eseguiti interamente nel MES (nessun bypass cartaceo, tranne il fallback documentato in caso di interruzione) | In crescita (lo stato finale è 100%; bypass persistenti indicano un problema di progettazione, non degli operatori) |
| Tasso di errore delle interfacce | Registrazioni fallite o rifiutate al giorno | In calo |
| Disponibilità del MES | Tempo di attività durante le ore di produzione | In crescita |

## Persone e reparto produttivo

Un MES cambia il modo di lavorare degli operatori in ogni minuto del turno. Gli stabilimenti che lo trattano come un progetto IT tendono a ottenere workaround; quelli che lo trattano come un cambiamento del lavoro ottengono adozione.

**Cosa guadagnano gli operatori:** istruzioni aggiornate alla postazione invece di un raccoglitore, meno moduli, aiuto più rapido quando qualcosa va storto (chiamate andon dal terminale; vedi l'approfondimento su [andon](https://www.m365.fm/en/learn/shop-floor-management/andon/)) e meno attribuzione di colpe, quando il sistema mostra che un fermo è stato causato a monte.

**Cosa temono gli operatori, spesso a ragione:** essere monitorati minuto per minuto, essere bloccati da un sistema sbagliato e perdere il giudizio a favore di uno schermo. Affrontate ciascun timore in modo diretto:

- **Monitoraggio:** decidete e pubblicate quali dati sul lavoro il MES registra, chi li vede e a cosa servono. Usate i dati sulle prestazioni per migliorare il processo, non per classificare le persone. Negli stabilimenti sindacalizzati, l'introduzione del monitoraggio elettronico e le modifiche alle regole di lavoro possono costituire materia obbligatoria di contrattazione; coinvolgete il sindacato in una fase precoce e chiedete il parere del consulente legale del lavoro [unverified: la valutazione legale dipende dal contratto e dalla dottrina attuale del NLRB].
- **Essere bloccati da un sistema sbagliato:** offrite agli operatori un modo rapido e visibile per segnalare un'istruzione errata o un blocco errato, e risolvete queste segnalazioni entro pochi giorni. Ogni segnalazione non risolta insegna al reparto a trovare un workaround.
- **Giudizio:** usate arresti rigidi solo per le fasi critiche per sicurezza o qualità. Per il resto, avvisate e registrate.

**Coinvolgete gli operatori nella progettazione.** Due o tre operatori per area nei workshop di progettazione, operatori che testano le schermate prima del go-live e operatori come formatori tra pari sono soluzioni economiche ed efficaci. Il rispetto per le persone è un input di progetto, non una diapositiva di change management; per il principio vedi [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/).

**Ergonomia e sicurezza ai terminali:** collocate i terminali dove si svolge il lavoro, all'altezza in piedi, leggibili con l'illuminazione dello stabilimento e utilizzabili con i guanti. Gli scanner non devono aggiungere spostamenti. Un MES che aggiunge 30 secondi per operazione su un takt di 60 secondi ha già fallito prima del go-live.

## Errori comuni nell'implementazione di un MES

| # | Errore | Cosa succede | Soluzione migliore |
|---|---|---|---|
| 1 | Acquistare funzionalità prima di definire il modello dei dati | Le interfacce si rompono per ID non corrispondenti, i KPI differiscono da un sistema all'altro | Prima la gerarchia delle apparecchiature, i responsabili dei dati anagrafici e il modello temporale |
| 2 | Digitalizzare uno a uno il processo cartaceo attuale | Stesso spreco, ora su uno schermo | Semplificare prima il processo con la camminata nel flusso del valore |
| 3 | Estendere lo scopo a "tutto ciò che è nella lista MESA-11" | Progetto pluriennale, nulla in produzione | Un flusso del valore, da tre a cinque casi d'uso, operativi in pochi mesi |
| 4 | Personalizzare invece di configurare | Gli aggiornamenti diventano progetti; il fornitore rifiuta il supporto | Accettare processi standard dove non costituiscono un elemento distintivo |
| 5 | Nessun coinvolgimento degli operatori | Workaround, sistemi ombra su carta | Operatori coinvolti in progettazione, test e formazione |
| 6 | ERP e MES gestiscono gli stessi dati come master | Quantità e tempi in conflitto | Un solo master per attributo, documentato |
| 7 | Arresti rigidi ovunque | Le linee si fermano per motivi banali; la fiducia crolla | Arresti rigidi solo dove la sicurezza o la qualità lo richiedono |
| 8 | Trascurare la rete e i terminali | Schermate lente, scansioni perse | Rilievo del sito e aggiornamento della rete nella fase 2 |
| 9 | Nessun piano di emergenza per le interruzioni | La produzione si ferma quando cadono il MES o la WAN | Procedura cartacea di emergenza testata e capacità offline sull'edge |
| 10 | Progettazione della sicurezza debole | Rete piatta tra ufficio e macchine | Zone e condotti secondo ISA/IEC 62443; privilegio minimo [23][24] |
| 11 | Nessun responsabile dopo il go-live | Il MES si deteriora; la qualità dei dati cala | Team MES interno allo stabilimento e un KPI per l'adozione |
| 12 | Benefici mai misurati | Il business case del sito successivo non ha evidenze | Baseline congelata; la finanza monitora i benefici per due anni |
| 13 | Validazione sottovalutata (settori regolati) | Ritardi di mesi | Validazione basata sul rischio pianificata dalla fase 1 |
| 14 | Considerare l'UNS o la piattaforma dati come un MES | Dati ovunque, nessuna applicazione, nessuna registrazione | MES per l'esecuzione e le registrazioni; UNS per la distribuzione |

## Limiti di MES e ISA-95

Essere onesti sui limiti aiuta a decidere cosa non acquistare.

### Limiti dell'MES

1. **Un MES non risolve un processo rotto.** Se i cicli di lavorazione sono errati, i materiali mancano o la produzione avviene senza lavoro standard, l'MES rende questi problemi visibili, più rapidamente. È utile, ma non è la soluzione. Prima le basi del Lean; vedere [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) e [5S e gestione visiva](https://www.m365.fm/en/learn/5s-visual-management/).
2. **La qualità dei dati dipende dalle persone.** Le registrazioni manuali, le scansioni e i codici motivo valgono quanto la disciplina e la progettazione delle schermate.
3. **I sistemi rigidi resistono al cambiamento.** Un MES fortemente personalizzato può rallentare l'introduzione di nuovi prodotti e le modifiche di processo, l'opposto di ciò di cui hanno bisogno gli stabilimenti ad alto mix.
4. **Costi e impegno sono elevati per le piccole aziende.** Per un job shop da 30 persone, il controllo di officina tramite ERP, uno strumento semplice di raccolta dati e una buona gestione visiva possono offrire gran parte del valore.
5. **La pianificazione non è l'esecuzione.** Un MES con un modulo di schedulazione non sostituisce la pianificazione vendite e operations (S&OP) né l'MRP; vedere [S&OP, MRP e pianificazione della produzione](https://www.m365.fm/en/learn/sop-mrp-production-planning/).
6. **Le analisi su larga scala appartengono altrove.** Le analisi multi-stabilimento, l'AI e lo storico a lungo termine di solito appartengono a una piattaforma dati alimentata dall'MES, non all'interno di esso. La guida al [digital twin](https://www.m365.fm/en/learn/digital-twin-manufacturing/) e l'approfondimento sul [process mining](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/) mostrano cosa possono alimentare i dati dell'MES.

### Limiti dell'ISA-95

1. **È astratto.** L'ISA-95 è indipendente dalla tecnologia per progettazione [1]. Indica cosa denominare e scambiare, non come costruirlo, quindi due prodotti "conformi ISA-95" possono comunque risultare difficili da integrare.
2. **Il modello a livelli non è un percorso dei dati.** Letto alla lettera, la gerarchia suggerisce che i dati si spostino livello per livello tramite interfacce punto-punto. Le architetture moderne (UNS, streaming di eventi, cloud) non funzionano in questo modo; la stessa ISA ora enfatizza i livelli come confini, non come condutture [1][2].
3. **I testi dello standard sono a pagamento e lunghi.** Molti team lavorano su sintesi secondarie, il che porta a interpretazioni incoerenti. Acquistare almeno le Parti 1 e 3 per la biblioteca di progetto.
4. **La conformità non è certificata.** Non esiste una certificazione formale ISA-95 per i prodotti, nel modo in cui ISA/IEC 62443 dispone di schemi di certificazione della sicurezza dei prodotti [unverified: nessun programma di certificazione di prodotto ISA-95 trovato]. "Conforme ISA-95" in una brochure è un'affermazione del fornitore.
5. **Nella pratica i confini sono tracciati in modo diverso.** Le attività di schedulazione, qualità e manutenzione si collocano in sistemi diversi in ogni stabilimento; il modello delle attività ne tiene conto, ma non lo decide al posto vostro.

## Glossario

| Termine | Significato |
|---|---|
| Modello delle attività | Modello ISA-95 Parte 3 delle attività di Livello 3: quattro categorie di operazioni, otto attività generiche ciascuna [3] |
| APS | Advanced planning and scheduling (pianificazione e schedulazione avanzate); software di schedulazione a capacità finita |
| Record as-built | Il registro di come un'unità o un lotto specifico è stato effettivamente prodotto |
| B2MML | Business To Manufacturing Markup Language; implementazione XML degli oggetti ISA-95, creata da MESA [5] |
| Record di lotto (eBR) | Registro di produzione e controllo per un singolo lotto; record elettronico di lotto quando è conservato in un MES |
| CMMS / EAM | Sistema computerizzato di gestione della manutenzione / gestione degli asset aziendali |
| MES componibile | Termine dei fornitori per un MES costruito da applicazioni più piccole su una piattaforma condivisa |
| Schedulazione di dettaglio | Attività ISA-95 che sequenzia il lavoro sulle risorse all'interno del Livello 3 [3] |
| Device history record (DHR) | Termine del settore dei dispositivi medicali per il registro di produzione di un dispositivo o di un lotto; si veda QMSR [20] |
| Dispatching | Rilascio del lavoro successivo a una risorsa [3] |
| Gerarchia delle apparecchiature | Struttura ISA-95 basata sui ruoli: enterprise, site, area, work center, work unit |
| ERP | Enterprise resource planning (pianificazione delle risorse d'impresa); sistema aziendale ISA-95 di Livello 4 |
| Genealogia | Collegamenti tra i materiali in ingresso e le unità in uscita (tracciabilità in avanti e all'indietro) |
| Historian | Banca dati di serie temporali per i valori di processo |
| IEC 62264 | Pubblicazione internazionale di ISA-95 [1][7] |
| ISA-88 | Standard per il controllo dei processi batch, usato per le strutture di ricetta |
| ISA-95 | ANSI/ISA-95, Enterprise-Control System Integration, otto parti [1] |
| ISA/IEC 62443 | Serie di standard per la sicurezza dei sistemi di automazione e controllo industriale [23] |
| ISO 22400 | Standard per i KPI nella gestione delle operazioni di produzione [16] |
| LIMS | Laboratory information management system (sistema informativo per la gestione del laboratorio) |
| MES | Manufacturing execution system (sistema di esecuzione della produzione); software di Livello 3 orientato alla produzione per eseguire e registrare la produzione [8] |
| MESA-11 | Modello di MESA International del 1997 con 11 funzioni MES [9][12] |
| MOM | Manufacturing operations management (gestione delle operazioni di produzione); il Livello 3 ISA-95 nel suo insieme |
| MQTT | Protocollo di messaggistica publish/subscribe leggero, diffuso nell'IIoT |
| MTConnect | Standard aperto per i dati delle apparecchiature di produzione (ANSI/MTC1.4-2018) [22] |
| OEE | Overall equipment effectiveness (efficacia globale delle apparecchiature) = disponibilità × prestazione × qualità |
| OPC UA | Standard di comunicazione industriale e di modellazione delle informazioni indipendente dal fornitore, dell'OPC Foundation |
| Part 11 | 21 CFR Part 11, norme FDA per i record e le firme elettroniche [19] |
| Modello di Purdue | Purdue Reference Model per la produzione integrata da computer, base dei livelli ISA-95 [1] |
| QMS | Quality management system (sistema di gestione della qualità); software per non conformità, CAPA, documenti e audit |
| Revisione per eccezione | Revisione del record di lotto che si concentra sulle deviazioni segnalate dal sistema |
| SCADA | Supervisory control and data acquisition (supervisione e acquisizione dati); software di supervisione di Livello 2 |
| Sparkplug | Specifica Eclipse basata su MQTT per payload e stato (certificati di nascita e di morte) [28] |
| Unified namespace (UNS) | Schema architetturale: broker centrale con un albero gerarchico di topic che contiene lo stato corrente dell'attività |
| WMS | Warehouse management system (sistema di gestione del magazzino) |
| Work center / work unit | Livelli della gerarchia delle apparecchiature ISA-95 sotto l'area |

## FAQ

### Che cos'è un sistema di esecuzione della produzione in termini semplici?

È il software che indica al reparto produttivo cosa fare dopo e registra ciò che è effettivamente accaduto, ordine per ordine e fase per fase. Gartner lo definisce come software orientato alla produzione che gestisce, monitora e sincronizza l'esecuzione in tempo reale dei processi fisici che trasformano le materie prime in prodotti [8].

### Quali sono le funzioni principali di un MES?

Il modello di attività ISA-95 elenca otto attività generiche per le operazioni di produzione: gestione della definizione del prodotto, gestione delle risorse, schedulazione di dettaglio, dispatching, gestione dell'esecuzione, raccolta dati, tracciabilità e analisi delle prestazioni [3]. Il modello MESA del 1997 elencava 11 funzioni, aggiungendo controllo documentale, gestione della manodopera, gestione della qualità, gestione dei processi e gestione della manutenzione [9].

### Quali sono i vantaggi di un MES?

Dati di produzione acquisiti alla fonte invece che riscritti a mano, tempi di attraversamento degli ordini più brevi grazie a un rilascio e a un dispatching più rapidi, meno fughe di non conformità grazie a controlli imposti, richiami più rapidi e più circoscritti grazie alla genealogia di lotto e di numero di serie, fermi macchina più visibili sul collo di bottiglia e registrazioni elettroniche pronte per l'audit. Ogni vantaggio dipende da una condizione: dati anagrafici corretti, controlli configurati come blocchi obbligatori, scansione disciplinata dei materiali e un output effettivamente vendibile. La sezione 1 elenca cosa misurare per ciascuno di essi.

### Che cos'è ISA-95 in termini semplici?

ISA-95 (IEC 62264) è lo standard internazionale per l'integrazione tra i sistemi aziendali, come l'ERP, e i sistemi di controllo della produzione. Definisce livelli, una gerarchia delle apparecchiature, modelli di oggetti e modelli di attività affinché IT, OT e business usino lo stesso vocabolario [1].

### Quali sono i cinque livelli di ISA-95?

Il livello 0 è il processo fisico, il livello 1 è la rilevazione e la manipolazione, il livello 2 è il monitoraggio e il controllo di supervisione, il livello 3 è la gestione delle operazioni di produzione (MES e sistemi correlati) e il livello 4 è la pianificazione aziendale e la logistica (ERP) [1].

### ISA-95 è lo stesso di IEC 62264?

Il contenuto è allineato: ISA pubblica ANSI/ISA-95, IEC pubblica IEC 62264. Edizioni e numerazione differiscono; l'ANSI/ISA-95 Parte 1 del 2025 è un'adozione modificata di IEC 62264-1 [1][2], e IEC 62264-6 è apparsa nel 2020 [6]. Citare sempre parte ed edizione.

### Quante parti ha ISA-95?

Otto: modelli e terminologia; oggetti e attributi per l'integrazione controllo aziendale; modelli di attività del MOM; oggetti e attributi per l'integrazione MOM; transazioni business-to-manufacturing; modello del servizio di messaggistica; modello del servizio di alias; profili di scambio delle informazioni [1].

### Che cos'è il livello 3 in ISA-95?

Il livello 3 è la gestione delle operazioni di produzione: le attività che trasformano i piani in prodotti, in intervalli di giorni, turni, ore, minuti e secondi [4]. Comprende le operazioni di produzione, manutenzione, controllo qualità e magazzino [3]. Il MES è il sistema più comune di livello 3.

### Qual è la differenza tra MES ed ERP?

L'ERP (livello 4) pianifica cosa produrre e lo contabilizza in un intervallo di mesi e giorni. Il MES (livello 3) esegue e registra come ogni ordine viene effettivamente realizzato, in turni e fino ai secondi [4]. L'ERP conserva la registrazione contabile; il MES conserva la registrazione as-built. Si scambiano ordini, conferme e movimenti di materiale.

### Ho bisogno di un MES se ho già un ERP?

Non necessariamente. Chiediti quattro cose: devi registrare per fase, numero di serie e parametro anziché per operazione; le decisioni dipendono dai minuti anziché dalle conferme di fine turno; il sistema deve impedire una fase errata anziché limitarsi a registrarla; e servono registrazioni elettroniche dello storico di lotto e dispositivo? Se tutte e quattro le risposte sono no, il controllo di reparto dell'ERP può essere sufficiente. Se due o più sono sì, servono funzioni MES, dal fornitore dell'ERP, da un fornitore MES o da una piattaforma (sezione 5).

### Qual è la differenza tra MES e SCADA?

Lo SCADA supervisiona e controlla macchine e processi in tempo reale (tag, allarmi, setpoint). Il MES gestisce ordini, materiali, persone, qualità e registrazioni. Lo SCADA sa che una macchina è in funzione; il MES sa per quale ordine, quale lotto di materiale e quale operatore sta lavorando.

### Qual è la differenza tra MES e MOM?

MOM (manufacturing operations management) è il termine ISA-95 per l'intero livello 3, comprendente le operazioni di produzione, qualità, manutenzione e magazzino. MES di solito indica il nucleo produttivo; molte "suite MOM" sono prodotti MES con moduli aggiuntivi [10].

### Che cos'è B2MML?

B2MML è un'implementazione XML dei modelli a oggetti ISA-95, creata da MESA International e usata in molte interfacce ERP-MES; la mappatura OPC UA per ISA-95 ne segue lo schema dove possibile [5]. Dopo lo scioglimento di MESA, avvenuto il 30 giugno 2026, ISA ha rilevato i contenuti di MESA [11].

### In che modo ISA-95 si integra con i sistemi ERP?

ISA-95 definisce l'interfaccia tra il Livello 4 (ERP) e il Livello 3 (MES e altri sistemi operativi). Le Parti 2 e 4 definiscono gli oggetti scambiati, la Parte 5 le transazioni. In pratica l'ERP invia verso il basso definizioni di prodotto, ordini di produzione e dati sui materiali; il MES restituisce verso l'alto conferme di operazione, movimenti di merce, notifiche di qualità e stati. B2MML implementa i modelli a oggetti ISA-95 in XML [5]. Un modello condiviso riduce il lavoro di specifica, ma ogni progetto deve comunque decidere quale sistema è master per ciascun campo e quale evento attiva una registrazione (sezione 7).

### Una namespace unificato sostituisce ISA-95 o il MES?

No. Un UNS è un modo per far circolare e condividere i dati di stato attuale attraverso un broker. Ha bisogno di ISA-95 (o di un modello simile) per la denominazione e la semantica, e ha bisogno di un MES e di un ERP per la logica di business e per le registrazioni verificabili.

### Quanto costa un MES?

Dipende dall'ambito, dal numero di linee, dal modello di distribuzione, dall'integrazione e dalla normativa applicabile, e i fornitori raramente pubblicano i prezzi. Calcolate il vostro costo totale di proprietà a cinque anni con i blocchi di costo della sezione 13; nel nostro stabilimento illustrativo da 220 dipendenti, i costi una tantum sono stati di 970.000 dollari e i costi ricorrenti di 300.000 dollari all'anno.

### Quanto dura l'implementazione di un MES?

Per uno stabilimento con un prodotto configurato, prevedete circa sei-dodici mesi fino a un pilota stabile e ulteriori ondate di tre-sei mesi ciascuna [unverified: ipotesi di pianificazione dei professionisti]. Gli stabilimenti regolamentati e le realizzazioni su misura richiedono tempi più lunghi.

### SAP è un MES?

Il core ERP di SAP include funzioni di controllo del reparto produttivo; SAP vende inoltre prodotti MES separati. Se le funzioni ERP siano sufficienti dipende dalla granularità, dalla latenza, dall'applicazione e dalle esigenze normative descritte nella sezione 5.

### Le piccole aziende manifatturiere hanno bisogno di un MES?

Non sempre. Una piccola officina su commessa può spesso ottenere gran parte del valore dalle conferme di reparto dell'ERP, da un semplice monitoraggio delle macchine e da una buona gestione visiva. Un MES diventa necessario quando servono il controllo sequenziale dei passaggi, la genealogia dei numeri di serie, i registri di lotto elettronici o decisioni quasi in tempo reale. Il Manufacturing Extension Partnership (MEP) del NIST, che si rivolge alle piccole e medie imprese manifatturiere, è un punto di riferimento indipendente dai fornitori a cui chiedere una valutazione [31].

### Che cos'è un MES in cloud o un MES componibile?

Un MES in cloud funziona come servizio nel cloud del fornitore; un MES componibile è costruito a partire da applicazioni più piccole su una piattaforma comune. Entrambi possono funzionare; verificate il comportamento offline al edge, il modello dati condiviso e, se regolamentati, come la cadenza di rilascio del fornitore si concilia con la vostra convalida.

### ISA-95 è ancora rilevante con IIoT e le piattaforme cloud?

Sì. ISA afferma che i livelli continuano a essere utili per descrivere i confini dei sistemi per l'Industria 4.0 [1], e l'edizione 2025 della Parte 1 è stata scritta per architetture modulari e orientate ai dati [2]. Ciò che è invecchiato è l'idea che i dati debbano risalire i livelli uno alla volta.

### Quali sono i limiti di ISA-95?

È astratto e indica che cosa denominare e scambiare, non come costruirlo. Letto alla lettera, il suo modello a livelli suggerisce che i dati debbano risalire livello per livello, cosa che le architetture moderne guidate dagli eventi non fanno. I testi dello standard sono a pagamento e molto lunghi, quindi i team spesso lavorano su sintesi incoerenti. "Conforme a ISA-95" è un'affermazione del fornitore, non una certificazione. E non decide dove il vostro stabilimento traccia il confine tra i sistemi MES, qualità e manutenzione (sezione 17).

### Quali KPI dovrebbe monitorare un MES?

OEE e le sue componenti, resa al primo passaggio, rapporto di scarto, aderenza al piano, produttività, WIP, lead time e MTBF/MTTR, definiti secondo ISO 22400-2 [16][17]. Monitorate anche il MES stesso: latenza dei dati, tasso di acquisizione automatica, adozione e tempo di tracciabilità.

### Che cosa richiede da un MES il 21 CFR Part 11?

Per i sistemi chiusi: convalida, copie accurate dei registri, protezione dei registri, accesso limitato alle persone autorizzate e tracce di audit sicure, generate dal computer, con marcatura temporale, che non oscurino le voci precedenti, tra gli altri controlli [19]. Le firme elettroniche devono essere collegate ai relativi registri.

## Conclusione e primi passi

Un sistema di esecuzione della produzione vale il suo costo quando chiude il ciclo tra pianificazione e realtà più velocemente e in modo più affidabile di quanto possano fare persone con carta e fogli di calcolo. ISA-95 fornisce la mappa per questo: i livelli mostrano dove si colloca il MES, la gerarchia delle apparecchiature assegna a ogni sistema gli stessi nomi, i modelli degli oggetti definiscono cosa scambiano ERP e MES, e la matrice 4 × 8 del modello delle attività indica quale sistema dovrebbe possedere quale compito. Uno spazio dei nomi unificato e le piattaforme cloud cambiano l'infrastruttura, non quelle responsabilità.

I progetti che riescono condividono uno schema: partono da un flusso del valore e da un modello dei dati, avviano un pilota su una linea con una baseline congelata, coinvolgono gli operatori fin dal primo workshop, mantengono i blocchi rigidi per ciò che conta davvero e misurano i benefici con la finanza per anni. L'esempio svolto mostra perché: lo stesso MES è un investimento buono o cattivo a seconda che il guadagno sul collo di bottiglia possa essere venduto e di quanto velocemente il pilota si stabilizzi.

**I vostri primi 30 giorni:**

- [ ] Percorrere un flusso del valore e segnare ogni punto in cui le informazioni vengono riscritte, ritardate o mancano
- [ ] Compilare la matrice delle attività ISA-95 (4 × 8) per quel flusso del valore: chi svolge oggi ciascuna attività?
- [ ] Redigere la gerarchia delle apparecchiature per l'area pilota e concordare i nomi con manutenzione e IT
- [ ] Congelare una baseline: OEE sul collo di bottiglia, costo degli scarti, tempo di attraversamento degli ordini, tempo di tracciabilità
- [ ] Chiedere a vendite e finanza se la produzione extra sul collo di bottiglia può essere venduta, e con quale margine di contribuzione
- [ ] Elencare i requisiti normativi sulle registrazioni (Part 11, QMSR, FSMA 204, requisiti dei clienti)
- [ ] Parlare con due stabilimenti pari che utilizzano un MES, senza la presenza dei fornitori
- [ ] Acquistare le parti 1 e 3 di ISA-95 per la biblioteca di progetto

---

## Ulteriori letture su m365.fm

**Guide correlate**
- [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/): architettura cloud, spazio dei nomi unificato su Azure IoT Operations, piattaforma dati
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Shop Floor Management and Gemba Walks](https://www.m365.fm/en/learn/shop-floor-management/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [OT Cybersecurity and ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/)
- [Predictive Maintenance and IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/)
- [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [S&OP, MRP and Production Planning](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/)
- [Six Sigma and Root Cause Analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/)
- [Kanban and Pull Systems](https://www.m365.fm/en/learn/kanban-pull-system/)
- [5S and Visual Management](https://www.m365.fm/en/learn/5s-visual-management/)

**Approfondimenti**
- [Paperless Manufacturing and Digital Work Instructions](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/)
- [Standard Work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/)
- [Andon System](https://www.m365.fm/en/learn/shop-floor-management/andon/)
- [Intralogistics and In-Plant Material Flow](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Process Mining in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/)
- [Manufacturing Workforce Skills](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/)

**Termini del glossario (entità)**
[Enterprise resource planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Total productive maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Poka-yoke](https://www.m365.fm/entity/poka-yoke/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** è il conduttore di m365.fm e lavora presso iFAKT GmbH. Su m365.fm scrive di produzione snella, eccellenza operativa e trasformazione digitale della produzione, inclusi i sistemi e i modelli di dati che collegano il reparto produttivo con la pianificazione.

**Nota: l'autore lavora presso iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Status: **(F)** = opened and checked for this article; **(S)** = opened and checked on November 20, 2026 by the fact check of a related guide on m365.fm (file named), cited here with the same wording, not re-fetched for this article because the shared web-fetch budget was exhausted.

1. ISA-95 Standard: Enterprise-Control System Integration (parts list with editions, Levels 0–4, Purdue basis, scope of each part). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard (F)
2. Update to ISA-95 Standard Addresses Integration of Enterprise and Manufacturing Control Systems. ISA press release, Durham, N.C., April 10, 2025 (ANSI/ISA-95.00.01-2025, IEC 62264-1 Mod; quotes by Christian Monchinski). https://www.isa.org/news-press-releases/2025/april/update-to-isa-95-standard-addresses-integration-of (F)
3. ANSI/ISA-95.00.03-2013, Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management, preview incl. table of contents (clauses 6–9). ANSI Webstore. https://webstore.ansi.org/preview-pages/ISA/preview_ANSI+ISA+95.00.03-2013.pdf ; ISA preview with scope: https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf (F)
4. OPC 10030: ISA-95 Common Object Model, section 4.2.3 ISA-95 (levels, time frames, information types). OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3 (F)
5. OPC 10030: ISA-95 Common Object Model, section 4.2 ISA-95 Summary (object models, nesting, B2MML by MESA, OPC UA mapping follows B2MML). OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2 (F)
6. IEC 62264-6:2020, Enterprise-control system integration – Part 6: Messaging service model, edition 1.0, 2020-06-26. IEC Webstore. https://webstore.iec.ch/publication/59706 (F)
7. IEC 62264 (list of parts and IEC editions). Wikipedia (secondary source). https://en.wikipedia.org/wiki/IEC_62264 (F)
8. Manufacturing Execution Systems, market definition. Gartner Peer Insights. https://www.gartner.com/reviews/market/manufacturing-execution-systems (F)
9. What Isn't an MES? (MESA International MES functional model with 11 functions, one of eight MESA models; 45 percent cycle-time claim attributed to MESA). Control Engineering. https://www.controleng.com/what-isnt-an-mes (F)
10. MES Definition Work Continues (AMR Research 1992; MESA 1997 definition; ISA-95 MOM categories; 40+ manufacturers, requirements time reduced to four to six weeks). Automation World, March 1, 2006. https://automationworld.com/products/control/news/13302768/mes-definition-work-continues (F)
11. ISA Receives MESA International Content (MESA to cease operations effective June 30, 2026; content and educational programs assumed by ISA). International Society of Automation. https://programs.isa.org/isa-receives-mesa-international-content (F)
12. Manufacturing execution system (MES), definition (MESA-11 in 1997; ISA-95 merged MESA-11 with the Purdue Reference Model). TechTarget. https://www.techtarget.com/searcherp/definition/manufacturing-execution-system-MES (F)
13. The Five Parts of ISA-95. Automation World, May 6, 2013. https://automationworld.com/products/software/article/13309288/the-five-parts-of-isa-95 (F)
14. Manufacturing execution system. Wikipedia (secondary source; ISA-95 Part 1 2000, Part 3 2005; Level 3 systems as MOMS; B2MML). https://en.wikipedia.org/wiki/Manufacturing_execution_system (F)
15. HPImpact: Report "clarifies" MES for management (MESA white paper "MES: A High Level Vision"). Hydrocarbon Processing, December 1997 issue. https://www.hydrocarbonprocessing.com/magazine/1997/december-1997/misc/hpimpact-report-clarifies-mes-for-management (F; page metadata shows a 2016 upload date)
16. ISO 22400-2:2014 Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions. Edition 1, 2014-01; status "to be revised"; Amendment 1:2017 "Key performance indicators for energy management". https://www.iso.org/standard/54497.html (F, re-fetched November 20, 2026)
17. Kang, N.; Zhao, C.; Li, J.; Horst, J. A. (2016): A hierarchical structure of key performance indicators for operation management and continuous improvement in production systems. International Journal of Production Research 54(21), pp. 6333–6350. NIST version: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=919754 (F, re-fetched November 20, 2026)
18. ISO 22400 KPI Selection Guide (secondary source for the count of 34 KPIs). Fabrico. https://www.fabrico.io/blog/iso-22400-kpi-selection-guide/ (F, re-fetched November 20, 2026)
19. 21 CFR 11.10, Controls for closed systems. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11/subpart-B/section-11.10 (F, re-fetched November 20, 2026)
20. Quality Management System Regulation (QMSR): effective February 2, 2026; incorporates ISO 13485:2016 and clause 3 of ISO 9000:2015 by reference. U.S. Food and Drug Administration. https://www.fda.gov/quality-systems-regulation (F)
21. VDI 5600 Part 1: Manufacturing Execution Systems (MES). Edition October 2016. https://www.din.de/en/wdc-beuth:din21:251310997 (F, re-fetched November 20, 2026)
22. MTConnect Standard, ANSI/MTC1.4-2018, Part 1.0 Overview and Fundamentals. MTConnect Institute. https://docs.mtconnect.org/ANSI_MTC1_4-2018.pdf (F, re-fetched November 20, 2026)
23. ISA/IEC 62443 Series of Standards. International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards (F, re-fetched November 20, 2026)
24. Stouffer, K. et al. (2023): Guide to Operational Technology (OT) Security. NIST SP 800-82 Rev. 3, September 28, 2023. DOI: [10.6028/NIST.SP.800-82r3](https://doi.org/10.6028/NIST.SP.800-82r3) (S: digital-twin-manufacturing.md)
25. Publish and subscribe MQTT messages using MQTT broker (Azure IoT Operations; MQTT 3.1.1 and MQTT 5). Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/manage-mqtt-broker/overview-broker (F, re-fetched November 20, 2026)
26. What is the connector for OPC UA? Azure IoT Operations, Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector (F, re-fetched November 20, 2026)
27. What is ISA-95? The Five Levels, IEC 62264 and the Automation Pyramid (secondary source for the equipment hierarchy names enterprise, site, area, work center, work unit; vendor page). OPC Router. https://www.opc-router.com/what-is-isa-95/ (F)
28. Eclipse Sparkplug (Sparkplug Specification Version 3.0; birth and death certificates; TLS). Eclipse Foundation, Sparkplug Working Group. https://sparkplug.eclipse.org/ (F)
29. FSMA Final Rule on Requirements for Additional Traceability Records for Certain Foods. U.S. Food and Drug Administration. https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods (F, re-fetched November 20, 2026)
30. Muchiri, P.; Pintelon, L. (2008): Performance measurement using overall equipment effectiveness (OEE): literature review and practical application discussion. International Journal of Production Research 46(13), pp. 3517–3535. DOI: 10.1080/00207540601142645 (S: manufacturing-kpis.md)
31. Manufacturing Extension Partnership (MEP). National Institute of Standards and Technology (NIST). https://www.nist.gov/mep (F, re-fetched November 20, 2026)
32. 7.4.1 ISA95EquipmentElementLevelEnum, OPC 10030: ISA-95 Common Object Model. OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/7.4.1 (F, accessed November 20, 2026)
33. Enterprise-Control System Integration, Part 1: Models and Terminology, ISA-dS95.01-1999, Draft 14, November 1999 (historical public draft, section 5.2 equipment hierarchy, section 7.1 information categories; not the current edition). https://xml.coverpages.org/ISA95Part1-Draft14-NIST.pdf (F, accessed November 20, 2026)
34. ISA-88. Wikipedia (secondary source; procedural control model; adopted by the IEC in 1997 as IEC 61512-1). https://en.wikipedia.org/wiki/ISA-88 (F, accessed November 20, 2026)
35. SAP Digital Manufacturing (product page, vendor description; MOM platform on SAP Business Technology Platform; SAP Manufacturing Execution customers advised to transition). SAP. https://www.sap.com/products/scm/digital-manufacturing.html (F, accessed November 20, 2026)
36. B2MML-BatchML (README: B2MML implements ANSI/ISA-95, BatchML implements ANSI/ISA-88). MESA International, GitHub. https://github.com/MESAInternational/B2MML-BatchML (F, accessed November 20, 2026)
37. ISA-TR88.00.02-2022, Machine and Unit States: An Implementation Example of ISA-88 (PackML), preview (sections 4 to 6: state model, modes). International Society of Automation. https://www.isa.org/getmedia/300dbd50-d549-41ac-b372-a5e52f32fc97/tr_880002_preview.pdf (F, accessed November 20, 2026; full title per ISA catalog not shown in the preview)
38. 21 CFR 211.188, Batch production and control records. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-J/section-211.188 (F, accessed November 20, 2026)
39. IATF 16949:2016 vs. ISO/TS 16949:2009 comparison matrix (section 8.5.2.1). DNV (secondary source). https://www.dnv.com/siteassets/images/pdf-documents/iatf-2009-to-2016-comparison-matrix.pdf (F, accessed November 20, 2026)
40. Computer Software Assurance for Production and Quality Management System Software, final guidance, February 2026 (CDRH, CBER). U.S. Food and Drug Administration. https://fda.gov/regulatory-information/search-fda-guidance-documents/computer-software-assurance-production-and-quality-management-system-software (F, accessed November 20, 2026)
41. FASB Amends Guidance on Cloud Computing Arrangements (ASU 2018-15, issued August 29, 2018). Deloitte DART, Heads Up. https://dart.deloitte.com/USDART/home/publications/archive/deloitte-publications/heads-up/2018/fasb-amends-guidance-cloud-computing-arrangements (F, accessed November 20, 2026)
42. FASB Amends Guidance on the Accounting for and Disclosure of Software Costs (ASU 2025-06, September 18, 2025). Deloitte DART. https://dart.deloitte.com/USDART/home/news/all-news/2025/sep/fasb-amends-guidance-on-software-costs (F, accessed November 20, 2026)
43. New MESA Model: A Framework for Smarter Manufacturing. Automation.com, April 22, 2022. https://www.automation.com/article/mesa-model-a-framework-smarter-manufacturing (F, accessed November 20, 2026)
44. Manditereza, K.: Implementing Unified Namespace (UNS) With MQTT Sparkplug. HiveMQ blog (vendor source), first published December 20, 2022, updated February 22, 2026. https://hivemq.com/blog/implementing-unified-namespace-uns-mqtt-sparkplug (F, accessed November 20, 2026)
