# SEO metadata

| Field | Value |
|---|---|
| Meta title | Produzione snella: principi, strumenti e come iniziare |
| Meta description | Produzione snella spiegata: 5 principi, gli 8 sprechi, 17 strumenti con esempi pratici, una tabella di marcia di 12 mesi, KPI e limiti. Con fonti. |
| Slug | `lean-manufacturing` |

# Produzione snella (Lean Manufacturing): principi, strumenti, implementazione e limiti

> **Risposta breve:** La produzione snella (lean manufacturing) è un modo di gestire lo stabilimento che allinea ogni attività a ciò che il cliente apprezza ed elimina tutto il resto, passo dopo passo. Nasce dal Toyota Production System, poggia su cinque principi (valore, flusso di valore, flusso, pull, perfezione) e si applica con strumenti come 5S, kanban, SMED, standard work e kaizen [1][5].

> **Punti chiave**
> - John Krafcik ha coniato il termine "lean production" nel 1988; il libro del MIT *The Machine That Changed the World* (1990) lo ha reso noto in tutto il mondo [2][3][4].
> - Womack e Jones hanno definito i cinque principi lean in *Lean Thinking* (1996) [5].
> - Il Toyota Production System poggia su due pilastri: just-in-time e jidoka [1][25].
> - Taiichi Ohno ha definito sette sprechi; la maggior parte delle fonti occidentali ne aggiunge un ottavo, il talento inutilizzato dei dipendenti (i mnemonici DOWNTIME o TIMWOODS) [8][40].
> - Lean è un sistema di gestione. Kanban o 5S funzionano solo se affiancati da leadership, standard e risoluzione quotidiana dei problemi.
> - Una sequenza di implementazione collaudata: stabilità prima del flusso, flusso prima del pull, pull prima del livellamento.
> - Lean non significa "zero scorta di sicurezza a ogni costo": da un piano di continuità introdotto dopo il 2011, Toyota richiede ai fornitori di mantenere da due a sei mesi di scorta di semiconduttori [31].
> - Le metriche fondamentali sono lead time, flow ratio, OEE, first pass yield e consegna puntuale; vanno esposte ogni giorno nella lavagna del reparto, su carta o in digitale.

## Indice

1. [Che cos'è la produzione snella? Definizione e idea centrale](#che-cosè-la-produzione-snella-lean-manufacturing-definizione-e-idea-di-fondo)
2. [Storia: da Ford e Toyota al MIT](#storia-da-ford-e-toyota-al-mit)
3. [I 5 principi della produzione snella (Womack e Jones)](#i-5-principi-della-lean-manufacturing-womack-e-jones)
4. [Muda, mura, muri e gli 8 sprechi del lean](#muda-mura-muri-e-gli-8-sprechi-della-lean)
5. [La casa del Toyota Production System](#la-casa-del-toyota-production-system)
6. [Strumenti della produzione snella: la cassetta degli attrezzi in sintesi](#strumenti-di-lean-manufacturing-la-cassetta-degli-attrezzi-in-sintesi)
7. [Lean vs. Six Sigma vs. Lean Six Sigma](#lean-vs-six-sigma-vs-lean-six-sigma)
8. [Leadership e cultura lean](#leadership-e-cultura-lean)
9. [Come implementare la produzione snella: una roadmap in cinque fasi](#come-implementare-il-lean-manufacturing-una-roadmap-in-cinque-fasi)
10. [KPI lean: come misurare i progressi](#kpi-lean-come-misurare-i-progressi)
11. [Errori comuni nell'implementazione lean](#errori-comuni-nellimplementazione-del-lean)
12. [Svantaggi e limiti della produzione snella](#svantaggi-e-limiti-della-produzione-snella)
13. [Lean e digitale: lean 4.0, gemelli digitali e Microsoft 365](#lean-e-digitale-lean-40-digital-twin-e-microsoft-365)
14. [Esempi documentati di produzione snella](#esempi-documentati-di-lean-manufacturing)
15. [Supporto software: iFAKT Polaris come esempio](#supporto-software-ifakt-polaris-come-esempio)
16. [Glossario lean: termini chiave dalla A alla Z](#glossario-lean-termini-chiave-dalla-a-alla-z)
17. [FAQ: domande sulla produzione snella](#faq-domande-sulla-produzione-snella)
18. [Conclusione e primi passi](#conclusione-e-primi-passi)

## Che cos'è la produzione snella (lean manufacturing)? Definizione e idea di fondo

La produzione snella è un sistema di gestione che progetta il modo in cui un'azienda crea valore dal punto di vista del cliente e rimuove, passo dopo passo, tutto ciò che non aggiunge valore. La parola "lean" viene spesso intesa erroneamente come riduzione del personale. L'obiettivo è un sistema che offra più valore al cliente con meno spazio, meno scorte, tempi di attraversamento più brevi e meno difetti. I ricercatori del MIT lo riassunsero nel 1990: rispetto alla produzione di massa, la produzione snella usa "meno di tutto": la metà dello sforzo umano in fabbrica, la metà dello spazio produttivo e la metà dell'investimento in attrezzature [4].

Il Lean Enterprise Institute (LEI), l'organizzazione statunitense senza scopo di lucro fondata da James P. Womack, descrive il lean come un modo di pensare e agire che migliora un processo in cinque fasi: specificare il valore, identificare il flusso del valore, creare flusso, stabilire la logica pull e perseguire la perfezione [5]. Il Fraunhofer Institute for Manufacturing Engineering and Automation (IPA) tedesco, un istituto di ricerca applicata per la produzione, considera il lean management sia una filosofia sia un metodo il cui obiettivo è eliminare gli sprechi e aumentare la creazione di valore in tutte le aree della produzione (parafrasato); il miglioramento continuo che coinvolge tutti i dipendenti e i dirigenti ne è il fulcro [37].

### Produzione snella, produzione lean e lean management: differenze

I termini sono spesso usati come sinonimi, ma il loro punto di vista differisce:

| Termine | Focus | Ambito tipico |
|---|---|---|
| Lean manufacturing / produzione snella | progettazione della fabbricazione e dell'assemblaggio secondo i principi lean | stabilimento, linea, cella, logistica interna |
| [Lean management](https://www.m365.fm/entity/lean-management/) | il sistema di leadership e organizzativo che estende il lean all'intera azienda | strategia, leadership, funzioni d'ufficio, supply chain |
| Toyota Production System (TPS) | il modello storico; il sistema specifico di Toyota | Toyota e i suoi fornitori |
| Sistema di produzione aziendale ("XPS"; in Germania *Ganzheitliches Produktionssystem*, GPS) | un regolamento specifico di un'azienda, fatto di principi e metodi, spesso preso dal nome dell'azienda | produttori con più stabilimenti, aziende di medie dimensioni |

La produzione snella è l'applicazione del pensiero lean in officina; il lean management è il quadro complessivo. Negli Stati Uniti i due termini si sovrappongono a tal punto che la maggior parte dei risultati di ricerca li usa in modo intercambiabile. I lettori tedeschi conoscono un terzo termine: il "sistema di produzione olistico" (GPS), definito nella linea guida tecnica tedesca VDI 2870 Parte 1 del luglio 2012. Secondo la VDI, la linea guida resta in parte valida ma è in revisione, tra l'altro per includere la sicurezza sul lavoro [36]. La controparte statunitense più vicina non è uno standard ma un modello: lo Shingo Model dello Shingo Institute della Jon M. Huntsman School of Business della Utah State University, che valuta le organizzazioni in base a principi guida dell'eccellenza operativa e assegna lo Shingo Prize, istituito nel 1988 [64]. Il rapporto tra lean e la più ampia idea di eccellenza operativa è trattato in [Operational Excellence vs. Lean](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-vs-lean/) e nella [guida all'eccellenza operativa](https://www.m365.fm/en/learn/operational-excellence/).

### L'idea di fondo in una frase

Il lean considera un processo come un flusso attraverso il quale un prodotto arriva al cliente, e solo in secondo luogo come una sequenza di reparti. Ogni minuto in cui un prodotto attende, viene spostato, cercato o rilavorato aggiunge tempo di attraversamento, immobilizza liquidità e nasconde problemi. Il lean rende visibile questo tempo e lo tratta come potenziale di miglioramento.

Un semplice calcolo mostra la portata del fenomeno. Un pezzo tornito passa per la segatura (2 minuti), la tornitura (12 minuti) e la sbavatura (6 minuti), quindi 20 minuti di lavorazione a valore aggiunto. Tra una fase e l'altra resta in buffer e raggiunge la spedizione dopo cinque giorni lavorativi di otto ore ciascuno, cioè dopo 2.400 minuti. La quota di tempo a valore aggiunto sul tempo di attraversamento totale (il flow ratio) è 20 / 2.400 = 0,83 per cento. L'esempio è illustrativo, ma corrisponde allo schema che le mappe del flusso del valore mostrano in molti stabilimenti: il tempo di lavorazione raramente è il collo di bottiglia; quasi sempre lo è il tempo di attesa.

### Vantaggi della produzione snella

La maggior parte delle pagine elenca i vantaggi in percentuali senza fonte. Gli effetti documentati sono più modesti nei numeri ma più chiari nel meccanismo:

- **Meno sforzo, meno spazio e meno capitale a parità di output:** i ricercatori del MIT hanno rilevato che la produzione snella richiedeva circa la metà dello sforzo umano, la metà dello spazio di produzione e la metà dell'investimento in attrezzature rispetto alla produzione di massa [4]; nel 1989 gli stabilimenti giapponesi in Giappone impiegavano 16,8 ore di manodopera per veicolo, contro le 24,9 degli stabilimenti statunitensi in Nord America [6].
- **Tempi di attraversamento più brevi e meno scorte:** in Porsche, le scorte sono scese da sette giorni di copertura a uno, e le ore per 911 si sono dimezzate nell'arco di diversi anni [34].
- **Qualità integrata nel processo:** le Corolla prodotte da NUMMI sono state giudicate di qualità pari a quelle costruite in Giappone, con una forza lavoro in gran parte ex GM [56].
- **I problemi emergono prima:** le scorte ridotte e l'andon rendono visibili le anomalie invece di nasconderle nei polmoni di scorte [3][23].
- **Maggiore coinvolgimento dei dipendenti:** in Porsche i suggerimenti di miglioramento sono passati da 0,09 a 4,3 per dipendente [34].

Ciascuno di questi risultati è stato accompagnato da un cambiamento della leadership e ha richiesto anni; la sezione sugli esempi qui sotto mostra anche i limiti.

## Storia: da Ford e Toyota al MIT

Il lean non è stato inventato negli anni Novanta. Le idee si sono sviluppate nell'arco di più di un secolo, e molte pagine concorrenti ne datano l'origine in modo incoerente. La cronologia seguente si basa su fonti primarie e aziendali.

| Anno | Evento | Fonte |
|---|---|---|
| 1896 | Sakichi Toyoda sviluppa il telaio meccanico Toyoda con un dispositivo che lo arresta automaticamente quando si rompe un filo di trama: l'origine del jidoka | [1] |
| 1913 | Il 7 ottobre Ford avvia una linea di assemblaggio in movimento a Highland Park, nel Michigan; il tempo di assemblaggio della Model T scende da 12,5 ore a 93 minuti | [30] |
| 1924 | Il telaio Type G di Sakichi Toyoda, secondo Toyota il primo telaio automatico al mondo con cambio navetta senza interruzioni | [1] |
| 1927 / 1938 | Kiichiro Toyoda introduce la produzione a flusso con un nastro trasportatore a catena nell'assemblaggio dei telai (1927) e applica il principio alla produzione delle carrozzerie nello stabilimento di Koromo, completato nel 1938: la radice del just-in-time | [1] |
| Anni Trenta | L'industria aeronautica tedesca usa il takt come parametro di controllo; Toyota adotta il concetto negli anni Cinquanta | [19] |
| 1940 | Il governo statunitense lancia il Training Within Industry (TWI); alla fine della Seconda guerra mondiale più di 1,6 milioni di lavoratori in oltre 16.500 stabilimenti sono certificati. Dopo la guerra il TWI viene insegnato in Giappone e diventa una base della cultura kaizen | [59] |
| 1950 | W. Edwards Deming tiene in Giappone lezioni sul miglioramento statistico della qualità su invito della JUSE; il Deming Prize viene istituito nel 1951 | [29] |
| Anni Cinquanta–Sessanta | Shigeo Shingo sviluppa le basi della riduzione dei tempi di attrezzaggio (SMED), presso le presse di Toyota dal 1969 | [11][12] |
| 1978 | Taiichi Ohno pubblica il suo libro sul Toyota Production System (edizione inglese 1988) | [7] |
| 1984 | Inizia la produzione di NUMMI, la joint venture GM-Toyota a Fremont, California | [3][56] |
| 1985 | Il MIT avvia l'International Motor Vehicle Program (IMVP) | [4] |
| 1986 | Masaaki Imai pubblica *Kaizen: The Key to Japan's Competitive Success* | [35] |
| 1988 | John Krafcik conia il termine "lean production" sulla *Sloan Management Review*; lo Shingo Prize viene istituito alla Utah State University; Motorola, l'azienda associata al Six Sigma, riceve il Malcolm Baldrige National Quality Award | [2][3][45][64] |
| 1990 | Womack, Jones e Roos pubblicano *The Machine That Changed the World* | [4] |
| 1996 | *Lean Thinking* enuncia i cinque principi del lean | [5] |
| 2004 | Jeffrey Liker pubblica *The Toyota Way* con 14 principi manageriali | [10] |
| 2011 | Dopo il terremoto e lo tsunami in Giappone, Toyota costruisce un piano di continuità operativa con scorte di chip | [31] |
| 2012 | In Germania viene pubblicata la VDI 2870 Parte 1 sui sistemi di produzione olistici | [36] |

### Ford e la produzione di massa

Henry Ford è considerato il padre della produzione di massa. Quando, il 7 ottobre 1913, un telaio della Model T fu trainato per la prima volta con una fune e un argano davanti a 140 operai di Highland Park, il tempo di assemblaggio scese da 12,5 ore a 93 minuti, e il prezzo della Model T scese successivamente da 850 a 260 dollari [30]. Anche il lavoro ripetitivo aveva un costo: il turnover era così alto che Ford raddoppiò i salari a 5 dollari al giorno [30]. Ford creò il flusso, ma per un solo prodotto in volumi enormi. La situazione di Toyota era diversa. Dopo la Seconda guerra mondiale l'azienda giapponese non aveva né il capitale né il mercato per i volumi alla maniera di Ford, e doveva produrre molte varianti in piccole quantità mantenendo un profitto.

### Toyota: jidoka e just-in-time

Toyota fa risalire il suo sistema di produzione a due fondatori [1]. Sakichi Toyoda (1867–1930) pose le radici del jidoka con il suo telaio che si fermava quando un filo si rompeva: una macchina rileva un'anomalia e si arresta, così che non vengano a valle difetti, e una persona può sorvegliare più macchine. Suo figlio Kiichiro Toyoda (1894–1952) sviluppò l'idea del just-in-time: produrre solo ciò che serve, quando serve, nella quantità necessaria. Eiji Toyoda (1913–2013) e Taiichi Ohno (1912–1990) applicarono entrambe con coerenza e diedero vita al vero Toyota Production System [1]. Ohno, passato da Toyoda Spinning a Toyota Motor nel 1943 e salito dal ruolo di capo reparto, lo descrisse nel suo libro del 1978, pubblicato in inglese nel 1988 [7][54].

### Deming, TWI e il movimento per la qualità

Due influenze americane plasmarono in parallelo la gestione giapponese. La prima è il Training Within Industry. Il Dipartimento della Guerra degli Stati Uniti lanciò il TWI nel 1940 per formare rapidamente i supervisori alla produzione bellica, con tre programmi standardizzati: Job Instruction (insegnare un lavoro passo dopo passo), Job Methods (migliorare un lavoro eliminando, combinando, riordinando e semplificando le operazioni) e Job Relations (trattare le persone in modo equo come individui) [59]. Dopo la guerra il programma fu insegnato in Giappone, dove fu accolto con favore e divenne una base della cultura del kaizen; Toyota lo combinò con i principi del just-in-time di Ohno [59].

La seconda è il movimento per la qualità. La Union of Japanese Scientists and Engineers (JUSE) invitò W. Edwards Deming nel 1950 a insegnare i metodi statistici per il miglioramento della qualità; nel 1951 la JUSE istituì il Premio Deming [29]. Il ciclo di apprendimento e miglioramento che risale a Walter Shewhart (PDCA, scritto anche PDSA) è ancora la struttura portante del kaizen e dell'A3 [29].

### MIT, Krafcik e la parola "lean"

Negli anni Ottanta i produttori automobilistici occidentali persero quote di mercato a favore dei concorrenti giapponesi. Nel 1985 il MIT avviò l'International Motor Vehicle Program, con un budget di 5 milioni di dollari, finanziato da case automobilistiche, fornitori e governi; la sua indagine mondiale sugli stabilimenti di assemblaggio coprì 90 impianti in 15 paesi [4]. John Krafcik, che aveva lavorato per due anni come ingegnere presso NUMMI, contrappose due sistemi in "Triumph of the Lean Production System" nel numero autunnale del 1988 della *Sloan Management Review* [2][3]: il sistema "bufferizzato" degli stabilimenti occidentali, che accumula scorte affinché le macchine girino sempre, e il sistema "lean", che riduce le scorte al minimo assoluto così che i problemi di qualità e di fermo emergano immediatamente [3].

Nel 1990, *The Machine That Changed the World* di James P. Womack, Daniel T. Jones e Daniel Roos presentò la sintesi dello studio [4]. I divari di prestazione erano ampi: secondo i dati dell'IMVP, gli stabilimenti di proprietà giapponese in Giappone richiedevano in media 16,8 ore di lavoro per veicolo nel 1989, quelli di proprietà statunitense in Nord America 24,9 ore e gli stabilimenti europei in Europa 35,3 ore [6]. I ricercatori riscontrarono ampie differenze tra e all'interno delle regioni e conclusero che gli stabilimenti migliori seguivano un approccio lean anziché di produzione di massa [6].

Nel 1996 Womack e Jones estesero il concetto alle intere aziende in *Lean Thinking* ed enunciarono i cinque principi [5]. Nel 2007 li condensarono in tre temi: scopo, processo e persone [5]. Una trattazione più breve delle routine quotidiane di lean management per i responsabili di stabilimento è il post di m365.fm [Lean Management in Manufacturing: The Complete Guide](https://www.m365.fm/community/u/mirko-p/blog/lean-management-in-manufacturing-complete-guide/).

## I 5 principi della lean manufacturing (Womack e Jones)

I cinque principi sono concepiti come passi di pensiero, da percorrere in sequenza e poi ripetere [5].

| Principio | Formulazione originale (parafrasata) [5] | Esempio in reparto | Strumenti tipici |
|---|---|---|---|
| 1. Valore | specificare il valore dal punto di vista del cliente finale per famiglia di prodotti | il cliente paga un alloggiamento che rispetta le tolleranze e arriva in tre giorni, non per il magazzino o per le rilavorazioni | requisiti del cliente, matrice delle famiglie di prodotti |
| 2. Flusso del valore | identificare tutte le fasi del flusso del valore per ciascuna famiglia di prodotti, eliminando le fasi che non creano valore | camminata lungo il flusso del valore dal ricevimento alla spedizione | mappatura del flusso del valore, gemba walk |
| 3. Flusso | far sì che le fasi che creano valore si susseguano senza interruzioni, così che il prodotto scorra con continuità verso il cliente | celle invece di un layout per reparti funzionali, lotti più piccoli | linee di flusso, SMED, bilanciamento di linea, takt |
| 4. Pull | man mano che il flusso viene introdotto, lasciare che i clienti attivino il valore dalla fase a monte successiva | la produzione parte solo su segnale kanban dal cliente o dal processo successivo | kanban, supermarket, corsie FIFO, heijunka |
| 5. Perfezione | ripetere il processo fino al raggiungimento di uno stato di valore perfetto, senza sprechi | miglioramento quotidiano, standard alzati in modo continuo | kaizen, PDCA, A3, standard di lavoro |

### Principio 1: specificare il valore dal punto di vista del cliente

Il valore esiste solo dove il cliente è disposto a pagare per un'attività. Tre domande di verifica aiutano a classificarlo: l'attività modifica la forma, l'adattamento o la funzione del prodotto? Il cliente è disposto a pagarla? Viene eseguita bene al primo tentativo? Solo se tutte e tre le risposte sono sì, l'attività è a valore aggiunto. Seguono le attività necessarie ma senza valore aggiunto (come le ispezioni imposte per legge), che vanno ridotte al minimo, e lo spreco puro, che va eliminato. Il LEI distingue quindi due tipi di muda: lo spreco che non può essere rimosso immediatamente e lo spreco che può essere eliminato rapidamente tramite kaizen [9].

### Principio 2: identificare il flusso del valore

Il flusso del valore comprende tutte le attività, a valore aggiunto e senza valore aggiunto, che un prodotto attraversa dalla materia prima fino al cliente, insieme al flusso informativo che le controlla [18]. È legato a una famiglia di prodotti: uno stabilimento non ha "un" flusso del valore, ma tanti quante sono le famiglie di prodotti con fasi di processo simili.

### Principio 3: creare il flusso

Flusso significa che un prodotto passa da una fase all'altra senza attese, stoccaggi intermedi o ritorni indietro. L'ideale è il flusso di un pezzo alla volta; nella pratica, un flusso continuo in piccoli lotti. I presupposti sono cambi formato rapidi, impianti stabili, contenuto di lavoro bilanciato e un layout che disponga le fasi di processo una accanto all'altra. Le leve pratiche sono descritte in [Shop Floor Optimization: Ways to Improve Flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/).

### Principio 4: pull anziché push

In un sistema push, la produzione segue un programma e l'output viene spinto verso il processo successivo che ne abbia bisogno o meno. In un [sistema pull](https://www.m365.fm/entity/pull-system/), solo il consumo effettivo del processo a valle attiva il rifornimento [5]. Il pull limita le scorte nel sistema e quindi il lead time; dove il flusso non è possibile, i supermarket con [kanban](https://www.m365.fm/entity/kanban/) collegano i processi.

### Principio 5: perseguire la perfezione

La perfezione descrive una direzione, non uno stato finale raggiungibile. Ogni miglioramento fa emergere lo spreco successivo; per questo i principi sono strutturati come un ciclo [5]. Nel lavoro quotidiano, il principio 5 si manifesta come kaizen: molti piccoli miglioramenti, attuati ogni giorno, basati su standard.

## Muda, mura, muri e gli 8 sprechi della lean

Il pensiero Toyota distingue tre forme di perdita collegate tra loro. Il LEI le descrive così [9]:

- **Muda (spreco):** attività che consumano risorse senza creare valore per il cliente.
- **Mura (irregolarità):** variazione nel flusso di lavoro, come i picchi di domanda che il sistema produttivo genera da sé, oppure un ciclo di fretta e attesa.
- **Muri (sovraccarico):** persone o attrezzature vengono spinte più duramente, più velocemente o per più tempo di quanto consentano il loro progetto o una ragionevole progettazione del lavoro.

Il LEI illustra il legame con un camion dimensionato per tre tonnellate che deve consegnare sei tonnellate [9]. Un viaggio con sei tonnellate è muri (sovraccarico, rischio di guasto). Due viaggi con quattro e due tonnellate sono mura (consegne irregolari congestionano la banchina e poi la lasciano inattiva) e contengono anche muri. Tre viaggi con due tonnellate ciascuno sono muda (viaggi semivuoti). Solo due viaggi con tre tonnellate ciascuno evitano tutti e tre. La lezione per lo stabilimento: inseguire il muda ignorando mura e muri significa curare i sintomi. Heijunka e lavoro standard agiscono sulle cause.

### I sette sprechi di Ohno e l'ottavo

Taiichi Ohno raggruppò gli sprechi tipici della produzione di massa in sette categorie [8]. La letteratura lean occidentale ne ha aggiunto un ottavo, il talento inutilizzato dei dipendenti; non proviene da Ohno [40]. Sono comuni due acrostici: **DOWNTIME** (Defects, Overproduction, Waiting, Non-utilized talent, Transportation, Inventory, Motion, Extra-processing), quello più usato dagli stabilimenti statunitensi; **TIMWOODS** elenca gli stessi otto in ordine diverso ed è diffuso in Europa. Una panoramica sintetica è nella pagina entità di m365.fm sugli [eight wastes](https://www.m365.fm/entity/eight-wastes/).

| DOWNTIME | Spreco | Descrizione [8] | Esempio in reparto | Contromisure |
|---|---|---|---|---|
| D | Difetti | ispezione, rilavorazione, scarto | 5% di scarto e 3% di rilavorazione in una postazione di saldatura | poka-yoke, jidoka, analisi delle cause radice |
| O | Sovrapproduzione | produrre più o prima di quanto il processo successivo richieda | 100 pezzi prodotti, 80 ordinati | pull, takt, heijunka |
| W | Attesa | persone e macchine ferme | l'operatore attende macchina, materiale o un visto di approvazione | bilanciamento di linea, TPM, andon |
| N | Talento non utilizzato | conoscenze e idee dei dipendenti non sfruttate | i suggerimenti di miglioramento vanno persi | kaizen, sistema di suggerimenti, formazione |
| T | Trasporto | movimento non necessario di parti e prodotti | i pezzi passano da un magazzino centrale tra due fasi che potrebbero stare affiancate | layout di flusso, celle, milk run |
| I | Scorte | più materiale di quanto richieda un sistema pull strettamente controllato | tre settimane di WIP davanti alla verniciatura | pull, kanban, lotti più piccoli, SMED |
| M | Movimenti | movimenti del corpo non necessari o faticosi | cercare utensili, piegarsi per prendere i pezzi | 5S, progettazione ergonomica della postazione |
| E | Sovralavorazione (overprocessing) | fasi che il cliente non richiede, o che derivano da utensili non adatti | tolleranze più strette del necessario, doppia immissione dei dati | analisi del valore, lavoro standard |

**Perché la sovrapproduzione è lo spreco peggiore:** il LEI definisce la sovrapproduzione la forma peggiore perché contribuisce a tutti gli altri sei [8]. Produrre troppo presto o in eccesso richiede spazio di stoccaggio (scorte), trasporto e movimentazione (movimenti), impegna capacità che manca altrove (attesa) e nasconde difetti che emergono solo settimane dopo.

**Checklist: individuare gli sprechi nella propria postazione**

- [ ] C'è materiale fermo davanti a una postazione per più di un turno?
- [ ] Le persone devono cercare utensili, pezzi o informazioni?
- [ ] Qualcuno attende regolarmente una macchina, un visto di approvazione o materiale?
- [ ] Parti vengono movimentate o stoccate più di una volta?
- [ ] Esistono ispezioni che esistono solo a causa di problemi noti ma non risolti?
- [ ] Si produce più di quanto il processo successivo prelevi oggi?
- [ ] Le idee dei dipendenti vengono raccolte, elaborate e ricevono risposta?

## La casa del Toyota Production System

Il Toyota Production System viene spesso rappresentato come una casa. La stessa Toyota indica jidoka e just-in-time come i suoi due concetti fondamentali [1]; il LEI definisce jidoka uno dei due pilastri del TPS insieme al just-in-time [25]. La grafica esatta della casa varia a seconda dell'autore; la versione qui sotto mostra la struttura più comune.

| Livello | Contenuto | Funzione |
|---|---|---|
| Tetto | massima qualità, costo minimo, lead time più breve, sicurezza e morale | obiettivo del sistema |
| Pilastro sinistro: just-in-time | takt, flusso, pull (kanban), cambio rapido | produrre il pezzo giusto, al momento giusto, nella quantità giusta [1] |
| Pilastro destro: jidoka | fermarsi in caso di anomalie, andon, poka-yoke, separazione del lavoro umano da quello della macchina | costruire la qualità nel processo, non trasferire mai un difetto [1][25] |
| Centro | persone e team, kaizen, eliminazione degli sprechi | motore del miglioramento |
| Fondamenta | heijunka, lavoro standard, processi stabili, kaizen | stabilità come prerequisito per il flusso |

### Just-in-time

Toyota definisce il [just-in-time](https://www.m365.fm/entity/just-in-time/) come la produzione di sole quantità necessarie, quando servono e nella quantità necessaria [1]. Il LEI descrive tre elementi operativi: il sistema pull, il takt time e il flusso continuo, con l'heijunka come base [49]. In pratica, il JIT viene spesso ridotto alle consegne dei fornitori ("consegna JIT" o consegna sequenziata verso una linea automotive). Il significato inteso è un principio produttivo che mantiene volutamente basse le scorte, così che i problemi diventino visibili; la consegna just-in-time da parte dei fornitori è solo una delle sue applicazioni.

### Jidoka

Il jidoka, spesso tradotto come "autonomazione" o "automazione con tocco umano", dà a macchine e operatori la capacità di rilevare un'anomalia e interrompere immediatamente il lavoro [25]. La qualità è incorporata in ogni fase del processo e le persone non devono più sorvegliare le macchine. In pratica il jidoka segue una sequenza semplice: rilevare l'anomalia, fermarsi, reagire immediatamente e correggere la causa radice. I suoi strumenti principali sono andon e poka-yoke.

### Perché le fondamenta vengono prima

Molte implementazioni iniziano dal kanban perché è visibile e tangibile. Senza una domanda livellata (heijunka), lavoro standard e impianti stabili, però, il pull genera carenze e continue emergenze. I principi da 2 a 6 di Liker trattano flusso, pull, livellamento, fermata per risolvere i problemi e attività standardizzate come un unico pacchetto collegato; egli definisce gli standard la base del miglioramento continuo [10].

## Strumenti di Lean manufacturing: la cassetta degli attrezzi in sintesi

Gli strumenti Lean sono i mezzi per mettere in pratica i principi. La tabella li ordina per scopo, sforzo e tempistica. La valutazione dello sforzo è una stima basata sull'esperienza per uno stabilimento di medie dimensioni (qui: circa da 100 a 500 dipendenti) e dipende fortemente dal punto di partenza e dal perimetro.

| Strumento | Scopo | Sforzo | Quando usarlo |
|---|---|---|---|
| 5S | un posto di lavoro ordinato, sicuro e autoesplicativo | basso | come punto di partenza e base per tutti gli altri strumenti |
| Value stream mapping | rendere visibili i flussi di materiali e informazioni, quantificare gli sprechi | medio | all'inizio, per definire le priorità; poi annualmente |
| Takt time | allineare il ritmo produttivo alla domanda del cliente | basso | nella progettazione di linee e celle, quando cambia la domanda |
| Standard work | definire il metodo migliore noto, la base di partenza per il miglioramento | medio | non appena un processo è sufficientemente stabile |
| Line balancing | distribuire il contenuto di lavoro in modo uniforme tra le stazioni | medio | su linee di assemblaggio con più stazioni |
| SMED (cambio rapido) | ridurre i tempi di cambio, consentire lotti più piccoli | medio | quando i tempi di cambio determinano le dimensioni dei lotti e le scorte |
| Kanban | rifornimento guidato dal consumo | medio | per componenti usati regolarmente con domanda stabile |
| Sistema pull | limitare le scorte, prevenire la sovrapproduzione | da medio ad alto | dopo che processi e cambi sono stabili |
| Just-in-time | produzione sincronizzata con la domanda | alto | come stato obiettivo, raggiunto tramite takt, flusso e pull |
| Heijunka | livellamento della produzione per volume e mix | alto | con domanda fluttuante e molte varianti |
| Poka-yoke | prevenire i difetti o rilevarli immediatamente | da basso a medio | per errori ricorrenti di movimentazione e assemblaggio |
| Andon | rendere immediatamente visibili le anomalie, attivare una risposta rapida | da basso a medio | quando i problemi vengono segnalati troppo tardi |
| TPM | garantire la disponibilità e le prestazioni delle attrezzature | alto | quando le perdite OEE derivano da guasti, fermate minori, problemi di qualità |
| Kaizen / miglioramento continuo | miglioramento continuo a piccoli passi | basso per azione, alto per consolidare | in modo permanente, dal primo giorno |
| Risoluzione dei problemi A3 | risoluzione strutturata dei problemi su un foglio | da basso a medio | per problemi senza una causa evidente |
| Gemba walk | dirigenti sul campo, per comprendere il lavoro reale | basso | regolarmente, a ogni livello manageriale |
| Hoshin kanri | allineare la strategia fino al reparto produttivo | alto | una volta raggiunta una certa maturità, di solito al secondo anno |

I produttori statunitensi che desiderano un supporto esterno possono rivolgersi al NIST Manufacturing Extension Partnership (MEP). I suoi centri offrono servizi Lean tra cui value stream mapping, 5S, cambio rapido, flusso cellulare, kanban, Six Sigma e Toyota Kata; il NIST dichiara che la MEP National Network ha realizzato più di 80.000 progetti di lean manufacturing [60].

### 5S: l'organizzazione del posto di lavoro come fondamento

[5S](https://www.m365.fm/entity/5s/) è un metodo per organizzare il posto di lavoro in modo da rendere possibili il controllo visivo e le operazioni Lean. Il LEI elenca i cinque passi come segue [14]:

| Giapponese | Inglese | Contenuto |
|---|---|---|
| Seiri | Sort | eliminare dall'area di lavoro tutto ciò che è superfluo |
| Seiton | Set in order (Straighten) | disporre ciò che resta in modo che sia facile da trovare e da usare |
| Seiso | Shine | pulire l'area di lavoro, le attrezzature e gli utensili, e ispezionare durante la pulizia |
| Seiketsu | Standardize | mantenere ordine e pulizia attraverso standard |
| Shitsuke | Sustain | sviluppare la disciplina necessaria a mantenere in modo permanente i primi quattro passi |

Alcune aziende aggiungono una sesta S per la sicurezza ("6S") [14]. L'essenziale è che le 5S non sono una giornata di pulizie. Lo scopo è un posto di lavoro in cui ogni anomalia, come un utensile mancante o una perdita d'olio, viene notata immediatamente. Per questo Shine significa anche ispezione: chi pulisce una macchina trova bulloni allentati e perdite.

**Come procedere:** evento red-tag per gli elementi non necessari, pannelli di sagome e segnaletica a pavimento, un piano di pulizia e ispezione, uno standard 5S con foto dello stato obiettivo, audit 5S regolari condotti dai team stessi.

**Errori comuni:** 5S come evento una tantum, audit senza conseguenze, standard imposti dall'esterno anziché sviluppati dal team.

### Value stream mapping

[Mappatura del flusso del valore](https://www.m365.fm/entity/value-stream-mapping/) (VSM) mostra tutte le fasi del flusso di materiali e informazioni che un prodotto attraversa dall'ordine alla consegna [18]. Toyota utilizzava lo strumento con il nome di "diagramma del flusso di materiali e informazioni"; in Occidente è diventato noto attraverso il manuale LEI *Learning to See* di Mike Rother e John Shook, che nel 1999 ha ricevuto lo Shingo Research Prize [18][39].

**Fasi:**

1. **Scegliere una famiglia di prodotti:** raggruppare i prodotti con fasi di processo simili [18].
2. **Designare un responsabile:** una persona guida la mappatura e cura il flusso del valore [18].
3. **Mappare lo stato attuale:** dalla porta all'altra, percorrendo il flusso dei materiali a ritroso, dalla spedizione al ricevimento, con cronometro e taccuino sul posto. Per ogni processo registrare tempo di ciclo, tempo di cambio, tempo di funzionamento, numero di operatori e scorte davanti al processo.
4. **Aggiungere il flusso informativo:** come arrivano ai processi gli ordini dei clienti, i programmi e i segnali di controllo [18]?
5. **Disegnare la timeline:** confrontare i tempi di lavorazione con i tempi di attesa; questo dà il rapporto di flusso.
6. **Progettare lo stato futuro:** definire il takt, il flusso continuo dove possibile, supermercati e pull dove necessario, definire un processo pacemaker, livellare la produzione [18].
7. **Creare un piano d'azione:** strutturare i miglioramenti in cicli, fissare date e responsabili.

La LEI sottolinea che una "mappa dello stato attuale disegnata perfettamente non è lo scopo"; l'obiettivo è capire il flusso [18]. Per i lead time delle scorte si applica la legge di Little: lead time = scorte / throughput. Se davanti a una postazione ci sono 600 pezzi e il cliente ne consuma 300 al giorno, tale scorta equivale a due giorni di attesa. Gli strumenti digitali integrano la matita e la carta quando i flussi del valore devono essere valutati con varianti, capacità e scenari; maggiori dettagli nella sezione sugli strumenti digitali e nella [guida alla mappatura del flusso del valore](https://www.m365.fm/en/learn/value-stream-mapping/).

### Tempo takt

Il [tempo takt](https://www.m365.fm/entity/takt-time/) è il tempo di produzione disponibile diviso per la domanda del cliente [19]. Stabilisce il ritmo con cui un prodotto deve essere completato per corrispondere esattamente alla domanda. La parola deriva dal tedesco *Takt* (battuta, come nel metro musicale); l'industria aeronautica tedesca adottava il principio già negli anni Trenta, e Toyota lo diffuse ampiamente negli anni Cinquanta [19].

**Esempio svolto (secondo LEI):** Uno stabilimento lavora 480 minuti al giorno e il cliente richiede 240 pezzi al giorno. Tempo takt = 480 / 240 = 2 minuti [19].

Tenerlo separato dalle misure correlate:

| Misura | Definizione | Determinata da |
|---|---|---|
| Tempo takt | tempo disponibile / domanda del cliente | domanda |
| Tempo di ciclo | tempo effettivo che un processo impiega per completare un pezzo | capacità del processo |
| Lead time | tempo dall'ingresso di un pezzo all'uscita dal flusso del valore | flusso, scorte |

Se il tempo di ciclo di un processo è superiore al takt, non può soddisfare la domanda; se è molto inferiore, seguono sovrapproduzione o attese. Secondo la LEI, Toyota di norma rivede il takt di un processo mensilmente e apporta piccoli aggiustamenti ogni dieci giorni [19].

### Lavoro standard

Il [lavoro standard](https://www.m365.fm/entity/standard-work/) (lavoro standardizzato) definisce il metodo di lavoro esatto per ogni operatore in un processo e, una volta esposto, diventa la base di partenza per il kaizen [17]. Ha tre elementi [17]:

1. **Tempo takt:** il ritmo a cui la produzione deve procedere.
2. **Sequenza di lavoro:** l'ordine esatto delle attività entro il tempo takt.
3. **Scorta standard:** lo stock in lavorazione, compresi i pezzi nelle macchine, necessario per un funzionamento regolare.

La LEI indica tre forme: la scheda di capacità di processo, la tabella di combinazione del lavoro standardizzato (tempo manuale, tempo di spostamento, tempo macchina) e il grafico del lavoro standardizzato con i percorsi di spostamento [17]. Il lavoro standard non è un regolamento rigido. Descrive il metodo migliore oggi noto ed è migliorato dalle persone che svolgono il lavoro. Liker lo esprime così: le attività standardizzate sono le fondamenta del miglioramento continuo e dell'empowerment dei dipendenti [10]. Il metodo TWI Job Instruction descritto nella sezione storica, che scompone un lavoro in fasi e punti chiave, è un modo pratico per addestrarlo [59].

**Errori comuni:** istruzioni di lavoro di 30 pagine invece di un'unica pagina visiva, standard senza un collegamento al takt, nessun processo per modificare gli standard.

### Bilanciamento di linea

[Line balancing](https://www.m365.fm/entity/line-balancing/) distribuisce il contenuto di lavoro tra postazioni od operatori in modo che ogni postazione si avvicini il più possibile al takt time senza superarlo. Lo strumento centrale è il grafico di bilanciamento degli operatori (detto anche grafico yamazumi): ogni persona è rappresentata da una barra di elementi di lavoro impilati e confrontata con il takt time [24].

**Esempio svolto (illustrativo):** un turno dura 7,5 ore, quindi 27.000 secondi di tempo disponibile; la domanda è di 450 unità. Takt time = 27.000 / 450 = 60 secondi. Gli elementi di lavoro sommano 99 secondi (A = 25, B = 20, C = 14, D = 22, E = 18). Il fabbisogno minimo di personale è 99 / 60 = 1,65, quindi due persone. La persona 1 esegue A, B e C (59 secondi), la persona 2 esegue D ed E (40 secondi). Il grafico rende visibili i 20 secondi di tempo improduttivo della persona 2; il passo successivo è ridurre gli sprechi per la persona 1 o redistribuire il lavoro in modo sensato. Secondo la LEI, l'obiettivo è redistribuire gli elementi di lavoro in modo che il carico di ciascun operatore sia vicino al takt time, ma inferiore ad esso [24].

Completano l'esempio due note pratiche. In primo luogo, molti stabilimenti non pianificano sul takt time pieno, ma su un tempo ciclo pianificato leggermente più breve, per assorbire la variabilità e i piccoli disturbi; con 59 secondi su 60, la persona 1 non ha praticamente alcuna riserva. In secondo luogo, il tempo improduttivo è deliberatamente concentrato sull'ultima persona invece di essere distribuito uniformemente. Così resta visibile e, se un kaizen riduce il contenuto di lavoro di 20 secondi, la postazione potrà essere accorpata in seguito. Il tempo improduttivo distribuito uniformemente scompare nel lavoro e viene spesso riempito con un ritmo più lento.

### SMED: cambio rapido passo dopo passo

SMED sta per "single-minute exchange of die", cioè cambi d'attrezzaggio in minuti a una sola cifra, sotto i dieci minuti [12]. Shigeo Shingo (1909–1990) sviluppò le intuizioni chiave negli anni Cinquanta e Sessanta [12], tra l'altro presso Toyo Kogyo (oggi Mazda) nel 1950, presso Mitsubishi Heavy Industries nel 1957 e presso Toyota dal 1969, dove i cambi delle presse scesero da una a due ore a pochi minuti [11]. Pubblicò il metodo in inglese nel 1985 con il titolo *A Revolution in Manufacturing: The SMED System* [11].

Perché [SMED](https://www.m365.fm/entity/smed/) è così importante per il lean: i [tempi di attrezzaggio](https://www.m365.fm/entity/setup-time/) lunghi portano a lotti grandi, i lotti grandi a scorte elevate e lunghi lead time. Cambi brevi rendono economici i lotti piccoli e sono proprio ciò che rende possibili il flusso e l'heijunka.

**SMED in sei passi:**

1. **Registrare il cambio attuale:** filmare l'intero cambio, dall'ultimo pezzo buono dell'ordine vecchio al primo pezzo buono di quello nuovo. Annotare ogni attività con la sua durata.
2. **Separare attrezzaggio interno ed esterno:** l'attrezzaggio interno può essere eseguito solo a macchina ferma (per esempio il montaggio della nuova matrice); l'attrezzaggio esterno può essere eseguito mentre la macchina lavora (per esempio la preparazione della matrice) [12]. Questa sola separazione spesso riduce sensibilmente i fermi, perché la ricerca e il recupero escono dal tempo di fermo.
3. **Trasformare l'attrezzaggio interno in esterno:** spostare fuori dalla fase di fermo il maggior numero possibile di attività interne [12], per esempio preriscaldando le matrici, usando attrezzature preimpostate o standardizzando le altezze delle matrici.
4. **Snellire l'attrezzaggio interno:** morsetti rapidi al posto dei bulloni, perni di centraggio al posto delle regolazioni, due persone che lavorano in parallelo, eliminazione delle regolazioni.
5. **Snellire l'attrezzaggio esterno:** carrelli per il cambio, liste di controllo, postazioni fisse di preparazione secondo le 5S.
6. **Standardizzare ed esercitarsi:** documentare il nuovo cambio come lavoro standard, formare il personale e misurarlo; poi il ciclo ricomincia.

**Errori comuni:** investire in hardware costoso prima di aver esaurito i passi organizzativi da 1 a 3; non trasformare i guadagni sui cambi in lotti più piccoli, così le scorte restano invariate.

### Kanban

Un kanban è un segnale che innesca e controlla la produzione o lo spostamento dei componenti in un sistema pull; la parola giapponese significa "segnale" o "cartello" [15]. I kanban possono essere cartellini, piastre metalliche, palline colorate o segnali elettronici; un cartellino tipico riporta nome e numero del componente, fornitore, quantità del contenitore e ubicazioni di stoccaggio e di utilizzo [15].

La LEI distingue due tipi fondamentali [15]:

- **Kanban di produzione:** indica al processo a monte cosa e quanto produrre. Nel caso più semplice, una scheda equivale a un contenitore. Per i processi con lunghi cambi formato, come lo stampaggio, un kanban di segnale avvia la produzione solo quando viene raggiunto un livello minimo di scorta.
- **Kanban di prelievo (kanban di movimento):** autorizza lo spostamento dei componenti verso il processo a valle, internamente tra processi oppure come kanban di fornitore con fornitori esterni, sempre più in forma elettronica sulle lunghe distanze.

**Le sei regole del kanban di Toyota (Ohno 1988):** Ohno descrive sei regole nel suo libro [7][51]:

1. Il processo a valle preleva dal processo a monte esattamente la quantità indicata dal kanban.
2. Il processo a monte produce nella quantità e nella sequenza indicate dal kanban.
3. Non si produce né si sposta nulla senza un kanban.
4. Il kanban è sempre applicato al componente o al contenitore.
5. I pezzi difettosi non vengono passati al processo a valle.
6. Il numero di kanban viene ridotto gradualmente; in questo modo il sistema diventa più sensibile e fa emergere i problemi.

**Esempio svolto: numero di kanban (a scopo illustrativo):** Una formula di base comune è: numero di kanban = domanda per periodo × tempo di approvvigionamento × (1 + fattore di sicurezza) / quantità per contenitore. Se un'area di montaggio utilizza 400 pezzi al giorno, il rifornimento dal processo a monte richiede mezza giornata, il fattore di sicurezza è del 10 per cento e un contenitore contiene 50 pezzi, il risultato è 400 × 0,5 × 1,1 / 50 = 4,4, quindi cinque kanban. Questo limita l'anello a 250 pezzi, poco più di mezza giornata di domanda. Se in seguito lo SMED dimezza il tempo di rifornimento, il numero di kanban può essere ridotto secondo lo spirito della regola 6, in questo esempio da cinque a tre.

**Quando il kanban non è adatto:** con domanda altamente volatile, componenti usati molto raramente o componenti unici specifici per il cliente. In questi casi spesso sono più adatte le corsie FIFO, il controllo a ordini o il CONWIP.

### Sistemi pull e supermercati

Un sistema pull limita le scorte tra due processi e lascia che sia il processo a valle a dettare il ritmo [5]. Esistono tre forme fondamentali: il sistema pull a supermercato (si riapprovvigiona ciò che è stato prelevato), il sistema pull sequenziale (produzione su ordine in sequenza, limitata da corsie FIFO) e forme miste. Un supermercato è una scorta controllata con quantità massime e minime definite, dalla quale il processo a valle effettua i prelievi. Il pull è l'opposto della pianificazione centralizzata per ogni singola stazione: solo un processo pacemaker riceve il programma, e tutti i processi a monte seguono i segnali kanban. Negli stabilimenti statunitensi questo significa spesso che il sistema MRP/ERP continua a pianificare materiali e capacità, mentre il programma del pacemaker e i circuiti kanban determinano ciò che viene effettivamente realizzato ogni giorno.

### Heijunka: produzione livellata

[Heijunka](https://www.m365.fm/entity/heijunka/) livella tipo e quantità della produzione su un periodo fisso [16]. Questo riduce scorte, capitale immobilizzato, fabbisogno di personale e tempo di attraversamento, perché i processi a monte non devono essere dimensionati per i picchi.

**Livellamento per volume (esempio secondo LEI):** Un produttore riceve 500 ordini a settimana, distribuiti in modo irregolare: 200 il lunedì, 100 il martedì, 50 il mercoledì, 100 il giovedì e 50 il venerdì. Invece di seguire questa variazione, mantiene un piccolo buffer di prodotti finiti e produce un ritmo costante di 100 unità al giorno [16].

**Livellamento per mix (esempio secondo LEI):** Con una domanda settimanale di 5 × A, 3 × B, 2 × C e 2 × D, un produttore di massa realizza la sequenza "A A A A A B B B C C D D", mentre un produttore snello realizza "A A B C D A A B C D A B" [16].

Lo strumento per questo è la heijunka box, una pianificazione visiva con i tipi di prodotto sull'asse verticale e gli intervalli temporali sull'asse orizzontale [16]. La larghezza di un intervallo corrisponde di solito al pitch, il tempo per un contenitore: con un takt time di un minuto e 20 pezzi per contenitore, il pitch è di 20 minuti [55]. In un turno con 450 minuti di tempo disponibile, la heijunka box ha quindi 22 slot per riga, e ogni 20 minuti un addetto alla movimentazione preleva il kanban successivo. Questo mostra anche a colpo d'occhio se la linea è in orario. I cambi formato rapidi sono un presupposto: la sequenza mista dell'esempio sopra richiede circa dieci cambi di tipo per ciclo con quattro varianti, cosa economicamente sostenibile solo con lo SMED.

### Poka-yoke: prevenire i difetti invece di ispezionarli

[Poka-yoke](https://www.m365.fm/entity/poka-yoke/) (prevenzione degli errori) indica dispositivi semplici ed economici che impediscono errori come usare il componente sbagliato, dimenticare un componente o montare un componente al contrario; "poka" significa errore involontario e "yoke" evitamento [13]. L'obiettivo è la qualità al 100 percento, intercettando gli errori alla fonte [13]. Il poka-yoke è attribuito a Shigeo Shingo [11].

Il LEI distingue due tipi [13]:

- **Poka-yoke di arresto:** impedisce l'errore, ad esempio quando una macchina non si avvia finché un pezzo è caricato in modo errato. Il LEI lo considera la forma più efficace [13].
- **Poka-yoke di segnalazione:** avvisa l'operatore di un'anomalia con un suono o una luce.

**Esempi in reparto:**

- componenti la cui geometria consente il montaggio solo nell'orientamento corretto [13]
- barriere fotoelettriche sui contenitori dei componenti che sbloccano la linea solo dopo che l'operatore ha raggiunto tutti i contenitori richiesti; sistemi più avanzati verificano anche la corretta combinazione di componenti per ogni variante [13]
- attrezzature con perni di posizionamento che accettano solo la variante corretta
- avvitatori dinamometrici che contano le viti e bloccano il passaggio successivo finché una manca
- connettori che si inseriscono in un solo verso

**Esempi quotidiani** (dal LEI): lavatrici che non partono con lo sportello aperto; tosaerba che funzionano solo mentre si tiene premuta la barra di sicurezza; seghe da banco con arresto automatico [13].

Secondo il LEI, le buone soluzioni di poka-yoke sono semplici, durevoli e a bassa manutenzione, altamente affidabili, economiche e progettate per la specifica situazione di lavoro [13]. Shingo distingueva anche tre metodi di rilevamento [50]: il metodo di contatto verifica caratteristiche fisiche come forma, dimensione o colore (ad esempio un perno di posizionamento). Il metodo a valore fisso segnala quando non è stato raggiunto un numero prestabilito di movimenti (ad esempio l'avvitatore che conta). Il metodo a sequenza di movimenti verifica se le fasi prescritte sono state eseguite nell'ordine corretto.

### Andon: rendere immediatamente visibili i problemi

Andon (in giapponese "lampada") è uno strumento di controllo visivo che mostra a colpo d'occhio lo stato di un'area e segnala il verificarsi di un'anomalia [23]. Una configurazione tipica è un pannello sopra la linea in cui si accende il numero della postazione quando un sensore rileva un problema o un operatore tira una corda o preme un pulsante; il capo squadra interviene immediatamente [23].

Sulle linee di montaggio finale di Toyota, la linea non si ferma nel momento in cui viene tirata la corda, ma solo quando il veicolo raggiunge una posizione fissa alla fine della postazione (arresto in posizione fissa). Se la squadra riesce a risolvere il problema entro il takt, la linea continua a funzionare; altrimenti si ferma in quella posizione. I difetti non vengono trasferiti e le fermate restano brevi [23].

**Presupposto per l'andon:** una cultura di leadership in cui tirare la corda sia accolto con favore. Se le persone vengono criticate per le fermate di linea, si smettono di ricevere segnalazioni e si iniziano a ricevere problemi nascosti.

### TPM: manutenzione produttiva totale

Il [TPM](https://www.m365.fm/entity/total-productive-maintenance/) è un insieme di attività che garantisce che ogni macchina di un processo possa sempre svolgere il compito richiesto [20]. Secondo il LEI, "total" significa tre cose: coinvolgimento di tutti i dipendenti, attenzione alla produttività totale degli impianti e considerazione dell'intero ciclo di vita [20]. A differenza della manutenzione preventiva classica, il TPM coinvolge gli operatori nella manutenzione ordinaria, nei miglioramenti e nelle riparazioni semplici. Il LEI indica Denso, parte del gruppo Toyota, come pioniera [20].

Il TPM mira a sei grandi perdite che incidono direttamente sull'OEE [21]:

| Fattore OEE | Perdita | Esempio |
|---|---|---|
| Disponibilità | guasti | avaria idraulica |
| Disponibilità | attrezzaggio e regolazione | cambio stampo, avviamento |
| Prestazione | fermate minori | componente inceppato, intervento di un sensore |
| Prestazione | riduzione di velocità | macchina che funziona più lenta del nominale |
| Qualità | scarti | pezzi non utilizzabili |
| Qualità | rilavorazione | pezzi da correggere |

Il TPM è stato formalizzato in Giappone dal Japan Institute of Plant Maintenance (JIPM) [52]. Una rappresentazione comune utilizza otto pilastri [52]: miglioramento focalizzato (kobetsu kaizen), manutenzione autonoma da parte degli operatori (pulizia, ispezione, lubrificazione), manutenzione pianificata, formazione e istruzione, manutenzione della qualità, gestione precoce delle apparecchiature per i nuovi impianti, sicurezza, salute e ambiente, e TPM in amministrazione. Per iniziare, di solito bastano i primi tre; gli altri seguono con la crescita della maturità.

**Esempio svolto: fattori OEE (a scopo illustrativo):** Una macchina è programmata per 450 minuti in un turno e resta ferma per 45 minuti a causa di guasti e cambi formato: disponibilità = 405 / 450 = 90%. Con un tempo di ciclo ideale di 0,5 minuti, in 405 minuti erano possibili 810 pezzi; ne sono stati prodotti 770: prestazione = 770 / 810 = 95%. Di questi, 762 sono pezzi buoni: qualità = 762 / 770 = 99%. Senza arrotondamenti, l'OEE è 84,7%; come verifica: 762 pezzi buoni × 0,5 minuti / 450 minuti = 84,7%. Si tratta quasi dell'esempio LEI della sezione KPI, ma mostra quali perdite costano quanti minuti.

### Kaizen e miglioramento continuo

Kaizen (giapponese, più o meno "cambiamento in meglio") indica il miglioramento continuo, a piccoli passi, da parte di tutti i collaboratori. Il termine si è diffuso in Occidente grazie a Masaaki Imai, il cui libro *Kaizen: The Key to Japan's Competitive Success* è uscito nel 1986; Imai ha fondato il Kaizen Institute nel 1985 [35]. Negli stabilimenti statunitensi il programma di solito si chiama continuous improvement (CI); negli stabilimenti tedeschi si chiama KVP (*kontinuierlicher Verbesserungsprozess*).

Esistono due forme:

- **Kaizen quotidiano:** piccoli miglioramenti all'interno del team, spesso tramite schede di proposta sulla lavagna di reparto, attuati nel giro di pochi giorni.
- **Evento kaizen (kaizen blitz, rapid improvement event):** un team interfunzionale migliora un'area chiaramente delimitata in breve tempo, ad esempio un layout o un cambio formato. Secondo il LEI, questi workshop durano di solito cinque giorni; il LEI avverte però di non affidarsi solo agli eventi, perché la capacità di risolvere i problemi in reparto cresce solo con il kaizen quotidiano [53].

Il metodo si basa sul ciclo PDCA (plan, do, check, act), che risale a Shewhart ed è stato diffuso da Deming [29]. Il punto di partenza è sempre uno standard: senza uno standard non c'è un metro con cui misurare un miglioramento.

### Risoluzione dei problemi con il report A3

Il report A3 è una pratica Toyota che raccoglie problema, analisi, contromisure e piano d'azione su un unico foglio A3 (297 × 420 mm; gli stabilimenti statunitensi usano di solito il formato simile 11 × 17 in., tabloid) [22]. Il LEI sottolinea che l'A3 è innanzitutto un processo di gestione, non solo un documento [22]. Ulteriori informazioni sul metodo sono nella pagina dell'entità [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/).

**Struttura tipica (a sinistra: problema, a destra: soluzione):**

1. Contesto e perché il tema è importante
2. Situazione attuale con fatti e dati dal gemba
3. Obiettivo (misurabile, con una data)
4. Analisi delle cause radice (come 5 Perché, diagramma a lisca di pesce/Ishikawa)
5. Contromisure, da più opzioni alla migliore
6. Piano d'azione: chi fa cosa e entro quando
7. Verifica: prova dell'effetto e standardizzazione

La struttura segue chiaramente il ciclo PDCA. Il LEI indica esplicitamente un responsabile le cui iniziali compaiono sull'A3 [22]. Il vero valore sta nel dialogo: il leader fa coaching attraverso l'A3 invece di consegnare soluzioni già pronte.

### Gemba walk

*Gemba* in giapponese significa "il luogo reale"; nel lean indica il luogo in cui si crea valore [26]. Secondo il LEI, il [gemba walk](https://www.m365.fm/entity/gemba-walk/) è una pratica di gestione per comprendere la situazione attuale attraverso l'osservazione diretta e le domande, prima di intraprendere un'azione [26]. Il LEI raccomanda di seguire un prodotto o un processo dall'inizio alla fine, insieme a tutte le persone coinvolte, e di porsi tre domande: qual è lo scopo del processo, come viene effettivamente svolto il lavoro, e le persone sono coinvolte [26]? Una guida pratica è [What Is a Gemba Walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/); la routine è trattata più a fondo nella [guida allo shop floor management](https://www.m365.fm/en/learn/shop-floor-management/).

### Hoshin kanri

Hoshin kanri (policy deployment, talvolta chiamato strategy deployment) è un modello strategico che allinea verticalmente gli obiettivi aziendali dalla direzione fino al reparto e orizzontalmente tra i vari reparti, basandosi sul PDCA [27]. Il LEI raccomanda di combinare hoshin e A3 in modo che ogni livello lavori sulle priorità definite tramite hoshin [27]. Per chi inizia, l'hoshin kanri di solito non è il punto di partenza ma la fase in cui il lean passa dai singoli progetti al modo in cui l'azienda è gestita, secondo la nostra esperienza dopo uno-due anni [unverified: stima di un professionista del settore].

## Lean vs. Six Sigma vs. Lean Six Sigma

Lean e Six Sigma vengono spesso citati insieme, ma hanno priorità diverse. Lean punta al flusso e all'eliminazione degli sprechi; Six Sigma punta alla riduzione della variabilità e dei difetti con metodi statistici. Secondo la versione più diffusa, Six Sigma è stato sviluppato in Motorola a metà degli anni Ottanta [58]; Motorola ha ricevuto il Malcolm Baldrige National Quality Award nel 1988, e il profilo del premio descrive Six Sigma come un obiettivo di non più di 3,4 difetti per milione [45]. ASQ definisce la prestazione di qualità Six Sigma come 3,4 difetti per milione di opportunità, tenendo conto di uno spostamento della media di 1,5 sigma [28].

| Caratteristica | Lean | Six Sigma | Lean Six Sigma |
|---|---|---|---|
| Domanda centrale | Dove il processo non scorre, dove si genera spreco? | Perché il processo varia, da dove provengono i difetti? | entrambe, a seconda del tipo di problema |
| Origine | Toyota Production System [1] | Motorola [45][58] | combinazione di entrambi |
| Approccio | PDCA, kaizen, progettazione del flusso del valore | DMAIC: define, measure, analyze, improve, control [28] | DMAIC con strumenti lean |
| Strumenti | 5S, kanban, SMED, standard work, VSM | controllo statistico di processo, disegno degli esperimenti, analisi di regressione e di capability | combinazione |
| Organizzazione | tutti i dipendenti, miglioramento quotidiano | esperti in ruoli (belt), lavoro per progetti | struttura a belt più ampia partecipazione |
| Orizzonte temporale | da giorni a settimane per ogni miglioramento | tipicamente diversi mesi per progetto [unverified: durata non confermata per tutti i casi] | misto |
| Punto di forza | rapido, visibile, partecipativo | preciso per problemi di qualità complessi | ampia gamma di problemi |
| Rischio | attivismo sugli strumenti senza dati | progetti di esperti senza ampio impatto | sovraccarico da strutture duplicate |

### DMAIC in breve

1. **Define:** definire il problema, i requisiti del cliente e il perimetro del progetto.
2. **Measure:** misurare le prestazioni di partenza, verificare il sistema di misura.
3. **Analyze:** dimostrare le cause con i dati.
4. **Improve:** sviluppare, testare e implementare le soluzioni.
5. **Control:** mantenere il miglioramento, ad esempio con carte di controllo e standard [28].

### I ruoli delle belt

Six Sigma organizza il miglioramento attraverso ruoli che prendono il nome dai gradi delle arti marziali. Secondo ASQ, le Black Belt sono figure chiave con un'ampia formazione in statistica avanzata e gestione di progetto [28]. Diffusi anche nella pratica sono le Yellow Belt (conoscenze di base, membri del team di progetto), le Green Belt (guidano progetti più piccoli affiancando il proprio lavoro abituale), le Master Black Belt (coaching, responsabilità sul metodo) e i Champion (dirigenti che sponsorizzano i progetti). I ruoli e le ore di formazione non sono standardizzati a livello internazionale; contenuti e durata variano in base al fornitore. Negli Stati Uniti, ASQ è uno dei diversi enti che certificano le belt.

**Regola pratica:** se la causa di un problema è visibile nel flusso di lavoro (attese, ricerche, scorte), gli strumenti lean aiutano più rapidamente. Se la causa è nascosta e dipende dai dati (variabilità di una quota, difetti sporadici), un progetto [Lean Six Sigma](https://www.m365.fm/entity/lean-six-sigma/) con DMAIC è la scelta giusta. Un confronto dettagliato è disponibile in [Lean vs. Six Sigma: Differences and How to Combine Them](https://www.m365.fm/community/u/mirko-p/blog/lean-vs-six-sigma-differences-combine/).

## Leadership e cultura lean

La sostenibilità del lean dipende meno dagli strumenti che dalla leadership. La struttura del libro di Liker *The Toyota Way* (2004) già lo indica: dei 14 principi, solo sette riguardano il processo in senso stretto; gli altri riguardano filosofia, persone e problem solving [10].

| Sezione secondo Liker [10] | Principi (in sintesi) |
|---|---|
| Filosofia di lungo periodo | 1. basare le decisioni manageriali su una filosofia di lungo periodo, anche a scapito degli obiettivi finanziari di breve termine |
| Il processo giusto produrrà i risultati giusti | 2. creare un flusso continuo per far emergere i problemi; 3. usare sistemi pull per evitare la sovrapproduzione; 4. livellare il carico di lavoro; 5. costruire una cultura di fermata per risolvere i problemi; 6. i compiti standardizzati sono la base del miglioramento; 7. usare il controllo visivo; 8. usare solo tecnologia affidabile e ampiamente testata |
| Sviluppare le persone e i partner | 9. far crescere leader che comprendano il lavoro e lo sappiano insegnare; 10. sviluppare persone e team eccezionali; 11. rispettare i propri partner e fornitori sfidandoli e aiutandoli |
| Problem solving continuo | 12. andare a vedere di persona (genchi genbutsu); 13. decidere lentamente per consenso, attuare rapidamente; 14. diventare un'organizzazione che apprende attraverso la riflessione (hansei) e il miglioramento continuo |

### Cosa fanno diversamente i leader lean

- **Vanno dove si svolge il lavoro:** le decisioni si basano sulla propria osservazione al gemba, non solo sui report [10][26].
- **Chiedono invece di dire:** il leader sviluppa la capacità di problem solving, ad esempio attraverso il coaching A3 [22].
- **Rendono visibili i problemi e premiano la segnalazione:** l'andon funziona solo se una fermata di linea viene considerata un contributo, non un disturbo [23].
- **Guidano con gli standard:** le deviazioni dallo standard attivano il problem solving, non la ricerca di colpevoli.
- **Allineano gli obiettivi:** attraverso l'hoshin kanri collegano la strategia aziendale al miglioramento quotidiano [27].

### Shop floor management come strumento di leadership

La maggior parte degli stabilimenti ancora la leadership lean allo shop floor management, spesso chiamato negli Stati Uniti sistema di gestione quotidiana a livelli: brevi riunioni giornaliere davanti a lavagne visive con indicatori di sicurezza, qualità, consegna e costo (SQDC), una cascata di escalation su più livelli (team, area, stabilimento) e un follow-up costante delle azioni. Lo shop floor management è il punto in cui standard, segnali andon e idee kaizen si incontrano. Il metodo è trattato in profondità nella [guida allo shop floor management](https://www.m365.fm/en/learn/shop-floor-management/).

### Il lean oltre il reparto produttivo

I principi sono trasferibili alle funzioni d'ufficio come l'evasione degli ordini, la pianificazione della produzione, gli acquisti o l'ingegneria (lean office, lean product development). Qui il flusso di valore è un flusso di informazioni: un preventivo, una modifica ingegneristica o una fattura "stanno" in caselle di posta e cicli di approvazione invece che in buffer. Gli strumenti tipici sono le analisi di processo e le swimlane, le lavagne visive di team, la standardizzazione dei compiti ricorrenti e i limiti al lavoro in corso (WIP). Questo ha un effetto diretto sulla produzione, perché gran parte del lead time di un ordine cliente si crea spesso prima della prima operazione di reparto.

**Lean verde:** il *Lean & Environment Toolkit* (2016) dell'Environmental Protection Agency statunitense aiuta gli specialisti di lean e ambiente a individuare gli sprechi in termini di consumo di energia, acqua e materiali e a eliminare gli sprechi ambientali come parte del normale lavoro lean [61]. Un modo semplice per iniziare è aggiungere colonne per energia, acqua e materiali alle data box di una mappa del flusso di valore allo stato attuale.

### Rispetto per le persone

Gestire il lean come un programma di riduzione dei costi con un vocabolario giapponese significa sprecare la risorsa più importante. Uno stabilimento che trasforma regolarmente i guadagni di produttività in licenziamenti perde la disponibilità della forza lavoro a far emergere gli sprechi. Un approccio comune è quindi un impegno, all'avvio del programma, che nessuno perderà il posto di lavoro a causa dei miglioramenti lean; la capacità liberata viene destinata alla crescita, all'internalizzazione di attività o a team di miglioramento.

Le relazioni sindacali fanno parte della progettazione, e le regole variano da paese a paese:

- **Stabilimenti statunitensi sindacalizzati:** standard, variazioni di organico, contenuti del lavoro e nuove metriche possono toccare il contratto collettivo di lavoro. Coinvolgere il sindacato in anticipo; NUMMI ha dimostrato che il lean può funzionare con una forza lavoro rappresentata dall'UAW [56].
- **Stabilimenti statunitensi non sindacalizzati:** i comitati permanenti di dipendenti che discutono con la direzione di salari, orari o condizioni di lavoro possono sollevare questioni ai sensi della Sezione 8(a)(2) del National Labor Relations Act, che vieta al datore di lavoro di dominare organizzazioni sindacali. In *Electromation, Inc. v. NLRB* (1994), il Seventh Circuit ha confermato tale constatazione per i "comitati d'azione" costituiti dal datore di lavoro, sottolineando però che la sua decisione era limitata a quei comitati e riconoscendo la crescente importanza del coinvolgimento dei dipendenti [62]. Se un team permanente di miglioramento rientri in questa fattispecie dipende dal suo statuto e da ciò che discute, perciò far esaminare lo statuto da un consulente legale in materia di lavoro prima dell'avvio.
- **Sicurezza:** ridurre il muri è anche un compito di sicurezza. L'OSHA descrive i disturbi muscoloscheletrici correlati al lavoro come prevenibili e definisce l'ergonomia come "adattare il lavoro alla persona" [63]; il rischio ergonomico va inserito in ogni foglio di lavoro standard e in ogni modifica del takt.
- **Stabilimenti tedeschi:** standard, metriche e sistemi tecnici che possano monitorare prestazioni o comportamenti richiedono il coinvolgimento anticipato del consiglio di fabbrica (*Betriebsrat*), che ha diritti di codeterminazione ai sensi della legge tedesca sulla costituzione aziendale (Betriebsverfassungsgesetz). Le aziende statunitensi con siti in Germania dovrebbero prevederlo nel piano di implementazione globale.

## Come implementare il lean manufacturing: una roadmap in cinque fasi

Non esiste una ricetta standard, ma esiste uno schema collaudato: partire in piccolo, imparare in un'area pilota, stabilizzare i risultati, poi estendere. La roadmap seguente è una guida per uno stabilimento di medie dimensioni; le tempistiche sono stime derivanti dalla pratica [unverified: stime basate sull'esperienza di settore, non su dati verificati] e dipendono da dimensioni, punto di partenza e risorse.

| Fase | Tempistica (indicativa) | Obiettivi | Risultati attesi |
|---|---|---|---|
| 0. Preparazione | mese 1 | chiarire l'obiettivo e il perché, allineare la leadership, coinvolgere sindacato o rappresentanti dei dipendenti | visione lean, comitato di guida, coordinatore lean nominato |
| 1. Diagnosi | mesi 1–2 | comprendere lo stato attuale, quantificare gli sprechi | mappe del flusso del valore delle principali famiglie di prodotto, baseline dei KPI, area pilota scelta |
| 2. Pilota | mesi 3–6 | far funzionare gli strumenti in un'area | 5S, lavoro standard, lavagna di reparto, SMED sul collo di bottiglia, primi eventi kaizen, miglioramento misurabile |
| 3. Stabilizzare e standardizzare | mesi 6–9 | consolidare il pilota, derivare uno standard lean per lo stabilimento | sistema produttivo documentato (principi, strumenti, ruoli), piano di formazione, audit |
| 4. Estensione | mesi 9–12 e oltre | altri flussi del valore, pull e livellamento, hoshin kanri | riunioni a più livelli in tutto lo stabilimento, anelli pull, cascata degli obiettivi |

### Scegliere l'area pilota

L'area pilota determina la credibilità dell'intero programma. Criteri collaudati:

- [ ] **Rilevanza:** l'area incide su una metrica importante (collo di bottiglia, consegne, qualità).
- [ ] **Ambito gestibile:** una linea o una cella con una famiglia di prodotti chiaramente delimitata.
- [ ] **Leadership:** un capoturno che desideri il cambiamento.
- [ ] **Visibilità:** i risultati sono visibili e trasferibili ad altre aree.
- [ ] **Fattibilità:** nessun grande progetto parallelo, come spostamenti di macchinari o go-live dell'ERP.
- [ ] **Misurabilità:** esistono valori di baseline per lead time, OEE, qualità e scorte, o possono essere raccolti rapidamente.

### Strumenti nell'ordine giusto

Una sequenza che spesso funziona: stabilità prima del flusso, flusso prima del pull, pull prima del livellamento.

1. **Stabilità:** 5S, lavoro standard, basi del TPM, lavagna di reparto, problem solving.
2. **Flusso:** progettazione del flusso del valore, layout di flusso, bilanciamento di linea, SMED, lotti più piccoli.
3. **Pull:** supermarket, kanban, corsie FIFO, processo pacemaker.
4. **Livellamento:** heijunka, sequenze a modelli misti, controllo basato sul takt.
5. **Allineamento:** hoshin kanri, lean nelle funzioni d'ufficio, sviluppo dei fornitori.

### Ruoli durante l'implementazione

| Ruolo | Responsabilità |
|---|---|
| Team dirigenziale / direttore di stabilimento | visione, risorse, presenza personale al gemba, presidenza del comitato di indirizzo |
| Coordinatore Lean (CI manager, lean manager) | competenza metodologica, formazione, coaching, gestione del programma |
| Responsabili di area e capiturno | leadership quotidiana con gli standard, riunioni a livelli, escalation |
| Team di produzione | applicano gli standard, segnalano le anomalie, implementano le idee kaizen |
| Manutenzione, logistica, qualità | supporto a TPM, cicli pull, problem solving |
| Rappresentanti sindacali o dei dipendenti (consiglio di fabbrica in Germania) | contributo su standard, metriche, orario di lavoro e questioni di carico di lavoro |
| EHS (ambiente, salute e sicurezza) | verifica ergonomica e di sicurezza di nuovi standard e layout |

**Supporto esterno negli USA:** La NIST MEP National Network, con oltre 450 sedi di servizio e partnership in tutti i 50 stati e a Porto Rico, si concentra sulle piccole e medie imprese manifatturiere statunitensi e offre formazione lean e supporto all'implementazione [60][65]. L'Association for Manufacturing Excellence (AME), che dichiara di essere nata dal movimento lean, organizza conferenze ed eventi per i professionisti [66]; lo Shingo Institute valuta le organizzazioni in base allo Shingo Model [64]; il Lean Enterprise Institute pubblica il lessico e i quaderni di lavoro citati in tutta questa guida [5][39].

## KPI Lean: come misurare i progressi

Il successo lean si vede da alcune metriche significative. Più importante del numero di indicatori monitorati è che questi vengano discussi ogni giorno in reparto. La [guida ai KPI manifatturieri](https://www.m365.fm/en/learn/manufacturing-kpis/) approfondisce l'argomento.

| KPI | Formula o definizione | Cosa indica | Collegamento Lean |
|---|---|---|---|
| Lead time | tempo dal ricevimento del materiale alla spedizione, ad es. scorta / throughput (legge di Little) | Con quale rapidità fluisce un ordine? | flusso, pull |
| Rapporto di flusso (process cycle efficiency) | tempo di lavorazione / lead time | quota di tempo a valore aggiunto | flusso del valore |
| OEE (overall equipment effectiveness) | disponibilità × prestazione × qualità [21] | Quanto è produttivo l'impianto? | TPM, SMED |
| Giorni di copertura | scorta / domanda media giornaliera | Per quanti giorni la scorta copre la domanda? | pull, kanban |
| First pass yield (FPY) | pezzi buoni al primo passaggio / pezzi prodotti | qualità senza rilavorazioni | jidoka, poka-yoke |
| On-time in-full (OTIF) | ordini consegnati in tempo e completi / tutti gli ordini | visione del cliente | takt, heijunka |
| Tempo di attrezzaggio | ultimo pezzo buono del vecchio modello al primo pezzo buono del nuovo | flessibilità | SMED |
| Produttività | output / ore di lavoro | efficienza | standard work, bilanciamento di linea |
| Sicurezza | incidenti registrabili e quasi incidenti per periodo (negli USA, spesso il tasso di infortuni registrabili OSHA) | tutela delle persone | 5S, standard work |
| Miglioramenti per dipendente | idee implementate / dipendenti per anno | coinvolgimento | kaizen |

**Esempio svolto: OEE (secondo LEI):** disponibilità 90%, prestazione 95%, qualità 99% danno 0,90 × 0,95 × 0,99 = 84,6% di OEE [21]. La metrica vale quanto i dati su cui si basa: se si tolgono gli attrezzaggi dal tempo pianificato, si ottengono numeri belli ma nessun indizio del potenziale SMED.

**Checklist per un buon sistema di KPI**

- [ ] Non più di cinque-sette KPI per livello [unverified: linea guida]
- [ ] Ogni KPI ha un responsabile e un obiettivo
- [ ] I KPI sono mostrati visivamente dove si svolge il lavoro
- [ ] Gli scostamenti attivano una risposta definita (azione, escalation, A3)
- [ ] Risultati e metriche di processo sono bilanciati (ad esempio OTIF e tempo di attrezzaggio)
- [ ] Raccogliere i dati richiede meno tempo che discuterli

## Errori comuni nell'implementazione del lean

| Errore | Conseguenza | Approccio migliore |
|---|---|---|
| copiare gli strumenti invece di comprendere i principi | kanban senza processi stabili crea carenze | mantenere stabilità della sequenza, flusso, pull, livellamento |
| 5S come evento di pulizia | dopo tre mesi torna lo stato precedente | standard, audit, responsabilità del team |
| lean come programma di riduzione dei costi | le persone nascondono gli sprechi, resistenza | sicurezza dell'occupazione, usare i guadagni per la crescita |
| la direzione delega il lean a una funzione di staff | strumenti senza comportamento di leadership | i leader stessi al gemba, standard di lavoro del leader |
| troppe aree pilota contemporaneamente | le risorse si disperdono, nessun successo visibile | un solo pilota, poi l'estensione |
| ignorare il muri | la compressione del takt porta a sovraccarico, infortuni ed errori | includere ergonomia e carico di lavoro nello standard di lavoro |
| ridurre le scorte senza analisi del rischio | mancate consegne durante le interruzioni | definire scorte di sicurezza strategiche per i componenti critici |
| KPI senza reazione | le lavagne diventano tappezzeria | ogni scostamento genera un'azione |
| coinvolgere il sindacato o i rappresentanti dei lavoratori troppo tardi | ritardi, sfiducia | includerli nel comitato di guida fin dall'inizio |
| digitalizzare prima di stabilizzare | processi instabili vengono cristallizzati nel software | prima lo standard, poi il supporto digitale |

## Svantaggi e limiti della produzione snella

Una guida che elenchi solo i benefici è incompleta. Le critiche al lean si concentrano su quattro aree.

### 1. Intensificazione del lavoro e stress

Una revisione sistematica della letteratura di Rampasso e colleghi (2017) ha individuato 22 categorie di problemi che la produzione snella può causare per la salute e il benessere dei lavoratori; la più citata è l'intensificazione del lavoro, presente in 13 dei 27 articoli esaminati [33]. Gli autori indicano inoltre l'aumento dello stress e la crescita di responsabilità, richieste e pressione [33]. Ciò non contraddice il pensiero lean; mostra cosa accade quando si attacca il muda e si trascura il muri. Toyota stessa include esplicitamente il muri tra i tipi di perdita [9], Liker chiede di livellare il carico di lavoro [10], e le linee guida ergonomiche dell'OSHA considerano i disturbi muscoloscheletrici correlati al lavoro come prevenibili [63].

### 2. Resilienza della catena di fornitura dopo il 2020 e il 2021

La pandemia di COVID-19 e la carenza di semiconduttori del 2021 hanno messo sotto accusa il just-in-time. Willy Shih (Harvard Business School) ha scritto nel 2020 che la pandemia aveva esposto ovunque la vulnerabilità delle strategie produttive e delle catene di fornitura; le aziende dovrebbero valutare i propri rischi e usare l'innovazione di processo invece di limitarsi a rilocalizzare le fonti di approvvigionamento [32].

Toyota aveva imparato la lezione dieci anni prima. Dopo il terremoto e lo tsunami dell'11 marzo 2011, Toyota ha riscontrato che più di 1.200 componenti e materiali potevano essere interessati e ha redatto un elenco di 500 articoli prioritari che richiedevano un approvvigionamento sicuro [31]. Nell'ambito del piano di continuità operativa sviluppato da questa analisi, i fornitori dovevano accumulare da due a sei mesi di scorte di chip per Toyota, a seconda del tempo tra ordine e consegna [31]. Quando la carenza di chip del 2021 ha costretto molti costruttori a ridurre la produzione, Toyota ha mantenuto la produzione in gran parte in linea con il piano fino a maggio, secondo Fortune [47]; una persona vicina al fornitore Harman ha detto a Reuters che Toyota era, per quanto si poteva capire, l'unico costruttore adeguatamente attrezzato per gestire la carenza di chip [31]. Un portavoce di Toyota ha definito il piano "una tipica soluzione lean" [31]. Toyota non è stata però immune: nell'agosto 2021 l'azienda ha annunciato che avrebbe ridotto a settembre la produzione globale del 40 percento rispetto al piano originale [48]. Le scorte di sicurezza fanno guadagnare tempo; non sostituiscono la gestione del rischio lungo l'intera catena di fornitura.

La lezione: il lean non significa scorte zero a ogni costo. Significa giustificare deliberatamente le scorte. Una scorta di sicurezza per un componente critico con tempi di reintegro lunghi e poche fonti è una decisione basata su un'analisi del rischio, e quindi giustificata. Lo spreco è invece una scorta non controllata che nessuno sa giustificare. Krafcik aveva mostrato nel 1988 che il sistema "a scorte" accumula giacenze che nascondono i problemi [3]; una scorta di sicurezza strategica, al contrario, è dimensionata deliberatamente e resa trasparente.

**Checklist: costruire la resilienza in un sistema lean**

- [ ] Identificare i componenti critici (tempo di reintegro, numero di fonti, impatto di una carenza)
- [ ] Definire, dimensionare e visualizzare le scorte di sicurezza strategiche per questi componenti
- [ ] Rendere trasparente la struttura dei fornitori fino ai livelli più profondi, ove possibile
- [ ] Simulare scenari (perdita di un fornitore, picco di domanda)
- [ ] Rivedere regolarmente le scorte e ridurle man mano che il rischio diminuisce

### 3. Limiti nella produzione high-mix, low-volume ed engineer-to-order

Il Lean è nato nella produzione ripetitiva. Nelle job shop, nella produzione high-mix/low-volume e nella produzione engineer-to-order, come quella di macchinari speciali, kanban e heijunka si adattano solo in misura limitata. I principi restano validi, ma gli strumenti vanno adattati: al posto del kanban, di solito aiutano di più la schedulazione sul collo di bottiglia, il CONWIP, l'assemblaggio a ritmo takt (pulsato) e la gestione visuale dei progetti.

### 4. Il Lean come moda e la copia degli strumenti

Molte implementazioni copiano gli strumenti visibili del Toyota Production System ma non il sistema di gestione che li sostiene. Nel 2007 Womack e Jones hanno condensato i loro cinque principi in scopo, processo e persone [5]. Il terzo tema descrive proprio il lato gestionale che la copia degli strumenti trascura: una persona responsabile di ogni flusso del valore, la strategy deployment, cicli di miglioramento frequenti con A3 e standard work [5]. Anche i ricercatori dell'IMVP MacDuffie e Pil concludono che il modo in cui è organizzato il sistema produttivo conta più di investimenti massicci in apparecchiature ad alta tecnologia [6].

Anche all'interno di GM il trasferimento non è stato automatico: sebbene GM avesse una conoscenza diretta del sistema Toyota tramite NUMMI dal 1984, circa 15 anni dopo il lean non era ancora stato implementato negli altri stabilimenti statunitensi di GM [56]. Conoscere gli strumenti non basta; servono leader che radichino il sistema nel proprio stabilimento.

## Lean e digitale: lean 4.0, digital twin e Microsoft 365

Lean e Industry 4.0 vengono spesso presentati come opposti: da un lato schede e lavagne semplici, dall'altro sensori, software e AI. In pratica si completano a vicenda. Il termine "lean 4.0" (talvolta "digital lean") descrive la combinazione dei principi lean con la tecnologia digitale; non è standardizzato e viene usato in modi diversi.

### Che cosa possono fare gli strumenti digitali per il lean

| Elemento lean | Versione analogica | Supporto digitale |
|---|---|---|
| Mappatura del flusso del valore | carta, matita, cronometro | modello digitale del flusso del valore con dati da ERP e MES, scenari, simulazione |
| Kanban | cartellini in circolazione | e-kanban con riordino automatico, scanner o bilance |
| Andon | cordone e lampada | avvisi automatici dai dati macchina, escalation mobile |
| OEE | foglio di rilevazione a tacche | raccolta dei dati macchina in tempo reale |
| Lavagna di reparto | lavagna bianca | lavagne digitali con KPI aggiornati automaticamente |
| Standard work | foglio stampato | istruzioni di lavoro digitali, istruzioni video |
| Bilanciamento di linea | lavagna yamazumi | simulazione di diverse opzioni di bilanciamento prima di riorganizzare la linea |

### Il digital twin in un contesto lean

Un digital twin è una rappresentazione virtuale di prodotti, processi o apparecchiature collegata a dati reali. Per il lean, il più interessante è il process twin: un modello del flusso del valore con capacità, tempi ciclo, tempi di cambio e scorte, in cui è possibile testare scenari prima di riorganizzare una linea. Si può verificare, ad esempio, come il dimezzamento della dimensione del lotto influisca sulla quota di cambi, sulle scorte e sul lead time, oppure se un nuovo bilanciamento di linea rispetti il takt. La [guida al digital twin nella manifattura](https://www.m365.fm/en/learn/digital-twin-manufacturing/) tratta l'argomento in profondità.

### Limiti e sequenza

Uno studio di Winkler e Lugert presso la BTU Cottbus-Senftenberg in Germania (2017, 170 esperti prevalentemente di Germania, Austria e Svizzera) sostiene che concetti dell'Industry 4.0 come i sistemi di produzione cyber-fisici autoregolati creano flussi di materiale dinamici in cui la classica mappatura del flusso del valore perde potere esplicativo; il metodo dovrà quindi evolvere [38]. Ciò suggerisce di sviluppare ulteriormente gli strumenti del lean, non di abbandonarlo.

In pratica vale una sequenza semplice: prima stabilizzare e standardizzare il processo, poi supportarlo digitalmente. Liker formula questo concetto come principio 8: usare solo tecnologie affidabili e accuratamente testate che servano le persone e i processi [10]. Un modello digitale di un processo instabile riproduce la sua variabilità, ma non ne rimuove le cause.

### I dati come tema lean

I dati hanno un ruolo specifico nel pensiero lean: devono rendere visibili i problemi, non controllare le persone. Quando si introducono la raccolta di dati macchina o le lavagne digitali, bisogna definire quali dati vengono analizzati a livello di impianto e di processo, chi vi ha accesso e come si escluda l'analisi a livello di singola persona. Questo costruisce fiducia con la forza lavoro e con il sindacato dove presente; negli stabilimenti tedeschi è inoltre un prerequisito per l'approvazione del consiglio di fabbrica, e per i siti UE si applica il GDPR a qualsiasi dato personale.

### Microsoft 365 nel lavoro lean quotidiano: che cosa è realistico

Molti stabilimenti utilizzano già Microsoft 365. Per i team di produzione in prima linea, Microsoft descrive, tra l'altro, Shifts per i turni, Planner per le attività, Approvals per le approvazioni (ad esempio, un operatore che richiede l'approvazione per una regolazione di un'attrezzatura), Updates per i controlli periodici come le ispezioni, Walkie Talkie per la comunicazione in linea, Lists per il monitoraggio semplice, Power BI per i report sui KPI e Power Apps per i flussi di lavoro personalizzati [57]. Da ciò derivano alcuni utilizzi pratici per le routine lean:

| Routine lean | Possibile configurazione di Microsoft 365 | Cosa tenere sotto controllo |
|---|---|---|
| Lavagna di reparto, riunione a livelli | Report Power BI con lead time, OEE, FPY e OTIF su uno schermo accanto alla lavagna | i dati devono provenire da MES o ERP; l'aggiornamento manuale in Excel vanifica il beneficio |
| Lista delle azioni | un piano Planner per area con responsabili e scadenze | una lista per ogni livello di riunione, non in aggiunta alla lista cartacea |
| Idee Kaizen, audit 5S | Lists o una semplice Power App su tablet presso la postazione di lavoro | riscontro ai proponenti entro scadenze fisse |
| Escalation | canale Teams per linea, notifiche automatiche dove utile | non sostituisce una luce andon fisica sulla linea |
| Standard di lavoro | schede di standard di lavoro e istruzioni video archiviate centralmente in SharePoint, aperte tramite codice QR alla postazione | una sola versione valida, processo di modifica chiaro |
| Passaggio di consegne tra turni | post o modulo Teams con campi fissi (sicurezza, qualità, fermi, questioni aperte) | essere brevi, altrimenti il passaggio stesso diventa spreco |

Qui vanno indicati due limiti. Microsoft 365 non è un MES né un sistema di raccolta dati dalle macchine; i valori in tempo reale per l'OEE o i segnali andon provengono dal livello dei controlli e del MES. E una lavagna digitale non sostituisce il recarsi al gemba: la riunione a livelli si svolge comunque sulla linea; lo schermo mostra solo i numeri. Per gli amministratori di M365 ciò significa: concordare per tempo con la produzione (e con il sindacato o il comitato aziendale, ove presente) quali dati siano visibili a quale livello, e definire le licenze per il personale di produzione, il modello dei dispositivi (tablet condivisi) e i permessi prima del pilota. Il modo in cui Azure si inserisce sotto questo livello è l'argomento della [guida Azure per la manifattura](https://www.m365.fm/en/learn/manufacturing-it-azure/).

## Esempi documentati di lean manufacturing

Molte storie di successo online provengono da fornitori o non possono essere verificate. Gli esempi seguenti sono documentati pubblicamente.

### Toyota: il sistema di riferimento

Toyota è il sistema di riferimento storico. La stessa Toyota descrive il proprio sistema di produzione come l'interazione di due concetti, just-in-time e jidoka [1]; la ricerca dell'IMVP ha ricondotto la superiorità dei migliori stabilimenti all'approccio di produzione snella nel suo complesso [6]. La gestione della carenza di chip del 2021 mostra che il sistema non minimizza dogmaticamente le scorte, ma valuta deliberatamente i rischi [31].

### NUMMI: stessa forza lavoro, sistema diverso

NUMMI, la joint venture tra GM e Toyota avviata nel 1984 a Fremont, in California, è l'esempio più noto del trasferimento del lean in uno stabilimento occidentale [3][56]. Fu costituita nel sito dello stabilimento Fremont di GM, chiuso nel 1982; la maggior parte della forza lavoro iniziale, più dell'85 per cento, era stata licenziata da quello stabilimento, e lo United Auto Workers (UAW) rimase coinvolto [56]. Le Corolla costruite alla NUMMI furono giudicate di qualità pari a quelle costruite in Giappone, e lo stabilimento raggiunse presto i ritmi produttivi giapponesi dopo l'avvio [56]. John Krafcik vi lavorò per due anni come ingegnere e descrisse l'ambiente manageriale come molto diverso da quello degli stabilimenti tradizionali; la sua esperienza confluì nel suo articolo del 1988 [3]. NUMMI dimostrò che il lean può funzionare con la stessa forza lavoro e lo stesso sindacato quando cambia il sistema di gestione. Il caso mostra anche il limite: per anni GM trasferì poco di ciò che aveva appreso agli altri suoi stabilimenti, e lo stabilimento chiuse nel 2010 [56]. Parte del sito fu venduta a Tesla nello stesso anno e riaprì come Tesla Fremont Factory [56].

### Porsche: il lean in tempo di crisi

Porsche, il costruttore tedesco di auto sportive, si trovò di fronte a una crisi esistenziale all'inizio degli anni Novanta: secondo IndustryWeek, le vendite scesero da 50.000 veicoli nel 1986 a 14.000 nel 1993, e per il 1991 incombeva una perdita di circa 150 milioni di dollari [34]. Wendelin Wiedeking, responsabile della produzione e della gestione dei materiali dal 1991, coinvolse consulenti giapponesi guidati da Chihiro Nakao; nell'autunno del 1992 Nakao fece tagliare a metà le scaffalature di stoccaggio dello stabilimento di Zuffenhausen [34]. Secondo IndustryWeek, le scorte scesero poi da sette giorni di fornitura a un giorno, le ore di produzione per una 911 passarono da 120 (1992/93) a 60 entro la fine degli anni Novanta, e il numero di suggerimenti di miglioramento salì da 0,09 a 4,3 per dipendente [34]. Il Lean non fu l'unica leva: Wiedeking ridusse del 35 percento il numero dei manager, fissò un obiettivo di riduzione dei costi del 30 percento, coinvolse i fornitori e lanciò nel 1996 un nuovo modello, la Boxster, che condivideva molte parti con la nuova 911 [34]. Il caso mostra che il Lean funziona in un costruttore tedesco di fascia alta e a basso volume quando la leadership se ne assume la responsabilità; mostra anche che la svolta fu un insieme di misure.

### Gli elementi comuni dei tre esempi

In tutti e tre i casi a fare la differenza fu un sistema di principi, leadership e strumenti, non un singolo strumento, e il top management era coinvolto in prima persona. NUMMI dimostra inoltre che un modello funzionante all'interno della propria azienda non basta se i responsabili delle altre fabbriche non lo adottano.

## Supporto software: iFAKT Polaris come esempio

> **Nota: l'autore lavora presso iFAKT GmbH.**

Il software non sostituisce la comprensione del Lean, ma può supportare il lavoro con i flussi di valore, gli scenari e i KPI. Per i metodi di questa guida sono rilevanti diverse classi di strumenti: sistemi di esecuzione della produzione (MES) e raccolta dei dati di macchina per OEE e reportistica di produzione, strumenti BI per i KPI, simulazione a eventi discreti per layout e capacità, e soluzioni specializzate per modelli digitali dei flussi di valore.

Un esempio dell'ultima classe, proveniente dalla Germania, è [iFAKT Polaris](https://www.m365.fm/entity/polaris/) di [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), con sede a Stoccarda, in Germania [44]. Secondo l'azienda, iFAKT è stata fondata nel 2001 e conta circa 25 dipendenti [46]; sul proprio sito l'azienda riporta le certificazioni ISO 9001 e ISO/IEC 27001 (TÜV SÜD) [41]. Il prodotto Polaris IMS si è classificato secondo nella categoria produzione del Best of Technology Award 2025 del settimanale economico tedesco *WirtschaftsWoche* [67]. Due moduli sono elencati nel marketplace commerciale di Microsoft (AppSource): Polaris VSM per la mappatura digitale dei flussi di valore con calcolo dei KPI e lavagne kanban e kaizen [43], e Polaris BSM per la modellazione dei processi aziendali come diagrammi a corsie [42].

Riferita ai metodi di questa guida, una soluzione di questo tipo affronta principalmente quattro compiti (descrizione del fornitore, non un test indipendente):

- **Flusso di valore:** modellare digitalmente i flussi di valore e valutare, sulla base dei dati, lead time, scorte e colli di bottiglia.
- **Simulazione:** testare layout, capacità e scenari di takt prima dell'implementazione, ad esempio un nuovo bilanciamento di linea o lotti più piccoli dopo un progetto SMED.
- **Pianificazione:** collegare la pianificazione della produzione e della capacità al modello del flusso di valore.
- **Analisi dei KPI:** analizzare KPI come lead time, rapporto di flusso o OEE e preparare confronti tra piano e consuntivo per le riunioni a più livelli.

Indipendentemente dal fornitore, verificate se lo strumento riflette i vostri standard e il vostro modello di dati, se si integra nel panorama IT esistente (ERP, MES, Microsoft 365) e se i suoi risultati confluiscono davvero nei gemba walk, nelle riunioni a più livelli e nelle decisioni di miglioramento. Un approfondimento sul prodotto è disponibile nel [profilo di iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/); il software di scheduling in generale è trattato nella [guida alla pianificazione della produzione e all'APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

## Glossario Lean: termini chiave dalla A alla Z

| Termine | Definizione breve |
|---|---|
| Rapporto A3 | analisi del problema, analisi delle cause e piano d'azione su un unico foglio A3 (circa 27,9 × 43,2 cm) |
| Andon | segnale (luce, cordicella, pulsante) che rende immediatamente visibile un'anomalia |
| CONWIP | controllo con una quantità costante di lavoro in corso nel sistema; adatto alla produzione ad alta varietà |
| Tempo ciclo | tempo effettivo necessario a un processo per completare un pezzo |
| DOWNTIME | mnemonico statunitense per gli otto sprechi: difetti, sovrapproduzione, attese, talento non utilizzato, trasporti, scorte, movimenti, lavorazioni superflue |
| Corsia FIFO | buffer a capacità limitata che fa avanzare i pezzi nell'ordine di arrivo |
| Rapporto di flusso | quota del tempo di lavorazione sul lead time (detto anche efficienza del ciclo di processo) |
| Gemba | il luogo in cui si crea valore; in reparto, la linea o la cella |
| Genchi genbutsu | andare a vedere di persona invece di affidarsi ai rapporti |
| Hansei | riflessione strutturata dopo un progetto o un errore |
| Heijunka | livellamento della produzione per volume e mix |
| Hoshin kanri | deployment della strategia (politica) dal top management al reparto |
| Jidoka | fermarsi davanti alle anomalie, qualità integrata nel processo; secondo pilastro del TPS |
| Just-in-time | produrre solo ciò che serve, quando serve, nella quantità necessaria |
| Kaizen | miglioramento continuo a piccoli passi da parte di tutti i dipendenti (miglioramento continuo, CI) |
| Kanban | segnale che attiva la produzione o lo spostamento in un sistema pull |
| Standard di lavoro per i leader | standard di lavoro per i responsabili, come orari fissi per i gemba walk e riunioni a più livelli |
| Lead time | tempo dall'ingresso di un pezzo o di un ordine all'uscita dal flusso del valore |
| Muda, mura, muri | spreco, irregolarità, sovraccarico |
| OEE | efficienza globale delle attrezzature: disponibilità × prestazione × qualità |
| Flusso monopezzo | produzione e trasferimento dei pezzi uno alla volta invece che in lotti |
| Processo pacemaker | l'unico processo che riceve il programma di produzione; tutti i processi a monte seguono in pull |
| Pitch | tempo takt × quantità del contenitore; intervallo temporale della scatola heijunka |
| Poka-yoke | dispositivo semplice che previene un errore o lo segnala immediatamente |
| SMED | cambio formato in meno di dieci minuti separando e convertendo le attività di attrezzaggio |
| Supermarket | scorte controllate con quantità minime e massime da cui il processo a valle effettua i prelievi |
| Tempo takt | tempo di produzione disponibile / domanda del cliente |
| TIMWOODS | mnemonico europeo per gli stessi otto sprechi |
| TPM | manutenzione produttiva totale: cura delle attrezzature con il coinvolgimento di tutti |
| TWI | Training Within Industry: programma statunitense del 1940 per l'addestramento al lavoro, i metodi di lavoro e le relazioni di lavoro |
| Yamazumi | grafico a barre impilate del contenuto di lavoro di ciascun operatore confrontato con il tempo takt |

## FAQ: domande sulla produzione snella

### Che cos'è la produzione snella in parole semplici?

La produzione snella è un modo di gestire lo stabilimento in cui ogni cosa è allineata a ciò che il cliente apprezza. Tutto ciò per cui il cliente non pagherebbe, come attese, ricerche, stoccaggi o rilavorazioni, è considerato spreco e viene eliminato passo dopo passo. Le persone che svolgono il lavoro migliorano i propri processi.

### Quali sono i 5 principi della produzione snella?

Secondo Womack e Jones (1996): specificare il valore dal punto di vista del cliente, identificare il flusso del valore, creare flusso, stabilire il pull e perseguire la perfezione [5]. I principi si basano l'uno sull'altro e vengono ripetuti come un ciclo.

### Quali sono gli 8 sprechi del lean?

Difetti, sovrapproduzione, attese, talento non utilizzato, trasporti, scorte, movimenti e lavorazioni superflue, riassunti nel mnemonico statunitense DOWNTIME (TIMWOODS elenca gli stessi otto). I primi sette risalgono a Taiichi Ohno [8]; l'ottavo è stato aggiunto nella letteratura occidentale [40].

### Qual è la differenza tra produzione snella e lean management?

La produzione snella (o lean production) è l'applicazione dei principi lean alla fabbricazione e all'assemblaggio. Il lean management è l'approccio generale di leadership e organizzazione che estende il pensiero lean all'intera azienda, comprese le funzioni d'ufficio, l'ingegneria e la catena di fornitura. Nell'uso quotidiano statunitense i termini si sovrappongono ampiamente.

### Chi ha inventato la produzione snella?

Le basi sono state sviluppate alla Toyota a partire dagli anni Cinquanta, soprattutto da Taiichi Ohno ed Eiji Toyoda, basandosi sulle idee di Sakichi e Kiichiro Toyoda [1]. Tra le influenze americane figurano la produzione a flusso di Ford, il programma Training Within Industry e l'insegnamento della qualità di Deming [30][59][29]. John Krafcik coniò il termine "lean production" nel 1988 [2][3], e il libro del MIT del 1990 *The Machine That Changed the World* lo rese ampiamente noto [4].

### Che cosa significano muda, mura e muri?

Muda è lo spreco, mura è l'irregolarità e muri è il sovraccarico [9]. I tre sono collegati: i flussi di lavoro irregolari (mura) portano al sovraccarico (muri), che a sua volta genera difetti e sprechi (muda).

### Da quale strumento lean conviene iniziare?

Un inizio collaudato è una mappa del flusso del valore per vedere le priorità, insieme a 5S e lavoro standard in un'area pilota per creare stabilità. Kanban e heijunka richiedono processi stabili e cambi formato rapidi e arrivano in una fase successiva.

### Come si calcola il takt time?

Takt time = tempo di produzione disponibile / domanda del cliente [19]. Esempio: 480 minuti di tempo di lavoro al giorno e 240 pezzi richiesti danno un takt time di 2 minuti.

### Qual è la differenza tra takt time, cycle time e lead time?

Il takt time deriva dalla domanda: indica ogni quanto un pezzo deve essere completato. Il cycle time è il tempo che un processo impiega effettivamente per un pezzo; deve essere inferiore al takt time. Il lead time misura quanto tempo un pezzo impiega a percorrere il flusso del valore dall'ingresso all'uscita, comprese tutte le attese. Di solito è molte volte più lungo della somma dei cycle time.

### Quali KPI misurano i progressi lean?

Funzionano meglio poche metriche discusse ogni giorno: lead time e rapporto di flusso per il flusso, OEE per gli impianti, first pass yield per la qualità, on-time in-full per la visione del cliente, oltre a tempo di cambio formato, sicurezza e numero di miglioramenti implementati. L'importante è che ogni scostamento generi un'azione.

### Qual è la differenza tra lean e Six Sigma?

Il lean elimina gli sprechi e crea flusso; il Six Sigma riduce la variazione e i difetti con metodi statistici e il ciclo DMAIC [28]. Il Lean Six Sigma combina entrambi.

### Quali sono gli svantaggi della produzione snella?

I rischi principali sono l'intensificazione del lavoro quando il muri viene ignorato [33], la fragilità della catena di fornitura quando le scorte vengono tagliate senza un'analisi dei rischi [31][48], l'adattamento limitato di strumenti come il kanban nella produzione ad alta varietà e basso volume, e risultati deludenti quando le aziende copiano gli strumenti senza il sistema di gestione [6][56]. Tutti e quattro sono evitabili, ma solo con l'attenzione della leadership.

### La produzione snella funziona per le piccole aziende manifatturiere e le job shop?

Sì, i principi si applicano indipendentemente dalle dimensioni dell'azienda, e i percorsi decisionali brevi sono un vantaggio per le piccole imprese manifatturiere. Le aziende statunitensi possono ricevere supporto dai centri NIST MEP, che si concentrano sulle piccole e medie imprese manifatturiere [65]. Nelle job shop e nella produzione engineer-to-order gli strumenti devono essere adattati, ad esempio con la schedulazione del collo di bottiglia e l'assemblaggio con ritmo takt invece del kanban.

### Il just-in-time è ancora praticabile dopo la carenza di chip?

Sì, se viene interpretato correttamente. Il just-in-time punta al flusso e ai problemi visibili, non a scorte zero a tutti i costi. Da quando, dopo il 2011, ha introdotto un piano di continuità, Toyota richiede ai fornitori di tenere da due a sei mesi di scorte di semiconduttori e nel 2021 ha mantenuto la produzione stabile più a lungo di molti concorrenti, pur dovendo ridurre l'output a partire da settembre [31][47][48].

### Quanto tempo serve per implementare la lean manufacturing?

Risultati misurabili nella prima area pilota sono realistici entro pochi mesi; un sistema di produzione esteso a tutto lo stabilimento richiede di solito da uno a due anni, e una cultura lean duratura diversi anni [unverified: stime di professionisti]. Il lean non è un progetto con una data di fine, ma un sistema di gestione permanente.

### Microsoft 365 può supportare la lean manufacturing?

Sì, per le riunioni a più livelli, il monitoraggio delle azioni e i KPI. Power BI funziona per i KPI di reparto, Planner per le liste di azioni, Teams e Shifts per la comunicazione con i turni [57]. Ma Microsoft 365 non sostituisce un MES né il gemba walk, e ripaga solo quando gli standard sono già in essere. Vedi la sezione "Microsoft 365 nel lavoro lean quotidiano".

## Conclusione e primi passi

La lean manufacturing è più di una cassetta degli attrezzi venuta dal Giappone. È un sistema di gestione cresciuto per più di un secolo, dal telaio con arresto automatico di Toyoda, dalla linea di montaggio di Ford e dal programma statunitense Training Within Industry fino al Toyota Production System di Ohno e agli studi del MIT che nel 1988 le diedero il nome. I suoi cinque principi sono semplici: valore, flusso del valore, flusso, pull e perfezione. L'implementazione è difficile perché richiede leadership, standard e risoluzione quotidiana dei problemi.

Gli strumenti di questa guida funzionano solo nell'ordine giusto e insieme: stabilità prima del flusso, flusso prima del pull, pull prima del livellamento. Le critiche al lean meritano di essere prese sul serio. L'intensificazione del lavoro si verifica quando il muri viene ignorato, e le catene di fornitura diventano fragili quando le scorte vengono tagliate senza un'analisi del rischio. L'accumulo di chip di Toyota dimostra che un buon lean pesa deliberatamente i rischi. Gli strumenti digitali come i modelli del flusso del valore e la simulazione rendono il lean più rapido e preciso, ma richiedono processi stabili.

**I tuoi primi passi nei prossimi 30 giorni**

- [ ] Fai un gemba walk lungo una famiglia di prodotti importante, dalla spedizione fino al ricevimento
- [ ] Misura il lead time di questa famiglia di prodotti e calcola il flow ratio
- [ ] Determina il takt time per la famiglia di prodotti e confrontalo con i cycle time
- [ ] Scegli un'area pilota usando i criteri indicati sopra
- [ ] Avvia le 5S e una semplice lavagna di reparto con da tre a cinque KPI nell'area pilota
- [ ] Affronta il problema più grande dell'area pilota con un A3
- [ ] Informa il team dirigenziale e, dove previsto, i sindacati o i rappresentanti dei dipendenti su obiettivi, approccio e sicurezza dell'occupazione
- [ ] Chiedi al reparto IT o al tuo team Microsoft 365 quali sistemi potrebbero alimentare automaticamente i KPI della lavagna in seguito; avvia la lavagna prima su carta
- [ ] Verifica se il centro NIST MEP del tuo stato offre una formazione o una valutazione lean adatta al tuo pilota [65]

---

## Ulteriori letture su m365.fm

**Articoli di approfondimento**
- [Lean Management in Manufacturing: The Complete Guide](https://www.m365.fm/community/u/mirko-p/blog/lean-management-in-manufacturing-complete-guide/) (articolo più breve sulle routine quotidiane di lean management)
- [Lean vs. Six Sigma: differenze e come combinarli](https://www.m365.fm/community/u/mirko-p/blog/lean-vs-six-sigma-differences-combine/)
- [Ottimizzazione del reparto produttivo: modi per migliorare il flusso](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/)
- [Operational Excellence vs. Lean](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-vs-lean/)
- [Cos'è un Gemba Walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/)

**Termini del glossario (entità)**
[Lean management](https://www.m365.fm/entity/lean-management/) · [5S](https://www.m365.fm/entity/5s/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Just-in-time](https://www.m365.fm/entity/just-in-time/) · [Pull system](https://www.m365.fm/entity/pull-system/) · [Poka-yoke](https://www.m365.fm/entity/poka-yoke/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [SMED](https://www.m365.fm/entity/smed/) · [Setup time](https://www.m365.fm/entity/setup-time/) · [Lean Six Sigma](https://www.m365.fm/entity/lean-six-sigma/) · [Eight wastes](https://www.m365.fm/entity/eight-wastes/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [Takt time](https://www.m365.fm/entity/takt-time/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [TPM](https://www.m365.fm/entity/total-productive-maintenance/) · [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) · [Line balancing](https://www.m365.fm/entity/line-balancing/) · [Gemba walk](https://www.m365.fm/entity/gemba-walk/)

**Guide correlate**
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Gestione del reparto produttivo e Gemba Walk](https://www.m365.fm/en/learn/shop-floor-management/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPI di produzione](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Digital Twin nella manifattura](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Pianificazione della produzione e APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Azure per la manifattura](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** è il conduttore di m365.fm e lavora presso iFAKT GmbH. Su m365.fm scrive di produzione snella, eccellenza operativa e trasformazione digitale della produzione, concentrandosi su come i modelli di flusso del valore, la simulazione e l'analisi degli KPI aiutino gli stabilimenti a mettere in pratica il lean.

**Nota: l'autore lavora presso iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Sources [58] to [67] were added for the US version and opened and checked on that date.

1. Toyota Production System. Toyota Motor Corporation. https://global.toyota/en/company/vision-and-philosophy/production-system/index.html
2. Triumph of the Lean Production System (Krafcik, J. F., Sloan Management Review, Fall 1988, pp. 41–52), title page and context. AllAboutLean (Christoph Roser). https://www.allaboutlean.com/definition-of-lean/triumph-of-the-lean-production-system/
3. The Term "Lean Production" Is 25 Years Old: My Thoughts on the Original Article. Lean Blog (Mark Graban). https://leanblog.org/2013/09/the-term-lean-production-is-25-years-old-my-thoughts-on-the-original-article
4. The Machine That Changed the World (Womack, J. P.; Jones, D. T.; Roos, D.), sample of the introduction. Free Press / Simon & Schuster, via boekhuis.nl. https://download.boekhuis.nl/9780743299794_fragm-docb.pdf
5. Lean Thinking and Practice. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/lean-thinking-and-practice/
6. MacDuffie, J. P.; Pil, F. K.: Changes in Auto Industry Employment Practices (chapter 9 in "Lean Work"). The Wharton School, University of Pennsylvania. https://faculty.wharton.upenn.edu/wp-content/uploads/2012/05/MacDuffiePil_LeanWork_Chap9.pdf
7. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press / Routledge. https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140
8. Seven Wastes. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/seven-wastes/
9. Muda, Mura, Muri. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/muda-mura-muri/
10. The Toyota Way (Liker, J. K., McGraw-Hill 2004), overview of the 14 principles. Wikipedia. https://en.wikipedia.org/wiki/The_Toyota_Way
11. Shigeo Shingo. Wikipedia. https://en.wikipedia.org/wiki/Shigeo_Shingo
12. Single-Minute Exchange of Die (SMED). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/single-minute-exchange-of-die/
13. Poka-Yoke. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/poka-yoke/
14. 5S. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/five-s/
15. Kanban. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/kanban/
16. Heijunka. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/heijunka/
17. Standardized Work. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/standardized-work/
18. Value-Stream Mapping. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/value-stream-mapping/
19. Takt Time. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/takt-time/
20. Total Productive Maintenance. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/total-productive-maintenance/
21. Overall Equipment Effectiveness. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/
22. A3 Report. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/a3-report/
23. Andon. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/andon/
24. Operator Balance Chart. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/operator-balance-chart/
25. Jidoka. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/jidoka/
26. Gemba Walk. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/gemba-walk/
27. Hoshin Kanri. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/hoshin-kanri/
28. What Is Six Sigma? American Society for Quality (ASQ). https://asq.org/quality-resources/six-sigma
29. Timeline: W. Edwards Deming. The W. Edwards Deming Institute. https://deming.org/timeline/
30. Ford Launched the Modern Assembly Line a Century Ago and Changed Society. IndustryWeek. https://www.industryweek.com/innovation/process-improvement/article/21961364/ford-launched-the-modern-assembly-line-a-century-ago-and-changed-society
31. Shirouzu, N.: How Toyota thrives when the chips are down. Reuters, via nippon.com (March 2021). https://www.nippon.com/en/news/reu20210309KBN2B1004/
32. Shih, W.: Global Supply Chains in a Post-Pandemic World: Companies Need to Make Their Networks More Resilient (September/October 2020). Harvard Kennedy School, M-RCBG. https://www.hks.harvard.edu/centers/mrcbg/programs/growthpolicy/global-supply-chains-post-pandemic-world-companies-need-make
33. Rampasso, I. S. et al.: Primary problems associated with the health and welfare of employees observed when implementing lean manufacturing projects. Work, Vol. 58, No. 3 (2017), pp. 263–275. IOS Press. https://content.iospress.com/articles/work/wor2632
34. Mudd, T.: Back in High Gear. IndustryWeek. https://www.industryweek.com/leadership/companies-executives/article/21954759/back-in-high-gear
35. Kaizen Institute Success Story (history timeline). Kaizen Institute. https://kaizen.com/forty-years/kaizen-institute-success-story/
36. VDI 2870 Part 1: Lean production systems; basic principles, introduction and review (German: Ganzheitliche Produktionssysteme). Verein Deutscher Ingenieure (VDI, Association of German Engineers). https://vdi.de/richtlinien/details/vdi-2870-blatt-1-lean-production-systems-basic-principles-introduction-and-review
37. Lean Management. Fraunhofer Institute for Manufacturing Engineering and Automation IPA. https://www.ipa.fraunhofer.de/en/current-research/factory-planning-and-production-management/Operational_excellence_production_logistics/lean-management.html
38. Die Wertstrommethode im Zeitalter von Industrie 4.0 [Value stream mapping in the age of Industry 4.0] (Winkler, H.; Lugert, A.). BTU Cottbus-Senftenberg, Chair of Production Economics (in German). https://www.b-tu.de/fg-produktionswirtschaft/aktuelles/ansicht/11318-die-wertstrommethode-im-zeitalter-von-industrie-4-0
39. Learning to See (Rother, M.; Shook, J.). Lean Enterprise Institute. https://www.lean.org/store/book/learning-to-see/
40. What About the 8th Waste? Gemba Academy. https://www.gembaacademy.com/gemba-insights/what-about-the-8th-waste
41. iFAKT GmbH, website (home page with certification badge and Polaris modules). iFAKT GmbH. https://www.ifakt.de/
42. Polaris BSM (Business Swimlane Modeling). Microsoft AppSource. https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1
43. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource (Polaris VSM). Microsoft Tech Community. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536
44. iFakt VSM (Polaris): product profile. erp-software.org. https://erp-software.org/software/ifakt-vsm/
45. Baldrige Award Recipients: Motorola Inc. (1988), award profile. National Institute of Standards and Technology (NIST). https://www.nist.gov/system/files/documents/2017/10/11/1988_Motorola_Inc.pdf
46. iFAKT GmbH (entity page, company information). m365.fm. https://www.m365.fm/entity/ifakt/
47. Toyota cars and the chip shortage (August 2021). Fortune. https://fortune.com/2021/08/02/toyota-cars-chip-shortage-semiconductors/
48. Shiraki, M.; Ando, R.: Toyota to slash September production due to global chip shortage (August 19, 2021). Reuters, via Investing.com. https://www.investing.com/news/stock-market-news/toyota-to-slash-september-production-due-to-global-chip-shortage--nikkei-2593993
49. Just-in-Time. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/just-in-time/
50. Poka-yoke (citing Shingo, S.; Dillon, A.: A Study of the Toyota Production System from an Industrial Engineering Viewpoint, Productivity Press 1989). Wikipedia. https://en.wikipedia.org/wiki/Poka-yoke
51. Kanban (Toyota's six kanban rules, citing Ohno 1988, p. 176). Wikipedia. https://en.wikipedia.org/wiki/Kanban
52. Total Productive Maintenance (TPM): Principles, pillars, and implementation. Kaizen Institute. https://kaizen.com/insights/tpm-principles-pillars-implementation/
53. Kaizen. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/kaizen/
54. Taiichi Ohno. Wikipedia. https://en.wikipedia.org/wiki/Taiichi_Ohno
55. Pitch. Lean Enterprise Institute. https://www.lean.org/lexicon-terms/pitch/
56. NUMMI. Wikipedia. https://en.wikipedia.org/wiki/NUMMI
57. Microsoft 365 for Manufacturing (Teams for manufacturing frontline). Microsoft Learn. https://learn.microsoft.com/en-us/microsoft-365/frontline/teams-for-manufacturing
58. Bill Smith (Motorola engineer). Wikipedia. https://en.wikipedia.org/wiki/Bill_Smith_(Motorola_engineer)
59. Training Within Industry. Wikipedia. https://en.wikipedia.org/wiki/Training_Within_Industry
60. Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement
61. Lean & Environment Toolkit: Preface (2016). US Environmental Protection Agency (EPA). https://www.epa.gov/lean/lean-environment-toolkit-preface
62. Electromation, Inc. v. National Labor Relations Board, 35 F.3d 1148 (7th Cir. 1994). Justia. https://law.justia.com/cases/federal/appellate-courts/F3/35/1148/605691/
63. Ergonomics. Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/ergonomics
64. About the Shingo Institute. Shingo Institute, Jon M. Huntsman School of Business, Utah State University. https://shingo.org/about-the-shingo-institute/
65. Manufacturing Extension Partnership (MEP). National Institute of Standards and Technology (NIST). https://www.nist.gov/mep
66. About AME. Association for Manufacturing Excellence. https://www.ame.org/about-ame
67. Best of Technology Award 2025: winners (category Produktion / production). WirtschaftsWoche. https://award.wiwo.de/bot/gewinner-2025/
