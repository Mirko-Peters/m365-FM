# SEO metadata

| Field | Value |
|---|---|
| Meta title | Azure per la manifattura: la guida all'architettura 2026 |
| Meta description | Azure per la manifattura nel 2026: stato dei servizi, architettura di riferimento, sicurezza OT (IEC 62443, NIST CSF 2.0), tracciabilità, AI e FinOps. |
| Slug | `manufacturing-it-azure` |

# Azure per il settore manifatturiero: la guida completa all'IT manifatturiero su Microsoft Azure (novembre 2026)

**Risposta breve:** alla fine del 2026, Azure per il manifatturiero si riduce a tre livelli: Azure IoT Operations su Kubernetes abilitato per Azure Arc in stabilimento, Microsoft Fabric (Real-Time Intelligence e OneLake) come piattaforma dati, e Microsoft Foundry, Power BI e Copilot per analytics, AI e lavoro d'ufficio. I componenti precedenti sono ritirati (Time Series Insights, le anteprime dell'agente manifatturiero) oppure programmati per il ritiro (IoT Central nel 2029, la sicurezza OT in Defender for IoT). Il successo dipende meno dai servizi e più dal possesso del proprio modello dati, da una progettazione della sicurezza OT allineata alle linee guida ISA/IEC 62443 e NIST, e dalla scelta di casi d'uso con una baseline misurata.

**Punti chiave**

- Pianificate le nuove connessioni di stabilimento su **Azure IoT Operations**, non su IoT Central né su catene di moduli IoT Edge costruite a mano. Scegliete lo SKU **Standard** se le vostre macchine parlano OPC UA; l'SKU Essentials non include il connettore OPC UA.
- Usate **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator) per i dati di serie temporali. Time Series Insights è stato ritirato il 7 luglio 2024.
- Tenete la logica di business lontana dai servizi in anteprima. Microsoft ha ritirato nel 2025 le anteprime del suo modello dati manifatturiero e dell'agente di fabbrica, circa un anno dopo il lancio.
- Pianificate fin da ora la sostituzione del **monitoraggio OT**. Microsoft ritirerà completamente la sicurezza OT in Defender for IoT nell'ottobre 2029; un blog di un partner Microsoft cita il 31 maggio 2028 come fine del supporto.
- Allineate il vostro programma di sicurezza a **ISA/IEC 62443** (zone e condotti) e a **NIST CSF 2.0**; i fornitori della difesa necessitano inoltre di **CMMC** per i sistemi che trattano FCI o CUI.
- Iniziate con casi d'uso che abbiano una baseline e un responsabile: OEE in tempo reale e tracciabilità di solito ripagano prima della manutenzione predittiva.

## Indice

1. [Che cosa significa oggi Azure per il manifatturiero](#cosa-significa-oggi-azure-per-il-manifatturiero)
2. [Stato dei servizi Azure per il manifatturiero, novembre 2026](#stato-dei-servizi-azure-per-la-produzione-novembre-2026)
3. [Prima il modello dati: ISA-95 e il namespace unificato](#prima-il-modello-dati-isa-95-e-il-namespace-unificato)
4. [Architettura di riferimento Azure per il manifatturiero](#architettura-di-riferimento-azure-per-il-settore-manifatturiero)
5. [Convergenza IT/OT e sicurezza: ISA/IEC 62443, NIST CSF 2.0, CMMC e NIS2](#convergenza-itot-e-sicurezza)
6. [Caso d'uso 1: Manutenzione predittiva su Azure](#caso-duso-1-manutenzione-predittiva-su-azure)
7. [Caso d'uso 2: Tracciabilità e genealogia](#caso-duso-2-tracciabilità-e-genealogia)
8. [Caso d'uso 3: Gemelli digitali](#caso-duso-3-gemelli-digitali)
9. [Caso d'uso 4: KPI in tempo reale, OEE e value stream](#caso-duso-4-kpi-in-tempo-reale-oee-e-flussi-di-valore)
10. [Integrazione ERP e MES: SAP, Dynamics 365 e il flusso dati di reparto](#integrazione-erp-e-mes)
11. [AI e Copilot nel manifatturiero: che cosa è realistico](#ia-e-copilot-nella-produzione-manifatturiera)
12. [FinOps per l'IT manifatturiero](#finops-per-lit-manifatturiero)
13. [Costruire il business case di Azure nel manifatturiero](#costruire-il-business-case-per-azure-nel-manifatturiero)
14. [Roadmap: cinque fasi verso una piattaforma Azure manifatturiera scalabile](#roadmap-cinque-fasi-verso-una-piattaforma-azure-manifatturiera-scalabile)
15. [Errori comuni nei progetti Azure per il manifatturiero](#errori-comuni-nei-progetti-azure-per-la-manifattura)
16. [Applicazioni settoriali nell'ecosistema Microsoft: l'esempio di iFAKT Polaris](#applicazioni-industriali-nellecosistema-microsoft)
17. [FAQ](#faq)
18. [Conclusione](#conclusione)

---

## Cosa significa oggi Azure per il manifatturiero

Cinque anni fa, una ricerca di "Azure for manufacturing" o "Azure IoT for manufacturing" restituiva un elenco familiare: IoT Hub, IoT Edge, Stream Analytics, Time Series Insights e Synapse. Oggi, nel 2026, quell'elenco non descrive più la situazione. Microsoft ha riorganizzato la propria strategia per l'IoT industriale in tre direzioni:

1. **Edge invece del dispositivo:** la raccolta dati in stabilimento ora avviene con **Azure IoT Operations**, un insieme di servizi dati su cluster Kubernetes gestiti dal cloud tramite **Azure Arc**. Microsoft descrive il servizio come un "unified data plane for the edge" [3]. La disponibilità generale è stata annunciata nel novembre 2024 [5].
2. **Piattaforma dati invece di servizi puntuali:** serie temporali, eventi e dati anagrafici confluiscono in **Microsoft Fabric**, in particolare in Real-Time Intelligence con Eventstream, Eventhouse e Activator. Microsoft ha dismesso Time Series Insights e indica ai clienti Fabric Eventhouse come destinazione della migrazione [10].
3. **Piattaforma invece di applicazione confezionata:** nell'IoT e nel manifatturiero Microsoft sta ritirando le proprie applicazioni preconfigurate. IoT Central ha smesso di accettare nuove applicazioni il 23 settembre 2026 e sarà dismesso il 20 settembre 2029 [8], [64]. Le anteprime specifiche per il settore "Manufacturing data solutions" e "Factory Operations Agent" sono state dismesse il 30 maggio 2025 [2].

L'offerta per il settore si chiama oggi **Microsoft for Manufacturing** (in precedenza "Microsoft Cloud for Manufacturing"). Microsoft la organizza in quattro aree di soluzione: ingegneria digitale, catene di fornitura resilienti, fabbriche intelligenti e clienti connessi [1]. Per la fabbrica intelligente, Microsoft indica quattro scenari: modernizzare edge e infrastruttura, ottimizzare le operazioni con l'AI, connettere e potenziare la forza lavoro, e manutenzione e qualità [1]. Microsoft indica Fabric come piattaforma per il "digital thread" [1].

Per chi, come responsabile IT, OT o di trasformazione digitale, questo significa che i blocchi costitutivi sono diventati più generici e che una quota maggiore della responsabilità per il modello dei dati, l'integrazione e le operazioni ricade su di voi o sui vostri partner. Questa guida mostra come assumere tale responsabilità in modo strutturato. Collega la tecnologia Azure ai temi che determinano il successo: il modello dei dati, la sicurezza, [Industria 4.0](https://www.m365.fm/entity/industry-4-0/) come tema organizzativo, KPI e costi.

### A chi si rivolge questa guida

- **Responsabili IT e team cloud** che già gestiscono Microsoft 365 e Azure e hanno ricevuto l'incarico di collegare gli stabilimenti.
- **Ingegneri OT e di automazione** che vogliono capire cosa significano Kubernetes, MQTT e Fabric per i propri impianti.
- **Responsabili di stabilimento, qualità e manutenzione** che valutano casi d'uso come la manutenzione predittiva o la tracciabilità.
- **Team di finanza e acquisti** che devono rendere prevedibili i costi cloud nel manifatturiero.

### Termini del manifatturiero per gli amministratori di Microsoft 365 e Azure

Se provenite dall'IT aziendale, i progetti manifatturieri portano con sé un proprio vocabolario. Ecco i termini chiave usati in questa guida, ciascuno in una frase:

| Termine | Significato | Analogia più vicina nell'IT |
|---|---|---|
| **OT** (operational technology) | Tecnologia che controlla i processi fisici: macchine, controllori, sistemi di controllo | Come un data center separato in cui un'interruzione ferma la produzione |
| **PLC** (programmable logic controller) | Computer industriale che controlla una macchina in tempo reale | Un sistema embedded con una vita utile di 15 anni o più |
| **SCADA** | Sistema di supervisione per monitorare e gestire più macchine o linee | Una console di monitoraggio con accesso in scrittura |
| **MES** (manufacturing execution system) | Controlla e registra l'esecuzione degli ordini di produzione in stabilimento | Un sistema di workflow tra ERP e macchina |
| **OPC UA** | Standard industriale indipendente dal fornitore per lo scambio di dati, con modello informativo e sicurezza integrata | API REST più schema più certificati, per le macchine |
| **MQTT** | Protocollo leggero di publish/subscribe | Un message bus, simile ai topic di Event Grid o Service Bus |
| **Unified namespace (UNS)** | Struttura centrale e gerarchica di eventi in cui tutti i sistemi pubblicano il proprio stato attuale | Una directory di topic a livello aziendale |
| **OEE** (overall equipment effectiveness) | Efficacia delle attrezzature calcolata da disponibilità, prestazioni e qualità | Uno SLA di disponibilità, ma per le macchine e includendo la qualità |
| **KQL** (Kusto Query Language) | Linguaggio di query di Fabric Eventhouse e Azure Data Explorer | Lo stesso linguaggio che usi in Log Analytics e Microsoft Sentinel |
| **Modello Purdue** | Modello di riferimento che stratifica i sistemi di stabilimento dai dispositivi di campo fino all'azienda; ISA-95 si basa su di esso [26] | Un modello di segmentazione di rete, dalla VLAN dei dispositivi alla WAN aziendale |

La riga KQL è un buon punto di partenza per gli amministratori: se conosci KQL da Sentinel o Log Analytics, puoi interrogare subito i dati delle macchine in un Eventhouse.

### Da dove iniziare come amministratore di Microsoft 365 o Azure

Non serve diventare un ingegnere dell'automazione per portare valore in un progetto manifatturiero. Cinque attività spettano in genere all'IT centrale e possono essere preparate prima di collegare la prima macchina:

1. **Identità e ruoli:** Crea gruppi in Microsoft Entra ID e ruoli Azure RBAC per il personale OT, i partner e i team operativi; usa Privileged Identity Management per rendere temporanei gli accessi privilegiati.
2. **Una landing zone Azure per gli stabilimenti:** Definisci una struttura di subscription e resource group per stabilimento, e usa Azure Policy per imporre tag (stabilimento, centro di costo, caso d'uso) e regioni consentite.
3. **Prova Azure Arc:** Collega un server di test o un cluster Kubernetes ad Arc e fai approvare dal team di rete gli endpoint in uscita richiesti attraverso la catena dei proxy. In molte aziende queste approvazioni del firewall richiedono più tempo di tutto il resto.
4. **Basi di Fabric:** Decidi capacità, struttura dei workspace e modello di accesso; riporta la governance di Power BI già esistente.
5. **Costruisci un rapporto di lavoro con l'OT:** Comprendi il modello a zone dello stabilimento prima di proporre modifiche alla rete. In ambito OT la disponibilità viene prima della riservatezza, e le finestre di manutenzione seguono il piano di produzione, non il Patch Tuesday.

---

## Stato dei servizi Azure per la produzione, novembre 2026

Microsoft rinomina i servizi, avvia anteprime e poi le ritira di nuovo. Per i progetti manifatturieri con una durata di cinque-dieci anni, il ciclo di vita del prodotto è quindi un criterio di architettura. La tabella seguente riassume lo stato verificato al 20 novembre 2026.

### Panoramica dei servizi: scopo, stato, fonte

| Servizio | Scopo in produzione | Stato, novembre 2026 | Fonte |
|---|---|---|---|
| **Azure IoT Operations** | Piano dati edge: broker MQTT, connettori (OPC UA, HTTP/REST), flussi di dati, gestione degli asset | Generalmente disponibile dal novembre 2024; rilasci regolari. Microsoft Learn indica la versione 1.5.x (release 2610) come la release che introduce un nuovo SKU, **Essentials** (solo cluster a nodo singolo, senza connettore OPC UA), accanto a **Standard** con l'intero set di funzionalità | [3], [5], [7] |
| **Azure Device Registry** | Rappresentazione cloud di asset e dispositivi, registro degli schemi | Parte integrante di Azure IoT Operations; integrazione con IoT Hub in anteprima | [3], [36] |
| **Azure IoT Hub** + Device Provisioning Service | Gateway cloud per dispositivi connessi direttamente, ciclo di vita dei dispositivi | Attivo; consigliato da Microsoft come destinazione per i clienti di IoT Central | [8], [64] |
| **Azure IoT Central** | SaaS IoT low-code | Nessuna nuova applicazione dal 23 settembre 2026; ritiro il 20 settembre 2029 | [8], [64] |
| **Azure IoT Edge** | Runtime di container per dispositivi edge (moduli) | Prodotto supportato; la versione 1.5 LTS è fuori supporto dal 10 novembre 2026 (così come EFLOW 1.5 per Windows); versione corrente 1.6 LTS (luglio 2026) supportata fino al 14 novembre 2028; nessuna EFLOW 1.6 LTS è elencata nella pagina delle versioni (solo un canale di rilascio continuo EFLOW) | [12], [13] |
| **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator, Real-Time hub) | Acquisizione in streaming, analisi di serie temporali con KQL, avvisi | Generalmente disponibile dall'Ignite, novembre 2024 | [18] |
| **Microsoft Fabric OneLake / Lakehouse** | Archiviazione centrale per dati anagrafici, transazionali e dei sensori | Generalmente disponibile | [17] |
| **Digital twin builder** (Fabric Real-Time Intelligence) | Rappresentazioni digitali basate su ontologia di asset e processi | Anteprima | [15] |
| **Fabric IQ ontology** | Livello semantico di business per analisi e agenti | Anteprima; l'esperienza ontologica precedente si ritira il 31 gennaio 2027, e le ontologie esistenti devono essere copiate nella nuova esperienza | [16] |
| **Azure Digital Twins** | Gemelli basati su grafo con DTDL | Attivo, nessun avviso di ritiro nella pagina panoramica; 3D Scenes Studio in anteprima | [14] |
| **Azure Data Explorer** | Database di serie temporali KQL al di fuori di Fabric | Attivo, nessun avviso di ritiro; usa KQL come Fabric Eventhouse | [19] |
| **Microsoft Foundry** (già Azure AI Foundry / Azure AI Studio) | Modelli, agenti e strumenti per applicazioni di IA | Attivo; i "Servizi Azure AI" sono ora "Foundry Tools"; prompt flow si ritira il 20 aprile 2027 | [20], [34], [37] |
| **Azure Machine Learning** | Addestramento, distribuzione e MLOps per modelli ML classici | Attivo; Microsoft posiziona Foundry per l'IA generativa e Azure ML per il ML classico e MLOps. L'etichettatura dei dati integrata è stata ritirata il 30 settembre 2026 | [37], [38] |
| **Azure Arc** | Gestione di Kubernetes e server al di fuori di Azure | Attivo; base di Azure IoT Operations | [3] |
| **Azure Local** (già Azure Stack HCI) | Infrastruttura iperconvergente in stabilimento | Attivo; rinominato nel novembre 2024 | [21] |
| **Microsoft Defender for IoT (sicurezza OT)** | Monitoraggio passivo della rete OT, inventario degli asset, rilevamento di anomalie | Ritiro annunciato ufficialmente il 2 novembre 2026; ritiro completo nell'ottobre 2029; fino ad allora solo aggiornamenti di sicurezza e correzioni di bug, nessuna nuova funzionalità OT. Un blog di un partner Microsoft indica il 31 maggio 2028 come fine del supporto. Connettori per Armis, Dragos e Forescout | [22], [24], [39] |
| **Azure Time Series Insights** | Esploratore di serie temporali (legacy) | Ritirato il 7 luglio 2024; Microsoft indica Fabric Eventhouse come destinazione della migrazione | [10] |
| **Azure Percept** | Kit di sviluppo di IA edge | Ritirato il 30 marzo 2023 | [11] |
| **Manufacturing data solutions** (Azure) e **Factory Operations Agent** (Azure AI e Copilot Studio) | Modello di dati di produzione e copilot per la produzione (anteprime) | Ritirati a partire dal 30 maggio 2025 (annunciato nel febbraio 2025) | [2] |
| **Factory Safety Agent** (Copilot Studio) | Agente per la sicurezza sul lavoro (anteprima) | Ritirato a partire dal 23 giugno 2025 | [2] |
| **Manufacturing data solutions in Microsoft Fabric** | Modello di dati di produzione in Fabric (anteprima dall'aprile 2024) | Stato non chiaro: gli avvisi di ritiro citano "Manufacturing data solutions" senza il suffisso Fabric e non includono né escludono la variante Fabric; non c'è una voce separata dall'aprile 2024. Non pianificarlo in nuovi progetti; chiedere a Microsoft il suo stato. | [2] |

### Cosa significa la tabella per la tua architettura

**Primo:** pianifica le nuove connessioni di stabilimento su Azure IoT Operations, non su IoT Central e non su catene di moduli IoT Edge proprie, a meno che tu non abbia un motivo specifico. IoT Edge resta supportato, ma è un modello di runtime per dispositivi; Azure IoT Operations affronta il piano dati di stabilimento con un broker, connettori e un modello degli asset [3]. Quando scegli lo SKU, tieni presente che Essentials non include il connettore OPC UA [3]. Per un tipico stabilimento con macchine OPC UA, il punto di partenza è Standard.

**Secondo:** tieni la logica di business lontana dai servizi in anteprima. La storia delle soluzioni dati per la manifattura mostra che un modello dati manifatturiero Microsoft può passare dall'anteprima al ritiro in poco più di un anno [2]. Il tuo modello dati appartiene a te e dovrebbe essere documentato in formati aperti (tabelle Delta in OneLake, schemi JSON nel broker, modelli informativi DTDL o OPC UA).

**Terzo:** rivedi la strategia di sicurezza OT. L'avviso ufficiale di Azure indica ottobre 2029 come fine della sicurezza OT in Defender for IoT, mentre un blog di un partner Microsoft riporta il 31 maggio 2028 come fine del supporto [22], [39]. Pianifica con la data anticipata: approvvigionamento, implementazione e collaudo di nuovi sensori richiedono spesso più di un anno in ambienti regolamentati.

**Quarto:** rivedi il parco dispositivi IoT Edge. I dispositivi con IoT Edge 1.5 non ricevono aggiornamenti di sicurezza dal 10 novembre 2026. Microsoft descrive il passaggio alla 1.6 LTS come semplice, perché non contiene modifiche funzionali importanti [12]. La stessa fine del supporto vale per i dispositivi Windows che eseguono IoT Edge per Linux su Windows (EFLOW) 1.5; la pagina delle versioni non elenca alcuna EFLOW 1.6 LTS, ma solo un canale di rilascio continuo [12]. Chiarisci con Microsoft o con il fornitore dell'hardware il percorso di aggiornamento previsto per questi dispositivi.

> **Nota sull'attualità:** questa tabella è una fotografia della situazione attuale. Prima di ogni decisione architetturale, verifica le pagine Microsoft collegate e il portale Azure Updates filtrato per "Retirements".

---

## Prima il modello dati: ISA-95 e il namespace unificato

Molti progetti di manifattura falliscono non per colpa del cloud, ma perché nessuno ha definito che cosa siano una "macchina", un "ordine" o un "evento di fermo" nel modello dati. Rispondi a questa domanda prima di distribuire il primo servizio Azure.

### ISA-95 e la piramide dell'automazione

La serie **ANSI/ISA-95** (a livello internazionale IEC 62264) descrive l'integrazione tra sistemi aziendali e sistemi di controllo [26]. ISA la descrive come un insieme di standard per integrare i sistemi logistici con i sistemi di controllo della produzione, basati sul modello di riferimento Purdue, applicabili ai settori discreto, continuo e logistico; la serie si compone di otto parti [26]. Offre due elementi utili per qualsiasi architettura cloud:

- **Un modello a livelli:** i livelli da 0 a 2 coprono il processo fisico, sensori, attuatori e controllo (PLC, SCADA). Il livello 3 è la gestione delle operazioni di produzione (MES, MOM). Il livello 4 è la pianificazione aziendale ([ERP](https://www.m365.fm/entity/enterprise-resource-planning/)). In Europa questa gerarchia viene spesso rappresentata come "piramide dell'automazione"; in Nord America il modello Purdue è la rappresentazione più diffusa.
- **Un modello a oggetti:** ISA-95 definisce termini come la gerarchia delle apparecchiature (impresa, sito, area, centro di lavoro, unità di lavoro), materiali, personale, ordini di produzione e dati di prestazione. La OPC Foundation ha mappato questo modello in una propria specifica companion per OPC UA [35].

Le critiche alla piramide sono note: i dati si muovono solo livello per livello, ogni interfaccia è un'integrazione punto-punto e una nuova applicazione deve collegarsi a più sistemi. Il modello a oggetti, invece, resta prezioso perché offre a IT, OT e business un linguaggio comune.

### Namespace unificato: eventi al posto della piramide

Il **namespace unificato (UNS)** è un pattern architetturale, non uno standard. Tutti i sistemi pubblicano il proprio stato corrente come eventi su un broker centrale, strutturato gerarchicamente, tipicamente MQTT. I consumatori si sottoscrivono ai topic di cui hanno bisogno. La gerarchia dei topic segue spesso la gerarchia ISA-95 delle apparecchiature, ad esempio:

```
acme/dayton-plant/assembly/line-3/station-20/state
acme/dayton-plant/assembly/line-3/station-20/order
acme/dayton-plant/assembly/line-3/station-20/quality
```

Azure IoT Operations include un broker MQTT nativo per l'edge che supporta MQTT 3.1.1 e MQTT 5 [40]. Il connettore OPC UA pubblica i dati dai server OPC UA come JSON nel formato OPC UA PubSub verso i topic del broker, e può anche scrivere valori nei nodi OPC UA; le richieste di scrittura usano il pattern request/response di MQTT 5 [4]. Questo consente di costruire una UNS in stabilimento senza eseguire un broker separato.

Se già gestite una UNS su un altro broker, non è necessario sostituirla: i flussi di dati possono inoltrare i messaggi a broker MQTT esterni [3]. Usare il broker Microsoft come UNS di stabilimento oppure come alimentatore di un broker esistente è una decisione operativa. Ciò che conta è una convenzione vincolante per topic e payload, indipendente dal prodotto.

### ISA-95 o UNS? Entrambi.

La risposta produttiva è: usare **ISA-95 come vocabolario** e **la UNS come pattern di trasporto**. In pratica:

| Domanda | Raccomandazione |
|---|---|
| Come denomino gli asset? | Gerarchia delle apparecchiature ISA-95, coerente in tutta l'azienda |
| Come strutturo i topic? | Per gerarchia delle apparecchiature, con i domini di business sotto di essa (stato, ordine, qualità, energia) |
| Come descrivo i payload? | Schemi JSON nel registro schemi di Azure Device Registry [3]; per le macchine, preferire le specifiche companion OPC UA |
| Dove risiedono i dati anagrafici? | Nel sistema di riferimento (ERP, MES, PLM); la UNS distribuisce solo riferimenti e stati |
| Come gestisco lo storico? | Non nel broker, ma nell'Eventhouse o nel Lakehouse di Fabric |

### Il modello dati minimo per la produzione

Indipendentemente dagli strumenti, i casi d'uso di questa guida richiedono un modello di base con sette entità:

1. **Asset** (macchina, stazione, utensile) con un ID univoco e una collocazione nella gerarchia
2. **Segnale** (tag, variabile misurata) con unità, frequenza di campionamento e collegamento all'asset
3. **Stato** (in funzione, fermo pianificato, fermo non pianificato, cambio formato) con un codice motivo
4. **Ordine** (ordine di produzione, operazione) con un collegamento all'ERP
5. **Materiale e numero di lotto/seriale** con un collegamento alla distinta base
6. **Evento** (allarme, rilievo di qualità, manutenzione)
7. **Persona/turno**, nella misura consentita dalle norme sulla privacy e dagli accordi sindacali

Se collegate pulitamente queste sette entità, potete alimentare OEE, manutenzione predittiva, tracciabilità e gemello digitale dalla stessa base dati. Spieghiamo come derivare un modello del genere da un flusso del valore nell'episodio [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/); il metodo in sé è trattato nella nostra guida al [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

---

## Architettura di riferimento Azure per il settore manifatturiero

L'architettura di riferimento seguente riassume quanto Microsoft descrive nella documentazione di Azure IoT Operations [3] e nell'architettura di riferimento Fabric "Connected Factory" [17], e aggiunge i livelli che tali fonti non trattano: sicurezza, anagrafiche di base e postazione di lavoro.

### Modello a livelli

| Livello | Funzione | Componenti Azure e Microsoft | Decisioni tipiche |
|---|---|---|---|
| **0: Campo e controllo** | Macchine, PLC, sensori, banchi di prova, telecamere | Nessun componente Azure; server OPC UA sul controllore o su un gateway, sensori di retrofit dove necessario | Quali macchine parlano OPC UA? Dove serve il retrofit? |
| **1: Infrastruttura edge** | Calcolo in stabilimento, segmentazione di rete | PC industriali o server con Kubernetes (ad esempio AKS Edge Essentials su Windows, cluster basati su Ubuntu) [3], oppure Azure Local [21]; gestiti tramite Azure Arc | Cluster a nodo singolo o multinodo? Chi gestisce l'hardware? Nota: la SKU Essentials è limitata a un solo nodo [3] |
| **2: Piano dati edge** | Raccolta, normalizzazione, buffering, UNS locale | Azure IoT Operations: broker MQTT, connettore OPC UA, connettore HTTP/REST (connettori Akri), data flow, esperienza operativa, individuazione automatica di dispositivi e asset [3], [4] | Struttura dei topic, schemi, aggregazione edge, buffer su disco del broker, comportamento offline (massimo 72 ore, eventualmente degradato [3]) |
| **3: Gestione di asset e dispositivi** | Quale asset è quale? Quali punti dati? | Azure Device Registry con namespace e registro degli schemi [3]; per dispositivi connessi direttamente, IoT Hub e DPS [8] | Chi mantiene l'anagrafica degli asset? Riconciliazione con il sistema di manutenzione (CMMS)? |
| **4: Streaming e analisi in tempo reale** | Acquisizione di eventi, arricchimento, generazione di allarmi | Fabric Real-Time Intelligence: Eventstream, Eventhouse (KQL), Activator, Real-Time Dashboards [17], [18]; in alternativa Azure Event Hubs e Azure Data Explorer [19] | Capacità Fabric o PaaS Azure? Retention hot/cold? |
| **5: Piattaforma dati** | Storico, dati di contesto, data product | OneLake, Lakehouse, Data Factory per dati di ERP, MES e turni [17] | Struttura medallion, responsabilità sui data product, modello di accesso |
| **6: Semantica e gemello digitale** | Significato, relazioni, ontologia | Ontologia Fabric IQ (anteprima) [16], Digital Twin Builder (anteprima) [15] oppure Azure Digital Twins con DTDL [14] | Un'anteprima è accettabile? Mantenere la proprietà del modello |
| **7: Analisi e AI** | Modelli, previsioni, agenti | Fabric Data Science [17], Azure Machine Learning, Microsoft Foundry [20] | Dove addestrare, dove eseguire l'inferenza (cloud o edge)? |
| **8: Postazione di lavoro e processi** | Informare le persone e consentire di agire | Power BI, Teams (inclusi scenari per il personale di linea), Power Apps, Power Automate, Microsoft 365 Copilot, Dynamics 365 | Quale ruolo vede cosa? App mobili in reparto? |
| **Trasversale: sicurezza e governance** | Identità, rete, monitoraggio, conformità | Microsoft Entra ID, Azure Policy, portafoglio Microsoft Defender, Microsoft Purview, sensori OT (Defender for IoT solo come transizione, soluzioni partner) [22] | Modello a zone secondo ISA/IEC 62443, profilo NIST CSF 2.0, percorsi di segnalazione degli incidenti |
| **Trasversale: costi** | Trasparenza, allocazione, ottimizzazione | Microsoft Cost Management, metriche di capacità Fabric, pratiche FinOps [25] | Costo per stabilimento, linea, caso d'uso |

### Flusso dei dati in dieci passi

1. Il controllore espone i valori di processo tramite un server OPC UA.
2. Il connettore OPC UA in Azure IoT Operations legge i punti dati configurati di un asset e li pubblica su un topic del broker, ad esempio `azure-iot-operations/data/<asset>` [4].
3. Il connettore può individuare automaticamente gli asset sui server OPC UA e aggiungerne la configurazione ad Azure Device Registry [4].
4. I flussi di dati filtrano, normalizzano, convertono le unità di misura e arricchiscono i dati con il contesto [3], [31].
5. Le applicazioni locali (ad esempio un pannello andon o un'ispezione in linea) si sottoscrivono direttamente al broker.
6. Un flusso di dati inoltra i dati aggregati a un endpoint cloud: Event Hubs/Kafka, il broker MQTT di Event Grid, Data Lake Storage, Fabric OneLake o Azure Data Explorer [3].
7. In Fabric, un Eventstream acquisisce i dati e l'Eventhouse li memorizza per le query KQL [17].
8. Data Factory sincronizza i dati di ERP, MES, turni e costi in OneLake [17].
9. Gli eventi vengono arricchiti con la gerarchia degli asset e la topologia di linea; i modelli vengono addestrati e valutati, e i risultati sono memorizzati in OneLake [17].
10. Real-Time Dashboards e Power BI visualizzano i dati, Activator notifica i tecnici e Copilot risponde alle domande in linguaggio naturale [17].

Microsoft dimensiona il riferimento Connected Factory a oltre un milione di eventi IIoT all'ora, provenienti da 30.000 tag in 40 stabilimenti [17]. Va considerato come un orientamento, non come una garanzia di prestazioni per il vostro ambiente.

### Lezioni dai progetti

La società di consulenza b.telligent descrive tre lezioni tratte dai progetti con Azure IoT Operations e Fabric [31]:

- **Configurare l'archiviazione del broker:** senza uno storage persistente configurato, i messaggi che non possono essere inoltrati possono saturare la memoria. Microsoft conferma il punto indirettamente: il buffer dei messaggi su disco del broker può essere impostato solo durante la distribuzione iniziale, non successivamente [40]. Definite il profilo di memoria e il buffer prima del rollout.
- **Mantenere stabili gli schemi:** modifiche alle strutture JSON rendono fragile l'elaborazione a valle. Un envelope uniforme con metadati e payload aiuta.
- **Consolidare gli Eventstream:** poiché ogni Eventstream comporta costi di esercizio, il post consiglia di consolidarli per stabilimento anziché per sorgente, ed eseguire le trasformazioni nell'Eventhouse con policy di aggiornamento e KQL anziché nell'Eventstream.

Questi suggerimenti provengono da un post del marzo 2025 (aggiornato nel giugno 2025); verificate se valgono ancora per la vostra release.

### Percorsi alternativi

Non ogni produttore ha bisogno dell'architettura completa. Sono comuni quattro varianti:

| Variante | Quando ha senso | Componenti |
|---|---|---|
| **Diretta al cloud** | Pochi dispositivi moderni e connessi; nessun requisito di latenza | IoT Hub, DPS, Fabric Real-Time Intelligence |
| **Centrata sull'edge** | Molte macchine, OPC UA, decisioni locali, rete OT senza connessione diretta al cloud | Azure IoT Operations su Arc, Fabric |
| **Edge di partner** | Piattaforma edge industriale esistente di un fornitore di automazione | Piattaforma partner più Fabric o Azure; Microsoft cita, ad esempio, l'esecuzione di modelli Azure AI su Siemens Industrial Edge come indicazione architetturale [2] |
| **Avvio ridotto (produttore di medie dimensioni, un stabilimento)** | Poche linee, nessun team Kubernetes interno, primo caso d'uso OEE o monitoraggio delle condizioni | Un cluster single-node con Azure IoT Operations Standard (per via di OPC UA), una piccola capacità Fabric, Power BI; gestione del cluster eventualmente tramite un partner |

Per un produttore di medie dimensioni con un solo stabilimento, l'architettura completa a livelli è un'immagine di destinazione, non un punto di partenza. Iniziate con i livelli 1, 2, 4 e 8 e aggiungete semantica, AI e governance multi-stabilimento una volta che il primo caso d'uso avrà dato risultati.

---

## Convergenza IT/OT e sicurezza

Una volta che i dati delle macchine confluiscono nel cloud, lo stabilimento diventa parte della superficie di attacco. Allo stesso tempo, i requisiti normativi e dei clienti stanno aumentando. CISA include la produzione di metalli primari, macchinari, apparecchiature ed componenti elettrici e i mezzi di trasporto nel nucleo del **Critical Manufacturing Sector** statunitense [52]; molti stabilimenti che alimentano dati in Azure appartengono quindi a un settore di infrastrutture critiche.

Questa sezione parte dagli standard che determinano la progettazione tecnica (ISA/IEC 62443, NIST CSF 2.0, NIST SP 800-82), passa poi agli obblighi che si applicano a specifiche categorie di produttori (CMMC, SEC, CIRCIA) e, per le aziende con attività nell'UE o clienti europei, a NIS2 e al Cyber Resilience Act.

### ISA/IEC 62443: zone, condotti, livelli di sicurezza

La serie **ISA/IEC 62443** è il riferimento per la sicurezza dei sistemi di automazione e controllo industriale. I suoi concetti fondamentali sono le zone (gruppi di asset con le stesse esigenze di protezione), i condotti (percorsi di comunicazione controllati tra le zone) e i livelli di sicurezza come obiettivo per ciascuna zona, da SL 1 (protezione contro violazioni casuali o accidentali) a SL 4 (protezione contro attaccanti sofisticati con risorse estese) [27]. Lo standard definisce inoltre sette requisiti fondamentali, dal controllo di identificazione e autenticazione alla disponibilità delle risorse [27]. Per un'architettura Azure, ciò significa:

- **Il cluster edge è una zona a sé stante:** il cluster Kubernetes che esegue Azure IoT Operations non appartiene né alla rete d'ufficio né direttamente alla rete di controllo, ma a una zona intermedia (spesso chiamata "DMZ industriale", livello Purdue 3.5).
- **Solo connessioni in uscita:** Arc e i flussi di dati aprono connessioni dallo stabilimento verso il cloud. Le connessioni in entrata da internet verso lo stabilimento non sono necessarie e non dovrebbero essere aperte.
- **Reti stratificate:** Microsoft dichiara che Azure IoT Operations supporta la gestione sicura dei dispositivi in reti stratificate [3]. Pianificare per tempo la catena di proxy e firewall insieme alla sicurezza OT.
- **Concedere l'accesso in scrittura in modo deliberato:** il connettore OPC UA può scrivere valori nei controllori [4]. Questa capacità richiede una propria valutazione del rischio e un processo di approvazione, e idealmente parte disattivata.
- **Certificati al posto delle password:** per OPC UA sono disponibili username/password, certificati X.509 e accesso anonimo (solo per test) [4]. Usare certificati e una trust list, e trattare il rinnovo dei certificati come un processo operativo ricorrente.

### NIST CSF 2.0 e NIST SP 800-82: la base statunitense

Per la maggior parte dei produttori statunitensi, il **NIST Cybersecurity Framework (CSF) 2.0** è il linguaggio comune tra stabilimento, IT e consiglio di amministrazione. NIST lo ha rilasciato il 26 febbraio 2024; estende le cinque funzioni Identify, Protect, Detect, Respond e Recover con una nuova funzione **Govern** e si applica a organizzazioni di qualsiasi settore e dimensione [49]. Il framework è volontario, ma clienti, assicuratori e revisori chiedono sempre più spesso un profilo CSF.

Due documenti NIST rendono il framework concreto per gli stabilimenti:

- **NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security** (settembre 2023) tratta architetture OT, minacce e contromisure e aggiunge un overlay OT con baseline di controllo SP 800-53 adattate per sistemi OT a impatto basso, moderato e alto [50].
- **NIST IR 8183 Rev. 2, Cybersecurity Framework 2.0 Manufacturing Profile**, è stato pubblicato come bozza iniziale per consultazione pubblica il 29 settembre 2025; il periodo di commento si è chiuso il 17 novembre 2025 e, a novembre 2026, non risulta ancora una versione finale [51]. Va usato come riferimento di bozza, non come standard definitivo.

Come si incastrano le parti in un progetto Azure:

| Funzione CSF 2.0 | Che cosa significa per la piattaforma di produzione su Azure |
|---|---|
| Govern | Responsabili nominativi per la piattaforma dello stabilimento, accettazione del rischio per i servizi in anteprima, elenco dei fornitori (Microsoft, integratore, fornitori OT) |
| Identify | Inventario degli asset OT riconciliato con Azure Device Registry; mappa dei flussi di dati per zona e per conduit |
| Protect | Ruoli Entra ID con privilegio minimo, PIM, certificati OPC UA, connettività solo in uscita, accesso in scrittura disabilitato per impostazione predefinita |
| Detect | Monitoraggio della rete OT (soluzione di partner dopo Defender for IoT), log centralizzati da edge e cloud in Sentinel o nel vostro SIEM |
| Respond | Playbook di risposta agli incidenti che copre stabilimento e cloud, incluso chi può disconnettere un cluster durante la produzione |
| Recover | Ridistribuzione testata del cluster edge (infrastructure as code), backup della configurazione del broker e degli asset |

I produttori di piccole e medie dimensioni non devono farlo da soli: la NIST Manufacturing Extension Partnership (MEP) National Network offre autovalutazioni basate su CSF, analisi delle lacune, piani di azioni correttive, piani di risposta agli incidenti e assistenza sui requisiti DFARS [58].

### CMMC per i fornitori della difesa

Se producete componenti o fornite servizi per il US Department of Defense, il **Cybersecurity Maturity Model Certification (CMMC)** si applica ai sistemi che elaborano, memorizzano o trasmettono Federal Contract Information (FCI) o Controlled Unclassified Information (CUI). La norma del programma (32 CFR Part 170) è entrata in vigore il 16 dicembre 2024 [53]. La norma DFARS che inserisce il CMMC nei contratti è entrata in vigore il 10 novembre 2025, con un'implementazione graduale: la fase 1 è iniziata in quella data, la fase 2 inizierà il 10 novembre 2026 e la fase 3 è prevista per il 10 novembre 2027 [54]. I livelli sono Livello 1 (autovalutazione, FCI), Livello 2 (autovalutazione o valutazione di terza parte da parte di un C3PAO, in base a NIST SP 800-171) e Livello 3 (valutazione DIBCAC, che aggiunge le pratiche di NIST SP 800-172) [53], [54].

Che cosa significa per Azure:

- **Definite l'ambito dei dati, non del cloud.** Il CMMC si applica ai vostri sistemi, non ad Azure come piattaforma; non esiste un certificato CMMC per Azure in quanto tale [55]. La semplice telemetria delle macchine potrebbe non essere CUI, mentre disegni, specifiche e alcuni parametri di processo per componenti della difesa possono esserlo; decidono le marcature CUI e le clausole contrattuali del vostro cliente. Stabilite quali dati nella UNS e in OneLake rientrano nell'ambito.
- **Scegliete deliberatamente l'ambiente cloud.** Microsoft dichiara che sia Azure commerciale sia Azure Government detengono autorizzazioni FedRAMP High che coprono NIST SP 800-171, e che è possibile ottenere la certificazione CMMC per le soluzioni in entrambi; Azure Government aggiunge le autorizzazioni DoD IL4/IL5 e impegni contrattuali sull'archiviazione dei dati negli Stati Uniti e sul personale statunitense sottoposto a screening, e Microsoft lo considera la scelta più adatta per la maggior parte dei contractor della difesa [55]. Notate che la pagina CMMC di Microsoft è stata aggiornata l'ultima volta nell'aprile 2023, quindi verificate i dettagli con il vostro referente account Microsoft.
- **Verificate la disponibilità delle funzionalità.** Non tutti i servizi descritti in questa guida sono disponibili in Azure Government o nell'ambiente Microsoft 365 GCC High. Verificate la disponibilità di Azure IoT Operations, Fabric e Copilot per il cloud di destinazione prima di progettarci sopra [unverified: per i singoli servizi; verificare le pagine di Microsoft sulla disponibilità delle funzionalità per il governo degli Stati Uniti].

### Comunicazione alla SEC e segnalazione di incidenti CIRCIA

Due regimi di segnalazione statunitensi incidono su come progettare la registrazione dei log e la risposta agli incidenti per la piattaforma di stabilimento:

- **Società quotate:** Ai sensi delle norme SEC adottate il 26 luglio 2023, i registranti devono comunicare un incidente di cybersicurezza rilevante tramite il Form 8-K (Item 1.05) entro quattro giorni lavorativi dopo aver stabilito che è rilevante, e descrivere la gestione del rischio di cybersicurezza, la strategia e la governance nel Form 10-K annuale [56]. Un attacco ransomware che blocca uno stabilimento è un caso tipico per una valutazione di rilevanza, quindi il vostro playbook di incidenti OT deve prevedere una via rapida verso il comitato per le comunicazioni.
- **Infrastrutture critiche (CIRCIA):** Il Cyber Incident Reporting for Critical Infrastructure Act impone ai soggetti interessati di segnalare alla CISA gli incidenti informatici rilevanti entro 72 ore e i pagamenti di riscatti entro 24 ore, ma solo quando entrerà in vigore la norma finale della CISA. Al mese di ottobre 2026, la CISA aveva inviato la norma finale alla Casa Bianca per la revisione, e non era stata ancora pubblicata [57]. Tenete sotto controllo la norma finale: definirà quali produttori rientrano nell'ambito.

### NIS2 e Cyber Resilience Act per le operazioni nell'UE

Se gestisci stabilimenti nell'UE o vendi macchinari in Europa, sono rilevanti anche due normative europee. Gli esempi tedeschi qui sotto provengono dalla edizione originale tedesca di questa guida e mostrano come le norme UE si applicano nella pratica.

**NIS2 (esempio: Germania).** La legge di recepimento tedesca della NIS2 (NIS2UmsuCG) è entrata in vigore il 6 dicembre 2025; l'Ufficio federale per la sicurezza delle informazioni (BSI) tedesco ora supervisiona circa 29.500 soggetti, invece di circa 4.500 [28]. Le aziende rientrano nell'ambito di applicazione se appartengono a una delle tipologie di soggetti degli Allegati 1 e 2 della legge BSI e rispettano le soglie previste dalla Sezione 28: almeno 50 dipendenti, oppure un fatturato annuo e un totale di bilancio entrambi superiori a 10 milioni di EUR [41]. Le voci manifatturiere dell'Allegato 2 comprendono dispositivi medicali, computer, prodotti elettronici e ottici, apparecchiature elettriche, macchinari e veicoli; chimica e alimentare sono settori distinti. Obblighi principali:

- **Registrazione** in due fasi, tramite l'account "Mein Unternehmenskonto" e il portale BSI, aperto il 6 gennaio 2026 [28].
- **Gestione del rischio** con responsabilità a livello dirigenziale.
- **Misure tecniche e organizzative**, inclusi la sicurezza della catena di fornitura e l'autenticazione a più fattori.
- **Segnalazione degli incidenti** significativi: preallarme entro 24 ore dalla presa di conoscenza, notifica dell'incidente entro 72 ore, relazione finale al più tardi un mese dopo la notifica [41].

Le aziende devono valutare autonomamente se rientrano nell'ambito di applicazione; la BSI non le notifica. Mette a disposizione un'autovalutazione online non vincolante e raccomanda una consulenza legale nei casi poco chiari [41]. Gli altri Stati membri UE hanno propri atti di recepimento con strutture simili.

**Cyber Resilience Act.** Se costruisci macchine o prodotti con elementi digitali e li immetti sul mercato UE, si applica anche il **Cyber Resilience Act (Regolamento (UE) 2024/2847)**, inclusi i produttori statunitensi. Dall'11 settembre 2026, i produttori devono segnalare le vulnerabilità sfruttate attivamente e gli incidenti gravi tramite la Single Reporting Platform di ENISA: preallarme entro 24 ore, notifica entro 72 ore e relazione finale al più tardi 14 giorni dopo la disponibilità di una correzione per le vulnerabilità, oppure entro un mese per gli incidenti [30]. Dall'11 dicembre 2027, i prodotti devono soddisfare i requisiti essenziali di cibersicurezza prima di essere immessi sul mercato; tra questi figurano impostazioni predefinite sicure, una distinta base del software (SBOM) e aggiornamenti di sicurezza per un periodo di supporto dichiarato, in genere di almeno cinque anni [42]. Per i costruttori di macchinari che forniscono apparecchiature con servizi cloud, l'IT di produzione diventa conformità di prodotto.

Per l'architettura Azure, NIS2, CSF 2.0 e CMMC vanno nella stessa direzione: un inventario (cosa è connesso al cloud?), la registrazione dei log (chi ha modificato cosa e quando?), la trasparenza della catena di fornitura (quali servizi e partner sono coinvolti?) e un percorso di segnalazione provato.

### Monitoraggio OT dopo il ritiro di Defender for IoT

Il 2 novembre 2026, Microsoft ha annunciato ufficialmente in Azure Updates che ritirerà completamente il componente di sicurezza OT di Defender for IoT nell'ottobre 2029, dopo un periodo di transizione di tre anni [22]. Fino ad allora il servizio riceve aggiornamenti di sicurezza e correzioni di bug, ma non nuove funzionalità OT; gli accordi esistenti e i rinnovi sono rispettati fino all'ottobre 2029 [22]. Le funzionalità IoT enterprise di Defender for Endpoint, così come il rilevamento dei dispositivi e la valutazione delle vulnerabilità, non sono interessate [22]. Non esiste una sostituzione di prima parte [39]. Microsoft offre connettori per Armis, Dragos e Forescout che portano i dati su asset e vulnerabilità OT in Microsoft Security Exposure Management e nel portale Defender; le soluzioni dei partner richiedono licenze e distribuzione proprie [22], [24].

Date in conflitto: un blog di un partner Microsoft del novembre 2026 indica il **31 maggio 2028** come fine del supporto per la sicurezza OT [39]. Al momento della stesura non era stato chiarito se si tratti di una data diversa per determinati tipi di contratto oppure di un errore.

Raccomandazione: se stai introducendo ora il monitoraggio OT, valuta direttamente le soluzioni dei partner. Se utilizzi Defender for IoT, pianifica la sostituzione in modo che sia completata prima di metà 2028, e conferma con il tuo referente account Microsoft la data che si applica al tuo contratto.

### Checklist di sicurezza per il primo collegamento dell'impianto

- [ ] Modello di zone secondo ISA/IEC 62443 documentato per lo stabilimento
- [ ] Cluster edge in una propria zona, solo connessioni in uscita, attraverso un proxy
- [ ] Endpoint di Arc e Azure esplicitamente consentiti nel firewall, tutto il resto bloccato
- [ ] Connessioni OPC UA con certificati; accesso in scrittura disabilitato o soggetto ad approvazione
- [ ] Ruoli Entra ID per il personale OT con privilegio minimo; accesso privilegiato a tempo limitato
- [ ] Log di edge e cloud raccolti in modo centralizzato
- [ ] Inventario degli asset OT riconciliato con Azure Device Registry
- [ ] Profilo CSF 2.0 (attuale e target) redatto per la piattaforma dello stabilimento
- [ ] Ambito CMMC deciso se lo stabilimento tratta FCI o CUI
- [ ] Percorso di segnalazione degli incidenti testato (SEC, CIRCIA una volta in vigore, NIS2 per i siti UE)
- [ ] Processo di aggiornamento per le release di Azure IoT Operations e Kubernetes definito (finestre di manutenzione concordate con la produzione)

---

## Caso d'uso 1: Manutenzione predittiva su Azure

La manutenzione predittiva è uno dei casi d'uso più citati nel settore manifatturiero su Azure, ed è anche uno di quelli in cui molti pilot falliscono. Un motivo comune: il modello arriva prima dei dati. Approfondiamo questo punto nell'episodio [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/).

### Distinguere i termini

| Strategia | Trigger | Dati richiesti |
|---|---|---|
| Manutenzione reattiva | Guasto | Nessuno |
| Manutenzione preventiva | Intervallo temporale o a contatore | Ore di funzionamento, cicli |
| Manutenzione basata sulle condizioni (monitoraggio delle condizioni) | Soglia superata | Variabili di condizione (vibrazione, temperatura, corrente) |
| Manutenzione predittiva | Previsione della vita utile residua o della probabilità di guasto | Variabili di condizione più storico dei guasti etichettato più contesto operativo |
| Manutenzione prescrittiva | Azione raccomandata | Più conoscenza di cause e azioni |

Molte aziende ottengono gran parte del beneficio con la sola manutenzione basata sulle condizioni. I modelli predittivi ripagano quando i guasti sono costosi, abbastanza frequenti e fisicamente annunciati in anticipo. [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) fornisce la strategia complessiva; anche i suoi pilastri di manutenzione autonoma e pianificata funzionano senza IA.

### Prerequisiti sui dati

Prima di addestrare un modello, dovresti poter rispondere sì a queste domande:

1. **Esiste uno storico dei guasti?** Un modello supervisionato richiede guasti con marcatura temporale e tipo di guasto. Di solito questi dati risiedono nel sistema di manutenzione (ad esempio SAP PM o un CMMS) e raramente sono codificati in modo pulito.
2. **I timestamp sono sincronizzati?** Il tempo dei sensori, il tempo dei controllori e il tempo di registrazione nell'ERP devono poter essere messi in corrispondenza. Non è un caso che Microsoft abbia aggiunto messaggi di integrità dedicati per server NTP mancanti o non raggiungibili nei sensori di Defender for IoT [23]; lo stesso vale per la vostra pipeline dei dati. Il connettore OPC UA riporta il timestamp di origine di ogni valore [4]; usatelo al posto dell'ora di arrivo nel cloud.
3. **La frequenza di campionamento è adeguata alla modalità di guasto?** Il danneggiamento dei cuscinetti appare negli spettri di vibrazione nell'intervallo dei kilohertz; l'usura delle resistenze riscaldanti appare in valori su scala di minuti. Un tag OPC UA con risoluzione di un secondo basta per il primo caso, non per il secondo.
4. **Il contesto operativo è disponibile?** Senza informazioni su prodotto, ricetta, ordine e stato (cambio formato, produzione, fermo), il modello tratterebbe ogni cambio di prodotto come un'anomalia.
5. **L'azione è definita?** Chi risponde a un avviso, con quanto anticipo e come viene comunicato il risultato?

### Sei passi

1. **Selezionare i candidati:** asset con costi di guasto elevati, modalità di guasto ricorrenti e sensori già presenti. Un'analisi di Pareto delle cause di fermo dal MES fornisce l'elenco.
2. **Collegare i dati:** connettore OPC UA in Azure IoT Operations, punti dati per asset, flusso dati verso Fabric [3], [4]. Aggregare al edge i dati di vibrazione ad alta frequenza in feature (RMS, curtosi, energie di banda).
3. **Prima il monitoraggio delle condizioni:** soglie e semplice rilevamento di anomalie in Eventhouse e Activator. Activator può notificare direttamente i tecnici [17]. Questo produce valore in settimane anziché in mesi e raccoglie contemporaneamente le etichette.
4. **Creare le etichette:** associare alle serie temporali gli ordini di manutenzione con i codici di guasto. È qui che si concentra il vero sforzo. Pianificare uno strumento dedicato: Microsoft ha ritirato l'etichettatura dei dati integrata in Azure Machine Learning il 30 settembre 2026 e indirizza verso fornitori terzi [38]. Per le etichette delle serie temporali provenienti dalla manutenzione, spesso è sufficiente una Power App che scriva i dati di ritorno nel sistema di manutenzione.
5. **Addestrare il modello:** in Fabric Data Science o Azure Machine Learning; archiviare i risultati in OneLake [17]. Iniziare con metodi interpretabili (gradient boosting sulle feature) prima di ricorrere al deep learning.
6. **Operativizzare:** inviare le previsioni come eventi nel processo di manutenzione (notifica nel sistema di manutenzione, messaggio Teams, form Power Apps per il feedback). Monitorare la qualità del modello e il drift.

### Metriche di successo

Misurare l'impatto operativo, non l'accuratezza del modello: fermo non pianificato, tempo medio tra i guasti (MTBF), tempo medio di riparazione (MTTR), quota di ore di manutenzione pianificate sul totale e scorte di ricambi. Questi [KPI](https://www.m365.fm/entity/key-performance-indicator/) richiedono una baseline prima dell'avvio del progetto; altrimenti non è possibile dimostrare alcun beneficio. La nostra guida ai [KPI di produzione](https://www.m365.fm/en/learn/manufacturing-kpis/) riporta le definizioni.

### Edge o cloud per l'inferenza?

| Criterio | Inferenza nel cloud | Inferenza al edge |
|---|---|---|
| Latenza | Da secondi a minuti | Millisecondi |
| Volume di dati | Vengono inviati solo dati aggregati | I dati grezzi restano in locale |
| Operatività | Più semplice (modelli centralizzati) | Installazioni distribuite, versionamento per stabilimento |
| Resilienza | Dipende dalla connettività | Funziona offline |
| Uso tipico | Vita utile residua, pianificazione della manutenzione | Arresto rapido, qualità in linea |

Per la manutenzione predittiva classica, l'inferenza nel cloud su dati aggregati è sufficiente nella maggior parte dei casi. Dalla release 2603, Microsoft posiziona esplicitamente Azure IoT Operations per scenari di AI più vicini alla macchina ("Physical AI") [6]; per l'inferenza al edge, consultare le note di rilascio attuali [7].

### Manutenzione predittiva su Azure: panoramica dei building block

| Fase | Building block di Azure e Microsoft | Alternativa |
|---|---|---|
| Raccolta dati | Azure IoT Operations (connettore OPC UA, data flow) [3], [4] | IoT Hub per sensori collegati direttamente [36] |
| Archiviazione e analisi delle serie temporali | Fabric Eventhouse con KQL [17] | Azure Data Explorer [19] |
| Soglie e avvisi | Fabric Activator [17] | Azure Monitor o logica personalizzata |
| Addestramento del modello | Fabric Data Science, Azure Machine Learning [17], [37] | Applicazione propria del costruttore della macchina |
| Attivazione dell'azione | Power Automate, Teams, Power Apps, sistema di manutenzione | API diretta al CMMS |

---

## Caso d'uso 2: Tracciabilità e genealogia

La tracciabilità risponde alla domanda "Dove è installato questo componente e di cosa è composto?". La genealogia descrive l'intera catena di origine di un prodotto: materiale, lotto, fase di processo, macchina, parametri, risultato di ispezione e operatore. Nei settori regolamentati è obbligatoria; in tutti gli altri accelera la gestione dei reclami e circoscrive i richiami. L'episodio [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) tratta l'argomento in profondità.

### Requisiti per settore

| Settore / norma | Requisito fondamentale sui dati | Nota |
|---|---|---|
| Alimentare, FDA Food Traceability Rule (FSMA Section 204) | Elementi chiave di dati (KDE) per ogni evento critico di tracciabilità (CTE) come ricevimento, trasformazione e spedizione, collegati a un codice lotto di tracciabilità; registrazioni fornite alla FDA entro 24 ore da una richiesta, più un foglio di calcolo elettronico ordinabile durante epidemie o richiami | [59]; la FDA non applicherà la norma prima del 20 luglio 2028 in seguito a una direttiva del Congresso (data originaria 20 gennaio 2026) |
| Dispositivi medici, FDA QMSR (21 CFR Part 820) | Dal 2 febbraio 2026, il Quality Management System Regulation incorpora per riferimento la norma ISO 13485:2016, inclusi i suoi requisiti di identificazione e tracciabilità | [61] |
| Registrazioni elettroniche regolamentate dalla FDA, 21 CFR Part 11 | Tracce di audit sicure, generate dal computer e con marcatura temporale, che registrano le immissioni e le modifiche degli operatori senza oscurare le voci precedenti, conservate per tutta la durata delle registrazioni | [60]; rilevante per farmaceutica, dispositivi medici e registrazioni alimentari conservate elettronicamente |
| Automotive, IATF 16949 | La sezione 8.5.2.1 integra i requisiti di identificazione e tracciabilità della ISO 9001 (incluso un piano di tracciabilità basato sull'analisi dei rischi); la sezione 7.5.3.2.1 riguarda la conservazione di determinate registrazioni, comunemente interpretata come la durata della fornitura di parti di produzione e di ricambio più un anno solare, salvo diversa richiesta del cliente o del regolatore | Il testo della norma è a pagamento; dettagli da fonti secondarie. I requisiti specifici dei clienti OEM (CSR) spesso vanno oltre |
| Aerospaziale, AS9100D (EN 9100 in Europa, JIS Q 9100 in Giappone) | Tracciabilità lungo l'intero ciclo di vita del prodotto, identificazione della configurazione, capacità di risalire ai prodotti realizzati con lo stesso lotto di materia prima o lo stesso lotto di produzione | AS9100D (2016) è la revisione attuale; EN 9100 è l'edizione europea tecnicamente equivalente [62]. La citazione della clausola (8.5.2) non è stata verificata sul testo originale della norma |
| Batterie vendute nell'UE, Regolamento UE sulle batterie (Regolamento (UE) 2023/1542) | Passaporto elettronico della batteria dal 18 febbraio 2027 per le batterie di trazione dei veicoli elettrici, le batterie dei mezzi di trasporto leggeri (ad esempio e-bike, monopattini elettrici) e le batterie industriali superiori a 2 kWh | [29]; calendario secondo la Commissione europea, indicativo; rilevante per gli esportatori statunitensi verso l'UE |
| Prodotti venduti nell'UE ai sensi del Regolamento sulla progettazione ecocompatibile (ESPR, Regolamento (UE) 2024/1781) | Passaporto digitale del prodotto in funzione dell'atto delegato; registro UE dei DPP operativo dal 20 luglio 2026 (inizialmente con un ambiente di prova); atto delegato per ferro e acciaio previsto per il quarto trimestre 2026, per tessili, alluminio e pneumatici nel 2027; almeno 18 mesi di transizione dopo l'adozione di un atto delegato | [29]; calendario secondo la Commissione europea, indicativo |

Per il settore aerospaziale, Mirko Peters spiega nel suo post [Aerospace Production Planning: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/) perché i tempi di attraversamento e la tracciabilità sono strettamente collegati in questo ambito; la nostra guida alla [pianificazione della produzione aerospaziale](https://www.m365.fm/en/learn/aerospace-production-planning/) copre il contesto di AS9100, FAA e controllo delle esportazioni.

### Il modello dati della genealogia

Una genealogia solida richiede tre tipi di relazioni:

1. **Materiale-in-materiale:** il lotto A e il componente B confluiscono nell'assieme C (riferimento alla distinta base, numero di serie o di lotto).
2. **Materiale-a-processo:** l'assieme C è stato lavorato nell'operazione 30 presso la postazione 20 con il set di parametri X dal turno Y.
3. **Processo-a-risultato:** l'operazione 30 ha prodotto il risultato di ispezione Z e, ove applicabile, una non conformità.

Queste relazioni formano un grafo. In Fabric è possibile rappresentarlo come una struttura di tabelle nel Lakehouse e attraversarlo con KQL o SQL, oppure modellarlo come grafo in un gemello digitale (ontologia di Fabric o Azure Digital Twins) [14], [16]. Ciò che conta è che l'identificazione avvenga alla fonte: scansione, RFID o codici Data Matrix alla stazione, collegati all'evento di ordine nell'UNS.

### Implementazione su Azure

- **Acquisire gli eventi al edge:** Scanner e stazioni pubblicano "il pezzo X è iniziato/terminato alla stazione Y" sul broker MQTT di Azure IoT Operations [3]. I parametri di processo arrivano tramite il connettore OPC UA [4]; il "dataset triggering" consente a un punto dati di innescare la pubblicazione degli altri, ad esempio "ciclo completato" [4].
- **Riunire il contesto:** In Fabric, gli eventi vengono uniti ai dati di ordini e distinta base provenienti da ERP e MES [17].
- **Garantire l'immutabilità:** I registri normativi richiedono uno storage immutabile o almeno un registro delle modifiche a prova di manomissione (per i registri regolamentati dalla FDA, il requisito della traccia di audit del Part 11 [60]). La politica di immutabilità di OneLake attualmente si applica solo ai log diagnostici, non ai dati di business [43]. Per archivi di tracciabilità a prova di audit, aggiungere Azure Blob Storage con politiche di storage immutabile (WORM); Fabric resta il livello analitico.
- **Fornire query:** Le query tipiche sono il tracciamento in avanti (quali prodotti finiti contengono il lotto A?) e il tracciamento all'indietro (di cosa è composto il numero di serie S?). Un report Power BI o una Power App per il controllo qualità rendono queste query utilizzabili senza competenze KQL. Ai sensi di FSMA 204, la capacità di esportare un foglio di calcolo ordinabile entro 24 ore [59] è un test di accettazione concreto per questo livello.

### Dal record di tracciabilità al passaporto digitale del prodotto

Un passaporto digitale del prodotto è essenzialmente un estratto accessibile dall'esterno della vostra genealogia, con dati di sostenibilità e sui materiali. Se oggi costruite una genealogia pulita, avete già svolto la parte più difficile del lavoro preparatorio. Assicuratevi che gli identificatori siano unici e permanenti, e che possiate separare quali dati sono pubblici, quali sono destinati alle autorità di regolamentazione e quali sono solo interni.

---

## Caso d'uso 3: Gemelli digitali

Il termine [gemello digitale](https://www.m365.fm/entity/digital-twin/) viene usato per cose molto diverse: da un modello 3D a un modello di simulazione fino a una rappresentazione in tempo reale di uno stabilimento. Ai fini dell'architettura, è utile una distinzione. La nostra guida ai [gemelli digitali nella produzione](https://www.m365.fm/en/learn/digital-twin-manufacturing/) va oltre la prospettiva di Azure.

### Tre tipi di gemelli

| Tipo | Domanda | Dati | Strumenti nell'ecosistema Microsoft |
|---|---|---|---|
| **Gemello informativo** | Cosa si trova dove, e come è collegato? | Gerarchia degli asset, relazioni, stati in tempo reale | Fabric digital twin builder (anteprima) [15], ontologia Fabric IQ (anteprima) [16], Azure Digital Twins [14] |
| **Gemello di simulazione** | Cosa succede se …? | Logica di processo, tempi, capacità, comportamento in caso di disturbi | Applicazioni industriali per simulazione di flusso materiali e processi, eventualmente su infrastruttura Azure |
| **Gemello ingegneristico** | Come si comporta fisicamente il prodotto o la macchina? | CAD, CAE, logica di controllo | PLM/CAE su Azure; Microsoft elenca, tra l'altro, linee guida architetturali per Siemens NX su Azure Virtual Desktop con VM GPU e Ansys Discovery su VM GPU [2] |

La [messa in servizio virtuale](https://www.m365.fm/entity/virtual-commissioning/) collega il gemello ingegneristico e quello di simulazione: il codice di controllo viene testato su un modello dell'impianto prima che l'attrezzatura reale esista.

### Azure Digital Twins o Fabric?

Microsoft stessa sottolinea che digital twin builder in Fabric è un prodotto diverso da Azure Digital Twins [14], [15]. Le differenze pratiche:

| Criterio | Azure Digital Twins | Fabric digital twin builder |
|---|---|---|
| Stato | Attivo, nessun avviso di ritiro nella pagina di panoramica [14] | Anteprima [15] |
| Modellazione | DTDL (Digital Twins Definition Language), versione 3 [14] | Ontologia con tipi di entità e relazioni [15] |
| Archiviazione | Grafo di gemelli proprio; storico tramite data history in Azure Data Explorer [14] | OneLake; i dati devono prima trovarsi in un lakehouse Fabric [15] |
| Integrazione | Route degli eventi verso Event Hubs, Event Grid, Service Bus [14] | Nativa in Fabric Real-Time Intelligence, Power BI |
| Pubblico | Team di sviluppo, orientato alle API | Team dati e business, low-code |
| Visualizzazione | 3D Scenes Studio (anteprima) [14] | Esperienze Fabric, Power BI |

**Raccomandazione:** Se la tua piattaforma dati è Fabric e ti servono gemelli analitici per KPI e analisi delle cause radice, tieni d'occhio digital twin builder e l'ontologia di Fabric IQ e avviane un pilota, ma non far dipendere il tuo modello dati da una preview. Microsoft non ha ancora documentato come evolveranno i due componenti di Fabric l'uno rispetto all'altro; l'ontologia ha già subito un cambiamento di esperienza con migrazione obbligatoria [16]. Se oggi stai costruendo un'applicazione gemello di produzione basata su API, Azure Digital Twins è il servizio generalmente disponibile. In ogni caso, conserva una copia della tua ontologia in un formato neutrale rispetto agli strumenti.

### Da dove iniziare?

L'errore più comune è iniziare dalla visualizzazione 3D. Inizia da una domanda a cui il gemello deve rispondere, ad esempio "Quali ordini sono interessati se la stazione 20 si ferma?". Questa domanda definisce le entità e le relazioni di cui hai bisogno. Mirko Peters descrive questo approccio in [Digital Twin in Manufacturing: Where to Start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/) e il percorso dall'ERP a un gemello del reparto produttivo in [From ERP to Shop Floor: Building the Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/). Discutiamo l'implementazione tecnica su Azure nell'episodio [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/).

---

## Caso d'uso 4: KPI in tempo reale, OEE e flussi di valore

I KPI in tempo reale sono spesso il modo più rapido per ottenere valore da un collegamento con il reparto produttivo. Non richiedono AI, ma richiedono un modello di stato pulito.

### Calcolare correttamente l'OEE

L'efficienza complessiva delle apparecchiature (OEE) è il prodotto di disponibilità, prestazione e qualità. La formula è semplice; le definizioni no:

- **Disponibilità:** Quali fermi contano come pianificati (pause, manutenzione programmata, nessun ordine)? Questa decisione può spostare l'OEE di molti punti percentuali.
- **Prestazione:** Quale tempo ciclo è il riferimento: il valore di progetto, il miglior tempo ciclo raggiunto o lo standard nell'ERP?
- **Qualità:** Il rilavorato conta come pezzo buono o pezzo scarto?

Concorda queste definizioni tra gli stabilimenti prima di costruire una dashboard. Altrimenti gli stabilimenti confronteranno numeri non confrontabili.

### Architettura per KPI in tempo reale

1. Gli stati delle macchine e i contatori dei pezzi fluiscono tramite OPC UA nel broker [4].
2. Un data flow mappa gli stati su un modello di stato uniforme (mappatura dei codici specifici di ciascuna macchina) [3].
3. L'Eventhouse calcola KPI mobili per stazione, linea e turno con KQL.
4. Una Real-Time Dashboard serve il reparto produttivo; Power BI serve i report direzionali [17].
5. Activator genera avvisi quando i valori scendono sotto le soglie [17].

### La mappa del flusso del valore come modello dati in tempo reale

La mappatura del flusso del valore è tradizionalmente un esercizio su carta. Se colleghi le caselle di processo di un flusso del valore a dati in tempo reale, ottieni un modello dati semplice ma efficace: lead time, scorte tra i processi, tempi ciclo e colli di bottiglia diventano misurabili. L'episodio [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) mostra come funziona nella pratica. Per la pianificazione di dettaglio basata su questi dati entrano in gioco i sistemi di [pianificazione e schedulazione avanzate](https://www.m365.fm/entity/advanced-planning-and-scheduling/); vedi la nostra guida a [production scheduling e APS](https://www.m365.fm/en/learn/production-scheduling-aps/). Come questi numeri vengono usati nelle riunioni quotidiane di tier è l'argomento della nostra guida al [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/).

### Catalogo iniziale dei KPI

| KPI | Fonte dati | Granularità |
|---|---|---|
| OEE e suoi fattori | Stato macchina, contatori, risultati di qualità | Stazione, turno |
| Lead time | Eventi di ordine (inizio/fine per operazione) | Ordine, prodotto |
| Lavoro in corso | Registrazioni di giacenza, scansioni | Buffer, linea |
| Consegna puntuale | ERP (data richiesta vs. data effettiva) | Cliente, gruppo di prodotti |
| MTBF / MTTR | Fermi, ordini di manutenzione | Asset |
| Energia per pezzo buono | Contatori energetici, conteggio pezzi | Linea, prodotto |
| First pass yield | Risultati di ispezione | Operazione |

---

## Integrazione ERP e MES

I dati del reparto produttivo privi del contesto di ordine e materiale sono misurazioni, non informazioni. L'integrazione con ERP e MES determina il valore dell'intera piattaforma.

### Quale sistema è il sistema di riferimento?

| Oggetto dati | Sistema di riferimento (tipico) | Ruolo della piattaforma Azure |
|---|---|---|
| Materiale, distinta base, ciclo di lavorazione | ERP / PLM | Copia per l'arricchimento, nessuna manutenzione |
| Ordine di produzione (pianificazione) | ERP / APS | Copia; feedback di stato come evento |
| Esecuzione delle operazioni, conferme | MES | Eventi nell'UNS, storico in Fabric |
| Stati macchina, valori di processo | Controllore / edge | Fonte primaria dei dati |
| Ordini di manutenzione | Manutenzione ERP / CMMS | Attivati dalle previsioni, storico per le etichette |
| Rilievi di qualità | QMS / MES | Collegati ai dati di processo |

### Integrazione con SAP

Esistono diversi modi per portare i dati SAP in Fabric: connettori di Data Factory, soluzioni di open mirroring di partner e "SAP Business Data Cloud Connect for Microsoft Fabric", che intende rendere disponibili i prodotti dati SAP in OneLake senza copiarli; la disponibilità generale per quest'ultimo è stata annunciata per il terzo trimestre del 2026 [44]. Al momento della stesura non siamo riusciti a confermare l'effettiva disponibilità generale [unverified: stato di rilascio non confermato da fonti ufficiali alla data di stesura]; verificate lo stato attuale e i requisiti di licenza lato SAP prima di pianificare. Per l'integrazione con il reparto produttivo di SAP Digital Manufacturing, DSAG (il gruppo utenti SAP di lingua tedesca) ha pubblicato nell'aprile 2026 la guida "SAP DM Shopfloor Integration"; la pagina di sintesi è disponibile in inglese. Secondo la sua introduzione, copre architettura, strutture e modelli dei dati, scalabilità, template, modello operativo e approvvigionamento; il testo completo è riservato ai membri DSAG [48]. Regola fondamentale: le conferme verso SAP passano attraverso il MES o API definite, non direttamente dalla piattaforma dati.

### Dynamics 365

Se utilizzate Dynamics 365 Supply Chain Management, ne traete vantaggio grazie alla sua vicinanza all'ecosistema Microsoft: con "Link to Microsoft Fabric", i dati Dataverse, incluse alcune tabelle selezionate di finanza e operazioni, possono essere resi disponibili in Fabric senza una vostra pipeline ETL dedicata [45]. Microsoft descrive la propria offerta per il manifatturiero come una combinazione di funzionalità di Dynamics 365, Microsoft 365 e Azure [1].

### Historian e SCADA esistenti

Molti stabilimenti statunitensi dispongono già di un historian di processo accanto allo SCADA. Trattatelo come una sorgente, non come qualcosa da sostituire: l'historian continua a servire gli operatori e gli ingegneri di processo a livello locale, mentre la piattaforma Azure acquisisce either i segnali grezzi dallo strato OPC UA oppure i dati curati dall'historian. Decidete per ogni segnale quale percorso sia il sistema di riferimento per lo storico, in modo da non archiviare e pagare due volte la stessa serie temporale, e verificate con il fornitore dell'historian quali interfacce e licenze si applicano prima di progettare il flusso dei dati.

### Il flusso dei dati di reparto verso l'ERP

Uno schema comune:

1. L'ERP rilascia un ordine; l'evento "ordine rilasciato" arriva nell'UNS.
2. Il MES avvia un'operazione; l'evento "operazione avviata" riporta postazione e ordine.
3. I dati macchina vengono arricchiti nel flusso dati con il numero d'ordine corrente.
4. Il MES conferma quantità e tempi; l'ERP li registra.
5. Fabric unisce tutti gli eventi in uno storico d'ordine completo per analisi e tracciabilità.

---

## IA e Copilot nella produzione manifatturiera

L'IA generativa è arrivata nel settore manifatturiero, ma in modo diverso da quanto previsto nel 2024. Microsoft ha ritirato nel 2025 le anteprime di agenti specifici per la produzione (Factory Operations Agent, Factory Safety Agent) [2] e si affida invece a componenti generali della piattaforma: Microsoft Foundry per agenti e modelli [20], Copilot in Fabric per le domande sui dati [17], e Copilot Studio e Microsoft 365 Copilot per gli scenari di lavoro d'ufficio. Al Ignite 2025 sono arrivati in anteprima Fabric IQ e Foundry IQ, destinati a fornire agli agenti rispettivamente un livello semantico e una base di conoscenza [34]. Anche la prospettiva del ciclo di vita vale qui: prompt flow, uno strumento molto usato per le prime applicazioni con LLM in Foundry e Azure Machine Learning, verrà ritirato il 20 aprile 2027; Microsoft raccomanda la migrazione verso il Microsoft Agent Framework [37].

### Scenari realistici

| Scenario | Componenti | Prerequisito |
|---|---|---|
| Domande in linguaggio naturale sui dati di produzione ("Perché ieri la linea 3 è stata più lenta?") | Copilot in Fabric, agenti dati di Fabric, ontologia [16], [17] | Modello dati pulito, nomi comprensibili di tabelle e colonne, KPI definiti |
| Riepilogo dei passaggi di consegne di turno e dei rapporti di incidente | Microsoft 365 Copilot, Teams, Copilot Studio | Acquisizione strutturata, ad esempio tramite Power Apps o moduli di Teams |
| Assistente per la manutenzione (ricerca in manuali e storico guasti) | Microsoft Foundry con retrieval, Copilot Studio | Documenti digitali e aggiornati, permessi mantenuti |
| Ispezione visiva della qualità | Modelli di computer vision, inferenza sul edge | Dati immagine etichettati (strumento di etichettatura di terze parti, poiché l'etichettatura dei dati di Azure ML è stata ritirata [38]), illuminazione stabile |
| Assistente alla pianificazione (confronto di scenari) | Applicazione industriale (APS, simulazione) più IA | Un modello di pianificazione valido |

### Microsoft 365 come ponte verso il reparto produttivo

Per le organizzazioni che già utilizzano Microsoft 365, la leva più importante nel breve termine spesso non si trova affatto in Azure, ma nel collegare gli eventi del reparto produttivo al lavoro d'ufficio:

- **Teams per il personale di linea:** comunicazione di turno, attività, notifiche da Activator o Power Automate direttamente in Teams [17].
- **Power BI:** report KPI per la direzione e per la leadership dello stabilimento, costruiti sugli stessi dati di Fabric.
- **Power Apps:** acquisizione dei motivi di fermo, dei rilievi di qualità e dei feedback di manutenzione su tablet alla postazione di lavoro. Questo crea esattamente le etichette di cui ha bisogno la manutenzione predittiva.
- **Copilot:** riepiloghi dei rapporti di turno, analisi degli scostamenti e note delle riunioni della gestione di reparto.
- **Chiarire le licenze per tempo:** il personale di linea riceve tipicamente licenze frontline (Microsoft 365 F1 o F3). Prima del rollout verificate quali funzionalità includono, come Power Apps o Copilot, e quali licenze aggiuntive servono; altrimenti un buon pilota si arena su larga scala.

### Limiti e governance

- **Nessuna decisione di controllo affidata ai modelli linguistici.** I modelli linguistici servono per l'assistenza, non per il ciclo di controllo chiuso di una macchina.
- **Usare un framework di gestione del rischio.** Il **NIST AI Risk Management Framework (AI RMF 1.0)**, rilasciato il 26 gennaio 2023, è un framework volontario organizzato attorno a quattro funzioni: Govern, Map, Measure e Manage [63]. È un modo pratico per documentare i rischi dell'IA nell'ispezione della qualità o nella pianificazione, per clienti e auditor.
- **EU AI Act per le operazioni nell'UE:** se gestite sistemi di IA in stabilimenti UE o vendete prodotti abilitati all'IA in quell'area, verificate se un sistema è usato come componente di sicurezza di un prodotto o per la gestione dei lavoratori; possono derivarne obblighi per i sistemi ad alto rischio. Il "Digital Omnibus on AI" (Regolamento (UE) 2026/1744, in vigore dalla fine di luglio 2026) ha posticipato queste scadenze: al 2 dicembre 2027 per i sistemi ad alto rischio autonomi (ad esempio nelle risorse umane) e al 2 agosto 2028 per i sistemi incorporati in prodotti. L'IA nelle macchine sarà regolata tramite atti delegati ai sensi del Regolamento UE sulle macchine [46]. La classificazione del vostro specifico sistema richiede una verifica legale.
- **Forza lavoro e relazioni di lavoro:** i sistemi in grado di valutare le prestazioni o il comportamento dei dipendenti sollevano questioni di diritto del lavoro. Negli stabilimenti statunitensi sindacalizzati, verificate se il vostro contratto collettivo copre il monitoraggio delle prestazioni; negli stabilimenti tedeschi, tali sistemi richiedono in genere l'accordo del consiglio di fabbrica (Betriebsrat), che ha diritti di co-decisione. In ogni caso, coinvolgete per tempo i rappresentanti dei lavoratori.
- **Permessi:** Copilot mostra ciò che un utente è autorizzato a vedere. Una condivisione eccessivamente ampia in SharePoint o Fabric diventa visibile attraverso l'IA.

---

## FinOps per l'IT manifatturiero

I costi cloud nel settore manifatturiero si comportano in modo diverso rispetto ai carichi di lavoro IT classici: i volumi di dati crescono con ogni macchina connessa, i carichi girano 24 ore su 24 e una parte dell'infrastruttura si trova in stabilimento. FinOps aiuta a rendere questi costi prevedibili e a collegarli al valore generato. L'episodio [FinOps for Manufacturing IT](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/) tratta le specificità del settore.

### Il FinOps Framework in breve

Le linee guida FinOps di Microsoft si basano sul framework della FinOps Foundation [25]. Esso comprende sei principi (tra cui "I team devono collaborare", "Il valore aziendale guida le decisioni tecnologiche" e "Sfruttare il modello di costo variabile del cloud"), tre fasi del ciclo di vita (Inform, Optimize, Operate) e quattro domini [25]:

| Dominio | Che cosa significa per il manifatturiero |
|---|---|
| Comprendere utilizzo e costi | Rendere visibili i costi per stabilimento, linea e caso d'uso (tagging, capacità o workspace Fabric separati) |
| Quantificare il valore aziendale | Costo per pezzo conforme, per macchina connessa o per ora di fermo evitata |
| Ottimizzare utilizzo e costi | Ridurre il volume dei dati all'edge, differenziare la retention per livelli, dimensionare correttamente le capacità |
| Gestire la pratica FinOps | Responsabilità, policy, addebito interno agli stabilimenti (chargeback) |

Il framework raccomanda di valutare la maturità per singola capacità anziché in modo uniforme, e di rivederla ogni tre-sei mesi [25].

### Le dieci leve di costo più importanti

1. **Aggregare all'edge:** Non tutti i valori a risoluzione di un secondo devono arrivare al cloud. I flussi di dati possono filtrare e aggregare [3]. È la leva singola più importante.
2. **Inviare solo al cambiamento:** Per impostazione predefinita il connettore OPC UA invia solo i valori modificati e aggiunge periodicamente key frame con tutti i valori, così che i consumer possano ricostruire lo stato [4]. Verificate inoltre le deadband nel controllore o nel server OPC UA, in modo che il rumore non venga conteggiato come cambiamento.
3. **Consolidare gli Eventstream:** Per stabilimento anziché per sorgente, con le trasformazioni nell'Eventhouse [31].
4. **Differenziare la retention per livelli:** I dati "hot" nella cache dell'Eventhouse per giorni o settimane, i dati più vecchi nello storage OneLake.
5. **Dimensionare deliberatamente la capacità Fabric:** Monitorare l'utilizzo con l'app Capacity Metrics, separare i carichi di sviluppo da quelli di produzione, sospendere le capacità non necessarie. La sospensione è documentata per gli SKU F; quando si sospende, i superamenti accumulati vengono fatturati immediatamente e il contenuto della capacità non è disponibile [47]. Una capacità che serve un Eventstream o una dashboard di stabilimento non è quindi un candidato alla sospensione.
6. **Scegliere lo SKU edge giusto:** Dalla release 2610, Azure IoT Operations offre accanto allo SKU Standard un SKU Essentials a costo inferiore per implementazioni ad alto volume, limitato a cluster a nodo singolo e senza il connettore OPC UA [3]. È adatto, per esempio, a siti i cui dati arrivano già via MQTT o HTTP. Verificate per sito quali funzionalità servono davvero.
7. **Usare prenotazioni e savings plan** per le risorse Azure che girano in modo continuo.
8. **Allocare i costi:** Imporre tag per stabilimento, centro di costo e caso d'uso (Azure Policy).
9. **Introdurre l'economia unitaria:** Riportare il costo cloud per unità prodotta o per macchina connessa. Solo così è possibile confrontare gli stabilimenti.
10. **Dismettere il legacy:** Migrare i servizi in via di dismissione (IoT Central, IoT Edge 1.5) prima che le strutture parallele raddoppino i costi.

### Non dimenticare i costi edge

L'hardware di stabilimento, le operazioni Kubernetes, le licenze per i servizi abilitati Azure Arc e il personale per gli aggiornamenti devono rientrare nello stesso calcolo. Un business case che guarda solo la fattura Azure sottostima sistematicamente il costo totale. Questa guida non riporta volutamente prezzi, perché cambiano spesso; i modelli di prezzo attuali per Azure IoT Operations (Standard ed Essentials), Azure Arc e Azure Local si trovano nelle pagine dei prezzi di Azure e nel calcolatore dei prezzi di Azure.

---

## Costruire il business case per Azure nel manifatturiero

Le affermazioni generiche sui benefici tratte da studi di settore raramente aiutano a ottenere l'approvazione del budget, perché non tengono conto del vostro punto di partenza. Una logica di calcolo che potete alimentare con i vostri numeri è più solida.

### Categorie di benefici

| Categoria | Calcolo | Fonte dei dati |
|---|---|---|
| Fermi non pianificati evitati | Ore di fermo × margine di contribuzione per ora × riduzione attesa | Storico fermi MES, finanza |
| OEE più elevato | Pezzi buoni aggiuntivi × margine di contribuzione per pezzo | Baseline OEE |
| Minori costi di scarto e rilavorazione | Quantità scartata × costo di produzione × riduzione | QMS |
| Gestione più rapida dei reclami | Ore per reclamo × tariffa oraria × riduzione; ambito di richiamo più ridotto | Storico reclami |
| Costi di manutenzione | Scorte di ricambi, servizi di appaltatori, straordinari | Manutenzione ERP |
| Conformità | Sforzo evitato per le evidenze manuali (audit, richieste FSMA 204, valutazioni CMMC, DPP) | Team qualità e conformità |

### Categorie di costo

- Hardware edge e relativa gestione per stabilimento
- Consumo di Azure e Fabric (ricorrente)
- Licenze (Power BI, Copilot, applicazioni di settore, sicurezza OT dove necessaria)
- Implementazione (interna ed esterna)
- Gestione del cambiamento e formazione
- Sensori di retrofit per macchine più vecchie

### Esempio svolto con numeri fittizi

Una linea registra 120 ore annue di fermo non pianificato e il margine di contribuzione è di 1.600 dollari l'ora. Se il monitoraggio delle condizioni e una risposta più rapida evitano il 20 percento di tali ore, si ottengono 24 ore × 1.600 dollari = 38.400 dollari all'anno. A fronte di questo vanno considerati i costi allocati: hardware edge e relativa gestione, consumo di Fabric, licenze e ore interne. I numeri sono volutamente semplici. Ciò che conta è che ogni ipotesi abbia una fonte interna all'azienda (storico MES, finanza) e che la riduzione venga misurata rispetto alla baseline dopo tre o sei mesi.

### Regola pratica per la definizione delle priorità

Iniziate dal caso d'uso in cui si verificano tre condizioni: una baseline misurabile, dati disponibili e un responsabile di processo che desideri utilizzare i risultati. Più spesso si tratta dell'OEE in tempo reale o della tracciabilità, piuttosto che della manutenzione predittiva.

---

## Roadmap: cinque fasi verso una piattaforma Azure manifatturiera scalabile

La roadmap seguente segue lo schema comune "prima la base e un caso d'uso pilota, poi la scalabilità". Le durate sono indicative per un primo stabilimento e dipendono fortemente dal punto di partenza, dalle approvazioni di rete e dalle risorse disponibili.

### Fase 1: Chiarezza (da 4 a 8 settimane)

- Portafoglio dei casi d'uso con stime dei benefici; selezione di uno o due casi d'uso pilota
- Stato attuale: parco macchine, protocolli (OPC UA è disponibile?), rete, sistemi esistenti
- Modello dati di riferimento (gerarchia ISA-95, convenzione dei topic UNS)
- Concetto di sicurezza che copra la sicurezza OT, il profilo CSF 2.0, l'ambito CMMC ove rilevante, la privacy e i rappresentanti dei lavoratori
- Verifica del ciclo di vita di tutti i servizi rispetto alla tabella di stato di questa guida

### Fase 2: Fondamenta (da 6 a 12 settimane)

- Infrastruttura edge nello stabilimento pilota, connessione Arc, Azure IoT Operations
- Struttura dell'area di lavoro Fabric, pianificazione della capacità, modello di accesso
- Primi macchinari connessi tramite OPC UA, asset in Azure Device Registry
- Basi di FinOps: tag, budget, report dei costi per stabilimento

### Fase 3: Primo valore (da 8 a 12 settimane)

- Caso d'uso pilota in produzione, ad esempio OEE in tempo reale con acquisizione delle cause di fermo in una Power App
- Dashboard di reparto e report direzionale
- Misurazione della baseline e del primo impatto

### Fase 4: Approfondimento (da 3 a 6 mesi)

- Integrazione del contesto ERP e MES, storico ordini e genealogia
- Monitoraggio delle condizioni, raccolta di etichette per la manutenzione predittiva
- Primi scenari Copilot su dati curati

### Fase 5: Scalabilità (dal mese 9 al mese 15, in base all'avanzamento)

- Estensione a più linee e stabilimenti con infrastruttura come codice e GitOps
- KPI interstabilimento con definizioni uniformi
- Manutenzione predittiva per asset selezionati, scenari di gemello digitale
- Modello operativo: team di piattaforma, responsabili dei prodotti dati per dominio, gestione dei rilasci per le release di Azure IoT Operations, generalmente mensili [7]

Il passaggio fondamentale è dal proof of concept al minimum viable product: un PoC dimostra che la tecnologia funziona. Un MVP dimostra che le persone lavorano meglio con essa. Se volete ancorare questo passaggio a un programma più ampio di miglioramento, consultate le nostre guide su [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) e [operational excellence](https://www.m365.fm/en/learn/operational-excellence/).

---

## Errori comuni nei progetti Azure per la manifattura

1. **La tecnologia prima della domanda:** costruire una piattaforma senza un'unità di business che voglia risolvere un problema specifico.
2. **Preview come fondamento:** basare la logica di business su servizi in preview. Il ritiro di Manufacturing data solutions e degli factory agent mostra il rischio [2].
3. **Building block obsoleti tratti da guide vecchie:** pianificare nuovi progetti su IoT Central, Time Series Insights o IoT Edge 1.5 perché un articolo del 2021 li raccomanda [8], [10], [12].
4. **SKU sbagliato:** pianificare Azure IoT Operations Essentials per uno stabilimento con macchine OPC UA, sebbene lo SKU non includa il connettore OPC UA [3].
5. **Nessun modello di stato:** recepire i codici di stato specifici delle macchine senza filtrarli. I confronti tra stabilimenti diventano impossibili.
6. **Tutto nel cloud:** inviare dati grezzi a piena risoluzione e restare sorpresi dalla fattura.
7. **Sicurezza OT come ripensamento:** collegare un cluster edge alla rete senza un concetto di zone e lasciare aperto l'accesso in scrittura ai controller.
8. **Dimenticare le etichette:** avviare la manutenzione predittiva senza uno storico strutturato dei guasti.
9. **KPI senza definizioni:** costruire dashboard OEE prima che gli stabilimenti abbiano concordato le definizioni di disponibilità.
10. **Sottovalutare le operazioni:** rilasci regolari, aggiornamenti di Kubernetes, rotazione dei certificati e un buffer del broker che può essere impostato solo al deployment iniziale [40], senza che nessuno ne sia responsabile.
11. **Lasciare indietro le persone:** i collaboratori del reparto produzione apprendono del progetto quando il tablet viene montato sulla loro postazione.
12. **Ignorare l'ambito di conformità:** trasferire disegni o specifiche di parti per la difesa in un'area di lavoro Fabric condivisa senza una decisione di scoping CMMC.

---

## Applicazioni industriali nell'ecosistema Microsoft

> **Nota: l'autore lavora presso iFAKT GmbH.**

Una piattaforma costruita su Azure IoT Operations e Fabric fornisce dati, ma non logica di business per la pianificazione, i flussi di valore o la simulazione. Le applicazioni industriali disponibili tramite Microsoft AppSource o Microsoft Marketplace colmano questa lacuna.

Un esempio è [Polaris](https://www.m365.fm/entity/polaris/) di [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), una società di software con sede a Stoccarda, in Germania. Il fornitore descrive Polaris come un software per digitalizzare, simulare e ottimizzare la produzione, con i moduli VSM/BSM (modellazione del flusso di valore e delle swimlane), Simulator, Optimizer (pianificazione), Operator e Analyzer (analisi dei KPI). Secondo il fornitore, la pianificazione è basata sui vincoli e considera risorse, qualifiche, turni e buffer; un cockpit KPI mostra lead time, scorte, utilizzo e consegna puntuale. Polaris VSM è elencato come offerta SaaS nel Microsoft Marketplace [33]; Microsoft ha presentato iFAKT come parte del suo programma "ISV Success for Business Applications" [32]. La nostra guida a [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) descrive il prodotto in modo più dettagliato.

Nell'architettura di questa guida, un'applicazione del genere si colloca nei livelli da 6 a 8: utilizza i dati di processo e di ordine per modellare i flussi di valore, simulare scenari e ottimizzare i piani. Come appare un'integrazione concreta con la propria piattaforma dati è qualcosa da chiarire con il fornitore; questo articolo non formula alcuna affermazione al riguardo.

Indipendentemente dal fornitore, quattro domande aiutano nella selezione di queste applicazioni: l'applicazione legge i dati da formati aperti (ad esempio tabelle Delta in OneLake o eventi dal broker), oppure richiede le proprie interfacce? Quale sistema è il system of record per i dati anagrafici come cicli di lavorazione e capacità? Dove vengono eseguiti dati e calcoli (regione, tenant)? E come i risultati, ad esempio un piano ottimizzato, tornano nell'ERP o nel MES in modo controllato?

---

## FAQ

### Che cos'è Azure per il manifatturiero?

Azure per il manifatturiero è l'insieme dei servizi cloud ed edge di Microsoft che i produttori usano per collegare gli stabilimenti, archiviare e analizzare i dati di produzione e costruire sopra di essi applicazioni di intelligenza artificiale e per l'ambiente di lavoro. Nel 2026 il nucleo è costituito da Azure IoT Operations su Kubernetes abilitato per Azure Arc nello stabilimento, da Microsoft Fabric come piattaforma dati e da Foundry, Power BI e Copilot per analisi e intelligenza artificiale [3], [17]. Microsoft presenta la sua offerta per il settore come "Microsoft for Manufacturing", che combina Azure, Dynamics 365 e Microsoft 365 [1].

### Qual è la differenza tra Azure IoT Hub e Azure IoT Operations?

IoT Hub è un servizio cloud a cui i singoli dispositivi si collegano direttamente. Azure IoT Operations è un data plane che gira nello stabilimento su Kubernetes abilitato per Azure Arc e collega le macchine tramite OPC UA e altri connettori a un broker MQTT locale [3]. Per gli stabilimenti con molte macchine, Azure IoT Operations è di norma il punto di partenza più adatto; IoT Hub si adatta a dispositivi distribuiti e collegati direttamente. Per i compromessi rispetto a IoT Edge, vedere [Azure IoT Edge vs Azure IoT Operations: Choosing the Right Industrial Architecture](https://www.m365.fm/community/u/mirko-p/blog/azure-iot-edge-vs-azure-iot-operations/).

### Azure IoT Central viene dismesso?

Sì. Dal 23 settembre 2026 non è più possibile creare nuove applicazioni IoT Central; quelle esistenti continueranno a funzionare fino al 20 settembre 2029. Microsoft raccomanda come destinazione IoT Hub con Device Provisioning Service, Azure Device Registry e Microsoft Fabric; dashboard e analisi passano a Fabric Real-Time Intelligence [8], [64]. Un avviso di dismissione per il 31 marzo 2027 comparso nel portale Azure nel febbraio 2024 è stato ritirato da Microsoft all'epoca come messaggio di sistema errato [9]. L'annuncio del 2026, invece, è un avviso regolare con un periodo di transizione di tre anni.

### Cosa ha sostituito Azure Time Series Insights?

Time Series Insights è stato dismesso il 7 luglio 2024. Microsoft indica come destinazione della migrazione l'Eventhouse in Microsoft Fabric Real-Time Intelligence [10]. Se non si usa Fabric, Azure Data Explorer è un'alternativa che utilizza anch'essa KQL [19].

### Che fine ha fatto Microsoft Cloud for Manufacturing?

L'offerta per il settore si chiama ora "Microsoft for Manufacturing" e raggruppa funzionalità di Azure, Dynamics 365 e Microsoft 365 [1]. Le anteprime specifiche "Manufacturing data solutions" e "Factory Operations Agent" sono state ritirate il 30 maggio 2025, e "Factory Safety Agent" il 23 giugno 2025 [2]. Non esiste un avviso separato per "Manufacturing data solutions in Microsoft Fabric"; non includerlo nella pianificazione di nuovi progetti.

### Quali servizi Azure servono per una smart factory?

Per un tipico collegamento di stabilimento: Azure Arc e un cluster Kubernetes nello stabilimento, con sopra Azure IoT Operations (broker, connettore OPC UA, data flow), Azure Device Registry per gli asset, Microsoft Fabric con Eventstream, Eventhouse e Activator per i dati in tempo reale, e Power BI per la reportistica [3], [17]. I building block per l'intelligenza artificiale (Fabric Data Science, Azure Machine Learning, Microsoft Foundry) e i gemelli digitali arrivano in un secondo momento. Entra ID, Azure Policy, Cost Management e una soluzione di sicurezza OT costituiscono la cornice.

### Qual è la differenza tra Azure IoT Operations Essentials e Standard?

Standard offre l'intera gamma di funzionalità. Essentials, disponibile dalla release 2610, è un'opzione a costo inferiore per distribuzioni ad alto volume; funziona solo su cluster a nodo singolo e non include il connettore OPC UA [3]. Per gli stabilimenti con macchine OPC UA, il punto di partenza è Standard.

### Servono competenze Kubernetes per Azure IoT Operations?

Sì, almeno per la gestione operativa. Azure IoT Operations gira su cluster Kubernetes abilitati per Azure Arc ed è configurato secondo la logica di Kubernetes [3]. Per iniziare, Microsoft documenta le installazioni su Ubuntu e su Windows con AKS Edge Essentials [3]. Prevedere lo sviluppo delle competenze o un partner per le operazioni.

### La produzione continua se la connessione internet si interrompe?

Secondo Microsoft, Azure IoT Operations può funzionare offline per un massimo di 72 ore, eventualmente con prestazioni ridotte, e riprende la piena funzionalità quando si riconnette [3]. Quanti messaggi vengono memorizzati nel buffer in quel periodo dipende dalla configurazione del broker, definita al momento della distribuzione iniziale [40]. Le funzioni di controllo non devono mai dipendere dal cloud; il controllo resta nei PLC e nei sistemi locali.

### Azure Digital Twins o digital twin builder in Fabric?

Azure Digital Twins è un servizio generalmente disponibile con modelli DTDL e accesso tramite API [14]. Digital twin builder fa parte di Fabric Real-Time Intelligence, lavora con ontologie sui dati di OneLake ed è in anteprima [15]. Per gli twin di produzione sviluppati dagli sviluppatori, Azure Digital Twins è oggi la scelta sicura; per gli twin analitici su una piattaforma Fabric, vale la pena avviare un pilota con digital twin builder. Mirko Peters illustra una distinzione correlata, tra il device twin in IoT Hub e Azure Digital Twins, in [Device Twin vs Azure Digital Twins: Choosing the Right Layer for Industrial IoT](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/).

### Quali dati servono per la manutenzione predittiva?

Variabili di condizione a una frequenza di campionamento adeguata, timestamp sincronizzati, contesto operativo (ordine, prodotto, stato della macchina) e, soprattutto, uno storico guasti etichettato proveniente dalla manutenzione. Senza uno storico dei guasti, all'inizio è possibile solo il rilevamento delle anomalie.

### Che cosa significa il ritiro di Defender for IoT per la sicurezza OT?

Il 2 novembre 2026 Microsoft ha annunciato ufficialmente che ritirerà completamente il componente di sicurezza OT di Defender for IoT nell'ottobre 2029; fino ad allora sono previsti solo aggiornamenti di sicurezza e correzioni di bug [22]. Un blog di un partner Microsoft indica invece il 31 maggio 2028 come fine del supporto [39]. Non esiste una sostituzione di prima parte; Microsoft offre connettori per Armis, Dragos e Forescout, le cui soluzioni sono concesse in licenza separatamente [22]. Pianificate la sostituzione in modo che sia completata prima di metà 2028.

### IoT Edge vale ancora la pena di essere utilizzato?

IoT Edge come prodotto è ancora supportato. La versione 1.5 LTS ha raggiunto la fine del supporto il 10 novembre 2026; l'attuale versione 1.6 LTS è supportata fino al 14 novembre 2028 [12]. Per le flotte di dispositivi Linux esistenti, l'aggiornamento alla 1.6 è la strada diretta. Per i dispositivi Windows con EFLOW 1.5, la pagina delle versioni non elenca alcuna EFLOW 1.6 LTS; chiarite lì il percorso di destinazione. Per i nuovi piani dati di stabilimento, valutate Azure IoT Operations.

### Azure è conforme a CMMC?

Non esiste una certificazione CMMC per Azure in quanto tale, perché CMMC si applica ai sistemi di un appaltatore, non a una piattaforma cloud [55]. Microsoft afferma che Azure e Azure Government possiedono entrambi autorizzazioni FedRAMP High che coprono NIST SP 800-171, che è possibile ottenere la certificazione CMMC per le soluzioni in entrambi i cloud e che la maggior parte degli appaltatori della difesa è meglio allineata con Azure Government [55]. La norma DFARS che inserisce i requisiti CMMC nei contratti del DoD è in fase di implementazione graduale dal 10 novembre 2025 [54].

### Quale framework di sicurezza dovrebbe usare un produttore statunitense per Azure e OT?

Usateli insieme. NIST CSF 2.0 vi fornisce la struttura di governance e un linguaggio comune con il management, le assicurazioni e i clienti [49]; ISA/IEC 62443 vi fornisce il modello tecnico per l'OT (zone, condotti, livelli di sicurezza) [27]; NIST SP 800-82 Rev. 3 collega i due con indicazioni specifiche per l'OT e overlay di controllo [50]. Aggiungete CMMC se gestite FCI o CUI per il DoD [53], e NIS2 per gli stabilimenti UE [41].

### Quanto costa Azure per il manifatturiero?

Non esiste una cifra complessiva affidabile. I costi dipendono dal numero di stabilimenti e macchine, dal volume dei dati, dalla conservazione, dalla capacità Fabric scelta, dall'hardware edge e dalle licenze. La leva più importante è l'aggregazione dei dati sull'edge. Usate il calcolatore dei prezzi di Azure e introducete le pratiche FinOps dalla fase 2 in poi [25].

### Che ruolo ha Microsoft 365 nel manifatturiero?

Microsoft 365 è il livello di lavoro quotidiano: Teams per la comunicazione di turno e le notifiche, Power BI per i KPI, Power Apps per l'acquisizione dei dati alla postazione di lavoro e Copilot per riepiloghi e domande sui dati. Per le aziende con un ambiente Microsoft 365 consolidato, questo collegamento è spesso il modo più rapido per rendere utilizzabili i dati del reparto produttivo.

### Da dove iniziare come amministratore di Microsoft 365 o Azure?

Dalle attività che spettano comunque all'IT centrale: ruoli Entra ID per il personale OT e i partner, una landing zone Azure con criteri di tag per stabilimento, un cluster di test Arc comprensivo delle approvazioni del firewall attraverso la catena dei proxy, e una struttura di workspace Fabric. In parallelo, incontrate il responsabile OT per comprendere il modello a zone dello stabilimento. I dettagli sono nella sezione "Da dove iniziare come amministratore di Microsoft 365 o Azure" all'inizio di questa guida.

---

## Conclusione

Azure per il manifatturiero nel 2026 è meno una questione di scelta dei servizi e più una questione di disciplina. La base tecnica è chiara: Azure IoT Operations on Arc in stabilimento, Microsoft Fabric come piattaforma dati e Foundry, Power BI e Copilot per l'analisi e l'ambiente di lavoro. Allo stesso tempo, il ritiro di Time Series Insights e delle anteprime per il manifatturiero, e il ritiro pianificato di IoT Central e della sicurezza OT in Defender for IoT, mostrano che la gestione del ciclo di vita fa parte del lavoro di architettura.

Tre elementi fanno la differenza: un proprio modello dati indipendente dagli strumenti, basato su ISA-95, un progetto di sicurezza basato su ISA/IEC 62443 e NIST CSF 2.0 che copra anche CMMC o NIS2 dove applicabili, e un'attenzione costante a casi d'uso con una baseline misurata. Se si lavora in questo modo, si costruisce una piattaforma che serve manutenzione predittiva, tracciabilità, gemelli digitali e AI a partire dalle stesse fondamenta dati, e che sopravvive al prossimo cambio di nome da parte di Microsoft.

### Approfondimenti su m365.fm

**Episodi**
- [Manutenzione predittiva su Azure: cosa serve davvero prima del modello](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/)
- [FinOps per l'IT manifatturiero](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/)
- [Tracciabilità e genealogia](https://www.m365.fm/show/episodes/traceability-and-genealogy/)
- [Gemelli digitali su Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/)
- [Value Stream Mapping come modello dati in tempo reale](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Articoli**
- [Gemello digitale nel manifatturiero: da dove iniziare](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/)
- [Dall'ERP al reparto produttivo: costruire il gemello digitale](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Pianificazione della produzione aerospaziale: lead time e tracciabilità](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)
- [Azure IoT Edge vs Azure IoT Operations: scegliere l'architettura industriale giusta](https://www.m365.fm/community/u/mirko-p/blog/azure-iot-edge-vs-azure-iot-operations/)
- [Device Twin vs Azure Digital Twins: scegliere il livello giusto per l'IoT industriale](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/)

**Glossario**
- [Industria 4.0](https://www.m365.fm/entity/industry-4-0/) · [Gemello digitale](https://www.m365.fm/entity/digital-twin/) · [ERP](https://www.m365.fm/entity/enterprise-resource-planning/) · [Pianificazione e schedulazione avanzata](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Manutenzione produttiva totale](https://www.m365.fm/entity/total-productive-maintenance/) · [Indicatore chiave di prestazione](https://www.m365.fm/entity/key-performance-indicator/) · [Virtual commissioning](https://www.m365.fm/entity/virtual-commissioning/)

**Guide correlate**
- [Gemello digitale nel manifatturiero](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Schedulazione della produzione e APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [KPI manifatturieri](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Gestione del reparto produttivo](https://www.m365.fm/en/learn/shop-floor-management/)
- [Eccellenza operativa](https://www.m365.fm/en/learn/operational-excellence/)
- [Pianificazione della produzione aerospaziale](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** è il conduttore di m365.fm e lavora presso [iFAKT GmbH](https://www.m365.fm/entity/ifakt/). Su m365.fm scrive dell'intersezione tra pianificazione della produzione, gemelli digitali e cloud Microsoft, traducendo temi manifatturieri come i flussi di valore, la tracciabilità e la manutenzione predittiva per un pubblico di Microsoft 365 e Azure.

**Nota: l'autore lavora presso iFAKT GmbH.**

*Ultima revisione: 20 novembre 2026 (verifica dei fatti rispetto alle fonti primarie di Microsoft, NIST, CISA, FDA, SEC, BSI e UE). Prossima revisione della tabella sullo stato dei servizi: febbraio 2027.*

# Sources

All sources retrieved on November 20, 2026, unless noted. Sources 1 to 48 are carried over from the German edition; 49 to 64 are new for the US edition.

1. What is Microsoft for Manufacturing? Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/overview
2. What's new in Microsoft for Manufacturing. Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/whats-new
3. What is Azure IoT Operations? Microsoft Learn (last updated November 11, 2026). https://learn.microsoft.com/en-us/azure/iot-operations/overview-iot-operations
4. What is the connector for OPC UA? (Azure IoT Operations). Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector
5. Azure IoT Operations now Generally Available. Microsoft Tech Community (IoT Blog). https://techcommunity.microsoft.com/blog/iotblog/azure-iot-operations-now-generally-available/4282445
6. Azure IoT Operations 2603 is now available: Powering the next era of Physical AI. Microsoft Tech Community (IoT Blog). https://techcommunity.microsoft.com/blog/iotblog/azure-iot-operations-2603-is-now-available-powering-the-next-era-of-physical-ai/4509342
7. Releases: Azure/azure-iot-operations. Microsoft on GitHub. https://github.com/Azure/azure-iot-operations/releases
8. Azure IoT Central is evolving: what you need to know. Microsoft Tech Community (IoT Blog), September 25, 2026. https://techcommunity.microsoft.com/blog/iotblog/azure-iot-central-is-evolving-what-you-need-to-know/4554570
9. Microsoft Confirms Azure IoT Central Commitment. Automation World, February 27, 2024. https://www.automationworld.com/communication/article/33037810/microsoft-confirms-azure-iot-central-commitment
10. Migrating Time Series Insights Gen2 to Real-Time Intelligence in Microsoft Fabric. Microsoft Learn (archived page; newer version at https://learn.microsoft.com/en-us/previous-versions/azure/time-series-insights/migration-to-fabric). https://learn.microsoft.com/en-us/azure/time-series-insights/how-to-tsi-gen2-migration
11. Retirement of Azure Percept DK. Microsoft Learn. https://learn.microsoft.com/en-us/azure/azure-percept/retirement-of-azure-percept-dk
12. Azure IoT Edge versions and release notes. Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-edge/version-history
13. Azure IoT Edge: Microsoft Lifecycle. Microsoft Learn. https://learn.microsoft.com/en-us/lifecycle/products/azure-iot-edge
14. What is Azure Digital Twins? Microsoft Learn. https://learn.microsoft.com/en-us/azure/digital-twins/overview
15. What is digital twin builder (preview)? Microsoft Fabric, Microsoft Learn (last updated May 20, 2026). https://learn.microsoft.com/en-us/fabric/real-time-intelligence/digital-twin-builder/overview
16. Ontology (preview) overview, Fabric IQ. Microsoft Learn (October 16, 2026). https://learn.microsoft.com/en-us/fabric/iq/ontology/overview
17. Connected Factory Reference Architecture. Microsoft Fabric, Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/architectures/connected-factory
18. Transform your business with Real-Time Intelligence, now generally available. Microsoft Fabric Updates Blog. https://blog.fabric.microsoft.com/fi-fi/blog/transform-your-business-with-real-time-intelligence-now-generally-available
19. What is Azure Data Explorer? Microsoft Learn (July 23, 2026). https://learn.microsoft.com/en-us/azure/data-explorer/data-explorer-overview
20. What is Microsoft Foundry? Microsoft Learn. https://learn.microsoft.com/azure/foundry/what-is-foundry
21. New name for Azure Stack HCI / Azure Local. Microsoft Learn. https://learn.microsoft.com/en-us/azure/azure-local/rename-to-azure-local
22. Retirement: OT security in Microsoft Defender for IoT. Azure Updates, ID 576255, November 2, 2026. https://azure.microsoft.com/updates?id=576255 (full text via the Release Communications API: https://www.microsoft.com/releasecommunications/api/v2/azure/576255; mirror: https://mc.merill.net/message/AZ576255)
23. What's new in Microsoft Defender for IoT? Microsoft Learn. https://learn.microsoft.com/en-us/azure/defender-for-iot/organizations/whats-new
24. Microsoft Defender now integrates with Dragos, Forescout & Armis for OT Security. Microsoft Tech Community, July 2026. https://techcommunity.microsoft.com/blog/microsoftthreatprotectionblog/microsoft-defender-now-integrates-with-dragos-forescout--armis-for-ot-security/4534936
25. FinOps Framework. Microsoft Learn (Microsoft Cloud FinOps). https://learn.microsoft.com/en-us/cloud-computing/finops/framework/finops-framework
26. ISA-95 Standard. International Society of Automation (ISA). https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
27. Quick Start Guide: An Overview of ISA/IEC 62443 Standards. ISA Global Cybersecurity Alliance. https://gca.isa.org/hubfs/ISAGCA%20Quick%20Start%20Guide%20FINAL.pdf
28. Cybersicherheitsrecht: NIS-2-Umsetzungsgesetz ab morgen in Kraft (NIS2 implementation act in force tomorrow). BSI press release, December 5, 2025 (German). https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2025/251205_NIS-2-Umsetzungsgesetz_in_Kraft.html; also: Zweiter Schritt zur NIS-2-Registrierung: BSI-Portal ab sofort freigeschaltet (second registration step: BSI portal open). BSI, January 6, 2026 (German). https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2026/260601_NIS2_BSI-Portal.html
29. Digital Product Passport (including the Batteries subpage). European Commission, DG GROW. https://single-market-economy.ec.europa.eu/single-market/digital-product-passport_en and https://single-market-economy.ec.europa.eu/single-market/digital-product-passport/batteries_en
30. Cyber Resilience Act: Reporting obligations. European Commission. https://digital-strategy.ec.europa.eu/en/policies/cra-reporting
31. Smart Manufacturing: Unlocking Real-Time Intelligence With Azure IoT Operations and Microsoft Fabric. b.telligent. https://www.btelligent.com/en/blog/real-time-intelligence-azure-iot-microsoft-fabric
32. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource. Microsoft Tech Community (Marketplace Blog), July 11, 2024. https://techcommunity.microsoft.com/blog/marketplace-blog/learn-about-ifakt-gmbhs-isv-success-for-business-applications-solution-in-micros/4182536
33. Polaris VSM: Digital Value Stream Mapping. Microsoft Marketplace. https://marketplace.microsoft.com/en-us/product/saas/ifaktgmbh.ifakt_vsm_1?tab=overview
34. Microsoft Ignite 2025: Ten Things You Need to Know. Directions on Microsoft, November 18, 2025. https://www.directionsonmicrosoft.com/microsoft-ignite-2025-ten-things-you-need-to-know/
35. OPC 10030: ISA-95 Common Object Model, section 4.2.3 ISA-95. OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3
36. Integration with Azure Device Registry (preview). Azure IoT Hub, Microsoft Learn. https://learn.microsoft.com/en-gb/azure/iot-hub/iot-hub-device-registry-overview
37. What is Azure Machine Learning? Microsoft Learn (includes the notice that prompt flow retires on April 20, 2027). https://learn.microsoft.com/en-us/azure/machine-learning/overview-what-is-azure-machine-learning?view=azureml-api-2
38. Labeling images and text documents. Azure Machine Learning, Microsoft Learn (retirement notice for data labeling, September 30, 2026). https://learn.microsoft.com/en-us/azure/machine-learning/how-to-label-data?view=azureml-api-2
39. November update: What's new in Security for partners. Microsoft Tech Community (Partner News), November 12, 2026. https://techcommunity.microsoft.com/blog/partnernews/november-update-what%E2%80%99s-new-in-security-for-partners/4572658
40. Publish and subscribe MQTT messages using MQTT broker. Azure IoT Operations, Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/manage-mqtt-broker/overview-broker
41. Fragen und Antworten zu NIS-2 (NIS2 FAQ). BSI (German). https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-regulierte-Unternehmen/NIS-2-FAQ/NIS-2-FAQ-allgemein/FAQ-zu-NIS-2.html; NIS-2-Meldepflicht (NIS2 reporting obligation). BSI (German). https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-regulierte-Unternehmen/NIS-2-Infopakete/NIS-2-Meldepflicht/NIS-2-Meldepflicht_node.html
42. Cyber Resilience Act. BSI. https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Cyber_Resilience_Act/cyber_resilience_act_node.html
43. OneLake Settings: Modify Immutability Policy. Fabric REST API, Microsoft Learn. https://learn.microsoft.com/en-us/rest/api/fabric/core/onelake-settings/modify-immutability-policy
44. SAP and Microsoft accelerate business insights and AI innovation with SAP Business Data Cloud Connect for Microsoft Fabric. Microsoft Fabric Blog. https://blog.fabric.microsoft.com/en-us/blog/29410
45. Link your Dataverse environment to Microsoft Fabric. Power Apps, Microsoft Learn. https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-view-in-fabric
46. Digital Omnibus on AI has been published (Regulation (EU) 2026/1744). Cuatrecasas, July 2026. https://www.cuatrecasas.com/en/spain/intellectual-property/art/digital-omnibus-ai-has-been-published; also European Commission, Advanced Manufacturing Transition Pathway: AI Act Digital Omnibus: high-risk deadlines postponed, machinery carved out. https://transition-pathways.europa.eu/adv-man/legislation/ai-act-digital-omnibus-high-risk-deadlines-postponed-machinery-carved-out
47. Pause and resume your capacity. Microsoft Fabric, Microsoft Learn. https://learn.microsoft.com/en-us/fabric/enterprise/pause-resume
48. SAP DM Shopfloor Integration. DSAG impulsant, May 4, 2026 (guide dated April 2026). https://impulsant.dsag.de/formate/textbeitrag/sap-dm-shopfloor-integration-english/
49. NIST Releases Version 2.0 of Landmark Cybersecurity Framework. NIST news release, February 26, 2024. https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework
50. NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security. NIST CSRC, September 28, 2023. https://csrc.nist.gov/pubs/sp/800/82/r3/final; news release: https://www.nist.gov/news-events/news/2023/09/guide-operational-technology-ot-security-nist-publishes-sp-800-82-revision
51. NIST IR 8183 Rev. 2 (Initial Public Draft), Cybersecurity Framework 2.0 Manufacturing Profile. NIST CSRC, September 29, 2025. https://csrc.nist.gov/pubs/ir/8183/r2/ipd
52. Critical Manufacturing Sector. Cybersecurity and Infrastructure Security Agency (CISA). https://www.cisa.gov/critical-manufacturing-sector
53. DoD Publishes Final CMMC Program Rule. Greenberg Traurig, October 2024 (summary of 32 CFR Part 170, effective December 16, 2024). https://www.gtlaw.com/en/insights/2024/10/dod-publishes-final-cmmc-program-rule
54. The CMMC DFARS Final Rule Goes Live: Ready or Not, Here It Comes. Squire Patton Boggs, September 2025 (summary of the DFARS rule, effective November 10, 2025). https://www.squirepattonboggs.com/en/insights/publications/2025/09/the-cmmc-dfars-final-rule-goes-live-ready-or-not-here-it-comes
55. Cybersecurity Maturity Model Certification (CMMC). Azure compliance documentation, Microsoft Learn (last updated April 5, 2023). https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-cmmc
56. SEC Adopts Rules on Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure by Public Companies. SEC press release 2023-139, July 26, 2023. https://www.sec.gov/newsroom/press-releases/2023-139
57. CIRCIA final rule at the White House: deadlines set, scope open. Paubox, October 8, 2026 (secondary source on rulemaking status). https://www.paubox.com/blog/circia-final-rule-white-house-deadlines-set-scope-open
58. Cybersecurity Services. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/cybersecurity-services
59. FSMA Final Rule on Requirements for Additional Traceability Records for Certain Foods. U.S. Food and Drug Administration. https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods
60. 21 CFR 11.10, Controls for closed systems. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11/subpart-B/section-11.10
61. Quality Management System Regulation (QMSR). U.S. Food and Drug Administration. https://www.fda.gov/quality-systems-regulation
62. AS9100 Certification: Aerospace QMS. ANSI blog (ANAB). https://blog.ansi.org/anab/as9100-certification-aerospace-qms/
63. NIST Risk Management Framework Aims to Improve Trustworthiness of Artificial Intelligence. NIST news release, January 26, 2023. https://www.nist.gov/news-events/news/2023/01/nist-risk-management-framework-aims-improve-trustworthiness-artificial
64. AZ569914, Retirement: Azure IoT Central will be retired on September 20, 2029. Azure Updates notice, published September 29, 2026 (via the Message Center mirror mc.merill.net). https://mc.merill.net/message/AZ569914
