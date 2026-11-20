# SEO metadata

| Field | Value |
|---|---|
| Meta title | Gemello digitale nella produzione: guida completa |
| Meta description | Gemello digitale in produzione spiegato: gemello vs. shadow vs. simulazione, simulazione di fabbrica, virtual commissioning, AGV, ISO 23247 e roadmap. |
| Slug | `digital-twin-manufacturing` |

# Gemello digitale nella produzione: la guida completa alla simulazione di fabbrica, al flusso dei materiali e al virtual commissioning

*Ultimo aggiornamento: 20 novembre 2026 · Revisione tecnica effettuata rispetto agli standard, alle fonti primarie e alle pubblicazioni elencate in Fonti*

> **Risposta breve:** un gemello digitale nella produzione manifatturiera è una rappresentazione digitale eseguibile dei prodotti, dei processi e delle risorse di una fabbrica, aggiornata con i dati delle operazioni reali, idealmente in modo automatico. Lo si usa per simulare le operazioni, valutare in anticipo colli di bottiglia e scenari, mettere in servizio virtualmente il software di controllo e prendere decisioni prima di modificare qualsiasi cosa sul reparto produttivo reale.

Il termine "gemello digitale" viene usato in modo così approssimativo che ha quasi perso significato. Un modello 3D di un edificio viene chiamato gemello digitale. Così come un cruscotto di dati macchina e, a volte, un foglio di calcolo sulla capacità con celle rosse, gialle e verdi. Per i responsabili di stabilimento e di produzione questo è un problema concreto: se non si sa esattamente cosa si vuole realizzare, si acquista la soluzione sbagliata, si raccolgono dati senza una domanda a cui rispondere e dopo un anno ci si ritrova con un costoso progetto di visualizzazione che non migliora nemmeno una decisione.

Questa guida chiarisce la terminologia e attraversa ogni livello: dall'origine del concetto con Michael Grieves e la NASA, passando per gli standard (ISO 23247, ISA-95, l'Asset Administration Shell e le linee guida tedesche VDI su simulazione e messa in servizio virtuale, su cui lavora ancora gran parte dell'industria), fino alla domanda pratica su come derivare un gemello di produzione utile dai dati che già risiedono nel sistema ERP. L'attenzione è rivolta a ciò che i team manifatturieri decidono davvero: pianificazione di fabbrica e layout, capacità e colli di bottiglia, mix di prodotto, qualità della schedulazione, messa in servizio virtuale e dimensionamento delle flotte di veicoli a guida automatica (AGV). Per una definizione sintetica, si veda la pagina di voce [Digital Twin](https://www.m365.fm/entity/digital-twin/).

### Punti chiave

- Un **gemello digitale** si distingue da un modello digitale e da un'ombra digitale per il suo **flusso automatico di dati in entrambe le direzioni** [5]. Nella pianificazione di fabbrica, molte soluzioni produttive funzionano deliberatamente come modello o come ombra, e questo non è un difetto.
- Il nucleo di un gemello di produzione è un **modello prodotto-processo-risorsa (PPR)**: cosa si produce (distinta base), come (cicli, tempi, sequenze) e con cosa (macchine, persone, spazi, movimentazione dei materiali). Gran parte di questi dati risiede già nel vostro **sistema ERP**.
- La **simulazione** trasforma il modello in uno strumento decisionale. In manifattura e logistica domina la **simulazione a eventi discreti**; il riferimento metodologico classico è la linea guida tedesca VDI 3633 [13], mentre il testo statunitense di riferimento è *Simulation Modeling and Analysis* di Law [41].
- Gli standard fondamentali sono **ISO 23247** (framework del gemello digitale per la manifattura, Parti da 1 a 4 nel 2021, Parti 5 e 6 nel 2026) [6][7][8], **IEC 63278-1** (Asset Administration Shell) [10] e **ISA-95 / IEC 62264** (integrazione tra livello aziendale e di controllo) [58]. NIST supporta la ISO 23247 con indicazioni sui casi d'uso e implementazioni di riferimento per i produttori statunitensi [47][48].
- Partite da **una decisione concreta**, non da una piattaforma. Un gemello senza una domanda diventa un cimitero di dati.
- La **qualità dei dati** determina il successo o il fallimento: tempi standard, tempi di attrezzaggio, calendari di turno e registrazioni dei fermi sono spesso meno accurati di quanto suggeriscano i dati anagrafici.
- In Microsoft, **Azure Digital Twins** è un servizio PaaS generalmente disponibile che supporta DTDL v2 e v3 [21][22]; **digital twin builder in Microsoft Fabric** è ancora etichettato come **anteprima** al momento della stesura [23].

### Percorsi di lettura per lettori con poco tempo

| Siete un/una ... | Leggete prima |
|---|---|
| Ingegnere di produzione o pianificatore di stabilimento | Sezioni 2, 6, 7 e 10 (definizioni, simulazione, casi d'uso, tabella di marcia) |
| Responsabile di stabilimento, VP operations, dirigente | Risposta breve, sezioni 4, 12 e 13 (maturità, costi e benefici, errori comuni) |
| Ingegnere di controlli o automazione | Sezione 7.5 (messa in servizio virtuale) e 14 (standard) |
| Responsabile di progetto di logistica interna, AGV/AMR | Sezione 7.6 (pianificazione delle flotte AGV e AMR) |
| Amministratore M365/Azure, architetto IT/OT | Sezioni 5, 8 e 16 (architettura, servizi Microsoft, sicurezza) |

## Indice

1. [Che cos'è un gemello digitale nella manifattura?](#1-che-cosè-un-gemello-digitale-nella-manifattura)
2. [Modello digitale vs. ombra digitale vs. gemello digitale](#2-modello-digitale-vs-ombra-digitale-vs-gemello-digitale)
3. [Tipi di gemelli digitali nella manifattura](#3-tipi-di-gemelli-digitali-nella-produzione)
4. [Livelli di maturità: dalla rappresentazione al sistema auto-ottimizzante](#4-livelli-di-maturità-dalla-rappresentazione-al-sistema-auto-ottimizzante)
5. [Architettura e base dati: ERP, MES, PLM, IoT](#5-architettura-e-base-dati-erp-mes-plm-iot)
6. [La simulazione al centro: simulazione di fabbrica, del flusso dei materiali e del flusso del valore](#6-simulazione-al-centro-simulazione-di-fabbrica-del-flusso-di-materiali-e-della-catena-del-valore)
7. [Casi d'uso e i dati di cui ciascuno ha bisogno](#7-casi-duso-e-i-dati-di-cui-ciascuno-ha-bisogno)
8. [Gemelli digitali con Microsoft Azure e Fabric](#8-gemelli-digitali-con-microsoft-azure-e-fabric)
9. [Intelligenza artificiale e gemello digitale](#9-intelligenza-artificiale-e-gemello-digitale)
10. [Roadmap: implementazione in sei fasi](#10-roadmap-implementazione-in-sei-fasi)
11. [Qualità dei dati: il prerequisito sottovalutato](#11-qualità-dei-dati-il-prerequisito-sottovalutato)
12. [Costi e benefici, valutati con onestà](#12-costi-e-benefici-valutati-con-onestà)
13. [Errori comuni e come evitarli](#13-errori-comuni-e-come-evitarli)
14. [Standard e linee guida in sintesi](#14-norme-e-linee-guida-in-sintesi)
15. [Categorie di software: un confronto neutrale](#15-categorie-di-software-un-confronto-neutrale)
16. [Sicurezza, proprietà dei dati e normativa](#16-sicurezza-proprietà-dei-dati-e-normativa)
17. [Costruire un gemello a partire dai dati ERP e del flusso del valore con iFAKT Polaris](#17-costruire-un-gemello-digitale-da-dati-erp-e-di-flusso-del-valore-con-ifakt-polaris)
18. [Glossario](#18-glossario)
19. [FAQ: gemelli digitali nella manifattura](#19-faq-gemelli-digitali-nella-produzione)
20. [Conclusione](#20-conclusione)

## 1. Che cos'è un gemello digitale nella manifattura?

### Una definizione operativa

Nella pratica manifatturiera si è dimostrata utile una definizione operativa con tre condizioni:

1. **Rappresenta un corrispettivo reale.** Il gemello rappresenta un oggetto specifico (una macchina, una linea, uno stabilimento) o un processo specifico, non una classe generica.
2. **È eseguibile.** Contiene non solo struttura e geometria, ma anche comportamento. Può far avanzare gli stati, simulare le operazioni e rispondere a domande del tipo "cosa succede se ...?".
3. **È collegato alla realtà tramite dati.** Viene aggiornato con dati di funzionamento, idealmente in automatico, e i suoi risultati confluiscono nelle decisioni o nei controlli.

Senza il punto 2, si ha un database o un modello 3D. Senza il punto 3, si ha un modello di simulazione. Entrambi sono utili, ma nessuno dei due è un gemello in senso stretto.

Le istituzioni statunitensi definiscono il termine in modo analogo. La definizione del Digital Twin Consortium del 3 dicembre 2020 descrive un gemello digitale come "una rappresentazione virtuale di entità e processi del mondo reale, sincronizzata con una frequenza e un livello di fedeltà specificati" [51]. Il rapporto di consenso del 2024 della National Academies of Sciences, Engineering, and Medicine, promosso dal Dipartimento della Difesa, dal Dipartimento dell'Energia, dai National Institutes of Health e dalla National Science Foundation statunitensi, descrive un gemello digitale come un insieme di costrutti informativi virtuali che imitano struttura, contesto e comportamento di un sistema, "è aggiornato dinamicamente con dati provenienti dal suo gemello fisico, ha capacità predittiva e informa decisioni che generano valore", e aggiunge: "L'interazione bidirezionale tra virtuale e fisico è centrale nel gemello digitale" [50]. Il NIST descrive i gemelli digitali come rappresentazioni elettroniche di entità del mondo reale che permettono di osservarne lo stato e le variazioni, ed esamina i problemi di sicurezza e fiducia che sollevano [49]. Tutte e tre le definizioni contengono gli stessi elementi della definizione operativa sopra: un corrispettivo reale, il comportamento e un collegamento dati.

### Gemello digitale, fabbrica intelligente, fabbrica digitale: termini chiariti

In inglese si incontrano "digital twin in manufacturing", "manufacturing digital twin", "factory digital twin" e "production digital twin" per indicare lo stesso concetto. La **smart factory** (o smart manufacturing) è un'altra cosa: uno stabilimento connesso e in gran parte auto-organizzato, come quadro di riferimento obiettivo dell'Industria 4.0. Il gemello digitale è uno dei suoi strumenti, non un sinonimo. La **digital factory** è un termine ombrello più antico e orientato alla pianificazione, proveniente dalla linea guida tedesca VDI 4499, che riguarda modelli, metodi e strumenti digitali (vedi sotto); in Nord America i termini più vicini nell'uso quotidiano sono "digital manufacturing" e "virtual manufacturing". Espressioni come production simulation, factory simulation e material flow simulation descrivono metodi che un gemello digitale può utilizzare. **Digital thread** descrive il flusso connesso di informazioni lungo il ciclo di vita; la norma ISO 23247-5 ne tratta ora esplicitamente [7].

### Origini: da Grieves e NASA all'Industria 4.0

Il concetto deriva dalla gestione del ciclo di vita del prodotto (PLM). Michael Grieves presentò nel 2002 un modello che collegava uno spazio reale, uno spazio virtuale e il flusso di dati e informazioni tra i due. Egli colloca la prima presentazione in un forum di management della Society of Manufacturing Engineers (SME) nell'ottobre 2002 e in una presentazione all'Università del Michigan nel dicembre 2002 [2]. Il modello fu inizialmente denominato "Mirrored Spaces Model" (2005), poi "Information Mirroring Model" (2006) e infine "Digital Twin"; secondo Grieves, il concetto in sé è rimasto invariato [2]. Grieves attribuisce il nome "digital twin" a John Vickers della NASA [1][2]. Altri autori sottolineano che la storia delle origini non può essere documentata senza lacune e che esistono precursori precedenti, come la ricerca sul virtual manufacturing degli anni Novanta [4].

Il termine ha ottenuto ampia attenzione grazie all'aerospazio. La NASA descrisse il gemello digitale nella sua roadmap tecnologica "Modeling, Simulation, Information Technology & Processing" (Shafto et al., bozza del 2010) [4]. Nel 2012, Glaessgen e Stargel formularono per NASA e per l'US Air Force la definizione spesso citata di gemello digitale come "simulazione probabilistica integrata, multifisica e multiscala di un veicolo o sistema così come costruito", che combina simulazione ad altissima fedeltà con monitoraggio dello stato, storico della manutenzione e dati di flotta per rispecchiare la vita del suo gemello in volo [3].

Nella manifattura tedesca, il termine si è legato all'Industrie 4.0 a partire dalla metà degli anni Dieci. Lì ha incontrato una tradizione più antica e indipendente: la **Digital Factory** (VDI 4499) e la **simulazione a eventi discreti del flusso di materiali** (VDI 3633). Negli Stati Uniti, la simulazione di fabbrica è cresciuta a partire dalla ricerca operativa e dall'ingegneria industriale, con testi come quello di Law [41] e strumenti commerciali a eventi discreti. Da entrambe le parti dell'Atlantico, molti strumenti oggi commercializzati come gemelli digitali sono metodologicamente discendenti di questa simulazione di fabbrica. Per ulteriore contesto, vedi la pagina dell'entità [Industry 4.0](https://www.m365.fm/entity/industry-4-0/).

### Definizioni formali nelle norme

Le norme formali esistono dal 2021. La **ISO 23247** ("Automation systems and integration: Digital twin framework for manufacturing") definisce un quadro di riferimento per i gemelli digitali nella manifattura. Le parti da 1 a 4 (panoramica, architettura di riferimento, rappresentazione digitale degli elementi di produzione, scambio di informazioni) sono state pubblicate nell'ottobre 2021 (la Parte 1 il 21 ottobre 2021) [6]. La Parte 5 ("Digital thread for digital twin") e la Parte 6 ("Digital twin composition", pubblicata il 14 luglio 2026) sono seguite nel 2026 [7][8]. La **ISO/IEC 30173:2023** fissa termini e concetti trasversali ai settori, inclusi i processi del ciclo di vita, i tipi di gemelli digitali, una vista funzionale e gli stakeholder [9].

Per i produttori statunitensi, il NIST offre un punto di accesso pratico alla ISO 23247. Il suo rapporto *Use Case Scenarios for Digital Twin Implementation Based on ISO 23247* (NIST AMS 400-2, Guodong Shao, maggio 2021) è stato scritto esplicitamente per ridurre la confusione sui gemelli digitali tra le piccole e medie imprese manifatturiere e illustra tre casi d'uso basati sul quadro di riferimento [47]. Il progetto in corso del NIST "Digital Twins for Advanced Manufacturing" contribuisce alla ISO 23247, lavora su un'implementazione di riferimento della Parte 5 (digital thread) e propone un quadro di verifica, validazione e quantificazione dell'incertezza (VVUQ) come futura Parte 7; indica la "mancanza di standard" come una delle principali barriere all'adozione [48].

Per la pianificazione degli stabilimenti, la definizione tedesca di Digital Factory contenuta nella VDI 4499 Parte 1 resta influente. L'edizione del 2008 recita (nostra traduzione): "La Digital Factory è il termine generico per una rete completa di modelli, metodi e strumenti digitali, inclusi la simulazione e la visualizzazione tridimensionale, integrati da una gestione continua dei dati. Il suo obiettivo è la pianificazione olistica, la valutazione e il miglioramento continuo di tutte le strutture, i processi e le risorse essenziali della fabbrica reale in relazione al prodotto." [17] Una nuova edizione della VDI 4499 Parte 1 è stata pubblicata nell'aprile 2026 e copre il termine, gli obiettivi, i processi, la gestione dei dati e l'architettura di sistema della Digital Factory [16]. Se la citate, verificate se la formulazione della nuova edizione differisce.

Si noti l'espressione "strutture, processi e risorse ... in relazione al prodotto". Essa contiene già la logica prodotto-processo-risorsa su cui si basa un gemello produttivo (vedi sezione 5, "Il modello prodotto-processo-risorsa al centro").

## 2. Modello digitale vs. ombra digitale vs. gemello digitale

La distinzione più citata per la manifattura proviene da Kritzinger, Karner, Traar, Henjes e Sihn (Fraunhofer Austria) nel 2018 [5]. Essi distinguono tre livelli di integrazione in base a come i dati fluiscono tra l'oggetto fisico e quello digitale.

| Attributo | Modello digitale | Ombra digitale | Gemello digitale |
|---|---|---|---|
| Flusso di dati fisico → digitale | manuale | automatico | automatico |
| Flusso di dati digitale → fisico | manuale | manuale | automatico |
| Esempio tipico | modello di simulazione di una linea pianificata, layout CAD | modello di simulazione aggiornato giornalmente con ordini e conferme da ERP/MES | modello che invia automaticamente sequenze di produzione o parametri al sistema di controllo |
| Stato dell'oggetto fisico | non deve necessariamente esistere | esiste, viene osservato | esiste, viene osservato e influenzato |
| Uso tipico | pianificazione dello stabilimento, greenfield, decisione di investimento | monitoraggio, analisi dello stato attuale, previsione, validazione della schedulazione | controllo a ciclo chiuso, schedulazione di dettaglio, ottimizzazione autonoma |
| Requisiti su IT e governance | bassi | medi (interfacce, qualità dei dati) | alti (tempo reale, sicurezza, processi di approvazione) |

Nella loro rassegna della letteratura, Kritzinger et al. hanno riscontrato che le pubblicazioni sul livello più alto, il vero gemello, sono rare, mentre modelli e ombre vengono descritti molto più spesso [5]. Ciò corrisponde alla pratica: nella pianificazione di stabilimento e di produzione, un ciclo di feedback automatico verso i controlli spesso non è nemmeno desiderato. Un pianificatore vuole confrontare scenari e poi decidere in modo deliberato. Un modello che modifica la sequenza di produzione senza approvazione sarebbe inaccettabile in molti impianti, sia dal punto di vista organizzativo sia per le responsabilità.

La conseguenza per il vostro progetto: non chiedete "Abbiamo un vero gemello?" Chiedete "Quale livello di integrazione richiede la decisione che vogliamo migliorare?" Per una decisione di investimento su un nuovo edificio di assemblaggio, un modello ben validato è sufficiente. Per un controllo quotidiano della realismo del programma della settimana, serve un'ombra con alimentazione automatica dei dati. Solo per il controllo a ciclo chiuso, come la sequenziazione automatica a una stazione collo di bottiglia, lo sforzo di un gemello completo si ripaga.

**Un secondo sguardo all'"ombra":** Nell'ingegneria di produzione tedesca, "ombra digitale" viene talvolta usato in senso più ristretto, come immagine sufficientemente accurata e specifica per il compito dei dati di produzione, senza capacità di simulazione. Alcuni fornitori descrivono inoltre l'ombra come una "copia statica di dati storici". Queste letture differiscono da quella di Kritzinger et al. Le fonti statunitensi raramente usano il termine "ombra digitale" e spesso chiamano gemello ogni livello. Se usate uno di questi termini in una richiesta di offerta (RFP) o in un documento di requisiti, definitelo esplicitamente.

## 3. Tipi di gemelli digitali nella produzione

I gemelli digitali possono essere classificati in base all'oggetto che rappresentano e alla fase del ciclo di vita. La classificazione seguente è diffusa nella letteratura e nella pratica, ma non è standardizzata; la norma ISO/IEC 30173 descrive i tipi di gemelli digitali a un livello più generale [9]. Nei testi divulgativi statunitensi si usa spesso uno schema a quattro livelli, con gemelli di componente (o parte), gemelli di asset, gemelli di sistema (o unità) e gemelli di processo, reso popolare da IBM [52]. La tabella seguente è più specifica per la produzione manifatturiera.

| Tipo | Rappresenta | Domande tipiche | Fonti di dati principali |
|---|---|---|---|
| Gemello di prodotto | un prodotto lungo tutto il suo ciclo di vita (geometria, varianti, proprietà, stato sul campo) | Il progetto soddisfa i requisiti? Come si comporta il prodotto in uso? | CAD, PLM, analisi (FEA, CFD), dati da campo |
| Gemello di processo | un processo produttivo (fresatura, saldatura, stampaggio a iniezione, assemblaggio) | Quali parametri garantiscono una qualità stabile? Dove nascono scarti e rilavorazioni? | controlli delle macchine, sensori, dati di qualità, modelli di processo |
| Gemello di macchina o asset | una macchina o un'attrezzatura con cinematica, logica di controllo e stato | La logica del PLC funziona? Quando è prevista la manutenzione? | CAD meccanico, CAD elettrico, programma PLC, dati di stato |
| Gemello di produzione o di fabbrica | l'interazione tra ordini, processi, risorse, flusso dei materiali e logistica | C'è capacità sufficiente? Dov'è il collo di bottiglia? Quale layout, quale buffer, quanti AGV? | ERP, MES, dati del flusso del valore, layout, turni |
| Gemello di prestazioni o di esercizio | metriche di prestazione correnti di un sistema | Come evolvono OEE, lead time, puntualità delle consegne e consumi energetici? | MES, raccolta dati di produzione, contatori energetici, IoT |
| Gemello della supply chain | fornitori, siti, trasporti, scorte | Che cosa succede se un fornitore viene meno? Dove conviene tenere le scorte di sicurezza? | ERP, SCM, dati logistici |

I tipi non sono nettamente separati; si annidano l'uno nell'altro. Un gemello di fabbrica può incorporare un gemello di asset più dettagliato per una singola macchina collo di bottiglia. La composizione di più gemelli è proprio ciò che copre la nuova Parte 6 della ISO 23247 [8].

**Fasi del ciclo di vita:** Molti autori distinguono inoltre il gemello "come progettato" (stato di pianificazione), "come costruito" (effettivamente realizzato) e "come in esercizio" o "come manutenuto" (in funzione). Questo conta per la pianificazione di fabbrica: un modello di pianificazione descrive uno stabilimento che non esiste ancora, quindi non va confuso con dati di esercizio che non possono ancora esistere.

**Livelli di dettaglio:** Nella simulazione a eventi discreti si distinguono anche i livelli di aggregazione, dal livello di rete e di stabilimento fino a area, linea e cella, sino alla singola macchina. La norma VDI 3633 copre la simulazione a livello di macchina con simulazione 3D del movimento e simulazione di processo in una parte separata [13]. La competenza sta nello scegliere il livello il più aggregato possibile e il più dettagliato necessario.

## 4. Livelli di maturità: dalla rappresentazione al sistema auto-ottimizzante

I modelli di maturità aiutano a valutare il punto di partenza e a fissare obiettivi realistici. Nei paesi di lingua tedesca è ampiamente utilizzato l'**acatech Industrie 4.0 Maturity Index** (acatech è l'Accademia tedesca delle scienze e dell'ingegneria): descrive sei stadi di sviluppo e valuta risorse, sistemi informativi, cultura e struttura organizzativa; la versione aggiornata è uscita nel 2020 [20]. Gli stadi sono computerizzazione, connettività, visibilità, trasparenza, capacità predittiva e adattabilità.

Per il gemello digitale, questo si traduce in una scala pratica:

| Livello | Domanda guida | Cosa fornisce il gemello | Prerequisito |
|---|---|---|---|
| 1 Rappresentare | Cosa abbiamo? | modello strutturato di prodotti, processi, risorse (anagrafiche, layout) | anagrafiche mantenute, denominazioni coerenti |
| 2 Osservare | Cosa sta succedendo? | stato attuale da conferme, dati macchina, scorte (visibilità) | interfacce verso ERP/MES, marcature temporali |
| 3 Comprendere | Perché sta succedendo? | analisi delle cause radice, identificazione dei colli di bottiglia, analisi degli scostamenti (trasparenza) | dati storicizzati, definizioni delle metriche |
| 4 Prevedere | Cosa accadrà? | simulazione e previsione di lead time, saturazione, date di consegna | modello di simulazione validato, dati di pianificazione |
| 5 Raccomandare | Cosa dovremmo fare? | confronto di scenari, ottimizzazione, azioni raccomandate | funzione obiettivo, metodi di ottimizzazione |
| 6 Agire | Cosa accade automaticamente? | ciclo chiuso verso il controllo (adattabilità) | concetto di approvazione, sicurezza IT, responsabilità chiare |

Nei materiali di consulenza e dei fornitori si incontra spesso una suddivisione più breve in gemelli descrittivi, predittivi e prescrittivi. Essa corrisponde grosso modo ai livelli da 2 a 3, 4 e da 5 a 6 della tabella.

**Importante:** i livelli non costituiscono una sequenza obbligatoria. Un gemello per la pianificazione di uno stabilimento può essere molto utile già al livello 4, senza mai arrivare al livello 2, perché lo stabilimento pianificato non esiste ancora. Viceversa, una dashboard di monitoraggio di livello 2 non è un gradino verso la simulazione se il suo modello dei dati non contiene alcuna logica di processo. Pianificate i livelli in base alla vostra domanda, non in base a un modello.

## 5. Architettura e base dati: ERP, MES, PLM, IoT

### Il modello di riferimento ISO 23247

La ISO 23247-2 organizza un gemello digitale della manifattura in domini [6][43]:

- **Elementi osservabili della manifattura:** personale, attrezzature, materiali, processi produttivi, impianti, ambiente, prodotti e documenti di supporto [6]. Stanno al di fuori del gemello, ma sono da esso rappresentati.
- **Comunicazione dei dispositivi:** raccolta dati e controllo dei dispositivi, come connettività dei controllori, sensori e gateway.
- **Gemello digitale (nucleo):** rappresentazione, sincronizzazione, applicazioni e servizi come simulazione, analisi e validazione del programma.
- **Utente:** persone e applicazioni che usano il gemello, come le postazioni di lavoro dei pianificatori o i sistemi aziendali come ERP e MES.
- **Funzioni trasversali:** traduzione dei dati, garanzia dei dati e sicurezza.

Questo modello è indipendente dai fornitori e si presta bene come struttura di un documento dei requisiti o di una RFP. Il NIST ha utilizzato proprio questa struttura per i suoi tre scenari d'uso ISO 23247 [47]. Soprattutto, rende chiaro un punto: il gemello non è la visualizzazione. È lo strato intermedio che rappresenta, sincronizza e calcola.

### Sistemi per livello ISA-95: chi fornisce quali dati?

Lo standard ISA-95 (ANSI/ISA-95, a livello internazionale IEC 62264) organizza i sistemi di uno stabilimento in livelli basati sul modello Purdue [58][19][42]: il livello 0 è il processo fisico, il livello 1 sensoristica e attuazione, il livello 2 controllo di processo (PLC, SCADA, HMI), il livello 3 gestione delle operazioni di produzione (MES) e il livello 4 pianificazione aziendale e logistica (ERP). ISA osserva che lo standard tratta principalmente l'interfaccia tra i livelli 3 e 4 [58]. Per il gemello digitale, ciò fornisce una mappa chiara dei dati:

| Sistema (livello) | Fornisce al gemello | Granularità tipica | Punti deboli tipici |
|---|---|---|---|
| ERP (4) | anagrafica materiali, distinte base, cicli di lavorazione, centri di lavoro, capacità, calendari dei turni, ordini di vendita e di produzione, conferme | ordine, operazione, giorno/turno | tempi standard obsoleti, tempi di attrezzaggio uniformi, gruppi di centri di lavoro troppo generici |
| MES (3) | tempi effettivi, motivi dei fermi, quantità, scarti, assegnazione del personale, sequenze | operazione, minuto | codici motivo dei fermi non uniformi, lacune nelle registrazioni manuali |
| PLM/CAD | struttura di prodotto (EBOM), geometria, varianti, livelli di revisione | parte, versione | EBOM e distinta base di produzione (MBOM) non sincronizzate |
| Layout/CAD di stabilimento | superficie, corridoi, posizioni, nastri trasportatori | piede/metro | layout obsoleti, spesso non documentati negli impianti esistenti (brownfield) |
| PLC/SCADA (2) | stati, tempi ciclo, segnali | da millisecondi a secondi | poco significato senza contesto (quale ordine?) |
| IoT/sensori (1) | energia, temperatura, vibrazioni, posizione (es. AGV) | secondo | elevato volume di dati, mancata associazione agli asset |
| Magazzino/logistica interna (WMS, gestore della flotta AGV) | giacenze, ordini di trasporto, tempi di percorrenza | ordine, secondo | tempi di percorrenza spesso non storicizzati |

Per un gemello digitale di produzione e stabilimento, gran parte della struttura necessaria si trova ai livelli 3 e 4. I dati delle macchine dei livelli 1 e 2 migliorano le distribuzioni e i modelli dei fermi, ma raramente sono il punto di partenza. Se si collegano le macchine, due standard aperti sono quelli più rilevanti: OPC UA (IEC 62541) e, diffuso nelle officine meccaniche statunitensi, **MTConnect**, uno standard aperto per l'interoperabilità dei dati manifatturieri, pubblicato anche come standard ANSI (ANSI/MTC1.4-2018) [57]. Il NIST include un'interfaccia MTConnect per i gemelli digitali tra i propri progetti [48]. Il post [Dal-ERP-al-reparto-produttivo: il gemello digitale](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/) mostra in pratica come si presenta questo ponte tra ERP e reparto produttivo. Per le basi dell'ERP, vedere la pagina di approfondimento [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/).

### Il modello prodotto-processo-risorsa al centro

Nella pratica della fabbrica digitale, il **modello prodotto-processo-risorsa (PPR)** è diventato il principio strutturante. Collega tre viste:

- **Prodotto:** cosa si realizza? Prodotti finiti, gruppi e componenti e le loro relazioni (distinta base, varianti).
- **Processo:** come si realizza? Operazioni, sequenze, relazioni di precedenza e successione, tempi (attrezzaggio, lavorazione, movimentazione), dimensioni del lotto.
- **Risorsa:** con cosa si realizza? Macchine, centri di lavoro, persone con determinate competenze, attrezzature, superficie, mezzi di movimentazione, turni.

Il valore sta negli **archi** tra i nodi: quale operazione consuma quale gruppo, su quale risorsa, con quale tempo, sotto quale vincolo? Modellando questa rete come grafo, è possibile derivarne automaticamente diagrammi di rete, percorsi critici, risorse collo di bottiglia e modelli di simulazione. Tale grafo costituisce anche la base semantica su cui possono operare gli algoritmi di pianificazione e i servizi di intelligenza artificiale.

Il vantaggio rispetto a un gemello puramente 3D o IoT è pratico: il modello PPR risponde alle domande che i pianificatori di produzione e di stabilimento si pongono ogni giorno (capacità, lead time, collo di bottiglia, fabbisogno di manodopera), e gran parte di esso può essere costruito a partire da dati già esistenti.

### Costruire il gemello a partire da ERP e dai dati del flusso di valore

La storia tipica del gemello digitale inizia dai sensori. Per le questioni produttive, questo è spesso il punto sbagliato da cui cominciare. Il sistema ERP contiene già, in forma strutturata, il progetto del vostro stabilimento:

| Oggetto ERP | Ruolo nel gemello |
|---|---|
| Anagrafica materiali e distinta base (distinta base di produzione, MBOM) | struttura di prodotto, esplosione dei fabbisogni, sequenza di montaggio |
| Ciclo di lavorazione con operazioni | logica di processo, sequenza, tempi standard di attrezzaggio e lavorazione |
| Centro di lavoro o gruppo di centri di lavoro | risorse, capacità disponibile, centro di costo |
| Calendario di stabilimento e turni | tempo disponibile, pause, turni straordinari |
| Ordini di vendita e previsioni | carico, mix di prodotti, date di consegna |
| Ordini di produzione e conferme | tempi effettivi, quantità effettive, scarti, avanzamento |
| Parametri di giacenza e MRP | scorte di sicurezza, scorte tampone, regole di dimensionamento dei lotti |

**Value stream mapping** fornisce la seconda visione, complementare alla prima: rende visibili i flussi di materiali e di informazioni, le scorte tra i processi e la logica di controllo (push, pull, supermarket, FIFO), cosa che le tabelle ERP contengono solo in modo indiretto. Mike Rother e John Shook hanno reso popolare il metodo nel 1998 con *Learning to See*, pubblicato dal Lean Enterprise Institute [40]. Se si combina la logica del value stream con i dati anagrafici e le conferme dell'ERP, si ottiene un modello che cattura sia la struttura sia la dinamica di un sistema produttivo. L'episodio [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) mostra come una mappa del value stream diventi un modello dati vivente; il metodo in sé è spiegato nella pagina dedicata [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) e in modo approfondito nella nostra guida a [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

Questa discussione non è nuova nella letteratura. Già nel 2014 Türck, Weimer, Schubert e Drees hanno descritto sulla rivista tedesca *Zeitschrift für wirtschaftlichen Fabrikbetrieb* (ZWF) il passaggio dal value stream mapping statico e dalle sue metriche alla simulazione dinamica dei value stream, chiedendosi quali possibilità di ottimizzazione si aprano una volta aggiunto il tempo come dimensione [31]. Nel 2023 Böhm, Drees, Sai, Erlach, Stambera e Teriete hanno presentato sulla ZWF un'interfaccia dati universale per i servizi digitali di value stream, che utilizza i dati di produzione basati su eventi come base comune per il calcolo e la visualizzazione delle metriche; è stata testata nel progetto di ricerca tedesco ECOWERT [32].

### Semantica e interoperabilità: Asset Administration Shell, OPC UA, DTDL

Un gemello digitale che vive solo in un database proprietario è difficile da estendere. Tre standard definiscono l'interoperabilità:

- **Asset Administration Shell (AAS):** Il concetto della Plattform Industrie 4.0 tedesca per una rappresentazione digitale standardizzata di un asset. La norma IEC 63278-1:2023 (pubblicata il 14 dicembre 2023) ne definisce la struttura e mira a consentire alle applicazioni software di scambiare informazioni in modo uniforme e sicuro; si applica ad asset fisici, digitali e immateriali lungo l'intero ciclo di vita [10]. I contenuti sono organizzati in submodel, ad esempio per i dati tecnici o i dati operativi. Il modello di riferimento tedesco RAMI 4.0 (German Reference Architecture Model Industrie 4.0, DIN SPEC 91345:2016) descrive la struttura e il comportamento del componente Industrie 4.0 che rappresenta virtualmente un asset [12]; nel concetto della Plattform Industrie 4.0, l'AAS è la parte digitale di tale componente. Il suo ulteriore sviluppo è guidato dall'**Industrial Digital Twin Association (IDTA)**, fondata il 24 settembre 2020 dalle associazioni tedesche dell'ingegneria e dell'industria elettrica VDMA e ZVEI insieme a Bitkom e 20 aziende [11]. Un'implementazione open source è Eclipse BaSyx, sviluppata tra gli altri dal Fraunhofer IESE [29].
- **OPC UA (IEC 62541):** Lo standard diffuso per la comunicazione tra macchine indipendente dal fornitore, con modelli informativi. Per il gemello, OPC UA è rilevante soprattutto ai livelli da 1 a 3.
- **DTDL (Digital Twins Definition Language):** Il linguaggio di modellazione basato su JSON di Microsoft per Azure Digital Twins. Azure Digital Twins supporta DTDL v2 e v3; Microsoft raccomanda la v3 [22].

Nessuno di questi standard, da solo, è sufficiente per i gemelli della pianificazione della produzione, perché descrivono principalmente gli asset e non la logica di processo e le dinamiche degli ordini. Nella pratica si combinano quindi un modello di pianificazione (PPR, simulazione) con descrizioni standardizzate degli asset per la connettività.

## 6. Simulazione al centro: simulazione di fabbrica, del flusso di materiali e della catena del valore

### Cosa fa la simulazione e perché i calcoli statici non bastano

La norma VDI 3633 Parte 1 (edizione dicembre 2014), il riferimento tedesco, descrive i fondamenti della simulazione dei sistemi logistici, di flusso dei materiali e di produzione, e si rivolge a pianificatori, fornitori e gestori [13]. Essa definisce la simulazione come la riproduzione di un sistema con i suoi processi dinamici in un modello su cui si può sperimentare, per ottenere intuizioni trasferibili alla realtà [13][30]. Il testo di Law, ampiamente utilizzato nei corsi di ingegneria industriale negli Stati Uniti, copre lo stesso terreno dal lato statistico [41].

Il punto decisivo è la **dinamica**. Un calcolo di capacità su foglio elettronico lavora con valori medi: domanda per tempo di lavorazione, diviso il tempo disponibile, dà il tasso di utilizzo. Se tutti i valori sono sotto il 100 per cento, il piano sembra funzionare. In realtà, arrivi, tempi di lavorazione, tempi di attrezzaggio e guasti variano. La teoria delle code mostra che, con tempi variabili, i tempi di attesa crescono in modo sproporzionato all'aumentare dell'utilizzo, e davanti a una stazione che lavora vicino al proprio limite di capacità si formano code consistenti. Le interazioni tra stazioni (blocco, mancanza di alimentazione, risorse condivise come operatori o gru) non possono affatto essere catturate da un calcolo statico.

**Esempio svolto:** per una singola stazione, l'approssimazione di Kingman dà un'idea dell'ordine di grandezza [46]. Il tempo medio di attesa davanti alla stazione è approssimativamente W ≈ (cₐ² + cₛ²) / 2 · u / (1 − u) · t, dove u è l'utilizzo, t è il tempo medio di lavorazione e cₐ e cₛ sono i coefficienti di variazione dei tempi di arrivo e di lavorazione. Si ipotizzi un tempo di lavorazione di 10 minuti e una variabilità moderata (entrambi i coefficienti di variazione pari a 1):

| Utilizzo u | Fattore u / (1 − u) | Attesa media davanti alla stazione |
|---|---|---|
| 70% | 2,3 | circa 23 minuti |
| 80% | 4 | circa 40 minuti |
| 90% | 9 | circa 90 minuti |
| 95% | 19 | circa 190 minuti |

Il foglio di calcolo della capacità dice "regge" in tutti e quattro i casi. In realtà, il tempo di attesa quasi quintuplica passando dall'80 al 95 per cento di utilizzo. In una linea con diverse stazioni, attrezzaggi e guasti, l'effetto diventa ancora più forte e difficile da gestire analiticamente. È qui che entra in gioco la simulazione.

La **Legge di Little** resta un utile controllo di coerenza: in regime stazionario, la giacenza media in un sistema è uguale al tasso medio di throughput moltiplicato per il lead time medio (L = λ · W) [37]. La Legge di Little indica quale lead time corrisponde a una data giacenza, ma non quale giacenza risulterà da un dato livello di variabilità. Per questo serve la simulazione.

### Confronto dei tipi di simulazione

| Attributo | Simulazione a eventi discreti (DES) | Simulazione continua / dinamica dei sistemi | Simulazione ad agenti (ABS) | Simulazione fisica e di movimento 3D |
|---|---|---|---|---|
| Avanzamento del tempo | salta da evento a evento (arrivo, fine lavorazione, guasto) | continuo in piccoli passi temporali, equazioni differenziali | guidato da eventi o passi temporali, a seconda dello strumento | passi temporali fini, cinematica e dinamica |
| Elementi del modello | sorgenti, pozzi, stazioni, buffer, trasportatori, risorse, ordini | stock, flussi, cicli di retroazione | agenti autonomi con regole e stati (veicoli, persone, ordini) | corpi rigidi, giunti, sensori, segnali di controllo |
| Domande tipiche | throughput, lead time, utilizzo, collo di bottiglia, dimensioni dei buffer, fabbisogno di manodopera | capacità strategica e sviluppo del mercato, effetto bullwhip | traffico di AGV, flussi pedonali, controllo decentralizzato, logica di negoziazione | raggiungibilità, collisioni, tempo ciclo di una cella robotizzata, test del controllo |
| Livello di dettaglio | dalla linea allo stabilimento | dallo stabilimento alla rete, fortemente aggregato | dal locale alla rete | cella, macchina |
| Punti di forza | consolidata, facile da validare, casualità integrata | veloce, adatta a retroazioni e orizzonti lunghi | comportamento emergente, regole individuali | geometria e fisica realistiche |
| Limiti | geometria di solito semplificata | nessun ordine individuale | parametrizzazione e validazione impegnative | ad alta intensità di calcolo, piccola porzione del sistema |
| Riferimento | VDI 3633 [13], Law [41] | Forrester, *Industrial Dynamics* (MIT) [38] | nessuna norma VDI dedicata nota [unverified: fonte non trovata] | VDI 3633 Parte 8 (simulazione a livello di macchina) [13], VDI/VDE 3693 [14] |

Nella simulazione della produzione e degli stabilimenti domina la **simulazione a eventi discreti**. Molti strumenti moderni combinano più paradigmi, ad esempio la produzione a eventi discreti con veicoli basati su agenti oppure un modello energetico continuo. Il testo di Law descrive in dettaglio i fondamenti metodologici della simulazione a eventi discreti, dai numeri casuali alle distribuzioni di input fino all'analisi statistica [41].

### Simulazione dei flussi di materiale e simulazione di stabilimento

I termini sono spesso usati come sinonimi, ma hanno accenti diversi:

- **La simulazione dei flussi di materiale** segue il percorso di materiali e ordini attraverso produzione e logistica: nastri trasportatori, buffer, magazzino, movimentazione dei materiali, prelievo. Domande guida: il sistema di trasporto a nastro è sufficiente? Di quanto devono essere dimensionati i buffer? Dove si accumula il materiale?
- **La simulazione di stabilimento** considera lo stabilimento nel suo insieme: mix di prodotti, capacità, turni, personale, layout, logistica e regole di controllo. Domande guida: lo stabilimento riesce a gestire il volume? Quale layout è robusto? Quanto costa un terzo turno rispetto a una macchina aggiuntiva?
- **La simulazione della produzione** viene spesso usata come termine ombrello che comprende entrambe.

Per approfondire la simulazione di stabilimento, consultare la pagina di entità [Factory Simulation](https://www.m365.fm/entity/factory-simulation/).

### Simulazione del flusso del valore: value stream mapping dinamico

Il value stream mapping classico è una fotografia basata su medie. Mostra scorte, lead time e flusso in una determinata giornata, ma non il comportamento del flusso del valore quando cambia il mix di prodotti, si verificano guasti o cambiano le dimensioni dei lotti. La simulazione del flusso del valore colma questa lacuna trattando la mappa del flusso del valore come un modello eseguibile. La pubblicazione ZWF del 2014 citata sopra descrive proprio questo passaggio da metriche statiche a una visione dinamica nel tempo [31].

Il vantaggio pratico: la mappa del flusso del valore è familiare e accettata in azienda. Se da essa si ricava un modello di simulazione, i team operativi non devono imparare un nuovo mondo di modellazione. I limiti si incontrano con flussi di materiale molto complessi, con nastri trasportatori e logica di magazzino, che richiedono la simulazione classica dei flussi di materiale.

### Come si svolge uno studio di simulazione

La norma VDI 3633 descrive la preparazione, l'esecuzione e la valutazione degli studi di simulazione [13]. La sequenza seguente si è dimostrata efficace:

1. **Obiettivo:** quale decisione si sta preparando? Quali metriche la determinano (throughput, lead time, rispetto delle consegne, costi)?
2. **Confine del sistema:** cosa rientra nel modello e cosa no? Quale livello di dettaglio serve?
3. **Raccolta e preparazione dei dati:** dati anagrafici, tempi, distribuzioni, guasti, turni (vedi sezione 11).
4. **Costruzione del modello:** prima il modello concettuale, poi il modello eseguibile.
5. **Verifica e validazione:** il modello è costruito correttamente (verifica)? Rappresenta la realtà con sufficiente accuratezza (validazione)? Confrontare con dati effettivi e verificare la plausibilità con gli esperti di settore.
6. **Progettazione degli esperimenti:** scenari, periodo di warm-up, durata della simulazione, numero di repliche.
7. **Esecuzione e analisi:** metriche con intervalli di confidenza invece di singoli valori, analisi di sensitività.
8. **Documentazione e passaggio di consegne:** ipotesi, limiti, raccomandazioni.

Due aspetti vengono trascurati spesso nella pratica: il **periodo di warm-up** (un modello che parte vuoto produce metriche distorte nei primi giorni simulati) e le **repliche** (un modello stocastico produce risultati diversi a ogni esecuzione; solo più esecuzioni permettono un'affermazione affidabile) [41]. La stessa logica di verifica e validazione è ciò che il NIST intende formalizzare per i gemelli digitali della manifattura con il suo framework VVUQ proposto [48].

## 7. Casi d'uso e i dati di cui ciascuno ha bisogno

La tabella seguente ordina i casi d'uso più importanti nella produzione per livello di integrazione e requisiti di dati. Consideratela come un supporto alla pianificazione: per il vostro caso, controllate per prima cosa la colonna "Dati minimi".

| Caso d'uso | Decisione tipica | Livello di integrazione | Dati minimi | Dati aggiuntivi a valore |
|---|---|---|---|---|
| Pianificazione di stabilimento e layout | struttura dell'edificio, disposizione, superficie, corsie | modello | programma di prodotto, cicli di lavorazione, tempi, requisiti di spazio, varianti di layout | matrici di trasporto, vincoli edilizi, scansione 3D |
| Pianificazione della capacità e degli investimenti | macchina aggiuntiva, turno aggiuntivo o esternalizzazione | modello o shadow | previsioni, cicli di lavorazione, centri di lavoro, modelli di turno, disponibilità | distribuzioni dei guasti, matrici dei setup |
| Analisi dei colli di bottiglia | Dove investire, dove alleggerire? | shadow | conferme con marcatura temporale, tempi effettivi, giacenze | stati macchina, cause di fermo |
| Analisi del mix di prodotti e scenari | nuovo prodotto, mix di varianti, dimensioni dei lotti | modello o shadow | distinte base, cicli di lavorazione, scenari di mix | famiglie di setup, regole di sequenziamento |
| Validazione del piano e APS | Il piano di questa settimana è fattibile? Quale sequenza? | da shadow a twin | ordini, date di consegna, cicli di lavorazione, capacità, avanzamento attuale | disponibilità di materiali, personale con competenze |
| Commissioning virtuale | testare il software di controllo prima del commissioning fisico | modello (modello di impianto con controllore reale o emulato) | progettazione meccanica ed elettrica, programma PLC, liste I/O, modelli di comportamento | funzioni di sicurezza, concetti di esercizio |
| Pianificazione della flotta AGV e AMR | numero di veicoli, percorsi, strategia di ricarica | modello, in seguito shadow | ordini di trasporto (origine, destinazione, quantità, tempo), layout, dati dei veicoli | regole di traffico, infrastruttura di ricarica, traffico misto |
| Valutazione energetica e di CO2 | picchi di carico, spostamenti di turno, strategie di fermo | shadow | assorbimento elettrico per stato, dati di stato, modelli di turno | prezzi dell'energia, dati misurati per macchina |
| Manutenzione | tempistica della manutenzione, scorte di ricambi | da shadow a twin | storico dei guasti, ore di funzionamento, dati di condizione | sensori, modelli di danneggiamento |

### 7.1 Pianificazione di stabilimento e layout

La pianificazione dello stabilimento è il campo classico della fabbrica digitale. In un progetto greenfield, lo stabilimento non esiste ancora, quindi non ci sono dati operativi. Il gemello digitale in questo caso è un **modello di pianificazione** costruito a partire dal programma di prodotto, dai cicli di lavorazione e dalle varianti di layout. Il suo compito è confrontare le varianti in condizioni di incertezza: quale layout resta produttivo se il mix cambia o i volumi crescono di un terzo?

I progetti brownfield sono diversi: ci sono dati, ma spesso non esiste un layout aggiornato. Le scansioni laser e le nuvole di punti 3D aiutano a rilevare lo stato reale dell'edificio. La logica di processo, però, resta quella che decide il risultato. Un modello fotorealistico dell'edificio senza cicli di lavorazione non risponderà a nessuna domanda sulla capacità. Alcuni testi divulgativi in lingua inglese chiamano questo fenomeno la "trappola della visualizzazione".

Le metriche consolidate per confrontare le varianti sono throughput, lead time, lavoro in corso (WIP), sforzo di trasporto (tonnellate-miglio o viaggi all'ora), superficie occupata e fabbisogno di manodopera.

### 7.2 Analisi della capacità e dei colli di bottiglia

La **Teoria dei Vincoli** di Goldratt presuppone che le prestazioni di un sistema siano limitate da un unico vincolo, e che qualsiasi miglioramento al di fuori del vincolo non aumenti il throughput [39]. Il problema pratico: il collo di bottiglia non si trova sempre dove il foglio di calcolo mostra l'utilizzo più alto. Si sposta con il mix di prodotti, con i setup e con i guasti. Un modello di simulazione mostra dove gli ordini si accumulano davvero e quale stazione blocca o affama le altre. Per saperne di più sul metodo, vedere la pagina di riferimento [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/).

McKinsey descrive un esempio concreto: in una linea di produzione, una sequenza ottimizzata nella stazione collo di bottiglia ha ridotto il tempo totale di lavorazione di circa il quattro percento [26]. Cifre di questo tipo sembrano modeste, ma in un vero collo di bottiglia si traducono direttamente in throughput.

### 7.3 Analisi del mix di prodotti e degli scenari

Nuovi prodotti, più varianti, lotti più piccoli: ciascuno di questi cambiamenti sposta il carico tra le risorse. Un gemello costruito su un modello PPR può importare nuove distinte base e nuovi cicli di lavorazione e mostrare quali risorse diventano critiche prima che venga prodotto il primo pezzo. McKinsey descrive un impianto di lavorazione dei metalli il cui gemello, con un agente di reinforcement learning, ha valutato migliaia di possibili combinazioni di prodotti su quattro linee di produzione parallele [26]. Gli scenari tipici includono:

- spostamenti del mix tra famiglie di prodotti,
- introduzione di un nuovo prodotto su risorse esistenti,
- riduzione delle dimensioni dei lotti e l'effetto sulla quota di tempi di attrezzaggio,
- modifica del modello di turni (da due a tre turni, turni nel fine settimana),
- perdita di una risorsa chiave o di un fornitore.

### 7.4 Programmazione della produzione e advanced planning and scheduling (APS)

I sistemi APS creano programmi e sequenze vincolati dalla capacità. Un gemello di simulazione li integra in due modi: può **far girare in anticipo un programma** e mostrare se regge sotto una variabilità realistica, e può fungere da **funzione di valutazione** per i metodi di ottimizzazione che generano molte varianti di programma. McKinsey riporta un impianto di assemblaggio in cui un programma di produzione riprogettato ha ridotto gli straordinari e ha portato a risparmi di costo mensili pari al 5-7 per cento [26]. La pagina dell'entità [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) spiega le basi della pianificazione vincolata dalla capacità, e la nostra guida al [software di programmazione della produzione e APS](https://www.m365.fm/en/learn/production-scheduling-aps/) approfondisce l'argomento.

Occorre tenere chiari i ruoli: la pianificazione classica ERP (MRP II) opera in sequenza (quantità, poi date, poi capacità), spesso con capacità infinita. Il gemello non sostituisce il sistema ERP. Ne verifica e ne migliora i risultati.

### 7.5 Virtual commissioning

Il **virtual commissioning** collauda il software di controllo di una macchina o di una linea su un modello di simulazione prima che l'equipaggiamento fisico sia installato. La linea guida più dettagliata è tedesca: la VDI/VDE 3693 Parte 1 (agosto 2016) definisce il virtual commissioning per l'automazione di processo e di fabbrica, con l'obiettivo di individuare e correggere gli errori derivanti dalla progettazione dei sistemi di automazione, e descrive i tipi di modello e la terminologia [14]. La Parte 2 (dicembre 2018) tratta l'introduzione del virtual commissioning nelle aziende; la VDI ha annunciato una revisione [15]. Non abbiamo trovato alcuno standard ANSI o ISA dedicato al virtual commissioning [unverified: nessuna fonte normativa statunitense specifica individuata durante la ricerca]; gli integratori statunitensi lavorano tipicamente con questi concetti e con i metodi propri dei fornitori degli strumenti.

Sono comuni tre varianti di accoppiamento:

| Variante | Controllore | Apparecchiature | Uso |
|---|---|---|---|
| Model-in-the-loop (MiL) | come modello | come modello | verifica precoce del concetto |
| Software-in-the-loop (SiL) | programma di controllo reale su un PLC emulato o virtuale | come modello | collaudo della logica PLC senza hardware |
| Hardware-in-the-loop (HiL) | hardware di controllo reale | come modello in tempo reale | collaudo inclusi comportamento temporale e sistemi fieldbus |

Il vantaggio consiste nello spostare la risoluzione dei problemi dalla costosa fase di messa in servizio in loco a una fase precedente e meno costosa. Percentuali affidabili e valide per l'intero settore sui risparmi di tempo sono rare; molti dei valori pubblicati sono affermazioni dei fornitori. Un esempio documentato: in una linea di pre-assemblaggio nello stabilimento di Saarbrücken, in Germania, ZF, lavorando con il Fraunhofer IESE, prevedeva una messa in servizio circa il 30 per cento più rapida grazie a un gemello digitale e al middleware Eclipse BaSyx; nel 2021 si trattava di una previsione, non di un valore misurato su molti progetti [28]. Uno studio del 2024 del Fraunhofer IWU tra i costruttori di macchine e attrezzature del Land della Sassonia, in Germania, ha rilevato che più del 90 per cento delle aziende intervistate conosce il virtual commissioning, ma solo poche ne sfruttano il potenziale nella pratica [27].

**Virtual commissioning vs. gemello di fabbrica:** Il virtual commissioning opera al livello dei segnali e del controllo, spesso in millisecondi. Un gemello di fabbrica opera al livello di ordini e risorse, in minuti o turni. Entrambi possono usare lo stesso layout ma rispondono a domande diverse. Maggiori informazioni nella pagina dell'entità [Virtual Commissioning](https://www.m365.fm/entity/virtual-commissioning/).

### 7.6 Pianificazione della flotta di AGV e AMR

I veicoli a guida automatica (AGV) e i robot mobili autonomi (AMR) sono un caso da manuale per la simulazione, perché il loro comportamento è determinato dalle interazioni: i veicoli si bloccano a vicenda agli incroci, attendono presso le stazioni di trasferimento, viaggiano a vuoto per tornare e devono ricaricarsi. Un calcolo statico (ordini di trasporto all'ora per tempo medio di percorrenza) sottostima regolarmente il numero di veicoli necessari, perché mancano i viaggi a vuoto, i tempi di attesa e le soste per la ricarica.

Per la sicurezza, due standard statunitensi inquadrano questi progetti. **ANSI/ITSDF B56.5-2024**, *Safety Standard for Guided Industrial Vehicles*, definisce i requisiti di sicurezza per la progettazione, l'esercizio e la manutenzione dei veicoli industriali automatici guidati, motorizzati e senza conducente, e dei sistemi di cui fanno parte [53]. **ANSI/A3 R15.08-1-2020 (R2026)**, *Industrial Mobile Robots: Safety Requirements, Part 1*, si rivolge ai costruttori di robot mobili industriali e si basa sulla valutazione del rischio all'interno di un ambiente operativo documentato [54]. In Germania, la linea guida **VDI 2510** riguarda i sistemi AGV per il flusso dei materiali all'interno dello stabilimento; l'edizione attuale risale al 2005, mentre una bozza di luglio 2025 tratta i sistemi AGV e AMR, includendo tipologie di veicoli, controllo della flotta, navigazione, alimentazione elettrica, trasmissione dati, infrastrutture e sicurezza [18]. Una simulazione non sostituisce la valutazione del rischio richiesta da questi standard, ma mostra in anticipo dove regole di traffico, zone di velocità e traffico misto con le persone generano conflitti.

Domande tipiche per la simulazione di un sistema AGV:

- Quanti veicoli servono al carico di picco e quanti in media?
- Quali percorsi, regole a senso unico e posizioni di attesa evitano la congestione?
- Quale strategia di ricarica (ricarica di opportunità, sostituzione della batteria) mantiene alta la disponibilità?
- In che modo il traffico misto con carrelli elevatori e pedoni influisce sulle prestazioni?
- Cosa succede se un veicolo o una stazione di trasferimento si guasta?

**Esempio svolto con valori illustrativi:** si supponga che un'area di assemblaggio richieda 60 trasporti all'ora e che un viaggio a carico duri in media 3 minuti. Il calcolo semplificato dà 60 × 3 = 180 minuti di percorrenza all'ora, ovvero 3 veicoli. Si aggiunga il viaggio a vuoto fino al successivo prelievo (anche qui 3 minuti) e 1 minuto ciascuno per il prelievo e la consegna: ogni trasporto richiede 8 minuti, cioè 480 minuti all'ora, pari a 8 veicoli pienamente utilizzati. Con un'utilizzazione obiettivo dell'80 per cento e una disponibilità dell'85 per cento a causa della ricarica, si ottiene 8 / (0,8 × 0,85) ≈ 11,8, cioè 12 veicoli. La congestione agli incroci e l'attesa presso le stazioni di trasferimento non sono ancora inclusi; solo la simulazione può rilevarli.

Il fabbisogno di dati è gestibile ma spesso sottovalutato: servono una **matrice dei trasporti** (da dove a dove, con quale frequenza, in quali momenti), che può essere derivata dai cicli di lavorazione, dalle distinte base e dal concetto di alimentazione a bordo linea. Qui un modello PPR è utile, perché conosce già i fabbisogni di materiale per ogni operazione. Per il controllo di flotte miste reali si utilizzano sempre più spesso ambienti 3D basati sulla fisica; NVIDIA, ad esempio, descrive il suo blueprint "Mega" (introdotto in anteprima nel 2025) come flusso di lavoro di riferimento per testare flotte di robot in gemelli digitali di stabilimenti [25]. Ulteriori informazioni nella pagina dell'entità [Automated Guided Vehicle](https://www.m365.fm/entity/automated-guided-vehicle/).

### 7.7 Energia e CO2

Un gemello digitale di produzione può modellare il consumo energetico per stato: una macchina assorbe potenze diverse durante la lavorazione, in attesa, durante l'attrezzaggio e quando è ferma. Combinato con il flusso degli ordini, la simulazione mostra i picchi di carico e l'effetto di misure come lo spostamento dei turni, lo spegnimento automatico durante le pause o sequenze modificate. Il presupposto sono i valori di potenza per stato, che si misurano oppure si ricavano dai dati dei costruttori. Le cifre affidabili sul potenziale di risparmio dipendono fortemente dal singolo caso; diffidate delle percentuali generiche.

### 7.8 Manutenzione

La manutenzione predittiva è spesso citata come l'esempio principale di gemello digitale. In pratica si tratta di due discipline diverse: il monitoraggio delle condizioni e la previsione dei guasti lavorano con dati di sensori e con modelli statistici o fisici del danno a livello di singolo asset. Un gemello di produzione può trarne beneficio assumendo il fermo previsto come scenario e mostrando quali ordini ne risultano colpiti e quando una finestra di manutenzione causa il danno minore.

## 8. Gemelli digitali con Microsoft Azure e Fabric

Molti produttori gestiscono la propria IT aziendale su Microsoft 365 e Azure. Per loro la domanda è quali servizi Microsoft siano candidati ai gemelli digitali e quale sia il loro stato. L'episodio [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/) offre una panoramica del ruolo di Azure.

### Azure Digital Twins

**Azure Digital Twins** è un'offerta platform-as-a-service (PaaS) per creare grafi di gemelli basati su modelli digitali di interi ambienti, come edifici, stabilimenti, reti energetiche o città [21]. I modelli sono scritti nel **Digital Twins Definition Language (DTDL)**. Azure Digital Twins supporta DTDL v2 e v3, e Microsoft raccomanda la v3 per via delle sue capacità estese; un'interfaccia v3 può estendere un'interfaccia v2, ma non viceversa [22]. Microsoft fornisce inoltre ontologie che raccolgono modelli DTDL basati su standard di settore [22]. Al momento della nostra verifica, la pagina di panoramica non conteneva alcun avviso di ritiro [21].

Azure Digital Twins è una piattaforma di modellazione e grafi, non un software di simulazione. Rappresenta relazioni e stati ed elabora eventi; la simulazione a eventi discreti, il confronto di scenari e l'ottimizzazione devono provenire da altri strumenti.

### Digital twin builder in Microsoft Fabric (anteprima)

Con **digital twin builder**, Microsoft ha introdotto nel 2025 un elemento nel carico di lavoro Real-Time Intelligence di Microsoft Fabric. Serve a modellare concetti di business come asset e processi in una **ontologia**, a mappare dati provenienti da vari sistemi di origine su istanze di questi tipi di entità e a creare relazioni semantiche tra di esse; i dati risiedono in OneLake [23]. Al momento della stesura, Microsoft classifica esplicitamente digital twin builder come **anteprima** (Microsoft Learn, pagina aggiornata l'ultima volta il 20 maggio 2026; verificata il 20 novembre 2026) [23]. Microsoft sottolinea inoltre che digital twin builder è un servizio diverso da Azure Digital Twins [21][23]. Nel blog di Fabric, Microsoft cita esempi manifatturieri come gemelli di macchine e processi per l'analisi delle cause radice e per domande di tipo what-if, nonché partner che forniscono schemi di dati di produzione e query di KPI, ad esempio per la overall equipment effectiveness (OEE) [24].

### Quale servizio per quale scopo?

| Esigenza | Approccio adatto | Nota |
|---|---|---|
| Grafo di asset, spazi e attrezzature con elaborazione di eventi, in produzione | Azure Digital Twins con DTDL v3 [21][22] | servizio PaaS generalmente disponibile; aggiungere la simulazione separatamente |
| Ontologia su ERP, MES e dati dei sensori su una piattaforma dati Fabric | digital twin builder in Fabric [23] | anteprima: per pilot e valutazioni; verificare l'uso in produzione rispetto ai termini di anteprima di Microsoft |
| Capacità, colli di bottiglia, scenari, layout | strumento di simulazione (sezione 15), risultati in Fabric o Power BI | né Azure Digital Twins né digital twin builder sono software di simulazione |

### Cosa apportano gli amministratori di M365 e Azure

Un gemello di produzione non è un progetto puramente OT. L'IT contribuisce con elementi fondamentali:

- **Identità e permessi:** chi può creare scenari e chi può approvare i risultati? Ruoli in Microsoft Entra ID, diritti separati per modellazione, analisi e write-back.
- **Piattaforma dati:** collegamento di ERP e MES a una piattaforma dati centrale, storicizzazione, regole di qualità dei dati, cataloghi.
- **Governance:** classificazione dei dati di produzione e dei clienti, conservazione, registri di accesso. Per i fornitori del settore difesa, questo include la gestione delle controlled unclassified information (CUI) secondo DFARS e CMMC; la nostra guida alla [pianificazione della produzione aerospaziale](https://www.m365.fm/en/learn/aerospace-production-planning/) illustra tali regole.
- **Reportistica e collaborazione:** pubblicazione dei risultati di simulazione in Power BI, canali Teams per le decisioni sugli scenari, versionamento degli stati del modello.
- **Sicurezza:** segmentazione di rete tra IT e OT, nessun accesso diretto in scrittura dal cloud ai controllori senza una catena di approvazione definita (vedi sezione 16).

La nostra guida su [Azure per la manifattura](https://www.m365.fm/en/learn/manufacturing-it-azure/) tratta in dettaglio l'IT manifatturiero su Azure.

## 9. Intelligenza artificiale e gemello digitale

IA e gemello digitale si completano a vicenda in entrambe le direzioni: il gemello fornisce all'IA un contesto strutturato e uno spazio sicuro per sperimentare, mentre l'IA accelera ed estende il gemello. Cinque schemi sono rilevanti nel settore manifatturiero:

1. **Preparazione dei dati:** il machine learning individua valori anomali nelle conferme, stima i tempi mancanti e ricava distribuzioni dai dati effettivi. Non è spettacolare, ma spesso è la leva pratica più importante.
2. **Modelli surrogati:** un modello di simulazione dettagliato viene usato per "addestrare" una rete neurale o un altro surrogato con molte esecuzioni; il surrogato fornisce poi approssimazioni in pochi secondi. È utile per ottimizzazioni che richiedono moltissime valutazioni. I limiti si trovano al di fuori dell'intervallo di addestramento.
3. **Ottimizzazione e apprendimento per rinforzo:** agenti apprendono regole di controllo all'interno del modello di simulazione, ad esempio per il sequenziamento o il dispatching dei veicoli, senza disturbare la produzione reale. L'esempio McKinsey della lavorazione dei metalli nella sezione 7.3 ha usato questo approccio [26]. Le regole sono buone solo quanto la fedeltà del modello.
4. **IA generativa come interfaccia:** i modelli linguistici traducono domande come "Cosa succede se la linea 3 è ferma per una settimana?" in scenari e spiegano i risultati. Il presupposto è un modello semanticamente pulito (ontologia, grafo PPR) affinché l'IA non debba tirare a indovinare.
5. **IA fisica e robotica:** i gemelli 3D basati sulla fisica servono da ambienti di addestramento e di test per robot e veicoli autonomi; NVIDIA posiziona Omniverse e il blueprint Mega, basati su OpenUSD, a questo scopo [25].

**Una valutazione sobria:** l'IA non sostituisce né la validazione né la competenza di dominio. Un modello linguistico che lavora su un routing errato produce rapidamente risposte plausibili ma sbagliate. L'ordine è quindi: prima la base dati e il modello, poi l'IA.

## 10. Roadmap: implementazione in sei fasi

La seguente roadmap è una guida per un gemello di produzione o di stabilimento. Le durate sono l'esperienza dell'autore per uno stabilimento di medie dimensioni con un primo caso d'uso chiaramente delimitato [unverified: stime basate sull'esperienza di progetto dell'autore, non su dati di benchmark]; McKinsey indica un intervallo da due-tre mesi a oltre un anno per i progetti di gemello, a seconda delle capacità del team e della complessità dello stabilimento [26]. Il post [Digital twin in manufacturing: where to start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/) descrive anche come compiere il primo passo.

| Fase | Contenuto | Risultato | Durata tipica |
|---|---|---|---|
| 1 Domanda | definire la decisione, fissare metriche e obiettivi, assegnare i responsabili | scheda di progetto di una pagina con domanda guida, metriche, confini del sistema | 2–4 settimane |
| 2 Inventario dei dati | verificare i dati di ERP, MES e layout, controllare la qualità dei dati, colmare le lacune | mappa dei dati, rapporto sulla qualità, elenco delle azioni | 3–6 settimane |
| 3 Modello pilota | modello PPR per un flusso di valore o un'area, modello di simulazione eseguibile | modello pilota validato | 6–12 settimane |
| 4 Validazione e prima decisione | confronto con i dati effettivi, esecuzione di scenari, preparazione della decisione | decisione documentata con le ipotesi | 2–6 settimane |
| 5 Operatività | flussi automatici di dati, ruoli, processi di manutenzione, validazione periodica dello schedule | funzionamento in parallelo (shadow) nell'esercizio di routine | 2–6 mesi |
| 6 Scalabilità | più aree, stabilimenti, casi d'uso, integrazione con APS, energia, AGV | portafoglio di gemelli su una base dati comune | continua |

**Principi guida per la roadmap:**

- **Prima una decisione.** Un gemello che migliora una decisione concreta di investimento o di pianificazione finanzia la fase successiva.
- **Prima i dati, poi la piattaforma.** Verificare la qualità dei dati prima di scegliere gli strumenti.
- **Operations in primo piano.** Pianificatori e capireparto devono comprendere il modello e fidarsene. Un modello che solo il gruppo di simulazione sa gestire scompare al prossimo cambio di personale.
- **Manutenzione fin dal primo giorno.** Stabilire presto chi aggiorna il modello quando cambiano routing, layout o turni.

**Supporto per piccole e medie imprese manifatturiere:** negli Stati Uniti, il NIST Manufacturing Extension Partnership (MEP), programma del National Institute of Standards and Technology del Dipartimento del Commercio con oltre 450 sedi di servizio in tutti i 50 stati e a Porto Rico, è un punto di partenza comune per le aziende più piccole che desiderano un supporto esterno per i progetti di digitalizzazione [60]. Il rapporto NIST sui casi d'uso della ISO 23247 è stato redatto proprio pensando a questo pubblico [47].

## 11. Qualità dei dati: il prerequisito sottovalutato

In molti progetti di digital twin, la prima verifica dei dati mostra già il problema: i dati anagrafici nel sistema ERP descrivono lo stabilimento più come era stato pianificato una volta che come funziona oggi. Questa non è una critica alla gestione dei dati anagrafici. Deriva dal fatto che i sistemi ERP vengono mantenuti principalmente per la contabilità dei costi e per la pianificazione dei materiali, non per la simulazione.

### Problemi tipici dei dati

- **I tempi standard** provengono dalla contabilità dei costi o da studi dei tempi eseguiti anni fa (in Germania spesso studi REFA, l'equivalente tedesco del classico cronometraggio dell'ingegneria industriale) e si discostano in modo considerevole dai tempi effettivi.
- **I tempi di attrezzaggio** sono memorizzati come valori fissi, sebbene nella realtà dipendano dalla sequenza (matrice degli attrezzaggi).
- **I gruppi di centri di lavoro** raggruppano macchine che in realtà differiscono (età, disponibilità, competenze degli operatori).
- **I calendari dei turni** non riflettono i turni aggiuntivi, i periodi di orario ridotto (in Germania: *Kurzarbeit*, lavoro a orario ridotto sovvenzionato dallo Stato) o le carenze di personale.
- **I fermi macchina** non vengono affatto registrati nel sistema ERP e vengono registrati nel MES con codici motivo incoerenti.
- **Le distinte base di produzione** si discostano dalla distinta base di ingegneria senza che lo scostamento sia documentato.
- **Le conferme** vengono registrate in blocco alla fine del turno, quindi i timestamp non riflettono la sequenza reale degli eventi.
- **I tempi di trasferimento** e i percorsi interni allo stabilimento mancano del tutto.

### Checklist prima di costruire il modello

| Verifica | Domanda | Metodo |
|---|---|---|
| Completezza | Ogni materiale rilevante ha un ciclo di lavorazione e ogni operazione un centro di lavoro? | query per collegamenti mancanti |
| Attualità | Quando sono stati rivisti per l'ultima volta i tempi standard? | data di modifica per ciclo di lavorazione |
| Plausibilità | Quanto è ampio lo scarto tra tempi standard e tempi effettivi? | confronto con le conferme su tre-sei mesi |
| Granularità | I centri di lavoro sono abbastanza dettagliati per la domanda posta? | confronto incrociato con il layout e un gemba walk |
| Coerenza | I nomi corrispondono tra ERP, MES e layout? | tabella di mappatura |
| Timestamp | Le conferme vengono registrate tempestivamente? | distribuzione degli orari di registrazione lungo il turno |
| Fermi macchina | Esiste un unico catalogo dei motivi di fermo? | analisi di frequenza dei motivi |
| Responsabilità | Chi mantiene quali dati e chi approva le modifiche? | matrice RACI |

**Regola empirica:** un modello di simulazione può colmare le lacune nei dati con ipotesi, purché le ipotesi siano documentate e verificate con analisi di sensitività. Un twin che calcola silenziosamente con tempi standard errati è pericoloso, perché appare preciso.

Un effetto collaterale che molte aziende sottovalutano: l'inventario dei dati necessario per un twin spesso migliora da solo la qualità della pianificazione nel sistema ERP, perché rende evidenti cicli di lavorazione obsoleti e capacità errate.

## 12. Costi e benefici, valutati con onestà

### Fattori di costo

Secondo la valutazione dell'autore, il costo di un gemello digitale di produzione è di solito dominato non dal software ma dal lavoro su dati e modelli. I principali fattori di costo sono:

- **Preparazione dei dati:** interfacce, pulizia, mappatura, chiarimenti con il business.
- **Modellazione e validazione:** costruzione del modello PPR e del modello di simulazione, confronto con la realtà.
- **Manutenzione:** aggiornamenti quando cambiano prodotti, processi o layout. Questa voce manca in molti business case.
- **Formazione:** formazione di pianificatori e utenti chiave, costruzione di competenze interne.
- **Software e infrastruttura:** licenze, risorse cloud, integrazione.

Per gli studi di simulazione, una società tedesca di servizi di simulazione indica come regola empirica che il costo non dovrebbe superare l'1 percento dell'investimento interessato, e fa riferimento a studi e benchmark (incluso VDI) che collocano il rapporto costi-benefici in media intorno a 1:6 [30]. Questi valori provengono da una fonte del fornitore: verificate lo studio originale prima di usarli nel vostro business case.

### Esempi di benefici documentati

Dati sui benefici affidabili e raccolti in modo indipendente sono rari. I valori seguenti sono documentati, ma si riferiscono a casi individuali:

| Fonte | Contesto | Valore |
|---|---|---|
| McKinsey (2024) [26] | stabilimento di assemblaggio, piano di produzione riprogettato | risparmi sui costi mensili del 5–7% grazie a meno straordinari |
| McKinsey (2024) [26] | ottimizzazione della sequenza a una stazione collo di bottiglia | circa il 4% di tempo di lavorazione totale in meno |
| McKinsey (2024) [26] | indagine su 75 dirigenti industriali senior (giugno 2022) | l'86% ritiene i gemelli applicabili, il 44% ne ha già implementato uno, il 15% sta pianificando di farlo |
| ZF / Fraunhofer IESE (2021) [28] | linea di pre-assemblaggio, Saarbrücken (Germania), middleware Eclipse BaSyx | circa il 30% di messa in servizio più rapida (aspettativa, non una media) |
| Fraunhofer IWU (2024) [27] | indagine su costruttori di macchine e attrezzature in Sassonia (Germania) | più del 90% conosce il commissioning virtuale, solo alcuni ne sfruttano il potenziale |

Per contesto sul clima degli investimenti negli Stati Uniti: nella Smart Manufacturing and Operations Survey 2025 di Deloitte (600 dirigenti di produttori statunitensi con ricavi pari o superiori a 500 milioni di dollari, condotta tra agosto e settembre 2024), il 78 percento dei dirigenti ha dichiarato di destinare più del 20 percent del proprio budget di miglioramento a iniziative di smart manufacturing; i rispondenti hanno riportato miglioramenti fino al 20 percento nella produzione [56]. Si tratta di dati autodichiarati relativi allo smart manufacturing nel suo complesso, non specificamente ai gemelli digitali.

### Il business case in cinque domande

1. **Quale decisione** migliora il gemello, e con che frequenza viene presa (una volta per un progetto di investimento, o settimanalmente nella schedulazione)?
2. **Quanto costa una decisione sbagliata** (investimento sovra- o sottodimensionato, consegne in ritardo, straordinari, rotture di stock)?
3. **Di quanto diventa più accurata** la decisione con il gemello? Un pilota vi fornisce un primo confronto tra piano, simulazione e risultati effettivi.
4. **Quanto costa il gemello** in tre-cinque anni, inclusa la manutenzione?
5. **Quali benefici collaterali** emergono (dati anagrafici migliori, verifiche preventivi più rapide, riutilizzo in altre aree)?

Per decisioni di investimento nell'ordine dei milioni di dollari, un singolo dimensionamento errato evitato può giustificare un progetto di simulazione. Per i gemelli di pianificazione continuativa, decide la frequenza d'uso.

## 13. Errori comuni e come evitarli

| Errore | Conseguenza | Contromisura |
|---|---|---|
| tecnologia prima della domanda | piattaforma costosa senza beneficio | charter di una pagina con una decisione concreta e una metrica prima di qualsiasi scelta di strumento |
| confondere la visualizzazione 3D con un gemello digitale | belle immagini, nessuna risposta alle domande sulla capacità | prima la logica di processo (PPR), poi la geometria |
| modellare tutto contemporaneamente | il progetto non viene mai completato | un value stream o un'area come pilota |
| adottare i dati di riferimento senza verifica | risultati precisi all'apparenza ma errati | controllo di qualità dei dati (sezione 11), confronto con i tempi effettivi |
| nessuna validazione | perdita di fiducia alla prima deviazione | confronto sistematico con i dati effettivi, ipotesi documentate |
| medie invece di distribuzioni | colli di bottiglia e scorte sottostimati | distribuzioni dai dati effettivi, scomposizione del modello |
| una sola replica di simulazione | un risultato casuale presentato come verità | più repliche, intervalli di confidenza [41] |
| nessun piano di manutenzione | modello obsoleto dopo pochi mesi | ruoli, processi e budget per la manutenzione |
| modello accessibile solo agli specialisti | la conoscenza va perduta con una sola persona | interfacce comprensibili, formazione, documentazione |
| ciclo di feedback senza approvazione | rischio per la sicurezza e responsabilità | approvazione umana, registrazione, concetto di sicurezza IT/OT |
| termini non definiti | malintesi in RFP e contratto | specificare esplicitamente il livello di integrazione (modello, shadow, gemello) [5] |

## 14. Norme e linee guida in sintesi

| Norma/linea guida | Titolo (breve) | Stato | Rilevanza |
|---|---|---|---|
| ISO 23247-1 a -4 | Framework per il gemello digitale nel manifatturiero: panoramica, architettura di riferimento, rappresentazione digitale, scambio di informazioni | 2021 [6] | framework e struttura per i gemelli manifatturieri |
| ISO 23247-5 | Digital thread per il gemello digitale | 2026 (indicata nel catalogo ISO come Edizione 1, 2026-06, ancora mostrata come "in pubblicazione" il 20 novembre 2026) [7] | collegamento delle informazioni del ciclo di vita |
| ISO 23247-6 | Composizione del gemello digitale | pubblicata il 14 luglio 2026 [8] | composizione di più gemelli |
| NIST AMS 400-2 | Use Case Scenarios for Digital Twin Implementation Based on ISO 23247 | maggio 2021 [47] | linee guida statunitensi per l'implementazione di ISO 23247 |
| ISO/IEC 30173 | Digital twin: Concepts and terminology | novembre 2023 [9] | termini trasversali ai settori |
| NIST IR 8356 | Security and Trust Considerations for Digital Twin Technology | febbraio 2025 [49] | sicurezza e fiducia |
| IEC 63278-1 | Asset Administration Shell per applicazioni industriali, Parte 1: Struttura | 14 dicembre 2023 [10] | Asset Administration Shell |
| DIN SPEC 91345 | Reference Architecture Model Industrie 4.0 (RAMI 4.0) | 2016 [12] | framework Industria 4.0 (tedesco) |
| ANSI/ISA-95 (IEC 62264) | Integrazione dei sistemi di controllo aziendali | serie di norme [58][19] | livelli ERP/MES/controllo, modelli dati |
| ANSI/MTC1.4-2018 (MTConnect) | interoperabilità dei dati di produzione | edizione 2018 [57] | dati delle macchine, comune nelle officine meccaniche statunitensi |
| IEC 62541 (OPC UA) | OPC Unified Architecture | serie di norme | comunicazione con le macchine e modelli informativi |
| VDI 3633 Parte 1 | Simulazione di sistemi nella movimentazione dei materiali, logistica e produzione: fondamenti | dicembre 2014 [13] | metodo dello studio di simulazione (tedesco) |
| VDI/VDE 3693 Parte 1 | Virtual commissioning: tipi di modello e glossario | agosto 2016 [14] | termini del virtual commissioning (tedesco) |
| VDI/VDE 3693 Parte 2 | Virtual commissioning: introduzione nelle aziende | dicembre 2018, revisione annunciata [15] | introduzione del virtual commissioning (tedesco) |
| VDI 4499 Parte 1 | Digital factory: fondamenti | nuova edizione aprile 2026 (prima edizione febbraio 2008) [16] | termine e architettura della digital factory (tedesco) |
| ANSI/ITSDF B56.5-2024 | Safety Standard for Guided Industrial Vehicles | 2024 [53] | sicurezza degli AGV (USA) |
| ANSI/A3 R15.08-1-2020 (R2026) | Industrial Mobile Robots: Safety Requirements, Part 1 | confermata nel 2026 [54] | sicurezza degli AMR (USA) |
| VDI 2510 | Sistemi di veicoli a guida automatica (AGVS) | ottobre 2005, bozza luglio 2025 [18] | AGV e AMR (tedesco) |
| ISA/IEC 62443 | Sicurezza per i sistemi di automazione e controllo industriale | serie di norme [59] | sicurezza dei sistemi di automazione |
| NIST SP 800-82 Rev. 3 | Guide to Operational Technology (OT) Security | settembre 2023 [55] | linee guida per la sicurezza OT (USA) |

## 15. Categorie di software: un confronto neutrale

Il mercato è difficile da orientare perché molti fornitori definiscono il proprio prodotto un "digital twin". Una classificazione per funzione è più utile:

| Categoria | Funzione principale | Punti di forza | Limiti | Utenti tipici |
|---|---|---|---|---|
| Strumenti di simulazione a eventi discreti | simulazione del flusso di materiali e dello stabilimento | elevata libertà di modellazione, metodo consolidato | costruzione del modello laboriosa, richiede competenze specifiche | esperti di simulazione, pianificazione di stabilimento |
| Strumenti di simulazione multi-metodo | combinazione di eventi discreti, agent-based, dinamica dei sistemi | flessibili per questioni miste | curva di apprendimento ripida | esperti di simulazione e logistica |
| Suite di fabbrica digitale e PLM | layout, robotica, pianificazione dei processi, simulazione in un contesto PLM | continuità dalla progettazione alla produzione | complessità, costi di licenza | grandi imprese, automotive |
| Strumenti di commissioning virtuale | modelli di impianti con accoppiamento PLC (SiL/HiL) | test del controllo prima dell'installazione | focus sull'impianto, non sullo stabilimento | ingegneri di controllo, costruttori di macchine |
| Strumenti di pianificazione basati su value stream e PPR | modello da dati ERP e value stream, simulazione, scenari | costruzione rapida da dati esistenti, vicinanza alle operations | meno adatti a sistemi di trasporto dettagliati | pianificazione della produzione, lean, direzione di stabilimento |
| Sistemi APS | pianificazione e sequenziamento vincolati dalla capacità | programmazione operativa | simulazione spesso limitata | pianificazione e controllo della produzione |
| Piattaforme IoT e twin | modelli di asset, elaborazione di eventi, grafi (ad esempio Azure Digital Twins) | scala, integrazione, tempo reale | nessuna simulazione integrata | IT, team delle piattaforme dati |
| Piattaforme 3D e fisiche | scene fotorealistiche, fisica, addestramento robot (ad esempio su OpenUSD) | visualizzazione, robotica, addestramento AI | logica di processo e dinamica degli ordini non sono il focus | robotica, grandi progetti |

**Criteri di selezione:** Lo strumento è adatto alla domanda e al livello di dettaglio richiesto? Con quale rapidità si può costruire un modello dai dati esistenti? Il personale operativo può usarlo autonomamente? Come viene mantenuto? Quali interfacce esistono verso ERP, MES e la piattaforma dati? Quali standard (AAS, OPC UA, MTConnect, DTDL) sono supportati? Dove risiedono i dati e chi vi ha accesso?

## 16. Sicurezza, proprietà dei dati e normativa

Un digital twin di produzione contiene informazioni sensibili: strutture di prodotto, tempi di processo, capacità e ordini dei clienti descrivono il know-how e la posizione competitiva di un'azienda. Più elevato è il livello di integrazione, maggiore è il rischio.

- **Separazione IT/OT:** Un twin che scrive verso i controlli richiede un concetto di zone e condotti secondo la norma ISA/IEC 62443, la serie che definisce requisiti e processi per i sistemi di automazione e controllo industriale sicuri [59], oltre a punti di attraversamento definiti e logging. La NIST SP 800-82 Rev. 3 (settembre 2023) è la guida del governo degli Stati Uniti per la protezione delle tecnologie operative, con architetture tipiche, minacce e contromisure [55].
- **Rischi specifici dei twin:** La NIST IR 8356 (versione finale, febbraio 2025) analizza le sfide di cybersicurezza tradizionali e nuove delle architetture di digital twin e collega le considerazioni di fiducia alla linea guida NIST esistente [49]. Usatela come checklist quando il twin aggrega dati di molti sistemi in un unico punto.
- **Catene di approvazione:** Le raccomandazioni del twin dovrebbero essere approvate da persone prima di avere effetto su ERP, MES o controlli, almeno finché l'affidabilità non è stata dimostrata.
- **Proprietà dei dati:** Stabilire per contratto chi possiede i modelli e i dati derivati, dove vengono elaborati e se i fornitori possono utilizzarli per scopi propri (come l'addestramento di sistemi AI).
- **Normativa per gli esportatori verso l'UE:** Il **Cyber Resilience Act** dell'Unione Europea (Regolamento (UE) 2024/2847) stabilisce requisiti di cybersicurezza per i prodotti con elementi digitali venduti nell'UE. Gli obblighi di segnalazione delle vulnerabilità sfruttate attivamente si applicano dal 11 settembre 2026; i restanti obblighi si applicano dall'11 dicembre 2027 [36]. Per i costruttori statunitensi di macchine connesse e software venduti nell'UE, ciò è direttamente rilevante; per i gestori di stabilimenti, incide indirettamente attraverso i requisiti imposti ai loro fornitori.

## 17. Costruire un gemello digitale da dati ERP e di flusso del valore con iFAKT Polaris

> **Nota: l'autore lavora presso iFAKT GmbH.**

Questa sezione descrive un approccio di soluzione che segue il principio spiegato nella sezione 5: costruire il gemello digitale della produzione a partire dai dati ERP e del flusso del valore esistenti, attraverso un modello prodotto-processo-risorsa. Le informazioni provengono dalle pagine prodotto di iFAKT GmbH e possono essere verificate lì; l'autore non dispone di test comparativi indipendenti.

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), con sede a Stoccarda, Germania, dichiara di essere attiva da oltre 25 anni e di sviluppare software per la mappatura del flusso del valore, la simulazione della produzione, la pianificazione e l'ottimizzazione [35]. L'azienda descrive la sua piattaforma [iFAKT Polaris](https://www.m365.fm/entity/polaris/) come un modo per collegare i dati ERP a un gemello digitale della produzione, al fine di ottimizzare i piani e far emergere i colli di bottiglia; la piattaforma comprende moduli per la modellazione del flusso del valore e degli swimlane (VSM/BSM), Designer, Simulator, Optimizer, Operator e Analyzer [35].

**Polaris Designer:** Secondo la pagina del fornitore, Designer trasforma i dati di input in un **grafo di conoscenza PPR** strutturato, che collega in un unico modello i prodotti (distinte base di produzione e di progettazione, MBOM/EBOM), i processi (tempi di attrezzaggio, di macchina e di movimentazione) e le risorse (postazioni, team, zone) con i relativi vincoli. Gli input sono dati ERP, distinte base di produzione, tempi di processo, strutture delle risorse e vincoli. A partire da questi, Designer genera automaticamente diagrammi di rete basati sulla logica produttiva reale, mostra il percorso critico e le risorse critiche, evidenzia i processi collo di bottiglia, confronta i lead time attuali e ottimizzati e assegna le zone in base alle relazioni prodotto-processo. Il fornitore posiziona il grafo come base comune ("single source of truth") per simulazione e ottimizzazione [33]. Maggiori dettagli nella pagina dell'entità [Polaris Designer](https://www.m365.fm/entity/polaris-designer/).

**Polaris Simulator:** Secondo il fornitore, Simulator si basa sul grafo PPR creato in Designer ed esegue i diagrammi di rete attraverso modelli configurabili di postazione, linea e reparto produttivo (hall), per linee singole e multiple. Il suo scopo è rendere trasparente l'utilizzo della capacità tra turni e scenari, rilevare colli di bottiglia e squilibri di utilizzo nel tempo, mostrare il sovra- e sotto-utilizzo così come l'utilizzo del personale in funzione del tempo, e valutare scenari per capacità, impiego della manodopera e buffer, nonché mix di prodotti dinamici su risorse condivise [34]. Maggiori dettagli nella pagina dell'entità [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/).

**Contesto tecnico:** I dipendenti di iFAKT hanno pubblicato sulle questioni di fondo nella letteratura specialistica tedesca, ad esempio sulla simulazione dinamica dei flussi del valore (ZWF 109(11), 2014) [31] e, con partner di ricerca, su un'interfaccia dati universale per servizi digitali del flusso del valore (ZWF 118(5), 2023) [32].

**Valutazione:** Un approccio basato su PPR e flusso del valore è particolarmente adatto a questioni di pianificazione della produzione, capacità, colli di bottiglia e impiego della manodopera in aree di assemblaggio e fabbricazione ad alta varietà. Per sistemi di trasporto dettagliati, celle robotizzate o commissioning virtuale a livello di segnale, le categorie specializzate della sezione 15 sono più adatte. Come per qualsiasi strumento, verificate in un pilota con i vostri dati se i risultati rispondono alla vostra domanda. La nostra guida dedicata a [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) tratta la piattaforma in modo più approfondito.

## 18. Glossario

| Termine | Spiegazione |
|---|---|
| Advanced planning and scheduling (APS) | software per la pianificazione e il sequenziamento vincolati dalla capacità |
| Agent-based simulation (ABS) | modellazione di unità autonome (agenti) con regole proprie, le cui interazioni producono il comportamento del sistema |
| AGV / AMR | veicolo a guida automatica / robot mobile autonomo [53][54] |
| Asset Administration Shell (AAS) | rappresentazione digitale standardizzata di un asset secondo la IEC 63278 [10] |
| Collo di bottiglia (vincolo) | risorsa che limita la produttività dell'intero sistema [39] |
| Fabbrica digitale | termine generale per modelli, metodi e strumenti digitali per la pianificazione e il miglioramento della fabbrica reale (linea guida tedesca VDI 4499) [16][17] |
| Modello digitale | rappresentazione digitale senza scambio automatico di dati con l'oggetto fisico [5] |
| Ombra digitale (digital shadow) | rappresentazione con flusso automatico di dati dal fisico al digitale, ma flusso di ritorno manuale [5] |
| Filo digitale (digital thread) | collegamento continuo delle informazioni lungo il ciclo di vita; trattato nella ISO 23247-5 [7] |
| Gemello digitale (digital twin) | rappresentazione con flusso automatico di dati in entrambe le direzioni [5]; spesso usato in senso più ampio nella pratica |
| Simulazione a eventi discreti (DES) | simulazione il cui orologio salta da un evento al successivo; lo standard nella simulazione di produzione |
| DTDL | Digital Twins Definition Language, linguaggio di modellazione basato su JSON per Azure Digital Twins [22] |
| ERP | enterprise resource planning, il sistema gestionale centrale con anagrafiche, ordini e pianificazione dei materiali |
| HiL / SiL / MiL | hardware-, software-, model-in-the-loop: varianti di accoppiamento per il virtual commissioning |
| ISA-95 / IEC 62264 | serie di standard per l'integrazione dei sistemi aziendali e di controllo [58] |
| Legge di Little | L = λ · W: in regime stazionario, la giacenza media è uguale al tasso di produttività moltiplicato per il lead time [37] |
| Simulazione dei flussi di materiale | simulazione dei flussi di materiali e ordini attraverso produzione e logistica, di norma a eventi discreti |
| MBOM / EBOM | distinta base di produzione / distinta base di progettazione |
| MES | manufacturing execution system, gestione delle operazioni al livello 3 ISA-95 |
| MTConnect | standard aperto per l'interoperabilità dei dati di produzione, pubblicato come ANSI/MTC1.4-2018 [57] |
| OPC UA | standard di comunicazione indipendente dal fornitore con modelli informativi (IEC 62541) |
| Modello PPR | modello prodotto-processo-risorsa, il principio strutturale della fabbrica digitale |
| Replicazione | esecuzione ripetuta della simulazione con numeri casuali diversi per ottenere confidenza statistica [41] |
| Validazione | verifica che il modello rappresenti la realtà con accuratezza sufficiente per lo scopo previsto |
| Simulazione del value stream | simulazione dinamica di una mappa del flusso del valore nel tempo [31] |
| Verifica | controllo che il modello sia stato implementato correttamente |
| Virtual commissioning | collaudo del software di controllo su un modello di simulazione prima della messa in servizio fisica [14] |
| VVUQ | verification, validation and uncertainty quantification; proposto dal NIST come futura parte della ISO 23247 [48] |
| Periodo di riscaldamento (warm-up) | fase iniziale di un'esecuzione di simulazione i cui risultati vengono scartati a causa dello stato di partenza vuoto |

## 19. FAQ: gemelli digitali nella produzione

### Che cos'è un gemello digitale nella produzione, in termini semplici?
Un gemello digitale è un modello informatico eseguibile della tua produzione, aggiornato con dati provenienti dalle operazioni reali. Puoi usarlo per simulare le operazioni, individuare i colli di bottiglia e testare le modifiche prima di applicarle sul reparto produttivo reale.

### Quali sono i 4 tipi di gemelli digitali?
Uno schema comune a quattro livelli distingue gemelli di componenti (parti), gemelli di asset, gemelli di sistema (unità) e gemelli di processo [52]. Per le decisioni produttive è più utile una suddivisione in gemelli di prodotto, di processo, di asset, di fabbrica, di prestazione e di catena di fornitura (vedi sezione 3). Nessuna di queste classificazioni è standardizzata; la norma ISO/IEC 30173 descrive i tipi di gemello solo a livello generale [9].

### Qual è la differenza tra un gemello digitale e un'ombra digitale?
Secondo Kritzinger et al., in un'ombra digitale i dati fluiscono automaticamente dall'oggetto fisico a quello digitale, ma il percorso di ritorno è manuale. In un gemello digitale i dati fluiscono automaticamente in entrambe le direzioni [5]. Un modello digitale non prevede alcno scambio automatico di dati.

### Quali sono esempi di gemelli digitali nella produzione?
Esempi tipici sono un modello di fabbrica che confronta varianti di layout prima dell'approvazione di un nuovo edificio, una simulazione alimentata quotidianamente da ERP e MES che verifica se la pianificazione della settimana regge, un modello di virtual commissioning che collauda il codice PLC prima dell'installazione di una linea, e un modello di flotta di AGV che dimensiona veicoli e ricarica. McKinsey documenta casi come una sequenza di assemblaggio riprogettata con risparmi di costo mensili del 5-7 percento e una sequenza dei colli di bottiglia che ha ridotto i tempi di lavorazione di circa il quattro percento [26].

### Qual è la differenza tra un gemello digitale e una simulazione?
Una simulazione è un modello su cui si eseguono esperimenti. Diventa un'ombra digitale o un gemello digitale quando viene alimentata automaticamente con dati operativi e i suoi risultati tornano a influenzare decisioni o controlli. Molti gemelli digitali contengono una simulazione al proprio nucleo.

### Un modello 3D o un modello BIM è un gemello digitale?
Non di per sé. Una scansione 3D, un layout CAD o un modello di informazioni per l'edilizia (BIM) catturano la geometria. Senza una logica di processo (cicli, tempi, risorse) e una connessione dati con le operazioni, non possono rispondere a domande su capacità o tempi di attraversamento. Possono però costituire un livello utile di un gemello, soprattutto nella pianificazione di layout in impianti esistenti.

### Qual è la differenza tra simulazione di produzione e virtual commissioning?
La simulazione di produzione valuta le operazioni a livello di ordini e risorse (produttività, tempi di attraversamento, colli di bottiglia). Il virtual commissioning collauda il software di controllo di una macchina a livello di segnali, su un modello dell'impianto, prima che l'attrezzatura fisica venga costruita [14].

### Di quali dati ha bisogno un gemello digitale manifatturiero?
Per un gemello di produzione e di fabbrica servono principalmente distinte base, cicli con tempi, centri di lavoro e capacità, turni di lavoro, ordini e conferme. Questi dati provengono soprattutto da ERP e MES. I dati di macchine e sensori migliorano il modello, ma raramente ne costituiscono il punto di partenza.

### È possibile costruire un gemello digitale a partire dai dati ERP?
Sì. Per le questioni di capacità, tempi di attraversamento e schedulazione, il sistema ERP è la fonte più importante. Contiene dati di prodotto, processo e risorse in forma strutturata. Un controllo della qualità dei dati è essenziale, perché i tempi standard e di attrezzaggio spesso si discostano dalla realtà.

### Quale tipo di simulazione si usa nella produzione?
Soprattutto la simulazione a eventi discreti, il cui orologio salta da un evento all'altro. La dinamica dei sistemi si aggiunge per questioni strategiche, la simulazione ad agenti per veicoli e persone, e la simulazione 3D basata sulla fisica per celle robotizzate e collaudo dei controlli.

### Quanto deve essere accurato un gemello digitale?
Abbastanza accurato per la decisione che supporta, e non di più. Valida il modello con dati reali per le metriche che contano (ad esempio produttività o tempi di attraversamento), documenta le ipotesi ed esegui analisi di sensibilità. NIST sta lavorando a un quadro di verifica, validazione e quantificazione dell'incertezza per i gemelli manifatturieri [48].

### Quali standard si applicano ai gemelli digitali nella produzione?
Gli standard fondamentali sono ISO 23247 (framework per i gemelli digitali nella manifattura, Parti da 1 a 6) [6][7][8], ISO/IEC 30173 (terminologia) [9], IEC 63278-1 (Asset Administration Shell) [10] e ISA-95 / IEC 62264 [58]. Per la sicurezza, si usano ISA/IEC 62443 [59] e NIST SP 800-82 [55]. NIST AMS 400-2 mostra come applicare ISO 23247 [47]. Le linee guida tedesche (VDI 3633 per la simulazione, VDI/VDE 3693 per il virtual commissioning, VDI 4499 per la fabbrica digitale) aggiungono dettagli metodologici [13][14][16].

### I gemelli digitali sono adatti a piccole e medie imprese manifatturiere?
Sì, se si parte da una domanda chiaramente circoscritta. Un pilota per un value stream o un'area, basato sui dati ERP esistenti, richiede molto meno impegno di un progetto IoT esteso all'intero stabilimento e produce un beneficio verificabile più rapidamente. Il rapporto NIST sui casi d'uso di ISO 23247 si rivolge proprio a questo gruppo [47], e i centri NIST MEP offrono supporto esterno [60].

### Quanto costa un gemello digitale?
Dipende dal perimetro, dalla situazione dei dati e dal livello di integrazione. Le voci di costo più rilevanti sono di solito la preparazione dei dati, la modellazione, la validazione e la manutenzione, non il software. Una società tedesca di servizi di simulazione indica come regola empirica al massimo l'1 percento dell'investimento interessato per gli studi di simulazione [30].

### Quanto tempo richiede l'implementazione?
McKinsey indica un intervallo da due-tre mesi a oltre un anno per i progetti di gemello digitale, a seconda delle competenze del team e della complessità dello stabilimento [26]. Un pilota focalizzato su una decisione concreta è di solito realizzabile in pochi mesi.

### In che modo un gemello digitale aiuta a pianificare le flotte di AGV e AMR?
Simula i veicoli con percorsi carichi, percorsi a vuoto, tempi di attesa, conflitti agli incroci e pause di ricarica. In questo modo si determinano il numero di veicoli, i percorsi e la strategia di ricarica, aspetti che un calcolo statico sottostima regolarmente.

### Che ruolo gioca l'intelligenza artificiale?
L'AI aiuta a preparare i dati, accelera le simulazioni tramite modelli surrogati, apprende regole di controllo all'interno del modello e rende i gemelli utilizzabili tramite linguaggio naturale. Richiede un modello validato e dati puliti.

### Azure Digital Twins è la stessa cosa di digital twin builder in Fabric?
No. Microsoft afferma esplicitamente che si tratta di servizi diversi [21][23]. Azure Digital Twins è un servizio PaaS per grafi di gemelli con DTDL; digital twin builder è uno strumento di ontologia e mappatura in Microsoft Fabric ed è in anteprima alla data di questo testo [23].

### Chi ha inventato il gemello digitale?
Il concetto risale a Michael Grieves, che lo presentò nel 2002 nel contesto della gestione del ciclo di vita del prodotto; Grieves attribuisce il nome "digital twin" a John Vickers della NASA [1][2]. Altri autori indicano precursori precedenti, ad esempio nella ricerca sulla produzione virtuale [4].

## 20. Conclusione

Il gemello digitale in produzione è meno una tecnologia nuova che la combinazione coerente di tre elementi consolidati: un modello strutturato di prodotti, processi e risorse; una simulazione che cattura dinamiche e variabilità; e un flusso di dati proveniente dalle operazioni reali. Gli standard esistono, dalla ISO 23247 e dalla ISA-95 fino alla Asset Administration Shell; il NIST fornisce linee guida di implementazione per gli Stati Uniti, e il metodo della simulazione di fabbrica è stato sperimentato per decenni.

L'errore più comune non è la tecnologia sbagliata, ma la mancanza di uno scopo. Partite da una decisione che oggi si basa troppo spesso sull'intuito o su un foglio di calcolo: un investimento di capitale, un nuovo mix di prodotti, una flotta di AGV, un piano settimanale che regolarmente non regge. Verificate con onestà i dati del vostro ERP, costruite un modello pilota validato e poi decidete quale livello di integrazione giustifichi il passo successivo. È così che si ottiene un gemello che non si limita a essere valido nell'aspetto, ma migliora le decisioni.

## Ulteriori letture su m365.fm

**Post del blog ed episodi**

- [Gemello digitale in produzione: da dove iniziare](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/)
- [Dall'ERP al reparto produttivo: il gemello digitale](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Episodio: Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/)
- [Episodio: Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Pagine delle entità**

- [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Virtual Commissioning](https://www.m365.fm/entity/virtual-commissioning/) · [Automated Guided Vehicle](https://www.m365.fm/entity/automated-guided-vehicle/) · [Industry 4.0](https://www.m365.fm/entity/industry-4-0/)
- [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/)
- [iFAKT](https://www.m365.fm/entity/ifakt/) · [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) · [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/)

**Guide correlate**

- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Production Scheduling Software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** è il conduttore di m365.fm e lavora presso iFAKT GmbH. Su m365.fm scrive di digitalizzazione della produzione con Microsoft 365 e Azure, metodi di value stream, pianificazione della produzione e gemelli digitali. Il suo focus è su come ricavare modelli affidabili per la pianificazione e le decisioni di investimento a partire dai dati ERP e di value stream esistenti.

**Nota: l'autore lavora presso iFAKT GmbH.**

# Sources

All online sources accessed on November 20, 2026. Sources [1] to [46] are carried over from the German version; [47] to [61] are new US/English sources, each opened and verified for this version.

1. Grieves, M.; Vickers, J. (2017): Digital Twin: Mitigating Unpredictable, Undesirable Emergent Behavior in Complex Systems. In: Kahlen, F.-J.; Flumerfelt, S.; Alves, A. (eds.): Transdisciplinary Perspectives on Complex Systems. Springer, Cham. DOI: [10.1007/978-3-319-38756-7_4](https://doi.org/10.1007/978-3-319-38756-7_4)
2. Grieves, M.: Digital and Physical Twins (book chapter, provided in the ASME resource library). https://event.asme.org/Events/media/library/resources/digital-twin/Digital-and-Physical-Twins.pdf
3. Glaessgen, E. H.; Stargel, D. S. (2012): The Digital Twin Paradigm for Future NASA and U.S. Air Force Vehicles. 53rd AIAA/ASME/ASCE/AHS/ASC Structures, Structural Dynamics and Materials Conference, Honolulu, April 23–26, 2012. NASA Technical Reports Server 20120008178. https://ntrs.nasa.gov/citations/20120008178
4. Zhou, J.; Zhang, S.; Gu, M. (2022): Revisiting Digital Twins: Origins, Fundamentals and Practices. arXiv:2203.12867 (with reference to Shafto et al. 2010, NASA Modeling, Simulation, Information Technology & Processing Roadmap). https://arxiv.org/abs/2203.12867
5. Kritzinger, W.; Karner, M.; Traar, G.; Henjes, J.; Sihn, W. (2018): Digital Twin in manufacturing: A categorical literature review and classification. IFAC-PapersOnLine 51(11), pp. 1016–1022. DOI: [10.1016/j.ifacol.2018.08.474](https://doi.org/10.1016/j.ifacol.2018.08.474)
6. ISO 23247-1:2021 Automation systems and integration: Digital twin framework for manufacturing, Part 1: Overview and general principles (Parts 2 to 4 also 2021). Catalog entry: https://iteh.eu/catalog/standards/iso/7df6fef2-6487-43da-9a48-eaba332a9ffc/iso-23247-1-2021
7. ISO 23247-5 Automation systems and integration: Digital twin framework for manufacturing, Part 5: Digital thread for digital twin (Edition 1, 2026-06; status "under publication" when checked on November 20, 2026). https://www.iso.org/standard/87425.html
8. ISO 23247-6:2026 Automation systems and integration: Digital twin framework for manufacturing, Part 6: Digital twin composition (published July 14, 2026, stage 60.60). https://committee.iso.org/standard/87426.html
9. ISO/IEC 30173:2023 Digital twin: Concepts and terminology (November 2023). https://www.iso.org/standard/81442.html
10. IEC 63278-1:2023 Asset Administration Shell for industrial applications, Part 1: Asset Administration Shell structure (December 14, 2023). https://webstore.iec.ch/en/publication/65628
11. ZVEI (2020): User organization Industrial Digital Twin Association founded (founded September 24, 2020). https://www.zvei.org/en/press-media/pressarea/user-organization-industrial-digital-twin-association-founded
12. DIN SPEC 91345:2016-04 Reference Architecture Model Industrie 4.0 (RAMI4.0). https://www.dinmedia.de/de/technische-regel/din-spec-91345/250940128
13. VDI 3633 Part 1:2014-12 Simulation of systems in materials handling, logistics and production: Fundamentals. https://vdi.de/richtlinien/details/vdi-3633-blatt-1-simulation-of-systems-in-materials-handling-logistics-and-production-fundamentals ; VDI 3633 Part 8 (machine-oriented simulation, 3D motion and process simulation): https://www.vdi.de/mitgliedschaft/vdi-richtlinien/details/vdi-3633-blatt-8-simulation-of-systems-in-materials-handling-logistics-and-production-machine-oriented-simulation-3d-motion-and-process-simulation
14. VDI/VDE 3693 Part 1:2016-08 Virtual commissioning: Model types and glossary. https://vdi.de/richtlinien/details/vdivde-3693-blatt-1-virtual-commissioning-model-types-and-glossary
15. VDI/VDE 3693 Part 2:2018-12 Virtual commissioning: Introduction of virtual commissioning in companies; revision announced. https://vdi.de/en/home/vdi-standards/details/vdivde-3693-blatt-2-virtual-commissioning-introduction-of-virtual-commissioning-in-companies ; edition history: https://dinmedia.de/en/draft-technical-rule/vdi-vde-3693-blatt-2/276110751
16. VDI 4499 Part 1:2026-04 Digital factory: Fundamentals. https://vdi.de/richtlinien/details/vdi-4499-blatt-1-digital-factory-fundamentals
17. University of Duisburg-Essen, Chair VIP: lecture notes "Digitale Fabrik" (quotes the definition from VDI 4499 Part 1:2008; in German). https://www.uni-due.de/imperia/md/content/vip/scriptum_digitalefabrik.pdf
18. VDI 2510:2005-10 Automated guided vehicle systems (AGVS). https://vdi.de/richtlinien/details/vdi-2510-automated-guided-vehicle-systems-agvs ; draft VDI 2510:2025-07: https://www.dinmedia.de/de/technische-regel-entwurf/vdi-2510/388587666
19. OPC Foundation: OPC 10030 ISA-95 Common Object Model, section 4.2.3 ISA-95. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3
20. Schuh, G.; Anderl, R.; Dumitrescu, R.; Krüger, A.; ten Hompel, M. (2020): Industrie 4.0 Maturity Index. Managing the Digital Transformation of Companies. Update 2020 (acatech STUDY). https://en.acatech.de/publication/industrie-4-0-maturity-index-update-2020/
21. Microsoft Learn: What is Azure Digital Twins? https://learn.microsoft.com/azure/digital-twins/overview
22. Microsoft Learn: Learn about twin models and how to define them in Azure Digital Twins (DTDL v2 and v3). https://learn.microsoft.com/en-ca/azure/digital-twins/concepts-models
23. Microsoft Learn: What Is Digital Twin Builder (Preview)? (last updated May 20, 2026; preview label re-checked November 20, 2026). https://learn.microsoft.com/en-us/fabric/real-time-intelligence/digital-twin-builder/overview
24. Microsoft Fabric Blog: Digital twin builder in Microsoft Fabric Real-Time Intelligence. https://blog.fabric.microsoft.com/en-us/blog/digital-twin-builder-in-microsoft-fabric-real-time-intelligence-revolutionizing-digital-twin-creation-and-management
25. NVIDIA Blog (March 31, 2025): Industrial Ecosystem Adopts Mega NVIDIA Omniverse Blueprint to Train Physical AI in Digital Twins. https://blogs.nvidia.com/blog/mega-omniverse-blueprint-industrial-digital-twins/
26. Camarella, S.; Conway, M. P.; Goering, K.; Huntington, M. (2024): Digital twins: The next frontier of factory optimization. McKinsey & Company, January 10, 2024. https://www.mckinsey.com/capabilities/operations/our-insights/digital-twins-the-next-frontier-of-factory-optimization
27. Fraunhofer IWU (2024): Sächsische Maschinenbauer nutzen Vorteile der Virtuellen Inbetriebnahme oft noch nicht (press release on the SaxoVI study, August 13, 2024; in German). https://www.iwu.fraunhofer.de/content/dam/iwu/de/documents/Presse/2024-Saechsische-Maschinenbauer-nutzen-Vorteile-der-Virtuellen-Inbetriebnahme-oft-noch-nicht.pdf
28. Poll, D. (2021): Digitalisierung bei ZF: Neue Methode spart 30 Prozent Zeit. produktion.de, June 16, 2021 (in German). https://www.produktion.de/technik/digitalisierung-bei-zf-neue-methode-spart-30-prozent-zeit/1656151
29. Fraunhofer IESE: Digitaler Zwilling in der Produktion & Industrie 4.0 (in German). https://www.iese.fraunhofer.de/de/leistungen/digitaler-zwilling.html
30. SimPlan AG: FAQ Simulation (definition according to VDI 3633, cost-benefit rules of thumb). https://www.simplan.de/en/knowledge/faq-simulation-en
31. Türck, S.; Weimer, A.; Schubert, L.; Drees, J. (2014): Dynamische Simulation von Wertströmen [Dynamic simulation of value streams]. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 109(11), pp. 839–842. DOI: [10.3139/104.111242](https://doi.org/10.3139/104.111242)
32. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (2023): Universelle Datenschnittstelle für digitale Wertstromdienste [Universal data interface for digital value stream services]. ZWF 118(5), pp. 293–297. DOI: [10.1515/zwf-2023-1062](https://doi.org/10.1515/zwf-2023-1062)
33. iFAKT GmbH: Polaris Designer (product page). https://www.ifakt.de/en/solutions/designer
34. iFAKT GmbH: Polaris Simulator (product page). https://www.ifakt.de/en/solutions/simulator
35. iFAKT GmbH: home page (company and Polaris platform). https://www.ifakt.de/
36. European Commission: Cyber Resilience Act, summary (Regulation (EU) 2024/2847). https://digital-strategy.ec.europa.eu/en/policies/cra-summary
37. Little, J. D. C. (1961): A Proof for the Queuing Formula: L = λW. Operations Research 9(3), pp. 383–387. DOI: [10.1287/opre.9.3.383](https://doi.org/10.1287/opre.9.3.383)
38. Forrester, J. W. (1961): Industrial Dynamics. MIT Press, Cambridge, MA.
39. Goldratt, E. M.; Cox, J. (1984): The Goal: A Process of Ongoing Improvement. North River Press.
40. Rother, M.; Shook, J. (1998): Learning to See: Value Stream Mapping to Add Value and Eliminate Muda. Lean Enterprise Institute, Brookline, MA.
41. Law, A. M. (2015): Simulation Modeling and Analysis. 5th ed., McGraw-Hill Education, New York.
42. SYMESTIC: Was ist ISA-95? (level model, relation to IEC 62264; in German). https://www.symestic.com/de-de/was-ist/isa-95
43. Umbrex: ISO 23247 Digital Twin Framework for Manufacturing (overview of parts and reference architecture). https://umbrex.com/resources/frameworks/manufacturing-industrial-equipment-frameworks/iso-23247-digital-twin-framework-for-manufacturing/
44. NEURONwriter: analysis "digitaler zwilling fertigung", google.de, query f5135b90c13e4c59 (internal analysis for the German version, accessed November 20, 2026).
45. NEURONwriter: analysis "produktionssimulation", google.de, query 3ee168d2a2cb38f1 (internal analysis for the German version, accessed November 20, 2026).
46. Kingman, J. F. C. (1961): The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57(4), pp. 902 ff. DOI: [10.1017/S0305004100036094](https://doi.org/10.1017/S0305004100036094)
47. Shao, G. (2021): Use Case Scenarios for Digital Twin Implementation Based on ISO 23247. NIST Advanced Manufacturing Series (NIST AMS) 400-2, May 4, 2021. DOI: [10.6028/NIST.AMS.400-2](https://doi.org/10.6028/NIST.AMS.400-2); publication page: https://www.nist.gov/publications/use-case-scenarios-digital-twin-implementation-based-iso-23247
48. NIST: Digital Twins for Advanced Manufacturing (project page; ISO 23247 Part 5 reference implementation, proposed VVUQ framework as Part 7, MTConnect interface, NIST Digital Twin Testbed). https://nist.gov/programs-projects/digital-twins-advanced-manufacturing
49. Voas, J.; Mell, P.; Laplante, P.; Piroumian, V. (2025): Security and Trust Considerations for Digital Twin Technology. NIST IR 8356 (final), February 14, 2025 (initial public draft 2021 titled "Considerations for Digital Twin Technology and Emerging Standards"). DOI: [10.6028/NIST.IR.8356](https://doi.org/10.6028/NIST.IR.8356); https://csrc.nist.gov/pubs/ir/8356/final
50. National Academies of Sciences, Engineering, and Medicine (2024): Foundational Research Gaps and Future Directions for Digital Twins. Consensus Study Report, The National Academies Press, Washington, DC (definition and quotes on p. 22). https://www.nationalacademies.org/our-work/foundational-research-gaps-and-future-directions-for-digital-twins ; chapter: https://www.nationalacademies.org/read/26894/chapter/4
51. Digital Twin Consortium (2020): Digital Twin Consortium Defines Digital Twin (definition released December 3, 2020). https://www.digitaltwinconsortium.org/2020/12/digital-twin-consortium-defines-digital-twin ; current definition page: https://www.digitaltwinconsortium.org/initiatives/the-definition-of-a-digital-twin/
52. IBM: What Is a Digital Twin? (component, asset, system and process twins). https://www.ibm.com/think/topics/what-is-a-digital-twin
53. ANSI/ITSDF B56.5-2024: Safety Standard for Guided Industrial Vehicles. ANSI Blog summary: https://blog.ansi.org/ansi/ansi-itsdf-b56-5-2024-guided-industrial-vehicles/
54. ANSI/A3 R15.08-1-2020 (R2026): Industrial Mobile Robots, Safety Requirements, Part 1: Requirements for the Industrial Mobile Robot (reaffirmed 2026, no technical changes). ANSI Webstore: https://webstore.ansi.org/standards/ria/ansia3r15082020r2026
55. Stouffer, K. et al. (2023): Guide to Operational Technology (OT) Security. NIST SP 800-82 Rev. 3, September 28, 2023. DOI: [10.6028/NIST.SP.800-82r3](https://doi.org/10.6028/NIST.SP.800-82r3); https://csrc.nist.gov/pubs/sp/800/82/r3/final
56. Deloitte (2025): 2025 Smart Manufacturing and Operations Survey, press release May 1, 2025 (600 executives, US manufacturers with $500 million+ revenue, survey August–September 2024). https://www.deloitte.com/us/en/about/press-room/deloitte-2025-smart-manufacturing-survey.html
57. MTConnect Institute: MTConnect Standard, ANSI/MTC1.4-2018, Part 1.0 Overview and Fundamentals, Version 1.4.0. https://docs.mtconnect.org/ANSI_MTC1_4-2018.pdf ; about MTConnect: https://www.mtconnect.org/about
58. International Society of Automation (ISA): ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264). https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
59. International Society of Automation (ISA): ISA/IEC 62443 Series of Standards. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
60. NIST: Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep
61. Federal Trade Commission: Guides Concerning the Use of Endorsements and Testimonials in Advertising, 16 CFR Part 255, § 255.5 (disclosure of material connections, including an employee example); FTC notice on the revised Guides. https://www.ftc.gov/system/files/ftc_gov/pdf/P204500%20Guides%20Concerning%20Endors%20and%20Testimonials.pdf
