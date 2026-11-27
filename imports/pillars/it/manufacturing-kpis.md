# SEO metadata

| Field | Value |
|---|---|
| Meta title | KPI di produzione: formule, esempi e guida a Power BI |
| Meta description | KPI di produzione con formule ed esempi pratici: takt time, cycle time, lead time, OEE, scarti, FPY, OTIF, MTBF, TRIR e una dashboard di Power BI. |
| Slug | `manufacturing-kpis` |

# KPI di produzione: la guida completa a metriche, formule, esempi pratici e dashboard di Power BI

> **Risposta breve:** I KPI di produzione sono misure che esprimono in numeri la velocità, la qualità, la puntualità delle consegne, i costi e la sicurezza di un'operazione produttiva. I più importanti sono takt time, cycle time, lead time di produzione, OEE, tasso di scarto, first pass yield, consegna completa e puntuale (OTIF), giorni di copertura, MTBF/MTTR, costo per unità e un indice di sicurezza come il TRIR. Funzionano solo se ogni KPI ha una definizione unica e condivisa, dati affidabili e una routine fissa di riunioni in cui gli scostamenti si trasformano in azioni.

> **Punti chiave**
> - **Definire prima di costruire una dashboard:** la norma ISO 22400-2:2014 descrive 34 KPI per la gestione delle operazioni produttive, ciascuno con formula, unità e tempistica [1][38]. La norma ISA-95 colloca questi KPI al Livello 3, tra il livello di controllo e l'ERP [40]. In Germania, la linea guida VDMA 66412-1 aggiunge le definizioni dei KPI MES [4].
> - **Il takt time non è un tempo macchina:** il takt è il tempo disponibile diviso per la domanda del cliente [9]. Il cycle time è misurato; il lead time comprende anche tutti i tempi di coda e di attesa [10].
> - **OEE = Disponibilità × Performance × Qualità.** Il noto obiettivo dell'85 % "di classe mondiale" risale a Nakajima, ma non è un benchmark universale [6][8].
> - **La legge di Little** collega scorte, throughput e lead time: se non si riduce il WIP, il lead time non si accorcia a lungo [13].
> - **La sicurezza viene prima e ha una formula standard statunitense:** il tasso di incidenza OSHA è casi × 200.000 ÷ ore lavorate [42]. Nel 2025, l'industria privata statunitense ha registrato 2,3 casi totali segnalabili ogni 100 lavoratori equivalenti a tempo pieno [43].
> - **Meno è meglio (raccomandazione):** da cinque a otto KPI per livello, ordinati secondo Sicurezza, Qualità, Costi, Consegne e Persone (SQCDP), sono sufficienti per gestire un'operazione.
> - **I KPI usati come obiettivi perdono valore** quando vengono premiati invece che compresi (legge di Goodhart) [23][24].
> - **Power BI** si presta bene alle dashboard dei KPI se il modello dati è uno schema a stella e l'OEE viene calcolato dai tempi sommati, non dalle medie di percentuali [27].

## Indice

1. Che cosa sono i KPI di produzione?
2. Promemoria dei KPI di produzione: tutte le formule a colpo d'occhio
3. L'esempio svolto "Linea 3": dati di input
4. Metriche temporali: takt time, cycle time, lead time, tempo di lavorazione, fattore di flusso
5. Takt time vs. cycle time vs. lead time
6. Tempo di cambio formato, SMED e micro-fermate
7. OEE: come calcolare l'efficienza complessiva delle attrezzature
8. KPI di qualità: tasso di scarto, first pass yield, tasso di rilavorazione, PPM
9. KPI di consegna e scorte: OTIF, rispetto del programma, WIP, giorni di copertura
10. Capacità e produttività: utilizzo, efficienza di utilizzo, produttività del lavoro
11. KPI di manutenzione: MTBF, MTTR e disponibilità intrinseca
12. Energia, sicurezza (TRIR, DART, LTIFR) e costo per unità
13. Sistemi di KPI: gerarchia, indicatori anticipatori e ritardati, SQCDP
14. Raccolta dati e qualità dei dati
15. Visualizzazione: lavagne di reparto e dashboard Power BI
16. Come fissare gli obiettivi dei KPI
17. Errori comuni e come evitarli
18. Roadmap: introdurre i KPI di produzione in 90 giorni
19. KPI dalla modellazione del flusso del valore: iFAKT Polaris
20. Glossario
21. FAQ: KPI di produzione
22. Conclusione

## 1. Che cosa sono gli indicatori KPI di produzione?

Gli indicatori KPI di produzione (detti anche metriche di produzione, KPI di produzione o indicatori chiave di prestazione nella manifattura) sono valori sintetici che rendono misurabile un aspetto della produzione. Quanto velocemente un ordine attraversa lo stabilimento? Quanta parte del tempo pianificato una macchina produce effettivamente pezzi buoni? Quante spedizioni arrivano al cliente in tempo e complete? Ogni KPI si compone di quattro elementi: una **definizione** (che cosa esattamente viene contato), una **formula**, un'**unità** di misura e un **periodo di riferimento**. Se manca uno di questi elementi, si ottiene la familiare riunione in cui due reparti usano lo stesso nome per due numeri diversi.

Non ogni metrica è un [indicatore chiave di prestazione (KPI)](https://www.m365.fm/entity/key-performance-indicator/). Un KPI è una metrica legata direttamente a un obiettivo e che guida regolarmente le decisioni. Il numero di pezzi prodotti è una metrica. La consegna puntuale al cliente è un KPI per la maggior parte degli stabilimenti, perché il fatturato e la fidelizzazione dei clienti dipendono da essa.

### Gli standard alla base delle formule: ISO 22400, ISA-95, SEMI e VDMA 66412

Non è necessario inventare le definizioni dei propri KPI. La norma internazionale **ISO 22400-2:2014** "Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions" definisce una selezione di KPI comuni con formula, tempistica, unità, gruppo di utenti e metodologia produttiva a cui si applicano [1]. Fonti secondarie contano 34 KPI [38][3]. ISO indica la norma come "da rivedere"; l'Emendamento 1 ha aggiunto nel 2017 un insieme di KPI energetici [1].

La norma utilizza un modello temporale preciso. Kang et al., in un articolo pubblicato tramite il National Institute of Standards and Technology (NIST) statunitense, riportano le formule fondamentali: disponibilità = tempo di produzione effettivo (APT) ÷ tempo di occupazione pianificato (PBT), ed efficacia = tempo di esecuzione pianificato per pezzo (PRI) × quantità prodotta (PQ) ÷ APT [3]. Quindi la norma parla di "efficacia" dove la letteratura TPM dice "prestazione".

Per i lettori statunitensi, **ISA-95** (ANSI/ISA-95, a livello internazionale IEC 62264) fornisce l'architettura attorno a questi KPI. Basato sul modello di riferimento Purdue, definisce cinque livelli, dal processo fisico (Livello 0) attraverso rilevamento, controllo di supervisione e **Livello 3, gestione delle operazioni di produzione (MOM), dove risiedono MES e SCADA**, fino alla pianificazione aziendale e alla logistica in ERP (Livello 4) [40]. I KPI ISO 22400 sono, per denominazione, KPI per la gestione delle operazioni di produzione, quindi vengono calcolati al Livello 3 ISA-95 e riportati verso l'alto. Nelle fabbriche di semiconduttori, SEMI E10 (affidabilità, disponibilità, manutenibilità e utilizzo delle apparecchiature) e SEMI E79 (produttività delle apparecchiature, inclusa l'OEE) sono i riferimenti specifici del settore [41].

In Germania, un gruppo di lavoro della VDMA (l'associazione dell'industria meccanica tedesca) ha pubblicato la linea guida **VDMA 66412-1 "Manufacturing Execution Systems (MES) – KPIs"** (edizione 2009-10, 36 pagine, modificata da A1:2010-05) [4]. Definisce KPI standard e il modo di calcolarli a partire dagli stati delle macchine [5]. Il messaggio per voi come professionisti è lo stesso in ogni Paese: adottare i termini standard ove possibile e documentare ogni deviazione. Questo rende molto più semplici i confronti tra stabilimenti e l'integrazione con il MES.

### A che cosa servono i KPI di produzione

I KPI svolgono tre funzioni. **Rendono visibile** ciò che si perde nell'attività quotidiana, ad esempio che una macchina funziona sempre ma fornisce solo due terzi della sua potenziale produzione. **Concentrano l'attenzione** sulla leva più importante, perché scompongono le perdite in categorie. E **verificano le contromisure**: il nuovo metodo di cambio formato ha davvero ridotto il tempo di attrezzaggio, oppure la perdita si è semplicemente spostata nella fase di avviamento? Senza un numero, quella domanda resta una questione di opinione.

Una quarta funzione viene spesso dimenticata: i KPI sono uno **strumento di comunicazione**. Nella [gestione del reparto produttivo](https://www.m365.fm/entity/shop-floor-management/) sono il linguaggio comune tra operatori, capiturno e direzione dello stabilimento. Servono a questo scopo solo se tutti conoscono la definizione e vedono lo stesso numero.

## 2. Scheda di riferimento KPI di produzione: tutte le formule a colpo d'occhio

La tabella riassume tutti i KPI trattati in questa guida. "Livello" indica il tipico livello di gestione (M = macchina/postazione, L = linea/area, P = stabilimento). Le formule seguono le fonti citate in ciascuna sezione.

| KPI | Formula (forma abbreviata) | Unità | Direzione | Livello |
|---|---|---|---|---|
| Takt time | tempo di produzione disponibile ÷ domanda del cliente | s/unità | un dato di partenza, non qualcosa da ottimizzare | L |
| Cycle time | tempo misurato tra due unità finite | s/unità | ≤ takt | M, L |
| Lead time di produzione | fine − inizio (ordine o pezzo); in media WIP ÷ throughput | h, giorni | ↓ | L, P |
| Tempo di lavorazione | somma dei tempi in cui il pezzo viene effettivamente lavorato | s, min | ↓ (senza perdita di qualità) | M, L |
| Flow factor (Wiendahl) | lead time ÷ tempo di operazione | rapporto (≥ 1) | ↓ | L |
| Quota a valore aggiunto (VSM) | tempo di lavorazione ÷ lead time × 100 | % | ↑ | L, P |
| Tempo di changeover | ultimo pezzo buono del lotto precedente → primo pezzo buono del nuovo lotto | min | ↓ | M |
| Incidenza del changeover | tempo di changeover ÷ tempo di produzione pianificato × 100 | % | ↓ | M, L |
| Micro-fermate | numero o durata di brevi fermate sotto una soglia definita | conteggio, min | ↓ | M |
| Disponibilità (OEE) | tempo di marcia ÷ tempo di produzione pianificato | % | ↑ | M |
| Prestazione (OEE) | tempo ciclo ideale × conteggio totale ÷ tempo di marcia | % | ↑ | M |
| Tasso di qualità (OEE) | conteggio buoni ÷ conteggio totale | % | ↑ | M |
| OEE | disponibilità × prestazione × qualità | % | ↑ | M, L |
| TEEP | OEE × caricamento (tempo pianificato ÷ tempo di calendario) | % | ↑ | M, P |
| Tasso di scarto | conteggio scarti ÷ conteggio totale × 100 | % | ↓ | M, L, P |
| First pass yield (FPY) | unità buone al primo passaggio ÷ conteggio totale × 100 | % | ↑ | M, L |
| Tasso di rilavorazione | conteggio rilavorati ÷ conteggio totale × 100 | % | ↓ | M, L |
| PPM | pezzi difettosi ÷ pezzi controllati o spediti × 1.000.000 | ppm | ↓ | P |
| OTIF | righe consegnate in tempo e al completo ÷ tutte le righe dovute × 100 | % | ↑ | P |
| Aderenza al programma (produzione) | ordini completati nei tempi previsti ÷ tutti gli ordini dovuti × 100 | % | ↑ | L, P |
| WIP | quantità o valore del lavoro in corso | unità, $ | ↓ (fino al minimo necessario) | L |
| Giorni di copertura | giacenza ÷ consumo medio giornaliero | giorni | ↓ (fino al livello di sicurezza) | L, P |
| Saturazione della capacità | carico ÷ capacità disponibile × 100 | % | fascia obiettivo, non massimo | L, P |
| Efficienza di utilizzo (ISO) | tempo di produzione effettivo ÷ tempo effettivo di occupazione dell'unità | % | ↑ | M |
| Produttività del lavoro | conteggio buoni ÷ ore di lavoro | unità/h | ↑ | L, P |
| MTBF | tempo di marcia ÷ numero di guasti | h, min | ↑ | M |
| MTTR | tempo totale di riparazione ÷ numero di guasti | min | ↓ | M |
| Energia per unità | energia consumata ÷ conteggio buoni | kWh/unità | ↓ | M, P |
| TRIR (OSHA) | casi registrabili × 200.000 ÷ ore lavorate | ogni 100 FTE | ↓ | P |
| DART rate (OSHA) | casi DART × 200.000 ÷ ore lavorate | ogni 100 FTE | ↓ | P |
| LTIFR | infortuni con perdita di tempo ÷ ore lavorate × 1.000.000 | ogni 1 milione di h | ↓ | P |
| Costo per unità | costo del periodo ÷ conteggio buoni | $/unità | ↓ | L, P |

## 3. Il caso pratico "Linea 3": dati di input

Per rendere concrete le formule, questa guida calcola ogni KPI su una linea di assemblaggio fittizia. I numeri sono scelti in modo che si verifichino a vicenda: se l'OEE è corretto, deve corrispondere al conteggio dei pezzi buoni, e se il lead time è corretto, deve corrispondere a WIP e throughput.

| Input | Valore |
|---|---|
| Turnazione | 2 turni da 8 h (480 min), 5 giorni a settimana |
| Pause per turno | 30 min (non tempo di produzione pianificato) |
| Tempo di produzione pianificato per turno | 450 min |
| Domanda del cliente | 900 unità al giorno, cioè 450 unità per turno |
| Tempo ciclo ideale (stazione collo di bottiglia) | 50 s/unità |
| Guasti per turno | 25 min |
| Cambi formato per turno | 2 cambi formato da 10 min = 20 min |
| Conteggio totale per turno | 432 unità |
| di cui buoni al primo passaggio | 410 unità |
| di cui rilavorati e poi buoni | 12 unità |
| di cui scarti | 10 unità |
| Personale | 6 operatori per turno |

Questi input ritornano in ogni sezione. Ogni calcolo è stato ricontrollato; l'arrotondamento avviene solo nel risultato. I costi della Sezione 12 sono espressi in dollari USA; le cifre sono indicative, come la linea stessa.

## 4. Metriche temporali: takt time, tempo ciclo, lead time, tempo di processo, flow factor

Le metriche temporali sono i KPI di produzione più spesso confusi. I termini suonano simili e le aziende li usano in modo diverso nella pratica. Scrivete una volta la definizione per il vostro stabilimento e collegatela a ogni lavagna.

### Come calcolare il takt time

Il [takt time](https://www.m365.fm/entity/takt-time/) indica con quale frequenza un'unità finita deve lasciare la linea per soddisfare la domanda del cliente. Il Lean Enterprise Institute (LEI) lo definisce come il tempo di produzione disponibile diviso la domanda del cliente [9]. Rother e Shook indicano "Produrre al ritmo del takt time" come primo principio per un flusso di valore snello e descrivono il takt come rappresentazione della domanda del cliente [2][12].

> **Takt time = tempo di produzione disponibile per periodo ÷ domanda del cliente per periodo**

La parola deriva dal tedesco ("Takt" significa battito o misura). Secondo il LEI, il takt fu utilizzato per la prima volta come strumento di gestione della produzione nell'industria aeronautica tedesca degli anni Trenta [9].

**Esempio Linea 3:** tempo disponibile per turno 450 min = 27.000 s; domanda per turno 450 unità.
Takt time = 27.000 s ÷ 450 unità = **60 s/unità**.

Come verifica incrociata, l'esempio del LEI: 480 minuti al giorno e una domanda di 240 unità danno un takt time di 2 minuti [9].

**Errori comuni:**
- **Non sottrarre le pause.** Usare 480 invece di 450 minuti dà un takt di 64 s. Sulla carta, la linea risulterebbe progettata troppo lenta.
- **Sottrarre i fermi non pianificati.** I guasti non rientrano nel tempo disponibile per il takt. Sono una perdita che la linea deve assorbire attraverso la sua riserva di capacità. Sottrarli nasconde il problema dentro il takt.
- **Trattare il takt come qualcosa da ottimizzare.** Il takt è fissato dal cliente, non dalla produzione. Ciò che si ottimizza è il tempo ciclo, affinché rispetti in modo affidabile il takt.
- **Confondere il takt con una velocità.** Il takt è tempo per unità, non unità per tempo. Il suo inverso (1 unità ogni 60 s = 60 unità all'ora) è la cadenza produttiva richiesta.

### Tempo ciclo

Secondo il LEI, il [tempo ciclo](https://www.m365.fm/entity/cycle-time/) è "il tempo richiesto per produrre un pezzo o completare un processo, misurato con rilevazione effettiva" [10]. Nella mappatura del flusso del valore descrive ogni quanto un processo completa un pezzo. La parola chiave è "misurato": il tempo ciclo è un valore effettivo. Il **tempo ciclo ideale** (detto anche tempo standard, di progetto o di targa) è il miglior tempo tecnicamente possibile e la base della performance dell'OEE.

> **Tempo ciclo effettivo medio = tempo di marcia ÷ unità prodotte**

**Esempio Linea 3:** tempo di marcia 405 min (450 min meno 25 min di guasti meno 20 min di cambi formato) = 24.300 s; 432 unità prodotte.
Tempo ciclo effettivo = 24.300 s ÷ 432 = **56,25 s/unità**.
Il tempo ciclo ideale è 50 s. Lo scarto di 6,25 s per unità si colloca in microfermate e riduzione di velocità, cioè nella perdita di performance (Sezione 7).

Per le macchine, il LEI definisce inoltre il **tempo ciclo effettivo della macchina**: tempo ciclo della macchina più tempo di carico e scarico più tempo di cambio formato, divisi per il numero di pezzi prodotti tra due cambi formato [10]. Questo indica se una macchina può rispettare il takt, dato quanto spesso viene cambiata.

**Errore comune:** equiparare il takt time al tempo ciclo. Entrambi si misurano in secondi per unità, ma il takt è un dato di domanda e il tempo ciclo è un dato di processo. Almeno una pagina in inglese ben posizionata riporta la formula del tempo ciclo al contrario (pezzi ÷ tempo di esecuzione); ma quello è un tasso, non un tempo ciclo.

### Come calcolare il lead time di produzione

Il [lead time](https://www.m365.fm/entity/lead-time/) (lead time di produzione, detto anche tempo di attraversamento) è "il tempo necessario affinché un prodotto attraversi interamente un processo o un flusso di valore dall'inizio alla fine" [10]. Oltre alla lavorazione, comprende tutti i tempi di trasporto, di coda e di attesa. L'ingegneria della produzione tedesca lo suddivide in tempo di operazione (attrezzaggio e lavorazione), tempo di transizione (code e trasporto) e tempo di attesa tra le operazioni [15]. Hans-Peter Wiendahl ha fatto del lead time il concetto centrale del controllo della produzione con il suo modello a imbuto [15][14].

Esistono due modi per determinarlo:

**1. Direttamente, per ordine o per pezzo:**

> **Lead time = timestamp di completamento − timestamp di avvio (o rilascio dell'ordine)**

Occorre decidere se contare giorni di calendario, giorni lavorativi (giorni di calendario di reparto) o ore, e da quale momento far partire il conteggio (inserimento dell'ordine, rilascio, prima operazione). Punti di partenza diversi sono la causa più comune per cui vendite e produzione discutono su "il" lead time.

**2. Indirettamente, con la Legge di Little:**

Nel 1961 John D. C. Little ha dimostrato che in un sistema stabile il numero medio di elementi nel sistema è uguale al tasso di arrivo moltiplicato per il tempo medio di permanenza nel sistema (L = λW) [13]. Applicata alla produzione:

> **Lead time medio = WIP medio ÷ throughput medio**

**Esempio per la linea 3:** in media 2.700 pezzi si trovano nella linea e nei suoi buffer; la linea spedisce in media 900 pezzi al giorno lavorativo.
Lead time = 2.700 ÷ 900 = **3 giorni lavorativi**.

La Legge di Little vale per medie su un periodo sufficientemente lungo, durante il quale il WIP non cresce né diminuisce stabilmente. WIP e throughput devono usare la stessa unità (pezzi o euro, non misure miste). Il suo grande valore pratico: mostra che, a throughput costante, un lead time più breve è possibile solo con meno WIP. Macchine più veloci da sole servono a poco finché i pezzi attendono davanti a esse.

### Tempo di lavorazione e tempo standard (REFA)

Il **tempo di lavorazione** è il tempo in cui il prodotto è effettivamente in lavorazione [10]; di solito è una piccola frazione del lead time. Per la pianificazione e il costing, gli stabilimenti tedeschi usano le categorie di tempo del REFA, l'associazione tedesca per la progettazione del lavoro e l'ingegneria industriale (comparabile per ruolo alle convenzioni sui tempi standard dell'ingegneria industriale statunitense). Il REFA divide il tempo d'ordine in tempo di attrezzaggio e tempo di esecuzione, ciascuno composto da componenti base, di riposo e di tolleranza; la controparte lato macchina si chiama tempo di occupazione dell'impianto [16][17]:

> **Tempo d'ordine T = tempo di attrezzaggio t_r + tempo di esecuzione t_a**, con **t_a = quantità d'ordine m × tempo per unità t_e**

**Esempio:** un ordine di 400 unità viene eseguito sulla stazione collo di bottiglia: attrezzaggio 20 min, tempo per unità 50 s.
T = 20 min + 400 × 50 s ÷ 60 = 20 + 333,3 = **353,3 min** (circa 5,9 h).

Nyhuis e Wiendahl ricavano il **tempo di operazione** di una fase di lavoro dal tempo d'ordine ed lo esprimono in giorni di calendario di reparto mettendo in relazione il tempo d'ordine con la capacità giornaliera del sistema di lavoro [14]. [unverified: notazione esatta della formula in Nyhuis/Wiendahl, Sezione 2.1.1, verificata solo tramite l'indice e l'elenco delle abbreviazioni] Per rendere gli esempi confrontabili, questa guida semplifica e calcola in minuti di tempo operativo; per una singola macchina, il tempo di operazione coincide quindi con il tempo d'ordine.

### Flow factor e rapporto di valore aggiunto

Circolano due KPI diversi con nomi simili, e non vanno confusi.

**Flow factor secondo Wiendahl (visione logistica):** il rapporto tra lead time e tempo di operazione di una fase di lavoro o di un ordine [14][15]. Un valore di 1 significa che l'ordine è stato lavorato senza attese; un valore di 6 significa che ha trascorso nel sistema sei volte il tempo richiesto da attrezzaggio e lavorazione.

> **Flow factor = lead time ÷ tempo di operazione**

**Esempio:** l'ordine dell'esempio REFA ha un tempo di operazione di 353,3 min. Attende due giorni lavorativi prima dell'operazione (2 × 900 min = 1.800 min di tempo operativo).
Lead time dell'operazione = 1.800 + 353,3 = 2.153,3 min. Flow factor = 2.153,3 ÷ 353,3 = **6,09**.

**Rapporto di valore aggiunto (vista del flusso di valore):** nella [mappatura del flusso di valore](https://www.m365.fm/entity/value-stream-mapping/) è diffusa la visione opposta: la quota del tempo di lavorazione nel lead time, in percentuale. (Il "tempo a valore creato" più ristretto della LEI conta solo gli elementi di lavoro per i quali il cliente è disposto a pagare [10].) Il Wikipedia tedesco chiama questo rapporto "Fließgrad", il suo inverso "Flussgrad", e colloca la quota di attività a valore aggiunto nell'industria tedesca tra il 5 e il 15 percento [15]. [unverified: fonte primaria per questo intervallo non chiaramente documentata in Wikipedia] Alcuni manuali sul flusso di valore chiamano la percentuale anche fattore di flusso. Verificate quindi sempre se si intende un valore superiore a 1 o inferiore al 100 %.

> **Rapporto di valore aggiunto = tempo di lavorazione ÷ lead time × 100 %**

**Esempio per la linea 3:** i tempi di lavorazione delle quattro stazioni sommano a 190 s. Il lead time è di 3 giorni lavorativi di 900 min di tempo operativo ciascuno = 162.000 s.
Rapporto di valore aggiunto = 190 ÷ 162.000 × 100 % = **0,117 %**.

Valori inferiori all'1 percento sono normali nelle operazioni con polmoni e lotti. Ciò che conta è il trend e la base temporale: sul tempo di calendario il valore scende ulteriormente. Il metodo è trattato in dettaglio nella guida [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

## 5. Takt time, cycle time e lead time a confronto

"Qual è la differenza tra takt time e cycle time?" è una delle domande più frequenti sui KPI di produzione. La tabella mette a confronto i tre concetti. La LEI riassume così l'ordine di grandezza: "Di solito il tempo a valore creato è inferiore al cycle time, che a sua volta è inferiore al lead time di produzione" [10].

| Attributo | Takt time | Cycle time | Lead time |
|---|---|---|---|
| Domanda | Ogni quanto **deve** essere completato un pezzo? | Ogni quanto **viene** completato un pezzo? | Quanto tempo **impiega** un pezzo nel sistema? |
| Fonte | domanda del cliente e tempo di lavoro | misurazione al processo | timestamp o legge di Little |
| Formula | tempo disponibile ÷ domanda | tempo di esecuzione ÷ unità (misurato) | fine − inizio, oppure WIP ÷ throughput |
| Unità tipica | s/unità | s/unità | h, giorni |
| Linea 3 | 60 s | 56,25 s (ideale 50 s) | 3 giorni lavorativi |
| Chi lo influenza? | vendite, cliente, turni | ingegneria, metodo, manutenzione | pianificazione, WIP, dimensioni dei lotti |
| Direzione sensata | nessuna; è un dato | ≤ takt con una riserva | il più breve possibile |
| Errore comune | pause non sottratte | uso del valore ideale al posto di quello effettivo | punto di partenza non definito |

**Osservazione chiave dall'esempio:** il cycle time effettivo di 56,25 s è inferiore al takt di 60 s. Eppure la linea 3 non riesce a soddisfare la domanda, come mostrano le sezioni successive, perché il cycle time vale solo durante il tempo di marcia. Guasti, cambi formato e scarti non compaiono in questa visione. Per la progettazione della linea conta il **cycle time effettivo per pezzo buono**, cioè il tempo di produzione pianificato diviso per il numero di pezzi buoni.

## 6. Tempi di cambio formato, SMED e micro-fermate

### Tempo di cambio formato e quota di cambio formato

Il [tempo di cambio formato](https://www.m365.fm/entity/setup-time/) (tempo di setup) è il tempo necessario per passare una macchina o una linea da un prodotto a un altro. Nella pratica funziona meglio misurare dall'ultimo pezzo buono della produzione precedente al primo pezzo buono della nuova produzione, perché include la regolazione e la fase di avviamento. [unverified: questa convenzione è diffusa nella pratica ma non è riportata testualmente nelle fonti consultate qui.] Nel sistema REFA il tempo di setup fa parte del tempo d'ordine [16].

> **Quota di cambio formato = tempo di cambio formato ÷ tempo di produzione pianificato × 100 %**

**Esempio linea 3:** 20 min di cambio formato ÷ 450 min = **4,44 %**.

### SMED: cambi formato in pochi minuti

[SMED](https://www.m365.fm/entity/smed/) (Single-Minute Exchange of Die) è un metodo per rendere i cambi formato il più brevi possibile; l'obiettivo è un tempo di cambio formato a una sola cifra in minuti, cioè inferiore a dieci minuti [11]. Shigeo Shingo ha sviluppato le idee di base tra gli anni Cinquanta e Sessanta: ha separato il setup interno, che può essere eseguito solo a macchina ferma, dal setup esterno, che può essere eseguito mentre la macchina è in marcia, e ha spostato il più possibile sul setup esterno [11].

**Esempio linea 3:** se entrambi i cambi formato scendono da 10 a 6 min, la linea guadagna 8 min di tempo di marcia per turno. A parità di performance dell'88,9 %, questo equivale a 8 × 60 ÷ 50 × 0,889 = **circa 8,5 pezzi in più** per turno. In alternativa, la linea può mantenere lo stesso tempo totale di cambio formato, cambiare formato più spesso e produrre lotti più piccoli, il che riduce il WIP e il lead time.

**Errore comune:** considerare il tempo di cambio formato solo come una perdita. Cambi formato più brevi sono soprattutto una leva per lotti più piccoli. Se si impiega tutto il tempo guadagnato per produrre lotti più grandi, si rinuncia al vantaggio logistico.

### Micro-fermate

Le [micro-fermate](https://www.m365.fm/entity/micro-stops/) (fermate minori) sono brevi interruzioni, come un pezzo inceppato o un sensore che scatta, che singolarmente quasi non vengono registrate. Nel framework TPM di Nakajima rientrano tra le sei grandi perdite come "perdite per funzionamento a vuoto e fermate minori" e riducono la performance, non la disponibilità [7]. Ogni azienda definisce una propria soglia tra micro-fermata e guasto; sono comuni soglie di alcuni minuti. [unverified: non è stato trovato alcuno standard con una soglia vincolante.] Muchiri e Pintelon sottolineano che la registrazione manuale spesso non rileva le fermate piccole [7].

**Esempio linea 3:** la perdita di performance complessiva è il tempo di marcia meno il tempo ideale per i pezzi prodotti: 405 min − 432 × 50 s ÷ 60 = 405 − 360 = **45 min**. Il controllore della macchina conta 120 micro-fermate da 15 s ciascuna = 30 min. I restanti 15 min sono dovuti a una velocità ridotta. Senza una rilevazione automatica dei dati, quei 30 minuti di micro-fermate sarebbero probabilmente stati registrati nel rapporto di turno come "linea in marcia".

## 7. OEE: come calcolare l'efficienza complessiva delle apparecchiature

L'efficienza complessiva delle apparecchiature (OEE, Overall Equipment Effectiveness) è il KPI manifatturiero più noto. Il termine risale a Seiichi Nakajima ed è un elemento centrale del [Total Productive Maintenance (TPM)](https://www.m365.fm/entity/total-productive-maintenance/) [8][6]. Il glossario ASQ descrive l'OEE come una misura di quanto bene un'unità produttiva opera rispetto alla sua capacità di progetto durante i periodi in cui è programmata per funzionare, combinando disponibilità, velocità e quota di produzione conforme [36]. L'OEE risponde a una domanda: quale percentuale del tempo di produzione pianificato è stata usata per realizzare pezzi conformi alla velocità ideale?

### I tre fattori

> **OEE = Disponibilità × Prestazione × Qualità**

| Fattore | Formula | Perdite che cattura |
|---|---|---|
| Disponibilità | tempo di marcia ÷ tempo di produzione pianificato | guasti, attrezzaggio e regolazione |
| Prestazione (ISO: efficacia) | tempo ciclo ideale × conteggio totale ÷ tempo di marcia | micro-fermate, riduzione di velocità |
| Qualità | conteggio conforme ÷ conteggio totale | scarti, rilavorazioni, perdite di avviamento |

Muchiri e Pintelon definiscono la disponibilità come tempo operativo in percentuale del tempo di carico, la prestazione come tempo ciclo teorico per produzione effettiva diviso il tempo operativo, e il tasso di qualità come produzione totale meno difetti rispetto alla produzione totale [7]. La ISO 22400-2 segue la stessa logica con i propri termini temporali [3].

### Le sei grandi perdite

Nakajima attribuisce le perdite a sei categorie [7]:

1. **Guasti** (perdite per guasto) → disponibilità
2. **Attrezzaggio e regolazione** → disponibilità
3. **Marcia a vuoto e micro-fermate** → prestazione
4. **Riduzione di velocità** → prestazione
5. **Difetti di qualità e rilavorazioni** → qualità
6. **Resa ridotta in fase di avviamento** → qualità

Questa corrispondenza è il vero valore dell'OEE. Il totale da solo dice poco; solo la scomposizione mostra se la manutenzione, la squadra dei cambi formato o la qualità hanno la leva più importante.

### Come calcolare l'OEE: l'esempio della Linea 3

**Passo 1, disponibilità:** tempo di produzione pianificato 450 min; guasti 25 min, cambi formato 20 min; tempo di marcia 405 min.
Disponibilità = 405 ÷ 450 = **90,0 %**.

**Passo 2, prestazione:** 432 unità × 50 s = 21.600 s di tempo ideale; tempo di marcia 405 min = 24.300 s.
Prestazione = 21.600 ÷ 24.300 = **88,9 %**.

**Passo 3, qualità:** 410 pezzi conformi al primo passaggio su 432 unità.
Qualità = 410 ÷ 432 = **94,9 %**.

**Passo 4, OEE:** 0,900 × 0,8889 × 0,9491 = **75,9 %**.

**Verifica incrociata tramite il tempo:** conteggio conforme per tempo ciclo ideale diviso il tempo di produzione pianificato = 410 × 50 s ÷ 27.000 s = 20.500 ÷ 27.000 = **75,9 %**. Entrambi i metodi devono dare lo stesso risultato; se non lo fanno, i dati di input sono errati.

**Che cosa significa l'OEE per il takt:** il tempo ciclo effettivo per pezzo conforme è 50 s ÷ 0,759 = 65,9 s, superiore al takt di 60 s. In 27.000 s la linea produce 410 pezzi conformi al primo passaggio, 422 includendo i 12 pezzi rilavorati. La domanda di 450 unità per turno viene mancata di 28 unità. Per coprirla con soli pezzi conformi al primo passaggio, la Linea 3 avrebbe bisogno di un OEE di 450 × 50 ÷ 27.000 = 83,3 %.

### Rilavorazione: buona o cattiva?

Nella logica TPM la rilavorazione è una perdita di qualità [7]; per questo l'esempio conta solo i 410 pezzi conformi al primo passaggio. Kang et al. usano un tasso di qualità che conta i pezzi rilavorati come conformi [3]. Con 422 invece di 410 pezzi, la qualità salirebbe al 97,7 % e l'OEE al 78,1 %. Entrambe le varianti sono sostenibili, ma bisogna sceglierne una e non si devono confrontare stabilimenti che usano definizioni diverse.

### TEEP: l'OEE rispetto al tempo di calendario

L'efficacia complessiva effettiva delle apparecchiature (TEEP, Total Effective Equipment Performance) mette in relazione l'OEE con il tempo di calendario totale anziché con il solo tempo pianificato [8]:

> **TEEP = OEE × carico**, con **carico = tempo di produzione pianificato ÷ tempo di calendario**

**Esempio Linea 3:** 10 turni × 450 min = 4.500 min di tempo pianificato a settimana; tempo di calendario 7 × 24 × 60 = 10.080 min.
Carico = 4.500 ÷ 10.080 = 44,6 %. TEEP = 75,9 % × 44,6 % = **33,9 %**.

Il TEEP è il KPI giusto per le decisioni di investimento: prima di acquistare una seconda macchina, mostra quanto tempo di calendario inutilizzato ha ancora quella esistente. Si noti che alcune pagine in inglese attribuiscono a OEE, OOE e TEEP la stessa formula; è un errore, perché le tre differiscono nella base temporale.

### Che cos'è un buon OEE? Da dove deriva il benchmark dell'85 % e perché è contestato

La cifra dell'85 % come "OEE di classe mondiale" viene regolarmente attribuita a Nakajima negli articoli di settore, spesso costruita a partire da una disponibilità del 90 %, una performance del 95 % e una qualità del 99,9 % (0,90 × 0,95 × 0,999 = 85,4 %) [37]. Nelle fonti primarie e di revisione consultate per questo articolo, la scomposizione nelle singole componenti non è stata trovata alla lettera. [unverified: passo originale in Nakajima 1988] La Wikipedia in inglese afferma esplicitamente che l'85 % non è l'obiettivo corretto in molti casi, ad esempio quando non tutte le perdite vengono rilevate o quando i requisiti di qualità del settore sono più elevati [8].

Ulteriori punti critici [8]:

- L'OEE si comporta come una media geometrica e penalizza i fattori disuguali: 20 % × 80 % = 16 %, 50 % × 50 % = 25 %.
- Le definizioni variano da un'azienda all'altra, quindi l'OEE è poco adatto a confronti tra stabilimenti o tipologie di macchine.
- L'OEE non è una misura della prestazione individuale dei dipendenti.

Usare l'OEE come KPI di miglioramento per lo stesso asset nel tempo, non come classifica. Uno stabilimento a processo continuo che funziona 24/7 e una job shop con molti cambi formato hanno valori strutturalmente diversi.

### Aggregare correttamente l'OEE su più macchine

Un errore comune nella reportistica è calcolare la media delle percentuali di OEE. Esempio: la macchina A ha un OEE dell'80 % con 450 min di tempo pianificato, la macchina B del 50 % con 150 min.

- Errato (media semplice): (80 % + 50 %) ÷ 2 = 65,0 %
- Corretto (ponderato sul tempo): (0,80 × 450 + 0,50 × 150) ÷ (450 + 150) = (360 + 75) ÷ 600 = **72,5 %**

L'approccio più pulito è ricalcolare l'OEE a ogni livello a partire dai tempi sommati: somma del tempo a valore aggiunto (pezzi buoni × tempo ciclo ideale) diviso per la somma del tempo pianificato. La sezione 15 mostra la formula DAX corrispondente.

## 8. KPI di qualità: tasso di scarto, resa al primo passaggio, tasso di rilavorazione, PPM

I KPI di qualità rispondono a due domande diverse: quanto materiale e tempo si perdono all'interno dello stabilimento (interno), e quanti difetti raggiungono il cliente (esterno)? Ciascuna prospettiva richiede i propri KPI. La ISO 22400-2 include, tra gli altri, il quality ratio, lo scrap ratio, il rework ratio e una first pass yield [3]; i tassi di scarto e di rilavorazione compaiono anche nell'elenco dei 34 KPI ISO di Fabrico [38].

### Formula del tasso di scarto

Il [tasso di scarto](https://www.m365.fm/entity/scrap-rate/) misura la quota di pezzi che non possono più essere utilizzati e vengono scartati o riciclati. Nella presentazione di Kang et al., la formula ISO è quantità scartata divisa per quantità prodotta [3].

> **Tasso di scarto = numero di scarti ÷ numero totale × 100 %**

**Esempio linea 3:** 10 pezzi scartati ÷ 432 pezzi × 100 % = **2,31 %**.

**Errori comuni:**
- **Cambiare la base.** A volte si usa il numero totale, a volte il numero di pezzi buoni (10 ÷ 422 = 2,37 %). Con tassi bassi la differenza è piccola; con tassi alti conta.
- **Trascurare lo scarto di avviamento.** I pezzi eliminati durante la messa a punto dopo un cambio formato spesso non vengono contati. Eppure indicano se i cambi formato sono sotto controllo.
- **Contare solo i pezzi, non il valore.** Un pezzo scartato alla fine del flusso di valore costa molte volte più di un pezzo grezzo. Aggiungere il costo dello scarto al tasso di scarto in pezzi.

### Resa al primo passaggio (FPY)

La resa al primo passaggio (anche first time through o right first time) misura la quota di unità che superano un processo la prima volta senza rilavorazione e senza scarto. L'ASQ descrive la FPY, detta anche tasso di qualità, come la percentuale di unità che completano un processo e soddisfano le linee guida di qualità senza essere scartate, rieseguite, ritestate, restituite o deviate verso un'area di riparazione offline [36]. Kang et al. indicano la formula come quantità buona al primo passaggio divisa per quantità prodotta [3].

> **FPY = unità buone al primo passaggio ÷ numero totale × 100 %**

**Esempio linea 3:** 410 ÷ 432 × 100 % = **94,9 %**.

Per più fasi di processo, moltiplicare i valori FPY delle singole fasi per ottenere la **rolled throughput yield (RTY)**. Tre stazioni con una FPY del 98 % ciascuna danno 0,98 × 0,98 × 0,98 = 94,1 %. La RTY indica quanti pezzi arrivano in fondo alla catena senza alcuna correzione. [unverified: la RTY è diffusa nella letteratura Six Sigma ma non è stata verificata con una fonte primaria per questo articolo.]

**Qualità OEE vs. FPY:** se si considera la rilavorazione come perdita, FPY e tasso di qualità OEE coincidono (entrambi 94,9 % nell'esempio). Se si conta la rilavorazione come buona, la qualità OEE equivale alla resa finale: (410 + 12) ÷ 432 = 97,7 %.

### Tasso di rilavorazione

> **Tasso di rilavorazione = numero di pezzi rilavorati ÷ numero totale × 100 %**

**Esempio linea 3:** 12 ÷ 432 × 100 % = **2,78 %**.

La verifica: FPY + tasso di rilavorazione + tasso di scarto = 94,91 % + 2,78 % + 2,31 % = 100 %. Questo controllo di somma dovrebbe girare automaticamente in ogni dashboard; se non torna, mancano transazioni.

Il rework viene spesso sottovalutato perché il pezzo finisce per essere buono. Tuttavia impegna persone, crea WIP e allunga il lead time. Registra sia il tempo di rework sia la quantità rilavorata.

### PPM (parti per milione)

ASQ definisce il PPM come una metrica che riporta il numero di difetti normalizzato su una popolazione di un milione, per facilitare il confronto [36]. Viene usato principalmente per i reclami dei clienti e per la valutazione dei fornitori.

> **PPM = parti difettose ÷ parti spedite (o ispezionate) × 1.000.000**

**Esempio:** in un trimestre lo stabilimento spedisce 250.000 parti; il cliente ne respinge 18. PPM = 18 ÷ 250.000 × 1.000.000 = **72 ppm**.

Concorda con il cliente se contano le parti respinte, le spedizioni respinte o i reclami accettati. Esprimere lo scarto interno in PPM (Linea 3: 10 ÷ 432 × 1.000.000 = 23.148 ppm) è possibile ma poco intuitivo; in questo caso la percentuale funziona meglio.

## 9. KPI di consegna e di giacenza: OTIF, aderenza al programma, WIP, giorni di copertura

### Consegna puntuale e OTIF

Le prestazioni di consegna misurano quanto affidabilmente lo stabilimento mantiene le promesse fatte ai clienti. La forma più comune è **OTIF** (on time in full, puntuale e completo): una consegna conta solo se è puntuale **e** completa.

> **OTIF = righe d'ordine consegnate in tempo e complete ÷ tutte le righe d'ordine scadute × 100 %**

Non esiste una definizione standard vincolante. McKinsey ha osservato nel 2019 che, senza una definizione standard, l'OTIF viene interpretato in modi molto diversi; in un'indagine su 24 grandi retailer e produttori di beni di consumo nordamericani, il 79 % preferiva un'unica metrica OTIF combinata rispetto a una misurazione separata, e non c'era consenso sull'ampiezza della finestra di consegna [18].

**Esempio:** in un mese scadono 200 righe d'ordine. 184 sono state consegnate in tempo, 190 complete, 178 in tempo e complete.
- In tempo = 184 ÷ 200 = 92,0 %
- Completo = 190 ÷ 200 = 95,0 %
- OTIF = 178 ÷ 200 = **89,0 %**

Si noti che l'OTIF non è il prodotto dei due tassi (0,92 × 0,95 = 87,4 %); si calcola sulle righe che soddisfano entrambe le condizioni nello stesso momento.

**Occorre definire:** la data di riferimento (data richiesta o confermata), la finestra di tolleranza (ad esempio ±1 giorno), il livello (ordine, riga, quantità) e se le consegne anticipate contano come puntuali. I grandi clienti spesso fissano le regole per voi: Walmart, ad esempio, nel 2019 ha richiesto ai fornitori di consegnare camion completi entro una finestra di due giorni nell'87 % dei casi e ha applicato penali pari al 3 % del costo del venduto per le mancanze [47]. Tali programmi cambiano, quindi verificate la definizione attuale di ciascun cliente prima di confrontare i dati.

### Aderenza al programma in produzione

L'aderenza al programma (completamento della produzione in tempo) misura se gli ordini di produzione terminano alla data pianificata. È un KPI interno e un indicatore anticipatore dell'OTIF verso i clienti.

> **Aderenza al programma = ordini di produzione completati nei tempi ÷ tutti gli ordini di produzione scaduti × 100 %**

**Esempio:** 102 ordini su 120 scaduti sono stati completati nei tempi: **85,0 %**.

Nyhuis e Wiendahl giustificano il loro modello delle curve di funzionamento logistico anche in base al mancato raggiungimento degli obiettivi logistici in molte aziende [14]. [unverified: abstract troncato nella versione recuperata dopo questa parte della frase] Aggiungete al tasso il ritardo medio di programma in giorni; un'aderenza dell'85 % con un giorno di ritardo è cosa diversa da un'85 % con due settimane di ritardo.

### WIP (lavorazioni in corso)

Il lavoro in corso comprende tutti i beni non finiti tra il rilascio del materiale e il completamento. Viene riportato in pezzi (per il controllo) o in dollari (per la contabilità). La legge di Little collega direttamente il WIP al lead time [13]: la Linea 3 ha 2.700 parti di WIP con una produttività giornaliera di 900 parti, quindi 3 giorni di lead time. Se il team riduce il WIP a 1.800 parti con la stessa produttività, il lead time scende a 2 giorni.

### Giorni di copertura (copertura delle scorte)

> **Giorni di copertura = giacenza ÷ utilizzo medio (o domanda) giornaliero**

**Esempio:** giacenza di prodotti finiti 2.250 unità, domanda 900 unità al giorno. Giorni di copertura = 2.250 ÷ 900 = **2,5 giorni**.

Matematicamente, i giorni di copertura sono la legge di Little applicata a un singolo punto di giacenza. Usate la domanda prevista quando la domanda fluttua fortemente; altrimenti una copertura basata sullo storico può sembrare ingannevolmente alta o bassa.

## 10. Capacità e produttività: saturazione, efficienza di utilizzo, produttività del lavoro

### Saturazione della capacità

La saturazione confronta il carico (capacità richiesta secondo i tempi standard) con la capacità disponibile.

> **Saturazione della capacità = carico ÷ capacità disponibile × 100 %**

**Esempio:** gli ordini con 4.050 min di tempo standard sono programmati sulla stazione collo di bottiglia per la settimana; la capacità disponibile è di 4.500 min. Saturazione = 4.050 ÷ 4.500 = **90,0 %**.

**Perché il 100 % non è un obiettivo:** le curve operative logistiche di Nyhuis e Wiendahl descrivono la relazione tra WIP, output e lead time di un sistema di lavoro [14]. Man mano che la saturazione si avvicina al limite di capacità, code e lead time crescono in modo sproporzionato, perché ogni disturbo e ogni fluttuazione non possono più essere assorbiti. Il collo di bottiglia dovrebbe essere molto saturo; le stazioni non collo di bottiglia necessitano di riserva. Fissare una fascia obiettivo anziché un massimo.

### La saturazione non è l'efficienza di utilizzo

I termini vengono spesso confusi. La **saturazione della capacità** è un dato di pianificazione (quanto lavoro è caricato sulla capacità?). L'**efficienza di utilizzo** (ISO 22400) è un dato di esecuzione: il rapporto tra il tempo di produzione effettivo (APT) e il tempo effettivo di occupazione della unità (AUBT) [3]. Una macchina può essere caricata al 95 % e avere comunque una scarsa efficienza di utilizzo se gran parte del tempo occupato va perso per guasti e attese. Per la Linea 3, il rapporto tra tempo di marcia e tempo occupato è 405 ÷ 450 = 90 %, che in questo caso semplice coincide con la disponibilità dell'OEE; negli impianti che registrano separatamente i tempi di attrezzaggio e di occupazione, i valori differiscono.

### Produttività

La produttività è il rapporto tra output e input. In produzione si misurano di solito le **produttività parziali**, perché i fattori di input non possono essere sommati in modo significativo.

> **Produttività del lavoro = pezzi buoni ÷ ore di lavoro effettuate**

**Esempio Linea 3:** 422 pezzi buoni (inclusi quelli rilavorati) ÷ (6 operatori × 8 h) = 422 ÷ 48 = **8,79 pezzi per ora di lavoro**.

**Errori comuni:** confondere la produttività con un indice di prestazione (output effettivo rispetto a quello standard è un indice di prestazione o di efficienza, non di produttività), contare l'output totale anziché quello buono, e confrontare la produttività tra prodotti con contenuto di lavoro diverso. Per impianti ad alta varietà, le ore standard guadagnate per ora di presenza sono una misura più adatta.

## 11. KPI di manutenzione: MTBF, MTTR e disponibilità intrinseca

La norma ISO 22400 include MTBF e MTTR tra i KPI di manutenzione [38][3]. Essi scompongono la perdita di disponibilità dovuta ai guasti in due domande: con quale frequenza si guasta la macchina e quanto tempo occorre per farla ripartire?

> **MTBF (tempo medio tra i guasti) = tempo di funzionamento ÷ numero di guasti**
> **MTTR (tempo medio di riparazione) = tempo totale di riparazione ÷ numero di guasti**

**Esempio linea 3, un mese:** 40 turni di 405 min di funzionamento ciascuno = 16.200 min; 40 guasti per un totale di 1.000 min.
- MTBF = 16.200 ÷ 40 = **405 min** (6,75 h)
- MTTR = 1.000 ÷ 40 = **25 min**

Da questi valori si ricava la **disponibilità intrinseca (tecnica)**, che considera solo i guasti:

> **Disponibilità intrinseca = MTBF ÷ (MTBF + MTTR)**

405 ÷ (405 + 25) = 405 ÷ 430 = **94,2 %**. La disponibilità OEE del 90 % è più bassa perché include anche il tempo di cambio formato.

**Errori comuni:** l'MTTR può misurare solo la riparazione e non il tempo di risposta fino all'arrivo del tecnico; decidete quale tempo intendete e misurate separatamente risposta e riparazione. Anche una media su pochi eventi è molto casuale; l'MTBF diventa affidabile solo su diversi mesi. Non confondete inoltre l'MTBF con l'MTTF (tempo medio di guasto), che si applica agli elementi non riparabili; alcune pagine molto posizionate in inglese confondono i due concetti.

## 12. Energia, sicurezza (TRIR, DART, LTIFR) e costo per unità

### Energia per unità

In molti stabilimenti l'energia è diventata una voce di costo che merita un proprio KPI. La norma ISO 22400-2 è stata estesa con KPI energetici nel 2017 [1]; per la gestione dell'energia, la ISO 50006:2023 (seconda edizione, che sostituisce la versione 2014) descrive come costruire indicatori di prestazione energetica (EnPI) e baseline energetiche [22][34].

> **Consumo energetico specifico = energia consumata nel periodo ÷ numero di pezzi buoni**

**Esempio linea 3:** 1.520 kWh per turno ÷ 422 pezzi buoni = **3,60 kWh per unità**.

Attenzione al carico di base: una linea che mantiene in funzione aria compressa e riscaldamento durante le fermate appare molto peggiore per unità con volumi bassi. Una semplice retta di regressione con una componente di carico di base e una dipendente dal volume fornisce informazioni più utili del semplice rapporto.

### KPI di sicurezza: TRIR e tasso DART dell'OSHA

In un sistema di KPI SQCDP la sicurezza viene prima di tutto. Negli Stati Uniti il riferimento è la norma OSHA sulla registrazione degli infortuni (29 CFR Part 1904). L'OSHA calcola i tassi di incidenza con un'unica formula [42]:

> **Tasso di incidenza = numero di infortuni e malattie × 200.000 ÷ ore lavorate dai dipendenti**

Il valore 200.000 corrisponde alle ore lavorate da 100 dipendenti che lavorano 40 ore a settimana per 50 settimane l'anno [42], quindi il risultato si legge come "casi ogni 100 lavoratori equivalenti a tempo pieno". Sono in uso due varianti standard:

- **TRIR** (total recordable incident rate, detto anche total case incident rate): tutti i casi registrabili. I casi registrabili sono infortuni e malattie professionali che comportano decesso, perdita di coscienza, giorni di assenza, lavoro ristretto o cambio di mansione, oppure cure mediche oltre il primo soccorso, tra gli altri criteri [46].
- **Tasso DART:** solo i casi con giorni di assenza dal lavoro, attività lavorativa ristretta o cambio di mansione [46].

**Esempio:** 5 casi registrabili, di cui 3 casi DART, in uno stabilimento con 420.000 ore lavorate all'anno.
TRIR = 5 × 200.000 ÷ 420.000 = **2,38**. Tasso DART = 3 × 200.000 ÷ 420.000 = **1,43**.

Per contesto: secondo il Bureau of Labor Statistics, l'industria privata statunitense ha registrato un total recordable case rate di 2,3 casi ogni 100 lavoratori equivalenti a tempo pieno nel 2025 (pubblicato il 18 novembre 2026) [43]. Il grafico BLS per il 2025 mostra 2,5 casi ogni 100 lavoratori a tempo pieno per il manifatturiero, con 304.200 casi [44][43]. Si tratta di medie nazionali, non di benchmark per il vostro stabilimento; confrontatevi con il vostro settore NAICS.

Separatamente dai tassi, l'OSHA impone ai datori di lavoro di segnalare un decesso sul lavoro entro 8 ore e un ricovero ospedaliero, un'amputazione o la perdita di un occhio entro 24 ore (29 CFR 1904.39) [45].

### LTIFR e il tasso tedesco per 1.000 lavoratori

I gruppi multinazionali usano spesso anche l'**LTIFR** (lost time injury frequency rate), che usa come base un milione di ore anziché 200.000:

> **LTIFR = numero di infortuni con perdita di tempo ÷ ore lavorate × 1.000.000**

Safe Work Australia definisce l'LTIFR come il numero di infortuni con perdita di tempo per milione di ore lavorate; un infortunio con perdita di tempo è quello che comporta almeno un giorno o turno intero di assenza dal lavoro [21].

**Esempio:** 3 infortuni con perdita di tempo con 420.000 ore lavorate all'anno: 3 ÷ 420.000 × 1.000.000 = **7,14**. Si noti che si tratta dello stesso stabilimento di cui sopra: un tasso DART di 1,43 e un LTIFR di 7,14 descrivono gli stessi tre casi (1,43 × 5 = 7,14) se tutti e tre i casi DART hanno comportato giorni di assenza dal lavoro. Il DART conteggia anche i casi di lavoro con restrizioni e di trasferimento di mansione, che la maggior parte delle definizioni di LTI esclude. Indicare sempre la base quando si confrontano più siti.

Gli stabilimenti tedeschi riportano il "tasso per 1.000 lavoratori": infortuni soggetti a denuncia per 1.000 equivalenti a tempo pieno. In Germania un infortunio è soggetto a denuncia se l'assicurato muore o non è in grado di lavorare per più di tre giorni (paragrafo 193, comma 1, del Codice sociale tedesco, Libro VII) [20]. L'associazione tedesca dell'assicurazione infortuni obbligatoria DGUV ha riportato 19,9 infortuni sul lavoro soggetti a denuncia per 1.000 equivalenti a tempo pieno per il 2025, il 3,2 % in meno rispetto all'anno precedente [19]. **Esempio:** 4 infortuni soggetti a denuncia con 250 equivalenti a tempo pieno danno 4 ÷ 250 × 1.000 = **16,0**. Poiché le soglie di segnalazione differiscono, questo tasso non può essere confrontato direttamente con un tasso OSHA.

Affiancare a questi indicatori ritardati degli indicatori anticipatori, come i quasi incidenti segnalati e le azioni di sicurezza completate. Una diminuzione del numero di quasi incidenti segnalati può essere un segnale d'allarme se riflette una cultura della segnalazione più debole.

### Costo per unità

> **Costo per unità = costo del periodo ÷ numero di pezzi buoni**

**Esempio per la linea 3, un turno (cifre illustrative in dollari USA):**
- Manodopera: 6 × 8 h × 45 $/h = 2.160 $
- Macchina (ammortamento, manutenzione, spazio a pavimento): 8 h × 60 $/h = 480 $
- Materiale: 432 pezzi × 4,00 $ = 1.728 $ (anche gli scarti consumano materiale)
- Totale: 4.368 $

Costo per unità = 4.368 $ ÷ 422 pezzi buoni = **10,35 $ per unità**.

Il calcolo mostra il legame con l'OEE: se tutti i 432 pezzi fossero stati buoni al primo passaggio, il costo per unità sarebbe sceso a 4.368 $ ÷ 432 = 10,11 $ senza che alcun tasso cambiasse. Con i costi fissi, il volume di produzione gioca il ruolo principale, motivo per cui il costo per unità è difficile da interpretare senza considerare il volume. Per decisioni di make-or-buy o di prezzo servono anche i costi fissi e variabili separatamente. Come trasformare i miglioramenti in un solido business case è trattato nel post [The Business Case for Operational Excellence: How to Prove ROI](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roi-business-case/).

## 13. Sistemi di KPI: gerarchia, indicatori anticipatori e ritardati, SQCDP

I singoli KPI sono misurazioni. Un **sistema di KPI** li organizza in modo che ogni livello veda i numeri su cui può influire, e che i numeri dei livelli inferiori confluiscano logicamente in quelli dei livelli superiori.

### Gerarchia: stabilimento, area, linea, postazione

| Livello | KPI tipici | Cadenza | Sede |
|---|---|---|---|
| Stabilimento | OTIF, costo per unità, PPM cliente, TRIR, giorni di copertura | settimanale, mensile | riunione della direzione di stabilimento |
| Area | aderenza alla schedulazione, lead time, OEE del collo di bottiglia, costo degli scarti, produttività | giornaliera, settimanale | riunione d'area (Tier 3) |
| Linea | pezzi pianificati vs. effettivi all'ora, OEE, FPY, principali cause di fermo, azioni aperte | per turno | riunione di linea (Tier 2) |
| Postazione/macchina | pezzi all'ora vs. takt, guasti, micro-fermate, deviazioni di qualità | oraria, per turno | breve riunione di squadra (Tier 1) |

I livelli sono collegati da catene causa-effetto: un calo dell'OTIF a livello di stabilimento può essere ricondotto, attraverso l'aderenza alla schedulazione dell'area, fino all'OEE e alle cause di fermo di una singola macchina. È esattamente la catena che usa una [riunione a tier](https://www.m365.fm/entity/tier-meeting/): ogni livello esamina i propri numeri, scala ciò che non riesce a risolvere da solo e riceve un riscontro dall'alto. La guida [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) descrive in dettaglio queste routine.

### Indicatori anticipatori e ritardati

Gli **indicatori ritardati** misurano risultati già avvenuti: OTIF, costo per unità, il tasso di scarto del mese, TRIR. Sono importanti per il raggiungimento degli obiettivi, ma arrivano troppo tardi per le contromisure.

Gli **indicatori anticipatori** misurano i fattori che predicono il risultato: aderenza alla schedulazione del processo a monte, WIP davanti al collo di bottiglia, tempo di cambio formato, conformità della manutenzione preventiva, quasi-incidenti, pezzi all'ora rispetto al takt. Fabrico sottolinea giustamente che un KPI deve innescare un'azione [35]; gli indicatori anticipatori lo fanno mentre c'è ancora tempo per agire.

Una regola pratica: gli indicatori anticipatori prevalgono ai livelli inferiori, quelli ritardati a livello di stabilimento. Ogni KPI ritardato a livello di stabilimento dovrebbe avere almeno un indicatore anticipatore assegnato a livello di linea.

### SQCDP: una struttura per lavagne e riunioni

Molti stabilimenti ordinano i propri KPI secondo **SQCDP**: Safety (sicurezza), Quality (qualità), Cost (costo), Delivery (consegna) e People (persone). L'ordine è deliberato: sicurezza prima di qualità, qualità prima di costo. [unverified: SQCDP è una convenzione di prassi, non uno standard; la sua origine non può essere documentata con chiarezza.] Gli stabilimenti usano anche varianti con un ordine diverso o senza People (ad esempio SQDC).

| Categoria | Linea 3, KPI di esempio |
|---|---|
| S | infortuni e quasi-incidenti del turno, azioni di sicurezza aperte |
| Q | FPY 94,9 %, tasso di scarto 2,31 %, reclami dei clienti |
| C | costo per unità 10,35 $, energia 3,60 kWh/unità |
| D | pianificati 450 / effettivi 422 pezzi buoni, OEE 75,9 %, aderenza alla schedulazione |
| P | presenze, matrice delle competenze, idee di miglioramento implementate |

Le categorie proteggono da una fissazione unilaterale sulla produzione. Se si misura soltanto la produzione, si ottiene produzione a scapito della qualità e della sicurezza.

## 14. Raccolta dei dati e qualità dei dati

La formula migliore è inutile se i dati di input sono sbagliati. In pratica, i progetti KPI falliscono più spesso a causa dei dati che per il metodo.

### Confronto dei metodi di raccolta dati

| Metodo | Descrizione | Punti di forza | Punti deboli |
|---|---|---|---|
| Manuale (foglio di conteggio, registro di turno, Excel) | gli operatori annotano conteggi e fermi | rapido da avviare, crea consapevolezza, non richiede IT | micro-fermi mancanti, arrotondamenti, registrazioni a posteriori, elevato impegno |
| Terminali di dati di produzione | terminali per avvio/arresto ordine, quantità, motivi di fermo | motivi strutturati, contesto dell'ordine | dipende dalla disciplina nelle registrazioni |
| Raccolta dati dalle macchine | segnali dal controllore (marcia, arresto, contatore) | tempi completi, inclusi i fermi brevi | motivi mancanti senza l'input dell'operatore |
| MES | integra dati di produzione e di macchina, controllo qualità e ordini; KPI secondo ISO 22400, ISA-95 Livello 3 (VDMA 66412-1 in Germania) | definizioni coerenti, tempo reale | sforzo di implementazione, manutenzione dei dati anagrafici |
| Retrofit IoT | sensori e gateway su macchine esistenti, dati su una piattaforma cloud | funziona per macchine datate, scalabile | il contesto (ordine, prodotto) va aggiunto |

Il percorso pragmatico è una combinazione: i segnali delle macchine forniscono tempi e conteggi, mentre gli operatori aggiungono il motivo di un fermo e le decisioni di qualità a un terminale. Muchiri e Pintelon indicano l'accuratezza della raccolta dati come una delle maggiori sfide della misurazione dell'OEE [7]. Come collegare tecnicamente macchine, MES e cloud è trattato nella guida [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/).

### Cinque regole per KPI affidabili

1. **Un unico modello dei tempi per tutti.** Decidete quali tempi rientrano nel tempo di produzione pianificato (pause? manutenzione? prove? assenza di ordini?). ISO 22400-2 e VDMA 66412-1 offrono un modello [1][4].
2. **Un catalogo dei motivi di fermo con al massimo due livelli.** Troppi motivi portano alla voce "altro", troppo pochi a Pareto privi di significato. Associate ogni motivo in modo chiaro a una sola categoria di perdita OEE.
3. **Mantenere aggiornati i tempi ciclo ideali.** Le prestazioni OEE dipendono interamente da questi dati anagrafici. Uno standard troppo generoso porta a prestazioni superiori al 100 % o nasconde perdite.
4. **Automatizzare i controlli di plausibilità.** FPY + rielaborazione + scarti = 100 %; tempo di marcia ≤ tempo pianificato; prestazioni ≤ 100 %; somma dei fermi ≤ durata del turno.
5. **Rendere visibile la definizione.** Ogni KPI dispone di una scheda di definizione con scopo, formula, fonte dei dati, responsabile, cadenza e obiettivo.

### La scheda di definizione del KPI

| Campo | Esempio: OEE Linea 3 |
|---|---|
| Scopo | rendere visibili le perdite della macchina collo di bottiglia e darne la priorità |
| Formula | disponibilità × prestazioni × qualità; verifica incrociata pezzi buoni × tempo ciclo ideale ÷ tempo pianificato |
| Fonte dei dati | dati macchina (marcia/arresto, contatore), terminale (motivo di fermo, scarti, rielaborazioni) |
| Definizioni | tempo pianificato = turno meno pause; i cambi formato contano come perdita di disponibilità; la rielaborazione conta come perdita di qualità |
| Responsabile | capoturno Linea 3 |
| Cadenza | per turno, trend settimanale |
| Obiettivo | 80 % entro fine Q2 (baseline 75,9 %, vedi Sezione 16) |
| Escalation | due turni consecutivi sotto il 70 % → riunione di Livello 2 |

## 15. Visualizzazione: lavagne di reparto e dashboard Power BI

### La lavagna di reparto

Alla postazione di lavoro conta di più la leggibilità in pochi secondi che la completezza. La [gestione visiva](https://www.m365.fm/entity/visual-management/) qui significa: pianificato ed effettivo per ora, un chiaro rosso/verde rispetto all'obiettivo, le tre principali cause di fermo e un elenco di azioni con responsabili e scadenze. Le lavagne orarie funzionano bene: il team inserisce il valore pianificato e quello effettivo per ogni ora (Linea 3: 60 pezzi in ogni ora produttiva completa con un takt di 60 s, di conseguenza meno nelle ore con pausa) e indica subito una breve motivazione per ogni scostamento. Come collegare flusso e lavagna è descritto nel post [Shop Floor Optimization: Ways to Improve Flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/).

Le lavagne digitali non sostituiscono automaticamente la lavagna bianca. Ripagano quando i dati vengono già acquisiti automaticamente, quando più turni o siti hanno bisogno della stessa vista e quando le azioni devono essere tracciate. La discussione di team rimane la stessa.

### Dashboard Power BI: struttura

Per il livello di area e di stabilimento, Power BI è lo strumento ovvio se l'azienda usa già Microsoft 365. Una struttura a tre pagine collaudata:

1. **Panoramica (stabilimento):** tile SQCDP con effettivo, obiettivo e trend; semafori solo dove è definito un obiettivo.
2. **Linea:** OEE come cascata dal tempo pianificato attraverso le sei categorie di perdita fino al tempo a valore aggiunto; Pareto delle cause di fermo; FPY e scarti nel tempo.
3. **Dettaglio e azioni:** tabelle per turno e per ordine con drill-through, collegate all'elenco delle azioni.

Per obiettivi, verifiche di avanzamento e responsabili, Power BI offre anche scorecard con obiettivi. Secondo Microsoft, creare e condividere scorecard è una funzionalità di Pro; la visualizzazione è possibile con una licenza Pro oppure come utente gratuito in un'area di lavoro su capacità Premium o Fabric F64 o superiore [29].

### Modello dati: schema a stella

Microsoft raccomanda per Power BI uno schema a stella: le tabelle dimensione descrivono le entità di business e vengono usate per filtrare e raggruppare, le tabelle dei fatti memorizzano eventi e vengono usate per l'aggregazione [27]. Per i KPI di produzione, ciò significa:

| Tabella | Tipo | Contenuto (colonne di esempio) |
|---|---|---|
| FactProduction | fatti | Data, ShiftID, LineID, ProductID, PlannedMin, BreakdownMin, ChangeoverMin, TotalQty, GoodFirstPass, Rework, Scrap, IdealCycleSec |
| FactDowntime | fatti | Start, End, DurationMin, LineID, ReasonID |
| DimDate | dimensione | Date, Week, Month, WorkingDay sì/no |
| DimShift | dimensione | ShiftID, Name, Start, End |
| DimLine | dimensione | LineID, Line, Area, Plant |
| DimProduct | dimensione | ProductID, Product, ProductFamily |
| DimDowntimeReason | dimensione | ReasonID, Reason, LossCategory (guasto, cambio formato, micro-fermate …) |

La colonna LossCategory nella dimensione delle cause è la chiave della cascata delle perdite: associa ogni causa di fermo a una delle sei grandi perdite.

### Esempio DAX: aggregare correttamente l'OEE

Le seguenti misure calcolano l'OEE in modo che si sommi correttamente a ogni livello (turno, linea, settimana, stabilimento), perché è costruito a partire da tempi sommati invece che da medie. `DIVIDE` restituisce BLANK invece di un errore quando il denominatore è zero [25]; Microsoft raccomanda la funzione quando il denominatore può essere zero o vuoto, e l'operatore `/` quando il denominatore è una costante [26].

```dax
Planned Min =
SUM ( FactProduction[PlannedMin] )

Run Min =
[Planned Min]
    - SUM ( FactProduction[BreakdownMin] )
    - SUM ( FactProduction[ChangeoverMin] )

Ideal Min =
SUMX (
    FactProduction,
    FactProduction[TotalQty] * FactProduction[IdealCycleSec] / 60
)

Value Adding Min =
SUMX (
    FactProduction,
    FactProduction[GoodFirstPass] * FactProduction[IdealCycleSec] / 60
)

Availability =
DIVIDE ( [Run Min], [Planned Min] )

Performance =
DIVIDE ( [Ideal Min], [Run Min] )

Quality (time-weighted) =
DIVIDE ( [Value Adding Min], [Ideal Min] )

OEE =
DIVIDE ( [Value Adding Min], [Planned Min] )
```

**Perché qui la qualità è ponderata sul tempo:** per un singolo prodotto, `Value Adding Min ÷ Ideal Min` è identico a conteggio buoni ÷ conteggio totale. Con più prodotti che hanno tempi ideali diversi, questa forma pondera ogni pezzo in base al suo tempo ideale. Solo così disponibilità × prestazione × qualità = OEE vale esattamente a ogni livello di aggregazione, perché tempo di marcia e tempo ideale si annullano. Un tasso di qualità basato sui pezzi è utile come misura aggiuntiva ma non deve entrare nella moltiplicazione dell'OEE.

**Verifica con la Linea 3:** tempo pianificato 450, tempo di funzionamento 405, tempo ideale 432 × 50 ÷ 60 = 360, tempo a valore aggiunto 410 × 50 ÷ 60 = 341,67 min. Disponibilità 90,0 %, performance 88,9 %, qualità 94,9 %, OEE 341,67 ÷ 450 = 75,9 %. Le misure riproducono il calcolo manuale della Sezione 7.

Un'altra misura per il controllo del takt:

```dax
Effective Cycle Time per Good Part Sec =
DIVIDE (
    [Planned Min] * 60,
    SUM ( FactProduction[GoodFirstPass] )
)
```

Per la Linea 3, il risultato è 27.000 ÷ 410 = 65,9 s, superiore al takt di 60 s.

I KPI di qualità della Sezione 8 seguono lo stesso schema:

```dax
FPY =
DIVIDE (
    SUM ( FactProduction[GoodFirstPass] ),
    SUM ( FactProduction[TotalQty] )
)

Scrap Rate =
DIVIDE (
    SUM ( FactProduction[Scrap] ),
    SUM ( FactProduction[TotalQty] )
)

Rework Rate =
DIVIDE (
    SUM ( FactProduction[Rework] ),
    SUM ( FactProduction[TotalQty] )
)

Quality Sum Check =
[FPY] + [Scrap Rate] + [Rework Rate]
```

`Quality Sum Check` deve essere uguale al 100 %; una formattazione condizionale che segnala in rosso gli scostamenti rende immediatamente visibili le transazioni mancanti.

**Due insidie per gli sviluppatori Power BI:**
- **Doppio conteggio dei fermi.** Se i minuti di guasto e di cambio formato sono memorizzati sia in `FactProduction` sia in `FactDowntime`, calcolate il tempo di funzionamento da una sola delle due tabelle. L'approccio più robusto è mantenere `FactProduction` al livello di dettaglio turno, linea e prodotto, e aggregare in essa i minuti di fermo da `FactDowntime` in Power Query.
- **Granularità del tempo pianificato.** Se nel turno vengono eseguiti più prodotti, il tempo pianificato va ripartito tra i prodotti (ad esempio in base all'inizio e alla fine dell'ordine). Se l'intero tempo del turno compare in ogni riga di prodotto, viene conteggiato più volte nella somma.

### Note sulle licenze

Secondo Microsoft Learn (pagina aggiornata al 24 agosto 2026): gli utenti con licenza gratuita possono creare report per uso personale, ma non possono condividerli. La pubblicazione e la condivisione richiedono Power BI Pro. Gli utenti gratuiti possono visualizzare contenuti condivisi solo se questi si trovano in un'area di lavoro su capacità Power BI Premium o capacità Fabric F64 o superiore. Con Premium Per User (PPU), i contenuti possono essere condivisi solo con altri utenti PPU, a meno che non si trovino in una capacità Premium [28]. Per una dashboard di reparto che molti supervisori si limitano a consultare, la licenza è quindi una decisione architetturale. Verificate i prezzi e le condizioni attuali con Microsoft; non sono riportati qui di proposito.

## 16. Come impostare gli obiettivi dei KPI

Gli obiettivi sono il punto in cui i KPI causano più danni spesso. Tre principi aiutano.

**1. Partire dalla propria baseline, non da un benchmark.** Misurate in modo corretto per almeno da quattro a otto settimane prima di fissare un obiettivo. La Linea 3 con un OEE del 75,9 % trae poco beneficio da un obiettivo di classe mondiale dell'85 % finché nessuno sa quale perdita affrontare per prima.

**2. Derivare gli obiettivi dalla domanda.** Nell'esempio, l'obiettivo discende direttamente dal cliente: per 450 pezzi buoni per turno, la Linea 3 necessita di un OEE dell'83,3 % se contano solo i pezzi buoni al primo passaggio (Sezione 7). Un obiettivo intermedio sensato è l'80 %; ovvero a 4,1 punti percentuali di distanza. Matematicamente, equivale a (0,800 − 0,759) × 450 min = circa 18,3 min di tempo a valore aggiunto per turno, ad esempio attraverso meno micro-fermate (potenziale di 30 min) o cambi formato più brevi (potenziale di 8 min tramite SMED).

**3. Usare fasce di obiettivo invece di valori puntuali per i KPI con compromessi.** Utilizzo, WIP e giorni di copertura non seguono la regola "più alto, meglio". Una fascia (ad esempio giorni di copertura da 2 a 3 giorni) impedisce a un team di ridurre le scorte a tal punto da compromettere le consegne. Drees e Sack descrivono esattamente questa tensione tra riduzione delle scorte, resa delle risorse, capacità di consegna e riduzione dei lead time per i KPI del flusso del valore [32].

**Sui benchmark esterni:** i valori di settore per OEE, scarti o MTTR riportati in molte pagine dei fornitori provengono di solito dai loro dati di clienti senza un metodo dichiarato [37]. Usateli al massimo come orientamento di massima, mai come obiettivo. Fanno eccezione le statistiche ufficiali con un metodo pubblicato, come i tassi di infortunio del BLS per settore NAICS [43].

## 17. Errori comuni e come evitarli

| Errore | Conseguenza | Contromisura |
|---|---|---|
| Sovraccarico di KPI: 30 KPI sulla lavagna | nessuno sa cosa conta; le riunioni diventano lezioni | 5 a 8 KPI per livello, ordinati per SQCDP |
| KPI senza definizione | ogni reparto calcola in modo diverso; i confronti non valgono nulla | scheda delle definizioni, termini secondo ISO 22400 (VDMA 66412-1 in Germania) |
| Media di percentuali | OEE di stabilimento distorto | ricalcolare i KPI a ogni livello a partire dalle somme |
| KPI come valutazione individuale della prestazione | manipolazione dei dati, guasti nascosti | KPI per i processi, non per le persone |
| Obiettivo senza un percorso | frustrazione, abbellimento dei numeri | ogni obiettivo supportato da un'analisi delle perdite e da un piano d'azione |
| Solo indicatori ritardati | le contromisure arrivano troppo tardi | assegnare un indicatore anticipatore a ogni indicatore ritardato |
| Tempi standard troppo generosi | prestazioni oltre il 100 % o perdite nascoste | giustificare tecnicamente i tempi ideali e rivederli ogni anno |
| Dati senza una routine | la dashboard smette di essere consultata dopo tre mesi | cadenze fisse delle riunioni con i KPI come ordine del giorno |
| Confronto di tassi di sicurezza con basi diverse | TRIR, DART, LTIFR e tassi tedeschi confusi | dichiarare sempre formula e base (200.000 h, 1 milione di h, 1.000 FTE) |

### Legge di Goodhart

Nel 1975, l'economista britannico Charles Goodhart osservò che ogni regolarità statistica osservata tende a crollare nel momento in cui viene sottoposta a pressione per scopi di controllo [24]. L'antropologa Marilyn Strathern condensò questo concetto nel 1997 nella celebre frase "Quando una misura diventa un obiettivo, cessa di essere una buona misura" [23]. In reparto si manifesta così: se l'OEE è legato ai premi di risultato, i cambi formato vengono evitati (lotti più grandi, più scorte), le fermate vengono registrate come "pianificate" o i tempi standard vengono allungati. Il KPI sale; lo stabilimento non migliora.

Tre antidoti: osservare sempre un KPI insieme a un KPI di controllo (OEE con scorte e OTIF), mantenere le definizioni centralizzate e registrare le modifiche, e usare i KPI nelle riunioni come motivo per porre domande, non come verdetto.

## 18. Roadmap: introdurre i KPI di produzione in 90 giorni

La seguente roadmap funziona come quadro di riferimento per una linea o un'area. Non richiede software; il software accelera le fasi 2 e 3.

**Fase 1, settimane da 1 a 3: scopo e definizioni**
- Chiarire gli obiettivi dell'area (cosa chiede il cliente? dove si concentrano le perdite maggiori?).
- Selezionare da 5 a 8 KPI, almeno uno per ciascuna categoria SQCDP.
- Definire il modello temporale, il catalogo delle cause di fermo e le schede di definizione; verificare i tempi ciclo ideali.

**Fase 2, settimane da 4 a 8: misurare e imparare**
- Avviare la raccolta dati, inizialmente manuale o semi-automatica se necessario.
- Verificare la plausibilità ogni giorno; affinare le definizioni dove emergono domande.
- Stabilire le baseline su almeno quattro settimane.

**Fase 3, settimane da 9 a 12: gestire**
- Derivare gli obiettivi dalla domanda e dalla baseline.
- Costruire la lavagna e, dove utile, un report Power BI.
- Istituire le routine a tre livelli: Tier 1 per turno, Tier 2 giornaliero, Tier 3 settimanale.
- Scegliere i primi temi di miglioramento dai Pareto delle perdite e lavorarli con il PDCA.

**Dopo questa fase:** verificare ogni trimestre che ciascun KPI guidi ancora una decisione. I KPI che nessuno usa vanno eliminati. Come inserire i KPI in un sistema di miglioramento più ampio è trattato nelle guide [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) e [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/). Gli obiettivi del collo di bottiglia alimentano anche direttamente la schedulazione, si veda [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

## 19. KPI dalla modellazione del flusso del valore: iFAKT Polaris

> **Nota: l'autore lavora presso iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), con sede a Stoccarda, in Germania, sviluppa software per la pianificazione e l'ottimizzazione dei processi logistici e produttivi basati sulla tecnologia Microsoft [33]. L'azienda lavora sui KPI da molto tempo: nel 2011 Jörg Drees e Christoph Sack hanno mostrato sulla rivista tedesca ZWF (Zeitschrift für wirtschaftlichen Fabrikbetrieb) che i KPI del flusso del valore entrano facilmente in conflitto tra riduzione delle scorte, produttività delle risorse, capacità di consegna e riduzione dei lead time, e che un insieme di KPI scelto deliberatamente, combinato con i metodi lean, consente cicli di controllo duraturi [32].

Secondo il fornitore, la famiglia di software [iFAKT Polaris](https://www.m365.fm/entity/polaris/) comprende Value Stream Mapping, Business Swim Lane Mapping, Designer, Simulator, Optimizer, Operator e Analyzer [31]. Due di essi sono rilevanti per i KPI di produzione:

- **[Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)**, secondo ifakt.de, riunisce i KPI di tutti i moduli Polaris in dashboard strutturate, visualizza lead time, utilizzo, colli di bottiglia e stato dei progetti, mostra i limiti di capacità e il potenziale di miglioramento, e confronta scenari, piani e prestazioni effettive [30]. La pagina del fornitore non fornisce informazioni su integrazioni, modello di distribuzione o prezzi.
- **Polaris VSM**, secondo il fornitore, calcola automaticamente KPI lean come lead time, tempo ciclo, WIP, rapporto del valore aggiunto e fattore di flusso a partire dal modello del flusso del valore, offre dashboard per lead time, WIP, rapporto del valore aggiunto e OEE, e confronta affiancati i KPI dei vari scenari [31].

**Valutazione:** uno strumento di questo tipo non sostituisce né definizioni chiare né la routine delle riunioni. Il suo valore sta nel calcolare i KPI in modo coerente a partire da un unico modello e nel confrontare gli scenari prima dell'implementazione, ad esempio l'effetto di un limite al WIP su lead time e OTIF. Se si adatti alla propria fabbrica va verificato come per qualsiasi altra soluzione: con i propri dati, il proprio panorama IT e le decisioni che i KPI devono supportare. Ulteriori informazioni sulla famiglia di prodotti sono nella guida [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/).

## 20. Glossario

| Termine | Spiegazione |
|---|---|
| Disponibilità (OEE) | tempo di funzionamento ÷ tempo di produzione pianificato [7] |
| Tempo di ciclo | tempo misurato per completare un'unità in una lavorazione [10] |
| DART rate | tasso OSHA dei casi con giorni di assenza, lavoro limitato o trasferimento di mansione ogni 100 FTE [42][46] |
| Giorni di copertura | scorta ÷ consumo medio giornaliero |
| Efficacia (ISO 22400) | corrisponde alla performance dell'OEE: tempo di funzionamento pianificato per articolo × quantità ÷ tempo di produzione effettivo [3] |
| Fattore di flusso | lead time ÷ tempo di lavorazione (Wiendahl) [14][15] |
| FPY | first pass yield, quota di unità conformi senza rilavorazione o scarto [36] |
| ISA-95 | ANSI/ISA-95 (IEC 62264); Livello 3 = gestione delle operazioni di produzione [40] |
| Indicatore ritardato | KPI che misura un risultato già avvenuto |
| Lead time | tempo dall'inizio alla fine di un ordine, inclusi tutti i tempi di attesa, coda e trasporto [10][15] |
| Indicatore anticipatore | KPI che prevede un risultato futuro |
| Legge di Little | L = λW: WIP medio = throughput × lead time medio [13] |
| Carico | tempo di produzione pianificato ÷ tempo di calendario; fattore del TEEP [8] |
| MES | manufacturing execution system; ISA-95 Livello 3 [40]; linea guida KPI VDMA 66412-1 in Germania [4] |
| MTBF / MTTR | tempo medio di funzionamento tra guasti / tempo medio di riparazione |
| OEE | disponibilità × performance × qualità [7] |
| Tempo di operazione | tempo di attrezzaggio più tempo di lavorazione di una fase (Wiendahl) [14][15] |
| Tempo di ordine (REFA) | tempo di attrezzaggio più tempo di esecuzione (quantità × tempo per unità) [16][17] |
| OTIF | on time in full; nessuna definizione standard [18] |
| PPM | parti per milione, difetti normalizzati a un milione [36] |
| SMED | metodo di cambio formato che mira a meno di dieci minuti [11] |
| SQCDP | Safety, Quality, Cost, Delivery, People: schema di ordinamento dei KPI |
| Takt time | tempo disponibile ÷ domanda del cliente [9] |
| TEEP | OEE × carico [8] |
| TRIR | OSHA total recordable incident rate: casi registrabili × 200.000 ÷ ore lavorate [42] |
| WIP | lavorazione in corso (work in process) |

## 21. FAQ: KPI di produzione

**Che cosa sono i KPI di produzione?**
I KPI di produzione sono misure che quantificano tempo, output, qualità, consegna, costo e sicurezza di un'operazione produttiva, ad esempio takt time, OEE, tasso di scarto o OTIF. Ogni KPI richiede una definizione, una formula, un'unità e un periodo di riferimento.

**Qual è la differenza tra un KPI e una metrica?**
Ogni KPI è una metrica, ma non ogni metrica è un KPI. Un KPI è legato direttamente a un obiettivo e guida regolarmente le decisioni, come l'OTIF o l'OEE del collo di bottiglia. Il numero di pezzi prodotti è una metrica; da solo raramente innesca un'azione.

**Quali sono i KPI più importanti nella produzione?**
Per la maggior parte degli stabilimenti basta un set di partenza: OEE del collo di bottiglia, FPY o tasso di scarto, OTIF, lead time o WIP, costo per unità e un indice di sicurezza come il TRIR. Quali KPI siano "i più importanti" dipende da dove si concentrano le perdite maggiori.

**Quali sono i 5 indicatori chiave di prestazione nella produzione?**
Non esiste una top five ufficiale. Un set pratico copre un KPI per ciascuna categoria SQCDP: TRIR (sicurezza), first pass yield (qualità), costo per unità (costo), OTIF (consegna) e una metrica sulle persone, come le idee di miglioramento implementate, più l'OEE del collo di bottiglia.

**Come si calcola il takt time?**
Takt time = tempo di produzione disponibile ÷ domanda del cliente. Esempio: 450 min (27.000 s) di tempo disponibile per turno e una domanda di 450 unità danno 60 s per unità. Si sottraggono le pause, ma non i fermi non pianificati.

**Qual è la differenza tra takt time e tempo di ciclo?**
Il takt time deriva dalla domanda del cliente e indica ogni quanto un pezzo deve essere completato. Il tempo di ciclo si misura sul processo e indica ogni quanto un pezzo viene effettivamente completato. Il tempo di ciclo dovrebbe essere inferiore al takt, con una riserva.

**Come si calcola il lead time di produzione?**
Direttamente come timestamp di completamento meno timestamp di inizio per ordine, oppure indirettamente con la Legge di Little: WIP medio ÷ throughput medio. 2.700 pezzi di WIP con un throughput giornaliero di 900 pezzi danno 3 giorni lavorativi.

**Come si calcola l'OEE?**
OEE = disponibilità × performance × qualità. Con 90 % di disponibilità, 88,9 % di performance e 94,9 % di qualità, l'OEE è 75,9 %. Verifica incrociata: pezzi buoni × tempo di ciclo ideale ÷ tempo di produzione pianificato.

**Che cos'è un buon punteggio OEE?**
L'85 % è spesso citato come "world-class" e fatto risalire a Nakajima, ma il dato è controverso e dipende dal settore [8]. Un obiettivo migliore è quello derivato dalla propria baseline e dalla domanda del cliente.

**Come si calcola il tasso di scarto?**
Tasso di scarto = numero di pezzi scartati ÷ numero totale di pezzi × 100 %. 10 pezzi scartati su 432 prodotti danno il 2,31 %.

**Qual è la differenza tra tasso di scarto e resa al primo passaggio?**
Il tasso di scarto conta solo i pezzi che alla fine vengono eliminati. La FPY (First Pass Yield) conta solo i pezzi buoni senza alcuna correzione, quindi anche senza rilavorazione. FPY, tasso di rilavorazione e tasso di scarto sommano al 100 %.

**Che cosa significa OTIF?**
On time in full: la quota di consegne o righe d'ordine che arrivano al cliente nei tempi previsti e complete. Non esiste una definizione standard; bisogna stabilire la data di riferimento, la tolleranza e il livello [18].

**Come si calcola il TRIR?**
TRIR = numero di casi registrabili OSHA × 200.000 ÷ ore totali lavorate [42]. 5 casi registrabili con 420.000 ore danno 2,38. Il 200.000 corrisponde a 100 dipendenti a tempo pieno che lavorano 40 ore a settimana per 50 settimane.

**Qual è la differenza tra utilizzo della capacità ed efficienza di utilizzo?**
L'utilizzo della capacità è un dato di pianificazione (carico rispetto alla capacità). L'efficienza di utilizzo misura, in fase di esecuzione, quanta parte del tempo occupato è stata effettivamente produttiva. Un utilizzo elevato non è un obiettivo in sé, perché i tempi di attraversamento aumentano sensibilmente in prossimità del limite di capacità.

**Quanti KPI dovrebbe monitorare uno stabilimento?**
Da cinque a otto KPI per livello gestionale, ordinati secondo SQCDP, con ogni indicatore ritardato associato a uno anticipatore. Un numero maggiore di KPI aumenta lo sforzo di raccolta dati senza migliorare il controllo.

**Quale norma definisce i KPI di produzione?**
La ISO 22400-2:2014 definisce i KPI per la gestione delle operazioni produttive, con formule, unità e tempistiche [1]. La ISA-95 definisce il contesto di Livello 3 in cui vengono calcolati [40]; in Germania è inoltre molto diffusa la linea guida VDMA 66412-1 sui KPI MES [4].

**Posso costruire KPI di produzione in Power BI?**
Sì. È importante disporre di uno schema a stella con tabelle dei fatti e delle dimensioni [27] e di misure che calcolino i KPI a partire dai tempi sommati. La condivisione richiede una licenza Power BI Pro; i visualizzatori senza licenza Pro necessitano di contenuti su capacità Premium o Fabric F64 o superiore [28].

**Che cosa sono MTBF e MTTR?**
MTBF è il tempo medio di funzionamento tra due guasti, MTTR il tempo medio necessario per ripristinare la macchina. 16.200 min di funzionamento e 40 guasti con una durata totale di 1.000 min danno un MTBF di 405 min e un MTTR di 25 min.

## 22. Conclusione

I KPI di produzione non sono un fine in sé. Il loro valore deriva da tre elementi: una definizione univoca basata su ISO 22400-2 (e su ISA-95 per il contesto di sistema), una base dati affidabile proveniente dai segnali delle macchine e dall'input degli operatori, e una routine in cui gli scostamenti portano a domande e azioni. L'esempio della Linea 3 mostra quanto siano strettamente collegati i KPI: un tempo ciclo inferiore al takt non garantisce la consegna finché guasti, cambi formato e perdite di qualità portano l'OEE al 75,9 %; i 28 pezzi mancanti per turno possono essere ricondotti alle singole categorie di perdita e ai singoli minuti. Iniziate con pochi KPI, calcolateli a ogni livello a partire dalle somme, fissate gli obiettivi in base alla domanda del cliente, mettete la sicurezza al primo posto con un tasso correttamente fondato, e considerate ogni KPI come un motivo per un confronto al gemba.

### Ulteriori letture su m365.fm

- Guide: [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) · [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) · [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) · [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) · [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) · [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) · [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- Blog: [Shop Floor Optimization: Ways to Improve Flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/) · [The Business Case for Operational Excellence: How to Prove ROI](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roi-business-case/)
- Termini: [Takt Time](https://www.m365.fm/entity/takt-time/) · [Cycle Time](https://www.m365.fm/entity/cycle-time/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Setup Time](https://www.m365.fm/entity/setup-time/) · [Micro Stops](https://www.m365.fm/entity/micro-stops/) · [Scrap Rate](https://www.m365.fm/entity/scrap-rate/) · [Key Performance Indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [SMED](https://www.m365.fm/entity/smed/) · [Shop Floor Management](https://www.m365.fm/entity/shop-floor-management/) · [Visual Management](https://www.m365.fm/entity/visual-management/) · [Tier Meeting](https://www.m365.fm/entity/tier-meeting/) · [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** è il conduttore di m365.fm e lavora presso [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) a Stoccarda, in Germania. Su m365.fm scrive di lean manufacturing, KPI di produzione, metodi di value stream e digitalizzazione della produzione con Microsoft 365, Power BI e Azure. Il suo focus è su come definire e visualizzare i KPI in modo che portino a decisioni concrete sul campo.

**Nota: l'autore lavora presso iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Sources [1] to [39] keep the German numbering; [35], [36] and [38] now point to English sources, and [40] to [47] were added for the US version. All new or replaced sources were verified online.

1. ISO 22400-2:2014 Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions. Edition 1, 2014-01; status "to be revised"; Amendment 1:2017 "Key performance indicators for energy management". https://www.iso.org/standard/54497.html
2. Rother, M.; Shook, J.: 6 Guidelines for Moving Toward a Lean Value Stream. Lean Enterprise Institute, The Lean Post, October 19, 2022. https://www.lean.org/the-lean-post/articles/6-guidelines-for-moving-toward-a-lean-value-stream/
3. Kang, N.; Zhao, C.; Li, J.; Horst, J. A.: A Hierarchical structure of key performance indicators for operation management and continuous improvement in production systems. International Journal of Production Research 54 (21), 2016, pp. 6333–6350. NIST version: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=919754
4. VDMA 66412-1:2009-10 Manufacturing Execution Systems (MES) – Kennzahlen (KPIs). 36 pages; amended by VDMA 66412-1/A1:2010-05. DIN Media: https://6sku3uaup9f9.din.de/en/technical-rule/vdma-66412-1/122410632
5. Schließmann, A.; Strahlberger, M.: Kennzahlen und Prozessgrößen wohl definiert. MES-Kennzahlen basierend auf Maschinenzuständen (well-defined KPIs: MES KPIs based on machine states). ZWF 109 (7–8), 2014, pp. 549–551. DOI: 10.3139/104.111180. https://www.degruyterbrill.com/document/doi/10.3139/104.111180/html
6. Nakajima, S.: Introduction to TPM: Total Productive Maintenance. Productivity Press, Cambridge (MA) 1988, ISBN 978-0-915299-23-2 (bibliographic data per [8]).
7. Muchiri, P.; Pintelon, L.: Performance measurement using overall equipment effectiveness (OEE): literature review and practical application discussion. International Journal of Production Research 46 (13), 2008, pp. 3517–3535. DOI: 10.1080/00207540601142645. https://scispace.com/pdf/performance-measurement-using-overall-equipment-3udssbfefm.pdf
8. Overall equipment effectiveness. Wikipedia (English), with references to Nakajima 1982/1988/1989 and Hartmann 1992 (TEEP). https://en.wikipedia.org/wiki/Overall_equipment_effectiveness
9. Takt Time (lexicon term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/takt-time/
10. Cycle Time (lexicon term, with lead time, processing time, value-creating time, effective machine cycle time). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/cycle-time/
11. Single Minute Exchange of Die (lexicon term). Lean Enterprise Institute, referring to Shingo, S.: A Revolution in Manufacturing: The SMED System. Productivity Press, 1985. https://www.lean.org/lexicon-terms/single-minute-exchange-of-die/
12. Rother, M.; Shook, J.: Learning to See: Value Stream Mapping to Create Value and Eliminate Muda. Lean Enterprise Institute, Brookline (MA) 1998 (Shingo Research Prize 1999); current edition LEI 2018. https://www.lean.org/store/workbooks/learning-to-see/
13. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (3), 1961, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://ideas.repec.org/a/inm/oropre/v9y1961i3p383-387.html
14. Nyhuis, P.; Wiendahl, H.-P.: Logistische Kennlinien. Grundlagen, Werkzeuge und Anwendungen. 3rd ed., Springer, Berlin/Heidelberg 2012 (VDI-Buch), ISBN 978-3-540-92838-6 (English edition: Fundamentals of Production Logistics: Theory, Tools and Applications, Springer, Berlin/Heidelberg 2009, ISBN 978-3-540-34210-6). Sample (table of contents and abbreviations): https://lesejury.de/media/samples/393/9783540928393_leseprobe.pdf · Chapter "Zusammenfassung und Ausblick": https://rd.springer.com/content/pdf/10.1007%2F978-3-540-92839-3_10.pdf
15. Durchlaufzeit. Wikipedia (German), referring to Wiendahl, H.-P.: Fertigungsregelung. Hanser, Munich 1997, ISBN 3-446-19084-8. https://de.wikipedia.org/wiki/Durchlaufzeit
16. REFA (ed.): Lexikon der Betriebsorganisation. Carl Hanser, Munich 1993, ISBN 3-446-17523-7, p. 195 (bibliographic data per [17]).
17. Auftragszeit. Wikipedia (German). https://de.wikipedia.org/wiki/Auftragszeit
18. Davies, A.; Lal, S.; Perez, F.; Potdar, S.: Defining 'on-time, in-full' in the consumer sector. McKinsey & Company, June 13, 2019. https://www.mckinsey.com/capabilities/operations/our-insights/defining-on-time-in-full-in-the-consumer-sector
19. DGUV: Unfallrisiko bei der Arbeit 2025 erneut gesunken (workplace accident risk fell again in 2025). Press release, September 22, 2026. https://dguv.de/de/mediencenter/pm/pressearchiv/2026/quartal_3/details_3_713348.jsp
20. Section 193 SGB VII (German Social Code, Book VII): employer's duty to report an insured event. https://www.gesetze-im-internet.de/sgb_7/__193.html
21. Lost time injury frequency rates (LTIFR). Safe Work Australia. https://data.safeworkaustralia.gov.au/node/33
22. ISO 50006:2023 Energy management systems – Evaluating energy performance using energy performance indicators and energy baselines. https://www.iso.org/standard/79367.html
23. Strathern, M.: 'Improving ratings': audit in the British University system. European Review 5 (3), 1997, pp. 305–321. DOI: 10.1002/(SICI)1234-981X(199707)5:3<305::AID-EURO184>3.0.CO;2-4
24. Goodhart, C.: Problems of Monetary Management: The UK Experience. Papers in Monetary Economics, Vol. 1, Reserve Bank of Australia, Sydney 1975 (bibliographic data per https://en.wikipedia.org/wiki/Goodhart%27s_law).
25. DIVIDE function (DAX). Microsoft Learn. https://learn.microsoft.com/en-us/dax/divide-function-dax
26. DIVIDE function vs. divide operator (/) in DAX. Microsoft Learn. https://learn.microsoft.com/en-us/dax/best-practices/dax-divide-function-operator
27. Understand star schema and the importance for Power BI. Microsoft Learn (updated December 30, 2024). https://learn.microsoft.com/en-us/power-bi/guidance/star-schema
28. Power BI service per-user and capacity-based licenses. Microsoft Learn (updated August 24, 2026; re-checked November 20, 2026). https://learn.microsoft.com/en-us/power-bi/service-features-license-type
29. Get started with goals and scorecards in Power BI. Microsoft Learn (updated March 5, 2026). https://learn.microsoft.com/power-bi/create-reports/service-goals-introduction
30. Polaris Analyzer (vendor page). iFAKT GmbH. https://www.ifakt.de/en/solutions/analyzer
31. Polaris VSM (vendor page, with overview of the Polaris suite). iFAKT GmbH. https://www.ifakt.de/en/software/vsm/
32. Drees, J.; Sack, C. (iFAKT GmbH): Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung (production optimization through value stream modeling KPIs). ZWF 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
33. About iFAKT (company page). iFAKT GmbH. https://www.ifakt.de/en/company/
34. ISO 50006:2023, preview pages (second edition 2023-05, replaces ISO 50006:2014). ANSI Webstore. https://webstore.ansi.org/preview-pages/ISO/preview_ISO+50006-2023.pdf
35. Manufacturing KPIs: The Metrics That Actually Drive the Floor. Fabrico (vendor blog), published June 29, 2026, updated October 26, 2026. https://www.fabrico.io/blog/manufacturing-kpis/
36. Quality Glossary of Terms, Acronyms & Definitions (entries "first pass yield", "overall equipment effectiveness", "parts per million"). ASQ. https://asq.org/quality-resources/quality-glossary
37. World-Class OEE: What Is It and How Close Are You Actually? TEEPTRAK (vendor page, benchmarks from own data). https://teeptrak.com/en/world-class-oee-benchmark/
38. ISO 22400 KPI Selection Guide. Fabrico (secondary source for the count of 34 KPIs and the categories). https://www.fabrico.io/blog/iso-22400-kpi-selection-guide/
39. Competitor pages: https://netsuite.com/portal/resource/articles/erp/manufacturing-kpis-metrics.shtml · https://www.insightsoftware.com/blog/30-manufacturing-kpis-and-metric-examples/ · https://www.dataparc.com/blog/manufacturing-kpi-examples-10-formulas-for-measuring-success/ · https://machinemetrics.com/blog/manufacturing-kpis · https://tulip.co/blog/manufacturing/how-to-calculate-34-manufacturing-kpis/ · https://www.cascade.app/blog/manufacturing-kpis · https://scw.ai/blog/manufacturing-kpis/ · https://upkeep.com/learning/what-are-the-best-metrics-and-kpis-for-manufacturing-companies/ · https://safetyculture.com/topics/kpi/manufacturing-kpis/ (redirects to mitti.com) · https://www.vorne.com/learning-center/kpi.htm
40. ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264; Purdue-based Levels 0–4, Level 3 = manufacturing operations management). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
41. Equipment Performance Metrics (SEMI E10 RAM and utilization; SEMI E79 equipment productivity incl. OEE). SEMI. https://semi.org/en/products-services/standards/step/equipment-performance-metrics
42. OSHA: Clarification on how the formula is used by OSHA to calculate incident rates. Standard interpretation letter, August 23, 2016. https://www.osha.gov/laws-regs/standardinterpretations/2016-08-23
43. U.S. Bureau of Labor Statistics: Employer-Reported Workplace Injuries and Illnesses – 2025. News release, November 18, 2026. https://www.bls.gov/news.release/osh.nr0.htm
44. U.S. Bureau of Labor Statistics: Number and rate of nonfatal work injuries and illnesses in private industries, 2025 (chart). https://www.bls.gov/charts/injuries-and-illnesses/number-and-rate-of-nonfatal-work-injuries-and-illnesses-by-industry.htm
45. 29 CFR 1904.39 – Reporting fatalities, hospitalizations, amputations, and losses of an eye as a result of work-related incidents to OSHA. https://www.osha.gov/laws-regs/regulations/standardnumber/1904/1904.39
46. U.S. Bureau of Labor Statistics: Occupational Safety and Health Definitions (recordable cases, DART, days away from work). https://www.bls.gov/iif/definitions/occupational-safety-and-health-definitions.htm
47. Supply Chain Dive: news brief on Walmart's on-time, in-full requirement for suppliers (87 %, two-day window, 3 % fine). March 8, 2019. https://www.supplychaindive.com/news/walmart-on-time-in-full-87-suppliers/550083/
