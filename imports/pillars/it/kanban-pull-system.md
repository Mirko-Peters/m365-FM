# SEO metadata

| Field | Value |
|---|---|
| Meta title | Kanban nella Produzione: Sistema Pull Lean, Dimensionamento, Regole |
| Meta description | Kanban nella produzione spiegato: come funziona un sistema kanban come pull system lean, tipi di cartellino, formula kanban, e-kanban, CONWIP, implementazione e KPI. |
| Slug | `kanban-pull-system` |

# Sistema Kanban nella Produzione: come funzionano i sistemi pull, come dimensionarli e quando usare alternative

> **Risposta breve:** Un sistema kanban è un modo di controllare la produzione e il movimento dei materiali basato sul pull, in cui un segnale (un cartellino, un contenitore vuoto o un messaggio elettronico) autorizza un processo a monte a produrre o spostare una quantità fissa solo dopo che il processo a valle l'ha consumata. Il numero di segnali in un anello limita le scorte. Il Lean Enterprise Institute definisce il kanban come "un dispositivo di segnalazione che fornisce l'autorizzazione e le istruzioni per la produzione o il prelievo (trasferimento) di articoli in un sistema pull" [1]; il metodo è stato sviluppato in Toyota da Taiichi Ohno [7][10].

> **Punti chiave**
> - Un sistema pull è definito da una sola proprietà: limita esplicitamente il lavoro in corso (WIP) [2]. Il kanban è il sistema pull più noto, ma anche CONWIP, POLCA e drum-buffer-rope rientrano in questa categoria.
> - Il kanban di produzione (cartellini, contenitori, supermercati) non è la stessa cosa della bacheca Kanban del software, sebbene il metodo della bacheca derivi da quello produttivo [22].
> - Tipi principali: kanban di produzione, kanban di prelievo (trasferimento), kanban di segnalazione (a triangolo) e kanban fornitore [1]. I sistemi a due contenitori ed e-kanban sono forme fisiche e digitali della stessa logica.
> - Dimensionamento di base: numero di kanban = domanda × lead time di rifornimento × (1 + fattore di sicurezza) ÷ quantità per contenitore, arrotondato per eccesso. Gli anelli reali richiedono anche kanban per gli intervalli di raccolta e per le dimensioni dei lotti a monte [12][13][15].
> - Il kanban richiede una domanda stabile e ripetitiva per codice articolo, cambi formato rapidi e processi affidabili. Per lavorazioni ad alto mix e bassi volumi, CONWIP o POLCA di solito si adattano meglio [3][20].
> - ERP/MRP e kanban non sono in competizione: l'MRP pianifica la capacità e i materiali a lungo lead time, il kanban esegue il rifornimento quotidiano. La maggior parte dei sistemi ERP dispone di un modulo kanban con la propria formula di dimensionamento [15][16].
> - Il kanban elimina le scorte in eccesso; i buffer strategici contro le interruzioni sono una decisione di rischio distinta. Toyota stessa mantiene un buffer deliberato sui semiconduttori da quando è stato introdotto, dopo il 2011, un piano di continuità [26].

## Indice

1. [Che cos'è un sistema kanban?](#che-cosè-un-sistema-kanban)
2. [Kanban di produzione vs. bacheche Kanban: chiarire la confusione nelle ricerche](#kanban-manifatturiero-vs-kanban-board-fare-chiarezza-sulla-confusione-delle-ricerche)
3. [Push vs. pull: che cos'è davvero un sistema pull](#push-vs-pull-che-cosè-davvero-un-sistema-pull)
4. [Storia: dall'officina meccanica di Toyota alla pratica globale](#storia-dallofficina-meccanica-di-toyota-alla-pratica-globale)
5. [Come funziona un anello kanban, passo dopo passo](#come-funziona-un-ciclo-kanban-passo-dopo-passo)
6. [Tipi di kanban](#tipi-di-kanban)
7. [Le sei regole del kanban di Toyota](#le-sei-regole-del-kanban-di-toyota)
8. [Come calcolare il numero di kanban: formule ed esempi svolti](#come-calcolare-il-numero-di-kanban-formule-ed-esempi-svolti)
9. [Supermercati, corsie FIFO e processo pacemaker](#supermercati-corsie-fifo-e-processo-pacemaker)
10. [Heijunka: livellare il programma da cui dipende il kanban](#heijunka-livellare-il-programma-da-cui-dipende-il-kanban)
11. [Oltre il kanban: CONWIP, POLCA e drum-buffer-rope](#oltre-il-kanban-conwip-polca-e-drum-buffer-rope)
12. [E-kanban e l'interazione ERP/MRP](#e-kanban-e-interazione-erpmrp)
13. [Modelli: cartellino, foglio di dimensionamento, checklist del supermercato, audit](#modelli-scheda-foglio-di-dimensionamento-checklist-del-supermercato-audit)
14. [Come implementare il kanban nella produzione: una roadmap di 26 settimane](#come-implementare-il-kanban-nella-produzione-una-roadmap-di-26-settimane)
15. [KPI del kanban e visione finanziaria](#kpi-del-kanban-e-la-prospettiva-finanziaria)
16. [Errori comuni nel kanban e come correggerli](#errori-comuni-nel-kanban-e-come-correggerli)
17. [Limiti: quando il kanban è lo strumento sbagliato](#limiti-quando-il-kanban-è-lo-strumento-sbagliato)
18. [Glossario del kanban](#glossario-kanban)
19. [FAQ: domande su sistema kanban e sistema pull](#faq-domande-sul-sistema-kanban-e-sul-sistema-pull)
20. [Conclusioni e primi passi](#conclusioni-e-primi-passi)

## Che cos'è un sistema kanban?

Un sistema kanban è un insieme di regole e segnali che collega la produzione e la movimentazione dei materiali al consumo effettivo. Quando un processo a valle utilizza un contenitore di parti, il contenitore vuoto o il suo cartellino torna a monte. Quel segnale è l'unica autorizzazione a produrre o spostare un sostituto. Nessun segnale, nessuna produzione. La parola giapponese kanban significa "segnale" o "insegna" [1]. In pratica, il kanban è un sistema visivo. Un contenitore vuoto o un cartellino in una postazione è un segnale visivo, uno dei più semplici sul reparto produttivo: chiunque può leggerlo senza un rapporto o uno schermo.

Tre elementi fanno funzionare un sistema kanban:

1. **Un numero fisso di segnali per ciclo.** Ogni cartellino o contenitore rappresenta un contenitore con una quantità fissa. Il numero di cartellini in circolazione è la giacenza massima che quel ciclo può contenere.
2. **Un punto di stoccaggio definito.** Le parti attendono in un supermarket o nel punto d'uso, presso un indirizzo riportato sul cartellino [1].
3. **Regole che tutti rispettano.** Nulla viene prodotto senza un kanban, il cartellino resta con le parti, i difetti non vengono trasferiti [10][11].

Un cartellino kanban riporta tipicamente il nome della parte, il codice articolo, il fornitore esterno o il processo fornitore interno, la quantità del contenitore, l'indirizzo di stoccaggio e l'indirizzo del processo consumatore [1]. I kanban possono essere cartellini cartacei, targhette metalliche, contenitori vuoti, palline colorate o messaggi elettronici; il mezzo conta meno della disciplina.

### Kanban, pull e just-in-time: come si relazionano i termini

I tre termini sono spesso usati come sinonimi. Non lo sono:

| Termine | Cos'è | Relazione |
|---|---|---|
| Just-in-time (JIT) | Un principio produttivo: produrre solo ciò che serve, quando serve, nella quantità necessaria [8] | Uno dei due pilastri del Toyota Production System, accanto al jidoka [8] |
| Sistema pull | Una logica di controllo che limita esplicitamente il WIP, così che il lavoro venga avviato solo quando c'è spazio o domanda a valle [2] | Il meccanismo che rende possibile il JIT |
| Kanban | Uno specifico dispositivo di segnalazione e un insieme di regole che implementano il pull [1] | Un modo per costruire un sistema pull; altri sono CONWIP, POLCA e drum-buffer-rope |

Toyota descrive in termini semplici il ciclo di rifornimento alla base del JIT: una quantità minima di parti sta in linea, e i processi a monte reintegrano ciò che i processi a valle prelevano, così da produrre solo ciò che viene venduto (parafrasato dalla pagina TPS di Toyota) [8]. Il kanban è il sistema di istruzioni che porta avanti quel ciclo. Per questo il kanban è uno degli strumenti centrali della produzione snella: traduce il principio lean del pull in una routine quotidiana. Il kanban non elimina da solo gli sprechi, ma limita la sovrapproduzione, uno dei sette sprechi di Ohno, e rende visibili quelli che restano.

### Vantaggi di un sistema kanban nella produzione

I vantaggi del kanban derivano dal limite al WIP, non dai cartellini:

- **Giacenze più basse e prevedibili.** Il ciclo non può contenere più di cartellini × quantità del contenitore, il che limita le giacenze in eccesso, lo spazio di stoccaggio e i costi di giacenza.
- **Lead time più brevi.** Secondo la legge di Little, il lead time medio è uguale al WIP medio diviso per il throughput [6]. Limitare il WIP limita il lead time.
- **Problemi visibili.** Quando un ciclo va in carenza, tutti lo vedono. È questo lo scopo della regola Toyota di ridurre i kanban passo dopo passo [10].
- **Meno impegno di schedulazione.** Solo un processo, il pacemaker, riceve un piano; i processi a monte seguono i segnali.
- **Meno emergenze di recupero.** Il rifornimento diventa routine invece di un'eccezione.

Questi vantaggi sono condizionati. Molte pagine web citano riduzioni del 25 percento delle giacenze o del 50 percento del lead time senza indicare lo stabilimento, la base di partenza o il metodo. Questa guida non ripete tali cifre. Ciò che è misurabile nel proprio stabilimento è illustrato nella sezione sui KPI, con le relative formule.

## Kanban manifatturiero vs. Kanban board: fare chiarezza sulla confusione delle ricerche

Se hai cercato "kanban system" e ti aspettavi dei post-it su una lavagna o uno strumento di gestione dei progetti, sei finito nel ramo manifatturiero di un albero genealogico. Il significato software, spesso scritto con la K maiuscola come "Kanban Method", è descritto su Wikipedia come "un metodo snello per gestire e migliorare il lavoro nei sistemi umani"; il libro di David J. Anderson del 2010 *Kanban: Successful Evolutionary Change for Your Technology Business* ha descritto come il metodo si è evoluto a partire dai progetti in Microsoft e Corbis, e il metodo affonda le sue radici nella produzione just-in-time di Toyota [22].

I due condividono l'idea di limitare la quantità di lavoro in corso. Differiscono quasi per tutto il resto:

| Aspetto | Kanban manifatturiero | Kanban board (lavoro di concetto) |
|---|---|---|
| Cosa scorre | Parti fisiche in contenitori standard | Attività, ticket, user story |
| Il segnale | Cartellino, contenitore vuoto o messaggio elettronico che autorizza una quantità fissa | Una scheda che rappresenta un elemento di lavoro; limiti WIP per colonna |
| Chi tira | Il processo a valle preleva le parti; quello a monte reintegra esattamente quella quantità | Un membro del team tira l'elemento successivo quando si libera capacità |
| Dimensionamento | Formula basata su domanda, tempo di reintegro, dimensione del contenitore e scorta di sicurezza | Limiti WIP fissati dal giudizio del team e dalle metriche di flusso |
| Guasto tipico | Rotture di stock, supermercati traboccanti, cartellini smarriti | Colonne sovraccariche, lavoro nascosto |
| Testi di riferimento principali | Libro TPS di Ohno, lessico LEI, manuali Toyota [1][9][11] | Anderson (2010) e successiva letteratura sul Kanban Method [22] |

Alcune pagine web mescolano i due significati, ad esempio confrontando kanban e Scrum in una pagina sulle scorte manifatturiere. Questo confonde i lettori di stabilimento. Il resto di questa guida riguarda il sistema kanban manifatturiero: parti, contenitori, anelli, formule. Se devi creare una kanban board per un team di ingegneria o d'ufficio, o per un flusso di lavoro agile nel software, i principi dei limiti WIP e di un flusso di lavoro visibile si applicano anche lì, ma le formule di dimensionamento qui sotto no.

## Push vs. pull: che cos'è davvero un sistema pull

La spiegazione comune è "push produce per previsione, pull produce per domanda." È vicina, ma non abbastanza precisa per progettare un sistema. Wallace Hopp e Mark Spearman hanno proposto una definizione più chiara: "Un sistema di produzione pull è un sistema che limita esplicitamente la quantità di lavoro in corso che può trovarsi nel sistema" [2]. Il loro articolo sostiene che la letteratura praticante ha semplificato eccessivamente pull e lean, e che il pull è nella sostanza un modo per limitare il WIP [2].

Questa definizione ha conseguenze pratiche:

- **Una linea make-to-stock con kanban è pull,** perché i cartellini limitano il WIP e le scorte di prodotto finito.
- **Una linea make-to-order può essere anch'essa pull,** se gli ordini entrano solo quando un limite WIP lo consente (CONWIP, POLCA).
- **Uno stabilimento che "produce su ordine del cliente" ma rilascia in officina ogni ordine appena registrato è push,** anche se la domanda è reale. Il WIP cresce con l'arretrato degli ordini.

L'approccio manifatturiero tradizionale è push. Un sistema di pianificazione, di solito il material requirements planning all'interno di un pacchetto enterprise resource planning (ERP), usa previsioni e dati storici per determinare i volumi di produzione e rilascia gli ordini di lavoro prima di ricevere un ordine del cliente. In un sistema pull, le attività produttive partono solo quando il consumo a valle o un ordine del cliente libera spazio sotto il limite WIP. In breve, un sistema pull è un metodo di controllo della produzione guidato dalla domanda effettiva; i due sistemi differiscono meno nei dati che nel fattore che innesca il lavoro.

### La legge di Little: perché limitare il WIP limita il lead time

John Little ha pubblicato la dimostrazione della formula di teoria delle code L = λW nel 1961 [6]. In termini di stabilimento: WIP medio = throughput × lead time medio, ovvero lead time = WIP ÷ throughput.

**Esempio svolto.** Una cella di lavorazione meccanica spedisce 400 pezzi al giorno. Un conteggio in reparto rileva 3.200 pezzi di WIP tra la sega e il controllo finale. Lead time medio = 3.200 ÷ 400 = 8 giorni. Se un sistema pull limita il WIP a 1.200 pezzi e il throughput resta di 400 al giorno, il lead time medio scende a 1.200 ÷ 400 = 3 giorni. Le macchine non sono diventate più veloci. Semplicemente, i pezzi attendono meno.

La legge di Little vale per le medie di lungo periodo in un sistema stabile [6]. Non dice quanto si può ridurre il WIP prima che il throughput ne risenta. Questo dipende dalla variabilità, ed è per questo che i sistemi pull richiedono un certo margine di buffer e perché le formule di dimensionamento includono termini di sicurezza.

### Push vs. pull: differenze chiave e ibridi

| Criterio | Push (rilascio guidato da MRP) | Pull (kanban, CONWIP, POLCA) |
|---|---|---|
| Trigger per la produzione | Rilascio di ordini pianificati da previsioni o ordini | Consumo o un'autorizzazione WIP libera |
| WIP | Non limitato; segue il piano e i suoi errori | Limitato dal numero di card o autorizzazioni [2] |
| Lead time | Variabile, spesso cresce con il carico | Stabile finché il limite WIP è rispettato (legge di Little) [6] |
| Risposta all'errore di previsione | Sovrapproduzione o carenza | Autocorrettivo entro il campo d'azione del ciclo |
| Esigenze di dati | BOM, cicli di lavorazione, lead time e giacenze accurati | Conteggi accurati dei contenitori, disciplina nell'uso delle card |
| Adatto a | Lead time lunghi, distinte base complesse, basso volume per articolo | Domanda ripetitiva, tempi di riapprovvigionamento brevi |

La maggior parte degli stabilimenti usa soluzioni ibride. Un articolo di IndustryWeek scritto da un fornitore sostiene che una combinazione di push e pull può essere la scelta migliore quando la domanda è volatile [25]. In pratica ciò significa che l'MRP pianifica la capacità e gli acquisti a lungo lead time, mentre kanban o CONWIP controllano il rilascio giornaliero. La sezione sull'ERP qui sotto mostra come. La scelta tra push e pull non è quindi quasi mai una decisione unica per l'intero stabilimento; si prende per codice articolo e per fase di processo.

## Storia: dall'officina meccanica di Toyota alla pratica globale

Il kanban è nato dal Toyota Production System. Toyota attribuisce a Kiichiro Toyoda (1894–1952) il concetto di just-in-time e riferisce che nel 1927 introdusse il flusso a catena di trasporto nell'assemblaggio dei telai e, nel 1938, nella linea di assemblaggio delle carrozzerie allo stabilimento di Koromo [8]. Una didascalia nella pagina TPS di Toyota attribuisce a Taiichi Ohno (1912–1990) il merito di aver "creato la struttura di base del metodo Just-in-Time" [8].

Secondo la voce di Wikipedia sul kanban, Toyota applicò la logica del kanban nell'officina meccanica principale dello stabilimento nel 1953 [10]. Lo stesso articolo afferma che Toyota studiò i supermercati alla fine degli anni Quaranta con l'idea di applicare al reparto produttivo le tecniche di riassortimento degli scaffali; quella frase non ha citazione nella fonte, quindi tratta la data come [unverified: frase senza citazione nella fonte]. L'analogia con il supermercato è così centrale che "supermarket" è diventato il termine lean per indicare un punto di stoccaggio controllato.

La prima descrizione accademica in lingua inglese fu opera di ingegneri Toyota. Sugimori e tre coautori pubblicarono "Toyota production system and Kanban system: Materialization of just-in-time and respect-for-human system" sull'*International Journal of Production Research* nel 1977 [7]. L'articolo individua due caratteristiche: il just-in-time, in cui si producono solo i prodotti necessari, nel momento necessario e nella quantità necessaria, e un sistema di "rispetto per l'uomo", in cui gli operatori esprimono appieno le proprie capacità partecipando alla gestione e al miglioramento del reparto [7]. Il libro di Ohno, *Toyota Production System: Beyond Large-Scale Production*, uscì in inglese nel 1988 [9].

A partire dagli anni Ottanta, i ricercatori occidentali iniziarono ad analizzare e variare il metodo. Spearman, Woodruff e Hopp introdussero il CONWIP nel 1990 come "un'alternativa pull al kanban" [3]. Co e Moosa esaminarono nel 1997 la formula kanban di Toyota [14]. Rajan Suri, che fondò e diresse il Center for Quick Response Manufacturing dell'Università del Wisconsin–Madison dal 1993 al 2007, ideò il POLCA per officine ad alta varietà e basso volume [20][21]. Una rassegna della letteratura del 2010 di Lage Junior e Godinho Filho contò 32 variazioni pubblicate del sistema kanban e rilevò un ampio divario tra proposte teoriche e proposte pratiche [17]. La logica di base del ciclo degli anni Cinquanta è sopravvissuta a tutte queste varianti.

## Come funziona un ciclo kanban, passo dopo passo

Il progetto classico Toyota usa due tipi di cartellino: i kanban di prelievo, che spostano i componenti da un supermercato al consumatore, e i kanban di produzione, che indicano al processo fornitore di realizzare i ricambi [1]. Ecco un ciclo completo tra una linea di assemblaggio e una cella di stampaggio e saldatura che fornisce le staffe.

| Fase | Dove | Cosa succede | Segnale |
|---|---|---|---|
| 1 | Linea di assemblaggio, punto di utilizzo | L'operatore prende l'ultima staffa da un contenitore; il contenitore vuoto va sul rack di ritorno | Il kanban di prelievo viene staccato e collocato nella postazione kanban |
| 2 | Postazione kanban | Un addetto alla movimentazione raccoglie i kanban di prelievo lungo un percorso fisso, ad esempio ogni 30 o 60 minuti | Kanban di prelievo raccolti |
| 3 | Supermercato dopo la cella delle staffe | L'addetto prende un contenitore pieno per ogni kanban di prelievo; il kanban di produzione su quel contenitore viene rimosso e collocato nella postazione dei kanban di produzione | Il kanban di prelievo va sul contenitore pieno; il kanban di produzione va alla cella |
| 4 | Linea di assemblaggio | Il contenitore pieno arriva al suo indirizzo di punto di utilizzo | Il kanban di prelievo viaggia con i componenti |
| 5 | Cella delle staffe | I kanban di produzione vengono allineati in sequenza, spesso su una lavagna heijunka o su una semplice guida | Ogni kanban di produzione autorizza un contenitore |
| 6 | Cella delle staffe | La cella produce esattamente la quantità indicata sul cartellino e rimette il contenitore pieno, con il kanban di produzione allegato, nel supermercato | Kanban di produzione di nuovo sul contenitore |

Due caratteristiche sono facili da trascurare:

- **Il supermercato è il polmone, non la linea.** La linea tiene solo ciò che consuma tra una consegna e l'altra. Il supermercato assorbe la differenza tra il ritmo a lotti della cella e il consumo costante della linea.
- **I cartellini misurano le giacenze.** Se esistono 12 kanban di produzione per la staffa B-200 e 3 sono in attesa alla cella, 9 contenitori sono pieni nel supermercato, in transito o presso la linea. Un rapido conteggio mostra se dei cartellini sono andati persi o se dei contenitori sono stati accumulati.

Una variante più semplice con un solo cartellino elimina il kanban di prelievo: il consumatore prende un contenitore da un magazzino vicino e il contenitore vuoto o un cartellino di produzione torna direttamente al processo fornitore. È più semplice e funziona bene quando fornitore e consumatore sono vicini.

## Tipi di kanban

Il Lean Enterprise Institute distingue due famiglie di base, il kanban di produzione e il kanban di prelievo, con il signal kanban come forma speciale di kanban di produzione e il supplier kanban come forma speciale di kanban di prelievo [1]. Fornitori e manuali aggiungono altre denominazioni, per cui gli elenchi dei diversi tipi di kanban variano da una pagina all'altra. La tabella li raggruppa in base a ciò che autorizzano.

| Tipo | Autorizza | Uso tipico | Note |
|---|---|---|---|
| Kanban di produzione | Il processo a monte a produrre il tipo e la quantità indicati sulla scheda per un processo a valle [1] | Celle e macchine con cambi formato brevi che possono produrre un contenitore alla volta | Una scheda = un contenitore |
| Signal kanban (triangle kanban) | La produzione di un lotto quando le giacenze scendono al punto di riordino, "quando si raggiunge una quantità minima di contenitori" [1] | Presse, stampaggio, trattamento termico, verniciatura: processi con cambi lunghi che devono lavorare a lotti | Appeso al punto di riordino nella pila di contenitori; spesso piastrine metalliche triangolari |
| Kanban di prelievo (move, conveyance kanban) | Il trasferimento dei pezzi a un processo a valle [1] | Tra magazzino a scaffale (supermarket) e linea | Kanban interno o interprocesso [1] |
| Supplier kanban | Il prelievo da un fornitore esterno [1] | Componenti acquistati con consumo regolare | Il LEI osserva che i supplier kanban per fornitori lontani hanno tipicamente assunto forma elettronica [1] |
| Sistema a due cassetti (e a tre cassetti) | Il rifornimento di un cassetto quando è vuoto, mentre il secondo copre il consumo | Viteria, materiali di consumo, componenti C a basso costo | Il cassetto vuoto è il segnale; Wikipedia descrive il sistema a due cassetti come l'origine più semplice del kanban e descrive anche una variante a tre cassetti (linea, magazzino di fabbrica, fornitore) [10] |
| Kanban di emergenza o express | Un rifornimento straordinario una tantum dopo una carenza o un difetto | Recupero da scarti o da una consegna mancata | Va ritirato dopo l'uso; altrimenti il ciclo cresce silenziosamente |
| Kanban una tantum (evento, uso singolo) | Parti aggiuntive per una domanda nota ed eccezionale | Promozioni, un ordine di assistenza, la realizzazione di un prototipo | Microsoft Dynamics 365 gestisce questi casi come kanban a uso singolo contrassegnati da una regola a quantità fissa, più event kanban per domanda eccezionale superiore a una quantità prefissata [15] |
| Kanban passante (tunnel) | Produzione e prelievo combinati in un'unica scheda | Due processi strettamente collegati che funzionano come uno, ad esempio forgiatura e trattamento termico | Citato da Cin7 tra i suoi sei tipi; la terminologia varia tra le fonti |
| Scheda CONWIP | Il rilascio di un lavoro qualsiasi in una linea; la scheda torna all'inizio della linea quando un lavoro è completato [5] | Linee con molti codici articolo ma un percorso comune | Non specifica per componente, vedere la sezione CONWIP |
| E-kanban | Uno qualsiasi dei precedenti come messaggio elettronico | Fornitori lontani, cicli di grandi dimensioni, rifornimento integrato con l'ERP | Elimina gli errori dovuti a schede smarrite e a inserimenti manuali [10] |

### Quale tipo di kanban per quale ciclo

| Situazione | Tipo consigliato | Perché |
|---|---|---|
| Cella fornitrice accanto alla linea, cambio formato sotto i 10 minuti | Kanban di produzione, scheda singola | Può produrre contenitore per contenitore |
| Reparto presse con cambi da 45 minuti che alimenta più linee | Signal kanban con un magazzino a scaffale | La dimensione del lotto è determinata dall'economia dei cambi, non dalla dimensione del contenitore |
| Magazzino centrale che alimenta più celle | Kanban di prelievo più un percorso (milk run) | Separa il trasferimento dalla produzione |
| Componenti standard acquistati, consumo regolare, fornitore a 800 km | E-kanban per fornitori | Le schede cartacee viaggiano troppo lentamente |
| Viti, rondelle, etichette, guanti | Due cassetti | Segnale più economico possibile, nessun conteggio |
| Molte varianti su un unico percorso, domanda irregolare per variante | Schede CONWIP | Schede specifiche per componente riempirebbero il reparto di scorte a lento movimento |
| Job shop con molti percorsi | Schede POLCA | Controlla il flusso tra coppie di celle |

## Le sei regole del kanban di Toyota

Quasi ogni pagina web elenca "sei regole". Circolano due versioni, ed è utile conoscerle entrambe.

**Versione 1, come riassunta su Wikipedia** (citando Toyota) [10]:

1. Ogni processo emette richieste (kanban) ai propri fornitori nel momento in cui consuma le proprie scorte.
2. Ogni processo produce in base alla quantità e alla sequenza delle richieste in arrivo.
3. Nessun articolo viene fabbricato o trasportato senza una richiesta.
4. La richiesta associata a un articolo è sempre allegata ad esso.
5. I processi non devono inviare articoli difettosi, così da garantire che i prodotti finiti siano privi di difetti.
6. Limitare il numero di richieste in sospeso rende il processo più sensibile e rivela le inefficienze.

**Versione 2, dal *Toyota Production System Handbook* (1973, tradotto da Mark Warren), come presentata da Christoph Roser** [11]:

1. Non inviare prodotti difettosi al processo produttivo successivo.
2. Il processo produttivo successivo viene a prelevare.
3. Produrre soltanto la quantità prelevata dal processo successivo.
4. Ridurre le fluttuazioni.
5. Il kanban è uno strumento di messa a punto fine.
6. Stabilizzare e razionalizzare il processo produttivo.

Roser osserva che "esistono diverse versioni delle regole Toyota per il kanban" e aggiunge una regola appresa presso Toyota che non compare in nessuno dei due elenchi: ogni materiale nel sistema deve avere una scheda kanban applicata [11]. Egli sottolinea inoltre che la versione del manuale mescola prerequisiti (assenza di difetti, processi stabili) con regole operative [11].

### Che cosa significano le regole in reparto

| Regola (combinata) | Comportamento in reparto | Violazione tipica | Conseguenza |
|---|---|---|---|
| Il downstream preleva | Il consumatore o il movimentatore prende; il fornitore non consegna senza richiesta | La cella a monte "aiuta" spingendo contenitori in più | I supermercati traboccano, le schede non mostrano più la giacenza reale |
| Produrre solo ciò che è stato prelevato | I kanban di produzione stabiliscono quantità e sequenza | Far funzionare un intero turno di produzione "mentre si fa il cambio" | Sovrapproduzione nascosta, uno dei sette sprechi di Ohno |
| Nessun pezzo senza scheda | Ogni contenitore pieno porta la propria scheda | Contenitori senza etichetta in un angolo, "scorta di sicurezza" | Scorta in circolo sconosciuta; i conteggi delle schede sono falsi |
| La scheda resta con i pezzi | Staccarla solo nel momento definito | Schede in tasca, sulle scrivanie, nei cassetti | Schede perse = riapprovvigionamento perso = rottura di stock |
| Nessun difetto a valle | I pezzi difettosi vengono fermati e segnalati alla fonte | Pezzi difettosi mescolati in un contenitore pieno | Il consumatore resta senza pezzi con un contenitore "pieno" |
| Ridurre le schede gradualmente | Togliere una scheda, osservare, risolvere, ripetere | Tagliare metà delle schede in una sola volta | Arresti di linea, perdita di fiducia, ritorno alla spinta |
| Livellare e stabilizzare | La domanda al pacemaker è livellata; i processi sono capaci | Forti oscillazioni giornaliere all'assemblaggio finale | Il kanban amplifica le oscillazioni a monte (vedi heijunka) |

La regola 6 della versione 1 è quella che gli stabilimenti occidentali più spesso applicano male. Roser sostiene, in una risposta ai lettori, che Toyota "ha a) molti meno problemi e b) molta più manodopera per risolverli", quindi gli stabilimenti privi di quella capacità di risoluzione dei problemi dovrebbero mantenere schede sufficienti invece di tagliarle per provocare problemi che non sanno ancora risolvere [12]. Rimuovere una scheda è un esperimento. Eseguirlo solo quando qualcuno è pronto a correggere ciò che fa emergere.

## Come calcolare il numero di kanban: formule ed esempi svolti

Questa è la domanda che la maggior parte di chi cerca informazioni si pone e che la maggior parte delle pagine tralascia. Le sezioni seguenti partono dalla formula di base, mostrano come la pratica professionale la affina, confrontano le formule usate dai fornitori di ERP e da altre guide sugli stessi dati e svolgono sei casi. Tutti e sei gli esempi di kanban sono illustrativi: usano dati tipici di stabilimento e non esempi reali di un'azienda specifica, in modo che tu possa seguire ogni passaggio e sostituire i numeri con i tuoi.

Prima un avvertimento, nelle parole di Roser: "Il calcolo del kanban non è altro che una stima molto approssimativa basata su molte ipotesi" [12]. La formula fornisce un punto di partenza. Il ciclo viene poi regolato osservandone il funzionamento.

### La formula di base

> **Numero di kanban N = (D × L × (1 + α)) ÷ C**, arrotondato per eccesso
>
> D = domanda media per unità di tempo (ad esempio pezzi al giorno)
> L = tempo di approvvigionamento nella stessa unità di tempo: dal momento in cui un contenitore viene svuotato (o la sua scheda rilasciata) fino al ritorno del contenitore pieno nel punto di stoccaggio
> α = fattore di sicurezza (ad esempio 0,10 per il 10 percento)
> C = quantità per contenitore (pezzi per kanban)

Questa struttura, domanda durante il tempo di approvvigionamento più una quota di sicurezza, divisa per la quantità per contenitore, è ciò che Microsoft Dynamics 365 Supply Chain Management utilizza come base, con un "+1" aggiunto nelle sue varianti principali [15]. Smartsheet usa una variante con lo stock di sicurezza espresso in giorni: C = [D × (L + SSD)] ÷ S, dove SSD sono i giorni di stock di sicurezza e S la quantità per cassetta [23]. La pratica dello stesso Toyota, come analizzata da Co e Moosa, fissa il numero di kanban a partire dalla domanda media durante un ciclo d'ordine moltiplicata per un fattore costante di sovrapianificazione [14].

**Esempio svolto 1: ciclo di base.** La linea di assemblaggio finale utilizza la staffa B-200. Domanda giornaliera D = 960 pezzi su due turni. Tempo di approvvigionamento dalla cella delle staffe L = 0,25 giorni. Fattore di sicurezza α = 0,10. Quantità per contenitore C = 40.

N = 960 × 0,25 × 1,10 ÷ 40 = 264 ÷ 40 = 6,6, arrotondato per eccesso a **7 kanban**.

Il ciclo non può mai contenere più di 7 × 40 = 280 staffe, pari a 280 ÷ 960 = 0,29 giorni di domanda. Secondo la legge di Little, il tempo medio che una staffa trascorre nel ciclo è al massimo di circa 0,29 giorni, cioè circa 4,4 ore lavorative su una giornata di 15 ore [6].

### Da dove deriva davvero L: scomposizione del tempo di approvvigionamento

La formula di base nasconde l'input più difficile. L non è il tempo ciclo della macchina che alimenta la linea. Roser scompone il tempo di approvvigionamento nel tempo di attraversamento del flusso di materiale più i ritardi informativi: tempo di attesa del kanban fino al ritiro della scheda, attesa finché si sono accumulati abbastanza kanban per formare un lotto, tempo in coda dietro ad altri codici, cambi di produzione e trasporto [12]. Aggiunge poi kanban extra per la formazione dei lotti, per l'attesa dietro altri lotti, per il raggruppamento dei clienti e per la domanda di picco, più un margine di sicurezza facoltativo [13].

| Componente del tempo di approvvigionamento | Come misurarlo | Punto cieco tipico |
|---|---|---|
| Tempo di attesa della scheda al posto kanban | Intervallo di raccolta del percorso; usare l'intervallo completo per una stima prudenziale | Supporre che le schede viaggino istantaneamente |
| Attesa della formazione di un lotto | Se la cella lavora lotti di n contenitori, fino a n – 1 schede attendono | Ignorare le dimensioni dei lotti presso il fornitore |
| Coda dietro altri codici | Osservare la sequenza della cella; contare i lotti altrui davanti | Supporre che la cella sia libera quando arriva la scheda |
| Cambio di produzione | Studio dei tempi o base SMED | Escluderli perché "sono brevi" |
| Tempo di lavorazione di un lotto | Tempo ciclo × quantità del lotto | Usare un solo pezzo invece dell'intero lotto |
| Trasporto e collocazione | Tempo di percorso fino al supermercato | Dimenticare attese dei carrelli elevatori e pause di turno |

**Esempio svolto 2: la stessa staffa con il tempo di approvvigionamento completo.** Due turni danno 900 minuti di tempo disponibile, quindi takt = 900 ÷ 960 = 0,9375 minuti (56,25 secondi) per staffa.

- Raccolta delle schede ogni 60 minuti: prudenzialmente 60 minuti di attesa
- Coda alla cella delle staffe dietro altri codici: 90 minuti
- Lavorazione di un contenitore: 40 pezzi × 30 secondi = 20 minuti
- Trasporto e collocazione: 15 minuti
- Tempo di approvvigionamento senza effetti di lotto: 60 + 90 + 20 + 15 = 185 minuti

Pezzi consumati durante quel tempo: 185 ÷ 0,9375 = 197,3 pezzi, cioè 197,3 ÷ 40 = 4,93 kanban.

La cella esegue lotti di quattro contenitori per limitare i cambi formato. Fino a tre cartellini possono attendere che si formi un lotto, quindi aggiungi 3 kanban: 4,93 + 3 = 7,93. Aggiungi un margine di sicurezza del 10 percento sulla parte basata sul tempo (0,49): 8,42, arrotondato per eccesso a **9 kanban**.

La formula di base ha dato 7. La differenza di due cartellini dipende quasi interamente dalla dimensione del lotto nella cella fornitrice. Per questo SMED, che consente lotti più piccoli, è la leva abituale per ridurre i kanban, non regole più stringenti. Per approfondire i cambi formato, consulta la [guida SMED e riduzione dei cambi formato](https://www.m365.fm/en/learn/smed-changeover-reduction/).

### Stessi dati, formule diverse

Spesso negli stabilimenti si discute di quale sia la formula "giusta", quando in realtà il disaccordo riguarda i dati di input. Questa tabella applica le formule pubblicate ai dati dell'esempio 1 (D = 960 al giorno, L = 0,25 giorni, α = 0,10, C = 40). Per la formula di Smartsheet, il fattore di sicurezza del 10 percento è convertito in giorni di sicurezza: 0,1 × 0,25 = 0,025 giorni.

| Fonte | Formula come pubblicata | Calcolo | Risultato |
|---|---|---|---|
| Forma di base da manuale | D × L × (1 + α) ÷ C | 960 × 0,25 × 1,1 ÷ 40 = 6,6 | 7 |
| Smartsheet [23] | D × (L + SSD) ÷ S | 960 × (0,25 + 0,025) ÷ 40 = 6,6 | 7 |
| Microsoft Dynamics 365 SCM, senza scorta di sicurezza [15] | (domanda media × tempo di approvvigionamento × (fattore di sicurezza + 1)) ÷ quantità per unità di movimentazione + 1, arrotondato per eccesso | 6,6 + 1 = 7,6 | 8 |
| Oracle JD Edwards, Equazione 1 [16] | dimensione kanban = domanda giornaliera massima × (giorni di tempo di consegna + giorni di scarto della scansione) + scorta di sicurezza; cartellini = dimensione kanban ÷ dimensione del contenitore | con domanda giornaliera massima 1.100, tempo di consegna 0,25 giorni, scarto della scansione 0, scorta di sicurezza 40: (1.100 × 0,25 + 40) ÷ 40 = 7,9 | 8 |
| Roser per fasi [12][13] | tempo di riapprovvigionamento ÷ takt ÷ pezzi per kanban + kanban aggiuntivi + sicurezza | vedi esempio 2 | 9 |

I risultati vanno da 7 a 9. La differenza deriva da tre scelte: se si aggiunge un cartellino extra per il contenitore in fase di consumo (il +1 di Dynamics 365), se si usa la domanda di picco o quella media (JD Edwards usa la domanda massima del periodo nella finestra MRP [16]), e se si tengono in conto gli effetti della dimensione del lotto (Roser [13]). Decidete questi tre punti una volta sola, scrivetele nello standard kanban e applicatele a tutti i circuiti.

### Esempio di calcolo 3: kanban per il fornitore

Per i componenti acquistati, il tempo di riapprovvigionamento comprende l'intervallo di ordinazione (ogni quanto vengono inviati cartellini o segnali), il tempo di consegna del fornitore e il tempo di trasporto. Una forma comune è:

> **N = D × (intervallo di ordinazione + tempo di consegna del fornitore + tempo di sicurezza) ÷ C**

Un alloggiamento viene usato a 300 pezzi al giorno. I segnali vanno al fornitore una volta al giorno (intervallo di ordinazione 1 giorno), il fornitore impiega 3 giorni dal segnale alla consegna e lo stabilimento vuole 1 giorno di tempo di sicurezza. I contenitori contengono 100 pezzi.

N = 300 × (1 + 3 + 1) ÷ 100 = 1.500 ÷ 100 = **15 kanban**. La giacenza massima del circuito è di 1.500 pezzi, ovvero 5 giorni di consumo, gran parte dei quali si trova nel processo del fornitore o sul camion e non nello stabilimento.

Se lo stabilimento passa da segnali giornalieri a segnali due volte al giorno (intervallo di ordinazione 0,5 giorni), N = 300 × 4,5 ÷ 100 = 13,5, quindi 14 kanban. Se il tempo di consegna del fornitore scende da 3 a 2 giorni, N = 300 × 4 ÷ 100 = 12. Il tempo di consegna del fornitore è di solito la leva più importante.

### Esempio di calcolo 4: kanban di segnale per un processo a lotti

I kanban di segnale si dimensionano in modo diverso, perché il processo fornitore produce un lotto molto più grande di un singolo contenitore. Servono due valori: il punto di attivazione (quando avviare un lotto) e la dimensione del lotto (quanto produrre).

Una pressa di stampaggio fornisce il componente P-17 insieme ad altri componenti. La domanda è di 1.200 pezzi al giorno su 900 minuti disponibili, cioè 1,333 pezzi al minuto. I contenitori contengono 60 pezzi, quindi la linea usa 20 contenitori al giorno. Poiché la pressa impiega 40 minuti per il cambio formato, la pianificazione ha fissato un lotto di 10 contenitori (600 pezzi).

- Attesa della pressa (altri componenti davanti): fino a 120 minuti
- Cambio formato: 40 minuti
- Esecuzione di 600 pezzi a 3 secondi ciascuno: 30 minuti
- Trasferimento al magazzino a scaffali (supermarket): 10 minuti
- Tempo di riapprovvigionamento: 200 minuti

Domanda durante il riapprovvigionamento = 200 × 1,333 = 267 pezzi = 4,44 contenitori. Con un contenitore di sicurezza, il punto di attivazione è 5,44, arrotondato per eccesso a 6 contenitori. Il kanban a triangolo viene appeso al sesto contenitore dal fondo della pila. Quando la linea arriva a quel punto, la pressa riceve il suo segnale.

Inventario massimo = punto di riordino + lotto = 6 + 10 = 16 contenitori = 960 pezzi, circa 0,8 giorni di domanda. Se lo SMED riduce il cambio a 10 minuti e la pianificazione riduce il lotto a 4 contenitori, l'inventario massimo scende a circa 6 + 4 = 10 contenitori, ipotizzando che la coda della pressa resti invariata. La logica di dimensionamento dei lotti è trattata nella [guida al dimensionamento dei lotti](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/).

### Esempio svolto 5: sistema a due contenitori per i componenti C

Le viti M6 vengono utilizzate per circa 1.500 pezzi a settimana presso una postazione di lavoro. Il distributore riempie un contenitore vuoto entro una settimana dal momento in cui il contenitore vuoto viene collocato sullo scaffale di prelievo. Ogni contenitore deve coprire la domanda durante il rifornimento più un margine.

Dimensione del contenitore = 1.500 × 1 settimana × 1,2 = 1.800 viti. Due contenitori da 1.800 contengono complessivamente 3.600 viti. Quando il primo contenitore è vuoto, l'operatore passa al secondo e colloca il contenitore vuoto, con la sua etichetta, sullo scaffale. Nessuno conta le viti. Se il secondo contenitore si esaurisce regolarmente prima che il primo ritorni, la dimensione del contenitore o il tempo di rifornimento sono errati; la soluzione è misurare entrambi, non aggiungere informalmente un terzo contenitore.

### Esempio svolto 6: quanto è sensibile il circuito?

Usando l'esempio 1 come caso base (D = 960, L = 0,25 giorni, α = 0,10, C = 40), la tabella mostra quanti kanban fornisce la formula di base quando cambia un dato di input.

| Variazione | N (non arrotondato) | Kanban | Inventario massimo del circuito |
|---|---|---|---|
| Caso base | 6,6 | 7 | 280 |
| Lead time di rifornimento dimezzato a 0,125 giorni | 3,3 | 4 | 160 |
| Lead time di rifornimento raddoppiato a 0,5 giorni | 13,2 | 14 | 560 |
| Quantità per contenitore dimezzata a 20 | 13,2 | 14 | 280 |
| Quantità per contenitore raddoppiata a 80 | 3,3 | 4 | 320 |
| Domanda aumentata del 25 per cento a 1.200 | 8,25 | 9 | 360 |
| Fattore di sicurezza 0,25 invece di 0,10 | 7,5 | 8 | 320 |

Da ciò derivano due lezioni. Primo, il lead time di rifornimento ha l'effetto più forte sull'inventario: dimezzarlo riduce l'inventario massimo da 280 a 160. Secondo, contenitori più piccoli non riducono molto, da soli, l'inventario massimo (14 × 20 = 280); servono soprattutto a rendere il flusso più regolare e i problemi visibili prima, mentre raddoppiare i contenitori a 80 fa salire l'inventario perché l'arrotondamento genera più sprechi.

### Arrotondamento, minimi e ricalcolo

- **Arrotondare per eccesso, poi valutare.** Arrotondare 6,6 a 7 è ovvio. Roser arrotonderebbe per difetto un risultato di 61,2 kanban in un circuito grande, ma per eccesso 61,9 [13]. Nei circuiti piccoli, arrotondare sempre per eccesso.
- **Minimo di due kanban.** Un circuito con una sola scheda blocca il consumatore ogni volta che la scheda è in transito. Due è il minimo pratico; alcuni stabilimenti adottano tre come regola interna.
- **Ricalcolare secondo un calendario.** La domanda cambia. Ricalcolare le dimensioni dei circuiti mensilmente o quando la previsione della domanda cambia oltre una soglia concordata (per esempio il 15 per cento). I moduli kanban dei sistemi ERP possono farlo a partire dai periodi di domanda [15].
- **Aggiungere e rimuovere schede in modo formale.** Ogni modifica passa attraverso la persona che gestisce l'elenco principale dei kanban, con una data. Altrimenti le schede si moltiplicano.
- **Pianificare esplicitamente i picchi.** Per i picchi stagionali, aggiungere schede temporanee di colore diverso con una data di fine, oppure usare kanban una tantum [15].

## Supermercati, corsie FIFO e processo pacemaker

Le card sono la parte visibile di un sistema pull. La sua struttura viene decisa prima, sulla mappa della catena del valore allo stato futuro: dove collocare i supermercati, dove collegare i processi con corsie FIFO e quale singolo processo riceve la schedulazione. Se non avete ancora disegnato quella mappa, iniziate dalla [guida alla value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/); i simboli kanban (kanban di produzione, kanban di prelievo, kanban di segnale, post kanban) sono spiegati lì.

### Tipi di sistemi pull: tre forme di base

| Forma | Come funziona | Adatto a | Scorta mantenuta |
|---|---|---|---|
| Pull da supermercato (pull di reintegro) | Ogni processo mantiene un supermercato dei propri output; il processo a valle preleva, quello a monte reintegra ciò che è stato prelevato | Molti codici ricorrenti con domanda stabile | Ogni codice attivo è a scorta |
| Pull sequenziale | Gli ordini vengono rilasciati all'inizio di una catena nella sequenza in cui devono essere costruiti; i processi sono collegati da corsie FIFO con una quantità massima | Molte varianti, basso volume per variante, lead time breve e prevedibile | Poco o nessuno stock di prodotto finito; WIP limitato dalla dimensione delle corsie |
| Pull misto | Pezzi ad alta rotazione nei supermercati, pezzi a bassa rotazione costruiti su ordine in sequenza | La maggior parte degli stabilimenti reali | Scorta solo per i pezzi ad alta rotazione |

### Segmentare i codici prima di progettare i loop

Non ogni codice appartiene a un supermercato. Una suddivisione pratica usa volume e regolarità della domanda, spesso chiamate runner, repeater e stranger.

| Segmento | Profilo (soglie di esempio, definitele voi) | Metodo di controllo |
|---|---|---|
| Runner | Domanda ogni giorno, bassa variazione (ad esempio coefficiente di variazione inferiore a 0,5) | Supermercato con kanban di produzione o di segnale |
| Repeater | Domanda la maggior parte delle settimane, variazione moderata | Supermercato con meno card, oppure make-to-order con un piccolo buffer FIFO |
| Stranger | Sporadici, specifici per cliente o nuovi | Make to order, rilasciati tramite autorizzazione CONWIP o POLCA, oppure pianificati con MRP |

Il coefficiente di variazione è la deviazione standard della domanda giornaliera (o settimanale) divisa per la sua media. Un pezzo con media di 100 al giorno e deviazione standard di 30 ha CV = 0,3. Un pezzo con media di 10 al giorno e deviazione standard di 15 ha CV = 1,5 ed è un cattivo candidato al kanban: il suo loop dovrebbe contenere abbastanza scorta per picchi rari, quindi per la maggior parte del tempo i contenitori resterebbero fermi.

### Progettare un supermercato

| Punto di progetto | Regola pratica | Perché |
|---|---|---|
| Collocazione | Accanto al processo fornitore, non al consumatore | Il fornitore vede la propria scorta e la reintegra; l'addetto preleva |
| Indirizzamento | Ogni codice ha un indirizzo fisso (corsia, scaffale, livello, posizione) stampato sulla card [1] | I contenitori smarriti diventano visibili; il reintegro è rapido |
| Capacità | Posizioni fisiche per esattamente il numero massimo di contenitori del loop, non di più | La sovrapproduzione non ha dove andare; diventa visibile |
| Direzione del flusso | Carico dal retro, prelievo dal fronte (scaffali a flusso gravitazionale) | Primo entrato, primo uscito by design |
| Max/min visivo | Segni colorati o posizione del kanban di segnale sullo scaffale | Chiunque può vedere lo stato senza un sistema |
| Standard del contenitore | Contenitore concordato per codice con quantità fissa; peso ergonomico | Conteggio per contenitori invece che per pezzi |
| Sicurezza ed ergonomia | Tenere i contenitori pesanti tra altezza del ginocchio e della spalla; verificare sollevamento e raggiungimento con le linee guida ergonomiche di OSHA [28] | Gli addetti ripetono questi movimenti centinaia di volte per turno |

### Corsie FIFO: dimensionare la coda

Una corsia FIFO è una coda con quantità massima tra due processi. Quando è piena, il processo fornitore si ferma; quando è vuota, il consumatore attende. A differenza di un supermercato, non contiene scorta per codice, solo una sequenza di lavori.

**Esempio di dimensionamento.** Una linea di verniciatura prende i lavori da una cella di saldatura. La saldatura produce circa un lavoro ogni 10 minuti; la verniciatura consuma alla stessa velocità media ma si ferma per cambi colore di 90 minuti due volte per turno. La corsia FIFO deve assorbire l'output della saldatura durante un cambio colore: 90 ÷ 10 = 9 lavori. Con un margine di 3, la corsia contiene 12 lavori. Per la legge di Little, un lavoro attende al massimo circa 12 × 10 = 120 minuti nella corsia [6].

Se la corsia è spesso piena, la verniciatura è il vincolo o il cambio colore è troppo lungo. Se è spesso vuota, il problema è la saldatura. In entrambi i casi, la corsia rende il problema visibile. Questo è il suo compito.

### Il pacemaker: un punto di pianificazione

In un sistema pull, solo un processo riceve un programma di produzione: il pacemaker. Di solito è l'assemblaggio finale o l'ultimo processo a flusso continuo prima della spedizione. Tutto ciò che sta a monte segue i segnali kanban; tutto ciò che sta a valle scorre in FIFO. La pianificazione del pacemaker è il punto in cui la [guida alla pianificazione della produzione e all'APS](https://www.m365.fm/en/learn/production-scheduling-aps/) incontra questo argomento: l'APS o il pianificatore decidono cosa il pacemaker produce e in quale ordine, mentre i cicli kanban decidono cosa il resto dello stabilimento reintegra.

### Il percorso dell'addetto alla movimentazione

I supermercati richiedono una persona che sposti cartellini e contenitori secondo un ciclo fisso. Questo ruolo viene spesso chiamato water spider o mizusumashi. Il percorso è cronometrato in base al pitch (vedi sotto): a ogni intervallo di pitch, l'addetto ritira la successiva istruzione di produzione presso la cassetta heijunka, la consegna, raccoglie i contenitori vuoti e i kanban di prelievo, e porta i contenitori pieni alla linea. Un percorso fisso rende noto l'intervallo di raccolta della formula di dimensionamento, invece di una stima. Cronometrate il percorso insieme all'addetto e prevedete un margine per ritardi e pause; un percorso che non entra mai nel pitch è sovraccarico (muri), e verrà saltato proprio quando la linea è più carica. Per i percorsi interni allo stabilimento e i milk run più in dettaglio, consultate la [guida alla logistica interna](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/).

## Heijunka: livellare il programma da cui dipende il kanban

Il kanban reagisce al consumo. Se il pacemaker produce 300 unità del modello A il lunedì e nessuna il martedì, ogni ciclo a monte per il modello A vede prima un picco, poi il nulla. I cicli devono essere dimensionati per il picco, e le scorte crescono. Livellare il programma del pacemaker impedisce tutto questo.

Il Lean Enterprise Institute definisce heijunka come "livellamento del tipo e della quantità di produzione su un periodo di tempo fisso" [18]. I suoi due esempi sono il riferimento standard:

- **Livellamento dei volumi:** un produttore riceve 500 ordini a settimana, con un range da 200 il lunedì a 50 il mercoledì e il venerdì, mantiene un piccolo buffer di prodotti finiti vicino alla spedizione e produce un ritmo costante di 100 al giorno [18].
- **Livellamento del mix:** con una domanda settimanale di 5 A, 3 B, 2 C e 2 D, un produttore di massa esegue prima tutti gli A, poi tutti i B; un produttore snello intercala i modelli in una sequenza ripetitiva [18].

LEI elenca i benefici come tempi di attraversamento più brevi, un consumo più regolare dei componenti che alleggerisce la domanda sui fornitori, lotti più piccoli che limitano la diffusione di un difetto e carichi di lavoro più uniformi per gli operatori [18].

### Pitch: l'unità di tempo di un sistema pull

LEI definisce il pitch come "il tempo necessario in un'area di produzione per realizzare un contenitore di prodotti", calcolato come takt time × quantità per contenitore; con un takt di un minuto e 20 pezzi per contenitore, il pitch è di 20 minuti [19].

### Esempio svolto: una cassetta heijunka per la linea dei staffe

Proseguiamo con la linea a due turni della sezione di dimensionamento: takt 0,9375 minuti, contenitori da 40 pezzi.

- Pitch = 0,9375 × 40 = 37,5 minuti
- Slot al giorno = 900 ÷ 37,5 = 24 (12 per turno)
- Domanda giornaliera 960 pezzi = 24 contenitori

La linea realizza quattro modelli con una domanda giornaliera di A = 480, B = 240, C = 160 e D = 80 pezzi, cioè 12, 6, 4 e 2 contenitori al giorno, ovvero 6, 3, 2 e 1 per turno.

Un programma a lotti per turno eseguirebbe A A A A A A B B B C C D. Un programma livellato distribuisce ogni modello lungo il turno:

| Slot (ogni 37,5 min) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Modello | A | B | A | C | A | B | A | C | A | B | A | D |

Verifica dei conteggi: A compare 6 volte, B 3, C 2, D 1. Nella cassetta heijunka, ogni slot contiene il kanban di produzione per un contenitore. L'addetto preleva un kanban ogni 37,5 minuti. Se un kanban è ancora nella cassetta quando inizia lo slot successivo, la linea è in ritardo, e tutti possono vedere di quanto.

La sequenza livellata richiede 11 cambi modello per turno invece di 3. Ciò è economicamente sostenibile solo se i cambi al pacemaker richiedono secondi o pochi minuti, ed è il motivo concreto per cui SMED viene prima del livellamento del mix. La [guida alla lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) indica la sequenza generale: stabilità prima del flusso, flusso prima del pull, pull prima del livellamento. In pratica, il livellamento dei volumi al pacemaker spesso parte insieme ai primi cicli kanban, e il livellamento fine del mix segue quando i cambi lo consentono.

### Cosa succede a monte quando si livella

Confronta le staffe del modello D. Con il programma a lotti, i 40 pezzi di D vengono consumati in un unico blocco di 37,5 minuti alla fine del turno, mentre il ciclo deve coprire una domanda di 80 al giorno in al massimo due picchi. Con il programma livellato, il consumo resta di 80 al giorno, ma distribuito lungo la giornata. La domanda di picco durante il tempo di riapprovvigionamento diminuisce, e con essa diminuisce il margine di sicurezza necessario. Su decine di codici articolo, questa differenza è spesso maggiore di qualsiasi ottimizzazione del numero di cartellini.

## Oltre il kanban: CONWIP, POLCA e drum-buffer-rope

I cicli kanban specifici per codice articolo funzionano quando ogni codice ha una domanda regolare. Quando una linea produce centinaia di varianti, un supermercato per ciascuna conserverebbe più scorta di quanta ne avesse lo stabilimento prima. Tre alternative mantengono il limite di WIP senza stoccare ogni codice articolo.

### CONWIP: un unico limite di WIP per l'intera linea

CONWIP sta per constant work in process (lavoro in corso costante). Spearman, Woodruff e Hopp lo descrissero nel 1990 sull'*International Journal of Production Research* come "un nuovo sistema produttivo a trazione", sostenuto da argomentazioni teoriche e studi di simulazione [3]. Il meccanismo: nessun lavoro può entrare nella linea senza un cartellino; quando un lavoro finito lascia l'ultima stazione, il suo cartellino torna alla prima stazione e autorizza il lavoro successivo [5]. All'interno della linea, i lavori fluiscono in ordine FIFO come in una linea a spinta.

Utile è il confronto riportato nella voce di Wikipedia dedicata a CONWIP: il kanban mantiene un controllo più stretto del WIP tramite cartellini individuali a ciascuna postazione, mentre CONWIP è più facile da implementare e regolare perché un solo insieme di cartellini gestisce il WIP del sistema [5]. Nel 2022 gli stessi tre autori hanno pubblicato "CONWIP Redux", che riflette su trent'anni di sviluppo e chiarisce alcuni fraintendimenti diffusi [4].

**Esempio svolto: impostazione del livello CONWIP.** Una linea a cinque stazioni ha una cadenza del collo di bottiglia di 60 unità all'ora. Il tempo di lavorazione grezzo di un'unità attraverso tutte e cinque le stazioni, senza alcuna attesa, è di 25 minuti (0,417 ore). Secondo la legge di Little, il WIP necessario a mantenere occupato il collo di bottiglia in assenza di qualsiasi variabilità è 60 × 0,417 = 25 unità [6]. Le linee reali presentano variabilità, quindi lo stabilimento parte con 35 cartellini e osserva la produttività.

Se la produttività si mantiene intorno alle 60 unità all'ora, il lead time medio = 35 ÷ 60 = 0,58 ore, circa 35 minuti. Successivamente, il team rimuove cartellini a gradini di due. Se la produttività scende sotto la cadenza del collo di bottiglia con 29 cartellini, si torna a 31. Confrontalo con una linea senza limite che mantiene 150 unità: stessa produzione, lead time 150 ÷ 60 = 2,5 ore.

### POLCA: la trazione per produzioni ad alto mix e bassi volumi

POLCA sta per paired-cell overlapping loops of cards with authorization (cicli di cartellini sovrapposti tra celle accoppiate con autorizzazione) [21]. Rajan Suri lo ha ideato nell'ambito del suo lavoro presso il Center for Quick Response Manufacturing della University of Wisconsin–Madison [21]. La sua *Practitioner's Guide to POLCA* lo descrive come "un sistema di controllo visivo basato su cartellini che gestisce il flusso dei lavori attraverso il reparto produttivo", "particolarmente adatto alle aziende che producono articoli ad alto mix, bassi volumi e personalizzati", e osserva che il kanban "non funziona bene con produzioni a basso volume o su misura" [20].

Il meccanismo in breve: ogni coppia di celle che si passano lavoro condivide un ciclo di cartellini (ad esempio "Fresatura–Saldatura"). Un lavoro può iniziare in cella di fresatura solo quando la sua data di rilascio è arrivata e un cartellino Fresatura–Saldatura è libero, segnale che la saldatura ha capacità per accoglierlo. Quando la saldatura completa il lavoro, il cartellino torna alla fresatura. Poiché i cicli si sovrappongono, ogni cella è coperta dai cartellini delle sue coppie a monte e a valle. POLCA combina le date di rilascio pianificate dall'ERP con un segnale di capacità proveniente dal reparto.

### Drum-buffer-rope: la trazione dal vincolo

Drum-buffer-rope (DBR) è il metodo di controllo della produzione della teoria dei vincoli, associato a Eliyahu Goldratt (fonti nella guida alla teoria dei vincoli collegata sotto). Il vincolo (il drum) stabilisce il ritmo; un buffer temporale lo protegge dai disturbi a monte; la rope lega il rilascio del materiale al consumo del drum. DBR limita il WIP solo a monte del vincolo, il che lo rende un sistema a trazione nel senso di Hopp e Spearman [2]. La guida di Veryable elenca CONWIP e DBR come le due principali alternative al kanban [24]. DBR è spiegato in dettaglio nella [guida alla teoria dei vincoli](https://www.m365.fm/en/learn/theory-of-constraints/).

### Tabella decisionale: quale sistema pull è adatto?

| Criterio | Kanban (supermercato) | CONWIP | POLCA | Drum-buffer-rope |
|---|---|---|---|---|
| Mix di prodotti | Basso o medio, codici articolo ripetuti | Medio o alto, percorso comune | Mix elevato, personalizzati, molti percorsi | Qualsiasi, con un vincolo chiaro |
| Domanda per codice articolo | Regolare | Irregolare va bene | Irregolare va bene | Irregolare va bene |
| Stocca prodotti finiti | Sì, nei supermercati | No (è possibile la produzione su ordine) | No | No; buffer temporale prima del vincolo |
| Controllo del WIP | Per anello, per codice articolo | Intera linea | Tra ogni coppia di celle | Prima del vincolo |
| Richiede date di rilascio dalla pianificazione | No per i prodotti a rotazione | Sì, una sequenza di backlog | Sì, date di rilascio | Sì, programma del vincolo |
| Facilità di impostazione | Media (molti anelli da dimensionare) | Facile (un numero per linea) | Media (anelli per coppia di celle) | Media (il vincolo deve essere stabile) |
| Guasto tipico | Supermercati per articoli sconosciuti | Sequenza errata nel backlog | Troppi anelli, confusione tra i cartellini | Il vincolo si sposta con il mix |

La maggior parte degli stabilimenti combina i sistemi: kanban per i prodotti a rotazione e i componenti C acquistati, CONWIP o POLCA per le varianti su ordine, e DBR dove una risorsa limita chiaramente la produzione.

## E-kanban e interazione ERP/MRP

### Che cos'è l'e-kanban

Il kanban elettronico sostituisce i cartellini fisici con segnali elettronici. Wikipedia osserva che questo aiuta a eliminare problemi comuni come gli errori di inserimento manuale e i cartellini smarriti [10]. Il LEI sottolinea che i kanban dei fornitori lontani "hanno tipicamente assunto una forma elettronica" [1]. La logica non cambia: un numero fisso di segnali pull per anello, attivati dal consumo.

**Come funziona tipicamente un anello e-kanban:**

1. Ogni contenitore porta un'etichetta con un codice a barre, un codice QR o un tag RFID che identifica il kanban (codice articolo, anello, numero del cartellino).
2. Quando un contenitore viene svuotato, l'operatore o il movimentatore lo scansiona, oppure un sensore rileva la posizione vuota (bilancia, barriera a infrarossi, varco RFID).
3. L'ERP o un'applicazione kanban dedicata imposta lo stato di quel kanban su "vuoto" e genera un segnale di reintegro: un ordine di produzione o un job per un fornitore interno, oppure un rilascio su un ordine di acquisto quadro per un fornitore esterno.
4. Il processo fornitore vede il segnale nella sua coda, su uno schermo (una bacheca kanban digitale in cella) o come cartellino stampato.
5. Quando il contenitore pieno viene ricevuto e scansionato nella sua posizione di stoccaggio, il kanban torna allo stato "pieno".

### Fisico o elettronico: quando passare

| Fattore | Mantenere i cartellini fisici | Passare all'e-kanban |
|---|---|---|
| Distanza fornitore-consumatore | Stesso edificio, a poche decine di metri | Altro sito, fornitore esterno, altro paese |
| Numero di anelli | Decine | Centinaia o migliaia |
| Tasso di smarrimento dei cartellini | Basso, i cartellini sono facili da verificare | Cartellini smarriti ricorrenti, rotture di stock riconducibili ai cartellini |
| Necessità di dati | Il controllo visivo è sufficiente | Servono tempi di reintegro, prestazioni degli anelli, storico della domanda |
| Maturità | Il team sta ancora imparando le regole | Le regole sono stabili e rispettate |
| Ambiente IT/OT | Nessuna scansione o rete affidabile in reparto | Scanner, rete e modulo kanban dell'ERP disponibili |

Un errore frequente è iniziare dall'e-kanban. Lo schermo nasconde ciò che una rastrelliera piena di cartellini mostra: chi trattiene i cartellini, quale anello va in eccesso, quale regola viene violata. La nostra raccomandazione: far funzionare un anello su carta finché le regole reggono, poi digitalizzare.

### Come i sistemi ERP gestiscono il kanban

I principali sistemi ERP includono funzioni kanban. Due esempi pubblicati mostrano quanto diversamente calcolano.

- **Microsoft Dynamics 365 Supply Chain Management** calcola la quantità kanban da una politica di calcolo della quantità kanban che usa la domanda media su un periodo di domanda definito, il lead time, un fattore di sicurezza e, facoltativamente, lo stock di sicurezza derivato da un livello di servizio; con un livello di servizio del 90 percento usa z = 1,29 [15]. Distingue tra regole kanban a quantità fissa, kanban monouso e kanban a evento [15]. I cartellini circolanti vengono stampati una volta e poi si muovono tra origine e punto di consumo, spesso più volte al giorno [15].
- **Oracle JD Edwards** offre diverse equazioni kanban, ad esempio "dimensione contenitore fissa e domanda elevata", dove la dimensione del kanban è uguale alla domanda giornaliera elevata × (giorni di lead time di consegna + giorni di scarto di scansione) + stock di sicurezza, e il numero di cartellini è uguale alla dimensione del kanban divisa per la dimensione del contenitore [16]. La domanda giornaliera elevata è ricavata dalla domanda di periodo più alta nella finestra MRP, corretta per le suddivisioni per fornitore e per ubicazione [16].

Prima di fidarvi dei numeri di cartellini suggeriti dal sistema ERP, verificate tre aspetti: quale domanda utilizza (media o picco, passata o futura), se aggiunge un cartellino per il contenitore in uso e come gestisce le dimensioni dei lotti presso il processo fornitore. Queste scelte spiegano la maggior parte delle differenze tra il numero dell'ERP e l'esperienza sul campo.

### MRP e kanban: chi fa cosa

L'MRP (material requirements planning) scompone un piano principale di produzione attraverso la distinta base e crea ordini pianificati per data. Il kanban sostituisce solo l'ultimo passaggio per i componenti gestiti a kanban: il rilascio dei singoli ordini. Una divisione del lavoro praticabile è la seguente:

| Attività | MRP / ERP | Ciclo kanban |
|---|---|---|
| Pianificazione a lungo termine di capacità e materiali | Sì: S&OP, piano principale, rough-cut capacity | No |
| Contratti con i fornitori, ordini quadro, previsioni ai fornitori | Sì: condivisione delle quantità previste per la pianificazione della capacità | No |
| Componenti a lungo approvvigionamento e non gestiti a kanban | Sì: ordini pianificati | No |
| Rilascio giornaliero dei componenti a kanban | No: sopprimere gli ordini pianificati per questi componenti | Sì: segnale di consumo |
| Transazioni di magazzino | Sì: entrate, uscite, spesso backflushing | Genera le transazioni (scansione) |
| Dimensionamento dei cicli | Calcola suggerimenti dalla domanda | Il reparto convalida e adegua |
| Costing e valorizzazione | Sì | No |

Due aspetti tecnici sono rilevanti:

- **Evitare la doppia pianificazione.** Se l'MRP continua a creare ordini pianificati per un componente che è anche a kanban, buyer e schedulatori ricevono due segnali contraddittori. La maggior parte dei sistemi ERP consente di contrassegnare un componente come controllato a kanban, in modo che l'MRP lo pianifichi solo ai fini della capacità e delle previsioni. Le impostazioni variano a seconda del sistema; consultate la documentazione del vostro ERP.
- **Il backflushing richiede distinte base accurate.** Quando il sistema scarica automaticamente i componenti in un punto di rilevazione, quantità errate nella distinta base si manifestano come falsi esaurimenti nel ciclo kanban. Correggete la distinta base, non il numero dei cartellini.

MRP e S&OP sono trattati in dettaglio nella [guida a S&OP, MRP e pianificazione della produzione](https://www.m365.fm/en/learn/sop-mrp-production-planning/), e la politica di magazzino, inclusa il calcolo delle scorte di sicurezza, nella [guida alla gestione delle scorte manifatturiere](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/).

### Dove si colloca l'e-kanban nell'architettura IT/OT

L'e-kanban interessa diversi livelli di sistema: l'ERP (pianificazione, acquisti, valorizzazione del magazzino), il MES o l'applicazione di reparto (segnali di produzione, conferme), scanner e sensori sul campo e portali fornitori o collegamenti EDI con i fornitori esterni. Il modello ISA-95 per l'integrazione dei sistemi aziendali e di controllo è un utile riferimento per decidere quale sistema gestisce quali dati kanban; vedere la [guida a MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/). Due regole pratiche:

- **Un solo sistema gestisce i dati anagrafici del kanban** (cicli, numero di cartellini, quantità per contenitore). I duplicati in Excel, MES e ERP si disallineano nel giro di poche settimane.
- **Prevenire i segnali duplicati.** Un contenitore scansionato due volte, o un sensore che oscilla, genera due segnali di riapprovvigionamento per un solo contenitore vuoto. Consentite un solo segnale aperto per ID kanban e registrate ogni cambiamento di stato.
- **Prevedere le interruzioni.** Se la rete o l'applicazione kanban si guastano, il reparto ha bisogno di cartellini stampati o di una soluzione cartacea di emergenza per ogni ciclo. Anche ogni dispositivo di scansione e ogni collegamento con i fornitori fanno parte della superficie di attacco dello stabilimento; la [guida alla cybersecurity OT](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) spiega come segmentare e proteggere tali collegamenti. Per le opzioni di integrazione basate sul cloud, vedere la [guida ad Azure per la manifattura](https://www.m365.fm/en/learn/manufacturing-it-azure/).

### Simulare i cicli prima di realizzarli

Per gli stabilimenti con molti cicli o una forte variabilità della domanda, una simulazione a eventi discreti può verificare numero di cartellini, dimensioni dei supermarket e intervalli dei giri rispetto alla domanda storica, prima che qualcosa cambi sul campo. La [guida alla simulazione di produzione](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) spiega come vengono costruiti tali modelli. Il software di value stream può aiutare a mantenere coerenti tra i diversi siti le mappe di stato futuro con supermarket e cicli kanban; la [guida a iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) descrive uno di questi strumenti e i suoi limiti. **Nota: l'autore lavora presso iFAKT GmbH.**

## Modelli: scheda, foglio di dimensionamento, checklist del supermercato, audit

Copiate queste tabelle in un foglio di calcolo o nella documentazione del reparto produttivo. Sono volutamente semplici: un sistema kanban dovrebbe funzionare con una stampante e una plastificatrice prima di richiedere software.

### Modello 1: layout della scheda kanban

| Campo | Esempio | Note |
|---|---|---|
| Codice articolo e nome | B-200, staffa sinistra | Caratteri grandi; leggibile da 6 piedi (circa 2 m) |
| Tipo di kanban | Kanban di produzione | Codice colore per tipo (ad esempio bianco = produzione, giallo = prelievo, rosso = emergenza) |
| Numero di scheda | 3 di 9 | Mostra la dimensione del loop; rivela le schede smarrite |
| Quantità per contenitore | 40 pezzi | Non scrivere mai "ca." |
| Tipo di contenitore | Cassetta blu 600 × 400 mm | Corrisponde allo slot a scaffale |
| Processo fornitore o fornitore | Cella W2 (stampaggio e saldatura) | Per il kanban di fornitura: nome e ID del fornitore |
| Indirizzo di stoccaggio (supermercato) | SM-W2, scaffale 3, livello B, slot 07 | Posizione in cui torna il contenitore pieno [1] |
| Indirizzo del processo consumatore | Linea 1, postazione 14, scaffale sinistro | Punto di utilizzo [1] |
| Codice a barre o QR | ID loop + numero di scheda | Per e-kanban o scansioni di audit |
| Revisione e data | Rev. 4, nov 2026 | Modificata quando il loop viene ridimensionato |

### Modello 2: foglio di dimensionamento del loop

| Riga | Input | Unità | Esempio (staffa B-200) |
|---|---|---|---|
| 1 | Domanda media giornaliera | pezzi/giorno | 960 |
| 2 | Tempo disponibile al giorno | minuti | 900 |
| 3 | Takt (riga 2 ÷ riga 1) | minuti/pezzo | 0,9375 |
| 4 | Quantità per contenitore | pezzi | 40 |
| 5 | Intervallo di ritiro delle schede | minuti | 60 |
| 6 | Coda al processo fornitore | minuti | 90 |
| 7 | Cambio formato per lotto (se non incluso in coda) | minuti | 0 |
| 8 | Tempo di lavorazione per contenitore | minuti | 20 |
| 9 | Trasporto e reinserimento | minuti | 15 |
| 10 | Tempo di reintegro (righe da 5 a 9) | minuti | 185 |
| 11 | Kanban per il tempo di reintegro (riga 10 ÷ riga 3 ÷ riga 4) | kanban | 4,93 |
| 12 | Dimensione del lotto al processo fornitore | contenitori | 4 |
| 13 | Kanban aggiuntivi per la formazione del lotto (riga 12 – 1) | kanban | 3 |
| 14 | Margine di sicurezza (10% della riga 11) | kanban | 0,49 |
| 15 | Totale (righe 11 + 13 + 14), arrotondato per eccesso | kanban | 9 |
| 16 | Scorta massima del loop (riga 15 × riga 4) | pezzi | 360 |
| 17 | Giorni di copertura (riga 16 ÷ riga 1) | giorni | 0,375 |
| 18 | Prossima data di revisione | data | mensile |

### Modello 3: checklist di progettazione del supermercato

| # | Verifica | Sì / No |
|---|---|---|
| 1 | Ogni codice articolo presente nel supermercato soddisfa i criteri dei runner (domanda regolare, bassa variabilità) | |
| 2 | Ogni codice articolo ha esattamente un indirizzo fisso | |
| 3 | La capacità dello scaffale è pari alla dimensione massima del loop per codice articolo, senza slot in più | |
| 4 | Gli scaffali si caricano da dietro e si prelevano da davanti | |
| 5 | Le posizioni del kanban di segnalazione o i segni min/max sono visibili | |
| 6 | Pesi dei contenitori e altezze di movimentazione verificati rispetto alle linee guida ergonomiche [28] | |
| 7 | I corridoi consentono un accesso sicuro a carrelli o trattori, separati dai percorsi pedonali | |
| 8 | Postazione kanban presso il consumatore e presso il processo fornitore | |
| 9 | Percorso del addetto al prelievo e intervallo di ritiro sono documentati e cronometrati | |
| 10 | Percorso di ritorno dei contenitori vuoti è definito | |
| 11 | Per il supermercato sono indicati un referente e un sostituto | |
| 12 | Procedura e colore del kanban di emergenza sono definiti | |

### Modello 4: audit settimanale del kanban

| Verifica | Come | Obiettivo | Azione se non conforme |
|---|---|---|---|
| Conteggio schede per loop | Contare le schede nelle postazioni, presso il fornitore, sui contenitori pieni, in linea | Uguale alla lista master | Cercare; se persa, sostituire e registrare la causa |
| Contenitori senza etichetta | Percorrere supermercato e linea | Zero | Etichettare o rimuovere; individuare chi li ha creati |
| Eccedenza nel supermercato | Contenitori fuori dagli slot fissi | Zero | Fermare la sovrapproduzione; verificare la regola 3 |
| Rotture di stock | Fermate di linea o carenze dovute a loop vuoti | Zero, registrare il numero | Causa radice: scheda, dimensionamento, fornitore, qualità |
| Kanban di emergenza in uso | Contare le schede rosse | Zero dopo il ripristino | Ritirare; analizzare l'evento scatenante |
| Tempo di reintegro | Timbrature o campione di 10 schede | Entro il valore usato per il dimensionamento | Ridimensionare il loop o eliminare il ritardo |
| Pezzi difettosi nei contenitori | Controllo a campione nel punto di utilizzo | Zero | Contenimento qualità alla fonte |

### Modello 5: regole kanban per la lavagna del reparto produttivo

| # | Regola | Chi |
|---|---|---|
| 1 | Prendiamo i pezzi solo dal nostro indirizzo di punto d'uso | Operatori |
| 2 | Quando un contenitore è vuoto, il suo cartellino va immediatamente nella cassetta kanban | Operatori |
| 3 | Produciamo solo ciò che autorizzano i kanban di produzione, nella loro sequenza | Cella fornitrice |
| 4 | Un contenitore pieno porta sempre il suo cartellino | Tutti |
| 5 | I pezzi difettosi non entrano mai in un contenitore; ci fermiamo e segnaliamo | Tutti |
| 6 | I cartellini vengono aggiunti o rimossi solo dal responsabile del circuito, con una data | Responsabile materiali |
| 7 | I cartellini rossi di emergenza tornano al responsabile del circuito dopo l'uso | Responsabile materiali |
| 8 | Se il sistema e lo scaffale non concordano, ci fidiamo dello scaffale e segnaliamo lo scostamento | Tutti |

## Come implementare il kanban nella produzione: una roadmap di 26 settimane

L'implementazione di un sistema pull inizia con un processo produttivo stabile, non con i cartellini. La roadmap sottostante è una sequenza tipica per un flusso del valore e il relativo team di produzione in uno stabilimento di medie dimensioni. Le durate sono ipotesi di pianificazione, non benchmark; gli stabilimenti con esperienza pregressa nel lean procedono più rapidamente, quelli con processi instabili più lentamente.

| Fase | Settimane | Obiettivo | Attività principali | Criteri di uscita |
|---|---|---|---|---|
| 0. Selezione e baseline | 1–2 | Scegliere il pilota, misurare la situazione attuale | Scegliere una famiglia di prodotti; mappa dello stato attuale; misurare WIP, lead time, rotture di stock, valore delle scorte | KPI di baseline approvati da operations e finanza |
| 1. Stabilizzazione | 3–6 | Rendere il processo in grado di supportare il pull | 5S al punto di fornitura e al punto d'uso; risolvere le principali cause di fermo; ridurre i cambi produzione nel processo fornitore; definire i contenitori | Il processo fornitore raggiunge la produzione pianificata per 9 giorni su 10 |
| 2. Progettazione | 7–10 | Stato futuro e progettazione dei circuiti | Segmentare i componenti (runner, repeater, stranger); scegliere i tipi di circuito; dimensionare i circuiti con il foglio di calcolo; progettare il supermarket e il percorso | Elenco dei circuiti con numero di cartellini, indirizzi, responsabili |
| 3. Pilota | 11–14 | Avviare da 5 a 15 circuiti | Stampare i cartellini, formare operatori e addetti alla movimentazione, avviare i circuiti; revisione giornaliera alla lavagna; regolare le dimensioni | Due settimane senza rotture di stock causate dalla progettazione dei circuiti |
| 4. Estensione | 15–22 | Coprire il flusso del valore | Aggiungere i runner rimanenti; primi kanban verso i fornitori; collegare il programma pacemaker; livellare il mix | 80% dei codici runner su kanban; ordini pianificati MRP soppressi per essi |
| 5. Miglioramento e digitalizzazione | 23–26 e in corso | Ridurre il WIP, aggiungere dati | Rimuovere i cartellini uno alla volta; ridurre i lotti; e-kanban per fornitori distanti; ridimensionamento mensile | Riduzioni dei cartellini documentate; e-kanban per i circuiti selezionati |

### Prerequisiti da non saltare

| Prerequisito | Perché il kanban ne ha bisogno | Dove approfondire |
|---|---|---|
| Processi fornitori stabili e capaci | Un circuito dimensionato per 0,25 giorni fallisce se la macchina è ferma per mezza giornata | [Guida TPM e OEE](https://www.m365.fm/en/learn/tpm-oee/) |
| Cambi produzione brevi | La dimensione del lotto determina il numero di cartellini (esempio 2) | [Guida SMED](https://www.m365.fm/en/learn/smed-changeover-reduction/) |
| Organizzazione del posto di lavoro | Indirizzi fissi, scaffali chiari, stato visibile | [Guida 5S e gestione visiva](https://www.m365.fm/en/learn/5s-visual-management/) |
| Lavoro standard per addetti e operatori | Gli intervalli di percorso e la gestione dei cartellini devono essere ripetibili | [Guida al lavoro standard](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) |
| Programma pacemaker livellato | La domanda non livellata gonfia i circuiti | Sezione Heijunka sopra |
| Dati affidabili | Quantità nei contenitori, distinte base e storico della domanda | [Guida ai KPI di produzione](https://www.m365.fm/en/learn/manufacturing-kpis/) |

### Scelta dei circuiti pilota

I primi circuiti validi condividono cinque caratteristiche: domanda giornaliera, un processo fornitore vicino, cambi produzione inferiori a circa 15 minuti, un componente che ha causato carenze o eccessi di scorte evidenti, e un capoturno che vuole provarlo. Evitare per il primo circuito il componente del collo di bottiglia più critico dello stabilimento; un errore di progettazione lì fermerebbe l'intera linea.

### Coinvolgere operatori, addetti alla movimentazione e i loro rappresentanti

Un sistema kanban cambia il lavoro quotidiano di operatori e addetti alla movimentazione. La loro adesione determina se le regole reggeranno.

- **Spiegare lo scopo prima delle regole.** Le persone che vedono le carenze di materiale e i scaffali straripanti di solito capiscono subito perché un limite WIP è utile. Chi riceve l'ordine di "seguire la scheda" senza contesto no.
- **Lasciare che gli operatori definiscano le posizioni dei contenitori e le altezze dei scaffali.** Sanno dove raggiungere e sollevare crea disagio. Usare le risorse di ergonomia di OSHA come riferimento per la revisione [28].
- **Concordare cosa succede al tempo e alla manodopera liberati.** Se la movimentazione delle scorte si riduce, le persone si preoccupano per il posto di lavoro. Dichiararlo subito e, se si applica un contratto sindacale, per iscritto: come verrà utilizzata la capacità liberata. La [guida alla lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) tratta il contesto del lavoro negli Stati Uniti, inclusi i comitati di coinvolgimento dei dipendenti previsti dal NLRA.
- **Rendere sicura la regola di arresto.** La regola 5 (nessun difetto a valle) funziona solo se fermare la linea e chiedere aiuto non viene mai punito.
- **Usare la lavagna giornaliera.** I problemi dei loop appartengono alla riunione giornaliera a più livelli; vedere la [guida alla gestione del shop floor](https://www.m365.fm/en/learn/shop-floor-management/).

### Ottenere supporto esterno

I produttori statunitensi, soprattutto quelli piccoli e medi, possono rivolgersi al centro Manufacturing Extension Partnership (MEP) del NIST del proprio stato per supporto su lean e miglioramento dei processi; il NIST MEP elenca il lean e il miglioramento dei processi tra i suoi servizi [27]. I metodi di miglioramento continuo per far migliorare sempre i loop sono trattati nella [guida al kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/).

## KPI del kanban e la prospettiva finanziaria

### KPI operativi

| KPI | Formula | Esempio | Direzione target |
|---|---|---|---|
| Inventario del loop (max) | Kanban × quantità del contenitore | 9 × 40 = 360 pezzi | In diminuzione nel tempo |
| Giorni di copertura | Inventario massimo del loop ÷ domanda giornaliera media | 360 ÷ 960 = 0,375 giorni | In diminuzione, entro i limiti di sicurezza |
| Carenze per settimana | Numero di fermate di linea o carenze causate da un loop vuoto | 2 | Zero |
| Accuratezza delle schede | Schede trovate in audit ÷ schede nell'elenco principale | 87 ÷ 90 = 96,7% | 100% |
| Aderenza ai tempi di rifornimento | Kanban riforniti nel tempo dimensionato ÷ tutti i kanban | 182 ÷ 200 = 91% | In aumento |
| Kanban di emergenza | Numero emessi al mese | 4 | In diminuzione |
| WIP (flusso del valore) | Somma dei pezzi tra il primo e l'ultimo processo | 3.200 -> 1.200 | In diminuzione |
| Lead time (legge di Little) | WIP ÷ throughput [6] | 1.200 ÷ 400 = 3 giorni | In diminuzione |
| Rotazione delle scorte | Costo annuo del venduto ÷ valore medio delle scorte | 24 M$ ÷ 3 M$ = 8 | In aumento |
| Consegna puntuale | Ordini spediti in tempo ÷ tutti gli ordini | 95% | In aumento o stabile |
| Kanban rimossi | Schede rimosse dopo il miglioramento, per trimestre | 12 | Monitorare, non è una quota |

Osservare le coppie. Un inventario in calo con carenze in aumento significa che i loop sono stati tagliati troppo o che il processo non è abbastanza stabile. Una consegna puntuale in aumento con inventario stabile può significare che i loop vanno bene e che il miglioramento deriva dal livellamento. Definizioni dei KPI e dashboard per l'intero stabilimento sono trattati nella [guida ai KPI manifatturieri](https://www.m365.fm/en/learn/manufacturing-kpis/).

### La prospettiva finanziaria: cassa, costo di mantenimento e utile riportato

Un controller di stabilimento osserva tre effetti.

**1. Liberazione di cassa una tantum.** Supponiamo che 120 codici di ricambio a flusso continuo passino dai punti di riordino minimo/massimo al kanban, e che l'inventario medio a disposizione di ogni loop scenda di 3.000 $ al costo standard. Ciò libera 120 × 3.000 $ = 360.000 $ di capitale circolante, una sola volta. Non si ripete ogni anno.

**2. Risparmi ricorrenti sul costo di mantenimento.** Il costo di mantenimento comprende costo del capitale, stoccaggio, movimentazione, assicurazione, obsolescenza e svalutazione per calo di qualità. La percentuale varia molto a seconda dell'azienda e del settore; usare la cifra del proprio controller. Con un 20% annuo a titolo illustrativo (un'ipotesi per questo esempio, non un benchmark), la riduzione di 360.000 $ fa risparmiare circa 72.000 $ l'anno.

**3. Un effetto negativo temporaneo sull'utile riportato con il costing ad assorbimento.** Nel costing ad assorbimento, i prodotti finiti e il WIP incorporano parte dei costi generali di produzione fissi. Quando l'inventario scende, i costi generali capitalizzati nei periodi precedenti confluiscono nel costo del venduto, quindi l'utile riportato può diminuire nei trimestri in cui WIP e prodotti finiti calano, anche se la cassa migliora. I report interni basati sul costing a costi variabili (diretti) non mostrano questa flessione, ed è uno dei motivi per presentare entrambe le viste nella revisione del pilota. Spiegarlo alla direzione prima del pilota, altrimenti il primo trimestre con kanban potrebbe sembrare un fallimento. Le materie prime e i componenti acquistati non incorporano costi generali assorbiti, quindi l'effetto deriva soprattutto da WIP e prodotti finiti.

**Costi da includere nel budget.** Contenitori, rastrelliere e scaffali a flusso (capex o opex a seconda della soglia di capitalizzazione), stampa e plastificazione delle card, tempo di formazione, eventualmente scanner e licenze del modulo kanban dell'ERP per l'e-kanban (di solito opex in un modello in abbonamento), e il percorso del carrellista di movimentazione dei materiali. Un pilota tipico di 10-15 loop è costituito soprattutto dal costo del lavoro e dei contenitori; il dimensionamento e le regole non costano nulla, richiedono solo disciplina.

**Esempio di business case per un pilota (tutti i valori sono indicativi):**

| Voce | Importo |
|---|---|
| Contenitori e rastrelliere a flusso per 15 loop | 18.000 $ |
| Formazione: 40 persone × 4 ore × 45 $ tariffa caricata | 7.200 $ |
| Tempo di ingegneria e coaching, 8 settimane a tempo parziale | 20.000 $ |
| **Costo totale del pilota** | **45.200 $** |
| Riduzione una tantum delle scorte, 15 loop × 3.000 $ | 45.000 $ |
| Risparmio annuo sui costi di giacenza con un'ipotesi del 20% | 9.000 $ |
| Spedizioni urgenti evitate (dati propri dello stabilimento, esempio) | 12.000 $ all'anno |

In questo esempio il pilota si ripaga, in termini di cassa, già nel primo anno. Il caso più rilevante è di solito l'estensione all'intero flusso del valore e la riduzione del lead time che ne deriva.

## Errori comuni nel kanban e come correggerli

| Errore | Sintomo | Correzione |
|---|---|---|
| Kanban prima della stabilità | Frequenti rotture di stock perché la macchina a monte è ferma o lo scarto è elevato | Stabilizzare prima (TPM, qualità alla fonte); nel frattempo dimensionare i loop sul tempo di riapprovvigionamento reale |
| Supermercati per i prodotti occasionali | Rastrelliere piene di articoli a lenta rotazione, scorte elevate nonostante il "pull" | Segmentare gli articoli; usare produzione su ordine con CONWIP o POLCA per gli articoli occasionali |
| Dimensionamento sul tempo ciclo macchina invece che sul tempo di riapprovvigionamento | I loop risultano sempre insufficienti | Misurare il tempo di riapprovvigionamento end-to-end (righe 5-10 del foglio di lavoro) |
| Non considerare la dimensione del lotto presso il fornitore | I loop risultano insufficienti quando il fornitore produce a lotti | Aggiungere kanban di formazione del lotto oppure ridurre la dimensione del lotto con SMED |
| Non ricalcolare mai | Loop troppo grandi dopo un calo della domanda, troppo piccoli dopo un aumento | Revisione mensile; suggerimenti di ricalcolo basati sull'ERP [15] |
| Card aggiuntive informali | Il loop cresce, la sovrapproduzione ritorna | Elenco master delle card, responsabile del loop, card di emergenza colorate ritirate dopo l'uso |
| Rimuovere le card troppo in fretta | Fermo linea, perdita di fiducia | Rimuovere una card alla volta, quando qualcuno è in grado di risolvere il problema emerso [12] |
| Ordini MRP paralleli sugli stessi articoli | Gli acquirenti ordinano due volte gli articoli kanban | Contrassegnare gli articoli kanban nell'ERP; usare l'MRP solo per previsione e capacità |
| Pacemaker non livellato | I loop a monte vedono picchi molto ampi | Box heijunka con pitch; lotti più piccoli al pacemaker |
| E-kanban come scorciatoia | I problemi restano nascosti in un sistema che nessuno controlla | Far funzionare i loop cartacei finché le regole non tengono; poi digitalizzare con una bacheca visiva |
| Nessuna responsabilità | Nessuno si accorge delle card smarrite | Responsabile del loop nominativo e audit settimanale (modello 4) |
| Fornitore non coinvolto | Il fornitore non recepisce i segnali o spedisce in eccesso | Accordo condiviso su metodo di segnalazione, lead time, contenitore e quantità; iniziare con pochi articoli |
| Lotti o revisioni misti nello stesso contenitore | Perdita di tracciabilità quando un lotto è sospetto o viene richiamato; revisione errata alla linea | Un lotto e una revisione per contenitore; numero di lotto o data sull'etichetta; rastrelliere FIFO; regola di contenimento che blocca le card del loop per il lotto sospetto |

## Limiti: quando il kanban è lo strumento sbagliato

Il kanban si adatta a una situazione specifica. Gli stabilimenti che usano il kanban nella produzione al di fuori di essa incontrano i seguenti problemi.

**Produzione ad alta varietà e basso volume, e produzione su misura.** La guida di Suri afferma chiaramente che il kanban "non funziona bene con la produzione a basso volume o su misura" [20]. Un ciclo dedicato a un singolo articolo ordinato due volte l'anno è semplicemente scorta con un cartellino attaccato. CONWIP e POLCA sono stati sviluppati proprio per questi casi [3][20].

**Domanda altamente variabile.** La dimensione del ciclo dipende dalla domanda nel tempo di riapprovvigionamento più la scorta di sicurezza. Se la domanda oscilla di un fattore tre da una settimana all'altra e non può essere livellata, il ciclo deve essere dimensionato per i picchi e per la maggior parte del tempo contiene troppa scorta. Occorre quindi livellare la domanda al pacemaker, adottare un controllo pianificato (MRP) oppure ridimensionare i cicli in modo dinamico.

**Riapprovvigionamento lungo e poco affidabile.** I kanban dei fornitori con fornitori d'oltremare e tempi di trasporto lunghi immobilizzano molte settimane di scorta nel ciclo; il segnale arriva troppo tardi per reagire ai cambiamenti reali. In questi casi, di norma, funzionano meglio le previsioni e i rilasci pianificati dall'MRP, combinati con un buffer locale.

**Cicli di vita di prodotto brevi e modifiche di ingegneria.** Un ciclo pieno di componenti alla vecchia revisione diventa scarto quando il progetto cambia. Occorre pianificare la dismissione: congelare il ciclo, esaurire i cartellini, quindi introdurre il nuovo codice articolo con nuovi cartellini.

**Rischio di approvvigionamento e resilienza.** I sistemi a tiraggio riducono la scorta che copre la normale variabilità. Non sono progettati per coprire interruzioni come un incendio presso un fornitore o una carenza di chip. Toyota, l'origine del kanban, ha introdotto un piano di continuità operativa dopo il terremoto del 2011, in base al quale i fornitori detengono da due a sei mesi di scorta di semiconduttori, a seconda del componente [26]. Decidere quali componenti richiedano un buffer strategico al di fuori del ciclo kanban è una decisione di rischio; vedere la [guida alla resilienza della supply chain](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/).

**Teoria e pratica.** La letteratura accademica sul kanban è vasta. Lage Junior e Godinho Filho hanno esaminato 32 varianti del sistema kanban e hanno riscontrato un ampio divario tra il numero di proposte teoriche e quelle pratiche [17]. Molte varianti ottimizzate non sono mai state sperimentate in stabilimento. Per la maggior parte dei professionisti, il ciclo classico con un dimensionamento onesto e regole rigorose è il punto di partenza giusto.

**Dove il kanban si colloca in ambienti regolamentati e a progetto.** Nell'aerospazio e nella difesa, i volumi bassi, i tempi di consegna lunghi e i requisiti di tracciabilità limitano il kanban classico all'hardware standard, ai materiali di consumo e ai sottoassiemi ripetitivi; vedere la [guida alla pianificazione della produzione aerospaziale](https://www.m365.fm/en/learn/aerospace-production-planning/). Nelle industrie di processo, i kanban di segnalazione su serbatoi o silos possono funzionare dove le dimensioni dei lotti sono grandi e i cambi di produzione lunghi.

## Glossario Kanban

| Termine | Definizione |
|---|---|
| Quantità del contenitore (quantità di confezionamento) | Numero fisso di pezzi per kanban; l'unità del ciclo |
| CONWIP | Constant work in process (lavoro in corso costante); sistema pull con un unico set di cartellini per un'intera linea [3][5] |
| Drum-buffer-rope (DBR) | Metodo di controllo della teoria dei vincoli: il collo di bottiglia stabilisce il ritmo, un buffer temporale lo protegge, il rilascio è legato ad esso |
| E-kanban | Segnale kanban elettronico, attivato da scansione o sensore [10] |
| Kanban di emergenza | Cartellino extra temporaneo per recuperare da una carenza; ritirato dopo l'uso |
| Corsia FIFO | Coda con quantità massima tra due processi, primo entrato, primo uscito |
| Heijunka | Livellamento del tipo e della quantità di produzione su un periodo fisso [18] |
| Heijunka box | Programma visivo con tipi di prodotto su un asse e fasce orarie (pitch) sull'altro [18] |
| Just-in-time (JIT) | Produrre solo ciò che serve, quando serve, nella quantità necessaria [8] |
| Kanban | Dispositivo di segnalazione che autorizza la produzione o il prelievo in un sistema pull; dal giapponese "segnale" o "cartello" [1] |
| Kanban post | Scatola o rastrelliera in cui i kanban vengono raccolti per il ritiro |
| Legge di Little | WIP medio = throughput × lead time medio [6] |
| Ciclo | Una relazione fornitore-consumatore per un codice articolo con il relativo set di kanban |
| Pacemaker | Il singolo processo che riceve il programma di produzione |
| Pitch | Tempo per realizzare un contenitore: takt time × quantità di confezionamento [19] |
| POLCA | Paired-cell overlapping loops of cards with authorization (cicli sovrapposti di cartellini a celle accoppiate con autorizzazione); pull per officine ad alto mix e bassi volumi [20][21] |
| Kanban di produzione | Cartellino che autorizza un processo a realizzare un tipo e una quantità [1] |
| Sistema pull | Un sistema di produzione che limita esplicitamente il WIP [2] |
| Sistema push | Un sistema che rilascia lavoro secondo un programma senza un limite di WIP |
| Lead time di rifornimento | Tempo dallo svuotamento di un contenitore (rilascio del suo cartellino) fino al ritorno del contenitore pieno nel suo punto di stoccaggio |
| Runners, repeaters, strangers | Segmentazione degli articoli in base alla regolarità della domanda, usata per scegliere tra kanban e produzione su ordine |
| Fattore di sicurezza | Percentuale aggiunta alla domanda durante il rifornimento per coprire la variabilità |
| Kanban di segnale (kanban triangolare) | Cartellino che attiva un lotto quando le scorte raggiungono il punto di riordino [1] |
| Supermarket | Punto di stoccaggio controllato con indirizzi fissi e quantità massime, da cui il processo a valle effettua i prelievi |
| Kanban fornitore | Kanban di prelievo verso un fornitore esterno, spesso elettronico [1] |
| Takt time | Tempo disponibile diviso per la domanda del cliente |
| Sistema a due contenitori | Due contenitori per articolo; un contenitore vuoto è il segnale di rifornimento [10] |
| Water spider (mizusumashi) | Addetto alla movimentazione materiali su un percorso fisso che sposta kanban e contenitori |
| Kanban di prelievo | Cartellino che autorizza lo spostamento di materiali verso un processo a valle [1] |
| WIP | Work in process (lavoro in corso): materiale avviato ma non ancora finito |

## FAQ: domande sul sistema kanban e sul sistema pull

### Che cos'è un sistema kanban nella produzione?

Un sistema kanban controlla la produzione e il movimento dei materiali con segnali attivati dal consumo. Quando un processo a valle utilizza un contenitore, il suo cartellino o il contenitore vuoto torna a monte e autorizza esattamente una sostituzione. Il numero di cartellini limita le scorte in ciascun ciclo [1].

### Quali informazioni sono riportate su un cartellino kanban?

Di solito il nome e il numero del componente, il processo o il fornitore che lo fornisce, la quantità per contenitore (pack-out), l'indirizzo di stoccaggio e l'indirizzo del processo consumatore [1]. La maggior parte degli stabilimenti aggiunge il numero del cartellino all'interno del ciclo (ad esempio 3 di 9), il tipo di kanban e un codice a barre per gli audit o per l'e-kanban.

### Quali sono i principali tipi di kanban?

Kanban di produzione (produci questa quantità), kanban di prelievo o di movimentazione (sposta questa quantità), kanban di segnale o triangolo (avvia un lotto a un punto di attivazione) e kanban di fornitura (ordina a un fornitore esterno) [1]. I sistemi a due contenitori, i kanban di emergenza, i kanban una tantum e l'e-kanban sono varianti di questi.

### Come si calcola il numero di cartellini kanban?

Si parte da N = domanda × tempo di approvvigionamento × (1 + fattore di sicurezza) ÷ quantità per contenitore e si arrotonda per eccesso. Esempio: 960 × 0,25 × 1,1 ÷ 40 = 6,6, quindi 7 cartellini. Si verifica poi se gli intervalli di ritiro e le dimensioni dei lotti nel processo fornitore richiedono cartellini aggiuntivi; nell'esempio sopra questi li portano a 9 [12][13].

### Quali sono le sei regole del kanban di Toyota?

Nella versione più diffusa: il processo a valle preleva ciò che utilizza, il processo a monte produce nella quantità e nella sequenza dei kanban, nulla viene realizzato o spostato senza un kanban, il kanban accompagna sempre i componenti, i pezzi difettosi non vengono mai inoltrati e il numero di kanban viene ridotto gradualmente per far emergere i problemi [10]. Una seconda versione, dal manuale Toyota del 1973, le formula diversamente e aggiunge "ridurre le fluttuazioni" e "stabilizzare e razionalizzare il processo produttivo" [11].

### Qual è la differenza tra sistemi push e sistemi pull?

Un sistema pull limita esplicitamente il lavoro in corso; un sistema push rilascia il lavoro secondo un programma senza un limite di questo tipo [2]. Pull non coincide con il make to order: un ciclo kanban make to stock è pull, mentre un'officina make to order che rilascia tutti gli ordini in una volta sola è push.

### Kanban è la stessa cosa del just-in-time?

No. Il just-in-time è il principio di produrre solo ciò che serve, quando serve, nella quantità necessaria [8]. Il kanban è il sistema di segnalazione sviluppato da Toyota per mettere in pratica questo principio [7].

### Che cos'è un sistema kanban a due contenitori?

Ogni componente dispone di due contenitori nel punto d'uso. Quando il primo è vuoto, l'operatore inizia a usare il secondo e rimanda indietro il contenitore vuoto come segnale di rifornimento. Ogni contenitore contiene una quantità sufficiente a coprire la domanda durante il tempo di riempimento più un margine. È la forma più semplice di kanban e si adatta ai materiali di consumo a basso costo [10].

### Che cos'è un supermercato kanban?

Un punto di stoccaggio controllato, di solito accanto al processo fornitore, in cui ogni codice componente ha un indirizzo fisso e una quantità massima. Il processo a valle o un addetto alla movimentazione effettua i prelievi, e il fornitore reintegra solo ciò che è stato prelevato.

### Che cos'è l'e-kanban?

Il kanban elettronico sostituisce i cartellini fisici con scansioni, sensori o messaggi di sistema. Aiuta a eliminare gli errori di inserimento manuale e i cartellini smarriti [10] ed è la forma più usata con fornitori lontani [1]. Avviate prima un ciclo su carta; digitalizzate quando le regole sono consolidate.

### Qual è la differenza tra kanban e MRP?

L'MRP pianifica materiali e capacità a partire da un piano principale di produzione e dalle distinte base, per data. Il kanban rilascia il rifornimento in base al consumo. Nella maggior parte degli stabilimenti, l'MRP gestisce la pianificazione a lungo termine, le previsioni ai fornitori e i componenti non gestiti a kanban, mentre il kanban esegue il rifornimento quotidiano dei componenti a rotazione [15][16].

### Che cos'è il CONWIP e in cosa differisce dal kanban?

Il CONWIP (constant work in process) usa un unico insieme di cartellini per un'intera linea: un lavoro entra solo quando un cartellino è libero, e il cartellino torna all'inizio al termine del lavoro [3][5]. Il kanban usa cartellini specifici per componente in ogni fase. Il CONWIP è più semplice da impostare e si adatta a linee con molte varianti; il kanban offre un controllo più stretto per ogni fase [5].

### Quando non si dovrebbe usare il kanban?

Quando la domanda per componente è sporadica o molto variabile, quando i prodotti sono personalizzati o a basso volume, quando i tempi di approvvigionamento sono lunghi e poco affidabili, o quando i componenti cambiano revisione spesso. In questi casi conviene invece il make to order con CONWIP o POLCA, oppure un controllo pianificato con MRP [20].

### Un kanban di produzione è lo stesso di una bacheca Kanban?

No. Entrambi limitano il lavoro in corso, ma una bacheca Kanban gestisce le attività nel lavoro di conoscenza e viene dimensionata sulla base del giudizio del team, mentre il kanban di produzione gestisce componenti fisici e viene dimensionato con una formula. Il metodo della bacheca affonda le sue radici nel sistema di produzione Toyota [22].

### Quanti kanban deve avere come minimo un anello?

Due. Con una sola scheda, il consumatore deve attendere ogni volta che la scheda è in transito. Alcuni stabilimenti fissano un minimo interno di tre per i kanban di produzione.

### Quanto tempo richiede l'implementazione del kanban?

Per un singolo flusso di valore, un progetto pilota di 5-15 anelli può essere avviato in circa tre mesi se i processi di fornitura sono stabili; la copertura completa di un flusso di valore richiede in genere circa sei mesi secondo la tabella di marcia sopra. Processi instabili e cambi produzione lunghi allungano questi tempi.

### Il kanban può funzionare con i fornitori?

Sì, tramite i kanban fornitore, che per i fornitori distanti sono di solito elettronici [1]. Concordate il metodo di segnalazione, il lead time, il contenitore, la quantità e cosa succede in caso di picchi. Condividete le previsioni dell'MRP in modo che il fornitore possa pianificare la capacità, mentre il kanban attiva le consegne effettive.

### Il just-in-time è un sistema push o pull?

Pull. Toyota descrive il JIT come un anello in cui i processi a monte reintegrano solo ciò che i processi a valle hanno prelevato [8], e il kanban è lo strumento che lo attua [7]. Uno stabilimento può definirsi JIT e comunque operare in push, ad esempio rilasciando ogni ordine non appena viene registrato; il criterio è se il WIP è limitato [2].

### Che cosa sono i sistemi push e pull nella gestione della supply chain?

La stessa logica applicata tra più aziende. In una supply chain push, materie prime e prodotti finiti vengono movimentati e stoccati in base alle previsioni. In una supply chain pull, il reintegro segue la domanda effettiva, ad esempio tramite i kanban fornitore [1]. La maggior parte delle supply chain combina entrambi: le previsioni pianificano la capacità e gli acquisti a lungo lead time, mentre i segnali di consumo attivano le consegne.

### Un sistema pull può funzionare senza previsioni della domanda?

Non del tutto. Il reintegro giornaliero si basa sui consumi, ma le dimensioni degli anelli vengono calcolate sulla domanda attesa, i moduli kanban dell'ERP le ricalcolano sulla base dei periodi di domanda [15] e i fornitori hanno bisogno di previsioni per pianificare la capacità. Il pull sostituisce il rilascio degli ordini guidato dalle previsioni, non la previsione stessa.

### Il kanban è Lean o Six Sigma?

Lean. Il kanban deriva dal Toyota Production System [7][8], la principale fonte della produzione snella. Six Sigma è un metodo separato, basato sulla statistica, per ridurre la variabilità e i difetti. Molti stabilimenti usano entrambi, perché processi stabili e capaci consentono anelli kanban più piccoli; si veda la [guida a Six Sigma e all'analisi delle cause radice](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).

### Il kanban è giapponese o cinese?

Giapponese. Kanban è la parola giapponese per "segnale" o "cartello" [1], e il metodo è stato sviluppato in Toyota, in Giappone [7][10].

## Conclusioni e primi passi

Un sistema kanban è un limite al WIP reso visibile. Le sue schede, i contenitori e i supermercati traducono un'idea semplice nata nell'officina meccanica di Toyota negli anni Cinquanta in pratica quotidiana: produrre e spostare solo ciò che il processo successivo ha consumato. La definizione più utile per la progettazione viene da Hopp e Spearman: un sistema pull limita esplicitamente il lavoro in corso (WIP) [2]. Il kanban lo fa codice articolo per codice articolo. CONWIP, POLCA e drum-buffer-rope lo fanno per linee, coppie di celle e vincoli, e si adattano dove cicli dedicati a ogni articolo immagazzinerebbero solo articoli a movimento lento.

La parte difficile è il tempo di riapprovvigionamento alla base di ogni scheda, la dimensione del lotto nel processo fornitore, un programma pacemaker livellato e la disciplina necessaria per rispettare le regole. Dimensionate i cicli a partire dai tempi di riapprovvigionamento misurati, confrontate il suggerimento del vostro ERP con il vostro foglio di calcolo, rimuovete schede solo quando qualcuno può correggere ciò che questo rivela, e mantenete le scorte strategiche di sicurezza al di fuori dei cicli dove il rischio di approvvigionamento lo richiede.

**I vostri primi passi nei prossimi 30 giorni**

- [ ] Percorrete una famiglia di prodotti dalla spedizione fino al ricevimento e contate il WIP tra un processo e l'altro
- [ ] Calcolate il lead time attuale con la legge di Little (WIP ÷ produttività giornaliera)
- [ ] Suddividete i codici articolo della famiglia in runner, repeater e stranger in base alla domanda giornaliera e al suo coefficiente di variazione
- [ ] Scegliete da tre a cinque cicli runner accanto a un processo fornitore stabile
- [ ] Misurate il tempo di riapprovvigionamento di ciascun ciclo dall'inizio alla fine e compilate il foglio di dimensionamento
- [ ] Stampate e plastificate le schede, segnate gli slot del supermercato, e formate operatori e addetti alla movimentazione sulle otto regole di reparto
- [ ] Concordate con la finanza come verrà rendicontata la riduzione delle scorte, incluso l'effetto del costing a assorbimento
- [ ] Verificate con l'IT se il vostro ERP dispone di un modulo kanban e come calcola le dimensioni dei cicli; evitate che MRP pianifichi due volte i articoli kanban
- [ ] Rivedete i cicli ogni giorno alla lavagna di reparto per due settimane, poi settimanalmente con il modello di audit
- [ ] Se vi serve supporto esterno, contattate il centro NIST MEP del vostro stato [27]

---

## Ulteriori letture su m365.fm

**Guide di questo percorso di apprendimento**
- [Lean Manufacturing: principi, strumenti, implementazione e limiti](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Pianificazione della produzione e APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Sales and Operations Planning, MRP e pianificazione della produzione](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [Teoria dei vincoli e drum-buffer-rope](https://www.m365.fm/en/learn/theory-of-constraints/)
- [SMED e riduzione dei cambi formato](https://www.m365.fm/en/learn/smed-changeover-reduction/)
- [TPM e OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [5S e gestione visiva](https://www.m365.fm/en/learn/5s-visual-management/)
- [Gestione di reparto e Gemba walk](https://www.m365.fm/en/learn/shop-floor-management/)
- [KPI di produzione](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)
- [Cybersecurity OT e ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/)
- [Azure per la manifattura](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Pianificazione della produzione aerospaziale](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

**Approfondimenti**
- [Dimensionamento dei lotti](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Gestione delle scorte in produzione e scorte di sicurezza](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)
- [Logistica interna e milk run](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Simulazione di produzione](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)
- [Resilienza della supply chain](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/)
- [Lavoro standard](https://www.m365.fm/en/learn/shop-floor-management/standard-work/)
- [Kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/)

**Termini del glossario (entità)**
[Kanban](https://www.m365.fm/entity/kanban/) · [Sistema pull](https://www.m365.fm/entity/pull-system/) · [Just-in-time](https://www.m365.fm/entity/just-in-time/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [5S](https://www.m365.fm/entity/5s/) · [Lavoro standard](https://www.m365.fm/entity/standard-work/) · [Teoria dei vincoli](https://www.m365.fm/entity/theory-of-constraints/) · [Lean management](https://www.m365.fm/entity/lean-management/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** è il conduttore di m365.fm e lavora presso iFAKT GmbH. Su m365.fm scrive di lean manufacturing, pianificazione della produzione e trasformazione digitale della produzione, con particolare attenzione a come i modelli di value stream, la simulazione e l'analisi dei KPI aiutano gli stabilimenti a progettare flusso e pull.

**Nota: l'autore lavora presso iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Sources marked (V) were opened and checked for this article on that date. Sources marked (V-sister) were opened and checked on the same date for the related guide `lean-manufacturing.md`; our fetch budget ran out before a second check for this article, so the fact checker flagged them for a quick re-check before publication.

1. Kanban. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/kanban/ (V)
2. Hopp, W. J.; Spearman, M. L.: To Pull or Not to Pull: What Is the Question? *Manufacturing & Service Operations Management* 6 (2004) 2, pp. 133–148. DOI: 10.1287/msom.1030.0028. https://pubsonline.informs.org/doi/pdf/10.1287/msom.1030.0028 (V)
3. Spearman, M. L.; Woodruff, D. L.; Hopp, W. J.: CONWIP: a pull alternative to kanban. *International Journal of Production Research* 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761. Reprint and abstract: Project Production Institute Journal, Vol. 3 (2018). https://projectproduction.org/journal/conwip-a-pull-alternative-to-kanban/ (V; volume, issue and pages as verified for the related guide `production-scheduling-aps.md`)
4. Spearman, M. L.; Woodruff, D. L.; Hopp, W. J.: CONWIP Redux: reflections on 30 years of development and implementation. *International Journal of Production Research* 60 (2022) 1, pp. 381–387. DOI: 10.1080/00207543.2021.1954713. https://econpapers.repec.org/RePEc:taf:tprsxx:v:60:y:2022:i:1:p:381-387 (V)
5. CONWIP. Wikipedia. https://en.wikipedia.org/wiki/CONWIP (V)
6. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. *Operations Research* 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://ideas.repec.org/a/inm/oropre/v9y1961i3p383-387.html (V)
7. Sugimori, Y. et al. (four authors): Toyota production system and Kanban system: Materialization of just-in-time and respect-for-human system. *International Journal of Production Research* 15 (1977) 6, pp. 553–564. DOI: 10.1080/00207547708943149. https://scispace.com/papers/toyota-production-system-and-kanban-system-materialization-2c0g0kt2j0 (V; the record names Y. Sugimori plus three co-authors)
8. Toyota Production System. Toyota Motor Corporation. https://global.toyota/en/company/vision-and-philosophy/production-system/index.html (V)
9. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press / Routledge (English edition 1988). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140 (V-sister)
10. Kanban. Wikipedia. https://en.wikipedia.org/wiki/Kanban (V)
11. Roser, C.: Toyota's Six Rules for Kanban. AllAboutLean. https://www.allaboutlean.com/toyotas-six-rules/ (V)
12. Roser, C.: How Many Kanbans? The Kanban Formula, Part 1. AllAboutLean. https://www.allaboutlean.com/kanban-formula-part1/ (V)
13. Roser, C.: How Many Kanbans? The Kanban Formula, Part 2. AllAboutLean. https://www.allaboutlean.com/kanban-formula-part2/ (V)
14. Co, H. C.; Moosa, S.: Overplanning Factor in Toyota's Formula for Computing the Number of Kanban. *IIE Transactions* 29 (1997) 5, pp. 409–415. DOI: 10.1080/07408179708966346. https://ink.library.smu.edu.sg/lkcsb_research/892 (V)
15. Kanban quantity calculations and circulating kanbans (Dynamics 365 Supply Chain Management training module). Microsoft Learn. https://learn.microsoft.com/en-us/training/modules/create-process-fixed-kanbans-dyn365-supply-chain-mgmt/5-calculations (V)
16. Kanban Equation 1: Fixed Container Size and High Demand. Oracle JD Edwards EnterpriseOne Kanban Management 9.2 documentation. https://docs.oracle.com/en/applications/jd-edwards/supply-chain-manufacturing/9.2/eoakm/kanban-equation-1-fixed-container-size-and-high-demand.html (V)
17. Lage Junior, M.; Godinho Filho, M.: Variations of the kanban system: Literature review and classification. *International Journal of Production Economics* 125 (2010) 1, pp. 13–21. Elsevier, ScienceDirect PII S0925-5273(10)00019-8. https://ideas.repec.org/a/eee/proeco/v125y2010i1p13-21.html (V; DOI not shown on the record page)
18. Heijunka. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/heijunka/ (V)
19. Pitch. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/pitch/ (V)
20. Suri, R.: The Practitioner's Guide to POLCA: The Production Control System for High-Mix, Low-Volume and Custom Products. Productivity Press / Taylor & Francis. https://www.taylorfrancis.com/books/9781351170765
21. Rajan Suri, Professor Emeritus, Industrial and Systems Engineering (POLCA, Center for Quick Response Manufacturing). University of Wisconsin–Madison, College of Engineering. https://engineering.wisc.edu/?p=27657 (V)
22. Kanban (development). Wikipedia. https://en.wikipedia.org/wiki/Kanban_(development) (V)
23. How the Kanban System of Inventory Management Works. Smartsheet. https://www.smartsheet.com/understanding-kanban-inventory-management-and-its-uses-across-multiple-industries (V; vendor page)
24. Kanban in manufacturing: cards, boards and supermarkets. Veryable. https://www.veryableops.com/blog/kanban-manufacturing-cards-boards-supermarkets (V; vendor page)
25. Plex: Push vs. Pull Manufacturing: Is a Kanban Pull System Right for Your Company? IndustryWeek, July 28, 2017. https://www.industryweek.com/cloud-computing/article/22023873/push-vs-pull-manufacturing-is-a-kanban-pull-system-right-for-your-company (V; vendor byline)
26. Shirouzu, N.: How Toyota thrives when the chips are down. Reuters, via nippon.com (March 2021). https://www.nippon.com/en/news/reu20210309KBN2B1004/ (V-sister)
27. Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement (V)
28. Ergonomics. Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/ergonomics (V)
