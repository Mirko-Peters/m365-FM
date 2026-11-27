# SEO metadata

| Field | Value |
|---|---|
| Meta title | Mappatura del flusso del valore: simboli, metriche ed esempio |
| Meta description | Mappatura del flusso del valore (VSM) passo dopo passo: simboli, formule del takt time e del lead time, esempio completo, stato futuro e software VSM. |
| Slug | `value-stream-mapping` |

# Mappatura del flusso del valore: la guida completa a simboli VSM, metriche, progettazione dello stato futuro e gestione del value stream

> **Risposta breve:** La mappatura del flusso del valore (Value Stream Mapping, VSM) è un metodo Lean per rappresentare il flusso di materiali e di informazioni di una singola famiglia di prodotti, dal fornitore al cliente, su una sola pagina con simboli standard. Una linea temporale con lead time, tempo di lavorazione e giorni di giacenza mostra quanto poco del tempo totale aggiunge valore. La mappa dello stato futuro progetta poi un flusso più snello, e un piano di implementazione lo rende realtà.

In molti stabilimenti un ordine resta in fabbrica per tre o quattro settimane, mentre il lavoro effettivo sul medesimo ordine occupa pochi minuti. Il Wikipedia in lingua tedesca riporta un caso tipico: quattro settimane di lead time contro dieci minuti di puro tempo di lavorazione [27]. Se si guardano solo le singole macchine, questo divario non emerge mai. La mappatura del flusso del valore obbliga a osservare l'intero flusso: dove si fermano i materiali? Perché si fermano lì? Chi comunica a ciascun processo cosa produrre e quando?

Questa guida spiega il metodo dalle basi. Vengono presentati l'insieme completo dei simboli, una procedura passo dopo passo, tutti gli indicatori importanti con la relativa formula e un esempio interamente calcolato, i criteri di progettazione dello stato futuro, i limiti del metodo cartaceo, la mappatura del flusso del valore dinamica e digitale, il Value Stream 4.0, la gestione del flusso del valore come compito di leadership e una panoramica neutrale delle categorie di software. Per una definizione sintetica, si veda la pagina di glossario di m365.fm [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/).

Una nota sulle fonti: la mappatura del flusso del valore (in tedesco: *Wertstromanalyse*) ha una forte tradizione di ricerca in Germania, presso il Fraunhofer IPA e la TU Darmstadt, tra gli altri. Dove una fonte tedesca aggiunge qualcosa che la letteratura in lingua inglese non offre, il contenuto resta nel testo con una breve spiegazione.

### Punti chiave

- La mappatura del flusso del valore considera sempre una **famiglia di prodotti** e l'intero flusso dalla porta all'uscita, non le singole macchine o i singoli reparti.
- Si disegna **partendo dal cliente e risalendo a monte**, a matita, sul shop floor, al gemba (giapponese per "il posto reale", qui il reparto produttivo).
- Gli indicatori principali sono **takt time, cycle time, giorni di giacenza, lead time e flow ratio** (chiamato anche process cycle efficiency o activity ratio). I giorni di giacenza derivano dalla Legge di Little: giacenza divisa per domanda.
- La mappa dello stato attuale è solo metà del metodo. I risultati arrivano dalla **mappa dello stato futuro**, costruita con criteri di progettazione chiari, e da un **piano di implementazione** con responsabili e scadenze.
- La mappa classica è una **fotografia** basata su medie. Con un'elevata varietà di prodotti e una domanda volatile, la simulazione dinamica e la raccolta automatica dei dati ampliano l'analisi.
- La **gestione del flusso del valore** trasforma un workshop una tantum in un compito di leadership continuativo, affidato a un responsabile del flusso del valore con responsabilità precise.

### Percorsi di lettura per lettori con poco tempo

| Siete … | Leggete prima |
|---|---|
| Nuovi al Lean, o studenti | Sezioni da 1 a 4 (definizione, storia, obiettivi, simboli) |
| Facilitatori alla prima esperienza o coach Lean | Sezioni da 5 a 8 (guida passo dopo passo con agenda del workshop, indicatori, esempio, progettazione dello stato futuro) e 14 (errori comuni) |
| Responsabili di stabilimento o dirigenti operativi | Sezione 7 (esempio con i numeri dello stato attuale e futuro), sezioni da 10 a 13 (limiti, VSM dinamica e digitale, Value Stream 4.0, gestione del flusso del valore) |
| Responsabili IT, MES o Microsoft 365/Azure | Sezioni 11 (VSM dinamica e digitale), 12 (Value Stream 4.0) e 15 (categorie di software) |

## Indice

1. Che cos'è il Value Stream Mapping? Definizione e differenze rispetto alla process mapping
2. Storia: dal diagramma del flusso di materiali e informazioni di Toyota a "Learning to See"
3. Obiettivi e vantaggi del Value Stream Mapping
4. Simboli del Value Stream Mapping: tabella di riferimento completa
5. Come creare una mappa del flusso di valore: guida passo passo allo stato attuale
6. Metriche e formule del Value Stream Mapping
7. Esempio di Value Stream Mapping: un flusso di valore calcolato per intero
8. Mappatura dello stato futuro: linee guida di progettazione da Rother/Shook ed Erlach
9. Individuare gli sprechi: gli 8 sprechi e lo spaghetti diagram
10. Limiti del Value Stream Mapping tradizionale
11. Value Stream Mapping dinamico e digitale
12. Value Stream 4.0: la logistica delle informazioni come seconda dimensione
13. Value Stream Management: gestire il flusso di valore come compito di leadership
14. Errori comuni nel Value Stream Mapping e come evitarli
15. Software per il Value Stream Mapping: confronto tra le categorie
16. Value Stream Mapping digitale con iFAKT Polaris VSM e BSM
17. Value Stream Management nello sviluppo software: differenze
18. Evidenze e pubblicazioni di ricerca
19. FAQ: domande frequenti sul Value Stream Mapping
20. Conclusione

## 1. Che cos'è il Value Stream Mapping? Definizione e differenze rispetto alla process mapping

Il Lean Enterprise Institute (LEI) definisce il value stream mapping come "rappresentazione grafica di ogni fase coinvolta nei flussi di materiali e informazioni necessari per portare un prodotto dall'ordine alla consegna" [45]. ASQ lo descrive come "uno strumento Lean che impiega un diagramma di flusso che documenta ogni fase del processo" [46]. In termini più precisi: per una famiglia di prodotti, una mappa del flusso di valore mostra ogni attività necessaria a portare un prodotto dalla materia prima al cliente. Comprende attività a valore aggiunto e attività senza valore aggiunto, il flusso fisico dei materiali e il flusso informativo che lo governa. Il risultato sta su un unico foglio grande, di solito 11 × 17 in (tabloid, vicino al formato A3 usato in Europa), e viene disegnato con simboli standard.

Il **flusso di valore** è l'insieme di tali attività. In inglese, "value stream mapping" e "VSM" sono i termini standard; "value stream analysis" è usato anche, soprattutto per il lavoro sullo stato attuale. Klaus Erlach del Fraunhofer Institute for Manufacturing Engineering and Automation IPA di Stoccarda traccia una chiara distinzione tra **analisi del flusso di valore** (rilevazione e valutazione dello stato attuale) e **progettazione del flusso di valore** (progettazione dello stato futuro) [3][4]. Insieme formano il metodo del flusso di valore. L'associazione tedesca di ingegneria industriale REFA definisce l'analisi in termini analoghi, come metodo per mostrare tutti i processi e i flussi di un processo a valore aggiunto [37].

Dal marzo 2020 esiste uno standard internazionale, la **ISO 22468:2020 "Value stream management (VSM)"**. L'ISO lo descrive come linee guida per raccogliere, valutare e migliorare in modo continuo i dati del flusso di valore e per valutare i flussi di valore con KPI definiti, applicabili a processi legati a materiali, energia e dati [40]. L'indice (pubblicato da DIN, l'ente di normazione tedesco) struttura la gestione del flusso di valore in procedura di base, analisi del flusso di valore, progettazione del flusso di valore, pianificazione del flusso di valore e valutazione e adeguamento dei flussi di valore, con un allegato informativo su box dati ed esempi applicativi [40]. L'ISO ha confermato lo standard come attuale nella revisione del 2025 [40]. È un riferimento utile se si vuole ancorare il metodo a un sistema di produzione aziendale.

### Come il VSM si differenzia dai metodi correlati

| Metodo | Focus | Differenza rispetto al value stream mapping |
|---|---|---|
| Process mapping / diagramma di flusso | singole procedure, spesso in un unico reparto | nessun flusso informativo, nessuna scorta, nessuna linea temporale |
| Analisi del flusso di materiali | percorsi di trasporto, quantità, layout | guarda alla logistica, non a come le informazioni governano il flusso |
| Analisi del valore / ingegneria del valore (in Germania: VDI 2800) | funzioni e costi di un prodotto | legato al prodotto, non al flusso |
| Catena del valore di Porter | attività strategiche di un'azienda | modello di gestione, non un diagramma di flusso operativo; la Wikipedia inglese fa la stessa distinzione [49] |
| Swimlane diagram / BPMN | processi aziendali con responsabilità | forte in ufficio, più debole su scorte e takt |
| Simulazione | comportamento di un sistema nel tempo | dinamica e dettagliata ma più onerosa; complementare al VSM (vedi sezione 11) |

Ciò che distingue la value stream mapping è la combinazione di tre elementi su un'unica pagina: il flusso dei materiali, il flusso delle informazioni e una linea temporale. L'introduzione di *Learning to See* spiega che Toyota insegna tre flussi nella produzione (materiali, informazioni e persone/processi) e che il metodo di mappatura copre i primi due, in modo che i produttori "pensino al flusso invece che ai singoli processi produttivi discreti" [1].

## 2. Storia: dal diagramma del flusso di materiali e informazioni di Toyota a "Learning to See"

La value stream mapping deriva dal Toyota Production System. In Toyota lo strumento si chiama "Material and Information Flow Mapping". I professionisti Toyota lo usavano per rappresentare lo stato attuale e lo stato ideale quando pianificavano le implementazioni Lean, non come strumento formativo [1]. Il termine "value stream" in sé è raramente usato in Toyota [1]. Il lessico di LEI descrive inoltre lo strumento come uno sviluppo Toyota che Toyota chiama diagramma del flusso di materiali e informazioni [45].

Mike Rother ha individuato il metodo di mappatura studiando le pratiche di implementazione Lean di Toyota, lo ha formalizzato e ha costruito attorno ad esso un metodo formativo [1]. Insieme a John Shook, che aveva lavorato undici anni in Toyota tra Giappone e Stati Uniti [1], ha pubblicato con LEI il quaderno di lavoro **"Learning to See"** nel 1998 (l'introduzione è firmata ad Ann Arbor, Michigan, e datata maggio 1998; il sottotitolo della prima edizione era "Value Stream Mapping to Create Value and Eliminate Muda", quello attuale recita "… to Add Value and Eliminate Muda") [1]. Il libro ha ricevuto nel 1999 lo Shingo Research and Professional Publication Award [1]. Il suo caso di studio sullo stabilimento di stampaggio fittizio "Acme Stamping" accompagna il lettore dallo stato attuale alla ricerca degli sprechi fino allo stato futuro [1]. L'edizione attuale di LEI è datata 2018 (ISBN 978-0-9667843-0-5, 148 pagine) [1].

Nei paesi di lingua tedesca, tre libri hanno plasmato la diffusione del metodo; uno di essi è apparso successivamente anche in inglese:

- **Rother/Shook: "Sehen lernen"**, l'edizione tedesca del quaderno LEI, pubblicata dal Lean Management Institut di Aquisgrana (versione 1.1, 2004, ISBN 978-3-9809521-1-8) [2].
- **Klaus Erlach: "Wertstromdesign. Der Weg zur schlanken Fabrik"** (Springer; 1ª ed. 2007, 2ª ed. 2010, ISBN 978-3-540-89867-2; 3ª ed. 2020, ISBN 978-3-662-58906-9) [3]. Erlach sistematizza il metodo per la pianificazione di fabbrica. Un'edizione inglese, **"Value Stream Design: The Way Towards a Lean Factory"**, è uscita presso Springer nel 2012 (copyright 2013, ISBN 978-3-642-12568-3) [4].
- **Thomas Klevers: "Wertstrom-Mapping und Wertstrom-Design"** (mi-Fachverlag, Landsberg am Lech 2007, ISBN 978-3-636-03097-9) [5].

Il metodo è stato successivamente trasferito al lavoro d'ufficio e alla knowledge work, soprattutto da Karen Martin e Mike Osterling in "Value Stream Mapping: How to Visualize Work and Align Leadership for Organizational Transformation" (McGraw-Hill, pubblicato nell'ottobre 2013, copyright 2014, ISBN 978-0-07-182891-8) [6].

Negli Stati Uniti il metodo fa parte del toolkit Lean standard insegnato da LEI, ASQ e dal NIST Manufacturing Extension Partnership (MEP). Il NIST MEP definisce la VSM "spesso il primo passo nell'applicazione dei miglioramenti di processo lean" [47]. In Germania fa parte dei cosiddetti sistemi di produzione olistici, i cui fondamenti sono descritti nella linea guida **VDI 2870 Parte 1** (luglio 2012) dell'Associazione degli ingegneri tedeschi (VDI). Secondo la VDI, la linea guida è in parte ancora valida ed è in fase di revisione [7].

## 3. Obiettivi e vantaggi della mappatura del flusso del valore

L'obiettivo complessivo è un flusso allineato al cliente: il materiale deve attraversare lo stabilimento con la minima attesa possibile, e ogni processo deve produrre solo ciò di cui il processo successivo ha effettivamente bisogno. Ne derivano obiettivi concreti:

- **Ridurre il lead time.** La timeline mostra quanta parte del lead time complessivo è attesa. Poiché le giacenze di solito rappresentano la maggior parte del lead time, ridurle è la leva più efficace.
- **Rendere visibili gli sprechi.** Sovrapproduzione, giacenze, attese e trasporti non necessari emergono direttamente sulla mappa.
- **Semplificare la schedulazione.** La mappa mostra in quanti punti il sistema ERP invia gli ordini. L'obiettivo è schedulare in un solo punto, ove possibile.
- **Creare un linguaggio comune.** Produzione, logistica, pianificazione e vendite discutono lo stesso flusso sulla stessa pagina.
- **Dare priorità ai miglioramenti.** Invece dell'ottimizzazione locale, si ottiene un piano di implementazione che punta all'intero flusso.

### Quando vale la pena mappare il flusso del valore?

Il metodo si adatta meglio alla produzione ripetitiva e a modelli misti con prodotti ricorrenti, giacenze elevate e tempi di consegna lunghi, prima di modifiche al layout, nuovi progetti di stabilimento o investimenti in capacità, e quando la consegna puntuale è scarsa nonostante un'elevata utilizzazione, nonché come punto di partenza di un programma Lean. La forma classica si adatta meno bene alla produzione pura su commessa o engineer-to-order con cicli di lavorazione variabili, perché in quel contesto è difficile definire una famiglia di prodotti stabile. Approcci estesi come la simulazione o l'analisi basata sui dati aiutano in tali casi (cfr. sezione 11). Le piccole e medie imprese manifatturiere statunitensi che desiderano una facilitazione esterna possono rivolgersi ai NIST MEP Centers, che includono la mappatura del flusso del valore tra i metodi Lean che aiutano ad applicare [47].

### Pro e contro in sintesi

| Pro | Contro |
|---|---|
| visione end-to-end del flusso dal punto di vista del cliente | fotografia basata su valori medi |
| simbologia semplice e standard | poco dettaglio su varianti e sequenze di cambio formato |
| bassa barriera d'ingresso: carta, matita, cronometro | la raccolta manuale dei dati richiede tempo e diventa rapidamente obsoleta |
| risultati quantitativi (lead time, rapporto di flusso) | variabilità, guasti ed effetti della dimensione del lotto non sono rappresentati |
| collega flusso di materiali e flusso informativo | gli stati futuri non possono essere testati su carta |
| solida base per azioni di miglioramento e comunicazione | l'impatto dipende da un'implementazione rigorosa |

La colonna di destra spiega perché ricerca e industria estendono il metodo in direzioni dinamiche e digitali da più di dieci anni [16][23]. Ne parleremo a partire dalla sezione 10.

## 4. Simboli della mappatura del flusso del valore: tabella di riferimento completa

I simboli risalgono a *Learning to See* [1][2] e sono volutamente semplici, in modo che chiunque possa disegnarli con una matita. Libri e librerie software differiscono leggermente. Ciò che conta è che il team concordi una legenda e la usi in modo coerente. Le tabelle seguenti descrivono i simboli comuni così come sono utilizzati da Rother/Shook ed Erlach [1][3].

### Simboli del flusso di processo e materiali

| Simbolo (aspetto) | Nome | Significato e uso |
|---|---|---|
| edificio con tetto a denti di sega | cliente / fornitore (fonte esterna) | cliente in alto a destra, fornitore in alto a sinistra; sotto di esso un riquadro dati con domanda, frequenza di consegna e imballaggio |
| rettangolo con una linea di intestazione e il nome del processo | riquadro di processo | un processo attraverso il quale il materiale fluisce in modo continuo; un nuovo riquadro inizia dove il flusso si interrompe e si accumulano scorte |
| rettangolo sotto il riquadro di processo | riquadro dati | dati di processo: tempo di ciclo, tempo di attrezzaggio, tempo di disponibilità/disponibilità operativa, dimensione del lotto, numero di operatori, turni, scarto |
| triangolo con una "I" | scorta | materiale fermo tra due processi; quantità e giorni di scorta sono riportati sotto di esso |
| freccia larga a strisce | freccia di spinta (push) | il materiale è spinto dal processo a monte secondo il proprio programma, non secondo le esigenze del processo successivo |
| freccia larga vuota | spedizione | materia prima dal fornitore allo stabilimento, o prodotti finiti dallo stabilimento al cliente |
| camion (o treno, aereo, nave) | spedizione esterna | mezzo di trasporto con frequenza di consegna, ad es. "2× a settimana" |
| scaffale aperto a sinistra | supermercato | scorta tampone controllata da cui il processo cliente preleva; il processo fornitore reintegra solo ciò che è stato prelevato |
| freccia circolare | prelievo (pull) | prelievo fisico dal supermercato da parte del processo a valle |
| freccia con "FIFO" e una quantità massima | corsia FIFO | coda limitata tra due processi; i pezzi procedono nell'ordine di arrivo, e il processo fornitore si ferma quando si raggiunge il massimo |
| triangolo con una nota di sicurezza | scorta di sicurezza o di tampone | scorta contro le fluttuazioni della domanda (tampone) o i guasti di processo (sicurezza) |
| cerchio con la testa di un operatore | operatore | numero di persone presenti in un processo |

### Simboli del flusso informativo

| Simbolo (aspetto) | Nome | Significato e uso |
|---|---|---|
| freccia sottile e dritta | flusso informativo manuale | informazioni su carta o verbali, ad es. cartellino di percorso, documento di consegna, istruzione verbale |
| freccia a zigzag (fulmine) | flusso informativo elettronico | messaggi EDI, ERP o MES, e-mail |
| rettangolo "Production Control" | controllo della produzione | pianificazione, MRP o ERP, spesso con la frequenza di pianificazione |
| cartellino con angolo tagliato, pieno | kanban di produzione | segnale a un processo per produrre una quantità definita |
| cartellino con angolo tagliato, tratteggiato o altrimenti contrassegnato a seconda della libreria | kanban di prelievo | istruzione a un addetto alla movimentazione di prelevare i pezzi dal supermercato |
| triangolo appoggiato sulla punta | kanban di segnale | attiva un lotto quando la scorta del supermercato raggiunge il punto di riordino; tipico per processi con attrezzaggi |
| simbolo simile a una cassetta postale | posta kanban | punto in cui i kanban vengono raccolti per il ritiro |
| freccia tratteggiata con kanban | percorso kanban | percorso dei cartellini di ritorno al processo fornitore |
| riquadro con una griglia di slot "OXOX" | heijunka box (cassetta di livellamento del carico) | strumento per livellare volume e mix sul processo pacemaker |
| occhiali | programmazione go-see | programmazione tramite controllo visivo invece che tramite segnali sistematici; segno che è necessario un miglioramento |

Alcune guide online descrivono la freccia tratteggiata come flusso informativo elettronico [38]. In *Learning to See*, la freccia a fulmine rappresenta l'informazione elettronica e la freccia sottile dritta l'informazione manuale [1]. Attenersi a tale convenzione affinché le mappe restino leggibili tra stabilimenti e strumenti software. Una guida illustrata dei simboli è disponibile nel post [Value Stream Mapping Symbols and Icons Explained](https://www.m365.fm/community/u/mirko-p/blog/value-stream-mapping-symbols-icons/).

### Simboli generali

| Simbolo (aspetto) | Nome | Significato e uso |
|---|---|---|
| esplosione frastagliata ("kaizen burst") | necessità di miglioramento | segna un punto della mappa dello stato attuale o futuro in cui è necessario un miglioramento |
| onda quadra lungo il fondo | linea temporale (scala del lead time) | tempi di attesa (giorni di scorta) su un livello, tempi di lavorazione sull'altro; totali del lead time e del tempo di lavorazione a destra |

Per i processi d'ufficio, come la gestione degli ordini prima della produzione, Polaris BSM aggiunge le swimlane BPMN ai simboli della mappa del flusso del valore [30]. Anche la ricerca ha ripreso la stessa idea: l'approccio Value Stream Mapping 4.0 della TU Darmstadt include esplicitamente tutti i reparti di gestione ordini, a partire dal primo contatto con il cliente [14].

## 5. Come creare una mappa del flusso del valore: guida passo passo allo stato attuale

La guida seguente segue la logica di Rother/Shook ed Erlach [1][3] e aggiunge dettagli pratici. Per una prima mappa di un flusso del valore gestibile, pianificare da uno a due giorni con un piccolo team [unverified]. Le raccomandazioni sulla dimensione del team differiscono: ASQ considera ideali circa 10 membri e suggerisce un evento kaizen di tre giorni per l'avvio [46], mentre una guida pratica tedesca di Mind Logistik preferisce un piccolo team di massimo sei persone [42]. Entrambe sono raccomandazioni pratiche, non risultati di ricerca. Scegliere il team più piccolo se il flusso del valore è breve e quello più grande se molti reparti vi partecipano.

> **Se si facilita per la prima volta: un programma collaudato**
>
> - **Team:** persone della produzione (capoturno o responsabile di turno), logistica, pianificazione della produzione, manutenzione e qualità; aggiungere vendite o gestione ordini se il problema è il tempo di consegna. Partecipa anche il futuro responsabile del flusso del valore.
> - **Materiali:** fogli 11 × 17 in o un rotolo di carta kraft, matita e gomma, portablocco, cronometro, foglio di conteggio delle scorte e una legenda dei simboli concordata in anticipo.
> - **Chiarire in anticipo:** famiglia di prodotti, domanda del cliente negli ultimi mesi, turni e pause. Annunciare il sopralluogo nelle aree interessate e spiegare che si valutano i processi, non le persone.
> - **Giorno 1:** introduzione a obiettivi e simboli (circa un'ora), percorrere il flusso a ritroso dalla spedizione in coppie, unire i dati in un'unica mappa, calcolare le metriche.
> - **Giorno 2 o sessione di follow-up:** validare la mappa con le aree, aggiungere i kaizen burst, rispondere alle domande dello stato futuro (sezione 8), avviare il piano di implementazione con i responsabili.
>
> Durate e composizione del team sono valori di esperienza e dipendono dalle dimensioni del flusso del valore [unverified].

### Passo 1: definire obiettivo e perimetro

Prima del primo sopralluogo, decidere quale domanda debba trovare risposta la mappa. Esempi: perché il nostro tempo di consegna è di 15 giorni quando il cliente se ne aspetta 5? Quanta superficie di pavimento guadagniamo riducendo le scorte? Definire i confini. Il perimetro usuale è "dalla porta alla porta", dal ricevimento alla spedizione all'interno di uno stabilimento [1]. Un flusso del valore su più stabilimenti o fornitori (flusso del valore esteso) è il secondo passo, non il primo.

Nominare anche un responsabile. Rother/Shook raccomandano di affidare la responsabilità del flusso del valore a una sola persona, il value stream manager, anziché suddividerla tra più reparti. LEI definisce questo ruolo come "un individuo a cui è assegnata una responsabilità chiara per il successo di un flusso del valore" [10]. Maggiori dettagli nella sezione 13.

### Passo 2: definire la famiglia di prodotti

Una famiglia di prodotti è un gruppo di prodotti che attraversano fasi di lavorazione simili su attrezzature condivise. Lo strumento è una **matrice prodotto-processo**: prodotti o varianti nelle righe, processi nelle colonne. I prodotti con quasi gli stessi segni di spunta formano una famiglia. ASQ suggerisce di cercare prodotti che condividano circa l'80% delle fasi [46]. Come regola empirica, il contenuto di lavoro dei prodotti di una stessa famiglia non dovrebbe differire molto [unverified]. La Wikipedia in lingua tedesca sottolinea che i flussi del valore si formano lungo le catene di processo o i flussi di materiale, e che suddividerli per funzione è insolito perché va contro tempi di attraversamento brevi [27].

Per la prima mappa, scegliere una famiglia con un'alta quota di fatturato o un problema urgente. Un'analisi di Pareto (ABC) per volume e fatturato aiuta.

### Passo 3: rilevare la domanda del cliente

Iniziare la mappa in alto a destra con il simbolo del cliente. Nel riquadro dati, indicare la domanda (ad es. pezzi al mese), il mix di varianti, la dimensione del lotto o la quantità per imballo, la frequenza di consegna e il tempo di consegna richiesto. Dalla domanda e dal tempo di lavoro disponibile, calcolare il **takt time** (formula nella sezione 6). Il takt time è il riferimento per ogni altra valutazione.

### Passo 4: percorrere il processo al gemba, a ritroso dalla spedizione

Percorrere il flusso in direzione opposta, dalla spedizione al ricevimento. Rother/Shook spiegano che in questo modo si parte dai processi più vicini al cliente, che dovrebbero dettare il ritmo [1]. La Wikipedia in lingua tedesca descrive anche la registrazione a ritroso dal cliente, attraverso il produttore, fino al fornitore [27].

Disegna un riquadro di processo per ogni sezione in cui il materiale scorre in modo continuo. Dove il materiale si ferma, un riquadro di processo termina e inizia un triangolo di giacenza. Usa le tue osservazioni e un cronometro, non i dati dell'ERP. Il sistema ERP conosce i tempi standard dai cicli di lavorazione, non ciò che accade realmente alla postazione di lavoro.

### Passo 5: Compila i riquadri dei dati

Registra almeno i seguenti dati per ogni processo:

| Campo dati | Abbreviazione | Spiegazione |
|---|---|---|
| Tempo ciclo | C/T | tempo tra due pezzi buoni alla fine del processo |
| Tempo di lavorazione (tempo a valore aggiunto) | P/T, VA | tempo durante il quale il lavoro aggiunge effettivamente valore al pezzo |
| Tempo di cambio | C/O | tempo dall'ultimo pezzo buono del vecchio lotto al primo pezzo buono del nuovo lotto |
| Disponibilità / uptime | | quota del tempo pianificato in cui l'impianto può effettivamente produrre; decidi se i cambi sono inclusi o rilevati separatamente |
| Dimensione del lotto / EPEI | | pezzi per lotto, oppure "every part every interval": con quale frequenza viene prodotta ogni variante |
| Operatori | | numero di persone per turno |
| Turni | | numero di turni e tempo disponibile per turno dopo le pause |
| Scarti / rilavorazioni | | quota di pezzi difettosi |

Per i processi con più macchine in parallelo, annota il numero di macchine e calcola il tempo ciclo effettivo del processo (tempo ciclo per macchina diviso per il numero di macchine).

### Passo 6: Conta le giacenze

Conta le giacenze sul reparto, non nel sistema. Scrivi la quantità sotto ogni triangolo di giacenza e convertila in **giorni di giacenza** usando la domanda giornaliera. Conta anche le giacenze che "non risultano": pezzi nelle aree di attesa, sui carrelli, negli angoli delle rilavorazioni. È spesso lì che si nasconde la maggior parte del tempo di attesa.

### Passo 7: Aggiungi i flussi di materiale esterni

In alto a sinistra, disegna il fornitore principale (o i fornitori delle materie prime più importanti) e collega fornitore, ricevimento, spedizione e cliente con i simboli dei camion e le frequenze di consegna.

### Passo 8: Disegna il flusso informativo

Il flusso informativo è la parte che i team trascurano più spesso, anche se spiega perché il materiale si ferma. Chiedi a ogni processo: come fa questo processo a sapere cosa produrre dopo? Le risposte tipiche sono un programma settimanale dal sistema ERP, un elenco giornaliero dal capoturno, un kanban, un richiamo attraverso il corridoio o "quello che c'è". Disegna il controllo della produzione al centro in alto, collega cliente e fornitore con frecce elettroniche o manuali e mostra quali informazioni raggiungono ciascun processo. Dove un processo riceve più segnali o programmi a vista, aggiungi gli occhiali per la programmazione go-see.

Poi contrassegna i flussi di materiale tra i processi come push (freccia tratteggiata), FIFO o pull (supermercato e prelievo).

### Passo 9: Disegna la timeline e calcola le metriche

La timeline va sotto i processi. Su un livello annota i giorni di giacenza; sull'altro, i tempi di lavorazione dei processi. A destra, somma entrambi per ottenere il **lead time** e il **tempo di lavorazione**, e calcola il **flow ratio**. Nei flussi di valore ramificati, il percorso più lungo determina il lead time [41].

### Passo 10: Segna gli sprechi e convalida

Segnala i problemi con i kaizen burst: processi con tempi ciclo superiori al takt, giacenze elevate, cambi lunghi, uptime basso, più punti di programmazione. Rivedi la mappa finita con i dipendenti delle aree interessate. La convalida da parte delle persone sul reparto evita che un team di workshop disegni un flusso di valore che non esiste nello stabilimento.

### Checklist dello stato attuale

- [ ] Obiettivo, perimetro e responsabile del flusso di valore definiti
- [ ] Famiglia di prodotti definita con una matrice prodotto-processo
- [ ] Domanda del cliente, varianti e takt time determinati
- [ ] Tutti i processi rilevati sul reparto e a ritroso
- [ ] Riquadri dei dati compilati con valori misurati
- [ ] Giacenze contate e convertite in giorni
- [ ] Fornitori, cliente e trasporti disegnati
- [ ] Flusso informativo chiarito per ogni processo
- [ ] Timeline, lead time, tempo di lavorazione e flow ratio calcolati
- [ ] Kaizen burst aggiunti e mappa convalidata con i dipendenti

## 6. Metriche e formule della mappatura del flusso di valore

Le metriche rendono comparabili le mappe del flusso di valore. In ZWF (Zeitschrift für wirtschaftlichen Fabrikbetrieb, rivista tedesca di ingegneria della produzione pubblicata da De Gruyter), Jörg Drees e Christoph Sack mostrano che metriche del flusso di valore come la riduzione delle scorte, l'utilizzo delle risorse, la capacità di consegna e i lead time brevi sembrano perseguire obiettivi in conflitto tra loro ma, se applicate correttamente, forniscono indicazioni coerenti. Propongono un insieme di metriche di base che, insieme a metodi Lean mirati, formano circuiti di controllo [19]. Le formule seguenti coprono tale insieme di base. Altre definizioni sono disponibili nelle pagine dedicate [Lead Time](https://www.m365.fm/entity/lead-time/), [Cycle Time](https://www.m365.fm/entity/cycle-time/) e [Takt Time](https://www.m365.fm/entity/takt-time/).

**Una nota sulla terminologia.** Le guide statunitensi usano diversi nomi per lo stesso rapporto. Ciò che i testi tedeschi chiamano *Flussgrad* compare in inglese come flow ratio, process cycle efficiency (PCE), value-added ratio, flow efficiency o, nella terminologia di Karen Martin, activity ratio ("la somma dei Process Time di tutte le singole fasi divisa per il Total Lead Time") [44]. Questa guida usa **flow ratio** in tutto il testo. Analogamente, "inventory days", "days of supply" e "days of inventory" hanno lo stesso significato.

### Takt time

> **Takt time = tempo di lavoro disponibile per periodo ÷ domanda del cliente per periodo**

LEI riporta l'esempio di una fabbrica di widget che opera 480 minuti al giorno mentre i clienti chiedono 240 widget al giorno, il che dà un takt time di due minuti [8]. ASQ applica la stessa formula con 22.000 secondi e 200 pezzi, ottenendo 110 secondi per pezzo [46]. Il tempo di lavoro disponibile è il tempo di turno meno le pause pianificate. Il fermo non pianificato non viene sottratto; rientra nella disponibilità. La parola "takt" è tedesca (significa battito o pulsazione, come in musica). Secondo LEI, il takt fu usato per la prima volta come strumento di gestione della produzione nell'industria aeronautica tedesca negli anni Trenta e fu ampiamente adottato alla Toyota negli anni Cinquanta [8].

### Cycle time e effective cycle time

Il cycle time è il tempo che intercorre tra due pezzi buoni alla fine di un processo. Per confrontarlo con il takt time, occorre tenere conto di disponibilità e scarti:

> **Effective cycle time = cycle time ÷ (disponibilità × resa al primo passaggio)**

Un processo con cycle time di 98 secondi e disponibilità dell'85% produce effettivamente un pezzo ogni 115 secondi. Rispetto a un takt time di 117 secondi è quasi completamente saturo, anche se il cycle time nominale suggerirebbe un margine del 16%.

Attenzione a una confusione frequente: alcune guide in inglese usano "cycle time" per indicare il tempo totale che un'unità trascorre nel processo, o persino il tempo di consegna del fornitore. Su una mappa del flusso di valore, il cycle time indica sempre l'intervallo tra due pezzi buoni alla fine di un singolo processo.

### Giorni di scorta e legge di Little

> **Giorni di scorta = scorta (pezzi) ÷ domanda giornaliera (pezzi al giorno)**

La Wikipedia in lingua tedesca calcola 280 pezzi con una domanda giornaliera di 80 pezzi come 3,5 giorni di scorta [27]. Questo calcolo applica la **legge di Little**, che John D. C. Little dimostrò nel 1961 sulla rivista Operations Research [12]:

> **L = λ × W**, riordinata: **W = L ÷ λ**

L è la scorta media nel sistema, λ la portata media e W il tempo medio nel sistema. Applicata a un flusso di valore: il tempo medio di attesa di un pezzo in un buffer è pari alla scorta divisa per il tasso di consumo. La legge di Little vale per sistemi stabili nel lungo periodo. Per singole giornate con picchi di domanda, o per un sistema in fase di avviamento, la formula è solo un'approssimazione. È uno dei motivi per cui esiste la mappatura dinamica del flusso di valore (sezione 11).

### Lead time

> **Lead time di produzione = Σ giorni di scorta + Σ tempi di lavorazione (lungo il percorso più lungo)**

Poiché i tempi di lavorazione si misurano di solito in secondi o minuti e le scorte in giorni, la somma dei giorni di scorta domina il risultato. Una tesi di diploma presso la Hochschule Mittweida (università tedesca di scienze applicate) riassume la definizione di Erlach di lead time di produzione come somma dei tempi di lavorazione e di processo più gli intervalli di scorta, con il percorso più lungo come elemento decisivo [41]. Il glossario di Martin la formula in modo più generale: il lead time equivale al process time più il wait time [44].

### Processing time e process time

**Tempo di lavorazione** è il tempo durante il quale il pezzo viene lavorato. Erlach distingue inoltre il **tempo di processo** per fasi come l'essiccazione, la polimerizzazione o il trattamento termico, che richiedono tempo senza che nessuno lavori sul pezzo [41]. Entrambi concorrono al rapporto di flusso.

### Rapporto di flusso (efficienza del ciclo di processo)

> **Rapporto di flusso = (tempo di lavorazione + tempo di processo) ÷ lead time × 100%**

La versione in lingua tedesca di Wikipedia descrive il rapporto di flusso come la quota del puro tempo di lavorazione sul lead time complessivo e lo definisce l'indicatore chiave dell'analisi del flusso del valore [27]. Fate attenzione alla base temporale. Se il lead time è espresso in giorni lavorativi, convertitelo in secondi usando il tempo di lavoro giornaliero, come fa la formula di Erlach con il fattore "tempo di lavoro giornaliero" [41]. Se calcolate in giorni di calendario, il rapporto di flusso scende ulteriormente. Scegliete una convenzione e mantenetela, altrimenti lo stato attuale e quello futuro non sono confrontabili.

### Altri indicatori

| Indicatore | Formula / definizione | Uso |
|---|---|---|
| Carico rispetto al takt | tempo ciclo effettivo ÷ tempo takt | valori superiori al 100% indicano un collo di bottiglia |
| Numero di operatori necessari | Σ contenuto di lavoro ÷ tempo takt | base per il bilanciamento della linea |
| EPEI | tempo necessario per produrre una volta ogni variante | mostra la flessibilità e gli effetti della dimensione del lotto |
| Quota di cambi formato | (numero di cambi formato × tempo di cambio formato) ÷ tempo disponibile | mostra quanta capacità resta libera per lotti più piccoli |
| Carico inclusi i cambi formato | (domanda giornaliera × tempo ciclo + cambi formato × tempo di cambio formato) ÷ (tempo disponibile × disponibilità) | verifica se uno stato futuro con lotti piccoli può ancora rispettare il takt (esempio nella sezione 7) |
| Consegna puntuale | ordini consegnati in tempo ÷ tutti gli ordini | indicatore di risultato dal punto di vista del cliente |
| %C&A (percentuale completa e corretta) | quota di lavoro che la fase successiva riceve completa e senza errori | qualità dei passaggi di consegna; utilizzato soprattutto nei flussi del valore d'ufficio [44] |
| OEE | disponibilità × prestazione × qualità | efficacia delle attrezzature; il riquadro dei dati spesso lo abbrevia in uptime |

Un grafico di bilanciamento degli operatori (un grafico a barre dei tempi ciclo effettivi con una linea orizzontale per il tempo takt) rende visibili a colpo d'occhio i colli di bottiglia e la sovracapacità. Erlach lo usa per mostrare quanto bene la capacità sia allineata al takt [3]. La versione in lingua tedesca di Wikipedia osserva che tempi ciclo vicini al takt indicano colli di bottiglia, mentre tempi ciclo ben al di sotto del takt indicano sovracapacità e spreco [27].

## 7. Esempio di Value Stream Mapping: un flusso di valore calcolato per intero

L'esempio che segue è **fittizio e costruito per questa guida**. Mostra come le metriche si collegano e fa girare lo stato attuale e lo stato futuro con gli stessi dati di base.

### Punto di partenza

Un fornitore produce una famiglia di prodotti di corpi di valvole idrauliche in cinque varianti con lo stesso ciclo di lavorazione: taglio, tornitura, fresatura, lavaggio, assemblaggio. Il cliente richiama in media 9.200 pezzi al mese, distribuiti su 20 giorni lavorativi. Lo stabilimento lavora su due turni da 8 ore, ciascuno con una pausa di 30 minuti.

**Passo A: calcolo del takt time**

- Domanda giornaliera: 9.200 pezzi ÷ 20 giorni = **460 pezzi al giorno**
- Tempo di lavoro disponibile: 2 × (480 min − 30 min) = 900 min = **54.000 s al giorno**
- Takt time: 54.000 s ÷ 460 pezzi = **117,4 s per pezzo**

### Stato attuale: dati di processo

| Processo | Tempo ciclo | Tempo di cambio | Disponibilità | Tempo ciclo effettivo | Carico vs. takt |
|---|---|---|---|---|---|
| Taglio | 45 s | 30 min | 95% | 47,4 s | 40% |
| Tornitura | 98 s | 60 min | 85% | 115,3 s | 98% |
| Fresatura | 125 s | 45 min | 90% | 138,9 s | **118%** |
| Lavaggio | 40 s | 0 min | 98% | 40,8 s | 35% |
| Assemblaggio | 105 s | 15 min | 95% | 110,5 s | 94% |

Semplificazioni: il tempo di lavorazione coincide qui con il tempo ciclo perché ogni processo lavora un pezzo dopo l'altro. Gli scarti sono ignorati. La disponibilità copre solo i guasti; i cambi formato sono trattati separatamente.

**Risultato sul collo di bottiglia:** la fresatura è già sopra il takt con un tempo nominale di 125 s, e con un tempo effettivo di 138,9 s è superiore del 18%. In un giorno la fresatura produce 54.000 s × 0,90 ÷ 125 s = **389 pezzi** invece dei 460 necessari. I cambi formato riducono ulteriormente questo numero. Lo stabilimento colma il divario con turni straordinari del sabato. La tornitura appare non critica sulla carta (98 s), ma risulta caricata al 98% una volta considerata la disponibilità. Se si ignora la disponibilità, si perde questo secondo quasi-collo di bottiglia.

### Stato attuale: scorte e tempistiche

| Scorta | Quantità | Giorni di scorta (quantità ÷ 460) |
|---|---|---|
| Materia prima prima del taglio | 4.600 pezzi | 10,0 giorni |
| Dopo il taglio | 1.380 pezzi | 3,0 giorni |
| Dopo la tornitura | 920 pezzi | 2,0 giorni |
| Dopo la fresatura | 690 pezzi | 1,5 giorni |
| Dopo il lavaggio | 460 pezzi | 1,0 giorno |
| Prodotti finiti | 1.150 pezzi | 2,5 giorni |
| **Totale** | **9.200 pezzi** | **20,0 giorni** |

- **Tempo di lavorazione:** 45 + 98 + 125 + 40 + 105 = **413 s** (poco meno di 7 minuti)
- **Lead time:** 20,0 giorni lavorativi + 413 s ≈ **20 giorni lavorativi**
- **Rapporto di flusso (base tempo lavorativo):** 413 s ÷ (20 × 54.000 s) = 413 ÷ 1.080.000 = **0,038%**
- **Rapporto di flusso (base calendario):** 20 giorni lavorativi corrispondono a circa 28 giorni di calendario; 413 s ÷ (28 × 86.400 s) = **0,017%**

**Verifica di plausibilità con la Legge di Little:** scorta totale di 9.200 pezzi ÷ throughput di 460 pezzi al giorno = 20 giorni [12]. La somma dei giorni di scorta dei singoli stadi e il calcolo complessivo coincidono. Se questa verifica non torna sulla mappa, si è dimenticata qualche scorta oppure si sono mescolati valori di riferimento diversi.

**Risultato sul flusso informativo:** la pianificazione della produzione invia un programma settimanale a tutti e cinque i processi. Ogni processo produce secondo il proprio programma e spinge il materiale a valle. Non esiste un limite di quantità tra i processi, quindi le scorte si accumulano davanti al collo di bottiglia. Il responsabile dell'assemblaggio interviene ogni giorno con ordini urgenti (go-see scheduling).

### Stato futuro: azioni di miglioramento

Utilizzando le linee guida di progettazione della sezione 8, il team progetta questo stato futuro:

1. **Eliminare il collo di bottiglia della fresatura:** le migliorie su utensili e attrezzaggi riducono il tempo ciclo da 125 a 95 s; un'iniziativa TPM (total productive maintenance, manutenzione produttiva totale con coinvolgimento degli operatori) porta la disponibilità dal 90 al 95%.
2. **Stabilizzare la tornitura:** l'ottimizzazione del programma riduce il tempo ciclo da 98 a 90 s; il TPM porta la disponibilità dall'85 al 92%.
3. **Bilanciare il montaggio:** il contenuto di lavoro viene ridistribuito e il tempo ciclo scende da 105 a 95 s.
4. **Ridurre i tempi di cambio (SMED):** poiché ogni variante verrà prodotta ogni giorno, ogni processo richiede cinque cambi al giorno. SMED (single-minute exchange of die: preparazione del cambio mentre la macchina è ancora in funzione) riduce il tempo di cambio in tornitura da 60 a 10 min, in fresatura da 45 a 10 min e nel montaggio da 15 a 5 min. Senza questa fase lo stato futuro non sarebbe fattibile: cinque cambi da 60 minuti ciascuno non rientrano nella capacità libera della tornitura.
5. **Collegamenti FIFO:** tornitura, fresatura, lavaggio e montaggio sono collegati da tre corsie FIFO con quantità massime di 60, 30 e 30 pezzi.
6. **Supermercato dopo la segatura:** poiché la segatura è molto più veloce e deve effettuare cambi, un supermercato con mezza giornata di scorta (230 pezzi) la disaccoppia. Un kanban di segnale attiva i nuovi lotti.
7. **Montaggio come pacemaker:** la pianificazione invia gli ordini cliente solo al montaggio. Una heijunka box distribuisce uniformemente le cinque varianti nell'arco della giornata. Con una quantità di confezionamento di 20 pezzi, il passo è 20 × 117,4 s ≈ 39 minuti.
8. **Supermercato dei prodotti finiti:** una giornata di scorta (460 pezzi) assorbe le fluttuazioni negli ordini di prelievo dei clienti.
9. **Collegamento con i fornitori:** le consegne di materia prima passano da una a due volte alla settimana; la scorta di materia prima scende a cinque giorni (2.300 pezzi).

### Stato futuro: verifica di capacità con i cambi

Uno stato futuro deve rispettare il takt time anche con cambi giornalieri. La verifica calcola quindi due valori: il tempo ciclo effettivo confrontato con il takt e il carico comprensivo dei cambi.

> **Carico comprensivo dei cambi = (domanda giornaliera × tempo ciclo + cambi × tempo di cambio) ÷ (tempo disponibile × disponibilità)**

| Processo | Tempo ciclo | Tempo di cambio | Disponibilità | Tempo ciclo effettivo | Carico vs. takt | Carico incl. 5 cambi |
|---|---|---|---|---|---|---|
| Segatura | 45 s | 30 min | 95% | 47,4 s | 40% | 58% |
| Tornitura | 90 s | 10 min | 92% | 97,8 s | 83% | 89% |
| Fresatura | 95 s | 10 min | 95% | 100,0 s | 85% | **91%** |
| Lavaggio | 40 s | 0 min | 98% | 40,8 s | 35% | 35% |
| Montaggio | 95 s | 5 min | 95% | 100,0 s | 85% | 88% |

Calcolo per la fresatura: (460 × 95 s + 5 × 600 s) ÷ (54.000 s × 0,95) = 46.700 ÷ 51.300 = 91%. Tutti i processi restano sotto il 100%, con il valore più alto in fresatura. Il pacemaker, il montaggio, ha una certa riserva per le fluttuazioni degli ordini di prelievo con l'88%.

### Stato futuro: risultato

| Indicatore | Attuale | Futuro | Variazione |
|---|---|---|---|
| Scorta totale | 9.200 pezzi | 2.300 + 230 + 120 + 460 = 3.110 pezzi | −66% |
| Lead time (Little) | 20,0 giorni lavorativi | 3.110 ÷ 460 = 6,8 giorni lavorativi | −66% |
| Tempo di lavorazione | 413 s | 45 + 90 + 95 + 40 + 95 = 365 s | −12% |
| Rapporto di flusso (base tempo lavorato) | 0,038% | 365 ÷ (6,76 × 54.000) = 0,100% | fattore 2,6 |
| Collo di bottiglia | fresatura 118% (senza cambi) | carico massimo in fresatura 91% incl. cambi | takt rispettato senza turni del sabato |
| Punti di pianificazione | 5 (programma settimanale a tutti) | 1 (pacemaker montaggio) | pianificazione più semplice |

Le corsie FIFO sono conteggiate alla quantità massima (60 + 30 + 30 = 120 pezzi). In esercizio raramente sono piene, quindi la scorta futura è un limite superiore prudenziale.

Due insegnamenti dall'esempio. Primo, sono le misure di pianificazione e di gestione delle scorte a produrre la maggior parte della riduzione del lead time, non macchine più veloci. Il tempo di lavorazione scende del 12%, il lead time del 66%. Secondo, anche il rapporto di flusso migliorato, pari allo 0,1%, resta basso. È tipico degli impianti con un polmone di materia prima. Ciò che conta è la direzione e un takt time che possa essere rispettato in modo affidabile anche con cambi giornalieri.

## 8. Mappatura dello stato futuro: linee guida di progettazione da Rother/Shook ed Erlach

La progettazione dello stato futuro risponde alla domanda su come debba scorrere il flusso di valore. *Learning to See* porta il lettore dallo stato attuale a una "mappa di uno stato futuro più snello" e a un piano del flusso di valore che guida l'implementazione e viene rivisto periodicamente [1].

### Domande chiave per lo stato futuro secondo Rother/Shook

Rother/Shook strutturano la progettazione attraverso una serie di domande chiave [1] (parafrasate):

1. Qual è il takt time?
2. Produciamo a magazzino di prodotti finiti oppure direttamente per la spedizione?
3. Dove possiamo usare il flusso continuo?
4. Dove servono sistemi pull a supermarket?
5. In quale singolo punto della catena produttiva (il processo pacemaker) programmiamo la produzione?
6. Come livelliamo il mix produttivo nel processo pacemaker?
7. Quale incremento di lavoro rilasciamo e prelevamo in modo costante al pacemaker?
8. Quali miglioramenti di processo servono per far funzionare lo stato futuro?

### Le linee guida di Rother e Shook

In un articolo per il Lean Post di LEI (19 ottobre 2022), Mike Rother e John Shook riassumono le linee guida per un flusso di valore snello come segue [11]:

| N. | Linea guida (formulazione originale) | Cosa significa |
|---|---|---|
| 1 | "Produce to your takt time" | allinea la produzione alla domanda del cliente |
| 2 | "Develop continuous flow wherever possible" | crea il flusso un pezzo alla volta dove possibile |
| 3 | "Use supermarkets to control production where continuous flow does not extend upstream" | usa i supermarket dove il flusso non è possibile |
| 4 | "Try to send the customer schedule only to one production process" | invia gli ordini del cliente a un solo processo (il pacemaker) |
| 5 | "Distribute the production of different products evenly over a set time at the pacemaker process" | livella il mix di prodotti al pacemaker (heijunka) |
| 6 | "Create an 'initial pull' by releasing and withdrawing small, consistent increments of work at the pacemaker process" | livella il volume di produzione |

Fonti secondarie citano una settima linea guida da *Learning to See*: la capacità di produrre ogni componente ogni giorno nei processi a monte del pacemaker ("every part every day"), e in seguito ogni turno o ogni ora [1] [unverified: non verificato rispetto al testo del libro]. L'esempio della sezione 7 mostra perché questa linea guida richiede tempi di cambio formato brevi.

### Linee guida di progettazione di Erlach

Klaus Erlach organizza la progettazione del flusso di valore in otto linee guida di progettazione che si basano l'una sull'altra [3]. Si dividono in tre gruppi: progettazione dei processi produttivi (linee guida 1 e 2), controllo della produzione (da 3 a 5) e pianificazione della produzione (da 6 a 8). I nomi seguono il libro tedesco di Erlach e la panoramica sul suo sito web; l'edizione inglese (Springer 2012/2013) è descritta dall'editore come portatrice di "ten design guidelines" [4], quindi la numerazione nel testo inglese può differire.

| N. | Linea guida di progettazione [3] | Domanda chiave per il flusso di valore |
|---|---|---|
| 1 | Allineamento al takt time | Tutti i processi sono progettati per rispettare il takt time in modo affidabile, e dove c'è sovraccapacità? |
| 2 | Integrazione dei processi | Quali fasi di processo possono essere combinate fisicamente e organizzativamente in un flusso continuo? |
| 3 | Accoppiamento FIFO | Dove si possono collegare i processi tramite corsie FIFO limitate invece di stoccaggi illimitati? |
| 4 | Controllo Kanban | Dove serve un supermarket con kanban perché i processi hanno tempi ciclo o cambi formato diversi? |
| 5 | Processo pacemaker | In quale singolo processo vengono programmati gli ordini dei clienti? |
| 6 | Definizione dell'unità di rilascio | In quale incremento temporale viene rilasciato il lavoro al pacemaker (pitch)? |
| 7 | Livellamento del mix produttivo | Come vengono distribuite in modo uniforme le varianti, e dove ha senso costruire campagne di produzione? |
| 8 | Controllo del collo di bottiglia | Come viene controllato un collo di bottiglia residuo affinché non rimanga mai senza lavoro? |

L'ordine segue la logica dei tre gruppi: un mix produttivo livellato (linea guida 7) presuppone che i processi siano allineati al takt e che il controllo tramite FIFO, kanban e pacemaker funzioni (linee guida da 1 a 5).

### Termini dello stato futuro in breve

- **Flusso continuo (one-piece flow):** i pezzi si spostano uno alla volta da un processo all'altro senza stoccaggi intermedi.
- **Supermercato e kanban:** il processo a valle preleva e il processo che fornisce rimpiazza solo ciò che è stato prelevato. Ulteriori informazioni nelle pagine delle voci [Kanban](https://www.m365.fm/entity/kanban/) e [Pull System](https://www.m365.fm/entity/pull-system/).
- **Corsia FIFO:** una coda con quantità massima; quando è piena, il processo che fornisce si ferma. La FIFO è più semplice del kanban e si adatta a componenti ad alta varietà che non devono essere prodotti a magazzino.
- **Processo pacemaker:** l'unico processo che riceve gli ordini dei clienti. I processi a monte sono controllati tramite supermercato pull o corsie FIFO; i processi a valle lavorano in flusso continuo o FIFO.
- **Heijunka:** livellamento di volume e mix, ad esempio con una heijunka box con uno slot per ogni intervallo di tempo.
- **Pitch / unità di rilascio:** l'intervallo di tempo in cui il lavoro viene rilasciato e i prodotti finiti vengono prelevati: takt time × quantità di confezionamento, nell'esempio della sezione 7 20 × 117,4 s ≈ 39 minuti.
- **SMED e TPM:** lo SMED riduce i tempi di cambio preparando le attività di cambio mentre la macchina è ancora in funzione; il TPM aumenta la disponibilità tramite la manutenzione preventiva. Entrambi sono spesso prerequisiti per uno stato futuro con lotti piccoli.

### Dallo stato futuro al piano di implementazione

Uno stato futuro senza un piano è solo un bel poster. Suddividi lo stato futuro in **cicli del flusso del valore**: il ciclo del pacemaker (dal pacemaker al cliente) e i cicli a monte fino a ciascun supermercato. Ogni ciclo ha obiettivi, azioni, responsabili e date. Rother e Shook raccomandano di iniziare dal ciclo del pacemaker perché è il più vicino al cliente [unverified: fonte da verificare]. Pianifica per cicli di alcuni mesi e rivedi regolarmente i progressi, ad esempio in una revisione mensile del flusso del valore.

La valutazione economica è un ostacolo comune. Busch, Niehues e Maassen descrivono in ZWF che l'industria spesso non riesce a realizzare il potenziale del flusso del valore perché il beneficio è quantificato in modo insufficiente. Estendono il metodo del flusso del valore con un modello di valutazione basato sui costi che collega metriche operative e strategiche [25]. Per il tuo piano di implementazione questo significa: traduci in denaro la riduzione delle scorte, lo spazio a pavimento recuperato e la riduzione dei lead time prima di chiedere un budget.

## 9. Individuare gli sprechi: gli 8 sprechi e il diagramma a spaghetti

La mappatura del flusso del valore è uno strumento per individuare gli sprechi (in giapponese: muda). La classificazione dei sette sprechi risale a Taiichi Ohno [9][32]; LEI li elenca come sovrapproduzione, attesa, trasporto, lavorazione, scorte, movimento e correzione [9]. Jeffrey Liker ne ha aggiunto un ottavo in "The Toyota Way" (2004): la creatività e le competenze inutilizzate dei dipendenti [33]. Negli Stati Uniti, gli otto sprechi vengono spesso insegnati con l'acronimo DOWNTIME: defects (difetti), overproduction (sovrapproduzione), waiting (attesa), non-utilized talent (talento non utilizzato), transportation (trasporto), inventory (scorte), motion (movimento), extra processing (lavorazione superflua) [51]. Una panoramica sintetica è disponibile nella pagina dell'entità [Eight Wastes](https://www.m365.fm/entity/eight-wastes/).

| N. | Spreco | Come riconoscerlo sulla mappa del flusso del valore |
|---|---|---|
| 1 | Sovrapproduzione | frecce push, lotti grandi, scorte dopo processi veloci; secondo LEI "la forma peggiore di spreco perché contribuisce agli altri sei" [9] |
| 2 | Attesa | operatori in attesa di macchine, materiale o approvazioni; carico basso rispetto al takt |
| 3 | Trasporto | molte frecce di camion e trasporto, stoccaggi intermedi tra i processi |
| 4 | Sovralavorazione | fasi di processo senza valore per il cliente, ispezioni duplicate |
| 5 | Scorte | triangoli di scorta con molti giorni, supermercati senza quantità massime |
| 6 | Movimento | lunghi spostamenti dei dipendenti, ricerca di pezzi e attrezzi (meglio visibile in un diagramma a spaghetti) |
| 7 | Difetti / correzione | scarti e rilavorazioni nel riquadro dei dati, frecce di flusso di ritorno |
| 8 | Talento inutilizzato | programmazione di go-see, nessun coinvolgimento nella stesura della mappa, nessun suggerimento di miglioramento |

### Il diagramma a spaghetti come complemento

La mappa del flusso del valore mostra il flusso a un livello astratto. Non mostra quanto percorrono effettivamente pezzi e persone. A questo serve il **diagramma a spaghetti**: su una planimetria in scala si traccia con una penna ogni percorso di un pezzo o di una persona. Il risultato assomiglia spesso a un piatto di spaghetti e rende visibili insieme gli sprechi di trasporto e di movimento. LEI riporta il caso di Thrustmaster of Texas, produttore con sede a Houston di apparecchiature per la propulsione marina, dove un diagramma a spaghetti dell'area di assemblaggio dei propulsori ha rivelato più di sette miglia di percorso a piedi e quasi 10 ore di tempo senza valore aggiunto per unità; dopo una riprogettazione del layout incentrata sul flusso e sul lavoro standard, l'azienda ha riferito una consegna puntuale al 100% dopo 18 mesi [43]. Utilizzate il diagramma a spaghetti dopo la mappa del flusso del valore per i processi con i kaizen burst più evidenti. Dettagli nella pagina dell'entità [Spaghetti Diagram](https://www.m365.fm/entity/spaghetti-diagram/).

## 10. Limiti della Value Stream Mapping tradizionale

La value stream mapping su carta è semplice di proposito. Questa semplicità è il suo punto di forza e anche il suo limite. La letteratura discute soprattutto cinque debolezze.

**1. Istantanea.** La mappa mostra lo stato di un giorno o di una settimana. In ZWF, Lugert e Winkler osservano che il carattere statico della value stream mapping diventa un problema crescente sotto le attuali megatendenze produttive, e chiedono una gestione dinamica del flusso di valore [23]. Fraunhofer IPA si chiede se singole istantanee siano sufficienti per analizzare nel complesso un processo produttivo [22].

**2. Medie invece di distribuzioni.** Le data box contengono medie. Tempi ciclo fluttuanti, guasti e picchi di domanda scompaiono nella media. La Legge di Little vale per la media di lungo periodo di sistemi stabili [12], ma non dice nulla sulla dispersione dei singoli ordini.

**3. Varietà di prodotto.** Già nel 2011 Drees e Sack segnalavano catene del valore più complesse, un numero crescente di varianti di prodotto e fluttuazioni quotidiane della domanda [19]. Con centinaia di varianti e cicli di lavorazione diversi diventa quasi impossibile formare una famiglia di prodotti con tempi ciclo uniformi.

**4. Raccolta manuale dei dati.** Secondo Fraunhofer IPA, i dati annotati su fogli e le medie stimate sono meno aggiornati, accurati e completi dei dati raccolti digitalmente [22]. In molte aziende i dati per la value stream mapping vengono raccolti manualmente e solo come istantanea [21]. Lo sforzo richiesto fa sì che le mappe vengano raramente aggiornate.

**5. Nessuna verifica dello stato futuro.** Se corsie FIFO da 30 pezzi siano sufficienti, o se un supermarket si svuoti durante i picchi di domanda, non può essere verificato su carta. Türck, Weimer, Schubert e Drees (iFAKT GmbH) chiedono quindi quali nuove opportunità di ottimizzazione emergano quando si considera il fattore tempo [16].

Esiste anche una lacuna di contenuto: il metodo classico migliora soprattutto il flusso dei materiali. Il flusso informativo viene disegnato, ma raramente valutato. È qui che entra in gioco la Value Stream Mapping 4.0 (sezione 12) [13][15].

## 11. Value Stream Mapping dinamica e digitale

Il metodo si sta evolvendo lungo due assi: **dinamico** (simulazione del comportamento nel tempo e della variabilità) e **digitale** (raccolta automatica dei dati e calcolo continuo delle metriche). Entrambi gli assi si aggiungono al metodo classico; nessuno dei due lo sostituisce.

### Dalla mappa statica alla simulazione

Già nel 2014 Stefan Türck, Andreas Weimer, Lars Schubert e Jörg Drees di iFAKT GmbH descrivevano in ZWF il percorso dall'analisi statica dei flussi di valore e delle loro metriche alla **simulazione dinamica** [16]. Il loro punto di partenza era che la modellazione dei flussi di valore è ormai consolidata in molte aziende manifatturiere e che gli strumenti digitali per farla stanno trovando accettazione [16]. La value stream mapping dinamica non si chiede soltanto quale sia la giacenza media, ma come essa si sviluppi nel tempo quando gli ordini fluttuano, le macchine si guastano o le sequenze di cambio formato cambiano.

Nella pratica, la mappa del flusso di valore diventa un modello in cui ogni simbolo ha un comportamento. Un processo non ha più un tempo ciclo fisso ma una distribuzione; un supermarket ha un punto di riordino e un massimo; la domanda del cliente segue una serie temporale. La simulazione mostra se lo stato futuro funziona in condizioni realistiche, dove i buffer sono troppo piccoli e quale distribuzione dei lead time aspettarsi. Maggiori informazioni sulla simulazione di fabbrica in generale nella pagina dedicata [Factory Simulation](https://www.m365.fm/entity/factory-simulation/).

### Confronto: value stream mapping statica vs. dinamica

| Criterio | VSM statico (classico) | VSM dinamico / simulazione |
|---|---|---|
| Base dei dati | medie da una sola rilevazione in campo | distribuzioni, serie temporali, dati di eventi |
| Riferimento temporale | istantanea | evoluzione nell'arco di giorni, settimane, mesi |
| Varietà di prodotto | famiglia di prodotto con valori uniformi | varianti con cicli di lavorazione e sequenze di cambio propri |
| Variabilità e guasti | non rappresentati | modellati tramite distribuzioni e profili di guasto |
| Metriche | lead time, flow ratio, giorni di scorta come valori singoli | più dispersione, percentili, carico nel tempo |
| Verifica dello stato futuro | non possibile, solo giudizio di esperti | scenari confrontabili prima dell'implementazione |
| Impegno | basso: carta e cronometro | maggiore: modellazione e manutenzione dei dati |
| Strumenti | carta, lavagna, software di diagrammi | software VSM specializzato con collegamento alla simulazione, suite di simulazione |
| Punto di forza | comprensione, comunicazione, coinvolgimento | riduzione del rischio degli investimenti e dimensionamento dei buffer |
| Uso tipico | avvio, workshop, formazione Lean | pianificazione di stabilimento, produzione ad alta varietà, decisioni di capacità |

### Value stream mapping digitale: dati dallo stabilimento invece che dalla carta

Il secondo asse riguarda la raccolta dei dati. In ZWF, Christian Urnauer mostra come il **process mining** possa derivare processi, relazioni tra di essi e metriche di performance dai timestamp della produzione, offrendo al value stream mapping una prospettiva basata sui dati [24].

Il Fraunhofer IPA segue un percorso simile sotto il motto "We are automating the gemba walk": dalla rilevazione digitale dei dati sul shop floor alla visualizzazione delle metriche del value stream, con analisi aggiornate, metriche coerenti basate sui dati e semplice integrazione dei KPI di energia e impronta di carbonio [22]. Anche i produttori statunitensi dispongono di un riferimento pubblico per l'aspetto ambientale: il Lean & Environment Toolkit dell'EPA raccomanda di selezionare "one or two environmental performance metrics to measure for each process in the value stream", come la quantità di rifiuti pericolosi per turno, e di riportarle nei riquadri di processo accanto al cycle time e all'uptime [48].

In termini ISA-95 (ANSI/ISA-95, noto a livello internazionale come IEC 62264), i dati per un value stream digitale provengono dai sistemi aziendali di Livello 4 come ERP, dai sistemi di gestione delle operazioni di produzione di Livello 3 come MES, e dai sistemi di controllo e sensori di Livello 2 [50]. Questa stratificazione aiuta quando con l'IT si discute quale sistema fornisce quale campo dei riquadri di dati.

Un esempio concreto è il progetto di ricerca **ECOWERT** ("analisi del value stream orientata al tempo reale per l'ottimizzazione della produzione sostenibile") di Fraunhofer IPA e iFAKT GmbH. Si è svolto dal 1° settembre 2021 al 31 agosto 2022, ha avuto un volume di 500.000 euro ed è stato finanziato dal Land tedesco del Baden-Württemberg tramite il programma Invest BW [20]. L'obiettivo era un'analisi del value stream che raccogliesse automaticamente i dati di ERP, MES, macchine e sensori, li aggiornasse in modo continuo e aggiungesse i dati energetici del value stream [20]. Jörg Drees e Steffi Stambera (iFAKT) e Markus Böhm (Fraunhofer IPA) descrivono l'architettura: i dati grezzi passano attraverso un gateway IIoT e MQTT (con la specifica di payload Sparkplug) in un database di serie temporali e vengono elaborati dal software Polaris VSM. La loro conclusione: il risultato è un approccio in grado di produrre analisi del value stream quasi in tempo reale, e per generare i dati è già sufficiente equipaggiare le macchine esistenti con semplici sensori [21].

Per riutilizzare questi dati, Böhm, Drees, Sai, Erlach, Stambera e Teriete hanno sviluppato una **interfaccia dati universale per i servizi digitali di value stream**. Trattano gli eventi del shop floor come dati grezzi strutturati per servizi di ottimizzazione e standardizzano il flusso di dati in modo che i servizi possano collegarsi tramite un'unica interfaccia. Nel progetto ECOWERT è stato collegato un servizio per il calcolo e la visualizzazione delle metriche [18]. Tra gli autori figura Klaus Erlach (Fraunhofer IPA), autore dell'opera di riferimento sulla progettazione del value stream [18][3].

### Dal value stream digitale al gemello digitale

Quando la mappa del flusso del valore viene aggiornata in modo continuo con dati in tempo reale e accoppiata a un modello di simulazione, diventa un elemento costitutivo di un gemello digitale della produzione. Siemens, ad esempio, offre un add-on VSM Library per Plant Simulation X che consente agli utenti di "eseguire simulazioni dinamiche dei flussi del valore" e "creare e confrontare più scenari", come lo stato attuale e lo stato futuro [35]. Ulteriori informazioni sul concetto sono disponibili nella pagina dell'entità [Digital Twin](https://www.m365.fm/entity/digital-twin/) e nella guida [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/).

Il modo in cui un flusso del valore funziona come modello dati vivo è discusso anche nell'episodio di m365.fm [Value Stream Mapping with a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/).

**Avvertenza importante:** la digitalizzazione non corregge un flusso difettoso. La TU Darmstadt raccomanda esplicitamente di stabilire prima un flusso snello e stabile, con la progettazione classica del flusso del valore, e solo dopo affrontare i miglioramenti digitali. Sconsiglia di digitalizzare processi complessi prima che siano stabili [14].

## 12. Value Stream 4.0: la logistica dell'informazione come seconda dimensione

**Value Stream Mapping 4.0** è stato sviluppato presso l'Institute of Production Management, Technology and Machine Tools (PTW) della TU Darmstadt in Germania. Tobias Meudt, Joachim Metternich ed Eberhard Abele lo hanno presentato nel 2017 sulla rivista CIRP Annals con il titolo "Value stream mapping 4.0: Holistic examination of value stream and information logistics in production" [13]. È seguito un libro in inglese: "Value Stream 4.0: A Systems View of Information Flow for Digitalization" di Metternich, Meudt e Hartmann (CRC Press, pubblicato a luglio 2025, copyright 2026) [15].

L'idea centrale: accanto al flusso di materiali viene analizzata sistematicamente la **logistica dell'informazione**. L'informazione deve essere disponibile al momento giusto, nel posto giusto, nella quantità e qualità giuste, con il minor spreco possibile [14]. Secondo la guida "Industrie 4.0 trifft Lean" (Industria 4.0 incontra il Lean) dell'associazione industriale tedesca dell'ingegneria meccanica (VDMA), sviluppata scientificamente da Metternich, Meudt e Hartmann, il metodo comprende questi elementi [14]:

- **Ambito più ampio:** dal primo contatto con il cliente fino all'utilizzo del prodotto, attraverso tutti i reparti che gestiscono l'evasione degli ordini.
- **Riquadri di processo estesi:** con fonti di informazione, intervalli di rilevazione, tipo di rilevazione (automatica, semiautomatica, manuale) e valori correnti.
- **Supporti di memorizzazione come linee:** carta, ERP, MES, Excel e altri supporti di memorizzazione sono rappresentati come linee orizzontali collegate alle fonti tramite linee verticali.
- **Otto tipi di spreco nella logistica dell'informazione**, organizzati lungo il ciclo di vita dei dati: nella creazione e nel trasferimento (selezione dei dati, qualità dei dati, acquisizione dei dati, trasferimento dei dati), nell'elaborazione e nella conservazione (attesa e giacenza di informazioni; trasporto, movimento e ricerca) e nell'utilizzo (analisi dei dati, supporto alle decisioni).
- **Metriche:** disponibilità dell'informazione, utilizzo dell'informazione e grado di digitalizzazione.

Nell'esempio di un costruttore di macchine speciali, l'analisi ha rilevato dodici supporti di memorizzazione in uso, inserimento manuale duplicato dei dati e un grado di digitalizzazione e di utilizzo dei dati pari allo zero percento in entrambi i casi [14].

Bega e colleghi hanno esteso il Value Stream Mapping 4.0 nel 2023 sulla rivista Production Engineering, per l'identificazione completa dei flussi di dati e informazioni [26]. Ciò dimostra che Value Stream 4.0 non è un metodo concluso, ma un campo di ricerca attivo.

Nel 2018 Jörg Drees ha espresso un punto di vista affine dalla prospettiva di un fornitore di software sulla rivista ZWF, con il titolo "Wertstrom Management 4.0: Next Generation": la crescente interconnessione delle informazioni attraverso Industria 4.0 e l'Industrial Internet of Things (IIoT) genera nuove aspettative, e metodo e software devono adattarsi alle nuove forme di organizzazione e controllo della catena del valore [17].

## 13. Value Stream Management: gestire il value stream come compito di leadership

Un progetto di value stream mapping ha un inizio e una fine. Il **value stream management** è invece continuo. Significa guidare un value stream attraverso i confini dei reparti nel lungo periodo, con aggiornamenti regolari della mappa, obiettivi a livello di value stream e responsabilità chiare. Un'introduzione dettagliata si trova nel post [What Is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/).

Lugert e Winkler sostengono che le sole soluzioni tecniche dell'Industria 4.0 non bastano a trasformare la mappatura statica del value stream in un approccio di gestione dinamico. Organizzazione e persone devono essere considerate allo stesso modo [23]. La norma ISO 22468:2020 riflette questo ciclo nella propria struttura: analisi, progettazione, pianificazione, valutazione e adeguamento dei value stream [40].

### Il ciclo del value stream management

1. **Analizzare:** registrare lo stato attuale, idealmente con dati raccolti automaticamente.
2. **Progettare:** disegnare lo stato futuro usando le linee guida di progettazione, idealmente validato tramite simulazione.
3. **Pianificare:** piano di implementazione per ciclo di value stream, con obiettivi e responsabili.
4. **Implementare:** azioni in eventi kaizen e nel lavoro quotidiano.
5. **Valutare:** monitorare le metriche in modo continuo e quantificare l'impatto in denaro [25].
6. **Adeguare:** aggiornare la mappa e derivare il successivo stato futuro.

### Il ruolo del value stream manager

LEI descrive il value stream manager come "una persona a cui è assegnata una responsabilità chiara per il successo di un value stream". Questa persona identifica il valore dal punto di vista del cliente, progetta il value stream e spinge verso un flusso sempre più veloce. Poiché denaro, asset e persone di norma fanno capo ai reparti funzionali, il value stream manager "guida attraverso l'influenza, non attraverso la posizione". LEI indica nel chief engineer di Toyota il modello di riferimento per questo ruolo [10].

Nella pratica, il value stream manager tipicamente:

- è responsabile delle mappe di stato attuale e futuro e del piano di implementazione
- facilita la revisione periodica del value stream
- monitora le metriche del value stream (lead time, scorte, consegne puntuali, produttività)
- risolve i conflitti di obiettivi tra reparti
- porta gli ostacoli all'attenzione della direzione di stabilimento

Il post [Value Stream Manager: Role and Responsibilities](https://www.m365.fm/community/u/mirko-p/blog/value-stream-manager-role-responsibilities/) descrive in dettaglio il profilo, l'autorità e le tipiche insidie del ruolo. Come il software supporta il value stream management nella manifattura è trattato in [Value Stream Management Software in Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/).

Il value stream management è strettamente legato al [Lean management](https://www.m365.fm/entity/lean-management/) nel suo insieme; vedere le guide [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) e [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/). Le routine quotidiane che mantengono vivo uno stato futuro, come le riunioni a più livelli e i gemba walk, sono oggetto della guida [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

## 14. Errori comuni nella mappatura del flusso del valore e come evitarli

| Errore | Conseguenza | Contromisura |
|---|---|---|
| mappare a tavolino con i dati dell'ERP | la mappa mostra tempi standard, non la realtà | rilevare al gemba con cronometro e conteggi |
| nessuna famiglia di prodotti definita | la mappa diventa confusa e non valutabile | matrice prodotto-processo prima del primo sopralluogo |
| troppo dettaglio | il workshop si perde nei singoli passaggi | disegnare un box di processo solo dove il flusso si ferma |
| flusso informativo trascurato | la causa delle scorte resta poco chiara | chiedere in ogni processo: come sa cosa produrre? |
| disponibilità non considerata | i colli di bottiglia vengono mancati | confrontare il tempo ciclo effettivo con il takt time |
| solo stato attuale, nessuno stato futuro | analisi senza effetto | progettazione dello stato futuro e piano di implementazione obbligatori |
| stato futuro come immagine ideale senza piano | frustrazione, nulla accade | loop del flusso del valore con obiettivi, responsabili, date |
| dipendenti non coinvolti | resistenza, dati sbagliati | validare la mappa insieme alle aree |
| progetto una tantum senza responsabile | la mappa è obsoleta dopo poche settimane | nominare un responsabile del flusso del valore, fissare una cadenza di revisione |
| digitalizzare prima di stabilizzare | gli sprechi vengono automatizzati | stabilizzare prima il flusso, poi digitalizzare [14] |
| basi temporali diverse per stato attuale e futuro | rapporti di flusso non confrontabili | fissare una volta la convenzione (giorni lavorativi o di calendario) |

## 15. Software per la mappatura del flusso del valore: categorie a confronto

Chi cerca "software per la mappatura del flusso del valore" vuole soprattutto sapere quale strumento è adatto, quali funzioni dovrebbe avere e se esistono opzioni gratuite. Anziché una classifica di singoli prodotti, è utile una suddivisione per categorie, perché gli strumenti differiscono meno nel disegno che in ciò che accade dopo il disegno.

| Categoria | Esempi tipici | Punti di forza | Limiti | Ideale per |
|---|---|---|---|---|
| Carta e lavagna | carta da pacchi, post-it, matita | massimo coinvolgimento, nessuna competenza software richiesta, gratuito | nessun calcolo, difficile da condividere e versionare | prima mappa al gemba, formazione |
| Software generico di diagrammi e lavagne | Microsoft Visio, Lucidchart, Miro, EdrawMax | librerie di simboli, collaborazione, spesso piani di ingresso gratuiti | metriche per lo più manuali, nessuna logica dietro i simboli | documentazione, team distribuiti |
| Software VSM specializzato con calcolo delle metriche | iFAKT Polaris VSM, SimVSM (SimPlan), visTable | simboli con formule integrate, timeline automatica, confronto di varianti e scenari | costi di licenza, curva di apprendimento | lavoro regolare sul flusso del valore, gestione del flusso del valore |
| Software VSM con collegamento alla simulazione | SimVSM Pro [34], Plant Simulation X con VSM Library [35] | analisi dinamica, test dello stato futuro | maggiore impegno di modellazione e dati | produzione ad alta varietà, decisioni di investimento |
| Analisi basata sui dati / process mining | ONIQ [36], approcci di ricerca come ECOWERT [20] | metriche dai dati di produzione, analisi continua anziché una tantum | qualità dei dati e integrazione IT sono decisive | stabilimenti con una base dati MES/ERP |
| Piattaforme di gestione del flusso del valore (sviluppo software) | piattaforme secondo la definizione di mercato di Gartner [31] | misurazione end-to-end della catena di consegna del software | non progettate per la produzione fisica | organizzazioni IT e software |

Leggere con spirito critico le dichiarazioni dei fornitori. ONIQ, ad esempio, afferma che l'automazione riduce fino al 90% lo sforzo per l'analisi del flusso del valore [36]; non è stata pubblicata alcuna metodologia indipendente. SimPlan descrive SimVSM come in grado di coprire la registrazione digitale e gli indicatori statici, con SimVSM Pro che aggiunge parametri dinamici e un'interfaccia verso la simulazione [34].

### Criteri di selezione

- **Simboli:** Lo strumento supporta i simboli comuni di Rother/Shook e si possono aggiungere simboli propri?
- **Logica di calcolo:** Takt time, giorni di scorta, lead time e rapporto di flusso vengono calcolati automaticamente? Le formule sono trasparenti e adattabili?
- **Scenari:** È possibile versionare e confrontare lo stato attuale, lo stato futuro e gli stati intermedi?
- **Dinamica:** È disponibile una simulazione o un collegamento a uno strumento di simulazione?
- **Collegamento dati:** Lo strumento può partire senza una connessione ERP o MES e acquisire i dati automaticamente in un secondo momento?
- **Implementazione:** Azioni, kaizen burst e responsabili vengono gestiti nello stesso strumento?
- **Collaborazione e operatività:** ruoli e permessi, multi-tenancy, cloud o on-premises, integrazione nel panorama IT esistente (per stabilimenti basati su Microsoft, vedi la guida [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)).
- **Costi:** modello di licenza, versione di prova, impegno per la formazione.

Una buona domanda di verifica: lo strumento aiuta solo a documentare lo stato attuale, oppure supporta anche la guida verso lo stato futuro mentre lo stabilimento cambia settimana dopo settimana?

## 16. Digital Value Stream Mapping con iFAKT Polaris VSM e BSM

> **Nota: l'autore lavora presso iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), con sede a Stoccarda, in Germania, è stata fondata nel 2001, secondo quanto dichiara l'azienda [19]. Dipendenti dell'azienda hanno scritto diversi articoli ZWF sul value stream mapping dinamico e digitale citati in questa guida (panoramica nella sezione 18, "Pubblicazioni di ricerca"). La famiglia di software [iFAKT Polaris](https://www.m365.fm/entity/polaris/) è nata da questo lavoro; una guida separata è disponibile su [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/). Per il value stream mapping sono rilevanti due moduli:

**[Polaris VSM](https://www.m365.fm/entity/polaris-vsm/)** è uno strumento digitale di Lean management che i produttori usano per mappare catene di fornitura e value stream. Secondo il post di Microsoft sulla sua scheda AppSource, le metriche possono essere calcolate, verificate e visualizzate tramite un sistema di formule, integrato da lavagne Kanban e Kaizen e dalla collaborazione da qualsiasi luogo [29]. Sul sito ifakt.de il fornitore elenca queste funzioni [28]:

- mappe del value stream con drag-and-drop, simboli standard e gerarchie a più livelli
- metriche automatiche come lead time, cycle time, rapporto di valore aggiunto e OEE in dashboard, con report pronti per l'esportazione
- scenari illimitati, analisi di sensitività, cronologia delle versioni con rollback e confronto affiancato delle metriche
- permessi basati sui ruoli, multi-tenancy e documentazione PDCA
- avvio senza connessione ERP o MES, con collegamento dati opzionale in un secondo momento

Nel progetto di ricerca ECOWERT, Polaris VSM è stato lo strumento di valutazione per i dati raccolti automaticamente (vedi sezione 11) [21]. Il fornitore non elenca una funzione di simulazione in senso stretto; per l'analisi dinamica serve uno strumento della categoria "collegamento a simulazione" (sezione 15). I dati sui benefici riportati nella pagina del fornitore (come una riduzione del 25% del lead time) non vengono ripresi qui, perché non ne viene fornita la metodologia.

**[Polaris BSM](https://www.m365.fm/entity/polaris-bsm/)** (Business Swimlane Modeling) aggiunge i processi aziendali alla vista del value stream. Secondo la scheda AppSource, i passi di processo vengono raggruppati in pool e lane, e fattori temporali e metriche vengono registrati e confrontati; i piani vanno da "Read Only" a "Basic" (registrazioni BPMN, modelli a swimlane, formule di base, lead time e grafico di bilanciamento), fino a "Excellence" e "Integrate & Customize" [30]. Questo è utile quando il value stream non inizia in produzione ma nella preventivazione, nell'ingegneria e nella gestione degli ordini.

Entrambi i moduli sono elencati su Microsoft AppSource [29][30]. Il fornitore non pubblica i prezzi; una demo è disponibile su richiesta [30].

**Valutazione:** Uno strumento come Polaris VSM non sostituisce l'andare al gemba o la progettazione dello stato futuro. Si occupa di calcoli, rende comparabili gli scenari e può mantenere aggiornata la mappa quando i dati affluiscono automaticamente. Se si adatta al vostro stabilimento dipende dalla varietà di prodotti, dai dati disponibili e dal panorama IT. Verificatelo con i criteri di selezione della sezione 15, come per qualsiasi altra soluzione.

## 17. Value Stream Management nello sviluppo software: le differenze

Se si cerca "value stream mapping" o "value stream management" su google.com, molti risultati provengono dallo sviluppo software e dal DevOps. Gartner descrive le piattaforme di value stream management come strumenti che "consentono alle organizzazioni di ottimizzare la consegna del prodotto dall'inizio alla fine e di migliorare i risultati di business"; sono agnostiche rispetto agli strumenti e si collegano a quelli esistenti lungo l'intero ciclo di vita della consegna software [31]. Il Flow Framework di Mik Kersten in "Project to Product" (IT Revolution, 2018) ha introdotto per questo ambito metriche come il flow time e il flow load [39].

L'idea di base è la stessa della fabbrica: rendere visibile il flusso dalla richiesta del cliente alla consegna e ridurre le attese. Le differenze, però, sono rilevanti. Nello sviluppo software fluiscono elementi di lavoro anziché materiali, l'inventario è costituito da ticket non completati e il takt time è difficile da definire in modo significativo. Martin e Osterling hanno trasferito il metodo al lavoro d'ufficio e al lavoro di conoscenza, ponendo al centro metriche come la percentuale completa e accurata (%C&A): la quota di lavoro che la fase successiva trova completa e priva di errori. Moltiplicata per tutte le fasi, fornisce la %C&A complessiva, che il glossario di Martin chiama rolled first pass yield [6][44]. Per la manifattura, il metodo classico con takt time, inventario e timeline resta il punto di riferimento.

## 18. Evidenze e pubblicazioni di ricerca

Dati di casi robusti e pubblicati in modo indipendente sul value stream mapping sono più rari di quanto suggeriscano le molte affermazioni di successo diffuse online. Sono documentati questi:

- **Costruttore di macchinari speciali (TU Darmstadt / VDMA):** dodici supporti di memorizzazione e un grado di digitalizzazione pari a zero percento (dettagli nella sezione 12) [14].
- **ECOWERT (Fraunhofer IPA e iFAKT):** analisi del value stream quasi in tempo reale con sensori retrofit (dettagli nella sezione 11) [20][21].
- **HELLA (ZWF 2018):** sviluppo di un modello di valutazione basato sui costi per le azioni del value stream, insieme al fornitore automobilistico tedesco HELLA GmbH & Co. KGaA, per dare priorità a miglioramenti concorrenti in termini di business [25].
- **Schaeffler (ZWF 2017):** Andreas Lugert, responsabile del Lean management presso Schaeffler AG, e Herwig Winkler (BTU Cottbus-Senftenberg) descrivono il percorso dalla value stream mapping statica alla value stream management dinamica [23].
- **Thrustmaster of Texas (LEI):** rapporto di caso sullo spaghetti chart come complemento all'analisi dei flussi, con consegne puntuali al 100% riportate 18 mesi dopo [43].

Il noto caso didattico "Acme Stamping" da *Learning to See* è fittizio [1], ma si presta bene alla pratica.

### Pubblicazioni di ricerca su value stream mapping dinamico e digitale

Le seguenti pubblicazioni sono state scritte da autori di iFAKT GmbH, in parte insieme al Fraunhofer IPA. Sono in tedesco e possono essere verificate tramite DOI presso l'editore. Nel complesso ripercorrono lo sviluppo dal calcolo delle metriche alla simulazione fino a un'interfaccia dati basata su eventi:

| Anno | Titolo (traduzione inglese) | Autori | Pubblicazione |
|---|---|---|---|
| 2011 | Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung (Production optimization through value stream modeling metrics) | J. Drees, C. Sack | ZWF 106 (6), pp. 466–470, DOI 10.3139/104.110589 [19] |
| 2014 | Dynamische Simulation von Wertströmen (Dynamic simulation of value streams) | S. Türck, A. Weimer, [L. Schubert](https://www.m365.fm/entity/lars-schubert/), [J. Drees](https://www.m365.fm/entity/jorg-drees/) | ZWF 109 (11), pp. 839–842, DOI 10.3139/104.111242 [16] |
| 2018 | Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation (New perspectives for the value stream method) | J. Drees | ZWF 113 (9), pp. 605–609, DOI 10.3139/104.111974 [17] |
| 2023 | Universelle Datenschnittstelle für digitale Wertstromdienste (Universal data interface for digital value stream services) | M. Böhm, J. Drees, B. Sai, K. Erlach, S. Stambera, T. Teriete | ZWF 118 (5), pp. 293–297, DOI 10.1515/zwf-2023-1062 [18] |
| 2023 | Daten für Wertstromanalysen automatisch erfassen (Collecting data for value stream analyses automatically) | J. Drees, S. Stambera, M. Böhm | IT&Production, 12 gennaio 2023 [21] |

Ulteriori articoli indipendenti su ZWF che estendono il metodo includono Lugert/Winkler (2017) [23], Busch/Niehues/Maassen (2018) [25] e Urnauer (2019) [24]. In inglese, le principali linee di ricerca sono Meudt et al. in CIRP Annals (2017) [13] e Bega et al. in Production Engineering (2023) [26].

## 19. FAQ: Domande frequenti sulla mappatura del flusso del valore

### Che cos'è la mappatura del flusso del valore in parole semplici?
Una mappa del flusso del valore è una mappa su una pagina del flusso produttivo. Semplici simboli indicano quali processi attraversa un prodotto, dove si ferma il materiale, quanto tempo richiedono queste operazioni e quali informazioni controllano i processi. Mostra quanto poco del lead time generi effettivamente valore.

### Quali sono le fasi della mappatura del flusso del valore?
Definire obiettivo e perimetro, definire la famiglia di prodotti, rilevare la domanda del cliente e il takt time, percorrere il processo a ritroso partendo dalla spedizione, compilare i riquadri dei dati, contare le scorte, aggiungere fornitori e trasporti, disegnare il flusso informativo, disegnare la linea temporale e calcolare le metriche, quindi individuare gli sprechi e validare la mappa. Seguono la mappa dello stato futuro e il piano di implementazione. La sezione 5 descrive ciascuna fase.

### Qual è la differenza tra mappa dello stato attuale e mappa dello stato futuro?
La mappa dello stato attuale registra come oggi fluiscono materiali e informazioni, con dati misurati. La mappa dello stato futuro progetta come dovrebbero fluire, seguendo linee guida quali produrre al takt time, flusso continuo dove possibile, supermercati dove il flusso non è possibile e un processo pacemaker [11]. Insieme formano il metodo del flusso del valore, seguito da un piano di implementazione.

### Qual è la differenza tra mappatura del flusso del valore e mappatura dei processi?
Una mappa di processo mostra le fasi di una singola procedura, spesso all'interno di un solo reparto. Una mappa del flusso del valore copre una famiglia di prodotti dall'inizio alla fine e aggiunge ciò che alla mappa di processo manca: le scorte tra una fase e l'altra, il flusso informativo che controlla la produzione e una linea temporale con lead time e tempo di lavorazione.

### Qual è la differenza tra mappatura del flusso del valore e gestione del flusso del valore?
La mappatura del flusso del valore è un progetto: un team registra lo stato attuale e progetta uno stato futuro. La gestione del flusso del valore è la guida continua del flusso da parte di un value stream manager responsabile, con una mappa aggiornata regolarmente, metriche e revisioni. La norma ISO 22468:2020 descrive questo ciclo di analisi, progettazione, pianificazione, valutazione e adeguamento [40].

### Quali simboli si usano nella mappatura del flusso del valore?
I più importanti sono il riquadro di processo, il riquadro dati, il triangolo di scorta, la freccia push, il supermercato, la corsia FIFO, il camion, i simboli kanban, le frecce informative manuali ed elettroniche, la heijunka box, lo scoppio kaizen e la linea temporale. La tabella completa è nella sezione 4.

### Quali metriche vanno riportate sulla mappa del flusso del valore?
Per processo: tempo ciclo, tempo di cambio, disponibilità (uptime), dimensione del lotto e personale. Per punto di scorta: quantità e giorni di scorta. Per l'intero flusso: takt time, lead time, tempo di lavorazione e flow ratio. Le formule sono nella sezione 6.

### Come si calcola l'efficienza del ciclo di processo (flow ratio)?
Si divide il tempo di lavorazione (più i tempi di processo, come la polimerizzazione) per il lead time e si moltiplica per 100%. Esprimere entrambi nella stessa unità e sulla stessa base (giorni lavorativi o giorni di calendario). Nell'esempio della sezione 7: 413 s ÷ 1.080.000 s = 0,038%.

### Perché si mappa partendo dal cliente e procedendo a ritroso?
Perché è il cliente a fissare il ritmo. Se si parte dalla spedizione e si risale verso monte, si registrano per primi i processi che dovrebbero controllare il flusso, e tutti gli altri vengono valutati rispetto alla domanda del cliente [1][27].

### Quanto tempo richiede la mappatura del flusso del valore?
Per un flusso di valore gestibile in un solo stabilimento, da uno a due giorni per lo stato attuale e un altro workshop per lo stato futuro sono tempi realistici [unverified: stima non supportata da una fonte specifica]. ASQ descrive un evento kaizen di tre giorni per l'avvio [46]. Lo sforzo reale è l'implementazione, che richiede mesi.

### La mappatura del flusso del valore è Lean o Six Sigma?
È uno strumento Lean del Toyota Production System, e ASQ lo classifica nell'ambito Lean [46]. La Wikipedia in inglese lo definisce "un metodo riconosciuto utilizzato come parte delle metodologie Lean Six Sigma" [49]. Per funzionare non richiede le statistiche del Six Sigma.

### Quali sono gli svantaggi della mappatura del flusso del valore?
È un'istantanea basata su medie, rappresenta male la varietà e la variabilità dei prodotti, richiede raccolta manuale dei dati e non permette di testare lo stato futuro [22][23]. La simulazione dinamica e la raccolta automatica dei dati colmano in parte queste lacune.

### Che cos'è la mappatura dinamica del flusso del valore?
È la mappatura del flusso del valore che tiene conto del comportamento nel tempo. I processi ricevono distribuzioni invece di medie, la domanda segue serie temporali e una simulazione mostra come si evolvono scorte e lead time nel tempo [16].

### Esiste uno standard per la mappatura del flusso del valore?
Sì. La norma ISO 22468:2020 "Value stream management (VSM)" copre l'analisi, la progettazione, la pianificazione e la valutazione e l'adeguamento dei flussi del valore [40]. ISO ne ha confermato la validità anche nel 2025. In Germania è rilevante anche la linea guida VDI 2870 sui sistemi di produzione olistici [7].

### Esiste un software gratuito per la mappatura del flusso del valore?
Molti strumenti generici per la creazione di diagrammi offrono livelli gratuiti con i simboli VSM, e i modelli su foglio di calcolo sono diffusi. Di solito non calcolano automaticamente le metriche. Il software VSM specializzato è generalmente a pagamento, spesso con una prova gratuita. Per la prima mappa, carta e matita restano la scelta gratuita migliore.

### Un MES può sostituire la mappatura del flusso del valore?
No. Un MES fornisce dati preziosi, come tempi ciclo, fermi macchina e scorte, che possono alimentare una mappa digitale del flusso del valore [20]. Progettare il flusso, cioè decidere di supermercati, corsie FIFO e pacemaker, resta compito del metodo del flusso del valore e delle persone che lo applicano.

## 20. Conclusione

Dal 1998, anno di pubblicazione di "Learning to See", la mappatura del flusso del valore è lo strumento standard per rendere visibile il flusso in produzione [1]. Il suo valore non sta nella mappa in sé, ma in ciò che la mappa innesca: una comprensione condivisa dell'intero flusso, un dato onesto sul rapporto di flusso e uno stato futuro progettato secondo linee guida chiare [3][11].

Tre punti da portare a casa. Primo, calcolare con cura. Il takt time, il tempo ciclo effettivo, i giorni di scorta ricavati dalla Legge di Little e un rapporto di flusso su una base temporale fissa trasformano un disegno in una base affidabile per le decisioni. Secondo, non fermarsi allo stato attuale. La progettazione dello stato futuro, un piano di implementazione e un responsabile del flusso del valore con responsabilità precise determinano se qualcosa cambia davvero. Terzo, usare le estensioni dove il metodo classico raggiunge i propri limiti. La simulazione dinamica, la raccolta automatica dei dati e la visione della logistica delle informazioni del Value Stream 4.0 preparano il metodo a un'elevata varietà di prodotti e a stabilimenti digitali [13][16][18], purché il flusso sia prima stabile [14].

Iniziate con carta, matita e una sola famiglia di prodotti. Passate al digitale quando volete aggiornare la mappa regolarmente.

## Ulteriori letture su m365.fm

**Post del blog**
- [Che cos'è la Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/)
- [Value Stream Manager: ruolo e responsabilità](https://www.m365.fm/community/u/mirko-p/blog/value-stream-manager-role-responsibilities/)
- [Software di Value Stream Management nella produzione](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)
- [Simboli e icone della mappatura del flusso del valore spiegati](https://www.m365.fm/community/u/mirko-p/blog/value-stream-mapping-symbols-icons/)

**Episodio del podcast**
- [Mappatura del flusso del valore con un modello dati in tempo reale](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Glossario**
[Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Otto sprechi](https://www.m365.fm/entity/eight-wastes/) · [Spaghetti Diagram](https://www.m365.fm/entity/spaghetti-diagram/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Cycle Time](https://www.m365.fm/entity/cycle-time/) · [Takt Time](https://www.m365.fm/entity/takt-time/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Pull System](https://www.m365.fm/entity/pull-system/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Lean Management](https://www.m365.fm/entity/lean-management/) · [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) · [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/)

**Aziende e persone**
[iFAKT GmbH](https://www.m365.fm/entity/ifakt/) · [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) · [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Guide correlate**
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

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** è il conduttore di m365.fm e lavora presso [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) a Stoccarda, in Germania. Su m365.fm scrive di lean management, mappatura del flusso del valore e digitalizzazione della produzione con Microsoft 365 e Azure. Il suo interesse è capire come strumenti Lean consolidati come la mappatura del flusso del valore possano lavorare insieme a dati in tempo reale, simulazione e moderne piattaforme dati senza perdere il proprio nucleo metodologico.

**Nota: l'autore lavora presso iFAKT GmbH.** Gli articoli di ricerca di iFAKT citati possono essere verificati tramite DOI su ZWF.

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
