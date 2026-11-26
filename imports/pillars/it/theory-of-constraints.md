# SEO metadata

| Field | Value |
|---|---|
| Meta title | Teoria dei vincoli nella produzione: 5 passi, colli di bottiglia |
| Meta description | Teoria dei vincoli nella produzione: cinque passi di focalizzazione, analisi dei colli di bottiglia, drum-buffer-rope con numeri, contabilità del throughput. |
| Slug | `theory-of-constraints` |

# Teoria dei vincoli: i cinque passi di focalizzazione, i colli di bottiglia e il Drum-Buffer-Rope

> **Risposta breve:** La teoria dei vincoli (Theory of Constraints, TOC) è un approccio gestionale sviluppato da Eliyahu M. Goldratt e presentato nel romanzo aziendale *The Goal* del 1984. Sostiene che l'output di qualsiasi sistema è limitato da pochissimi vincoli, spesso un unico collo di bottiglia, quindi lo sforzo di miglioramento va concentrato prima lì. La TOC lo traduce in pratica con cinque passi di focalizzazione (identificare, sfruttare, subordinare, elevare, prevenire l'inerzia), il metodo di schedulazione drum-buffer-rope e la contabilità per throughput [1][4][6].

> **Punti chiave**
> - *The Goal* di Eliyahu M. Goldratt e Jeff Cox è stato pubblicato per la prima volta nel 1984 da North River Press; entro il 2011 ne erano state vendute più di 5 milioni di copie in 35 lingue [1][2].
> - I cinque passi di focalizzazione sono: identificare il vincolo, sfruttarlo, subordinare tutto il resto ad esso, elevarlo e impedire che l'inerzia diventi il vincolo [4].
> - Un'ora persa al vincolo è un'ora persa per l'intero stabilimento. Un'ora risparmiata in un punto che non è il vincolo non cambia nulla, a meno che non alleggerisca il vincolo.
> - Drum-buffer-rope (DBR) pianifica il vincolo (drum), lo protegge con un buffer temporale (buffer) e rilascia materiale solo al ritmo che il vincolo è in grado di assorbire (rope) [6][8].
> - La contabilità per throughput valuta le decisioni in base al throughput (ricavi meno costo variabile reale), all'inventario/investimento e alle spese operative, e classifica i prodotti in base al throughput per minuto di vincolo, il che può invertire la classifica fornita dalla contabilità dei costi standard [6][19][20].
> - L'individuazione del collo di bottiglia dovrebbe basarsi sui dati: una verifica del carico di capacità, l'osservazione delle code e, dove esistono dati sullo stato delle macchine, il metodo del periodo attivo, che evidenzia anche i colli di bottiglia mobili [13][14][15].
> - Una revisione del 2003 di più di 80 applicazioni della TOC pubblicate ha riscontrato ampi guadagni operativi e finanziari e nessun insuccesso segnalato, il che dice anche qualcosa su quali casi vengono pubblicati [10].
> - TOC, lean e Six Sigma funzionano meglio insieme: la TOC indica dove concentrarsi, il lean elimina gli sprechi e crea il flusso, il Six Sigma riduce la variabilità nel punto che conta.

## Indice

1. [Che cos'è la teoria dei vincoli? Definizione e idea centrale](#che-cosè-la-teoria-dei-vincoli-definizione-e-idea-centrale)
2. [Storia: Eliyahu Goldratt, OPT e The Goal](#storia-eliyahu-goldratt-opt-e-the-goal)
3. [Vincolo vs. collo di bottiglia: tipi di vincoli](#vincolo-vs-collo-di-bottiglia-tipi-di-vincoli)
4. [I cinque passi di focalizzazione](#i-cinque-passi-di-focalizzazione)
5. [Esempio di teoria dei vincoli: i cinque passi di focalizzazione in uno stabilimento di collettori](#esempio-della-teoria-dei-vincoli-i-cinque-passi-di-focalizzazione-in-uno-stabilimento-di-blocchi-collettori)
6. [Analisi del collo di bottiglia: come individuare il collo di bottiglia (sei metodi)](#analisi-dei-colli-di-bottiglia-come-identificare-il-collo-di-bottiglia-sei-metodi)
7. [Schedulazione drum-buffer-rope con numeri](#scheduling-a-tamburo-buffer-fune-con-i-numeri)
8. [Drum-buffer-rope semplificato (S-DBR) per la produzione su ordinazione](#drum-buffer-rope-semplificato-s-dbr-per-la-produzione-su-commessa)
9. [Gestione dei buffer: il ciclo di feedback](#gestione-del-buffer-il-ciclo-di-feedback)
10. [La fisica di fabbrica alla base della TOC: legge di Little e variabilità](#fisica-di-fabbrica-alla-base-del-toc-legge-di-little-e-variabilità)
11. [Contabilità per throughput vs. contabilità dei costi](#contabilità-del-throughput-vs-contabilità-dei-costi)
12. [I processi di pensiero](#i-processi-di-pensiero)
13. [TOC vs. lean vs. Six Sigma](#toc-vs-lean-vs-six-sigma)
14. [Oltre lo stabilimento: critical chain e reintegro](#oltre-lo-stabilimento-catena-critica-e-reintegro)
15. [Modelli per il lavoro con la TOC](#modelli-per-il-lavoro-sulla-toc)
16. [Tabella di marcia per l'implementazione: i primi sei mesi](#roadmap-di-implementazione-i-primi-sei-mesi)
17. [KPI della TOC: come misurare i progressi](#toc-kpi-come-misurare-i-progressi)
18. [Errori comuni](#errori-comuni)
19. [Critiche e limiti della teoria dei vincoli](#critiche-e-limiti-della-teoria-dei-vincoli)
20. [Persone e sicurezza al vincolo](#persone-e-sicurezza-al-vincolo)
21. [La TOC nello stabilimento digitale: dati, simulazione e APS](#toc-nellimpianto-digitale-dati-simulazione-e-aps)
22. [Glossario](#glossario)
23. [FAQ: domande sulla teoria dei vincoli](#faq-domande-sulla-teoria-dei-vincoli)
24. [Conclusioni e primi passi](#conclusione-e-primi-passi)

**Quale sezione corrisponde al tuo ruolo?**

| Sei... | Inizia con |
|---|---|
| Direttore di stabilimento o direttore delle operazioni | Sezioni 4, 5, 16 e 18 |
| Pianificatore o schedulatore della produzione | Sezioni da 6 a 10 |
| Controller di stabilimento o CFO | Sezioni 11 e 17 |
| Responsabile CI, Lean o Six Sigma | Sezioni 12, 13 e 15 |
| Studente o chi si avvicina per la prima volta alla TOC | Sezioni da 1 a 5, poi il glossario |

## Che cos'è la teoria dei vincoli? Definizione e idea centrale

La teoria dei vincoli è un modo di gestire un'organizzazione come una catena di fasi dipendenti tra loro. Il punto di partenza è semplice: ogni sistema che ha un obiettivo ha almeno un fattore che limita quanto di quell'obiettivo può raggiungere. Il TOC Institute usa l'analogia della catena: una catena è forte quanto il suo anello più debole, e rafforzare un altro anello non la rende più resistente [4]. I successivi libri di Goldratt e la comunità TOC hanno esteso l'idea dal reparto produttivo alla distribuzione, ai progetti, alla finanza e alla strategia [6].

In uno stabilimento manifatturiero, l'obiettivo è di solito espresso come guadagnare denaro oggi e in futuro. Il fattore limitante può essere una macchina, una competenza, un fornitore, una politica o il mercato stesso. La TOC lo chiama vincolo. L'affermazione centrale è che la maggior parte dei sistemi ha, in ogni momento, uno solo o pochissimi vincoli. Il TOC Institute afferma che la maggior parte dei sistemi ha una risorsa con vincolo di capacità e raramente più di due o tre [4].

### L'idea centrale in un paragrafo

Se la produzione di uno stabilimento è limitata da una sola risorsa, allora la produzione dello stabilimento equivale a quella della risorsa. Ogni minuto che quella risorsa perde è un minuto di produzione che lo stabilimento perde per sempre. Ogni minuto risparmiato altrove è, nel migliore dei casi, capacità in eccesso e, nel peggiore, crea scorte che attendono davanti al vincolo. Per questo la TOC sostiene che le efficienze locali nei non vincoli non si sommano in una prestazione complessiva dello stabilimento. Cercare di ottimizzare separatamente ogni fase è uno sforzo sprecato; la TOC migliora l'intero sistema attraverso il suo vincolo.

### Teoria dei vincoli nel manifatturiero: perché conta nella pratica

Tre situazioni quotidiane di stabilimento mostrano l'idea:

| Situazione | Reazione tipica senza TOC | Reazione con la TOC |
|---|---|---|
| Gli ordini sono in ritardo, il WIP è ovunque | accelerare, aggiungere straordinari ovunque, avviare gli ordini prima | individuare l'unica risorsa che limita la produzione e rilasciare il lavoro al suo ritmo |
| Una macchina non vincolo è inattiva | trovarle lavoro per mantenere alta l'"efficienza" | lasciarla in attesa; il tempo di inattività in un non vincolo è normale ed economico |
| Viene proposta una nuova macchina | approvarla perché il reparto è occupato | chiedersi se aumenta la capacità nel vincolo e cosa comporta per il throughput |

### Benefici della teoria dei vincoli

I benefici più spesso riportati sono tempi di attraversamento più brevi, migliori prestazioni sulle date di consegna, scorte inferiori e throughput più elevato. Una revisione delle applicazioni pubblicate di Mabin e Balderstone, riassunta da Panizzolo, ha riportato miglioramenti medi del 70 percento nel tempo ordine-consegna, del 65 percento nel tempo ciclo di produzione, del 49 percento nelle scorte, del 63 percento nel throughput o nei ricavi e del 44 percento nelle prestazioni sulle date di consegna [11]. Panizzolo attribuisce questi valori medi alla revisione di Mabin e Balderstone in forma di libro, *The World of the Theory of Constraints* (2000); l'articolo su rivista del 2003 degli stessi autori analizza lo stesso insieme di oltre 80 casi [10][11]. Considerate quelle cifre come il limite superiore di ciò che è possibile: provengono da storie di successo pubblicate, e la revisione originale non ha trovato alcuna segnalazione di insuccesso [10]. La sezione 19 spiega che cosa ciò comporta.

Al di là dei numeri, la TOC offre a uno stabilimento una risposta condivisa alla domanda "da dove dobbiamo cominciare?". Spesso è questo il cambiamento più importante: meno progetti di miglioramento dei processi, concentrati dove cambiano davvero il risultato.

## Storia: Eliyahu Goldratt, OPT e The Goal

Eliyahu M. Goldratt è nato il 31 marzo 1947 ed è morto l'11 giugno 2011 nella sua casa in Israele. Ha conseguito una laurea triennale (BSc) presso la Tel Aviv University e una laurea magistrale (MSc) e un dottorato (PhD) presso la Bar-Ilan University [2][3]. Prima che la TOC avesse questo nome, ha lavorato con Creative Output, un'azienda che vendeva la Optimized Production Technology (OPT), un software per la schedulazione della produzione [3].

| Anno | Traguardo | Fonte |
|---|---|---|
| prima del 1984 | Software di schedulazione OPT venduto da Creative Output, radice tecnica del drum-buffer-rope (anno esatto di lancio [unverified: fonte non indicata]) | [3] |
| 1984 | *The Goal: Excellence in Manufacturing* di Goldratt e Jeff Cox, North River Press, 262 pagine | [1] |
| circa 1985 | Fondazione dell'Avraham Y. Goldratt Institute dopo che Goldratt ha lasciato Creative Output | [3] |
| 1986 | *The Race* (con Robert E. Fox) descrive in dettaglio il drum-buffer-rope; prima edizione riveduta di *The Goal* | [3][7][8] |
| 1990 e 1991 | *The Haystack Syndrome*: throughput, inventario e spese operative come misure decisionali | [3][20] |
| 1992 | seconda edizione riveduta di *The Goal* | [3][7] |
| 1994 | *It's Not Luck*: processi di pensiero per marketing e strategia | [3][12] |
| 1997 | *Critical Chain*: TOC applicata alla gestione dei progetti | [3] |
| 2000 | *Necessary But Not Sufficient*: TOC e software enterprise | [3] |
| 2004 | terza edizione riveduta di *The Goal* | [7] |
| 2009 | *Isn't It Obvious?* (vendita al dettaglio e distribuzione) | [3] |
| 2010 | *Theory of Constraints Handbook* (a cura di Cox e Schleier), il riferimento standard su DBR, S-DBR e gestione dei buffer | [9] |
| 2011 | Goldratt muore; *The Goal* inserito dalla rivista Time tra i 25 libri di management più influenti (lista Time come citata da Wikipedia) | [2][7] |
| 2014 | quarta edizione riveduta (per il 30° anniversario) di *The Goal* (elenco delle edizioni da un riquadro informativo senza citazione) | [7] |

### The Goal: un romanzo come libro di testo

*The Goal* racconta la storia di Alex Rogo, un direttore di stabilimento il cui impianto ha tre mesi di tempo per invertire la rotta. Il suo ex professore di fisica, Jonah, lo guida con domande piuttosto che con risposte [7]. La scena più citata è un'escursione con gli scout: la squadra può muoversi solo alla velocità del ragazzo più lento, Herbie, e gli spazi nella fila crescono man mano che i camminatori più veloci impongono il ritmo. La soluzione di Rogo è mettere Herbie in testa, alleggerire il suo zaino e legare il gruppo insieme. È un riassunto dei cinque passi di focalizzazione e del drum-buffer-rope in un solo pomeriggio: individuare Herbie, sfruttarlo (zaino più leggero), subordinare la squadra al suo passo e mantenere corta la fila.

Il formato romanzesco ha reso le idee accessibili a capireparto e operatori, non solo agli ingegneri. Nel 2011 la North River Press ha riferito che il libro aveva venduto più di 5 milioni di copie in 35 lingue [2].

### Da OPT a una filosofia di management

La TOC è cresciuta per fasi. La prima è stata la schedulazione (OPT, poi DBR). La seconda è stata la misurazione (throughput accounting). La terza è stata un metodo generale di problem solving (i processi di pensiero). La quarta ha applicato la logica ai progetti (critical chain) e alla distribuzione (reintegro) [6][12]. Oggi la Theory of Constraints International Certification Organization (TOCICO), un'organizzazione no-profit statunitense 501(c)(3), certifica i professionisti su tre livelli: esami di base, esami per practitioner e una valutazione per implementatori [5].

## Vincolo vs. collo di bottiglia: tipi di vincoli

I termini "vincolo" e "collo di bottiglia" sono spesso usati come sinonimi. Non sono proprio la stessa cosa.

- Un **collo di bottiglia** è una risorsa la cui capacità è inferiore alla domanda che grava su di essa. È un termine di capacità.
- Un **vincolo** è tutto ciò che limita le prestazioni del sistema rispetto al suo obiettivo. Può essere un collo di bottiglia, ma può anche essere il mercato, un materiale, una politica o un modo di pensare.
- Una **risorsa a capacità vincolata (CCR)** è una risorsa che, in media, non è un collo di bottiglia, ma lo diventa se non viene gestita con attenzione, ad esempio a causa dei picchi nel mix di prodotti.

Ogni collo di bottiglia limita il throughput solo se si trova sul percorso degli ordini che contano. Un impianto può avere una macchina "collo di bottiglia" sovraccaricata di lavoro a bassa priorità, mentre il vero vincolo è il mercato. La TOC chiede quindi per prima cosa: che cosa limita l'obiettivo?

### Tipi di vincoli

| Tipo | Esempio | Come lo si riconosce | Prima mossa tipica |
|---|---|---|---|
| Fisico: attrezzature | un centro di lavoro a 5 assi, un forno di trattamento termico, una linea di verniciatura | coda permanente davanti, risorse inattive a valle | sfruttare: nessun minuto perso |
| Fisico: persone e competenze | solo due saldatori certificati per turno | il lavoro attende persone specifiche | formazione incrociata, pianificazione in funzione delle competenze |
| Materiale | una fusione con un lead time di 16 settimane | l'assemblaggio attende un componente | scorta di riapprovvigionamento, secondo fornitore |
| Mercato | domanda inferiore alla capacità dell'impianto | capacità in eccesso ovunque, vendite sotto il piano | il vincolo è esterno; migliorare l'offerta e il lead time |
| Politica | "eseguire solo lotti completi", "mantenere ogni macchina sopra l'85% di efficienza" | regole che impongono comportamenti sbagliati | processi di pensiero, cambiare la regola |
| Paradigma | "le scorte sono un asset", "un impianto occupato è un buon impianto" | resistenza a lasciare inattivi i non vincoli | formazione, giochi di simulazione |

In pratica, i vincoli di politica meritano un'attenzione particolare: un vincolo fisico è spesso trattenuto da una regola (lotti minimi, regole di rilascio, obiettivi di utilizzo) piuttosto che dalla sua reale capacità. L'esempio svolto nella Sezione 5 mostra due di queste regole.

### Colli di bottiglia statici, dinamici e mobili

Un collo di bottiglia **statico** resta sulla stessa risorsa per mesi. Un collo di bottiglia **dinamico** o **mobile** si sposta tra le risorse con il mix di prodotti, i guasti o il personale. La differenza è importante per la scelta del metodo: un collo di bottiglia statico può essere gestito con una configurazione DBR fissa, mentre un collo di bottiglia mobile richiede dati e spesso un APS per calcolare il carico per risorsa sul portafoglio ordini corrente [13][14]. La Sezione 6 mostra come distinguerli.

### VATI: il tipo di impianto determina il vincolo

La TOC classifica gli impianti in base alla forma del flusso di materiale, nota come analisi VATI [6][9]:

| Tipo | Forma del flusso | Esempio | Problema tipico |
|---|---|---|---|
| V | poche materie prime si dividono in molti prodotti | acciaio, carta, chimica, estrusione | errata allocazione: materiale impegnato troppo presto sul prodotto sbagliato |
| A | molti componenti convergono in pochi prodotti | aerospaziale, costruzione di macchine | i componenti arrivano non sincronizzati, l'assemblaggio attende l'ultimo pezzo |
| T | pochi componenti, assemblati tardi in molte varianti | elettronica, elettrodomestici | componenti sottratti tra varianti, mancata corrispondenza dei prodotti finiti |
| I | linea diritta | semplici linee di lavorazione | comportamento classico del collo di bottiglia |

La maggior parte degli impianti reali sono combinazioni. Il tipo di impianto indica dove devono trovarsi i buffer: prima dell'assemblaggio in un impianto A, prima della divergenza in un impianto V.

## I cinque passi di focalizzazione

I cinque passi di focalizzazione sono la procedura centrale della TOC. Il TOC Institute li formula così: identificare il vincolo del sistema, sfruttare il vincolo, subordinare tutto il resto al vincolo, elevare il vincolo e impedire che l'inerzia diventi il vincolo [4]. Goldratt chiamava il ciclo processo di miglioramento continuo (POOGI), che è anche il sottotitolo delle edizioni successive di *The Goal* [6]. Poiché il passo 5 riconduce al passo 1, i cinque passi formano un ciclo di miglioramento continuo: una volta superato un vincolo del sistema, un nuovo vincolo compare altrove e il lavoro ricomincia.

Prima del passo 1 servono due risposte: qual è l'obiettivo del sistema e come misuriamo i progressi verso di esso? In un'azienda la TOC usa come misure il throughput, le scorte (o l'investimento) e le spese operative (Sezione 11).

| Passo | Domanda | Cosa significa in stabilimento | Cosa non significa |
|---|---|---|---|
| 1. Identificare | Cosa limita il throughput in questo momento? | individuare la risorsa, il materiale, il mercato o la regola che fissa il ritmo | scegliere la macchina con più guasti o il costo più alto |
| 2. Sfruttare | Come ottenere il massimo da ciò che abbiamo? | nessun minuto perso, nessun lavoro difettoso, il mix di prodotti giusto | acquistare capacità |
| 3. Subordinare | Come tutto il resto sostiene il passo 2? | rilasci, dimensioni dei lotti, manutenzione, qualità e personale seguono il vincolo | tenere occupata ogni risorsa |
| 4. Elevare | Se non basta ancora, come aggiungere capacità? | straordinari, esternalizzazione, una seconda macchina, un nuovo fornitore | il primo riflesso |
| 5. Impedire l'inerzia | Il vincolo si è spostato? Le vecchie regole sono diventate il vincolo? | tornare al passo 1, rivedere le regole fatte per il vecchio vincolo | dichiarare la vittoria |

### Passo 1: identificare il vincolo

Il vincolo è la risorsa la cui capacità è più bassa rispetto alla domanda che le viene posta. In pratica, si parte da un calcolo del carico (domanda per tempo di processo rispetto al tempo disponibile), poi si verifica in reparto: dove si accumula il lavoro in coda, dove le persone aspettano una risorsa, di quale risorsa chiedono sempre i capiturno? Il TOC Institute aggiunge che un vincolo identificato in modo errato è facile da correggere senza danni duraturi, e questa è una buona ragione per non attendere dati perfetti [4]. La Sezione 6 descrive sei metodi di rilevamento.

### Passo 2: sfruttare il vincolo

Sfruttare significa rendere il vincolo il più produttivo possibile senza spendere somme significative. Il TOC Institute afferma che un vincolo viene spesso utilizzato meno del 50 percento del tempo su base 24/7 e che i primi tre passi rivelano di norma almeno il 30 percento di capacità nascosta entro pochi mesi; entrambe sono affermazioni senza un insieme di dati pubblicato, quindi vanno verificate nel proprio stabilimento [4]. Misure tipiche di sfruttamento:

- coprire pause, cambi turno e riunioni in modo che il vincolo continui a funzionare;
- spostare la preparazione dei cambi fuori dal tempo di marcia del vincolo (setup esterno, vedere la guida [SMED e riduzione dei cambi](https://www.m365.fm/en/learn/smed-changeover-reduction/));
- ispezionare prima del vincolo, in modo che non lavori mai un pezzo già scarto (in ambienti AS9100 o IATF 16949, spostare un punto di ispezione richiede l'aggiornamento del piano di controllo e del PFMEA);
- controllare la qualità subito dopo il vincolo, perché un pezzo scartato più avanti costa tempo del vincolo;
- mantenere un buffer di lavoro davanti al vincolo, in modo che non rimanga mai senza materiale;
- dargli la priorità per manutenzione, programmazione, attrezzaggi e movimentazione dei materiali;
- scegliere il mix di prodotti in base al throughput per minuto di vincolo (Sezione 11);
- trasferire ad altre risorse il lavoro che possono svolgere, anche con minore efficienza.

### Passo 3: subordinare tutto il resto

La subordinazione è il passo più difficile perché va contro le metriche di efficienza locale. I non vincoli devono avere capacità in eccesso e usarla per proteggere il vincolo, non per costruire scorte. Esempi:

- **Rilascio:** il materiale entra nello stabilimento al ritmo del vincolo (la corda nel DBR).
- **Dimensioni dei lotti:** i non vincoli possono lavorare con lotti piccoli e più cambi perché hanno capacità in eccesso; il vincolo può aver bisogno di lotti più grandi per risparmiare tempo di setup.
- **Manutenzione:** un guasto al vincolo riceve il prossimo tecnico disponibile; la manutenzione preventiva sul vincolo viene programmata in fermate pianificate.
- **Qualità:** l'approvazione del primo pezzo al vincolo ha la priorità sugli altri controlli del primo pezzo.
- **Misurazione:** smettere di premiare i reparti non vincolo per il grado di utilizzo o per le "ore guadagnate."

L'istituto TOC osserva che vincoli che cambiano spesso di frequente interrompono politiche, procedure e persone [4]. La subordinazione dovrebbe quindi includere la protezione della posizione del vincolo, ad esempio mantenendo le altre risorse ben al di sopra della capacità del vincolo.

### Passo 4: Elevare il vincolo

Solo dopo aver eseguito i passi 2 e 3 si dovrebbe investire in capacità. Le opzioni di elevazione includono lo straordinario o un turno aggiuntivo solo sul vincolo, l'esternalizzazione di parte del suo lavoro, l'aggiunta di personale, l'acquisto di attrezzature o la riprogettazione del prodotto per richiedere meno tempo sul vincolo. Molti stabilimenti saltano direttamente a questo passo e acquistano una macchina mentre il vincolo esistente perde ancora un quarto del suo tempo per pause, attrezzaggi e mancanza di materiale.

### Passo 5: Impedire che l'inerzia diventi il vincolo

Quando sfruttamento ed elevazione funzionano, il vincolo spesso si sposta e ne compare uno nuovo: su un'altra macchina, presso un fornitore o nel mercato. Regole valide per il vecchio vincolo ora causano danni. Esempi tipici di inerzia: la dimensione del lotto elevata del vecchio collo di bottiglia resta nel ciclo di lavorazione, una regola di rilascio legata al vecchio tamburo resta nell'ERP, oppure il team commerciale continua a razionare gli ordini sebbene lo stabilimento disponga ora di capacità in eccesso. Tornare al passo 1 e rivedere le regole.

## Esempio della teoria dei vincoli: i cinque passi di focalizzazione in uno stabilimento di blocchi collettori

L'esempio seguente è costruito per questa guida. I numeri sono plausibili per una piccola officina meccanica statunitense, ma non sono dati reali di un'azienda specifica.

### Lo stabilimento

Uno stabilimento di 60 persone nel Midwest produce blocchi collettori idraulici in due famiglie di prodotti:

- **Prodotto A** (collettore standard): prezzo 900 $, materia prima e componenti acquistati 400 $.
- **Prodotto B** (collettore su misura): prezzo 1.200 $, materia prima e componenti acquistati 450 $.

Lo stabilimento lavora su due turni da 8 ore, cinque giorni a settimana: 80 ore, ovvero 4.800 minuti di tempo disponibile per risorsa a settimana. La domanda settimanale è di 100 unità di A e 60 unità di B. Le spese operative (tutta la manodopera, gli stipendi, l'affitto, l'energia, l'ammortamento; tutto tranne il materiale realmente variabile) ammontano a 62.000 $ a settimana.

### Passo 1: Individuare il vincolo con una tabella di carico

Tempi di lavorazione in minuti per unità, dai cicli di lavorazione e verificati con misurazioni in reparto:

| Risorsa | A (min/unità) | B (min/unità) | Carico A (100 unità) | Carico B (60 unità) | Carico totale (min) | Carico rispetto a 4.800 min |
|---|---|---|---|---|---|---|
| Sega | 8 | 10 | 800 | 600 | 1.400 | 29% |
| Cella CNC a 5 assi | 25 | 40 | 2.500 | 2.400 | 4.900 | **102%** |
| Sbavatura e lavaggio | 12 | 12 | 1.200 | 720 | 1.920 | 40% |
| Assemblaggio | 15 | 20 | 1.500 | 1.200 | 2.700 | 56% |
| Prova a pressione | 10 | 15 | 1.000 | 900 | 1.900 | 40% |

**Calcolo per la cella CNC:** 100 × 25 + 60 × 40 = 2.500 + 2.400 = 4.900 minuti contro 4.800 disponibili, un carico di 4.900 ÷ 4.800 = 102 percento. Anche sulla carta, la cella CNC non può soddisfare la domanda.

La tabella di carico utilizza solo il tempo teorico. Il quadro reale è peggiore. Uno studio dei tempi di due settimane sulla cella CNC (registro dei turni e dati di stato delle macchine) ha mostrato dove sono finiti i 4.800 minuti:

| Utilizzo del tempo CNC a settimana | Minuti | Quota |
|---|---|---|
| Lavorazione produttiva di pezzi buoni | 3.600 | 75,0% |
| Pause e passaggio di consegne tra turni non coperti (2 turni × 30 min × 5 giorni) | 300 | 6,3% |
| Attrezzaggi (15 a settimana × 30 min) | 450 | 9,4% |
| Fermo per mancanza: in attesa di materiale, programmi o attrezzature | 250 | 5,2% |
| Fermo macchina non pianificato | 100 | 2,1% |
| Pezzi lavorati poi scartati alla prova a pressione | 100 | 2,1% |
| **Totale** | **4.800** | **100%** |

Quindi la capacità effettiva del vincolo è di 3.600 minuti a settimana, contro una domanda di 4.900. Lo stabilimento può soddisfare circa il 73 percento della domanda (3.600 ÷ 4.900).

Il riscontro in reparto ha confermato i numeri: in media 2,5 giorni di lavoro attendevano davanti alla cella CNC, mentre assemblaggio e prova a pressione aspettavano regolarmente dei pezzi. I capireparto indicavano l'assemblaggio come collo di bottiglia perché era "sempre in ritardo", ma l'assemblaggio era in ritardo perché era privo di materiale a causa della cella CNC.

### Passo 2a: Sfruttare attraverso il mix di prodotti

Con 3.600 minuti effettivi, lo stabilimento non può produrre tutto. Quali prodotti dovrebbe realizzare per primi? Qui la contabilità per flusso di cassa (throughput accounting) e la contabilità dei costi standard danno risposte diverse (la Sezione 11 spiega in dettaglio la logica).

| | Prodotto A | Prodotto B |
|---|---|---|
| Prezzo | $900 | $1.200 |
| Costo variabile reale (materiale) | $400 | $450 |
| Throughput per unità (T) | $500 | $750 |
| Minuti CNC per unità | 25 | 40 |
| **Throughput per minuto CNC** | **$20,00** | **$18,75** |
| Margine di costo standard per unità (vedi Sezione 11) | $161,20 | $280,52 |

Il prodotto B sembra migliore per unità, con entrambi i metodi. Ma per minuto di vincolo, il prodotto A genera più guadagno.

- **Mix 1, B per primo (quello suggerito dal report dei costi):** 60 unità di B usano 2.400 minuti; i restanti 1.200 minuti producono 48 unità di A. Throughput = 60 × $750 + 48 × $500 = $45.000 + $24.000 = **$69.000**. Profitto netto = $69.000 − $62.000 = **$7.000 a settimana**.
- **Mix 2, A per primo (throughput per minuto di vincolo):** 100 unità di A usano 2.500 minuti; i restanti 1.100 minuti producono 27 unità di B (27 × 40 = 1.080 minuti). Throughput = 100 × $500 + 27 × $750 = $50.000 + $20.250 = **$70.250**. Profitto netto = $70.250 − $62.000 = **$8.250 a settimana**.

Il mix basato sul vincolo genera $1.250 in più a settimana, circa $65.000 all'anno su 52 settimane, senza alcun investimento. Cambia inoltre il confronto con le vendite: i clienti di B richiedono tempi di consegna più lunghi nelle offerte oppure un prezzo che rifletta l'uso del vincolo da parte di B.

### Passo 2b: Sfruttare il vincolo eliminando le perdite di tempo

Il team ha quindi attaccato le perdite emerse dallo studio dei tempi:

| Misura | Costo | Minuti recuperati a settimana |
|---|---|---|
| Pause sfalsate; un operatore di sostituzione formato mantiene in funzione la cella | $1.500 a settimana (quota di un operatore di sostituzione) | 300 |
| Preparazione esterna del cambio: utensili, attrezzature e programmi preparati prima che la macchina si fermi; cambio da 30 a 18 min | circa $6.000 una tantum per un preset utensili e carrelli | 180 (15 × 12 min) |
| Materiali e programmi preparati un turno prima (un polmone temporale, vedi Sezione 7) | nessuno | 200 |
| Dimensioni critiche dei fori controllate subito dopo la lavorazione invece che al collaudo a pressione | calibri, circa $2.500 una tantum | 70 |
| Manutenzione preventiva spostata nella finestra pianificata del fine settimana | nessuno | 50 |
| **Totale** | | **800** |

La capacità effettiva sale da 3.600 a 4.400 minuti a settimana, un aumento del 22 percento (800 ÷ 3.600). Con il Mix 2, lo stabilimento produce ora 100 unità di A (2.500 min) e 47 unità di B (47 × 40 = 1.880 min, totale 4.380 min).

Throughput = 100 × $500 + 47 × $750 = $50.000 + $35.250 = **$85.250 a settimana**. Le spese operative aumentano per l'operatore di sostituzione: $62.000 + $1.500 = $63.500. Profitto netto = $85.250 − $63.500 = **$21.750 a settimana**, rispetto a $8.250. La spesa una tantum di circa $8.500 viene recuperata in meno di una settimana.

È il tipico schema della TOC: poiché le spese operative sono in gran parte fisse nel breve periodo, ogni minuto aggiuntivo del vincolo confluisce quasi interamente nel profitto.

### Passo 3: Subordinare il resto dello stabilimento

Per mantenere gli 800 minuti, il resto dello stabilimento doveva cambiare:

- La sega ha smesso di tagliare "per stare occupata". Ora taglia solo ciò che serve al programma CNC, rilasciato un turno prima (la fune).
- La cella CNC segue una sequenza settimanale fissa che raggruppa i prodotti per famiglia di attrezzature; la sega e la sbavatura seguono quella sequenza.
- La manutenzione risponde prima alle chiamate della CNC; l'obiettivo di risposta è di 10 minuti.
- Il laboratorio qualità esegue i controlli sul primo pezzo della CNC prima di qualsiasi altra richiesta.
- I capireparto di sega e sbavatura non sono più misurati sull'utilizzo. La loro misura è "la CNC non aspetta mai noi".

L'utilizzo della sega scende da circa il 45 percento (accumulava scorte) al 29 percento. È l'effetto voluto. In termini di TOC, il tempo di inattività della sega è il prezzo di un vincolo protetto.

### Passo 4: Elevare il vincolo

Dopo lo sfruttamento, restano insoddisfatte 13 unità di B a settimana (60 − 47). Tre opzioni di elevazione:

| Opzione | Minuti aggiuntivi del vincolo | Throughput aggiuntivo a settimana | Spese operative aggiuntive a settimana | Effetto netto a settimana | Commento |
|---|---|---|---|---|---|
| Turno del sabato solo nella cella CNC (8 h, con personale su adesione volontaria o secondo le regole di straordinario del contratto di lavoro) | 480 | 12 B × $750 = $9.000 | $1.200 di maggiorazione per straordinario e supporto | **+$7.800** | rapida, reversibile |
| Esternalizzare la sgrossatura di B presso un'officina esterna, $180 per unità | 13 B non richiedono i 40 min completi | 13 × ($750 − $180) = $7.410 | coordinamento, circa $300 | **+$7.110** | T per unità scende a $570 perché il costo dell'officina esterna è realmente variabile |
| Acquistare una seconda macchina a 5 assi, $650.000 | 4.800 | 13 B × $750 = $9.750 (la domanda limita il guadagno) | $4.000 (operatore, ammortamento, manutenzione) | **+$5.750** | payback circa $650.000 ÷ $5.750 = 113 settimane, salvo crescita della domanda |

Il turno del sabato vince. La seconda macchina ha senso solo se le vendite riescono a riempirla, perché una volta installata il vincolo si sposta sul mercato. La verifica finanziaria è semplice: l'opzione aumenta T meno OE, e di quanto rispetto all'investimento? La sezione 11 mostra le formule.

### Passo 5: prevenire l'inerzia

Con il turno del sabato, la cella CNC dispone di 4.880 minuti effettivi, sufficienti per l'intera domanda di 4.900 meno qualche minuto, e ora il limite è la domanda. Nuovo quadro del carico:

| Risorsa | Carico alla piena domanda | Carico rispetto al disponibile |
|---|---|---|
| Cella CNC (con sabato) | 4.900 | circa 100% del tempo effettivo |
| Assemblaggio | 2.700 | 56% |
| Prova di pressione | 1.900 | 40% |

Il vincolo sta per spostarsi sul mercato. Durante la revisione sono emerse due trappole di inerzia:

1. L'ERP conservava ancora il lotto minimo di 40 pezzi per B, fissato anni fa per risparmiare setup sulla CNC. Con cambi formato più rapidi, questo bloccava tempi di consegna brevi. Il lotto è stato ridotto a 10.
2. Le vendite continuavano a proporre sei settimane per B "perché lo stabilimento è sempre saturo". Il lead time offerto è stato ridotto a tre settimane, cosa che in un trimestre ha fatto acquisire due nuovi clienti di B.

Torniamo al passo 1: se i nuovi clienti di B spingono la domanda verso l'alto, la cella CNC torna a essere il vincolo e l'opzione della seconda macchina richiede un nuovo calcolo. Questo ciclo è il processo di miglioramento continuo.

### Cosa insegna l'esempio

| Lezione | Evidenza nell'esempio |
|---|---|
| Il collo di bottiglia visibile potrebbe non essere il vincolo | i capisquadra davano la colpa all'assemblaggio, che era affamato di lavoro |
| Lo sfruttamento batte l'investimento | 800 minuti per 8.500 $ una tantum più 1.500 $ a settimana, contro 650.000 $ |
| La contabilità dei costi può classificare male i prodotti | B sembrava migliore per unità, A genera più guadagno per minuto di vincolo |
| Le risorse non vincolanti devono avere tempi morti | la sega è passata dal 45% al 29% di utilizzo |
| Le vecchie regole sopravvivono ai vecchi vincoli | il lotto di 40 e le sei settimane di preventivo |

## Analisi dei colli di bottiglia: come identificare il collo di bottiglia (sei metodi)

L'analisi dei colli di bottiglia consiste nel trovare la risorsa che limita il throughput, misurare quanto output essa costa e verificare se il vincolo si sposta. È il passo 1 dei cinque passi di focalizzazione e va ripetuta ogni volta che cambiano il mix di prodotti, la domanda o il piano di produzione.

Il collo di bottiglia non è sempre la macchina più costosa, quella che si guasta più spesso o il reparto con il caposquadra più rumoroso. Usate più di un metodo e verificate che i risultati coincidano.

### Metodo 1: calcolo del carico di capacità

Per ogni risorsa, confrontate il tempo richiesto dalla domanda con il tempo disponibile.

**Formula:** Carico (%) = Σ (domanda per prodotto × tempo di lavorazione per unità, inclusi i setup) ÷ tempo disponibile × 100

La risorsa con il carico più alto è il candidato collo di bottiglia. La sezione 5 mostra il calcolo; la cella CNC era al 102 percento sui tempi teorici. Due affinamenti rendono il metodo affidabile:

1. **Usate il tempo effettivo, non quello nominale.** Dividete il carico teorico per la quota di tempo in cui la risorsa produce effettivamente pezzi buoni (disponibilità × qualità, oppure una quota produttiva misurata). Una risorsa con carico dell'85 percento sulla carta e quota produttiva del 75 percento è in realtà al 113 percento (85 ÷ 0,75).
2. **Usate il mix di prodotti reale del periodo che pianificate.** Una risorsa può essere il collo di bottiglia in una settimana con prevalenza di B e non in una settimana con prevalenza di A.

Punti di forza: richiede solo cicli di lavorazione, domanda e calendario. Punti deboli: i cicli di lavorazione sono spesso errati, e il metodo ignora la variabilità e lo spostamento dei colli di bottiglia.

### Metodo 2: osservazione di code e WIP

Il lavoro si accumula davanti a un collo di bottiglia, mentre le risorse a valle attendono. Contate il lavoro in attesa davanti a ciascuna risorsa (in ore di lavoro, non in pezzi) nello stesso momento per diversi giorni. Una risorsa con una coda grande e persistente e con risorse a valle affamate è il probabile collo di bottiglia. Attenzione: una coda può anche formarsi davanti a una risorsa alimentata da lotti grandi o che segue una politica di produzione anticipata.

### Metodo 3: il giro del collo di bottiglia

Christoph Roser raccomanda il giro del collo di bottiglia come metodo sul campo quando mancano i dati sullo stato delle macchine [15]. Percorrete la linea più volte per turno e annotate per ciascun processo se sta lavorando, se è affamato (in attesa di input) o se è bloccato (non può passare il lavoro a valle). Un processo che lavora per la maggior parte del tempo, con processi bloccati a monte e processi affamati a valle, è il collo di bottiglia. Ripetete l'osservazione nei giorni per verificare se il collo di bottiglia si sposta.

| Passaggio alle | Sega | Cella CNC | Sbavatura | Montaggio | Collaudo |
|---|---|---|---|---|---|
| 07:30 | bloccata | in lavorazione | a secco | a secco | in lavorazione |
| 09:00 | in lavorazione | in lavorazione | in lavorazione | a secco | a secco |
| 10:30 | bloccata | in lavorazione | a secco | in lavorazione | a secco |
| 13:00 | bloccata | fermo (utensile) | a secco | a secco | a secco |
| Andamento | spesso bloccata | sempre in lavorazione | spesso a secco | spesso a secco | spesso a secco |

### Metodo 4: Utilizzo (percentuale di tempo attivo)

I dati macchina provenienti da un MES, da una piattaforma IIoT o dal controllo macchina mostrano la quota di tempo in cui ciascuna risorsa è attiva. La risorsa con la quota più alta di tempo attivo è il candidato collo di bottiglia. Roser, Nakano e Tanaka chiamano questo approccio metodo del carico di lavoro e lo usano come confronto nel loro articolo del 2001 [13]. È facile da automatizzare, ma non tiene conto dell'ordine in cui le risorse si interrompono a vicenda: due risorse al 85 percento appaiono uguali anche se una di esse ferma l'altra.

### Metodo 5: Il metodo del periodo attivo

Il metodo del periodo attivo è stato pubblicato da Roser, Nakano e Tanaka alla Winter Simulation Conference del 2001 ed esteso ai colli di bottiglia mobili nel 2002 [13][14]. Richiede un registro degli stati con marcatura temporale per ciascuna risorsa.

- **Stati attivi** sono gli stati in cui la risorsa può far attendere gli altri: la lavorazione, ma anche il cambio formato, il guasto, la riparazione e la manutenzione [14][15].
- **Stati inattivi** sono gli stati in cui la risorsa attende gli altri: a secco (in attesa di materiale o di trasporto) e bloccata [14][15].
- Un **periodo attivo** è una sequenza ininterrotta di stati attivi [13].
- In ogni istante, **la risorsa con il periodo attivo ininterrotto più lungo è il collo di bottiglia momentaneo** [14].
- Quando il periodo attivo del collo di bottiglia corrente si sovrappone a quello del collo di bottiglia precedente o successivo, il collo di bottiglia è **mobile** tra le due risorse; al di fuori delle sovrapposizioni, la risorsa è il collo di bottiglia **unico** [14].

**Esempio svolto (due ore di un registro di turno illustrativo):**

| Risorsa | Periodi attivi | Periodi inattivi |
|---|---|---|
| Sega | 08:00–08:20, 08:35–08:55, 09:10–09:30, 09:45–10:00 | bloccata tra un periodo e l'altro |
| Cella CNC | 08:00–09:05 (65 min), 09:15–10:00 (45 min) | 09:05–09:15 a secco |
| Montaggio | 08:00–08:10, 08:30–09:10 (40 min), 09:40–10:00 | a secco 08:10–08:30 e 09:10–09:40 |

Passo dopo passo:

1. 08:00–09:05: il periodo attivo di 65 minuti della cella CNC è il periodo in corso più lungo, quindi la cella CNC è il collo di bottiglia momentaneo.
2. 09:05–09:10: la cella CNC è a secco. Il periodo attivo più lungo in questo momento è quello del montaggio (08:30–09:10). Il montaggio è il collo di bottiglia.
3. 09:10–09:15: solo la sega è attiva (09:10–09:30). La sega è il collo di bottiglia.
4. 09:15–10:00: il secondo periodo della cella CNC (45 minuti) è il più lungo. La cella CNC è il collo di bottiglia.
5. Sovrapposizioni: il periodo CNC 08:00–09:05 si sovrappone al periodo del montaggio 08:30–09:10 per 35 minuti (08:30–09:05), quindi lì il collo di bottiglia passa tra CNC e montaggio. Il periodo della sega 09:10–09:30 si sovrappone al periodo CNC 09:15–10:00 per 15 minuti, un passaggio tra sega e CNC.

| Risorsa | Collo di bottiglia unico | Collo di bottiglia mobile | Somma | Quota di 120 min (unico / somma) |
|---|---|---|---|---|
| Cella CNC | 08:00–08:30 e 09:30–10:00 = 60 min | 35 + 15 = 50 min | 110 min | 50% / 92% |
| Montaggio | 09:05–09:10 = 5 min | 35 min | 40 min | 4% / 33% |
| Sega | 09:10–09:15 = 5 min | 15 min | 20 min | 4% / 17% |

Roser interpreta la quota unica come limite inferiore e la somma come limite superiore dell'effetto di un miglioramento: se la cella CNC è il collo di bottiglia unico per il 50 percento del tempo e unico o mobile per il 92 percento, un guadagno di un minuto sulla cella CNC dovrebbe migliorare la produzione del sistema di circa 0,5–0,9 minuti [15]. Due ore di dati bastano solo a mostrare il meccanismo; un'analisi reale utilizza settimane di registri.

Confrontato con il Metodo 4: la cella CNC è stata attiva 110 minuti su 120 (92 percento), la sega 80 (67 percento) e il montaggio 70 (58 percento). L'utilizzo indica qui la stessa risorsa, ma classificherebbe la sega davanti al montaggio, sebbene il montaggio faccia parte più spesso di un collo di bottiglia mobile.

**Da dove provengono i dati:** stati macchina del MES, gateway IIoT che leggono il controllore o il registro eventi di una simulazione a eventi discreti. Roser osserva che il metodo è più semplice con la simulazione o con sistemi altamente automatizzati e raccomanda la passeggiata del collo di bottiglia dove tali dati mancano [15]. La guida [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) spiega come gli stabilimenti raccolgono gli stati delle apparecchiature.

### Metodo 6: Simulazione e test di sensitività

Un modello di simulazione a eventi discreti della linea permette di verificare direttamente la domanda: se ogni risorsa, a turno, ottiene il 10 percento di capacità in più, quale modifica aumenta la produzione? La risorsa il cui miglioramento fa crescere di più la produzione è il vincolo per quel mix. La simulazione mostra anche i colli di bottiglia mobili in presenza di variabilità, che le tabelle di carico statiche non rilevano. La guida sulla [simulazione manifatturiera](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) illustra come costruire un modello di questo tipo.

### Cause comuni dei colli di bottiglia

Un'analisi dei colli di bottiglia dovrebbe concludersi con una causa, non solo con una localizzazione. Le cause più frequenti in uno stabilimento:

- capacità inferiore alla domanda per il mix di prodotti attuale (un vero vincolo di capacità)
- fermi non pianificati e riparazioni lente sulla risorsa critica
- cambi di produzione lunghi combinati con regole di lotto ampie
- competenze o personale mancanti: solo poche persone sanno far funzionare o attrezzare la risorsa
- perdite di qualità: scarti e rilavorazioni che consumano due volte il tempo del vincolo
- carenza di alimentazione: materiale, utensili, programmi o lavoro a monte che arrivano in ritardo
- politiche, come obiettivi di utilizzo che tengono occupate le non-vincolo mentre il lavoro si accumula nel posto sbagliato

La causa determina l'intervento. le prime cinque richiedono prima lo sfruttamento (Sezione 4, fase 2) e l'elevazione solo se non basta; la carenza di alimentazione richiede la subordinazione (fase 3); le politiche richiedono una modifica delle regole, spesso con i processi di pensiero (Sezione 12).

### Quale metodo e quando

| Metodo | Dati necessari | Individua i colli di bottiglia mobili | Impegno | Uso migliore |
|---|---|---|---|---|
| Carico di capacità | cicli di lavorazione, domanda, calendario | no | basso | prima verifica, pianificazione, preventivi |
| Osservazione delle code | conteggi in produzione | in parte | basso | conferma |
| Giro del collo di bottiglia | rilievi ripetuti | in parte | da basso a medio | stabilimenti senza dati dalle macchine |
| Utilizzo | stati delle macchine | no | basso una volta avviato il flusso dei dati | dashboard |
| Periodo attivo | stati con marcatura temporale | sì | medio | linee automatizzate, dati MES, simulazione |
| Simulazione | modello più dati | sì | da medio ad alto | mix elevato, decisioni di investimento |

### Sei domande che smascherano un falso collo di bottiglia

1. La risorsa funziona davvero per tutto il tempo disponibile, o spesso è in carenza di alimentazione?
2. La coda davanti a essa è permanente o è solo un lotto in arrivo?
3. Le risorse a valle attendono lei, o qualcos'altro?
4. Se domani ottenesse il 10 percento di capacità in più, le spedizioni aumenterebbero?
5. Il presunto "collo di bottiglia" è occupato con lavoro che in questo momento non serve?
6. Il vero limite è una regola, come le dimensioni minime dei lotti o uno schema di turni fisso?

## Scheduling a tamburo-buffer-fune con i numeri

Il tamburo-buffer-fune (DBR, Drum-Buffer-Rope) è il metodo TOC per la schedulazione e il controllo della produzione. Goldratt e Robert E. Fox lo hanno descritto in *The Race* (1986), basandosi sulla metafora della squadra di scout di *The Goal* [3][8]. Il *Theory of Constraints Handbook* descrive la forma attuale, inclusa la gestione dei buffer e la classificazione dei flussi VATI [9].

- **Tamburo:** la schedulazione del vincolo. È l'unica schedulazione dettagliata dello stabilimento che deve essere mantenuta.
- **Buffer:** buffer temporali che proteggono la produttività dello stabilimento dalla variabilità. Il DBR tradizionale utilizza buffer sul vincolo, nei punti di assemblaggio dove le parti del vincolo si incontrano con quelle dei non vincoli, e in spedizione [6].
- **Fune:** il meccanismo di rilascio. Il materiale entra nello stabilimento un buffer temporale prima di essere necessario sul vincolo; rilasciarlo prima fa solo aumentare il WIP [6].

I buffer nel DBR si misurano in **tempo**, non in pezzi [6]. Un buffer sul vincolo di 16 ore significa che il materiale viene rilasciato 16 ore lavorative prima del suo inizio programmato sul vincolo.

### Passo 1: costruire la schedulazione del tamburo

Tornando allo stabilimento dei collettori, la cella CNC è il tamburo. La sua schedulazione per mercoledì (turno 1: 06:00–14:00, turno 2: 14:00–22:00), con i cambi formato di 18 minuti della Sezione 5:

| Ordine | Prodotto e quantità | Attrezzaggio + lavorazione (min) | Inizio CNC | Fine CNC |
|---|---|---|---|---|
| 1041 | A × 10 | 18 + 250 = 268 | Mer 06:00 | Mer 10:28 |
| 1042 | B × 5 | 18 + 200 = 218 | Mer 10:28 | Mer 14:06 |
| 1043 | A × 10 | 268 | Mer 14:06 | Mer 18:34 |
| 1044 | B × 4 | 18 + 160 = 178 | Mer 18:34 | Mer 21:32 |

La sequenza segue la decisione sul mix produttivo della Sezione 5 e la domanda settimanale, con lotti abbastanza piccoli da mantenere brevi i lead time. I 28 minuti rimasti a fine turno sono dedicati a un controllo programmato degli utensili.

### Passo 2: impostare i buffer

- **Buffer sul vincolo:** 16 ore lavorative (due turni). La sega e la movimentazione dei materiali richiedono meno di un'ora di tempo di contatto per ordine; il resto protegge da problemi alla sega, mancanza di materiale e programmi.
- **Buffer di spedizione:** 16 ore lavorative dopo la cella CNC. Sbavatura, assemblaggio e collaudo richiedono circa un'ora di tempo di contatto per ordine.
- **Area fisica del buffer:** un'area di pavimento delimitata davanti alla cella CNC, dimensionata per circa un giorno di lavoro, con corsie FIFO per famiglia di attrezzature. Se l'area si riempie, il rilascio è in anticipo rispetto alla fune; se è vuota, la cella CNC è a rischio.

Quanto deve essere grande un buffer all'inizio? Gray, Felan, Umble e Umble osservano che esistono regole empiriche, ma che, secondo la loro esperienza, le dimensioni dei buffer vengono di solito fissate per ottenere un sistema stabile e poi regolate [24]; la gestione dei buffer (Sezione 9) provvede alla regolazione. Un valore iniziale spesso citato nella pratica TOC è circa la metà del lead time attuale per quel segmento [unverified: valore riportato nella pratica TOC senza una fonte specifica]. Nell'esempio, il lavoro prima attendeva 2,5 giorni davanti alla cella CNC; il team è partito con un giorno e ha previsto di regolarlo.

### Passo 3: tendere la fune

Tempo di rilascio = inizio programmato sul vincolo − buffer sul vincolo.

| Ordine | Inizio CNC | Buffer sul vincolo | Rilascio alla sega | Data di spedizione (fine CNC + buffer di spedizione) |
|---|---|---|---|---|
| 1041 | Mer 06:00 | 16 h | Mar 06:00 | Gio 10:28 |
| 1042 | Mer 10:28 | 16 h | Mar 10:28 | Gio 14:06 |
| 1043 | Mer 14:06 | 16 h | Mar 14:06 | Gio 18:34 |
| 1044 | Mer 18:34 | 16 h | Mar 18:34 | Gio 21:32 |

Nessun materiale viene rilasciato prima del suo tempo di rilascio, anche se la sega è inattiva. È ciò che mantiene basso il WIP e il lead time.

### Passo 4: far funzionare lo stabilimento secondo lo stato dei buffer

I non vincoli non ricevono una schedulazione dettagliata. Lavorano in ordine di stato del buffer (Sezione 9): prima gli ordini con il buffer più consumato. La cella CNC segue la propria sequenza.

### DBR vs. spinta MRP: cosa cambia

| Argomento | Spinta MRP | DBR |
|---|---|---|
| Rilascio | lead time pianificati per ogni operazione, spesso gonfiati | schedulazione del vincolo meno il buffer |
| Schedulazioni dettagliate | per ogni centro di lavoro | solo per il vincolo |
| WIP | cresce quando i lead time sono gonfiati | limitato dalla fune |
| Priorità in reparto | liste urgenti, sollecitazioni | colori dello stato dei buffer |
| Risposta alla variabilità | più lead time, più WIP | buffer in pochi punti, dimensionati e regolati |

La guida [production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) spiega come il DBR si inserisce nella schedulazione a capacità finita e quando un APS apporta valore.

### DBR negli impianti di assemblaggio (tipo A)

In un impianto di tipo A, le parti del vincolo incontrano le parti non vincolate in fase di assemblaggio. Il DBR tradizionale aggiunge un **buffer di assemblaggio**: le parti non vincolate vengono rilasciate in modo da attendere all'assemblaggio prima dell'arrivo della parte vincolata, così che l'output del vincolo non debba mai aspettare una staffa mancante [6][9]. Nel settore aerospaziale e nella costruzione di macchine, dove i gruppi richiedono centinaia di componenti, è spesso qui che il DBR ripaga di più; la guida [pianificazione della produzione aerospaziale](https://www.m365.fm/en/learn/aerospace-production-planning/) tratta questo ambiente.

## Drum-buffer-rope semplificato (S-DBR) per la produzione su commessa

Il drum-buffer-rope semplificato (S-DBR) è stato sviluppato per gli impianti a produzione su commessa, dove di solito il vincolo è il mercato e non una risorsa interna, oppure dove il vincolo interno non è caricato in modo severo. Utilizza un solo buffer, il **buffer di spedizione**, e sostituisce il programma dettagliato del tamburo con un controllo del **carico pianificato** sulla risorsa vincolante di capacità (CCR) [6][9].

### Come funziona l'S-DBR

1. **Buffer di spedizione:** ogni ordine viene rilasciato un tempo di buffer fisso prima della sua data di consegna.
2. **Carico pianificato:** l'impianto tiene un totale progressivo del lavoro già impegnato sulla CCR, espresso in giorni.
3. **Quotazione della data di consegna:** a un nuovo ordine viene assegnata una data di consegna non anteriore alla data in cui la CCR può lavorarlo, più una parte del buffer di spedizione per il lavoro successivo alla CCR. Una convenzione comune è la data del carico pianificato più metà del buffer di spedizione [unverified: convenzione comune, non verificata su fonti specifiche].
4. **La gestione del buffer** stabilisce le priorità in officina in base alla quota di buffer di spedizione consumata.

### Esempio svolto: quotazione di una data di consegna con S-DBR

Si supponga che l'impianto di collettori sia diventato a produzione su commessa e che il mercato sia il vincolo nella maggior parte delle settimane. La cella CNC è trattata come CCR con 4.400 minuti effettivi a settimana, ovvero 880 minuti per giorno lavorativo.

- Ordini già impegnati sulla cella CNC: 3.520 minuti. Carico pianificato = 3.520 ÷ 880 = **4,0 giorni lavorativi**.
- Buffer di spedizione: **6 giorni lavorativi** (il lead time totale attuale è di 12 giorni; il team parte dalla metà).
- Nuovo ordine: 10 unità di B, 40 minuti ciascuna = 400 minuti = 0,45 giorni sulla cella CNC.

Data di consegna sicura = oggi + carico pianificato + tempo CNC del nuovo ordine + metà del buffer di spedizione = 0 + 4,0 + 0,45 + 3,0 = **7,45, quindi 8 giorni lavorativi**. Data di rilascio = data di consegna − buffer di spedizione = giorno 8 − 6 = **giorno 2**.

Se le vendite vogliono promettere 5 giorni, il controllo mostra che l'ordine salterebbe la coda sulla cella CNC e farebbe ritardare altri ordini. Questa discussione avviene all'inserimento dell'ordine, non in officina due settimane dopo.

### DBR o S-DBR?

| Criterio | DBR tradizionale | S-DBR |
|---|---|---|
| Vincolo | interno e molto carico | mercato, oppure interno ma moderatamente carico |
| Buffer | vincolo, assemblaggio, spedizione | solo spedizione |
| Programma del vincolo | sequenza dettagliata | controllo del carico pianificato |
| Impegno | maggiore | minore |
| Adattamento tipico | collo di bottiglia stabile, impianti di tipo A o I | job shop a produzione su commessa, alta varietà |

## Gestione del buffer: il ciclo di feedback

La gestione del buffer è il ciclo di controllo e di miglioramento di DBR e S-DBR [9]. Per ogni ordine aperto, lo stabilimento monitora quanta parte del proprio buffer è stata consumata e la colora di conseguenza. Il riepilogo di Wikipedia sulla TOC descrive la codifica rosso, giallo e verde in base alla penetrazione nel buffer [6].

**Formula (per un ordine non ancora arrivato al punto protetto):**
Penetrazione nel buffer (%) = (1 − tempo residuo fino all'arrivo programmato al punto protetto ÷ dimensione del buffer) × 100

| Zona | Penetrazione nel buffer | Significato | Risposta |
|---|---|---|---|
| Verde | da 0 a 33% | in linea | nessuna |
| Giallo | da 33 a 67% | situazione critica | verificare dove si trova l'ordine, preparare un'azione |
| Rosso | da 67 a 100% | il punto protetto potrebbe dover attendere | accelerare: portare l'ordine in testa, eliminare la causa |
| Nero (alcuni stabilimenti) | oltre 100% | già in ritardo | escalation, informare il cliente se si tratta di un buffer di spedizione |

La suddivisione in terzi è una convenzione, non una legge naturale.

### Esempio svolto: stato del buffer mercoledì alle 06:00

Buffer del vincolo: 16 ore lavorative. All'inizio del turno, nessuno dei quattro ordini ha ancora raggiunto la cella CNC.

| Ordine | Inizio programmato su CNC | Ore lavorative residue | Penetrazione | Zona | Azione |
|---|---|---|---|---|---|
| 1041 | Mer 06:00 | 0 | 100% | rosso/nero | la CNC attenderà; reperire subito l'ordine |
| 1042 | Mer 10:28 | 4,5 | 1 − 4,5 ÷ 16 = 72% | rosso | accelerare alla sega |
| 1043 | Mer 14:06 | 8,1 | 1 − 8,1 ÷ 16 = 49% | giallo | verificare lo stato |
| 1044 | Mer 18:34 | 12,6 | 1 − 12,6 ÷ 16 = 21% | verde | nessuna |

In una giornata regolare, gli ordini in scadenza nelle prossime ore si trovano già nel buffer davanti alla cella CNC. Se alle 06:00 l'ordine 1041 non è presente, la cella CNC sta per perdere tempo.

### Usare i dati del buffer per migliorare

Registrare la causa ogni volta che un ordine diventa rosso: materiale mancante, guasto della sega, programma non rilasciato, blocco qualità. Dopo alcune settimane, un diagramma di Pareto delle cause costituisce la lista dei miglioramenti per i non vincoli. Due regole empiriche per il dimensionamento:

- Se molti ordini sono rossi, il buffer è troppo piccolo o il processo a monte è troppo instabile. Eliminare prima le cause principali, poi valutare un buffer più grande.
- Se quasi tutti gli ordini restano verdi, il buffer è troppo grande. Ridurlo per gradi; WIP e lead time diminuiscono di conseguenza.

Per i buffer di scorta nella distribuzione, la regola di gestione dinamica del buffer riassunta su Wikipedia prevede di ridurre un buffer di un terzo se la scorta resta nel terzo superiore per un intero tempo di riapprovvigionamento, e di aumentarlo di un terzo se resta troppo a lungo nel terzo inferiore [6].

## Fisica di fabbrica alla base del TOC: Legge di Little e variabilità

Il TOC viene talvolta insegnato come una filosofia. Le sue regole di schedulazione derivano però anche dalla teoria delle code.

### Legge di Little

John D. C. Little ha dimostrato nel 1961 che, in un sistema stabile, il numero medio di elementi nel sistema è pari al tasso di arrivo moltiplicato per il tempo medio di permanenza nel sistema [16]. In termini di fabbrica (Hopp e Spearman) [17]:

**WIP = throughput × tempo di ciclo**, oppure **tempo di ciclo = WIP ÷ throughput**

**Esempio svolto (stabilimento di collettori, prima e dopo DBR):**

| | Prima (push) | Dopo (DBR) |
|---|---|---|
| WIP tra sega e spedizione | 640 unità | 90 unità |
| Throughput | 127 unità a settimana | 147 unità a settimana |
| Tempo di ciclo = WIP ÷ throughput | 640 ÷ 127 = 5,0 settimane | 90 ÷ 147 = 0,61 settimane, circa 3 giorni lavorativi |

Il WIP è diminuito perché la fune ha interrotto il rilascio anticipato; il throughput è aumentato perché il vincolo è stato sfruttato. Il lead time si è ridotto di oltre l'80 percento. La Legge di Little segnala anche il limite: se il WIP davanti al vincolo scende al punto da farlo rimanere senza materiale, anche il throughput cala. Per questo il DBR mantiene un polmone solo sul vincolo e in nessun altro punto.

### Variabilità e utilizzo

L'approssimazione di Kingman per una singola stazione mostra perché i non vincoli necessitano di capacità di riserva [17][18]:

**Tempo di attesa ≈ ((ca² + ce²) ÷ 2) × (u ÷ (1 − u)) × te**

dove ca e ce sono i coefficienti di variazione degli arrivi e dei tempi di processo, u è l'utilizzo e te il tempo medio di processo. Si tratta di un'approssimazione per una singola stazione con distribuzioni generali di arrivo e di tempo di processo (G/G/1), ed è più accurata ad alto utilizzo [17][18].

| Utilizzo u | u ÷ (1 − u) | Tempo di attesa con ca = ce = 1, te = 40 min |
|---|---|---|
| 70% | 2,3 | 93 min |
| 85% | 5,7 | 227 min |
| 95% | 19,0 | 760 min |

Passando dall'85 al 95 percento di utilizzo, il tempo di attesa più che triplica. Uno stabilimento che spinge ogni risorsa verso il 95 percento crea code lunghe ovunque. La risposta del TOC è far funzionare il vincolo a utilizzo molto elevato, protetto da un polmone deliberato, e mantenere i non vincoli ben al di sotto di tale livello.

## Contabilità del throughput vs. contabilità dei costi

La contabilità del throughput è il sistema di misura del TOC. Goldratt ha esposto le sue tre misure in *The Goal* e *The Haystack Syndrome* [20]; *Throughput Accounting* di Thomas Corbett (North River Press) è il trattato di riferimento a lunghezza di libro [21].

### Le tre misure

| Misura | Definizione (Goldratt, come riassunta da MAAW) [20] | Definizione pratica in stabilimento |
|---|---|---|
| Throughput (T) | il tasso con cui il sistema genera denaro attraverso le vendite | vendite meno i costi totalmente variabili, di solito materia prima, componenti acquistati, provvigioni e lavorazioni esterne per unità [6][22] |
| Inventario (I), in seguito spesso "investimento" | denaro che il sistema investe nell'acquisto di cose che intende vendere | materia prima, WIP e prodotti finiti valorizzati al costo dei materiali, più, nella definizione estesa, attrezzature e fabbricati [22] |
| Spese operative (OE) | tutto il denaro che il sistema spende per trasformare l'inventario in throughput | salari e stipendi (inclusa la manodopera diretta), affitti, energia, manutenzione, ammortamenti |

La manodopera diretta fa parte delle OE, non del T. Questa è la differenza chiave rispetto al costing standard: nella maggior parte degli stabilimenti, nel breve periodo il costo del lavoro non aumenta né diminuisce con ogni unità in più.

### Misure derivate

| Misura | Formula | Stabilimento di collettori dopo lo sfruttamento (settimanale) |
|---|---|---|
| Utile netto (NP) | T − OE | $85.250 − $63.500 = $21.750 |
| Ritorno sull'investimento (ROI) | (T − OE) ÷ I | con I = $1,2 milioni: $21.750 × 52 ÷ $1.200.000 = 94% annuo |
| Produttività | T ÷ OE | $85.250 ÷ $63.500 = 1,34 |
| Rotazioni dell'investimento | T ÷ I | $85.250 × 52 ÷ $1.200.000 = 3,7 all'anno |

Il riepilogo di Lean Production elenca le stesse misure derivate e la priorità decisionale del TOC: aumentare prima il throughput, poi ridurre l'investimento, infine ridurre le spese operative [22]. La cifra di investimento di $1,2 milioni è un'ipotesi dell'esempio.

### Regola decisionale: throughput per unità di vincolo

Quando esiste un vincolo, i prodotti vanno classificati in base al throughput per unità di tempo del vincolo, non per margine per unità. Nei testi di contabilità questo è il noto "contributo per unità di fattore limitante"; il team d'esame ACCA descrive la versione del throughput con il rendimento per ora di fabbrica e il rapporto di contabilità del throughput (TPAR) [19]:

- **Ritorno per ora di fabbrica** = throughput per unità ÷ ore per unità sul collo di bottiglia
- **Costo per ora di fabbrica** = costo totale di fabbrica ÷ ore totali disponibili sul collo di bottiglia
- **TPAR** = ritorno per ora di fabbrica ÷ costo per ora di fabbrica; normalmente dovrebbe essere maggiore di 1 [19].

### Esempio svolto: costing standard contro contabilità del throughput

Il costing standard nello stabilimento dei collettori alloca le spese operative ai prodotti in base ai minuti standard di manodopera. Minuti standard di budget alla domanda prevista: A 70 minuti per unità (8 + 25 + 12 + 15 + 10) × 100 unità = 7.000; B 97 minuti (10 + 40 + 12 + 20 + 15) × 60 unità = 5.820; totale 12.820 minuti. Tasso di imputazione = $62.000 ÷ 12.820 = **$4,84 per minuto standard**.

| | Prodotto A | Prodotto B |
|---|---|---|
| Prezzo | $900,00 | $1.200,00 |
| Materiale | $400,00 | $450,00 |
| Manodopera e overhead (70 × $4,84; 97 × $4,84) | $338,80 | $469,48 |
| **Margine standard per unità** | **$161,20** | **$280,52** |
| Margine standard % | 17,9% | 23,4% |
| Throughput per unità | $500 | $750 |
| Ore CNC per unità | 0,417 | 0,667 |
| **Ritorno per ora CNC** | **$1.200** | **$1.125** |

Costo per ora di fabbrica, usando le spese operative dopo lo sfruttamento: $63.500 ÷ (4.400 ÷ 60 = 73,3 ore CNC) = **$865,91**. TPAR A = 1.200 ÷ 865,91 = **1,39**; TPAR B = 1.125 ÷ 865,91 = **1,30**. Entrambi i prodotti generano profitto, ma A produce di più per ora di vincolo.

Il costing standard indica "spingere B": ha il margine più alto per unità e in percentuale. La contabilità del throughput indica "riempire prima il vincolo con A". La sezione 5 ha mostrato il risultato: $1.250 in più di utile netto a settimana con la graduatoria del throughput. Il costing standard non è sbagliato dal punto di vista aritmetico. Risponde però a una domanda diversa (il costo pieno medio di un'unità su un periodo), e quella non è la domanda che una decisione sul mix produttivo in presenza di un vincolo richiede.

### Esempio svolto: un ordine che usa solo capacità inutilizzata

Un cliente chiede 40 piastre di adattamento a settimana a $260 ciascuna. Il materiale costa $150. Le piastre richiedono la sega (15 minuti), la sbavatura (10 minuti) e l'assemblaggio (25 minuti), ma **nessun tempo CNC**. Totale: 50 minuti standard.

| | Vista del costo standard | Vista del throughput |
|---|---|---|
| Materiale | $150,00 | $150,00 |
| Manodopera e overhead (50 × $4,84) | $242,00 | non per unità: le spese operative non cambiano, le risorse hanno capacità inutilizzata |
| Margine per unità | $260 − $392 = **−$132** | T = $260 − $150 = **+$110** |
| Decisione | rifiutare | accettare |
| Effetto sull'utile netto settimanale (40 piastre) | | +$4.400, purché sega, sbavatura e assemblaggio restino sotto la loro capacità |

Verifica dei carichi: sega +600 minuti (a 2.000, 42 percento), sbavatura +400 (a 2.320, 48 percento), assemblaggio +1.000 (a 3.700, 77 percento). L'assemblaggio si avvicina a diventare un vincolo, quindi l'ordine va accettato con un limite di volume e monitorato. Con il costing standard, lo stabilimento avrebbe rifiutato $4.400 a settimana.

### Scorte e utile riportato

Con il costing a assorbimento, l'overhead viene trasferito nelle scorte. Se lo stabilimento dei collettori produce 50 unità extra di A per il magazzino, 50 × $338,80 = **$16.940** di overhead del periodo passano nello stato patrimoniale invece che nel conto economico, e l'utile riportato cresce di quell'importo. La cassa diminuisce del materiale acquistato, 50 × $400 = $20.000. Con la contabilità del throughput, l'utile netto non cambia e le scorte aumentano di $20.000. Per questo i praticanti della TOC avvertono che costruire scorte può far apparire lo stabilimento migliore sulla carta mentre peggiora in termini di cassa e tempi di consegna.

La rendicontazione finanziaria esterna negli Stati Uniti richiede che l'overhead di produzione sia incluso nel costo delle scorte (costing a assorbimento): secondo l'ASC 330, il costo delle scorte è la somma delle spese e degli oneri sostenuti direttamente o indirettamente per portare un articolo nella sua condizione e ubicazione attuali, e l'overhead fisso di produzione è allocato alle scorte in base alla capacità normale degli impianti produttivi [28][29]. Sarà il vostro responsabile contabile a stabilire come lo stabilimento applica questa regola. La contabilità del throughput è quindi uno strumento di decisione interno. La maggior parte degli stabilimenti che la utilizzano mantiene i bilanci GAAP per la rendicontazione esterna e riconcilia i due sistemi.

### Cosa deve monitorare il controller di stabilimento

| Rischio | Perché è importante | Mitigazione |
|---|---|---|
| "Veramente variabile" definito in modo troppo stretto o troppo ampio | T è sovrastimato o sottostimato | concordare un elenco scritto: materiale, componenti acquistati, lavorazioni esterne, spese di trasporto in uscita se calcolate per unità, provvigioni di vendita |
| OE trattato come fisso nel lungo periodo | grandi variazioni di volume cambiano effettivamente OE | rivedere le ipotesi su OE per decisioni che vanno oltre un trimestre |
| Ignorare la posizione del vincolo | la throughput per minuto di vincolo non ha significato se il vincolo si sposta | ricalcolare quando cambia la tabella dei carichi |
| Prezzi permanentemente sotto il costo pieno | la capacità residua scompare e OE deve crescere | limiti di volume, revisione ogni trimestre |
| Due set di numeri | confusione nelle riunioni di direzione | un unico foglio di riconciliazione; TA per le decisioni, GAAP per i bilanci |
| Manodopera che varia realmente per unità | il salario a cottimo o la manodopera interinale contabilizzati per unità sono davvero variabili | includerli nel costo veramente variabile; le retribuzioni regolari restano in OE |

La guida sui [KPI di produzione](https://www.m365.fm/en/learn/manufacturing-kpis/) tratta la rotazione delle scorte e altre misure finanziario-operative.

## I processi di pensiero

I processi di pensiero (TP) sono gli strumenti della TOC per problemi che non sono problemi di capacità: vincoli di politica, conflitti e gestione del cambiamento. Il romanzo di Goldratt *It's Not Luck* (1994) li ha portati a un pubblico ampio; Kim, Mabin e Davies hanno esaminato la letteratura di ricerca su di essi dal 1994, dopo quel libro, fino all'inizio del 2006, e hanno riscontrato che la TOC si è sviluppata soprattutto attraverso la pratica, con molti ambiti di applicazione e approcci multimetodo [12].

I TP rispondono a tre domande: cosa cambiare, in cosa cambiarlo e come provocare il cambiamento.

| Strumento | Domanda | Logica | Risultato |
|---|---|---|---|
| Albero della realtà attuale (CRT) | cosa cambiare? | causa-effetto ("se ... allora ...") da poche cause radice a molti effetti indesiderati (UDE) | il problema centrale |
| Nube che evapora (EC), diagramma di risoluzione dei conflitti | in cosa cambiare? | necessità ("per ... dobbiamo ...") | l'ipotesi che, una volta infranta, risolve il conflitto |
| Albero della realtà futura (FRT) | in cosa cambiare? | sufficienza, con iniezioni | la soluzione e i suoi effetti collaterali (rami negativi) |
| Albero dei prerequisiti (PRT) | come provocare il cambiamento? | ostacoli e obiettivi intermedi | la sequenza di tappe intermedie |
| Albero di transizione (TrT) | come provocare il cambiamento? | azione, motivo, effetto | un piano passo dopo passo |

### Esempio svolto: nube che evapora sulla dimensione del lotto

Nello stabilimento di collettori, il responsabile della CNC e il responsabile commerciale discutevano della dimensione del lotto per B.

| Casella | Contenuto |
|---|---|
| A (obiettivo comune) | gestire uno stabilimento redditizio |
| B (esigenza 1) | utilizzare bene la capacità della cella CNC |
| C (esigenza 2) | consegnare rapidamente gli ordini B |
| D (desiderio 1, serve B) | eseguire lotti B grandi (40) per risparmiare attrezzaggi |
| D' (desiderio 2, serve C) | eseguire lotti B piccoli (10) |
| Conflitto | D e D' non possono essere realizzati insieme |

L'ipotesi sul collegamento B–D: "gli attrezzaggi nella cella CNC richiedono 30 minuti, quindi ogni attrezzaggio aggiuntivo costa 30 minuti di tempo del vincolo." L'iniezione: ridurre l'attrezzaggio a 18 minuti con preparazione esterna e raggruppare le varianti B per famiglia di attrezzature, così che i lotti piccoli costino poco tempo di vincolo. La nube "evapora" perché l'ipotesi alla base del conflitto non è più vera.

### Esempio svolto: un piccolo albero della realtà attuale

Gli effetti indesiderati (UDE) elencati dal team di direzione: ordini in ritardo, WIP elevato, frequente sollecito, straordinari in assemblaggio, capi reparto che litigano sulle priorità. Leggendo l'albero dal basso:

1. Se i capi reparto sono misurati sull'utilizzo, allora rilasciano il lavoro in anticipo per tenere occupate le proprie macchine.
2. Se il lavoro viene rilasciato in anticipo, allora il WIP cresce e le code davanti alla cella CNC si allungano.
3. Se le code sono lunghe, allora la cella CNC esegue ciò che è in cima alla coda, non ciò che è in scadenza.
4. Se la cella CNC esegue gli ordini sbagliati, allora gli ordini in scadenza arrivano in ritardo, e seguono sollecito e straordinari in assemblaggio.

Problema centrale: la misura dell'utilizzo (un vincolo di politica). La soluzione non è più capacità ma una misura diversa e una regola di rilascio, cioè DBR.

### Usare bene i TP

- Mantenere gli alberi piccoli all'inizio. Da cinque a dieci UDE bastano per un'area.
- Verificare ogni freccia: la causa porta davvero all'effetto? Ci sono altre cause?
- Lavorare in un gruppo che includa gli operatori; conoscono gli effetti che i responsabili non vedono.
- La nube che evapora è lo strumento più facile da avviare e il più utile nei conflitti quotidiani.

## TOC vs. lean vs. Six Sigma

TOC, lean e Six Sigma vengono spesso presentati come concorrenti. In pratica rispondono a domande diverse.

| Argomento | Teoria dei vincoli | Lean | Six Sigma |
|---|---|---|---|
| Origine | Goldratt, anni '80, Israele e USA [1][3] | Toyota Production System, Giappone | Motorola, anni '80, USA [27] |
| Domanda centrale | dove si trova la leva? | dove si trova lo spreco? | dove si trova la variazione? |
| Focus | il vincolo e il throughput globale | flusso e valore per il cliente lungo il value stream | difetti e capacità di processo |
| Strumenti principali | cinque passi di focalizzazione, DBR, gestione dei buffer, contabilità del throughput, processi di pensiero | value stream mapping, 5S, SMED, kanban, standard work, kaizen | DMAIC, statistica, carte di controllo, disegno degli esperimenti |
| Visione della capacità | proteggere la capacità in eccesso nei non vincoli | bilanciare al takt, ridurre la sovracapacità come spreco | non centrale |
| Visione dell'inventario | buffer in pochi punti scelti, nel tempo | minimizzarli ovunque | non centrale |
| Visione finanziaria | throughput, inventario, spese operative | lead time, costo, qualità | costo della non qualità |
| Debolezza tipica | un focus ristretto può ignorare gli sprechi fuori dal vincolo | applicare gli strumenti ovunque contemporaneamente | progetti scelti senza una visione di sistema |

### Come lavorano insieme

1. **La TOC fissa il focus.** I cinque passi di focalizzazione scelgono il punto in cui il miglioramento cambia il risultato dello stabilimento.
2. **La lean sfrutta il vincolo.** SMED riduce i cambi formato sul vincolo, TPM ne aumenta la disponibilità, lo standard work e le 5S lo stabilizzano. Vedere le guide su [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/), [SMED](https://www.m365.fm/en/learn/smed-changeover-reduction/) e [TPM e OEE](https://www.m365.fm/en/learn/tpm-oee/).
3. **La Six Sigma elimina la variazione al vincolo e a monte di esso.** Lo scarto sul vincolo e l'alimentazione tardiva e instabile del suo buffer sono buoni progetti DMAIC. Vedere [Six Sigma e analisi delle cause radice](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).
4. **La TOC misura il risultato.** La contabilità del throughput mostra cosa ha prodotto ogni progetto su T, I e OE.

### Dove lean e TOC sono davvero in disaccordo

- **Bilanciamento di linea.** La lean bilancia il contenuto di lavoro al takt. La TOC mantiene deliberatamente sbilanciati i non vincoli, con capacità di riserva, per proteggere il vincolo. In una linea di montaggio cadenzata dal takt, la linea nel suo insieme agisce da vincolo; la divergenza conta di più nei job shop.
- **Buffer.** La lean considera l'inventario uno spreco e i buffer una contromisura temporanea. La TOC considera un buffer temporale dimensionato sul vincolo una protezione permanente. Entrambe riducono nettamente il WIP totale rispetto a un sistema push.
- **Meccanismi di pull.** Il kanban limita il WIP tra ciascuna coppia di processi; il DBR lo limita tra il rilascio e il vincolo, in modo simile al CONWIP, che Spearman, Woodruff e Hopp hanno proposto come alternativa pull al kanban [23]. Vedere la guida su [kanban e sistema pull](https://www.m365.fm/en/learn/kanban-pull-system/).

### OEE sul vincolo

L'OEE (disponibilità × prestazione × qualità) è più utile sul vincolo, dove ogni minuto perso costa throughput. Su un non vincolo, un OEE basso può semplicemente significare che attende, come dovrebbe. Se il vostro stabilimento riporta un unico numero OEE per tutte le macchine, separate il vincolo.

## Oltre lo stabilimento: catena critica e reintegro

### Gestione dei progetti a catena critica

In *Critical Chain* (1997), Goldratt ha applicato la TOC ai progetti [3]. In sintesi, le idee sono le seguenti:

- **La catena critica** è la catena più lunga di attività dipendenti, che tiene conto sia delle dipendenze tra attività sia di quelle tra risorse. Un percorso critico ignora i conflitti sulle risorse.
- **Stime aggressive delle attività.** Il tempo di sicurezza viene rimosso dalle singole attività.
- **Buffer aggregati.** Il margine di sicurezza rimosso viene raccolto in un **buffer di progetto** alla fine e in **buffer di alimentazione** dove le catene non critiche confluiscono nella catena critica.
- **Gestione dei buffer.** L'avanzamento viene monitorato con un grafico a febbre: buffer consumato rispetto alla catena completata.
- **Nessun multitasking dannoso.** Le risorse completano un'attività prima di iniziare la successiva.

Il confronto di PMI tra DBR e buffering della catena critica descrive la logica comune: entrambi proteggono il vincolo del sistema con buffer temporali aggregati anziché con margini di sicurezza locali in ogni fase [24]. Per i progetti di attrezzaggio, le espansioni di stabilimento e i lanci di nuovi prodotti, la catena critica è spesso la seconda applicazione della TOC dopo il DBR.

### Reintegro e distribuzione

Per gli articoli make-to-stock e i ricambi, la TOC sostituisce le previsioni presso ciascuna sede con buffer che vengono reintegrati in base al consumo effettivo. Il buffer è dimensionato sul consumo massimo atteso entro il tempo medio di reintegro, più un margine per fornitori inaffidabili; viene poi regolato di un terzo in aumento o in diminuzione a seconda di quanto tempo le scorte permangono nella zona rossa o verde [6]. La guida [gestione delle scorte di produzione](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) confronta questo approccio con le classiche formule delle scorte di sicurezza, e la guida [S&OP e MRP](https://www.m365.fm/en/learn/sop-mrp-production-planning/) mostra dove si colloca nella pianificazione.

## Modelli per il lavoro sulla TOC

Copiate queste tabelle in un foglio di calcolo o in una lavagna di reparto. Sono volutamente semplici.

### Modello 1: Foglio di identificazione del vincolo

| Risorsa | Carico guidato dalla domanda (min/settimana) | Disponibile (min/settimana) | Quota produttiva | Carico effettivo % | Coda media davanti (ore di lavoro) | Percorso del collo di bottiglia: % in lavorazione | Periodo attivo: % esclusiva / somma | Verdetto |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Modello 2: Registro delle perdite del vincolo (per turno)

| Data | Turno | Minuti pianificati | Minuti produttivi | Pausa non coperta | Cambio formato | Sottoalimentato | Bloccato | Fermo | Scarto/rilavorazione | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | |

### Modello 3: Mix di prodotti per throughput per minuto di vincolo

| Prodotto | Prezzo | Costo variabile reale | T per unità | Minuti di vincolo per unità | T per minuto di vincolo | Domanda | Posizione | Quantità pianificata |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Modello 4: Tabellone di stato dei buffer

| Ordine | Punto protetto (vincolo / assemblaggio / spedizione) | Scadenza al punto protetto | Dimensione del buffer (h) | Residuo (h) | Penetrazione % | Zona | Ubicazione attuale | Responsabile |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Modello 5: Registro delle cause degli ordini rossi

| Data | Ordine | Zona raggiunta | Categoria della causa (materiale, macchina, qualità, programma, persone, altro) | Dettaglio della causa | Minuti persi al vincolo | Contromisura | Responsabile |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Modello 6: Foglio di decisione sull'elevazione

| Opzione | Minuti extra di vincolo/settimana | Δ T per settimana | Δ OE per settimana | Δ I (una tantum) | Δ NP per settimana (ΔT − ΔOE) | Settimane di recupero (ΔI ÷ ΔNP) | Dove va il vincolo dopo? |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Modello 7: Nuvola evaporante

| A: obiettivo comune | B: esigenza 1 | C: esigenza 2 | D: azione che serve B | D': azione che serve C | Ipotesi B–D | Ipotesi C–D' | Ipotesi D rispetto a D' | Iniezione |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Modello 8: Riunione giornaliera sul vincolo (10 minuti, presso il vincolo)

| Minuto | Argomento | Input |
|---|---|---|
| 0–2 | ieri: minuti produttivi rispetto al piano, perdita principale | Modello 2 |
| 2–5 | buffer: ordini rossi e gialli, chi interviene | Modello 4 |
| 5–8 | cause dei rossi, contromisure aperte | Modello 5 |
| 8–10 | oggi: sequenza, personale, finestra di manutenzione | programma drum |

La guida [gestione del reparto produttivo](https://www.m365.fm/en/learn/shop-floor-management/) mostra come inserire una riunione del genere nelle riunioni a più livelli.

## Roadmap di implementazione: i primi sei mesi

La roadmap seguente è pensata per un singolo stabilimento o un singolo flusso di valore. Presuppone un vincolo fisico all'interno dello stabilimento; se l'analisi del mese 1 mostra che il vincolo è il mercato, passare direttamente a S-DBR e al lato commerciale.

| Fase | Settimane | Obiettivi | Attività chiave | Criteri di uscita |
|---|---|---|---|---|
| 0. Preparazione | 1–2 | comprensione condivisa | la direzione legge *The Goal* o organizza una simulazione di gioco TOC; si concordano obiettivo e misure (T, I, OE); coinvolgimento precoce di sindacato o rappresentanti dei dipendenti | sponsor nominato, team centrale costituito, misure concordate |
| 1. Identificazione | 3–6 | trovare il vincolo con i dati | tabella dei carichi (Metodo 1), conteggio delle code, sopralluoghi sul vincolo, dati delle macchine o analisi dei periodi di attività, se disponibili | vincolo confermato dai dati e dalla produzione |
| 2. Sfruttamento | 5–12 | recuperare il tempo perso sul vincolo | registro delle perdite sul vincolo, pause di copertura, attrezzaggio esterno, qualità prima e dopo il vincolo, priorità di manutenzione, mix di prodotti per T per minuto di vincolo | minuti produttivi in aumento, Pareto delle perdite in uso |
| 3. Subordinazione | 9–16 | proteggere il vincolo, ridurre il WIP | pilota DBR o S-DBR: programma a tamburo, buffer, rilascio a fune; interruzione degli obiettivi di utilizzo sui non vincoli | regola di rilascio in uso quotidiano, WIP in calo |
| 4. Gestione dei buffer | 12–20 | controllo quotidiano e apprendimento | lavagna dello stato dei buffer, registro delle cause degli ordini in rosso, riunione quotidiana di 10 minuti sul vincolo, primo adeguamento delle dimensioni dei buffer | meno ordini in rosso, cause in fase di risoluzione |
| 5. Misurare e decidere | 16–24 | finanza in consiglio | vista di contabilità a flusso (throughput accounting) per le decisioni su mix e ordini, riconciliazione con il costing standard | TA usata in almeno una decisione reale |
| 6. Elevare e rivedere | 20–26 | aggiungere capacità solo dove giustificato; verificare l'inerzia | scheda di decisione sull'elevazione (Modello 6), revisione dei percorsi, regole di lotto, regole di quotazione | posizione del vincolo ricontrollata, ciclo successivo pianificato |

### Ruoli

| Ruolo | Responsabilità |
|---|---|
| Sponsor (direttore di stabilimento) | obiettivo, misure, rimozione dei vincoli di policy come gli obiettivi di utilizzo |
| Responsabile del vincolo (capo reparto del vincolo) | minuti produttivi giornalieri, registro delle perdite, riunione sul vincolo |
| Pianificatore o schedulatore | programma a tamburo, rilascio, dimensioni dei buffer, quotazione delle date di consegna |
| Controller di stabilimento | definizioni di T, I, OE; mix di prodotti e decisioni sugli ordini; riconciliazione |
| Responsabile della manutenzione | tempo di risposta sul vincolo, finestre di manutenzione programmata |
| Responsabile qualità | ispezione prima e dopo il vincolo, cause degli ordini in rosso nella qualità |
| Operatori sul vincolo e intorno ad esso | motivi delle perdite, miglioramento degli attrezzaggi, idee; sono loro a gestire le contromisure |

### Criteri per l'area pilota

Scegliere un flusso di valore in cui (1) un vincolo sia chiaramente visibile, (2) la consegna o il lead time danneggino i clienti, (3) il capo reparto sia disponibile e (4) i dati esistano o possano essere raccolti a mano per alcune settimane. La guida [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) mostra come mappare il flusso e individuare dove si colloca il vincolo nel flusso di valore.

## TOC KPI: come misurare i progressi

| KPI | Formula | Livello | Frequenza | Commento |
|---|---|---|---|---|
| Throughput (T) | vendite − costo veramente variabile | stabilimento | settimanale, mensile | la misura principale dell'obiettivo |
| Spese operative (OE) | tutte le altre spese | stabilimento | mensile | dovrebbero crescere più lentamente di T |
| Inventario/investimento (I) | valore dei materiali di scorte e WIP (più le attività nella visione ampia) | stabilimento | mensile | la parte WIP dovrebbe calare con DBR |
| Utile netto | T − OE | stabilimento | mensile | |
| ROI | (T − OE) ÷ I | stabilimento | trimestrale | |
| Minuti produttivi del vincolo | minuti di pezzi buoni al vincolo ÷ minuti disponibili | vincolo | per turno | il battito quotidiano |
| Aderenza del vincolo al piano | ordini avviati nella finestra pianificata ÷ ordini pianificati | vincolo | giornaliero | mostra se il tamburo tiene |
| Quota di ordini rossi | ordini rossi ÷ ordini aperti | buffer | giornaliero | troppo alta: buffer troppo piccolo o processo instabile |
| Rispetto della data di consegna | ordini spediti entro o alla data promessa ÷ ordini spediti | cliente | settimanale | il risultato più visibile |
| Lead time | dal rilascio alla spedizione, mediana e 90° percentile | flusso del valore | settimanale | verificare con la legge di Little |
| WIP in giorni | WIP ÷ throughput medio giornaliero | flusso del valore | settimanale | |
| Throughput-dollar-days (TDD) | Σ (valore T dell'ordine in ritardo × giorni di ritardo) | responsabilità | settimanale | una misura TOC di "cose che avrebbero dovuto essere fatte"; origine nel lavoro di misurazione di Goldratt [unverified] |
| Inventory-dollar-days (IDD) | Σ (valore dell'inventario × giorni di giacenza) | responsabilità | settimanale | misura "cose che non avrebbero dovuto essere fatte" [unverified] |

Due regole per la bacheca dei KPI: mostrare i KPI del vincolo al vincolo, e non indicare l'utilizzo dei non vincoli come obiettivo di prestazione. La guida sui [KPI di produzione](https://www.m365.fm/en/learn/manufacturing-kpis/) definisce i KPI di produzione standard che affiancano questi.

## Errori comuni

| Errore | Perché fa danno | Meglio |
|---|---|---|
| Scegliere il vincolo a istinto | il problema più visibile è spesso un sintomo (l'assemblaggio era a corto di materiale) | tabella dei carichi più verifica in officina, dati del periodo attivo se disponibili |
| Passare subito al passo 4 | denaro speso mentre il vincolo perde ancora dal 20 al 25% del suo tempo | sfruttare e subordinare prima |
| Mantenere obiettivi di utilizzo per i non vincoli | rilasci anticipati, più WIP, il vincolo esegue il lavoro sbagliato | misurare i non vincoli su "il vincolo non aspetta mai noi" |
| Rilasciare lavoro in anticipo "per sicurezza" | WIP e lead time crescono; le priorità si perdono | rilascio rigoroso tramite la fune |
| Buffer fissati una volta e dimenticati | troppo grandi: il WIP resta alto; troppo piccoli: rossi continui | regolare sulla base dei dati degli ordini rossi |
| Nessun controllo qualità prima del vincolo | il vincolo lavora pezzi che sono già scarti | ispezione o poka-yoke prima del vincolo |
| Scarti trovati molto a valle | tempo del vincolo sprecato in silenzio | controllare le caratteristiche critiche subito dopo il vincolo |
| Ignorare il vincolo di mercato | uno stabilimento con capacità in eccesso ovunque continua a "ottimizzare" le macchine | S-DBR, offerte basate sul lead time, coinvolgimento delle vendite |
| Mix di prodotti per margine unitario | minor profitto con la stessa capacità | ordinare per T per minuto di vincolo |
| Due sistemi di priorità in competizione | liste urgenti e colori dei buffer entrano in conflitto | una sola regola: lo stato del buffer |
| Il vincolo si sposta, le regole restano | vecchie dimensioni dei lotti e vecchi preventivi bloccano il guadagno successivo | revisione del passo 5 a ogni ciclo |
| Operatori del vincolo lasciati da soli | le persone che vedono le perdite non vengono interpellate | gli operatori sono responsabili delle cause delle perdite e delle contromisure |

## Critiche e limiti della teoria dei vincoli

La TOC ha risultati solidi nella pratica e un supporto più debole nella ricerca. Una guida seria deve trattare entrambi gli aspetti.

### 1. Evidenze: casi di successo e distorsione di pubblicazione

Mabin e Balderstone hanno analizzato più di 80 applicazioni della TOC di successo pubblicate e hanno riscontrato miglioramenti operativi e finanziari significativi; nonostante ricerche approfondite, non hanno trovato resoconti di fallimenti [10]. È un avvertimento tanto quanto un'approvazione. I casi pubblicati sono scritti da consulenti, fornitori e aziende entusiaste; le implementazioni fallite raramente finiscono in stampa. Gupta e Snyder (2009) hanno sostenuto che la TOC non avesse ancora dimostrato la propria efficacia nella letteratura accademica e hanno chiesto studi che colleghino l'implementazione alle prestazioni finanziarie, come riassunto su Wikipedia [6]. L'indagine di Panizzolo su 61 stabilimenti europei ha rilevato che alcune pratiche della TOC, in particolare DBR, le non-constraint con capacità in eccesso e un master schedule basato sui vincoli, erano collegate a prestazioni migliori, ma i risultati variavano da paese a paese e si basavano sulle valutazioni autonome dei manager [11].

### 2. Ottimalità e ricerca sulla schedulazione

I ricercatori di ricerca operativa hanno criticato le euristiche della TOC come non ottimali. Trietsch ha sostenuto che DBR è inferiore ai metodi concorrenti, e Linhares (2009) ha sostenuto che la regola della TOC per il mix di prodotti (ordinare per throughput per unità di vincolo) non può garantire risultati ottimali in generale, perché il problema del mix di prodotti con più vincoli è computazionalmente difficile [6]. La lezione pratica: la regola "T per minuto di vincolo" è affidabile con un unico vincolo chiaro. Con due o più vincoli interagenti, si usino la programmazione lineare o un APS.

### 3. Originalità

I critici hanno fatto notare che molte idee della TOC esistevano già: il contributo per fattore limitante nella contabilità gestionale (Noreen, Smith e Mackey, 1995), elementi della dinamica dei sistemi e del controllo statistico di processo, PERT/CPM nella gestione dei progetti [6]. Goldratt stesso ha riconosciuto lavori precedenti, in particolare il Toyota Production System e le idee di flusso di Ford, nel suo articolo del 2009 "Standing on the Shoulders of Giants" [6]. Per un professionista l'originalità conta meno del fatto che la combinazione funzioni; per uno studente vale la pena sapere da dove provengono i singoli elementi.

### 4. Persone e politiche

Nave (2002) ha sostenuto che la TOC tende a ignorare i dipendenti e non tratta le politiche non riuscite come vincoli, come riassunto su Wikipedia [6]. Nella pratica, il rischio è che "subordinare" venga letto come "obbedire", e che gli operatori del vincolo sopportino tutta la pressione. La sezione 20 tratta questo punto.

### 5. Dove la TOC si adatta meno bene

- **Linee bilanciate e a ritmo costante** con takt e poca variabilità: la linea stessa è il vincolo, e il bilanciamento di linea lean è lo strumento migliore.
- **Colli di bottiglia molto mobili** nei job shop ad alto mix: un singolo drum è difficile da definire. S-DBR, il controllo del carico di lavoro o un APS si adattano meglio.
- **Stabilimenti in cui il mercato è il vincolo** per anni: il DBR interno aggiunge poco; la leva sta nelle vendite, nel lead time e nella progettazione delle offerte.
- **Maturità della misurazione:** la contabilità del throughput richiede un team finanziario disposto a gestire una seconda visione. Senza di essa, le decisioni ricadono sul costo standard.

### 6. Contesto commerciale

Gran parte della letteratura sulla TOC è pubblicata da North River Press e da società di consulenza fondate da Goldratt o dai suoi collaboratori. Ciò non la rende sbagliata, ma significa che molte fonti non sono indipendenti. Questa guida utilizza fonti sottoposte a revisione paritaria dove esistono e segnala come tali le affermazioni dei professionisti (come la cifra del "30 percento di capacità nascosta" del TOC Institute) [4].

## Persone e sicurezza al vincolo

La TOC può migliorare o peggiorare il lavoro delle persone che operano sul vincolo. Il metodo in sé è neutro; a fare la differenza è il modo in cui viene introdotto.

### Cosa notano per primi gli operatori

- **Maggiore attenzione:** i responsabili improvvisamente prestano attenzione a ogni minuto di funzionamento di una sola macchina. Questo può essere percepito come controllo. Spiegate il motivo e lasciate che siano gli operatori a registrare essi stessi le perdite.
- **Pause:** "coprire le pause" significa che un operatore di sostituzione fa funzionare la macchina, non che le persone saltano le pause.
- **Tempi morti altrove:** gli operatori delle postazioni non vincolo possono temere per il proprio posto di lavoro quando viene loro detto di non accumulare scorte. Chiarite che la capacità in eccesso è intenzionale e utilizzatela per la formazione, il miglioramento dei setup, le 5S, la polivalenza sul vincolo e il lavoro sulla qualità.
- **Riconoscimento:** i miglioramenti della squadra del vincolo (come il cambio da 30 a 18 minuti) devono essere visibili sulla lavagna, con i nomi se le persone sono d'accordo.

### Le regole di sicurezza non si piegano per il vincolo

La pressione a mantenere in funzione il vincolo non deve mai portare a scorciatoie sulla sicurezza. Le operazioni di assistenza e manutenzione su macchine in cui un'accensione imprevista potrebbe ferire le persone rientrano nello standard OSHA sul controllo dell'energia pericolosa (lockout/tagout, 29 CFR 1910.147) [25]. Cambi più rapidi devono essere progettati nella procedura (attacchi a sgancio rapido, utensili preimpostati, materiale predisposto in anticipo), non ottenuti saltando il lockout. Lo stesso vale per protezioni ed ergonomia: un operatore di sostituzione richiede la stessa formazione e qualifica dell'operatore titolare.

### Contesto sindacale e del lavoro

Negli stabilimenti sindacalizzati, pause sfalsate, operatori di sostituzione, turni del sabato e modifiche alle misurazioni toccano spesso il contratto collettivo di lavoro. Coinvolgete il sindacato o i rappresentanti dei lavoratori già nella fase 0 della roadmap, spiegate l'obiettivo e concordate come assegnare straordinari e ruoli di sostituzione. Un avvio della TOC che si apre con un reclamo sugli orari delle pause fa perdere mesi.

### Rispetto per le persone nei termini della TOC

La nube evaporante (Sezione 12) è uno strumento pratico di rispetto per le persone: presuppone che entrambe le parti di un conflitto abbiano un'esigenza legittima e cerca l'ipotesi errata che sta alla base del conflitto. Usata in un team che include gli operatori, trasforma "operatori contro pianificatori" in un problema condiviso con un obiettivo condiviso.

## TOC nell'impianto digitale: dati, simulazione e APS

La TOC nasce con il software: OPT era un programma di schedulazione prima di diventare una filosofia [3]. Oggi gli strumenti digitali aiutano in quattro ambiti.

### 1. Dati per l'individuazione dei colli di bottiglia

Le piattaforme MES e IIoT forniscono gli stati macchina con marcatura temporale di cui il metodo dei periodi attivi ha bisogno (Sezione 6). La maggior parte degli impianti dispone già degli stati (in funzione, inattiva, guasta, attrezzaggio) ma non distingue "affamata" e "bloccata" da "inattiva". Aggiungere questi due stati è spesso la singola modifica più utile per l'analisi TOC. Concordate con gli operatori e, ove applicabile, con il sindacato che i dati sugli stati macchina servono a individuare le perdite di sistema, non a valutare le singole persone. Raccogliete i dati in sola lettura dai controlli e mantenete segmentata la rete OT; la guida [OT cybersecurity e ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) spiega come. Verificate che gli orologi siano sincronizzati tra le macchine, perché il metodo dei periodi attivi confronta le marcature temporali tra le risorse. Le guide [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) e [manutenzione predittiva e IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/) spiegano il percorso dei dati; la guida [IT di produzione con Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) tratta l'analisi cloud di tali dati.

### 2. Simulazione per i colli di bottiglia mobili e il dimensionamento dei buffer

Una simulazione a eventi discreti consente di testare dimensioni dei buffer, regole di rilascio e opzioni di elevazione prima di modificare il reparto produttivo. Roser, Nakano e Tanaka hanno sviluppato il metodo dei periodi attivi sui dati di simulazione [13][14]. Domande tipiche: con il mix del prossimo trimestre, quanto spesso si sposta il collo di bottiglia? Quanto deve essere grande il buffer del vincolo per mantenere la quota di ordini rossi sotto il 10 per cento? Una seconda macchina sposta il vincolo al montaggio? La guida [gemello digitale nella produzione](https://www.m365.fm/en/learn/digital-twin-manufacturing/) spiega quando un modello di simulazione diventa un gemello digitale.

### 3. APS per la schedulazione a tamburo

Un APS può schedulare il tamburo con setup dipendenti dalla sequenza, calcolare le date di rilascio a partire dai buffer e mostrare lo stato dei buffer. DBR fornisce la logica di controllo; l'APS fornisce la potenza di calcolo, soprattutto quando il vincolo si sposta o più vincoli interagiscono (dove la semplice regola del mix di prodotti non funziona, si veda la Sezione 19). La guida [schedulazione della produzione e APS](https://www.m365.fm/en/learn/production-scheduling-aps/) tratta l'argomento in profondità, incluso quando l'ERP è sufficiente.

### 4. Modelli del flusso del valore per la visione di sistema

Un modello digitale del flusso del valore mostra il vincolo nel contesto dell'intero flusso: tempi di ciclo, disponibilità, dimensioni dei lotti e scorte. Un esempio di tale software è iFAKT Polaris, che combina modellazione del flusso del valore e simulazione; secondo il fornitore, i suoi moduli includono l'ottimizzazione della schedulazione [26]. Si tratta di una descrizione del fornitore, non di un test indipendente. **Nota: l'autore lavora presso iFAKT GmbH.** La guida [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) lo descrive più in dettaglio; altri strumenti di flusso del valore e di simulazione possono svolgere la stessa analisi TOC.

### Sequenza: prima il metodo, poi il software

Iniziate il registro delle perdite di vincolo e la lavagna dei buffer su carta o in un foglio di calcolo. Automatizzate quando il metodo funziona e le persone si fidano dei numeri. Una schermata dello stato dei buffer che nessuno usa è peggiore di una lavagna bianca che guida la riunione quotidiana.

## Glossario

| Termine | Definizione |
|---|---|
| Periodo attivo | una sequenza ininterrotta di stati attivi di una risorsa; base del metodo del periodo attivo [13] |
| Metodo del periodo attivo | metodo di individuazione del collo di bottiglia: in ogni momento, la risorsa con il periodo attivo ininterrotto più lungo è il collo di bottiglia [13][14] |
| Buffer di assemblaggio | buffer temporale che fa attendere in assemblaggio le parti non vincolanti in attesa della parte vincolante |
| Collo di bottiglia | una risorsa la cui capacità è inferiore alla domanda che le viene posta |
| Giro di reparto (bottleneck walk) | metodo da reparto che consiste nel annotare gli stati di lavoro, mancanza di materiale e blocco durante giri ripetuti [15] |
| Gestione del buffer | monitoraggio del consumo dei buffer per zone di colore, per stabilire priorità e trovare le cause di miglioramento [9] |
| Penetrazione del buffer | quota di un buffer temporale già consumata |
| Risorsa a capacità vincolata (CCR) | una risorsa vicina alla propria capacità che può diventare il vincolo se non gestita |
| Vincolo | qualsiasi elemento che limita le prestazioni di un sistema rispetto al suo obiettivo |
| Buffer di vincolo | buffer temporale posto davanti al vincolo |
| CONWIP | constant work in process; sistema a tiraggio che limita il WIP totale di una linea [23] |
| Catena critica | la catena più lunga di attività dipendenti, considerando le dipendenze di attività e risorse |
| Albero della realtà attuale (CRT) | strumento del processo di pensiero che collega gli effetti indesiderati alle cause radice |
| Tamburo | il programma del vincolo, che stabilisce il ritmo dello stabilimento |
| Drum-buffer-rope (DBR) | metodo di schedulazione TOC: programmare il vincolo, proteggerlo con buffer temporali, rilasciare al suo ritmo [6][8] |
| Elevare | fase 4: aumentare la capacità del vincolo |
| Nuvola in evaporazione (EC) | strumento del processo di pensiero per risolvere un conflitto mettendo in discussione un presupposto |
| Sfruttare | fase 2: ottenere il massimo dal vincolo con le risorse esistenti |
| Buffer di alimentazione | nella catena critica, un buffer nel punto in cui una catena non critica si unisce alla catena critica |
| Cinque passi di focalizzazione | identificare, sfruttare, subordinare, elevare, prevenire l'inerzia [4] |
| Albero della realtà futura (FRT) | strumento del processo di pensiero per verificare una soluzione e i suoi effetti collaterali |
| Inerzia | regole e abitudini che sopravvivono al vincolo per cui erano state create |
| Inventario/investimento (I) | denaro immobilizzato in beni che il sistema intende vendere (e, in senso ampio, in asset) [20] |
| Legge di Little | WIP = throughput × tempo di ciclo [16] |
| Spese operative (OE) | tutto il denaro speso per trasformare l'inventario in throughput [20] |
| Carico pianificato | in S-DBR, il lavoro impegnato sulla CCR espresso in tempo |
| POOGI | processo di miglioramento continuo; i cinque passi di focalizzazione come ciclo |
| Albero dei prerequisiti (PRT) | strumento del processo di pensiero che elenca ostacoli e obiettivi intermedi |
| Buffer di progetto | nella catena critica, il tempo di sicurezza aggregato alla fine di un progetto |
| Rope (fune) | il meccanismo di rilascio che collega il rilascio del materiale al programma del vincolo |
| S-DBR (drum-buffer-rope semplificato) | variante del DBR con buffer di spedizione e verifica del carico pianificato, per la produzione su ordine [6][9] |
| Collo di bottiglia mobile | un collo di bottiglia che si sposta tra le risorse nel tempo [14] |
| Buffer di spedizione | buffer temporale che protegge la data di consegna |
| Subordinare | fase 3: allineare tutti i non vincoli al vincolo |
| Throughput (T) | velocità con cui il sistema genera denaro attraverso le vendite: vendite meno costi variabili reali [20] |
| Contabilità del throughput | contabilità gestionale basata su T, I e OE |
| Rapporto di contabilità del throughput (TPAR) | ritorno per ora di stabilimento ÷ costo per ora di stabilimento [19] |
| Albero della transizione (TrT) | strumento del processo di pensiero per l'implementazione passo dopo passo |
| TOCICO | Theory of Constraints International Certification Organization, un'organizzazione no-profit statunitense 501(c)(3) [5] |
| Effetto indesiderato (UDE) | un effetto negativo osservato, usato come input per un albero della realtà attuale |
| VATI | classificazione degli stabilimenti in base alla forma del flusso di materiale: V, A, T, I [6] |

## FAQ: domande sulla teoria dei vincoli

### Che cos'è la teoria dei vincoli in parole semplici?

Ogni sistema ha uno o pochi anelli deboli che ne limitano la capacità produttiva. La teoria dei vincoli dice: individuare quell'anello debole, sfruttarlo al massimo, allineare tutto il resto ad esso e solo dopo investire su di esso. È stata sviluppata da Eliyahu M. Goldratt e introdotta in *The Goal* nel 1984 [1].

### Quali sono i 5 passi della teoria dei vincoli?

Identificare il vincolo, sfruttare il vincolo, subordinare tutto il resto al vincolo, elevare il vincolo e impedire che l'inerzia diventi il vincolo, poi ricominciare [4].

### Qual è un esempio di teoria dei vincoli?

Nello stabilimento di collettori descritto nella Sezione 5, una cella CNC limitava la produzione. Coprire le pause, ridurre i tempi di cambio, far arrivare il materiale per fasi e anticipare i controlli di qualità hanno aumentato il suo tempo produttivo di 800 minuti a settimana (22 percento), e cambiare il mix di prodotti in base al throughput per minuto di vincolo ha aggiunto profitto senza investimenti. Una seconda macchina da 650.000 dollari si è rivelata l'opzione più debole.

### Qual è la differenza tra collo di bottiglia e vincolo?

Un collo di bottiglia è una risorsa con capacità inferiore alla domanda che la riguarda. Un vincolo è qualsiasi elemento che limita l'obiettivo del sistema: un collo di bottiglia, ma anche il mercato, un materiale, una politica o un modo di pensare. Ogni collo di bottiglia che limita la produzione è un vincolo; non ogni vincolo è un collo di bottiglia.

### Come si identifica un collo di bottiglia in un processo?

Partire da una tabella di carico della capacità (domanda × tempo di processo rispetto al tempo disponibile), poi confermare in reparto con il conteggio delle code e un giro sul collo di bottiglia. Se si dispone di stati macchina con marcatura temporale, usare il metodo dei periodi attivi, che mostra anche i colli di bottiglia mobili [13][14][15]. La Sezione 6 confronta sei metodi.

### Che cos'è l'analisi del collo di bottiglia?

L'analisi del collo di bottiglia individua la risorsa che limita un processo, quantifica quanta produzione costa e verifica se si sposta nel tempo. In uno stabilimento, partire dal calcolo del carico di capacità, confermarlo con il conteggio delle code e un giro sul collo di bottiglia, e usare i dati di stato macchina con il metodo dei periodi attivi dove disponibili (Sezione 6).

### Come si risolve un collo di bottiglia?

Seguire i cinque passi di focalizzazione. Prima sfruttarlo (nessun minuto perso, nessun lavoro difettoso, il giusto mix di prodotti), poi subordinare il resto dello stabilimento al suo ritmo, e solo allora elevarlo con straordinari, esternalizzazione o nuove attrezzature. Nell'esempio dei collettori della Sezione 5, il solo sfruttamento ha aumentato il tempo produttivo al vincolo del 22 percento prima di qualsiasi investimento.

### Che cosa sono i vincoli produttivi?

Qualsiasi elemento che limiti quanto uno stabilimento può produrre e spedire: capacità delle attrezzature, persone e competenze, materiali e fornitori, il mercato e le politiche dello stabilimento stesso, come le regole sulla dimensione dei lotti o sull'utilizzo. Un vincolo produttivo non è sempre una macchina (Sezione 3).

### Quali sono i quattro tipi di vincoli?

Gli elenchi variano. Raggruppati in quattro, i tipi della Sezione 3 sono vincoli fisici (attrezzature, persone, materiali), vincoli di mercato, vincoli di politica e vincoli di paradigma. La tabella della Sezione 3 suddivide il tipo fisico in tre, il che dà sei.

### Che cos'è il drum-buffer-rope?

Il drum-buffer-rope è il metodo di schedulazione della TOC. Il drum è la schedulazione del vincolo, il buffer è un buffer temporale che protegge il vincolo e la data di spedizione, e la rope rilascia il materiale solo un tempo di buffer prima che il vincolo ne abbia bisogno [6][8]. La Sezione 7 mostra un programma di rilascio con i numeri.

### Che cos'è il drum-buffer-rope semplificato (S-DBR)?

S-DBR è una variante per stabilimenti a commessa. Usa solo un buffer di spedizione e verifica il carico pianificato sulla risorsa a capacità vincolata quando si promettono le date di consegna, invece di mantenere una schedulazione dettagliata del vincolo [6][9].

### Che cos'è la gestione dei buffer?

La gestione dei buffer monitora quanta parte del buffer temporale di ciascun ordine è stata consumata e classifica gli ordini in verde, giallo o rosso. Gli ordini rossi hanno la priorità, e le cause degli ordini rossi diventano l'elenco dei miglioramenti [9].

### Che cos'è la contabilità del throughput?

La contabilità del throughput è la contabilità gestionale della TOC. Usa il throughput (ricavi meno costi realmente variabili), l'inventario o l'investimento e le spese operative; l'utile netto è T − OE e il ROI è (T − OE) ÷ I [20][22]. In presenza di un vincolo, classifica i prodotti in base al throughput per minuto di vincolo.

### In che modo la contabilità per throughput si differenzia dalla contabilità dei costi?

La contabilità dei costi standard ripartisce manodopera e costi generali sulle unità e classifica i prodotti in base al margine per unità. La contabilità per throughput considera manodopera e costi generali come spese operative, che nel breve periodo non variano con ogni unità prodotta, e classifica i prodotti in base al throughput per unità di tempo del vincolo. I due metodi possono dare risposte opposte, come mostra l'esempio della Sezione 11.

### Qual è la differenza tra lean e teoria dei vincoli?

Lean cerca gli sprechi lungo l'intero flusso del valore e crea flusso e logica pull. TOC individua l'unico vincolo e concentra il miglioramento su di esso. Lean bilancia il lavoro sul takt; TOC mantiene capacità di riserva nei non vincoli. Usate insieme, TOC indica agli strumenti lean come SMED e TPM da dove iniziare.

### TOC e Six Sigma possono essere combinati?

Sì. TOC sceglie il punto d'intervento, Six Sigma riduce la variabilità in quel punto, ad esempio gli scarti sul vincolo o un approvvigionamento instabile verso il suo buffer. La contabilità per throughput mostra poi l'effetto economico di ciascun progetto.

### Quali sono i processi di pensiero in TOC?

Un insieme di strumenti logici per problemi non fisici: l'albero della realtà attuale, la nuvola di evaporazione, l'albero della realtà futura, l'albero dei prerequisiti e l'albero della transizione. Rispondono a che cosa cambiare, in che cosa cambiarlo e come provocare il cambiamento [12].

### Che cos'è la gestione dei progetti a catena critica?

È l'applicazione della TOC ai progetti da parte di Goldratt, presentata nel suo libro del 1997 *Critical Chain* [3]. Pianifica la catena più lunga di dipendenze tra attività e risorse, rimuove la sicurezza dalle singole attività e la concentra in buffer di progetto e buffer di alimentazione.

### Che cos'è la teoria dei vincoli nella gestione della catena di fornitura?

Nelle catene di fornitura, la TOC sostituisce le scorte guidate dalle previsioni in ogni sede con buffer che vengono reintegrati in base al consumo effettivo e ridimensionati in base allo stato dei buffer [6]. Considera l'anello più debole, spesso un fornitore, uno stabilimento o il mercato, come il vincolo che fissa il ritmo dell'intero sistema. La Sezione 14 riassume le regole di reintegro.

### Quali sono le critiche alla teoria dei vincoli?

Le critiche principali riguardano il bias di pubblicazione negli studi di successo, la mancanza di ottimalità delle euristiche TOC quando interagiscono più vincoli, la limitata originalità di alcune idee e la tendenza a trascurare le persone e le politiche [6][10]. La Sezione 19 tratta ciascun punto.

### La teoria dei vincoli è ancora attuale?

Sì. Gli stabilimenti hanno ancora dei vincoli, e la combinazione di dati macchina migliori, simulazione e APS rende più facile individuare colli di bottiglia mobili e pianificare un drum. Ciò che è cambiato è che la TOC raramente viene usata da sola; di solito è combinata con lean, Six Sigma e pianificazione digitale.

### Chi ha creato la teoria dei vincoli?

Eliyahu M. Goldratt (1947-2011), fisico e autore di testi di management israeliano. Ha introdotto la TOC in *The Goal* (1984), scritto insieme a Jeff Cox [1][2].

### Quanto tempo richiede l'implementazione della teoria dei vincoli?

In uno stabilimento o in un flusso del valore, i primi risultati misurabili derivano di solito dallo sfruttamento del vincolo nell'arco di poche settimane, perché richiedono poco denaro. Una routine DBR o S-DBR stabile con la gestione dei buffer richiede diversi mesi; la roadmap della Sezione 16 prevede sei mesi per il primo ciclo completo. Queste durate sono ipotesi di pianificazione, non benchmark tratti da uno studio.

### Esiste una certificazione in teoria dei vincoli?

TOCICO offre certificazioni su tre livelli: esami di fondamenti, esami per practitioner e una valutazione per implementer, in aree come operations, supply chain, gestione dei progetti (CCPM), processi di pensiero e finanza [5].

## Conclusione e primi passi

La teoria dei vincoli parte da un'osservazione semplice: la produzione di uno stabilimento è determinata da un numero molto ridotto di vincoli, di solito uno solo. Ciò cambia ciò che i responsabili dovrebbero fare. Invece di migliorare tutto contemporaneamente, si individua il vincolo, si smette di sprecarne il tempo, si fa in modo che il resto dello stabilimento lo supporti e si investe denaro solo quando questo passo è completato. Drum-buffer-rope traduce questa logica in un programma, la gestione dei buffer la traduce in priorità quotidiane e la contabilità del throughput la traduce in decisioni finanziarie, che i report di costo standard possono valutare in modo errato.

L'esempio svolto mostra la portata di ciò che spesso è possibile ottenere senza investimenti: il 22 percento in più di tempo disponibile sul vincolo grazie a pause, attrezzaggi, preparazione dei materiali e controlli di qualità, e un cambiamento nel mix di prodotti che il costing standard non avrebbe suggerito. Mostra anche i limiti: una volta sfruttato, il vincolo si sposta e le vecchie regole diventano il problema successivo. La TOC dà i migliori risultati con un vincolo chiaro e richiede altri strumenti (ottimizzazione, APS, bilanciamento delle linee lean) dove i vincoli si spostano o interagiscono. La base di evidenze è costituita soprattutto da casi di successo, quindi verificate le affermazioni nel vostro stabilimento.

**I vostri primi passi nei prossimi 30 giorni**

- [ ] Costruire una tabella di carico per la vostra principale famiglia di prodotti (domanda × tempo di processo vs. tempo disponibile) e individuare il candidato vincolo
- [ ] Confermare il candidato con i conteggi delle code e tre sopralluoghi sui colli di bottiglia per turno, per una settimana
- [ ] Avviare un registro delle perdite di vincolo (Modello 2) sul candidato e compilarlo ogni turno per due settimane
- [ ] Calcolare il throughput per minuto di vincolo per i vostri primi 10 prodotti (Modello 3) con il vostro controller
- [ ] Scegliere le due perdite maggiori e intervenire (copertura delle pause, attrezzaggio esterno, qualità prima del vincolo)
- [ ] Eliminare almeno un obiettivo di utilizzo nei non vincoli
- [ ] Informare i rappresentanti sindacali o dei dipendenti su obiettivi, copertura delle pause e ruolo della capacità in eccesso
- [ ] Chiedere all'IT se i dati delle macchine possono distinguere "affamato" e "bloccato" da "fermo" per il metodo dei periodi attivi
- [ ] Tenere una riunione quotidiana di 10 minuti presso il vincolo (Modello 8)

---

## Ulteriori letture su m365.fm

**Guide correlate**
- [Pianificazione della produzione e APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPI di produzione](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Gestione del shop floor e Gemba Walk](https://www.m365.fm/en/learn/shop-floor-management/)
- [Digital Twin nel manifatturiero](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [IT manifatturiera con Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Pianificazione della produzione aerospaziale](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

**Nuove guide di questa serie**
- [SMED e riduzione dei cambi produzione](https://www.m365.fm/en/learn/smed-changeover-reduction/)
- [TPM e OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [Kanban e sistemi pull](https://www.m365.fm/en/learn/kanban-pull-system/)
- [Six Sigma e analisi delle cause radice](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/)
- [S&OP, MRP e pianificazione della produzione](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)
- [Manutenzione predittiva e IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/)
- [Simulazione di produzione](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)
- [Dimensionamento dei lotti](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Gestione delle scorte manifatturiere](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)

**Termini del glossario (entità)**
[Teoria dei vincoli](https://www.m365.fm/entity/theory-of-constraints/) · [Scheduling basato sui vincoli](https://www.m365.fm/entity/constraint-based-scheduling/) · [Gestione dei buffer](https://www.m365.fm/entity/buffer-management/) · [Takt time](https://www.m365.fm/entity/takt-time/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [SMED](https://www.m365.fm/entity/smed/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Sistema pull](https://www.m365.fm/entity/pull-system/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** è il conduttore di m365.fm e lavora presso iFAKT GmbH. Su m365.fm scrive di lean manufacturing, eccellenza operativa, pianificazione della produzione e trasformazione digitale della produzione, con particolare attenzione a come i modelli del flusso del valore, la simulazione e l'analisi degli KPI aiutino gli stabilimenti a individuare e gestire i propri vincoli.

**Nota: l'autore lavora presso iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026. Sources marked (S) were taken over from the source list of the related guide *Production Scheduling and APS* (`production-scheduling-aps.md`), where they were verified on the same date; they could not be re-fetched in this session because the shared web search and fetch budget ran out.

1. Goldratt, Eliyahu M.; Cox, Jeff: The Goal: Excellence in Manufacturing. North River Press, Croton-on-Hudson (NY) 1984, 262 pp., ISBN 978-0-88427-060-7, LCCN 85021827. Catalog record: Open Library. https://openlibrary.org/books/OL2540561M/The_goal
2. North River Press: Eliyahu M. Goldratt, Renowned Business Guru and Author of International Best Selling Business Novel The Goal, Dies at Age 64. Press release via PR Newswire, June 14, 2011. https://prnewswire.com/news-releases/eliyahu-m-goldratt-renowned-business-guru-and-author-of-international-best-selling-business-novel-the-goal-dies-at-age-64-123796619.html
3. Eliyahu M. Goldratt (biography, Creative Output and OPT, Avraham Y. Goldratt Institute, bibliography with years). Wikipedia. https://en.wikipedia.org/wiki/Eliyahu_M._Goldratt
4. Theory of Constraints Institute: Five Focusing Steps. https://www.tocinstitute.org/five-focusing-steps.html (and the overview page https://www.tocinstitute.org/theory-of-constraints.html)
5. Theory of Constraints International Certification Organization (TOCICO): About us (501(c)(3) status, certification levels, TOC Innovation Summit). https://www.tocico.org/about-us
6. Theory of constraints (five focusing steps, buffers and buffer management, DBR and S-DBR, VATI, throughput accounting, critical chain, criticism section citing Trietsch, Linhares 2009, Noreen/Smith/Mackey 1995, Gupta/Snyder 2009, Nave 2002 and Goldratt 2009). Wikipedia. https://en.wikipedia.org/wiki/Theory_of_constraints
7. The Goal (novel) (editions, characters, Time 2011 list citing Rawlings, N.: The 25 Most Influential Business Management Books, Time, August 9, 2011). Wikipedia. https://en.wikipedia.org/wiki/The_Goal_(novel)
8. (S) Goldratt, Eliyahu M.; Fox, Robert E.: The Race. North River Press 1986, 179 pp., ISBN 0-88427-062-9. Reference: https://buresund.nu/books/the-race
9. (S) Cox, James F. III; Schleier, John G. (eds.): Theory of Constraints Handbook. McGraw-Hill, New York 2010, ISBN 978-0-07-166554-4; ch. 8: Srikanth, M. L.: DBR, Buffer Management, and VATI Flow Classification; ch. 9: From DBR to Simplified-DBR for Make-to-Order. Chapter reference: https://www.toc-goldratt.com/en/product/dbr-buffer-management-and-vati-flow-classification-chapter-8-of-the-theory-of-constraints-handbook
10. Mabin, Victoria J.; Balderstone, Steven J.: The performance of the theory of constraints methodology: Analysis and discussion of successful TOC applications. International Journal of Operations & Production Management 23 (2003) 6, pp. 568–595. DOI: 10.1108/01443570310476636. https://www.emeraldinsight.com/doi/abs/10.1108/01443570310476636
11. Panizzolo, Roberto: Theory of Constraints (TOC) Production and Manufacturing Performance. International Journal of Industrial Engineering and Management 7 (2016) 1, pp. 15–23. https://www.research.unipd.it/retrieve/e14fb26b-f0bc-3de1-e053-1705fe0ac030/ijiem_vol7_no1_3.pdf
12. Kim, Sanghyun; Mabin, Victoria J.; Davies, John: The theory of constraints thinking processes: retrospect and prospect. International Journal of Operations & Production Management 28 (2008) 2, pp. 155–184. DOI: 10.1108/01443570810846883
13. Roser, Christoph; Nakano, Masaru; Tanaka, Minoru: A Practical Bottleneck Detection Method. In: Peters, B. A.; Smith, J. S.; Medeiros, D. J.; Rohrer, M. W. (eds.): Proceedings of the 2001 Winter Simulation Conference, pp. 949–953. https://informs-sim.org/wsc01papers/126.PDF
14. Roser, Christoph; Nakano, Masaru; Tanaka, Minoru: Shifting Bottleneck Detection. In: Yücesan, E.; Chen, C.-H.; Snowdon, J. L.; Charnes, J. M. (eds.): Proceedings of the 2002 Winter Simulation Conference, pp. 1079–1086. https://www.informs-sim.org/wsc02papers/145.pdf
15. Roser, Christoph: Mathematically Accurate Bottleneck Detection 2 – The Active Period Method. AllAboutLean.com, June 29, 2014 (updated May 13, 2026). https://www.allaboutlean.com/active-period-method
16. Little, John D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383 (bibliographic data confirmed via Crossref, November 20, 2026)
17. (S) Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337
18. (S) Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57 (1961) 4, pp. 902–904. DOI: 10.1017/S0305004100036094
19. ACCA (Performance Management examining team): Throughput accounting and the theory of constraints, part 2. Association of Chartered Certified Accountants, technical article. https://www.accaglobal.com/us/en/student/exam-support-resources/fundamentals-exams-study-resources/f5/technical-articles/throughput-constraints2.html
20. Murphy, Sean: Summary of Goldratt, E. M.: The Haystack Syndrome: Sifting Information Out of the Data Ocean. North River Press, New York 1990. Management and Accounting Web (MAAW, J. R. Martin). https://maaw.info/ArticleSummaries/ArtSumHaystackSyndrome90.htm
21. Corbett, Thomas: Throughput Accounting. North River Press, 174 pp., ISBN 978-0-88427-158-1 (retailer listing dated January 1, 1999; publisher page: https://www.toc-goldratt.com/en/product/Throughput-Accounting). Listing: https://www.booktopia.com.au/throughput-accounting-thomas-corbett/book/9780884271581.html
22. Theory of Constraints (TOC): throughput accounting measures, derived measures and decision priority. Lean Production (Vorne Industries). https://www.leanproduction.com/theory-of-constraints/
23. (S) Spearman, Mark L.; Woodruff, David L.; Hopp, Wallace J.: CONWIP: a pull alternative to kanban. International Journal of Production Research 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761
24. Gray, Virginia; Felan, Joe; Umble, Elisabeth; Umble, Michael: A comparison of drum-buffer-rope (DBR) and critical chain (CC) buffering techniques. Paper presented at PMI Research Conference 2000, Paris. Project Management Institute. https://www.pmi.org/learning/library/drum-buffer-rope-critical-chain-buffering-8526
25. Occupational Safety and Health Administration (OSHA): 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). US Department of Labor. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147
26. iFAKT GmbH: Polaris Optimizer (vendor page; site navigation also lists Simulator and Value Stream Mapping). https://www.ifakt.de/en/solutions/optimizer
27. National Institute of Standards and Technology (NIST): Malcolm Baldrige National Quality Award 1988 recipient profile, Motorola Inc. ("Six Sigma Quality"). https://www.nist.gov/system/files/documents/2017/10/11/1988_Motorola_Inc.pdf
28. PwC Viewpoint: Inventory guide, section 1.3 Cost (definition of inventory cost as the sum of applicable expenditures and charges directly or indirectly incurred; references ASC 330-10-30-3 to 30-8). https://viewpoint.pwc.com/dt/us/en/pwc/accounting_guides/inventory/Inventory-Guide/Chapter-1-Inventory-costing/1_3_Cost.html (accessed November 20, 2026)
29. RSM US LLP: Inventory valuation considerations in the forecasted economy, April 2023 (fixed production overhead allocated based on normal capacity; ASC 330-10-30-6 on abnormally low production). https://rsmus.com/content/dam/rsm/insights/financial-reporting/1pdf/Inventory-valuation-considerations-in-the-forecasted-economy.pdf (accessed November 20, 2026)
