# SEO metadata

| Field | Value |
|---|---|
| Meta title | Shop Floor Management e Gemba Walk: guida pratica |
| Meta description | Shop floor management spiegato: riunioni a livelli, lavagne SQDCP, KPI, checklist per il gemba walk, roadmap di introduzione e una lavagna digitale in Microsoft 365. |
| Slug | `shop-floor-management` |

# Shop Floor Management e Gemba Walk: la guida completa per guidare dove avviene il lavoro

*Ultimo aggiornamento: 20 novembre 2026 · I dettagli Microsoft sono verificati su Microsoft Learn alla data indicata*

> **Risposta breve:** Il shop floor management (scritto anche shopfloor management, spesso chiamato sistema di gestione quotidiana o gestione a livelli) è un sistema di leadership in cui i manager gestiscono le operazioni dove il valore viene effettivamente creato: sulla linea di produzione, in magazzino o in laboratorio. Combina la presenza dei leader al gemba (il "posto reale"), KPI visivi su una lavagna di reparto, brevi riunioni giornaliere a livelli che fanno risalire i problemi nell'organizzazione e la risoluzione strutturata dei problemi, così che gli scostamenti vengano individuati ogni giorno e risolti in modo definitivo. La gemba walk è la routine di leadership al suo centro.

Quasi ogni produttore ha da qualche parte una lavagna con dei numeri. Peter Gelbrich, citato dall'istituto tedesco di formazione CETPM, stima dalle visite nelle aziende che circa l'80 percento delle aziende manifatturiere disponga di una qualche forma di strumento visivo di shop floor management [3]. Quindi la vera domanda non è più se si abbia una lavagna, ma se funzioni. Gli scostamenti vengono gestiti entro poche ore invece che in settimane? I leader si presentano al gemba con domande o con risposte? E i problemi che il team non riesce a risolvere raggiungono in modo affidabile il livello successivo lo stesso giorno?

Questa guida spiega origini e principi, descrive nel dettaglio ogni elemento e fornisce una matrice delle riunioni a livelli, uno schema della lavagna, una guida alla gemba walk con checklist, lo standard work del leader, una roadmap di implementazione e un'architettura di riferimento per una lavagna digitale di reparto costruita con Microsoft Teams, Power BI, Power Apps e Microsoft Fabric. Gran parte della ricerca sullo shop floor management proviene dalla Germania, dove il termine "Shopfloor Management" è il vocabolario standard negli stabilimenti; questa guida utilizza tali fonti dove aggiungono valore e spiega il contesto per i lettori statunitensi. Una definizione sintetica è disponibile anche nella pagina dell'entità [Shop floor management](https://www.m365.fm/entity/shop-floor-management/).

### Punti chiave

- Lo shop floor management è un sistema di leadership, non una lavagna e non un software. Consiste in leader presenti sul reparto, gestione visiva, pochi KPI, un ritmo fisso di riunioni, risoluzione dei problemi e standard.
- Le riunioni di team a livelli durano da 10 a 15 minuti e sono sfalsate in modo che un problema del primo turno raggiunga il direttore di stabilimento lo stesso giorno.
- Una lavagna dovrebbe riportare da quattro a sei KPI su cui il team può effettivamente intervenire, di solito organizzati secondo SQDCP (sicurezza, qualità, consegna, costo, persone).
- La gemba walk è la principale routine di leadership: ha un tema, si basa sull'osservazione e su domande aperte e termina sempre con un follow-up.
- Un'azione si chiude solo quando il suo effetto appare nel KPI e lo standard è stato aggiornato.
- Prima la routine, poi il digitale. Una lavagna digitale in Microsoft 365 è un insieme di strumenti; licenze, intervalli di aggiornamento, progettazione dei dati e regole sul monitoraggio dei dipendenti determinano lo sforzo richiesto.

### Percorsi di lettura per lettori con poco tempo

| Sei un … | Leggi prima |
|---|---|
| Team leader, capoturno o responsabile di turno | Sezione 5 (riunioni a livelli), 6 (lavagna), 9 (gemba walk), 10 (standard work del leader) |
| Direttore di stabilimento o VP operations | Sezione 3 (benefici), 13 (cultura e regole sul monitoraggio dei dipendenti), 14 (implementazione), 15 (errori comuni) |
| Amministratore di Microsoft 365 o Azure | Sezione 16 (analogico o digitale), 17 (Microsoft 365 incluso il piano di realizzazione), 18 (integrazione dei dati) |
| Lean coach, responsabile CI o project lead | Sezione 4 (elementi), 8 (risoluzione dei problemi), 14 (roadmap con verifica di maturità) |

## Indice

1. [Che cos'è lo shop floor management? Definizione e ambito](#che-cosè-lo-shop-floor-management-definizione-e-ambito)
2. [Origini: gemba, genchi genbutsu e il Toyota Production System](#origini-gemba-genchi-genbutsu-e-il-toyota-production-system)
3. [Obiettivi e benefici](#obiettivi-e-benefici)
4. [I sei elementi dello shop floor management](#i-sei-elementi-della-gestione-del-reparto-produttivo)
5. [Riunioni a livelli: la cascata quotidiana](#riunioni-a-cascata-la-cascata-giornaliera)
6. [La lavagna di reparto: struttura, campi e un esempio di layout](#la-lavagna-di-reparto-struttura-campi-e-layout-di-esempio)
7. [KPI di reparto: scegliere metriche SQDCP efficaci](#kpi-di-reparto-scegliere-metriche-sqdcp-efficaci)
8. [Problem solving in reparto: dal contenimento allo standard](#risoluzione-dei-problemi-in-reparto-dal-contenimento-allo-standard)
9. [Il gemba walk: fasi, domande e checklist](#il-gemba-walk-fasi-domande-e-checklist)
10. [Standard work del leader: la leadership come routine](#standard-work-per-i-leader-la-leadership-come-routine)
11. [Andon: rendere visibili le deviazioni in tempo reale](#andon-rendere-visibili-le-deviazioni-in-tempo-reale)
12. [Ruoli e responsabilità](#ruoli-e-responsabilità)
13. [Cultura, sicurezza psicologica e regole per il monitoraggio dei dipendenti](#cultura-sicurezza-psicologica-e-regole-per-il-monitoraggio-dei-dipendenti)
14. [Come implementare lo shop floor management: una roadmap in sei fasi](#come-implementare-la-gestione-shop-floor-una-roadmap-in-sei-fasi)
15. [Errori comuni e come correggerli](#häufige-fehler-und-wie-sie-sie-beheben)
16. [Analogico o digitale? Lo shop floor management digitale a confronto](#analogico-o-digitale-gestione-digitale-del-reparto-produttivo-a-confronto)
17. [Costruire una lavagna digitale di reparto con Microsoft 365](#costruire-una-lavagna-digitale-per-il-reparto-produttivo-con-microsoft-365)
18. [Integrazione dei dati: MES, ERP e dati delle macchine](#integrazione-dei-dati-mes-erp-e-dati-delle-macchine)
19. [Supporto software: l'esempio di iFAKT Polaris](#supporto-software-lesempio-di-ifakt-polaris)
20. [Glossario](#glossario)
21. [FAQ: shop floor management e gemba walk](#faq-gestione-di-reparto-e-gemba-walk)
22. [Conclusione](#conclusione)

## Che cos'è lo shop floor management? Definizione e ambito

Il termine combina "shop floor" (l'area di produzione, più in generale il luogo in cui si crea valore) e "management". Negli stabilimenti statunitensi la stessa pratica viene spesso indicata con altri nomi: daily management system, tiered accountability, tier meeting o huddle board. L'idea di fondo è la stessa.

L'Istituto tedesco per la ricerca applicata sul lavoro (ifaa, un istituto di ricerca in ingegneria industriale ed ergonomia) descrive lo shop floor management come la guida nel punto in cui si crea valore, che riunisce in reparto le attività di pianificazione, controllo, miglioramento ed esecuzione, in modo che venga valorizzata la conoscenza degli "esperti sul posto" [2]. La Società accademica tedesca per la tecnologia di produzione (WGP) lo definisce un sistema di gestione integrato per lo sviluppo sistematico dei processi e delle persone in reparto [4]. Remco Peters, il cui libro del 2009 è un riferimento standard nei paesi di lingua tedesca, sottolinea che lo shop floor management non è "solo uno strumento di controllo ma uno strumento di leadership olistico" [1][6].

Da queste definizioni derivano tre caratteristiche che distinguono il vero shop floor management da una semplice parete di KPI:

1. **Luogo:** la leadership avviene dove si crea valore, non in sala riunioni.
2. **Ritmo:** la comunicazione è programmata, breve e standardizzata. Segue una cascata fissa attraverso i livelli dell'organizzazione.
3. **Effetto:** ogni deviazione porta a un'azione con un responsabile e una scadenza, e l'effetto viene verificato.

### Che cosa non è lo shop floor management

Nella pratica lo shop floor management viene spesso confuso con termini affini. Negli USA in particolare, "shop floor management" è usato anche dai fornitori di ERP e di pianificazione per indicare lo shop floor control: rilascio, sequenziamento e tracciamento degli ordini di lavoro. La tabella seguente separa i concetti.

| Termine | Di cosa si tratta | Rapporto con la gestione del reparto produttivo |
|---|---|---|
| Controllo di reparto / controllo della produzione | Sequenziamento, rilascio degli ordini, bilanciamento della capacità, tracciamento degli ordini di lavoro | Un sottocompito; la gestione del reparto produttivo ne utilizza i risultati ma è un sistema di leadership |
| MES (sistema di esecuzione della produzione) | Sistema IT per la registrazione e il controllo della produzione | Fonte di dati e strumento, non il sistema di leadership in sé |
| Gestione visiva | Rendere visibili stato e scostamenti | Un elemento della gestione del reparto produttivo |
| Gemba walk | Il responsabile va dove si svolge il lavoro, osserva e pone domande | Un elemento e una routine di leadership all'interno della gestione del reparto produttivo |
| Miglioramento continuo / kaizen | Miglioramento in piccoli passi continui | Risultato e motore; la gestione del reparto produttivo fornisce la piattaforma quotidiana |
| Produzione snella (lean manufacturing) | Filosofia complessiva per eliminare gli sprechi | Il quadro più ampio; la gestione del reparto produttivo ne è il sistema di leadership quotidiano |

Per il quadro più ampio, vedere la pagina dell'entità [Lean management](https://www.m365.fm/entity/lean-management/) e il compendio di m365.fm [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/). In Germania questo quadro viene spesso chiamato "sistema di produzione olistico" (Ganzheitliches Produktionssystem). La serie di linee guida VDI 2870 dell'Associazione degli ingegneri tedeschi (VDI) ne descrive i fondamenti (Parte 1, luglio 2012) e un catalogo di metodi (Parte 2, febbraio 2013). La VDI ha classificato entrambe le parti come in parte da rivedere, ed è in corso una nuova edizione della Parte 2 [27].

### Reparto produttivo, area uffici e altre aree

La gestione del reparto produttivo nasce nella manifattura, ma si trasferisce a qualsiasi area con lavoro ricorrente e un risultato misurabile: logistica, manutenzione, laboratori, reparti ospedalieri, assistenza clienti, ingegneria. Per le aree indirette si è affermato il termine "gestione dell'area uffici" (office floor management) [3]. I principi restano gli stessi; cambiano i KPI. Invece di produzione e scarti, la lavagna mostra, ad esempio, il lead time delle pratiche, il rilascio puntuale dei disegni o l'arretrato dei ticket.

## Origini: gemba, genchi genbutsu e il Toyota Production System

### Gemba: il "luogo reale"

"Gemba" (talvolta scritto "genba") è giapponese per "il luogo effettivo". Nel lean indica il luogo in cui il lavoro che crea valore si svolge effettivamente, di norma il reparto produttivo [7][8]. Strettamente correlato è **genchi genbutsu**, all'incirca "luogo reale, cosa reale". Il Lean Lexicon del Lean Enterprise Institute (LEI) lo definisce come andare alla fonte per verificare personalmente i fatti [8]. Michael Ballé del LEI traccia la distinzione in questo modo: gemba è un luogo, genchi genbutsu è un'azione [8].

Quanto questo principio sia centrale per Toyota emerge da "The Toyota Way 2001". Nell'aprile 2001 Toyota presentò due pilastri (miglioramento continuo e rispetto per le persone) e cinque valori chiave. Accanto a sfida, kaizen, rispetto e lavoro di squadra, genchi genbutsu è esplicitamente uno di essi, tradotto come "andare alla fonte per trovare i fatti" [9].

### Taiichi Ohno e il cerchio di gesso

Taiichi Ohno (1912–1990) è considerato l'artefice del Toyota Production System; il suo libro "Toyota Production System: Beyond Large-Scale Production" è stato pubblicato in inglese da Productivity Press nel 1988 [13]. Gli è attribuito un noto aneddoto: si racconta che facesse collocare i nuovi ingegneri dentro un cerchio tracciato con il gesso sul reparto produttivo, e che li facesse osservare per ore finché non vedevano davvero i problemi del processo. L'aneddoto potrebbe essere abbellito [12], ma ne coglie il nucleo: la comprensione nasce dall'osservazione sul posto, non dai report.

### Masaaki Imai e "Gemba Kaizen"

Masaaki Imai ha reso noto il termine in Occidente con il suo libro "Gemba Kaizen: A Commonsense, Low-Cost Approach to Management" (McGraw-Hill, 1997) [10]. Le "regole d'oro della gestione del gemba" associate si presentano così nella sintesi del Kaizen Institute [11]:

1. Quando sorge un problema, si va prima al gemba.
2. Si controlla il gembutsu (macchina, utensile, materiale, pezzo difettoso).
3. Si adottano contromisure temporanee sul posto.
4. Si individua la causa radice.
5. Si standardizza per prevenire la ricorrenza.

Questi cinque passi sono ancora il modello per la risoluzione dei problemi nella gestione del reparto produttivo (vedere la sezione 8).

### Suzaki e la diffusione del termine

Kiyoshi Suzaki è considerato il pioniere del termine "shop floor management" con il suo libro "The New Shop Floor Management: Empowering People for Continuous Improvement" (Free Press, 1993) [5]. L'istituto tedesco di formazione CETPM cita Constantin May, che definisce Suzaki il "padre dello shop floor management" [3]. Suzaki ha aggiunto alla leadership sul campo una buona comunicazione tra manager e dipendenti, una comprensione del cliente condivisa in tutta l'azienda, la capacità di apprendere e una richiesta di qualità massima [1]. Nei Paesi di lingua tedesca, Remco Peters (2009) [6] e il lavoro alla Technische Universität Darmstadt (inclusi Hertle et al. sullo sviluppo delle competenze nello shop floor management [26]) hanno plasmato la discussione. Negli Stati Uniti, le stesse pratiche si sono diffuse soprattutto con le etichette lean management system, daily management e leader standard work, in particolare attraverso il libro di David Mann "Creating a Lean Culture" [19].

### Quanto è diffuso oggi?

Secondo uno studio del 2018 citato da WGP, circa l'82,5 percento delle aziende partecipanti aveva introdotto lo shop floor management, con un aumento di circa il 20 percento rispetto a tre anni prima. Veniva usato soprattutto in produzione e nelle aree adiacenti, ma non a tutti i livelli della gerarchia [4]. WGP non indica il nome dello studio, quindi campione e metodo non possono essere verificati. Il risultato indica un problema centrale in molti stabilimenti, che la sezione 5 affronta: una lavagna a livello di squadra senza una cascata funzionante sopra di essa ha poco effetto. Dati statunitensi rappresentativi comparabili non sono stati trovati nella ricerca per questo articolo.

## Obiettivi e benefici

Lo shop floor management persegue cinque obiettivi che dipendono l'uno dall'altro:

| Obiettivo | Cosa accade davvero | Misurato con |
|---|---|---|
| Trasparenza | Obiettivo ed effettivo sono visibili a tutti a colpo d'occhio | Aggiornamento della lavagna, quota di KPI con un obiettivo |
| Risposta rapida | Le deviazioni vengono individuate e gestite entro un turno | Tempo dalla deviazione all'azione, tempo di escalation |
| Soluzione dei problemi duratura | Vengono rimosse le cause radice, non i sintomi | Tasso di ripetizione dello stesso difetto |
| Coinvolgimento dei dipendenti | Il sapere di chi svolge il lavoro confluisce nelle decisioni | Numero di idee implementate, partecipazione ai huddle |
| Sviluppo della leadership | I leader passano da vigili del fuoco a coach | Quota di leader standard work completato, tasso di gemba walk |

### Qual è l'evidenza?

Dati solidi e indipendenti sul beneficio dello shop floor management sono rari, perché il suo effetto è difficile da separare da altre misure lean. Gli esempi documentati restano comunque istruttivi:

- **fischer (produttore tedesco di elementi di fissaggio, fischerwerke):** Dopo un progetto di nove mesi, il tasso di reclami è sceso del 13 percento e i costi di processo del 9 percento; il numero di consegne è aumentato dell'11 percento, con la stessa forza lavoro e puntualmente [3].
- **Schinko (produttore austriaco di involucri in lamiera):** Dopo l'introduzione dello shop floor management digitale, la produttività nel taglio è aumentata del 20 percento; nella piegatura, dove il sistema era più recente, l'aumento al momento del rapporto era del 10 percento. L'articolo è stato scritto dal responsabile marketing del fornitore software coinvolto, GFT, e va letto di conseguenza [42].
- **Ricerca sullo shop floor management digitale:** Lo studio dell'istituto wbk Institute of Production Science del Karlsruhe Institute of Technology (KIT) e dell'istituto IPRI nel progetto ShopfloorPulse indica che le informazioni digitali quasi in tempo reale possono ridurre "considerevolmente" il ritardo prima che un guasto venga risolto, mentre il monitoraggio analogico delle azioni dipende dalla disciplina individuale [24][25]. Lo studio si basa su 18 aziende ed è quindi una fotografia qualitativa piuttosto che un'indagine rappresentativa.

Molte pagine di fornitori su google.com citano guadagni molto più elevati (ad esempio il 25-35 percento di produttività in più) senza indicare una fonte. Questa guida non ripete tali cifre. La conclusione sobria: lo shop floor management non è uno strumento con un ROI garantito, ma un sistema di leadership il cui effetto dipende da quanto coerentemente viene gestito. Le sezioni seguenti mostrano da cosa dipende tale coerenza.

## I sei elementi della gestione del reparto produttivo

La letteratura struttura la gestione del reparto produttivo in modi diversi. ifaa distingue quattro elementi visibili (gestione visiva, KPI, comunicazione standard, problem solving sistematico) e tre fondamenta "invisibili" (principi di lavoro, comprensione dei ruoli, sostenibilità) [2]. Peters individua quattro elementi centrali: guidare sul posto, riconoscere gli scostamenti, risolvere i problemi in modo sostenibile e impiegare le risorse in modo ottimale [1]. WGP indica stabilità e standardizzazione come prerequisiti, e gestione delle prestazioni, problem solving e gestione dei miglioramenti, leadership sul posto, gestione visiva e sviluppo delle competenze come elementi di gestione [4]. Molte fonti statunitensi elencano tipicamente cinque "pilastri" con contenuti simili.

Il modello seguente riunisce queste visioni e si è dimostrato valido nella pratica:

| Elemento | Domanda chiave | Strumenti principali |
|---|---|---|
| 1. Dirigenti presenti sul reparto | I dirigenti vedono la realtà di persona? | Giro al gemba, standard di lavoro del dirigente |
| 2. Gestione visiva | Chiunque può capire in pochi secondi se le cose sono in linea con il piano? | Lavagna di reparto, andon, 5S, luci di stato |
| 3. KPI | Misuriamo ciò che il team può influenzare? | SQDCP, OEE, resa al primo passaggio |
| 4. Cadenza delle riunioni (comunicazione a livelli) | Le informazioni fluiscono in modo affidabile verso l'alto e verso il basso ogni giorno? | Riunioni a livelli, regole di escalation |
| 5. Problem solving | Le cause radice vengono eliminate in modo definitivo? | PDCA, 5 Perché, diagramma a lisca di pesce (Ishikawa), A3 |
| 6. Standardizzazione | Ciò che abbiamo imparato è stato consolidato? | Lavoro standard, istruzioni di lavoro |

### Elemento 1: Dirigenti presenti sul reparto

LEI descrive così la mentalità del gemba: si va al gemba per comprendere il lavoro, per guidare e per imparare [15]. Fujio Cho, già presidente e poi presidente del consiglio di amministrazione di Toyota, ha riassunto l'atteggiamento dei leader lean in tre imperativi: "Go see, ask why, show respect" [15]. La presenza non significa controllo; significa essere raggiungibili e interessati. La sezione 9 descrive in dettaglio come si presenta la presenza sotto forma di giro al gemba.

### Elemento 2: Gestione visiva

LEI definisce la gestione visiva come la collocazione di tutti gli strumenti, dei componenti, delle attività produttive e degli indicatori di prestazione "in piena vista", in modo che lo stato del sistema possa essere compreso a colpo d'occhio da tutti i soggetti coinvolti [20]. La gestione visiva è quindi molto più della lavagna: segnaletica a pavimento, pannelli ombra, cartellini kanban, luci andon e torrette luminose sulle macchine ne fanno tutte parte. [5S](https://www.m365.fm/entity/5s/) è spesso la base, perché gli scostamenti emergono solo in un ambiente ordinato. Approfondimenti: [Visual management](https://www.m365.fm/entity/visual-management/).

### Elemento 3: KPI

I KPI rendono oggettivi gli scostamenti. Devono soddisfare tre criteri: il team può influenzarli, sono disponibili tempestivamente e hanno un obiettivo. La sezione 7 spiega come sceglierli. Le basi sono nella pagina dell'entità [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) e nel compendio [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/).

### Elemento 4: Cadenza delle riunioni

La cadenza delle riunioni (le fonti tedesche la chiamano "Regelkommunikation", comunicazione standard) indica riunioni brevi, programmate e standardizzate davanti alla lavagna. Il suo elemento distintivo è la cascata: informazioni e problemi risalgono dal livello del team al livello di reparto e a quello di stabilimento, mentre supporto e decisioni tornano indietro [3][58]. La sezione 5 fornisce una matrice completa.

### Elemento 5: Problem solving

Senza problem solving, la gestione del reparto degenera in una sessione di reportistica. Ciò che conta è distinguere il contenimento rapido dall'eliminazione duratura delle cause radice. La sezione 8 ripercorre il percorso da un punto rosso sulla lavagna a uno standard aggiornato.

### Elemento 6: Standardizzazione

Gli standard sono al tempo stesso prerequisito e risultato. Senza uno standard non esiste uno scostamento, e senza l'aggiornamento dello standard ogni miglioramento va di nuovo perduto. WGP indica quindi esplicitamente stabilità e standardizzazione come prerequisiti [4]. Approfondimenti: [Standard work](https://www.m365.fm/entity/standard-work/).

## Riunioni a cascata: la cascata giornaliera

> **In breve:** Ogni livello si riunisce brevemente davanti alla propria lavagna, risolve ciò che può e passa il resto al livello successivo nello stesso giorno. Questo richiede orari fissi delle riunioni, criteri chiari di escalation e un dovere di risposta.

Le riunioni a livelli (dette anche tier meeting, tiered huddle, stand-up o riunioni giornaliere di responsabilizzazione) sono la struttura portante della cadenza delle riunioni. L'idea: ogni livello si incontra per un breve momento, esamina i propri KPI, risolve ciò che può e fa salire il resto al livello successivo, che si riunisce qualche tempo dopo. Il Kaizen Institute descrive la tipica struttura statunitense come quattro livelli, dai team di prima linea (livello 1) ai capisquadra (livello 2) e ai responsabili di reparto (livello 3) fino alla direzione dello stabilimento (livello 4), con i problemi che vengono escalati nello stesso giorno a un responsabile nominativo [58]. CETPM descrive la cadenza classica negli stabilimenti tedeschi come giornaliera o per turno a livello di team, settimanale a livello di reparto e mensile o trimestrale a livello di stabilimento [3]. In molti stabilimenti lean è ormai comune anche una riunione giornaliera ai livelli 2 e 3, in modo che un problema del primo turno arrivi al direttore di stabilimento la mattina stessa. Lo studio di ShopfloorPulse descrive la stessa struttura: le riunioni risalgono dal reparto produttivo con ritmi giornalieri, settimanali o mensili [25]. Per saperne di più sul termine, consultare la pagina dell'entità [Tier meeting](https://www.m365.fm/entity/tier-meeting/).

### Quanto deve durare una riunione a livelli?

Esistono valori guida documentati. Gelbrich indica circa 10-12 minuti a livello operativo e 20-30 minuti a livello direzionale; Orth indica 10, al massimo 20 minuti per le riunioni stand-up nelle aree indirette; Schwarz indica un massimo di 15 minuti nel suo esempio pratico, ma sottolinea che le prime riunioni durante l'avvio spesso richiedono 30 minuti o più [3]. Gelbrich annovera le riunioni che si protraggono troppo, soprattutto durante l'avvio, tra le dieci cause più comuni del fallimento della gestione di reparto [3].

### Matrice delle riunioni a livelli (progetto esemplificativo)

La seguente matrice è un progetto esemplificativo per uno stabilimento che lavora a turni, basato sulla prassi comune. Cadenza e durata seguono i valori guida documentati sopra; orari e partecipanti sono suggerimenti da adattare al proprio modello di turni e alla propria organizzazione.

| Caratteristica | Livello 1: team | Livello 2: area / capoturno | Livello 3: reparto / responsabile di produzione | Livello 4: stabilimento |
|---|---|---|---|---|
| Cadenza | ogni turno, all'inizio del turno | giornaliera | giornaliera (in alternativa settimanale) | giornaliera o settimanale, più una revisione mensile |
| Orario (esempio: il primo turno inizia alle 6:00) | dalle 6:10 alle 6:30, scaglionate per linea | 8:30 | 9:15 | 10:00 |
| Durata | 10-15 minuti | 15 minuti | 15-20 minuti | 20-30 minuti |
| Luogo | lavagna alla linea | lavagna di area | lavagna di reparto in reparto | lavagna di stabilimento (obeya room o in reparto) |
| Moderatore | team leader | capoturno / responsabile di turno | responsabile di produzione o di reparto | direttore di stabilimento |
| Partecipanti | team della linea o della cella | team leader dell'area, manutenzione e qualità secondo necessità | capiturno, rappresentanti di qualità, manutenzione, logistica, EHS (ambiente, salute e sicurezza) | responsabili di reparto, funzioni di supporto (qualità, supply chain, acquisti, risorse umane, finanza) |
| Orizzonte temporale | ultimo turno, turno in corso | ultime 24 ore, oggi | ieri, oggi, questa settimana | settimana, mese, andamento |
| KPI tipici | eventi di sicurezza, obiettivo di pezzi all'ora vs. effettivo, scarti, fermi, presenze | produzione, OEE dei colli di bottiglia, resa al primo passaggio, arretrato | consegne puntuali, costo della qualità, produttività, escalation aperte | vista SQDCP dello stabilimento, reclami dei clienti, costi, stato dei progetti |
| Decisioni | personale, contenimento, idee | riallocazione del personale tra le linee, priorità di manutenzione | risorse tra le aree, turni straordinari, gruppi di risoluzione dei problemi | investimenti in capitale, priorità, modifiche agli obiettivi |
| Escalare verso l'alto quando | il problema non può essere risolto entro il turno o mancano le risorse | il problema coinvolge più linee o richiede una funzione di supporto | il problema coinvolge clienti, budget o più reparti | aziendale, cliente, fornitore |

**Secondo e terzo turno:** il livello 1 opera ogni turno; i livelli da 2 a 4 di solito solo di giorno. Affinché i problemi del secondo e terzo turno non vadano persi, il responsabile di turno inserisce le escalation aperte sulla lavagna o nel registro di turno e le consegna di persona al primo turno. La riunione mattutina del livello 2 si apre con questi punti.

### Regole di escalation che funzionano

Una cascata è valida solo quanto le sue regole di escalation. Quattro principi si sono dimostrati efficaci:

1. **Trigger chiari invece dell'istinto.** Definisci per ogni KPI quando scalare, per esempio: "linea ferma per più di 30 minuti", "scarto sopra il limite per due ore consecutive", "infortunio o quasi-incidente: sempre".
2. **Tempistiche che si incastrano.** La riunione del livello superiore si tiene dopo quella del livello inferiore, così le escalation arrivano nello stesso giorno. Il facilitatore della riunione inferiore trasmette l'escalation di persona o tramite la lavagna.
3. **Dovere di risposta.** Ogni escalation riceve una risposta, al più tardi nella riunione successiva del livello inferiore. Il silenzio è il modo più rapido per distruggere una cultura dell'escalation.
4. **La sicurezza viene prima di tutto.** I problemi di sicurezza vengono scalati immediatamente, indipendentemente dalla cascata.

CETPM descrive un collegamento difettoso tra i livelli della gestione di reparto come un tipico ostacolo [3]. Questo corrisponde allo studio di KIT e IPRI: quando le azioni vengono tracciate su carta, l'escalation ai livelli superiori si interrompe e il monitoraggio delle azioni "dipende dalla disciplina delle singole persone" [24].

### Agenda standard di una riunione di livello 1 (massimo 15 minuti)

L'agenda utilizza il limite superiore di 15 minuti. I team ben allenati la completano in 10-12 minuti, l'intervallo che Gelbrich cita per il livello operativo [3].

| Minuto | Punto | Domanda guida |
|---|---|---|
| 0–2 | Sicurezza | Ci sono infortuni, quasi-incidenti o condizioni non sicure? |
| 2–6 | KPI di ieri / ultimo turno | Dove siamo in rosso, e perché? |
| 6–9 | Piano di oggi | Qual è l'obiettivo di oggi? Ci sono vincoli su persone, materiali, attrezzature? |
| 9–12 | Azioni | Quali azioni aperte scadono, cosa è fatto, di cosa serve aiuto? |
| 12–14 | Escalation | Cosa passiamo al livello 2? |
| 14–15 | Chiusura | Chi fa cosa entro quando? Ci sono riconoscimenti per il buon lavoro? |

Importante: la riunione di livello individua i problemi, assegna i responsabili e concorda il contenimento. L'analisi delle cause radice avviene successivamente, in un piccolo gruppo direttamente presso l'attrezzatura.

## La lavagna di reparto: struttura, campi e layout di esempio

> **In breve:** Una buona lavagna è leggibile da circa 3 m, mostra da quattro a sei KPI con obiettivi, segue l'agenda della riunione da sinistra a destra e collega ogni KPI in rosso a un'azione. La squadra la mantiene autonomamente.

La lavagna di reparto (chiamata anche huddle board, tier board, SQDCP board o performance board) è lo strumento centrale della cadenza delle riunioni. ifaa ne descrive i compiti così: visualizza i KPI selezionati di un'area, mostra le azioni di miglioramento con il loro stato in modo che se ne possa seguire l'effetto sui KPI, e contiene le informazioni di controllo giornaliere, soprattutto la situazione attuale di ordini e capacità [2]. Come categorie di esempio ifaa elenca qualità, costi, logistica, sicurezza, personale, capacità e situazione ordini, e obiettivi e azioni (miglioramento continuo); i KPI di esempio includono first pass yield, tassi ppm, OEE, consegna puntuale, dati sugli infortuni, stato delle 5S e tasso di presenza [2].

### Regole di progettazione

- **Leggibile da circa 3 m:** stato rosso/verde e numeri grandi, niente tabelle con trenta colonne.
- **Da quattro a sei KPI:** CETPM raccomanda circa quattro-sei KPI che il team può influenzare [3]; il fornitore di formazione tedesco Haufe Akademie cita da cinque a sette come limite superiore [43].
- **Obiettivo accanto al valore reale:** ogni KPI ha un obiettivo e un trend.
- **Raccontare la storia da sinistra a destra:** la lavagna segue l'agenda della riunione, quindi il facilitatore si sposta semplicemente da sinistra a destra.
- **Azioni visibili:** ogni KPI in rosso è collegato a un'azione o a una scheda di problem solving.
- **Di proprietà del team:** la squadra mantiene la lavagna da sola. Una lavagna compilata da finanza o IT che nessuno del team capisce verrà ignorata.

### Layout di esempio di una lavagna di livello 1

Il layout seguente mostra una lavagna per una linea di assemblaggio con tre righe e cinque colonne. Funziona su una lavagna bianca (circa 2 × 1,2 m) così come su uno schermo.

| | Colonna A: Sicurezza (S) | Colonna B: Qualità (Q) | Colonna C: Consegna (D) | Colonna D: Costo / produttività (C) | Colonna E: Persone (P) |
|---|---|---|---|---|---|
| **Riga 1: stato attuale** | Croce sulla sicurezza (calendario mensile, ogni giorno verde, giallo o rosso) | Scarti e rielaborazioni per turno vs. obiettivo | Obiettivo del piano giornaliero vs. effettivo, arretrato | Obiettivo di unità per ora vs. effettivo (grafico ora per ora) | Presenze, matrice delle competenze (chi sa fare cosa) |
| **Riga 2: andamento** | Quasi incidenti delle ultime 4 settimane | Resa al primo passaggio, primi 3 tipi di difetto (Pareto) | Consegna puntuale questa settimana | OEE del collo di bottiglia, primi 3 motivi di fermo, [micro fermate](https://www.m365.fm/entity/micro-stops/) | Piano ferie e formazione |
| **Riga 3: azioni** | Azioni di sicurezza aperte | Schede di problem solving / A3 in corso | Escalation al livello 2 e relative risposte | Elenco azioni (cosa, chi, entro quando, stato) | Idee e suggerimenti con stato |

La maggior parte delle lavagne include anche un'intestazione con nome del team, obiettivo di area e ora dell'ultimo aggiornamento, oltre a un campo "standard e audit" (ad esempio, il risultato dell'ultimo audit 5S). Nota sull'ordine delle colonne: l'originale tedesco di questa guida usa SQCDP, che pone il costo prima della consegna; gli stabilimenti statunitensi scrivono più spesso SQDCP. L'ordine di C e D conta meno del fatto di mettere la sicurezza per prima.

### Contenuto della lavagna per livello

Salendo di livello la lavagna diventa più aggregata e l'orizzonte temporale più lungo. Il fornitore MES Symestic descrive questo fenomeno con due regole di coerenza: i KPI vengono condensati e rivisti meno spesso man mano che si sale, ma devono risalire agli stessi dati a ogni livello [41].

| Livello | Dettaglio | Orizzonte temporale tipico | Esempio di qualità |
|---|---|---|---|
| Livello 1 | postazione, ora | turno | difetti per ora alla postazione 3 |
| Livello 2 | linea, turno | giorno | tasso di scarto per linea |
| Livello 3 | area, giorno | settimana | resa al primo passaggio e costo della qualità per area |
| Livello 4 | stabilimento, settimana | mese | reclami dei clienti in ppm, costo della scarsa qualità |

## KPI di reparto: scegliere metriche SQDCP efficaci

La maggior parte delle lavagne segue un ordine fisso di dimensioni. La più comune è **SQDCP** (o SQCDP): sicurezza, qualità, consegna, costo e persone [41]. Esistono varianti come SQDC (senza P), SQDCM (M per morale) o SQDCE con ambiente. CETPM elenca come dimensioni tipiche i temi di sicurezza, qualità, costo, affidabilità delle consegne e persone [3]. L'ordine è deliberato: la sicurezza viene sempre per prima.

### Tre domande guida per scegliere i KPI

Gelbrich propone tre domande da cui derivare KPI adeguati [3]:

1. Come deve apparire l'output del mio processo in termini di tempi e qualità?
2. Come posso mostrare l'efficacia delle mie azioni in termini di costi e risorse?
3. Cosa riflette un'esecuzione responsabile del mio processo in termini di sicurezza e ambiente?

Il suo principio centrale, riformulato come variazione di una celebre citazione di Drucker: ciò che il team non può influenzare non dovrebbe essere misurato sulla sua lavagna [3].

### Catalogo dei KPI per la lavagna di reparto

| Dimensione | KPI | Definizione / calcolo | Livello |
|---|---|---|---|
| S | Giorni dall'ultimo infortunio registrabile | giorni di calendario dall'ultimo caso registrabile OSHA (vedi nota sotto) | 1–4 |
| S | Tasso totale di infortuni registrabili (TRIR) | numero di infortuni e malattie registrabili × 200.000 / ore totali lavorate; 200.000 ore equivalgono a 100 lavoratori a tempo pieno per un anno [51] | 3–4 |
| S | Quasi incidenti (segnalati) | segnalazioni a settimana (più segnalazioni sono inizialmente un buon segno) | 1–3 |
| Q | Tasso di scarto | quantità scartata / quantità totale; vedi [tasso di scarto](https://www.m365.fm/entity/scrap-rate/) | 1–3 |
| Q | Resa al primo passaggio (FPY) | pezzi buoni al primo passaggio / pezzi avviati | 1–3 |
| Q | Reclami dei clienti | conteggio o ppm | 3–4 |
| D | Unità obiettivo vs. effettive | per ora o per turno | 1–2 |
| D | Consegna puntuale | ordini consegnati in tempo / tutti gli ordini | 2–4 |
| D | Arretrato | quantità aperta vs. piano | 1–3 |
| C | OEE | disponibilità × prestazione × qualità [22] | 1–3 |
| C | Produttività | pezzi buoni per ora di lavoro | 2–4 |
| C | Tempo di cambio produzione | tempo dall'ultimo pezzo buono al primo pezzo buono del successivo ordine | 1–2 |
| P | Presenze / organico | dipendenti presenti / pianificati | 1–2 |
| P | Livello di polivalenza | quota di attività coperte nella matrice delle competenze | 1–2 |
| P | Idee attuate | suggerimenti di miglioramento attuati al mese | 1–3 |

**Nota sui KPI di sicurezza negli stabilimenti statunitensi:** I contatori "giorni senza infortuni" sono molto diffusi, ma l'OSHA ha avvertito che gli incentivi basati su tassi (ad esempio un premio per un mese senza infortuni) possono scoraggiare la segnalazione. Nel suo memorandum dell'11 ottobre 2018, l'OSHA afferma che tali programmi sono consentiti ai sensi del 29 CFR 1904.35(b)(1)(iv) solo se non vengono attuati in modo da scoraggiare la segnalazione, e che una politica di non ritorsione da sola "may not, by itself, be adequate" [50]. L'OSHA raccomanda un processo per la segnalazione di infortuni, malattie, quasi incidenti/near miss e pericoli, con un'opzione anonima [49]. Per il consiglio di amministrazione questo significa mostrare i near miss e le segnalazioni di pericolo accanto al conteggio degli infortuni, e non legare mai un premio di squadra al solo risultato di un "clean safety cross".

L'OEE (overall equipment effectiveness) deriva dalla manutenzione produttiva totale; LEI individua sei grandi perdite: guasti, setup e regolazioni, fermate brevi, riduzione della velocità, scarti e rilavorazioni [22]. Sulla lavagna, il valore dell'OEE in sé conta meno della scomposizione per tipo di perdita, perché è da lì che il team può ricavare le azioni. Il compendio m365.fm [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) tratta queste metriche in profondità.

### Cosa mostra la ricerca sui KPI nella gestione del reparto produttivo

Nello studio KIT e IPRI, il 94 percento delle aziende intervistate monitorava i KPI di qualità e produttività nella gestione del reparto produttivo, mentre i KPI di costo erano raramente utilizzati [24][25]. L'uso di KPI digitali quasi in tempo reale era l'eccezione, con poco più del 15 percento delle citazioni, e la previsione degli scostamenti non era una realtà in nessuna delle aziende intervistate [24].

## Risoluzione dei problemi in reparto: dal contenimento allo standard

Un campo rosso sulla lavagna è l'inizio, non la fine. La risoluzione dei problemi nella gestione del reparto segue uno schema derivato direttamente dalle regole d'oro della gestione gemba [11]:

| Fase | Cosa succede | Chi | Quando |
|---|---|---|---|
| 1. Rilevare | Lo scostamento diventa visibile sulla lavagna o tramite andon | team | immediatamente o nella riunione di livello |
| 2. Contenere | Il contenimento protegge il cliente (ad es. controllo al 100 percento, quarantena, ricambio) | capo team | nello stesso turno |
| 3. Comprendere | Verifica del gembutsu sul posto, raccolta dati, osservazione del processo | piccolo team presso l'impianto | dopo la riunione |
| 4. Individuare la causa radice | 5 Perché, diagramma di Ishikawa, A3 per problemi complessi | team di risoluzione problemi | da giorni a settimane |
| 5. Correggere | Implementare la contromisura permanente | responsabile per lista azioni | secondo il piano |
| 6. Verificare l'effetto | Osservare il KPI per un periodo definito | capo team | dopo l'implementazione |
| 7. Standardizzare | Aggiornare standard, istruzione di lavoro e formazione; condividere tra le linee (yokoten) | supervisore, process owner | dopo che l'effetto è dimostrato |

Un'azione si considera chiusa solo quando il suo effetto appare nel KPI. La regola sembra banale, ma molti stabilimenti la infrangono: le liste di azioni vengono riportate come "verdi" mentre il difetto ritorna la settimana successiva.

### Quale metodo per quale problema?

| Tipo di problema | Caratteristica | Metodo | Tempo necessario |
|---|---|---|---|
| Semplice, causa ovvia | causa e rimedio chiari nella riunione | azione diretta con scadenza | minuti |
| Ricorrente, causa non chiara | si ripresenta più volte, il team non è sicuro della causa | 5 Perché, Ishikawa | ore |
| Complesso, interfunzionale | più cause, più reparti | risoluzione problemi A3 basata sul PDCA | settimane |
| Sistemico, strategico | interessa il flusso del valore, il layout, il prodotto | evento kaizen, mappatura del flusso del valore | da settimane a mesi |

A3 è particolarmente utile perché riunisce problema, stato attuale, analisi della causa radice, stato obiettivo, contromisure e monitoraggio su un unico foglio di carta A3 (297 × 420 mm, vicino al formato US tabloid 11 × 17 in., che la maggior parte degli stabilimenti statunitensi usa invece). La pagina di entità [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) offre un'introduzione, e il compendio [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) copre il livello sistemico. Il ciclo PDCA (plan, do, check, act), solitamente attribuito a W. Edwards Deming (lo stesso Deming accreditava Walter A. Shewhart), è la base di tutti i processi di risoluzione dei problemi [1].

## Il gemba walk: fasi, domande e checklist

> **In breve:** Un gemba walk ha un tema, parte dalla lavagna, osserva il lavoro per più cicli, pone domande aperte e si conclude con un feedback concordato con il team. Senza un tema e un follow-up è solo una passeggiata.

Il gemba walk è la routine di leadership più importante nella gestione del reparto produttivo. Il Lean Lexicon lo definisce come "una pratica di management per comprendere la situazione attuale attraverso l'osservazione diretta e l'indagine prima di intraprendere azioni" [7]. Un'introduzione sintetica è disponibile anche nel post [What is a gemba walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/) e nella pagina dedicata [Gemba walk](https://www.m365.fm/entity/gemba-walk/).

### Tre tipi di gemba walk

Jim Womack, fondatore di LEI, afferma che lui e Dan Jones hanno utilizzato per primi il termine "gemba walk" all'inizio degli anni '90, inizialmente per manager che percorrevano l'intero flusso del valore di un prodotto attraverso reparti e aziende [14]. Oggi egli distingue due forme e ne separa una terza, ormai diffusa, dell'uso del termine [14]:

| Tipo | Scopo | Frequenza tipica | Chi |
|---|---|---|---|
| Value stream walk | sensibilizzare sul miglioramento fondamentale end-to-end | secondo necessità, ad esempio trimestrale | leadership di stabilimento e di area, tutte le funzioni lungo il flusso del valore |
| Management system walk | verificare se il sistema di gestione è in grado di mantenere la stabilità (lavagne, standard, escalation) | da settimanale a giornaliera | leader di tutti i livelli |
| Problem-focused walk (genchi genbutsu) | risalire alla causa di un problema specifico sul posto | secondo necessità | responsabili dei problemi, specialisti |

Womack è critico nei confronti del terzo uso e lo avvicina al "management by walking around": se la gestione quotidiana funziona, i problemi dovrebbero già essere risolti nella cascata, invece di manager di vertice e staff del miglioramento che corrono al gemba per spegnere incendi. Il loro tempo è meglio investito in value stream walk e management system walk [14].

### Le tre domande guida di LEI: scopo, processo, persone

LEI raccomanda di strutturare il gemba walk attorno a tre dimensioni [7]:

1. **Scopo:** quale problema risolve questo processo per il cliente?
2. **Processo:** come si svolge realmente il lavoro, rispetto a come lo descrive lo standard?
3. **Persone:** i collaboratori sono coinvolti nella creazione, nel mantenimento e nel miglioramento del processo?

LEI raccomanda inoltre di seguire una famiglia di prodotti o un processo rivolto al cliente dall'inizio alla fine e di coinvolgere tutti gli interessati, poiché il valore scorre orizzontalmente tra i reparti [7].

### Gemba walk vs. management by walking around

Il gemba walk viene spesso equiparato al "management by walking around" (MBWA). L'MBWA è nato in Hewlett-Packard; il co-fondatore David Packard aveva ripreso la pratica da General Electric. È diventato famoso grazie al libro "In Search of Excellence" di Tom Peters e Robert Waterman (1982) [16]. Le differenze restano considerevoli:

| Caratteristica | Gemba walk | Management by walking around |
|---|---|---|
| Scopo | comprendere il processo, individuare scostamenti dallo standard, sviluppare la capacità di risolvere i problemi | vicinanza ai collaboratori, scambio informale, percezione del clima |
| Struttura | tema, percorso, domande guida, follow-up | per lo più non strutturato e spontaneo |
| Riferimento | standard, KPI, lavagna | persone e conversazione |
| Risultato | osservazioni specifiche, coaching, azioni | relazione, informazioni |
| Ancorato a | standard work del leader, ritmo fisso | stile di leadership personale |

I due approcci non si escludono a vicenda: una chiacchierata informale di passaggio non sostituisce un gemba walk, ma non lo danneggia. Il post [Gemba walk vs. management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/) confronta i due concetti in modo più approfondito.

### Come svolgere un gemba walk in sette passi

**1. Definire un tema.** Ogni gemba walk ha un focus, ad esempio "cambio formato sulla linea 4", "uso della nuova istruzione di controllo" o "effetto delle azioni emerse dalla riunione tier 3". Senza un tema la visita diventa un giro turistico.

**2. Preparare.** Rivedere i KPI e la lavagna dell'area, controllare le azioni aperte, portare lo standard (istruzione di lavoro, foglio di standard work). Avvisare il team in anticipo, così che la visita non venga percepita come un'ispezione a sorpresa. Il post [Gemba walk preparation: team and roles](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/) contiene suggerimenti.

**3. Inizia dalla lavagna.** La lavagna mostra ciò che il team stesso considera un problema. Chiedi: "Cosa ti sta dicendo oggi la tua lavagna?"

**4. Osserva.** Fermati a una postazione di lavoro e guarda più cicli. Confronta quello che vedi con lo standard. Annota fatti, non interpretazioni.

**5. Fai domande.** Domande aperte e rispettose alla persona che svolge il lavoro. Non distribuire soluzioni.

**6. Riassumi e ringrazia.** Alla fine, riprendi brevemente ciò che hai imparato e concordate cosa succede delle osservazioni.

**7. Dai seguito.** Documenta le osservazioni, porta le azioni nella riunione di livello corretto, dai un riscontro al team. Un giro senza riscontro mina la fiducia.

**Non dimenticare il secondo e il terzo turno.** In uno stabilimento a tre turni, i leader che camminano solo durante il turno diurno vedono un terzo dell'operatività. Pianifica un giro nei turni notturni almeno occasionalmente; problemi di personale, di supporto manutentivo e di passaggio di consegne spesso emergono lì per primi (raccomandazione pratica).

**Quanto deve durare un gemba walk?** Le fonti qui utilizzate non indicano un valore fisso. In pratica, un giro mirato sul sistema di gestione in un'area dura da 20 a 45 minuti; un giro lungo la catena del valore di un'intera famiglia di prodotti può richiedere mezza giornata. La giornata di esempio nella sezione 10 prevede 30 minuti. Si tratta di valori pratici, non di affermazioni tratte dalle fonti.

### Banca dati delle domande per il gemba walk

**Scopo e obiettivi**
- Chi è il cliente di questo processo e di cosa ha bisogno?
- Qual è l'obiettivo del turno oggi e come sai se lo stai raggiungendo?
- Quale KPI conta di più per te in questo momento, e perché?

**Processo e standard**
- Come si svolge normalmente questa fase? Puoi mostrarmelo?
- Dove è scritto lo standard e corrisponde alla realtà?
- Come ti accorgi subito che qualcosa non va qui?
- Cosa succede quando manca materiale o la macchina si ferma?
- Dove aspetti, cerchi oggetti o devi rifare qualcosa?

**Problemi e problem solving**
- Qual è l'ultimo problema che hai risolto qui?
- Quale problema ti fa perdere più tempo in questo momento?
- Cosa succede quando segnali un problema? Quanto rapidamente arriva l'aiuto?
- Quale azione sulla lavagna è in ritardo, e di cosa ha bisogno?

**Persone**
- Cosa ti impedisce di svolgere bene il tuo lavoro?
- Cosa cambieresti se decidessi tu?
- Oltre a te, chi può svolgere questo compito?
- Cosa posso fare per sostenerti?

### Checklist del gemba walk

Stampala o trasformala in un modulo digitale (vedi sezione 17). Una versione più lunga con domande specifiche per ruolo è nel post [Gemba walk checklist and questions](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/).

- [ ] Argomento e area sono definiti.
- [ ] KPI, stato della lavagna e azioni aperte sono stati esaminati in anticipo.
- [ ] Lo standard pertinente è a portata di mano (stampato o su tablet).
- [ ] Il team o il team leader è stato informato.
- [ ] Dispositivi di protezione individuale (DPI) e regole di sicurezza dell'area sono rispettati.
- [ ] Almeno una postazione di lavoro è stata osservata per più cicli.
- [ ] Le domande erano aperte; non sono state dettate soluzioni.
- [ ] Le osservazioni sono state annotate come fatti (luogo, orario, cosa è stato visto).
- [ ] Le buone pratiche sono state riconosciute.
- [ ] Gli accordi sono stati riassunti.
- [ ] Le azioni sono state inserite nell'elenco delle azioni o nella riunione del livello successivo.
- [ ] Il riscontro al team è stato programmato.

### Errori comuni nel gemba walk

| Errore | Perché fa danno | Meglio |
|---|---|---|
| Gemba walk come ispezione | le persone nascondono i problemi | chiedere invece di controllare; trattare i problemi come un dono |
| Dettare soluzioni sul momento | il team smette di risolvere problemi, il leader diventa un collo di bottiglia | guidare con le domande, far sviluppare la soluzione al team |
| Nessun argomento, nessun percorso | il giro resta superficiale | fissare un focus, portare lo standard |
| Parlano solo i leader | le conoscenze degli esperti restano inutilizzate | ascoltare l'80 percento del tempo |
| Nessun seguito | perdita di fiducia, "tanto non cambia mai niente" | riscontro entro una settimana |
| Giri irregolari | il giro sembra un evento straordinario | ritmo fisso nello standard di lavoro del leader |
| Colpevolizzazione | paura, i problemi vengono nascosti | mettere in discussione il processo e il sistema, non le persone |

Molti di questi errori hanno una radice comune: il giro viene inteso come controllo. Il post [Gemba walk mistakes: when the walk becomes an inspection](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/) approfondisce il tema. Womack descrive il proprio atteggiamento così: "I've never invented anything. I just take walks, comment on what I see, and give courage to people to try" (citato nella prefazione di John Shook) [15].

## Standard work per i leader: la leadership come routine

Il leader standard work applica il principio dello standard work ai leader. LEI lo descrive come "kaizen per il management": combinato con i comportamenti di leadership giusti, il leader standard work sposta il ruolo dei manager dall'essere i principali risolutori di problemi al costruire la capacità di problem solving delle loro persone [18].

In "Creating a Lean Culture", David Mann individua quattro elementi principali di un sistema di lean management: leader standard work, controlli visivi, un processo quotidiano di accountability e disciplina della leadership [19]. La quota di lavoro standardizzato diminuisce a ogni livello della gerarchia: gli operatori possono lavorare secondo standard il 100 percento del tempo, un supervisore circa l'80 percento della giornata; ai livelli superiori la quota scende ulteriormente [19].

### Esempio: leader standard work per un supervisore di produzione

| Orario | Attività | Evidenza |
|---|---|---|
| 6:00–6:10 | Passaggio di consegne di turno, verifica delle lavagne su tutte le linee | Registro di passaggio firmato |
| 6:10–6:30 | Partecipazione a due delle riunioni tier 1 scaglionate (a rotazione) | Lista presenze |
| 6:30–6:45 | Process confirmation: verifica di uno standard su una linea | Scheda di audit |
| 6:45–8:15 | Presenza in reparto: supporto nei guasti, risoluzione di carenze di materiale e personale, controllo delle lavagne | Note, lista azioni |
| 8:30–8:45 | Facilitazione della riunione tier 2 | Lavagna tier 2 |
| 8:45–9:00 | Preparazione delle escalation per il tier 3 | Lista escalation |
| 9:15–9:35 | Partecipazione alla riunione tier 3 | Lavagna tier 3 |
| 10:00–11:00 | Coaching di un team di problem solving (A3) | Stato A3 |
| 13:00–13:30 | Gemba walk su un tema focus | Note, azioni |
| 13:30–14:00 | Preparazione del passaggio di consegne di turno | Registro di passaggio |

Il piano è un esempio pratico, non un riferimento normativo. Su un turno dalle 6:00 alle 14:00 struttura ben oltre due terzi della giornata; Mann descrive circa l'80 percento come raggiungibile a questo livello [19]. Il resto resta volutamente aperto per l'imprevisto, le questioni relative alle persone e i progetti. Il leader standard work è a sua volta visibile: molti stabilimenti espongono sulla lavagna le routine standard dei leader e spuntano le attività completate. Ciò crea accountability in entrambe le direzioni.

### Process confirmation (layered process audit)

Un elemento chiave del leader standard work è la process confirmation: i leader di diversi livelli verificano brevemente e con un ritmo fisso se uno standard viene rispettato e se lo standard è ancora adeguato. Più livelli controllano gli stessi processi con frequenze diverse, ad esempio il team leader quotidianamente, il supervisore settimanalmente, il plant manager mensilmente. Negli stabilimenti statunitensi, soprattutto nelle catene di fornitura automobilistiche, la pratica è generalmente nota come layered process audit (LPA). Le deviazioni non vengono punite; sono trattate come un segnale di standard non adeguato o di formazione mancante.

## Andon: rendere visibili le deviazioni in tempo reale

LEI definisce l'andon come uno strumento di gestione visiva che mostra a colpo d'occhio lo stato delle operazioni in un'area e segnala ogni volta che si verifica un'anomalia [17]. Il segnale viene attivato da una fune o un pulsante alla postazione di lavoro, oppure automaticamente da un sensore della macchina. In Toyota la linea continua a funzionare dopo che la fune è stata tirata, mentre il team cerca di risolvere il problema; se questo non riesce entro il ciclo, la linea si ferma in una posizione fissa alla fine della stazione [17]. Il numero della stazione illuminato richiama il team leader, che è tenuto a rispondere rapidamente [17].

Nella gestione operativa di reparto, l'andon colma il divario tra le riunioni programmate: la riunione di tier guarda a ieri e pianifica oggi, l'andon interviene subito. In Toyota un team leader (hancho) guida un team di cinque-otto persone, risponde alle fermate di linea e alle chiamate andon, guida le attività di miglioramento e verifica quotidianamente il rispetto dello standard di lavoro con fogli di audit [21]. Questo è importante quando si trasferisce il modello agli stabilimenti occidentali: il team leader Toyota è un dipendente a ore, senza potere disciplinare e senza una postazione fissa sulla linea; padroneggia tutti i compiti del team e sostituisce in caso di pause, assenze o arretrati [21]. Se si aggiunge questo ruolo a un lead operator completamente vincolato al tempo ciclo della linea, non si otterrà una risposta andon rapida. Lo stesso vale per un team leader responsabile di 25 persone.

Gli eventi andon devono comparire sulla lavagna: numero di chiamate per turno, tempo medio di risposta e motivi più frequenti. Molte chiamate non sono inizialmente un segnale negativo; mostrano che il team sta rendendo visibili i problemi.

## Ruoli e responsabilità

| Ruolo | Compiti nella gestione operativa di reparto |
|---|---|
| Direttore di stabilimento | modello di riferimento, facilita il tier 4, va regolarmente al gemba, decide le risorse per le escalation, distribuisce gli obiettivi (ad esempio tramite hoshin kanri) |
| Responsabile di reparto / di produzione | facilita il tier 3, fa da coach ai supervisori, garantisce che i livelli siano collegati |
| Supervisore / capoturno | facilita il tier 2, conferma di processo, fa da coach ai team leader |
| Team leader | facilita il tier 1, mantiene la lavagna con il team, risponde all'andon, attiva il contenimento |
| Operatori e tecnici | segnalano le deviazioni, contribuiscono con idee, sono responsabili delle azioni, mantengono parti della lavagna |
| Funzioni di supporto (qualità, manutenzione, supply chain, EHS) | partecipano ai tier 2 e 3, prendono in carico i problemi escalati, forniscono dati |
| Shop floor coach / specialista lean o CI | assiste alle riunioni, fornisce feedback sulla facilitazione, forma alla risoluzione dei problemi |
| Rappresentanti dei dipendenti (sindacato, comitato per la sicurezza; in Germania il consiglio di fabbrica) | coinvolti in una fase iniziale; garantiscono che i KPI non vengano usati per monitorare il comportamento o le prestazioni dei singoli (vedi sezione 13) |

CETPM descrive shop floor coach che osservano le riunioni e forniscono feedback successivamente [3]. Questo ruolo viene spesso sottovalutato durante l'implementazione: un team leader che non ha mai facilitato una riunione ha bisogno di un feedback concreto nelle prime settimane.

### Come cambia il ruolo del leader

| Prima | Nella gestione operativa di reparto |
|---|---|
| risolve personalmente i problemi | sviluppa la capacità di problem solving del team |
| riceve le segnalazioni in ufficio | vede la realtà sul campo |
| chiede "Chi ha fatto questo?" | chiede "Cosa nel processo ha permesso questo?" |
| risponde alle escalation via email | risponde alle escalation nella riunione successiva |
| giudica i KPI | usa i KPI per avviare un confronto |

## Cultura, sicurezza psicologica e regole per il monitoraggio dei dipendenti

La gestione di reparto funziona solo quando i problemi vengono nominati apertamente. Sembra ovvio, ma in molte organizzazioni non è così. Un campo rosso sulla lavagna che porta a critiche verso il team verrà dipinto di verde la volta successiva.

La ricercatrice in campo organizzativo Amy Edmondson di Harvard ha definito il concetto di sicurezza psicologica di gruppo: "una convinzione condivisa dai membri di un team secondo cui il team è sicuro per assumersi rischi interpersonali" [23]. Il suo studio su 51 team di lavoro presso un produttore di mobili con circa 5.000 dipendenti è stato pubblicato su Administrative Science Quarterly nel 1999 [23] ed è uno dei lavori più citati sul comportamento di apprendimento nei team. Per la gestione di reparto l'implicazione è chiara: solo nei team psicologicamente sicuri gli errori vengono segnalati, i quasi incidenti documentati e gli standard messi in discussione.

### Come i leader costruiscono la sicurezza psicologica alla lavagna

- **Il rosso è benvenuto.** Ringraziate le persone per ogni problema reso visibile. La reazione al primo campo rosso determina tutti quelli che seguono.
- **Processo, non persona.** Chiedete delle condizioni, non dei colpevoli.
- **Mostrate i vostri errori.** I leader che ammettono apertamente i propri errori abbassano la soglia per gli altri.
- **Rispondete alle segnalazioni.** Chi segnala e non riceve mai risposta smette di segnalare.
- **Implementate le idee.** L'attuazione visibile dei suggerimenti è la forma di riconoscimento più forte. Lo studio KIT e IPRI ha criticato il fatto che i dipendenti spesso non potessero vedere lo stato dei propri suggerimenti, il che riduce la motivazione [24].
- **Non punite le segnalazioni di sicurezza.** L'OSHA si aspetta che i lavoratori "non subiscano ritorsioni" quando segnalano infortuni, malattie e pericoli [49]; la reazione alla lavagna è il punto in cui questa aspettativa diventa reale.

Il post [Cultura dell'eccellenza operativa in reparto](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/) descrive come radicare una simile cultura nel lungo periodo; il compendio [Eccellenza operativa](https://www.m365.fm/en/learn/operational-excellence/) la colloca nel contesto più ampio. Haufe Akademie indica l'hansei, la pratica giapponese della riflessione autocritica, come elemento costitutivo di una cultura positiva dell'errore [43].

### Regole per il monitoraggio dei dipendenti: diritto del lavoro statunitense e comitati aziendali tedeschi

Una lavagna digitale che mostra i dati delle macchine accanto ai accessi degli utenti può essere letta come un sistema di monitoraggio. Quanto questo conti dipende da dove si trova lo stabilimento. Quanto segue è un'informazione generale, non una consulenza legale; fate esaminare da un consulente del lavoro ogni introduzione digitale.

**Negli Stati Uniti.** Non esiste un diritto generale di codeterminazione paragonabile a quello tedesco, ma si applicano diverse regole:

- **Stabilimenti sindacalizzati:** Il NLRB ha considerato l'installazione e l'uso di telecamere di sorveglianza nascoste una materia obbligatoria di contrattazione (Colgate-Palmolive, 1997), una posizione confermata dal Settimo Circuito in National Steel Corp. v. NLRB (2003) [54]. Se una specifica lavagna digitale con dati personali rientri nell'obbligo di contrattazione è una questione da valutare caso per caso; la via sicura è coinvolgere il sindacato prima dell'introduzione.
- **Stabilimenti non sindacalizzati:** Nell'ottobre 2022 l'allora General Counsel del NLRB ha emesso il memo GC 23-02, secondo cui il monitoraggio elettronico invasivo può interferire con i diritti della Sezione 7 del NLRA dei dipendenti e ha sollecitato la divulgazione delle tecnologie di monitoraggio [52]. Il 14 febbraio 2025 il General Counsel facente funzione ha revocato tale memo (GC 25-05) [53]. Il NLRA in sé non è cambiato, quindi un monitoraggio che tende a scoraggiare attività protette resta un rischio.
- **Leggi statali sull'informativa:** Alcuni stati richiedono un'informativa sul monitoraggio elettronico. New York, ad esempio, impone ai datori di lavoro di fornire un preavviso scritto al momento dell'assunzione ai dipendenti il cui uso del telefono, della posta elettronica o di internet viene monitorato [55]. Un'app di reparto che registra l'uso individuale del sistema può ricadere in tali norme.
- **Segnalazione di sicurezza:** Come mostrato nella sezione 7, le norme OSHA tutelano i dipendenti che segnalano infortuni [49][50]. Una lavagna che individua la persona che ha segnalato un incidente lavora contro questa tutela.

**In Germania (rilevante per le aziende statunitensi con stabilimenti tedeschi o una capogruppo tedesca).** Coinvolgere il consiglio di fabbrica (Betriebsrat, l'organo eletto dei dipendenti con diritti legali di co-determinazione) non è una formalità. ifaa raccomanda di coinvolgerlo fin dall'inizio e di progettare i KPI in modo che non nasca alcun timore di sorveglianza [2]. Con le bacheche digitali che utilizzano dati di macchine e dati personali si applica il paragrafo 87(1) n. 6 della legge tedesca sull'organizzazione aziendale (BetrVG): il consiglio di fabbrica ha voce in capitolo su "l'introduzione e l'uso di dispositivi tecnici destinati a monitorare il comportamento o le prestazioni dei dipendenti" [44]. Secondo la Corte federale del lavoro (BAG), è sufficiente che un sistema sia oggettivamente idoneo a raccogliere dati sul comportamento o sulle prestazioni; l'intenzione del datore di lavoro di effettuare il monitoraggio non conta [48]. Questo vale in generale per Power BI, Power Apps o un MES con accessi utente. Si applica inoltre il GDPR. In pratica, i dettagli vengono regolati da un accordo aziendale (Betriebsvereinbarung).

**Cosa funziona in entrambi i Paesi:** una regola scritta che definisca quali dati vengono mostrati e a quale livello di aggregazione, chi può vedere quali report, per quanto tempo i dati vengono conservati e che i KPI valutano i processi, non le persone. È lo stesso contenuto che coprirebbe un accordo aziendale tedesco, e offre a un sindacato o a una forza lavoro statunitense una risposta chiara alla domanda "Questo verrà usato contro di noi?"

## Come implementare la gestione shop floor: una roadmap in sei fasi

> **In breve:** iniziate con un'area pilota, progettate la bacheca insieme al team, fate funzionare il sistema per circa tre mesi con coaching e costruite il livello successivo solo quando quello inferiore funziona in modo affidabile.

ifaa ha descritto un modello di introduzione in sei fasi e lo ha testato in diverse piccole e medie imprese; la valutazione ha mostrato che il concetto può essere introdotto con mezzi semplici [2]. La roadmap seguente si basa su questo modello e aggiunge il gemba walk, la cascata e la digitalizzazione.

| Fase | Contenuto | Partecipanti | Durata (valore indicativo) |
|---|---|---|---|
| 1. Definire gli obiettivi | definire obiettivi, area pilota e criteri di successo; sopralluogo in stabilimento | direzione aziendale, responsabili di produzione, responsabile del progetto, facilitatore | mezza giornata secondo ifaa [2] |
| 2. Informare e creare consapevolezza | sessione informativa con domande e risposte; coinvolgere i rappresentanti dei dipendenti | direzione, responsabili, dipendenti dell'area pilota, sindacato o consiglio di fabbrica ove previsto | mezza giornata secondo il dato ifaa [2] |
| 3. Introdurre | progettare la bacheca con il team, scegliere i KPI, esercitare la facilitazione | responsabili e dipendenti dell'area pilota, da 6 a 8 persone | due blocchi di mezza giornata di al massimo 4 ore ciascuno secondo ifaa [2] |
| 4. Sperimentazione | riunioni quotidiane in reparto, coaching, miglioramento iterativo della bacheca | team pilota, coach | circa 3 mesi secondo ifaa [2] |
| 5. Verifica intermedia | osservazione neutrale delle riunioni, feedback | osservatori interni o esterni | regolarmente durante la sperimentazione [2] |
| 6. Validare e estendere | workshop di valutazione, standardizzare bacheca e riunione, costruire la cascata, ulteriori aree | tutti i partecipanti al progetto, poi ulteriori aree | workshop di 2 o 3 ore secondo ifaa [2], estensione in base alle dimensioni dello stabilimento |

### Raccomandazioni pratiche per ciascuna fase

**Fase 1:** scegliete un'area pilota con un processo stabile, una leadership motivata e un problema visibile. ifaa parla di un "faro" che guida l'estensione successiva [2]. Un'area sommersa dal caos non è adatta, perché in quel caso la stabilità deve venire prima.

**Fase 2:** spiegate il perché, non solo il cosa. Chiarite che i KPI valutano i processi, non le persone.

**Fase 3:** lasciate che sia il team a progettare la bacheca. Iniziate con al massimo quattro-sei KPI [3] e una semplice lista di azioni. Una bacheca perfetta il primo giorno non è né necessaria né utile.

**Fase 4:** le prime settimane sono decisive. All'inizio le riunioni durano più del necessario [3]. Un coach osserva la riunione e, al termine, dà al facilitatore un feedback in privato. Orth descrive circa 15 minuti per questo, che coprono un punto di forza, un'area di sviluppo e un incarico concreto [3]. Nelle prime settimane questo dà frutti ogni giorno, in seguito ogni settimana. I gemba walk del livello successivo di leadership iniziano in questa fase.

**Fase 5:** usate una valutazione semplice (si veda il controllo di maturità sotto) per verificare se il sistema funziona.

**Fase 6:** costruite il secondo livello solo quando il primo funziona in modo affidabile, poi il terzo e il quarto. Sostituite le riunioni esistenti invece di aggiungerne di nuove. Gelbrich indica come errore tipico il fatto che la gestione shop floor non venga usata per sostituire le riunioni esistenti [3].

### Prerequisiti e fattori di successo secondo ifaa

ifaa nennt als Voraussetzungen das Commitment des Managements, ein Budget an Zeit und Geld, die unternehmensweite Kommunikation des Projekts, einen definierten Zielzustand (Vision und Mission), die Überzeugung der Beteiligten und die Einbindung des Betriebsrats [2]. Für den Erfolg betont sie außerdem Führungskräfte, die an den Besprechungen vor Ort teilnehmen, klar kommunizierte und auf allen Ebenen heruntergebrochene Ziele, Mitarbeiterbeteiligung und Schulung sowie Disziplin, Konsequenz und Durchhaltevermögen, denn Shop Floor Management ist keine einmalige Kampagne [2]. In US-Werken ohne Betriebsrat gilt dieselbe Logik für die Gewerkschaft oder, in einem nicht gewerkschaftlich organisierten Werk, für eine frühzeitige und offene Kommunikation mit der Belegschaft.

### Reifegradprüfung: Funktioniert Ihr Shop Floor Management?

- [ ] Das Board wurde heute aktualisiert, und das Team kann jede KPI erklären.
- [ ] Jede rote KPI hat eine Maßnahme mit Verantwortlichem und Fälligkeitsdatum.
- [ ] Besprechungen beginnen pünktlich und bleiben im Zeitrahmen.
- [ ] Eskalationen erreichen die nächste Ebene noch am selben Tag und werden beantwortet.
- [ ] Führungskräfte führen Gemba-Walks in einem festen Rhythmus durch.
- [ ] Maßnahmen werden erst geschlossen, wenn ihre Wirkung nachgewiesen ist.
- [ ] Die Zahl gemeldeter Probleme und Beinaheunfälle ist gestiegen, nicht gesunken.
- [ ] Mindestens eine bestehende Besprechung wurde durch das Tier-Meeting ersetzt.
- [ ] Verbesserte Prozesse sind in aktualisierten Standards dokumentiert.
- [ ] Mitarbeitende können den Status ihrer Ideen einsehen.

Acht oder mehr Ja-Antworten deuten auf ein wirksames System hin; weniger als fünf deuten auf ein Board hin, das eher Ritual als Führungsinstrument ist.

## Häufige Fehler und wie Sie sie beheben

Aus Beobachtungen seit 2015 in rund 50 deutschen Unternehmen verschiedener Branchen leitete Gelbrich zehn häufige Gründe ab, warum Shop Floor Management scheitert [3]. Die Tabelle stellt sie den Gegenmaßnahmen gegenüber.

| Fehler (laut Gelbrich [3]) | Gegenmaßnahme |
|---|---|
| unrealistisch hohe Erwartungen ohne direktes Engagement der Führung | der Werksleiter moderiert Tier 4 persönlich und geht regelmäßig ins Gemba |
| fehlerhafte Verknüpfung der Ebenen des Shop Floor Managements | ineinandergreifende Kaskade, definierte Eskalationsauslöser, Antwortpflicht |
| inhaltliche Überlastung mit unnötigen Informationen | vier bis sechs KPIs, alles Übrige vom Board entfernen |
| komplizierte, zeitaufwendige Aktualisierung der Informationen | Datenerfassung vereinfachen, dort automatisieren, wo es sinnvoll ist |
| für den Prozess irrelevante KPIs | KPIs mit den drei Leitfragen neu ableiten |
| KPIs, die das Team nicht beeinflussen kann | auf die nächsthöhere Ebene verlagern |
| lange Aktualisierungsschleifen und veraltete Informationen | die Aktualisierung zu einem festen Punkt der Schichtübergabe machen |
| keine Gegenmaßnahmen bei festgestellten Abweichungen | Regel: kein Rot ohne Maßnahme |
| Shop-Floor-Besprechungen, die zu lange dauern, besonders während der Einführung | Zeitrahmen, Stehbesprechung, Problemlösung aus dem Meeting herauslösen |
| Shop Floor Management ersetzt bestehende Besprechungen nicht | Besprechungsinventur, Doppelungen streichen |

Drei weitere Fehler treten in der Praxis häufig auf:

- **KPI-Theater:** KPIs werden präsentiert, aber nicht diskutiert. Die Frage „Was tun wir jetzt?“ fehlt.
- **Gemba-Tourismus:** Führungskräfte gehen ohne Thema, ohne Fragen und ohne Nachverfolgung durch die Halle.
- **Zu frühe Digitalisierung:** Ein Werk führt Software ein, bevor die Routinen stehen. Digitalisiert wird dann ein Prozess, den niemand lebt.

## Analogico o digitale? Gestione digitale del reparto produttivo a confronto

La domanda "lavagna o schermo?" viene spesso trattata come una questione di principio. Può invece ricevere una risposta concreta. La ricerca disponibile suggerisce che la situazione attuale è per lo più analogica: nello studio KIT e IPRI (18 aziende), la gestione del reparto produttivo avveniva principalmente su carta e solo in parte con supporto digitale; solo circa il 10 percento delle riunioni utilizzava una lavagna digitale del reparto, e la visualizzazione digitale dei KPI iniziava di solito solo a livello di middle management [24][25]. Lo studio descrive anche passaggi di consegne interrotti tra carta, Excel e OneNote, senza un sistema guida, che rendono più difficile il monitoraggio tra i diversi livelli [24].

| Criterio | Lavagna analogica | Lavagna digitale |
|---|---|---|
| Costi iniziali | molto bassi | licenze, hardware, integrazione |
| Responsabilità diretta | il team scrive sulla lavagna, forte identificazione | rischio che il team si limiti a consumare le informazioni |
| Aggiornamento | dipende dall'aggiornamento manuale | automatico, fino a quasi in tempo reale |
| Qualità dei dati | errori di trascrizione, lacune | coerenti, a condizione che le fonti siano pulite |
| Escalation tra livelli | manuale, soggetta a errori | end to end, tracciabile |
| Monitoraggio delle azioni | disciplina individuale | supportato dal sistema con scadenze e promemoria |
| Team distribuiti, più siti | non possibile | possibile |
| Storico e analisi | foto, raccoglitori | analizzabile, trend, pattern |
| Resilienza | funziona sempre | dipende da rete e sistemi |
| Regole sul monitoraggio dei dipendenti | di solito non critiche | si raccomandano regole scritte sui dati (sindacato, normativa statale; accordo aziendale in Germania) |
| Sicurezza OT | non è un problema | sono necessarie segmentazione di rete e controllo degli accessi (vedi sezione 18) |

### Quale approccio e quando?

- **Iniziare in modo analogico** quando le routine sono nuove, il team è piccolo e i KPI sono facili da rilevare a mano. La lavagna costringe a mantenere tutto snello.
- **Passare a un modello ibrido** quando i dati delle macchine confluiscono automaticamente su uno schermo, ma le azioni e le idee vengono ancora gestite a mano alla lavagna. Per molti stabilimenti è il compromesso migliore.
- **Espandersi in modo digitale** quando devono essere collegati più livelli, turni o siti, quando la raccolta manuale dei dati richiede troppo sforzo o quando le azioni si perdono tra i diversi livelli.

CETPM fa riferimento a un modello in cinque fasi di Müller-Seegers per la digitalizzazione: definizione del progetto e degli obiettivi, test dei fornitori e selezione dello strumento, pilota (quattro settimane al massimo), fase di adeguamento (solo se necessaria), implementazione e funzionamento; nel complesso prevede circa sei mesi [3]. Più importante dello strumento è l'ordine: prima la routine, poi il digitale. Il post [Shop floor optimization: ways to improve flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/) mostra come migliorare in parallelo il flusso dei materiali.

## Costruire una lavagna digitale per il reparto produttivo con Microsoft 365

> **In breve:** Teams fornisce lo spazio, Power BI la parete dei KPI, Power Apps l'acquisizione dei dati, Lists la lista delle azioni e Fabric gli avvisi in tempo reale. Le leve più importanti sono le licenze per i visualizzatori, l'intervallo di aggiornamento di Power BI e il modello dei dati.

Molti produttori usano già Microsoft 365 per la posta elettronica, Teams e i documenti. Ha senso costruire la lavagna digitale del reparto dove i dipendenti già lavorano. I blocchi costitutivi descritti di seguito sono documentati su Microsoft Learn; verificate i requisiti di licenza e la disponibilità per il vostro tenant prima di avviare un progetto. I fornitori del settore pubblico e della difesa statunitense che operano nei cloud governativi Microsoft (GCC, GCC High) devono verificare separatamente la disponibilità delle funzionalità in tali ambienti.

### Panoramica dell'architettura di riferimento

| Funzione della lavagna | Blocco costitutivo Microsoft | Cosa fa (secondo la documentazione Microsoft) |
|---|---|---|
| Spazio di comunicazione per area | Microsoft Teams (un team per area, un canale per linea o livello) | canali con schede per lavagna, azioni e app |
| Visualizzazione dei KPI | Power BI, incorporato come scheda in Teams | report interattivi nei canali e nelle chat, anteprime dei link, notifiche nel feed delle attività [28] |
| KPI con obiettivi | Power BI Metrics (scorecard) | metriche con responsabili, valore attuale e obiettivo, stato, verifiche; come scheda in canali o riunioni [31] |
| Acquisizione dati alla postazione | Power Apps (canvas app come scheda Teams) | maschere di inserimento personalizzate, ad es. per motivi di fermo, scarti, idee [30] |
| Lista delle azioni, registro dei problemi | Microsoft Lists (ad es. il modello "Issue tracker") o Planner | liste con viste, regole e notifiche, memorizzate in SharePoint [38] |
| Attività standard su più siti | Planner con pubblicazione di attività | distribuire liste di attività a molti team e monitorare il completamento per sede [37] |
| Comunicazione di turno | App Teams per i lavoratori di prima linea (Shifts, Walkie Talkie, Approvals, Updates) | turni di lavoro, comunicazione push-to-talk, approvazioni, aggiornamenti ricorrenti [35][36] |
| Dati in tempo reale e avvisi | Microsoft Fabric Real-Time Intelligence (Eventstream, Eventhouse, Real-Time Dashboard, Activator) | acquisire, analizzare e visualizzare dati in streaming e agire automaticamente in presenza di condizioni [32][33] |

### Power BI come parete dei KPI

I report di Power BI possono essere incorporati come scheda in un canale di Teams, così il team vede e discute i KPI dove già comunica [28]. Nella pratica tre punti sono determinanti:

1. **Autorizzazioni:** l'incorporamento di un report in Teams non concede automaticamente agli utenti il permesso di visualizzarlo; le autorizzazioni devono essere concesse esplicitamente [28].
2. **Licenze:** gli utenti con una licenza Fabric gratuita possono visualizzare i contenuti di un'area di lavoro su una capacità Premium (SKU P) o una capacità Fabric di F64 o superiore; la creazione e la condivisione richiedono Power BI Pro o Premium Per User [28]. Sotto F64, ogni visualizzatore necessita quindi di una licenza Pro o PPU. Con molti visualizzatori in reparto, questo è il principale fattore di costo; chiarite le modalità di licenza per gli schermi di visualizzazione in linea con il vostro partner Microsoft per le licenze.
3. **Limitazioni:** le dashboard di Power BI (a differenza dei report) non possono essere incorporate nella scheda Power BI, e la scheda non supporta i filtri tramite URL [28].

**Quanto può essere aggiornata una lavagna Power BI?** L'aggiornamento automatico della pagina funziona per le origini DirectQuery, Direct Lake e alcuni scenari di connessione live, ma non per la modalità import [29]. In capacità condivisa (tipica con sole licenze Pro), l'intervallo minimo è di 30 minuti e il rilevamento delle modifiche non è disponibile. In capacità dedicata (Fabric F, Premium P) e con Premium Per User, con DirectQuery sono possibili intervalli fino a un secondo, se l'amministratore della capacità lo consente; l'intervallo minimo predefinito è di cinque minuti, e di cinque secondi per il rilevamento delle modifiche [29]. Questo basta per una lavagna che mostra unità all'ora; per vere funzioni andon, Real-Time Intelligence è la soluzione più adatta.

### Power Apps per l'acquisizione dati alla postazione

Le canvas app create con Power Apps possono essere aggiunte a un canale di Teams tramite la scheda "Power Apps", a condizione che l'app sia stata prima condivisa con gli utenti [30]. Tipiche app per il reparto produttivo:

- acquisizione del motivo del fermo con pochi pulsanti grandi (ad es. "materiale mancante", "rottura utensile", "qualità"),
- acquisizione di scarti e rilavorazioni per ora,
- idee e suggerimenti di miglioramento con una foto,
- una checklist digitale per il gemba walk con osservazioni e azioni,
- conferma di processo (audit di processo a strati) su tablet.

Microsoft elenca limitazioni note, ad esempio che sensori come posizione o bussola non sono supportati nell'app desktop di Teams e che gli allegati non possono essere scaricati nell'app mobile di Teams [30]. Importante per la decisione sull'architettura: gli ambienti Dataverse for Teams sono deprecati [30]. Secondo Microsoft, a partire dal 15 novembre 2026 non è più possibile creare nuovi ambienti Dataverse for Teams; gli ambienti non aggiornati vengono sospesi il 15 settembre 2027 e dismessi il 30 ottobre 2027 [45]. Le nuove soluzioni andrebbero quindi realizzate su un ambiente Dataverse standard, su elenchi SharePoint o su altre fonti dati.

**La questione della licenza Power Apps:** le tabelle Dataverse, i connettori premium e i gateway dati locali (ad esempio per un database MES in stabilimento) richiedono i diritti premium di Power Apps [46]. Un'app di raccolta basata su elenchi SharePoint di solito funziona con i diritti inclusi in Microsoft 365; la Power Platform Licensing Guide descrive l'ambito esatto. Questa diramazione spesso determina il costo per utente sulla linea.

### Azioni e attività

Microsoft Lists, utilizzabile come scheda in Teams, si adatta bene all'elenco delle azioni. Microsoft descrive Lists come uno strumento per tenere traccia di informazioni quali problemi, asset, routine o incidenti, con viste, regole e notifiche personalizzabili; è disponibile un modello "Issue tracker" e i dati risiedono nel sito di team SharePoint [38]. Un elenco con le colonne problema, KPI, causa radice, azione, responsabile, scadenza, stato, efficacia verificata e livello di escalation rispecchia la colonna delle azioni della lavagna. Un filtro per livello mostra esattamente gli elementi rilevanti in ciascuna riunione di livello.

Le routine standardizzate, come i controlli 5S giornalieri o le conferme di processo settimanali su tutte le linee, possono essere distribuite con la pubblicazione di attività in Planner. Microsoft descrive come i responsabili di operations possano pubblicare liste di attività nei team secondo una gerarchia definita e monitorare il completamento tramite report per attività e per lista; le attività possono contenere checklist fino a 20 voci [37].

### Tempo reale e allarmi con Microsoft Fabric

Per gli stabilimenti che vogliono utilizzare i dati delle macchine in tempo reale, Microsoft Fabric Real-Time Intelligence offre diversi componenti [32]:

- **Eventstream** acquisisce, trasforma e instrada grandi volumi di dati in tempo reale senza codice; i connettori includono MQTT, Apache Kafka e change data capture da database. Le sorgenti Azure come Event Hubs e IoT Hub sono disponibili in Real-Time hub.
- **Eventhouse** è ottimizzato per eventi in streaming basati sul tempo; le query utilizzano KQL (Kusto Query Language) oppure, nel KQL queryset, T-SQL.
- **Real-Time Dashboard** visualizza i dati in movimento.
- **Activator** monitora i flussi di dati con bassa latenza (sotto il secondo per regole stateless su dati in streaming) e attiva azioni quando vengono raggiunte soglie o rilevati schemi, inclusa l'assenza di dati. Le azioni includono messaggi Teams a singoli, gruppi o canali, email, flussi Power Automate e elementi Fabric come pipeline o notebook [33].

Microsoft cita esplicitamente il manifatturiero e l'IoT come scenari [32]. Per la gestione in produzione ciò significa che una regola Activator può, ad esempio, pubblicare un messaggio nel canale Teams della linea quando una macchina è ferma da più di un tempo definito. Si tratta di un andon digitale che raggiunge il capoturno su smartphone. Integra la fune di emergenza e la colonna luminosa sulla linea, ma non le sostituisce, finché non ogni capoturno dispone di un telefono aziendale.

### Esempio: una lavagna di livello 1 in Teams

| Scheda del canale | Contenuto | Componente |
|---|---|---|
| "Board" | pagina SQDCP con stato rosso/verde, obiettivo orario vs. effettivo, primi 3 motivi di fermo | report Power BI |
| "Capture" | motivi di fermo, scarti, idee | app canvas Power Apps |
| "Actions" | elenco delle azioni filtrato sul livello 1 | Microsoft Lists |
| "Routines" | controlli giornalieri, 5S, conferma di processo | Planner (attività pubblicate) |
| "Goals" | obiettivi di area con check-in | Metriche Power BI |
| Post del canale | escalation, messaggi andon, passaggio di consegne di turno | Teams, Activator, Power Automate |

### Piano di realizzazione: sei passi verso la tua prima lavagna digitale di livello 1

Per gli amministratori di Microsoft 365, la sequenza seguente si è dimostrata efficace. Presuppone che il team pilota lavori già con una lavagna analogica.

1. **Fotografare la lavagna e definire i KPI.** Copiare i campi e i KPI della lavagna analogica; per ogni KPI definire formula, fonte, target ed esigenza di aggiornamento.
2. **Creare il team e i canali.** Un team per area, un canale per linea o livello; permessi tramite gruppi anziché singoli utenti.
3. **Costruire l'elenco delle azioni in Microsoft Lists.** Colonne come in "Azioni e attività" sopra, una vista per livello, promemoria alla data di scadenza.
4. **Creare l'app di acquisizione.** Un'app a tela con pochi pulsanti grandi per motivi di fermo e scarti; dati in liste SharePoint o Dataverse (prestare attenzione alla questione delle licenze).
5. **Collegare il report Power BI.** Una pagina del report per ogni lavagna, logica rosso/verde rispetto ai target, DirectQuery o Direct Lake se serve un aggiornamento della pagina; incorporarlo come scheda nel canale e concedere l'accesso in lettura.
6. **Testare per quattro settimane nella riunione, poi estendere.** Solo quando il team gestisce la lavagna digitale nella stessa riunione di livello 1 seguono gli avvisi di Activator, le routine di Planner e il collegamento con il livello 2.

Concordare le regole sui dati con i rappresentanti dei dipendenti prima del passaggio 4 (e, in Germania, con il consiglio di fabbrica), perché da quella fase in poi possono essere creati dati riconducibili a singole persone.

### Ciò che Microsoft 365 non sostituisce

Microsoft 365 è un insieme di strumenti, non un sistema finito di gestione del reparto produttivo. La logica della cascata, le regole di escalation, il collegamento tra KPI, azione ed effetto verificato e la disciplina nella conduzione delle riunioni vanno progettati autonomamente. Senza un modello dati chiaro si finisce rapidamente con un insieme di liste e report non collegati, esattamente le interruzioni nei passaggi tra strumenti che la ricerca critica nella gestione analogica del reparto [24]. Verificare anche presto la questione dell'hardware: schermi grandi in linea, tablet robusti e account dispositivo per i dispositivi condivisi comportano un impegno proprio.

## Integrazione dei dati: MES, ERP e dati delle macchine

> **In breve:** unità e fermi arrivano automaticamente da macchina o MES; motivi di fermo e idee vengono acquisiti a mano in modo semplice. Ogni KPI è definito una sola volta e calcolato allo stesso modo a ogni livello.

Una lavagna digitale vale quanto i suoi dati. Fonti tipiche:

| Fonte | Dati per la lavagna | Percorso tipico |
|---|---|---|
| ERP (ad es. SAP, Microsoft Dynamics 365) | ordini, quantità pianificate, scadenze, arretrato | esportazione dati o connettore in Power BI o Fabric |
| MES / sistema di raccolta dati di produzione e macchina | unità, fermi, motivi di fermo, OEE, scarti | connessione a database o API, replica in Fabric |
| Controlli di macchina (PLC, OPC UA) | stati, contatori, valori di processo | gateway edge, ad es. Azure IoT Operations con il connettore OPC UA, poi tramite MQTT |
| Sistema di gestione della qualità (QMS) | risultati di ispezione, reclami | connessione a database o API |
| Sistemi HR e di pianificazione turni / Shifts | presenze, turni, aggregati | interfaccia, dati aggregati |
| Acquisizione manuale | motivi di fermo, idee, eventi di sicurezza | Power Apps, Microsoft Lists |

In termini ISA-95 (ANSI/ISA-95, a livello internazionale IEC 62264), la lavagna si colloca sopra il livello 3 (gestione delle operazioni di produzione, come un MES) e il livello 4 (pianificazione aziendale e logistica, come un ERP); lo standard tratta principalmente l'interfaccia tra questi due livelli [56]. Usare il suo vocabolario per ordini, materiali ed equipaggiamenti rende più facile allineare il modello dati della lavagna con MES ed ERP.

Per il collegamento delle macchine, Microsoft descrive il connettore OPC UA in Azure IoT Operations: si collega a server OPC UA, legge i dati e li pubblica come messaggi JSON nel formato OPC UA PubSub sul broker MQTT; può anche rilevare automaticamente gli asset [34]. Da lì, i flussi di dati di Azure IoT Operations instradano i dati verso destinazioni come Microsoft Fabric OneLake, Azure Data Explorer o un endpoint Kafka [47]. La documentazione qui esaminata non descrive un connettore OPC UA direttamente in Fabric; il percorso passa attraverso il gateway edge.

Non appena le reti delle macchine vengono collegate ai servizi cloud, la sicurezza OT diventa parte del progetto. La serie ISA/IEC 62443 si occupa della sicurezza dei sistemi di automazione e controllo industriali e collega operazioni e IT [57]; il NIST Cybersecurity Framework (CSF) 2.0, pubblicato il 26 febbraio 2024, si presenta come una tassonomia di risultati di cybersecurity di alto livello e può servire da riferimento per governare tale lavoro [59]. Una lavagna di reparto deve leggere i dati dalla rete OT, non aprire un varco verso di essa.

### Principi per l'architettura dei dati

1. **Una sola verità per ogni KPI.** Definisci ogni KPI una volta sola (formula, fonte, granularità) e usa quella definizione a ogni livello. In questo modo l'OEE sulla bacheca di livello 1 coincide con l'OEE nel report di stabilimento.
2. **Automatizza ciò che è stabile.** Pezzi e fermi provengono dalla macchina o dal MES. Le cause di fermo che richiedono un giudizio umano vengono registrate a mano, in modo semplice e rapido.
3. **Latenza commisurata alla decisione.** Il livello 1 richiede valori orari o in tempo reale, il livello 4 valori giornalieri o settimanali. Non tutto deve essere in tempo reale.
4. **Privacy e regole sui dipendenti fin dall'inizio.** I dati personali vengono aggregati; ruoli e permessi sono documentati.

Il compendio [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) affronta in profondità queste questioni di IT manifatturiero, e [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) mostra dove portano in seguito i dati di stabilimento in tempo reale.

## Supporto software: l'esempio di iFAKT Polaris

> **Nota: l'autore lavora presso iFAKT GmbH.**

Oltre a costruire una bacheca propria con Microsoft 365, esistono software specializzati per il lean management digitale. Un esempio è [Polaris](https://www.m365.fm/entity/polaris/) di [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), con sede a Stoccarda, in Germania. Le soluzioni Polaris sono elencate su Microsoft AppSource, tra cui Polaris VSM per la mappatura digitale del flusso del valore [39] e Polaris BSM per la modellazione dei processi aziendali nel lean management digitale [40]. Il compendio [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) descrive in dettaglio la famiglia di prodotti.

Secondo il fornitore, due moduli sono rilevanti per la gestione del reparto produttivo [unverified: informazione riportata dal fornitore, non verificata in modo indipendente]:

- **[Polaris Operator](https://www.m365.fm/entity/polaris-operator/)** porta i compiti direttamente in reparto, ad esempio le azioni emerse dalle riunioni di livello o dai gemba walk, in modo che raggiungano i responsabili alla linea e che il loro completamento possa essere monitorato.
- **[Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)** visualizza i KPI in dashboard e supporta la parete KPI della bacheca ai diversi livelli.

Valutazione: una soluzione specializzata non progetta al posto tuo la cascata, le regole di escalation e la disciplina di facilitazione, così come non lo fa una soluzione costruita internamente. Può però predisporre il collegamento tra KPI, azione ed effetto verificato e quindi ridurre il lavoro sul proprio modello dati. Ciò che conta è se la soluzione si adatta al panorama IT esistente; la scheda su AppSource indica un focus sull'ecosistema Microsoft.

Oltre a Polaris esistono molti altri fornitori, come moduli per il reparto forniti da vendor di MES o piattaforme autonome per lean e riunioni a livelli. Indipendentemente dal fornitore, queste domande aiutano nella selezione:

- Il software mappa la cascata con escalation e risposta su più livelli?
- Un'azione può essere chiusa solo dopo che l'effetto è stato dimostrato?
- Quali interfacce esistono verso ERP, MES e macchine, e chi le mantiene?
- Il software può aggregare i KPI nel modo richiesto dalle tue regole sui dati (contratto collettivo, legge statale, accordo aziendale)?
- Cosa succede quando la rete alla linea si interrompe?
- Come sono concesse in licenza le utenze di visualizzazione, e quanto costa uno schermo alla linea?

Sull'azienda: iFAKT GmbH ha sede in Curiestrasse 2, 70563 Stoccarda, Germania (registro delle imprese di Stoccarda HRB 22661) [61]. Secondo l'azienda, è stata fondata nel 2001 e ha circa 25 dipendenti (informazioni aziendali, non verificate in modo indipendente). Il suo sito web mostra il sigillo TÜV SÜD per la certificazione ISO 9001 e ISO/IEC 27001 [61], e con il sistema Polaris IMS si è classificata al secondo posto nella categoria produzione del Best of Technology Award 2025 del settimanale economico tedesco WirtschaftsWoche [60].

## Glossario

| Termine | Significato |
|---|---|
| A3 | risoluzione dei problemi su un unico foglio A3 (negli USA di solito 11 × 17 in.): problema, stato attuale, causa radice, obiettivo, contromisure, follow-up |
| Andon | segnale (cordino, pulsante, spia) che rende subito visibile una deviazione e richiede aiuto |
| Escalation | passaggio di un problema al livello successivo quando il team non riesce a risolverlo da solo |
| Gemba | dal giapponese "il luogo reale"; il luogo in cui si crea valore |
| Gembutsu | la "cosa reale" al gemba: macchina, utensile, materiale, pezzo difettoso |
| Genchi genbutsu | andare a vedere di persona e verificare i fatti sul posto |
| Hoshin kanri | metodo per declinare gli obiettivi aziendali su tutti i livelli (detto anche policy deployment) |
| Layered process audit (process confirmation) | breve verifica di uno standard da parte di responsabili di più livelli, con cadenza fissa |
| Leader standard work | routine giornaliere fisse e visibili per i responsabili |
| Obeya | "grande stanza"; una sala riunioni con tutti i KPI e i progetti appesi alle pareti |
| OEE | efficacia complessiva delle attrezzature: disponibilità × prestazione × qualità |
| SQDCP | struttura della lavagna per sicurezza, qualità, consegne, costi, persone (anche SQCDP) |
| Tier meeting | breve riunione periodica alla lavagna su uno specifico livello della gerarchia |
| TRIR | total recordable incident rate: casi registrabili OSHA × 200.000 / ore lavorate |
| Yokoten | trasferimento di una soluzione collaudata ad altre linee o stabilimenti |
| DirectQuery / Direct Lake | modalità di connessione di Power BI in cui i dati vengono interrogati direttamente invece di essere importati; necessaria per l'aggiornamento automatico delle pagine |
| F64 | dimensione di una capacità Microsoft Fabric dalla quale gli utenti possono visualizzare i contenuti senza una licenza Power BI a pagamento |

## FAQ: gestione di reparto e gemba walk

### Che cos'è la gestione di reparto in parole semplici?

La gestione di reparto significa che i responsabili guidano là dove si svolge il lavoro. Il team si riunisce brevemente ogni giorno davanti a una lavagna con pochi KPI, discute le deviazioni, concorda le azioni e passa al livello di direzione successivo i problemi che non è in grado di risolvere. I responsabili vanno regolarmente in reparto per vedere di persona.

### Quali sono gli elementi della gestione di reparto?

Sei elementi: responsabili presenti in reparto (gemba), gestione visiva, pochi KPI su cui il team può intervenire, una cadenza fissa di riunioni nei tier meeting, risoluzione strutturata dei problemi e standardizzazione. Istituti di ricerca tedeschi li raggruppano in modo leggermente diverso [2][4], e le pagine dei fornitori statunitensi parlano spesso di cinque pilastri, ma il contenuto è lo stesso.

### Che cosa significa gemba?

Gemba (anche genba) è il termine giapponese per "il luogo reale". Nel lean indica il luogo in cui si crea valore, di solito il reparto di produzione [7][8]. Genchi genbutsu, "andare a vedere di persona", è l'azione correlata: il gemba è un luogo, il genchi genbutsu è ciò che si fa lì [8].

### Che cos'è un gemba walk?

Un gemba walk è una visita pianificata da parte di un responsabile al luogo in cui si crea valore. Il responsabile osserva il lavoro, lo confronta con lo standard e pone domande aperte per capire la situazione prima di intervenire [7]. Una buona visita ha un tema, inizia alla lavagna e si conclude con un riscontro al team.

### Quali sono i tre principi di un gemba walk?

La versione più citata viene dall'ex presidente di Toyota Fujio Cho: "Vai a vedere, chiedi perché, mostra rispetto" [15]. LEI aggiunge tre aspetti da osservare durante la visita: scopo (quale problema il processo risolve per il cliente), processo (come funziona davvero) e persone (se sono coinvolte nel suo miglioramento) [7].

### Qual è la differenza tra gestione di reparto e gemba walk?

La gestione di reparto è l'intero sistema di leadership fatto di lavagna, KPI, tier meeting, risoluzione dei problemi e standard. Il gemba walk è una routine all'interno di quel sistema: il responsabile va dove si svolge il lavoro, osserva e pone domande per capire la situazione prima di agire [7].

### Quanto deve durare una riunione di reparto?

Circa da 10 a 15 minuti a livello di team e da 20 a 30 minuti a livello direttivo. Gelbrich cita da 10 a 12 minuti a livello operativo e da 20 a 30 minuti a livello direttivo; durante l'avvio, le riunioni tendono a durare di più [3].

### Che cos'è un tier 1, tier 2 e tier 3 meeting?

Un tier meeting è una riunione breve e standardizzata alla lavagna su un livello dell'organizzazione. Il tier 1 è il team di prima linea, il tier 2 i capi di un'area, il tier 3 i responsabili di reparto e il tier 4 la direzione dello stabilimento [58]. Le riunioni sono sfalsate in modo che i problemi possano essere portati al livello superiore lo stesso giorno.

### Che cos'è una lavagna di reparto?

Una shop floor board (detta anche huddle board o lavagna SQDCP) è la lavagna o lo schermo dove il team si riunisce per la riunione di tier. Mostra alcuni KPI con obiettivo e trend, azioni aperte con responsabili e scadenze, e le escalation al livello successivo. Un layout tipico prevede colonne per SQDCP e righe per stato, trend e azioni.

### Che cosa significa SQDCP?

SQDCP sta per safety (sicurezza), quality (qualità), delivery (consegna), cost (costo) e people (persone); talvolta si scrive anche SQCDP. L'ordine è il messaggio: in ogni riunione la sicurezza viene discussa per prima. Le varianti sono SQDC, SQDCM (morale) o SQDCE (ambiente).

### Quali KPI devono comparire su una shop floor board?

Da quattro a sei KPI su cui il team può influire [3], organizzati per SQDCP: sicurezza (infortuni registrabili, quasi incidenti), qualità (scarti, first pass yield), consegna (obiettivo vs. effettivo, consegna puntuale), costo o produttività (OEE, pezzi per ora) e persone (presenze, polivalenza, idee).

### Ogni quanto si dovrebbe fare un gemba walk?

Non esiste un numero universale. Ciò che conta è un ritmo fisso e affidabile, ancorato allo standard work dei leader. In pratica, capireparto e capiturno fanno un giro tematico ogni giorno, i responsabili di reparto più volte a settimana e il direttore di stabilimento almeno una volta a settimana; i giri di value stream si fanno secondo necessità. I team leader sono comunque sul gemba tutto il giorno e usano invece la process confirmation quotidiana. Più della frequenza conta che ogni giro abbia un tema e un follow-up.

### Chi deve fare un gemba walk?

I leader di ogni livello, ciascuno con un focus diverso: i capireparto e i responsabili di reparto fanno soprattutto giri sul sistema di gestione (lavagne, standard ed escalation funzionano?), la direzione di stabilimento fa giri di value stream trasversali alle funzioni e gli specialisti fanno giri focalizzati sui problemi [14]. I team leader lavorano comunque sul gemba e usano invece la process confirmation. Coinvolgete le persone che lavorano sul processo, come raccomanda LEI [7].

### Quanto deve durare un gemba walk?

Le fonti esaminate non indicano una durata fissa. Un giro mirato in una singola area dura tipicamente da 20 a 45 minuti; un giro di value stream su una famiglia di prodotti può richiedere mezza giornata. Osservare più cicli a una stazione di lavoro conta più che percorrere molta strada.

### Quali domande porre durante un gemba walk?

Funzionano meglio le domande aperte, come "Come si svolge normalmente questa fase?", "Come si capisce che qualcosa non va?", "Qual è l'ultimo problema che hai risolto qui?" e "Che cosa posso fare per sostenerti?". La banca completa delle domande si trova nella sezione sul gemba walk.

### Il gemba walk è la stessa cosa del management by walking around?

No. Il MBWA nasce in Hewlett-Packard e si è diffuso con "In Search of Excellence" (1982) [16]; riguarda soprattutto la vicinanza e lo scambio informale. Il gemba walk è più strutturato, fa riferimento a standard e KPI e serve a capire il processo e a costruire la capacità di risolvere problemi.

### La shop floor management funziona anche nelle piccole aziende?

Sì. ifaa ha testato il suo modello di introduzione in diverse piccole e medie imprese e ha riscontrato che può essere avviato con mezzi semplici [2]. Nelle piccole aziende spesso bastano due livelli: una riunione di team e una riunione di leadership.

### Mi serve un software per la shop floor management?

Non per iniziare. Una lavagna, delle calamite e dei pennarelli bastano per costruire le routine. Il software ripaga quando bisogna collegare più livelli, turni o siti, quando la raccolta manuale dei dati diventa troppo onerosa o quando le azioni si perdono tra un livello e l'altro [24].

### Posso costruire una shop floor board digitale con Microsoft Teams e Power BI?

Sì. I report di Power BI possono essere incorporati come schede nei canali di Teams [28], Power Apps gestisce la raccolta dati alla stazione di lavoro [30], Microsoft Lists gestisce l'elenco delle azioni [38] e Microsoft Fabric Real-Time Intelligence fornisce gli avvisi in tempo reale [32][33]. Attenzione ai requisiti di licenza per i visualizzatori (visualizzatori gratuiti solo da Fabric F64 o capacità Premium), agli intervalli minimi di aggiornamento automatico delle pagine in Power BI (30 minuti in capacità condivisa) e alla dismissione di Dataverse for Teams [28][29][45].

### Quanto tempo serve per implementare la shop floor management?

Per un'area pilota, il modello ifaa prevede una fase di prova di circa tre mesi dopo la definizione degli obiettivi, i workshop informativi e di introduzione [2]. Estendere il modello a un intero stabilimento con una cascata funzionante su tutti i livelli richiede molto più tempo, a seconda delle dimensioni, perché ogni livello deve funzionare in modo affidabile prima di costruire quello successivo.

## Conclusione

La gestione del reparto produttivo non è una lavagna e non è un software, ma un sistema di leadership con meccanismi chiari: i responsabili vanno dove si crea valore, il team rende visibili le deviazioni con pochi KPI su cui può intervenire, brevi riunioni di tier programmate portano i problemi nello stesso giorno al livello in cui possono essere risolti, e ogni soluzione diventa il nuovo standard solo dopo che il suo effetto è stato dimostrato. Il gemba walk è la routine attraverso cui i responsabili capiscono invece di presumere.

L'esperienza documentata mostra due cose. In primo luogo, la gestione del reparto è diffusa ma spesso fallisce secondo gli stessi schemi: mancano collegamenti tra i livelli, le lavagne sono sovraccariche, le riunioni durano troppo e manca il coinvolgimento della direzione [3]. In secondo luogo, lo stato attuale è per lo più analogico, con passaggi di consegne interrotti tra strumenti diversi che rendono più difficili l'escalation e il monitoraggio delle azioni [24]. La digitalizzazione può aiutare, ma solo quando le routine sono già vissute.

Per le aziende che usano Microsoft 365, una lavagna digitale con Teams, Power BI, Power Apps, Liste e Fabric è un'opzione ovvia. Pianificate fin dall'inizio il modello dei dati, le licenze, gli intervalli di aggiornamento e le regole per i dati dei dipendenti. E iniziate da dove dovrebbe iniziare ogni implementazione: con un solo team pilota, una lavagna semplice, un intervallo di tempo di 15 minuti e un responsabile che ascolta.

## Ulteriori letture su m365.fm

**Post del blog**
- [Che cos'è un gemba walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/)
- [Checklist e domande per il gemba walk](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/)
- [Gemba walk vs. management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/)
- [Preparazione del gemba walk: team e ruoli](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/)
- [Errori nel gemba walk: quando la visita diventa un'ispezione](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/)
- [Cultura dell'eccellenza operativa in reparto](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/)
- [Ottimizzazione del reparto produttivo: modi per migliorare il flusso](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/)

**Termini**
[Shop floor management](https://www.m365.fm/entity/shop-floor-management/) · [Gemba walk](https://www.m365.fm/entity/gemba-walk/) · [Tier meeting](https://www.m365.fm/entity/tier-meeting/) · [Visual management](https://www.m365.fm/entity/visual-management/) · [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [5S](https://www.m365.fm/entity/5s/) · [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Micro stops](https://www.m365.fm/entity/micro-stops/) · [Scrap rate](https://www.m365.fm/entity/scrap-rate/) · [Lean management](https://www.m365.fm/entity/lean-management/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)

**Guide correlate**
- [Produzione snella (Lean manufacturing)](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Eccellenza operativa](https://www.m365.fm/en/learn/operational-excellence/)
- [KPI di produzione](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Gemello digitale nella produzione](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [IT di produzione con Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** è il conduttore di m365.fm e lavora presso [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) a Stoccarda, in Germania. Su m365.fm scrive di lean management, eccellenza operativa e digitalizzazione della produzione con Microsoft 365 e Azure. Il suo obiettivo è mostrare come routine lean consolidate, come lo shop floor management e il gemba walk, possano lavorare insieme alle moderne piattaforme dati senza perdere la loro essenza.

**Nota: l'autore lavora presso iFAKT GmbH.**

# Sources

All sources accessed on November 20, 2026. Sources 1 to 48 are carried over from the German version; sources 49 to 61 were added and verified for the US version. German-language sources are marked (German).

1. Shopfloor Management. Wikipedia (German). https://de.wikipedia.org/wiki/Shopfloor_Management
2. Conrad, R. W.; Eisele, O.: Shopfloor-Management: Führen am Ort der Wertschöpfung. In: Betriebspraxis & Arbeitsforschung 235, ifaa – Institut für angewandte Arbeitswissenschaft e. V., 2019, pp. 18–24 (German). https://www.arbeitswissenschaft.net/fileadmin/Downloads/Angebote_und_Produkte/Publikationen/ifaa_BA_235_Shopfloormanagement.pdf
3. Was ist Shopfloor Management? (glossary). CETPM – Centre of Excellence for Total Performance Management (with references to Gelbrich 2019, Orth, Schwarz, Hartmann/Melas 2020, Müller-Seegers 2020) (German). https://www.cetpm.de/lexikon/was-ist-shopfloor-management/141/
4. Shopfloor Management: Definition, Bedeutung, Kennzahlen. WGP – Wissenschaftliche Gesellschaft für Produktionstechnik (German). https://wgp.de/de/shopfloor-management/
5. Suzaki, K.: The New Shop Floor Management: Empowering People for Continuous Improvement. Free Press, 1993. https://books.google.com/books/about/New_Shop_Floor_Management.html?id=5vMvj0ge92IC
6. Peters, Remco: Shopfloor-Management. Führen am Ort der Wertschöpfung. LOG_X Verlag, Stuttgart 2009, ISBN 978-3-932298-39-4; quote p. 59, core elements p. 39 (cited via [1]; first name per Wikipedia and trade data; German National Library catalog not reachable at the time of access) (German).
7. Gemba Walk (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/gemba-walk/
8. Ballé, M.: Gemba, workplace, genchi genbutsu, go-and-see … What's the difference? Lean Enterprise Institute, September 14, 2015. https://www.lean.org/the-lean-post/articles/gemba-workplace-genchi-genbutsu-go-and-see-whats-the-difference/
9. Toyota Motor Corporation: 75 Years of Toyota, Section 7: The Functions that Supported Globalization (Toyota Way 2001). https://www.toyota-global.com/company/history_of_toyota/75years/text/leaping_forward_as_a_global_corporation/chapter4/section7/item4.html
10. Imai, M.: Gemba Kaizen: A Commonsense, Low-Cost Approach to Management. McGraw-Hill, 1997, ISBN 978-0-07-031446-7 (Publishers Weekly review). https://www.publishersweekly.com/9780070314467
11. Gemba and Its Meaning: The Heart of Lean Management. Kaizen Institute. https://kaizen.com/insights/gemba-meaning-lean-management/
12. Genchi Genbutsu. Wikipedia (English). https://en.wikipedia.org/wiki/Genchi_Genbutsu
13. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press, 1988 (publisher page, Routledge). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140
14. Womack, J.: Value Stream Walk, Management Walk or … Just Walking Around? Lean Enterprise Institute, June 19, 2018. https://www.lean.org/the-lean-post/articles/value-stream-walk-management-walk-or-just-walking-around/
15. Shook, J.: Foreword. In: Womack, J.: Gemba Walks, 2nd edition. Lean Enterprise Institute, 2013. https://www.lean.org/wp-content/uploads/2021/01/gemba-walks-foreward.pdf
16. Tom Peters: The four-letter word every modern manager needs to know: MBWA. Fortune, December 18, 2015. https://fortune.com/2015/12/18/tom-peters-the-four-letter-word-every-modern-manager-needs-to-know-mbwa/
17. Andon (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/andon/
18. Leader Standard Work (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/leader-standard-work/
19. Graban, M.: Book Review: Creating a Lean Culture (David Mann). Lean Blog, November 2005. https://leanblog.org/2005/11/book-review-creating-lean-culture
20. Visual Management (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/visual-management/
21. Team Leader (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/team-leader/
22. Overall Equipment Effectiveness (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/
23. Edmondson, A.: Psychological Safety and Learning Behavior in Work Teams. Administrative Science Quarterly 44 (2), 1999, pp. 350–383. https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Group_Performance/Edmondson%20Psychological%20safety.pdf
24. wbk Institute of Production Science (KIT) and IPRI: Auf dem Weg zum digitalen Shopfloor Management. Eine Studie zum Stand der Echtzeitentscheidungsfähigkeit und des Industrie 4.0-Reifegrads (ShopfloorPulse project; 18 companies from more than eight industries; undated, probably 2018/2019) (German). https://www.wbk.kit.edu/downloads/Auf%20dem%20Weg%20zum%20digitalen%20Shopfloor%20Management.pdf
25. Bundesvereinigung Logistik (BVL), IPRI, wbk (KIT): ShopfloorPulse, final report IGF project 19372 N (2017–2019) (German). https://www.bvl.de/files/1951/2125/2131/2133/Abschlussbericht_ShopfloorPulse_19372_N.pdf
26. Hertle, C.; Siedelhofer, C.; Metternich, J.; Abele, E.: The next generation shop floor management: How to continuously develop competencies in manufacturing environments. 23rd International Conference on Production Research, Manila 2015; TUprints TU Darmstadt, 2016. https://tuprints.ulb.tu-darmstadt.de/5253
27. VDI 2870 Part 2: Lean production systems; list of methods (project page for the new edition, possible publication date according to VDI: June 2027). VDI. https://vdi.de/richtlinien/details/vdi-2870-blatt-2-lean-production-systems-list-of-methods
28. Collaborate with Power BI in Teams. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-collaborate-microsoft-teams
29. Automatic page refresh in Power BI Desktop. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-automatic-page-refresh
30. Embed a canvas app as tab app. Microsoft Learn (Power Apps). https://learn.microsoft.com/en-us/power-apps/teams/embed-teams-tab
31. Use Power BI Metrics to track goals in Microsoft Teams. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/explore-reports/business-user-teams-goals
32. What is Real-Time Intelligence in Microsoft Fabric? Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/overview
33. What is Fabric Activator? Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-introduction
34. What is the connector for OPC UA? Microsoft Learn (Azure IoT Operations). https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector
35. Frontline team collaboration. Microsoft Learn (Microsoft 365 for frontline workers). https://learn.microsoft.com/en-us/microsoft-365/frontline/flw-team-collaboration?view=o365-worldwide
36. Simplify business processes for frontline teams. Microsoft Learn. https://learn.microsoft.com/en-us/microsoft-365/frontline/simplify-business-processes?view=o365-worldwide
37. Publish task lists to define and track work in your organization. Microsoft Support. https://support.microsoft.com/en-us/teams/shifts/publish-task-lists-to-define-and-track-work-in-your-organization
38. Manage the Lists app for your organization. Microsoft Learn (Microsoft Teams). https://learn.microsoft.com/en-us/microsoftteams/manage-lists-app
39. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource (Polaris VSM). Microsoft Tech Community, Marketplace Blog, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536
40. Polaris BSM (Business Swimlane Modeling). Microsoft AppSource. https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1
41. What is shopfloor management? SYMESTIC (German page; English page: https://www.symestic.com/en-us/what-is/shopfloor-management). https://www.symestic.com/de-de/was-ist/shopfloor-management
42. Trummer, R. (GFT Technologies SE): Digitales Shopfloor-Management ermöglicht 20 Prozent mehr Produktivität. Digital Manufacturing Magazin, November 2, 2022 (German). https://www.digital-manufacturing-magazin.de/digitales-shopfloor-management-ermoeglicht-20-prozent-mehr-produktivitaet-a-2b00c53c429d27a792ea7f51627fac4a/
43. Shopfloor Management (glossary). Haufe Akademie (German). https://www.haufe-akademie.de/blog/glossar/shopfloor-management/
44. Section 87 Works Constitution Act (Betriebsverfassungsgesetz, BetrVG): co-determination rights. Federal Ministry of Justice, gesetze-im-internet.de (German). https://www.gesetze-im-internet.de/betrvg/__87.html
45. Important changes (deprecations) coming in Power Apps, Power Automate, and Copilot Studio: Deprecation of Microsoft Dataverse for Teams environments. Microsoft Learn. https://learn.microsoft.com/en-gb/power-platform/important-changes-coming
46. Power Apps licensing FAQs. Microsoft Learn (Power Platform). https://learn.microsoft.com/en-us/power-platform/admin/powerapps-licensing-faq
47. Configure data flow endpoints. Microsoft Learn (Azure IoT Operations). https://learn.microsoft.com/azure/iot-operations/connect-to-cloud/howto-configure-dataflow-endpoint
48. Federal Labor Court (Bundesarbeitsgericht), decision of July 16, 2024, 1 ABR 16/23 (headset system; co-determination under Section 87(1) No. 6 BetrVG) (German). https://www.bundesarbeitsgericht.de/wp-content/uploads/2024/11/1-ABR-16-23.pdf
49. Safety Management – Worker Participation. Occupational Safety and Health Administration (OSHA), U.S. Department of Labor. https://www.osha.gov/safety-management/worker-participation
50. OSHA: Clarification of OSHA's Position on Workplace Safety Incentive Programs and Post-Incident Drug Testing Under 29 C.F.R. § 1904.35(b)(1)(iv). Standard interpretation memorandum, October 11, 2018. https://www.osha.gov/laws-regs/standardinterpretations/2018-10-11
51. TRIR (Total Recordable Incident Rate). National Safety Council, Injury Facts. https://injuryfacts.nsc.org/definitions/trir-total-recordable-incident-rate/
52. Morgan Lewis: Electronic Monitoring and Algorithmic Management: Permissible Labor Practice or Unlawful Oversight? LawFlash, November 8, 2022 (on NLRB GC Memo 23-02, October 31, 2022). https://www.morganlewis.com/pubs/2022/11/electronic-monitoring-and-algorithmic-management-permissible-labor-practice-or-unlawful-oversight
53. NLRB: GC 25-05 Rescission of Certain General Counsel Memoranda. National Labor Relations Board, February 14, 2025. https://www.nlrb.gov/news-outreach/news-story/gc-25-05-rescission-of-certain-general-counsel-memoranda
54. National Steel Corp. v. National Labor Relations Board, 324 F.3d 928 (7th Cir. 2003), discussing Colgate-Palmolive Co., 323 N.L.R.B. 515 (1997). Justia. https://law.justia.com/cases/federal/appellate-courts/F3/324/928/577225/
55. New York Civil Rights Law § 52-c (notice of electronic monitoring by employers). Justia, 2021 New York Laws. https://law.justia.com/codes/new-york/2021/cvr/article-5/52-c-2/
56. ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
57. ISA/IEC 62443 Series of Standards. International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
58. How should daily management be structured in a manufacturing plant? Kaizen Institute. https://kaizen.com/insights/daily-management-manufacturing-plant/
59. NIST: The NIST Cybersecurity Framework (CSF) 2.0. NIST CSWP 29, February 26, 2024. https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final
60. Best of Technology Award 2025: winners (category Produktion: 2nd place iFAKT GmbH, Polaris IMS). WirtschaftsWoche (German). https://award.wiwo.de/bot/gewinner-2025/
61. iFAKT GmbH: imprint (Curiestr. 2, 70563 Stuttgart; Amtsgericht Stuttgart HRB 22661) and home page (TÜV SÜD seal ISO 9001 & ISO/IEC 27001). https://www.ifakt.de/de/imprint and https://www.ifakt.de/
